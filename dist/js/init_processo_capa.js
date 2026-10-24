/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Ar(o){let e={};for(let[r,t]of Object.entries(o)){let n={};t&&"newValue"in t&&(n.novo=t.newValue),t&&"oldValue"in t&&(n.antigo=t.oldValue),e[r]=n}return e}function Bo(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(n,a)=>{a===e&&r(Ar(n))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function Go(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(n=>n?.configGeral).find(Array.isArray)?.find(n=>n?.name===e)?.value}function g(o,e={},...r){let t=document.createElement(o);for(let[n,a]of Object.entries(e))a===void 0||a===!1||(typeof a=="function"?t.addEventListener(n.replace(/^on/,""),a):a===!0?t.setAttribute(n,""):n==="class"?t.className=a:n==="value"&&o==="textarea"?t.value=a:t.setAttribute(n,a));for(let n of r)n!=null&&n!==!1&&t.append(n);return t}var N={fill:"currentColor",stroke:"none"},Xo="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Wo={estrela:[["path",{d:Xo}]],estrelaCheia:[["path",{d:Xo,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...N}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...N}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...N}],["circle",{cx:"12",cy:"12",r:"1.4",...N}],["circle",{cx:"19",cy:"12",r:"1.4",...N}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...N}],["circle",{cx:"15",cy:"6",r:"1.3",...N}],["circle",{cx:"9",cy:"12",r:"1.3",...N}],["circle",{cx:"15",cy:"12",r:"1.3",...N}],["circle",{cx:"9",cy:"18",r:"1.3",...N}],["circle",{cx:"15",cy:"18",r:"1.3",...N}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Lt=Object.keys(Wo);function I(o,e=18,r=document){let t="http://www.w3.org/2000/svg",n=r.createElementNS(t,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,l]of Object.entries(a))n.setAttribute(i,l);for(let[i,l]of Wo[o]){let c=r.createElementNS(t,i);for(let[s,p]of Object.entries(l))c.setAttribute(s,p);n.append(c)}return n}function Pr(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Yo(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(a=>{try{return a.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function uo(o,e,r,t,n){let a=o.body??o.documentElement;for(let m of[a,...o.querySelectorAll("dialog")])for(let h of[...m.children])h.classList.contains("spro-aviso")&&h.remove();let i=g("div",{class:"spro-aviso",role:"status"},I("check",16),g("span",{},e),...Pr(r).map(m=>g("button",{type:"button",onclick:()=>{i.remove(),m.fazer()}},m.rotulo)));i.setAttribute("popover","manual");let l=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,s=()=>{let m=Yo(o);m.append(i),l(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!p||!m.contains(i))){if(n&&Yo(o).localName!=="dialog"&&n(e,r,Math.max(0,c-Date.now()))){p=!1,i.remove();return}s()}},{once:!0})},p=!0;return s(),setTimeout(()=>{p=!1,i.remove()},t),i}var Jo=`/*
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
  .spro-aviso {
    animation: none;
  }
  * {
    transition-duration: 0ms !important;
  }
}
`;function K(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function Ko(){try{return window.top?.document??document}catch{return document}}var Zo=`/*
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
  --spro-aviso: #b45c0a;
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
  --spro-aviso: #e8b04a;
  --spro-ok: #4fcf96;
  color-scheme: dark;
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
.spro-c-card.alerta {
  border-color: var(--spro-aviso);
  background: color-mix(in srgb, var(--spro-aviso) 10%, var(--spro-fundo));
}
.spro-c-card.alerta .spro-c-rotulo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--spro-aviso);
}
.spro-c-card.alerta .spro-c-detalhe {
  font-weight: 600;
  color: var(--spro-aviso);
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
  color: var(--spro-aviso);
  background: color-mix(in srgb, var(--spro-aviso) 14%, transparent);
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
  background: color-mix(in srgb, var(--spro-aviso) 14%, var(--spro-fundo));
  border-radius: 6px;
}
.spro-c-info a,
.spro-c-info * {
  font: inherit;
}
.spro-c-info:empty {
  display: none;
}
`;var Qo="data-seipro-processo-capa";var oe="spro-processo-gantt-abrir",ee="spro-processo-capa-pedir",re="spro-processo-capa-calcular",te="spro-processo-capa-cancelar",po="data-spro-capa-coleta",ae="processoparado";var Z="processo/",Q=(o,e)=>`${Z}${o}/${e}`,mo=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},fo="processo-historico/",oo=(o,e)=>`${fo}${o}/${e}`;async function ne(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}var S=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};var Dr={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function F(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Dr[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}function _(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var Sr={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function eo(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let n=o[e];if(n==="\\"){let a=o[e+1];if(a==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Sr[a]??a,e+=2;continue}if(n===r)return[t,e+1];t+=n,e+=1}return[t,e]}function go(o,e){let r=[],t=e;for(;t<o.length;){let n=o[t];if(n===")")return[r,t+1];if(n===","||/\s/.test(n)){t+=1;continue}if(n==='"'||n==="'"){let[l,c]=eo(o,t);r.push(l),t=c;continue}let a=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(a){let l=a[1];r.push(l==="null"?null:l==="true"?!0:l==="false"?!1:Number(l)),t+=l.length;continue}let i=0;for(;t<o.length;){let l=o[t];if(l==="(")i+=1;else if(l===")"){if(i===0)break;i-=1}else if(l===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function y(o){return typeof o=="string"?F(o):o==null?"":String(o)}var wr=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function G(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(wr))e.add(r[0]);return[...e]}function Ir(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=go(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[n]=eo(o,r.index+r[0].length-1);t.props[r[2]]=n}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Or(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=go(o,r.index+r[0].length);e.push({tipo:y(t[0]),idPai:y(t[2]),href:y(t[3]),titulo:y(t[5]),icone:y(t[6]),extra:t[8]==null?void 0:y(t[8])})}return e}function ie(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...n]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:n.join(" ").trim()||void 0}}function se(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>y(e[1])))]}function ce(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var Mr=/\s*\(\d{5,}\)\s*$/;function Cr(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=y(r.args[1]),n=y(r.args[5]),a=y(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),l=e.find(m=>m.tipo==="ASSINATURA"&&m.idPai===t),{nivel:c,hipotese:s}=ie(e,t),p=(/documento_([a-z0-9]+)\.svg/.exec(a)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:y(r.args[15])||(/\((\d{5,})\)\s*$/.exec(n)?.[1]??""),titulo:n.replace(Mr,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(a),formato:p,nivel:c,hipotese:s,assinado:!!l,assinaturas:l?l.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(a),unidadeGeradora:e.find(m=>m.tipo==="UNIDADE_GERADORA"&&m.idPai===t)?.extra,link:y(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:G(r.props.acoes??""),botoes:se(r.props.acoes??""),funcoes:ce(r.props.acoes??"")}})}function le(o){let e=o.html,r=Ir(e),t=Or(e),n=r.find(c=>c.args[0]==="PROCESSO");if(!n)throw new S("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let a=y(n.args[1]),i=ie(t,a),l=Cr(r,t);return{idProcedimento:a,protocolo:y(n.args[5])||y(n.args[15]),tipo:y(n.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===a).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:l,acoesProcesso:G(n.props.acoes??""),botoesProcesso:se(n.props.acoes??""),funcoesProcesso:ce(n.props.acoes??""),linkProcesso:y(n.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===a),links:G(e),pagina:o}}var ca=600*1e3;var la=Promise.resolve();var R={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},Nr=120*1e3;function O(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var H=(o,e)=>o.startsWith(O(e));function to(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function ho(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function bo(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function Tr(o){let e=[];return o.forEach((r,t)=>{let n=ho(r.dataISO||to(r.data));n&&e.push({a:r,t:n,i:t,d:O(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function pe(o,e){return O(o)===O(e)}function me(o,e,r){return pe(o.unidade,e)?!o.unidadeNome||!r||O(o.unidadeNome)===O(r):!1}function X(o,e,r){let t=o.filter(i=>pe(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?O(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let a=t.filter(i=>me(i,e,r));return a.length?a:t}function _r(o,e){let r=a=>a.remetido?.getTime()??e,t=(a,i)=>a.recebido.getTime()<r(i)&&i.recebido.getTime()<r(a),n=new Map;for(let a of o)n.set(O(a.unidade),[...n.get(O(a.unidade))??[],a]);for(let[a,i]of n){let l=i.some(c=>i.some(s=>c.unidadeNome&&s.unidadeNome&&O(c.unidadeNome)!==O(s.unidadeNome)&&t(c,s)));for(let c of i)c.chave=l&&c.unidadeNome?`${a}|${O(c.unidadeNome)}`:a}}function de(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${R.remetidoPrefixo}`,"i"),"")).trim()}function Rr(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function fe(o,e){let r=Tr(o),t=[],n=[],a=[],i=[],l=(d,u)=>X(n,d,u)[0],c=(d,u)=>{let f=X(a,d,u)[0];return f?a.indexOf(f):-1},s=(d,u)=>{let{a:f}=d;if(n.some(A=>me(A,f.unidade,f.unidadeNome)))return;let b={unidade:f.unidade,...f.unidadeNome?{unidadeNome:f.unidadeNome}:{},chave:"",recebido:d.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:u,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:f.usuario,...f.usuarioNome?{usuarioRecebeuNome:f.usuarioNome}:{}},x=c(f.unidade,f.unidadeNome);if(x>=0){let[A]=a.splice(x,1);b.chegouEm=A.em,b.origem=A.origem}n.push(b),t.push(b)},p=(d,u,f)=>{d.remetido=u.t,d.fim=f,d.usuarioEnviou=u.a.usuario,u.a.usuarioNome&&(d.usuarioEnviouNome=u.a.usuarioNome),n.splice(n.indexOf(d),1)},m=d=>{let{a:u}=d;if(l(u.unidade,u.unidadeNome))return;let f=c(u.unidade,u.unidadeNome),b={em:d.t,unidade:u.unidade,...u.unidadeNome?{unidadeNome:u.unidadeNome}:{},origem:de(u),usuario:u.usuario,...u.usuarioNome?{usuarioNome:u.usuarioNome}:{}};f>=0?a[f]=b:a.push(b)};for(let d=0;d<r.length;){let u=d+1;for(;u<r.length&&r[u].t.getTime()===r[d].t.getTime();)u+=1;let f=r.slice(d,u);d=u;for(let b of f)H(b.d,R.remetidoPrefixo)&&m(b);for(let b of f)H(b.d,R.recebido)&&s(b,"recebido");for(let b of f){let{a:x,d:A}=b;if(R.gerado.some(E=>H(A,E)))s(b,"gerado");else if(H(A,R.reabertura))s(b,"reabertura");else if(H(A,R.conclusao)){let E=l(x.unidade,x.unidadeNome);E&&p(E,b,"conclusao")}else if(H(A,R.remetidoPrefixo)){let E=de(x),P=x.unidadeCitadaNome,M=l(E,P);if(M)p(M,b,"remessa"),M.destinos.push(x.unidade);else{let w=X(t,E,P).at(-1);w?.fim==="remessa"&&w.remetido&&b.t.getTime()-w.remetido.getTime()<=Nr&&!w.destinos.includes(x.unidade)&&w.destinos.push(x.unidade)}}else H(A,R.documentoGerado)?i.push({ev:b,assinado:!1}):H(A,R.documentoAssinado)&&i.push({ev:b,assinado:!0})}}for(let d of a)t.push({unidade:d.unidade,...d.unidadeNome?{unidadeNome:d.unidadeNome}:{},chave:"",recebido:d.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:d.em,origem:d.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:d.usuario,...d.usuarioNome?{usuarioEnviouNome:d.usuarioNome}:{}});for(let{ev:d,assinado:u}of i){let{a:f}=d,b=X(t.filter(E=>!E.pendenteRecebimento&&E.recebido.getTime()<=d.t.getTime()),f.unidade,f.unidadeNome),x=[...b].reverse().find(E=>E.remetido===null||d.t.getTime()<=E.remetido.getTime())??b[b.length-1];if(!x)continue;let A={...f.nrSei?{nrSei:f.nrSei}:{},...f.idDocumento?{idDocumento:f.idDocumento}:{},em:d.t,titulo:Rr(f),...f.usuario?{usuario:f.usuario}:{}};(u?x.assinaturas:x.documentos).push(A)}t.sort((d,u)=>d.recebido.getTime()-u.recebido.getTime());for(let d of o){if(!d.aberto)continue;let u=X(t.filter(f=>!f.pendenteRecebimento),d.unidade,d.unidadeNome).at(-1);u?.fim==="remessa"&&u.remetido&&(u.enviouEm=u.remetido,u.remetido=null,u.fim=null,u.mantidoAberto=!0)}let h=bo(e).getTime();for(let d of t)d.emCurso=d.remetido===null,d.duracaoMs=Math.max(0,(d.remetido?.getTime()??h)-d.recebido.getTime());return _r(t,h),t.sort((d,u)=>d.recebido.getTime()-u.recebido.getTime())}function kr(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function Lr(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function xo(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,n="",a="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],l=kr(o.html);return{host:new URL(o.url).host,versao:l,maior:Number(l.split(".")[0])||0,unidade:{id:Lr(o),sigla:_(r)||_(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:n.trim(),login:a.trim(),orgao:i.trim()}}}var Ao=(o,e)=>o>0&&e-o<18e5;var zr=/[\u0300-\u036f]/g,ve=o=>o.normalize("NFD").replace(zr,""),Eo=o=>ve(o).toLowerCase().replace(/\s+/g," ").trim(),Po=o=>String(o).padStart(2,"0"),Ur=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,he=/(\d{1,2}):(\d{2})/;function xe(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=ve(e),t=r.length===e.length?r:e,n=Ur.exec(t);if(!n)return{prazo:null,texto:e};let a=he.exec(t.slice(n.index+n[0].length))??he.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),l=`${n[3]}-${Po(Number(n[2]))}-${Po(Number(n[1]))}`,c=a?`${Po(Number(a[1]))}:${a[2]}`:"23:59",s=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),p=s?`${e.slice(0,s.index)} ${e.slice(s.index+s[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:l,hora:c,vencimento:i},texto:p}}var Vr=864e5;function Ae(o,e){let[r,t,n]=o.data.split("-").map(Number),[a,i]=o.hora.split(":").map(Number),l=new Date(r??1970,(t??1)-1,n??1,a??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),s=new Date(l.getFullYear(),l.getMonth(),l.getDate()),p=Math.round((s.getTime()-c.getTime())/Vr);return p===0?{rotulo:l.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:l.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:p>0?{rotulo:p===1?"amanh\xE3":`em ${p} dias`,nivel:p<=2?"atencao":"ok"}:{rotulo:p===-1?"ontem":`h\xE1 ${-p} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Pe(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function Ee(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),n=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:n}}function ye(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function be(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function De(o,e,r){return[{unidade:e,observacao:be(o)},...r.map(n=>({unidade:n.unidade,observacao:be(n.observacao)}))].filter(n=>n.observacao)}function Se(o,e){return`${o}|${e}`}function we(o){let e=xo(K(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function Ie(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var Oe="spro-processo-estilo",yo="";function Me(o){yo=o}function Ce(o){if(!yo||o.getElementById(Oe))return;let e=o.createElement("style");e.id=Oe,e.textContent=yo,(o.head??o.documentElement).append(e)}function Ne(o){let e=Ie(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Te(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function _e(o){o.documentElement?.setAttribute(Qo,"1")}function Re(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}function ke(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}var Br=1e4;function no(o){if(!o.getElementById("frmArvore"))return null;try{return le(K(o))}catch{return null}}function Le(o,e=Br){return new Promise(r=>{let t=no(o);if(t)return r(t);let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,l=h=>{i||(i=!0,s?.disconnect(),clearTimeout(m),clearInterval(p),r(h))},c=()=>{let h=no(o);h&&l(h)},s=typeof a=="function"&&o.documentElement?new a(c):null;s?.observe(o.documentElement,{childList:!0,subtree:!0});let p=setInterval(c,250),m=setTimeout(()=>l(null),e)})}var Oo=[{blocos:[[1,16]],ec:10},{blocos:[[1,28]],ec:16},{blocos:[[1,44]],ec:26},{blocos:[[2,32]],ec:18},{blocos:[[2,43]],ec:24},{blocos:[[4,27]],ec:16},{blocos:[[4,31]],ec:18},{blocos:[[2,38],[2,39]],ec:22},{blocos:[[3,36],[2,37]],ec:22},{blocos:[[4,43],[1,44]],ec:26}],Gr=[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50]],Do=1335,Xr=21522,So=7973,Y=new Uint8Array(512),Io=new Uint8Array(256);(()=>{let o=1;for(let e=0;e<255;e++)Y[e]=o,Io[o]=e,o<<=1,o&256&&(o^=285);for(let e=255;e<512;e++)Y[e]=Y[e-255]??0})();var $e=(o,e)=>o===0||e===0?0:Y[(Io[o]??0)+(Io[e]??0)]??0;function Wr(o){let e=[1];for(let r=0;r<o;r++){let t=new Array(e.length+1).fill(0);for(let n=0;n<e.length;n++)t[n]=(t[n]??0)^(e[n]??0),t[n+1]=(t[n+1]??0)^$e(e[n]??0,Y[r]??0);e=t}return e.slice(1)}function Yr(o,e){let r=Wr(e),t=new Array(e).fill(0);for(let n of o){let a=n^(t.shift()??0);if(t.push(0),a!==0)for(let i=0;i<e;i++)t[i]=(t[i]??0)^$e(r[i]??0,a)}return t}var q=o=>{let e=0;for(;o!==0;)e++,o>>>=1;return e};function Jr(o){let e=o<<10;for(;q(e)-q(Do)>=0;)e^=Do<<q(e)-q(Do);return(o<<10|e)^Xr}function Kr(o){let e=o<<12;for(;q(e)-q(So)>=0;)e^=So<<q(e)-q(So);return o<<12|e}var He=o=>(Oo[o-1]?.blocos??[]).reduce((e,[r,t])=>e+r*t,0);function Zr(o,e){let r=He(e),t=[],n=(u,f)=>{for(let b=f-1;b>=0;b--)t.push(u>>>b&1)};n(4,4),n(o.length,e<10?8:16);for(let u of o)n(u,8);let a=r*8;for(n(0,Math.min(4,a-t.length));t.length%8!==0;)t.push(0);let i=[];for(let u=0;u<t.length;u+=8)i.push(Number.parseInt(t.slice(u,u+8).join(""),2));for(let u=0;i.length<r;u++)i.push(u%2===0?236:17);let{blocos:l,ec:c}=Oo[e-1],s=[],p=[],m=0;for(let[u,f]of l)for(let b=0;b<u;b++){let x=i.slice(m,m+f);m+=f,s.push(x),p.push(Yr(x,c))}let h=[],d=Math.max(...s.map(u=>u.length));for(let u=0;u<d;u++)for(let f of s)u<f.length&&h.push(f[u]??0);for(let u=0;u<c;u++)for(let f of p)h.push(f[u]??0);return h}function Qr(o,e,r){switch(o){case 0:return(e+r)%2===0;case 1:return e%2===0;case 2:return r%3===0;case 3:return(e+r)%3===0;case 4:return(Math.floor(e/2)+Math.floor(r/3))%2===0;case 5:return e*r%2+e*r%3===0;case 6:return(e*r%2+e*r%3)%2===0;default:return(e*r%3+(e+r)%2)%2===0}}function wo(o,e,r){let t=o.length;for(let n=-1;n<=7;n++)for(let a=-1;a<=7;a++){if(e+n<0||t<=e+n||r+a<0||t<=r+a)continue;let i=n>=0&&n<=6&&(a===0||a===6)||a>=0&&a<=6&&(n===0||n===6)||n>=2&&n<=4&&a>=2&&a<=4;o[e+n][r+a]=i}}function ot(o,e){let r=Gr[e-1]??[];for(let t of r)for(let n of r)if(o[t][n]===null)for(let a=-2;a<=2;a++)for(let i=-2;i<=2;i++)o[t+a][n+i]=Math.max(Math.abs(a),Math.abs(i))!==1}function et(o){for(let e=8;e<o.length-8;e++){let r=o[e];r[6]===null&&(r[6]=e%2===0);let t=o[6];t[e]===null&&(t[e]=e%2===0)}}function rt(o,e,r){let t=o.length,n=Jr(0|e);for(let a=0;a<15;a++){let i=!r&&(n>>a&1)===1;a<6?o[a][8]=i:a<8?o[a+1][8]=i:o[t-15+a][8]=i}for(let a=0;a<15;a++){let i=!r&&(n>>a&1)===1;a<8?o[8][t-a-1]=i:a<9?o[8][15-a-1+1]=i:o[8][15-a-1]=i}o[t-8][8]=!r}function tt(o,e,r){if(e<7)return;let t=o.length,n=Kr(e);for(let a=0;a<18;a++){let i=!r&&(n>>a&1)===1;o[Math.floor(a/3)][a%3+t-8-3]=i,o[a%3+t-8-3][Math.floor(a/3)]=i}}function at(o,e,r){let t=o.length,n=-1,a=t-1,i=7,l=0;for(let c=t-1;c>0;c-=2)for(c===6&&c--;;){for(let s=0;s<2;s++){let p=o[a];if(p[c-s]!==null)continue;let m=!1;l<e.length&&(m=((e[l]??0)>>>i&1)===1),Qr(r,a,c-s)&&(m=!m),p[c-s]=m,i--,i===-1&&(l++,i=7)}if(a+=n,a<0||t<=a){a-=n,n=-n;break}}}function nt(o,e,r,t){let n=17+4*e,a=Array.from({length:n},()=>new Array(n).fill(null));return wo(a,0,0),wo(a,n-7,0),wo(a,0,n-7),ot(a,e),et(a),rt(a,r,t),tt(a,e,t),at(a,o,r),a.map(i=>i.map(l=>l===!0))}function it(o){let e=o.length,r=(c,s)=>o[c][s]===!0,t=0;for(let c=0;c<2;c++)for(let s=0;s<e;s++){let p=1;for(let m=1;m<e;m++)(c===0?r(s,m)===r(s,m-1):r(m,s)===r(m-1,s))?p++:(p>=5&&(t+=3+(p-5)),p=1);p>=5&&(t+=3+(p-5))}for(let c=0;c<e-1;c++)for(let s=0;s<e-1;s++){let p=r(c,s);p===r(c,s+1)&&p===r(c+1,s)&&p===r(c+1,s+1)&&(t+=3)}let n=[!0,!1,!0,!0,!0,!1,!0],a=(c,s,p,m)=>n.every((h,d)=>r(c+p*d,s+m*d)===h),i=(c,s,p,m)=>{for(let h=0;h<4;h++){let d=c+p*h,u=s+m*h;if(d<0||u<0||d>=e||u>=e||r(d,u))return!1}return!0};for(let c=0;c<e;c++)for(let s=0;s<e;s++)s+6<e&&a(c,s,0,1)&&(i(c,s-4,0,1)||i(c,s+7,0,1))&&(t+=40),c+6<e&&a(c,s,1,0)&&(i(c-4,s,1,0)||i(c+7,s,1,0))&&(t+=40);let l=0;for(let c=0;c<e;c++)for(let s=0;s<e;s++)r(c,s)&&l++;return t+=Math.floor(Math.abs(l*100/(e*e)-50)/5)*10,t}function qe(o){let e=new TextEncoder().encode(o),r=0;for(let i=1;i<=Oo.length;i++){let l=4+(i<10?8:16);if(Math.ceil((l+e.length*8)/8)<=He(i)){r=i;break}}if(!r)return null;let t=Zr(e,r),n=null,a=Number.POSITIVE_INFINITY;for(let i=0;i<8;i++){let l=nt(t,r,i,!1),c=it(l);c<a&&(a=c,n=l)}return n}var Co="capaProcessoPro";function Ue(){let o=g("div",{class:"spro-c-faixa",role:"list","aria-label":"Resumo do processo"}),e=g("div",{class:"spro-c-faixa-acoes"}),r=g("div",{class:"spro-c-barra"}),t=g("dl",{class:"spro-c-campos"}),n=g("div",{class:"spro-c-qr"}),a=g("div",{class:"spro-c-info"}),i=g("aside",{class:"spro-c-lado"},n,a);return{raiz:g("div",{id:Co,class:"spro-c-raiz","data-spro-capa":"1"},o,e,g("div",{class:"spro-c-corpo"},g("div",{class:"spro-c-principal"},r,t),i)),faixa:o,faixaAcoes:e,barra:r,campos:t,lado:i,qr:n,info:a}}function st(o,e){return[g("span",{class:"spro-c-rotulo"},e,o.rotulo),g("strong",{class:`spro-c-valor${/^\d/.test(o.valor)||o.valor==="\u2014"?"":" texto"}`},o.valor),o.detalhe?g("span",{class:"spro-c-detalhe"},o.detalhe):null]}function ct(o){return g("div",{class:`spro-c-card${o.alerta?" alerta":""}`,"data-id":o.id,"aria-label":o.alerta?`Aten\xE7\xE3o. ${o.rotulo}: ${o.valor}. ${o.detalhe??""}`:void 0},...st(o,o.alerta?I("alerta",12):null))}function lt(o,e,r){let t=e.coleta,n=t.fase==="coletando",a=n?t.total>0?`Calculando... p\xE1gina ${t.feito} de ${t.total}`:"Calculando...":t.fase==="erro"?`${t.mensagem} Tentar de novo`:"Calcular";return g("button",{type:"button",class:`spro-c-card pendente${t.fase==="erro"?" erro":""}`,"data-id":o.id,"aria-busy":n?"true":void 0,"aria-label":n?`${o.rotulo}: ${a}`:`${o.rotulo}: ${a==="Calcular"?"calcular a partir do hist\xF3rico do processo":a}`,onclick:()=>{n||r.calcular()}},g("span",{class:"spro-c-rotulo"},o.rotulo),g("strong",{class:"spro-c-valor"},o.valor),g("span",{class:"spro-c-detalhe"},a))}function Ve(o,e,r){o.faixa.replaceChildren(...e.cards.map(t=>g("div",{class:"spro-c-item",role:"listitem"},t.estado==="pendente"?lt(t,e,r):ct(t)))),o.faixaAcoes.replaceChildren(...e.coleta.fase==="coletando"?[g("button",{type:"button",class:"spro-c-acao pequeno contorno",onclick:()=>r.cancelar()},"Cancelar o c\xE1lculo")]:[])}function D(o,e,r,...t){return g("div",{class:"spro-c-campo","data-campo":r},g("dt",{},I(e,15),o),g("dd",{},...t))}var k=(o,e,r=!1)=>g("button",{type:"button",class:`spro-c-copiavel${r?" forte":""}`,"aria-label":`Copiar: ${e}`,onclick:()=>o.copiarTexto(e)},e);function ze(o,e){return e.length?e.map(r=>k(o,r)):[g("span",{class:"spro-c-nota"},"Nenhum")]}function ut(o,e){return g("span",{class:"spro-c-marcador"},e.icone?g("img",{src:e.icone,alt:""}):I("etiqueta",15),k(o,e.nome,!0),e.prazo?g("span",{class:`spro-c-chip ${e.prazo.nivel}`},I("relogio",11),e.prazo.rotulo):null,e.texto?k(o,e.texto):null)}function dt(o,e){switch(o.dados){case"carregando":return D("Dados do processo","nota","dados",g("div",{class:"spro-c-esqueleto","aria-busy":"true","aria-label":"Carregando"}),g("div",{class:"spro-c-esqueleto",style:"width:60%"}));case"indisponivel":return D("Dados do processo","nota","dados",g("span",{class:"spro-c-erro",role:"alert"},I("alerta",13),"N\xE3o foi poss\xEDvel carregar autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados.",g("button",{type:"button",class:"spro-c-acao pequeno",onclick:()=>e.tentarDeNovo()},"Tentar de novo")));case"consultas":return D("Dados do processo","nota","dados",g("p",{class:"spro-c-nota"},"Autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados n\xE3o aparecem: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro."));case"fechado":return D("Dados do processo","nota","dados",g("p",{class:"spro-c-nota"},"Autua\xE7\xE3o, especifica\xE7\xE3o, assuntos e interessados aparecem quando o processo est\xE1 aberto na sua unidade."));default:return null}}function Fe(o,e,r){let t=[];t.push(D("Processo","pasta","processo",k(r,e.protocolo,!0),g("button",{type:"button",class:"spro-c-icone-botao","aria-label":"Copiar o link do processo",onclick:()=>r.copiarLink()},I("link",15)))),e.sigiloso||e.dados==="pronto"&&e.autuacao&&t.push(D("Data de autua\xE7\xE3o","calendario","autuacao",k(r,e.autuacao))),t.push(D("Tipo do processo","documento","tipo",e.tipo?k(r,e.tipo):g("span",{class:"spro-c-nota"},"N\xE3o informado"))),e.sigiloso||(e.dados==="pronto"?t.push(D("Especifica\xE7\xE3o","nota","especificacao",e.urgente?g("span",{class:"spro-c-urgente"},"URGENTE"):null,e.especificacao?k(r,e.especificacao):g("span",{class:"spro-c-nota"},"Sem especifica\xE7\xE3o")),D("Assuntos","etiqueta","assuntos",...ze(r,e.assuntos)),D("Interessados","pessoa","interessados",...ze(r,e.interessados))):t.push(dt(e,r))),t.push(D("N\xEDvel de acesso",e.nivel.icone,"nivel",k(r,e.nivel.rotulo))),e.sigiloso||(t.push(D("Marcador","etiqueta","marcador",...e.marcadores.length||e.prazoNativo?[...e.marcadores.map(n=>ut(r,n)),e.prazoNativo?g("span",{class:`spro-c-chip ${e.prazoNativo.nivel==="vencido"?"vencido":"ok"}`},I("relogio",11),`Prazo do SEI: ${e.prazoNativo.data} (${e.prazoNativo.estado})`):null]:[g("span",{class:"spro-c-nota"},"Sem marcador")])),e.blocoInterno&&t.push(D("Bloco interno","camadas","bloco",k(r,e.blocoInterno))),e.dados==="pronto"&&t.push(D("Observa\xE7\xF5es","nota","observacoes",...e.observacoes.length?e.observacoes.map(n=>k(r,`${n.unidade}: ${n.observacao}`)):[g("span",{class:"spro-c-nota"},"Sem observa\xE7\xF5es")]))),o.campos.replaceChildren(...t.filter(Boolean))}function je(o,e,r){let t=[];e.sigiloso||t.push(g("button",{type:"button",class:"spro-c-acao","data-acao":"historico",onclick:()=>r.abrirHistorico()},I("historico",15),"Hist\xF3rico de tramita\xE7\xE3o do processo")),t.push(g("button",{type:"button",class:"spro-c-acao contorno","data-acao":"resumo",onclick:()=>r.copiarResumo()},I("copiar",14),"Copiar resumo")),o.barra.replaceChildren(...t)}var Mo="http://www.w3.org/2000/svg";function pt(o,e){let r=qe(e);if(!r)return null;let t=r.length,n=4,a=t+n*2,i=o.createElementNS(Mo,"svg");i.setAttribute("viewBox",`0 0 ${a} ${a}`),i.setAttribute("role","img"),i.setAttribute("aria-label","QR code para abrir o processo no celular"),i.setAttribute("shape-rendering","crispEdges");let l=o.createElementNS(Mo,"rect");l.setAttribute("width",String(a)),l.setAttribute("height",String(a)),l.setAttribute("fill","#ffffff");let c=[];r.forEach((p,m)=>{let h=0;for(;h<t;){if(!p[h]){h++;continue}let d=h;for(;d<t&&p[d];)d++;c.push(`M${h+n} ${m+n}h${d-h}v1h-${d-h}z`),h=d}});let s=o.createElementNS(Mo,"path");return s.setAttribute("d",c.join("")),s.setAttribute("fill","#000000"),i.append(l,s),i}function Be(o,e,r){let t=pt(r,e.linkPermanente);o.qr.replaceChildren(...t?[t,g("span",{},"Aponte a c\xE2mera para abrir o processo no celular")]:[])}function Ge(o,e){if(!e){o.info.replaceChildren();return}let r=[...e.childNodes].map(t=>t.cloneNode(!0));for(let t of r)if(t.nodeType===1)for(let n of[t,...t.querySelectorAll("[id]")])n.removeAttribute("id");o.info.replaceChildren(...r)}var Xe=o=>String(o).padStart(2,"0");var U=o=>`${Xe(o.getUTCDate())}/${Xe(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`;function No(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let n=Math.floor(r/24),a=r%24;return n<30&&a?`${n} d ${a} h`:`${n} d`}var We=o=>o.recebido.getTime()+o.duracaoMs,Ye=(o,e)=>e&&o?`${e} (${o})`:e??o??"";function To(o,e){let r=Eo(e);if(!r)return null;let t=o.filter(n=>n.emCurso&&Eo(n.unidade)===r);return t.length?t.reduce((n,a)=>a.recebido.getTime()>=n.recebido.getTime()?a:n):null}function Ke(o,e){return Math.max(0,Math.floor((bo(e).getTime()-o.getTime())/864e5))}function Ze(o,e){if(o.passagens){let r=To(o.passagens,o.sigla);if(r)return{dias:Ke(r.recebido,e),desde:r.recebido,origem:"historico"}}return o.recebidoEm?{dias:Ke(o.recebidoEm,e),desde:o.recebidoEm,origem:"recebimento"}:null}var Qe=(o,e)=>e>0&&o!==null&&o.dias>e;function or(o){if(o==null||o==="")return 15;let e=typeof o=="number"?o:Number(String(o).replace(",","."));return!Number.isFinite(e)||e<0?15:Math.floor(e)}function er(o,e){try{let r=o.getItem("configDataRecebimentoPro");if(!r)return null;let t=JSON.parse(r);if(!Array.isArray(t))return null;let n=t.find(l=>l&&typeof l=="object"&&String(l.id_procedimento)===e);if(!n||typeof n.datahora!="string")return null;let a=/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})/.exec(n.datahora.trim()),i=a?`${a[1]}T${a[2]}:00`:to(n.datahora);return i?ho(i):null}catch{return null}}function ft(o){let e=(o??"").split(/\n+/).map(a=>a.replace(/\s+/g," ").trim()).filter(Boolean);if(!e.length)return"";let[r="",...t]=e;return(t.length?`${r}${r.endsWith(":")?" ":", "}${t.join(", ")}`:r).replace(/\.$/,"")}var J=(o,e,r)=>`${o} ${o===1?e:r}`;function rr(o){if(o.sigiloso)return o.protocolo;let e=[`Processo ${o.protocolo}`];o.tipo&&e.push(`Tipo: ${o.tipo}`);let r=(o.interessados??[]).filter(Boolean);r.length&&e.push(`${r.length>1?"Interessados":"Interessado"}: ${r.join("; ")}`);let t=ft(o.situacao);if(t&&e.push(`Situa\xE7\xE3o: ${t}`),o.unidade){let a=o.diasNaUnidade;e.push(`Unidade atual: ${o.unidade}${typeof a=="number"?` (${J(a,"dia","dias")} na unidade)`:""}`)}let n=o.documentos;return n&&e.push(`Documentos: ${n.total} (${J(n.internos,"interno","internos")}, ${J(n.externos,"externo","externos")}; ${J(n.assinados,"assinado","assinados")}; ${J(n.cancelados,"cancelado","cancelados")})`),e.join(`
`)}function tr(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function ar(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let n of o)e=Math.min(e,n.recebido.getTime()),r=Math.max(r,We(n)),t+=Math.max(0,n.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(n=>n.chave)).size,passagens:o.length}}var io=(o,e,r)=>`${o} ${o===1?e:r}`;function gt(o){try{return(o.pagina.html.match(/infraArvoreNo\("PASTA"/g)??[]).length}catch{return 0}}function ht(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}function bt(o){return ht(o).length}function _o(o){let e=o.documentos;return{total:e.length,internos:e.filter(r=>!r.externo).length,externos:e.filter(r=>r.externo).length,assinados:e.filter(r=>r.assinado).length,cancelados:e.filter(r=>r.cancelado).length}}function nr(o){let e=_o(o),r=o.documentos.filter(i=>i.nivel==="sigiloso").length,t=o.documentos.filter(i=>i.nivel==="restrito").length,n=gt(o),a=bt(o);return[{id:"documentos",origem:"arvore",rotulo:"Documentos",valor:String(e.total),...a?{detalhe:`${io(a,"pasta fechada","pastas fechadas")} n\xE3o contada${a===1?"":"s"}`}:{},estado:"pronto"},{id:"internosExternos",origem:"arvore",rotulo:"Internos e externos",valor:`${e.internos} / ${e.externos}`,detalhe:"gerados no SEI / anexados",estado:"pronto"},{id:"assinados",origem:"arvore",rotulo:"Assinados",valor:`${e.assinados} de ${e.total}`,...e.total?{detalhe:`${Math.round(e.assinados/e.total*100)}% do processo`}:{},estado:"pronto"},{id:"cancelados",origem:"arvore",rotulo:"Cancelados",valor:String(e.cancelados),estado:"pronto"},{id:"sigilosos",origem:"arvore",rotulo:"Sigilosos",valor:String(r),...t?{detalhe:io(t,"restrito","restritos")}:{},estado:"pronto"},{id:"pastas",origem:"arvore",rotulo:"Pastas",valor:String(n),estado:"pronto"}]}var vt=[{id:"unidades",rotulo:"Unidades por onde passou"},{id:"tramitacoes",rotulo:"Tramita\xE7\xF5es"},{id:"tempoTotal",rotulo:"Tempo total"},{id:"naUnidade",rotulo:"Na unidade atual"}];function ir(o){if(!o.passagens)return vt.map(s=>{if(s.id==="naUnidade"&&o.parado?.origem==="recebimento"){let p=o.parado.dias;return{id:s.id,origem:"historico",rotulo:s.rotulo,valor:p===0?"hoje":`${p} d`,detalhe:o.alerta?`parado h\xE1 ${io(p,"dia","dias")} (limite: ${o.limite})`:`desde ${U(o.parado.desde)}`,estado:"pronto",...o.alerta?{alerta:!0}:{}}}return{id:s.id,origem:"historico",rotulo:s.rotulo,valor:"\u2014",estado:"pendente"}});let e=o.passagens,r=ar(e),t=e.filter(s=>s.fim==="remessa"||s.mantidoAberto).length,n=To(e,o.unidade),a=[{id:"unidades",origem:"historico",rotulo:"Unidades por onde passou",valor:String(r.unidades),estado:"pronto"},{id:"tramitacoes",origem:"historico",rotulo:"Tramita\xE7\xF5es",valor:String(t),estado:"pronto"},{id:"tempoTotal",origem:"historico",rotulo:"Tempo total",valor:e.length?No(r.corridoMs):"\u2014",...e.length?{detalhe:`desde ${U(new Date(Math.min(...e.map(s=>s.recebido.getTime()))))}`}:{},estado:"pronto"},n?{id:"naUnidade",origem:"historico",rotulo:"Na unidade atual",valor:No(n.duracaoMs),detalhe:o.alerta?`parado h\xE1 ${io(o.parado?.dias??0,"dia","dias")} (limite: ${o.limite})`:n.pendenteRecebimento?`aguardando abrir desde ${U(n.recebido)}`:`desde ${U(n.recebido)}`,estado:"pronto",...o.alerta?{alerta:!0}:{}}:{id:"naUnidade",origem:"historico",rotulo:"Na unidade atual",valor:"\u2014",detalhe:"o processo n\xE3o est\xE1 aberto aqui",estado:"pronto"}],i=e.find(s=>s.inicio==="gerado"),l=i?Ye(i.usuarioRecebeu,i.usuarioRecebeuNome):"";i&&l&&a.push({id:"geradoPor",origem:"historico",rotulo:"Gerado por",valor:i.usuarioRecebeuNome??i.usuarioRecebeu??"",detalhe:`${i.unidade}, ${U(i.recebido)}`,estado:"pronto"});let c=e.flatMap(s=>s.assinaturas);if(c.length){let s=c.reduce((p,m)=>m.em.getTime()>=p.em.getTime()?m:p);a.push({id:"ultimaAssinatura",origem:"historico",rotulo:"\xDAltima assinatura",valor:s.usuario??"",detalhe:`${s.nrSei?`SEI ${s.nrSei}, `:""}${U(s.em)}`,estado:"pronto"})}return a}var xt={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"},At={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"};function sr(o,e){let r=xt[o];return{rotulo:o==="restrito"&&e?`${r}: ${e}`:r,icone:At[o]}}function cr(o){let{arv:e,fatias:r}=o,t=e.nivel==="sigiloso",n=_o(e),a=t?null:Ze({passagens:o.passagens,sigla:o.unidade,recebidoEm:o.recebidoEm},o.agora),i=Qe(a,o.limite),l=nr(e),c=t?[]:ir({passagens:o.passagens,unidade:o.unidade,parado:a,alerta:i,limite:o.limite}),s={idProcedimento:e.idProcedimento,protocolo:e.protocolo,sigiloso:t,linkPermanente:o.linkPermanente,cards:[...l,...c],coleta:o.coleta,parado:a,alerta:i},p=r.marcador?.itens??tr(e),m=t?[]:p.map(L=>{let{prazo:T,texto:j}=xe(L.texto),B=T?Ae(T,o.agora):null;return{nome:L.nome,texto:j,icone:L.icone,...T&&B?{prazo:{rotulo:`${T.vencimento?"at\xE9 ":""}${Pe(T)} \xB7 ${B.rotulo}`,nivel:B.nivel}}:{}}}),h=t?null:Ee(e.pagina.html),d=r.dadosProcesso,u=!t&&d?.disponivel?d.valor:null,f;t||u?f="pronto":d&&!d.disponivel?f=d.motivo==="consultas"?"consultas":"fechado":f=o.espera==="desistiu"?"indisponivel":"carregando";let b=u?sr(u.nivel,u.hipotese):sr(e.nivel,e.hipotese),x=t?[]:u?.interessados??[],A=t?void 0:u?.especificacao,E=t||!u?[]:De(u.observacoes,o.unidade,u.observacoesOutras),P=t?null:r.blocoInterno,M=P?.descricao?P.descricao:void 0,w={protocolo:e.protocolo,sigiloso:t,tipo:u?.tipo||e.tipo,interessados:x,...r.atribuicao?.texto?{situacao:r.atribuicao.texto}:{},unidade:o.unidade,diasNaUnidade:a?a.dias:null,documentos:n};return{...s,tipo:u?.tipo||e.tipo,nivel:b,dados:f,...u?.autuacao?{autuacao:u.autuacao}:{},...A?{especificacao:A}:{},urgente:A?ye(A,"URGENTE"):!1,assuntos:t?[]:u?.assuntos??[],interessados:x,observacoes:E,marcadores:m,...h?{prazoNativo:h}:{},...M?{blocoInterno:M}:{},resumo:w}}function lr(o){return JSON.stringify(o)}var Pt=15e3,Et=8e3;function ur(o,e){return o.getElementById(`span${e}`)?.classList.contains("infraArvoreNoSelecionado")??!1}function yt(o,e,r){return new Promise(t=>{if(ur(o,e))return t(!0);let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,l=h=>{i||(i=!0,s?.disconnect(),clearTimeout(m),clearInterval(p),t(h))},c=()=>{ur(o,e)&&l(!0)},s=typeof a=="function"?new a(c):null;s?.observe(o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0});let p=setInterval(c,250),m=setTimeout(()=>l(!1),r)})}async function dr(o){let e=o.doc,r=v=>(o.depurar?.(v),null);if(!e.getElementById("divArvoreHtml"))return r("sem #divArvoreHtml");let n=o.prazoMs??Pt,a=o.ponte.documento();if(!a)return r("sem o documento do quadro da \xE1rvore");let i=await Le(a,n);if(!i)return r("a \xE1rvore n\xE3o chegou no prazo");let l=i;if(!await yt(a,l.idProcedimento,n))return r("o n\xF3 do processo n\xE3o est\xE1 selecionado");let c=o.cache(l),s=l.nivel==="sigiloso",p={},m=null,h=async()=>{try{[p,m]=s?[{},null]:await Promise.all([c.fatias(),c.historico()])}catch{}};await h();let d=Ue(),u="aguardando",f=0,b="",x="",A="",E="",P=null,M=!1,w=null,L=null,T=null,j={calcular:()=>o.ponte.calcular(),cancelar:()=>o.ponte.cancelar(),abrirHistorico:()=>o.ponte.abrirHistorico(),copiarResumo:()=>{P&&o.copiar(rr(P.resumo)).then(v=>o.avisar(v?"Resumo copiado.":"N\xE3o foi poss\xEDvel copiar.",2200))},copiarTexto:v=>void o.copiar(v).then(C=>o.avisar(C?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)),copiarLink:()=>{P&&o.copiar(P.linkPermanente).then(v=>o.avisar(v?"Link do processo copiado.":"N\xE3o foi poss\xEDvel copiar.",2200))},tentarDeNovo:()=>{u="aguardando",$o(),o.ponte.pedirFatias(),$()}},B=()=>!m||!Ao(m.coletadoEm,o.agora().getTime())?null:fe(m.andamentos,o.agora()),vr=()=>{let v=o.ponte.coleta();return v==="pronto"?{fase:"parada"}:v},Lo=()=>{if(w=null,M)return;let v=o.ponte.documento();if(v&&v!==a){a=v;let z=no(v);z&&z.idProcedimento===l.idProcedimento&&(l=z)}let C=s?null:B();P=cr({arv:l,fatias:p,passagens:C,unidade:o.unidade,agora:o.agora(),limite:o.limite,recebidoEm:s?null:er(o.armazenamento,l.idProcedimento),coleta:vr(),espera:u,linkPermanente:o.linkPermanente(l.idProcedimento)});let V=JSON.stringify([P.cards,P.coleta]),Vo=lr({...P,cards:[],coleta:{fase:"parada"},resumo:{protocolo:"",sigiloso:!1}}),Fo=String(P.sigiloso),jo=P.linkPermanente;if(V!==b&&(b=V,Ve(d,P,j),f++),Vo!==x&&(x=Vo,Fe(d,P,j),f++),Fo!==A&&(A=Fo,je(d,P,j),f++),jo!==E&&(E=jo,Be(d,P,e),f++),L&&clearTimeout(L),L=null,m&&C){let z=m.coletadoEm+18e5-o.agora().getTime();z>0&&z<2**31-1&&(L=setTimeout($,z+1e3))}};function $(){M||w||(w=setTimeout(Lo,0))}function $o(){T&&clearTimeout(T),T=setTimeout(()=>{!p.dadosProcesso&&!s&&(u="desistiu",$())},o.esperaMs??Et)}let Ho=()=>{let v=e.getElementById("divArvoreHtml");if(!v)return;for(let V of v.querySelectorAll(`#${Co}:not([data-spro-capa])`))V.remove();v.classList.remove("d-flex"),d.raiz.parentElement!==v&&v.prepend(d.raiz);let C=e.getElementById("divArvoreInformacao")??e.getElementById("divInformacao");C&&!C.hasAttribute("data-spro-copiado")&&(Ge(d,C),C.setAttribute("data-spro-copiado","1"),C.style.display="none")};Ho();let qo=o.Observador??e.defaultView?.MutationObserver??globalThis.MutationObserver,zo=typeof qo=="function"?new qo(v=>{M||!v.some(V=>!d.raiz.contains(V.target))||d.raiz.parentElement?.id==="divArvoreHtml"&&e.contains(d.raiz)&&e.getElementById("divArvoreInformacao")?.hasAttribute("data-spro-copiado")!==!1||Ho()}):null;zo?.observe(e.body??e.documentElement,{childList:!0,subtree:!0});let Uo=()=>d.raiz.setAttribute("data-tema",o.escuro()?"escuro":"claro");Uo(),Lo();let xr=[c.aoMudar(()=>{h().then($)}),o.ponte.aoMudarColeta(()=>{o.ponte.coleta()==="pronto"?h().then($):$()}),o.ponte.aoRecarregarArvore($),o.aoMudarTema(Uo)];return!s&&!p.dadosProcesso&&$o(),s||o.ponte.pedirFatias(),{raiz:d.raiz,desenhos:()=>f,atualizar:$,destruir(){M=!0,zo?.disconnect();for(let v of xr)v();for(let v of[w,L,T])v&&clearTimeout(v)}}}async function Ro(o,e){if(o.chaves){let t=(await o.chaves()).filter(n=>n.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var mr=0,fr=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",so=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return Q(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return fr(e)?e:null}catch{return null}}async gravar(e){if(!mo(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return mr+=1,await Ct(this.area,mr%25===0),!0}};async function Ct(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(l=>l.startsWith(Z)).length<=200)return 0;let r=await Ro(o,Z),t=Object.entries(r).filter(([,i])=>fr(i)).map(([i,l])=>({k:i,em:l.em,bytes:JSON.stringify(l).length})).sort((i,l)=>l.em-i.em),n=[],a=0;t.forEach((i,l)=>{a+=i.bytes,(l>=200||a>2097152)&&n.push(i.k)});for(let i of Object.keys(r))t.some(l=>l.k===i)||n.push(i);return n.length&&await o.remover(n),n.length}catch{return 0}}var gr=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),co=class{constructor(e,r,t,n=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=n}get chave(){return oo(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return gr(e)?e:null}catch{return null}}async gravar(e){if(!mo(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Nt(this.area,this.agora()),!0}};async function Nt(o,e){try{let r=await Ro(o,fo),t=Object.entries(r).filter(([,a])=>gr(a)).map(([a,i])=>({k:a,em:i.coletadoEm})).sort((a,i)=>i.em-a.em),n=new Set;t.forEach((a,i)=>{(i>=12||e-a.em>864e5)&&n.add(a.k)});for(let a of Object.keys(r))t.some(i=>i.k===a)||n.add(a);return n.size&&await o.remover([...n]),n.size}catch{return 0}}function Tt(o){if(!o)return{fase:"parada"};if(o==="pronto")return"pronto";if(o.startsWith("coletando:")){let[e=0,r=0]=o.slice(10).split("/").map(t=>Number.parseInt(t,10)||0);return{fase:"coletando",feito:e,total:r}}return o.startsWith("erro:")?{fase:"erro",mensagem:o.slice(5)||"N\xE3o foi poss\xEDvel calcular."}:{fase:"parada"}}function hr(o){let e=()=>o.querySelector("#ifrArvore"),r=()=>{try{return e()?.contentDocument??null}catch{return null}},t=n=>{let a=r(),i=a?.defaultView?.Event;a&&i&&a.dispatchEvent(new i(n))};return{documento:r,pedirFatias:()=>t(ee),calcular:()=>t(re),cancelar:()=>t(te),abrirHistorico:()=>t(oe),coleta:()=>Tt(r()?.documentElement?.getAttribute(po)??null),aoMudarColeta(n){let a=null,i=()=>{a?.disconnect(),a=null;let c=r(),s=c?.defaultView?.MutationObserver;c?.documentElement&&s&&(a=new s(n),a.observe(c.documentElement,{attributes:!0,attributeFilter:[po]}))};i();let l=e();return l?.addEventListener("load",i),()=>{a?.disconnect(),l?.removeEventListener("load",i)}},aoRecarregarArvore(n){let a=e();return a?.addEventListener("load",n),()=>a?.removeEventListener("load",n)}}}function br(o,e,r){let t=new so(o,e,r),n=new co(o,e,r),a=new Set([Q(e,r),oo(e,r)]);return{async fatias(){let i=await t.ler(),l=d=>i?.fatias?.[d]?.dado,c={},s=l("dadosProcesso"),p=l("marcador"),m=l("blocoInterno"),h=l("atribuicao");return s&&(c.dadosProcesso=s),p&&(c.marcador=p),m&&(c.blocoInterno=m),h&&(c.atribuicao=h),c},historico:()=>n.ler(),aoMudar:i=>o.aoMudar(l=>Object.keys(l).some(c=>a.has(c))?i():void 0)}}var ko=null,lo=o=>document.documentElement?.setAttribute("data-spro-capa-estado",o);async function _t(){if(window===window.top||!document.getElementById("divArvoreHtml")||Re(window))return;lo("iniciando");let o=Ko();_e(o);let{dataValues:e}=await chrome.storage.sync.get("dataValues");Me(`${Jo}
${Zo}`),Ce(document);let r=we(o),t=Bo(chrome.storage.local,"local"),n=`${location.origin}${location.pathname}`;ko=await dr({doc:document,ponte:hr(o),cache:a=>br(t,Se(r.host,r.login),a.idProcedimento),agora:()=>new Date,unidade:r.unidade.sigla,limite:or(Go(e,ae)),armazenamento:localStorage,linkPermanente:a=>ke(n,a),copiar:a=>ne(document,a),avisar:(a,i=2e3)=>void uo(document,a,void 0,i),escuro:()=>Ne(document),aoMudarTema:a=>Te(document,a),depurar:a=>lo(`desistiu: ${a}`)}),ko&&lo("desenhada"),window.addEventListener("pagehide",()=>ko?.destruir(),{once:!0})}_t().catch(o=>{lo(`erro: ${o instanceof Error?o.message:String(o)}`),console.warn("[SEI Pro] capa do processo:",o)});})();
