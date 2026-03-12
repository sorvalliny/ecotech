/**
 * Платформа инноваций — Badge Component
 * Creates status badges with inline Heroicons SVG.
 *
 * Usage:
 *   Badge.gate(3)                  → <span class="badge badge--gate-3">⚑ Gate 3</span>
 *   Badge.gate(3, 'Запуск')        → <span class="badge badge--gate-3">⚑ Запуск</span>
 *   Badge.risk('on-track')         → <span class="badge badge--on-track">● On Track</span>
 *   Badge.risk('at-risk','Риск!')  → <span class="badge badge--at-risk">▲ Риск!</span>
 *   Badge.html('gate', 3)          → returns HTML string
 */
(function () {
  'use strict';

  // ── Heroicons (outline, 14×14) ──────────────────────────────
  var ICONS = {
    // Gate icons — progressive: empty → half → full
    gate0: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>',
    gate1: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
    gate2: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    gate3: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
    gate4: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    gate5: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    // Risk icons
    'on-track': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    'at-risk': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'paused': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="10" y1="15" x2="10" y2="9"/><line x1="14" y1="15" x2="14" y2="9"/></svg>',
    'done': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };

  var GATE_LABELS = ['Gate 0', 'Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];
  var RISK_LABELS = {
    'on-track': 'On Track',
    'at-risk':  'At Risk',
    'paused':   'Paused',
    'done':     'Done'
  };

  // ── HTML builder ──────────────────────────────────────────
  function gateHTML(n, label) {
    n = Math.max(0, Math.min(5, parseInt(n, 10) || 0));
    var text = label || GATE_LABELS[n];
    var icon = ICONS['gate' + n] || ICONS.gate0;
    return '<span class="badge badge--gate-' + n + '">' + icon + ' ' + text + '</span>';
  }

  function riskHTML(type, label) {
    type = (type || '').toLowerCase().replace(/\s+/g, '-');
    if (!RISK_LABELS[type]) type = 'on-track';
    var text = label || RISK_LABELS[type];
    var icon = ICONS[type] || ICONS['on-track'];
    return '<span class="badge badge--' + type + '">' + icon + ' ' + text + '</span>';
  }

  // ── DOM element builder ───────────────────────────────────
  function toEl(html) {
    var d = document.createElement('div');
    d.innerHTML = html;
    return d.firstChild;
  }

  // ── Auto-inject CSS if not already loaded ─────────────────
  function ensureCSS() {
    if (document.getElementById('badge-component-css')) return;
    // Try to find the CSS relative to this script
    var scripts = document.querySelectorAll('script[src*="badge.js"]');
    var basePath = '';
    if (scripts.length) {
      basePath = scripts[scripts.length - 1].src.replace(/[^/]*$/, '');
    }
    var link = document.createElement('link');
    link.id = 'badge-component-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'status-badge.css';
    document.head.appendChild(link);
  }
  ensureCSS();

  // ── Public API ────────────────────────────────────────────
  window.Badge = {
    gate: function (n, label) { return toEl(gateHTML(n, label)); },
    risk: function (type, label) { return toEl(riskHTML(type, label)); },
    html: function (kind, value, label) {
      if (kind === 'gate') return gateHTML(value, label);
      return riskHTML(value, label);
    },
    ICONS: ICONS
  };
})();
