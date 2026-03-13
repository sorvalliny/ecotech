/**
 * ProductCard — Portfolio product card with gate progress, KPIs, status.
 * CSS: design-system/components/product-card.css + status-badge.css
 */

function gateBar(current) {
  return '<div class="pc__gate-bar">' +
    [0,1,2,3,4,5].map(g => {
      let cls = 'pc__gate-step';
      if (g < current) cls += ' pc__gate-step--done';
      else if (g === current) cls += ' pc__gate-step--active';
      return `<div class="${cls}"><span class="pc__gate-num">${g}</span></div>`;
    }).join('') +
    '</div>';
}

function kpiBlock(kpis) {
  return '<div class="pc__kpis">' +
    kpis.map(k => `<div class="pc__kpi"><span class="pc__kpi-val">${k.value}</span><span class="pc__kpi-lbl">${k.label}</span></div>`).join('') +
    '</div>';
}

function renderCard({ name, desc, gate, status, color, owner, kpis, loading }) {
  if (loading) {
    return `<div class="pc-grid"><div class="pc pc--loading">
      <div class="pc__bar" style="background:var(--color-border)"></div>
      <div class="pc__body"><div class="pc__shimmer" style="height:16px;width:60%;margin-bottom:8px;background:var(--color-border,#eee);border-radius:4px"></div><div class="pc__shimmer" style="height:12px;width:90%;background:var(--color-border,#eee);border-radius:4px"></div></div>
    </div></div>`;
  }

  let cardClass = 'pc';
  if (status === 'at-risk') cardClass += ' pc--at-risk';
  if (status === 'done') cardClass += ' pc--done';

  const statusLabel = { 'on-track': 'On Track', 'at-risk': 'At Risk', 'done': 'Done', 'paused': 'Paused' }[status] || status;

  return `<div class="pc-grid"><div class="${cardClass}">
    <div class="pc__bar" style="background:${color}"></div>
    <div class="pc__body">
      <div class="pc__status"><span class="badge badge--${status}">${statusLabel}</span></div>
      <h3 class="pc__name">${name}</h3>
      <p class="pc__desc">${desc}</p>
      ${gateBar(gate)}
      ${kpiBlock(kpis)}
      <div class="pc__footer">
        <div class="pc__avatar">${owner.charAt(0)}</div>
        <span class="pc__owner">${owner}</span>
      </div>
    </div>
  </div></div>`;
}

export default {
  title: 'Components/ProductCard',
  tags: ['autodocs'],
  argTypes: {
    name:   { control: 'text', description: 'Product name' },
    desc:   { control: 'text', description: 'Short description' },
    gate:   { control: { type: 'range', min: 0, max: 5, step: 1 }, description: 'Current gate (0-5)' },
    status: { control: { type: 'select' }, options: ['on-track','at-risk','done','paused'], description: 'Product status' },
    color:  { control: 'text', description: 'CSS gradient for top bar' },
    owner:  { control: 'text', description: 'Product owner name' },
    loading: { control: 'boolean', description: 'Show loading skeleton' },
  },
  args: {
    name: 'WB Seller Portal',
    desc: 'Личный кабинет продавца. Аналитика продаж, управление товарами.',
    gate: 4,
    status: 'on-track',
    color: 'linear-gradient(90deg,#00D4B4,#3B82F6)',
    owner: 'Алексей Р.',
    loading: false,
  },
  render: (args) => renderCard({
    ...args,
    kpis: [
      { value: '42K', label: 'MAU' },
      { value: '+18%', label: 'MoM' },
      { value: '94%', label: 'Retention' },
    ],
  }),
};

export const Default = {};

export const Hover = {
  parameters: { pseudo: { hover: true } },
  decorators: [(story) => {
    const el = document.createElement('div');
    el.innerHTML = story();
    const card = el.querySelector('.pc');
    if (card) {
      card.style.borderColor = 'rgba(79,195,247,0.20)';
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 12px 40px rgba(79,195,247,0.14)';
    }
    return el;
  }],
};

export const AtRisk = {
  args: {
    name: 'WB Logistics B2B',
    desc: 'Платформа фулфилмента для партнёров. SLA мониторинг.',
    gate: 3,
    status: 'at-risk',
    color: 'linear-gradient(90deg,#00D4B4,#34D399)',
    owner: 'Дмитрий С.',
  },
};

export const Completed = {
  args: {
    name: 'WB Academy',
    desc: 'Образовательная платформа: курсы для продавцов.',
    gate: 5,
    status: 'done',
    color: 'linear-gradient(90deg,#B3E5FC,#FF85C0)',
    owner: 'Анна М.',
  },
};

export const Loading = {
  args: { loading: true },
  parameters: { controls: { disable: true } },
};
