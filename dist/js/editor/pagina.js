/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function B(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(s=>e.importNode(s,!0))}function oe(e,o){if(!e||typeof o!="function")return;let t=e,r=t.__seiProCtxBuilders;if(!r){let s=[];r=t.__seiProCtxBuilders=s,e.addEventListener("contextmenu",l=>{let d=l;if(d.shiftKey)return;let m=[];for(let n of s)try{m=m.concat(n(d.target)||[])}catch{}m.length&&(d.preventDefault(),mt(e.ownerDocument,m,d.clientX,d.clientY))})}r.includes(o)||r.push(o)}function mt(e,o,t,r){e.getElementById("seiProCtxMenu")?.remove();let s=e.createElement("div");s.id="seiProCtxMenu",s.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",s.style.left=`${t}px`,s.style.top=`${r}px`;for(let d of o){let m=e.createElement("div");m.textContent=d.label,m.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",m.addEventListener("mouseenter",()=>{m.style.background="#eef"}),m.addEventListener("mouseleave",()=>{m.style.background=""}),m.addEventListener("click",()=>{s.remove(),d.action()}),s.append(m)}e.body.append(s);let l=()=>{s.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function $e(e,o,t){if(typeof t!="function")return;let r=e.__seiProCtx;if(!r){let s={acoes:{},construtores:[]};r=e.__seiProCtx=s;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let d=l?.$??null,m=null;for(let n of s.construtores){let c=[];try{c=n(d)||[]}catch{c=[]}for(let i of c){let u=`seiPro_${String(i.label).replace(/[^A-Za-z0-9]/g,"_")}`;s.acoes[u]=i.action,e.getCommand(u)||e.addCommand(u,{exec:()=>(s.acoes[u]?.(),!0)}),e.getMenuItem(u)||e.addMenuItem(u,{label:i.label,command:u,group:"seiProGroup"}),m=m??{},m[u]=o}}return m})}r.construtores.includes(t)||r.construtores.push(t)}var _=e=>e;function Pe(e,o={}){let t=()=>e.CKEDITOR,r=n=>!!n?.name&&t()?.instances[n.name]===n,s=n=>r(n)&&!n.readOnly,l=n=>_(n).document?.getBody()?.$??null,d=(n,c)=>{if(!n)return;let i=_(n);if(i.readOnly){o.fn?.();return}c(i)},m={versao:4,getInstance(n){let c=t();if(!c?.instances)return null;if(r(c.currentInstance))return c.currentInstance;let i=n?.closest?.("div.cke"),u=i?c.instances[i.id.replace("cke_","")]:void 0;if(s(u))return u;if(s(e.oEditor))return e.oEditor;let b=Object.values(c.instances);return b.find(a=>s(a))??b[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>_(n).focus(),saveSnapshot:n=>_(n).fire("saveSnapshot"),withEdit(n,c){let i=_(n);i.focus(),i.fire("saveSnapshot"),i.fire("lockSnapshot",{dontUpdate:!0});try{c()}finally{i.fire("unlockSnapshot"),i.fire("saveSnapshot")}},insertHtml:(n,c)=>d(n,i=>i.insertHtml(c)),insertText:(n,c)=>d(n,i=>i.insertText(c)),getSelectionElement:n=>_(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return m.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,c,i){d(n,()=>c.before(...B(c.ownerDocument,i)))},getToolbarContainer:n=>_(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>l(n),findInBody(n,c){let i=l(n);return i?Array.from(i.querySelectorAll(c)):[]},appendToBody(n,c){d(n,i=>{let u=l(i);u&&u.append(...B(u.ownerDocument,c))})},transformBodyHtml(n,c){d(n,i=>{let u=l(i);if(!u)return;let b=u.innerHTML,a=c(b);typeof a=="string"&&a!==b&&u.replaceChildren(...B(u.ownerDocument,a))})},execCommand:(n,c,i)=>_(n).execCommand(c,i),applyStyle(n,c){let i=t()?.style;i&&_(n).applyStyle(new i(c))},getData:n=>_(n).getData(),setData:(n,c)=>d(n,i=>i.setData(c)),insertElement(n,c){d(n,i=>{let u=t()?.dom?.element.createFromHtml;u&&i.insertElement?i.insertElement(u(c,i.document)):i.insertHtml(c)})},saveSelection:n=>_(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,c){let i=_(n).getSelection();i&&c&&i.selectBookmarks(c)},getSelectedText:n=>_(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return _(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,c,i)=>_(n).on(c,i),off:(n,c,i)=>_(n).removeListener(c,i),fire:(n,c,i)=>_(n).fire(c,i),addContextMenu(n,c){let i=_(n),u=t();if(u&&i.contextMenu&&typeof i.addMenuItem=="function"){$e(i,u.TRISTATE_OFF,c);return}oe(l(n),c)},waitReady(n){return new Promise((c,i)=>{let u=Date.now(),b=()=>{let a=Object.values(t()?.instances??{}).find(f=>f.status==="ready");if(a)return c(a);if(Date.now()-u>n)return i(new Error("Timeout aguardando CKEditor 4"));setTimeout(b,100)};b()})},somenteLeitura:n=>!!_(n).readOnly,aoRecusarEscrita(n){o.fn=n},recusarEscrita(){o.fn?.()}};return m}var k=e=>e,ft={strike:"strikethrough",strikethrough:"strikethrough"},gt={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},bt=0;function Ne(e,o={}){let t=e.document,r=a=>Array.from(a.model.document.roots??[]).filter(f=>f.isAttached()&&f.rootName!=="$graveyard"),s=a=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[a],l=(a,f)=>{let p=a.editing.view.document.getRoot(f);return p?a.editing.view.domConverter.mapViewToDom(p):null},d=a=>{for(let g of r(a))if(s(g.rootName)?.principal){let h=l(a,g.rootName);if(h)return h}let f=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return f||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((g,h)=>h.childElementCount>(g?g.childElementCount:-1)?h:g,null)},m=a=>{let f=d(a);return f&&r(a).find(p=>l(a,p.rootName)===f)||null},n=a=>a.model.document.selection.getFirstPosition()?.root.rootName??null,c=a=>!!a&&!!s(a)?.somenteLeitura,i=(a,f)=>a.data.toModel(a.data.processor.toView(f)),u=(a,f)=>{let p=k(a);if(c(n(p)))return o.fn?.();p.model.change(()=>p.model.insertContent(i(p,f),p.model.document.selection))},b={versao:5,getInstance(){let a=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return a&&a.state==="ready"?a:null},getAllInstances(){let a=b.getInstance();return a?[a]:[]},focus:a=>k(a).focus(),saveSnapshot(){},withEdit(a,f){let p=k(a);p.focus(),p.model.change(()=>f())},insertHtml:u,insertText(a,f){let p=k(a);if(c(n(p)))return o.fn?.();p.model.change(g=>p.model.insertContent(g.createText(f)))},getSelectionElement(){let a=e.getSelection?.(),f=a&&a.rangeCount>0?a.anchorNode:null;return f?f.nodeType===1?f:f.parentElement:null},getSelectionParagraph:a=>b.getSelectionElement(a)?.closest("p")??null,insertHtmlBefore(a,f,p){let g=k(a),h=g.editing.view.domConverter.mapDomToView(f),v=h?g.editing.mapper.toModelElement(h):null;if(v){if(c(v.root?.rootName))return o.fn?.();g.model.change(y=>g.model.insertContent(i(g,p),y.createPositionBefore(v)));return}u(a,p)},getToolbarContainer(a){let f=k(a).ui?.view?.toolbar?.element;return f?f.querySelector(".ck-toolbar__items")??f:null},getBodyContainer:a=>d(k(a)),findInBody(a,f){let p=d(k(a));return p?Array.from(p.querySelectorAll(f)):[]},appendToBody(a,f){let p=k(a),g=m(p);if(!g)return u(a,f);if(c(g.rootName))return o.fn?.();p.model.change(h=>p.model.insertContent(i(p,f),h.createPositionAt(g,"end")))},transformBodyHtml(a,f){let p=k(a),g=m(p);if(!g)return;let h=p.data.get({rootName:g.rootName,seiProInterno:!0}),v=f(h);if(typeof v!="string"||v===h)return;let y=p.model.document.selection.getFirstRange(),E=y&&y.start.root.rootName===y.end.root.rootName?{raiz:y.start.root,ps:[...y.start.path],pe:[...y.end.path]}:null,M=p.model.document.selection.isBackward;p.data.set({[g.rootName]:v}),E&&p.model.change(R=>{let A,F;try{A=p.model.createPositionFromPath(E.raiz,E.ps),F=p.model.createPositionFromPath(E.raiz,E.pe)}catch{A=F=R.createPositionAt(E.raiz,"end")}R.setSelection(R.createRange(A,F),{backward:M})})},execCommand(a,f,p){k(a).execute(ft[f]??f,p!==void 0?{value:p}:void 0)},applyStyle(a,f){let p=gt[f.element.toLowerCase()];p&&k(a).execute(p)},getData(a){let f=k(a),p=m(f);return p?f.data.get({rootName:p.rootName}):f.data.get()},setData(a,f){let p=k(a),g=m(p);g?p.data.set({[g.rootName]:f}):p.data.set(f)},insertElement:(a,f)=>b.insertHtml(a,f),saveSelection(a){let f=k(a),p=`spro-ed:${bt++}`;return f.model.change(g=>{let h=f.model.document.selection.getFirstRange();h&&g.addMarker(p,{range:h,usingOperation:!1})}),p},restoreSelection(a,f){let p=k(a);if(typeof f!="string")return;let g=p.model.markers.get(f);g&&p.model.change(h=>h.setSelection(g.getRange())),p.model.change(h=>{p.model.markers.has(f)&&h.removeMarker(f)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let a=e.getSelection?.();if(!a||a.rangeCount===0)return"";let f=t.createElement("div");return f.append(a.getRangeAt(0).cloneContents()),f.innerHTML},on(a,f,p){if(f==="change")return k(a).model.document.on("change:data",p);d(k(a))?.addEventListener(f,p)},off(a,f,p){if(f==="change")return k(a).model.document.off("change:data",p);d(k(a))?.removeEventListener(f,p)},fire(a,f,p){d(k(a))?.dispatchEvent(new CustomEvent(f,{detail:p}))},addContextMenu(a,f){oe(d(k(a)),f)},waitReady(a){return new Promise((f,p)=>{let g=Date.now(),h=()=>{let v=b.getInstance();if(v)return f(v);if(Date.now()-g>a)return p(new Error("Timeout aguardando CKEditor 5"));setTimeout(h,100)};h()})},somenteLeitura:a=>c(n(k(a))),aoRecusarEscrita(a){o.fn=a},recusarEscrita(){o.fn?.()}};return b}function ce(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function He(e){let o=null,t={},r=()=>{if(o)return o;let d=ce(e);return d===5?o=Ne(e,t):d===4&&(o=Pe(e,t)),o},s=()=>{let d=r();if(!d)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return d},l=d=>((...m)=>s()[d](...m));return{get versao(){return r()?.versao??0},getInstance:d=>r()?.getInstance(d)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(d){t.fn=d},recusarEscrita(){t.fn?.()},waitReady(d){let m=Date.now();return new Promise((n,c)=>{let i=()=>{let u=r();if(u)return u.waitReady(Math.max(1,d-(Date.now()-m))).then(n,c);if(Date.now()-m>d)return c(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(i,100)};i()})}}}var ze="data-base";function Oe(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(s=>s?.configGeral).find(Array.isArray)?.find(s=>s?.name===o)?.value}function Be(e,o){let t=Oe(e,o);return!(t===!1||t===0||t==="")}function je(e,o){let t=Oe(e,o);return t===!0||t===1||t==="1"}function Qe(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function Fe(e,o=localStorage){return Be(Qe(o),e)}function Ve(e,o=localStorage){return je(Qe(o),e)}function te(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function re(e){e.style.display="none"}var Ge=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function Ue(e){let o=()=>e.adaptador.versao===5,t=(r,s)=>{let l=r.editing.view.domConverter.mapDomToView(s);return l?r.editing.mapper.toModelElement(l):null};return{selecionados(r){let s=()=>{let a=e.adaptador.getSelectionParagraph(r);return a?[a]:[]};if(o()){let a=r,p=[...a.model.document.selection.getSelectedBlocks()].map(g=>{let h=a.editing.mapper.toViewElement(g);return h?a.editing.view.domConverter.mapViewToDom(h):null}).filter(g=>!!g&&g.tagName==="P");return p.length?p:s()}let d=e.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!d||d.rangeCount===0||!d.anchorNode)return s();let m=Ge(d.anchorNode),n=Ge(d.focusNode);if(!m&&!n||(m=m??n,n=n??m,!m||!n))return s();if(m===n)return[m];let c=m,i=n;m.compareDocumentPosition(n)&2&&(c=n,i=m);let u=[],b=c;for(let a=0;b&&a<5e3&&(b.tagName.toLowerCase()==="p"&&u.push(b),b!==i);a+=1)b=b.nextElementSibling;return u.length?u:[c]},classeDeEstilo(r,s){return o()?t(r,s)?.getAttribute("estilo")??"":s.getAttribute("class")??""},definirClasse(r,s,l){if(o()){let d=r,m=t(d,s);m&&d.model.change(n=>n.setAttribute("estilo",l,m)),e.win.SeiProGhs?.setEstilos(s,{"text-align":null},r);return}s.removeAttribute("style"),s.setAttribute("class",l)},definirTextAlign(r,s,l){if(o()){e.win.SeiProGhs?.setEstilos(s,{"text-align":l},r);return}s.removeAttribute("style"),s.style.textAlign=l}}}var ht=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function xt(e,o){let t=ht.find(r=>Object.values(r).includes(e));return t?t[o]:null}function vt(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=e?.parentElement??null;r;r=r.parentElement){let s=r.querySelector(".divAlignText");if(s)return s}return o.querySelector(".divAlignText")}var Ke={id:"align",globais(e){let o=Ue(e);return{setAlignText(t,r){let s=e.adaptador.getInstance(t);if(!s||e.adaptador.somenteLeitura(s))return;let l=o.selecionados(s);l.length&&e.adaptador.withEdit(s,()=>{for(let d of l){let m=xt(o.classeDeEstilo(s,d),r);m?o.definirClasse(s,d,m):o.definirTextAlign(s,d,r)}})},openAlignText(t){if(!t)return;let r=vt(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&re(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&te(r))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function x(e,o={},...t){let r=document.createElement(e);for(let[s,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?r.addEventListener(s.replace(/^on/,""),l):l===!0?r.setAttribute(s,""):s==="class"?r.className=l:s==="value"&&e==="textarea"?r.value=l:r.setAttribute(s,l));for(let s of t)s!=null&&s!==!1&&r.append(s);return r}var I={fill:"currentColor",stroke:"none"},We="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Je={estrela:[["path",{d:We}]],estrelaCheia:[["path",{d:We,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...I}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...I}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...I}],["circle",{cx:"12",cy:"12",r:"1.4",...I}],["circle",{cx:"19",cy:"12",r:"1.4",...I}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...I}],["circle",{cx:"15",cy:"6",r:"1.3",...I}],["circle",{cx:"9",cy:"12",r:"1.3",...I}],["circle",{cx:"15",cy:"12",r:"1.3",...I}],["circle",{cx:"9",cy:"18",r:"1.3",...I}],["circle",{cx:"15",cy:"18",r:"1.3",...I}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Nr=Object.keys(Je);function X(e,o=18,t=document){let r="http://www.w3.org/2000/svg",s=t.createElementNS(r,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[d,m]of Object.entries(l))s.setAttribute(d,m);for(let[d,m]of Je[e]){let n=t.createElementNS(r,d);for(let[c,i]of Object.entries(m))n.setAttribute(c,i);s.append(n)}return s}function yt(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function Xe(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function Ye(e,o,t,r,s){let l=e.body??e.documentElement;for(let u of[l,...e.querySelectorAll("dialog")])for(let b of[...u.children])b.classList.contains("spro-aviso")&&b.remove();let d=x("div",{class:"spro-aviso",role:"status"},X("check",16),x("span",{},o),...yt(t).map(u=>x("button",{type:"button",onclick:()=>{d.remove(),u.fazer()}},u.rotulo)));d.setAttribute("popover","manual");let m=()=>{try{d.showPopover?.()}catch{}},n=Date.now()+r,c=()=>{let u=Xe(e);u.append(d),m(),u.localName==="dialog"&&u.addEventListener("close",()=>{if(!(!i||!u.contains(d))){if(s&&Xe(e).localName!=="dialog"&&s(o,t,Math.max(0,n-Date.now()))){i=!1,d.remove();return}c()}},{once:!0})},i=!0;return c(),setTimeout(()=>{i=!1,d.remove()},r),d}var kt=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function Ze(e={}){return({titulo:o,conteudo:t,icone:r,aoFechar:s})=>{let l=x("dialog",{class:"spro-dialogo","aria-label":o}),d=()=>{l.open&&l.close()};return l.append(x("header",{},r?x("span",{class:"spro-dialogo-icone","aria-hidden":"true"},X(r,18)):null,x("h2",{},o),x("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:d},X("fechar",16))),x("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),s?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(kt)?.focus({preventScroll:!0}),{fechar:d}}}function eo(e){let o=Ze();return(t,r)=>(de(t,e),o(r))}function de(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var ue="";function pe(e){ue=e}var T=(e,o)=>eo(ue)(e,o);function oo(e){de(e,ue)}function C(e,o){oo(e),Ye(e,o,void 0,7e3)}var Et=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),to=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Ct(e){let o=0,t=e.split("");return t.forEach((r,s)=>{let l=to.get(r),d=to.get(t[s+1]);o+=l<d?-l:l}),o}function j(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Et.has(o.toLowerCase())&&t!==0?o.toLowerCase():Ct(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function w(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ro={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let r=e.adaptador.getSelectedText(t);if(!r||r.trim()===""){C(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,w(j(r)))}})};var no="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function N(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let r of o)t+=no[r%no.length];return t}var wt=()=>`<span class="ancoraSei checkboxSEI" data-id="${N(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,ao={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,wt()))}})};var me="copyStylePro",fe="cke_copyformatting_active",io=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function At(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),r=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&r?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var so={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(me)??"null")}catch{return null}},s=i=>o.getSelectedHtml(i).trim()!==""||o.getSelectedText(i).trim()!=="",l=i=>!!o.getBodyContainer(i)?.classList.contains(fe),d=i=>{for(let u of e.doc.querySelectorAll(".getCopyStyleButtom"))i==="desabilitar"?u.classList.add("cke_button_disabled"):i==="habilitar"?u.classList.remove("cke_button_disabled"):(u.classList.toggle("cke_button_on",i),u.classList.toggle("cke_button_off",!i))};function m(){let i=o.getInstance();i&&o.getBodyContainer(i)?.classList.remove(fe),t().removeItem(me),d(!1)}function n(i){let u=i??o.getInstance();if(!u)return;if(l(u)){m();return}let b=o.getSelectionElement(u);b&&(t().setItem(me,JSON.stringify(At(b))),o.getBodyContainer(u)?.classList.add(fe),d(!0))}function c(){let i=o.getInstance();if(!i)return;let u=s(i),b=l(i);d(u||b?"habilitar":"desabilitar");let a=r();if(!(a&&u&&b))return;o.withEdit(i,()=>{o.execCommand(i,"removeFormat");for(let[g,h]of[[a.bold,"bold"],[a.underline,"underline"],[a.italic,"italic"],[a.strike,"strike"],[a.subscript,"subscript"],[a.superscript,"superscript"]])g===!0&&o.execCommand(i,h);let p=[];if(typeof a.backgroundColor=="string"&&io.test(a.backgroundColor)&&p.push(`background-color: ${a.backgroundColor}`),typeof a.fontSize=="number"&&Number.isFinite(a.fontSize)&&a.fontSize>0&&a.fontSize<400&&p.push(`font-size: ${a.fontSize}px`),typeof a.color=="string"&&io.test(a.color)&&p.push(`color: ${a.color}`),p.length){let g=o.getSelectedHtml(i);g!==""&&o.insertHtml(i,`<span style="${p.join("; ")}">${g}</span>`)}}),!!e.win.event?.altKey||m()}return{setCopyStyle(i){let u=o.getInstance(i);u&&n(u)},actionCopyStyle:n,getCopyStyle:r,applyCopyStyle:c,removeCopyStyle:m,menuCopyStyle(i){i&&o.addContextMenu(i,u=>o.versao===5?[]:u?.closest("p")&&s(i)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(i)}]:[])}}}};var ge="spro_editor_folha",lo="seipro-folha-editor",be="data-spro-folha-editor",St=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function _t(e){let o=`html[${be}]`,t=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",s="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${s}, -14px 0 24px -14px ${s}`,d=`0 14px 24px -14px ${s}`,m=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${m} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${m}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${m}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${d}; clip-path: inset(0 -30px -30px); }
${m}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${m} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${r} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function co(e,o){if(!e.head||(e.querySelector(`style[data-style="${lo}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",lo),t.textContent=o,e.head.append(t)}function uo(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[r,s]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,s||"")}}var po={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(ge),r=()=>!!e.win.localStorage?.getItem("darkModePro"),s=!1;function l(n){for(let c of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let i=c.contentDocument;i?.head&&(co(i,n?St:null),uo(i.documentElement,n),uo(i.body,n))}}function d(n){let c=[...o.querySelectorAll(".cke_contents")];c.forEach((i,u)=>{if(!n){i.removeAttribute("data-spro-folha");return}let b=[u===0?"primeira":"",u===c.length-1?"ultima":""].filter(Boolean);i.setAttribute("data-spro-folha",b.join(" ")||"meio")})}function m(n){co(o,n?_t(r()):null),l(n),d(n),n?o.documentElement.setAttribute(be,""):o.documentElement.removeAttribute(be);for(let c of o.querySelectorAll(".getPaperViewButtom"))c.classList.toggle("cke_button_on",n),c.classList.toggle("cke_button_off",!n),c.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:m,getPaperViewButtom(n){let c=!t();c?e.win.localStorage.setItem(ge,"1"):e.win.localStorage.removeItem(ge),m(c)},initFolhaEditorPro(){let n=e.win.CKEDITOR;if(typeof n?.on=="function"&&!s){s=!0;let c=i=>i.on("contentDom",()=>t()&&l(!0));for(let i of Object.values(n.instances??{}))c(i);n.on("instanceReady",i=>c(i.editor))}m(t())}}}};function Tt(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var mo={id:"font-size",globais:e=>({changeFontSize(o,t){let r=e.adaptador.getInstance(o);if(!r)return;let s=e.adaptador.getSelectedHtml(r);if(!s||s.trim()===""){C(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=Tt(e.adaptador.getSelectionElement(r)),d=t==="up"?l+2:l-2;d>7&&d<70&&e.adaptador.withEdit(r,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${d}px`}}):e.adaptador.insertHtml(r,`<span style="font-size: ${d}px">${s}</span>`)})}})};var ne=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Mt=[{name:ne,attributes:!0},{name:ne,classes:!0},{name:ne,styles:!0}],Y=e=>e.split("").join("[\\t\\n\\r]*"),he=new RegExp(`^[\\s\\x00-\\x20]*(${Y("javascript")}|${Y("vbscript")}|${Y("livescript")}|${Y("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${Y("text/html")})`,"i"),qt=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:he}]}];function V(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function Z(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var Lt=e=>!!(e?.model&&e.editing&&e.conversion),Rt=e=>Z(e,"EstiloEditing")?.estilos??{},fo=(e,o)=>Object.hasOwn(e,o);function ho(e,o){let t=Z(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function Dt(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function It(e,o,t){if(!o?.is?.("element"))return;let r=t.mapper.toViewElement(o);if(!r)return;let s=Rt(e),l=o.getAttribute("estilo"),d=Dt(o,ho(e,"p")),m=t.writer,n=[];try{n=Array.from(r.getClassNames())}catch{}for(let c of n)c!==l&&fo(s,c)&&m.removeClass(c,r);for(let c of d)fo(s,c)||m.addClass(c,r);l&&m.addClass(l,r)}function $t(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${ho(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let r of o)t.on(r,(s,l,d)=>{try{It(e,l.item,d)}catch{}},{priority:"lowest"})})}function Pt(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function go(e,o){let t=Z(o,"Salvar"),r=t?!!t.isDirty:!1;try{e()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function Nt(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function Ht(e,o){let t=e.getFullData({seiProInterno:!0}),r=o.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||Nt(e)?t:Object.fromEntries(Object.keys(t).map(s=>[s,typeof r[s]=="string"?r[s]:t[s]]))}function zt(e,o,t){try{let r=t??e.adaptador.getSelectionParagraph(o);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let s=r.jquery?r.get(0):r;if(s?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(s);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function Ot(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function bo(e){let o=l=>l??e.adaptador.getInstance();function t(l){let d=o(l);if(!Lt(d))return!1;if(d.__seiProGhsLiberado)return!0;let m=Z(d,"DataFilter");if(!m)return V("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{m.allowElement({name:ne,attributes:!0,classes:!0,styles:!0});for(let n of Mt)m.allowAttributes(n);if(typeof m.disallowAttributes=="function")for(let n of qt)m.disallowAttributes(n)}catch(n){return V("falha ao liberar o GHS",n),!1}return d.__seiProGhsLiberado=!0,$t(d),!0}function r(l){let d=o(l);if(!t(d)||typeof d.getFullData!="function")return!1;let m=!0;return go(()=>{try{d.data.set(Ht(d,e.win))}catch(n){V("falha ao reprocessar o conteudo",n),m=!1}},d),m}function s(l,d,m){let n=o(l);if(!t(n))return!1;let c=Z(n,"GeneralHtmlSupport"),i=zt(e,n,d),u=i?Ot(n,i):null;if(!c||!i||!u)return!1;try{return m(c,u,i),!0}catch(b){return V("falha ao aplicar no model",b),!1}}return{liberar:t,aplicarRegras:r,semSujar:(l,d)=>go(l,o(d)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,d,m)=>s(m,l,(n,c,i)=>n.addModelHtmlClass(c,d,i)),removeClasse:(l,d,m)=>s(m,l,(n,c,i)=>n.removeModelHtmlClass(c,d,i)),setEstilos:(l,d,m)=>s(m,l,(n,c,i)=>n.setModelHtmlStyles(c,d,i)),setAtributos:(l,d,m)=>s(m,l,(n,c,i)=>n.setModelHtmlAttributes(c,d,i))}}var xo={id:"ghs-unlock",globais:e=>({SeiProGhs:bo(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=bo(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||Pt(t)){V("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&V("classes, estilos e atributos liberados no editor")}}};function H(...e){return x("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function q(e,o){return o.classList.add("spro-campo"),o.style.width="100%",x("label",{style:"display:grid;gap:4px;font-size:13px;"},x("span",{},e),o)}function vo(e,o){return new Promise((t,r)=>{let s=new e.Image;s.crossOrigin="anonymous",s.onload=()=>{try{let l=e.document.createElement("canvas");l.width=s.width,l.height=s.height,l.getContext("2d")?.drawImage(s,0,0),t(l.toDataURL("image/png"))}catch(l){r(l)}},s.onerror=()=>r(new Error("imagem nao carregou")),s.src=o})}var Bt="https://latex.codecogs.com/png.latex?",jt="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",Qt="https://editor.codecogs.com/",yo={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(n=>vo(e.win,n)),r=n=>C(e.doc,n);function s(){let n=o;if(!n)return;let c=n.texto.value;n.geracao+=1;let i=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,c==="")return;let u=x("img",{src:`${Bt}${encodeURI(c)}`});n.previa.append(u),t(u.getAttribute("src")??"").then(b=>{o!==n||n.geracao!==i||(u.setAttribute("src",b),u.className="img-base64",n.pronta=!0)},()=>{o===n&&n.geracao===i&&(n.falhou=!0)})}function l(){let n=o;if(!n)return!1;let c=n.texto.value;if(c==="")return r("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let i=n.previa.querySelector("img");if(!n.pronta||!i)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let u=n.ed,b=`<img class="img-base64" src="${w(i.getAttribute("src")??"")}" alt="${w(c)}">`;return e.adaptador.withEdit(u,()=>e.adaptador.insertHtml(u,b)),!0}function d(n){let c=e.adaptador.getInstance(n);if(!c)return;let i=x("textarea",{id:"MathText",rows:"5"});i.addEventListener("input",s);let u=x("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),b=T(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:H(q("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",i),u,x("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",x("a",{href:jt,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",x("a",{href:Qt,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&b.fechar()}},"Inserir")))});o={ed:c,texto:i,previa:u,geracao:0,pronta:!1,falhou:!1};let a=String(e.win.getSelection?.()??"").trim();a!==""&&(i.value=a,s())}function m(){}return{updatePreviewLatex:s,openDialogLatex:d,getDialogLatex:m}}};function xe(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===o.ownerDocument)??t.getInstance()}function ve(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function G(e,o,t,r){let s=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return s&&e.adaptador.recusarEscrita(),s}function ko(e,o){let t=xe(e,o);if(!t)return!1;if(e.adaptador.versao===5){let r=t,s=ve(r,o);return!s||G(e,t,o,s)?!1:(r.model.change(l=>l.setSelection(s)),r.execute("unlink"),!0)}return G(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Eo(e,o,t,r){let s=xe(e,o);if(!s)return!1;if(e.adaptador.versao===5){let l=s,d=ve(l,o);return!d||G(e,s,o,d)?!1:(l.model.change(m=>{m.setSelection(d),l.model.insertContent(m.createText(t,{linkHref:r}))}),!0)}return G(e,s,o,null)?!1:(e.adaptador.withEdit(s,()=>{o.setAttribute("href",r),o.setAttribute("data-cke-saved-href",r),o.textContent=t}),!0)}function ye(e,o){let t=0,r=[];for(let{a:l,texto:d}of o){let m=xe(e,l);if(m)if(e.adaptador.versao===5){let n=ve(m,l);if(!n||G(e,m,l,n))continue;r.push({a:l,texto:d,intervalo:n,ed:m})}else{if(G(e,m,l,null))continue;l.textContent=d,t+=1}}let s=r[0]?.ed;return s&&s.model.change(l=>{for(let{a:d,texto:m,intervalo:n}of[...r].reverse())l.remove(n),l.insertText(m,{linkHref:d.getAttribute("href")??""},n.start),t+=1}),t}function z(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var Ft="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Co=new WeakMap,Vt=e=>{let o=Co.get(e);if(o)return o;let t={balao:null};return Co.set(e,t),t},Gt=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function wo(e){let o=Vt(e),t=a=>C(e.doc,a);function r(a){let f=o.balao;if(f){if(!a){let p=!1;try{p=f.el.matches(":hover")}catch{p=!1}if(p)return}f.el.remove(),o.balao=null}}function s(){if(o.balao)return o.balao.link;let a=e.adaptador.getInstance();return(a?e.adaptador.getSelectionElement(a):null)?.closest("a[href]")??null}async function l(a){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(a),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function d(a,f){r(!0);let p=a?.closest?.("a[href]"),g=p?.getAttribute("href")??"";if(!p||!z(g))return;let h=x("a",{href:g,target:"_blank",rel:"noopener noreferrer",title:p.textContent??"",style:"color:inherit;text-decoration:underline;"},x("strong",{},Gt(g))),v=(M,R,A)=>x("button",{type:"button",class:M,title:R,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:A},R),y=x("div",{class:"linkDisplayPro",style:Ft},h,v("spro-copiar","Copiar",()=>void l(g)),v("spro-editar","Editar",()=>i()),v("spro-remover","Remover",()=>m()));e.doc.body.append(y),o.balao={el:y,link:p};let E=p.getBoundingClientRect?.();if(E){let M=p.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),R=y.getBoundingClientRect?.().width??0,A=Math.max(8,Math.min(E.left+(M?.left??0),(e.win.innerWidth||0)-R-8));y.style.left=`${A}px`,y.style.top=`${E.bottom+(M?.top??0)+4}px`}}function m(a,f){let p=s();p&&(ko(e,p),r(!0))}function n(a,f){let p=s()?.getAttribute("href");p&&z(p)&&e.win.open(p,"_blank","noopener,noreferrer")}function c(a,f){let p=s()?.getAttribute("href");p&&l(p)}function i(){let a=s();if(!a)return;let f=x("input",{type:"text",id:"linkProNome"}),p=x("input",{type:"text",id:"linkProUrl"});f.value=a.textContent??"",p.value=a.getAttribute("href")??"";let g=T(e.doc,{titulo:"Editar link",conteudo:H(q("Texto vis\xEDvel:",f),q("URL:",p),x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=p.value.trim(),v=f.value.trim()||h;if(h==="")return t("Digite um link");if(he.test(h))return t("O link informado \xE9 inv\xE1lido.");Eo(e,a,v,h)&&(r(!0),g.fechar())}},"Salvar")))})}function u(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",a=>{let f=a.target;if(!f||o.balao?.el.contains(f))return;let p=f.closest?.("a[href]");p&&f.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?d(p):r(!1)},!0)}return{globais:{showLinkTips:d,hideLinkTips:a=>r(!1),openLinkPro:n,removeLinkPro:m,copyLinkPro:c,editLinkPro:a=>i(),openDialogLinkPro:i,getDialogLinkPro:()=>{}},iniciar:u}}var Ao={id:"link-pro",globais:e=>wo(e).globais,iniciar:e=>wo(e).iniciar()};var Ut=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function So(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,r,s]=[Number(o[1]),Number(o[2]),Number(o[3])],l=new Date(t,r-1,s);return l.getFullYear()!==t||l.getMonth()!==r-1||l.getDate()!==s?"":`${s} de ${Ut[r-1]} de ${t}`}function ke(e){let o=g=>w(g),t=g=>g!=="",r=t(e.nome)?`, ${o(j(e.nome.trim()))}`:"",s=o(e.sobrenome.toUpperCase()),l=t(e.titulo)?`. <strong>${o(j(e.titulo.trim()))}</strong>`:"",d=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",m=t(e.local)?`, ${o(j(e.local.trim()))}`:"",n=t(e.editora)?`: ${o(j(e.editora.trim()))}`:"",c=t(e.ano)?`, ${o(e.ano)}`:"",i=t(e.volume)?`, v. ${o(e.volume)}`:"",u=t(e.paginas)?`. p.${o(e.paginas)}`:"",b=t(e.link)&&z(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",a=So(e.data),f=a?`. Acesso em: ${a}`:"",p=s+r+l+d+m+n+c+i+u+b+f;return p===""?"":`${p}.`}function O(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function U(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Ce="ntRodape_item",Q="ntRodape_footer",To=".ntRodape_item, .ntRodape, .ntRodape_tr",Mo='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function qo(e,o){let t=w(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function Lo(e){let o=w(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function Ro(e,o=new Set){let t=new Map,r=0;for(let d of e)d.tipo==="item"&&t.set(d.ref,r+=1);let s=[],l=[];for(let d of e){if(d.tipo!=="footer")continue;let m=t.get(d.ref);m!==void 0?s.push({ref:d.ref,chave:m}):o.has(d.ref)?s.push({ref:d.ref,chave:Number.isFinite(d.numero)?d.numero:Number.MAX_SAFE_INTEGER}):l.push(d.ref)}return s.sort((d,m)=>d.chave-m.chave),{numeroDe:t,ordem:s.map(d=>d.ref),orfaos:l}}var Ee=e=>e.getAttribute("data-ntrodape-ref")??"";function Do(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${Ce}[data-ntrodape-ref]`)),r=Array.from(e.querySelectorAll("p.ntRodape")).filter(m=>m.querySelector(`.${Q}[data-ntrodape-ref]`)),s=m=>Number.parseInt(m.querySelector(`.${Q}`)?.getAttribute("data-ntrodape")??"",10),l=Ro([...t.map(m=>({tipo:"item",ref:Ee(m)})),...r.map(m=>({tipo:"footer",ref:Ee(m.querySelector(`.${Q}`)),numero:s(m)}))],o);t.forEach((m,n)=>{m.setAttribute("data-ntrodape",String(n+1)),m.textContent=`[${n+1}]`});let d=new Map;for(let m of r){let n=Ee(m.querySelector(`.${Q}`)),c=l.numeroDe.get(n),i=m.querySelector(`.${Q}`);c!==void 0&&(i.setAttribute("data-ntrodape",String(c)),i.textContent=`[${c}]`),m.remove(),d.set(n,m)}for(let m of l.ordem){let n=d.get(m);n&&e.append(n)}if(!l.ordem.length)for(let m of e.querySelectorAll(".ntRodape_tr"))m.remove();return l}function Io(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${Ce}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var _o=e=>e.getAttribute?.("htmlSpan")?.classes??[],Kt=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function $o(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of e.createRangeIn(o).getItems())if(r.is("$textProxy")||r.is("$text")){let s=_o(r);s.includes(Ce)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):s.includes(Q)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===o){let s=Kt(r);if(s.includes("ntRodape_tr"))t.separadores.push(r);else if(s.includes("ntRodape")){let d=Array.from(e.createRangeIn(r).getItems()).find(m=>(m.is("$textProxy")||m.is("$text"))&&_o(m).includes(Q))?.getAttribute("htmlSpan")?.attributes??{};d["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:d["data-ntrodape-ref"],numero:Number.parseInt(d["data-ntrodape"],10)})}}return t}function Wt(e,o,t){let r=o.getAttribute("htmlSpan")??{},s=`[${t}]`;if(o.data===s&&r.attributes?.["data-ntrodape"]===String(t))return;let l=Object.fromEntries(o.getAttributes());l.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let d=e.createRangeOn(o),m=d.start;e.remove(d),e.insertText(s,l,m)}function Po(e,o,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(s=>{let l=$o(s,o),d=c=>c.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=Ro([...l.itens.map(c=>({tipo:"item",ref:d(c)})),...l.rodapes.map(c=>({tipo:"footer",ref:c.ref,numero:c.numero}))],t);let m=[],n=0;for(let c of l.textos)if(c.tipo==="item")m.push({no:c.no,n:n+=1});else{let i=r.numeroDe.get(d(c.no));i!==void 0&&m.push({no:c.no,n:i})}for(let c of[...m].reverse())Wt(s,c.no,c.n);for(let c of r.orfaos){let i=l.rodapes.find(u=>u.ref===c);i&&s.remove(s.createRangeOn(i.bloco))}for(let c of r.ordem){let i=l.rodapes.find(u=>u.ref===c);i&&s.move(s.createRangeOn(i.bloco),s.createPositionAt(o,"end"))}if(!r.ordem.length)for(let c of l.separadores)s.remove(s.createRangeOn(c))}),r}function No(e,o){e.model.change(t=>{let r=$o(t,o),s=[...r.itens,...r.rodapes.map(l=>l.bloco),...r.separadores];for(let l of[...s].reverse())t.remove(t.createRangeOn(l))})}function ee(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=e.editing.view.document.getRoot(t.rootName);if(r&&e.editing.view.domConverter.mapViewToDom(r)===o)return t}catch{}return null}function Ho(e,o,t){let r=new Set;for(let s of Array.from(e.model.document.roots??[]))if(!(!s||s===o||s.rootName==="$graveyard"))for(let l of t(e.data.get({rootName:s.rootName})))r.add(l);return r}var Jt='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',zo=new WeakSet;function Xt(e,o){let t=e.querySelector(`[name="${o}"], [id="${o}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(o);return r?e.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${r[2]}"]`):null}function P(e){let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||zo.has(t)||(zo.add(t),t.addEventListener("click",r=>{let s=r.target?.closest?.(Jt);if(!s)return;let l=Xt(t,(s.getAttribute("href")??"").slice(1));(l?.closest("p")??l)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var Yt=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],Oo={id:"nota-rodape",globais(e){let o=e.adaptador,t=p=>C(e.doc,p),r=p=>o.getBodyContainer(p),s=p=>o.findInBody(p,To).length>0;function l(p,g){let h=o.versao===5?U(e,g):o.somenteLeitura(p);return h&&o.recusarEscrita(),h}function d(p){let g=e.doc.createElement("div");return g.append(...B(e.doc,p)),Array.from(g.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(h=>h.getAttribute("data-ntrodape-ref")??"")}function m(p){if(o.versao===5){let g=ee(p,r(p));g&&Po(p,g,Ho(p,g,d))}else{let g=r(p);g&&Do(g)}}function n(p){let g=typeof p=="object"&&p&&"model"in p?p:o.getInstance();if(!g)return;let h=o.versao===5?ee(g,r(g)):null;l(g,h)||o.withEdit(g,()=>m(g))}function c(p){let g=p??o.getInstance();if(g){if(!s(g))return t("O documento n\xE3o tem notas de rodap\xE9.");n(g),P(e),t("Notas de rodap\xE9 atualizadas com sucesso")}}function i(p,g){let h=g??o.getInstance();if(!h)return;if(!s(h))return t("O documento n\xE3o tem notas de rodap\xE9.");let v=o.versao===5?ee(h,r(h)):null;l(h,v)||(o.withEdit(h,()=>{if(o.versao===5)No(h,v);else{let y=r(h);y&&Io(y)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function u(p,g){let h=g??o.getInstance();if(!h||p.trim()==="")return;let v=o.versao===5?ee(h,r(h)):null;if(o.versao===5&&!v||l(h,v))return;let y=N(16);o.withEdit(h,()=>{if(o.versao===5){let E=h;E.model.document.selection.getFirstPosition()?.root!==v&&E.model.change(M=>M.setSelection(v,"end"))}o.findInBody(h,".ntRodape_tr").length||o.appendToBody(h,Mo),o.appendToBody(h,qo(y,p)),o.insertHtml(h,Lo(y)),m(h)}),P(e)}function b(p){let g=h=>(p.querySelector(`#${h}`)?.value??"").toString();return Object.fromEntries(Yt.map(([h,v])=>[h,g(v)]))}function a(p){let g=p??e.doc,h=g.querySelector("#nrABNTResult");h&&h.replaceChildren(...B(e.doc,ke(b(g))))}function f(p){let g=p??o.getInstance();if(!g)return;let h=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],v=new Map,y=new Map,E=null,M=S=>{for(let[D]of h){let $=D===S;y.get(D)?.setAttribute("aria-selected",String($)),y.get(D)?.setAttribute("tabindex",$?"0":"-1"),$?v.get(D)?.removeAttribute("hidden"):v.get(D)?.setAttribute("hidden","")}E&&(S==="livre"||S==="abnt"?E.removeAttribute("hidden"):E.setAttribute("hidden",""))},R=x("textarea",{id:"textNotaRodape",rows:"3",style:"width:100%;"}),A=(S,D,$="text")=>x("label",{style:"display:grid;gap:2px;font-size:12px;color:#555;"},x("span",{},S),x("input",{type:$,id:D,style:"width:100%"})),F=x("div",{id:"nrABNTResult",style:"margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"}),J=x("div",{style:"display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;"},A("Nome do autor","nr_Nome"),A("Sobrenome do autor","nr_Sobrenome"),x("div",{style:"grid-column:1 / span 2;"},A("T\xEDtulo da publica\xE7\xE3o","nr_Titulo")),A("N\xFAmero da edi\xE7\xE3o","nr_Edicao","number"),A("Ano da publica\xE7\xE3o","nr_Ano","number"),A("Local (cidade)","nr_Local"),A("Nome da editora","nr_Editora"),A("N\xFAmero do volume","nr_Volume","number"),A("P\xE1ginas inicial-final","nr_Paginas"),A("Link da publica\xE7\xE3o","nr_Link"),A("Data do acesso","nr_Data","date"),x("div",{style:"grid-column:1 / span 2;"},F)),dt={livre:x("div",{},x("label",{for:"textNotaRodape",style:"font-size:12px;color:#555;"},"Texto da nota de rodap\xE9:"),R),abnt:J,atualizar:x("div",{style:"padding:10px 0;display:grid;gap:10px;"},x("p",{},"Atualiza numera\xE7\xF5es e ordem das notas de rodap\xE9 j\xE1 existentes no documento."),x("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>c(g)},"Atualizar")),remover:x("div",{style:"padding:10px 0;display:grid;gap:10px;"},x("p",{},"Remove todas as notas de rodap\xE9 do documento (Ctrl+Z desfaz)."),x("button",{type:"button",id:"btnNrRemove",class:"spro-botao",onclick:()=>{i(null,g),Le.fechar()}},"Remover todas"))},qe=x("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});h.forEach(([S,D],$)=>{let Re=x("button",{type:"button",role:"tab",id:`ntTab_${S}`,"aria-controls":`ntPainel_${S}`,"aria-selected":"false",class:"spro-botao",onclick:()=>M(S),onkeydown:pt=>{let De=pt,Ie=De.key==="ArrowRight"?1:De.key==="ArrowLeft"?-1:0,le=h[($+Ie+h.length)%h.length]?.[0];!Ie||!le||(M(le),y.get(le)?.focus())}},D);y.set(S,Re),qe.append(Re);let ut=x("div",{role:"tabpanel",id:`ntPainel_${S}`,"aria-labelledby":`ntTab_${S}`,hidden:""},dt[S]);v.set(S,ut)}),E=x("button",{type:"button",class:"spro-botao primario",onclick:()=>{let S=(F.textContent??"").trim()?ke(b(J)):"",D=R.value.trim(),$=S||w(D).replace(/\r?\n/g,"<br>");if(!$)return t("Digite o texto da nota de rodap\xE9.");u($,g),Le.fechar()}},"Inserir");for(let S of J.querySelectorAll("input"))S.addEventListener("input",()=>a(J)),S.addEventListener("change",()=>a(J));let Le=T(e.doc,{titulo:"Inserir nota de rodap\xE9",conteudo:x("div",{style:"min-width:480px;font-size:13px;"},qe,...v.values(),x("div",{class:"spro-dialogo-rodape"},E))});M("livre")}return{getNotaRodape(p){let g=o.getInstance(p);g&&f(g)},getDialogNotaRodape:()=>{},openDialogNotaRodape:f,removeNtRodape:i,updateNrABNT:a,insertNtRodape:u,updateNtRodape:c,reorderNtRodape:n}},iniciar(e){P(e)}};function ae(e,o,t,r){let s=e.adaptador.getInstance(o);if(!s)return;let l=e.adaptador.getSelectionParagraph(s);l&&e.adaptador.withEdit(s,()=>{e.adaptador.insertHtmlBefore(s,l,t),r?.(s,l)})}var Zt='<div class="pageBreakPro" style="page-break-after: always"></div>',Bo={id:"page-break",globais:e=>({getPageBreak:o=>ae(e,o,Zt)})};var jo=5,Qo=5,Fo=49,L=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function er(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let s=e?.previousElementSibling??null;s;s=s.previousElementSibling)if(s.classList.contains("divQuickTable"))return s;return o.querySelector(".divQuickTable")}var Vo={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let i of e.doc.querySelectorAll(".divQuickTable"))i.replaceChildren(),re(i);for(let i of e.doc.querySelectorAll(".getQuickTableButtom"))i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")}function r(i){if(!i)return;let u=L(i,"data-row"),b=L(i,"data-col"),a=i.closest("table");if(!a)return;for(let g of a.querySelectorAll("td"))g.classList.remove("td_hover");let f=()=>[...a.querySelectorAll("tr")];if(u>=3&&L(f().at(-1)?.querySelector("td"),"data-row")>u+1&&(f().at(-1)?.remove(),a.setAttribute("data-row",String(L(a,"data-row")-1))),b>=3&&L(f().at(-1)?.lastElementChild,"data-col")>b+1){for(let g of f())g.lastElementChild?.remove();a.setAttribute("data-col",String(L(a,"data-col")-1))}for(let g of a.querySelectorAll("td"))L(g,"data-row")<=u&&L(g,"data-col")<=b&&g.classList.add("td_hover");let p=i.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(p&&(p.textContent=`Tabela ${u+1}x${b+1}`),u===L(a,"data-row")&&u<Fo){let g=f().at(-1)?.cloneNode(!0);g&&(g.querySelectorAll("td").forEach((h,v)=>{h.setAttribute("data-row",String(u+1)),h.setAttribute("data-col",String(v)),h.classList.remove("td_hover")}),(a.querySelector("tbody")??a).append(g),a.setAttribute("data-row",String(u+1)))}if(b===L(a,"data-col")&&b<Fo){for(let g of f()){let h=g.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(b+1)),h.classList.remove("td_hover"),g.append(h))}a.setAttribute("data-col",String(b+1))}}function s(){let i=e.doc,u=i.createDocumentFragment(),b=i.createElement("div");b.className="quickTableInfo",b.textContent="Inserir Tabela";let a=i.createElement("table");a.setAttribute("data-row",String(jo-1)),a.setAttribute("data-col",String(Qo-1));for(let p=0;p<jo;p+=1){let g=i.createElement("tr");for(let h=0;h<Qo;h+=1){let v=i.createElement("td");v.setAttribute("data-row",String(p)),v.setAttribute("data-col",String(h)),g.append(v)}a.append(g)}let f=p=>r(p.target?.closest("td")??null);return a.addEventListener("mouseover",f),a.addEventListener("mouseout",f),a.addEventListener("click",p=>{let g=p.target?.closest("td");g&&c(g)}),u.append(b,a),u}function l(i){if(!i)return;let u=er(i,e.doc);i.classList.contains("cke_button_on")?(t(),i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")):(u&&(u.replaceChildren(s()),te(u)),i.classList.remove("cke_button_off"),i.classList.add("cke_button_on"))}function d(i){let u=i?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),b=u?[...u.querySelectorAll(".getTablestylesButtom")]:[];b.length||(b=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let a of b)a.classList.remove("cke_button_disabled")}function m(i,u){let b='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';b+="  <tbody>";for(let a=0;a<=i;a+=1){b+="      <tr>";for(let f=0;f<=u;f+=1)b+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';b+="      </tr>"}return`${b}  </tbody></table>`}function n(i,u){let b=u?u.nextElementSibling:o.getBodyContainer(i)?.lastElementChild,a=b?.tagName==="TABLE"?b.querySelector("td p"):null;if(!a)return;let f=a.ownerDocument,p=f.defaultView?.getSelection?.();if(!p)return;let g=f.createRange();g.setStart(a.firstChild??a,0),g.collapse(!0),p.removeAllRanges(),p.addRange(g)}function c(i){let u=o.getInstance(i);if(!u){t();return}let b=m(L(i,"data-row"),L(i,"data-col")),a=o.getSelectionParagraph(u);o.withEdit(u,()=>{if(!a)return o.insertHtml(u,b);let f=a.nextElementSibling;f?o.insertHtmlBefore(u,f,b):o.appendToBody(u,b)}),t(),d(i),n(u,a)}return{getQuickTable:l,quickTableOver:r,hideQuickTable:t,quickTableClick:c}}};function ie(e,o,t,r,s){let l=e.adaptador;if(l.versao===5){let m=O(o,t);return m&&U(e,m)?(l.recusarEscrita(),!1):!!e.win.SeiProGhs?.setAtributos(t,{id:r},o)}if(l.somenteLeitura(o))return l.recusarEscrita(),!1;if(s)for(let m of t.querySelectorAll(`a.${s}`))m.remove();let d=t.ownerDocument.createElement("a");return d.setAttribute("name",r),s&&(d.className=s),t.prepend(d),!0}function se(e,o){let t=e.querySelector(`a[name^="${o}"]`);return t?t.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var or=[1,2,3,4],we=["Paragrafo_Numerado_Nivel","Item_Nivel"];function Go(e){let o=we.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of o)r.fill(0);return{item:""}}for(let r=0;r<we.length;r+=1)for(let s of or){if(t!==`${we[r]}${s}`)continue;let l=o[r];l[s-1]=(l[s-1]??0)+1;for(let d=s;d<4;d+=1)l[d]=0;return{item:l.slice(0,s).join(".")}}return{item:""}})}var K="RefPro_",tr="refpro",rr=`a[href^="#${K}"]`,Uo=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,Ko={id:"ref-interna",globais(e){let o=e.adaptador,t=c=>C(e.doc,c);function r(c){let i=c??o.getInstance();if(!i)return!1;let u=o.findInBody(i,"p");if(!u.length)return!1;let b=Go(u.map(f=>({classe:(f.getAttribute("class")??"").trim()}))),a=[];return u.forEach((f,p)=>{let g=b[p]?.item;if(!g)return;let h=se(f,K);a.push({ref:h?h.slice(K.length):N(16),item:g,text:f.textContent??"",ancorado:!!h,el:f})}),a}function s(c,i,u){let b=r(c),a=o.findInBody(c,rr),f=[];if(!b||!a.length)return{mudar:f,perdidas:0};let p=new Map(b.filter(h=>h.ancorado).map(h=>[h.ref,h.item])),g=0;for(let h of a){let v=p.get((h.getAttribute("href")??"").slice(1+K.length));if(v===void 0){g+=1;continue}let y=Uo(i,u,v);(h.textContent??"")!==y&&f.push({a:h,texto:y})}return{mudar:f,perdidas:g}}function l(c,i,u){let{mudar:b,perdidas:a}=s(c,i,u),f=0;return b.length&&o.withEdit(c,()=>f=ye(e,b)),{atualizadas:f,perdidas:a}}function d(c,i,u){let b,a,f;typeof c=="string"||c===void 0?(b=o.getInstance(),a=c??"",f=i===!0):(b=c,a=typeof i=="string"?i:"",f=u===!0),b&&l(b,a,f)}function m(c){let i=o.getInstance(c);if(!i)return;let u=r(i);if(!u||!u.length)return t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");let b=x("input",{type:"text",id:"prefixo",style:"width:70%"}),a=x("input",{type:"checkbox",id:"hidePrefix"}),f=x("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(10,u.length)),style:"width:100%"},...u.map(h=>{let v=h.text.trim(),y=v.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return x("option",{value:`${h.ref}-${h.item}`},`${h.item}. ${y}${y.length<v.length?"...":""}`)})),p=()=>a.matches(":checked")||b.value.trim()==="",g=T(e.doc,{titulo:"Inserir refer\xEAncia interna",conteudo:x("div",{style:"display:grid;gap:12px;min-width:420px;font-size:13px;"},x("label",{style:"display:grid;gap:4px;"},x("span",{},"Prefixo:"),b),x("label",{},a," N\xE3o utilizar prefixo"),x("label",{style:"display:grid;gap:4px;"},x("span",{},"Par\xE1grafo numerado:"),f),x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:h}=l(i,b.value,p());P(e),t(h?`Refer\xEAncias atualizadas. ${h} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),x("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=u.filter(v=>[...f.querySelectorAll("option")].some(y=>y.value===`${v.ref}-${v.item}`&&y.selected));if(!h.length)return t("Selecione ao menos um par\xE1grafo numerado.");n(i,h,b.value,p())&&g.fechar()}},"Inserir")))})}function n(c,i,u,b){if(o.somenteLeitura(c))return o.recusarEscrita(),!1;let a=i.filter(h=>h.el.isConnected);if(!a.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let f=a.map(h=>`<a href="#${K}${w(h.ref)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${w(Uo(u,b,h.item))}</a>`),p=f.length>1?`${f.slice(0,-1).join(", ")} e ${f.at(-1)}`:f[0]??"",g=!1;return o.withEdit(c,()=>{let{mudar:h}=s(c,u,b);h.length&&ye(e,h);for(let v of a)if(!v.ancorado&&!ie(e,c,v.el,`${K}${v.ref}`,tr))return;o.insertHtml(c,` ${p} `),g=!0}),P(e),g}return{getRefInterna:m,updateRefsInternas:d,getNiveisParagrafos:r,clickScroolToRef:()=>P(e)}},iniciar(e){P(e)}};var nr='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',ar="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",Wo={id:"session-break",globais:e=>({getSessionBreak:o=>ae(e,o,nr,(t,r)=>{if(e.adaptador.versao!==5)return;let s=t,l=s.plugins?.has("GeneralHtmlSupport")?s.plugins.get("GeneralHtmlSupport"):null,d=O(s,r)?.previousSibling;l&&d?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":ar},d)})})};var Jo=["seiSlim","seiSlim_parent","seiSlim_view"],Xo={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=s=>{for(let l of o())l.classList.add(s?"cke_button_on":"cke_button_off"),l.classList.remove(s?"cke_button_off":"cke_button_on")};function r(s){if(s==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...Jo)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...Jo)}return{getBoxStyleEditor(s){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),r("remove")):(t(!0),r("set"))},updateStyleEditor:r}}};var ir="seipro-bookmark",Yo="bookmark-",sr=e=>e.replace(/^\./,""),Zo={id:"sumario",globais(e){let o=e.adaptador,t=n=>C(e.doc,n);function r(n){let c=new Set;for(let i of o.findInBody(n,"p")){let u=(i.getAttribute("class")??"").trim().split(/\s+/)[0];u&&c.add(u)}return[...c]}function s(n,c,i){let u=n.map(b=>x("option",{value:`.${b}`,...b===i?{selected:"selected"}:{}},b));return c?[x("option",{value:""},"(nenhum)"),...u]:u}function l(n,c,i){let u=e.doc.querySelector(`select#${c}`);u&&u.replaceChildren(...i.map(([b,a])=>x("option",{value:a},b)))}function d(n,c,i){let u=i??o.getInstance();if(!u)return!1;let b=new Set(c.map(sr).filter(Boolean));if(!b.size)return!1;if(o.somenteLeitura(u))return o.recusarEscrita(),!1;let a=o.findInBody(u,"p").filter(p=>(p.textContent??"").trim()!==""&&[...p.classList].some(g=>b.has(g)));if(!a.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let f='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>';return o.withEdit(u,()=>{for(let g of a){let h=se(g,Yo)??`${Yo}${N(16)}`;ie(e,u,g,h,ir)&&(f+=`<p class="Texto_Alinhado_Esquerda"><a href="#${w(h)}">${w((g.textContent??"").trim())}</a></p>`)}let p=o.versao===5?o.getSelectionParagraph(u):null;p?o.insertHtmlBefore(u,p,f):o.insertHtml(u,f)}),!0}function m(n,c){let i=c??o.getInstance();if(!i)return;let u=r(i);if(!u.length)return t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");let b=(h,v,y)=>x("select",{id:h},...s(u,v,y)),a=b("listStyle1",!1,"Item_Nivel1"),f=b("listStyle2",!0,"Item_Nivel2"),p=b("listStyle3",!0,"Item_Nivel3"),g=T(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:H(q("Estilo do T\xEDtulo 1 (obrigat\xF3rio):",a),q("Estilo do T\xEDtulo 2:",f),q("Estilo do T\xEDtulo 3:",p),x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=[a.value,f.value,p.value].filter(v=>v!=="");if(!h.length)return t("Escolha o estilo do T\xEDtulo 1.");d(null,[...new Set(h)],i)&&g.fechar()}},"Inserir")))})}return{getSumarioDocumento(n){let c=o.getInstance(n);c&&m(null,c)},getListStylesDocumento(n,c){let i=c??o.getInstance();return i?s(r(i),!1):[]},updateSelectDialog:(n,c)=>l(null,n,c),getDialogSumarioDocumento:n=>m(null,n),getDialogSumarioDocumento_:()=>m(null),insertSumarioDocumento:(n,c)=>d(null,n,c)}}};var W={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function Ae(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function Se(e){let o={};for(let t of e.split(";")){let r=t.indexOf(":");if(r<=0)continue;let s=t.slice(0,r).trim(),l=t.slice(r+1).trim();s&&l&&(o[s]=l)}return o}function lr(e,o,t){let r=[];for(let s=0;s<o;s+=1){let l=s===0,d=l?e.trCabecalho:Array.isArray(e.tr)?s%2===0?e.tr[1]:e.tr[0]:e.tr,m=Array.from({length:t},(n,c)=>({td:l?e.tdCabecalho:c===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));r.push({tr:d,celulas:m})}return{linhas:r}}var _e=e=>Array.from(e.querySelectorAll("td, th"));function et(e,o,t,r,s){let l=e.adaptador,d=Array.from(t.querySelectorAll("tr")),m=lr(r,d.length,Math.max(0,...d.map(n=>_e(n).length)));if(l.versao===5){let n=o,c=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,i=O(n,t.closest("figure")??t);return!c||!i?!1:U(e,i)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{c.setModelHtmlStyles("table",Se(r.table),i),d.forEach((u,b)=>{let a=m.linhas[b];if(!a)return;let f=O(n,u);f&&c.setModelHtmlStyles("tr",Se(a.tr),f),_e(u).forEach((p,g)=>{let h=O(n,p);if(h){c.setModelHtmlStyles("td",Se(a.celulas[g]?.td??""),h);for(let v of h.getChildren())v.name==="paragraph"&&n.model.change(y=>y.setAttribute("estilo",a.celulas[g]?.p,v))}})}),r.cabecalho&&n.model.change(u=>u.setAttribute("headingRows",1,i))}),!0)}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let n=t.ownerDocument;if(t.setAttribute("style",r.table),d.forEach((c,i)=>{let u=m.linhas[i];u&&(c.setAttribute("style",u.tr),_e(c).forEach((b,a)=>{b.setAttribute("style",u.celulas[a]?.td??"");let f=u.celulas[a]?.p??"",p=b.querySelectorAll("p");if(p.length)for(let g of p)g.setAttribute("class",f);else{let g=n.createElement("p");g.setAttribute("class",f),g.append(...Array.from(b.childNodes)),b.append(g)}}))}),r.cabecalho&&d[0]&&!t.querySelector("thead")){let c=n.createElement("thead");c.append(d[0]),t.prepend(c)}s?.aoFinalCk4?.(t)}),!0)}var ot="color1",cr="Clique na tabela que deseja aplicar o estilo!",Te="dark-mode-color-";function dr(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function ur(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${Te}black`,`${Te}white`),o.classList.add(`${Te}${dr(t)>125?"black":"white"}`))}}var tt={id:"table-styles",globais(e){let o=e.adaptador,t=n=>o.getSelectionElement(n)?.closest("table")??null;function r(n,c){let i=n.querySelector("#addEstiloTabela");i&&c&&/^color\d+$/.test(c)&&(i.className=c)}function s(n,c,i,u=!0,b){let a=i??o.getInstance();if(!a||!c)return;let[f,p,g]=c,h=W[p],v=Number(g),y=h&&Number.isFinite(v)?Ae(h,v)[f]:void 0,E=b?.isConnected?b:b?null:t(a);!y||!E||et(e,a,E,{...y,cabecalho:u},{aoFinalCk4:ur})}function l(){let n=Object.keys(W),c=Object.keys(Ae(W[ot])),i=x("div",{id:"selectColorTabela",class:"listaCoresTabela"},...n.map((b,a)=>x("span",{},x("label",{for:`colorStyle${a+1}`},x("a",{class:"iconSelectColorTable",style:`background-color: ${W[b]?.light}`}),x("a",{class:"iconSelectColorTable",style:`background-color: ${W[b]?.dark}`})),x("br"),x("input",{type:"radio",name:"colorStyle","data-colorid":b,id:`colorStyle${a+1}`,value:`colorStyle${a+1}`,...a===0?{checked:"checked"}:{}})))),u=[];return c.forEach((b,a)=>{a%7===0&&u.push(x("div",{class:"listaEstiloTabela"}));let f=a+1;u[u.length-1]?.append(x("span",{},x("label",{for:`tableStyle${f}`},x("a",{class:"iconSelectStyleTable",style:`background-position-y: -${f*43}px`})),x("br"),x("input",{type:"radio",name:"tableStyle",id:`tableStyle${f}`,value:`tableStyle${f}`,...a===0?{checked:"checked"}:{}})))}),x("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},x("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),i,x("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),x("div",{id:"addEstiloTabela",class:ot},...u),x("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",x("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),x("div",{style:"padding: 10px 0;"},x("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",x("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function d(n){try{let c=u=>Number.parseFloat(u?e.win.getComputedStyle(u).width:""),i=Math.round(100*c(n)/c(n?.parentElement??null));return Number.isFinite(i)?Math.min(100,Math.max(5,i)):80}catch{return 80}}function m(n,c){let i=c??o.getInstance();if(!i)return;let u=t(i),b=l(),a=b.querySelector("#addEstiloTableWidth");a&&(a.value=String(d(u)));for(let p of b.querySelectorAll('input[name="colorStyle"]'))p.addEventListener("change",()=>r(b,p.getAttribute("data-colorid")));let f=T(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:x("div",{},b,x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:()=>{let p=b.querySelector('input[name="tableStyle"]:checked')?.value,g=b.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),h=b.querySelector("#addEstiloTableWidth")?.value,v=b.querySelector("#addEstiloTableHeader:checked")!==null;!p||!g||!h||(s(null,[p,g,h],i,v,u),f.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(n){let c=o.getInstance(n);c&&(t(c)?m(null,c):C(e.doc,cr))},changeColorTable(n){r(e.doc,n?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:n=>m(null,n),getSyleTable(n){let c=o.getInstance(n);c&&o.withEdit(c,()=>{})},setSyleTable:(n,c)=>s(null,n,c)}}};var rt=/^[0-9A-Za-z-]+$/,pr="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",mr=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,nt={id:"tiny-url",globais(e){let o=d=>C(e.doc,d),t=d=>(e.fetch??e.win.fetch.bind(e.win))(d);async function r(d,m,n,c){let i=new URLSearchParams({url:d});m!==""&&i.set("alias",m);let u;try{u=await t(`https://tinyurl.com/api-create.php?${i}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(u.status===400)return o("Erro: Nenhuma link gerado"),!1;if(u.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let b=(await u.text()).trim();if(u.status!==200||!mr.test(b))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(b),!0;let a=c??e.adaptador.getInstance();if(!a)return!1;let f=`<a href="${w(b)}" class="ancoraSei" target="_blank">${w(b)}</a>`;return e.adaptador.withEdit(a,()=>e.adaptador.insertHtml(a,f)),!0}function s(d){let m=e.adaptador.getInstance(d);if(!m)return;let n=x("input",{type:"text",id:"urlTiny"}),c=x("input",{type:"text",id:"aliasTiny"}),i=x("div",{id:"tinyResult"}),u=String(e.win.getSelection?.()??"").trim();u!==""&&z(u)&&(n.value=u),c.addEventListener("input",()=>{i.replaceChildren();let a=c.value;a!==""&&(rt.test(a)?i.append(`Resultado: https://tinyurl.com/${a}`):i.append(x("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let b=T(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:H(q("Insira o link que deseja encurtar:",n),q("Insira um Nome Personalizado para o link (opcional):",c),i,x("div",{class:"spro-dialogo-rodape"},x("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let a=n.value.trim(),f=c.value.trim();if(a===""||!z(a))return o("Digite um link v\xE1lido!");if(f!==""&&!rt.test(f))return o(pr);if(f!==""&&f.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(a,f,"insert",m)&&b.fechar()}},"Inserir")))})}return{getTinyUrl:s,ajaxTinyUrl:(d,m,n)=>r(d,m,n)}}};var Me=[xo,Bo,Wo,ao,ro,Ke,mo,Xo,Vo,po,nt,yo,so,Ao,tt,Zo,Ko,Oo];function at(e,o,t){let r=e,s=[],l=[];for(let d of o){let m=!0;try{for(let[n,c]of Object.entries(d.globais(t))){if(r[n]!==void 0){m=!1,l.push({id:d.id,erro:new Error(`global ja definido: ${n}`)});continue}r[n]=c}}catch(n){m=!1,l.push({id:d.id,erro:n})}m&&s.push(d.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:d.id})}catch{}}return{instalados:s,falhas:l}}function it(e,o){let t=[];for(let r of e)try{r.iniciar?.(o)}catch(s){t.push({id:r.id,erro:s})}return t}var st=`/*
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
`;pe(st);var lt="__seiProEditorTs",ct=window;if(!ct[lt]){ct[lt]=!0;let e=He(window);e.aoRecusarEscrita(()=>C(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(ze)??"",checkOpcao:t=>Fe(t),verifyOpcao:t=>Ve(t)};for(let t of at(window,Me,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of it(Me,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
