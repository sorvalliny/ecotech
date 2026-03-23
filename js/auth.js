/**
 * ОРБИТА — Единая архитектура прав (W4-010)
 * Роли: admin, pmo_lead, pmo, pm, lead, stakeholder, guest
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
    lead:        { label: 'Руководитель',    color: '#4FC3F7', canCreate: false, canEdit: false, canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: true,  canManageUsers: false },
    stakeholder: { label: 'Заказчик',       color: '#F5CD47', canCreate: false, canEdit: false, canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: false, canManageUsers: false },
    guest:       { label: 'Гость',           color: '#7A7A9D', canCreate: false, canEdit: false, canDelete: false, canApprove: false, canArchive: false, canDeactivate: false, canTransitionGate: false, canAssignPM: false, canReview: false, canManageUsers: false }
  };

  // ── Департаменты (портфели) ────────────────────────────────────────
  var DEPARTMENTS = {
    innovation: { label: 'Инновации и экосистема', color: '#7B2FFF' },
    education:  { label: 'Обучение', color: '#4FC3F7' }
  };

  // ── Seed-данные (W4-011) ───────────────────────────────────────────
  var DEFAULT_USERS = [
    { id: 'U001', name: 'Администратор',    email: 'admin@rwb.ru',           role: 'admin',    department: '', assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: [],        contact: '', team: 'ИТ' },
    { id: 'U002', name: 'Виктор Сорваль',   email: 'sorval.viktor@rwb.ru',   role: 'pmo_lead', department: '', assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: [],        contact: '', team: 'Проектный офис' },
    { id: 'U003', name: 'CEO BU ECO',        email: 'ceo.eco@rwb.ru',         role: 'lead',     department: 'innovation', assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-23', productIds: [], contact: '', team: 'Руководство' },
    { id: 'GUEST', name: 'Гость',           email: 'demo@orbita.demo',       role: 'guest',    department: '', assignments: [], active: true, createdBy: 'system', createdAt: '2026-03-17', productIds: ['ECO-00'], contact: '', team: 'Демо' },
    { id: 'U010', name: 'PM Wibes',         email: 'pm.wibes@rwb.ru',        role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-01', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-01'], contact: '', team: 'Wibes' },
    { id: 'U011', name: 'PM WB Цифровой',   email: 'pm.digital@rwb.ru',      role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-02', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-02'], contact: '', team: 'WB Цифровой' },
    { id: 'U012', name: 'PM WB Stream',     email: 'pm.stream@rwb.ru',       role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-03', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-03'], contact: '', team: 'WB Stream' },
    { id: 'U013', name: 'PM WB Книги',      email: 'pm.books@rwb.ru',        role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-04', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-04'], contact: '', team: 'WB Книги' },
    { id: 'U014', name: 'PM WB Messenger',  email: 'pm.messenger@rwb.ru',    role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-07', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-07'], contact: '', team: 'WB Messenger' },
    { id: 'U015', name: 'PM WB Boards',     email: 'pm.boards@rwb.ru',       role: 'pm',       department: 'innovation', assignments: [{ productId: 'ECO-08', scope: 'all', role: 'owner' }], active: true, createdBy: 'system', createdAt: '2026-03-18', productIds: ['ECO-08'], contact: '', team: 'WB Boards' },
    { id: 'U030', name: 'Заказчик Wibes',   email: 'stakeholder@rwb.ru',     role: 'stakeholder', department: 'innovation', team: 'Бизнес', active: true, assignments: [{ productId: 'ECO-01', scope: ['I-001', 'I-002'] }], productIds: ['ECO-01'], createdBy: 'system', createdAt: '2026-03-23' }
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
        return { productId: pid, scope: 'all', role: 'member' };
      });
    }
    // Миграция assignments: добавить role если нет
    for (var ai = 0; ai < u.assignments.length; ai++) {
      if (!u.assignments[ai].role) {
        u.assignments[ai].role = (u.assignments[ai].scope === 'all') ? 'owner' : 'member';
      }
    }
    // Сохраняем productIds для обратной совместимости
    if (!u.productIds) u.productIds = [];

    // Миграция department
    if (typeof u.department === 'undefined') u.department = '';

    return u;
  }

  function migrateUsers(users) {
    return users.map(migrateUser);
  }

  var Auth = {
    ROLES: ROLES,
    DEPARTMENTS: DEPARTMENTS,

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
    canEditProduct: function(productId, userOverride, product) {
      var user = userOverride || this.getCurrentUser();
      if (!user) return false;
      var role = ROLES[user.role];
      if (!role || !role.canEdit) return false;
      // Проверка департамента: если у пользователя задан department, он может редактировать только свой
      var dept = user.department || '';
      if (dept && product && product.department && product.department !== dept) return false;
      // admin, pmo_lead, pmo — могут редактировать все продукты (в рамках своего департамента)
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
    canEditInitiative: function(productId, initiativeId, userOverride, initiative) {
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
      // Team-aware: if user is member of the team that owns this initiative
      if (initiative && initiative.teamId) {
        try {
          var teams = JSON.parse(localStorage.getItem('ECOTECH_TEAMS') || '[]');
          for (var ti = 0; ti < teams.length; ti++) {
            if (teams[ti].id === initiative.teamId && teams[ti].status === 'active') {
              if (teams[ti].members && teams[ti].members.indexOf(user.id) >= 0) return true;
            }
          }
        } catch(e) {}
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
      // admin, pmo_lead, pmo — все продукты (но с учётом департамента)
      if (user.role === 'admin' || user.role === 'pmo_lead' || user.role === 'pmo') {
        // Если у пользователя задан департамент, возвращаем '*' + department для фильтрации на уровне вызова
        return ['*'];
      }
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

    // Департамент текущего пользователя ('' = все)
    getUserDepartment: function() {
      var user = this.getCurrentUser();
      return user ? (user.department || '') : '';
    },

    // Демо-продукт — доступен всем (для онбординга)
    DEMO_PRODUCT_ID: 'ECO-00',

    // Может ли видеть продукт (демо — всем, department-фильтр для привязанных)
    canViewProduct: function(productId, product) {
      if (productId === this.DEMO_PRODUCT_ID) return true;
      if (!this.isLoggedIn()) return false;
      var dept = this.getUserDepartment();
      // Пустой department — видит все
      if (!dept) return true;
      // Если передан объект продукта — проверяем department
      if (product && product.department) {
        return product.department === dept;
      }
      return true;
    },

    // Фильтрация массива продуктов по департаменту пользователя
    getVisibleProducts: function(products) {
      if (!products || !products.length) return [];
      var dept = this.getUserDepartment();
      // Пустой department — видит все
      if (!dept) return products;
      var result = [];
      for (var i = 0; i < products.length; i++) {
        var p = products[i];
        // Демо-продукт — всегда видим
        if (p.id === this.DEMO_PRODUCT_ID) { result.push(p); continue; }
        if (!p.department || p.department === dept) {
          result.push(p);
        }
      }
      return result;
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

  // ── W4-012: Маскировка названий для гостей ──────────────────────
  // type = 'product' | 'initiative' | 'goal' | 'epic'
  Auth.getDisplayName = function(item, type) {
    if (!item) return 'N/A';
    var user = Auth.getCurrentUser();
    var isGuest = !user || user.role === 'guest';
    if (isGuest) {
      // Исключение: ДЕМО-продукт показываем всегда
      if (item.id === Auth.DEMO_PRODUCT_ID) return item.name || item.title || item.id;
      return item.id || item.code || 'N/A';
    }
    return item.name || item.title || item.id;
  };

  // ── W4-025: Несколько PM на один продукт ────────────────────────
  // Возвращает массив {name, email, scope} всех активных PM, привязанных к productId
  Auth.getProductPMs = function(productId) {
    var users = Auth.getUsers();
    var pms = [];
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      if (u.role !== 'pm' || !u.active) continue;
      if (!u.assignments) continue;
      for (var j = 0; j < u.assignments.length; j++) {
        if (u.assignments[j].productId === productId) {
          pms.push({ name: u.name, email: u.email, scope: u.assignments[j].scope });
          break;
        }
      }
    }
    return pms;
  };

  // Форматирует scope для отображения: "все" или "I-004, I-005"
  Auth.formatScope = function(scope) {
    if (!scope || scope === 'all') return 'все';
    if (Array.isArray(scope)) return scope.join(', ');
    return String(scope);
  };

  // Определяет PM для конкретной инициативы из массива PMs продукта
  Auth.getInitiativePM = function(productId, initiativeId) {
    var pms = Auth.getProductPMs(productId);
    var result = [];
    for (var i = 0; i < pms.length; i++) {
      var s = pms[i].scope;
      if (s === 'all') {
        result.push(pms[i]);
      } else if (Array.isArray(s) && s.indexOf(initiativeId) >= 0) {
        result.push(pms[i]);
      }
    }
    return result;
  };

  // ── W4-030: Owner concept for product lifecycle ────────────────
  // Assignment role: 'owner' = full access, 'member' = scoped access
  // { productId: 'ECO-01', scope: 'all', role: 'owner' }

  // Check if current user is the owner of a product
  Auth.isProductOwner = function(productId) {
    var user = Auth.getCurrentUser();
    if (!user) return false;
    // admin and pmo_lead are implicit owners of all products
    if (user.role === 'admin' || user.role === 'pmo_lead') return true;
    if (!user.assignments) return false;
    for (var i = 0; i < user.assignments.length; i++) {
      var a = user.assignments[i];
      if (a.productId === productId && a.role === 'owner') return true;
    }
    return false;
  };

  // Get the owner user object for a product
  Auth.getProductOwner = function(productId) {
    var users = Auth.getUsers();
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      if (!u.active || !u.assignments) continue;
      for (var j = 0; j < u.assignments.length; j++) {
        if (u.assignments[j].productId === productId && u.assignments[j].role === 'owner') {
          return u;
        }
      }
    }
    return null;
  };

  // Owner assigns a member to a product with a scope
  Auth.assignProductMember = function(productId, userId, scope) {
    var users = Auth.getUsers();
    var found = false;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === userId) {
        if (!users[i].assignments) users[i].assignments = [];
        // Check if already assigned
        var exists = false;
        for (var j = 0; j < users[i].assignments.length; j++) {
          if (users[i].assignments[j].productId === productId) {
            users[i].assignments[j].scope = scope || 'all';
            users[i].assignments[j].role = 'member';
            exists = true;
            break;
          }
        }
        if (!exists) {
          users[i].assignments.push({ productId: productId, scope: scope || 'all', role: 'member' });
        }
        if (!users[i].productIds) users[i].productIds = [];
        if (users[i].productIds.indexOf(productId) < 0) {
          users[i].productIds.push(productId);
        }
        found = true;
        break;
      }
    }
    if (found) Auth.saveUsers(users);
    return found;
  };

  // Get all members (non-owner PMs) assigned to a product
  Auth.getProductMembers = function(productId) {
    var users = Auth.getUsers();
    var members = [];
    for (var i = 0; i < users.length; i++) {
      var u = users[i];
      if (!u.active || !u.assignments) continue;
      for (var j = 0; j < u.assignments.length; j++) {
        if (u.assignments[j].productId === productId && u.assignments[j].role === 'member') {
          members.push({ id: u.id, name: u.name, email: u.email, scope: u.assignments[j].scope, role: 'member' });
          break;
        }
      }
    }
    return members;
  };

  // ── Stakeholder: получить инициативы, где пользователь — заказчик ──
  // Возвращает массив { productId, initiativeId } по assignments пользователя с ролью stakeholder
  Auth.getStakeholderInitiatives = function(userId) {
    var users = Auth.getUsers();
    var user = null;
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === userId) { user = users[i]; break; }
    }
    if (!user || user.role !== 'stakeholder') return [];
    var results = [];
    if (user.assignments && user.assignments.length) {
      for (var j = 0; j < user.assignments.length; j++) {
        var a = user.assignments[j];
        if (a.scope === 'all') {
          results.push({ productId: a.productId, scope: 'all' });
        } else if (Array.isArray(a.scope)) {
          for (var k = 0; k < a.scope.length; k++) {
            results.push({ productId: a.productId, initiativeId: a.scope[k] });
          }
        }
      }
    }
    return results;
  };

  // Stakeholder can view products/initiatives they are linked to via assignments
  Auth.canStakeholderView = function(productId, initiativeId) {
    var user = Auth.getCurrentUser();
    if (!user || user.role !== 'stakeholder') return false;
    if (!user.assignments) return false;
    for (var i = 0; i < user.assignments.length; i++) {
      var a = user.assignments[i];
      if (a.productId === productId) {
        if (!initiativeId) return true; // product-level view
        if (a.scope === 'all') return true;
        if (Array.isArray(a.scope) && a.scope.indexOf(initiativeId) >= 0) return true;
      }
    }
    return false;
  };

  // ── Teams Registry helpers ────────────────────────────────────
  // Get teams for a product
  Auth.getProductTeams = function(productId) {
    var teams = JSON.parse(localStorage.getItem('ECOTECH_TEAMS') || '[]');
    return teams.filter(function(t) { return t.productId === productId && t.status === 'active'; });
  };

  // Get teams where user is a member
  Auth.getUserTeams = function(userId) {
    var user = userId || (Auth.getCurrentUser() ? Auth.getCurrentUser().id : null);
    if (!user) return [];
    var teams = JSON.parse(localStorage.getItem('ECOTECH_TEAMS') || '[]');
    return teams.filter(function(t) { return t.members && t.members.indexOf(user) >= 0 && t.status === 'active'; });
  };

  window.OrbAuth = Auth;
})();
