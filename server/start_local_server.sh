#!/usr/bin/env bash
# اجرای سریع سرور لوکال PHP برای تست نسخه ۵ هم‌عهدی (قابل دسترسی از گوشی اندروید در شبکه Wi-Fi)
PORT="${1:-8000}"
echo "=================================================="
echo "  Ham-Ahdi v5 Local PHP API Server (SQLite WAL)"
echo "  Local Browser : http://127.0.0.1:${PORT}/admin.html"
echo "  API Health    : http://127.0.0.1:${PORT}/api/index.php?action=health"
echo "  Android Emu   : http://10.0.2.2:${PORT}"
echo "=================================================="
php -S "0.0.0.0:${PORT}" -t "$(dirname "$0")"
