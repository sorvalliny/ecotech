/**
 * Платформа инноваций — Universal Navigation
 * Single source of truth for all pages.
 * Load as <script src="nav.js"></script> (root) or
 *         <script src="../nav.js"></script> (subdir).
 */
(function () {
  // ── base path to root ──────────────────────────────────────
  var me = document.currentScript;
  var src = me ? (me.getAttribute('src') || 'nav.js') : 'nav.js';
  // e.g. '' for root pages, '../' for subdirectory pages
  var base = src.replace(/[^/\\]*$/, '').replace(/^\.\//, '');

  // ── current page detection (handles Cyrillic file:// paths) ──
  var p;
  try { p = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\\/g, '/'); }
  catch (e) { p = window.location.pathname.toLowerCase(); }
  var filename = p.split('/').pop();

  function has(s) { return p.indexOf(s.toLowerCase()) !== -1; }

  // ── active group detection ──────────────────────────────────
  var bizActive  = (has('business') || has('бизнесу')) ? ' en-active' : '';
  var pdktActive = (has('product')  || has('продукту') || has('tools') || has('council') || has('фреймворк') || has('framework') || has('rwb-product-os') || has('strategy') || has('хэндбук') || has('handbook') || has('artifacts')) ? ' en-active' : '';

  // ── link builder (auto-detects active by filename) ──────────
  function a(href, label) {
    var hf;
    try { hf = decodeURIComponent(href).toLowerCase().split('/').pop(); }
    catch (e) { hf = href.toLowerCase().split('/').pop(); }
    var cls = (filename === hf) ? ' class="en-active"' : '';
    return '<a href="' + base + href + '"' + cls + '>' + label + '</a>';
  }

  function sep() { return '<div class="en-drop-sep"></div>'; }
  function grp(label) { return '<div class="en-drop-grp">' + label + '</div>'; }

  // ── logo icon SVG (hexagon network hub) ─────────────────────
  var MARK_SVG = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<polygon points="12,2.5 20.2,7.25 20.2,16.75 12,21.5 3.8,16.75 3.8,7.25" stroke="rgba(255,255,255,.5)" stroke-width="1.3" fill="rgba(255,255,255,.07)"/>'
    + '<line x1="12" y1="11.5" x2="12" y2="4" stroke="rgba(255,255,255,.65)" stroke-width="1.2"/>'
    + '<line x1="12" y1="11.5" x2="18.8" y2="16.1" stroke="rgba(255,255,255,.65)" stroke-width="1.2"/>'
    + '<line x1="12" y1="11.5" x2="5.2" y2="16.1" stroke="rgba(255,255,255,.65)" stroke-width="1.2"/>'
    + '<circle cx="12" cy="12" r="2.4" fill="white"/>'
    + '<circle cx="12" cy="2.5" r="1.55" fill="rgba(255,255,255,.88)"/>'
    + '<circle cx="20.2" cy="16.75" r="1.55" fill="rgba(255,255,255,.88)"/>'
    + '<circle cx="3.8" cy="16.75" r="1.55" fill="rgba(255,255,255,.88)"/>'
    + '</svg>';

  // ── nav HTML ────────────────────────────────────────────────
  var nav = '<nav class="ecotech-nav">'

    + '<a class="en-logo" href="' + base + 'index.html"><span class="en-logo-mark">' + MARK_SVG + '</span>Платформа <span>инноваций</span></a>'
    + '<div class="en-sep"></div>'
    + '<div class="en-links">'

    // ── Бизнесу ──────────────────────────────
    + '<div class="en-drop' + bizActive + '">'
    +   '<a class="en-drop-trigger">Бизнесу</a>'
    +   '<div class="en-drop-menu">'
    +     a('business.html', 'Для бизнеса')
    +   '</div>'
    + '</div>'

    // ── Продукту ─────────────────────────────
    + '<div class="en-drop' + pdktActive + '">'
    +   '<a class="en-drop-trigger">Продукту</a>'
    +   '<div class="en-drop-menu">'
    +     a('product.html',                              'С чего начать')
    +     sep()
    +     grp('Процессы и артефакты')
    +     a('Фреймворк/rwb-product-os-v3.html',         'Продуктовый фреймворк')
    +     a('Фреймворк/framework-lite.html',             'Гайд по стадиям зрелости')
    +     a('Продукту/strategy.html',                   'Стратегическое планирование')
    +     a('Проектный офис/council.html',              'Управляющий совет')
    +     a('Фреймворк/artifacts.html',                 'Артефакты (шаблоны)')
    +     sep()
    +     grp('Инструменты и сервисы')
    +     a('Продукту/tools.html',                      'Инструменты')
    +   '</div>'
    + '</div>'

    + '</div>'
    + '</nav>';

  // ── CSS ─────────────────────────────────────────────────────
  var CSS = [
    '.ecotech-nav{position:sticky;top:0;z-index:9999;height:44px;background:rgba(8,8,26,.96);backdrop-filter:blur(20px);border-bottom:1px solid rgba(123,47,255,.15);display:flex;align-items:center;padding:0 24px;gap:0}',
    ".en-logo{font-family:'Unbounded',sans-serif;font-size:11px;font-weight:900;color:#fff;text-decoration:none;letter-spacing:-.3px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:7px}",
    '.en-logo span{color:#C49CFF}',
    '.en-logo-mark{width:22px;height:22px;background:linear-gradient(135deg,#7B2FFF,#FF2D8A);border-radius:6px;display:flex;align-items:center;justify-content:center;flex-shrink:0}',
    '.en-sep{width:1px;height:16px;background:rgba(123,47,255,.2);margin:0 16px;flex-shrink:0}',
    '.en-links{display:flex;gap:2px;align-items:center}',
    '.en-drop{position:relative}',
    '.en-drop-trigger{font-size:12px;font-weight:700;color:#7A7A9D;padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap;display:flex;align-items:center;gap:3px;cursor:default;letter-spacing:.01em;text-decoration:none}',
    ".en-drop-trigger::after{content:'▾';font-size:9px;opacity:.45;margin-left:1px}",
    '.en-drop.is-open .en-drop-trigger,.en-drop-trigger:hover{color:#fff;background:rgba(255,255,255,.06)}',
    '.en-drop.en-active .en-drop-trigger{color:#C49CFF;background:rgba(123,47,255,.12)}',
    '.en-drop-menu{position:absolute;top:calc(100% + 4px);left:0;background:rgba(13,13,30,.98);backdrop-filter:blur(20px);border:1px solid rgba(123,47,255,.2);border-radius:11px;padding:6px;min-width:230px;display:flex;flex-direction:column;gap:1px;z-index:10000;box-shadow:0 8px 32px rgba(0,0,0,.45);visibility:hidden;opacity:0;pointer-events:none;transform:translateY(-4px);transition:opacity .15s,transform .15s,visibility .15s}',
    '.en-drop.is-open .en-drop-menu{visibility:visible;opacity:1;pointer-events:auto;transform:translateY(0)}',
    '.en-drop-menu a{font-size:12px;font-weight:500;color:#7A7A9D;text-decoration:none;padding:7px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap;display:block}',
    '.en-drop-menu a:hover{color:#fff;background:rgba(255,255,255,.06)}',
    '.en-drop-menu a.en-active{color:#C49CFF;background:rgba(123,47,255,.12)}',
    '.en-drop-sep{height:1px;background:rgba(123,47,255,.12);margin:4px}',
    ".en-drop-grp{font-family:'Unbounded',sans-serif;font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(123,47,255,.6);padding:6px 11px 3px;pointer-events:none;}",
    '.en-link{font-size:12px;font-weight:700;color:#7A7A9D;text-decoration:none;padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap}',
    '.en-link:hover{color:#fff;background:rgba(255,255,255,.06)}',
    '.en-link.en-active{color:#C49CFF;background:rgba(123,47,255,.12)}'
  ].join('\n');

  // ── inject CSS into <head> immediately (head is available) ──
  if (!document.getElementById('en-styles')) {
    var st = document.createElement('style');
    st.id = 'en-styles';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ── inject nav + init dropdowns (body must exist) ───────────
  function inject() {
    document.body.insertAdjacentHTML('afterbegin', nav);
    [].forEach.call(document.querySelectorAll('.en-drop'), function (d) {
      var t;
      d.addEventListener('mouseenter', function () { clearTimeout(t); d.classList.add('is-open'); });
      d.addEventListener('mouseleave', function () { t = setTimeout(function () { d.classList.remove('is-open'); }, 120); });
    });
  }

  if (document.body) {
    inject();                                          // script at end of body
  } else {
    document.addEventListener('DOMContentLoaded', inject); // script in <head>
  }
})();
