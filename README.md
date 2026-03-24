# ОРБИТА — Платформа управления продуктовым портфелем

Система управления портфелем цифровых решений экосистемы RWB.

## Стек

- Vanilla HTML / CSS / JS
- Self-hosted Inter (fonts/)
- GitHub Pages (main → deploy)

## Зависимости

Все зависимости хранятся локально в `js/`:

| Библиотека | Версия | Назначение |
|------------|--------|------------|
| [Fuse.js](https://www.fusejs.io/) | 7.0.0 | Нечёткий поиск по каталогу |
| [SheetJS (XLSX)](https://sheetjs.com/) | 0.18.5 | Экспорт/импорт Excel в стратегическом планировании |

## Структура

```
ecotech/
├── index.html              — главная (точка входа)
├── catalog.html            — каталог продуктов
├── workspace.html          — рабочее пространство продукта
├── admin.html              — администрирование
├── calendar.html           — календарь
├── committees.html         — комитеты
├── framework.html          — методология (фреймворк)
├── glossary.html           — глоссарий
├── org-structure.html      — оргструктура
├── registry.html           — реестр продуктов
├── teams.html              — команды
│
├── tools/
│   ├── index.html          — инструменты (хаб)
│   ├── brief.html          — бриф + RICE
│   ├── gate-checklist.html — Gate-чеклист
│   ├── strategy.html       — стратегическое планирование
│   ├── templates.html      — шаблоны артефактов
│   └── onboarding.html     — онбординг команды
│
├── knowledge/
│   ├── roles.html          — матрица ролей
│   ├── planning.html       — процесс планирования
│   ├── impact-model.html   — модель влияния
│   ├── ai-integration.html — интеграция с ИИ
│   └── cjm-roles.html      — CJM ролей
│
├── css/                    — стили
├── js/                     — скрипты и библиотеки
├── data/                   — данные (JSON)
├── fonts/                  — Inter (self-hosted)
├── design-system.css       — дизайн-система
├── nav.js                  — навигация
├── platform.js             — bridge (localStorage, helpers)
├── stages.js               — логика стадий
└── icons.js                — SVG-иконки
```

## Деплой

GitHub Pages из ветки `main`.
