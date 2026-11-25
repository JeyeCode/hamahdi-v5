<?php
declare(strict_types=1);

/**
 * کلاینت اختصاصی و استاندارد پیام‌رسان بله (Bale Bot API)
 * پشتیبانی دوگانه (Dual-Engine):
 * ۱. استفاده از PHP cURL (در صورت فعال بودن اکستنشن curl)
 * ۲. جایگزین خودکار با Native PHP HTTPS Stream (در صورت غیرفعال بودن curl در ویندوز)
 * ارسال مستقیم فایل تصویر به صورت Multipart/Form-Data به متد sendPhoto
 */

namespace BalePublisher;

use Exception;

class BaleClient
{
    private string $token;
    private string $baseUrl;
    private int $timeout;

    public function __construct(string $token, string $baseUrl = 'https://tapi.bale.ai/bot', int $timeout = 30)
    {
        $this->token = trim($token);
        $this->baseUrl = rtrim($baseUrl, '/') . $this->token;
        $this->timeout = $timeout;
    }

    /**
     * استانداردسازی شناسه کانال بله
     * تبدیل لینک‌های ble.ir/channel به @channel
     */
    public static function normalizeChannelId(string $chatId): string
    {
        $chatId = trim($chatId);
        if ($chatId === '') {
            return '';
        }

        if (preg_match('~^(?:https?://)?(?:www\.)?ble\.ir/([a-zA-Z0-9_]+)/?$~i', $chatId, $m)) {
            return '@' . $m[1];
        }

        if (!str_starts_with($chatId, '@') && !preg_match('/^-?\d+$/', $chatId)) {
            return '@' . ltrim($chatId, '/');
        }

        return $chatId;
    }

    /**
     * بررسی اعتبار توکن ربات و دریافت مشخصات ربات (getMe)
     */
    public function getMe(): array
    {
        $res = $this->requestJson('getMe');
        if (empty($res['ok'])) {
            $desc = $res['description'] ?? 'توکن ربات بله نامعتبر است.';
            throw new Exception('خطای احراز هویت ربات بله: ' . $desc);
        }

        return [
            'ok' => true,
            'id' => $res['result']['id'] ?? null,
            'username' => $res['result']['username'] ?? '',
            'first_name' => $res['result']['first_name'] ?? 'ربات بله',
        ];
    }

    /**
     * ارسال تصویر همراه با کپشن به کانال بله از طریق Multipart/Form-Data
     * با پشتیبانی خودکار از cURL و PHP Native Stream (بدون نیاز به تنظیم دستی php.ini)
     */
    public function sendPhotoMultipart(string $chatId, string $filePath, string $mimeType, string $caption = ''): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال بله (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل تصویر در سرور یافت نشد یا قابل خواندن نیست.');
        }

        $url = $this->baseUrl . '/sendPhoto';
        $caption = trim($caption);

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaCurl($url, $normalizedChatId, $filePath, $mimeType, $caption);
        } else {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaStream($url, $normalizedChatId, $filePath, $mimeType, $caption);
        }

        if ($transportErr !== null) {
            throw new Exception('خطای ارتباط شبکه با سرور بله: ' . $transportErr);
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ غیرمنتظره از سرور بله (کد HTTP: ' . $httpCode . ')');
        }

        if (empty($decoded['ok'])) {
            $errDesc = $decoded['description'] ?? 'خطای نامشخص از API بله';
            $errCode = $decoded['error_code'] ?? $httpCode;
            throw new Exception("خطای API بله (کد {$errCode}): {$errDesc} — لطفاً مطمئن شوید کلید ربات صحیح است و ربات در کانال ({$normalizedChatId}) مدیر است.");
        }

        $messageId = $decoded['result']['message_id'] ?? null;

        return [
            'ok' => true,
            'message_id' => $messageId !== null ? (string)$messageId : null,
            'chat_id' => $normalizedChatId,
            'raw' => $decoded,
        ];
    }

    /**
     * ارسال ویدیو یا فایل صوتی با همان ساختار Multipart مورد استفاده برای تصویر.
     * رسانه‌های جدید از متدهای مستقل Bot API ارسال می‌شوند؛ مسیر sendPhoto تغییر نکرده است.
     */
    public function sendMediaMultipart(string $chatId, string $filePath, string $mimeType, string $caption, string $mediaType): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال بله (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل رسانه در سرور یافت نشد یا قابل خواندن نیست.');
        }

        $mediaMap = [
            'video' => ['method' => 'sendVideo', 'field' => 'video'],
            'audio' => ['method' => 'sendAudio', 'field' => 'audio'],
        ];
        if (!isset($mediaMap[$mediaType])) {
            throw new Exception('نوع رسانه برای بله معتبر نیست.');
        }

        $method = $mediaMap[$mediaType]['method'];
        $fileField = $mediaMap[$mediaType]['field'];
        $url = $this->baseUrl . '/' . $method;
        $caption = trim($caption);

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaCurl(
                $url, $normalizedChatId, $filePath, $mimeType, $caption, $fileField
            );
        } else {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaStream(
                $url, $normalizedChatId, $filePath, $mimeType, $caption, $fileField
            );
        }

        if ($transportErr !== null) {
            throw new Exception('خطای ارتباط شبکه با سرور بله: ' . $transportErr);
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ غیرمنتظره از سرور بله در ' . $method . ' (HTTP ' . $httpCode . ')');
        }
        if (empty($decoded['ok'])) {
            $errDesc = $decoded['description'] ?? 'خطای نامشخص از API بله';
            $errCode = $decoded['error_code'] ?? $httpCode;
            throw new Exception("خطای API بله در {$method} (کد {$errCode}): {$errDesc} — مطمئن شوید ربات در کانال ({$normalizedChatId}) مدیر است.");
        }

        $messageId = $decoded['result']['message_id'] ?? null;
        return [
            'ok' => true,
            'message_id' => $messageId !== null ? (string)$messageId : null,
            'chat_id' => $normalizedChatId,
            'raw' => $decoded,
        ];
    }

    /**
     * روش اول ارسال Multipart: از طریق اکستنشن cURL
     */
    private function sendMultipartViaCurl(string $url, string $chatId, string $filePath, string $mimeType, string $caption, string $fileFieldName = 'photo'): array
    {
        $curlFile = new \CURLFile($filePath, $mimeType, basename($filePath));
        $postFields = [
            'chat_id' => $chatId,
            $fileFieldName => $curlFile,
            'caption' => $caption,
        ];

        $ch = \curl_init($url);
        \curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $postFields,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CONNECTTIMEOUT => 15,
            CURLOPT_PROXY => '',
            CURLOPT_NOPROXY => '*',
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_SSL_VERIFYHOST => 0,
        ]);

        $rawResponse = \curl_exec($ch);
        $curlErrNo = \curl_errno($ch);
        $curlError = \curl_error($ch);
        $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
        \curl_close($ch);

        if ($curlErrNo !== 0) {
            return ['', $httpCode, $curlError];
        }

        return [(string)$rawResponse, $httpCode, null];
    }

    /**
     * روش دوم ارسال Multipart (Fallback خودکار در صورت غیرفعال بودن cURL در ویندوز):
     * ساخت استاندارد بدنه Multipart/Form-Data با Boundary و ارسال از طریق PHP HTTPS Stream
     */
    private function sendMultipartViaStream(string $url, string $chatId, string $filePath, string $mimeType, string $caption, string $fileFieldName = 'photo'): array
    {
        $boundary = '----BaleBotFormBoundary' . bin2hex(random_bytes(10));
        $eol = "\r\n";
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            return ['', 0, 'عدم امکان خواندن فایل تصویر از دیسک.'];
        }

        $fileName = basename($filePath);
        $body = '';

        // فیلد chat_id
        $body .= '--' . $boundary . $eol;
        $body .= 'Content-Disposition: form-data; name="chat_id"' . $eol . $eol;
        $body .= $chatId . $eol;

        // فیلد caption
        if ($caption !== '') {
            $body .= '--' . $boundary . $eol;
            $body .= 'Content-Disposition: form-data; name="caption"' . $eol . $eol;
            $body .= $caption . $eol;
        }

        // فیلد فایل باینری (photo/video/audio)
        $body .= '--' . $boundary . $eol;
        $body .= 'Content-Disposition: form-data; name="' . $fileFieldName . '"; filename="' . addslashes($fileName) . '"' . $eol;
        $body .= 'Content-Type: ' . $mimeType . $eol . $eol;
        $body .= $fileContent . $eol;
        $body .= '--' . $boundary . '--' . $eol;

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: multipart/form-data; boundary={$boundary}\r\n"
                          . "Content-Length: " . strlen($body) . "\r\n"
                          . "Accept: application/json\r\n"
                          . "Connection: close\r\n",
                'content' => $body,
                'timeout' => $this->timeout,
                'ignore_errors' => true,
            ],
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
            ],
        ]);

        $rawResponse = @file_get_contents($url, false, $context);
        $httpCode = 200;
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $hdr) {
                if (preg_match('#^HTTP/\d+\.\d+\s+(\d+)#i', $hdr, $m)) {
                    $httpCode = (int)$m[1];
                }
            }
        }

        if ($rawResponse === false) {
            $lastErr = error_get_last()['message'] ?? 'عدم برقراری ارتباط HTTPS با tapi.bale.ai';
            return ['', 0, $lastErr];
        }

        return [(string)$rawResponse, $httpCode, null];
    }

    /**
     * ارسال درخواست JSON برای متدهای عمومی مانند getMe یا sendMessage
     */
    public function requestJson(string $method, array $payload = []): array
    {
        $url = $this->baseUrl . '/' . $method;
        $jsonBody = empty($payload) ? '{}' : json_encode($payload, JSON_UNESCAPED_UNICODE);

        if (function_exists('\curl_init')) {
            $ch = \curl_init($url);
            \curl_setopt_array($ch, [
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json',
                    'Accept: application/json',
                ],
                CURLOPT_POSTFIELDS => $jsonBody,
                CURLOPT_TIMEOUT => $this->timeout,
                CURLOPT_CONNECTTIMEOUT => 15,
                CURLOPT_PROXY => '',
                CURLOPT_NOPROXY => '*',
                CURLOPT_SSL_VERIFYPEER => false,
                CURLOPT_SSL_VERIFYHOST => 0,
            ]);

            $rawResponse = \curl_exec($ch);
            $curlErrNo = \curl_errno($ch);
            $curlError = \curl_error($ch);
            $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
            \curl_close($ch);

            if ($curlErrNo !== 0) {
                throw new Exception('خطای ارتباط با سرور بله: ' . $curlError);
            }
        } else {
            $context = stream_context_create([
                'http' => [
                    'method' => 'POST',
                    'header' => "Content-Type: application/json\r\nAccept: application/json\r\nContent-Length: " . strlen((string)$jsonBody) . "\r\nConnection: close\r\n",
                    'content' => $jsonBody,
                    'timeout' => $this->timeout,
                    'ignore_errors' => true,
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ],
            ]);
            $rawResponse = @file_get_contents($url, false, $context);
            $httpCode = 200;
            if ($rawResponse === false) {
                $lastErr = error_get_last()['message'] ?? 'خطای شبکه در ارتباط با سرور بله';
                throw new Exception('خطای ارتباط با سرور بله: ' . $lastErr);
            }
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ نامعتبر از سرور بله در متد ' . $method . ' (HTTP ' . $httpCode . ')');
        }

        return $decoded;
    }

    /**
     * ارسال پیام متنی به کانال یا گروه بله (متد sendMessage)
     */
    public function sendMessage(string $chatId, string $text): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال یا گروه بله مشخص نشده است.');
        }
        $res = $this->requestJson('sendMessage', [
            'chat_id' => $normalizedChatId,
            'text'    => trim($text),
        ]);
        if (empty($res['ok'])) {
            $desc = $res['description'] ?? 'ارسال پیام متنی در بله ناموفق بود (از ادمین بودن @Hamahdibot در کانال مطمئن شوید).';
            throw new Exception('خطای ارسال در بله: ' . $desc);
        }
        return [
            'ok'         => true,
            'message_id' => $res['result']['message_id'] ?? null,
            'chat_id'    => $normalizedChatId,
        ];
    }
}
