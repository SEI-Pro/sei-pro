/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function _(o,e){let t=o.defaultView?.DOMParser??globalThis.DOMParser,s=new t().parseFromString(`<!doctype html><html><body>${e}</body></html>`,"text/html");return Array.from(s.body.childNodes).map(r=>o.importNode(r,!0))}function I(o,e){if(!o||typeof e!="function")return;let t=o,s=t.__seiProCtxBuilders;if(!s){let r=[];s=t.__seiProCtxBuilders=r,o.addEventListener("contextmenu",l=>{let u=l;if(u.shiftKey)return;let n=[];for(let i of r)try{n=n.concat(i(u.target)||[])}catch{}n.length&&(u.preventDefault(),Jo(o.ownerDocument,n,u.clientX,u.clientY))})}s.includes(e)||s.push(e)}function Jo(o,e,t,s){o.getElementById("seiProCtxMenu")?.remove();let r=o.createElement("div");r.id="seiProCtxMenu",r.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",r.style.left=`${t}px`,r.style.top=`${s}px`;for(let u of e){let n=o.createElement("div");n.textContent=u.label,n.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",n.addEventListener("mouseenter",()=>{n.style.background="#eef"}),n.addEventListener("mouseleave",()=>{n.style.background=""}),n.addEventListener("click",()=>{r.remove(),u.action()}),r.append(n)}o.body.append(r);let l=()=>{r.remove(),o.removeEventListener("mousedown",l)};setTimeout(()=>o.addEventListener("mousedown",l),0)}function K(o,e,t){if(typeof t!="function")return;let s=o.__seiProCtx;if(!s){let r={acoes:{},construtores:[]};s=o.__seiProCtx=r;try{o.addMenuGroup("seiProGroup",5)}catch{}o.contextMenu.addListener(l=>{let u=l?.$??null,n=null;for(let i of r.construtores){let d=[];try{d=i(u)||[]}catch{d=[]}for(let p of d){let f=`seiPro_${String(p.label).replace(/[^A-Za-z0-9]/g,"_")}`;r.acoes[f]=p.action,o.getCommand(f)||o.addCommand(f,{exec:()=>(r.acoes[f]?.(),!0)}),o.getMenuItem(f)||o.addMenuItem(f,{label:p.label,command:f,group:"seiProGroup"}),n=n??{},n[f]=e}}return n})}s.construtores.includes(t)||s.construtores.push(t)}var y=o=>o;function J(o){let e=()=>o.CKEDITOR,t=n=>!!n?.name&&e()?.instances[n.name]===n,s=n=>t(n)&&!n.readOnly,r=n=>y(n).document?.getBody()?.$??null,l=(n,i)=>{if(!n)return;let d=y(n);d.readOnly||i(d)},u={versao:4,getInstance(n){let i=e();if(!i?.instances)return null;if(s(i.currentInstance))return i.currentInstance;let d=n?.closest?.("div.cke"),p=d?i.instances[d.id.replace("cke_","")]:void 0;if(s(p))return p;if(s(o.oEditor))return o.oEditor;let f=Object.values(i.instances);return f.find(a=>s(a))??f[0]??null},getAllInstances:()=>Object.values(e()?.instances??{}),focus:n=>y(n).focus(),saveSnapshot:n=>y(n).fire("saveSnapshot"),withEdit(n,i){let d=y(n);d.focus(),d.fire("saveSnapshot");try{i()}finally{d.fire("saveSnapshot")}},insertHtml:(n,i)=>l(n,d=>d.insertHtml(i)),insertText:(n,i)=>l(n,d=>d.insertText(i)),getSelectionElement:n=>y(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return u.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,i,d){l(n,()=>i.before(..._(i.ownerDocument,d)))},getToolbarContainer:n=>y(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>r(n),findInBody(n,i){let d=r(n);return d?Array.from(d.querySelectorAll(i)):[]},appendToBody(n,i){l(n,d=>{let p=r(d);p&&p.append(..._(p.ownerDocument,i))})},transformBodyHtml(n,i){l(n,d=>{let p=r(d);if(!p)return;let f=p.innerHTML,a=i(f);typeof a=="string"&&a!==f&&p.replaceChildren(..._(p.ownerDocument,a))})},execCommand:(n,i,d)=>y(n).execCommand(i,d),applyStyle(n,i){let d=e()?.style;d&&y(n).applyStyle(new d(i))},getData:n=>y(n).getData(),setData:(n,i)=>l(n,d=>d.setData(i)),insertElement(n,i){l(n,d=>{let p=e()?.dom?.element.createFromHtml;p&&d.insertElement?d.insertElement(p(i,d.document)):d.insertHtml(i)})},saveSelection:n=>y(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,i){let d=y(n).getSelection();d&&i&&d.selectBookmarks(i)},getSelectedText:n=>y(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return y(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,i,d)=>y(n).on(i,d),off:(n,i,d)=>y(n).removeListener(i,d),fire:(n,i,d)=>y(n).fire(i,d),addContextMenu(n,i){let d=y(n),p=e();if(p&&d.contextMenu&&typeof d.addMenuItem=="function"){K(d,p.TRISTATE_OFF,i);return}I(r(n),i)},waitReady(n){return new Promise((i,d)=>{let p=Date.now(),f=()=>{let a=Object.values(e()?.instances??{}).find(c=>c.status==="ready");if(a)return i(a);if(Date.now()-p>n)return d(new Error("Timeout aguardando CKEditor 4"));setTimeout(f,100)};f()})},somenteLeitura:n=>!!y(n).readOnly};return u}var v=o=>o,Wo={strike:"strikethrough",strikethrough:"strikethrough"},Xo={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},Yo=0;function W(o){let e=o.document,t=a=>Array.from(a.model.document.roots??[]).filter(c=>c.isAttached()&&c.rootName!=="$graveyard"),s=a=>o.INFRA_EDITOR_CONFIG?.rootsAttributes?.[a],r=(a,c)=>{let m=a.editing.view.document.getRoot(c);return m?a.editing.view.domConverter.mapViewToDom(m):null},l=a=>{for(let b of t(a))if(s(b.rootName)?.principal){let g=r(a,b.rootName);if(g)return g}let c=e.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return c||Array.from(e.querySelectorAll(".ck-editor__editable_inline")).reduce((b,g)=>g.childElementCount>(b?b.childElementCount:-1)?g:b,null)},u=a=>{let c=l(a);return c&&t(a).find(m=>r(a,m.rootName)===c)||null},n=a=>a.model.document.selection.getFirstPosition()?.root.rootName??null,i=a=>!!a&&!!s(a)?.somenteLeitura,d=(a,c)=>a.data.toModel(a.data.processor.toView(c)),p=(a,c)=>{let m=v(a);i(n(m))||m.model.change(()=>m.model.insertContent(d(m,c),m.model.document.selection))},f={versao:5,getInstance(){let a=e.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return a&&a.state==="ready"?a:null},getAllInstances(){let a=f.getInstance();return a?[a]:[]},focus:a=>v(a).focus(),saveSnapshot(){},withEdit(a,c){let m=v(a);m.focus(),m.model.change(()=>c())},insertHtml:p,insertText(a,c){let m=v(a);i(n(m))||m.model.change(b=>m.model.insertContent(b.createText(c)))},getSelectionElement(){let a=o.getSelection?.(),c=a&&a.rangeCount>0?a.anchorNode:null;return c?c.nodeType===1?c:c.parentElement:null},getSelectionParagraph:a=>f.getSelectionElement(a)?.closest("p")??null,insertHtmlBefore(a,c,m){let b=v(a),g=b.editing.view.domConverter.mapDomToView(c),h=g?b.editing.mapper.toModelElement(g):null;if(h){if(i(h.rootName))return;b.model.change(k=>b.model.insertContent(d(b,m),k.createPositionBefore(h)));return}p(a,m)},getToolbarContainer(a){let c=v(a).ui?.view?.toolbar?.element;return c?c.querySelector(".ck-toolbar__items")??c:null},getBodyContainer:a=>l(v(a)),findInBody(a,c){let m=l(v(a));return m?Array.from(m.querySelectorAll(c)):[]},appendToBody(a,c){let m=v(a),b=u(m);if(!b)return p(a,c);m.model.change(g=>m.model.insertContent(d(m,c),g.createPositionAt(b,"end")))},transformBodyHtml(a,c){let m=v(a),b=u(m);if(!b)return;let g=m.data.get({rootName:b.rootName,seiProInterno:!0}),h=c(g);if(typeof h!="string"||h===g)return;let k=m.model.document.selection.getFirstRange(),C=k&&k.start.root.rootName===k.end.root.rootName?{raiz:k.start.root,ps:[...k.start.path],pe:[...k.end.path]}:null,Ko=m.model.document.selection.isBackward;m.data.set({[b.rootName]:h}),C&&m.model.change(z=>{let O,N;try{O=m.model.createPositionFromPath(C.raiz,C.ps),N=m.model.createPositionFromPath(C.raiz,C.pe)}catch{O=N=z.createPositionAt(C.raiz,"end")}z.setSelection(z.createRange(O,N),{backward:Ko})})},execCommand(a,c,m){v(a).execute(Wo[c]??c,m!==void 0?{value:m}:void 0)},applyStyle(a,c){let m=Xo[c.element.toLowerCase()];m&&v(a).execute(m)},getData(a){let c=v(a),m=u(c);return m?c.data.get({rootName:m.rootName}):c.data.get()},setData(a,c){let m=v(a),b=u(m);b?m.data.set({[b.rootName]:c}):m.data.set(c)},insertElement:(a,c)=>f.insertHtml(a,c),saveSelection(a){let c=v(a),m=`spro-ed:${Yo++}`;return c.model.change(b=>{let g=c.model.document.selection.getFirstRange();g&&b.addMarker(m,{range:g,usingOperation:!1})}),m},restoreSelection(a,c){let m=v(a);if(typeof c!="string")return;let b=m.model.markers.get(c);b&&m.model.change(g=>g.setSelection(b.getRange())),m.model.change(g=>{m.model.markers.has(c)&&g.removeMarker(c)})},getSelectedText:()=>String(o.getSelection?.()??""),getSelectedHtml(){let a=o.getSelection?.();if(!a||a.rangeCount===0)return"";let c=e.createElement("div");return c.append(a.getRangeAt(0).cloneContents()),c.innerHTML},on(a,c,m){if(c==="change")return v(a).model.document.on("change:data",m);l(v(a))?.addEventListener(c,m)},off(a,c,m){if(c==="change")return v(a).model.document.off("change:data",m);l(v(a))?.removeEventListener(c,m)},fire(a,c,m){l(v(a))?.dispatchEvent(new CustomEvent(c,{detail:m}))},addContextMenu(a,c){I(l(v(a)),c)},waitReady(a){return new Promise((c,m)=>{let b=Date.now(),g=()=>{let h=f.getInstance();if(h)return c(h);if(Date.now()-b>a)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(g,100)};g()})},somenteLeitura:a=>i(n(v(a)))};return f}function B(o){return o.document.querySelector(".ck-editor__editable")?5:o.CKEDITOR?.instances?4:0}function X(o){let e=null,t=()=>{if(e)return e;let l=B(o);return l===5?e=W(o):l===4&&(e=J(o)),e},s=()=>{let l=t();if(!l)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return l},r=l=>((...u)=>s()[l](...u));return{get versao(){return t()?.versao??0},getInstance:l=>t()?.getInstance(l)??null,getAllInstances:()=>t()?.getAllInstances()??[],focus:r("focus"),saveSnapshot:r("saveSnapshot"),withEdit:r("withEdit"),insertHtml:r("insertHtml"),insertText:r("insertText"),getSelectionElement:r("getSelectionElement"),getSelectionParagraph:r("getSelectionParagraph"),insertHtmlBefore:r("insertHtmlBefore"),getToolbarContainer:r("getToolbarContainer"),getBodyContainer:r("getBodyContainer"),findInBody:r("findInBody"),appendToBody:r("appendToBody"),transformBodyHtml:r("transformBodyHtml"),execCommand:r("execCommand"),applyStyle:r("applyStyle"),getData:r("getData"),setData:r("setData"),insertElement:r("insertElement"),saveSelection:r("saveSelection"),restoreSelection:r("restoreSelection"),getSelectedText:r("getSelectedText"),getSelectedHtml:r("getSelectedHtml"),on:r("on"),off:r("off"),fire:r("fire"),addContextMenu:r("addContextMenu"),somenteLeitura:r("somenteLeitura"),waitReady(l){let u=Date.now();return new Promise((n,i)=>{let d=()=>{let p=t();if(p)return p.waitReady(Math.max(1,l-(Date.now()-u))).then(n,i);if(Date.now()-u>l)return i(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(d,100)};d()})}}}var Y="data-base";function Z(o,e){let t=o;if(typeof o=="string"){if(!o.trim())return;try{t=JSON.parse(o)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(r=>r?.configGeral).find(Array.isArray)?.find(r=>r?.name===e)?.value}function oo(o,e){let t=Z(o,e);return!(t===!1||t===0||t==="")}function eo(o,e){let t=Z(o,e);return t===!0||t===1||t==="1"}function to(o=localStorage){try{return o.getItem("configBasePro")}catch{return null}}function ro(o,e=localStorage){return oo(to(e),o)}function no(o,e=localStorage){return eo(to(e),o)}var ao=`/*
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
`;function x(o,e={},...t){let s=document.createElement(o);for(let[r,l]of Object.entries(e))l===void 0||l===!1||(typeof l=="function"?s.addEventListener(r.replace(/^on/,""),l):l===!0?s.setAttribute(r,""):r==="class"?s.className=l:r==="value"&&o==="textarea"?s.value=l:s.setAttribute(r,l));for(let r of t)r!=null&&r!==!1&&s.append(r);return s}var E={fill:"currentColor",stroke:"none"},so="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",io={estrela:[["path",{d:so}]],estrelaCheia:[["path",{d:so,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...E}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...E}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...E}],["circle",{cx:"12",cy:"12",r:"1.4",...E}],["circle",{cx:"19",cy:"12",r:"1.4",...E}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...E}],["circle",{cx:"15",cy:"6",r:"1.3",...E}],["circle",{cx:"9",cy:"12",r:"1.3",...E}],["circle",{cx:"15",cy:"12",r:"1.3",...E}],["circle",{cx:"9",cy:"18",r:"1.3",...E}],["circle",{cx:"15",cy:"18",r:"1.3",...E}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Ue=Object.keys(io);function S(o,e=18,t=document){let s="http://www.w3.org/2000/svg",r=t.createElementNS(s,"svg"),l={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[u,n]of Object.entries(l))r.setAttribute(u,n);for(let[u,n]of io[o]){let i=t.createElementNS(s,u);for(let[d,p]of Object.entries(n))i.setAttribute(d,p);r.append(i)}return r}var oe=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function lo(o={}){return({titulo:e,conteudo:t,icone:s,aoFechar:r})=>{let l=x("dialog",{class:"spro-dialogo","aria-label":e}),u=()=>{l.open&&l.close()};return l.append(x("header",{},s?x("span",{class:"spro-dialogo-icone","aria-hidden":"true"},S(s,18)):null,x("h2",{},e),x("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:u},S("fechar",16))),x("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),o.aoFechar?.(),r?.()}),document.body.append(l),o.aoAbrir?.(),l.showModal(),l.querySelector(oe)?.focus({preventScroll:!0}),{fechar:u}}}function co(o){let e=lo();return(t,s)=>{if(!t.querySelector('style[data-seipro-editor="base"]')){let r=t.createElement("style");r.setAttribute("data-seipro-editor","base"),r.textContent=o,(t.head??t.documentElement).append(r)}return e(s)}}var po="";function F(o){po=o}var $=(o,e)=>co(po)(o,e);function ee(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function uo(o){let e=[...o.querySelectorAll("dialog[open]")],t=!0;return e.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:e.at(-1))??o.body??o.documentElement}function mo(o,e,t,s,r){let l=o.body??o.documentElement;for(let f of[l,...o.querySelectorAll("dialog")])for(let a of[...f.children])a.classList.contains("spro-aviso")&&a.remove();let u=x("div",{class:"spro-aviso",role:"status"},S("check",16),x("span",{},e),...ee(t).map(f=>x("button",{type:"button",onclick:()=>{u.remove(),f.fazer()}},f.rotulo)));u.setAttribute("popover","manual");let n=()=>{try{u.showPopover?.()}catch{}},i=Date.now()+s,d=()=>{let f=uo(o);f.append(u),n(),f.localName==="dialog"&&f.addEventListener("close",()=>{if(!(!p||!f.contains(u))){if(r&&uo(o).localName!=="dialog"&&r(e,t,Math.max(0,i-Date.now()))){p=!1,u.remove();return}d()}},{once:!0})},p=!0;return d(),setTimeout(()=>{p=!1,u.remove()},s),u}function M(o,e){mo(o,e,void 0,7e3)}F(ao);function R(o){o.style.display="",o.ownerDocument.defaultView?.getComputedStyle?.(o)?.display==="none"&&(o.style.display="block")}function D(o){o.style.display="none"}var fo=o=>(o?.nodeType===1?o:o?.parentElement??null)?.closest("p")??null;function go(o){let e=()=>o.adaptador.versao===5,t=(s,r)=>{let l=s.editing.view.domConverter.mapDomToView(r);return l?s.editing.mapper.toModelElement(l):null};return{selecionados(s){let r=()=>{let c=o.adaptador.getSelectionParagraph(s);return c?[c]:[]};if(e()){let c=s,b=[...c.model.document.selection.getSelectedBlocks()].map(g=>{let h=c.editing.mapper.toViewElement(g);return h?c.editing.view.domConverter.mapViewToDom(h):null}).filter(g=>!!g&&g.tagName==="P");return b.length?b:r()}let u=o.adaptador.getBodyContainer(s)?.ownerDocument?.getSelection?.();if(!u||u.rangeCount===0||!u.anchorNode)return r();let n=fo(u.anchorNode),i=fo(u.focusNode);if(!n&&!i||(n=n??i,i=i??n,!n||!i))return r();if(n===i)return[n];let d=n,p=i;n.compareDocumentPosition(i)&2&&(d=i,p=n);let f=[],a=d;for(let c=0;a&&c<5e3&&(a.tagName.toLowerCase()==="p"&&f.push(a),a!==p);c+=1)a=a.nextElementSibling;return f.length?f:[d]},classeDeEstilo(s,r){return e()?t(s,r)?.getAttribute("estilo")??"":r.getAttribute("class")??""},definirClasse(s,r,l){if(e()){let u=s,n=t(u,r);n&&u.model.change(i=>i.setAttribute("estilo",l,n));return}r.removeAttribute("style"),r.setAttribute("class",l)},definirTextAlign(s,r,l){if(e()){o.win.SeiProGhs?.setEstilos(r,{"text-align":l},s);return}r.removeAttribute("style"),r.style.textAlign=l}}}var te=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function re(o,e){let t=te.find(s=>Object.values(s).includes(o));return t?t[e]:null}function ne(o,e){let t=o?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let s=o?.parentElement??null;s;s=s.parentElement){let r=s.querySelector(".divAlignText");if(r)return r}return e.querySelector(".divAlignText")}var bo={id:"align",globais(o){let e=go(o);return{setAlignText(t,s){let r=o.adaptador.getInstance(t);if(!r||o.adaptador.somenteLeitura(r))return;let l=e.selecionados(r);l.length&&o.adaptador.withEdit(r,()=>{for(let u of l){let n=re(e.classeDeEstilo(r,u),s);n?e.definirClasse(r,u,n):e.definirTextAlign(r,u,s)}})},openAlignText(t){if(!t)return;let s=ne(t,o.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),s&&D(s)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),s&&R(s))},closeAlignText(){for(let t of o.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of o.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};var ae=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),ho=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function se(o){let e=0,t=o.split("");return t.forEach((s,r)=>{let l=ho.get(s),u=ho.get(t[r+1]);e+=l<u?-l:l}),e}function vo(o){return!o||typeof o!="string"||o.trim()===""?"":o.includes(" ")?o.split(" ").map((e,t)=>e===""?e:ae.has(e.toLowerCase())&&t!==0?e.toLowerCase():se(e)>0?e.toUpperCase():e[0].toUpperCase()+e.substring(1).toLowerCase()).join(" "):o[0].toUpperCase()+o.substring(1).toLowerCase()}function T(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var xo={id:"cap-letter",globais:o=>({convertFirstLetter(e){let t=o.adaptador.getInstance(e);if(!t)return;let s=o.adaptador.getSelectedText(t);if(!s||s.trim()===""){M(o.doc,"Selecione um texto para converter");return}o.adaptador.insertHtml(t,T(vo(s)))}})};var yo="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function ko(o){let e=new Uint32Array(Math.max(0,o));crypto.getRandomValues(e);let t="";for(let s of e)t+=yo[s%yo.length];return t}var ie=()=>`<span class="ancoraSei checkboxSEI" data-id="${ko(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,wo={id:"checkbox",globais:o=>({getInsertCheckboxButtom(e){let t=o.adaptador.getInstance(e);t&&o.adaptador.withEdit(t,()=>o.adaptador.insertHtml(t,ie()))}})};var Q="spro_editor_folha",Eo="seipro-folha-editor",j="data-spro-folha-editor",le=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function ce(o){let e=`html[${j}]`,t=o?"#141619":"#f3f4f7",s=o?"#2a2d33":"#e3e6ee",r="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${r}, -14px 0 24px -14px ${r}`,u=`0 14px 24px -14px ${r}`,n=`${e} .cke_contents[data-spro-folha]`;return`${e} #divEditores, ${e} .cke_inner, ${e} .cke { background-color: ${t} !important; }
${e} #divEditores { padding-bottom: 28px; }
${n} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${s}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${n}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${n}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${u}; clip-path: inset(0 -30px -30px); }
${n}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${n} { padding-left: 20px; padding-right: 20px; } }
${e} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${e} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${s} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function Mo(o,e){if(!o.head||(o.querySelector(`style[data-style="${Eo}"]`)?.remove(),!e))return;let t=o.createElement("style");t.setAttribute("data-style",Eo),t.textContent=e,o.head.append(t)}function Co(o,e){if(!o?.style)return;let t=o.getAttribute("data-spro-folha-bg");if(e)t===null&&o.setAttribute("data-spro-folha-bg",`${o.style.getPropertyValue("background-color")}|${o.style.getPropertyPriority("background-color")}`),o.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[s,r]=t.split("|");o.removeAttribute("data-spro-folha-bg"),o.style.removeProperty("background-color"),s&&o.style.setProperty("background-color",s,r||"")}}var Ao={id:"folha-papel",globais(o){let e=o.doc,t=()=>!!o.win.localStorage?.getItem(Q),s=()=>!!o.win.localStorage?.getItem("darkModePro"),r=!1;function l(i){for(let d of e.querySelectorAll("iframe.cke_wysiwyg_frame")){let p=d.contentDocument;p?.head&&(Mo(p,i?le:null),Co(p.documentElement,i),Co(p.body,i))}}function u(i){let d=[...e.querySelectorAll(".cke_contents")];d.forEach((p,f)=>{if(!i){p.removeAttribute("data-spro-folha");return}let a=[f===0?"primeira":"",f===d.length-1?"ultima":""].filter(Boolean);p.setAttribute("data-spro-folha",a.join(" ")||"meio")})}function n(i){Mo(e,i?ce(s()):null),l(i),u(i),i?e.documentElement.setAttribute(j,""):e.documentElement.removeAttribute(j);for(let d of e.querySelectorAll(".getPaperViewButtom"))d.classList.toggle("cke_button_on",i),d.classList.toggle("cke_button_off",!i),d.setAttribute("aria-pressed",i?"true":"false")}return{aplicarFolhaEditorPro:n,getPaperViewButtom(i){let d=!t();d?o.win.localStorage.setItem(Q,"1"):o.win.localStorage.removeItem(Q),n(d)},initFolhaEditorPro(){let i=o.win.CKEDITOR;if(typeof i?.on=="function"&&!r){r=!0;let d=p=>p.on("contentDom",()=>t()&&l(!0));for(let p of Object.values(i.instances??{}))d(p);i.on("instanceReady",p=>d(p.editor))}n(t())}}}};function de(o){if(!o)return 16;let e=Number.parseFloat(o.ownerDocument.defaultView?.getComputedStyle?.(o)?.fontSize??"");return Number.isNaN(e)?16:e}var So={id:"font-size",globais:o=>({changeFontSize(e,t){let s=o.adaptador.getInstance(e);if(!s)return;let r=o.adaptador.getSelectedHtml(s);if(!r||r.trim()===""){M(o.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=de(o.adaptador.getSelectionElement(s)),u=t==="up"?l+2:l-2;u>7&&u<70&&o.adaptador.withEdit(s,()=>{o.adaptador.versao===4?o.adaptador.applyStyle(s,{element:"span",attributes:{style:`font-size: ${u}px`}}):o.adaptador.insertHtml(s,`<span style="font-size: ${u}px">${r}</span>`)})}})};var H=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,pe=[{name:H,attributes:!0},{name:H,classes:!0},{name:H,styles:!0}],q=o=>o.split("").join("[\\t\\n\\r]*"),ue=new RegExp(`^[\\s\\x00-\\x20]*(${q("javascript")}|${q("vbscript")}|${q("livescript")}|${q("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${q("text/html")})`,"i"),me=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:ue}]}];function A(o,e){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",o,e===void 0?"":e)}function L(o,e){try{return o?.plugins?.has(e)?o.plugins.get(e):null}catch{return null}}var fe=o=>!!(o?.model&&o.editing&&o.conversion),ge=o=>L(o,"EstiloEditing")?.estilos??{},To=(o,e)=>Object.hasOwn(o,e);function _o(o,e){let t=L(o,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(e)}catch{}return`html${e.charAt(0).toUpperCase()}${e.slice(1)}Attributes`}function be(o,e){let t=o?.getAttribute?.(e)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function he(o,e,t){if(!e?.is?.("element"))return;let s=t.mapper.toViewElement(e);if(!s)return;let r=ge(o),l=e.getAttribute("estilo"),u=be(e,_o(o,"p")),n=t.writer,i=[];try{i=Array.from(s.getClassNames())}catch{}for(let d of i)d!==l&&To(r,d)&&n.removeClass(d,s);for(let d of u)To(r,d)||n.addClass(d,s);l&&n.addClass(l,s)}function ve(o){if(o.__seiProGhsConversor)return;o.__seiProGhsConversor=!0;let e=["attribute:estilo:paragraph",`attribute:${_o(o,"p")}:paragraph`];o.conversion.for("downcast").add(t=>{for(let s of e)t.on(s,(r,l,u)=>{try{he(o,l.item,u)}catch{}},{priority:"lowest"})})}function xe(o){try{return Array.from(o.model.markers).some(e=>/coment/i.test(e.name))}catch{return!1}}function qo(o,e){let t=L(e,"Salvar"),s=t?!!t.isDirty:!1;try{o()}finally{if(t&&!s)try{t.resetDirty()}catch{}}}function ye(o){try{return o.model.document.history.getOperations().some(e=>e.batch?.isUndoable)}catch{return!0}}function ke(o,e){let t=o.getFullData({seiProInterno:!0}),s=e.INFRA_EDITOR_CONFIG?.initialData;return!s||typeof s!="object"||ye(o)?t:Object.fromEntries(Object.keys(t).map(r=>[r,typeof s[r]=="string"?s[r]:t[r]]))}function we(o,e,t){try{let s=t??o.adaptador.getSelectionParagraph(e);if(!s)return null;if(typeof s.is=="function"&&s.is("element"))return s;let r=s.jquery?s.get(0):s;if(r?.nodeType!==1)return null;let l=e.editing.view.domConverter.mapDomToView(r);return l?e.editing.mapper.toModelElement(l):null}catch{return null}}function Ee(o,e){try{return o.editing.mapper.toViewElement(e)?.name??null}catch{return null}}function Lo(o){let e=l=>l??o.adaptador.getInstance();function t(l){let u=e(l);if(!fe(u))return!1;if(u.__seiProGhsLiberado)return!0;let n=L(u,"DataFilter");if(!n)return A("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{n.allowElement({name:H,attributes:!0,classes:!0,styles:!0});for(let i of pe)n.allowAttributes(i);if(typeof n.disallowAttributes=="function")for(let i of me)n.disallowAttributes(i)}catch(i){return A("falha ao liberar o GHS",i),!1}return u.__seiProGhsLiberado=!0,ve(u),!0}function s(l){let u=e(l);if(!t(u)||typeof u.getFullData!="function")return!1;let n=!0;return qo(()=>{try{u.data.set(ke(u,o.win))}catch(i){A("falha ao reprocessar o conteudo",i),n=!1}},u),n}function r(l,u,n){let i=e(l);if(!t(i))return!1;let d=L(i,"GeneralHtmlSupport"),p=we(o,i,u),f=p?Ee(i,p):null;if(!d||!p||!f)return!1;try{return n(d,f,p),!0}catch(a){return A("falha ao aplicar no model",a),!1}}return{liberar:t,aplicarRegras:s,semSujar:(l,u)=>qo(l,e(u)),estaLiberado:l=>!!e(l)?.__seiProGhsLiberado,addClasse:(l,u,n)=>r(n,l,(i,d,p)=>i.addModelHtmlClass(d,u,p)),removeClasse:(l,u,n)=>r(n,l,(i,d,p)=>i.removeModelHtmlClass(d,u,p)),setEstilos:(l,u,n)=>r(n,l,(i,d,p)=>i.setModelHtmlStyles(d,u,p)),setAtributos:(l,u,n)=>r(n,l,(i,d,p)=>i.setModelHtmlAttributes(d,u,p))}}var Io={id:"ghs-unlock",globais:o=>({SeiProGhs:Lo(o)}),iniciar(o){if(o.adaptador.versao!==5)return;let e=Lo(o),t=o.adaptador.getInstance();if(!(!t||!e.liberar(t))){if(o.win.SEIPRO_GHS_AUTO===!1||xe(t)){A("regras liberadas (ativacao no pr\xF3ximo data.set)");return}e.aplicarRegras(t)&&A("classes, estilos e atributos liberados no editor")}}};function P(o,e,t){let s=o.adaptador.getInstance(e);if(!s)return;let r=o.adaptador.getSelectionParagraph(s);r&&o.adaptador.withEdit(s,()=>o.adaptador.insertHtmlBefore(s,r,t))}var Me='<div class="pageBreakPro" style="page-break-after: always"></div>',Ro={id:"page-break",globais:o=>({getPageBreak:e=>P(o,e,Me)})};var Do=5,Ho=5,Po=49,w=(o,e)=>Number.parseInt(o?.getAttribute(e)??"",10);function Ce(o,e){let t=o?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let s=o?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(s)return s;for(let r=o?.previousElementSibling??null;r;r=r.previousElementSibling)if(r.classList.contains("divQuickTable"))return r;return e.querySelector(".divQuickTable")}var zo={id:"quick-table",globais(o){let e=o.adaptador;function t(){for(let p of o.doc.querySelectorAll(".divQuickTable"))p.replaceChildren(),D(p);for(let p of o.doc.querySelectorAll(".getQuickTableButtom"))p.classList.add("cke_button_off"),p.classList.remove("cke_button_on")}function s(p){if(!p)return;let f=w(p,"data-row"),a=w(p,"data-col"),c=p.closest("table");if(!c)return;for(let g of c.querySelectorAll("td"))g.classList.remove("td_hover");let m=()=>[...c.querySelectorAll("tr")];if(f>=3&&w(m().at(-1)?.querySelector("td"),"data-row")>f+1&&(m().at(-1)?.remove(),c.setAttribute("data-row",String(w(c,"data-row")-1))),a>=3&&w(m().at(-1)?.lastElementChild,"data-col")>a+1){for(let g of m())g.lastElementChild?.remove();c.setAttribute("data-col",String(w(c,"data-col")-1))}for(let g of c.querySelectorAll("td"))w(g,"data-row")<=f&&w(g,"data-col")<=a&&g.classList.add("td_hover");let b=p.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(b&&(b.textContent=`Tabela ${f+1}x${a+1}`),f===w(c,"data-row")&&f<Po){let g=m().at(-1)?.cloneNode(!0);g&&(g.querySelectorAll("td").forEach((h,k)=>{h.setAttribute("data-row",String(f+1)),h.setAttribute("data-col",String(k)),h.classList.remove("td_hover")}),(c.querySelector("tbody")??c).append(g),c.setAttribute("data-row",String(f+1)))}if(a===w(c,"data-col")&&a<Po){for(let g of m()){let h=g.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(a+1)),h.classList.remove("td_hover"),g.append(h))}c.setAttribute("data-col",String(a+1))}}function r(){let p=o.doc,f=p.createDocumentFragment(),a=p.createElement("div");a.className="quickTableInfo",a.textContent="Inserir Tabela";let c=p.createElement("table");c.setAttribute("data-row",String(Do-1)),c.setAttribute("data-col",String(Ho-1));for(let b=0;b<Do;b+=1){let g=p.createElement("tr");for(let h=0;h<Ho;h+=1){let k=p.createElement("td");k.setAttribute("data-row",String(b)),k.setAttribute("data-col",String(h)),g.append(k)}c.append(g)}let m=b=>s(b.target?.closest("td")??null);return c.addEventListener("mouseover",m),c.addEventListener("mouseout",m),c.addEventListener("click",b=>{let g=b.target?.closest("td");g&&d(g)}),f.append(a,c),f}function l(p){if(!p)return;let f=Ce(p,o.doc);p.classList.contains("cke_button_on")?(t(),p.classList.add("cke_button_off"),p.classList.remove("cke_button_on")):(f&&(f.replaceChildren(r()),R(f)),p.classList.remove("cke_button_off"),p.classList.add("cke_button_on"))}function u(p){let f=p?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),a=f?[...f.querySelectorAll(".getTablestylesButtom")]:[];a.length||(a=[...o.doc.querySelectorAll(".getTablestylesButtom")]);for(let c of a)c.classList.remove("cke_button_disabled")}function n(p,f){let a='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';a+="  <tbody>";for(let c=0;c<=p;c+=1){a+="      <tr>";for(let m=0;m<=f;m+=1)a+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';a+="      </tr>"}return`${a}  </tbody></table>`}function i(p,f){let a=f?f.nextElementSibling:e.getBodyContainer(p)?.lastElementChild,c=a?.tagName==="TABLE"?a.querySelector("td p"):null;if(!c)return;let m=c.ownerDocument,b=m.defaultView?.getSelection?.();if(!b)return;let g=m.createRange();g.setStart(c.firstChild??c,0),g.collapse(!0),b.removeAllRanges(),b.addRange(g)}function d(p){let f=e.getInstance(p);if(!f){t();return}let a=n(w(p,"data-row"),w(p,"data-col")),c=e.getSelectionParagraph(f);e.withEdit(f,()=>{if(!c)return e.insertHtml(f,a);let m=c.nextElementSibling;m?e.insertHtmlBefore(f,m,a):e.appendToBody(f,a)}),t(),u(p),i(f,c)}return{getQuickTable:l,quickTableOver:s,hideQuickTable:t,quickTableClick:d}}};var Ae='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Oo={id:"session-break",globais:o=>({getSessionBreak:e=>P(o,e,Ae)})};var No=["seiSlim","seiSlim_parent","seiSlim_view"],Bo={id:"style-editor",globais(o){let e=()=>[...o.doc.querySelectorAll(".getNewStyleButton")],t=r=>{for(let l of e())l.classList.add(r?"cke_button_on":"cke_button_off"),l.classList.remove(r?"cke_button_off":"cke_button_on")};function s(r){if(r==="set"){o.win.localStorage.setItem("seiSlim_editor","true");for(let l of o.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();o.win.insertFontIcon?.("head"),o.doc.body.classList.add(...No)}else o.win.localStorage.removeItem("seiSlim_editor"),o.doc.body.classList.remove(...No)}return{getBoxStyleEditor(r){o.win.localStorage.getItem("seiSlim_editor")?(t(!1),s("remove")):(t(!0),s("set"))},updateStyleEditor:s}}};function Fo(...o){return x("div",{style:"display:grid;gap:12px;min-width:360px;"},...o)}function V(o,e){return e.classList.add("spro-campo"),e.style.width="100%",x("label",{style:"display:grid;gap:4px;font-size:13px;"},x("span",{},o),e)}function G(o){try{let e=new URL(o);return e.protocol==="http:"||e.protocol==="https:"}catch{return!1}}var $o=/^[0-9A-Za-z-]+$/,Se="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Te=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,Qo={id:"tiny-url",globais(o){let e=l=>M(o.doc,l),t=l=>(o.fetch??o.win.fetch.bind(o.win))(l);async function s(l,u,n){let i=new URLSearchParams({url:l});u!==""&&i.set("alias",u);let d;try{d=await t(`https://tinyurl.com/api-create.php?${i}`)}catch{return e("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(d.status===400)return e("Erro: Nenhuma link gerado"),!1;if(d.status===422)return e("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let p=(await d.text()).trim();if(d.status!==200||!Te.test(p))return e("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return o.win.setInputTinyUrl?.(p),!0;let f=o.adaptador.getInstance();if(!f)return!1;let a=`<a href="${T(p)}" class="ancoraSei" target="_blank">${T(p)}</a>`;return o.adaptador.withEdit(f,()=>o.adaptador.insertHtml(f,a)),!0}function r(l){if(!o.adaptador.getInstance(l))return;let u=x("input",{type:"text",id:"urlTiny"}),n=x("input",{type:"text",id:"aliasTiny"}),i=x("div",{id:"tinyResult"}),d=String(o.win.getSelection?.()??"").trim();d!==""&&G(d)&&(u.value=d),n.addEventListener("input",()=>{i.replaceChildren();let f=n.value;f!==""&&($o.test(f)?i.append(`Resultado: https://tinyurl.com/${f}`):i.append(x("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let p=$(o.doc,{titulo:"Gerar link curto do TinyURL",conteudo:Fo(V("Insira o link que deseja encurtar:",u),V("Insira um Nome Personalizado para o link (opcional):",n),i,x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let f=u.value.trim(),a=n.value.trim();if(f===""||!G(f))return e("Digite um link v\xE1lido!");if(a!==""&&!$o.test(a))return e(Se);if(a!==""&&a.length<5)return e("O nome personalizado deve ter mais de 4 (quatro) caracteres");await s(f,a,"insert")&&p.fechar()}},"Inserir")))})}return{getTinyUrl:r,ajaxTinyUrl:s}}};var U=[Io,Ro,Oo,wo,xo,bo,So,Bo,zo,Ao,Qo];function jo(o,e,t){let s=o,r=[],l=[];for(let u of e){let n=!0;try{for(let[i,d]of Object.entries(u.globais(t))){if(s[i]!==void 0){n=!1,l.push({id:u.id,erro:new Error(`global ja definido: ${i}`)});continue}s[i]=d}}catch(i){n=!1,l.push({id:u.id,erro:i})}n&&r.push(u.id);try{s.SeiProEditorAdapter?.registerFeature?.({id:u.id})}catch{}}return{instalados:r,falhas:l}}function Vo(o,e){let t=[];for(let s of o)try{s.iniciar?.(e)}catch(r){t.push({id:s.id,erro:r})}return t}var Go="__seiProEditorTs",Uo=window;if(!Uo[Go]){Uo[Go]=!0;let o=X(window),e={adaptador:o,doc:document,win:window,base:document.currentScript?.getAttribute(Y)??"",checkOpcao:t=>ro(t),verifyOpcao:t=>no(t)};for(let t of jo(window,U,e).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);o.waitReady(2e4).then(()=>{for(let t of Vo(U,e))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
