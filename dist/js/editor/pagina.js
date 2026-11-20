/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function R(e,o){let r=e.defaultView?.DOMParser??globalThis.DOMParser,i=new r().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(i.body.childNodes).map(t=>e.importNode(t,!0))}function D(e,o){if(!e||typeof o!="function")return;let r=e,i=r.__seiProCtxBuilders;if(!i){let t=[];i=r.__seiProCtxBuilders=t,e.addEventListener("contextmenu",l=>{let u=l;if(u.shiftKey)return;let n=[];for(let a of t)try{n=n.concat(a(u.target)||[])}catch{}n.length&&(u.preventDefault(),We(e.ownerDocument,n,u.clientX,u.clientY))})}i.includes(o)||i.push(o)}function We(e,o,r,i){e.getElementById("seiProCtxMenu")?.remove();let t=e.createElement("div");t.id="seiProCtxMenu",t.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",t.style.left=`${r}px`,t.style.top=`${i}px`;for(let u of o){let n=e.createElement("div");n.textContent=u.label,n.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",n.addEventListener("mouseenter",()=>{n.style.background="#eef"}),n.addEventListener("mouseleave",()=>{n.style.background=""}),n.addEventListener("click",()=>{t.remove(),u.action()}),t.append(n)}e.body.append(t);let l=()=>{t.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function J(e,o,r){if(typeof r!="function")return;let i=e.__seiProCtx;if(!i){let t={acoes:{},construtores:[]};i=e.__seiProCtx=t;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let u=l?.$??null,n=null;for(let a of t.construtores){let c=[];try{c=a(u)||[]}catch{c=[]}for(let p of c){let m=`seiPro_${String(p.label).replace(/[^A-Za-z0-9]/g,"_")}`;t.acoes[m]=p.action,e.getCommand(m)||e.addCommand(m,{exec:()=>(t.acoes[m]?.(),!0)}),e.getMenuItem(m)||e.addMenuItem(m,{label:p.label,command:m,group:"seiProGroup"}),n=n??{},n[m]=o}}return n})}i.construtores.includes(r)||i.construtores.push(r)}var y=e=>e;function W(e){let o=()=>e.CKEDITOR,r=n=>!!n?.name&&o()?.instances[n.name]===n,i=n=>r(n)&&!n.readOnly,t=n=>y(n).document?.getBody()?.$??null,l=(n,a)=>{if(!n)return;let c=y(n);c.readOnly||a(c)},u={versao:4,getInstance(n){let a=o();if(!a?.instances)return null;if(i(a.currentInstance))return a.currentInstance;let c=n?.closest?.("div.cke"),p=c?a.instances[c.id.replace("cke_","")]:void 0;if(i(p))return p;if(i(e.oEditor))return e.oEditor;let m=Object.values(a.instances);return m.find(s=>i(s))??m[0]??null},getAllInstances:()=>Object.values(o()?.instances??{}),focus:n=>y(n).focus(),saveSnapshot:n=>y(n).fire("saveSnapshot"),withEdit(n,a){let c=y(n);c.focus(),c.fire("saveSnapshot");try{a()}finally{c.fire("saveSnapshot")}},insertHtml:(n,a)=>l(n,c=>c.insertHtml(a)),insertText:(n,a)=>l(n,c=>c.insertText(a)),getSelectionElement:n=>y(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return u.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,a,c){l(n,()=>a.before(...R(a.ownerDocument,c)))},getToolbarContainer:n=>y(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>t(n),findInBody(n,a){let c=t(n);return c?Array.from(c.querySelectorAll(a)):[]},appendToBody(n,a){l(n,c=>{let p=t(c);p&&p.append(...R(p.ownerDocument,a))})},transformBodyHtml(n,a){l(n,c=>{let p=t(c);if(!p)return;let m=p.innerHTML,s=a(m);typeof s=="string"&&s!==m&&p.replaceChildren(...R(p.ownerDocument,s))})},execCommand:(n,a,c)=>y(n).execCommand(a,c),applyStyle(n,a){let c=o()?.style;c&&y(n).applyStyle(new c(a))},getData:n=>y(n).getData(),setData:(n,a)=>l(n,c=>c.setData(a)),insertElement(n,a){l(n,c=>{let p=o()?.dom?.element.createFromHtml;p&&c.insertElement?c.insertElement(p(a,c.document)):c.insertHtml(a)})},saveSelection:n=>y(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,a){let c=y(n).getSelection();c&&a&&c.selectBookmarks(a)},getSelectedText:n=>y(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return y(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,a,c)=>y(n).on(a,c),off:(n,a,c)=>y(n).removeListener(a,c),fire:(n,a,c)=>y(n).fire(a,c),addContextMenu(n,a){let c=y(n),p=o();if(p&&c.contextMenu&&typeof c.addMenuItem=="function"){J(c,p.TRISTATE_OFF,a);return}D(t(n),a)},waitReady(n){return new Promise((a,c)=>{let p=Date.now(),m=()=>{let s=Object.values(o()?.instances??{}).find(d=>d.status==="ready");if(s)return a(s);if(Date.now()-p>n)return c(new Error("Timeout aguardando CKEditor 4"));setTimeout(m,100)};m()})},somenteLeitura:n=>!!y(n).readOnly};return u}var x=e=>e,Xe={strike:"strikethrough",strikethrough:"strikethrough"},Ye={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},Ze=0;function X(e){let o=e.document,r=s=>Array.from(s.model.document.roots??[]).filter(d=>d.isAttached()&&d.rootName!=="$graveyard"),i=s=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[s],t=(s,d)=>{let f=s.editing.view.document.getRoot(d);return f?s.editing.view.domConverter.mapViewToDom(f):null},l=s=>{for(let b of r(s))if(i(b.rootName)?.principal){let g=t(s,b.rootName);if(g)return g}let d=o.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return d||Array.from(o.querySelectorAll(".ck-editor__editable_inline")).reduce((b,g)=>g.childElementCount>(b?b.childElementCount:-1)?g:b,null)},u=s=>{let d=l(s);return d&&r(s).find(f=>t(s,f.rootName)===d)||null},n=s=>s.model.document.selection.getFirstPosition()?.root.rootName??null,a=s=>!!s&&!!i(s)?.somenteLeitura,c=(s,d)=>s.data.toModel(s.data.processor.toView(d)),p=(s,d)=>{let f=x(s);a(n(f))||f.model.change(()=>f.model.insertContent(c(f,d),f.model.document.selection))},m={versao:5,getInstance(){let s=o.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return s&&s.state==="ready"?s:null},getAllInstances(){let s=m.getInstance();return s?[s]:[]},focus:s=>x(s).focus(),saveSnapshot(){},withEdit(s,d){let f=x(s);f.focus(),f.model.change(()=>d())},insertHtml:p,insertText(s,d){let f=x(s);a(n(f))||f.model.change(b=>f.model.insertContent(b.createText(d)))},getSelectionElement(){let s=e.getSelection?.(),d=s&&s.rangeCount>0?s.anchorNode:null;return d?d.nodeType===1?d:d.parentElement:null},getSelectionParagraph:s=>m.getSelectionElement(s)?.closest("p")??null,insertHtmlBefore(s,d,f){let b=x(s),g=b.editing.view.domConverter.mapDomToView(d),v=g?b.editing.mapper.toModelElement(g):null;if(v){if(a(v.rootName))return;b.model.change(k=>b.model.insertContent(c(b,f),k.createPositionBefore(v)));return}p(s,f)},getToolbarContainer(s){let d=x(s).ui?.view?.toolbar?.element;return d?d.querySelector(".ck-toolbar__items")??d:null},getBodyContainer:s=>l(x(s)),findInBody(s,d){let f=l(x(s));return f?Array.from(f.querySelectorAll(d)):[]},appendToBody(s,d){let f=x(s),b=u(f);if(!b)return p(s,d);f.model.change(g=>f.model.insertContent(c(f,d),g.createPositionAt(b,"end")))},transformBodyHtml(s,d){let f=x(s),b=u(f);if(!b)return;let g=f.data.get({rootName:b.rootName,seiProInterno:!0}),v=d(g);if(typeof v!="string"||v===g)return;let k=f.model.document.selection.getFirstRange(),C=k&&k.start.root.rootName===k.end.root.rootName?{raiz:k.start.root,ps:[...k.start.path],pe:[...k.end.path]}:null,Je=f.model.document.selection.isBackward;f.data.set({[b.rootName]:v}),C&&f.model.change(B=>{let F,$;try{F=f.model.createPositionFromPath(C.raiz,C.ps),$=f.model.createPositionFromPath(C.raiz,C.pe)}catch{F=$=B.createPositionAt(C.raiz,"end")}B.setSelection(B.createRange(F,$),{backward:Je})})},execCommand(s,d,f){x(s).execute(Xe[d]??d,f!==void 0?{value:f}:void 0)},applyStyle(s,d){let f=Ye[d.element.toLowerCase()];f&&x(s).execute(f)},getData(s){let d=x(s),f=u(d);return f?d.data.get({rootName:f.rootName}):d.data.get()},setData(s,d){let f=x(s),b=u(f);b?f.data.set({[b.rootName]:d}):f.data.set(d)},insertElement:(s,d)=>m.insertHtml(s,d),saveSelection(s){let d=x(s),f=`spro-ed:${Ze++}`;return d.model.change(b=>{let g=d.model.document.selection.getFirstRange();g&&b.addMarker(f,{range:g,usingOperation:!1})}),f},restoreSelection(s,d){let f=x(s);if(typeof d!="string")return;let b=f.model.markers.get(d);b&&f.model.change(g=>g.setSelection(b.getRange())),f.model.change(g=>{f.model.markers.has(d)&&g.removeMarker(d)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let s=e.getSelection?.();if(!s||s.rangeCount===0)return"";let d=o.createElement("div");return d.append(s.getRangeAt(0).cloneContents()),d.innerHTML},on(s,d,f){if(d==="change")return x(s).model.document.on("change:data",f);l(x(s))?.addEventListener(d,f)},off(s,d,f){if(d==="change")return x(s).model.document.off("change:data",f);l(x(s))?.removeEventListener(d,f)},fire(s,d,f){l(x(s))?.dispatchEvent(new CustomEvent(d,{detail:f}))},addContextMenu(s,d){D(l(x(s)),d)},waitReady(s){return new Promise((d,f)=>{let b=Date.now(),g=()=>{let v=m.getInstance();if(v)return d(v);if(Date.now()-b>s)return f(new Error("Timeout aguardando CKEditor 5"));setTimeout(g,100)};g()})},somenteLeitura:s=>a(n(x(s)))};return m}function Q(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function Y(e){let o=null,r=()=>{if(o)return o;let l=Q(e);return l===5?o=X(e):l===4&&(o=W(e)),o},i=()=>{let l=r();if(!l)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return l},t=l=>((...u)=>i()[l](...u));return{get versao(){return r()?.versao??0},getInstance:l=>r()?.getInstance(l)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:t("focus"),saveSnapshot:t("saveSnapshot"),withEdit:t("withEdit"),insertHtml:t("insertHtml"),insertText:t("insertText"),getSelectionElement:t("getSelectionElement"),getSelectionParagraph:t("getSelectionParagraph"),insertHtmlBefore:t("insertHtmlBefore"),getToolbarContainer:t("getToolbarContainer"),getBodyContainer:t("getBodyContainer"),findInBody:t("findInBody"),appendToBody:t("appendToBody"),transformBodyHtml:t("transformBodyHtml"),execCommand:t("execCommand"),applyStyle:t("applyStyle"),getData:t("getData"),setData:t("setData"),insertElement:t("insertElement"),saveSelection:t("saveSelection"),restoreSelection:t("restoreSelection"),getSelectedText:t("getSelectedText"),getSelectedHtml:t("getSelectedHtml"),on:t("on"),off:t("off"),fire:t("fire"),addContextMenu:t("addContextMenu"),somenteLeitura:t("somenteLeitura"),waitReady(l){let u=Date.now();return new Promise((n,a)=>{let c=()=>{let p=r();if(p)return p.waitReady(Math.max(1,l-(Date.now()-u))).then(n,a);if(Date.now()-u>l)return a(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(c,100)};c()})}}}var Z="data-base";function ee(e,o){let r=e;if(typeof e=="string"){if(!e.trim())return;try{r=JSON.parse(e)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(t=>t?.configGeral).find(Array.isArray)?.find(t=>t?.name===o)?.value}function oe(e,o){let r=ee(e,o);return!(r===!1||r===0||r==="")}function te(e,o){let r=ee(e,o);return r===!0||r===1||r==="1"}function re(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function ne(e,o=localStorage){return oe(re(o),e)}function ae(e,o=localStorage){return te(re(o),e)}var se=`/*
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
`;function h(e,o={},...r){let i=document.createElement(e);for(let[t,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?i.addEventListener(t.replace(/^on/,""),l):l===!0?i.setAttribute(t,""):t==="class"?i.className=l:t==="value"&&e==="textarea"?i.value=l:i.setAttribute(t,l));for(let t of r)t!=null&&t!==!1&&i.append(t);return i}var E={fill:"currentColor",stroke:"none"},ie="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",le={estrela:[["path",{d:ie}]],estrelaCheia:[["path",{d:ie,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...E}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...E}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...E}],["circle",{cx:"12",cy:"12",r:"1.4",...E}],["circle",{cx:"19",cy:"12",r:"1.4",...E}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...E}],["circle",{cx:"15",cy:"6",r:"1.3",...E}],["circle",{cx:"9",cy:"12",r:"1.3",...E}],["circle",{cx:"15",cy:"12",r:"1.3",...E}],["circle",{cx:"9",cy:"18",r:"1.3",...E}],["circle",{cx:"15",cy:"18",r:"1.3",...E}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Yo=Object.keys(le);function T(e,o=18,r=document){let i="http://www.w3.org/2000/svg",t=r.createElementNS(i,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[u,n]of Object.entries(l))t.setAttribute(u,n);for(let[u,n]of le[e]){let a=r.createElementNS(i,u);for(let[c,p]of Object.entries(n))a.setAttribute(c,p);t.append(a)}return t}var oo=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function ce(e={}){return({titulo:o,conteudo:r,icone:i,aoFechar:t})=>{let l=h("dialog",{class:"spro-dialogo","aria-label":o}),u=()=>{l.open&&l.close()};return l.append(h("header",{},i?h("span",{class:"spro-dialogo-icone","aria-hidden":"true"},T(i,18)):null,h("h2",{},o),h("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:u},T("fechar",16))),h("div",{class:"spro-dialogo-corpo"},r)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),t?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(oo)?.focus({preventScroll:!0}),{fechar:u}}}function de(e){let o=ce();return(r,i)=>{if(!r.querySelector('style[data-seipro-editor="base"]')){let t=r.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=e,(r.head??r.documentElement).append(t)}return o(i)}}var pe="";function j(e){pe=e}var q=(e,o)=>de(pe)(e,o);function to(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function ue(e){let o=[...e.querySelectorAll("dialog[open]")],r=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:o.at(-1))??e.body??e.documentElement}function me(e,o,r,i,t){let l=e.body??e.documentElement;for(let m of[l,...e.querySelectorAll("dialog")])for(let s of[...m.children])s.classList.contains("spro-aviso")&&s.remove();let u=h("div",{class:"spro-aviso",role:"status"},T("check",16),h("span",{},o),...to(r).map(m=>h("button",{type:"button",onclick:()=>{u.remove(),m.fazer()}},m.rotulo)));u.setAttribute("popover","manual");let n=()=>{try{u.showPopover?.()}catch{}},a=Date.now()+i,c=()=>{let m=ue(e);m.append(u),n(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!p||!m.contains(u))){if(t&&ue(e).localName!=="dialog"&&t(o,r,Math.max(0,a-Date.now()))){p=!1,u.remove();return}c()}},{once:!0})},p=!0;return c(),setTimeout(()=>{p=!1,u.remove()},i),u}function M(e,o){me(e,o,void 0,7e3)}j(se);function H(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function P(e){e.style.display="none"}var fe=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function ge(e){let o=()=>e.adaptador.versao===5,r=(i,t)=>{let l=i.editing.view.domConverter.mapDomToView(t);return l?i.editing.mapper.toModelElement(l):null};return{selecionados(i){let t=()=>{let d=e.adaptador.getSelectionParagraph(i);return d?[d]:[]};if(o()){let d=i,b=[...d.model.document.selection.getSelectedBlocks()].map(g=>{let v=d.editing.mapper.toViewElement(g);return v?d.editing.view.domConverter.mapViewToDom(v):null}).filter(g=>!!g&&g.tagName==="P");return b.length?b:t()}let u=e.adaptador.getBodyContainer(i)?.ownerDocument?.getSelection?.();if(!u||u.rangeCount===0||!u.anchorNode)return t();let n=fe(u.anchorNode),a=fe(u.focusNode);if(!n&&!a||(n=n??a,a=a??n,!n||!a))return t();if(n===a)return[n];let c=n,p=a;n.compareDocumentPosition(a)&2&&(c=a,p=n);let m=[],s=c;for(let d=0;s&&d<5e3&&(s.tagName.toLowerCase()==="p"&&m.push(s),s!==p);d+=1)s=s.nextElementSibling;return m.length?m:[c]},classeDeEstilo(i,t){return o()?r(i,t)?.getAttribute("estilo")??"":t.getAttribute("class")??""},definirClasse(i,t,l){if(o()){let u=i,n=r(u,t);n&&u.model.change(a=>a.setAttribute("estilo",l,n));return}t.removeAttribute("style"),t.setAttribute("class",l)},definirTextAlign(i,t,l){if(o()){e.win.SeiProGhs?.setEstilos(t,{"text-align":l},i);return}t.removeAttribute("style"),t.style.textAlign=l}}}var ro=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function no(e,o){let r=ro.find(i=>Object.values(i).includes(e));return r?r[o]:null}function ao(e,o){let r=e?.closest(".cke_top")?.querySelector(".divAlignText");if(r)return r;for(let i=e?.parentElement??null;i;i=i.parentElement){let t=i.querySelector(".divAlignText");if(t)return t}return o.querySelector(".divAlignText")}var be={id:"align",globais(e){let o=ge(e);return{setAlignText(r,i){let t=e.adaptador.getInstance(r);if(!t||e.adaptador.somenteLeitura(t))return;let l=o.selecionados(t);l.length&&e.adaptador.withEdit(t,()=>{for(let u of l){let n=no(o.classeDeEstilo(t,u),i);n?o.definirClasse(t,u,n):o.definirTextAlign(t,u,i)}})},openAlignText(r){if(!r)return;let i=ao(r,e.doc);r.classList.contains("cke_button_on")?(r.classList.replace("cke_button_on","cke_button_off"),i&&P(i)):(r.classList.remove("cke_button_off"),r.classList.add("cke_button_on"),i&&H(i))},closeAlignText(){for(let r of e.doc.querySelectorAll(".getAlignButtom"))r.classList.remove("cke_button_on"),r.classList.add("cke_button_off");for(let r of e.doc.querySelectorAll(".divAlignText"))r.style.display="none"}}}};var so=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),he=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function io(e){let o=0,r=e.split("");return r.forEach((i,t)=>{let l=he.get(i),u=he.get(r[t+1]);o+=l<u?-l:l}),o}function ve(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,r)=>o===""?o:so.has(o.toLowerCase())&&r!==0?o.toLowerCase():io(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var xe={id:"cap-letter",globais:e=>({convertFirstLetter(o){let r=e.adaptador.getInstance(o);if(!r)return;let i=e.adaptador.getSelectedText(r);if(!i||i.trim()===""){M(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(r,A(ve(i)))}})};var ye="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function ke(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let r="";for(let i of o)r+=ye[i%ye.length];return r}var lo=()=>`<span class="ancoraSei checkboxSEI" data-id="${ke(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,we={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let r=e.adaptador.getInstance(o);r&&e.adaptador.withEdit(r,()=>e.adaptador.insertHtml(r,lo()))}})};var G="spro_editor_folha",Ee="seipro-folha-editor",V="data-spro-folha-editor",co=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function po(e){let o=`html[${V}]`,r=e?"#141619":"#f3f4f7",i=e?"#2a2d33":"#e3e6ee",t="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${t}, -14px 0 24px -14px ${t}`,u=`0 14px 24px -14px ${t}`,n=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${r} !important; }
${o} #divEditores { padding-bottom: 28px; }
${n} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${i}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${n}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${n}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${u}; clip-path: inset(0 -30px -30px); }
${n}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${n} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${r}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${i} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function Me(e,o){if(!e.head||(e.querySelector(`style[data-style="${Ee}"]`)?.remove(),!o))return;let r=e.createElement("style");r.setAttribute("data-style",Ee),r.textContent=o,e.head.append(r)}function Ae(e,o){if(!e?.style)return;let r=e.getAttribute("data-spro-folha-bg");if(o)r===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(r!==null){let[i,t]=r.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),i&&e.style.setProperty("background-color",i,t||"")}}var Ce={id:"folha-papel",globais(e){let o=e.doc,r=()=>!!e.win.localStorage?.getItem(G),i=()=>!!e.win.localStorage?.getItem("darkModePro"),t=!1;function l(a){for(let c of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let p=c.contentDocument;p?.head&&(Me(p,a?co:null),Ae(p.documentElement,a),Ae(p.body,a))}}function u(a){let c=[...o.querySelectorAll(".cke_contents")];c.forEach((p,m)=>{if(!a){p.removeAttribute("data-spro-folha");return}let s=[m===0?"primeira":"",m===c.length-1?"ultima":""].filter(Boolean);p.setAttribute("data-spro-folha",s.join(" ")||"meio")})}function n(a){Me(o,a?po(i()):null),l(a),u(a),a?o.documentElement.setAttribute(V,""):o.documentElement.removeAttribute(V);for(let c of o.querySelectorAll(".getPaperViewButtom"))c.classList.toggle("cke_button_on",a),c.classList.toggle("cke_button_off",!a),c.setAttribute("aria-pressed",a?"true":"false")}return{aplicarFolhaEditorPro:n,getPaperViewButtom(a){let c=!r();c?e.win.localStorage.setItem(G,"1"):e.win.localStorage.removeItem(G),n(c)},initFolhaEditorPro(){let a=e.win.CKEDITOR;if(typeof a?.on=="function"&&!t){t=!0;let c=p=>p.on("contentDom",()=>r()&&l(!0));for(let p of Object.values(a.instances??{}))c(p);a.on("instanceReady",p=>c(p.editor))}n(r())}}}};function uo(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var Se={id:"font-size",globais:e=>({changeFontSize(o,r){let i=e.adaptador.getInstance(o);if(!i)return;let t=e.adaptador.getSelectedHtml(i);if(!t||t.trim()===""){M(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=uo(e.adaptador.getSelectionElement(i)),u=r==="up"?l+2:l-2;u>7&&u<70&&e.adaptador.withEdit(i,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(i,{element:"span",attributes:{style:`font-size: ${u}px`}}):e.adaptador.insertHtml(i,`<span style="font-size: ${u}px">${t}</span>`)})}})};var z=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,mo=[{name:z,attributes:!0},{name:z,classes:!0},{name:z,styles:!0}],L=e=>e.split("").join("[\\t\\n\\r]*"),fo=new RegExp(`^[\\s\\x00-\\x20]*(${L("javascript")}|${L("vbscript")}|${L("livescript")}|${L("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${L("text/html")})`,"i"),go=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:fo}]}];function S(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function I(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var bo=e=>!!(e?.model&&e.editing&&e.conversion),ho=e=>I(e,"EstiloEditing")?.estilos??{},Te=(e,o)=>Object.hasOwn(e,o);function Ie(e,o){let r=I(e,"GeneralHtmlSupport");if(typeof r?.getGhsAttributeNameForElement=="function")try{return r.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function vo(e,o){let r=e?.getAttribute?.(o)?.classes;return r?Array.isArray(r)?[...r]:Object.keys(r):[]}function xo(e,o,r){if(!o?.is?.("element"))return;let i=r.mapper.toViewElement(o);if(!i)return;let t=ho(e),l=o.getAttribute("estilo"),u=vo(o,Ie(e,"p")),n=r.writer,a=[];try{a=Array.from(i.getClassNames())}catch{}for(let c of a)c!==l&&Te(t,c)&&n.removeClass(c,i);for(let c of u)Te(t,c)||n.addClass(c,i);l&&n.addClass(l,i)}function yo(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Ie(e,"p")}:paragraph`];e.conversion.for("downcast").add(r=>{for(let i of o)r.on(i,(t,l,u)=>{try{xo(e,l.item,u)}catch{}},{priority:"lowest"})})}function ko(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function qe(e,o){let r=I(o,"Salvar"),i=r?!!r.isDirty:!1;try{e()}finally{if(r&&!i)try{r.resetDirty()}catch{}}}function wo(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function Eo(e,o){let r=e.getFullData({seiProInterno:!0}),i=o.INFRA_EDITOR_CONFIG?.initialData;return!i||typeof i!="object"||wo(e)?r:Object.fromEntries(Object.keys(r).map(t=>[t,typeof i[t]=="string"?i[t]:r[t]]))}function Mo(e,o,r){try{let i=r??e.adaptador.getSelectionParagraph(o);if(!i)return null;if(typeof i.is=="function"&&i.is("element"))return i;let t=i.jquery?i.get(0):i;if(t?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(t);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function Ao(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function Le(e){let o=l=>l??e.adaptador.getInstance();function r(l){let u=o(l);if(!bo(u))return!1;if(u.__seiProGhsLiberado)return!0;let n=I(u,"DataFilter");if(!n)return S("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{n.allowElement({name:z,attributes:!0,classes:!0,styles:!0});for(let a of mo)n.allowAttributes(a);if(typeof n.disallowAttributes=="function")for(let a of go)n.disallowAttributes(a)}catch(a){return S("falha ao liberar o GHS",a),!1}return u.__seiProGhsLiberado=!0,yo(u),!0}function i(l){let u=o(l);if(!r(u)||typeof u.getFullData!="function")return!1;let n=!0;return qe(()=>{try{u.data.set(Eo(u,e.win))}catch(a){S("falha ao reprocessar o conteudo",a),n=!1}},u),n}function t(l,u,n){let a=o(l);if(!r(a))return!1;let c=I(a,"GeneralHtmlSupport"),p=Mo(e,a,u),m=p?Ao(a,p):null;if(!c||!p||!m)return!1;try{return n(c,m,p),!0}catch(s){return S("falha ao aplicar no model",s),!1}}return{liberar:r,aplicarRegras:i,semSujar:(l,u)=>qe(l,o(u)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,u,n)=>t(n,l,(a,c,p)=>a.addModelHtmlClass(c,u,p)),removeClasse:(l,u,n)=>t(n,l,(a,c,p)=>a.removeModelHtmlClass(c,u,p)),setEstilos:(l,u,n)=>t(n,l,(a,c,p)=>a.setModelHtmlStyles(c,u,p)),setAtributos:(l,u,n)=>t(n,l,(a,c,p)=>a.setModelHtmlAttributes(c,u,p))}}var _e={id:"ghs-unlock",globais:e=>({SeiProGhs:Le(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=Le(e),r=e.adaptador.getInstance();if(!(!r||!o.liberar(r))){if(e.win.SEIPRO_GHS_AUTO===!1||ko(r)){S("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(r)&&S("classes, estilos e atributos liberados no editor")}}};function O(...e){return h("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function _(e,o){return o.classList.add("spro-campo"),o.style.width="100%",h("label",{style:"display:grid;gap:4px;font-size:13px;"},h("span",{},e),o)}function Re(e,o){return new Promise((r,i)=>{let t=new e.Image;t.crossOrigin="anonymous",t.onload=()=>{try{let l=e.document.createElement("canvas");l.width=t.width,l.height=t.height,l.getContext("2d")?.drawImage(t,0,0),r(l.toDataURL("image/png"))}catch(l){i(l)}},t.onerror=()=>i(new Error("imagem nao carregou")),t.src=o})}var Co="https://latex.codecogs.com/png.latex?",So="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",To="https://editor.codecogs.com/",De={id:"latex",globais(e){let o=null,r=e.imagemParaDataUri??(a=>Re(e.win,a)),i=a=>M(e.doc,a);function t(){let a=o;if(!a)return;let c=a.texto.value;a.geracao+=1;let p=a.geracao;if(a.previa.replaceChildren(),a.pronta=!1,a.falhou=!1,c==="")return;let m=h("img",{src:`${Co}${encodeURI(c)}`});a.previa.append(m),r(m.getAttribute("src")??"").then(s=>{o!==a||a.geracao!==p||(m.setAttribute("src",s),m.className="img-base64",a.pronta=!0)},()=>{o===a&&a.geracao===p&&(a.falhou=!0)})}function l(){let a=o;if(!a)return!1;let c=a.texto.value;if(c==="")return i("Digite a equa\xE7\xE3o"),!1;if(a.falhou)return i("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let p=a.previa.querySelector("img");if(!a.pronta||!p)return i("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let m=e.adaptador.getInstance();if(!m)return!1;let s=`<img class="img-base64" src="${A(p.getAttribute("src")??"")}" alt="${A(c)}">`;return e.adaptador.withEdit(m,()=>e.adaptador.insertHtml(m,s)),!0}function u(a){if(!e.adaptador.getInstance(a))return;let c=h("textarea",{id:"MathText",rows:"5"});c.addEventListener("input",t);let p=h("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),m=q(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:O(_("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",c),p,h("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",h("a",{href:So,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",h("a",{href:To,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&m.fechar()}},"Inserir")))});o={texto:c,previa:p,geracao:0,pronta:!1,falhou:!1};let s=String(e.win.getSelection?.()??"").trim();s!==""&&(c.value=s,t())}function n(){}return{updatePreviewLatex:t,openDialogLatex:u,getDialogLatex:n}}};function N(e,o,r){let i=e.adaptador.getInstance(o);if(!i)return;let t=e.adaptador.getSelectionParagraph(i);t&&e.adaptador.withEdit(i,()=>e.adaptador.insertHtmlBefore(i,t,r))}var qo='<div class="pageBreakPro" style="page-break-after: always"></div>',He={id:"page-break",globais:e=>({getPageBreak:o=>N(e,o,qo)})};var Pe=5,ze=5,Oe=49,w=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function Lo(e,o){let r=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(r)return r;let i=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(i)return i;for(let t=e?.previousElementSibling??null;t;t=t.previousElementSibling)if(t.classList.contains("divQuickTable"))return t;return o.querySelector(".divQuickTable")}var Ne={id:"quick-table",globais(e){let o=e.adaptador;function r(){for(let p of e.doc.querySelectorAll(".divQuickTable"))p.replaceChildren(),P(p);for(let p of e.doc.querySelectorAll(".getQuickTableButtom"))p.classList.add("cke_button_off"),p.classList.remove("cke_button_on")}function i(p){if(!p)return;let m=w(p,"data-row"),s=w(p,"data-col"),d=p.closest("table");if(!d)return;for(let g of d.querySelectorAll("td"))g.classList.remove("td_hover");let f=()=>[...d.querySelectorAll("tr")];if(m>=3&&w(f().at(-1)?.querySelector("td"),"data-row")>m+1&&(f().at(-1)?.remove(),d.setAttribute("data-row",String(w(d,"data-row")-1))),s>=3&&w(f().at(-1)?.lastElementChild,"data-col")>s+1){for(let g of f())g.lastElementChild?.remove();d.setAttribute("data-col",String(w(d,"data-col")-1))}for(let g of d.querySelectorAll("td"))w(g,"data-row")<=m&&w(g,"data-col")<=s&&g.classList.add("td_hover");let b=p.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(b&&(b.textContent=`Tabela ${m+1}x${s+1}`),m===w(d,"data-row")&&m<Oe){let g=f().at(-1)?.cloneNode(!0);g&&(g.querySelectorAll("td").forEach((v,k)=>{v.setAttribute("data-row",String(m+1)),v.setAttribute("data-col",String(k)),v.classList.remove("td_hover")}),(d.querySelector("tbody")??d).append(g),d.setAttribute("data-row",String(m+1)))}if(s===w(d,"data-col")&&s<Oe){for(let g of f()){let v=g.lastElementChild?.cloneNode(!0);v&&(v.setAttribute("data-col",String(s+1)),v.classList.remove("td_hover"),g.append(v))}d.setAttribute("data-col",String(s+1))}}function t(){let p=e.doc,m=p.createDocumentFragment(),s=p.createElement("div");s.className="quickTableInfo",s.textContent="Inserir Tabela";let d=p.createElement("table");d.setAttribute("data-row",String(Pe-1)),d.setAttribute("data-col",String(ze-1));for(let b=0;b<Pe;b+=1){let g=p.createElement("tr");for(let v=0;v<ze;v+=1){let k=p.createElement("td");k.setAttribute("data-row",String(b)),k.setAttribute("data-col",String(v)),g.append(k)}d.append(g)}let f=b=>i(b.target?.closest("td")??null);return d.addEventListener("mouseover",f),d.addEventListener("mouseout",f),d.addEventListener("click",b=>{let g=b.target?.closest("td");g&&c(g)}),m.append(s,d),m}function l(p){if(!p)return;let m=Lo(p,e.doc);p.classList.contains("cke_button_on")?(r(),p.classList.add("cke_button_off"),p.classList.remove("cke_button_on")):(m&&(m.replaceChildren(t()),H(m)),p.classList.remove("cke_button_off"),p.classList.add("cke_button_on"))}function u(p){let m=p?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),s=m?[...m.querySelectorAll(".getTablestylesButtom")]:[];s.length||(s=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let d of s)d.classList.remove("cke_button_disabled")}function n(p,m){let s='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';s+="  <tbody>";for(let d=0;d<=p;d+=1){s+="      <tr>";for(let f=0;f<=m;f+=1)s+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';s+="      </tr>"}return`${s}  </tbody></table>`}function a(p,m){let s=m?m.nextElementSibling:o.getBodyContainer(p)?.lastElementChild,d=s?.tagName==="TABLE"?s.querySelector("td p"):null;if(!d)return;let f=d.ownerDocument,b=f.defaultView?.getSelection?.();if(!b)return;let g=f.createRange();g.setStart(d.firstChild??d,0),g.collapse(!0),b.removeAllRanges(),b.addRange(g)}function c(p){let m=o.getInstance(p);if(!m){r();return}let s=n(w(p,"data-row"),w(p,"data-col")),d=o.getSelectionParagraph(m);o.withEdit(m,()=>{if(!d)return o.insertHtml(m,s);let f=d.nextElementSibling;f?o.insertHtmlBefore(m,f,s):o.appendToBody(m,s)}),r(),u(p),a(m,d)}return{getQuickTable:l,quickTableOver:i,hideQuickTable:r,quickTableClick:c}}};var Io='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Be={id:"session-break",globais:e=>({getSessionBreak:o=>N(e,o,Io)})};var Fe=["seiSlim","seiSlim_parent","seiSlim_view"],$e={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],r=t=>{for(let l of o())l.classList.add(t?"cke_button_on":"cke_button_off"),l.classList.remove(t?"cke_button_off":"cke_button_on")};function i(t){if(t==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...Fe)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...Fe)}return{getBoxStyleEditor(t){e.win.localStorage.getItem("seiSlim_editor")?(r(!1),i("remove")):(r(!0),i("set"))},updateStyleEditor:i}}};function U(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var Qe=/^[0-9A-Za-z-]+$/,_o="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Ro=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,je={id:"tiny-url",globais(e){let o=l=>M(e.doc,l),r=l=>(e.fetch??e.win.fetch.bind(e.win))(l);async function i(l,u,n){let a=new URLSearchParams({url:l});u!==""&&a.set("alias",u);let c;try{c=await r(`https://tinyurl.com/api-create.php?${a}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(c.status===400)return o("Erro: Nenhuma link gerado"),!1;if(c.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let p=(await c.text()).trim();if(c.status!==200||!Ro.test(p))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(p),!0;let m=e.adaptador.getInstance();if(!m)return!1;let s=`<a href="${A(p)}" class="ancoraSei" target="_blank">${A(p)}</a>`;return e.adaptador.withEdit(m,()=>e.adaptador.insertHtml(m,s)),!0}function t(l){if(!e.adaptador.getInstance(l))return;let u=h("input",{type:"text",id:"urlTiny"}),n=h("input",{type:"text",id:"aliasTiny"}),a=h("div",{id:"tinyResult"}),c=String(e.win.getSelection?.()??"").trim();c!==""&&U(c)&&(u.value=c),n.addEventListener("input",()=>{a.replaceChildren();let m=n.value;m!==""&&(Qe.test(m)?a.append(`Resultado: https://tinyurl.com/${m}`):a.append(h("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let p=q(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:O(_("Insira o link que deseja encurtar:",u),_("Insira um Nome Personalizado para o link (opcional):",n),a,h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let m=u.value.trim(),s=n.value.trim();if(m===""||!U(m))return o("Digite um link v\xE1lido!");if(s!==""&&!Qe.test(s))return o(_o);if(s!==""&&s.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await i(m,s,"insert")&&p.fechar()}},"Inserir")))})}return{getTinyUrl:t,ajaxTinyUrl:i}}};var K=[_e,He,Be,we,xe,be,Se,$e,Ne,Ce,je,De];function Ge(e,o,r){let i=e,t=[],l=[];for(let u of o){let n=!0;try{for(let[a,c]of Object.entries(u.globais(r))){if(i[a]!==void 0){n=!1,l.push({id:u.id,erro:new Error(`global ja definido: ${a}`)});continue}i[a]=c}}catch(a){n=!1,l.push({id:u.id,erro:a})}n&&t.push(u.id);try{i.SeiProEditorAdapter?.registerFeature?.({id:u.id})}catch{}}return{instalados:t,falhas:l}}function Ve(e,o){let r=[];for(let i of e)try{i.iniciar?.(o)}catch(t){r.push({id:i.id,erro:t})}return r}var Ue="__seiProEditorTs",Ke=window;if(!Ke[Ue]){Ke[Ue]=!0;let e=Y(window),o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(Z)??"",checkOpcao:r=>ne(r),verifyOpcao:r=>ae(r)};for(let r of Ge(window,K,o).falhas)console.warn(`[SEIPro] recurso ${r.id} nao instalado:`,r.erro);e.waitReady(2e4).then(()=>{for(let r of Ve(K,o))console.warn(`[SEIPro] recurso ${r.id} falhou ao iniciar:`,r.erro)}).catch(r=>console.warn("[SEIPro] editor nao detectado:",r))}})();
