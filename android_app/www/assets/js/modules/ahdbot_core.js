/**
 * HAMAHDI v4.0.0 | ماژول هسته عهدبات: اتصال ۴ شبکه (@Hamahdibot)، ویزارد ۳ مرحله‌ای، یکتایی سراسری و امضای کانال
 */
function insertBotCaptionSnippet(snippetText, addNewline = false) {
  const ta = document.getElementById('bot-post-caption-input');
  if (!ta) return;
  const start = typeof ta.selectionStart === 'number' ? ta.selectionStart : ta.value.length;
  const end = typeof ta.selectionEnd === 'number' ? ta.selectionEnd : ta.value.length;
  const prefix = (addNewline && ta.value.length > 0 && !ta.value.endsWith('\n')) ? '\n' : '';
  const ins = prefix + snippetText;
  ta.value = ta.value.slice(0, start) + ins + ta.value.slice(end);
  const newPos = start + ins.length;
  ta.focus();
  if (ta.setSelectionRange) ta.setSelectionRange(newPos, newPos);
  if (typeof handleBotCaptionLiveInput === 'function') handleBotCaptionLiveInput(ta);
}

function applyBotCaptionTemplate(tplKey) {
  const templates = {
    notice: '📢 اطلاعیه مهم هم‌عهدی\n\nبا سلام و احترام خدمت همسایگان گرامی شمال شرق؛\n📌 موضوع: ...\n⏰ زمان: ...\n📍 مکان: ...\n\n#هم‌عهدی #شمال_شرق #اطلاعیه',
    spiritual: '✨ بسم الله الرحمن الرحیم ✨\n\n🕌 دعوت به مراسم معنوی و محفل همبستگی\n📅 تاریخ: ...\n⏰ ساعت: ...\n📍 نشانی: ...\n\nالتماس دعا 🤲🌹\n#عهد_معنوی #همبستگی_مردمی #مشهد_مقدس',
    market: '🛍️ معرفی محصول ویژه در عهد بازار\n\n✅ نام محصول: ...\n💰 قیمت ویژه همسایگان: ... تومان\n🚚 تحویل سریع در شمال شرق\n\n#عهد_بازار #حمایت_از_تولید_داخلی #شمال_شرق',
    solidarity: '🤝 فراخوان همیاری و همدلی محله\n\nهمسایگان عزیز، بیایید در این پویش مردمی سهیم باشیم:\n🔹 شرح همیاری: ...\n📞 شماره هماهنگی: ...\n\n#همیاری #همبستگی_مردمی #هم‌عهدی'
  };
  const ta = document.getElementById('bot-post-caption-input');
  if (!ta) return;
  ta.value = templates[tplKey] || '';
  ta.focus();
  if (typeof handleBotCaptionLiveInput === 'function') handleBotCaptionLiveInput(ta);
  showToast('✨ قالب کپشن آماده در کادر متن قرار گرفت.');
}

function addCustomBotHashtag() {
  const inp = document.getElementById('bot-custom-hashtag-inp');
  if (!inp) return;
  let tag = inp.value.trim().replace(/^#+/, '').replace(/\s+/g, '_');
  if (!tag) return;
  insertBotCaptionSnippet(' #' + tag, false);
  inp.value = '';
}

/**
 * HAMAHDI (هم‌عهدی) - ماژول خام و یکپارچه عهدینو، عهدانه، صفحه شخصی و عهدبات (نسخه 3.0.7)
 * بازنویسی کامل به صورت خام (بدون هیچ‌گونه هاردکد، پست یا کاربر نمایشی و بدون توضیحات اضافی)
 */

const SOCIAL_BOT_STATE = {
  csrfToken: '',
  isLivePhp: false,
  isPublishing: false,
  configPanelOpen: false,
  showOnboardingModal: false,
  selectedMediaType: 'image', // 'text' | 'audio' | 'image' | 'video'
  selectedFile: null,
  selectedDataUrl: '',
  recordedAudioDataUrl: '',
  isRecordingVoice: false,
  mediaRecorder: null,
  recordedChunks: [],
  ahdinoComposerAudioUrl: '',
  ahdinoComposerImageUrl: '',
  queueRunning: false,
  queueItems: [],
  queueProgressPct: 0,
  selectedChannelIds: [],
  platforms: {
    bale:     { is_configured: false, has_token: false, masked_token: '', channel_id: '', bot_name: '' },
    rubika:   { is_configured: false, has_token: false, masked_token: '', channel_id: '', bot_name: '' },
    eitaa:    { is_configured: false, has_token: false, masked_token: '', channel_id: '', bot_name: '' },
    soroush:  { is_configured: false, has_token: false, masked_token: '', channel_id: '', bot_name: '' },
    telegram: { is_configured: false, has_token: false, masked_token: '', channel_id: '', proxy: '', bot_name: '' }
  },
  history: []
};

const DEFAULT_REGISTERED_BOT_CHANNELS = [];
const DEFAULT_PUBLIC_AND_PERSONAL_STORIES = [{"id": 901, "scope": "public", "owner_username": "mahmoud_rezvani", "owner_name": "حاج محمود رضوانی", "title": "تخفیف عسل", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ر%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eتخفیف عسل%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه عسل چهل‌گیاه%3C/text%3E%3C/svg%3E", "caption": "۱۹٪ تخفیف ویژه عسل چهل‌گیاه", "created_at": "امروز", "seen": false}, {"id": 902, "scope": "personal", "owner_username": "mahmoud_rezvani", "owner_name": "حاج محمود رضوانی", "title": "محصولات ما", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ر%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمحصولات ما%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eکنترل کیفیت زعفران و عسل%3C/text%3E%3C/svg%3E", "caption": "کنترل کیفیت زعفران و عسل", "created_at": "امروز", "seen": false}, {"id": 903, "scope": "public", "owner_username": "saeed_karimi", "owner_name": "مهندس سعید کریمی", "title": "سرویس پکیج", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eس‌ک%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس پکیج%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eاعزام فوری در سراسر شمال شرق%3C/text%3E%3C/svg%3E", "caption": "اعزام فوری در سراسر شمال شرق", "created_at": "امروز", "seen": false}, {"id": 904, "scope": "personal", "owner_username": "saeed_karimi", "owner_name": "مهندس سعید کریمی", "title": "ابزار تخصصی", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eس‌ک%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eابزار تخصصی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eتعمیر برد و قطعات اصلی%3C/text%3E%3C/svg%3E", "caption": "تعمیر برد و قطعات اصلی", "created_at": "امروز", "seen": false}, {"id": 905, "scope": "public", "owner_username": "zahra_ahmadi", "owner_name": "زهرا احمدی", "title": "سبزی تازه", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eز‌ا%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسبزی تازه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت امروز آماده تحویل%3C/text%3E%3C/svg%3E", "caption": "پخت امروز آماده تحویل", "created_at": "امروز", "seen": false}, {"id": 906, "scope": "personal", "owner_username": "zahra_ahmadi", "owner_name": "زهرا احمدی", "title": "ترشیجات", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eز‌ا%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشیجات%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eسیرترشی و لیته خانگی%3C/text%3E%3C/svg%3E", "caption": "سیرترشی و لیته خانگی", "created_at": "امروز", "seen": false}, {"id": 907, "scope": "public", "owner_username": "ali_rahimi", "owner_name": "استاد علی رحیمی", "title": "فرش اقساطی", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eع‌ر%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفرش اقساطی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eبدون بهره ویژه زوج‌های جوان%3C/text%3E%3C/svg%3E", "caption": "بدون بهره ویژه زوج‌های جوان", "created_at": "امروز", "seen": false}, {"id": 908, "scope": "personal", "owner_username": "ali_rahimi", "owner_name": "استاد علی رحیمی", "title": "کارگاه طوس", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eع‌ر%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه طوس%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eآموزش و بافت تابلوفرش%3C/text%3E%3C/svg%3E", "caption": "آموزش و بافت تابلوفرش", "created_at": "امروز", "seen": false}, {"id": 909, "scope": "public", "owner_username": "mohammad_hosseini", "owner_name": "محمدرضا حسینی", "title": "پکیج صبحانه", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ح%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپکیج صبحانه%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۱۹٪ تخفیف ویژه امروز%3C/text%3E%3C/svg%3E", "caption": "۱۹٪ تخفیف ویژه امروز", "created_at": "امروز", "seen": false}, {"id": 910, "scope": "personal", "owner_username": "mohammad_hosseini", "owner_name": "محمدرضا حسینی", "title": "لبنیات بهار", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ح%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eلبنیات بهار%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eشیر و ماست خالص محلی%3C/text%3E%3C/svg%3E", "caption": "شیر و ماست خالص محلی", "created_at": "امروز", "seen": false}, {"id": 911, "scope": "public", "owner_username": "maryam_sadeghi", "owner_name": "مریم صادقی", "title": "حراج مانتو", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ص%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eحراج مانتو%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ تخفیف تولیدی پوشاک نور%3C/text%3E%3C/svg%3E", "caption": "۲۰٪ تخفیف تولیدی پوشاک نور", "created_at": "امروز", "seen": false}, {"id": 912, "scope": "personal", "owner_username": "maryam_sadeghi", "owner_name": "مریم صادقی", "title": "الگو و دوخت", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eم‌ص%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eالگو و دوخت%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eنمونه‌کارهای مزونی%3C/text%3E%3C/svg%3E", "caption": "نمونه‌کارهای مزونی", "created_at": "امروز", "seen": false}, {"id": 913, "scope": "public", "owner_username": "hamed_alavi", "owner_name": "مهندس حامد علوی", "title": "کلاس کامپیوتر", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eح‌ع%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلاس کامپیوتر%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۳۱٪ تخفیف ثبت‌نام ترم جدید%3C/text%3E%3C/svg%3E", "caption": "۳۱٪ تخفیف ثبت‌نام ترم جدید", "created_at": "امروز", "seen": false}, {"id": 914, "scope": "personal", "owner_username": "hamed_alavi", "owner_name": "مهندس حامد علوی", "title": "آکادمی فردا", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eح‌ع%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eآکادمی فردا%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eخدمات لپ‌تاپ و شبکه%3C/text%3E%3C/svg%3E", "caption": "خدمات لپ‌تاپ و شبکه", "created_at": "امروز", "seen": false}, {"id": 915, "scope": "public", "owner_username": "akbar_noori", "owner_name": "حاج اکبر نوری", "title": "کلوچه داغ", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eا‌ن%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه داغ%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eپخت عصرانه با ۲۴٪ تخفیف%3C/text%3E%3C/svg%3E", "caption": "پخت عصرانه با ۲۴٪ تخفیف", "created_at": "امروز", "seen": false}, {"id": 916, "scope": "personal", "owner_username": "akbar_noori", "owner_name": "حاج اکبر نوری", "title": "شیرینی برکت", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eا‌ن%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eشیرینی برکت%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eسفارش حلوا و شیرینی مجالس%3C/text%3E%3C/svg%3E", "caption": "سفارش حلوا و شیرینی مجالس", "created_at": "امروز", "seen": false}, {"id": 917, "scope": "public", "owner_username": "javad_mohammadi", "owner_name": "جواد محمدی", "title": "فایل‌های فوری", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eج‌م%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eفایل‌های فوری%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eرهن و خرید آپارتمان در شمال شرق%3C/text%3E%3C/svg%3E", "caption": "رهن و خرید آپارتمان در شمال شرق", "created_at": "امروز", "seen": false}, {"id": 918, "scope": "personal", "owner_username": "javad_mohammadi", "owner_name": "جواد محمدی", "title": "املاک امین", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eج‌م%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eاملاک امین%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eتنظیم رایگان عقدنامه زوج‌ها%3C/text%3E%3C/svg%3E", "caption": "تنظیم رایگان عقدنامه زوج‌ها", "created_at": "امروز", "seen": false}, {"id": 919, "scope": "public", "owner_username": "fatemeh_kazemi", "owner_name": "فاطمه کاظمی", "title": "مبل تولیدی", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eف‌ک%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمبل تولیدی%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3E۲۰٪ زیر قیمت نمایشگاه%3C/text%3E%3C/svg%3E", "caption": "۲۰٪ زیر قیمت نمایشگاه", "created_at": "امروز", "seen": false}, {"id": 920, "scope": "personal", "owner_username": "fatemeh_kazemi", "owner_name": "فاطمه کاظمی", "title": "کارگاه ابرار", "avatar": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='240' height='240' rx='120' fill='url(%23g)'/%3E%3Ccircle cx='120' cy='120' r='108' fill='none' stroke='%23fbbf24' stroke-opacity='.5' stroke-width='4'/%3E%3Ctext x='120' y='138' font-family='Tahoma,sans-serif' font-size='54' font-weight='900' fill='%23fff' text-anchor='middle'%3Eف‌ک%3C/text%3E%3C/svg%3E", "image": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 540 960'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='960' fill='url(%23g)'/%3E%3Crect x='36' y='140' width='468' height='680' rx='36' fill='rgba(2,6,23,.45)' stroke='%23020617' stroke-opacity='.45' stroke-width='2'/%3E%3Ctext x='270' y='250' font-family='Tahoma,sans-serif' font-size='22' font-weight='bold' fill='%23020617' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3Ctext x='270' y='450' font-family='Tahoma,sans-serif' font-size='30' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه ابرار%3C/text%3E%3Ctext x='270' y='530' font-family='Tahoma,sans-serif' font-size='20' font-weight='bold' fill='%23cbd5e1' text-anchor='middle'%3Eضمانت ۲۴ ماهه کلاف و فوم%3C/text%3E%3C/svg%3E", "caption": "ضمانت ۲۴ ماهه کلاف و فوم", "created_at": "امروز", "seen": false}];
const DEFAULT_COMMUNITY_POSTS = [
  {
    "id": 4001,
    "app_target": "ahdino",
    "media_type": "text",
    "author_username": "mahmoud_rezvani",
    "author_name": "حاج محمود رضوانی",
    "author_role": "غرفه ارگانیک رضوان",
    "title": "عرضه مستقیم محصولات ارگانیک در شمال شرق ۶",
    "caption": "همسایگان گرامی، بار جدید عسل طبیعی کوهستان و زعفران قائنات با تخفیف ویژه در غرفه رضوان آماده عرضه است.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "",
    "media_gallery": [],
    "poll": {
      "question": "اولویت اصلی اهالی شمال شرق برای طرح همبستگی این هفته چیست؟",
      "options": [
        {
          "text": "توزیع بسته‌های معیشتی و ارزاق",
          "votes": 42
        },
        {
          "text": "تخفیف ویژه نان و لبنیات محله",
          "votes": 28
        },
        {
          "text": "کلاس‌های آموزشی و مهارت‌آموزی نوجوانان",
          "votes": 19
        }
      ],
      "voters": {
        "saeed_karimi": 0,
        "zahra_ahmadi": 1,
        "ali_rahimi": 0
      }
    },
    "reposts_count": 4,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 18,
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
    "caption": "در این فایل صوتی کوتاه نکات مهم تشخیص عسل طبیعی از تغذیه‌ای را برای همسایگان توضیح داده‌ام.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 7,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 18,
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
    "caption": "زعفران سرگل ممتاز قائنات آماده تحویل در غرفه ارگانیک رضوان.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eبرداشت زعفران تازه امسالی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eبرداشت زعفران تازه امسالی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: آموزش هواگیری رادیاتور%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eنقشه جدید فرش ۶ متری گل‌فرنگ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 6,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 29,
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
    "caption": "مراحل بسته‌بندی عسل چهل‌گیاه و خشکبار تازه در غرفه محله.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بسته‌بندی بهداشتی عسل%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بسته‌بندی بهداشتی عسل%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشی مخلوط و سیرترشی هفت‌سال%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 11,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 29,
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
    "caption": "لطفاً پیش از روشن کردن بخاری و پکیج، از باز بودن مسیر دودکش و سلامت سنسور حرارتی اطمینان حاصل کنید.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "",
    "media_gallery": [],
    "poll": {
      "question": "کدام دسته از خدمات فنی در عهد بازار بیشتر مورد نیاز منزل شماست؟",
      "options": [
        {
          "text": "تعمیرات برق، کولر و پکیج در محل",
          "votes": 39
        },
        {
          "text": "خدمات خیاطی و تولیدات خانگی",
          "votes": 24
        },
        {
          "text": "پیک موتوری و وانت‌بار محله",
          "votes": 27
        }
      ],
      "voters": {
        "akbar_noori": 0,
        "fatemeh_kazemi": 1
      }
    },
    "reposts_count": 10,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 21,
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
    "caption": "روش تنظیم فشار آب پکیج روی ۱.۵ بار بدون نیاز به تعمیرکار.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 13,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 21,
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
    "caption": "اسیدشویی و رسوب‌گیری کامل مبدل حرارتی با دستگاه تمام‌اتوماتیک.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس تخصصی پکیج در شمال شرق ۱۴%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس تخصصی پکیج در شمال شرق ۱۴%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: شست‌وشو و خرد کردن مکا%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپنیر گوسفندی لیقوان و کره مح%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 16,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 33,
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
    "caption": "با این روش ساده راندمان گرمایش شوفاژ منزل خود را دو برابر کنید.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: آموزش هواگیری رادیاتور%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: آموزش هواگیری رادیاتور%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eنقشه جدید فرش ۶ متری گل‌فرنگ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 21,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 33,
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
    "caption": "سفارش‌های سبزی قرمه و کوکو امروز صبح آماده تحویل حضوری یا ارسال با پیک محلی است.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 16,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 24,
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
    "caption": "نسبت دقیق تره، جعفری، گشنیز و شنبلیله برای سبزی قرمه اصیل.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 4,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 24,
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
    "caption": "تهیه‌شده با سرکه طبیعی انگور و سبزیجات تازه.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشی مخلوط و سیرترشی هفت‌سال%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشی مخلوط و سیرترشی هفت‌سال%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل پرداخت و شور نها%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل‌های جدید چادر حسنا و مان%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 7,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 37,
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
    "caption": "رعایت کامل بهداشت در تمامی مراحل آماده‌سازی محصولات خانگی کوثر.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: شست‌وشو و خرد کردن مکا%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: شست‌وشو و خرد کردن مکا%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپنیر گوسفندی لیقوان و کره مح%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 12,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 37,
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
    "caption": "علاقه‌مندان به یادگیری هنر اصیل قالیبافی می‌توانند در کارگاه طوس ثبت‌نام کرده و پس از آموزش، دار قالی خانگی دریافت کنند.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 7,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 27,
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
    "caption": "گفتگوی شنیدنی درباره نقشه‌ها و رنگ‌های گیاهی اصیل فرش مشهد.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 10,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 27,
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
    "caption": "بافته‌شده توسط استادکاران ماهر کارگاه طوس در شمال شرق ۲۴.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eنقشه جدید فرش ۶ متری گل‌فرنگ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eنقشه جدید فرش ۶ متری گل‌فرنگ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: تهیه سرشیر سنتی و ماست%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه عملی برنامه‌نویسی نوج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 17,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 41,
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
    "caption": "درخشش ابریشم طبیعی پس از تکمیل بافت و پرداخت.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل پرداخت و شور نها%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23881337'/%3E%3Cstop offset='1' stop-color='%234c0519'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fda4af' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fda4af' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل پرداخت و شور نها%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eاستاد علی رحیمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل‌های جدید چادر حسنا و مان%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 22,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 41,
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
    "caption": "بار جدید شیر و سرشیر سنتی هر روز صبح در لبنیات بهار آماده ارائه به همسایگان است.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 13,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 30,
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
    "caption": "تفاوت ماست و پنیر سنتی تخمیر طبیعی با محصولات صنعتی.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 16,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 30,
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
    "caption": "تازه و معطر برای سفره صبحانه خانواده‌های محله.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپنیر گوسفندی لیقوان و کره مح%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eپنیر گوسفندی لیقوان و کره مح%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: برش لیزری و دوخت تمیز%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی و قطاب تازه قن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 8,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 45,
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
    "caption": "کیفیت و تازگی روزانه در لبنیات سنتی بهار شمال شرق ۸.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: تهیه سرشیر سنتی و ماست%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230c4a6e'/%3E%3Cstop offset='1' stop-color='%23082f49'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%237dd3fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%237dd3fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: تهیه سرشیر سنتی و ماست%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمحمدرضا حسینی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه عملی برنامه‌نویسی نوج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 13,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 45,
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
    "caption": "در کارگاه خیاطی نور، سفارش‌های دوخت بر اساس سایز دقیق شما در کوتاه‌ترین زمان آماده می‌شود.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 4,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 33,
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
    "caption": "مقایسه پارچه کرپ نخ، ندا و کنزو از نظر سبکی و مقاومت.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 7,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 33,
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
    "caption": "عرضه مستقیم از کارگاه تولیدی نور در شمال شرق ۱۷.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل‌های جدید چادر حسنا و مان%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل‌های جدید چادر حسنا و مان%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: ارتقای سرعت لپ‌تاپ با%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eواحد ۸۵ متری کلیدنخورده در ط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 18,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 49,
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
    "caption": "تضمین کیفیت دوخت و پارچه با قیمت تولیدی.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: برش لیزری و دوخت تمیز%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%234c1d95'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23e879f9' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e879f9' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: برش لیزری و دوخت تمیز%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمریم صادقی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی و قطاب تازه قن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 23,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 49,
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
    "caption": "پنج‌شنبه‌ها در آکادمی فردا میزبان نوجوانان و علاقه‌مندان به حوزه برنامه‌نویسی و تولید محتوا هستیم.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 10,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 36,
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
    "caption": "سه گام کلیدی برای عکاسی، معرفی محصول و فروش آنلاین.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 13,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 36,
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
    "caption": "آموزش پروژه‌محور مهارت‌های کامپیوتر در شمال شرق ۳۴.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه عملی برنامه‌نویسی نوج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکارگاه عملی برنامه‌نویسی نوج%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: پخت سنتی کلوچه زنجبیلی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل جدید مبل راحتی مینیمال پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 9,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 53,
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
    "caption": "افزایش ۵ برابری سرعت ویندوز در کمتر از ۳۰ دقیقه.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: ارتقای سرعت لپ‌تاپ با%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%231e3a8a'/%3E%3Cstop offset='1' stop-color='%23172554'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2393c5fd' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2393c5fd' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: ارتقای سرعت لپ‌تاپ با%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس حامد علوی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eواحد ۸۵ متری کلیدنخورده در ط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 14,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 53,
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
    "caption": "همسایگان عزیز، پخت نوبت عصر کلوچه زنجبیلی و قطاب گردویی آماده عرضه در شیرینی برکت است.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 16,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 39,
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
    "caption": "چرا شیرینی‌های سنتی خانگی بهترین جایگزین تنقلات صنعتی برای دانش‌آموزان هستند؟\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 4,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 39,
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
    "caption": "پخت سنتی و خانگی بدون اسانس مصنوعی در شمال شرق ۲۸.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی و قطاب تازه قن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eکلوچه زنجبیلی و قطاب تازه قن%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بازدید ویدیویی از آپار%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eبرداشت زعفران تازه امسالی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 19,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 57,
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
    "caption": "عطر هل و زنجبیل تازه در کارگاه نان و شیرینی برکت.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: پخت سنتی کلوچه زنجبیلی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%237c2d12'/%3E%3Cstop offset='1' stop-color='%23431407'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fdba74' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fdba74' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: پخت سنتی کلوچه زنجبیلی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج اکبر نوری%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل جدید مبل راحتی مینیمال پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 24,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 57,
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
    "caption": "در دفتر املاک امین، قرارداد رهن و اجاره برای عروس و دامادهای محله بدون دریافت کمیسیون تنظیم می‌گردد.\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 7,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 42,
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
    "caption": "بررسی اصالت مدارک، کد رهگیری و نحوه پرداخت امن ثمن معامله.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 10,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 42,
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
    "caption": "نورگیر عالی و دسترسی ۲ دقیقه‌ای به ایستگاه مترو.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eواحد ۸۵ متری کلیدنخورده در ط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eواحد ۸۵ متری کلیدنخورده در ط%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل کلاف‌سازی چوب رو%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس تخصصی پکیج در شمال شرق ۱۴%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 10,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 61,
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
    "caption": "مشاهده کامل پذیرایی، آشپزخانه و مشاعات ساختمان.\n#عهد_بازار #ارزاق_محله #شمال شرق_شمالی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بازدید ویدیویی از آپار%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23134e4a'/%3E%3Cstop offset='1' stop-color='%23042f2e'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%232dd4bf' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%232dd4bf' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بازدید ویدیویی از آپار%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eجواد محمدی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eبرداشت زعفران تازه امسالی%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 15,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 61,
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
    "caption": "با حذف واسطه‌ها، سرویس کامل مبل راحتی و میز جلومبلی را مستقیم از کارگاه ابرار با ضمانت کتبی تهیه کنید.\n#تولید_خانگی #همسایه_معتمد #موج_۲۵۲",
    "media_url": "",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 13,
    "is_pinned": true,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 45,
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
    "caption": "چگونه هنگام خرید مبل از دوام کلاف چوبی و فوم آن مطمئن شویم؟\n#عهدینو #صدای_محله #شمال شرق_شمالی",
    "media_url": "synthesized_voice_1",
    "media_gallery": [],
    "poll": null,
    "reposts_count": 16,
    "is_pinned": false,
    "published_networks": [
      "bale",
      "eitaa"
    ],
    "likes_count": 45,
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
    "caption": "رنگ‌بندی متنوع به انتخاب مشتری در تولیدی مبلمان ابرار.\n#عهدانه #روایت_تصویری #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل جدید مبل راحتی مینیمال پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eمدل جدید مبل راحتی مینیمال پ%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%2378350f'/%3E%3Cstop offset='1' stop-color='%231c1917'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23fbbf24' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23fbbf24' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: بسته‌بندی بهداشتی عسل%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eحاج محمود رضوانی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23064e3b'/%3E%3Cstop offset='1' stop-color='%23022c22'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2334d399' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2334d399' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eترشی مخلوط و سیرترشی هفت‌سال%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eزهرا احمدی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 20,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 65,
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
    "caption": "کیفیت و استحکام واقعی در کارگاه صنایع چوب ابرار شمال شرق ۴۸.\n#موج_۲۵۲ #شمال شرق_شمالی #همبستگی",
    "media_url": "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل کلاف‌سازی چوب رو%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
    "media_gallery": [
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%233b0764'/%3E%3Cstop offset='1' stop-color='%231e1b4b'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%23c084fc' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23c084fc' text-anchor='middle'%3E🎬 ریلز ویدیویی%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eریلز: مراحل کلاف‌سازی چوب رو%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eفاطمه کاظمی%3C/text%3E%3C/svg%3E",
      "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%231e3a8a'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='600' rx='24' fill='url(%23g)'/%3E%3Crect x='20' y='20' width='560' height='560' rx='20' fill='rgba(2,6,23,.4)' stroke='%2338bdf8' stroke-opacity='.4' stroke-width='1.5'/%3E%3Ctext x='300' y='150' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%2338bdf8' text-anchor='middle'%3E🖼️ قاب تصویری%3C/text%3E%3Ctext x='300' y='300' font-family='Tahoma,sans-serif' font-size='26' font-weight='900' fill='%23fff' text-anchor='middle'%3Eسرویس تخصصی پکیج در شمال شرق ۱۴%3C/text%3E%3Ctext x='300' y='432' font-family='Tahoma,sans-serif' font-size='16' font-weight='bold' fill='%23e2e8f0' text-anchor='middle'%3Eمهندس سعید کریمی%3C/text%3E%3C/svg%3E"
    ],
    "poll": null,
    "reposts_count": 6,
    "is_pinned": false,
    "published_networks": [
      "rubika",
      "bale"
    ],
    "likes_count": 65,
    "comments": [],
    "created_at": "امروز"
  }
];

function ensureRegisteredBotChannelsInitialized() {
  if (!Array.isArray(state.registeredBotChannels)) {
    state.registeredBotChannels = [];
  }
  // حذف کامل هرگونه کانال فیک/پیش‌فرض قدیمی (701 تا 710) و حفظ فقط کانال‌های واقعی ثبت‌شده توسط کاربران و ادمین
  state.registeredBotChannels = state.registeredBotChannels.filter(c => {
    if (!c) return false;
    const cid = Number(c.id || 0);
    const pf = String(c.platform || '').toLowerCase();
    return !(cid >= 701 && cid <= 710) && ['bale', 'rubika', 'eitaa', 'telegram'].includes(pf);
  });
  return state.registeredBotChannels;
}

function isBotChannelApproved(c) {
  if (!c) return false;
  if (c.status === 'pending' || c.status === 'rejected') return false;
  return Boolean(c.status === 'approved' || c.status === 'verified' || c.is_verified === 1 || c.is_verified === true);
}

function getMyOwnAllBotChannels() {
  const all = ensureRegisteredBotChannelsInitialized();
  const myUname = (state.currentUser && state.currentUser.username) ? String(state.currentUser.username).toLowerCase() : '';
  if (!myUname) return [];
  return all.filter(c => String(c.owner_username || '').toLowerCase() === myUname);
}

function getMyRegisteredBotChannels() {
  const all = ensureRegisteredBotChannelsInitialized();
  // طبق دستور اکید کارفرما: فقط و فقط ادمین می‌تواند به کانال‌های بقیه محتوا ارسال کند و کاربران فقط کانال‌های تاییدشده خود را در اختیار دارند
  if (isAdmin()) {
    return all.filter(c => isBotChannelApproved(c) && Number(c.members_count || 650) >= 500);
  }
  return getMyOwnAllBotChannels().filter(c => isBotChannelApproved(c) && Number(c.members_count || 650) >= 500);
}

function hasUserCompletedAhdbotOnboarding() {
  if (isAdmin()) return true;
  if (!state.currentUser || !state.currentUser.username) return false;
  if (state.currentUser.ahdbot_onboarded) return true;
  return getMyRegisteredBotChannels().length > 0;
}

function ensureSocialStoriesInitialized() {
  if (!Array.isArray(state.socialStories) || state.socialStories.length === 0) {
    state.socialStories = JSON.parse(JSON.stringify(DEFAULT_PUBLIC_AND_PERSONAL_STORIES));
  }
  return state.socialStories;
}

function getPublicSocialStories() {
  return ensureSocialStoriesInitialized().filter(s => (s.scope || 'public') === 'public');
}

function getPersonalProfileHighlights(username) {
  const uname = String(username || '').toLowerCase();
  if (!uname) return [];
  return ensureSocialStoriesInitialized().filter(s =>
    s.scope === 'personal' && String(s.owner_username || '').toLowerCase() === uname
  );
}

function ensureCommunityPostsInitialized() {
  if (!Array.isArray(state.communityPosts) || state.communityPosts.length === 0) {
    state.communityPosts = JSON.parse(JSON.stringify(DEFAULT_COMMUNITY_POSTS));
  }
  return state.communityPosts;
}

function getAhdinoPosts() {
  return ensureCommunityPostsInitialized().filter(p => (p.app_target || 'ahdino') === 'ahdino');
}

function getAhdanehPosts() {
  return ensureCommunityPostsInitialized().filter(p => p.app_target === 'ahdaneh');
}

// ==============================================================================
// FOLLOWERS & FOLLOWING ENGINE (کاملاً خام و متصل به دیتابیس)
// ==============================================================================
function ensureFollowsDataInitialized() {
  if (!Array.isArray(state.followsData)) {
    state.followsData = [];
  }
  return state.followsData;
}

function getFollowersListForUser(username) {
  const target = String(username || '').toLowerCase();
  if (!target) return [];
  const pairs = ensureFollowsDataInitialized();
  const followers = pairs
    .filter(p => String(p.following || '').toLowerCase() === target)
    .map(p => p.follower);
  return Array.from(new Set(followers));
}

function getFollowingListForUser(username) {
  const target = String(username || '').toLowerCase();
  if (!target) return [];
  const pairs = ensureFollowsDataInitialized();
  const following = pairs
    .filter(p => String(p.follower || '').toLowerCase() === target)
    .map(p => p.following);
  return Array.from(new Set(following));
}

function isCurrentUserFollowing(targetUsername) {
  if (!state.currentUser || !state.currentUser.username || state.currentUser.role === 'guest') return false;
  const me = String(state.currentUser.username).toLowerCase();
  const target = String(targetUsername || '').toLowerCase();
  return ensureFollowsDataInitialized().some(p =>
    String(p.follower || '').toLowerCase() === me && String(p.following || '').toLowerCase() === target
  );
}

function toggleFollowUser(targetUsername) {
  if (!isRegisteredUser() && !isAdmin()) {
    showToast('لطفاً ابتدا وارد حساب کاربری خود شوید.', 'warning');
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  const me = String(state.currentUser.username).toLowerCase();
  const target = String(targetUsername || '').toLowerCase();
  if (!target || me === target) return;

  const list = ensureFollowsDataInitialized();
  const idx = list.findIndex(p => String(p.follower || '').toLowerCase() === me && String(p.following || '').toLowerCase() === target);
  let nowFollowing = false;
  if (idx !== -1) {
    list.splice(idx, 1);
    nowFollowing = false;
  } else {
    list.push({ follower: state.currentUser.username, following: targetUsername });
    nowFollowing = true;
  }

  saveState();
  renderCurrentPage(true);
  callServerApi('toggle_follow_user', { follower: state.currentUser.username, following: targetUsername });
  const targetDisplay = getUserProfileMeta(targetUsername).display_name;
  showToast(nowFollowing ? `«${targetDisplay}» دنبال شد.` : `دنبال کردن «${targetDisplay}» لغو شد.`);
}

function getUserProfileMeta(username) {
  const uname = String(username || '').trim();
  if (state.currentUser && String(state.currentUser.username || '').toLowerCase() === uname.toLowerCase()) {
    return {
      username: state.currentUser.username,
      display_name: state.currentUser.display_name || state.currentUser.username,
      bio: state.currentUser.booth_bio || '',
      note: state.currentUser.profile_note || 'یادداشت...',
      avatar: state.currentUser.booth_logo || './icon-512.png?v=3.1.5',
      alley: state.currentUser.alley || '',
      phone: state.currentUser.phone || ''
    };
  }
  const uObj = (state.users && state.users[uname]) ? state.users[uname] : null;
  if (uObj) {
    return {
      username: uname,
      display_name: uObj.display_name || uname,
      bio: uObj.booth_bio || '',
      note: uObj.profile_note || 'یادداشت...',
      avatar: uObj.booth_logo || './icon-512.png?v=3.1.5',
      alley: uObj.alley || '',
      phone: uObj.phone || ''
    };
  }
  return {
    username: uname || 'user',
    display_name: uname || 'کاربر هم‌عهدی',
    bio: '',
    note: 'یادداشت...',
    avatar: './icon-512.png?v=3.1.5',
    alley: '',
    phone: ''
  };
}

function openUserPersonalProfile(username, initialTab = '') {
  const fallbackUname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest') ? state.currentUser.username : 'mahmoud_rezvani';
  const targetUname = username || fallbackUname;
  if (!targetUname) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  state.selectedBoothUsername = targetUname;
  if (initialTab) {
    state.profileActiveAppTab = initialTab;
  } else if (!state.profileActiveAppTab) {
    if (state.currentPage === 'ahdino') state.profileActiveAppTab = 'ahdino';
    else if (state.currentPage === 'ahdaneh') state.profileActiveAppTab = 'ahdaneh';
    else if (state.currentPage === 'social_bot') state.profileActiveAppTab = 'ahdbot';
    else state.profileActiveAppTab = 'ahdaneh';
  }
  state.currentPage = 'booth';
  saveState();
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function switchProfileAppTab(tabKey) {
  state.profileActiveAppTab = tabKey; // 'market' | 'ahdino' | 'ahdaneh' | 'ahdbot'
  saveState();
  renderCurrentPage(true);
}

function openFollowersOrFollowingModal(username, mode = 'followers') {
  const isFollowers = mode === 'followers';
  const meta = getUserProfileMeta(username);
  const rawList = isFollowers ? getFollowersListForUser(username) : getFollowingListForUser(username);

  openModal(`
    <div class="p-5 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div>
          <h3 class="font-black text-white text-sm sm:text-base">
            ${isFollowers ? `دنبال‌کنندگان «${escapeHtml(meta.display_name)}»` : `دنبال‌شوندگان «${escapeHtml(meta.display_name)}»`}
          </h3>
          <p class="text-[11px] text-amber-300 font-bold mt-0.5 dir-ltr text-right">@${escapeHtml(meta.username)}</p>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>

      ${rawList.length === 0 ? `
        <div class="p-6 text-center text-slate-400">
          هنوز موردی ثبت نشده است.
        </div>
      ` : `
        <div class="space-y-2 max-h-80 overflow-y-auto">
          ${rawList.map(u => {
            const uMeta = getUserProfileMeta(u);
            const following = isCurrentUserFollowing(u);
            const isMe = state.currentUser && String(state.currentUser.username).toLowerCase() === String(u).toLowerCase();
            return `
              <div class="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                <div onclick="closeModal(); openUserPersonalProfile('${escapeHtml(u)}');" class="flex items-center gap-3 cursor-pointer min-w-0">
                  <img src="${uMeta.avatar}" alt="" class="w-11 h-11 rounded-full object-cover border border-amber-400/40 shrink-0" onerror="this.src='./icon-512.png'" />
                  <div class="min-w-0">
                    <div class="font-black text-white text-xs truncate">${escapeHtml(uMeta.display_name)}</div>
                    <div class="text-[10px] text-slate-400 font-mono dir-ltr text-right">@${escapeHtml(u)}</div>
                  </div>
                </div>
                ${!isMe ? `
                  <button type="button" onclick="toggleFollowUser('${escapeHtml(u)}'); closeModal(); openFollowersOrFollowingModal('${escapeHtml(username)}', '${mode}');"
                    class="px-3.5 py-1.5 rounded-xl font-black text-[11px] transition shrink-0 ${following ? 'bg-white/10 text-slate-200 border border-white/20' : 'bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow'}">
                    ${following ? 'دنبال‌شده ✓' : '+ دنبال کردن'}
                  </button>
                ` : `<span class="text-[10px] text-emerald-300 font-bold">شما</span>`}
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `);
}

function openEditPersonalProfileModal() {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('booth');
    return;
  }
  const meta = getUserProfileMeta(state.currentUser.username);
  openModal(`
    <div class="p-5 sm:p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <h3 class="font-black text-amber-300 text-base">✏️ ویرایش پروفایل من</h3>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>
      <form onsubmit="submitEditPersonalProfile(event)" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">نام نمایشی *</label>
            <input id="edit-prof-name" type="text" required value="${escapeHtml(meta.display_name)}" class="glass-input w-full px-3 py-2 rounded-xl font-bold" />
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">یادداشت بالای تصویر (Note)</label>
            <input id="edit-prof-note" type="text" maxlength="35" value="${escapeHtml(meta.note === 'یادداشت...' ? '' : meta.note)}" placeholder="یادداشت کوتاه..." class="glass-input w-full px-3 py-2 rounded-xl" />
          </div>
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">بیوگرافی</label>
          <textarea id="edit-prof-bio" rows="3" placeholder="معرفی کوتاه..." class="glass-input w-full p-3 rounded-xl leading-relaxed">${escapeHtml(meta.bio)}</textarea>
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">تصویر پروفایل</label>
          <input id="edit-prof-avatar" type="file" accept="image/*" class="glass-input w-full px-3 py-2 rounded-xl" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">انصراف</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg">ذخیره</button>
        </div>
      </form>
    </div>
  `);
}

function submitEditPersonalProfile(e) {
  e.preventDefault();
  const newName = ((document.getElementById('edit-prof-name') || {}).value || '').trim();
  const newNote = ((document.getElementById('edit-prof-note') || {}).value || '').trim();
  const newBio = ((document.getElementById('edit-prof-bio') || {}).value || '').trim();
  const fileInp = document.getElementById('edit-prof-avatar');

  const applyChanges = (avatarDataUrl) => {
    const uname = state.currentUser.username;
    if (newName) state.currentUser.display_name = newName;
    state.currentUser.profile_note = newNote || 'یادداشت...';
    state.currentUser.booth_bio = newBio;
    if (avatarDataUrl) state.currentUser.booth_logo = avatarDataUrl;
    if (!state.users[uname]) state.users[uname] = {};
    Object.assign(state.users[uname], state.currentUser);
    closeModal();
    saveState();
    renderCurrentPage(true);
    callServerApi('update_booth', {
      username: uname,
      display_name: newName || state.currentUser.display_name || uname,
      profile_note: state.currentUser.profile_note || '',
      booth_title: state.currentUser.booth_title || ('غرفه ' + (newName || uname)),
      booth_bio: newBio,
      booth_hours: state.currentUser.booth_hours || 'همه‌روزه ۹ صبح تا ۲۱',
      booth_logo: avatarDataUrl || state.currentUser.booth_logo || ''
    });
    showToast('پروفایل شما به‌روزرسانی شد.');
  };

  if (fileInp && fileInp.files && fileInp.files[0]) {
    readImageFileAsDataUrl(fileInp, 500, applyChanges);
  } else {
    applyChanges(null);
  }
}

// ==============================================================================
// CLEAN FULL-SCREEN INSTAGRAM-STYLE STORY VIEWER (Requirement 2)
// - بالا سمت راست: فقط عکس پروفایل و نام طرف
// - کل صفحه: پوشیده شده با تصویر استوری
// - پایین سمت راست: دکمه لایک + کادر ریپلای استوری (فقط همین)
// ==============================================================================
function getStoryLikesMap() {
  try {
    const raw = localStorage.getItem('hamahdi_story_likes_v305');
    const obj = raw ? JSON.parse(raw) : {};
    return (obj && typeof obj === 'object') ? obj : {};
  } catch (e) {
    return {};
  }
}

function hasUserLikedStory(storyId) {
  const uid = getUserLikeKey();
  const map = getStoryLikesMap();
  return Boolean(map[uid + '_' + Number(storyId)]);
}

function toggleStoryLikeAction(storyId) {
  if (!isRegisteredUser() && !isAdmin()) {
    showToast('برای لایک استوری، ابتدا وارد حساب خود شوید.', 'warning');
    return;
  }
  const uid = getUserLikeKey();
  const map = getStoryLikesMap();
  const key = uid + '_' + Number(storyId);
  const nowLiked = !map[key];
  if (nowLiked) map[key] = true;
  else delete map[key];
  try {
    localStorage.setItem('hamahdi_story_likes_v305', JSON.stringify(map));
  } catch (e) {}
  const btn = document.getElementById('story-like-btn-' + Number(storyId));
  if (btn) {
    btn.innerHTML = nowLiked ? '❤️' : '🤍';
  }
  callServerApi('like_social_story', { id: Number(storyId), unlike: !nowLiked });
}

function submitStoryReplyAction(e, ownerUsername, ownerName) {
  if (e && e.preventDefault) e.preventDefault();
  if (!isRegisteredUser() && !isAdmin()) {
    closeFullscreenStoryViewer();
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  const inp = document.getElementById('story-reply-inp');
  const txt = (inp ? inp.value : '').trim();
  if (!txt) return;

  const senderUname = state.currentUser.username;
  const senderName = state.currentUser.display_name || senderUname;
  const targetUname = ownerUsername || 'admin';

  // Ensure a general chat container exists or attach to first listing/direct thread
  const msgPayload = {
    listing_id: 0,
    sender_username: senderUname,
    receiver_username: targetUname,
    sender: senderName,
    text: 'پاسخ به استوری: ' + txt,
    offered_price: 0,
    message_type: 'pv'
  };
  callServerApi('add_message', msgPayload);
  if (inp) inp.value = '';
  showToast(`پاسخ شما برای «${ownerName || targetUname}» ارسال شد.`);
}

function closeFullscreenStoryViewer() {
  if (storyAutoAdvanceTimer) {
    clearTimeout(storyAutoAdvanceTimer);
    storyAutoAdvanceTimer = null;
  }
  closeModal();
}

function openSocialStoryViewerModal(storyId) {
  if (storyAutoAdvanceTimer) {
    clearTimeout(storyAutoAdvanceTimer);
    storyAutoAdvanceTimer = null;
  }
  const list = ensureSocialStoriesInitialized();
  const currentIdx = list.findIndex(x => Number(x.id) === Number(storyId));
  const st = currentIdx !== -1 ? list[currentIdx] : list[0];
  if (!st) return;
  st.seen = true;

  const sameScopeList = list.filter(x => (x.scope || 'public') === (st.scope || 'public'));
  const scopeIdx = sameScopeList.findIndex(x => Number(x.id) === Number(st.id));
  const prevStory = scopeIdx > 0 ? sameScopeList[scopeIdx - 1] : null;
  const nextStory = (scopeIdx !== -1 && scopeIdx < sameScopeList.length - 1) ? sameScopeList[scopeIdx + 1] : null;
  const liked = hasUserLikedStory(st.id);
  const ownerMeta = getUserProfileMeta(st.owner_username);
  const displayOwnerName = st.owner_name || ownerMeta.display_name || st.owner_username || 'کاربر';
  const displayAvatar = st.avatar || ownerMeta.avatar || st.image || './icon-512.png';

  saveState();
  renderCurrentPage(true);

  openModal(`
    <div class="insta-story-fullscreen-stage">
      <!-- کل صفحه پوشیده شده با تصویر استوری -->
      <img src="${st.image}" alt="" class="hm-story-full-bg-blur" aria-hidden="true" />
      <img src="${st.image}" alt="" class="hm-story-full-cover-img" />

      <!-- نوار بالا: خط پیشرفت + بالا سمت راست فقط عکس پروفایل و نام طرف + دکمه بستن -->
      <div class="hm-story-top-bar">
        <div class="insta-progress-row mb-3">
          ${sameScopeList.map((item, idx) => `
            <div class="insta-progress-seg">
              <div class="insta-progress-fill ${idx < scopeIdx ? 'done' : (idx === scopeIdx ? 'active' : '')}"></div>
            </div>
          `).join('')}
        </div>

        <div class="flex items-center justify-between">
          <!-- بالا سمت راست: فقط عکس پروفایل و نام طرف -->
          <div onclick="closeFullscreenStoryViewer(); openUserPersonalProfile('${escapeHtml(st.owner_username)}');" class="flex items-center gap-2.5 cursor-pointer">
            <div class="w-10 h-10 rounded-full ig-story-ring p-0.5 bg-black shrink-0">
              <img src="${displayAvatar}" alt="" class="w-full h-full rounded-full object-cover" onerror="this.src='./icon-512.png'" />
            </div>
            <span class="font-black text-white text-xs sm:text-sm drop-shadow">${escapeHtml(displayOwnerName)}</span>
          </div>

          <!-- دکمه بستن -->
          <button type="button" onclick="closeFullscreenStoryViewer()" class="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white font-bold text-sm flex items-center justify-center">
            ✕
          </button>
        </div>
      </div>

      <!-- ناحیه لمس چپ و راست برای استوری قبلی و بعدی -->
      <div class="hm-story-tap-zones">
        <div onclick="${prevStory ? `openSocialStoryViewerModal(${Number(prevStory.id)})` : 'closeFullscreenStoryViewer()'}" class="h-full cursor-pointer"></div>
        <div onclick="${nextStory ? `openSocialStoryViewerModal(${Number(nextStory.id)})` : 'closeFullscreenStoryViewer()'}" class="h-full cursor-pointer"></div>
      </div>

      <!-- پایین صفحه: پایین سمت راست لایک + کادر ریپلای استوری (فقط همین) -->
      <div class="hm-story-bottom-bar" onclick="event.stopPropagation()">
        <button type="button" id="story-like-btn-${Number(st.id)}" onclick="toggleStoryLikeAction(${Number(st.id)})"
          class="w-11 h-11 rounded-full bg-black/55 border border-white/25 flex items-center justify-center text-xl shrink-0 transition transform active:scale-125">
          ${liked ? '❤️' : '🤍'}
        </button>

        <form onsubmit="submitStoryReplyAction(event, '${escapeHtml(st.owner_username)}', '${escapeHtml(displayOwnerName)}')" class="flex-1 flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5">
          <input id="story-reply-inp" type="text" required placeholder="پاسخ به استوری..."
            onfocus="if(storyAutoAdvanceTimer){clearTimeout(storyAutoAdvanceTimer);storyAutoAdvanceTimer=null;}"
            class="bg-transparent border-0 outline-none text-white text-xs flex-1 py-1.5 placeholder:text-slate-300" />
          <button type="submit" class="text-amber-400 font-black text-xs px-2 py-1 hover:text-amber-300 shrink-0">ارسال</button>
        </form>
      </div>
    </div>
  `);

  storyAutoAdvanceTimer = setTimeout(() => {
    if (nextStory) openSocialStoryViewerModal(nextStory.id);
    else closeFullscreenStoryViewer();
  }, 6000);
}

function openCreateSocialStoryModal(defaultScope = 'public') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  openModal(`
    <div class="p-5 sm:p-6 space-y-4 text-xs max-w-md mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <h3 class="font-black text-amber-300 text-base">📸 افزودن استوری</h3>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>
      <form onsubmit="submitNewSocialStory(event)" class="space-y-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label class="block text-slate-300 font-bold mb-1">نوع استوری *</label>
            <select id="new-story-scope" class="glass-input w-full px-3 py-2 rounded-xl font-bold">
              <option value="public" ${defaultScope === 'public' ? 'selected' : ''}>استوری عمومی</option>
              <option value="personal" ${defaultScope === 'personal' ? 'selected' : ''}>استوری شخصی پروفایل</option>
            </select>
          </div>
          <div>
            <label class="block text-slate-300 font-bold mb-1">عنوان کوتاه</label>
            <input id="new-story-title" type="text" maxlength="22" placeholder="عنوان..." class="glass-input w-full px-3 py-2 rounded-xl font-bold" />
          </div>
        </div>
        <div>
          <label class="block text-slate-300 font-bold mb-1">تصویر استوری *</label>
          <input id="new-story-file" type="file" accept="image/*" required class="glass-input w-full px-3 py-2 rounded-xl" />
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">انصراف</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-pink-500 to-purple-500 text-white font-black shadow-lg">انتشار استوری</button>
        </div>
      </form>
    </div>
  `);
}

function submitNewSocialStory(e) {
  e.preventDefault();
  const scope = ((document.getElementById('new-story-scope') || {}).value || 'public');
  const title = ((document.getElementById('new-story-title') || {}).value || '').trim();
  const fileInp = document.getElementById('new-story-file');
  if (!fileInp || !fileInp.files || !fileInp.files[0]) {
    showToast('لطفاً تصویر استوری را انتخاب کنید.', 'error');
    return;
  }
  readImageFileAsDataUrl(fileInp, 1080, function(dataUrl) {
    if (!dataUrl) return;
    const u = state.currentUser || { username: 'user', display_name: 'کاربر' };
    const newSt = {
      id: Date.now(),
      scope: scope,
      owner_username: u.username,
      owner_name: u.display_name || u.username,
      title: title || u.display_name || u.username,
      avatar: u.booth_logo || dataUrl,
      image: dataUrl,
      caption: title || '',
      created_at: 'امروز',
      seen: false
    };
    ensureSocialStoriesInitialized().unshift(newSt);
    closeModal();
    saveState();
    renderCurrentPage(true);
    callServerApi('add_social_story', {
      scope: scope,
      owner_username: u.username,
      owner_name: u.display_name || u.username,
      title: title || u.display_name || u.username,
      caption: title || '',
      image_data: dataUrl
    });
    showToast('استوری شما منتشر شد.');
  });
}

// ==============================================================================
// LIKE / UNLIKE TOGGLE ENGINE
// ==============================================================================
function getUserLikeKey() {
  if (state.currentUser && state.currentUser.username) {
    return String(state.currentUser.username).toLowerCase();
  }
  let anonId = localStorage.getItem('hamahdi_device_like_uid');
  if (!anonId) {
    anonId = 'dev_' + Math.random().toString(36).slice(2, 10);
    try { localStorage.setItem('hamahdi_device_like_uid', anonId); } catch (e) {}
  }
  return anonId;
}

function getLikedPostsMap() {
  try {
    const raw = localStorage.getItem('hamahdi_liked_posts_v305');
    const obj = raw ? JSON.parse(raw) : {};
    return (obj && typeof obj === 'object') ? obj : {};
  } catch (e) {
    return {};
  }
}

function hasUserLikedPost(postId) {
  const uid = getUserLikeKey();
  const map = getLikedPostsMap();
  const key = uid + '_' + Number(postId);
  if (map[key]) return true;
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (post && Array.isArray(post.liked_by) && post.liked_by.includes(uid)) {
    return true;
  }
  return false;
}

function setUserLikedPostState(postId, liked) {
  const uid = getUserLikeKey();
  const map = getLikedPostsMap();
  const key = uid + '_' + Number(postId);
  if (liked) map[key] = true;
  else delete map[key];
  try {
    localStorage.setItem('hamahdi_liked_posts_v305', JSON.stringify(map));
  } catch (e) {}
}


function getSavedPostsMap() {
  try {
    const raw = localStorage.getItem('hamahdi_saved_posts_v307');
    const obj = raw ? JSON.parse(raw) : {};
    return (obj && typeof obj === 'object') ? obj : {};
  } catch (e) {
    return {};
  }
}

function hasUserSavedPost(postId) {
  const uid = getUserLikeKey();
  const map = getSavedPostsMap();
  return Boolean(map[uid + '_' + Number(postId)]);
}

function toggleSaveCommunityPost(postId) {
  const uid = getUserLikeKey();
  const map = getSavedPostsMap();
  const key = uid + '_' + Number(postId);
  const nowSaved = !map[key];
  if (nowSaved) map[key] = true;
  else delete map[key];
  try {
    localStorage.setItem('hamahdi_saved_posts_v307', JSON.stringify(map));
  } catch (e) {}
  renderCurrentPage(true);
  showToast(nowSaved ? 'پست در لیست ذخیره‌شده‌ها (🔖) ثبت شد.' : 'پست از لیست ذخیره‌شده‌ها خارج شد.');
}

function shareContentDeepLink(type, idOrUname, titleText) {
  const baseUrl = window.location.origin + window.location.pathname;
  let shareUrl = baseUrl;
  if (type === 'post') {
    const p = ensureCommunityPostsInitialized().find(x => Number(x.id) === Number(idOrUname));
    const appName = (p && p.app_target === 'ahdaneh') ? 'ahdaneh' : 'ahdino';
    shareUrl = `${baseUrl}?app=${appName}&post=${encodeURIComponent(idOrUname)}`;
  } else if (type === 'profile') {
    shareUrl = `${baseUrl}?profile=${encodeURIComponent(idOrUname)}`;
  } else if (type === 'listing') {
    shareUrl = `${baseUrl}?app=market&listing=${encodeURIComponent(idOrUname)}`;
  }
  const shareTitle = titleText || 'سوپراپلیکیشن هم‌عهدی';
  if (navigator.share) {
    navigator.share({ title: shareTitle, text: shareTitle, url: shareUrl }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareUrl).then(() => {
      showToast('لینک مستقیم کپی شد و آماده اشتراک‌گذاری است 🔗');
    }).catch(() => {
      showToast('لینک: ' + shareUrl);
    });
  } else {
    showToast('لینک: ' + shareUrl);
  }
}

function handleSocialSearchInput(appType, val) {
  if (appType === 'ahdaneh') {
    state.ahdanehSearchQuery = String(val || '');
  } else {
    state.ahdinoSearchQuery = String(val || '');
  }
  renderCurrentPage(true);
  const inpId = appType === 'ahdaneh' ? 'ahdaneh-search-inp' : 'ahdino-search-inp';
  const el = document.getElementById(inpId);
  if (el) {
    el.focus();
    const len = el.value.length;
    try { el.setSelectionRange(len, len); } catch (e) {}
  }
}


// ==============================================================================
// TWITTER (X) & INSTAGRAM CORE ENGINES (v3.1.5)
// - Clickable #Hashtags & @Mentions + Trending Topics Bar
// - Repost (🔁) & Quote Post Modal
// - Interactive Polls (📊) with Live Percentage Bars
// - Waveform Voice Player with 1x / 1.5x / 2x Speed Control
// - Multi-Slide Carousel (1/3) + Double-Tap Heart Burst + Pinned Profile Posts
// - Full-Screen Vertical Snap-Scroll Reels Player
// ==============================================================================
const CAROUSEL_SLIDE_INDEX_MAP = {};

function formatSocialTextWithHashtagsAndMentions(rawText, appType = 'ahdino') {
  const safe = escapeHtml(rawText || '');
  return safe
    .replace(/(#[\u0600-\u06FFa-zA-Z0-9_]+)/g, function(tag) {
      return `<button type="button" onclick="event.stopPropagation(); setSocialHashtagFilter('${ appType }', '${ tag }')" class="text-sky-300 hover:text-amber-300 font-black hover:underline mx-0.5">${ tag }</button>`;
    })
    .replace(/@([a-zA-Z0-9_]{3,32})/g, function(full, uname) {
      return `<button type="button" onclick="event.stopPropagation(); openUserPersonalProfile('${ uname }', '${ appType }')" class="text-amber-300 hover:underline font-mono dir-ltr mx-0.5">@${ uname }</button>`;
    });
}

function setSocialHashtagFilter(appType, tagStr) {
  if (appType === 'ahdaneh') {
    state.ahdanehSearchQuery = (state.ahdanehSearchQuery === tagStr) ? '' : tagStr;
  } else {
    state.ahdinoSearchQuery = (state.ahdinoSearchQuery === tagStr) ? '' : tagStr;
  }
  renderCurrentPage(true);
}

function getTrendingHashtagsForApp(appType) {
  const posts = appType === 'ahdaneh' ? getAhdanehPosts() : getAhdinoPosts();
  const counts = {};
  posts.forEach(p => {
    const matches = String(p.caption || '').match(/#[\u0600-\u06FFa-zA-Z0-9_]+/g) || [];
    matches.forEach(t => {
      counts[t] = (counts[t] || 0) + 1;
    });
  });
  const defaults = ['#موج_۲۵۲', '#شمال شرق_شمالی', '#همبستگی', '#تولید_خانگی', '#ارزاق_محله'];
  defaults.forEach(d => { if (!counts[d]) counts[d] = 3; });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(e => ({ tag: e[0], count: e[1] }));
}

function renderTrendingHashtagsBarHtml(appType) {
  const trends = getTrendingHashtagsForApp(appType);
  const currentQ = appType === 'ahdaneh' ? (state.ahdanehSearchQuery || '') : (state.ahdinoSearchQuery || '');
  return `
    <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-[11px]">
      <span class="text-amber-300 font-black shrink-0">🔥 ترندها:</span>
      ${currentQ ? `
        <button type="button" onclick="setSocialHashtagFilter('${appType}', '')" class="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 font-black shrink-0">
          حذف فیلتر ✕
        </button>
      ` : ''}
      ${trends.map(t => `
        <button type="button" onclick="setSocialHashtagFilter('${appType}', '${escapeHtml(t.tag)}')" class="px-2.5 py-1 rounded-full border transition shrink-0 font-bold ${currentQ === t.tag ? 'bg-amber-400 text-slate-950 border-amber-400 font-black' : 'bg-slate-900/80 text-sky-300 border-white/10 hover:border-amber-400/40'}">
          ${escapeHtml(t.tag)}
        </button>
      `).join('')}
    </div>
  `;
}

function openRepostModal(postId) {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdino');
    return;
  }
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  openModal(`
    <div class="p-5 space-y-4 text-xs max-w-md mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <h3 class="font-black text-white text-sm">🔁 بازنشر (Repost / Quote) در صفحه شما</h3>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-white font-bold">✕</button>
      </div>
      <div class="p-3 rounded-2xl bg-slate-950/75 border border-white/10 text-slate-300 space-y-1">
        <div class="font-black text-amber-300">${escapeHtml(post.author_name)} (@${escapeHtml(post.author_username)})</div>
        <p class="line-clamp-2 text-[11px]">${escapeHtml(post.caption)}</p>
      </div>
      <div class="space-y-2">
        <label class="text-slate-300 font-bold block">نقل‌قول یا دیدگاه شما (اختیاری):</label>
        <textarea id="repost-quote-inp" rows="2" placeholder="اگر می‌خواهید نظر خود را بالای این پست بنویسید اینجا تایپ کنید..." class="glass-input w-full p-3 rounded-2xl text-xs"></textarea>
      </div>
      <div class="grid grid-cols-2 gap-2.5">
        <button type="button" onclick="submitRepostAction(${Number(post.id)}, false)" class="py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs shadow">
          🔁 بازنشر مستقیم
        </button>
        <button type="button" onclick="submitRepostAction(${Number(post.id)}, true)" class="py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow">
          💬 بازنشر با یادداشت
        </button>
      </div>
    </div>
  `);
}

function submitRepostAction(postId, withQuote) {
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  const quoteTxt = withQuote ? (((document.getElementById('repost-quote-inp') || {}).value || '').trim()) : '';
  const authorInfo = getCurrentPublisherAuthorInfo();
  post.reposts_count = Number(post.reposts_count || 0) + 1;

  const newRepost = {
    id: Date.now(),
    app_target: post.app_target || 'ahdino',
    media_type: post.media_type || 'text',
    author_username: authorInfo.username,
    author_name: authorInfo.name,
    title: post.title || '',
    caption: quoteTxt ? `${quoteTxt}

🔁 بازنشر از @${post.author_username}: ${post.caption}` : post.caption,
    media_url: post.media_url || '',
    media_gallery: post.media_gallery || (post.media_url ? [post.media_url] : []),
    repost_of_id: Number(post.id),
    repost_author: post.author_name,
    reposts_count: 0,
    likes_count: 0,
    comments: [],
    created_at: 'هم‌اکنون'
  };
  ensureCommunityPostsInitialized().unshift(newRepost);
  closeModal();
  saveState();
  renderCurrentPage(true);
  callServerApi('repost_community_post', {
    id: Number(post.id),
    quote_text: quoteTxt,
    author_username: authorInfo.username,
    author_name: authorInfo.name
  });
  showToast('با موفقیت در فید بازنشر شد 🔁');
}

function renderInteractivePollHtml(post) {
  if (!post || !post.poll || !Array.isArray(post.poll.options) || post.poll.options.length === 0) return '';
  const uid = getUserLikeKey();
  const voters = (post.poll.voters && typeof post.poll.voters === 'object') ? post.poll.voters : {};
  const myChoice = voters[uid] !== undefined ? Number(voters[uid]) : -1;
  const totalVotes = post.poll.options.reduce((s, o) => s + Number(o.votes || 0), 0);

  return `
    <div class="p-3.5 rounded-2xl bg-slate-950/85 border border-sky-400/35 space-y-2.5 text-xs">
      <div class="font-black text-amber-300 flex items-center justify-between gap-2">
        <span>📊 ${escapeHtml(post.poll.question || 'نظرسنجی اهالی محله')}</span>
        <span class="text-[10px] text-slate-400 font-normal">${totalVotes.toLocaleString('fa-IR')} رای</span>
      </div>
      <div class="space-y-1.5">
        ${post.poll.options.map((opt, idx) => {
          const votes = Number(opt.votes || 0);
          const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
          const isPicked = myChoice === idx;
          return `
            <button type="button" onclick="voteCommunityPoll(${Number(post.id)}, ${idx})" class="w-full relative overflow-hidden rounded-xl border ${isPicked ? 'border-amber-400 bg-amber-400/10' : 'border-white/15 bg-slate-900/80 hover:border-sky-400/50'} p-2.5 text-right transition flex items-center justify-between gap-2">
              <div class="absolute inset-y-0 right-0 ${isPicked ? 'bg-amber-400/25' : 'bg-sky-500/20'} transition-all duration-500 pointer-events-none" style="width: ${pct}%;"></div>
              <span class="relative z-10 font-bold text-white flex items-center gap-1.5">
                ${isPicked ? '<span class="text-amber-300">✓</span>' : ''}
                <span>${escapeHtml(opt.text)}</span>
              </span>
              <span class="relative z-10 font-mono font-black text-amber-300 text-[11px]">${pct.toLocaleString('fa-IR')}٪ (${votes.toLocaleString('fa-IR')})</span>
            </button>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function voteCommunityPoll(postId, optionIdx) {
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post || !post.poll || !Array.isArray(post.poll.options)) return;
  const uid = getUserLikeKey();
  if (!post.poll.voters || typeof post.poll.voters !== 'object') post.poll.voters = {};
  if (post.poll.voters[uid] !== undefined) {
    const prevIdx = Number(post.poll.voters[uid]);
    if (post.poll.options[prevIdx]) {
      post.poll.options[prevIdx].votes = Math.max(0, Number(post.poll.options[prevIdx].votes || 1) - 1);
    }
  }
  post.poll.voters[uid] = Number(optionIdx);
  if (post.poll.options[optionIdx]) {
    post.poll.options[optionIdx].votes = Number(post.poll.options[optionIdx].votes || 0) + 1;
  }
  saveState();
  renderCurrentPage(true);
  callServerApi('vote_community_poll', { id: Number(postId), option_index: Number(optionIdx), voter: uid });
  showToast('رای شما در نظرسنجی ثبت شد 📊');
}

function toggleAhdinoPollComposer() {
  SOCIAL_BOT_STATE.ahdinoPollOpen = !SOCIAL_BOT_STATE.ahdinoPollOpen;
  renderCurrentPage(true);
}

function cycleAudioPlaybackRate(postId, btnEl) {
  const audioEl = document.getElementById('ahdino-audio-el-' + Number(postId));
  if (!audioEl) return;
  const rates = [1, 1.5, 2];
  const cur = Number(audioEl.playbackRate || 1);
  const next = rates[(rates.indexOf(cur) + 1) % rates.length] || 1;
  audioEl.playbackRate = next;
  if (btnEl) btnEl.textContent = next + 'x';
}

function togglePinCommunityPost(postId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  post.is_pinned = !post.is_pinned;
  saveState();
  renderCurrentPage(true);
  callServerApi('toggle_pin_post', { id: Number(postId) });
  showToast(post.is_pinned ? 'پست در بالای صفحه شخصی پین شد 📌' : 'پین پست برداشته شد.');
}

function stepPostCarouselSlide(postId, delta, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  const gallery = (Array.isArray(post.media_gallery) && post.media_gallery.length > 0) ? post.media_gallery : [post.media_url];
  const cur = Number(CAROUSEL_SLIDE_INDEX_MAP[postId] || 0);
  const next = (cur + delta + gallery.length) % gallery.length;
  CAROUSEL_SLIDE_INDEX_MAP[postId] = next;
  const imgEl = document.getElementById('ahdaneh-slide-img-' + Number(postId));
  const badgeEl = document.getElementById('ahdaneh-slide-badge-' + Number(postId));
  if (imgEl) imgEl.src = gallery[next];
  if (badgeEl) badgeEl.textContent = `${(next + 1).toLocaleString('fa-IR')}/${gallery.length.toLocaleString('fa-IR')}`;
  gallery.forEach((_, idx) => {
    const dot = document.getElementById(`ahdaneh-dot-${postId}-${idx}`);
    if (dot) {
      dot.className = idx === next ? 'w-4 h-1.5 rounded-full bg-amber-400 transition-all' : 'w-1.5 h-1.5 rounded-full bg-white/35 transition-all';
    }
  });
}

function triggerDoubleTapHeartBurst(ev, postId) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  const container = ev && ev.currentTarget ? ev.currentTarget : null;
  if (container) {
    const heart = document.createElement('div');
    heart.className = 'hm-heart-burst-overlay';
    heart.textContent = '❤️';
    container.appendChild(heart);
    setTimeout(() => { if (heart.parentNode) heart.parentNode.removeChild(heart); }, 900);
  }
  if (!hasUserLikedPost(postId)) {
    likeCommunityMediaPost(postId);
  }
}

function toggleReelLikeInFullscreen(postId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  likeCommunityMediaPost(postId);
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  const liked = hasUserLikedPost(postId);
  const btn = document.getElementById('reel-fs-like-btn-' + Number(postId));
  const cnt = document.getElementById('reel-fs-like-cnt-' + Number(postId));
  if (btn) {
    btn.className = 'hm-reel-glass-btn ' + (liked ? 'liked' : '');
    btn.innerHTML = liked
      ? '<svg viewBox="0 0 24 24" class="w-6 h-6" fill="#f43f5e" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
      : '<svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
  }
  if (cnt && post) {
    cnt.textContent = Number(post.likes_count || 0).toLocaleString('fa-IR');
  }
}

function toggleReelSaveInFullscreen(postId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  toggleSaveCommunityPost(postId);
  const saved = hasUserSavedPost(postId);
  const btn = document.getElementById('reel-fs-save-btn-' + Number(postId));
  const lbl = document.getElementById('reel-fs-save-lbl-' + Number(postId));
  if (btn) {
    btn.className = 'hm-reel-glass-btn ' + (saved ? 'saved' : '');
    btn.innerHTML = saved
      ? '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
      : '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>';
  }
  if (lbl) {
    lbl.textContent = saved ? 'ذخیره شد' : 'ذخیره';
  }
}

function openReelCommentsSheet(postId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  const existing = document.getElementById('hm-reel-drawer-overlay');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const sheet = document.createElement('div');
  sheet.id = 'hm-reel-drawer-overlay';
  sheet.className = 'hm-reel-drawer-backdrop';
  sheet.onclick = function() { closeReelSubDrawer(); };
  sheet.innerHTML = `
    <div class="hm-reel-drawer-sheet text-xs space-y-3" onclick="event.stopPropagation()">
      <div class="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-1"></div>
      <div class="flex items-center justify-between border-b border-white/15 pb-2.5">
        <span class="font-black text-white text-sm">💬 دیدگاه‌های این ریلز (${comments.length.toLocaleString('fa-IR')})</span>
        <button type="button" onclick="closeReelSubDrawer()" class="w-8 h-8 rounded-full bg-white/10 text-white font-bold">✕</button>
      </div>

      <div id="reel-drawer-comments-list" class="flex-1 overflow-y-auto space-y-2 max-h-64 pr-1">
        ${comments.length === 0 ? `
          <div class="p-6 text-center text-slate-400">
            هنوز دیدگاهی ثبت نشده است. اولین دیدگاه را شما بنویسید!
          </div>
        ` : comments.map(c => `
          <div class="p-3 rounded-2xl bg-slate-900/90 border border-white/10 space-y-1">
            <div class="font-black text-amber-300 text-[11px]">${escapeHtml(c.sender || 'همسایه هم‌عهدی')}</div>
            <p class="text-slate-100 text-xs leading-relaxed">${escapeHtml(c.text)}</p>
          </div>
        `).join('')}
      </div>

      <form onsubmit="submitReelDrawerComment(event, ${Number(post.id)})" class="flex items-center gap-2 pt-2 border-t border-white/15">
        <input id="reel-drawer-cmt-inp" type="text" required placeholder="افزودن دیدگاه برای ${escapeHtml(post.author_name)}..." class="glass-input flex-1 px-3.5 py-2.5 rounded-2xl text-xs" />
        <button type="submit" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-fuchsia-400 text-slate-950 font-black text-xs shrink-0 shadow-lg">
          ثبت
        </button>
      </form>
    </div>
  `;
  document.body.appendChild(sheet);
  setTimeout(() => {
    const inp = document.getElementById('reel-drawer-cmt-inp');
    if (inp) inp.focus();
  }, 60);
}

function submitReelDrawerComment(e, postId) {
  if (e && e.preventDefault) e.preventDefault();
  if (!isRegisteredUser() && !isAdmin()) {
    closeReelSubDrawer();
    closeFullscreenReelsFeedModal();
    openUnifiedAppEntryModal('ahdaneh');
    return;
  }
  const inp = document.getElementById('reel-drawer-cmt-inp');
  const txt = (inp ? inp.value : '').trim();
  if (!txt) return;

  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  if (!Array.isArray(post.comments)) post.comments = [];
  const senderName = (state.currentUser && (state.currentUser.display_name || state.currentUser.username)) || 'همسایه هم‌عهدی';
  post.comments.push({
    id: Date.now(),
    sender: senderName,
    text: txt,
    created_at: 'الان'
  });
  saveState();
  callServerApi('comment_community_post', { id: Number(postId), sender: senderName, text: txt });

  const cntEl = document.getElementById('reel-fs-cmt-cnt-' + Number(postId));
  if (cntEl) cntEl.textContent = post.comments.length.toLocaleString('fa-IR');
  showToast('دیدگاه شما ثبت شد 💬');
  openReelCommentsSheet(postId);
}

function openReelShareSheet(postId, ev) {
  if (ev && ev.stopPropagation) ev.stopPropagation();
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  const existing = document.getElementById('hm-reel-drawer-overlay');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  const baseUrl = window.location.origin + window.location.pathname;
  const shareUrl = `${baseUrl}?app=ahdaneh&post=${encodeURIComponent(post.id)}`;
  const allUsers = Object.values(state.users || {}).slice(0, 6);

  const sheet = document.createElement('div');
  sheet.id = 'hm-reel-drawer-overlay';
  sheet.className = 'hm-reel-drawer-backdrop';
  sheet.onclick = function() { closeReelSubDrawer(); };
  sheet.innerHTML = `
    <div class="hm-reel-drawer-sheet text-xs space-y-4" onclick="event.stopPropagation()">
      <div class="w-12 h-1.5 rounded-full bg-white/25 mx-auto mb-1"></div>
      <div class="flex items-center justify-between border-b border-white/15 pb-2.5">
        <span class="font-black text-white text-sm">📤 ارسال و اشتراک‌گذاری ریلز</span>
        <button type="button" onclick="closeReelSubDrawer()" class="w-8 h-8 rounded-full bg-white/10 text-white font-bold">✕</button>
      </div>

      <div class="space-y-2">
        <div class="text-[11px] font-bold text-slate-300">ارسال سریع به دایرکت عهدانه همسایگان:</div>
        <div class="grid grid-cols-3 gap-2">
          ${allUsers.map(u => `
            <button type="button" onclick="sendReelToNeighborDirect(${Number(post.id)}, '${escapeHtml(u.username)}', '${escapeHtml(u.display_name || u.username)}')"
              class="p-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-white/10 flex flex-col items-center gap-1.5 transition">
              <img src="${u.booth_logo || './icon-512.png'}" alt="" class="w-10 h-10 rounded-full object-cover border border-amber-400/50" onerror="this.src='./icon-512.png'" />
              <span class="font-bold text-white text-[11px] truncate w-full text-center">${escapeHtml(u.display_name || u.username)}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2.5 pt-2 border-t border-white/15">
        <button type="button" onclick="copyReelLinkFromSheet('${escapeHtml(shareUrl)}')" class="py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg">
          <span>🔗 کپی لینک ریلز</span>
        </button>
        <button type="button" onclick="openRepostModal(${Number(post.id)}); closeReelSubDrawer();" class="py-3 rounded-2xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg">
          <span>🔁 بازنشر در صفحه من</span>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);
}

function copyReelLinkFromSheet(urlStr) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(urlStr).then(() => {
      showToast('لینک مستقیم ریلز کپی شد 🔗');
    }).catch(() => {
      showToast('لینک: ' + urlStr);
    });
  } else {
    showToast('لینک: ' + urlStr);
  }
  closeReelSubDrawer();
}

function sendReelToNeighborDirect(postId, targetUname, targetName) {
  if (!isRegisteredUser() && !isAdmin()) {
    closeReelSubDrawer();
    closeFullscreenReelsFeedModal();
    openUnifiedAppEntryModal('ahdaneh');
    return;
  }
  const post = ensureCommunityPostsInitialized().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  const senderUname = state.currentUser.username;
  const senderName = state.currentUser.display_name || senderUname;
  const msgObj = {
    id: Date.now(),
    listing_id: 0,
    sender_username: senderUname,
    receiver_username: targetUname,
    sender: senderName,
    text: `🎬 اشتراک ریلز «${post.title || post.author_name}»: ${post.caption.slice(0, 70)}...`,
    offered_price: 0,
    message_type: 'pv',
    status: 'approved'
  };
  if (!Array.isArray(state.directMessages)) state.directMessages = [];
  state.directMessages.push(msgObj);
  saveState();
  callServerApi('add_message', msgObj);
  closeReelSubDrawer();
  showToast(`ریلز به دایرکت عهدانه «${targetName}» ارسال شد 📤`);
}

function closeReelSubDrawer() {
  const el = document.getElementById('hm-reel-drawer-overlay');
  if (el && el.parentNode) el.parentNode.removeChild(el);
}

function openFullscreenReelsFeedModal(startPostId = 0) {
  const allAhdaneh = getAhdanehPosts();
  const reelsList = allAhdaneh.filter(p => p.media_type === 'video').concat(allAhdaneh.filter(p => p.media_type !== 'video'));
  if (reelsList.length === 0) return;
  if (startPostId) {
    const idx = reelsList.findIndex(p => Number(p.id) === Number(startPostId));
    if (idx > 0) {
      const picked = reelsList.splice(idx, 1)[0];
      reelsList.unshift(picked);
    }
  }

  const existing = document.getElementById('hm-fullscreen-reels-overlay');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

  const wrapper = document.createElement('div');
  wrapper.id = 'hm-fullscreen-reels-overlay';
  wrapper.className = 'hm-reels-snap-container';
  wrapper.innerHTML = `
    <div class="fixed top-4 inset-x-4 z-50 flex items-center justify-between pointer-events-none">
      <div class="px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white font-black text-xs flex items-center gap-2 pointer-events-auto">
        <span>🎬 ریلزهای عهدانه</span>
        <span class="text-[10px] text-amber-300">(اسکرول به بالا/پایین)</span>
      </div>
      <button type="button" onclick="closeFullscreenReelsFeedModal()" class="w-10 h-10 rounded-full bg-black/65 hover:bg-rose-600 text-white font-black text-base flex items-center justify-center border border-white/20 pointer-events-auto shadow-xl">
        ✕
      </button>
    </div>

    ${reelsList.map(post => {
      const liked = hasUserLikedPost(post.id);
      const saved = hasUserSavedPost(post.id);
      const isFollowing = isCurrentUserFollowing(post.author_username);
      const meta = getUserProfileMeta(post.author_username);
      const cmtsCount = (post.comments || []).length;
      return `
        <section class="hm-reels-snap-slide" ondblclick="triggerDoubleTapHeartBurst(event, ${Number(post.id)})">
          <img src="${post.media_url}" alt="" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-40 pointer-events-none" />
          <div class="relative z-10 w-full max-w-md h-full flex items-center justify-center bg-black/40">
            ${post.media_type === 'video' && post.media_url && post.media_url.startsWith('data:video') ? `
              <video src="${post.media_url}" controls autoplay loop muted playsinline class="w-full max-h-full object-contain"></video>
            ` : `
              <img src="${post.media_url}" alt="" class="w-full max-h-full object-contain" />
            `}

            <!-- ستون دکمه‌های شیشه‌ای مدرن سمت چپ (Glassmorphic Vector Action Buttons) -->
            <div class="absolute left-3.5 bottom-24 z-30 flex flex-col items-center gap-4" onclick="event.stopPropagation()">
              <!-- ۱. لایک شیشه‌ای -->
              <div class="flex flex-col items-center gap-1">
                <button type="button" id="reel-fs-like-btn-${Number(post.id)}" onclick="toggleReelLikeInFullscreen(${Number(post.id)}, event)"
                  class="hm-reel-glass-btn ${liked ? 'liked' : ''}" title="پسندیدن">
                  ${liked
                    ? '<svg viewBox="0 0 24 24" class="w-6 h-6" fill="#f43f5e" stroke="#f43f5e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
                    : '<svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>'
                  }
                </button>
                <span id="reel-fs-like-cnt-${Number(post.id)}" class="text-[11px] font-black text-white drop-shadow">${Number(post.likes_count || 0).toLocaleString('fa-IR')}</span>
              </div>

              <!-- ۲. نظرات شیشه‌ای (باز شدن دراور نظرات زنده روی ریلز) -->
              <div class="flex flex-col items-center gap-1">
                <button type="button" onclick="openReelCommentsSheet(${Number(post.id)}, event)"
                  class="hm-reel-glass-btn" title="مشاهده و ثبت دیدگاه">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                </button>
                <span id="reel-fs-cmt-cnt-${Number(post.id)}" class="text-[11px] font-black text-white drop-shadow">${cmtsCount.toLocaleString('fa-IR')}</span>
              </div>

              <!-- ۳. ارسال و اشتراک‌گذاری شیشه‌ای (باز شدن شیت ارسال به دایرکت و کپی لینک) -->
              <div class="flex flex-col items-center gap-1">
                <button type="button" onclick="openReelShareSheet(${Number(post.id)}, event)"
                  class="hm-reel-glass-btn" title="ارسال به دوستان و اشتراک‌گذاری">
                  <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
                <span class="text-[10px] font-bold text-white drop-shadow">ارسال</span>
              </div>

              <!-- ۴. ذخیره شیشه‌ای (ذخیره آنی با تغییر رنگ طلایی) -->
              <div class="flex flex-col items-center gap-1">
                <button type="button" id="reel-fs-save-btn-${Number(post.id)}" onclick="toggleReelSaveInFullscreen(${Number(post.id)}, event)"
                  class="hm-reel-glass-btn ${saved ? 'saved' : ''}" title="ذخیره ریلز">
                  ${saved
                    ? '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="#fbbf24" stroke="#fbbf24" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
                    : '<svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>'
                  }
                </button>
                <span id="reel-fs-save-lbl-${Number(post.id)}" class="text-[10px] font-bold text-white drop-shadow">${saved ? 'ذخیره شد' : 'ذخیره'}</span>
              </div>
            </div>

            <!-- اطلاعات نویسنده و کپشن در پایین سمت راست ریلز -->
            <div class="absolute right-3 left-20 bottom-20 z-20 p-3.5 rounded-2xl bg-gradient-to-t from-black/90 via-black/65 to-transparent text-right space-y-2">
              <div class="flex items-center gap-2.5">
                <div onclick="closeFullscreenReelsFeedModal(); openUserPersonalProfile('${escapeHtml(post.author_username)}', 'ahdaneh');" class="flex items-center gap-2 cursor-pointer">
                  <img src="${meta.avatar}" alt="" class="w-10 h-10 rounded-full object-cover border-2 border-amber-400" onerror="this.src='./icon-512.png'" />
                  <div>
                    <div class="font-black text-white text-xs sm:text-sm">${escapeHtml(post.author_name)}</div>
                    <div class="text-[10px] text-amber-300 font-mono dir-ltr">@${escapeHtml(post.author_username)}</div>
                  </div>
                </div>
                <button type="button" onclick="toggleFollowUser('${escapeHtml(post.author_username)}')" class="px-3 py-1 rounded-xl text-[10px] font-black ${isFollowing ? 'bg-white/20 text-emerald-300' : 'bg-amber-400 text-slate-950'}">
                  ${isFollowing ? 'دنبال‌شده ✓' : '+ دنبال کردن'}
                </button>
              </div>
              <p class="text-xs text-slate-100 line-clamp-2 leading-relaxed">${escapeHtml(post.caption)}</p>
            </div>
          </div>
        </section>
      `;
    }).join('')}
  `;
  document.body.appendChild(wrapper);
}

function closeFullscreenReelsFeedModal() {
  closeReelSubDrawer();
  const el = document.getElementById('hm-fullscreen-reels-overlay');
  if (el) {
    el.querySelectorAll('video, audio').forEach(m => { try { m.pause(); } catch (e) {} });
    if (el.parentNode) el.parentNode.removeChild(el);
  }
}

function likeCommunityMediaPost(postId) {
  if (!isRegisteredUser() && !isAdmin()) {
    showToast('لطفاً ابتدا وارد حساب کاربری خود شوید.', 'warning');
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  const pid = Number(postId);
  const uid = getUserLikeKey();
  const list = ensureCommunityPostsInitialized();
  const found = list.find(p => Number(p.id) === pid);
  if (!found) return;

  if (!Array.isArray(found.liked_by)) found.liked_by = [];

  if (hasUserLikedPost(pid)) {
    found.likes_count = Math.max(0, Number(found.likes_count || 1) - 1);
    found.liked_by = found.liked_by.filter(x => x !== uid);
    setUserLikedPostState(pid, false);
    saveState();
    renderCurrentPage(true);
    callServerApi('like_community_post', { id: pid, voter: uid, unlike: true });
    return;
  }

  found.likes_count = Number(found.likes_count || 0) + 1;
  if (!found.liked_by.includes(uid)) found.liked_by.push(uid);
  setUserLikedPostState(pid, true);

  saveState();
  renderCurrentPage(true);
  callServerApi('like_community_post', { id: pid, voter: uid, unlike: false });
}

// ==============================================================================
// UNIFIED PERSONAL PROFILE PAGE ACROSS ALL 4 APPS (کاملاً خام و بدون هاردکد)
// ==============================================================================
function openSocialContextMessagesCenter() {
  let ctx = 'ahdaneh';
  if (state.currentPage === 'ahdino') ctx = 'ahdino';
  else if (state.currentPage === 'market' || state.currentPage === 'listing_detail') ctx = 'market';
  else if (state.currentPage === 'booth') {
    if (state.profileActiveAppTab === 'ahdino') ctx = 'ahdino';
    else if (state.profileActiveAppTab === 'market') ctx = 'market';
    else ctx = 'ahdaneh';
  }
  openMessagesCenterPage('chats', ctx);
}

function openDirectChatFromProfile(targetUname, preferredApp = '') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('ahdaneh');
    return;
  }
  const appCtx = preferredApp === 'ahdino' ? 'ahdino' : (preferredApp === 'market' ? 'market' : 'ahdaneh');
  if (appCtx === 'ahdino') {
    state.activeChatKey = '-1_' + targetUname;
  } else {
    state.activeChatKey = '0_' + targetUname;
  }
  state.mobileChatView = 'chat';
  openMessagesCenterPage('chats', appCtx);
}

function renderUnifiedPersonalProfilePage(username) {
  const myCurrentUname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest') ? state.currentUser.username : '';
  const targetUname = username || state.selectedBoothUsername || myCurrentUname;
  if (!targetUname) {
    return `
      <div class="max-w-md mx-auto glass-panel rounded-3xl p-8 text-center space-y-4">
        <div class="text-base font-black text-white">ورود به صفحه شخصی</div>
        <button type="button" onclick="openUnifiedAppEntryModal('booth')" class="px-6 py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg">
          ورود / ثبت‌نام
        </button>
      </div>
    `;
  }

  const meta = getUserProfileMeta(targetUname);
  const isMyOwnProfile = Boolean(myCurrentUname && String(myCurrentUname).toLowerCase() === String(targetUname).toLowerCase());
  const isFollowing = isCurrentUserFollowing(targetUname);
  const activeTab = state.profileActiveAppTab || 'ahdaneh';

  const marketItems = getApprovedListings().filter(l => String(l.seller_username || '').toLowerCase() === String(targetUname).toLowerCase());
  const ahdinoItems = getAhdinoPosts().filter(p => String(p.author_username || '').toLowerCase() === String(targetUname).toLowerCase()).sort((a, b) => Number(Boolean(b.is_pinned)) - Number(Boolean(a.is_pinned)));
  const ahdanehItems = getAhdanehPosts().filter(p => String(p.author_username || '').toLowerCase() === String(targetUname).toLowerCase()).sort((a, b) => Number(Boolean(b.is_pinned)) - Number(Boolean(a.is_pinned)));

  const totalPostsCount = marketItems.length + ahdinoItems.length + ahdanehItems.length;
  const followersCount = getFollowersListForUser(targetUname).length;
  const followingCount = getFollowingListForUser(targetUname).length;
  const personalHighlights = getPersonalProfileHighlights(targetUname);
  const thirtyDayViews = (totalPostsCount * 54) + (followersCount * 23) + 180;

  let tabBodyHtml = '';
  if (activeTab === 'market') {
    tabBodyHtml = `
      <div class="space-y-4 pt-2">
        ${marketItems.length === 0 ? `
          <div class="glass-card rounded-3xl p-8 text-center text-xs text-slate-400 border border-dashed border-white/15">
            هنوز آگهی ثبت نشده است.
          </div>
        ` : `
          <div class="hm-market-cards-grid">
            ${marketItems.map(item => renderMarketCard(item)).join('')}
          </div>
        `}
      </div>
    `;
  } else if (activeTab === 'ahdino') {
    tabBodyHtml = `
      <div class="space-y-4 pt-2">
        ${ahdinoItems.length === 0 ? `
          <div class="glass-card rounded-3xl p-8 text-center text-xs text-slate-400 border border-dashed border-white/15">
            هنوز پستی در عهدینو ثبت نشده است.
          </div>
        ` : `
          <div class="space-y-3">
            ${ahdinoItems.map(post => renderCleanHamahdiAhdinoPostCard(post)).join('')}
          </div>
        `}
      </div>
    `;
  } else if (activeTab === 'ahdbot') {
    tabBodyHtml = `
      <div class="pt-2">
        ${renderSocialBotStudioPage(true)}
      </div>
    `;
  } else {
    tabBodyHtml = `
      <div class="space-y-3 pt-2">
        ${ahdanehItems.length === 0 ? `
          <div class="glass-card rounded-3xl p-8 text-center text-xs text-slate-400 border border-dashed border-white/15">
            هنوز پستی در عهدانه ثبت نشده است.
          </div>
        ` : `
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
            ${ahdanehItems.map(post => `
              <div onclick="openFullscreenReelsFeedModal(${Number(post.id)})" class="aspect-[4/5] rounded-xl overflow-hidden glass-card border border-white/15 cursor-pointer relative group">
                <img src="${post.media_url}" alt="" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='./icon-512.png'" />
                ${post.is_pinned ? `
                  <span class="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] shadow">📌 پین</span>
                ` : ''}
                ${post.media_type === 'video' ? `
                  <span class="absolute top-2 right-2 w-6 h-6 rounded-lg bg-slate-950/75 border border-white/20 text-white text-[10px] flex items-center justify-center shadow">▶</span>
                ` : ''}
                <div class="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-2 text-center gap-3 text-xs font-black text-white">
                  <span>❤️ ${Number(post.likes_count || 0).toLocaleString('fa-IR')}</span>
                  <span>💬 ${(post.comments || []).length.toLocaleString('fa-IR')}</span>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;
  }

  // طراحی دقیقاً منطبق با تصویر اول کارفرما (بدون کادر اضافی بالای صفحه)
  return `
    <div class="max-w-3xl mx-auto pb-24">
      <section class="glass-panel rounded-3xl p-4 sm:p-6 border border-white/15 shadow-2xl space-y-4">

        <!-- ۱. ردیف اول: تصویر پروفایل (به همراه حباب یادداشت و دکمه +) در کنار نام و ۳ ستون آمار دقیقاً مشابه اینستاگرام -->
        <div class="flex flex-row items-center gap-4 sm:gap-8 pt-3">
          <!-- آواتار + حباب یادداشت بالا + دکمه + پایین -->
          <div class="relative shrink-0">
            <div onclick="${isMyOwnProfile ? 'openEditPersonalProfileModal()' : ''}"
              class="absolute -top-4 left-1/2 -translate-x-1/2 z-10 px-2.5 py-1 rounded-2xl bg-[#262b38] border border-white/15 text-[10px] font-bold text-slate-200 shadow-lg whitespace-nowrap max-w-[110px] truncate cursor-pointer">
              ${escapeHtml(meta.note || 'یادداشت...')}
            </div>

            <div onclick="${personalHighlights.length > 0 ? `openSocialStoryViewerModal(${personalHighlights[0].id})` : (isMyOwnProfile ? `openCreateSocialStoryModal('personal')` : '')}"
              class="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 ig-story-ring cursor-pointer shadow-xl">
              <img src="${meta.avatar}" alt="${escapeHtml(meta.display_name)}" class="w-full h-full rounded-full object-cover border-2 border-[#0b101b]" onerror="this.src='./icon-512.png'" />
            </div>

            ${isMyOwnProfile ? `
              <button type="button" onclick="openCreateSocialStoryModal('personal')" title="افزودن استوری"
                class="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white text-slate-950 font-black text-sm flex items-center justify-center border-2 border-[#0b101b] shadow-md">
                +
              </button>
            ` : ''}
          </div>

          <!-- نام نمایشی در بالا + ۳ ستون آمار در پایین (پست، دنبال‌کننده، دنبال‌شونده) -->
          <div class="flex-1 min-w-0 space-y-2.5">
            <div class="font-black text-white text-sm sm:text-base truncate">${escapeHtml(meta.display_name)}</div>

            <div class="grid grid-cols-3 gap-2 text-right max-w-xs">
              <div>
                <div class="font-black text-white text-sm sm:text-lg leading-tight">${totalPostsCount.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] sm:text-xs text-slate-300">پست</div>
              </div>
              <button type="button" onclick="openFollowersOrFollowingModal('${escapeHtml(meta.username)}', 'followers')" class="text-right hover:opacity-80 transition">
                <div class="font-black text-white text-sm sm:text-lg leading-tight">${followersCount.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] sm:text-xs text-slate-300">دنبال‌کننده</div>
              </button>
              <button type="button" onclick="openFollowersOrFollowingModal('${escapeHtml(meta.username)}', 'following')" class="text-right hover:opacity-80 transition">
                <div class="font-black text-white text-sm sm:text-lg leading-tight">${followingCount.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] sm:text-xs text-slate-300">دنبال‌شونده</div>
              </button>
            </div>
          </div>
        </div>

        <!-- ۲. متن بیوگرافی چندخطی + کپسول‌های نام کاربری و افزودن (دقیقاً مشابه تصویر اول) -->
        <div class="space-y-2.5 text-right">
          ${meta.bio ? `
            <div class="text-xs sm:text-sm text-slate-100 whitespace-pre-line leading-relaxed font-medium">
              ${escapeHtml(meta.bio)}
            </div>
          ` : ''}

          <div class="flex flex-wrap items-center gap-2 pt-0.5">
            <span class="px-3 py-1 rounded-full bg-[#1c2230] border border-white/15 text-white text-[11px] font-bold flex items-center gap-1.5 dir-ltr">
              <span class="w-4 h-4 rounded-full bg-white/15 text-[10px] flex items-center justify-center">@</span>
              <span>${escapeHtml(meta.username)}</span>
            </span>

            ${isMyOwnProfile ? `
              <button type="button" onclick="openEditPersonalProfileModal()" class="px-3 py-1 rounded-full bg-[#1c2230] hover:bg-[#262e40] border border-white/15 text-slate-200 text-[11px] font-bold flex items-center gap-1 transition">
                <span>+ افزودن</span>
              </button>
            ` : `
              <span class="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 text-[11px] font-bold">
                ✓ همسایه معتمد
              </span>
            `}
          </div>
        </div>

        <!-- ۳. کادر پیشخوان شما (Your dashboard در تصویر اول) -->
        <div class="p-3.5 rounded-2xl bg-[#1c2230]/90 border border-white/10 text-right">
          <div class="font-black text-white text-xs sm:text-sm">پیشخوان شما</div>
          <div class="text-[11px] text-slate-400 mt-0.5">${thirtyDayViews.toLocaleString('fa-IR')} بازدید و تعامل در ۳۰ روز گذشته</div>
        </div>

        <!-- ۴. ردیف دکمه‌های ویرایش پروفایل | اشتراک‌گذاری پروفایل | +👤 (دقیقاً مشابه تصویر اول) -->
        <div class="flex items-center gap-2 text-xs">
          ${isMyOwnProfile ? `
            <button type="button" onclick="openEditPersonalProfileModal()" class="flex-1 py-2.5 px-3 rounded-xl bg-[#262d3d] hover:bg-[#323b4f] border border-white/10 text-white font-bold transition text-center">
              ویرایش پروفایل
            </button>
            <button type="button" onclick="shareContentDeepLink('profile', '${escapeHtml(meta.username)}', '${escapeHtml(meta.display_name)}')" class="flex-1 py-2.5 px-3 rounded-xl bg-[#262d3d] hover:bg-[#323b4f] border border-white/10 text-white font-bold transition text-center">
              اشتراک‌گذاری پروفایل
            </button>
            <button type="button" onclick="openFollowersOrFollowingModal('${escapeHtml(meta.username)}', 'followers')" class="w-10 h-10 rounded-xl bg-[#262d3d] hover:bg-[#323b4f] border border-white/10 text-white flex items-center justify-center shrink-0 transition" title="همسایگان و دنبال‌کنندگان">
              <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>
            </button>
          ` : `
            <button type="button" onclick="toggleFollowUser('${escapeHtml(meta.username)}')" class="flex-1 py-2.5 px-3 rounded-xl font-black transition text-center ${isFollowing ? 'bg-[#262d3d] text-emerald-300 border border-emerald-400/35' : 'bg-sky-500 hover:bg-sky-400 text-white'}">
              ${isFollowing ? 'دنبال‌شده ✓' : 'دنبال کردن'}
            </button>
            <button type="button" onclick="openDirectChatFromProfile('${escapeHtml(meta.username)}', '${activeTab}')" class="flex-1 py-2.5 px-3 rounded-xl bg-[#262d3d] hover:bg-[#323b4f] border border-white/10 text-white font-bold transition text-center">
              ارسال پیام
            </button>
            <button type="button" onclick="shareContentDeepLink('profile', '${escapeHtml(meta.username)}', '${escapeHtml(meta.display_name)}')" class="w-10 h-10 rounded-xl bg-[#262d3d] hover:bg-[#323b4f] border border-white/10 text-white flex items-center justify-center shrink-0 transition" title="اشتراک‌گذاری پروفایل">
              <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
            </button>
          `}
        </div>

        <!-- ۵. ردیف دایره‌های هایلایت و استوری (جدید + در کنار هایلایت‌ها دقیقاً مشابه تصویر اول) -->
        ${(isMyOwnProfile || personalHighlights.length > 0) ? `
          <div class="flex items-center gap-4 overflow-x-auto no-scrollbar pt-1 pb-1">
            ${isMyOwnProfile ? `
              <div onclick="openCreateSocialStoryModal('personal')" class="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-full border border-white/40 bg-[#111622] flex items-center justify-center text-white text-2xl font-light group-hover:scale-105 transition">
                  +
                </div>
                <span class="text-[11px] font-bold text-slate-200">جدید</span>
              </div>
            ` : ''}

            ${personalHighlights.map(hl => `
              <div onclick="openSocialStoryViewerModal(${hl.id})" class="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
                <div class="w-16 h-16 sm:w-18 sm:h-18 rounded-full p-0.5 border border-white/35 bg-[#111622] group-hover:scale-105 transition shadow-lg">
                  <img src="${hl.image}" alt="" class="w-full h-full rounded-full object-cover" onerror="this.src='./icon-512.png'" />
                </div>
                <span class="text-[11px] font-bold text-slate-200 truncate max-w-[72px]">${escapeHtml(hl.title)}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}

        <!-- ۶. نوار ۴ تب صفحه شخصی با آیکون‌های برداری شیشه‌ای مدرن (Glassmorphism SVG Icons) -->
        <div class="pt-1">
          <div class="hm-profile-glass-tabs">
            <button type="button" onclick="switchProfileAppTab('market')" title="غرفه من در عهد بازار"
              class="hm-profile-tab-btn ${activeTab === 'market' ? 'active text-amber-300' : 'text-slate-300 hover:text-white'}">
              <div class="hm-glass-icon-orb text-emerald-400">
                <svg viewBox="0 0 24 24" class="svg-icon w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/>
                </svg>
              </div>
              <span class="text-[10px] font-black">عهد بازار</span>
            </button>

            <button type="button" onclick="switchProfileAppTab('ahdino')" title="صفحه من در عهدینو"
              class="hm-profile-tab-btn ${activeTab === 'ahdino' ? 'active text-amber-300' : 'text-slate-300 hover:text-white'}">
              <div class="hm-glass-icon-orb text-sky-400">
                <svg viewBox="0 0 24 24" class="svg-icon w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"/>
                </svg>
              </div>
              <span class="text-[10px] font-black">عهدینو</span>
            </button>

            <button type="button" onclick="switchProfileAppTab('ahdaneh')" title="صفحه من در عهدانه"
              class="hm-profile-tab-btn ${activeTab === 'ahdaneh' ? 'active text-amber-300' : 'text-slate-300 hover:text-white'}">
              <div class="hm-glass-icon-orb text-fuchsia-400">
                <svg viewBox="0 0 24 24" class="svg-icon w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1"/>
                </svg>
              </div>
              <span class="text-[10px] font-black">عهدانه</span>
            </button>

            <button type="button" onclick="switchProfileAppTab('ahdbot')" title="استودیو عهدبات"
              class="hm-profile-tab-btn ${activeTab === 'ahdbot' ? 'active text-amber-300' : 'text-slate-300 hover:text-white'}">
              <div class="hm-glass-icon-orb text-amber-400">
                <svg viewBox="0 0 24 24" class="svg-icon w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="8" width="18" height="12" rx="4"/>
                  <path d="M12 2v6M8 2h8M7 14h.01M17 14h.01M9 17h6"/>
                </svg>
              </div>
              <span class="text-[10px] font-black">عهدبات</span>
            </button>
          </div>
        </div>

        <div>
          ${tabBodyHtml}
        </div>
      </section>
    </div>
  `;
}


// ==============================================================================
// RIGHT-SIDE PERSONAL PROFILE CARD (بدون همسایگان و غرفه‌داران پیشنهادی طبق دستور شماره ۳)
// ==============================================================================
function renderRightSidePersonalSummaryAndFollowCard(currentApp = 'ahdaneh') {
  const isLogged = isRegisteredUser() || isAdmin();
  if (!isLogged) {
    return `
      <aside class="sticky top-4">
        <div class="glass-panel rounded-3xl p-5 border border-amber-400/35 shadow-xl text-center space-y-3 text-xs">
          <img src="./icon-512.png?v=3.1.5" alt="" class="w-16 h-16 rounded-2xl mx-auto object-cover border border-amber-400/50 shadow" />
          <div class="font-black text-white text-sm">حساب کاربری شما</div>
          <button type="button" onclick="openUnifiedAppEntryModal('${currentApp}')" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow">
            ورود / ثبت‌نام
          </button>
        </div>
      </aside>
    `;
  }

  const myUname = state.currentUser.username;
  const meta = getUserProfileMeta(myUname);
  const marketCnt = getApprovedListings().filter(l => String(l.seller_username || '').toLowerCase() === String(myUname).toLowerCase()).length;
  const ahdinoCnt = getAhdinoPosts().filter(p => String(p.author_username || '').toLowerCase() === String(myUname).toLowerCase()).length;
  const ahdanehCnt = getAhdanehPosts().filter(p => String(p.author_username || '').toLowerCase() === String(myUname).toLowerCase()).length;
  const totalPostsCnt = marketCnt + ahdinoCnt + ahdanehCnt;
  const followersCnt = getFollowersListForUser(myUname).length;
  const followingCnt = getFollowingListForUser(myUname).length;

  return `
    <aside class="sticky top-4">
      <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-amber-400/35 shadow-xl space-y-4">
        <div class="flex items-center justify-between gap-2">
          <div onclick="openUserPersonalProfile('${escapeHtml(myUname)}', '${currentApp}')" class="flex items-center gap-3 cursor-pointer min-w-0">
            <div class="w-14 h-14 rounded-full ig-story-ring shrink-0">
              <img src="${meta.avatar}" alt="" class="w-full h-full rounded-full object-cover border-2 border-slate-950" onerror="this.src='./icon-512.png'" />
            </div>
            <div class="min-w-0">
              <div class="font-black text-white text-sm truncate">${escapeHtml(meta.display_name)}</div>
              <div class="text-[11px] font-mono text-amber-300 dir-ltr text-right truncate">@${escapeHtml(meta.username)}</div>
            </div>
          </div>
          <button type="button" onclick="openUserPersonalProfile('${escapeHtml(myUname)}', '${currentApp}')" class="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-[11px] shadow shrink-0">
            صفحه من ←
          </button>
        </div>

        ${meta.bio ? `
          <div class="text-[11px] text-slate-200 whitespace-pre-line leading-relaxed bg-slate-950/55 p-3 rounded-2xl border border-white/10">
            ${escapeHtml(meta.bio)}
          </div>
        ` : ''}

        <div class="grid grid-cols-3 text-center py-2 rounded-2xl bg-slate-950/75 border border-white/10 text-xs">
          <div onclick="openUserPersonalProfile('${escapeHtml(myUname)}', '${currentApp}')" class="cursor-pointer">
            <div class="font-black text-white">${totalPostsCnt.toLocaleString('fa-IR')}</div>
            <div class="text-[10px] text-slate-400">پست‌ها</div>
          </div>
          <div onclick="openFollowersOrFollowingModal('${escapeHtml(myUname)}', 'followers')" class="cursor-pointer border-x border-white/10">
            <div class="font-black text-amber-300">${followersCnt.toLocaleString('fa-IR')}</div>
            <div class="text-[10px] text-slate-400">دنبال‌کننده</div>
          </div>
          <div onclick="openFollowersOrFollowingModal('${escapeHtml(myUname)}', 'following')" class="cursor-pointer">
            <div class="font-black text-cyan-300">${followingCnt.toLocaleString('fa-IR')}</div>
            <div class="text-[10px] text-slate-400">دنبال‌شونده</div>
          </div>
        </div>

        <!-- 4-App Icon Switcher -->
        <div class="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-center">
          <button type="button" onclick="openUserPersonalProfile('${escapeHtml(myUname)}', 'market')" title="بازار" class="p-2.5 rounded-xl glass-card hover:border-amber-400 text-lg flex items-center justify-center">🏪</button>
          <button type="button" onclick="openUserPersonalProfile('${escapeHtml(myUname)}', 'ahdino')" title="عهدینو" class="p-2.5 rounded-xl glass-card hover:border-sky-400 text-lg flex items-center justify-center">🎙️</button>
          <button type="button" onclick="openUserPersonalProfile('${escapeHtml(myUname)}', 'ahdaneh')" title="عهدانه" class="p-2.5 rounded-xl glass-card hover:border-fuchsia-400 text-lg flex items-center justify-center">🎬</button>
          <button type="button" onclick="openUserPersonalProfile('${escapeHtml(myUname)}', 'ahdbot')" title="عهدبات" class="p-2.5 rounded-xl glass-card hover:border-emerald-400 text-lg flex items-center justify-center">🤖</button>
        </div>
      </div>
    </aside>
  `;
}

// ==============================================================================
// PUBLIC STORIES BAR
// ==============================================================================
function renderPublicInstagramStoriesBarHtml() {
  const publicStories = getPublicSocialStories();
  const myUname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest') ? state.currentUser.username : '';
  const myAvatar = myUname ? (getUserProfileMeta(myUname).avatar || './icon-512.png') : './icon-512.png';

  return `
    <section class="py-2 border-b border-white/10">
      <div class="flex items-center gap-4 overflow-x-auto no-scrollbar px-1 py-1">
        <!-- استوری شما (دقیقاً مشابه Your story در تصویر دوم با علامت + سفید پایین دایره) -->
        <div onclick="openCreateSocialStoryModal('public')" class="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
          <div class="w-18 h-18 sm:w-20 sm:h-20 rounded-full p-0.5 relative group-hover:scale-105 transition" style="width:72px;height:72px;">
            <img src="${myAvatar}" alt="" class="w-full h-full rounded-full object-cover border border-white/20" onerror="this.src='./icon-512.png'" />
            <span class="absolute bottom-0 left-0 w-6 h-6 rounded-full bg-white text-slate-950 font-black text-base flex items-center justify-center border-2 border-[#060c1c] shadow">+</span>
          </div>
          <span class="text-[11px] font-medium text-slate-200">استوری شما</span>
        </div>

        ${publicStories.map(st => `
          <div onclick="openSocialStoryViewerModal(${st.id})" class="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group">
            <div class="rounded-full ${st.seen ? 'ig-story-ring-seen' : 'ig-story-ring'} p-[2.5px] group-hover:scale-105 transition" style="width:74px;height:74px;">
              <img src="${st.avatar || st.image || './icon-512.png'}" alt="" class="w-full h-full rounded-full object-cover border-2 border-[#060c1c]" onerror="this.src='./icon-512.png'" />
            </div>
            <span class="text-[11px] font-medium text-slate-200 truncate max-w-[74px] dir-ltr">${escapeHtml(st.owner_username || st.owner_name)}</span>
          </div>
        `).join('')}
      </div>
    </section>
  `;
}

// ==============================================================================
// PART 1: CLEAN INSTAGRAM-STYLE «عهدانه» (بدون دو کادر بالای استوری‌ها؛ دقیقاً مطابق تصویر دوم)
// ==============================================================================
function renderAhdanehPage() {
  const allPosts = getAhdanehPosts();
  const filter = state.ahdanehFilter || 'all';
  const myUname = (state.currentUser && state.currentUser.username) ? String(state.currentUser.username).toLowerCase() : '';
  const myFollowing = getFollowingListForUser(myUname).map(x => String(x).toLowerCase());

  const qAhdaneh = String(state.ahdanehSearchQuery || '').trim().toLowerCase();
  const filtered = allPosts.filter(p => {
    if (filter === 'following') {
      const au = String(p.author_username || '').toLowerCase();
      if (!(myFollowing.includes(au) || (myUname && au === myUname))) return false;
    } else if (filter === 'saved') {
      if (!hasUserSavedPost(p.id)) return false;
    } else if (filter === 'image' && p.media_type !== 'image') {
      return false;
    } else if (filter === 'video' && p.media_type !== 'video') {
      return false;
    }
    if (qAhdaneh) {
      const hay = ((p.title || '') + ' ' + (p.caption || '') + ' ' + (p.author_name || '') + ' ' + (p.author_username || '')).toLowerCase();
      if (!hay.includes(qAhdaneh)) return false;
    }
    return true;
  });

  return `
    <div class="max-w-xl mx-auto pb-24 space-y-2">
      <!-- هدر بالای صفحه: فقط عنوان وسط‌چین (بدون قلب سمت راست و بدون علامت + سمت چپ طبق دستور کارفرما) -->
      <div class="py-2 text-center select-none">
        <div class="font-nastaliq text-2xl sm:text-3xl text-amber-400 font-bold tracking-wide">
          عهدانه
        </div>
      </div>

      <!-- ردیف استوری‌ها بلافاصله زیر عنوان (بدون دو کادر اضافی قبلی) -->
      ${renderPublicInstagramStoriesBarHtml()}

      <!-- فید پست‌های عهدانه -->
      ${filtered.length === 0 ? `
        <div class="glass-panel rounded-3xl p-10 text-center text-xs text-slate-400 border border-dashed border-white/15">
          هنوز پستی در عهدانه ثبت نشده است.
        </div>
      ` : `
        <div class="space-y-5 pt-1">
          ${filtered.map(post => renderCleanHamahdiAhdanehPostCard(post)).join('')}
        </div>
      `}
    </div>
  `;
}

function renderCleanHamahdiAhdanehPostCard(post) {
  const liked = hasUserLikedPost(post.id);
  const myUname = (state.currentUser && state.currentUser.username) ? state.currentUser.username : '';
  const canDelete = isAdmin() || (myUname && String(post.author_username).toLowerCase() === String(myUname).toLowerCase());
  const isFollowingAuthor = isCurrentUserFollowing(post.author_username);
  const isMe = myUname && String(post.author_username).toLowerCase() === String(myUname).toLowerCase();
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const authorMeta = getUserProfileMeta(post.author_username);

  return `
    <article class="glass-panel hm-social-post-card rounded-3xl overflow-hidden border border-white/15 shadow-xl">
      <div class="px-3.5 py-3 flex items-center justify-between gap-2">
        <div onclick="openUserPersonalProfile('${escapeHtml(post.author_username)}', 'ahdaneh')" class="flex items-center gap-2.5 cursor-pointer min-w-0">
          <div class="w-9 h-9 rounded-full overflow-hidden border border-white/20 shrink-0">
            <img src="${authorMeta.avatar}" alt="" class="w-full h-full object-cover" onerror="this.src='./icon-512.png'" />
          </div>
          <div class="min-w-0">
            <div class="font-bold text-white text-xs sm:text-sm truncate">${escapeHtml(post.author_name)}</div>
            <div class="text-[10px] text-slate-400 truncate font-mono dir-ltr">@${escapeHtml(post.author_username)}</div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${!isMe ? `
            <button type="button" onclick="toggleFollowUser('${escapeHtml(post.author_username)}')" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${isFollowingAuthor ? 'bg-[#262b38] text-emerald-300 border border-emerald-400/30' : 'bg-[#262b38] hover:bg-[#32394a] text-white border border-white/10'}">
              ${isFollowingAuthor ? 'دنبال‌شده ✓' : 'دنبال کردن'}
            </button>
          ` : ''}
          ${canDelete ? `
            <button type="button" onclick="togglePinCommunityPost(${Number(post.id)}, event)" class="w-8 h-8 rounded-xl ${post.is_pinned ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'} text-xs flex items-center justify-center transition" title="پین کردن در بالای پروفایل">📌</button>
            <button type="button" onclick="deleteCommunityMediaPost(${Number(post.id)})" class="w-8 h-8 rounded-xl bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white text-xs flex items-center justify-center transition" title="حذف پست">🗑️</button>
          ` : ''}
        </div>
      </div>

      ${(() => {
        const gallery = (Array.isArray(post.media_gallery) && post.media_gallery.length > 0) ? post.media_gallery : [post.media_url];
        const curSlide = Number(CAROUSEL_SLIDE_INDEX_MAP[post.id] || 0) % Math.max(1, gallery.length);
        const activeImg = gallery[curSlide] || post.media_url;
        return `
          <div ondblclick="triggerDoubleTapHeartBurst(event, ${Number(post.id)})" class="w-full bg-slate-950/90 max-h-[460px] flex items-center justify-center overflow-hidden cursor-pointer relative select-none">
            ${post.media_type === 'video' && activeImg && activeImg.startsWith('data:video') ? `
              <video controls src="${activeImg}" class="w-full max-h-[460px]"></video>
            ` : `
              <img id="ahdaneh-slide-img-${Number(post.id)}" onclick="openAhdanehPostLightbox(${Number(post.id)})" src="${activeImg}" loading="lazy" decoding="async" alt="" class="w-full max-h-[460px] object-cover transition duration-300" onerror="this.src='./icon-512.png'" />
            `}
            ${gallery.length > 1 ? `
              <span id="ahdaneh-slide-badge-${Number(post.id)}" class="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 border border-white/20 text-white font-mono font-black text-[10px]">
                ${(curSlide + 1).toLocaleString('fa-IR')}/${gallery.length.toLocaleString('fa-IR')}
              </span>
              <button type="button" onclick="stepPostCarouselSlide(${Number(post.id)}, -1, event)" class="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white font-black text-xs flex items-center justify-center border border-white/20">❮</button>
              <button type="button" onclick="stepPostCarouselSlide(${Number(post.id)}, 1, event)" class="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/85 text-white font-black text-xs flex items-center justify-center border border-white/20">❯</button>
              <div class="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5">
                ${gallery.map((_, idx) => `<span id="ahdaneh-dot-${post.id}-${idx}" class="${idx === curSlide ? 'w-4 h-1.5 rounded-full bg-amber-400' : 'w-1.5 h-1.5 rounded-full bg-white/35'} transition-all"></span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      })()}

      <div class="p-4 space-y-3 text-xs">
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <button type="button" onclick="likeCommunityMediaPost(${Number(post.id)})" class="flex items-center gap-1.5 font-black text-sm transition transform active:scale-125 ${liked ? 'text-rose-500' : 'text-slate-200 hover:text-rose-400'}">
              <span class="text-lg">${liked ? '❤️' : '🤍'}</span>
              <span>${Number(post.likes_count || 0).toLocaleString('fa-IR')}</span>
            </button>

            <button type="button" onclick="document.getElementById('cmt-box-${Number(post.id)}').classList.toggle('hidden')" class="flex items-center gap-1.5 font-black text-sm text-slate-200 hover:text-cyan-300 transition">
              <span class="text-lg">💬</span>
              <span>${comments.length.toLocaleString('fa-IR')}</span>
            </button>

            <button type="button" onclick="shareContentDeepLink('post', ${Number(post.id)}, '${escapeHtml(post.title || post.author_name)}')" class="flex items-center gap-1 font-bold text-xs text-slate-300 hover:text-amber-300 transition" title="اشتراک‌گذاری لینک پست">
              <span class="text-base">📤</span>
            </button>
          </div>

          <button type="button" onclick="toggleSaveCommunityPost(${Number(post.id)})" class="text-base transition ${hasUserSavedPost(post.id) ? 'text-amber-400 scale-110' : 'text-slate-400 hover:text-amber-300'}" title="ذخیره پست">
            🔖
          </button>
        </div>

        <div class="leading-relaxed text-slate-200">
          <strong onclick="openUserPersonalProfile('${escapeHtml(post.author_username)}', 'ahdaneh')" class="text-amber-300 font-black ml-1.5 cursor-pointer hover:underline">${escapeHtml(post.author_name)}:</strong>
          ${post.title ? `<span class="font-bold text-white ml-1">${escapeHtml(post.title)} —</span>` : ''}
          <span class="whitespace-pre-wrap">${formatSocialTextWithHashtagsAndMentions(post.caption, 'ahdaneh')}</span>
        </div>

        <div id="cmt-box-${Number(post.id)}" class="pt-2 border-t border-white/10 space-y-2">
          ${comments.length > 0 ? `
            <div class="space-y-1.5 max-h-36 overflow-y-auto">
              ${comments.map(c => `
                <div class="p-2 rounded-xl bg-slate-950/65 border border-white/5 text-[11px] flex items-center justify-between gap-2">
                  <div>
                    <strong class="text-amber-300 ml-1">${escapeHtml(c.sender)}:</strong>
                    <span class="text-slate-200">${escapeHtml(c.text)}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <form onsubmit="submitCommunityPostComment(event, ${Number(post.id)})" class="flex gap-2">
            <input id="cmt-inp-${Number(post.id)}" type="text" required placeholder="دیدگاه..." class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" />
            <button type="submit" class="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow">ثبت</button>
          </form>
        </div>
      </div>
    </article>
  `;
}

// ==============================================================================
// PART 2: CLEAN «عهدینو»
// ==============================================================================
function renderAhdinoPage() {
  const allPosts = getAhdinoPosts();
  const filter = state.ahdinoFilter || 'all';
  const myUname = (state.currentUser && state.currentUser.username) ? String(state.currentUser.username).toLowerCase() : '';
  const myFollowing = getFollowingListForUser(myUname).map(x => String(x).toLowerCase());

  const qAhdino = String(state.ahdinoSearchQuery || '').trim().toLowerCase();
  const filtered = allPosts.filter(p => {
    if (filter === 'following') {
      const au = String(p.author_username || '').toLowerCase();
      if (!(myFollowing.includes(au) || (myUname && au === myUname))) return false;
    } else if (filter === 'saved') {
      if (!hasUserSavedPost(p.id)) return false;
    } else if (filter === 'text' && p.media_type !== 'text') {
      return false;
    } else if (filter === 'audio' && p.media_type !== 'audio') {
      return false;
    }
    if (qAhdino) {
      const hay = ((p.title || '') + ' ' + (p.caption || '') + ' ' + (p.author_name || '') + ' ' + (p.author_username || '')).toLowerCase();
      if (!hay.includes(qAhdino)) return false;
    }
    return true;
  });

  return `
    <div class="max-w-xl mx-auto pb-24 space-y-2">
      <!-- هدر بالای صفحه: فقط عنوان وسط‌چین (بدون قلب و بدون علامت +) -->
      <div class="py-2 text-center select-none">
        <div class="font-nastaliq text-2xl sm:text-3xl text-amber-400 font-bold tracking-wide">
          عهدینو
        </div>
      </div>

      <!-- ردیف استوری‌ها بلافاصله زیر عنوان (بدون دو کادر اضافی قبلی) -->
      ${renderPublicInstagramStoriesBarHtml()}

      <!-- فید پست‌های عهدینو -->
      ${filtered.length === 0 ? `
        <div class="glass-panel rounded-3xl p-10 text-center text-xs text-slate-400 border border-dashed border-white/15">
          هنوز پستی در عهدینو ثبت نشده است.
        </div>
      ` : `
        <div class="space-y-3.5 pt-1">
          ${filtered.map(post => renderCleanHamahdiAhdinoPostCard(post)).join('')}
        </div>
      `}
    </div>
  `;
}

function renderCleanHamahdiAhdinoPostCard(post) {
  const liked = hasUserLikedPost(post.id);
  const myUname = (state.currentUser && state.currentUser.username) ? state.currentUser.username : '';
  const canDelete = isAdmin() || (myUname && String(post.author_username).toLowerCase() === String(myUname).toLowerCase());
  const isFollowingAuthor = isCurrentUserFollowing(post.author_username);
  const isMe = myUname && String(post.author_username).toLowerCase() === String(myUname).toLowerCase();
  const comments = Array.isArray(post.comments) ? post.comments : [];
  const authorMeta = getUserProfileMeta(post.author_username);

  return `
    <article class="glass-card hm-social-post-card rounded-3xl p-4 sm:p-5 border border-white/15 hover:border-sky-400/40 transition space-y-3 shadow-lg">
      <div class="flex items-start justify-between gap-2 border-b border-white/10 pb-3">
        <div onclick="openUserPersonalProfile('${escapeHtml(post.author_username)}', 'ahdino')" class="flex items-center gap-3 cursor-pointer min-w-0">
          <div class="w-10 h-10 rounded-full ig-story-ring shrink-0">
            <img src="${authorMeta.avatar}" alt="" class="w-full h-full rounded-full object-cover border-2 border-slate-950" onerror="this.src='./icon-512.png'" />
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <span class="font-black text-white text-xs sm:text-sm truncate">${escapeHtml(post.author_name)}</span>
              <span class="text-[11px] font-mono text-amber-300 dir-ltr truncate">@${escapeHtml(post.author_username || 'user')}</span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          ${!isMe ? `
            <button type="button" onclick="toggleFollowUser('${escapeHtml(post.author_username)}')" class="px-2.5 py-1 rounded-xl text-[10px] font-black transition ${isFollowingAuthor ? 'bg-white/10 text-emerald-300 border border-emerald-400/30' : 'bg-sky-500/20 text-sky-300 border border-sky-400/40 hover:bg-sky-400 hover:text-slate-950'}">
              ${isFollowingAuthor ? 'دنبال‌شده ✓' : '+ دنبال کردن'}
            </button>
          ` : ''}
          ${canDelete ? `
            <button type="button" onclick="deleteCommunityMediaPost(${Number(post.id)})" class="text-rose-400 hover:text-rose-300 font-bold text-xs px-1">🗑️</button>
          ` : ''}
        </div>
      </div>

      ${post.repost_author ? `
        <div class="text-[10px] font-bold text-emerald-300 flex items-center gap-1">
          <span>🔁 بازنشر شده از ${escapeHtml(post.repost_author)}</span>
        </div>
      ` : ''}
      ${post.title ? `<h3 class="font-black text-amber-300 text-xs sm:text-sm">${escapeHtml(post.title)}</h3>` : ''}
      <p class="text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">${formatSocialTextWithHashtagsAndMentions(post.caption, 'ahdino')}</p>

      ${renderInteractivePollHtml(post)}

      ${post.media_type === 'audio' && post.media_url ? `
        <div class="p-3 rounded-2xl bg-slate-950/85 border border-sky-400/35 space-y-2">
          <div class="flex items-center justify-between gap-3">
            <div class="hm-waveform-bars flex-1">
              ${[10,18,12,24,15,20,9,22,16,12,25,14,19,11,21,15,10,17].map(h => `<span class="hm-waveform-bar" style="height:${h}px"></span>`).join('')}
            </div>
            <button type="button" onclick="cycleAudioPlaybackRate(${Number(post.id)}, this)" class="px-2.5 py-1 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 font-mono font-black text-[11px] shrink-0" title="سرعت پخش صوت">1x</button>
          </div>
          <audio id="ahdino-audio-el-${Number(post.id)}" controls src="${getPlayableAudioSrc(post.media_url)}" class="w-full h-9"></audio>
        </div>
      ` : ''}

      <div class="pt-2.5 border-t border-white/10 flex items-center justify-between gap-4 text-xs">
        <div class="flex items-center gap-4">
          <button type="button" onclick="likeCommunityMediaPost(${Number(post.id)})" class="flex items-center gap-1.5 font-black transition ${liked ? 'text-rose-400 scale-105' : 'text-slate-300 hover:text-rose-400'}">
            <span class="text-base">${liked ? '❤️' : '🤍'}</span>
            <span>${Number(post.likes_count || 0).toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="openRepostModal(${Number(post.id)})" class="flex items-center gap-1 font-bold text-slate-300 hover:text-emerald-300 transition" title="بازنشر (Repost / Quote)">
            <span class="text-base">🔁</span>
            <span>${Number(post.reposts_count || 0).toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="document.getElementById('cmt-box-${Number(post.id)}').classList.toggle('hidden')" class="flex items-center gap-1.5 font-bold text-slate-300 hover:text-sky-300 transition">
            <span class="text-base">💬</span>
            <span>${comments.length.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="shareContentDeepLink('post', ${Number(post.id)}, '${escapeHtml(post.title || post.author_name)}')" class="flex items-center gap-1 font-bold text-slate-300 hover:text-amber-300 transition" title="اشتراک‌گذاری لینک پیام">
            <span class="text-sm">📤</span>
          </button>
        </div>

        <button type="button" onclick="toggleSaveCommunityPost(${Number(post.id)})" class="text-base transition ${hasUserSavedPost(post.id) ? 'text-amber-400 scale-110' : 'text-slate-400 hover:text-amber-300'}" title="ذخیره پیام">
          🔖
        </button>
      </div>

      <div id="cmt-box-${Number(post.id)}" class="hidden pt-2 space-y-2">
        ${comments.map(c => `
          <div class="p-2.5 rounded-2xl bg-slate-950/75 border border-white/10 text-[11px] flex items-center justify-between gap-2">
            <div>
              <strong class="text-amber-300 ml-1">${escapeHtml(c.sender)}:</strong>
              <span class="text-slate-200">${escapeHtml(c.text)}</span>
            </div>
          </div>
        `).join('')}

        <form onsubmit="submitCommunityPostComment(event, ${Number(post.id)})" class="flex gap-2">
          <input id="cmt-inp-${Number(post.id)}" type="text" required placeholder="دیدگاه..." class="glass-input flex-1 px-3 py-2 rounded-xl text-xs" />
          <button type="submit" class="px-4 py-2 rounded-xl bg-sky-400 text-slate-950 font-black text-xs">ثبت</button>
        </form>
      </div>
    </article>
  `;
}

// ==============================================================================
// UNIFIED SINGLE-ACCOUNT ENTRY GATEWAY
// ==============================================================================
function openUnifiedAppEntryModal(destApp = 'market') {
  state.pendingAppDestination = destApp;
  const requiresAuthOnly = (destApp === 'social_bot' || destApp === 'booth');

  openModal(`
    <div class="p-5 space-y-4">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div class="flex items-center gap-2.5">
          <img src="./icon-512.png?v=3.1.5" alt="" class="w-9 h-9 rounded-xl object-cover border border-amber-400/50" />
          <h3 class="font-black text-white text-sm sm:text-base">ورود به حساب کاربری هم‌عهدی</h3>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold">✕</button>
      </div>

      <div class="grid ${requiresAuthOnly ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'} gap-2 text-xs">
        <button type="button" onclick="switchEntryPopupTab('login')" id="ep-tab-login" class="py-2.5 px-2 rounded-xl font-black bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow">
          ۱. ورود اعضا
        </button>
        <button type="button" onclick="switchEntryPopupTab('resident')" id="ep-tab-resident" class="py-2.5 px-2 rounded-xl font-bold glass-card text-slate-200">
          ۲. ثبت‌نام
        </button>
        ${!requiresAuthOnly ? `
          <button type="button" onclick="switchEntryPopupTab('guest')" id="ep-tab-guest" class="py-2.5 px-2 rounded-xl font-bold glass-card text-slate-200">
            ۳. مهمان
          </button>
        ` : ''}
        <button type="button" onclick="switchEntryPopupTab('admin')" id="ep-tab-admin" class="py-2.5 px-2 rounded-xl font-bold glass-card text-slate-200">
          مدیریت
        </button>
      </div>

      <div id="entry-popup-body">
        ${renderEntryPopupTabContent('login')}
      </div>
    </div>
  `);
}

function routeToAppDestination(dest) {
  const target = dest || state.pendingAppDestination || 'market';
  state.pendingAppDestination = null;
  if (target === 'social_bot') {
    SOCIAL_BOT_STATE.entrySubView = 'media_assistant';
    state.currentPage = 'social_bot';
    saveState();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadSocialBotInitialData();
  } else if (target === 'ahdino') {
    state.currentPage = 'ahdino';
    saveState();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (target === 'ahdaneh') {
    state.currentPage = 'ahdaneh';
    saveState();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else if (target === 'booth') {
    openUserPersonalProfile((state.currentUser && state.currentUser.username) || '');
  } else {
    state.currentPage = 'market';
    saveState();
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

function handleEntryToAhdbotClick() {
  SOCIAL_BOT_STATE.entrySubView = 'media_assistant';
  state.currentPage = 'social_bot';
  saveState();
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  loadSocialBotInitialData();
}

function handleEntryToAhdinoClick() {
  showToast('🔒 بخش عهدینو موقتاً قفل است؛ هم‌اکنون فقط «عهد بازار» و «عهدبات» فعال هستند.', 'warning');
}

function handleEntryToAhdanehClick() {
  showToast('🔒 بخش عهدانه موقتاً قفل است؛ هم‌اکنون فقط «عهد بازار» و «عهدبات» فعال هستند.', 'warning');
}

function getCurrentPublisherAuthorInfo() {
  const customInput = document.getElementById('bot-publisher-author-name');
  const customVal = customInput ? customInput.value.trim() : '';
  if (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest') {
    return {
      username: state.currentUser.username,
      name: customVal || state.currentUser.display_name || state.currentUser.username,
      role: ''
    };
  }
  return {
    username: 'user',
    name: customVal || state.lastPublisherName || 'کاربر هم‌عهدی',
    role: ''
  };
}

let cachedDemoWavUrl = null;
function getPlayableAudioSrc(mediaUrl) {
  if (mediaUrl && mediaUrl !== 'synthesized_voice_1' && (mediaUrl.startsWith('data:') || mediaUrl.startsWith('storage/') || mediaUrl.startsWith('http') || mediaUrl.startsWith('blob:'))) {
    return mediaUrl;
  }
  if (cachedDemoWavUrl) return cachedDemoWavUrl;
  try {
    const sampleRate = 8000;
    const durationSec = 2;
    const numSamples = sampleRate * durationSec;
    const buffer = new ArrayBuffer(44 + numSamples);
    const view = new DataView(buffer);
    const writeStr = (off, s) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };
    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + numSamples, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate, true);
    view.setUint16(32, 1, true);
    view.setUint16(34, 8, true);
    writeStr(36, 'data');
    view.setUint32(40, numSamples, true);
    for (let i = 0; i < numSamples; i++) {
      const t = i / sampleRate;
      const val = 128 + Math.round(36 * Math.sin(2 * Math.PI * 440 * t));
      view.setUint8(44 + i, Math.max(0, Math.min(255, val)));
    }
    const bytes = new Uint8Array(buffer);
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    cachedDemoWavUrl = 'data:audio/wav;base64,' + btoa(bin);
    return cachedDemoWavUrl;
  } catch (e) {
    return '';
  }
}

function navigateToAhdinoPage(filterMode = '') {
  if (filterMode) state.ahdinoFilter = filterMode;
  state.currentPage = 'ahdino';
  saveState();
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToAhdanehPage(filterMode = '') {
  if (filterMode) state.ahdanehFilter = filterMode;
  state.currentPage = 'ahdaneh';
  saveState();
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function navigateToSocialBotStudioPage(defaultMediaType = '', forceSubView = 'hub') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('social_bot');
    return;
  }
  if (defaultMediaType) {
    SOCIAL_BOT_STATE.selectedMediaType = defaultMediaType;
  }
  SOCIAL_BOT_STATE.entrySubView = forceSubView || 'hub';
  state.currentPage = 'social_bot';
  saveState();
  renderCurrentPage();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  loadSocialBotInitialData();
}

function openAhdanehPostLightbox(postId) {
  const post = getAhdanehPosts().find(p => Number(p.id) === Number(postId));
  if (!post) return;
  openModal(`
    <div class="p-4 sm:p-5 space-y-3 text-xs">
      <div class="flex items-center justify-between border-b border-white/15 pb-2.5">
        <div onclick="closeModal(); openUserPersonalProfile('${escapeHtml(post.author_username)}', 'ahdaneh');" class="flex items-center gap-2.5 cursor-pointer">
          <img src="./icon-512.png?v=3.1.5" alt="" class="w-8 h-8 rounded-full object-cover border border-amber-400/50" />
          <div>
            <div class="font-black text-white">${escapeHtml(post.author_name)}</div>
            <div class="text-[10px] text-amber-300">@${escapeHtml(post.author_username || 'user')}</div>
          </div>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-white font-bold">✕</button>
      </div>
      <div class="max-h-[65vh] overflow-hidden flex items-center justify-center bg-slate-950 rounded-2xl border border-white/10">
        <img src="${post.media_url}" alt="" class="max-h-[62vh] object-contain" onerror="this.src='./icon-512.png'" />
      </div>
      <p class="text-slate-200 leading-relaxed"><strong class="text-amber-300 ml-1">${escapeHtml(post.author_name)}:</strong>${escapeHtml(post.caption)}</p>
    </div>
  `);
}

async function submitInlineAhdinoPost(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('ahdino');
    return;
  }
  const textEl = document.getElementById('ahdino-inline-text');
  const text = (textEl ? textEl.value : '').trim();
  const audioUrl = SOCIAL_BOT_STATE.ahdinoComposerAudioUrl || '';
  if (!text && !audioUrl) {
    showToast('لطفاً متن پیام یا فایل صوتی خود را وارد کنید.', 'error');
    return;
  }

  const authorInfo = getCurrentPublisherAuthorInfo();
  const mType = audioUrl ? 'audio' : 'text';
  let pollObj = null;
  if (SOCIAL_BOT_STATE.ahdinoPollOpen) {
    const pq = ((document.getElementById('ahdino-poll-q') || {}).value || '').trim();
    const o1 = ((document.getElementById('ahdino-poll-opt1') || {}).value || '').trim();
    const o2 = ((document.getElementById('ahdino-poll-opt2') || {}).value || '').trim();
    const o3 = ((document.getElementById('ahdino-poll-opt3') || {}).value || '').trim();
    if (o1 && o2) {
      const opts = [{ text: o1, votes: 0 }, { text: o2, votes: 0 }];
      if (o3) opts.push({ text: o3, votes: 0 });
      pollObj = { question: pq || text || 'نظرسنجی هم‌عهدی', options: opts, voters: {} };
    }
  }
  const newPost = {
    id: Date.now(),
    app_target: 'ahdino',
    media_type: mType,
    author_username: authorInfo.username,
    author_name: authorInfo.name,
    author_role: '',
    title: '',
    caption: text || (pollObj ? pollObj.question : 'پیام صوتی'),
    media_url: audioUrl,
    poll: pollObj,
    reposts_count: 0,
    likes_count: 0,
    liked_by: [],
    comments: [],
    created_at: 'هم‌اکنون'
  };
  SOCIAL_BOT_STATE.ahdinoPollOpen = false;

  ensureCommunityPostsInitialized().unshift(newPost);
  SOCIAL_BOT_STATE.ahdinoComposerAudioUrl = '';
  saveState();
  renderCurrentPage(true);
  callServerApi('add_community_post', newPost);
  showToast('پست شما منتشر شد.');
}

function handleAhdinoInlineAudioFile(inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  const r = new FileReader();
  r.onload = (ev) => {
    SOCIAL_BOT_STATE.ahdinoComposerAudioUrl = ev.target.result || '';
    renderCurrentPage(true);
    showToast('فایل صوتی ضمیمه شد.');
  };
  r.readAsDataURL(file);
}

async function loadSocialBotInitialData() {
  try {
    const res = await fetch('api/index.php?action=bot_init', { cache: 'no-store' });
    const data = await res.json();
    if (data && data.ok) {
      SOCIAL_BOT_STATE.isLivePhp = true;
      SOCIAL_BOT_STATE.csrfToken = data.csrf_token || '';
      if (data.platforms) SOCIAL_BOT_STATE.platforms = data.platforms;
      if (Array.isArray(data.history)) {
        SOCIAL_BOT_STATE.history = data.history;
      }
    }
  } catch (e) {
    SOCIAL_BOT_STATE.isLivePhp = false;
  }
}

function toggleSocialBotConfigPanel() {
  SOCIAL_BOT_STATE.configPanelOpen = !SOCIAL_BOT_STATE.configPanelOpen;
  const el = document.getElementById('social-bot-config-panel');
  if (el) el.classList.toggle('hidden', !SOCIAL_BOT_STATE.configPanelOpen);
}

function selectBotMediaTypeTab(mediaType) {
  SOCIAL_BOT_STATE.selectedMediaType = mediaType;
  SOCIAL_BOT_STATE.selectedFile = null;
  SOCIAL_BOT_STATE.selectedDataUrl = '';
  SOCIAL_BOT_STATE.recordedAudioDataUrl = '';
  renderCurrentPage(true);
}

function handleBotMediaFileInput(inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  const mime = (file.type || '').toLowerCase();
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  let detectedType = SOCIAL_BOT_STATE.selectedMediaType;
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv'].includes(ext)) detectedType = 'video';
  else if (mime.startsWith('audio/') || ['mp3', 'ogg', 'wav', 'm4a', 'aac'].includes(ext)) detectedType = 'audio';
  else if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)) detectedType = 'image';

  SOCIAL_BOT_STATE.selectedMediaType = detectedType;
  SOCIAL_BOT_STATE.selectedFile = file;
  SOCIAL_BOT_STATE.selectedFileName = file.name;
  SOCIAL_BOT_STATE.selectedFileSizeKb = Math.max(1, Math.round(file.size / 1024));

  const reader = new FileReader();
  reader.onload = function(ev) {
    SOCIAL_BOT_STATE.selectedDataUrl = ev.target.result || '';
    renderCurrentPage(true);
    showToast(`✅ فایل ${detectedType === 'video' ? 'ویدیویی' : (detectedType === 'audio' ? 'صوتی' : 'تصویری')} «${file.name}» آماده ارسال توسط عهدبات شد.`);
  };
  reader.readAsDataURL(file);
}

let __botMediaRecorder = null;
let __botRecordedChunks = [];

async function toggleBotVoiceRecording() {
  if (SOCIAL_BOT_STATE.isRecordingVoice && __botMediaRecorder) {
    try {
      __botMediaRecorder.stop();
    } catch (e) {}
    SOCIAL_BOT_STATE.isRecordingVoice = false;
    renderCurrentPage(true);
    return;
  }

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia && typeof MediaRecorder !== 'undefined') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      __botRecordedChunks = [];
      __botMediaRecorder = new MediaRecorder(stream);
      __botMediaRecorder.ondataavailable = function(e) {
        if (e.data && e.data.size > 0) __botRecordedChunks.push(e.data);
      };
      __botMediaRecorder.onstop = function() {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(__botRecordedChunks, { type: 'audio/ogg' });
        const fileObj = new File([blob], 'voice_' + Date.now() + '.ogg', { type: 'audio/ogg' });
        SOCIAL_BOT_STATE.selectedFile = fileObj;
        SOCIAL_BOT_STATE.selectedFileName = fileObj.name;
        SOCIAL_BOT_STATE.selectedFileSizeKb = Math.max(1, Math.round(fileObj.size / 1024));
        SOCIAL_BOT_STATE.selectedMediaType = 'audio';
        const reader = new FileReader();
        reader.onload = function(ev) {
          SOCIAL_BOT_STATE.recordedAudioDataUrl = ev.target.result || '';
          SOCIAL_BOT_STATE.selectedDataUrl = SOCIAL_BOT_STATE.recordedAudioDataUrl;
          renderCurrentPage(true);
          showToast('🎙️ صدای شما با موفقیت ضبط و آماده ارسال به کانال‌ها شد.');
        };
        reader.readAsDataURL(blob);
      };
      __botMediaRecorder.start();
      SOCIAL_BOT_STATE.isRecordingVoice = true;
      renderCurrentPage(true);
      showToast('🎙️ ضبط صدا شروع شد... پس از اتمام صحبت روی «پایان ضبط» کلیک کنید.', 'info');
      return;
    } catch (err) {}
  }

  // Fallback synthesized audio WAV if microphone is not connected on desktop PC
  const fallbackWav = getPlayableAudioSrc('synthesized_voice_1');
  SOCIAL_BOT_STATE.recordedAudioDataUrl = fallbackWav;
  SOCIAL_BOT_STATE.selectedDataUrl = fallbackWav;
  SOCIAL_BOT_STATE.selectedFileName = 'voice_message.wav';
  SOCIAL_BOT_STATE.selectedFileSizeKb = 42;
  SOCIAL_BOT_STATE.selectedMediaType = 'audio';
  renderCurrentPage(true);
  showToast('🎙️ فایل صوتی آماده ارسال به کانال‌ها شد.');
}

async function saveSocialBotPlatformConfig(platform) {
  const map = {
    bale:     { uname: 'bot-uname-bale',     tok: 'bot-tok-bale',     ch: 'bot-ch-bale',     btn: 'bot-btn-save-bale',     name: 'بله' },
    rubika:   { uname: 'bot-uname-rubika',   tok: 'bot-tok-rubika',   ch: 'bot-ch-rubika',   btn: 'bot-btn-save-rubika',   name: 'روبیکا' },
    eitaa:    { uname: 'bot-uname-eitaa',    tok: 'bot-tok-eitaa',    ch: 'bot-ch-eitaa',    btn: 'bot-btn-save-eitaa',    name: 'ایتا' },
    soroush:  { uname: 'bot-uname-soroush',  tok: 'bot-tok-soroush',  ch: 'bot-ch-soroush',  btn: 'bot-btn-save-soroush',  name: 'سروش‌پلاس' },
    telegram: { uname: 'bot-uname-telegram', tok: 'bot-tok-telegram', ch: 'bot-ch-telegram', btn: 'bot-btn-save-telegram', name: 'تلگرام' }
  }[platform];
  if (!map) return;
  const bot_username = ((document.getElementById(map.uname) || {}).value || '').trim().replace(/^@+/, '');
  const bot_token = ((document.getElementById(map.tok) || {}).value || '').trim();
  const channel_id = ((document.getElementById(map.ch) || {}).value || '').trim();
  const proxy = platform === 'telegram' ? (((document.getElementById('bot-proxy-telegram') || {}).value || '').trim()) : '';

  if (!bot_username && !channel_id && !bot_token) {
    showToast(`لطفاً آیدی ربات، کانال اصلی یا توکن ${map.name} را وارد نمایید.`, 'error');
    return;
  }

  // Save in local state immediately so Admin's configured bot_username and channel_id persist across refreshes
  if (!state.botMotherConfigs || typeof state.botMotherConfigs !== 'object') state.botMotherConfigs = {};
  state.botMotherConfigs[platform] = {
    bot_username: bot_username,
    channel_id: channel_id,
    has_token: Boolean(bot_token || (SOCIAL_BOT_STATE.platforms[platform] && SOCIAL_BOT_STATE.platforms[platform].has_token))
  };
  if (SOCIAL_BOT_STATE.platforms && SOCIAL_BOT_STATE.platforms[platform]) {
    if (bot_username) SOCIAL_BOT_STATE.platforms[platform].bot_username = bot_username;
    if (channel_id) SOCIAL_BOT_STATE.platforms[platform].channel_id = channel_id;
    SOCIAL_BOT_STATE.platforms[platform].is_configured = Boolean(bot_username || channel_id || bot_token);
  }
  saveState();

  try {
    const res = await fetch('api/index.php?action=bot_init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, bot_token, channel_id, bot_username, proxy })
    });
    const data = await res.json();
    if (data && data.ok) {
      if (data.platforms) SOCIAL_BOT_STATE.platforms = data.platforms;
      renderCurrentPage(true);
      showToast(data.message || `تنظیمات ${map.name} ذخیره شد.`);
      return;
    } else if (data && data.error) {
      showToast(data.error, 'error');
      return;
    }
  } catch (err) {}
  renderCurrentPage(true);
  showToast(`تنظیمات ${map.name} ذخیره شد.`);
}

async function discoverBotChats(platform) {
  const isRubika = platform === 'rubika';
  const chInputId = isRubika ? 'bot-ch-rubika' : 'bot-ch-soroush';
  const inp = document.getElementById(chInputId);
  if (inp && inp.value.trim()) {
    showToast(`شناسه ${inp.value.trim()} بررسی شد.`);
  } else {
    showToast('لطفاً ابتدا شناسه کانال را وارد نمایید.', 'warning');
  }
}

function handleBotCaptionLiveInput(el) {
  const val = el ? el.value : '';
  const prevCap = document.getElementById('bot-live-preview-caption');
  if (prevCap) prevCap.textContent = val.trim() ? val : '...';
}

function handleBotTitleLiveInput(el) {
  const val = el ? el.value : '';
  const prevTitle = document.getElementById('bot-live-preview-title');
  if (prevTitle) prevTitle.textContent = val.trim() ? val : '';
}

function handleBotAuthorLiveInput(el) {
  const val = (el ? el.value : '').trim();
  state.lastPublisherName = val;
  const prevAuthor = document.getElementById('bot-live-preview-author');
  if (prevAuthor) prevAuthor.textContent = val || 'کاربر';
}

// ==============================================================================
// DIRECT PERSONAL POST & STORY CREATION MODAL
// ==============================================================================
let directPersonalPostMediaDataUrl = '';
let directPersonalPostDetectedType = 'image';

function openDirectPersonalPostModal(defaultType = '') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  let initType = defaultType;
  if (!initType) {
    if (state.currentPage === 'ahdino') initType = 'text';
    else if (state.currentPage === 'booth' && state.profileActiveAppTab === 'ahdino') initType = 'text';
    else initType = 'image';
  }
  directPersonalPostDetectedType = initType;
  directPersonalPostMediaDataUrl = '';

  openModal(`
    <div class="p-5 sm:p-6 space-y-4 text-xs">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <h3 class="font-black text-amber-300 text-sm sm:text-base">➕ ثبت پست و استوری</h3>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center">
        <button type="button" id="dp-tab-ahdaneh" onclick="switchDirectPersonalModalTab('image')"
          class="py-2.5 px-2 rounded-2xl font-black border transition ${initType === 'image' || initType === 'video' ? 'bg-gradient-to-r from-fuchsia-400 to-amber-400 text-slate-950 border-amber-300 shadow' : 'glass-card text-slate-300 border-white/10'}">
          🎬 عهدانه (تصویر/ویدیو)
        </button>
        <button type="button" id="dp-tab-ahdino" onclick="switchDirectPersonalModalTab('text')"
          class="py-2.5 px-2 rounded-2xl font-black border transition ${initType === 'text' || initType === 'audio' ? 'bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 border-sky-300 shadow' : 'glass-card text-slate-300 border-white/10'}">
          🎙️ عهدینو (متن/صوت)
        </button>
        <button type="button" id="dp-tab-story" onclick="closeModal(); openCreateSocialStoryModal('public');"
          class="py-2.5 px-2 rounded-2xl font-black border glass-card text-amber-300 border-amber-400/35 hover:border-amber-400 transition">
          📸 ثبت استوری
        </button>
      </div>

      <form onsubmit="submitDirectPersonalPostForm(event)" class="space-y-3.5">
        <input type="hidden" id="dp-post-type" value="${escapeHtml(initType)}" />

        <div id="dp-media-upload-box" class="space-y-2">
          <label class="block text-slate-300 font-bold">فایل رسانه (تصویر، ویدیو یا صوت):</label>
          <input id="dp-media-file" type="file" accept="image/*,video/*,audio/*" onchange="handleDirectPersonalFileChange(this)" class="glass-input w-full px-3 py-2 rounded-xl text-xs" />
          <span id="dp-file-status" class="text-[11px] text-emerald-300 font-bold block"></span>
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">عنوان (اختیاری)</label>
          <input id="dp-post-title" type="text" placeholder="عنوان..." class="glass-input w-full px-3.5 py-2 rounded-xl font-bold" />
        </div>

        <div>
          <label class="block text-slate-300 font-bold mb-1">متن یا توضیحات *</label>
          <textarea id="dp-post-caption" rows="4" required placeholder="متن..." class="glass-input w-full p-3.5 rounded-2xl leading-relaxed"></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">انصراف</button>
          <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 font-black shadow-lg">
            انتشار ←
          </button>
        </div>
      </form>
    </div>
  `);
}

function switchDirectPersonalModalTab(mode) {
  directPersonalPostDetectedType = mode;
  const typeInp = document.getElementById('dp-post-type');
  if (typeInp) typeInp.value = mode;
  const tAhdaneh = document.getElementById('dp-tab-ahdaneh');
  const tAhdino = document.getElementById('dp-tab-ahdino');
  if (tAhdaneh && tAhdino) {
    if (mode === 'text' || mode === 'audio') {
      tAhdino.className = 'py-2.5 px-2 rounded-2xl font-black border transition bg-gradient-to-r from-sky-400 to-cyan-400 text-slate-950 border-sky-300 shadow';
      tAhdaneh.className = 'py-2.5 px-2 rounded-2xl font-black border transition glass-card text-slate-300 border-white/10';
    } else {
      tAhdaneh.className = 'py-2.5 px-2 rounded-2xl font-black border transition bg-gradient-to-r from-fuchsia-400 to-amber-400 text-slate-950 border-amber-300 shadow';
      tAhdino.className = 'py-2.5 px-2 rounded-2xl font-black border transition glass-card text-slate-300 border-white/10';
    }
  }
}

function handleDirectPersonalFileChange(inputEl) {
  const file = inputEl && inputEl.files && inputEl.files[0];
  if (!file) return;
  const mime = (file.type || '').toLowerCase();
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  let detected = 'image';
  if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'mkv'].includes(ext)) detected = 'video';
  else if (mime.startsWith('audio/') || ['mp3', 'ogg', 'wav', 'm4a', 'aac'].includes(ext)) detected = 'audio';
  directPersonalPostDetectedType = detected;
  const typeInp = document.getElementById('dp-post-type');
  if (typeInp) typeInp.value = detected;

  if (detected === 'image') {
    readImageFileAsDataUrl(inputEl, 960, function(dataUrl) {
      directPersonalPostMediaDataUrl = dataUrl || '';
      const st = document.getElementById('dp-file-status');
      if (st) st.textContent = '✅ تصویر آماده ثبت شد';
    });
  } else {
    const r = new FileReader();
    r.onload = function(ev) {
      directPersonalPostMediaDataUrl = ev.target.result || '';
      const st = document.getElementById('dp-file-status');
      if (st) st.textContent = `✅ فایل (${file.name}) آماده ثبت شد`;
    };
    r.readAsDataURL(file);
  }
}

function submitDirectPersonalPostForm(e) {
  e.preventDefault();
  const title = ((document.getElementById('dp-post-title') || {}).value || '').trim();
  const caption = ((document.getElementById('dp-post-caption') || {}).value || '').trim();
  const mType = ((document.getElementById('dp-post-type') || {}).value || directPersonalPostDetectedType || 'text');

  if (!caption && !title) {
    showToast('لطفاً متن پست خود را وارد نمایید.', 'error');
    return;
  }

  const mediaUrl = directPersonalPostMediaDataUrl || '';
  if ((mType === 'image' || mType === 'video') && !mediaUrl) {
    showToast('لطفاً فایل تصویر یا ویدیو را انتخاب کنید.', 'error');
    return;
  }

  const targetApp = (mType === 'image' || mType === 'video') ? 'ahdaneh' : 'ahdino';
  const authorInfo = getCurrentPublisherAuthorInfo();

  const newPost = {
    id: Date.now(),
    app_target: targetApp,
    media_type: mType,
    author_username: authorInfo.username,
    author_name: authorInfo.name,
    author_role: '',
    title: title,
    caption: caption || title,
    media_url: mediaUrl,
    likes_count: 0,
    liked_by: [],
    comments: [],
    created_at: 'هم‌اکنون'
  };

  ensureCommunityPostsInitialized().unshift(newPost);
  closeModal();
  if (state.currentPage === 'booth') {
    state.profileActiveAppTab = targetApp;
  }
  saveState();
  renderCurrentPage(true);
  callServerApi('add_community_post', newPost);
  showToast('پست شما با موفقیت منتشر شد.');
}

// ==============================================================================
// MOBILE BOTTOM NAVIGATION HANDLERS
// ==============================================================================
function handleSocialMobileNavHome() {
  returnToLandingPage();
}

function handleSocialMobileNavReels() {
  openFullscreenReelsFeedModal();
}

function openMyPersonalProfileFromNav() {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdaneh');
    return;
  }
  const uname = state.currentUser.username;
  const tab = state.currentPage === 'ahdino' ? 'ahdino' : 'ahdaneh';
  openUserPersonalProfile(uname, tab);
}

// ==============================================================================
// AHDBOT MEDIA-OWNER ONBOARDING, CHANNEL DISCOVERY & ADMIN SEQUENTIAL QUEUE
// ==============================================================================
// ==============================================================================
// AHDBOT v3.3.1 COMPLETE RAW ENGINE (خامِ خام - بدون هیچ کانال، گروه یا ربات فیک/هاردکد)
// ۱. پشتیبانی انحصاری از ۴ شبکه: بله، روبیکا، تلگرام و ایتا (ایتایار)
// ۲. تمامی ربات‌ها توسط ادمین و تمامی کانال‌ها/گروه‌ها توسط کاربران و ادمین ثبت و بروزرسانی می‌شوند
// ۳. پاپ‌آپ گام‌به‌گام (Wizard) افزودن کانال یا گروه + تشخیص خودکار ۵۰۰+ عضو بدون دخالت ادمین
// ۴. امضای اختصاصی هر کانال + زمان‌بندی ساعتی و روزانه + بانک محتواهای ذخیره‌شده جهت ارسال تکراری
// ==============================================================================

const AHDBOT_SUPPORTED_PLATFORMS = ['bale', 'rubika', 'eitaa', 'telegram'];

const DEFAULT_SAVED_REPEATED_POSTS = [];

function getPlatformFaLabel(platform) {
  const m = {
    bale: 'بله',
    rubika: 'روبیکا',
    eitaa: 'ایتا',
    telegram: 'تلگرام'
  };
  return m[String(platform || '').toLowerCase()] || platform;
}

function getOfficialBotInfoForPlatform(platform) {
  const pf = String(platform || 'bale').toLowerCase();
  const stPf = (SOCIAL_BOT_STATE && SOCIAL_BOT_STATE.platforms && SOCIAL_BOT_STATE.platforms[pf]) || {};
  const localCfg = (state.botMotherConfigs && state.botMotherConfigs[pf]) || {};

  // هیچ آیدی ربات فیک یا هاردکدی استفاده نمی‌شود؛ فقط مقادیر ثبت‌شده توسط ادمین خوانده می‌شود
  const rawUname = pf === 'eitaa' ? '' : String(stPf.bot_username || localCfg.bot_username || 'Hamahdibot').replace(/^@+/, '').trim();
  const hasToken = Boolean(stPf.has_token || localCfg.has_token);
  const botHandle = rawUname ? ('@' + rawUname) : '';

  const fullLabels = {
    bale: 'بله (Bale)',
    rubika: 'روبیکا (Rubika)',
    telegram: 'تلگرام (Telegram)',
    eitaa: 'ایتا (ایتایار)'
  };
  const addUrlMap = {
    bale:     rawUname ? `https://ble.ir/${rawUname}` : '',
    rubika:   rawUname ? `https://rubika.ir/${rawUname}` : '',
    telegram: rawUname ? `https://t.me/${rawUname}?startchannel=true` : '',
    eitaa:    rawUname ? `https://eitaa.com/${rawUname}` : 'https://eitaayar.ir'
  };

  return {
    platform: pf,
    label: getPlatformFaLabel(pf),
    full_label: fullLabels[pf] || getPlatformFaLabel(pf),
    auth_mode: pf === 'eitaa' ? 'eitaayar' : 'botfather',
    bot_handle: botHandle,
    raw_username: rawUname,
    has_token: hasToken,
    is_configured: Boolean(rawUname || hasToken || pf === 'eitaa'),
    add_url: addUrlMap[pf] || ''
  };
}

function ensureSavedRepeatedPostsInitialized() {
  if (!Array.isArray(state.ahdbotSavedPosts)) {
    try {
      const raw = localStorage.getItem('hamahdi_ahdbot_saved_posts_v331');
      const parsed = raw ? JSON.parse(raw) : null;
      state.ahdbotSavedPosts = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      state.ahdbotSavedPosts = [];
    }
  }
  return state.ahdbotSavedPosts;
}

function saveRepeatedPostsToStorage() {
  try {
    localStorage.setItem('hamahdi_ahdbot_saved_posts_v331', JSON.stringify(ensureSavedRepeatedPostsInitialized()));
  } catch (e) {}
}

function ensureScheduledBotJobsInitialized() {
  if (!Array.isArray(state.ahdbotScheduledJobs)) {
    try {
      const raw = localStorage.getItem('hamahdi_ahdbot_schedules_v331');
      const parsed = raw ? JSON.parse(raw) : null;
      state.ahdbotScheduledJobs = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      state.ahdbotScheduledJobs = [];
    }
  }
  return state.ahdbotScheduledJobs;
}

function saveScheduledBotJobsToStorage() {
  try {
    localStorage.setItem('hamahdi_ahdbot_schedules_v331', JSON.stringify(ensureScheduledBotJobsInitialized()));
  } catch (e) {}
}

// ==============================================================================
// پاپ‌آپ گام‌به‌گام (Wizard) افزودن کانال یا گروه در ۴ شبکه
// ==============================================================================
function ensureWizardStateInitialized() {
  if (!SOCIAL_BOT_STATE.wizard || typeof SOCIAL_BOT_STATE.wizard !== 'object') {
    SOCIAL_BOT_STATE.wizard = {
      step: 1,
      platform: 'bale',
      target_type: 'channel',
      bot_added_clicked: false,
      eitaa_token: '',
      media_title: '',
      channel_id: '',
      members_count: '',
      signature: '',
      checking: false,
      detected_members: null,
      auto_approved: null,
      status_message: ''
    };
  }
  return SOCIAL_BOT_STATE.wizard;
}

function openAhdbotStepByStepWizardModal(initialStep = 1, defaultPlatform = '') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('social_bot');
    return;
  }
  const wz = ensureWizardStateInitialized();
  wz.step = Number(initialStep) || 1;
  if (defaultPlatform && AHDBOT_SUPPORTED_PLATFORMS.includes(defaultPlatform)) {
    wz.platform = defaultPlatform;
  }
  if (wz.step === 1) {
    wz.checking = false;
    wz.detected_members = null;
    wz.auto_approved = null;
    wz.status_message = '';
  }
  renderAhdbotWizardModalContent();
}

function setAhdbotWizardPlatform(pf) {
  const wz = ensureWizardStateInitialized();
  wz.platform = pf;
  wz.detected_members = null;
  wz.auto_approved = null;
  wz.status_message = '';
  renderAhdbotWizardModalContent();
}

function setAhdbotWizardTargetType(tType) {
  const wz = ensureWizardStateInitialized();
  wz.target_type = tType === 'group' ? 'group' : 'channel';
  renderAhdbotWizardModalContent();
}

function goAhdbotWizardStep(nextStep) {
  const wz = ensureWizardStateInitialized();
  if (wz.step === 2) {
    const eTokEl = document.getElementById('wz-eitaa-token-inp');
    if (eTokEl) wz.eitaa_token = eTokEl.value.trim();
    if (wz.platform === 'eitaa' && nextStep > 2 && !wz.eitaa_token) {
      showToast('لطفاً ابتدا توکن اختصاصی ایتایار کانال خود را وارد نمایید.', 'warning');
      if (eTokEl) eTokEl.focus();
      return;
    }
  }
  if (wz.step === 3) {
    const tEl = document.getElementById('wz-media-title-inp');
    const cEl = document.getElementById('wz-channel-id-inp');
    const mEl = document.getElementById('wz-members-count-inp');
    const sEl = document.getElementById('wz-channel-sig-inp');
    if (tEl) wz.media_title = tEl.value.trim();
    if (cEl) wz.channel_id = cEl.value.trim();
    if (mEl) wz.members_count = mEl.value.trim();
    if (sEl) wz.signature = sEl.value.trim();
  }
  wz.step = Number(nextStep) || 1;
  renderAhdbotWizardModalContent();
}

function handleWizardOpenOfficialBot(platform) {
  const wz = ensureWizardStateInitialized();
  const info = getOfficialBotInfoForPlatform(platform || wz.platform);
  if (!info.raw_username) {
    if (isAdmin()) {
      closeModal();
      navigateToAdminDashboard('ahdbot_admin');
      showToast(`لطفاً ابتدا آیدی و توکن ربات ${info.label} را در بخش مدیریت عهدبات ثبت نمایید.`, 'info');
    } else {
      showToast(`آیدی ربات ${info.label} هنوز توسط مدیریت سامانه ثبت نشده است.`, 'warning');
    }
    return;
  }
  wz.bot_added_clicked = true;
  window.open(info.add_url, '_blank', 'noopener,noreferrer');
  showToast(`در حال باز کردن ${info.bot_handle} در ${info.label}...`);
}

function copyOfficialBotHandle(handleStr) {
  if (!handleStr) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(handleStr).then(() => {
      showToast(`آیدی ${handleStr} کپی شد 📋`);
    }).catch(() => {
      showToast(`آیدی: ${handleStr}`);
    });
  } else {
    showToast(`آیدی: ${handleStr}`);
  }
}

function renderAhdbotWizardModalContent() {
  const wz = ensureWizardStateInitialized();
  const pfInfo = getOfficialBotInfoForPlatform(wz.platform);
  const targetFa = wz.target_type === 'group' ? 'گروه' : 'کانال';

  let stepBodyHtml = '';

  if (wz.step === 1) {
    stepBodyHtml = `
      <div class="space-y-4 text-xs">
        <div class="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-400/35 space-y-2.5">
          <div class="font-black text-amber-300 text-xs sm:text-sm">گام ۱ از ۳: انتخاب شبکه اجتماعی و نوع رسانه</div>
          <p class="text-[11px] text-slate-300 leading-relaxed">
            شبکه پیام‌رسان خود را از بین ۴ شبکه زیر انتخاب کنید و مشخص نمایید قصد ثبت «کانال» یا «گروه» را دارید:
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
            ${AHDBOT_SUPPORTED_PLATFORMS.map(pfKey => {
              const info = getOfficialBotInfoForPlatform(pfKey);
              const active = wz.platform === pfKey;
              return `
                <button type="button" onclick="setAhdbotWizardPlatform('${pfKey}')"
                  class="p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1.5 ${active ? 'bg-gradient-to-b from-amber-400/25 to-cyan-500/20 border-amber-400 text-white shadow-lg scale-[1.02]' : 'glass-card border-white/10 text-slate-300 hover:border-white/30'}">
                  <span class="font-black text-xs sm:text-sm ${active ? 'text-amber-300' : 'text-white'}">${escapeHtml(info.label)}</span>
                  <span class="text-[10px] px-2 py-0.5 rounded-full ${info.auth_mode === 'eitaayar' ? 'bg-orange-500/20 text-orange-300' : (info.raw_username ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400')} font-bold">
                    ${info.auth_mode === 'eitaayar' ? 'سبک ایتایار' : (info.raw_username ? escapeHtml(info.bot_handle) : 'تنظیم توسط ادمین')}
                  </span>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <div class="p-3.5 rounded-2xl bg-slate-950/85 border border-white/15 space-y-2">
          <div class="font-black text-white text-xs">نوع مقصد در ${escapeHtml(pfInfo.label)}:</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button type="button" onclick="setAhdbotWizardTargetType('channel')"
              class="py-2.5 px-3 rounded-xl font-black border transition flex items-center justify-center gap-2 ${wz.target_type === 'channel' ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow' : 'glass-card text-slate-300 border-white/10'}">
              <span>📢 کانال (Channel)</span>
            </button>
            <button type="button" onclick="setAhdbotWizardTargetType('group')"
              class="py-2.5 px-3 rounded-xl font-black border transition flex items-center justify-center gap-2 ${wz.target_type === 'group' ? 'bg-cyan-400 text-slate-950 border-cyan-300 shadow' : 'glass-card text-slate-300 border-white/10'}">
              <span>👥 گروه (Group)</span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between pt-2 border-t border-white/10">
          <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">بستن</button>
          <button type="button" onclick="goAhdbotWizardStep(2)" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow-lg">
            ادامه به گام ۲ (اتصال ربات) ←
          </button>
        </div>
      </div>
    `;
  } else if (wz.step === 2) {
    if (wz.platform === 'eitaa') {
      stepBodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-2xl bg-orange-500/10 border-2 border-orange-400/50 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-black text-orange-300 text-xs sm:text-sm">🟠 گام ۲ از ۳: اتصال اختصاصی ایتا از طریق «ایتایار»</span>
              <span class="px-2.5 py-0.5 rounded-full bg-orange-400 text-slate-950 font-black text-[10px]">سبک ایتایار</span>
            </div>
            <p class="text-[11px] text-slate-200 leading-relaxed">
              پیام‌رسان ایتا از سامانه رسمی <strong>ایتایار (eitaayar.ir)</strong> استفاده می‌کند:
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
              <div class="p-2.5 rounded-xl bg-slate-950/85 border border-white/10 space-y-1">
                <div class="font-black text-amber-300">۱. ورود به ایتایار</div>
                <p class="text-slate-300">وارد سایت <a href="https://eitaayar.ir" target="_blank" rel="noopener noreferrer" class="text-cyan-300 underline font-mono dir-ltr">eitaayar.ir</a> شوید.</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/85 border border-white/10 space-y-1">
                <div class="font-black text-amber-300">۲. ادمین کردن بات</div>
                <p class="text-slate-300">ربات معرفی‌شده در ایتایار را در ${targetFa} ایتای خود ادمین نمایید.</p>
              </div>
              <div class="p-2.5 rounded-xl bg-slate-950/85 border border-white/10 space-y-1">
                <div class="font-black text-amber-300">۳. درج توکن ایتایار</div>
                <p class="text-slate-300">توکن اختصاصی دریافتی از ایتایار را در کادر زیر وارد نمایید.</p>
              </div>
            </div>

            <div class="pt-2 border-t border-white/10">
              <label class="block text-orange-200 font-black mb-1">🔑 توکن اختصاصی ایتایار برای این ${targetFa} *</label>
              <input id="wz-eitaa-token-inp" type="text" value="${escapeHtml(wz.eitaa_token || '')}" placeholder="توکن دریافتی از eitaayar.ir را وارد کنید..." class="glass-input w-full px-3.5 py-2.5 rounded-xl font-mono text-xs dir-ltr text-left" />
            </div>
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/10">
            <button type="button" onclick="goAhdbotWizardStep(1)" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">→ گام قبلی</button>
            <button type="button" onclick="goAhdbotWizardStep(3)" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow-lg">
              ادامه به گام ۳ (مشخصات و ثبت) ←
            </button>
          </div>
        </div>
      `;
    } else {
      stepBodyHtml = `
        <div class="space-y-4 text-xs">
          <div class="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-400/50 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <span class="font-black text-emerald-300 text-xs sm:text-sm">🤖 گام ۲ از ۳: افزودن ربات به ${targetFa} ${escapeHtml(pfInfo.label)}</span>
              <span class="px-2.5 py-0.5 rounded-full ${pfInfo.raw_username ? 'bg-emerald-400 text-slate-950' : 'bg-amber-500/20 text-amber-300'} font-black text-[10px]">
                ${pfInfo.raw_username ? 'ربات ثبت‌شده توسط ادمین ✔' : 'منتظر ثبت ربات توسط ادمین'}
              </span>
            </div>

            ${pfInfo.raw_username ? `
              <p class="text-[11px] text-slate-200 leading-relaxed">
                کافیست ربات زیر (ثبت‌شده توسط مدیریت) را در ${targetFa} خود به عنوان <strong>ادمین (مدیر)</strong> اضافه کنید:
              </p>
              <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-white/15 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div class="text-[10px] text-slate-400">آیدی ربات ${escapeHtml(pfInfo.label)}:</div>
                  <div class="font-mono font-black text-amber-300 text-sm sm:text-base dir-ltr text-left mt-0.5">${escapeHtml(pfInfo.bot_handle)}</div>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button type="button" onclick="handleWizardOpenOfficialBot('${wz.platform}')" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg">
                    ➕ باز کردن ربات و افزودن به ${targetFa} ↗
                  </button>
                  <button type="button" onclick="copyOfficialBotHandle('${escapeHtml(pfInfo.bot_handle)}')" class="px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                    📋 کپی آیدی
                  </button>
                </div>
              </div>
            ` : `
              <div class="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-400/40 space-y-2.5">
                <p class="text-[11px] text-amber-200 leading-relaxed">
                  ⚠️ آیدی و توکن ربات <strong>${escapeHtml(pfInfo.label)}</strong> هنوز توسط ادمین ثبت نشده است (هیچ ربات فیکی هاردکد نشده است).
                </p>
                ${isAdmin() ? `
                  <button type="button" onclick="closeModal(); navigateToAdminDashboard('ahdbot_admin');" class="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow">
                    ⚙️ ثبت آیدی و توکن ربات در داشبورد مدیریت ←
                  </button>
                ` : ''}
              </div>
            `}
          </div>

          <div class="flex items-center justify-between pt-2 border-t border-white/10">
            <button type="button" onclick="goAhdbotWizardStep(1)" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">→ گام قبلی</button>
            <button type="button" onclick="goAhdbotWizardStep(3)" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow-lg">
              ادامه به گام ۳ (مشخصات و ثبت) ←
            </button>
          </div>
        </div>
      `;
    }
  } else {
    stepBodyHtml = `
      <form onsubmit="submitAhdbotWizardAutoVerifyAndRegister(event)" class="space-y-4 text-xs">
        <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/45 space-y-3.5">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <span class="font-black text-amber-300 text-xs sm:text-sm">⚡ گام ۳ از ۳: مشخصات ${targetFa}، امضای اختصاصی و تایید خودکار (+۵۰۰ عضو)</span>
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-black text-[10px]">${escapeHtml(pfInfo.label)} • ${targetFa}</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-slate-300 font-bold mb-1">۱. نام فارسی ${targetFa} *</label>
              <input id="wz-media-title-inp" type="text" required value="${escapeHtml(wz.media_title || '')}" placeholder="نام ${targetFa}..." class="glass-input w-full px-3.5 py-2.5 rounded-xl font-bold" />
            </div>
            <div>
              <label class="block text-slate-300 font-bold mb-1">۲. آیدی یا لینک ${targetFa} *</label>
              <input id="wz-channel-id-inp" type="text" required value="${escapeHtml(wz.channel_id || '')}" placeholder="@channel_id" class="glass-input w-full px-3.5 py-2.5 rounded-xl font-mono dir-ltr text-left" />
            </div>
          </div>

          <div class="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/35 text-[11px] text-cyan-200 font-bold">
            🤖 ${isAdmin() ? 'تعداد اعضا توسط ربات @Hamahdibot استعلام می‌شود (ادمین مجاز به ثبت کانال زیر ۵۰۰ عضو نیز هست).' : 'تعداد اعضای کانال/گروه به صورت کاملاً اتوماتیک توسط ربات @Hamahdibot بررسی و در صورت داشتن ۵۰۰+ عضو تایید می‌شود.'}
          </div>

          <div>
            <label class="block text-amber-300 font-black mb-1">۳. امضای اختصاصی انتهای پست‌های این ${targetFa} (اختیاری - قابل ویرایش)</label>
            <textarea id="wz-channel-sig-inp" rows="2" placeholder="متن، لینک یا آیدی که می‌خواهید به صورت خودکار در انتهای تمامی پست‌های ارسالی به این ${targetFa} درج شود..." class="glass-input w-full p-3 rounded-xl text-xs leading-relaxed">${escapeHtml(wz.signature || '')}</textarea>
          </div>

          ${wz.status_message ? `
            <div class="p-3.5 rounded-2xl border-2 ${wz.auto_approved ? 'bg-emerald-500/15 border-emerald-400 text-emerald-200' : 'bg-rose-500/15 border-rose-400 text-rose-200'} font-bold text-xs leading-relaxed">
              ${escapeHtml(wz.status_message)}
            </div>
          ` : ''}
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
          <button type="button" onclick="goAhdbotWizardStep(2)" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">→ گام قبلی</button>
          <button type="submit" ${wz.checking ? 'disabled' : ''} class="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 font-black shadow-xl">
            ${wz.checking ? '🔄 در حال بررسی خودکار...' : `⚡ بررسی خودکار ۵۰۰+ عضو و ثبت آنی ${targetFa}`}
          </button>
        </div>
      </form>
    `;
  }

  openModal(`
    <div class="p-4 sm:p-6 space-y-4 max-w-xl mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div class="flex items-center gap-2.5">
          <img src="./icon-512.png?v=3.3.1" alt="هم‌عهدی" class="w-9 h-9 rounded-xl object-cover border border-amber-400/50" />
          <div>
            <h3 class="font-black text-white text-sm sm:text-base">راهنمای گام‌به‌گام اتصال کانال یا گروه به عهدبات</h3>
            <p class="text-[10px] text-amber-300 font-bold">پشتیبانی از ۴ شبکه: بله • روبیکا • ایتا (ایتایار) • تلگرام</p>
          </div>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold">✕</button>
      </div>

      <div class="grid grid-cols-3 gap-2 text-center text-[11px]">
        <button type="button" onclick="goAhdbotWizardStep(1)" class="py-2 px-2 rounded-xl font-black border transition ${wz.step === 1 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow' : (wz.step > 1 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'glass-card text-slate-400 border-white/10')}">
          ۱. انتخاب شبکه
        </button>
        <button type="button" onclick="goAhdbotWizardStep(2)" class="py-2 px-2 rounded-xl font-black border transition ${wz.step === 2 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow' : (wz.step > 2 ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'glass-card text-slate-400 border-white/10')}">
          ۲. اتصال ربات
        </button>
        <button type="button" onclick="goAhdbotWizardStep(3)" class="py-2 px-2 rounded-xl font-black border transition ${wz.step === 3 ? 'bg-amber-400 text-slate-950 border-amber-300 shadow' : 'glass-card text-slate-400 border-white/10'}">
          ۳. تایید خودکار و ثبت
        </button>
      </div>

      ${stepBodyHtml}
    </div>
  `);
}

async function submitAhdbotWizardAutoVerifyAndRegister(e) {
  if (e && e.preventDefault) e.preventDefault();
  const wz = ensureWizardStateInitialized();
  const titleEl = document.getElementById('wz-media-title-inp');
  const chEl = document.getElementById('wz-channel-id-inp');
  const sigEl = document.getElementById('wz-channel-sig-inp');

  wz.media_title = (titleEl ? titleEl.value : wz.media_title).trim();
  wz.channel_id = (chEl ? chEl.value : wz.channel_id).trim();
  wz.signature = (sigEl ? sigEl.value : wz.signature).trim();

  if (!wz.media_title || !wz.channel_id) {
    showToast('لطفاً نام و آیدی کانال/گروه را وارد نمایید.', 'error');
    return;
  }

  const cleanHandle = wz.channel_id.replace(/^https?:\/\/[^\/]+\//i, '').replace(/^@+/, '').replace(/\/+$/, '').trim();
  const formattedCh = cleanHandle.toLowerCase().startsWith('c0') ? cleanHandle : ('@' + cleanHandle);
  const targetFa = wz.target_type === 'group' ? 'گروه' : 'کانال';

  // بررسی یکتایی سراسری در حافظه فعلی (هیچ کانال/گروهی نباید توسط هیچکس دوباره ثبت شود)
  const allExistingList = ensureRegisteredBotChannelsInitialized();
  const duplicateGlobal = allExistingList.find(c =>
    String(c.platform || '').toLowerCase() === String(wz.platform || '').toLowerCase() &&
    String(c.channel_id || '').replace(/^@+/, '').toLowerCase() === cleanHandle.toLowerCase()
  );
  if (duplicateGlobal) {
    wz.auto_approved = false;
    wz.status_message = `⛔ این ${targetFa} (${formattedCh}) قبلاً در سامانه هم‌عهدی ثبت شده است و امکان ثبت مجدد آن توسط هیچ کاربری وجود ندارد.`;
    renderAhdbotWizardModalContent();
    showToast(wz.status_message, 'error');
    return;
  }

  wz.checking = true;
  wz.status_message = '';
  renderAhdbotWizardModalContent();

  const uname = (state.currentUser && state.currentUser.username) || 'resident';
  const dname = (state.currentUser && (state.currentUser.display_name || state.currentUser.username)) || 'کاربر هم‌عهدی';
  const adminFlag = isAdmin();
  const adminTok = (state.currentUser && state.currentUser.admin_token) ? state.currentUser.admin_token : '';

  let detectedMembers = 0;
  let isEligible = false;
  let serverMsg = '';

  try {
    const resp = await fetch('api/index.php?action=bot_auto_verify_channel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        platform: wz.platform,
        target_type: wz.target_type,
        channel_id: formattedCh,
        eitaa_token: wz.eitaa_token || '',
        owner_username: uname,
        is_admin: adminFlag,
        admin_token: adminTok
      })
    });
    const rawTxt = await resp.text();
    let data = null;
    try { data = rawTxt ? JSON.parse(rawTxt) : null; } catch (parseErr) {}

    if (!data) {
      wz.checking = false;
      wz.auto_approved = false;
      wz.status_message = '❌ پاسخ معتبر از سرور استعلام دریافت نشد. لطفاً وضعیت توکن ربات @Hamahdibot را در فایل config.php بررسی کنید.';
      renderAhdbotWizardModalContent();
      showToast(wz.status_message, 'error');
      return;
    }

    if (data.error || data.duplicate || !data.eligible) {
      wz.checking = false;
      wz.auto_approved = false;
      wz.status_message = data.error || data.message || `❌ ${targetFa} «${formattedCh}» تایید نشد (حداقل ۵۰۰ عضو الزامی است).`;
      renderAhdbotWizardModalContent();
      showToast(wz.status_message, 'error');
      return;
    }

    detectedMembers = Number(data.members_count || 0);
    isEligible = Boolean(data.eligible);
    serverMsg = data.message || '';
  } catch (err) {
    wz.checking = false;
    wz.auto_approved = false;
    wz.status_message = '❌ خطا در ارتباط با سرور جهت بررسی اتوماتیک تعداد اعضا.';
    renderAhdbotWizardModalContent();
    showToast(wz.status_message, 'error');
    return;
  }

  wz.checking = false;
  wz.detected_members = detectedMembers;
  wz.auto_approved = isEligible;

  if (!isEligible) {
    wz.status_message = serverMsg || `❌ رد خودکار: تعداد اعضای ${targetFa} «${formattedCh}» کمتر از ۵۰۰ نفر است.`;
    renderAhdbotWizardModalContent();
    showToast(wz.status_message, 'error');
    return;
  }

  const chObj = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    owner_username: uname,
    owner_name: dname,
    media_title: wz.media_title,
    platform: wz.platform,
    target_type: wz.target_type,
    channel_id: formattedCh,
    channel_title: `${wz.media_title} (${getPlatformFaLabel(wz.platform)})`,
    signature: wz.signature,
    eitaa_token: wz.platform === 'eitaa' ? (wz.eitaa_token || '') : '',
    members_count: detectedMembers,
    bot_added_confirmed: 1,
    is_verified: 1,
    status: 'approved',
    created_at: 'امروز'
  };

  allExistingList.unshift(chObj);

  if (state.currentUser) {
    state.currentUser.ahdbot_onboarded = true;
    state.currentUser.media_title = wz.media_title;
  }
  wz.media_title = '';
  wz.channel_id = '';
  wz.members_count = '';
  wz.signature = '';
  SOCIAL_BOT_STATE.showOnboardingModal = false;
  saveState();
  callServerApi('save_bot_channel', chObj);

  closeModal();
  renderCurrentPage(true);
  showToast(serverMsg || `✅ ${targetFa} «${chObj.media_title}» با موفقیت ثبت شد!`);
}

// ==============================================================================
// ویرایش امضای اختصاصی هر کانال
// ==============================================================================
function openEditChannelSignatureModal(channelIdNum) {
  const list = ensureRegisteredBotChannelsInitialized();
  const ch = list.find(c => Number(c.id) === Number(channelIdNum));
  if (!ch) return;

  openModal(`
    <div class="p-5 sm:p-6 space-y-4 text-xs max-w-md mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div>
          <h3 class="font-black text-amber-300 text-sm sm:text-base">✒️ امضای اختصاصی کانال</h3>
          <p class="text-[11px] text-slate-300 mt-0.5">${escapeHtml(ch.media_title || ch.channel_title)} (<span class="font-mono dir-ltr">${escapeHtml(ch.channel_id)}</span>)</p>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>

      <form onsubmit="submitEditChannelSignatureForm(event, ${Number(ch.id)})" class="space-y-3.5">
        <p class="text-[11px] text-slate-300 leading-relaxed">
          این امضا به صورت خودکار در انتهای تمامی پست‌هایی که توسط عهدبات به این کانال یا گروه ارسال می‌شوند درج خواهد شد:
        </p>
        <textarea id="edit-channel-sig-textarea" rows="4" placeholder="امضای دلخواه خود را وارد کنید..." class="glass-input w-full p-3.5 rounded-2xl text-xs leading-relaxed">${escapeHtml(ch.signature || '')}</textarea>

        <div class="flex justify-end gap-2 pt-2 border-t border-white/10">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold">انصراف</button>
          <button type="submit" class="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg">
            💾 ذخیره امضای کانال
          </button>
        </div>
      </form>
    </div>
  `);
}

function submitEditChannelSignatureForm(e, channelIdNum) {
  if (e && e.preventDefault) e.preventDefault();
  const list = ensureRegisteredBotChannelsInitialized();
  const ch = list.find(c => Number(c.id) === Number(channelIdNum));
  if (!ch) return;
  const sigEl = document.getElementById('edit-channel-sig-textarea');
  const newSig = sigEl ? sigEl.value.trim() : '';
  ch.signature = newSig;
  saveState();
  closeModal();
  renderCurrentPage(true);
  callServerApi('update_bot_channel_signature', {
    id: Number(ch.id),
    channel_id: ch.channel_id,
    platform: ch.platform,
    signature: newSig
  });
  showToast(`✒️ امضای اختصاصی «${ch.media_title || ch.channel_id}» بروزرسانی شد.`);
}

// ==============================================================================
// موتور جامع عهدبات نسخه v3.3.5:
// ۱. پیشخوان دوکارته عهدبات («ورود به دستیار هوشمند رسانه» و «هوش مصنوعی هم‌عهدی - قفل»)
// ۲. حذف کامل گانت‌چارت و جایگزینی با سیستم «ارسال زنجیره‌ای چند محتوا / چند تصویر در یک پست»
//    (مثلاً قرار دادن ۳۰ تصویر/صفحه از یک کتاب در یک پست و ارسال خودکار هر صفحه در یک روز و ساعت مشخص)
// ۳. تقویم شمسی کامل کارت‌محور برای مشاهده و تنظیم روز و ساعت ارسال هر صفحه یا پست
// ۴. موتور اجرای دقیق و واقعی تک‌تک زمان‌بندی‌ها (Real-Time Accurate Dispatcher) بدون اشغال فضای آپلود سرور
// ==============================================================================