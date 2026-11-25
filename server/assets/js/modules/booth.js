/**
 * HAMAHDI v4.0.0 | ماژول صفحه غرفه اختصاصی، ویرایش پروفایل و کارت QR غرفه
 */
    function renderBoothPage(boothUsername) {
      const targetUname = boothUsername || state.selectedBoothUsername || (state.currentUser && state.currentUser.username) || '';
      const u = (state.users && state.users[targetUname]) || (state.currentUser && state.currentUser.username === targetUname ? state.currentUser : {
        username: targetUname || 'booth',
        display_name: 'کسب‌وکار محلی شمال شرق',
        booth_title: 'غرفه تجاری شمال شرق',
        booth_bio: 'عرضه مستقیم کالا و خدمات در محدوده شمال شرق مشهد',
        booth_hours: 'همه‌روزه ۹ صبح تا ۲۱',
        alley: 'شمال شرق',
        phone: '09150000000',
        booth_status: 'approved'
      });
      const isOwner = Boolean(state.currentUser && (String(state.currentUser.username).toLowerCase() === String(u.username).toLowerCase() || isAdmin()));
      const bStatus = u.booth_status || 'pending';
      const allBoothListings = (state.listings || []).filter(l => String(l.seller_username || '').toLowerCase() === String(u.username || '').toLowerCase() && (isOwner || l.status === 'approved'));
      const qCat = String(state.boothCatalogQuery || '').trim().toLowerCase();
      const boothListings = allBoothListings.filter(l => !qCat || (l.title && l.title.toLowerCase().includes(qCat)) || (l.description && l.description.toLowerCase().includes(qCat)));
      const boothOrders = (state.orders || []).filter(o => String(o.seller_username || '').toLowerCase() === String(u.username || '').toLowerCase() || String(o.buyer_username || '').toLowerCase() === String(u.username || '').toLowerCase());
      const totalViews = allBoothListings.reduce((s, l) => s + Number(l.views_count || 18), 0);
      const avgRating = allBoothListings.length > 0
        ? (allBoothListings.reduce((s, l) => s + Number(l.rating_avg || 4.8), 0) / allBoothListings.length).toFixed(1)
        : '۴.۹';
      const cleanPhone = String(u.phone || '09151112201').replace(/[^0-9+]/g, '');

      return `
        <div class="space-y-5 pb-24">
          <!-- ۱. هدر و تابلو تجاری غرفه کسب‌وکار در عهد بازار -->
          <section class="glass-panel rounded-3xl p-5 sm:p-6 border-t-4 border-t-amber-400 shadow-2xl space-y-5">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3.5">
              <div class="flex items-center gap-2">
                <button type="button" onclick="navigateToMarketPage()" class="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow">
                  <span>→ بازگشت به عهد بازار</span>
                </button>
                
              </div>

              <span class="px-3 py-1.5 rounded-full ${bStatus === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40' : bStatus === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40' : 'bg-amber-500/20 text-amber-300 border border-amber-400/40'} text-xs font-black">
                ${bStatus === 'approved' ? '✔ واحد صنفی و غرفه تاییدشده عهد بازار' : bStatus === 'rejected' ? '❌ مدارک غرفه رد شده' : '⏳ در انتظار تایید مدیریت سامانه'}
              </span>
            </div>

            ${isOwner && bStatus !== 'approved' ? `
              <div class="p-4 rounded-2xl ${bStatus === 'rejected' ? 'bg-rose-950/60 border border-rose-500/50 text-rose-200' : 'bg-amber-500/15 border border-amber-400/50 text-amber-200'} text-xs space-y-1.5 leading-relaxed">
                <div class="font-black text-sm">
                  ${bStatus === 'rejected' ? '❌ درخواست غرفه شما نیاز به اصلاح مدارک دارد' : '⏳ حساب و غرفه شما در صف بررسی و تایید مدیریت است'}
                </div>
                <p>
                  ${bStatus === 'rejected'
                    ? ('علت اعلام‌شده توسط مدیریت: ' + escapeHtml(u.booth_rejection_reason || 'نقص در اطلاعات هویتی یا تصویر کارت ملی'))
                    : 'پس از بررسی و تایید حساب شما توسط مدیریت سامانه، دکمه‌های «ثبت آگهی جدید» و «ثبت استوری تبلیغاتی» در عهد بازار برای غرفه شما فعال خواهند شد.'}
                </p>
              </div>
            ` : ''}

            <!-- مشخصات اصلی کسب‌وکار -->
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-center gap-4 min-w-0">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-cyan-500 p-0.5 shadow-xl shrink-0">
                  <div class="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center overflow-hidden">
                    ${u.booth_logo ? `
                      <img src="${u.booth_logo}" alt="${escapeHtml(u.booth_title || u.display_name)}" class="w-full h-full object-cover" onerror="this.src='./icon-512.png'" />
                    ` : `
                      <span class="text-2xl sm:text-3xl">🏪</span>
                    `}
                  </div>
                </div>

                <div class="min-w-0 space-y-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <h1 class="text-lg sm:text-2xl font-black text-white truncate">${escapeHtml(u.booth_title || ('غرفه ' + u.display_name))}</h1>
                    <span class="px-2 py-0.5 rounded-lg bg-amber-400/15 border border-amber-400/35 text-amber-300 text-[10px] font-mono dir-ltr">ID: @${escapeHtml(u.username)}</span>
                  </div>
                  ${u.booth_tagline ? `<div class="text-xs font-black text-emerald-300">${escapeHtml(u.booth_tagline)}</div>` : ''}
                  <p class="text-xs sm:text-sm text-slate-200 leading-relaxed">${escapeHtml(u.booth_bio || 'عرضه مستقیم کالا و خدمات به اهالی محترم شمال شرق')}</p>
                  ${(u.booth_category || u.booth_perks) ? `
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                      ${u.booth_category ? `<span class="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-400/30 text-cyan-200 text-[10px] font-bold">🏷️ ${escapeHtml(u.booth_category)}</span>` : ''}
                      ${u.booth_perks ? String(u.booth_perks).split('،').filter(Boolean).map(pk => `<span class="px-2 py-0.5 rounded-lg bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-[10px] font-bold">✓ ${escapeHtml(pk.trim())}</span>`).join('') : ''}
                    </div>
                  ` : ''}
                </div>
              </div>

              <!-- دکمه‌های ارتباط تجاری مستقیم برای مشتریان یا مدیریت غرفه برای صاحب کسب‌وکار -->
              <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto shrink-0 text-xs">
                ${!isOwner ? `
                  <a href="tel:${escapeHtml(cleanPhone)}" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black flex items-center justify-center gap-1.5 shadow-lg">
                    <span>📞 تماس با غرفه‌دار</span>
                  </a>
                  <button type="button" onclick="openMessagesCenterPage('chats', 'market')" class="flex-1 sm:flex-initial px-4 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black flex items-center justify-center gap-1.5 shadow-lg">
                    <span>💬 پیام تجاری</span>
                  </button>
                ` : ''}
                <button type="button" onclick="openBoothPromoCardModal('${escapeHtml(u.username)}')" class="px-3.5 py-2.5 rounded-2xl glass-card hover:border-amber-400 text-amber-300 font-bold flex items-center gap-1.5">
                  <span>🪪 کارت ویزیت دیجیتال</span>
                </button>
              </div>
            </div>

            <!-- نوار اطلاعات صنفی و تجاری غرفه (مسئول، ساعت کاری، آدرس، تلفن) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs bg-slate-950/75 p-3.5 rounded-2xl border border-white/10">
              <div class="flex items-center gap-2 text-cyan-300 truncate">
                <span class="text-slate-400 shrink-0">👤 مسئول غرفه:</span>
                <strong class="text-white truncate">${escapeHtml(u.display_name)}</strong>
              </div>
              <div class="flex items-center gap-2 text-emerald-300 truncate">
                <span class="text-slate-400 shrink-0">⏰ ساعت کاری:</span>
                <strong class="text-white truncate">${escapeHtml(u.booth_hours || 'همه‌روزه ۹ صبح تا ۲۱')}</strong>
              </div>
              <div class="flex items-center gap-2 text-amber-300 truncate">
                <span class="text-slate-400 shrink-0">📍 آدرس واحد:</span>
                <strong class="text-white truncate">${escapeHtml(u.exact_address || u.alley || 'شمال شرق')}</strong>
              </div>
              <div class="flex items-center gap-2 text-sky-300 truncate">
                <span class="text-slate-400 shrink-0">📞 شماره تماس:</span>
                <strong class="text-white font-mono dir-ltr truncate">${escapeHtml(u.phone || 'ثبت در سامانه')}</strong>
              </div>
            </div>

            <!-- ۴ شاخص عملکرد تجاری غرفه (KPIs) -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
              <div class="glass-card p-3 rounded-2xl border border-amber-400/25">
                <div class="text-lg sm:text-xl font-black text-amber-300">${allBoothListings.length.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] text-slate-300 mt-0.5">کالا و خدمات فعال</div>
              </div>
              <div class="glass-card p-3 rounded-2xl border border-emerald-400/25">
                <div class="text-lg sm:text-xl font-black text-emerald-300">⭐ ${String(avgRating)}</div>
                <div class="text-[11px] text-slate-300 mt-0.5">امتیاز رضایت مشتریان</div>
              </div>
              <div class="glass-card p-3 rounded-2xl border border-cyan-400/25">
                <div class="text-lg sm:text-xl font-black text-cyan-300">${boothOrders.length.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] text-slate-300 mt-0.5">سفارش‌های ثبت‌شده</div>
              </div>
              <div class="glass-card p-3 rounded-2xl border border-purple-400/25">
                <div class="text-lg sm:text-xl font-black text-purple-300">${totalViews.toLocaleString('fa-IR')}</div>
                <div class="text-[11px] text-slate-300 mt-0.5">مجموع بازدید ویترین</div>
              </div>
            </div>

            <!-- پنل ابزارهای مدیریتی ویژه صاحب غرفه (بدون دکمه‌های تکراری ثبت کالا و ویرایش مشخصات) -->
            ${isOwner ? `
              <div class="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                <button type="button" onclick="openAddStoryModal()" class="px-3.5 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold flex items-center gap-1.5">
                  <span>📸 ثبت استوری تبلیغاتی غرفه</span>
                </button>
                <button type="button" onclick="logoutSession()" class="px-3.5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/35 font-bold">
                  خروج از حساب
                </button>
              </div>
            ` : ''}
          </section>

          <!-- ۲. ویترین کالاها و خدمات غرفه -->
          <section class="space-y-3.5">
            <div class="glass-panel rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="text-lg">🛍️</span>
                <h2 class="font-black text-white text-sm sm:text-base">ویترین محصولات و خدمات «${escapeHtml(u.booth_title || u.display_name)}» (${boothListings.length.toLocaleString('fa-IR')})</h2>
              </div>
              <div class="w-full sm:w-72">
                <input id="booth-catalog-search-inp" type="search" value="${escapeHtml(state.boothCatalogQuery || '')}" oninput="filterBoothCatalogInput(this.value)" placeholder="جستجو در کالاهای این غرفه..." class="glass-input w-full px-3.5 py-2 rounded-xl text-xs" />
              </div>
            </div>

            ${boothListings.length === 0 ? `
              <div class="glass-panel rounded-3xl p-10 text-center space-y-3 border border-dashed border-white/20 text-xs">
                <div class="text-3xl">📦</div>
                <div class="font-black text-white text-sm">هنوز کالایی در ویترین این غرفه ثبت نشده است</div>
                ${isOwner ? `
                  <p class="text-slate-400">از دکمه «+ ثبت کالای جدید در غرفه» برای افزودن اولین محصول یا خدمت خود استفاده کنید.</p>
                ` : ''}
              </div>
            ` : `
              <div class="hm-market-cards-grid">
                ${boothListings.map(item => renderMarketCard(item)).join('')}
              </div>
            `}
          </section>

          <!-- ۳. سفارش‌های مشتریان این غرفه (فقط قابل مشاهده برای صاحب غرفه یا ادمین) -->
          ${isOwner ? `
            <section class="glass-panel rounded-3xl p-5 border border-emerald-400/30 space-y-3 text-xs">
              <div class="flex items-center justify-between border-b border-white/10 pb-2.5">
                <h3 class="font-black text-emerald-300 text-sm">📋 سفارش‌های ثبت‌شده مشتریان غرفه (${boothOrders.length.toLocaleString('fa-IR')})</h3>
                <button type="button" onclick="openMessagesCenterPage('orders', 'market')" class="text-amber-300 hover:underline font-bold text-[11px]">مدیریت همه سفارش‌ها ←</button>
              </div>
              ${boothOrders.length === 0 ? `
                <div class="p-4 text-center text-slate-400">هنوز سفارشی برای این غرفه ثبت نشده است.</div>
              ` : `
                <div class="space-y-2">
                  ${boothOrders.map(o => `
                    <div class="glass-card p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 border border-white/10">
                      <div>
                        <div class="font-black text-amber-300">${escapeHtml(o.order_code)} — ${escapeHtml(o.listing_title)}</div>
                        <div class="text-slate-300 mt-1 text-[11px]">مشتری: ${escapeHtml(o.buyer_name)} (${escapeHtml(o.buyer_phone)}) • آدرس: ${escapeHtml(o.buyer_address)}</div>
                        <div class="text-cyan-300 mt-0.5 text-[11px] font-bold">وضعیت: ${escapeHtml(o.order_status)}</div>
                      </div>
                      <div class="font-black text-emerald-300 text-sm">${formatPrice(o.total_price)} تومان</div>
                    </div>
                  `).join('')}
                </div>
              `}
            </section>
          ` : ''}
        </div>
      `;
    }


    let __pendingEditBoothLogoDataUrl = '';

    function previewEditBoothLogoFile(inputEl) {
      readImageFileAsDataUrl(inputEl, 640, function(dataUrl) {
        if (!dataUrl) return;
        __pendingEditBoothLogoDataUrl = dataUrl;
        const img = document.getElementById('eb-logo-preview');
        const ph = document.getElementById('eb-logo-placeholder');
        if (img) {
          img.src = dataUrl;
          img.classList.remove('hidden');
        }
        if (ph) ph.classList.add('hidden');
        showToast('تصویر پروفایل غرفه آماده ذخیره است.');
      });
    }

    function openEditBoothModal(username) {
      const u = (state.users && state.users[username]) || state.currentUser;
      if (!u) return;
      __pendingEditBoothLogoDataUrl = u.booth_logo || '';
      const curPerks = String(u.booth_perks || '');
      const hasFreeDelivery = curPerks.includes('تحویل رایگان');
      const hasInPerson = curPerks.includes('خرید حضوری');
      const hasFastReply = curPerks.includes('پاسخگویی سریع');

      openModal(`
        <div class="p-5 sm:p-6 space-y-4 text-xs max-h-[88vh] overflow-y-auto">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <div>
              <h3 class="font-black text-amber-300 text-base">✏️ ویرایش جامع پروفایل و معرفی غرفه</h3>
              <span class="text-[10px] text-slate-400">تکمیل این موارد باعث دیده‌شدن بهتر غرفه شما در جستجوها و ویترین بازار می‌شود</span>
            </div>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>

          <form onsubmit="submitEditBooth(event, '${escapeHtml(u.username)}')" class="space-y-4">
            <!-- ۱. انتخاب عکس پروفایل و لوگوی غرفه -->
            <div class="p-3.5 rounded-2xl bg-slate-950/75 border border-cyan-400/35 flex flex-wrap items-center gap-4">
              <div class="w-16 h-16 rounded-2xl bg-slate-900 border-2 border-amber-400/60 overflow-hidden flex items-center justify-center shrink-0 shadow-lg">
                <img id="eb-logo-preview" src="${u.booth_logo || ''}" alt="لوگوی غرفه" class="${u.booth_logo ? '' : 'hidden'} w-full h-full object-cover" />
                <span id="eb-logo-placeholder" class="${u.booth_logo ? 'hidden' : ''} text-2xl">🏪</span>
              </div>
              <div class="flex-1 min-w-[180px] space-y-1.5">
                <label class="block font-black text-cyan-300">📸 عکس پروفایل / لوگوی غرفه</label>
                <input id="eb-logo-file" type="file" accept="image/*" onchange="previewEditBoothLogoFile(this)" class="glass-input w-full px-3 py-1.5 rounded-xl text-[11px]" />
              </div>
            </div>

            <!-- ۲. نام غرفه و نام مسئول -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-slate-300 font-bold mb-1">نام غرفه / کسب‌وکار *</label>
                <input id="eb-title" type="text" required value="${escapeHtml(u.booth_title || '')}" class="glass-input w-full px-3 py-2 rounded-xl font-bold" />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">نام مسئول غرفه *</label>
                <input id="eb-display-name" type="text" required value="${escapeHtml(u.display_name || '')}" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
            </div>

            <!-- ۳. شعار کوتاه و دسته‌بندی تخصصی برای دیده‌شدن بهتر -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-emerald-300 font-bold mb-1">شعار و مزیت ویژه غرفه (دیده شدن در ویترین)</label>
                <input id="eb-tagline" type="text" value="${escapeHtml(u.booth_tagline || '')}" placeholder="مثلاً: ضمانت اصالت کالا + تحویل سریع در محله" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label class="block text-amber-300 font-bold mb-1">حوزه و تخصص فعالیت غرفه</label>
                <select id="eb-category" class="glass-input w-full px-3 py-2 rounded-xl bg-slate-900">
                  ${['تولیدات خانگی و مواد غذایی', 'پوشاک و خیاطی', 'خدمات فنی و تعمیرات', 'صنایع دستی و هنری', 'لوازم خانگی و دیجیتال', 'آموزش و خدمات فرهنگی', 'سایر کالاها و خدمات'].map(cat => `
                    <option value="${cat}" ${u.booth_category === cat ? 'selected' : ''}>${cat}</option>
                  `).join('')}
                </select>
              </div>
            </div>

            <!-- ۴. معرفی جامع و کامل خدمات -->
            <div>
              <label class="block text-slate-300 font-bold mb-1">معرفی کامل، سابقه و محصولات غرفه *</label>
              <textarea id="eb-bio" rows="3" required placeholder="توضیح جذابی درباره محصولات، کیفیت کار و خدمات غرفه خود بنویسید..." class="glass-input w-full px-3 py-2 rounded-xl leading-relaxed">${escapeHtml(u.booth_bio || '')}</textarea>
            </div>

            <!-- ۵. ساعت کاری، تلفن و آدرس -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label class="block text-slate-300 font-bold mb-1">ساعت پاسخگویی *</label>
                <input id="eb-hours" type="text" required value="${escapeHtml(u.booth_hours || 'همه‌روزه ۹ الی ۲۱')}" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">شماره تماس *</label>
                <input id="eb-phone" type="tel" required value="${escapeHtml(u.phone || '')}" class="glass-input w-full px-3 py-2 rounded-xl dir-ltr text-left" />
              </div>
              <div>
                <label class="block text-slate-300 font-bold mb-1">محدوده و نشانی دقیق *</label>
                <input id="eb-alley" type="text" required value="${escapeHtml(u.exact_address || u.alley || 'شمال شرق')}" class="glass-input w-full px-3 py-2 rounded-xl" />
              </div>
            </div>

            <!-- ۶. لینک پیام‌رسان / شبکه اجتماعی + نشان‌های اعتماد غرفه -->
            <div class="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2.5">
              <div>
                <label class="block text-slate-300 font-bold mb-1">آیدی کانال یا پیج غرفه (اختیاری)</label>
                <input id="eb-social" type="text" value="${escapeHtml(u.booth_social || '')}" placeholder="مثلاً: @my_booth_channel" class="glass-input w-full px-3 py-2 rounded-xl dir-ltr text-left" />
              </div>
              <div class="flex flex-wrap items-center gap-3 pt-1">
                <label class="flex items-center gap-1.5 cursor-pointer text-emerald-300 font-bold">
                  <input id="eb-perk-delivery" type="checkbox" ${hasFreeDelivery ? 'checked' : ''} class="w-4 h-4 accent-emerald-400" />
                  <span>تحویل رایگان در محله</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer text-cyan-300 font-bold">
                  <input id="eb-perk-inperson" type="checkbox" ${hasInPerson ? 'checked' : ''} class="w-4 h-4 accent-cyan-400" />
                  <span>امکان خرید حضوری</span>
                </label>
                <label class="flex items-center gap-1.5 cursor-pointer text-amber-300 font-bold">
                  <input id="eb-perk-fast" type="checkbox" ${hasFastReply ? 'checked' : ''} class="w-4 h-4 accent-amber-400" />
                  <span>پاسخگویی سریع</span>
                </label>
              </div>
            </div>

            <button type="submit" class="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl">
              ✔ ذخیره تغییرات پروفایل غرفه
            </button>
          </form>
        </div>
      `);
    }

    function submitEditBooth(e, username) {
      e.preventDefault();
      const bTitle = ((document.getElementById('eb-title') || {}).value || '').trim();
      const bDispName = ((document.getElementById('eb-display-name') || {}).value || '').trim();
      const bTagline = ((document.getElementById('eb-tagline') || {}).value || '').trim();
      const bCategory = ((document.getElementById('eb-category') || {}).value || '').trim();
      const bBio = ((document.getElementById('eb-bio') || {}).value || '').trim();
      const bHours = ((document.getElementById('eb-hours') || {}).value || '').trim();
      const bPhone = faDigitsToEn(((document.getElementById('eb-phone') || {}).value || '').trim());
      const bAlley = ((document.getElementById('eb-alley') || {}).value || '').trim();
      const bSocial = ((document.getElementById('eb-social') || {}).value || '').trim();

      const perksArr = [];
      if ((document.getElementById('eb-perk-delivery') || {}).checked) perksArr.push('تحویل رایگان در محله');
      if ((document.getElementById('eb-perk-inperson') || {}).checked) perksArr.push('امکان خرید حضوری');
      if ((document.getElementById('eb-perk-fast') || {}).checked) perksArr.push('پاسخگویی سریع');
      const bPerks = perksArr.join('، ');

      const logoToSave = __pendingEditBoothLogoDataUrl || '';

      const applyUpdates = (obj) => {
        if (!obj) return;
        obj.booth_title = bTitle;
        if (bDispName) obj.display_name = bDispName;
        obj.booth_tagline = bTagline;
        obj.booth_category = bCategory;
        obj.booth_bio = bBio;
        obj.booth_hours = bHours;
        if (bPhone) obj.phone = bPhone;
        obj.alley = bAlley;
        obj.exact_address = bAlley;
        obj.booth_social = bSocial;
        obj.booth_perks = bPerks;
        if (logoToSave) obj.booth_logo = logoToSave;
      };

      if (state.users && state.users[username]) applyUpdates(state.users[username]);
      if (state.currentUser && state.currentUser.username === username) applyUpdates(state.currentUser);

      (state.listings || []).forEach(l => {
        if (String(l.seller_username || '').toLowerCase() === String(username).toLowerCase()) {
          l.booth_title = bTitle;
          if (bDispName) l.seller_name = bDispName;
        }
      });

      saveState();
      closeModal();
      renderCurrentPage(true);
      callServerApi('update_booth', {
        username: username,
        display_name: bDispName,
        booth_title: bTitle,
        booth_tagline: bTagline,
        booth_category: bCategory,
        booth_bio: bBio,
        booth_hours: bHours,
        phone: bPhone,
        alley: bAlley,
        booth_social: bSocial,
        booth_perks: bPerks,
        booth_logo: logoToSave
      });
      showToast('✅ پروفایل و مشخصات غرفه با موفقیت به‌روزرسانی شد.');
    }


    function requestPromotion(listingId, promoType) {
      const l = state.listings.find(i => i.id === Number(listingId));
      if (!l) return;
      if (isAdmin()) {
        adminApprovePromotion(listingId, promoType);
        return;
      }
      if (promoType === 'ladder') l.ladder_status = 'pending';
      else if (promoType === 'urgent') l.urgent_status = 'pending';
      else if (promoType === 'amazing') l.amazing_status = 'pending';
      saveState();
      renderCurrentPage();
      callServerApi('request_promotion', { listing_id: Number(listingId), promo_type: promoType });
      showToast('درخواست ارتقا ثبت شد و پس از تایید ادمین اعمال می‌گردد.', 'warning');
    }

    // =========================================================================
    // REQUIREMENT 11: EXPANDED DEDICATED ADMIN DASHBOARD PAGE (داشبورد جامع ادمین)
    // =========================================================================
