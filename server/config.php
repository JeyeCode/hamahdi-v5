<?php
/**
 * ============================================================================
 * تنظیمات اصلی سرور هم‌عهدی نسخه 5.0 (مخصوص APK اندروید + پنل مدیریت وب)
 * ماژول‌های فعال: عهد بازار + عهدبات (۴ پیام‌رسان + هوش مصنوعی متنی)
 * ============================================================================
 */

// سازگاری کامل با PHP 7.4 و PHP 8.x
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

// ۱. نسخه و حالت اجرا
if (!defined('HAMAHDI_VERSION'))      define('HAMAHDI_VERSION', '5.0.0');
if (!defined('HAMAHDI_API_MODE'))     define('HAMAHDI_API_MODE', 'mobile_v5');

// ۲. اطلاعات ورود داشبورد مدیریت (فقط برای نسخه وب: admin.html)
if (!defined('ADMIN_USERNAME'))         define('ADMIN_USERNAME', getenv('HAMAHDI_ADMIN_USER') ?: 'admin');
if (!defined('ADMIN_DEFAULT_PASSWORD')) define('ADMIN_DEFAULT_PASSWORD', getenv('HAMAHDI_ADMIN_PASS') ?: 'admin');

// ۳. تنظیمات CORS برای اتصال امن اپلیکیشن اندروید (Capacitor/WebView) و تست لوکال
if (!defined('HAMAHDI_CORS_ALLOW_ALL')) define('HAMAHDI_CORS_ALLOW_ALL', true);

// ۴. توکن‌های ۴ پیام‌رسان عهدبات (نگهداری ۱۰۰٪ سمت سرور — هرگز داخل APK قرار نمی‌گیرد)
// 🟢 بله (Bale - @Hamahdibot)
if (!defined('HAMAHDI_BALE_BOT_TOKEN'))        define('HAMAHDI_BALE_BOT_TOKEN', '1719573889:ee_IARotRL_6wPMxhQi4DhMGpoqNYG9KXfI');
if (!defined('HAMAHDI_BALE_BOT_USERNAME'))     define('HAMAHDI_BALE_BOT_USERNAME', 'Hamahdibot');

// 🟣 روبیکا (Rubika - @Hamahdibot)
if (!defined('HAMAHDI_RUBIKA_BOT_TOKEN'))      define('HAMAHDI_RUBIKA_BOT_TOKEN', 'CJFFJF0UKKOCFFQJJKFCPKTYGJFBPVEFCGUACAGSBVVGGGKHGZPJZQRVVIVFCPRA');
if (!defined('HAMAHDI_RUBIKA_BOT_USERNAME'))   define('HAMAHDI_RUBIKA_BOT_USERNAME', 'Hamahdibot');

// 🔵 تلگرام (Telegram - @Hamahdibot)
if (!defined('HAMAHDI_TELEGRAM_BOT_TOKEN'))    define('HAMAHDI_TELEGRAM_BOT_TOKEN', '9292318625:AAGwBTHtIFR2wpE7nIDo8ILFOgnjBGq6VbY');
if (!defined('HAMAHDI_TELEGRAM_BOT_USERNAME')) define('HAMAHDI_TELEGRAM_BOT_USERNAME', 'Hamahdibot');
if (!defined('HAMAHDI_TELEGRAM_API_BASE'))     define('HAMAHDI_TELEGRAM_API_BASE', getenv('HAMAHDI_TELEGRAM_API_BASE') ?: 'https://api.telegram.org/bot');

// 🟠 ایتا (Eitaa - ایتایار eitaayar.ir)
if (!defined('HAMAHDI_EITAA_BOT_TOKEN'))       define('HAMAHDI_EITAA_BOT_TOKEN', '');

// ۵. تنظیمات دستیار هوش مصنوعی متنی عهدبات (Text-Only AI Assistant)
// پشتیبانی از سرویس‌های سازگار با OpenAI (مانند AvalAI، GapGPT، Liara AI، OpenRouter، OpenAI) و همچنین Gemini
// مقادیر مجاز HAMAHDI_AI_PROVIDER: 'openai_compatible' یا 'gemini'
if (!defined('HAMAHDI_AI_PROVIDER'))            define('HAMAHDI_AI_PROVIDER', getenv('HAMAHDI_AI_PROVIDER') ?: 'openai_compatible');
if (!defined('HAMAHDI_AI_API_BASE'))            define('HAMAHDI_AI_API_BASE', getenv('HAMAHDI_AI_API_BASE') ?: 'https://api.avalai.ir/v1/chat/completions');
if (!defined('HAMAHDI_AI_API_KEY'))             define('HAMAHDI_AI_API_KEY', getenv('HAMAHDI_AI_API_KEY') ?: '');
if (!defined('HAMAHDI_AI_MODEL'))               define('HAMAHDI_AI_MODEL', getenv('HAMAHDI_AI_MODEL') ?: 'gpt-4o-mini');
if (!defined('HAMAHDI_AI_MAX_TOKENS'))          define('HAMAHDI_AI_MAX_TOKENS', 900);
if (!defined('HAMAHDI_AI_RATE_LIMIT_PER_HOUR')) define('HAMAHDI_AI_RATE_LIMIT_PER_HOUR', 40);
if (!defined('HAMAHDI_AI_SYSTEM_PROMPT'))       define(
    'HAMAHDI_AI_SYSTEM_PROMPT',
    'تو دستیار هوشمند متنی «هم‌عهدی» (عهدبات) هستی. فقط به زبان فارسی روان، دقیق، مؤدب و کاربردی پاسخ می‌دهی. تخصص تو نگارش و بازنویسی کپشن کانال‌های بله، ایتا، روبیکا و تلگرام، تولید متن تبلیغاتی برای آگهی‌های عهد بازار، خلاصه‌سازی، تولید هشتگ مرتبط و پاسخگویی متنی به سوالات کاربران است. تو فقط حالت متنی داری و تصویر، ویدیو یا صوت تولید نمی‌کنی.'
);

// ۶. تنظیمات دیتابیس فوق‌سریع SQLite (با حالت WAL)
if (!defined('DB_DRIVER'))  define('DB_DRIVER', 'sqlite');
if (!defined('DB_HOST'))    define('DB_HOST', 'localhost');
if (!defined('DB_NAME'))    define('DB_NAME', 'hamahdi_v5_db');
if (!defined('DB_USER'))    define('DB_USER', 'root');
if (!defined('DB_PASS'))    define('DB_PASS', '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

$__storageBase = is_dir(__DIR__ . '/storage') ? (__DIR__ . '/storage') : (dirname(__DIR__) . '/storage');
if (!defined('SQLITE_DB_PATH_MARKET')) define('SQLITE_DB_PATH_MARKET', $__storageBase . '/data/hamahdi_tabarsi.sqlite');
if (!defined('SQLITE_DB_PATH'))        define('SQLITE_DB_PATH', SQLITE_DB_PATH_MARKET);
if (!defined('UPLOADS_DIR'))           define('UPLOADS_DIR', $__storageBase . '/uploads/');
if (!defined('MAX_UPLOAD_BYTES'))      define('MAX_UPLOAD_BYTES', 25 * 1024 * 1024);
if (!defined('APP_SECRET_KEY'))        define('APP_SECRET_KEY', 'hamahdi_v5_mobile_hmac_secret_2026_mashhad');

return require __DIR__ . '/api/bot/config.php';
