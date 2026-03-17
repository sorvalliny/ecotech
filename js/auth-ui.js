/**
 * ОРБИТА — Auth UI v2
 * Модал: Вход / Регистрация / Гостевой доступ
 * Двухшаговая авторизация по email @rwb.ru + OTP
 */
(function() {
  'use strict';

  var PUBLIC_PAGES = ['index.html', 'business.html', 'brief.html', ''];

  function isPublicPage() {
    var path = window.location.pathname.toLowerCase();
    var filename = path.split('/').pop() || '';
    if (PUBLIC_PAGES.indexOf(filename) >= 0) return true;
    if (path.indexOf('/docs/') >= 0) return true;
    return false;
  }

  function init() {
    if (!window.OrbAuth) { setTimeout(init, 50); return; }
    if (OrbAuth.isLoggedIn()) { renderUserBadge(); return; }
    if (isPublicPage()) { renderLoginButton(); return; }
    showAuthModal();
  }

  function renderLoginButton() {
    function tryInsert() {
      var nav = document.querySelector('.ecotech-nav');
      if (!nav) { setTimeout(tryInsert, 100); return; }
      if (document.getElementById('auth-login-btn')) return;
      var btn = document.createElement('button');
      btn.id = 'auth-login-btn';
      btn.style.cssText = 'display:flex;align-items:center;gap:5px;margin-left:8px;padding:5px 14px;background:rgba(0,212,180,0.12);border:1px solid rgba(0,212,180,0.3);border-radius:8px;color:#00D4B4;font-family:Orbitron,sans-serif;font-size:10px;font-weight:700;cursor:pointer;flex-shrink:0;';
      btn.textContent = 'Войти';
      btn.onclick = function() { showAuthModal(); };
      var rwb = nav.querySelector('.en-rwb');
      if (rwb) nav.insertBefore(btn, rwb);
      else nav.appendChild(btn);
    }
    tryInsert();
  }

  // ═══════════════════════════════════════════════
  // ГЛАВНЫЙ МОДАЛ
  // ═══════════════════════════════════════════════

  function showAuthModal() {
    if (document.getElementById('auth-overlay')) return;

    var overlay = document.createElement('div');
    overlay.id = 'auth-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(3,8,15,0.95);z-index:99999;display:flex;align-items:center;justify-content:center;';

    var modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.style.cssText = 'background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:16px;padding:36px;max-width:400px;width:92%;text-align:center;';

    modal.innerHTML = renderChoiceStep();
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function setModalContent(html) {
    var modal = document.getElementById('auth-modal');
    if (modal) modal.innerHTML = html;
  }

  // ═══════════════════════════════════════════════
  // ШАГ 0: ВЫБОР — Войти / Регистрация / Гость
  // ═══════════════════════════════════════════════

  function renderChoiceStep() {
    return '' +
      '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#fff;margin-bottom:6px;">ОРБИТА</div>' +
      '<div style="font-size:12px;color:#7A9DB8;margin-bottom:28px;">Платформа управления портфелем продуктов</div>' +

      // Кнопка: Войти
      '<button onclick="authShowLogin()" style="' + btnPrimary() + 'margin-bottom:8px;">' +
        'Войти по корпоративной почте' +
      '</button>' +

      // Кнопка: Регистрация
      '<button onclick="authShowRegister()" style="' + btnSecondary() + 'margin-bottom:8px;">' +
        'Зарегистрироваться' +
      '</button>' +

      // Кнопка: Гость
      '<button onclick="authGuestLogin()" style="' + btnGhost() + 'margin-bottom:16px;">' +
        'Войти как гость (демо)' +
      '</button>' +

      // Будущее
      '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;margin-top:4px;">' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.2);margin-bottom:6px;">Скоро</div>' +
        '<div style="display:flex;gap:6px;justify-content:center;">' +
          '<span style="' + futureTag() + '">WB ID</span>' +
          '<span style="' + futureTag() + '">2FA</span>' +
          '<span style="' + futureTag() + '">Сброс пароля</span>' +
        '</div>' +
      '</div>';
  }

  // ═══════════════════════════════════════════════
  // ШАГ 1а: ВХОД — email → OTP
  // ═══════════════════════════════════════════════

  window.authShowLogin = function() {
    setModalContent('' +
      headerBlock('Вход') +
      '<input id="auth-email" type="email" placeholder="имя@rwb.ru" style="' + inputStyle() + '" />' +
      '<div id="auth-error" style="font-size:11px;color:#F87171;min-height:18px;margin-bottom:8px;"></div>' +
      '<button onclick="authRequestCode()" style="' + btnPrimary() + '">Получить код</button>' +
      backBtn()
    );
    setTimeout(function() { var el = document.getElementById('auth-email'); if(el) el.focus(); }, 100);
  };

  window.authRequestCode = function() {
    var email = document.getElementById('auth-email').value;
    var result = OrbAuth.login(email);
    if (!result.ok) {
      document.getElementById('auth-error').textContent = result.error;
      return;
    }
    setModalContent('' +
      headerBlock('Подтверждение') +
      '<div style="font-size:12px;color:#00D4B4;margin-bottom:12px;">Код для ' + escH(result.userName) + ': <strong style="font-size:16px;letter-spacing:4px;">' + result.code + '</strong></div>' +
      '<div style="font-size:10px;color:#7A9DB8;margin-bottom:12px;">MVP: код показан на экране. В продакшене — на почту.</div>' +
      '<input id="auth-code" type="text" placeholder="4-значный код" maxlength="4" style="' + inputStyle() + 'font-size:20px;font-weight:900;text-align:center;letter-spacing:8px;font-family:Orbitron,sans-serif;" />' +
      '<div id="auth-code-error" style="font-size:11px;color:#F87171;min-height:18px;margin-bottom:8px;"></div>' +
      '<button onclick="authVerifyCode()" style="' + btnPrimary() + '">Войти</button>' +
      '<button onclick="authShowLogin()" style="' + btnGhost() + 'margin-top:6px;">← Другой email</button>'
    );
    setTimeout(function() { var el = document.getElementById('auth-code'); if(el) el.focus(); }, 100);
  };

  window.authVerifyCode = function() {
    var code = document.getElementById('auth-code').value;
    var result = OrbAuth.verifyOTP(code);
    if (!result.ok) {
      document.getElementById('auth-code-error').textContent = result.error;
      return;
    }
    closeAuthAndReload();
  };

  // ═══════════════════════════════════════════════
  // ШАГ 1б: РЕГИСТРАЦИЯ
  // ═══════════════════════════════════════════════

  window.authShowRegister = function() {
    setModalContent('' +
      headerBlock('Регистрация') +
      '<input id="reg-name" type="text" placeholder="Имя Фамилия" style="' + inputStyle() + '" />' +
      '<input id="reg-email" type="email" placeholder="имя@rwb.ru" style="' + inputStyle() + '" />' +
      '<select id="reg-role" style="' + inputStyle() + 'cursor:pointer;">' +
        '<option value="">— Выберите роль —</option>' +
        '<option value="pm">PM (менеджер продукта)</option>' +
        '<option value="viewer">Наблюдатель</option>' +
      '</select>' +
      '<div id="reg-error" style="font-size:11px;color:#F87171;min-height:18px;margin-bottom:8px;"></div>' +
      '<button onclick="authRegister()" style="' + btnPrimary() + '">Зарегистрироваться</button>' +
      '<div style="font-size:10px;color:#7A9DB8;margin-top:8px;">После регистрации администратор подтвердит доступ и назначит продукты.</div>' +
      backBtn()
    );
    setTimeout(function() { var el = document.getElementById('reg-name'); if(el) el.focus(); }, 100);
  };

  window.authRegister = function() {
    var name = (document.getElementById('reg-name').value || '').trim();
    var email = (document.getElementById('reg-email').value || '').trim().toLowerCase();
    var role = document.getElementById('reg-role').value;
    var errEl = document.getElementById('reg-error');

    if (!name) { errEl.textContent = 'Укажите имя'; return; }
    if (!email.endsWith('@rwb.ru')) { errEl.textContent = 'Только корпоративная почта @rwb.ru'; return; }
    if (!role) { errEl.textContent = 'Выберите роль'; return; }

    var users = OrbAuth.getUsers();
    if (users.find(function(u) { return u.email === email; })) {
      errEl.textContent = 'Email уже зарегистрирован. Используйте «Войти».';
      return;
    }

    var newUser = {
      id: 'U' + String(Date.now()).slice(-6),
      name: name,
      role: role,
      email: email,
      productIds: [],
      contact: '',
      team: ''
    };
    users.push(newUser);
    OrbAuth.saveUsers(users);

    setModalContent('' +
      headerBlock('Заявка отправлена') +
      '<div style="font-size:13px;color:#00D4B4;margin-bottom:12px;">✓ Вы зарегистрированы</div>' +
      '<div style="font-size:12px;color:#E8F4FD;margin-bottom:6px;"><strong>' + escH(name) + '</strong></div>' +
      '<div style="font-size:11px;color:#7A9DB8;margin-bottom:16px;">' + escH(email) + ' · ' + (role === 'pm' ? 'PM' : 'Наблюдатель') + '</div>' +
      '<div style="font-size:11px;color:#7A9DB8;margin-bottom:16px;">Администратор подтвердит доступ и назначит продукты.<br>Вы можете войти прямо сейчас.</div>' +
      '<button onclick="authShowLogin()" style="' + btnPrimary() + '">Войти</button>' +
      '<button onclick="authGuestLogin()" style="' + btnGhost() + 'margin-top:6px;">Или войти как гость</button>'
    );
  };

  // ═══════════════════════════════════════════════
  // ГОСТЕВОЙ ВХОД (ДЕМО)
  // ═══════════════════════════════════════════════

  window.authGuestLogin = function() {
    // Создаём гостевую сессию — видит только ДЕМО-продукт (ECO-00)
    var guestUser = {
      id: 'GUEST',
      name: 'Гость',
      role: 'viewer',
      email: 'guest@demo',
      productIds: ['ECO-00'],
      contact: '',
      team: 'Демо'
    };

    // Добавить в users если нет
    var users = OrbAuth.getUsers();
    if (!users.find(function(u) { return u.id === 'GUEST'; })) {
      users.push(guestUser);
      OrbAuth.saveUsers(users);
    }

    // Авторизовать
    localStorage.setItem('ECOTECH_AUTH', JSON.stringify({ id: 'GUEST', ts: Date.now() }));
    closeAuthAndReload();
  };

  // ═══════════════════════════════════════════════
  // БЕЙДЖ ПОЛЬЗОВАТЕЛЯ
  // ═══════════════════════════════════════════════

  function renderUserBadge() {
    var user = OrbAuth.getCurrentUser();
    if (!user) return;
    var role = OrbAuth.ROLES[user.role] || { label: user.role, color: '#7A7A9D' };
    var isGuest = user.id === 'GUEST';

    function tryInsert() {
      var nav = document.querySelector('.ecotech-nav');
      if (!nav) { setTimeout(tryInsert, 100); return; }
      if (document.getElementById('auth-badge')) return;

      var badge = document.createElement('div');
      badge.id = 'auth-badge';
      badge.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:8px;padding:4px 10px;' +
        'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;cursor:pointer;flex-shrink:0;';
      badge.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:' + role.color + '"></span>' +
        '<span style="font-size:10px;color:#E8E6FF;font-weight:600;white-space:nowrap;">' + escH(user.name) + '</span>' +
        '<span style="font-size:9px;color:' + role.color + '">' + (isGuest ? 'Демо' : role.label) + '</span>';
      badge.title = isGuest ? 'Гостевой режим. Клик — войти.' : 'Клик — сменить пользователя';
      badge.onclick = function() {
        if (isGuest) {
          OrbAuth.logout();
          showAuthModal();
        } else if (confirm('Сменить пользователя?')) {
          OrbAuth.logout();
          location.reload();
        }
      };

      var rwb = nav.querySelector('.en-rwb');
      if (rwb) nav.insertBefore(badge, rwb);
      else nav.appendChild(badge);
    }
    tryInsert();
  }

  // ═══════════════════════════════════════════════
  // УТИЛИТЫ
  // ═══════════════════════════════════════════════

  function closeAuthAndReload() {
    var overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.remove();
    location.reload();
  }

  function escH(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function headerBlock(title) {
    return '<div style="font-family:Orbitron,sans-serif;font-size:18px;font-weight:900;color:#fff;margin-bottom:4px;">ОРБИТА</div>' +
      '<div style="font-size:12px;color:#7A9DB8;margin-bottom:20px;">' + title + '</div>';
  }

  function backBtn() {
    return '<button onclick="document.getElementById(\'auth-modal\').innerHTML=renderChoiceStep()" style="' + btnGhost() + 'margin-top:8px;">← Назад</button>';
  }

  // Выносим renderChoiceStep в глобал для кнопки «Назад»
  window.renderChoiceStep = renderChoiceStep;

  function btnPrimary() {
    return 'width:100%;padding:12px;background:linear-gradient(135deg,#00D4B4,#4FC3F7);border:none;border-radius:10px;color:#fff;font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .15s;';
  }
  function btnSecondary() {
    return 'width:100%;padding:12px;background:transparent;border:1px solid rgba(79,195,247,0.25);border-radius:10px;color:#4FC3F7;font-family:Exo 2,sans-serif;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;';
  }
  function btnGhost() {
    return 'width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,0.08);border-radius:10px;color:#7A9DB8;font-family:Exo 2,sans-serif;font-size:11px;cursor:pointer;transition:all .15s;';
  }
  function inputStyle() {
    return 'width:100%;padding:12px 16px;background:#0d2a40;border:1px solid rgba(79,195,247,0.2);border-radius:10px;color:#E8F4FD;font-size:14px;outline:none;margin-bottom:8px;font-family:Exo 2,sans-serif;';
  }
  function futureTag() {
    return 'font-size:9px;padding:2px 8px;border-radius:4px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);color:rgba(255,255,255,0.25);font-weight:600;';
  }

  // Запуск
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
