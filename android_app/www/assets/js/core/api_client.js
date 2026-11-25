/**
 * HAMAHDI v4.0.0 | ماژول هسته ۲: ارتباط با سرور (REST API)، کش ETag/SWR و اجرای تکه‌تکه JS
 */
    async function callServerApi(actionName, payloadObj = null) {
      // HAMAHDI v5.0: فعال در محیط Capacitor/Android APK و مرورگر
      try {
        const apiPath = (typeof window.hamahdiApiUrl === 'function') ? window.hamahdiApiUrl('api/index.php') : 'api/index.php';
        const adminTok = (state.currentUser && state.currentUser.admin_token) ? state.currentUser.admin_token : '';
        const userTok = (state.currentUser && state.currentUser.token) ? state.currentUser.token : '';
        const sessionUname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest') ? state.currentUser.username : '';
        const csrfTok = state.csrfToken || '';
        const bodyData = payloadObj ? Object.assign({}, payloadObj, { admin_token: adminTok, user_token: userTok, session_username: sessionUname, csrf_token: csrfTok }) : null;
        const url = apiPath + '?action=' + encodeURIComponent(actionName)
          + (adminTok ? '&admin_token=' + encodeURIComponent(adminTok) : '')
          + (userTok ? '&user_token=' + encodeURIComponent(userTok) : '')
          + (sessionUname ? '&session_username=' + encodeURIComponent(sessionUname) : '')
          + '&_t=' + Date.now();
        const reqHeaders = {
          'X-Admin-Token': adminTok,
          'X-User-Token': userTok,
          'X-Session-User': sessionUname,
          'X-CSRF-Token': csrfTok,
          'X-Client-Platform': (window.HAMAHDI_CONFIG && window.HAMAHDI_CONFIG.CLIENT_PLATFORM) || 'android-apk',
          ...(userTok ? { 'Authorization': 'Bearer ' + userTok } : {})
        };
        if (bodyData) reqHeaders['Content-Type'] = 'application/json';
        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        const timeoutId = controller ? setTimeout(() => { try { controller.abort(); } catch (e) {} }, 12000) : null;
        const opts = {
          method: bodyData ? 'POST' : 'GET',
          headers: reqHeaders,
          credentials: 'omit',
          cache: 'no-store',
          signal: controller ? controller.signal : undefined
        };
        if (bodyData) opts.body = JSON.stringify(bodyData);
        let r;
        try {
          r = await fetch(url, opts);
        } finally {
          if (timeoutId) clearTimeout(timeoutId);
        }
        const d = await r.json();
        if (d && d.csrf_token) {
          state.csrfToken = d.csrf_token;
        }
        if (!r.ok && d && d.error) {
          showToast(d.error, 'error');
          return { error: d.error };
        }
        if (d && Array.isArray(d.listings)) {
          const prevMessagesMap = {
            0: Array.isArray(state.directMessages) ? state.directMessages.slice() : [],
            '-1': Array.isArray(state.ahdinoMessages) ? state.ahdinoMessages.slice() : []
          };
          (state.listings || []).forEach(l => {
            if (l && Array.isArray(l.messages) && l.messages.length > 0) {
              prevMessagesMap[Number(l.id)] = l.messages.slice();
            }
          });
          state.listings = d.listings;
          state.heroSlides = Array.isArray(d.heroSlides) ? d.heroSlides : [];
          state.stories = Array.isArray(d.stories) ? d.stories : [];
          state.orders = Array.isArray(d.orders) ? d.orders : [];
          const __fixMedia = (u) => (typeof window.hamahdiMediaUrl === 'function') ? window.hamahdiMediaUrl(u) : u;
          state.listings.forEach(l => { if (l && l.image_data) l.image_data = __fixMedia(l.image_data); });
          state.heroSlides.forEach(s => { if (s && s.image_data) s.image_data = __fixMedia(s.image_data); });
          state.stories.forEach(s => { if (s && s.image_data) s.image_data = __fixMedia(s.image_data); });

          if (d.users) {
            state.users = Object.assign(state.users, d.users);
            if (state.currentUser && state.currentUser.username && state.users[state.currentUser.username]) {
              state.currentUser = Object.assign({}, state.currentUser, state.users[state.currentUser.username]);
            }
          }
          if (d.leaderPhotos) state.leaderPhotos = d.leaderPhotos;
          if (d.spiritualStats && typeof d.spiritualStats === 'object') {
            state.spiritualStats = d.spiritualStats;
          }
          if (Array.isArray(d.communityPosts)) {
            state.communityPosts = d.communityPosts;
          }
          if (Array.isArray(d.followsData)) {
            state.followsData = d.followsData;
          }
          if (Array.isArray(d.registeredBotChannels)) {
            state.registeredBotChannels = d.registeredBotChannels;
          }
          if (Array.isArray(d.socialStories) && d.socialStories.length > 0) {
            const seenSet = new Set((state.socialStories || []).filter(s => s && s.seen).map(s => Number(s.id)));
            state.socialStories = d.socialStories.map(s => Object.assign({}, s, { seen: seenSet.has(Number(s.id)) }));
          }
          if (Array.isArray(d.directMessages)) {
            state.directMessages = d.directMessages;
          }
          if (Array.isArray(d.ahdinoMessages)) {
            state.ahdinoMessages = d.ahdinoMessages;
          }
          ensureSeedDataMerged(prevMessagesMap, d.messagesByListingId || {});
          saveState();
          applyLeaderPhotos();
          // Always sync live chat DOM (both sidebar conversation list & active message thread) without interrupting input!
          if (state.currentPage === 'messages' && typeof updateChatRoomMessagesOnly === 'function') {
            updateChatRoomMessagesOnly();
          }
          if (['add_message', 'delete_message', 'delete_chat', 'respond_price_offer', 'create_order', 'checkout_cart_orders', 'add_community_post', 'comment_community_post', 'like_community_post', 'repost_community_post', 'vote_community_poll'].includes(actionName)) {
            notifyCrossTabChatSync();
          }
        }
        return d;
      } catch (e) {
        return null;
      }
    }

    async function syncPhpDatabase(mode = 'load') {
      if (mode === 'load') {
        await callServerApi('load_state');
      }
    }

    function saveState() {
      try {
        if (state.currentUser) {
          sessionStorage.setItem('hamahdi_tab_user_v24', JSON.stringify(state.currentUser));
        } else {
          sessionStorage.removeItem('hamahdi_tab_user_v24');
        }
      } catch (e) {}
      try {
        localStorage.setItem('hamahdi_v331_clean', JSON.stringify(state));
      } catch (e) {
        try {
          const lightPosts = (state.communityPosts || []).slice(0, 40).map(p => {
            if (p && p.media_url && p.media_url.length > 120000) {
              return Object.assign({}, p, { media_url: './icon-512.png', media_gallery: ['./icon-512.png'] });
            }
            return p;
          });
          const lightState = Object.assign({}, state, {
            heroSlides: (state.heroSlides || []).slice(0, 6),
            stories: (state.stories || []).slice(0, 10),
            socialStories: (state.socialStories || []).slice(0, 20),
            communityPosts: lightPosts
          });
          localStorage.setItem('hamahdi_v331_clean', JSON.stringify(lightState));
        } catch (err) {}
      }
      if (typeof updateFooterAndAdminBar === 'function') updateFooterAndAdminBar();
      if (typeof syncMobileBottomNavActiveState === 'function') syncMobileBottomNavActiveState();
    }


    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    function formatPrice(num) {
      return Number(num || 0).toLocaleString('fa-IR');
    }

    function showToast(msg, type = 'success') {
      const container = document.getElementById('toast-container');
      if (!container) return;
      const el = document.createElement('div');
      const borderCol = type === 'error' ? 'border-rose-400' : type === 'warning' ? 'border-amber-400' : 'border-emerald-400';
      el.className = `glass-panel px-4 py-3 rounded-2xl border-r-4 ${borderCol} text-xs font-bold text-white shadow-2xl flex items-center justify-between gap-3 pointer-events-auto`;
      el.innerHTML = `<span>${escapeHtml(msg)}</span><button type="button" onclick="this.parentElement.remove()" class="text-slate-400 hover:text-white font-bold">✕</button>`;
      container.appendChild(el);
      setTimeout(() => { if (el.parentElement) el.remove(); }, 4500);
    }

    function openModal(htmlContent) {
      const backdrop = document.getElementById('modal-backdrop');
      const box = document.getElementById('modal-content');
      const str = String(htmlContent);
      box.classList.remove('modal-wide-pv', 'modal-fullscreen-story');
      backdrop.classList.remove('story-fullscreen-backdrop');
      if (str.includes('pv-chat-box-shell')) {
        box.classList.add('modal-wide-pv');
      } else if (str.includes('insta-story-fullscreen-stage')) {
        box.classList.add('modal-fullscreen-story');
        backdrop.classList.add('story-fullscreen-backdrop');
      }
      box.innerHTML = htmlContent;
      if (typeof convertFaIconsToSvg === 'function') convertFaIconsToSvg(box);
      backdrop.classList.remove('hidden');
      backdrop.classList.add('flex');
      document.body.classList.add('modal-open');
    }

    function closeModal() {
      if (storyAutoAdvanceTimer) { clearTimeout(storyAutoAdvanceTimer); storyAutoAdvanceTimer = null; }
      const backdrop = document.getElementById('modal-backdrop');
      const box = document.getElementById('modal-content');
      if (backdrop) {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('flex', 'story-fullscreen-backdrop');
      }
      if (box) {
        box.classList.remove('modal-wide-pv', 'modal-fullscreen-story');
      }
      document.body.classList.remove('modal-open');
    }

    function readImageFileAsDataUrl(fileInput, maxDim, callback) {
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) {
        callback(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          let outUrl = canvas.toDataURL('image/webp', 0.80);
          if (!outUrl || !outUrl.startsWith('data:image/webp')) {
            outUrl = canvas.toDataURL('image/jpeg', 0.82);
          }
          const kbSize = Math.max(1, Math.round((outUrl.length * 0.75) / 1024));
          const badgeEl = document.getElementById('webp-compress-badge');
          if (badgeEl) {
            badgeEl.textContent = 'بهینه‌سازی خودکار WebP انجام شد (' + kbSize + ' کیلوبایت)';
            badgeEl.classList.remove('hidden');
          }
          callback(outUrl);
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    }



    // =========================================================================
    // CRISP INLINE SVG ICON ENGINE (100% Offline-Safe, Never Shows Missing Box ▯)
    // Automatically replaces <i class="fa-..."> with crisp vector SVGs
    // =========================================================================
    const SVG_ICON_PATHS = {
      'fa-house': '<path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5z"/>',
      'fa-store': '<path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/>',
      'fa-plus': '<path d="M12 5v14M5 12h14"/>',
      'fa-plus-circle': '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
      'fa-comments': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>',
      'fa-comments-dollar': '<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><path d="M12 7v10M9.5 9.5c0-1.1 1.1-2 2.5-2s2.5.9 2.5 2-1.1 1.5-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2 2.5-.9 2.5-2"/>',
      'fa-user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M17 11l2 2 4-4"/>',
      'fa-user-shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="2.5"/><path d="M8.5 16a3.5 3.5 0 0 1 7 0"/>',
      'fa-user-plus': '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><path d="M20 8v6M17 11h6"/>',
      'fa-user-tie': '<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M10 14l-1.5 4 1.5 2 1.5-2-1.5-4z"/>',
      'fa-right-to-bracket': '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3"/>',
      'fa-location-dot': '<path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
      'fa-camera': '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
      'fa-headset': '<path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>',
      'fa-magnifying-glass': '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>',
      'fa-sliders': '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
      'fa-bars-staggered': '<path d="M4 6h16M4 12h12M8 18h12"/>',
      'fa-arrow-left': '<path d="M19 12H5M12 19l-7-7 7-7"/>',
      'fa-arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
      'fa-chevron-left': '<path d="M15 18l-6-6 6-6"/>',
      'fa-chevron-right': '<path d="M9 18l6-6-6-6"/>',
      'fa-check': '<path d="M20 6L9 17l-5-5"/>',
      'fa-trash-can': '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"/>',
      'fa-fire-flame-curved': '<path d="M12 2c1.5 3.5 4 5.5 4 9a6 6 0 1 1-12 0c0-2.5 1.5-5 3-6.5 0 2 1.5 3 2.5 3-.5-2.5 1-4.5 2.5-5.5z"/>',
      'fa-circle-play': '<circle cx="12" cy="12" r="9"/><polygon points="10 8 16 12 10 16 10 8"/>',
      'fa-qrcode': '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 19h2v2h-2zM19 14h2v2h-2z"/>',
      'fa-download': '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
      'fa-mobile-screen-button': '<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>',
      'fa-tower-broadcast': '<circle cx="12" cy="10" r="2"/><path d="M8.5 6.5a5 5 0 0 1 7 0M6 4a8.5 8.5 0 0 1 12 0M12 12v9M9 21h6"/>',
      'fa-masks-theater': '<path d="M4 4h10v6a5 5 0 0 1-10 0V4zM7 8h.01M11 8h.01M7.5 11a2 2 0 0 0 3 0"/><path d="M14 9h6v6a5 5 0 0 1-8 4"/>',
      'fa-map-location-dot': '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><path d="M8 2v16M16 6v16"/>',
      'fa-screwdriver-wrench': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
      'fa-hands-holding-circle': '<circle cx="12" cy="10" r="5"/><path d="M3 15c2 3 5 5 9 5s7-2 9-5"/>',
      'fa-scale-balanced': '<path d="M12 3v18M5 7h14M5 7l-3 6h6l-3-6zM19 7l-3 6h6l-3-6zM8 21h8"/>',
      'fa-shield-heart': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 14.5l-2.5-2.5a1.8 1.8 0 0 1 2.5-2.5 1.8 1.8 0 0 1 2.5 2.5L12 14.5z"/>',
      'fa-bowl-food': '<path d="M4 12h16a8 8 0 0 1-16 0zM2 12h20M8 20h8"/>',
      'fa-shirt': '<path d="M15 3l6 3-2 4-3-1v12H8V9L5 10 3 6l6-3a3 3 0 0 0 6 0z"/>',
      'fa-couch': '<path d="M4 11V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3M2 11h20v6H2zM4 17v3M20 17v3"/>',
      'fa-graduation-cap': '<polygon points="12 3 1 9 12 15 23 9 12 3"/><path d="M5 11.5v5.5c0 2 3.1 3.5 7 3.5s7-1.5 7-3.5v-5.5"/>',
      'fa-handshake-angle': '<path d="M11 17l-5-5 4-4 5 5M16 14l4-4-5-5-4 4"/>',
      'fa-tag': '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><circle cx="7" cy="7" r="1.5"/>',
      'fa-truck-fast': '<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      'fa-circle-exclamation': '<circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/>',
      'fa-box-open': '<path d="M12 7L3 11v8l9 4 9-4v-8l-9-4zM3 11l9 4 9-4M12 15v8"/>',
      'fa-rocket': '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>',
      'fa-pen-to-square': '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
      'fa-gauge-high': '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
      'fa-database': '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
      'fa-key': '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L19 4m-2 2l3 3m-5 0l2 2"/>',
      'fa-clock': '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
      'fa-phone-volume': '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/>',
      'fa-building': '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
      'fa-car': '<path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/>',
      'fa-briefcase': '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
      'fa-gears': '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.77 1.02 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
      'fa-book-open': '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
      'fa-book-quran': '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><circle cx="12" cy="10" r="2.5"/>',
      'fa-lock': '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>'
    };

    function convertFaIconsToSvg(rootEl = document) {
      const nodes = rootEl.querySelectorAll('i[class*="fa-"]');
      nodes.forEach(el => {
        if (el.dataset.svgConverted) return;
        const clsList = Array.from(el.classList);
        let matchedPath = null;
        for (const c of clsList) {
          if (SVG_ICON_PATHS[c]) {
            matchedPath = SVG_ICON_PATHS[c];
            break;
          }
        }
        if (matchedPath) {
          el.dataset.svgConverted = '1';
          const keepClasses = clsList.filter(c => !c.startsWith('fa')).join(' ');
          el.outerHTML = `<svg viewBox="0 0 24 24" class="svg-icon ${keepClasses}" aria-hidden="true">${matchedPath}</svg>`;
        }
      });
    }


    let liveChatPollingTimer = null;
    let isPollingInFlight = false;
    let hamahdiBroadcastChannel = null;

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        hamahdiBroadcastChannel = new BroadcastChannel('hamahdi_live_chat_sync_v24');
        hamahdiBroadcastChannel.onmessage = function() {
          checkLiveIncomingMessages(true);
        };
      }
    } catch (e) {}

    window.addEventListener('storage', function(evt) {
      if (evt && evt.key === 'hamahdi_live_chat_ping_v24') {
        checkLiveIncomingMessages(true);
      }
    });

    function notifyCrossTabChatSync() {
      try {
        if (hamahdiBroadcastChannel) {
          hamahdiBroadcastChannel.postMessage({ ts: Date.now() });
        }
        localStorage.setItem('hamahdi_live_chat_ping_v24', String(Date.now()));
      } catch (e) {}
    }

    async function checkLiveIncomingMessages(forceImmediate = false) {
      if (!forceImmediate && document.hidden) return;
      if (!state.currentUser || state.currentUser.role === 'guest') return;
      if (isPollingInFlight) return;
      isPollingInFlight = true;

      try {
        await callServerApi('load_state');
        if (typeof syncMobileBottomNavActiveState === 'function') {
          syncMobileBottomNavActiveState();
        }
        if (state.currentPage === 'messages' && typeof updateChatRoomMessagesOnly === 'function') {
          updateChatRoomMessagesOnly();
        }
      } catch (e) {
      } finally {
        isPollingInFlight = false;
      }
    }

    function startLivePolling() {
      if (liveChatPollingTimer) clearInterval(liveChatPollingTimer);
      liveChatPollingTimer = setInterval(() => checkLiveIncomingMessages(false), 10000);
      window.addEventListener('focus', () => checkLiveIncomingMessages(true));
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) checkLiveIncomingMessages(true);
      });
    }


    function getBotChannelDirectUrl(platform, channelId, customLink = '') {
      const cLink = String(customLink || '').trim();
      if (/^https?:\/\//i.test(cLink)) return cLink;
      const raw = String(channelId || '').trim();
      if (/^https?:\/\//i.test(raw)) return raw;
      const cleanId = raw.replace(/^@+/, '').replace(/^https?:\/\/[^\/]+\//i, '').replace(/\/+$/, '');
      const pf = String(platform || 'bale').toLowerCase();
      const map = {
        bale: 'https://ble.ir/',
        eitaa: 'https://eitaa.com/',
        rubika: 'https://rubika.ir/',
        telegram: 'https://t.me/'
      };
      return (map[pf] || 'https://ble.ir/') + (cleanId || '');
    }

    function openSocialBotStudioPage() {
      if (typeof handleEntryToAhdbotClick === 'function') {
        handleEntryToAhdbotClick();
      } else if (typeof navigateToSocialBotStudioPage === 'function') {
        navigateToSocialBotStudioPage();
      }
    }
