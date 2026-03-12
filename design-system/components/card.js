/**
 * ОРБИТА — ProductCard Component
 * Renders product cards with Gate progress, KPI metrics, status badges.
 *
 * Usage:
 *   ProductCard.html(product)           → HTML string
 *   ProductCard.skeleton()              → loading skeleton HTML
 *   ProductCard.render(el, products)    → renders grid into element
 *
 * Requires: badge.js (Badge.html), status-badge.css, product-card.css
 */
(function () {
  'use strict';

  // ── KPI icon SVGs (Heroicons outline, 14×14) ──────────
  var KPI_ICONS = {
    users: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>',
    'trending-up': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
    'dollar-sign': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>',
    'credit-card': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    package: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 002 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0022 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
    clock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
    'alert-triangle': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    'file-text': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
    'check-circle': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
    calendar: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    'bar-chart-2': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
    award: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
    star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    code: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
    zap: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>'
  };

  var GATE_LABELS = ['Gate 0', 'Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];

  var STATUS_MAP = {
    'on-track': 'On Track',
    'at-risk':  'At Risk',
    'paused':   'Paused',
    'done':     'Done'
  };

  // ── Initials from name ──────────────────────────────────
  function initials(name) {
    if (!name) return '?';
    var parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  }

  // ── Format date ─────────────────────────────────────────
  function fmtDate(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    var months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
    return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
  }

  // ── Gate progress bar HTML ──────────────────────────────
  function gateBarHTML(gate, status) {
    var html = '<div class="pc__gate-label">' + (GATE_LABELS[gate] || 'Gate ' + gate) + ' из 5</div>';
    html += '<div class="pc__gate-bar">';
    for (var i = 0; i <= 5; i++) {
      var cls = 'pc__gate-step';
      if (status === 'done') {
        cls += ' pc__gate-step--done';
      } else if (i <= gate) {
        cls += ' pc__gate-step--active';
      }
      html += '<div class="' + cls + '"></div>';
    }
    html += '</div>';
    return html;
  }

  // ── KPI HTML ────────────────────────────────────────────
  function kpiHTML(kpi) {
    var icon = KPI_ICONS[kpi.icon] || '';
    return '<div class="pc__kpi">' +
      '<div class="pc__kpi-icon">' + icon + '</div>' +
      '<div class="pc__kpi-val">' + esc(kpi.value) + '</div>' +
      '<div class="pc__kpi-label">' + esc(kpi.label) + '</div>' +
    '</div>';
  }

  // ── Escape HTML ─────────────────────────────────────────
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Card HTML ───────────────────────────────────────────
  function cardHTML(p, idx) {
    var gate = Math.max(0, Math.min(5, parseInt(p.gate, 10) || 0));
    var status = p.status || 'on-track';
    var stateClass = '';
    if (status === 'at-risk') stateClass = ' pc--at-risk';
    if (status === 'done') stateClass = ' pc--done';

    // Badges
    var gateBadge = window.Badge ? Badge.html('gate', gate) : '<span>' + GATE_LABELS[gate] + '</span>';
    var riskBadge = window.Badge ? Badge.html('risk', status) : '<span>' + (STATUS_MAP[status] || status) + '</span>';
    var catTag = p.catLabel ? '<span class="badge" style="background:rgba(79,195,247,0.08);color:#4FC3F7;border-color:rgba(79,195,247,0.20);font-size:10px;padding:3px 8px;">' + esc(p.catLabel) + '</span>' : '';

    // KPIs
    var kpisHtml = '';
    if (p.kpi && p.kpi.length) {
      kpisHtml = '<div class="pc__kpis">';
      for (var k = 0; k < Math.min(3, p.kpi.length); k++) {
        kpisHtml += kpiHTML(p.kpi[k]);
      }
      kpisHtml += '</div>';
    }

    // Owner + date
    var footerHtml = '';
    if (p.owner || p.updated) {
      var ini = initials(p.owner);
      footerHtml = '<div class="pc__footer">' +
        '<div class="pc__avatar">' + esc(ini) + '</div>' +
        '<div class="pc__owner">' + esc(p.owner || '') + '</div>' +
        '<div class="pc__date">' + fmtDate(p.updated) + '</div>' +
      '</div>';
    }

    var dataIdx = (idx !== undefined) ? ' data-idx="' + idx + '"' : '';

    return '<div class="pc' + stateClass + '"' + dataIdx + '>' +
      '<div class="pc__bar" style="background:' + (p.color || 'linear-gradient(90deg,#4FC3F7,#B3E5FC)') + '"></div>' +
      '<div class="pc__body">' +
        '<div class="pc__status">' + riskBadge + ' ' + gateBadge + ' ' + catTag + '</div>' +
        '<div class="pc__name">' + esc(p.name) + '</div>' +
        '<div class="pc__desc">' + esc(p.desc) + '</div>' +
        gateBarHTML(gate, status) +
        kpisHtml +
        footerHtml +
      '</div>' +
    '</div>';
  }

  // ── Skeleton HTML ───────────────────────────────────────
  function skeletonHTML() {
    return '<div class="pc pc--loading">' +
      '<div class="pc__bar"></div>' +
      '<div class="pc__body">' +
        '<div class="pc__status"></div>' +
        '<div class="pc__name">&nbsp;</div>' +
        '<div class="pc__desc">&nbsp;<br>&nbsp;</div>' +
        '<div class="pc__gate-label">&nbsp;</div>' +
        '<div class="pc__gate-bar"><div class="pc__gate-step"></div><div class="pc__gate-step"></div><div class="pc__gate-step"></div><div class="pc__gate-step"></div><div class="pc__gate-step"></div><div class="pc__gate-step"></div></div>' +
        '<div class="pc__kpis"><div class="pc__kpi"><div class="pc__kpi-icon"></div><div class="pc__kpi-val">&nbsp;</div><div class="pc__kpi-label">&nbsp;</div></div><div class="pc__kpi"><div class="pc__kpi-icon"></div><div class="pc__kpi-val">&nbsp;</div><div class="pc__kpi-label">&nbsp;</div></div><div class="pc__kpi"><div class="pc__kpi-icon"></div><div class="pc__kpi-val">&nbsp;</div><div class="pc__kpi-label">&nbsp;</div></div></div>' +
        '<div class="pc__footer"><div class="pc__avatar"></div><div class="pc__owner">&nbsp;</div><div class="pc__date">&nbsp;</div></div>' +
      '</div>' +
    '</div>';
  }

  // ── Auto-inject CSS ─────────────────────────────────────
  function ensureCSS() {
    if (document.getElementById('product-card-css')) return;
    var scripts = document.querySelectorAll('script[src*="card.js"]');
    var basePath = '';
    if (scripts.length) {
      basePath = scripts[scripts.length - 1].src.replace(/[^/]*$/, '');
    }
    var link = document.createElement('link');
    link.id = 'product-card-css';
    link.rel = 'stylesheet';
    link.href = basePath + 'product-card.css';
    document.head.appendChild(link);
  }
  ensureCSS();

  // ── Public API ──────────────────────────────────────────
  window.ProductCard = {
    html: cardHTML,
    skeleton: skeletonHTML,
    render: function (el, products, onClick) {
      if (!el) return;
      var html = '';
      for (var i = 0; i < products.length; i++) {
        html += cardHTML(products[i], i);
      }
      el.innerHTML = html;
      // Attach click handlers
      if (onClick) {
        var cards = el.querySelectorAll('.pc[data-idx]');
        for (var j = 0; j < cards.length; j++) {
          (function(card) {
            card.addEventListener('click', function () {
              var idx = parseInt(card.getAttribute('data-idx'), 10);
              onClick(idx, products[idx]);
            });
          })(cards[j]);
        }
      }
    },
    KPI_ICONS: KPI_ICONS
  };
})();
