/**
 * Платформа инноваций — Breadcrumbs
 * Auto-generates breadcrumb navigation from URL path.
 * Injects: visible breadcrumb bar + JSON-LD BreadcrumbList for SEO.
 * Mobile (<640px): shows only last 2 levels.
 *
 * Loaded automatically via nav.js — no manual inclusion needed.
 */
(function () {
  'use strict';

  // ── base path (same as nav.js) ──────────────────────────
  var me = document.currentScript;
  var src = me ? (me.getAttribute('src') || 'js/breadcrumbs.js') : 'js/breadcrumbs.js';
  var base = src.replace(/js\/breadcrumbs\.js.*$/, '');

  // ── friendly names for directories and files ────────────
  var DIR_NAMES = {
    'продукту':        'Продукту',
    'фреймворк':       'Фреймворк',
    'проектный офис':  'Проектный офис',
    'бизнесу':         'Бизнесу',
    'хэндбук':         'Хэндбук',
    'витрина':         'Витрина',
    'design-system':   'Design System',
    'components':      'Компоненты'
  };

  var PAGE_NAMES = {
    'index.html':              'Главная',
    'business.html':           'Для бизнеса',
    'product.html':            'Для продукта',
    'templates.html':          'Шаблоны',
    'tools.html':              'Инструменты',
    'strategy.html':           'Стратегическое планирование',
    'rice.html':               'Калькулятор RICE',
    'council.html':            'Управляющий совет',
    'framework-lite.html':     'Гайд по стадиям',
    'rwb-product-os-v3.html':  'Продуктовый фреймворк',
    'rwb-product-os-v12.html': 'Хэндбук Product OS',
    'rwb-product-os-2026-03-03.html': 'Операционный справочник',
    'artifacts.html':          'Артефакты',
    'tokens-preview.html':     'Design Tokens',
    'badge-demo.html':         'Badge Demo'
  };

  // ── chevron SVG ─────────────────────────────────────────
  var CHEVRON = '<svg class="bc-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';

  // ── CSS ─────────────────────────────────────────────────
  var CSS = '.bc-bar{display:flex;align-items:center;gap:0;padding:8px 24px;font-family:var(--font-body,"Golos Text",sans-serif);font-size:12px;background:var(--color-bg-mid,#F3F0FF);border-bottom:1px solid var(--color-border,rgba(123,47,255,.10));min-height:36px;overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;scrollbar-width:none}'
    + '\n.bc-bar::-webkit-scrollbar{display:none}'
    + '\n.bc-item{display:flex;align-items:center;gap:0;flex-shrink:0}'
    + '\n.bc-link{color:var(--color-text-muted,#7A7A9D);text-decoration:none;padding:2px 4px;border-radius:4px;transition:color .15s,background .15s;font-weight:500}'
    + '\n.bc-link:hover{color:var(--color-text-primary,#1A1040);background:rgba(123,47,255,.06)}'
    + '\n.bc-current{color:var(--color-text-primary,#1A1040);font-weight:700;padding:2px 4px}'
    + '\n.bc-chevron{margin:0 2px;color:var(--color-text-dimmed,#B0B0C8);flex-shrink:0}'
    + '\n.bc-ellipsis{color:var(--color-text-dimmed,#B0B0C8);padding:2px 4px;display:none}'
    + '\n[data-theme="dark"] .bc-bar{background:var(--color-bg-mid,#161630);border-bottom-color:var(--color-border,rgba(255,255,255,.06))}'
    + '\n[data-theme="dark"] .bc-link:hover{color:var(--color-text-primary,#F0ECFF);background:rgba(255,255,255,.06)}'
    + '\n@media(max-width:640px){.bc-hide-mobile{display:none!important}.bc-ellipsis{display:inline}}';

  // ── parse URL into crumbs ───────────────────────────────
  function buildCrumbs() {
    var pathname;
    try { pathname = decodeURIComponent(window.location.pathname); }
    catch (e) { pathname = window.location.pathname; }

    // Find project root in path (look for ecotech or known patterns)
    var segments = pathname.replace(/\\/g, '/').split('/').filter(Boolean);

    // Find the index of the project root directory
    var rootIdx = -1;
    for (var i = 0; i < segments.length; i++) {
      if (segments[i].toLowerCase() === 'ecotech') { rootIdx = i; break; }
    }

    // If running on GitHub Pages, root might be the repo name
    if (rootIdx === -1) {
      // Fallback: use everything after the last known root-level file
      for (var j = segments.length - 1; j >= 0; j--) {
        var s = segments[j].toLowerCase();
        if (s === 'index.html' || s === 'business.html' || s === 'product.html') {
          rootIdx = j - 1;
          break;
        }
        if (DIR_NAMES[s]) {
          rootIdx = j - 1;
          break;
        }
      }
    }

    // Extract relevant path segments after root
    var relevant = rootIdx >= 0 ? segments.slice(rootIdx + 1) : segments.slice(-2);

    // Build crumb objects: [{label, href}]
    var crumbs = [{ label: 'Платформа', href: base + 'index.html' }];
    var hrefParts = [];

    for (var k = 0; k < relevant.length; k++) {
      var seg = relevant[k];
      var segLower = seg.toLowerCase();
      var isLast = (k === relevant.length - 1);

      if (isLast && segLower.endsWith('.html')) {
        // File — use page name or derive from title
        var pageName = PAGE_NAMES[segLower];
        if (!pageName) {
          // Try to get from <title>
          var title = document.title || '';
          var parts = title.split(/[—·\-|]/);
          pageName = (parts.length > 1 ? parts[parts.length - 1] : parts[0]).trim();
          if (!pageName || pageName.length > 40) pageName = seg.replace(/\.html$/i, '');
        }
        // Skip if it's index.html of a directory we already added
        if (segLower === 'index.html' && crumbs.length > 1) {
          // Update last crumb to be current (not a link)
          crumbs[crumbs.length - 1].href = null;
          continue;
        }
        crumbs.push({ label: pageName, href: null }); // current page = no link
      } else {
        // Directory
        var dirName = DIR_NAMES[segLower] || seg;
        hrefParts.push(seg);
        // Link to directory index if exists, otherwise just label
        var dirHref = base + hrefParts.join('/') + '/index.html';
        crumbs.push({ label: dirName, href: dirHref });
      }
    }

    // If only "Платформа" and we're on index.html, don't show breadcrumbs
    if (crumbs.length <= 1) return null;

    return crumbs;
  }

  // ── render breadcrumb HTML ──────────────────────────────
  function renderHTML(crumbs) {
    var total = crumbs.length;
    var html = '';

    for (var i = 0; i < total; i++) {
      var c = crumbs[i];
      var isLast = (i === total - 1);
      // On mobile, hide all but last 2 items
      var hideClass = (total > 2 && i < total - 2) ? ' bc-hide-mobile' : '';

      // Ellipsis before the visible mobile items
      if (total > 2 && i === total - 2) {
        html += '<span class="bc-ellipsis">\u2026</span>' + CHEVRON.replace('bc-chevron', 'bc-chevron bc-ellipsis');
      }

      if (i > 0) {
        html += '<span class="bc-item' + hideClass + '">' + CHEVRON + '</span>';
      }

      if (isLast || !c.href) {
        html += '<span class="bc-current' + hideClass + '">' + esc(c.label) + '</span>';
      } else {
        html += '<a class="bc-link' + hideClass + '" href="' + c.href + '">' + esc(c.label) + '</a>';
      }
    }

    return '<nav class="bc-bar" aria-label="breadcrumb" role="navigation">' + html + '</nav>';
  }

  // ── render JSON-LD for SEO ──────────────────────────────
  function renderJsonLd(crumbs) {
    var origin = window.location.origin || '';
    var items = [];
    for (var i = 0; i < crumbs.length; i++) {
      var url = crumbs[i].href
        ? origin + '/' + crumbs[i].href.replace(/^\.?\/?/, '')
        : window.location.href;
      items.push({
        '@type': 'ListItem',
        'position': i + 1,
        'name': crumbs[i].label,
        'item': url
      });
    }
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': items
    };
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── inject CSS ──────────────────────────────────────────
  function injectCSS() {
    if (document.getElementById('bc-styles')) return;
    var st = document.createElement('style');
    st.id = 'bc-styles';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  // ── inject breadcrumbs into page ────────────────────────
  function inject() {
    var crumbs = buildCrumbs();
    if (!crumbs) return; // Don't show on home page

    injectCSS();

    // Insert after nav bar
    var nav = document.querySelector('.ecotech-nav');
    if (nav) {
      nav.insertAdjacentHTML('afterend', renderHTML(crumbs));
    }

    // Inject JSON-LD
    var script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(renderJsonLd(crumbs));
    document.head.appendChild(script);
  }

  // ── init ────────────────────────────────────────────────
  if (document.querySelector('.ecotech-nav')) {
    inject();
  } else {
    // Wait for nav.js to inject the nav bar
    var observer = new MutationObserver(function (mutations, obs) {
      if (document.querySelector('.ecotech-nav')) {
        obs.disconnect();
        inject();
      }
    });
    if (document.body) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelector('.ecotech-nav')) {
          inject();
        } else {
          observer.observe(document.body, { childList: true, subtree: true });
        }
      });
    }
  }
})();
