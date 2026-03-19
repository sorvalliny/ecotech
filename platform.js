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
    KEY_USERS:    'ECOTECH_USERS',
    KEY_CHANGELOG:'ECOTECH_CHANGELOG',
    KEY_IDEAS:    'ECOTECH_IDEAS',

    // ── Типы инициатив ──────────────────────────────────────────────
    // Подтипы (для будущего расширения):
    //   business:  маркетинг, партнёрства, монетизация
    //   product:   UX, фичи, рост, аналитика
    //   technical: инфраструктура, QA, безопасность, DevOps, SDK
    INITIATIVE_TYPES: {
      business:  { label: 'Бизнес',       color: 'var(--amber)',  bg: 'var(--adim)' },
      product:   { label: 'Продуктовые',  color: 'var(--teal)',   bg: 'var(--tdim)' },
      technical: { label: 'Технические',  color: 'var(--violet)', bg: 'var(--vdim)' }
    },

    // Хелпер: получить тип инициативы (дефолт — product)
    getInitType: function(item) {
      var t = item.type || '';
      if (this.INITIATIVE_TYPES[t]) return t;
      // Fallback по segment/cat
      var seg = item.segment || item.cat || '';
      if (seg === 'business') return 'business';
      if (seg === 'tech') return 'technical';
      return 'product';
    },

    // ── Департаменты ───────────────────────────────────────────────
    DEPARTMENTS: {
      innovation: { label: 'Инновации и экосистема', color: '#7B2FFF' },
      education:  { label: 'Обучение', color: '#4FC3F7' }
    },

    // Хелпер: получить label департамента (или сам ключ, если неизвестный)
    getDeptLabel: function(dept) {
      var d = this.DEPARTMENTS[dept];
      return d ? d.label : dept;
    },

    // Хелпер: HTML-бейдж департамента
    deptBadge: function(dept) {
      var label = this.getDeptLabel(dept);
      return '<span class="dept-badge dept-' + dept + '">' + label + '</span>';
    },

    // Хелпер: бейдж типа инициативы
    initTypeBadge: function(item) {
      var t = this.getInitType(item);
      var meta = this.INITIATIVE_TYPES[t] || this.INITIATIVE_TYPES.product;
      return '<span style="font-size:9px;font-weight:700;padding:2px 8px;border-radius:4px;color:' + meta.color + ';background:' + meta.bg + '">' + meta.label + '</span>';
    },

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
    DATA_VERSION: 5,

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
            // Миграция: добавить department если отсутствует
            products.forEach(function(p) {
              if (!p.department) p.department = 'innovation';
            });
            self.save(self.KEY_PRODUCTS, products);
            localStorage.setItem('ECOTECH_DATA_VERSION', String(self.DATA_VERSION));
          } catch(e) { products = []; }
        } else { products = []; }
        if (cb) cb(products);
      };
      xhr.onerror = function() { if (cb) cb([]); };
      xhr.send();
    },

    // ── Audit log ────────────────────────────────────────────────────
    addLog: function(productId, action, details, entityType, entityId) {
      var logs = this.load(this.KEY_CHANGELOG) || [];
      var user = window.OrbAuth ? window.OrbAuth.getCurrentUser() : null;
      var entry = {
        id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        timestamp: new Date().toISOString(),
        userId: user ? user.id : 'anonymous',
        userName: user ? user.name : 'Аноним',
        productId: productId,
        action: action,
        details: details || '',
        entityType: entityType || '',
        entityId: entityId || ''
      };
      logs.unshift(entry);
      if (logs.length > 500) logs = logs.slice(0, 500);
      this.save(this.KEY_CHANGELOG, logs);
      return entry;
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
