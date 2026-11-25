<?php
/**
 * =============================================================================
 * HAMAHDI v3.5.1 — ماژول بهینه‌سازی مقیاس‌پذیری و کشینگ هوشمند سمت سرور
 * سازگار ۱۰۰٪ با هر سه موتور دیتابیس: PDO (MySQL/SQLite)، HamahdiSqlite3Adapter و HamahdiJsonAdapter
 * =============================================================================
 */

if (!function_exists('hamahdi_enable_json_gzip')) {
    function hamahdi_enable_json_gzip(): void {
        if (headers_sent()) return;
        if (!extension_loaded('zlib')) return;
        if (ini_get('zlib.output_compression')) return;
        $ae = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';
        if (stripos($ae, 'gzip') !== false && function_exists('ob_gzhandler')) {
            @ob_start('ob_gzhandler');
        }
    }
}

if (!function_exists('hamahdi_compute_state_version')) {
    function hamahdi_compute_state_version($pdo, bool $isAdmin, string $sessionUser = ''): string {
        $parts = [$isAdmin ? 'A' : 'U', strtolower($sessionUser)];

        // اگر موتور دیتابیس PDO یا SQLite3 واقعی است، نسخه از روی شمارش سریع جداول محاسبه می‌شود
        if ($pdo instanceof PDO || (class_exists('HamahdiSqlite3Adapter') && $pdo instanceof HamahdiSqlite3Adapter)) {
            $tables = [
                'users',
                'hero_slides',
                'business_stories',
                'market_listings',
                'listing_messages',
                'market_orders',
                'community_media_posts',
                'social_stories',
                'user_bot_channels',
            ];
            foreach ($tables as $tbl) {
                try {
                    $stmt = $pdo->query("SELECT COUNT(*) AS c, COALESCE(MAX(id), 0) AS m FROM `{$tbl}`");
                    $row = $stmt ? $stmt->fetch(PDO::FETCH_ASSOC) : null;
                    if (is_array($row)) {
                        $parts[] = ($row['c'] ?? 0) . ':' . ($row['m'] ?? 0);
                    } else {
                        $parts[] = '0:0';
                    }
                } catch (Throwable $e) {
                    $parts[] = '0:0';
                }
            }
            return substr(md5(implode('|', $parts)), 0, 16);
        }

        // اگر هاست از موتور جایگزین HamahdiJsonAdapter استفاده می‌کند، نسخه با سرعت آنی از فایل داده خوانده می‌شود
        $dataDir = dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'storage' . DIRECTORY_SEPARATOR . 'data';
        if (is_dir($dataDir)) {
            clearstatcache(true);
            foreach (glob($dataDir . DIRECTORY_SEPARATOR . '*.json') ?: [] as $jf) {
                $parts[] = basename($jf) . ':' . @filemtime($jf) . ':' . @filesize($jf);
            }
        }
        if (count($parts) <= 2) {
            // در صورت نبود فایل قابل ردیابی، نسخه غیرتکراری برگردان تا هیچ‌گاه کش اشتباه رخ ندهد
            $parts[] = (string)microtime(true);
        }
        return substr(md5(implode('|', $parts)), 0, 16);
    }
}

if (!function_exists('hamahdi_handle_conditional_load_state')) {
    function hamahdi_handle_conditional_load_state($pdo, bool $isAdmin, string $sessionUser = ''): void {
        hamahdi_enable_json_gzip();
        try {
            $version = hamahdi_compute_state_version($pdo, $isAdmin, $sessionUser);
            $clientVer = trim((string)($_GET['last_version'] ?? $_SERVER['HTTP_IF_NONE_MATCH'] ?? ''));
            $clientVer = trim($clientVer, '"');

            if (!headers_sent()) {
                header('ETag: "' . $version . '"');
                header('Cache-Control: no-cache, must-revalidate');
            }

            if ($clientVer !== '' && $clientVer === $version) {
                echo json_encode([
                    'ok' => true,
                    'unchanged' => true,
                    'state_version' => $version,
                ], JSON_UNESCAPED_UNICODE);
                exit;
            }

            $payload = build_full_state($pdo, $isAdmin, $sessionUser);
            if (is_array($payload)) {
                $payload['state_version'] = $version;
            }
            echo json_encode($payload, JSON_UNESCAPED_UNICODE);
            exit;
        } catch (Throwable $e) {
            // Fallback ایمن: در هر شرایطی پاسخ استاندارد load_state برگردانده می‌شود
            echo json_encode(build_full_state($pdo, $isAdmin, $sessionUser), JSON_UNESCAPED_UNICODE);
            exit;
        }
    }
}