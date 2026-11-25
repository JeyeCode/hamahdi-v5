/**
 * ============================================================================
 * HAMAHDI v5.0 | تنظیمات اتصال سرور اپلیکیشن اندروید (حالت لوکال و هاست نهایی)
 * ============================================================================
 * برای تغییر آدرس پیش‌فرض سرور قبل از بیلد نهایی APK، فقط مقدار DEFAULT_PRODUCTION_URL
 * را در همین فایل در VS Code تغییر دهید.
 * همچنین در حین تست لوکال، می‌توانید آدرس سرور را مستقیم از منوی همبرگری داخل اپ تغییر دهید.
 */
(function () {
  const STORAGE_KEY = 'hamahdi_v5_server_url';

  // آدرس پیش‌فرض هنگام تست لوکال با شبیه‌ساز اندروید: http://10.0.2.2:8000
  // برای تست با گوشی واقعی در شبکه وای‌فای: آدرس IP کامپیوتر خود را وارد کنید (مثلاً http://192.168.1.5:8000)
  // برای نسخه نهایی هاست: آدرس دامنه خود را قرار دهید (مثلاً https://hamahdi.ir)
  const DEFAULT_PRODUCTION_URL = 'http://10.0.2.2:8000';

  function normalizeBaseUrl(raw) {
    let u = String(raw || '').trim();
    if (!u) return '';
    if (!/^https?:\/\//i.test(u)) {
      u = 'http://' + u;
    }
    return u.replace(/\/+$/, '');
  }

  window.HAMAHDI_CONFIG = {
    APP_VERSION: '5.0.0',
    CLIENT_PLATFORM: 'android-apk',
    DEFAULT_SERVER_URL: DEFAULT_PRODUCTION_URL
  };

  window.hamahdiGetServerUrl = function () {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved.trim()) {
        return normalizeBaseUrl(saved);
      }
    } catch (e) {}

    // اگر در مرورگر وب (غیر از Capacitor localhost) باز شده باشد، از همان origin استفاده کن
    try {
      const loc = window.location;
      const isCapacitor =
        loc.protocol === 'capacitor:' ||
        loc.protocol === 'file:' ||
        (loc.hostname === 'localhost' && !loc.port) ||
        (typeof window.Capacitor !== 'undefined' && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
      if (!isCapacitor && (loc.protocol === 'http:' || loc.protocol === 'https:')) {
        if (loc.port === '8080' || loc.port === '5500' || loc.port === '5173') {
          const host = (loc.hostname === '0.0.0.0' || !loc.hostname) ? '127.0.0.1' : loc.hostname;
          return loc.protocol + '//' + host + ':8000';
        }
        return loc.origin;
      }
    } catch (e) {}

    return normalizeBaseUrl(DEFAULT_PRODUCTION_URL);
  };

  window.hamahdiSetServerUrl = function (newUrl) {
    const clean = normalizeBaseUrl(newUrl);
    try {
      if (clean) {
        localStorage.setItem(STORAGE_KEY, clean);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {}
    return clean || window.hamahdiGetServerUrl();
  };

  window.hamahdiApiUrl = function (relativePath) {
    const p = String(relativePath || '').replace(/^\.?\//, '');
    if (/^https?:\/\//i.test(p)) return p;
    const base = window.hamahdiGetServerUrl();
    return base ? (base + '/' + p) : p;
  };

  window.hamahdiMediaUrl = function (src) {
    if (!src || typeof src !== 'string') return src;
    if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
    if (src.startsWith('api/') || src.startsWith('./api/') || src.startsWith('storage/') || src.startsWith('./storage/')) {
      return window.hamahdiApiUrl(src);
    }
    return src;
  };

  // رهگیری هوشمند fetch برای هدایت خودکار مسیرهای نسبی api/، bot_api.php و ai_api.php به سرور تنظیم‌شده
  if (typeof window.fetch === 'function' && !window.__hamahdiFetchPatched) {
    window.__hamahdiFetchPatched = true;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      const isRelApi =
        typeof input === 'string' &&
        /^\.?\/?(api\/|bot_api\.php|ai_api\.php|storage\/)/i.test(url);

      if (isRelApi) {
        input = window.hamahdiApiUrl(url);
        init = Object.assign({}, init || {});
        const hdrs = new Headers(init.headers || {});
        if (!hdrs.has('X-Client-Platform')) {
          hdrs.set('X-Client-Platform', window.HAMAHDI_CONFIG.CLIENT_PLATFORM);
        }
        if (!hdrs.has('X-App-Version')) {
          hdrs.set('X-App-Version', window.HAMAHDI_CONFIG.APP_VERSION);
        }
        init.headers = hdrs;
      }
      return nativeFetch(input, init);
    };
  }

  // مودال تنظیمات سرور (سوییچ سریع بین حالت لوکال و هاست نهایی + تست اتصال)
  window.openServerConnectionModal = function () {
    const currentUrl = window.hamahdiGetServerUrl();
    const html = `
      <div class="p-5 sm:p-6 space-y-4 text-right" dir="rtl">
        <div class="flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <h3 class="text-base sm:text-lg font-black text-amber-300">🌐 تنظیمات اتصال به سرور هم‌عهدی</h3>
            <p class="text-[11px] text-slate-400 mt-0.5">تغییر سریع بین سرور لوکال (تست) و هاست نهایی PHP</p>
          </div>
          <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold">✕</button>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-slate-200">آدرس سرور بک‌اند (PHP API):</label>
          <input id="hm-server-url-input" type="url" dir="ltr" value="${currentUrl}" placeholder="http://192.168.1.5:8000 یا https://yourdomain.com" class="glass-input w-full px-3.5 py-2.5 rounded-2xl text-sm text-left font-mono" />
          <div class="flex flex-wrap gap-1.5 pt-1">
            <button type="button" onclick="document.getElementById('hm-server-url-input').value='http://10.0.2.2:8000'" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] text-amber-200 font-bold">شبیه‌ساز اندروید (10.0.2.2)</button>
            <button type="button" onclick="document.getElementById('hm-server-url-input').value='http://127.0.0.1:8000'" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] text-cyan-200 font-bold">لوکال (127.0.0.1)</button>
            <button type="button" onclick="document.getElementById('hm-server-url-input').value='http://192.168.1.5:8000'" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-[10px] text-emerald-200 font-bold">شبکه Wi-Fi (192.168.x.x)</button>
          </div>
        </div>

        <div id="hm-server-test-result" class="hidden p-3 rounded-2xl text-xs border"></div>

        <div class="grid grid-cols-2 gap-2.5 pt-1">
          <button type="button" onclick="testHamahdiServerConnection()" class="py-2.5 px-3 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-200 font-black text-xs hover:bg-cyan-500/30 transition">
            🔍 تست اتصال (Health)
          </button>
          <button type="button" onclick="saveHamahdiServerConnection()" class="py-2.5 px-3 rounded-2xl bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg">
            ✅ ذخیره و همگام‌سازی
          </button>
        </div>
      </div>
    `;
    if (typeof openModal === 'function') {
      openModal(html);
    }
  };

  window.testHamahdiServerConnection = async function () {
    const inp = document.getElementById('hm-server-url-input');
    const box = document.getElementById('hm-server-test-result');
    if (!inp || !box) return;
    const target = normalizeBaseUrl(inp.value);
    box.className = 'p-3 rounded-2xl text-xs border border-amber-400/40 bg-amber-500/10 text-amber-200';
    box.textContent = 'در حال بررسی اتصال به ' + target + ' ...';
    try {
      const res = await fetch(target + '/api/index.php?action=health&_t=' + Date.now(), {
        headers: { 'X-Client-Platform': window.HAMAHDI_CONFIG.CLIENT_PLATFORM }
      });
      const data = await res.json();
      if (data && data.status === 'ok') {
        box.className = 'p-3 rounded-2xl text-xs border border-emerald-400/50 bg-emerald-500/15 text-emerald-200 space-y-1';
        box.innerHTML =
          '<div class="font-black">✅ اتصال به سرور هم‌عهدی برقرار شد!</div>' +
          '<div>نسخه سرور: <b>' + (data.version || '5.0.0') + '</b> | PHP: <b>' + (data.php_version || '-') + '</b></div>' +
          '<div>دیتابیس SQLite: <b>' + (data.sqlite_journal_mode || 'wal') + '</b> | هوش مصنوعی متنی: <b>' + (data.ai_configured ? 'آنلاین' : 'حالت تست لوکال') + '</b></div>';
      } else {
        throw new Error('پاسخ نامعتبر از سرور');
      }
    } catch (err) {
      box.className = 'p-3 rounded-2xl text-xs border border-rose-400/50 bg-rose-500/15 text-rose-200';
      box.textContent = '❌ خطا در اتصال به سرور: مطمئن شوید سرور PHP روی این آدرس روشن است و گوشی و سیستم در یک شبکه Wi-Fi هستند.';
    }
  };

  window.saveHamahdiServerConnection = async function () {
    const inp = document.getElementById('hm-server-url-input');
    if (!inp) return;
    const saved = window.hamahdiSetServerUrl(inp.value);
    if (typeof closeModal === 'function') closeModal();
    if (typeof showToast === 'function') {
      showToast('آدرس سرور ذخیره شد: ' + saved, 'success');
    }
    if (typeof syncStateFromServer === 'function') {
      await syncStateFromServer();
      if (typeof renderCurrentPage === 'function') renderCurrentPage();
    }
  };
})();
