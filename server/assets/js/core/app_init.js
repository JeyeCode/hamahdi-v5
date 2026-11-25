/**
 * HAMAHDI v4.0.0 | ماژول هسته ۴: راه‌انداز اصلی اپلیکیشن، ثبت Service Worker و رویدادهای PWA
 */
/**
 * HAMAHDI (هم‌عهدی) - راه‌انداز اصلی، مدیریت PWA و رویدادهای موبایل (نسخه 6.0)
 */

    // Hide Mobile Bottom Nav automatically when soft keyboard opens on mobile inputs
    function setupMobileViewportAndKeyboardHandlers() {
      document.addEventListener('focusin', (e) => {
        const tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
          if (window.innerWidth < 768 && e.target.type !== 'checkbox' && e.target.type !== 'radio' && e.target.type !== 'file') {
            document.body.classList.add('keyboard-open');
          }
        }
      });
      document.addEventListener('focusout', () => {
        setTimeout(() => {
          const active = document.activeElement;
          const tag = (active && active.tagName) ? active.tagName.toUpperCase() : '';
          if (tag !== 'INPUT' && tag !== 'TEXTAREA') {
            document.body.classList.remove('keyboard-open');
          }
        }, 120);
      });
    }

    // =========================================================================
    // REQUIREMENT 1 & 4: PWA INSTALL PROMPT & SERVICE WORKER CACHING
    // =========================================================================
    let deferredPwaPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPwaPrompt = e;
    });

    function triggerPwaInstall() {
      if (deferredPwaPrompt) {
        deferredPwaPrompt.prompt();
        deferredPwaPrompt.userChoice.then(() => { deferredPwaPrompt = null; });
        return;
      }
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-emerald-300 text-base"><svg viewBox="0 0 24 24" class="svg-icon ml-1.5" aria-hidden="true"><rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>نصب وب‌اپلیکیشن (PWA) هم‌عهدی روی گوشی</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 font-bold">✕</button>
          </div>
          <p class="text-slate-200 leading-relaxed">
            سامانه هم‌عهدی مجهز به فناوری <strong>وب‌اپلیکیشن پیش‌رونده (PWA)</strong> و سیستم کشینگ سریع است تا بدون نیاز به دانلود از استورها، روی صفحه اصلی گوشی شما نصب شود:
          </p>
          <div class="space-y-2.5 glass-card p-4 rounded-2xl">
            <div class="font-bold text-amber-300">📱 در گوشی‌های اندروید (کروم):</div>
            <p class="text-slate-300">روی علامت سه‌نقطه <code>⋮</code> بالای مرورگر بزنید و گزینه <strong>«Add to Home screen»</strong> یا <strong>«Install app»</strong> را انتخاب کنید.</p>
            <div class="font-bold text-cyan-300 pt-2">🍏 در گوشی‌های آیفون (سافاری):</div>
            <p class="text-slate-300">روی دکمه اشتراک‌گذاری <code>Share</code> پایین مرورگر بزنید و گزینه <strong>«Add to Home Screen»</strong> را انتخاب نمایید.</p>
          </div>
          <button type="button" onclick="closeModal()" class="w-full py-2.5 rounded-xl bg-emerald-400 text-slate-950 font-black">متوجه شدم</button>
        </div>
      `);
    }

    function initHamahdiApp() {
      if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        navigator.serviceWorker.register(['.', 'sw.js'].join('/')).catch(() => {});
      }
      setupMobileViewportAndKeyboardHandlers();
      if (typeof initSpaBackNavigationGuard === 'function') initSpaBackNavigationGuard();
      applyLeaderPhotos();
      if (typeof syncMobileBottomNavActiveState === 'function') syncMobileBottomNavActiveState();
      try {
        renderCurrentPage(true);
      } catch (err) {
        console.error('Error rendering current page:', err);
      }
      if (typeof convertFaIconsToSvg === 'function') convertFaIconsToSvg(document);
      syncPhpDatabase('load');
      if (typeof startLivePolling === 'function') startLivePolling();
      handleInitialDeepLinkParams();
      if (typeof window.__dismissSplashEarly === 'function') {
        setTimeout(window.__dismissSplashEarly, 220);
      }
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initHamahdiApp);
    } else {
      initHamahdiApp();
    }


    function handleInitialDeepLinkParams() {
      try {
        const params = new URLSearchParams(window.location.search || '');
        const boothParam = params.get('booth') || params.get('u');
        const prof = params.get('profile');
        const appParam = params.get('app');
        const listingParam = params.get('listing');
        const postParam = params.get('post');
        if (boothParam && typeof openBoothPage === 'function') {
          openBoothPage(boothParam);
          return;
        }
        if (prof && typeof openBoothPage === 'function') {
          openBoothPage(prof);
          return;
        }
        if (appParam === 'market') {
          navigateToMarketPage();
          if (listingParam && typeof openListingDetailModal === 'function') {
            setTimeout(() => openListingDetailModal(Number(listingParam)), 250);
          }
        } else if (appParam === 'ahdino' && typeof navigateToAhdinoPage === 'function') {
          navigateToAhdinoPage();
        } else if (appParam === 'ahdaneh' && typeof navigateToAhdanehPage === 'function') {
          navigateToAhdanehPage();
          if (postParam && typeof openAhdanehPostLightbox === 'function') {
            setTimeout(() => openAhdanehPostLightbox(Number(postParam)), 250);
          }
        } else if (appParam === 'ahdbot' && typeof navigateToSocialBotStudioPage === 'function') {
          navigateToSocialBotStudioPage();
        }
      } catch (e) {}
    }


    setInterval(function() {
      const el = document.getElementById('hm-flash-deal-timer');
      if (!el) return;
      const now = new Date();
      const remSec = ((23 - now.getHours()) * 3600) + ((59 - now.getMinutes()) * 60) + (59 - now.getSeconds());
      const hh = String(Math.floor(remSec / 3600)).padStart(2, '0');
      const mm = String(Math.floor((remSec % 3600) / 60)).padStart(2, '0');
      const ss = String(remSec % 60).padStart(2, '0');
      el.textContent = `${hh}:${mm}:${ss}`;
    }, 1000);


    // =========================================================================
    // GLOBAL ZERO-CRASH ERROR BOUNDARY & ESCAPE KEY HANDLER (v3.1.4)
    // =========================================================================
    window.addEventListener('error', function(evt) {
      console.warn('[Hamahdi Guard] Caught runtime error:', evt && evt.message);
    });

    window.addEventListener('unhandledrejection', function(evt) {
      if (evt && evt.preventDefault) evt.preventDefault();
      console.warn('[Hamahdi Guard] Caught unhandled promise rejection:', evt && evt.reason);
    });

    window.addEventListener('keydown', function(evt) {
      if (evt.key === 'Escape') {
        const subDrawer = document.getElementById('hm-reel-drawer-overlay');
        if (subDrawer && typeof closeReelSubDrawer === 'function') {
          closeReelSubDrawer();
          return;
        }
        const reelsOverlay = document.getElementById('hm-fullscreen-reels-overlay');
        if (reelsOverlay && typeof closeFullscreenReelsFeedModal === 'function') {
          closeFullscreenReelsFeedModal();
          return;
        }
        const modalBackdrop = document.getElementById('modal-backdrop');
        if (modalBackdrop && !modalBackdrop.classList.contains('hidden') && typeof closeModal === 'function') {
          closeModal();
          return;
        }
        if (typeof closeMobileDrawer === 'function') {
          closeMobileDrawer();
        }
      }
    });
