<?php
declare(strict_types=1);

/**
 * کلاینت اختصاصی و استاندارد پیام‌رسان ایتا (وب‌سرویس رسمی ایتایار - eitaayar.ir)
 * آدرس پایه: https://eitaayar.ir/api/{TOKEN}/{METHOD}
 *
 * قابلیت‌ها:
 * - موتور دوگانه (Dual-Engine): پشتیبانی از cURL (CURLFile) و Native PHP HTTPS Stream
 * - استانداردسازی خودکار شناسه کانال ایتا (حذف @ و لینک eitaa.com/ مطابق مستندات ایتایار)
 * - متد getMe جهت تست صحت توکن دریافتی از پنل ایتایار
 * - متد sendFile جهت ارسال مستقیم فایل تصویر باینری (Multipart/Form-Data) همراه با کپشن (caption)
 * - متد sendMessage جهت ارسال پیام متنی
 */

namespace BalePublisher;

use Exception;

class EitaaClient
{
    private string $token;
    private string $baseUrl;
    private int $timeout;

    public function __construct(
        string $token,
        string $baseUrl = 'https://eitaayar.ir/api',
        int $timeout = 30
    ) {
        $this->token = trim($token);
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
    }

    private function buildUrl(string $method): string
    {
        return $this->baseUrl . '/' . $this->token . '/' . $method;
    }

    /**
     * استانداردسازی شناسه کانال ایتا مطابق مستندات رسمی API ایتایار:
     * در ایتایار، chat_id یا شناسه عددی کانال است (مثلاً 1404) و یا آیدی کانال بدون @ (مثلاً pakfamjam_official)
     */
    public static function normalizeChannelId(string $chatId): string
    {
        $chatId = trim($chatId);
        if ($chatId === '') {
            return '';
        }

        // تبدیل لینک‌های https://eitaa.com/my_channel به my_channel
        if (preg_match('~^(?:https?://)?(?:www\.)?eitaa\.com/([a-zA-Z0-9_]+)/?$~i', $chatId, $m)) {
            return $m[1];
        }

        // حذف @ از ابتدای نام کاربری کانال (چون ایتایار آیدی کانال را بدون @ می‌پذیرد)
        return ltrim($chatId, '@/');
    }

    /**
     * بررسی صحت توکن ایتایار با متد getMe
     */
    public function getMe(): array
    {
        $url = $this->buildUrl('getMe');
        if (function_exists('\curl_init')) {
            [$raw, $httpCode, $err] = $this->postJsonViaCurl($url, '{}');
        } else {
            [$raw, $httpCode, $err] = $this->postJsonViaStream($url, '{}');
        }

        if ($err !== null) {
            throw new Exception('خطای ارتباط شبکه با سرور ایتایار (eitaayar.ir): ' . $err);
        }

        $decoded = json_decode((string)$raw, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ نامعتبر از سرور ایتایار در متد getMe (HTTP ' . $httpCode . ')');
        }

        if (empty($decoded['ok'])) {
            $desc = $decoded['description'] ?? 'توکن ایتایار نامعتبر است.';
            throw new Exception('خطای احراز هویت ایتایار: ' . (string)$desc);
        }

        $result = $decoded['result'] ?? [];
        return [
            'ok'         => true,
            'id'         => $result['id'] ?? null,
            'username'   => $result['username'] ?? 'eitaayar_bot',
            'first_name' => $result['first_name'] ?? 'ربات ایتایار',
            'raw'        => $decoded,
        ];
    }

    /**
     * ارسال تصویر همراه با کپشن به کانال ایتا از طریق متد رسمی sendFile
     * ارسال مستقیم فایل باینری در فیلد 'file' به صورت Multipart/Form-Data
     */
    public function sendPhotoMultipart(string $chatId, string $filePath, string $mimeType, string $caption = ''): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال ایتا (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل تصویر در سرور یافت نشد یا قابل خواندن نیست.');
        }

        $url = $this->buildUrl('sendFile');
        $caption = trim($caption);
        $title = basename($filePath);

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaCurl(
                $url,
                $normalizedChatId,
                $filePath,
                $mimeType,
                $caption,
                $title
            );
        } else {
            [$rawResponse, $httpCode, $transportErr] = $this->sendMultipartViaStream(
                $url,
                $normalizedChatId,
                $filePath,
                $mimeType,
                $caption,
                $title
            );
        }

        if ($transportErr !== null) {
            throw new Exception('خطای ارتباط شبکه با سرور ایتایار: ' . $transportErr);
        }

        $decoded = json_decode((string)$rawResponse, true);
        if (!is_array($decoded)) {
            throw new Exception('پاسخ غیرمنتظره از سرور ایتایار (HTTP ' . $httpCode . ')');
        }

        if (empty($decoded['ok'])) {
            $errDesc = $decoded['description'] ?? $decoded['message'] ?? 'خطای نامشخص از API ایتایار';
            throw new Exception("خطای API ایتایار: {$errDesc} — مطمئن شوید کانال ({$normalizedChatId}) در پنل eitaayar.ir ثبت شده و ربات ایتایار در کانال شما مدیر است.");
        }

        $messageId = $decoded['result']['message_id'] ?? $decoded['message_id'] ?? null;

        return [
            'ok'         => true,
            'message_id' => $messageId !== null ? (string)$messageId : 'sent',
            'chat_id'    => $normalizedChatId,
            'raw'        => $decoded,
        ];
    }

    /**
     * sendFile ایتایار برای انواع رسانه استفاده می‌شود؛ این wrapper مسیر Multipart موجود را حفظ می‌کند.
     */
    public function sendMediaMultipart(string $chatId, string $filePath, string $mimeType, string $caption, string $mediaType): array
    {
        if (!in_array($mediaType, ['video', 'audio'], true)) {
            throw new Exception('نوع رسانه برای ایتا معتبر نیست.');
        }
        return $this->sendPhotoMultipart($chatId, $filePath, $mimeType, $caption);
    }

    /**
     * ارسال پیام متنی به کانال ایتا (متد sendMessage)
     */
    public function sendMessage(string $chatId, string $text): array
    {
        $normalizedChatId = self::normalizeChannelId($chatId);
        $url = $this->buildUrl('sendMessage');
        $jsonBody = json_encode([
            'chat_id' => $normalizedChatId,
            'text'    => trim($text),
        ], JSON_UNESCAPED_UNICODE);

        if (function_exists('\curl_init')) {
            [$raw, $httpCode, $err] = $this->postJsonViaCurl($url, (string)$jsonBody);
        } else {
            [$raw, $httpCode, $err] = $this->postJsonViaStream($url, (string)$jsonBody);
        }

        if ($err !== null) {
            throw new Exception('خطای ارتباط با سرور ایتایار: ' . $err);
        }

        $decoded = json_decode((string)$raw, true);
        if (!is_array($decoded) || empty($decoded['ok'])) {
            $desc = $decoded['description'] ?? 'خطا در ارسال پیام به ایتا';
            throw new Exception((string)$desc);
        }

        $msgId = $decoded['result']['message_id'] ?? null;
        return [
            'ok'         => true,
            'message_id' => $msgId !== null ? (string)$msgId : 'sent',
            'chat_id'    => $normalizedChatId,
            'raw'        => $decoded,
        ];
    }

    private function sendMultipartViaCurl(
        string $url,
        string $chatId,
        string $filePath,
        string $mimeType,
        string $caption,
        string $title
    ): array {
        $curlFile = new \CURLFile($filePath, $mimeType, basename($filePath));
        $postFields = [
            'chat_id' => $chatId,
            'file'    => $curlFile,
            'caption' => $caption,
            'title'   => $title,
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
        $errNo = \curl_errno($ch);
        $errMsg = \curl_error($ch);
        $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
        \curl_close($ch);

        if ($errNo !== 0) {
            return ['', $httpCode, $errMsg];
        }
        return [(string)$rawResponse, $httpCode, null];
    }

    private function sendMultipartViaStream(
        string $url,
        string $chatId,
        string $filePath,
        string $mimeType,
        string $caption,
        string $title
    ): array {
        $boundary = '----EitaaYarFormBoundary' . bin2hex(random_bytes(10));
        $eol = "\r\n";
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            return ['', 0, 'عدم امکان خواندن فایل تصویر از دیسک.'];
        }

        $fileName = basename($filePath);
        $body = '';

        // ۱. فیلد chat_id
        $body .= '--' . $boundary . $eol
               . 'Content-Disposition: form-data; name="chat_id"' . $eol . $eol
               . $chatId . $eol;

        // ۲. فیلد caption
        if ($caption !== '') {
            $body .= '--' . $boundary . $eol
                   . 'Content-Disposition: form-data; name="caption"' . $eol . $eol
                   . $caption . $eol;
        }

        // ۳. فیلد title
        $body .= '--' . $boundary . $eol
               . 'Content-Disposition: form-data; name="title"' . $eol . $eol
               . $title . $eol;

        // ۴. فیلد فایل باینری file (در ایتایار نام فیلد فایل 'file' است)
        $body .= '--' . $boundary . $eol
               . 'Content-Disposition: form-data; name="file"; filename="' . addslashes($fileName) . '"' . $eol
               . 'Content-Type: ' . $mimeType . $eol . $eol
               . $fileContent . $eol
               . '--' . $boundary . '--' . $eol;

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
            $err = error_get_last()['message'] ?? 'عدم برقراری ارتباط با eitaayar.ir';
            return ['', 0, $err];
        }

        return [(string)$rawResponse, $httpCode, null];
    }

    private function postJsonViaCurl(string $url, string $jsonBody): array
    {
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
        $errNo = \curl_errno($ch);
        $errMsg = \curl_error($ch);
        $httpCode = (int)\curl_getinfo($ch, CURLINFO_HTTP_CODE);
        \curl_close($ch);

        if ($errNo !== 0) {
            return ['', $httpCode, $errMsg];
        }
        return [(string)$rawResponse, $httpCode, null];
    }

    private function postJsonViaStream(string $url, string $jsonBody): array
    {
        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: application/json\r\n"
                          . "Accept: application/json\r\n"
                          . "Content-Length: " . strlen($jsonBody) . "\r\n"
                          . "Connection: close\r\n",
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
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $hdr) {
                if (preg_match('#^HTTP/\d+\.\d+\s+(\d+)#i', $hdr, $m)) {
                    $httpCode = (int)$m[1];
                }
            }
        }

        if ($rawResponse === false) {
            $err = error_get_last()['message'] ?? 'عدم برقراری ارتباط با eitaayar.ir';
            return ['', 0, $err];
        }
        return [(string)$rawResponse, $httpCode, null];
    }
}
