/**
 * ОРБИТА — shared bridge utility
 * Подключается на всех страницах: window.PT
 */
(function() {
  'use strict';

  var PT = {
    // ── Ключи localStorage ──────────────────────────────────────────
    KEY_BACKLOG:  'ECOTECH_BACKLOG',
    KEY_PRODUCTS: 'ECOTECH_PRODUCTS',
    KEY_UI:       'ECOTECH_UI',
    KEY_GOALS:    'ECOTECH_GOALS',
    KEY_EPICS:    'ECOTECH_EPICS',
    KEY_PRODUCTS_PRD: 'ECOTECH_PRODUCTS_PRD',

    // ── Storage helpers ─────────────────────────────────────────────
    load: function(key) {
      try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
    },
    save: function(key, val) {
      try { localStorage.setItem(key, JSON.stringify(val)); } catch(e) {}
    },

    // ── Миграция старых ключей → новые ─────────────────────────────
    migrate: function() {
      // Backlog: rwb_backlog (60 items, полнее) > rwb_os_backlog
      if (!localStorage.getItem(this.KEY_BACKLOG)) {
        var src = localStorage.getItem('rwb_backlog') || localStorage.getItem('rwb_os_backlog');
        if (src) {
          try { localStorage.setItem(this.KEY_BACKLOG, src); } catch(e) {}
        }
      }
      // Products: rwb_products → ECOTECH_PRODUCTS
      if (!localStorage.getItem(this.KEY_PRODUCTS)) {
        var sp = localStorage.getItem('rwb_products');
        if (sp) {
          try { localStorage.setItem(this.KEY_PRODUCTS, sp); } catch(e) {}
        }
      }
    },

    // ── URL hash утилиты ────────────────────────────────────────────
    // '#section=stages&stage=2' → {section:'stages', stage:'2'}
    parseHash: function() {
      var hash = (window.location.hash || '').replace(/^#/, '');
      if (!hash) return {};
      var result = {};
      hash.split('&').forEach(function(part) {
        var kv = part.split('=');
        if (kv.length === 2) result[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
      });
      return result;
    },

    // buildUrl('../Фреймворк/...html', {orbit:2}) → '...html#orbit=2'
    buildUrl: function(page, ctx) {
      if (!ctx || !Object.keys(ctx).length) return page;
      var qs = Object.keys(ctx).map(function(k) {
        return encodeURIComponent(k) + '=' + encodeURIComponent(ctx[k]);
      }).join('&');
      return page + '#' + qs;
    },

    navigateTo: function(page, ctx) {
      window.location.href = this.buildUrl(page, ctx);
    },

    // ── UI state (фильтры, вкладки, активные секции) ────────────────
    getUIState: function() {
      return this.load(this.KEY_UI) || {};
    },
    setUIState: function(patch) {
      var state = this.getUIState();
      Object.keys(patch).forEach(function(k) { state[k] = patch[k]; });
      this.save(this.KEY_UI, state);
    },

    // ── Data version — increment to force refresh from portfolio.json ──
    DATA_VERSION: 3,

    // ── Ensure products loaded (seed from portfolio.json if empty or outdated) ──
    ensureProducts: function(cb) {
      var self = this;
      var currentVersion = parseInt(localStorage.getItem('ECOTECH_DATA_VERSION') || '0', 10);
      var products = self.load(self.KEY_PRODUCTS);

      // Если данные есть И версия актуальна — используем localStorage
      if (products && products.length && currentVersion >= self.DATA_VERSION) {
        if (cb) cb(products);
        return;
      }
      // Detect base path: script loaded from root or subdirectory
      var scripts = document.querySelectorAll('script[src*="platform.js"]');
      var base = '';
      if (scripts.length) {
        var src = scripts[0].getAttribute('src') || '';
        base = src.replace('platform.js', '');
      }
      var xhr = new XMLHttpRequest();
      xhr.open('GET', base + 'data/portfolio.json', true);
      xhr.onload = function() {
        if (xhr.status === 200) {
          try {
            products = JSON.parse(xhr.responseText);
            self.save(self.KEY_PRODUCTS, products);
            localStorage.setItem('ECOTECH_DATA_VERSION', String(self.DATA_VERSION));
          } catch(e) { products = []; }
        } else { products = []; }
        if (cb) cb(products);
      };
      xhr.onerror = function() { if (cb) cb([]); };
      xhr.send();
    },

    // ── Live stats ──────────────────────────────────────────────────
    getStats: function() {
      var bl = this.load(this.KEY_BACKLOG) || [];
      var pr = this.load(this.KEY_PRODUCTS) || [];
      var wip = bl.filter(function(i) { return i.status === 'wip'; }).length;
      var high = bl.filter(function(i) {
        var s = i.e > 0 ? (i.r * i.i * i.c) / i.e : 0;
        return s > 20;
      }).length;
      return {
        backlog_total: bl.length,
        wip: wip,
        high: high,
        products: pr.length
      };
    }
  };

  // Запуск миграции при подключении скрипта
  PT.migrate();

  window.PT = PT;
})();
