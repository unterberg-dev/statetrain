import{c as D,g as R,r as s,T as G,j as n,B as T,S as K,N as L,X as $,A as E,H as W}from"./chunk-sjNTSucF.js";/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2",ry:"2",key:"1m3agn"}],["path",{d:"M12 12h.01",key:"1mp3jc"}]],Q=D("Dice1",X);/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"m18 14 4 4-4 4",key:"10pe0f"}],["path",{d:"m18 2 4 4-4 4",key:"pucp1d"}],["path",{d:"M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22",key:"1ailkh"}],["path",{d:"M2 6h1.972a4 4 0 0 1 3.6 2.2",key:"km57vx"}],["path",{d:"M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45",key:"os18l9"}]],J=D("Shuffle",U);/**
 * @license lucide-react v0.473.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}]],Z=D("Trash",Y);function F(t,e){const[r,a,c]=t.split(":").map(Number),l=e*4;return r*l+a*4+(c||0)}function q(t,e){const r=[];for(let a=0;a<t.length;a+=e)r.push(t.slice(a,a+e));return r}function _(t,e){return`m${t}-s${e}`}const tt=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];Array.from({length:9},(t,e)=>e);const O=[1,2,3,4],et=({measures:t,sequencer:e,setSequencerMeasures:r,setSequencerSteps:a,setActiveStep:c})=>{const{timeSignature:l,loopLength:h}=R(),k=s.useMemo(()=>l*h,[l,h]),g=s.useMemo(()=>k*t,[k,t]);s.useEffect(()=>{!e||!l||d(t)},[e,l,t]);const d=s.useCallback(i=>{var p;if(!e)return;r(i),e.setMeasureCount(i),a(e.getSteps());const x=(p=G.toneTransport)==null?void 0:p.position;if(x){const N=F(x,l),j=i*l*h,b=N%j;c(Math.floor(b))}else c(0)},[a,r,c,l,h,e]),o=s.useMemo(()=>O.map(i=>()=>d(i)),[d]),f=s.useCallback(()=>{if(!e)return;const x=e.getSteps().map(p=>p===!0?!0:Math.random()<.25);e.setAllSteps(x),a(e.getSteps())},[a,e]),m=s.useCallback(()=>{if(!e)return;const i=Array.from({length:g},()=>Math.random()<.5);e.setAllSteps(i),a(e.getSteps())},[g,a,e]),C=s.useCallback(()=>{e&&(e.setAllSteps(Array.from({length:g},()=>!1)),a(e.getSteps()))},[g,a,e]);return n.jsxs("div",{className:"flex gap-2 justify-between flex-wrap my-4",children:[n.jsx("div",{className:"flex items-center gap-2",children:O.map((i,x)=>n.jsxs(T,{color:i===t?"warning":"secondary",onClick:o[x],children:[i," measure",i>1?"s":""]},`m-${i}`))}),n.jsxs("div",{className:"flex items-center gap-2",children:[n.jsxs(T,{color:"success",onClick:m,children:[n.jsx(J,{className:"inline-block w-4 h-4 mr-2"}),"Randomize"]}),n.jsxs(T,{color:"success",onClick:f,children:[n.jsx(Q,{className:"inline-block w-4 h-4 mr-2"}),"Fill Empty"]}),n.jsxs(T,{color:"error",onClick:C,children:[n.jsx(Z,{className:"inline-block w-4 h-4 mr-2"}),"Clear"]})]})]})},nt=({sequencer:t})=>{const[e,r]=s.useState("G"),[a,c]=s.useState(4),l=s.useCallback((d,o)=>{o>a&&c(m=>m+1),o<a&&c(m=>m-1);const f=`${d}${o}`;t&&t.changeNote(f)},[t,a]),h=s.useCallback(d=>{const o=d.target.value;r(o),l(o,a)},[a,l]),k=s.useCallback(()=>{l(e,a-1)},[e,a,l]),g=s.useCallback(()=>{l(e,a+1)},[e,a,l]);return s.useEffect(()=>{if(!t)return;const d=t.getNote();if(typeof d=="string"){const o=d.match(/^([A-G]#?)(\d)$/);o&&(r(o[1]),c(Number.parseInt(o[2],10)))}},[t]),n.jsxs("div",{className:"flex justify-start gap-4",children:[n.jsxs("div",{className:"flex items-center justify-between w-34",children:[n.jsx("label",{htmlFor:"note-select",className:"text-sm whitespace-nowrap",children:"Note:"}),n.jsx(K,{className:"rounded w-20 py-0.5 h-auto",id:"note-select",value:e,onChange:h,children:tt.map(d=>n.jsx("option",{value:d,children:d},d))})]}),n.jsx("div",{className:"w-40",children:n.jsx(L,{label:"Octave:",value:a,id:"step",onDecrease:k,onIncrease:g})})]})},st=$.button.variants({base:`inset-0 absolute z-2 transition-all rounded-sm ${E.transition.twShort}`,variants:{$state:{current:t=>`
        ${t.$armed?"bg-primaryLight":"bg-light hover:bg-warning/50"}
        !-translate-y-2
      `,inactive:t=>`${t.$armed?"bg-secondary/50":"bg-grayDark hover:bg-secondaryLight/50"}`,halfs:t=>`${t.$armed?"bg-secondary":"bg-grayDark hover:bg-secondaryLight/50"}`,fourths:t=>`${t.$armed?"bg-secondary":"bg-grayContrast hover:bg-secondaryLight/50"}`,eigths:t=>`${t.$armed?"bg-secondary/60":"bg-grayContrast/50 hover:bg-secondaryLight/50"}`}}}),at=({activeStep:t,steps:e,sequencer:r,setSequencerSteps:a})=>{const{timeSignature:c,loopLength:l}=R(),h=s.useMemo(()=>c*l,[c,l]);s.useEffect(()=>{r&&a(r.getSteps())},[r,a]);const k=s.useCallback(o=>{if(!r)return;const f=Number(o.currentTarget.dataset.stepIndex);r.toggleStep(f),a(r.getSteps())},[a,r]),g=s.useMemo(()=>Array.from({length:e.length},(o,f)=>({originalIndex:f})),[e]),d=s.useMemo(()=>q(g,h),[g,h]);return n.jsx("div",{className:"flex flex-col gap-1",children:d.map((o,f)=>n.jsx("div",{className:"lg:flex lg:mb-0 mb-3 gap-1 min-h-20 grid grid-cols-8",children:o.map((m,C)=>{const i=m.originalIndex,x=t===i,p=e[i],N=_(f,C),j=i===0,b=i%4===0,v=i%2===0;let S;return x?S="current":b?S="fourths":v?S="eigths":j?S="halfs":S="inactive",n.jsx("div",{className:"relative flex-1",children:n.jsx(st,{$state:S,$armed:p,"data-step-index":i,onClick:k})},N)})},_(f,0)))})},V=(t,e,r)=>Number(((t-e)/(r-e)*100).toFixed(2)),rt=$.div`
  slider
  relative
  w-[200px]
`,ot=$.div`
  slider__track
  absolute
  rounded-sm
  cursor-pointer
  w-full
  h-[7px]
  bg-grayDark
  hover:bg-gray:50
`,lt=$.div`
  slider__range
  absolute
  rounded-sm
  cursor-pointer
  h-[7px]
  bg-primary
  hover:bg-primaryLight/70
`,A=$.input`
  thumb
  thumb::-webkit-slider-thumb
  -webkit-appearance: none;
  pointer-events: none;
  position: absolute;
  height: 0;
  width: auto;
  outline: none;
`,ct={min:0,max:100},it=({multi:t,step:e=1,onChange:r,initialValue:a})=>{const{min:c,max:l}=ct,[h,k]=s.useState(c),[g,d]=s.useState(l),[o,f]=s.useState((c+l)/2),[m,C]=s.useState(!1),i=s.useRef(c),x=s.useRef(l),p=s.useRef(null),N=s.useRef(null),j=s.useCallback(u=>{const y=V(u,c,l);p.current&&(p.current.style.left="0%",p.current.style.width=`${y}%`)},[l,c]),b=s.useCallback((u,y)=>{const M=V(u,c,l),w=V(y,c,l);p.current&&(p.current.style.left=`${M}%`,p.current.style.width=`${w-M}%`)},[l,c]),v=s.useCallback(u=>{m||C(!0);const y=Math.max(Number(u),h+1);r(y),f(y),j(y)},[j,m,h,r]),S=s.useCallback((u,y)=>{m||C(!0);const M=5;if(y==="min"){if(u>=x.current-M)return;k(Math.min(u,x.current-1)),r(u,"min"),b(u,x.current),i.current=u}else{if(u<=i.current+M)return;d(Math.max(u,i.current+1)),r(u,"max"),b(i.current,u),x.current=u}},[b,m,r]);s.useEffect(()=>{if(t){if(b(h,g),a&&!m){const[u,y]=a;k(u),d(y),i.current=u,x.current=y}}else j(o),a&&!m&&f(a)},[b,j,a,m,g,h,t,o]);const P={type:"range",min:c,max:l,step:e},B=u=>{if(!N.current)return;const y=N.current.getBoundingClientRect(),M=u.clientX-y.left,w=Math.round(M/y.width*(l-c)+c);if(t){const z=Math.abs(w-h),H=Math.abs(w-g);z<H?S(w,"min"):S(w,"max")}else v(w)};return n.jsxs("div",{className:"py-3",children:[t?n.jsxs(n.Fragment,{children:[n.jsx(A,{value:h,onChange:u=>S(Number(u.target.value),"min"),className:"thumb thumb--left z-3",...P}),n.jsx(A,{value:g,onChange:u=>S(Number(u.target.value),"max"),className:"thumb thumb--right z-4",...P})]}):n.jsx(A,{value:o,onChange:u=>v(Number(u.target.value)),className:"thumb thumb--single z-4",...P}),n.jsxs(rt,{ref:N,onClick:B,children:[n.jsx(ot,{}),n.jsx(lt,{ref:p})]})]})},ut=$.button.variants({base:`h-40 cursor-pointer transition-colors ${E.transition.twShort}`,variants:{$type:{white:t=>`
        ${t.$pressed?"bg-primary":"bg-white"}
        flex-1
        border-r-3
        border-dark
      `,black:t=>`
        ${t.$pressed?"bg-primary":"bg-dark"}
        flex-1
      `}}}),I=[!0,!1,!0,!1,!0,!0,!1,!0,!1,!0,!1,!0],dt=Array.from({length:128},(t,e)=>({index:e,isWhite:I[e%I.length]})),ht=({sequencer:t})=>{const{tone:e}=R(),[r,a]=s.useState(3),[c,l]=s.useState(null),h=s.useRef(null),k=dt.filter(o=>o.index>=r*12&&o.index<(r+1)*12),g=s.useCallback(o=>{const f=t==null?void 0:t.getSynth(),m=Number(o.currentTarget.dataset.keyIndex);l(m),f&&m&&e&&f.triggerAttackRelease(e.Frequency(m,"midi").toNote(),"16n",e.now(),.5),h.current&&clearTimeout(h.current),h.current=setTimeout(()=>{l(null)},E.transition.timeShort)},[t,e]),d=s.useCallback(o=>{o<0||o>10||a(o)},[]);return n.jsxs(n.Fragment,{children:[n.jsx(W,{className:"text-white mt-5 mb-3",children:"WIP: Piano Roll"}),n.jsx("p",{className:"text-lg mb-3",children:'This piano roll is currently only connected to the same synth, but does not "know" about the played note.'}),n.jsx("div",{className:"w-50 mb-5",children:n.jsx(L,{id:"current-octave",label:"Current Octave",value:r,onDecrease:()=>d(r-1),onIncrease:()=>d(r+1)})}),n.jsx("div",{className:"flex bg-grayDark",children:k.map(o=>n.jsx(ut,{onMouseDown:g,"data-key-index":o.index,$pressed:c===o.index,$type:o.isWhite?"white":"black"},o.index))})]})},mt=(t,e,r)=>t/100*(r-e)+e,gt=(t,e,r)=>Number(((t-e)/(r-e)*100).toFixed(2)),ft=t=>gt(t.value,t.min,t.max),pt=({sequencer:t,compact:e=!1,volume:r,setVolume:a,measures:c,setSequencerMeasures:l,setSequencerSteps:h,steps:k})=>{const{timeSignature:g,isPlaying:d,loopLength:o,transport:f,registerSixteenthTick:m,unregisterSixteenthTick:C}=R(),[i,x]=s.useState(),p=s.useMemo(()=>g*o,[g,o]),N=s.useMemo(()=>p*c,[p,c]);s.useEffect(()=>{function b(){x(v=>typeof v=="number"?(v+1)%N:0)}return m(b),()=>{C(b)}},[N,m,C]),s.useEffect(()=>{d&&x(0)},[d]),s.useEffect(()=>{if(!f)return;const b=f.position,S=F(b,g)%N;x(Math.floor(S))},[g,N,f]);const j=s.useCallback(b=>{if(t){a(b);const v=mt(b,-50,20);t.setVolume(v)}},[t,a]);return n.jsxs("div",{className:"p-4 border-grayDark bg-black border-1",children:[n.jsxs("div",{className:"flex justify-between items-center mb-4",children:[n.jsx(nt,{sequencer:t}),n.jsxs("div",{className:"flex gap-2 items-center",children:[n.jsx("span",{className:"text-sm pt-1 text-grayLight",children:"Volume"}),n.jsx(it,{onChange:j,initialValue:r||ft({min:-50,max:20,value:0})})]})]}),n.jsx(et,{measures:c,setSequencerMeasures:l,setSequencerSteps:h,setActiveStep:x,sequencer:t}),n.jsx(at,{sequencer:t,setSequencerSteps:h,activeStep:i,steps:k}),!e&&n.jsx(ht,{sequencer:t})]})};export{pt as S};
