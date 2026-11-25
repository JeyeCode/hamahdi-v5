<?php
declare(strict_types=1);

/**
 * کلاینت اختصاصی و هوشمند پیام‌رسان تلگرام (Telegram Bot API)
 * آدرس پایه: https://api.telegram.org/bot{TOKEN}/{METHOD}
 *
 * ویژگی‌های کلیدی برای اجرا در ایران (ویندوز و هاست):
 * ۱. تشخیص خودکار پورت VPN فعال در ویندوز (v2rayN, Nekoray, Clash روی پورت‌های 10809, 10808, 2080, 7890, 1080)
 *    در صورتی که اتصال مستقیم به api.telegram.org فیلتر باشد!
 * ۲. ارسال مستقیم فایل تصویر باینری به صورت Multipart/Form-Data به متد sendPhoto
 * ۳. پشتیبانی کامل از تگ‌های HTML در کپشن (<b>, <i>, <a href="...">) و تبدیل خودکار لینک‌های مارک‌داون
 * ۴. استانداردسازی خودکار شناسه کانال (تبدیل لینک t.me/channel به @channel)
 */

namespace BalePublisher;

use Exception;

class TelegramClient
{
    private string $token;
    private string $baseUrl;
    private int $timeout;
    private ?string $proxyUrl;

    public function __construct(
        string $token,
        ?string $proxyUrl = null,
        string $baseUrl = 'https://api.telegram.org/bot',
        int $timeout = 30
    ) {
        $this->token = trim($token);
        $this->baseUrl = rtrim($baseUrl, '/') . $this->token;
        $this->timeout = $timeout;
        $this->proxyUrl = ($proxyUrl !== null && trim($proxyUrl) !== '') ? trim($proxyUrl) : null;
    }

    /**
     * استانداردسازی شناسه کانال تلگرام
     * تبدیل t.me/pakfamjam_official به @pakfamjam_official
     */
    public static function normalizeChannelId(string $chatId): string
    {
        $chatId = trim($chatId);
        if ($chatId === '') {
            return '';
        }

        if (preg_match('~^(?:https?://)?(?:www\.)?(?:t\.me|telegram\.me)/([a-zA-Z0-9_]+)/?$~i', $chatId, $m)) {
            return '@' . $m[1];
        }

        if (!str_starts_with($chatId, '@') && !preg_match('/^-?\d+$/', $chatId)) {
            return '@' . ltrim($chatId, '/');
        }

        return $chatId;
    }

    /**
     * تبدیل خودکار مارک‌داون (**بولد** و [لینک](url)) به HTML استاندارد تلگرام (مطابق TelegramBot.py)
     */
    public static function formatHtmlCaption(string $text): string
    {
        if (trim($text) === '') {
            return '';
        }

        $text = (string)preg_replace_callback(
            '/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/u',
            function (array $m): string {
                $title = htmlspecialchars(trim($m[1]), ENT_QUOTES, 'UTF-8');
                $url = htmlspecialchars(trim($m[2]), ENT_QUOTES, 'UTF-8');
                return '<a href="' . $url . '">' . $title . '</a>';
            },
            $text
        );

        $text = (string)preg_replace('/\*\*(.*?)\*\*/us', '<b>$1</b>', $text);
        return trim($text);
    }

    /**
     * تشخیص هوشمند پورت لوکال VPN در ویندوز (v2rayN / Nekoray / Clash)
     * در صورتی که کاربر پروکسی دستی وارد نکرده باشد
     */
    public function resolveEffectiveProxy(): ?string
    {
        if ($this->proxyUrl !== null && $this->proxyUrl !== '') {
            return $this->proxyUrl;
        }

        $candidates = [
            ['host' => '127.0.0.1', 'port' => 10809, 'scheme' => 'http://127.0.0.1:10809'],    // v2rayN HTTP
            ['host' => '127.0.0.1', 'port' => 10808, 'scheme' => 'socks5h://127.0.0.1:10808'], // v2rayN SOCKS5
            ['host' => '127.0.0.1', 'port' => 2080,  'scheme' => 'http://127.0.0.1:2080'],     // Nekoray HTTP
            ['host' => '127.0.0.1', 'port' => 7890,  'scheme' => 'http://127.0.0.1:7890'],     // Clash HTTP
            ['host' => '127.0.0.1', 'port' => 1080,  'scheme' => 'socks5h://127.0.0.1:1080'],  // Standard SOCKS5
        ];

        foreach ($candidates as $c) {
            $fp = @fsockopen($c['host'], $c['port'], $errno, $errstr, 0.08);
            if ($fp !== false) {
                fclose($fp);
                return $c['scheme'];
            }
        }

        return null;
    }

    /**
     * بررسی اعتبار توکن ربات تلگرام با متد getMe
     */
    public function getMe(): array
    {
        $url = $this->baseUrl . '/getMe';
        $res = $this->requestJson($url, []);

        if (empty($res['ok'])) {
            $desc = $res['description'] ?? 'توکن ربات تلگرام نامعتبر است.';
            throw new Exception('خطای احراز هویت تلگرام: ' . (string)$desc);
        }

        $result = $res['result'] ?? [];
        return [
            'ok'            => true,
            'id'            => $result['id'] ?? null,
            'username'      => $result['username'] ?? '',
            'first_name'    => $result['first_name'] ?? 'ربات تلگرام',
            'detected_proxy' => $this->resolveEffectiveProxy(),
        ];
    }

    /**
     * ارسال تصویر همراه با کپشن به کانال تلگرام از طریق Multipart/Form-Data (متد sendPhoto)
     */
    public function sendPhotoMultipart(string $chatId, string $filePath, string $mimeType, string $caption = ''): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال تلگرام (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل تصویر در سرور یافت نشد.');
        }

        $url = $this->baseUrl . '/sendPhoto';
        $htmlCaption = self::formatHtmlCaption($caption);

        $fields = [
            'chat_id'    => $normalizedChatId,
            'caption'    => $htmlCaption,
            'parse_mode' => 'HTML',
        ];

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaCurl($url, $fields, $filePath, $mimeType);
        } else {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaStream($url, $fields, $filePath, $mimeType);
        }

        if ($transportErr !== null) {
            throw new Exception(
                'خطای اتصال به سرور تلگرام: ' . $transportErr . ' — لطفاً مطمئن شوید VPN شما روشن است یا پورت پروکسی (مثلاً http://127.0.0.1:10809) را در کارت تلگرام وارد کنید.'
            );
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ نامعتبر از سرور تلگرام (HTTP ' . $httpCode . ')');
        }

        if (empty($decoded['ok'])) {
            $errDesc = $decoded['description'] ?? 'خطای نامشخص از API تلگرام';
            $errCode = $decoded['error_code'] ?? $httpCode;
            throw new Exception("خطای API تلگرام (کد {$errCode}): {$errDesc} — مطمئن شوید ربات در کانال ({$normalizedChatId}) ادمین است.");
        }

        $messageId = $decoded['result']['message_id'] ?? null;

        return [
            'ok'         => true,
            'message_id' => $messageId !== null ? (string)$messageId : 'sent',
            'chat_id'    => $normalizedChatId,
            'raw'        => $decoded,
        ];
    }

    /**
     * ارسال ویدیو MP4 یا فایل صوتی MP3/M4A از طریق متدهای رسمی Bot API.
     * مسیر sendPhotoMultipart موجود عمداً مستقل نگه داشته شده است.
     */
    public function sendMediaMultipart(string $chatId, string $filePath, string $mimeType, string $caption, string $mediaType): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال تلگرام (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل رسانه در سرور یافت نشد یا قابل خواندن نیست.');
        }

        $mediaMap = [
            'video' => ['method' => 'sendVideo', 'field' => 'video'],
            'audio' => ['method' => 'sendAudio', 'field' => 'audio'],
        ];
        if (!isset($mediaMap[$mediaType])) {
            throw new Exception('نوع رسانه برای تلگرام معتبر نیست.');
        }

        $method = $mediaMap[$mediaType]['method'];
        $fileField = $mediaMap[$mediaType]['field'];
        $url = $this->baseUrl . '/' . $method;
        $fields = [
            'chat_id' => $normalizedChatId,
            'caption' => self::formatHtmlCaption(trim($caption)),
            'parse_mode' => 'HTML',
        ];

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaCurl(
                $url, $fields, $filePath, $mimeType, $fileField
            );
        } else {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaStream(
                $url, $fields, $filePath, $mimeType, $fileField
            );
        }

        if ($transportErr !== null) {
            throw new Exception(
                'خطای اتصال به سرور تلگرام: ' . $transportErr . ' — VPN یا پروکسی تنظیم‌شده را بررسی کنید.'
            );
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ نامعتبر از سرور تلگرام در ' . $method . ' (HTTP ' . $httpCode . ')');
        }
        if (empty($decoded['ok'])) {
            $errDesc = $decoded['description'] ?? 'خطای نامشخص از API تلگرام';
            $errCode = $decoded['error_code'] ?? $httpCode;
            throw new Exception("خطای API تلگرام در {$method} (کد {$errCode}): {$errDesc} — مطمئن شوید ربات در کانال ({$normalizedChatId}) ادمین است.");
        }

        $messageId = $decoded['result']['message_id'] ?? null;
        return [
            'ok' => true,
            'message_id' => $messageId !== null ? (string)$messageId : 'sent',
            'chat_id' => $normalizedChatId,
            'raw' => $decoded,
        ];
    }

    private function sendMultipartViaCurl(string $url, array $fields, string $filePath, string $mimeType, string $fileFieldName = 'photo'): array
    {
        $curlFile = new \CURLFile($filePath, $mimeType, basename($filePath));
        $postFields = $fields;
        $postFields[$fileFieldName] = $curlFile;

        $effectiveProxy = $this->resolveEffectiveProxy();

        $ch = \curl_init($url);
        $options = [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $postFields,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
        ];

        if ($effectiveProxy !== null) {
            $options[CURLOPT_PROXY] = $effectiveProxy;
        }

        \curl_setopt_array($ch, $options);
        $rawResponse = \curl_exec($ch);
        $errNo = \curl_errno($ch);
        $errMsg = \curl_error($ch);
        $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
        \curl_close($ch);

        // اگر با پروکسی خودکار خطا داد، یک بار هم بدون پروکسی (برای حالت TUN VPN) امتحان کن
        if ($errNo !== 0 && $this->proxyUrl === null && $effectiveProxy !== null) {
            $ch2 = \curl_init($url);
            unset($options[CURLOPT_PROXY]);
            $options[CURLOPT_PROXY] = '';
            $options[CURLOPT_NOPROXY] = '*';
            \curl_setopt_array($ch2, $options);
            $rawResponse = \curl_exec($ch2);
            $errNo = \curl_errno($ch2);
            $errMsg = \curl_error($ch2);
            $httpCode = (int)\curl_getinfo($ch2, CURLINFO_HTTP_CODE);
            \curl_close($ch2);
        }

        if ($errNo !== 0) {
            return ['', $httpCode, $errMsg];
        }
        return [(string)$rawResponse, $httpCode, null];
    }

    private function sendMultipartViaStream(string $url, array $fields, string $filePath, string $mimeType, string $fileFieldName = 'photo'): array
    {
        $boundary = '----TelegramFormBoundary' . bin2hex(random_bytes(10));
        $eol = "\r\n";
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            return ['', 0, 'عدم امکان خواندن فایل تصویر از دیسک.'];
        }

        $fileName = basename($filePath);
        $body = '';

        foreach ($fields as $k => $v) {
            if ($v === '' || $v === null) {
                continue;
            }
            $body .= '--' . $boundary . $eol
                   . 'Content-Disposition: form-data; name="' . $k . '"' . $eol . $eol
                   . $v . $eol;
        }

        $body .= '--' . $boundary . $eol
               . 'Content-Disposition: form-data; name="' . $fileFieldName . '"; filename="' . addslashes($fileName) . '"' . $eol
               . 'Content-Type: ' . $mimeType . $eol . $eol
               . $fileContent . $eol
               . '--' . $boundary . '--' . $eol;

        $httpOpts = [
            'method' => 'POST',
            'header' => "Content-Type: multipart/form-data; boundary={$boundary}\r\n"
                      . "Content-Length: " . strlen($body) . "\r\n"
                      . "Accept: application/json\r\n"
                      . "Connection: close\r\n",
            'content' => $body,
            'timeout' => $this->timeout,
            'ignore_errors' => true,
        ];

        $effectiveProxy = $this->resolveEffectiveProxy();
        if ($effectiveProxy !== null && str_starts_with($effectiveProxy, 'http://')) {
            $httpOpts['proxy'] = str_replace('http://', 'tcp://', $effectiveProxy);
            $httpOpts['request_fulluri'] = true;
        }

        $context = stream_context_create([
            'http' => $httpOpts,
            'ssl'  => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);

        $rawResponse = @file_get_contents($url, false, $context);
        if ($rawResponse === false && isset($httpOpts['proxy'])) {
            unset($httpOpts['proxy'], $httpOpts['request_fulluri']);
            $context2 = stream_context_create([
                'http' => $httpOpts,
                'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
            ]);
            $rawResponse = @file_get_contents($url, false, $context2);
        }

        $httpCode = 200;
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $hdr) {
                if (preg_match('#^HTTP/\d+\.\d+\s+(\d+)#i', $hdr, $m)) {
                    $httpCode = (int)$m[1];
                }
            }
        }

        if ($rawResponse === false) {
            $err = error_get_last()['message'] ?? 'عدم دسترسی به api.telegram.org';
            return ['', 0, $err];
        }

        return [(string)$rawResponse, $httpCode, null];
    }

    public function requestJson(string $url, array $payload): array
    {
        $jsonBody = empty($payload) ? '{}' : json_encode($payload, JSON_UNESCAPED_UNICODE);
        $effectiveProxy = $this->resolveEffectiveProxy();

        if (function_exists('\curl_init')) {
            $ch = \curl_init($url);
            $options = [
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                ],
                CURLOPT_POSTFIELDS => $jsonBody,
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 15,
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ];
            if ($effectiveProxy !== null) {
                $options[CURLOPT_PROXY] = $effectiveProxy;
            }
            \curl_setopt_array($ch, $options);
            $rawResponse = \curl_exec($ch);
            $errNo = \curl_errno($ch);
            $errMsg = \curl_error($ch);
            $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
            \curl_close($ch);

            if ($errNo !== 0 && $this->proxyUrl === null && $effectiveProxy !== null) {
                $ch2 = \curl_init($url);
                unset($options[CURLOPT_PROXY]);
                $options[CURLOPT_PROXY] = '';
                $options[CURLOPT_NOPROXY] = '*';
                \curl_setopt_array($ch2, $options);
                $rawResponse = \curl_exec($ch2);
                $errNo = \curl_errno($ch2);
                $errMsg = \curl_error($ch2);
                $httpCode = (int)\curl_getinfo($ch2, CURLINFO_HTTP_CODE);
                \curl_close($ch2);
            }

            if ($errNo !== 0) {
                throw new Exception('خطای اتصال به تلگرام: ' . $errMsg);
            }
        } else {
            $httpOpts = [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\nAccept: application/json\r\nContent-Length: " . strlen((string)$jsonBody) . "\r\nConnection: close\r\n",
                'content' => $jsonBody,
                'timeout' => $this->timeout,
                'ignore_errors' => true,
            ];
            if ($effectiveProxy !== null && str_starts_with($effectiveProxy, 'http://')) {
                $httpOpts['proxy'] = str_replace('http://', 'tcp://', $effectiveProxy);
                $httpOpts['request_fulluri'] = true;
            }
            $context = stream_context_create([
                'http' => $httpOpts,
                'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
            ]);
            $rawResponse = @file_get_contents($url, false, $context);
            if ($rawResponse === false && isset($httpOpts['proxy'])) {
                unset($httpOpts['proxy'], $httpOpts['request_fulluri']);
                $context2 = stream_context_create([
                    'http' => $httpOpts,
                    'ssl'  => ['verify_peer' => false, 'verify_peer_name' => false],
                ]);
                $rawResponse = @file_get_contents($url, false, $context2);
            }
            $httpCode = 200;
            if ($rawResponse === false) {
                $err = error_get_last()['message'] ?? 'عدم دسترسی به api.telegram.org';
                throw new Exception('خطای اتصال به تلگرام: ' . $err);
            }
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ نامعتبر از تلگرام (HTTP ' . $httpCode . ')');
        }
        return $decoded;
    }

    /**
     * ارسال پیام متنی به کانال یا گروه تلگرام (متد sendMessage)
     */
    public function sendMessage(string $chatId, string $text): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال یا گروه تلگرام مشخص نشده است.');
        }
        $res = $this->requestJson($this->baseUrl . '/sendMessage', [
            'chat_id'    => $normalizedChatId,
            'text'       => self::formatHtmlCaption($text),
            'parse_mode' => 'HTML',
        ]);
        if (empty($res['ok'])) {
            $desc = $res['description'] ?? 'ارسال پیام متنی در تلگرام ناموفق بود.';
            throw new Exception('خطای ارسال در تلگرام: ' . $desc);
        }
        return [
            'ok'         => true,
            'message_id' => $res['result']['message_id'] ?? null,
            'chat_id'    => $normalizedChatId,
        ];
    }
}
