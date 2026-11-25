/**
 * HAMAHDI v5.0 | کنترلر دوحالته تم تاریک-طلایی و لایت‌مود شیشه‌ای (با ذخیره پایدار)
 */
function getThemeMode() {
  try {
    return localStorage.getItem('hamahdi_theme_mode') === 'light' ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
}

function syncThemeToggleIndicators(isLight) {
  const iconEl = document.getElementById('header-theme-icon');
  if (iconEl) iconEl.textContent = isLight ? '🌙' : '☀️';
  const drawerLbl = document.getElementById('drawer-theme-label');
  if (drawerLbl) drawerLbl.textContent = isLight ? '🌙 تغییر به تم تاریک-طلایی' : '☀️ تغییر به تم روشن (لایت‌مود)';
}

function applyThemeMode(mode) {
  const isLight = mode === 'light';
  if (isLight) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
  try {
    localStorage.setItem('hamahdi_theme_mode', isLight ? 'light' : 'dark');
  } catch (e) {}
  syncThemeToggleIndicators(isLight);
}

function toggleThemeMode() {
  const next = getThemeMode() === 'dark' ? 'light' : 'dark';
  applyThemeMode(next);
  if (typeof showToast === 'function') {
    showToast(next === 'light' ? '☀️ حالت روشن (لایت‌مود) هم‌عهدی فعال شد.' : '💎 حالت تاریک-طلایی هم‌عهدی فعال شد.');
  }
}

window.addEventListener('DOMContentLoaded', function () {
  applyThemeMode(getThemeMode());
});
