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

    // Base path (тот же подход что в nav.js)
    var scripts = document.querySelectorAll('script[src*="auth"]');
    var base = scripts.length ? scripts[0].getAttribute('src').replace(/js\/auth.*$/, '') : '';

    function tryInsert() {
      var nav = document.querySelector('.ecotech-nav');
      if (!nav) { setTimeout(tryInsert, 100); return; }
      if (document.getElementById('auth-badge')) return;

      var badge = document.createElement('div');
      badge.id = 'auth-badge';
      badge.style.cssText = 'display:flex;align-items:center;gap:6px;margin-left:8px;padding:4px 10px;' +
        'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;cursor:pointer;flex-shrink:0;position:relative;';
      badge.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:' + role.color + '"></span>' +
        '<span style="font-size:10px;color:#E8E6FF;font-weight:600;white-space:nowrap;">' + escH(user.name) + '</span>' +
        '<span style="font-size:9px;color:' + role.color + '">' + (isGuest ? 'Демо' : role.label) + '</span>';
      badge.title = isGuest ? 'Гостевой режим. Клик — войти.' : 'Клик — профиль';
      badge.onclick = function(e) {
        e.stopPropagation();
        if (isGuest) {
          OrbAuth.logout();
          showAuthModal();
          return;
        }
        var existing = document.getElementById('profile-dropdown');
        if (existing) { existing.remove(); return; }

        var dd = document.createElement('div');
        dd.id = 'profile-dropdown';
        dd.style.cssText = 'position:absolute;top:calc(100% + 8px);right:0;background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:12px;padding:16px;min-width:220px;z-index:100000;box-shadow:0 12px 40px rgba(0,0,0,.5);';

        var adminLink = (user.role === 'admin') ?
          '<a href="' + (window.location.pathname.indexOf('/') > 0 ? '../' : '') + 'admin.html" style="display:block;padding:8px 12px;border-radius:7px;background:rgba(255,45,138,.08);border:1px solid rgba(255,45,138,.2);color:#FF85C0;font-size:11px;font-weight:600;text-decoration:none;margin-bottom:6px;text-align:center;transition:all .15s;">Управление доступами →</a>' : '';

        dd.innerHTML =
          '<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:2px;">' + escH(user.name) + '</div>' +
          '<div style="font-size:11px;color:#7A9DB8;margin-bottom:4px;">' + escH(user.email) + '</div>' +
          '<div style="display:flex;gap:4px;margin-bottom:12px;">' +
            '<span style="font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(79,195,247,.1);color:' + role.color + ';font-weight:700;">' + role.label + '</span>' +
            (user.team ? '<span style="font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,.04);color:#7A9DB8;">' + escH(user.team) + '</span>' : '') +
          '</div>' +
          (user.productIds && user.productIds.length ? '<div style="font-size:10px;color:#7A9DB8;margin-bottom:10px;">Продукты: ' + user.productIds.join(', ') + '</div>' : '') +
          adminLink +
          '<button onclick="OrbAuth.logout();location.reload();" style="width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,.08);border-radius:7px;color:#7A9DB8;font-size:11px;cursor:pointer;">Выйти</button>';

        badge.style.position = 'relative';
        badge.appendChild(dd);

        // Закрыть при клике вне
        setTimeout(function() {
          document.addEventListener('click', function closeDD(ev) {
            if (!dd.contains(ev.target) && ev.target !== badge) {
              dd.remove();
              document.removeEventListener('click', closeDD);
            }
          });
        }, 10);
      };

      var rwb = nav.querySelector('.en-rwb');
      if (rwb) nav.insertBefore(badge, rwb);
      else nav.appendChild(badge);
    }
    tryInsert();
  }

  function showProfileDropdown(anchor, user, role, base) {
    var dd = document.createElement('div');
    dd.id = 'auth-profile-dropdown';
    dd.style.cssText = 'position:absolute;top:calc(100% + 8px);right:0;background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:12px;padding:12px;min-width:240px;z-index:99999;box-shadow:0 12px 40px rgba(0,0,0,.5);';

    var productsHtml = '';
    if (user.productIds && user.productIds.length) {
      productsHtml = user.productIds.map(function(pid) {
        return '<span style="display:inline-block;font-size:10px;padding:2px 8px;margin:2px;border-radius:6px;background:rgba(0,212,180,0.1);border:1px solid rgba(0,212,180,0.2);color:#00D4B4;">' + escH(pid) + '</span>';
      }).join('');
    } else {
      productsHtml = '<span style="font-size:11px;color:#7A9DB8;">Нет назначенных продуктов</span>';
    }

    var adminLink = user.role === 'admin'
      ? '<a class="ap-link ap-admin" href="' + base + 'admin.html" style="display:block;font-size:12px;color:#FF2D8A;text-decoration:none;padding:6px 0;transition:opacity .15s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">Управление доступами</a>'
      : '';

    dd.innerHTML =
      '<div class="ap-header">' +
        '<div class="ap-name" style="font-size:14px;font-weight:700;color:#E8F4FD;font-family:Orbitron,sans-serif;">' + escH(user.name) + '</div>' +
        '<div class="ap-role" style="font-size:11px;color:#7A9DB8;margin-top:2px;">' + escH(role.label) + ' · ' + escH(user.email) + '</div>' +
      '</div>' +
      '<div class="ap-section" style="font-size:10px;color:#4FC3F7;text-transform:uppercase;letter-spacing:1px;margin-top:10px;margin-bottom:4px;">Мои продукты</div>' +
      '<div class="ap-products" style="margin-bottom:8px;">' + productsHtml + '</div>' +
      '<div class="ap-divider" style="border-top:1px solid rgba(255,255,255,0.08);margin:8px 0;"></div>' +
      '<a class="ap-link" href="' + base + '\u041f\u0440\u043e\u0435\u043a\u0442\u043d\u044b\u0439 \u043e\u0444\u0438\u0441/tracker.html#tab=backlog" style="display:block;font-size:12px;color:#4FC3F7;text-decoration:none;padding:6px 0;transition:opacity .15s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">Мои инициативы</a>' +
      adminLink +
      '<div class="ap-divider" style="border-top:1px solid rgba(255,255,255,0.08);margin:8px 0;"></div>' +
      '<button class="ap-logout" style="width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,0.08);border-radius:8px;color:#7A9DB8;font-size:11px;cursor:pointer;transition:all .15s;font-family:Exo 2,sans-serif;" onclick="OrbAuth.logout();location.reload();">Сменить пользователя</button>';

    anchor.appendChild(dd);

    // Закрытие при клике вне
    function closeDropdown(e) {
      if (!dd.contains(e.target) && e.target !== dd) {
        dd.remove();
        document.removeEventListener('click', closeDropdown);
      }
    }
    setTimeout(function() {
      document.addEventListener('click', closeDropdown);
    }, 0);
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
