/**
 * HAMAHDI v4.0.0 | ماژول صفحه اصلی (پیشخوان)، هیرو اسلایدر، ۶ کارت سوپراپلیکیشن و Prefetch
 */
/**
 * HAMAHDI (هم‌عهدی) - ماژول رابط کاربری، اسلایدر، غرفه اختصاصی، مرکز پیام‌ها، کارت تبلیغاتی QR و داشبورد مدیریت (نسخه 6.0)
 */
    function triggerLeaderPhotoUpload(slot) {
      if (!isAdmin()) {
        showToast('تغییر تصاویر قاب هدر فقط مخصوص مدیر سامانه (ادمین) است.', 'warning');
        return;
      }
      const inp = document.getElementById('leader-file-' + slot);
      if (inp) inp.click();
    }

    function handleLeaderPhotoSelected(event, slot) {
      if (!isAdmin()) return;
      readImageFileAsDataUrl(event.target, 500, function(dataUrl) {
        if (!dataUrl) return;
        state.leaderPhotos[slot] = dataUrl;
        applyLeaderPhotos();
        saveState();
        callServerApi('save_leader_photo', { slot: slot, image_data: dataUrl });
        showToast('تصویر قاب هدر توسط ادمین ذخیره شد.');
      });
    }

    function applyLeaderPhotos() {
      [1].forEach(slot => {
        const url = state.leaderPhotos && state.leaderPhotos[slot];
        const container = document.getElementById('leader-img-container-' + slot);
        if (url && container) {
          const label = '';
          container.innerHTML = `
            <div class="w-full h-full relative">
              <img src="${url}" alt="${label}" class="w-full h-full object-cover rounded-xl max-w-full" />
              ${isAdmin() ? `<button type="button" onclick="event.stopPropagation(); deleteLeaderPhoto(${slot})" title="حذف تصویر هدر (فقط ادمین)" class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center shadow">✕</button>` : ''}
              ${label ? `<div class="absolute bottom-0 inset-x-0 bg-slate-950/85 text-[8px] font-bold text-amber-300 py-0.5 text-center truncate px-1">${label}</div>` : ""}
            </div>
          `;
        }
      });
    }

    function deleteLeaderPhoto(slot) {
      if (!isAdmin()) {
        showToast('حذف تصویر قاب هدر فقط توسط ادمین مجاز است.', 'error');
        return;
      }
      state.leaderPhotos[slot] = null;
      saveState();
      callServerApi('delete_leader_photo', { slot: slot });
      showToast('تصویر قاب هدر حذف و به حالت پیش‌فرض بازگردانده شد.', 'warning');
      location.reload();
    }


    function startHeroSliderTimer() {
      if (heroSliderInterval) {
        clearInterval(heroSliderInterval);
        heroSliderInterval = null;
      }
      const approved = getApprovedHeroSlides();
      if (state.currentPage === 'landing' && approved.length > 1) {
        heroSliderInterval = setInterval(() => {
          stepHeroSlide(1);
        }, 3000);
      }
    }

    function stepHeroSlide(delta) {
      const approved = getApprovedHeroSlides();
      if (approved.length === 0) return;
      state.activeSlideIndex = (state.activeSlideIndex + delta + approved.length) % approved.length;
      updateHeroSlideDOM();
      startHeroSliderTimer();
    }

    function goToHeroSlide(idx) {
      const approved = getApprovedHeroSlides();
      if (idx < 0 || idx >= approved.length) return;
      state.activeSlideIndex = idx;
      updateHeroSlideDOM();
      startHeroSliderTimer();
    }

    function updateHeroSlideDOM() {
      const approved = getApprovedHeroSlides();
      const slideImg = document.getElementById('hero-slider-img');
      const slideBg = document.getElementById('hero-slider-bg-blur');
      const slidePhotog = document.getElementById('hero-slider-photographer');
      const dotsWrap = document.getElementById('hero-slider-dots');
      if (!slideImg || approved.length === 0) return;
      if (state.activeSlideIndex >= approved.length) state.activeSlideIndex = 0;
      const current = approved[state.activeSlideIndex];
      slideImg.src = current.image_data;
      if (slideBg) slideBg.src = current.image_data;
      if (slidePhotog) slidePhotog.textContent = 'عکاس: ' + current.photographer_name;
      if (dotsWrap) {
        dotsWrap.innerHTML = approved.map((_, idx) => `
          <button type="button" onclick="goToHeroSlide(${idx})" class="h-2 rounded-full transition-all ${idx === state.activeSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'}"></button>
        `).join('');
      }
    }

    function openUploadHeroSlideModal() {
      openModal(`
        <div class="p-6 space-y-4">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-white text-base">افزودن تصویر به بنر اسلایدی</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 hover:text-white font-bold">✕</button>
          </div>
          ${!isAdmin() ? `
            <div class="p-3 rounded-xl bg-amber-500/15 border border-amber-400/35 text-[11px] text-amber-200 leading-relaxed">
              <svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 2v20"/></svg>توجه: تصویر ارسالی شما ابتدا به <strong>داشبورد ادمین</strong> ارسال می‌شود و پس از تایید ادمین در بنر اسلایدی به نمایش درمی‌آید.
            </div>
          ` : ''}
          <form onsubmit="submitNewHeroSlide(event)" class="space-y-4 text-xs">
            <div>
              <label class="block font-bold text-amber-300 mb-1.5">انتخاب تصویر بنر (الزامی) *</label>
              <input id="hs-image" type="file" accept="image/*" required class="glass-input w-full px-3 py-2.5 rounded-xl text-xs file:ml-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-amber-400 file:text-slate-950 file:font-black" />
            </div>
            <div>
              <label class="block font-bold text-slate-200 mb-1.5">نام شخص عکاس (الزامی) *</label>
              <input id="hs-photographer" type="text" required placeholder="نام و نام خانوادگی عکاس..." class="glass-input w-full px-3.5 py-2.5 rounded-xl" />
            </div>
            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs shadow-lg">
              ${isAdmin() ? 'ثبت و انتشار مستقیم توسط ادمین' : 'ارسال تصویر برای تایید ادمین'}
            </button>
          </form>
        </div>
      `);
    }

    function submitNewHeroSlide(e) {
      e.preventDefault();
      const fileInp = document.getElementById('hs-image');
      const photog = document.getElementById('hs-photographer').value.trim();
      if (!fileInp || !fileInp.files || !fileInp.files[0] || !photog) {
        showToast('لطفاً تصویر و نام عکاس را وارد نمایید.', 'error');
        return;
      }
      readImageFileAsDataUrl(fileInp, 1280, function(dataUrl) {
        if (!dataUrl) return;
        const initialStatus = isAdmin() ? 'approved' : 'pending';
        const newSlide = {
          id: Date.now(),
          image_data: dataUrl,
          photographer_name: photog,
          submitted_by: state.currentUser ? state.currentUser.display_name : 'اهالی شمال شرق',
          status: initialStatus
        };
        state.heroSlides.unshift(newSlide);
        state.activeSlideIndex = 0;
        closeModal();
        saveState();
        renderCurrentPage();
        callServerApi('add_slide', newSlide);
        if (initialStatus === 'approved') {
          showToast('تصویر توسط ادمین منتشر شد.');
        } else {
          showToast('تصویر شما ثبت شد و پس از تایید ادمین در بنر اسلایدی منتشر خواهد شد.', 'warning');
        }
      });
    }

    function deleteCurrentHeroSlide() {
      if (!isAdmin()) {
        showToast('فقط مدیر سامانه (ادمین) مجاز به حذف تصاویر هدر است!', 'error');
        return;
      }
      const approved = getApprovedHeroSlides();
      if (approved.length === 0) return;
      const targetSlide = approved[state.activeSlideIndex];
      if (!targetSlide) return;
      state.heroSlides = state.heroSlides.filter(s => s.id !== targetSlide.id);
      state.activeSlideIndex = 0;
      saveState();
      renderCurrentPage();
      callServerApi('delete_slide', { id: targetSlide.id });
      showToast('تصویر بنر توسط ادمین حذف شد.', 'warning');
    }

    // =========================================================================
    // 4 TALL CARTABLES & ENTRY POPUP (Requirement 9 & 10)
    // =========================================================================
    function handleUnderConstructionCardClick(moduleKey) {
      const modulesInfo = {
        'news': {
          title: 'عهدینو (پیام متنی و صوتی)',
          subtitle: 'رسانه پیام‌رسان، روایتگری و اطلاع‌رسانی اهالی',
          badgeColor: 'text-sky-300 border-sky-400/40 bg-sky-500/20',
          icon: 'fa-tower-broadcast',
          goal: 'کنترل جریان اطلاعات، انتشار سریع گزارش‌های موثق و گفتگوهای متنی و صوتی در محله شمال شرق',
          features: [
            'انتشار لحظه‌ای اخبار رسمی و اطلاعیه‌های مساجد، مدارس و مراکز محله',
            'امکان ارسال گزارش‌های کوتاه متنی و پیام‌های صوتی (Voice) توسط اهالی',
            'نظام راستی‌آزمایی جمعی جهت تفکیک محتوای تاییدشده از شایعات محله',
            'کانال‌های اختصاصی اطلاعیه‌های فوری شهری، حوادث و امداد محلی'
          ],
          futureVision: 'اپلیکیشن «عهدینو» در فاز بعدی فعال خواهد شد تا نبض خبری و پیام‌های متنی و صوتی اهالی بدون واسطه در اختیار همگان قرار گیرد.'
        },
        'culture': {
          title: 'عهدانه (رسانه ویدیویی و تصویری)',
          subtitle: 'گنجینه ویدیویی، تصویری و مستندسازی فرهنگی',
          badgeColor: 'text-fuchsia-300 border-fuchsia-400/40 bg-fuchsia-500/20',
          icon: 'fa-masks-theater',
          goal: 'ثبت هویت بصری، روایت‌های ویدیویی و تصویری، هنر و خاطرات ماندگار اهالی',
          features: [
            'آرشیو فیلم‌ها و تصاویر رویدادها، مراسم‌ها و سیر تحول محله شمال شرق',
            'گنجینه ویدیویی یادواره شهدا، مفاخر، پیشکسوتان و معتمدین شمال شرق',
            'نمایشگاه مجازی آثار هنری، کلیپ‌های مردمی و تولیدات رسانه‌ای جوانان',
            'ثبت خاطرات تصویری و داستان‌های زندگی اهالی با حفظ حقوق پدیدآورنده'
          ],
          futureVision: 'اپلیکیشن «عهدانه» بستری ماندگار برای اشتراک‌گذاری رسانه ویدیویی و تصویری اهالی خواهد بود.'
        },
        'map': {
          title: 'عهدیار (خدمات و نقشه)',
          subtitle: 'نقشه تعاملی خدمات شهری و همیاری جغرافیایی',
          badgeColor: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/20',
          icon: 'fa-map-location-dot',
          goal: 'تسهیل دسترسی فوری به نیازها، خدمات عمومی و ایجاد شبکه همیاری جغرافیایی روی نقشه',
          features: [
            'نقشه تعاملی دقیق شمال شرق (کوچه‌ها، مساجد، درمانگاه‌ها، داروخانه‌ها و ایستگاه‌های مترو)',
            'ثبت نقاط نیازمند امداد و همیاری فوری (پزشکی، دارویی، غذایی) با حفظ کامل حریم خصوصی',
            'مسیریابی هوشمند به غرفه‌ها و مغازه‌های کسب‌وکار اهالی در سراسر بلوار شمال شرق',
            'اتصال مستقیم داوطلبان خدمت‌رسانی به نیازمندان در شرایط اضطراری یا بحران'
          ],
          futureVision: 'با تکمیل اپلیکیشن «عهدیار»، هیچ همسایه‌ای در شرایط اضطراری یا نیازهای خدماتی تنها نخواهد ماند.'
        },
        'edu': {
          title: 'عهدآموز (محتواهای آموزشی)',
          subtitle: 'مرکز آموزش مهارت، کسب‌وکار و ارتقای دانش اهالی',
          badgeColor: 'text-indigo-300 border-indigo-400/40 bg-indigo-500/20',
          icon: 'fa-graduation-cap',
          goal: 'توانمندسازی مهارتی، آموزشی و اقتصادی خانواده‌ها، نوجوانان و غرفه‌داران محله',
          features: [
            'دوره‌های آموزشی رایگان مهارت‌های فنی، صنایع دستی و مشاغل خانگی',
            'آموزش فروش آنلاین، عکاسی محصول و مدیریت غرفه برای کسب‌وکارهای محلی',
            'محتواهای آموزشی تقویتی، قرآنی، فرهنگی و سواد رسانه‌ای ویژه نوجوانان و جوانان',
            'کارگاه‌های تجربه‌نگاری استادکاران و کارآفرینان برتر محله شمال شرق'
          ],
          futureVision: 'اپلیکیشن «عهدآموز» دانشگاه مردمی و رایگان مهارت‌آموزی برای تمام سنین در اکوسیستم هم‌عهدی خواهد بود.'
        },
        'podcast': {
          title: 'عهدشنو (پادکست)',
          subtitle: 'رادیو اینترنتی، پادکست و روایت‌های شنیدنی هم‌عهدی',
          badgeColor: 'text-rose-300 border-rose-400/40 bg-rose-500/20',
          icon: 'fa-podcast',
          goal: 'تولید و پخش پادکست‌های شنیدنی، گفتگوهای صمیمی، داستان‌های صوتی و رادیو محله',
          features: [
            'پادکست‌های روایت تاریخ شفاهی، حماسه‌ها و خاطرات شنیدنی اهالی و پیشکسوتان',
            'کتاب‌های صوتی، ترتیل و تلاوت‌های مجلسی قرآن کریم و مداحی‌های اهل‌بیت (ع)',
            'میزگردهای صوتی بررسی مسائل محله و گفتگو با کارآفرینان و نخبگان مردمی',
            'پخش کم‌حجم و بهینه با قابلیت شنیدن در پس‌زمینه تلفن همراه'
          ],
          futureVision: 'اپلیکیشن «عهدشنو» صدای گرم همبستگی و دانایی اهالی در تمام ساعات شبانه‌روز خواهد بود.'
        }
      };

      const info = modulesInfo[moduleKey] || modulesInfo['news'];
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-10 h-10 rounded-2xl ${info.badgeColor} border flex items-center justify-center text-lg shadow">
                <i class="fa-solid ${info.icon}"></i>
              </div>
              <div>
                <h3 class="font-black text-white text-base">${escapeHtml(info.title)}</h3>
                <span class="text-[11px] text-amber-300 font-bold">${escapeHtml(info.subtitle)}</span>
              </div>
            </div>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold hover:text-white">✕</button>
          </div>

          <div class="glass-card p-4 rounded-2xl border border-amber-400/35 bg-amber-500/10 space-y-2 leading-relaxed">
            <div class="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>هدف و چشم‌انداز توسعه این بخش:</span>
            </div>
            <p class="text-slate-200">${escapeHtml(info.goal)}</p>
          </div>

          <div>
            <h4 class="font-bold text-cyan-300 text-xs mb-2">امکانات اختصاصی این واحد در نسخه نهایی:</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${info.features.map(f => `
                <div class="glass-card p-2.5 rounded-xl text-slate-200 flex items-start gap-1.5 text-[11px] leading-relaxed">
                  <span class="text-amber-400 font-bold mt-0.5">•</span>
                  <span>${escapeHtml(f)}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 text-slate-300 text-[11px] leading-relaxed">
            🚀 <strong>چشم‌انداز اکوسیستم:</strong> ${escapeHtml(info.futureVision)}<br/>
            هم‌اکنون اپلیکیشن <strong>«عهد بازار»</strong> با تمامی امکانات خرید، فروش و گفتگو به صورت ۱۰۰٪ عملیاتی فعال است.
          </div>

          <div class="flex justify-between items-center pt-2 border-t border-white/10">
            <span class="text-[10px] text-slate-400">سامانه همبستگی مردمی هم‌عهدی (نسخه 3.0.6)</span>
            <div class="flex gap-2">
              <button type="button" onclick="closeModal(); handleActiveMarketCardClick();" class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black">ورود به عهد بازار (فعال)</button>
              <button type="button" onclick="closeModal()" class="px-3.5 py-2 rounded-xl bg-white/10 text-slate-300 font-bold">متوجه شدم</button>
            </div>
          </div>
        </div>
      `);
    }


    // =========================================================================
    // SPA HISTORY & HARDWARE/BROWSER BACK BUTTON ROUTER v2.5.1
    // (تضمین ۱۰۰٪ عدم خروج ناخواسته در هر تعداد فشردن دکمه بازگشت + خروج فقط با ۲ بار بازگشت متوالی در صفحه اصلی)
    // =========================================================================
    let isHandlingPopState = false;
    let spaHistoryInitialized = false;
    let spaNavStack = [];
    let lastLandingBackPressTs = 0;
    let spaSeqCounter = 1;

    function getCurrentRouteSnapshot() {
      return {
        hamahdiSpa: true,
        seq: spaSeqCounter++,
        page: state.currentPage || 'landing',
        listingId: state.selectedListingId || null,
        booth: state.selectedBoothUsername || null,
        chatKey: state.activeChatKey || null,
        mobileChatView: state.mobileChatView || 'list'
      };
    }

    function isSameRouteSnapshot(a, b) {
      if (!a || !b) return false;
      return (
        a.page === b.page &&
        a.listingId === b.listingId &&
        a.booth === b.booth &&
        a.mobileChatView === b.mobileChatView
      );
    }

    // Replenish browser history buffer during user gestures so Chrome/Android never exhausts back stack
    function replenishBrowserHistoryGuardBuffer() {
      if (isHandlingPopState) return;
      try {
        const snap = getCurrentRouteSnapshot();
        const url = window.location.pathname + window.location.search + '#/' + snap.page;
        window.history.pushState(snap, '', url);
      } catch (e) {}
    }

    function pushAppHistoryState() {
      if (isHandlingPopState) return;
      try {
        const snap = getCurrentRouteSnapshot();
        const top = spaNavStack.length > 0 ? spaNavStack[spaNavStack.length - 1] : null;
        if (!top || !isSameRouteSnapshot(top, snap)) {
          spaNavStack.push(snap);
          if (spaNavStack.length > 40) spaNavStack.shift();
        }
        // Reset double-back exit timer whenever navigating away from landing
        if (snap.page !== 'landing') {
          lastLandingBackPressTs = 0;
        }
        const url = window.location.pathname + window.location.search + '#/' + snap.page;
        window.history.pushState(snap, '', url);
      } catch (e) {}
    }

    function initSpaBackNavigationGuard() {
      if (spaHistoryInitialized) return;
      spaHistoryInitialized = true;

      try {
        const landingBase = { hamahdiSpa: true, seq: 0, page: 'landing', guard: true };
        const initialSnap = getCurrentRouteSnapshot();
        spaNavStack = [landingBase, initialSnap];
        const baseUrl = window.location.pathname + window.location.search + '#/landing';
        const curUrl = window.location.pathname + window.location.search + '#/' + initialSnap.page;
        window.history.replaceState(landingBase, '', baseUrl);
        // Push multiple initial cushion states so even immediate multiple back presses without clicks are caught
        window.history.pushState({ hamahdiSpa: true, seq: 1, page: 'landing', guard: true }, '', baseUrl);
        window.history.pushState({ hamahdiSpa: true, seq: 2, page: 'landing', guard: true }, '', baseUrl);
        window.history.pushState(initialSnap, '', curUrl);
      } catch (e) {}

      // Every click/tap on interactive elements ensures a fresh user-gesture history entry is buffered
      document.addEventListener('click', function() {
        if (!isHandlingPopState) {
          const curState = window.history.state;
          if (!curState || curState.guard) {
            replenishBrowserHistoryGuardBuffer();
          }
        }
      }, { passive: true });

      window.addEventListener('popstate', function(e) {
        if (window.__hamahdiAllowExitNow) {
          return;
        }
        isHandlingPopState = true;
        try {
          // ۱. اگر مودالی باز است، ابتدا مودال بسته شود
          const modalBd = document.getElementById('modal-backdrop');
          if (modalBd && !modalBd.classList.contains('hidden')) {
            closeModal();
            lastLandingBackPressTs = 0;
            const snap = getCurrentRouteSnapshot();
            window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/' + snap.page);
            isHandlingPopState = false;
            return;
          }

          // ۲. اگر منوی کشویی موبایل باز است، ابتدا منو بسته شود
          const drawerBd = document.getElementById('mobile-drawer-backdrop');
          if (drawerBd && !drawerBd.classList.contains('hidden')) {
            closeMobileDrawer();
            lastLandingBackPressTs = 0;
            const snap = getCurrentRouteSnapshot();
            window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/' + snap.page);
            isHandlingPopState = false;
            return;
          }

          // ۳. اگر مگامنوی دسته‌بندی‌های بازار باز است، ابتدا مگامنو بسته شود
          if (state.categoriesMegaMenuOpen) {
            state.categoriesMegaMenuOpen = false;
            lastLandingBackPressTs = 0;
            renderCurrentPage(true);
            const snap = getCurrentRouteSnapshot();
            window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/' + snap.page);
            isHandlingPopState = false;
            return;
          }

          // ۴. اگر در نسخه موبایل داخل صفحه مکالمه چت هستیم، به لیست گفتگوها برگردد
          if (state.currentPage === 'messages' && state.mobileChatView === 'chat' && window.innerWidth < 768) {
            state.mobileChatView = 'list';
            lastLandingBackPressTs = 0;
            saveState();
            renderCurrentPage(true);
            const snap = getCurrentRouteSnapshot();
            window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/messages');
            isHandlingPopState = false;
            return;
          }

          // ۵. اگر در صفحه‌ای غیر از صفحه اصلی (landing) هستیم، پله‌به‌پله تا رسیدن به صفحه اصلی به عقب برگردد
          const curPage = state.currentPage || 'landing';
          if (curPage !== 'landing') {
            lastLandingBackPressTs = 0;
            if (curPage === 'messages') {
              state.currentPage = state.selectedListingId ? 'listing_detail' : 'market';
            } else if (curPage === 'listing_detail' || curPage === 'booth') {
              state.currentPage = 'market';
            } else if (curPage === 'market' && (state.marketCategoryFilter !== 'all' || state.marketSubcategoryFilter !== 'all' || state.marketSearchQuery)) {
              state.marketCategoryFilter = 'all';
              state.marketSubcategoryFilter = 'all';
              state.marketSearchQuery = '';
            } else {
              state.currentPage = 'landing';
            }

            saveState();
            renderCurrentPage(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const snap = getCurrentRouteSnapshot();
            window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/' + snap.page);
            isHandlingPopState = false;
            return;
          }

          // ۶. اکنون در صفحه اصلی (landing) هستیم:
          // اگر کاربر برای بار اول دکمه برگشت را زد، پیام هشدار نمایش داده شود و خارج نشود؛
          // اگر در کمتر از ۲.۵ ثانیه برای بار دوم دکمه برگشت را زد، اجازه خروج داده شود.
          const nowTs = Date.now();
          if (lastLandingBackPressTs && (nowTs - lastLandingBackPressTs < 2600)) {
            window.__hamahdiAllowExitNow = true;
            isHandlingPopState = false;
            window.history.go(-4);
            return;
          }

          lastLandingBackPressTs = nowTs;
          const snap = getCurrentRouteSnapshot();
          window.history.pushState(snap, '', window.location.pathname + window.location.search + '#/landing');
          showToast('برای خروج از اپلیکیشن، دکمه بازگشت را یک بار دیگر بزنید.', 'info');
        } catch (err) {}
        isHandlingPopState = false;
      });
    }

    function returnToLandingPage() {
      state.currentPage = 'landing';
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    
    window.__hmRouteHtmlCache = window.__hmRouteHtmlCache || {};
    function prefetchRouteView(routeName) {
      try {
        if (routeName === 'market' && typeof renderSeparateMarketPage === 'function' && !window.__hmRouteHtmlCache.market) {
          setTimeout(() => {
            try { window.__hmRouteHtmlCache.market = renderSeparateMarketPage(); } catch (e) {}
          }, 0);
        } else if (routeName === 'social_bot' && typeof renderSocialBotStudioPage === 'function' && !window.__hmRouteHtmlCache.social_bot) {
          setTimeout(() => {
            try { window.__hmRouteHtmlCache.social_bot = renderSocialBotStudioPage(); } catch (e) {}
          }, 0);
        }
      } catch (e) {}
    }

    function renderCurrentPage(fromPopState = false) {
      if (typeof syncV5BottomNav === 'function') syncV5BottomNav(state.currentPage);
      const container = document.getElementById('main-view-container');
      if (!container) return;
      updateFooterAndAdminBar();
      if (heroSliderInterval && state.currentPage !== 'landing') {
        clearInterval(heroSliderInterval);
        heroSliderInterval = null;
      }
      if (typeof syncMobileBottomNavActiveState === 'function') syncMobileBottomNavActiveState();
      if (state.currentPage === 'ahdino' || state.currentPage === 'ahdaneh') {
        state.currentPage = 'landing';
      }
      if (state.currentPage === 'market') {
        container.innerHTML = renderSeparateMarketPage();
      } else if (state.currentPage === 'hamahd_spiritual') {
        container.innerHTML = renderHamahdSpiritualDedicatedPage();
      } else if (state.currentPage === 'ahdbot_ai') {
        container.innerHTML = (typeof renderHamahdiAiChatPage === 'function') ? renderHamahdiAiChatPage() : '';
      } else if (state.currentPage === 'social_bot') {
        container.innerHTML = renderSocialBotStudioPage();
      } else if (state.currentPage === 'listing_detail') {
        container.innerHTML = renderSimpleListingDetailPage(state.selectedListingId);
      } else if (state.currentPage === 'booth') {
        container.innerHTML = renderBoothPage(state.selectedBoothUsername);
      } else if (state.currentPage === 'messages') {
        container.innerHTML = renderMessagesCenterPage();
      } else if (state.currentPage === 'admin_dashboard') {
        container.innerHTML = renderExpandedAdminDashboardPage();
      } else {
        if (fromPopState && window.__hmRouteHtmlCache && window.__hmRouteHtmlCache.landing) {
          container.innerHTML = window.__hmRouteHtmlCache.landing;
        } else {
          const htmlLanding = renderMainLandingPage();
          container.innerHTML = htmlLanding;
          if (window.__hmRouteHtmlCache) window.__hmRouteHtmlCache.landing = htmlLanding;
        }
        startHeroSliderTimer();
      }
      if (typeof convertFaIconsToSvg === 'function') convertFaIconsToSvg(document);
      if (!fromPopState) {
        pushAppHistoryState();
      }
    }

    function renderUnderConstructionStampOverlay() {
      return `
        <div class="absolute inset-0 z-20 bg-slate-950/75 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 text-center select-none">
          <div class="w-20 h-20 rounded-full bg-slate-900/70 border border-white/10 flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" class="w-11 h-11 text-slate-300/40" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
        </div>
      `;
    }

    function highlightSolidarityTheme(idx) {
      state.solidarityThemeIndex = idx;
      const t = SOLIDARITY_THEMES[idx] || SOLIDARITY_THEMES[0];
      const b = document.getElementById('active-node-badge');
      const d = document.getElementById('active-node-desc');
      if (b) b.textContent = t.badge;
      if (d) d.textContent = t.desc;
    }

    // =========================================================================
    // MAIN LANDING PAGE (ULTRA-CLEAN, LIGHTWEIGHT & MOBILE-FRIENDLY)
    // =========================================================================
    function renderMainLandingPage() {
      const approvedSlides = getApprovedHeroSlides();
      const approvedListings = getApprovedListings();
      const hasSlides = approvedSlides.length > 0;
      if (state.activeSlideIndex >= approvedSlides.length) state.activeSlideIndex = 0;
      const currentSlide = hasSlides ? approvedSlides[state.activeSlideIndex] : null;
      const ahdinoCount = typeof getAhdinoPosts === 'function' ? getAhdinoPosts().length : 0;
      const ahdanehCount = typeof getAhdanehPosts === 'function' ? getAhdanehPosts().length : 0;

      return `
        <div class="space-y-5">

          <!-- 1. HERO SLIDER -->
          <section class="glass-panel hm-hero-slider-frame rounded-3xl overflow-hidden relative border border-amber-400/50 shadow-xl">
            ${!hasSlides ? `
              <div class="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-emerald-950/60 to-slate-950 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 class="text-base sm:text-xl font-black text-white">بنر اسلایدی هم‌عهدی</h1>
                  <p class="text-xs text-slate-400 mt-0.5">هنوز تصویری در اسلایدر ثبت نشده است</p>
                </div>
                <button type="button" onclick="openUploadHeroSlideModal()" class="px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs shadow-lg flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                  <span>افزودن عکس</span>
                </button>
              </div>
            ` : `
              <div class="hm-hero-stage relative h-[250px] sm:h-[350px] md:h-[400px] w-full bg-slate-950 overflow-hidden select-none flex items-center justify-center">
                <img id="hero-slider-bg-blur" src="${currentSlide.image_data}" alt="" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-45 pointer-events-none transition-all duration-700" aria-hidden="true" />
                <div class="hm-hero-blur-tint absolute inset-0 pointer-events-none"></div>

                <img id="hero-slider-img" src="${currentSlide.image_data}" alt="" fetchpriority="high" decoding="async" class="relative z-20 max-h-full max-w-full object-contain transition-all duration-500" />
                <div class="hm-hero-vignette absolute inset-0 pointer-events-none z-20"></div>

                <div class="absolute top-2.5 left-2.5 z-30 flex items-center gap-1.5">
                  <button type="button" onclick="openUploadHeroSlideModal()" class="px-2.5 py-1.5 rounded-xl bg-slate-950/75 hover:bg-amber-400 hover:text-slate-950 text-amber-300 border border-amber-400/40 backdrop-blur-md text-[11px] font-black transition flex items-center gap-1 shadow">
                    <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                    <span>افزودن عکس</span>
                  </button>
                  ${isAdmin() ? `
                    <button type="button" onclick="deleteCurrentHeroSlide()" class="w-8 h-8 rounded-xl bg-rose-600/90 hover:bg-rose-500 text-white border border-rose-400/50 backdrop-blur-md text-xs flex items-center justify-center transition shadow" title="حذف بنر">
                      <svg viewBox="0 0 24 24" class="svg-icon w-3.5 h-3.5" aria-hidden="true"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  ` : ''}
                </div>

                ${approvedSlides.length > 1 ? `
                  <button type="button" onclick="stepHeroSlide(-1)" class="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950/65 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition shadow">
                    <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                  <button type="button" onclick="stepHeroSlide(1)" class="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-950/65 hover:bg-amber-400 hover:text-slate-950 text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition shadow">
                    <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                ` : ''}

                <div class="absolute bottom-2.5 inset-x-3 z-30 flex items-center justify-between gap-2">
                  <div class="px-2.5 py-1 rounded-xl bg-slate-950/80 border border-amber-400/35 backdrop-blur-md flex items-center gap-1.5 shadow max-w-[65%]">
                    <svg viewBox="0 0 24 24" class="svg-icon text-amber-400 w-3.5 h-3.5 shrink-0" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                    <span id="hero-slider-photographer" class="text-[11px] font-bold text-white truncate">عکاس: ${escapeHtml(currentSlide.photographer_name)}</span>
                  </div>
                  <div id="hero-slider-dots" class="flex items-center gap-1.5">
                    ${approvedSlides.map((_, idx) => `
                      <button type="button" onclick="goToHeroSlide(${idx})" class="h-2 rounded-full transition-all ${idx === state.activeSlideIndex ? 'w-6 bg-amber-400' : 'w-2 bg-white/40 hover:bg-white/70'}"></button>
                    `).join('')}
                  </div>
                </div>
              </div>
            `}
          </section>

                    <!-- 2. چیدمان متقارن ۴ کارت اصلی هم‌عهدی نسخه ۵ (عهدبات | عهدبازار | عهدهوش | هم‌عهد) -->
          <section class="hm-v5-4cards-grid" aria-label="چهار بخش اصلی هم‌عهدی">

            <!-- کارت ۱: عهدبات -->
            <div onclick="handleEntryToAhdbotClick()" onmouseenter="prefetchRouteView('social_bot')" ontouchstart="prefetchRouteView('social_bot')" class="hm-v5-card hm-v5-card-bot group">
              <div class="flex items-center justify-between gap-1.5">
                <span class="px-2 py-0.5 rounded-full bg-cyan-500/25 border border-cyan-400/50 text-cyan-200 text-[9px] sm:text-[10px] font-black">۴ پیام‌رسان</span>
                <div class="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/45 flex items-center justify-center text-lg shadow">🤖</div>
              </div>
              <div class="space-y-0.5 text-right">
                <h2 class="text-sm sm:text-base font-black text-white">عهدبات</h2>
                <p class="text-[10px] sm:text-[11px] text-slate-300 leading-snug">ارسال هوشمند به بله، ایتا، روبیکا و تلگرام</p>
              </div>
              <div class="w-full py-1.5 px-2.5 rounded-xl bg-cyan-500/25 border border-cyan-400/45 text-cyan-100 font-black text-[10px] sm:text-xs flex items-center justify-between">
                <span>ورود به عهدبات</span>
                <span>←</span>
              </div>
            </div>

            <!-- کارت ۲: عهدبازار -->
            <div onclick="handleActiveMarketCardClick()" onmouseenter="prefetchRouteView('market')" ontouchstart="prefetchRouteView('market')" class="hm-v5-card hm-v5-card-market group">
              <div class="flex items-center justify-between gap-1.5">
                <span class="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] sm:text-[10px] font-black shadow">فعال</span>
                <div class="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/55 flex items-center justify-center text-lg shadow">🏪</div>
              </div>
              <div class="space-y-0.5 text-right">
                <h2 class="text-sm sm:text-base font-black text-amber-200">عهدبازار</h2>
                <p class="text-[10px] sm:text-[11px] text-slate-300 leading-snug">آگهی، غرفه من، سبد خرید و پیام‌ها</p>
              </div>
              <div class="w-full py-1.5 px-2.5 rounded-xl bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 font-black text-[10px] sm:text-xs flex items-center justify-between shadow">
                <span>ورود (${approvedListings.length.toLocaleString('fa-IR')})</span>
                <span>←</span>
              </div>
            </div>

            <!-- کارت ۳: عهدهوش (چت هوش مصنوعی فقط متنی) -->
            <div onclick="openHamahdiAiChatPage()" class="hm-v5-card hm-v5-card-ai group">
              <div class="flex items-center justify-between gap-1.5">
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/50 text-emerald-200 text-[9px] sm:text-[10px] font-black">فقط متنی</span>
                <div class="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/45 flex items-center justify-center text-lg shadow">✨</div>
              </div>
              <div class="space-y-0.5 text-right">
                <h2 class="text-sm sm:text-base font-black text-emerald-200">عهدهوش</h2>
                <p class="text-[10px] sm:text-[11px] text-slate-300 leading-snug">چت هوش مصنوعی، کپشن و متن آگهی</p>
              </div>
              <div class="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500/25 border border-emerald-400/45 text-emerald-100 font-black text-[10px] sm:text-xs flex items-center justify-between">
                <span>شروع گفتگو</span>
                <span>←</span>
              </div>
            </div>

            <!-- کارت ۴: هم‌عهد (میثاق و آمار معنوی) -->
            <div onclick="openHamahdSpiritualPage()" class="hm-v5-card hm-v5-card-spiritual group">
              <div class="flex items-center justify-between gap-1.5">
                <span class="px-2 py-0.5 rounded-full bg-purple-500/25 border border-purple-400/50 text-purple-200 text-[9px] sm:text-[10px] font-black">میثاق معنوی</span>
                <div class="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/45 flex items-center justify-center text-lg shadow">📖</div>
              </div>
              <div class="space-y-0.5 text-right">
                <h2 class="text-sm sm:text-base font-black text-purple-200">هم‌عهد</h2>
                <p class="text-[10px] sm:text-[11px] text-slate-300 leading-snug">آمار صلوات، ذکر فرج و ختم قرآن</p>
              </div>
              <div class="w-full py-1.5 px-2.5 rounded-xl bg-purple-500/25 border border-purple-400/45 text-purple-100 font-black text-[10px] sm:text-xs flex items-center justify-between">
                <span>ورود به میثاق</span>
                <span>←</span>
              </div>
            </div>

          </section>

                    <!-- 3. فوتر معرفی سوپراپلیکیشن هم‌عهدی (نسخه ۵) -->
          <footer class="hm-v5-intro-footer space-y-3 text-right">
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <img src="./icon-192.png" alt="هم‌عهدی" class="w-10 h-10 rounded-xl border border-amber-400/50 shadow shrink-0" />
                <div>
                  <h3 class="text-sm font-black text-amber-300">سوپراپلیکیشن هم‌عهدی</h3>
                  <p class="text-[10px] text-slate-400 font-bold">پلتفرم یکپارچه اقتصاد مردمی، رسانه هوشمند و همبستگی معنوی</p>
                </div>
              </div>
              <span class="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/35 text-amber-300 text-[10px] font-black shrink-0">نسخه ۵.۰</span>
            </div>
            <p class="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
              هم‌عهدی چهار خدمت کلیدی <strong>عهدبات</strong> (انتشار هوشمند در ۴ پیام‌رسان)، <strong>عهدبازار</strong> (کسب‌وکار و غرفه‌های محلی)، <strong>عهدهوش</strong> (دستیار هوش مصنوعی متنی) و <strong>هم‌عهد</strong> (میثاق معنوی) را در یک اپلیکیشن سبک، سریع و بومی کنار هم آورده است.
            </p>
            <div class="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-bold">
              <span class="px-2.5 py-1 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">🤖 ۴ پیام‌رسان یکپارچه</span>
              <span class="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-300">🏪 بازار و غرفه مستقیم</span>
              <span class="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-300">✨ هوش مصنوعی متنی</span>
              <span class="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-400/30 text-purple-300">📖 میثاق معنوی</span>
            </div>
          </footer>

        </div>
      `;
    }

    // =========================================================================
    // DEDICATED MESSAGES & ORDERS CENTER PAGE (تب چهارم نوار پایین موبایل: پیام‌ها و سفارش‌ها)
    // =========================================================================
    function getDefaultAppChatContext() {
      if (state.currentPage === 'ahdino') return 'ahdino';
      if (state.currentPage === 'ahdaneh') return 'ahdaneh';
      if (state.currentPage === 'market' || state.currentPage === 'listing_detail') return 'market';
      if (state.currentPage === 'booth') {
        if (state.profileActiveAppTab === 'ahdino') return 'ahdino';
        if (state.profileActiveAppTab === 'market') return 'market';
        return 'ahdaneh';
      }
      return state.messagesAppContext || 'market';
    }

    function ensureSocialDirectSeedsInitialized() {
      if (!Array.isArray(state.directMessages) || state.directMessages.length === 0) {
        state.directMessages = [
          { id: 9501, listing_id: 0, sender_username: 'javad_mohammadi', receiver_username: 'mahmoud_rezvani', sender: 'جواد محمدی', text: 'پاسخ به استوری عهدانه: حاج محمود دست مریزاد، گزارش تصویری توزیع ارزاق عالی بود.', offered_price: 0, message_type: 'pv', status: 'approved' },
          { id: 9502, listing_id: 0, sender_username: 'mahmoud_rezvani', receiver_username: 'javad_mohammadi', sender: 'حاج محمود رضوانی', text: 'زنده باشید آقا جواد، ان‌شاءالله برای موج بعدی ریلز مستندش رو با هم در عهدانه می‌گذاریم.', offered_price: 0, message_type: 'pv', status: 'approved' },
          { id: 9503, listing_id: 0, sender_username: 'fatemeh_kazemi', receiver_username: 'zahra_ahmadi', sender: 'فاطمه کاظمی', text: 'سلام خانم احمدی عزیز، ریلز کارگاه خیاطی‌تون رو در عهدانه دیدم، فوق‌العاده بود!', offered_price: 0, message_type: 'pv', status: 'approved' }
        ];
      }
      if (!Array.isArray(state.ahdinoMessages) || state.ahdinoMessages.length === 0) {
        state.ahdinoMessages = [
          { id: 9601, listing_id: -1, sender_username: 'saeed_karimi', receiver_username: 'mahmoud_rezvani', sender: 'مشهدی سعید کریمی', text: 'سلام حاج محمود، فایل صوتی روایت شب ۲۵۲ در عهدینو خیلی دلنشین بود.', offered_price: 0, message_type: 'pv', status: 'approved' },
          { id: 9602, listing_id: -1, sender_username: 'mahmoud_rezvani', receiver_username: 'saeed_karimi', sender: 'حاج محمود رضوانی', text: 'سلام آقا سعید عزیز، نظر لطف شماست، نظرسنجی فردا رو هم در عهدینو ثبت کردم.', offered_price: 0, message_type: 'pv', status: 'approved' },
          { id: 9603, listing_id: -1, sender_username: 'maryam_sadeghi', receiver_username: 'fatemeh_kazemi', sender: 'مریم صادقی', text: 'سلام خانم کاظمی، متن اطلاعیه جلسه قرآن بانوان رو در عهدینو بازنشر کردم.', offered_price: 0, message_type: 'pv', status: 'approved' }
        ];
      }
    }

    function openMessagesCenterPage(tabMode = '', appContext = '') {
      if (!requireRegisteredAccount('مشاهده پیام‌ها و گفتگوها')) return;
      if (appContext && ['market', 'ahdino', 'ahdaneh'].includes(appContext)) {
        state.messagesAppContext = appContext;
      } else if (state.currentPage !== 'messages') {
        state.messagesAppContext = getDefaultAppChatContext();
      }
      if (!state.messagesAppContext) state.messagesAppContext = 'market';
      if (tabMode) state.messagesActiveTab = tabMode;
      else state.messagesActiveTab = 'chats';
      state.currentPage = 'messages';
      state.mobileChatView = state.mobileChatView || 'list';
      ensureSocialDirectSeedsInitialized();
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function openNewDirectChatModal(appContext = 'ahdaneh') {
      const myUname = (state.currentUser && state.currentUser.username) ? String(state.currentUser.username).toLowerCase() : '';
      const neighbors = Object.values(state.users || {}).filter(u => u && String(u.username || '').toLowerCase() !== myUname);
      const appTitle = appContext === 'ahdino' ? 'عهدینو' : 'عهدانه';
      const lidPrefix = appContext === 'ahdino' ? '-1' : '0';
      openModal(`
        <div class="p-5 space-y-4 text-xs max-w-md mx-auto">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-white text-sm">💬 آغاز گفتگوی جدید در ${appTitle}</h3>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-white font-bold">✕</button>
          </div>
          <p class="text-slate-300 text-[11px]">مخاطب مورد نظر خود را برای آغاز گفتگو در چت‌باکس اختصاصی ${appTitle} انتخاب کنید:</p>
          <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
            ${neighbors.map(u => `
              <div onclick="closeModal(); state.messagesAppContext='${appContext}'; selectChatConversation('${lidPrefix}_${escapeHtml(u.username)}');"
                class="p-3 rounded-2xl glass-card hover:border-amber-400/50 cursor-pointer flex items-center justify-between gap-3 transition">
                <div class="flex items-center gap-3">
                  <img src="${u.booth_logo || './icon-512.png'}" alt="" class="w-10 h-10 rounded-full object-cover border border-amber-400/40" onerror="this.src='./icon-512.png'" />
                  <div>
                    <div class="font-black text-white text-xs">${escapeHtml(u.display_name || u.username)}</div>
                    <div class="text-[10px] text-amber-300 font-mono dir-ltr">@${escapeHtml(u.username)}</div>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-xl bg-white/10 text-cyan-300 font-bold text-[11px]">پیام ←</span>
              </div>
            `).join('')}
          </div>
        </div>
      `);
    }

    function selectChatConversation(chatKey) {
      state.activeChatKey = chatKey;
      state.mobileChatView = 'chat';
      renderCurrentPage();
      setTimeout(() => {
        const sc = document.getElementById('chat-room-scroll');
        if (sc) sc.scrollTop = sc.scrollHeight;
        const inp = document.getElementById('chat-room-input');
        if (inp) inp.focus();
      }, 50);
    }

    function backToChatList() {
      state.mobileChatView = 'list';
      renderCurrentPage();
    }

    function toggleChatRoomOfferRow() {
      const el = document.getElementById('chat-room-offer-row');
      if (el) el.classList.toggle('hidden');
    }

    function parseChatKey(chatKey) {
      const str = String(chatKey || '');
      const idx = str.indexOf('_');
      if (idx === -1) return { listingId: Number(str) || 0, partnerUname: '' };
      return {
        listingId: Number(str.slice(0, idx)),
        partnerUname: str.slice(idx + 1)
      };
    }

    function buildChatConversationsData() {
      ensureSocialDirectSeedsInitialized();
      const appCtx = state.messagesAppContext || 'market';
      const myUname = (state.currentUser && state.currentUser.username) ? state.currentUser.username : 'guest';
      const myUnameLower = String(myUname).toLowerCase();
      const deletedIdSet = new Set((state.deletedMessageIds || []).map(x => Number(x)));
      const convMap = {};

      if (appCtx === 'market') {
        // ۱. فقط گفتگوهای مربوط به آگهی‌های عهد بازار (listing_id > 0)
        (state.listings || []).forEach(l => {
          const sellerLower = String(l.seller_username || '').toLowerCase();
          const msgs = (l.messages || []).filter(m => {
            if (!m) return false;
            if ((m.message_type || 'pv') !== 'pv') return false;
            if (m.id && deletedIdSet.has(Number(m.id))) return false;
            const sLower = String(m.sender_username || '').toLowerCase();
            const rLower = String(m.receiver_username || '').toLowerCase();
            return isAdmin() || sLower === myUnameLower || rLower === myUnameLower || sellerLower === myUnameLower;
          });

          msgs.forEach(m => {
            let partnerUname = '';
            let partnerName = '';
            if (String(m.sender_username || '').toLowerCase() === myUnameLower) {
              partnerUname = m.receiver_username || l.seller_username;
              partnerName = (state.users && state.users[partnerUname] && state.users[partnerUname].display_name) || l.seller_name || l.booth_title || partnerUname;
            } else {
              partnerUname = m.sender_username || l.seller_username;
              partnerName = m.sender || (state.users && state.users[partnerUname] && state.users[partnerUname].display_name) || l.seller_name || partnerUname;
            }
            if (!partnerUname || String(partnerUname).toLowerCase() === myUnameLower) {
              partnerUname = (l.seller_username && String(l.seller_username).toLowerCase() !== myUnameLower) ? l.seller_username : 'resident';
              partnerName = l.seller_name || l.booth_title || 'همسایه';
            }
            const key = l.id + '_' + partnerUname;
            if (!convMap[key]) {
              convMap[key] = {
                key: key,
                listing: l,
                partnerUname: partnerUname,
                partnerName: partnerName,
                messages: []
              };
            }
            convMap[key].messages.push(m);
          });
        });
      } else if (appCtx === 'ahdino') {
        // ۲. فقط گفتگوهای مستقیم عهدینو (listing_id === -1)
        const ahdinoList = Array.isArray(state.ahdinoMessages) ? state.ahdinoMessages : [];
        ahdinoList.forEach(m => {
          if (!m || (m.id && deletedIdSet.has(Number(m.id)))) return;
          const sLower = String(m.sender_username || '').toLowerCase();
          const rLower = String(m.receiver_username || '').toLowerCase();
          if (!isAdmin() && sLower !== myUnameLower && rLower !== myUnameLower) return;
          const partnerUname = (sLower === myUnameLower) ? (m.receiver_username || 'resident') : (m.sender_username || 'resident');
          if (!partnerUname || String(partnerUname).toLowerCase() === myUnameLower) return;
          const pUser = (state.users && state.users[partnerUname]) ? state.users[partnerUname] : null;
          const partnerName = (pUser && pUser.display_name) || m.sender || partnerUname;
          const key = '-1_' + partnerUname;
          if (!convMap[key]) {
            convMap[key] = {
              key: key,
              listing: {
                id: -1,
                title: 'گفتگوی دایرکت عهدینو با ' + partnerName,
                seller_username: partnerUname,
                seller_name: partnerName,
                booth_title: '@' + partnerUname,
                price: 0,
                price_unit: '',
                image_data: (pUser && pUser.booth_logo) || './icon-512.png'
              },
              partnerUname: partnerUname,
              partnerName: partnerName,
              messages: []
            };
          }
          convMap[key].messages.push(m);
        });
      } else {
        // ۳. فقط گفتگوهای مستقیم و ریپلای استوری عهدانه (listing_id === 0)
        const directList = Array.isArray(state.directMessages) ? state.directMessages : [];
        directList.forEach(m => {
          if (!m || (m.id && deletedIdSet.has(Number(m.id)))) return;
          const sLower = String(m.sender_username || '').toLowerCase();
          const rLower = String(m.receiver_username || '').toLowerCase();
          if (!isAdmin() && sLower !== myUnameLower && rLower !== myUnameLower) return;
          const partnerUname = (sLower === myUnameLower) ? (m.receiver_username || 'resident') : (m.sender_username || 'resident');
          if (!partnerUname || String(partnerUname).toLowerCase() === myUnameLower) return;
          const pUser = (state.users && state.users[partnerUname]) ? state.users[partnerUname] : null;
          const partnerName = (pUser && pUser.display_name) || m.sender || partnerUname;
          const key = '0_' + partnerUname;
          if (!convMap[key]) {
            convMap[key] = {
              key: key,
              listing: {
                id: 0,
                title: 'دایرکت و پاسخ استوری عهدانه با ' + partnerName,
                seller_username: partnerUname,
                seller_name: partnerName,
                booth_title: '@' + partnerUname,
                price: 0,
                price_unit: '',
                image_data: (pUser && pUser.booth_logo) || './icon-512.png'
              },
              partnerUname: partnerUname,
              partnerName: partnerName,
              messages: []
            };
          }
          convMap[key].messages.push(m);
        });
      }

      // Ensure activeChatKey is initialized if it matches current app context
      if (state.activeChatKey && !convMap[state.activeChatKey]) {
        const parsed = parseChatKey(state.activeChatKey);
        if (appCtx === 'ahdino' && parsed.listingId === -1 && parsed.partnerUname) {
          const pUname = parsed.partnerUname;
          const pUser = (state.users && state.users[pUname]) ? state.users[pUname] : null;
          const pName = (pUser && pUser.display_name) || pUname;
          convMap[state.activeChatKey] = {
            key: state.activeChatKey,
            listing: {
              id: -1,
              title: 'گفتگوی دایرکت عهدینو با ' + pName,
              seller_username: pUname,
              seller_name: pName,
              booth_title: '@' + pUname,
              price: 0,
              price_unit: '',
              image_data: (pUser && pUser.booth_logo) || './icon-512.png'
            },
            partnerUname: pUname,
            partnerName: pName,
            messages: []
          };
        } else if (appCtx === 'ahdaneh' && parsed.listingId === 0 && parsed.partnerUname) {
          const pUname = parsed.partnerUname;
          const pUser = (state.users && state.users[pUname]) ? state.users[pUname] : null;
          const pName = (pUser && pUser.display_name) || pUname;
          convMap[state.activeChatKey] = {
            key: state.activeChatKey,
            listing: {
              id: 0,
              title: 'دایرکت عهدانه با ' + pName,
              seller_username: pUname,
              seller_name: pName,
              booth_title: '@' + pUname,
              price: 0,
              price_unit: '',
              image_data: (pUser && pUser.booth_logo) || './icon-512.png'
            },
            partnerUname: pUname,
            partnerName: pName,
            messages: []
          };
        } else if (appCtx === 'market' && parsed.listingId > 0) {
          const targetListing = (state.listings || []).find(l => Number(l.id) === parsed.listingId);
          if (targetListing) {
            const pUname = parsed.partnerUname || targetListing.seller_username || 'resident';
            const pName = (state.users && state.users[pUname] && state.users[pUname].display_name) || targetListing.seller_name || targetListing.booth_title || pUname;
            convMap[state.activeChatKey] = {
              key: state.activeChatKey,
              listing: targetListing,
              partnerUname: pUname,
              partnerName: pName,
              messages: []
            };
          }
        }
      }

      const conversationList = Object.values(convMap);
      let activeConv = (state.activeChatKey && convMap[state.activeChatKey]) ? convMap[state.activeChatKey] : (conversationList[0] || null);
      if (activeConv) {
        state.activeChatKey = activeConv.key;
      }
      return { myUname, convMap, conversationList, activeConv };
    }

    function renderChatMessagesListHtml(messages, myUname, listingId = 0) {
      const list = Array.isArray(messages) ? messages : [];
      const myUnameLower = String(myUname || '').toLowerCase();
      return `
        <div class="text-center my-1 select-none">
          <span class="px-3 py-0.5 rounded-full bg-slate-800/80 text-[10px] text-slate-400 border border-white/5">امروز</span>
        </div>
        ${list.length === 0 ? `
          <div class="my-8 mx-auto max-w-sm text-center p-5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 space-y-1.5">
            <div class="text-2xl">💬</div>
            <div class="font-bold text-white text-xs">آغاز گفتگوی خصوصی</div>
            <p class="text-[11px] text-slate-400">پیام خود را در کادر پایین بنویسید تا بلافاصله ارسال شود.</p>
          </div>
        ` : list.map(m => {
          const isMe = String(m.sender_username || '').toLowerCase() === myUnameLower;
          const msgLid = Number(m.listing_id !== undefined ? m.listing_id : listingId);
          return `
            <div class="flex ${isMe ? 'justify-end' : 'justify-start'} group">
              <div class="hm-chat-bubble ${isMe ? 'hm-chat-bubble-me' : 'hm-chat-bubble-other'} max-w-[90%] sm:max-w-[74%] px-3.5 py-2.5 rounded-2xl shadow-md relative">
                ${String(m.text || '').startsWith('[ORDER_CARD]|') ? (() => {
                  const pts = String(m.text).split('|');
                  const oCode = pts[1] || 'DK-ORDER';
                  const oTitle = pts[2] || 'کالای سفارش‌داده‌شده';
                  const oQty = pts[3] || '1';
                  const oPrice = Number(pts[4] || m.offered_price || 0);
                  const oBuyer = pts[5] || m.sender || 'خریدار';
                  const oPhone = pts[6] || '-';
                  const oAddr = pts[7] || '-';
                  return `
                    <div class="rounded-2xl bg-gradient-to-br from-slate-950/95 via-emerald-950/50 to-slate-900/95 border-2 border-amber-400/60 p-3.5 space-y-2.5 text-xs shadow-xl">
                      <div class="flex items-center justify-between gap-2 border-b border-amber-400/25 pb-2">
                        <div class="flex items-center gap-1.5 font-black text-amber-300">
                          <span>🧾</span>
                          <span>سفارش جدید از سبد خرید</span>
                        </div>
                        <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 font-mono font-black text-[10px] dir-ltr">${escapeHtml(oCode)}</span>
                      </div>
                      <div class="space-y-1 text-slate-100">
                        <div class="font-black text-sm text-white">${escapeHtml(oTitle)}</div>
                        <div class="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-0.5">
                          <span class="text-cyan-300">تعداد: <strong>${Number(oQty).toLocaleString('fa-IR')}</strong></span>
                          <span class="text-emerald-300 font-black">مبلغ کل: ${formatPrice(oPrice)} تومان</span>
                        </div>
                        <div class="text-[10px] text-slate-300 pt-1 border-t border-white/10 space-y-0.5">
                          <div>👤 خریدار: <strong class="text-white">${escapeHtml(oBuyer)}</strong> • 📞 <span class="font-mono dir-ltr">${escapeHtml(oPhone)}</span></div>
                          <div>📍 نشانی تحویل: ${escapeHtml(oAddr)}</div>
                        </div>
                      </div>
                      <div class="flex flex-wrap items-center gap-1.5 pt-1">
                        <button type="button" onclick="const inp=document.getElementById('chat-room-input'); if(inp){ inp.value='سلام، در مورد سفارش ${escapeHtml(oCode)} سوال و پیشنهاد چانه‌زنی دارم: '; inp.focus(); }" class="flex-1 py-1.5 px-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/35 border border-amber-400/50 text-amber-300 font-black text-[10px]">
                          💬 چانه‌زنی و گفتگو
                        </button>
                      </div>
                    </div>
                  `;
                })() : `<p class="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm font-medium">${escapeHtml(m.text)}</p>`}
                ${Number(m.offered_price) > 0 && msgLid > 0 ? `
                  <div class="mt-1.5 p-2 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold text-[10px] space-y-1.5">
                    <div class="flex items-center justify-between gap-2">
                      <span>💰 پیشنهاد قیمت: ${formatPrice(m.offered_price)} تومان</span>
                      <span class="px-1.5 py-0.5 rounded text-[9px] font-black ${m.offer_status === 'accepted' ? 'bg-emerald-500 text-slate-950' : (m.offer_status === 'rejected' ? 'bg-rose-600 text-white' : 'bg-slate-900 text-amber-300')}">
                        ${m.offer_status === 'accepted' ? '✓ توافق شد' : (m.offer_status === 'rejected' ? '✕ رد شد' : 'در انتظار پاسخ')}
                      </span>
                    </div>
                    ${(!isMe || isAdmin()) && (!m.offer_status || m.offer_status === 'pending') ? `
                      <div class="flex items-center gap-1.5 pt-1 border-t border-amber-400/30">
                        <button type="button" onclick="respondToChatPriceOffer(${Number(m.id || 0)}, ${msgLid}, 'accepted')" class="flex-1 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-[10px]">✓ قبول و ثبت سفارش</button>
                        <button type="button" onclick="respondToChatPriceOffer(${Number(m.id || 0)}, ${msgLid}, 'rejected')" class="px-2.5 py-1 rounded-lg bg-rose-500/30 hover:bg-rose-600 text-white font-bold text-[10px]">✕ رد</button>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
                <div class="text-[9px] mt-1.5 text-left opacity-80 dir-ltr flex items-center justify-between gap-3">
                  <div class="flex items-center gap-1">
                    <span>✔✔</span>
                    <span>آنلاین</span>
                  </div>
                  <button type="button" onclick="deleteSingleChatMessage(${msgLid}, ${Number(m.id || 0)})" class="text-rose-300 hover:text-rose-200 font-bold px-1.5 py-0.5 rounded bg-black/20 hover:bg-rose-600/80 transition flex items-center gap-0.5" title="حذف این پیام">
                    <span>🗑️</span>
                    <span>حذف</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      `;
    }

    function renderChatSidebarItemsHtml(conversationList, activeConv) {
      const appCtx = state.messagesAppContext || 'market';
      const emptyHint = appCtx === 'market'
        ? 'با ورود به هر آگهی در عهد بازار و زدن «پیام»، گفتگو آغاز می‌شود.'
        : (appCtx === 'ahdino' ? 'از دکمه «+ گفتگوی جدید» در بالا، با همسایگان در عهدینو گفتگو کنید.' : 'از دکمه «+ دایرکت جدید» یا پاسخ به استوری‌ها گفتگو را آغاز کنید.');
      if (!conversationList || conversationList.length === 0) {
        return `
          <div class="p-8 text-center text-xs text-slate-400 space-y-2">
            <div class="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-300 flex items-center justify-center mx-auto text-xl">💬</div>
            <div class="font-bold text-slate-200">هنوز گفتگویی در این بخش ندارید</div>
            <p class="text-[11px] text-slate-400">${emptyHint}</p>
          </div>
        `;
      }
      return conversationList.map(c => {
        const isActive = Boolean(activeConv && activeConv.key === c.key);
        const lastMsg = c.messages[c.messages.length - 1] || {};
        const initialLetter = (c.partnerName || 'هـ')[0];
        const lid = c.listing ? Number(c.listing.id) : 0;
        return `
          <div onclick="selectChatConversation('${escapeHtml(c.key)}')" class="p-3 cursor-pointer transition flex items-center justify-between gap-2.5 ${isActive ? 'bg-cyan-500/20 border-r-4 border-r-cyan-400' : 'hover:bg-white/5'}">
            <div class="flex items-center gap-3 min-w-0 flex-1">
              <div class="w-11 h-11 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-slate-950 font-black text-sm flex items-center justify-center shrink-0 shadow">
                ${escapeHtml(initialLetter)}
              </div>
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-1">
                  <span class="font-black text-white text-xs truncate">${escapeHtml(c.partnerName)}</span>
                  <span class="text-[10px] text-emerald-400 shrink-0">آنلاین (${c.messages.length})</span>
                </div>
                <div class="text-[11px] text-slate-300 truncate mt-0.5">${escapeHtml(c.listing ? c.listing.title : '')}</div>
                ${lastMsg.text ? `<div class="text-[10px] text-slate-400 truncate mt-0.5">${escapeHtml(lastMsg.text)}</div>` : ''}
              </div>
            </div>
            <button type="button" onclick="event.stopPropagation(); deleteChatConversation(${lid}, '${escapeHtml(c.partnerUname)}')" class="w-8 h-8 rounded-full bg-rose-500/15 hover:bg-rose-600 text-rose-300 hover:text-white flex items-center justify-center text-xs shrink-0 transition" title="حذف کامل این گفتگو">
              🗑️
            </button>
          </div>
        `;
      }).join('');
    }

    function respondToChatPriceOffer(msgId, listingId, decision) {
      const lid = Number(listingId || 0);
      const mid = Number(msgId || 0);
      const item = (state.listings || []).find(l => Number(l.id) === lid);
      if (item && Array.isArray(item.messages)) {
        const m = item.messages.find(x => Number(x.id) === mid);
        if (m) m.offer_status = decision;
      }
      saveState();
      updateChatRoomMessagesOnly(false);
      callServerApi('respond_price_offer', { message_id: mid, listing_id: lid, decision: decision });
      showToast(decision === 'accepted' ? 'پیشنهاد قیمت پذیرفته شد و سفارش توافقی ثبت گردید ✓' : 'پیشنهاد قیمت رد شد.', decision === 'accepted' ? 'success' : 'warning');
    }

    function deleteSingleChatMessage(listingId, msgId) {
      if (!state.currentUser) return;
      const lid = Number(listingId);
      const mid = Number(msgId);
      if (!Array.isArray(state.deletedMessageIds)) state.deletedMessageIds = [];
      if (mid && !state.deletedMessageIds.includes(mid)) {
        state.deletedMessageIds.push(mid);
      }
      if (lid === 0 && Array.isArray(state.directMessages)) {
        state.directMessages = state.directMessages.filter(m => Number(m.id) !== mid);
      } else if (lid === -1 && Array.isArray(state.ahdinoMessages)) {
        state.ahdinoMessages = state.ahdinoMessages.filter(m => Number(m.id) !== mid);
      } else {
        const item = (state.listings || []).find(l => Number(l.id) === lid);
        if (item && Array.isArray(item.messages)) {
          item.messages = item.messages.filter(m => Number(m.id) !== mid);
        }
      }
      saveState();
      updateChatRoomMessagesOnly(false);
      callServerApi('delete_message', { id: mid, listing_id: lid });
      showToast('پیام با موفقیت حذف شد.', 'warning');
    }

    function deleteChatConversation(listingId, partnerUname) {
      if (!state.currentUser) return;
      const lid = Number(listingId);
      const partner = String(partnerUname || '').trim();
      const myUnameLower = String(state.currentUser.username || '').toLowerCase();
      const partnerLower = partner.toLowerCase();
      const chatKey = lid + '_' + partner;

      if (!Array.isArray(state.deletedMessageIds)) state.deletedMessageIds = [];
      if (!state.deletedChatKeys || typeof state.deletedChatKeys !== 'object') state.deletedChatKeys = {};
      state.deletedChatKeys[chatKey] = Date.now();

      if (lid === 0 && Array.isArray(state.directMessages)) {
        state.directMessages = state.directMessages.filter(m => {
          const s = String(m.sender_username || '').toLowerCase();
          const r = String(m.receiver_username || '').toLowerCase();
          return !((s === myUnameLower && r === partnerLower) || (s === partnerLower && r === myUnameLower));
        });
      } else if (lid === -1 && Array.isArray(state.ahdinoMessages)) {
        state.ahdinoMessages = state.ahdinoMessages.filter(m => {
          const s = String(m.sender_username || '').toLowerCase();
          const r = String(m.receiver_username || '').toLowerCase();
          return !((s === myUnameLower && r === partnerLower) || (s === partnerLower && r === myUnameLower));
        });
      } else {
        const item = (state.listings || []).find(l => Number(l.id) === lid);
        if (item && Array.isArray(item.messages)) {
          item.messages = item.messages.filter(m => {
            if (!m) return false;
            const sLower = String(m.sender_username || '').toLowerCase();
            const rLower = String(m.receiver_username || item.seller_username || '').toLowerCase();
            const matchesConv = (
              (sLower === myUnameLower && (rLower === partnerLower || !partnerLower || partnerLower === 'resident')) ||
              (sLower === partnerLower && (rLower === myUnameLower || String(item.seller_username || '').toLowerCase() === myUnameLower)) ||
              (isAdmin() && (sLower === partnerLower || rLower === partnerLower))
            );
            if (matchesConv && m.id) {
              state.deletedMessageIds.push(Number(m.id));
            }
            return !matchesConv;
          });
        }
      }

      if (state.activeChatKey === chatKey) {
        state.activeChatKey = null;
        state.mobileChatView = 'list';
      }
      saveState();
      renderCurrentPage(true);
      callServerApi('delete_chat', { listing_id: lid, partner_username: partner });
      showToast('گفتگو به طور کامل حذف شد.', 'warning');
    }

    let isSendingChatMsg = false;
    function submitChatRoomMessage(e, listingId, partnerUname) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (isSendingChatMsg) return;

      const inp = document.getElementById('chat-room-input');
      const offerInp = document.getElementById('chat-room-offer-input');
      let text = inp ? inp.value.trim() : '';
      const offeredPrice = offerInp ? Number(offerInp.value || 0) : 0;

      if (!text && offeredPrice > 0) {
        text = 'سلام، پیشنهاد قیمت من ' + formatPrice(offeredPrice) + ' تومان است.';
      }
      if (!text) {
        showToast('لطفاً متن پیام خود را بنویسید.', 'warning');
        if (inp) inp.focus();
        return;
      }

      isSendingChatMsg = true;
      setTimeout(() => { isSendingChatMsg = false; }, 220);

      const lidNum = Number(listingId);
      const item = lidNum > 0 ? (state.listings || []).find(l => Number(l.id) === lidNum) : null;
      if (lidNum > 0 && !item) return;

      const actualPartner = partnerUname || (item ? item.seller_username : 'resident') || 'resident';
      state.activeChatKey = lidNum + '_' + actualPartner;
      state.mobileChatView = 'chat';

      const filtered = (typeof filterForbiddenWords === 'function')
        ? filterForbiddenWords(text)
        : { text: text, hadForbidden: false };

      const nowMs = Date.now();
      const msgObj = {
        id: nowMs,
        _optimisticTs: nowMs,
        listing_id: lidNum,
        sender_username: state.currentUser.username,
        receiver_username: actualPartner,
        sender: state.currentUser.display_name || state.currentUser.booth_title || state.currentUser.username,
        text: filtered.text,
        offered_price: lidNum > 0 ? offeredPrice : 0,
        message_type: 'pv',
        status: 'approved'
      };

      if (lidNum === 0) {
        if (!Array.isArray(state.directMessages)) state.directMessages = [];
        state.directMessages.push(msgObj);
      } else if (lidNum === -1) {
        if (!Array.isArray(state.ahdinoMessages)) state.ahdinoMessages = [];
        state.ahdinoMessages.push(msgObj);
      } else if (item) {
        item.messages = Array.isArray(item.messages) ? item.messages : [];
        if (!item.messages.some(m => m.id === nowMs)) {
          item.messages.push(msgObj);
        }
      }
      saveState();

      if (inp) { inp.value = ''; inp.focus(); }
      if (offerInp) offerInp.value = '';
      const offerRow = document.getElementById('chat-room-offer-row');
      if (offerRow) offerRow.classList.add('hidden');

      const chatScroll = document.getElementById('chat-room-scroll');
      if (chatScroll) {
        updateChatRoomMessagesOnly(true);
      } else {
        renderCurrentPage(true);
      }

      callServerApi('add_message', msgObj);
      showToast('پیام شما ارسال شد.');
    }

    function fillChatRoomChip(text) {
      const inp = document.getElementById('chat-room-input');
      if (inp) {
        inp.value = text;
        inp.focus();
      }
    }

    function updateChatRoomMessagesOnly(forceScroll = false) {
      if (!state.currentUser || state.currentPage !== 'messages') return;

      const { myUname, conversationList, activeConv } = buildChatConversationsData();

      const sideListEl = document.getElementById('chat-conv-list-container');
      if (sideListEl) {
        const newSideHtml = renderChatSidebarItemsHtml(conversationList, activeConv);
        const sideSig = conversationList.map(c => c.key + ':' + c.messages.length + ':' + (c.messages[c.messages.length - 1] ? c.messages[c.messages.length - 1].text : '')).join('|') + '::' + (activeConv ? activeConv.key : '');
        if (sideListEl.getAttribute('data-side-sig') !== sideSig) {
          sideListEl.innerHTML = newSideHtml;
          sideListEl.setAttribute('data-side-sig', sideSig);
        }
      }
      const sideCntEl = document.getElementById('chat-conv-count-lbl');
      if (sideCntEl) {
        sideCntEl.textContent = 'گفتگوها (' + conversationList.length + ')';
      }

      const scrollEl = document.getElementById('chat-room-scroll');
      if (!scrollEl || !activeConv) return;

      const wasNearBottom = (scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight) < 120;
      const newHtml = renderChatMessagesListHtml(activeConv.messages, myUname, activeConv.listing ? activeConv.listing.id : 0);
      const lastMsgId = activeConv.messages.length > 0 ? activeConv.messages[activeConv.messages.length - 1].id : 0;
      const msgSig = activeConv.key + ':' + activeConv.messages.length + ':' + lastMsgId;

      if (scrollEl.getAttribute('data-msg-sig') !== msgSig || forceScroll) {
        scrollEl.innerHTML = newHtml;
        scrollEl.setAttribute('data-msg-sig', msgSig);
        if (forceScroll || wasNearBottom) {
          scrollEl.scrollTop = scrollEl.scrollHeight;
        }
      }
    }



    function scrollToSpiritualCovenantSection() {
      const el = document.getElementById('hm-spiritual-section-anchor');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }


    function openHamahdSpiritualPage() {
      state.currentPage = 'hamahd_spiritual';
      if (typeof saveState === 'function') saveState();
      if (typeof renderCurrentPage === 'function') renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderHamahdSpiritualDedicatedPage() {
      const inner = (typeof renderSpiritualCovenantFooterSection === 'function')
        ? renderSpiritualCovenantFooterSection()
        : '<div class="glass-panel rounded-3xl p-6 text-center text-sm">بخش میثاق معنوی در حال بارگذاری است...</div>';
      return `
        <div class="space-y-4 pb-8">
          <div class="glass-panel rounded-3xl p-4 border border-purple-400/40 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2.5">
              <button type="button" onclick="returnToLandingPage()" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-amber-300">→ بازگشت به خانه</button>
              <div>
                <h1 class="text-sm sm:text-base font-black text-white">📖 هم‌عهد — میثاق معنوی</h1>
                <div class="text-[10px] text-purple-300 font-bold">صلوات، ذکر فرج و ختم ۶۰۴ صفحه‌ای قرآن کریم</div>
              </div>
            </div>
          </div>
          ${inner}
        </div>
      `;
    }
