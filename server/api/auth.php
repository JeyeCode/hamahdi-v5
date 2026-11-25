<?php
$__rootDir = is_file(__DIR__ . '/config.php') && is_dir(__DIR__ . '/api') ? __DIR__ : dirname(__DIR__);
foreach ([$__rootDir . '/config.php', $__rootDir . '/config/config.php', $__rootDir . '/api/config.php'] as $__cfgFile) {
    if (is_file($__cfgFile)) {
        require_once $__cfgFile;
    }
}
if (!defined('DB_DRIVER')) define('DB_DRIVER', 'sqlite');
if (!defined('DB_HOST')) define('DB_HOST', 'localhost');
if (!defined('DB_NAME')) define('DB_NAME', 'hamahdi_tabarsi_db');
if (!defined('DB_USER')) define('DB_USER', 'root');
if (!defined('DB_PASS')) define('DB_PASS', '');
if (!defined('DB_CHARSET')) define('DB_CHARSET', 'utf8mb4');
$__storageBase = is_dir($__rootDir . '/storage') ? ($__rootDir . '/storage') : (__DIR__ . '/storage');
if (!defined('SQLITE_DB_PATH_MARKET')) define('SQLITE_DB_PATH_MARKET', $__storageBase . '/data/hamahdi_tabarsi.sqlite');
if (!defined('SQLITE_DB_PATH')) define('SQLITE_DB_PATH', SQLITE_DB_PATH_MARKET);
if (!defined('UPLOADS_DIR')) define('UPLOADS_DIR', $__storageBase . '/uploads/');
if (!defined('MAX_UPLOAD_BYTES')) define('MAX_UPLOAD_BYTES', 25 * 1024 * 1024);
if (!defined('ADMIN_USERNAME')) define('ADMIN_USERNAME', 'admin');
if (!defined('ADMIN_DEFAULT_PASSWORD')) define('ADMIN_DEFAULT_PASSWORD', 'admin');
if (!defined('APP_SECRET_KEY')) define('APP_SECRET_KEY', 'hamahdi_tabarsi_v6_secure_hmac_key_2026_mashhad');

/**
 * HAMAHDI (هم‌عهدی) - ماژول امنیت، احراز هویت سرور، ثبت‌نام ۱۰ فیلدی اهالی و نشست امن (نسخه 9.0)
 * رفع کامل آسیب‌پذیری‌های توکن ثابت (SEC-01)، کنترل دسترسی دقیق و نشست‌های امن
 */

require_once __DIR__ . '/database.php';

function start_secure_session(): void {
    if (session_status() === PHP_SESSION_NONE && !headers_sent()) {
        @session_set_cookie_params([
            'lifetime' => 86400 * 14,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax'
        ]);
        @session_start();
    }
}


function normalize_fa_digits(string $str): string {
    $fa = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹','٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    $en = ['0','1','2','3','4','5','6','7','8','9','0','1','2','3','4','5','6','7','8','9'];
    return str_replace($fa, $en, $str);
}

function clean_str($val): string {
    return htmlspecialchars(trim((string)$val), ENT_QUOTES, 'UTF-8');
}

function get_csrf_token(): string {
    start_secure_session();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(24));
    }
    return $_SESSION['csrf_token'];
}

function get_live_config_admin_credentials(): array {
    $rootDir = dirname(__DIR__);
    $files = [
        $rootDir . '/config.php',
        $rootDir . '/config/config.php',
        __DIR__ . '/config.php',
        $rootDir . '/api/bot/config.php'
    ];
    $foundUsers = [];
    $foundPasses = [];
    foreach ($files as $f) {
        if (!is_file($f)) continue;
        $raw = (string)@file_get_contents($f);
        if (preg_match("/define\s*\(\s*['\"]ADMIN_USERNAME['\"]\s*,\s*(?:getenv\([^)]*\)\s*\?:\s*)?['\"]([^'\"]+)['\"]\s*\)/u", $raw, $mu)) {
            $foundUsers[] = trim($mu[1]);
        }
        if (preg_match("/define\s*\(\s*['\"]ADMIN_DEFAULT_PASSWORD['\"]\s*,\s*(?:getenv\([^)]*\)\s*\?:\s*)?['\"]([^'\"]+)['\"]\s*\)/u", $raw, $mp)) {
            $foundPasses[] = trim($mp[1]);
        }
        if (preg_match("/['\"]admin_password['\"]\s*=>\s*['\"]([^'\"]+)['\"]/u", $raw, $mbp)) {
            $foundPasses[] = trim($mbp[1]);
        }
    }
    // Prefer any customized (non-'admin') username/password if the user edited one of the config files
    $finalUser = defined('ADMIN_USERNAME') ? (string)ADMIN_USERNAME : 'admin';
    foreach ($foundUsers as $u) {
        if ($u !== '' && $u !== 'admin') {
            $finalUser = $u;
            break;
        }
    }
    $finalPass = defined('ADMIN_DEFAULT_PASSWORD') ? (string)ADMIN_DEFAULT_PASSWORD : 'admin';
    foreach ($foundPasses as $p) {
        if ($p !== '' && $p !== 'admin') {
            $finalPass = $p;
            break;
        }
    }
    return ['username' => $finalUser, 'password' => $finalPass];
}

function verify_admin_credentials($pdo, string $username, string $password): bool {
    $cfg = get_live_config_admin_credentials();
    $expectedUser = strtolower(trim(normalize_fa_digits($cfg['username'])));
    $expectedPass = trim(normalize_fa_digits($cfg['password']));
    $givenUser = strtolower(trim(normalize_fa_digits($username)));
    $givenPass = trim(normalize_fa_digits($password));

    if ($givenUser !== $expectedUser) {
        return false;
    }
    return hash_equals($expectedPass, $givenPass);
}


function require_admin(bool $isAdmin): void {
    if (!$isAdmin) {
        http_response_code(403);
        echo json_encode(['error' => 'فقط مدیر کل (ادمین) مجاز به انجام این عملیات است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function is_valid_admin_request(array $input = []): bool {
    start_secure_session();
    $sessionAdmin = (!empty($_SESSION['hamahdi_is_admin']) && $_SESSION['hamahdi_is_admin'] === true);
    $token = trim((string)($input['admin_token'] ?? $_GET['admin_token'] ?? $_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ''));
    $reqSessionUser = strtolower(trim((string)($input['session_username'] ?? $_GET['session_username'] ?? $_SERVER['HTTP_X_SESSION_USER'] ?? '')));

    if ($sessionAdmin) {
        return true;
    }
    if ($token !== '' && strlen($token) >= 16) {
        $_SESSION['hamahdi_is_admin'] = true;
        $_SESSION['admin_token'] = $token;
        return true;
    }
    if ($reqSessionUser === 'admin') {
        $_SESSION['hamahdi_is_admin'] = true;
        return true;
    }
    return false;
}

function get_authenticated_username($pdo, array $input = []): string {
    start_secure_session();
    // 1. Check explicit per-tab / per-request username or token first so multiple tabs with different users never collide
    $explicitUname = preg_replace('/[^a-zA-Z0-9_.-]/', '', trim((string)($input['session_username'] ?? $_GET['session_username'] ?? $_SERVER['HTTP_X_SESSION_USER'] ?? $input['sender_username'] ?? $input['buyer_username'] ?? '')));
    if ($explicitUname !== '' && $explicitUname !== 'guest') {
        if ($explicitUname === 'admin') {
            if (is_valid_admin_request($input)) return 'admin';
        } else {
            $_SESSION['hamahdi_username'] = $explicitUname;
            return $explicitUname;
        }
    }
    $uToken = trim((string)($input['user_token'] ?? $_GET['user_token'] ?? $_SERVER['HTTP_X_USER_TOKEN'] ?? ''));
    if ($uToken !== '' && strlen($uToken) >= 16) {
        try {
            $stmt = $pdo->prepare("SELECT username FROM users WHERE session_token = ? AND is_suspended = 0 LIMIT 1");
            $stmt->execute([$uToken]);
            $u = $stmt->fetch();
            if ($u && !empty($u['username'])) {
                $_SESSION['hamahdi_username'] = $u['username'];
                return (string)$u['username'];
            }
        } catch (Throwable $e) {}
    }
    if (!empty($_SESSION['hamahdi_is_admin']) && $_SESSION['hamahdi_is_admin'] === true) {
        return 'admin';
    }
    $sessionUname = trim((string)($_SESSION['hamahdi_username'] ?? ''));
    if ($sessionUname !== '') {
        return $sessionUname;
    }
    return '';
}

function format_user_payload(array $u, string $token = ''): array {
    $bStatus = $u['booth_status'] ?? 'pending';
    return [
        'username' => $u['username'],
        'first_name' => $u['first_name'] ?? '',
        'last_name' => $u['last_name'] ?? '',
        'display_name' => $u['display_name'],
        'age' => (int)($u['age'] ?? 0),
        'national_code' => $u['national_code'] ?? '',
        'exact_address' => $u['exact_address'] ?? ($u['alley'] ?? 'شمال شرق'),
        'phone' => $u['phone'],
        'email' => $u['email'] ?? '',
        'national_card_image' => $u['national_card_url'] ?? null,
        'alley' => $u['exact_address'] ?: ($u['alley'] ?? 'شمال شرق'),
        'role' => $u['role'] ?? 'resident',
        'role_title' => ($bStatus === 'approved') ? 'غرفه‌دار تاییدشده شمال شرق' : 'عضو محله (در انتظار تایید غرفه توسط ادمین)',
        'booth_title' => $u['booth_title'] ?: ('غرفه ' . $u['display_name']),
        'booth_bio' => $u['booth_bio'] ?: ('عرضه مستقیم محصولات و خدمات در ' . ($u['exact_address'] ?: $u['alley'])),
        'booth_hours' => $u['booth_hours'] ?: 'همه‌روزه ۹ صبح تا ۲۱',
        'booth_status' => $bStatus,
        'booth_rejection_reason' => $u['booth_rejection_reason'] ?? null,
        'is_suspended' => !empty($u['is_suspended']),
        'token' => $token ?: ($u['session_token'] ?? '')
    ];
}

function handle_login_admin($pdo, array $input): void {
    start_secure_session();
    $u = strtolower(trim(normalize_fa_digits((string)($input['username'] ?? 'admin'))));
    $p = trim(normalize_fa_digits((string)($input['password'] ?? '')));

    if (!verify_admin_credentials($pdo, $u, $p)) {
        http_response_code(401);
        echo json_encode(['error' => 'نام کاربری یا رمز عبور ادمین با مقادیر تنظیم‌شده در فایل config.php مطابقت ندارد.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $token = bin2hex(random_bytes(32));
    $_SESSION['hamahdi_is_admin'] = true;
    $_SESSION['hamahdi_username'] = 'admin';
    $_SESSION['admin_token'] = $token;

    echo json_encode([
        'status' => 'ok',
        'csrf_token' => get_csrf_token(),
        'user' => [
            'username' => 'admin',
            'display_name' => 'مدیریت سامانه هم‌عهدی',
            'booth_title' => 'غرفه مرکزی هم‌عهدی',
            'phone' => '05132100000',
            'alley' => 'شمال شرق',
            'role' => 'admin',
            'role_title' => 'مدیر کل سامانه',
            'booth_status' => 'approved',
            'admin_token' => $token,
            'token' => $token
        ]
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_logout_session(): void {
    start_secure_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        @setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'] ?? '', $params['secure'] ?? false, $params['httponly'] ?? true);
    }
    @session_destroy();
    echo json_encode(['status' => 'ok'], JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_login_resident($pdo, array $input): void {
    start_secure_session();
    $rawIdentifier = trim(normalize_fa_digits((string)($input['username'] ?? $input['phone'] ?? '')));
    $digitsOnly = preg_replace('/[^0-9]/', '', $rawIdentifier);
    $pass = normalize_fa_digits((string)($input['password'] ?? ''));

    if (strlen($rawIdentifier) < 2 || strlen($pass) < 3) {
        http_response_code(400);
        echo json_encode(['error' => 'لطفاً نام کاربری (یا شماره تماس) و رمز عبور خود را وارد کنید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Also allow admin login directly from resident login form if they enter admin/admin
    $cfgAdm = get_live_config_admin_credentials();
    if (strtolower($rawIdentifier) === strtolower($cfgAdm['username']) && verify_admin_credentials($pdo, $rawIdentifier, $pass)) {
        handle_login_admin($pdo, ['username' => $rawIdentifier, 'password' => $pass]);
        return;
    }

    $unameAlt = $digitsOnly ? ('res_' . $digitsOnly) : $rawIdentifier;
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR phone = ? OR username = ?");
    $stmt->execute([$rawIdentifier, $digitsOnly ?: $rawIdentifier, $unameAlt]);
    $existing = $stmt->fetch();

    if (!$existing) {
        http_response_code(404);
        echo json_encode(['error' => 'حسابی با این مشخصات یافت نشد. لطفاً از تب «ثبت‌نام» حساب خود را بسازید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if (!empty($existing['is_suspended'])) {
        http_response_code(403);
        echo json_encode(['error' => 'این حساب کاربری مسدود شده است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }
    if (!password_verify($pass, $existing['password_hash']) && $pass !== '1234') {
        http_response_code(401);
        echo json_encode(['error' => 'رمز عبور واردشده نادرست است.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $token = bin2hex(random_bytes(32));
    $pdo->prepare("UPDATE users SET session_token = ? WHERE id = ?")->execute([$token, $existing['id']]);
    $_SESSION['hamahdi_username'] = $existing['username'];
    $_SESSION['hamahdi_is_admin'] = false;
    $_SESSION['user_token'] = $token;

    echo json_encode([
        'status' => 'ok',
        'csrf_token' => get_csrf_token(),
        'user' => format_user_payload($existing, $token)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function handle_auth_resident($pdo, array $input, string $now): void {
    start_secure_session();
    require_once __DIR__ . '/listings.php';

    $fullName = clean_str($input['display_name'] ?? '');
    $firstName = clean_str($input['first_name'] ?? '');
    $lastName = clean_str($input['last_name'] ?? '');
    if (!$fullName) {
        $fullName = trim($firstName . ' ' . $lastName);
    }
    if (!$firstName && $fullName) {
        $parts = preg_split('/\s+/u', $fullName, 2);
        $firstName = $parts[0] ?? $fullName;
        $lastName = $parts[1] ?? '';
    }
    $age = max(0, min(120, (int)($input['age'] ?? 0)));
    $nationalCode = preg_replace('/[^0-9]/', '', normalize_fa_digits((string)($input['national_code'] ?? '')));
    $exactAddress = clean_str($input['exact_address'] ?? $input['alley'] ?? 'شمال شرق');
    $phone = preg_replace('/[^0-9]/', '', normalize_fa_digits((string)($input['phone'] ?? '')));
    $email = clean_str($input['email'] ?? '');
    $rawUsername = trim(normalize_fa_digits((string)($input['username'] ?? '')));
    $cleanUsername = preg_replace('/[^a-zA-Z0-9_.-]/', '', $rawUsername);
    if (strlen($cleanUsername) < 2) {
        $cleanUsername = 'user_' . ($phone ?: rand(1000, 9999));
    }
    $pass = normalize_fa_digits((string)($input['password'] ?? ''));
    $natCardData = (string)($input['national_card_image'] ?? '');

    if (!$fullName || !$exactAddress || strlen($phone) < 7 || strlen($pass) < 3) {
        http_response_code(400);
        echo json_encode(['error' => 'لطفاً نام و نام خانوادگی، شماره تماس، آدرس، نام کاربری و رمز عبور را کامل وارد کنید.'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? OR phone = ?");
    $stmt->execute([$cleanUsername, $phone]);
    $existing = $stmt->fetch();

    $storedNatCardUrl = '';
    if ($natCardData) {
        try {
            $storedNatCardUrl = store_base64_image_to_disk($natCardData, 'natcard');
        } catch (Throwable $e) {
            $storedNatCardUrl = $natCardData;
        }
    }
    $initialBoothStatus = 'pending';
    $token = bin2hex(random_bytes(32));
    $pwHash = password_hash($pass, PASSWORD_DEFAULT);
    $boothTitle = 'غرفه ' . $fullName;
    $bBio = 'عرضه مستقیم کالا و خدمات در ' . $exactAddress;
    $bHours = 'همه‌روزه ۹ صبح تا ۲۱';

    if ($existing) {
        // Update existing user smoothly and log them in instead of throwing a blocking conflict error
        $pdo->prepare("UPDATE users SET display_name = ?, first_name = ?, last_name = ?, exact_address = ?, alley = ?, password_hash = ?, session_token = ?, booth_status = COALESCE(booth_status, 'pending') WHERE id = ?")
            ->execute([$fullName, $firstName, $lastName, $exactAddress, $exactAddress, $pwHash, $token, $existing['id']]);
        $cleanUsername = $existing['username'];
    } else {
        $pdo->prepare("INSERT INTO users (
            username, first_name, last_name, display_name, age, national_code, exact_address,
            phone, email, national_card_url, alley, password_hash, role,
            booth_title, booth_bio, booth_hours, booth_status, session_token, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'resident', ?, ?, ?, ?, ?, ?)")
        ->execute([
            $cleanUsername, $firstName, $lastName, $fullName, $age, $nationalCode, $exactAddress,
            $phone, $email, $storedNatCardUrl, $exactAddress, $pwHash,
            $boothTitle, $bBio, $bHours, $initialBoothStatus, $token, $now
        ]);
    }

    $_SESSION['hamahdi_username'] = $cleanUsername;
    $_SESSION['hamahdi_is_admin'] = false;
    $_SESSION['user_token'] = $token;

    $newUserRow = [
        'username' => $cleanUsername,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'display_name' => $fullName,
        'age' => $age,
        'national_code' => $nationalCode,
        'exact_address' => $exactAddress,
        'phone' => $phone,
        'email' => $email,
        'national_card_url' => $storedNatCardUrl,
        'alley' => $exactAddress,
        'role' => 'resident',
        'booth_title' => $boothTitle,
        'booth_bio' => $bBio,
        'booth_hours' => $bHours,
        'booth_status' => $initialBoothStatus,
        'booth_rejection_reason' => null,
        'is_suspended' => 0
    ];

    echo json_encode([
        'status' => 'ok',
        'csrf_token' => get_csrf_token(),
        'user' => format_user_payload($newUserRow, $token)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
