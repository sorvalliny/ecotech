/**
 * ОРБИТА — Universal Navigation
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

  // ── load Google Fonts (Orbitron + Exo 2) ────────────────────
  if (!document.getElementById('en-google-fonts')) {
    var gf = document.createElement('link');
    gf.id = 'en-google-fonts'; gf.rel = 'stylesheet';
    gf.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Exo+2:wght@400;500;600;700&display=swap';
    document.head.appendChild(gf);
  }

  // ── load tokens.css + theme.js ────────────────────────────
  if (!document.getElementById('en-tokens-css')) {
    var lk = document.createElement('link');
    lk.id = 'en-tokens-css'; lk.rel = 'stylesheet';
    lk.href = base + 'design-system/tokens.css';
    document.head.appendChild(lk);
  }
  if (!document.getElementById('en-theme-vars-css')) {
    var tv = document.createElement('link');
    tv.id = 'en-theme-vars-css'; tv.rel = 'stylesheet';
    tv.href = base + 'css/theme-vars.css';
    document.head.appendChild(tv);
  }
  if (!document.getElementById('en-theme-js')) {
    var ts = document.createElement('script');
    ts.id = 'en-theme-js'; ts.src = base + 'js/theme.js';
    document.head.appendChild(ts);
  }
  if (!document.getElementById('en-search-js')) {
    var ss = document.createElement('script');
    ss.id = 'en-search-js'; ss.src = base + 'js/search.js';
    document.head.appendChild(ss);
  }
  if (!document.getElementById('en-breadcrumbs-js')) {
    var bs = document.createElement('script');
    bs.id = 'en-breadcrumbs-js'; bs.src = base + 'js/breadcrumbs.js';
    document.head.appendChild(bs);
  }
  if (!document.getElementById('en-responsive-css')) {
    var rl = document.createElement('link');
    rl.id = 'en-responsive-css'; rl.rel = 'stylesheet';
    rl.href = base + 'css/responsive.css';
    document.head.appendChild(rl);
  }
  if (!document.getElementById('en-tooltip-css')) {
    var tc = document.createElement('link');
    tc.id = 'en-tooltip-css'; tc.rel = 'stylesheet';
    tc.href = base + 'design-system/components/tooltip.css';
    document.head.appendChild(tc);
  }
  if (!document.getElementById('en-tooltip-js')) {
    var tj = document.createElement('script');
    tj.id = 'en-tooltip-js'; tj.src = base + 'design-system/components/tooltip.js';
    document.head.appendChild(tj);
  }

  // ── current page detection (handles Cyrillic file:// paths) ──
  var p;
  try { p = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\\/g, '/'); }
  catch (e) { p = window.location.pathname.toLowerCase(); }
  var filename = p.split('/').pop();

  function has(s) { return p.indexOf(s.toLowerCase()) !== -1; }

  // ── active group detection ──────────────────────────────────
  var bizActive  = (has('business') || has('бизнесу') || has('dashboard')) ? ' en-active' : '';
  var pdktActive = (has('product')  || has('продукту') || has('tools') || has('council') || has('фреймворк') || has('framework') || has('rwb-product-os') || has('проектный офис') || has('strategy') || has('хэндбук') || has('handbook') || has('templates') || has('artifacts') || has('rice') || has('brief') || has('tracker') || has('gate-checklist') || has('terminology')) ? ' en-active' : '';

  // ── link builder (auto-detects active by filename) ──────────
  function a(href, label) {
    var hf;
    try { hf = decodeURIComponent(href).toLowerCase().split('/').pop(); }
    catch (e) { hf = href.toLowerCase().split('/').pop(); }
    var cls = (filename === hf) ? ' class="en-active"' : '';
    return '<a href="' + base + href + '"' + cls + ' role="menuitem">' + label + '</a>';
  }

  function sep() { return '<div class="en-drop-sep"></div>'; }
  function grp(label) { return '<div class="en-drop-grp">' + label + '</div>'; }

  // ── RWB logo SVG (right side of nav) ────────────────────────
  var RWB_SVG = '<svg width="62" height="21" viewBox="0 0 83 28" fill="none" xmlns="http://www.w3.org/2000/svg">'
    + '<path fill="rgba(255,255,255,.7)" d="M23.514 27.096h-5.318l-3.34-5.88H0v-4.222h16.722c1.925 0 3.485-1.545 3.485-3.451s-1.56-3.452-3.485-3.452H0V5.88h17.36c4.276 0 7.743 3.433 7.743 7.668 0 3.339-2.159 6.171-5.167 7.224zm23.306-5.88h-2.707l-4.227-7.47-4.23 7.47H32.95L24.266 5.88h5.314l4.723 8.335 4.722-8.335h1.72l4.722 8.334 4.722-8.334h5.314zm27.478 0h-17.36v-4.222H73.66c1.925 0 3.486-1.545 3.486-3.451s-1.56-3.451-3.486-3.451H56.938V0h5.183v5.88h12.177c4.276 0 7.743 3.433 7.743 7.668s-3.467 7.668-7.743 7.668"/>'
    + '</svg>';

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
  var nav = '<nav class="ecotech-nav" role="navigation" aria-label="Главная навигация">'

    + '<a class="en-logo" href="' + base + 'index.html"><span class="en-logo-mark">' + MARK_SVG + '</span>ОРБИТА</a>'
    + '<div class="en-sep"></div>'
    + '<div class="en-links">'

    // ── Бизнесу ──────────────────────────────
    + '<div class="en-drop' + bizActive + '">'
    +   '<a class="en-drop-trigger" aria-haspopup="true" aria-expanded="false">Бизнесу</a>'
    +   '<div class="en-drop-menu" role="menu">'
    +     a('business.html', 'Для бизнеса')
    +   '</div>'
    + '</div>'

    // ── Продукту ─────────────────────────────
    + '<div class="en-drop' + pdktActive + '">'
    +   '<a class="en-drop-trigger" aria-haspopup="true" aria-expanded="false">Продукту</a>'
    +   '<div class="en-drop-menu" role="menu">'
    +     a('product.html',                              'С чего начать')
    +     sep()
    +     grp('Процессы и артефакты')
    +     a('Фреймворк/framework-lite.html',             'Продуктовый фреймворк')
    +     a('Проектный офис/tracker.html',              'Трекер продуктов')
    +     a('Продукту/templates.html',                  'Шаблоны')
    +     sep()
    +     grp('Инструменты')
    +     a('Продукту/brief.html',                      'Product Brief')
    +     a('Продукту/gate-checklist.html',             'Gate-чеклист')
    +     a('Продукту/tools.html',                      'Инструменты')
    +     sep()
    +     grp('Справочник')
    +     a('terminology.html',                         'Глоссарий')
    +   '</div>'
    + '</div>'

    + '</div>'
    + '<button id="en-theme-btn" class="en-theme-btn" onclick="EcoTheme.toggle()" title="Переключить тему" aria-label="Переключить тему"></button>'
    + '<a class="en-rwb" href="https://rwb.ru" target="_blank" rel="noopener">' + RWB_SVG + '</a>'
    + '<button class="en-hamburger" id="en-hamburger" aria-label="Меню" aria-expanded="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg></button>'
    + '</nav>';

  // ── CSS ─────────────────────────────────────────────────────
  var CSS = [
    /* nav bar — asymmetric cosmic blue gradient, stands out on light + dark pages */
    '.ecotech-nav{position:sticky;top:0;z-index:var(--z-nav,9999);height:48px;background:linear-gradient(105deg,#020810 0%,#041830 36%,#0a3560 62%,#0d5090 82%,#4FC3F7 100%);backdrop-filter:blur(24px);border-bottom:1px solid rgba(79,195,247,.22);display:flex;align-items:center;padding:0 24px;gap:0;box-shadow:0 1px 0 rgba(255,255,255,.06) inset,0 2px 20px rgba(2,136,209,.35)}',
    /* logo */
    ".en-logo{font-family:'Orbitron',sans-serif;font-size:11px;font-weight:900;color:#fff;text-decoration:none;letter-spacing:-.3px;white-space:nowrap;flex-shrink:0;display:flex;align-items:center;gap:8px}",
    '.en-logo span{color:rgba(180,225,255,.85)}',
    /* frosted-glass logo mark */
    '.en-logo-mark{width:28px;height:28px;background:rgba(255,255,255,.13);border:1px solid rgba(255,255,255,.22);border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;backdrop-filter:blur(8px)}',
    /* separator */
    '.en-sep{width:1px;height:18px;background:rgba(255,255,255,.15);margin:0 16px;flex-shrink:0}',
    '.en-links{display:flex;gap:2px;align-items:center}',
    '.en-drop{position:relative}',
    /* nav items — lighter text for contrast on cosmic blue */
    '.en-drop-trigger{font-size:12px;font-weight:700;color:rgba(180,220,255,.6);padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap;display:flex;align-items:center;gap:3px;cursor:default;letter-spacing:.01em;text-decoration:none}',
    ".en-drop-trigger::after{content:'▾';font-size:9px;opacity:.5;margin-left:1px}",
    '.en-drop.is-open .en-drop-trigger,.en-drop-trigger:hover{color:#fff;background:rgba(255,255,255,.1)}',
    '.en-drop.en-active .en-drop-trigger{color:#fff;background:rgba(255,255,255,.14)}',
    /* dropdown panel */
    '.en-drop-menu{position:absolute;top:calc(100% + 6px);left:0;background:rgba(2,8,16,.97);backdrop-filter:blur(24px);border:1px solid rgba(79,195,247,.25);border-radius:12px;padding:6px;min-width:240px;display:flex;flex-direction:column;gap:1px;z-index:var(--z-modal,10000);box-shadow:0 12px 40px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.04);visibility:hidden;opacity:0;pointer-events:none;transform:translateY(-5px);transition:opacity .15s,transform .15s,visibility .15s}',
    '.en-drop.is-open .en-drop-menu{visibility:visible;opacity:1;pointer-events:auto;transform:translateY(0)}',
    '.en-drop-menu a{font-size:12px;font-weight:500;color:#9090B8;text-decoration:none;padding:7px 11px;border-radius:8px;transition:color .15s,background .15s;white-space:nowrap;display:block}',
    '.en-drop-menu a:hover{color:#fff;background:rgba(255,255,255,.07)}',
    '.en-drop-menu a.en-active{color:#81D4FA;background:rgba(79,195,247,.18)}',
    '.en-drop-sep{height:1px;background:rgba(79,195,247,.15);margin:4px 6px}',
    ".en-drop-grp{font-family:'Orbitron',sans-serif;font-size:8px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(79,195,247,.7);padding:6px 11px 3px;pointer-events:none}",
    '.en-link{font-size:12px;font-weight:700;color:rgba(180,220,255,.6);text-decoration:none;padding:5px 11px;border-radius:7px;transition:color .15s,background .15s;white-space:nowrap}',
    '.en-link:hover{color:#fff;background:rgba(255,255,255,.1)}',
    '.en-link.en-active{color:#fff;background:rgba(255,255,255,.14)}',
    /* theme toggle */
    '.en-theme-btn{margin-left:auto;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:8px;width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(180,220,255,.7);transition:color .15s,background .15s,border-color .15s;flex-shrink:0;padding:0}',
    '.en-theme-btn:hover{color:#fff;background:rgba(255,255,255,.14);border-color:rgba(255,255,255,.25)}',
    /* RWB logo — right side */
    '.en-rwb{margin-left:12px;display:flex;align-items:center;opacity:.7;transition:opacity .15s;flex-shrink:0}',
    '.en-rwb:hover{opacity:1}'
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
    // Skip link — first element in body
    if (!document.querySelector('.skip-link')) {
      var mainTarget = document.querySelector('main, .page-wrap, .wrap, .tl-wrap, #content, .page');
      if (mainTarget && !mainTarget.id) mainTarget.id = 'main-content';
      var skipHref = mainTarget ? '#' + mainTarget.id : '#main-content';
      document.body.insertAdjacentHTML('afterbegin', '<a class="skip-link" href="' + skipHref + '">Перейти к содержимому</a>');
    }
    document.body.insertAdjacentHTML('afterbegin', nav);
    [].forEach.call(document.querySelectorAll('.en-drop'), function (d) {
      var t;
      var trigger = d.querySelector('.en-drop-trigger');
      var menu = d.querySelector('.en-drop-menu');

      function openDrop() {
        clearTimeout(t);
        d.classList.add('is-open');
        if (trigger) trigger.setAttribute('aria-expanded', 'true');
      }
      function closeDrop(focusTrigger) {
        d.classList.remove('is-open');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
          if (focusTrigger) trigger.focus();
        }
      }

      // mouse
      d.addEventListener('mouseenter', openDrop);
      d.addEventListener('mouseleave', function () {
        t = setTimeout(function () { closeDrop(false); }, 120);
      });

      // keyboard: Enter / Space open, Escape closes
      if (trigger) {
        trigger.setAttribute('tabindex', '0');
        trigger.setAttribute('role', 'button');
        trigger.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (d.classList.contains('is-open')) { closeDrop(true); }
            else {
              openDrop();
              // focus first menu link
              var first = menu && menu.querySelector('a');
              if (first) first.focus();
            }
          }
          if (e.key === 'Escape') { closeDrop(true); }
          // arrow down → first item
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            openDrop();
            var first = menu && menu.querySelector('a');
            if (first) first.focus();
          }
        });
      }

      // keyboard nav inside menu
      if (menu) {
        menu.addEventListener('keydown', function (e) {
          var links = [].slice.call(menu.querySelectorAll('a'));
          var idx = links.indexOf(document.activeElement);
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (idx < links.length - 1) links[idx + 1].focus();
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (idx > 0) links[idx - 1].focus();
            else if (trigger) trigger.focus();
          } else if (e.key === 'Escape') {
            closeDrop(true);
          }
        });
      }
    });
    // hamburger toggle
    var burger = document.getElementById('en-hamburger');
    if (burger) {
      burger.addEventListener('click', function () {
        var navEl = document.querySelector('.ecotech-nav');
        if (navEl) {
          navEl.classList.toggle('nav-open');
          burger.setAttribute('aria-expanded', navEl.classList.contains('nav-open') ? 'true' : 'false');
        }
      });
    }
    // populate theme button icon once theme.js has loaded
    function initThemeBtn() {
      if (window.EcoTheme) { EcoTheme.apply(EcoTheme.get()); }
      else { setTimeout(initThemeBtn, 50); }
    }
    initThemeBtn();
  }

  if (document.body) {
    inject();                                          // script at end of body
  } else {
    document.addEventListener('DOMContentLoaded', inject); // script in <head>
  }
})();
