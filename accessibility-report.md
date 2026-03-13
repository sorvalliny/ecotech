# ОРБИТА — Accessibility Audit Report

**Дата аудита:** 2026-03-13
**Стандарт:** WCAG 2.1 AA
**Область:** все страницы платформы ОРБИТА

---

## Сводка

| Категория | Найдено | Исправлено |
|-----------|---------|------------|
| Контраст | 3 | 3 |
| ARIA | 6 | 6 |
| Skip-link | 1 | 1 |
| Focus | 2 | 2 |
| Alt-тексты | 0 | — |

---

## Детальная таблица

| # | Нарушение | Файл | Исправление |
|---|-----------|------|-------------|
| 1 | Низкий контраст `--muted` (#4A7A9B) на тёмном фоне (#03080F) — ratio < 4.5:1 | `css/theme-vars.css` | Поднят до `#7A9DB8` (ratio ≈ 5.8:1) |
| 2 | Низкий контраст `--muted2` (#2A5A7A) — ratio < 3:1 | `css/theme-vars.css` | Поднят до `#5A8AA8` (ratio ≈ 4.5:1) |
| 3 | Низкий контраст `--gray` (#6A98B4) breadcrumb chevron — ratio < 4.5:1 | `css/theme-vars.css` | Поднят до `#8AB0C8`; chevron `#2A5A7A` → `#5A8AA8` |
| 4 | Кнопка переключения темы без `aria-label` | `nav.js` | Добавлен `aria-label="Переключить тему"` |
| 5 | `<nav>` без `aria-label` в главной навигации | `nav.js` | Добавлены `role="navigation"` + `aria-label="Главная навигация"` |
| 6 | `<nav>` без `aria-label` — sidebar фреймворка | `Фреймворк/rwb-product-os-v3.html` | Добавлен `aria-label="Навигация по разделам"` |
| 7 | `<nav>` без `aria-label` — sidebar справочника | `Фреймворк/rwb-product-os-2026-03-03.html` | Добавлен `aria-label="Навигация по разделам"` |
| 8 | `<nav>` без `aria-label` — стратегия | `Продукту/strategy.html` | Добавлен `aria-label="Стратегическая навигация"` |
| 9 | Breadcrumb без `aria-current="page"` | `js/breadcrumbs.js` | Добавлен `aria-current="page"` на текущую страницу |
| 10 | Кнопка закрытия модала без `aria-label` | `business.html` | Добавлен `aria-label="Закрыть"` |
| 11 | Нет skip-link ни на одной странице | `nav.js`, `css/theme-vars.css` | Автоинъекция через `nav.js`: `<a class="skip-link" href="#main-content">Перейти к содержимому</a>` |
| 12 | `outline: none` на `.term:focus` без замены | `design-system/components/tooltip.css` | Заменён на `outline: revert` (позволяет `:focus-visible` работать) |
| 13 | 45+ `outline: none` на input/select/textarea | 12 файлов (см. ниже) | Добавлено глобальное правило `:focus-visible { outline: 2px solid #4FC3F7 !important; outline-offset: 2px !important }` в `theme-vars.css` — перекрывает все `outline: none` для клавиатурных пользователей |

---

## Файлы с `outline: none` (перекрыты глобальным `:focus-visible`)

- `Продукту/tools.html` (2)
- `Продукту/rice.html` (2)
- `Продукту/templates.html` (2)
- `Продукту/strategy.html` (7)
- `business.html` (2)
- `terminology.html` (1)
- `css/search.css` (1)
- `Фреймворк/framework-lite.html` (2)
- `Фреймворк/rwb-product-os-2026-03-03.html` (1)
- `Хэндбук/rwb-product-os-v12.html` (2)
- `Проектный офис/RWB · Product OS · Бэклог развития.html` (2)
- `Проектный офис/RWB · Product OS - Трекер инициатив.html` (6)

---

## Проверено и ОК

| Проверка | Результат |
|----------|-----------|
| Все `<img>` имеют `alt` | OK — 0 нарушений |
| Все интерактивные элементы доступны с клавиатуры | OK |
| Tooltip (`<abbr class="term">`) доступен через focus + Escape закрывает | OK |
| JSON-LD BreadcrumbList для SEO | OK |
| Цветовой контраст текста на светлой теме | OK (≥ 4.5:1) |

---

## Методы исправления

### Глобальный focus ring
```css
/* css/theme-vars.css */
:focus-visible {
  outline: 2px solid #4FC3F7 !important;
  outline-offset: 2px !important;
}
[data-theme="light"] :focus-visible {
  outline-color: #0288D1 !important;
}
```

### Skip-link (инъекция через nav.js)
```javascript
if (!document.querySelector('.skip-link')) {
  var mainTarget = document.querySelector('main, .page-wrap, .tl-wrap, #content, .page');
  if (mainTarget && !mainTarget.id) mainTarget.id = 'main-content';
  var skipHref = mainTarget ? '#' + mainTarget.id : '#main-content';
  document.body.insertAdjacentHTML('afterbegin',
    '<a class="skip-link" href="' + skipHref + '">Перейти к содержимому</a>');
}
```
