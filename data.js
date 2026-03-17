// ─────────────────────────────────────────────────────────────────
// data.js — авто-генерируется из data.json командой: python3 sync.py
// Последнее обновление: 2026-03-02
// ─────────────────────────────────────────────────────────────────
window.ECOTECH_DATA = {
  "_meta": {
    "version": "1.0",
    "updated": "2026-03-02",
    "description": "ОРБИТА — единый источник данных. Редактируй этот файл, затем открой index.html."
  },
  "platform": {
    "name": "ОРБИТА",
    "org": "Проектный офис · WB Экосистема",
    "tagline": "Система роста для продуктов и инициатив",
    "description": "Единый фреймворк, инструменты и стандарты — чтобы строить продукты предсказуемо, масштабируемо и с поддержкой на каждом этапе.",
    "contact_email": "sorval.viktor@rwb.ru",
    "period": "Март 2026"
  },
  "stats": [
    {
      "value": "8",
      "label": "модулей в платформе"
    },
    {
      "value": "10+",
      "label": "продуктов в портфеле"
    },
    {
      "value": "G0→1",
      "label": "текущий этап пилота"
    },
    {
      "value": "6",
      "label": "участников рабочей группы"
    }
  ],
  "pilot": {
    "active": true,
    "badge": "Ранний этап тестирования",
    "title": "Образовательный контур — первые команды в платформе",
    "description": "Образовательные продукты Экосистемы проходят пилотный цикл по Gate-модели. Цель — отработать фреймворк, инструменты и процесс Gate-review на реальных командах до масштабирования на весь портфель.",
    "current_gate": "G0→1"
  },
  "modules": [
    {
      "code": "PR01",
      "name": "Фреймворк",
      "desc": "Gate-модель G0–G6, критерии перехода, RICE-приоритизация",
      "status": "ready",
      "status_label": "Готов",
      "color": "#34D399",
      "color_class": "green",
      "link": null
    },
    {
      "code": "PR02",
      "name": "Хэндбук",
      "desc": "Документация, гайды и шаблоны артефактов для команд",
      "status": "in_progress",
      "status_label": "В работе",
      "color": "#34D399",
      "color_class": "green",
      "link": null
    },
    {
      "code": "PR03",
      "name": "Лендинг",
      "desc": "Витрина платформы — точка входа для команд и новых инициатив",
      "status": "in_progress",
      "status_label": "В работе",
      "color": "#34D399",
      "color_class": "green",
      "link": "business.html"
    },
    {
      "code": "PR04",
      "name": "Трекер",
      "desc": "Инструмент отслеживания прогресса по Gate-модели",
      "status": "design",
      "status_label": "Проработка",
      "color": "#5C7AFF",
      "color_class": "blue",
      "link": "Проектный офис/tracker.html"
    },
    {
      "code": "PR05",
      "name": "Реестр",
      "desc": "Интеграция Shiva (командный) ↔ WB Tracker (PMO/портфель)",
      "status": "architecture",
      "status_label": "Архитектура",
      "color": "#5C7AFF",
      "color_class": "blue",
      "link": null
    },
    {
      "code": "PR06",
      "name": "ProductHunt",
      "desc": "Поиск и каталог инициатив и продуктовых идей Экосистемы",
      "status": "backlog",
      "status_label": "Backlog",
      "color": "#64748B",
      "color_class": "gray",
      "link": null
    },
    {
      "code": "PR07",
      "name": "Образовательный модуль",
      "desc": "Онбординг команд, обучение стандартам, база знаний для инициатив",
      "status": "planning",
      "status_label": "В проработке",
      "color": "#F59E0B",
      "color_class": "orange",
      "link": null
    },
    {
      "code": "PR08",
      "name": "Апгрейд найма",
      "desc": "Целевой найм в команды продуктов и новые инициативы Экосистемы",
      "status": "planning",
      "status_label": "В проработке",
      "color": "#A78BFA",
      "color_class": "purple",
      "link": null
    }
  ],
  "gate_model": [
    {
      "code": "G0",
      "name": "Заявка",
      "desc": "Гипотеза, первичный анализ рынка и боли",
      "color": "#64748B"
    },
    {
      "code": "G1",
      "name": "Концепция",
      "desc": "Описание продукта, целевая аудитория, RICE",
      "color": "#3B82F6"
    },
    {
      "code": "G2",
      "name": "Прототип",
      "desc": "MVP-гипотеза, первые тесты с пользователем",
      "color": "#8B5CF6"
    },
    {
      "code": "G3",
      "name": "Разработка",
      "desc": "Полноценный продукт, команда, дорожная карта",
      "color": "#F59E0B"
    },
    {
      "code": "G4",
      "name": "Разгон",
      "desc": "Выход на рынок, первые метрики роста",
      "color": "#F97316"
    },
    {
      "code": "G5",
      "name": "Экосистема",
      "desc": "Устойчивый рост, зрелый продукт",
      "color": "#34D399"
    }
  ],
  "portfolio": [
    {
      "code": "EDU-0",
      "name": "ОРБИТА (ДЕМО)",
      "meta": "Платформа развития Экосистемы",
      "type": "platform",
      "pilot": false
    },
    {
      "code": "EDU",
      "name": "Образовательный контур",
      "meta": "Образовательные продукты · Gate 0→1",
      "type": "active",
      "pilot": true
    },
    {
      "code": "ECO-1",
      "name": "Маркетплейс К",
      "meta": "Продукт Экосистемы",
      "type": "active",
      "pilot": false
    },
    {
      "code": "ECO-2",
      "name": "Генератор О",
      "meta": "Продукт Экосистемы",
      "type": "active",
      "pilot": false
    },
    {
      "code": "ECO-3",
      "name": null,
      "meta": "Добавить →",
      "type": "tbd",
      "pilot": false
    },
    {
      "code": "ECO-4",
      "name": null,
      "meta": "Добавить →",
      "type": "tbd",
      "pilot": false
    },
    {
      "code": "ECO-5",
      "name": null,
      "meta": "Добавить →",
      "type": "tbd",
      "pilot": false
    },
    {
      "code": "ECO-6+",
      "name": "+ ещё продукты",
      "meta": "Портфель 10+ продуктов",
      "type": "tbd",
      "pilot": false
    }
  ],
  "slides": [
    {
      "num": 1,
      "file": "slides_temp/slide01.html",
      "title": "Титул"
    },
    {
      "num": 2,
      "file": "slides_temp/slide02.html",
      "title": "Аудитории"
    },
    {
      "num": 3,
      "file": "slides_temp/slide03.html",
      "title": "Роль"
    },
    {
      "num": 4,
      "file": "slides_temp/slide04.html",
      "title": "3 шага"
    },
    {
      "num": 5,
      "file": "slides_temp/slide05.html",
      "title": "Скорость"
    },
    {
      "num": 6,
      "file": "slides_temp/slide06.html",
      "title": "Стадии"
    },
    {
      "num": 7,
      "file": "slides_temp/slide07.html",
      "title": "Вместе"
    },
    {
      "num": 8,
      "file": "slides_temp/slide08.html",
      "title": "Дашборд"
    },
    {
      "num": 9,
      "file": "slides_temp/slide09.html",
      "title": "Путь"
    },
    {
      "num": 10,
      "file": "slides_temp/slide10.html",
      "title": "CTA"
    }
  ],
  "navigation": [
    {
      "section": "",
      "label": "Войдите в платформу",
      "items": [
        {
          "code": "🏢 Бизнесу",
          "title": "Для бизнеса",
          "desc": "Прозрачность портфеля, контроль рисков и основа для инвестиционных решений на каждом Gate-этапе.",
          "status_label": "Готово",
          "status_class": "st-green",
          "color": "linear-gradient(90deg, #5C7AFF, #A78BFA)",
          "link": "business.html"
        },
        {
          "code": "⚡ Продукту",
          "title": "Для продукта",
          "desc": "Фреймворк, шаблоны артефактов, трекер и поддержка Проектного офиса на всех этапах Gate-модели.",
          "status_label": "Готово",
          "status_class": "st-green",
          "color": "linear-gradient(90deg, #34D399, #5C7AFF)",
          "link": "product.html"
        }
      ]
    }
  ]
};
