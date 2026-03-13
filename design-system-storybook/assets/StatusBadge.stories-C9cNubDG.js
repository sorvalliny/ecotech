const b={title:"Components/StatusBadge",tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["gate-0","gate-1","gate-2","gate-3","gate-4","gate-5","on-track","at-risk","paused","done"],description:"Badge variant (gate level or status)"},label:{control:"text",description:"Badge text content"}},render:({variant:g,label:u})=>`<span class="badge badge--${g}">${u}</span>`,parameters:{docs:{description:{component:`StatusBadge — Gate 0–5 progression badges and risk status indicators.
Component: design-system/components/status-badge.css`}}}},e={args:{variant:"gate-0",label:"Gate 0"}},s={args:{variant:"gate-1",label:"Gate 1"}},r={args:{variant:"gate-2",label:"Gate 2"}},t={args:{variant:"gate-3",label:"Gate 3"}},n={args:{variant:"gate-4",label:"Gate 4"}},o={args:{variant:"gate-5",label:"Gate 5"}},c={args:{variant:"on-track",label:"On Track"}},p={args:{variant:"at-risk",label:"At Risk"}},l={args:{variant:"paused",label:"Paused"}},d={args:{variant:"done",label:"Done"}},i={render:()=>{const g=[0,1,2,3,4,5].map(a=>`<span class="badge badge--gate-${a}">Gate ${a}</span>`).join(" "),u=["on-track","at-risk","paused","done"].map(a=>`<span class="badge badge--${a}">${a.replace("-"," ").replace(/\b\w/g,m=>m.toUpperCase())}</span>`).join(" ");return`<div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;flex-wrap:wrap;gap:8px">${g}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">${u}</div>
    </div>`},parameters:{controls:{disable:!0}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-0',
    label: 'Gate 0'
  }
}`,...e.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-1',
    label: 'Gate 1'
  }
}`,...s.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-2',
    label: 'Gate 2'
  }
}`,...r.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-3',
    label: 'Gate 3'
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-4',
    label: 'Gate 4'
  }
}`,...n.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'gate-5',
    label: 'Gate 5'
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'on-track',
    label: 'On Track'
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'at-risk',
    label: 'At Risk'
  }
}`,...p.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'paused',
    label: 'Paused'
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'done',
    label: 'Done'
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const gates = [0, 1, 2, 3, 4, 5].map(g => \`<span class="badge badge--gate-\${g}">Gate \${g}</span>\`).join(' ');
    const statuses = ['on-track', 'at-risk', 'paused', 'done'].map(s => \`<span class="badge badge--\${s}">\${s.replace('-', ' ').replace(/\\b\\w/g, c => c.toUpperCase())}</span>\`).join(' ');
    return \`<div style="display:flex;flex-direction:column;gap:16px">
      <div style="display:flex;flex-wrap:wrap;gap:8px">\${gates}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px">\${statuses}</div>
    </div>\`;
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...i.parameters?.docs?.source}}};const v=["Gate0","Gate1","Gate2","Gate3","Gate4","Gate5","OnTrack","AtRisk","Paused","Done","AllVariants"];export{i as AllVariants,p as AtRisk,d as Done,e as Gate0,s as Gate1,r as Gate2,t as Gate3,n as Gate4,o as Gate5,c as OnTrack,l as Paused,v as __namedExportsOrder,b as default};
