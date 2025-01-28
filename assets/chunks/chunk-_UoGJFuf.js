import{c as P,f as A,r as n,T as z,j as a,B as T,S as B,N as G,X as w,A as H}from"./chunk-Ci6ZmdQA.js";/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]],K=P("Dice1",X);/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],U=P("Shuffle",Q);/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]],W=P("Trash",J);function I(e,t){const[r,s,l]=e.split(":").map(Number),o=t*4;return r*o+s*4+(l||0)}function Y(e,t){const r=[];for(let s=0;s<e.length;s+=t)r.push(e.slice(s,s+t));return r}function D(e,t){return`m${e}-s${t}`}const Z=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];Array.from({length:9},(e,t)=>t);const _=[1,2,3,4],q=({measures:e,sequencer:t,setSequencerMeasures:r,setSequencerSteps:s,setActiveStep:l})=>{const{timeSignature:o,loopLength:g}=A(),y=n.useMemo(()=>o*g,[o,g]),x=n.useMemo(()=>y*e,[y,e]);n.useEffect(()=>{!t||!o||h(e)},[t,o,e]);const h=n.useCallback(c=>{var m;if(!t)return;r(c),t.setMeasureCount(c),s(t.getSteps());const d=(m=z.toneTransport)==null?void 0:m.position;if(d){const N=I(d,o),v=c*o*g,j=N%v;l(Math.floor(j))}else l(0)},[s,r,l,o,g,t]),u=n.useMemo(()=>_.map(c=>()=>h(c)),[h]),f=n.useCallback(()=>{if(!t)return;const d=t.getSteps().map(m=>m===!0?!0:Math.random()<.25);t.setAllSteps(d),s(t.getSteps())},[s,t]),p=n.useCallback(()=>{if(!t)return;const c=Array.from({length:x},()=>Math.random()<.5);t.setAllSteps(c),s(t.getSteps())},[x,s,t]),S=n.useCallback(()=>{t&&(t.setAllSteps(Array.from({length:x},()=>!1)),s(t.getSteps()))},[x,s,t]);return a.jsxs("div",{className:"flex gap-2 justify-between flex-wrap my-4",children:[a.jsx("div",{className:"flex items-center gap-2",children:_.map((c,d)=>a.jsxs(T,{color:c===e?"warning":"secondary",onClick:u[d],children:[c," measure",c>1?"s":""]},`m-${c}`))}),a.jsxs("div",{className:"flex items-center gap-2",children:[a.jsxs(T,{color:"success",onClick:p,children:[a.jsx(U,{className:"inline-block w-4 h-4 mr-2"}),"Randomize"]}),a.jsxs(T,{color:"success",onClick:f,children:[a.jsx(K,{className:"inline-block w-4 h-4 mr-2"}),"Fill Empty"]}),a.jsxs(T,{color:"error",onClick:S,children:[a.jsx(W,{className:"inline-block w-4 h-4 mr-2"}),"Clear"]})]})]})},ee=({sequencer:e})=>{const[t,r]=n.useState("G"),[s,l]=n.useState(4),o=n.useCallback((h,u)=>{u>s&&l(p=>p+1),u<s&&l(p=>p-1);const f=`${h}${u}`;e&&e.changeNote(f)},[e,s]),g=n.useCallback(h=>{const u=h.target.value;r(u),o(u,s)},[s,o]),y=n.useCallback(()=>{o(t,s-1)},[t,s,o]),x=n.useCallback(()=>{o(t,s+1)},[t,s,o]);return n.useEffect(()=>{if(!e)return;const h=e.getNote();if(typeof h=="string"){const u=h.match(/^([A-G]#?)(\d)$/);u&&(r(u[1]),l(Number.parseInt(u[2],10)))}},[e]),a.jsxs("div",{className:"flex justify-start gap-4",children:[a.jsxs("div",{className:"flex items-center justify-between w-34",children:[a.jsx("label",{htmlFor:"note-select",className:"text-sm whitespace-nowrap",children:"Note:"}),a.jsx(B,{className:"rounded w-20 py-0.5 h-auto",id:"note-select",value:t,onChange:g,children:Z.map(h=>a.jsx("option",{value:h,children:h},h))})]}),a.jsx("div",{className:"w-40",children:a.jsx(G,{label:"Octave:",value:s,id:"step",onDecrease:y,onIncrease:x})})]})},te=w.button.variants({base:`inset-0 absolute z-2 transition-all rounded-sm ${H.transition.twShort}`,variants:{$state:{current:e=>`
        ${e.$armed?"bg-primaryLight":"bg-light hover:bg-warning/50"}
        !-translate-y-2
      `,inactive:e=>`${e.$armed?"bg-secondary/50":"bg-grayDark hover:bg-secondaryLight/50"}`,halfs:e=>`${e.$armed?"bg-secondary":"bg-grayDark hover:bg-secondaryLight/50"}`,fourths:e=>`${e.$armed?"bg-secondary":"bg-grayContrast hover:bg-secondaryLight/50"}`,eigths:e=>`${e.$armed?"bg-secondary/60":"bg-grayContrast/50 hover:bg-secondaryLight/50"}`}}}),se=({activeStep:e,steps:t,sequencer:r,setSequencerSteps:s})=>{const{timeSignature:l,loopLength:o}=A(),g=n.useMemo(()=>l*o,[l,o]);n.useEffect(()=>{r&&s(r.getSteps())},[r,s]);const y=n.useCallback(u=>{if(!r)return;const f=Number(u.currentTarget.dataset.stepIndex);r.toggleStep(f),s(r.getSteps())},[s,r]),x=n.useMemo(()=>Array.from({length:t.length},(u,f)=>({originalIndex:f})),[t]),h=n.useMemo(()=>Y(x,g),[x,g]);return a.jsx("div",{className:"flex flex-col gap-1",children:h.map((u,f)=>a.jsx("div",{className:"lg:flex lg:mb-0 mb-3 gap-1 min-h-20 grid grid-cols-8",children:u.map((p,S)=>{const c=p.originalIndex,d=e===c,m=t[c],N=D(f,S),v=c===0,j=c%4===0,$=c%2===0;let k;return d?k="current":j?k="fourths":$?k="eigths":v?k="halfs":k="inactive",a.jsx("div",{className:"relative flex-1",children:a.jsx(te,{$state:k,$armed:m,"data-step-index":c,onClick:y})},N)})},D(f,0)))})},V=(e,t,r)=>Number(((e-t)/(r-t)*100).toFixed(2)),ne=w.div`
  slider
  relative
  w-[200px]
`,ae=w.div`
  slider__track
  absolute
  rounded-sm
  cursor-pointer
  w-full
  h-[7px]
  bg-grayDark
  hover:bg-gray:50
`,re=w.div`
  slider__range
  absolute
  rounded-sm
  cursor-pointer
  h-[7px]
  bg-primary
  hover:bg-primaryLight/70
`,E=w.input`
  thumb
  thumb::-webkit-slider-thumb
  -webkit-appearance: none;
  pointer-events: none;
  position: absolute;
  height: 0;
  width: auto;
  outline: none;
`,oe={min:0,max:100},le=({multi:e,step:t=1,onChange:r,initialValue:s})=>{const{min:l,max:o}=oe,[g,y]=n.useState(l),[x,h]=n.useState(o),[u,f]=n.useState((l+o)/2),[p,S]=n.useState(!1),c=n.useRef(l),d=n.useRef(o),m=n.useRef(null),N=n.useRef(null);console.log(s);const v=n.useCallback(i=>{const b=V(i,l,o);m.current&&(m.current.style.left="0%",m.current.style.width=`${b}%`)},[o,l]),j=n.useCallback((i,b)=>{const C=V(i,l,o),M=V(b,l,o);m.current&&(m.current.style.left=`${C}%`,m.current.style.width=`${M-C}%`)},[o,l]),$=n.useCallback(i=>{p||S(!0);const b=Math.max(Number(i),g+1);r(b),f(b),v(b)},[v,p,g,r]),k=n.useCallback((i,b)=>{p||S(!0);const C=5;if(b==="min"){if(i>=d.current-C)return;y(Math.min(i,d.current-1)),r(i,"min"),j(i,d.current),c.current=i}else{if(i<=c.current+C)return;h(Math.max(i,c.current+1)),r(i,"max"),j(c.current,i),d.current=i}},[j,p,r]);n.useEffect(()=>{if(e){if(j(g,x),s&&!p){const[i,b]=s;y(i),h(b),c.current=i,d.current=b}}else v(u),s&&!p&&f(s)},[j,v,s,p,x,g,e,u]);const R={type:"range",min:l,max:o,step:t},L=i=>{if(!N.current)return;const b=N.current.getBoundingClientRect(),C=i.clientX-b.left,M=Math.round(C/b.width*(o-l)+l);if(e){const F=Math.abs(M-g),O=Math.abs(M-x);F<O?k(M,"min"):k(M,"max")}else $(M)};return a.jsxs("div",{className:"py-3",children:[e?a.jsxs(a.Fragment,{children:[a.jsx(E,{value:g,onChange:i=>k(Number(i.target.value),"min"),className:"thumb thumb--left z-3",...R}),a.jsx(E,{value:x,onChange:i=>k(Number(i.target.value),"max"),className:"thumb thumb--right z-4",...R})]}):a.jsx(E,{value:u,onChange:i=>$(Number(i.target.value)),className:"thumb thumb--single z-4",...R}),a.jsxs(ne,{ref:N,onClick:L,children:[a.jsx(ae,{}),a.jsx(re,{ref:m})]})]})},ce=(e,t,r)=>e/100*(r-t)+t,ie=(e,t,r)=>Number(((e-t)/(r-t)*100).toFixed(2)),ue=e=>ie(e.value,e.min,e.max),de=({sequencer:e,volume:t,setVolume:r,...s})=>{const{timeSignature:l,isPlaying:o,loopLength:g,transport:y,registerSixteenthTick:x,unregisterSixteenthTick:h}=A(),[u,f]=n.useState(),p=n.useMemo(()=>l*g,[l,g]),S=n.useMemo(()=>p*s.measures,[p,s.measures]);n.useEffect(()=>{function d(){f(m=>typeof m=="number"?(m+1)%S:0)}return x(d),()=>{h(d)}},[S,x,h]),n.useEffect(()=>{o&&f(0)},[o]),n.useEffect(()=>{if(!y)return;const d=y.position,N=I(d,l)%S;f(Math.floor(N))},[l,S,y]);const c=n.useCallback(d=>{if(e){r(d);const m=ce(d,-50,20);console.log("interpolatedValue",m),e.setVolume(m)}},[e,r]);return a.jsxs("div",{className:"p-4 border-grayDark bg-black border-1",children:[a.jsxs("div",{className:"flex justify-between items-center mb-4",children:[a.jsx(ee,{sequencer:e}),a.jsxs("div",{className:"flex gap-2 items-center",children:[a.jsx("span",{className:"text-sm pt-1 text-grayLight",children:"Volume"}),a.jsx(le,{onChange:c,initialValue:t||ue({min:-50,max:20,value:0})})]})]}),a.jsx(q,{measures:s.measures,setSequencerMeasures:s.setSequencerMeasures,setSequencerSteps:s.setSequencerSteps,setActiveStep:f,sequencer:e}),a.jsx(se,{sequencer:e,setSequencerSteps:s.setSequencerSteps,activeStep:u,steps:s.steps})]})};export{de as S};
