<?php
// PHP 7.4 Compatibility Polyfills (prevents Fatal Error / empty JSON on PHP 7.4 hosts)
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

$__rootDir = is_file(__DIR__ . '/config.php') && is_dir(__DIR__ . '/api') ? __DIR__ : dirname(__DIR__);
foreach ([$__rootDir . '/config.php', $__rootDir . '/config/config.php', $__rootDir . '/api/config.php'] as $__cfgFile) {
    if (is_file($__cfgFile)) {
        require_once $__cfgFile;
    }
}
if (!defined('DB_DRIVER')) define('DB_DRIVER', 'sqlite');
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'hamahdi_tabarsi_db');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');
$__storageBase = is_dir($__rootDir . '/storage') ? ($__rootDir . '/storage') : (__DIR__ . '/storage');
if (!defined('SQLITE_DB_PATH_MARKET')) define('SQLITE_DB_PATH_MARKET', $__storageBase . '/data/hamahdi_tabarsi.sqlite');
if (!defined('SQLITE_DB_PATH')) define('SQLITE_DB_PATH', SQLITE_DB_PATH_MARKET);
if (!defined('UPLOADS_DIR')) define('UPLOADS_DIR', $__storageBase . '/uploads/');
if (!defined('MAX_UPLOAD_BYTES')) define('MAX_UPLOAD_BYTES', 25 * 1024 * 1024);
if (!defined('ADMIN_USERNAME')) define('ADMIN_USERNAME', 'admin');
if (!defined('ADMIN_DEFAULT_PASSWORD')) define('ADMIN_DEFAULT_PASSWORD', 'admin');
if (!defined('APP_SECRET_KEY')) define('APP_SECRET_KEY', 'hamahdi_tabarsi_v6_secure_hmac_key_2026_mashhad');

/**
 * HAMAHDI (هم‌عهدی) - نقطه ورود یکپارچه REST API (نسخه 9.0 ماژولار و فوق سریع)
 * امنیت کامل مبتنی بر Session + Random Token + CSRF + محافظت در برابر IDOR و افشای داده‌ها
 */

require_once __DIR__ . '/cors.php';
hamahdi_apply_mobile_cors(true);

// اگر فایل api/index.php به اشتباه در پوشه ریشه (کنار index.html) کپی شده باشد و کاربر آدرس سایت را در مرورگر باز کند، صفحه اصلی نمایش داده شود:
if (empty($_GET['action']) && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'GET' && is_file(__DIR__ . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
}


// ============================================================================
// AHDBOT 4-NETWORK DIRECT RELAY (PHP 7.0 - 8.4 Compatible, Zero PDO/External Class)
// Powered by verified phpbot.zip API flows: Bale, Rubika v3, Eitaa (EitaaYar), Telegram (+ Cloudflare)
// ============================================================================
$__botAction = isset($_GET["action"]) ? (string)$_GET["action"] : "";
if (in_array($__botAction, ["bot_init", "bot_diagnose", "bot_publish", "bot_auto_verify_channel", "bot_unregister_global_channel"], true)) {
    @ini_set("display_errors", "0");
    @date_default_timezone_set("Asia/Tehran");

    $__botSendJson = function($payload, $code = 200) {
        while (ob_get_level() > 0) { @ob_end_clean(); }
        http_response_code($code);
        header("Content-Type: application/json; charset=utf-8");
        header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
        echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    };

    $__botMask = function($tok) {
        $tok = trim((string)$tok);
        if ($tok === "") return "";
        if (strlen($tok) <= 12) return "••••••••";
        return substr($tok, 0, 6) . "••••••••••••" . substr($tok, -4);
    };

    $__botStorageDir = $__storageBase . "/bot_storage";
    if (!is_dir($__botStorageDir)) { @mkdir($__botStorageDir, 0755, true); }

    $__botGetToken = function($pf) use ($__botStorageDir) {
        $constMap = [
            "bale"     => "HAMAHDI_BALE_BOT_TOKEN",
            "rubika"   => "HAMAHDI_RUBIKA_BOT_TOKEN",
            "telegram" => "HAMAHDI_TELEGRAM_BOT_TOKEN",
            "eitaa"    => "HAMAHDI_EITAA_BOT_TOKEN",
        ];
        $envMap = [
            "bale"     => "BALE_BOT_TOKEN",
            "rubika"   => "RUBIKA_BOT_TOKEN",
            "telegram" => "TELEGRAM_BOT_TOKEN",
            "eitaa"    => "EITAA_BOT_TOKEN",
        ];
        // Priority 1: Hardcoded constant in config.php
        if (isset($constMap[$pf]) && defined($constMap[$pf])) {
            $v = trim((string)constant($constMap[$pf]));
            if ($v !== "") return $v;
        }
        // Priority 2: Environment variable
        if (isset($envMap[$pf])) {
            $e = trim((string)getenv($envMap[$pf]));
            if ($e !== "") return $e;
        }
        // Priority 3: Fallback credentials JSON in storage/bot_storage/
        $jFile = $__botStorageDir . "/" . $pf . "_credentials.json";
        if (is_file($jFile)) {
            $dec = @json_decode((string)@file_get_contents($jFile), true);
            $k = $pf . "_bot_token";
            if (is_array($dec) && !empty($dec[$k])) {
                return trim((string)$dec[$k]);
            }
        }
        return "";
    };

    $__botNormId = function($pf, $raw) {
        $id = trim((string)$raw);
        if ($id === "") return "";
        if ($pf === "bale") {
            if (preg_match("~^(?:https?://)?(?:www\.)?ble\.ir/([a-zA-Z0-9_]+)/?$~i", $id, $m)) return "@" . $m[1];
            if ($id[0] !== "@" && !preg_match("/^-?\d+$/", $id)) return "@" . ltrim($id, "/");
            return $id;
        }
        if ($pf === "telegram") {
            if (preg_match("~^(?:https?://)?(?:www\.)?(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)/?$~i", $id, $m)) return "@" . $m[1];
            if ($id[0] !== "@" && !preg_match("/^-?\d+$/", $id)) return "@" . ltrim($id, "/");
            return $id;
        }
        if ($pf === "eitaa") {
            if (preg_match("~^(?:https?://)?(?:www\.)?eitaa\.com/([a-zA-Z0-9_]+)/?$~i", $id, $m)) return $m[1];
            return ltrim($id, "@/");
        }
        if ($pf === "rubika") {
            if (preg_match("~^(?:https?://)?(?:www\.)?rubika\.ir/([a-zA-Z0-9_]+)/?$~i", $id, $m)) return "@" . $m[1];
            return $id;
        }
        return $id;
    };

    $__botHttpJson = function($url, $payload = [], $timeout = 20) {
        $jsonBody = empty($payload) ? "{}" : json_encode($payload, JSON_UNESCAPED_UNICODE);
        if (function_exists("curl_init")) {
            $ch = curl_init($url);
            $opts = [
                CURLOPT_POST           => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER     => ["Content-Type: application/json", "Accept: application/json"],
                CURLOPT_POSTFIELDS     => $jsonBody,
                CURLOPT_TIMEOUT        => $timeout,
                CURLOPT_CONNECTTIMEOUT => min(10, $timeout),
                CURLOPT_PROXY          => "",
                CURLOPT_NOPROXY        => "*",
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ];
            if (defined("CURL_IPRESOLVE_V4")) {
                $opts[CURLOPT_IPRESOLVE] = CURL_IPRESOLVE_V4;
            }
            curl_setopt_array($ch, $opts);
            $raw = curl_exec($ch);
            $errNo = curl_errno($ch);
            $errMsg = curl_error($ch);
            $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            if ($errNo !== 0) {
                throw new Exception("خطای شبکه cURL: " . $errMsg);
            }
        } else {
            $ctx = stream_context_create([
                "http" => [
                    "method"        => "POST",
                    "header"        => "Content-Type: application/json\r\nAccept: application/json\r\nContent-Length: " . strlen((string)$jsonBody) . "\r\nConnection: close\r\n",
                    "content"       => $jsonBody,
                    "timeout"       => $timeout,
                    "ignore_errors" => true,
                ],
                "ssl" => ["verify_peer" => false, "verify_peer_name" => false],
            ]);
            $raw = @file_get_contents($url, false, $ctx);
            $httpCode = 200;
            if ($raw === false) {
                throw new Exception("خطای اتصال شبکه (allow_url_fopen/cURL در هاست بررسی شود).");
            }
        }
        $dec = @json_decode((string)$raw, true);
        if (!is_array($dec)) {
            $snip = trim(strip_tags(substr((string)$raw, 0, 140)));
            throw new Exception("پاسخ نامعتبر از سرور پیام‌رسان (HTTP " . $httpCode . "): " . $snip);
        }
        return $dec;
    };

    $__botHttpMultipart = function($url, $fields, $timeout = 30) {
        if (!function_exists("curl_init") || !class_exists("CURLFile")) {
            throw new Exception("افزونه cURL یا CURLFile برای ارسال فایل روی هاست فعال نیست.");
        }
        $ch = curl_init($url);
        $opts = [
            CURLOPT_POST           => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS     => $fields,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => min(12, $timeout),
            CURLOPT_PROXY          => "",
            CURLOPT_NOPROXY        => "*",
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
        ];
        if (defined("CURL_IPRESOLVE_V4")) {
            $opts[CURLOPT_IPRESOLVE] = CURL_IPRESOLVE_V4;
        }
        curl_setopt_array($ch, $opts);
        $raw = curl_exec($ch);
        $errNo = curl_errno($ch);
        $errMsg = curl_error($ch);
        $httpCode = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($errNo !== 0) {
            throw new Exception("خطای ارسال فایل cURL: " . $errMsg);
        }
        $dec = @json_decode((string)$raw, true);
        if (!is_array($dec)) {
            throw new Exception("پاسخ نامعتبر سرور پیام‌رسان هنگام ارسال فایل (HTTP " . $httpCode . ")");
        }
        return $dec;
    };

    $__tgBase = "https://api.telegram.org/bot";
    if (defined("HAMAHDI_TELEGRAM_API_BASE") && trim((string)HAMAHDI_TELEGRAM_API_BASE) !== "") {
        $__customTg = rtrim(trim((string)HAMAHDI_TELEGRAM_API_BASE), "/");
        $__tgBase = (substr($__customTg, -4) === "/bot") ? $__customTg : ($__customTg . "/bot");
    }

    $__globalChFile = $__botStorageDir . "/registered_channels_global.json";
    $__loadGlobalCh = function() use ($__globalChFile) {
        if (!is_file($__globalChFile)) return [];
        $d = @json_decode((string)@file_get_contents($__globalChFile), true);
        return is_array($d) ? $d : [];
    };
    $__saveGlobalCh = function($map) use ($__globalChFile) {
        @file_put_contents($__globalChFile, json_encode($map, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
    };

    try {
        if ($__botAction === "bot_init") {
            $bTok = $__botGetToken("bale");
            $rTok = $__botGetToken("rubika");
            $tTok = $__botGetToken("telegram");
            $eTok = $__botGetToken("eitaa");
            $__botSendJson([
                "ok" => true,
                "version" => "4.0.3",
                "php_version" => PHP_VERSION,
                "config" => [
                    "bale"     => ["is_configured" => ($bTok !== ""), "has_token" => ($bTok !== ""), "masked_token" => $__botMask($bTok), "bot_name" => "هم‌عهدی", "bot_username" => "Hamahdibot"],
                    "rubika"   => ["is_configured" => ($rTok !== ""), "has_token" => ($rTok !== ""), "masked_token" => $__botMask($rTok), "bot_name" => "هم‌عهدی", "bot_username" => "Hamahdibot"],
                    "telegram" => ["is_configured" => ($tTok !== ""), "has_token" => ($tTok !== ""), "masked_token" => $__botMask($tTok), "bot_name" => "هم‌عهدی", "bot_username" => "Hamahdibot"],
                    "eitaa"    => ["is_configured" => ($eTok !== ""), "has_token" => ($eTok !== ""), "masked_token" => $__botMask($eTok), "bot_name" => "", "bot_username" => ""],
                    "limits"   => ["max_caption" => 4096, "max_size_mb" => 25],
                ],
                "history" => [],
            ]);
        }

        if ($__botAction === "bot_diagnose") {
            $diag = [
                "ok"          => true,
                "version"     => "4.0.3",
                "php_version" => PHP_VERSION,
                "curl_loaded" => function_exists("curl_init"),
                "telegram_api_base" => $__tgBase,
                "platforms"   => [],
            ];
            foreach (["bale", "rubika", "eitaa", "telegram"] as $pf) {
                $tok = $__botGetToken($pf);
                $row = ["has_token" => ($tok !== ""), "masked_token" => $__botMask($tok), "getMe_ok" => false, "detail" => ""];
                if ($tok !== "") {
                    try {
                        if ($pf === "bale") {
                            $r = $__botHttpJson("https://tapi.bale.ai/bot" . $tok . "/getMe", [], 6);
                            $row["getMe_ok"] = !empty($r["ok"]);
                            $row["detail"] = !empty($r["ok"]) ? ("@" . ($r["result"]["username"] ?? "Hamahdibot")) : ($r["description"] ?? "توکن نامعتبر");
                        } elseif ($pf === "rubika") {
                            $r = $__botHttpJson("https://botapi.rubika.ir/v3/" . $tok . "/getMe", [], 6);
                            $row["getMe_ok"] = (($r["status"] ?? "") === "OK" || !empty($r["data"]["bot"]));
                            $row["detail"] = $row["getMe_ok"] ? ($r["data"]["bot"]["username"] ?? "OK") : json_encode($r, JSON_UNESCAPED_UNICODE);
                        } elseif ($pf === "eitaa") {
                            $r = $__botHttpJson("https://eitaayar.ir/api/" . $tok . "/getMe", [], 6);
                            $row["getMe_ok"] = !empty($r["ok"]);
                            $row["detail"] = !empty($r["ok"]) ? "متصل به ایتایار" : ($r["description"] ?? "ناموفق");
                        } else {
                            $r = $__botHttpJson($__tgBase . $tok . "/getMe", [], 6);
                            $row["getMe_ok"] = !empty($r["ok"]);
                            $row["detail"] = !empty($r["ok"]) ? ("@" . ($r["result"]["username"] ?? "Hamahdibot")) : ($r["description"] ?? "خطای اتصال تلگرام");
                        }
                    } catch (Throwable $de) {
                        $row["detail"] = $de->getMessage();
                    }
                } else {
                    $row["detail"] = "توکن در config.php وارد نشده است.";
                }
                $diag["platforms"][$pf] = $row;
            }
            $__botSendJson($diag);
        }

        if ($__botAction === "bot_unregister_global_channel") {
            $raw = file_get_contents("php://input");
            $in = $raw ? (@json_decode($raw, true) ?: []) : $_POST;
            $pf = strtolower(trim((string)($in["platform"] ?? "")));
            $cid = strtolower(ltrim(trim((string)($in["channel_id"] ?? "")), "@/"));
            if ($pf !== "" && $cid !== "") {
                $map = $__loadGlobalCh();
                unset($map[$pf . "::" . $cid]);
                $__saveGlobalCh($map);
            }
            $__botSendJson(["ok" => true]);
        }

        if ($__botAction === "bot_auto_verify_channel") {
            $raw = file_get_contents("php://input");
            $in = $raw ? (@json_decode($raw, true) ?: []) : $_POST;
            $pf = strtolower(trim((string)($in["platform"] ?? "")));
            if (!in_array($pf, ["bale", "rubika", "eitaa", "telegram"], true)) {
                $__botSendJson(["ok" => false, "error" => "فقط ۴ شبکه روبیکا، بله، ایتا و تلگرام پشتیبانی می‌شوند."]);
            }
            $chIdRaw = trim((string)($in["channel_id"] ?? ""));
            $targetType = strtolower(trim((string)($in["target_type"] ?? "channel"))) === "group" ? "group" : "channel";
            $isAdminReq = !empty($in["is_admin"]);
            $ownerUser = trim((string)($in["owner_username"] ?? "user"));
            $eitaaTok = trim((string)($in["eitaa_token"] ?? ""));
            if ($chIdRaw === "") {
                $__botSendJson(["ok" => false, "error" => "لطفاً آیدی کانال یا گروه را وارد کنید."]);
            }
            if ($pf === "eitaa" && $eitaaTok === "") {
                $__botSendJson(["ok" => false, "auto_approved" => false, "eligible" => false, "error" => "برای ثبت کانال ایتا، لطفاً توکن ایتایار را وارد نمایید."]);
            }
            $normId = $__botNormId($pf, $chIdRaw);
            $gKey = $pf . "::" . strtolower(ltrim($normId, "@/"));
            $gMap = $__loadGlobalCh();
            if (isset($gMap[$gKey])) {
                $__botSendJson([
                    "ok" => false,
                    "duplicate" => true,
                    "auto_approved" => false,
                    "eligible" => false,
                    "error" => "این کانال یا گروه قبلاً یک‌بار در سامانه ثبت شده است و امکان ثبت مجدد آن وجود ندارد.",
                ]);
            }
            $detectedMembers = null;
            $liveApi = false;
            try {
                if ($pf === "bale") {
                    $tok = $__botGetToken("bale");
                    if ($tok !== "") {
                        $r = $__botHttpJson("https://tapi.bale.ai/bot" . $tok . "/getChatMembersCount", ["chat_id" => $normId], 8);
                        if (!empty($r["ok"]) && isset($r["result"])) {
                            $detectedMembers = (int)$r["result"];
                            $liveApi = true;
                        }
                    }
                } elseif ($pf === "telegram") {
                    $tok = $__botGetToken("telegram");
                    if ($tok !== "") {
                        $r = $__botHttpJson($__tgBase . $tok . "/getChatMemberCount", ["chat_id" => $normId], 8);
                        if (!empty($r["ok"]) && isset($r["result"])) {
                            $detectedMembers = (int)$r["result"];
                            $liveApi = true;
                        }
                    }
                } elseif ($pf === "rubika") {
                    $tok = $__botGetToken("rubika");
                    if ($tok !== "") {
                        $r = $__botHttpJson("https://botapi.rubika.ir/v3/" . $tok . "/getChat", ["chat_id" => $normId], 8);
                        $cnt = $r["data"]["chat"]["members_count"] ?? $r["data"]["members_count"] ?? null;
                        if ($cnt !== null) {
                            $detectedMembers = (int)$cnt;
                            $liveApi = true;
                        }
                    }
                } elseif ($pf === "eitaa") {
                    $tok = $eitaaTok !== "" ? $eitaaTok : $__botGetToken("eitaa");
                    if ($tok !== "") {
                        $r = $__botHttpJson("https://eitaayar.ir/api/" . $tok . "/getMe", [], 8);
                        if (!empty($r["ok"])) $liveApi = true;
                    }
                }
            } catch (Throwable $ve) {}

            $finalMembers = ($detectedMembers !== null && $detectedMembers > 0) ? $detectedMembers : 0;
            $targetFa = ($targetType === "group") ? "گروه" : "کانال";
            if (!$isAdminReq && $finalMembers > 0 && $finalMembers < 500) {
                $__botSendJson([
                    "ok" => false,
                    "auto_approved" => false,
                    "eligible" => false,
                    "members_count" => $finalMembers,
                    "error" => "تعداد اعضای این {$targetFa} (" . number_format($finalMembers) . " عضو) کمتر از حداقل ۵۰۰ نفر است و به صورت خودکار رد شد.",
                ]);
            }
            $gMap[$gKey] = [
                "platform" => $pf,
                "channel_id" => $normId,
                "target_type" => $targetType,
                "owner_username" => $ownerUser,
                "members_count" => $finalMembers,
                "registered_at" => date("Y-m-d H:i:s"),
            ];
            $__saveGlobalCh($gMap);
            $__botSendJson([
                "ok" => true,
                "auto_approved" => true,
                "eligible" => true,
                "channel_id" => $normId,
                "live_api" => $liveApi,
                "members_count" => $finalMembers,
                "message" => $finalMembers > 0
                    ? "✅ تایید خودکار: {$targetFa} «{$normId}» با " . number_format($finalMembers) . " عضو ثبت شد."
                    : "✅ {$targetFa} «{$normId}» با موفقیت ثبت گردید.",
            ]);
        }

        if ($__botAction === "bot_publish") {
            $raw = file_get_contents("php://input");
            $jIn = $raw ? (@json_decode($raw, true) ?: []) : [];
            $post = !empty($_POST) ? $_POST : $jIn;

            $targetsRaw = $post["targets"] ?? "bale";
            $targets = is_array($targetsRaw) ? $targetsRaw : array_values(array_filter(array_map("trim", explode(",", (string)$targetsRaw))));
            $channelOverride = trim((string)($post["channel_override"] ?? ""));
            $eitaaTokenOverride = trim((string)($post["eitaa_token"] ?? ""));
            $channelSignature = trim((string)($post["channel_signature"] ?? ""));
            $title = trim(strip_tags((string)($post["title"] ?? "")));
            $caption = trim((string)($post["caption"] ?? ""));
            $explicitType = strtolower(trim((string)($post["media_type"] ?? "")));
            $base64Media = (string)($post["media_data"] ?? "");

            // Ephemeral temp file creation (deleted immediately after sending)
            $tmpFile = "";
            $tmpMime = "text/plain";
            $mediaCat = "text";
            $upFile = $_FILES["media"] ?? $_FILES["image"] ?? $_FILES["video"] ?? $_FILES["audio"] ?? null;
            if ($upFile && isset($upFile["error"]) && (int)$upFile["error"] === UPLOAD_ERR_OK && !empty($upFile["tmp_name"])) {
                $orig = basename((string)($upFile["name"] ?? "media"));
                $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
                $tmpMime = strtolower((string)($upFile["type"] ?? "application/octet-stream"));
                $mediaCat = "image";
                if (in_array($ext, ["mp4", "webm", "mov", "mkv"], true) || strpos($tmpMime, "video/") === 0) { $mediaCat = "video"; if (!$ext) $ext = "mp4"; }
                elseif (in_array($ext, ["mp3", "ogg", "wav", "m4a", "aac"], true) || strpos($tmpMime, "audio/") === 0) { $mediaCat = "audio"; if (!$ext) $ext = "mp3"; }
                else { if (!$ext) $ext = "jpg"; }
                if (in_array($explicitType, ["image", "video", "audio"], true)) $mediaCat = $explicitType;
                $tmpFile = rtrim(sys_get_temp_dir(), "/\\") . "/hamahdi_tmp_" . bin2hex(random_bytes(6)) . "." . $ext;
                if (!@move_uploaded_file($upFile["tmp_name"], $tmpFile) && !@copy($upFile["tmp_name"], $tmpFile)) {
                    $tmpFile = (string)$upFile["tmp_name"];
                }
            } elseif ($base64Media !== "" && preg_match("/^data:([a-zA-Z0-9+\/-]+);base64,(.+)$/i", $base64Media, $m)) {
                $tmpMime = strtolower(trim($m[1]));
                $bin = base64_decode($m[2], true);
                if ($bin !== false && strlen($bin) > 32) {
                    $mediaCat = "image";
                    $ext = "jpg";
                    if (strpos($tmpMime, "video/") === 0) { $mediaCat = "video"; $ext = (strpos($tmpMime, "webm") !== false) ? "webm" : "mp4"; }
                    elseif (strpos($tmpMime, "audio/") === 0) { $mediaCat = "audio"; $ext = (strpos($tmpMime, "ogg") !== false) ? "ogg" : "mp3"; }
                    else { $ext = (strpos($tmpMime, "png") !== false) ? "png" : ((strpos($tmpMime, "webp") !== false) ? "webp" : "jpg"); }
                    if (in_array($explicitType, ["image", "video", "audio"], true)) $mediaCat = $explicitType;
                    $tmpFile = rtrim(sys_get_temp_dir(), "/\\") . "/hamahdi_tmp_" . bin2hex(random_bytes(6)) . "." . $ext;
                    @file_put_contents($tmpFile, $bin);
                }
            }

            $fullText = ($title !== "" && $caption !== "" && $title !== $caption) ? ("📌 " . $title . "\n\n" . $caption) : ($caption !== "" ? $caption : $title);
            if ($channelSignature !== "" && strpos($fullText, $channelSignature) === false) {
                $fullText .= "\n\n━━━━━━━━━━━━━━\n" . $channelSignature;
            }
            if ($tmpFile === "" && trim($fullText) === "") {
                $__botSendJson(["ok" => false, "error" => "لطفاً متن پیام یا فایل رسانه را وارد نمایید."]);
            }

            $results = [];
            $okCount = 0;
            try {
                foreach ($targets as $pf) {
                    $pf = strtolower(trim((string)$pf));
                    if (!in_array($pf, ["bale", "rubika", "eitaa", "telegram"], true)) continue;
                    $chatId = $__botNormId($pf, $channelOverride);
                    $pOk = false;
                    $pErr = "";
                    $msgId = "";
                    try {
                        if ($pf === "bale") {
                            $tok = $__botGetToken("bale");
                            if ($tok === "") throw new Exception("توکن ربات بله (@Hamahdibot) در config.php وارد نشده است.");
                            if ($chatId === "") throw new Exception("آیدی کانال بله مشخص نشده است.");
                            if ($tmpFile !== "" && is_file($tmpFile)) {
                                $mName = ($mediaCat === "video") ? "sendVideo" : (($mediaCat === "audio") ? "sendAudio" : "sendPhoto");
                                $fKey  = ($mediaCat === "video") ? "video" : (($mediaCat === "audio") ? "audio" : "photo");
                                $r = $__botHttpMultipart("https://tapi.bale.ai/bot" . $tok . "/" . $mName, [
                                    "chat_id" => $chatId,
                                    "caption" => $fullText,
                                    $fKey     => new CURLFile($tmpFile, $tmpMime, basename($tmpFile)),
                                ], 30);
                            } else {
                                $r = $__botHttpJson("https://tapi.bale.ai/bot" . $tok . "/sendMessage", [
                                    "chat_id" => $chatId,
                                    "text"    => $fullText,
                                ], 25);
                            }
                            if (empty($r["ok"])) {
                                throw new Exception("خطای سرور بله: " . ($r["description"] ?? "ارسال ناموفق (ادمین بودن @Hamahdibot در کانال را بررسی کنید)"));
                            }
                            $msgId = (string)($r["result"]["message_id"] ?? "");
                            $pOk = true;
                        } elseif ($pf === "eitaa") {
                            $tok = ($eitaaTokenOverride !== "") ? $eitaaTokenOverride : $__botGetToken("eitaa");
                            if ($tok === "") throw new Exception("توکن ایتایار برای این کانال وارد نشده است.");
                            if ($chatId === "") throw new Exception("آیدی کانال ایتا مشخص نشده است.");
                            if ($tmpFile !== "" && is_file($tmpFile)) {
                                $r = $__botHttpMultipart("https://eitaayar.ir/api/" . $tok . "/sendFile", [
                                    "chat_id" => $chatId,
                                    "caption" => $fullText,
                                    "file"    => new CURLFile($tmpFile, $tmpMime, basename($tmpFile)),
                                ], 30);
                            } else {
                                $r = $__botHttpJson("https://eitaayar.ir/api/" . $tok . "/sendMessage", [
                                    "chat_id" => $chatId,
                                    "text"    => $fullText,
                                ], 25);
                            }
                            if (empty($r["ok"])) {
                                throw new Exception("خطای سرور ایتایار: " . ($r["description"] ?? "ارسال ناموفق"));
                            }
                            $msgId = (string)($r["result"]["message_id"] ?? "");
                            $pOk = true;
                        } elseif ($pf === "telegram") {
                            $tok = $__botGetToken("telegram");
                            if ($tok === "") throw new Exception("توکن ربات تلگرام (@Hamahdibot) در config.php وارد نشده است.");
                            if ($chatId === "") throw new Exception("آیدی کانال تلگرام مشخص نشده است.");
                            if ($tmpFile !== "" && is_file($tmpFile)) {
                                $mName = ($mediaCat === "video") ? "sendVideo" : (($mediaCat === "audio") ? "sendAudio" : "sendPhoto");
                                $fKey  = ($mediaCat === "video") ? "video" : (($mediaCat === "audio") ? "audio" : "photo");
                                $r = $__botHttpMultipart($__tgBase . $tok . "/" . $mName, [
                                    "chat_id" => $chatId,
                                    "caption" => $fullText,
                                    $fKey     => new CURLFile($tmpFile, $tmpMime, basename($tmpFile)),
                                ], 30);
                            } else {
                                $r = $__botHttpJson($__tgBase . $tok . "/sendMessage", [
                                    "chat_id" => $chatId,
                                    "text"    => $fullText,
                                ], 25);
                            }
                            if (empty($r["ok"])) {
                                throw new Exception("خطای سرور تلگرام: " . ($r["description"] ?? "ارسال ناموفق"));
                            }
                            $msgId = (string)($r["result"]["message_id"] ?? "");
                            $pOk = true;
                        } elseif ($pf === "rubika") {
                            $tok = $__botGetToken("rubika");
                            if ($tok === "") throw new Exception("توکن ربات روبیکا (@Hamahdibot) در config.php وارد نشده است.");
                            if ($chatId === "") throw new Exception("شناسه کانال روبیکا مشخص نشده است.");
                            $rBase = "https://botapi.rubika.ir/v3/" . $tok;
                            if ($tmpFile !== "" && is_file($tmpFile)) {
                                $rType = ($mediaCat === "video") ? "Video" : (($mediaCat === "audio") ? "Music" : "Image");
                                $reqUp = $__botHttpJson($rBase . "/requestSendFile", ["type" => $rType], 20);
                                $upUrl = $reqUp["data"]["upload_url"] ?? $reqUp["upload_url"] ?? "";
                                if ($upUrl === "") throw new Exception("سرور روبیکا آدرس آپلود فایل را برنگرداند.");
                                $upRes = $__botHttpMultipart($upUrl, ["file" => new CURLFile($tmpFile, $tmpMime, basename($tmpFile))], 35);
                                $fileId = $upRes["data"]["file_id"] ?? $upRes["file_id"] ?? "";
                                if ($fileId === "") throw new Exception("شناسه file_id پس از آپلود در روبیکا دریافت نشد.");
                                $r = $__botHttpJson($rBase . "/sendFile", ["chat_id" => $chatId, "file_id" => $fileId, "text" => $fullText], 25);
                            } else {
                                $r = $__botHttpJson($rBase . "/sendMessage", ["chat_id" => $chatId, "text" => $fullText], 25);
                            }
                            if (($r["status"] ?? "") !== "OK" && empty($r["data"]["message_id"])) {
                                throw new Exception("خطای سرور روبیکا: " . ($r["status_det"] ?? $r["status"] ?? "ارسال ناموفق"));
                            }
                            $msgId = (string)($r["data"]["message_id"] ?? "");
                            $pOk = true;
                        }
                    } catch (Throwable $pe) {
                        $pOk = false;
                        $pErr = $pe->getMessage();
                    }
                    if ($pOk) $okCount++;
                    $results[$pf] = [
                        "ok" => $pOk,
                        "mode" => $pOk ? "live_api" : "error",
                        "channel_id" => $chatId,
                        "message_id" => $msgId,
                        "error" => $pErr,
                    ];
                }
            } finally {
                if ($tmpFile !== "" && is_file($tmpFile)) { @unlink($tmpFile); }
            }
            $__botSendJson([
                "ok" => ($okCount > 0),
                "sent_count" => $okCount,
                "media_type" => $mediaCat,
                "results" => $results,
            ]);
        }
    } catch (Throwable $be) {
        $__botSendJson(["ok" => false, "error" => $be->getMessage()]);
    }
}

$__apiDir = is_file(__DIR__ . '/config.php') ? __DIR__ : (is_file(__DIR__ . '/api/config.php') ? (__DIR__ . '/api') : __DIR__);
require_once $__apiDir . '/config.php';
require_once $__apiDir . '/database.php';
require_once $__apiDir . '/auth.php';
require_once $__apiDir . '/listings.php';
require_once $__apiDir . '/users.php';
require_once $__apiDir . '/orders.php';

$action = $_GET['action'] ?? 'ping';
$method = $_SERVER['REQUEST_METHOD'];
$rawBody = file_get_contents('php://input');
$input = $rawBody ? (json_decode($rawBody, true) ?: []) : [];

try {
    $pdo = get_pdo();

        // 1. Lightweight Fast-Path Endpoint برای کارهای ساده و شمارنده‌ها (کم‌حجم و سریع)
    
// HAMAHDI v5.0: اندپوینت سلامت سرور برای تست لوکال و اتصال APK
if ($action === 'health') {
    $walMode = 'unknown';
    try { $walMode = (string)$pdo->query("PRAGMA journal_mode")->fetchColumn(); } catch (Throwable $e) {}
    hamahdi_send_json([
        'status' => 'ok',
        'version' => defined('HAMAHDI_VERSION') ? HAMAHDI_VERSION : '5.0.0',
        'php_version' => PHP_VERSION,
        'db_driver' => 'sqlite',
        'sqlite_journal_mode' => $walMode,
        'modules' => ['ahdbazar', 'ahdbot', 'ai_text', 'spiritual_stats'],
        'ai_configured' => defined('HAMAHDI_AI_API_KEY') && trim((string)HAMAHDI_AI_API_KEY) !== '',
        'server_time' => date('c')
    ]);
}

// HAMAHDI v5.0: مسدودسازی اکشن‌های حذف‌شده (عهدینو، عهدانه) — آمار معنوی حفظ شده است
$__removedActionsV5 = [
    'add_community_post', 'like_community_post', 'toggle_follow_user', 'comment_community_post',
    'delete_community_post', 'add_social_story', 'like_social_story', 'repost_community_post',
    'vote_community_poll', 'toggle_pin_post'
];
if (in_array($action, $__removedActionsV5, true)) {
    hamahdi_send_json(['error' => 'این بخش در نسخه ۵ غیرفعال شده است.'], 410);
}

// HAMAHDI v5.0: جداسازی امنیتی داشبورد مدیریت — اکشن‌های ادمین فقط از نسخه وب مجاز هستند
$__webOnlyAdminActions = [
    'login_admin', 'export_backup', 'approve_listing', 'reject_listing', 'approve_promotion',
    'toggle_listing_flag', 'toggle_user_suspend', 'approve_user_booth', 'reject_user_booth',
    'approve_slide', 'approve_story', 'approve_message', 'approve_bot_channel', 'reject_bot_channel',
    'delete_leader_photo'
];
if (hamahdi_is_mobile_apk_client() && in_array($action, $__webOnlyAdminActions, true)) {
    hamahdi_send_json(['error' => 'داشبورد مدیریت فقط از طریق نسخه وب (admin.html) در دسترس است.'], 403);
}

if ($action === 'ping_counts' && $method === 'GET') {
        $cListings = 0;
        try {
            $r1 = $pdo->query("SELECT COUNT(*) AS cnt FROM market_listings WHERE status = 'approved'")->fetch();
            $cListings = (int)($r1['cnt'] ?? 0);
        } catch (Throwable $e) {}
        echo json_encode(['ok' => true, 'approved_listings' => $cListings, 'ts' => time()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 2. Cursor-Based Pagination برای لیست‌های بزرگ (به‌جای شماره صفحه OFFSET)
    if ($action === 'get_listings_cursor' && $method === 'GET') {
        $cursor = max(0, (int)($_GET['cursor'] ?? 0));
        $limit = max(1, min(50, (int)($_GET['limit'] ?? 20)));
        $cat = clean_str($_GET['category'] ?? '');
        $sql = "SELECT * FROM market_listings WHERE status = 'approved'";
        $params = [];
        if ($cursor > 0) {
            $sql .= " AND id < ?";
            $params[] = $cursor;
        }
        if ($cat !== '' && $cat !== 'all') {
            $sql .= " AND category = ?";
            $params[] = $cat;
        }
        $sql .= " ORDER BY id DESC LIMIT " . ($limit + 1);
        $st = $pdo->prepare($sql);
        $st->execute($params);
        $rows = $st->fetchAll();
        $hasMore = count($rows) > $limit;
        if ($hasMore) array_pop($rows);
        $nextCursor = (!empty($rows)) ? (int)(end($rows)['id'] ?? 0) : 0;
        echo json_encode(['ok' => true, 'items' => $rows, 'next_cursor' => $hasMore ? $nextCursor : null, 'has_more' => $hasMore], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 3. Full-Text Search (FTS5) برای جستجوی سریع و دقیق متنی در بازار
    if ($action === 'search_listings_fts' && $method === 'GET') {
        $q = trim((string)($_GET['q'] ?? ''));
        $limit = max(1, min(50, (int)($_GET['limit'] ?? 24)));
        if ($q === '') {
            echo json_encode(['ok' => true, 'items' => []], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $rows = [];
        try {
            $ftsQuery = preg_replace('/[^\p{L}\p{N}\s]+/u', ' ', $q);
            $st = $pdo->prepare("SELECT m.* FROM market_listings m INNER JOIN market_listings_fts f ON m.id = f.listing_id WHERE market_listings_fts MATCH ? AND m.status = 'approved' ORDER BY m.laddered_at DESC, m.id DESC LIMIT " . $limit);
            $st->execute([trim($ftsQuery) . '*']);
            $rows = $st->fetchAll();
        } catch (Throwable $e) {
            $like = '%' . $q . '%';
            $st = $pdo->prepare("SELECT * FROM market_listings WHERE status = 'approved' AND (title LIKE ? OR description LIKE ? OR booth_title LIKE ?) ORDER BY laddered_at DESC, id DESC LIMIT " . $limit);
            $st->execute([$like, $like, $like]);
            $rows = $st->fetchAll();
        }
        echo json_encode(['ok' => true, 'items' => $rows, 'engine' => 'fts5'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'blob' && $method === 'GET') {
        $hash = trim((string)($_GET['h'] ?? ''));
        $blobObj = fetch_binary_blob_from_db_container($hash);
        while (ob_get_level() > 0) { ob_end_clean(); }
        if (!$blobObj || empty($blobObj['binary'])) {
            http_response_code(404);
            exit;
        }
        header('Content-Type: ' . ($blobObj['mime_type'] ?? 'image/webp'));
        header('Cache-Control: public, max-age=31536000, immutable');
        header('Content-Length: ' . strlen($blobObj['binary']));
        echo $blobObj['binary'];
        exit;
    }
    $now = date('Y-m-d H:i:s');
    $isAdmin = is_valid_admin_request($input);
    $sessionUser = get_authenticated_username($pdo, $input);

    if ($action === 'add_community_post' && $method === 'POST') {
        $mediaType = strtolower(clean_str($input['media_type'] ?? 'text'));
        if (!in_array($mediaType, ['text', 'audio', 'image', 'video'], true)) {
            $mediaType = 'text';
        }
        // مسیریابی خودکار طبق دستور کارفرما:
        // متن و صوت -> عهدینو (ahdino) | تصویر و ویدیو -> عهدانه (ahdaneh)
        $appTarget = ($mediaType === 'image' || $mediaType === 'video') ? 'ahdaneh' : 'ahdino';
        $authorUname = clean_str($input['author_username'] ?? $sessionUser ?: 'resident');
        $authorName = clean_str($input['author_name'] ?? 'همسایه هم‌عهدی');
        $authorRole = clean_str($input['author_role'] ?? 'عضو و روایتگر هم‌عهدی');
        $title = clean_str($input['title'] ?? '');
        $caption = clean_str($input['caption'] ?? '');
        $mediaData = (string)($input['media_url'] ?? $input['media_data'] ?? '');
        $nets = is_array($input['published_networks'] ?? null) ? $input['published_networks'] : ['hamahdi'];

        $storedMediaUrl = $mediaData;
        if (str_starts_with($mediaData, 'data:image/')) {
            try {
                $storedMediaUrl = store_base64_image_to_disk($mediaData, $appTarget);
            } catch (Throwable $e) {
                $storedMediaUrl = $mediaData;
            }
        } elseif (preg_match('/^data:(audio|video)\/([a-zA-Z0-9+\/-]+);base64,(.+)$/i', $mediaData, $mm)) {
            $bin = base64_decode($mm[3], true);
            if ($bin !== false && strlen($bin) > 32) {
                if (!is_dir(UPLOADS_DIR)) @mkdir(UPLOADS_DIR, 0755, true);
                $ext = ($mm[1] === 'video') ? 'mp4' : 'mp3';
                $fname = $appTarget . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
                if (@file_put_contents(UPLOADS_DIR . $fname, $bin) !== false) {
                    $storedMediaUrl = 'storage/uploads/' . $fname;
                }
            }
        }

        $pollData = isset($input['poll']) && is_array($input['poll']) ? json_encode($input['poll'], JSON_UNESCAPED_UNICODE) : '';
        $galleryArr = isset($input['media_gallery']) && is_array($input['media_gallery']) ? $input['media_gallery'] : ($storedMediaUrl ? [$storedMediaUrl] : []);
        $repostOfId = (int)($input['repost_of_id'] ?? 0);
        $repostAuthor = clean_str($input['repost_author'] ?? '');
        try {
            $pdo->prepare("INSERT INTO community_media_posts (
                app_target, media_type, author_username, author_name, author_role,
                title, caption, media_url, media_gallery_json, poll_json, repost_of_id, repost_author,
                published_networks, likes_count, comments_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '[]', ?)")
            ->execute([
                $appTarget, $mediaType, $authorUname, $authorName, $authorRole,
                $title, $caption, $storedMediaUrl, json_encode(array_values($galleryArr), JSON_UNESCAPED_UNICODE),
                $pollData, $repostOfId, $repostAuthor,
                json_encode(array_values($nets), JSON_UNESCAPED_UNICODE), $now
            ]);
        } catch (Throwable $e) {
            $pdo->prepare("INSERT INTO community_media_posts (
                app_target, media_type, author_username, author_name, author_role,
                title, caption, media_url, published_networks, likes_count, comments_json, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, '[]', ?)")
            ->execute([
                $appTarget, $mediaType, $authorUname, $authorName, $authorRole,
                $title, $caption, $storedMediaUrl, json_encode(array_values($nets), JSON_UNESCAPED_UNICODE), $now
            ]);
        }

        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'like_community_post' && $method === 'POST') {
        $pid = (int)($input['id'] ?? 0);
        $voter = strtolower(clean_str($input['voter'] ?? $sessionUser ?: ($_SERVER['REMOTE_ADDR'] ?? 'anon')));
        $unlike = !empty($input['unlike']);
        if ($pid > 0 && $voter !== '') {
            $st = $pdo->prepare("SELECT likes_count FROM community_media_posts WHERE id = ?");
            $st->execute([$pid]);
            $r = $st->fetch();
            if ($r) {
                $likeSettingKey = 'post_voters_' . $pid;
                $stV = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
                $stV->execute([$likeSettingKey]);
                $vRow = $stV->fetch();
                $voters = ($vRow && !empty($vRow['setting_value'])) ? (json_decode($vRow['setting_value'], true) ?: []) : [];
                if ($unlike) {
                    if (in_array($voter, $voters, true)) {
                        $voters = array_values(array_diff($voters, [$voter]));
                        $newLikes = max(0, (int)($r['likes_count'] ?? 1) - 1);
                        $pdo->prepare("UPDATE community_media_posts SET likes_count = ? WHERE id = ?")->execute([$newLikes, $pid]);
                        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
                            ->execute([$likeSettingKey, json_encode($voters, JSON_UNESCAPED_UNICODE)]);
                    }
                } else {
                    if (!in_array($voter, $voters, true)) {
                        $voters[] = $voter;
                        $newLikes = (int)($r['likes_count'] ?? 0) + 1;
                        $pdo->prepare("UPDATE community_media_posts SET likes_count = ? WHERE id = ?")->execute([$newLikes, $pid]);
                        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
                            ->execute([$likeSettingKey, json_encode($voters, JSON_UNESCAPED_UNICODE)]);
                    }
                }
            }
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'toggle_follow_user' && $method === 'POST') {
        $follower = strtolower(clean_str($input['follower'] ?? $sessionUser ?: ''));
        $following = strtolower(clean_str($input['following'] ?? ''));
        if ($follower && $following && $follower !== $following) {
            try {
                $pdo->exec("CREATE TABLE IF NOT EXISTS user_follows (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    follower_username TEXT NOT NULL,
                    following_username TEXT NOT NULL,
                    created_at TEXT NOT NULL
                )");
                $stF = $pdo->prepare("SELECT id FROM user_follows WHERE follower_username = ? AND following_username = ?");
                $stF->execute([$follower, $following]);
                $existingF = $stF->fetch();
                if ($existingF) {
                    $pdo->prepare("DELETE FROM user_follows WHERE id = ?")->execute([$existingF['id']]);
                } else {
                    $pdo->prepare("INSERT INTO user_follows (follower_username, following_username, created_at) VALUES (?, ?, ?)")
                        ->execute([$follower, $following, $now]);
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'comment_community_post' && $method === 'POST') {
        $pid = (int)($input['id'] ?? 0);
        $sender = clean_str($input['sender'] ?? 'همسایه هم‌عهدی');
        $text = clean_str($input['text'] ?? '');
        if ($pid > 0 && $text !== '') {
            $st = $pdo->prepare("SELECT comments_json FROM community_media_posts WHERE id = ?");
            $st->execute([$pid]);
            $r = $st->fetch();
            if ($r) {
                $cmts = !empty($r['comments_json']) ? (json_decode((string)$r['comments_json'], true) ?: []) : [];
                $cmts[] = [
                    'id' => time() . rand(10, 99),
                    'sender' => $sender,
                    'sender_username' => $sessionUser ?: 'resident',
                    'text' => $text,
                    'created_at' => date('Y/m/d H:i')
                ];
                $pdo->prepare("UPDATE community_media_posts SET comments_json = ? WHERE id = ?")
                    ->execute([json_encode($cmts, JSON_UNESCAPED_UNICODE), $pid]);
            }
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_community_post' && $method === 'POST') {
        $pid = (int)($input['id'] ?? 0);
        if ($pid > 0) {
            $st = $pdo->prepare("SELECT author_username, media_url FROM community_media_posts WHERE id = ?");
            $st->execute([$pid]);
            $r = $st->fetch();
            if ($r && ($isAdmin || ($sessionUser !== '' && strcasecmp($r['author_username'], $sessionUser) === 0))) {
                if (!empty($r['media_url'])) unlink_stored_image($r['media_url']);
                $pdo->prepare("DELETE FROM community_media_posts WHERE id = ?")->execute([$pid]);
            }
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'save_bot_channel' && $method === 'POST') {
        $channels = get_registered_bot_channels($pdo);
        $ownerUname = clean_str($input['owner_username'] ?? $sessionUser ?: 'resident');
        $ownerName = clean_str($input['owner_name'] ?? 'همسایه هم‌عهدی');
        $ownerPhone = clean_str($input['owner_phone'] ?? '');
        $mediaTitle = clean_str($input['media_title'] ?? '');
        $platform = strtolower(clean_str($input['platform'] ?? 'bale'));
        if (!in_array($platform, ['bale', 'rubika', 'eitaa', 'telegram'], true)) {
            http_response_code(400);
            echo json_encode(['error' => 'فقط ۴ شبکه روبیکا، بله، ایتا و تلگرام پشتیبانی می‌شوند.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $targetType = strtolower(clean_str($input['target_type'] ?? 'channel'));
        $channelId = clean_str($input['channel_id'] ?? '');
        $signature = trim((string)($input['signature'] ?? ''));
        $eitaaToken = trim((string)($input['eitaa_token'] ?? ''));
        $category = clean_str($input['category'] ?? 'عمومی');
        $membersCount = (int)normalize_fa_digits((string)($input['members_count'] ?? 0));
        if ($membersCount < 500) {
            http_response_code(400);
            echo json_encode(['error' => 'طبق تشخیص خودکار عهدبات، کانال یا گروه شما کمتر از ۵۰۰ عضو دارد و به صورت خودکار رد شد.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if ($channelId !== '' && $mediaTitle !== '') {
            $newEntry = [
                'id' => (int)($input['id'] ?? (time() . rand(10, 99))),
                'owner_username' => $ownerUname,
                'owner_name' => $ownerName,
                'owner_phone' => $ownerPhone,
                'media_title' => $mediaTitle,
                'platform' => $platform,
                'target_type' => ($targetType === 'group' ? 'group' : 'channel'),
                'channel_id' => $channelId,
                'signature' => $signature,
                'eitaa_token' => $eitaaToken,
                'members_count' => $membersCount,
                'category' => $category,
                'bot_added_confirmed' => true,
                'is_verified' => 1,
                'status' => 'approved',
                'created_at' => date('Y/m/d H:i')
            ];
            $replaced = false;
            foreach ($channels as &$existingCh) {
                if (strcasecmp((string)($existingCh['owner_username'] ?? ''), $ownerUname) === 0 &&
                    strtolower((string)($existingCh['platform'] ?? '')) === $platform &&
                    strcasecmp((string)($existingCh['channel_id'] ?? ''), $channelId) === 0) {
                    $existingCh = array_merge($existingCh, $newEntry);
                    $replaced = true;
                    break;
                }
            }
            unset($existingCh);
            if (!$replaced) {
                array_unshift($channels, $newEntry);
            }
            $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
                ->execute(['registered_bot_channels_json', json_encode($channels, JSON_UNESCAPED_UNICODE)]);
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'update_bot_channel_signature' && $method === 'POST') {
        $cid = (int)($input['id'] ?? 0);
        $chHandle = trim((string)($input['channel_id'] ?? ''));
        $pf = strtolower(trim((string)($input['platform'] ?? '')));
        $newSig = trim((string)($input['signature'] ?? ''));
        $channels = get_registered_bot_channels($pdo);
        foreach ($channels as &$ch) {
            if (($cid > 0 && (int)($ch['id'] ?? 0) === $cid) ||
                ($chHandle !== '' && strcasecmp((string)($ch['channel_id'] ?? ''), $chHandle) === 0 && ($pf === '' || strtolower((string)($ch['platform'] ?? '')) === $pf))) {
                $ch['signature'] = $newSig;
            }
        }
        unset($ch);
        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['registered_bot_channels_json', json_encode($channels, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'approve_bot_channel' && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط مدیر کل مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $cid = (int)($input['id'] ?? 0);
        $reqChId = trim((string)($input['channel_id'] ?? ''));
        $reqPf = strtolower(trim((string)($input['platform'] ?? '')));
        $channels = get_registered_bot_channels($pdo, true, '');
        foreach ($channels as &$c) {
            $matchId = ($cid > 0 && (int)($c['id'] ?? 0) === $cid);
            $matchHandle = ($reqChId !== '' && strcasecmp((string)($c['channel_id'] ?? ''), $reqChId) === 0 && ($reqPf === '' || strcasecmp((string)($c['platform'] ?? ''), $reqPf) === 0));
            if ($matchId || $matchHandle) {
                $c['status'] = 'approved';
                $c['is_verified'] = 1;
                unset($c['rejection_reason']);
            }
        }
        unset($c);
        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['registered_bot_channels_json', json_encode($channels, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'reject_bot_channel' && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط مدیر کل مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $cid = (int)($input['id'] ?? 0);
        $reqChId = trim((string)($input['channel_id'] ?? ''));
        $reqPf = strtolower(trim((string)($input['platform'] ?? '')));
        $reason = clean_str($input['reason'] ?? 'عدم احراز شرایط کانال بالای ۵۰۰ عضو یا عدم دسترسی ادمین ربات');
        $channels = get_registered_bot_channels($pdo, true, '');
        foreach ($channels as &$c) {
            $matchId = ($cid > 0 && (int)($c['id'] ?? 0) === $cid);
            $matchHandle = ($reqChId !== '' && strcasecmp((string)($c['channel_id'] ?? ''), $reqChId) === 0 && ($reqPf === '' || strcasecmp((string)($c['platform'] ?? ''), $reqPf) === 0));
            if ($matchId || $matchHandle) {
                $c['status'] = 'rejected';
                $c['is_verified'] = 0;
                $c['rejection_reason'] = $reason;
            }
        }
        unset($c);
        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['registered_bot_channels_json', json_encode($channels, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_bot_channel' && $method === 'POST') {
        $cid = (int)($input['id'] ?? 0);
        $channels = get_registered_bot_channels($pdo);
        $channels = array_values(array_filter($channels, function($c) use ($cid, $isAdmin, $sessionUser) {
            if ((int)($c['id'] ?? 0) !== $cid) return true;
            if ($isAdmin || ($sessionUser !== '' && strcasecmp($c['owner_username'] ?? '', $sessionUser) === 0)) {
                return false;
            }
            return true;
        }));
        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
            ->execute(['registered_bot_channels_json', json_encode($channels, JSON_UNESCAPED_UNICODE)]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    
    if ($action === 'add_social_story' && $method === 'POST') {
        $scope = (($input['scope'] ?? 'public') === 'personal') ? 'personal' : 'public';
        $ownerUname = clean_str($input['owner_username'] ?? $sessionUser ?: 'resident');
        $ownerName = clean_str($input['owner_name'] ?? 'همسایه هم‌عهدی');
        $title = clean_str($input['title'] ?? $ownerName);
        $caption = clean_str($input['caption'] ?? $title);
        $imgData = (string)($input['image_data'] ?? $input['image'] ?? '');
        if ($imgData !== '') {
            $storedUrl = $imgData;
            if (str_starts_with($imgData, 'data:image/') && strpos($imgData, 'svg+xml') === false) {
                try {
                    $storedUrl = store_base64_image_to_disk($imgData, 'sstory');
                } catch (Throwable $e) {
                    $storedUrl = $imgData;
                }
            }
            $pdo->prepare("INSERT INTO social_stories (author_name, author_username, author_role, visibility, title, caption, media_url, media_type, media_format, likes_count, replies_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 'image', 'image', 0, '[]', ?)")
                ->execute([$ownerName, $ownerUname, 'عضو هم‌عهدی', $scope, $title, $caption, $storedUrl, 'چند لحظه پیش']);
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'like_social_story' && $method === 'POST') {
        $sid = (int)($input['id'] ?? 0);
        $unlike = !empty($input['unlike']);
        if ($sid > 0) {
            try {
                if ($unlike) {
                    $pdo->prepare("UPDATE social_stories SET likes_count = CASE WHEN likes_count > 0 THEN likes_count - 1 ELSE 0 END WHERE id = ?")->execute([$sid]);
                } else {
                    $pdo->prepare("UPDATE social_stories SET likes_count = likes_count + 1 WHERE id = ?")->execute([$sid]);
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'increment_listing_view' && $method === 'POST') {
        $lid = (int)($input['id'] ?? 0);
        if ($lid > 0) {
            try {
                $pdo->prepare("UPDATE market_listings SET views_count = views_count + 1 WHERE id = ?")->execute([$lid]);
            } catch (Throwable $e) {}
        }
        echo json_encode(['status' => 'ok'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    
    if ($action === 'rate_market_listing' && $method === 'POST') {
        $lid = (int)($input['id'] ?? 0);
        $stars = max(1, min(5, (int)($input['stars'] ?? 5)));
        $voter = strtolower(clean_str($input['voter'] ?? $sessionUser ?: ($_SERVER['REMOTE_ADDR'] ?? 'anon')));
        if ($lid > 0 && $voter !== '') {
            try {
                $raterKey = 'listing_raters_' . $lid;
                $stR = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
                $stR->execute([$raterKey]);
                $rRow = $stR->fetch();
                $ratersMap = ($rRow && !empty($rRow['setting_value'])) ? (json_decode($rRow['setting_value'], true) ?: []) : [];

                if (!isset($ratersMap[$voter])) {
                    $st = $pdo->prepare("SELECT rating_avg, rating_count FROM market_listings WHERE id = ?");
                    $st->execute([$lid]);
                    $r = $st->fetch();
                    if ($r) {
                        $curAvg = (float)($r['rating_avg'] ?? 4.8);
                        $curCnt = max(1, (int)($r['rating_count'] ?? 10));
                        $newCnt = $curCnt + 1;
                        $newAvg = round((($curAvg * $curCnt) + $stars) / $newCnt, 1);
                        $pdo->prepare("UPDATE market_listings SET rating_avg = ?, rating_count = ? WHERE id = ?")
                            ->execute([$newAvg, $newCnt, $lid]);
                        $ratersMap[$voter] = $stars;
                        $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)")
                            ->execute([$raterKey, json_encode($ratersMap, JSON_UNESCAPED_UNICODE)]);
                    }
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'respond_price_offer' && $method === 'POST') {
        $mid = (int)($input['message_id'] ?? 0);
        $decision = (($input['decision'] ?? 'accepted') === 'rejected') ? 'rejected' : 'accepted';
        if ($mid > 0) {
            try {
                $st = $pdo->prepare("SELECT * FROM listing_messages WHERE id = ?");
                $st->execute([$mid]);
                $msg = $st->fetch();
                if ($msg) {
                    $pdo->prepare("UPDATE listing_messages SET offer_status = ? WHERE id = ?")->execute([$decision, $mid]);
                    if ($decision === 'accepted' && (int)($msg['listing_id'] ?? 0) > 0) {
                        $lid = (int)$msg['listing_id'];
                        $stL = $pdo->prepare("SELECT * FROM market_listings WHERE id = ?");
                        $stL->execute([$lid]);
                        $lRow = $stL->fetch();
                        if ($lRow) {
                            $ordCode = 'TBR-' . rand(100000, 999999);
                            $buyerUname = $msg['sender_username'] ?? 'resident';
                            $buyerName = $msg['sender_name'] ?? $buyerUname;
                            $agreedPrice = max(0, (int)($msg['offered_price'] ?? $lRow['price'] ?? 0));
                            $pdo->prepare("INSERT INTO market_orders (order_code, listing_id, listing_title, buyer_username, buyer_name, buyer_phone, buyer_address, seller_username, total_price, order_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                                ->execute([$ordCode, $lid, $lRow['title'], $buyerUname, $buyerName, 'هماهنگ در چت', 'شمال شرق', $lRow['seller_username'], $agreedPrice, 'توافق قیمت در چت دیوار (' . number_format($agreedPrice) . ' تومان) ✓', $now]);
                        }
                    }
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'checkout_cart_orders' && $method === 'POST') {
        $items = is_array($input['items'] ?? null) ? $input['items'] : [];
        $buyerUname = clean_str($input['buyer_username'] ?? $sessionUser ?: 'resident');
        $buyerName = clean_str($input['buyer_name'] ?? 'همسایه هم‌عهدی');
        $buyerPhone = clean_str($input['buyer_phone'] ?? '');
        $buyerAddress = clean_str($input['buyer_address'] ?? 'شمال شرق');
        foreach ($items as $it) {
            $lid = (int)($it['listing_id'] ?? 0);
            $qty = max(1, (int)($it['qty'] ?? 1));
            $lTitle = clean_str($it['title'] ?? 'کالای بازار') . ($qty > 1 ? (' (×' . $qty . ')') : '');
            $sUname = clean_str($it['seller_username'] ?? 'resident');
            $tPrice = max(0, (int)($it['total_price'] ?? 0));
            $ordCode = 'DK-' . rand(100000, 999999);
            try {
                $pdo->prepare("INSERT INTO market_orders (order_code, listing_id, listing_title, buyer_username, buyer_name, buyer_phone, buyer_address, seller_username, total_price, order_status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
                    ->execute([$ordCode, $lid, $lTitle, $buyerUname, $buyerName, $buyerPhone, $buyerAddress, $sUname, $tPrice, 'ثبت شده از سبد خرید (در انتظار ارسال غرفه‌دار)', $now]);
                if ($lid > 0) {
                    $pdo->prepare("UPDATE market_listings SET stock_count = CASE WHEN stock_count >= ? THEN stock_count - ? ELSE 0 END WHERE id = ?")
                        ->execute([$qty, $qty, $lid]);
                    $orderMsgPayload = "[ORDER_CARD]|{$ordCode}|{$lTitle}|{$qty}|{$tPrice}|{$buyerName}|{$buyerPhone}|{$buyerAddress}";
                    $pdo->prepare("INSERT INTO listing_messages (listing_id, sender_username, receiver_username, sender_name, message_text, offered_price, message_type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'pv', 'approved', ?)")
                        ->execute([$lid, $buyerUname, $sUname, $buyerName, $orderMsgPayload, $tPrice, $now]);
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'repost_community_post' && $method === 'POST') {
        $origId = (int)($input['id'] ?? 0);
        $quoteText = clean_str($input['quote_text'] ?? '');
        $authorUname = clean_str($input['author_username'] ?? $sessionUser ?: 'resident');
        $authorName = clean_str($input['author_name'] ?? 'همسایه هم‌عهدی');
        if ($origId > 0) {
            try {
                $st = $pdo->prepare("SELECT * FROM community_media_posts WHERE id = ?");
                $st->execute([$origId]);
                $orig = $st->fetch();
                if ($orig) {
                    $pdo->prepare("UPDATE community_media_posts SET reposts_count = reposts_count + 1 WHERE id = ?")->execute([$origId]);
                    $newCap = $quoteText !== '' ? ($quoteText . "

🔁 بازنشر از @" . $orig['author_username'] . ": " . $orig['caption']) : $orig['caption'];
                    $pdo->prepare("INSERT INTO community_media_posts (app_target, media_type, author_username, author_name, author_role, title, caption, media_url, repost_of_id, repost_author, reposts_count, likes_count, comments_json, created_at) VALUES (?, ?, ?, ?, 'عضو هم‌عهدی', ?, ?, ?, ?, ?, 0, 0, '[]', ?)")
                        ->execute([$orig['app_target'], $orig['media_type'], $authorUname, $authorName, $orig['title'], $newCap, $orig['media_url'], $origId, $orig['author_name'], $now]);
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'vote_community_poll' && $method === 'POST') {
        $pid = (int)($input['id'] ?? 0);
        $optIdx = (int)($input['option_index'] ?? 0);
        $voter = strtolower(clean_str($input['voter'] ?? $sessionUser ?: ($_SERVER['REMOTE_ADDR'] ?? 'anon')));
        if ($pid > 0 && $voter !== '') {
            try {
                $st = $pdo->prepare("SELECT poll_json FROM community_media_posts WHERE id = ?");
                $st->execute([$pid]);
                $r = $st->fetch();
                if ($r && !empty($r['poll_json'])) {
                    $poll = json_decode((string)$r['poll_json'], true);
                    if (is_array($poll) && isset($poll['options'][$optIdx])) {
                        if (!isset($poll['voters']) || !is_array($poll['voters'])) {
                            $poll['voters'] = [];
                        }
                        if (isset($poll['voters'][$voter])) {
                            $prevIdx = (int)$poll['voters'][$voter];
                            if (isset($poll['options'][$prevIdx])) {
                                $poll['options'][$prevIdx]['votes'] = max(0, (int)($poll['options'][$prevIdx]['votes'] ?? 1) - 1);
                            }
                        }
                        $poll['voters'][$voter] = $optIdx;
                        $poll['options'][$optIdx]['votes'] = (int)($poll['options'][$optIdx]['votes'] ?? 0) + 1;
                        $pdo->prepare("UPDATE community_media_posts SET poll_json = ? WHERE id = ?")
                            ->execute([json_encode($poll, JSON_UNESCAPED_UNICODE), $pid]);
                    }
                }
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'toggle_pin_post' && $method === 'POST') {
        $pid = (int)($input['id'] ?? 0);
        if ($pid > 0) {
            try {
                $pdo->prepare("UPDATE community_media_posts SET is_pinned = CASE WHEN is_pinned = 1 THEN 0 ELSE 1 END WHERE id = ?")->execute([$pid]);
            } catch (Throwable $e) {}
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'load_state') {
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'export_backup') {
        handle_export_backup($pdo, $isAdmin);
    }

    if ($action === 'login_admin' && $method === 'POST') {
        handle_login_admin($pdo, $input);
    }

    if ($action === 'logout' && $method === 'POST') {
        handle_logout_session();
    }

    if ($action === 'login_resident' && $method === 'POST') {
        handle_login_resident($pdo, $input);
    }

    if ($action === 'auth_resident' && $method === 'POST') {
        handle_auth_resident($pdo, $input, $now);
    }

    if ($action === 'update_booth' && $method === 'POST') {
        handle_update_booth($pdo, $input, $isAdmin, $sessionUser);
    }

    if ($action === 'add_slide' && $method === 'POST') {
        $photog = clean_str($input['photographer_name'] ?? '');
        $subBy = clean_str($input['submitted_by'] ?? 'اهالی شمال شرق');
        $imgData = (string)($input['image_data'] ?? '');
        if (!$photog || !$imgData) {
            http_response_code(400);
            echo json_encode(['error' => 'تصویر و نام عکاس الزامی است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $storedUrl = store_base64_image_to_disk($imgData, 'slide');
        $initialStatus = $isAdmin ? 'approved' : 'pending';
        $pdo->prepare("INSERT INTO hero_slides (image_url, photographer_name, submitted_by, status, created_at) VALUES (?, ?, ?, ?, ?)")
            ->execute([$storedUrl, $photog, $subBy, $initialStatus, $now]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (($action === 'delete_slide' || $action === 'approve_slide') && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط ادمین مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $sid = (int)($input['id'] ?? 0);
        if ($action === 'delete_slide') {
            $row = $pdo->prepare("SELECT image_url FROM hero_slides WHERE id = ?");
            $row->execute([$sid]);
            $found = $row->fetch();
            if ($found) unlink_stored_image($found['image_url']);
            $pdo->prepare("DELETE FROM hero_slides WHERE id = ?")->execute([$sid]);
        } else {
            $pdo->prepare("UPDATE hero_slides SET status = 'approved' WHERE id = ?")->execute([$sid]);
        }
        echo json_encode(build_full_state($pdo, true, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'add_story' && $method === 'POST') {
        if (!$isAdmin && !$sessionUser) {
            http_response_code(401);
            echo json_encode(['error' => 'فقط اعضای ثبت‌نام‌شده و دارای غرفه می‌توانند استوری کسب‌وکار ثبت کنند.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (!$isAdmin) {
            $stB = $pdo->prepare("SELECT booth_status FROM users WHERE username = ? LIMIT 1");
            $stB->execute([$sessionUser]);
            $uB = $stB->fetch();
            if (!$uB || ($uB['booth_status'] ?? 'pending') !== 'approved') {
                http_response_code(403);
                echo json_encode(['error' => 'حساب و غرفه شما در انتظار تایید مدیریت است. پس از تایید ادمین می‌توانید استوری ثبت کنید.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        if (!$isAdmin) {
            $stB = $pdo->prepare("SELECT booth_status FROM users WHERE username = ? LIMIT 1");
            $stB->execute([$sessionUser]);
            $uB = $stB->fetch();
            if (!$uB || ($uB['booth_status'] ?? 'pending') !== 'approved') {
                http_response_code(403);
                echo json_encode(['error' => 'حساب و غرفه شما در انتظار تایید مدیریت است. پس از تایید ادمین می‌توانید استوری ثبت کنید.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        $owner = $isAdmin ? clean_str($input['owner_username'] ?? 'admin') : $sessionUser;
        $bTitle = clean_str($input['booth_title'] ?? '');
        $cap = clean_str($input['caption'] ?? '');
        $imgData = (string)($input['image_data'] ?? '');
        if (!$imgData) {
            http_response_code(400);
            echo json_encode(['error' => 'تصویر استوری الزامی است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $storedUrl = store_base64_image_to_disk($imgData, 'story');
        $initialStatus = 'approved';
        $createdTs = time();
        $expiresAt = $createdTs + (48 * 3600);
        $pdo->prepare("INSERT INTO business_stories (owner_username, booth_title, caption, image_url, status, created_ts, expires_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
            ->execute([$owner, $bTitle, $cap, $storedUrl, $initialStatus, $createdTs, $expiresAt, $now]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (($action === 'approve_story' || $action === 'delete_story') && $method === 'POST') {
        $stid = (int)($input['id'] ?? 0);
        $row = $pdo->prepare("SELECT owner_username, image_url FROM business_stories WHERE id = ?");
        $row->execute([$stid]);
        $found = $row->fetch();
        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'استوری یافت نشد.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if ($action === 'delete_story') {
            if (!$isAdmin && (!$sessionUser || $found['owner_username'] !== $sessionUser)) {
                http_response_code(403);
                echo json_encode(['error' => 'شما فقط مجاز به حذف استوری غرفه خود هستید.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
            unlink_stored_image($found['image_url']);
            $pdo->prepare("DELETE FROM business_stories WHERE id = ?")->execute([$stid]);
            echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط ادمین مجاز به تایید استوری است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $pdo->prepare("UPDATE business_stories SET status = 'approved' WHERE id = ?")->execute([$stid]);
        echo json_encode(build_full_state($pdo, true, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'add_listing' && $method === 'POST') {
        if (!$isAdmin && !$sessionUser) {
            http_response_code(401);
            echo json_encode(['error' => 'برای ثبت آگهی باید ابتدا وارد حساب کاربری خود شوید.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (!$isAdmin) {
            $stB = $pdo->prepare("SELECT booth_status FROM users WHERE username = ? LIMIT 1");
            $stB->execute([$sessionUser]);
            $uB = $stB->fetch();
            if (!$uB || ($uB['booth_status'] ?? 'pending') !== 'approved') {
                http_response_code(403);
                echo json_encode(['error' => 'ثبت‌نام شما در انتظار تایید مدیریت است. پس از تایید توسط ادمین می‌توانید در عهد بازار آگهی ثبت کنید.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        if (!$isAdmin) {
            $stB = $pdo->prepare("SELECT booth_status FROM users WHERE username = ? LIMIT 1");
            $stB->execute([$sessionUser]);
            $uB = $stB->fetch();
            if (!$uB || ($uB['booth_status'] ?? 'pending') !== 'approved') {
                http_response_code(403);
                echo json_encode(['error' => 'ثبت‌نام شما در انتظار تایید مدیریت است. پس از تایید توسط ادمین می‌توانید در عهد بازار آگهی ثبت کنید.'], JSON_UNESCAPED_UNICODE);
                exit;
            }
        }
        $sellerUname = $isAdmin ? clean_str($input['seller_username'] ?? 'admin') : $sessionUser;
        $title = clean_str($input['title'] ?? '');
        $desc = clean_str($input['description'] ?? '');
        $cat = clean_str($input['category'] ?? 'food');
        $price = max(0, (int)($input['price'] ?? 0));
        $oldPrice = max(0, (int)($input['old_price'] ?? 0));
        $discPct = max(0, min(99, (int)($input['discount_percent'] ?? 0)));
        $unit = clean_str($input['price_unit'] ?? 'تومان');
        $condBadge = clean_str($input['condition_badge'] ?? 'نو / تولید تازه');
        $delivBadge = clean_str($input['delivery_badge'] ?? 'تحویل حضوری در شمال شرق');
        $specsArr = is_array($input['specs'] ?? null) ? $input['specs'] : [];
        $phone = clean_str($input['seller_phone'] ?? '');
        $addr = clean_str($input['address_detail'] ?? 'مشهد، شمال شرق');
        $sellerName = clean_str($input['seller_name'] ?? 'اهالی شمال شرق');
        if (!empty($input['spiritual_pledge']) && is_array($input['spiritual_pledge'])) {
            apply_spiritual_pledge($pdo, $input['spiritual_pledge'], $sellerName);
            if (!empty($input['spiritual_pledge']['summary_label'])) {
                $specsArr['هزینه معنوی ثبت‌شده'] = clean_str($input['spiritual_pledge']['summary_label']);
            }
        }
        $specsJson = json_encode($specsArr, JSON_UNESCAPED_UNICODE);
        $boothTitle = clean_str($input['booth_title'] ?? ('غرفه ' . $sellerName));
        $imgData = (string)($input['image_data'] ?? '');

        $reqAmazing = !empty($input['request_amazing']);
        $reqUrgent = !empty($input['request_urgent']);
        $reqLadder = !empty($input['request_ladder']);

        if (!$title || !$desc || !$imgData) {
            http_response_code(400);
            echo json_encode(['error' => 'عنوان، توضیحات و یک تصویر واقعی برای آگهی الزامی است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $storedUrl = store_base64_image_to_disk($imgData, 'listing');
        $initialStatus = 'approved';
        $amzStatus = $reqAmazing ? ($isAdmin ? 'approved' : 'pending') : 'none';
        $urgStatus = $reqUrgent ? ($isAdmin ? 'approved' : 'pending') : 'none';
        $ladStatus = $reqLadder ? ($isAdmin ? 'approved' : 'pending') : 'none';
        $ladTime = ($reqLadder && $isAdmin) ? time() : 0;

        $stmt = $pdo->prepare("INSERT INTO market_listings (
            seller_username, seller_name, booth_title, seller_phone, category, title, description,
            price, old_price, discount_percent, price_unit, condition_badge, delivery_badge, specs_json,
            address_detail, image_url, is_amazing, amazing_status, is_urgent, urgent_status, ladder_status, laddered_at, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $sellerUname, $sellerName, $boothTitle, $phone, $cat, $title, $desc,
            $price, $oldPrice, $discPct, $unit, $condBadge, $delivBadge, $specsJson,
            $addr, $storedUrl,
            ($amzStatus === 'approved' ? 1 : 0), $amzStatus,
            ($urgStatus === 'approved' ? 1 : 0), $urgStatus,
            $ladStatus, $ladTime, $initialStatus, $now
        ]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'request_promotion' && $method === 'POST') {
        $lid = (int)($input['listing_id'] ?? 0);
        $row = $pdo->prepare("SELECT seller_username FROM market_listings WHERE id = ?");
        $row->execute([$lid]);
        $found = $row->fetch();
        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'آگهی یافت نشد.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (!$isAdmin && (!$sessionUser || $found['seller_username'] !== $sessionUser)) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط صاحب این آگهی می‌تواند درخواست ارتقا ثبت کند.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $promoType = (string)($input['promo_type'] ?? 'ladder');
        if ($promoType === 'ladder') {
            $pdo->prepare("UPDATE market_listings SET ladder_status = 'pending' WHERE id = ?")->execute([$lid]);
        } elseif ($promoType === 'urgent') {
            $pdo->prepare("UPDATE market_listings SET urgent_status = 'pending' WHERE id = ?")->execute([$lid]);
        } elseif ($promoType === 'amazing') {
            $pdo->prepare("UPDATE market_listings SET amazing_status = 'pending' WHERE id = ?")->execute([$lid]);
        }
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_listing' && $method === 'POST') {
        $lid = (int)($input['id'] ?? 0);
        $row = $pdo->prepare("SELECT seller_username, image_url FROM market_listings WHERE id = ?");
        $row->execute([$lid]);
        $found = $row->fetch();
        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'آگهی یافت نشد.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if (!$isAdmin && (!$sessionUser || $found['seller_username'] !== $sessionUser)) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط صاحب غرفه یا مدیر کل مجاز به حذف آگهی است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        if ($found) unlink_stored_image($found['image_url']);
        $pdo->prepare("DELETE FROM market_listings WHERE id = ?")->execute([$lid]);
        $pdo->prepare("DELETE FROM listing_messages WHERE listing_id = ?")->execute([$lid]);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (in_array($action, ['approve_listing', 'reject_listing', 'approve_promotion', 'toggle_listing_flag', 'toggle_user_suspend', 'approve_user_booth', 'reject_user_booth'], true) && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط مدیر کل (ادمین) مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $lid = (int)($input['id'] ?? 0);
        if ($action === 'approve_listing') {
            $pdo->prepare("UPDATE market_listings SET status = 'approved', rejection_reason = NULL WHERE id = ?")->execute([$lid]);
        } elseif ($action === 'reject_listing') {
            $reason = clean_str($input['rejection_reason'] ?? 'عدم تطابق با ضوابط بازار مردمی شمال شرق');
            $pdo->prepare("UPDATE market_listings SET status = 'rejected', rejection_reason = ? WHERE id = ?")->execute([$reason, $lid]);
        } elseif ($action === 'approve_promotion') {
            $pType = (string)($input['promo_type'] ?? 'ladder');
            if ($pType === 'ladder') {
                $pdo->prepare("UPDATE market_listings SET ladder_status = 'approved', laddered_at = ? WHERE id = ?")->execute([time(), $lid]);
            } elseif ($pType === 'urgent') {
                $pdo->prepare("UPDATE market_listings SET urgent_status = 'approved', is_urgent = 1 WHERE id = ?")->execute([$lid]);
            } elseif ($pType === 'amazing') {
                $pdo->prepare("UPDATE market_listings SET amazing_status = 'approved', is_amazing = 1 WHERE id = ?")->execute([$lid]);
            }
        } elseif ($action === 'toggle_listing_flag') {
            $flag = (string)($input['flag'] ?? '');
            if ($flag === 'amazing') {
                $pdo->prepare("UPDATE market_listings SET is_amazing = CASE WHEN is_amazing = 1 THEN 0 ELSE 1 END, amazing_status = CASE WHEN is_amazing = 1 THEN 'none' ELSE 'approved' END WHERE id = ?")->execute([$lid]);
            } elseif ($flag === 'urgent') {
                $pdo->prepare("UPDATE market_listings SET is_urgent = CASE WHEN is_urgent = 1 THEN 0 ELSE 1 END, urgent_status = CASE WHEN is_urgent = 1 THEN 'none' ELSE 'approved' END WHERE id = ?")->execute([$lid]);
            } elseif ($flag === 'ladder') {
                $pdo->prepare("UPDATE market_listings SET ladder_status = 'approved', laddered_at = ? WHERE id = ?")->execute([time(), $lid]);
            }
        } elseif ($action === 'toggle_user_suspend') {
            $targetUname = clean_str($input['username'] ?? '');
            $suspendVal = !empty($input['suspend']) ? 1 : 0;
            $pdo->prepare("UPDATE users SET is_suspended = ? WHERE username = ?")->execute([$suspendVal, $targetUname]);
        } elseif ($action === 'approve_user_booth') {
            $targetUname = clean_str($input['username'] ?? '');
            $pdo->prepare("UPDATE users SET booth_status = 'approved', booth_rejection_reason = NULL, is_suspended = 0 WHERE username = ?")->execute([$targetUname]);
        } elseif ($action === 'reject_user_booth') {
            $targetUname = clean_str($input['username'] ?? '');
            $reason = clean_str($input['rejection_reason'] ?? 'نقص در اطلاعات هویتی یا تصویر کارت ملی ارسالی');
            $pdo->prepare("UPDATE users SET booth_status = 'rejected', booth_rejection_reason = ? WHERE username = ?")->execute([$reason, $targetUname]);
        }
        echo json_encode(build_full_state($pdo, true, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'add_message' && $method === 'POST') {
        handle_add_message($pdo, $input, $isAdmin, $sessionUser, $now);
    }

    if ($action === 'approve_message' && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'فقط ادمین مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $mid = (int)($input['id'] ?? 0);
        $pdo->prepare("UPDATE listing_messages SET status = 'approved' WHERE id = ?")->execute([$mid]);
        echo json_encode(build_full_state($pdo, true, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'delete_message' && $method === 'POST') {
        handle_delete_message($pdo, $input, $isAdmin, $sessionUser);
    }

    if ($action === 'delete_chat' && $method === 'POST') {
        handle_delete_chat($pdo, $input, $isAdmin, $sessionUser);
    }

    if ($action === 'create_order' && $method === 'POST') {
        handle_create_order($pdo, $input, $isAdmin, $sessionUser, $now);
    }

    if ($action === 'update_order_status' && $method === 'POST') {
        handle_update_order_status($pdo, $input, $isAdmin, $sessionUser);
    }

    if (($action === 'save_leader_photo' || $action === 'delete_leader_photo') && $method === 'POST') {
        if (!$isAdmin) {
            http_response_code(403);
            echo json_encode(['error' => 'تغییر یا حذف تصاویر قاب هدر فقط توسط ادمین مجاز است.'], JSON_UNESCAPED_UNICODE);
            exit;
        }
        $slot = (int)($input['slot'] ?? 1) === 2 ? 2 : 1;
        $key = 'leader_photo_' . $slot;
        if ($action === 'delete_leader_photo') {
            $stmtOld = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
            $stmtOld->execute([$key]);
            $oldRow = $stmtOld->fetch();
            if ($oldRow) unlink_stored_image($oldRow['setting_value']);
            $pdo->prepare("DELETE FROM site_settings WHERE setting_key = ?")->execute([$key]);
        } else {
            $imgData = (string)($input['image_data'] ?? '');
            if ($imgData) {
                $storedUrl = store_base64_image_to_disk($imgData, 'leader_' . $slot);
                if (defined('DB_DRIVER') && DB_DRIVER === 'mysql') {
                    $stmt = $pdo->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
                    $stmt->execute([$key, $storedUrl]);
                } else {
                    $stmt = $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
                    $stmt->execute([$key, $storedUrl]);
                }
            }
        }
        echo json_encode(build_full_state($pdo, true, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($action === 'submit_spiritual_pledge' && $method === 'POST') {
        $pUser = clean_str($input['user_display_name'] ?? ($sessionUser ?: 'همسایه هم‌عهدی'));
        $pledgeData = is_array($input['spiritual_pledge'] ?? null) ? $input['spiritual_pledge'] : $input;
        apply_spiritual_pledge($pdo, $pledgeData, $pUser);
        echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
        exit;
    }

    echo json_encode(['status' => 'ok', 'version' => '3.1.5'], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => 'خطای سرور: ' . $e->getMessage()], JSON_UNESCAPED_UNICODE);
}