---
name: project_planning_wizard
description: Quarterly Planning Wizard в workspace.html — архитектура, компоненты, выявленные UX-проблемы
type: project
---

Quarterly Planning Wizard находится в `/Users/sorval/ecotech/workspace.html`, функции renderPlanning / renderReviewMode / renderPlanMode (строки 1541–1914), CSS классы .pl-* (строки 248–284).

**Архитектура:**
- `renderPlanning` — роутер: past quarter → ReviewMode, current/future → PlanMode
- `renderReviewMode` — 3 шага: Результаты → Ретроспектива (Start/Stop/Continue) → Незавершённое (transfer/cancel)
- `renderPlanMode` — 4 шага: Цели → Инициативы квартала → Приоритизация (RICE-таблица) → Согласование (чеклист)

**Ролевая модель:**
- `editable` = `canEdit()` = `OrbAuth.canEditProduct(productId)` — передаётся во все render-функции
- Роль CEO/stakeholder/lead → `isReadOnlyViewer()=true`, `canEditContent()=false`
- PMO-кнопки (утвердить/отклонить цель) — только для pmo/pmo_lead/admin внутри renderPlanMode

**Ключевые UX-проблемы (выявлены при ревью):**
- P0: нет bridge-контекста при переходе Q1-итоги → Q2-план
- P0: кнопки-квартала и год-селектор в одной строке без семантического разделения режимов
- P1: шаги в ReviewMode не имеют визуального состояния (completed/active/locked)
- P1: RICE-таблица в Step 3 не редактируема инлайн
- P1: checklist в Step 4 не кликабелен (нет навигации к шагу-источнику)
- P2: мобильный breakpoint только 640px для init-cols, весь остальной pl-* не адаптирован
- P2: нет роли CEO в явном виде — только через stakeholder/lead → isReadOnlyViewer

**Why:** Planning wizard добавлен позже основного каркаса workspace.
**How to apply:** При доработке — приоритет P0/P1 сначала, не трогать логику transfer/retro без UI-обёртки.
