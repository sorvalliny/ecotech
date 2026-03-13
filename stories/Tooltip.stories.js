/**
 * Tooltip — Term tooltip component.
 * Renders `<abbr class="term" data-tip="...">TERM</abbr>` with hover/focus card.
 * CSS: design-system/components/tooltip.css
 * JS:  design-system/components/tooltip.js (event delegation — auto-loaded via nav.js)
 */

const TERMS = {
  'Gate 0': 'Скрининг идеи. Первичная проверка гипотезы перед выделением ресурсов.',
  'Gate 1': 'Discovery. Глубинные интервью, CustDev, определение целевого сегмента.',
  'Gate 2': 'MVP. Минимальный продукт для проверки ключевой гипотезы ценности.',
  'Gate 3': 'Product-Market Fit. Подтверждение метриками, что продукт нужен рынку.',
  'Gate 4': 'Масштабирование. Рост пользовательской базы, оптимизация unit-экономики.',
  'Gate 5': 'Зрелый бизнес. P&L, интеграция в экосистему, переход к устойчивой модели.',
  'RICE':   'Reach \u00d7 Impact \u00d7 Confidence / Effort — фреймворк приоритизации инициатив.',
  'P&L':    'Profit & Loss — отчёт о прибылях и убытках продукта.',
  'PMO':    'Project Management Office — проектный офис, координирующий портфель инициатив.',
  'Инвест-комитет': 'Орган принятия решений о выделении ресурсов на продуктовые инициативы.',
  'MVP':    'Minimum Viable Product — минимальная версия продукта для проверки гипотезы.',
  'CustDev': 'Customer Development — методология изучения потребностей клиентов через интервью.',
};

function renderTerm(term, tip) {
  return `<abbr class="term" data-tip="${tip.replace(/"/g, '&quot;')}" tabindex="0">${term}</abbr>`;
}

export default {
  title: 'Components/Tooltip',
  tags: ['autodocs'],
  argTypes: {
    term: {
      control: { type: 'select' },
      options: Object.keys(TERMS),
      description: 'Term to display',
    },
  },
  args: {
    term: 'RICE',
  },
  render: ({ term }) => {
    const tip = TERMS[term] || '';
    return `<p style="font-size:14px;color:var(--color-text,#1A1040);line-height:2">
      Используйте ${renderTerm(term, tip)} для приоритизации задач в портфеле.
    </p>
    <p style="font-size:11px;color:var(--muted,#7A7A9D);margin-top:8px">Наведите курсор или нажмите Tab для фокуса.</p>`;
  },
  decorators: [(story) => {
    const el = document.createElement('div');
    el.innerHTML = story();
    // Initialize tooltip JS for Storybook
    import('../design-system/components/tooltip.js').catch(() => {});
    return el;
  }],
};

export const RICE    = { args: { term: 'RICE' } };
export const Gate0   = { args: { term: 'Gate 0' } };
export const Gate5   = { args: { term: 'Gate 5' } };
export const PandL   = { args: { term: 'P&L' } };
export const PMO     = { args: { term: 'PMO' } };
export const InvestCommittee = { args: { term: 'Инвест-комитет' } };

export const AllTerms = {
  render: () => {
    const items = Object.entries(TERMS).map(([term, tip]) =>
      `<span style="margin:4px">${renderTerm(term, tip)}</span>`
    ).join('');
    return `<div style="display:flex;flex-wrap:wrap;gap:4px;font-size:13px;line-height:2.2">${items}</div>
    <p style="font-size:11px;color:var(--muted,#7A7A9D);margin-top:12px">Hover over any term to see its tooltip.</p>`;
  },
  decorators: [(story) => {
    const el = document.createElement('div');
    el.innerHTML = story();
    import('../design-system/components/tooltip.js').catch(() => {});
    return el;
  }],
  parameters: { controls: { disable: true } },
};
