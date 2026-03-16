/**
 * ОРБИТА — Auth UI
 * Показывает модал выбора пользователя если не залогинен.
 * Добавляет бейдж пользователя в навигацию.
 */
(function() {
  'use strict';

  function init() {
    if (!window.OrbAuth) { setTimeout(init, 50); return; }

    // Если не залогинен — показать модал
    if (!OrbAuth.isLoggedIn()) {
      showLoginModal();
    } else {
      renderUserBadge();
    }
  }

  function showLoginModal() {
    var users = OrbAuth.getUsers();
    var overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,15,0.92);z-index:99999;display:flex;align-items:center;justify-content:center;';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:16px;padding:32px;max-width:400px;width:90%;text-align:center;';

    var title = '<div style="font-family:Orbitron,sans-serif;font-size:16px;font-weight:900;color:#fff;margin-bottom:8px;">ОРБИТА</div>';
    var sub = '<div style="font-size:12px;color:#7A7A9D;margin-bottom:24px;">Выберите свой профиль для начала работы</div>';

    var buttons = users.map(function(u) {
      var role = OrbAuth.ROLES[u.role] || { label: u.role, color: '#7A7A9D' };
      return '<button onclick="OrbAuth.login(\'' + u.id + '\');document.getElementById(\'auth-overlay\').remove();location.reload();" style="' +
        'display:flex;align-items:center;gap:10px;width:100%;padding:12px 16px;margin-bottom:6px;' +
        'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;' +
        'color:#E8E6FF;font-family:Exo 2,sans-serif;font-size:13px;cursor:pointer;transition:all .15s;text-align:left;"' +
        ' onmouseover="this.style.borderColor=\'rgba(79,195,247,0.3)\';this.style.background=\'rgba(79,195,247,0.05)\'"' +
        ' onmouseout="this.style.borderColor=\'rgba(255,255,255,0.07)\';this.style.background=\'rgba(255,255,255,0.03)\'">' +
        '<span style="width:8px;height:8px;border-radius:50%;background:' + role.color + ';flex-shrink:0"></span>' +
        '<span style="flex:1">' + u.name + '</span>' +
        '<span style="font-size:10px;color:' + role.color + ';font-weight:600;">' + role.label + '</span>' +
        '</button>';
    }).join('');

    modal.innerHTML = title + sub + buttons;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function renderUserBadge() {
    var user = OrbAuth.getCurrentUser();
    if (!user) return;
    var role = OrbAuth.ROLES[user.role] || { label: user.role, color: '#7A7A9D' };

    // Ждём навбар
    function tryInsert() {
      var nav = document.querySelector('.ecotech-nav');
      if (!nav) { setTimeout(tryInsert, 100); return; }

      // Проверить что ещё не вставлен
      if (document.getElementById('auth-badge')) return;

      var badge = document.createElement('div');
      badge.id = 'auth-badge';
      badge.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:8px;padding:4px 10px;' +
        'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;cursor:pointer;flex-shrink:0;';
      badge.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:' + role.color + '"></span>' +
        '<span style="font-size:10px;color:#E8E6FF;font-weight:600;white-space:nowrap;">' + user.name.split(' ')[0] + '</span>' +
        '<span style="font-size:9px;color:' + role.color + '">' + role.label + '</span>';
      badge.title = 'Клик — сменить пользователя';
      badge.onclick = function() {
        if (confirm('Сменить пользователя?')) {
          OrbAuth.logout();
          location.reload();
        }
      };

      // Вставить перед RWB logo
      var rwb = nav.querySelector('.en-rwb');
      if (rwb) nav.insertBefore(badge, rwb);
      else nav.appendChild(badge);
    }
    tryInsert();
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
