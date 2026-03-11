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
  var MARK_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<polygon points="12,2.5 20.2,7.25 20.2,16.75 12,21.5 3.8,16.75 3.8,7.25" stroke="rgba(255,255,255,.52)" stroke-width="1.2" fill="rgba(255,255,255,.07)"/>'
    + '<line x1="12" y1="11.5" x2="12" y2="4.1"   stroke="rgba(255,255,255,.7)" stroke-width="1.1"/>'
    + '<line x1="12" y1="11.5" x2="18.9" y2="16.1" stroke="rgba(255,255,255,.7)" stroke-width="1.1"/>'
    + '<line x1="12" y1="11.5" x2="5.1"  y2="16.1" stroke="rgba(255,255,255,.7)" stroke-width="1.1"/>'
    + '<circle cx="12"   cy="12"    r="2.5" fill="white"/>'
    + '<circle cx="12"   cy="2.5"   r="1.6" fill="rgba(255,255,255,.9)"/>'
    + '<circle cx="20.2" cy="16.75" r="1.6" fill="rgba(255,255,255,.9)"/>'
    + '<circle cx="3.8"  cy="16.75" r="1.6" fill="rgba(255,255,255,.9)"/>'
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
    /* nav bar — asymmetric violet gradient, stands out on light + dark pages */
    '.ecotech-nav{position:sticky;top:0;z-index:9999;height:48px;background:linear-gradient(105deg,#0D0030 0%,#2A0878 36%,#5720C8 62%,#7B2FFF 82%,#9040FF 100%);backdrop-filter:blur(24px);border-bottom:1px solid rgba(180,90,255,.22);display:flex;align-items:center;padding:0 24px;gap:0;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 2px 20px rgba(80,0,160,.35)}',
    /* logo */
    ".en-logo{font-family:'Unbounded',sans-serif;font-size:11px;font-weight:900;color:#fff;text-decoration:none;letter-spacing:-.3px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:8px}",
    '.en-logo span{color:rgba(220,190,255,.85)}',
    /* frosted-glass logo mark */
    '.en-logo-mark{width:28px;height:28px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;backdrop-filter:blur(8px)}',
    /* separator */
    '.en-sep{width:1px;height:18px;background:rgba(255,255,255,.15);margin:0 16px;flex-shrink:0}',
    '.en-links{display:flex;gap:2px;align-items:center}',
    '.en-drop{position:relative}',
    /* nav items — lighter text for contrast on violet */
    '.en-drop-trigger{font-size:12px;font-weight:700;color:rgba(220,210,255,.6);padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap;display:flex;align-items:center;gap:3px;cursor:default;letter-spacing:.01em;text-decoration:none}',
    ".en-drop-trigger::after{content:'▾';font-size:9px;opacity:.5;margin-left:1px}",
    '.en-drop.is-open .en-drop-trigger,.en-drop-trigger:hover{color:#fff;background:rgba(255,255,255,.1)}',
    '.en-drop.en-active .en-drop-trigger{color:#fff;background:rgba(255,255,255,.14)}',
    /* dropdown panel */
    '.en-drop-menu{position:absolute;top:calc(100% + 6px);left:0;background:rgba(10,3,28,.97);backdrop-filter:blur(24px);border:1px solid rgba(140,60,255,.25);border-radius:12px;padding:6px;min-width:240px;display:flex;flex-direction:column;gap:1px;z-index:10000;box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04);visibility:hidden;opacity:0;pointer-events:none;transform:translateY(-5px);transition:opacity .15s,transform .15s,visibility .15s}',
    '.en-drop.is-open .en-drop-menu{visibility:visible;opacity:1;pointer-events:auto;transform:translateY(0)}',
    '.en-drop-menu a{font-size:12px;font-weight:500;color:#9090B8;text-decoration:none;padding:7px 11px;border-radius:8px;transition:color .15s,background .15s;white-space:nowrap;display:block}',
    '.en-drop-menu a:hover{color:#fff;background:rgba(255,255,255,.07)}',
    '.en-drop-menu a.en-active{color:#D4AAFF;background:rgba(123,47,255,.18)}',
    '.en-drop-sep{height:1px;background:rgba(140,60,255,.15);margin:4px 6px}',
    ".en-drop-grp{font-family:'Unbounded',sans-serif;font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(160,100,255,.7);padding:6px 11px 3px;pointer-events:none}",
    '.en-link{font-size:12px;font-weight:700;color:rgba(220,210,255,.6);text-decoration:none;padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap}',
    '.en-link:hover{color:#fff;background:rgba(255,255,255,.1)}',
    '.en-link.en-active{color:#fff;background:rgba(255,255,255,.14)}'
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
