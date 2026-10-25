/* GERADO por favoritos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function ba(e){let o={};for(let[t,r]of Object.entries(e)){let a={};r&&"newValue"in r&&(a.novo=r.newValue),r&&"oldValue"in r&&(a.antigo=r.oldValue),o[t]=a}return o}function Wo(e,o){return{obter:(t=null)=>e.get(t),gravar:t=>e.set(t),remover:t=>e.remove(t),chaves:typeof e.getKeys=="function"?()=>e.getKeys():void 0,aoMudar(t){let r=(a,n)=>{n===o&&t(ba(a))};return chrome.storage.onChanged.addListener(r),()=>chrome.storage.onChanged.removeListener(r)}}}function vo(e=crypto){if(typeof e.randomUUID=="function")return e.randomUUID();let o=e.getRandomValues(new Uint8Array(16));o[6]=(o[6]??0)&15|64,o[8]=(o[8]??0)&63|128;let t=[...o].map(r=>r.toString(16).padStart(2,"0")).join("");return`${t.slice(0,8)}-${t.slice(8,12)}-${t.slice(12,16)}-${t.slice(16,20)}-${t.slice(20)}`}async function Pe(e,o="seipro/dispositivo"){let t=(await e.obter(o))[o];if(typeof t=="string"&&t)return t;let r=vo();return await e.gravar({[o]:r}),r}var Se=e=>String(e).padStart(2,"0");function ho(e=new Date){return`${e.getFullYear()}-${Se(e.getMonth()+1)}-${Se(e.getDate())}`}function xa(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e);if(!o)throw new Error(`Data inv\xE1lida: ${e}`);return new Date(Number(o[1]),Number(o[2])-1,Number(o[3]),12)}function bo(e,o){let t=xa(e);return t.setDate(t.getDate()+o),ho(t)}function Do(e){let[o,t,r]=e.split("-");return`${r}/${t}/${o}`}function ya(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===o)?.value}function Aa(e,o){let t=ya(e,o);return!(t===!1||t===0||t==="")}async function Te(e,o=chrome.storage.sync){let t=await o.get("dataValues");return Aa(t.dataValues,e)}function De(e){try{return!!e.getItem("darkModePro")}catch{return!1}}function Ea(e){let o=e.documentElement?.getAttribute("data-spro-tema");return o==="claro"||o==="escuro"?o:null}function uo(e,o){let t=Ea(e);return t?t==="escuro":De(o)}function Zo(e,o){let t=e.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof t!="function"||!e.documentElement)return()=>{};let r=new t(o);return r.observe(e.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>r.disconnect()}function Me(e,o,t){return Zo(e,()=>{t.temaEscuro=uo(e,o);let r=Mo(e);r&&(t.corTema=r)})}function Mo(e){let o=e.defaultView;for(let t of[".infraCorBarraSistema","#divInfraBarraSistema","#divInfraBarraSistemaE"]){let r=e.querySelector(t);if(r)try{let a=Ie(o?.getComputedStyle?.(r).backgroundColor??"");if(a)return a}catch{}}}function ke(e){let o=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(e);if(!o)return"#1f2328";let[t,r,a]=[o[1],o[2],o[3]].map(n=>Number.parseInt(n??"0",16));return(t*299+r*587+a*114)/1e3>140?"#1f2328":"#ffffff"}function Ie(e){let o=e.trim().toLowerCase(),t=null,r=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(o);r&&(t=[r[1],r[2],r[3]].map(p=>Number.parseInt(p??"0",16)));let a=/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(o);if(a){if((a[4]===void 0?1:a[4].endsWith("%")?Number.parseFloat(a[4])/100:Number.parseFloat(a[4]))<.9)return null;t=[a[1],a[2],a[3]].map(u=>Number(u))}if(!t||t.some(p=>!Number.isFinite(p)||p<0||p>255))return null;let[n,i,s]=t,c=Math.max(n,i,s),l=Math.min(n,i,s);if(c===0||(c-l)/c<.25)return null;let d=[n,i,s];for(let p=0;p<12&&ke(Ce(d))!=="#ffffff";p++)d=d.map(u=>Math.round(u*.88));return Ce(d)}function Ce(e){return`#${e.map(o=>o.toString(16).padStart(2,"0")).join("")}`}var k=class extends Error{constructor(t,r){super(r);this.codigo=t;this.name="ErroRpc"}};function ko(e,o={}){let t=0,r=!0,a=new Map,n=[],i=()=>{if(r){r=!1;for(let[,c]of a)clearTimeout(c.timer),c.erro(new k("DESCONECTADO","A conex\xE3o com a aba do SEI caiu."));a.clear();for(let c of n)c()}},s=c=>{r&&e.postMessage(c)};return e.onMessage.addListener(c=>{let l=c;if(l?.rpc==="resposta"&&typeof l.id=="number"){let u=a.get(l.id);if(!u)return;a.delete(l.id),clearTimeout(u.timer),l.ok?u.ok(l.valor):u.erro(new k(l.erro?.codigo??"ERRO",l.erro?.mensagem??"Falha."));return}if(l?.rpc!=="pedido"||typeof l.id!="number"||typeof l.op!="string")return;let d=l.id,p=l.op;(async()=>{try{let u=o[p];if(!u)throw new k("OP_DESCONHECIDA",`Opera\xE7\xE3o desconhecida: ${p}`);s({rpc:"resposta",id:d,ok:!0,valor:await u(l.args)})}catch(u){let m=u.codigo;s({rpc:"resposta",id:d,ok:!1,erro:{codigo:typeof m=="string"?m:"ERRO",mensagem:u instanceof Error?u.message:String(u)}})}})()}),e.onDisconnect.addListener(i),{get aberta(){return r},chamar(c,l,d=15e3){if(!r)return Promise.reject(new k("DESCONECTADO","A conex\xE3o com a aba do SEI caiu."));let p=++t;return new Promise((u,m)=>{let f=setTimeout(()=>{a.delete(p),m(new k("PRAZO",`A aba do SEI n\xE3o respondeu a tempo (${c}).`))},d);a.set(p,{ok:u,erro:m,timer:f}),e.postMessage({rpc:"pedido",id:p,op:c,args:l})})},aoFechar(c){n.push(c)},fechar(){r&&(e.disconnect(),i())}}}function g(e,o={},...t){let r=document.createElement(e);for(let[a,n]of Object.entries(o))n===void 0||n===!1||(typeof n=="function"?r.addEventListener(a.replace(/^on/,""),n):n===!0?r.setAttribute(a,""):a==="class"?r.className=n:a==="value"&&e==="textarea"?r.value=n:r.setAttribute(a,n));for(let a of t)a!=null&&a!==!1&&r.append(a);return r}var U={fill:"currentColor",stroke:"none"},Oe="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Le={estrela:[["path",{d:Oe}]],estrelaCheia:[["path",{d:Oe,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...U}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...U}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...U}],["circle",{cx:"12",cy:"12",r:"1.4",...U}],["circle",{cx:"19",cy:"12",r:"1.4",...U}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...U}],["circle",{cx:"15",cy:"6",r:"1.3",...U}],["circle",{cx:"9",cy:"12",r:"1.3",...U}],["circle",{cx:"15",cy:"12",r:"1.3",...U}],["circle",{cx:"9",cy:"18",r:"1.3",...U}],["circle",{cx:"15",cy:"18",r:"1.3",...U}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},ni=Object.keys(Le);function C(e,o=18,t=document){let r="http://www.w3.org/2000/svg",a=t.createElementNS(r,"svg"),n={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of Le[e]){let c=t.createElementNS(r,i);for(let[l,d]of Object.entries(s))c.setAttribute(l,d);a.append(c)}return a}var wa=e=>`position:fixed;left:50%;bottom:20px;transform:translateX(-50%);z-index:2147483646;display:flex;align-items:center;gap:12px;max-width:min(560px,calc(100vw - 24px));box-sizing:border-box;padding:10px 10px 10px 16px;font:13px/1.35 system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:#f3f5f8;background:#1f2329;border:1px solid rgb(255 255 255 / 8%);border-radius:12px;box-shadow:0 10px 24px -6px rgb(16 24 40 / 30%),0 24px 56px -12px rgb(16 24 40 / 35%);animation:${e}-aviso 220ms cubic-bezier(.2,.8,.2,1)`,Pa="flex:none;padding:5px 10px;font:inherit;font-weight:600;color:#9cc3ff;background:rgb(255 255 255 / 7%);border:0;border-radius:6px;cursor:pointer";function Io(e){if(!/^[a-z][a-z0-9-]*$/.test(e))throw new Error(`Prefixo de classe inv\xE1lido: ${e}`);return e}function Sa(e,o,t="spro-painel"){let r=`${Io(t)}-aviso`;return(a,n,i)=>new Promise(s=>{for(let p of e.querySelectorAll(`.${r}`))p.remove();let c=!1,l=p=>{c||(c=!0,d.remove(),s(p))},d=g("div",{class:r,role:"status",style:wa(t)+(o?";background:#2b3036":"")},g("span",{style:"flex:1"},a),...n.map((p,u)=>g("button",{type:"button",style:Pa,onclick:()=>l(u)},p)));(e.body??e.documentElement).append(d),setTimeout(()=>l(-1),Math.max(10,Math.min(i,6e4)))})}function Ne(e,o,t="spro-painel"){let r=Sa(e,o,t);return(a,n,i)=>r(a,n?[n]:[],i).then(s=>s===0)}var Ta="position:fixed;inset:0;left:0;top:0;width:100vw;height:100vh;max-width:none;max-height:none;margin:0;z-index:2147483646;background:transparent;";function qe(e,o,t){let r=null,a=null,n=l=>{o.style.height=`${Math.max(80,Math.min(Math.round(l),2e4))}px`},i=()=>{let l=[e.documentElement];e.body&&l.push(e.body);let d=e.defaultView;for(let p=o.parentElement;p&&p!==e.body&&p!==e.documentElement;p=p.parentElement)try{let u=d?.getComputedStyle?.(p).overflowY??"";(u==="auto"||u==="scroll")&&p.scrollHeight>p.clientHeight&&l.push(p)}catch{}return l},s=()=>!o.isConnected||t.hidden||t.closest?.("[hidden]")?!1:typeof o.getClientRects!="function"||o.getClientRects().length>0,c={ligar(l){if(l&&!r&&!s())return!1;if(l&&!r){let d=o.getBoundingClientRect?.().height||Number.parseFloat(o.style.height)||0,p=i().map(u=>[u,u.style.overflow]);r={iframe:o.getAttribute("style")??"",reserva:t.style.minHeight,travados:p},d&&(t.style.minHeight=`${Math.round(d)}px`),o.setAttribute("style",`${r.iframe};${Ta}`);for(let[u]of p)u.style.overflow="hidden"}else if(!l&&r){o.setAttribute("style",r.iframe),t.style.minHeight=r.reserva;for(let[d,p]of r.travados)d.style.overflow=p;r=null,a!==null&&n(a),a=null}return!0},altura(l){Number.isFinite(l)&&(r?a=l:n(l))}};return o.addEventListener("load",()=>c.ligar(!1)),c}function Re(e,o){try{let t=JSON.parse(e.getItem("optionsPro")??"{}");if(!Array.isArray(t.orderPanelHome))return null;let r=t.orderPanelHome.find(n=>n?.name===o),a=Number(r?.index);return r&&Number.isFinite(a)?a:null}catch{return null}}function ze(e,o,t){if(t!==null)for(let r of[...e.children]){if(!r.classList.contains("panelHomePro"))continue;let a=Number.parseInt(r.getAttribute("data-order")??"",10);if(Number.isFinite(a)&&a>t){r.before(o);return}}e.append(o)}function Fe(e,o,t=r=>Ca(e,r)){o.style.setProperty("font-weight","600","important"),t(()=>_e(e,o))}function _e(e,o){let t=e.querySelector("#divInfraBarraLocalizacao"),r=e.defaultView;if(!(!t||!r?.getComputedStyle))try{let a=r.getComputedStyle(t);if(!(Number.parseFloat(a.fontSize)>16))return;o.style.fontSize=a.fontSize,a.fontFamily&&(o.style.fontFamily=a.fontFamily)}catch{}}function Ca(e,o){let t=e.defaultView,r=()=>t?.setTimeout(o,1500);e.readyState==="complete"?r():t?.addEventListener("load",r,{once:!0})}function Da(e,o){let t=Io(o),r=`${t}-painel-estilo`;if(e.getElementById(r))return;let a=e.createElement("style");a.id=r,a.textContent=[`.${t}-titulo{display:flex!important;align-items:center;gap:8px}`,`.${t}-recolher{margin-left:4px;background:none;border:0;cursor:pointer;color:inherit;line-height:0;padding:2px;border-radius:4px}`,`.${t}-recolher:hover{background:rgb(127 127 127 / 14%)}`,`.${t}-recolher:focus-visible{outline:2px solid #1a73e8;outline-offset:1px}`,`@keyframes ${t}-aviso{from{opacity:0;transform:translate(-50%,10px)}}`,`@media (prefers-reduced-motion:reduce){.${t}-aviso{animation:none!important}}`].join(`
`),(e.head??e.documentElement).append(a)}function He(e,o){let t=e.querySelector("#frmProcedimentoControlar");if(!t||e.querySelector("#tblMarcadores")||e.getElementById(o.id))return null;let r=Io(o.prefixo);(o.estilo??(u=>Da(u,r)))(e);let a=e.querySelector("#panelHomePro");a||(a=g("div",{id:"panelHomePro",style:"display: inline-block; width: 100%;"}),t.after(a));let n=g("iframe",{src:o.urlApp,title:o.tituloIframe,allow:"clipboard-write",style:`width: 100%; height: ${o.alturaInicial??120}px; border: 0; display: block; color-scheme: ${o.temaEscuro?"dark":"light"};`});Zo(e,()=>{n.style.colorScheme=uo(e,localStorage)?"dark":"light"});let i=g("div",{class:`${r}-corpo`,hidden:o.recolhido},n),s=g("button",{type:"button",class:`${r}-recolher`}),c=()=>{let u=i.hidden,m=u?o.rotulos.mostrar:o.rotulos.recolher;s.setAttribute("aria-expanded",String(!u)),s.setAttribute("aria-label",m),s.title=m,s.replaceChildren(C(u?"expandir":"recolher",18))};s.addEventListener("click",()=>{i.hidden=!i.hidden,c(),o.aoRecolher(i.hidden)}),c();let l=g("div",{class:`infraBarraLocalizacao titlePanelHome ${r}-titulo`},o.icone(),o.titulo,s);Fe(e,l);let d=g("div",{class:"panelHomePro",id:o.id,"data-order":o.ordem===null?"":String(o.ordem),style:"display: inline-block; width: 100%;"},l,i);ze(a,d,o.ordem);let p=qe(e,n,i);return{painel:d,iframe:n,corpo:i,sobreposicao:p,fechar:()=>{p.ligar(!1),d.remove()}}}function $e(e){return{altura:o=>{let t=Number(o?.px);return e.sobreposicao?e.sobreposicao.altura(t):e.iframe&&Number.isFinite(t)&&(e.iframe.style.height=`${Math.max(80,Math.min(Math.round(t),2e4))}px`),!0},sobrepor:o=>e.sobreposicao?e.sobreposicao.ligar(o?.ativo===!0):!1,aviso:o=>{let t=o??{},r=Number(t.ms),a=Number.isFinite(r)?r:7e3,n=String(t.texto??"").slice(0,400),i=Array.isArray(t.acoes)?t.acoes.slice(0,3).map(s=>String(s).slice(0,40)):[];return i.length>1&&e.avisarAcoes?e.avisarAcoes(n,i,a):e.avisar?e.avisar(n,t.acao?String(t.acao).slice(0,40):void 0,a):!1}}}function Ve(e,o,t){let r=null;return e.iframe.addEventListener("load",()=>{r?.fechar(),r=ko(o(),t),r.aoFechar(()=>e.sobreposicao.ligar(!1))}),{fechar:()=>{r?.fechar(),e.fechar()},rpc:()=>r?.aberta?r:null}}function Yo(e){if(typeof e=="number"&&e)return String(e);let o=e?.id;return typeof o=="string"&&o?o:null}function Ue(e,o,t){let r=Yo(e);return r?!o||!t.has(r):!1}function je(e){let o=null,t=!1,r=new Set,a=()=>{o?.aberta&&o.chamar("ola",e.estado(),5e3).catch(()=>{})},n=c=>{if(t||!Ue(c,!!o?.aberta,r))return;o?.fechar();let l;try{l=ko(e.conectar(),e.tratadores)}catch{o=null;return}o=l,l.aoFechar(()=>{o===l&&(o=null)});let d=Yo(c);d&&r.add(d),a()},i=()=>{t||e.area.obter(e.chave).then(c=>n(c[e.chave])).catch(()=>{})},s=e.area.aoMudar(c=>{e.chave in c&&n(c[e.chave]?.novo)});return i(),{apresentar:a,verificar:i,parar(){t=!0,s(),o?.fechar(),o=null}}}function Ma(){let e=globalThis,o=e.wrappedJSObject??e.window?.wrappedJSObject,t=e.exportFunction;return!o||typeof t!="function"?null:{pagina:o,exportFunction:r=>t(r,o)}}function ka(e,o){if(!o.pagina.Object)return e;let t=new o.pagina.Object;for(let[r,a]of Object.entries(e))a!==void 0&&(t[r]=a);return t}function Qo(e,o,t,r,a=Ma()){if(!a)return t?e.request(o,t,r):e.request(o,r);let n=null,{pagina:i,exportFunction:s}=a,c=s(d=>new i.Promise(s(p=>{r(d).then(u=>{n={ok:!0,valor:u},p()},u=>{n={ok:!1,erro:u},p()})}))),l=t?e.request(o,ka(t,a),c):e.request(o,c);return Promise.resolve(l).then(()=>{let d=n;if(!d)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(d.ok)return d.valor;throw d.erro})}function Be(){return globalThis.navigator?.locks??null}function Ge(e,o,t=Be()){return t?Qo(t,e,{ifAvailable:!0},async r=>r?o():null):o()}function Xe(e,o,t=Be()){return t?Qo(t,e,null,()=>o()):o()}var Je=`/*
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
`;var w=class extends Error{codigo;detalhe;constructor(o,t,r){super(t),this.name="ErroSei",this.codigo=o,this.detalhe=r}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Ke(e){return e instanceof w}function xo(e){if(e instanceof w)return e;if(e instanceof DOMException&&e.name==="AbortError")return new w("CANCELADO","Opera\xE7\xE3o cancelada.");let o=e instanceof Error?e.message:String(e);return new w("SEI_REDE",`Falha ao falar com o SEI: ${o}`)}var Oa={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function Y(e){return e.includes("&")?e.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(o,t)=>{let r=t[0]==="#"?t[1]==="x"||t[1]==="X"?parseInt(t.slice(2),16):parseInt(t.slice(1),10):Oa[t];return r===void 0||Number.isNaN(r)?o:String.fromCodePoint(r)}):e}var We={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Ze=null;function Oo(e){return Ze?Ze(e):new DOMParser().parseFromString(e,"text/html")}function T(e){return(e?.textContent??"").replace(/\s+/g," ").trim()}var La={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function oe(e,o){let t=e[o],r="";for(o+=1;o<e.length;){let a=e[o];if(a==="\\"){let n=e[o+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(e.slice(o+2,o+6))){r+=String.fromCharCode(parseInt(e.slice(o+2,o+6),16)),o+=6;continue}r+=La[n]??n,o+=2;continue}if(a===t)return[r,o+1];r+=a,o+=1}return[r,o]}function ee(e,o){let t=[],r=o;for(;r<e.length;){let a=e[r];if(a===")")return[t,r+1];if(a===","||/\s/.test(a)){r+=1;continue}if(a==='"'||a==="'"){let[s,c]=oe(e,r);t.push(s),r=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(e.slice(r,r+32));if(n){let s=n[1];t.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),r+=s.length;continue}let i=0;for(;r<e.length;){let s=e[r];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;r+=1}t.push(null)}return[t,r]}function O(e){return typeof e=="string"?Y(e):e==null?"":String(e)}var Na=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function G(e){let o=new Set;for(let t of e.replace(/&amp;/g,"&").matchAll(Na))o.add(t[0]);return[...o]}function N(e){let o=e.indexOf("?");return new URLSearchParams(o>=0?e.slice(o+1):"")}function X(e,o,t={}){let r=Array.isArray(e)?e:G(e);for(let a of r){let n=N(a),i=n.get("acao")??"";if(!(typeof o=="string"?i!==o:!o.test(i))&&Object.entries(t).every(([s,c])=>n.get(s)===c))return a}return null}function Ye(e,o){let t=[...e.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),r=G(t).filter(i=>N(i).get("acao")===o),n=(r.length?r:G(e.html).filter(i=>N(i).get("acao")===o)).sort((i,s)=>[...N(i).keys()].length-[...N(s).keys()].length)[0];if(!n)throw new w("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${o}" para este usu\xE1rio.`);return n}function qa(e){let o=new Map;for(let t of e.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[r]=ee(e,t.index+t[0].length);o.set(Number(t[1]),{indice:Number(t[1]),args:r,props:{}})}for(let t of e.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let r=o.get(Number(t[1]));if(!r)continue;let[a]=oe(e,t.index+t[0].length-1);r.props[t[2]]=a}return[...o.values()].sort((t,r)=>t.indice-r.indice)}function Ra(e){let o=[];for(let t of e.matchAll(/new\s+infraArvoreAcao\(/g)){let[r]=ee(e,t.index+t[0].length);o.push({tipo:O(r[0]),idPai:O(r[2]),href:O(r[3]),titulo:O(r[5]),icone:O(r[6]),extra:r[8]==null?void 0:O(r[8])})}return o}function Qe(e,o){let t=e.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===o);if(!t)return{nivel:"publico"};let[r,...a]=t.titulo.split(`
`);return{nivel:/sigilos/i.test(r)||/sigiloso/.test(t.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function ot(e){return[...new Set([...e.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(o=>O(o[1])))]}function et(e){return[...new Set([...e.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(o=>o[1]))]}var za=/\s*\(\d{5,}\)\s*$/;function Fa(e,o){return e.filter(t=>t.args[0]==="DOCUMENTO").map(t=>{let r=O(t.args[1]),a=O(t.args[5]),n=O(t.args[7]),i=(t.props.src??"").replace(/&amp;/g,"&"),s=o.find(p=>p.tipo==="ASSINATURA"&&p.idPai===r),{nivel:c,hipotese:l}=Qe(o,r),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:r,numero:O(t.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(za,""),pasta:t.args[2]&&String(t.args[2]).startsWith("PASTA")?String(t.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:l,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:o.find(p=>p.tipo==="UNIDADE_GERADORA"&&p.idPai===r)?.extra,link:O(t.args[3]).replace(/&amp;/g,"&"),src:i,acoes:G(t.props.acoes??""),botoes:ot(t.props.acoes??""),funcoes:et(t.props.acoes??"")}})}function J(e){let o=e.html,t=qa(o),r=Ra(o),a=t.find(c=>c.args[0]==="PROCESSO");if(!a)throw new w("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=O(a.args[1]),i=Qe(r,n),s=Fa(t,r);return{idProcedimento:n,protocolo:O(a.args[5])||O(a.args[15]),tipo:O(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:r.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:G(a.props.acoes??""),botoesProcesso:ot(a.props.acoes??""),funcoesProcesso:et(a.props.acoes??""),linkProcesso:O(a.args[3]).replace(/&amp;/g,"&"),sinais:r.filter(c=>c.idPai===n),links:G(o),pagina:e}}async function tt(e,o,t){let r=await e.obter(o,t);if(!/acao=procedimento_visualizar/.test(r.url)){let a=r.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new w("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");r=await e.obter(a,t)}if(/infraArvoreNo\("PASTA"/.test(r.html)){let a=X(r.html,"procedimento_visualizar")&&G(r.html).find(n=>/abrir_pastas=1/.test(n));a&&(r=await e.obter(a,t))}return J(r)}function io(e,o,t){if(t){let r=e.documentos.find(a=>a.id===t);return r?X(r.acoes,o):null}return X(e.acoesProcesso,o)??X(e.links,o,{id_procedimento:e.idProcedimento})}var st="\xA5",re="\xB1";function rt(e){return e.map(o=>`${o.id}${re}${o.texto}`).join(st)}function _a(e){return e?e.split(st).map(o=>{let[t,...r]=o.split(re);return{id:t,texto:r.join(re)}}):[]}function at(e){let o=[];for(let t of e.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))o.push([t[1],t[2]]);return o}var ct=e=>o=>o.url.includes(e),H=class e{constructor(o,t,r){this.http=o;this.pagina=t;this.elemento=r,this.id=r.id,this.action=(r.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Ha(r),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(o,t,r,a){let n=await o.obter(t,a);return e.de(n,r,o)}static de(o,t,r=null){let a=o.doc.querySelector(t);if(!a)throw new w("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${t}).`,T(o.doc.querySelector("title")));return new e(r,o,a)}pares(){return this.campos.map(o=>[o.nome,o.valor])}valor(o){return this.campos.find(t=>t.nome===o)?.valor}tem(o){return this.elemento.querySelector(`[name="${o}"]`)!==null||this.campos.some(t=>t.nome===o)}opcoes(o){let t=this.elemento.querySelector(`select[name="${o}"], select#${it(o)}`);return t?[...t.querySelectorAll("option")].map(r=>({valor:r.getAttribute("value")??T(r),texto:T(r),selecionada:r.hasAttribute("selected")})):[]}definir(o){for(let[t,r]of Object.entries(o)){if(r===void 0)continue;if(r===null){this.campos=this.campos.filter(n=>n.nome!==t);continue}let a=this.campos.find(n=>n.nome===t);a?a.valor=r:this.campos.push({nome:t,valor:r})}return this}escolher(o,t){let r=this.opcoes(o),a=te(t),n=r.find(i=>i.valor===t)??r.find(i=>te(i.texto)===a)??nt(r.filter(i=>te(i.texto).includes(a)));if(!n)throw new w("ARGUMENTO_INVALIDO",`"${t}" n\xE3o \xE9 uma op\xE7\xE3o de ${o}.`,r.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[o]:n.valor}),n}linhas(o){return[...this.elemento.querySelectorAll(`${o} tr`)].filter(t=>t.querySelector("input[type=checkbox]"))}itensLupa(o){let t=this.hiddenDaLupa(o);return t?_a(this.valor(t)??""):[]}definirLupa(o,t){let r=this.hiddenDaLupa(o);if(!r)throw new w("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${o} n\xE3o existe nesta tela.`);return this.definir({[r]:rt(t)}),this.campos=this.campos.filter(a=>a.nome!==o&&a.nome!==`${o}[]`),this}async enviar(o={}){if(!this.http)throw new w("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new w("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let t=this.pares();o.botao&&t.push(this.botaoDeEnvio(o.botao));let r=await this.http.enviar(this.action,t,o);if(o.sucesso&&!o.sucesso(r))throw new w("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${o.operacao??"a opera\xE7\xE3o"}.`,`${T(r.doc.querySelector("title"))} \u2014 ${r.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return r}botaoDeEnvio(o){let t=this.elemento.querySelector(`[name="${o}"]`)??nt([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return t?[t.getAttribute("name")??o,t.getAttribute("value")??T(t)??o]:[o,o]}hiddenDaLupa(o){let t=at(this.pagina.html).find(([r])=>r===o);return t?t[1]:null}sincronizarLupas(){for(let[o,t]of at(this.pagina.html)){let r=this.elemento.querySelector(`select#${it(o)}`);if(!r)continue;let a=[...r.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:T(n)}));(this.valor(t)??"")||this.definir({[t]:rt(a)}),this.campos=this.campos.filter(n=>n.nome!==o&&n.nome!==`${o}[]`)}}};function Ha(e){let o=[];for(let t of e.querySelectorAll("input, select, textarea")){let r=t.getAttribute("name");if(!r||t.hasAttribute("disabled"))continue;let a=t.tagName.toLowerCase();if(a==="input"){let n=(t.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!t.hasAttribute("checked"))continue;o.push({nome:r,valor:t.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")o.push({nome:r,valor:t.textContent??""});else{let n=[...t.querySelectorAll("option")],i=n.filter(l=>l.hasAttribute("selected")),s=t.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let l of c)o.push({nome:r,valor:l.getAttribute("value")??T(l)})}}return o}function te(e){return e.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function nt(e){return e.length===1?e[0]:void 0}function it(e){return e.replace(/([^\w-])/g,"\\$1")}function ae(e,o){let t=e.querySelector("input[type=checkbox]"),r=e.querySelector("a[href*='procedimento_trabalhar']");if(!t||!r)return null;let a=t.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(r.getAttribute("class")??""),i=[...e.querySelectorAll("td")],s=n?[]:[...i[1]?.querySelectorAll("a[aria-label]")??[]].map(c=>c.getAttribute("aria-label")??"");return{idProcedimento:t.getAttribute("value")??N(r.getAttribute("href")??"").get("id_procedimento")??"",protocolo:t.getAttribute("title")??T(r),grupo:o,tipo:/Tipo (.*?)(?: \/ Especifica|$)/.exec(a)?.[1]?.trim()??"",especificacao:n?"":/Especifica\S* (.*)$/.exec(a)?.[1]?.trim()??"",sigiloso:n,novo:/NaoVisualizado/.test(r.getAttribute("class")??""),atribuido:T(i[i.length-1]).replace(/^\(|\)$/g,""),sinais:s,documentoNovo:!!i[1]?.querySelector("img[src*='exclamacao']")||s.some(c=>/documento foi inclu/i.test(c))}}function Lo(e,o){let t=o==="recebidos"?"#tblProcessosRecebidos":"#tblProcessosGerados",r=e.doc.querySelector(t),a=Number(/\((\d+)\s+registro/.exec(T(r?.querySelector("caption")))?.[1]??0),n=[];for(let i of r?.querySelectorAll("tr[id^='P']")??[]){let s=ae(i,o);s&&n.push(s)}return{itens:n,total:a}}function lt(e){return[...Lo(e,"recebidos").itens,...Lo(e,"gerados").itens]}async function ut(e,o={}){let t=o.limite??2e3,r=await e.http.obter(e.linkMenu("procedimento_controlar"),{sinal:o.sinal,aceitarValidacao:!0}),a=[],n=0;for(let i of["recebidos","gerados"]){let s=i==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual",{itens:c,total:l}=Lo(r,i);n+=l,a.push(...c);let d=c.length,p=!1;for(let u=1;d<l&&c.length>0&&a.length<t;u+=1)r=await H.de(r,"#frmProcedimentoControlar",e.http).definir({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",[s]:String(u)}).enviar({sinal:o.sinal,aceitarValidacao:!0}),{itens:c}=Lo(r,i),d+=c.length,a.push(...c),p=!0;p&&(r=await H.de(r,"#frmProcedimentoControlar",e.http).definir({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0"}).enviar({sinal:o.sinal,aceitarValidacao:!0}))}return{total:n,processos:a.slice(0,t)}}var Qi=600*1e3;var os=Promise.resolve();var dt={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},ts=120*1e3;function pt(e){let o=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(e.trim());return o?`${o[3]}-${o[2]}-${o[1]}T${o[4].padStart(2,"0")}:${o[5]}:00`:""}function mt(e){return e.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function $a(e){let o=[...e.querySelectorAll("td")],t=T(o[0]),r=o[1]?.querySelector("a")?.getAttribute("title")??"",a=o[2]?.querySelector("a")?.getAttribute("title")??"",n=T(o[3]),i={data:t,unidade:T(o[1]),...r?{unidadeNome:r}:{},usuario:T(o[2]),descricao:n},s=pt(t);s&&(i.dataISO=s),a&&(i.usuarioNome=a),e.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=o[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let l=T(c);/^\d+$/.test(l)&&(i.nrSei=l);let d=N(c.getAttribute("href")??"").get("id_documento");d&&(i.idDocumento=d)}if(mt(n).startsWith(mt(dt.remetidoPrefixo))){let l=o[3]?.querySelector("a.ancoraSigla"),d=T(l);d&&(i.unidadeCitada=d);let p=l?.getAttribute("title")??"";p&&(i.unidadeCitadaNome=p)}return i}function Va(e){let o=e.doc.querySelector("#tblHistorico"),t=Number(/\((\d+)\s+registro/.exec(T(o?.querySelector("caption")))?.[1]??0);return{itens:[...o?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map($a),total:t}}function No(e){return Va(e).itens}var ft="#frmTextoPadraoInternoCadastro",gt="#frmTextoPadraoInternoLista",Ua='textarea[name="txaConteudo"], #txaConteudo',ja=40,qo=e=>(e??"").replace(/&amp;/g,"&"),Ba=(e,o)=>Number(e.id)-Number(o.id),vt=e=>e.doc.querySelector(Ua)?.textContent??"";function ht(e,o){let t=()=>{if(!o.nome.trim()||o.nome.length>50)throw new w("ARGUMENTO_INVALIDO","O nome do texto padr\xE3o deve ter de 1 a 50 caracteres.");if(o.descricao.length>300)throw new w("ARGUMENTO_INVALIDO","A descri\xE7\xE3o do texto padr\xE3o passa de 300 caracteres.")},r=m=>[...m.doc.querySelectorAll("table.infraTable tr")].filter(f=>[...f.querySelectorAll("td")].some(h=>(h.textContent??"").trim()===o.nome)),a=m=>{let f=m.querySelector('input[type="checkbox"]')?.getAttribute("value")??/acaoExcluir\(\s*['"](\d+)/.exec(m.querySelector('a[onclick*="acaoExcluir"]')?.getAttribute("onclick")??"")?.[1],h=qo(m.querySelector('a[href*="acao=texto_padrao_interno_consultar"]')?.getAttribute("href")),b=qo(m.querySelector('a[href*="acao=texto_padrao_interno_alterar"]')?.getAttribute("href"));return!f||!h?null:b?{id:f,consultar:h,alterar:b}:{id:f,consultar:h}},n=async m=>{t();let f=await e.http.obter(e.linkMenu("texto_padrao_interno_listar"),m),h=f;for(let b=0;b<ja;b++){let P=r(h),E=P.map(a).filter(q=>q!==null).sort(Ba);if(E.length)return{pagina:h,primeira:f,achado:E[0]??null,todos:E};if(P.length)throw new w("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o "${o.nome}" est\xE1 na lista, mas o SEI n\xE3o oferece a voc\xEA consult\xE1-lo nesta unidade.`);if(!/infraAcaoPaginar\(\s*['"]\+['"]/.test(h.html))break;h=await H.de(h,gt,e.http).definir({hdnInfraPaginaAtual:String(b+1)}).enviar(m)}return{pagina:h,primeira:f,achado:null,todos:[]}},i=async(m,f)=>vt(await e.http.obter(m.consultar,f)),s=m=>({...m,modos:{txaConteudo:"html"},sucesso:ct("texto_padrao_interno_listar")}),c=async(m,f)=>{if(!m.alterar)throw new w("SEI_ACAO_INDISPONIVEL","O SEI n\xE3o permite a voc\xEA alterar este texto padr\xE3o nesta unidade.");return H.abrir(e.http,m.alterar,ft,f)},l=async(m,f,h)=>{await m.definir({txaConteudo:f}).enviar({...s(h),botao:"sbmAlterarTextoPadraoInterno",operacao:"a altera\xE7\xE3o do texto padr\xE3o"})},d=async(m,f,h)=>{let b=qo(/location\.href\s*=\s*'([^']+)'/.exec(m.doc.querySelector("#btnNovo")?.getAttribute("onclick")??"")?.[1]);if(!b)throw new w("SEI_ACAO_INDISPONIVEL","O SEI n\xE3o permite a voc\xEA criar textos padr\xE3o nesta unidade.");await(await H.abrir(e.http,b,ft,h)).definir({txtNome:o.nome,txtDescricao:o.descricao,txaConteudo:f}).enviar({...s(h),botao:"sbmCadastrarTextoPadraoInterno",operacao:"o cadastro do texto padr\xE3o"})},p=async(m,f,h)=>{let b=qo(/['"](controlador\.php\?acao=texto_padrao_interno_excluir[^'"]+)['"]/.exec(m.html)?.[1]);if(!b)throw new w("SEI_ACAO_INDISPONIVEL","O SEI n\xE3o oferece a exclus\xE3o de textos padr\xE3o para voc\xEA nesta unidade.");let P=H.de(m,gt,e.http).definir({hdnInfraItemId:f});await e.http.enviar(b,P.pares(),{...h,aceitarValidacao:!0})},u=async(m,f,h)=>{let{todos:b,pagina:P}=await n(h),[E,...q]=b;if(!E||!q.length)return{gravado:!0};let B=await i(E,h);if(f.mesmo(B,m))return{gravado:!0};for(let F of q)if(f.mesmo(await i(F,h),m))try{await p(P,F.id,h)}catch(L){if(!(Ke(L)&&L.codigo==="SEI_ACAO_INDISPONIVEL"))throw L}return{gravado:!1,atual:B}};return{async localizar(m){return(await n(m)).achado},async ler(m){let{achado:f}=await n(m);return f?i(f,m):null},async gravar(m,f){let{achado:h,primeira:b}=await n(f);h?await l(await c(h,f),m,f):await d(b,m,f)},async gravarConferindo(m,f,h){let{achado:b,primeira:P}=await n(h);if(b){let E=await c(b,h),q=vt(E.pagina);return f.mesmo(q,f.anterior)?(await l(E,m,h),{gravado:!0}):{gravado:!1,atual:q}}return f.anterior!==null?{gravado:!1,atual:null}:(await d(P,m,h),u(m,f,h))},async excluir(m){let{achado:f,pagina:h}=await n(m);return f?(await p(h,f.id,m),!0):!1}}}var Ga={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function ne(e,o="texto"){let t="";for(let r of e){let a=r.codePointAt(0);if(a<=255){t+=r;continue}let n=Ga[r];if(o==="html"){t+=n===""?"":`&#${a};`;continue}if(n!==void 0){t+=n;continue}let i=r.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");t+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return t}var Xa=/[A-Za-z0-9\-_.*]/;function bt(e){let o="";for(let t of e)t===" "?o+="+":Xa.test(t)?o+=t:o+="%"+t.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return o}function xt(e,o={}){return e.map(([t,r])=>{let a=o[t]??"texto";return`${bt(ne(t))}=${bt(ne(r??"",a))}`}).join("&")}function yt(e){let o=t=>encodeURIComponent(ne(t)).replace(/%20/g,"+");return e.map(([t,r])=>`${o(t)}=${o(r??"")}`).join("&")}var At="application/x-www-form-urlencoded";function ie(e){let o=e instanceof Uint8Array?e:new Uint8Array(e),t=[],r=16384;for(let a=0;a<o.length;a+=r){let n=o.subarray(a,a+r),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=We[n[s]]??n[s];t.push(String.fromCharCode(...i))}return t.join("")}var Et="application/x-www-form-urlencoded; charset=ISO-8859-1";function wt(e,o,t){let r=null;return{url:e,status:o,html:t,get doc(){return r??=Oo(t)}}}function Pt(e,o={}){if(/\/login\.php/i.test(e.url)||/[?&]acao=(?:infra_)?sair\b/.test(e.url))throw new w("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(e.status>=500)throw new w("SEI_EXCECAO",`O SEI respondeu com erro ${e.status}.`);if(e.html.includes('id="divInfraExcecao"')){let t=e.doc.querySelector("#divInfraExcecao");if(t){let r=T(t);throw new w("SEI_EXCECAO",r||"O SEI exibiu uma p\xE1gina de erro.",r)}}if(!o.aceitarValidacao&&e.html.includes("txaInfraValidacao")){let t=e.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(t)throw new w("SEI_VALIDACAO",t,t)}return e}function Ro(e,o={}){let t=new URL(".",e),r=o.fetch??((...p)=>fetch(...p)),a=Math.max(1,o.concorrencia??3),n=0,i=[];async function s(p){n>=a&&await new Promise(u=>i.push(u)),n+=1;try{return await p()}finally{n-=1,i.shift()?.()}}let c=p=>new URL(p.replace(/&amp;/g,"&"),t).href;async function l(p,u,m){return s(async()=>{try{let f=await r(c(p),{credentials:"same-origin",redirect:"follow",...u,signal:m.sinal}),h=ie(await f.arrayBuffer());return Pt(wt(f.url||c(p),f.status,h),m)}catch(f){throw xo(f)}})}async function d(p,u={}){return s(async()=>{try{let m=await r(c(p),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),f=new Uint8Array(await m.arrayBuffer()),h=(m.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();h==="text/html"&&Pt(wt(m.url||c(p),m.status,ie(f)),u);let b=m.headers?.get("content-disposition")??"",P=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(b)?.[1]??/filename="?([^";]+)"?/i.exec(b)?.[1]??"");return{bytes:f,tipo:h,nome:P}}catch(m){throw xo(m)}})}return{base:t,absoluta:c,baixar:d,obter:(p,u={})=>l(p,{method:"GET"},u),enviar:(p,u,m={})=>l(p,m.utf8?{method:"POST",headers:{"Content-Type":At},body:yt(u)}:{method:"POST",headers:{"Content-Type":Et},body:xt(u,m.modos)},m)}}function Ja(e){let o=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(e);return o?o[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(e)?.[1]??""}function Ka(e){let o=e.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",t=/infra_unidade_atual=(\d+)/.exec(o)?.[1];if(t)return t;let r=/[?&]infra_unidade_atual=(\d+)/.exec(e.url)?.[1];return r||(e.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function se(e){let o=e.doc,t=o.querySelector("#lnkInfraUnidade"),r=o.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(r)??[],s=Ja(e.html);return{host:new URL(e.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:Ka(e),sigla:T(t)||T(o.querySelector("#selInfraUnidades option[selected]")),nome:t?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var Wa=3e4,so=class{constructor(o,t=null,r){this.paginaViva=t;this.http=Ro(o,r)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let o=this.paginaViva?.();if(o&&o.html.includes("frmProtocoloPesquisaRapida"))return o;if(this.paginaBase)return this.paginaBase;if(o)return o;throw new w("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return se(this.base())}linkMenu(o){return Ye(this.base(),o)}async renovarBase(o){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),o),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(o,t){let r=o.trim();if(!r)throw new w("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(r);if(a)return a;let n=H.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:r});let i=await n.enviar(t),s=N(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new w("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${r}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new w("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=N(Y(c)).get("id_procedimento")??"",p=s.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:p&&p!==d?p:void 0,linkArvore:Y(c)};return this.localizados.set(r,u),u}async arvore(o,t={}){let r=await this.localizar(o,t),a=this.arvores.get(r.idProcedimento);if(a&&!t.forcar&&Date.now()-a.quando<Wa)return a.arvore;let n=await tt(this.http,r.linkArvore,t);return this.arvores.set(r.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(o){o?this.arvores.delete(o):this.arvores.clear()}esquecer(o){this.localizados.delete(o.trim())}async ajax(o,t,r){let a=await this.http.enviar(o,t,{...r,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:Y(i[1]),texto:Y(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=Oo(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function St(e){let o=e.getItem("configDataFavoritesPro");if(!o)return null;try{return JSON.parse(o)}catch{return null}}function ce(e=2e3){let o=window.webkitRequestFileSystem;return o?new Promise(t=>{let r=setTimeout(()=>t(null),e),a=()=>{clearTimeout(r),t(null)};try{o(1,0,n=>n.root.getFile("configPro.json",{},i=>i.file(async s=>{try{let c=JSON.parse(await s.text());clearTimeout(r),t(c)}catch{a()}},a),a),a)}catch{a()}}):Promise.resolve(null)}var Tt="seipro-favoritos",Q="favoritos/preferencias";var Ct="seipro-favoritos-lateral",Dt="favoritos/lateralAberto";function po(e){let o=e.login.trim().toLowerCase();return`${e.host}|${o}|${e.lista==="pessoal"?"pessoal":`u:${e.unidade?.id??""}`}`}function Mt(e){let o={host:e.host,login:e.login.trim().toLowerCase()};return{unidade:e.unidade?.id?{...o,lista:"unidade",unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}:null,pessoal:{...o,lista:"pessoal"}}}function kt(e){return[e.host,e.login.trim().toLowerCase(),e.unidade?.id??""].join("|")}function It(e){let o=e;return!!(o.side_panel||o.sidebar_action)}function le(e,o){return o?{abaixo:e!=="lateral",lateral:e!=="abaixo"}:{abaixo:!0,lateral:!1}}function ue(e,o,t,r){let a=`${e}|${o.trim().toLowerCase()}|${t}`;return r?`${a}|${r}`:a}function Ot(e,o){return e?.[o]??"nao-perguntado"}var Lt={exibir:"abaixo",perguntarAoFavoritar:!0,textoPadrao:"nao-perguntado",textoPadraoUnidades:{},recolhido:!1,agruparPorPasta:!1,ordem:"manual",faixaUnidadeDispensada:!1};async function oo(e){let o=(await e.obter(Q))[Q];return{...Lt,...o&&typeof o=="object"?o:{}}}async function de(e,o){let t={...await oo(e),...o};return await e.gravar({[Q]:t}),t}function Nt(e,o,t,r){return Ot(e.textoPadraoUnidades,ue(o,t,r))}async function qt(e,o,t,r,a){let n=await oo(e);return de(e,{textoPadraoUnidades:{...n.textoPadraoUnidades??{},[ue(o,t,r)]:a}})}async function zo(e,o){if(e.chaves){let r=(await e.chaves()).filter(a=>a.startsWith(o));return r.length?e.obter(r):{}}let t=await e.obter(null);return Object.fromEntries(Object.entries(t).filter(([r])=>r.startsWith(o)))}var eo=class{constructor(o,t){this.area=o;this.prefixo=t}chave(o){return this.prefixo+o}async listar(){return Object.values(await zo(this.area,this.prefixo))}async obter(o){let t=this.chave(o);return(await this.area.obter(t))[t]}async gravar(o,t){await this.area.gravar({[this.chave(o)]:t})}async gravarVarios(o){o.length&&await this.area.gravar(Object.fromEntries(o.map(([t,r])=>[this.chave(t),r])))}async apagar(o){o.length&&await this.area.remover(o.map(t=>this.chave(t)))}aoMudar(o){return this.area.aoMudar(t=>{Object.keys(t).some(r=>r.startsWith(this.prefixo))&&o()})}};var Za="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",Rt=new Map;function Ya(e){let o=Rt.get(e);if(o===void 0){o=new Uint8Array(256);for(let t=0;t<e.length;t++)o[e.charCodeAt(t)]=t;Rt.set(e,o)}return o}function mo(e,o,t,r){let a=t[0];if(o!=null&&e>=o)throw new Error(e+" >= "+o);if(e.slice(-1)===a||o&&o.slice(-1)===a)throw new Error("trailing zero");if(o){let s=0;for(;(e[s]||a)===o[s];)s++;if(s>0)return o.slice(0,s)+mo(e.slice(s),o.slice(s),t,r)}let n=e?r[e.charCodeAt(0)]:0,i=o!=null?r[o.charCodeAt(0)]:t.length;if(i-n>1){let s=Math.round(.5*(n+i));return t[s]}else return o&&o.length>1?o.slice(0,1):t[n]+mo(e.slice(1),null,t,r)}function Vt(e,o){if(e.length!==fo(e[0],o))throw new Error("invalid integer part of order key: "+e)}function fo(e,o){if(o===void 0){let t=e.charCodeAt(0);if(t>=97&&t<=122)return t-97+2;if(t>=65&&t<=90)return 90-t+2}else{let t=o.indexOf(e);if(t!==-1){let r=o.length/2;return t<r?r-t+1:t-r+2}}throw new Error("invalid order key head: "+e)}function yo(e,o){let t=fo(e[0],o);if(t>e.length)throw new Error("invalid order key: "+e);return e.slice(0,t)}function zt(e,o,t){if(Ut(e,o,t))throw new Error("invalid order key: "+e);let r=yo(e,t);if(e.slice(r.length).slice(-1)===o[0])throw new Error("invalid order key: "+e)}function Ft(e,o,t,r){Vt(e,r);let a=e[0],n=o[0],i="";for(let d=e.length-1;d>=1;d--){let p=t[e.charCodeAt(d)]+1;if(p===o.length)i=n+i;else return a+e.slice(1,d)+o[p]+i}if(r===void 0){if(a==="Z")return"a"+n;if(a==="z")return null;let d=String.fromCharCode(a.charCodeAt(0)+1);return d+(d>"a"?i+n:i.slice(1))}let s=r.indexOf(a);if(s===r.length-1)return null;let c=r[s+1],l=fo(c,r)-fo(a,r);return c+(l>0?i+n:l<0?i.slice(1):i)}function Qa(e,o,t,r){Vt(e,r);let a=e[0],n=o[o.length-1],i="";for(let d=e.length-1;d>=1;d--){let p=t[e.charCodeAt(d)]-1;if(p===-1)i=n+i;else return a+e.slice(1,d)+o[p]+i}if(r===void 0){if(a==="a")return"Z"+n;if(a==="A")return null;let d=String.fromCharCode(a.charCodeAt(0)-1);return d+(d<"Z"?i+n:i.slice(1))}let s=r.indexOf(a);if(s===0)return null;let c=r[s-1],l=fo(c,r)-fo(a,r);return c+(l>0?i+n:l<0?i.slice(1):i)}var _t=new Map;function Ut(e,o,t=""){let r=_t.get(t);r===void 0&&(r=new Map,_t.set(t,r));let a=o.charCodeAt(0),n=r.get(a);return n===void 0&&(n=t===""?"A"+o[0].repeat(26):t[0]+o[0].repeat(t.length/2),r.set(a,n)),e===n}function jt(e){for(let o=1;o<e.length;o++)if(e.charCodeAt(o-1)>=e.charCodeAt(o))return!1;return!0}function Bt(e){for(let o=0;o<e.length;o++)if(e.charCodeAt(o)>255)return!1;return!0}var Ht=new Set;function on(e){if(!Ht.has(e)){if(e.length<2||!jt(e))throw new Error("digits must be at least 2 characters in strictly ascending character code order: "+e);if(!Bt(e))throw new Error("digits must be single-byte (char code 0-255): "+e);Ht.add(e)}}var $t=new Set;function en(e){if(!$t.has(e)){if(e.length<2||e.length%2!==0||!jt(e))throw new Error("intDigits must be an even number of at least 2 characters in strictly ascending character code order: "+e);if(!Bt(e))throw new Error("intDigits must be single-byte (char code 0-255): "+e);$t.add(e)}}function pe(e,o,t=Za,r=void 0){on(t),r!==void 0&&en(r);let a=Ya(t);if(e!=null&&zt(e,t,r),o!=null&&zt(o,t,r),e!=null&&o!=null&&e>o){let d=e;e=o,o=d}if(e==null){if(o==null)return(r===void 0?"a":r[r.length/2])+t[0];let d=yo(o,r),p=o.slice(d.length);if(Ut(d,t,r))return d+mo("",p,t,a);if(d<o)return d;let u=Qa(d,t,a,r);if(u==null)throw new Error("cannot decrement any more");return u}if(o==null){let d=yo(e,r),p=e.slice(d.length),u=Ft(d,t,a,r);return u??d+mo(p,null,t,a)}let n=yo(e,r),i=e.slice(n.length),s=yo(o,r),c=o.slice(s.length);if(n===s)return n+mo(i,c,t,a);let l=Ft(n,t,a,r);if(l==null)throw new Error("cannot increment any more");return l<o?l:n+mo(i,null,t,a)}function Ao(e,o){return pe(e??null,o??null)}function Eo(e){try{return pe(e,null),!0}catch{return!1}}function Gt(e,o){return e.atualizadoEm!==o.atualizadoEm?e.atualizadoEm>o.atualizadoEm:e.dispositivo!==o.dispositivo?e.dispositivo>o.dispositivo:JSON.stringify(e)>JSON.stringify(o)}function Xt(e,o,t=90){let r=o-t*864e5;return e.filter(a=>a.removidoEm===void 0||a.removidoEm>=r)}function M(e){return e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function co(e){let o=2166136261;for(let t of e)o^=t.codePointAt(0)??0,o=Math.imul(o,16777619)>>>0;return o.toString(16).padStart(8,"0")}var Jt=["#bfd5e8","#c8e6c9","#ffe0b2","#f8bbd0","#d1c4e9","#b2ebf2","#fff9c4","#d7ccc8"];function Fo(e){let o=Number.parseInt(co(M(e)).slice(0,6),16)%Jt.length;return Jt[o]??"#bfd5e8"}function Kt(e,o){if(!o||!e)return[];let t=[];if(o.qtdDocumentos!==void 0&&e.qtdDocumentos!==void 0&&o.qtdDocumentos>e.qtdDocumentos){let n=o.qtdDocumentos-e.qtdDocumentos;t.push({tipo:"documentos",texto:n===1?"1 documento novo":`${n} documentos novos`})}let r=o.ultimoAndamento,a=e.ultimoAndamento;return r&&a&&(r.data!==a.data||r.descricao!==a.descricao)&&t.push({tipo:"andamento",texto:`andamento: ${r.descricao}${r.unidade?` (${r.unidade})`:""}`}),e.abertoNaUnidade===!0&&o.abertoNaUnidade===!1&&t.push({tipo:"saiu",texto:"saiu da sua unidade"}),e.abertoNaUnidade===!1&&o.abertoNaUnidade===!0&&t.push({tipo:"voltou",texto:"voltou para a sua unidade"}),o.naoVisualizado&&!e.naoVisualizado&&t.push({tipo:"naoVisualizado",texto:"n\xE3o visualizado"}),o.documentoNovo&&!e.documentoNovo&&t.push({tipo:"documentoNovo",texto:"documento novo"}),o.concluido&&!e.concluido&&t.push({tipo:"concluido",texto:"conclu\xEDdo"}),o.recebidoNaLeitura&&t.push({tipo:"recebido",texto:"chegou \xE0 sua unidade \u2014 o SEI registrou o recebimento"}),t}function Wt(e,o){if(!e||!o)return e===o;let t=r=>JSON.stringify([r.abertoNaUnidade,r.naoVisualizado,r.documentoNovo,r.atribuido,r.marcadores??[],r.concluido,r.qtdDocumentos,r.ultimoAndamento??null]);return t(e)===t(o)}function me(e,o){return!!e.lembrete&&e.lembrete.em<=o}function Zt(e){for(let o of Object.keys(e))e[o]===void 0&&delete e[o];return e}function Yt(e,o,t){return Zt({id:e.id,protocolo:e.protocolo,tipo:e.tipo||void 0,especificacao:e.sigiloso?void 0:e.especificacao||void 0,sigiloso:e.sigiloso?!0:void 0,sigiloAConfirmar:e.sigiloAConfirmar&&e.sigiloso===void 0?!0:void 0,etiquetas:[],ordem:o,criadoEm:t.agora,atualizadoEm:t.agora,dispositivo:t.dispositivo})}function K(e,o,t){return Zt({...e,...o,atualizadoEm:t.agora,dispositivo:t.dispositivo})}function _o(e,o){return K(e,{removidoEm:o.agora},o)}function Qt(e,o){return K(e,{removidoEm:void 0},o)}var or=e=>e.reduce((o,t)=>Eo(t.ordem)&&(o===null||t.ordem>o)?t.ordem:o,null),fe=(e,o)=>e.nome.localeCompare(o.nome,"pt-BR"),go=class{constructor(o,t,r){this.area=o;this.escopo=t;this.carimbo=r;let a=`favoritos/${po(t)}/`;this.favoritos=new eo(o,`${a}f/`),this.pastas=new eo(o,`${a}p/`),this.etiquetas=new eo(o,`${a}e/`),this.atuaisCol=new eo(o,`${a}a/`),this.vistosCol=new eo(o,`${a}v/`),this.chaveMeta=`${a}meta`,this.base=a}favoritos;pastas;etiquetas;atuaisCol;vistosCol;chaveMeta;base;async registrar(){await this.area.gravar({[this.chaveMeta]:{escopo:this.escopo}})}async instantaneo(){let o=Object.entries(await zo(this.area,this.base)),t=r=>o.filter(([a])=>a.startsWith(this.base+r)).map(([,a])=>a);return{todos:t("f/"),pastas:t("p/").filter(r=>r.removidoEm===void 0).sort(er),etiquetas:t("e/").filter(r=>r.removidoEm===void 0).sort(fe)}}async gravarAtual(o,t){await this.atuaisCol.gravar(o,{...t,id:o})}async gravarAtuais(o){await this.atuaisCol.gravarVarios(o.map(([t,r])=>[t,{...r,id:t}]))}async atuais(){return new Map((await this.atuaisCol.listar()).map(({id:o,...t})=>[o,t]))}async vistosCompletos(){return this.vistosCol.listar()}async vistos(){return new Map((await this.vistosCol.listar()).filter(o=>o.removidoEm===void 0).map(o=>[o.id,o.visto]))}async gravarVisto(o,t){let r=await this.vistosCol.obter(o);if(r&&r.removidoEm===void 0&&Wt(r.visto,t))return!1;let a=this.carimbo(),n={...t};return delete n.recebidoNaLeitura,await this.vistosCol.gravar(o,{id:o,visto:n,atualizadoEm:a.agora,dispositivo:a.dispositivo}),!0}async marcarVisto(o){let t=await this.atuais(),r=0;for(let a of o){let n=t.get(a),i=await this.obter(a);!n||!i||i.removidoEm!==void 0||(await this.gravarVisto(a,n),r++)}return r}async instantaneoCompleto(){let o=Object.entries(await zo(this.area,this.base)),t=r=>o.filter(([a])=>a.startsWith(this.base+r)).map(([,a])=>a);return{todos:t("f/"),pastas:t("p/"),etiquetas:t("e/"),vistos:t("v/")}}todos(){return this.favoritos.listar()}async ativos(){return(await this.todos()).filter(o=>o.removidoEm===void 0)}obter(o){return this.favoritos.obter(o)}async contem(o){let t=await this.obter(o);return!!t&&t.removidoEm===void 0}async proximaOrdem(){return Ao(or(await this.todos()),null)}async adicionar(o){let t=this.carimbo(),r=await this.obter(o.id),a;if(!r)a=Yt(o,await this.proximaOrdem(),t);else{let n=o.sigiloso===void 0?r.sigiloso:o.sigiloso?!0:void 0,i={sigiloAConfirmar:o.sigiloso!==void 0?void 0:r.sigiloAConfirmar,protocolo:o.protocolo||r.protocolo,tipo:o.tipo||r.tipo,sigiloso:n,especificacao:n?void 0:o.especificacao||r.especificacao};r.removidoEm!==void 0&&Object.assign(i,{removidoEm:void 0,ordem:await this.proximaOrdem()}),a=K(r,i,t)}return await this.favoritos.gravar(a.id,a),a}async editar(o,t){let r=await this.obter(o);if(!r)throw new Error(`O monitorado ${o} n\xE3o existe nesta lista.`);let a={...t};a.etiquetas&&(a.etiquetas=[...new Set(a.etiquetas)].slice(0,8)),typeof a.nota=="string"&&(a.nota=a.nota.slice(0,2e3).trim()?a.nota.slice(0,2e3):void 0),typeof a.titulo=="string"&&(a.titulo=a.titulo.trim()||void 0);let n=K(r,a,this.carimbo());return await this.favoritos.gravar(o,n),n}async remover(o){let t=this.carimbo(),r=(await Promise.all(o.map(a=>this.obter(a)))).filter(a=>!!a&&a.removidoEm===void 0);return await this.favoritos.gravarVarios(r.map(a=>[a.id,_o(a,t)])),r.length}async restaurar(o){let t=this.carimbo(),r=(await Promise.all(o.map(a=>this.obter(a)))).filter(a=>!!a&&a.removidoEm!==void 0);return await this.favoritos.gravarVarios(r.map(a=>[a.id,Qt(a,t)])),r.length}async mover(o,t,r){let a=t?await this.obter(t):void 0,n=r?await this.obter(r):void 0,i;try{i=Ao(a?.ordem??null,n?.ordem??null)}catch{i=Ao(a?.ordem??null,null)}await this.editar(o,{ordem:i})}async pastasAtivas(){return(await this.pastas.listar()).filter(o=>o.removidoEm===void 0).sort((o,t)=>er(o,t))}async criarPasta(o,t){let r=o.trim();if(!r)throw new Error("Informe o nome da pasta.");let a=await this.pastas.listar(),n=a.find(c=>c.removidoEm===void 0&&M(c.nome)===M(r));if(n)return n;let i=this.carimbo(),s={id:vo(),nome:r,ordem:Ao(or(a),null),atualizadoEm:i.agora,dispositivo:i.dispositivo};return t&&(s.cor=t),await this.pastas.gravar(s.id,s),s}async editarPasta(o,t){let r=await this.pastas.obter(o);r&&await this.pastas.gravar(o,K(r,t,this.carimbo()))}async removerPasta(o){let t=await this.pastas.obter(o);if(!t)return;let r=this.carimbo();await this.pastas.gravar(o,_o(t,r));let a=(await this.todos()).filter(n=>n.pasta===o);await this.favoritos.gravarVarios(a.map(n=>[n.id,K(n,{pasta:void 0},r)]))}async etiquetasAtivas(){return(await this.etiquetas.listar()).filter(o=>o.removidoEm===void 0).sort(fe)}async criarEtiqueta(o,t){let r=o.trim();if(!r)throw new Error("Informe o nome da etiqueta.");let a=(await this.etiquetas.listar()).find(s=>s.removidoEm===void 0&&M(s.nome)===M(r));if(a)return a;let n=this.carimbo(),i={id:vo(),nome:r,cor:t??Fo(r),atualizadoEm:n.agora,dispositivo:n.dispositivo};return await this.etiquetas.gravar(i.id,i),i}async editarEtiqueta(o,t){let r=await this.etiquetas.obter(o);r&&await this.etiquetas.gravar(o,K(r,t,this.carimbo()))}async removerEtiqueta(o){let t=await this.etiquetas.obter(o);if(!t)return;let r=this.carimbo();await this.etiquetas.gravar(o,_o(t,r));let a=(await this.todos()).filter(n=>n.etiquetas.includes(o));await this.favoritos.gravarVarios(a.map(n=>[n.id,K(n,{etiquetas:n.etiquetas.filter(i=>i!==o)},r)]))}async importar(o){let t=await this.mesclarEm(this.favoritos,o.favoritos??[],an);return await this.mesclarEm(this.pastas,o.pastas??[]),await this.mesclarEm(this.etiquetas,o.etiquetas??[]),await this.mesclarEm(this.vistosCol,o.vistos??[]),t}async mesclarEm(o,t,r=a=>a){let a=new Map((await o.listar()).map(c=>[c.id,c])),n=[],i=0,s=0;for(let c of t){let l=a.get(c.id);l?Gt(c,l)&&(s+=1,n.push([c.id,r(c,l)])):(i+=1,n.push([c.id,r(c,void 0)]))}return await o.gravarVarios(n),{novos:i,atualizados:s}}async limpar(o=Date.now()){for(let t of[this.favoritos,this.pastas,this.etiquetas]){let r=await t.listar(),a=new Set(Xt(r,o,90).map(n=>n.id));await t.apagar(r.filter(n=>!a.has(n.id)).map(n=>n.id))}}aoMudarAtuais(o){return this.atuaisCol.aoMudar(o)}aoMudar(o){let t=[this.favoritos.aoMudar(o),this.pastas.aoMudar(o),this.etiquetas.aoMudar(o),this.vistosCol.aoMudar(o)];return()=>{for(let r of t)r()}}};function er(e,o){return e.ordem!==o.ordem?e.ordem<o.ordem?-1:1:fe(e,o)}async function tr(e,o,t){let r=await e.obter(t);if(!r||r.removidoEm!==void 0)return null;await o.adicionar({id:r.id,protocolo:r.protocolo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso});let a=await o.editar(t,{titulo:r.titulo,nota:r.nota,prazo:r.prazo,local:r.local,pasta:void 0,etiquetas:[]});return await e.remover([t]),a}function an(e,o){if(!e.resumido||!o?.protocolo)return e;let t={...o,atualizadoEm:e.atualizadoEm,dispositivo:e.dispositivo,removidoEm:e.removidoEm,sigiloso:e.sigiloso??o.sigiloso};return delete t.resumido,t.removidoEm===void 0&&delete t.removidoEm,t.sigiloso?(delete t.especificacao,delete t.sigiloAConfirmar):delete t.sigiloso,t}var wo=class extends Error{constructor(o){super(`O conte\xFAdo descompactado passa de ${Math.round(o/1024/1024)} MB.`),this.name="ErroConteudoGrande"}};async function nn(e,o){let t=new Blob([e]).stream().pipeThrough(o);return new Uint8Array(await new Response(t).arrayBuffer())}function sn(e){let o="";for(let t=0;t<e.length;t+=32768)o+=String.fromCharCode(...e.subarray(t,t+32768));return btoa(o).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function cn(e){if(!/^[A-Za-z0-9_-]*$/.test(e))throw new Error("Conte\xFAdo fora do formato base64url.");let o=e.replace(/-/g,"+").replace(/_/g,"/").padEnd(Math.ceil(e.length/4)*4,"="),t=atob(o),r=new Uint8Array(t.length);for(let a=0;a<t.length;a++)r[a]=t.charCodeAt(a);return r}async function rr(e){let o=new TextEncoder().encode(JSON.stringify(e));return sn(await nn(o,new CompressionStream("gzip")))}async function ln(e,o){let t=new Blob([e]).stream().pipeThrough(new DecompressionStream("gzip")).getReader(),r=[],a=0;for(;;){let{done:s,value:c}=await t.read();if(s)break;if(a+=c.byteLength,a>o)throw await t.cancel().catch(()=>{}),new wo(o);r.push(c)}let n=new Uint8Array(a),i=0;for(let s of r)n.set(s,i),i+=s.byteLength;return n}async function ar(e,o=8388608){let t=await ln(cn(e),o);return JSON.parse(new TextDecoder().decode(t))}var un=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");function nr(e,o,t=2e3){let r=[`<p>${un(e)}</p>`];for(let a=0;a<o.length;a+=t)r.push(`<p>${o.slice(a,a+t)}</p>`);return r.join(`
`)}function dn(e){let o=e;for(let t=0;t<2&&/&lt;\s*\/?p[\s>&]/i.test(o);t++)o=o.replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&amp;/g,"&");return o}function Po(e){let t=[...dn(e).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map(r=>(r[1]??"").trim()).slice(1);return!t.length||!t.every(r=>/^[A-Za-z0-9_-]+$/.test(r))?null:t.join("")}var $o="[_SEIPRO_",ir=50;function sr(e,o){let t=`${$o}${e}_`,r=`${t}${o}]`;if(r.length<=ir)return r;let a=ir-t.length-1-8-1;return`${t}${o.slice(0,a)}~${co(o).slice(0,8)}]`}async function ge(e,o){return nr(e,await rr(o))}async function ve(e,o=8388608){let t=Po(e);if(!t)return{invalido:"o texto n\xE3o tem os dados do SEI Pro (foi editado ou est\xE1 vazio)"};try{return{bruto:await ar(t,o)}}catch(r){return r instanceof wo?{invalido:"os dados do texto descompactados passam do limite"}:{invalido:"os dados do texto est\xE3o corrompidos"}}}function cr(e,o,t){let r=e;return r?.formato===o&&typeof r.versao=="number"&&r.versao>t}var I=e=>e&&typeof e=="object"&&!Array.isArray(e)?e:null,D=e=>typeof e=="string",j=e=>typeof e=="number"&&Number.isFinite(e),he=/^\d{4}-\d{2}-\d{2}$/;var Vo=e=>D(e.id)&&e.id!==""&&j(e.atualizadoEm)&&D(e.dispositivo)&&(e.removidoEm===void 0||j(e.removidoEm));function mn(e){let o=I(e),t=I(o?.referencia);if(!o||!t||!["ate","desde","desdeUteis"].includes(String(o.exibicao)))return!1;let r=t.de==="novoDocumento"?[t.desde]:t.de==="data"||t.de==="documento"?[t.data]:[];if(!r.length||!r.every(n=>D(n)&&he.test(n))||t.de==="novoDocumento"&&!(Array.isArray(t.tipos)&&t.tipos.length&&t.tipos.every(D)))return!1;let a=I(o.vencimento);return o.vencimento===void 0||a?.em==="data"&&D(a.data)&&he.test(a.data)||a?.em==="dias"&&j(a.n)&&Math.abs(a.n)<=3650&&(a.contagem==="corridos"||a.contagem==="uteis")}function fn(e){let o=I(e);if(!o||!Vo(o)||!D(o.protocolo)||!D(o.ordem)||!j(o.criadoEm)||!Array.isArray(o.etiquetas))return null;let t={...o,etiquetas:o.etiquetas.filter(D)};t.prazo!==void 0&&!mn(t.prazo)&&delete t.prazo;for(let n of["titulo","tipo","especificacao","pasta","nota"])t[n]!==void 0&&!D(t[n])&&delete t[n];Eo(t.ordem)||(t.ordem="a0"),t.fixado!==!0&&delete t.fixado,t.sigiloso!==!0?delete t.sigiloso:delete t.especificacao;let r=I(t.lembrete);if(t.lembrete!==void 0&&(r&&D(r.em)&&he.test(r.em)?t.lembrete=D(r.texto)?{em:r.em,texto:r.texto}:{em:r.em}:delete t.lembrete),t.documentos!==void 0){let n=Array.isArray(t.documentos)?t.documentos.map(I).filter(i=>!!i&&D(i.id)&&D(i.numero)&&D(i.titulo)).map(i=>({id:i.id,numero:i.numero,titulo:i.titulo,criadoEm:j(i.criadoEm)?i.criadoEm:0,...D(i.nota)?{nota:i.nota}:{}})):[];n.length?t.documentos=n:delete t.documentos}t.visto!==void 0&&!(I(t.visto)&&j(I(t.visto).quando))&&delete t.visto;let a=I(t.local);return t.local!==void 0&&!(a&&j(a.lat)&&j(a.lng)&&Math.abs(a.lat)<=90&&Math.abs(a.lng)<=180)&&delete t.local,t.sigiloAConfirmar!==!0&&delete t.sigiloAConfirmar,t.resumido!==!0&&delete t.resumido,t}var lr=/^#[0-9a-f]{3,8}$/i,gn=e=>{let o=I(e);if(!o||!Vo(o)||!D(o.nome)||!D(o.ordem))return null;let t={...o,ordem:Eo(o.ordem)?o.ordem:"a0"};return t.cor!==void 0&&!(D(t.cor)&&lr.test(t.cor))&&delete t.cor,t},vn=e=>{let o=I(e);return!o||!Vo(o)||!D(o.nome)?null:{...o,cor:D(o.cor)&&lr.test(o.cor)?o.cor:Fo(o.nome)}},hn=e=>{let o=I(e);return o&&Vo(o)&&I(o.visto)&&j(I(o.visto).quando)?o:null},bn=e=>{let o=I(e);return!o||!D(o.host)||!D(o.login)?!1:o.lista==="pessoal"||o.lista==="unidade"&&D(I(o.unidade)?.id)&&I(o.unidade)?.id!==""};function ur(e){let o=I(e);if(!o||o.formato!=="seipro-favoritos"||o.versao!==1||!Array.isArray(o.escopos))return null;let t=0,r=(n,i)=>{let s=Array.isArray(n)?n:[],c=s.map(i).filter(l=>l!==null);return t+=s.length-c.length,c},a=[];for(let n of o.escopos){let i=I(n);if(!i||!bn(i.escopo)){t+=1;continue}a.push({escopo:i.escopo,favoritos:r(i.favoritos,fn),pastas:r(i.pastas,gn),etiquetas:r(i.etiquetas,vn),vistos:r(i.vistos,hn)})}return{envelope:{formato:"seipro-favoritos",versao:1,escopos:a,gravadoEm:j(o.gravadoEm)?o.gravadoEm:0,dispositivo:D(o.dispositivo)?o.dispositivo:"",revisao:j(o.revisao)?o.revisao:0},descartados:t}}var pr=100*1024,mr=80*1024;function fr(e){return sr("FAV",e.trim().toLowerCase())}var gr="Dados internos do SEI Pro (monitorados). N\xE3o use em documentos nem edite.";function dr(e,o){return{id:e.id,protocolo:"",etiquetas:[],ordem:"a0",criadoEm:e.criadoEm,atualizadoEm:e.atualizadoEm,dispositivo:e.dispositivo,resumido:!0,...o}}async function vr(e,o,t,r=new Set){let{todos:a,pastas:n,etiquetas:i,vistos:s}=await e.instantaneoCompleto(),c=[];for(let l of a)if(!(l.sigiloAConfirmar&&!l.removidoEm)){if(l.sigiloso){r.has(l.id)&&c.push(dr(l,{sigiloso:!0,...l.removidoEm!==void 0?{removidoEm:l.removidoEm}:{}}));continue}c.push(l.removidoEm!==void 0||l.resumido?dr(l,l.removidoEm!==void 0?{removidoEm:l.removidoEm}:{}):l)}return{formato:"seipro-favoritos",versao:1,escopos:[{escopo:o,favoritos:c,pastas:n,etiquetas:i,vistos:s.filter(l=>c.some(d=>d.id===l.id&&!d.resumido&&!d.removidoEm))}],gravadoEm:t.agora,dispositivo:t.dispositivo,revisao:0}}function hr(e){return`Dados internos do SEI Pro \u2014 monitorados de ${e}. N\xE3o use em documentos nem edite: o SEI Pro regrava este texto sozinho.`}var xn=(e,o)=>e.host===o.host&&e.login.toLowerCase()===o.login.toLowerCase()&&e.lista===o.lista&&(e.unidade?.id??"")===(o.unidade?.id??"");function br(e,o){if(cr(e,"seipro-favoritos",1))return{maisNovo:!0};let t=ur(e);if(!t)return{invalido:"o texto n\xE3o est\xE1 no formato dos monitorados"};let r=t.envelope.escopos;return r.length!==1||!xn(r[0].escopo,o)?{invalido:"o texto \xE9 de outro usu\xE1rio ou de outra unidade"}:{ok:t.envelope}}async function yn(e,o){let t=await e.listarCaixa(o),r=new Map;for(let c of e.repos)for(let l of await c.ativos()){if(l.sigiloso||l.sigiloAConfirmar||l.resumido||t.has(l.id))continue;let d=r.get(l.id)??{protocolo:l.protocolo,repos:[]};d.repos.push(c),r.set(l.id,d)}let a=r.size,n=0,i=0,s=0;await e.progresso({feitos:n,total:a});for(let[c,l]of r){if(o.aborted)break;await e.progresso({feitos:n,total:a,atual:l.protocolo});try{let d=await e.localizar(l.protocolo,o);if(d!==c||t.has(d))throw new Error("O n\xFAmero n\xE3o leva a este processo.");let p=await e.lerProcesso(l.protocolo,o);p.abertoNaUnidade&&s++;for(let u of l.repos){let m=(await u.atuais()).get(c),f={...m,quando:Date.now(),fonte:"atualizar",qtdDocumentos:p.qtdDocumentos,ultimoAndamento:p.ultimoAndamento??m?.ultimoAndamento,abertoNaUnidade:p.abertoNaUnidade,recebidoNaLeitura:p.abertoNaUnidade?!0:void 0};await u.gravarAtual(c,f),(await u.vistos()).has(c)||await u.gravarVisto(c,f)}}catch{if(o.aborted)break;i++}n++,n<a&&!o.aborted&&await e.esperar(e.intervalo??3e3,o).catch(()=>{})}return await e.progresso({feitos:n,total:a,fim:!0,cancelado:o.aborted,erros:i,chegaram:s}),{lidos:n,erros:i,chegaram:s}}var xr=(e,o)=>`favoritos/atualizando/${e}|${o.toLowerCase()}`,An=(e,o)=>`favoritos/atualizarCancelar/${e}|${o.toLowerCase()}`;var Uo=class{constructor(o,t,r){this.criarDeps=o;this.gravarProgresso=t;this.ouvir=r}emCurso=null;async iniciar(){if(this.emCurso)throw Object.assign(new Error("J\xE1 h\xE1 uma atualiza\xE7\xE3o em andamento nesta aba."),{codigo:"EM_ANDAMENTO"});let o=new AbortController;this.emCurso=o;let t=this.ouvir?An(this.ouvir.host,this.ouvir.login):"",r=this.ouvir?.area.aoMudar(a=>{t in a&&a[t]?.novo!==void 0&&o.abort()});try{return await yn({...this.criarDeps(),progresso:a=>this.gravarProgresso(a)},o.signal)}finally{r?.(),this.emCurso=null}}cancelar(){return this.emCurso?.abort(),!!this.emCurso}};function yr(e,o){return Ne(e,o,"spro-fav")}var Ar=new Set;var En=null;function wn(e){let o=e.closest?.("dialog[open]");if(o)return o;let t=e.getRootNode?.(),r=e.ownerDocument;return t&&t!==r&&t.host?t:r.body??r.documentElement}function Er(e,o){let t=e;try{t?.CustomEvent&&t.dispatchEvent(new t.CustomEvent("spro-popover",{detail:{fundo:o}}))}catch{}}function wr(e,o,t){let r=e.ownerDocument,a=r.defaultView;wn(e).append(o);let n=!0,i=()=>{if(!n)return;let u=e.getBoundingClientRect?.();if(!u)return;let m=a?.innerHeight??0,f=a?.innerWidth??0,h=Math.min(t.largura??Math.max(u.width,t.larguraMinima??0),Math.max(180,f-16)),b=t.alinharDireita?u.right-h:u.left,P=Math.max(8,Math.min(b,f-h-8)),E=t.alturaMaxima??360;o.style.maxHeight="none";let q=Math.min(o.scrollHeight||E,E),B=m-u.bottom-8,F=u.top-8,L=En?.()??!1,Z=!L&&B<Math.min(q,200)&&F>B;o.style.left=`${P}px`,o.style.width=`${h}px`,o.style.maxHeight=`${L?E:Math.max(140,Math.min(E,Z?F:B>140?B:E))}px`,o.classList.toggle("spro-flutuante-cima",Z),Z?(o.style.top="",o.style.bottom=`${m-u.top+4}px`):(o.style.bottom="",o.style.top=`${u.bottom+4}px`),Er(a,Z?0:Math.ceil(u.bottom+4+q+12))},s=u=>{let m=u.composedPath?.()??[],f=u.target,h=b=>m.includes(b)||!!f&&!!b.contains?.(f);h(o)||h(e)||t.aoFechar()},c=()=>{e.isConnected?i():t.aoFechar()},l=u=>{u.target instanceof Node&&o.contains(u.target)||c()},d=()=>t.aoFechar();r.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let p={ancora:e,fechar:()=>t.aoFechar()};return Ar.add(p),i(),{posicionar:i,fechar(){n&&(n=!1,Ar.delete(p),r.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),o.remove(),Er(a,0))}}}function Pr(e,o){let t=M(o);if(!t)return[...e];let r=t.split(" "),a=[];return e.forEach((n,i)=>{let s=M(n.rotulo),c=M(n.complemento??""),l=`${s} ${c} ${M(n.descricao??"")}`;if(!r.every(p=>l.includes(p)))return;let d=s.startsWith(t)?0:`${s} ${c}`.split(" ").some(p=>p.startsWith(r[0]))?1:2;a.push({o:n,nota:d,i})}),a.sort((n,i)=>n.nota-i.nota||n.i-i.i).map(n=>n.o)}function Sr(e,o){let t=e.normalize("NFC"),r=M(o).split(" ").filter(Boolean);if(!r.length)return[{texto:t,marcado:!1}];let a=[...t],n="",i=[];a.forEach((l,d)=>{let p=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let u of p)n+=u,i.push(d)});let s=new Array(a.length).fill(!1);for(let l of r){let d=n.indexOf(l);if(!(d<0))for(let p=d;p<d+l.length;p++)s[i[p]]=!0}let c=[];return a.forEach((l,d)=>{let p=c[c.length-1];p&&p.marcado===s[d]?p.texto+=l:c.push({texto:l,marcado:s[d]})}),c}var Pn=0;function So(e){let o=`spro-combo-${++Pn}`,t=()=>typeof e.opcoes=="function"?e.opcoes():e.opcoes,r=new Map,a=v=>t().find(x=>x.valor===v)??r.get(v),n=[...e.valor??[]],i=null,s="",c=0,l=[],d=null,p=e.vazio??"Escolher\u2026",u={tipo:"pronto"},m=0,f=g("button",{type:"button",class:`spro-combo${e.classe?` ${e.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":e.rotulo,title:e.rotulo}),h=()=>e.aoMudar?.([...n]);function b(){let v=[];e.icone&&v.push(C(e.icone,15));let x=n.map(S=>a(S)).filter(S=>!!S),y=g("span",{class:"spro-combo-texto"});if(!x.length)y.classList.add("spro-combo-vazio"),y.append(p);else{let S=x[0];S.marca&&y.append(S.marca()),S.cor&&y.append(g("span",{class:"spro-combo-cor",style:`background:${S.cor}`})),y.append(g("span",{class:"spro-combo-rotulo"},S.rotulo)),S.complemento&&y.append(g("span",{class:"spro-combo-compl"},S.complemento)),x.length>1&&y.append(g("span",{class:"spro-combo-mais"},`+${x.length-1}`))}v.push(y,C("chevron",14)),f.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false"),f.classList.toggle("spro-combo-erro",u.tipo==="erro"),f.classList.toggle("spro-combo-ativo",e.multiplo===!0&&x.length>0),f.replaceChildren(...v)}let P=()=>e.busca??(t().length>7||!!e.multiplo||!!e.criar);function E(v){if(e.multiplo){n=n.includes(v.valor)?n.filter(y=>y!==v.valor):[...n,v.valor],h(),b(),L();return}let x=n.length!==1||n[0]!==v.valor;n=[v.valor],b(),lo(!0),x&&h()}async function q(){if(!e.criar)return;let v=s.trim();if(!v)return;let x=await e.criar(v);if(x){if(r.set(x.valor,x),s="",i){let y=i.querySelector(".spro-combo-busca");y&&(y.value="")}e.multiplo&&n.includes(x.valor)?L():E(x)}}function B(v,x){let y=n.includes(v.valor),S=g("span",{class:"spro-combo-op-rotulo"});for(let A of Sr(v.rotulo,s))S.append(A.marcado?g("mark",{},A.texto):A.texto);let _=v.complemento?g("span",{class:"spro-combo-op-compl"}):null;if(_&&v.complemento)for(let A of Sr(v.complemento,s))_.append(A.marcado?g("mark",{},A.texto):A.texto);let z=g("li",{role:"option",id:`${o}-op-${x}`,class:`spro-combo-op${x===c?" spro-combo-op-ativa":""}`,"data-valor":v.valor,"aria-selected":y?"true":"false"},e.multiplo?g("span",{class:"spro-combo-caixa","aria-hidden":"true"},y?C("check",12):null):null,v.marca?v.marca():null,v.cor?g("span",{class:"spro-combo-cor",style:`background:${v.cor}`}):null,v.icone?C(v.icone,15):null,g("span",{class:"spro-combo-op-textos"},_?g("span",{class:"spro-combo-op-linha"},S,_):S,v.descricao?g("span",{class:"spro-combo-op-desc"},v.descricao):null),v.contagem!==void 0?g("span",{class:"spro-combo-conta"},String(v.contagem)):null,!e.multiplo&&y?g("span",{class:"spro-combo-marca"},C("check",14)):null);return z.addEventListener("pointerdown",A=>A.preventDefault()),z.addEventListener("click",()=>{c=x,E(v)}),z.addEventListener("pointermove",()=>{c!==x&&(c=x,F())}),z}function F(){if(!i)return;let v=[...i.querySelectorAll('[role="option"]')];v.forEach((_,z)=>{_.classList.toggle("spro-combo-op-ativa",z===c)});let x=v[c],S=i.querySelector(".spro-combo-busca")??i.querySelector('[role="listbox"]');x?(S?.setAttribute("aria-activedescendant",x.id),x.scrollIntoView?.({block:"nearest"})):S?.removeAttribute("aria-activedescendant")}function L(){if(!i)return;let v=Pr(t(),s);m=v.length,l=e.limite!==void 0&&v.length>e.limite?v.slice(0,e.limite):v,u.tipo!=="pronto"&&(l=[]),c>=l.length&&(c=Math.max(0,l.length-1));let x=i.querySelector('[role="listbox"]');x.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false");let y=i.querySelector(".spro-combo-extras");if(y.replaceChildren(),u.tipo==="carregando")x.replaceChildren(...[62,84,48,74].map(A=>g("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},g("span",{style:`width:${A}%`})))),y.append(g("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(u.tipo==="erro"){x.replaceChildren();let A=u.tentar;if(y.append(g("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},u.mensagem)),A){let $=g("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},C("atualizar",14),g("span",{},"Tentar de novo"));$.addEventListener("pointerdown",ao=>ao.preventDefault()),$.addEventListener("click",A),y.append($)}}else{x.replaceChildren(...l.map(B));let A=s.trim();l.length||y.append(g("p",{class:"spro-combo-nada"},A?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let $=l.length?e.resumo?.(l.length,m,t().length):void 0;$&&y.append(g("p",{class:"spro-combo-resumo",role:"status"},$)),l.length<m&&y.append(g("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${l.length} de ${m}. Digite para refinar.`))}let S=s.trim(),_=t().some(A=>M(A.rotulo)===M(S));if(e.criar&&S&&!_&&u.tipo==="pronto"){let A=g("button",{type:"button",class:"spro-combo-criar"},C("mais",14),g("span",{},e.rotuloCriar?e.rotuloCriar(S):`Criar \u201C${S}\u201D`));A.addEventListener("pointerdown",$=>$.preventDefault()),A.addEventListener("click",()=>void q()),y.append(A)}let z=i.querySelector(".spro-combo-rodape");if(z){let A=l.filter(no=>!n.includes(no.valor)),$=g("button",{type:"button",class:"spro-combo-acao",disabled:!S||!A.length},`Marcar os filtrados${S&&A.length?` (${A.length})`:""}`);$.addEventListener("click",()=>{n=[...n,...A.map(no=>no.valor)],h(),b(),L()});let ao=g("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");ao.addEventListener("click",()=>{n=[],h(),b(),L()}),z.replaceChildren(g("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),$,ao)}F()}let Z=()=>d?.posicionar();function ha(v){let x=l.length,y=v.target,S=i?[...i.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],_=!!y?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(v.key==="Tab"){let A=S.indexOf(y);if(!v.shiftKey&&A<S.length-1)S[A+1]?.focus();else if(v.shiftKey&&A>=0)A>0?S[A-1]?.focus():(i?.querySelector(".spro-combo-busca")??i?.querySelector('[role="listbox"]'))?.focus();else{lo(!0);return}v.preventDefault(),v.stopPropagation();return}if(_&&v.key!=="Escape")return;let z=!i?.querySelector(".spro-combo-busca");if(z&&v.key===" "){let A=l[c];A&&E(A),v.preventDefault(),v.stopPropagation();return}if(z&&v.key.length===1&&!v.ctrlKey&&!v.metaKey&&!v.altKey){let A=M(v.key),ao=[...l.keys()].map(no=>(c+1+no)%Math.max(1,x)).find(no=>M(l[no]?.rotulo??"").startsWith(A));ao!==void 0&&(c=ao,F()),v.preventDefault(),v.stopPropagation();return}switch(v.key){case"ArrowDown":c=x?(c+1)%x:0,F();break;case"ArrowUp":c=x?(c-1+x)%x:0,F();break;case"Home":if(v.target?.classList?.contains("spro-combo-busca")&&s)return;c=0,F();break;case"End":if(v.target?.classList?.contains("spro-combo-busca")&&s)return;c=Math.max(0,x-1),F();break;case"Enter":{let A=l[c];A?E(A):q();break}case"Escape":lo(!0);break;case"Backspace":if(!e.multiplo||s||!n.length)return;n=n.slice(0,-1),h(),b(),L();break;default:return}v.preventDefault(),v.stopPropagation()}function Co(v=""){if(i)return;s=v,c=v?0:(()=>{let _=Pr(t(),s).findIndex(z=>z.valor===n[n.length-1]);return _<0?0:_})();let y=P()?g("input",{type:"text",class:"spro-combo-busca",placeholder:e.dicaBusca??(e.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${e.rotulo.toLowerCase()}`,"aria-controls":`${o}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:v}):null;if(y&&(y.value=v,y.addEventListener("input",()=>{s=y.value,c=0,L(),Z()})),i=g("div",{class:`spro-combo-pop${e.multiplo?" spro-combo-pop-multi":""}`},y?g("div",{class:"spro-combo-cabeca"},C("busca",15),y):null,g("ul",{role:"listbox",id:`${o}-lista`,class:"spro-combo-lista",tabindex:y?void 0:"-1","aria-label":e.rotulo,"aria-multiselectable":e.multiplo?"true":void 0}),g("div",{class:"spro-combo-extras"}),e.multiplo?g("div",{class:"spro-combo-rodape"}):null),i.addEventListener("keydown",ha),d=wr(f,i,{larguraMinima:e.larguraLista??220,alturaMaxima:360,aoFechar:()=>lo(!1)}),f.setAttribute("aria-expanded","true"),f.setAttribute("aria-controls",`${o}-lista`),f.classList.add("spro-combo-aberto"),L(),Z(),!i)return;(y??i.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),y&&v&&y.setSelectionRange?.(v.length,v.length)}function lo(v=!1){i&&(d?.fechar(),d=null,i=null,s="",f.setAttribute("aria-expanded","false"),f.removeAttribute("aria-controls"),f.classList.remove("spro-combo-aberto"),v&&f.focus?.({preventScroll:!0}))}return f.addEventListener("click",()=>i?lo(!0):Co()),f.addEventListener("keydown",v=>{i||(v.key==="ArrowDown"||v.key==="ArrowUp"?(v.preventDefault(),Co()):v.key.length===1&&v.key!==" "&&!v.ctrlKey&&!v.metaKey&&!v.altKey&&P()&&(v.preventDefault(),Co(v.key)))}),b(),{el:f,valor:()=>[...n],definir(v,x=!1){n=[...v],b(),L(),x&&h()},atualizar(){b(),L()},definirVazio(v){p=v,b()},definirEstado(v){u=v,b(),L(),Z()},abrir:Co,fechar:()=>lo(!1)}}function Tr(e,o,t,r="spro-campo"){let a=[["",o?`Lembrete em ${o.em.split("-").reverse().join("/")}`:"Sem lembrete"],["1","Lembrar amanh\xE3"],["7","Lembrar em 1 semana"],["30","Lembrar em 1 m\xEAs"],...o?[["0","Tirar o lembrete"]]:[]],n=g("select",{class:r,"aria-label":"Lembrete"},...a.map(([i,s])=>g("option",{value:i},s)));return n.addEventListener("change",()=>{let i=n.value;i!==""&&t(i==="0"?void 0:{...o,em:bo(e,Number(i))})}),n}function Cr(e,o,t){let r=o,a=i=>Do(bo(e,i)),n=So({rotulo:"Lembrete",icone:"sino",vazio:"Sem lembrete",busca:!1,larguraLista:240,opcoes:()=>[...r?[{valor:"atual",rotulo:`Lembrete em ${Do(r.em)}`,icone:"sino"}]:[],{valor:"1",rotulo:"Amanh\xE3",descricao:a(1),icone:"calendario"},{valor:"7",rotulo:"Em 1 semana",descricao:a(7),icone:"calendario"},{valor:"30",rotulo:"Em 1 m\xEAs",descricao:a(30),icone:"calendario"},...r?[{valor:"0",rotulo:"Tirar o lembrete",icone:"fechar"}]:[]],valor:r?["atual"]:[],aoMudar:i=>{let s=i[0];!s||s==="atual"||(r=s==="0"?void 0:{...r,em:bo(e,Number(s))},n.definir(r?["atual"]:[]),t(r))}});return n.el}var Sn=`:host{all:initial}
.fav-balao{box-sizing:border-box;width:340px;display:grid;gap:10px;padding:14px;font:13px/1.4 var(--spro-fonte);color:var(--spro-texto);background:var(--spro-fundo);border:1px solid var(--spro-borda);border-radius:var(--spro-raio-xg);box-shadow:var(--spro-sombra-3);animation:spro-surgir 160ms var(--spro-curva)}
.fav-balao-topo{display:flex;align-items:center;gap:10px}
.fav-balao-estrela{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:var(--spro-raio);color:var(--spro-estrela);background:color-mix(in srgb,var(--spro-estrela) 16%,transparent)}
.fav-balao-titulo{flex:1;min-width:0;display:grid;line-height:1.25}
.fav-balao-titulo strong{font-size:14px}
.fav-balao-titulo span{font-size:11.5px;color:var(--spro-suave);font-variant-numeric:tabular-nums;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.fav-campo{display:grid;gap:5px}
.fav-rotulo{font-size:11.5px;font-weight:600;color:var(--spro-suave);letter-spacing:.01em}
.fav-campo .spro-combo{width:100%}
.fav-campo .spro-combo-ativo{color:var(--spro-texto);background:var(--spro-fundo);border-color:var(--spro-borda-forte)}
.fav-chips-sel{display:flex;flex-wrap:wrap;gap:5px}
.fav-chips-sel:empty{display:none}
.fav-chips-sel .spro-chip .spro-icone{opacity:.6}
.fav-balao-rodape{display:flex;justify-content:flex-end;padding-top:2px}
textarea.spro-campo{resize:vertical;width:100%}`;function Tn(e){let o=e.favorito,t=[...e.etiquetas],r=async u=>{o=await e.editar(u)},a=(u,m)=>g("button",{type:"button","aria-pressed":String(e.lista===m),title:m==="pessoal"?"Mover para a sua lista Pessoal":`Mover para a lista da ${u}`,onclick:()=>{e.lista!==m&&e.moverPara(m)}},u),n=e.siglaUnidade?g("div",{class:"spro-segmentado fav-balao-listas",role:"group","aria-label":"Lista"},a(e.siglaUnidade,"unidade"),a("Pessoal","pessoal")):null,i=[...e.pastas],s=So({rotulo:"Pasta",icone:"pasta",vazio:"(sem pasta)",busca:!0,opcoes:()=>[{valor:"",rotulo:"(sem pasta)"},...i.map(u=>({valor:u.id,rotulo:u.nome,cor:u.cor}))],valor:o.pasta?[o.pasta]:[],criar:async u=>{let m=await e.criarPasta(u.slice(0,60));return i=[...i.filter(f=>f.id!==m.id),m],{valor:m.id,rotulo:m.nome,cor:m.cor}},rotuloCriar:u=>`Criar a pasta \u201C${u}\u201D`,aoMudar:u=>void r({pasta:u[0]||void 0}),larguraLista:260}),c=g("div",{class:"fav-chips-sel"}),l=So({rotulo:"Etiquetas",icone:"etiqueta",vazio:"Nenhuma",multiplo:!0,opcoes:()=>t.map(u=>({valor:u.id,rotulo:u.nome,cor:u.cor})),valor:o.etiquetas.filter(u=>t.some(m=>m.id===u)),criar:async u=>{let m=await e.criarEtiqueta(u.slice(0,40));return t=[...t.filter(f=>f.id!==m.id),m],{valor:m.id,rotulo:m.nome,cor:m.cor}},rotuloCriar:u=>`Criar a etiqueta \u201C${u}\u201D`,aoMudar:u=>{d();let m=o.etiquetas.filter(f=>!t.some(h=>h.id===f));r({etiquetas:[...u,...m]})},larguraLista:260}),d=()=>c.replaceChildren(...l.valor().map(u=>{let m=t.find(f=>f.id===u);return g("button",{type:"button",class:"spro-chip",style:`--cor:${m?.cor??"#ccc"}`,title:"Tirar esta etiqueta","aria-label":`Tirar a etiqueta ${m?.nome??""}`,onclick:()=>l.definir(l.valor().filter(f=>f!==u),!0)},m?.nome??"",C("fechar",11))}));d();let p=g("textarea",{class:"spro-campo",rows:"2",maxlength:String(2e3),placeholder:"Nota pessoal","aria-label":"Nota",value:o.nota??""});return p.addEventListener("change",()=>void r({nota:p.value})),g("div",{class:"fav-balao",role:"dialog","aria-label":`Monitorado ${o.protocolo}`},g("div",{class:"fav-balao-topo"},g("span",{class:"fav-balao-estrela"},C("alvoAtivo",16)),g("span",{class:"fav-balao-titulo"},g("strong",{},"Monitorado"),g("span",{},o.protocolo)),n,g("button",{type:"button",class:"spro-botao-icone pequeno","aria-label":"Fechar",onclick:()=>e.fechar()},C("fechar",14))),g("div",{class:"fav-campo"},g("span",{class:"fav-rotulo"},"Pasta"),s.el),g("div",{class:"fav-campo"},g("span",{class:"fav-rotulo"},"Etiquetas"),l.el,c),g("label",{class:"fav-campo"},g("span",{class:"fav-rotulo"},"Nota"),p),e.hoje?g("div",{class:"fav-campo"},g("span",{class:"fav-rotulo"},"Lembrete"),Cr(e.hoje,o.lembrete,u=>void r({lembrete:u}))):null,g("div",{class:"fav-balao-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>e.fechar()},C("check",14),"Pronto")))}var jo=null;function Dr(e,o,t){jo?.();let r=e.ownerDocument,a=r.defaultView,n=r.createElement("div");n.setAttribute("data-tema",o.temaEscuro?"escuro":"claro");let i=n.attachShadow({mode:"open"}),s=r.createElement("style");s.textContent=`${t}
${Sn}`;let c=f=>{f.composedPath().includes(n)||d()},l=f=>{f.key==="Escape"&&!i.querySelector(".spro-combo-pop")&&d()};function d(){n.remove(),r.removeEventListener("pointerdown",c,!0),r.removeEventListener("keydown",l,!0),jo===d&&(jo=null)}let p=Tn({...o,fechar:d});i.append(s,p);let u=e.getBoundingClientRect(),m=Math.max(8,Math.min(u.left,(a?.innerWidth??1024)-340))+(a?.scrollX??0);return n.style.cssText=`position:absolute;z-index:2147483000;left:${Math.round(m)}px;top:${Math.round(u.bottom+(a?.scrollY??0)+4)}px`,r.body.append(n),r.addEventListener("pointerdown",c,!0),r.addEventListener("keydown",l,!0),p.querySelector(".spro-combo")?.focus(),jo=d,d}function Mr(e,o){let t=e.querySelector("#divBotoesControleProcessos, #divComandos");if(!t||t.querySelector(".spro-fav-botao"))return null;let r=g("a",{href:"#",role:"button",class:"botaoSEI spro-fav-botao",title:"Monitorados","aria-label":"Monitorados",tabindex:"452",style:"cursor: pointer;"},g("img",{class:"infraCorBarraSistema",src:o.url("icons/menu/favoritos.svg"),alt:"Monitorados",title:"Monitorados"}));return r.addEventListener("click",a=>{a.preventDefault(),o.destino()==="lateral"?o.abrirLateral():o.rolarAtePainel()}),t.append(r),r}function kr(e,o){let t=e.querySelector("#topmenu .spro-fav-estrela");if(!t||t.parentElement?.querySelector(".spro-fav-abrir"))return null;let r="Abrir a lista de monitorados no painel lateral",a=g("button",{type:"button",class:"spro-fav-abrir",title:r,"aria-label":r},C("painel",16));return a.addEventListener("click",n=>{n.preventDefault(),n.stopPropagation(),o.abrirLateral()}),t.after(a),a}function Ir(e,o,t){e({tipo:"abrirPainel",aba:"favoritos"}).catch(()=>o(t))}async function Or(e,o){let t=0;for(let r of e){let[a,n,i]=await Promise.all([r.ativos(),r.atuais(),r.vistos()]);t+=a.filter(s=>me(s,o)||Kt(i.get(s.id)??s.visto,n.get(s.id)).length>0).length}return t}function Lr(e,o){e.querySelector(".spro-fav-contador")?.remove(),e.title=o?`Monitorados: ${o} ${o===1?"monitorado pede":"monitorados pedem"} aten\xE7\xE3o (lembrete ou novidade)`:"Monitorados",o&&e.append(g("span",{class:"spro-fav-contador","aria-hidden":"true"},String(o)))}function R(e,o=e.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:o,status:200,get html(){return e.documentElement.outerHTML},doc:e}}function be(){try{return window.top?.document??document}catch{return document}}function Nr(e,o,t){let r=se(R(e,t));return r.usuario.login?{host:r.host,login:r.usuario.login.toLowerCase(),nome:r.usuario.nome,unidade:r.unidade.id?{id:r.unidade.id,sigla:r.unidade.sigla,nome:r.unidade.nome}:null,versao:r.versao,temaEscuro:o}:null}async function Rr(e,o,t){let r=await e.unidade?.contem(o.id)?e.unidade:await e.pessoal.contem(o.id)?e.pessoal:null;r||(r=e.unidade??e.pessoal,await r.adicionar(o));let n=(await r.obter(o.id))?.documentos??[];if(n.some(s=>s.id===t.id))return await r.editar(o.id,{documentos:n.filter(s=>s.id!==t.id)}),!1;let i={id:t.id,numero:t.numero,titulo:t.titulo,criadoEm:Date.now()};return await r.editar(o.id,{documentos:[...n,i]}),!0}function qr(e,o){let t=o?"Tirar dos documentos monitorados":"Guardar este documento nos monitorados";e.setAttribute("aria-pressed",String(o)),e.setAttribute("aria-label",t),e.title=t,e.replaceChildren(C(o?"alvoAtivo":"alvo",15))}function zr(e,o,t){let r=new Map(o.map(l=>[l.id,l])),a=()=>{let l=new Set([...e.querySelectorAll(".spro-fav-doc")].map(d=>d.dataset.doc));for(let d of o){let p=e.getElementById(`anchor${d.id}`);if(!p||l.has(d.id))continue;let u=p;for(;u.nextElementSibling?.classList.contains("action-doc");)u=u.nextElementSibling;let m=g("button",{type:"button",class:"spro-fav-doc","data-doc":d.id});qr(m,t.marcado(d.id)),u.after(m)}},n=()=>{for(let l of e.querySelectorAll(".spro-fav-doc"))qr(l,t.marcado(l.dataset.doc??""))};e.addEventListener("click",l=>{let d=l.target?.closest?.(".spro-fav-doc");if(!d)return;l.preventDefault(),l.stopPropagation();let p=r.get(d.dataset.doc??"");!p||d.getAttribute("aria-busy")==="true"||(d.setAttribute("aria-busy","true"),t.alternar(p).catch(u=>console.warn("[SEI Pro] favoritos: documento",u)).finally(()=>{d.removeAttribute("aria-busy"),n()}))}),a();let i=e.querySelector("#divArvore")??e.body,s,c=typeof MutationObserver=="function"?new MutationObserver(()=>{clearTimeout(s),s=setTimeout(a,150)}):null;return c?.observe(i,{childList:!0,subtree:!0}),{parar:()=>{c?.disconnect(),clearTimeout(s)},repintar:n}}var Fr=/^\d{4}-\d{2}-\d{2}$/;function _r(e){if(e.modo==="nenhum"||!Fr.test(e.referencia))return;if(e.modo==="proximo"){let t=(e.tipos??"").split(",").map(a=>a.trim()).filter(Boolean),r=Math.trunc(Math.abs(e.n));return!t.length||!Number.isFinite(r)||r===0?void 0:{referencia:{de:"novoDocumento",tipos:t,desde:e.referencia},vencimento:{em:"dias",n:r,contagem:e.contagem},exibicao:"ate"}}let o=e.documento&&e.modo!=="data"?{de:"documento",idDocumento:e.documento.id,data:e.referencia}:{de:"data",data:e.referencia};if(e.modo==="data")return Fr.test(e.vencimento)?{referencia:o,vencimento:{em:"data",data:e.vencimento},exibicao:"ate"}:void 0;if(e.modo==="dias"){let t=Math.trunc(Math.abs(e.n));return!Number.isFinite(t)||t===0?void 0:{referencia:o,vencimento:{em:"dias",n:e.sentido==="antes"?-t:t,contagem:e.contagem},exibicao:"ate"}}return{referencia:o,exibicao:e.contagem==="uteis"?"desdeUteis":"desde"}}var Hr='#frmAtividadeListar[action*="acao=procedimento_enviar"]';function Cn(e){return[...e.querySelectorAll(`${Hr} #selProcedimentos option`)].map(o=>{let t=(o.textContent??"").trim(),r=t.indexOf(" - "),a=(r>=0?t.slice(0,r):t).trim(),n=r>=0?t.slice(r+3).trim():"";return{id:o.value.trim(),protocolo:a,especificacao:n||void 0}}).filter(o=>/^\d+$/.test(o.id)&&o.protocolo)}async function $r(e,o){let t=e.querySelector(Hr);if(!t||t.querySelector(".spro-fav-envio"))return null;let r=Cn(e);if(!r.length)return null;let a=r.length>1,n=g("input",{type:"checkbox",id:"chkSproManterFavoritos",style:"appearance:auto;opacity:1;position:static;width:auto;height:auto;margin:0"});n.checked=r.every(m=>o.ativo(m.id));let i=g("select",{class:"infraSelect",style:"width:auto;min-width:12em"}),s=g("input",{type:"date",class:"infraText",style:"width:auto"}),c=g("div",{class:"spro-fav-envio-opcoes",style:"display:flex;flex-wrap:wrap;gap:12px;align-items:center;margin:6px 0 0 22px"},g("label",{style:"display:inline-flex;gap:6px;align-items:center"},"Pasta:",i),g("label",{style:"display:inline-flex;gap:6px;align-items:center"},"Prazo at\xE9:",s),Tr(o.hoje(),void 0,m=>d({lembrete:m}),"infraSelect"));c.hidden=!n.checked;let l=async()=>{let[m,f]=await Promise.all([o.pastas(),o.obter(r[0].id)]);if(i.replaceChildren(g("option",{value:""},"(sem pasta)"),...m.map(h=>g("option",{value:h.id},h.nome))),!a&&f&&f.removidoEm===void 0){for(let h of i.options)h.selected=h.value===(f.pasta??"");s.value=f.prazo?.vencimento?.em==="data"?f.prazo.vencimento.data:""}};await l(),n.addEventListener("change",()=>{c.hidden=!n.checked,(async()=>{if(n.checked){for(let m of r)o.ativo(m.id)||await o.adicionar(m);await l()}else await o.remover(r.map(m=>m.id))})().catch(m=>console.warn("[SEI Pro] favoritos: n\xE3o foi poss\xEDvel gravar no envio",m))});let d=m=>void Promise.all(r.map(f=>o.editar(f.id,m))).catch(f=>console.warn("[SEI Pro] favoritos: n\xE3o foi poss\xEDvel gravar no envio",f));i.addEventListener("change",()=>d({pasta:i.value||void 0})),s.addEventListener("change",()=>{let m=s.value?_r({modo:"data",referencia:o.hoje(),vencimento:s.value,n:0,contagem:"corridos",sentido:"depois"}):void 0;d({prazo:m})});let p=a?`Manter os ${r.length} processos em Monitorados`:"Manter processo em Monitorados",u=g("div",{class:"infraAreaDados spro-fav-envio",style:"position:relative;clear:both;height:auto;margin:10px 0;padding:0"},g("label",{for:"chkSproManterFavoritos",style:"display:inline-flex;gap:6px;align-items:center;cursor:pointer"},n,p),c);return t.append(u),u}var Vr="spro-fav-estilo",Dn=`.spro-fav-estrela{background:none;border:0;padding:0 3px;margin:0 2px;cursor:pointer;color:#8a8a8a;vertical-align:middle;line-height:0}
.spro-fav-estrela:hover{color:#5f5f5f}
.spro-fav-estrela[aria-pressed="true"]{color:#e0a100}
.spro-fav-estrela[data-erro]{color:#c62828}
.spro-fav-estrela[aria-busy="true"]{opacity:.5}
.spro-fav-estrela:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.spro-fav-abrir{background:none;border:0;padding:0 3px;margin:0 2px;cursor:pointer;color:#8a8a8a;vertical-align:middle;line-height:0}
.spro-fav-abrir:hover{color:#5f5f5f}
.spro-fav-abrir:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.spro-fav-doc{background:none;border:0;padding:3px;margin:0;border-radius:5px;cursor:pointer;color:#a0a0a0;vertical-align:super;line-height:0}
.spro-fav-doc[aria-pressed="true"]{color:#e0a100}
.spro-fav-doc:hover{color:#fff;background:#017fff}
.spro-fav-doc[aria-busy="true"]{opacity:.5}
.spro-fav-doc:focus-visible{outline:2px solid #1a73e8;outline-offset:1px;border-radius:3px}
.seiSlim.dark-mode .spro-fav-estrela,.seiSlim.dark-mode .spro-fav-abrir{color:#9aa0a8}
.seiSlim.dark-mode .spro-fav-estrela:hover,.seiSlim.dark-mode .spro-fav-abrir:hover{color:#d0d3d8}
.seiSlim.dark-mode .spro-fav-estrela[aria-pressed="true"],.seiSlim.dark-mode .spro-fav-doc[aria-pressed="true"]{color:#f0b429}
.seiSlim.dark-mode .spro-fav-estrela[data-erro]{color:#ef5350}
.seiSlim.dark-mode .spro-fav-doc:not([aria-pressed="true"]):not(:hover){color:#9aa0a8}
.seiSlim.dark-mode .spro-fav-estrela svg,.seiSlim.dark-mode .spro-fav-estrela svg *,.seiSlim.dark-mode .spro-fav-abrir svg,.seiSlim.dark-mode .spro-fav-abrir svg *,.seiSlim.dark-mode .spro-fav-doc svg,.seiSlim.dark-mode .spro-fav-doc svg *{color:inherit}
.spro-fav-icone{display:inline-block;width:28px;height:24px;padding:0;margin:0;line-height:0;vertical-align:baseline}
.spro-fav-icone svg{display:block;width:20px;height:20px;margin:2px auto}
#topmenu .spro-fav-estrela,#topmenu .spro-fav-abrir{display:inline-block;width:27px;height:24px;padding:0;margin:0;line-height:0;vertical-align:baseline}
#topmenu .spro-fav-estrela svg,#topmenu .spro-fav-abrir svg{display:block;width:20px;height:20px;margin:2px auto}
.spro-fav-botao{position:relative}
.spro-fav-contador{position:absolute;top:-4px;right:-6px;min-width:16px;height:16px;padding:0 4px;border-radius:8px;background:#d93025;color:#fff;font:600 10px/16px sans-serif;text-align:center;box-sizing:border-box}
.spro-fav-titulo{display:flex!important;align-items:center;gap:8px}
.spro-fav-recolher{margin-left:4px;background:none;border:0;cursor:pointer;color:inherit;line-height:0;padding:2px;border-radius:4px}
.spro-fav-recolher:hover{background:rgb(127 127 127 / 14%)}
.spro-fav-recolher:focus-visible{outline:2px solid #1a73e8;outline-offset:1px}
@keyframes spro-fav-aviso{from{opacity:0;transform:translate(-50%,10px)}}
@media (prefers-reduced-motion:reduce){.spro-fav-aviso{animation:none!important}}`;function V(e){if(e.getElementById(Vr))return;let o=e.createElement("style");o.id=Vr,o.textContent=Dn,(e.head??e.documentElement).append(o)}var Ur=new WeakMap;function to(e,o,t){let r=Ur.get(e);if(r){r.push(t);return}let a=[t];Ur.set(e,a),e.addEventListener("click",n=>{let s=(n.composedPath?.()[0]??n.target)?.closest?.(".spro-fav-estrela");if(s&&(n.preventDefault(),n.stopPropagation(),s.getAttribute("aria-busy")!=="true"))for(let c of a){let l=c(s);if(l){Mn(o,l,s);return}}},!0)}async function Mn(e,o,t){t.setAttribute("aria-busy","true");try{await e.alternar(o,t),t.removeAttribute("data-erro")}catch(r){console.warn("[SEI Pro] favoritos: n\xE3o foi poss\xEDvel gravar",r);let a="N\xE3o foi poss\xEDvel gravar o monitorado. Tente de novo.";t.setAttribute("data-erro","1"),t.setAttribute("aria-label",a),t.title=a,e.carregar().catch(()=>{})}finally{t.removeAttribute("aria-busy")}}function jr(e,o,t=200){let r=Date.now();return new Promise(a=>{let n=()=>{let i=e();if(i)return a(i);if(Date.now()-r>=o)return a(null);setTimeout(n,t)};n()})}function ro(e,o=!1){let t=g("button",{type:"button",class:o?"spro-fav-estrela spro-fav-icone":"spro-fav-estrela"});return W(t,e),t}function W(e,o){if(e.getAttribute("aria-pressed")===String(o)&&e.firstChild)return;let t=o?"Remover dos monitorados":"Adicionar aos monitorados";e.setAttribute("aria-pressed",String(o)),e.setAttribute("aria-label",t),e.title=t,e.replaceChildren(C(o?"alvoAtivo":"alvo",16))}var kn='#topmenu a[target="ifrVisualizacao"], #topmenu a[target="ifrConteudoVisualizacao"]';function In(e,o){try{let t=J(R(e,o));return{id:t.idProcedimento,protocolo:t.protocolo,tipo:t.tipo||void 0,sigiloso:t.nivel==="sigiloso"}}catch{return null}}async function Br(e,o,t){let r=In(e,t);if(!r)return!1;let a=await jr(()=>e.querySelector(kn),1e4);if(!a||a.parentElement?.querySelector(".spro-fav-estrela"))return!1;V(e),to(e,o,i=>i.closest("#topmenu")?r:null);let n=ro(o.ativo(r.id));return a.after(n),o.aoMudar(()=>W(n,o.ativo(r.id))),!0}var Gr="tr[id^='P']";function Xr(e){let o=ae(e,e.closest("#tblProcessosGerados")?"gerados":"recebidos");return o?.idProcedimento?{id:o.idProcedimento,protocolo:o.protocolo,tipo:o.tipo||void 0,especificacao:o.especificacao||void 0,sigiloso:o.sigiloso}:null}function Jr(e,o){V(e),to(e,o,s=>{let c=s.closest(Gr)??e.getElementById(`P${s.getAttribute("data-spro-id")??""}`);return c?Xr(c):null});let t=()=>{for(let s of e.querySelectorAll(Gr)){let c=s.querySelector(".spro-fav-estrela");if(c){W(c,o.ativo(s.id.slice(1)));continue}let l=Xr(s),d=s.querySelectorAll("td")[1];!l||!d||d.prepend(ro(o.ativo(l.id),!0))}},r=!1,a=typeof MutationObserver=="function"?new MutationObserver(()=>{r||(r=!0,setTimeout(()=>{r=!1,t()},50))}):null,n=e.querySelector("#frmProcedimentoControlar")??e.body;a&&n&&a.observe(n,{childList:!0,subtree:!0});let i=o.aoMudar(t);return t(),{atualizar:t,desligar(){a?.disconnect(),i()}}}var Kr="#frmRelBlocoProtocoloLista .infraTable, #frmAcompanhamentoLista .infraTable, #frmProcedimentoSobrestar .infraTable";function Wr(e){let o=e.querySelectorAll("td")[2]?.querySelector("a[href*='acao=procedimento_trabalhar']");if(!o)return null;let t=N(o.getAttribute("href")??"").get("id_procedimento"),r=T(o);return!t||!r?null:{id:t,protocolo:r,sigiloso:/Sigiloso/i.test(o.getAttribute("class")??"")}}function Zr(e,o){V(e),to(e,o,a=>{let n=a.closest("tr");return n?.closest(Kr)?Wr(n):null});let t=()=>{for(let a of e.querySelectorAll(Kr))for(let n of a.querySelectorAll("tr")){let i=Wr(n),s=n.querySelectorAll("td")[2];if(!i||!s)continue;let c=s.querySelector(".spro-fav-estrela");c?W(c,o.ativo(i.id)):s.prepend(ro(o.ativo(i.id),!0))}},r=o.aoMudar(t);return t(),{atualizar:t,desligar:r}}var Yr="table.pesquisaResultado tr.pesquisaTituloRegistro";function Qr(e){let o=e.querySelector("a.protocoloNormal[href*='acao=procedimento_trabalhar']");if(!o)return null;let t=N((o.getAttribute("href")??"").replace(/&amp;/g,"&")).get("id_procedimento"),r=T(o);return!t||!r?null:{id:t,protocolo:r,tipo:o.getAttribute("title")?.trim()||void 0,sigiloAConfirmar:!0}}function oa(e,o){V(e),to(e,o,r=>{let a=r.closest("tr");return a?.matches(Yr)?Qr(a):null});let t=()=>{for(let r of e.querySelectorAll(Yr)){let a=Qr(r),n=r.querySelector("a.protocoloNormal[href*='acao=procedimento_trabalhar']");if(!a||!n)continue;let i=r.querySelector(".spro-fav-estrela");i?W(i,o.ativo(a.id)):n.after(ro(o.ativo(a.id)))}};o.aoMudar(t),t()}function On(e,o){let t=o.replace(/\D/g,""),r=t?e.querySelector(`tr[id="P${t}"] a[href*="procedimento_trabalhar"]`):null;if(r)return{tipo:"linha",link:r};let a=e.querySelector("#frmProtocoloPesquisaRapida"),n=e.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function ea(e,o,t,r){let a=On(e,o);if(!a)throw new k("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return r?e.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=t,r&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var Ln=/(\d{2})\/(\d{2})\/(\d{4})/;function xe(e){let o=[];for(let t of e.querySelectorAll("#tblDocumentos tr")){let r=t.querySelector('a[href*="id_documento="]');if(!r)continue;let a=/id_documento=(\d+)/.exec((r.getAttribute("href")??"").replace(/&amp;/g,"&"))?.[1],n=[...t.querySelectorAll("td")],i=n.findIndex(l=>l.contains(r)),s=(n[i+1]?.textContent??"").trim(),c=n.slice(i+2).map(l=>Ln.exec(l.textContent??"")).find(Boolean);!a||!c||o.push({id:a,numero:(r.textContent??"").trim(),nome:s,data:`${c[3]}-${c[2]}-${c[1]}`})}return o}async function ta(e,o){let t="arvore-aberta",r=o.arvoreAberta(e.id);if(!r){if(!e.buscar)throw new k("PRECISA_BUSCAR","Para listar os documentos, o SEI Pro precisa abrir a \xE1rvore deste processo. Se ele estiver aberto na sua unidade, o SEI pode registrar o andamento \u201CProcesso recebido\u201D em seu nome, ou marc\xE1-lo como visualizado, como se voc\xEA o abrisse.");t="busca",r=await o.arvoreBuscada(e.protocolo)}if(!r.acaoGerarPdf)throw new k("SEM_LISTA_DOCUMENTOS","O SEI n\xE3o oferece a lista de documentos deste processo para voc\xEA (falta \u201CGerar Arquivo PDF do Processo\u201D).");return{documentos:xe(await o.obter(r.acaoGerarPdf)),origem:t}}function ye(e){return{contexto:()=>e.ctx,...$e(e),abrirProcesso:o=>{let t=o??{};return ea(e.doc,String(t.id??""),String(t.protocolo??""),t.novaAba===!0)},lerLegado:async()=>({local:St(e.armazenamento),arquivo:e.lerArquivo?await e.lerArquivo():null}),atualizarForaDaUnidade:()=>{if(!e.atualizar)throw new k("SEM_ATUALIZAR","Abra uma tela do SEI para atualizar.");return e.atualizar.iniciar()},cancelarAtualizacao:()=>e.atualizar?.cancelar()??!1,sincronizarAgora:()=>{if(!e.sincronia)throw new k("SEM_SINCRONIA","A sincronia pelo Texto Padr\xE3o s\xF3 funciona numa tela do SEI com unidade.");return e.sincronia.agora()},apagarDoSei:()=>{if(!e.sincronia)throw new k("SEM_SINCRONIA","A sincronia pelo Texto Padr\xE3o s\xF3 funciona numa tela do SEI com unidade.");return e.sincronia.apagar()},documentosAssinados:o=>{let t=o??{};return ta({id:String(t.id??""),protocolo:String(t.protocolo??""),buscar:t.buscar===!0},Nn(e.doc))}}}function Nn(e){let o=null,t=()=>(o??=new so(e.location?.href??location.href,()=>R(e)),o);return{arvoreAberta(r){try{let a=e.querySelector("#ifrArvore")?.contentDocument;if(!a?.querySelector("#divArvore"))return null;let n=J(R(a,a.location.href));return n.idProcedimento===r?{acaoGerarPdf:io(n,"procedimento_gerar_pdf")}:null}catch{return null}},async arvoreBuscada(r){let a=await t().arvore(r);return{acaoGerarPdf:io(a,"procedimento_gerar_pdf")}},async obter(r){return(await t().http.obter(r)).doc}}}function Bo(e){let o=n=>e.querySelector(n)?.getAttribute("value")?.trim()??"",t=o("#hdnTipoVisualizacao");if(t&&t!=="R")return"visualiza\xE7\xE3o detalhada (use a resumida)";let r=o("#hdnMeusProcessos");if(r&&r!=="T")return"s\xF3 os processos atribu\xEDdos a voc\xEA";for(let[n,i]of[["hdnIdMarcador","filtro por marcador"],["hdnIdTipoProcedimento","filtro por tipo de processo"],["hdnIdTipoPrioridade","filtro por prioridade"]])if([...e.querySelectorAll(`input[id^="${n}"]`)].some(s=>(s.getAttribute("value")??"").trim()))return i;let a=[...e.querySelectorAll(".caixaFiltroControle")].map(n=>(n.textContent??"").trim()).filter(Boolean);if(a.length)return`filtro ativo: ${a.join(", ")}`;if(e.querySelector("#btnLiberarMarcador"))return"filtro por marcador";if(e.querySelector("#tblMarcadores"))return"caixa agrupada por marcadores";for(let n of["#tblProcessosRecebidos","#tblProcessosGerados"]){let i=e.querySelector(`${n} caption b`);if(i)return`filtro do painel: ${(i.textContent??"").trim()}`}return e.querySelector("#divFiltro")&&!e.querySelector("#lnkAtribuidosMim, #divFiltroMeusProcessos")?"filtro do painel de controle":null}var qn="data-seipro-favoritos";function ra(e){e.documentElement?.setAttribute(qn,"1")}function Rn(e){if(!e.querySelector("#divRecebidos")||!e.querySelector("#divGerados"))return!1;for(let o of["#tblProcessosRecebidos","#tblProcessosGerados"]){let t=e.querySelector(o);if(!t)continue;let r=Number(/\((\d+)\s+registro/.exec(t.querySelector("caption")?.textContent??"")?.[1]??Number.NaN);if(!Number.isFinite(r)||r>t.querySelectorAll("tr[id^='P']").length)return!1}return!0}var zn=(e,o)=>!!e&&e.abertoNaUnidade===o.abertoNaUnidade&&e.naoVisualizado===o.naoVisualizado&&e.documentoNovo===o.documentoNovo&&e.atribuido===o.atribuido&&JSON.stringify(e.marcadores??[])===JSON.stringify(o.marcadores??[]);async function aa(e,o,t=Date.now()){if(o.escopo.lista!=="unidade")return 0;let r=new Map(lt(R(e)).map(d=>[d.idProcedimento,d])),a=Rn(e)&&!Bo(e),[n,i,s]=await Promise.all([o.ativos(),o.atuais(),o.vistos()]),c=[],l=[];for(let d of n){let p=r.get(d.id);p&&(d.sigiloAConfirmar||!!d.sigiloso!==p.sigiloso)&&await o.editar(d.id,p.sigiloso?{sigiloso:!0,especificacao:void 0,sigiloAConfirmar:void 0}:{sigiloso:void 0,sigiloAConfirmar:void 0});let u=i.get(d.id),m;if(p)m={...u,quando:t,fonte:"caixa",abertoNaUnidade:!0,naoVisualizado:p.novo,documentoNovo:p.documentoNovo,atribuido:p.atribuido||void 0,marcadores:p.sinais.filter(f=>/marcador/i.test(f)),recebidoNaLeitura:void 0};else if(a)m={...u,quando:t,fonte:"caixa",abertoNaUnidade:!1,naoVisualizado:void 0,documentoNovo:void 0,recebidoNaLeitura:void 0};else continue;zn(u,m)||c.push([d.id,m]),!s.has(d.id)&&!d.visto&&l.push([d.id,m])}c.length&&await o.gravarAtuais(c);for(let[d,p]of l)await o.gravarVisto(d,p);return c.length}async function na(e,o,t,r,a=Date.now()){let n;try{n=J(R(e,o))}catch{return 0}if(!n.idProcedimento)return 0;let i=[];for(let u of t)await u.contem(n.idProcedimento)&&i.push(u);if(!i.length)return 0;let s=n.nivel==="sigiloso";for(let u of i){let m=await u.obter(n.idProcedimento);m&&(m.sigiloAConfirmar||!!m.sigiloso!==s)&&await u.editar(n.idProcedimento,s?{sigiloso:!0,especificacao:void 0,sigiloAConfirmar:void 0}:{sigiloso:void 0,sigiloAConfirmar:void 0})}if(s)return 0;let c=X(n.links,"procedimento_consultar_historico")??/consultarAndamento\('([^']+)'/.exec(e.querySelector("#divConsultarAndamento a")?.getAttribute("onclick")??"")?.[1]?.replace(/&amp;/g,"&")??null,l;if(c)try{let u=No(await r(c))[0];u&&(l={data:u.data,unidade:u.unidade,descricao:u.descricao})}catch{}let d=[];for(let u of i){let m=await u.obter(n.idProcedimento);m?.prazo?.referencia.de==="novoDocumento"&&d.push({r:u,prazo:m.prazo})}let p=d.length?X(n.links,"procedimento_gerar_pdf"):null;if(p)try{let u=xe((await r(p)).doc);for(let{r:m,prazo:f}of d){let h=Fn(f,u);h&&await m.editar(n.idProcedimento,{prazo:h})}}catch{}for(let u of i){let m=(await u.atuais()).get(n.idProcedimento),f={...m,quando:a,fonte:"arvore",qtdDocumentos:n.documentos.length,ultimoAndamento:l??m?.ultimoAndamento,recebidoNaLeitura:void 0};await u.gravarAtual(n.idProcedimento,f),await u.marcarVisto([n.idProcedimento])}return i.length}function Fn(e,o){if(e.referencia.de!=="novoDocumento")return null;let{tipos:t,desde:r}=e.referencia,a=t.map(i=>M(i)).filter(Boolean),n=[...o].filter(i=>i.data>=r&&a.some(s=>M(i.nome).startsWith(s))).sort((i,s)=>i.data<s.data?-1:i.data>s.data?1:0)[0];return n?{...e,referencia:{de:"documento",idDocumento:n.id,data:n.data}}:null}var ia="favoritesPro";function sa(e){return Re(e,ia)}function ca(e,o){return He(e,{...o,id:ia,titulo:"Monitorados",tituloIframe:"Monitorados do SEI Pro",prefixo:"spro-fav",rotulos:{mostrar:"Mostrar monitorados",recolher:"Recolher monitorados"},icone:()=>{let t=C("alvoAtivo",20);return t.setAttribute("style","color:#e0a100"),t},estilo:V})}var Go=class{constructor(o){this.d=o;for(let t of[o.unidade,o.pessoal])t?.aoMudar(()=>this.agendarRecarga())}ids=new Set;ouvintes=new Set;agendado=!1;async carregar(){let o=await Promise.all([this.d.unidade?this.d.unidade.ativos():Promise.resolve([]),this.d.pessoal.ativos()]);this.ids=new Set(o.flat().map(t=>t.id)),this.avisar()}ativo(o){return this.ids.has(o)}aoMudar(o){return this.ouvintes.add(o),()=>this.ouvintes.delete(o)}async alternar(o,t){if(this.ids.has(o.id))return await Promise.all([this.d.unidade?.remover([o.id]),this.d.pessoal.remover([o.id])]),this.ids.delete(o.id),this.avisar(),!1;let r=this.d.unidade??this.d.pessoal,a=await r.adicionar(o);return this.ids.add(o.id),this.avisar(),this.d.aoAdicionar?.(a,r,t),!0}avisar(){for(let o of[...this.ouvintes])o()}agendarRecarga(){this.agendado||(this.agendado=!0,setTimeout(()=>{this.agendado=!1,this.carregar()},30))}};var _n={maisNovo:"Os dados no SEI foram gravados por uma vers\xE3o mais nova do SEI Pro. Atualize a extens\xE3o neste computador; o texto n\xE3o foi alterado.",grandeDemais:(e,o)=>`Os dados ficaram grandes demais para o Texto Padr\xE3o (${e} KB de ${o} KB).`,pertoDoTeto:e=>`Os dados est\xE3o perto do limite do Texto Padr\xE3o (${e} KB).`,invalidoRegravado:e=>`O texto no SEI estava inv\xE1lido (${e}) e foi regravado a partir deste computador.`,mudouDuranteGravacao:"O texto no SEI mudou enquanto era gravado (outra pessoa sincronizando). Nova tentativa na pr\xF3xima rodada.",soLeitura:"Indispon\xEDvel nesta unidade: o SEI n\xE3o deixa gravar este Texto Padr\xE3o com o seu perfil."},Hn={definir:(e,o)=>setTimeout(e,o),cancelar:e=>clearTimeout(e)},la=5*6e4,$n=864e5,Ae=(e,o)=>`seipro-${e}-sync|${o}`;function ua(e,o){if(e===o)return!0;if(e===null||o===null)return!1;let t=Po(e),r=Po(o);return t!==null&&r!==null&&t===r}function da(e){let o=e?.codigo;return o==="SEI_SESSAO_EXPIRADA"?{estado:"erro",mensagem:"Sess\xE3o do SEI expirada. Entre de novo no SEI."}:o==="SEI_ACAO_INDISPONIVEL"?{estado:"indisponivel",mensagem:"Indispon\xEDvel nesta unidade: o SEI n\xE3o oferece Textos Padr\xE3o para voc\xEA aqui."}:{estado:"erro",mensagem:e instanceof Error?e.message:String(e)}}var To=class{constructor(o){this.d=o}espera;geracao=0;desistencias=0;parado=!1;filaStatus=Promise.resolve();get temporizador(){return this.d.temporizador??Hn}get atrasoEnvio(){return this.d.atrasoEnvio??15e3}agora(){return this.d.agora?.()??Date.now()}async status(){let o=this.d.adaptador.chaveStatus;return(await this.d.area.obter(o))[o]??{estado:"nunca",quando:0,pendente:!1}}gravarStatus(o){let t=this.filaStatus.then(async()=>{let r={...await this.status(),aguardandoPermissao:void 0,...o};return await this.d.area.gravar({[this.d.adaptador.chaveStatus]:r}),r});return this.filaStatus=t.catch(()=>{}),t}async marcarPendente(){this.geracao++,(await this.status()).pendente||await this.gravarStatus({pendente:!0})}agendarEnvio(){return this.parado=!1,this.armar(this.atrasoEnvio),this.marcarPendente()}parar(){this.parado=!0,this.espera!==void 0&&this.temporizador.cancelar(this.espera),this.espera=void 0}armar(o){this.espera!==void 0&&this.temporizador.cancelar(this.espera),this.espera=this.temporizador.definir(()=>{this.espera=void 0,this.enviarAgendado().catch(()=>{})},o)}rearmar(o){this.parado||this.armar(o)}async enviarAgendado(){let o=!(this.d.lerNoRecuo&&this.noRecuo(await this.status(),this.agora()));await this.executar(o)===null&&this.rearmar(this.atrasoEnvio)}noRecuo(o,t){return o.estado==="indisponivel"&&(o.indisponivelAte??0)>t}async sincronizar(o={}){return this.parado=!1,await this.executar(o.forcar===!0)??await this.status()}async executar(o){let t=this.agora(),r=await this.status(),a=this.d.intervaloPuxar??la,n=this.d.adaptador,i=Ae(n.modulo,n.chaveStatus);if(!o){if(this.noRecuo(r,t))return!this.d.lerNoRecuo||r.ultimoPuxar&&t-r.ultimoPuxar<a?r:this.d.travar(i,()=>this.soLer(t));if(!r.pendente&&r.ultimoPuxar&&t-r.ultimoPuxar<a)return r}return this.d.travar(i,()=>this.rodada(t))}async soLer(o){try{let t=await this.d.destino.ler();if(t!==null){let r=await this.validar(t);"ok"in r&&await this.d.adaptador.importar(r.ok)}return this.gravarStatus({ultimoPuxar:o,tamanho:t?.length})}catch{return this.gravarStatus({ultimoPuxar:o})}}async desistir(o,t){this.desistencias++;let r=await this.gravarStatus({estado:"erro",quando:o,ultimoPuxar:o,pendente:!0,mensagem:t.mudouDuranteGravacao});return this.rearmar(this.esperaDepoisDeDesistir()),r}esperaDepoisDeDesistir(){let o=Math.min(this.atrasoEnvio*2**Math.max(0,this.desistencias-1),la);return o+Math.floor((this.d.aleatorio??Math.random)()*(o/2))}async concluir(o,t){this.desistencias=0;let r=await this.gravarStatus({...t,pendente:this.geracao!==o});return!r.pendente&&this.geracao!==o&&(r=await this.gravarStatus({pendente:!0})),r.pendente&&this.rearmar(this.atrasoEnvio),r}async validar(o){let t=await ve(o);return"invalido"in t?t:this.d.adaptador.validar(t.bruto)}async rodada(o){let t=this.d.adaptador,r={..._n,...t.mensagens},a=this.d.releituras??3,n=!1;try{let i=await this.d.destino.ler();n=!0;for(let s=0;;s++){let c=null,l=null;if(i!==null){let h=await this.validar(i);if("maisNovo"in h)return this.gravarStatus({estado:"erro",quando:o,ultimoPuxar:o,mensagem:r.maisNovo});"ok"in h?(await t.importar(h.ok),c=h.ok):l=h.invalido}let d=this.geracao,p=await t.exportar({remoto:c,agora:o,invalido:l!==null});if(i!==null&&c!==null&&t.assinatura(p)===t.assinatura(c))return this.concluir(d,{estado:"ok",quando:o,ultimoOk:o,ultimoPuxar:o,mensagem:void 0,tamanho:i.length});if(i===null&&t.vazio?.(p))return this.concluir(d,{estado:"ok",quando:o,ultimoOk:o,ultimoPuxar:o,mensagem:void 0,tamanho:0});let u=await ge(t.legivel(),p),m=Math.ceil(u.length/1024);if(u.length>t.teto)return this.gravarStatus({estado:"erro",quando:o,ultimoPuxar:o,tamanho:u.length,mensagem:r.grandeDemais(m,Math.round(t.teto/1024))});if(this.d.permitido&&!await this.d.permitido())return c!==null&&t.normalizar&&t.assinatura(p)===t.assinatura(await t.normalizar(c,o))?this.concluir(d,{estado:"ok",quando:o,ultimoOk:o,ultimoPuxar:o,mensagem:void 0,tamanho:i?.length??0}):this.gravarStatus({estado:"nunca",quando:o,ultimoPuxar:o,pendente:!1,mensagem:void 0,aguardandoPermissao:!0});i!==null&&l!==null&&await t.antesDeRegravarInvalido?.(l,i);let f=a>0?this.d.destino.gravarConferindo?.bind(this.d.destino):void 0;if(a>0&&!f){let h=await this.d.destino.ler();if(!ua(h,i)){if(s+1>=a)return this.desistir(o,r);i=h;continue}}if(f){let h=await f(u,{anterior:i,mesmo:ua});if(!h.gravado){if(s+1>=a)return this.desistir(o,r);i=h.atual;continue}}else await this.d.destino.gravar(u);return this.concluir(d,{estado:"ok",quando:o,ultimoOk:o,ultimoPuxar:o,tamanho:u.length,mensagem:l?r.invalidoRegravado(l):u.length>t.aviso?r.pertoDoTeto(m):void 0})}}catch(i){let s=da(i);return s.estado==="indisponivel"&&n&&(s.mensagem=r.soLeitura),this.gravarStatus({estado:s.estado,mensagem:s.mensagem,quando:o,indisponivelAte:s.estado==="indisponivel"?o+$n:void 0})}}};function Ee(e){let o=0;for(let t of e.querySelectorAll('select#selTextoPadrao option, select[name="selTextoPadrao"] option'))(t.textContent??"").trim().startsWith($o)&&(t.remove(),o++);return o}var Xo=class{constructor(o){this.d=o}motor=null;pararMudancas=null;pararConsentimento=null;ultimoEstado=null;criarMotor(){let o=this.d.armazem(),t={ler:()=>o.ler(),gravar:r=>o.gravar(r)};return o.gravarConferindo&&(t.gravarConferindo=(r,a)=>o.gravarConferindo(r,a)),new To({adaptador:this.d.adaptador,destino:t,area:this.d.area,travar:this.d.travar,agora:this.d.agora,atrasoEnvio:this.d.atrasoEnvio,intervaloPuxar:this.d.intervaloPuxar,releituras:this.d.releituras,lerNoRecuo:this.d.lerNoRecuo,permitido:this.d.permitido??(async()=>await this.d.consentimento.estado()==="ligado")})}rodar(o){return this.motor??=this.criarMotor(),this.motor.sincronizar({forcar:o})}ligar(o){this.pararMudancas||(this.motor??=this.criarMotor(),this.pararMudancas=this.d.aoMudarLocal(()=>void this.motor?.agendarEnvio()),o&&this.rodar(!1).catch(()=>{}))}desligar(){this.pararMudancas?.(),this.pararMudancas=null,this.motor?.parar()}async pendenteGravado(){let o=this.d.adaptador.chaveStatus;return(await this.d.area.obter(o))[o]?.pendente===!0}async iniciar(o){let t=await this.d.consentimento.estado();this.ultimoEstado=t,(t==="ligado"||this.d.lerSemConsentimento)&&this.ligar(o.puxar||await this.pendenteGravado()),this.pararConsentimento?.(),this.pararConsentimento=this.d.consentimento.aoMudar(()=>{this.d.consentimento.estado().then(r=>{let a=this.ultimoEstado;if(this.ultimoEstado=r,r==="ligado"){let n=this.pararMudancas!==null;this.ligar(!1),(!n||a!=="ligado")&&this.rodar(!0).catch(()=>{})}else this.d.lerSemConsentimento||this.desligar()})})}async puxar(){return this.pararMudancas?this.rodar(!1):null}agora(){return this.rodar(!0)}async apagar(){this.desligar(),await this.d.consentimento.definir("desligado");let o=this.d.armazem(),t=async()=>{let n=await o.excluir();return o.localizar&&await o.localizar()&&(n=await o.excluir()||n),n},r=Ae(this.d.adaptador.modulo,this.d.adaptador.chaveStatus),a=this.d.travarEsperando?await this.d.travarEsperando(r,t):await t();return await this.d.area.gravar({[this.d.adaptador.chaveStatus]:{estado:"nunca",quando:Date.now(),pendente:!1}}),a}parar(){this.desligar(),this.pararConsentimento?.()}};function we(e){if(Array.isArray(e))return`[${e.map(we).join(",")}]`;if(e&&typeof e=="object"){let o=e;return`{${Object.keys(o).sort().filter(t=>o[t]!==void 0).map(t=>`${JSON.stringify(t)}:${we(o[t])}`).join(",")}}`}return JSON.stringify(e)}function Jo(e){return[...e].sort((o,t)=>o.id<t.id?-1:o.id>t.id?1:0)}function pa(e){let o=we(e);return`${co(o)}${co(o.split("").reverse().join(""))}`}function ma(e){let o=[...e.escopos].map(t=>({k:po(t.escopo),f:Jo(t.favoritos),p:Jo(t.pastas),e:Jo(t.etiquetas)})).sort((t,r)=>t.k<r.k?-1:t.k>r.k?1:0);return pa(o)}function fa(e){return{modulo:"favoritos",chaveStatus:e.chaveStatus,teto:e.teto??pr,aviso:e.teto?e.teto*.8:mr,legivel:()=>hr(e.nomeUsuario),validar:o=>br(o,e.escopo),importar:async o=>{await e.repo.importar(o.escopos[0])},exportar:({remoto:o})=>vr(e.repo,e.escopo,e.carimbo(),new Set((o?.escopos[0]?.favoritos??[]).map(t=>t.id))),assinatura:ma,mensagens:{maisNovo:"Os monitorados no SEI foram gravados por uma vers\xE3o mais nova do SEI Pro. Atualize a extens\xE3o neste computador; o texto n\xE3o foi alterado.",grandeDemais:(o,t)=>`A lista ficou grande demais para o Texto Padr\xE3o (${o} KB de ${t} KB). Use a sincroniza\xE7\xE3o por arquivo.`,pertoDoTeto:o=>`A lista est\xE1 perto do limite do Texto Padr\xE3o (${o} KB).`}}}var Vn=e=>`favoritos/sync/tp/${po(e)}`,Ko=class{controle;constructor(o){let t=o.escopo.unidade?.id??"";this.controle=new Xo({area:o.area,adaptador:fa({repo:o.repo,escopo:o.escopo,carimbo:o.carimbo,nomeUsuario:o.ctx.nome||o.ctx.login,chaveStatus:Vn(o.escopo)}),armazem:o.armazem,consentimento:{estado:async()=>Nt(await oo(o.sync),o.ctx.host,o.ctx.login,t),definir:r=>qt(o.sync,o.ctx.host,o.ctx.login,t,r),aoMudar:r=>o.sync.aoMudar(a=>{Q in a&&r()})},aoMudarLocal:r=>o.repo.aoMudar(r),travar:o.travar,travarEsperando:o.travarEsperando,atrasoEnvio:o.atrasoEnvio,releituras:0})}iniciar(o){return this.controle.iniciar({puxar:o==="caixa"})}agora(){return this.controle.agora()}apagar(){return this.controle.apagar()}parar(){this.controle.parar()}};ra(document);var ga=window;if(!ga.__seiProFavoritos){ga.__seiProFavoritos=!0;let e=()=>void jn().catch(o=>console.warn("[SEI Pro] favoritos:",o));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e()}function Un(e){return e.querySelector("#frmProcedimentoControlar")?"caixa":e.querySelector("table.pesquisaResultado")?"pesquisa":e.querySelector('#frmAtividadeListar[action*="acao=procedimento_enviar"]')?"enviar":e.querySelector("#topmenu")&&e.querySelector("#divArvore")?"arvore":e.querySelector("#frmRelBlocoProtocoloLista, #frmAcompanhamentoLista, #frmProcedimentoSobrestar")?"listas":null}async function jn(){Ee(document);let e=window===window.top,o=Un(document);if(!o&&!e||!await Te("gerenciarfavoritos"))return;let t=be(),r=Nr(t,uo(document,localStorage),t.location?.href);if(!r)return;let a=Mo(t);a&&(r.corTema=a),Me(t,localStorage,r);let n=Wo(chrome.storage.local,"local"),i=Wo(chrome.storage.sync,"sync"),s=It(chrome.runtime.getManifest()),c=()=>Ir(b=>chrome.runtime.sendMessage(b),b=>void window.open(b,"seiProPainel","popup,width=420,height=760"),chrome.runtime.getURL("html/painel.html#aba=favoritos")),l=await Pe(n),d=()=>({agora:Date.now(),dispositivo:l}),p=Mt(r),u={unidade:p.unidade?new go(n,p.unidade,d):null,pessoal:new go(n,p.pessoal,d)},m=e&&u.unidade&&p.unidade?new Ko({ctx:r,area:n,sync:i,repo:u.unidade,escopo:p.unidade,carimbo:d,travar:Ge,travarEsperando:Xe,armazem:()=>ht(new so(location.href,()=>R(document)),{nome:fr(r.login),descricao:gr})}):null;m&&await m.iniciar(o);let f=e?Jn(r,n,u):null;if(e&&Bn(r,n,m,f),!o)return;let h=new Go({...u,aoAdicionar:(b,P,E)=>void va(b,P,E,u,r,i)});if(await h.carregar(),o==="caixa"){if(Jr(document,h),u.unidade&&aa(document,u.unidade).catch(b=>console.warn("[SEI Pro] favoritos: captura da caixa",b)),e){let b=await Gn(r,i,s,c,m,f);b&&Kn(b,[u.unidade,u.pessoal].filter(P=>!!P))}}else if(o==="arvore"){await Br(document,h,location.href)&&s&&kr(document,{url:P=>chrome.runtime.getURL(P),abrirLateral:c}),Wn(u);let b=Ro(location.href);na(document,location.href,[u.unidade,u.pessoal].filter(P=>!!P),P=>b.obter(P)).catch(P=>console.warn("[SEI Pro] favoritos: captura da \xE1rvore",P))}else if(o==="pesquisa")oa(document,h);else if(o==="enviar"){let b=async E=>await u.unidade?.contem(E)?u.unidade:await u.pessoal.contem(E)?u.pessoal:null,P=u.unidade??u.pessoal;await $r(document,{ativo:E=>h.ativo(E),adicionar:E=>P.adicionar(E),remover:E=>Promise.all([u.unidade?.remover(E),u.pessoal.remover(E)]),editar:async(E,q)=>(await b(E))?.editar(E,q),obter:async E=>(await b(E))?.obter(E),pastas:()=>P.pastasAtivas(),hoje:()=>ho()})}else Zr(document,h)}function Bn(e,o,t,r){let a=document.hasFocus()?Date.now():0,n=je({area:o,chave:Dt,conectar:()=>chrome.runtime.connect({name:Ct}),tratadores:ye({doc:document,ctx:e,iframe:null,armazenamento:localStorage,lerArquivo:()=>ce(),sincronia:t,atualizar:r}),estado:()=>({visivel:document.visibilityState==="visible",foco:a,chave:kt(e)})}),i=()=>{a=Date.now(),n.apresentar()};window.addEventListener("focus",i),document.addEventListener("visibilitychange",()=>document.visibilityState==="visible"?i():n.apresentar()),setInterval(()=>n.verificar(),5e3)}async function va(e,o,t,r,a,n){if(!(await oo(n)).perguntarAoFavoritar)return;let i=o===r.unidade?"unidade":"pessoal",[s,c]=await Promise.all([o.pastasAtivas(),o.etiquetasAtivas()]);Dr(t,{favorito:e,lista:i,siglaUnidade:r.unidade?a.unidade?.sigla??"Unidade":null,pastas:s,etiquetas:c,temaEscuro:a.temaEscuro,hoje:ho(),editar:l=>o.editar(e.id,l),criarPasta:l=>o.criarPasta(l),criarEtiqueta:l=>o.criarEtiqueta(l),moverPara:async l=>{let d=l==="unidade"?r.unidade:r.pessoal;if(!d||d===o)return;let p=await tr(o,d,e.id);p&&await va(p,d,t,r,a,n)}},Je)}async function Gn(e,o,t,r,a,n){let i=await oo(o),s=null,c=()=>{let d=le(i.exibir,t);d.abaixo&&!s?s=Xn(e,o,i.recolhido,a,n):!d.abaixo&&s&&(s.fechar(),s=null)};c();let l=Mr(document,{url:d=>chrome.runtime.getURL(d),destino:()=>le(i.exibir,t).lateral?"lateral":"abaixo",abrirLateral:r,rolarAtePainel:()=>{if(!s)return r();s.corpo.hidden&&s.painel.querySelector(".spro-fav-recolher")?.click(),s.painel.scrollIntoView({behavior:"smooth",block:"start"})}});return o.aoMudar(d=>{Q in d&&oo(o).then(p=>{i=p,c()})}),l}function Xn(e,o,t,r,a){let n=ca(document,{urlApp:chrome.runtime.getURL("html/favoritos.html"),temaEscuro:e.temaEscuro,recolhido:t,ordem:sa(localStorage),aoRecolher:c=>void de(o,{recolhido:c})});if(!n)return null;let i=ye({doc:document,ctx:e,iframe:n.iframe,armazenamento:localStorage,lerArquivo:()=>ce(),sincronia:r,atualizar:a,sobreposicao:n.sobreposicao,avisar:yr(document,e.temaEscuro)}),s=Ve(n,()=>chrome.runtime.connect({name:Tt}),i);return{painel:n.painel,corpo:n.corpo,fechar:s.fechar}}function Jn(e,o,t){return new Uo(()=>{let r=new so(location.href,()=>R(document));return{repos:[t.unidade,t.pessoal].filter(a=>!!a),listarCaixa:async a=>{let n=await r.http.obter(r.linkMenu("procedimento_controlar"),{sinal:a,aceitarValidacao:!0}),i=Bo(n.doc);if(i)throw new k("CAIXA_FILTRADA",`A caixa do Controle de Processos est\xE1 com ${i}. Tire o filtro e tente de novo: sem a caixa inteira, o SEI Pro n\xE3o sabe quais processos est\xE3o na sua unidade.`);let s=await ut(r,{limite:Number.MAX_SAFE_INTEGER,sinal:a});if(s.processos.length<s.total)throw new k("CAIXA_INCOMPLETA","N\xE3o foi poss\xEDvel ler a caixa inteira; nada foi atualizado.");return new Set(s.processos.map(c=>c.idProcedimento))},localizar:async(a,n)=>(await r.localizar(a,{sinal:n})).idProcedimento,lerProcesso:async(a,n)=>{let i=await r.arvore(a,{sinal:n,forcar:!0}),s=io(i,"procedimento_consultar_historico"),c=s?No(await r.http.obter(s,{sinal:n}))[0]:void 0;return{qtdDocumentos:i.documentos.length,abertoNaUnidade:!!io(i,"procedimento_enviar"),ultimoAndamento:c?{data:c.data,unidade:c.unidade,descricao:c.descricao}:void 0}},esperar:(a,n)=>new Promise(i=>{let s=setTimeout(i,a);n.addEventListener("abort",()=>{clearTimeout(s),i()},{once:!0})})}},r=>o.gravar({[xr(e.host,e.login)]:{...r,quando:Date.now()}}),{area:o,host:e.host,login:e.login})}function Kn(e,o){let t=!1,r=()=>{t||(t=!0,setTimeout(()=>{t=!1,Or(o,ho()).then(a=>Lr(e,a)).catch(()=>{})},100))};for(let a of o)a.aoMudar(r),a.aoMudarAtuais(r);r()}function Wn(e){let o;try{o=J(R(document,location.href))}catch{return}if(!o.idProcedimento||!o.documentos.length)return;let t={id:o.idProcedimento,protocolo:o.protocolo,tipo:o.tipo||void 0,sigiloso:o.nivel==="sigiloso"},r=new Set,a=async()=>{let n=await e.unidade?.obter(t.id)??await e.pessoal.obter(t.id);r=new Set(n&&n.removidoEm===void 0?(n.documentos??[]).map(i=>i.id):[])};a().then(()=>{V(document);let n=zr(document,o.documentos.map(i=>({id:i.id,numero:i.numero,titulo:i.titulo})),{marcado:i=>r.has(i),alternar:async i=>{await Rr(e,t,i),await a()}});for(let i of[e.unidade,e.pessoal])i?.aoMudar(()=>void a().then(()=>n.repintar()))})}})();
