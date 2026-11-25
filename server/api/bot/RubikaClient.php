<?php
declare(strict_types=1);

/**
 * کلاینت رسمی و جامع روبیکا (نسخه ۳ - Rubika Bot API v3)
 * الگوبرداری مستقیم از فایل‌های rubika_client.py و bot.py
 *
 * قابلیت‌ها:
 * - موتور دوگانه (Dual-Engine): پشتیبانی همزمان از cURL و Native PHP HTTPS Stream
 * - بای‌پس کامل پروکسی سیستم و VPN جهت اتصال مستقیم به botapi.rubika.ir/v3
 * - مکانیزم تلاش مجدد خودکار (Retry + Exponential Backoff) روی خطاهای 429, 500, 502, 503, 504
 * - ارسال تصویر از طریق فرآیند ۳ مرحله‌ای رسمی روبیکا:
 *   1) requestSendFile (type = Image) -> دریافت upload_url
 *   2) آپلود باینری فایل (Multipart/Form-Data) به upload_url -> دریافت file_id
 *   3) فراخوانی sendFile (همراه با file_id و کپشن text) -> دریافت message_id
 * - قابلیت کشف خودکار شناسه کانال/چت (chat_id) از طریق getUpdates و getChat
 */

namespace BalePublisher;

use Exception;

class RubikaClient
{
    private string $token;
    private string $baseUrl;
    private int $timeout;
    private int $maxRetries;

    public function __construct(
        string $token,
        string $baseUrl = 'https://botapi.rubika.ir/v3',
        int $timeout = 25,
        int $maxRetries = 3
    ) {
        $this->token = trim($token);
        $this->baseUrl = rtrim($baseUrl, '/');
        $this->timeout = $timeout;
        $this->maxRetries = $maxRetries;
    }

    /**
     * ساخت URL متد مطابق با _build_url در rubika_client.py:
     * https://botapi.rubika.ir/v3/{token}/{method}
     */
    private function buildUrl(string $method): string
    {
        return $this->baseUrl . '/' . $this->token . '/' . $method;
    }

    /**
     * استانداردسازی شناسه چت یا کانال روبیکا
     */
    public static function normalizeChatId(string $chatId): string
    {
        $chatId = trim($chatId);
        if ($chatId === '') {
            return '';
        }
        // اگر لینک rubika.ir/channel وارد شده باشد
        if (preg_match('~^(?:https?://)?(?:www\.)?rubika\.ir/([a-zA-Z0-9_]+)/?$~i', $chatId, $m)) {
            return '@' . $m[1];
        }
        return $chatId;
    }

    /**
     * ارسال درخواست JSON به API نسخه ۳ روبیکا همراه با Retry خودکار
     * منطبق با متد request() در rubika_client.py
     */
    public function request(string $method, ?array $payload = null): array
    {
        $url = $this->buildUrl($method);
        $retryStatusCodes = [429, 500, 502, 503, 504];
        $attempt = 0;
        $backoffFactor = 0.5;
        $jsonBody = ($payload !== null && !empty($payload))
            ? json_encode($payload, JSON_UNESCAPED_UNICODE)
            : '{}';

        while (true) {
            $attempt++;
            if (function_exists('\curl_init')) {
                [$rawResponse, $httpCode, $netErr] = $this->postJsonViaCurl($url, (string)$jsonBody);
            } else {
                [$rawResponse, $httpCode, $netErr] = $this->postJsonViaStream($url, (string)$jsonBody);
            }

            if (($netErr !== null || in_array($httpCode, $retryStatusCodes, true)) && $attempt <= $this->maxRetries) {
                $sleepMicroSeconds = (int)($backoffFactor * (2 ** ($attempt - 1)) * 1000000);
                usleep($sleepMicroSeconds);
                continue;
            }

            if ($netErr !== null) {
                throw new Exception('خطای شبکه در اتصال به روبیکا (' . $method . '): ' . $netErr);
            }

            $data = json_decode((string)$rawResponse, true);
            if (!is_array($data)) {
                throw new Exception('پاسخ نامعتبر از سرور روبیکا در متد ' . $method . ' (HTTP ' . $httpCode . ')');
            }

            if (($data['status'] ?? null) === 'ERROR' || ($data['ok'] ?? true) === false) {
                $errMsg = $data['description']
                    ?? $data['message']
                    ?? $data['status_det']
                    ?? 'خطای برگشتی از API روبیکا';
                throw new Exception('خطای API روبیکا (' . $method . '): ' . (string)$errMsg);
            }

            return $data;
        }
    }

    /**
     * دریافت اطلاعات ربات (getMe) - مطابق با test_connection در bot.py
     */
    public function getMe(): array
    {
        $res = $this->request('getMe');
        $bot = $res['data']['bot'] ?? $res['bot'] ?? $res['data'] ?? [];

        return [
            'ok'         => true,
            'bot_id'     => $bot['bot_id'] ?? null,
            'username'   => $bot['username'] ?? '',
            'first_name' => $bot['bot_title'] ?? $bot['first_name'] ?? 'ربات روبیکا',
            'raw'        => $res,
        ];
    }

    /**
     * دریافت اطلاعات یک چت یا کانال با شناسه (getChat)
     */
    public function getChat(string $chatId): array
    {
        return $this->request('getChat', ['chat_id' => trim($chatId)]);
    }

    /**
     * دریافت آخرین رویدادها (getUpdates) - مطابق با rubika_client.py و bot.py
     * کاربرد ویژه در پنل: کشف خودکار شناسه کانال (c0...) پس از ارسال یک پیام در کانال
     */
    public function getUpdates(?string $offsetId = null, int $limit = 50): array
    {
        $payload = ['limit' => $limit];
        if ($offsetId !== null && $offsetId !== '') {
            $payload['offset_id'] = $offsetId;
        }

        $response = $this->request('getUpdates', $payload);
        $data = $response['data'] ?? [];
        $updates = $data['updates'] ?? $response['updates'] ?? $response['result'] ?? [];
        $nextOffset = $data['next_offset_id'] ?? $response['next_offset_id'] ?? null;

        return [
            'updates'        => is_array($updates) ? $updates : [],
            'next_offset_id' => $nextOffset,
        ];
    }

    /**
     * استخراج خودکار لیست چت‌ها و کانال‌های اخیر ربات از طریق getUpdates
     * تا کاربر به راحتی شناسه c0... کانال یا گروه روبیکای خود را پیدا کند
     */
    public function discoverRecentChats(): array
    {
        $res = $this->getUpdates(null, 50);
        $updates = $res['updates'] ?? [];
        $discovered = [];

        foreach ($updates as $upd) {
            $chatId = $upd['chat_id']
                ?? $upd['new_message']['chat_id']
                ?? $upd['updated_message']['chat_id']
                ?? null;

            if (!$chatId || isset($discovered[$chatId])) {
                continue;
            }

            $sampleText = $upd['new_message']['text']
                ?? $upd['updated_message']['text']
                ?? '';

            $chatType = 'نامشخص';
            if (str_starts_with((string)$chatId, 'c0')) {
                $chatType = 'کانال روبیکا (Channel)';
            } elseif (str_starts_with((string)$chatId, 'g0')) {
                $chatType = 'گروه روبیکا (Group)';
            } elseif (str_starts_with((string)$chatId, 'b0') || str_starts_with((string)$chatId, 'u0')) {
                $chatType = 'چت خصوصی (User/Bot)';
            }

            $title = $chatType;
            try {
                $chatInfo = $this->getChat((string)$chatId);
                $chatObj = $chatInfo['data']['chat'] ?? $chatInfo['chat'] ?? [];
                if (!empty($chatObj['title'])) {
                    $title = $chatObj['title'];
                } elseif (!empty($chatObj['first_name'])) {
                    $title = trim(($chatObj['first_name'] ?? '') . ' ' . ($chatObj['last_name'] ?? ''));
                }
            } catch (Exception $e) {
                // در صورت عدم پشتیبانی getChat برای آن شناسه، همان عنوان نوع چت حفظ می‌شود
            }

            $discovered[$chatId] = [
                'chat_id'     => (string)$chatId,
                'title'       => $title,
                'type'        => $chatType,
                'sample_text' => mb_substr((string)$sampleText, 0, 40, 'UTF-8'),
            ];
        }

        return array_values($discovered);
    }

    /**
     * ارسال پیام متنی (sendMessage) - مطابق با rubika_client.py
     */
    public function sendMessage(string $chatId, string $text, ?array $inlineKeypad = null): array
    {
        $payload = [
            'chat_id' => self::normalizeChatId($chatId),
            'text'    => trim($text),
        ];
        if ($inlineKeypad !== null) {
            $payload['inline_keypad'] = $inlineKeypad;
        }

        $res = $this->request('sendMessage', $payload);
        $msgId = $res['data']['message_id'] ?? $res['result']['message_id'] ?? $res['message_id'] ?? null;

        return [
            'ok'         => true,
            'message_id' => $msgId !== null ? (string)$msgId : null,
            'chat_id'    => $payload['chat_id'],
            'raw'        => $res,
        ];
    }

    /**
     * ارسال تصویر همراه با کپشن در روبیکا (فرآیند رسمی ۳ مرحله‌ای نسخه ۳):
     * ۱. requestSendFile (type: Image) -> دریافت upload_url
     * ۲. آپلود فایل باینری تصویر (Multipart/Form-Data) به upload_url -> دریافت file_id
     * ۳. sendFile (chat_id, file_id, text) -> انتشار در کانال و دریافت message_id
     */
    public function sendPhotoMultipart(string $chatId, string $filePath, string $mimeType, string $caption = ''): array
    {
        $normalizedChatId = self::normalizeChatId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال روبیکا (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل تصویر در سرور یافت نشد.');
        }

        // مرحله ۱: درخواست آدرس آپلود تصویر از روبیکا (requestSendFile)
        $reqUpload = $this->request('requestSendFile', ['type' => 'Image']);
        $uploadUrl = $reqUpload['data']['upload_url']
            ?? $reqUpload['upload_url']
            ?? null;

        if (empty($uploadUrl)) {
            throw new Exception('سرور روبیکا آدرس بارگذاری (upload_url) را در متد requestSendFile برنگرداند.');
        }

        // مرحله ۲: ارسال باینری فایل تصویر به upload_url با فیلد 'file'
        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$uploadRaw, $httpCode, $uploadErr] = $this->uploadBinaryViaCurl((string)$uploadUrl, $filePath, $mimeType);
        } else {
            [$uploadRaw, $httpCode, $uploadErr] = $this->uploadBinaryViaStream((string)$uploadUrl, $filePath, $mimeType);
        }

        if ($uploadErr !== null) {
            throw new Exception('خطا در بارگذاری فایل تصویر به سرور روبیکا: ' . $uploadErr);
        }

        $uploadData = json_decode((string)$uploadRaw, true);
        if (!is_array($uploadData)) {
            throw new Exception('پاسخ نامعتبر از سرور آپلود روبیکا (HTTP ' . $httpCode . ')');
        }

        $fileId = $uploadData['data']['file_id']
            ?? $uploadData['file_id']
            ?? null;

        if (empty($fileId)) {
            $errDetail = $uploadData['description'] ?? $uploadData['message'] ?? json_encode($uploadData, JSON_UNESCAPED_UNICODE);
            throw new Exception('خطا در دریافت file_id از سرور آپلود روبیکا: ' . $errDetail);
        }

        // مرحله ۳: ارسال فایل آپلودشده به کانال/چت مقصد با متد sendFile
        $sendPayload = [
            'chat_id' => $normalizedChatId,
            'file_id' => (string)$fileId,
        ];
        if (trim($caption) !== '') {
            $sendPayload['text'] = trim($caption);
        }

        $sendRes = $this->request('sendFile', $sendPayload);
        $messageId = $sendRes['data']['message_id']
            ?? $sendRes['result']['message_id']
            ?? $sendRes['message_id']
            ?? null;

        return [
            'ok'         => true,
            'message_id' => $messageId !== null ? (string)$messageId : (string)$fileId,
            'file_id'    => (string)$fileId,
            'chat_id'    => $normalizedChatId,
            'raw'        => $sendRes,
        ];
    }

    /**
     * ارسال ویدیو یا موزیک در روبیکا (requestSendFile -> upload -> sendFile).
     * نوع فایل مطابق Bot API v3: Video برای ویدیو و Music برای فایل صوتی/موزیک.
     */
    public function sendMediaMultipart(string $chatId, string $filePath, string $mimeType, string $caption, string $mediaType): array
    {
        $normalizedChatId = self::normalizeChatId($chatId);
        if ($normalizedChatId === '') {
            throw new Exception('شناسه کانال روبیکا (chat_id) تنظیم نشده است.');
        }
        if (!is_file($filePath) || !is_readable($filePath)) {
            throw new Exception('فایل رسانه در سرور یافت نشد.');
        }

        switch ($mediaType) {
            case 'video':
                $rubikaFileType = 'Video';
                break;
            case 'audio':
                $rubikaFileType = 'Music';
                break;
            default:
                throw new Exception('نوع رسانه برای روبیکا معتبر نیست.');
        }

        $reqUpload = $this->request('requestSendFile', ['type' => $rubikaFileType]);
        $uploadUrl = $reqUpload['data']['upload_url'] ?? $reqUpload['upload_url'] ?? null;
        if (empty($uploadUrl)) {
            throw new Exception('سرور روبیکا آدرس آپلود را در requestSendFile برنگرداند.');
        }

        if (function_exists('\curl_init') && class_exists('\CURLFile')) {
            [$uploadRaw, $httpCode, $uploadErr] = $this->uploadBinaryViaCurl((string)$uploadUrl, $filePath, $mimeType);
        } else {
            [$uploadRaw, $httpCode, $uploadErr] = $this->uploadBinaryViaStream((string)$uploadUrl, $filePath, $mimeType);
        }
        if ($uploadErr !== null) {
            throw new Exception('خطا در بارگذاری رسانه به سرور روبیکا: ' . $uploadErr);
        }

        $uploadData = json_decode((string)$uploadRaw, true);
        if (!is_array($uploadData)) {
            throw new Exception('پاسخ نامعتبر از سرور آپلود روبیکا (HTTP ' . $httpCode . ')');
        }
        $fileId = $uploadData['data']['file_id'] ?? $uploadData['file_id'] ?? null;
        if (empty($fileId)) {
            $detail = $uploadData['description'] ?? $uploadData['message'] ?? json_encode($uploadData, JSON_UNESCAPED_UNICODE);
            throw new Exception('file_id از سرور آپلود روبیکا دریافت نشد: ' . $detail);
        }

        $payload = ['chat_id' => $normalizedChatId, 'file_id' => (string)$fileId];
        if (trim($caption) !== '') {
            $payload['text'] = trim($caption);
        }
        $sendRes = $this->request('sendFile', $payload);
        $messageId = $sendRes['data']['message_id']
            ?? $sendRes['result']['message_id']
            ?? $sendRes['message_id']
            ?? null;

        return [
            'ok' => true,
            'message_id' => $messageId !== null ? (string)$messageId : (string)$fileId,
            'file_id' => (string)$fileId,
            'chat_id' => $normalizedChatId,
            'raw' => $sendRes,
        ];
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
                'User-Agent: RubikaBot/2.0',
            ],
            CURLOPT_POSTFIELDS => $jsonBody,
            CURLOPT_TIMEOUT => $this->timeout,
            CURLOPT_CONNECTTIMEOUT => 10,
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
                          . "User-Agent: RubikaBot/2.0\r\n"
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
            $err = error_get_last()['message'] ?? 'عدم برقراری ارتباط با botapi.rubika.ir';
            return ['', 0, $err];
        }
        return [(string)$rawResponse, $httpCode, null];
    }

    private function uploadBinaryViaCurl(string $uploadUrl, string $filePath, string $mimeType): array
    {
        $curlFile = new \CURLFile($filePath, $mimeType, basename($filePath));
        $ch = \curl_init($uploadUrl);
        \curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                'User-Agent: RubikaBot/2.0',
                'Accept: application/json',
            ],
            CURLOPT_POSTFIELDS => ['file' => $curlFile],
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

    private function uploadBinaryViaStream(string $uploadUrl, string $filePath, string $mimeType): array
    {
        $boundary = '----RubikaUploadBoundary' . bin2hex(random_bytes(10));
        $eol = "\r\n";
        $fileContent = file_get_contents($filePath);
        if ($fileContent === false) {
            return ['', 0, 'عدم امکان خواندن فایل تصویر از دیسک.'];
        }

        $fileName = basename($filePath);
        $body = '--' . $boundary . $eol
              . 'Content-Disposition: form-data; name="file"; filename="' . addslashes($fileName) . '"' . $eol
              . 'Content-Type: ' . $mimeType . $eol . $eol
              . $fileContent . $eol
              . '--' . $boundary . '--' . $eol;

        $context = stream_context_create([
            'http' => [
                'method' => 'POST',
                'header' => "Content-Type: multipart/form-data; boundary={$boundary}\r\n"
                          . "User-Agent: RubikaBot/2.0\r\n"
                          . "Accept: application/json\r\n"
                          . "Content-Length: " . strlen($body) . "\r\n"
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

        $rawResponse = @file_get_contents($uploadUrl, false, $context);
        $httpCode = 200;
        if (isset($http_response_header) && is_array($http_response_header)) {
            foreach ($http_response_header as $hdr) {
                if (preg_match('#^HTTP/\d+\.\d+\s+(\d+)#i', $hdr, $m)) {
                    $httpCode = (int)$m[1];
                }
            }
        }

        if ($rawResponse === false) {
            $err = error_get_last()['message'] ?? 'خطا در آپلود استریم به سرور روبیکا';
            return ['', 0, $err];
        }
        return [(string)$rawResponse, $httpCode, null];
    }
}
