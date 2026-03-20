# ОРБИТА — Платформа управления продуктовым портфелем

Система управления портфелем цифровых решений экосистемы RWB.

## Деплой

https://sorvalliny.github.io/ecotech/

## Стек

- Vanilla HTML / CSS / JS
- Self-hosted Inter (fonts/)
- 0 внешних CDN-зависимостей
- GitHub Pages (main → deploy)

## Структура

```
ecotech/
├── index.html              — главная (точка входа)
├── business.html           — каталог продуктов
├── product.html            — хаб для команды
├── product-card.html       — карточка продукта (workspace PM)
├── admin.html              — администрирование
├── dashboard.html          — статус портфеля
├── terminology.html        — глоссарий
│
├── Проектный офис/
│   └── tracker.html        — реестр (мониторинг портфеля)
│
├── Продукту/
│   ├── index.html          — онбординг команды
│   ├── brief.html          — бриф + RICE
│   ├── gate-checklist.html — Gate-чеклист
│   ├── strategy.html       — стратегическое планирование
│   ├── templates.html      — шаблоны артефактов
│   └── tools.html          — инструменты
│
├── Фреймворк/
│   └── framework-lite.html — как мы работаем (методология)
│
├── Хэндбук/
│   ├── roles.html          — матрица ролей
│   ├── planning.html       — процесс планирования
│   ├── impact-model.html   — модель влияния
│   └── ai-integration.html — AI-интеграция
│
├── design-system.css       — дизайн-система
├── css/theme-vars.css      — темы (light/dark)
├── nav.js                  — навигация
├── platform.js             — bridge (localStorage, helpers)
├── js/auth.js              — авторизация и роли
└── fonts/                  — Inter (self-hosted)
```

## Связанные проекты

- **PMO Экосистемы**: [sorvalliny/pmo-ecosys](https://github.com/sorvalliny/pmo-ecosys) (стратегия, агенты, документы)
