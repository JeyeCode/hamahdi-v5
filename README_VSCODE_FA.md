# راهنمای پروژه هم‌عهدی نسخه ۵ (اندروید APK + بک‌اند PHP)

## ۱. تست زنده در حالت لوکال (در VS Code / PowerShell)
دو ترمینال جداگانه در VS Code باز کنید:

- **ترمینال ۱ (سرور PHP + SQLite WAL + هوش مصنوعی متنی + ۴ پیام‌رسان):**
  ```powershell
  cd hamahdi_v5\server; php -S 0.0.0.0:8000
  ```
  - پنل مدیریت وب: `http://127.0.0.1:8000/admin.html`
  - تست سلامت API: `http://127.0.0.1:8000/api/index.php?action=health`

- **ترمینال ۲ (پیش‌نمایش رابط موبایل APK):**
  ```powershell
  cd hamahdi_v5\android_app\www; php -S 0.0.0.0:8080
  ```
  - باز کنید: `http://127.0.0.1:8080` (به‌صورت خودکار به سرور پورت `8000` وصل می‌شود).

## ۲. تنظیم کلید هوش مصنوعی متنی و اتصال به هاست نهایی
- **سمت سرور (`server/config.php`):**
  - مقدار `HAMAHDI_AI_API_KEY` و `HAMAHDI_AI_API_BASE` را تنظیم کنید (تا قبل از تنظیم کلید، حالت تست لوکال پاسخ می‌دهد).
  - رمز ادمین وب (`ADMIN_DEFAULT_PASSWORD`) را قبل از انتشار تغییر دهید.
- **سمت اپلیکیشن (`android_app/www/assets/js/core/app_config.js`):**
  - مقدار `DEFAULT_PRODUCTION_URL` را به دامنه هاست خود (مثلاً `https://yourdomain.com`) تغییر دهید.
  - همچنین داخل خود اپ (منوی همبرگری بالا → **تنظیمات سرور**) می‌توانید در هر لحظه بین لوکال و هاست سوییچ کنید.

## ۳. دریافت فایل نهایی APK (بدون نیاز به نصب Android Studio)
1. پوشه `hamahdi_v5` را در یک مخزن **GitHub** آپلود (Push) کنید.
2. وارد تب **Actions** در GitHub شوید → ورک‌فلو **Build Ham-Ahdi v5 Android APK** به‌صورت خودکار اجرا می‌شود.
3. پس از ۲ تا ۳ دقیقه، فایل **`hamahdi-v5-android-apk`** (شامل `app-debug.apk`) را دانلود و روی گوشی اندروید نصب کنید.
