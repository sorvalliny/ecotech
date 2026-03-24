---
name: project_framework_redesign
description: Дизайн-спецификация нового интерфейса раздела "Как мы работаем" в ОРБИТА — архитектура, компоненты, wireframes
type: project
---

Раздел "Как мы работаем" (/ecotech/framework.html) получил полную дизайн-спецификацию.

Ключевые решения:

1. **Замена 12 аккордеонов на 4 таба**: Стадия X / Gate Review / Процессы / Справка
2. **Stage Progress Bar** как центральный навигационный элемент — узлы стадий O·0–O·5 с состояниями completed/current/future
3. **Context Card** (hero zone) — персонализированная для роли: PM видит Gate-таймер и артефакты, CEO видит портфель и блокеры
4. **Gate как inline checkpoint** между стадиями, не отдельный раздел
5. **Role Pills** (pill-tabs) в sticky context bar — переключение без перезагрузки
6. **Stage Triple Card** структура: Discovery / Delivery / Retro внутри каждой стадии
7. **Inline артефакты** — шаблоны прямо в карточке стадии, не в отдельном разделе
8. Солнечная система сохраняется как виджет выбора типа сущности

Wireframes созданы для PM (O·2), CEO BU (портфель), PMO Lead (операционный).

Цветовая система: стадии через --c0..--c5 уже существует, семантика закреплена.
Новые компоненты: Stage Progress Bar, Context Card, Stage Triple Card, Gate Inline Checkpoint, Role Pills, Portfolio Heatmap Row, Artifact Chip (с состояниями).

**Why:** 12 аккордеонов не показывают связи, нет ролевой нити, Gate оторван от стадий, шаблоны спрятаны в отдельном разделе.
**How to apply:** При реализации HTML — структура должна следовать табам, не аккордеонам. Солнечная система остаётся вверху как switcher.
