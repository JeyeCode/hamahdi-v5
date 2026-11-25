/**
 * HAMAHDI v4.0.0 | ماژول رابط کاربری پیشخوان دوکارته عهدبات و استودیو دستیار هوشمند رسانه
 */
function renderSocialBotStudioPage(embeddedInProfile = false, embeddedInAdminDashboard = false) {
  const _subViewCheck = embeddedInAdminDashboard ? 'media_assistant' : (SOCIAL_BOT_STATE.entrySubView || 'hub');
  if (_subViewCheck === 'media_assistant' && !embeddedInProfile && !embeddedInAdminDashboard && !isRegisteredUser() && !isAdmin()) {
    setTimeout(() => openUnifiedAppEntryModal('social_bot'), 20);
  }
  const adminMode = isAdmin();
  const myApprovedChannels = getMyRegisteredBotChannels();
  const mType = SOCIAL_BOT_STATE.selectedMediaType || 'text';
  const rule = ensureComposerScheduleRuleInitialized();
  const sendMode = rule.mode === 'scheduled' ? 'scheduled' : 'immediate';
  const sentLogs = Array.isArray(SOCIAL_BOT_STATE.sentLogs) ? SOCIAL_BOT_STATE.sentLogs : [];
  const savedRepeatedList = ensureSavedRepeatedPostsInitialized();
  const scheduledJobs = ensureScheduledBotJobsInitialized();
  const filterPf = SOCIAL_BOT_STATE.channelFilterPlatform || 'all';
  const entrySubView = embeddedInAdminDashboard ? 'media_assistant' : (SOCIAL_BOT_STATE.entrySubView || 'hub');

  if (entrySubView === 'hub') {
    return `
      <div class="space-y-5 pb-24">
        <section class="glass-panel rounded-3xl p-4 sm:p-5 border border-amber-400/45 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
                🤖
              </div>
              <div>
                <h1 class="text-base sm:text-xl font-black text-white">اکوسیستم هوشمند عهدبات</h1>
                <p class="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                  انتخاب بخش مورد نظر: دستیار هوشمند رسانه (۴ شبکه اجتماعی + زمان‌بندی زنجیره‌ای و تقویم شمسی) یا هوش مصنوعی هم‌عهدی
                </p>
              </div>
            </div>
            <button type="button" onclick="returnToLandingPage()" class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition">
              بازگشت به پیشخوان اصلی ←
            </button>
          </div>
        </section>

        <section class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <!-- کارت بزرگ ۱: ورود به دستیار هوشمند رسانه (فعال) -->
          <div onclick="enterAhdbotMediaAssistant()" class="glass-panel hm-ahdbot-hub-card-active rounded-3xl p-5 sm:p-7 border-2 border-amber-400 shadow-[0_0_32px_rgba(251,191,36,0.22)] cursor-pointer flex flex-col justify-between group relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div class="space-y-4 relative z-10">
              <div class="flex items-start justify-between gap-3">
                <div class="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center text-3xl shadow-xl">
                  📡
                </div>
                <span class="px-3.5 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow-lg">
                  ✓ فعال و آماده بهره‌برداری
                </span>
              </div>

              <div>
                <h2 class="text-lg sm:text-2xl font-black text-white">ورود به دستیار هوشمند رسانه</h2>
                <p class="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  انتشار هوشمند محتوا در کانال‌ها و گروه‌های بالای ۵۰۰ عضو همراه با زمان‌بندی زنجیره‌ای چندمحتوایی (مثلاً ۳۰ صفحه کتاب در ۳۰ روز) و تقویم شمسی کامل
                </p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                <div class="p-3 rounded-2xl glass-card border border-amber-400/35 flex items-center gap-2.5">
                  <span class="text-lg">🌐</span>
                  <div>
                    <div class="font-black text-amber-300">۴ شبکه متصل</div>
                    <div class="text-[11px] text-slate-300">روبیکا • بله • ایتا (ایتایار) • تلگرام</div>
                  </div>
                </div>
                <div class="p-3 rounded-2xl glass-card border border-cyan-400/35 flex items-center gap-2.5">
                  <span class="text-lg">📚</span>
                  <div>
                    <div class="font-black text-cyan-300">ارسال زنجیره‌ای چند صفحه</div>
                    <div class="text-[11px] text-slate-300">مثلاً ۳۰ صفحه کتاب در ۳۰ روز در ساعت خاص</div>
                  </div>
                </div>
                <div class="p-3 rounded-2xl glass-card border border-emerald-400/35 flex items-center gap-2.5">
                  <span class="text-lg">✒️</span>
                  <div>
                    <div class="font-black text-emerald-300">امضای اختصاصی هر کانال</div>
                    <div class="text-[11px] text-slate-300">درج خودکار کپشن و لینک انتهای پست</div>
                  </div>
                </div>
                <div class="p-3 rounded-2xl glass-card border border-purple-400/35 flex items-center gap-2.5">
                  <span class="text-lg">⚡</span>
                  <div>
                    <div class="font-black text-purple-300">بدون اشغال فضای سرور</div>
                    <div class="text-[11px] text-slate-300">رله مستقیم فایل‌ها بدون ذخیره در آپلودها</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="pt-6 relative z-10">
              <button type="button" onclick="event.stopPropagation(); enterAhdbotMediaAssistant();" class="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl flex items-center justify-between group-hover:scale-[1.01] transition">
                <span>🚀 ورود به دستیار هوشمند رسانه و استودیو زمان‌بندی</span>
                <span>←</span>
              </button>
            </div>
          </div>

          <!-- کارت بزرگ ۲: دستیار هوش مصنوعی متنی هم‌عهدی (فعال - فقط حالت متنی) -->
              <div onclick="openHamahdiAiChatPage()" class="glass-panel hm-ahdbot-hub-card-ai rounded-3xl p-5 sm:p-7 border-2 border-cyan-400/55 cursor-pointer transition-all shadow-xl group relative overflow-hidden">
                <div class="relative z-10 flex flex-col justify-between h-full space-y-4">
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-2xl sm:text-3xl shadow-lg shrink-0">✨</div>
                      <div>
                        <h2 class="text-lg sm:text-2xl font-black text-white">دستیار هوش مصنوعی هم‌عهدی</h2>
                        <div class="text-[11px] font-bold text-cyan-300 mt-0.5">حالت فقط متنی • تولید کپشن، متن آگهی و پاسخگویی فارسی</div>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-black shadow shrink-0">فعال</span>
                  </div>
                  <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    چت‌باکس هوشمند <strong>فقط متنی</strong> برای نوشتن کپشن کانال‌های بله، ایتا، روبیکا و تلگرام، نگارش متن آگهی عهد بازار، بازنویسی، خلاصه‌سازی و پیشنهاد هشتگ با انتقال مستقیم به استودیو ارسال.
                  </p>
                  <div class="grid grid-cols-2 gap-2 text-[11px] font-bold">
                    <div class="p-2 rounded-xl glass-card border border-cyan-400/35 text-cyan-300">💬 گفتگوی متنی فارسی</div>
                    <div class="p-2 rounded-xl glass-card border border-amber-400/35 text-amber-300">📝 کپشن ۴ پیام‌رسان</div>
                    <div class="p-2 rounded-xl glass-card border border-emerald-400/35 text-emerald-300">🛍️ متن آگهی عهد بازار</div>
                    <div class="p-2 rounded-xl glass-card border border-sky-400/35 text-sky-300">✨ بازنویسی و هشتگ</div>
                  </div>
                  <button type="button" onclick="event.stopPropagation(); openHamahdiAiChatPage();" class="w-full py-3 px-4 rounded-2xl bg-gradient-to-l from-cyan-500 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg group-hover:scale-[1.01] transition">
                    💬 ورود به دستیار هوش مصنوعی متنی ←
                  </button>
                </div>
              </div>

            <div class="pt-6 relative z-10">
              <div class="w-full py-3.5 px-5 rounded-2xl bg-white/10 border border-purple-400/50 text-amber-300 font-black text-xs sm:text-sm shadow-lg flex items-center justify-between">
                <span>🔒 مشاهده قابلیت‌های چت‌باکس هوش مصنوعی هم‌عهدی (به‌زودی)</span>
                <span>←</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    `;
  }

  const visibleChannels = filterPf === 'all'
    ? myApprovedChannels
    : myApprovedChannels.filter(c => String(c.platform || '').toLowerCase() === filterPf);

  if (!embeddedInAdminDashboard && !adminMode && myApprovedChannels.length === 0 && !SOCIAL_BOT_STATE.autoWizardShownOnce) {
    SOCIAL_BOT_STATE.autoWizardShownOnce = true;
    setTimeout(() => openAhdbotStepByStepWizardModal(1), 60);
  }

  return `
    <div class="space-y-4 ${embeddedInAdminDashboard ? '' : 'pb-24'}">
      ${!embeddedInAdminDashboard ? `
        <section class="glass-panel rounded-3xl p-4 sm:p-5 border border-amber-400/40 shadow-xl">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-3">
              <img src="./icon-512.png?v=4.0.0" alt="هم‌عهدی" class="w-11 h-11 rounded-2xl object-cover border border-amber-400/50 shadow-lg" />
              <div>
                <div class="flex flex-wrap items-center gap-2">
                  <h1 class="text-base sm:text-xl font-black text-white">دستیار هوشمند رسانه (عهدبات)</h1>
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                    ۴ شبکه: بله • روبیکا • ایتا (ایتایار) • تلگرام
                  </span>
                </div>
                <p class="text-[11px] text-slate-300 mt-0.5">
                  ارسال فوری + ارسال زمان‌بندی شده (ساعت خاص، چندبار در روز، هفتگی، ۳۰ صفحه کتاب در ۳۰ روز و تقویم شمسی کامل)
                </p>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 text-xs">
              <button type="button" onclick="openAhdbotStepByStepWizardModal(1)" class="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black transition shadow-lg">
                ➕ افزودن کانال / گروه
              </button>
              <button type="button" onclick="openFullJalaliGanttCalendarModal()" class="px-3.5 py-2.5 rounded-xl bg-purple-500/20 border border-purple-400/50 text-purple-200 font-black transition">
                📅 تقویم شمسی کامل
              </button>
              
              <button type="button" onclick="openAhdbotMainHub()" class="px-3.5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 font-black transition">
                🔙 ۲ کارت اصلی عهدبات
              </button>
              <button type="button" onclick="returnToLandingPage()" class="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition">
                پیشخوان ←
              </button>
            </div>
          </div>
        </section>
      ` : ''}

      <section class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        ${AHDBOT_SUPPORTED_PLATFORMS.map(pfKey => {
          const info = getOfficialBotInfoForPlatform(pfKey);
          const countInPf = myApprovedChannels.filter(c => String(c.platform || '').toLowerCase() === pfKey).length;
          return `
            <div onclick="openAhdbotStepByStepWizardModal(1, '${pfKey}')" class="glass-card rounded-2xl p-3 border border-white/10 hover:border-amber-400/50 cursor-pointer transition flex items-center justify-between gap-2">
              <div class="min-w-0">
                <div class="font-black text-white text-xs truncate">${escapeHtml(info.full_label)}</div>
                <div class="text-[10px] ${info.raw_username ? 'text-amber-300 font-mono dir-ltr text-right' : 'text-slate-400'} truncate">
                  ${info.auth_mode === 'eitaayar' ? 'اتصال با توکن ایتایار' : (info.raw_username ? escapeHtml(info.bot_handle) : 'ربات تنظیم‌نشده توسط ادمین')}
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-xl bg-white/10 text-cyan-300 font-black text-[10px] shrink-0">
                ${countInPf.toLocaleString('fa-IR')} کانال +
              </span>
            </div>
          `;
        }).join('')}
      </section>

      <section class="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <form onsubmit="submitSocialBotPublishAll(event)" class="lg:col-span-7 glass-panel rounded-3xl p-4 sm:p-5 border border-white/15 space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <h2 class="font-black text-white text-sm sm:text-base">
              ✍️ ${embeddedInAdminDashboard ? 'ارسال و زمان‌بندی پیام مدیریت به کانال‌های ثبت‌شده کاربران' : 'تولید، زمان‌بندی و ارسال محتوا در کانال‌ها'}
            </h2>
            <button type="button" onclick="saveCurrentComposerToRepeatedLibrary()" class="px-3 py-1.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/40 text-amber-300 font-black text-[11px] transition">
              📌 ذخیره پست در بانک پست‌ها
            </button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button type="button" onclick="selectBotMediaTypeTab('text')" class="py-2.5 px-3 rounded-2xl font-black border transition ${mType === 'text' ? 'bg-sky-400 text-slate-950 border-sky-300 shadow' : 'glass-card text-slate-200 border-white/10'}">📝 پیام متنی</button>
            <button type="button" onclick="selectBotMediaTypeTab('image')" class="py-2.5 px-3 rounded-2xl font-black border transition ${mType === 'image' ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 shadow' : 'glass-card text-slate-200 border-white/10'}">🖼️ تصویر (تکی یا چندصفحه‌ای)</button>
            <button type="button" onclick="selectBotMediaTypeTab('video')" class="py-2.5 px-3 rounded-2xl font-black border transition ${mType === 'video' ? 'bg-fuchsia-400 text-slate-950 border-fuchsia-300 shadow' : 'glass-card text-slate-200 border-white/10'}">🎬 ویدیو</button>
            <button type="button" onclick="selectBotMediaTypeTab('audio')" class="py-2.5 px-3 rounded-2xl font-black border transition ${mType === 'audio' ? 'bg-sky-400 text-slate-950 border-sky-300 shadow' : 'glass-card text-slate-200 border-white/10'}">🎙️ فایل صوتی</button>
          </div>

          ${mType === 'text' ? '' : `
            <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-amber-400/40 space-y-3 text-xs">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <label class="font-black text-amber-300">
                  ${mType === 'audio' ? '🎙️ انتخاب فایل صوتی یا ضبط مستقیم صدا (بدون اشغال فضای آپلود سرور):' : (mType === 'video' ? '🎬 انتخاب فایل ویدیویی (رله مستقیم به پیام‌رسان بدون ذخیره در سرور):' : '🖼️ انتخاب تصویر تکی یا چند تصویر زنجیره‌ای (مثلاً ۳۰ صفحه کتاب):')}
                </label>
                ${mType === 'audio' ? `
                  <button type="button" onclick="toggleBotVoiceRecording()" class="px-3 py-1.5 rounded-xl ${SOCIAL_BOT_STATE.isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'} font-black text-[11px]">
                    ${SOCIAL_BOT_STATE.isRecordingVoice ? '⏹️ پایان ضبط صدا' : '🎤 ضبط مستقیم صدا'}
                  </button>
                ` : ''}
              </div>

              ${mType === 'image' ? `
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <span class="block text-[11px] text-slate-300 font-bold mb-1">الف) انتخاب یک تصویر تکی:</span>
                    <input type="file" accept="image/*" onchange="handleBotMediaFileInput(this)" class="glass-input w-full px-3 py-2 rounded-xl text-xs" />
                  </div>
                  <div>
                    <span class="block text-[11px] text-purple-300 font-black mb-1">ب) انتخاب چند تصویر (مثلاً ۳۰ صفحه کتاب در ۳۰ روز):</span>
                    <input type="file" accept="image/*" multiple onchange="handleMultiSeriesFilesInput(this, false)" class="glass-input w-full px-3 py-2 rounded-xl text-xs" />
                  </div>
                </div>
              ` : `
                <input type="file" accept="${mType === 'audio' ? 'audio/*,.mp3,.ogg,.wav,.m4a' : 'video/*,.mp4,.webm,.mov'}" onchange="handleBotMediaFileInput(this)" class="glass-input w-full px-3 py-2 rounded-xl text-xs" />
              `}

              ${SOCIAL_BOT_STATE.selectedDataUrl ? `
                <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/35 space-y-2">
                  <div class="flex items-center justify-between text-[11px] text-emerald-300 font-bold">
                    <span>✓ فایل آماده ارسال: ${escapeHtml(SOCIAL_BOT_STATE.selectedFileName || (mType + '_file'))}</span>
                    ${SOCIAL_BOT_STATE.selectedFileSizeKb ? `<span>${SOCIAL_BOT_STATE.selectedFileSizeKb.toLocaleString('fa-IR')} کیلوبایت</span>` : ''}
                  </div>
                  ${mType === 'image' ? `<img src="${SOCIAL_BOT_STATE.selectedDataUrl}" class="max-h-36 rounded-xl mx-auto object-contain border border-white/10" />` : ''}
                  ${mType === 'video' ? `<video src="${SOCIAL_BOT_STATE.selectedDataUrl}" controls class="w-full max-h-44 rounded-xl bg-black"></video>` : ''}
                  ${mType === 'audio' ? `<audio src="${SOCIAL_BOT_STATE.selectedDataUrl}" controls class="w-full h-10"></audio>` : ''}
                </div>
              ` : ''}
            </div>
          `}

          <input id="bot-post-title-input" type="text" oninput="handleBotTitleLiveInput(this)" placeholder="تیتر یا عنوان پست (مثلاً: ختم روزانه یک صفحه از کتاب نهج‌البلاغه)..." class="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs font-bold" />

          <textarea id="bot-post-caption-input" rows="4" maxlength="4096" oninput="handleBotCaptionLiveInput(this)" placeholder="متن پیام یا کپشن مشترک خود را بنویسید (امضای اختصاصی هر کانال به صورت خودکار به انتهای پیام همان کانال اضافه می‌شود)..." class="glass-input w-full p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed"></textarea>

          <!-- بخش نوع ارسال و زمان‌بندی انتشار اختصاصی با فقط ۲ کارت اصلی -->
          <div class="p-4 rounded-2xl bg-slate-950/90 border-2 border-amber-400/45 space-y-3.5 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <span class="font-black text-amber-300 text-xs sm:text-sm">⏰ نوع ارسال و زمان‌بندی انتشار اختصاصی این پست:</span>
              <label class="flex items-center gap-1.5 cursor-pointer text-[11px] text-emerald-300 font-bold">
                <input id="chk-save-to-repeated-lib" type="checkbox" checked class="w-3.5 h-3.5 accent-emerald-400" />
                <span>ذخیره هم‌زمان در بانک پست‌ها</span>
              </label>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button type="button" onclick="setAhdbotSendMode('immediate')"
                class="p-3.5 rounded-2xl font-black border text-right transition flex items-center justify-between gap-2 ${sendMode === 'immediate' ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow-lg' : 'glass-card text-slate-200 border-white/10'}">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">🚀</span>
                  <div>
                    <div class="text-xs sm:text-sm font-black">ارسال فوری</div>
                    <div class="text-[10px] opacity-80">انتشار آنی در کانال‌ها بلافاصله پس از ثبت</div>
                  </div>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${sendMode === 'immediate' ? 'bg-slate-950 text-emerald-300' : 'bg-white/10 text-slate-300'}">آنی</span>
              </button>

              <button type="button" onclick="setAhdbotSendMode('scheduled')"
                class="p-3.5 rounded-2xl font-black border text-right transition flex items-center justify-between gap-2 ${sendMode === 'scheduled' ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg' : 'glass-card text-slate-200 border-white/10'}">
                <div class="flex items-center gap-2.5">
                  <span class="text-xl">🗓️</span>
                  <div>
                    <div class="text-xs sm:text-sm font-black">ارسال زمان‌بندی شده</div>
                    <div class="text-[10px] opacity-80">ساعت خاص، چندبار در روز، هفتگی، ۳۰ صفحه در ۳۰ روز و تقویم شمسی</div>
                  </div>
                </div>
                <span class="text-[10px] px-2 py-0.5 rounded-full ${sendMode === 'scheduled' ? 'bg-slate-950 text-amber-300' : 'bg-white/10 text-amber-300'}">هوشمند</span>
              </button>
            </div>

            ${sendMode === 'scheduled' ? renderScheduledFourMethodsPanelHTML(rule, false) : ''}

            <div class="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/35 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <span id="bot-composer-live-rule-summary" class="font-black text-emerald-300">
                ${escapeHtml(formatPublishingRuleSummary(rule))}
              </span>
              <button type="button" onclick="openFullJalaliGanttCalendarModal()" class="px-2.5 py-1 rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-[10px]">
                📅 باز کردن تقویم شمسی تمام‌صفحه
              </button>
            </div>
          </div>

          <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-950/90 border border-cyan-400/40 space-y-3 text-xs">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
              <span class="font-black text-amber-300 text-xs sm:text-sm">
                📡 کانال‌ها و گروه‌های ثبت‌شده (${visibleChannels.length.toLocaleString('fa-IR')})
              </span>
              <div class="flex flex-wrap items-center gap-1.5 text-[11px]">
                <button type="button" onclick="openAhdbotStepByStepWizardModal(1)" class="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black">+ افزودن کانال/گروه</button>
                ${visibleChannels.length > 0 ? `
                  <button type="button" onclick="toggleSelectAllBotChannels(true)" class="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">همه</button>
                  <button type="button" onclick="toggleSelectAllBotChannels(false)" class="px-2 py-1 rounded-lg bg-white/10 text-slate-300 font-bold">هیچ‌کدام</button>
                ` : ''}
              </div>
            </div>

            <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-[11px]">
              <button type="button" onclick="SOCIAL_BOT_STATE.channelFilterPlatform='all'; renderCurrentPage(true);" class="px-2.5 py-1 rounded-lg font-bold shrink-0 ${filterPf === 'all' ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-white/5 text-slate-300'}">همه (${myApprovedChannels.length.toLocaleString('fa-IR')})</button>
              ${AHDBOT_SUPPORTED_PLATFORMS.map(pfKey => `
                <button type="button" onclick="SOCIAL_BOT_STATE.channelFilterPlatform='${pfKey}'; renderCurrentPage(true);" class="px-2.5 py-1 rounded-lg font-bold shrink-0 ${filterPf === pfKey ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-white/5 text-slate-300'}">${escapeHtml(getPlatformFaLabel(pfKey))}</button>
              `).join('')}
            </div>

            ${visibleChannels.length === 0 ? `
              <div class="p-6 text-center space-y-3 border border-dashed border-white/15 rounded-2xl">
                <div class="text-slate-300 font-bold">هیچ کانال یا گروه پیش‌فرضی ثبت نشده است (کاملاً خام).</div>
                <p class="text-[11px] text-slate-400">برای افزودن اولین کانال یا گروه بالای ۵۰۰ عضو خود، روی دکمه زیر کلیک کنید:</p>
                <button type="button" onclick="openAhdbotStepByStepWizardModal(1)" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg">
                  ➕ ثبت کانال یا گروه جدید (پاپ‌آپ گام‌به‌گام)
                </button>
              </div>
            ` : `
              <div class="max-h-72 overflow-y-auto space-y-2.5 pr-0.5">
                ${visibleChannels.map(ch => {
                  const chUrl = getBotChannelDirectUrl(ch.platform, ch.channel_id, ch.channel_link);
                  const tLabel = ch.target_type === 'group' ? 'گروه' : 'کانال';
                  return `
                    <div class="p-3 rounded-2xl glass-card border border-white/10 hover:border-cyan-400/35 transition space-y-2">
                      <div class="flex items-start justify-between gap-2">
                        <label class="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                          <input type="checkbox" checked data-cid="${Number(ch.id)}" class="chk-registered-bot-channel w-4 h-4 accent-amber-400 shrink-0 mt-0.5" />
                          <div class="min-w-0 flex-1">
                            <div class="font-black text-white text-xs sm:text-sm leading-snug break-words">
                              ${escapeHtml(ch.media_title || ch.channel_title)}
                            </div>
                            <div class="flex flex-wrap items-center gap-2 mt-1 text-[10px] text-slate-300">
                              <a href="${escapeHtml(chUrl)}" target="_blank" rel="noopener noreferrer" class="text-cyan-300 font-mono dir-ltr underline">${escapeHtml(ch.channel_id)} ↗</a>
                              <span>•</span>
                              <span class="text-emerald-300 font-bold">👥 ${Number(ch.members_count || 500).toLocaleString('fa-IR')} عضو</span>
                              ${adminMode ? `<span>• ثبت‌کننده: ${escapeHtml(ch.owner_name || ch.owner_username)}</span>` : ''}
                            </div>
                          </div>
                        </label>
                        <div class="flex items-center gap-1.5 shrink-0">
                          <span class="px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/35 text-amber-300 font-black text-[10px]">
                            ${escapeHtml(getPlatformFaLabel(ch.platform))} (${tLabel})
                          </span>
                          <button type="button" onclick="openEditChannelSignatureModal(${Number(ch.id)})" class="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/40 text-cyan-200 font-bold text-[10px]" title="تنظیم امضای اختصاصی این کانال">
                            ✒️ امضا
                          </button>
                          <button type="button" onclick="removeRegisteredBotChannel('${escapeHtml(ch.channel_id)}', '${escapeHtml(ch.platform)}', '${escapeHtml(ch.owner_username)}')" class="w-6 h-6 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xs" title="حذف">✕</button>
                        </div>
                      </div>

                      <div onclick="openEditChannelSignatureModal(${Number(ch.id)})" class="p-2 rounded-xl bg-slate-950/80 border border-white/5 hover:border-amber-400/40 cursor-pointer flex items-center justify-between gap-2 text-[10px]">
                        <span class="text-slate-300 truncate">
                          <strong class="text-amber-300 ml-1">✒️ امضای کانال:</strong>
                          ${ch.signature ? escapeHtml(ch.signature) : '<span class="text-slate-500">بدون امضا (برای افزودن امضای انتهای پست کلیک کنید)</span>'}
                        </span>
                        <span class="text-cyan-300 font-bold shrink-0">ویرایش ✎</span>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <button id="btn-bot-publish-submit" type="submit" class="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition active:scale-[0.99]">
            ${sendMode === 'scheduled'
              ? `🗓️ ثبت و فعال‌سازی زمان‌بندی دقیق (${escapeHtml(formatPublishingRuleSummary(rule))})`
              : `🚀 ${adminMode ? 'ارسال فوری به کانال‌های انتخاب‌شده' : 'ارسال فوری به کانال‌های من'}`}
          </button>
        </form>

        <!-- ستون سمت چپ: ۱. بانک پست‌های ذخیره‌شده ۲. صف زمان‌بندی و ارسال زنجیره‌ای فعال ۳. گزارش انتشار -->
        <div class="lg:col-span-5 space-y-4">
          <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-amber-400/35 space-y-3 text-xs">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 class="font-black text-amber-300 text-sm">📌 بانک پست‌های ذخیره‌شده</h3>
              <button type="button" onclick="openFullJalaliGanttCalendarModal()" class="px-2.5 py-1 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-200 font-black text-[10px]">
                📅 تقویم شمسی (${savedRepeatedList.length.toLocaleString('fa-IR')})
              </button>
            </div>
            ${savedRepeatedList.length === 0 ? `
              <div class="p-4 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                هنوز پستی ذخیره نشده است. هر پستی (تکی یا ۳۰ صفحه‌ای) را که ذخیره کنید، زمان‌بندی آن روی کارت‌های تقویم شمسی قرار می‌گیرد.
              </div>
            ` : `
              <div class="space-y-2.5 max-h-64 overflow-y-auto pr-0.5">
                ${savedRepeatedList.map(item => {
                  const pRule = normalizeScheduleRuleObject(item.publishing_rule);
                  return `
                    <div class="p-3 rounded-2xl bg-slate-950/85 border border-white/10 space-y-2">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-black text-white text-xs truncate">${escapeHtml(item.title)}</span>
                        <span class="text-[10px] text-slate-400 shrink-0">${escapeHtml(item.created_at || '')}</span>
                      </div>
                      <p class="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">${escapeHtml(item.caption)}</p>
                      <div onclick="openPostPublishingRuleModal(${Number(item.id)}, 'saved')" class="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 cursor-pointer flex items-center justify-between gap-2 text-[10px]">
                        <span class="text-amber-300 font-bold truncate">${escapeHtml(formatPublishingRuleSummary(pRule))}</span>
                        <span class="text-cyan-300 font-black shrink-0">⚙️ تقویم و ساعت</span>
                      </div>
                      <div class="flex flex-wrap items-center justify-end gap-1.5 pt-1 border-t border-white/5">
                        <button type="button" onclick="resendSavedRepeatedPostNow(${Number(item.id)})" class="px-2.5 py-1 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[10px] shadow">
                          🚀 ارسال فوری
                        </button>
                        <button type="button" onclick="activateSavedPostScheduleRule(${Number(item.id)})" class="px-2.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] shadow">
                          🗓️ افزودن به صف زمان‌بندی
                        </button>
                        <button type="button" onclick="loadSavedPostIntoComposer(${Number(item.id)})" class="px-2 py-1 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold text-[10px]">
                          📝 فرم
                        </button>
                        <button type="button" onclick="deleteSavedRepeatedPost(${Number(item.id)})" class="px-2 py-1 rounded-xl bg-rose-500/15 text-rose-300 font-bold text-[10px]">
                          🗑️
                        </button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-cyan-400/35 space-y-3 text-xs">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 class="font-black text-cyan-300 text-sm">⏰ صف پست‌های زمان‌بندی شده و زنجیره‌ای فعال</h3>
              <span class="text-[10px] text-emerald-300 font-bold">${scheduledJobs.filter(j => j.active).length.toLocaleString('fa-IR')} فعال</span>
            </div>
            ${scheduledJobs.length === 0 ? `
              <div class="p-4 text-center text-slate-400 border border-dashed border-white/10 rounded-2xl">
                هنوز پستی در صف زمان‌بندی قرار ندارد.
              </div>
            ` : `
              <div class="space-y-2.5 max-h-72 overflow-y-auto pr-0.5">
                ${scheduledJobs.map(job => {
                  const jRule = normalizeScheduleRuleObject(job.publishing_rule);
                  jRule.mode = 'scheduled';
                  const maxOcc = Number(job.max_occurrences || getTotalOccurrencesForRule(jRule) || 1);
                  const runs = Number(job.runs_count || 0);
                  const rem = Math.max(0, maxOcc - runs);
                  const pct = Math.min(100, Math.round((runs / Math.max(1, maxOcc)) * 100));
                  return `
                    <div class="p-3 rounded-2xl bg-slate-950/85 border ${job.active ? 'border-cyan-400/45' : 'border-white/10 opacity-70'} space-y-2">
                      <div class="flex items-center justify-between gap-2">
                        <span class="font-black text-white truncate">${escapeHtml(job.title)}</span>
                        <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-400/20 text-cyan-300">
                          ${jRule.sub_mode === 'multi_page_series' ? `📚 زنجیره‌ای (${maxOcc.toLocaleString('fa-IR')} صفحه)` : '🗓️ زمان‌بندی فعال'}
                        </span>
                      </div>
                      <p class="text-[11px] text-slate-300 line-clamp-1">${escapeHtml(job.caption)}</p>

                      <div onclick="openPostPublishingRuleModal(${Number(job.id)}, 'job')" class="p-2 rounded-xl bg-slate-900 border border-white/10 hover:border-amber-400/50 cursor-pointer flex items-center justify-between gap-2 text-[10px]">
                        <span class="text-amber-300 font-bold truncate">${escapeHtml(formatPublishingRuleSummary(jRule))}</span>
                        <span class="text-cyan-300 font-black shrink-0">⚙️ ویرایش</span>
                      </div>

                      <div class="space-y-1">
                        <div class="flex items-center justify-between text-[10px]">
                          <span class="text-emerald-300 font-bold">ارسال شده: ${runs.toLocaleString('fa-IR')} از ${maxOcc.toLocaleString('fa-IR')} نوبت/صفحه</span>
                          <span class="text-slate-400">باقی‌مانده: ${rem.toLocaleString('fa-IR')} • آخرین: ${escapeHtml(job.last_run || '-')}</span>
                        </div>
                        <div class="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                          <div class="h-full bg-gradient-to-r from-amber-400 to-emerald-400" style="width:${pct}%"></div>
                        </div>
                      </div>

                      <div class="flex flex-wrap items-center justify-end gap-1.5 pt-1 border-t border-white/5 text-[10px]">
                        <button type="button" onclick="executeScheduledBotJobNow(${Number(job.id)})" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">▶️ ارسال نوبت/صفحه بعدی الان</button>
                        <button type="button" onclick="openPostPublishingRuleModal(${Number(job.id)}, 'job')" class="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold">📅 تقویم و صفحات</button>
                        <button type="button" onclick="toggleScheduledJobStatus(${Number(job.id)})" class="px-2 py-1 rounded-lg bg-white/10 text-amber-300 font-bold">${job.active ? '⏸️ توقف' : '▶️ فعال'}</button>
                        <button type="button" onclick="deleteScheduledBotJob(${Number(job.id)})" class="px-2 py-1 rounded-lg bg-rose-500/15 text-rose-300 font-bold">✕</button>
                      </div>
                    </div>
                  `;
                }).join('')}
              </div>
            `}
          </div>

          <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-emerald-400/30 space-y-3 text-xs">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 class="font-black text-emerald-300 text-sm">📊 وضعیت صف ارسال و گزارش انتشار</h3>
              <span id="bot-queue-progress-pct" class="text-xs font-black text-emerald-300">${(SOCIAL_BOT_STATE.queueProgressPct || 0).toLocaleString('fa-IR')}٪</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-white/10">
              <div id="bot-queue-progress-bar" class="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 transition-all duration-300" style="width:${SOCIAL_BOT_STATE.queueProgressPct || 0}%"></div>
            </div>
            <div id="bot-queue-live-items" class="space-y-1.5 max-h-40 overflow-y-auto">
              ${(SOCIAL_BOT_STATE.queueItems || []).map(item => `
                <div class="p-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
                  item.status === 'done'
                    ? 'bg-emerald-500/15 border-emerald-400/40 text-emerald-200'
                    : 'bg-amber-500/20 border-amber-400/60 text-amber-200'
                }">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="font-bold text-white truncate">${escapeHtml(item.media_title)}</span>
                    <span class="font-mono text-[10px] text-amber-300 dir-ltr">${escapeHtml(item.channel_id)}</span>
                  </div>
                  <span class="font-black text-[11px] shrink-0">${item.status_text}</span>
                </div>
              `).join('')}
            </div>

            ${sentLogs.length > 0 ? `
              <div class="space-y-1.5 pt-2 border-t border-white/10 max-h-44 overflow-y-auto">
                ${sentLogs.slice(0, 8).map(log => `
                  <div class="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-2">
                    <div class="min-w-0">
                      <div class="font-bold text-white truncate">${escapeHtml(log.title)}</div>
                      <div class="text-[10px] text-amber-300 truncate">${escapeHtml((log.channels || []).join(' ، '))}</div>
                    </div>
                    <span class="text-[10px] text-emerald-400 font-bold shrink-0">✓ ${escapeHtml(log.timestamp)}</span>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>
        </div>
      </section>
    </div>
  `;
}

function submitCommunityPostComment(e, postId) {
  e.preventDefault();
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(state.currentPage || 'ahdino');
    return;
  }
  const inp = document.getElementById('cmt-inp-' + Number(postId));
  const text = (inp ? inp.value : '').trim();
  if (!text) return;
  const sender = (state.currentUser && state.currentUser.display_name) ? state.currentUser.display_name : 'کاربر';
  const list = ensureCommunityPostsInitialized();
  const found = list.find(p => Number(p.id) === Number(postId));
  if (found) {
    if (!Array.isArray(found.comments)) found.comments = [];
    found.comments.push({ id: Date.now(), sender, text, created_at: 'امروز' });
    saveState();
    renderCurrentPage(true);
    callServerApi('comment_community_post', { id: Number(postId), sender, text });
    showToast('دیدگاه ثبت شد.');
  }
}

function deleteCommunityMediaPost(postId) {
  state.communityPosts = ensureCommunityPostsInitialized().filter(p => Number(p.id) !== Number(postId));
  saveState();
  renderCurrentPage(true);
  callServerApi('delete_community_post', { id: Number(postId) });
  showToast('پست حذف شد.');
}

function openQuickCommunityPostModal(appMode = 'ahdino') {
  if (!isRegisteredUser() && !isAdmin()) {
    openUnifiedAppEntryModal(appMode);
    return;
  }
  const isAhdaneh = appMode === 'ahdaneh';
  openDirectPersonalPostModal(isAhdaneh ? 'image' : 'text');
}
