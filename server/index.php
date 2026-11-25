<?php
header('Content-Type: text/html; charset=utf-8');
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>سرور API هم‌عهدی نسخه ۵</title>
  <style>
    body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#040814;color:#f8fafc;font-family:Tahoma,sans-serif;padding:16px}
    .card{max-width:460px;width:100%;background:#0b1328;border:1px solid rgba(251,191,36,.4);border-radius:20px;padding:24px;text-align:center}
    h1{color:#fbbf24;font-size:20px;margin:0 0 10px}
    p{color:#cbd5e1;font-size:13px;line-height:1.8}
    .btns{display:flex;flex-direction:column;gap:10px;margin-top:18px}
    a{display:block;padding:12px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:13px}
    .primary{background:#fbbf24;color:#0f172a}
    .sec{background:rgba(34,211,238,.15);color:#67e8f9;border:1px solid rgba(34,211,238,.35)}
  </style>
</head>
<body>
  <div class="card">
    <h1>سرور PHP هم‌عهدی نسخه ۵ فعال است</h1>
    <p>دیتابیس SQLite (WAL)، سرویس عهد بازار، عهدبات (۴ پیام‌رسان) و دستیار هوش مصنوعی متنی آماده پاسخگویی به اپلیکیشن اندروید هستند.</p>
    <div class="btns">
      <a class="primary" href="./admin.html">🛡️ ورود به داشبورد مدیریت (فقط وب)</a>
      <a class="sec" href="./api/index.php?action=health">🔍 بررسی سلامت سرور (JSON Health)</a>
      <a class="sec" href="./ai_api.php?action=status">🤖 وضعیت دستیار هوش مصنوعی متنی</a>
    </div>
  </div>
</body>
</html>
