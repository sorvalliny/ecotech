function v(r){return'<div class="pc__gate-bar">'+[0,1,2,3,4,5].map(e=>{let a="pc__gate-step";return e<r?a+=" pc__gate-step--done":e===r&&(a+=" pc__gate-step--active"),`<div class="${a}"><span class="pc__gate-num">${e}</span></div>`}).join("")+"</div>"}function _(r){return'<div class="pc__kpis">'+r.map(e=>`<div class="pc__kpi"><span class="pc__kpi-val">${e.value}</span><span class="pc__kpi-lbl">${e.label}</span></div>`).join("")+"</div>"}function b({name:r,desc:e,gate:a,status:s,color:l,owner:i,kpis:p,loading:g}){if(g)return`<div class="pc-grid"><div class="pc pc--loading">
      <div class="pc__bar" style="background:var(--color-border)"></div>
      <div class="pc__body"><div class="pc__shimmer" style="height:16px;width:60%;margin-bottom:8px;background:var(--color-border,#eee);border-radius:4px"></div><div class="pc__shimmer" style="height:12px;width:90%;background:var(--color-border,#eee);border-radius:4px"></div></div>
    </div></div>`;let d="pc";s==="at-risk"&&(d+=" pc--at-risk"),s==="done"&&(d+=" pc--done");const m={"on-track":"On Track","at-risk":"At Risk",done:"Done",paused:"Paused"}[s]||s;return`<div class="pc-grid"><div class="${d}">
    <div class="pc__bar" style="background:${l}"></div>
    <div class="pc__body">
      <div class="pc__status"><span class="badge badge--${s}">${m}</span></div>
      <h3 class="pc__name">${r}</h3>
      <p class="pc__desc">${e}</p>
      ${v(a)}
      ${_(p)}
      <div class="pc__footer">
        <div class="pc__avatar">${i.charAt(0)}</div>
        <span class="pc__owner">${i}</span>
      </div>
    </div>
  </div></div>`}const B={title:"Components/ProductCard",tags:["autodocs"],argTypes:{name:{control:"text",description:"Product name"},desc:{control:"text",description:"Short description"},gate:{control:{type:"range",min:0,max:5,step:1},description:"Current gate (0-5)"},status:{control:{type:"select"},options:["on-track","at-risk","done","paused"],description:"Product status"},color:{control:"text",description:"CSS gradient for top bar"},owner:{control:"text",description:"Product owner name"},loading:{control:"boolean",description:"Show loading skeleton"}},args:{name:"WB Seller Portal",desc:"Личный кабинет продавца. Аналитика продаж, управление товарами.",gate:4,status:"on-track",color:"linear-gradient(90deg,#00D4B4,#3B82F6)",owner:"Алексей Р.",loading:!1},render:r=>b({...r,kpis:[{value:"42K",label:"MAU"},{value:"+18%",label:"MoM"},{value:"94%",label:"Retention"}]})},o={},t={parameters:{pseudo:{hover:!0}},decorators:[r=>{const e=document.createElement("div");e.innerHTML=r();const a=e.querySelector(".pc");return a&&(a.style.borderColor="rgba(79,195,247,0.20)",a.style.transform="translateY(-4px)",a.style.boxShadow="0 12px 40px rgba(79,195,247,0.14)"),e}]},n={args:{name:"WB Logistics B2B",desc:"Платформа фулфилмента для партнёров. SLA мониторинг.",gate:3,status:"at-risk",color:"linear-gradient(90deg,#00D4B4,#34D399)",owner:"Дмитрий С."}},c={args:{name:"WB Academy",desc:"Образовательная платформа: курсы для продавцов.",gate:5,status:"done",color:"linear-gradient(90deg,#B3E5FC,#FF85C0)",owner:"Анна М."}},u={args:{loading:!0},parameters:{controls:{disable:!0}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:"{}",...o.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  parameters: {
    pseudo: {
      hover: true
    }
  },
  decorators: [story => {
    const el = document.createElement('div');
    el.innerHTML = story();
    const card = el.querySelector('.pc');
    if (card) {
      card.style.borderColor = 'rgba(79,195,247,0.20)';
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = '0 12px 40px rgba(79,195,247,0.14)';
    }
    return el;
  }]
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'WB Logistics B2B',
    desc: 'Платформа фулфилмента для партнёров. SLA мониторинг.',
    gate: 3,
    status: 'at-risk',
    color: 'linear-gradient(90deg,#00D4B4,#34D399)',
    owner: 'Дмитрий С.'
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    name: 'WB Academy',
    desc: 'Образовательная платформа: курсы для продавцов.',
    gate: 5,
    status: 'done',
    color: 'linear-gradient(90deg,#B3E5FC,#FF85C0)',
    owner: 'Анна М.'
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    loading: true
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...u.parameters?.docs?.source}}};const k=["Default","Hover","AtRisk","Completed","Loading"];export{n as AtRisk,c as Completed,o as Default,t as Hover,u as Loading,k as __namedExportsOrder,B as default};
