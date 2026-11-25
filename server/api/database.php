<?php
// PHP 7.4 Compatibility Polyfills (prevents Fatal Error / empty JSON on PHP 7.4 hosts)
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
 * HAMAHDI (هم‌عهدی) - لایه اتصال هوشمند و چندگانه پایگاه داده (نسخه 8.0)
 * پشتیبانی خودکار از ۴ حالت بدون خطای درایور روی تمامی هاست‌ها (نت‌افراز، دایرکت‌ادمین، سی‌پنل و لوکال):
 * 1) MySQL / MariaDB (در صورت تنظیم DB_DRIVER = 'mysql' در api/config.php)
 * 2) PDO SQLite (در صورت فعال بودن افزونه pdo_sqlite روی سرور)
 * 3) Native SQLite3 (در صورت فعال بودن کلاس SQLite3 بدون pdo_sqlite در دایرکت‌ادمین)
 * 4) موتور دیتابیس فایلی اتمیک (HamahdiJsonFileAdapter با قفل flock) در صورت غیرفعال بودن SQLite روی هاست
 */

require_once __DIR__ . '/config.php';

/**
 * آداپتور سازگار با PDO برای کلاس بومی SQLite3 (زمانی که pdo_sqlite غیرفعال ولی sqlite3 فعال است)
 */
class HamahdiSqlite3Stmt {
    private $db;
    private string $sql;
    private $res = null;
    private array $rows = [];
    private int $cursor = 0;

    public function __construct($db, string $sql) {
        $this->db = $db;
        $this->sql = $sql;
    }

    public function execute(array $params = []): bool {
        $stmt = $this->db->prepare($this->sql);
        if (!$stmt) return false;
        $i = 1;
        foreach ($params as $val) {
            if (is_int($val)) {
                $stmt->bindValue($i, $val, SQLITE3_INTEGER);
            } elseif (is_null($val)) {
                $stmt->bindValue($i, null, SQLITE3_NULL);
            } else {
                $stmt->bindValue($i, (string)$val, SQLITE3_TEXT);
            }
            $i++;
        }
        $r = $stmt->execute();
        $this->rows = [];
        $this->cursor = 0;
        if ($r && $r->numColumns() > 0) {
            while ($row = $r->fetchArray(SQLITE3_ASSOC)) {
                $this->rows[] = $row;
            }
            $r->finalize();
        }
        $stmt->close();
        return true;
    }

    public function fetch() {
        if ($this->cursor < count($this->rows)) {
            return $this->rows[$this->cursor++];
        }
        return false;
    }

    public function fetchAll(): array {
        return $this->rows;
    }
}

class HamahdiSqlite3Adapter {
    private $db;
    public function __construct(string $path) {
        $this->db = new SQLite3($path);
        $this->db->busyTimeout(8000);
    }
    public function exec(string $sql): bool {
        return @$this->db->exec($sql);
    }
    public function prepare(string $sql): HamahdiSqlite3Stmt {
        return new HamahdiSqlite3Stmt($this->db, $sql);
    }
    public function query(string $sql): HamahdiSqlite3Stmt {
        $st = new HamahdiSqlite3Stmt($this->db, $sql);
        $st->execute([]);
        return $st;
    }
}

/**
 * موتور دیتابیس فایلی اتمیک (Zero-Dependency JSON Storage Engine با قفل انحصاری flock)
 * زمانی فعال می‌شود که روی هاست اشتراکی (مانند تنظیمات پیش‌فرض برخی سرورهای دایرکت‌ادمین)
 * افزونه pdo_sqlite و sqlite3 غیرفعال باشد و کاربر هنوز دیتابیس MySQL معرفی نکرده باشد.
 */
class HamahdiJsonStmt {
    private HamahdiJsonAdapter $adapter;
    private string $sql;
    private array $rows = [];
    private int $cursor = 0;

    public function __construct(HamahdiJsonAdapter $adapter, string $sql) {
        $this->adapter = $adapter;
        $this->sql = trim($sql);
    }

    public function execute(array $params = []): bool {
        $this->rows = $this->adapter->runQuery($this->sql, array_values($params));
        $this->cursor = 0;
        return true;
    }

    public function fetch() {
        if ($this->cursor < count($this->rows)) {
            return $this->rows[$this->cursor++];
        }
        return false;
    }

    public function fetchAll(): array {
        return $this->rows;
    }
}

class HamahdiJsonAdapter {
    private string $jsonPath;
    private array $tables = [
        'users' => [],
        'hero_slides' => [],
        'business_stories' => [],
        'market_listings' => [],
        'listing_messages' => [],
        'market_orders' => [],
        'site_settings' => [],
        'community_media_posts' => [],
        'user_follows' => [],
        'social_stories' => [],
        '_auto_inc' => [
            'users' => 100,
            'hero_slides' => 500,
            'business_stories' => 500,
            'market_listings' => 1000,
            'listing_messages' => 2000,
            'market_orders' => 3000,
            'community_media_posts' => 4000,
            'user_follows' => 5000,
            'social_stories' => 6000
        ]
    ];

    public function __construct(string $jsonPath) {
        $this->jsonPath = $jsonPath;
        $dir = dirname($jsonPath);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        if (is_file($jsonPath)) {
            $raw = @file_get_contents($jsonPath);
            $decoded = $raw ? @json_decode($raw, true) : null;
            if (is_array($decoded)) {
                $this->tables = array_merge($this->tables, $decoded);
            }
        } else {
            $this->save();
        }
    }

    private function save(): void {
        $fp = @fopen($this->jsonPath, 'c+');
        if (!$fp) return;
        if (@flock($fp, LOCK_EX)) {
            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($this->tables, JSON_UNESCAPED_UNICODE));
            fflush($fp);
            @flock($fp, LOCK_UN);
        }
        fclose($fp);
    }

    private function nextId(string $table): int {
        if (!isset($this->tables['_auto_inc'][$table])) {
            $this->tables['_auto_inc'][$table] = 100;
        }
        $this->tables['_auto_inc'][$table]++;
        return (int)$this->tables['_auto_inc'][$table];
    }

    public function exec(string $sql): bool {
        $this->runQuery($sql, []);
        return true;
    }

    public function prepare(string $sql): HamahdiJsonStmt {
        return new HamahdiJsonStmt($this, $sql);
    }

    public function query(string $sql): HamahdiJsonStmt {
        $st = new HamahdiJsonStmt($this, $sql);
        $st->execute([]);
        return $st;
    }

    public function runQuery(string $sql, array $params): array {
        $norm = preg_replace('/\s+/', ' ', trim($sql));

        // Ignore DDL / PRAGMA
        if (preg_match('/^(PRAGMA|CREATE\s+TABLE|CREATE\s+INDEX|ALTER\s+TABLE)/i', $norm)) {
            return [];
        }

        // 1. INSERT INTO site_settings / INSERT OR REPLACE INTO site_settings
        if (stripos($norm, 'INTO site_settings') !== false && count($params) >= 2) {
            $key = (string)$params[0];
            $val = (string)$params[1];
            $found = false;
            foreach ($this->tables['site_settings'] as &$row) {
                if (($row['setting_key'] ?? '') === $key) {
                    $row['setting_value'] = $val;
                    $found = true;
                    break;
                }
            }
            unset($row);
            if (!$found) {
                $this->tables['site_settings'][] = ['setting_key' => $key, 'setting_value' => $val];
            }
            $this->save();
            return [];
        }

        // 2. INSERT INTO table (col1, col2, ...) VALUES (?, ?, ...)
        if (preg_match('/^INSERT\s+INTO\s+([a-zA-Z0-9_]+)\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)/i', $norm, $m)) {
            $table = strtolower(trim($m[1]));
            $cols = array_map('trim', explode(',', $m[2]));
            $valsRaw = array_map('trim', explode(',', $m[3]));
            $row = ['id' => $this->nextId($table)];
            $pIdx = 0;
            foreach ($cols as $idx => $colName) {
                $colName = trim($colName, '`"\' ');
                $vToken = $valsRaw[$idx] ?? '?';
                if ($vToken === '?') {
                    $row[$colName] = $params[$pIdx++] ?? null;
                } else {
                    $row[$colName] = trim($vToken, "'\"");
                }
            }
            // Defaults for tables
            if ($table === 'users') {
                $row += ['booth_logo' => null, 'booth_rejection_reason' => null, 'is_suspended' => 0];
            } elseif ($table === 'market_listings') {
                $row += ['views_count' => 0, 'rejection_reason' => null];
            } elseif ($table === 'market_orders') {
                $row += ['order_status' => 'ثبت اولیه - در انتظار هماهنگی غرفه‌دار'];
            }
            $this->tables[$table][] = $row;
            $this->save();
            return [];
        }

        // 3. DELETE FROM table WHERE ...
        if (preg_match('/^DELETE\s+FROM\s+([a-zA-Z0-9_]+)\s+WHERE\s+(.+)$/i', $norm, $m)) {
            $table = strtolower(trim($m[1]));
            $where = trim($m[2]);
            if (!isset($this->tables[$table])) return [];
            $before = count($this->tables[$table]);
            if (preg_match('/^([a-zA-Z0-9_]+)\s*=\s*\?$/i', $where, $wm)) {
                $col = $wm[1];
                $target = $params[0] ?? null;
                $this->tables[$table] = array_values(array_filter($this->tables[$table], fn($r) => (string)($r[$col] ?? '') !== (string)$target));
            } elseif (stripos($where, '600%20400') !== false) {
                $this->tables[$table] = array_values(array_filter($this->tables[$table], function($r) {
                    $u = (string)($r['image_url'] ?? '');
                    return strpos($u, '600%20400') === false && strpos($u, '0 0 600 400') === false;
                }));
            }
            if (count($this->tables[$table]) !== $before) {
                $this->save();
            }
            return [];
        }

        // 4. UPDATE table SET ... WHERE ...
        if (preg_match('/^UPDATE\s+([a-zA-Z0-9_]+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/i', $norm, $m)) {
            $table = strtolower(trim($m[1]));
            $setPart = trim($m[2]);
            $wherePart = trim($m[3]);
            if (!isset($this->tables[$table])) return [];

            // Match WHERE column (`id = ?`, `username = ?`, `seller_username = ?`, `status = 'pending'`)
            $whereCol = 'id';
            $whereVal = end($params);
            if (preg_match('/^([a-zA-Z0-9_]+)\s*=\s*\?$/i', $wherePart, $wm)) {
                $whereCol = $wm[1];
            } elseif (preg_match("/^([a-zA-Z0-9_]+)\s*=\s*'([^']*)'$/i", $wherePart, $wm)) {
                $whereCol = $wm[1];
                $whereVal = $wm[2];
            }

            foreach ($this->tables[$table] as &$r) {
                if ((string)($r[$whereCol] ?? '') !== (string)$whereVal) continue;

                // Handle toggle_listing_flag CASE WHEN
                if (stripos($setPart, 'CASE WHEN is_amazing') !== false) {
                    $cur = !empty($r['is_amazing']) ? 1 : 0;
                    $r['is_amazing'] = $cur ? 0 : 1;
                    $r['amazing_status'] = $cur ? 'none' : 'approved';
                } elseif (stripos($setPart, 'CASE WHEN is_urgent') !== false) {
                    $cur = !empty($r['is_urgent']) ? 1 : 0;
                    $r['is_urgent'] = $cur ? 0 : 1;
                    $r['urgent_status'] = $cur ? 'none' : 'approved';
                } else {
                    $assignments = explode(',', $setPart);
                    $pIdx = 0;
                    foreach ($assignments as $asg) {
                        if (preg_match('/^([a-zA-Z0-9_]+)\s*=\s*(.+)$/i', trim($asg), $am)) {
                            $cName = trim($am[1]);
                            $valExpr = trim($am[2]);
                            if ($valExpr === '?') {
                                $r[$cName] = $params[$pIdx++] ?? null;
                            } elseif (strtoupper($valExpr) === 'NULL') {
                                $r[$cName] = null;
                            } elseif (is_numeric($valExpr)) {
                                $r[$cName] = (int)$valExpr;
                            } else {
                                $r[$cName] = trim($valExpr, "'\"");
                            }
                        }
                    }
                }
            }
            unset($r);
            $this->save();
            return [];
        }

        // 5. SELECT queries
        if (preg_match('/^SELECT\s+(.+?)\s+FROM\s+([a-zA-Z0-9_]+)(.*)$/i', $norm, $m)) {
            $selectCols = trim($m[1]);
            $table = strtolower(trim($m[2]));
            $rest = trim($m[3] ?? '');
            $rows = $this->tables[$table] ?? [];

            // Filter conditions
            if (stripos($rest, 'WHERE') !== false) {
                if ($table === 'users' && stripos($rest, 'username = ? OR phone = ?') !== false) {
                    $u1 = (string)($params[0] ?? '');
                    $p1 = (string)($params[1] ?? '');
                    $u2 = (string)($params[2] ?? $u1);
                    $rows = array_values(array_filter($rows, fn($r) =>
                        ($r['username'] ?? '') === $u1 || ($r['phone'] ?? '') === $p1 || ($r['username'] ?? '') === $u2
                    ));
                } elseif ($table === 'business_stories' && stripos($rest, 'expires_at > 0 AND expires_at < ?') !== false) {
                    $nowTs = (int)($params[0] ?? time());
                    $rows = array_values(array_filter($rows, function($r) use ($nowTs) {
                        $exp = (int)($r['expires_at'] ?? 0);
                        $u = (string)($r['image_url'] ?? '');
                        return ($exp > 0 && $exp < $nowTs) || strpos($u, '600%20400') !== false || strpos($u, '0 0 600 400') !== false;
                    }));
                } elseif ($table === 'site_settings' && stripos($rest, "setting_key = 'admin_password_hash'") !== false) {
                    $rows = array_values(array_filter($rows, fn($r) => ($r['setting_key'] ?? '') === 'admin_password_hash'));
                } elseif ($table === 'site_settings' && stripos($rest, 'setting_key = ?') !== false) {
                    $k = (string)($params[0] ?? '');
                    $rows = array_values(array_filter($rows, fn($r) => ($r['setting_key'] ?? '') === $k));
                } elseif ($table === 'site_settings' && stripos($rest, 'IN (') !== false) {
                    $rows = array_values(array_filter($rows, fn($r) => in_array($r['setting_key'] ?? '', ['leader_photo_1', 'leader_photo_2'], true)));
                } elseif (preg_match('/WHERE\s+id\s*=\s*\?/i', $rest)) {
                    $tid = (int)($params[0] ?? 0);
                    $rows = array_values(array_filter($rows, fn($r) => (int)($r['id'] ?? 0) === $tid));
                } elseif (stripos($rest, "WHERE status = 'approved'") !== false) {
                    $rows = array_values(array_filter($rows, fn($r) => ($r['status'] ?? 'approved') === 'approved'));
                }
            }

            // Sorting
            if (stripos($rest, 'ORDER BY laddered_at DESC, id DESC') !== false) {
                usort($rows, fn($a, $b) => ((int)($b['laddered_at'] ?? 0) <=> (int)($a['laddered_at'] ?? 0)) ?: ((int)($b['id'] ?? 0) <=> (int)($a['id'] ?? 0)));
            } elseif (stripos($rest, 'ORDER BY id DESC') !== false) {
                usort($rows, fn($a, $b) => (int)($b['id'] ?? 0) <=> (int)($a['id'] ?? 0));
            } elseif (stripos($rest, 'ORDER BY id ASC') !== false) {
                usort($rows, fn($a, $b) => (int)($a['id'] ?? 0) <=> (int)($b['id'] ?? 0));
            }

            // Alias handling for hero_slides (`image_url as image_data`)
            if ($table === 'hero_slides' && stripos($selectCols, 'image_url as image_data') !== false) {
                foreach ($rows as &$r) {
                    $r['image_data'] = $r['image_url'] ?? '';
                }
                unset($r);
            }
            return array_values($rows);
        }

        return [];
    }
}

function get_pdo() {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    // 1. اگر کاربر در api/config.php حالت MySQL را فعال کرده و مشخصات دیتابیس هاست را وارد کرده باشد
    if (defined('DB_DRIVER') && DB_DRIVER === 'mysql' && !empty(DB_NAME) && !empty(DB_USER)) {
        $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        
        // HAMAHDI v5.0: بهینه‌سازی فوق‌سریع SQLite با حالت WAL و کش حافظه
        $pdo->exec("PRAGMA journal_mode=WAL;");
        $pdo->exec("PRAGMA synchronous=NORMAL;");
        $pdo->exec("PRAGMA temp_store=MEMORY;");
        $pdo->exec("PRAGMA cache_size=-16000;");
        $pdo->exec("PRAGMA busy_timeout=5000;");
        $pdo->exec("PRAGMA foreign_keys=ON;");
init_mysql_tables($pdo);
        return $pdo;
    }

    $dir = dirname(SQLITE_DB_PATH);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    // 2. اگر افزونه PDO SQLite روی سرور فعال باشد
    if (class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        try {
            $pdo = new PDO('sqlite:' . SQLITE_DB_PATH, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            try {
                $pdo->exec('PRAGMA journal_mode = WAL;');
                $pdo->exec('PRAGMA synchronous = NORMAL;');
            } catch (Throwable $e) {}
            $pdo->exec('PRAGMA busy_timeout = 8000;');
            $pdo->exec('PRAGMA foreign_keys = ON;');
            $pdo->exec('PRAGMA cache_size = -8000;');
            $pdo->exec('PRAGMA temp_store = MEMORY;');
            try { $pdo->exec('PRAGMA mmap_size = 67108864;'); } catch (Throwable $e) {}
            $stampFile = $dir . '/.schema_v314_ready.stamp';
            if (!is_file($stampFile) || !is_file(SQLITE_DB_PATH) || filesize(SQLITE_DB_PATH) < 4096) {
                init_sqlite_tables($pdo);
                @file_put_contents($stampFile, (string)time());
            }
            return $pdo;
        } catch (Throwable $e) {
            $pdo = null;
        }
    }

    // 3. اگر در دایرکت‌ادمین pdo_sqlite غیرفعال باشد اما افزونه بومی SQLite3 فعال باشد
    if (class_exists('SQLite3')) {
        try {
            $pdo = new HamahdiSqlite3Adapter(SQLITE_DB_PATH);
            $stampFile = $dir . '/.schema_v314_sqlite3.stamp';
            if (!is_file($stampFile) || !is_file(SQLITE_DB_PATH) || filesize(SQLITE_DB_PATH) < 4096) {
                init_sqlite_tables($pdo);
                @file_put_contents($stampFile, (string)time());
            }
            return $pdo;
        } catch (Throwable $e) {
            $pdo = null;
        }
    }

    // 4. فال‌بک خودکار بدون نیاز به هیچ درایوری (ذخیره اتمیک JSON با قفل flock در storage/data/hamahdi_tabarsi_db.json)
    $jsonDbPath = $dir . '/hamahdi_tabarsi_db.json';
    $pdo = new HamahdiJsonAdapter($jsonDbPath);
    return $pdo;
}

function init_sqlite_tables($pdo): void {
    $pdo->exec("CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        first_name TEXT DEFAULT '',
        last_name TEXT DEFAULT '',
        display_name TEXT NOT NULL,
        age INTEGER DEFAULT 0,
        national_code TEXT DEFAULT '',
        exact_address TEXT DEFAULT '',
        phone TEXT NOT NULL UNIQUE,
        email TEXT DEFAULT '',
        national_card_url TEXT DEFAULT NULL,
        alley TEXT NOT NULL DEFAULT 'شمال شرق',
        password_hash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'resident',
        booth_title TEXT,
        booth_bio TEXT,
        booth_hours TEXT DEFAULT 'همه‌روزه ۹ صبح تا ۲۱',
        booth_logo TEXT,
        booth_status TEXT NOT NULL DEFAULT 'pending',
        booth_rejection_reason TEXT DEFAULT NULL,
        is_suspended INTEGER DEFAULT 0,
        session_token TEXT,
        created_at TEXT NOT NULL
    )");

    $userColumns = [
        "ALTER TABLE users ADD COLUMN first_name TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN last_name TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN age INTEGER DEFAULT 0",
        "ALTER TABLE users ADD COLUMN national_code TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN exact_address TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN email TEXT DEFAULT ''",
        "ALTER TABLE users ADD COLUMN national_card_url TEXT DEFAULT NULL",
        "ALTER TABLE users ADD COLUMN booth_status TEXT NOT NULL DEFAULT 'pending'",
        "ALTER TABLE users ADD COLUMN booth_rejection_reason TEXT DEFAULT NULL"
    ];
    foreach ($userColumns as $sqlAlter) {
        try { $pdo->exec($sqlAlter); } catch (Throwable $e) {}
    }

    $pdo->exec("CREATE TABLE IF NOT EXISTS hero_slides (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_url TEXT NOT NULL,
        photographer_name TEXT NOT NULL,
        submitted_by TEXT DEFAULT 'اهالی شمال شرق',
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS business_stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        owner_username TEXT NOT NULL,
        booth_title TEXT NOT NULL,
        caption TEXT NOT NULL,
        image_url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_ts INTEGER NOT NULL DEFAULT 0,
        expires_at INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS market_listings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_username TEXT NOT NULL,
        seller_name TEXT NOT NULL,
        booth_title TEXT NOT NULL,
        seller_phone TEXT NOT NULL,
        category TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        price INTEGER NOT NULL DEFAULT 0,
        old_price INTEGER DEFAULT 0,
        discount_percent INTEGER DEFAULT 0,
        price_unit TEXT NOT NULL DEFAULT 'تومان',
        condition_badge TEXT NOT NULL DEFAULT 'نو / تولید تازه',
        delivery_badge TEXT NOT NULL DEFAULT 'تحویل حضوری در شمال شرق',
        specs_json TEXT,
        address_detail TEXT NOT NULL DEFAULT 'مشهد، شمال شرق',
        image_url TEXT NOT NULL,
        is_amazing INTEGER DEFAULT 0,
        amazing_status TEXT NOT NULL DEFAULT 'none',
        is_urgent INTEGER DEFAULT 0,
        urgent_status TEXT NOT NULL DEFAULT 'none',
        ladder_status TEXT NOT NULL DEFAULT 'none',
        laddered_at INTEGER NOT NULL DEFAULT 0,
        views_count INTEGER NOT NULL DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'pending',
        rejection_reason TEXT DEFAULT NULL,
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS listing_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        listing_id INTEGER NOT NULL,
        sender_username TEXT NOT NULL,
        receiver_username TEXT DEFAULT '',
        sender_name TEXT NOT NULL,
        message_text TEXT NOT NULL,
        offered_price INTEGER DEFAULT 0,
        message_type TEXT NOT NULL DEFAULT 'pv',
        status TEXT NOT NULL DEFAULT 'approved',
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS market_orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_code TEXT NOT NULL,
        listing_id INTEGER NOT NULL,
        listing_title TEXT NOT NULL,
        buyer_username TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        buyer_phone TEXT NOT NULL,
        buyer_address TEXT NOT NULL,
        seller_username TEXT NOT NULL,
        total_price INTEGER NOT NULL DEFAULT 0,
        order_status TEXT NOT NULL DEFAULT 'ثبت اولیه - در انتظار هماهنگی غرفه‌دار',
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
        setting_key TEXT PRIMARY KEY,
        setting_value TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS user_follows (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        follower_username TEXT NOT NULL,
        following_username TEXT NOT NULL,
        created_at TEXT NOT NULL
    )");

    $pdo->exec("CREATE TABLE IF NOT EXISTS community_media_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        app_target TEXT NOT NULL DEFAULT 'ahdino',
        media_type TEXT NOT NULL DEFAULT 'text',
        author_username TEXT NOT NULL DEFAULT 'resident',
        author_name TEXT NOT NULL,
        author_role TEXT DEFAULT 'عضو و روایتگر هم‌عهدی',
        title TEXT DEFAULT '',
        caption TEXT NOT NULL,
        media_url TEXT DEFAULT '',
        published_networks TEXT DEFAULT '[]',
        likes_count INTEGER NOT NULL DEFAULT 0,
        comments_json TEXT DEFAULT '[]',
        created_at TEXT NOT NULL
    )");

    try { $pdo->exec("ALTER TABLE market_listings ADD COLUMN views_count INTEGER NOT NULL DEFAULT 0"); } catch (Throwable $e) {}
    try { $pdo->exec("ALTER TABLE listing_messages ADD COLUMN receiver_username TEXT DEFAULT ''"); } catch (Throwable $e) {}
    try { $pdo->exec("ALTER TABLE listing_messages ADD COLUMN message_type TEXT NOT NULL DEFAULT 'pv'"); } catch (Throwable $e) {}
    try { $pdo->exec("UPDATE listing_messages SET status = 'approved' WHERE status = 'pending'"); } catch (Throwable $e) {}

    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_listings_status_cat ON market_listings(status, category, laddered_at DESC, id DESC)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_listings_seller ON market_listings(seller_username)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_stories_status_exp ON business_stories(status, expires_at)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_msgs_listing ON listing_messages(listing_id, status)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_orders_users ON market_orders(seller_username, buyer_username)");
    $pdo->exec("CREATE TABLE IF NOT EXISTS social_stories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL,
        author_username TEXT NOT NULL,
        author_role TEXT DEFAULT '',
        visibility TEXT DEFAULT 'public',
        title TEXT NOT NULL,
        caption TEXT NOT NULL,
        media_url TEXT DEFAULT '',
        media_type TEXT DEFAULT 'image',
        media_format TEXT DEFAULT 'image',
        likes_count INTEGER DEFAULT 0,
        replies_json TEXT DEFAULT '[]',
        created_at TEXT NOT NULL
    )");
    try { $pdo->exec("ALTER TABLE users ADD COLUMN profile_note TEXT DEFAULT ''"); } catch (Throwable $e) {}
    $v310Migrations = [
        "ALTER TABLE market_listings ADD COLUMN rating_avg REAL NOT NULL DEFAULT 4.8",
        "ALTER TABLE market_listings ADD COLUMN rating_count INTEGER NOT NULL DEFAULT 12",
        "ALTER TABLE market_listings ADD COLUMN stock_count INTEGER NOT NULL DEFAULT 15",
        "ALTER TABLE listing_messages ADD COLUMN offer_status TEXT NOT NULL DEFAULT 'pending'",
        "ALTER TABLE community_media_posts ADD COLUMN repost_of_id INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE community_media_posts ADD COLUMN repost_author TEXT DEFAULT ''",
        "ALTER TABLE community_media_posts ADD COLUMN reposts_count INTEGER NOT NULL DEFAULT 0",
        "ALTER TABLE community_media_posts ADD COLUMN poll_json TEXT DEFAULT ''",
        "ALTER TABLE community_media_posts ADD COLUMN media_gallery_json TEXT DEFAULT '[]'",
        "ALTER TABLE community_media_posts ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0"
    ];
    foreach ($v310Migrations as $mSql) {
        try { $pdo->exec($mSql); } catch (Throwable $e) {}
    }
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_cmp_target_id ON community_media_posts(app_target, id DESC)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_cmp_author ON community_media_posts(author_username)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_follows_pair ON user_follows(follower_username, following_username)");
    $pdo->exec("CREATE INDEX IF NOT EXISTS idx_social_stories_vis ON social_stories(visibility, id DESC)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_msgs_receiver ON listing_messages(receiver_username, sender_username)");
    // Full-Text Search Index (FTS5) برای جستجوی سریع و تمام‌متن روی آگهی‌ها
    try {
        $pdo->exec("CREATE VIRTUAL TABLE IF NOT EXISTS market_listings_fts USING fts5(listing_id UNINDEXED, title, description, category, booth_title, address_detail)");
        $pdo->exec("CREATE TRIGGER IF NOT EXISTS trg_ml_fts_ins AFTER INSERT ON market_listings BEGIN INSERT INTO market_listings_fts(listing_id, title, description, category, booth_title, address_detail) VALUES (new.id, new.title, new.description, new.category, new.booth_title, new.address_detail); END;");
        $pdo->exec("CREATE TRIGGER IF NOT EXISTS trg_ml_fts_del AFTER DELETE ON market_listings BEGIN DELETE FROM market_listings_fts WHERE listing_id = old.id; END;");
    } catch (Throwable $e) {
        try { $pdo->exec("CREATE INDEX IF NOT EXISTS idx_ml_title_search ON market_listings(title, category)"); } catch (Throwable $e2) {}
    }
}

function init_mysql_tables($pdo): void {
    $sqlFile = __DIR__ . '/../database/hamahdi_mysql.sql';
    if (file_exists($sqlFile)) {
        $pdo->exec(file_get_contents($sqlFile));
    }
    $mysqlAlters = [
        "ALTER TABLE `users` ADD COLUMN `first_name` VARCHAR(80) DEFAULT ''",
        "ALTER TABLE `users` ADD COLUMN `last_name` VARCHAR(80) DEFAULT ''",
        "ALTER TABLE `users` ADD COLUMN `age` INT DEFAULT 0",
        "ALTER TABLE `users` ADD COLUMN `national_code` VARCHAR(20) DEFAULT ''",
        "ALTER TABLE `users` ADD COLUMN `exact_address` TEXT DEFAULT NULL",
        "ALTER TABLE `users` ADD COLUMN `email` VARCHAR(140) DEFAULT ''",
        "ALTER TABLE `users` ADD COLUMN `national_card_url` LONGTEXT DEFAULT NULL",
        "ALTER TABLE `users` ADD COLUMN `booth_status` VARCHAR(20) NOT NULL DEFAULT 'pending'",
        "ALTER TABLE `users` ADD COLUMN `booth_rejection_reason` VARCHAR(255) DEFAULT NULL"
    ];
    foreach ($mysqlAlters as $q) {
        try { $pdo->exec($q); } catch (Throwable $e) {}
    }
}

// =========================================================================
// CONTAINERIZED BINARY (0/1 BLOB) DATABASE ENGINE (v3.3.5)
// ذخیره صفر و یک (Binary BLOB فشرده با SHA-256 Deduplication) در کانتینر مجزای دیتابیس
// و جلوگیری کامل از ذخیره فایل‌ها و ویدیوهای حجیم در پوشه آپلود سرور
// =========================================================================
if (!defined('SQLITE_BLOB_CONTAINER_PATH')) {
    define('SQLITE_BLOB_CONTAINER_PATH', dirname(SQLITE_DB_PATH) . '/hamahdi_binary_blobs.sqlite');
}
if (!defined('MAX_SITE_IMAGE_BLOB_BYTES')) {
    define('MAX_SITE_IMAGE_BLOB_BYTES', 2 * 1024 * 1024); // حداکثر ۲ مگابایت فقط برای تصاویر؛ ویدیو و فایل حجیم ممنوع
}

function get_binary_blob_container_pdo() {
    static $blobPdo = null;
    if ($blobPdo !== null) return $blobPdo;

    $dir = dirname(SQLITE_BLOB_CONTAINER_PATH);
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }

    if (class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        try {
            $blobPdo = new PDO('sqlite:' . SQLITE_BLOB_CONTAINER_PATH, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            try {
                $blobPdo->exec('PRAGMA journal_mode = WAL;');
                $blobPdo->exec('PRAGMA synchronous = NORMAL;');
                $blobPdo->exec('PRAGMA auto_vacuum = FULL;');
                $blobPdo->exec('PRAGMA page_size = 4096;');
            } catch (Throwable $e) {}
            $blobPdo->exec("CREATE TABLE IF NOT EXISTS binary_media_blobs (
                blob_hash TEXT PRIMARY KEY,
                mime_type TEXT NOT NULL,
                raw_size INTEGER NOT NULL,
                compressed_size INTEGER NOT NULL,
                is_compressed INTEGER NOT NULL DEFAULT 1,
                binary_payload BLOB NOT NULL,
                created_at INTEGER NOT NULL
            )");
            return $blobPdo;
        } catch (Throwable $e) {
            $blobPdo = null;
        }
    }
    return get_pdo();
}

function store_binary_blob_in_db_container(string $rawBinary, string $mimeType): string {
    $size = strlen($rawBinary);
    if ($size < 32) {
        throw new RuntimeException('داده باینری تصویر معتبر نیست.');
    }
    if (str_starts_with(strtolower($mimeType), 'video/') || $size > MAX_SITE_IMAGE_BLOB_BYTES) {
        throw new RuntimeException('ذخیره ویدیو و فایل‌های حجیم در سرور مجاز نیست؛ فقط تصاویر فشرده در قالب صفر و یک (BLOB) در دیتابیس ذخیره می‌شوند.');
    }
    $hash = hash('sha256', $rawBinary);
    $compressed = function_exists('gzdeflate') ? @gzdeflate($rawBinary, 9) : false;
    $isComp = ($compressed !== false && strlen($compressed) < $size) ? 1 : 0;
    $payloadToStore = $isComp ? $compressed : $rawBinary;
    $compSize = strlen($payloadToStore);

    $bPdo = get_binary_blob_container_pdo();
    if ($bPdo instanceof PDO) {
        try {
            $bPdo->exec("CREATE TABLE IF NOT EXISTS binary_media_blobs (
                blob_hash TEXT PRIMARY KEY,
                mime_type TEXT NOT NULL,
                raw_size INTEGER NOT NULL,
                compressed_size INTEGER NOT NULL,
                is_compressed INTEGER NOT NULL DEFAULT 1,
                binary_payload BLOB NOT NULL,
                created_at INTEGER NOT NULL
            )");
            $stmt = $bPdo->prepare("INSERT OR IGNORE INTO binary_media_blobs (
                blob_hash, mime_type, raw_size, compressed_size, is_compressed, binary_payload, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->bindValue(1, $hash, PDO::PARAM_STR);
            $stmt->bindValue(2, $mimeType, PDO::PARAM_STR);
            $stmt->bindValue(3, $size, PDO::PARAM_INT);
            $stmt->bindValue(4, $compSize, PDO::PARAM_INT);
            $stmt->bindValue(5, $isComp, PDO::PARAM_INT);
            $stmt->bindValue(6, $payloadToStore, PDO::PARAM_LOB);
            $stmt->bindValue(7, time(), PDO::PARAM_INT);
            $stmt->execute();
            return 'api/index.php?action=blob&h=' . $hash;
        } catch (Throwable $e) {}
    }

    // فال‌بک در صورت عدم وجود PDO SQLite: ذخیره در جدول site_settings به صورت باینری فشرده Base64
    $pdo = get_pdo();
    $b64Comp = base64_encode($payloadToStore);
    $metaJson = json_encode(['m' => $mimeType, 'c' => $isComp, 'd' => $b64Comp], JSON_UNESCAPED_UNICODE);
    $st = $pdo->prepare("INSERT OR REPLACE INTO site_settings (setting_key, setting_value) VALUES (?, ?)");
    $st->execute(['blob_' . $hash, $metaJson]);
    return 'api/index.php?action=blob&h=' . $hash;
}

function fetch_binary_blob_from_db_container(string $hash): ?array {
    $cleanHash = preg_replace('/[^a-f0-9]/i', '', strtolower($hash));
    if (strlen($cleanHash) !== 64) return null;

    $bPdo = get_binary_blob_container_pdo();
    if ($bPdo instanceof PDO) {
        try {
            $stmt = $bPdo->prepare("SELECT mime_type, is_compressed, binary_payload FROM binary_media_blobs WHERE blob_hash = ? LIMIT 1");
            $stmt->execute([$cleanHash]);
            $row = $stmt->fetch();
            if ($row && isset($row['binary_payload'])) {
                $raw = $row['binary_payload'];
                if (is_resource($raw)) {
                    $raw = stream_get_contents($raw);
                }
                if ((int)($row['is_compressed'] ?? 0) === 1 && function_exists('gzinflate')) {
                    $inflated = @gzinflate($raw);
                    if ($inflated !== false) $raw = $inflated;
                }
                return [
                    'mime_type' => $row['mime_type'] ?: 'image/webp',
                    'binary'    => $raw
                ];
            }
        } catch (Throwable $e) {}
    }

    $pdo = get_pdo();
    try {
        $st = $pdo->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ? LIMIT 1");
        $st->execute(['blob_' . $cleanHash]);
        $r = $st->fetch();
        if ($r && !empty($r['setting_value'])) {
            $meta = json_decode($r['setting_value'], true);
            if (is_array($meta) && !empty($meta['d'])) {
                $raw = base64_decode($meta['d'], true);
                if ($raw !== false && !empty($meta['c']) && function_exists('gzinflate')) {
                    $inf = @gzinflate($raw);
                    if ($inf !== false) $raw = $inf;
                }
                return [
                    'mime_type' => $meta['m'] ?? 'image/webp',
                    'binary'    => $raw
                ];
            }
        }
    } catch (Throwable $e) {}

    return null;
}

function delete_binary_blob_from_db_container(string $blobUri): void {
    if (!preg_match('/[?&]h=([a-f0-9]{64})/i', $blobUri, $m)) return;
    $hash = strtolower($m[1]);
    $bPdo = get_binary_blob_container_pdo();
    if ($bPdo instanceof PDO) {
        try {
            $st = $bPdo->prepare("DELETE FROM binary_media_blobs WHERE blob_hash = ?");

    // HAMAHDI v5.0: ایندکس‌های سرعت بالا برای عهد بازار و جدول هوش مصنوعی متنی
    try {
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_listings_status_ladder ON market_listings (status, laddered_at DESC, id DESC)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_listings_seller ON market_listings (seller_username)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_listings_category ON market_listings (category)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_messages_listing ON listing_messages (listing_id, id ASC)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_messages_users ON listing_messages (sender_username, receiver_username)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_orders_buyer_seller ON market_orders (buyer_username, seller_username, id DESC)");
        $pdo->exec("CREATE TABLE IF NOT EXISTS ai_chat_logs (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL, role TEXT NOT NULL, content TEXT NOT NULL, mode TEXT DEFAULT 'general', created_ts INTEGER NOT NULL)");
        $pdo->exec("CREATE INDEX IF NOT EXISTS idx_ai_chat_user_ts ON ai_chat_logs (username, created_ts DESC)");
    } catch (Throwable $__idxErr) {}

            $st->execute([$hash]);
        } catch (Throwable $e) {}
    }
}

