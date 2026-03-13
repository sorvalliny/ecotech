/**
 * StatusBadge — Gate 0–5 progression badges and risk status indicators.
 * CSS: design-system/components/status-badge.css
 */
export default {
  title: 'Components/StatusBadge',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['gate-0','gate-1','gate-2','gate-3','gate-4','gate-5','on-track','at-risk','paused','done'],
      description: 'Badge variant (gate level or status)',
    },
    label: {
      control: 'text',
      description: 'Badge text content',
    },
  },
  render: ({ variant, label }) => {
    return `<span class="badge badge--${variant}">${label}</span>`;
  },
};

/* ── Gate Badges ── */
export const Gate0 = { args: { variant: 'gate-0', label: 'Gate 0' } };
export const Gate1 = { args: { variant: 'gate-1', label: 'Gate 1' } };
export const Gate2 = { args: { variant: 'gate-2', label: 'Gate 2' } };
export const Gate3 = { args: { variant: 'gate-3', label: 'Gate 3' } };
export const Gate4 = { args: { variant: 'gate-4', label: 'Gate 4' } };
export const Gate5 = { args: { variant: 'gate-5', label: 'Gate 5' } };

/* ── Status Badges ── */
export const OnTrack = { args: { variant: 'on-track', label: 'On Track' } };
export const AtRisk  = { args: { variant: 'at-risk',  label: 'At Risk' } };
export const Paused  = { args: { variant: 'paused',   label: 'Paused' } };
export const Done    = { args: { variant: 'done',     label: 'Done' } };

/* ── All variants gallery ── */
export const AllVariants = {
  render: () => {
    const gates = [0,1,2,3,4,5].map(g =>
      `<span class="badge badge--gate-${g}">Gate ${g}</span>`
    ).join(' ');
    const statuses = ['on-track','at-risk','paused','done'].map(s =>
      `<span class="badge badge--${s}">${s.replace('-',' ').replace(/\b\w/g, c => c.toUpperCase())}</span>`
    ).join(' ');
    return `<div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;flex-wrap:wrap;gap:8px">${gates}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${statuses}</div>
    </div>`;
  },
  parameters: { controls: { disable: true } },
};
