/**
 * ============================================================================
 * HAMAHDI v5.0 | ماژول دستیار هوش مصنوعی متنی عهدبات (Text-Only AI Assistant)
 * ============================================================================
 * فقط در حالت متنی: نگارش کپشن، متن آگهی، بازنویسی، خلاصه‌سازی، هشتگ و گفتگوی آزاد
 * همراه با دکمه ارسال مستقیم خروجی به استودیو ۴ پیام‌رسان عهدبات
 */

const hmAiState = {
  mode: 'general',
  loading: false,
  configured: false,
  modelName: 'local-test-helper',
  messages: [],
  loadedHistory: false
};

const HM_AI_MODES = [
  { id: 'general', label: '💬 گفتگوی آزاد' },
  { id: 'caption', label: '📝 کپشن کانال' },
  { id: 'ad', label: '🛍️ متن آگهی بازار' },
  { id: 'rewrite', label: '✨ بازنویسی حرفه‌ای' },
  { id: 'summary', label: '📌 خلاصه‌سازی' },
  { id: 'hashtags', label: '🏷️ هشتگ مرتبط' }
];

function openHamahdiAiChatPage() {
  state.currentPage = 'ahdbot_ai';
  if (typeof renderCurrentPage === 'function') {
    renderCurrentPage();
  }
  loadHamahdiAiStatusAndHistory();
}

// جایگزینی تابع قفل‌شده نسخه ۴ با ورود مستقیم به چت‌باکس متنی نسخه ۵
function openHamahdiAiLockedPreviewModal() {
  openHamahdiAiChatPage();
}

function selectHamahdiAiMode(modeId) {
  hmAiState.mode = modeId || 'general';
  if (state.currentPage === 'ahdbot_ai' && typeof renderCurrentPage === 'function') {
    renderCurrentPage();
  }
}

async function loadHamahdiAiStatusAndHistory() {
  const uname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest')
    ? state.currentUser.username : '';
  const hdrs = uname ? { 'X-Session-User': uname } : {};
  try {
    const [stRes, hiRes] = await Promise.all([
      fetch('ai_api.php?action=status&_t=' + Date.now(), { headers: hdrs }),
      fetch('ai_api.php?action=history&_t=' + Date.now(), { headers: hdrs })
    ]);
    const stData = await stRes.json();
    const hiData = await hiRes.json();
    if (stData && stData.ok) {
      hmAiState.configured = !!stData.configured;
      hmAiState.modelName = stData.model || 'local-test-helper';
    }
    if (hiData && hiData.ok && Array.isArray(hiData.messages)) {
      hmAiState.messages = hiData.messages;
      hmAiState.loadedHistory = true;
    }
    if (state.currentPage === 'ahdbot_ai' && typeof renderCurrentPage === 'function') {
      renderCurrentPage();
      scrollHamahdiAiToBottom();
    }
  } catch (e) {
    // در صورت آفلاین بودن یا روشن نبودن سرور لوکال، پیام راهنما نمایش داده می‌شود
  }
}

function scrollHamahdiAiToBottom() {
  setTimeout(() => {
    const el = document.getElementById('hm-ai-messages-box');
    if (el) el.scrollTop = el.scrollHeight;
  }, 60);
}

async function sendHamahdiAiMessage(e) {
  if (e && e.preventDefault) e.preventDefault();
  if (hmAiState.loading) return;
  const input = document.getElementById('hm-ai-prompt-input');
  if (!input) return;
  const text = String(input.value || '').trim();
  if (!text) {
    if (typeof showToast === 'function') showToast('لطفاً پیام متنی خود را بنویسید.', 'warning');
    return;
  }

  hmAiState.messages.push({ role: 'user', content: text, mode: hmAiState.mode, created_ts: Math.floor(Date.now() / 1000) });
  input.value = '';
  hmAiState.loading = true;
  if (typeof renderCurrentPage === 'function') renderCurrentPage();
  scrollHamahdiAiToBottom();

  const uname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest')
    ? state.currentUser.username : '';

  try {
    const resp = await fetch('ai_api.php?action=chat', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, uname ? { 'X-Session-User': uname } : {}),
      body: JSON.stringify({
        message: text,
        mode: hmAiState.mode,
        session_username: uname
      })
    });
    const data = await resp.json();
    if (data && data.ok && data.reply) {
      hmAiState.messages.push({ role: 'assistant', content: data.reply, mode: hmAiState.mode, created_ts: Math.floor(Date.now() / 1000) });
    } else {
      hmAiState.messages.push({
        role: 'assistant',
        content: '⚠️ ' + ((data && data.error) || 'پاسخی از سرور دریافت نشد.'),
        mode: hmAiState.mode
      });
    }
  } catch (err) {
    hmAiState.messages.push({
      role: 'assistant',
      content: '❌ خطا در اتصال به سرور هوش مصنوعی (`ai_api.php`). از منوی بالا گزینه «تنظیمات اتصال سرور» را بررسی کنید.',
      mode: hmAiState.mode
    });
  } finally {
    hmAiState.loading = false;
    if (typeof renderCurrentPage === 'function') renderCurrentPage();
    scrollHamahdiAiToBottom();
  }
}

async function clearHamahdiAiHistory() {
  const uname = (state.currentUser && state.currentUser.username && state.currentUser.role !== 'guest')
    ? state.currentUser.username : '';
  try {
    await fetch('ai_api.php?action=clear_history', {
      method: 'POST',
      headers: Object.assign({ 'Content-Type': 'application/json' }, uname ? { 'X-Session-User': uname } : {}),
      body: JSON.stringify({ session_username: uname })
    });
  } catch (e) {}
  hmAiState.messages = [];
  if (typeof showToast === 'function') showToast('تاریخچه گفتگو پاک شد.', 'success');
  if (typeof renderCurrentPage === 'function') renderCurrentPage();
}

function copyHamahdiAiText(idx) {
  const msg = hmAiState.messages[idx];
  if (!msg || !msg.content) return;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(msg.content).then(() => {
      if (typeof showToast === 'function') showToast('متن با موفقیت کپی شد.', 'success');
    });
  } else {
    const ta = document.createElement('textarea');
    ta.value = msg.content;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    if (typeof showToast === 'function') showToast('متن کپی شد.', 'success');
  }
}

function sendAiReplyToAhdbotStudio(idx) {
  const msg = hmAiState.messages[idx];
  if (!msg || !msg.content) return;
  window.__hamahdiPendingAiCaption = msg.content;
  if (typeof handleEntryToAhdbotClick === 'function') {
    handleEntryToAhdbotClick();
  } else {
    state.currentPage = 'social_bot';
    if (typeof SOCIAL_BOT_STATE !== 'undefined') SOCIAL_BOT_STATE.entrySubView = 'media_assistant';
    if (typeof renderCurrentPage === 'function') renderCurrentPage();
  }
  setTimeout(() => {
    const captionEl = document.getElementById('bot-caption-input') || document.querySelector('textarea[id*="caption"], textarea[name*="caption"]');
    if (captionEl && window.__hamahdiPendingAiCaption) {
      captionEl.value = window.__hamahdiPendingAiCaption;
      captionEl.dispatchEvent(new Event('input', { bubbles: true }));
      if (typeof showToast === 'function') showToast('متن هوش مصنوعی به استودیو عهدبات منتقل شد.', 'success');
    }
  }, 250);
}

function formatAiMessageText(raw) {
  const esc = typeof escapeHtml === 'function' ? escapeHtml(raw || '') : String(raw || '');
  return esc
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-amber-300 font-black">$1</strong>')
    .replace(/\n/g, '<br>');
}

function renderHamahdiAiChatPage() {
  const modePills = HM_AI_MODES.map(m => {
    const active = hmAiState.mode === m.id;
    return `<button type="button" onclick="selectHamahdiAiMode('${m.id}')" class="px-3 py-1.5 rounded-xl text-[11px] font-black transition shrink-0 ${active ? 'bg-amber-400 text-slate-950 shadow' : 'bg-white/10 text-slate-200 hover:bg-white/15 border border-white/10'}">${m.label}</button>`;
  }).join('');

  const msgsHtml = hmAiState.messages.length === 0
    ? `
      <div class="text-center py-8 px-4 space-y-3">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-3xl shadow-lg">🤖</div>
        <h3 class="text-base font-black text-white">دستیار هوشمند متنی هم‌عهدی</h3>
        <p class="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          این دستیار به‌صورت <strong>فقط متنی</strong> برای تولید کپشن کانال‌های بله، ایتا، روبیکا و تلگرام، نوشتن متن آگهی عهد بازار، بازنویسی و پاسخگویی متنی طراحی شده است.
        </p>
        <div class="flex flex-wrap justify-center gap-2 pt-2">
          <button type="button" onclick="document.getElementById('hm-ai-prompt-input').value='یک کپشن جذاب برای فروش عسل طبیعی در کانال ایتا و بله بنویس'; selectHamahdiAiMode('caption');" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] text-amber-200 border border-amber-400/25">مثال: کپشن عسل طبیعی</button>
          <button type="button" onclick="document.getElementById('hm-ai-prompt-input').value='یک متن تبلیغاتی کوتاه برای آگهی خدمات تعمیرات لوازم خانگی در عهد بازار بنویس'; selectHamahdiAiMode('ad');" class="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[11px] text-cyan-200 border border-cyan-400/25">مثال: متن آگهی عهد بازار</button>
        </div>
      </div>
    `
    : hmAiState.messages.map((m, idx) => {
      const isUser = m.role === 'user';
      return `
        <div class="flex ${isUser ? 'justify-start' : 'justify-end'}">
          <div class="max-w-[88%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${isUser ? 'bg-amber-500/20 border border-amber-400/40 text-amber-50 rounded-tr-sm' : 'bg-slate-900/90 border border-cyan-400/35 text-slate-100 rounded-tl-sm'}">
            <div class="text-[10px] font-black mb-1 ${isUser ? 'text-amber-300' : 'text-cyan-300'}">${isUser ? 'شما' : '🤖 دستیار متنی هم‌عهدی'}</div>
            <div>${formatAiMessageText(m.content)}</div>
            ${!isUser ? `
              <div class="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10">
                <button type="button" onclick="copyHamahdiAiText(${idx})" class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-slate-200">📋 کپی متن</button>
                <button type="button" onclick="sendAiReplyToAhdbotStudio(${idx})" class="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-[10px] font-black text-emerald-200">🚀 ارسال به استودیو عهدبات</button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

  return `
    <div class="space-y-3 pb-4">
      <div class="glass-panel rounded-3xl p-4 border border-cyan-400/40 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2.5">
          <button type="button" onclick="returnToLandingPage()" class="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-black text-amber-300">→ بازگشت به خانه</button>
          <div>
            <h1 class="text-sm sm:text-base font-black text-white flex items-center gap-1.5">
              <span>✨ عهدهوش (هوش مصنوعی متنی)</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/20 border border-emerald-400/50 text-emerald-300">فقط متنی</span>
            </h1>
            <div class="text-[10px] text-slate-400 mt-0.5">
              وضعیت مدل: ${hmAiState.configured ? ('آنلاین (' + hmAiState.modelName + ')') : 'حالت تست لوکال (آماده اتصال به کلید API)'}
            </div>
          </div>
        </div>
        <button type="button" onclick="clearHamahdiAiHistory()" class="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-400/35 text-rose-200 text-[11px] font-bold">🗑️ پاک‌سازی گفتگو</button>
      </div>

      <div class="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        ${modePills}
      </div>

      <div id="hm-ai-messages-box" class="glass-panel rounded-3xl p-4 border border-white/15 min-h-[340px] max-h-[55vh] overflow-y-auto space-y-3">
        ${msgsHtml}
        ${hmAiState.loading ? '<div class="text-xs text-cyan-300 font-bold animate-pulse text-left">🤖 در حال نگارش پاسخ متنی...</div>' : ''}
      </div>

      <form onsubmit="sendHamahdiAiMessage(event)" class="glass-panel rounded-2xl p-2.5 border border-amber-400/35 flex items-end gap-2">
        <textarea id="hm-ai-prompt-input" rows="2" placeholder="متن یا درخواست خود را بنویسید (فقط حالت متنی)..." class="glass-input flex-1 px-3 py-2 rounded-xl text-xs sm:text-sm resize-none"></textarea>
        <button type="submit" ${hmAiState.loading ? 'disabled' : ''} class="px-4 py-3 rounded-xl bg-gradient-to-l from-amber-500 to-yellow-400 text-slate-950 font-black text-xs shadow-lg shrink-0">
          ${hmAiState.loading ? '...' : 'ارسال ↵'}
        </button>
      </form>
    </div>
  `;
}
