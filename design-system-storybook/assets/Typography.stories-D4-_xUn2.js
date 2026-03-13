const m=[{name:"Display",tag:"h1",font:"Orbitron",weight:900,size:"38px",lineHeight:"1.1",letterSpacing:"-1.5px",usage:"Hero заголовки, лендинги"},{name:"Heading 1",tag:"h1",font:"Orbitron",weight:900,size:"28px",lineHeight:"1.15",letterSpacing:"-1px",usage:"Заголовки страниц"},{name:"Heading 2",tag:"h2",font:"Orbitron",weight:700,size:"18px",lineHeight:"1.3",letterSpacing:"-0.3px",usage:"Заголовки секций"},{name:"Heading 3",tag:"h3",font:"Orbitron",weight:700,size:"13px",lineHeight:"1.4",letterSpacing:"0.02em",usage:"Заголовки карточек"},{name:"Body",tag:"p",font:"Exo 2",weight:400,size:"14px",lineHeight:"1.65",letterSpacing:"0",usage:"Основной текст"},{name:"Caption",tag:"p",font:"Exo 2",weight:600,size:"12px",lineHeight:"1.5",letterSpacing:"0",usage:"Подписи, мета-данные"},{name:"Eyebrow",tag:"p",font:"Orbitron",weight:700,size:"9px",lineHeight:"1.2",letterSpacing:"0.16em",usage:"Надзаголовки, метки секций"}];function f({name:r,tag:a,font:e,weight:t,size:s,lineHeight:n,letterSpacing:y,usage:x}){const v=`font-family:'${e}',sans-serif;font-weight:${t};font-size:${s};line-height:${n};letter-spacing:${y};color:var(--color-text,#1A1040);margin:0;`,$=`<span style="font-family:'Exo 2',sans-serif;font-size:11px;font-weight:400;color:#7A7A9D;display:block;margin-top:4px">${e} ${t} / ${s} / LH ${n} — ${x}</span>`;return`<div style="padding:16px 0;border-bottom:1px solid rgba(79,195,247,0.08)">
    <${a} style="${v}">${r==="Eyebrow"?r.toUpperCase():r}</${a}>
    ${$}
  </div>`}const h={title:"Foundation/Typography",tags:["autodocs"],argTypes:{level:{control:{type:"select"},options:m.map(r=>r.name),description:"Type scale level"},text:{control:"text",description:"Sample text to display"}},args:{level:"Display",text:""},render:({level:r,text:a})=>{const e=m.find(n=>n.name===r)||m[0],t=a||(e.name==="Eyebrow"?"БИЗНЕСУ":"ОРБИТА — Платформа инноваций"),s=`font-family:'${e.font}',sans-serif;font-weight:${e.weight};font-size:${e.size};line-height:${e.lineHeight};letter-spacing:${e.letterSpacing};color:var(--color-text,#1A1040);margin:0;`;return`<${e.tag} style="${s}">${t}</${e.tag}>
      <p style="font-family:'Exo 2',sans-serif;font-size:11px;color:#7A7A9D;margin-top:8px">${e.font} ${e.weight} / ${e.size} / LH ${e.lineHeight} — ${e.usage}</p>`}},o={args:{level:"Display"}},u={args:{level:"Heading 1"}},i={args:{level:"Heading 2"}},l={args:{level:"Heading 3"}},p={args:{level:"Body",text:"Каждая инициатива проходит циклы Discovery и Delivery, а команда адаптирует план на основе реальных данных."}},c={args:{level:"Caption",text:"Обновлено 10 марта 2026 · Алексей Р."}},g={args:{level:"Eyebrow",text:"БИЗНЕСУ"}},d={render:()=>`<div>${m.map(f).join("")}</div>`,parameters:{controls:{disable:!0}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Display'
  }
}`,...o.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Heading 1'
  }
}`,...u.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Heading 2'
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Heading 3'
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Body',
    text: 'Каждая инициатива проходит циклы Discovery и Delivery, а команда адаптирует план на основе реальных данных.'
  }
}`,...p.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Caption',
    text: 'Обновлено 10 марта 2026 · Алексей Р.'
  }
}`,...c.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    level: 'Eyebrow',
    text: 'БИЗНЕСУ'
  }
}`,...g.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => \`<div>\${SCALE.map(renderLevel).join('')}</div>\`,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...d.parameters?.docs?.source}}};const H=["Display","Heading1","Heading2","Heading3","Body","Caption","Eyebrow","FullScale"];export{p as Body,c as Caption,o as Display,g as Eyebrow,d as FullScale,u as Heading1,i as Heading2,l as Heading3,H as __namedExportsOrder,h as default};
