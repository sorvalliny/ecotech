/**
 * ОРБИТА — Единая архитектура прав (W4-010)
 * Роли: admin, pmo_lead, pmo, pm, lead, guest
 * Хранение: ECOTECH_AUTH / ECOTECH_USERS в localStorage
 */
(function() {
  'use strict';

  var AUTH_KEY = 'ECOTECH_AUTH';
  var USERS_KEY = 'ECOTECH_USERS';

  // ── Расширенная ролевая модель ─────────────────────────────────────
  var ROLES = {
    admin:     { label: 'Администратор',   color: '#FF2D8A', canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canArchive: true,  canDeactivate: true,  canTransitionGate: true,  canAssignPM: true,  canReview: true,  canManageUsers: true  },
    pmo_lead:  { label: 'Руководитель ПО', color: '#FFB830', canCreate: true,  canEdit: true,  canDelete: true,  canApprove: true,  canArchive: true,  canDeactivate: true,  canTransitionGate: true,  canAssignPM: true,  canReview: true,  canManageUsers: true  },
    pmo:       { label: 'PMO-менеджер',    color: '#FFB830', canCreate: true,  canEdit: true,  canDelete: false, canApprove: true,  canArchive: false, canDeactivate: false, canTransitionGate: true,  canAssignPM: false, canReview: true,  canManageUsers: false },
    pm:        { label: 'Product Manager', color: '#00D4B4', canCreate: true,  canEdit: true,  canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: false, canManageUsers: false },
    lead:      { label: 'Руководитель',    color: '#4FC3F7', canCreate: false, canEdit: false, canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: true,  canManageUsers: false },
    guest:     { label: 'Гость',           color: '#7A7A9D', canCreate: false, canEdit: false, canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: false, canManageUsers: false }
  };

  // ── Seed-данные (W4-011) ───────────────────────────────────────────
  var DEFAULT_USERS = [
    { id: 'U001', name: 'Администратор',  email: 'admin@rwb.ru',           role: 'admin',    assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: [],      contact: '', team: 'Проектный офис' },
    { id: 'U002', name: 'Виктор',         email: 'sorval.viktor@rwb.ru',   role: 'pmo_lead', assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: [],      contact: '', team: 'Проектный офис' },
    { id: 'GUEST', name: 'Гость',         email: 'demo@orbita.demo',       role: 'guest',    assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: ['ECO-00'], contact: '', team: 'Демо' }
  ];

  // ── Миграция старых пользователей ──────────────────────────────────
  function migrateUser(u) {
    // Добавить недостающие поля
    if (typeof u.active === 'undefined') u.active = true;
    if (!u.createdBy) u.createdBy = 'system';
    if (!u.createdAt) u.createdAt = '2026-03-17';
    if (!u.assignments) u.assignments = [];

    // Миграция роли viewer → guest
    if (u.role === 'viewer') u.role = 'guest';

    // Миграция productIds → assignments (если assignments пуст, а productIds есть)
    if (u.assignments.length === 0 && u.productIds && u.productIds.length) {
      u.assignments = u.productIds.map(function(pid) {
        return { productId: pid, scope: 'all' };
      });
    }
    // Сохраняем productIds для обратной совместимости
    if (!u.productIds) u.productIds = [];

    return u;
  }

  function migrateUsers(users) {
    return users.map(migrateUser);
  }

  var Auth = {
    ROLES: ROLES,

    // Получить список пользователей
    getUsers: function() {
      try {
        var stored = JSON.parse(localStorage.getItem(USERS_KEY));
        if (stored && stored.length) {
          return migrateUsers(stored);
        }
        return migrateUsers(DEFAULT_USERS.map(function(u) { return JSON.parse(JSON.stringify(u)); }));
      } catch(e) {
        return migrateUsers(DEFAULT_USERS.map(function(u) { return JSON.parse(JSON.stringify(u)); }));
      }
    },

    // Сохранить пользователей
    saveUsers: function(users) {
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    },

    // Текущий пользователь
    getCurrentUser: function() {
      try {
        var auth = JSON.parse(localStorage.getItem(AUTH_KEY));
        if (auth && auth.id) {
          var users = this.getUsers();
          var user = null;
          for (var i = 0; i < users.length; i++) {
            if (users[i].id === auth.id) { user = users[i]; break; }
          }
          return user || null;
        }
        return null;
      } catch(e) { return null; }
    },

    // Войти по email
    login: function(email) {
      email = (email || '').trim().toLowerCase();
      var users = this.getUsers();
      var user = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === email) { user = users[i]; break; }
      }
      if (!user) return { ok: false, error: 'Пользователь не найден. Обратитесь к администратору для получения доступа.' };
      if (!user.active) return { ok: false, error: 'Учётная запись деактивирована. Обратитесь к администратору.' };
      // Генерируем простой код (MVP — без реальной отправки на почту)
      var code = String(Math.floor(1000 + Math.random() * 9000));
      localStorage.setItem('ECOTECH_OTP', JSON.stringify({ email: email, code: code, ts: Date.now() }));
      return { ok: true, code: code, userName: user.name };
    },

    // Проверка OTP-кода
    verifyOTP: function(inputCode) {
      var otp = null;
      try { otp = JSON.parse(localStorage.getItem('ECOTECH_OTP')); } catch(e) {}
      if (!otp) return { ok: false, error: 'Код не найден. Запросите новый.' };
      if (Date.now() - otp.ts > 300000) return { ok: false, error: 'Код истёк. Запросите новый.' };
      if (otp.code !== inputCode) return { ok: false, error: 'Неверный код.' };
      var users = this.getUsers();
      var user = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].email === otp.email) { user = users[i]; break; }
      }
      if (!user) return { ok: false, error: 'Пользователь не найден.' };
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, ts: Date.now() }));
      localStorage.removeItem('ECOTECH_OTP');
      return { ok: true, user: user };
    },

    // Выйти
    logout: function() {
      localStorage.removeItem(AUTH_KEY);
    },

    // Проверка прав (универсальная)
    can: function(action) {
      var user = this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role) return false;
      return !!role[action];
    },

    // ── Новые вспомогательные функции (W4-010) ──────────────────────

    // Может ли пользователь редактировать продукт
    canEditProduct: function(productId, userOverride) {
      var user = userOverride || this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role || !role.canEdit) return false;
      // admin, pmo_lead, pmo — могут редактировать все продукты
      if (user.role === 'admin' || user.role === 'pmo_lead' || user.role === 'pmo') return true;
      // PM — по привязке assignments
      if (user.assignments && user.assignments.length) {
        for (var i = 0; i < user.assignments.length; i++) {
          if (user.assignments[i].productId === productId) return true;
        }
      }
      // Обратная совместимость — productIds
      if (user.productIds && user.productIds.length) {
        return user.productIds.indexOf(productId) >= 0;
      }
      // PM без привязок — может всё (для пилота)
      if (user.role === 'pm' && (!user.assignments || !user.assignments.length) && (!user.productIds || !user.productIds.length)) {
        return true;
      }
      return false;
    },

    // Может ли пользователь редактировать инициативу
    canEditInitiative: function(productId, initiativeId, userOverride) {
      var user = userOverride || this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role || !role.canEdit) return false;
      // admin, pmo_lead, pmo — могут всё
      if (user.role === 'admin' || user.role === 'pmo_lead' || user.role === 'pmo') return true;
      // PM — по привязке assignments с scope
      if (user.assignments && user.assignments.length) {
        for (var i = 0; i < user.assignments.length; i++) {
          var a = user.assignments[i];
          if (a.productId === productId) {
            if (a.scope === 'all') return true;
            if (Array.isArray(a.scope) && a.scope.indexOf(initiativeId) >= 0) return true;
          }
        }
      }
      // Обратная совместимость — productIds (полный доступ к продукту)
      if (user.productIds && user.productIds.indexOf(productId) >= 0) return true;
      // PM без привязок — может всё (для пилота)
      if (user.role === 'pm' && (!user.assignments || !user.assignments.length) && (!user.productIds || !user.productIds.length)) {
        return true;
      }
      return false;
    },

    // Список продуктов пользователя
    getUserProducts: function(userOverride) {
      var user = userOverride || this.getCurrentUser();
      if (!user) return [];
      // admin, pmo_lead, pmo — все продукты
      if (user.role === 'admin' || user.role === 'pmo_lead' || user.role === 'pmo') return ['*'];
      var ids = [];
      if (user.assignments && user.assignments.length) {
        for (var i = 0; i < user.assignments.length; i++) {
          ids.push(user.assignments[i].productId);
        }
      }
      // Обратная совместимость
      if (user.productIds && user.productIds.length) {
        for (var j = 0; j < user.productIds.length; j++) {
          if (ids.indexOf(user.productIds[j]) < 0) {
            ids.push(user.productIds[j]);
          }
        }
      }
      return ids;
    },

    // Получить роль текущего пользователя
    getUserRole: function() {
      var user = this.getCurrentUser();
      return user ? user.role : null;
    },

    // Проверить конкретное право текущего пользователя
    hasPermission: function(permission) {
      var user = this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role) return false;
      return !!role[permission];
    },

    // Получить роль текущего пользователя (alias — обратная совместимость)
    getRole: function() {
      return this.getUserRole();
    },

    // Получить лейбл роли
    getRoleLabel: function() {
      var user = this.getCurrentUser();
      if (!user) return '';
      var role = ROLES[user.role];
      return role ? role.label : user.role;
    },

    // Демо-продукт — доступен всем (для онбординга)
    DEMO_PRODUCT_ID: 'ECO-00',

    // Может ли видеть продукт (демо — всем, остальные — авторизованным)
    canViewProduct: function(productId) {
      if (productId === this.DEMO_PRODUCT_ID) return true;
      return this.isLoggedIn();
    },

    // Залогинен ли
    isLoggedIn: function() {
      return !!this.getCurrentUser();
    },

    // Гостевой вход — авто
    loginAsGuest: function() {
      var users = this.getUsers();
      var guestUser = null;
      for (var i = 0; i < users.length; i++) {
        if (users[i].id === 'GUEST') { guestUser = users[i]; break; }
      }
      if (!guestUser) {
        guestUser = {
          id: 'GUEST',
          name: 'Гость',
          role: 'guest',
          email: 'demo@orbita.demo',
          assignments: [],
          active: true,
          createdBy: 'system',
          createdAt: '2026-03-17',
          productIds: ['ECO-00'],
          contact: '',
          team: 'Демо'
        };
        users.push(guestUser);
        this.saveUsers(users);
      }
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: 'GUEST', ts: Date.now() }));
    }
  };

  window.OrbAuth = Auth;
})();
