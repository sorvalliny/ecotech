/**
 * Typography — ОРБИТА type scale (7 levels).
 * Display font: Orbitron | Body font: Exo 2
 */

const SCALE = [
  { name: 'Display',    tag: 'h1', font: 'Orbitron', weight: 900, size: '38px', lineHeight: '1.1',  letterSpacing: '-1.5px', usage: 'Hero заголовки, лендинги' },
  { name: 'Heading 1',  tag: 'h1', font: 'Orbitron', weight: 900, size: '28px', lineHeight: '1.15', letterSpacing: '-1px',   usage: 'Заголовки страниц' },
  { name: 'Heading 2',  tag: 'h2', font: 'Orbitron', weight: 700, size: '18px', lineHeight: '1.3',  letterSpacing: '-0.3px', usage: 'Заголовки секций' },
  { name: 'Heading 3',  tag: 'h3', font: 'Orbitron', weight: 700, size: '13px', lineHeight: '1.4',  letterSpacing: '0.02em', usage: 'Заголовки карточек' },
  { name: 'Body',       tag: 'p',  font: 'Exo 2',   weight: 400, size: '14px', lineHeight: '1.65', letterSpacing: '0',      usage: 'Основной текст' },
  { name: 'Caption',    tag: 'p',  font: 'Exo 2',   weight: 600, size: '12px', lineHeight: '1.5',  letterSpacing: '0',      usage: 'Подписи, мета-данные' },
  { name: 'Eyebrow',    tag: 'p',  font: 'Orbitron', weight: 700, size: '9px',  lineHeight: '1.2',  letterSpacing: '0.16em', usage: 'Надзаголовки, метки секций' },
];

function renderLevel({ name, tag, font, weight, size, lineHeight, letterSpacing, usage }) {
  const style = `font-family:'${font}',sans-serif;font-weight:${weight};font-size:${size};line-height:${lineHeight};letter-spacing:${letterSpacing};color:var(--color-text,#1A1040);margin:0;`;
  const meta = `<span style="font-family:'Exo 2',sans-serif;font-size:11px;font-weight:400;color:#7A7A9D;display:block;margin-top:4px">${font} ${weight} / ${size} / LH ${lineHeight} — ${usage}</span>`;
  return `<div style="padding:16px 0;border-bottom:1px solid rgba(79,195,247,0.08)">
    <${tag} style="${style}">${name === 'Eyebrow' ? name.toUpperCase() : name}</${tag}>
    ${meta}
  </div>`;
}

export default {
  title: 'Foundation/Typography',
  tags: ['autodocs'],
  argTypes: {
    level: {
      control: { type: 'select' },
      options: SCALE.map(s => s.name),
      description: 'Type scale level',
    },
    text: {
      control: 'text',
      description: 'Sample text to display',
    },
  },
  args: {
    level: 'Display',
    text: '',
  },
  render: ({ level, text }) => {
    const item = SCALE.find(s => s.name === level) || SCALE[0];
    const display = text || (item.name === 'Eyebrow' ? 'БИЗНЕСУ' : 'ОРБИТА — Платформа инноваций');
    const style = `font-family:'${item.font}',sans-serif;font-weight:${item.weight};font-size:${item.size};line-height:${item.lineHeight};letter-spacing:${item.letterSpacing};color:var(--color-text,#1A1040);margin:0;`;
    return `<${item.tag} style="${style}">${display}</${item.tag}>
      <p style="font-family:'Exo 2',sans-serif;font-size:11px;color:#7A7A9D;margin-top:8px">${item.font} ${item.weight} / ${item.size} / LH ${item.lineHeight} — ${item.usage}</p>`;
  },
};

export const Display  = { args: { level: 'Display' } };
export const Heading1 = { args: { level: 'Heading 1' } };
export const Heading2 = { args: { level: 'Heading 2' } };
export const Heading3 = { args: { level: 'Heading 3' } };
export const Body     = { args: { level: 'Body', text: 'Каждая инициатива проходит циклы Discovery и Delivery, а команда адаптирует план на основе реальных данных.' } };
export const Caption  = { args: { level: 'Caption', text: 'Обновлено 10 марта 2026 · Алексей Р.' } };
export const Eyebrow  = { args: { level: 'Eyebrow', text: 'БИЗНЕСУ' } };

export const FullScale = {
  render: () => `<div>${SCALE.map(renderLevel).join('')}</div>`,
  parameters: { controls: { disable: true } },
};
