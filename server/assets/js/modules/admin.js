/**
 * HAMAHDI v4.0.0 | ماژول داشبورد مدیریت سامانه و منوی کشویی ادمین
 */
    function renderExpandedAdminDashboardPage() {
      if (!isAdmin()) {
        return `<div class="glass-panel rounded-3xl p-10 text-center text-rose-300 font-bold">دسترسی به این صفحه فقط مخصوص مدیر کل سامانه (ادمین) است.</div>`;
      }
      const p = getPendingCounts();
      const tab = state.adminActiveTab || 'pending_queue';
      const allUsers = Object.values(state.users || {});
      const allBotChannels = (typeof ensureRegisteredBotChannelsInitialized === 'function')
        ? ensureRegisteredBotChannelsInitialized()
        : (state.registeredBotChannels || []);
      const pendingBotChannels = allBotChannels.filter(c => c && c.status === 'pending');
      const approvedBotChannels = allBotChannels.filter(c => c && (c.status === 'approved' || c.status === 'verified' || (!c.status && c.is_verified)));
      const pf = (typeof SOCIAL_BOT_STATE !== 'undefined' && SOCIAL_BOT_STATE.platforms) ? SOCIAL_BOT_STATE.platforms : {
        bale: { channel_id: '', is_configured: false },
        rubika: { channel_id: '', is_configured: false },
        eitaa: { channel_id: '', is_configured: false },
        soroush: { channel_id: '', is_configured: false },
        telegram: { channel_id: '', proxy: '', is_configured: false }
      };

      const tabTitles = {
        pending_queue: '⏳ ۱. صف تایید غرفه‌ها و محتوا',
        ahdbot_admin: '🤖 ۲. ارسال پیام عهدبات به کانال‌های ثبت‌شده کاربران',
        booths_users: '🏪 ۳. مدیریت غرفه‌داران و اعضا',
        all_listings: '📦 ۴. مدیریت کل آگهی‌های بازار',
        promotions: '🚀 ۵. تایید نردبان، فوری و شگفت‌انگیز',
        orders: '🛍️ ۶. سفارش‌های بازار و تنظیمات اپلیکیشن'
      };

      return `
        <div class="max-w-5xl mx-auto space-y-5 pb-24">
          <!-- نوار باریک و تمیز باز کردن منوی کشویی مدیریت (هم در موبایل و هم در دسکتاپ به صورت منوی کشویی بازشونده) -->
          <div class="glass-panel rounded-2xl p-3 sm:p-4 border border-amber-400/40 flex flex-wrap items-center justify-between gap-3 shadow-xl">
            <div class="flex items-center gap-2.5">
              <button type="button" onclick="openAdminSideDrawer()" class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg transition">
                <svg viewBox="0 0 24 24" class="svg-icon w-4 h-4" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                <span>منوی کشویی مدیریت سامانه</span>
                <span class="px-2 py-0.5 rounded-full bg-slate-950 text-amber-300 text-[10px] font-black">${p.total.toLocaleString('fa-IR')}</span>
              </button>
              <span class="font-black text-white text-xs sm:text-sm">${tabTitles[tab] || tabTitles.pending_queue}</span>
            </div>

            <div class="flex items-center gap-2 text-xs">
              <button type="button" onclick="navigateToAdminDashboard('ahdbot_admin')" class="px-3 py-2 rounded-xl ${tab === 'ahdbot_admin' ? 'bg-cyan-400 text-slate-950 font-black' : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-200 font-bold'}">
                🤖 ارسال پیام عهدبات (${approvedBotChannels.length.toLocaleString('fa-IR')} کانال)
              </button>
              <button type="button" onclick="returnToLandingPage()" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold">
                پیشخوان ←
              </button>
            </div>
          </div>

          <!-- محتوای بخش فعال مدیریت -->
          <div class="glass-panel rounded-3xl p-5 sm:p-6 text-xs space-y-6 border border-white/15">
            ${tab === 'pending_queue' ? `
              <!-- ۱. صف تایید کانال‌های عهدبات، غرفه‌ها، آگهی‌ها، استوری‌ها و بنرها -->
              ${pendingBotChannels.length > 0 ? `
                <div class="space-y-3 pb-4 border-b border-white/10">
                  <div class="flex items-center justify-between">
                    <h3 class="font-black text-cyan-300 text-sm">🤖 کانال‌های عهدبات در انتظار بررسی و تایید (${pendingBotChannels.length.toLocaleString('fa-IR')})</h3>
                    <button type="button" onclick="navigateToAdminDashboard('ahdbot_admin')" class="text-[11px] text-amber-300 font-bold hover:underline">بخش کامل مدیریت عهدبات ←</button>
                  </div>
                  ${pendingBotChannels.map(ch => {
                    const chUrl = getBotChannelDirectUrl(ch.platform, ch.channel_id, ch.channel_link);
                    const pfLabel = typeof getPlatformFaLabel === 'function' ? getPlatformFaLabel(ch.platform) : ch.platform;
                    return `
                      <div class="glass-card p-4 rounded-2xl border border-cyan-400/45 space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                          <div class="space-y-1.5">
                            <div class="flex flex-wrap items-center gap-2">
                              <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black">⏳ منتظر تایید مدیریت</span>
                              <span class="px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-black text-[10px]">${escapeHtml(pfLabel)}</span>
                              <strong class="text-white text-sm">${escapeHtml(ch.media_title || ch.channel_title)}</strong>
                              <a href="${escapeHtml(chUrl)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-400/50 text-amber-300 font-mono text-xs dir-ltr underline" title="کلیک یا تاچ جهت باز شدن مستقیم کانال در پیام‌رسان">
                                🔗 ${escapeHtml(ch.channel_id)} ↗
                              </a>
                            </div>
                            <div class="text-slate-300 text-[11px]">
                              ثبت‌کننده: <strong>${escapeHtml(ch.owner_name || ch.owner_username)}</strong> (<code class="dir-ltr text-cyan-300">${escapeHtml(ch.owner_username)}</code>) • تعداد اعضای اعلامی کاربر: <strong class="text-emerald-300">${Number(ch.members_count || 500).toLocaleString('fa-IR')} نفر</strong>
                            </div>
                            <div class="text-[11px] flex flex-wrap items-center gap-1.5 pt-0.5">
                              <span class="text-slate-400">لینک مستقیم بررسی کانال:</span>
                              <a href="${escapeHtml(chUrl)}" target="_blank" rel="noopener noreferrer" class="text-cyan-300 hover:text-amber-300 underline font-mono dir-ltr break-all">${escapeHtml(chUrl)}</a>
                            </div>
                          </div>
                          <div class="flex flex-wrap items-center gap-2">
                            <a href="${escapeHtml(chUrl)}" target="_blank" rel="noopener noreferrer" class="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs inline-flex items-center gap-1.5 shadow">
                              <span>👁️ باز کردن کانال و بررسی اعضا ↗</span>
                            </a>
                            <button type="button" onclick="adminApproveBotChannel(${Number(ch.id)})" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black">✔ تایید و فعال‌سازی</button>
                            <button type="button" onclick="adminRejectBotChannel(${Number(ch.id)})" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold">✕ رد کانال</button>
                          </div>
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              ` : ''}

              <div class="space-y-3 pb-4 border-b border-white/10">
                <h3 class="font-black text-amber-300 text-sm">الف) درخواست‌های تایید هویت و ایجاد غرفه جدید (${(p.booths || []).length.toLocaleString('fa-IR')})</h3>
                ${(p.booths || []).length === 0 ? `<div class="glass-card p-3 rounded-xl text-slate-400">هیچ درخواست ایجاد غرفه‌ای در انتظار تایید نیست.</div>` : (p.booths || []).map(u => `
                  <div class="glass-card p-4 rounded-2xl border border-amber-400/40 space-y-3">
                    <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-2.5">
                      <div>
                        <span class="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black ml-2">در انتظار تایید ایجاد غرفه</span>
                        <strong class="text-white text-sm">${escapeHtml(u.first_name || '')} ${escapeHtml(u.last_name || u.display_name || '')}</strong>
                        <span class="text-cyan-300 text-xs mr-2">(نام کاربری: <code class="dir-ltr">${escapeHtml(u.username)}</code>)</span>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <button type="button" onclick="adminApproveUserBooth('${escapeHtml(u.username)}')" class="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow">
                          ✔ تایید اطلاعات و فعال‌سازی غرفه
                        </button>
                        <button type="button" onclick="openAdminRejectBoothModal('${escapeHtml(u.username)}')" class="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs">
                          ✕ رد مدارک
                        </button>
                      </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-[11px] bg-slate-950/60 p-3 rounded-xl">
                      <div><span class="text-slate-400">نام:</span> <strong class="text-white">${escapeHtml(u.first_name || u.display_name || '-')}</strong></div>
                      <div><span class="text-slate-400">نام خانوادگی:</span> <strong class="text-white">${escapeHtml(u.last_name || '-')}</strong></div>
                      <div><span class="text-slate-400">کد ملی:</span> <strong class="text-cyan-300 dir-ltr">${escapeHtml(u.national_code || '-')}</strong></div>
                      <div><span class="text-slate-400">شماره تماس:</span> <strong class="text-emerald-300 dir-ltr">${escapeHtml(u.phone || '-')}</strong></div>
                      <div class="sm:col-span-4"><span class="text-slate-400">آدرس دقیق:</span> <strong class="text-white">${escapeHtml(u.exact_address || u.alley || '-')}</strong></div>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="space-y-3 pb-4 border-b border-white/10">
                <h3 class="font-black text-amber-300 text-sm">ب) آگهی‌های عهد بازار در انتظار تایید (${p.listings.length.toLocaleString('fa-IR')})</h3>
                ${p.listings.length === 0 ? `<div class="glass-card p-3 rounded-xl text-slate-400">هیچ آگهی جدیدی در انتظار تایید نیست.</div>` : p.listings.map(l => `
                  <div class="glass-card p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div class="flex items-center gap-3.5">
                      <img src="${l.image_data}" class="w-16 h-16 object-cover rounded-xl shrink-0" />
                      <div>
                        <div class="font-black text-white text-sm">${escapeHtml(l.title)} (${formatPrice(l.price)} ${escapeHtml(l.price_unit)})</div>
                        <div class="text-slate-300 mt-0.5">${escapeHtml(l.description)}</div>
                        <div class="text-cyan-300 text-[11px] mt-1">غرفه: ${escapeHtml(l.booth_title)} • تلفن: ${escapeHtml(l.seller_phone)}</div>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2 shrink-0">
                      <button type="button" onclick="adminApproveListing(${l.id})" class="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black">✔ تایید و انتشار</button>
                      <button type="button" onclick="openAdminRejectListingModal(${l.id})" class="px-3.5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black">⚠ رد با علت</button>
                      <button type="button" onclick="deleteMarketListing(${l.id})" class="px-3 py-2 rounded-xl bg-rose-600 text-white font-bold">🗑 حذف</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <div class="space-y-3">
                <h3 class="font-black text-rose-300 text-sm">ج) استوری‌ها و بنرهای در انتظار تایید (${(p.stories.length + p.slides.length).toLocaleString('fa-IR')})</h3>
                ${(p.stories.length === 0 && p.slides.length === 0) ? `<div class="glass-card p-3 rounded-xl text-slate-400">هیچ استوری یا بنری در انتظار تایید نیست.</div>` : ''}
                ${p.stories.map(st => `
                  <div class="glass-card p-3 rounded-2xl flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <img src="${st.image_data}" class="w-12 h-12 rounded-full object-cover border-2 border-rose-400" />
                      <div>
                        <div class="font-black text-white">${escapeHtml(st.booth_title)}</div>
                        <div class="text-slate-300">${escapeHtml(st.caption)}</div>
                      </div>
                    </div>
                    <div class="flex gap-2">
                      <button type="button" onclick="adminApproveStory(${st.id})" class="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black">✔ تایید استوری</button>
                      <button type="button" onclick="adminDeleteStory(${st.id})" class="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold">✕ حذف</button>
                    </div>
                  </div>
                `).join('')}
                ${p.slides.map(s => `
                  <div class="glass-card p-3 rounded-2xl flex items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <img src="${s.image_data}" class="w-16 h-12 object-cover rounded-xl" />
                      <div class="font-black text-white">${escapeHtml(s.photographer_name)}</div>
                    </div>
                    <div class="flex gap-2">
                      <button type="button" onclick="adminApproveSlide(${s.id})" class="px-3.5 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black">✔ تایید بنر</button>
                      <button type="button" onclick="adminDeleteSlideById(${s.id})" class="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold">✕ حذف</button>
                    </div>
                  </div>
                `).join('')}
              </div>

            ` : tab === 'ahdbot_admin' ? `
              <!-- ۲. مدیریت عهدبات در داشبورد مدیریت: ثبت/بروزرسانی ربات‌های مادر توسط ادمین + ارسال پیام سراسری به کانال‌های ثبت‌شده کاربران -->
              <div class="space-y-5">
                <div class="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-3">
                  <div>
                    <h2 class="text-base sm:text-lg font-black text-cyan-300">🤖 مدیریت عهدبات (ارسال پیام مدیریت به کانال‌های ثبت‌شده کاربران)</h2>
                    <p class="text-[11px] text-slate-300 mt-0.5">
                      هیچ ربات یا کانالی به صورت فیک یا هاردکد ثبت نشده است؛ ادمین مشخصات ربات‌های ۴ شبکه را در کادر زیر وارد و بروزرسانی می‌کند و کاربران کانال‌ها و گروه‌های خود را اضافه می‌نمایند.
                    </p>
                  </div>
                  <span class="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-400/35 text-emerald-300 font-black text-xs">
                    📡 ${approvedBotChannels.length.toLocaleString('fa-IR')} کانال و گروه ثبت‌شده توسط کاربران
                  </span>
                </div>

                <!-- ربات مرکزی عهدبات به صورت هاردکد (@Hamahdibot) در config.php تنظیم شده است -->
                <div class="p-3.5 rounded-2xl bg-slate-950/85 border border-cyan-400/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span class="font-black text-amber-300">🤖 ربات مرکزی سامانه در بله، روبیکا و تلگرام: <code class="font-mono dir-ltr text-emerald-300">@Hamahdibot</code></span>
                  <span class="text-[11px] text-slate-300">توکن‌های ربات به صورت هاردکد و امن از فایل <code class="font-mono dir-ltr text-cyan-300">config.php</code> خوانده می‌شوند.</span>
                </div>

                <!-- ب) میز کار ارسال پیام توسط ادمین به کانال‌ها و گروه‌های ثبت‌شده کاربران -->
                ${typeof renderSocialBotStudioPage === 'function' ? renderSocialBotStudioPage(true, true) : ''}
              </div>

            ` : tab === 'promotions' ? `
              <div class="space-y-3">
                <h3 class="font-black text-purple-300 text-sm">درخواست‌های نردبان، فوری و پیشنهاد شگفت‌انگیز غرفه‌داران (${p.promos.length.toLocaleString('fa-IR')})</h3>
                ${p.promos.length === 0 ? `<div class="glass-card p-4 rounded-xl text-slate-400">هیچ درخواست ارتقایی در صف انتظار نیست. از بخش «مدیریت کل آگهی‌ها» نیز می‌توانید هر آگهی را مستقیماً ارتقا دهید.</div>` : p.promos.map(l => `
                  <div class="glass-card p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div class="font-black text-white text-sm">${escapeHtml(l.title)} (${escapeHtml(l.booth_title)})</div>
                      <div class="text-amber-300 mt-1">
                        ${l.ladder_status === 'pending' ? '<span class="ml-3">🚀 متقاضی نردبان</span>' : ''}
                        ${l.urgent_status === 'pending' ? '<span class="ml-3">🔥 متقاضی نشان فوری</span>' : ''}
                        ${l.amazing_status === 'pending' ? '<span class="ml-3">⚡ متقاضی پیشنهاد شگفت‌انگیز</span>' : ''}
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-2">
                      ${l.ladder_status === 'pending' ? `<button type="button" onclick="adminApprovePromotion(${l.id}, 'ladder')" class="px-3 py-1.5 rounded-xl bg-purple-500 text-white font-black">✔ تایید نردبان</button>` : ''}
                      ${l.urgent_status === 'pending' ? `<button type="button" onclick="adminApprovePromotion(${l.id}, 'urgent')" class="px-3 py-1.5 rounded-xl bg-rose-500 text-white font-black">✔ تایید فوری</button>` : ''}
                      ${l.amazing_status === 'pending' ? `<button type="button" onclick="adminApprovePromotion(${l.id}, 'amazing')" class="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black">✔ تایید شگفت‌انگیز</button>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>

            ` : tab === 'all_listings' ? `
              <div class="space-y-3">
                <h3 class="font-black text-emerald-300 text-sm">مدیریت و ارتقای مستقیم تمامی آگهی‌های عهد بازار (${(state.listings || []).length.toLocaleString('fa-IR')})</h3>
                ${(state.listings || []).length === 0 ? `<div class="text-slate-400">هنوز آگهی ثبت نشده است.</div>` : state.listings.map(l => `
                  <div class="glass-card p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <img src="${l.image_data}" class="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <div class="font-black text-white">${escapeHtml(l.title)} <span class="text-[10px] ${l.status === 'approved' ? 'text-emerald-300' : 'text-amber-300'}">(${l.status === 'approved' ? 'منتشرشده' : 'در انتظار تایید'})</span></div>
                        <div class="text-slate-400">${escapeHtml(l.booth_title)} • ${formatPrice(l.price)} ${escapeHtml(l.price_unit)}</div>
                      </div>
                    </div>
                    <div class="flex flex-wrap gap-1.5">
                      <button type="button" onclick="adminApprovePromotion(${l.id}, 'ladder')" class="px-2.5 py-1.5 rounded-xl bg-purple-600 text-white font-bold">🚀 نردبان</button>
                      <button type="button" onclick="adminApprovePromotion(${l.id}, 'urgent')" class="px-2.5 py-1.5 rounded-xl bg-rose-600 text-white font-bold">🔥 فوری</button>
                      <button type="button" onclick="adminApprovePromotion(${l.id}, 'amazing')" class="px-2.5 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black">⚡ شگفت‌انگیز</button>
                      <button type="button" onclick="deleteMarketListing(${l.id})" class="px-2.5 py-1.5 rounded-xl bg-rose-800 text-white font-bold">🗑 حذف</button>
                    </div>
                  </div>
                `).join('')}
              </div>

            ` : tab === 'booths_users' ? `
              <div class="space-y-3">
                <h3 class="font-black text-cyan-300 text-sm">فهرست غرفه‌داران، مشخصات عضویت و وضعیت تایید غرفه (${allUsers.length.toLocaleString('fa-IR')})</h3>
                ${allUsers.length === 0 ? `<div class="text-slate-400">هنوز کاربری ثبت‌نام نکرده است.</div>` : allUsers.map(u => `
                  <div class="glass-card p-4 rounded-2xl space-y-3 border ${u.booth_status === 'pending' ? 'border-amber-400/50' : 'border-white/10'}">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div class="flex items-center gap-2">
                          <span class="font-black text-white text-sm">${escapeHtml(u.booth_title || ('غرفه ' + u.display_name))}</span>
                          <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${(u.booth_status || 'approved') === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : u.booth_status === 'rejected' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}">
                            ${(u.booth_status || 'approved') === 'approved' ? '✔ غرفه تاییدشده' : u.booth_status === 'rejected' ? '❌ ردشده' : '⏳ در انتظار تایید غرفه'}
                          </span>
                        </div>
                        <div class="text-slate-300 mt-1">نام: <strong>${escapeHtml(u.display_name)}</strong> • نام کاربری: <code class="text-cyan-300">${escapeHtml(u.username)}</code> • کد ملی: <strong>${escapeHtml(u.national_code || '-')}</strong></div>
                        <div class="text-slate-400 mt-0.5">تلفن: ${escapeHtml(u.phone)} • آدرس: ${escapeHtml(u.exact_address || u.alley)}</div>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        ${(u.booth_status !== 'approved') ? `<button type="button" onclick="adminApproveUserBooth('${escapeHtml(u.username)}')" class="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black">✔ تایید غرفه</button>` : ''}
                        <button type="button" onclick="openBoothPage('${escapeHtml(u.username)}')" class="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-bold">مشاهده غرفه</button>
                        <button type="button" onclick="adminToggleSuspendUser('${escapeHtml(u.username)}')" class="px-3 py-1.5 rounded-xl ${u.is_suspended ? 'bg-emerald-500 text-slate-950' : 'bg-rose-600 text-white'} font-bold">
                          ${u.is_suspended ? 'رفع مسدودیت' : 'مسدودسازی'}
                        </button>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>

            ` : `
              <!-- ۶. سفارش‌های بازار و تنظیمات کلان اپلیکیشن -->
              <div class="space-y-6">
                <div class="p-4 rounded-2xl bg-slate-950/70 border border-cyan-400/35 space-y-3">
                  <h3 class="font-black text-cyan-300 text-sm">⚙️ وضعیت ماژول‌های سوپراپلیکیشن هم‌عهدی</h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
                    <div class="glass-card p-3 rounded-xl border border-emerald-400/40 flex items-center justify-between">
                      <span class="font-bold text-white">🏪 عهد بازار</span>
                      <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px]">فعال</span>
                    </div>
                    <div class="glass-card p-3 rounded-xl border border-emerald-400/40 flex items-center justify-between">
                      <span class="font-bold text-white">🤖 عهدبات</span>
                      <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-black text-[10px]">فعال (+۵۰۰ عضو)</span>
                    </div>
                    <div class="glass-card p-3 rounded-xl border border-rose-400/40 flex items-center justify-between">
                      <span class="font-bold text-slate-300">🎙️ عهدینو</span>
                      <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black text-[10px]">🔒 قفل موقت</span>
                    </div>
                    <div class="glass-card p-3 rounded-xl border border-rose-400/40 flex items-center justify-between">
                      <span class="font-bold text-slate-300">🎬 عهدانه</span>
                      <span class="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-black text-[10px]">🔒 قفل موقت</span>
                    </div>
                  </div>
                </div>

                <div class="space-y-3">
                  <h3 class="font-black text-sky-300 text-sm">🛍️ فهرست سفارش‌های ثبت‌شده در عهد بازار (${(state.orders || []).length.toLocaleString('fa-IR')})</h3>
                  ${(state.orders || []).length === 0 ? `<div class="text-slate-400">هنوز سفارشی ثبت نشده است.</div>` : state.orders.map(o => `
                    <div class="glass-card p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div class="font-black text-amber-300">${escapeHtml(o.order_code)} — ${escapeHtml(o.listing_title)}</div>
                        <div class="text-slate-300">خریدار: ${escapeHtml(o.buyer_name)} (${escapeHtml(o.buyer_phone)}) • آدرس: ${escapeHtml(o.buyer_address)}</div>
                      </div>
                      <div class="font-black text-emerald-300 text-sm">${formatPrice(o.total_price)} تومان</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `}
          </div>
        </div>
      `;
    }

    function adminApproveBotChannel(channelId) {
      if (!isAdmin()) return;
      const list = (typeof ensureRegisteredBotChannelsInitialized === 'function')
        ? ensureRegisteredBotChannelsInitialized()
        : (state.registeredBotChannels || []);
      const found = list.find(c => Number(c.id) === Number(channelId));
      if (found) {
        found.status = 'approved';
        found.is_verified = 1;
        delete found.rejection_reason;
      }
      saveState();
      renderCurrentPage(true);
      callServerApi('approve_bot_channel', {
        id: Number(channelId),
        channel_id: found ? found.channel_id : '',
        platform: found ? found.platform : '',
        owner_username: found ? found.owner_username : ''
      });
      showToast('✅ کانال کاربر تایید شد و دسترسی ارسال در عهدبات برای ایشان فعال گردید.');
    }

    function adminRejectBotChannel(channelId) {
      if (!isAdmin()) return;
      const list = (typeof ensureRegisteredBotChannelsInitialized === 'function')
        ? ensureRegisteredBotChannelsInitialized()
        : (state.registeredBotChannels || []);
      const found = list.find(c => Number(c.id) === Number(channelId));
      if (found) {
        found.status = 'rejected';
        found.is_verified = 0;
      }
      saveState();
      renderCurrentPage(true);
      callServerApi('reject_bot_channel', {
        id: Number(channelId),
        channel_id: found ? found.channel_id : '',
        platform: found ? found.platform : '',
        owner_username: found ? found.owner_username : ''
      });
      showToast('وضعیت کانال به «ردشده / معلق» تغییر یافت.', 'warning');
    }

    function adminApproveSlide(slideId) {
      if (!isAdmin()) return;
      const s = state.heroSlides.find(i => i.id === Number(slideId));
      if (s) s.status = 'approved';
      saveState();
      renderCurrentPage();
      callServerApi('approve_slide', { id: Number(slideId) });
      showToast('تصویر بنر تایید و منتشر شد.');
    }

    function adminDeleteSlideById(slideId) {
      if (!isAdmin()) return;
      state.heroSlides = state.heroSlides.filter(i => i.id !== Number(slideId));
      state.activeSlideIndex = 0;
      saveState();
      renderCurrentPage();
      callServerApi('delete_slide', { id: Number(slideId) });
      showToast('تصویر بنر حذف شد.', 'warning');
    }

    function adminApproveStory(storyId) {
      if (!isAdmin()) return;
      const st = state.stories.find(i => i.id === Number(storyId));
      if (st) st.status = 'approved';
      saveState();
      renderCurrentPage();
      callServerApi('approve_story', { id: Number(storyId) });
      showToast('استوری کسب‌وکار تایید و منتشر شد.');
    }

    function adminDeleteStory(storyId) {
      if (!isAdmin()) return;
      state.stories = state.stories.filter(i => i.id !== Number(storyId));
      closeModal();
      saveState();
      renderCurrentPage();
      callServerApi('delete_story', { id: Number(storyId) });
      showToast('استوری حذف شد.', 'warning');
    }

    function adminApproveListing(listingId) {
      if (!isAdmin()) return;
      const l = state.listings.find(i => i.id === Number(listingId));
      if (l) l.status = 'approved';
      saveState();
      renderCurrentPage();
      callServerApi('approve_listing', { id: Number(listingId) });
      showToast('آگهی تایید و در بازار منتشر شد.');
    }

    function adminApprovePromotion(listingId, promoType) {
      if (!isAdmin()) return;
      const l = state.listings.find(i => i.id === Number(listingId));
      if (l) {
        if (promoType === 'ladder') { l.ladder_status = 'approved'; l.laddered_at = Date.now(); }
        if (promoType === 'urgent') { l.urgent_status = 'approved'; l.is_urgent = true; }
        if (promoType === 'amazing') { l.amazing_status = 'approved'; l.is_amazing = true; if (!l.discount_percent) l.discount_percent = 15; }
      }
      saveState();
      renderCurrentPage();
      callServerApi('approve_promotion', { id: Number(listingId), promo_type: promoType });
      showToast('ارتقای آگهی (نردبان / فوری / شگفت‌انگیز) توسط ادمین تایید و اعمال شد.');
    }

    function adminToggleSuspendUser(username) {
      if (!isAdmin()) return;
      const u = state.users[username];
      if (!u) return;
      u.is_suspended = !u.is_suspended;
      saveState();
      renderCurrentPage();
      callServerApi('toggle_user_suspend', { username: username, suspend: u.is_suspended });
      showToast(u.is_suspended ? 'غرفه کاربر مسدود شد.' : 'مسدودیت غرفه رفع گردید.', 'warning');
    }

    function adminApproveMessage(listingId, msgId) {
      if (!isAdmin()) return;
      const l = state.listings.find(i => i.id === Number(listingId));
      if (l && l.messages) {
        const m = l.messages.find(x => x.id === Number(msgId));
        if (m) m.status = 'approved';
      }
      saveState();
      renderCurrentPage();
      callServerApi('approve_message', { id: Number(msgId) });
      showToast('پیام تایید و منتشر شد.');
    }

    function adminDeleteMessage(listingId, msgId) {
      if (!isAdmin()) return;
      const l = state.listings.find(i => i.id === Number(listingId));
      if (l && l.messages) {
        l.messages = l.messages.filter(x => x.id !== Number(msgId));
      }
      saveState();
      renderCurrentPage();
      callServerApi('delete_message', { id: Number(msgId) });
      showToast('پیام حذف شد.', 'warning');
    }

    function deleteMarketListing(id) {
      const target = (state.listings || []).find(l => l.id === Number(id));
      const isOwner = Boolean(target && state.currentUser && state.currentUser.username === target.seller_username);
      if (!isAdmin() && !isOwner) {
        showToast('فقط صاحب غرفه یا ادمین مجاز به حذف آگهی است!', 'error');
        return;
      }
      state.listings = state.listings.filter(l => l.id !== Number(id));
      saveState();
      renderCurrentPage();
      callServerApi('delete_listing', { id: Number(id), seller_username: state.currentUser ? state.currentUser.username : '' });
      showToast('آگهی با موفقیت حذف شد.', 'warning');
    }


    // =========================================================================
    // REQUIREMENT 8: ADMIN REJECTION REASON WORKFLOW (ثبت علت رد آگهی برای غرفه‌دار)
    // =========================================================================
    function openAdminRejectListingModal(listingId) {
      if (!isAdmin()) return;
      const l = state.listings.find(i => i.id === Number(listingId));
      if (!l) return;
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-amber-300 text-base">ثبت علت رد آگهی: ${escapeHtml(l.title)}</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 font-bold">✕</button>
          </div>
          <p class="text-slate-300">علت رد شدن این آگهی را انتخاب یا تایپ کنید تا در «غرفه من» به آگهی‌دهنده (${escapeHtml(l.seller_name)}) نمایش داده شود:</p>
          <div class="flex flex-wrap gap-1.5">
            <button type="button" onclick="document.getElementById('rej-reason-inp').value='تصویر بارگذاری‌شده واضح یا مرتبط با کالا نیست.'" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200">تصویر واضح نیست</button>
            <button type="button" onclick="document.getElementById('rej-reason-inp').value='قیمت درج‌شده نامتعارف است؛ لطفاً قیمت واقعی درج فرمایید.'" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200">قیمت نامتعارف است</button>
            <button type="button" onclick="document.getElementById('rej-reason-inp').value='توضیحات آگهی ناقص است؛ لطفاً مشخصات دقیق‌تری بنویسید.'" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200">توضیحات ناقص است</button>
          </div>
          <form onsubmit="submitAdminRejectListing(event, ${l.id})" class="space-y-3">
            <textarea id="rej-reason-inp" rows="3" required placeholder="علت رد آگهی را بنویسید..." class="glass-input w-full px-3 py-2 rounded-xl"></textarea>
            <button type="submit" class="w-full py-3 rounded-xl bg-amber-400 text-slate-950 font-black">ثبت علت رد و اطلاع به غرفه‌دار</button>
          </form>
        </div>
      `);
    }

    function submitAdminRejectListing(e, listingId) {
      e.preventDefault();
      if (!isAdmin()) return;
      const reason = document.getElementById('rej-reason-inp').value.trim();
      const l = state.listings.find(i => i.id === Number(listingId));
      if (l) {
        l.status = 'rejected';
        l.rejection_reason = reason;
      }
      closeModal();
      saveState();
      renderCurrentPage();
      callServerApi('reject_listing', { id: Number(listingId), rejection_reason: reason });
      showToast('علت رد آگهی ثبت شد و در غرفه کاربر قابل مشاهده است.', 'warning');
    }

    // =========================================================================
    // REQUIREMENT 7: 1-CLICK ADMIN FULL BACKUP (دکمه پشتیبان‌گیری یک‌کلیکی)
    // =========================================================================
    async function downloadAdminFullBackup() {
      if (!isAdmin()) return;
      let backupObj = {
        platform: 'هم‌عهدی - شمال شرق مشهد',
        version: '5.0',
        exported_at: new Date().toISOString(),
        state: state
      };
      const srv = await callServerApi('export_backup');
      if (srv && srv.data) {
        backupObj = srv;
      }
      const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'hamahdi_tabarsi_backup_' + new Date().toISOString().slice(0, 10) + '.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('فایل پشتیبان کامل پایگاه داده (Backup) با موفقیت دانلود شد.');
    }

    // =========================================================================
    // REQUIREMENT 2: AUTOMATIC BOOTH PROMO CARD & QR GENERATOR (تولید خودکار کارت تبلیغاتی غرفه‌ها)
    // Generates a high-resolution Persian Promotional Poster + Stylized QR Code on HTML5 <canvas>
    // =========================================================================
    function generateRealQrMatrix(text) {
      const data = Array.from(new TextEncoder().encode(String(text || 'https://hamahdi.ir')));
      const VERSIONS = [
        null,
        { v: 1, totalData: 19, ecPerBlock: 7, blocks: 1, align: [] },
        { v: 2, totalData: 34, ecPerBlock: 10, blocks: 1, align: [6, 18] },
        { v: 3, totalData: 55, ecPerBlock: 15, blocks: 1, align: [6, 22] },
        { v: 4, totalData: 80, ecPerBlock: 20, blocks: 1, align: [6, 26] },
        { v: 5, totalData: 108, ecPerBlock: 26, blocks: 1, align: [6, 30] },
        { v: 6, totalData: 136, ecPerBlock: 18, blocks: 2, align: [6, 34] },
        { v: 7, totalData: 156, ecPerBlock: 20, blocks: 2, align: [6, 22, 38] },
        { v: 8, totalData: 194, ecPerBlock: 24, blocks: 2, align: [6, 24, 42] }
      ];
      let ver = VERSIONS[8];
      for (let i = 1; i <= 8; i++) {
        const cap = VERSIONS[i].totalData - 2;
        if (data.length <= cap) { ver = VERSIONS[i]; break; }
      }
      const maxLen = ver.totalData - 2;
      const bytes = data.slice(0, maxLen);

      const bits = [];
      const pushBits = (val, len) => {
        for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1);
      };
      pushBits(0b0100, 4);
      pushBits(bytes.length, 8);
      bytes.forEach(b => pushBits(b, 8));
      pushBits(0, Math.min(4, ver.totalData * 8 - bits.length));
      while (bits.length % 8 !== 0) bits.push(0);
      const codewords = [];
      for (let i = 0; i < bits.length; i += 8) {
        let b = 0;
        for (let j = 0; j < 8; j++) b = (b << 1) | bits[i + j];
        codewords.push(b);
      }
      let padIdx = 0;
      while (codewords.length < ver.totalData) {
        codewords.push(padIdx % 2 === 0 ? 0xEC : 0x11);
        padIdx++;
      }

      const exp = new Uint8Array(512);
      const log = new Uint8Array(256);
      let x = 1;
      for (let i = 0; i < 255; i++) {
        exp[i] = x;
        log[x] = i;
        x <<= 1;
        if (x & 0x100) x ^= 0x11d;
      }
      for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
      const gfMul = (a, b) => (a === 0 || b === 0) ? 0 : exp[log[a] + log[b]];

      const rsEncode = (msg, ecLen) => {
        let gen = [1];
        for (let i = 0; i < ecLen; i++) {
          const next = new Array(gen.length + 1).fill(0);
          for (let j = 0; j < gen.length; j++) {
            next[j] ^= gen[j];
            next[j + 1] ^= gfMul(gen[j], exp[i]);
          }
          gen = next;
        }
        const rem = new Array(ecLen).fill(0);
        for (let i = 0; i < msg.length; i++) {
          const factor = msg[i] ^ rem[0];
          rem.shift();
          rem.push(0);
          for (let j = 0; j < ecLen; j++) {
            rem[j] ^= gfMul(gen[j + 1], factor);
          }
        }
        return rem;
      };

      const dataBlocks = [];
      const ecBlocks = [];
      const blockSize = Math.floor(ver.totalData / ver.blocks);
      for (let b = 0; b < ver.blocks; b++) {
        const slice = codewords.slice(b * blockSize, (b + 1) * blockSize);
        dataBlocks.push(slice);
        ecBlocks.push(rsEncode(slice, ver.ecPerBlock));
      }
      const finalBytes = [];
      for (let i = 0; i < blockSize; i++) {
        for (let b = 0; b < ver.blocks; b++) finalBytes.push(dataBlocks[b][i]);
      }
      for (let i = 0; i < ver.ecPerBlock; i++) {
        for (let b = 0; b < ver.blocks; b++) finalBytes.push(ecBlocks[b][i]);
      }

      const size = ver.v * 4 + 17;
      const mat = Array.from({ length: size }, () => new Array(size).fill(0));
      const isFunc = Array.from({ length: size }, () => new Uint8Array(size));

      const setModule = (r, c, val, func = true) => {
        if (r >= 0 && r < size && c >= 0 && c < size) {
          mat[r][c] = val ? 1 : 0;
          if (func) isFunc[r][c] = 1;
        }
      };

      const drawFinder = (r0, c0) => {
        for (let dr = -1; dr <= 7; dr++) {
          for (let dc = -1; dc <= 7; dc++) {
            const on = (dr >= 0 && dr <= 6 && (dc === 0 || dc === 6)) ||
                       (dc >= 0 && dc <= 6 && (dr === 0 || dr === 6)) ||
                       (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
            setModule(r0 + dr, c0 + dc, on, true);
          }
        }
      };
      drawFinder(0, 0);
      drawFinder(0, size - 7);
      drawFinder(size - 7, 0);

      for (let i = 8; i < size - 8; i++) {
        setModule(6, i, i % 2 === 0, true);
        setModule(i, 6, i % 2 === 0, true);
      }

      const al = ver.align;
      for (let i = 0; i < al.length; i++) {
        for (let j = 0; j < al.length; j++) {
          if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) continue;
          const cr = al[i], cc = al[j];
          for (let dr = -2; dr <= 2; dr++) {
            for (let dc = -2; dc <= 2; dc++) {
              const on = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
              setModule(cr + dr, cc + dc, on, true);
            }
          }
        }
      }

      if (ver.v >= 7) {
        const verBits = ver.v === 7 ? 0x07C94 : 0x085BC;
        for (let i = 0; i < 18; i++) {
          const bit = (verBits >>> i) & 1;
          const r = Math.floor(i / 3);
          const c = size - 11 + (i % 3);
          setModule(r, c, bit, true);
          setModule(c, r, bit, true);
        }
      }

      for (let i = 0; i < 9; i++) {
        if (i !== 6) { isFunc[8][i] = 1; isFunc[i][8] = 1; }
      }
      for (let i = 0; i < 8; i++) {
        isFunc[8][size - 1 - i] = 1;
        isFunc[size - 1 - i][8] = 1;
      }
      setModule(size - 8, 8, 1, true);

      let bitIdx = 0;
      const totalBits = finalBytes.length * 8;
      let up = true;
      for (let right = size - 1; right >= 1; right -= 2) {
        if (right === 6) right = 5;
        for (let vert = 0; vert < size; vert++) {
          const r = up ? (size - 1 - vert) : vert;
          for (let j = 0; j < 2; j++) {
            const c = right - j;
            if (!isFunc[r][c]) {
              let bit = 0;
              if (bitIdx < totalBits) {
                bit = (finalBytes[bitIdx >>> 3] >>> (7 - (bitIdx & 7))) & 1;
                bitIdx++;
              }
              if ((r + c) % 2 === 0) bit ^= 1;
              mat[r][c] = bit;
            }
          }
        }
        up = !up;
      }

      const fmtBits = 0x77c4;
      for (let i = 0; i <= 5; i++) setModule(i, 8, (fmtBits >>> i) & 1, true);
      setModule(7, 8, (fmtBits >>> 6) & 1, true);
      setModule(8, 8, (fmtBits >>> 7) & 1, true);
      setModule(8, 7, (fmtBits >>> 8) & 1, true);
      for (let i = 9; i < 15; i++) setModule(8, 14 - i, (fmtBits >>> i) & 1, true);
      for (let i = 0; i < 8; i++) setModule(8, size - 1 - i, (fmtBits >>> i) & 1, true);
      for (let i = 8; i < 15; i++) setModule(size - 15 + i, 8, (fmtBits >>> i) & 1, true);

      return mat;
    }

    function getCanonicalBaseUrlForQr() {
      const loc = window.location;
      const base = (loc.protocol === 'http:' || loc.protocol === 'https:')
        ? (loc.origin + loc.pathname.replace(/index\.html$/i, ''))
        : 'https://hamahdi.ir/';
      return base.endsWith('/') ? base : (base + '/');
    }

    function buildQrPosterSpecForPage(customSpec = null) {
      const baseUrl = getCanonicalBaseUrlForQr();
      if (customSpec && typeof customSpec === 'object') {
        return customSpec;
      }
      const page = state.currentPage || 'landing';
      if (page === 'booth') {
        const uname = state.selectedBoothUsername || (state.currentUser && state.currentUser.username) || 'mahmoud_rezvani';
        const u = (state.users && state.users[uname]) || state.currentUser || {};
        return {
          badge: 'غرفه و واحد صنفی تاییدشده عهد بازار',
          title: u.booth_title || ('غرفه ' + (u.display_name || uname)),
          subtitle: 'مدیریت غرفه: ' + (u.display_name || uname),
          address: u.exact_address || u.alley || 'مشهد، منطقه شمال شرق',
          phone: u.phone || 'ثبت در سامانه هم‌عهدی',
          hours: u.booth_hours || 'همه‌روزه ۹ صبح تا ۲۱',
          description: u.booth_bio || 'عرضه مستقیم کالا و خدمات به اهالی محترم شمال شرق مشهد',
          url: `${baseUrl}?booth=${encodeURIComponent(uname)}`,
          fileKey: 'booth_' + uname
        };
      }
      if (page === 'listing_detail' && state.selectedListingId) {
        const item = (state.listings || []).find(l => Number(l.id) === Number(state.selectedListingId));
        if (item) {
          return {
            badge: 'آگهی رسمی در عهد بازار هم‌عهدی',
            title: item.title,
            subtitle: `${formatPrice(item.price)} ${item.price_unit || 'تومان'} • ${item.booth_title || item.seller_name}`,
            address: item.address_detail || 'مشهد، منطقه شمال شرق',
            phone: item.seller_phone || 'در عهد بازار',
            hours: 'تحویل و هماهنگی مستقیم در محله',
            description: item.description || '',
            url: `${baseUrl}?app=market&listing=${encodeURIComponent(item.id)}`,
            fileKey: 'listing_' + item.id
          };
        }
      }
      if (page === 'market') {
        return {
          badge: 'اپلیکیشن ۱ • بازار و اقتصاد محلی',
          title: 'عهد بازار شمال شرق مشهد',
          subtitle: 'خرید و فروش مستقیم و بی‌واسطه اهالی و غرفه‌داران محله',
          address: 'مشهد مقدس، منطقه شمال شرق',
          phone: 'پشتیبانی بازار هم‌عهدی',
          hours: 'فعال به صورت ۲۴ ساعته',
          description: 'برای مشاهده آگهی‌ها، پیشنهادهای شگفت‌انگیز و غرفه‌های محله، کد QR زیر را اسکن کنید.',
          url: `${baseUrl}?app=market`,
          fileKey: 'ahd_bazaar'
        };
      }
      if (page === 'social_bot') {
        return {
          badge: 'استودیو هوشمند انتشار چندرسانه‌ای',
          title: 'استودیو عهدبات هم‌عهدی',
          subtitle: 'انتشار همزمان محتوا در بله، روبیکا، ایتا، سروش‌پلاس و تلگرام',
          address: 'شبکه یکپارچه رسانه‌های مردمی شمال شرق',
          phone: 'استودیو عهدبات',
          hours: 'ویژه کانال‌های بالای ۵۰۰ عضو',
          description: 'برای اتصال کانال بالای ۵۰۰ عضو خود به شبکه عهدبات، کد QR زیر را اسکن نمایید.',
          url: `${baseUrl}?app=ahdbot`,
          fileKey: 'ahdbot_studio'
        };
      }
      return {
        badge: 'سوپراپلیکیشن جامع محلی',
        title: 'سامانه مردمی هم‌عهدی',
        subtitle: 'پیشخوان یکپارچه خدمات، عهد بازار و عهدبات شمال شرق مشهد',
        address: 'مشهد مقدس، منطقه شمال شرق',
        phone: 'اکوسیستم همبستگی مردمی',
        hours: 'دسترسی سریع با یک حساب واحد',
        description: 'برای ورود مستقیم به سوپراپلیکیشن هم‌عهدی با دوربین گوشی خود کد زیر را اسکن کنید.',
        url: baseUrl,
        fileKey: 'hamahdi_main'
      };
    }

    function openCurrentPageQrModal() {
      const spec = buildQrPosterSpecForPage();
      openQrPosterModalWithSpec(spec);
    }

    function openBoothPromoCardModal(username) {
      const baseUrl = getCanonicalBaseUrlForQr();
      const u = (state.users && state.users[username]) || (state.currentUser && state.currentUser.username === username ? state.currentUser : {
        username: username || 'booth',
        display_name: 'کسب‌وکار محلی شمال شرق',
        booth_title: 'غرفه محلی شمال شرق',
        booth_bio: 'عرضه مستقیم کالا و خدمات در محدوده شمال شرق مشهد',
        booth_hours: 'همه‌روزه ۹ صبح تا ۲۱',
        phone: '09150000000',
        alley: 'شمال شرق'
      });
      const spec = {
        badge: 'واحد صنفی و غرفه تاییدشده عهد بازار',
        title: u.booth_title || ('غرفه ' + u.display_name),
        subtitle: 'مدیریت غرفه: ' + (u.display_name || username),
        address: u.exact_address || u.alley || 'مشهد، شمال شرق',
        phone: u.phone || 'ثبت در سامانه',
        hours: u.booth_hours || 'همه‌روزه ۹ صبح تا ۲۱',
        description: u.booth_bio || 'عرضه مستقیم کالا و خدمات در بازار مردمی شمال شرق مشهد',
        url: `${baseUrl}?booth=${encodeURIComponent(u.username || username)}`,
        fileKey: 'booth_' + (u.username || username)
      };
      openQrPosterModalWithSpec(spec);
    }

    let __activeQrPosterSpec = null;

    function openQrPosterModalWithSpec(spec) {
      __activeQrPosterSpec = spec;
      openModal(`
        <div class="p-4 sm:p-6 space-y-4 text-xs text-center">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-emerald-300 text-sm sm:text-base flex items-center gap-2">
              <span>🏁</span>
              <span>استند چاپی و کد QR واقعی «${escapeHtml(spec.title)}»</span>
            </h3>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-bold">✕</button>
          </div>

          <div class="p-3 rounded-2xl bg-slate-950/80 border border-emerald-400/35 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span class="text-slate-300 font-bold">🔗 لینک مستقیم رمزگذاری‌شده داخل کد QR واقعی:</span>
            <a href="${escapeHtml(spec.url)}" target="_blank" rel="noopener noreferrer" class="font-mono font-bold text-amber-300 hover:underline dir-ltr break-all">${escapeHtml(spec.url)} ↗</a>
          </div>

          <div class="flex justify-center">
            <canvas id="booth-promo-canvas" width="800" height="1120" class="w-full max-w-[360px] h-auto rounded-3xl border-2 border-amber-400/60 shadow-2xl bg-slate-950"></canvas>
          </div>

          <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button type="button" onclick="printBoothPromoCard()" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2">
              <span>🖨️ چاپ مستقیم استند / برچسب (A4 / A5)</span>
            </button>
            <button type="button" onclick="downloadBoothPromoCardPng('${escapeHtml(spec.fileKey || 'hamahdi')}')" class="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:opacity-95 text-slate-950 font-black text-xs shadow-xl flex items-center gap-2">
              <span>📥 دانلود تصویر باکیفیت چاپی (PNG HD)</span>
            </button>
          </div>
        </div>
      `);
      setTimeout(() => drawBoothPromoCanvas(spec), 50);
    }

    function drawRoundedRectPath(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawBoothPromoCanvas(specOrUser) {
      const c = document.getElementById('booth-promo-canvas');
      if (!c) return;
      const spec = (specOrUser && specOrUser.url) ? specOrUser : (__activeQrPosterSpec || buildQrPosterSpecForPage());
      const ctx = c.getContext('2d');
      const W = 800, H = 1120;

      // 1. Luxury Deep Emerald-Navy Poster Background
      const grad = ctx.createLinearGradient(0, 0, W, H);
      grad.addColorStop(0, '#022c22');
      grad.addColorStop(0.45, '#090d16');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Subtle radial glow behind QR
      const rad = ctx.createRadialGradient(W / 2, 540, 40, W / 2, 540, 380);
      rad.addColorStop(0, 'rgba(251, 191, 36, 0.22)');
      rad.addColorStop(1, 'rgba(9, 13, 22, 0)');
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, W, H);

      // 2. Double Ornamental Gold & Emerald Frame (Print-Friendly)
      drawRoundedRectPath(ctx, 24, 24, W - 48, H - 48, 36);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 6;
      ctx.stroke();

      drawRoundedRectPath(ctx, 38, 38, W - 76, H - 76, 28);
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 3. Top Header Badge
      drawRoundedRectPath(ctx, 170, 66, 460, 50, 25);
      ctx.fillStyle = 'rgba(16, 185, 129, 0.18)';
      ctx.fill();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 21px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('سامانه جامع مردمی هم‌عهدی • شمال شرق مشهد', W / 2, 98);

      // 4. Sub-badge
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 18px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('✦ ' + (spec.badge || 'واحد صنفی تاییدشده') + ' ✦', W / 2, 150);

      // 5. Main Title & Subtitle
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 42px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(String(spec.title || 'هم‌عهدی').slice(0, 38), W / 2, 212);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 24px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(String(spec.subtitle || '').slice(0, 52), W / 2, 258);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '19px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText(String(spec.description || '').slice(0, 68), W / 2, 298);

      // 6. Central White High-Contrast Printable QR Code Card
      const qrBoxSize = 400;
      const qrBoxX = (W - qrBoxSize) / 2;
      const qrBoxY = 334;

      drawRoundedRectPath(ctx, qrBoxX - 10, qrBoxY - 10, qrBoxSize + 20, qrBoxSize + 20, 32);
      ctx.fillStyle = 'rgba(251, 191, 36, 0.18)';
      ctx.fill();

      drawRoundedRectPath(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 24);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.stroke();

      // Render 100% Real ISO/IEC 18004 QR Code Matrix
      const mat = generateRealQrMatrix(spec.url || 'https://hamahdi.ir');
      const n = mat.length;
      const quietZone = 4;
      const totalModules = n + quietZone * 2;
      const modulePx = Math.floor(qrBoxSize / totalModules);
      const actualQrPx = modulePx * totalModules;
      const startX = qrBoxX + Math.floor((qrBoxSize - actualQrPx) / 2) + quietZone * modulePx;
      const startY = qrBoxY + Math.floor((qrBoxSize - actualQrPx) / 2) + quietZone * modulePx;

      ctx.fillStyle = '#090d16';
      for (let r = 0; r < n; r++) {
        for (let col = 0; col < n; col++) {
          if (mat[r][col]) {
            ctx.fillRect(startX + col * modulePx, startY + r * modulePx, modulePx, modulePx);
          }
        }
      }

      // Scan Instruction Pill right below QR Box
      drawRoundedRectPath(ctx, 180, 756, 440, 44, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
      ctx.fillStyle = '#090d16';
      ctx.font = '900 20px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('📱 با دوربین گوشی اسکن کنید و وارد صفحه شوید', W / 2, 785);

      // Direct URL text (for manual typing / verification)
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(String(spec.url || '').slice(0, 72), W / 2, 826);

      // 7. Bottom Structured Contact & Address Card
      drawRoundedRectPath(ctx, 70, 852, W - 140, 175, 24);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 23px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('📞 ارتباط و هماهنگی: ' + (spec.phone || '-'), W / 2, 898);

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 20px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('📍 آدرس: ' + String(spec.address || 'مشهد، شمال شرق').slice(0, 55), W / 2, 944);

      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 19px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('⏰ ' + (spec.hours || 'همه‌روزه ۹ صبح تا ۲۱'), W / 2, 988);

      // Footer tagline
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 18px Vazirmatn, Tahoma, sans-serif';
      ctx.fillText('اکوسیستم مردمی هم‌عهدی • خرید و ارتباط مستقیم اهالی شمال شرق مشهد', W / 2, 1065);
    }

    function downloadBoothPromoCardPng(fileKey) {
      const c = document.getElementById('booth-promo-canvas');
      if (!c) return;
      const dataUrl = c.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'hamahdi_qr_' + (fileKey || 'poster') + '.png';
      document.body.appendChild(a);
      a.click();
      a.remove();
      showToast('استند چاپی QR با کیفیت بالا (HD PNG) دانلود شد.');
    }

    function printBoothPromoCard() {
      const c = document.getElementById('booth-promo-canvas');
      if (!c) return;
      const dataUrl = c.toDataURL('image/png');
      const spec = __activeQrPosterSpec || buildQrPosterSpecForPage();
      const w = window.open('', '_blank', 'width=850,height=1100');
      if (!w) {
        downloadBoothPromoCardPng(spec.fileKey || 'poster');
        return;
      }
      w.document.write(`<!DOCTYPE html>
        <html lang="fa" dir="rtl">
        <head>
          <meta charset="utf-8" />
          <title>چاپ استند QR — ${escapeHtml(spec.title || 'هم‌عهدی')}</title>
          <style>
            @page { size: A4 portrait; margin: 10mm; }
            body { margin: 0; padding: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #fff; font-family: Tahoma, sans-serif; }
            img { max-width: 185mm; max-height: 265mm; width: auto; height: auto; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
            .no-print { margin: 14px 0; display: flex; gap: 10px; }
            .btn { padding: 10px 22px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; font-size: 14px; }
            .btn-print { background: #10b981; color: #022c22; }
            .btn-close { background: #e2e8f0; color: #0f172a; }
            @media print { .no-print { display: none !important; } img { box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="no-print">
            <button class="btn btn-print" onclick="window.print()">🖨️ شروع چاپ (Print)</button>
            <button class="btn btn-close" onclick="window.close()">✕ بستن پنجره</button>
          </div>
          <img src="${dataUrl}" onload="setTimeout(function(){ window.print(); }, 250);" alt="QR Standee" />
        </body>
        </html>`);
      w.document.close();
    }

    function openSupportQuickAction() {
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-emerald-300 text-base"><svg viewBox="0 0 24 24" class="svg-icon ml-1.5" aria-hidden="true"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>پشتیبانی و راهنمای اهالی شمال شرق</h3>
            <button type="button" onclick="closeModal()" class="w-9 h-9 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>
          <div class="glass-card p-4 rounded-2xl space-y-2 border border-emerald-400/30 leading-relaxed text-slate-200">
            <div class="font-black text-amber-300 text-sm">همسایه گرامی، خوش آمدید!</div>
            <p>سامانه مردمی <strong>«هم‌عهدی»</strong> به صورت ۱۰۰٪ رایگان برای رونق کسب‌وکارهای خانگی، غرفه‌داران و همیاری اهالی محترم <strong>منطقه شمال شرق مشهد</strong> طراحی شده است.</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button type="button" onclick="closeModal(); openResidentLoginModal('افتتاح رایگان غرفه');" class="glass-card p-3.5 rounded-2xl text-right hover:border-amber-400/50 transition">
              <div class="font-black text-amber-300 mb-1"><svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><path d="M3 9l1.5-5h15L21 9M3 9c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3c0 1.66 1.34 3 3 3s3-1.34 3-3M5 12v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-8M9 21v-6h6v6"/></svg>۱. افتتاح رایگان غرفه</div>
              <div class="text-slate-300 text-[11px]">ثبت‌نام در ۳۰ ثانیه و دریافت غرفه اختصاصی با کارت تبلیغاتی QR</div>
            </button>
            <button type="button" onclick="closeModal(); openAddMarketListingModal();" class="glass-card p-3.5 rounded-2xl text-right hover:border-emerald-400/50 transition">
              <div class="font-black text-emerald-300 mb-1"><svg viewBox="0 0 24 24" class="svg-icon ml-1" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/></svg>۲. ثبت آگهی و شگفت‌انگیز</div>
              <div class="text-slate-300 text-[11px]">ثبت کالا یا خدمات فنی به همراه درخواست نردبان و نشان فوری</div>
            </button>
          </div>
          <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex flex-wrap items-center justify-between gap-2">
            <span><svg viewBox="0 0 24 24" class="svg-icon text-emerald-400 ml-1.5" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z"/></svg>تلفن هماهنگی و پشتیبانی محله:</span>
            <a href="tel:05132100000" class="font-black text-amber-300 text-sm dir-ltr">051-32100000</a>
          </div>
        </div>
      `);
    }


    function adminApproveUserBooth(username) {
      if (!isAdmin()) return;
      if (state.users && state.users[username]) {
        state.users[username].booth_status = 'approved';
        state.users[username].booth_rejection_reason = null;
        state.users[username].role_title = 'غرفه‌دار تاییدشده شمال شرق';
      }
      if (state.currentUser && state.currentUser.username === username) {
        state.currentUser.booth_status = 'approved';
      }
      saveState();
      renderCurrentPage();
      callServerApi('approve_user_booth', { username: username });
      showToast('اطلاعات هویتی و غرفه کاربر تایید و فعال شد.');
    }

    function openAdminRejectBoothModal(username) {
      if (!isAdmin()) return;
      const u = state.users && state.users[username];
      if (!u) return;
      openModal(`
        <div class="p-6 space-y-4 text-xs">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-rose-300 text-base">ثبت علت رد مدارک ایجاد غرفه: ${escapeHtml(u.display_name)}</h3>
            <button type="button" onclick="closeModal()" class="text-slate-400 font-bold">✕</button>
          </div>
          <form onsubmit="submitAdminRejectBooth(event, '${escapeHtml(username)}')" class="space-y-3">
            <textarea id="rej-booth-reason" rows="3" required placeholder="مثلاً: تصویر کارت ملی ناخوانا است یا کد ملی با نام مطابقت ندارد..." class="glass-input w-full px-3 py-2 rounded-xl"></textarea>
            <button type="submit" class="w-full py-3 rounded-xl bg-rose-600 text-white font-black">ثبت علت رد مدارک غرفه</button>
          </form>
        </div>
      `);
    }

    function submitAdminRejectBooth(e, username) {
      e.preventDefault();
      if (!isAdmin()) return;
      const reason = (document.getElementById('rej-booth-reason') || {}).value.trim();
      if (state.users && state.users[username]) {
        state.users[username].booth_status = 'rejected';
        state.users[username].booth_rejection_reason = reason;
      }
      closeModal();
      saveState();
      renderCurrentPage();
      callServerApi('reject_user_booth', { username: username, rejection_reason: reason });
      showToast('علت رد مدارک ایجاد غرفه ثبت گردید.', 'warning');
    }

    function openNationalCardPreviewModal(username) {
      if (!isAdmin()) return;
      const u = state.users && state.users[username];
      if (!u || !u.national_card_image) return;
      openModal(`
        <div class="p-6 space-y-4 text-xs text-center">
          <div class="flex items-center justify-between border-b border-white/15 pb-3">
            <h3 class="font-black text-amber-300 text-base">بررسی تصویر کارت ملی و مشخصات هویتی: ${escapeHtml(u.display_name)}</h3>
            <button type="button" onclick="closeModal()" class="w-8 h-8 rounded-xl bg-white/10 text-slate-300 font-bold">✕</button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-right bg-slate-950/70 p-3.5 rounded-2xl border border-white/10">
            <div><span class="text-slate-400">نام:</span> <strong class="text-white">${escapeHtml(u.first_name || '-')}</strong></div>
            <div><span class="text-slate-400">نام خانوادگی:</span> <strong class="text-white">${escapeHtml(u.last_name || '-')}</strong></div>
            <div><span class="text-slate-400">سن:</span> <strong class="text-amber-300">${u.age || '-'} سال</strong></div>
            <div><span class="text-slate-400">کد ملی:</span> <strong class="text-cyan-300 dir-ltr">${escapeHtml(u.national_code || '-')}</strong></div>
            <div><span class="text-slate-400">تلفن:</span> <strong class="text-emerald-300 dir-ltr">${escapeHtml(u.phone || '-')}</strong></div>
            <div><span class="text-slate-400">ایمیل:</span> <strong class="text-slate-200 dir-ltr">${escapeHtml(u.email || '-')}</strong></div>
            <div class="col-span-2 sm:col-span-3"><span class="text-slate-400">آدرس دقیق:</span> <strong class="text-white">${escapeHtml(u.exact_address || u.alley || '-')}</strong></div>
          </div>
          <div class="flex justify-center bg-black/50 p-3 rounded-2xl border border-amber-400/30">
            <img src="${u.national_card_image}" alt="کارت ملی" class="max-h-[55vh] w-auto rounded-xl object-contain" />
          </div>
          <div class="flex justify-center gap-3 pt-2">
            <button type="button" onclick="closeModal(); adminApproveUserBooth('${escapeHtml(u.username)}');" class="px-6 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black">
              ✔ تایید هویت و فعال‌سازی غرفه
            </button>
            <button type="button" onclick="closeModal(); openAdminRejectBoothModal('${escapeHtml(u.username)}');" class="px-5 py-3 rounded-xl bg-rose-600 text-white font-bold">
              ✕ رد مدارک
            </button>
          </div>
        </div>
      `);
    }
