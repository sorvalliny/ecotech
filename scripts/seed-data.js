/**
 * ОРБИТА — Скрипт начальной настройки
 *
 * Запускается ОДИН РАЗ после миграции на корп. GitLab.
 * Создаёт: продукты, пользователей, роли, права доступа.
 * После выполнения — отправляет инвайты участникам.
 *
 * Использование:
 * 1. Заполнить PRODUCTS, USERS, GOALS ниже реальными данными
 * 2. Открыть ОРБИТА в браузере (корп. URL)
 * 3. Открыть DevTools → Console
 * 4. Вставить этот скрипт и нажать Enter
 * 5. Скрипт создаст всё и покажет инвайт-ссылки
 */

(function() {
  'use strict';

  // ═══════════════════════════════════════════════════
  // ДАННЫЕ ПРОДУКТОВ (заполнить из Figma-обзора портфеля)
  // ═══════════════════════════════════════════════════

  var PRODUCTS = [
    // === ДЕПАРТАМЕНТ: ЭКОСИСТЕМА ===
    // {
    //   id: 'ECO-01',
    //   name: '[Название продукта из Figma]',
    //   desc: '[Описание]',
    //   type: 'product',           // product | tech_solution | edu_product | project
    //   department: 'innovation',  // innovation | education
    //   gate: 0,                   // текущая стадия 0-5
    //   status: 'screening',       // screening | on-track | at-risk | blocked
    //   catLabel: 'B2C',           // B2C | B2B | B2G | Internal | EdTech
    //   owner: 'PM Team',
    //   quarter: 'Q2 2026',
    //   kpi: []
    // },

    // Пример (удалить после заполнения):
    { id: 'ECO-01', name: 'Продукт 1', desc: '[описание из Figma]', type: 'product', department: 'innovation', gate: 0, status: 'screening', catLabel: 'B2C', owner: '', quarter: 'Q2 2026', kpi: [] },
    { id: 'ECO-02', name: 'Продукт 2', desc: '[описание из Figma]', type: 'product', department: 'innovation', gate: 0, status: 'screening', catLabel: 'B2B', owner: '', quarter: 'Q2 2026', kpi: [] },
    // Добавить все продукты из Figma...

    // === ДЕПАРТАМЕНТ: ОБУЧЕНИЕ ===
    // { id: 'EDU-01', name: '...', type: 'edu_product', department: 'education', ... },
  ];

  // ═══════════════════════════════════════════════════
  // ПОЛЬЗОВАТЕЛИ И РОЛИ
  // ═══════════════════════════════════════════════════

  var USERS = [
    // PMO Lead
    { id: 'U001', name: 'Администратор', email: 'admin@rwb.ru', role: 'admin', department: '', team: 'ИТ', active: true },
    { id: 'U002', name: 'Виктор Сорваль', email: 'sorval.viktor@rwb.ru', role: 'pmo_lead', department: '', team: 'Проектный офис', active: true },

    // PMO-менеджеры
    // { id: 'U010', name: '[ФИО]', email: '[email]@rwb.ru', role: 'pmo', department: 'innovation', team: 'PMO Экосистема', active: true },
    // { id: 'U011', name: '[ФИО]', email: '[email]@rwb.ru', role: 'pmo', department: 'education', team: 'PMO Обучение', active: true },

    // PM продуктов (по одному на продукт)
    // { id: 'U020', name: '[ФИО]', email: '[email]@rwb.ru', role: 'pm', department: 'innovation', team: 'Продукт', active: true,
    //   assignments: [{ productId: 'ECO-01', scope: 'all', role: 'owner' }] },

    // Руководители (ревью)
    // { id: 'U030', name: '[ФИО]', email: '[email]@rwb.ru', role: 'lead', department: '', team: 'Руководство', active: true },

    // Заказчики
    // { id: 'U040', name: '[ФИО]', email: '[email]@rwb.ru', role: 'stakeholder', department: 'innovation', team: 'Бизнес', active: true,
    //   assignments: [{ productId: 'ECO-01', scope: ['I-001', 'I-002'] }] },

    // CTO
    // { id: 'U050', name: '[ФИО]', email: '[email]@rwb.ru', role: 'lead', department: '', team: 'CTO Office', active: true },
  ];

  // ═══════════════════════════════════════════════════
  // ЦЕЛИ НА H2 2026 (по продуктам)
  // ═══════════════════════════════════════════════════

  var GOALS = [
    // { id: 'G-001', title: '[Цель из планирования]', type: 'product', period: 'H2 2026',
    //   productId: 'ECO-01', owner: 'PM ECO-01', status: 'active',
    //   keyResults: [
    //     { id: 'KR-001', text: '[Key Result]', current: 0, target: 100 }
    //   ] },
  ];

  // ═══════════════════════════════════════════════════
  // НАСТРОЙКИ ПЛАТФОРМЫ
  // ═══════════════════════════════════════════════════

  var PLATFORM_URL = window.location.origin + window.location.pathname.replace(/[^/]*$/, '');
  var DATA_VERSION = 6; // Поднять при изменении структуры

  // ═══════════════════════════════════════════════════
  // ВЫПОЛНЕНИЕ
  // ═══════════════════════════════════════════════════

  console.log('🚀 ОРБИТА — Начальная настройка');
  console.log('================================');

  // 1. Сохраняем продукты
  var existingProducts = JSON.parse(localStorage.getItem('ECOTECH_PRODUCTS') || '[]');
  var newProducts = PRODUCTS.filter(function(p) {
    return !existingProducts.some(function(ep) { return ep.id === p.id; });
  });
  var allProducts = existingProducts.concat(newProducts);
  localStorage.setItem('ECOTECH_PRODUCTS', JSON.stringify(allProducts));
  localStorage.setItem('ECOTECH_DATA_VERSION', String(DATA_VERSION));
  console.log('✓ Продукты: ' + newProducts.length + ' новых (всего ' + allProducts.length + ')');

  // 2. Сохраняем пользователей
  var existingUsers = JSON.parse(localStorage.getItem('ECOTECH_USERS') || '[]');
  var newUsers = USERS.filter(function(u) {
    return !existingUsers.some(function(eu) { return eu.email === u.email; });
  }).map(function(u) {
    u.createdBy = 'seed-script';
    u.createdAt = new Date().toISOString().split('T')[0];
    if (!u.assignments) u.assignments = [];
    if (!u.productIds) u.productIds = [];
    return u;
  });
  var allUsers = existingUsers.concat(newUsers);
  localStorage.setItem('ECOTECH_USERS', JSON.stringify(allUsers));
  console.log('✓ Пользователи: ' + newUsers.length + ' новых (всего ' + allUsers.length + ')');

  // 3. Сохраняем цели
  if (GOALS.length) {
    var existingGoals = JSON.parse(localStorage.getItem('ECOTECH_GOALS') || '[]');
    var newGoals = GOALS.filter(function(g) {
      return !existingGoals.some(function(eg) { return eg.id === g.id; });
    });
    var allGoals = existingGoals.concat(newGoals);
    localStorage.setItem('ECOTECH_GOALS', JSON.stringify(allGoals));
    console.log('✓ Цели: ' + newGoals.length + ' новых (всего ' + allGoals.length + ')');
  }

  // 4. Генерируем инвайт-ссылки
  console.log('\n================================');
  console.log('📧 ИНВАЙТЫ ДЛЯ УЧАСТНИКОВ');
  console.log('================================\n');

  var invites = allUsers.filter(function(u) {
    return u.role !== 'admin' && u.role !== 'guest' && u.active;
  });

  invites.forEach(function(u) {
    var roleLabel = {
      pmo_lead: 'Руководитель ПО',
      pmo: 'PMO-менеджер',
      pm: 'Product Manager',
      lead: 'Руководитель',
      stakeholder: 'Заказчик'
    }[u.role] || u.role;

    var productInfo = '';
    if (u.assignments && u.assignments.length) {
      productInfo = ' → ' + u.assignments.map(function(a) { return a.productId; }).join(', ');
    }

    var inviteUrl = PLATFORM_URL + '?invite=' + encodeURIComponent(u.email);

    console.log('─────────────────────────');
    console.log('👤 ' + u.name + ' (' + roleLabel + ')' + productInfo);
    console.log('📧 ' + u.email);
    console.log('🔗 ' + inviteUrl);
    console.log('');
    console.log('Текст для мессенджера:');
    console.log('Привет! Тебя подключили к ОРБИТА — платформе управления продуктовым портфелем.');
    console.log('Роль: ' + roleLabel + productInfo);
    console.log('Ссылка: ' + inviteUrl);
    console.log('Логин: ' + u.email);
    console.log('');
  });

  console.log('================================');
  console.log('✅ Настройка завершена!');
  console.log('Перезагрузите страницу (F5) чтобы увидеть данные.');
  console.log('================================');

  // 5. Лог для аудита
  var log = {
    action: 'seed-data',
    date: new Date().toISOString(),
    products: newProducts.length,
    users: newUsers.length,
    goals: GOALS.length
  };
  var changelog = JSON.parse(localStorage.getItem('ECOTECH_CHANGELOG') || '[]');
  changelog.push(log);
  localStorage.setItem('ECOTECH_CHANGELOG', JSON.stringify(changelog));

})();
