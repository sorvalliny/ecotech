import{_ as i}from"./preload-helper-PPVm8Dsz.js";const p={"Gate 0":"Скрининг идеи. Первичная проверка гипотезы перед выделением ресурсов.","Gate 1":"Discovery. Глубинные интервью, CustDev, определение целевого сегмента.","Gate 2":"MVP. Минимальный продукт для проверки ключевой гипотезы ценности.","Gate 3":"Product-Market Fit. Подтверждение метриками, что продукт нужен рынку.","Gate 4":"Масштабирование. Рост пользовательской базы, оптимизация unit-экономики.","Gate 5":"Зрелый бизнес. P&L, интеграция в экосистему, переход к устойчивой модели.",RICE:"Reach × Impact × Confidence / Effort — фреймворк приоритизации инициатив.","P&L":"Profit & Loss — отчёт о прибылях и убытках продукта.",PMO:"Project Management Office — проектный офис, координирующий портфель инициатив.","Инвест-комитет":"Орган принятия решений о выделении ресурсов на продуктовые инициативы.",MVP:"Minimum Viable Product — минимальная версия продукта для проверки гипотезы.",CustDev:"Customer Development — методология изучения потребностей клиентов через интервью."};function u(r,e){return`<abbr class="term" data-tip="${e.replace(/"/g,"&quot;")}" tabindex="0">${r}</abbr>`}const g={title:"Components/Tooltip",tags:["autodocs"],argTypes:{term:{control:{type:"select"},options:Object.keys(p),description:"Term to display"}},args:{term:"RICE"},render:({term:r})=>{const e=p[r]||"";return`<p style="font-size:14px;color:var(--color-text,#1A1040);line-height:2">
      Используйте ${u(r,e)} для приоритизации задач в портфеле.
    </p>
    <p style="font-size:11px;color:var(--muted,#7A7A9D);margin-top:8px">Наведите курсор или нажмите Tab для фокуса.</p>`},decorators:[r=>{const e=document.createElement("div");return e.innerHTML=r(),i(()=>import("./tooltip-BbbN9nSX.js"),[],import.meta.url).catch(()=>{}),e}]},t={args:{term:"RICE"}},s={args:{term:"Gate 0"}},a={args:{term:"Gate 5"}},o={args:{term:"P&L"}},n={args:{term:"PMO"}},c={args:{term:"Инвест-комитет"}},m={render:()=>`<div style="display:flex;flex-wrap:wrap;gap:4px;font-size:13px;line-height:2.2">${Object.entries(p).map(([e,d])=>`<span style="margin:4px">${u(e,d)}</span>`).join("")}</div>
    <p style="font-size:11px;color:var(--muted,#7A7A9D);margin-top:12px">Hover over any term to see its tooltip.</p>`,decorators:[r=>{const e=document.createElement("div");return e.innerHTML=r(),i(()=>import("./tooltip-BbbN9nSX.js"),[],import.meta.url).catch(()=>{}),e}],parameters:{controls:{disable:!0}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'RICE'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'Gate 0'
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'Gate 5'
  }
}`,...a.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'P&L'
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'PMO'
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    term: 'Инвест-комитет'
  }
}`,...c.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const items = Object.entries(TERMS).map(([term, tip]) => \`<span style="margin:4px">\${renderTerm(term, tip)}</span>\`).join('');
    return \`<div style="display:flex;flex-wrap:wrap;gap:4px;font-size:13px;line-height:2.2">\${items}</div>
    <p style="font-size:11px;color:var(--muted,#7A7A9D);margin-top:12px">Hover over any term to see its tooltip.</p>\`;
  },
  decorators: [story => {
    const el = document.createElement('div');
    el.innerHTML = story();
    import('../design-system/components/tooltip.js').catch(() => {});
    return el;
  }],
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...m.parameters?.docs?.source}}};const v=["RICE","Gate0","Gate5","PandL","PMO","InvestCommittee","AllTerms"];export{m as AllTerms,s as Gate0,a as Gate5,c as InvestCommittee,n as PMO,o as PandL,t as RICE,v as __namedExportsOrder,g as default};
