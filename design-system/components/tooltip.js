/**
 * ОРБИТА — Term Tooltip Component
 *
 * Markup:
 *   <abbr class="term" data-tip="Definition" tabindex="0">TERM</abbr>
 *   Optional: data-href="/path" adds a "Подробнее →" link
 *
 * Accessibility: role="tooltip", aria-describedby on trigger.
 * Positioning: auto-flips top/bottom based on viewport space.
 */
(function () {
  'use strict';

  var tooltip = null;
  var activeEl = null;
  var hideTimer = null;
  var tooltipId = 'term-tooltip-' + Math.random().toString(36).slice(2, 8);

  // ── Create tooltip element once ───────────────────────────
  function ensureTooltip() {
    if (tooltip) return;
    tooltip = document.createElement('div');
    tooltip.className = 'term-tooltip';
    tooltip.id = tooltipId;
    tooltip.setAttribute('role', 'tooltip');
    tooltip.addEventListener('mouseenter', cancelHide);
    tooltip.addEventListener('mouseleave', scheduleHide);
    document.body.appendChild(tooltip);
  }

  // ── Position tooltip relative to trigger ──────────────────
  function position(el) {
    if (!tooltip) return;
    var r = el.getBoundingClientRect();
    var gap = 8;
    var vw = window.innerWidth;
    var vh = window.innerHeight;

    // Measure tooltip
    tooltip.style.left = '0';
    tooltip.style.top = '0';
    tooltip.classList.add('visible');
    var tw = tooltip.offsetWidth;
    var th = tooltip.offsetHeight;

    // Prefer bottom, flip to top if no space
    var pos = 'bottom';
    var top = r.bottom + gap;
    if (top + th > vh && r.top - gap - th > 0) {
      pos = 'top';
      top = r.top - gap - th;
    }

    // Horizontal: align to left edge of term, clamp to viewport
    var left = r.left;
    if (left + tw > vw - 12) left = vw - tw - 12;
    if (left < 12) left = 12;

    tooltip.setAttribute('data-pos', pos);
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }

  // ── Show tooltip ──────────────────────────────────────────
  function show(el) {
    ensureTooltip();
    cancelHide();

    var tip = el.getAttribute('data-tip');
    if (!tip) return;

    // Build title from element text
    var title = el.textContent.trim();
    var href = el.getAttribute('data-href');

    var html =
      '<div class="term-tooltip-title">' + esc(title) + '</div>' +
      '<div class="term-tooltip-body">' + tip + '</div>';

    if (href) {
      html += '<a class="term-tooltip-link" href="' + esc(href) + '">Подробнее →</a>';
    }

    tooltip.innerHTML = html;

    // Aria
    el.setAttribute('aria-describedby', tooltipId);

    activeEl = el;
    position(el);
  }

  // ── Hide tooltip ──────────────────────────────────────────
  function hide() {
    if (!tooltip) return;
    tooltip.classList.remove('visible');
    if (activeEl) {
      activeEl.removeAttribute('aria-describedby');
      activeEl = null;
    }
  }

  function scheduleHide() {
    hideTimer = setTimeout(hide, 120);
  }

  function cancelHide() {
    clearTimeout(hideTimer);
  }

  // ── Escape HTML ───────────────────────────────────────────
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // ── Event delegation ──────────────────────────────────────
  function init() {
    document.addEventListener('mouseenter', function (e) {
      var el = e.target.closest('.term');
      if (el) show(el);
    }, true);

    document.addEventListener('mouseleave', function (e) {
      var el = e.target.closest('.term');
      if (el) scheduleHide();
    }, true);

    document.addEventListener('focusin', function (e) {
      var el = e.target.closest('.term');
      if (el) show(el);
    });

    document.addEventListener('focusout', function (e) {
      var el = e.target.closest('.term');
      if (el) scheduleHide();
    });

    // Dismiss on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hide();
    });

    // Reposition on scroll/resize
    var reposition = function () {
      if (activeEl && tooltip && tooltip.classList.contains('visible')) {
        position(activeEl);
      }
    };
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);
  }

  if (document.body) {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();
