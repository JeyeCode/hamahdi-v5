/**
 * HAMAHDI v4.0.0 | ماژول هسته ۱: مدیریت وضعیت (State)، تنظیمات پایه و حافظه محلی
 */
// =========================================================================
// v3.3.7 PERFORMANCE HELPERS: Chunked Task Scheduler + Request Dedup + ETag
// =========================================================================
window.__hmInFlightRequests = window.__hmInFlightRequests || new Map();
window.__hmEtagCache = window.__hmEtagCache || new Map();
window.runChunkedTask = function(items, processItemFn, chunkSize = 18, onComplete = null) {
  const arr = Array.from(items || []);
  let idx = 0;
  function nextChunk() {
    const end = Math.min(idx + chunkSize, arr.length);
    for (; idx < end; idx++) {
      try { processItemFn(arr[idx], idx); } catch (e) {}
    }
    if (idx < arr.length) {
      setTimeout(nextChunk, 0);
    } else if (typeof onComplete === 'function') {
      onComplete();
    }
  }
  nextChunk();
};

    let storyAutoAdvanceTimer = null;
/**
 * HAMAHDI (هم‌عهدی) - هسته مدیریت وضعیت، ارتباط با سرور (API)، کشینگ و فشرده‌سازی WebP (نسخه 6.0)
 */
    // Clean Production State (v4.0 - All 11 Market, Booth & Admin Enhancements)
    // =========================================================================
    const CLEAN_PRODUCTION_STATE = {
      "currentPage": "landing",
      "selectedBoothUsername": null,
      "adminActiveTab": "pending_queue",
      "currentUser": null,
      "leaderPhotos": {
            "1": null
      },
      "solidarityThemeIndex": 0,
      "heroSlides": [
            {
                  "id": 101,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23042f2e'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3Eاکوسیستم جامع و یکپارچه هم‌عهدی%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسوپراپلیکیشن مردمی هم‌عهدی%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eیک حساب کاربری واحد برای ۶ اپلیکیشن تخصصی و استودیو هوشمند رسانه%3C/text%3E%3C/svg%3E",
                  "photographer_name": "مدیریت سوپراپلیکیشن هم‌عهدی",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            },
            {
                  "id": 102,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23451a03'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%23f59e0b' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23f59e0b' text-anchor='middle'%3Eاپلیکیشن ۱ • اقتصاد و معیشت مردمی%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعهد بازار | خرید و فروش بی‌واسطه%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eغرفه اختصاصی رایگان، پیشنهادهای شگفت‌انگیز و انتشار آگهی با هزینه معنوی%3C/text%3E%3C/svg%3E",
                  "photographer_name": "واحد عهد بازار",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            },
            {
                  "id": 103,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23082f49'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3Eاپلیکیشن ۲ • شبکه پیام متنی و صوتی%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعهدینو | رسانه روایتگری و گفتگو%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eانتشار آنی پیام‌های متنی، پادکست‌های کوتاه و روایت‌های صوتی به نام هر کاربر%3C/text%3E%3C/svg%3E",
                  "photographer_name": "واحد رسانه عهدینو",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            },
            {
                  "id": 104,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234a044e'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3Eاپلیکیشن ۳ • رسانه تصویری و ویدیویی%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعهدانه | قاب‌های ماندگار و ریلزها%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاشتراک‌گذاری تصاویر، ریلزهای ویدیویی و استوری‌های تمام‌صفحه با طراحی مدرن%3C/text%3E%3C/svg%3E",
                  "photographer_name": "واحد رسانه عهدانه",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            },
            {
                  "id": 105,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3Eاستودیو هوشمند اصحاب رسانه و مدیران کانال%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعهدبات | انتشار در صف ۵ پیام‌رسان%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاتصال کانال‌ها به ربات مرکزی و ارسال خودکار در صف یکی‌یکی به شبکه‌های اجتماعی%3C/text%3E%3C/svg%3E",
                  "photographer_name": "استودیو عهدبات",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            },
            {
                  "id": 106,
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 360'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e1b4b'/%3E%3Cstop offset='1' stop-color='%23090d16'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='360' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='760' height='320' rx='20' fill='rgba(2,6,23,.4)' stroke='%23818cf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='400' y='90' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23818cf8' text-anchor='middle'%3Eاپلیکیشن‌های ۴، ۵ و ۶ اکوسیستم هم‌عهدی%3C/text%3E%3Ctext x='400' y='180' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعهدیار • عهدآموز • عهدشنو%3C/text%3E%3Ctext x='400' y='259' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eنقشه خدمات شهری و همیاری، آموزش مهارت‌های کسب‌وکار و رادیو پادکست%3C/text%3E%3C/svg%3E",
                  "photographer_name": "تیم توسعه هم‌عهدی",
                  "submitted_by": "مدیریت سامانه",
                  "status": "approved"
            }
      ],
      "activeSlideIndex": 0,
      "stories": [
            {
                  "id": 201,
                  "owner_username": "mahmoud_rezvani",
                  "booth_title": "غرفه ارگانیک رضوان",
                  "caption": "۱۹٪ تخفیف ویژه عسل چهل‌گیاه",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eغرفه ارگانیک رضوان%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eتخفیف عسل%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه عسل چهل‌گیاه%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794392892,
                  "expires_at": 1794565692
            },
            {
                  "id": 202,
                  "owner_username": "saeed_karimi",
                  "booth_title": "خدمات فنی و تاسیسات کریمی",
                  "caption": "اعزام فوری در سراسر شمال شرق",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eخدمات فنی و تاسیسات کریمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس پکیج%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eاعزام فوری در سراسر شمال شرق%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794392292,
                  "expires_at": 1794565692
            },
            {
                  "id": 203,
                  "owner_username": "zahra_ahmadi",
                  "booth_title": "محصولات خانگی کوثر",
                  "caption": "پخت امروز آماده تحویل",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمحصولات خانگی کوثر%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسبزی تازه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت امروز آماده تحویل%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794391692,
                  "expires_at": 1794565692
            },
            {
                  "id": 204,
                  "owner_username": "ali_rahimi",
                  "booth_title": "فرش دستباف و صنایع دستی طوس",
                  "caption": "بدون بهره ویژه زوج‌های جوان",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eفرش دستباف و صنایع دستی طوس%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفرش اقساطی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eبدون بهره ویژه زوج‌های جوان%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794391092,
                  "expires_at": 1794565692
            },
            {
                  "id": 205,
                  "owner_username": "mohammad_hosseini",
                  "booth_title": "لبنیات سنتی بهار",
                  "caption": "۱۹٪ تخفیف ویژه امروز",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eلبنیات سنتی بهار%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپکیج صبحانه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه امروز%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794390492,
                  "expires_at": 1794565692
            },
            {
                  "id": 206,
                  "owner_username": "maryam_sadeghi",
                  "booth_title": "تولیدی پوشاک و خیاطی نور",
                  "caption": "۲۰٪ تخفیف تولیدی پوشاک نور",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eتولیدی پوشاک و خیاطی نور%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eحراج مانتو%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ تخفیف تولیدی پوشاک نور%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794389892,
                  "expires_at": 1794565692
            },
            {
                  "id": 207,
                  "owner_username": "hamed_alavi",
                  "booth_title": "آکادمی مهارت و دیجیتال فردا",
                  "caption": "۳۱٪ تخفیف ثبت‌نام ترم جدید",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eآکادمی مهارت و دیجیتال فردا%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلاس کامپیوتر%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۳۱٪ تخفیف ثبت‌نام ترم جدید%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794389292,
                  "expires_at": 1794565692
            },
            {
                  "id": 208,
                  "owner_username": "akbar_noori",
                  "booth_title": "نان و شیرینی خانگی برکت",
                  "caption": "پخت عصرانه با ۲۴٪ تخفیف",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eنان و شیرینی خانگی برکت%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه داغ%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت عصرانه با ۲۴٪ تخفیف%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794388692,
                  "expires_at": 1794565692
            },
            {
                  "id": 209,
                  "owner_username": "javad_mohammadi",
                  "booth_title": "املاک و خودرو امین شمال شرق",
                  "caption": "رهن و خرید آپارتمان در شمال شرق",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eاملاک و خودرو امین شمال شرق%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفایل‌های فوری%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eرهن و خرید آپارتمان در شمال شرق%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794388092,
                  "expires_at": 1794565692
            },
            {
                  "id": 210,
                  "owner_username": "fatemeh_kazemi",
                  "booth_title": "صنایع چوب و مبلمان ابرار",
                  "caption": "۲۰٪ زیر قیمت نمایشگاه",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eصنایع چوب و مبلمان ابرار%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمبل تولیدی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ زیر قیمت نمایشگاه%3C/text%3E%3C/svg%3E",
                  "status": "approved",
                  "created_ts": 1794387492,
                  "expires_at": 1794565692
            }
      ],
      "socialStories": [
            {
                  "id": 901,
                  "scope": "public",
                  "owner_username": "mahmoud_rezvani",
                  "owner_name": "حاج محمود رضوانی",
                  "title": "تخفیف عسل",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ر%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eتخفیف عسل%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه عسل چهل‌گیاه%3C/text%3E%3C/svg%3E",
                  "caption": "۱۹٪ تخفیف ویژه عسل چهل‌گیاه",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 902,
                  "scope": "personal",
                  "owner_username": "mahmoud_rezvani",
                  "owner_name": "حاج محمود رضوانی",
                  "title": "محصولات ما",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ر%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمحصولات ما%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eکنترل کیفیت زعفران و عسل%3C/text%3E%3C/svg%3E",
                  "caption": "کنترل کیفیت زعفران و عسل",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 903,
                  "scope": "public",
                  "owner_username": "saeed_karimi",
                  "owner_name": "مهندس سعید کریمی",
                  "title": "سرویس پکیج",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eس‌ک%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس پکیج%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eاعزام فوری در سراسر شمال شرق%3C/text%3E%3C/svg%3E",
                  "caption": "اعزام فوری در سراسر شمال شرق",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 904,
                  "scope": "personal",
                  "owner_username": "saeed_karimi",
                  "owner_name": "مهندس سعید کریمی",
                  "title": "ابزار تخصصی",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eس‌ک%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eابزار تخصصی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eتعمیر برد و قطعات اصلی%3C/text%3E%3C/svg%3E",
                  "caption": "تعمیر برد و قطعات اصلی",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 905,
                  "scope": "public",
                  "owner_username": "zahra_ahmadi",
                  "owner_name": "زهرا احمدی",
                  "title": "سبزی تازه",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eز‌ا%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسبزی تازه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت امروز آماده تحویل%3C/text%3E%3C/svg%3E",
                  "caption": "پخت امروز آماده تحویل",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 906,
                  "scope": "personal",
                  "owner_username": "zahra_ahmadi",
                  "owner_name": "زهرا احمدی",
                  "title": "ترشیجات",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eز‌ا%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشیجات%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eسیرترشی و لیته خانگی%3C/text%3E%3C/svg%3E",
                  "caption": "سیرترشی و لیته خانگی",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 907,
                  "scope": "public",
                  "owner_username": "ali_rahimi",
                  "owner_name": "استاد علی رحیمی",
                  "title": "فرش اقساطی",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eع‌ر%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفرش اقساطی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eبدون بهره ویژه زوج‌های جوان%3C/text%3E%3C/svg%3E",
                  "caption": "بدون بهره ویژه زوج‌های جوان",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 908,
                  "scope": "personal",
                  "owner_username": "ali_rahimi",
                  "owner_name": "استاد علی رحیمی",
                  "title": "کارگاه طوس",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eع‌ر%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه طوس%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eآموزش و بافت تابلوفرش%3C/text%3E%3C/svg%3E",
                  "caption": "آموزش و بافت تابلوفرش",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 909,
                  "scope": "public",
                  "owner_username": "mohammad_hosseini",
                  "owner_name": "محمدرضا حسینی",
                  "title": "پکیج صبحانه",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ح%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپکیج صبحانه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه امروز%3C/text%3E%3C/svg%3E",
                  "caption": "۱۹٪ تخفیف ویژه امروز",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 910,
                  "scope": "personal",
                  "owner_username": "mohammad_hosseini",
                  "owner_name": "محمدرضا حسینی",
                  "title": "لبنیات بهار",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ح%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eلبنیات بهار%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eشیر و ماست خالص محلی%3C/text%3E%3C/svg%3E",
                  "caption": "شیر و ماست خالص محلی",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 911,
                  "scope": "public",
                  "owner_username": "maryam_sadeghi",
                  "owner_name": "مریم صادقی",
                  "title": "حراج مانتو",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ص%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eحراج مانتو%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ تخفیف تولیدی پوشاک نور%3C/text%3E%3C/svg%3E",
                  "caption": "۲۰٪ تخفیف تولیدی پوشاک نور",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 912,
                  "scope": "personal",
                  "owner_username": "maryam_sadeghi",
                  "owner_name": "مریم صادقی",
                  "title": "الگو و دوخت",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ص%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eالگو و دوخت%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eنمونه‌کارهای مزونی%3C/text%3E%3C/svg%3E",
                  "caption": "نمونه‌کارهای مزونی",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 913,
                  "scope": "public",
                  "owner_username": "hamed_alavi",
                  "owner_name": "مهندس حامد علوی",
                  "title": "کلاس کامپیوتر",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eح‌ع%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلاس کامپیوتر%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۳۱٪ تخفیف ثبت‌نام ترم جدید%3C/text%3E%3C/svg%3E",
                  "caption": "۳۱٪ تخفیف ثبت‌نام ترم جدید",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 914,
                  "scope": "personal",
                  "owner_username": "hamed_alavi",
                  "owner_name": "مهندس حامد علوی",
                  "title": "آکادمی فردا",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eح‌ع%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eآکادمی فردا%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eخدمات لپ‌تاپ و شبکه%3C/text%3E%3C/svg%3E",
                  "caption": "خدمات لپ‌تاپ و شبکه",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 915,
                  "scope": "public",
                  "owner_username": "akbar_noori",
                  "owner_name": "حاج اکبر نوری",
                  "title": "کلوچه داغ",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eا‌ن%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه داغ%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت عصرانه با ۲۴٪ تخفیف%3C/text%3E%3C/svg%3E",
                  "caption": "پخت عصرانه با ۲۴٪ تخفیف",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 916,
                  "scope": "personal",
                  "owner_username": "akbar_noori",
                  "owner_name": "حاج اکبر نوری",
                  "title": "شیرینی برکت",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eا‌ن%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eشیرینی برکت%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eسفارش حلوا و شیرینی مجالس%3C/text%3E%3C/svg%3E",
                  "caption": "سفارش حلوا و شیرینی مجالس",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 917,
                  "scope": "public",
                  "owner_username": "javad_mohammadi",
                  "owner_name": "جواد محمدی",
                  "title": "فایل‌های فوری",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eج‌م%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفایل‌های فوری%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eرهن و خرید آپارتمان در شمال شرق%3C/text%3E%3C/svg%3E",
                  "caption": "رهن و خرید آپارتمان در شمال شرق",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 918,
                  "scope": "personal",
                  "owner_username": "javad_mohammadi",
                  "owner_name": "جواد محمدی",
                  "title": "املاک امین",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eج‌م%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eاملاک امین%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eتنظیم رایگان عقدنامه زوج‌ها%3C/text%3E%3C/svg%3E",
                  "caption": "تنظیم رایگان عقدنامه زوج‌ها",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 919,
                  "scope": "public",
                  "owner_username": "fatemeh_kazemi",
                  "owner_name": "فاطمه کاظمی",
                  "title": "مبل تولیدی",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eف‌ک%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمبل تولیدی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ زیر قیمت نمایشگاه%3C/text%3E%3C/svg%3E",
                  "caption": "۲۰٪ زیر قیمت نمایشگاه",
                  "created_at": "امروز",
                  "seen": false
            },
            {
                  "id": 920,
                  "scope": "personal",
                  "owner_username": "fatemeh_kazemi",
                  "owner_name": "فاطمه کاظمی",
                  "title": "کارگاه ابرار",
                  "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eف‌ک%3C/text%3E%3C/svg%3E",
                  "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه ابرار%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eضمانت ۲۴ ماهه کلاف و فوم%3C/text%3E%3C/svg%3E",
                  "caption": "ضمانت ۲۴ ماهه کلاف و فوم",
                  "created_at": "امروز",
                  "seen": false
            }
      ],
      "communityPosts": [
            {
                  "id": 4001,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "mahmoud_rezvani",
                  "author_name": "حاج محمود رضوانی",
                  "author_role": "غرفه ارگانیک رضوان",
                  "title": "عرضه مستقیم محصولات ارگانیک در شمال شرق ۶",
                  "caption": "همسایگان گرامی، بار جدید عسل طبیعی کوهستان و زعفران قائنات با تخفیف ویژه در غرفه رضوان آماده عرضه است.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 18,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4002,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "mahmoud_rezvani",
                  "author_name": "حاج محمود رضوانی",
                  "author_role": "غرفه ارگانیک رضوان",
                  "title": "روایت صوتی: خواص عسل طبیعی و تشخیص عسل خالص",
                  "caption": "در این فایل صوتی کوتاه نکات مهم تشخیص عسل طبیعی از تغذیه‌ای را برای همسایگان توضیح داده‌ام.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 18,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4003,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "mahmoud_rezvani",
                  "author_name": "حاج محمود رضوانی",
                  "author_role": "غرفه ارگانیک رضوان",
                  "title": "برداشت زعفران تازه امسالی",
                  "caption": "زعفران سرگل ممتاز قائنات آماده تحویل در غرفه ارگانیک رضوان.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eبرداشت زعفران تازه امسالی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 29,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4004,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "mahmoud_rezvani",
                  "author_name": "حاج محمود رضوانی",
                  "author_role": "غرفه ارگانیک رضوان",
                  "title": "ریلز: بسته‌بندی بهداشتی عسل و خشکبار",
                  "caption": "مراحل بسته‌بندی عسل چهل‌گیاه و خشکبار تازه در غرفه محله.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بسته‌بندی بهداشتی عسل%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 29,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4005,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "saeed_karimi",
                  "author_name": "مهندس سعید کریمی",
                  "author_role": "خدمات فنی و تاسیسات کریمی",
                  "title": "نکات ایمنی دودکش و پکیج در فصل سرما",
                  "caption": "لطفاً پیش از روشن کردن بخاری و پکیج، از باز بودن مسیر دودکش و سلامت سنسور حرارتی اطمینان حاصل کنید.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 21,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4006,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "saeed_karimi",
                  "author_name": "مهندس سعید کریمی",
                  "author_role": "خدمات فنی و تاسیسات کریمی",
                  "title": "راهنمای صوتی تنظیم فشار بار پکیج دیواری",
                  "caption": "روش تنظیم فشار آب پکیج روی ۱.۵ بار بدون نیاز به تعمیرکار.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 21,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4007,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "saeed_karimi",
                  "author_name": "مهندس سعید کریمی",
                  "author_role": "خدمات فنی و تاسیسات کریمی",
                  "title": "سرویس تخصصی پکیج در شمال شرق ۱۴",
                  "caption": "اسیدشویی و رسوب‌گیری کامل مبدل حرارتی با دستگاه تمام‌اتوماتیک.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس تخصصی پکیج در شمال شرق ۱۴%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 33,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4008,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "saeed_karimi",
                  "author_name": "مهندس سعید کریمی",
                  "author_role": "خدمات فنی و تاسیسات کریمی",
                  "title": "ریلز: آموزش هواگیری رادیاتور در ۲ دقیقه",
                  "caption": "با این روش ساده راندمان گرمایش شوفاژ منزل خود را دو برابر کنید.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: آموزش هواگیری رادیاتور%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 33,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4009,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "zahra_ahmadi",
                  "author_name": "زهرا احمدی",
                  "author_role": "محصولات خانگی کوثر",
                  "title": "آماده شدن سفارش‌های سبزی سرخ‌شده امروز",
                  "caption": "سفارش‌های سبزی قرمه و کوکو امروز صبح آماده تحویل حضوری یا ارسال با پیک محلی است.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 24,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4010,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "zahra_ahmadi",
                  "author_name": "زهرا احمدی",
                  "author_role": "محصولات خانگی کوثر",
                  "title": "فوت‌وفن خوش‌عطر شدن قرمه‌سبزی مجلسی",
                  "caption": "نسبت دقیق تره، جعفری، گشنیز و شنبلیله برای سبزی قرمه اصیل.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 24,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4011,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "zahra_ahmadi",
                  "author_name": "زهرا احمدی",
                  "author_role": "محصولات خانگی کوثر",
                  "title": "ترشی مخلوط و سیرترشی هفت‌ساله خانگی",
                  "caption": "تهیه‌شده با سرکه طبیعی انگور و سبزیجات تازه.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشی مخلوط و سیرترشی هفت‌سال%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 37,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4012,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "zahra_ahmadi",
                  "author_name": "زهرا احمدی",
                  "author_role": "محصولات خانگی کوثر",
                  "title": "ریلز: شست‌وشو و خرد کردن مکانیزه سبزیجات",
                  "caption": "رعایت کامل بهداشت در تمامی مراحل آماده‌سازی محصولات خانگی کوثر.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: شست‌وشو و خرد کردن مکا%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 37,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4013,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "ali_rahimi",
                  "author_name": "استاد علی رحیمی",
                  "author_role": "فرش دستباف و صنایع دستی طوس",
                  "title": "شروع دوره جدید آموزش قالیبافی و تابلوفرش",
                  "caption": "علاقه‌مندان به یادگیری هنر اصیل قالیبافی می‌توانند در کارگاه طوس ثبت‌نام کرده و پس از آموزش، دار قالی خانگی دریافت کنند.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 27,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4014,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "ali_rahimi",
                  "author_name": "استاد علی رحیمی",
                  "author_role": "فرش دستباف و صنایع دستی طوس",
                  "title": "روایت صوتی: تاریخچه فرش دستباف خراسان",
                  "caption": "گفتگوی شنیدنی درباره نقشه‌ها و رنگ‌های گیاهی اصیل فرش مشهد.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 27,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4015,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "ali_rahimi",
                  "author_name": "استاد علی رحیمی",
                  "author_role": "فرش دستباف و صنایع دستی طوس",
                  "title": "نقشه جدید فرش ۶ متری گل‌فرنگ",
                  "caption": "بافته‌شده توسط استادکاران ماهر کارگاه طوس در شمال شرق ۲۴.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eنقشه جدید فرش ۶ متری گل‌فرنگ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 41,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4016,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "ali_rahimi",
                  "author_name": "استاد علی رحیمی",
                  "author_role": "فرش دستباف و صنایع دستی طوس",
                  "title": "ریلز: مراحل پرداخت و شور نهایی تابلوفرش ابریشم",
                  "caption": "درخشش ابریشم طبیعی پس از تکمیل بافت و پرداخت.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل پرداخت و شور نها%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 41,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4017,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "mohammad_hosseini",
                  "author_name": "محمدرضا حسینی",
                  "author_role": "لبنیات سنتی بهار",
                  "title": "توزیع شیر گرم و سرشیر تازه از ساعت ۶:۳۰ صبح",
                  "caption": "بار جدید شیر و سرشیر سنتی هر روز صبح در لبنیات بهار آماده ارائه به همسایگان است.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 30,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4018,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "mohammad_hosseini",
                  "author_name": "محمدرضا حسینی",
                  "author_role": "لبنیات سنتی بهار",
                  "title": "روایت صوتی: فواید مصرف لبنیات پروبیوتیک سنتی",
                  "caption": "تفاوت ماست و پنیر سنتی تخمیر طبیعی با محصولات صنعتی.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 30,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4019,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "mohammad_hosseini",
                  "author_name": "محمدرضا حسینی",
                  "author_role": "لبنیات سنتی بهار",
                  "title": "پنیر گوسفندی لیقوان و کره محلی خالص",
                  "caption": "تازه و معطر برای سفره صبحانه خانواده‌های محله.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپنیر گوسفندی لیقوان و کره مح%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 45,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4020,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "mohammad_hosseini",
                  "author_name": "محمدرضا حسینی",
                  "author_role": "لبنیات سنتی بهار",
                  "title": "ریلز: تهیه سرشیر سنتی و ماست چکیده",
                  "caption": "کیفیت و تازگی روزانه در لبنیات سنتی بهار شمال شرق ۸.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: تهیه سرشیر سنتی و ماست%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 45,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4021,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "maryam_sadeghi",
                  "author_name": "مریم صادقی",
                  "author_role": "تولیدی پوشاک و خیاطی نور",
                  "title": "پذیرش سفارش دوخت چادر و مانتو با تحویل ۴۸ ساعته",
                  "caption": "در کارگاه خیاطی نور، سفارش‌های دوخت بر اساس سایز دقیق شما در کوتاه‌ترین زمان آماده می‌شود.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 33,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4022,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "maryam_sadeghi",
                  "author_name": "مریم صادقی",
                  "author_role": "تولیدی پوشاک و خیاطی نور",
                  "title": "راهنمای صوتی انتخاب پارچه مناسب چادر مشکی",
                  "caption": "مقایسه پارچه کرپ نخ، ندا و کنزو از نظر سبکی و مقاومت.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 33,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4023,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "maryam_sadeghi",
                  "author_name": "مریم صادقی",
                  "author_role": "تولیدی پوشاک و خیاطی نور",
                  "title": "مدل‌های جدید چادر حسنا و مانتو عبایی",
                  "caption": "عرضه مستقیم از کارگاه تولیدی نور در شمال شرق ۱۷.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل‌های جدید چادر حسنا و مان%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 49,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4024,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "maryam_sadeghi",
                  "author_name": "مریم صادقی",
                  "author_role": "تولیدی پوشاک و خیاطی نور",
                  "title": "ریلز: برش لیزری و دوخت تمیز در کارگاه نور",
                  "caption": "تضمین کیفیت دوخت و پارچه با قیمت تولیدی.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: برش لیزری و دوخت تمیز%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 49,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4025,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "hamed_alavi",
                  "author_name": "مهندس حامد علوی",
                  "author_role": "آکادمی مهارت و دیجیتال فردا",
                  "title": "جلسه مشاوره رایگان مهارت‌های دیجیتال و هوش مصنوعی",
                  "caption": "پنج‌شنبه‌ها در آکادمی فردا میزبان نوجوانان و علاقه‌مندان به حوزه برنامه‌نویسی و تولید محتوا هستیم.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 36,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4026,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "hamed_alavi",
                  "author_name": "مهندس حامد علوی",
                  "author_role": "آکادمی مهارت و دیجیتال فردا",
                  "title": "پادکست کوتاه: چطور با موبایل کسب‌وکار اینترنتی راه بیندازیم؟",
                  "caption": "سه گام کلیدی برای عکاسی، معرفی محصول و فروش آنلاین.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 36,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4027,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "hamed_alavi",
                  "author_name": "مهندس حامد علوی",
                  "author_role": "آکادمی مهارت و دیجیتال فردا",
                  "title": "کارگاه عملی برنامه‌نویسی نوجوانان",
                  "caption": "آموزش پروژه‌محور مهارت‌های کامپیوتر در شمال شرق ۳۴.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه عملی برنامه‌نویسی نوج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 53,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4028,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "hamed_alavi",
                  "author_name": "مهندس حامد علوی",
                  "author_role": "آکادمی مهارت و دیجیتال فردا",
                  "title": "ریلز: ارتقای سرعت لپ‌تاپ با نصب حافظه SSD",
                  "caption": "افزایش ۵ برابری سرعت ویندوز در کمتر از ۳۰ دقیقه.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: ارتقای سرعت لپ‌تاپ با%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 53,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4029,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "akbar_noori",
                  "author_name": "حاج اکبر نوری",
                  "author_role": "نان و شیرینی خانگی برکت",
                  "title": "کلوچه زنجبیلی داغ عصرانه از تنور خارج شد",
                  "caption": "همسایگان عزیز، پخت نوبت عصر کلوچه زنجبیلی و قطاب گردویی آماده عرضه در شیرینی برکت است.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 39,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4030,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "akbar_noori",
                  "author_name": "حاج اکبر نوری",
                  "author_role": "نان و شیرینی خانگی برکت",
                  "title": "روایت صوتی: خواص زنجبیل و آرد کامل در تغذیه کودکان",
                  "caption": "چرا شیرینی‌های سنتی خانگی بهترین جایگزین تنقلات صنعتی برای دانش‌آموزان هستند؟",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 39,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4031,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "akbar_noori",
                  "author_name": "حاج اکبر نوری",
                  "author_role": "نان و شیرینی خانگی برکت",
                  "title": "کلوچه زنجبیلی و قطاب تازه قنادی برکت",
                  "caption": "پخت سنتی و خانگی بدون اسانس مصنوعی در شمال شرق ۲۸.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی و قطاب تازه قن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 57,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4032,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "akbar_noori",
                  "author_name": "حاج اکبر نوری",
                  "author_role": "نان و شیرینی خانگی برکت",
                  "title": "ریلز: پخت سنتی کلوچه زنجبیلی در تنور داغ",
                  "caption": "عطر هل و زنجبیل تازه در کارگاه نان و شیرینی برکت.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: پخت سنتی کلوچه زنجبیلی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 57,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4033,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "javad_mohammadi",
                  "author_name": "جواد محمدی",
                  "author_role": "املاک و خودرو امین شمال شرق",
                  "title": "تنظیم رایگان مبایعه‌نامه و قرارداد اجاره برای زوج‌های جوان",
                  "caption": "در دفتر املاک امین، قرارداد رهن و اجاره برای عروس و دامادهای محله بدون دریافت کمیسیون تنظیم می‌گردد.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 42,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4034,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "javad_mohammadi",
                  "author_name": "جواد محمدی",
                  "author_role": "املاک و خودرو امین شمال شرق",
                  "title": "نکات حقوقی مهم پیش از امضای قولنامه مسکن و خودرو",
                  "caption": "بررسی اصالت مدارک، کد رهگیری و نحوه پرداخت امن ثمن معامله.",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 42,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4035,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "javad_mohammadi",
                  "author_name": "جواد محمدی",
                  "author_role": "املاک و خودرو امین شمال شرق",
                  "title": "واحد ۸۵ متری کلیدنخورده در شمال شرق ۳۸",
                  "caption": "نورگیر عالی و دسترسی ۲ دقیقه‌ای به ایستگاه مترو.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eواحد ۸۵ متری کلیدنخورده در ط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 61,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4036,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "javad_mohammadi",
                  "author_name": "جواد محمدی",
                  "author_role": "املاک و خودرو امین شمال شرق",
                  "title": "ریلز: بازدید ویدیویی از آپارتمان نوساز شمال شرق",
                  "caption": "مشاهده کامل پذیرایی، آشپزخانه و مشاعات ساختمان.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بازدید ویدیویی از آپار%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 61,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4037,
                  "app_target": "ahdino",
                  "media_type": "text",
                  "author_username": "fatemeh_kazemi",
                  "author_name": "فاطمه کاظمی",
                  "author_role": "صنایع چوب و مبلمان ابرار",
                  "title": "فروش مستقیم مبلمان از کارگاه تولیدی با ۲۰٪ تخفیف",
                  "caption": "با حذف واسطه‌ها، سرویس کامل مبل راحتی و میز جلومبلی را مستقیم از کارگاه ابرار با ضمانت کتبی تهیه کنید.",
                  "media_url": "",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 45,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4038,
                  "app_target": "ahdino",
                  "media_type": "audio",
                  "author_username": "fatemeh_kazemi",
                  "author_name": "فاطمه کاظمی",
                  "author_role": "صنایع چوب و مبلمان ابرار",
                  "title": "روایت صوتی: راهنمای تشخیص فوم سرد از اسفنج معمولی در مبلمان",
                  "caption": "چگونه هنگام خرید مبل از دوام کلاف چوبی و فوم آن مطمئن شویم؟",
                  "media_url": "synthesized_voice_1",
                  "published_networks": [
                        "bale",
                        "eitaa"
                  ],
                  "likes_count": 45,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4039,
                  "app_target": "ahdaneh",
                  "media_type": "image",
                  "author_username": "fatemeh_kazemi",
                  "author_name": "فاطمه کاظمی",
                  "author_role": "صنایع چوب و مبلمان ابرار",
                  "title": "مدل جدید مبل راحتی مینیمال پارچه تدی و نانو",
                  "caption": "رنگ‌بندی متنوع به انتخاب مشتری در تولیدی مبلمان ابرار.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل جدید مبل راحتی مینیمال پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 65,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            },
            {
                  "id": 4040,
                  "app_target": "ahdaneh",
                  "media_type": "video",
                  "author_username": "fatemeh_kazemi",
                  "author_name": "فاطمه کاظمی",
                  "author_role": "صنایع چوب و مبلمان ابرار",
                  "title": "ریلز: مراحل کلاف‌سازی چوب روس و رویه‌کوبی مبل",
                  "caption": "کیفیت و استحکام واقعی در کارگاه صنایع چوب ابرار شمال شرق ۴۸.",
                  "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل کلاف‌سازی چوب رو%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
                  "published_networks": [
                        "rubika",
                        "bale"
                  ],
                  "likes_count": 65,
                  "liked_by": [],
                  "comments": [],
                  "created_at": "امروز"
            }
      ],
      "followsData": [
            {
                  "follower": "mahmoud_rezvani",
                  "following": "saeed_karimi"
            },
            {
                  "follower": "mahmoud_rezvani",
                  "following": "zahra_ahmadi"
            },
            {
                  "follower": "mahmoud_rezvani",
                  "following": "ali_rahimi"
            },
            {
                  "follower": "saeed_karimi",
                  "following": "zahra_ahmadi"
            },
            {
                  "follower": "saeed_karimi",
                  "following": "ali_rahimi"
            },
            {
                  "follower": "saeed_karimi",
                  "following": "mohammad_hosseini"
            },
            {
                  "follower": "zahra_ahmadi",
                  "following": "ali_rahimi"
            },
            {
                  "follower": "zahra_ahmadi",
                  "following": "mohammad_hosseini"
            },
            {
                  "follower": "zahra_ahmadi",
                  "following": "maryam_sadeghi"
            },
            {
                  "follower": "ali_rahimi",
                  "following": "mohammad_hosseini"
            },
            {
                  "follower": "ali_rahimi",
                  "following": "maryam_sadeghi"
            },
            {
                  "follower": "ali_rahimi",
                  "following": "hamed_alavi"
            },
            {
                  "follower": "mohammad_hosseini",
                  "following": "maryam_sadeghi"
            },
            {
                  "follower": "mohammad_hosseini",
                  "following": "hamed_alavi"
            },
            {
                  "follower": "mohammad_hosseini",
                  "following": "akbar_noori"
            },
            {
                  "follower": "maryam_sadeghi",
                  "following": "hamed_alavi"
            },
            {
                  "follower": "maryam_sadeghi",
                  "following": "akbar_noori"
            },
            {
                  "follower": "maryam_sadeghi",
                  "following": "javad_mohammadi"
            },
            {
                  "follower": "hamed_alavi",
                  "following": "akbar_noori"
            },
            {
                  "follower": "hamed_alavi",
                  "following": "javad_mohammadi"
            },
            {
                  "follower": "hamed_alavi",
                  "following": "fatemeh_kazemi"
            },
            {
                  "follower": "akbar_noori",
                  "following": "javad_mohammadi"
            },
            {
                  "follower": "akbar_noori",
                  "following": "fatemeh_kazemi"
            },
            {
                  "follower": "akbar_noori",
                  "following": "mahmoud_rezvani"
            },
            {
                  "follower": "javad_mohammadi",
                  "following": "fatemeh_kazemi"
            },
            {
                  "follower": "javad_mohammadi",
                  "following": "mahmoud_rezvani"
            },
            {
                  "follower": "javad_mohammadi",
                  "following": "saeed_karimi"
            },
            {
                  "follower": "fatemeh_kazemi",
                  "following": "mahmoud_rezvani"
            },
            {
                  "follower": "fatemeh_kazemi",
                  "following": "saeed_karimi"
            },
            {
                  "follower": "fatemeh_kazemi",
                  "following": "zahra_ahmadi"
            }
      ],
      "registeredBotChannels": [],
      "marketCategoryFilter": "all",
      "marketAlleyFilter": "all",
      "marketOnlyAmazing": false,
      "marketOnlyUrgent": false,
      "marketSearchQuery": "",
      "marketMinPrice": 0,
      "marketMaxPrice": 0,
      "marketSortBy": "newest",
      "adWizardStep": 1,
      "messagesActiveTab": "chats",
      "marketSubcategoryFilter": "all",
      "categoriesMegaMenuOpen": false,
      "activeMegaMenuCatId": "jobs",
      "spiritualMethod": "salawat",
      "spiritualSalawatCount": 14,
      "spiritualFarajCount": 14,
      "spiritualSelectedQuranPages": [],
      "spiritualQuranJuzFilter": 0,
      "spiritualPledgeConfirmed": false,
      "spiritualStats": {
            "total_salawat": 1420,
            "total_faraj": 1313,
            "completed_khatms": 1,
            "locked_pages": {
                  "1": "حاج محمود رضوانی",
                  "2": "مهندس سعید کریمی",
                  "3": "زهرا احمدی",
                  "4": "استاد علی رحیمی",
                  "5": "محمدرضا حسینی",
                  "6": "مریم صادقی",
                  "7": "مهندس حامد علوی",
                  "8": "حاج اکبر نوری",
                  "9": "جواد محمدی",
                  "10": "فاطمه کاظمی"
            }
      },
      "users": {
            "mahmoud_rezvani": {
                  "username": "mahmoud_rezvani",
                  "first_name": "محمود",
                  "last_name": "رضوانی",
                  "display_name": "حاج محمود رضوانی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۶، پلاک ۱۴",
                  "phone": "09151110001",
                  "email": "",
                  "alley": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰)",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "غرفه ارگانیک رضوان",
                  "booth_bio": "عرضه مستقیم عسل طبیعی کوهستان، زعفران قائنات و خشکبار ارگانیک",
                  "profile_note": "یا الرضا (ع)",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ر%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "غرفه ارگانیک رضوان"
            },
            "saeed_karimi": {
                  "username": "saeed_karimi",
                  "first_name": "سعید",
                  "last_name": "کریمی",
                  "display_name": "مهندس سعید کریمی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۱۴، پلاک ۲۲",
                  "phone": "09151110002",
                  "email": "",
                  "alley": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "خدمات فنی و تاسیسات کریمی",
                  "booth_bio": "تعمیر و سرویس تخصصی پکیج، آبگرمکن و کولر در منزل شما",
                  "profile_note": "اعزام فوری 🔧",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eس‌ک%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "خدمات فنی و تاسیسات کریمی"
            },
            "zahra_ahmadi": {
                  "username": "zahra_ahmadi",
                  "first_name": "زهرا",
                  "last_name": "احمدی",
                  "display_name": "زهرا احمدی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۱۲، کوچه ۴",
                  "phone": "09151110003",
                  "email": "",
                  "alley": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "محصولات خانگی کوثر",
                  "booth_bio": "تهیه روزانه سبزی قرمه سرخ‌شده، رب خانگی و ترشیجات بهداشتی",
                  "profile_note": "پخت روزانه 🌿",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eز‌ا%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "محصولات خانگی کوثر"
            },
            "ali_rahimi": {
                  "username": "ali_rahimi",
                  "first_name": "علی",
                  "last_name": "رحیمی",
                  "display_name": "استاد علی رحیمی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۲۴، جنب مسجد جامع",
                  "phone": "09151110004",
                  "email": "",
                  "alley": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "فرش دستباف و صنایع دستی طوس",
                  "booth_bio": "تولید و عرضه مستقیم فرش دستباف، تابلوفرش ابریشم و گلیم با شرایط اقساطی",
                  "profile_note": "هنر ایرانی 🧶",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eع‌ر%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "فرش دستباف و صنایع دستی طوس"
            },
            "mohammad_hosseini": {
                  "username": "mohammad_hosseini",
                  "first_name": "محمدرضا",
                  "last_name": "حسینی",
                  "display_name": "محمدرضا حسینی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۸، پلاک ۵",
                  "phone": "09151110005",
                  "email": "",
                  "alley": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰)",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "لبنیات سنتی بهار",
                  "booth_bio": "عرضه روزانه شیر تازه، سرشیر، کره محلی و پنیر لیقوان اعلا",
                  "profile_note": "لبنیات تازه 🥛",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ح%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "لبنیات سنتی بهار"
            },
            "maryam_sadeghi": {
                  "username": "maryam_sadeghi",
                  "first_name": "مریم",
                  "last_name": "صادقی",
                  "display_name": "مریم صادقی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۱۷، پلاک ۱۱",
                  "phone": "09151110006",
                  "email": "",
                  "alley": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "تولیدی پوشاک و خیاطی نور",
                  "booth_bio": "دوخت و عرضه مستقیم چادر مشکی، مانتو عبایی و لباس فرم به قیمت تولیدی",
                  "profile_note": "دوخت سفارشی 👗",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ص%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "تولیدی پوشاک و خیاطی نور"
            },
            "hamed_alavi": {
                  "username": "hamed_alavi",
                  "first_name": "حامد",
                  "last_name": "علوی",
                  "display_name": "مهندس حامد علوی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۳۴، پلاک ۹",
                  "phone": "09151110007",
                  "email": "",
                  "alley": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "آکادمی مهارت و دیجیتال فردا",
                  "booth_bio": "آموزش کامپیوتر، برنامه‌نویسی و خدمات تخصصی لپ‌تاپ و موبایل",
                  "profile_note": "آموزش و فناوری 💻",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eح‌ع%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "آکادمی مهارت و دیجیتال فردا"
            },
            "akbar_noori": {
                  "username": "akbar_noori",
                  "first_name": "اکبر",
                  "last_name": "نوری",
                  "display_name": "حاج اکبر نوری",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۲۸، نبش دهمرده ۶",
                  "phone": "09151110008",
                  "email": "",
                  "alley": "بلوار دهمرده، جماران و نظام‌دوست",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "نان و شیرینی خانگی برکت",
                  "booth_bio": "پخت روزانه کلوچه زنجبیلی سنتی مشهد، قطاب گردویی و نان قندی",
                  "profile_note": "پخت داغ روزانه 🍪",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eا‌ن%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "نان و شیرینی خانگی برکت"
            },
            "javad_mohammadi": {
                  "username": "javad_mohammadi",
                  "first_name": "جواد",
                  "last_name": "محمدی",
                  "display_name": "جواد محمدی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۳۸، پلاک ۱۰",
                  "phone": "09151110009",
                  "email": "",
                  "alley": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "املاک و خودرو امین شمال شرق",
                  "booth_bio": "مشاوره صادقانه خرید، فروش و رهن مسکن و خودرو در منطقه شمال شرق",
                  "profile_note": "مشاور امین شما 🏠",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eج‌م%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "املاک و خودرو امین شمال شرق"
            },
            "fatemeh_kazemi": {
                  "username": "fatemeh_kazemi",
                  "first_name": "فاطمه",
                  "last_name": "کاظمی",
                  "display_name": "فاطمه کاظمی",
                  "age": 35,
                  "national_code": "",
                  "exact_address": "شمال شرق ۴۸، پلاک ۱۶",
                  "phone": "09151110010",
                  "email": "",
                  "alley": "پنج‌تن، شهرک ابرار و شمال شرق ۴۶ به بالا",
                  "role": "resident",
                  "role_title": "غرفه‌دار تاییدشده",
                  "booth_title": "صنایع چوب و مبلمان ابرار",
                  "booth_bio": "تولید مستقیم مبل راحتی، سرویس چوب و اشتغال‌زایی جوانان محله",
                  "profile_note": "تولید مستقیم 🛋️",
                  "booth_hours": "همه‌روزه ۹ صبح تا ۲۱",
                  "booth_logo": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eف‌ک%3C/text%3E%3C/svg%3E",
                  "booth_status": "approved",
                  "is_suspended": false,
                  "ahdbot_onboarded": true,
                  "media_title": "صنایع چوب و مبلمان ابرار"
            }
      },
      "listings": [
            {
                  "id": 301,
                  "seller_username": "mahmoud_rezvani",
                  "seller_name": "حاج محمود رضوانی",
                  "booth_title": "غرفه ارگانیک رضوان",
                  "seller_phone": "09151110001",
                  "category": "food",
                  "subcategory": "عسل طبیعی، زعفران، ادویه و خشکبار ارگانیک",
                  "title": "عسل طبیعی چهل‌گیاه کوهستان (یک کیلویی)",
                  "description": "عسل ۱۰۰٪ خالص و طبیعی به شرط آزمایشگاه با ارسال رایگان در محله.",
                  "price": 420000,
                  "old_price": 520000,
                  "discount_percent": 19,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "عسل طبیعی، زعفران، ادویه و خشکبار ارگانیک",
                        "غرفه": "غرفه ارگانیک رضوان"
                  },
                  "address_detail": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰) - شمال شرق ۶، پلاک ۱۴",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3Eغرفه ارگانیک رضوان%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eعسل طبیعی چهل‌گیاه کوهستان (%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E420٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794392892,
                  "views_count": 45,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 302,
                  "seller_username": "mahmoud_rezvani",
                  "seller_name": "حاج محمود رضوانی",
                  "booth_title": "غرفه ارگانیک رضوان",
                  "seller_phone": "09151110001",
                  "category": "food",
                  "subcategory": "عسل طبیعی، زعفران، ادویه و خشکبار ارگانیک",
                  "title": "زعفران سرگل امسالی قائنات (یک مثقالی)",
                  "description": "زعفران درجه یک و خوش‌عطر امسالی مستقیم از کشاورز.",
                  "price": 385000,
                  "old_price": 450000,
                  "discount_percent": 14,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "عسل طبیعی، زعفران، ادویه و خشکبار ارگانیک",
                        "غرفه": "غرفه ارگانیک رضوان"
                  },
                  "address_detail": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰) - شمال شرق ۶، پلاک ۱۴",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3Eغرفه ارگانیک رضوان%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eزعفران سرگل امسالی قائنات (ی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E385٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 45,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 303,
                  "seller_username": "saeed_karimi",
                  "seller_name": "مهندس سعید کریمی",
                  "booth_title": "خدمات فنی و تاسیسات کریمی",
                  "seller_phone": "09151110002",
                  "category": "services",
                  "subcategory": "تاسیسات، لوله‌کشی، برق‌کاری و تعمیرات پکیج",
                  "title": "سرویس کامل و رسوب‌گیری پکیج و آبگرمکن در محل",
                  "description": "تعمیر تخصصی برد و مبدل پکیج ایران‌رادیاتور و بوتان بدون هزینه ایاب‌وذهاب.",
                  "price": 250000,
                  "old_price": 350000,
                  "discount_percent": 29,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "تاسیسات، لوله‌کشی، برق‌کاری و تعمیرات پکیج",
                        "غرفه": "خدمات فنی و تاسیسات کریمی"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۴، پلاک ۲۲",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3Eخدمات فنی و تاسیسات کریمی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس کامل و رسوب‌گیری پکیج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E250٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "approved",
                  "laddered_at": 1794392592,
                  "views_count": 52,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 304,
                  "seller_username": "saeed_karimi",
                  "seller_name": "مهندس سعید کریمی",
                  "booth_title": "خدمات فنی و تاسیسات کریمی",
                  "seller_phone": "09151110002",
                  "category": "home",
                  "subcategory": "یخچال، لباسشویی، اجاق گاز و لوازم برقی",
                  "title": "یخچال فریزر دوقلو پارس بدون برفک در حد نو",
                  "description": "موتور دانفوس اصلی، کاملاً سالم و بدون تعمیر.",
                  "price": 14200000,
                  "old_price": 16000000,
                  "discount_percent": 11,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "یخچال، لباسشویی، اجاق گاز و لوازم برقی",
                        "غرفه": "خدمات فنی و تاسیسات کریمی"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۴، پلاک ۲۲",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3Eخدمات فنی و تاسیسات کریمی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eیخچال فریزر دوقلو پارس بدون%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E14٬200٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 52,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 305,
                  "seller_username": "zahra_ahmadi",
                  "seller_name": "زهرا احمدی",
                  "booth_title": "محصولات خانگی کوثر",
                  "seller_phone": "09151110003",
                  "category": "food",
                  "subcategory": "سبزیجات آماده، رب گوجه‌فرنگی، ترشیجات و شور خانگی",
                  "title": "سبزی قرمه‌سبزی و آش سرخ‌شده خانگی (یک کیلویی)",
                  "description": "شست‌وشو و سرخ‌شده با سبزیجات معطر تازه در محیط کاملاً بهداشتی.",
                  "price": 115000,
                  "old_price": 140000,
                  "discount_percent": 18,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "سبزیجات آماده، رب گوجه‌فرنگی، ترشیجات و شور خانگی",
                        "غرفه": "محصولات خانگی کوثر"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۲، کوچه ۴",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3Eمحصولات خانگی کوثر%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسبزی قرمه‌سبزی و آش سرخ‌شده%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E115٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794392292,
                  "views_count": 59,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 306,
                  "seller_username": "zahra_ahmadi",
                  "seller_name": "زهرا احمدی",
                  "booth_title": "محصولات خانگی کوثر",
                  "seller_phone": "09151110003",
                  "category": "food",
                  "subcategory": "سبزیجات آماده، رب گوجه‌فرنگی، ترشیجات و شور خانگی",
                  "title": "رب گوجه‌فرنگی غلیظ خانگی بدون مواد نگهدارنده",
                  "description": "پخت امسالی، خوش‌رنگ و غلیظ در ظرف‌های ۱.۵ کیلویی.",
                  "price": 135000,
                  "old_price": 160000,
                  "discount_percent": 16,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "سبزیجات آماده، رب گوجه‌فرنگی، ترشیجات و شور خانگی",
                        "غرفه": "محصولات خانگی کوثر"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۲، کوچه ۴",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3Eمحصولات خانگی کوثر%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eرب گوجه‌فرنگی غلیظ خانگی بدو%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E135٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 59,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 307,
                  "seller_username": "ali_rahimi",
                  "seller_name": "استاد علی رحیمی",
                  "booth_title": "فرش دستباف و صنایع دستی طوس",
                  "seller_phone": "09151110004",
                  "category": "home",
                  "subcategory": "فرش، گلیم، تابلوفرش، موکت و پرده",
                  "title": "فرش دستباف ۶ متری نقشه ماهی تبریز (اقساط ۴ ماهه)",
                  "description": "بافت کارگاه شمال شرق با پشم مرینوس و ابریشم طبیعی بدون بهره.",
                  "price": 18500000,
                  "old_price": 21000000,
                  "discount_percent": 12,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "فرش، گلیم، تابلوفرش، موکت و پرده",
                        "غرفه": "فرش دستباف و صنایع دستی طوس"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۲۴، جنب مسجد جامع",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3Eفرش دستباف و صنایع دستی طوس%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفرش دستباف ۶ متری نقشه ماهی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E18٬500٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794391992,
                  "views_count": 66,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 308,
                  "seller_username": "ali_rahimi",
                  "seller_name": "استاد علی رحیمی",
                  "booth_title": "فرش دستباف و صنایع دستی طوس",
                  "seller_phone": "09151110004",
                  "category": "home",
                  "subcategory": "فرش، گلیم، تابلوفرش، موکت و پرده",
                  "title": "تابلوفرش دستباف چله ابریشم وان‌یکاد با قاب چوب گردو",
                  "description": "بافت ظریف ۵۰ رج تبریز، هدیه‌ای ماندگار برای منازل نوپیمانان.",
                  "price": 4900000,
                  "old_price": 5800000,
                  "discount_percent": 15,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "فرش، گلیم، تابلوفرش، موکت و پرده",
                        "غرفه": "فرش دستباف و صنایع دستی طوس"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۲۴، جنب مسجد جامع",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3Eفرش دستباف و صنایع دستی طوس%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eتابلوفرش دستباف چله ابریشم و%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E4٬900٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 66,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 309,
                  "seller_username": "mohammad_hosseini",
                  "seller_name": "محمدرضا حسینی",
                  "booth_title": "لبنیات سنتی بهار",
                  "seller_phone": "09151110005",
                  "category": "food",
                  "subcategory": "لبنیات سنتی، کره، پنیر و سرشیر محلی",
                  "title": "پکیج صبحانه محلی (پنیر لیقوان + کره گاوی + سرشیر)",
                  "description": "بسته یک کیلویی صبحانه تازه امروز با ارسال رایگان در محدوده شمال شرق.",
                  "price": 195000,
                  "old_price": 240000,
                  "discount_percent": 19,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "لبنیات سنتی، کره، پنیر و سرشیر محلی",
                        "غرفه": "لبنیات سنتی بهار"
                  },
                  "address_detail": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰) - شمال شرق ۸، پلاک ۵",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3Eلبنیات سنتی بهار%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپکیج صبحانه محلی (پنیر لیقوا%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E195٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794391692,
                  "views_count": 73,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 310,
                  "seller_username": "mohammad_hosseini",
                  "seller_name": "محمدرضا حسینی",
                  "booth_title": "لبنیات سنتی بهار",
                  "seller_phone": "09151110005",
                  "category": "food",
                  "subcategory": "لبنیات سنتی، کره، پنیر و سرشیر محلی",
                  "title": "ماست چکیده موسیر و دوغ محلی بدون گاز (۳ کیلویی)",
                  "description": "تهیه‌شده از شیر خالص گاوداری بدون نشاسته یا افزودنی.",
                  "price": 120000,
                  "old_price": 145000,
                  "discount_percent": 17,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "لبنیات سنتی، کره، پنیر و سرشیر محلی",
                        "غرفه": "لبنیات سنتی بهار"
                  },
                  "address_detail": "ابتدای شمال شرق (شمال شرق ۱ تا ۱۰) - شمال شرق ۸، پلاک ۵",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3Eلبنیات سنتی بهار%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eماست چکیده موسیر و دوغ محلی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E120٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 73,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 311,
                  "seller_username": "maryam_sadeghi",
                  "seller_name": "مریم صادقی",
                  "booth_title": "تولیدی پوشاک و خیاطی نور",
                  "seller_phone": "09151110006",
                  "category": "personal",
                  "subcategory": "کیف، کفش، مانتو، چادر و پوشاک بانوان",
                  "title": "مانتو عبایی و چادر مشکی کرپ اندونزی (دوخت کارگاه)",
                  "description": "پارچه کرپ درجه یک بدون پرزدهی و چروک با دوخت تمیز مزونی.",
                  "price": 480000,
                  "old_price": 600000,
                  "discount_percent": 20,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "کیف، کفش، مانتو، چادر و پوشاک بانوان",
                        "غرفه": "تولیدی پوشاک و خیاطی نور"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۷، پلاک ۱۱",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3Eتولیدی پوشاک و خیاطی نور%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمانتو عبایی و چادر مشکی کرپ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E480٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "approved",
                  "laddered_at": 1794391392,
                  "views_count": 80,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 312,
                  "seller_username": "maryam_sadeghi",
                  "seller_name": "مریم صادقی",
                  "booth_title": "تولیدی پوشاک و خیاطی نور",
                  "seller_phone": "09151110006",
                  "category": "industrial",
                  "subcategory": "ابزارآلات، چرخ خیاطی صنعتی و تجهیزات کارگاهی",
                  "title": "چرخ خیاطی صنعتی راسته جک دینام سرخود کم‌کارکرد",
                  "description": "کاملاً سالم و بی‌صدا، مناسب کارگاه خیاطی خانگی.",
                  "price": 8500000,
                  "old_price": 9800000,
                  "discount_percent": 13,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "ابزارآلات، چرخ خیاطی صنعتی و تجهیزات کارگاهی",
                        "غرفه": "تولیدی پوشاک و خیاطی نور"
                  },
                  "address_detail": "چهارراه مقدم و شمال شرق ۱۱ تا ۲۸ - شمال شرق ۱۷، پلاک ۱۱",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3Eتولیدی پوشاک و خیاطی نور%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eچرخ خیاطی صنعتی راسته جک دین%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E8٬500٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 80,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 313,
                  "seller_username": "hamed_alavi",
                  "seller_name": "مهندس حامد علوی",
                  "booth_title": "آکادمی مهارت و دیجیتال فردا",
                  "seller_phone": "09151110007",
                  "category": "education",
                  "subcategory": "کامپیوتر (ICDL)، برنامه‌نویسی و هوش مصنوعی",
                  "title": "دوره عملی کامپیوتر (ICDL)، پایتون و طراحی وب",
                  "description": "ویژه نوجوانان و جوانان با شهریه نیم‌بها و جلسه اول رایگان.",
                  "price": 380000,
                  "old_price": 550000,
                  "discount_percent": 31,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "کامپیوتر (ICDL)، برنامه‌نویسی و هوش مصنوعی",
                        "غرفه": "آکادمی مهارت و دیجیتال فردا"
                  },
                  "address_detail": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵ - شمال شرق ۳۴، پلاک ۹",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3Eآکادمی مهارت و دیجیتال فردا%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eدوره عملی کامپیوتر (ICDL)، پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E380٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794391092,
                  "views_count": 87,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 314,
                  "seller_username": "hamed_alavi",
                  "seller_name": "مهندس حامد علوی",
                  "booth_title": "آکادمی مهارت و دیجیتال فردا",
                  "seller_phone": "09151110007",
                  "category": "digital",
                  "subcategory": "رایانه رومیزی، لپ‌تاپ و قطعات",
                  "title": "لپ‌تاپ لنوو Core i5 نسل ۱۱ با حافظه SSD 512",
                  "description": "بسیار تمیز با مهلت تست کتبی و کیف و موس رایگان.",
                  "price": 16800000,
                  "old_price": 18500000,
                  "discount_percent": 9,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "رایانه رومیزی، لپ‌تاپ و قطعات",
                        "غرفه": "آکادمی مهارت و دیجیتال فردا"
                  },
                  "address_detail": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵ - شمال شرق ۳۴، پلاک ۹",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3Eآکادمی مهارت و دیجیتال فردا%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eلپ‌تاپ لنوو Core i5 نسل ۱۱ ب%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E16٬800٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 87,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 315,
                  "seller_username": "akbar_noori",
                  "seller_name": "حاج اکبر نوری",
                  "booth_title": "نان و شیرینی خانگی برکت",
                  "seller_phone": "09151110008",
                  "category": "food",
                  "subcategory": "نان، شیرینی، کلوچه زنجبیلی و قطاب خانگی",
                  "title": "کلوچه زنجبیلی سنتی مشهد و قطاب گردویی (یک کیلویی)",
                  "description": "پخت گرم روزانه با آرد سبوس‌دار، زنجبیل تازه و هل خالص.",
                  "price": 95000,
                  "old_price": 125000,
                  "discount_percent": 24,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "نان، شیرینی، کلوچه زنجبیلی و قطاب خانگی",
                        "غرفه": "نان و شیرینی خانگی برکت"
                  },
                  "address_detail": "بلوار دهمرده، جماران و نظام‌دوست - شمال شرق ۲۸، نبش دهمرده ۶",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3Eنان و شیرینی خانگی برکت%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی سنتی مشهد و قط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E95٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794390792,
                  "views_count": 94,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 316,
                  "seller_username": "akbar_noori",
                  "seller_name": "حاج اکبر نوری",
                  "booth_title": "نان و شیرینی خانگی برکت",
                  "seller_phone": "09151110008",
                  "category": "food",
                  "subcategory": "غذای خانگی، حلوا و سفارش مجالس",
                  "title": "حلوا زعفرانی مجلسی و نان قندی سنتی (سفارش مراسم)",
                  "description": "پخت سفارشی با کره محلی و زعفران قائنات.",
                  "price": 160000,
                  "old_price": 190000,
                  "discount_percent": 16,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "غذای خانگی، حلوا و سفارش مجالس",
                        "غرفه": "نان و شیرینی خانگی برکت"
                  },
                  "address_detail": "بلوار دهمرده، جماران و نظام‌دوست - شمال شرق ۲۸، نبش دهمرده ۶",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3Eنان و شیرینی خانگی برکت%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eحلوا زعفرانی مجلسی و نان قند%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E160٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 94,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 317,
                  "seller_username": "javad_mohammadi",
                  "seller_name": "جواد محمدی",
                  "booth_title": "املاک و خودرو امین شمال شرق",
                  "seller_phone": "09151110009",
                  "category": "real_estate",
                  "subcategory": "خرید و فروش مسکونی (آپارتمان و ویلایی)",
                  "title": "آپارتمان ۸۵ متری دوخوابه نوساز نزدیک مترو شمال شرق",
                  "description": "طبقه دوم، آسانسور، پارکینگ اختصاصی و کابینت ام‌دی‌اف درجه یک.",
                  "price": 1850000000,
                  "old_price": 1980000000,
                  "discount_percent": 7,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "خرید و فروش مسکونی (آپارتمان و ویلایی)",
                        "غرفه": "املاک و خودرو امین شمال شرق"
                  },
                  "address_detail": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵ - شمال شرق ۳۸، پلاک ۱۰",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3Eاملاک و خودرو امین شمال شرق%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eآپارتمان ۸۵ متری دوخوابه نوس%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E1٬850٬000٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 101,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 318,
                  "seller_username": "javad_mohammadi",
                  "seller_name": "جواد محمدی",
                  "booth_title": "املاک و خودرو امین شمال شرق",
                  "seller_phone": "09151110009",
                  "category": "vehicles",
                  "subcategory": "خودرو سواری و وانت",
                  "title": "پژو ۲۰۶ تیپ ۲ مدل ۱۳۹۹ بی‌رنگ و کم‌کارکرد",
                  "description": "فنی و بدنه به شرط کارشناسی، بیمه ۱۰ ماه، مصرف‌کننده واقعی.",
                  "price": 465000000,
                  "old_price": 485000000,
                  "discount_percent": 4,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "خودرو سواری و وانت",
                        "غرفه": "املاک و خودرو امین شمال شرق"
                  },
                  "address_detail": "ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵ - شمال شرق ۳۸، پلاک ۱۰",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3Eاملاک و خودرو امین شمال شرق%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپژو ۲۰۶ تیپ ۲ مدل ۱۳۹۹ بی‌رن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E465٬000٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 101,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 319,
                  "seller_username": "fatemeh_kazemi",
                  "seller_name": "فاطمه کاظمی",
                  "booth_title": "صنایع چوب و مبلمان ابرار",
                  "seller_phone": "09151110010",
                  "category": "home",
                  "subcategory": "مبلمان، میز و صندلی، کمد و سرویس خواب",
                  "title": "سرویس مبل راحتی ۷ نفره پارچه نانو قابل شست‌وشو",
                  "description": "کلاف تمام چوب روس و فوم سرد شرکتی با ضمانت ۲۴ ماهه تولیدی ابرار.",
                  "price": 9800000,
                  "old_price": 12200000,
                  "discount_percent": 20,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "مبلمان، میز و صندلی، کمد و سرویس خواب",
                        "غرفه": "صنایع چوب و مبلمان ابرار"
                  },
                  "address_detail": "پنج‌تن، شهرک ابرار و شمال شرق ۴۶ به بالا - شمال شرق ۴۸، پلاک ۱۶",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3Eصنایع چوب و مبلمان ابرار%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس مبل راحتی ۷ نفره پارچه%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E9٬800٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": true,
                  "amazing_status": "approved",
                  "is_urgent": false,
                  "urgent_status": "none",
                  "ladder_status": "approved",
                  "laddered_at": 1794390192,
                  "views_count": 108,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            },
            {
                  "id": 320,
                  "seller_username": "fatemeh_kazemi",
                  "seller_name": "فاطمه کاظمی",
                  "booth_title": "صنایع چوب و مبلمان ابرار",
                  "seller_phone": "09151110010",
                  "category": "jobs",
                  "subcategory": "صنعتی، فنی، مهندسی",
                  "title": "استخدام استادکار و شاگرد رویه‌کوبی و نجاری در کارگاه مبل",
                  "description": "حقوق توافقی + بیمه + آموزش رایگان برای جوانان مستعد شمال شرق.",
                  "price": 12000000,
                  "old_price": 0,
                  "discount_percent": 0,
                  "price_unit": "تومان",
                  "condition_badge": "تاییدشده",
                  "delivery_badge": "تحویل در محله",
                  "specs": {
                        "زیردسته تخصصی": "صنعتی، فنی، مهندسی",
                        "غرفه": "صنایع چوب و مبلمان ابرار"
                  },
                  "address_detail": "پنج‌تن، شهرک ابرار و شمال شرق ۴۶ به بالا - شمال شرق ۴۸، پلاک ۱۶",
                  "image_data": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3Eصنایع چوب و مبلمان ابرار%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eاستخدام استادکار و شاگرد روی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3E12٬000٬000 تومان%3C/text%3E%3C/svg%3E",
                  "is_amazing": false,
                  "amazing_status": "none",
                  "is_urgent": true,
                  "urgent_status": "approved",
                  "ladder_status": "none",
                  "laddered_at": 0,
                  "views_count": 108,
                  "status": "approved",
                  "rejection_reason": null,
                  "messages": []
            }
      ],
      "orders": []
};

    const SOLIDARITY_THEMES = [
      {
        badge: 'پیمان همبستگی اهالی شمال شرق مشهد',
        desc: 'وقتی دست‌های همسایگان در منطقه شمال شرق و محلات اطراف در هم گره بخورد، آموزش، معیشت و همیاری محله به بهترین شکل شکوفا می‌شود.'
      },
      {
        badge: '۱. اطلاع‌رسانی و روایتگری محله (در دست ساخت)',
        desc: 'انتشار اخبار موثق محله، اطلاعیه‌های مساجد، مدارس و گزارش‌های مردمی شمال شرق.'
      },
      {
        badge: '۲. مستندسازی و فرهنگ و هنر اهالی (در دست ساخت)',
        desc: 'ثبت خاطرات، تصاویر قدیمی محله، اشعار، مراسم مذهبی و آثار هنری جوانان شمال شرق.'
      },
      {
        badge: '۳. نقشه و خدمات محلی شمال شرق (در دست ساخت)',
        desc: 'معرفی داروخانه‌ها، درمانگاه‌ها، نانوایی‌ها، ایستگاه‌های مترو (شمال شرق و کشف‌رود) و نیازهای داوطلبانه محله.'
      },
      {
        badge: '۴. معیشت و بازار رایگان اهالی (فعال و عملیاتی)',
        desc: 'عرضه رایگان تولیدات خانگی، غرفه اختصاصی کسب‌وکارها، پیشنهاد شگفت‌انگیز و چت و چانه‌زنی بین اهالی شمال شرق.'
      }
    ];

    // Comprehensive Divar-Style Categories & Subcategories + Dynamic Fields Schema (نسخه نهایی بازار هم‌عهدی)
    const MARKET_CATEGORIES = [
      {
        id: 'real_estate',
        title: 'املاک',
        icon: 'fa-building',
        subcategories: [
          'خرید و فروش مسکونی (آپارتمان و ویلایی)',
          'اجاره مسکونی (رهن و اجاره)',
          'خرید و فروش اداری و تجاری (مغازه و غرفه)',
          'اجاره اداری و تجاری',
          'اجاره کوتاه‌مدت (زائرپذیر و سوئیت)',
          'پروژه‌های ساخت و ساز و مشارکت'
        ],
        dynamicFields: [
          { key: 'متراژ (متر مربع)', placeholder: 'مثلاً: ۸۵ متر مربع' },
          { key: 'تعداد اتاق و سال ساخت', placeholder: 'مثلاً: ۲ خوابه • ساخت ۱۴۰۱' },
          { key: 'نوع سند یا شرایط ودیعه', placeholder: 'مثلاً: قولنامه‌ای معتبر / قابل تبدیل' }
        ]
      },
      {
        id: 'vehicles',
        title: 'وسایل نقلیه',
        icon: 'fa-car',
        subcategories: [
          'خودرو سواری و وانت',
          'موتورسیکلت',
          'قطعات یدکی و لوازم جانبی خودرو و موتور',
          'کرایه و خدمات حمل خودرو',
          'ماشین‌آلات سنگین و کارگاهی'
        ],
        dynamicFields: [
          { key: 'مدل و سال تولید', placeholder: 'مثلاً: پراید ۱۳۱ مدل ۱۳۹۸ / هندا ۱۲۵' },
          { key: 'کارکرد (کیلومتر)', placeholder: 'مثلاً: ۶۵,۰۰۰ کیلومتر' },
          { key: 'وضعیت بدنه، فنی و بیمه', placeholder: 'مثلاً: بی‌رنگ، فنی سالم، ۸ ماه بیمه' }
        ]
      },
      {
        id: 'digital',
        title: 'کالای دیجیتال',
        icon: 'fa-mobile-screen-button',
        subcategories: [
          'موبایل، تبلت و لوازم جانبی',
          'رایانه رومیزی، لپ‌تاپ و قطعات',
          'کنسول، بازی‌ ویدئویی و آنلاین',
          'صوتی و تصویری (تلویزیون و اسپیکر)',
          'تلفن رومیزی، مودم و تجهیزات شبکه'
        ],
        dynamicFields: [
          { key: 'برند و مدل دقیق دستگاه', placeholder: 'مثلاً: سامسونگ A54 / لپ‌تاپ لنوو' },
          { key: 'حافظه داخلی و مشخصات فنی', placeholder: 'مثلاً: حافظه ۲۵۶ گیگ • رم ۸' },
          { key: 'وضعیت رجیستری، جعبه و سلامت', placeholder: 'مثلاً: با کارتن و انتقال مالکیت فوری' }
        ]
      },
      {
        id: 'home',
        title: 'خانه و آشپزخانه',
        icon: 'fa-couch',
        subcategories: [
          'لوازم خانگی برقی (یخچال، لباسشویی، جاروبرقی)',
          'مبلمان، میز، کمد و صنایع چوب',
          'فرش، گلیم، موکت و تابلوفرش',
          'ظروف و لوازم پخت‌وپز آشپزخانه',
          'دکوراسیون، پرده و لوستر و روشنایی',
          'سیستم سرمایشی و گرمایشی (بخاری، آبگرمکن، کولر)'
        ],
        dynamicFields: [
          { key: 'برند یا سازنده', placeholder: 'مثلاً: پارس خزر / کارگاه محلی طوس' },
          { key: 'سلامت ظاهری و فنی', placeholder: 'مثلاً: کاملاً سالم و بدون خط و خش' },
          { key: 'علت فروش یا شرایط', placeholder: 'مثلاً: تغییر دکوراسیون / فروش نقدی و اقساط' }
        ]
      },
      {
        id: 'service',
        title: 'خدمات',
        icon: 'fa-screwdriver-wrench',
        subcategories: [
          'تعمیرات و تاسیسات (پکیج، آبگرمکن، لوله‌کشی، برق)',
          'موتور و ماشین (مکانیکی، جلوبندی، باتری‌سازی)',
          'پذیرایی و مراسم (آشپزی، طبخ نذری و مجالس)',
          'خدمات رایانه‌ای، موبایل و نصب نرم‌افزار',
          'مالی، حسابداری و بیمه',
          'حمل و نقل و وانت‌بار محله',
          'پیشه‌وری و مهارت (جوشکاری، نجاری، بنایی)',
          'آرایشگری و زیبایی',
          'نظافت و خدمات منزل',
          'باغبانی و درختکاری',
          'آموزشی و مشاوره'
        ],
        dynamicFields: [
          { key: 'سابقه فعالیت فنی', placeholder: 'مثلاً: ۱۰ سال تجربه در شمال شرق' },
          { key: 'ساعات پاسخگویی و اعزام', placeholder: 'مثلاً: ۸ صبح تا ۲۲ (حتی ایام تعطیل)' },
          { key: 'محدوده پوشش در محله', placeholder: 'مثلاً: تمام کوچه‌های شمال شرق و چهارراه مقدم' }
        ]
      },
      {
        id: 'apparel',
        title: 'وسایل شخصی',
        icon: 'fa-shirt',
        subcategories: [
          'کیف، کفش و لباس زنانه و مردانه',
          'مانتو، چادر مشکی و حجاب (تولیدی محله)',
          'زیورآلات، ساعت و اکسسوری',
          'آرایشی، بهداشتی و درمانی',
          'کفش و لباس بچه و سیسمونی',
          'وسایل بچه، اسباب‌بازی و لوازم التحریر'
        ],
        dynamicFields: [
          { key: 'جنس پارچه / متریال', placeholder: 'مثلاً: کرپ درجه یک / نخ پنبه / پشم طبیعی' },
          { key: 'سایزبندی یا ابعاد', placeholder: 'مثلاً: فری‌سایز / سایز ۳۸ تا ۵۲' },
          { key: 'نوع دوخت یا وضعیت', placeholder: 'مثلاً: دوخت سفارشی کارگاه محله / نو' }
        ]
      },
      {
        id: 'entertainment',
        title: 'سرگرمی و فراغت',
        icon: 'fa-book-open',
        subcategories: [
          'کتاب و مجله (مذهبی، علمی، درسی و داستانی)',
          'دوچرخه، اسکیت و اسکوتر',
          'ورزش و تناسب اندام',
          'کلکسیون، تسبیح، انگشتر و صنایع دستی',
          'اسباب‌بازی و سرگرمی فکری',
          'تور و گشت زیارتی و سیاحتی'
        ],
        dynamicFields: [
          { key: 'نوع کالا یا مجموعه', placeholder: 'مثلاً: دوچرخه سایز ۲۶ / مجموعه کتاب' },
          { key: 'وضعیت سلامت', placeholder: 'مثلاً: کاملاً نو و تمیز' },
          { key: 'مشخصات تکمیلی', placeholder: 'مثلاً: مناسب نوجوانان و بزرگسالان' }
        ]
      },
      {
        id: 'barter',
        title: 'اجتماعی',
        icon: 'fa-handshake-angle',
        subcategories: [
          'معاوضه کالا به کالا و همیاری همسایگان',
          'رویداد، مراسم و هیئت‌های مذهبی محله',
          'داوطلبانه، نذر و خیریه مردمی',
          'گم‌شده‌ها و پیداشده‌ها در شمال شرق'
        ],
        dynamicFields: [
          { key: 'کالا یا موضوع همیاری', placeholder: 'مثلاً: معاوضه با ابزار کار یا همیاری محلی' },
          { key: 'ارزش تقریبی یا شرایط', placeholder: 'مثلاً: حدود ۵۰۰ هزار تومان / رایگان' },
          { key: 'شرایط تحویل و هماهنگی', placeholder: 'مثلاً: اولویت با همسایگان شمال شرق' }
        ]
      },
      {
        id: 'industrial',
        title: 'تجهیزات و صنعتی',
        icon: 'fa-gears',
        subcategories: [
          'مصالح و تجهیزات ساختمان',
          'ابزارآلات برقی، دستی و کارگاهی',
          'ماشین‌آلات صنعتی و کارگاه خانگی (چرخ خیاطی صنعتی و...)',
          'تجهیزات کسب‌وکار، مغازه، فروشگاه و نانوایی',
          'عمده‌فروشی و بنکداری'
        ],
        dynamicFields: [
          { key: 'نوع دستگاه یا ابزار صنعتی', placeholder: 'مثلاً: چرخ خیاطی صنعتی راسته / دریل و سنگ فرز' },
          { key: 'مشخصات فنی و توان', placeholder: 'مثلاً: دینام سرخود کم‌مصرف' },
          { key: 'وضعیت سلامت و ضمانت', placeholder: 'مثلاً: در حد نو با مهلت تست حضوری' }
        ]
      },
      {
        id: 'jobs',
        title: 'استخدام و کاریابی',
        icon: 'fa-briefcase',
        subcategories: [
          'اداری و مدیریت',
          'سرایداری و نظافت',
          'معماری، عمران و ساختمانی',
          'خدمات فروشگاه و رستوران',
          'رایانه و فناوری اطلاعات',
          'مالی، حسابداری، حقوقی',
          'بازاریابی و فروش',
          'صنعتی، فنی، مهندسی',
          'آموزشی',
          'حمل و نقل',
          'درمانی، زیبایی، بهداشتی',
          'هنری و رسانه'
        ],
        dynamicFields: [
          { key: 'نوع همکاری و شیفت کاری', placeholder: 'مثلاً: تمام‌وقت / پاره‌وقت / کار در منزل (مشاغل خانگی)' },
          { key: 'حقوق یا دستمزد پیشنهادی', placeholder: 'مثلاً: طبق قانون کار + پورسانت / توافقی' },
          { key: 'سابقه و مهارت مورد نیاز', placeholder: 'مثلاً: متعهد، ساکن محدوده شمال شرق' }
        ]
      },
      {
        id: 'food',
        title: 'تولیدات خانگی و مواد غذایی',
        icon: 'fa-bowl-food',
        subcategories: [
          'عسل طبیعی، زعفران، ادویه و خشکبار ارگانیک',
          'لبنیات سنتی، کره، پنیر و سرشیر محلی',
          'سبزیجات آماده، رب گوجه‌فرنگی، ترشیجات و شور خانگی',
          'نان، شیرینی، کلوچه زنجبیلی و قطاب خانگی',
          'غذای خانگی، حلوا و سفارش مجالس'
        ],
        dynamicFields: [
          { key: 'وزن / مقدار خالص', placeholder: 'مثلاً: ۱ کیلوگرم یا بسته ۵ عددی' },
          { key: 'زمان پخت / تولید', placeholder: 'مثلاً: پخت تازه روزانه / امسالی' },
          { key: 'نگهداری و سلامت', placeholder: 'مثلاً: کاملاً خانگی و بدون مواد نگهدارنده' }
        ]
      },
      {
        id: 'education',
        title: 'آموزش و کلاس‌های مهارتی',
        icon: 'fa-graduation-cap',
        subcategories: [
          'دروس مدرسه، کنکور و تقویتی (ریاضی، زبان و...)',
          'کامپیوتر (ICDL)، برنامه‌نویسی و هوش مصنوعی',
          'قرآن کریم، تجوید، مفاهیم و معارف اسلامی',
          'آموزش فنی و حرفه‌ای، خیاطی و قالیبافی',
          'آموزش هنر، خوشنویسی و طراحی'
        ],
        dynamicFields: [
          { key: 'تعداد جلسات و مدت دوره', placeholder: 'مثلاً: ۸ جلسه ۹۰ دقیقه‌ای' },
          { key: 'رده سنی / مخاطبان', placeholder: 'مثلاً: نوجوانان و بزرگسالان محله' },
          { key: 'محل برگزاری کلاس', placeholder: 'مثلاً: حضوری در شمال شرق / آنلاین' }
        ]
      }
    ];

    const TABARSI_ALLEYS = [
      'سراسر شمال شرق',
      'ابتدای شمال شرق (شمال شرق ۱ تا ۱۰)',
      'چهارراه مقدم و شمال شرق ۱۱ تا ۲۸',
      'ایستگاه مترو کشف‌رود و شمال شرق ۲۹ تا ۴۵',
      'بلوار دهمرده، جماران و نظام‌دوست',
      'پنج‌تن، شهرک ابرار و شمال شرق ۴۶ به بالا'
    ];

    let state = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE));
    let heroSliderInterval = null;

    const FORBIDDEN_PERSIAN_WORDS = [
      'کلاهبردار', 'دزد', 'احمق', 'بیشعور', 'آشغال', 'فحش', 'لعنت',
      'حرامزاده', 'کثافت', 'بی‌شرف', 'بیشرف', 'خفه', 'ابله', 'روانی', 'شارلاتان'
    ];

    function filterForbiddenWords(rawText) {
      let text = String(rawText || '').trim();
      let hadForbidden = false;
      FORBIDDEN_PERSIAN_WORDS.forEach(w => {
        if (text.includes(w)) {
          hadForbidden = true;
          text = text.split(w).join('***');
        }
      });
      return { text, hadForbidden };
    }

    function ensureSeedDataMerged(prevMessagesMap = {}, serverMessagesMap = {}) {
      if (!state.users || typeof state.users !== 'object') state.users = {};
      Object.keys(CLEAN_PRODUCTION_STATE.users).forEach(uKey => {
        if (!state.users[uKey]) {
          state.users[uKey] = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.users[uKey]));
        }
      });
      if (!Array.isArray(state.heroSlides) || state.heroSlides.length === 0) {
        state.heroSlides = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.heroSlides));
      }
      if (!Array.isArray(state.stories) || state.stories.length === 0) {
        state.stories = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.stories));
      }
      if (!Array.isArray(state.listings) || state.listings.length === 0) {
        state.listings = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.listings));
      }
      if (!Array.isArray(state.socialStories) || state.socialStories.length === 0) {
        state.socialStories = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.socialStories));
      }
      if (!Array.isArray(state.communityPosts) || state.communityPosts.length === 0) {
        state.communityPosts = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.communityPosts));
      }
      if (!Array.isArray(state.followsData) || state.followsData.length === 0) {
        state.followsData = JSON.parse(JSON.stringify(CLEAN_PRODUCTION_STATE.followsData));
      }
      if (!Array.isArray(state.registeredBotChannels)) {
        state.registeredBotChannels = [];
      } else {
        state.registeredBotChannels = state.registeredBotChannels.filter(c => {
          const cid = Number((c && c.id) || 0);
          const pf = String((c && c.platform) || '').toLowerCase();
          return !(cid >= 701 && cid <= 710) && ['bale', 'rubika', 'eitaa', 'telegram'].includes(pf);
        });
      }

      if (!Array.isArray(state.deletedMessageIds)) state.deletedMessageIds = [];
      if (!state.deletedChatKeys || typeof state.deletedChatKeys !== 'object') state.deletedChatKeys = {};
      const deletedIdSet = new Set((state.deletedMessageIds || []).map(x => Number(x)));
      const nowMs = Date.now();

      // Deduplicate messages strictly and respect deletions + live server state
      state.listings.forEach(item => {
        const lid = Number(item.id);
        const combined = [];
        const seenIds = new Set();
        const seenSignatures = new Set();

        const hasServerList = Object.prototype.hasOwnProperty.call(serverMessagesMap, lid);
        // Keep only recent optimistic messages from prevMessagesMap when authoritative server data is present
        const recentOptimistic = (prevMessagesMap[lid] || []).filter(m =>
          m && m._optimisticTs && (nowMs - Number(m._optimisticTs) < 8000)
        );
        const sources = hasServerList
          ? [serverMessagesMap[lid] || [], recentOptimistic]
          : [serverMessagesMap[lid] || [], item.messages || [], prevMessagesMap[lid] || []];

        sources.forEach(arr => {
          if (Array.isArray(arr)) {
            arr.forEach(m => {
              if (!m) return;
              const numId = Number(m.id || 0);
              if (numId && deletedIdSet.has(numId)) return;

              const mid = m.id ? String(m.id) : null;
              const sig = String(m.listing_id || lid) + '|' + String(m.sender_username || '') + '|' + String(m.receiver_username || '') + '|' + String(m.text || '').trim() + '|' + String(m.offered_price || 0);
              if ((mid && seenIds.has(mid)) || seenSignatures.has(sig)) {
                return;
              }
              if (mid) seenIds.add(mid);
              seenSignatures.add(sig);
              combined.push(m);
            });
          }
        });
        item.messages = combined;
      });

      // Also deduplicate & preserve recent optimistic messages for Ahdaneh (0) and Ahdino (-1) direct chatboxes
      [
        { lid: 0, prop: 'directMessages' },
        { lid: -1, prop: 'ahdinoMessages' }
      ].forEach(cfg => {
        const combined = [];
        const seenIds = new Set();
        const seenSigs = new Set();
        const hasSrv = Object.prototype.hasOwnProperty.call(serverMessagesMap, cfg.lid);
        const recentOpt = (prevMessagesMap[cfg.lid] || []).filter(m =>
          m && m._optimisticTs && (nowMs - Number(m._optimisticTs) < 8000)
        );
        const srcs = hasSrv
          ? [serverMessagesMap[cfg.lid] || [], recentOpt]
          : [serverMessagesMap[cfg.lid] || [], state[cfg.prop] || [], prevMessagesMap[cfg.lid] || []];
        srcs.forEach(arr => {
          if (!Array.isArray(arr)) return;
          arr.forEach(m => {
            if (!m) return;
            const numId = Number(m.id || 0);
            if (numId && deletedIdSet.has(numId)) return;
            const mid = m.id ? String(m.id) : null;
            const sig = String(cfg.lid) + '|' + String(m.sender_username || '') + '|' + String(m.receiver_username || '') + '|' + String(m.text || '').trim();
            if ((mid && seenIds.has(mid)) || seenSigs.has(sig)) return;
            if (mid) seenIds.add(mid);
            seenSigs.add(sig);
            combined.push(m);
          });
        });
        state[cfg.prop] = combined;
      });
    }

    try {
      try { localStorage.removeItem('hamahdi_tabarsi_prod_v4'); localStorage.removeItem('hamahdi_liked_posts_v303'); localStorage.removeItem('hamahdi_seen_stories_v21'); } catch (e) {}
      localStorage.removeItem('hamahdi_raw_v305'); localStorage.removeItem('hamahdi_v320_seeded'); localStorage.removeItem('hamahdi_ahdbot_saved_posts_v330'); const saved = localStorage.getItem('hamahdi_v331_clean');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.listings)) {
          state = Object.assign(state, parsed);
          if (!Array.isArray(state.heroSlides)) state.heroSlides = [];
          if (!Array.isArray(state.stories)) state.stories = [];
          if (!Array.isArray(state.orders)) state.orders = [];
          if (!Array.isArray(state.deletedMessageIds)) state.deletedMessageIds = [];
          if (!state.deletedChatKeys || typeof state.deletedChatKeys !== 'object') state.deletedChatKeys = {};
        }
      }
      // Restore per-tab user session so multiple tabs in the same browser can test different users simultaneously
      const tabUserRaw = sessionStorage.getItem('hamahdi_tab_user_v24');
      if (tabUserRaw) {
        const tabUser = JSON.parse(tabUserRaw);
        if (tabUser && tabUser.username) {
          state.currentUser = tabUser;
        }
      }
      ensureSeedDataMerged();
    } catch (e) {}


    function getApprovedHeroSlides() {
      return (state.heroSlides || []).filter(s => (s.status || 'approved') === 'approved');
    }

    // Requirement 6: 48-Hour Automatic Expiry for Business Stories
    function getApprovedStories() {
      const nowSec = Math.floor(Date.now() / 1000);
      return (state.stories || []).filter(st => {
        const isApp = (st.status || 'approved') === 'approved';
        const notExp = !st.expires_at || Number(st.expires_at) > nowSec;
        return isApp && notExp;
      });
    }

    // Returns approved listings sorted by Ladder timestamp first (Requirement 8)
    function getApprovedListings() {
      const list = (state.listings || []).filter(l => (l.status || 'approved') === 'approved');
      return list.sort((a, b) => (Number(b.laddered_at || 0) - Number(a.laddered_at || 0)) || (Number(b.id) - Number(a.id)));
    }

    function getPendingCounts() {
      const pendingSlides = (state.heroSlides || []).filter(s => s.status === 'pending');
      const pendingStories = (state.stories || []).filter(s => s.status === 'pending');
      const pendingListings = (state.listings || []).filter(l => l.status === 'pending');
      const pendingUsers = Object.values(state.users || {}).filter(u => u && u.role !== 'admin' && (u.booth_status || 'pending') === 'pending');
      const pendingPromos = (state.listings || []).filter(l =>
        l.status === 'approved' && (l.ladder_status === 'pending' || l.urgent_status === 'pending' || l.amazing_status === 'pending')
      );
      const pendingMessages = [];
      (state.listings || []).forEach(l => {
        (l.messages || []).forEach(m => {
          if (m.message_type === 'comment' && m.status === 'pending') {
            pendingMessages.push({ ...m, listing_id: l.id, listing_title: l.title });
          }
        });
      });
      const pendingBooths = Object.values(state.users || {}).filter(u => u && u.role !== 'admin' && u.booth_status === 'pending');
      const pendingBotChannels = [];
      return {
        booths: pendingBooths,
        botChannels: pendingBotChannels,
        slides: pendingSlides,
        stories: pendingStories,
        listings: pendingListings,
        promos: pendingPromos,
        messages: pendingMessages,
        total: pendingBooths.length + pendingSlides.length + pendingStories.length + pendingListings.length + pendingPromos.length + pendingMessages.length
      };
    }

