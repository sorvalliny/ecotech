/**
 * ОРБИТА — Onboarding Tours (Shepherd.js)
 * Auto-starts on first visit, restartable via header button.
 * Tours: 'business' (5 steps), 'product' (7 steps).
 */
(function () {
  'use strict';

  // Wait for Shepherd to load
  if (typeof Shepherd === 'undefined') return;

  // ── Tour definitions ──────────────────────────────────────

  var TOURS = {
    business: {
      key: 'tour-done-business',
      steps: [
        {
          title: 'Добро пожаловать в ОРБИТУ',
          text: 'ОРБИТА — операционная система для управления продуктовым портфелем экосистемы RWB. Здесь вы видите общую картину: какие продукты строятся, в каком статусе и куда движутся.',
          attachTo: { element: '.hero-section', on: 'bottom' }
        },
        {
          title: 'Презентация для бизнеса',
          text: 'Слайд-дек с ключевой информацией: миссия, сегменты (B2C/B2B/B2G), Gate-система и метрики. Используйте стрелки или клавиатуру для навигации. Кнопка PDF — для скачивания.',
          attachTo: { element: '.slides-wrapper', on: 'top' }
        },
        {
          title: 'Портфель продуктов',
          text: 'Карточки продуктов показывают название, Gate-стадию, статус и ключевые метрики. Кликните на карточку, чтобы увидеть детали: KPI, владельца и активные инициативы.',
          attachTo: { element: '.products-section', on: 'top' }
        },
        {
          title: 'Фильтры по статусу',
          text: 'Цветовое кодирование статусов: <b>On Track</b> (зелёный) — всё по плану, <b>At Risk</b> (красный) — требует внимания, <b>Paused</b> (жёлтый) — на паузе, <b>Done</b> — завершён. Используйте фильтры для быстрой навигации.',
          attachTo: { element: '.products-filters', on: 'bottom' }
        },
        {
          title: 'Поиск и навигация',
          text: 'Нажмите <kbd>Cmd+K</kbd> для глобального поиска по всей платформе. В верхнем меню — быстрый доступ к разделам «Бизнесу» и «Продукту».',
          attachTo: { element: '.ecotech-nav', on: 'bottom' }
        }
      ]
    },

    product: {
      key: 'tour-done-product',
      steps: [
        {
          title: 'ОРБИТА для продуктовых команд',
          text: 'Здесь собраны все инструменты для запуска и развития продуктов экосистемы: фреймворк, шаблоны, трекер и поддержка Проектного офиса.',
          attachTo: { element: '.hero-section', on: 'bottom' }
        },
        {
          title: 'Gate 0 → 5: Продуктовый фреймворк',
          text: 'Единый жизненный цикл продукта — от идеи (Gate 0) до масштабирования (Gate 5). Каждая стадия имеет чёткие критерии, артефакты и чек-лист для прохождения Gate-ревью.',
          attachTo: { element: '.hero-cta', on: 'top' }
        },
        {
          title: 'Стадии зрелости',
          text: 'Орбитальная визуализация показывает ключевые этапы: от первичного скрининга до масштабирования. Каждая «планета» — это группа активностей на определённой стадии.',
          attachTo: { element: '.orbit-wrap', on: 'left' }
        },
        {
          title: 'RICE-приоритизация',
          text: 'Оценивайте инициативы по методологии RICE: Reach (охват), Impact (влияние), Confidence (уверенность), Effort (трудозатраты). Калькулятор доступен в разделе «Инструменты».',
          attachTo: { element: '.hero-content', on: 'right' }
        },
        {
          title: 'Шаблоны и артефакты',
          text: 'Готовые шаблоны для каждой стадии: Product Brief, CustDev-гайд, PRD, Go-to-Market план. Не нужно изобретать формат — берите шаблон и заполняйте.',
          attachTo: { element: '.hero-sub', on: 'bottom' }
        },
        {
          title: 'Трекер и Проектный офис',
          text: 'Трекер инициатив отслеживает прогресс всех продуктов портфеля. Проектный офис проводит Gate-ревью, помогает с методологией и координирует ресурсы.',
          attachTo: { element: '.hero-eyebrow', on: 'bottom' }
        },
        {
          title: 'Поиск и быстрая навигация',
          text: 'Нажмите <kbd>Cmd+K</kbd> для мгновенного поиска. В меню «Продукту» — полный список доступных инструментов, от фреймворка до глоссария.',
          attachTo: { element: '.ecotech-nav', on: 'bottom' }
        }
      ]
    }
  };

  // ── Detect tour type from page ────────────────────────────
  function detectTour() {
    var path = window.location.pathname.toLowerCase();
    if (path.indexOf('business') !== -1 || path.indexOf('бизнесу') !== -1) return 'business';
    if (path.indexOf('product') !== -1 || path.indexOf('продукту') !== -1) return 'product';
    return null;
  }

  // ── Build progress dots HTML ──────────────────────────────
  function progressDots(total, current) {
    var html = '<span class="tour-progress">';
    for (var i = 0; i < total; i++) {
      html += '<span class="tour-dot' + (i === current ? ' active' : '') + '"></span>';
    }
    html += '</span>';
    return html;
  }

  // ── Create and configure Shepherd tour ────────────────────
  function createTour(tourName) {
    var def = TOURS[tourName];
    if (!def) return null;

    var tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        scrollTo: { behavior: 'smooth', block: 'center' },
        modalOverlayOpeningPadding: 8,
        modalOverlayOpeningRadius: 12
      }
    });

    var total = def.steps.length;

    def.steps.forEach(function (step, idx) {
      var isFirst = idx === 0;
      var isLast = idx === total - 1;

      var buttons = [];

      if (!isFirst) {
        buttons.push({
          text: '← Назад',
          classes: 'shepherd-button-secondary',
          action: tour.back
        });
      }

      buttons.push({
        text: isLast ? 'Завершить ✓' : 'Далее →',
        classes: 'shepherd-button-primary',
        action: isLast ? tour.complete : tour.next
      });

      var stepText =
        '<span class="tour-step-counter">' + (idx + 1) + ' из ' + total + '</span>' +
        step.text;

      tour.addStep({
        title: step.title,
        text: stepText,
        attachTo: step.attachTo,
        buttons: buttons,
        when: {
          show: function () {
            // Update progress dots in footer
            var footer = this.el && this.el.querySelector('.shepherd-footer');
            if (footer) {
              var existing = footer.querySelector('.tour-progress');
              if (existing) existing.remove();
              footer.insertAdjacentHTML('afterbegin', progressDots(total, tour.steps.indexOf(this)));
            }
          }
        }
      });
    });

    tour.on('complete', function () {
      try { localStorage.setItem(def.key, '1'); } catch (e) {}
    });

    tour.on('cancel', function () {
      try { localStorage.setItem(def.key, '1'); } catch (e) {}
    });

    return tour;
  }

  // ── Inject "Start Tour" button into nav ───────────────────
  function injectButton(tourName) {
    var nav = document.querySelector('.ecotech-nav');
    if (!nav || nav.querySelector('.tour-start-btn')) return;

    var btn = document.createElement('button');
    btn.className = 'tour-start-btn';
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' +
      '</svg>' +
      'Тур';
    btn.title = 'Начать обзорный тур';

    // Insert before theme toggle
    var themeBtn = nav.querySelector('.en-theme-btn');
    if (themeBtn) {
      nav.insertBefore(btn, themeBtn);
    } else {
      nav.appendChild(btn);
    }

    btn.addEventListener('click', function () {
      var tour = createTour(tourName);
      if (tour) tour.start();
    });
  }

  // ── Init ──────────────────────────────────────────────────
  function init() {
    var tourName = detectTour();
    if (!tourName) return;

    injectButton(tourName);

    // Auto-start on first visit
    var def = TOURS[tourName];
    var done = false;
    try { done = localStorage.getItem(def.key) === '1'; } catch (e) {}

    if (!done) {
      // Small delay to let page render fully
      setTimeout(function () {
        var tour = createTour(tourName);
        if (tour) tour.start();
      }, 800);
    }
  }

  // Wait for nav.js to inject the nav bar
  if (document.querySelector('.ecotech-nav')) {
    init();
  } else {
    var obs = new MutationObserver(function (_, o) {
      if (document.querySelector('.ecotech-nav')) {
        o.disconnect();
        init();
      }
    });
    if (document.body) {
      obs.observe(document.body, { childList: true, subtree: true });
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        if (document.querySelector('.ecotech-nav')) {
          init();
        } else {
          obs.observe(document.body, { childList: true, subtree: true });
        }
      });
    }
  }
})();
