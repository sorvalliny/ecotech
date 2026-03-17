/**
 * ОРБИТА — Auth UI
 * Показывает модал входа по email @rwb.ru если не залогинен.
 * Добавляет бейдж пользователя в навигацию.
 */
(function() {
  'use strict';

  // Страницы, доступные без авторизации (публичные + демо)
  var PUBLIC_PAGES = ['index.html', 'business.html', 'brief.html', ''];
  var DEMO_PATTERN = /eco-00|demo|orbita/i; // Демо-продукт доступен всем

  function isPublicPage() {
    var path = window.location.pathname.toLowerCase();
    var filename = path.split('/').pop() || '';
    // Корневые страницы портфеля — открыты
    if (PUBLIC_PAGES.indexOf(filename) >= 0) return true;
    // docs/ — открыты
    if (path.indexOf('/docs/') >= 0) return true;
    return false;
  }

  function init() {
    if (!window.OrbAuth) { setTimeout(init, 50); return; }

    if (OrbAuth.isLoggedIn()) {
      renderUserBadge();
      return;
    }

    // Публичные страницы — не требуют авторизации, но показывают кнопку «Войти»
    if (isPublicPage()) {
      renderLoginButton();
      return;
    }

    // Всё остальное (реестр, чеклист, шаблоны, инструменты, дашборд, админка) — авторизация
    showLoginModal();
  }

  function renderLoginButton() {
    function tryInsert() {
      var nav = document.querySelector('.ecotech-nav');
      if (!nav) { setTimeout(tryInsert, 100); return; }
      if (document.getElementById('auth-login-btn')) return;
      var btn = document.createElement('button');
      btn.id = 'auth-login-btn';
      btn.style.cssText = 'display:flex;align-items:center;gap:5px;margin-left:8px;padding:5px 14px;background:rgba(0,212,180,0.12);border:1px solid rgba(0,212,180,0.3);border-radius:8px;color:#00D4B4;font-family:Orbitron,sans-serif;font-size:10px;font-weight:700;cursor:pointer;flex-shrink:0;transition:all .15s;';
      btn.textContent = 'Войти';
      btn.onclick = function() { showLoginModal(); };
      var rwb = nav.querySelector('.en-rwb');
      if (rwb) nav.insertBefore(btn, rwb);
      else nav.appendChild(btn);
    }
    tryInsert();
  }

  function showLoginModal() {
    var overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,15,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;';

    var modal = document.createElement('div');
    modal.style.cssText = 'background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:16px;padding:36px;max-width:380px;width:90%;text-align:center;';

    modal.innerHTML =
      '<div style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#fff;margin-bottom:6px;">ОРБИТА</div>' +
      '<div style="font-size:12px;color:#7A9DB8;margin-bottom:24px;">Вход по корпоративной почте</div>' +
      '<div id="auth-step-email">' +
        '<input id="auth-email" type="email" placeholder="имя@rwb.ru" style="width:100%;padding:12px 16px;background:#0d2a40;border:1px solid rgba(79,195,247,0.2);border-radius:10px;color:#E8F4FD;font-size:14px;outline:none;margin-bottom:8px;font-family:Exo 2,sans-serif;" />' +
        '<div id="auth-error" style="font-size:11px;color:#F87171;min-height:18px;margin-bottom:8px;"></div>' +
        '<button onclick="authRequestCode()" style="width:100%;padding:12px;background:linear-gradient(135deg,#00D4B4,#4FC3F7);border:none;border-radius:10px;color:#fff;font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;cursor:pointer;">Получить код</button>' +
      '</div>' +
      '<div id="auth-step-code" style="display:none">' +
        '<div id="auth-code-msg" style="font-size:12px;color:#00D4B4;margin-bottom:12px;"></div>' +
        '<input id="auth-code" type="text" placeholder="4-значный код" maxlength="4" style="width:100%;padding:12px 16px;background:#0d2a40;border:1px solid rgba(79,195,247,0.2);border-radius:10px;color:#E8F4FD;font-size:20px;font-weight:900;text-align:center;letter-spacing:8px;outline:none;margin-bottom:8px;font-family:Orbitron,sans-serif;" />' +
        '<div id="auth-code-error" style="font-size:11px;color:#F87171;min-height:18px;margin-bottom:8px;"></div>' +
        '<button onclick="authVerifyCode()" style="width:100%;padding:12px;background:linear-gradient(135deg,#00D4B4,#4FC3F7);border:none;border-radius:10px;color:#fff;font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;cursor:pointer;">Войти</button>' +
        '<button onclick="document.getElementById(\'auth-step-email\').style.display=\'\';document.getElementById(\'auth-step-code\').style.display=\'none\';" style="width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:10px;color:#7A9DB8;font-size:11px;cursor:pointer;margin-top:6px;">← Другой email</button>' +
      '</div>';

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus email input
    setTimeout(function() { document.getElementById('auth-email').focus(); }, 100);
  }

  window.authRequestCode = function() {
    var email = document.getElementById('auth-email').value;
    var result = OrbAuth.login(email);
    if (!result.ok) {
      document.getElementById('auth-error').textContent = result.error;
      return;
    }
    document.getElementById('auth-step-email').style.display = 'none';
    document.getElementById('auth-step-code').style.display = '';
    document.getElementById('auth-code-msg').textContent = 'Код для ' + result.userName + ': ' + result.code;
    // MVP: показываем код на экране. Production: отправляем на email.
    setTimeout(function() { document.getElementById('auth-code').focus(); }, 100);
  };

  window.authVerifyCode = function() {
    var code = document.getElementById('auth-code').value;
    var result = OrbAuth.verifyOTP(code);
    if (!result.ok) {
      document.getElementById('auth-code-error').textContent = result.error;
      return;
    }
    document.getElementById('auth-overlay').remove();
    location.reload();
  };

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
