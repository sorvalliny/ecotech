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
    KEY_TEAMS:    'ECOTECH_TEAMS',
    KEY_NOTIFICATIONS: 'ECOTECH_NOTIFICATIONS',

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

    // buildUrl('framework.html', {orbit:2}) → 'framework.html#orbit=2'
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
    DATA_VERSION: 7,

    // ── Ensure products loaded (seed from portfolio.json if empty or outdated) ──
    ensureProducts: function(cb) {
      var self = this;
      var currentVersion = parseInt(localStorage.getItem('ECOTECH_DATA_VERSION') || '0', 10);
      var products = self.load(self.KEY_PRODUCTS);

      // Если данные есть И версия актуальна — используем localStorage
      if (products && products.length && currentVersion >= self.DATA_VERSION) {
        products.forEach(function(p) { self.migrateProductFields(p); });
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
            // Миграция: добавить department и новые поля если отсутствуют
            products.forEach(function(p) {
              if (!p.department) p.department = 'innovation';
              self.migrateProductFields(p);
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

  // ── Data migration: add missing fields to products and initiatives ──
  PT.migrateProductFields = function(product) {
    if (!product.statusLight) product.statusLight = 'green'; // green | amber | red
    if (!product.statusText) product.statusText = '';
    if (!product.statusDate) product.statusDate = '';
    if (!product.gateDeadline) product.gateDeadline = ''; // ISO date for next gate review
    if (!product.createdAt) product.createdAt = '2026-01-01';
    if (!product.updatedAt) product.updatedAt = product.createdAt;
    if (typeof product.artifactsReady === 'undefined') product.artifactsReady = 0;
    if (typeof product.artifactsTotal === 'undefined') product.artifactsTotal = 5;
    if (!product.type) product.type = 'product'; // product | tech_solution | edu_product | project
    if (!product.northStar) product.northStar = '';
    if (!product.businessModel) product.businessModel = '';
    return product;
  };

  PT.migrateInitiativeFields = function(item) {
    if (!item.createdAt) item.createdAt = '2026-01-01';
    if (!item.updatedAt) item.updatedAt = item.createdAt;
    if (!item.quarter) item.quarter = 'Q2 2026';
    if (!item.trackerUrl) item.trackerUrl = '';
    if (!item.teamId) item.teamId = '';
    if (!item.goalId) item.goalId = '';
    if (!item.influence) item.influence = '';
    return item;
  };

  // Helper: days since a date string
  PT.daysSince = function(dateStr) {
    if (!dateStr) return 999;
    var then = new Date(dateStr);
    var now = new Date();
    return Math.floor((now - then) / 86400000);
  };

  // Helper: current quarter string (e.g. 'Q2 2026')
  PT.currentQuarter = function() {
    var now = new Date();
    var q = Math.ceil((now.getMonth() + 1) / 3);
    return 'Q' + q + ' ' + now.getFullYear();
  };

  // Helper: generate alerts for dashboard
  PT.getAlerts = function() {
    var products = PT.load(PT.KEY_PRODUCTS) || [];
    var backlog = PT.load(PT.KEY_BACKLOG) || [];
    var alerts = [];

    products.forEach(function(p) {
      PT.migrateProductFields(p);
      // Screening > 7 days without owner
      if (p.status === 'screening' && PT.daysSince(p.createdAt) > 7) {
        alerts.push({ level: 'red', productId: p.id, text: p.id + ' — на скрининге ' + PT.daysSince(p.createdAt) + ' дней, нет владельца', action: 'Назначить PM или отклонить' });
      }
      // Status not updated > 14 days
      if (p.statusDate && PT.daysSince(p.statusDate) > 14 && p.status !== 'screening') {
        alerts.push({ level: 'amber', productId: p.id, text: p.id + ' — статус не обновлялся ' + PT.daysSince(p.statusDate) + ' дней', action: 'PM: обновить светофор' });
      }
      // Gate deadline passed
      if (p.gateDeadline && new Date(p.gateDeadline) < new Date() && p.artifactsReady < p.artifactsTotal) {
        alerts.push({ level: 'red', productId: p.id, text: p.id + ' — Gate просрочен, ' + p.artifactsReady + '/' + p.artifactsTotal + ' артефактов', action: 'PM: загрузить артефакты' });
      }
      // At risk or blocked
      if (p.status === 'at-risk') {
        alerts.push({ level: 'amber', productId: p.id, text: p.id + ' — в зоне риска', action: 'Проверить блокеры' });
      }
      if (p.status === 'blocked') {
        alerts.push({ level: 'red', productId: p.id, text: p.id + ' — заблокирован', action: 'Эскалация PMO Lead' });
      }
    });

    // Initiative overdue (wip > 30 days without update)
    backlog.forEach(function(i) {
      PT.migrateInitiativeFields(i);
      if (i.status === 'wip' && PT.daysSince(i.updatedAt) > 30) {
        alerts.push({ level: 'amber', productId: i.productId, text: (i.productId || '') + ' → ' + (i.name || i.id) + ' — в работе ' + PT.daysSince(i.updatedAt) + ' дней без обновления', action: 'Обновить статус или закрыть' });
      }
    });

    // Sort: red first, then amber
    alerts.sort(function(a, b) { return (a.level === 'red' ? 0 : 1) - (b.level === 'red' ? 0 : 1); });
    return alerts;
  };

  // Helper: PM tasks for the week
  PT.getPMTasks = function(productId) {
    var product = (PT.load(PT.KEY_PRODUCTS) || []).find(function(p) { return p.id === productId; });
    if (!product) return [];
    PT.migrateProductFields(product);

    var backlog = PT.load(PT.KEY_BACKLOG) || [];
    var tasks = [];

    // Status not updated > 7 days
    if (!product.statusDate || PT.daysSince(product.statusDate) > 7) {
      tasks.push({ type: 'status', text: 'Обновить статус продукта (светофор)', link: 'workspace.html?id=' + productId });
    }

    // Missing artifacts for current gate
    if (product.artifactsReady < product.artifactsTotal) {
      var missing = product.artifactsTotal - product.artifactsReady;
      tasks.push({ type: 'artifact', text: 'Загрузить ' + missing + ' артефакт(ов) для Gate ' + product.gate, link: 'workspace.html?id=' + productId + '&tab=docs' });
    }

    // Initiatives with deadline this quarter not done
    var cq = PT.currentQuarter().replace(' ', '-');
    var myInits = backlog.filter(function(i) { return (i.productId || i.project) === productId; });
    var overdueInits = myInits.filter(function(i) {
      var q = (i.quarter || i.release || '').replace(' ', '-');
      return q === cq && i.status !== 'done';
    });
    overdueInits.sort(function(a, b) { return ((b.r||0)*(b.i||0)*(b.c||0)/(b.e||1)) - ((a.r||0)*(a.i||0)*(a.c||0)/(a.e||1)); });
    overdueInits.slice(0, 3).forEach(function(i) {
      var rice = Math.round(((i.r||0)*(i.i||0)*(i.c||0))/(i.e||1));
      tasks.push({ type: 'initiative', text: 'Завершить ' + (i.name || i.id) + ' (RICE ' + rice + ')', link: 'workspace.html?id=' + productId + '&tab=initiatives' });
    });

    return tasks;
  };

  // ── Notifications ────────────────────────────────────────

  // Create a notification
  PT.notify = function(opts) {
    var notifications = PT.load(PT.KEY_NOTIFICATIONS) || [];
    // Dedup: don't create if same type + productId + recipientRole exists and is unresolved
    var exists = notifications.some(function(n) {
      return n.type === opts.type && n.productId === (opts.productId || '') &&
             n.recipientRole === (opts.recipientRole || '') && !n.resolvedAt;
    });
    if (exists) return;

    var n = {
      id: 'N-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      type: opts.type || 'info',
      level: opts.level || 'medium',
      recipientRole: opts.recipientRole || '',
      recipientId: opts.recipientId || '',
      productId: opts.productId || '',
      title: opts.title || '',
      text: opts.text || '',
      action: opts.action || null,
      createdAt: new Date().toISOString(),
      readBy: [],
      resolvedAt: null
    };
    notifications.push(n);
    PT.save(PT.KEY_NOTIFICATIONS, notifications);
    return n;
  };

  // Mark as read by current user
  PT.markRead = function(notifId) {
    var notifications = PT.load(PT.KEY_NOTIFICATIONS) || [];
    var user = window.OrbAuth ? OrbAuth.getCurrentUser() : null;
    if (!user) return;
    notifications.forEach(function(n) {
      if (n.id === notifId && n.readBy.indexOf(user.id) === -1) {
        n.readBy.push(user.id);
      }
    });
    PT.save(PT.KEY_NOTIFICATIONS, notifications);
  };

  // Resolve (close) a notification
  PT.resolveNotification = function(notifId) {
    var notifications = PT.load(PT.KEY_NOTIFICATIONS) || [];
    notifications.forEach(function(n) {
      if (n.id === notifId) n.resolvedAt = new Date().toISOString();
    });
    PT.save(PT.KEY_NOTIFICATIONS, notifications);
  };

  // Get notifications for current user (filtered by role + userId)
  PT.getMyNotifications = function() {
    var notifications = PT.load(PT.KEY_NOTIFICATIONS) || [];
    var user = window.OrbAuth ? OrbAuth.getCurrentUser() : null;
    if (!user) return [];
    var role = user.role;

    return notifications.filter(function(n) {
      if (n.resolvedAt) return false; // skip resolved
      // Personal notification
      if (n.recipientId && n.recipientId === user.id) return true;
      // Role-based
      if (n.recipientRole === role) return true;
      // PMO Lead sees all pmo notifications too
      if (role === 'pmo_lead' && (n.recipientRole === 'pmo' || n.recipientRole === 'pmo_lead')) return true;
      // Admin sees all
      if (role === 'admin') return true;
      // PM sees notifications for their products
      if (role === 'pm' && n.recipientRole === 'pm_owner') {
        var userProducts = OrbAuth.getUserProducts();
        if (userProducts.indexOf('*') >= 0) return true;
        if (n.productId && userProducts.indexOf(n.productId) >= 0) return true;
      }
      return false;
    }).sort(function(a, b) {
      // Unread first, then by date desc
      var aRead = a.readBy.indexOf(user.id) >= 0 ? 1 : 0;
      var bRead = b.readBy.indexOf(user.id) >= 0 ? 1 : 0;
      if (aRead !== bRead) return aRead - bRead;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  };

  // Count unread for current user
  PT.getUnreadCount = function() {
    var user = window.OrbAuth ? OrbAuth.getCurrentUser() : null;
    if (!user) return 0;
    return PT.getMyNotifications().filter(function(n) {
      return n.readBy.indexOf(user.id) === -1;
    }).length;
  };

  // Generate auto-alerts (call on page load)
  PT.generateAutoAlerts = function() {
    var products = PT.load(PT.KEY_PRODUCTS) || [];
    var backlog = PT.load(PT.KEY_BACKLOG) || [];
    var now = new Date();

    products.forEach(function(p) {
      PT.migrateProductFields(p);

      // Screening > 7 days
      if (p.status === 'screening' && PT.daysSince(p.createdAt) > 7) {
        PT.notify({
          type: 'screening_stale', level: 'high', recipientRole: 'pmo_lead',
          productId: p.id,
          title: p.id + ' — на скрининге ' + PT.daysSince(p.createdAt) + ' дней',
          text: 'Заявка ждёт решения. Назначьте владельца или отклоните.',
          action: { label: 'Скрининг', url: 'admin.html' }
        });
      }

      // Status stale > 7 days
      if (p.statusDate && PT.daysSince(p.statusDate) > 7 && p.status !== 'screening') {
        PT.notify({
          type: 'status_stale', level: 'medium', recipientRole: 'pm_owner',
          productId: p.id,
          title: p.id + ' — обновите статус',
          text: 'Светофор не обновлялся ' + PT.daysSince(p.statusDate) + ' дней.',
          action: { label: 'Обновить', url: 'workspace.html?id=' + p.id }
        });
      }

      // Gate deadline approaching (7 days)
      if (p.gateDeadline) {
        var daysLeft = Math.ceil((new Date(p.gateDeadline) - now) / 86400000);
        if (daysLeft > 0 && daysLeft <= 7) {
          PT.notify({
            type: 'gate_upcoming', level: 'high', recipientRole: 'pm_owner',
            productId: p.id,
            title: p.id + ' — Gate Review через ' + daysLeft + ' дней',
            text: 'Артефакты: ' + (p.artifactsReady || 0) + '/' + (p.artifactsTotal || 5) + '. Проверьте готовность.',
            action: { label: 'Gate-чеклист', url: 'tools/gate-checklist.html' }
          });
        }
      }

      // Blocked product
      if (p.status === 'blocked') {
        PT.notify({
          type: 'product_blocked', level: 'high', recipientRole: 'pmo_lead',
          productId: p.id,
          title: p.id + ' — заблокирован',
          text: 'Требуется эскалация.',
          action: { label: 'Открыть', url: 'workspace.html?id=' + p.id }
        });
      }
    });

    // Initiative WIP > 30 days
    backlog.forEach(function(i) {
      PT.migrateInitiativeFields(i);
      if (i.status === 'wip' && PT.daysSince(i.updatedAt) > 30) {
        PT.notify({
          type: 'initiative_stale', level: 'medium', recipientRole: 'pm_owner',
          productId: i.productId || '',
          title: (i.name || i.id) + ' — в работе ' + PT.daysSince(i.updatedAt) + ' дней',
          text: 'Обновите статус или закройте инициативу.',
          action: { label: 'Открыть', url: 'workspace.html?id=' + (i.productId || '') + '&tab=initiatives' }
        });
      }
    });

    // Cleanup: remove resolved older than 30 days
    var notifications = PT.load(PT.KEY_NOTIFICATIONS) || [];
    var cutoff = new Date(Date.now() - 30 * 86400000).toISOString();
    notifications = notifications.filter(function(n) {
      return !n.resolvedAt || n.resolvedAt > cutoff;
    });
    PT.save(PT.KEY_NOTIFICATIONS, notifications);
  };

  // Запуск миграции при подключении скрипта
  PT.migrate();

  window.PT = PT;
})();
