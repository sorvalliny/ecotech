/**
 * ОРБИТА — MVP Авторизация
 * Роли: admin, pmo, pm, viewer
 * Хранение: ECOTECH_AUTH в localStorage
 */
(function() {
  'use strict';

  var AUTH_KEY = 'ECOTECH_AUTH';
  var USERS_KEY = 'ECOTECH_USERS';

  // Дефолтные пользователи (для пилота)
  var DEFAULT_USERS = [
    { id: 'U001', name: 'Администратор', role: 'admin', email: 'admin@rwb.ru', productIds: [], contact: '', team: 'Проектный офис' },
    { id: 'U002', name: 'PM ECO-01', role: 'pm', email: 'pm1@rwb.ru', productIds: ['ECO-01'], contact: '', team: 'Продукт' },
    { id: 'U003', name: 'PM ECO-02', role: 'pm', email: 'pm2@rwb.ru', productIds: ['ECO-02'], contact: '', team: 'Продукт' },
    { id: 'U004', name: 'PM ECO-03', role: 'pm', email: 'pm3@rwb.ru', productIds: ['ECO-03'], contact: '', team: 'Продукт' },
    { id: 'U005', name: 'Наблюдатель', role: 'viewer', email: 'viewer@rwb.ru', productIds: [], contact: '', team: '' }
  ];

  var ROLES = {
    admin:  { label: 'Администратор', color: '#FF2D8A', canCreate: true, canEdit: true, canApprove: true, canDelete: true },
    pmo:    { label: 'PMO', color: '#FFB830', canCreate: true, canEdit: true, canApprove: true, canDelete: false },
    pm:     { label: 'PM', color: '#00D4B4', canCreate: true, canEdit: true, canApprove: false, canDelete: false },
    viewer: { label: 'Наблюдатель', color: '#7A7A9D', canCreate: false, canEdit: false, canApprove: false, canDelete: false }
  };

  var Auth = {
    ROLES: ROLES,

    // Получить список пользователей
    getUsers: function() {
      try {
        var stored = JSON.parse(localStorage.getItem(USERS_KEY));
        return (stored && stored.length) ? stored : DEFAULT_USERS;
      } catch(e) { return DEFAULT_USERS; }
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
          return users.find(function(u) { return u.id === auth.id; }) || null;
        }
        return null;
      } catch(e) { return null; }
    },

    // Войти по email @rwb.ru
    login: function(email) {
      email = (email || '').trim().toLowerCase();
      if (!email.endsWith('@rwb.ru')) return { ok: false, error: 'Только корпоративная почта @rwb.ru' };
      var users = this.getUsers();
      var user = users.find(function(u) { return u.email === email; });
      if (!user) return { ok: false, error: 'Пользователь не найден. Обратитесь к администратору.' };
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
      var user = users.find(function(u) { return u.email === otp.email; });
      if (!user) return { ok: false, error: 'Пользователь не найден.' };
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, ts: Date.now() }));
      localStorage.removeItem('ECOTECH_OTP');
      return { ok: true, user: user };
    },

    // Выйти
    logout: function() {
      localStorage.removeItem(AUTH_KEY);
    },

    // Проверка прав
    can: function(action) {
      var user = this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role) return false;
      return !!role[action];
    },

    // Проверка: может ли редактировать конкретный продукт
    canEditProduct: function(productId) {
      var user = this.getCurrentUser();
      if (!user) return false;
      if (user.role === 'admin' || user.role === 'pmo') return true;
      if (user.role === 'pm') {
        return !user.productIds.length || user.productIds.indexOf(productId) >= 0;
      }
      return false;
    },

    // Получить роль текущего пользователя
    getRole: function() {
      var user = this.getCurrentUser();
      return user ? user.role : null;
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
    }
  };

  window.OrbAuth = Auth;
})();
