<?php
/**
 * تنظیمات اصلی سوپراپلیکیشن هم‌عهدی (نسخه 3.1.5)
 * برای تغییر نام کاربری و رمز عبور مدیریت (ادمین)، دو مقدار ADMIN_USERNAME و ADMIN_DEFAULT_PASSWORD زیر را ویرایش کنید:
 */
if (!defined('ADMIN_USERNAME'))         define('ADMIN_USERNAME', 'admin');
if (!defined('ADMIN_DEFAULT_PASSWORD')) define('ADMIN_DEFAULT_PASSWORD', 'Tabarsi@Hamahdi@1405');

if (!defined('DB_DRIVER')) define('DB_DRIVER', getenv('HAMAHDI_DB_DRIVER') ?: 'sqlite');
if (!defined('DB_HOST'))   define('DB_HOST', getenv('HAMAHDI_DB_HOST') ?: 'localhost');
if (!defined('DB_NAME'))   define('DB_NAME', getenv('HAMAHDI_DB_NAME') ?: 'hamahdi_tabarsi_db');
if (!defined('DB_USER'))   define('DB_USER', getenv('HAMAHDI_DB_USER') ?: 'root');
if (!defined('DB_PASS'))   define('DB_PASS', getenv('HAMAHDI_DB_PASS') ?: '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');

$__storageBase = is_dir(__DIR__ . '/storage') ? (__DIR__ . '/storage') : (dirname(__DIR__) . '/storage');
if (!defined('SQLITE_DB_PATH_MARKET'))  define('SQLITE_DB_PATH_MARKET', $__storageBase . '/data/hamahdi_tabarsi.sqlite');
if (!defined('SQLITE_DB_PATH_NEWS'))    define('SQLITE_DB_PATH_NEWS', $__storageBase . '/data/hamahdi_news.sqlite');
if (!defined('SQLITE_DB_PATH_CULTURE')) define('SQLITE_DB_PATH_CULTURE', $__storageBase . '/data/hamahdi_culture.sqlite');
if (!defined('SQLITE_DB_PATH_MAP'))     define('SQLITE_DB_PATH_MAP', $__storageBase . '/data/hamahdi_map.sqlite');
if (!defined('SQLITE_DB_PATH'))         define('SQLITE_DB_PATH', SQLITE_DB_PATH_MARKET);
if (!defined('UPLOADS_DIR'))            define('UPLOADS_DIR', $__storageBase . '/uploads/');
if (!defined('MAX_UPLOAD_BYTES'))       define('MAX_UPLOAD_BYTES', 25 * 1024 * 1024);
if (!defined('APP_SECRET_KEY'))         define('APP_SECRET_KEY', 'hamahdi_tabarsi_v6_secure_hmac_key_2026_mashhad');
