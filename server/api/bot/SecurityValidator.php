<?php
declare(strict_types=1);

/**
 * ماژول امنیت، اعتبارسنجی فایل، محافظت CSRF و جلوگیری از ارسال تکراری
 */

namespace BalePublisher;

use Exception;

class SecurityValidator
{
    private array $config;

    public function __construct(array $config)
    {
        $this->config = $config;
        $this->ensureDirectoriesProtected();
    }

    /**
     * ایجاد پوشه‌های uploads و storage و محافظت از آن‌ها در برابر اجرای کد یا دسترسی مستقیم
     */
    private function ensureDirectoriesProtected(): void
    {
        $uploadsDir = $this->config['uploads_dir'];
        $storageDir = $this->config['storage_dir'];

        if (!is_dir($uploadsDir)) {
            @mkdir($uploadsDir, 0755, true);
        }
        if (!is_dir($storageDir)) {
            @mkdir($storageDir, 0755, true);
        }

        // جلوگیری از اجرای اسکریپت‌های PHP در پوشه آپلود
        $uploadsHtaccess = $uploadsDir . '/.htaccess';
        if (!file_exists($uploadsHtaccess)) {
            @file_put_contents(
                $uploadsHtaccess,
                "Options -Indexes\n<FilesMatch \"\\.(php|php5|php7|php8|phtml|pl|py|cgi|sh)$\">\n    Deny from all\n</FilesMatch>\n"
            );
        }

        // محافظت کامل از پوشه storage (حاوی لاگ‌ها و تنظیمات محلی)
        $storageHtaccess = $storageDir . '/.htaccess';
        if (!file_exists($storageHtaccess)) {
            @file_put_contents($storageHtaccess, "Order allow,deny\nDeny from all\n");
        }
    }

    /**
     * تولید یا دریافت توکن CSRF نشست فعلی
     */
    public static function getCsrfToken(): string
    {
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
        if (empty($_SESSION['csrf_token'])) {
            $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        }
        return (string)$_SESSION['csrf_token'];
    }

    /**
     * بررسی صحت توکن CSRF ارسال‌شده از فرانت‌اند
     */
    public static function verifyCsrfToken(?string $token): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            @session_start();
        }
        $expected = $_SESSION['csrf_token'] ?? '';
        if ($expected === '' || $token === null || !hash_equals($expected, $token)) {
            throw new Exception('خطای امنیتی CSRF: نشست شما منقضی شده است. لطفاً صفحه را رفرش کنید.');
        }
    }

    /**
     * جلوگیری از اجرای چندباره درخواست انتشار در اثر کلیک مکرر یا ارسال محتوای تکراری
     */
    public function checkAndLockDuplicate(string $channelId, string $caption, string $originalFileName, int $fileSize): string
    {
        $fingerprint = hash('sha256', implode('|', [
            trim($channelId),
            trim($caption),
            trim($originalFileName),
            $fileSize,
        ]));

        $lockFile = $this->config['storage_dir'] . '/locks.json';
        $locks = [];
        if (file_exists($lockFile)) {
            $locks = json_decode((string)file_get_contents($lockFile), true) ?: [];
        }

        $now = time();
        $ttl = (int)($this->config['duplicate_lock_seconds'] ?? 60);

        // پاک‌سازی قفل‌های منقضی‌شده
        foreach ($locks as $key => $timestamp) {
            if (($now - (int)$timestamp) > $ttl) {
                unset($locks[$key]);
            }
        }

        if (isset($locks[$fingerprint])) {
            $remaining = $ttl - ($now - (int)$locks[$fingerprint]);
            throw new Exception("این پست به تازگی ارسال شده است. جهت جلوگیری از انتشار تکراری، لطفاً {$remaining} ثانیه صبر کنید یا محتوا را تغییر دهید.");
        }

        // ثبت قفل موقت قبل از ارسال
        $locks[$fingerprint] = $now;
        @file_put_contents($lockFile, json_encode($locks, JSON_PRETTY_PRINT));

        return $fingerprint;
    }

    /**
     * آزادسازی قفل در صورت بروز خطا در ارسال (تا کاربر بتواند بلافاصله دوباره تلاش کند)
     */
    public function releaseDuplicateLock(string $fingerprint): void
    {
        $lockFile = $this->config['storage_dir'] . '/locks.json';
        if (!file_exists($lockFile)) {
            return;
        }
        $locks = json_decode((string)file_get_contents($lockFile), true) ?: [];
        unset($locks[$fingerprint]);
        @file_put_contents($lockFile, json_encode($locks, JSON_PRETTY_PRINT));
    }

    /**
     * اعتبارسنجی کامل فایل تصویر بارگذاری‌شده (حجم، پسوند، MIME واقعی و ابعاد تصویر)
     */
    public function validateAndSaveUploadedImage(array $file): array
    {
        $errCode = $file['error'] ?? UPLOAD_ERR_NO_FILE;
        if ($errCode !== UPLOAD_ERR_OK) {
            switch ($errCode) {
                case UPLOAD_ERR_INI_SIZE:
                case UPLOAD_ERR_FORM_SIZE:
                    $errMsg = 'حجم تصویر بیش از حد مجاز سرور است.';
                    break;
                case UPLOAD_ERR_NO_FILE:
                    $errMsg = 'لطفاً یک تصویر برای انتشار انتخاب کنید.';
                    break;
                default:
                    $errMsg = 'خطا در آپلود فایل تصویر (کد ' . $errCode . ').';
                    break;
            }
            throw new Exception($errMsg);
        }

        $tmpPath = $file['tmp_name'] ?? '';
        if ($tmpPath === '' || !is_uploaded_file($tmpPath)) {
            throw new Exception('فایل بارگذاری‌شده معتبر نیست.');
        }

        // ۱. بررسی حجم فایل
        $fileSize = (int)($file['size'] ?? 0);
        $maxBytes = (int)$this->config['max_file_size_bytes'];
        if ($fileSize <= 0 || $fileSize > $maxBytes) {
            $maxMb = round($maxBytes / (1024 * 1024), 1);
            throw new Exception("حجم تصویر باید کمتر از {$maxMb} مگابایت باشد.");
        }

        // ۲. بررسی پسوند فایل
        $originalName = basename((string)($file['name'] ?? 'image.jpg'));
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if (!in_array($ext, $this->config['allowed_extensions'], true)) {
            throw new Exception('پسوند فایل مجاز نیست. فقط تصاویر JPG, PNG, WEBP و GIF مجاز هستند.');
        }

        // ۳. بررسی MIME Type واقعی و ماهیت تصویری فایل با getimagesize
        $imageInfo = @getimagesize($tmpPath);
        if ($imageInfo === false || empty($imageInfo['mime'])) {
            throw new Exception('فایل انتخاب‌شده یک تصویر معتبر نیست.');
        }

        $realMime = strtolower($imageInfo['mime']);
        if (!in_array($realMime, $this->config['allowed_mime_types'], true)) {
            throw new Exception("نوع فایل ({$realMime}) مجاز نیست.");
        }

        // ۴. تولید نام فایل امن و ذخیره در پوشه uploads
        switch ($realMime) {
            case 'image/png':
                $safeExt = 'png';
                break;
            case 'image/webp':
                $safeExt = 'webp';
                break;
            case 'image/gif':
                $safeExt = 'gif';
                break;
            default:
                $safeExt = 'jpg';
                break;
        }

        $safeFileName = 'bale_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $safeExt;
        $destination = rtrim($this->config['uploads_dir'], '/\\') . '/' . $safeFileName;

        if (!move_uploaded_file($tmpPath, $destination)) {
            throw new Exception('خطا در ذخیره‌سازی تصویر در سرور.');
        }

        return [
            'original_name' => $originalName,
            'saved_name'    => $safeFileName,
            'file_path'     => $destination,
            'mime_type'     => $realMime,
            'file_size'     => $fileSize,
            'width'         => $imageInfo[0] ?? null,
            'height'        => $imageInfo[1] ?? null,
        ];
    }
}
