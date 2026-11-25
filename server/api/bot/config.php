<?php
declare(strict_types=1);

/**
 * تنظیمات خام عهدبات در ۴ شبکه اجتماعی (نسخه 4.0.1)
 * شبکه‌های پشتیبانی‌شده: ۱. بله ۲. روبیکا ۳. تلگرام ۴. ایتا (ایتایار)
 * بدون هیچ‌گونه ربات یا کانال فیک/هاردکد؛ تمامی مقادیر توسط ادمین و کاربران ثبت می‌شوند.
 */

if (!defined('HAMAHDI_BALE_BOT_TOKEN'))        define('HAMAHDI_BALE_BOT_TOKEN', '');
if (!defined('HAMAHDI_BALE_BOT_USERNAME'))     define('HAMAHDI_BALE_BOT_USERNAME', 'Hamahdibot');
if (!defined('HAMAHDI_RUBIKA_BOT_TOKEN'))      define('HAMAHDI_RUBIKA_BOT_TOKEN', '');
if (!defined('HAMAHDI_RUBIKA_BOT_USERNAME'))   define('HAMAHDI_RUBIKA_BOT_USERNAME', 'Hamahdibot');
if (!defined('HAMAHDI_TELEGRAM_BOT_TOKEN'))    define('HAMAHDI_TELEGRAM_BOT_TOKEN', '');
if (!defined('HAMAHDI_TELEGRAM_BOT_USERNAME')) define('HAMAHDI_TELEGRAM_BOT_USERNAME', 'Hamahdibot');

return [
    // ۱. پیام‌رسان بله (Bale)
    'bale_bot_token'    => getenv('BALE_BOT_TOKEN') ?: HAMAHDI_BALE_BOT_TOKEN,
    'bale_bot_username' => getenv('BALE_BOT_USERNAME') ?: HAMAHDI_BALE_BOT_USERNAME,
    'bale_channel_id'   => getenv('BALE_CHANNEL_ID') ?: '',
    'bale_api_base'     => 'https://tapi.bale.ai/bot',

    // ۲. پیام‌رسان روبیکا (Rubika v3)
    'rubika_bot_token'    => getenv('RUBIKA_BOT_TOKEN') ?: HAMAHDI_RUBIKA_BOT_TOKEN,
    'rubika_bot_username' => getenv('RUBIKA_BOT_USERNAME') ?: HAMAHDI_RUBIKA_BOT_USERNAME,
    'rubika_channel_id'   => getenv('RUBIKA_CHANNEL_ID') ?: '',
    'rubika_api_base'     => 'https://botapi.rubika.ir/v3',
    'rubika_timeout'      => 25,
    'rubika_max_retries'  => 3,

    // ۳. پیام‌رسان تلگرام (Telegram)
    'telegram_bot_token'    => getenv('TELEGRAM_BOT_TOKEN') ?: HAMAHDI_TELEGRAM_BOT_TOKEN,
    'telegram_bot_username' => getenv('TELEGRAM_BOT_USERNAME') ?: HAMAHDI_TELEGRAM_BOT_USERNAME,
    'telegram_channel_id'   => getenv('TELEGRAM_CHANNEL_ID') ?: '',
    'telegram_proxy'        => getenv('TELEGRAM_PROXY') ?: '',
    'telegram_api_base'     => 'https://api.telegram.org/bot',
    'telegram_timeout'      => 30,

    // ۴. پیام‌رسان ایتا (Eitaa - ایتایار eitaayar.ir)
    'eitaa_bot_token'    => getenv('EITAA_BOT_TOKEN') ?: (defined('HAMAHDI_EITAA_BOT_TOKEN') ? HAMAHDI_EITAA_BOT_TOKEN : ''),
    'eitaa_bot_username' => '',
    'eitaa_channel_id'   => getenv('EITAA_CHANNEL_ID') ?: '',
    'eitaa_api_base'     => 'https://eitaayar.ir/api',
    'eitaa_timeout'      => 30,

    // محدودیت‌های بارگذاری چندرسانه‌ای (تصویر، ویدیو، صوت)
    'max_file_size_bytes' => 25 * 1024 * 1024,
    'max_caption_length'  => 4096,
    'allowed_extensions'  => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'mp4', 'webm', 'mov', 'mkv', 'mp3', 'ogg', 'wav', 'm4a'],
    'allowed_mime_types'  => [
        'image/jpeg', 'image/png', 'image/webp', 'image/gif',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/x-matroska',
        'audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'audio/aac', 'audio/webm'
    ],

    'curl_timeout_seconds'   => 30,
    'duplicate_lock_seconds' => 15,

    'uploads_dir' => dirname(__DIR__, 2) . '/storage/uploads',
    'storage_dir' => dirname(__DIR__, 2) . '/storage/bot_storage',
];
