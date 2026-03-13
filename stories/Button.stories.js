/**
 * Button — ОРБИТА button system.
 * Variants: primary, secondary, ghost, danger, disabled.
 */

function createButton({ variant, label, disabled, size }) {
  const base = 'font-family:var(--font-display,"Orbitron",sans-serif);font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:opacity .15s,transform .15s;display:inline-flex;align-items:center;gap:8px;letter-spacing:0.02em;white-space:nowrap;';

  const sizes = {
    sm: 'font-size:11px;padding:8px 16px;',
    md: 'font-size:12px;padding:11px 22px;',
    lg: 'font-size:14px;padding:14px 28px;',
  };

  const variants = {
    primary:   'background:linear-gradient(135deg,#4FC3F7,#3B82F6);color:#fff;border:none;',
    secondary: 'background:transparent;color:#4FC3F7;border:1.5px solid rgba(79,195,247,0.35);',
    ghost:     'background:transparent;color:#7A7A9D;border:1px solid transparent;',
    danger:    'background:linear-gradient(135deg,#FF6B6B,#EF4444);color:#fff;border:none;',
  };

  const style = base + (sizes[size] || sizes.md) + (variants[variant] || variants.primary)
    + (disabled ? 'opacity:0.45;cursor:not-allowed;pointer-events:none;' : '');

  return `<button style="${style}" ${disabled ? 'disabled aria-disabled="true"' : ''}>${label}</button>`;
}

export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary','secondary','ghost','danger'],
      description: 'Visual variant',
    },
    label: { control: 'text', description: 'Button label' },
    size: {
      control: { type: 'select' },
      options: ['sm','md','lg'],
      description: 'Button size',
    },
    disabled: { control: 'boolean', description: 'Disabled state' },
  },
  args: {
    variant: 'primary',
    label: 'Далее',
    size: 'md',
    disabled: false,
  },
  render: (args) => createButton(args),
};

export const Primary   = { args: { variant: 'primary',   label: 'Далее' } };
export const Secondary = { args: { variant: 'secondary', label: 'Отмена' } };
export const Ghost     = { args: { variant: 'ghost',     label: 'Подробнее' } };
export const Danger    = { args: { variant: 'danger',    label: 'Удалить' } };
export const Disabled  = { args: { variant: 'primary',   label: 'Недоступно', disabled: true } };

export const AllVariants = {
  render: () => {
    const items = [
      { variant: 'primary',   label: 'Primary' },
      { variant: 'secondary', label: 'Secondary' },
      { variant: 'ghost',     label: 'Ghost' },
      { variant: 'danger',    label: 'Danger' },
      { variant: 'primary',   label: 'Disabled', disabled: true },
    ];
    return `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">${items.map(i => createButton({ size: 'md', ...i })).join('')}</div>`;
  },
  parameters: { controls: { disable: true } },
};

export const Sizes = {
  render: () => {
    return `<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      ${createButton({ variant: 'primary', label: 'Small', size: 'sm' })}
      ${createButton({ variant: 'primary', label: 'Medium', size: 'md' })}
      ${createButton({ variant: 'primary', label: 'Large', size: 'lg' })}
    </div>`;
  },
  parameters: { controls: { disable: true } },
};
