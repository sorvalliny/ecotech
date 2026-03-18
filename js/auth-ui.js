/**
 * ОРБИТА — Auth UI v3 (W4-010 / W4-011)
 * Модал: Вход / Гостевой доступ (саморегистрация убрана)
 * Автовход гостем при первом визите + баннер
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

    if (OrbAuth.isLoggedIn()) {
      var user = OrbAuth.getCurrentUser();
      renderUserBadge();
      // Баннер для гостя
      if (user && user.role === 'guest') {
        renderGuestBanner();
      }
      return;
    }

    // Автовход гостем при первом визите (W4-011 шаг 5)
    var hasEverLoggedIn = localStorage.getItem('ECOTECH_EVER_LOGGED');
    if (!hasEverLoggedIn) {
      OrbAuth.loginAsGuest();
      localStorage.setItem('ECOTECH_EVER_LOGGED', '1');
      // Не перезагружаем — просто рендерим бейдж и баннер
      renderUserBadge();
      renderGuestBanner();
      return;
    }

    // Если был залогинен ранее, но сейчас нет (разлогинился)
    if (isPublicPage()) {
      renderLoginButton();
      return;
    }
    showAuthModal();
  }

  // ═══════════════════════════════════════════════
  // БАННЕР ГОСТЕВОГО РЕЖИМА
  // ═══════════════════════════════════════════════

  function renderGuestBanner() {
    function tryInsert() {
      // Ждём пока body будет доступен
      if (!document.body) { setTimeout(tryInsert, 100); return; }
      if (document.getElementById('guest-banner')) return;

      var banner = document.createElement('div');
      banner.id = 'guest-banner';
      banner.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99998;' +
        'background:linear-gradient(135deg,rgba(3,8,15,0.97),rgba(6,21,37,0.97));' +
        'border-top:1px solid rgba(255,184,48,0.3);' +
        'padding:10px 20px;display:flex;align-items:center;justify-content:center;gap:12px;' +
        'font-family:"Exo 2",sans-serif;font-size:12px;color:#FFB830;';

      banner.innerHTML =
        '<span style="opacity:0.7;">Вы в гостевом режиме — доступен только ДЕМО и ID вместо названий.</span>' +
        '<button id="guest-banner-login" style="padding:5px 14px;background:rgba(0,212,180,0.12);border:1px solid rgba(0,212,180,0.3);border-radius:8px;color:#00D4B4;font-family:Orbitron,sans-serif;font-size:10px;font-weight:700;cursor:pointer;">Войти</button>' +
        '<button id="guest-banner-close" style="background:none;border:none;color:#7A9DB8;font-size:16px;cursor:pointer;padding:0 4px;" title="Закрыть">&#10005;</button>';

      document.body.appendChild(banner);

      document.getElementById('guest-banner-login').onclick = function() {
        OrbAuth.logout();
        banner.remove();
        showAuthModal();
      };
      document.getElementById('guest-banner-close').onclick = function() {
        banner.remove();
      };
    }
    tryInsert();
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
    modal.style.cssText = 'background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:16px;padding:36px;max-width:400px;width:92%;text-align:center;position:relative;';

    modal.innerHTML = renderChoiceStep();
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  window.closeAuthModal = function() {
    var overlay = document.getElementById('auth-overlay');
    if (overlay) overlay.remove();
    // Если на защищённой странице — назад или на главную
    if (!isPublicPage()) {
      if (history.length > 1) {
        history.back();
      } else {
        window.location.href = window.location.origin + '/';
      }
    }
  };

  function setModalContent(html) {
    var modal = document.getElementById('auth-modal');
    if (modal) modal.innerHTML = html;
  }

  // ═══════════════════════════════════════════════
  // ШАГ 0: ВЫБОР — Войти / Гость (без регистрации)
  // ═══════════════════════════════════════════════

  function renderChoiceStep() {
    return '' +
      '<button onclick="closeAuthModal()" style="position:absolute;top:12px;right:14px;background:none;border:none;color:#7A9DB8;font-size:18px;cursor:pointer;padding:4px 8px;transition:color .15s;" onmouseover="this.style.color=\'#fff\'" onmouseout="this.style.color=\'#7A9DB8\'" title="Закрыть">&#10005;</button>' +
      '<div style="font-family:Orbitron,sans-serif;font-size:20px;font-weight:900;color:#fff;margin-bottom:6px;">ОРБИТА</div>' +
      '<div style="font-size:12px;color:#7A9DB8;margin-bottom:28px;">Платформа управления портфелем продуктов</div>' +

      // Кнопка: Войти
      '<button onclick="authShowLogin()" style="' + btnPrimary() + 'margin-bottom:8px;">' +
        'Войти по email' +
      '</button>' +

      // Кнопка: Гость
      '<button onclick="authGuestLogin()" style="' + btnGhost() + 'margin-bottom:16px;">' +
        'Войти как гость (демо)' +
      '</button>' +

      '<div style="font-size:11px;color:rgba(255,255,255,0.25);margin-top:4px;">Нет аккаунта? Обратитесь к администратору.</div>' +

      // Будущее
      '<div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:12px;margin-top:12px;">' +
        '<div style="font-size:10px;color:rgba(255,255,255,0.2);margin-bottom:6px;">Скоро</div>' +
        '<div style="display:flex;gap:6px;justify-content:center;">' +
          '<span style="' + futureTag() + '">WB ID</span>' +
          '<span style="' + futureTag() + '">2FA</span>' +
        '</div>' +
      '</div>';
  }

  // ═══════════════════════════════════════════════
  // ШАГ 1: ВХОД — email → OTP
  // ═══════════════════════════════════════════════

  window.authShowLogin = function() {
    setModalContent('' +
      headerBlock('Вход') +
      '<input id="auth-email" type="email" placeholder="email" style="' + inputStyle() + '" />' +
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
      '<button onclick="authShowLogin()" style="' + btnGhost() + 'margin-top:6px;">&#8592; Другой email</button>'
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
  // ГОСТЕВОЙ ВХОД (ДЕМО)
  // ═══════════════════════════════════════════════

  window.authGuestLogin = function() {
    OrbAuth.loginAsGuest();
    closeAuthAndReload();
  };

  // ═══════════════════════════════════════════════
  // БЕЙДЖ ПОЛЬЗОВАТЕЛЯ
  // ═══════════════════════════════════════════════

  function renderUserBadge() {
    var user = OrbAuth.getCurrentUser();
    if (!user) return;
    var role = OrbAuth.ROLES[user.role] || { label: user.role, color: '#7A7A9D' };
    var isGuest = user.id === 'GUEST' || user.role === 'guest';

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
          var banner = document.getElementById('guest-banner');
          if (banner) banner.remove();
          showAuthModal();
          return;
        }
        var existing = document.getElementById('profile-dropdown');
        if (existing) { existing.remove(); return; }

        var dd = document.createElement('div');
        dd.id = 'profile-dropdown';
        dd.style.cssText = 'position:absolute;top:calc(100% + 8px);right:0;background:#061525;border:1px solid rgba(79,195,247,0.25);border-radius:12px;padding:16px;min-width:220px;z-index:100000;box-shadow:0 12px 40px rgba(0,0,0,.5);';

        var canManage = OrbAuth.hasPermission('canManageUsers');
        var adminLink = canManage ?
          '<a href="' + (window.location.pathname.indexOf('/') > 0 ? '../' : '') + 'admin.html" style="display:block;padding:8px 12px;border-radius:7px;background:rgba(255,45,138,.08);border:1px solid rgba(255,45,138,.2);color:#FF85C0;font-size:11px;font-weight:600;text-decoration:none;margin-bottom:6px;text-align:center;transition:all .15s;">Управление доступами &#8594;</a>' : '';

        var productsSection = buildProductsSection(user);

        dd.innerHTML =
          '<div style="font-size:13px;font-weight:700;color:#fff;margin-bottom:2px;">' + escH(user.name) + '</div>' +
          '<div style="font-size:11px;color:#7A9DB8;margin-bottom:4px;">' + escH(user.email) + '</div>' +
          '<div style="display:flex;gap:4px;margin-bottom:12px;">' +
            '<span style="font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(79,195,247,.1);color:' + role.color + ';font-weight:700;">' + role.label + '</span>' +
            (user.team ? '<span style="font-size:9px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,.04);color:#7A9DB8;">' + escH(user.team) + '</span>' : '') +
          '</div>' +
          adminLink +
          productsSection +
          '<button onclick="OrbAuth.logout();location.reload();" style="width:100%;padding:8px;background:transparent;border:1px solid rgba(255,255,255,.08);border-radius:7px;color:#7A9DB8;font-size:11px;cursor:pointer;margin-top:12px;">Выйти</button>';

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

  // ═══════════════════════════════════════════════
  // МОИ ПРОДУКТЫ (W4-021)
  // ═══════════════════════════════════════════════

  function getBasePath() {
    var path = window.location.pathname;
    var parts = path.split('/');
    var filename = parts.pop() || '';
    var dir = parts.join('/');
    // Если страница в подпапке (не в корне) — нужен ../
    // Определяем по наличию nav.js с src="../nav.js"
    var navScript = document.querySelector('script[src*="nav.js"]');
    if (navScript) {
      var src = navScript.getAttribute('src') || '';
      return src.replace(/nav\.js$/, '');
    }
    return '';
  }

  function buildProductsSection(user) {
    if (!user) return '';
    var role = user.role;

    // guest / lead — не показываем
    if (role === 'guest' || role === 'lead') return '';

    var basePath = getBasePath();
    var html = '';

    // Стили секции
    var sectionStyle = 'border-top:1px solid rgba(255,255,255,0.06);margin-top:12px;padding-top:12px;';
    var titleStyle = 'font-size:9px;text-transform:uppercase;color:var(--muted,#7A9DB8);letter-spacing:1.2px;margin-bottom:8px;font-weight:600;';
    var itemStyle = 'display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-bottom:1px solid rgba(255,255,255,0.04);text-decoration:none;border-radius:6px;transition:background .15s;';
    var nameStyle = 'font-size:12px;color:#E8E8F0;';
    var countStyle = 'font-size:10px;color:var(--muted,#7A9DB8);white-space:nowrap;margin-left:8px;';

    // admin / pmo_lead — ссылка на реестр
    if (role === 'admin' || role === 'pmo_lead') {
      html += '<div style="' + sectionStyle + '">' +
        '<div style="' + titleStyle + '">Продукты</div>' +
        '<a href="' + basePath + 'business.html" style="' + itemStyle + '" ' +
          'onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'none\'">' +
          '<span style="' + nameStyle + '">Все продукты</span>' +
          '<span style="' + countStyle + '">реестр &#8594;</span>' +
        '</a>' +
      '</div>';
      return html;
    }

    // pm / pmo — загружаем продукты и инициативы
    var products = (window.PT && PT.load(PT.KEY_PRODUCTS)) || [];
    var backlog = (window.PT && PT.load(PT.KEY_BACKLOG)) || [];

    var userProductIds = [];
    if (role === 'pmo') {
      // PMO — все продукты
      userProductIds = products.map(function(p) { return p.id; });
    } else if (role === 'pm') {
      // PM — по assignments
      if (user.assignments && user.assignments.length) {
        for (var i = 0; i < user.assignments.length; i++) {
          userProductIds.push(user.assignments[i].productId);
        }
      }
      // Обратная совместимость — productIds
      if (user.productIds && user.productIds.length) {
        for (var j = 0; j < user.productIds.length; j++) {
          if (userProductIds.indexOf(user.productIds[j]) < 0) {
            userProductIds.push(user.productIds[j]);
          }
        }
      }
    }

    if (userProductIds.length === 0) return '';

    // Считаем активные инициативы по продуктам
    var initCounts = {};
    for (var b = 0; b < backlog.length; b++) {
      var item = backlog[b];
      if (item.status === 'wip' || item.status === 'planned') {
        var pid = item.productId || '';
        if (!initCounts[pid]) initCounts[pid] = 0;
        initCounts[pid]++;
      }
    }

    // Собираем карточки продуктов
    var productItems = '';
    for (var k = 0; k < userProductIds.length; k++) {
      var prodId = userProductIds[k];
      var prod = null;
      for (var m = 0; m < products.length; m++) {
        if (products[m].id === prodId) { prod = products[m]; break; }
      }
      var prodName = prod ? (prodId + ' \u00b7 ' + escH(OrbAuth.getDisplayName(prod, 'product'))) : prodId;
      var cnt = initCounts[prodId] || 0;
      var cntText = cnt > 0 ? (cnt + ' ' + pluralInit(cnt)) : 'нет инициатив';

      productItems += '<a href="' + basePath + 'product-card.html?id=' + encodeURIComponent(prodId) + '" style="' + itemStyle + '" ' +
        'onmouseover="this.style.background=\'rgba(255,255,255,0.04)\'" onmouseout="this.style.background=\'none\'">' +
        '<span style="' + nameStyle + '">' + prodName + '</span>' +
        '<span style="' + countStyle + '">' + cntText + '</span>' +
      '</a>';
    }

    html += '<div style="' + sectionStyle + '">' +
      '<div style="' + titleStyle + '">Мои продукты</div>' +
      '<div style="max-height:200px;overflow-y:auto;">' + productItems + '</div>' +
    '</div>';

    return html;
  }

  function pluralInit(n) {
    var mod10 = n % 10;
    var mod100 = n % 100;
    if (mod10 === 1 && mod100 !== 11) return 'инициатива';
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'инициативы';
    return 'инициатив';
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
    return '<button onclick="document.getElementById(\'auth-modal\').innerHTML=renderChoiceStep()" style="' + btnGhost() + 'margin-top:8px;">&#8592; Назад</button>';
  }

  // Выносим renderChoiceStep в глобал для кнопки «Назад»
  window.renderChoiceStep = renderChoiceStep;

  function btnPrimary() {
    return 'width:100%;padding:12px;background:linear-gradient(135deg,#00D4B4,#4FC3F7);border:none;border-radius:10px;color:#fff;font-family:Orbitron,sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:opacity .15s;';
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
