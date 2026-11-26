/**
 * ============================================================================
 * HAMAHDI v5.0 Production | اتصال ثابت و امن اپلیکیشن اندروید به https://mssn.ir/hamahdi
 * ============================================================================
 * بدون گزینه اضافی تنظیمات سرور در رابط کاربری موبایل
 */
(function () {
  const PRODUCTION_URL = 'https://mssn.ir/hamahdi';

  window.HAMAHDI_CONFIG = {
    APP_VERSION: '5.0.0',
    CLIENT_PLATFORM: 'android-apk',
    DEFAULT_SERVER_URL: PRODUCTION_URL
  };

  window.hamahdiGetServerUrl = function () {
    try {
      const loc = window.location;
      const isCapacitor =
        loc.protocol === 'capacitor:' ||
        loc.protocol === 'file:' ||
        (loc.hostname === 'localhost' && !loc.port) ||
        (typeof window.Capacitor !== 'undefined' && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
      // فقط در پیش‌نمایش لوکال توسعه‌دهنده روی مرورگر (پورت 8080) به پورت 8000 لوکال وصل شو
      if (!isCapacitor && (loc.port === '8080' || loc.port === '5500' || loc.port === '5173')) {
        const host = (loc.hostname === '0.0.0.0' || !loc.hostname) ? '127.0.0.1' : loc.hostname;
        return loc.protocol + '//' + host + ':8000';
      }
    } catch (e) {}
    return PRODUCTION_URL;
  };

  window.hamahdiApiUrl = function (relativePath) {
    const p = String(relativePath || '').replace(/^\.?\//, '');
    if (/^https?:\/\//i.test(p)) return p;
    return window.hamahdiGetServerUrl().replace(/\/+$/, '') + '/' + p;
  };

  window.hamahdiMediaUrl = function (src) {
    if (!src || typeof src !== 'string') return src;
    if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
    if (/^\.?\/?(api\/|storage\/)/i.test(src)) {
      return window.hamahdiApiUrl(src);
    }
    return src;
  };

  if (typeof window.fetch === 'function' && !window.__hamahdiFetchPatched) {
    window.__hamahdiFetchPatched = true;
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function (input, init) {
      let url = typeof input === 'string' ? input : (input && input.url ? input.url : '');
      if (typeof input === 'string' && /^\.?\/?(api\/|bot_api\.php|ai_api\.php|storage\/)/i.test(url)) {
        input = window.hamahdiApiUrl(url);
        init = Object.assign({}, init || {});
        const hdrs = new Headers(init.headers || {});
        if (!hdrs.has('X-Client-Platform')) hdrs.set('X-Client-Platform', window.HAMAHDI_CONFIG.CLIENT_PLATFORM);
        if (!hdrs.has('X-App-Version')) hdrs.set('X-App-Version', window.HAMAHDI_CONFIG.APP_VERSION);
        init.headers = hdrs;
      }
      return nativeFetch(input, init);
    };
  }
})();
