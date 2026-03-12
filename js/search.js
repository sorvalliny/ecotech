/**
 * ОРБИТА — Global Search (Cmd+K / Ctrl+K)
 * Fuzzy search via Fuse.js, grouped results, keyboard navigation.
 *
 * Auto-loads: css/search.css, Fuse.js CDN, data/search-index.json
 * Injects search button into nav and modal into body.
 */
(function () {
  'use strict';

  // ── base path (same logic as nav.js) ────────────────────
  var me = document.currentScript;
  var src = me ? (me.getAttribute('src') || 'js/search.js') : 'js/search.js';
  var base = src.replace(/js\/search\.js.*$/, '');

  // ── state ───────────────────────────────────────────────
  var fuse = null;
  var searchData = [];
  var activeIdx = -1;
  var results = [];
  var isOpen = false;

  // ── SVG icons ───────────────────────────────────────────
  var SEARCH_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
  var ARROW_ICON = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

  var CAT_ICONS = {
    'Продукты':      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z"/></svg>',
    'Шаблоны':       '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    'Инструменты':   '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    'Документация':  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/></svg>'
  };

  var CAT_CSS_CLASS = {
    'Продукты':     'products',
    'Шаблоны':      'templates',
    'Инструменты':  'tools',
    'Документация': 'docs'
  };

  // ── detect OS for shortcut label ────────────────────────
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  var kbdLabel = isMac ? '\u2318K' : 'Ctrl+K';

  // ── load CSS ────────────────────────────────────────────
  function loadCSS() {
    if (document.getElementById('search-css')) return;
    var link = document.createElement('link');
    link.id = 'search-css';
    link.rel = 'stylesheet';
    link.href = base + 'css/search.css';
    document.head.appendChild(link);
  }

  // ── load Fuse.js via CDN ────────────────────────────────
  function loadFuse(cb) {
    if (window.Fuse) { cb(); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/fuse.js@7.0.0/dist/fuse.min.js';
    s.onload = cb;
    s.onerror = function () { console.warn('Fuse.js CDN failed'); };
    document.head.appendChild(s);
  }

  // ── load search index ───────────────────────────────────
  function loadIndex(cb) {
    if (searchData.length) { cb(); return; }
    var xhr = new XMLHttpRequest();
    xhr.open('GET', base + 'data/search-index.json', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        try { searchData = JSON.parse(xhr.responseText); } catch (e) { searchData = []; }
      }
      cb();
    };
    xhr.onerror = function () { cb(); };
    xhr.send();
  }

  // ── init Fuse instance ──────────────────────────────────
  function initFuse() {
    if (fuse || !window.Fuse || !searchData.length) return;
    fuse = new Fuse(searchData, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.25 },
        { name: 'tags', weight: 0.25 },
        { name: 'category', weight: 0.1 }
      ],
      threshold: 0.35,
      distance: 120,
      includeMatches: true,
      minMatchCharLength: 2
    });
  }

  // ── highlight matches with <mark> ───────────────────────
  function highlight(text, matches, key) {
    if (!matches || !text) return esc(text);
    var regions = [];
    for (var i = 0; i < matches.length; i++) {
      if (matches[i].key !== key) continue;
      var indices = matches[i].indices;
      for (var j = 0; j < indices.length; j++) {
        regions.push(indices[j]);
      }
    }
    if (!regions.length) return esc(text);
    // Merge overlapping regions
    regions.sort(function (a, b) { return a[0] - b[0]; });
    var merged = [regions[0]];
    for (var m = 1; m < regions.length; m++) {
      var last = merged[merged.length - 1];
      if (regions[m][0] <= last[1] + 1) {
        last[1] = Math.max(last[1], regions[m][1]);
      } else {
        merged.push(regions[m]);
      }
    }
    // Build highlighted string
    var out = '';
    var pos = 0;
    for (var k = 0; k < merged.length; k++) {
      var start = merged[k][0];
      var end = merged[k][1];
      out += esc(text.substring(pos, start));
      out += '<mark>' + esc(text.substring(start, end + 1)) + '</mark>';
      pos = end + 1;
    }
    out += esc(text.substring(pos));
    return out;
  }

  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ── render results grouped by category ──────────────────
  function renderResults(query) {
    var container = document.getElementById('search-results');
    if (!container) return;

    if (!query || query.length < 2) {
      // Show recent / popular
      container.innerHTML = renderGrouped(searchData.slice(0, 12), null);
      results = container.querySelectorAll('.search-item');
      setActive(-1);
      return;
    }

    if (!fuse) {
      container.innerHTML = '<div class="search-empty"><div class="search-empty-icon">...</div>Загрузка индекса...</div>';
      return;
    }

    var fuseResults = fuse.search(query);
    if (!fuseResults.length) {
      container.innerHTML = '<div class="search-empty"><div class="search-empty-icon">?</div>Ничего не найдено по «' + esc(query) + '»</div>';
      results = [];
      setActive(-1);
      return;
    }

    container.innerHTML = renderGrouped(
      fuseResults.map(function (r) { return r.item; }),
      fuseResults
    );
    results = container.querySelectorAll('.search-item');
    setActive(0);
  }

  function renderGrouped(items, fuseResults) {
    var CAT_ORDER = ['Продукты', 'Шаблоны', 'Инструменты', 'Документация'];
    var groups = {};
    for (var i = 0; i < items.length; i++) {
      var cat = items[i].category || 'Документация';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ item: items[i], fuseIdx: i });
    }

    var html = '';
    for (var c = 0; c < CAT_ORDER.length; c++) {
      var catName = CAT_ORDER[c];
      var group = groups[catName];
      if (!group || !group.length) continue;

      html += '<div class="search-cat">' + catName + '</div>';
      for (var g = 0; g < group.length; g++) {
        var item = group[g].item;
        var matches = fuseResults ? fuseResults[group[g].fuseIdx].matches : null;
        var iconClass = CAT_CSS_CLASS[catName] || 'docs';
        var icon = CAT_ICONS[catName] || CAT_ICONS['Документация'];

        var titleHTML = matches ? highlight(item.title, matches, 'title') : esc(item.title);
        var descHTML = matches ? highlight(item.description, matches, 'description') : esc(item.description);

        html += '<a class="search-item" href="' + base + item.url + '" data-id="' + item.id + '">'
          + '<div class="search-item-icon search-item-icon--' + iconClass + '">' + icon + '</div>'
          + '<div class="search-item-body">'
          + '<div class="search-item-title">' + titleHTML + '</div>'
          + '<div class="search-item-desc">' + descHTML + '</div>'
          + '</div>'
          + '<div class="search-item-arrow">' + ARROW_ICON + '</div>'
          + '</a>';
      }
    }
    return html;
  }

  // ── keyboard nav ────────────────────────────────────────
  function setActive(idx) {
    for (var i = 0; i < results.length; i++) {
      results[i].classList.remove('active');
    }
    activeIdx = idx;
    if (idx >= 0 && idx < results.length) {
      results[idx].classList.add('active');
      results[idx].scrollIntoView({ block: 'nearest' });
    }
  }

  // ── open / close ────────────────────────────────────────
  function open() {
    if (isOpen) return;
    isOpen = true;
    var overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.add('open');
      var input = document.getElementById('search-input');
      if (input) {
        input.value = '';
        input.focus();
        renderResults('');
      }
    }
  }

  function close() {
    if (!isOpen) return;
    isOpen = false;
    var overlay = document.getElementById('search-overlay');
    if (overlay) overlay.classList.remove('open');
    activeIdx = -1;
  }

  // ── inject modal HTML into body ─────────────────────────
  function injectModal() {
    if (document.getElementById('search-overlay')) return;

    var html = '<div class="search-overlay" id="search-overlay">'
      + '<div class="search-modal" onclick="event.stopPropagation()">'
      + '<div class="search-input-row">'
      + '<div class="search-input-icon">' + SEARCH_ICON + '</div>'
      + '<input class="search-input" id="search-input" type="text" placeholder="Поиск по платформе..." autocomplete="off" spellcheck="false">'
      + '<span class="search-input-kbd">Esc</span>'
      + '</div>'
      + '<div class="search-results" id="search-results"></div>'
      + '<div class="search-hint">'
      + '<span><kbd>\u2191</kbd><kbd>\u2193</kbd> навигация</span>'
      + '<span><kbd>Enter</kbd> открыть</span>'
      + '<span><kbd>Esc</kbd> закрыть</span>'
      + '</div>'
      + '</div>'
      + '</div>';

    document.body.insertAdjacentHTML('beforeend', html);

    // ── event: overlay click to close ──
    document.getElementById('search-overlay').addEventListener('click', function (e) {
      if (e.target === this) close();
    });

    // ── event: input ──
    var input = document.getElementById('search-input');
    var debounceTimer;
    input.addEventListener('input', function () {
      var q = input.value.trim();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(function () {
        renderResults(q);
      }, 80);
    });

    // ── event: keyboard inside input ──
    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (results.length) setActive(Math.min(activeIdx + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (results.length) setActive(Math.max(activeIdx - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIdx >= 0 && results[activeIdx]) {
          var href = results[activeIdx].getAttribute('href');
          if (href) window.location.href = href;
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    });
  }

  // ── inject search button into nav ──────────────────────
  function injectNavButton() {
    var nav = document.querySelector('.ecotech-nav');
    if (!nav) return;
    // Insert before theme button
    var themeBtn = document.getElementById('en-theme-btn');
    if (!themeBtn) return;

    var btn = document.createElement('button');
    btn.className = 'en-search-btn';
    btn.setAttribute('type', 'button');
    btn.innerHTML = SEARCH_ICON + '<span>Поиск...</span><kbd>' + kbdLabel + '</kbd>';
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      open();
    });

    themeBtn.parentNode.insertBefore(btn, themeBtn);
  }

  // ── global keyboard shortcut (Cmd+K / Ctrl+K) ──────────
  document.addEventListener('keydown', function (e) {
    var isK = e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л'; // Cyrillic K
    if (isK && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (isOpen) {
        close();
      } else {
        open();
      }
    }
    if (e.key === 'Escape' && isOpen) {
      close();
    }
  });

  // ── init on DOM ready ───────────────────────────────────
  function init() {
    loadCSS();
    injectModal();
    injectNavButton();

    // Load Fuse + index in parallel
    loadFuse(function () {
      loadIndex(function () {
        initFuse();
      });
    });
  }

  if (document.body) {
    // If nav.js already ran, defer to allow nav to inject first
    setTimeout(init, 10);
  } else {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(init, 10);
    });
  }
})();
