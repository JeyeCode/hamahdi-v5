/**
 * HAMAHDI v4.0.0 | ماژول هسته ۳: کنترلر تم پیش‌فرض «لایت مود شیشه‌ای نئونی» و «دارک مود شیشه‌ای نئونی»
 */
function getThemeMode() {
  try {
    return localStorage.getItem('hamahdi_theme_mode') === 'dark' ? 'dark' : 'light';
  } catch (e) {
    return 'light';
  }
}

function applyThemeMode(mode) {
  const isLight = mode !== 'dark';
  if (isLight) {
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
  }
  try {
    localStorage.setItem('hamahdi_theme_mode', isLight ? 'light' : 'dark');
  } catch (e) {}
  const iconEl = document.getElementById('header-theme-icon');
  if (iconEl) iconEl.textContent = isLight ? '🌙' : '☀️';
  const deskLbl = document.getElementById('desktop-theme-label');
  if (deskLbl) deskLbl.textContent = isLight ? '🌙 تم تیره' : '☀️ تم روشن';
  if (typeof renderMobileDrawerContent === 'function') renderMobileDrawerContent();
  if (typeof renderDesktopRightPillDock === 'function') renderDesktopRightPillDock();
}

function toggleThemeMode() {
  const next = getThemeMode() === 'light' ? 'dark' : 'light';
  applyThemeMode(next);
  showToast(next === 'light' ? '🎨 تم روشن «لایت مود شیشه‌ای نئون» فعال شد.' : '💎 تم تیره «دارک مود شیشه‌ای نئونی» فعال شد.');
}
