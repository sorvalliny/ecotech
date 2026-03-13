/**
 * ColorPalette — All ОРБИТА design tokens with hex, usage, WCAG contrast.
 * Tokens defined in: design-system.css, css/theme-vars.css
 */

const COLORS = [
  // Brand
  { group: 'Brand', name: '--violet',      hex: '#4FC3F7', usage: 'Primary accent, links, focus rings',     wcag: '3.0:1 on #03080F', rating: 'AA (large text)' },
  { group: 'Brand', name: '--pink',         hex: '#FF2D8A', usage: 'Gradient accent, CTAs',                  wcag: '4.6:1 on #03080F', rating: 'AA' },
  { group: 'Brand', name: '--teal',         hex: '#00D4B4', usage: 'Success, Gate 5, on-track',              wcag: '3.2:1 on #03080F', rating: 'AA (large text)' },
  { group: 'Brand', name: '--amber',        hex: '#FFB830', usage: 'Warning, paused state',                  wcag: '4.1:1 on #03080F', rating: 'AA (large text)' },
  { group: 'Brand', name: '--blue',         hex: '#3B82F6', usage: 'Info, Gate 2-3, charts',                 wcag: '4.3:1 on #03080F', rating: 'AA (large text)' },
  { group: 'Brand', name: '--red',          hex: '#FF6B6B', usage: 'Danger, at-risk, error states',          wcag: '4.8:1 on #03080F', rating: 'AA' },
  { group: 'Brand', name: '--green',        hex: '#34D399', usage: 'Done, emerald for completed state',      wcag: '3.4:1 on #03080F', rating: 'AA (large text)' },
  // Backgrounds (dark theme)
  { group: 'Background', name: '--dark',    hex: '#03080F', usage: 'Primary dark background',                wcag: '17.4:1 vs #fff',   rating: 'AAA' },
  { group: 'Background', name: '--mid',     hex: '#061525', usage: 'Secondary dark background (cards bg)',   wcag: '15.2:1 vs #fff',   rating: 'AAA' },
  { group: 'Background', name: '--card',    hex: '#0A1929', usage: 'Card surfaces',                          wcag: '13.8:1 vs #fff',   rating: 'AAA' },
  { group: 'Background', name: '--surface2',hex: '#0E2338', usage: 'Elevated surfaces, modals',              wcag: '12.0:1 vs #fff',   rating: 'AAA' },
  // Light backgrounds
  { group: 'Light BG', name: '--dark (light)',    hex: '#FAF9FF', usage: 'Primary light background',         wcag: '1.03:1 vs #fff',   rating: 'N/A (bg)' },
  { group: 'Light BG', name: '--card (light)',    hex: '#FFFFFF', usage: 'Card surfaces (light)',             wcag: '—',                 rating: 'N/A (bg)' },
  { group: 'Light BG', name: '--mid (light)',     hex: '#F3F0FF', usage: 'Secondary light background',       wcag: '—',                 rating: 'N/A (bg)' },
  // Text
  { group: 'Text', name: '--text',          hex: '#1A1040', usage: 'Primary text (light theme)',              wcag: '14.5:1 on #FAF9FF', rating: 'AAA' },
  { group: 'Text', name: '--muted',         hex: '#7A9DB8', usage: 'Muted text (dark theme — bumped for a11y)', wcag: '5.8:1 on #03080F', rating: 'AA' },
  { group: 'Text', name: '--muted (light)', hex: '#7A7A9D', usage: 'Muted text (light theme)',               wcag: '4.5:1 on #FAF9FF', rating: 'AA' },
  { group: 'Text', name: '--gray',          hex: '#8AB0C8', usage: 'Secondary muted (dark theme)',           wcag: '5.0:1 on #03080F', rating: 'AA' },
];

function swatch(color) {
  const textColor = luminance(color.hex) > 0.4 ? '#1A1040' : '#FFFFFF';
  return `<div style="display:grid;grid-template-columns:60px 1fr;gap:12px;align-items:center;padding:8px 0;border-bottom:1px solid rgba(79,195,247,0.06)">
    <div style="width:48px;height:48px;border-radius:10px;background:${color.hex};border:1px solid rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center">
      <span style="font-family:'Orbitron',sans-serif;font-size:8px;font-weight:700;color:${textColor}">${color.hex}</span>
    </div>
    <div>
      <div style="font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;color:var(--color-text,#1A1040)">${color.name}</div>
      <div style="font-size:11px;color:#7A7A9D;margin-top:2px">${color.usage}</div>
      <div style="font-size:10px;margin-top:2px"><span style="background:${wcagBg(color.rating)};color:${wcagFg(color.rating)};padding:1px 6px;border-radius:4px;font-weight:600">${color.rating}</span> <span style="color:#7A7A9D">${color.wcag}</span></div>
    </div>
  </div>`;
}

function wcagBg(rating) {
  if (rating.includes('AAA')) return '#D1FAE5';
  if (rating.includes('AA'))  return '#DAEAF9';
  return '#F0EFF5';
}
function wcagFg(rating) {
  if (rating.includes('AAA')) return '#166534';
  if (rating.includes('AA'))  return '#1A5296';
  return '#4A4A6A';
}

function luminance(hex) {
  const r = parseInt(hex.slice(1,3), 16) / 255;
  const g = parseInt(hex.slice(3,5), 16) / 255;
  const b = parseInt(hex.slice(5,7), 16) / 255;
  const srgb = [r,g,b].map(c => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

export default {
  title: 'Foundation/ColorPalette',
  tags: ['autodocs'],
  argTypes: {
    group: {
      control: { type: 'select' },
      options: ['All', 'Brand', 'Background', 'Light BG', 'Text'],
      description: 'Filter by color group',
    },
  },
  args: { group: 'All' },
  render: ({ group }) => {
    const filtered = group === 'All' ? COLORS : COLORS.filter(c => c.group === group);
    const groups = {};
    filtered.forEach(c => {
      if (!groups[c.group]) groups[c.group] = [];
      groups[c.group].push(c);
    });

    let html = '';
    Object.entries(groups).forEach(([name, colors]) => {
      html += `<div style="margin-bottom:24px">
        <h3 style="font-family:'Orbitron',sans-serif;font-size:11px;font-weight:700;color:#4FC3F7;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:12px">${name}</h3>
        ${colors.map(swatch).join('')}
      </div>`;
    });
    return html;
  },
};

export const AllColors = { args: { group: 'All' } };
export const BrandColors = { args: { group: 'Brand' } };
export const Backgrounds = { args: { group: 'Background' } };
export const LightBackgrounds = { args: { group: 'Light BG' } };
export const TextColors = { args: { group: 'Text' } };
