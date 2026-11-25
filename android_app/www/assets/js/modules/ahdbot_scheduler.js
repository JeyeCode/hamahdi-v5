/**
 * HAMAHDI v4.0.0 | ماژول موتور زمان‌بندی کشویی عهدبات: ارسال زنجیره‌ای ۳۰ صفحه کتاب، تقویم شمسی و اجرای واقعی
 */
const PERSIAN_WEEKDAYS = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const PERSIAN_WEEK_NUMBERS = [
  { id: 1, label: 'هفته اول' },
  { id: 2, label: 'هفته دوم' },
  { id: 3, label: 'هفته سوم' },
  { id: 4, label: 'هفته چهارم' }
];
const JALALI_MONTHS_CATALOG = [
  { key: '1405-08', year: 1405, month: 8, name: 'آبان ۱۴۰۵', days: 30, startWeekdayIdx: 5, todayDay: 18 },
  { key: '1405-09', year: 1405, month: 9, name: 'آذر ۱۴۰۵', days: 30, startWeekdayIdx: 0, todayDay: 0 },
  { key: '1405-10', year: 1405, month: 10, name: 'دی ۱۴۰۵', days: 30, startWeekdayIdx: 2, todayDay: 0 }
];
const POST_SERIES_PALETTE = [
  { badge: 'bg-amber-400/20 text-amber-300 border-amber-400/50', dot: '#fbbf24' },
  { badge: 'bg-cyan-400/20 text-cyan-300 border-cyan-400/50', dot: '#38bdf8' },
  { badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/50', dot: '#34d399' },
  { badge: 'bg-purple-400/20 text-purple-300 border-purple-400/50', dot: '#c084fc' },
  { badge: 'bg-rose-400/20 text-rose-300 border-rose-400/50', dot: '#fb7185' }
];

function enterAhdbotMediaAssistant() {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('social_bot');
    return;
  }
  SOCIAL_BOT_STATE.entrySubView = 'media_assistant';
  state.currentPage = 'social_bot';
  renderCurrentPage(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
  loadSocialBotInitialData();
}

function openAhdbotMainHub() {
  SOCIAL_BOT_STATE.entrySubView = 'hub';
  renderCurrentPage(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openHamahdiAiLockedPreviewModal() {
  openModal(`
    <div class="p-5 sm:p-6 space-y-4 text-xs max-w-xl mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 via-indigo-500 to-cyan-400 text-white flex items-center justify-center text-2xl shadow-lg">
            🧠
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-black text-white text-sm sm:text-base">هوش مصنوعی هم‌عهدی (Ham-Ahdi AI)</h3>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/50 text-amber-300 text-[10px] font-black">🔒 به‌زودی</span>
            </div>
            <p class="text-[11px] text-slate-300 mt-0.5">چت‌باکس چندرسانه‌ای پیشرفته با الهام از Gemini ، ChatGPT و Grok</p>
          </div>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>

      <div class="p-4 rounded-2xl bg-slate-950/85 border border-purple-400/40 space-y-3">
        <p class="text-slate-200 leading-relaxed font-bold">
          بخش «هوش مصنوعی هم‌عهدی» یک استودیو و چت‌باکس هوشمند تمام‌عیار است که در فاز آتی سامانه فعال می‌شود و امکانات زیر را یکجا در اختیار اهالی، غرفه‌داران و مدیران رسانه قرار می‌دهد:
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div class="p-3 rounded-xl glass-card border border-cyan-400/35 space-y-1">
            <div class="font-black text-cyan-300">💬 ۱. چت هوشمند و نگارش محتوا</div>
            <p class="text-[11px] text-slate-300">پاسخگویی عمیق، کپشن‌نویسی حرفه‌ای، ایده‌پردازی کمپین‌های محلی و مشاوره کسب‌وکار</p>
          </div>
          <div class="p-3 rounded-xl glass-card border border-purple-400/35 space-y-1">
            <div class="font-black text-purple-300">🎨 ۲. ساخت و طراحی تصویر با هوش مصنوعی</div>
            <p class="text-[11px] text-slate-300">تولید پوسترهای فرهنگی و مذهبی، بنر غرفه‌ها و تصاویر استوری با دستور متنی فارسی</p>
          </div>
          <div class="p-3 rounded-xl glass-card border border-amber-400/35 space-y-1">
            <div class="font-black text-amber-300">🎬 ۳. ساخت ویدیو و تیزر هوشمند</div>
            <p class="text-[11px] text-slate-300">تبدیل متن و سناریو به ویدیوهای کوتاه تبلیغاتی، فرهنگی و ریلزهای آماده انتشار</p>
          </div>
          <div class="p-3 rounded-xl glass-card border border-emerald-400/35 space-y-1">
            <div class="font-black text-emerald-300">🎙️ ۴. تولید و پردازش هوشمند صدا</div>
            <p class="text-[11px] text-slate-300">تبدیل متن به گفتار طبیعی فارسی (نریشن)، دوبله و پادکست‌سازی خودکار</p>
          </div>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
        <span class="text-[11px] text-amber-300 font-bold">🔒 این بخش در حال تکمیل زیرساخت سرور هوش مصنوعی است.</span>
        <div class="flex items-center gap-2">
          <button type="button" onclick="closeModal()" class="px-4 py-2 rounded-xl bg-white/10 text-slate-300 font-bold">بستن</button>
          <button type="button" onclick="closeModal(); enterAhdbotMediaAssistant();" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black shadow">
            🚀 ورود به دستیار هوشمند رسانه
          </button>
        </div>
      </div>
    </div>
  `);
}

function getJalaliSequentialDateKey(startMonthKey, startDayNum, dayOffset) {
  const mIdx = JALALI_MONTHS_CATALOG.findIndex(m => m.key === startMonthKey);
  let curMIdx = mIdx >= 0 ? mIdx : 0;
  let curDay = Math.max(1, Number(startDayNum || 18)) + Number(dayOffset || 0);
  while (curMIdx < JALALI_MONTHS_CATALOG.length && curDay > JALALI_MONTHS_CATALOG[curMIdx].days) {
    curDay -= JALALI_MONTHS_CATALOG[curMIdx].days;
    curMIdx++;
  }
  const mObj = JALALI_MONTHS_CATALOG[Math.min(curMIdx, JALALI_MONTHS_CATALOG.length - 1)];
  return {
    dateKey: `${mObj.key}-${String(curDay).padStart(2, '0')}`,
    monthKey: mObj.key,
    monthName: mObj.name,
    dayNum: curDay
  };
}

function normalizeScheduleRuleObject(rawRule) {
  const base = {
    mode: 'immediate',               // ONLY 'immediate' | 'scheduled'
    sub_mode: 'once_daily',          // 'once_daily' | 'multi_daily' | 'weekly_custom' | 'multi_page_series' | 'jalali_calendar'
    // 1. ارسال در یک ساعت خاص در روز (once_daily)
    once_time: '09:00',
    days_count: 7,
    start_day_offset: 0,
    // 2. ارسال چندین بار در ساعات مختلف روز (multi_daily)
    daily_times: ['08:30', '14:00', '20:30'],
    multi_days_count: 7,
    // 3. ارسال خاص در ساعات خاص در ایام هفته‌های مورد نظر (weekly_custom)
    selected_weeks: [1, 2, 3, 4],
    selected_weekdays: ['شنبه', 'دوشنبه', 'چهارشنبه'],
    weekday_times: {
      'شنبه': ['09:00', '19:00'],
      'یکشنبه': ['10:00'],
      'دوشنبه': ['09:00', '18:00'],
      'سه‌شنبه': ['10:00'],
      'چهارشنبه': ['09:00', '20:00'],
      'پنج‌شنبه': ['11:00', '21:00'],
      'جمعه': ['16:00']
    },
    // 4. ارسال زنجیره‌ای چند محتوا / چند صفحه کتاب در یک پست (multi_page_series)
    // مثلاً ۳۰ صفحه کتاب در ۳۰ روز، هر روز ۱ صفحه در ساعت مشخص
    series_default_time: '09:00',
    series_step_days: 1,
    series_start_month: '1405-08',
    series_start_day: 18,
    series_items: [], // [{ page_num: 1, title: 'صفحه ۱', file_name: '', data_url: '', custom_caption: '', date_key: '1405-08-18', day_label: '۱۸ آبان ۱۴۰۵', time: '09:00', sent: false }]
    // 5. تقویم شمسی کامل کارت‌محور (jalali_calendar)
    active_jalali_month: '1405-08',
    calendar_day_slots: {
      '1405-08-18': ['09:00', '18:30'],
      '1405-08-20': ['10:00', '20:00'],
      '1405-08-22': ['08:30']
    },
    schedule_note: ''
  };
  if (!rawRule || typeof rawRule !== 'object') return base;
  const merged = Object.assign({}, base, rawRule);
  if (merged.mode !== 'immediate' && merged.mode !== 'scheduled') {
    merged.mode = 'scheduled';
  }
  if (!Array.isArray(merged.daily_times) || merged.daily_times.length === 0) {
    merged.daily_times = ['08:30', '14:00', '20:30'];
  }
  if (!Array.isArray(merged.selected_weeks) || merged.selected_weeks.length === 0) {
    merged.selected_weeks = [1, 2, 3, 4];
  }
  if (!Array.isArray(merged.selected_weekdays) || merged.selected_weekdays.length === 0) {
    merged.selected_weekdays = ['شنبه', 'دوشنبه', 'چهارشنبه'];
  }
  if (!merged.weekday_times || typeof merged.weekday_times !== 'object') {
    merged.weekday_times = base.weekday_times;
  }
  if (!Array.isArray(merged.series_items)) {
    merged.series_items = [];
  }
  if (!merged.calendar_day_slots || typeof merged.calendar_day_slots !== 'object') {
    merged.calendar_day_slots = base.calendar_day_slots;
  }
  return merged;
}

function ensureComposerScheduleRuleInitialized() {
  SOCIAL_BOT_STATE.composerRule = normalizeScheduleRuleObject(SOCIAL_BOT_STATE.composerRule);
  return SOCIAL_BOT_STATE.composerRule;
}

function getMonthCatalogObj(monthKey) {
  return JALALI_MONTHS_CATALOG.find(m => m.key === monthKey) || JALALI_MONTHS_CATALOG[0];
}

// توزیع خودکار صفحات/تصاویر یک پست چندمحتوایی در روزها و ساعت مشخص (مثلاً ۳۰ صفحه در ۳۰ روز)
function recalculateSeriesItemsDates(rule) {
  const r = rule || ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(r.series_items)) r.series_items = [];
  const stepDays = Math.max(1, Number(r.series_step_days || 1));
  const defTime = r.series_default_time || '09:00';
  const startMonth = r.series_start_month || '1405-08';
  const startDay = Math.max(1, Number(r.series_start_day || 18));

  r.series_items.forEach((item, idx) => {
    item.page_num = idx + 1;
    const seq = getJalaliSequentialDateKey(startMonth, startDay, idx * stepDays);
    item.date_key = seq.dateKey;
    item.day_label = `${seq.dayNum.toLocaleString('fa-IR')} ${seq.monthName}`;
    if (!item.time) item.time = defTime;
  });
}

function applyUniformTimeAndStepToAllSeriesPages(isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  const defTime = rule.series_default_time || '09:00';
  const stepDays = Math.max(1, Number(rule.series_step_days || 1));
  const startMonth = rule.series_start_month || '1405-08';
  const startDay = Math.max(1, Number(rule.series_start_day || 18));

  (rule.series_items || []).forEach((item, idx) => {
    item.page_num = idx + 1;
    const seq = getJalaliSequentialDateKey(startMonth, startDay, idx * stepDays);
    item.date_key = seq.dateKey;
    item.day_label = `${seq.dayNum.toLocaleString('fa-IR')} ${seq.monthName}`;
    item.time = defTime;
  });

  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
  showToast(`✅ زمان‌بندی تمامی ${(rule.series_items || []).length.toLocaleString('fa-IR')} صفحه/محتوا به صورت خودکار تنظیم شد.`);
}

// آپلود چند تصویر / چند صفحه کتاب به صورت یکجا در یک پست (مثلاً ۳۰ تصویر برای ۳۰ روز)
function handleMultiSeriesFilesInput(inputEl, isModal = false) {
  const files = inputEl && inputEl.files ? Array.from(inputEl.files) : [];
  if (files.length === 0) return;
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  rule.mode = 'scheduled';
  rule.sub_mode = 'multi_page_series';
  if (!isModal) SOCIAL_BOT_STATE.sendMode = 'scheduled';
  if (!Array.isArray(rule.series_items)) rule.series_items = [];

  let processed = 0;
  files.forEach((file) => {
    const reader = new FileReader();
    reader.onload = function(evt) {
      const rawDataUrl = String(evt.target.result || '');
      // اگر تصویر است، برای سبک ماندن حافظه فشرده‌سازی WebP انجام شود
      if (file.type && file.type.startsWith('image/')) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const maxDim = 920;
          let w = img.width || 600;
          let h = img.height || 600;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const compressedUrl = canvas.toDataURL('image/webp', 0.78);
          const nextNum = rule.series_items.length + 1;
          rule.series_items.push({
            page_num: nextNum,
            title: `صفحه / تصویر ${nextNum.toLocaleString('fa-IR')}`,
            file_name: file.name,
            data_url: compressedUrl,
            custom_caption: '',
            time: rule.series_default_time || '09:00',
            sent: false
          });
          processed++;
          if (processed === files.length) {
            recalculateSeriesItemsDates(rule);
            if (!SOCIAL_BOT_STATE.selectedDataUrl && rule.series_items[0]) {
              SOCIAL_BOT_STATE.selectedDataUrl = rule.series_items[0].data_url;
              SOCIAL_BOT_STATE.selectedFileName = rule.series_items[0].file_name;
            }
            if (isModal) renderPostPublishingRuleModalDOM();
            else renderCurrentPage(true);
            showToast(`📚 ${files.length.toLocaleString('fa-IR')} صفحه/تصویر در این پست قرار گرفت و هر کدام در یک روز مجزا زمان‌بندی شد.`);
          }
        };
        img.src = rawDataUrl;
      } else {
        const nextNum = rule.series_items.length + 1;
        rule.series_items.push({
          page_num: nextNum,
          title: `محتوای ${nextNum.toLocaleString('fa-IR')}`,
          file_name: file.name,
          data_url: rawDataUrl.length < 350000 ? rawDataUrl : '',
          custom_caption: '',
          time: rule.series_default_time || '09:00',
          sent: false
        });
        processed++;
        if (processed === files.length) {
          recalculateSeriesItemsDates(rule);
          if (isModal) renderPostPublishingRuleModalDOM();
          else renderCurrentPage(true);
        }
      }
    };
    reader.readAsDataURL(file);
  });
}

// تولید سریع N صفحه/محتوای زنجیره‌ای در یک پست (مثلاً ۳۰ صفحه کتاب برای ۳۰ روز)
function generateBookPagesSeriesTemplate(totalCount = 30, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  rule.mode = 'scheduled';
  rule.sub_mode = 'multi_page_series';
  if (!isModal) SOCIAL_BOT_STATE.sendMode = 'scheduled';

  const count = Math.max(1, Math.min(60, Number(totalCount || 30)));
  const defTime = rule.series_default_time || '09:00';
  const currentImg = SOCIAL_BOT_STATE.selectedDataUrl || '';
  rule.series_items = [];
  for (let i = 1; i <= count; i++) {
    rule.series_items.push({
      page_num: i,
      title: `صفحه ${i.toLocaleString('fa-IR')} از ${count.toLocaleString('fa-IR')}`,
      file_name: currentImg ? `page_${i}.webp` : '',
      data_url: currentImg,
      custom_caption: `📖 مطالعه روزانه — صفحه ${i.toLocaleString('fa-IR')} از ${count.toLocaleString('fa-IR')}`,
      time: defTime,
      sent: false
    });
  }
  recalculateSeriesItemsDates(rule);
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
  showToast(`📚 برنامه زنجیره‌ای ${count.toLocaleString('fa-IR')} صفحه‌ای در ${count.toLocaleString('fa-IR')} روز متوالی (هر روز ساعت ${defTime}) ایجاد شد.`);
}

function updateSeriesItemField(idx, field, val, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.series_items) || !rule.series_items[idx]) return;
  rule.series_items[idx][field] = val;
  if (field === 'date_key') {
    const parts = String(val).split('-');
    if (parts.length === 3) {
      const mObj = getMonthCatalogObj(`${parts[0]}-${parts[1]}`);
      rule.series_items[idx].day_label = `${Number(parts[2]).toLocaleString('fa-IR')} ${mObj.name}`;
    }
  }
}

function removeSeriesPageItem(idx, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.series_items)) return;
  rule.series_items.splice(idx, 1);
  recalculateSeriesItemsDates(rule);
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function clearAllSeriesPageItems(isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  rule.series_items = [];
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

// محاسبه لیست ساعات و صفحات انتشار یک قانون در یک روز خاص از ماه شمسی (برای نمایش روی کارت‌های تقویم شمسی)
function getRuleTimesForJalaliDay(rule, monthKey, dayNum) {
  if (!rule || rule.mode !== 'scheduled') return [];
  const r = normalizeScheduleRuleObject(rule);
  const mObj = getMonthCatalogObj(monthKey);
  const dateKey = `${mObj.key}-${String(dayNum).padStart(2, '0')}`;
  const weekdayIdx = (mObj.startWeekdayIdx + (dayNum - 1)) % 7;
  const weekdayName = PERSIAN_WEEKDAYS[weekdayIdx];
  const weekNum = Math.min(4, Math.floor((dayNum - 1) / 7) + 1);
  const startDay = mObj.todayDay > 0 ? mObj.todayDay : 1;

  if (r.sub_mode === 'once_daily') {
    const firstDay = startDay + Number(r.start_day_offset || 0);
    const maxDays = Math.max(1, Number(r.days_count || 1));
    if (dayNum >= firstDay && dayNum < firstDay + maxDays) {
      return [r.once_time || '09:00'];
    }
    return [];
  }

  if (r.sub_mode === 'multi_daily') {
    const firstDay = startDay;
    const maxDays = Math.max(1, Number(r.multi_days_count || 7));
    if (dayNum >= firstDay && dayNum < firstDay + maxDays) {
      return Array.isArray(r.daily_times) ? r.daily_times.slice().sort() : ['09:00'];
    }
    return [];
  }

  if (r.sub_mode === 'weekly_custom') {
    if (!r.selected_weeks.includes(weekNum)) return [];
    if (!r.selected_weekdays.includes(weekdayName)) return [];
    const times = (r.weekday_times && Array.isArray(r.weekday_times[weekdayName]) && r.weekday_times[weekdayName].length > 0)
      ? r.weekday_times[weekdayName]
      : ['09:00'];
    return times.slice().sort();
  }

  if (r.sub_mode === 'multi_page_series') {
    const matched = (r.series_items || []).filter(it => it.date_key === dateKey);
    return matched.map(it => `${it.time || '09:00'} (ص${Number(it.page_num).toLocaleString('fa-IR')})`);
  }

  if (r.sub_mode === 'jalali_calendar') {
    const slots = (r.calendar_day_slots && Array.isArray(r.calendar_day_slots[dateKey]))
      ? r.calendar_day_slots[dateKey]
      : [];
    return slots.slice().sort();
  }

  return [];
}

function getTotalOccurrencesForRule(rule) {
  if (!rule || rule.mode !== 'scheduled') return 1;
  const r = normalizeScheduleRuleObject(rule);
  if (r.sub_mode === 'once_daily') return Math.max(1, Number(r.days_count || 1));
  if (r.sub_mode === 'multi_daily') return Math.max(1, Number(r.multi_days_count || 1) * (Array.isArray(r.daily_times) ? r.daily_times.length : 1));
  if (r.sub_mode === 'weekly_custom') {
    let perWeek = 0;
    (r.selected_weekdays || []).forEach(wd => {
      const arr = (r.weekday_times && Array.isArray(r.weekday_times[wd])) ? r.weekday_times[wd] : ['09:00'];
      perWeek += arr.length;
    });
    return Math.max(1, perWeek * (Array.isArray(r.selected_weeks) ? r.selected_weeks.length : 1));
  }
  if (r.sub_mode === 'multi_page_series') {
    return Math.max(1, (r.series_items || []).length);
  }
  if (r.sub_mode === 'jalali_calendar') {
    let total = 0;
    Object.values(r.calendar_day_slots || {}).forEach(arr => {
      if (Array.isArray(arr)) total += arr.length;
    });
    return Math.max(1, total);
  }
  return 1;
}

function formatPublishingRuleSummary(rule) {
  if (!rule || typeof rule !== 'object' || rule.mode === 'immediate') {
    return '🚀 ارسال فوری (انتشار آنی پس از ثبت)';
  }
  const r = normalizeScheduleRuleObject(rule);
  const notePart = r.schedule_note ? ` (${r.schedule_note})` : '';

  if (r.sub_mode === 'once_daily') {
    const dCount = Math.max(1, Number(r.days_count || 1));
    const offset = Number(r.start_day_offset || 0);
    const startTxt = offset === 0 ? 'از امروز' : `از ${offset.toLocaleString('fa-IR')} روز دیگر`;
    return `🗓️ ۱. ساعت خاص در روز: هر روز ساعت ${r.once_time || '09:00'} (${startTxt} به مدت ${dCount.toLocaleString('fa-IR')} روز)${notePart}`;
  }

  if (r.sub_mode === 'multi_daily') {
    const times = Array.isArray(r.daily_times) ? r.daily_times : ['09:00'];
    const dCount = Math.max(1, Number(r.multi_days_count || 7));
    return `🗓️ ۲. چندبار در روز (${times.length.toLocaleString('fa-IR')} نوبت): ساعات [${times.join(' ، ')}] به مدت ${dCount.toLocaleString('fa-IR')} روز${notePart}`;
  }

  if (r.sub_mode === 'weekly_custom') {
    const wks = (r.selected_weeks || [1]).map(w => `هفته ${w.toLocaleString('fa-IR')}`).join('، ');
    const daysSummary = (r.selected_weekdays || []).map(wd => {
      const tArr = (r.weekday_times && Array.isArray(r.weekday_times[wd]) && r.weekday_times[wd].length > 0) ? r.weekday_times[wd] : ['09:00'];
      return `${wd} (${tArr.join(' و ')})`;
    }).join(' | ');
    return `🗓️ ۳. برنامه هفتگی (${wks}): ${daysSummary || 'بدون روز'}${notePart}`;
  }

  if (r.sub_mode === 'multi_page_series') {
    const cnt = (r.series_items || []).length;
    const step = Math.max(1, Number(r.series_step_days || 1));
    const stepTxt = step === 1 ? 'هر روز ۱ صفحه' : `هر ${step.toLocaleString('fa-IR')} روز ۱ صفحه`;
    return `📚 ۴. ارسال زنجیره‌ای چند محتوا: ${cnt.toLocaleString('fa-IR')} صفحه/تصویر (${stepTxt} در ساعت ${r.series_default_time || '09:00'})${notePart}`;
  }

  if (r.sub_mode === 'jalali_calendar') {
    const entries = Object.entries(r.calendar_day_slots || {}).filter(([_, arr]) => Array.isArray(arr) && arr.length > 0);
    const totalSlots = entries.reduce((acc, [_, arr]) => acc + arr.length, 0);
    return `📅 ۵. تقویم شمسی: ${entries.length.toLocaleString('fa-IR')} روز انتخابی (${totalSlots.toLocaleString('fa-IR')} نوبت انتشار)${notePart}`;
  }

  return '🗓️ ارسال زمان‌بندی شده';
}

function computeNextRunTimestampMs(rule, runsDone = 0) {
  const now = new Date();
  if (!rule || rule.mode === 'immediate') return now.getTime();
  const r = normalizeScheduleRuleObject(rule);

  let targetTimeStr = '09:00';
  if (r.sub_mode === 'once_daily') {
    targetTimeStr = r.once_time || '09:00';
  } else if (r.sub_mode === 'multi_daily' && Array.isArray(r.daily_times) && r.daily_times.length > 0) {
    // انتخاب اولین ساعت آینده در لیست ساعات روز
    const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const nextInToday = r.daily_times.slice().sort().find(t => t > nowHHMM);
    targetTimeStr = nextInToday || r.daily_times[0];
  } else if (r.sub_mode === 'multi_page_series' && Array.isArray(r.series_items) && r.series_items.length > 0) {
    const nextPage = r.series_items[Math.min(runsDone, r.series_items.length - 1)];
    targetTimeStr = (nextPage && nextPage.time) ? nextPage.time : (r.series_default_time || '09:00');
  }

  const parts = String(targetTimeStr || '09:00').split(':');
  const hh = Number(parts[0] || 9);
  const mm = Number(parts[1] || 0);
  const target = new Date(now.getTime());
  target.setHours(hh, mm, 0, 0);

  if (target.getTime() <= now.getTime()) {
    // اگر زمان امروز گذشته باشد، نوبت بعدی فردا در همان ساعت است
    target.setDate(target.getDate() + 1);
  }
  return target.getTime();
}

function setAhdbotSendMode(mode) {
  const rule = ensureComposerScheduleRuleInitialized();
  rule.mode = (mode === 'scheduled') ? 'scheduled' : 'immediate';
  SOCIAL_BOT_STATE.sendMode = rule.mode;
  renderCurrentPage(true);
}

function setAhdbotScheduleSubMode(subMode, isModal = false) {
  const targetRule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  targetRule.mode = 'scheduled';
  targetRule.sub_mode = subMode;
  if (subMode === 'multi_page_series' && (!Array.isArray(targetRule.series_items) || targetRule.series_items.length === 0)) {
    generateBookPagesSeriesTemplate(30, isModal);
    return;
  }
  if (isModal) {
    renderPostPublishingRuleModalDOM();
  } else {
    SOCIAL_BOT_STATE.sendMode = 'scheduled';
    renderCurrentPage(true);
  }
}

function updateComposerRuleField(field, value, rerender = true) {
  const rule = ensureComposerScheduleRuleInitialized();
  if (['days_count', 'multi_days_count', 'start_day_offset', 'series_step_days', 'series_start_day'].includes(field)) {
    const num = Number(faDigitsToEn(String(value || '0')).replace(/[^0-9]/g, ''));
    rule[field] = field === 'start_day_offset' ? Math.max(0, num) : Math.max(1, num || 1);
  } else {
    rule[field] = value;
  }
  if (['series_default_time', 'series_step_days', 'series_start_month', 'series_start_day'].includes(field)) {
    recalculateSeriesItemsDates(rule);
  }
  const previewEl = document.getElementById('bot-composer-live-rule-summary');
  if (previewEl) previewEl.textContent = formatPublishingRuleSummary(rule);
  if (rerender) renderCurrentPage(true);
}

function toggleMultiDailyTimeSlot(timeStr, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.daily_times)) rule.daily_times = [];
  if (rule.daily_times.includes(timeStr)) {
    if (rule.daily_times.length > 1) {
      rule.daily_times = rule.daily_times.filter(t => t !== timeStr);
    } else {
      showToast('حداقل یک ساعت باید در لیست ساعات روزانه باقی بماند.', 'warning');
    }
  } else {
    rule.daily_times.push(timeStr);
    rule.daily_times.sort();
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function addCustomMultiDailyTimeSlot(inputId, isModal = false) {
  const inp = document.getElementById(inputId);
  const val = (inp ? inp.value : '').trim();
  if (!val) return;
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.daily_times)) rule.daily_times = [];
  if (!rule.daily_times.includes(val)) {
    rule.daily_times.push(val);
    rule.daily_times.sort();
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function toggleWeeklyScheduleWeekNum(weekNum, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.selected_weeks)) rule.selected_weeks = [1, 2, 3, 4];
  const w = Number(weekNum);
  if (rule.selected_weeks.includes(w)) {
    if (rule.selected_weeks.length > 1) {
      rule.selected_weeks = rule.selected_weeks.filter(x => x !== w);
    }
  } else {
    rule.selected_weeks.push(w);
    rule.selected_weeks.sort();
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function toggleWeeklyScheduleWeekday(weekdayName, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!Array.isArray(rule.selected_weekdays)) rule.selected_weekdays = [];
  if (rule.selected_weekdays.includes(weekdayName)) {
    if (rule.selected_weekdays.length > 1) {
      rule.selected_weekdays = rule.selected_weekdays.filter(d => d !== weekdayName);
    }
  } else {
    rule.selected_weekdays.push(weekdayName);
    if (!rule.weekday_times[weekdayName] || rule.weekday_times[weekdayName].length === 0) {
      rule.weekday_times[weekdayName] = ['09:00'];
    }
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function addTimeForSpecificWeekday(weekdayName, inputId, isModal = false) {
  const inp = document.getElementById(inputId);
  const val = (inp ? inp.value : '').trim();
  if (!val) return;
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!rule.weekday_times || typeof rule.weekday_times !== 'object') rule.weekday_times = {};
  if (!Array.isArray(rule.weekday_times[weekdayName])) rule.weekday_times[weekdayName] = [];
  if (!rule.weekday_times[weekdayName].includes(val)) {
    rule.weekday_times[weekdayName].push(val);
    rule.weekday_times[weekdayName].sort();
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function removeTimeFromSpecificWeekday(weekdayName, timeStr, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!rule.weekday_times || !Array.isArray(rule.weekday_times[weekdayName])) return;
  if (rule.weekday_times[weekdayName].length <= 1) {
    showToast('برای روز انتخاب‌شده حداقل یک ساعت ارسال لازم است.', 'warning');
    return;
  }
  rule.weekday_times[weekdayName] = rule.weekday_times[weekdayName].filter(t => t !== timeStr);
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function switchJalaliCalendarMonth(monthKey, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  rule.active_jalali_month = monthKey;
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function toggleJalaliCalendarDaySlot(dateKey, defaultTimeInputId, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!rule.calendar_day_slots || typeof rule.calendar_day_slots !== 'object') {
    rule.calendar_day_slots = {};
  }
  const timeInp = document.getElementById(defaultTimeInputId);
  const chosenTime = (timeInp && timeInp.value) ? timeInp.value : '09:00';
  const cur = Array.isArray(rule.calendar_day_slots[dateKey]) ? rule.calendar_day_slots[dateKey] : [];
  if (!cur.includes(chosenTime)) {
    cur.push(chosenTime);
    cur.sort();
    rule.calendar_day_slots[dateKey] = cur;
  } else {
    rule.calendar_day_slots[dateKey] = cur.filter(t => t !== chosenTime);
    if (rule.calendar_day_slots[dateKey].length === 0) {
      delete rule.calendar_day_slots[dateKey];
    }
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function removeSpecificJalaliDayTimeSlot(dateKey, timeStr, isModal = false) {
  const rule = isModal && SOCIAL_BOT_STATE.editingRuleTarget
    ? SOCIAL_BOT_STATE.editingRuleTarget.rule
    : ensureComposerScheduleRuleInitialized();
  if (!rule.calendar_day_slots || !Array.isArray(rule.calendar_day_slots[dateKey])) return;
  rule.calendar_day_slots[dateKey] = rule.calendar_day_slots[dateKey].filter(t => t !== timeStr);
  if (rule.calendar_day_slots[dateKey].length === 0) {
    delete rule.calendar_day_slots[dateKey];
  }
  if (isModal) renderPostPublishingRuleModalDOM();
  else renderCurrentPage(true);
}

function getAllScheduledPostsForCalendar(includeCurrentDraft = true, activeRuleOverride = null) {
  const savedList = ensureSavedRepeatedPostsInitialized();
  const jobsList = ensureScheduledBotJobsInitialized();
  const combined = [];

  if (includeCurrentDraft) {
    const titleEl = typeof document !== 'undefined' ? document.getElementById('bot-post-title-input') : null;
    const capEl = typeof document !== 'undefined' ? document.getElementById('bot-post-caption-input') : null;
    const draftTitle = (titleEl && titleEl.value.trim()) || (capEl && capEl.value.trim().slice(0, 26)) || 'پست در حال تنظیم';
    const draftRule = activeRuleOverride || ensureComposerScheduleRuleInitialized();
    if (draftRule && draftRule.mode === 'scheduled') {
      combined.push({
        id: 'draft',
        title: draftTitle,
        rule: normalizeScheduleRuleObject(draftRule),
        colorIdx: 0
      });
    }
  }

  savedList.forEach((item, idx) => {
    const r = normalizeScheduleRuleObject(item.publishing_rule);
    r.mode = 'scheduled';
    combined.push({
      id: 'saved_' + item.id,
      title: item.title || (item.caption ? item.caption.slice(0, 26) : 'پست ذخیره‌شده'),
      rule: r,
      colorIdx: (idx + 1) % POST_SERIES_PALETTE.length
    });
  });

  jobsList.forEach((job, idx) => {
    const r = normalizeScheduleRuleObject(job.publishing_rule);
    r.mode = 'scheduled';
    combined.push({
      id: 'job_' + job.id,
      title: job.title || (job.caption ? job.caption.slice(0, 26) : 'پست صف زمان‌بندی'),
      rule: r,
      colorIdx: (idx + 2) % POST_SERIES_PALETTE.length
    });
  });

  return combined;
}

// رندر تقویم شمسی کامل کارت‌محور (بدون گانت‌چارت - طبق دستور ۲ کارفرما گانت‌چارت کاملاً حذف شد)
function renderJalaliCalendarSectionHTML(rule, isModal = false) {
  const r = normalizeScheduleRuleObject(rule);
  const monthKey = r.active_jalali_month || '1405-08';
  const mObj = getMonthCatalogObj(monthKey);
  const timeInputId = isModal ? 'modal-jalali-quick-time' : 'composer-jalali-quick-time';
  const allPosts = getAllScheduledPostsForCalendar(true, r);

  const leadingBlanks = Array.from({ length: mObj.startWeekdayIdx }, (_, i) => i);
  const daysArray = Array.from({ length: mObj.days }, (_, i) => i + 1);

  return `
    <div class="space-y-3.5">
      <div class="p-3 rounded-2xl bg-slate-950/90 border border-cyan-400/40 flex flex-wrap items-center justify-between gap-2.5">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="font-black text-amber-300 text-xs">📅 تقویم شمسی کامل (نمایش صفحات و ساعات هر روز):</span>
          ${JALALI_MONTHS_CATALOG.map(m => `
            <button type="button" onclick="switchJalaliCalendarMonth('${m.key}', ${isModal})"
              class="px-3 py-1.5 rounded-xl font-black text-[11px] border transition ${m.key === monthKey ? 'bg-amber-400 text-slate-950 border-amber-300 shadow' : 'glass-card text-slate-300 border-white/10'}">
              ${m.name}
            </button>
          `).join('')}
        </div>

        <div class="flex items-center gap-2">
          <label class="text-[11px] text-cyan-300 font-bold">⏰ ساعت درج روی کارت روز:</label>
          <input id="${timeInputId}" type="time" value="09:00" class="glass-input px-2.5 py-1 rounded-xl font-mono font-black text-cyan-300 text-xs dir-ltr" />
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1.5 text-center text-[10px] sm:text-[11px] font-black text-amber-300 px-0.5">
        ${PERSIAN_WEEKDAYS.map(wd => `<div class="py-1.5 rounded-xl bg-slate-900/80 border border-white/10 truncate">${wd}</div>`).join('')}
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
        ${leadingBlanks.map(() => `<div class="hidden md:block rounded-2xl bg-slate-950/30 border border-white/5 min-h-[96px]"></div>`).join('')}
        ${daysArray.map(dayNum => {
          const dateKey = `${mObj.key}-${String(dayNum).padStart(2, '0')}`;
          const weekdayName = PERSIAN_WEEKDAYS[(mObj.startWeekdayIdx + (dayNum - 1)) % 7];
          const isToday = mObj.todayDay === dayNum;
          const directSlots = (r.calendar_day_slots && Array.isArray(r.calendar_day_slots[dateKey])) ? r.calendar_day_slots[dateKey] : [];

          const dayPostSchedules = [];
          allPosts.forEach(pObj => {
            const pTimes = getRuleTimesForJalaliDay(pObj.rule, mObj.key, dayNum);
            if (pTimes.length > 0) {
              dayPostSchedules.push({
                id: pObj.id,
                title: pObj.title,
                times: pTimes,
                palette: POST_SERIES_PALETTE[pObj.colorIdx % POST_SERIES_PALETTE.length]
              });
            }
          });

          const hasAnySchedule = dayPostSchedules.length > 0 || directSlots.length > 0;

          return `
            <div onclick="if('${r.sub_mode}'==='jalali_calendar'){toggleJalaliCalendarDaySlot('${dateKey}', '${timeInputId}', ${isModal});}"
              class="p-2 rounded-2xl border transition flex flex-col justify-between min-h-[100px] ${
                r.sub_mode === 'jalali_calendar' ? 'cursor-pointer hover:border-amber-400' : ''
              } ${
                hasAnySchedule
                  ? 'bg-gradient-to-b from-slate-900/95 to-cyan-950/50 border-amber-400/60 shadow-[0_0_16px_rgba(251,191,36,0.16)]'
                  : 'bg-slate-950/75 border-white/10'
              }">
              <div class="flex items-center justify-between gap-1 border-b border-white/10 pb-1">
                <div class="flex items-center gap-1">
                  <span class="font-black text-xs sm:text-sm ${hasAnySchedule ? 'text-amber-300' : 'text-white'}">${dayNum.toLocaleString('fa-IR')}</span>
                  <span class="md:hidden text-[9px] text-slate-400">${weekdayName}</span>
                </div>
                ${isToday ? `<span class="px-1.5 py-0.5 rounded-md bg-emerald-500 text-slate-950 font-black text-[8px]">امروز</span>` : ''}
                ${r.sub_mode === 'jalali_calendar' ? `
                  <button type="button" onclick="event.stopPropagation(); toggleJalaliCalendarDaySlot('${dateKey}', '${timeInputId}', ${isModal});"
                    class="px-1.5 py-0.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-300 border border-cyan-400/40 font-black text-[9px]" title="افزودن ساعت انتشار در این روز">
                    + ساعت
                  </button>
                ` : ''}
              </div>

              <div class="space-y-1 my-1 flex-1">
                ${directSlots.map(tm => `
                  <div onclick="event.stopPropagation();" class="px-1.5 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-black text-[9px] flex items-center justify-between gap-1 shadow">
                    <span class="font-mono dir-ltr">⏰ ${escapeHtml(tm)}</span>
                    ${r.sub_mode === 'jalali_calendar' ? `<button type="button" onclick="removeSpecificJalaliDayTimeSlot('${dateKey}', '${tm}', ${isModal})" class="text-rose-900 hover:text-rose-700 font-black">✕</button>` : ''}
                  </div>
                `).join('')}

                ${dayPostSchedules.map(ps => `
                  <div class="p-1 rounded-lg border ${ps.palette.badge} text-[9px] space-y-0.5">
                    <div class="font-black truncate">${escapeHtml(ps.title)}</div>
                    <div class="flex flex-wrap gap-0.5">
                      ${ps.times.map(t => `<span class="px-1 py-0.2 rounded bg-black/30 font-mono dir-ltr text-[8px] font-black">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  </div>
                `).join('')}

                ${!hasAnySchedule ? `
                  <div class="text-[9px] text-slate-500 text-center py-2">
                    ${r.sub_mode === 'jalali_calendar' ? 'کلیک برای درج ساعت' : 'بدون ارسال'}
                  </div>
                ` : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// رندر پنل زمان‌بندی انتشار اختصاصی (شامل حالت جدید «ارسال زنجیره‌ای چند محتوا / ۳۰ صفحه کتاب در ۳۰ روز» + تقویم شمسی)
function renderScheduledFourMethodsPanelHTML(rule, isModal = false) {
  const r = normalizeScheduleRuleObject(rule);
  const subMode = r.sub_mode || 'once_daily';
  const customMultiInputId = isModal ? 'modal-custom-multi-time-inp' : 'composer-custom-multi-time-inp';
  const QUICK_HOURS = ['07:00', '08:30', '10:00', '12:30', '14:00', '16:30', '18:30', '20:30', '22:00'];
  const seriesItems = Array.isArray(r.series_items) ? r.series_items : [];

  return `
    <div class="space-y-2 text-xs">
      <!-- کشوی ۱: ارسال در یک ساعت خاص در روز -->
      <div class="rounded-2xl border overflow-hidden ${subMode === 'once_daily' ? 'border-amber-400 bg-slate-950/90 shadow' : 'border-white/15 glass-card'}">
        <button type="button" onclick="setAhdbotScheduleSubMode('once_daily', ${isModal})"
          class="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 font-black text-right ${subMode === 'once_daily' ? 'bg-amber-400 text-slate-950' : 'text-slate-200'}">
          <span>🕐 ۱. یک ساعت خاص در روز</span>
          <span class="text-[11px]">${subMode === 'once_daily' ? '▲ باز' : '▼ انتخاب'}</span>
        </button>
        ${subMode === 'once_daily' ? `
          <div class="p-3 grid grid-cols-3 gap-2.5">
            <div>
              <label class="block text-[11px] font-bold text-slate-300 mb-1">ساعت</label>
              <input type="time" value="${escapeHtml(r.once_time || '09:00')}"
                onchange="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.once_time=this.value; renderPostPublishingRuleModalDOM();" : "updateComposerRuleField('once_time', this.value, true)"}"
                class="glass-input w-full px-2 py-1.5 rounded-xl font-mono font-black text-cyan-300 dir-ltr" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-300 mb-1">شروع (روز دیگر)</label>
              <input type="number" min="0" max="60" value="${Number(r.start_day_offset || 0)}"
                oninput="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.start_day_offset=Math.max(0,Number(this.value||0));" : "updateComposerRuleField('start_day_offset', this.value, false)"}"
                class="glass-input w-full px-2 py-1.5 rounded-xl font-mono font-black text-amber-300 text-center dir-ltr" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-emerald-300 mb-1">تعداد روز</label>
              <input type="number" min="1" max="365" value="${Number(r.days_count || 7)}"
                oninput="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.days_count=Math.max(1,Number(this.value||1));" : "updateComposerRuleField('days_count', this.value, false)"}"
                class="glass-input w-full px-2 py-1.5 rounded-xl font-mono font-black text-emerald-300 text-center dir-ltr" />
            </div>
          </div>
        ` : ''}
      </div>

      <!-- کشوی ۲: ارسال چندین بار در ساعات مختلف روز -->
      <div class="rounded-2xl border overflow-hidden ${subMode === 'multi_daily' ? 'border-cyan-400 bg-slate-950/90 shadow' : 'border-white/15 glass-card'}">
        <button type="button" onclick="setAhdbotScheduleSubMode('multi_daily', ${isModal})"
          class="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 font-black text-right ${subMode === 'multi_daily' ? 'bg-cyan-400 text-slate-950' : 'text-slate-200'}">
          <span>⏰ ۲. چندبار در ساعات مختلف روز (${(r.daily_times || []).length.toLocaleString('fa-IR')} نوبت)</span>
          <span class="text-[11px]">${subMode === 'multi_daily' ? '▲ باز' : '▼ انتخاب'}</span>
        </button>
        ${subMode === 'multi_daily' ? `
          <div class="p-3 space-y-2.5">
            <div class="flex flex-wrap gap-1.5">
              ${QUICK_HOURS.map(qh => {
                const active = (r.daily_times || []).includes(qh);
                return `<button type="button" onclick="toggleMultiDailyTimeSlot('${qh}', ${isModal})" class="px-2 py-1 rounded-lg font-mono font-black text-[11px] border dir-ltr ${active ? 'bg-cyan-400 text-slate-950 border-cyan-300' : 'glass-card text-slate-300 border-white/10'}">${qh}</button>`;
              }).join('')}
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <input id="${customMultiInputId}" type="time" value="11:30" class="glass-input px-2 py-1 rounded-lg font-mono text-xs dir-ltr" />
              <button type="button" onclick="addCustomMultiDailyTimeSlot('${customMultiInputId}', ${isModal})" class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px]">+ افزودن</button>
              <div class="flex items-center gap-1 mr-auto">
                <span class="text-[11px] text-slate-300">تعداد روز:</span>
                <input type="number" min="1" max="365" value="${Number(r.multi_days_count || 7)}"
                  oninput="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.multi_days_count=Math.max(1,Number(this.value||1));" : "updateComposerRuleField('multi_days_count', this.value, false)"}"
                  class="glass-input w-14 px-2 py-1 rounded-lg font-mono text-center dir-ltr" />
              </div>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- کشوی ۳: ارسال در ایام هفته‌های مورد نظر -->
      <div class="rounded-2xl border overflow-hidden ${subMode === 'weekly_custom' ? 'border-emerald-400 bg-slate-950/90 shadow' : 'border-white/15 glass-card'}">
        <button type="button" onclick="setAhdbotScheduleSubMode('weekly_custom', ${isModal})"
          class="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 font-black text-right ${subMode === 'weekly_custom' ? 'bg-emerald-400 text-slate-950' : 'text-slate-200'}">
          <span>📆 ۳. ساعات خاص در ایام هفته‌ها</span>
          <span class="text-[11px]">${subMode === 'weekly_custom' ? '▲ باز' : '▼ انتخاب'}</span>
        </button>
        ${subMode === 'weekly_custom' ? `
          <div class="p-3 space-y-2.5">
            <div class="flex flex-wrap gap-1.5">
              ${PERSIAN_WEEK_NUMBERS.map(wObj => {
                const isWSelected = (r.selected_weeks || []).includes(wObj.id);
                return `<button type="button" onclick="toggleWeeklyScheduleWeekNum(${wObj.id}, ${isModal})" class="px-2.5 py-1 rounded-lg font-black text-[11px] border ${isWSelected ? 'bg-amber-400 text-slate-950 border-amber-300' : 'glass-card text-slate-300 border-white/10'}">${wObj.label}</button>`;
              }).join('')}
            </div>
            <div class="flex flex-wrap gap-1.5">
              ${PERSIAN_WEEKDAYS.map(wd => {
                const isDayOn = (r.selected_weekdays || []).includes(wd);
                return `<button type="button" onclick="toggleWeeklyScheduleWeekday('${wd}', ${isModal})" class="px-2.5 py-1 rounded-lg font-black text-[11px] border ${isDayOn ? 'bg-emerald-400 text-slate-950 border-emerald-300' : 'glass-card text-slate-300 border-white/10'}">${wd}</button>`;
              }).join('')}
            </div>
            <div class="space-y-1.5">
              ${(r.selected_weekdays || []).map((wd, wdIdx) => {
                const wdTimes = (r.weekday_times && Array.isArray(r.weekday_times[wd])) ? r.weekday_times[wd] : ['09:00'];
                const inpId = `${isModal ? 'modal' : 'comp'}-wd-time-${wdIdx}`;
                return `
                  <div class="p-2 rounded-xl glass-card flex flex-wrap items-center justify-between gap-1.5">
                    <div class="flex flex-wrap items-center gap-1">
                      <span class="font-black text-emerald-300 text-[11px]">${wd}:</span>
                      ${wdTimes.map(tm => `<span class="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] dir-ltr">${escapeHtml(tm)} <button type="button" onclick="removeTimeFromSpecificWeekday('${wd}', '${tm}', ${isModal})" class="text-rose-400">✕</button></span>`).join('')}
                    </div>
                    <div class="flex items-center gap-1">
                      <input id="${inpId}" type="time" value="18:00" class="glass-input px-1.5 py-0.5 rounded font-mono text-[11px] dir-ltr" />
                      <button type="button" onclick="addTimeForSpecificWeekday('${wd}', '${inpId}', ${isModal})" class="px-2 py-0.5 rounded bg-cyan-400 text-slate-950 font-black text-[10px]">+</button>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- کشوی ۴: ارسال زنجیره‌ای چند محتوا / ۳۰ صفحه کتاب در ۳۰ روز -->
      <div class="rounded-2xl border overflow-hidden ${subMode === 'multi_page_series' ? 'border-purple-400 bg-slate-950/90 shadow' : 'border-white/15 glass-card'}">
        <button type="button" onclick="setAhdbotScheduleSubMode('multi_page_series', ${isModal})"
          class="w-full px-3.5 py-2.5 flex items-center justify-between gap-2 font-black text-right ${subMode === 'multi_page_series' ? 'bg-purple-400 text-slate-950' : 'text-slate-200'}">
          <span>📚 ۴. ارسال زنجیره‌ای چند صفحه (${seriesItems.length.toLocaleString('fa-IR')} صفحه)</span>
          <span class="text-[11px]">${subMode === 'multi_page_series' ? '▲ باز' : '▼ انتخاب'}</span>
        </button>
        ${subMode === 'multi_page_series' ? `
          <div class="p-3 space-y-2.5">
            <div class="flex flex-wrap items-center gap-1.5">
              <button type="button" onclick="generateBookPagesSeriesTemplate(30, ${isModal})" class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-[11px]">۳۰ صفحه / ۳۰ روز</button>
              <button type="button" onclick="generateBookPagesSeriesTemplate(7, ${isModal})" class="px-2.5 py-1 rounded-lg bg-cyan-400/20 text-cyan-200 font-bold text-[11px]">۷ صفحه / ۷ روز</button>
              <input type="file" accept="image/*" multiple onchange="handleMultiSeriesFilesInput(this, ${isModal})" class="glass-input flex-1 min-w-[150px] px-2 py-1 rounded-lg text-[11px]" />
            </div>
            <div class="grid grid-cols-3 gap-2 items-center">
              <input type="time" value="${escapeHtml(r.series_default_time || '09:00')}" onchange="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.series_default_time=this.value;" : "updateComposerRuleField('series_default_time', this.value, false)"}" class="glass-input px-2 py-1 rounded-lg font-mono text-xs dir-ltr" />
              <input type="number" min="1" max="30" value="${Number(r.series_step_days || 1)}" oninput="${isModal ? "SOCIAL_BOT_STATE.editingRuleTarget.rule.series_step_days=Math.max(1,Number(this.value||1));" : "updateComposerRuleField('series_step_days', this.value, false)"}" class="glass-input px-2 py-1 rounded-lg font-mono text-center text-xs dir-ltr" title="فاصله روزها" />
              <button type="button" onclick="applyUniformTimeAndStepToAllSeriesPages(${isModal})" class="py-1.5 px-2 rounded-lg bg-emerald-400 text-slate-950 font-black text-[11px]">اعمال روی همه</button>
            </div>
            <div class="space-y-1.5 max-h-52 overflow-y-auto pr-0.5">
              ${seriesItems.map((it, idx) => `
                <div class="p-2 rounded-xl glass-card flex items-center justify-between gap-1.5 text-[11px]">
                  <span class="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-black shrink-0">ص${Number(it.page_num || (idx + 1)).toLocaleString('fa-IR')}</span>
                  ${it.data_url ? `<img src="${it.data_url}" loading="lazy" alt="" class="w-7 h-7 rounded object-cover shrink-0" />` : ''}
                  <span class="text-emerald-300 font-bold truncate">${escapeHtml(it.day_label || '')}</span>
                  <input type="time" value="${escapeHtml(it.time || r.series_default_time || '09:00')}" onchange="updateSeriesItemField(${idx}, 'time', this.value, ${isModal})" class="glass-input px-1.5 py-0.5 rounded font-mono text-[10px] dir-ltr" />
                  <button type="button" onclick="removeSeriesPageItem(${idx}, ${isModal})" class="text-rose-400 font-black px-1">✕</button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>

      <!-- کشوی ۵: تقویم شمسی کامل (فقط در صورت باز کردن کاربر نمایش داده می‌شود) -->
      <details class="rounded-2xl border border-white/15 glass-card overflow-hidden" ${subMode === 'jalali_calendar' ? 'open' : ''}>
        <summary onclick="if(!this.parentElement.open){setAhdbotScheduleSubMode('jalali_calendar', ${isModal});}" class="px-3.5 py-2.5 font-black cursor-pointer flex items-center justify-between list-none text-amber-300">
          <span>📅 ۵. تقویم شمسی کامل</span>
          <span class="text-[11px] opacity-80">▼ باز / بسته</span>
        </summary>
        <div class="p-2.5 border-t border-white/10">
          ${renderJalaliCalendarSectionHTML(r, isModal)}
        </div>
      </details>
    </div>
  `;
}

function openFullJalaliGanttCalendarModal() {
  const rule = ensureComposerScheduleRuleInitialized();
  rule.mode = 'scheduled';
  SOCIAL_BOT_STATE.sendMode = 'scheduled';
  openModal(`
    <div class="p-4 sm:p-6 space-y-4 text-xs max-w-4xl mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div>
          <h3 class="font-black text-amber-300 text-sm sm:text-base">📅 تقویم شمسی کامل زمان‌بندی پست‌ها و صفحات زنجیره‌ای</h3>
          <p class="text-[11px] text-slate-300 mt-0.5">مشاهده و تنظیم ساعت انتشار هر پست و صفحات زنجیره‌ای روی کارت‌های روزهای ماه شمسی</p>
        </div>
        <button type="button" onclick="closeModal(); renderCurrentPage(true);" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>
      ${renderJalaliCalendarSectionHTML(rule, false)}
      <div class="flex justify-end pt-2 border-t border-white/10">
        <button type="button" onclick="closeModal(); renderCurrentPage(true);" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg">
          ✓ تایید و بازگشت به استودیو
        </button>
      </div>
    </div>
  `);
}

function saveCurrentComposerToRepeatedLibrary() {
  const titleEl = document.getElementById('bot-post-title-input');
  const captionEl = document.getElementById('bot-post-caption-input');
  const title = (titleEl ? titleEl.value : '').trim();
  const caption = (captionEl ? captionEl.value : '').trim();
  const mediaType = SOCIAL_BOT_STATE.selectedMediaType || 'text';
  const mediaUrl = SOCIAL_BOT_STATE.selectedDataUrl || '';
  const rule = JSON.parse(JSON.stringify(ensureComposerScheduleRuleInitialized()));

  if (!caption && !title && !mediaUrl && (!rule.series_items || rule.series_items.length === 0)) {
    showToast('لطفاً ابتدا متن، تصویر یا صفحات زنجیره‌ای پست را وارد کنید.', 'warning');
    return;
  }

  const list = ensureSavedRepeatedPostsInitialized();
  const item = {
    id: Date.now(),
    title: title || (caption ? caption.slice(0, 38) : (rule.sub_mode === 'multi_page_series' ? `پست چندصفحه‌ای (${(rule.series_items || []).length} صفحه)` : 'پست ذخیره‌شده')),
    caption: caption || title,
    media_type: mediaType,
    media_url: mediaUrl && mediaUrl.length < 300000 ? mediaUrl : '',
    publishing_rule: rule,
    created_at: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  };
  list.unshift(item);
  saveRepeatedPostsToStorage();
  renderCurrentPage(true);
  showToast('📌 پست به همراه زمان‌بندی اختصاصی خود در بانک پست‌ها و تقویم شمسی ذخیره شد.');
}

function loadSavedPostIntoComposer(savedId) {
  const list = ensureSavedRepeatedPostsInitialized();
  const found = list.find(x => Number(x.id) === Number(savedId));
  if (!found) return;
  SOCIAL_BOT_STATE.selectedMediaType = found.media_type || 'text';
  SOCIAL_BOT_STATE.selectedDataUrl = found.media_url || '';
  SOCIAL_BOT_STATE.composerRule = normalizeScheduleRuleObject(found.publishing_rule);
  SOCIAL_BOT_STATE.sendMode = SOCIAL_BOT_STATE.composerRule.mode || 'immediate';
  renderCurrentPage(true);
  setTimeout(() => {
    const titleEl = document.getElementById('bot-post-title-input');
    const captionEl = document.getElementById('bot-post-caption-input');
    if (titleEl) titleEl.value = found.title || '';
    if (captionEl) captionEl.value = found.caption || '';
    showToast('📝 پست و زمان‌بندی اختصاصی آن در فرم بارگذاری شد.');
  }, 30);
}

async function resendSavedRepeatedPostNow(savedId) {
  const list = ensureSavedRepeatedPostsInitialized();
  const found = list.find(x => Number(x.id) === Number(savedId));
  if (!found) return;
  SOCIAL_BOT_STATE.selectedMediaType = found.media_type || 'text';
  SOCIAL_BOT_STATE.selectedDataUrl = found.media_url || '';
  const rule = ensureComposerScheduleRuleInitialized();
  const prevMode = rule.mode;
  rule.mode = 'immediate';
  SOCIAL_BOT_STATE.sendMode = 'immediate';
  renderCurrentPage(true);
  setTimeout(async () => {
    const titleEl = document.getElementById('bot-post-title-input');
    const captionEl = document.getElementById('bot-post-caption-input');
    if (titleEl) titleEl.value = found.title || '';
    if (captionEl) captionEl.value = found.caption || '';
    await submitSocialBotPublishAll(null);
    rule.mode = prevMode;
    SOCIAL_BOT_STATE.sendMode = prevMode;
  }, 40);
}

function activateSavedPostScheduleRule(savedId) {
  const list = ensureSavedRepeatedPostsInitialized();
  const found = list.find(x => Number(x.id) === Number(savedId));
  if (!found) return;
  const availableChannels = getMyRegisteredBotChannels();
  if (availableChannels.length === 0) {
    openAhdbotStepByStepWizardModal(1);
    showToast('ابتدا یک کانال یا گروه بالای ۵۰۰ عضو اضافه کنید.', 'warning');
    return;
  }
  const rule = normalizeScheduleRuleObject(found.publishing_rule);
  rule.mode = 'scheduled';

  const jobs = ensureScheduledBotJobsInitialized();
  const maxOcc = getTotalOccurrencesForRule(rule);
  const newJob = {
    id: Date.now(),
    title: found.title || 'پست زمان‌بندی‌شده',
    caption: found.caption || found.title,
    media_type: found.media_type || 'text',
    media_url: found.media_url || '',
    publishing_rule: rule,
    schedule_type: 'scheduled',
    max_occurrences: maxOcc,
    runs_count: 0,
    remaining_count: maxOcc,
    executed_slots: {},
    channels: availableChannels.map(c => ({
      id: c.id,
      platform: c.platform,
      channel_id: c.channel_id,
      media_title: c.media_title || c.channel_title,
      signature: c.signature || '',
      eitaa_token: c.eitaa_token || ''
    })),
    active: true,
    last_run: 'هنوز اجرا نشده',
    next_run_ms: computeNextRunTimestampMs(rule, 0),
    created_at: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  };
  jobs.unshift(newJob);
  saveScheduledBotJobsToStorage();
  renderCurrentPage(true);
  showToast(`⏰ زمان‌بندی پست «${newJob.title}» فعال شد!`);
}

function openPostPublishingRuleModal(targetId, sourceList = 'job') {
  const isJob = sourceList === 'job';
  const list = isJob ? ensureScheduledBotJobsInitialized() : ensureSavedRepeatedPostsInitialized();
  const item = list.find(x => Number(x.id) === Number(targetId));
  if (!item) return;

  const r = normalizeScheduleRuleObject(item.publishing_rule);
  SOCIAL_BOT_STATE.editingRuleTarget = { id: Number(targetId), sourceList, rule: r };
  renderPostPublishingRuleModalDOM();
}

function switchEditingPostRuleMode(newMode) {
  if (!SOCIAL_BOT_STATE.editingRuleTarget) return;
  SOCIAL_BOT_STATE.editingRuleTarget.rule.mode = (newMode === 'scheduled') ? 'scheduled' : 'immediate';
  renderPostPublishingRuleModalDOM();
}

function renderPostPublishingRuleModalDOM() {
  const ctx = SOCIAL_BOT_STATE.editingRuleTarget;
  if (!ctx) return;
  const isJob = ctx.sourceList === 'job';
  const list = isJob ? ensureScheduledBotJobsInitialized() : ensureSavedRepeatedPostsInitialized();
  const item = list.find(x => Number(x.id) === Number(ctx.id));
  if (!item) return;
  const r = normalizeScheduleRuleObject(ctx.rule);
  ctx.rule = r;

  openModal(`
    <div class="p-4 sm:p-6 space-y-4 text-xs max-w-3xl mx-auto">
      <div class="flex items-center justify-between border-b border-white/15 pb-3">
        <div>
          <h3 class="font-black text-amber-300 text-sm sm:text-base">⚙️ تنظیم نوع ارسال و زمان‌بندی انتشار اختصاصی پست</h3>
          <p class="text-[11px] text-slate-300 mt-0.5 truncate max-w-md">پست: ${escapeHtml(item.title || item.caption || '')}</p>
        </div>
        <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button type="button" onclick="switchEditingPostRuleMode('immediate')"
          class="p-3 rounded-2xl font-black border text-right transition flex items-center justify-between gap-2 ${r.mode === 'immediate' ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg' : 'glass-card text-slate-200 border-white/10'}">
          <div class="flex items-center gap-2">
            <span class="text-lg">🚀</span>
            <div>
              <div class="text-xs sm:text-sm font-black">ارسال فوری</div>
              <div class="text-[10px] opacity-80">انتشار آنی بلافاصله پس از تایید</div>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${r.mode === 'immediate' ? 'bg-slate-950 text-emerald-300' : 'bg-white/10 text-slate-300'}">فوری</span>
        </button>

        <button type="button" onclick="switchEditingPostRuleMode('scheduled')"
          class="p-3 rounded-2xl font-black border text-right transition flex items-center justify-between gap-2 ${r.mode === 'scheduled' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg' : 'glass-card text-slate-200 border-white/10'}">
          <div class="flex items-center gap-2">
            <span class="text-lg">🗓️</span>
            <div>
              <div class="text-xs sm:text-sm font-black">ارسال زمان‌بندی شده</div>
              <div class="text-[10px] opacity-80">ساعتی، چندبار در روز، هفتگی، ۳۰ صفحه کتاب در ۳۰ روز و تقویم شمسی</div>
            </div>
          </div>
          <span class="text-[10px] px-2 py-0.5 rounded-full ${r.mode === 'scheduled' ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-amber-300'}">هوشمند</span>
        </button>
      </div>

      ${r.mode === 'scheduled' ? renderScheduledFourMethodsPanelHTML(r, true) : `
        <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-400/35 text-emerald-300 font-bold text-center">
          🚀 این پست در حالت «ارسال فوری» قرار دارد؛ برای تعریف زمان‌بندی یا ارسال زنجیره‌ای چند صفحه در چند روز، کارت «ارسال زمان‌بندی شده» را انتخاب کنید.
        </div>
      `}

      <div class="flex justify-end gap-2 pt-2 border-t border-white/10">
        <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">انصراف</button>
        <button type="button" onclick="savePostPublishingRuleFromModal()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg">
          💾 ذخیره زمان‌بندی اختصاصی پست
        </button>
      </div>
    </div>
  `);
}

function savePostPublishingRuleFromModal() {
  const ctx = SOCIAL_BOT_STATE.editingRuleTarget;
  if (!ctx) return;
  const r = normalizeScheduleRuleObject(ctx.rule);

  const isJob = ctx.sourceList === 'job';
  const list = isJob ? ensureScheduledBotJobsInitialized() : ensureSavedRepeatedPostsInitialized();
  const item = list.find(x => Number(x.id) === Number(ctx.id));
  if (item) {
    item.publishing_rule = JSON.parse(JSON.stringify(r));
    if (isJob) {
      item.schedule_type = r.mode;
      item.max_occurrences = getTotalOccurrencesForRule(r);
      item.remaining_count = Math.max(0, item.max_occurrences - Number(item.runs_count || 0));
      item.next_run_ms = computeNextRunTimestampMs(r, Number(item.runs_count || 0));
      item.active = true;
      saveScheduledBotJobsToStorage();
    } else {
      saveRepeatedPostsToStorage();
    }
  }
  closeModal();
  renderCurrentPage(true);
  showToast(`✅ زمان‌بندی پست بروزرسانی شد: ${formatPublishingRuleSummary(r)}`);
}

function deleteSavedRepeatedPost(savedId) {
  const list = ensureSavedRepeatedPostsInitialized();
  state.ahdbotSavedPosts = list.filter(x => Number(x.id) !== Number(savedId));
  saveRepeatedPostsToStorage();
  renderCurrentPage(true);
  showToast('محتوای ذخیره‌شده حذف شد.');
}

function toggleScheduledJobStatus(jobId) {
  const jobs = ensureScheduledBotJobsInitialized();
  const job = jobs.find(j => Number(j.id) === Number(jobId));
  if (!job) return;
  job.active = !job.active;
  saveScheduledBotJobsToStorage();
  renderCurrentPage(true);
  showToast(job.active ? '⏰ زمان‌بندی فعال شد.' : '⏸️ زمان‌بندی متوقف شد.');
}

function deleteScheduledBotJob(jobId) {
  const jobs = ensureScheduledBotJobsInitialized();
  state.ahdbotScheduledJobs = jobs.filter(j => Number(j.id) !== Number(jobId));
  saveScheduledBotJobsToStorage();
  renderCurrentPage(true);
  showToast('زمان‌بندی حذف شد.');
}

// ==============================================================================
// موتور اجرای دقیق و واقعی تک‌تک زمان‌بندی‌ها (Requirement 3)
// ارسال واقعی هر نوبت (یا صفحه جاری از ۳۰ صفحه کتاب) به تمامی کانال‌های انتخاب‌شده
// ==============================================================================
async function dispatchScheduledJobPayloadToChannels(job) {
  if (!job) return false;
  const r = normalizeScheduleRuleObject(job.publishing_rule);
  const currentRunIdx = Number(job.runs_count || 0);
  let effectiveTitle = job.title || '';
  let effectiveCaption = job.caption || job.title || '';
  let effectiveMediaType = job.media_type || 'text';
  let effectiveMediaData = job.media_url || '';

  // اگر پست از نوع «ارسال زنجیره‌ای چند محتوا / ۳۰ صفحه کتاب در ۳۰ روز» است، صفحه مربوط به نوبت فعلی را انتخاب کن
  if (r.sub_mode === 'multi_page_series' && Array.isArray(r.series_items) && r.series_items.length > 0) {
    const pageItem = r.series_items[Math.min(currentRunIdx, r.series_items.length - 1)];
    if (pageItem) {
      const pageBadge = `📖 صفحه ${Number(pageItem.page_num || (currentRunIdx + 1)).toLocaleString('fa-IR')} از ${r.series_items.length.toLocaleString('fa-IR')}`;
      effectiveTitle = job.title ? `${job.title} (${pageBadge})` : pageBadge;
      effectiveCaption = [pageItem.custom_caption || '', job.caption || ''].filter(Boolean).join('\n\n') || effectiveTitle;
      if (pageItem.data_url) {
        effectiveMediaData = pageItem.data_url;
        effectiveMediaType = 'image';
      }
      pageItem.sent = true;
    }
  }

  const targetChannels = (Array.isArray(job.channels) && job.channels.length > 0)
    ? job.channels
    : getMyRegisteredBotChannels();

  const authorInfo = getCurrentPublisherAuthorInfo();

  for (let i = 0; i < targetChannels.length; i++) {
    const ch = targetChannels[i];
    const finalCaption = ch.signature
      ? `${effectiveCaption}

━━━━━━━━━━━━━━
${ch.signature}`
      : effectiveCaption;
    try {
      const fd = new FormData();
      fd.append('targets', ch.platform || 'bale');
      fd.append('channel_override', ch.channel_id || '');
      fd.append('channel_signature', ch.signature || '');
      if (ch.platform === 'eitaa' && ch.eitaa_token) {
        fd.append('eitaa_token', ch.eitaa_token);
      }
      fd.append('media_type', effectiveMediaType);
      fd.append('title', effectiveTitle);
      fd.append('caption', finalCaption);
      fd.append('author_username', authorInfo.username);
      fd.append('author_name', authorInfo.name);
      fd.append('skip_db_insert', '1');
      if (effectiveMediaData) {
        fd.append('media_data', effectiveMediaData);
      }
      await fetch('api/index.php?action=bot_publish', { method: 'POST', body: fd });
    } catch (e) {}
  }

  // ثبت در گزارش ارسال‌های انجام‌شده
  if (!Array.isArray(SOCIAL_BOT_STATE.sentLogs)) SOCIAL_BOT_STATE.sentLogs = [];
  SOCIAL_BOT_STATE.sentLogs.unshift({
    id: Date.now(),
    timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    title: effectiveTitle || 'ارسال زمان‌بندی‌شده خودکار',
    caption: effectiveCaption,
    media_type: effectiveMediaType,
    channels: targetChannels.map(c => `${getPlatformFaLabel(c.platform)} (${c.channel_id})`),
    author_name: authorInfo.name,
    status: 'published'
  });

  job.runs_count = currentRunIdx + 1;
  const maxOcc = Number(job.max_occurrences || getTotalOccurrencesForRule(r) || 1);
  job.remaining_count = Math.max(0, maxOcc - job.runs_count);
  job.last_run = new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' });
  if (job.runs_count >= maxOcc) {
    job.active = false;
    job.completed = true;
  } else {
    job.next_run_ms = computeNextRunTimestampMs(r, job.runs_count);
  }
  saveScheduledBotJobsToStorage();
  return true;
}

async function executeScheduledBotJobNow(jobId) {
  const jobs = ensureScheduledBotJobsInitialized();
  const job = jobs.find(j => Number(j.id) === Number(jobId));
  if (!job) return;
  showToast('🔄 در حال اجرای نوبت فعلی زمان‌بندی و ارسال به کانال‌ها...');
  await dispatchScheduledJobPayloadToChannels(job);
  renderCurrentPage(true);
  showToast(`✅ نوبت ${Number(job.runs_count).toLocaleString('fa-IR')} از «${job.title}» با موفقیت ارسال شد.`);
}

let __ahdbotSchedulerInterval = null;
function initAhdbotSchedulerEngine() {
  if (__ahdbotSchedulerInterval) return;
  __ahdbotSchedulerInterval = setInterval(async () => {
    const jobs = ensureScheduledBotJobsInitialized();
    const now = new Date();
    const nowMs = now.getTime();
    const nowHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const todayKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    let anyDispatched = false;

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      if (!job || !job.active) continue;
      if (!job.executed_slots || typeof job.executed_slots !== 'object') {
        job.executed_slots = {};
      }
      const r = normalizeScheduleRuleObject(job.publishing_rule);
      const slotKey = `${todayKey}_${nowHHMM}`;

      // بررسی تطابق دقیق ساعت فعلی با ساعت(های) تعریف‌شده در زمان‌بندی پست یا رسیدن موعد next_run_ms
      let isDueNow = false;
      if (job.next_run_ms && nowMs >= Number(job.next_run_ms)) {
        isDueNow = true;
      } else if (!job.executed_slots[slotKey]) {
        if (r.sub_mode === 'once_daily' && r.once_time === nowHHMM) {
          isDueNow = true;
        } else if (r.sub_mode === 'multi_daily' && Array.isArray(r.daily_times) && r.daily_times.includes(nowHHMM)) {
          isDueNow = true;
        } else if (r.sub_mode === 'multi_page_series' && Array.isArray(r.series_items)) {
          const curPage = r.series_items[Number(job.runs_count || 0)];
          if (curPage && curPage.time === nowHHMM) isDueNow = true;
        }
      }

      if (isDueNow && !job.executed_slots[slotKey]) {
        job.executed_slots[slotKey] = true;
        await dispatchScheduledJobPayloadToChannels(job);
        anyDispatched = true;
      }
    }

    if (anyDispatched && state.currentPage === 'social_bot') {
      renderCurrentPage(true);
    }
  }, 10000);
}
initAhdbotSchedulerEngine();

function removeRegisteredBotChannel(channelId, platform, ownerUsername) {
  const list = ensureRegisteredBotChannelsInitialized();
  const targetObj = list.find(c =>
    c.channel_id === channelId && c.platform === platform && String(c.owner_username).toLowerCase() === String(ownerUsername).toLowerCase()
  );
  state.registeredBotChannels = list.filter(c =>
    !(c.channel_id === channelId && c.platform === platform && String(c.owner_username).toLowerCase() === String(ownerUsername).toLowerCase())
  );
  saveState();
  renderCurrentPage(true);
  callServerApi('delete_bot_channel', { id: targetObj ? targetObj.id : 0, owner_username: ownerUsername, platform, channel_id: channelId });
  try { fetch('api/index.php?action=bot_unregister_global_channel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform, channel_id: channelId }) }); } catch (e) {}
  showToast(`کانال ${channelId} حذف شد.`);
}

function toggleSelectAllBotChannels(checked) {
  document.querySelectorAll('.chk-registered-bot-channel').forEach(el => {
    el.checked = Boolean(checked);
  });
}

async function submitSocialBotPublishAll(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal('social_bot');
    return;
  }
  if (SOCIAL_BOT_STATE.isPublishing || SOCIAL_BOT_STATE.queueRunning) return;

  const titleEl = document.getElementById('bot-post-title-input');
  const captionEl = document.getElementById('bot-post-caption-input');
  const title = (titleEl ? titleEl.value : '').trim();
  const caption = (captionEl ? captionEl.value : '').trim();
  const authorInfo = getCurrentPublisherAuthorInfo();
  const mediaType = SOCIAL_BOT_STATE.selectedMediaType || 'text';
  const rule = ensureComposerScheduleRuleInitialized();
  const sendMode = rule.mode === 'scheduled' ? 'scheduled' : 'immediate';
  const hasSeriesPages = rule.sub_mode === 'multi_page_series' && Array.isArray(rule.series_items) && rule.series_items.length > 0;

  if (!hasSeriesPages && mediaType === 'text' && !caption && !title) {
    showToast('لطفاً متن پیام را وارد نمایید.', 'error');
    if (captionEl) captionEl.focus();
    return;
  }
  if (!hasSeriesPages && (mediaType === 'image' || mediaType === 'video' || mediaType === 'audio') && !SOCIAL_BOT_STATE.selectedDataUrl && !SOCIAL_BOT_STATE.selectedFile) {
    showToast('لطفاً فایل رسانه را انتخاب کنید.', 'error');
    return;
  }

  const availableChannels = getMyRegisteredBotChannels();
  if (availableChannels.length === 0) {
    openAhdbotStepByStepWizardModal(1);
    showToast('هنوز هیچ کانال یا گروهی ثبت نشده است؛ ابتدا کانال یا گروه خود را اضافه نمایید.', 'warning');
    return;
  }

  const checkedEls = Array.from(document.querySelectorAll('.chk-registered-bot-channel:checked'));
  let selectedChannels = [];
  checkedEls.forEach(chk => {
    const cid = Number(chk.getAttribute('data-cid'));
    const found = availableChannels.find(c => Number(c.id) === cid);
    if (found) selectedChannels.push(found);
  });

  if (selectedChannels.length === 0 && availableChannels.length > 0) {
    selectedChannels = [availableChannels[0]];
  }

  const chkSaveRepeat = document.getElementById('chk-save-to-repeated-lib');
  if (chkSaveRepeat && chkSaveRepeat.checked) {
    saveCurrentComposerToRepeatedLibrary();
  }

  if (sendMode === 'scheduled') {
    const ruleSnapshot = JSON.parse(JSON.stringify(rule));
    const maxOcc = getTotalOccurrencesForRule(ruleSnapshot);
    const jobs = ensureScheduledBotJobsInitialized();
    const newJob = {
      id: Date.now(),
      schedule_type: 'scheduled',
      publishing_rule: ruleSnapshot,
      max_occurrences: maxOcc,
      runs_count: 0,
      remaining_count: maxOcc,
      executed_slots: {},
      title: title || (caption ? caption.slice(0, 38) : (hasSeriesPages ? `ارسال زنجیره‌ای (${ruleSnapshot.series_items.length.toLocaleString('fa-IR')} صفحه)` : 'پست زمان‌بندی‌شده')),
      caption: caption || title,
      media_type: hasSeriesPages ? 'image' : mediaType,
      media_url: (SOCIAL_BOT_STATE.selectedDataUrl && SOCIAL_BOT_STATE.selectedDataUrl.length < 300000) ? SOCIAL_BOT_STATE.selectedDataUrl : '',
      channels: selectedChannels.map(c => ({
        id: c.id,
        platform: c.platform,
        channel_id: c.channel_id,
        media_title: c.media_title || c.channel_title,
        signature: c.signature || '',
        eitaa_token: c.eitaa_token || ''
      })),
      active: true,
      completed: false,
      last_run: 'هنوز اجرا نشده',
      next_run_ms: computeNextRunTimestampMs(ruleSnapshot, 0),
      created_at: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
    };
    jobs.unshift(newJob);
    saveScheduledBotJobsToStorage();
    renderCurrentPage(true);
    showToast(`✅ زمان‌بندی با موفقیت فعال شد: ${formatPublishingRuleSummary(ruleSnapshot)}`);
    return;
  }

  let mediaUrlToStore = SOCIAL_BOT_STATE.selectedDataUrl || '';

  SOCIAL_BOT_STATE.isPublishing = true;
  SOCIAL_BOT_STATE.queueRunning = true;
  SOCIAL_BOT_STATE.queueProgressPct = 10;
  SOCIAL_BOT_STATE.queueItems = selectedChannels.map((ch, idx) => ({
    step: idx + 1,
    platform: ch.platform,
    channel_id: ch.channel_id,
    media_title: ch.media_title || ch.channel_title,
    signature: ch.signature || '',
    eitaa_token: ch.eitaa_token || '',
    members_count: Number(ch.members_count || 500),
    owner_name: ch.owner_name,
    status: 'waiting',
    status_text: '⏳ در صف ارسال'
  }));
  renderCurrentPage(true);

  for (let i = 0; i < SOCIAL_BOT_STATE.queueItems.length; i++) {
    const qItem = SOCIAL_BOT_STATE.queueItems[i];
    qItem.status = 'sending';
    qItem.status_text = '🔄 در حال ارسال به ' + getPlatformFaLabel(qItem.platform) + '...';
    SOCIAL_BOT_STATE.queueProgressPct = Math.round(((i + 0.5) / SOCIAL_BOT_STATE.queueItems.length) * 100);
    updateLiveQueueDomUI();

    const baseCaption = caption || title;
    const finalCaptionForChannel = qItem.signature
      ? `${baseCaption}

━━━━━━━━━━━━━━
${qItem.signature}`
      : baseCaption;

    try {
      const fd = new FormData();
      fd.append('targets', qItem.platform);
      fd.append('channel_override', qItem.channel_id);
      fd.append('channel_signature', qItem.signature || '');
      if (qItem.platform === 'eitaa' && qItem.eitaa_token) {
        fd.append('eitaa_token', qItem.eitaa_token);
      }
      fd.append('media_type', mediaType);
      fd.append('title', title);
      fd.append('caption', finalCaptionForChannel);
      fd.append('author_username', authorInfo.username);
      fd.append('author_name', authorInfo.name);
      fd.append('skip_db_insert', '1');
      if (SOCIAL_BOT_STATE.selectedFile) {
        fd.append('media', SOCIAL_BOT_STATE.selectedFile);
      } else if (mediaUrlToStore) {
        fd.append('media_data', mediaUrlToStore);
      }

      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const tId = controller ? setTimeout(() => { try { controller.abort(); } catch (e) {} }, 60000) : null;
      let deliveredOk = false;
      let deliveryErrMsg = '';
      try {
        const resp = await fetch('api/index.php?action=bot_publish&_ts=' + Date.now(), {
          method: 'POST',
          cache: 'no-store',
          body: fd,
          signal: controller ? controller.signal : undefined
        });
        const rawRespText = await resp.text();
        let rJson = null;
        try { rJson = rawRespText ? JSON.parse(rawRespText) : null; } catch (jsonErr) {
          const snippet = String(rawRespText || '').replace(/<[^>]+>/g, ' ').trim().slice(0, 140);
          deliveryErrMsg = 'پاسخ غیرJSON از سرور (HTTP ' + resp.status + '): ' + (snippet || 'پاسخ خالی');
        }
        if (rJson && Array.isArray(rJson.history)) {
          SOCIAL_BOT_STATE.history = rJson.history;
        }
        const pfRes = (rJson && rJson.results && rJson.results[qItem.platform]) ? rJson.results[qItem.platform] : null;
        if (pfRes && pfRes.ok === true) {
          deliveredOk = true;
        } else if (!deliveryErrMsg) {
          deliveryErrMsg = (pfRes && pfRes.error) ? pfRes.error : ((rJson && rJson.error) ? rJson.error : ('پاسخ خالی از سرور (HTTP ' + resp.status + ')'));
        }
      } finally {
        if (tId) clearTimeout(tId);
      }
      if (deliveredOk) {
        qItem.status = 'done';
        qItem.status_text = '✅ ارسال واقعی شد (' + getPlatformFaLabel(qItem.platform) + ')';
      } else {
        qItem.status = 'error';
        qItem.status_text = '❌ خطا: ' + deliveryErrMsg;
      }
    } catch (err) {
      qItem.status = 'error';
      qItem.status_text = '❌ خطای اتصال به سرور: ' + (err && err.message ? err.message : 'نامشخص');
    }

    SOCIAL_BOT_STATE.queueProgressPct = Math.round(((i + 1) / SOCIAL_BOT_STATE.queueItems.length) * 100);
    updateLiveQueueDomUI();
  }

  const succeededChannels = SOCIAL_BOT_STATE.queueItems.filter(x => x.status === 'done');
  if (succeededChannels.length > 0) {
    const sentRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      title: title || 'پیام ارسالی عهدبات',
      caption: caption || title,
      media_type: mediaType,
      channels: succeededChannels.map(c => `${getPlatformFaLabel(c.platform)} (${c.channel_id})`),
      author_name: authorInfo.name,
      status: 'published'
    };
    if (!Array.isArray(SOCIAL_BOT_STATE.sentLogs)) SOCIAL_BOT_STATE.sentLogs = [];
    SOCIAL_BOT_STATE.sentLogs.unshift(sentRecord);
  }

  SOCIAL_BOT_STATE.isPublishing = false;
  SOCIAL_BOT_STATE.queueRunning = false;
  SOCIAL_BOT_STATE.selectedFile = null;
  SOCIAL_BOT_STATE.selectedDataUrl = '';
  SOCIAL_BOT_STATE.recordedAudioDataUrl = '';
  saveState();
  renderCurrentPage(true);
  const okCnt = SOCIAL_BOT_STATE.queueItems.filter(x => x.status === 'done').length;
  const errCnt = SOCIAL_BOT_STATE.queueItems.length - okCnt;
  if (okCnt > 0 && errCnt === 0) {
    showToast(`✅ محتوا با موفقیت واقعی به ${okCnt.toLocaleString('fa-IR')} کانال/گروه ارسال شد.`);
  } else if (okCnt > 0) {
    showToast(`⚠️ به ${okCnt.toLocaleString('fa-IR')} مقصد ارسال شد و ${errCnt.toLocaleString('fa-IR')} مقصد خطا داشت (جزئیات در لیست صف).`, 'warning');
  } else {
    const firstErr = (SOCIAL_BOT_STATE.queueItems[0] && SOCIAL_BOT_STATE.queueItems[0].status_text) || 'خطا در ارسال';
    showToast(firstErr, 'error');
  }
}

function updateLiveQueueDomUI() {
  const bar = document.getElementById('bot-queue-progress-bar');
  const pctTxt = document.getElementById('bot-queue-progress-pct');
  const listEl = document.getElementById('bot-queue-live-items');
  if (bar) bar.style.width = `${SOCIAL_BOT_STATE.queueProgressPct}%`;
  if (pctTxt) pctTxt.textContent = `${SOCIAL_BOT_STATE.queueProgressPct.toLocaleString('fa-IR')}٪`;
  if (listEl) {
    listEl.innerHTML = SOCIAL_BOT_STATE.queueItems.map(item => `
      <div class="p-2.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
        item.status === 'done'
          ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
          : item.status === 'error'
            ? 'bg-rose-500/20 border-rose-500/60 text-rose-200'
            : item.status === 'sending'
            ? 'bg-amber-500/20 border-amber-400/60 text-amber-200'
            : 'bg-slate-900/80 border-white/10 text-slate-400'
      }">
        <div class="flex items-center gap-2 min-w-0">
          <span class="px-2 py-0.5 rounded-lg bg-black/40 font-black text-[10px]">#${item.step.toLocaleString('fa-IR')}</span>
          <span class="font-bold text-white">${escapeHtml(item.media_title)}</span>
          <span class="font-mono text-[10px] text-amber-300 dir-ltr">${escapeHtml(item.channel_id)}</span>
        </div>
        <span class="font-black text-[11px] shrink-0">${item.status_text}</span>
      </div>
    `).join('');
  }
}

// ==============================================================================
// رابط کاربری عهدبات نسخه v3.3.5 (پیشخوان ۲ کارته + استودیو دستیار هوشمند رسانه)
// ==============================================================================
/* HAMAHDI v5.0: direct back to home */
function openAhdbotMainHub() {
  if (typeof returnToLandingPage === 'function') { returnToLandingPage(); }
}
