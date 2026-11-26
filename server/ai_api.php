<?php
/**
 * ============================================================================
 * HAMAHDI v5.0 Production | دستیار هوش مصنوعی فقط متنی «عهدهوش»
 * خواندن خودکار کلیدها از فایل server/.env (بدون هیچ کلید هاردکدشده در گیت‌هاب/APK)
 * موتور Failover هوشمند چندسرویسه: OpenRouter → Groq (کلید ۱ و ۲) → Gemini (کلید ۱ تا ۳)
 * ============================================================================
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/api/cors.php';

hamahdi_apply_mobile_cors(false);

function ai_load_dotenv(): array {
    static $cache = null;
    if ($cache !== null) return $cache;
    $cache = [];
    $candidates = [__DIR__ . '/.env', dirname(__DIR__) . '/.env'];
    foreach ($candidates as $file) {
        if (!is_file($file)) continue;
        $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) continue;
        foreach ($lines as $line) {
            $s = trim($line);
            if ($s === '' || $s[0] === '#' || strpos($s, '=') === false) continue;
            [$k, $v] = explode('=', $s, 2);
            $k = trim($k);
            $v = trim($v);
            if ((strlen($v) >= 2) && (($v[0] === '"' && substr($v, -1) === '"') || ($v[0] === "'" && substr($v, -1) === "'"))) {
                $v = substr($v, 1, -1);
            }
            if ($k !== '' && $v !== '') {
                $cache[$k] = $v;
            }
        }
        break;
    }
    return $cache;
}

function ai_env(string $key, string $default = ''): string {
    $env = ai_load_dotenv();
    if (isset($env[$key]) && trim($env[$key]) !== '') return trim($env[$key]);
    $g = getenv($key);
    return ($g !== false && trim((string)$g) !== '') ? trim((string)$g) : $default;
}

function ai_build_provider_chain(): array {
    $chain = [];
    // ۱. OpenRouter (سازگار با OpenAI و پایدار روی سرورهای ایران)
    $orKey = ai_env('OPENROUTER_API_KEY_1');
    if ($orKey !== '') {
        $chain[] = [
            'name' => 'openrouter',
            'type' => 'openai',
            'url' => 'https://openrouter.ai/api/v1/chat/completions',
            'key' => $orKey,
            'model' => ai_env('OPENROUTER_TEXT_MODEL', ai_env('OPENROUTER_VISION_MODEL', 'openrouter/free')),
            'extra_headers' => ['HTTP-Referer: https://mssn.ir/hamahdi', 'X-Title: HamAhdi AhdHoosh']
        ];
    }
    // ۲. Groq (پاسخ فوق‌سریع فارسی با کلید ۱ و ۲)
    foreach (['GROQ_API_KEY_1', 'GROQ_API_KEY_2'] as $gk) {
        $k = ai_env($gk);
        if ($k !== '') {
            $chain[] = [
                'name' => strtolower($gk),
                'type' => 'openai',
                'url' => 'https://api.groq.com/openai/v1/chat/completions',
                'key' => $k,
                'model' => ai_env('GROQ_TEXT_MODEL', 'llama-3.3-70b-versatile'),
                'extra_headers' => []
            ];
        }
    }
    // ۳. Google Gemini (کلید ۱ تا ۳)
    foreach (['GEMINI_API_KEY_1', 'GEMINI_API_KEY_2', 'GEMINI_API_KEY_3'] as $mk) {
        $k = ai_env($mk);
        if ($k !== '') {
            $chain[] = [
                'name' => strtolower($mk),
                'type' => 'gemini',
                'key' => $k,
                'model' => ai_env('GEMINI_MODEL', 'gemini-2.5-flash')
            ];
        }
    }
    // ۴. کلید دستی config.php (در صورت تنظیم)
    $cfgKey = defined('HAMAHDI_AI_API_KEY') ? trim((string)HAMAHDI_AI_API_KEY) : '';
    if ($cfgKey !== '') {
        $chain[] = [
            'name' => 'config_custom',
            'type' => (defined('HAMAHDI_AI_PROVIDER') && HAMAHDI_AI_PROVIDER === 'gemini') ? 'gemini' : 'openai',
            'url' => defined('HAMAHDI_AI_API_BASE') ? HAMAHDI_AI_API_BASE : 'https://api.avalai.ir/v1/chat/completions',
            'key' => $cfgKey,
            'model' => defined('HAMAHDI_AI_MODEL') ? HAMAHDI_AI_MODEL : 'gpt-4o-mini',
            'extra_headers' => []
        ];
    }
    return $chain;
}

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
    @file_put_contents(ai_json_history_file($username), json_encode(array_slice($msgs, -40), JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT), LOCK_EX);
}

function ai_is_multimedia_request(string $prompt): bool {
    $p = mb_strtolower($prompt, 'UTF-8');
    foreach (['generate image', 'create image', 'draw a ', 'make a video', 'generate video', 'text to image', 'نقاشی بکش'] as $pat) {
        if (mb_strpos($p, $pat, 0, 'UTF-8') !== false) return true;
    }
    $nouns = ['عکس', 'تصویر', 'پوستر', 'لوگو', 'ویدیو', 'ویدئو', 'کلیپ', 'انیمیشن', 'آهنگ', 'موسیقی', 'ویس'];
    $verbs = ['بساز', 'بکش', 'تولید', 'ساخت', 'طراحی', 'درست کن', 'ایجاد کن', 'بده'];
    foreach ($nouns as $n) {
        if (mb_strpos($p, $n, 0, 'UTF-8') !== false) {
            foreach ($verbs as $v) {
                if (mb_strpos($p, $v, 0, 'UTF-8') !== false) return true;
            }
        }
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

function ai_call_chain(array $messages): array {
    $chain = ai_build_provider_chain();
    if (empty($chain) || !function_exists('curl_init')) {
        return ['ok' => false, 'no_key' => true, 'errors' => ['هیچ کلید API فعالی در server/.env یافت نشد.']];
    }
    $timeout = (int)ai_env('AI_TIMEOUT', '25');
    $maxTokens = defined('HAMAHDI_AI_MAX_TOKENS') ? (int)HAMAHDI_AI_MAX_TOKENS : 900;
    $errors = [];

    foreach ($chain as $prov) {
        if ($prov['type'] === 'gemini') {
            $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($prov['model']) . ':generateContent?key=' . rawurlencode($prov['key']);
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
            $url = $prov['url'];
            $body = ['model' => $prov['model'], 'messages' => $messages, 'temperature' => 0.7, 'max_tokens' => $maxTokens];
            $headers = array_merge(['Content-Type: application/json', 'Authorization: Bearer ' . $prov['key']], $prov['extra_headers'] ?? []);
        }

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_POSTFIELDS => json_encode($body, JSON_UNESCAPED_UNICODE),
            CURLOPT_TIMEOUT => max(10, min(40, $timeout)),
            CURLOPT_CONNECTTIMEOUT => 8,
            CURLOPT_SSL_VERIFYPEER => false
        ]);
        $resp = curl_exec($ch);
        $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $cerr = curl_error($ch);
        curl_close($ch);

        if ($resp === false || $cerr !== '') {
            $errors[] = $prov['name'] . ': ' . $cerr;
            continue;
        }
        $dec = json_decode($resp, true);
        if ($code >= 200 && $code < 300 && is_array($dec)) {
            $reply = $prov['type'] === 'gemini'
                ? ($dec['candidates'][0]['content']['parts'][0]['text'] ?? '')
                : ($dec['choices'][0]['message']['content'] ?? '');
            $reply = trim((string)$reply);
            if ($reply !== '') {
                return ['ok' => true, 'reply' => $reply, 'provider' => $prov['name'], 'model' => $prov['model']];
            }
        }
        $msg = is_array($dec) ? ($dec['error']['message'] ?? ('HTTP ' . $code)) : ('HTTP ' . $code);
        $errors[] = $prov['name'] . ': ' . $msg;
    }

    return ['ok' => false, 'no_key' => false, 'errors' => $errors];
}

$action = trim((string)($_GET['action'] ?? $_POST['action'] ?? 'status'));
$rawBody = file_get_contents('php://input');
$input = is_string($rawBody) && trim($rawBody) !== '' ? (json_decode($rawBody, true) ?: []) : [];
if ($action === 'status' && !empty($input['action'])) $action = trim((string)$input['action']);

$sessionUser = trim((string)(
    $_SERVER['HTTP_X_SESSION_USER']
    ?? $input['session_username']
    ?? $_GET['session_username']
    ?? 'guest_' . substr(md5($_SERVER['REMOTE_ADDR'] ?? 'local'), 0, 8)
));
$sessionUser = preg_replace('/[^a-zA-Z0-9_\-\.]/', '', $sessionUser) ?: 'guest_local';

if ($action === 'status') {
    $chain = ai_build_provider_chain();
    hamahdi_send_json([
        'ok' => true,
        'text_only' => true,
        'configured' => count($chain) > 0,
        'providers_count' => count($chain),
        'active_providers' => array_values(array_map(function($p) { return $p['name'] . ' (' . $p['model'] . ')'; }, $chain)),
        'model' => count($chain) > 0 ? ($chain[0]['name'] . ' / ' . $chain[0]['model']) : 'unconfigured'
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
    $res = ai_call_chain($messages);
    if (!empty($res['ok'])) {
        $hist[] = ['role' => 'assistant', 'content' => $res['reply'], 'mode' => $mode, 'created_ts' => time()];
        ai_save_history($sessionUser, $hist);
        hamahdi_send_json([
            'ok' => true,
            'reply' => $res['reply'],
            'mode' => $mode,
            'provider' => $res['provider'],
            'model' => $res['model'],
            'local_fallback' => false
        ]);
    }
    hamahdi_send_json([
        'ok' => false,
        'error' => 'پاسخی از سرویس‌های هوش مصنوعی دریافت نشد. جزئیات: ' . implode(' | ', $res['errors'] ?? [])
    ], 502);
}
hamahdi_send_json(['ok' => false, 'error' => 'اکشن نامعتبر'], 400);
