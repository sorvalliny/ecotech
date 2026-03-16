# DATA CONTRACT — Единые схемы данных ОРБИТА
## Версия: 1.1 | 16 марта 2026

Этот документ — источник истины для всех инструментов платформы.
Любой инструмент, который читает или пишет в localStorage, ОБЯЗАН следовать этим схемам.

---

## Принцип: ОРБИТА ≠ трекер задач

ОРБИТА управляет **портфелем и стратегией**. Команды работают в **YouTrack / WB Tracker / Shiva**.

```
ОРБИТА (стратегический уровень)           YouTrack / Shiva (операционный)
├─ Продукт (Орбита, Gate, метрики)        ├─ Эпик (= Инициатива из ОРБИТА)
├─ Цель (OKR + Key Results)               ├─ Story
├─ Инициатива (RICE, фаза)                ├─ Task
│                                          └─ Sprint
└── связь через trackerUrl / trackerType
```

**ОРБИТА НЕ делает:** спринты, stories, tasks, CI/CD.
**ОРБИТА делает:** портфель, Gate Review, OKR, RICE, метрики здоровья, онбординг.

---

## Принцип: Трекер = единый реестр

```
brief.html → создаёт инициативу → ECOTECH_BACKLOG → трекер показывает
rice.html  → обновляет RICE     → ECOTECH_BACKLOG → трекер показывает
strategy   → создаёт продукт    → ECOTECH_PRODUCTS → трекер показывает
strategy   → создаёт цели       → ECOTECH_GOALS    → трекер показывает
business   → читает продукты    → ECOTECH_PRODUCTS → витрина показывает
checklist  → сохраняет прогресс → ECOTECH_GATE_CHECKLIST → трекер может показать
```

---

## ECOTECH_PRODUCTS

Массив продуктов экосистемы.

```javascript
{
  id: string,            // "P01", "P02", "SP01" — уникальный
  name: string,          // "WB Kids"
  desc: string,          // краткое описание
  gate: number,          // 0–6 (текущая Орбита)
  status: string,        // "on-track" | "at-risk" | "blocked" | "paused" | "done"
  cat: string,           // "b2b" | "b2c" | "b2g" | "internal"
  catLabel: string,      // "B2B" | "B2C" | "B2G" | "Internal"
  owner: string,         // "Имя Ф." — владелец продукта
  updated: string,       // "2026-03-16" — ISO дата последнего обновления
  quarter: string,       // "Q1 2026" — текущий квартал
  color: string,         // CSS gradient или hex для карточки
  pilot: boolean,        // true если в пилотном контуре
  trackerUrl: string,    // "https://youtrack.rwb.ru/project/WB-KIDS" — ссылка на проект в трекере
  trackerType: string,   // "youtrack" | "shiva" | "wb-tracker" | "" — тип внешнего трекера
  kpi: [                 // массив ключевых метрик (0-5 шт)
    { icon: string, value: string, label: string }
  ],
  initiatives: [string]  // ID инициатив из ECOTECH_BACKLOG
}
```

**Кто пишет:**
- tracker — полная CRUD
- strategy.html addToTracker() — создание нового
- portfolio.json / data.json — seed при первом запуске (через PT.ensureProducts)

**Кто читает:**
- tracker — основной вид
- business.html — витрина портфеля
- strategy.html — привязка стратегии к продукту
- rice.html — dropdown выбора продукта
- gate-checklist.html — dropdown выбора продукта

---

## ECOTECH_BACKLOG

Массив инициатив (единиц работы).

```javascript
{
  id: string,            // "BRIEF-LX1ABC", "I001" — уникальный
  name: string,          // название инициативы
  desc: string,          // описание проблемы / задачи
  productId: string,     // ID продукта из ECOTECH_PRODUCTS ("P01")
                         // ВАЖНО: не название, не "New", а ID
  track: string,         // "discovery" | "delivery" | "review"
                         // discovery = фаза Исследование
                         // delivery = фаза Разработка
                         // review = фаза Оценка и ретро
  status: string,        // "backlog" | "planned" | "wip" | "done"
  r: number,             // RICE Reach 1–10
  i: number,             // RICE Impact 1–10
  c: number,             // RICE Confidence 1–10
  e: number,             // RICE Effort 1–10
  cat: string,           // "feature" | "design" | "content" | "process" | "tooling" | "infra"
                         // опционально, для фильтрации
  goalId: string|null,   // ID цели из ECOTECH_GOALS
  epicId: string|null,   // ID эпика из ECOTECH_EPICS
  gate: number,          // 0–6, Gate при создании
  trackerUrl: string,    // "https://youtrack.rwb.ru/issue/WBKIDS-42" — ссылка на эпик в трекере
  brief: object|null,    // вложенный объект брифа (из brief.html)
  prd: object|null,      // вложенный объект PRD
  created: string,       // "2026-03-16" ISO дата создания
  updated: string        // "2026-03-16" ISO дата обновления
}
```

**Совместимость с legacy полем `project`:**
Трекер legacy использует `project` вместо `productId`. При миграции:
```javascript
// Читатели должны проверять оба поля:
var pid = item.productId || item.project || '';
```

**Кто пишет:**
- brief.html — создание новой инициативы (submitBrief)
- rice.html — обновление RICE (r, i, c, e)
- tracker — полная CRUD, привязка к целям/эпикам
- strategy.html — экспорт инициатив из roadmap

**Кто читает:**
- tracker — основной вид, фильтры, сортировка по RICE
- rice.html — список инициатив, RICE-калькулятор
- brief.html — проверка дублей (опционально)

---

## ECOTECH_GOALS

Массив целей (OKR).

```javascript
{
  id: string,            // "G001", "G002" — уникальный
  title: string,         // "Запустить 3 продукта через Gate 2"
  type: string,          // "strategic" | "product" | "operational"
  period: string,        // "Q1 2026" | "H1 2026" | "2026"
  owner: string,         // "CPO", "PM Name"
  status: string,        // "active" | "draft" | "achieved" | "cancelled"
  productId: string|null,// ID продукта (если цель привязана к конкретному продукту)
  keyResults: [
    {
      id: string,        // "KR1", "KR2"
      text: string,      // описание Key Result
      target: number,    // целевое значение
      current: number,   // текущее значение
      unit: string       // "команды", "ревью", "%"
    }
  ]
}
```

**Кто пишет:**
- tracker — CRUD целей
- strategy.html — ДОЛЖЕН писать сюда (сейчас пишет в ECOTECH_STRATEGY)

**Кто читает:**
- tracker — привязка инициатив к целям, прогресс KR
- strategy.html — отображение целей продукта

**ВАЖНО: strategy.html должен синхронизировать goals в ECOTECH_GOALS,
а не хранить отдельно в ECOTECH_STRATEGY.goals**

---

## ECOTECH_EPICS

Массив эпиков (квартальных deliverables).

```javascript
{
  id: string,            // "E001", "E002" — уникальный
  title: string,         // название эпика
  productId: string,     // ID продукта
  goalId: string|null,   // ID цели
  initiativeId: string|null, // ID инициативы из BACKLOG
  status: string,        // "backlog" | "active" | "done" | "cancelled"
  phase: string,         // "discovery" | "delivery" | "review"
  priority: number,      // 1 (high) | 2 (medium) | 3 (low)
  quarter: string,       // "Q1 2026"
  owner: string,         // ответственный
  dorDone: boolean,      // Definition of Ready выполнена
  dodDone: boolean       // Definition of Done выполнена
}
```

**Кто пишет:**
- tracker — CRUD эпиков
- strategy.html — ДОЛЖЕН писать сюда (сейчас пишет в ECOTECH_STRATEGY.quarterly)

**Кто читает:**
- tracker — список эпиков по продукту/инициативе

**ВАЖНО: strategy.html должен синхронизировать epics в ECOTECH_EPICS,
а не хранить отдельно в ECOTECH_STRATEGY.quarterly.items**

---

## ECOTECH_GATE_CHECKLIST

Чеклисты прохождения Gate по продуктам.

```javascript
{
  "[productId]": {
    "gate0": [true, false, true, ...],  // массив boolean по порядку критериев
    "gate1": [...],
    "gate2": [...],
    "gate3": [...],
    "gate4": [...],
    "gate5": [...],
    "gate6": [...]
  }
}
```

**Кто пишет:** gate-checklist.html
**Кто читает:** gate-checklist.html, трекер (опционально — показать % готовности Gate)

---

## ECOTECH_STRATEGY

Стратегия конкретного продукта. Хранит расширенные данные, которых нет в PRODUCTS/GOALS/EPICS.

```javascript
{
  identity: { name, stage, phase, status, pm, trackerUrl, trackerProductId },
  prd: { problem, audience, hypothesis, solution, northStar, metrics, ... },
  dorDod: { dorInit:[], dodInit:[], dorEpic:[], dodEpic:[], ... },
  changelog: []
}
```

**НЕ хранит goals, roadmap.initiatives, quarterly.epics** — они живут в ECOTECH_GOALS, ECOTECH_BACKLOG, ECOTECH_EPICS.

**Синхронизация при сохранении в strategy.html:**
```
saveState() {
  1. Сохранить identity, prd, dorDod → ECOTECH_STRATEGY
  2. Сохранить goals → ECOTECH_GOALS (merge по id)
  3. Сохранить roadmap items → ECOTECH_BACKLOG (merge по id)
  4. Сохранить quarterly items → ECOTECH_EPICS (merge по id)
  5. Обновить продукт → ECOTECH_PRODUCTS (gate, status)
}
```

---

## ECOTECH_BRIEF_DRAFT

Черновик брифа (один на браузер).

```javascript
{
  name: string,
  dept: string,
  date: string,
  fast_track: boolean,
  ft_reason: string,
  problem: string,
  audience: string,
  effect: string,
  okr: string,
  r: number, i: number, c: number, e: number,
  competitors: string,
  timeline: string,
  budget: string,
  constraints: string
}
```

**Кто пишет/читает:** только brief.html

---

## ECOTECH_TEMPLATES

Каталог шаблонов артефактов. Читает/пишет только templates.html. Формат стабилен.

---

## МИГРАЦИЯ LEGACY → НОВЫЙ ФОРМАТ

### Поле `project` → `productId`
```javascript
// При чтении backlog:
items.forEach(function(item) {
  if (item.project && !item.productId) {
    item.productId = item.project;
  }
});
```

### RICE: `impact/probability` → `r/i/c/e`
```javascript
// При чтении products:
products.forEach(function(p) {
  if (p.impact && !p.r) { p.r = p.impact; }
  if (p.probability && !p.i) { p.i = p.probability; }
  if (!p.c) p.c = 5;
  if (!p.e) p.e = 1;
});
```

### strategy goals → ECOTECH_GOALS
При следующем открытии strategy.html — вычитать goals из state,
записать в ECOTECH_GOALS, и далее читать/писать туда.

---

## ВЕРСИОНИРОВАНИЕ

При изменении схемы — увеличить версию в этом файле.
Все инструменты должны поддерживать миграцию из предыдущей версии.

```
v1.0 — 16.03.2026 — Первая фиксация контракта
v1.1 — 16.03.2026 — Разграничение ОРБИТА/YouTrack, trackerUrl/trackerType в PRODUCTS и BACKLOG
```
