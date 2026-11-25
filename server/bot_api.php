<?php
declare(strict_types=1);
require_once __DIR__ . '/api/cors.php';
hamahdi_apply_mobile_cors(false);


// PHP 7.4 Compatibility Polyfills
if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool {
        return $needle === '' || strpos($haystack, $needle) === 0;
    }
}
if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}
if (!function_exists('str_ends_with')) {
    function str_ends_with(string $haystack, string $needle): bool {
        if ($needle === '') return true;
        $len = strlen($needle);
        return substr($haystack, -$len) === $needle;
    }
}

ob_start();
ini_set('display_errors', '0');
error_reporting(E_ALL);
date_default_timezone_set('Asia/Tehran');

// محافظ خروجی JSON در برابر هرگونه Fatal Error احتمالی سرور
register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR], true)) {
        while (ob_get_level() > 0) { @ob_end_clean(); }
        if (!headers_sent()) {
            header('Content-Type: application/json; charset=utf-8');
            http_response_code(200);
        }
        echo json_encode([
            'ok'    => false,
            'error' => 'خطای سرور PHP: ' . $err['message'] . ' (فایل ' . basename((string)$err['file']) . ' خط ' . $err['line'] . ')'
        ], JSON_UNESCAPED_UNICODE);
    }
});

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Content-Type-Options: nosniff');

// بارگذاری مستقل تنظیمات و کلاینت‌های تست‌شده phpbot (بدون وابستگی به PDO/SQLite/auth)
if (is_file(__DIR__ . '/config.php')) {
    require_once __DIR__ . '/config.php';
}
$config = require __DIR__ . '/api/bot/config.php';

require_once __DIR__ . '/api/bot/BaleClient.php';
require_once __DIR__ . '/api/bot/RubikaClient.php';
require_once __DIR__ . '/api/bot/EitaaClient.php';
require_once __DIR__ . '/api/bot/TelegramClient.php';
require_once __DIR__ . '/api/bot/SecurityValidator.php';
require_once __DIR__ . '/api/bot/HistoryLogger.php';

use BalePublisher\BaleClient;
use BalePublisher\RubikaClient;
use BalePublisher\EitaaClient;
use BalePublisher\TelegramClient;
use BalePublisher\SecurityValidator;
use BalePublisher\HistoryLogger;

function sendBotJson(array $payload, int $httpStatus = 200): void
{
    while (ob_get_level() > 0) {
        @ob_end_clean();
    }
    http_response_code($httpStatus);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function maskBotToken(string $token): string
{
    $token = trim($token);
    if ($token === '') return '';
    if (strlen($token) <= 12) return '••••••••';
    return substr($token, 0, 6) . '••••••••••••' . substr($token, -4);
}

function normalizeGlobalChannelKey(string $platform, string $rawChannel): string
{
    $pf = strtolower(trim($platform));
    $clean = preg_replace('/^https?:\/\/[^\/]+\//i', '', trim($rawChannel));
    $clean = strtolower(ltrim(trim((string)$clean, '/'), '@'));
    return $pf . '::' . $clean;
}

function getGlobalRegisteredChannelsFile(array $config): string
{
    $dir = rtrim((string)($config['storage_dir'] ?? (__DIR__ . '/storage/bot_storage')), '/\\');
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    return $dir . '/registered_channels_global.json';
}

function loadGlobalRegisteredChannelsMap(array $config): array
{
    $file = getGlobalRegisteredChannelsFile($config);
    if (!is_file($file)) return [];
    $raw = @file_get_contents($file);
    $dec = $raw ? @json_decode($raw, true) : [];
    return is_array($dec) ? $dec : [];
}

function saveGlobalRegisteredChannelsMap(array $config, array $map): void
{
    $file = getGlobalRegisteredChannelsFile($config);
    @file_put_contents($file, json_encode($map, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}


function resolveEffectiveCredentials(HistoryLogger $logger, array $config, string $platform): array
{
    if ($platform === 'bale') {
        $creds = resolveEffectiveCredentials($logger, $config, 'bale');
        $cfgTok = trim((string)($config['bale_bot_token'] ?? ''));
        if ($cfgTok !== '') $creds['token'] = $cfgTok;
        return $creds;
    }
    if ($platform === 'rubika') {
        $creds = resolveEffectiveCredentials($logger, $config, 'rubika');
        $cfgTok = trim((string)($config['rubika_bot_token'] ?? ''));
        if ($cfgTok !== '') $creds['token'] = $cfgTok;
        return $creds;
    }
    if ($platform === 'telegram') {
        $creds = resolveEffectiveCredentials($logger, $config, 'telegram');
        $cfgTok = trim((string)($config['telegram_bot_token'] ?? ''));
        if ($cfgTok !== '') $creds['token'] = $cfgTok;
        return $creds;
    }
    $creds = resolveEffectiveCredentials($logger, $config, 'eitaa');
    $cfgTok = trim((string)($config['eitaa_bot_token'] ?? ''));
    if ($cfgTok !== '') $creds['token'] = $cfgTok;
    return $creds;
}

function buildBotPlatformStatus(HistoryLogger $logger, array $config): array
{
    $bale = resolveEffectiveCredentials($logger, $config, 'bale');
    $rubika = resolveEffectiveCredentials($logger, $config, 'rubika');
    $eitaa = resolveEffectiveCredentials($logger, $config, 'eitaa');
    $telegram = resolveEffectiveCredentials($logger, $config, 'telegram');

    return [
        'bale' => [
            'is_configured' => ($bale['token'] !== ''),
            'has_token'     => ($bale['token'] !== ''),
            'masked_token'  => maskBotToken($bale['token']),
            'channel_id'    => $bale['channel_id'],
            'bot_name'      => $bale['bot_name'] ?: 'هم‌عهدی',
            'bot_username'  => $bale['bot_username'] ?: 'Hamahdibot',
        ],
        'rubika' => [
            'is_configured' => ($rubika['token'] !== ''),
            'has_token'     => ($rubika['token'] !== ''),
            'masked_token'  => maskBotToken($rubika['token']),
            'channel_id'    => $rubika['channel_id'],
            'bot_name'      => $rubika['bot_name'] ?: 'هم‌عهدی',
            'bot_username'  => $rubika['bot_username'] ?: 'Hamahdibot',
        ],
        'telegram' => [
            'is_configured' => ($telegram['token'] !== ''),
            'has_token'     => ($telegram['token'] !== ''),
            'masked_token'  => maskBotToken($telegram['token']),
            'channel_id'    => $telegram['channel_id'],
            'proxy'         => $telegram['proxy'],
            'bot_name'      => $telegram['bot_name'] ?: 'هم‌عهدی',
            'bot_username'  => $telegram['bot_username'] ?: 'Hamahdibot',
        ],
        'eitaa' => [
            'is_configured' => ($eitaa['token'] !== ''),
            'has_token'     => ($eitaa['token'] !== ''),
            'masked_token'  => maskBotToken($eitaa['token']),
            'channel_id'    => $eitaa['channel_id'],
            'bot_name'      => $eitaa['bot_name'],
            'bot_username'  => $eitaa['bot_username'],
        ],
        'limits' => [
            'max_caption' => (int)($config['max_caption_length'] ?? 4096),
            'max_size_mb' => round(((int)($config['max_file_size_bytes'] ?? 26214400)) / (1024 * 1024), 1),
        ],
    ];
}

function tryScrapePublicChannelMemberCount(string $channelUrl): ?int
{
    if (!function_exists('curl_init')) return null;
    try {
        $ch = curl_init($channelUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 5,
            CURLOPT_CONNECTTIMEOUT => 3,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        ]);
        $html = (string)curl_exec($ch);
        curl_close($ch);
        if ($html === '') return null;
        if (preg_match('/([0-9][0-9\s,\.]*)\s*(?:members|subscribers|نفر|عضو|دنبال‌کننده)/iu', $html, $m)) {
            $numStr = preg_replace('/[^0-9]/', '', $m[1]);
            if ($numStr !== '' && (int)$numStr > 0) return (int)$numStr;
        }
        if (preg_match('/([0-9]+(?:\.[0-9]+)?)\s*[kK]\s*(?:members|subscribers|نفر|عضو)/iu', $html, $mk)) {
            return (int)round(((float)$mk[1]) * 1000);
        }
    } catch (Throwable $e) {}
    return null;
}

function createEphemeralBotMedia(array $config, ?array $fileUpload, string $base64Data = '', string $explicitMediaType = ''): array
{
    $ephemeralDir = sys_get_temp_dir();

    if ($fileUpload && isset($fileUpload['error']) && $fileUpload['error'] === UPLOAD_ERR_OK && !empty($fileUpload['tmp_name'])) {
        $tmpPath = (string)$fileUpload['tmp_name'];
        $origName = basename((string)($fileUpload['name'] ?? 'media_file'));
        $fileSize = (int)($fileUpload['size'] ?? 0);
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        $mime = strtolower((string)($fileUpload['type'] ?? 'application/octet-stream'));

        if ($fileSize <= 0 || $fileSize > (int)($config['max_file_size_bytes'] ?? 26214400)) {
            throw new Exception('حجم فایل خارج از محدوده مجاز است.');
        }

        $detectedCategory = 'image';
        if (in_array($ext, ['mp4', 'webm', 'mov', 'mkv'], true) || str_starts_with($mime, 'video/')) {
            $detectedCategory = 'video';
            if (!$ext) $ext = 'mp4';
        } elseif (in_array($ext, ['mp3', 'ogg', 'wav', 'm4a', 'aac'], true) || str_starts_with($mime, 'audio/')) {
            $detectedCategory = 'audio';
            if (!$ext) $ext = 'mp3';
        } else {
            if (!$ext) $ext = 'jpg';
        }
        if ($explicitMediaType && in_array($explicitMediaType, ['image', 'video', 'audio'], true)) {
            $detectedCategory = $explicitMediaType;
        }

        $ephemeralPath = rtrim($ephemeralDir, '/\\') . '/ahdbot_tmp_' . bin2hex(random_bytes(6)) . '.' . $ext;
        if (!@move_uploaded_file($tmpPath, $ephemeralPath) && !@copy($tmpPath, $ephemeralPath)) {
            $ephemeralPath = $tmpPath;
        }
        return [
            'has_file'       => true,
            'media_category' => $detectedCategory,
            'original_name'  => $origName,
            'file_path'      => $ephemeralPath,
            'mime_type'      => $mime,
            'file_size'      => $fileSize,
        ];
    }

    if ($base64Data !== '' && preg_match('/^data:([a-zA-Z0-9+\/-]+);base64,(.+)$/i', $base64Data, $m)) {
        $mime = strtolower(trim($m[1]));
        $binary = base64_decode($m[2], true);
        if ($binary !== false && strlen($binary) > 32) {
            $detectedCategory = 'image';
            $ext = 'jpg';
            if (str_starts_with($mime, 'video/')) {
                $detectedCategory = 'video';
                $ext = str_contains($mime, 'webm') ? 'webm' : 'mp4';
            } elseif (str_starts_with($mime, 'audio/')) {
                $detectedCategory = 'audio';
                $ext = str_contains($mime, 'ogg') ? 'ogg' : (str_contains($mime, 'wav') ? 'wav' : 'mp3');
            } else {
                $ext = str_contains($mime, 'png') ? 'png' : (str_contains($mime, 'webp') ? 'webp' : 'jpg');
            }
            if ($explicitMediaType && in_array($explicitMediaType, ['image', 'video', 'audio'], true)) {
                $detectedCategory = $explicitMediaType;
            }
            $ephemeralPath = rtrim($ephemeralDir, '/\\') . '/ahdbot_tmp_' . bin2hex(random_bytes(6)) . '.' . $ext;
            if (@file_put_contents($ephemeralPath, $binary) !== false) {
                return [
                    'has_file'       => true,
                    'media_category' => $detectedCategory,
                    'original_name'  => 'media.' . $ext,
                    'file_path'      => $ephemeralPath,
                    'mime_type'      => $mime,
                    'file_size'      => strlen($binary),
                ];
            }
        }
    }

    return [
        'has_file'       => false,
        'media_category' => 'text',
        'original_name'  => 'پیام متنی',
        'file_path'      => '',
        'mime_type'      => 'text/plain',
        'file_size'      => 0,
    ];
}

try {
    $logger = new HistoryLogger($config['storage_dir']);
    $action = (string)($_GET['action'] ?? 'init');

    switch ($action) {
        case 'init':
            sendBotJson([
                'ok'         => true,
                'csrf_token' => SecurityValidator::getCsrfToken(),
                'platforms'  => buildBotPlatformStatus($logger, $config),
                'history'    => $logger->getHistory(50),
            ]);
            break;


        case 'diagnose':
            $diag = [
                'ok'          => true,
                'version'     => '4.0.2',
                'php_version' => PHP_VERSION,
                'curl_loaded' => function_exists('curl_init'),
                'platforms'   => [],
            ];
            foreach (['bale', 'rubika', 'eitaa', 'telegram'] as $pf) {
                $c = resolveEffectiveCredentials($logger, $config, $pf);
                $info = [
                    'has_token'    => ($c['token'] !== ''),
                    'masked_token' => maskBotToken($c['token']),
                    'getMe_ok'     => false,
                    'detail'       => '',
                ];
                if ($c['token'] !== '') {
                    try {
                        if ($pf === 'bale') {
                            $me = (new BaleClient($c['token'], $config['bale_api_base'], 10))->getMe();
                        } elseif ($pf === 'rubika') {
                            $me = (new RubikaClient($c['token'], $config['rubika_api_base'], 10, 1))->getMe();
                        } elseif ($pf === 'eitaa') {
                            $me = (new EitaaClient($c['token'], $config['eitaa_api_base'], 10))->getMe();
                        } else {
                            $me = (new TelegramClient($c['token'], $c['proxy'] ?? '', $config['telegram_api_base'], 10))->getMe();
                        }
                        $info['getMe_ok'] = !empty($me['ok']);
                        $info['detail']   = ($me['username'] ?? $me['first_name'] ?? 'OK');
                    } catch (Throwable $de) {
                        $info['detail'] = $de->getMessage();
                    }
                } else {
                    $info['detail'] = 'توکن در config.php وارد نشده است.';
                }
                $diag['platforms'][$pf] = $info;
            }
            sendBotJson($diag);
            break;

        case 'unregister_global_channel':
            $rawBody = file_get_contents('php://input');
            $in = $rawBody ? (json_decode($rawBody, true) ?? []) : $_POST;
            $pf = strtolower(trim((string)($in['platform'] ?? '')));
            $chId = trim((string)($in['channel_id'] ?? ''));
            if ($pf !== '' && $chId !== '') {
                $gMap = loadGlobalRegisteredChannelsMap($config);
                $gKey = normalizeGlobalChannelKey($pf, $chId);
                if (isset($gMap[$gKey])) {
                    unset($gMap[$gKey]);
                    saveGlobalRegisteredChannelsMap($config, $gMap);
                }
            }
            sendBotJson(['ok' => true]);
            break;

        case 'auto_verify_channel':
        case 'check_channel_members':
        case 'verify_bot_admin_in_channel':
            $rawBody = file_get_contents('php://input');
            $in = $rawBody ? (json_decode($rawBody, true) ?? []) : $_POST;
            $platform = strtolower(trim((string)($in['platform'] ?? 'bale')));
            if (!in_array($platform, ['bale', 'rubika', 'eitaa', 'telegram'], true)) {
                sendBotJson(['ok' => false, 'error' => 'فقط ۴ شبکه روبیکا، بله، ایتا و تلگرام پشتیبانی می‌شوند.']);
            }
            $targetType = strtolower(trim((string)($in['target_type'] ?? 'channel')));
            $rawCh = trim((string)($in['channel_id'] ?? ''));
            $eitaaToken = trim((string)($in['eitaa_token'] ?? ''));
            $ownerUname = trim((string)($in['owner_username'] ?? 'resident'));
            $isAdminReq = !empty($in['is_admin']);

            if ($rawCh === '') {
                sendBotJson(['ok' => false, 'error' => 'لطفاً آیدی کانال یا گروه را وارد کنید.']);
            }
            if ($platform === 'eitaa' && $eitaaToken === '') {
                sendBotJson(['ok' => false, 'auto_approved' => false, 'eligible' => false, 'error' => 'برای ثبت کانال ایتا، لطفاً توکن ایتایار را وارد نمایید.']);
            }

            $globalMap = loadGlobalRegisteredChannelsMap($config);
            $gKey = normalizeGlobalChannelKey($platform, $rawCh);
            if (isset($globalMap[$gKey])) {
                sendBotJson([
                    'ok'            => false,
                    'duplicate'     => true,
                    'auto_approved' => false,
                    'eligible'      => false,
                    'error'         => '⛔ این کانال یا گروه قبلاً در سامانه هم‌عهدی ثبت شده است؛ هر کانال یا گروه فقط یک بار قابل ثبت است.'
                ]);
            }

            $cleanHandle = preg_replace('/^https?:\/\/[^\/]+\//i', '', $rawCh);
            $cleanHandle = ltrim(trim((string)$cleanHandle, '/'), '@');
            $domainMap = [
                'bale'     => 'https://ble.ir/',
                'eitaa'    => 'https://eitaa.com/',
                'rubika'   => 'https://rubika.ir/',
                'telegram' => 'https://t.me/'
            ];
            $channelUrl = preg_match('/^https?:\/\//i', $rawCh) ? $rawCh : (($domainMap[$platform] ?? 'https://ble.ir/') . $cleanHandle);
            $normalizedChatId = str_starts_with(strtolower($cleanHandle), 'c0') || str_starts_with(strtolower($cleanHandle), 'g0') ? $cleanHandle : ('@' . $cleanHandle);

            $detectedMembers = null;
            $liveApiVerified = false;

            try {
                if ($platform === 'bale') {
                    $bCreds = resolveEffectiveCredentials($logger, $config, 'bale');
                    if (!empty($bCreds['token'])) {
                        $bClient = new BaleClient($bCreds['token'], $config['bale_api_base'], 8);
                        $cntRes = $bClient->requestJson('getChatMembersCount', ['chat_id' => $normalizedChatId]);
                        if (isset($cntRes['result']) && is_numeric($cntRes['result'])) {
                            $detectedMembers = (int)$cntRes['result'];
                            $liveApiVerified = true;
                        }
                    }
                } elseif ($platform === 'telegram') {
                    $tCreds = resolveEffectiveCredentials($logger, $config, 'telegram');
                    if (!empty($tCreds['token'])) {
                        $tClient = new TelegramClient($tCreds['token'], $tCreds['proxy'] ?? '', $config['telegram_api_base'], 8);
                        $cntRes = $tClient->requestJson($config['telegram_api_base'] . $tCreds['token'] . '/getChatMemberCount', ['chat_id' => $normalizedChatId]);
                        if (isset($cntRes['result']) && is_numeric($cntRes['result'])) {
                            $detectedMembers = (int)$cntRes['result'];
                            $liveApiVerified = true;
                        }
                    }
                } elseif ($platform === 'rubika') {
                    $rCreds = resolveEffectiveCredentials($logger, $config, 'rubika');
                    if (!empty($rCreds['token'])) {
                        $rClient = new RubikaClient($rCreds['token'], $config['rubika_api_base'], 8, 1);
                        $chatRes = $rClient->getChat(RubikaClient::normalizeChatId($rawCh));
                        if (($chatRes['status'] ?? '') === 'OK' && !empty($chatRes['data']['chat'])) {
                            $liveApiVerified = true;
                            if (isset($chatRes['data']['chat']['count_members'])) {
                                $detectedMembers = (int)$chatRes['data']['chat']['count_members'];
                            }
                        }
                    }
                } elseif ($platform === 'eitaa') {
                    $tokToCheck = $eitaaToken ?: ($config['eitaa_bot_token'] ?? '');
                    if ($tokToCheck !== '') {
                        $eClient = new EitaaClient($tokToCheck, $config['eitaa_api_base'], 8);
                        $me = $eClient->getMe();
                        if (!empty($me['ok'])) $liveApiVerified = true;
                    }
                }
            } catch (Throwable $apiEx) {}

            if ($detectedMembers === null) {
                $scraped = tryScrapePublicChannelMemberCount($channelUrl);
                if ($scraped !== null && $scraped > 0) $detectedMembers = $scraped;
            }

            $targetFa = ($targetType === 'group') ? 'گروه' : 'کانال';

            if ($isAdminReq) {
                $finalMembers = $detectedMembers !== null ? (int)$detectedMembers : 0;
                $isEligible = true;
                $statusMsg = $finalMembers >= 500
                    ? "✅ تایید مدیریت: {$targetFa} «{$normalizedChatId}» با " . number_format($finalMembers) . " عضو تایید و ثبت شد."
                    : "✅ تایید با مجوز ادمین: {$targetFa} «{$normalizedChatId}» با دسترسی مدیریت ثبت گردید.";
            } else {
                if ($detectedMembers === null) {
                    sendBotJson([
                        'ok'            => false,
                        'auto_approved' => false,
                        'eligible'      => false,
                        'error'         => "❌ ربات @Hamahdibot نتوانست تعداد اعضای {$targetFa} «{$normalizedChatId}» را استعلام کند. از ادمین بودن @Hamahdibot و تنظیم توکن در config.php مطمئن شوید."
                    ]);
                }
                $finalMembers = (int)$detectedMembers;
                $isEligible = ($finalMembers >= 500);
                $statusMsg = $isEligible
                    ? "✅ تایید خودکار: {$targetFa} «{$normalizedChatId}» با " . number_format($finalMembers) . " عضو تایید و ثبت شد."
                    : "❌ رد خودکار: تعداد اعضای واقعی {$targetFa} «{$normalizedChatId}» برابر با " . number_format($finalMembers) . " نفر است (کمتر از ۵۰۰ عضو).";
            }

            if ($isEligible) {
                $globalMap[$gKey] = [
                    'platform'       => $platform,
                    'channel_id'     => $normalizedChatId,
                    'owner_username' => $ownerUname,
                    'members_count'  => $finalMembers,
                    'registered_at'  => date('Y-m-d H:i:s')
                ];
                saveGlobalRegisteredChannelsMap($config, $globalMap);
            }

            sendBotJson([
                'ok'            => true,
                'platform'      => $platform,
                'target_type'   => $targetType,
                'channel_id'    => $normalizedChatId,
                'channel_url'   => $channelUrl,
                'auto_approved' => $isEligible,
                'eligible'      => $isEligible,
                'live_api'      => $liveApiVerified,
                'members_count' => $finalMembers,
                'message'       => $statusMsg
            ]);
            break;

        case 'publish':
            $rawBody = file_get_contents('php://input');
            $jsonInput = $rawBody ? (json_decode($rawBody, true) ?? []) : [];
            $postData = !empty($_POST) ? $_POST : $jsonInput;

            $targetsRaw = $postData['targets'] ?? 'bale';
            $targets = is_array($targetsRaw)
                ? $targetsRaw
                : array_values(array_filter(array_map('trim', explode(',', (string)$targetsRaw))));

            $channelOverride = trim((string)($postData['channel_override'] ?? ''));
            $eitaaTokenOverride = trim((string)($postData['eitaa_token'] ?? ''));
            $channelSignature = trim((string)($postData['channel_signature'] ?? ''));
            $title = trim(strip_tags((string)($postData['title'] ?? '')));
            $caption = trim((string)($postData['caption'] ?? ''));
            $explicitType = strtolower(trim((string)($postData['media_type'] ?? '')));
            $base64Media = (string)($postData['media_data'] ?? '');

            $uploadedFileObj = $_FILES['media'] ?? $_FILES['image'] ?? $_FILES['video'] ?? $_FILES['audio'] ?? null;
            $savedMedia = createEphemeralBotMedia($config, $uploadedFileObj, $base64Media, $explicitType);

            $mediaCategory = $savedMedia['media_category'];
            if ($mediaCategory === 'text' && $caption === '' && $title === '') {
                sendBotJson(['ok' => false, 'error' => 'لطفاً متن پیام یا فایل رسانه را وارد نمایید.']);
            }

            $baleCreds = resolveEffectiveCredentials($logger, $config, 'bale');
            $rubikaCreds = resolveEffectiveCredentials($logger, $config, 'rubika');
            $eitaaCreds = resolveEffectiveCredentials($logger, $config, 'eitaa');
            $telegramCreds = resolveEffectiveCredentials($logger, $config, 'telegram');

            $fullTextForBot = ($title !== '' && $caption !== '' && $title !== $caption) ? "📌 {$title}\n\n{$caption}" : ($caption !== '' ? $caption : $title);
            if ($channelSignature !== '' && !str_contains($fullTextForBot, $channelSignature)) {
                $fullTextForBot .= "\n\n━━━━━━━━━━━━━━\n" . $channelSignature;
            }

            $results = [];
            $historyItems = [];
            $successCount = 0;

            try {
                foreach ($targets as $platform) {
                    $platform = strtolower(trim((string)$platform));
                    if (!in_array($platform, ['bale', 'rubika', 'eitaa', 'telegram'], true)) continue;

                    $targetChId = $channelOverride;
                    $msgId = '';
                    $modeUsed = 'error';
                    $platformOk = false;
                    $platformErr = '';

                    try {
                        if ($platform === 'bale') {
                            $rawTarget = $channelOverride !== '' ? $channelOverride : ($baleCreds['channel_id'] ?? '');
                            $targetChId = BaleClient::normalizeChannelId($rawTarget);
                            if (empty($baleCreds['token'])) {
                                throw new Exception('توکن ربات بله (@Hamahdibot) در فایل config.php وارد نشده است.');
                            }
                            if ($targetChId === '') {
                                throw new Exception('آیدی کانال یا گروه بله مشخص نشده است.');
                            }
                            $baleClient = new BaleClient($baleCreds['token'], $config['bale_api_base'], (int)($config['curl_timeout_seconds'] ?? 30));
                            if ($savedMedia['has_file']) {
                                $res = ($mediaCategory === 'image')
                                    ? $baleClient->sendPhotoMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot)
                                    : $baleClient->sendMediaMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot, $mediaCategory);
                            } else {
                                $res = $baleClient->sendMessage($targetChId, $fullTextForBot);
                            }
                            $msgId = (string)($res['message_id'] ?? '');
                            $platformOk = true;
                            $modeUsed = 'live_api';
                        } elseif ($platform === 'rubika') {
                            $rawTarget = $channelOverride !== '' ? $channelOverride : ($rubikaCreds['channel_id'] ?? '');
                            $targetChId = RubikaClient::normalizeChatId($rawTarget);
                            if (empty($rubikaCreds['token'])) {
                                throw new Exception('توکن ربات روبیکا (@Hamahdibot) در فایل config.php وارد نشده است.');
                            }
                            if ($targetChId === '') {
                                throw new Exception('شناسه کانال یا گروه روبیکا مشخص نشده است.');
                            }
                            $rubikaClient = new RubikaClient($rubikaCreds['token'], $config['rubika_api_base'], (int)($config['rubika_timeout'] ?? 25), (int)($config['rubika_max_retries'] ?? 3));
                            if (str_starts_with($targetChId, '@')) {
                                try {
                                    $discovered = $rubikaClient->discoverRecentChats();
                                    $needle = strtolower(ltrim($targetChId, '@'));
                                    foreach ($discovered as $dc) {
                                        $uMatch = strtolower(ltrim((string)($dc['username'] ?? ''), '@'));
                                        if ($uMatch !== '' && $uMatch === $needle && !empty($dc['chat_id'])) {
                                            $targetChId = (string)$dc['chat_id'];
                                            break;
                                        }
                                    }
                                } catch (Throwable $discErr) {}
                            }
                            if ($savedMedia['has_file']) {
                                $res = ($mediaCategory === 'image')
                                    ? $rubikaClient->sendPhotoMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot)
                                    : $rubikaClient->sendMediaMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot, $mediaCategory);
                            } else {
                                $res = $rubikaClient->sendMessage($targetChId, $fullTextForBot);
                            }
                            $msgId = (string)($res['message_id'] ?? '');
                            $platformOk = true;
                            $modeUsed = 'live_api';
                        } elseif ($platform === 'eitaa') {
                            $rawTarget = $channelOverride !== '' ? $channelOverride : ($eitaaCreds['channel_id'] ?? '');
                            $targetChId = EitaaClient::normalizeChannelId($rawTarget);
                            $effectiveEitaaToken = $eitaaTokenOverride !== '' ? $eitaaTokenOverride : ($eitaaCreds['token'] ?? '');
                            if ($effectiveEitaaToken === '') {
                                throw new Exception('توکن ایتایار (eitaayar.ir) برای این کانال وارد نشده است.');
                            }
                            if ($targetChId === '') {
                                throw new Exception('شناسه کانال ایتا مشخص نشده است.');
                            }
                            $eitaaClient = new EitaaClient($effectiveEitaaToken, $config['eitaa_api_base'], (int)($config['eitaa_timeout'] ?? 30));
                            if ($savedMedia['has_file']) {
                                $res = ($mediaCategory === 'image')
                                    ? $eitaaClient->sendPhotoMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot)
                                    : $eitaaClient->sendMediaMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot, $mediaCategory);
                            } else {
                                $res = $eitaaClient->sendMessage($targetChId, $fullTextForBot);
                            }
                            $msgId = (string)($res['message_id'] ?? '');
                            $platformOk = true;
                            $modeUsed = 'live_api';
                        } elseif ($platform === 'telegram') {
                            $rawTarget = $channelOverride !== '' ? $channelOverride : ($telegramCreds['channel_id'] ?? '');
                            $targetChId = TelegramClient::normalizeChannelId($rawTarget);
                            if (empty($telegramCreds['token'])) {
                                throw new Exception('توکن ربات تلگرام (@Hamahdibot) در فایل config.php وارد نشده است.');
                            }
                            if ($targetChId === '') {
                                throw new Exception('آیدی کانال یا گروه تلگرام مشخص نشده است.');
                            }
                            $tgClient = new TelegramClient($telegramCreds['token'], $telegramCreds['proxy'] ?? '', $config['telegram_api_base'], (int)($config['telegram_timeout'] ?? 30));
                            if ($savedMedia['has_file']) {
                                $res = ($mediaCategory === 'image')
                                    ? $tgClient->sendPhotoMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot)
                                    : $tgClient->sendMediaMultipart($targetChId, $savedMedia['file_path'], $savedMedia['mime_type'], $fullTextForBot, $mediaCategory);
                            } else {
                                $res = $tgClient->sendMessage($targetChId, $fullTextForBot);
                            }
                            $msgId = (string)($res['message_id'] ?? '');
                            $platformOk = true;
                            $modeUsed = 'live_api';
                        }
                    } catch (Throwable $apiErr) {
                        $platformOk = false;
                        $modeUsed = 'error';
                        $platformErr = $apiErr->getMessage();
                    }

                    if ($platformOk) $successCount++;

                    $rec = $logger->logPublishAttempt([
                        'platform'          => $platform,
                        'channel_id'        => $targetChId ?: '@channel',
                        'file_name'         => 'ephemeral_relay',
                        'original_name'     => $savedMedia['original_name'],
                        'caption'           => $fullTextForBot,
                        'status'            => $platformOk ? 'published' : 'failed',
                        'remote_message_id' => $msgId,
                        'error_message'     => $platformErr !== '' ? $platformErr : null,
                    ]);
                    $results[$platform] = [
                        'ok'         => $platformOk,
                        'mode'       => $modeUsed,
                        'channel_id' => $targetChId ?: '@channel',
                        'message_id' => $msgId,
                        'error'      => $platformErr
                    ];
                    $historyItems[] = $rec;
                }
            } finally {
                // حذف فوری فایل موقت پس از رله به پیام‌رسان‌ها (بدون اشغال فضای آپلود سرور)
                if (!empty($savedMedia['file_path']) && is_file($savedMedia['file_path'])) {
                    @unlink($savedMedia['file_path']);
                }
            }

            sendBotJson([
                'ok'           => ($successCount > 0),
                'sent_count'   => $successCount,
                'media_type'   => $mediaCategory,
                'results'      => $results,
                'history_item' => $historyItems[0] ?? null,
                'history'      => $logger->getHistory(30),
            ]);
            break;

        default:
            sendBotJson(['ok' => false, 'error' => 'عملیات درخواستی معتبر نیست.']);
    }
} catch (Throwable $e) {
    sendBotJson([
        'ok'    => false,
        'error' => $e->getMessage(),
    ]);
}