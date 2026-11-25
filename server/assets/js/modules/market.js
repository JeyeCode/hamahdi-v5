/**
 * HAMAHDI v4.0.0 | ماژول عهد بازار، مگامنو دسته‌بندی، صفحه‌بندی Cursor، سبد خرید و ثبت آگهی معنوی
 */
    // =========================================================================
    // DIGIKALA SHOPPING CART & DIVAR BOOKMARKS ENGINE (v3.1.0)
    // =========================================================================
    function getMarketBookmarksMap() {
      try {
        const raw = localStorage.getItem('hamahdi_market_bookmarks_v310');
        const obj = raw ? JSON.parse(raw) : {};
        return (obj && typeof obj === 'object') ? obj : {};
      } catch (e) {
        return {};
      }
    }

    function isListingBookmarked(listingId) {
      const map = getMarketBookmarksMap();
      return Boolean(map[Number(listingId)]);
    }

    function toggleBookmarkMarketListing(listingId, ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      const id = Number(listingId);
      const map = getMarketBookmarksMap();
      const nowSaved = !map[id];
      if (nowSaved) map[id] = true;
      else delete map[id];
      try {
        localStorage.setItem('hamahdi_market_bookmarks_v310', JSON.stringify(map));
      } catch (e) {}
      renderCurrentPage(true);
      showToast(nowSaved ? 'آگهی در لیست «نشان‌شده‌های من 🔖» ذخیره شد.' : 'آگهی از نشان‌شده‌ها خارج شد.');
    }

    function getShoppingCartItems() {
      if (!Array.isArray(state.shoppingCart)) {
        try {
          const raw = localStorage.getItem('hamahdi_cart_v310');
          state.shoppingCart = raw ? (JSON.parse(raw) || []) : [];
        } catch (e) {
          state.shoppingCart = [];
        }
      }
      return state.shoppingCart;
    }

    function saveShoppingCart() {
      try {
        localStorage.setItem('hamahdi_cart_v310', JSON.stringify(getShoppingCartItems()));
      } catch (e) {}
    }

    function getShoppingCartTotalCount() {
      return getShoppingCartItems().reduce((sum, it) => sum + Math.max(1, Number(it.qty || 1)), 0);
    }

    function animateCardFlyToCart(triggerEv, item) {
      try {
        const srcBtn = triggerEv && (triggerEv.currentTarget || triggerEv.target);
        const cardEl = srcBtn && srcBtn.closest ? (srcBtn.closest('.glass-card') || srcBtn.closest('[onclick*="openListingDetailModal"]') || srcBtn) : null;
        let targetEl = document.getElementById('mob-nav-cart');
        if (!targetEl || targetEl.offsetParent === null) {
          targetEl = document.getElementById('desktop-dock-cart-btn') || document.getElementById('subapp-mobile-bottom-nav');
        }
        if (!cardEl || !targetEl) return;

        const srcRect = cardEl.getBoundingClientRect();
        const dstRect = targetEl.getBoundingClientRect();
        if (!srcRect.width || !dstRect.width) return;

        const flyer = document.createElement('div');
        flyer.style.cssText = `
          position: fixed;
          left: ${srcRect.left}px;
          top: ${srcRect.top}px;
          width: ${Math.min(srcRect.width, 220)}px;
          height: ${Math.min(srcRect.height, 140)}px;
          z-index: 9999;
          pointer-events: none;
          border-radius: 20px;
          overflow: hidden;
          border: 2px solid #fbbf24;
          background: rgba(15, 23, 42, 0.92);
          box-shadow: 0 20px 50px rgba(251, 191, 36, 0.45);
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          transition: transform 0.88s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.88s ease;
          transform-origin: center center;
        `;
        flyer.innerHTML = `
          <img src="${item.image_data || './icon-512.png'}" style="width:52px;height:52px;border-radius:12px;object-fit:cover;flex-shrink:0;" />
          <div style="min-width:0;color:#fff;font-family:Vazirmatn,Tahoma,sans-serif;">
            <div style="font-size:11px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(item.title)}</div>
            <div style="font-size:10px;color:#34d399;font-weight:800;margin-top:2px;">🛒 به سبد خرید</div>
          </div>
        `;
        document.body.appendChild(flyer);

        const dx = (dstRect.left + dstRect.width / 2) - (srcRect.left + Math.min(srcRect.width, 220) / 2);
        const dy = (dstRect.top + dstRect.height / 2) - (srcRect.top + Math.min(srcRect.height, 140) / 2);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            flyer.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.14) rotate(-8deg)`;
            flyer.style.opacity = '0.15';
          });
        });

        setTimeout(() => {
          if (flyer && flyer.parentNode) flyer.parentNode.removeChild(flyer);
          targetEl.style.transition = 'transform 0.28s ease';
          targetEl.style.transform = 'scale(1.18)';
          setTimeout(() => {
            targetEl.style.transform = 'scale(1)';
          }, 260);
        }, 880);
      } catch (err) {}
    }

    function addToShoppingCart(listingId, ev) {
      if (ev && ev.stopPropagation) ev.stopPropagation();
      const item = (state.listings || []).find(l => Number(l.id) === Number(listingId));
      if (!item) return;
      const cart = getShoppingCartItems();
      const existing = cart.find(c => Number(c.listing_id) === Number(item.id));
      const maxStock = Math.max(1, Number(item.stock_count || 15));
      if (existing) {
        if (existing.qty < maxStock) {
          existing.qty += 1;
        } else {
          showToast('حداکثر موجودی این کالا در سبد شما قرار دارد.', 'warning');
          return;
        }
      } else {
        cart.push({
          listing_id: Number(item.id),
          title: item.title,
          price: Number(item.price || 0),
          old_price: Number(item.old_price || item.price || 0),
          price_unit: item.price_unit || 'تومان',
          image_data: item.image_data,
          booth_title: item.booth_title || ('غرفه ' + item.seller_name),
          seller_username: item.seller_username,
          qty: 1
        });
      }
      saveShoppingCart();
      animateCardFlyToCart(ev, item);
      setTimeout(() => {
        if (typeof syncMobileBottomNavActiveState === 'function') syncMobileBottomNavActiveState();
      }, 60);
      showToast(`«${item.title}» با موفقیت به سبد خرید اضافه شد 🛒`);
    }

    function changeShoppingCartQty(listingId, delta) {
      const cart = getShoppingCartItems();
      const idx = cart.findIndex(c => Number(c.listing_id) === Number(listingId));
      if (idx === -1) return;
      cart[idx].qty = Number(cart[idx].qty || 1) + Number(delta);
      if (cart[idx].qty <= 0) {
        cart.splice(idx, 1);
      }
      saveShoppingCart();
      openShoppingCartModal();
      renderCurrentPage(true);
    }

    function openShoppingCartModal() {
      const cart = getShoppingCartItems();
      const totalOriginal = cart.reduce((s, c) => s + (Number(c.old_price || c.price || 0) * Number(c.qty || 1)), 0);
      const totalPayable = cart.reduce((s, c) => s + (Number(c.price || 0) * Number(c.qty || 1)), 0);
      const totalProfit = Math.max(0, totalOriginal - totalPayable);
      const u = state.currentUser || {};

      openModal(`
        <div class="p-5 sm:p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <div class="flex items-center gap-2">
              <span class="text-xl">🛒</span>
              <h3 class="font-black text-white text-sm sm:text-base">سبد خرید یکپارچه عهد بازار (${getShoppingCartTotalCount().toLocaleString('fa-IR')} کالا)</h3>
            </div>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-white font-bold">✕</button>
          </div>

          ${cart.length === 0 ? `
            <div class="p-8 text-center text-slate-400 space-y-2">
              <div class="text-3xl">🛍️</div>
              <div class="font-bold text-white text-sm">سبد خرید شما خالی است</div>
              <p>از دکمه «+ سبد خرید» روی کارت‌های بازار، کالاهای مورد نظر خود را اضافه کنید.</p>
            </div>
          ` : `
            <div class="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              ${cart.map(c => `
                <div class="glass-card p-3 rounded-2xl border border-white/10 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <img src="${c.image_data}" alt="" class="w-14 h-14 rounded-xl object-cover border border-amber-400/30 shrink-0" />
                    <div class="min-w-0">
                      <div class="font-black text-white text-xs truncate">${escapeHtml(c.title)}</div>
                      <div class="text-[10px] text-cyan-300 mt-0.5">${escapeHtml(c.booth_title)}</div>
                      <div class="font-black text-emerald-300 text-xs mt-1">${formatPrice(c.price * c.qty)} تومان</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-2 bg-slate-950/80 border border-white/15 rounded-xl px-2 py-1 shrink-0">
                    <button type="button" onclick="changeShoppingCartQty(${c.listing_id}, 1)" class="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-black">+</button>
                    <span class="font-black text-white px-1">${Number(c.qty).toLocaleString('fa-IR')}</span>
                    <button type="button" onclick="changeShoppingCartQty(${c.listing_id}, -1)" class="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-300 font-black">−</button>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="p-4 rounded-2xl bg-slate-950/80 border border-emerald-400/30 space-y-2">
              <div class="flex items-center justify-between text-slate-300">
                <span>جمع کل کالاها:</span>
                <span>${formatPrice(totalOriginal)} تومان</span>
              </div>
              ${totalProfit > 0 ? `
                <div class="flex items-center justify-between text-rose-300 font-bold">
                  <span>سود شما از تخفیف غرفه‌ها:</span>
                  <span>${formatPrice(totalProfit)} تومان</span>
                </div>
              ` : ''}
              <div class="flex items-center justify-between text-emerald-300 font-black text-sm pt-2 border-t border-white/10">
                <span>مبلغ قابل پرداخت (تحویل در محله):</span>
                <span>${formatPrice(totalPayable)} تومان</span>
              </div>
            </div>

            <form onsubmit="submitShoppingCartCheckout(event)" class="space-y-3 pt-1">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input id="cart-buyer-name" type="text" required value="${escapeHtml(u.display_name || '')}" placeholder="نام و نام خانوادگی تحویل‌گیرنده *" class="glass-input px-3.5 py-2.5 rounded-xl text-xs" />
                <input id="cart-buyer-phone" type="tel" required value="${escapeHtml(u.phone || '')}" placeholder="شماره تماس هماهنگی *" class="glass-input px-3.5 py-2.5 rounded-xl text-xs dir-ltr" />
              </div>
              <input id="cart-buyer-addr" type="text" required value="${escapeHtml(u.exact_address || u.alley || 'شمال شرق')}" placeholder="آدرس دقیق تحویل در محله *" class="glass-input w-full px-3.5 py-2.5 rounded-xl text-xs" />
              <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl">
                ✓ ثبت نهایی سفارش و ارسال به غرفه‌داران
              </button>
            </form>
          `}
        </div>
      `);
    }

    function submitShoppingCartCheckout(e) {
      if (e && e.preventDefault) e.preventDefault();
      if (!isRegisteredUser() && !isAdmin()) {
        closeModal();
        openUnifiedAppEntryModal('market');
        return;
      }
      const cart = getShoppingCartItems();
      if (cart.length === 0) return;
      const bName = ((document.getElementById('cart-buyer-name') || {}).value || '').trim();
      const bPhone = faDigitsToEn(((document.getElementById('cart-buyer-phone') || {}).value || '').trim());
      const bAddr = ((document.getElementById('cart-buyer-addr') || {}).value || '').trim();
      const payloadItems = cart.map(c => ({
        listing_id: c.listing_id,
        qty: c.qty,
        title: c.title,
        seller_username: c.seller_username,
        total_price: Number(c.price || 0) * Number(c.qty || 1)
      }));

      let firstChatTarget = null;

      payloadItems.forEach(it => {
        const ordCode = 'DK-' + Math.floor(100000 + Math.random() * 900000);
        const fullTitle = it.title + (it.qty > 1 ? ` (×${it.qty})` : '');
        state.orders.unshift({
          id: Date.now() + Math.floor(Math.random() * 1000),
          order_code: ordCode,
          listing_id: it.listing_id,
          listing_title: fullTitle,
          buyer_username: state.currentUser.username,
          buyer_name: bName,
          buyer_phone: bPhone,
          buyer_address: bAddr,
          seller_username: it.seller_username,
          total_price: it.total_price,
          order_status: 'ثبت شده از سبد خرید (ارسال به چت غرفه جهت هماهنگی)'
        });

        // قرار دادن کارت سفارش اختصاصی در چت غرفه مربوطه برای چانه‌زنی و ارتباط بیشتر
        const orderMsgText = `[ORDER_CARD]|${ordCode}|${fullTitle}|${it.qty}|${it.total_price}|${bName}|${bPhone}|${bAddr}`;
        const listingObj = (state.listings || []).find(l => Number(l.id) === Number(it.listing_id));
        if (listingObj) {
          if (!Array.isArray(listingObj.messages)) listingObj.messages = [];
          listingObj.messages.push({
            id: Date.now() + Math.floor(Math.random() * 1000),
            listing_id: Number(listingObj.id),
            sender_username: state.currentUser.username,
            receiver_username: it.seller_username,
            sender: bName || state.currentUser.display_name,
            text: orderMsgText,
            offered_price: Number(it.total_price || 0),
            offer_status: 'pending',
            message_type: 'pv',
            status: 'approved',
            _optimisticTs: Date.now()
          });
          if (!firstChatTarget) {
            firstChatTarget = { listing_id: Number(listingObj.id), peer: it.seller_username };
          }
        }
      });

      state.shoppingCart = [];
      saveShoppingCart();
      saveState();
      closeModal();
      callServerApi('checkout_cart_orders', {
        buyer_username: state.currentUser.username,
        buyer_name: bName,
        buyer_phone: bPhone,
        buyer_address: bAddr,
        items: payloadItems
      });

      if (firstChatTarget && typeof openMessagesCenterPage === 'function') {
        state.selectedChatKey = `${firstChatTarget.listing_id}::${firstChatTarget.peer}`;
        state.mobileChatView = 'chat';
        openMessagesCenterPage('chats', 'market');
      } else {
        renderCurrentPage(true);
      }
      showToast('✅ سفارش شما ثبت شد و کارت سفارش جهت چانه‌زنی و هماهنگی به چت غرفه ارسال گردید!');
    }

    function getListingUserRatingsMap() {
      try {
        const raw = localStorage.getItem('hamahdi_listing_ratings_v311');
        const obj = raw ? JSON.parse(raw) : {};
        return (obj && typeof obj === 'object') ? obj : {};
      } catch (e) {
        return {};
      }
    }

    function getUserRatingForListing(listingId) {
      const uname = (state.currentUser && state.currentUser.username) ? String(state.currentUser.username).toLowerCase() : 'guest';
      const map = getListingUserRatingsMap();
      return Number(map[uname + '_' + Number(listingId)] || 0);
    }

    function submitListingStarRating(listingId, stars) {
      if (!isRegisteredUser() && !isAdmin()) {
        openUnifiedAppEntryModal('market');
        return;
      }
      const uname = String(state.currentUser.username || 'user').toLowerCase();
      const map = getListingUserRatingsMap();
      const rateKey = uname + '_' + Number(listingId);
      if (map[rateKey]) {
        showToast('شما قبلاً به این کالا امتیاز داده‌اید (هر اکانت فقط یک بار مجاز به ثبت امتیاز است).', 'warning');
        return;
      }
      const item = (state.listings || []).find(l => Number(l.id) === Number(listingId));
      if (!item) return;
      const curAvg = Number(item.rating_avg || 4.8);
      const curCnt = Math.max(1, Number(item.rating_count || 10));
      item.rating_count = curCnt + 1;
      item.rating_avg = Number((((curAvg * curCnt) + Number(stars)) / item.rating_count).toFixed(1));
      map[rateKey] = Number(stars);
      try {
        localStorage.setItem('hamahdi_listing_ratings_v311', JSON.stringify(map));
      } catch (e) {}
      saveState();
      renderCurrentPage(true);
      callServerApi('rate_market_listing', { id: Number(listingId), stars: Number(stars), voter: uname });
      showToast(`امتیاز ${stars.toLocaleString('fa-IR')} ستاره شما برای این کالا ثبت شد ⭐`);
    }

/**
 * HAMAHDI (هم‌عهدی) - ماژول بازار مردمی، فیلتر Bottom Sheet، جستجوی بدون پرش کیبورد، ویزارد ثبت آگهی و چت/سفارش (نسخه 6.0)
 */
    let marketSearchDebounceTimer = null;

    function getSeenStoryIds() {
      try {
        const raw = localStorage.getItem('hamahdi_seen_stories_v21');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr.map(Number) : [];
      } catch (e) {
        return [];
      }
    }

    function markStoryAsSeen(storyId) {
      try {
        const list = getSeenStoryIds();
        const sid = Number(storyId);
        if (!list.includes(sid)) {
          list.push(sid);
          localStorage.setItem('hamahdi_seen_stories_v21', JSON.stringify(list));
        }
      } catch (e) {}
    }

    function isStorySeen(storyId) {
      return getSeenStoryIds().includes(Number(storyId));
    }

    function getFilteredSortedMarketListings(approvedListings, qStr) {
      const q = (qStr !== undefined ? qStr : (state.marketSearchQuery || '')).trim().toLowerCase();
      const minP = Number(state.marketMinPrice || 0);
      const maxP = Number(state.marketMaxPrice || 0);

      const subFilter = state.marketSubcategoryFilter || 'all';
      const filtered = approvedListings.filter(item => {
        const matchCat = state.marketCategoryFilter === 'all' || item.category === state.marketCategoryFilter;
        const itemSubcat = (item.subcategory || (item.specs && item.specs['زیردسته تخصصی']) || '');
        const matchSub = subFilter === 'all' || itemSubcat === subFilter || (item.title && item.title.includes(subFilter)) || (item.description && item.description.includes(subFilter));
        const matchAlley = state.marketAlleyFilter === 'all' || (item.address_detail && item.address_detail.includes(state.marketAlleyFilter));
        const matchAmz = !state.marketOnlyAmazing || item.is_amazing;
        const matchUrg = !state.marketOnlyUrgent || item.is_urgent;
        const matchBookmarked = !state.marketOnlyBookmarked || isListingBookmarked(item.id);
        const matchMinP = !minP || Number(item.price || 0) >= minP;
        const matchMaxP = !maxP || Number(item.price || 0) <= maxP;
        const matchQ = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || (item.booth_title && item.booth_title.toLowerCase().includes(q));
        return matchCat && matchSub && matchAlley && matchAmz && matchUrg && matchBookmarked && matchMinP && matchMaxP && matchQ;
      });

      const sortMode = state.marketSortBy || 'newest';
      return filtered.slice().sort((a, b) => {
        if (sortMode === 'cheapest') return Number(a.price || 0) - Number(b.price || 0);
        if (sortMode === 'expensive') return Number(b.price || 0) - Number(a.price || 0);
        if (sortMode === 'discount') return Number(b.discount_percent || 0) - Number(a.discount_percent || 0);
        if (sortMode === 'rating') return Number(b.rating_avg || 4.8) - Number(a.rating_avg || 4.8);
        return (Number(b.laddered_at || 0) - Number(a.laddered_at || 0)) || (Number(b.id || 0) - Number(a.id || 0));
      });
    }

    function renderMarketListingsGridHtml(filtered) {
      if (!filtered || filtered.length === 0) {
        return `
          <div class="glass-panel rounded-3xl p-10 text-center border border-dashed border-white/20 space-y-3">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-400/30 text-amber-300 flex items-center justify-center mx-auto text-2xl">
              <svg viewBox="0 0 24 24" class="svg-icon " aria-hidden="true"><path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/></svg>
            </div>
            <h3 class="font-black text-white text-base">هیچ آگهی تاییدشده‌ای با این فیلتر یافت نشد</h3>
            <p class="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
              می‌توانید فیلترها را پاک کنید یا اگر عضو اهالی شمال شرق هستید، اولین آگهی این بخش را در غرفه خود ثبت نمایید.
            </p>
            <div class="flex flex-wrap justify-center gap-2">
              <button type="button" onclick="resetAllMarketFilters()" class="px-4 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs">
                پاک کردن فیلترها
              </button>
              <button type="button" onclick="openAddMarketListingModal()" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                + ثبت آگهی در غرفه
              </button>
            </div>
          </div>
        `;
      }
      return `
        <div class="hm-market-cards-grid">
          ${filtered.map(item => renderMarketCard(item)).join('')}
        </div>
      `;
    }

    function updateMarketListingsResultsDOM() {
      const area = document.getElementById('market-listings-results-area');
      const countBadge = document.getElementById('market-results-count-badge');
      if (!area) {
        renderCurrentPage();
        return;
      }
      const approved = getApprovedListings();
      const filtered = getFilteredSortedMarketListings(approved, state.marketSearchQuery);
      area.innerHTML = renderMarketListingsGridHtml(filtered);
      if (countBadge) {
        countBadge.innerHTML = 'نمایش: <strong class="text-amber-300">' + filtered.length + ' آگهی</strong>';
      }
    }

    function handleMarketSearchInput(val) {
      state.marketSearchQuery = val;
      if (marketSearchDebounceTimer) clearTimeout(marketSearchDebounceTimer);
      marketSearchDebounceTimer = setTimeout(() => {
        updateMarketListingsResultsDOM();
      }, 200);
    }

    function resetAllMarketFilters() {
      state.marketCategoryFilter = 'all';
      state.marketSubcategoryFilter = 'all';
      state.categoriesMegaMenuOpen = false;
      state.marketAlleyFilter = 'all';
      state.marketOnlyAmazing = false;
      state.marketOnlyUrgent = false;
      state.marketMinPrice = 0;
      state.marketMaxPrice = 0;
      state.marketSortBy = 'newest';
      state.marketSearchQuery = '';
      closeModal();
      renderCurrentPage();
    }

    function openMarketFilterBottomSheet() {
      openModal(`
        <div class="p-5 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-amber-300 text-base"><svg viewBox="0 0 24 24" class="svg-icon ml-1.5" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>فیلتر پیشرفته و مرتب‌سازی بازار محله</h3>
            <button type="button" onclick="closeModal()" class="w-9 h-9 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-300 mb-1">دسته‌بندی کالا یا خدمت</label>
              <select id="bs-cat" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                <option value="all" ${state.marketCategoryFilter === 'all' ? 'selected' : ''}>همه دسته‌بندی‌ها</option>
                ${MARKET_CATEGORIES.map(c => `<option value="${c.id}" ${state.marketCategoryFilter === c.id ? 'selected' : ''}>${escapeHtml(c.title)}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">محدوده و کوچه در شمال شرق</label>
              <select id="bs-alley" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                <option value="all" ${state.marketAlleyFilter === 'all' ? 'selected' : ''}>همه کوچه‌های شمال شرق</option>
                ${TABARSI_ALLEYS.slice(1).map(a => `<option value="${escapeHtml(a)}" ${state.marketAlleyFilter === a ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-300 mb-1">حداقل قیمت (تومان)</label>
              <input id="bs-min-price" type="number" min="0" value="${Number(state.marketMinPrice || 0)}" placeholder="0" class="glass-input w-full px-3 py-2.5 rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-300 mb-1">حداکثر قیمت (تومان - 0 یعنی نامحدود)</label>
              <input id="bs-max-price" type="number" min="0" value="${Number(state.marketMaxPrice || 0)}" placeholder="0" class="glass-input w-full px-3 py-2.5 rounded-xl" />
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 mb-1">مرتب‌سازی بر اساس</label>
            <select id="bs-sort" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
              <option value="newest" ${state.marketSortBy === 'newest' ? 'selected' : ''}>جدیدترین و نردبان‌شده‌ها</option>
              <option value="cheapest" ${state.marketSortBy === 'cheapest' ? 'selected' : ''}>ارزان‌ترین قیمت</option>
              <option value="expensive" ${state.marketSortBy === 'expensive' ? 'selected' : ''}>گران‌ترین قیمت</option>
              <option value="discount" ${state.marketSortBy === 'discount' ? 'selected' : ''}>بیشترین تخفیف شگفت‌انگیز</option>
            </select>
          </div>

          <div class="flex flex-wrap gap-4 p-3 rounded-2xl bg-white/5 border border-white/10">
            <label class="inline-flex items-center gap-2 text-slate-200 cursor-pointer">
              <input id="bs-only-amz" type="checkbox" ${state.marketOnlyAmazing ? 'checked' : ''} class="rounded accent-amber-400" />
              <span>⚡ فقط پیشنهادهای شگفت‌انگیز</span>
            </label>
            <label class="inline-flex items-center gap-2 text-slate-200 cursor-pointer">
              <input id="bs-only-urg" type="checkbox" ${state.marketOnlyUrgent ? 'checked' : ''} class="rounded accent-rose-500" />
              <span>🔥 فقط آگهی‌های فوری</span>
            </label>
          </div>

          <div class="flex items-center gap-2.5 pt-2">
            <button type="button" onclick="resetAllMarketFilters()" class="px-4 py-3 rounded-xl bg-white/10 text-slate-200 font-bold">
              حذف فیلترها
            </button>
            <button type="button" onclick="applyBottomSheetMarketFilters()" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black text-sm">
              اعمال فیلترها در بازار
            </button>
          </div>
        </div>
      `);
    }

    function applyBottomSheetMarketFilters() {
      state.marketCategoryFilter = (document.getElementById('bs-cat') || {}).value || 'all';
      state.marketAlleyFilter = (document.getElementById('bs-alley') || {}).value || 'all';
      state.marketMinPrice = Number((document.getElementById('bs-min-price') || {}).value || 0);
      state.marketMaxPrice = Number((document.getElementById('bs-max-price') || {}).value || 0);
      state.marketSortBy = (document.getElementById('bs-sort') || {}).value || 'newest';
      state.marketOnlyAmazing = Boolean((document.getElementById('bs-only-amz') || {}).checked);
      state.marketOnlyUrgent = Boolean((document.getElementById('bs-only-urg') || {}).checked);
      closeModal();
      renderCurrentPage();
    }

    // SEPARATE ACTIVE PAGE: MARKET & ECONOMY (All 10 Market Enhancements)
    // =========================================================================
    function renderMarketCard(item) {
      const catObj = MARKET_CATEGORIES.find(c => c.id === item.category) || MARKET_CATEGORIES[0];
      const isLaddered = Number(item.laddered_at || 0) > 0;
      const commentCount = (item.messages || []).filter(m => m.message_type === 'comment').length;
      return `
        <div onclick="openListingDetailModal(${item.id})" class="glass-card glass-card-active market-card-item rounded-2xl overflow-hidden flex flex-col justify-between border border-white/15 hover:border-amber-400/50 transition cursor-pointer">
          <div>
            <!-- Compact Image (h-40) + Badges -->
            <div class="relative h-40 bg-slate-900 overflow-hidden">
              <img src="${item.image_data}" alt="${escapeHtml(item.title)}" loading="lazy" decoding="async" class="w-full h-full object-cover max-w-full hover:scale-105 transition duration-500" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-transparent"></div>

              <!-- Top Right Badges: Ladder, Urgent, Amazing -->
              <div class="absolute top-2.5 right-2.5 flex flex-wrap gap-1">
                ${isLaddered ? '<span class="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">🚀 نردبان</span>' : ''}
                ${item.is_urgent ? '<span class="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">🔥 فوری</span>' : ''}
                ${item.is_amazing ? `<span class="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow">⚡ شگفت‌انگیز ${item.discount_percent ? item.discount_percent + '٪' : ''}</span>` : ''}
              </div>

              <!-- Top Left Admin Delete -->
              ${isAdmin() ? `
                <button type="button" onclick="event.stopPropagation(); deleteMarketListing(${item.id})" class="absolute top-2.5 left-2.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow">
                  حذف
                </button>
              ` : ''}

              <!-- Bottom Image Badges: Condition & Delivery -->
              <div class="absolute bottom-2 inset-x-2.5 flex items-center justify-between gap-1.5 text-[10px]">
                <span class="px-2 py-0.5 rounded bg-slate-950/85 text-cyan-300 border border-cyan-400/30 font-bold truncate">
                  ${escapeHtml(item.condition_badge || 'نو / تولید تازه')}
                </span>
                <span class="px-2 py-0.5 rounded bg-slate-950/85 text-emerald-300 border border-emerald-400/30 font-bold truncate">
                  ${escapeHtml(item.delivery_badge || 'تحویل در محله')}
                </span>
              </div>
            </div>

            <!-- Compact Card Body -->
            <div class="p-3 space-y-1.5">
              <div class="flex items-center justify-between text-[10px] text-slate-400">
                <span class="truncate">${escapeHtml(catObj.title)}</span>
                <button type="button" onclick="event.stopPropagation(); openBoothPage('${escapeHtml(item.seller_username)}')" class="text-cyan-300 hover:underline font-bold truncate max-w-[140px]">
                  🏪 ${escapeHtml(item.booth_title || ('غرفه ' + item.seller_name))}
                </button>
              </div>

              <h3 class="font-black text-sm text-white hover:text-amber-300 leading-snug line-clamp-1">
                ${escapeHtml(item.title)}
              </h3>

              <p class="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">${escapeHtml(item.description)}</p>

              <div class="text-[10px] text-slate-400 pt-0.5 flex items-center justify-between">
                <span class="truncate">📍 ${escapeHtml(item.address_detail)}</span>
                ${commentCount > 0 ? `<span class="text-amber-300 font-bold shrink-0">💬 ${commentCount} نظر</span>` : ''}
              </div>
            </div>
          </div>

          <!-- Digikala Rating + Stock + Divar Bookmark & Quick Add-to-Cart Footer -->
          <div class="px-3 pb-1 flex items-center justify-between text-[10px] text-slate-300">
            <span class="text-amber-300 font-black">⭐ ${Number(item.rating_avg || 4.8).toLocaleString('fa-IR')} <span class="text-slate-400 font-normal">(${Number(item.rating_count || 12).toLocaleString('fa-IR')})</span></span>
            <span class="text-emerald-300 font-bold">📦 موجود: ${Number(item.stock_count || 12).toLocaleString('fa-IR')}</span>
          </div>
          <div class="p-3 pt-2 border-t border-white/10 flex items-center justify-between gap-1.5 text-xs">
            <div class="min-w-0 flex items-baseline gap-1.5">
              <span class="font-black text-emerald-300 text-xs sm:text-sm truncate">${item.price > 0 ? formatPrice(item.price) + ' ' + escapeHtml(item.price_unit) : escapeHtml(item.price_unit)}</span>
              ${item.old_price > item.price ? `<span class="text-[10px] text-slate-400 line-through">${formatPrice(item.old_price)}</span>` : ''}
            </div>
            <div class="flex items-center gap-1 shrink-0">
              <button type="button" onclick="toggleBookmarkMarketListing(${item.id}, event)" class="w-7 h-7 rounded-lg bg-white/10 hover:bg-amber-400/20 flex items-center justify-center text-xs ${isListingBookmarked(item.id) ? 'text-amber-400' : 'text-slate-300'}" title="نشان کردن آگهی">🔖</button>
              <button type="button" onclick="addToShoppingCart(${item.id}, event)" class="px-2.5 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-[10px] shadow">+ سبد 🛒</button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // DIVAR-STYLE MEGA-MENU FOR CATEGORIES & SUBCATEGORIES (مطابق تصویر مرجع دیوار)
    // =========================================================================
    function toggleCategoriesMegaMenu(forceState) {
      if (typeof forceState === 'boolean') {
        state.categoriesMegaMenuOpen = forceState;
      } else {
        state.categoriesMegaMenuOpen = !state.categoriesMegaMenuOpen;
      }
      if (state.categoriesMegaMenuOpen && (!state.activeMegaMenuCatId || state.activeMegaMenuCatId === 'all')) {
        state.activeMegaMenuCatId = (state.marketCategoryFilter && state.marketCategoryFilter !== 'all') ? state.marketCategoryFilter : 'jobs';
      }
      const panel = document.getElementById('market-categories-megamenu-wrap');
      if (panel) {
        if (state.categoriesMegaMenuOpen) {
          panel.innerHTML = renderDivarMegaMenuInnerHtml();
          panel.classList.remove('hidden');
          if (typeof convertFaIconsToSvg === 'function') convertFaIconsToSvg(panel);
        } else {
          panel.classList.add('hidden');
        }
      } else {
        renderCurrentPage(true);
      }
    }

    function previewMegaMenuCategory(catId) {
      state.activeMegaMenuCatId = catId;
      const panel = document.getElementById('market-categories-megamenu-wrap');
      if (panel) {
        panel.innerHTML = renderDivarMegaMenuInnerHtml();
        if (typeof convertFaIconsToSvg === 'function') convertFaIconsToSvg(panel);
      }
    }

    function selectMegaMenuCategory(catId, subcatName = 'all') {
      state.marketCategoryFilter = catId || 'all';
      state.marketSubcategoryFilter = subcatName || 'all';
      state.categoriesMegaMenuOpen = false;
      saveState();
      renderCurrentPage();
    }

    function renderDivarMegaMenuInnerHtml() {
      const activeCatId = state.activeMegaMenuCatId || 'jobs';
      const activeCat = MARKET_CATEGORIES.find(c => c.id === activeCatId) || MARKET_CATEGORIES[9] || MARKET_CATEGORIES[0];
      const subcats = Array.isArray(activeCat.subcategories) ? activeCat.subcategories : [];

      return `
        <!-- Backdrop to close Mega-Menu on outside click -->
        <div onclick="toggleCategoriesMegaMenu(false)" class="fixed inset-0 z-30 bg-black/40 backdrop-blur-[1px]"></div>

        <!-- Divar-Style 3-Column Mega-Menu Panel (Exact Match to Reference Screenshot) -->
        <div onclick="event.stopPropagation()" class="hm-megamenu-panel relative z-40 mt-2 rounded-3xl bg-[#181b22] border border-white/15 shadow-[0_28px_70px_rgba(0,0,0,0.85)] overflow-hidden text-xs">
          <div class="grid grid-cols-1 md:grid-cols-12 min-h-[380px]">

            <!-- ۱. ستون سمت راست: دسته‌های اصلی (مشابه دیوار) -->
            <div class="hm-megamenu-sidebar md:col-span-3 border-b md:border-b-0 md:border-l border-white/10 bg-[#14171d] p-3 space-y-1 max-h-[420px] overflow-y-auto">
              <button type="button" onclick="selectMegaMenuCategory('all', 'all')" class="w-full px-3 py-2.5 rounded-xl flex items-center justify-between font-bold transition ${state.marketCategoryFilter === 'all' ? 'bg-white/10 text-amber-300 border border-amber-400/30' : 'text-slate-200 hover:bg-white/5'}">
                <span class="flex items-center gap-2">
                  <span>→</span>
                  <span>همه آگهی‌ها</span>
                </span>
              </button>
              ${MARKET_CATEGORIES.map(c => {
                const isHover = c.id === activeCat.id;
                return `
                  <button type="button" onmouseenter="previewMegaMenuCategory('${c.id}')" onclick="previewMegaMenuCategory('${c.id}')" class="hm-megamenu-cat-btn ${isHover ? 'hm-megamenu-cat-active' : ''} w-full px-3 py-2.5 rounded-xl flex items-center justify-between font-bold transition ${isHover ? 'bg-white/12 text-white border-r-4 border-r-amber-400 shadow' : 'text-slate-300 hover:bg-white/5 hover:text-white'}">
                    <span class="flex items-center gap-2 truncate">
                      <i class="fa-solid ${c.icon} text-amber-300/90 w-4 text-center"></i>
                      <span class="truncate">${escapeHtml(c.title)}</span>
                    </span>
                    <span class="text-slate-400 text-[11px]">‹</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- ۲. ستون میانی: زیردسته‌های تخصصی دسته انتخابی -->
            <div class="hm-megamenu-subcol md:col-span-5 p-4 sm:p-5 bg-[#181b22] flex flex-col justify-between max-h-[420px] overflow-y-auto">
              <div>
                <div class="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                  <span class="font-black text-amber-300 text-sm flex items-center gap-2">
                    <i class="fa-solid ${activeCat.icon}"></i>
                    <span>زیردسته‌های «${escapeHtml(activeCat.title)}»</span>
                  </span>
                  <span class="text-[11px] text-slate-400">${subcats.length} زیردسته</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  ${subcats.map(sub => {
                    const isSubSelected = state.marketCategoryFilter === activeCat.id && state.marketSubcategoryFilter === sub;
                    return `
                      <button type="button" onclick="selectMegaMenuCategory('${activeCat.id}', '${escapeHtml(sub)}')" class="hm-megamenu-sub-btn ${isSubSelected ? 'hm-megamenu-sub-active' : ''} text-right px-3 py-2 rounded-xl font-bold text-xs transition flex items-center justify-between gap-2 ${isSubSelected ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-200 hover:bg-white/10 hover:text-amber-300'}">
                        <span class="truncate">${escapeHtml(sub)}</span>
                        <span class="text-[10px] opacity-60">←</span>
                      </button>
                    `;
                  }).join('')}
                </div>
              </div>
            </div>

            <!-- ۳. ستون سمت چپ: تصویر وکتور سه‌بعدی + دکمه «همه آگهی‌های این دسته» (دقیقاً مطابق تصویر مرجع) -->
            <div class="hm-megamenu-artcol md:col-span-4 p-5 bg-gradient-to-br from-[#181b22] to-[#101318] border-t md:border-t-0 md:border-r border-white/5 flex flex-col items-center justify-between text-center">
              <div class="my-auto py-2 flex flex-col items-center">
                <!-- Isometric 3D-Style Desk & Workspace Vector Illustration matching Divar Reference -->
                <svg viewBox="0 0 220 160" class="w-44 h-32 drop-shadow-[0_14px_24px_rgba(0,0,0,0.6)]" fill="none">
                  <ellipse cx="110" cy="136" rx="78" ry="16" fill="rgba(56, 189, 248, 0.12)"/>
                  <!-- Desk Top -->
                  <polygon points="45,78 135,54 180,74 90,98" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1.5"/>
                  <polygon points="45,78 90,98 90,104 45,84" fill="#64748b"/>
                  <polygon points="90,98 180,74 180,80 90,104" fill="#475569"/>
                  <!-- Desk Legs & Drawer Cabinet -->
                  <polygon points="52,86 60,89 60,132 52,129" fill="#334155"/>
                  <polygon points="132,88 172,77 172,118 132,129" fill="#475569"/>
                  <polygon points="112,78 132,88 132,129 112,119" fill="#334155"/>
                  <line x1="136" y1="98" x2="168" y2="89" stroke="#94a3b8" stroke-width="2"/>
                  <line x1="136" y1="112" x2="168" y2="103" stroke="#94a3b8" stroke-width="2"/>
                  <!-- Monitor / Laptop on Desk -->
                  <polygon points="96,42 132,32 132,60 96,70" fill="#0f172a" stroke="#38bdf8" stroke-width="1.8"/>
                  <polygon points="99,45 129,36 129,57 99,66" fill="#0284c7"/>
                  <rect x="111" y="66" width="6" height="8" fill="#64748b"/>
                  <!-- Warm Yellow Chair -->
                  <polygon points="145,94 175,86 185,92 155,100" fill="#f59e0b"/>
                  <polygon points="172,58 186,64 182,92 168,86" fill="#fbbf24" stroke="#d97706" stroke-width="1.2"/>
                  <line x1="165" y1="98" x2="165" y2="122" stroke="#475569" stroke-width="3"/>
                  <line x1="153" y1="125" x2="177" y2="119" stroke="#475569" stroke-width="2.5"/>
                  <!-- Green Potted Plant -->
                  <polygon points="32,108 48,108 45,128 35,128" fill="#e2e8f0"/>
                  <path d="M40 108 C32 94, 34 82, 40 76 C46 82, 48 94, 40 108 Z" fill="#10b981"/>
                  <path d="M40 108 C28 98, 25 88, 30 82 C36 86, 38 96, 40 108 Z" fill="#059669"/>
                  <path d="M40 108 C50 98, 54 88, 49 82 C44 86, 42 96, 40 108 Z" fill="#34d399"/>
                </svg>
                <div class="text-xs font-black text-white mt-2">بخش «${escapeHtml(activeCat.title)}» در بازار هم‌عهدی</div>
                <p class="text-[11px] text-slate-400 mt-0.5">یک زیردسته را انتخاب کنید یا تمام آگهی‌های این دسته را ببینید</p>
              </div>

              <button type="button" onclick="selectMegaMenuCategory('${activeCat.id}', 'all')" class="w-full py-2.5 px-4 rounded-xl border border-white/25 hover:border-amber-400 bg-white/5 hover:bg-amber-400 hover:text-slate-950 text-slate-100 font-black text-xs transition shadow">
                همه آگهی‌های ${escapeHtml(activeCat.title)}
              </button>
            </div>

          </div>
        </div>
      `;
    }

    // =========================================================================
    // SPIRITUAL COST & 604-PAGE COLLECTIVE QURAN KHATM SYSTEM (هزینه معنوی و ختم قرآن)
    // =========================================================================
    function renderSpiritualCovenantFooterSection() {
      const sp = getSpiritualStatsObj();
      return `
        <footer id="landing-spiritual-covenant-footer" class="glass-panel rounded-3xl p-4 sm:p-5 border border-emerald-400/35 bg-gradient-to-r from-emerald-950/65 via-slate-900/95 to-amber-950/45 space-y-3.5 shadow-xl mt-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <div class="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center justify-center text-xl shadow shrink-0">
                📖
              </div>
              <div>
                <h2 class="text-xs sm:text-sm font-black text-white">میثاق معنوی هم‌عهدی (صلوات، ذکر فرج و ختم ۶۰۴ صفحه‌ای قرآن کریم)</h2>
                <p class="text-[10px] sm:text-[11px] text-amber-300 font-bold leading-relaxed mt-0.5">
                  هدیه به روح پرفتوح پدر شهید انقلاب حضرت آیت‌الله العظمی سید علی حسینی خامنه‌ای، سلامتی حضرت آیت‌الله سید مجتبی حسینی خامنه‌ای، پیروزی جبهه مقاومت و تعجیل در فرج حضرت صاحب‌الزمان (عج) • التماس دعا برای سرباز گمنام
                </p>
              </div>
            </div>
            <button type="button" onclick="openStandaloneSpiritualKhatmModal()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-950 font-black text-xs shadow hover:scale-105 transition shrink-0">
              📖 مشارکت در ختم قرآن و صلوات ←
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
            <div onclick="openStandaloneSpiritualKhatmModal()" class="glass-card p-3 rounded-2xl border border-amber-400/30 flex items-center justify-between cursor-pointer hover:border-amber-400 transition">
              <span class="text-slate-300 font-bold">📿 مجموع صلوات‌ها:</span>
              <span class="font-black text-amber-300 text-sm">${sp.totalSalawat.toLocaleString('fa-IR')}</span>
            </div>
            <div onclick="openStandaloneSpiritualKhatmModal()" class="glass-card p-3 rounded-2xl border border-emerald-400/30 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition">
              <span class="text-slate-300 font-bold">🤲 ذکر اللهم عجل لولیک الفرج:</span>
              <span class="font-black text-emerald-300 text-sm">${sp.totalFaraj.toLocaleString('fa-IR')}</span>
            </div>
            <div onclick="openStandaloneSpiritualKhatmModal()" class="glass-card p-3 rounded-2xl border border-cyan-400/30 sm:col-span-2 space-y-1.5 cursor-pointer hover:border-cyan-400 transition">
              <div class="flex items-center justify-between text-[11px]">
                <span class="font-bold text-slate-200">📖 پیشرفت ختم قرآن فعلی (${sp.lockedCount.toLocaleString('fa-IR')} از ۶۰۴ صفحه): <strong class="text-amber-300">${sp.progressPct.toLocaleString('fa-IR')}٪</strong></span>
                <span class="text-emerald-300 font-black">🏆 ${sp.completedKhatms.toLocaleString('fa-IR')} ختم کامل</span>
              </div>
              <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-white/10">
                <div class="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full" style="width: ${Math.max(2, sp.progressPct)}%;"></div>
              </div>
            </div>
          </div>
        </footer>
      `;
    }

    function getSpiritualStatsObj() {
      if (!state.spiritualStats || typeof state.spiritualStats !== 'object') {
        state.spiritualStats = { total_salawat: 0, total_faraj: 0, completed_khatms: 0, locked_pages: {} };
      }
      if (!state.spiritualStats.locked_pages || typeof state.spiritualStats.locked_pages !== 'object') {
        state.spiritualStats.locked_pages = {};
      }
      const lockedMap = state.spiritualStats.locked_pages;
      const lockedCount = Object.keys(lockedMap).length;
      const progressPct = Math.min(100, Number(((lockedCount / 604) * 100).toFixed(1)));
      return {
        totalSalawat: Number(state.spiritualStats.total_salawat || 0),
        totalFaraj: Number(state.spiritualStats.total_faraj || 0),
        completedKhatms: Number(state.spiritualStats.completed_khatms || 0),
        lockedMap: lockedMap,
        lockedCount: lockedCount,
        remainingCount: Math.max(0, 604 - lockedCount),
        progressPct: progressPct
      };
    }

    function getQuranPageJuzNumber(pageNum) {
      if (pageNum <= 1) return 1;
      if (pageNum >= 604) return 30;
      return Math.min(30, Math.max(1, Math.ceil((pageNum - 1) / 20)));
    }

    function renderSacredDedicationBannerHtml() {
      return `
        <div class="hm-sacred-dedication-box p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-emerald-950/90 via-slate-900/95 to-amber-950/60 border border-amber-400/45 shadow-lg space-y-2 text-xs leading-relaxed">
          <div class="flex items-center justify-between gap-2 border-b border-amber-400/25 pb-2">
            <span class="font-black text-amber-300 text-xs sm:text-sm flex items-center gap-1.5">
              <span>🕊️</span>
              <span>هدیه ثواب و نیت خالصانه مشارکت معنوی</span>
            </span>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/25 border border-emerald-400/40 text-emerald-200 font-bold text-[10px]">
              بدون هیچ‌گونه هزینه مالی یا بانکی
            </span>
          </div>
          <p class="text-slate-100 text-[11px] sm:text-xs leading-relaxed text-justify font-medium">
            تمامی ثواب این مشارکت‌های معنوی به روح پرفتوح پدر شهید انقلاب، <strong class="text-amber-300">حضرت آیت‌الله العظمی سید علی حسینی خامنه‌ای</strong>، و همچنین سلامتی فرزند رشید ایشان، <strong class="text-emerald-300">حضرت آیت‌الله سید مجتبی حسینی خامنه‌ای</strong>، پیروزی جبهه مقاومت و در صدر همه، تعجیل در فرج مولایمان <strong class="text-amber-300">حضرت بقیةالله الأعظم، صاحب‌الزمان (عج)</strong>، هدیه می‌شود.
          </p>
          <div class="pt-1 flex items-center justify-between text-[11px] text-cyan-200 font-bold border-t border-white/10">
            <span>🤲 برای این فرزند خود نیز دعا کنید؛ <strong class="text-amber-300">سرباز گمنام</strong>.</span>
            <span class="text-emerald-300">اللَّهُمَّ عَجِّلْ لِوَلِيِّكَ الْفَرَجَ</span>
          </div>
        </div>
      `;
    }

    function renderQuran604PagesGridHtml(contextPrefix = 'wiz') {
      const st = getSpiritualStatsObj();
      const juzFilter = Number(state.spiritualQuranJuzFilter || 0);
      const selectedPages = Array.isArray(state.spiritualSelectedQuranPages) ? state.spiritualSelectedQuranPages.map(Number) : [];

      let startPage = 1;
      let endPage = 604;
      if (juzFilter >= 1 && juzFilter <= 30) {
        startPage = (juzFilter - 1) * 20 + 2;
        if (juzFilter === 1) startPage = 1;
        endPage = juzFilter === 30 ? 604 : (juzFilter * 20 + 1);
      }

      const pageButtons = [];
      for (let p = startPage; p <= endPage; p++) {
        const lockedBy = st.lockedMap[String(p)];
        const isSelected = selectedPages.includes(p);
        if (lockedBy) {
          pageButtons.push(`
            <button type="button" disabled title="صفحه ${p.toLocaleString('fa-IR')} قبلاً توسط «${escapeHtml(lockedBy)}» انتخاب و قفل شده است" class="p-1.5 rounded-xl bg-slate-900/90 border border-rose-500/35 text-slate-500 text-[10px] font-bold flex flex-col items-center justify-center opacity-75 cursor-not-allowed select-none">
              <span class="text-rose-400/90 text-[9px]">🔒 قفل</span>
              <span>ص ${p.toLocaleString('fa-IR')}</span>
            </button>
          `);
        } else {
          pageButtons.push(`
            <button type="button" onclick="toggleSelectQuranPage(${p}, '${contextPrefix}')" class="p-1.5 rounded-xl border text-[10px] font-black flex flex-col items-center justify-center transition ${isSelected ? 'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 border-amber-300 ring-2 ring-amber-400 shadow-lg scale-105' : 'bg-slate-950/85 hover:bg-emerald-500/20 text-slate-200 border-white/15 hover:border-emerald-400/50'}">
              <span class="text-[9px] ${isSelected ? 'text-slate-950 font-black' : 'text-emerald-400'}">${isSelected ? '✔ انتخابی' : 'آزاد'}</span>
              <span>ص ${p.toLocaleString('fa-IR')}</span>
            </button>
          `);
        }
      }

      return `
        <div class="space-y-3">
          <!-- Progress Bar of Current 604-Page Quran Khatm -->
          <div class="p-3 rounded-2xl bg-slate-950/85 border border-emerald-400/35 space-y-2">
            <div class="flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="font-black text-emerald-300 flex items-center gap-1.5">
                <span>📖 پیشرفت ختم دسته‌جمعی قرآن کریم (۶۰۴ صفحه):</span>
                <span class="text-amber-300">${st.progressPct.toLocaleString('fa-IR')}٪</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-200 font-bold text-[10px]">
                  تکمیل‌شده: ${st.lockedCount.toLocaleString('fa-IR')} از ۶۰۴ صفحه
                </span>
                <span class="px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-[10px]">
                  🏆 ختم‌های کامل ثبت‌شده: ${st.completedKhatms.toLocaleString('fa-IR')} ختم
                </span>
              </div>
            </div>
            <div class="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-white/15 p-0.5">
              <div class="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-amber-400 rounded-full transition-all duration-500" style="width: ${Math.max(2, st.progressPct)}%;"></div>
            </div>
            <div class="flex items-center justify-between text-[10px] text-slate-400">
              <span>هر صفحه پس از انتخاب و ثبت توسط یک کاربر، برای سایر کاربران قفل (🔒) می‌شود.</span>
              <span>با تکمیل ۱۰۰٪ صفحات، یک ختم کامل ثبت می‌گردد.</span>
            </div>
          </div>

          <!-- Filter by Juz (1..30 or All 604 Pages) + Selected Pages Summary -->
          <div class="flex flex-wrap items-center justify-between gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-white/10">
            <div class="flex items-center gap-2">
              <label class="text-[11px] font-bold text-amber-300">نمایش صفحات بر اساس جزء:</label>
              <select onchange="changeQuranJuzFilter(this.value, '${contextPrefix}')" class="glass-input px-2.5 py-1 rounded-lg bg-slate-950 text-xs min-h-[34px]">
                <option value="0" ${juzFilter === 0 ? 'selected' : ''}>نمایش یکجای تمام ۶۰۴ صفحه قرآن (ص ۱ تا ۶۰۴)</option>
                ${Array.from({ length: 30 }, (_, i) => i + 1).map(j => {
                  const sp = j === 1 ? 1 : ((j - 1) * 20 + 2);
                  const ep = j === 30 ? 604 : (j * 20 + 1);
                  return `<option value="${j}" ${juzFilter === j ? 'selected' : ''}>جزء ${j.toLocaleString('fa-IR')} (صفحه ${sp.toLocaleString('fa-IR')} تا ${ep.toLocaleString('fa-IR')})</option>`;
                }).join('')}
              </select>
            </div>
            <div class="text-[11px] font-bold ${selectedPages.length > 0 ? 'text-emerald-300' : 'text-slate-400'}">
              ${selectedPages.length > 0
                ? `✔ صفحات انتخابی شما (${selectedPages.length.toLocaleString('fa-IR')} صفحه): صفحه ${selectedPages.map(x => x.toLocaleString('fa-IR')).join('، ')}`
                : 'لطفاً حداقل یک صفحه آزاد (سبز) را از جدول زیر انتخاب کنید'}
            </div>
          </div>

          <!-- Scrollable 604-Page Quran Matrix -->
          <div class="max-h-56 overflow-y-auto p-2.5 rounded-2xl bg-slate-950/90 border border-white/15 grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            ${pageButtons.join('')}
          </div>
        </div>
      `;
    }

    function changeQuranJuzFilter(val, contextPrefix = 'wiz') {
      state.spiritualQuranJuzFilter = Number(val || 0);
      const box = document.getElementById(contextPrefix + '-quran-grid-box');
      if (box) {
        box.innerHTML = renderQuran604PagesGridHtml(contextPrefix);
      }
    }

    function toggleSelectQuranPage(pageNum, contextPrefix = 'wiz') {
      const p = Number(pageNum);
      const st = getSpiritualStatsObj();
      if (st.lockedMap[String(p)]) {
        showToast('این صفحه قبلاً توسط همسایه دیگری انتخاب و قفل شده است.', 'warning');
        return;
      }
      if (!Array.isArray(state.spiritualSelectedQuranPages)) {
        state.spiritualSelectedQuranPages = [];
      }
      const idx = state.spiritualSelectedQuranPages.indexOf(p);
      if (idx === -1) {
        state.spiritualSelectedQuranPages.push(p);
        state.spiritualSelectedQuranPages.sort((a, b) => a - b);
      } else {
        state.spiritualSelectedQuranPages.splice(idx, 1);
      }
      state.spiritualPledgeConfirmed = state.spiritualSelectedQuranPages.length > 0;
      const box = document.getElementById(contextPrefix + '-quran-grid-box');
      if (box) {
        box.innerHTML = renderQuran604PagesGridHtml(contextPrefix);
      }
      updateWizardSpiritualSummaryBanner();
    }

    function selectSpiritualMethodTab(method, contextPrefix = 'wiz') {
      state.spiritualMethod = method;
      if (method === 'salawat' || method === 'faraj') {
        state.spiritualPledgeConfirmed = true;
      } else if (method === 'quran') {
        state.spiritualPledgeConfirmed = (state.spiritualSelectedQuranPages || []).length > 0;
      }
      const container = document.getElementById(contextPrefix + '-spiritual-method-body');
      if (container) {
        container.innerHTML = renderSpiritualMethodInteractiveBody(contextPrefix);
      }
      ['salawat', 'faraj', 'quran'].forEach(m => {
        const btn = document.getElementById(contextPrefix + '-sp-tab-' + m);
        if (btn) {
          btn.className = (m === method)
            ? 'py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg transition'
            : 'py-2.5 px-3 rounded-xl font-bold text-xs glass-card text-slate-200 hover:text-amber-300 transition';
        }
      });
      updateWizardSpiritualSummaryBanner();
    }

    function setSpiritualCountValue(method, val, contextPrefix = 'wiz') {
      const num = Math.max(1, Number(val || 1));
      if (method === 'salawat') {
        state.spiritualSalawatCount = num;
        const inp = document.getElementById(contextPrefix + '-salawat-inp');
        if (inp) inp.value = String(num);
      } else if (method === 'faraj') {
        state.spiritualFarajCount = num;
        const inp = document.getElementById(contextPrefix + '-faraj-inp');
        if (inp) inp.value = String(num);
      }
      state.spiritualPledgeConfirmed = true;
      updateWizardSpiritualSummaryBanner();
    }

    function incrementSpiritualCounter(method, contextPrefix = 'wiz') {
      if (method === 'salawat') {
        setSpiritualCountValue('salawat', Number(state.spiritualSalawatCount || 14) + 1, contextPrefix);
      } else {
        setSpiritualCountValue('faraj', Number(state.spiritualFarajCount || 14) + 1, contextPrefix);
      }
    }

    function getCurrentSpiritualPledgeObject() {
      const m = state.spiritualMethod || 'salawat';
      if (m === 'salawat') {
        const cnt = Math.max(1, Number(state.spiritualSalawatCount || 14));
        return {
          method: 'salawat',
          count: cnt,
          pages: [],
          summary_label: cnt.toLocaleString('fa-IR') + ' صلوات (اللهم صل علی محمد و آل محمد و عجل فرجهم)'
        };
      }
      if (m === 'faraj') {
        const cnt = Math.max(1, Number(state.spiritualFarajCount || 14));
        return {
          method: 'faraj',
          count: cnt,
          pages: [],
          summary_label: cnt.toLocaleString('fa-IR') + ' ذکر «اللهم عجل لولیک الفرج»'
        };
      }
      const pages = Array.isArray(state.spiritualSelectedQuranPages) ? state.spiritualSelectedQuranPages.slice() : [];
      return {
        method: 'quran',
        count: pages.length,
        pages: pages,
        summary_label: 'مشارکت در ختم قرآن کریم (صفحه ' + pages.map(p => p.toLocaleString('fa-IR')).join('، ') + ')'
      };
    }

    function updateWizardSpiritualSummaryBanner() {
      const el = document.getElementById('wiz-spiritual-confirmed-badge');
      if (!el) return;
      const pledge = getCurrentSpiritualPledgeObject();
      if (pledge.method === 'quran' && pledge.pages.length === 0) {
        el.className = 'p-3 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-200 font-bold text-xs flex items-center justify-between';
        el.innerHTML = '<span>⏳ لطفاً حداقل یک صفحه آزاد از جدول ۶۰۴ صفحه‌ای قرآن کریم انتخاب نمایید.</span>';
      } else {
        el.className = 'p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-black text-xs flex items-center justify-between';
        el.innerHTML = `<span>✅ هزینه معنوی انتخابی شما: <strong class="text-amber-300">${escapeHtml(pledge.summary_label)}</strong></span><span class="text-[10px] bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-lg">آماده انتشار</span>`;
      }
    }

    function renderSpiritualMethodInteractiveBody(contextPrefix = 'wiz') {
      const method = state.spiritualMethod || 'salawat';
      if (method === 'salawat') {
        const cnt = Math.max(1, Number(state.spiritualSalawatCount || 14));
        return `
          <div class="p-4 rounded-2xl bg-slate-950/75 border border-amber-400/35 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="font-black text-amber-300 text-xs sm:text-sm">
                📿 روش اول: نذر و قرائت صلوات («اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَ آلِ مُحَمَّدٍ وَ عَجِّلْ فَرَجَهُمْ»)
              </div>
              <span class="text-[11px] text-emerald-300 font-bold">انتخاب تعداد صلوات مورد نظر</span>
            </div>

            <div class="flex flex-wrap gap-2">
              ${[1, 5, 14, 40, 72, 100, 313].map(n => `
                <button type="button" onclick="setSpiritualCountValue('salawat', ${n}, '${contextPrefix}')" class="px-3 py-1.5 rounded-xl font-black text-xs border transition ${cnt === n ? 'bg-amber-400 text-slate-950 border-amber-300 shadow' : 'bg-white/5 text-slate-200 border-white/15 hover:border-amber-400/50'}">
                  ${n.toLocaleString('fa-IR')} صلوات
                </button>
              `).join('')}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
              <div>
                <label class="block text-slate-300 font-bold mb-1 text-[11px]">تعداد صلوات دلخواه شما:</label>
                <input id="${contextPrefix}-salawat-inp" type="number" min="1" max="100000" value="${cnt}" oninput="setSpiritualCountValue('salawat', this.value, '${contextPrefix}')" class="glass-input w-full px-3 py-2 rounded-xl text-center font-black text-amber-300 text-sm dir-ltr" />
              </div>
              <div class="pt-4">
                <button type="button" onclick="incrementSpiritualCounter('salawat', '${contextPrefix}')" class="hm-salawat-counter-btn w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
                  <span>📿 شمارشگر تسبیح صلوات (+۱)</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      if (method === 'faraj') {
        const cnt = Math.max(1, Number(state.spiritualFarajCount || 14));
        return `
          <div class="p-4 rounded-2xl bg-slate-950/75 border border-emerald-400/35 space-y-3">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="font-black text-emerald-300 text-xs sm:text-sm">
                🤲 روش دوم: ذکر شریف «اللَّهُمَّ عَجِّلْ لِوَلِيِّكَ الْفَرَجَ»
              </div>
              <span class="text-[11px] text-amber-300 font-bold">انتخاب تعداد ذکر مورد نظر</span>
            </div>

            <div class="flex flex-wrap gap-2">
              ${[1, 5, 14, 40, 72, 100, 313].map(n => `
                <button type="button" onclick="setSpiritualCountValue('faraj', ${n}, '${contextPrefix}')" class="px-3 py-1.5 rounded-xl font-black text-xs border transition ${cnt === n ? 'bg-emerald-400 text-slate-950 border-emerald-300 shadow' : 'bg-white/5 text-slate-200 border-white/15 hover:border-emerald-400/50'}">
                  ${n.toLocaleString('fa-IR')} مرتبه
                </button>
              `).join('')}
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-1">
              <div>
                <label class="block text-slate-300 font-bold mb-1 text-[11px]">تعداد ذکر دلخواه شما:</label>
                <input id="${contextPrefix}-faraj-inp" type="number" min="1" max="100000" value="${cnt}" oninput="setSpiritualCountValue('faraj', this.value, '${contextPrefix}')" class="glass-input w-full px-3 py-2 rounded-xl text-center font-black text-emerald-300 text-sm dir-ltr" />
              </div>
              <div class="pt-4">
                <button type="button" onclick="incrementSpiritualCounter('faraj', '${contextPrefix}')" class="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 active:scale-95 transition">
                  <span>🤲 شمارشگر ذکر فرج (+۱)</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      return `
        <div id="${contextPrefix}-quran-grid-box">
          ${renderQuran604PagesGridHtml(contextPrefix)}
        </div>
      `;
    }

    function applyLocalSpiritualPledge(pledge, userDisplayName) {
      const st = getSpiritualStatsObj();
      const who = userDisplayName || (state.currentUser && state.currentUser.display_name) || 'همسایه هم‌عهدی';
      if (pledge.method === 'salawat') {
        state.spiritualStats.total_salawat = st.totalSalawat + Math.max(1, Number(pledge.count || 14));
      } else if (pledge.method === 'faraj') {
        state.spiritualStats.total_faraj = st.totalFaraj + Math.max(1, Number(pledge.count || 14));
      } else if (pledge.method === 'quran') {
        const pages = Array.isArray(pledge.pages) ? pledge.pages : [];
        pages.forEach(p => {
          const pKey = String(Number(p));
          if (Number(p) >= 1 && Number(p) <= 604 && !state.spiritualStats.locked_pages[pKey]) {
            state.spiritualStats.locked_pages[pKey] = who;
          }
        });
        if (Object.keys(state.spiritualStats.locked_pages).length >= 604) {
          state.spiritualStats.completed_khatms = st.completedKhatms + 1;
          state.spiritualStats.locked_pages = {};
          showToast('🎉 الحمدلله! با تکمیل ۱۰۰٪ صفحات (۶۰۴ صفحه)، یک ختم کامل قرآن کریم ثبت شد!');
        }
      }
      state.spiritualSelectedQuranPages = [];
      saveState();
    }

    function openStandaloneSpiritualKhatmModal() {
      state.spiritualPledgeConfirmed = true;
      openModal(`
        <div class="p-4 sm:p-6 space-y-4 text-xs max-h-[88vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <div>
              <h3 class="font-black text-amber-300 text-sm sm:text-base">📖 پویش ختم دسته‌جمعی قرآن کریم، صلوات و ذکر فرج بازار هم‌عهدی</h3>
              <span class="text-[11px] text-slate-300">مشارکت معنوی اهالی و غرفه‌داران شمال شرق مشهد</span>
            </div>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>

          ${renderSacredDedicationBannerHtml()}

          <div class="grid grid-cols-3 gap-2">
            <button type="button" id="std-sp-tab-salawat" onclick="selectSpiritualMethodTab('salawat', 'std')" class="py-2.5 px-3 rounded-xl font-bold text-xs ${state.spiritualMethod === 'salawat' ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg' : 'glass-card text-slate-200'}">
              ۱. صلوات
            </button>
            <button type="button" id="std-sp-tab-faraj" onclick="selectSpiritualMethodTab('faraj', 'std')" class="py-2.5 px-3 rounded-xl font-bold text-xs ${state.spiritualMethod === 'faraj' ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg' : 'glass-card text-slate-200'}">
              ۲. ذکر اللهم عجل لولیک الفرج
            </button>
            <button type="button" id="std-sp-tab-quran" onclick="selectSpiritualMethodTab('quran', 'std')" class="py-2.5 px-3 rounded-xl font-bold text-xs ${state.spiritualMethod === 'quran' ? 'bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black shadow-lg' : 'glass-card text-slate-200'}">
              ۳. ختم قرآن (۶۰۴ صفحه)
            </button>
          </div>

          <div id="std-spiritual-method-body">
            ${renderSpiritualMethodInteractiveBody('std')}
          </div>

          <div class="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
            <button type="button" onclick="closeModal()" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-300 font-bold">بستن</button>
            <button type="button" onclick="submitStandaloneSpiritualPledge()" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-950 font-black shadow-lg">
              ثبت مشارکت معنوی و هدیه ثواب ←
            </button>
          </div>
        </div>
      `);
    }

    function submitStandaloneSpiritualPledge() {
      const pledge = getCurrentSpiritualPledgeObject();
      if (pledge.method === 'quran' && pledge.pages.length === 0) {
        showToast('لطفاً ابتدا حداقل یک صفحه آزاد از ۶۰۴ صفحه قرآن کریم را انتخاب نمایید.', 'warning');
        return;
      }
      const uName = (state.currentUser && state.currentUser.display_name) ? state.currentUser.display_name : 'همسایه شمال شرق';
      applyLocalSpiritualPledge(pledge, uName);
      closeModal();
      renderCurrentPage(true);
      callServerApi('submit_spiritual_pledge', { spiritual_pledge: pledge, user_display_name: uName });
      showToast('قبول باشد! مشارکت معنوی شما (' + pledge.summary_label + ') با موفقیت ثبت شد.');
    }

    function renderSeparateMarketPage() {
      const q = (state.marketSearchQuery || '').trim().toLowerCase();
      const approvedListings = getApprovedListings();
      const approvedStories = getApprovedStories();
      const amazingListings = approvedListings.filter(l => l.is_amazing);
      const pendingCounts = getPendingCounts();

      const filtered = getFilteredSortedMarketListings(approvedListings, q);

      return `
        <div class="space-y-5">
          <!-- ===============================================================
               REQUIREMENT 5: INSTAGRAM-STYLE STORIES BAR (NO NAMES BELOW CIRCLES, RING CHANGES COLOR WHEN SEEN)
               =============================================================== -->
          <section class="glass-panel rounded-3xl p-4">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2 text-xs font-black text-white">
                <svg viewBox="0 0 24 24" class="svg-icon text-rose-400 text-sm" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                <span>استوری روزانه غرفه‌ها</span>
              </div>
<span class="text-[10px] text-slate-400 font-bold">برای افزودن استوری روی دایره + کلیک کنید</span>
            </div>
            <div class="flex items-center gap-3.5 overflow-x-auto no-scrollbar py-1">
              <!-- Add Story Circle (No text label underneath) -->
              <div onclick="openAddStoryModal()" class="flex items-center justify-center cursor-pointer shrink-0 group" title="ثبت استوری جدید">
                <div class="w-16 h-16 rounded-full border-2 border-dashed border-amber-400/60 bg-amber-500/10 flex items-center justify-center text-amber-300 text-xl group-hover:scale-105 transition">
                  <svg viewBox="0 0 24 24" class="svg-icon" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>
                </div>
              </div>

              ${approvedStories.length === 0 ? `
                <div class="text-xs text-slate-400 py-2">
                  هنوز استوری فعالی ثبت نشده است.
                </div>
              ` : approvedStories.map(st => {
                const seen = isStorySeen(st.id);
                return `
                  <div onclick="openViewStoryModal(${st.id})" class="flex items-center justify-center cursor-pointer shrink-0 group">
                    <div id="story-ring-el-${st.id}" class="w-16 h-16 rounded-full ${seen ? 'story-ring-seen' : 'story-ring'} group-hover:scale-105 transition">
                      <img src="${st.image_data}" alt="" class="w-full h-full rounded-full object-cover border-2 border-slate-950" />
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </section>

          <!-- ===============================================================
               NEIGHBORHOOD AMAZING OFFERS (Removed 'فقط شگفت‌انگیزها' button per Request 4)
               =============================================================== -->
          <section class="amazing-box-gradient rounded-3xl p-5 shadow-xl">
            <div class="flex items-center justify-between gap-3 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center text-xl font-black shadow-lg">
                  <svg viewBox="0 0 24 24" class="svg-icon" aria-hidden="true"><path d="M12 2c1.5 3.5 4 5.5 4 9a6 6 0 1 1-12 0c0-2.5 1.5-5 3-6.5 0 2 1.5 3 2.5 3-.5-2.5 1-4.5 2.5-5.5z"/></svg>
                </div>
                <div class="min-w-0">
                  <h2 class="text-xs sm:text-base font-black text-white truncate">پیشنهاد شگفت‌انگیز محله</h2>
                  <p class="text-[10px] sm:text-[11px] text-rose-200 truncate">تخفیف‌های روزانه غرفه‌داران</p>
                </div>
              </div>
              <div class="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-950/85 border border-amber-400/40 text-amber-300 font-mono font-black text-[11px] sm:text-xs dir-ltr flex items-center gap-1 shadow">
                <span>⏱️</span>
                <span id="hm-flash-deal-timer">05:42:18</span>
              </div>
            </div>

            ${amazingListings.length === 0 ? `
              <div class="bg-slate-950/60 border border-rose-400/25 rounded-2xl p-4 text-center text-xs text-rose-100">
                در حال حاضر پیشنهاد شگفت‌انگیزی ثبت نشده است. غرفه‌داران می‌توانند هنگام ثبت آگهی یا از داخل غرفه خود، درخواست درج در «پیشنهاد شگفت‌انگیز محله» را ارسال کنند.
              </div>
            ` : `
              <div class="hm-amazing-marquee-viewport">
                <div class="hm-amazing-marquee-track">
                  ${[...amazingListings, ...amazingListings].map(item => `
                    <div onclick="openListingDetailModal(${item.id})" class="hm-amazing-loop-card bg-slate-950/90 hover:bg-slate-950 border border-rose-400/40 rounded-2xl p-3 cursor-pointer transition flex items-center gap-3 shadow-lg">
                      <img src="${item.image_data}" alt="${escapeHtml(item.title)}" class="w-16 h-16 rounded-xl object-cover shrink-0 border border-amber-400/30" />
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center justify-between gap-1 mb-1">
                          <span class="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">⚡ ${item.discount_percent || 15}٪ تخفیف</span>
                          <span class="text-[10px] text-amber-300 truncate max-w-[115px]">${escapeHtml(item.booth_title)}</span>
                        </div>
                        <div class="font-black text-white text-xs truncate mb-1">${escapeHtml(item.title)}</div>
                        <div class="flex items-center justify-between gap-2">
                          ${item.old_price > item.price ? `<span class="text-[10px] text-slate-400 line-through">${formatPrice(item.old_price)}</span>` : '<span></span>'}
                          <span class="font-black text-emerald-300 text-xs">${formatPrice(item.price)} ${escapeHtml(item.price_unit)}</span>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `}
          </section>

          <!-- میثاق معنوی طبق دستور کارفرما از داخل بازار خارج شد و به فوتر صفحه اصلی منتقل گردید -->

          <!-- Main Market Grid: Divar Sidebar Filters + Listings Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <aside class="hidden lg:block lg:col-span-3 space-y-4">
              <!-- Divar-Style Comprehensive Categories + Subcategories Sidebar -->
              <div class="glass-panel rounded-3xl p-4 space-y-1">
                <h2 class="font-black text-xs sm:text-sm text-white border-b border-white/10 pb-2.5 mb-2 flex items-center justify-between">
                  <span class="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" class="svg-icon text-amber-400" aria-hidden="true"><path d="M4 6h16M4 12h12M8 18h12"/></svg>
                    <span>دسته‌ها</span>
                  </span>
                  <button type="button" onclick="toggleCategoriesMegaMenu(true)" class="text-[10px] text-amber-300 hover:underline font-bold">مگامنو ⌄</button>
                </h2>
                <button type="button" onclick="selectMegaMenuCategory('all', 'all')" class="w-full text-right px-3 py-2 rounded-xl text-xs font-bold transition flex justify-between ${state.marketCategoryFilter === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:bg-white/10'}">
                  <span>همه آگهی‌ها</span>
                  <span>(${approvedListings.length})</span>
                </button>
                ${MARKET_CATEGORIES.map(c => {
                  const cnt = approvedListings.filter(l => l.category === c.id).length;
                  const active = state.marketCategoryFilter === c.id;
                  const subcats = Array.isArray(c.subcategories) ? c.subcategories : [];
                  return `
                    <div class="space-y-1">
                      <button type="button" onclick="selectMegaMenuCategory('${c.id}', 'all')" class="w-full text-right px-3 py-2 rounded-xl text-xs font-semibold transition flex justify-between ${active ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-300 hover:bg-white/10'}">
                        <span class="truncate"><i class="fa-solid ${c.icon} ml-1.5"></i>${escapeHtml(c.title)}</span>
                        <span>${cnt > 0 ? '(' + cnt + ')' : '‹'}</span>
                      </button>
                      ${active && subcats.length > 0 ? `
                        <div class="pr-3 mr-2 border-r border-amber-400/40 space-y-0.5 py-1">
                          ${subcats.map(sub => {
                            const subActive = state.marketSubcategoryFilter === sub;
                            return `
                              <button type="button" onclick="selectMegaMenuCategory('${c.id}', '${escapeHtml(sub)}')" class="w-full text-right px-2.5 py-1.5 rounded-lg text-[11px] transition block truncate ${subActive ? 'bg-amber-400/25 text-amber-300 font-black border border-amber-400/40' : 'text-slate-400 hover:text-white hover:bg-white/5'}">
                                • ${escapeHtml(sub)}
                              </button>
                            `;
                          }).join('')}
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>

              <!-- Sub-Neighborhood (Alley) & Urgent Filter -->
              <div class="glass-panel rounded-3xl p-4 space-y-3 text-xs">
                <h3 class="font-black text-white border-b border-white/10 pb-2">فیلتر محدوده در شمال شرق</h3>
                <select onchange="state.marketAlleyFilter=this.value; renderCurrentPage();" class="glass-input w-full px-3 py-2 rounded-xl bg-slate-900 text-xs">
                  <option value="all">همه کوچه‌های شمال شرق</option>
                  ${TABARSI_ALLEYS.slice(1).map(a => `<option value="${escapeHtml(a)}" ${state.marketAlleyFilter === a ? 'selected' : ''}>${escapeHtml(a)}</option>`).join('')}
                </select>
                <label class="flex items-center gap-2 text-slate-200 cursor-pointer pt-1">
                  <input type="checkbox" ${state.marketOnlyUrgent ? 'checked' : ''} onchange="state.marketOnlyUrgent=this.checked; renderCurrentPage();" class="rounded accent-rose-500" />
                  <span>فقط نمایش آگهی‌های «فوری»</span>
                </label>
              </div>
            </aside>

            <!-- Listings Content Column -->
            <div class="lg:col-span-9 space-y-4">
              <!-- Mobile Horizontal Quick Category Chips -->
              <div class="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                <button type="button" onclick="selectMegaMenuCategory('all', 'all')" class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition ${state.marketCategoryFilter === 'all' ? 'bg-amber-400 text-slate-950 font-black' : 'glass-card text-slate-200'}">
                  همه (${approvedListings.length})
                </button>
                ${MARKET_CATEGORIES.map(c => {
                  const active = state.marketCategoryFilter === c.id;
                  return `<button type="button" onclick="selectMegaMenuCategory('${c.id}', 'all')" class="shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition ${active ? 'bg-amber-400 text-slate-950 font-black' : 'glass-card text-slate-200'}"><i class="fa-solid ${c.icon} ml-1"></i>${escapeHtml(c.title)}</button>`;
                }).join('')}
              </div>

              <!-- Divar-Style Top Bar: Mega-Menu 'دسته‌ها ⌄' Button + Search Input + Filter Button -->
              <div class="relative">
                <div class="glass-panel rounded-2xl p-2.5 space-y-2 sm:space-y-0 sm:flex sm:items-center sm:gap-2">
                  <div class="flex items-center gap-2 flex-1 min-w-0">
                    <button type="button" onclick="toggleCategoriesMegaMenu()" class="shrink-0 px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/15 text-white font-black text-xs flex items-center gap-1 transition shadow">
                      <span>دسته‌ها</span>
                      <span class="text-[10px] text-amber-300">⌄</span>
                    </button>

                    <div class="relative flex-1 min-w-0">
                      <svg viewBox="0 0 24 24" class="svg-icon absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
                      <input id="market-search-input" type="search" value="${escapeHtml(state.marketSearchQuery)}" oninput="handleMarketSearchInput(this.value)" placeholder="جستجو در آگهی‌های بازار..." class="glass-input w-full pr-8 pl-3 py-2 rounded-xl text-xs" />
                    </div>
                  </div>

                  <div class="grid grid-cols-3 sm:flex items-center gap-1.5 shrink-0">
                    <button type="button" onclick="state.marketOnlyBookmarked = !state.marketOnlyBookmarked; renderCurrentPage();" class="px-2.5 py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition ${state.marketOnlyBookmarked ? 'bg-amber-400 text-slate-950 border-amber-400 font-black' : 'bg-white/5 text-slate-200 border-white/15 hover:border-amber-400/40'}">
                      <span>🔖 نشان‌ها</span>
                    </button>

                    <button type="button" onclick="openMarketFilterBottomSheet()" class="px-2.5 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 font-bold text-[11px] flex items-center justify-center gap-1">
                      <svg viewBox="0 0 24 24" class="svg-icon text-amber-300 w-3.5 h-3.5" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
                      <span>فیلتر</span>
                    </button>
                  </div>
                </div>

                ${state.marketCategoryFilter !== 'all' || (state.marketSubcategoryFilter && state.marketSubcategoryFilter !== 'all') ? `
                  <div class="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span class="text-slate-400 text-[11px]">فیلتر فعال:</span>
                    ${state.marketCategoryFilter !== 'all' ? `
                      <span class="px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold flex items-center gap-1.5">
                        <span>${escapeHtml((MARKET_CATEGORIES.find(c => c.id === state.marketCategoryFilter) || {}).title || state.marketCategoryFilter)}</span>
                        ${state.marketSubcategoryFilter && state.marketSubcategoryFilter !== 'all' ? `<span>• ${escapeHtml(state.marketSubcategoryFilter)}</span>` : ''}
                        <button type="button" onclick="selectMegaMenuCategory('all', 'all')" class="text-rose-300 hover:text-white font-black mr-1">✕</button>
                      </span>
                    ` : ''}
                  </div>
                ` : ''}

                <!-- Mega-Menu Dropdown Container -->
                <div id="market-categories-megamenu-wrap" class="${state.categoriesMegaMenuOpen ? '' : 'hidden'}">
                  ${state.categoriesMegaMenuOpen ? renderDivarMegaMenuInnerHtml() : ''}
                </div>
              </div>

              <div id="market-listings-results-area">
                ${renderMarketListingsGridHtml(filtered)}
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // REQUIREMENT 3: ADD & VIEW BUSINESS STORIES
    // =========================================================================
    function openAddStoryModal() {
      if (!requireApprovedBooth('ثبت استوری تصویری کسب‌وکار')) return;
      openModal(`
        <div class="p-6 space-y-4 text-xs max-w-md mx-auto">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-white text-base">📸 ثبت استوری تصویری (عمودی) برای «${escapeHtml(state.currentUser.booth_title || state.currentUser.display_name)}»</h3>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>
          <p class="text-slate-300 leading-relaxed">
            استوری‌های کسب‌وکار در هم‌عهدی همانند اینستاگرام <strong>کاملاً تصویری و عمودی (۵ ثانیه‌ای)</strong> هستند و به مدت ۴۸ ساعت در بالای بازار محله نمایش داده می‌شوند.
          </p>
          <form onsubmit="submitNewStory(event)" class="space-y-4">
            <div class="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/40 space-y-2 text-center">
              <label class="block font-black text-amber-300 text-sm cursor-pointer">
                انتخاب تصویر استوری (ترجیحاً عمودی) *
              </label>
              <input id="st-image" type="file" accept="image/*" required class="glass-input w-full px-3 py-2 rounded-xl" />
            </div>
            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-black shadow-lg">
              انتشار استوری تصویری غرفه
            </button>
          </form>
        </div>
      `);
    }

    function submitNewStory(e) {
      e.preventDefault();
      if (!requireApprovedBooth('ثبت استوری')) return;
      const fileInp = document.getElementById('st-image');
      if (!fileInp || !fileInp.files || !fileInp.files[0]) return;
      readImageFileAsDataUrl(fileInp, 960, function(dataUrl) {
        if (!dataUrl) return;
        const initialStatus = 'approved';
        const nowSec = Math.floor(Date.now() / 1000);
        const stObj = {
          id: Date.now(),
          owner_username: state.currentUser.username,
          booth_title: state.currentUser.booth_title || ('غرفه ' + state.currentUser.display_name),
          caption: 'استوری تصویری ' + (state.currentUser.booth_title || state.currentUser.display_name),
          image_data: dataUrl,
          status: initialStatus,
          created_ts: nowSec,
          expires_at: nowSec + (48 * 3600)
        };
        state.stories.unshift(stObj);
        closeModal();
        saveState();
        renderCurrentPage();
        callServerApi('add_story', stObj);
        showToast(initialStatus === 'approved' ? 'استوری تصویری منتشر شد.' : 'استوری تصویری ثبت شد و پس از تایید ادمین نمایش داده می‌شود.', 'warning');
      });
    }

    function openViewStoryModal(storyId) {
      if (storyAutoAdvanceTimer) {
        clearTimeout(storyAutoAdvanceTimer);
        storyAutoAdvanceTimer = null;
      }
      const list = getApprovedStories();
      const idx = list.findIndex(s => Number(s.id) === Number(storyId));
      if (idx === -1) return;
      const st = list[idx];
      markStoryAsSeen(st.id);
      const ringEl = document.getElementById('story-ring-el-' + st.id);
      if (ringEl) {
        ringEl.classList.remove('story-ring');
        ringEl.classList.add('story-ring-seen');
      }
      const ownerObj = (state.users && state.users[st.owner_username]) ? state.users[st.owner_username] : null;
      const ownerDisplayName = ownerObj ? (ownerObj.display_name || st.booth_title) : (st.booth_title || st.owner_username || 'کاربر');
      const ownerAvatar = (ownerObj && ownerObj.booth_logo) ? ownerObj.booth_logo : st.image_data;
      const liked = typeof hasUserLikedStory === 'function' ? hasUserLikedStory(st.id) : false;

      openModal(`
        <div class="insta-story-fullscreen-stage">
          <!-- Full-Screen Story Image Covering Entire Viewport -->
          <img src="${st.image_data}" alt="" class="hm-story-full-bg-blur" aria-hidden="true" />
          <img src="${st.image_data}" alt="" class="hm-story-full-cover-img" />

          <!-- Top Bar: Progress Segments + Top-Right Avatar & Name ONLY + Top-Left Close -->
          <div class="hm-story-top-bar">
            <div class="insta-progress-row mb-3">
              ${list.map((item, i) => `
                <div class="insta-progress-seg">
                  <div class="insta-progress-fill ${i < idx ? 'done' : (i === idx ? 'active' : '')}"></div>
                </div>
              `).join('')}
            </div>

            <div class="flex items-center justify-between">
              <!-- بالا سمت راست: فقط عکس پروفایل و نام طرف -->
              <div onclick="closeModal(); openBoothPage('${escapeHtml(st.owner_username)}')" class="flex items-center gap-2.5 cursor-pointer">
                <div class="w-10 h-10 rounded-full ig-story-ring p-0.5 bg-black shrink-0">
                  <img src="${ownerAvatar}" alt="" class="w-full h-full rounded-full object-cover" onerror="this.src='./icon-512.png'" />
                </div>
                <span class="font-black text-white text-xs sm:text-sm drop-shadow">${escapeHtml(ownerDisplayName)}</span>
              </div>

              <!-- دکمه بستن در سمت چپ بالا -->
              <button type="button" onclick="closeModal()" class="w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white font-bold text-sm flex items-center justify-center">✕</button>
            </div>
          </div>

          <!-- Tap Zones for Prev / Next Story -->
          <div class="hm-story-tap-zones">
            <div onclick="stepInstaStory(${idx - 1})" class="h-full cursor-pointer"></div>
            <div onclick="stepInstaStory(${idx + 1})" class="h-full cursor-pointer"></div>
          </div>

          <!-- Bottom Bar: Bottom-Right Like + Reply to Story ONLY -->
          <div class="hm-story-bottom-bar" onclick="event.stopPropagation()">
            <!-- پایین راست: دکمه لایک استوری -->
            <button type="button" id="story-like-btn-${Number(st.id)}" onclick="toggleStoryLikeAction(${Number(st.id)})"
              class="w-11 h-11 rounded-full bg-black/55 border border-white/25 flex items-center justify-center text-xl shrink-0 transition transform active:scale-125">
              ${liked ? '❤️' : '🤍'}
            </button>

            <!-- کادر ریپلای استوری -->
            <form onsubmit="submitStoryReplyAction(event, '${escapeHtml(st.owner_username)}', '${escapeHtml(ownerDisplayName)}')" class="flex-1 flex items-center gap-2 bg-black/55 backdrop-blur-md border border-white/25 rounded-full px-4 py-1.5">
              <input id="story-reply-inp" type="text" required placeholder="پاسخ به استوری..."
                onfocus="if(storyAutoAdvanceTimer){clearTimeout(storyAutoAdvanceTimer);storyAutoAdvanceTimer=null;}"
                class="bg-transparent border-0 outline-none text-white text-xs flex-1 py-1.5 placeholder:text-slate-300" />
              <button type="submit" class="text-amber-400 font-black text-xs px-2 py-1 hover:text-amber-300 shrink-0">ارسال</button>
            </form>
          </div>
        </div>
      `);

      storyAutoAdvanceTimer = setTimeout(() => {
        stepInstaStory(idx + 1);
      }, 6000);
    }

    function stepInstaStory(targetIdx) {
      if (storyAutoAdvanceTimer) {
        clearTimeout(storyAutoAdvanceTimer);
        storyAutoAdvanceTimer = null;
      }
      const list = getApprovedStories();
      if (targetIdx < 0) {
        openViewStoryModal(list[0].id);
        return;
      }
      if (targetIdx >= list.length) {
        closeModal();
        return;
      }
      openViewStoryModal(list[targetIdx].id);
    }

    // =========================================================================
    // REQUIREMENT 1, 2, 4, 5, 8, 10: ADD MARKET LISTING MODAL WITH DYNAMIC CATEGORY FIELDS
    // =========================================================================
    function renderDynamicCategoryInputs(catId) {
      const catObj = MARKET_CATEGORIES.find(c => c.id === catId) || MARKET_CATEGORIES[0];
      return catObj.dynamicFields.map((f, idx) => `
        <div>
          <label class="block font-bold text-cyan-300 mb-1">${escapeHtml(f.key)} *</label>
          <input data-spec-key="${escapeHtml(f.key)}" id="dyn-spec-${idx}" type="text" required placeholder="${escapeHtml(f.placeholder)}" class="glass-input w-full px-3 py-2 rounded-xl text-xs" />
        </div>
      `).join('');
    }

    function renderSubcategoryOptionsHtml(catId) {
      const catObj = MARKET_CATEGORIES.find(c => c.id === catId) || MARKET_CATEGORIES[0];
      const subs = Array.isArray(catObj.subcategories) ? catObj.subcategories : [];
      return subs.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
    }

    function handleCategorySelectChange(newCatId) {
      const container = document.getElementById('dynamic-category-fields-box');
      if (container) {
        container.innerHTML = renderDynamicCategoryInputs(newCatId);
      }
      const subSelect = document.getElementById('ml-subcat');
      if (subSelect) {
        subSelect.innerHTML = renderSubcategoryOptionsHtml(newCatId);
      }
    }

    function saveListingDraft() {
      try {
        const draft = {
          title: (document.getElementById('ml-title') || {}).value || '',
          cat: (document.getElementById('ml-cat') || {}).value || 'food',
          price: (document.getElementById('ml-price') || {}).value || '0',
          oldPrice: (document.getElementById('ml-old-price') || {}).value || '0',
          desc: (document.getElementById('ml-desc') || {}).value || ''
        };
        localStorage.setItem('hamahdi_listing_draft_v6', JSON.stringify(draft));
      } catch (e) {}
    }

    function getSavedListingDraft() {
      try {
        const raw = localStorage.getItem('hamahdi_listing_draft_v6');
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    }

    function clearListingDraft() {
      try { localStorage.removeItem('hamahdi_listing_draft_v6'); } catch (e) {}
    }

    function switchAdWizardStep(stepNum) {
      state.adWizardStep = stepNum;
      [1, 2, 3, 4].forEach(s => {
        const panel = document.getElementById('ad-wizard-step-' + s);
        const pill = document.getElementById('ad-wizard-pill-' + s);
        if (panel) {
          if (s === stepNum || stepNum === 0) panel.classList.remove('hidden');
          else panel.classList.add('hidden');
        }
        if (pill) {
          pill.className = 'wizard-step-pill cursor-pointer ' + (s === stepNum ? 'active' : (s < stepNum ? 'done' : ''));
        }
      });
      if (stepNum === 4 || stepNum === 0) {
        updateWizardSpiritualSummaryBanner();
      }
    }

    function previewWizardImageSelection(inputEl) {
      readImageFileAsDataUrl(inputEl, 850, function(dataUrl) {
        const prevBox = document.getElementById('ml-image-preview-box');
        const prevImg = document.getElementById('ml-image-preview-img');
        if (dataUrl && prevBox && prevImg) {
          prevImg.src = dataUrl;
          prevBox.classList.remove('hidden');
        }
      });
    }

    function openAddMarketListingModal() {
      if (!requireApprovedBooth('ثبت آگهی در بازار مردمی')) return;
      const draft = getSavedListingDraft() || {};
      const initCat = draft.cat || 'food';
      state.adWizardStep = 1;
      state.spiritualMethod = state.spiritualMethod || 'salawat';
      state.spiritualSalawatCount = state.spiritualSalawatCount || 14;
      state.spiritualFarajCount = state.spiritualFarajCount || 14;
      state.spiritualSelectedQuranPages = [];
      state.spiritualPledgeConfirmed = true;

      openModal(`
        <div class="p-4 sm:p-6 max-h-[88vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
            <div>
              <span class="text-[11px] text-amber-300 font-bold block">ثبت در غرفه: ${escapeHtml(state.currentUser.booth_title || ('غرفه ' + state.currentUser.display_name))}</span>
              <h3 class="font-black text-white text-sm sm:text-base">ثبت آگهی در بازار مردمی (با پرداخت هزینه معنوی • بدون هزینه مالی)</h3>
            </div>
            <div class="flex items-center gap-2">
              <button type="button" onclick="switchAdWizardStep(0)" class="text-[10px] px-2.5 py-1 rounded-lg bg-white/10 text-cyan-200 font-bold">نمایش یکجا</button>
              <button type="button" onclick="closeModal()" class="w-9 h-9 rounded-xl bg-white/10 text-slate-300 hover:text-white font-bold flex items-center justify-center">✕</button>
            </div>
          </div>

          <!-- 4-Step Wizard Bar (Including Step 4: Spiritual Cost) -->
          <div class="wizard-steps-bar wizard-steps-4">
            <div id="ad-wizard-pill-1" onclick="switchAdWizardStep(1)" class="wizard-step-pill active cursor-pointer">۱. دسته و تصویر</div>
            <div id="ad-wizard-pill-2" onclick="switchAdWizardStep(2)" class="wizard-step-pill cursor-pointer">۲. قیمت و مشخصات</div>
            <div id="ad-wizard-pill-3" onclick="switchAdWizardStep(3)" class="wizard-step-pill cursor-pointer">۳. محدوده و توضیحات</div>
            <div id="ad-wizard-pill-4" onclick="switchAdWizardStep(4)" class="wizard-step-pill cursor-pointer">۴. هزینه معنوی و انتشار</div>
          </div>

          <form onsubmit="submitNewMarketListing(event)" oninput="saveListingDraft()" class="space-y-3.5 text-xs">
            <!-- STEP 1: Category, Subcategory, Title & WebP Image -->
            <div id="ad-wizard-step-1" class="space-y-3.5">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="sm:col-span-1">
                  <label class="block font-bold text-amber-300 mb-1">۱. دسته‌بندی اصلی *</label>
                  <select id="ml-cat" onchange="handleCategorySelectChange(this.value)" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    ${MARKET_CATEGORIES.map(c => `<option value="${c.id}" ${c.id === initCat ? 'selected' : ''}>${escapeHtml(c.title)}</option>`).join('')}
                  </select>
                </div>
                <div class="sm:col-span-1">
                  <label class="block font-bold text-cyan-300 mb-1">۲. زیردسته تخصصی *</label>
                  <select id="ml-subcat" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    ${renderSubcategoryOptionsHtml(initCat)}
                  </select>
                </div>
                <div class="sm:col-span-1">
                  <label class="block font-bold text-slate-300 mb-1">۳. عنوان آگهی *</label>
                  <input id="ml-title" type="text" required value="${escapeHtml(draft.title || '')}" placeholder="مثلاً: عسل طبیعی یا تعمیر پکیج" class="glass-input w-full px-3 py-2.5 rounded-xl" />
                </div>
              </div>

              <!-- Single Mandatory Image with Automatic WebP Compression -->
              <div class="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/40 space-y-2">
                <label class="block font-black text-amber-300">
                  <svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>یک تصویر واضح از کالا یا خدمت (فشرده‌سازی خودکار WebP) *
                </label>
                <input id="ml-image" type="file" accept="image/*" required onchange="previewWizardImageSelection(this)" class="glass-input w-full px-3 py-2 rounded-xl" />
                <div id="webp-compress-badge" class="hidden text-[11px] font-bold text-emerald-300"></div>
                <div id="ml-image-preview-box" class="hidden pt-1">
                  <img id="ml-image-preview-img" src="" alt="پیش‌نمایش تصویر" class="w-28 h-24 object-cover rounded-xl border border-amber-400/50" />
                </div>
              </div>

              <div class="flex justify-end pt-1">
                <button type="button" onclick="switchAdWizardStep(2)" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black">
                  مرحله بعد: قیمت و مشخصات ←
                </button>
              </div>
            </div>

            <!-- STEP 2: Dynamic Specs, Price & Condition Badges -->
            <div id="ad-wizard-step-2" class="hidden space-y-3.5">
              <div class="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-400/30 space-y-2.5">
                <div class="font-black text-cyan-300 text-xs flex items-center gap-1.5">
                  <svg viewBox="0 0 24 24" class="svg-icon " aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/></svg>
                  <span>مشخصات تخصصی این دسته‌بندی (پویا):</span>
                </div>
                <div id="dynamic-category-fields-box" class="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  ${renderDynamicCategoryInputs(initCat)}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block font-bold text-slate-300 mb-1">قیمت نهایی (تومان) *</label>
                  <input id="ml-price" type="number" required value="${escapeHtml(draft.price || '0')}" min="0" class="glass-input w-full px-3 py-2.5 rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-400 mb-1">قیمت قبل از تخفیف (اختیاری)</label>
                  <input id="ml-old-price" type="number" value="${escapeHtml(draft.oldPrice || '0')}" min="0" placeholder="مثلاً 500000" class="glass-input w-full px-3 py-2.5 rounded-xl" />
                </div>
                <div>
                  <label class="block font-bold text-slate-300 mb-1">نوع معامله</label>
                  <select id="ml-unit" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    <option value="تومان">تومان (فروش نقدی)</option>
                    <option value="توافقی (قابل چانه‌زنی)">توافقی (قابل چانه‌زنی)</option>
                    <option value="معاوضه / همیاری">معاوضه / همیاری رایگان</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-300 mb-1">نشان وضعیت کالا / خدمت روی کارت *</label>
                  <select id="ml-cond-badge" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    <option value="نو / تولید تازه خانگی">نو / تولید تازه خانگی</option>
                    <option value="در حد نو (سالم)">در حد نو (سالم)</option>
                    <option value="کارکرده / دست‌دوم">کارکرده / دست‌دوم</option>
                    <option value="ارائه خدمت تخصصی در محل">ارائه خدمت تخصصی در محل</option>
                    <option value="قابل معاوضه با کالای همسایه">قابل معاوضه با کالای همسایه</option>
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-300 mb-1">نشان نحوه تحویل در محله *</label>
                  <select id="ml-deliv-badge" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    <option value="تحویل حضوری در شمال شرق">تحویل حضوری در شمال شرق</option>
                    <option value="ارسال رایگان در محدوده محله">ارسال رایگان در محدوده محله</option>
                    <option value="ارسال با پیک محلی">ارسال با پیک محلی</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <button type="button" onclick="switchAdWizardStep(1)" class="px-4 py-2.5 rounded-xl bg-white/10 text-slate-200 font-bold">
                  → مرحله قبل
                </button>
                <button type="button" onclick="switchAdWizardStep(3)" class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 font-black">
                  مرحله بعد: محدوده و توضیحات ←
                </button>
              </div>
            </div>

            <!-- STEP 3: Alley, Phone, Description & Upgrade Requests -->
            <div id="ad-wizard-step-3" class="hidden space-y-3.5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block font-bold text-slate-300 mb-1">محدوده در شمال شرق *</label>
                  <select id="ml-addr" class="glass-input w-full px-3 py-2.5 rounded-xl bg-slate-900">
                    ${TABARSI_ALLEYS.slice(1).map(a => `<option value="${escapeHtml(a)}">${escapeHtml(a)}</option>`).join('')}
                  </select>
                </div>
                <div>
                  <label class="block font-bold text-slate-300 mb-1">شماره تماس هماهنگی *</label>
                  <input id="ml-phone" type="text" required value="${escapeHtml(state.currentUser.phone || '')}" placeholder="0915..." class="glass-input w-full px-3 py-2.5 rounded-xl dir-ltr text-left" />
                </div>
              </div>

              <div>
                <label class="block font-bold text-slate-300 mb-1">توضیحات کامل *</label>
                <textarea id="ml-desc" rows="3" required placeholder="توضیحات کامل درباره کیفیت، شرایط چانه‌زنی یا معاوضه...">${escapeHtml(draft.desc || '')}</textarea>
              </div>

              <div class="p-3.5 rounded-2xl bg-white/5 border border-white/15 space-y-2">
                <div class="font-bold text-amber-300 text-xs">درخواست ارتقای رایگان آگهی (پس از تایید ادمین اعمال می‌شود):</div>
                <div class="flex flex-wrap gap-4">
                  <label class="inline-flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input id="ml-req-ladder" type="checkbox" class="rounded accent-purple-500" />
                    <span>🚀 درخواست «نردبان» (انتقال به صدر بازار)</span>
                  </label>
                  <label class="inline-flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input id="ml-req-urgent" type="checkbox" class="rounded accent-rose-500" />
                    <span>🔥 درخواست نشان «فوری»</span>
                  </label>
                  <label class="inline-flex items-center gap-2 text-slate-200 cursor-pointer">
                    <input id="ml-req-amazing" type="checkbox" class="rounded accent-amber-400" />
                    <span>⚡ درخواست درج در «پیشنهاد شگفت‌انگیز محله»</span>
                  </label>
                </div>
              </div>

              <div class="flex items-center justify-between gap-3 pt-1">
                <button type="button" onclick="switchAdWizardStep(2)" class="px-4 py-3 rounded-xl bg-white/10 text-slate-200 font-bold shrink-0">
                  → مرحله قبل
                </button>
                <button type="button" onclick="switchAdWizardStep(4)" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg">
                  مرحله آخر: پرداخت هزینه معنوی و انتشار آگهی ←
                </button>
              </div>
            </div>

            <!-- STEP 4: MANDATORY SPIRITUAL COST BEFORE PUBLISHING (شرط انتشار آگهی: پرداخت هزینه معنوی) -->
            <div id="ad-wizard-step-4" class="hidden space-y-3.5">
              ${renderSacredDedicationBannerHtml()}

              <div class="space-y-2">
                <div class="font-black text-white text-xs sm:text-sm">
                  یکی از ۳ روش زیر را جهت پرداخت هزینه معنوی انتشار آگهی انتخاب و ثبت نمایید:
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button type="button" id="wiz-sp-tab-salawat" onclick="selectSpiritualMethodTab('salawat', 'wiz')" class="py-2.5 px-3 rounded-xl font-black text-xs bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 shadow-lg transition">
                    ۱. صلوات (تعداد دلخواه)
                  </button>
                  <button type="button" id="wiz-sp-tab-faraj" onclick="selectSpiritualMethodTab('faraj', 'wiz')" class="py-2.5 px-3 rounded-xl font-bold text-xs glass-card text-slate-200 hover:text-amber-300 transition">
                    ۲. ذکر «اللهم عجل لولیک الفرج»
                  </button>
                  <button type="button" id="wiz-sp-tab-quran" onclick="selectSpiritualMethodTab('quran', 'wiz')" class="py-2.5 px-3 rounded-xl font-bold text-xs glass-card text-slate-200 hover:text-amber-300 transition">
                    ۳. مشارکت در ختم قرآن (۶۰۴ صفحه)
                  </button>
                </div>
              </div>

              <div id="wiz-spiritual-method-body">
                ${renderSpiritualMethodInteractiveBody('wiz')}
              </div>

              <div id="wiz-spiritual-confirmed-badge" class="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 font-black text-xs flex items-center justify-between">
                <span>✅ هزینه معنوی انتخابی شما آماده ثبت است.</span>
              </div>

              <div class="flex items-center justify-between gap-3 pt-1">
                <button type="button" onclick="switchAdWizardStep(3)" class="px-4 py-3 rounded-xl bg-white/10 text-slate-200 font-bold shrink-0">
                  → مرحله قبل
                </button>
                <button type="submit" class="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-emerald-400 to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:opacity-95 transition">
                  📿 ثبت هزینه معنوی و انتشار نهایی آگهی در بازار
                </button>
              </div>
            </div>
          </form>
        </div>
      `);
      // Make sure textarea #ml-desc has glass-input styling
      const descEl = document.getElementById('ml-desc');
      if (descEl) descEl.className = 'glass-input w-full px-3 py-2 rounded-xl';
      updateWizardSpiritualSummaryBanner();
    }

    function submitNewMarketListing(e) {
      e.preventDefault();
      if (!requireApprovedBooth('ثبت آگهی')) return;
      const fileInp = document.getElementById('ml-image');
      if (!fileInp || !fileInp.files || !fileInp.files[0]) {
        switchAdWizardStep(1);
        showToast('انتخاب یک تصویر برای آگهی در گام اول الزامی است.', 'error');
        return;
      }

      // Enforce Step 4 Spiritual Cost before publishing
      if (state.adWizardStep !== 4 && state.adWizardStep !== 0) {
        switchAdWizardStep(4);
        showToast('لطفاً پیش از انتشار نهایی، در این گام هزینه معنوی آگهی (صلوات، ذکر فرج یا صفحه قرآن) را ثبت نمایید.', 'warning');
        return;
      }

      const pledge = getCurrentSpiritualPledgeObject();
      if (pledge.method === 'quran' && (!pledge.pages || pledge.pages.length === 0)) {
        switchAdWizardStep(4);
        showToast('برای مشارکت در ختم قرآن، لطفاً حداقل یک صفحه آزاد (سبز) را از جدول ۶۰۴ صفحه انتخاب کنید.', 'error');
        return;
      }

      const title = document.getElementById('ml-title').value.trim();
      const cat = document.getElementById('ml-cat').value;
      const subcatEl = document.getElementById('ml-subcat');
      const subcat = subcatEl ? subcatEl.value.trim() : '';
      const price = Number(document.getElementById('ml-price').value || 0);
      const oldPrice = Number(document.getElementById('ml-old-price').value || 0);
      const discPct = (oldPrice > price && price > 0) ? Math.round(((oldPrice - price) / oldPrice) * 100) : 15;
      const unit = document.getElementById('ml-unit').value;
      const condBadge = document.getElementById('ml-cond-badge').value;
      const delivBadge = document.getElementById('ml-deliv-badge').value;
      const phone = document.getElementById('ml-phone').value.trim();
      const addr = document.getElementById('ml-addr').value;
      const desc = document.getElementById('ml-desc').value.trim();

      const reqLadder = document.getElementById('ml-req-ladder').checked;
      const reqUrgent = document.getElementById('ml-req-urgent').checked;
      const reqAmazing = document.getElementById('ml-req-amazing').checked;

      // Collect dynamic category specs + subcategory + spiritual pledge
      const specs = {};
      if (subcat) {
        specs['زیردسته تخصصی'] = subcat;
      }
      document.querySelectorAll('#dynamic-category-fields-box input[data-spec-key]').forEach(inp => {
        specs[inp.getAttribute('data-spec-key')] = inp.value.trim();
      });
      specs['هزینه معنوی ثبت‌شده'] = pledge.summary_label;

      readImageFileAsDataUrl(fileInp, 800, function(dataUrl) {
        if (!dataUrl) return;
        const adminNow = isAdmin();
        applyLocalSpiritualPledge(pledge, state.currentUser.display_name);

        const newListingObj = {
          id: Date.now(),
          seller_username: state.currentUser.username,
          seller_name: state.currentUser.display_name,
          booth_title: state.currentUser.booth_title || ('غرفه ' + state.currentUser.display_name),
          seller_phone: phone,
          category: cat,
          subcategory: subcat,
          title: title,
          description: desc,
          price: price,
          old_price: oldPrice,
          discount_percent: discPct,
          price_unit: unit,
          condition_badge: condBadge,
          delivery_badge: delivBadge,
          specs: specs,
          spiritual_pledge: pledge,
          address_detail: addr,
          image_data: dataUrl,
          is_amazing: adminNow && reqAmazing,
          amazing_status: reqAmazing ? (adminNow ? 'approved' : 'pending') : 'none',
          is_urgent: adminNow && reqUrgent,
          urgent_status: reqUrgent ? (adminNow ? 'approved' : 'pending') : 'none',
          ladder_status: reqLadder ? (adminNow ? 'approved' : 'pending') : 'none',
          laddered_at: (adminNow && reqLadder) ? Date.now() : 0,
          status: 'approved',
          request_amazing: reqAmazing,
          request_urgent: reqUrgent,
          request_ladder: reqLadder,
          messages: []
        };
        clearListingDraft();
        state.listings.unshift(newListingObj);
        closeModal();
        saveState();
        renderCurrentPage();
        callServerApi('add_listing', newListingObj);
        showToast('قبول باشد! هزینه معنوی شما (' + pledge.summary_label + ') ثبت شد و آگهی شما در بازار منتشر گردید.');
      });
    }

    // =========================================================================
    // REQUIREMENT 4, 5, 6, 7, 10: LISTING DETAIL MODAL WITH DYNAMIC SPECS,
    // CHAT + BARGAINING (چانه‌زنی), DIRECT ORDER, AND SIMILAR ADS (آگهی‌های مشابه)
    // =========================================================================
    function openListingDetailModal(listingId, focusBargain = false, replyToBuyerUname = '') {
      if (focusBargain) {
        openPvChatBoxModal(listingId, replyToBuyerUname);
        return;
      }
      state.selectedListingId = Number(listingId);
      state.currentPage = 'listing_detail';
      closeModal();
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderSimpleListingDetailPage(listingId) {
      const item = (state.listings || []).find(l => Number(l.id) === Number(listingId)) || (state.listings || [])[0];
      if (!item) {
        return `
          <div class="glass-panel rounded-3xl p-8 text-center space-y-3 text-xs">
            <div class="font-black text-white text-sm">آگهی مورد نظر یافت نشد</div>
            <button type="button" onclick="navigateToMarketPage()" class="px-5 py-2.5 rounded-xl bg-amber-400 text-slate-950 font-black">بازگشت به بازار</button>
          </div>
        `;
      }
      const catObj = MARKET_CATEGORIES.find(c => c.id === item.category) || MARKET_CATEGORIES[0];
      const specsEntries = Object.entries(item.specs || {}).filter(([k, v]) => v && String(v).trim() !== '' && k !== 'غرفه');
      const cleanPhone = String(item.seller_phone || '09150000000').replace(/[^0-9+]/g, '');

      return `
        <div class="max-w-2xl mx-auto pb-28 space-y-4 text-xs">
          <!-- ۱. تصویر آگهی (بزرگ، شفاف و بدون شلوغی) -->
          <div class="glass-panel rounded-3xl overflow-hidden border border-white/15 relative bg-slate-950">
            <div class="relative h-64 sm:h-96 w-full flex items-center justify-center overflow-hidden">
              <img src="${item.image_data}" alt="" class="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-125 opacity-35 pointer-events-none" aria-hidden="true" />
              <img src="${item.image_data}" alt="${escapeHtml(item.title)}" class="relative z-10 max-h-full max-w-full object-contain" />
            </div>

            <div class="absolute top-3 right-3 z-20 flex flex-wrap gap-1.5">
              ${item.is_urgent ? '<span class="bg-rose-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow">🔥 فوری</span>' : ''}
              ${item.is_amazing ? `<span class="bg-amber-400 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow">⚡ شگفت‌انگیز ${item.discount_percent ? item.discount_percent + '٪' : ''}</span>` : ''}
            </div>
          </div>

          <!-- ۲. جزئیات و توضیحات آگهی (ساده، خلوت و خوانا) -->
          <div class="glass-panel rounded-3xl p-5 space-y-4 border border-white/15">
            <div class="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-3.5">
              <div class="space-y-1">
                <span class="text-[11px] text-amber-300 font-bold">${escapeHtml(catObj.title)}</span>
                <h1 class="text-base sm:text-xl font-black text-white leading-snug">${escapeHtml(item.title)}</h1>
              </div>
              <div class="text-left shrink-0 bg-emerald-500/15 border border-emerald-400/35 px-3.5 py-2 rounded-2xl">
                ${item.old_price > item.price ? `<span class="text-[10px] text-slate-400 line-through block">${formatPrice(item.old_price)} تومان</span>` : ''}
                <span class="font-black text-emerald-300 text-sm sm:text-base">${item.price > 0 ? formatPrice(item.price) + ' ' + escapeHtml(item.price_unit) : escapeHtml(item.price_unit)}</span>
              </div>
            </div>

            <!-- جدول کوتاه جزئیات کلیدی -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div onclick="openBoothPage('${escapeHtml(item.seller_username)}')" class="glass-card p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:border-amber-400/50 transition">
                <span class="text-slate-400">غرفه:</span>
                <span class="font-black text-cyan-300 truncate max-w-[170px]">🏪 ${escapeHtml(item.booth_title || item.seller_name)} ←</span>
              </div>
              <div class="glass-card p-3 rounded-2xl flex items-center justify-between">
                <span class="text-slate-400">محدوده:</span>
                <span class="font-bold text-amber-200 truncate max-w-[170px]">📍 ${escapeHtml(item.address_detail)}</span>
              </div>
              <div class="glass-card p-3 rounded-2xl flex items-center justify-between">
                <span class="text-slate-400">وضعیت:</span>
                <span class="font-bold text-emerald-300">${escapeHtml(item.condition_badge || 'نو / تولید تازه')}</span>
              </div>
              <div class="glass-card p-3 rounded-2xl flex items-center justify-between">
                <span class="text-slate-400">نحوه تحویل:</span>
                <span class="font-bold text-white">${escapeHtml(item.delivery_badge || 'تحویل در محله')}</span>
              </div>
              ${specsEntries.map(([k, v]) => `
                <div class="glass-card p-3 rounded-2xl flex items-center justify-between">
                  <span class="text-slate-400">${escapeHtml(k)}:</span>
                  <span class="font-bold text-white">${escapeHtml(v)}</span>
                </div>
              `).join('')}
            </div>

            <!-- نوار امتیاز ۵ ستاره دیجی‌کالایی (یک بار به ازای هر اکانت) + افزودن به سبد خرید و نشان کردن -->
            ${(() => {
              const myGivenStars = getUserRatingForListing(item.id);
              return `
                <div class="p-3.5 rounded-2xl bg-slate-950/75 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex flex-wrap items-center justify-between sm:justify-start gap-2">
                    <div>
                      <span class="font-black text-amber-300 text-xs sm:text-sm">⭐ امتیاز کالا: ${Number(item.rating_avg || 4.8).toLocaleString('fa-IR')} از ۵</span>
                      <span class="text-[11px] text-slate-400 mr-1">(${Number(item.rating_count || 12).toLocaleString('fa-IR')} رای اهالی)</span>
                    </div>
                    ${myGivenStars > 0 ? `
                      <span class="px-2.5 py-1 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 font-bold text-[11px]">
                        ✓ امتیاز شما (${myGivenStars.toLocaleString('fa-IR')} ستاره) ثبت شده
                      </span>
                    ` : `
                      <div class="flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-xl border border-white/10" title="ثبت امتیاز شما (فقط یک بار)">
                        <span class="text-[10px] text-slate-400 ml-1">رای شما:</span>
                        ${[1,2,3,4,5].map(st => `<button type="button" onclick="submitListingStarRating(${item.id}, ${st})" class="text-sm hover:scale-125 transition">⭐</button>`).join('')}
                      </div>
                    `}
                  </div>
                  <div class="grid grid-cols-2 sm:flex items-center gap-2">
                    <button type="button" onclick="toggleBookmarkMarketListing(${item.id}, event)" class="px-3 py-2 rounded-xl border text-xs font-bold text-center ${isListingBookmarked(item.id) ? 'bg-amber-400 text-slate-950 border-amber-400 font-black' : 'bg-white/10 text-white border-white/20'}">
                      ${isListingBookmarked(item.id) ? '🔖 نشان‌شده' : '🔖 نشان کردن'}
                    </button>
                    <button type="button" onclick="addToShoppingCart(${item.id}, event)" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs text-center shadow-lg">
                      + افزودن به سبد خرید 🛒
                    </button>
                  </div>
                </div>
              `;
            })()}

            <!-- توضیحات کامل آگهی -->
            <div class="pt-2 border-t border-white/10 space-y-1.5">
              <h2 class="font-black text-amber-300 text-sm">توضیحات آگهی</h2>
              <p class="text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">${escapeHtml(item.description)}</p>
            </div>
          </div>

          <!-- ۲.۵. بخش تبادل نظر و دیدگاه‌های عمومی همسایگان درباره این آگهی -->
          ${(() => {
            const deletedSet = new Set((state.deletedMessageIds || []).map(Number));
            const publicComments = (item.messages || []).filter(m => m && m.message_type === 'comment' && !deletedSet.has(Number(m.id || 0)) && (isAdmin() || (m.status || 'approved') === 'approved'));
            const myUname = (state.currentUser && state.currentUser.username) ? state.currentUser.username : '';
            return `
              <div class="glass-panel rounded-3xl p-5 space-y-3.5 border border-white/15">
                <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <h2 class="font-black text-white text-sm flex items-center gap-2">
                    <span>💬 تبادل نظر و دیدگاه‌های همسایگان (${publicComments.length.toLocaleString('fa-IR')})</span>
                  </h2>
                  <span class="text-[10px] text-slate-400">پرسش و پاسخ عمومی زیر آگهی</span>
                </div>

                <div id="listing-public-comments-list" class="space-y-2 max-h-60 overflow-y-auto">
                  ${publicComments.length === 0 ? `
                    <div class="p-4 rounded-2xl bg-white/5 border border-white/10 text-center text-slate-400 text-[11px]">
                      هنوز دیدگاهی برای این آگهی ثبت نشده است. اولین نفری باشید که نظر یا تجربه خود را ثبت می‌کند.
                    </div>
                  ` : publicComments.map(c => {
                    const canDel = Boolean(isAdmin() || (myUname && (c.sender_username === myUname || item.seller_username === myUname)));
                    return `
                      <div class="p-3 rounded-2xl bg-slate-950/75 border border-white/10 space-y-1">
                        <div class="flex items-center justify-between gap-2 text-[11px]">
                          <span class="font-black text-amber-300">${escapeHtml(c.sender || 'همسایه شمال شرق')}</span>
                          <div class="flex items-center gap-2">
                            <span class="text-[10px] text-emerald-400">دیدگاه عمومی</span>
                            ${canDel ? `<button type="button" onclick="deletePublicComment(${item.id}, ${Number(c.id || 0)})" class="text-rose-400 hover:text-rose-300 font-bold text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 border border-rose-500/30">🗑️ حذف</button>` : ''}
                          </div>
                        </div>
                        <p class="text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">${escapeHtml(c.text)}</p>
                      </div>
                    `;
                  }).join('')}
                </div>

                <form onsubmit="sendListingDirectMessage(event, ${item.id}, 'comment')" class="flex items-center gap-2 pt-1">
                  <input id="public-comment-inp" type="text" required placeholder="دیدگاه، تجربه خرید یا پرسش عمومی خود را بنویسید..." class="glass-input flex-1 px-3.5 py-2.5 rounded-2xl text-xs" />
                  <button type="submit" class="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-black text-xs shrink-0 shadow">
                    ثبت نظر
                  </button>
                </form>
              </div>
            `;
          })()}

          <!-- ۳. نوار منوی ۳ دکمه‌ای حرفه‌ای در پایین صفحه (راست: تماس مستقیم | وسط: بازار | چپ: پیام فول‌اسکرین) -->
          <div class="glass-panel rounded-3xl p-3 border border-amber-400/35 shadow-xl">
            <div class="max-w-xl mx-auto grid grid-cols-3 gap-2.5 items-center">
              <!-- سمت راست: تماس مستقیم تلفنی -->
              <a href="tel:${escapeHtml(cleanPhone)}" class="py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95">
                <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                <span>تماس</span>
              </a>

              <!-- وسط: بازگشت به بازار -->
              <button type="button" onclick="navigateToMarketPage()" class="py-3 px-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95">
                <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/></svg>
                <span>بازار</span>
              </button>

              <!-- سمت چپ: پیام (صفحه جدا و ساده به صورت فول‌اسکرین از چت) -->
              <button type="button" onclick="openPvChatBoxModal(${item.id})" class="py-3 px-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-white font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-1.5 transition active:scale-95">
                <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                <span>پیام</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }

    // =========================================================================
    // STANDALONE FULL-VIEWPORT FAST & SIMPLE PV CHAT BOX POPUP WITH EMOJIS
    // =========================================================================
    const PV_CHAT_EMOJIS = ['👋', '🙏', '🌺', '🤝', '💰', '💸', '✅', '📦', '🛵', '📍', '👍', '❤️'];

    function insertPvEmoji(emojiStr) {
      const inp = document.getElementById('pv-fast-chat-inp');
      if (!inp) return;
      inp.value = (inp.value || '') + emojiStr;
      inp.focus();
    }

    function fillPvQuickChip(textStr) {
      const inp = document.getElementById('pv-fast-chat-inp');
      if (!inp) return;
      inp.value = textStr;
      inp.focus();
    }

    function togglePvOfferBox() {
      const box = document.getElementById('pv-offer-price-row');
      if (box) {
        box.classList.toggle('hidden');
        const inp = document.getElementById('pv-fast-offer-inp');
        if (!box.classList.contains('hidden') && inp) inp.focus();
      }
    }

    function renderPvChatBubblesHtml(item, currUname) {
      const isSellerOrAdmin = Boolean(isAdmin() || (currUname && currUname === item.seller_username));
      const pvMsgs = (item.messages || []).filter(m => {
        if ((m.message_type || 'pv') !== 'pv') return false;
        if (isSellerOrAdmin) return true;
        return currUname && (m.sender_username === currUname || m.receiver_username === currUname);
      });

      if (pvMsgs.length === 0) {
        return `
          <div class="my-auto mx-auto max-w-lg text-center p-8 rounded-3xl bg-slate-900/75 border border-white/10 space-y-3 text-slate-300">
            <div class="text-4xl">💬 🤝</div>
            <div class="font-black text-white text-base sm:text-lg">آغاز گفتگوی خصوصی (PV) با «${escapeHtml(item.booth_title || item.seller_name)}»</div>
            <p class="text-xs sm:text-sm leading-relaxed text-slate-300">پیام و پیشنهاد قیمت شما بلافاصله برای غرفه‌دار ارسال می‌شود.</p>
          </div>
        `;
      }

      return pvMsgs.map(m => {
        const isMine = m.sender_username === currUname;
        return `
          <div class="pv-bubble ${isMine ? 'pv-bubble-mine' : 'pv-bubble-other'}">
            <div class="flex items-center justify-between gap-4 mb-1.5 text-xs ${isMine ? 'text-emerald-100' : 'text-cyan-300'} font-black">
              <span>${escapeHtml(isMine ? 'شما (' + (state.currentUser.display_name || 'خریدار') + ')' : m.sender)}</span>
              <span>✔✔ ارسال‌شده در PV</span>
            </div>
            <div class="text-white text-sm sm:text-base font-medium leading-relaxed">${escapeHtml(m.text)}</div>
            ${m.offered_price > 0 ? `
              <div class="mt-2.5 px-3.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs sm:text-sm inline-flex items-center gap-1.5 shadow">
                <span>💰 پیشنهاد قیمت چانه‌زنی: ${formatPrice(m.offered_price)} تومان</span>
              </div>
            ` : ''}
          </div>
        `;
      }).join('');
    }

    function openPvChatBoxModal(listingId, replyToBuyerUname = '') {
      if (!requireRegisteredAccount('چت خصوصی و چانه‌زنی با غرفه‌دار')) return;
      const item = (state.listings || []).find(l => Number(l.id) === Number(listingId));
      if (!item) return;

      const myUname = state.currentUser.username;
      let partnerUname = replyToBuyerUname;
      if (!partnerUname) {
        if (item.seller_username !== myUname) {
          partnerUname = item.seller_username;
        } else {
          const pvMsgs = (item.messages || []).filter(m => m.sender_username && m.sender_username !== myUname);
          partnerUname = pvMsgs.length > 0 ? pvMsgs[pvMsgs.length - 1].sender_username : 'resident';
        }
      }

      state.activeChatKey = item.id + '_' + partnerUname;
      state.mobileChatView = 'chat';
      state.currentPage = 'messages';
      closeModal();
      saveState();
      renderCurrentPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
        const sc = document.getElementById('chat-room-scroll');
        if (sc) sc.scrollTo({ top: sc.scrollHeight + 1000, behavior: 'smooth' });
      }, 80);
    }

    let lastPvSubmitTs = 0;
    function submitFastPvChatMessage(e, listingId) {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
      const nowMs = Date.now();
      if (nowMs - lastPvSubmitTs < 180) return;

      if (!requireRegisteredAccount('ارسال پیام در چت خصوصی')) return;
      const item = state.listings.find(l => Number(l.id) === Number(listingId));
      if (!item) return;

      const inp = document.getElementById('pv-fast-chat-inp');
      const offerInp = document.getElementById('pv-fast-offer-inp');
      const recInp = document.getElementById('pv-fast-receiver');
      let rawTxt = inp ? inp.value.trim() : '';
      const offeredPrice = offerInp ? Number(offerInp.value || 0) : 0;
      const receiverUname = (recInp && recInp.value) ? recInp.value : item.seller_username;

      if (!rawTxt && offeredPrice > 0) {
        rawTxt = 'سلام، پیشنهاد قیمت من برای این آگهی ' + formatPrice(offeredPrice) + ' تومان است.';
      }
      if (!rawTxt) {
        showToast('لطفاً ابتدا متن پیام یا مبلغ پیشنهادی خود را وارد کنید.', 'warning');
        if (inp) inp.focus();
        return;
      }

      lastPvSubmitTs = nowMs;
      const filtered = (typeof filterForbiddenWords === 'function')
        ? filterForbiddenWords(rawTxt)
        : { text: rawTxt, hadForbidden: false };

      const msgObj = {
        id: nowMs,
        listing_id: Number(listingId),
        sender_username: state.currentUser.username,
        receiver_username: receiverUname,
        sender: state.currentUser.display_name || state.currentUser.booth_title || state.currentUser.username,
        text: filtered.text,
        offered_price: offeredPrice,
        message_type: 'pv',
        status: 'approved'
      };

      item.messages = Array.isArray(item.messages) ? item.messages : [];
      // Deduplicate check
      if (!item.messages.some(m => m.id === nowMs || (m.sender_username === msgObj.sender_username && m.text === msgObj.text && Math.abs(Number(m.id || 0) - nowMs) < 3000))) {
        item.messages.push(msgObj);
      }
      saveState();

      // Update chat bubbles in-place without closing or flickering the modal!
      const sc = document.getElementById('pv-chat-messages-scroll');
      if (sc) {
        sc.innerHTML = renderPvChatBubblesHtml(item, state.currentUser.username);
        sc.scrollTop = sc.scrollHeight;
      }
      if (inp) { inp.value = ''; inp.focus(); }
      if (offerInp) offerInp.value = '';
      const offerRow = document.getElementById('pv-offer-price-row');
      if (offerRow) offerRow.classList.add('hidden');

      showToast('پیام شما در چت خصوصی (PV) ارسال شد.');
      callServerApi('add_message', msgObj);
    }

    function sendListingDirectMessage(e, listingId, msgType = 'comment') {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      if (msgType === 'pv') {
        openPvChatBoxModal(listingId);
        return;
      }
      if (!requireRegisteredAccount('ثبت دیدگاه عمومی')) return;
      const item = state.listings.find(l => Number(l.id) === Number(listingId));
      if (!item) return;

      const inp = document.getElementById('public-comment-inp');
      const rawTxt = inp ? inp.value.trim() : '';
      if (!rawTxt) return;

      const filteredResult = (typeof filterForbiddenWords === 'function')
        ? filterForbiddenWords(rawTxt)
        : { text: rawTxt, hadForbidden: false };
      const cleanTxt = filteredResult.text;
      const senderName = state.currentUser.display_name || state.currentUser.booth_title;

      const nowMs = Date.now();
      const msgObj = {
        id: nowMs,
        _optimisticTs: nowMs,
        listing_id: Number(listingId),
        sender_username: state.currentUser.username,
        receiver_username: item.seller_username,
        sender: senderName,
        text: cleanTxt,
        offered_price: 0,
        message_type: 'comment',
        status: 'approved'
      };

      item.messages = item.messages || [];
      item.messages.push(msgObj);
      saveState();
      if (inp) inp.value = '';
      renderCurrentPage(true);
      callServerApi('add_message', msgObj);

      if (filteredResult.hadForbidden) {
        showToast('دیدگاه شما پس از فیلتر خودکار کلمات نامناسب، منتشر شد.', 'warning');
      } else {
        showToast('دیدگاه عمومی شما زیر آگهی منتشر شد.');
      }
    }

    // Direct Order Submission (Requirement 10: Strictly Registered Users Only)
    function openPlaceOrderModal(listingId) {
      if (!requireRegisteredAccount('ثبت سفارش خرید از غرفه')) return;
      const item = state.listings.find(l => l.id === Number(listingId));
      if (!item) return;
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-emerald-300 text-base">ثبت درخواست خرید: ${escapeHtml(item.title)}</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 font-bold">✕</button>
          </div>
          <form onsubmit="submitMarketOrder(event, ${item.id})" class="space-y-3">
            <div>
              <label class="block text-slate-300 mb-1">نام خریدار *</label>
              <input id="ord-buyer-name" type="text" required value="${escapeHtml(state.currentUser.display_name)}" class="glass-input w-full px-3 py-2 rounded-xl" />
            </div>
            <div>
              <label class="block text-slate-300 mb-1">شماره تماس هماهنگی تحویل *</label>
              <input id="ord-buyer-phone" type="text" required value="${escapeHtml(state.currentUser.phone || '')}" class="glass-input w-full px-3 py-2 rounded-xl" />
            </div>
            <div>
              <label class="block text-slate-300 mb-1">آدرس دقیق تحویل در شمال شرق *</label>
              <input id="ord-buyer-addr" type="text" required value="${escapeHtml(state.currentUser.alley || 'مشهد، شمال شرق')}" class="glass-input w-full px-3 py-2 rounded-xl" />
            </div>
            <button type="submit" class="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-black">
              ثبت قطعی سفارش برای غرفه‌دار (${formatPrice(item.price)} ${escapeHtml(item.price_unit)})
            </button>
          </form>
        </div>
      `);
    }

    function submitMarketOrder(e, listingId) {
      e.preventDefault();
      if (!requireRegisteredAccount('ثبت سفارش خرید')) return;
      const item = state.listings.find(l => l.id === Number(listingId));
      if (!item) return;
      const ordObj = {
        id: Date.now(),
        order_code: 'TBR-' + Math.floor(100000 + Math.random() * 899999),
        listing_id: item.id,
        listing_title: item.title,
        buyer_username: state.currentUser.username,
        buyer_name: document.getElementById('ord-buyer-name').value.trim(),
        buyer_phone: document.getElementById('ord-buyer-phone').value.trim(),
        buyer_address: document.getElementById('ord-buyer-addr').value.trim(),
        seller_username: item.seller_username,
        total_price: item.price,
        order_status: 'ثبت اولیه - در انتظار هماهنگی غرفه‌دار'
      };
      state.orders.unshift(ordObj);
      closeModal();
      saveState();
      callServerApi('create_order', ordObj);
      showToast(`سفارش شما با کد ${ordObj.order_code} ثبت شد و در غرفه فروشنده قرار گرفت.`);
    }


    function deletePublicComment(listingId, msgId) {
      if (!state.currentUser) return;
      const lid = Number(listingId);
      const mid = Number(msgId);
      if (!Array.isArray(state.deletedMessageIds)) state.deletedMessageIds = [];
      if (mid && !state.deletedMessageIds.includes(mid)) {
        state.deletedMessageIds.push(mid);
      }
      const item = (state.listings || []).find(l => Number(l.id) === lid);
      if (item && Array.isArray(item.messages)) {
        item.messages = item.messages.filter(m => Number(m.id) !== mid);
      }
      saveState();
      renderCurrentPage(true);
      callServerApi('delete_message', { id: mid, listing_id: lid });
      showToast('دیدگاه حذف شد.', 'warning');
    }

async function loadMoreMarketListingsByCursor(cursorId, category = 'all', limit = 20) {
  try {
    const url = `api/index.php?action=get_listings_cursor&cursor=${encodeURIComponent(cursorId || 0)}&category=${encodeURIComponent(category || 'all')}&limit=${encodeURIComponent(limit)}`;
    const resp = await fetch(url, { cache: 'no-store' });
    const data = await resp.json();
    if (data && data.ok && Array.isArray(data.items)) {
      const existingIds = new Set((state.marketListings || []).map(x => Number(x.id)));
      data.items.forEach(item => {
        if (!existingIds.has(Number(item.id))) {
          state.marketListings.push(item);
        }
      });
      state.marketNextCursor = data.next_cursor || null;
      renderCurrentPage(true);
      return data;
    }
  } catch (e) {}
  return null;
}

