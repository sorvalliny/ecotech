/**
 * ОРБИТА — Theme Switcher
 * Toggles data-theme="light" / "dark" on <html>.
 * Persists choice in localStorage key "theme".
 * Loaded by nav.js — button injected into .ecotech-nav.
 */
(function () {
  var LS_KEY = 'theme';

  // ── SVG icons (Heroicons outline, 20×20) ──────────────────
  var SUN = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<circle cx="12" cy="12" r="5"/>'
    + '<line x1="12" y1="1" x2="12" y2="3"/>'
    + '<line x1="12" y1="21" x2="12" y2="23"/>'
    + '<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>'
    + '<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>'
    + '<line x1="1" y1="12" x2="3" y2="12"/>'
    + '<line x1="21" y1="12" x2="23" y2="12"/>'
    + '<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>'
    + '<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
    + '</svg>';

  var MOON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>'
    + '</svg>';

  // ── Resolve initial theme ─────────────────────────────────
  function getSystemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getSaved() {
    try { return localStorage.getItem(LS_KEY); } catch (e) { return null; }
  }

  function getTheme() {
    return getSaved() || getSystemPref();
  }

  // ── Apply theme immediately (no FOUC) ─────────────────────
  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // update button icon if it exists
    var btn = document.getElementById('en-theme-btn');
    if (btn) {
      btn.innerHTML = theme === 'dark' ? SUN : MOON;
      btn.title = theme === 'dark' ? 'Светлая тема' : 'Тёмная тема';
    }
  }

  // Apply saved theme ASAP (before body renders)
  apply(getTheme());

  // ── Inject transition CSS ─────────────────────────────────
  if (!document.getElementById('en-theme-transition')) {
    var st = document.createElement('style');
    st.id = 'en-theme-transition';
    st.textContent = 'html[data-theme] body{transition:background .2s ease,color .2s ease}'
      + '\nhtml[data-theme] .ecotech-nav{transition:none}';
    document.head.appendChild(st);
  }

  // ── Toggle function ───────────────────────────────────────
  function toggle() {
    var cur = document.documentElement.getAttribute('data-theme') || getTheme();
    var next = cur === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem(LS_KEY, next); } catch (e) {}
  }

  // ── Listen for system preference changes ──────────────────
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getSaved()) apply(e.matches ? 'dark' : 'light');
    });
  }

  // ── Public API ────────────────────────────────────────────
  window.EcoTheme = {
    toggle: toggle,
    apply: apply,
    get: getTheme,
    SUN: SUN,
    MOON: MOON
  };
})();
