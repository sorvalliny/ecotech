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
    { id: 'U001', name: 'Виктор Сорвал', role: 'admin', email: 'sorval.viktor@rwb.ru', productIds: [] },
    { id: 'U002', name: 'PM WB Kids', role: 'pm', email: '', productIds: ['P01'] },
    { id: 'U003', name: 'PM WB Встречи', role: 'pm', email: '', productIds: ['P02'] },
    { id: 'U004', name: 'PM EdTech', role: 'pm', email: '', productIds: ['P03'] },
    { id: 'U005', name: 'Viewer', role: 'viewer', email: '', productIds: [] }
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

    // Войти
    login: function(userId) {
      var users = this.getUsers();
      var user = users.find(function(u) { return u.id === userId; });
      if (!user) return false;
      localStorage.setItem(AUTH_KEY, JSON.stringify({ id: user.id, ts: Date.now() }));
      return true;
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

    // Залогинен ли
    isLoggedIn: function() {
      return !!this.getCurrentUser();
    }
  };

  window.OrbAuth = Auth;
})();
