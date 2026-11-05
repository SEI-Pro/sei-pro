/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Ur(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function ne(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Ur(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function se(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function ce(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function vo(o){let e=o.defaultView;for(let r of[".infraCorBarraSistema","#divInfraBarraSistema","#divInfraBarraSistemaE"]){let t=o.querySelector(r);if(t)try{let a=jr(e?.getComputedStyle?.(t).backgroundColor??"");if(a)return a}catch{}}}function Br(o){let e=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(o);if(!e)return"#1f2328";let[r,t,a]=[e[1],e[2],e[3]].map(n=>Number.parseInt(n??"0",16));return(r*299+t*587+a*114)/1e3>140?"#1f2328":"#ffffff"}function jr(o){let e=o.trim().toLowerCase(),r=null,t=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(e);t&&(r=[t[1],t[2],t[3]].map(p=>Number.parseInt(p??"0",16)));let a=/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(e);if(a){if((a[4]===void 0?1:a[4].endsWith("%")?Number.parseFloat(a[4])/100:Number.parseFloat(a[4]))<.9)return null;r=[a[1],a[2],a[3]].map(b=>Number(b))}if(!r||r.some(p=>!Number.isFinite(p)||p<0||p>255))return null;let[n,s,l]=r,i=Math.max(n,s,l),c=Math.min(n,s,l);if(i===0||(i-c)/i<.25)return null;let d=[n,s,l];for(let p=0;p<12&&Br(ie(d))!=="#ffffff";p++)d=d.map(b=>Math.round(b*.88));return ie(d)}function ie(o){return`#${o.map(e=>e.toString(16).padStart(2,"0")).join("")}`}function g(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var T={fill:"currentColor",stroke:"none"},le="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",ue={estrela:[["path",{d:le}]],estrelaCheia:[["path",{d:le,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...T}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...T}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...T}],["circle",{cx:"12",cy:"12",r:"1.4",...T}],["circle",{cx:"19",cy:"12",r:"1.4",...T}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...T}],["circle",{cx:"15",cy:"6",r:"1.3",...T}],["circle",{cx:"9",cy:"12",r:"1.3",...T}],["circle",{cx:"15",cy:"12",r:"1.3",...T}],["circle",{cx:"9",cy:"18",r:"1.3",...T}],["circle",{cx:"15",cy:"18",r:"1.3",...T}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Aa=Object.keys(ue);function C(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,l]of Object.entries(n))a.setAttribute(s,l);for(let[s,l]of ue[o]){let i=r.createElementNS(t,s);for(let[c,d]of Object.entries(l))i.setAttribute(c,d);a.append(i)}return a}function Gr(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function de(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function xo(o,e,r,t,a){let n=o.body??o.documentElement;for(let p of[n,...o.querySelectorAll("dialog")])for(let b of[...p.children])b.classList.contains("spro-aviso")&&b.remove();let s=g("div",{class:"spro-aviso",role:"status"},C("check",16),g("span",{},e),...Gr(r).map(p=>g("button",{type:"button",onclick:()=>{s.remove(),p.fazer()}},p.rotulo)));s.setAttribute("popover","manual");let l=()=>{try{s.showPopover?.()}catch{}},i=Date.now()+t,c=()=>{let p=de(o);p.append(s),l(),p.localName==="dialog"&&p.addEventListener("close",()=>{if(!(!d||!p.contains(s))){if(a&&de(o).localName!=="dialog"&&a(e,r,Math.max(0,i-Date.now()))){d=!1,s.remove();return}c()}},{once:!0})},d=!0;return c(),setTimeout(()=>{d=!1,s.remove()},t),s}var pe=`/*
 * Base visual dos m\xF3dulos novos do SEI Pro.
 *
 * Tokens no :root (e no :host, para valerem dentro de Shadow DOM: o bal\xE3o que o
 * content script abre na p\xE1gina do SEI). O modo escuro vem de duas formas:
 * for\xE7ado por data-tema (o painel abaixo da lista segue o SEI, que s\xF3 \xE9 escuro
 * com o modo noturno do SEI Pro) ou pelo sistema, quando ningu\xE9m for\xE7ou nada
 * (o painel lateral). A cor de destaque pode vir do tema do SEI
 * (--spro-cor-sei, posta pelo app embutido).
 */
:root,
:host {
  --spro-fundo: #ffffff;
  --spro-fundo-2: #f6f7f9;
  --spro-fundo-3: #eceef2;
  --spro-pagina: #f3f4f7;
  --spro-texto: #1b1f24;
  --spro-suave: #5d6772;
  --spro-fraco: #8b939c;
  --spro-borda: #e3e6eb;
  --spro-borda-forte: #cfd4db;
  --spro-destaque: #1f5fbf;
  --spro-destaque-texto: #ffffff;
  --spro-perigo: #d1352b;
  --spro-aviso: #b45c0a;
  --spro-ok: #12805c;
  --spro-novidade: #6d4fd8;
  --spro-estrela: #f2a516;
  --spro-sombra-1: 0 1px 2px rgb(16 24 40 / 6%);
  --spro-sombra-2: 0 2px 4px -2px rgb(16 24 40 / 8%), 0 6px 14px -4px rgb(16 24 40 / 12%);
  --spro-sombra-3: 0 10px 24px -6px rgb(16 24 40 / 18%), 0 24px 56px -12px rgb(16 24 40 / 24%);
  --spro-veu: rgb(17 21 28 / 46%);
  --spro-raio-p: 6px;
  --spro-raio: 8px;
  --spro-raio-g: 12px;
  --spro-raio-xg: 16px;
  --spro-fonte: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --spro-mono: ui-monospace, "SF Mono", "Cascadia Mono", "Roboto Mono", Menlo, Consolas, monospace;
  --spro-dur: 150ms;
  --spro-curva: cubic-bezier(0.2, 0.8, 0.2, 1);
  --spro-destaque-suave: color-mix(in srgb, var(--spro-destaque) 10%, transparent);
  --spro-destaque-medio: color-mix(in srgb, var(--spro-destaque) 18%, transparent);
  --spro-anel: 0 0 0 3px color-mix(in srgb, var(--spro-destaque) 30%, transparent);
  color-scheme: light;
}
:root[data-tema="escuro"],
:host([data-tema="escuro"]) {
  --spro-fundo: #1a1d21;
  --spro-fundo-2: #22262b;
  --spro-fundo-3: #2b3036;
  --spro-pagina: #141619;
  --spro-texto: #e7e9ec;
  --spro-suave: #a4abb3;
  --spro-fraco: #767e87;
  --spro-borda: #2f343a;
  --spro-borda-forte: #3d434a;
  --spro-destaque: #79acff;
  --spro-destaque-texto: #0a1526;
  --spro-perigo: #ff7d73;
  --spro-aviso: #e8b04a;
  --spro-ok: #4fcf96;
  --spro-novidade: #ab98ff;
  --spro-estrela: #f6b73c;
  --spro-sombra-1: 0 1px 2px rgb(0 0 0 / 30%);
  --spro-sombra-2: 0 2px 4px -2px rgb(0 0 0 / 40%), 0 6px 14px -4px rgb(0 0 0 / 45%);
  --spro-sombra-3: 0 10px 24px -6px rgb(0 0 0 / 50%), 0 24px 56px -12px rgb(0 0 0 / 60%);
  --spro-veu: rgb(0 0 0 / 58%);
  --spro-destaque-suave: color-mix(in srgb, var(--spro-destaque) 14%, transparent);
  --spro-destaque-medio: color-mix(in srgb, var(--spro-destaque) 24%, transparent);
  color-scheme: dark;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema]),
  :host(:not([data-tema])) {
    --spro-fundo: #1a1d21;
    --spro-fundo-2: #22262b;
    --spro-fundo-3: #2b3036;
    --spro-pagina: #141619;
    --spro-texto: #e7e9ec;
    --spro-suave: #a4abb3;
    --spro-fraco: #767e87;
    --spro-borda: #2f343a;
    --spro-borda-forte: #3d434a;
    --spro-destaque: #79acff;
    --spro-destaque-texto: #0a1526;
    --spro-perigo: #ff7d73;
    --spro-aviso: #e8b04a;
    --spro-ok: #4fcf96;
    --spro-novidade: #ab98ff;
    --spro-estrela: #f6b73c;
    --spro-sombra-1: 0 1px 2px rgb(0 0 0 / 30%);
    --spro-sombra-2: 0 2px 4px -2px rgb(0 0 0 / 40%), 0 6px 14px -4px rgb(0 0 0 / 45%);
    --spro-sombra-3: 0 10px 24px -6px rgb(0 0 0 / 50%), 0 24px 56px -12px rgb(0 0 0 / 60%);
    --spro-veu: rgb(0 0 0 / 58%);
    --spro-destaque-suave: color-mix(in srgb, var(--spro-destaque) 14%, transparent);
    --spro-destaque-medio: color-mix(in srgb, var(--spro-destaque) 24%, transparent);
    color-scheme: dark;
  }
}
/* Destaque na cor do tema do SEI (painel abaixo da lista). No escuro, clareado para ter contraste. */
:root[data-cor-sei] {
  --spro-destaque: var(--spro-cor-sei);
}
:root[data-cor-sei][data-tema="escuro"] {
  --spro-destaque: color-mix(in srgb, var(--spro-cor-sei) 45%, #ffffff);
}

/* [hidden] perde para display de classe; o agente aprendeu isso do jeito dif\xEDcil. */
[hidden] {
  /* biome-ignore lint/complexity/noImportantStyles: [hidden] precisa vencer o display das classes */
  display: none !important;
}
.spro-icone {
  flex: none;
  vertical-align: middle;
}

/* ---------- Bot\xF5es ---------- */
.spro-botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  box-shadow: var(--spro-sombra-1);
  cursor: pointer;
  transition:
    background var(--spro-dur),
    border-color var(--spro-dur),
    box-shadow var(--spro-dur),
    color var(--spro-dur);
}
.spro-botao:hover {
  background: var(--spro-fundo-2);
  border-color: color-mix(in srgb, var(--spro-borda-forte) 60%, var(--spro-texto));
}
.spro-botao:active {
  background: var(--spro-fundo-3);
}
.spro-botao .spro-icone {
  color: var(--spro-suave);
}
.spro-botao.primario {
  color: var(--spro-destaque-texto);
  background: var(--spro-destaque);
  border-color: transparent;
  box-shadow:
    var(--spro-sombra-1),
    inset 0 1px 0 rgb(255 255 255 / 14%);
}
.spro-botao.primario .spro-icone {
  color: inherit;
}
.spro-botao.primario:hover {
  background: color-mix(in srgb, var(--spro-destaque) 88%, #000000);
}
.spro-botao.perigo {
  color: var(--spro-perigo);
}
.spro-botao.perigo .spro-icone {
  color: inherit;
}
.spro-botao.primario.perigo {
  color: #ffffff;
  background: var(--spro-perigo);
}
.spro-botao.fantasma {
  background: transparent;
  border-color: transparent;
  box-shadow: none;
}
.spro-botao.fantasma:hover {
  background: var(--spro-fundo-3);
}
.spro-botao.pequeno {
  min-height: 26px;
  padding: 0 9px;
  font-size: 12px;
}
.spro-botao:disabled,
.spro-botao-icone:disabled {
  opacity: 0.5;
  cursor: default;
  pointer-events: none;
}
.spro-botao-icone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--spro-suave);
  background: none;
  border: 0;
  border-radius: var(--spro-raio);
  cursor: pointer;
  transition:
    background var(--spro-dur),
    color var(--spro-dur);
}
.spro-botao-icone:hover,
.spro-botao-icone[aria-expanded="true"] {
  color: var(--spro-texto);
  background: var(--spro-fundo-3);
}
.spro-botao-icone.pequeno {
  width: 26px;
  height: 26px;
}

/* ---------- Campos ---------- */
.spro-campo {
  box-sizing: border-box;
  min-height: 32px;
  min-width: 0;
  padding: 5px 10px;
  font: inherit;
  font-size: 13px;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  transition:
    border-color var(--spro-dur),
    box-shadow var(--spro-dur);
}
.spro-campo::placeholder {
  color: var(--spro-fraco);
}
.spro-campo:hover {
  border-color: color-mix(in srgb, var(--spro-borda-forte) 70%, var(--spro-texto));
}
textarea.spro-campo {
  resize: vertical;
  line-height: 1.45;
  padding: 8px 10px;
}
.spro-campo:focus,
.spro-campo:focus-visible {
  outline: none;
  border-color: var(--spro-destaque);
  box-shadow: var(--spro-anel);
}
.spro-botao:focus-visible,
.spro-botao-icone:focus-visible,
.spro-combo:focus-visible,
.spro-chip:focus-visible,
.spro-segmentado button:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
/* No menu o fundo j\xE1 mostra o item em foco (o foco anda junto com o mouse). */
.spro-menu-item:focus-visible {
  outline: none;
}
input[type="checkbox"],
input[type="radio"] {
  accent-color: var(--spro-destaque);
}

/* ---------- Controle segmentado ---------- */
.spro-segmentado {
  display: inline-flex;
  align-items: stretch;
  gap: 2px;
  padding: 2px;
  background: var(--spro-fundo-3);
  border-radius: calc(var(--spro-raio) + 1px);
}
.spro-segmentado button {
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 26px;
  padding: 0 11px;
  font-size: 12.5px;
  font-weight: 500;
  color: var(--spro-suave);
  border-radius: var(--spro-raio-p);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background var(--spro-dur),
    color var(--spro-dur),
    box-shadow var(--spro-dur);
}
.spro-segmentado button:hover {
  color: var(--spro-texto);
}
.spro-segmentado button[aria-selected="true"],
.spro-segmentado button[aria-pressed="true"],
.spro-segmentado button[aria-checked="true"] {
  color: var(--spro-texto);
  background: var(--spro-fundo);
  box-shadow: var(--spro-sombra-1);
  font-weight: 600;
}

/* ---------- Chips (etiquetas) e p\xEDlulas ---------- */
.spro-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  min-height: 24px;
  padding: 0 10px;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  color: var(--spro-texto);
  background: color-mix(in srgb, var(--cor, var(--spro-fundo-3)) 30%, var(--spro-fundo));
  border: 1px solid color-mix(in srgb, var(--cor, var(--spro-borda-forte)) 60%, transparent);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background var(--spro-dur),
    border-color var(--spro-dur),
    opacity var(--spro-dur);
}
:root[data-tema="escuro"] .spro-chip,
:host([data-tema="escuro"]) .spro-chip {
  background: color-mix(in srgb, var(--cor, var(--spro-fundo-3)) 16%, var(--spro-fundo));
}
@media (prefers-color-scheme: dark) {
  :root:not([data-tema]) .spro-chip,
  :host(:not([data-tema])) .spro-chip {
    background: color-mix(in srgb, var(--cor, var(--spro-fundo-3)) 16%, var(--spro-fundo));
  }
}
.spro-chip::before {
  content: "";
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--cor, var(--spro-fraco));
}
.spro-chip[aria-pressed="false"] {
  color: var(--spro-suave);
  background: transparent;
  border-color: var(--spro-borda-forte);
  border-style: dashed;
}
.spro-pilula {
  --tom: var(--spro-suave);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  min-height: 20px;
  max-width: 100%;
  padding: 0 7px;
  font-size: 11.5px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  color: var(--tom);
  background: color-mix(in srgb, var(--tom) 11%, transparent);
  border-radius: 999px;
  box-sizing: border-box;
}
.spro-pilula > span {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ---------- Seletor inteligente (combobox) ---------- */
.spro-combo {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  box-sizing: border-box;
  min-height: 30px;
  min-width: 0;
  max-width: 100%;
  padding: 0 8px 0 10px;
  font: inherit;
  font-size: 13px;
  text-align: left;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  box-shadow: var(--spro-sombra-1);
  cursor: pointer;
  transition:
    background var(--spro-dur),
    border-color var(--spro-dur),
    box-shadow var(--spro-dur);
}
.spro-combo:hover {
  background: var(--spro-fundo-2);
}
.spro-combo > .spro-icone {
  color: var(--spro-suave);
}
.spro-combo > .spro-icone:last-child {
  margin-left: auto;
  color: var(--spro-fraco);
  transition: transform var(--spro-dur) var(--spro-curva);
}
.spro-combo-aberto {
  border-color: var(--spro-destaque);
  box-shadow: var(--spro-anel);
}
.spro-combo-aberto > .spro-icone:last-child {
  transform: rotate(180deg);
}
.spro-combo-ativo {
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
  border-color: color-mix(in srgb, var(--spro-destaque) 45%, transparent);
}
.spro-combo-ativo:hover {
  background: var(--spro-destaque-medio);
}
.spro-combo-ativo > .spro-icone {
  color: inherit;
}
.spro-combo-texto {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  flex: 1 1 auto;
}
.spro-combo-rotulo {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-combo-vazio {
  color: var(--spro-suave);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spro-combo-compl {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  color: var(--spro-suave);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-combo-erro {
  border-color: var(--spro-perigo);
}
.spro-combo-mais {
  flex: none;
  padding: 1px 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-destaque-texto);
  background: var(--spro-destaque);
  border-radius: 999px;
}
.spro-combo-cor {
  flex: none;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 12%);
}
.spro-combo-pop,
.spro-menu-pop {
  position: fixed;
  z-index: 2147483000;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
  font-family: var(--spro-fonte);
  font-size: 13px;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-3);
  animation: spro-surgir 140ms var(--spro-curva);
  transform-origin: top center;
}
.spro-flutuante-cima {
  transform-origin: bottom center;
}
@keyframes spro-surgir {
  from {
    opacity: 0;
    transform: translateY(-4px) scale(0.98);
  }
}
.spro-combo-cabeca {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  color: var(--spro-fraco);
  border-bottom: 1px solid var(--spro-borda);
}
.spro-combo-busca {
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: 0;
  font: inherit;
  color: var(--spro-texto);
  background: transparent;
  border: 0;
  outline: none;
}
.spro-combo-busca::placeholder {
  color: var(--spro-fraco);
}
.spro-combo-lista {
  flex: 1 1 auto;
  min-height: 0;
  margin: 0;
  padding: 4px;
  overflow: auto;
  list-style: none;
  outline: none;
  overscroll-behavior: contain;
  scrollbar-width: thin;
}
.spro-combo-op {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 6px 8px;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
  user-select: none;
}
.spro-combo-op > .spro-icone {
  color: var(--spro-suave);
}
.spro-combo-op-ativa {
  background: var(--spro-fundo-3);
}
.spro-combo-op[aria-selected="true"] {
  font-weight: 600;
}
.spro-combo-op-textos {
  display: grid;
  gap: 1px;
  min-width: 0;
  flex: 1 1 auto;
}
.spro-combo-op-rotulo {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-combo-op-rotulo mark {
  color: inherit;
  background: color-mix(in srgb, var(--spro-estrela) 35%, transparent);
  border-radius: 2px;
}
.spro-combo-op-linha {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}
.spro-combo-op-linha > .spro-combo-op-rotulo {
  flex: none;
  max-width: 55%;
}
.spro-combo-op-compl {
  min-width: 0;
  overflow: hidden;
  font-size: 12px;
  font-weight: 400;
  color: var(--spro-suave);
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-combo-op-compl mark {
  color: inherit;
  background: color-mix(in srgb, var(--spro-estrela) 35%, transparent);
  border-radius: 2px;
}
.spro-combo-op-desc {
  font-size: 11.5px;
  font-weight: 400;
  color: var(--spro-suave);
  white-space: normal;
}
.spro-combo-caixa {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
  box-sizing: border-box;
  color: var(--spro-destaque-texto);
  border: 1.5px solid var(--spro-borda-forte);
  border-radius: 5px;
  transition:
    background var(--spro-dur),
    border-color var(--spro-dur);
}
.spro-combo-op[aria-selected="true"] .spro-combo-caixa {
  background: var(--spro-destaque);
  border-color: var(--spro-destaque);
}
.spro-combo-caixa .spro-icone {
  stroke-width: 3;
}
.spro-combo-conta {
  flex: none;
  margin-left: auto;
  min-width: 18px;
  padding: 0 6px;
  font-size: 11px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  text-align: center;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
.spro-combo-marca {
  flex: none;
  margin-left: auto;
  display: inline-flex;
  color: var(--spro-destaque);
}
.spro-combo-conta + .spro-combo-marca {
  margin-left: 0;
}
.spro-combo-extras:empty {
  display: none;
}
.spro-combo-nada {
  margin: 0;
  padding: 14px 12px;
  text-align: center;
  color: var(--spro-suave);
}
.spro-combo-resumo {
  margin: 0;
  padding: 6px 12px 7px;
  font-size: 11.5px;
  color: var(--spro-fraco);
  border-top: 1px solid var(--spro-borda);
}
.spro-combo-falha {
  color: var(--spro-perigo);
}
.spro-combo-esqueleto {
  display: flex;
  align-items: center;
  height: 32px;
  padding: 0 8px;
}
.spro-combo-esqueleto > span {
  display: block;
  height: 10px;
  background: linear-gradient(90deg, var(--spro-fundo-3) 25%, var(--spro-fundo-2) 50%, var(--spro-fundo-3) 75%);
  background-size: 200% 100%;
  border-radius: 5px;
  animation: spro-brilho-esqueleto 1.3s linear infinite;
}
@keyframes spro-brilho-esqueleto {
  to {
    background-position: -200% 0;
  }
}
.spro-combo-criar {
  all: unset;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 4px 4px;
  padding: 7px 8px;
  font-weight: 500;
  color: var(--spro-destaque);
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
.spro-combo-criar:hover,
.spro-combo-criar:focus-visible {
  background: var(--spro-destaque-suave);
}
.spro-combo-rodape {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 6px 6px 12px;
  background: var(--spro-fundo-2);
  border-top: 1px solid var(--spro-borda);
}
.spro-combo-total {
  flex: 1;
  font-size: 12px;
  color: var(--spro-suave);
  white-space: nowrap;
}
.spro-combo-acao {
  all: unset;
  padding: 4px 8px;
  font-size: 12px;
  font-weight: 500;
  color: var(--spro-destaque);
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
.spro-combo-acao:hover,
.spro-combo-acao:focus-visible {
  background: var(--spro-destaque-suave);
}
.spro-combo-acao:disabled {
  color: var(--spro-fraco);
  pointer-events: none;
}

/* ---------- Menu ---------- */
.spro-menu-pop {
  padding: 5px;
  overflow: auto;
}
.spro-menu-item {
  all: unset;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px 7px 8px;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
  white-space: nowrap;
}
.spro-menu-item:hover,
.spro-menu-item:focus {
  background: var(--spro-fundo-3);
}
.spro-menu-icone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex: none;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-p);
  box-sizing: border-box;
}
.spro-menu-item:hover .spro-menu-icone,
.spro-menu-item:focus .spro-menu-icone {
  color: var(--spro-destaque);
  background: var(--spro-fundo);
}
.spro-menu-rotulo {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}
.spro-menu-dica {
  font-size: 11.5px;
  color: var(--spro-fraco);
  font-variant-numeric: tabular-nums;
}
.spro-menu-perigo {
  color: var(--spro-perigo);
}
.spro-menu-perigo .spro-menu-icone,
.spro-menu-perigo:hover .spro-menu-icone,
.spro-menu-perigo:focus .spro-menu-icone {
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 10%, transparent);
  border-color: color-mix(in srgb, var(--spro-perigo) 22%, transparent);
}
.spro-menu-sep {
  height: 1px;
  margin: 5px 6px;
  background: var(--spro-borda);
}

/* ---------- Di\xE1logo ---------- */
dialog.spro-dialogo {
  box-sizing: border-box;
  width: min(580px, calc(100vw - 24px));
  max-width: none;
  max-height: min(calc(100vh - 32px), 820px);
  padding: 0;
  font-family: var(--spro-fonte);
  font-size: 13px;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-xg);
  box-shadow: var(--spro-sombra-3);
  overflow: hidden;
}
dialog.spro-dialogo[open] {
  display: flex;
  flex-direction: column;
  animation: spro-dialogo-entrar 180ms var(--spro-curva);
}
@keyframes spro-dialogo-entrar {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.985);
  }
}
dialog.spro-dialogo::backdrop {
  background: var(--spro-veu);
  backdrop-filter: blur(2px);
}
dialog.spro-dialogo > header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 16px 12px 18px;
  flex: none;
}
.spro-dialogo-icone {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 34px;
  height: 34px;
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
  border-radius: var(--spro-raio);
}
dialog.spro-dialogo > header h2 {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 15.5px;
  font-weight: 650;
  letter-spacing: -0.005em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-dialogo-corpo {
  display: grid;
  gap: 12px;
  min-height: 0;
  padding: 2px 18px 18px;
  overflow: auto;
  scrollbar-width: thin;
}
.spro-dialogo-rodape {
  position: sticky;
  bottom: -18px;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  margin: 6px -18px -18px;
  padding: 12px 18px;
  background: var(--spro-fundo-2);
  border-top: 1px solid var(--spro-borda);
}
.spro-dialogo-rodape > .spro-esquerda {
  margin-right: auto;
}

/* ---------- Aviso (toast) ---------- */
.spro-aviso {
  position: fixed;
  left: 50%;
  bottom: 16px;
  z-index: 2147483001;
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: min(560px, calc(100vw - 24px));
  box-sizing: border-box;
  padding: 10px 10px 10px 14px;
  font-family: var(--spro-fonte);
  font-size: 13px;
  line-height: 1.35;
  color: #f3f5f8;
  background: #1f2329;
  border: 1px solid rgb(255 255 255 / 8%);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-3);
  transform: translateX(-50%);
  animation: spro-aviso-entrar 220ms var(--spro-curva);
}
/* Como popover (camada de cima, acima de di\xE1logo aberto): sem a posi\xE7\xE3o e a margem padr\xE3o do navegador. */
.spro-aviso[popover] {
  inset: auto auto 16px 50%;
  margin: 0;
  overflow: visible;
}
.spro-aviso > .spro-icone {
  color: #8fd6b4;
}
.spro-aviso > span {
  flex: 1;
}
@keyframes spro-aviso-entrar {
  from {
    opacity: 0;
    transform: translate(-50%, 10px);
  }
}
.spro-aviso button {
  flex: none;
  padding: 5px 10px;
  font: inherit;
  font-weight: 600;
  color: #9cc3ff;
  background: rgb(255 255 255 / 6%);
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
.spro-aviso button:hover {
  background: rgb(255 255 255 / 12%);
}

@media (prefers-reduced-motion: reduce) {
  .spro-combo-pop,
  .spro-menu-pop,
  dialog.spro-dialogo[open],
  .spro-combo-esqueleto > span,
  .spro-aviso {
    animation: none;
  }
  * {
    transition-duration: 0ms !important;
  }
}
`;function Q(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function me(){try{return window.top?.document??document}catch{return document}}var fe=`/*
 * Capa do processo (quadro do visualizador): faixa de cards no alto (op\xE7\xE3o A da spec) e os dados cadastrais abaixo.
 * O elemento raiz mant\xE9m o id \`capaProcessoPro\` (o Agente de IA e o Estilo Avan\xE7ado o procuram), ent\xE3o as regras do
 * legado para \`div#capaProcessoPro\` (tabela de 90% com 30px de recuo) s\xE3o desfeitas aqui com a classe \`.spro-c-raiz\`.
 * Tokens \`--spro-*\` do base.css; o escuro vem de data-tema="escuro" na raiz (o SEI, n\xE3o o sistema operacional).
 */
div#capaProcessoPro.spro-c-raiz {
  --spro-fundo: #ffffff;
  --spro-fundo-2: #f6f7f9;
  --spro-fundo-3: #eceef2;
  --spro-texto: #1b1f24;
  --spro-suave: #5d6772;
  --spro-fraco: #8b939c;
  --spro-borda: #e3e6eb;
  --spro-borda-forte: #cfd4db;
  --spro-destaque: #1f5fbf;
  --spro-perigo: #d1352b;
  --spro-ok: #12805c;
  color-scheme: light;
  display: block;
  box-sizing: border-box;
  clear: both;
  width: auto;
  max-width: 1100px;
  margin: 0;
  padding: 18px 8px 28px;
  border: 0;
  border-radius: 0;
  background: none;
  font-family: var(--spro-fonte, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif);
  font-size: 13px;
  line-height: 1.45;
  color: var(--spro-texto);
}
div#capaProcessoPro.spro-c-raiz[data-tema="escuro"] {
  --spro-fundo: #1a1d21;
  --spro-fundo-2: #22262b;
  --spro-fundo-3: #2b3036;
  --spro-texto: #e7e9ec;
  --spro-suave: #a4abb3;
  --spro-fraco: #767e87;
  --spro-borda: #2f343a;
  --spro-borda-forte: #3d434a;
  --spro-destaque: #79acff;
  --spro-perigo: #ff7d73;
  --spro-ok: #4fcf96;
  color-scheme: dark;
}
/* Cor do tema do SEI (barra do sistema), posta pelo controle; no escuro, clareada para ter contraste. */
div#capaProcessoPro.spro-c-raiz[data-cor-sei] {
  --spro-destaque: var(--spro-cor-sei);
}
div#capaProcessoPro.spro-c-raiz[data-cor-sei][data-tema="escuro"] {
  --spro-destaque: color-mix(in srgb, var(--spro-cor-sei) 45%, #ffffff);
}
div#capaProcessoPro.spro-c-raiz *,
div#capaProcessoPro.spro-c-raiz *::before,
div#capaProcessoPro.spro-c-raiz *::after {
  box-sizing: border-box;
}

/* ---------- Faixa de cards ---------- */
.spro-c-faixa {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(158px, 1fr));
  gap: 8px;
  margin: 0 0 18px;
  padding: 0;
}
.spro-c-item {
  display: flex;
  min-width: 0;
}
.spro-c-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  margin: 0;
  padding: 9px 12px 10px;
  font: inherit;
  text-align: left;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: 10px;
  box-shadow: 0 1px 2px rgb(16 24 40 / 5%);
}
.spro-c-card .spro-c-rotulo {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: var(--spro-suave);
}
.spro-c-card .spro-c-valor {
  font-size: 20px;
  font-weight: 650;
  line-height: 1.25;
  font-variant-numeric: tabular-nums;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-c-card .spro-c-valor.texto {
  font-size: 15px;
  line-height: 1.7;
}
.spro-c-card .spro-c-detalhe {
  font-size: 11px;
  line-height: 1.35;
  color: var(--spro-fraco);
  overflow-wrap: anywhere;
}
/* "Contar tudo" do card Documentos: discreto, uma linha sob a conta; a barra fina mostra as pastas contadas. */
.spro-c-card .spro-c-card-acao {
  align-self: flex-start;
  margin: 4px 0 0 -4px;
  padding: 1px 6px;
  font: inherit;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-destaque);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
}
.spro-c-card .spro-c-card-acao:hover,
.spro-c-card .spro-c-card-acao:focus-visible {
  background: color-mix(in srgb, var(--spro-destaque) 10%, transparent);
}
.spro-c-progresso {
  height: 3px;
  margin-top: 5px;
  overflow: hidden;
  background: var(--spro-borda);
  border-radius: 2px;
}
.spro-c-progresso > span {
  display: block;
  height: 100%;
  background: var(--spro-destaque);
  transition: width 0.25s ease;
}
@media (prefers-reduced-motion: reduce) {
  .spro-c-progresso > span {
    transition: none;
  }
}
.spro-c-card.pendente {
  cursor: pointer;
  background: transparent;
  border-style: dashed;
  border-color: var(--spro-borda-forte);
  box-shadow: none;
}
.spro-c-card.pendente .spro-c-valor {
  color: var(--spro-fraco);
}
.spro-c-card.pendente .spro-c-detalhe {
  font-weight: 650;
  color: var(--spro-destaque);
}
.spro-c-card.pendente:hover,
.spro-c-card.pendente:focus-visible {
  border-color: var(--spro-destaque);
  background: color-mix(in srgb, var(--spro-destaque) 6%, transparent);
}
.spro-c-card.pendente[aria-busy="true"] {
  cursor: progress;
}
.spro-c-card.pendente[aria-busy="true"] .spro-c-detalhe {
  color: var(--spro-suave);
}
.spro-c-card.pendente.erro .spro-c-detalhe {
  color: var(--spro-perigo);
  white-space: normal;
}
/* Alerta na cor de destaque do usuario (nunca laranja): borda de 1,5 px (1 px + 0,5 px por dentro, sem mexer no layout). */
.spro-c-card.alerta {
  border-color: var(--spro-destaque);
  background: color-mix(in srgb, var(--spro-destaque) 9%, var(--spro-fundo));
  box-shadow: inset 0 0 0 0.5px var(--spro-destaque);
}
.spro-c-card.alerta .spro-c-rotulo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--spro-destaque);
}
.spro-c-card.alerta .spro-c-valor,
.spro-c-card.alerta .spro-c-detalhe {
  font-weight: 600;
  color: var(--spro-destaque);
}
.spro-c-faixa-acoes {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: -10px 0 14px;
}
.spro-c-faixa-acoes:empty {
  display: none;
}

/* ---------- Barra de a\xE7\xF5es e campos ---------- */
.spro-c-corpo {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px 32px;
  align-items: start;
}
@media (max-width: 760px) {
  .spro-c-corpo {
    grid-template-columns: minmax(0, 1fr);
  }
  .spro-c-lado {
    order: -1;
  }
}
.spro-c-barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  margin: 0 0 6px;
}
.spro-c-acao {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin: 0;
  padding: 5px 10px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--spro-destaque);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer;
}
.spro-c-acao:hover,
.spro-c-acao:focus-visible {
  background: color-mix(in srgb, var(--spro-destaque) 10%, transparent);
}
.spro-c-acao.contorno {
  border-color: var(--spro-borda-forte);
  color: var(--spro-texto);
}
.spro-c-acao.pequeno {
  padding: 2px 8px;
  font-size: 11.5px;
}
.spro-c-campos {
  margin: 0;
  padding: 0;
}
.spro-c-campo {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 2px 12px;
  align-items: start;
  padding: 9px 0;
  border-top: 1px solid var(--spro-borda);
}
.spro-c-campo:first-child {
  border-top: 0;
}
@media (max-width: 560px) {
  .spro-c-campo {
    grid-template-columns: minmax(0, 1fr);
  }
}
.spro-c-campo dt {
  display: flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  padding-top: 3px;
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-suave);
}
.spro-c-campo dt .spro-icone {
  flex: none;
  color: var(--spro-destaque);
}
.spro-c-campo dd {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 6px;
  min-width: 0;
  margin: 0;
}
.spro-c-copiavel {
  margin: 0;
  padding: 3px 7px;
  font: inherit;
  text-align: left;
  color: var(--spro-texto);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: copy;
  overflow-wrap: anywhere;
}
.spro-c-copiavel:hover,
.spro-c-copiavel:focus-visible {
  background: var(--spro-fundo-3);
}
.spro-c-copiavel.forte {
  font-weight: 600;
}
.spro-c-icone-botao {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  margin: 0;
  padding: 0;
  color: var(--spro-suave);
  background: transparent;
  border: 0;
  border-radius: 6px;
  cursor: pointer;
}
.spro-c-icone-botao:hover,
.spro-c-icone-botao:focus-visible {
  color: var(--spro-destaque);
  background: var(--spro-fundo-3);
}
.spro-c-urgente {
  display: inline-block;
  padding: 0 7px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.7;
  color: #fff;
  background: var(--spro-perigo);
  border-radius: 999px;
}
.spro-c-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  font-size: 11.5px;
  font-weight: 550;
  line-height: 1.55;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
.spro-c-chip.ok {
  color: var(--spro-ok);
  background: color-mix(in srgb, var(--spro-ok) 12%, transparent);
}
.spro-c-chip.atencao {
  color: var(--spro-destaque);
  background: color-mix(in srgb, var(--spro-destaque) 14%, transparent);
}
.spro-c-chip.vencido {
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 12%, transparent);
}
.spro-c-marcador {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 6px;
}
.spro-c-marcador img {
  width: 16px;
  height: 16px;
  flex: none;
}
.spro-c-nota {
  margin: 0;
  font-size: 12px;
  color: var(--spro-fraco);
}
.spro-c-erro {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 10px;
  color: var(--spro-perigo);
  font-size: 12px;
}
.spro-c-esqueleto {
  display: block;
  width: 100%;
  max-width: 420px;
  height: 11px;
  margin: 5px 0;
  background: linear-gradient(90deg, var(--spro-fundo-3), var(--spro-fundo-2), var(--spro-fundo-3));
  background-size: 200% 100%;
  border-radius: 6px;
  animation: spro-c-brilho 1.4s ease-in-out infinite;
}
@keyframes spro-c-brilho {
  from {
    background-position: 100% 0;
  }
  to {
    background-position: -100% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spro-c-esqueleto {
    animation: none;
  }
}

/* ---------- Lado: QR e aviso do SEI ---------- */
.spro-c-lado {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
  max-width: 260px;
}
.spro-c-qr {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  text-align: center;
  color: var(--spro-fraco);
}
.spro-c-qr svg {
  display: block;
  width: 150px;
  height: 150px;
  background: #fff;
  border: 1px solid var(--spro-borda);
  border-radius: 8px;
}
.spro-c-info {
  max-width: 100%;
  margin: 0;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--spro-texto);
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: 6px;
}
.spro-c-info a,
.spro-c-info * {
  font: inherit;
  color: inherit;
}
.spro-c-info:empty {
  display: none;
}
`;var ge="data-seipro-processo-capa";var he="spro-processo-gantt-abrir",be="spro-processo-capa-pedir",ve="spro-processo-capa-calcular",xe="spro-processo-capa-cancelar",Ao="data-spro-capa-coleta",Ae="spro-processo-capa-contar",Ee="spro-processo-capa-contar-parar",Eo="data-spro-capa-contagem",oo=o=>`processo/pasta-tamanho/${o}`,Pe="processoparado";var eo="processo/",ro=(o,e)=>`${eo}${o}/${e}`,Po=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},yo="processo-historico/",to=(o,e)=>`${yo}${o}/${e}`;async function ye(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}var O=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};var Yr={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function G(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Yr[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}function _(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var Jr={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function ao(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Jr[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function Do(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[l,i]=ao(o,t);r.push(l),t=i;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let l=n[1];r.push(l==="null"?null:l==="true"?!0:l==="false"?!1:Number(l)),t+=l.length;continue}let s=0;for(;t<o.length;){let l=o[t];if(l==="(")s+=1;else if(l===")"){if(s===0)break;s-=1}else if(l===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function y(o){return typeof o=="string"?G(o):o==null?"":String(o)}var Zr=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function X(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Zr))e.add(r[0]);return[...e]}function Kr(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=Do(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=ao(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Qr(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=Do(o,r.index+r[0].length);e.push({tipo:y(t[0]),idPai:y(t[2]),href:y(t[3]),titulo:y(t[5]),icone:y(t[6]),extra:t[8]==null?void 0:y(t[8])})}return e}function De(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Se(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>y(e[1])))]}function we(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var ot=/\s*\(\d{5,}\)\s*$/;function et(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=y(r.args[1]),a=y(r.args[5]),n=y(r.args[7]),s=(r.props.src??"").replace(/&amp;/g,"&"),l=e.find(p=>p.tipo==="ASSINATURA"&&p.idPai===t),{nivel:i,hipotese:c}=De(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:y(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(ot,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(s)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:i,hipotese:c,assinado:!!l,assinaturas:l?l.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(p=>p.tipo==="UNIDADE_GERADORA"&&p.idPai===t)?.extra,link:y(r.args[3]).replace(/&amp;/g,"&"),src:s,acoes:X(r.props.acoes??""),botoes:Se(r.props.acoes??""),funcoes:we(r.props.acoes??"")}})}function Ie(o){let e=o.html,r=Kr(e),t=Qr(e),a=r.find(i=>i.args[0]==="PROCESSO");if(!a)throw new O("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=y(a.args[1]),s=De(t,n),l=et(r,t);return{idProcedimento:n,protocolo:y(a.args[5])||y(a.args[15]),tipo:y(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(i=>i.tipo==="MARCADOR"&&i.idPai===n).map(i=>i.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:l,acoesProcesso:X(a.props.acoes??""),botoesProcesso:Se(a.props.acoes??""),funcoesProcesso:we(a.props.acoes??""),linkProcesso:y(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(i=>i.idPai===n),links:X(e),pagina:o}}var Ga=600*1e3;var Wa=Promise.resolve();var R={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},rt=120*1e3;function M(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var H=(o,e)=>o.startsWith(M(e));function so(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function So(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function wo(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function tt(o){let e=[];return o.forEach((r,t)=>{let a=So(r.dataISO||so(r.data));a&&e.push({a:r,t:a,i:t,d:M(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function Me(o,e){return M(o)===M(e)}function Te(o,e,r){return Me(o.unidade,e)?!o.unidadeNome||!r||M(o.unidadeNome)===M(r):!1}function Y(o,e,r){let t=o.filter(s=>Me(s.unidade,e));if(new Set(t.map(s=>s.unidadeNome?M(s.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(s=>Te(s,e,r));return n.length?n:t}function at(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,s)=>n.recebido.getTime()<r(s)&&s.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(M(n.unidade),[...a.get(M(n.unidade))??[],n]);for(let[n,s]of a){let l=s.some(i=>s.some(c=>i.unidadeNome&&c.unidadeNome&&M(i.unidadeNome)!==M(c.unidadeNome)&&t(i,c)));for(let i of s)i.chave=l&&i.unidadeNome?`${n}|${M(i.unidadeNome)}`:n}}function Ce(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${R.remetidoPrefixo}`,"i"),"")).trim()}function nt(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function Ne(o,e){let r=tt(o),t=[],a=[],n=[],s=[],l=(u,m)=>Y(a,u,m)[0],i=(u,m)=>{let f=Y(n,u,m)[0];return f?n.indexOf(f):-1},c=(u,m)=>{let{a:f}=u;if(a.some(P=>Te(P,f.unidade,f.unidadeNome)))return;let h={unidade:f.unidade,...f.unidadeNome?{unidadeNome:f.unidadeNome}:{},chave:"",recebido:u.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:m,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:f.usuario,...f.usuarioNome?{usuarioRecebeuNome:f.usuarioNome}:{}},x=i(f.unidade,f.unidadeNome);if(x>=0){let[P]=n.splice(x,1);h.chegouEm=P.em,h.origem=P.origem}a.push(h),t.push(h)},d=(u,m,f)=>{u.remetido=m.t,u.fim=f,u.usuarioEnviou=m.a.usuario,m.a.usuarioNome&&(u.usuarioEnviouNome=m.a.usuarioNome),a.splice(a.indexOf(u),1)},p=u=>{let{a:m}=u;if(l(m.unidade,m.unidadeNome))return;let f=i(m.unidade,m.unidadeNome),h={em:u.t,unidade:m.unidade,...m.unidadeNome?{unidadeNome:m.unidadeNome}:{},origem:Ce(m),usuario:m.usuario,...m.usuarioNome?{usuarioNome:m.usuarioNome}:{}};f>=0?n[f]=h:n.push(h)};for(let u=0;u<r.length;){let m=u+1;for(;m<r.length&&r[m].t.getTime()===r[u].t.getTime();)m+=1;let f=r.slice(u,m);u=m;for(let h of f)H(h.d,R.remetidoPrefixo)&&p(h);for(let h of f)H(h.d,R.recebido)&&c(h,"recebido");for(let h of f){let{a:x,d:P}=h;if(R.gerado.some(E=>H(P,E)))c(h,"gerado");else if(H(P,R.reabertura))c(h,"reabertura");else if(H(P,R.conclusao)){let E=l(x.unidade,x.unidadeNome);E&&d(E,h,"conclusao")}else if(H(P,R.remetidoPrefixo)){let E=Ce(x),N=x.unidadeCitadaNome,A=l(E,N);if(A)d(A,h,"remessa"),A.destinos.push(x.unidade);else{let I=Y(t,E,N).at(-1);I?.fim==="remessa"&&I.remetido&&h.t.getTime()-I.remetido.getTime()<=rt&&!I.destinos.includes(x.unidade)&&I.destinos.push(x.unidade)}}else H(P,R.documentoGerado)?s.push({ev:h,assinado:!1}):H(P,R.documentoAssinado)&&s.push({ev:h,assinado:!0})}}for(let u of n)t.push({unidade:u.unidade,...u.unidadeNome?{unidadeNome:u.unidadeNome}:{},chave:"",recebido:u.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:u.em,origem:u.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:u.usuario,...u.usuarioNome?{usuarioEnviouNome:u.usuarioNome}:{}});for(let{ev:u,assinado:m}of s){let{a:f}=u,h=Y(t.filter(E=>!E.pendenteRecebimento&&E.recebido.getTime()<=u.t.getTime()),f.unidade,f.unidadeNome),x=[...h].reverse().find(E=>E.remetido===null||u.t.getTime()<=E.remetido.getTime())??h[h.length-1];if(!x)continue;let P={...f.nrSei?{nrSei:f.nrSei}:{},...f.idDocumento?{idDocumento:f.idDocumento}:{},em:u.t,titulo:nt(f),...f.usuario?{usuario:f.usuario}:{}};(m?x.assinaturas:x.documentos).push(P)}t.sort((u,m)=>u.recebido.getTime()-m.recebido.getTime());for(let u of o){if(!u.aberto)continue;let m=Y(t.filter(f=>!f.pendenteRecebimento),u.unidade,u.unidadeNome).at(-1);m?.fim==="remessa"&&m.remetido&&(m.enviouEm=m.remetido,m.remetido=null,m.fim=null,m.mantidoAberto=!0)}let b=wo(e).getTime();for(let u of t)u.emCurso=u.remetido===null,u.duracaoMs=Math.max(0,(u.remetido?.getTime()??b)-u.recebido.getTime());return at(t,b),t.sort((u,m)=>u.recebido.getTime()-m.recebido.getTime())}function st(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function it(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Oo(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],l=st(o.html);return{host:new URL(o.url).host,versao:l,maior:Number(l.split(".")[0])||0,unidade:{id:it(o),sigla:_(r)||_(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var Co=(o,e)=>o>0&&e-o<18e5;var dt=/[\u0300-\u036f]/g,ke=o=>o.normalize("NFD").replace(dt,""),To=o=>ke(o).toLowerCase().replace(/\s+/g," ").trim(),Mo=o=>String(o).padStart(2,"0"),pt=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Re=/(\d{1,2}):(\d{2})/;function Le(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=ke(e),t=r.length===e.length?r:e,a=pt.exec(t);if(!a)return{prazo:null,texto:e};let n=Re.exec(t.slice(a.index+a[0].length))??Re.exec(t),s=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),l=`${a[3]}-${Mo(Number(a[2]))}-${Mo(Number(a[1]))}`,i=n?`${Mo(Number(n[1]))}:${n[2]}`:"23:59",c=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=c?`${e.slice(0,c.index)} ${e.slice(c.index+c[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:l,hora:i,vencimento:s},texto:d}}var mt=864e5;function qe(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,s]=o.hora.split(":").map(Number),l=new Date(r??1970,(t??1)-1,a??1,n??23,s??59),i=new Date(e.getFullYear(),e.getMonth(),e.getDate()),c=new Date(l.getFullYear(),l.getMonth(),l.getDate()),d=Math.round((c.getTime()-i.getTime())/mt);return d===0?{rotulo:l.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:l.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function He(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function ze(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}function Fe(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function $e(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function Ve(o,e,r){return[{unidade:e,observacao:$e(o)},...r.map(a=>({unidade:a.unidade,observacao:$e(a.observacao)}))].filter(a=>a.observacao)}function Ue(o,e){return`${o}|${e}`}function Be(o){let e=Oo(Q(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}var je="spro-processo-estilo",No="";function Ge(o){No=o}function We(o){if(!No||o.getElementById(je))return;let e=o.createElement("style");e.id=je,e.textContent=No,(o.head??o.documentElement).append(e)}function Xe(o){let e=ce(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Ye(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function Je(o){o.documentElement?.setAttribute(ge,"1")}function Ze(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}function Ke(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}var ht=1e4;function co(o){if(!o.getElementById("frmArvore"))return null;try{return Ie(Q(o))}catch{return null}}function Qe(o,e=ht){return new Promise(r=>{let t=co(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,s=!1,l=b=>{s||(s=!0,c?.disconnect(),clearTimeout(p),clearInterval(d),r(b))},i=()=>{let b=co(o);b&&l(b)},c=typeof n=="function"&&o.documentElement?new n(i):null;c?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(i,250),p=setTimeout(()=>l(null),e)})}var Lo=[{blocos:[[1,16]],ec:10},{blocos:[[1,28]],ec:16},{blocos:[[1,44]],ec:26},{blocos:[[2,32]],ec:18},{blocos:[[2,43]],ec:24},{blocos:[[4,27]],ec:16},{blocos:[[4,31]],ec:18},{blocos:[[2,38],[2,39]],ec:22},{blocos:[[3,36],[2,37]],ec:22},{blocos:[[4,43],[1,44]],ec:26}],bt=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]],_o=1335,vt=21522,Ro=7973,Z=new Uint8Array(512),ko=new Uint8Array(256);(()=>{let o=1;for(let e=0;e<255;e++)Z[e]=o,ko[o]=e,o<<=1,o&256&&(o^=285);for(let e=255;e<512;e++)Z[e]=Z[e-255]??0})();var or=(o,e)=>o===0||e===0?0:Z[(ko[o]??0)+(ko[e]??0)]??0;function xt(o){let e=[1];for(let r=0;r<o;r++){let t=new Array(e.length+1).fill(0);for(let a=0;a<e.length;a++)t[a]=(t[a]??0)^(e[a]??0),t[a+1]=(t[a+1]??0)^or(e[a]??0,Z[r]??0);e=t}return e.slice(1)}function At(o,e){let r=xt(e),t=new Array(e).fill(0);for(let a of o){let n=a^(t.shift()??0);if(t.push(0),n!==0)for(let s=0;s<e;s++)t[s]=(t[s]??0)^or(r[s]??0,n)}return t}var z=o=>{let e=0;for(;o!==0;)e++,o>>>=1;return e};function Et(o){let e=o<<10;for(;z(e)-z(_o)>=0;)e^=_o<<z(e)-z(_o);return(o<<10|e)^vt}function Pt(o){let e=o<<12;for(;z(e)-z(Ro)>=0;)e^=Ro<<z(e)-z(Ro);return o<<12|e}var er=o=>(Lo[o-1]?.blocos??[]).reduce((e,[r,t])=>e+r*t,0);function yt(o,e){let r=er(e),t=[],a=(m,f)=>{for(let h=f-1;h>=0;h--)t.push(m>>>h&1)};a(4,4),a(o.length,e<10?8:16);for(let m of o)a(m,8);let n=r*8;for(a(0,Math.min(4,n-t.length));t.length%8!==0;)t.push(0);let s=[];for(let m=0;m<t.length;m+=8)s.push(Number.parseInt(t.slice(m,m+8).join(""),2));for(let m=0;s.length<r;m++)s.push(m%2===0?236:17);let{blocos:l,ec:i}=Lo[e-1],c=[],d=[],p=0;for(let[m,f]of l)for(let h=0;h<m;h++){let x=s.slice(p,p+f);p+=f,c.push(x),d.push(At(x,i))}let b=[],u=Math.max(...c.map(m=>m.length));for(let m=0;m<u;m++)for(let f of c)m<f.length&&b.push(f[m]??0);for(let m=0;m<i;m++)for(let f of d)b.push(f[m]??0);return b}function Dt(o,e,r){switch(o){case 0:return(e+r)%2===0;case 1:return e%2===0;case 2:return r%3===0;case 3:return(e+r)%3===0;case 4:return(Math.floor(e/2)+Math.floor(r/3))%2===0;case 5:return e*r%2+e*r%3===0;case 6:return(e*r%2+e*r%3)%2===0;default:return(e*r%3+(e+r)%2)%2===0}}function $o(o,e,r){let t=o.length;for(let a=-1;a<=7;a++)for(let n=-1;n<=7;n++){if(e+a<0||t<=e+a||r+n<0||t<=r+n)continue;let s=a>=0&&a<=6&&(n===0||n===6)||n>=0&&n<=6&&(a===0||a===6)||a>=2&&a<=4&&n>=2&&n<=4;o[e+a][r+n]=s}}function St(o,e){let r=bt[e-1]??[];for(let t of r)for(let a of r)if(o[t][a]===null)for(let n=-2;n<=2;n++)for(let s=-2;s<=2;s++)o[t+n][a+s]=Math.max(Math.abs(n),Math.abs(s))!==1}function wt(o){for(let e=8;e<o.length-8;e++){let r=o[e];r[6]===null&&(r[6]=e%2===0);let t=o[6];t[e]===null&&(t[e]=e%2===0)}}function It(o,e,r){let t=o.length,a=Et(0|e);for(let n=0;n<15;n++){let s=!r&&(a>>n&1)===1;n<6?o[n][8]=s:n<8?o[n+1][8]=s:o[t-15+n][8]=s}for(let n=0;n<15;n++){let s=!r&&(a>>n&1)===1;n<8?o[8][t-n-1]=s:n<9?o[8][15-n-1+1]=s:o[8][15-n-1]=s}o[t-8][8]=!r}function Ot(o,e,r){if(e<7)return;let t=o.length,a=Pt(e);for(let n=0;n<18;n++){let s=!r&&(a>>n&1)===1;o[Math.floor(n/3)][n%3+t-8-3]=s,o[n%3+t-8-3][Math.floor(n/3)]=s}}function Ct(o,e,r){let t=o.length,a=-1,n=t-1,s=7,l=0;for(let i=t-1;i>0;i-=2)for(i===6&&i--;;){for(let c=0;c<2;c++){let d=o[n];if(d[i-c]!==null)continue;let p=!1;l<e.length&&(p=((e[l]??0)>>>s&1)===1),Dt(r,n,i-c)&&(p=!p),d[i-c]=p,s--,s===-1&&(l++,s=7)}if(n+=a,n<0||t<=n){n-=a,a=-a;break}}}function Mt(o,e,r,t){let a=17+4*e,n=Array.from({length:a},()=>new Array(a).fill(null));return $o(n,0,0),$o(n,a-7,0),$o(n,0,a-7),St(n,e),wt(n),It(n,r,t),Ot(n,e,t),Ct(n,o,r),n.map(s=>s.map(l=>l===!0))}function Tt(o){let e=o.length,r=(i,c)=>o[i][c]===!0,t=0;for(let i=0;i<2;i++)for(let c=0;c<e;c++){let d=1;for(let p=1;p<e;p++)(i===0?r(c,p)===r(c,p-1):r(p,c)===r(p-1,c))?d++:(d>=5&&(t+=3+(d-5)),d=1);d>=5&&(t+=3+(d-5))}for(let i=0;i<e-1;i++)for(let c=0;c<e-1;c++){let d=r(i,c);d===r(i,c+1)&&d===r(i+1,c)&&d===r(i+1,c+1)&&(t+=3)}let a=[!0,!1,!0,!0,!0,!1,!0],n=(i,c,d,p)=>a.every((b,u)=>r(i+d*u,c+p*u)===b),s=(i,c,d,p)=>{for(let b=0;b<4;b++){let u=i+d*b,m=c+p*b;if(u<0||m<0||u>=e||m>=e||r(u,m))return!1}return!0};for(let i=0;i<e;i++)for(let c=0;c<e;c++)c+6<e&&n(i,c,0,1)&&(s(i,c-4,0,1)||s(i,c+7,0,1))&&(t+=40),i+6<e&&n(i,c,1,0)&&(s(i-4,c,1,0)||s(i+7,c,1,0))&&(t+=40);let l=0;for(let i=0;i<e;i++)for(let c=0;c<e;c++)r(i,c)&&l++;return t+=Math.floor(Math.abs(l*100/(e*e)-50)/5)*10,t}function rr(o){let e=new TextEncoder().encode(o),r=0;for(let s=1;s<=Lo.length;s++){let l=4+(s<10?8:16);if(Math.ceil((l+e.length*8)/8)<=er(s)){r=s;break}}if(!r)return null;let t=yt(e,r),a=null,n=Number.POSITIVE_INFINITY;for(let s=0;s<8;s++){let l=Mt(t,r,s,!1),i=Tt(l);i<n&&(n=i,a=l)}return a}var Ho="capaProcessoPro";function ar(){let o=g("div",{class:"spro-c-faixa",role:"list","aria-label":"Resumo do processo"}),e=g("div",{class:"spro-c-faixa-acoes"}),r=g("div",{class:"spro-c-barra"}),t=g("dl",{class:"spro-c-campos"}),a=g("div",{class:"spro-c-qr"}),n=g("div",{class:"spro-c-info"}),s=g("aside",{class:"spro-c-lado"},a,n);return{raiz:g("div",{id:Ho,class:"spro-c-raiz","data-spro-capa":"1"},o,e,g("div",{class:"spro-c-corpo"},g("div",{class:"spro-c-principal"},r,t),s)),faixa:o,faixaAcoes:e,barra:r,campos:t,lado:s,qr:a,info:n}}function Nt(o,e){return[g("span",{class:"spro-c-rotulo"},e,o.rotulo),g("strong",{class:`spro-c-valor${/^\d/.test(o.valor)||o.valor==="\u2014"?"":" texto"}`},o.valor),o.detalhe?g("span",{class:"spro-c-detalhe"},o.detalhe):null]}function _t(o,e){return g("div",{class:`spro-c-card${o.alerta?" alerta":""}`,"data-id":o.id,"aria-label":o.alerta?`Aten\xE7\xE3o. ${o.rotulo}: ${o.valor}. ${o.detalhe??""}`:void 0},...Nt(o,o.alerta?C("alerta",12):null),o.progresso?g("div",{class:"spro-c-progresso",role:"progressbar","aria-label":"Contando as pastas","aria-valuemin":"0","aria-valuemax":String(o.progresso.total),"aria-valuenow":String(o.progresso.feito)},g("span",{style:`width:${Math.round(o.progresso.feito/Math.max(1,o.progresso.total)*100)}%`})):null,o.acao?Rt(o,o.acao,e):null)}function Rt(o,e,r){return g("button",{type:"button",class:"spro-c-card-acao","data-acao":e.tipo,"aria-label":e.tipo==="parar"?"Parar a contagem das pastas":`${e.rotulo}: carregar as pastas fechadas para contar os documentos`,onclick:()=>e.tipo==="parar"?r.pararContagem():r.contar()},e.rotulo)}function $t(o,e,r){let t=e.coleta,a=t.fase==="coletando",n=a?t.total>0?`Calculando... p\xE1gina ${t.feito} de ${t.total}`:"Calculando...":t.fase==="erro"?`${t.mensagem} Tentar de novo`:"Calcular";return g("button",{type:"button",class:`spro-c-card pendente${t.fase==="erro"?" erro":""}`,"data-id":o.id,"aria-busy":a?"true":void 0,"aria-label":a?`${o.rotulo}: ${n}`:`${o.rotulo}: ${n==="Calcular"?"calcular a partir do hist\xF3rico do processo":n}`,onclick:()=>{a||r.calcular()}},g("span",{class:"spro-c-rotulo"},o.rotulo),g("strong",{class:"spro-c-valor"},o.valor),g("span",{class:"spro-c-detalhe"},n))}function nr(o,e,r){o.faixa.replaceChildren(...e.cards.map(t=>g("div",{class:"spro-c-item",role:"listitem"},t.estado==="pendente"?$t(t,e,r):_t(t,r)))),o.faixaAcoes.replaceChildren(...e.coleta.fase==="coletando"?[g("button",{type:"button",class:"spro-c-acao pequeno contorno",onclick:()=>r.cancelar()},"Cancelar o c\xE1lculo")]:[])}function w(o,e,r,...t){return g("div",{class:"spro-c-campo","data-campo":r},g("dt",{},C(e,15),o),g("dd",{},...t))}var $=(o,e,r=!1)=>g("button",{type:"button",class:`spro-c-copiavel${r?" forte":""}`,"aria-label":`Copiar: ${e}`,onclick:()=>o.copiarTexto(e)},e);function tr(o,e){return e.length?e.map(r=>$(o,r)):[g("span",{class:"spro-c-nota"},"Nenhum")]}function kt(o,e){return g("span",{class:"spro-c-marcador"},e.icone?g("img",{src:e.icone,alt:""}):C("etiqueta",15),$(o,e.nome,!0),e.prazo?g("span",{class:`spro-c-chip ${e.prazo.nivel}`},C("relogio",11),e.prazo.rotulo):null,e.texto?$(o,e.texto):null)}function Lt(o,e){switch(o.dados){case"carregando":return w("Dados do processo","nota","dados",g("div",{class:"spro-c-esqueleto","aria-busy":"true","aria-label":"Carregando"}),g("div",{class:"spro-c-esqueleto",style:"width:60%"}));case"indisponivel":return w("Dados do processo","nota","dados",g("span",{class:"spro-c-erro",role:"alert"},C("alerta",13),"N\xE3o foi poss\xEDvel carregar autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados.",g("button",{type:"button",class:"spro-c-acao pequeno",onclick:()=>e.tentarDeNovo()},"Tentar de novo")));case"consultas":return w("Dados do processo","nota","dados",g("p",{class:"spro-c-nota"},"Autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados n\xE3o aparecem: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro."));case"fechado":return w("Dados do processo","nota","dados",g("p",{class:"spro-c-nota"},"Autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados aparecem quando o processo est\xE1 aberto na sua unidade."));default:return null}}function sr(o,e,r){let t=[];t.push(w("Processo","pasta","processo",$(r,e.protocolo,!0),g("button",{type:"button",class:"spro-c-icone-botao","aria-label":"Copiar o link do processo",onclick:()=>r.copiarLink()},C("link",15)))),e.sigiloso||e.dados==="pronto"&&e.autuacao&&t.push(w("Data de autua\xE7\xE3o","calendario","autuacao",$(r,e.autuacao))),t.push(w("Tipo do processo","documento","tipo",e.tipo?$(r,e.tipo):g("span",{class:"spro-c-nota"},"N\xE3o informado"))),e.sigiloso||(e.dados==="pronto"?t.push(w("Especifica\xE7\xE3o","nota","especificacao",e.urgente?g("span",{class:"spro-c-urgente"},"URGENTE"):null,e.especificacao?$(r,e.especificacao):g("span",{class:"spro-c-nota"},"Sem especifica\xE7\xE3o")),w("Assuntos","etiqueta","assuntos",...tr(r,e.assuntos)),w("Interessados","pessoa","interessados",...tr(r,e.interessados))):t.push(Lt(e,r))),t.push(w("N\xEDvel de acesso",e.nivel.icone,"nivel",$(r,e.nivel.rotulo))),e.sigiloso||(t.push(w("Marcador","etiqueta","marcador",...e.marcadores.length||e.prazoNativo?[...e.marcadores.map(a=>kt(r,a)),e.prazoNativo?g("span",{class:`spro-c-chip ${e.prazoNativo.nivel==="vencido"?"vencido":"ok"}`},C("relogio",11),`Prazo do SEI: ${e.prazoNativo.data} (${e.prazoNativo.estado})`):null]:[g("span",{class:"spro-c-nota"},"Sem marcador")])),e.blocoInterno&&t.push(w("Bloco interno","camadas","bloco",$(r,e.blocoInterno))),e.dados==="pronto"&&t.push(w("Observa\xE7\xF5es","nota","observacoes",...e.observacoes.length?e.observacoes.map(a=>$(r,`${a.unidade}: ${a.observacao}`)):[g("span",{class:"spro-c-nota"},"Sem observa\xE7\xF5es")]))),o.campos.replaceChildren(...t.filter(Boolean))}function ir(o,e,r){let t=[];e.sigiloso||t.push(g("button",{type:"button",class:"spro-c-acao","data-acao":"historico",onclick:()=>r.abrirHistorico()},C("historico",15),"Hist\xF3rico de tramita\xE7\xE3o do processo")),t.push(g("button",{type:"button",class:"spro-c-acao contorno","data-acao":"resumo",onclick:()=>r.copiarResumo()},C("copiar",14),"Copiar resumo")),o.barra.replaceChildren(...t)}var qo="http://www.w3.org/2000/svg";function qt(o,e){let r=rr(e);if(!r)return null;let t=r.length,a=4,n=t+a*2,s=o.createElementNS(qo,"svg");s.setAttribute("viewBox",`0 0 ${n} ${n}`),s.setAttribute("role","img"),s.setAttribute("aria-label","QR code para abrir o processo no celular"),s.setAttribute("shape-rendering","crispEdges");let l=o.createElementNS(qo,"rect");l.setAttribute("width",String(n)),l.setAttribute("height",String(n)),l.setAttribute("fill","#ffffff");let i=[];r.forEach((d,p)=>{let b=0;for(;b<t;){if(!d[b]){b++;continue}let u=b;for(;u<t&&d[u];)u++;i.push(`M${b+a} ${p+a}h${u-b}v1h-${u-b}z`),b=u}});let c=o.createElementNS(qo,"path");return c.setAttribute("d",i.join("")),c.setAttribute("fill","#000000"),s.append(l,c),s}function cr(o,e,r){let t=qt(r,e.linkPermanente);o.qr.replaceChildren(...t?[t,g("span",{},"Aponte a c\xE2mera para abrir o processo no celular")]:[])}function lr(o,e){if(!e){o.info.replaceChildren();return}let r=[...e.childNodes].map(t=>t.cloneNode(!0));for(let t of r)if(t.nodeType===1)for(let a of[t,...t.querySelectorAll("[id]")])a.removeAttribute("id");o.info.replaceChildren(...r)}function zo(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Ht(o,e){let r=e.replace("PASTA",""),t=o.getElementById(`spanAGUARDE${r}`);return t?t.textContent??"":null}function Fo(o,e){if(!o.getElementById(`anchor${e}`))return"ausente";let r=o.getElementById(`div${e}`);if(!r)return"pendente";if(r.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])'))return"carregada";let t=Ht(o,e);if(t===null)return r.children.length>0?"carregada":"pendente";let a=zo(t);return a.startsWith("nenhum protocolo")?"carregada":a.startsWith("erro")||a.startsWith("nao foi possivel")?"falhou":"pendente"}var Ci=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function zt(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function ur(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=zt((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),s=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),l=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:Ft(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:s,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:l||void 0,link:"",src:"",acoes:[],botoes:[]}}function Ft(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}var dr=/^anchor(\d+(?:-\d+)?)$/;function Vt(o,e){let r=o.getElementById(`iconNA${e}`)?.getAttribute("src")??"";return/sigiloso/.test(r)?"sigiloso":/restrito/.test(r)?"restrito":"publico"}function pr(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function Ut(o){let e="";try{e=o.pagina.html}catch{e=""}let r=[...e.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)","([^"]*)"/g)].map(a=>({id:a[1],pai:a[2]})),t=new Map;for(let a of o.documentos)a.pasta&&t.set(a.pasta,(t.get(a.pasta)??0)+1);return{documentos:[...o.documentos],fonte:"html",pastas:r.map(a=>({id:a.id,carregada:t.has(a.id),nos:t.get(a.id)??0,topo:!a.pai.startsWith("PASTA")}))}}function B(o,e){let r=o?[...o.querySelectorAll('a[id^="anchorPASTA"]')].filter(i=>/^anchorPASTA\d+$/.test(i.id)):[];if(!o||!r.length)return Ut(e);let t=[...o.querySelectorAll("#divArvore a.infraArvoreNo")].filter(i=>{let c=dr.exec(i.id);return!!c&&c[1]!==e.idProcedimento}),a=new Map;for(let i of t){let c=pr(i);c&&a.set(c,(a.get(c)??0)+1)}let n=new Map(e.documentos.map(i=>[i.id,i])),s=new Map;for(let i of t){let c=dr.exec(i.id)[1],d=pr(i),p=n.get(c);if(p){s.set(c,p.pasta===d?p:{...p,pasta:d});continue}let b=ur(o,c);b&&s.set(c,{...b,pasta:d,nivel:Vt(o,c)})}for(let i of e.documentos)s.has(i.id)||s.set(i.id,i);let l=r.map(i=>{let c=i.id.slice(6),d=Fo(o,c)==="carregada";return{id:c,carregada:d,nos:d?a.get(c)??0:0,topo:!i.closest('div[id^="divPASTA"]')}});return{documentos:[...s.values()],pastas:l,fonte:"dom"}}var mr=o=>String(o).padStart(2,"0");var j=o=>`${mr(o.getUTCDate())}/${mr(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`;function Vo(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var fr=o=>o.recebido.getTime()+o.duracaoMs,gr=(o,e)=>e&&o?`${e} (${o})`:e??o??"";function Uo(o,e){let r=To(e);if(!r)return null;let t=o.filter(a=>a.emCurso&&To(a.unidade)===r);return t.length?t.reduce((a,n)=>n.recebido.getTime()>=a.recebido.getTime()?n:a):null}function br(o,e){return Math.max(0,Math.floor((wo(e).getTime()-o.getTime())/864e5))}function vr(o,e){if(o.passagens){let r=Uo(o.passagens,o.sigla);if(r)return{dias:br(r.recebido,e),desde:r.recebido,origem:"historico"}}return o.recebidoEm?{dias:br(o.recebidoEm,e),desde:o.recebidoEm,origem:"recebimento"}:null}var xr=(o,e)=>e>0&&o!==null&&o.dias>e;function Ar(o){if(o==null||o==="")return 15;let e=typeof o=="number"?o:Number(String(o).replace(",","."));return!Number.isFinite(e)||e<0?15:Math.floor(e)}function Er(o,e){try{let r=o.getItem("configDataRecebimentoPro");if(!r)return null;let t=JSON.parse(r);if(!Array.isArray(t))return null;let a=t.find(l=>l&&typeof l=="object"&&String(l.id_procedimento)===e);if(!a||typeof a.datahora!="string")return null;let n=/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(a.datahora.trim()),s=n?`${n[1]}T${n[2]}:00`:so(a.datahora);return s?So(s):null}catch{return null}}function jt(o){let e=(o??"").split(/\n+/).map(n=>n.replace(/\s+/g," ").trim()).filter(Boolean);if(!e.length)return"";let[r="",...t]=e;return(t.length?`${r}${r.endsWith(":")?" ":", "}${t.join(", ")}`:r).replace(/\.$/,"")}var K=(o,e,r)=>`${o} ${o===1?e:r}`;function Pr(o){if(o.sigiloso)return o.protocolo;let e=[`Processo ${o.protocolo}`];o.tipo&&e.push(`Tipo: ${o.tipo}`);let r=(o.interessados??[]).filter(Boolean);r.length&&e.push(`${r.length>1?"Interessados":"Interessado"}: ${r.join("; ")}`);let t=jt(o.situacao);if(t&&e.push(`Situa\xE7\xE3o: ${t}`),o.unidade){let n=o.diasNaUnidade;e.push(`Unidade atual: ${o.unidade}${typeof n=="number"?` (${K(n,"dia","dias")} na unidade)`:""}`)}let a=o.documentos;if(a){let n=`${K(a.internos,"interno","internos")}, ${K(a.externos,"externo","externos")}; ${K(a.assinados,"assinado","assinados")}; ${K(a.cancelados,"cancelado","cancelados")}`;e.push(a.estimado?`Documentos: ${a.estimado} (nas pastas abertas: ${a.total}; ${n})`:`Documentos: ${a.total} (${n})`)}return e.join(`
`)}var Bo=20,Gt=2,Wt=1e3,lo=o=>typeof o=="number"&&Number.isInteger(o)&&o>=Gt&&o<=Wt;function Xt(o,e){try{let r=Number(o.getItem(oo(e)));return lo(r)?r:null}catch{return null}}function Yt(o){try{let e=o.getItem("optionsPro"),r=e?JSON.parse(e):null,t=Number(r?.sumDocsPasta);return lo(t)?t:null}catch{return null}}function Jt(o){let e=new Map;for(let a of o)!a.carregada||a.ultima||!lo(a.nos)||e.set(a.nos,(e.get(a.nos)??0)+1);let r=null,t=0;for(let[a,n]of e)(n>t||n===t&&r!==null&&a>r)&&(r=a,t=n);return r}function Zt(o,e,r){if(!lo(r)||typeof o.setItem!="function")return!1;try{return String(o.getItem(oo(e)))===String(r)?!1:(o.setItem(oo(e),String(r)),!0)}catch{return!1}}function yr(o,e,r){let t=Jt(o);if(t!==null)return Zt(e,r,t),{valor:t,origem:"medido"};let a=Xt(e,r);if(a!==null)return{valor:a,origem:"aprendido"};let n=Yt(e);return n!==null?{valor:n,origem:"legado"}:{valor:Bo,origem:"padrao"}}function Dr(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function Sr(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,fr(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}function uo(o,e,r){let t=o.filter(i=>!i.carregada),a=[...o].reverse().find(i=>i.topo),n=!!a&&!a.carregada,s=t.length-(n?1:0);if(!t.length)return{exato:!0,minimo:e,maximo:e,carregados:e,cheias:0,ultimaFechada:!1,porCarregar:0,tamanho:r};let l=e+s*r.valor;return{exato:!1,minimo:l+(n?1:0),maximo:l+(n?r.valor:0),carregados:e,cheias:s,ultimaFechada:n,porCarregar:t.length,tamanho:r}}var wr=(o,e,r)=>`${o} ${o===1?e:r}`;function po(o){if(o.exato)return{valor:String(o.minimo)};let e=[];o.cheias>0&&e.push(`${wr(o.cheias,"pasta","pastas")} \xD7 ${o.tamanho.valor}`),o.carregados>0&&e.push(wr(o.carregados,"aberto","abertos")),o.ultimaFechada&&e.push(`a \xFAltima pasta (de 1 a ${o.tamanho.valor})`);let r=o.tamanho.origem==="padrao"?` (${o.tamanho.valor} \xE9 o padr\xE3o do SEI)`:"";return{valor:o.maximo>o.minimo?`\u2248 ${o.minimo} a ${o.maximo}`:`\u2248 ${o.minimo}`,detalhe:`estimado: ${e.join(" + ")||"sem documentos \xE0 vista"}${r}`}}var jo=(o,e,r)=>`${o} ${o===1?e:r}`;function Go(o){return{total:o.length,internos:o.filter(e=>!e.externo).length,externos:o.filter(e=>e.externo).length,assinados:o.filter(e=>e.assinado).length,cancelados:o.filter(e=>e.cancelado).length}}var mo="nas pastas abertas";function Kt(o,e){let r=po(o),t={id:"documentos",origem:"arvore",rotulo:"Documentos",valor:r.valor,estado:"pronto"},a=e.contagem??{fase:"parada"};if(o.exato)return r.detalhe&&(t.detalhe=r.detalhe),t;if(a.fase==="contando")return t.detalhe=a.total>0?`contando as pastas: ${a.feito} de ${a.total}`:"contando as pastas...",t.acao={tipo:"parar",rotulo:"Parar"},a.total>0&&(t.progresso={feito:a.feito,total:a.total}),t;let n=[r.detalhe];return a.fase==="parou"&&n.push(`parou: ${a.restantes===1?"1 pasta":`${a.restantes} pastas`} sem contar`),a.fase==="erro"&&n.push(a.mensagem),t.detalhe=n.filter(Boolean).join(". "),e.podeContar&&(t.acao={tipo:a.fase==="parou"?"continuar":"contar",rotulo:a.fase==="parou"?"Continuar":a.fase==="erro"?"Tentar de novo":"Contar tudo"}),t}function Ir(o,e={}){let r=e.tela??B(null,o),t=e.tamanho??{valor:Bo,origem:"padrao"},a=r.documentos,n=uo(r.pastas,a.length,t),s=!n.exato,l=Go(a),i=a.filter(p=>p.nivel==="sigiloso").length,c=a.filter(p=>p.nivel==="restrito").length,d=[c?jo(c,"restrito","restritos"):"",s?mo:""].filter(Boolean).join(", ");return[Kt(n,e),{id:"internosExternos",origem:"arvore",rotulo:"Internos e externos",valor:`${l.internos} / ${l.externos}`,detalhe:s?mo:"gerados no SEI / anexados",estado:"pronto"},{id:"assinados",origem:"arvore",rotulo:"Assinados",valor:`${l.assinados} de ${l.total}`,...s?{detalhe:mo}:l.total?{detalhe:`${Math.round(l.assinados/l.total*100)}% do processo`}:{},estado:"pronto"},{id:"cancelados",origem:"arvore",rotulo:"Cancelados",valor:String(l.cancelados),...s?{detalhe:mo}:{},estado:"pronto"},{id:"sigilosos",origem:"arvore",rotulo:"Sigilosos",valor:String(i),...d?{detalhe:d}:{},estado:"pronto"},{id:"pastas",origem:"arvore",rotulo:"Pastas",valor:String(r.pastas.length),...n.porCarregar?{detalhe:`${n.porCarregar} por carregar`}:{},estado:"pronto"}]}var Qt=[{id:"unidades",rotulo:"Unidades por onde passou"},{id:"tramitacoes",rotulo:"Tramita\xE7\xF5es"},{id:"tempoTotal",rotulo:"Tempo total"},{id:"naUnidade",rotulo:"Na unidade atual"}];function Or(o){if(!o.passagens)return Qt.map(c=>{if(c.id==="naUnidade"&&o.parado?.origem==="recebimento"){let d=o.parado.dias;return{id:c.id,origem:"historico",rotulo:c.rotulo,valor:d===0?"hoje":`${d} d`,detalhe:o.alerta?`parado h\xE1 ${jo(d,"dia","dias")} (limite: ${o.limite})`:`desde ${j(o.parado.desde)}`,estado:"pronto",...o.alerta?{alerta:!0}:{}}}return{id:c.id,origem:"historico",rotulo:c.rotulo,valor:"\u2014",estado:"pendente"}});let e=o.passagens,r=Sr(e),t=e.filter(c=>c.fim==="remessa"||c.mantidoAberto).length,a=Uo(e,o.unidade),n=[{id:"unidades",origem:"historico",rotulo:"Unidades por onde passou",valor:String(r.unidades),estado:"pronto"},{id:"tramitacoes",origem:"historico",rotulo:"Tramita\xE7\xF5es",valor:String(t),estado:"pronto"},{id:"tempoTotal",origem:"historico",rotulo:"Tempo total",valor:e.length?Vo(r.corridoMs):"\u2014",...e.length?{detalhe:`desde ${j(new Date(Math.min(...e.map(c=>c.recebido.getTime()))))}`}:{},estado:"pronto"},a?{id:"naUnidade",origem:"historico",rotulo:"Na unidade atual",valor:Vo(a.duracaoMs),detalhe:o.alerta?`parado h\xE1 ${jo(o.parado?.dias??0,"dia","dias")} (limite: ${o.limite})`:a.pendenteRecebimento?`aguardando abrir desde ${j(a.recebido)}`:`desde ${j(a.recebido)}`,estado:"pronto",...o.alerta?{alerta:!0}:{}}:{id:"naUnidade",origem:"historico",rotulo:"Na unidade atual",valor:"\u2014",detalhe:"o processo n\xE3o est\xE1 aberto aqui",estado:"pronto"}],s=e.find(c=>c.inicio==="gerado"),l=s?gr(s.usuarioRecebeu,s.usuarioRecebeuNome):"";s&&l&&n.push({id:"geradoPor",origem:"historico",rotulo:"Gerado por",valor:s.usuarioRecebeuNome??s.usuarioRecebeu??"",detalhe:`${s.unidade}, ${j(s.recebido)}`,estado:"pronto"});let i=e.flatMap(c=>c.assinaturas);if(i.length){let c=i.reduce((d,p)=>p.em.getTime()>=d.em.getTime()?p:d);n.push({id:"ultimaAssinatura",origem:"historico",rotulo:"\xDAltima assinatura",valor:c.usuario??"",detalhe:`${c.nrSei?`SEI ${c.nrSei}, `:""}${j(c.em)}`,estado:"pronto"})}return n}var oa={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"},ea={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"};function Cr(o,e){let r=oa[o];return{rotulo:o==="restrito"&&e?`${r}: ${e}`:r,icone:ea[o]}}function Mr(o){let{arv:e,fatias:r}=o,t=e.nivel==="sigiloso",a=o.tela??B(null,e),n=uo(a.pastas,a.documentos.length,o.tamanho??{valor:20,origem:"padrao"}),s={...Go(a.documentos),...n.exato?{}:{estimado:po(n).valor}},l=t?null:vr({passagens:o.passagens,sigla:o.unidade,recebidoEm:o.recebidoEm},o.agora),i=xr(l,o.limite),c=Ir(e,{tela:a,...o.tamanho?{tamanho:o.tamanho}:{},...o.contagem?{contagem:o.contagem}:{},...o.podeContar?{podeContar:!0}:{}}),d=t?[]:Or({passagens:o.passagens,unidade:o.unidade,parado:l,alerta:i,limite:o.limite}),p={idProcedimento:e.idProcedimento,protocolo:e.protocolo,sigiloso:t,linkPermanente:o.linkPermanente,cards:[...c,...d],coleta:o.coleta,parado:l,alerta:i},b=r.marcador?.itens??Dr(e),u=t?[]:b.map(q=>{let{prazo:k,texto:bo}=Le(q.texto),W=k?qe(k,o.agora):null;return{nome:q.nome,texto:bo,icone:q.icone,...k&&W?{prazo:{rotulo:`${k.vencimento?"at\xE9 ":""}${He(k)} \xB7 ${W.rotulo}`,nivel:W.nivel}}:{}}}),m=t?null:ze(e.pagina.html),f=r.dadosProcesso,h=!t&&f?.disponivel?f.valor:null,x;t||h?x="pronto":f&&!f.disponivel?x=f.motivo==="consultas"?"consultas":"fechado":x=o.espera==="desistiu"?"indisponivel":"carregando";let P=h?Cr(h.nivel,h.hipotese):Cr(e.nivel,e.hipotese),E=t?[]:h?.interessados??[],N=t?void 0:h?.especificacao,A=t||!h?[]:Ve(h.observacoes,o.unidade,h.observacoesOutras),I=t?null:r.blocoInterno,F=I?.descricao?I.descricao:void 0,V={protocolo:e.protocolo,sigiloso:t,tipo:h?.tipo||e.tipo,interessados:E,...r.atribuicao?.texto?{situacao:r.atribuicao.texto}:{},unidade:o.unidade,diasNaUnidade:l?l.dias:null,documentos:s};return{...p,tipo:h?.tipo||e.tipo,nivel:P,dados:x,...h?.autuacao?{autuacao:h.autuacao}:{},...N?{especificacao:N}:{},urgente:N?Fe(N,"URGENTE"):!1,assuntos:t?[]:h?.assuntos??[],interessados:E,observacoes:A,marcadores:u,...m?{prazoNativo:m}:{},...F?{blocoInterno:F}:{},resumo:V}}function Tr(o){return JSON.stringify(o)}var ra=15e3,ta=8e3;function Nr(o,e){return o.getElementById(`span${e}`)?.classList.contains("infraArvoreNoSelecionado")??!1}function aa(o,e,r){return new Promise(t=>{if(Nr(o,e))return t(!0);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,s=!1,l=b=>{s||(s=!0,c?.disconnect(),clearTimeout(p),clearInterval(d),t(b))},i=()=>{Nr(o,e)&&l(!0)},c=typeof n=="function"?new n(i):null;c?.observe(o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0});let d=setInterval(i,250),p=setTimeout(()=>l(!1),r)})}async function _r(o){let e=o.doc,r=v=>(o.depurar?.(v),null);if(!e.getElementById("divArvoreHtml"))return r("sem #divArvoreHtml");let a=o.prazoMs??ra,n=o.ponte.documento();if(!n)return r("sem o documento do quadro da \xE1rvore");let s=await Qe(n,a);if(!s)return r("a \xE1rvore n\xE3o chegou no prazo");let l=s;if(!await aa(n,l.idProcedimento,a))return r("o n\xF3 do processo n\xE3o est\xE1 selecionado");let i=o.cache(l),c=l.nivel==="sigiloso",d={},p=null,b=async()=>{try{[d,p]=c?[{},null]:await Promise.all([i.fatias(),i.historico()])}catch{}};await b();let u=ar(),m="aguardando",f=0,h="",x="",P="",E="",N="",A=null,I=!1,F=null,V=null,q=null,k={calcular:()=>o.ponte.calcular(),contar:()=>o.ponte.contar?.(),pararContagem:()=>o.ponte.pararContagem?.(),cancelar:()=>o.ponte.cancelar(),abrirHistorico:()=>o.ponte.abrirHistorico(),copiarResumo:()=>{A&&o.copiar(Pr(A.resumo)).then(v=>o.avisar(v?"Resumo copiado.":"N\xE3o foi poss\xEDvel copiar.",2200))},copiarTexto:v=>void o.copiar(v).then(S=>o.avisar(S?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)),copiarLink:()=>{A&&o.copiar(A.linkPermanente).then(v=>o.avisar(v?"Link do processo copiado.":"N\xE3o foi poss\xEDvel copiar.",2200))},tentarDeNovo:()=>{m="aguardando",Jo(),o.ponte.pedirFatias(),L()}},bo=()=>!p||!Co(p.coletadoEm,o.agora().getTime())?null:Ne(p.andamentos,o.agora()),W=()=>{let v=o.ponte.coleta();return v==="pronto"?{fase:"parada"}:v},Yo=()=>{if(F=null,I)return;let v=o.ponte.documento();if(v&&v!==n){n=v;let D=co(v);D&&D.idProcedimento===l.idProcedimento&&(l=D)}let S=c?null:bo(),U=B(n,l),Fr=[...U.pastas].reverse().find(D=>D.topo),Vr=yr(U.pastas.filter(D=>D.topo).map(D=>({carregada:D.carregada,nos:D.nos,ultima:D===Fr})),o.armazenamento,o.host??e.location?.host??"");A=Mr({tela:U,tamanho:Vr,contagem:o.ponte.contagem?.()??{fase:"parada"},podeContar:!!o.ponte.contar,arv:l,fatias:d,passagens:S,unidade:o.unidade,agora:o.agora(),limite:o.limite,recebidoEm:c?null:Er(o.armazenamento,l.idProcedimento),coleta:W(),espera:m,linkPermanente:o.linkPermanente(l.idProcedimento)});let ee=JSON.stringify([A.cards,A.coleta]),re=Tr({...A,cards:[],coleta:{fase:"parada"},resumo:{protocolo:"",sigiloso:!1}}),te=String(A.sigiloso),ae=A.linkPermanente;if(ee!==h&&(h=ee,nr(u,A,k),f++),re!==x&&(x=re,sr(u,A,k),f++),te!==P&&(P=te,ir(u,A,k),f++),ae!==E&&(E=ae,cr(u,A,e),f++),V&&clearTimeout(V),V=null,p&&S){let D=p.coletadoEm+18e5-o.agora().getTime();D>0&&D<2**31-1&&(V=setTimeout(L,D+1e3))}};function L(){I||F||(F=setTimeout(Yo,0))}function Jo(){q&&clearTimeout(q),q=setTimeout(()=>{!d.dadosProcesso&&!c&&(m="desistiu",L())},o.esperaMs??ta)}let Zo=()=>{let v=e.getElementById("divArvoreHtml");if(!v)return;for(let U of v.querySelectorAll(`#${Ho}:not([data-spro-capa])`))U.remove();v.classList.remove("d-flex"),u.raiz.parentElement!==v&&v.prepend(u.raiz);let S=e.getElementById("divArvoreInformacao")??e.getElementById("divInformacao");S&&!S.hasAttribute("data-spro-copiado")&&(lr(u,S),S.setAttribute("data-spro-copiado","1"),S.style.display="none")};Zo();let Ko=o.Observador??e.defaultView?.MutationObserver??globalThis.MutationObserver,Qo=typeof Ko=="function"?new Ko(v=>{I||!v.some(U=>!u.raiz.contains(U.target))||u.raiz.parentElement?.id==="divArvoreHtml"&&e.contains(u.raiz)&&e.getElementById("divArvoreInformacao")?.hasAttribute("data-spro-copiado")!==!1||Zo()}):null;Qo?.observe(e.body??e.documentElement,{childList:!0,subtree:!0});let oe=()=>{u.raiz.setAttribute("data-tema",o.escuro()?"escuro":"claro");let v=o.corTema?.();v?(u.raiz.style.setProperty("--spro-cor-sei",v),u.raiz.setAttribute("data-cor-sei","")):(u.raiz.style.removeProperty("--spro-cor-sei"),u.raiz.removeAttribute("data-cor-sei"))};oe(),Yo();let zr=[i.aoMudar(()=>{b().then(L)}),o.ponte.aoMudarColeta(()=>{o.ponte.coleta()==="pronto"?b().then(L):L()}),o.ponte.aoRecarregarArvore(L),o.ponte.aoMudarArvore?.(()=>{let v=o.ponte.documento()??n,S=`${JSON.stringify(B(v,l).pastas)}|${JSON.stringify(o.ponte.contagem?.()??null)}`;S!==N&&(N=S,L())})??(()=>{}),o.aoMudarTema(oe)];return!c&&!d.dadosProcesso&&Jo(),c||o.ponte.pedirFatias(),{raiz:u.raiz,desenhos:()=>f,atualizar:L,destruir(){I=!0,Qo?.disconnect();for(let v of zr)v();for(let v of[F,V,q])v&&clearTimeout(v)}}}async function Wo(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var $r=0,kr=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",fo=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return ro(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return kr(e)?e:null}catch{return null}}async gravar(e){if(!Po(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return $r+=1,await da(this.area,$r%25===0),!0}};async function da(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(l=>l.startsWith(eo)).length<=200)return 0;let r=await Wo(o,eo),t=Object.entries(r).filter(([,s])=>kr(s)).map(([s,l])=>({k:s,em:l.em,bytes:JSON.stringify(l).length})).sort((s,l)=>l.em-s.em),a=[],n=0;t.forEach((s,l)=>{n+=s.bytes,(l>=200||n>2097152)&&a.push(s.k)});for(let s of Object.keys(r))t.some(l=>l.k===s)||a.push(s);return a.length&&await o.remover(a),a.length}catch{return 0}}var Lr=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),go=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return to(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Lr(e)?e:null}catch{return null}}async gravar(e){if(!Po(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await pa(this.area,this.agora()),!0}};async function pa(o,e){try{let r=await Wo(o,yo),t=Object.entries(r).filter(([,n])=>Lr(n)).map(([n,s])=>({k:n,em:s.coletadoEm})).sort((n,s)=>s.em-n.em),a=new Set;t.forEach((n,s)=>{(s>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(s=>s.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}function ma(o){if(!o)return{fase:"parada"};if(o==="pronto")return"pronto";if(o.startsWith("coletando:")){let[e=0,r=0]=o.slice(10).split("/").map(t=>Number.parseInt(t,10)||0);return{fase:"coletando",feito:e,total:r}}return o.startsWith("erro:")?{fase:"erro",mensagem:o.slice(5)||"N\xE3o foi poss\xEDvel calcular."}:{fase:"parada"}}function fa(o){if(!o||o==="pronto")return{fase:"parada"};if(o.startsWith("contando:")){let[e=0,r=0]=o.slice(9).split("/").map(t=>Number.parseInt(t,10)||0);return{fase:"contando",feito:e,total:r}}return o.startsWith("parou:")?{fase:"parou",restantes:Number.parseInt(o.slice(6),10)||0}:o.startsWith("erro:")?{fase:"erro",mensagem:o.slice(5)||"N\xE3o foi poss\xEDvel contar."}:{fase:"parada"}}var ga=250;function qr(o){let e=()=>o.querySelector("#ifrArvore"),r=()=>{try{return e()?.contentDocument??null}catch{return null}},t=a=>{let n=r(),s=n?.defaultView?.Event;n&&s&&n.dispatchEvent(new s(a))};return{documento:r,pedirFatias:()=>t(be),calcular:()=>t(ve),cancelar:()=>t(xe),abrirHistorico:()=>t(he),contar:()=>t(Ae),pararContagem:()=>t(Ee),contagem:()=>fa(r()?.documentElement?.getAttribute(Eo)??null),aoMudarArvore(a){let n=null,s=null,l=()=>{s||(s=setTimeout(()=>{s=null,a()},ga))},i=()=>{n?.disconnect(),n=null;let d=r(),p=d?.defaultView?.MutationObserver;d?.documentElement&&p&&(n=new p(l),n.observe(d.documentElement,{childList:!0,subtree:!0}),n.observe(d.documentElement,{attributes:!0,attributeFilter:[Eo]}))};i();let c=e();return c?.addEventListener("load",i),()=>{n?.disconnect(),s&&clearTimeout(s),c?.removeEventListener("load",i)}},coleta:()=>ma(r()?.documentElement?.getAttribute(Ao)??null),aoMudarColeta(a){let n=null,s=()=>{n?.disconnect(),n=null;let i=r(),c=i?.defaultView?.MutationObserver;i?.documentElement&&c&&(n=new c(a),n.observe(i.documentElement,{attributes:!0,attributeFilter:[Ao]}))};s();let l=e();return l?.addEventListener("load",s),()=>{n?.disconnect(),l?.removeEventListener("load",s)}},aoRecarregarArvore(a){let n=e();return n?.addEventListener("load",a),()=>n?.removeEventListener("load",a)}}}function Hr(o,e,r){let t=new fo(o,e,r),a=new go(o,e,r),n=new Set([ro(e,r),to(e,r)]);return{async fatias(){let s=await t.ler(),l=u=>s?.fatias?.[u]?.dado,i={},c=l("dadosProcesso"),d=l("marcador"),p=l("blocoInterno"),b=l("atribuicao");return c&&(i.dadosProcesso=c),d&&(i.marcador=d),p&&(i.blocoInterno=p),b&&(i.atribuicao=b),i},historico:()=>a.ler(),aoMudar:s=>o.aoMudar(l=>Object.keys(l).some(i=>n.has(i))?s():void 0)}}var Xo=null,ho=o=>document.documentElement?.setAttribute("data-spro-capa-estado",o);async function ha(){if(window===window.top||!document.getElementById("divArvoreHtml")||Ze(window))return;ho("iniciando");let o=me();Je(o);let{dataValues:e}=await chrome.storage.sync.get("dataValues");Ge(`${pe}
${fe}`),We(document);let r=Be(o),t=ne(chrome.storage.local,"local"),a=`${location.origin}${location.pathname}`;Xo=await _r({doc:document,ponte:qr(o),cache:n=>Hr(t,Ue(r.host,r.login),n.idProcedimento),agora:()=>new Date,unidade:r.unidade.sigla,limite:Ar(se(e,Pe)),armazenamento:localStorage,linkPermanente:n=>Ke(a,n),copiar:n=>ye(document,n),avisar:(n,s=2e3)=>void xo(document,n,void 0,s),escuro:()=>Xe(document),corTema:()=>vo(document)??vo(o),aoMudarTema:n=>Ye(document,n),depurar:n=>ho(`desistiu: ${n}`)}),Xo&&ho("desenhada"),window.addEventListener("pagehide",()=>Xo?.destruir(),{once:!0})}ha().catch(o=>{ho(`erro: ${o instanceof Error?o.message:String(o)}`),console.warn("[SEI Pro] capa do processo:",o)});})();
