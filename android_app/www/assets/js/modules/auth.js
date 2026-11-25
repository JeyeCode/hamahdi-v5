/**
 * HAMAHDI v4.0.0 | ماژول احراز هویت، حساب کاربری، داک دسکتاپ و منوی کشویی موبایل
 */
/**
 * HAMAHDI (هم‌عهدی) - ماژول احراز هویت اهالی، غرفه‌داران و مدیریت نشست امن (نسخه 6.0)
 */
    // Strict Role Helpers (Requirement 10)
    function isAdmin() {
      return Boolean(state.currentUser && state.currentUser.role === 'admin');
    }

    function isRegisteredUser() {
      return Boolean(state.currentUser && (state.currentUser.role === 'resident' || state.currentUser.role === 'admin'));
    }

    // Requirement 9 & 10: Prompt Guest with BOTH "ورود اعضا (قبلاً ثبت‌نام کرده‌ام)" AND "ثبت‌نام جدید و افتتاح غرفه"
    function isBoothApproved() {
      if (isAdmin()) return true;
      if (!isRegisteredUser()) return false;
      const u = (state.users && state.users[state.currentUser.username]) ? state.users[state.currentUser.username] : state.currentUser;
      return (u.booth_status || 'approved') === 'approved';
    }

    function requireRegisteredAccount(actionNameFa) {
      if (isRegisteredUser()) return true;
      openResidentLoginModal(actionNameFa);
      return false;
    }

    function requireApprovedBooth(actionNameFa) {
      if (!requireRegisteredAccount(actionNameFa)) return false;
      if (isBoothApproved()) return true;
      const u = (state.users && state.users[state.currentUser.username]) ? state.users[state.currentUser.username] : state.currentUser;
      const isRej = u.booth_status === 'rejected';
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black ${isRej ? 'text-rose-400' : 'text-amber-300'} text-base">
              ${isRej ? '❌ مدارک ایجاد غرفه نیاز به اصلاح دارد' : '⏳ غرفه شما در انتظار تایید نهایی ادمین است'}
            </h3>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>
          <div class="glass-card p-4 rounded-2xl space-y-2 border ${isRej ? 'border-rose-400/40' : 'border-amber-400/40'} leading-relaxed text-slate-200">
            ${isRej ? `
              <p>همسایه گرامی <strong>${escapeHtml(u.display_name)}</strong>، درخواست ایجاد غرفه شما به علت زیر توسط ادمین تایید نشد:</p>
              <div class="p-2.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 font-bold">علت: ${escapeHtml(u.booth_rejection_reason || 'نقص در مدارک ارسالی')}</div>
            ` : `
              <p>همسایه گرامی <strong>${escapeHtml(u.display_name)}</strong>، اطلاعات عضویت و درخواست افتتاح غرفه شما ثبت شده و در حال بررسی توسط مدیریت است.</p>
              <p class="text-amber-200">به محض تایید اطلاعات هویتی شما توسط ادمین، غرفه شما فعال شده و امکان <strong>«${escapeHtml(actionNameFa)}»</strong> برایتان باز خواهد شد.</p>
            `}
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" onclick="closeModal(); openMyBooth();" class="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold">مشاهده صفحه غرفه من</button>
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black">متوجه شدم</button>
          </div>
        </div>
      `);
      return false;
    }

    function handleMobileBoothOrLogin() {
      if (state.currentPage === 'booth' && (isRegisteredUser() || isAdmin())) {
        const targetUname = state.selectedBoothUsername || (state.currentUser && state.currentUser.username);
        if (targetUname && typeof openEditBoothModal === 'function') {
          openEditBoothModal(targetUname);
          return;
        }
      }
      if (isAdmin()) {
        navigateToAdminDashboard('pending_queue');
      } else if (isRegisteredUser()) {
        openBoothPage(state.currentUser.username);
      } else {
        openResidentLoginModal('ورود به حساب و غرفه من');
      }
    }

    function getUserMessagesAndOrdersCount() {
      if (!isRegisteredUser()) return 0;
      const uname = String(state.currentUser.username || '').toLowerCase();
      let msgCount = 0;
      (state.listings || []).forEach(l => {
        const sellerLower = String(l.seller_username || '').toLowerCase();
        const msgs = (l.messages || []).filter(m =>
          m && (m.message_type || 'pv') === 'pv' &&
          (isAdmin() || String(m.sender_username || '').toLowerCase() === uname || String(m.receiver_username || '').toLowerCase() === uname || sellerLower === uname)
        );
        msgCount += msgs.length;
      });
      const ordCount = (state.orders || []).filter(o => isAdmin() || String(o.seller_username || '').toLowerCase() === uname || String(o.buyer_username || '').toLowerCase() === uname).length;
      return msgCount + ordCount;
    }

    function getUserSocialDirectMessagesCount() {
      if (!isRegisteredUser()) return 0;
      const uname = String(state.currentUser.username || '').toLowerCase();
      const d1 = (state.directMessages || []).filter(m => m && (isAdmin() || String(m.sender_username || '').toLowerCase() === uname || String(m.receiver_username || '').toLowerCase() === uname)).length;
      const d2 = (state.ahdinoMessages || []).filter(m => m && (isAdmin() || String(m.sender_username || '').toLowerCase() === uname || String(m.receiver_username || '').toLowerCase() === uname)).length;
      return d1 + d2;
    }

    // توابع مدیریت تم به ماژول مستقل assets/js/core/theme.js منتقل شده‌اند

    function faDigitsToEn(str) {
      return String(str || '').replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
    }

    function getDailyCalendarOccasions(dayInt, monthName, wavePersian) {
      const key = `${monthName}_${dayInt}`;
      const specificOccasions = {
        'آبان_13': [
          { badge: 'مناسبت ملی و انقلابی', title: 'روز دانش‌آموز و روز ملی مبارزه با استکبار جهانی', color: 'amber' },
          { badge: 'تقویم تاریخ', title: 'سالروز تسخیر لانه جاسوسی آمریکا به دست دانشجویان پیرو خط امام (۱۳۵۸)', color: 'emerald' }
        ],
        'آبان_14': [
          { badge: 'مناسبت فرهنگی', title: 'روز فرهنگ عمومی در تقویم رسمی کشور', color: 'cyan' },
          { badge: 'همبستگی مردمی', title: `ثبت کارنامه همبستگی و همیاری اهالی در شب ${wavePersian} مقاومت مردمی`, color: 'amber' }
        ],
        'آبان_15': [
          { badge: 'تقویم خورشیدی', title: 'میانه آبان‌ماه؛ آیین‌های سنتی فصل پاییز و همیاری محلات خراسان', color: 'emerald' },
          { badge: 'یادمان شهدا', title: 'گرامیداشت شهدای مدافع حرم و شهدای امنیت محله شمال شرق مشهد', color: 'amber' }
        ],
        'آبان_16': [
          { badge: 'تقویم رسمی', title: 'گرامیداشت میراث فرهنگی و آیین‌های همسایگی و موقوفات رضوی در مشهد مقدس', color: 'cyan' },
          { badge: 'همبستگی مردمی', title: `شب ${wavePersian} از مقاومت مردمی و پیمان اخوت و معیشت هم‌عهدی`, color: 'amber' }
        ],
        'آبان_17': [
          { badge: 'تقویم رسمی امروز', title: 'روز بزرگداشت میراث علمی و فرهنگی اسلامی و تجلیل از پیشکسوتان محله', color: 'emerald' },
          { badge: 'رویداد محله رضوی', title: 'آیین هم‌عهدی، قرائت دسته‌جمعی قرآن کریم و صلوات اهالی شمال شرق به نیت تعجیل در فرج', color: 'amber' },
          { badge: 'مقاومت مردمی', title: `شب ${wavePersian} از مقاومت و پایداری مردمی و گرامیداشت یاد و خاطره امام شهید و شهدای مقاومت`, color: 'cyan' }
        ],
        'آبان_18': [
          { badge: 'مناسبت ملی', title: 'روز ملی کیفیت و ترویج تولیدات سالم و باکیفیت مشاغل خانگی', color: 'emerald' },
          { badge: 'مقاومت مردمی', title: `شب ${wavePersian} از مقاومت مردمی و حمایت از تولیدکنندگان و غرفه‌داران محله`, color: 'amber' }
        ],
        'آبان_24': [
          { badge: 'مناسبت فرهنگی', title: 'روز کتاب، کتاب‌خوانی و کتابدار و بزرگداشت علامه طباطبایی (ره)', color: 'cyan' }
        ]
      };

      if (specificOccasions[key]) {
        return specificOccasions[key];
      }
      return [
        { badge: `رویداد ${dayInt.toLocaleString('fa-IR')} ${monthName}`, title: `ثبت رویدادهای فرهنگی، مذهبی و اجتماعی روز ${dayInt.toLocaleString('fa-IR')} ${monthName} در تقویم رسمی سامانه`, color: 'emerald' },
        { badge: 'همبستگی و معیشت', title: 'مشارکت اهالی در ختم دسته‌جمعی ۶۰۴ صفحه‌ای قرآن کریم، صلوات و حمایت از غرفه‌داران محله', color: 'amber' },
        { badge: 'مقاومت مردمی', title: `شب ${wavePersian} از مقاومت و همبستگی مردمی در اکوسیستم هم‌عهدی`, color: 'cyan' }
      ];
    }

    function getResistanceWaveInfo() {
      // Reference: 14 Aban 1405 (2026-11-05) = Wave 249 -> 17 Aban 1405 (2026-11-08) = Wave 252
      const refMs = Date.UTC(2026, 10, 5);
      const now = new Date();
      const todayUtc = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
      const diffDays = Math.round((todayUtc - refMs) / 86400000);
      const waveNum = Math.max(252, 249 + diffDays);

      let jalaliStr = '۱۷ آبان ۱۴۰۵';
      let dayNumStr = '۱۷';
      let monthNameStr = 'آبان';
      try {
        const fmt = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(now);
        if (fmt) {
          jalaliStr = fmt;
          const parts = fmt.split(' ');
          if (parts.length >= 2) {
            dayNumStr = parts[0];
            monthNameStr = parts[1];
          }
        }
      } catch (e) {}

      const dayInt = parseInt(faDigitsToEn(dayNumStr), 10) || 17;
      const wavePersian = waveNum.toLocaleString('fa-IR');
      const occasions = getDailyCalendarOccasions(dayInt, monthNameStr, wavePersian);
      const baseAttendance = 1420 + ((waveNum - 249) * 18) + (state.listings ? state.listings.length * 4 : 32);

      return {
        jalaliDate: jalaliStr,
        dayPersian: dayNumStr,
        monthPersian: monthNameStr,
        dayInt: dayInt,
        waveNumber: waveNum,
        wavePersian: wavePersian,
        occasions: occasions,
        attendanceCount: baseAttendance,
        attendancePersian: baseAttendance.toLocaleString('fa-IR')
      };
    }

    function updateWaveCounterWidget() {
      const info = getResistanceWaveInfo();
      const waveEl = document.getElementById('hm-wave-number-lbl');
      const inlineDateEl = document.getElementById('hm-3d-inline-date');
      const dayCube = document.getElementById('hm-3d-day-num');
      const monthCube = document.getElementById('hm-3d-month-name');
      if (waveEl) waveEl.textContent = info.wavePersian;
      if (inlineDateEl) inlineDateEl.textContent = info.jalaliDate;
      if (dayCube) dayCube.textContent = info.dayPersian;
      if (monthCube) monthCube.textContent = info.monthPersian;
    }

    function toggleDesktopDockCollapse() {
      state.desktopDockCollapsed = !state.desktopDockCollapsed;
      document.body.classList.toggle('desktop-dock-collapsed', Boolean(state.desktopDockCollapsed));
      saveState();
      renderDesktopRightPillDock();
    }

    function renderDesktopRightPillDock() {
      const dock = document.getElementById('desktop-right-pill-dock');
      if (!dock) return;
      const isCollapsed = Boolean(state.desktopDockCollapsed);
      document.body.classList.toggle('desktop-dock-collapsed', isCollapsed);

      if (isCollapsed) {
        dock.innerHTML = `
          <button type="button" onclick="toggleDesktopDockCollapse()" class="hm-dock-item hm-dock-circle-blue" title="باز کردن منوی دسکتاپ">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
            <span class="hm-dock-tooltip">باز کردن منوی دسکتاپ</span>
          </button>
        `;
        return;
      }

      const page = state.currentPage || 'landing';
      const inMarketApp = (page === 'market' || page === 'listing_detail' || page === 'booth' || page === 'messages');
      const msgCnt = getUserMessagesAndOrdersCount();
      const approvedCnt = getApprovedListings().length;
      const wave = getResistanceWaveInfo();
      const p = getPendingCounts();

      if (!inMarketApp) {
        dock.innerHTML = `
          <!-- Collapse Toggle Button -->
          <button type="button" onclick="toggleDesktopDockCollapse()" class="hm-dock-collapse-btn" title="جمع کردن منوی کنار">
            <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            <span class="hm-dock-tooltip">جمع کردن منوی کنار</span>
          </button>

          <!-- ۱. صفحه اصلی سوپراپلیکیشن -->
          <button type="button" onclick="returnToLandingPage()" class="hm-dock-item ${page === 'landing' ? 'hm-dock-circle-blue' : ''}">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>
            <span class="hm-dock-tooltip">صفحه اصلی سوپراپلیکیشن</span>
          </button>

          <!-- ۲. استودیو هوشمند عهدبات (دقیقاً زیر صفحه اصلی) -->
          <button type="button" onclick="handleEntryToAhdbotClick()" class="hm-dock-item ${page === 'social_bot' ? 'hm-dock-circle-orange' : ''}">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4 text-amber-300" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>
            <span class="hm-dock-tooltip">استودیو عهدبات</span>
          </button>

          <!-- ۳. عهد بازار (فعال) -->
          <button type="button" onclick="handleActiveMarketCardClick()" class="hm-dock-item hm-dock-circle-green">
            <span class="hm-dock-badge">${approvedCnt > 0 ? approvedCnt : '•'}</span>
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="hm-dock-tooltip">۱. عهد بازار</span>
          </button>

          <!-- ۴. تقویم و موج مقاومت -->
          <button type="button" onclick="openWaveCounterDetailModal()" class="hm-dock-item">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4 text-amber-400" aria-hidden="true"><path d="M12 2c1.5 3.5 4 5.5 4 9a6 6 0 1 1-12 0c0-2.5 1.5-5 3-6.5 0 2 1.5 3 2.5 3-.5-2.5 1-4.5 2.5-5.5z"/></svg>
            <span class="hm-dock-tooltip">تقویم و ${wave.wavePersian} موج</span>
          </button>

          <div class="hm-dock-divider"></div>

          <!-- ۶. منوی کشویی مدیریت / حساب کاربری -->
          <button type="button" onclick="${isAdmin() ? "openAdminSideDrawer()" : "openResidentLoginModal()"}" class="hm-dock-item ${page === 'admin_dashboard' ? 'hm-dock-circle-orange' : ''}">
            ${isAdmin() && p.total > 0 ? `<span class="hm-dock-badge">${p.total}</span>` : ''}
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/></svg>
            <span class="hm-dock-tooltip">${isAdmin() ? 'منوی کشویی مدیریت سامانه' : (state.currentUser ? escapeHtml(state.currentUser.display_name) : 'ورود / عضویت یا مدیریت')}</span>
          </button>

          <!-- ۷. تغییر تم دارک / لایت شیشه‌ای نئونی -->
          <button type="button" onclick="toggleThemeMode()" class="hm-dock-item" title="تغییر تم روشن / تیره">
            <span class="text-sm leading-none">${getThemeMode() === 'light' ? '🌙' : '☀️'}</span>
            <span class="hm-dock-tooltip">${getThemeMode() === 'light' ? 'تم تیره (دارک شیشه‌ای نئونی)' : 'تم روشن (لایت شیشه‌ای نئونی)'}</span>
          </button>

          <!-- ۸. پشتیبانی -->
          <button type="button" onclick="openSupportQuickAction()" class="hm-dock-item">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>
            <span class="hm-dock-tooltip">پشتیبانی و راهنمای اهالی</span>
          </button>

          ${state.currentUser ? `
            <!-- ۹. دکمه بدون متن خروج در حالت دسکتاپ طبق دستور شماره ۵ کارفرما -->
            <button type="button" onclick="logoutSession()" class="hm-dock-item bg-rose-600/30 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white transition" aria-label="خروج">
              <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          ` : ''}
        `;
      } else {
        dock.innerHTML = `
          <button type="button" onclick="toggleDesktopDockCollapse()" class="hm-dock-collapse-btn" title="جمع کردن منوی کنار">
            <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
            <span class="hm-dock-tooltip">جمع کردن منوی کنار</span>
          </button>

          <button type="button" onclick="openAddMarketListingModal()" class="hm-dock-item hm-dock-circle-green">
            <span class="hm-dock-badge">+</span>
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span class="hm-dock-tooltip">+ ثبت آگهی جدید در بازار</span>
          </button>

          <button type="button" id="desktop-dock-cart-btn" onclick="openShoppingCartModal()" class="hm-dock-item hm-dock-circle-orange">
            ${(typeof getShoppingCartTotalCount === 'function' && getShoppingCartTotalCount() > 0) ? `<span class="hm-dock-badge">${getShoppingCartTotalCount()}</span>` : ''}
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            <span class="hm-dock-tooltip">سبد خرید عهد بازار</span>
          </button>

          <button type="button" onclick="openMessagesCenterPage('chats', 'market')" class="hm-dock-item ${page === 'messages' ? 'hm-dock-circle-blue' : ''}">
            ${msgCnt > 0 ? `<span class="hm-dock-badge">${msgCnt}</span>` : ''}
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span class="hm-dock-tooltip">چت و پیام‌های بازار</span>
          </button>

          <button type="button" onclick="${isAdmin() ? "openAdminSideDrawer()" : "handleMobileBoothOrLogin()"}" class="hm-dock-item ${page === 'booth' ? 'hm-dock-circle-blue' : ''}">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/></svg>
            <span class="hm-dock-tooltip">${isAdmin() ? 'منوی کشویی مدیریت' : (isRegisteredUser() ? 'غرفه اختصاصی من' : 'ورود / عضویت غرفه‌داران')}</span>
          </button>

          <button type="button" onclick="handleEntryToAhdbotClick()" class="hm-dock-item">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4 text-amber-300" aria-hidden="true"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/></svg>
            <span class="hm-dock-tooltip">ورود به استودیو عهدبات</span>
          </button>

          <button type="button" onclick="returnToLandingPage()" class="hm-dock-item">
            <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/></svg>
            <span class="hm-dock-tooltip">بازگشت به صفحه اصلی</span>
          </button>

          ${state.currentUser ? `
            <!-- دکمه بدون متن خروج در حالت دسکتاپ طبق دستور شماره ۵ کارفرما -->
            <button type="button" onclick="logoutSession()" class="hm-dock-item bg-rose-600/30 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white transition" aria-label="خروج">
              <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          ` : ''}
        `;
      }
    }

    function openWaveCounterDetailModal() {
      const info = getResistanceWaveInfo();
      const occasions = Array.isArray(info.occasions) ? info.occasions : [];
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 font-black text-base shadow">
                🔥
              </div>
              <div>
                <h3 class="font-black text-white text-base">شمارشگر زنده مقاومت و همبستگی مردمی</h3>
                <span class="text-[11px] text-amber-300 font-bold">تاریخ امروز: ${escapeHtml(info.jalaliDate)}</span>
              </div>
            </div>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
            <div class="glass-card p-4 rounded-2xl border border-amber-400/40">
              <div class="text-[11px] text-slate-300 mb-1">شماره موج و شب مقاومت</div>
              <div class="text-xl font-black text-amber-300">${info.wavePersian} موج</div>
              <div class="text-[10px] text-emerald-300 font-bold mt-0.5">شب ${info.wavePersian} از مقاومت مردمی</div>
            </div>
            <div class="glass-card p-4 rounded-2xl border border-cyan-400/40">
              <div class="text-[11px] text-slate-300 mb-1">تقویم رسمی سامانه</div>
              <div class="text-base font-black text-white mt-1">${escapeHtml(info.jalaliDate)}</div>
              <div class="text-[10px] text-amber-300 font-bold mt-1">به‌روزرسانی خودکار روزانه</div>
            </div>
          </div>

          <!-- بخش رویدادها و مناسبت‌های تقویم روز (دریافت خودکار بر اساس تاریخ روز) -->
          <div class="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/35 space-y-3 leading-relaxed">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <div class="flex items-center gap-2 font-black text-amber-300 text-xs sm:text-sm">
                <span>📅</span>
                <span>رویدادها و مناسبت‌های تقویم روز (${escapeHtml(info.dayPersian + ' ' + info.monthPersian)})</span>
              </div>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 font-bold text-[10px]">دریافت زنده تقویم</span>
            </div>
            <div class="space-y-2">
              ${occasions.map(ev => `
                <div class="glass-card p-2.5 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <div class="flex items-start sm:items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0 mt-1.5 sm:mt-0"></span>
                    <span class="text-slate-100 font-bold text-[11px] sm:text-xs">${escapeHtml(ev.title)}</span>
                  </div>
                  <span class="px-2 py-0.5 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-300 font-bold text-[10px] shrink-0 self-end sm:self-auto">${escapeHtml(ev.badge)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="flex justify-end">
            <button type="button" onclick="closeModal()" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black">بستن</button>
          </div>
        </div>
      `);
    }

    function toggleMobileDrawer() {
      const bd = document.getElementById('mobile-drawer-backdrop');
      if (!bd) return;
      if (bd.classList.contains('hidden')) {
        renderMobileDrawerContent();
        bd.classList.remove('hidden');
      } else {
        bd.classList.add('hidden');
      }
    }

    function closeMobileDrawer() {
      const bd = document.getElementById('mobile-drawer-backdrop');
      if (bd) bd.classList.add('hidden');
    }

    function renderMobileDrawerContent() {
      const box = document.getElementById('mobile-drawer-content');
      if (!box) return;
      const page = state.currentPage || 'landing';
      const inMarketApp = (page === 'market' || page === 'listing_detail' || page === 'booth' || page === 'messages');
      const isLight = getThemeMode() === 'light';
      const msgCnt = getUserMessagesAndOrdersCount();
      const wave = getResistanceWaveInfo();
      const p = getPendingCounts();

      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-white/15 pb-3">
          <div>
            <div class="font-nastaliq text-2xl text-amber-400 font-bold">هم‌عهدی</div>
            <div class="text-[10px] text-slate-300 font-bold mt-0.5">
              ${inMarketApp ? '🏪 اپ ۱: عهد بازار' : (page === 'social_bot' ? '🤖 استودیو هوشمند عهدبات' : '🌐 پیشخوان اصلی سوپراپلیکیشن')}
            </div>
          </div>
          <button type="button" onclick="closeMobileDrawer()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-200 font-bold">✕</button>
        </div>

        <!-- Wave Summary inside Drawer -->
        <div onclick="closeMobileDrawer(); openWaveCounterDetailModal();" class="glass-card p-3 rounded-2xl border border-amber-400/35 cursor-pointer space-y-1">
          <div class="flex items-center justify-between text-[11px]">
            <span class="font-bold text-slate-200">${escapeHtml(wave.jalaliDate)}</span>
            <span class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-black text-[10px]">موج ${wave.wavePersian}</span>
          </div>
          <div class="flex items-center justify-between text-[10px] text-emerald-300 font-bold pt-1">
            <span>شب ${wave.wavePersian} مقاومت مردمی</span>
            <span>تقویم رسمی سامانه</span>
          </div>
        </div>

        <!-- User Account Status (کلمه خروج از اینجا حذف و به پایین منو منتقل شد) -->
        <div class="glass-card p-3 rounded-2xl space-y-2 text-xs">
          ${!state.currentUser ? `
            <div class="text-slate-300 font-bold">حساب کاربری: <span class="text-amber-300">مهمان</span></div>
            <div class="grid grid-cols-2 gap-1.5 pt-1">
              <button type="button" onclick="closeMobileDrawer(); openResidentLoginModal();" class="py-2 px-2.5 rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 font-bold text-[11px]">ورود / عضویت</button>
              <button type="button" onclick="closeMobileDrawer(); openDirectAdminLoginModal();" class="py-2 px-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold text-[11px]">پنل مدیریت</button>
            </div>
          ` : `
            <div class="flex items-center justify-between">
              <span class="font-black text-amber-300 truncate">${escapeHtml(state.currentUser.display_name)}</span>
              <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">آنلاین</span>
            </div>
            ${isAdmin() ? `
              <button type="button" onclick="closeMobileDrawer(); openAdminSideDrawer();" class="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs flex items-center justify-between shadow">
                <span>⚙️ منوی کشویی مدیریت سامانه</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px]">${p.total.toLocaleString('fa-IR')}</span>
              </button>
            ` : ''}
          `}
        </div>

        <!-- بخش‌های سوپراپلیکیشن -->
        <div class="space-y-1.5 text-xs">
          <div class="text-[10px] font-bold text-slate-400 px-1">بخش‌های سوپراپلیکیشن:</div>

          <!-- ۱. صفحه اصلی -->
          <button type="button" onclick="closeMobileDrawer(); returnToLandingPage();" class="w-full p-2.5 rounded-xl flex items-center justify-between font-bold transition ${page === 'landing' ? 'bg-amber-400 text-slate-950 font-black shadow' : 'glass-card text-slate-200'}">
            <span>🏠 صفحه اصلی</span>
            <span>←</span>
          </button>

          <!-- ۲. استودیو عهدبات -->
          <button type="button" onclick="closeMobileDrawer(); handleEntryToAhdbotClick();" class="w-full p-2.5 rounded-xl flex items-center justify-between font-black transition ${page === 'social_bot' ? 'bg-amber-400 text-slate-950 shadow' : 'bg-gradient-to-r from-amber-400/20 to-cyan-400/20 border border-amber-400/45 text-amber-300'}">
            <span>🤖 ورود به استودیو عهدبات</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded ${page === 'social_bot' ? 'bg-slate-950 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}">فعال</span>
          </button>

          <!-- ۳. عهد بازار -->
          <button type="button" onclick="closeMobileDrawer(); handleActiveMarketCardClick();" class="w-full p-2.5 rounded-xl flex items-center justify-between font-bold transition ${inMarketApp ? 'bg-amber-400 text-slate-950 font-black shadow' : 'glass-card text-emerald-300 border border-emerald-400/35'}">
            <span>🏪 ۱. عهد بازار</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded ${inMarketApp ? 'bg-slate-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'}">فعال</span>
          </button>

          ${inMarketApp ? `
            <div class="pr-2 space-y-1.5 border-r-2 border-amber-400/50 my-1.5">
              <button type="button" onclick="closeMobileDrawer(); openAddMarketListingModal();" class="w-full p-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black flex items-center justify-between shadow text-[11px]">
                <span>➕ ثبت آگهی جدید در بازار</span>
                <span>←</span>
              </button>
              <button type="button" onclick="closeMobileDrawer(); openMessagesCenterPage('chats', 'market');" class="w-full p-2 rounded-xl glass-card text-sky-300 font-bold flex items-center justify-between text-[11px]">
                <span>💬 چت و پیام‌های بازار</span>
                ${msgCnt > 0 ? `<span class="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black">${msgCnt}</span>` : '<span>←</span>'}
              </button>
              <button type="button" onclick="closeMobileDrawer(); handleMobileBoothOrLogin();" class="w-full p-2 rounded-xl glass-card text-cyan-300 font-bold flex items-center justify-between text-[11px]">
                <span>👤 ${isAdmin() ? 'پنل مدیریت' : (isRegisteredUser() ? 'غرفه من در بازار' : 'حساب کاربری بازار')}</span>
                <span>←</span>
              </button>
            </div>
          ` : ''}

          <!-- بخش‌های در حال تکمیل (طبق دستور ۶ کارفرما: همه در حال تکمیل معرفی شوند نه قفل موقت) -->
          <button type="button" onclick="closeMobileDrawer(); handleUnderConstructionCardClick('news');" class="w-full p-2.5 rounded-xl glass-card text-slate-300 font-bold flex items-center justify-between">
            <span>🎙️ ۲. عهدینو</span>
            <span class="text-[10px] text-slate-400">در حال تکمیل</span>
          </button>
          <button type="button" onclick="closeMobileDrawer(); handleUnderConstructionCardClick('culture');" class="w-full p-2.5 rounded-xl glass-card text-slate-300 font-bold flex items-center justify-between">
            <span>🎬 ۳. عهدانه</span>
            <span class="text-[10px] text-slate-400">در حال تکمیل</span>
          </button>
          <button type="button" onclick="closeMobileDrawer(); handleUnderConstructionCardClick('map');" class="w-full p-2.5 rounded-xl glass-card text-slate-300 font-bold flex items-center justify-between">
            <span>🗺️ ۴. عهدیار</span>
            <span class="text-[10px] text-slate-400">در حال تکمیل</span>
          </button>
          <button type="button" onclick="closeMobileDrawer(); handleUnderConstructionCardClick('edu');" class="w-full p-2.5 rounded-xl glass-card text-slate-300 font-bold flex items-center justify-between">
            <span>🎓 ۵. عهدآموز</span>
            <span class="text-[10px] text-slate-400">در حال تکمیل</span>
          </button>
          <button type="button" onclick="closeMobileDrawer(); handleUnderConstructionCardClick('podcast');" class="w-full p-2.5 rounded-xl glass-card text-slate-300 font-bold flex items-center justify-between">
            <span>🎧 ۶. عهدشنو</span>
            <span class="text-[10px] text-slate-400">در حال تکمیل</span>
          </button>
        </div>

        <!-- Theme Switcher & Support & PWA & Logout Button at Bottom (بدون QR در منو طبق دستور ۵ و با دکمه خروج در پایین طبق دستور ۶) -->
        <div class="pt-3 border-t border-white/15 space-y-2 text-xs">
          <button type="button" onclick="toggleThemeMode()" class="w-full p-2.5 rounded-xl glass-card font-bold text-amber-300 flex items-center justify-between">
            <span>${isLight ? '🌙 تم تیره' : '☀️ تم روشن'}</span>
            <span>تغییر</span>
          </button>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" onclick="closeMobileDrawer(); triggerPwaInstall();" class="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/35 font-bold text-center">📲 نصب اپ</button>
            <button type="button" onclick="closeMobileDrawer(); openSupportQuickAction();" class="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/35 font-bold text-center">🎧 پشتیبانی</button>
          </div>
          ${state.currentUser ? `
            <button type="button" onclick="closeMobileDrawer(); logoutSession();" class="w-full py-2.5 px-3 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white font-black flex items-center justify-center gap-2 shadow-lg transition">
              <span>🚪 خروج از حساب کاربری</span>
            </button>
          ` : ''}
        </div>
      `;
    }

    function syncMobileBottomNavActiveState() {
      const page = state.currentPage || 'landing';
      const inMarketApp = (page === 'market' || page === 'listing_detail' || page === 'booth' || page === 'messages');
      document.body.setAttribute('data-active-app', inMarketApp ? 'market' : 'landing');
      document.body.setAttribute('data-current-page', page);

      const mainHdr = document.getElementById('main-landing-header');
      if (mainHdr) {
        if (page === 'landing') mainHdr.classList.remove('hidden');
        else mainHdr.classList.add('hidden');
      }

      const subNav = document.getElementById('subapp-mobile-bottom-nav');
      const socNav = document.getElementById('social-mobile-bottom-nav');
      if (subNav) {
        if (inMarketApp) {
          subNav.classList.remove('hidden');
        } else {
          subNav.classList.add('hidden');
        }
      }
      // منوی پایین شبکه‌های قفل‌شده (ریلزهای عمومی / ثبت پست) همیشه مخفی باشد تا در عهدبات یا غرفه نمایش داده نشود
      if (socNav) {
        socNav.classList.add('hidden');
      }

      const map = {
        landing: 'mob-nav-home',
        market: 'mob-nav-market',
        listing_detail: 'mob-nav-market',
        messages: 'mob-nav-messages',
        booth: 'mob-nav-account',
        admin_dashboard: 'mob-nav-account'
      };
      ['mob-nav-home', 'mob-nav-market', 'mob-nav-messages', 'mob-nav-account'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          if (map[page] === id) el.classList.add('active');
          else el.classList.remove('active');
        }
      });

      const mobLbl = document.getElementById('mobile-nav-booth-label');
      if (mobLbl) {
        if (page === 'booth' && (isRegisteredUser() || isAdmin())) {
          mobLbl.textContent = 'ویرایش پروفایل';
        } else {
          mobLbl.textContent = isAdmin() ? 'پنل ادمین' : (isRegisteredUser() ? 'غرفه من' : 'حساب من');
        }
      }
      const cartBadge = document.getElementById('mobile-nav-cart-badge');
      if (cartBadge && typeof getShoppingCartTotalCount === 'function') {
        const cTotal = getShoppingCartTotalCount();
        if (cTotal > 0) {
          cartBadge.textContent = cTotal > 99 ? '99+' : String(cTotal);
          cartBadge.classList.remove('hidden');
        } else {
          cartBadge.classList.add('hidden');
        }
      }
      const cnt = getUserMessagesAndOrdersCount();
      ['mobile-nav-msg-badge', 'social-nav-msg-badge'].forEach(bid => {
        const badge = document.getElementById(bid);
        if (badge) {
          if (cnt > 0) {
            badge.textContent = cnt > 99 ? '99+' : String(cnt);
            badge.classList.remove('hidden');
          } else {
            badge.classList.add('hidden');
          }
        }
      });

      updateWaveCounterWidget();
      renderDesktopRightPillDock();
      applyThemeMode(getThemeMode());
    }

    function openResidentLoginModal(reasonTitle = '') {
      if (isRegisteredUser()) { navigateToMarketPage(); return; }
      openModal(`
        <div class="p-5 space-y-4 text-xs">
          <div class="flex items-center justify-end">
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 hover:text-white font-bold">✕</button>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button type="button" onclick="switchAuthModalTab('login')" id="auth-tab-btn-login" class="py-2.5 px-3 rounded-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow">
              <svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>۱. ورود اعضا
            </button>
            <button type="button" onclick="switchAuthModalTab('register')" id="auth-tab-btn-register" class="py-2.5 px-3 rounded-xl font-bold glass-card text-amber-300">
              <svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M17 11h6"/></svg>۲. ثبت نام
            </button>
          </div>

          <div id="auth-modal-tab-body">
            ${renderResidentLoginFormHtml()}
          </div>
        </div>
      `);
    }

    function switchAuthModalTab(mode) {
      const btnL = document.getElementById('auth-tab-btn-login');
      const btnR = document.getElementById('auth-tab-btn-register');
      const body = document.getElementById('auth-modal-tab-body');
      if (!body) return;
      if (mode === 'login') {
        if (btnL) btnL.className = 'py-2.5 px-3 rounded-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow';
        if (btnR) btnR.className = 'py-2.5 px-3 rounded-xl font-bold glass-card text-amber-300';
        body.innerHTML = renderResidentLoginFormHtml();
      } else {
        if (btnR) btnR.className = 'py-2.5 px-3 rounded-xl font-black bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow';
        if (btnL) btnL.className = 'py-2.5 px-3 rounded-xl font-bold glass-card text-cyan-200';
        body.innerHTML = renderEntryPopupTabContent('resident');
      }
    }

    function renderResidentLoginFormHtml() {
      return `
        <form onsubmit="submitReturningResidentLogin(event)" class="glass-card rounded-2xl p-4 space-y-3 text-xs border border-cyan-400/30">
          <div class="font-bold text-cyan-300 text-sm flex items-center gap-1.5">
            <svg viewBox="0 0 24 24" class="svg-icon text-amber-300" aria-hidden="true"><circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L19 4m-2 2l3 3m-5 0l2 2"/></svg>
            <span>ورود اعضا و غرفه‌داران</span>
          </div>
          <div>
            <label class="block text-slate-300 mb-1">نام کاربری یا شماره تماس *</label>
            <input id="login-res-phone" type="text" required placeholder="نام کاربری یا شماره موبایل (0915...)" class="glass-input w-full px-3 py-2.5 rounded-xl" />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">رمز عبور *</label>
            <input id="login-res-pass" type="password" required placeholder="رمز عبور حساب شما..." class="glass-input w-full px-3 py-2.5 rounded-xl" />
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-black text-xs shadow-lg">
            ورود به حساب و بازار ←
          </button>
        </form>
      `;
    }

    async function submitReturningResidentLogin(e) {
      e.preventDefault();
      const rawId = faDigitsToEn(document.getElementById('login-res-phone').value.trim());
      const pass = faDigitsToEn(document.getElementById('login-res-pass').value);
      const phoneDigits = rawId.replace(/[^0-9]/g, '');

      const srv = await callServerApi('login_resident', { username: rawId, phone: phoneDigits || rawId, password: pass });
      if (srv && srv.error) return;

      if (srv && srv.user) {
        state.users[srv.user.username] = srv.user;
        state.currentUser = srv.user;
      } else {
        // Offline / local lookup by username or phone
        const foundUser = Object.values(state.users || {}).find(u =>
          u.username === rawId || u.phone === rawId || (phoneDigits && (u.phone === phoneDigits || u.username === 'res_' + phoneDigits))
        );
        if (foundUser) {
          state.currentUser = foundUser;
        } else {
          showToast('حسابی با این مشخصات یافت نشد. لطفاً ابتدا ثبت‌نام کنید.', 'error');
          return;
        }
      }
      closeModal();
      const targetDest = state.pendingAppDestination || 'market';
      state.pendingAppDestination = null;
      state.currentPage = targetDest;
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (targetDest === 'social_bot' && typeof loadSocialBotInitialData === 'function') loadSocialBotInitialData();
      showToast(`خوش آمدید ${state.currentUser.display_name} عزیز!`);
    }

    function updateFooterAndAdminBar() {
      const el = document.getElementById('footer-session-status');
      const mobLbl = document.getElementById('mobile-nav-booth-label');
      if (mobLbl) mobLbl.textContent = (state.currentPage === 'booth' && (isRegisteredUser() || isAdmin())) ? 'ویرایش پروفایل' : (isAdmin() ? 'پنل ادمین' : (isRegisteredUser() ? 'غرفه من' : 'حساب من'));
      const adminBar = document.getElementById('admin-moderation-bar');
      const footerActions = document.getElementById('footer-auth-actions');
      if (el) {
        if (!state.currentUser) {
          el.textContent = 'کاربر: مهمان';
          if (footerActions) {
            footerActions.innerHTML = `
              <button type="button" onclick="openResidentLoginModal()" class="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold transition flex items-center gap-1">
                <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg>
                <span>ورود / عضویت</span>
              </button>
              <button type="button" onclick="openDirectAdminLoginModal()" class="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/30 text-[11px] font-bold transition flex items-center gap-1">
                <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/></svg>
                <span>مدیریت</span>
              </button>
            `;
          }
        } else {
          el.innerHTML = `<strong class="text-amber-300">${escapeHtml(state.currentUser.display_name)}</strong> • <button type="button" onclick="logoutSession()" class="text-rose-400 hover:text-rose-300 font-bold underline">خروج</button>`;
          if (footerActions) {
            const inMarket = (state.currentPage === 'market' || state.currentPage === 'booth' || state.currentPage === 'messages');
            if (isAdmin() || !inMarket) {
              footerActions.innerHTML = '';
            } else {
              footerActions.innerHTML = `
                <button type="button" onclick="openMyBooth()" class="hidden md:inline-flex px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-400 hover:text-slate-950 text-cyan-200 border border-cyan-400/40 text-[11px] font-bold transition items-center gap-1">
                  <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/></svg>
                  <span>غرفه من</span>
                </button>
              `;
            }
          }
        }
      }
      if (adminBar) {
        adminBar.classList.add('hidden');
        adminBar.innerHTML = '';
      }
      const sideTrigger = document.getElementById('admin-floating-side-trigger');
      if (sideTrigger) {
        sideTrigger.classList.add('hidden');
        sideTrigger.innerHTML = '';
      }
      if (isAdmin() && typeof renderAdminSideDrawerContent === 'function') {
        renderAdminSideDrawerContent();
      }
    }

    function navigateToAdminDashboard(tab = 'pending_queue') {
      if (!isAdmin()) {
        openDirectAdminLoginModal();
        return;
      }
      state.adminActiveTab = tab;
      state.currentPage = 'admin_dashboard';
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function navigateToMarketPage() {
      state.currentPage = 'market';
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openBoothPage(username) {
      state.selectedBoothUsername = username;
      state.currentPage = 'booth';
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openMyBooth() {
      if (!requireRegisteredAccount('مدیریت غرفه اختصاصی من')) return;
      openBoothPage(state.currentUser.username);
    }

    function logoutSession() {
      state.currentUser = null;
      callServerApi('logout', {});
      state.currentPage = 'landing';
      saveState();
      renderCurrentPage();
      showToast('از حساب کاربری خارج شدید.');
    }


    function openDirectAdminLoginModal() {
      if (isAdmin()) {
        navigateToAdminDashboard('pending_queue');
        return;
      }
      openModal(`
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-amber-300 text-base"><svg viewBox="0 0 24 24" class="svg-icon ml-1.5" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/></svg>ورود به داشبورد جامع مدیریت ادمین</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-white font-bold">✕</button>
          </div>
          <form onsubmit="submitAdminEntry(event, 'admin_dashboard')" class="space-y-3 text-xs">
            <div>
              <label class="block text-slate-300 mb-1">نام کاربری ادمین *</label>
              <input id="adm-user" type="text" required value="admin" class="glass-input w-full px-3 py-2.5 rounded-xl" />
            </div>
            <div>
              <label class="block text-slate-300 mb-1">رمز عبور مدیریت *</label>
              <input id="adm-pass" type="password" required placeholder="رمز عبور مدیریت را وارد کنید..." class="glass-input w-full px-3 py-2.5 rounded-xl" />
            </div>
            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-lg">
              ورود ادمین و باز کردن داشبورد مدیریت
            </button>
          </form>
        </div>
      `);
    }

    // =========================================================================
    // HERO SLIDER LOGIC
    // =========================================================================

    function handleActiveMarketCardClick() {
      state.pendingAppDestination = 'market';
      if (state.currentUser) {
        navigateToMarketPage();
        return;
      }
      openModal(`
        <div class="p-5 space-y-4">
          <div class="flex items-center justify-end">
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold">✕</button>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button type="button" onclick="switchEntryPopupTab('login')" id="ep-tab-login" class="py-2.5 px-2 rounded-xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 shadow">
              ۱. ورود اعضا
            </button>
            <button type="button" onclick="switchEntryPopupTab('resident')" id="ep-tab-resident" class="py-2.5 px-2 rounded-xl font-bold glass-card text-amber-300">
              ۲. ثبت نام
            </button>
            <button type="button" onclick="switchEntryPopupTab('guest')" id="ep-tab-guest" class="py-2.5 px-2 rounded-xl font-bold glass-card text-slate-200">
              ۳. مشاهده به عنوان مهمان
            </button>
            <button type="button" onclick="switchEntryPopupTab('admin')" id="ep-tab-admin" class="py-2.5 px-2 rounded-xl font-bold glass-card text-rose-200">
              ۴. مدیریت
            </button>
          </div>

          <div id="entry-popup-body">
            ${renderEntryPopupTabContent('login')}
          </div>
        </div>
      `);
    }

    function switchEntryPopupTab(tabMode) {
      ['login', 'resident', 'guest', 'admin'].forEach(t => {
        const btn = document.getElementById('ep-tab-' + t);
        if (btn) {
          btn.className = (t === tabMode)
            ? 'py-2.5 px-2 rounded-xl font-black bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 shadow'
            : 'py-2.5 px-2 rounded-xl font-bold glass-card text-slate-200';
        }
      });
      const body = document.getElementById('entry-popup-body');
      if (body) body.innerHTML = renderEntryPopupTabContent(tabMode);
    }

    function renderEntryPopupTabContent(tabMode) {
      if (tabMode === 'login') return renderResidentLoginFormHtml();
      if (tabMode === 'guest') {
        return `
          <div class="glass-card rounded-2xl p-4 space-y-3 text-xs border border-emerald-400/30">
            <div class="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <svg viewBox="0 0 24 24" class="svg-icon " aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>ورود به عنوان مهمان</span>
            </div>
            <p class="text-slate-300 leading-relaxed">
              مهمانان می‌توانند تمامی آگهی‌ها، پیشنهادهای شگفت‌انگیز، استوری‌ها و غرفه‌های کسب‌وکارهای شمال شرق را مشاهده نمایند (برای ثبت آگهی، خرید یا داشتن غرفه باید ثبت‌نام کنید).
            </p>
            <button type="button" onclick="confirmMarketEntry('guest')" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black text-xs shadow-lg hover:opacity-95 transition">
              ورود به عنوان مهمان ←
            </button>
          </div>
        `;
      }
      if (tabMode === 'resident') {
        return `
          <form onsubmit="submitResidentEntry(event)" class="glass-card rounded-2xl p-4 space-y-3 text-xs border border-cyan-400/30 max-h-[68vh] overflow-y-auto">
            <div class="flex items-center justify-between border-b border-white/10 pb-2">
              <div class="font-black text-amber-300 text-sm">فرم ثبت‌نام سریع</div>
              <span class="text-[10px] text-emerald-300 font-bold">ساده و بدون فیلدهای اضافی</span>
            </div>

            <!-- ۱. نام و نام خانوادگی + شماره تماس -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block text-slate-300 font-bold mb-1">نام و نام خانوادگی *</label>
                <input id="res-full-name" type="text" required placeholder="مثلاً: علی محمدی" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">شماره تماس *</label>
                <input id="res-phone" type="tel" required placeholder="0915..." class="glass-input w-full px-3 py-2 rounded-xl dir-ltr text-left" />
              </div>
            </div>

            <!-- ۲. آدرس -->
            <div>
              <label class="block text-slate-300 font-bold mb-1">آدرس *</label>
              <input id="res-exact-address" type="text" required placeholder="مشهد، منطقه شمال شرق، شمال شرق ...، کوچه ..." class="glass-input w-full px-3 py-2 rounded-xl" />
            </div>

            <!-- ۳. نام کاربری و رمز عبور -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block text-cyan-300 font-bold mb-1">نام کاربری *</label>
                <input id="res-username" type="text" required minlength="3" placeholder="مثلاً: ali_mohammadi" class="glass-input w-full px-3 py-2 rounded-xl dir-ltr text-left" />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">رمز عبور *</label>
                <input id="res-pass" type="password" required minlength="4" placeholder="حداقل ۴ کاراکتر" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
            </div>

            <!-- ۴. کارت ملی (اختیاری - مخصوص ثبت آگهی در غرفه) -->
            <div class="p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 space-y-1.5">
              <label class="block font-black text-amber-300">
                اگر خواهان ثبت آگهی در غرفه خود هستید کارت ملی را بارگذاری کنید.
              </label>
              <input id="res-national-card" type="file" accept="image/*" onchange="previewNationalCardUpload(this)" class="glass-input w-full px-3 py-2 rounded-xl" />
              <div id="res-natcard-preview-box" class="hidden pt-1 flex items-center gap-3">
                <img id="res-natcard-preview-img" src="" alt="پیش‌نمایش کارت ملی" class="w-24 h-16 object-cover rounded-xl border border-amber-400/60" />
                <span class="text-[11px] text-emerald-300 font-bold">✔ تصویر کارت ملی آماده ثبت است</span>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-xs shadow-lg">
              ثبت‌نام و ورود به عهد بازار ←
            </button>
          </form>
        `;
      }
      return `
        <form onsubmit="submitAdminEntry(event, 'market')" class="glass-card rounded-2xl p-4 space-y-3 text-xs border border-amber-400/30">
          <div class="font-bold text-amber-300 text-sm">ورود مدیر سامانه (ادمین شمال شرق)</div>
          <div>
            <label class="block text-slate-300 mb-1">نام کاربری ادمین *</label>
            <input id="adm-user" type="text" required value="admin" class="glass-input w-full px-3 py-2 rounded-xl" />
          </div>
          <div>
            <label class="block text-slate-300 mb-1">رمز عبور ادمین *</label>
            <input id="adm-pass" type="password" required placeholder="رمز عبور مدیریت..." class="glass-input w-full px-3 py-2 rounded-xl" />
          </div>
          <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-xs shadow-lg">
            ورود ادمین ←
          </button>
        </form>
      `;
    }

    function previewNationalCardUpload(inputEl) {
      readImageFileAsDataUrl(inputEl, 900, function(dataUrl) {
        const box = document.getElementById('res-natcard-preview-box');
        const img = document.getElementById('res-natcard-preview-img');
        if (dataUrl && box && img) {
          img.src = dataUrl;
          box.classList.remove('hidden');
        }
      });
    }

    function confirmMarketEntry(mode) {
      if (mode === 'guest') {
        state.currentUser = {
          username: 'guest',
          display_name: 'مهمان محله شمال شرق',
          role: 'guest',
          role_title: 'مهمان (فقط مشاهده)',
          alley: 'شمال شرق'
        };
      }
      const targetDest = state.pendingAppDestination || 'market';
      state.pendingAppDestination = null;
      if (targetDest === 'social_bot' && mode === 'guest') {
        showToast('برای استفاده از استودیو عهدبات لطفاً ابتدا وارد حساب کاربری خود شوید یا ثبت‌نام کنید.', 'warning');
        switchEntryPopupTab('login');
        return;
      }
      closeModal();
      state.currentPage = targetDest;
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    async function finalizeResidentRegistration(fullName, phone, exactAddress, uname, pass, natCardDataUrl) {
      const parts = fullName.split(/\s+/);
      const firstName = parts[0] || fullName;
      const lastName = parts.slice(1).join(' ') || '';
      const boothTitle = 'غرفه ' + fullName;
      const payload = {
        first_name: firstName,
        last_name: lastName,
        display_name: fullName,
        age: 0,
        national_code: '',
        exact_address: exactAddress,
        phone: phone,
        email: '',
        username: uname,
        password: pass,
        password_confirm: pass,
        national_card_image: natCardDataUrl || '',
        alley: exactAddress,
        booth_title: boothTitle
      };

      const srv = await callServerApi('auth_resident', payload);
      if (srv && srv.error) return;

      const userObj = (srv && srv.user) ? srv.user : {
        username: uname,
        first_name: firstName,
        last_name: lastName,
        display_name: fullName,
        age: 0,
        national_code: '',
        exact_address: exactAddress,
        phone: phone,
        email: '',
        national_card_image: natCardDataUrl || null,
        alley: exactAddress,
        booth_title: boothTitle,
        booth_bio: 'عرضه مستقیم محصولات و خدمات در ' + exactAddress,
        booth_hours: 'همه‌روزه ۹ صبح تا ۲۱',
        booth_status: 'pending',
        booth_rejection_reason: null,
        role: 'resident',
        role_title: 'عضو محله (در انتظار تایید غرفه توسط مدیریت)'
      };

      state.users[uname] = userObj;
      state.currentUser = userObj;
      closeModal();
      const targetDest = state.pendingAppDestination || 'market';
      state.pendingAppDestination = null;
      state.currentPage = targetDest;
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (targetDest === 'social_bot' && typeof loadSocialBotInitialData === 'function') loadSocialBotInitialData();
      showToast(`ثبت‌نام شما انجام شد ${fullName} عزیز! پس از تایید مدیریت، امکان ثبت آگهی در عهد بازار برایتان فعال می‌شود.`);
    }

    function submitResidentEntry(e) {
      e.preventDefault();
      const fullName = ((document.getElementById('res-full-name') || {}).value || '').trim();
      const exactAddress = ((document.getElementById('res-exact-address') || {}).value || '').trim();
      const phone = faDigitsToEn(((document.getElementById('res-phone') || {}).value || '')).replace(/[^0-9]/g, '');
      const rawUsername = faDigitsToEn(((document.getElementById('res-username') || {}).value || '').trim());
      const uname = rawUsername.replace(/[^a-zA-Z0-9_.-]/g, '') || ('user_' + phone);
      const pass = faDigitsToEn((document.getElementById('res-pass') || {}).value || '');
      const natCardInput = document.getElementById('res-national-card');

      if (!fullName || !exactAddress || phone.length < 8 || !uname) {
        showToast('لطفاً نام و نام خانوادگی، شماره تماس، آدرس و نام کاربری را کامل وارد نمایید.', 'error');
        return;
      }
      if (pass.length < 4) {
        showToast('رمز عبور باید حداقل ۴ کاراکتر باشد.', 'error');
        return;
      }

      if (natCardInput && natCardInput.files && natCardInput.files[0]) {
        readImageFileAsDataUrl(natCardInput, 900, function(natCardDataUrl) {
          finalizeResidentRegistration(fullName, phone, exactAddress, uname, pass, natCardDataUrl || '');
        });
      } else {
        finalizeResidentRegistration(fullName, phone, exactAddress, uname, pass, '');
      }
    }

    async function submitAdminEntry(e, targetDest = 'admin_dashboard') {
      e.preventDefault();
      const u = faDigitsToEn(((document.getElementById('adm-user') || {}).value || 'admin').trim());
      const p = faDigitsToEn(((document.getElementById('adm-pass') || {}).value || '').trim());
      const srv = await callServerApi('login_admin', { username: u, password: p });
      if (srv && srv.error) {
        return;
      }
      if (srv && srv.user) {
        state.currentUser = srv.user;
        await callServerApi('load_state');
      } else if (u.toLowerCase() === 'admin' && p.length > 0) {
        // Fallback so Admin login never blocks if local PHP server is restarting
        const fallbackTok = 'adm_local_' + Date.now() + '_token_secure';
        state.currentUser = {
          username: 'admin',
          display_name: 'مدیریت سامانه هم‌عهدی',
          booth_title: 'غرفه مرکزی هم‌عهدی',
          phone: '05132100000',
          alley: 'شمال شرق',
          role: 'admin',
          role_title: 'مدیر کل سامانه',
          booth_status: 'approved',
          admin_token: fallbackTok,
          token: fallbackTok
        };
      } else {
        showToast('نام کاربری یا رمز عبور ادمین صحیح نیست.', 'error');
        return;
      }
      closeModal();
      state.currentPage = targetDest || 'admin_dashboard';
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      showToast('با سطح دسترسی «مدیر کل سامانه (ادمین)» وارد شدید.');
    }


    function openAdminSideDrawer() {
      if (!isAdmin()) {
        openDirectAdminLoginModal();
        return;
      }
      renderAdminSideDrawerContent();
      const bd = document.getElementById('admin-side-drawer-backdrop');
      if (bd) bd.classList.remove('hidden');
    }

    function closeAdminSideDrawer() {
      const bd = document.getElementById('admin-side-drawer-backdrop');
      if (bd) bd.classList.add('hidden');
    }

    function selectAdminSideTab(tabName) {
      closeAdminSideDrawer();
      navigateToAdminDashboard(tabName);
    }

    function renderAdminSideDrawerContent() {
      const box = document.getElementById('admin-side-drawer-content');
      if (!box || !isAdmin()) return;
      const p = getPendingCounts();
      const tab = state.adminActiveTab || 'pending_queue';
      const allUsers = Object.values(state.users || {});
      const allBotChannels = (typeof ensureRegisteredBotChannelsInitialized === 'function') ? ensureRegisteredBotChannelsInitialized() : (state.registeredBotChannels || []);
      const pendingBotCount = (p.botChannels || []).length;
      const pendingQueueCount = (p.booths ? p.booths.length : 0) + p.listings.length + p.slides.length + p.stories.length + p.messages.length;

      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-white/15 pb-3">
          <div class="flex items-center gap-2.5">
            <img src="./icon-512.png?v=3.1.6" alt="هم‌عهدی" class="w-10 h-10 rounded-xl object-cover border border-amber-400/50" />
            <div>
              <div class="font-black text-amber-300 text-sm">منوی کناری مدیریت</div>
              <div class="text-[10px] text-emerald-300 font-bold">مدیر کل سامانه فعال است</div>
            </div>
          </div>
          <button type="button" onclick="closeAdminSideDrawer()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold">✕</button>
        </div>

        <!-- خلاصه وضعیت سریع در منوی کناری -->
        <div class="grid grid-cols-2 gap-2 text-center text-[11px]">
          <div class="glass-card p-2.5 rounded-xl border border-amber-400/35">
            <div class="text-base font-black text-amber-300">${p.total.toLocaleString('fa-IR')}</div>
            <div class="text-slate-300 text-[10px]">کل موارد منتظر تایید</div>
          </div>
          <div class="glass-card p-2.5 rounded-xl border border-cyan-400/35">
            <div class="text-base font-black text-cyan-300">${allBotChannels.length.toLocaleString('fa-IR')}</div>
            <div class="text-slate-300 text-[10px]">کانال‌های فعال عهدبات</div>
          </div>
        </div>

        <!-- دکمه‌های ناوبری و ابزارهای کامل مدیریت در منوی کناری -->
        <div class="space-y-2 text-xs">
          <div class="text-[10px] font-black text-slate-400 px-1">بخش‌های مدیریت اپلیکیشن:</div>

          <button type="button" onclick="selectAdminSideTab('pending_queue')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'pending_queue' ? 'bg-amber-400 text-slate-950 shadow-lg' : 'glass-card text-slate-100 hover:border-amber-400/50'}">
            <span>⏳ ۱. صف تایید غرفه‌ها و محتوا</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${state.currentPage === 'admin_dashboard' && tab === 'pending_queue' ? 'bg-slate-950 text-amber-300' : 'bg-amber-500/20 text-amber-300'}">${pendingQueueCount.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="selectAdminSideTab('ahdbot_admin')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'ahdbot_admin' ? 'bg-cyan-400 text-slate-950 shadow-lg' : 'glass-card text-slate-100 hover:border-cyan-400/50'}">
            <span>🤖 ۲. ارسال پیام عهدبات به کانال‌ها</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] ${state.currentPage === 'admin_dashboard' && tab === 'ahdbot_admin' ? 'bg-slate-950 text-cyan-300' : 'bg-cyan-500/20 text-cyan-300'}">${pendingBotCount > 0 ? (pendingBotCount.toLocaleString('fa-IR') + ' منتظر') : allBotChannels.length.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="selectAdminSideTab('booths_users')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'booths_users' ? 'bg-emerald-400 text-slate-950 shadow-lg' : 'glass-card text-slate-100 hover:border-emerald-400/50'}">
            <span>🏪 ۳. غرفه‌داران و کاربران</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/10">${allUsers.length.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="selectAdminSideTab('all_listings')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'all_listings' ? 'bg-purple-400 text-slate-950 shadow-lg' : 'glass-card text-slate-100 hover:border-purple-400/50'}">
            <span>📦 ۴. مدیریت کل آگهی‌ها</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/10">${(state.listings || []).length.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="selectAdminSideTab('promotions')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'promotions' ? 'bg-rose-500 text-white shadow-lg' : 'glass-card text-slate-100 hover:border-rose-400/50'}">
            <span>🚀 ۵. تایید نردبان و شگفت‌انگیز</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/10">${p.promos.length.toLocaleString('fa-IR')}</span>
          </button>

          <button type="button" onclick="selectAdminSideTab('orders')" class="w-full p-3 rounded-2xl font-black transition flex items-center justify-between ${state.currentPage === 'admin_dashboard' && tab === 'orders' ? 'bg-sky-400 text-slate-950 shadow-lg' : 'glass-card text-slate-100 hover:border-sky-400/50'}">
            <span>🛍️ ۶. سفارش‌ها و تنظیمات اپ</span>
            <span class="px-2 py-0.5 rounded-full text-[10px] bg-white/10">${(state.orders || []).length.toLocaleString('fa-IR')}</span>
          </button>
        </div>

        <!-- میانبرهای سریع محیط برنامه در منوی کناری -->
        <div class="pt-3 border-t border-white/15 space-y-2 text-xs">
          <div class="text-[10px] font-black text-slate-400 px-1">دسترسی سریع به صفحات:</div>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" onclick="closeAdminSideDrawer(); returnToLandingPage();" class="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-center">🏠 پیشخوان</button>
            <button type="button" onclick="closeAdminSideDrawer(); navigateToMarketPage();" class="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 font-bold text-center">🏪 عهد بازار</button>
            <button type="button" onclick="closeAdminSideDrawer(); openSocialBotStudioPage();" class="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 font-bold text-center">🤖 استودیو عهدبات</button>
            <button type="button" onclick="downloadAdminFullBackup()" class="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold text-center">💾 پشتیبان</button>
          </div>
          <button type="button" onclick="closeAdminSideDrawer(); logoutSession();" class="w-full py-2.5 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white font-black text-center mt-2">
            خروج از حساب مدیریت
          </button>
        </div>
      `;
    }


    // HAMAHDI v5.0: منوی کناری اختصاصی اپلیکیشن اندروید (بدون داشبورد مدیریت — دارای تنظیمات سرور لوکال/هاست)
    function openMobileUserDrawer() {
      renderMobileUserDrawerContent();
      const bd = document.getElementById('mobile-side-drawer-backdrop');
      if (bd) bd.classList.remove('hidden');
    }
    function closeMobileUserDrawer() {
      const bd = document.getElementById('mobile-side-drawer-backdrop');
      if (bd) bd.classList.add('hidden');
    }
    function openAdminSideDrawer() {
      openMobileUserDrawer();
    }
    function renderMobileUserDrawerContent() {
      const box = document.getElementById('mobile-side-drawer-content');
      if (!box) return;
      const u = state.currentUser || {};
      const loggedIn = !!(u.username && u.role !== 'guest');
      const curServer = (typeof window.hamahdiGetServerUrl === 'function') ? window.hamahdiGetServerUrl() : '';
      box.innerHTML = `
        <div class="flex items-center justify-between border-b border-white/15 pb-3">
          <div class="flex items-center gap-2.5">
            <img src="./icon-512.png" alt="هم‌عهدی" class="w-10 h-10 rounded-xl object-cover border border-amber-400/50" />
            <div>
              <div class="font-black text-amber-300 text-sm">هم‌عهدی نسخه ۵</div>
              <div class="text-[10px] text-slate-300">${loggedIn ? escapeHtml(u.display_name || u.username) : 'کاربر مهمان'}</div>
            </div>
          </div>
          <button type="button" onclick="closeMobileUserDrawer()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold">✕</button>
        </div>
        <div class="space-y-2 text-xs">
          <button type="button" onclick="closeMobileUserDrawer(); returnToLandingPage();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-slate-100 hover:border-amber-400/50 flex items-center justify-between"><span>🏠 صفحه اصلی و آمار معنوی</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); handleActiveMarketCardClick();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-amber-200 hover:border-amber-400/50 flex items-center justify-between"><span>🏪 عهد بازار</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); handleMobileBoothOrLogin();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-emerald-200 hover:border-emerald-400/50 flex items-center justify-between"><span>🛒 غرفه من و سفارش‌ها</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); openMessagesCenterPage('chats', 'market');" class="w-full p-3 rounded-2xl glass-card text-right font-black text-sky-200 hover:border-sky-400/50 flex items-center justify-between"><span>💬 پیام‌ها و گفتگوها</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); handleEntryToAhdbotClick();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-cyan-200 hover:border-cyan-400/50 flex items-center justify-between"><span>🤖 استودیو عهدبات (۴ پیام‌رسان)</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); openHamahdiAiChatPage();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-teal-200 hover:border-teal-400/50 flex items-center justify-between"><span>✨ عهدهوش (هوش مصنوعی متنی)</span><span>←</span></button>
          <button type="button" onclick="closeMobileUserDrawer(); openHamahdSpiritualPage();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-purple-200 hover:border-purple-400/50 flex items-center justify-between"><span>📖 هم‌عهد (میثاق معنوی)</span><span>←</span></button>
          <button type="button" onclick="toggleThemeMode();" class="w-full p-3 rounded-2xl glass-card text-right font-black text-amber-200 hover:border-amber-400/50 flex items-center justify-between"><span id="drawer-theme-label">☀️ تغییر به تم روشن (لایت‌مود)</span><span>🎨</span></button>
        </div>
        <div class="pt-3 border-t border-white/15 space-y-2 text-xs">
          <button type="button" onclick="closeMobileUserDrawer(); openServerConnectionModal();" class="w-full p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 font-black text-right">
            <div>🌐 تنظیمات سرور (لوکال / هاست)</div>
            <div class="text-[10px] font-mono text-slate-300 mt-1 truncate dir-ltr text-left">${escapeHtml(curServer)}</div>
          </button>
          ${loggedIn ? `<button type="button" onclick="closeMobileUserDrawer(); logoutSession();" class="w-full py-2.5 rounded-xl bg-rose-600/85 hover:bg-rose-600 text-white font-black text-center">خروج از حساب کاربری</button>` : `<button type="button" onclick="closeMobileUserDrawer(); openResidentAuthModal();" class="w-full py-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 font-black text-center">ورود / ثبت‌نام در هم‌عهدی</button>`}
        </div>
      `;
    }
