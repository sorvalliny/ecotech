function r({variant:a,label:d,disabled:p,size:m}){const g='font-family:var(--font-display,"Orbitron",sans-serif);font-weight:700;border:none;border-radius:10px;cursor:pointer;transition:opacity .15s,transform .15s;display:inline-flex;align-items:center;gap:8px;letter-spacing:0.02em;white-space:nowrap;',c={sm:"font-size:11px;padding:8px 16px;",md:"font-size:12px;padding:11px 22px;",lg:"font-size:14px;padding:14px 28px;"},u={primary:"background:linear-gradient(135deg,#4FC3F7,#3B82F6);color:#fff;border:none;",secondary:"background:transparent;color:#4FC3F7;border:1.5px solid rgba(79,195,247,0.35);",ghost:"background:transparent;color:#7A7A9D;border:1px solid transparent;",danger:"background:linear-gradient(135deg,#FF6B6B,#EF4444);color:#fff;border:none;"};return`<button style="${g+(c[m]||c.md)+(u[a]||u.primary)+(p?"opacity:0.45;cursor:not-allowed;pointer-events:none;":"")}" ${p?'disabled aria-disabled="true"':""}>${d}</button>`}const y={title:"Components/Button",tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","secondary","ghost","danger"],description:"Visual variant"},label:{control:"text",description:"Button label"},size:{control:{type:"select"},options:["sm","md","lg"],description:"Button size"},disabled:{control:"boolean",description:"Disabled state"}},args:{variant:"primary",label:"Далее",size:"md",disabled:!1},render:a=>r(a)},e={args:{variant:"primary",label:"Далее"}},n={args:{variant:"secondary",label:"Отмена"}},s={args:{variant:"ghost",label:"Подробнее"}},t={args:{variant:"danger",label:"Удалить"}},i={args:{variant:"primary",label:"Недоступно",disabled:!0}},o={render:()=>`<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">${[{variant:"primary",label:"Primary"},{variant:"secondary",label:"Secondary"},{variant:"ghost",label:"Ghost"},{variant:"danger",label:"Danger"},{variant:"primary",label:"Disabled",disabled:!0}].map(d=>r({size:"md",...d})).join("")}</div>`,parameters:{controls:{disable:!0}}},l={render:()=>`<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      ${r({variant:"primary",label:"Small",size:"sm"})}
      ${r({variant:"primary",label:"Medium",size:"md"})}
      ${r({variant:"primary",label:"Large",size:"lg"})}
    </div>`,parameters:{controls:{disable:!0}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    label: 'Далее'
  }
}`,...e.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'secondary',
    label: 'Отмена'
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'ghost',
    label: 'Подробнее'
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'danger',
    label: 'Удалить'
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'primary',
    label: 'Недоступно',
    disabled: true
  }
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const items = [{
      variant: 'primary',
      label: 'Primary'
    }, {
      variant: 'secondary',
      label: 'Secondary'
    }, {
      variant: 'ghost',
      label: 'Ghost'
    }, {
      variant: 'danger',
      label: 'Danger'
    }, {
      variant: 'primary',
      label: 'Disabled',
      disabled: true
    }];
    return \`<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">\${items.map(i => createButton({
      size: 'md',
      ...i
    })).join('')}</div>\`;
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    return \`<div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center">
      \${createButton({
      variant: 'primary',
      label: 'Small',
      size: 'sm'
    })}
      \${createButton({
      variant: 'primary',
      label: 'Medium',
      size: 'md'
    })}
      \${createButton({
      variant: 'primary',
      label: 'Large',
      size: 'lg'
    })}
    </div>\`;
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...l.parameters?.docs?.source}}};const v=["Primary","Secondary","Ghost","Danger","Disabled","AllVariants","Sizes"];export{o as AllVariants,t as Danger,i as Disabled,s as Ghost,e as Primary,n as Secondary,l as Sizes,v as __namedExportsOrder,y as default};
