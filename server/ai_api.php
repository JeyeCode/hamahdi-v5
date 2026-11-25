<?php
/**
 * HAMAHDI v5.0 | دستیار هوش مصنوعی متنی عهدبات (Text-Only AI Assistant API)
 * سازگار با هر دو حالت SQLite (PDO/SQLite3) و فایل JSON (بدون نیاز به افزونه دیتابیس روی ویندوز)
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/api/cors.php';

hamahdi_apply_mobile_cors(false);

$action = trim((string)($_GET['action'] ?? $_POST['action'] ?? 'status'));
$rawBody = file_get_contents('php://input');
$input = is_string($rawBody) && trim($rawBody) !== '' ? (json_decode($rawBody, true) ?: []) : [];
if ($action === 'status' && !empty($input['action'])) {
    $action = trim((string)$input['action']);
}

$sessionUser = trim((string)(
    $_SERVER['HTTP_X_SESSION_USER']
    ?? $input['session_username']
    ?? $_GET['session_username']
    ?? 'guest_' . substr(md5($_SERVER['REMOTE_ADDR'] ?? 'local'), 0, 8)
));
$sessionUser = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $sessionUser) ?: 'guest_local';

function ai_json_history_file(string $username): string {
    $dir = __DIR__ . '/storage/bot_storage/ai_chats';
    if (!is_dir($dir)) { @mkdir($dir, 0755, true); }
    return $dir . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $username) . '.json';
}

function ai_load_history(string $username): array {
    $f = ai_json_history_file($username);
    if (!is_file($f)) return [];
    $d = json_decode((string)@file_get_contents($f), true);
    return is_array($d) ? $d : [];
}

function ai_save_history(string $username, array $msgs): void {
    $msgs = array_slice($msgs, -40);
    @file_put_contents(ai_json_history_file($username), json_encode($msgs, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function ai_is_multimedia_request(string $prompt): bool {
    $p = mb_strtolower($prompt, 'UTF-8');
    $exact = ['generate image', 'create image', 'draw a ', 'make a video', 'generate video', 'text to image', 'نقاشی بکش'];
    foreach ($exact as $pat) {
        if (mb_strpos($p, $pat, 0, 'UTF-8') !== false) return true;
    }
    $mediaNouns = ['عکس', 'تصویر', 'پوستر', 'لوگو', 'ویدیو', 'ویدئو', 'کلیپ', 'انیمیشن', 'آهنگ', 'موسیقی', 'ویس'];
    $genVerbs   = ['بساز', 'بکش', 'تولید', 'ساخت', 'طراحی', 'درست کن', 'ایجاد کن', 'بده'];
    $hasMedia = false;
    foreach ($mediaNouns as $n) { if (mb_strpos($p, $n, 0, 'UTF-8') !== false) { $hasMedia = true; break; } }
    if ($hasMedia) {
        foreach ($genVerbs as $v) { if (mb_strpos($p, $v, 0, 'UTF-8') !== false) return true; }
    }
    return false;
}

function ai_build_preset_instruction(string $mode): string {
    switch ($mode) {
        case 'caption': return 'یک کپشن جذاب، خوانا و آماده انتشار در کانال‌های بله، ایتا، روبیکا و تلگرام همراه با ۳ تا ۵ هشتگ مرتبط بنویس.';
        case 'ad': return 'یک متن آگهی فروش حرفه‌ای و شفاف برای عهدبازار بنویس.';
        case 'rewrite': return 'متن کاربر را با فارسی شیوا و حرفه‌ای بازنویسی کن.';
        case 'summary': return 'متن کاربر را به شکل بولت‌پوینت‌های کوتاه خلاصه کن.';
        case 'hashtags': return '۱۰ هشتگ مرتبط فارسی پیشنهاد بده.';
        default: return '';
    }
}

function ai_call_external_provider(array $messages): array {
    $apiKey = defined('HAMAHDI_AI_API_KEY') ? trim((string)HAMAHDI_AI_API_KEY) : '';
    $provider = defined('HAMAHDI_AI_PROVIDER') ? trim((string)HAMAHDI_AI_PROVIDER) : 'openai_compatible';
    $model = defined('HAMAHDI_AI_MODEL') ? trim((string)HAMAHDI_AI_MODEL) : 'gpt-4o-mini';
    $maxTokens = defined('HAMAHDI_AI_MAX_TOKENS') ? (int)HAMAHDI_AI_MAX_TOKENS : 900;
    if ($apiKey === '' || !function_exists('curl_init')) {
        return ['ok' => false, 'fallback' => true];
    }
    if ($provider === 'gemini') {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent?key=' . rawurlencode($apiKey);
        $contents = [];
        $sys = '';
        foreach ($messages as $m) {
            if ($m['role'] === 'system') { $sys .= ($sys ? "\n" : '') . $m['content']; continue; }
            $contents[] = ['role' => $m['role'] === 'assistant' ? 'model' : 'user', 'parts' => [['text' => $m['content']]]];
        }
        $body = ['contents' => $contents, 'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => $maxTokens]];
        if ($sys !== '') $body['systemInstruction'] = ['parts' => [['text' => $sys]]];
        $headers = ['Content-Type: application/json'];
    } else {
        $url = defined('HAMAHDI_AI_API_BASE') ? trim((string)HAMAHDI_AI_API_BASE) : 'https://api.avalai.ir/v1/chat/completions';
        $body = ['model' => $model, 'messages' => $messages, 'temperature' => 0.7, 'max_tokens' => $maxTokens];
        $headers = ['Content-Type: application/json', 'Authorization: Bearer ' . $apiKey];
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true, CURLOPT_RETURNTRANSFER => true, CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE), CURLOPT_TIMEOUT => 30, CURLOPT_CONNECTTIMEOUT => 10
    ]);
    $resp = curl_exec($ch);
    $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($resp === false || $err !== '') return ['ok' => false, 'fallback' => false, 'error' => 'خطا در اتصال به سرویس هوش مصنوعی: ' . $err];
    $dec = json_decode($resp, true);
    if ($code < 200 || $code >= 300 || !is_array($dec)) return ['ok' => false, 'fallback' => false, 'error' => 'خطای سرویس هوش مصنوعی (HTTP ' . $code . ')'];
    $reply = $provider === 'gemini' ? ($dec['candidates'][0]['content']['parts'][0]['text'] ?? '') : ($dec['choices'][0]['message']['content'] ?? '');
    $reply = trim((string)$reply);
    return $reply !== '' ? ['ok' => true, 'reply' => $reply, 'model' => $model] : ['ok' => false, 'fallback' => false, 'error' => 'پاسخ خالی دریافت شد.'];
}

function ai_local_smart_fallback(string $prompt, string $mode): string {
    $clean = trim($prompt);
    switch ($mode) {
        case 'caption':
            return "✨ **پیشنهاد کپشن آماده انتشار (عهدبات):**\n\n📌 {$clean}\n\n✅ با کیفیت عالی و دسترسی مستقیم برای اعضای گرامی هم‌عهدی.\n📩 برای اطلاعات بیشتر و ثبت سفارش، همین حالا پیام دهید.\n\n#هم_عهدی #عهد_بازار #عهدبات #پیشنهاد_ویژه";
        case 'ad':
            return "🛍️ **متن پیشنهادی آگهی عهدبازار:**\n\n🔸 **عنوان:** {$clean}\n🔸 **توضیحات:** عرضه مستقیم با قیمت منصفانه و تضمین کیفیت.\n💬 جهت سفارش از طریق چت داخلی غرفه در ارتباط باشید.";
        case 'hashtags':
            return "🏷️ **هشتگ‌های پیشنهادی:**\n#هم_عهدی #عهد_بازار #عهدبات #حمایت_از_تولید #مشهد";
        case 'summary':
            return "📝 **خلاصه کوتاه:**\n• " . mb_substr($clean, 0, 220, 'UTF-8');
        default:
            return "🤖 پیام متنی شما دریافت شد:\n«{$clean}»\n\nسرویس **عهدهوش (هوش مصنوعی فقط متنی)** فعال است. برای اتصال به مدل آنلاین، کلید `HAMAHDI_AI_API_KEY` را در `config.php` وارد کنید.";
    }
}

if ($action === 'status') {
    $hasKey = defined('HAMAHDI_AI_API_KEY') && trim((string)HAMAHDI_AI_API_KEY) !== '';
    hamahdi_send_json([
        'ok' => true, 'text_only' => true, 'configured' => $hasKey,
        'provider' => defined('HAMAHDI_AI_PROVIDER') ? HAMAHDI_AI_PROVIDER : 'openai_compatible',
        'model' => $hasKey ? (defined('HAMAHDI_AI_MODEL') ? HAMAHDI_AI_MODEL : 'gpt-4o-mini') : 'local-test-helper'
    ]);
}
if ($action === 'history') {
    hamahdi_send_json(['ok' => true, 'messages' => ai_load_history($sessionUser)]);
}
if ($action === 'clear_history') {
    ai_save_history($sessionUser, []);
    hamahdi_send_json(['ok' => true, 'message' => 'تاریخچه گفتگو پاک شد.']);
}
if ($action === 'chat') {
    $prompt = trim((string)($input['message'] ?? $input['prompt'] ?? $_POST['message'] ?? ''));
    $mode = trim((string)($input['mode'] ?? $_POST['mode'] ?? 'general'));
    if ($prompt === '') hamahdi_send_json(['ok' => false, 'error' => 'لطفاً متن پیام خود را وارد کنید.'], 400);
    if (ai_is_multimedia_request($prompt)) {
        hamahdi_send_json([
            'ok' => true, 'text_only_notice' => true, 'mode' => $mode,
            'reply' => 'دستیار هوش مصنوعی عهدهوش فقط در **حالت متنی** فعال است و امکان ساخت تصویر، ویدیو یا صدا را ندارد.'
        ]);
    }
    $hist = ai_load_history($sessionUser);
    $hist[] = ['role' => 'user', 'content' => $prompt, 'mode' => $mode, 'created_ts' => time()];
    $sys = defined('HAMAHDI_AI_SYSTEM_PROMPT') ? HAMAHDI_AI_SYSTEM_PROMPT : 'تو دستیار متنی فارسی هم‌عهدی هستی.';
    $hint = ai_build_preset_instruction($mode);
    if ($hint !== '') $sys .= "\n" . $hint;
    $messages = [['role' => 'system', 'content' => $sys]];
    foreach (array_slice($hist, -6) as $h) {
        $messages[] = ['role' => $h['role'] === 'assistant' ? 'assistant' : 'user', 'content' => $h['content']];
    }
    $res = ai_call_external_provider($messages);
    if (!empty($res['ok'])) {
        $reply = $res['reply']; $usedModel = $res['model'] ?? 'online'; $isFb = false;
    } elseif (!empty($res['fallback'])) {
        $reply = ai_local_smart_fallback($prompt, $mode); $usedModel = 'local-test-helper'; $isFb = true;
    } else {
        hamahdi_send_json(['ok' => false, 'error' => $res['error'] ?? 'خطا در هوش مصنوعی'], 502);
    }
    $hist[] = ['role' => 'assistant', 'content' => $reply, 'mode' => $mode, 'created_ts' => time()];
    ai_save_history($sessionUser, $hist);
    hamahdi_send_json(['ok' => true, 'reply' => $reply, 'mode' => $mode, 'model' => $usedModel, 'local_fallback' => $isFb]);
}
hamahdi_send_json(['ok' => false, 'error' => 'اکشن نامعتبر'], 400);
