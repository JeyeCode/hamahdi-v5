/**
 * HAMAHDI v4.0.0 | ماژول مرکز پیام‌ها، چت مستقیم و پیگیری سفارش‌های بازار
 */
    function renderMessagesCenterPage() {
      if (!isRegisteredUser()) {
        return `<div class="glass-panel rounded-3xl p-8 text-center text-xs text-slate-300">برای مشاهده چت خصوصی ابتدا وارد حساب کاربری خود شوید.</div>`;
      }
      const appCtx = state.messagesAppContext || 'market';
      const activeTab = state.messagesActiveTab || 'chats';
      const { myUname, conversationList, activeConv } = buildChatConversationsData();
      const isMobileChatActive = (state.mobileChatView === 'chat' && activeConv);

      const myOrders = (state.orders || []).filter(o => isAdmin() || o.seller_username === myUname || o.buyer_username === myUname);

      // تنظیم عنوان، دکمه بازگشت و اکشن اختصاصی بر اساس اپ فعلی (بازار / عهدینو / عهدانه)
      const ctxMeta = appCtx === 'ahdino'
        ? {
            backLabel: '→ عهدینو',
            backAction: 'navigateToAhdinoPage()',
            backBtnClass: 'bg-sky-400 text-slate-950',
            roomTitle: 'چت‌باکس اختصاصی عهدینو',
            chips: ['سلام وقت بخیر', 'پیام صوتی‌تون عالی بود 🎙️', 'ممنون از اطلاع‌رسانی در عهدینو', 'خدا قوت همسایه عزیز']
          }
        : (appCtx === 'ahdaneh'
          ? {
              backLabel: '→ عهدانه',
              backAction: 'navigateToAhdanehPage()',
              backBtnClass: 'bg-gradient-to-r from-fuchsia-400 to-amber-400 text-slate-950',
              roomTitle: 'دایرکت اختصاصی عهدانه',
              chips: ['سلام 🌺', 'ریلز و استوری‌تون عالی بود 👏', 'خدا قوت همسایه عزیز', 'ممنون از اشتراک‌گذاری']
            }
          : {
              backLabel: '→ عهد بازار',
              backAction: 'navigateToMarketPage()',
              backBtnClass: 'bg-amber-400 text-slate-950',
              roomTitle: 'چت و چانه‌زنی عهد بازار',
              chips: ['سلام، این کالا موجوده؟', 'قیمت آخرش چنده؟', 'امکان تحویل حضوری در شمال شرق هست؟', 'ممنون، الان سفارش می‌دم']
            });

      if (appCtx === 'market' && activeTab === 'orders') {
        return `
          <div class="space-y-4 pb-24">
            <div class="glass-panel rounded-3xl p-4 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <button type="button" onclick="openMessagesCenterPage('chats', 'market')" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs">
                  💬 بازگشت به چت‌های بازار
                </button>
                <h1 class="text-base font-black text-white">سفارش‌های عهد بازار (${myOrders.length})</h1>
              </div>
              <button type="button" onclick="navigateToMarketPage()" class="px-3 py-1.5 rounded-xl bg-amber-400 text-slate-950 font-black text-xs">
                → عهد بازار
              </button>
            </div>
            ${myOrders.length === 0 ? `<div class="glass-panel rounded-3xl p-8 text-center text-xs text-slate-400">هنوز سفارشی ثبت نشده است.</div>` : myOrders.map(o => `
              <div class="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div class="font-black text-amber-300 text-sm">${escapeHtml(o.order_code)} — ${escapeHtml(o.listing_title)}</div>
                  <div class="text-slate-300 mt-1">خریدار: ${escapeHtml(o.buyer_name)} (${escapeHtml(o.buyer_phone)}) • آدرس: ${escapeHtml(o.buyer_address)}</div>
                  <div class="text-[11px] text-cyan-300 mt-1 font-bold">${escapeHtml(o.order_status || '')}</div>
                </div>
                <div class="font-black text-emerald-300 text-sm">${formatPrice(o.total_price)} تومان</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      return `
        <div class="fixed inset-0 z-40 bg-[#070b14] flex flex-col hm-chat-fullscreen-shell">
          <div class="w-full h-full flex overflow-hidden">

            <!-- ستون راست: لیست گفتگوهای اختصاصی همان اپ -->
            <aside class="w-full md:w-80 lg:w-96 border-l border-white/10 bg-slate-950/80 flex flex-col shrink-0 ${isMobileChatActive ? 'hidden md:flex' : 'flex'}">
              <div class="p-3.5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
                <div class="flex items-center gap-2">
                  <button type="button" onclick="${ctxMeta.backAction}" class="px-2.5 py-1.5 rounded-xl ${ctxMeta.backBtnClass} font-black text-[11px] flex items-center gap-1 shadow">
                    <span>${ctxMeta.backLabel}</span>
                  </button>
                  <span id="chat-conv-count-lbl" class="font-black text-white text-xs">گفتگوها (${conversationList.length})</span>
                </div>

                ${appCtx === 'market' ? `
                  <button type="button" onclick="openMessagesCenterPage('orders', 'market')" class="text-[11px] text-amber-300 hover:underline flex items-center gap-1 font-bold">
                    <span>سفارش‌ها (${myOrders.length})</span>
                  </button>
                ` : `
                  <button type="button" onclick="openNewDirectChatModal('${appCtx}')" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-300 font-bold text-[11px]">
                    + گفتگوی جدید
                  </button>
                `}
              </div>

              <!-- سوییچر سریع بین ۳ چت‌باکس مجزا -->
              <div class="grid grid-cols-3 gap-1 p-2 bg-slate-950/90 border-b border-white/10 text-[11px] text-center">
                <button type="button" onclick="openMessagesCenterPage('chats', 'market')" class="py-1.5 rounded-lg font-bold transition ${appCtx === 'market' ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}">🏪 چت بازار</button>
                <button type="button" onclick="openMessagesCenterPage('chats', 'ahdino')" class="py-1.5 rounded-lg font-bold transition ${appCtx === 'ahdino' ? 'bg-sky-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}">🎙️ چت عهدینو</button>
                <button type="button" onclick="openMessagesCenterPage('chats', 'ahdaneh')" class="py-1.5 rounded-lg font-bold transition ${appCtx === 'ahdaneh' ? 'bg-fuchsia-400 text-slate-950 font-black' : 'text-slate-400 hover:text-white'}">🎬 چت عهدانه</button>
              </div>

              <div id="chat-conv-list-container" class="flex-1 overflow-y-auto divide-y divide-white/5 pb-20">
                ${renderChatSidebarItemsHtml(conversationList, activeConv)}
              </div>
            </aside>

            <!-- ستون چپ: اتاق گفتگوی اختصاصی -->
            <main class="flex-1 flex flex-col bg-[#0b101b] min-w-0 ${!isMobileChatActive ? 'hidden md:flex' : 'flex'}">
              ${!activeConv ? `
                <div class="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400 text-xs space-y-3">
                  <div class="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-3xl">💬</div>
                  <div class="font-black text-white text-sm">${ctxMeta.roomTitle}</div>
                  <p>یک مخاطب را از لیست سمت راست انتخاب کنید تا گفتگو باز شود.</p>
                  ${appCtx !== 'market' ? `
                    <button type="button" onclick="openNewDirectChatModal('${appCtx}')" class="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-black text-xs shadow">
                      + شروع گفتگوی جدید
                    </button>
                  ` : ''}
                </div>
              ` : `
                <!-- هدر بالای چت‌روم متناسب با اپ فعلی -->
                <div class="px-3.5 py-2.5 border-b border-white/10 bg-[#121826] flex items-center justify-between gap-2 shrink-0">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <button type="button" onclick="backToChatList()" class="md:hidden p-1.5 rounded-xl bg-white/10 text-white font-black text-sm">
                      →
                    </button>
                    <div class="w-9 h-9 rounded-full bg-[#e76f51] text-white font-black text-sm flex items-center justify-center shrink-0">
                      ${escapeHtml((activeConv.partnerName || 'هـ')[0])}
                    </div>
                    <div class="min-w-0">
                      <div class="font-bold text-white text-xs truncate">${escapeHtml(activeConv.partnerName)}</div>
                      <div class="text-[10px] text-slate-400">${ctxMeta.roomTitle}</div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button type="button" onclick="deleteChatConversation(${activeConv.listing.id}, '${escapeHtml(activeConv.partnerUname)}')" class="px-2.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-[11px] flex items-center gap-1 transition">
                      <span>🗑️ حذف</span>
                    </button>
                    <button type="button" onclick="${activeConv.listing.id > 0 ? `openListingDetailModal(${activeConv.listing.id})` : `openUserPersonalProfile('${escapeHtml(activeConv.partnerUname)}', '${appCtx === 'ahdino' ? 'ahdino' : 'ahdaneh'}')`}" class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px]">
                      ${activeConv.listing.id > 0 ? 'مشاهده آگهی' : 'مشاهده پروفایل'}
                    </button>
                    <button type="button" onclick="${ctxMeta.backAction}" class="px-2.5 py-1.5 rounded-xl ${ctxMeta.backBtnClass} font-black text-[11px]">
                      ${ctxMeta.backLabel}
                    </button>
                  </div>
                </div>

                <!-- نوار اطلاعات آگهی (در بازار) یا پروفایل مخاطب (در عهدینو و عهدانه) -->
                <div onclick="${activeConv.listing.id > 0 ? `openListingDetailModal(${activeConv.listing.id})` : `openUserPersonalProfile('${escapeHtml(activeConv.partnerUname)}', '${appCtx === 'ahdino' ? 'ahdino' : 'ahdaneh'}')`}" class="px-3 py-2 bg-[#172033] border-b border-white/10 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-[#1c273e] transition shrink-0">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${activeConv.listing.image_data}" alt="" class="w-9 h-9 rounded-lg object-cover shrink-0 border border-amber-400/40" onerror="this.src='./icon-512.png'" />
                    <div class="min-w-0">
                      <div class="font-black text-white text-xs truncate">${escapeHtml(activeConv.listing.title)}</div>
                      ${activeConv.listing.id > 0 ? `
                        <div class="text-[11px] text-amber-300 font-bold">${formatPrice(activeConv.listing.price)} تومان</div>
                      ` : `
                        <div class="text-[11px] text-sky-300 font-mono dir-ltr">@${escapeHtml(activeConv.partnerUname)}</div>
                      `}
                    </div>
                  </div>
                  <span class="text-[11px] text-cyan-300 shrink-0 font-bold">مشاهده ←</span>
                </div>

                <!-- پیام‌ها -->
                <div id="chat-room-scroll" class="flex-1 overflow-y-auto p-4 space-y-3 text-xs bg-[#0b101b]">
                  ${renderChatMessagesListHtml(activeConv.messages, myUname, activeConv.listing ? activeConv.listing.id : 0)}
                </div>

                <!-- چیپ‌های آماده متناسب با اپ فعلی -->
                <div class="px-3 py-1.5 bg-[#121826] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto shrink-0 select-none">
                  ${ctxMeta.chips.map(ch => `
                    <button type="button" onclick="fillChatRoomChip('${escapeHtml(ch)}')" class="px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-[11px] font-bold shrink-0">${escapeHtml(ch)}</button>
                  `).join('')}
                </div>

                ${activeConv.listing.id > 0 ? `
                  <div id="chat-room-offer-row" class="hidden px-3.5 py-2 bg-amber-500/15 border-t border-amber-400/30 flex items-center gap-2 shrink-0">
                    <span class="text-[11px] font-bold text-amber-300 shrink-0">💰 قیمت پیشنهادی (تومان):</span>
                    <input id="chat-room-offer-input" type="number" min="0" placeholder="مثلاً ${activeConv.listing.price || 150000}" class="glass-input flex-1 px-3 py-1.5 rounded-xl text-xs dir-ltr" />
                  </div>
                ` : ''}

                <!-- کادر ارسال پیام -->
                <form onsubmit="submitChatRoomMessage(event, ${activeConv.listing.id}, '${escapeHtml(activeConv.partnerUname)}')" class="p-3 pb-24 md:pb-3 bg-[#121826] border-t border-white/10 flex items-center gap-2 shrink-0">
                  ${activeConv.listing.id > 0 ? `
                    <button type="button" onclick="toggleChatRoomOfferRow()" class="px-2.5 py-2.5 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-400/35 text-amber-300 font-bold text-xs shrink-0" title="پیشنهاد قیمت">
                      💰
                    </button>
                  ` : ''}
                  <input id="chat-room-input" type="text" autocomplete="off" placeholder="پیام خود را بنویسید..." class="glass-input flex-1 px-4 py-2.5 rounded-full text-xs" />
                  <button type="submit" class="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-black text-xs shrink-0 shadow-lg">
                    ارسال
                  </button>
                </form>
              `}
            </main>
          </div>
        </div>
      `;
    }


    function filterBoothCatalogInput(val) {
      state.boothCatalogQuery = String(val || '');
      renderCurrentPage(true);
      const el = document.getElementById('booth-catalog-search-inp');
      if (el) {
        el.focus();
        const len = el.value.length;
        try { el.setSelectionRange(len, len); } catch (e) {}
      }
    }

