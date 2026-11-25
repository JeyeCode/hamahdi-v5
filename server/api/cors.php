<?php
/**
 * HAMAHDI v5.0 | ماژول یکپارچه CORS، هدرهای موبایل APK و خروجی استاندارد JSON
 */

function hamahdi_apply_mobile_cors(bool $enableGzip = true): void {
    if ($enableGzip && !headers_sent() && extension_loaded('zlib')) {
        if (!ob_start('ob_gzhandler')) {
            ob_start();
        }
    }
    if (!headers_sent()) {
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('X-Content-Type-Options: nosniff');

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
        if (defined('HAMAHDI_CORS_ALLOW_ALL') && HAMAHDI_CORS_ALLOW_ALL) {
            header('Access-Control-Allow-Origin: ' . ($origin !== '' ? $origin : '*'));
            if ($origin !== '' && $origin !== '*') {
                header('Access-Control-Allow-Credentials: true');
                header('Vary: Origin');
            }
        } else {
            header('Access-Control-Allow-Origin: *');
        }

        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Admin-Token, X-User-Token, X-Session-User, X-CSRF-Token, X-Client-Platform, X-App-Version');
        header('Access-Control-Max-Age: 86400');
    }

    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

function hamahdi_is_mobile_apk_client(): bool {
    $platform = strtolower(trim((string)($_SERVER['HTTP_X_CLIENT_PLATFORM'] ?? '')));
    return in_array($platform, ['android-apk', 'capacitor-android', 'mobile-apk'], true);
}

function hamahdi_extract_bearer_token(): string {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($authHeader === '' && function_exists('apache_request_headers')) {
        $hdrs = @apache_request_headers();
        if (is_array($hdrs)) {
            $authHeader = $hdrs['Authorization'] ?? $hdrs['authorization'] ?? '';
        }
    }
    if (preg_match('/Bearer\s+(.+)/i', (string)$authHeader, $m)) {
        return trim($m[1]);
    }
    return '';
}

function hamahdi_send_json(array $payload, int $statusCode = 200): void {
    if (!headers_sent()) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
