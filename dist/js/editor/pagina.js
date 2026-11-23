/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function go(o,e){let t=o.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${e}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(a=>o.importNode(a,!0))}function qo(o,e){if(!o||typeof e!="function")return;let t=o,r=t.__seiProCtxBuilders;if(!r){let a=[];r=t.__seiProCtxBuilders=a,o.addEventListener("contextmenu",c=>{let l=c;if(l.shiftKey)return;let p=[];for(let n of a)try{p=p.concat(n(l.target)||[])}catch{}p.length&&(l.preventDefault(),Ar(o.ownerDocument,p,l.clientX,l.clientY))})}r.includes(e)||r.push(e)}function Ar(o,e,t,r){o.getElementById("seiProCtxMenu")?.remove();let a=o.createElement("div");a.id="seiProCtxMenu",a.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",a.style.left=`${t}px`,a.style.top=`${r}px`;for(let l of e){let p=o.createElement("div");p.textContent=l.label,p.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",p.addEventListener("mouseenter",()=>{p.style.background="#eef"}),p.addEventListener("mouseleave",()=>{p.style.background=""}),p.addEventListener("click",()=>{a.remove(),l.action()}),a.append(p)}o.body.append(a);let c=()=>{a.remove(),o.removeEventListener("mousedown",c)};setTimeout(()=>o.addEventListener("mousedown",c),0)}function Ce(o,e,t){if(typeof t!="function")return;let r=o.__seiProCtx;if(!r){let a={acoes:{},construtores:[]};r=o.__seiProCtx=a;try{o.addMenuGroup("seiProGroup",5)}catch{}o.contextMenu.addListener(c=>{let l=c?.$??null,p=null;for(let n of a.construtores){let d=[];try{d=n(l)||[]}catch{d=[]}for(let i of d){let u=`seiPro_${String(i.label).replace(/[^A-Za-z0-9]/g,"_")}`;a.acoes[u]=i.action,o.getCommand(u)||o.addCommand(u,{exec:()=>(a.acoes[u]?.(),!0)}),o.getMenuItem(u)||o.addMenuItem(u,{label:i.label,command:u,group:"seiProGroup"}),p=p??{},p[u]=e}}return p})}r.construtores.includes(t)||r.construtores.push(t)}var F=o=>o;function Ae(o,e={}){let t=()=>o.CKEDITOR,r=n=>!!n?.name&&t()?.instances[n.name]===n,a=n=>r(n)&&!n.readOnly,c=n=>F(n).document?.getBody()?.$??null,l=(n,d)=>{if(!n)return;let i=F(n);if(i.readOnly){e.fn?.();return}d(i)},p={versao:4,getInstance(n){let d=t();if(!d?.instances)return null;if(r(d.currentInstance))return d.currentInstance;let i=n?.closest?.("div.cke"),u=i?d.instances[i.id.replace("cke_","")]:void 0;if(a(u))return u;if(a(o.oEditor))return o.oEditor;let b=Object.values(d.instances);return b.find(s=>a(s))??b[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>F(n).focus(),saveSnapshot:n=>F(n).fire("saveSnapshot"),withEdit(n,d){let i=F(n);i.focus(),i.fire("saveSnapshot"),i.fire("lockSnapshot",{dontUpdate:!0});try{d()}finally{i.fire("unlockSnapshot"),i.fire("saveSnapshot")}},insertHtml:(n,d)=>l(n,i=>i.insertHtml(d)),insertText:(n,d)=>l(n,i=>i.insertText(d)),getSelectionElement:n=>F(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return p.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,d,i){l(n,()=>d.before(...go(d.ownerDocument,i)))},getToolbarContainer:n=>F(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>c(n),findInBody(n,d){let i=c(n);return i?Array.from(i.querySelectorAll(d)):[]},appendToBody(n,d){l(n,i=>{let u=c(i);u&&u.append(...go(u.ownerDocument,d))})},transformBodyHtml(n,d){l(n,i=>{let u=c(i);if(!u)return;let b=u.innerHTML,s=d(b);typeof s=="string"&&s!==b&&u.replaceChildren(...go(u.ownerDocument,s))})},execCommand:(n,d,i)=>F(n).execCommand(d,i),applyStyle(n,d){let i=t()?.style;i&&F(n).applyStyle(new i(d))},getData:n=>F(n).getData(),setData:(n,d)=>l(n,i=>i.setData(d)),insertElement(n,d){l(n,i=>{let u=t()?.dom?.element.createFromHtml;u&&i.insertElement?i.insertElement(u(d,i.document)):i.insertHtml(d)})},saveSelection:n=>F(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,d){let i=F(n).getSelection();i&&d&&i.selectBookmarks(d)},getSelectedText:n=>F(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return F(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,d,i)=>F(n).on(d,i),off:(n,d,i)=>F(n).removeListener(d,i),fire:(n,d,i)=>F(n).fire(d,i),addContextMenu(n,d){let i=F(n),u=t();if(u&&i.contextMenu&&typeof i.addMenuItem=="function"){Ce(i,u.TRISTATE_OFF,d);return}qo(c(n),d)},waitReady(n){return new Promise((d,i)=>{let u=Date.now(),b=()=>{let s=Object.values(t()?.instances??{}).find(f=>f.status==="ready");if(s)return d(s);if(Date.now()-u>n)return i(new Error("Timeout aguardando CKEditor 4"));setTimeout(b,100)};b()})},somenteLeitura:n=>!!F(n).readOnly,aoRecusarEscrita(n){e.fn=n},recusarEscrita(){e.fn?.()}};return p}var O=o=>o,Sr={strike:"strikethrough",strikethrough:"strikethrough"},Tr={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},Pr=0;function Se(o,e={}){let t=o.document,r=s=>Array.from(s.model.document.roots??[]).filter(f=>f.isAttached()&&f.rootName!=="$graveyard"),a=s=>o.INFRA_EDITOR_CONFIG?.rootsAttributes?.[s],c=(s,f)=>{let m=s.editing.view.document.getRoot(f);return m?s.editing.view.domConverter.mapViewToDom(m):null},l=s=>{for(let h of r(s))if(a(h.rootName)?.principal){let y=c(s,h.rootName);if(y)return y}let f=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return f||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((h,y)=>y.childElementCount>(h?h.childElementCount:-1)?y:h,null)},p=s=>{let f=l(s);return f&&r(s).find(m=>c(s,m.rootName)===f)||null},n=s=>s.model.document.selection.getFirstPosition()?.root.rootName??null,d=s=>!!s&&!!a(s)?.somenteLeitura,i=(s,f)=>s.data.toModel(s.data.processor.toView(f)),u=(s,f)=>{let m=O(s);if(d(n(m)))return e.fn?.();m.model.change(()=>m.model.insertContent(i(m,f),m.model.document.selection))},b={versao:5,getInstance(){let s=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return s&&s.state==="ready"?s:null},getAllInstances(){let s=b.getInstance();return s?[s]:[]},focus:s=>O(s).focus(),saveSnapshot(){},withEdit(s,f){let m=O(s);m.focus(),m.model.change(()=>f())},insertHtml:u,insertText(s,f){let m=O(s);if(d(n(m)))return e.fn?.();m.model.change(h=>m.model.insertContent(h.createText(f)))},getSelectionElement(){let s=o.getSelection?.(),f=s&&s.rangeCount>0?s.anchorNode:null;return f?f.nodeType===1?f:f.parentElement:null},getSelectionParagraph:s=>b.getSelectionElement(s)?.closest("p")??null,insertHtmlBefore(s,f,m){let h=O(s),y=h.editing.view.domConverter.mapDomToView(f),x=y?h.editing.mapper.toModelElement(y):null;if(x){if(d(x.root?.rootName))return e.fn?.();h.model.change(k=>h.model.insertContent(i(h,m),k.createPositionBefore(x)));return}u(s,m)},getToolbarContainer(s){let f=O(s).ui?.view?.toolbar?.element;return f?f.querySelector(".ck-toolbar__items")??f:null},getBodyContainer:s=>l(O(s)),findInBody(s,f){let m=l(O(s));return m?Array.from(m.querySelectorAll(f)):[]},appendToBody(s,f){let m=O(s),h=p(m);if(!h)return u(s,f);if(d(h.rootName))return e.fn?.();m.model.change(y=>m.model.insertContent(i(m,f),y.createPositionAt(h,"end")))},transformBodyHtml(s,f){let m=O(s),h=p(m);if(!h)return;let y=m.data.get({rootName:h.rootName,seiProInterno:!0}),x=f(y);if(typeof x!="string"||x===y)return;let k=m.model.document.selection.getFirstRange(),v=k&&k.start.root.rootName===k.end.root.rootName?{raiz:k.start.root,ps:[...k.start.path],pe:[...k.end.path]}:null,E=m.model.document.selection.isBackward;m.data.set({[h.rootName]:x}),v&&m.model.change(C=>{let S,w;try{S=m.model.createPositionFromPath(v.raiz,v.ps),w=m.model.createPositionFromPath(v.raiz,v.pe)}catch{S=w=C.createPositionAt(v.raiz,"end")}C.setSelection(C.createRange(S,w),{backward:E})})},execCommand(s,f,m){O(s).execute(Sr[f]??f,m!==void 0?{value:m}:void 0)},applyStyle(s,f){let m=Tr[f.element.toLowerCase()];m&&O(s).execute(m)},getData(s){let f=O(s),m=p(f);return m?f.data.get({rootName:m.rootName}):f.data.get()},setData(s,f){let m=O(s),h=p(m);h?m.data.set({[h.rootName]:f}):m.data.set(f)},insertElement:(s,f)=>b.insertHtml(s,f),saveSelection(s){let f=O(s),m=`spro-ed:${Pr++}`;return f.model.change(h=>{let y=f.model.document.selection.getFirstRange();y&&h.addMarker(m,{range:y,usingOperation:!1})}),m},restoreSelection(s,f){let m=O(s);if(typeof f!="string")return;let h=m.model.markers.get(f);h&&m.model.change(y=>y.setSelection(h.getRange())),m.model.change(y=>{m.model.markers.has(f)&&y.removeMarker(f)})},getSelectedText:()=>String(o.getSelection?.()??""),getSelectedHtml(){let s=o.getSelection?.();if(!s||s.rangeCount===0)return"";let f=t.createElement("div");return f.append(s.getRangeAt(0).cloneContents()),f.innerHTML},on(s,f,m){if(f==="change")return O(s).model.document.on("change:data",m);l(O(s))?.addEventListener(f,m)},off(s,f,m){if(f==="change")return O(s).model.document.off("change:data",m);l(O(s))?.removeEventListener(f,m)},fire(s,f,m){l(O(s))?.dispatchEvent(new CustomEvent(f,{detail:m}))},addContextMenu(s,f){qo(l(O(s)),f)},waitReady(s){return new Promise((f,m)=>{let h=Date.now(),y=()=>{let x=b.getInstance();if(x)return f(x);if(Date.now()-h>s)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(y,100)};y()})},somenteLeitura:s=>d(n(O(s))),aoRecusarEscrita(s){e.fn=s},recusarEscrita(){e.fn?.()}};return b}function Fo(o){return o.document.querySelector(".ck-editor__editable")?5:o.CKEDITOR?.instances?4:0}function Te(o){let e=null,t={},r=()=>{if(e)return e;let l=Fo(o);return l===5?e=Se(o,t):l===4&&(e=Ae(o,t)),e},a=()=>{let l=r();if(!l)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return l},c=l=>((...p)=>a()[l](...p));return{get versao(){return r()?.versao??0},getInstance:l=>r()?.getInstance(l)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:c("focus"),saveSnapshot:c("saveSnapshot"),withEdit:c("withEdit"),insertHtml:c("insertHtml"),insertText:c("insertText"),getSelectionElement:c("getSelectionElement"),getSelectionParagraph:c("getSelectionParagraph"),insertHtmlBefore:c("insertHtmlBefore"),getToolbarContainer:c("getToolbarContainer"),getBodyContainer:c("getBodyContainer"),findInBody:c("findInBody"),appendToBody:c("appendToBody"),transformBodyHtml:c("transformBodyHtml"),execCommand:c("execCommand"),applyStyle:c("applyStyle"),getData:c("getData"),setData:c("setData"),insertElement:c("insertElement"),saveSelection:c("saveSelection"),restoreSelection:c("restoreSelection"),getSelectedText:c("getSelectedText"),getSelectedHtml:c("getSelectedHtml"),on:c("on"),off:c("off"),fire:c("fire"),addContextMenu:c("addContextMenu"),somenteLeitura:c("somenteLeitura"),aoRecusarEscrita(l){t.fn=l},recusarEscrita(){t.fn?.()},waitReady(l){let p=Date.now();return new Promise((n,d)=>{let i=()=>{let u=r();if(u)return u.waitReady(Math.max(1,l-(Date.now()-p))).then(n,d);if(Date.now()-p>l)return d(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(i,100)};i()})}}}var Pe="data-base";function Le(o,e){let t=o;if(typeof o=="string"){if(!o.trim())return;try{t=JSON.parse(o)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function _e(o,e){let t=Le(o,e);return!(t===!1||t===0||t==="")}function Me(o,e){let t=Le(o,e);return t===!0||t===1||t==="1"}function qe(o=localStorage){try{return o.getItem("configBasePro")}catch{return null}}function De(o,e=localStorage){return _e(qe(e),o)}function Ie(o,e=localStorage){return Me(qe(e),o)}function Do(o){o.style.display="",o.ownerDocument.defaultView?.getComputedStyle?.(o)?.display==="none"&&(o.style.display="block")}function Io(o){o.style.display="none"}var Re=o=>(o?.nodeType===1?o:o?.parentElement??null)?.closest("p")??null;function $e(o){let e=()=>o.adaptador.versao===5,t=(r,a)=>{let c=r.editing.view.domConverter.mapDomToView(a);return c?r.editing.mapper.toModelElement(c):null};return{selecionados(r){let a=()=>{let s=o.adaptador.getSelectionParagraph(r);return s?[s]:[]};if(e()){let s=r,m=[...s.model.document.selection.getSelectedBlocks()].map(h=>{let y=s.editing.mapper.toViewElement(h);return y?s.editing.view.domConverter.mapViewToDom(y):null}).filter(h=>!!h&&h.tagName==="P");return m.length?m:a()}let l=o.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!l||l.rangeCount===0||!l.anchorNode)return a();let p=Re(l.anchorNode),n=Re(l.focusNode);if(!p&&!n||(p=p??n,n=n??p,!p||!n))return a();if(p===n)return[p];let d=p,i=n;p.compareDocumentPosition(n)&2&&(d=n,i=p);let u=[],b=d;for(let s=0;b&&s<5e3&&(b.tagName.toLowerCase()==="p"&&u.push(b),b!==i);s+=1)b=b.nextElementSibling;return u.length?u:[d]},classeDeEstilo(r,a){return e()?t(r,a)?.getAttribute("estilo")??"":a.getAttribute("class")??""},definirClasse(r,a,c){if(e()){let l=r,p=t(l,a);p&&l.model.change(n=>n.setAttribute("estilo",c,p)),o.win.SeiProGhs?.setEstilos(a,{"text-align":null},r);return}a.removeAttribute("style"),a.setAttribute("class",c)},definirTextAlign(r,a,c){if(e()){o.win.SeiProGhs?.setEstilos(a,{"text-align":c},r);return}a.removeAttribute("style"),a.style.textAlign=c}}}var Lr=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function _r(o,e){let t=Lr.find(r=>Object.values(r).includes(o));return t?t[e]:null}function Mr(o,e){let t=o?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=o?.parentElement??null;r;r=r.parentElement){let a=r.querySelector(".divAlignText");if(a)return a}return e.querySelector(".divAlignText")}var Ne={id:"align",globais(o){let e=$e(o);return{setAlignText(t,r){let a=o.adaptador.getInstance(t);if(!a||o.adaptador.somenteLeitura(a))return;let c=e.selecionados(a);c.length&&o.adaptador.withEdit(a,()=>{for(let l of c){let p=_r(e.classeDeEstilo(a,l),r);p?e.definirClasse(a,l,p):e.definirTextAlign(a,l,r)}})},openAlignText(t){if(!t)return;let r=Mr(t,o.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&Io(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&Do(r))},closeAlignText(){for(let t of o.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of o.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function g(o,e={},...t){let r=document.createElement(o);for(let[a,c]of Object.entries(e))c===void 0||c===!1||(typeof c=="function"?r.addEventListener(a.replace(/^on/,""),c):c===!0?r.setAttribute(a,""):a==="class"?r.className=c:a==="value"&&o==="textarea"?r.value=c:r.setAttribute(a,c));for(let a of t)a!=null&&a!==!1&&r.append(a);return r}var to={fill:"currentColor",stroke:"none"},He="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",ze={estrela:[["path",{d:He}]],estrelaCheia:[["path",{d:He,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...to}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...to}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...to}],["circle",{cx:"12",cy:"12",r:"1.4",...to}],["circle",{cx:"19",cy:"12",r:"1.4",...to}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...to}],["circle",{cx:"15",cy:"6",r:"1.3",...to}],["circle",{cx:"9",cy:"12",r:"1.3",...to}],["circle",{cx:"15",cy:"12",r:"1.3",...to}],["circle",{cx:"9",cy:"18",r:"1.3",...to}],["circle",{cx:"15",cy:"18",r:"1.3",...to}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},qn=Object.keys(ze);function X(o,e=18,t=document){let r="http://www.w3.org/2000/svg",a=t.createElementNS(r,"svg"),c={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[l,p]of Object.entries(c))a.setAttribute(l,p);for(let[l,p]of ze[o]){let n=t.createElementNS(r,l);for(let[d,i]of Object.entries(p))n.setAttribute(d,i);a.append(n)}return a}function qr(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Qe(o){let e=[...o.querySelectorAll("dialog[open]")],t=!0;return e.filter(c=>{try{return c.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:e.at(-1))??o.body??o.documentElement}function Oe(o,e,t,r,a){let c=o.body??o.documentElement;for(let u of[c,...o.querySelectorAll("dialog")])for(let b of[...u.children])b.classList.contains("spro-aviso")&&b.remove();let l=g("div",{class:"spro-aviso",role:"status"},X("check",16),g("span",{},e),...qr(t).map(u=>g("button",{type:"button",onclick:()=>{l.remove(),u.fazer()}},u.rotulo)));l.setAttribute("popover","manual");let p=()=>{try{l.showPopover?.()}catch{}},n=Date.now()+r,d=()=>{let u=Qe(o);u.append(l),p(),u.localName==="dialog"&&u.addEventListener("close",()=>{if(!(!i||!u.contains(l))){if(a&&Qe(o).localName!=="dialog"&&a(e,t,Math.max(0,n-Date.now()))){i=!1,l.remove();return}d()}},{once:!0})},i=!0;return d(),setTimeout(()=>{i=!1,l.remove()},r),l}var Dr=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function Ro(o={}){return({titulo:e,conteudo:t,icone:r,largura:a,aoFechar:c})=>{let l=g("dialog",{class:"spro-dialogo","aria-label":e});a&&(l.style.width=`min(${a}px, calc(100vw - 24px))`);let p=()=>{l.open&&l.close()};return l.append(g("header",{},r?g("span",{class:"spro-dialogo-icone","aria-hidden":"true"},X(r,18)):null,g("h2",{},e),g("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:p},X("fechar",16))),g("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),o.aoFechar?.(),c?.()}),document.body.append(l),o.aoAbrir?.(),l.showModal(),l.querySelector(Dr)?.focus({preventScroll:!0}),{fechar:p}}}function je(o){return(e,t="Confirmar",r="Cancelar")=>new Promise(a=>{let c=!1,l=null,p=g("div",{},g("p",{},e),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao",onclick:()=>l?.fechar()},r),g("button",{type:"button",class:"spro-botao perigo",onclick:()=>{c=!0,l?.fechar()}},t)));l=o({titulo:"Confirmar",icone:"alerta",conteudo:p,aoFechar:()=>a(c)})})}function Be(o){let e=Ro();return(t,r)=>(Go(t,o),Vo(t),e(r))}function Vo(o){let e=o.documentElement.getAttribute("data-spro-tema")==="escuro";try{e||=!!o.defaultView?.localStorage?.getItem("darkModePro")}catch{}o.documentElement.setAttribute("data-tema",e?"escuro":"claro")}function Go(o,e){if(o.querySelector('style[data-seipro-editor="base"]'))return;let t=o.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=e,(o.head??o.documentElement).append(t)}var Uo="";function Wo(o){Uo=o}var H=(o,e)=>Be(Uo)(o,e);function $o(o){Go(o,Uo),Vo(o)}function D(o,e){$o(o),Oe(o,e,void 0,7e3)}var Ir=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),Fe=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Rr(o){let e=0,t=o.split("");return t.forEach((r,a)=>{let c=Fe.get(r),l=Fe.get(t[a+1]);e+=c<l?-c:c}),e}function fo(o){return!o||typeof o!="string"||o.trim()===""?"":o.includes(" ")?o.split(" ").map((e,t)=>e===""?e:Ir.has(e.toLowerCase())&&t!==0?e.toLowerCase():Rr(e)>0?e.toUpperCase():e[0].toUpperCase()+e.substring(1).toLowerCase()).join(" "):o[0].toUpperCase()+o.substring(1).toLowerCase()}function N(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Ve={id:"cap-letter",globais:o=>({convertFirstLetter(e){let t=o.adaptador.getInstance(e);if(!t)return;let r=o.adaptador.getSelectedText(t);if(!r||r.trim()===""){D(o.doc,"Selecione um texto para converter");return}o.adaptador.insertHtml(t,N(fo(r)))}})};var Ge="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function po(o){let e=new Uint32Array(Math.max(0,o));crypto.getRandomValues(e);let t="";for(let r of e)t+=Ge[r%Ge.length];return t}var $r=()=>`<span class="ancoraSei checkboxSEI" data-id="${po(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,Ue={id:"checkbox",globais:o=>({getInsertCheckboxButtom(e){let t=o.adaptador.getInstance(e);t&&o.adaptador.withEdit(t,()=>o.adaptador.insertHtml(t,$r()))}})};function z(...o){return g("div",{class:"spro-form"},...o)}function V(o,...e){return g("div",{class:o==="auto"?"spro-grade":`spro-grade ${o}`},...e)}function Y(...o){return g("p",{class:"spro-dica"},...o)}var Nr=new Set(["text","number","date","url","search","password","email","tel","file",""]);function Hr(o){if(o.nodeType!==1)return o;let e=o,t=e.tagName;return t==="SELECT"?(e.classList.add("spro-campo"),e.hasAttribute("multiple")?e:g("div",{class:"spro-seletor"},e)):((t==="TEXTAREA"||t==="INPUT"&&Nr.has(e.getAttribute("type")??""))&&e.classList.add("spro-campo"),e)}function P(o,e,...t){let r=[o??""];e.opcional&&r.push(" ",g("span",{class:"spro-opcional"},"(opcional)"));let a=o?g(e.para?"label":"div",{class:"spro-rotulo",...e.para?{for:e.para}:{}},g("span",{},...r),e.valor!==void 0?g("span",{class:"spro-valor",...e.para?{"data-valor-de":e.para}:{}},e.valor):null):null;return g("div",{class:e.largo?"spro-grupo spro-largo":"spro-grupo"},a,...t.map(Hr),e.dica?g("p",{class:"spro-dica"},e.dica):null)}function bo(o,e,t){let r=o.querySelector(`[data-valor-de="${e}"]`);r&&(r.textContent=t)}function Xo(o,e){return o.classList.add("spro-campo"),g("div",{class:"spro-sufixo spro-prefixo"},g("span",{},e),o)}function Yo(o,e){return o.classList.add("spro-campo"),g("div",{class:"spro-sufixo"},o,g("span",{},e))}function Jo(o){let e=Number(o.getAttribute("min")??0),t=Number(o.getAttribute("max")??100),r=t>e?(Number(o.value)-e)/(t-e)*100:0;o.style.setProperty("--p",`${Math.min(100,Math.max(0,r))}%`)}function Co(o){let e=g("input",{type:"range",class:"spro-intervalo",id:o.id,min:String(o.min),max:String(o.max),step:String(o.step),...o.value!==void 0?{value:String(o.value)}:{}});return Jo(e),e.addEventListener("input",()=>Jo(e)),e}function ro(o,e,t="checkbox"){return g("label",{class:"spro-caixa"},g("input",{type:t,...o}),g("span",{},e))}function Ko(o){let e=o.parentElement?.querySelector(".spro-cor-hex");e&&(e.textContent=o.value)}function Ao(o){let e=g("input",{type:"color",...o}),t=g("label",{class:"spro-cor"},e,g("span",{class:"spro-cor-hex"},o.value));return e.addEventListener("input",()=>Ko(e)),e.addEventListener("change",()=>Ko(e)),t}function ho(o){for(let e of o.querySelectorAll("input.spro-intervalo"))Jo(e);for(let e of o.querySelectorAll(".spro-cor > input[type='color']"))Ko(e)}function So(o,e,t={}){let r=g("button",{type:"button",class:"spro-botao-texto",...t.id?{id:t.id}:{},...t.expansivel?{"aria-expanded":"false"}:{}},o,t.expansivel?X("chevron",14):null);return r.addEventListener("click",()=>{t.expansivel&&r.setAttribute("aria-expanded",String(r.getAttribute("aria-expanded")!=="true")),e()}),r}function Zo(o,...e){return g("div",{class:"spro-painel",...o},...e)}function lo(o,e={}){return g("div",{class:e.xadrez?"spro-previa xadrez":"spro-previa",...e.vazio?{"data-vazio":e.vazio}:{},...o})}function co(o,e,t,r){let a=new Map,c=new Map,l=n=>{for(let[d]of e){let i=d===n;a.get(d)?.setAttribute("aria-selected",String(i)),a.get(d)?.setAttribute("tabindex",i?"0":"-1"),i?c.get(d)?.removeAttribute("hidden"):c.get(d)?.setAttribute("hidden","")}r?.(n)},p=g("div",{class:"spro-segmentado largo",role:"tablist"});return e.forEach(([n,d],i)=>{let u=g("button",{type:"button",role:"tab",id:`${o}Tab_${n}`,"aria-controls":`${o}Painel_${n}`,"aria-selected":"false",tabindex:"-1",onclick:()=>l(n),onkeydown:b=>{let s=b.key,f=s==="ArrowRight"?1:s==="ArrowLeft"?-1:0,m=e[(i+f+e.length)%e.length]?.[0];!f||!m||(b.preventDefault(),l(m),a.get(m)?.focus())}},d);a.set(n,u),p.append(u),c.set(n,g("div",{role:"tabpanel",id:`${o}Painel_${n}`,"aria-labelledby":`${o}Tab_${n}`,hidden:""},t[n]))}),{barra:p,paineis:[...c.values()],selecionar:l}}function uo(...o){return z(...o)}function Z(o,e,t={}){return P(o,{para:e.id||void 0,...t},e)}function We(o){return o.nr_sei!==""?`${o.documento} (${o.nr_sei})`:o.documento}var Je=o=>o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),Ke={id:"citacao",globais(o){let e=o.adaptador,t=o.win,r=n=>D(o.doc,n),a=()=>t.dadosProcessoPro?.listDocumentos??[];function c(n,d=9e3){if(t.checkProcessoSigiloso?.()){r("N\xE3o dispon\xEDvel para processos sigilosos"),e.getInstance(n);return}if(!(d<=0)){if(t.dadosProcessoPro?.listDocumentos!==void 0){e.getInstance(n),l(n);return}setTimeout(()=>c(n,d-100),500)}}function l(n){if(t.checkProcessoSigiloso?.())return;let d=e.getInstance(n);if(!d)return;let i=a().filter(v=>v.documento!==""),u=g("input",{type:"search",id:"filtroCitacao",placeholder:"Filtrar por tipo ou n\xFAmero SEI\u2026",autocomplete:"off"}),b=g("div",{id:"listaCitacao",class:"spro-checklist",role:"group","aria-label":"Documentos do processo"}),s=i.map(v=>{let E=ro({value:v.id_protocolo,name:"citacaoDocumento"},We(v));return E.setAttribute("data-busca",Je(We(v))),E});b.append(...s);let f=g("p",{class:"spro-dica",id:"resumoCitacao"}),m=()=>s.map(v=>v.querySelector("input")).filter(v=>typeof v.checked=="boolean"?v.checked:v.hasAttribute("checked")).map(v=>v.getAttribute("value")??""),h=()=>{let v=m().length;bo(x,"filtroCitacao",`${v} ${v===1?"selecionado":"selecionados"}`);let E=Je(u.value.trim()),C=0;for(let S of s)E===""||(S.getAttribute("data-busca")??"").includes(E)?(S.removeAttribute("hidden"),C+=1):S.setAttribute("hidden","");f.textContent=i.length===0?"O processo ainda n\xE3o tem documentos para referenciar.":C===0?"Nenhum documento corresponde ao filtro.":""};u.addEventListener("input",h),b.addEventListener("change",h);let y=g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let v=m();if(!v.length){r("Selecione ao menos um documento.");return}v.forEach((E,C)=>{let S=p(E,d);S&&C<v.length-2&&e.insertText(d,", "),S&&C===v.length-2&&e.insertText(d," e ")}),k.fechar()}},"Inserir"),x=z(P("Documentos do processo",{para:"filtroCitacao",valor:"0 selecionados"},u),b,f,Y("Cada documento marcado entra no texto como refer\xEAncia, na ordem da lista, separados por v\xEDrgula e \u201Ce\u201D."),g("div",{class:"spro-dialogo-rodape"},y)),k=H(o.doc,{titulo:"Inserir refer\xEAncia de documento do processo",largura:600,conteudo:x});h(),u.focus({preventScroll:!0})}function p(n,d){let i=d??e.getInstance();if(!i)return!1;let u=a().find(y=>y.id_protocolo===n);if(!u?.documento)return!1;let b=t.textoParaHtmlPro??N,s=u.nr_sei!==""?u.nr_sei:u.documento,f=t.getCitacaoDoc?.()??"SEI n\xBA ",m=`<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei${b(u.id_protocolo)}" style="text-indent:0;">${b(s)}</a></span>`,h=u.nr_sei!==""||t.getConfigValue?.("citacaodoc")==="citacaodoc_4"?`${b(u.documento.trim())}&nbsp;(${f}${m})`:m;return t.htmlLinksProtocoloEditorPro&&(h=t.htmlLinksProtocoloEditorPro(h,i)),e.withEdit(i,()=>e.insertHtml(i,h)),!0}return{getCitacaoDocumento:c,getDialogCitacaoDocumento:l,insertCitacaoDocumento:p}}};var oe="copyStylePro",ee="cke_copyformatting_active",Xe=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i,zr="rgb(251, 251, 254)";function Qr(o){let e=o.ownerDocument.defaultView?.getComputedStyle?.(o),t=Number.parseFloat(e?.fontSize??""),r=!!o.ownerDocument.documentElement.classList.contains("dark-mode"),a=!!o.closest("sub")||!!o.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&a?!1:t,color:!e?.color||e.color==="rgb(0, 0, 0)"||e.color===zr&&r?!1:e.color,backgroundColor:!e?.backgroundColor||e.backgroundColor==="rgba(0, 0, 0, 0)"?!1:e.backgroundColor,bold:!!o.closest("strong, b"),underline:!!o.closest("u"),italic:!!o.closest("em, i"),strike:!!o.closest("s, strike, del"),subscript:!!o.closest("sub"),superscript:!!o.closest("sup")}}var Ye={id:"copy-style",globais(o){let e=o.adaptador,t=()=>o.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(oe)??"null")}catch{return null}},a=i=>e.getSelectedHtml(i).trim()!==""||e.getSelectedText(i).trim()!=="",c=i=>!!e.getBodyContainer(i)?.classList.contains(ee),l=i=>{for(let u of o.doc.querySelectorAll(".getCopyStyleButtom"))i==="desabilitar"?u.classList.add("cke_button_disabled"):i==="habilitar"?u.classList.remove("cke_button_disabled"):(u.classList.toggle("cke_button_on",i),u.classList.toggle("cke_button_off",!i))};function p(){let i=e.getInstance();i&&e.getBodyContainer(i)?.classList.remove(ee),t().removeItem(oe),l(!1)}function n(i){let u=i??e.getInstance();if(!u)return;if(c(u)){p();return}let b=e.getSelectionElement(u);b&&(t().setItem(oe,JSON.stringify(Qr(b))),e.getBodyContainer(u)?.classList.add(ee),l(!0))}function d(){let i=e.getInstance();if(!i)return;let u=a(i),b=c(i);l(u||b?"habilitar":"desabilitar");let s=r();if(!(s&&u&&b))return;e.withEdit(i,()=>{e.execCommand(i,"removeFormat");for(let[h,y]of[[s.bold,"bold"],[s.underline,"underline"],[s.italic,"italic"],[s.strike,"strike"],[s.subscript,"subscript"],[s.superscript,"superscript"]])h===!0&&e.execCommand(i,y);let m=[];if(typeof s.backgroundColor=="string"&&Xe.test(s.backgroundColor)&&m.push(`background-color: ${s.backgroundColor}`),typeof s.fontSize=="number"&&Number.isFinite(s.fontSize)&&s.fontSize>0&&s.fontSize<400&&m.push(`font-size: ${s.fontSize}px`),typeof s.color=="string"&&Xe.test(s.color)&&m.push(`color: ${s.color}`),m.length){let h=e.getSelectedHtml(i);h!==""&&e.insertHtml(i,`<span style="${m.join("; ")}">${h}</span>`)}}),!!o.win.event?.altKey||p()}return{setCopyStyle(i){let u=e.getInstance(i);u&&n(u)},actionCopyStyle:n,getCopyStyle:r,applyCopyStyle:d,removeCopyStyle:p,menuCopyStyle(i){i&&e.addContextMenu(i,u=>e.versao===5?[]:u?.closest("p")&&a(i)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(i)}]:[])}}}};var Ze=[["processo","N\xFAmero do processo","com link"],["processo_texto","N\xFAmero do processo","sem link"],["autuacao","Data de autua\xE7\xE3o do processo","formato DD/MM/AAAA"],["tipo","Tipo do processo"],["especificacao","Especifica\xE7\xE3o do processo"],["assuntos","Classifica\xE7\xE3o por assuntos do processo","separados por v\xEDrgula"],["assuntos_lista","Classifica\xE7\xE3o por assuntos do processo","em formato de lista"],["interessados","Interessados do processo","separados por v\xEDrgula"],["interessados_lista","Interessados do processo","em formato de lista"],["observacoes","Observa\xE7\xF5es do processo","separadas por v\xEDrgula"],["observacoes_lista","Observa\xE7\xF5es do processo","em formato de lista"],["observacao","Observa\xE7\xE3o da unidade atual"],["acesso","N\xEDvel de acesso do processo"],["acesso_texto","N\xEDvel de acesso do processo","sem \xEDcone"],["documentos","Lista de todos os documentos do processo","separados por v\xEDrgula"],["totaldocumentos","N\xFAmero de documentos do processo"],["documentos_lista","Lista de todos os documentos do processo","em formato de lista"],["hoje","Data de hoje","formato [dia] de [m\xEAs] de [ano]"],["ano","Ano corrente","4 d\xEDgitos [YYYY]"],["qrcode","QR Code do link para acesso ao processo (SEI interno)"]],ot=[["assunto1","Primeiro assunto do processo"],["assunto3","Terceiro assunto do processo"],["interessado1","Primeiro interessado do processo"],["interessado4","Quarto interessado do processo"],["observacao1","Primeira observa\xE7\xE3o do processo"],["observacao2","Segunda observa\xE7\xE3o do processo"],["documento1","Primeiro documento do processo"],["documento5","Quinto documento do processo"],["documento+1","Pr\xF3ximo documento do processo em rela\xE7\xE3o ao atual"],["documento+3","Terceiro documento do processo em rela\xE7\xE3o ao atual"],["documento-1","Primeiro documento do processo anterior ao atual"],["documento-6","Sexto documento do processo anterior ao atual"],["hoje+1","Amanh\xE3","formato [dia] de [m\xEAs] de [ano]"],["hoje-1","Ontem","formato [dia] de [m\xEAs] de [ano]"],["hoje+7","Data daqui a 7 dias","formato [dia] de [m\xEAs] de [ano]"],["hoje-5","Data de 5 dias atr\xE1s","formato [dia] de [m\xEAs] de [ano]"]],Or=new Set([...Ze,...ot].map(([o])=>o.replace(/[^a-zA-Z_]+/g,""))),jr={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\xA0"};function Br(o){return o.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi,(e,t,r,a)=>t?String.fromCodePoint(Number.parseInt(t,16)):r?String.fromCodePoint(Number(r)):a&&jr[a.toLowerCase()]||e)}var Fr=/[\u0300-\u036f]/g,Vr=o=>o.normalize("NFD").replace(Fr,""),et={id:"dados-processo",globais(o){let e=o.adaptador,t=o.win,r=d=>D(o.doc,d),a=()=>String(t.siglaUnidadeAtual??""),c=()=>{let d=t.dadosProcessoPro?.propProcesso?.txaTagsObservacoes??[];return d.find(i=>i.unidade===a())??d.find(i=>i.unidade==="")};function l(d,i=9e3){if(t.checkProcessoSigiloso?.()){e.getInstance(d),r("N\xE3o dispon\xEDvel para processos sigilosos");return}if(i<=0)return;let u=t.dadosProcessoPro;if(u?.propProcesso!==void 0&&u.listDocumentos!==void 0&&(t.arrayDadosEditor?.().length??0)>0){p(d);return}setTimeout(()=>{if(t.dadosProcessoPro?.propProcesso===void 0){let b=t.getDadosProcessoSession?.();b&&(t.dadosProcessoPro=b)}l(d,i-100)},500)}function p(d){if(d===void 0||t.checkProcessoSigiloso?.())return;let i=e.getInstance(d);if(!i)return;try{t.setParamEditor?.(d)}catch{}let u=t.arrayDadosEditor?.()??[],b=g("select",{id:"listDados"},...u.map(([$,j])=>g("option",{value:String(j??"")},Br(String($??""))||"Selecione um dado\u2026"))),s=P("Dado do processo",{para:"listDados",dica:"O valor escolhido entra no documento, no ponto do cursor."},b),m=e.findInBody(i,"p").map($=>$.textContent??"").join(" "),h=t.getHashTagsPro?.(m).length??0,y=g("div",{id:"tabReplaceTag_result",class:"spro-nota"});y.append(g("label",{},`${h} ${h===1?"campo din\xE2mico detectado":"campos din\xE2micos detectados"} no documento.`));let x=g("button",{type:"button",class:"spro-botao",onclick:()=>t.replaceDadosEditor?.(x)},"Substituir campos din\xE2micos"),k=z(Y("Troca as #hashtags j\xE1 digitadas no documento (como #processo ou #hoje) pelos valores reais do processo."),g("div",{},x),y),v=g("input",{type:"text",id:"dinNome",placeholder:"ex.: gestor ou prazo_resposta",autocomplete:"off",spellcheck:"false"}),E=g("input",{type:"text",id:"dinValor",placeholder:"Texto que substitui o campo",autocomplete:"off"}),C=g("div",{id:"tabNewDynamicField_alert",class:"spro-nota",hidden:""}),S=g("div",{id:"tabNewDynamicField_result",class:"spro-lista-campos","data-vazio":"Nenhum campo personalizado nesta unidade ainda"}),w=$=>{C.replaceChildren(g("label",{},$)),C.removeAttribute("hidden")},A=($,j)=>{let G=g("div",{class:"spro-linha-campo","data-tag":$,"data-valor":j});return G.append(g("b",{class:"spro-hash"},`#${$}`),g("span",{class:"spro-linha-valor"},j),g("div",{class:"spro-linha-acoes"},g("button",{type:"button",class:"spro-botao-icone pequeno",title:"Editar","aria-label":`Editar #${$}`,onclick:()=>M(G)},X("lapis",15)),g("button",{type:"button",class:"spro-botao-icone pequeno",title:"Remover","aria-label":`Remover #${$}`,onclick:()=>L(G)},X("lixeira",15)))),G};for(let $ of c()?.tags??[])S.append(A($.name,$.value));function T(){for(let B of[...b.querySelectorAll("option")])(B.textContent??"").trim().startsWith("Personalizado")&&B.remove();let $=[...S.querySelectorAll(".spro-linha-campo")].map(B=>({name:B.getAttribute("data-tag")??"",value:B.getAttribute("data-valor")??""})),j="";for(let{name:B,value:so}of $){let Cr=t.textoParaHtmlPro?t.textoParaHtmlPro(so):so;b.append(g("option",{value:Cr},`Personalizado (${a()}) #${B}: ${so}`)),j+=`#${B}: ${so}
`}let G=t.dadosProcessoPro?.propProcesso;for(let B of G?.txaTagsObservacoes??[])B.unidade===a()&&(B.tags=$);let eo=G?.txaObservacoes?.find(B=>B.unidade===a())?.observacao;t.updateDadosProcesso?.("txaObservacoes",eo!=null?j+eo:j)}function L($){$.remove(),T(),w("Campo din\xE2mico exclu\xEDdo com sucesso.")}function M($){v.value=$.getAttribute("data-tag")??"",E.value=$.getAttribute("data-valor")??"",E.focus()}function q(){C.setAttribute("hidden","");let $=so=>t.removeAcentos?t.removeAcentos(so):Vr(so),j=v.value.trim(),G=j===""?"":$(j.split(":")[0]?.replace("#","")??"").replace(/ /g,"").toLowerCase().trim(),eo=E.value.trim();if(G===""||eo===""){w("Informe o nome e o valor do campo.");return}if(Or.has(G)){w("Esse nome \xE9 reservado para uso interno (veja a aba Lista de campos). Escolha outro.");return}let B=[...S.querySelectorAll(".spro-linha-campo")].find(so=>so.getAttribute("data-tag")===G);B?B.replaceWith(A(G,eo)):S.prepend(A(G,eo)),v.value="",E.value="",T(),w("Campo din\xE2mico salvo com sucesso.")}let Q=g("button",{type:"button",id:"buttonNewDynamicField",class:"spro-botao",onclick:q},"Salvar campo"),_=z(Y("Crie campos pr\xF3prios, como #gestor, para usar nos documentos deste processo. Ficam salvos nas observa\xE7\xF5es da unidade."),P("Nome do campo",{para:"dinNome",dica:"Sem acentos nem espa\xE7os."},Xo(v,"#")),P("Valor do campo",{para:"dinValor"},E),g("div",{},Q),C,P("Campos salvos",{},S)),R=($,j)=>P($,{},g("div",{class:"spro-lista-campos spro-referencia"},...j.map(([G,eo,B])=>g("div",{class:"spro-linha-campo"},g("b",{class:"spro-hash"},`#${G}`),g("span",{class:"spro-linha-valor"},eo,B?g("em",{},` (${B})`):null))))),I=z(R("Campos dispon\xEDveis",Ze),R("Campos avan\xE7ados (posi\xE7\xE3o ou data relativa)",ot)),W=null,K=co("dados",[["inserir","Inserir dados"],["substituir","Substituir campos"],["personalizados","Personalizados"],["lista","Lista de campos"]],{inserir:s,substituir:k,personalizados:_,lista:I},$=>{W&&($==="inserir"?W.removeAttribute("hidden"):W.setAttribute("hidden",""))}),U=g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let $=b.value;if(!$){r("Escolha o dado a inserir.");return}n($,i),io.fechar()}},"Inserir");W=g("div",{class:"spro-dialogo-rodape"},U);let io=H(o.doc,{titulo:"Dados do processo",largura:700,conteudo:g("div",{class:"spro-form"},K.barra,g("div",{},...K.paineis),W)});K.selecionar("inserir"),b.focus({preventScroll:!0})}function n(d,i){let u=i??e.getInstance();if(!u)return;let b=t.htmlLinksProtocoloEditorPro?t.htmlLinksProtocoloEditorPro(d,u):d;e.withEdit(u,()=>e.insertHtml(u,b))}return{getDadosEditor:l,getDialogDadosEditor:p,insertDadosEditor:n}}};var te="spro_editor_folha",tt="seipro-folha-editor",No="data-spro-folha-editor";function Gr(o){return`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: ${o} !important; background-image: none !important; }
`}function Ur(o){let e=`html[${No}]`,t=`[${No}]`,r=o?"#141619":"#f3f4f7",a=o?"#2a2d33":"#e3e6ee",c=o?"#202123":"#ffffff",l="rgba(20, 25, 50, .13)",p=`14px 0 24px -14px ${l}, -14px 0 24px -14px ${l}`,n=`0 14px 24px -14px ${l}`,d=`${e} .cke_contents[data-spro-folha]`;return`${e} #divEditores, ${e} .cke_inner, ${e} .cke { background-color: ${r} !important; }
${e} #divEditores { padding-bottom: 28px; }
${d} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: ${c} !important; border: 0 solid ${a}; border-width: 0 1px; box-shadow: ${p}; clip-path: inset(0 -30px); }
${d}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${d}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${p}, ${n}; clip-path: inset(0 -30px -30px); }
${d}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${d} { padding-left: 20px; padding-right: 20px; } }
${e} .infra-editor__editor-completo { background-color: ${r} !important; }
${e} .infra-editor__editable-inner-container { box-sizing: border-box; width: min(940px, calc(100% - 24px)); margin: 28px auto; padding: 0; background-color: ${c} !important; border: 1px solid ${a}; border-radius: 12px; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12); }
${e} .infra-editor__editable-inner-container > .ck-content { box-sizing: border-box; width: 100%; max-width: none; margin: 0 !important; padding: 12px 56px !important; background-color: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
${e} .infra-editor__editable-inner-container > .ck-content:first-child { padding-top: 40px !important; }
${e} .infra-editor__editable-inner-container > .ck-content:last-child { padding-bottom: 40px !important; }
html[data-spro-tema="escuro"]${t} .infra-editor__editor-completo { background-color: #141619 !important; }
html[data-spro-tema="escuro"]${t} .infra-editor__editable-inner-container { background-color: #202123 !important; border-color: #2a2d33; }
`}function rt(o,e){if(!o.head||(o.querySelector(`style[data-style="${tt}"]`)?.remove(),!e))return;let t=o.createElement("style");t.setAttribute("data-style",tt),t.textContent=e,o.head.append(t)}function at(o,e,t="#ffffff"){if(!o?.style)return;let r=o.getAttribute("data-spro-folha-bg");if(e)r===null&&o.setAttribute("data-spro-folha-bg",`${o.style.getPropertyValue("background-color")}|${o.style.getPropertyPriority("background-color")}`),o.style.setProperty("background-color",t,"important");else if(r!==null){let[a,c]=r.split("|");o.removeAttribute("data-spro-folha-bg"),o.style.removeProperty("background-color"),a&&o.style.setProperty("background-color",a,c||"")}}var nt={id:"folha-papel",globais(o){let e=o.doc,t=()=>!!o.win.localStorage?.getItem(te),r=()=>!!o.win.localStorage?.getItem("darkModePro")||e.documentElement.getAttribute("data-spro-tema")==="escuro",a=!1;function c(n){for(let d of e.querySelectorAll("iframe.cke_wysiwyg_frame")){let i=d.contentDocument;if(!i?.head)continue;let u=r()?"#202123":"#ffffff";rt(i,n?Gr(u):null),at(i.documentElement,n,u),at(i.body,n,u)}}function l(n){let d=[...e.querySelectorAll(".cke_contents")];d.forEach((i,u)=>{if(!n){i.removeAttribute("data-spro-folha");return}let b=[u===0?"primeira":"",u===d.length-1?"ultima":""].filter(Boolean);i.setAttribute("data-spro-folha",b.join(" ")||"meio")})}function p(n){rt(e,n?Ur(r()):null),c(n),l(n),n?e.documentElement.setAttribute(No,""):e.documentElement.removeAttribute(No);for(let d of e.querySelectorAll(".getPaperViewButtom"))d.classList.toggle("cke_button_on",n),d.classList.toggle("cke_button_off",!n),d.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:p,getPaperViewButtom(n){let d=!t();d?o.win.localStorage.setItem(te,"1"):o.win.localStorage.removeItem(te),p(d)},initFolhaEditorPro(){let n=o.win.CKEDITOR;if(typeof n?.on=="function"&&!a){a=!0;let d=i=>i.on("contentDom",()=>t()&&c(!0));for(let i of Object.values(n.instances??{}))d(i);n.on("instanceReady",i=>d(i.editor))}p(t())}}}};function Wr(o){if(!o)return 16;let e=Number.parseFloat(o.ownerDocument.defaultView?.getComputedStyle?.(o)?.fontSize??"");return Number.isNaN(e)?16:e}var it={id:"font-size",globais:o=>({changeFontSize(e,t){let r=o.adaptador.getInstance(e);if(!r)return;let a=o.adaptador.getSelectedHtml(r);if(!a||a.trim()===""){D(o.doc,"Selecione um texto para alterar o tamanho da fonte");return}let c=Wr(o.adaptador.getSelectionElement(r)),l=t==="up"?c+2:c-2;l>7&&l<70&&o.adaptador.withEdit(r,()=>{o.adaptador.versao===4?o.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${l}px`}}):o.adaptador.insertHtml(r,`<span style="font-size: ${l}px">${a}</span>`)})}})};var Ho=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Jr=[{name:Ho,attributes:!0},{name:Ho,classes:!0},{name:Ho,styles:!0}],To=o=>o.split("").join("[\\t\\n\\r]*"),re=new RegExp(`^[\\s\\x00-\\x20]*(${To("javascript")}|${To("vbscript")}|${To("livescript")}|${To("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${To("text/html")})`,"i"),Kr=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:re}]}];function xo(o,e){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",o,e===void 0?"":e)}function Po(o,e){try{return o?.plugins?.has(e)?o.plugins.get(e):null}catch{return null}}var Xr=o=>!!(o?.model&&o.editing&&o.conversion),Yr=o=>Po(o,"EstiloEditing")?.estilos??{},st=(o,e)=>Object.hasOwn(o,e);function ct(o,e){let t=Po(o,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(e)}catch{}return`html${e.charAt(0).toUpperCase()}${e.slice(1)}Attributes`}function Zr(o,e){let t=o?.getAttribute?.(e)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function oa(o,e,t){if(!e?.is?.("element"))return;let r=t.mapper.toViewElement(e);if(!r)return;let a=Yr(o),c=e.getAttribute("estilo"),l=Zr(e,ct(o,"p")),p=t.writer,n=[];try{n=Array.from(r.getClassNames())}catch{}for(let d of n)d!==c&&st(a,d)&&p.removeClass(d,r);for(let d of l)st(a,d)||p.addClass(d,r);c&&p.addClass(c,r)}function ea(o){if(o.__seiProGhsConversor)return;o.__seiProGhsConversor=!0;let e=["attribute:estilo:paragraph",`attribute:${ct(o,"p")}:paragraph`];o.conversion.for("downcast").add(t=>{for(let r of e)t.on(r,(a,c,l)=>{try{oa(o,c.item,l)}catch{}},{priority:"lowest"})})}function ta(o){try{return Array.from(o.model.markers).some(e=>/coment/i.test(e.name))}catch{return!1}}function lt(o,e){let t=Po(e,"Salvar"),r=t?!!t.isDirty:!1;try{o()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function ra(o){try{return o.model.document.history.getOperations().some(e=>e.batch?.isUndoable)}catch{return!0}}function aa(o,e){let t=o.getFullData({seiProInterno:!0}),r=e.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||ra(o)?t:Object.fromEntries(Object.keys(t).map(a=>[a,typeof r[a]=="string"?r[a]:t[a]]))}function na(o,e,t){try{let r=t??o.adaptador.getSelectionParagraph(e);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let a=r.jquery?r.get(0):r;if(a?.nodeType!==1)return null;let c=e.editing.view.domConverter.mapDomToView(a);return c?e.editing.mapper.toModelElement(c):null}catch{return null}}function ia(o,e){try{return o.editing.mapper.toViewElement(e)?.name??null}catch{return null}}function dt(o){let e=c=>c??o.adaptador.getInstance();function t(c){let l=e(c);if(!Xr(l))return!1;if(l.__seiProGhsLiberado)return!0;let p=Po(l,"DataFilter");if(!p)return xo("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{p.allowElement({name:Ho,attributes:!0,classes:!0,styles:!0});for(let n of Jr)p.allowAttributes(n);if(typeof p.disallowAttributes=="function")for(let n of Kr)p.disallowAttributes(n)}catch(n){return xo("falha ao liberar o GHS",n),!1}return l.__seiProGhsLiberado=!0,ea(l),!0}function r(c){let l=e(c);if(!t(l)||typeof l.getFullData!="function")return!1;let p=!0;return lt(()=>{try{l.data.set(aa(l,o.win))}catch(n){xo("falha ao reprocessar o conteudo",n),p=!1}},l),p}function a(c,l,p){let n=e(c);if(!t(n))return!1;let d=Po(n,"GeneralHtmlSupport"),i=na(o,n,l),u=i?ia(n,i):null;if(!d||!i||!u)return!1;try{return p(d,u,i),!0}catch(b){return xo("falha ao aplicar no model",b),!1}}return{liberar:t,aplicarRegras:r,semSujar:(c,l)=>lt(c,e(l)),estaLiberado:c=>!!e(c)?.__seiProGhsLiberado,addClasse:(c,l,p)=>a(p,c,(n,d,i)=>n.addModelHtmlClass(d,l,i)),removeClasse:(c,l,p)=>a(p,c,(n,d,i)=>n.removeModelHtmlClass(d,l,i)),setEstilos:(c,l,p)=>a(p,c,(n,d,i)=>n.setModelHtmlStyles(d,l,i)),setAtributos:(c,l,p)=>a(p,c,(n,d,i)=>n.setModelHtmlAttributes(d,l,i))}}var pt={id:"ghs-unlock",globais:o=>({SeiProGhs:dt(o)}),iniciar(o){if(o.adaptador.versao!==5)return;let e=dt(o),t=o.adaptador.getInstance();if(!(!t||!e.liberar(t))){if(o.win.SEIPRO_GHS_AUTO===!1||ta(t)){xo("regras liberadas (ativacao no pr\xF3ximo data.set)");return}e.aplicarRegras(t)&&xo("classes, estilos e atributos liberados no editor")}}};function sa(o){let e=Number.parseInt(String(o??""),10);return Number.isNaN(e)?60:Math.min(100,Math.max(1,e))}var ut={id:"image-quality",globais(o){let e=o.adaptador,t=o.win;function r(a){let c=e.getInstance(a);if(!c)return;let l=Co({id:"batchImgQualityRange",min:1,max:100,step:1,value:sa(t.qualidadeImagens)});l.addEventListener("input",()=>bo(n,"batchImgQualityRange",`${l.value}%`));let p=g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let i=Number(l.value);e.withEdit(c,()=>{for(let u of e.findInBody(c,"img"))t.qualityImages?.(u,u,i*.01)}),d.fechar()}},"Aplicar"),n=z(P("Qualidade da imagem",{para:"batchImgQualityRange",valor:`${l.value}%`},l),Y("Qualidade menor deixa o arquivo mais leve, com mais perda de nitidez. Vale para todas as imagens do documento."),g("div",{class:"spro-dialogo-rodape"},p)),d=H(o.doc,{titulo:"Reduzir qualidade das imagens",largura:460,conteudo:n})}return{openDialogBatchImgQuality:r,getDialogBatchImgQuality:()=>{}}}};var mt="Nenhum documento encontrado! Confira se o documento est\xE1 acess\xEDvel por qualquer pessoa na internet e tente novamente.",la="https://docs.google.com/feeds/download/documents/export/Export?id=",da="https://docs.google.com/spreadsheets/d/e/";function ft(o){for(let e of[...o.childNodes])e.nodeType===8?e.parentNode?.removeChild(e):ft(e)}function gt(o){for(;o.firstChild;)o.parentNode?.insertBefore(o.firstChild,o);o.parentNode?.removeChild(o)}function ca(o,e){let t=e(`<!doctype html><html><body>${o}</body></html>`),r=t.body;for(let a of r.querySelectorAll("link, script, style, meta"))a.parentNode?.removeChild(a);for(let a of r.querySelectorAll("o\\:p"))a.parentNode?.removeChild(a);for(let a of r.querySelectorAll("a.msocomanchor"))a.parentNode?.removeChild(a);for(let a of r.querySelectorAll('div[style="mso-element:comment-list"]'))a.parentNode?.removeChild(a);ft(r);for(let a of r.querySelectorAll("p.MsoNormal")){let c=a.getAttribute("align")==="center"?"Texto_Centralizado":"Texto_Justificado_Recuo_Primeira_Linha";a.classList.remove("MsoNormal"),a.removeAttribute("align"),a.removeAttribute("style"),a.classList.add(c);for(let p of[...a.querySelectorAll("span")])gt(p);let l=(p,n,d)=>{if((p.textContent??"").replace(/\u00a0/g," ").trim()!==""||p.querySelector("*")){let i=t.createElement("span");i.setAttribute("style",n);let u=t.createElement(d);for(;p.firstChild;)u.append(p.firstChild);i.append(u),p.parentNode?.insertBefore(i,p),p.parentNode?.insertBefore(t.createTextNode(" "),p)}p.parentNode?.removeChild(p)};for(let p of[...a.querySelectorAll("del")])l(p,"color:#FF0000;","s");for(let p of[...a.querySelectorAll("ins")])l(p,"color:#0000FF;","u")}for(let a of[...r.querySelectorAll(".WordSection1")])gt(a);return r.innerHTML}function pa(o,e){let t=e(o),r=t.body??t.documentElement;for(let a of r.querySelectorAll("link, script, style, meta, title"))a.parentNode?.removeChild(a);for(let a of r.querySelectorAll("a[href]")){let c=a.getAttribute("href")??"";if(c.includes("https://www.google.com/url?q="))try{let l=new URL(c).searchParams.get("q");l&&(c=l)}catch{}a.setAttribute("href",c),a.setAttribute("target","_blank"),a.setAttribute("rel","noreferrer")}return r.innerHTML}var bt={id:"importar-doc",globais(o){let e=o.adaptador,t=o.win,r=x=>D(o.doc,x),a=x=>new o.win.DOMParser().parseFromString(x,"text/html"),c=x=>(o.fetch??o.win.fetch.bind(o.win))(x),l=null;function p(){return t.mammoth?Promise.resolve():(l??=new Promise(x=>{let k=o.doc.createElement("script");k.src=`${o.base}js/lib/mammoth.browser.min.js`,k.onload=()=>x(),k.onerror=()=>x(),o.doc.head.append(k)}),l)}async function n(){return $o(o.doc),je(Ro())("Substituir todo o conte\xFAdo atual do documento pelo conte\xFAdo importado?","Substituir","Voltar")}function d(x,k,v){let E=v??e.getInstance();E&&(e.withEdit(E,()=>{if(k.substituir)e.setData(E,x);else{let C=e.getSelectionParagraph(E);C?e.insertHtmlBefore(E,C,x):e.insertHtml(E,x)}}),setTimeout(()=>{i(E),t.enableButtonSavePro?.()},0))}function i(x){let k=x,v=k&&(k.model||k.name)?k:e.getInstance();v&&e.transformBodyHtml(v,E=>ca(E,a))}async function u(x,k){let v=await x.arrayBuffer();return new TextDecoder(k?"windows-1252":"utf-8").decode(v)}async function b(x){return await p(),t.mammoth?(await t.mammoth.convertToHtml({arrayBuffer:await x.arrayBuffer()})).value:(r("Conversor de Word n\xE3o carregado. Tente novamente em instantes."),null)}async function s(x,k,v){let E=x.name.split(".").pop()?.toLowerCase()??"";if(E!=="docx"&&E!=="html"&&E!=="htm")return r("Formato n\xE3o suportado. Use um arquivo .docx ou .html"),!1;if(k.substituir&&!await n())return!1;try{let C=E==="docx"?await b(x):await u(x,k.windows1252);return C===null?!1:(d(C,k,v),k.trocarCampos&&setTimeout(()=>t.replaceDadosEditor?.(null),500),!0)}catch{return r("N\xE3o foi poss\xEDvel ler o arquivo. Confira se ele n\xE3o est\xE1 corrompido."),!1}}async function f(x,k,v,E){let C=E??e.getInstance();if(e.versao===4&&typeof t.loadGoogleDocs=="function"&&t.iframeEditor)return t.loadGoogleDocs(x,t.iframeEditor,k),!0;if(!C)return r("Editor n\xE3o encontrado."),!1;if(v&&!await n())return!1;try{let S=await c(x),w=S.ok?await S.text():"";return w?(d(pa(w,a),{substituir:v},C),!0):(r(mt),!1)}catch{return r(mt),!1}}function m(x,k,v){let E=/\/d\/(.*?)(\/|$)/.exec(x);return E?f(`${la}${E[1]}&exportFormat=html`,"docs",k,v):(r("Endere\xE7o do documento inv\xE1lido!"),Promise.resolve(!1))}function h(x,k,v){let E=/\/e\/(.*?)(\/|$)/.exec(x);return E?f(`${da}${E[1]}/pubhtml`,"sheets",k,v):(r("Endere\xE7o da planilha inv\xE1lido!"),Promise.resolve(!1))}function y(x){try{t.setParamEditor?.(x)}catch{}let k=e.getInstance(x);if(!k)return;p();let v=g("input",{type:"file",id:"fileInputImportHTMLDocx",accept:".docx,.html,.htm"}),E=(R,I,W)=>ro({id:R,...W?{checked:"checked"}:{}},I),C=z(P("Arquivo do computador",{para:"fileInputImportHTMLDocx",dica:"Aceita Word (.docx) e HTML (.html)."},v),P("Op\xE7\xF5es",{},E("replaceText","Substituir todo o documento pelo conte\xFAdo externo",!0),E("replaceTags","Substituir campos din\xE2micos no documento (se dispon\xEDvel)",!0),E("importWord","Corrigir erros de codifica\xE7\xE3o de documentos Word (acentos quebrados em .html)",!1))),S=g("input",{type:"text",id:"urlGDocs",placeholder:"https://docs.google.com/document/d/\u2026",autocomplete:"off",spellcheck:"false"}),w=z(P("Endere\xE7o do Google Docs",{para:"urlGDocs"},S),E("replaceTextDocs","Substituir todo o documento pelo conte\xFAdo externo",!0),g("div",{class:"spro-aviso-inline"},g("span",{},"Antes de importar, confira se o documento est\xE1 acess\xEDvel por qualquer pessoa na internet. ",g("a",{class:"spro-link",href:"https://seipro.app/pages/INSERIRDOC.html",target:"_blank",rel:"noopener noreferrer"},"Veja a ajuda"),"."))),A=g("input",{type:"text",id:"urlGSheets",placeholder:"https://docs.google.com/spreadsheets/d/e/\u2026",autocomplete:"off",spellcheck:"false"}),T=z(P("Endere\xE7o do Google Planilhas (Publicar na Web)",{para:"urlGSheets"},A),E("replaceTextSheets","Substituir todo o documento pelo conte\xFAdo externo",!0),g("div",{class:"spro-aviso-inline"},g("span",{},"Antes de importar, confira se a planilha est\xE1 publicada na web. O endere\xE7o publicado \xE9 diferente do endere\xE7o da planilha. ",g("a",{class:"spro-link",href:"https://seipro.app/pages/INSERIRPLANILHA.html",target:"_blank",rel:"noopener noreferrer"},"Veja a ajuda"),"."))),L="arquivo",M=co("imp",[["arquivo","Word ou HTML"],["docs","Google Docs"],["sheets","Google Planilhas"]],{arquivo:C,docs:w,sheets:T},R=>{L=R}),q=R=>ht(o.doc.querySelector(`#${R}`)),Q=g("button",{type:"button",class:"spro-botao primario"},"Inserir");Q.addEventListener("click",()=>{(async()=>{let R=!1;if(L==="arquivo"){let I=v.files?.[0];if(!I)return void r("Escolha um arquivo .docx ou .html.");R=await s(I,{substituir:q("replaceText"),trocarCampos:q("replaceTags"),windows1252:q("importWord")},k)}else if(L==="docs"){let I=S.value.trim();if(!I)return void r("Informe o endere\xE7o do Google Docs.");R=await m(I,q("replaceTextDocs"),k)}else{let I=A.value.trim();if(!I)return void r("Informe o endere\xE7o da planilha publicada.");R=await h(I,q("replaceTextSheets"),k)}R&&_.fechar()})()});let _=H(o.doc,{titulo:"Inserir conte\xFAdo externo",largura:640,conteudo:g("div",{class:"spro-form"},M.barra,g("div",{},...M.paineis),g("div",{class:"spro-dialogo-rodape"},Q))});M.selecionar("arquivo"),v.focus({preventScroll:!0})}return{importDocPro:y,getGoogleDocs:(x,k,v)=>m(x,ao(o.doc,"replaceTextDocs"),v),getGoogleSheets:(x,k,v)=>h(x,ao(o.doc,"replaceTextSheets"),v),importGoogleByUrl:(x,k,v)=>f(x,k,ao(o.doc,k==="sheets"?"replaceTextSheets":"replaceTextDocs"),v),handleFileImport:(x,k,v)=>x[0]?s(x[0],{substituir:ao(o.doc,"replaceText"),trocarCampos:ao(o.doc,"replaceTags"),windows1252:ao(o.doc,"importWord")},v):Promise.resolve(!1),converterDocxParaHtml:(x,k,v)=>x[0]?s(x[0],{substituir:ao(o.doc,"replaceText"),trocarCampos:!1,windows1252:!1},v):Promise.resolve(!1),loadFileImportHTML:(x,k,v)=>x[0]?s(x[0],{substituir:ao(o.doc,"replaceText"),trocarCampos:ao(o.doc,"replaceTags"),windows1252:ao(o.doc,"importWord")},v):Promise.resolve(!1),loadFileImportEditor:(x,k,v)=>d(x,{substituir:ao(o.doc,"replaceText")},v),wordToSEI:i}}};function ht(o){return o?typeof o.checked=="boolean"?o.checked:o.hasAttribute("checked"):!1}function ao(o,e){let t=o.querySelector(`#${e}`);return t?ht(t):e.startsWith("replaceText")}function vt(o,e){return new Promise((t,r)=>{let a=new o.Image;a.crossOrigin="anonymous",a.onload=()=>{try{let c=o.document.createElement("canvas");c.width=a.width,c.height=a.height,c.getContext("2d")?.drawImage(a,0,0),t(c.toDataURL("image/png"))}catch(c){r(c)}},a.onerror=()=>r(new Error("imagem nao carregou")),a.src=e})}var ua="https://latex.codecogs.com/png.latex?",ma="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",ga="https://editor.codecogs.com/",xt={id:"latex",globais(o){let e=null,t=o.imagemParaDataUri??(n=>vt(o.win,n)),r=n=>D(o.doc,n);function a(){let n=e;if(!n)return;let d=n.texto.value;n.geracao+=1;let i=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,d==="")return;let u=g("img",{src:`${ua}${encodeURI(d)}`});n.previa.append(u),t(u.getAttribute("src")??"").then(b=>{e!==n||n.geracao!==i||(u.setAttribute("src",b),u.className="img-base64",n.pronta=!0)},()=>{e===n&&n.geracao===i&&(n.falhou=!0)})}function c(){let n=e;if(!n)return!1;let d=n.texto.value;if(d==="")return r("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let i=n.previa.querySelector("img");if(!n.pronta||!i)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let u=n.ed,b=`<img class="img-base64" src="${N(i.getAttribute("src")??"")}" alt="${N(d)}">`;return o.adaptador.withEdit(u,()=>o.adaptador.insertHtml(u,b)),!0}function l(n){let d=o.adaptador.getInstance(n);if(!d)return;let i=g("textarea",{id:"MathText",rows:"4",placeholder:"\\frac{a}{b} + \\sqrt{x^2}",spellcheck:"false"});i.addEventListener("input",a);let u=lo({id:"latexPreview"},{vazio:"A equa\xE7\xE3o aparece aqui"});u.classList.add("papel");let b=H(o.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{e=null},conteudo:uo(Z("Equa\xE7\xE3o em LaTeX",i),u,Y("Consulte o ",g("a",{href:ma,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",g("a",{href:ga,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{c()&&b.fechar()}},"Inserir")))});e={ed:d,texto:i,previa:u,geracao:0,pronta:!1,falhou:!1};let s=String(o.win.getSelection?.()??"").trim();s!==""&&(i.value=s,a())}function p(){}return{updatePreviewLatex:a,openDialogLatex:l,getDialogLatex:p}}};function J(o){try{let e=new URL(o);return e.protocol==="http:"||e.protocol==="https:"}catch{return!1}}var Lo="https://legis.seipro.app/v1",fa=50,ba={lei:"Lei","lei.complementar":"LC",decreto:"Dec","decreto.lei":"DecLei","medida.provisoria":"Mp","emenda.constitucional":"Ec","decreto.legislativo":"DecLeg",resolucao:"Res"};function ha(o){let e=String(o??""),t=e.split(","),r=/(\d{4})\s*$/.exec(e);return t.length>1&&r?`${(t[0]??"").trim()}, de ${r[1]}`:e}function va(o){let e=String(o??"").replace(/\s+/g," ").trim();for(;/\s*\([^()]*\)$/.test(e);)e=e.replace(/\s*\([^()]*\)$/,"").trim();return!e||e===e.toUpperCase()?"":e}var xa=o=>J(o)?o:"";function yt(o){return{sigla:o.tipo==="constituicao"?"Cf":(ba[o.tipo??""]??String(o.tipo??"").replace(/[^A-Za-z]/g,""))+String(o.numero??"").replace(/[^0-9-]/g,""),titulo:o.titulo||o.titulo_curto||"",curto:o.titulo_curto||ha(o.titulo),apelido:va(o.apelido),url:xa(o.url||(o.urn?`https://normas.leg.br/?urn=${o.urn}`:"")),ementa:o.ementa||"",revogada:o.situacao==="revogada"}}function Et(o,e){let t=N,r=e?t(o.curto||o.titulo):t(o.titulo)+(o.apelido?`&nbsp;(${t(o.apelido)})`:""),a=o.url?` href="${t(o.url)}" target="_blank"`:"";return`<a class="ancoraSei legisSeiPro" data-norma="${t(o.sigla)}" data-normafull="${t(o.titulo)}" data-index="0"${a}>${r}</a>`}async function ae(o,e,t){let r=new URLSearchParams({per_page:String(fa)});for(let[p,n]of Object.entries(t))n!==""&&n!==null&&n!==void 0&&r.set(p,String(n));let a=await o(`${e}/normas?${r}`);if(!a.ok)throw new Error(`HTTP ${a.status}`);let c=await a.json(),l=(c?.itens??[]).map(yt);return{total:c?.total??l.length,normas:l}}async function ne(o,e,t,r=!1){let a=[];for(let l of t){let p=String(l??"").trim().slice(0,60);p&&!a.includes(p)&&a.push(p)}let c={};if(!a.length)return c;try{let l=await o(`${e}/normas/resolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refs:a.slice(0,200)})});if(!l.ok){if(r)throw new Error(`HTTP ${l.status}`);return c}let p=await l.json();for(let[n,d]of Object.entries(p?.resultados??{}))d&&(c[n]=yt(d))}catch(l){if(r)throw l}return c}var ie=o=>({ano:"exato",ate:"ate",apos:"apos"})[o]??"exato";function se(o){let e=String(o??"").split(/[/-]/)[0]?.replace(/[^0-9]+/g,"");return e?Number.parseInt(e,10):""}function kt(o){let e=String(o??"").toLowerCase();return/emenda constitucional|\bec\b/.test(e)?"emenda.constitucional":/decreto legislativo/.test(e)?"decreto.legislativo":/lei complementar|\blc\b/.test(e)?"lei.complementar":/decreto-lei|decreto lei|\bdl\b/.test(e)?"decreto.lei":/medida provis[o\u00f3]ria|\bmp\b/.test(e)?"medida.provisoria":/decreto|\bdec\b/.test(e)?"decreto":/\blei\b/.test(e)?"lei":""}var ya=[["",""],["Lei","lei"],["Lei Complementar","lei.complementar"],["Decreto","decreto"],["Decreto-Lei","decreto.lei"],["Medida Provis\xF3ria","medida.provisoria"],["Emenda Constitucional","emenda.constitucional"],["Decreto Legislativo","decreto.legislativo"]],Ea=[["",""],["No ano","ano"],["At\xE9 o ano de...","ate"],["Ap\xF3s o ano de...","apos"]],ka=[["",""],["ANTAQ","Antaq"],["Cade","Cade"],["PRF","PRF"],["TSE","Tse"],["TRE RR","Trerr"],["TJ RR","TJRR"],["CNJ","CNJ"]],wa=[["",""],["Acordo/Plano/Ato/Nota","acord"],["Ata e Certid\xF5es de Julgamento","atas"],["Constitui\xE7\xE3o Estadual","ce"],["Decreto Estadual","decest"],["Edital","Edit"],["Enunciado Administrativo","enumadm"],["Emenda Constitucional","ec"],["Emenda Regimental","er"],["Emendas","Emenda"],["Instru\xE7\xE3o Normativa","in"],["Instru\xE7\xE3o Normativa Conjunta","resconj"],["Lei Complementar Estadual","lce"],["Lei Estadual","leiest"],["Lei Municipal","leimun"],["Nota T\xE9cnica","nt"],["Orienta\xE7\xE3o Normativa","on"],["Portaria","port"],["Portaria Conjunta","portconj"],["Portaria Interministerial","portinter"],["Portaria Interinstitucional","portinst"],["Provimento","prov"],["Recomenda\xE7\xE3o","Rec"],["Regimento Interno","regim"],["Resolu\xE7\xE3o Normativa","rn"],["Resolu\xE7\xE3o","res"],["Resolu\xE7\xE3o Conjunta","resconj"],["S\xFAmula Administrativa","sum"]],Ca=[["",""],["C\xF3digo Brasileiro de Aeron\xE1utica","Lei7565/1986"],["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es","Lei4117/1962"],["C\xF3digo Civil","Lei10406/2002"],["C\xF3digo Comercial","Lei556/1850"],["C\xF3digo de Defesa do Consumidor","Lei8078/1990"],["Constitui\xE7\xE3o Federal","Cf"],["C\xF3digo Florestal","Lei12651/2012"],["Consolida\xE7\xE3o das Leis do Trabalho","DecLei5452/1943"],["C\xF3digo de \xC1guas","Dec24643/1934"],["C\xF3digo Eleitoral","Lei4737/1965"],["C\xF3digo de Minas","DecLei227/1967"],["C\xF3digo Penal","DecLei2848/1940"],["C\xF3digo de Processo Civil","Lei13105/2015"],["C\xF3digo Penal Militar","DecLei1001/1969"],["C\xF3digo de Processo Penal","DecLei3689/1941"],["C\xF3digo de Processo Penal Militar","DecLei1002/1969"],["C\xF3digo de Tr\xE2nsito Brasileiro","Lei9503/1997"],["C\xF3digo Tribut\xE1rio Nacional","Lei5172/1966"],["Estatuto da Crian\xE7a e do Adolescente","Lei8069/1990"],["Estatuto da Cidade","Lei10257/2001"],["Estatuto do Desarmamento","Lei10826/2003"],["Estatuto do Idoso","Lei10741/2003"],["Estatuto da Igualdade Racial","Lei12288/2010"],["Estatuto do \xCDndio","Lei6001/1973"],["Estatuto da Juventude","Lei12852/2013"],["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte","LC123/2006"],["Estatuto dos Militares","Lei6880/1980"],["Estatuto dos Museus","Lei11904/2009"],["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)","Lei8906/1994"],["Estatuto da Pessoa com Defici\xEAncia","Lei13146/2015"],["Estatuto dos Refugiados","Lei9474/1997"],["Estatuto da Terra","Lei4504/1964"],["Estatuto de Defesa do Torcedor","Lei10671/2003"]],wt="Servi\xE7o de legisla\xE7\xE3o indispon\xEDvel no momento. Tente novamente mais tarde.",Ct="Nenhuma legisla\xE7\xE3o encontrada";function Aa(o){let e=o.replace(/(\r\n|\n|\r)/gm," ").trim();/[A-Z]/.test(e)&&e===e.toUpperCase()&&(e=e.charAt(0)+e.toLocaleLowerCase().slice(1));let t=e.length>170;return{curta:t?`${e.replace(/^(.{170}\S*)[\s\S]*/,"$1")}...`:e,completa:e,longa:t}}var At={id:"legis",globais(o){let e=o.adaptador,t=w=>D(o.doc,w),r=(w,A)=>(o.fetch??o.win.fetch.bind(o.win))(w,A),a=[],c=null,l=0,p=null;function n(w,A){ne(r,Lo,w??[]).then(A)}function d(w,A){let T=A??e.getInstance();if(!T||!w)return;let L=e.findInBody(T,"a").some(q=>w.url&&q.getAttribute("href")===w.url||q.getAttribute("data-norma")===w.sigla),M=e.saveSelection(T);e.focus(T),M&&e.restoreSelection(T,M),e.withEdit(T,()=>{e.insertElement(T,Et(w,L))})}function i(w,A){let T=A??p??e.getInstance();T&&ne(r,Lo,[w],!0).then(L=>{let M=L[String(w??"").trim()];if(!M)return t(Ct);d(M,T)},()=>t(wt))}function u(w,A){let T=Aa(w.ementa),L=w.url?g("a",{class:"spro-link",href:w.url,target:"_blank",rel:"noopener noreferrer"},w.titulo," \u2197"):g("span",{},w.titulo),M=g("button",{type:"button",class:"spro-botao pequeno","data-legis-idx":String(A),onclick:()=>k(M)},"Adicionar"),q=_=>g("button",{type:"button",class:"spro-botao-texto",onclick:R=>v(R.currentTarget)},_),Q=g("div",{class:w.revogada?"searchLegis_linha spro-resultado revogada":"searchLegis_linha spro-resultado"},g("div",{class:"spro-resultado-topo"},g("div",{class:"spro-resultado-titulo"},L,w.apelido?g("span",{class:"spro-resultado-apelido"},` (${w.apelido})`):null,w.revogada?g("span",{class:"spro-selo"},"Revogada"):null),M));return T.completa&&Q.append(g("p",{class:"searchLegis_ementa spro-ementa"},`${T.curta} `,T.longa?q("mais"):null),g("p",{class:"searchLegis_ementafull spro-ementa",style:"display:none;"},`${T.completa} `,q("menos"))),Q}let b=w=>g("div",{class:"spro-aviso-inline spro-resultado-aviso"},w);function s(w,A,T,L){a=A;let M=w.querySelector("#searchLegis_result");if(!M)return;let q=[];L&&q.push(b(L)),q.push(...A.map((_,R)=>u(_,R))),T>A.length?q.push(b(`Mostrando ${A.length} de ${T} resultados. Restrinja sua pesquisa.`)):A.length||q.push(b("Nenhum resultado encontrado :(")),M.replaceChildren(...q),M.style.display="";let Q=w.querySelector("#searchLegis_load");Q&&(Q.style.display="none")}function f(w){let A=w.querySelector("#searchLegis_load");A&&(A.style.display="none"),t(wt)}let m=(w,A)=>w.querySelector(`#${A}`)?.value??"",h=(w,A)=>{let T=w.querySelector("#searchLegis_load");T&&(T.style.display=A?"":"none")};function y(w){let A=w?.closest(".spro-legis")??o.doc.querySelector(".spro-legis");if(!A)return;let T=m(A,"legis_anoNorma").trim();h(A,!0);let L=A.querySelector("#searchLegis_result");L&&(L.style.display="none"),l+=1;let M=l;ae(r,Lo,{q:m(A,"legis_termoNorma").trim(),tipo:m(A,"legis_tipoNorma"),numero:se(m(A,"legis_numeroNorma")),ano:T,periodo:T?ie(m(A,"legis_periodoNorma")):""}).then(q=>M===l&&s(A,q.normas,q.total),()=>M===l&&f(A))}function x(w,A,T,L,M,q){h(w,!0),l+=1;let Q=l;ae(r,Lo,{tipo:A,numero:T,ano:L,periodo:L?ie(M):""}).then(({normas:_,total:R})=>{Q===l&&(h(w,!1),_.length===1&&R<=1?(c?.(),d(_[0],q)):_.length?s(w,_,R||_.length,`H\xE1 ${R||_.length} normas com esse n\xFAmero. Escolha abaixo ou informe o ano.`):t(Ct))},()=>Q===l&&f(w))}function k(w){let A=a[Number.parseInt(w?.getAttribute("data-legis-idx")??"",10)];if(!A)return;let T=p??void 0;c?.(),d(A,T)}function v(w){let A=w?.closest(".searchLegis_linha"),T=A?.querySelector(".searchLegis_ementa"),L=A?.querySelector(".searchLegis_ementafull");if(!T||!L)return;let M=T.style.display==="none";T.style.display=M?"":"none",L.style.display=M?"none":""}function E(w,A,T,L=!1){return P(w,{para:A,largo:L},g("select",{id:A},...T.map(([M,q])=>g("option",{value:q},M===""?"Selecione\u2026":M))))}function C(w,A,T="text",L=!1){return P(w,{para:A,largo:L},g("input",{type:T,id:A,autocomplete:"off"}))}function S(w){let A=w??e.getInstance();if(!A)return;a=[];let T=[["federal","Legisla\xE7\xE3o Federal"],["infra","Norma Infralegal"],["lista","Lista de Normas"]],L=g("span",{id:"searchLegis_load",class:"spro-dica",style:"display:none;"},"Pesquisando\u2026"),M={federal:g("div",{class:"spro-form"},V("duas",E("Tipo de legisla\xE7\xE3o","legis_tipoNorma",ya),C("N\xFAmero","legis_numeroNorma","number"),E("Per\xEDodo da publica\xE7\xE3o","legis_periodoNorma",Ea),C("Ano da publica\xE7\xE3o","legis_anoNorma","number"),C("Palavras-chave do conte\xFAdo","legis_termoNorma","text",!0)),g("div",{class:"spro-barra fim"},L,g("button",{type:"button",id:"searchLegis_uiElement",class:"spro-botao",title:"Pesquisar",onclick:U=>y(U.currentTarget)},"Pesquisar")),g("div",{id:"searchLegis_result",class:"spro-resultados",style:"display:none;"})),infra:g("div",{class:"spro-form"},V("duas",E("Autoridade signat\xE1ria","legis_orgaoInfraNorma",ka),E("Tipo de legisla\xE7\xE3o","legis_tipoInfraNorma",wa),C("N\xFAmero da norma","legis_numeroInfraNorma","number"))),lista:g("div",{class:"spro-form"},E("Nome da legisla\xE7\xE3o","legis_nomeNorma",Ca))},q=co("legis",T,M),Q=q.selecionar,_=g("div",{class:"spro-form spro-legis"},q.barra,g("div",{},...q.paineis),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let U=m(_,"legis_tipoNorma"),io=se(m(_,"legis_numeroNorma")),$=m(_,"legis_tipoInfraNorma"),j=m(_,"legis_numeroInfraNorma"),G=m(_,"legis_nomeNorma");if(U!==""&&io!=="")return x(_,U,io,m(_,"legis_anoNorma").trim(),m(_,"legis_periodoNorma"),A);if($!==""&&j!==""){let eo=(j.includes("/")?j.split("/")[0]??"":j).replace(/[^0-9-]+/g,"");i(m(_,"legis_orgaoInfraNorma")+$+eo,A)}else if(G!=="")i(G,A);else return t("Informe o tipo e o n\xFAmero da norma, ou escolha uma norma da lista.");c?.()}},"Inserir")));p=A;let R=H(o.doc,{titulo:"Adicionar link de legisla\xE7\xE3o",largura:640,conteudo:_,aoFechar:()=>{l+=1,p=null}});c=()=>R.fechar(),Q("federal"),_.querySelector("#legis_tipoNorma")?.focus({preventScroll:!0});let I=e.getSelectedText(A)||"",W=kt(I),K=_.querySelector("#legis_tipoNorma");if(W&&K&&(K.value=W),/\d/.test(I)){let U=I.includes("/")?I.split("/")[0]??"":I;U=I.includes(",")?I.split(",")[0]??"":U;let io=_.querySelector("#legis_numeroNorma");io&&(io.value=/\d/.test(U)?U.replace(/\D/g,""):"");let $=/(?:\/|\bde\s+)(\d{4})\b/.exec(I),j=_.querySelector("#legis_anoNorma");$&&j&&(j.value=$[1]??"")}try{let U=o.win;o.verifyOpcao("substituiselecao")&&typeof U.setChosenInCke=="function"&&U.setChosenInCke()}catch{}}return{resolverNormasLegisPro:n,sendLegisSEI:i,insertLegisSEI:k,getLegisSEI(w){let A=e.getInstance(w);A&&S(A)},getSearchLegisMore:v,getSearchLegis:y,getDialogLegisSEI:()=>{}}}};function le(o,e){let t=o.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===e.ownerDocument)??t.getInstance()}function de(o,e){let t=o.editing.view.domConverter.mapDomToView(e);return t?o.editing.mapper.toModelRange(o.editing.view.createRangeOn(t)):null}function yo(o,e,t,r){let a=o.adaptador.versao===5?!!o.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:o.adaptador.somenteLeitura(e);return a&&o.adaptador.recusarEscrita(),a}function St(o,e){return e.isConnected?!0:(D(o.doc,"O link n\xE3o est\xE1 mais no documento."),!1)}function Tt(o,e){if(!St(o,e))return!1;let t=le(o,e);if(!t)return!1;if(o.adaptador.versao===5){let r=t,a=de(r,e);return a?yo(o,t,e,a)?!1:(r.model.change(c=>c.setSelection(a)),r.execute("unlink"),!0):(D(o.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return yo(o,t,e,null)?!1:(o.adaptador.withEdit(t,()=>e.replaceWith(...Array.from(e.childNodes))),!0)}function Pt(o,e,t,r){if(!St(o,e))return!1;let a=le(o,e);if(!a)return!1;if(o.adaptador.versao===5){let c=a,l=de(c,e);return l?yo(o,a,e,l)?!1:(c.model.change(p=>{p.setSelection(l),c.model.insertContent(p.createText(t,{linkHref:r}))}),!0):(D(o.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return yo(o,a,e,null)?!1:(o.adaptador.withEdit(a,()=>{e.setAttribute("href",r),e.setAttribute("data-cke-saved-href",r),e.textContent=t}),!0)}function Sa(o,e){let t=[],r=l=>{for(let p of Array.from(l.childNodes))p.nodeType===3?t.push(p):r(p)};r(o);let[a,...c]=t;if(!a){o.textContent=e;return}a.textContent=e;for(let l of c)l.parentNode?.removeChild(l)}function ce(o,e){let t=0,r=[];for(let{a:c,texto:l}of e){let p=le(o,c);if(p)if(o.adaptador.versao===5){let n=de(p,c);if(!n||yo(o,p,c,n))continue;r.push({a:c,texto:l,intervalo:n,ed:p})}else{if(yo(o,p,c,null))continue;Sa(c,l),t+=1}}let a=r[0]?.ed;return a&&a.model.change(c=>{for(let{a:l,texto:p,intervalo:n}of[...r].reverse()){let d={},i=[...n.getItems?.()??[]].find(u=>typeof u.getAttributes=="function");if(i)for(let[u,b]of i.getAttributes())d[u]=b;d.linkHref=l.getAttribute("href")??"",c.remove(n),c.insertText(p,d,n.start),t+=1}}),t}var Ta="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Lt=new WeakMap,Pa=o=>{let e=Lt.get(o);if(e)return e;let t={balao:null};return Lt.set(o,t),t},La=o=>o.length>50?`${o.replace(/^(.{50}[^\s]*).*/,"$1")}...`:o;function _t(o){let e=Pa(o),t=s=>D(o.doc,s);function r(s){let f=e.balao;if(f){if(!s){let m=!1;try{m=f.el.matches(":hover")}catch{m=!1}if(m)return}f.el.remove(),e.balao=null}}function a(){if(e.balao)return e.balao.link;let s=o.adaptador.getInstance();return(s?o.adaptador.getSelectionElement(s):null)?.closest("a[href]")??null}async function c(s){try{await(o.areaDeTransferencia??o.win.navigator.clipboard).writeText(s),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function l(s,f){r(!0);let m=s?.closest?.("a[href]"),h=m?.getAttribute("href")??"";if(!m||!J(h))return;let y=g("a",{href:h,target:"_blank",rel:"noopener noreferrer",title:m.textContent??"",style:"color:inherit;text-decoration:underline;"},g("strong",{},La(h))),x=(E,C,S)=>g("button",{type:"button",class:E,title:C,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:S},C),k=g("div",{class:"linkDisplayPro",style:Ta},y,x("spro-copiar","Copiar",()=>void c(h)),x("spro-editar","Editar",()=>i()),x("spro-remover","Remover",()=>p()));o.doc.body.append(k),e.balao={el:k,link:m};let v=m.getBoundingClientRect?.();if(v){let E=m.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),C=k.getBoundingClientRect?.().width??0,S=Math.max(8,Math.min(v.left+(E?.left??0),(o.win.innerWidth||0)-C-8));k.style.left=`${S}px`,k.style.top=`${v.bottom+(E?.top??0)+4}px`}}function p(s,f){let m=a();m&&(Tt(o,m),r(!0))}function n(s,f){let m=a()?.getAttribute("href");m&&J(m)&&o.win.open(m,"_blank","noopener,noreferrer")}function d(s,f){let m=a()?.getAttribute("href");m&&c(m)}function i(){let s=a();if(!s)return;let f=g("input",{type:"text",id:"linkProNome",autocomplete:"off"}),m=g("input",{type:"text",id:"linkProUrl",placeholder:"https://",autocomplete:"off",spellcheck:"false"});f.value=s.textContent??"",m.value=s.getAttribute("href")??"";let h=H(o.doc,{titulo:"Editar link",conteudo:uo(Z("Texto do link",f),Z("Endere\xE7o (URL)",m),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let y=m.value.trim(),x=f.value.trim()||y;if(y==="")return t("Digite um link");if(re.test(y))return t("O link informado \xE9 inv\xE1lido.");Pt(o,s,x,y)&&(r(!0),h.fechar())}},"Salvar")))})}function u(){o.adaptador.versao===5&&o.doc.addEventListener("mousedown",s=>{let f=s.target;if(!f||e.balao?.el.contains(f))return;let m=f.closest?.("a[href]");m&&f.closest(".ck-editor__editable_inline")&&o.checkOpcao("editarlinks")?l(m):r(!1)},!0)}return{globais:{showLinkTips:l,hideLinkTips:s=>r(!1),openLinkPro:n,removeLinkPro:p,copyLinkPro:d,editLinkPro:s=>i(),openDialogLinkPro:i,getDialogLinkPro:()=>{}},iniciar:u}}var Mt={id:"link-pro",globais:o=>_t(o).globais,iniciar:o=>_t(o).iniciar()};var _a=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function qt(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o.trim());if(!e)return"";let[t,r,a]=[Number(e[1]),Number(e[2]),Number(e[3])],c=new Date(t,r-1,a);return c.getFullYear()!==t||c.getMonth()!==r-1||c.getDate()!==a?"":`${a} de ${_a[r-1]} de ${t}`}function pe(o){let e=h=>N(h),t=h=>h!=="",r=t(o.nome)?`, ${e(fo(o.nome.trim()))}`:"",a=e(o.sobrenome.toUpperCase()),c=t(o.titulo)?`. <strong>${e(fo(o.titulo.trim()))}</strong>`:"",l=t(o.edicao)?`. ${e(o.edicao)}. ed.`:"",p=t(o.local)?`, ${e(fo(o.local.trim()))}`:"",n=t(o.editora)?`: ${e(fo(o.editora.trim()))}`:"",d=t(o.ano)?`, ${e(o.ano)}`:"",i=t(o.volume)?`, v. ${e(o.volume)}`:"",u=t(o.paginas)?`. p.${e(o.paginas)}`:"",b=t(o.link)&&J(o.link)?`. Dispon\xEDvel em: <a href="${e(o.link)}" target="_blank">&lt;${e(o.link)}&gt;</a>`:"",s=qt(o.data),f=s?`. Acesso em: ${s}`:"",m=a+r+c+l+p+n+d+i+u+b+f;return m===""?"":`${m}.`}function mo(o,e){let t=o.editing.view.domConverter.mapDomToView(e);return t?o.editing.mapper.toModelElement(t):null}function Eo(o,e){let t=e?.root?.rootName;return!!o.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var me="ntRodape_item",vo="ntRodape_footer",It=".ntRodape_item, .ntRodape, .ntRodape_tr",Rt='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function $t(o,e){let t=N(o);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${e}</p>`}function Nt(o){let e=N(o);return`<sup><a href="#footer_${e}" name="item_${e}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${e}" contenteditable="false">[?]</span></a></sup> `}function Ht(o,e=new Set){let t=new Map,r=0;for(let l of o)l.tipo==="item"&&(r+=1,t.set(l.ref,r));let a=[],c=[];for(let l of o){if(l.tipo!=="footer")continue;let p=t.get(l.ref);p!==void 0?a.push({ref:l.ref,chave:p}):e.has(l.ref)?a.push({ref:l.ref,chave:Number.isFinite(l.numero)?l.numero:Number.MAX_SAFE_INTEGER}):c.push(l.ref)}return a.sort((l,p)=>l.chave-p.chave),{numeroDe:t,ordem:a.map(l=>l.ref),orfaos:c}}var ue=o=>o.getAttribute("data-ntrodape-ref")??"";function zt(o,e=new Set){let t=Array.from(o.querySelectorAll(`.${me}[data-ntrodape-ref]`)),r=Array.from(o.querySelectorAll("p.ntRodape")).filter(p=>p.querySelector(`.${vo}[data-ntrodape-ref]`)),a=p=>Number.parseInt(p.querySelector(`.${vo}`)?.getAttribute("data-ntrodape")??"",10),c=Ht([...t.map(p=>({tipo:"item",ref:ue(p)})),...r.map(p=>({tipo:"footer",ref:ue(p.querySelector(`.${vo}`)),numero:a(p)}))],e);t.forEach((p,n)=>{p.setAttribute("data-ntrodape",String(n+1)),p.textContent=`[${n+1}]`});let l=new Map;for(let p of r){let n=ue(p.querySelector(`.${vo}`)),d=c.numeroDe.get(n),i=p.querySelector(`.${vo}`);d!==void 0&&(i.setAttribute("data-ntrodape",String(d)),i.textContent=`[${d}]`),p.remove(),l.set(n,p)}for(let p of c.ordem){let n=l.get(p);n&&o.append(n)}if(!c.ordem.length)for(let p of o.querySelectorAll(".ntRodape_tr"))p.remove();return c}function Qt(o){for(let e of o.querySelectorAll(".ntRodape, .ntRodape_tr"))e.remove();for(let e of o.querySelectorAll(`.${me}[data-ntrodape-ref]`))(e.closest("sup")??e).remove();for(let e of o.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))e.remove()}var Dt=o=>o.getAttribute?.("htmlSpan")?.classes??[],Ma=o=>o.getAttribute?.("htmlPAttributes")?.classes??[];function Ot(o,e){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of o.createRangeIn(e).getItems())if(r.is("$textProxy")||r.is("$text")){let a=Dt(r);a.includes(me)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):a.includes(vo)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===e){let a=Ma(r);if(a.includes("ntRodape_tr"))t.separadores.push(r);else if(a.includes("ntRodape")){let l=Array.from(o.createRangeIn(r).getItems()).find(p=>(p.is("$textProxy")||p.is("$text"))&&Dt(p).includes(vo))?.getAttribute("htmlSpan")?.attributes??{};l["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:l["data-ntrodape-ref"],numero:Number.parseInt(l["data-ntrodape"],10)})}}return t}function qa(o,e,t){let r=e.getAttribute("htmlSpan")??{},a=`[${t}]`;if(e.data===a&&r.attributes?.["data-ntrodape"]===String(t))return;let c=Object.fromEntries(e.getAttributes());c.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let l=o.createRangeOn(e),p=l.start;o.remove(l),o.insertText(a,c,p)}function jt(o,e,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return o.model.change(a=>{let c=Ot(a,e),l=d=>d.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=Ht([...c.itens.map(d=>({tipo:"item",ref:l(d)})),...c.rodapes.map(d=>({tipo:"footer",ref:d.ref,numero:d.numero}))],t);let p=[],n=0;for(let d of c.textos)if(d.tipo==="item")n+=1,p.push({no:d.no,n});else{let i=r.numeroDe.get(l(d.no));i!==void 0&&p.push({no:d.no,n:i})}for(let d of[...p].reverse())qa(a,d.no,d.n);for(let d of r.orfaos){let i=c.rodapes.find(u=>u.ref===d);i&&a.remove(a.createRangeOn(i.bloco))}for(let d of r.ordem){let i=c.rodapes.find(u=>u.ref===d);i&&a.move(a.createRangeOn(i.bloco),a.createPositionAt(e,"end"))}if(!r.ordem.length)for(let d of c.separadores)a.remove(a.createRangeOn(d))}),r}function Bt(o,e){o.model.change(t=>{let r=Ot(t,e),a=[...r.itens,...r.rodapes.map(c=>c.bloco),...r.separadores];for(let c of[...a].reverse())t.remove(t.createRangeOn(c))})}function _o(o,e){if(!o?.model||!o.editing||!e)return null;for(let t of Array.from(o.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=o.editing.view.document.getRoot(t.rootName);if(r&&o.editing.view.domConverter.mapViewToDom(r)===e)return t}catch{}return null}function Ft(o,e,t){let r=new Set;for(let a of Array.from(o.model.document.roots??[]))if(!(!a||a===e||a.rootName==="$graveyard"))for(let c of t(o.data.get({rootName:a.rootName})))r.add(c);return r}var Da='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',Vt=new WeakSet,Gt=new WeakSet,ge=o=>o.replace(/["\\]/g,"\\$&");function Ia(o,e){let t=o.querySelector(`[name="${ge(e)}"], [id="${ge(e)}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(e);return r?o.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${ge(r[2]??"")}"]`):null}function no(o){if(o.adaptador.versao!==5)for(let t of o.adaptador.getAllInstances())Gt.has(t)||(Gt.add(t),o.adaptador.on(t,"contentDom",()=>no(o)));let e=o.adaptador.versao===5?[o.doc]:o.adaptador.getAllInstances().map(t=>o.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of e)!t||Vt.has(t)||(Vt.add(t),t.addEventListener("click",r=>{let a=r.target?.closest?.(Da);if(!a)return;let c=Ia(t,(a.getAttribute("href")??"").slice(1));(c?.closest("p")??c)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var Ra=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],Ut={id:"nota-rodape",globais(o){let e=o.adaptador,t=m=>D(o.doc,m),r=m=>e.getBodyContainer(m),a=m=>e.findInBody(m,It).length>0;function c(m,h){let y=e.versao===5?Eo(o,h):e.somenteLeitura(m);return y&&e.recusarEscrita(),y}function l(m){let h=o.doc.createElement("div");return h.append(...go(o.doc,m)),Array.from(h.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(y=>y.getAttribute("data-ntrodape-ref")??"")}function p(m){if(e.versao===5){let h=_o(m,r(m));h&&jt(m,h,Ft(m,h,l))}else{let h=r(m);h&&zt(h)}}function n(m){let y=typeof m=="object"&&m!==null&&("model"in m||e.getAllInstances().includes(m))?m:e.getInstance();if(!y)return!1;let x=e.versao===5?_o(y,r(y)):null;return e.versao===5&&!x?(t("N\xE3o foi poss\xEDvel localizar o corpo do documento para atualizar as notas."),!1):c(y,x)?!1:(e.withEdit(y,()=>p(y)),!0)}function d(m){let h=m??e.getInstance();if(h){if(!a(h)){t("O documento n\xE3o tem notas de rodap\xE9.");return}n(h)&&(no(o),t("Notas de rodap\xE9 atualizadas com sucesso"))}}function i(m,h){let y=h??e.getInstance();if(!y)return;if(!a(y)){t("O documento n\xE3o tem notas de rodap\xE9.");return}let x=e.versao===5?_o(y,r(y)):null;if(e.versao===5&&!x){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para remover as notas.");return}c(y,x)||(e.withEdit(y,()=>{if(e.versao===5)Bt(y,x);else{let k=r(y);k&&Qt(k)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function u(m,h){let y=h??e.getInstance();if(!y||m.trim()==="")return;let x=e.versao===5?_o(y,r(y)):null;if(e.versao===5&&!x){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para inserir a nota.");return}if(c(y,x))return;let k=po(16);e.withEdit(y,()=>{if(e.versao===5){let v=y;v.model.document.selection.getFirstPosition()?.root!==x&&v.model.change(E=>E.setSelection(x,"end"))}e.findInBody(y,".ntRodape_tr").length||e.appendToBody(y,Rt),e.appendToBody(y,$t(k,m)),e.insertHtml(y,Nt(k)),p(y)}),no(o)}function b(m){let h=y=>(m.querySelector(`#${y}`)?.value??"").toString();return Object.fromEntries(Ra.map(([y,x])=>[y,h(x)]))}function s(m){let h=m??o.doc,y=h.querySelector("#nrABNTResult");y&&y.replaceChildren(...go(o.doc,pe(b(h))))}function f(m){let h=m??e.getInstance();if(!h)return;let y=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],x=null,k=L=>{x&&(L==="livre"||L==="abnt"?x.removeAttribute("hidden"):x.setAttribute("hidden",""))},v=g("textarea",{id:"textNotaRodape",rows:"4",placeholder:"Digite o texto da nota de rodap\xE9"}),E=(L,M,q="text",Q={})=>P(L,{para:M,largo:Q.largo},g("input",{type:q,id:M,autocomplete:"off",...Q.placeholder?{placeholder:Q.placeholder}:{}})),C=lo({id:"nrABNTResult"},{vazio:"A nota formatada aparece aqui"});C.classList.add("texto");let S=z(V("duas",E("Nome do autor","nr_Nome"),E("Sobrenome do autor","nr_Sobrenome")),E("T\xEDtulo da publica\xE7\xE3o","nr_Titulo"),V("tres",E("Edi\xE7\xE3o","nr_Edicao","number"),E("Ano","nr_Ano","number"),E("Volume","nr_Volume","number")),V("duas",E("Local (cidade)","nr_Local"),E("Editora","nr_Editora")),V("duas",E("P\xE1ginas (inicial-final)","nr_Paginas"),E("Data do acesso","nr_Data","date")),E("Link da publica\xE7\xE3o","nr_Link","text",{placeholder:"https://"}),P("Nota formatada",{},C));S.classList.add("compacto");let w={livre:P("Texto da nota de rodap\xE9",{para:"textNotaRodape"},v),abnt:S,atualizar:g("div",{class:"spro-form"},Y("Atualiza a numera\xE7\xE3o e a ordem das notas de rodap\xE9 que j\xE1 existem no documento."),g("div",{},g("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>d(h)},"Atualizar notas"))),remover:g("div",{class:"spro-form"},Y("Remove todas as notas de rodap\xE9 do documento. Ctrl+Z desfaz."),g("div",{},g("button",{type:"button",id:"btnNrRemove",class:"spro-botao perigo",onclick:()=>{i(null,h),T.fechar()}},"Remover todas")))},A=co("nt",y,w,k);x=g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let L=(C.textContent??"").trim()?pe(b(S)):"",M=v.value.trim(),q=L||N(M).replace(/\r?\n/g,"<br>");if(!q){t("Digite o texto da nota de rodap\xE9.");return}u(q,h),T.fechar()}},"Inserir");for(let L of S.querySelectorAll("input"))L.addEventListener("input",()=>s(S)),L.addEventListener("change",()=>s(S));let T=H(o.doc,{titulo:"Inserir nota de rodap\xE9",largura:640,conteudo:g("div",{class:"spro-form"},A.barra,g("div",{},...A.paineis),g("div",{class:"spro-dialogo-rodape"},x))});A.selecionar("livre"),v.focus({preventScroll:!0})}return{getNotaRodape(m){let h=e.getInstance(m);h&&f(h)},getDialogNotaRodape:()=>{},openDialogNotaRodape:f,removeNtRodape:i,updateNrABNT:s,insertNtRodape:u,updateNtRodape:d,reorderNtRodape:n}},iniciar(o){no(o)}};function zo(o,e,t,r){let a=o.adaptador.getInstance(e);if(!a)return;let c=o.adaptador.getSelectionParagraph(a);if(c){if(o.adaptador.somenteLeitura(a)){o.adaptador.recusarEscrita();return}o.adaptador.withEdit(a,()=>{o.adaptador.insertHtmlBefore(a,c,t),r?.(a,c)})}}var $a='<div class="pageBreakPro" style="page-break-after: always"></div>',Wt={id:"page-break",globais:o=>({getPageBreak:e=>zo(o,e,$a)})};var Jt="/sei/modulos/pesquisa/",fe="frmCheckerProcessoPublicoPro",Na=60,Ha=500;function za(o,e,t,r){let a=[];for(let l of o.querySelectorAll("#tblDocumentos tr.infraTrClara")){let p=[...l.querySelectorAll("td")].map(m=>(m.textContent??"").trim()),n=l.querySelector("a.ancoraPadraoAzul")?.getAttribute("onclick")??"",d=/'([^']+)'/.exec(n)?.[1],i=d?`${e}${Jt}${d}`:"",u=p[2]??"",b=p[1]??"",s=`${N(u)}&nbsp;(${N(r)}${N(b)})`,f=i===""||!J(i);a.push({html:f?s:`<a class="ancoraSei" href="${N(i)}" target="_blank">${s}</a>`,rotulo:`${u} (${r}${b})${f?" [documento restrito]":""}`,restrito:f})}let c=(o.querySelector("#tblCabecalho tr.infraTrClara")?.querySelectorAll("td")[1]?.textContent??"").trim();return c&&a.push({html:J(t)?`<a class="ancoraSei" href="${N(t)}" target="_blank">${N(c)}</a>`:N(c),rotulo:`${c} (o processo)`,restrito:!1}),a}var Kt={id:"processo-publico",globais(o){let e=o.adaptador,t=o.win,r=b=>D(o.doc,b),a=()=>o.win.location?.origin??"",c=()=>`${a()}/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0`,l=b=>new Promise(s=>setTimeout(s,b)),p=b=>new o.win.DOMParser().parseFromString(b,"text/html");function n(){let b=o.doc.getElementById(fe);return b||(b=o.doc.createElement("iframe"),b.id=fe,b.setAttribute("style","width:1px;height:1px;position:absolute;top:-100px;display:none;"),b.setAttribute("tabindex","-1"),b.setAttribute("scrolling","no"),o.doc.body.append(b)),b}let d=()=>{try{return o.doc.getElementById(fe)?.contentDocument??null}catch{return null}};async function i(b){for(let s=0;s<Na;s+=1){let f=d(),m=f?b(f):null;if(m)return m;await l(Ha)}return null}function u(b){try{t.setParamEditor?.(b)}catch{}let s=e.getInstance(b);if(!s)return;let f=g("input",{type:"text",id:"processoPub",autocomplete:"off",placeholder:"N\xFAmero do processo"});f.value=t.dadosProcessoPro?.listAndamento?.processo??"";let m=g("input",{type:"text",id:"captchaPub",autocomplete:"off",placeholder:"C\xF3digo da imagem"}),h=lo({id:"searchPub_captcha"},{vazio:"Carregando o c\xF3digo\u2026"}),y=g("p",{id:"searchPub_result",class:"spro-dica",style:"flex:1;"}),x=g("div",{id:"listaDocPublico",class:"spro-checklist",role:"radiogroup","aria-label":"Documentos do processo"}),k=P("Documentos do processo",{largo:!0},x);k.setAttribute("hidden","");let v=[],E=0,C=g("button",{type:"button",id:"searchPub_search",class:"spro-botao"},X("busca",15),"Pesquisar"),S=g("button",{type:"button",class:"spro-botao primario",disabled:""},"Inserir"),w=(_,R="")=>{y.textContent=R,_?C.setAttribute("disabled",""):C.removeAttribute("disabled")},A=()=>{t.delayCrash=!1,w(!1,"N\xE3o foi poss\xEDvel usar a pesquisa p\xFAblica agora. Tente de novo.")};async function T(){E+=1;let _=E;h.replaceChildren(),m.value="",w(!0,"Carregando o c\xF3digo de verifica\xE7\xE3o\u2026");let R=n();R.src=c();let I=await i(K=>K.querySelector("#seiSearch")?K.querySelector("#lblCaptcha img")?.getAttribute("src")??K.querySelector("#imgCaptcha")?.getAttribute("src")??null:null);if(_!==E)return;if(!I){w(!1,"N\xE3o foi poss\xEDvel carregar a pesquisa p\xFAblica. Tente de novo.");return}let W=g("button",{type:"button",class:"spro-botao-icone pequeno",title:"Outro c\xF3digo","aria-label":"Outro c\xF3digo",onclick:()=>void T()},X("atualizar",15));h.replaceChildren(g("img",{src:I,alt:"C\xF3digo de verifica\xE7\xE3o"}),W),w(!1,""),m.focus({preventScroll:!0})}async function L(){let _=f.value.trim(),R=m.value.trim();if(!_||!R){r("Digite o processo e o c\xF3digo da imagem.");return}t.delayCrash=!0,k.setAttribute("hidden",""),S.setAttribute("disabled",""),w(!0,"Pesquisando\u2026");let I=d();if(!I){w(!1,"A pesquisa p\xFAblica n\xE3o est\xE1 carregada."),t.delayCrash=!1;return}let W=I.querySelector("#txtCaptcha")??I.querySelector("#txtInfraCaptcha"),K=I.querySelector("#txtProtocoloPesquisa");K&&(K.value=_),W&&(W.value=R),I.querySelector("#sbmPesquisar")?.click(),await l(800);let U=await i(io=>io.querySelector("#conteudo a.protocoloNormal")?.getAttribute("href")??null);if(t.delayCrash=!1,!U){w(!1,"Processo n\xE3o encontrado ou c\xF3digo incorreto. Confira e tente com outro c\xF3digo."),T().catch(A);return}await M(`${a()}${Jt}${U}`)}async function M(_){try{let R=await(o.fetch??o.win.fetch.bind(o.win))(_),I=p(await R.text());v=za(I,a(),_,t.getCitacaoDoc?.()??"SEI n\xBA ")}catch{w(!1,"N\xE3o foi poss\xEDvel ler o processo. Tente de novo.");return}x.replaceChildren(...v.map((R,I)=>ro({name:"docPublico",value:String(I),...I===0?{checked:"checked"}:{}},R.rotulo,"radio"))),k.removeAttribute("hidden"),S.removeAttribute("disabled"),w(!1,v.length?`${v.length} ${v.length===1?"item encontrado":"itens encontrados"}.`:"O processo n\xE3o tem documentos p\xFAblicos.")}C.addEventListener("click",()=>void L().catch(A)),m.addEventListener("keydown",_=>{_.key==="Enter"&&(_.preventDefault(),L().catch(A))}),S.addEventListener("click",()=>{let _=[...x.querySelectorAll("input")].find(I=>typeof I.checked=="boolean"?I.checked:I.hasAttribute("checked")),R=_?v[Number(_.getAttribute("value"))]:void 0;if(!R){r("Escolha o documento a inserir.");return}e.withEdit(s,()=>e.insertHtml(s,R.html)),Q.fechar()});let q=z(P("Processo",{para:"processoPub"},f),V("duas",P("Imagem de verifica\xE7\xE3o",{},h),P("Digite o c\xF3digo da imagem",{para:"captchaPub"},m)),g("div",{class:"spro-barra fim"},y,C),k,g("div",{class:"spro-dialogo-rodape"},S)),Q=H(o.doc,{titulo:"Adicionar link de documento p\xFAblico",largura:640,conteudo:q,aoFechar:()=>{E+=1,t.delayCrash=!1}});T().catch(A)}return{getCheckerProcessoPublicoPro:n,openDialogProcessoPublicoPro:u}}};function Xt(o,e,t){let r=o.jQuery,a=r?.(e).qrcode;if(!r||typeof a!="function")return null;e.replaceChildren();try{r(e).qrcode?.(t)}catch{return e.replaceChildren(),null}return e.querySelector("img, canvas")}var Mo={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},Qa=[["QrPro-size"," px"],["QrPro-minversion",""],["QrPro-quiet","m\xF3dulo"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],Oa=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],ja=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],Ba=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],Yt={id:"qr-code",globais(o){let e=o.adaptador,t=v=>D(o.doc,v),r=v=>o.doc.querySelector(v),a=v=>r(`#${v}`)?.value??"",c=()=>o.win.NAMESPACE_SPRO??"SEI Pro",l=()=>`${o.base}icons/menu/seipro.png`,p=(v,E,C,S)=>Co({id:v,min:E,max:C,step:S,value:Mo[v]??""}),n=v=>g("p",{class:"spro-subtitulo"},v);function d(){let v=Zo({id:"optionsQrAdvanced",style:"display:none;"},n("Tamanho e margens"),V("duas",P("Tamanho do QR",{para:"QrPro-size",valor:"140 px"},p("QrPro-size",100,500,50)),P("Vers\xE3o",{para:"QrPro-minversion",valor:"6"},p("QrPro-minversion",1,10,1)),P("Margem de folga",{para:"QrPro-quiet",valor:"1 m\xF3dulo"},p("QrPro-quiet",0,4,1)),P("Raio de canto",{para:"QrPro-radius",valor:"50%"},p("QrPro-radius",0,50,10))),n("Cores"),V("duas",P("Preenchimento",{para:"QrPro-fill"},Ao({id:"QrPro-fill",value:Mo["QrPro-fill"]??""})),P("Fundo",{para:"QrPro-background"},Ao({id:"QrPro-background",value:Mo["QrPro-background"]??""}),ro({id:"QrPro-background-transparent"},"Fundo transparente"))),n("Corre\xE7\xE3o e modo"),V("duas",P("Corre\xE7\xE3o de erros",{para:"QrPro-eclevel"},g("select",{id:"QrPro-eclevel"},...Ba.map(([C,S])=>g("option",{value:C},S)))),P("Modo",{para:"QrPro-mode"},g("select",{id:"QrPro-mode"},...ja.map(([C,S])=>g("option",{value:C},S))))),g("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;"},V("tres",P("Tamanho da etiqueta",{para:"QrPro-msize",valor:"20%"},p("QrPro-msize",0,40,1)),P("Posi\xE7\xE3o X",{para:"QrPro-mposx",valor:"50%"},p("QrPro-mposx",0,100,1)),P("Posi\xE7\xE3o Y",{para:"QrPro-mposy",valor:"50%"},p("QrPro-mposy",0,100,1)))),g("div",{class:"QrMode-etiqueta",style:"display:none;"},V("tres",P("Nome da fonte",{para:"QrPro-font"},g("select",{id:"QrPro-font"},...Oa.map(C=>g("option",{value:C},C)))),P("Cor da fonte",{para:"QrPro-fontcolor"},Ao({id:"QrPro-fontcolor",value:Mo["QrPro-fontcolor"]??""})),P("Etiqueta",{para:"QrPro-label"},g("input",{id:"QrPro-label",type:"text",value:c()})))),g("div",{class:"QrMode-imagem",style:"display:none;"},P("Imagem",{para:"QrPro-image",dica:"A imagem entra no QR conforme o modo escolhido."},g("input",{id:"QrPro-image",type:"file",accept:"image/*"})),g("img",{id:"QrPro-img-buffer",style:"display:none",src:l(),alt:""}))),E=So("Restaurar padr\xF5es",()=>u(),{id:"QrPro-reset"});return E.style.display="none",g("div",{id:"qrCodeLab",class:"spro-form spro-lateral"},lo({id:"qrCodeResult"},{vazio:"A pr\xE9via do QR aparece aqui",xadrez:!1}),g("div",{class:"spro-barra"},So("Op\xE7\xF5es avan\xE7adas",()=>i(),{id:"toggleOptionsQR",expansivel:!0}),E),v)}function i(){let v=r("#optionsQrAdvanced");if(!v)return;v.style.display=v.style.display==="none"?"":"none";let E=r("#qrCodeLab");v.style.display===""?E?.setAttribute("data-aberto",""):E?.removeAttribute("data-aberto");let C=r("#QrPro-reset");C&&(C.style.display=v.style.display)}function u(){for(let[S,w]of Object.entries(Mo)){let A=r(`#${S}`);A&&(A.value=w)}let v=r("#QrPro-label");v&&(v.value=c());let E=r("#QrPro-background-transparent");E&&(E.checked=!1,E.removeAttribute("checked")),r("#QrPro-img-buffer")?.setAttribute("src",l());let C=r("#qrCodeLab");C&&ho(C),y()}function b(v){r("#tipQrCodeUrl")?.remove();let E=r("#qrCodeResult");if(v===""||!J(v)||v.length<=50||!E)return;let C=g("div",{id:"tipQrCodeUrl",class:"spro-aviso-inline"},g("span",{},"Endere\xE7o longo deixa o QR denso e dif\xEDcil de ler."),So("Gerar link curto",()=>f()));E.before(C)}function s(v){let E=r("#qrCodeText");E&&(E.value=v),y()}function f(){let v=a("qrCodeText").trim(),E=o.win.ajaxTinyUrl;if(typeof E!="function"){t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");return}Promise.resolve(E(v,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function m(){let v=r("#qrCodeLab");if(v)for(let[E,C]of Qa){let S=a(E);bo(v,E,C==="m\xF3dulo"?`${S} ${S==="1"?"m\xF3dulo":"m\xF3dulos"}`:`${S}${C}`)}}function h(v){let E=C=>Number.parseInt(a(C),10);return{render:"image",ecLevel:a("QrPro-eclevel"),minVersion:E("QrPro-minversion"),fill:a("QrPro-fill"),background:r("#QrPro-background-transparent:checked")?null:a("QrPro-background"),text:v,size:E("QrPro-size"),radius:E("QrPro-radius")*.01,quiet:E("QrPro-quiet"),mode:E("QrPro-mode"),mSize:E("QrPro-msize")*.01,mPosX:E("QrPro-mposx")*.01,mPosY:E("QrPro-mposy")*.01,label:a("QrPro-label"),fontname:a("QrPro-font"),fontcolor:a("QrPro-fontcolor"),image:r("#QrPro-img-buffer")}}function y(){let v=r("#qrCodeResult");if(!v)return;v.replaceChildren(),v.classList.toggle("xadrez",r("#QrPro-background-transparent:checked")!==null);for(let S of o.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))S.style.display="none";m();let E=a("QrPro-mode");if(E==="1"||E==="2")for(let S of o.doc.querySelectorAll(".QrMode-etiqueta"))S.style.display="";else if(E==="3"||E==="4")for(let S of o.doc.querySelectorAll(".QrMode-imagem"))S.style.display="";let C=a("qrCodeText");C!==""&&!Xt(o.win,v,h(C))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),b(C)}function x(v,E){let C=E??e.getInstance();if(!C)return!1;let S=r("#qrCodeResult img")?.getAttribute("src")??"";return/^data:image\/(png|jpeg|gif|webp);base64,/i.test(S)?e.somenteLeitura(C)?(e.recusarEscrita(),!1):(e.withEdit(C,()=>e.insertHtml(C,`<img src="${N(S)}" alt="${N(v)}">`)),!0):(t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),!1)}function k(v){let E=v??e.getInstance();if(!E)return;let C=g("input",{type:"text",id:"qrCodeText",placeholder:"Endere\xE7o, texto ou qualquer dado",autocomplete:"off"}),S=(e.getSelectedText(E)||String(o.win.getSelection?.()??"")).trim();S&&(C.value=S),C.addEventListener("input",()=>y()),C.addEventListener("change",()=>y());let w=d();for(let T of["input","change"])w.querySelector("#optionsQrAdvanced")?.addEventListener(T,()=>y());w.querySelector("#QrPro-image")?.addEventListener("change",T=>{let L=T.target.files?.[0];if(!L)return;let M=new FileReader;M.onload=()=>{let q=String(M.result??"");if(!/^data:image\//i.test(q)){t("Escolha um arquivo de imagem.");return}r("#QrPro-img-buffer")?.setAttribute("src",q);let Q=r("#QrPro-mode");Q&&(Q.value="4"),setTimeout(y,200)},M.readAsDataURL(L)});let A=H(o.doc,{titulo:"Gerar C\xF3digo QR",largura:760,conteudo:z(P("Texto a codificar",{para:"qrCodeText"},C),w,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let T=C.value.trim();if(!T){t("Digite o texto a codificar");return}x(T,E)&&A.fechar()}},"Inserir")))});S&&y()}return{getQrCode(v){let E=e.getInstance(v);E&&k(E)},getDialogQrCode:()=>{},openDialogQrCode:k,buildHtmlQrCodeLab:d,resetOptionsQR:u,toggleOptionsQR:i,tipQrCodeUrl:b,setInputTinyUrl:s,convertTinyURL:f,updateQrCode:y,setQrCode:x}}};var Zt=5,or=5,er=49,oo=(o,e)=>Number.parseInt(o?.getAttribute(e)??"",10);function Fa(o,e){let t=o?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=o?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let a=o?.previousElementSibling??null;a;a=a.previousElementSibling)if(a.classList.contains("divQuickTable"))return a;return e.querySelector(".divQuickTable")}var tr={id:"quick-table",globais(o){let e=o.adaptador;function t(){for(let i of o.doc.querySelectorAll(".divQuickTable"))i.replaceChildren(),Io(i);for(let i of o.doc.querySelectorAll(".getQuickTableButtom"))i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")}function r(i){if(!i)return;let u=oo(i,"data-row"),b=oo(i,"data-col"),s=i.closest("table");if(!s)return;for(let h of s.querySelectorAll("td"))h.classList.remove("td_hover");let f=()=>[...s.querySelectorAll("tr")];if(u>=3&&oo(f().at(-1)?.querySelector("td"),"data-row")>u+1&&(f().at(-1)?.remove(),s.setAttribute("data-row",String(oo(s,"data-row")-1))),b>=3&&oo(f().at(-1)?.lastElementChild,"data-col")>b+1){for(let h of f())h.lastElementChild?.remove();s.setAttribute("data-col",String(oo(s,"data-col")-1))}for(let h of s.querySelectorAll("td"))oo(h,"data-row")<=u&&oo(h,"data-col")<=b&&h.classList.add("td_hover");let m=i.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(m&&(m.textContent=`Tabela ${u+1}x${b+1}`),u===oo(s,"data-row")&&u<er){let h=f().at(-1)?.cloneNode(!0);h&&(h.querySelectorAll("td").forEach((y,x)=>{y.setAttribute("data-row",String(u+1)),y.setAttribute("data-col",String(x)),y.classList.remove("td_hover")}),(s.querySelector("tbody")??s).append(h),s.setAttribute("data-row",String(u+1)))}if(b===oo(s,"data-col")&&b<er){for(let h of f()){let y=h.lastElementChild?.cloneNode(!0);y&&(y.setAttribute("data-col",String(b+1)),y.classList.remove("td_hover"),h.append(y))}s.setAttribute("data-col",String(b+1))}}function a(){let i=o.doc,u=i.createDocumentFragment(),b=i.createElement("div");b.className="quickTableInfo",b.textContent="Inserir Tabela";let s=i.createElement("table");s.setAttribute("data-row",String(Zt-1)),s.setAttribute("data-col",String(or-1));for(let m=0;m<Zt;m+=1){let h=i.createElement("tr");for(let y=0;y<or;y+=1){let x=i.createElement("td");x.setAttribute("data-row",String(m)),x.setAttribute("data-col",String(y)),h.append(x)}s.append(h)}let f=m=>r(m.target?.closest("td")??null);return s.addEventListener("mouseover",f),s.addEventListener("mouseout",f),s.addEventListener("click",m=>{let h=m.target?.closest("td");h&&d(h)}),u.append(b,s),u}function c(i){if(!i)return;let u=Fa(i,o.doc);i.classList.contains("cke_button_on")?(t(),i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")):(u&&(u.replaceChildren(a()),Do(u)),i.classList.remove("cke_button_off"),i.classList.add("cke_button_on"))}function l(i){let u=i?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),b=u?[...u.querySelectorAll(".getTablestylesButtom")]:[];b.length||(b=[...o.doc.querySelectorAll(".getTablestylesButtom")]);for(let s of b)s.classList.remove("cke_button_disabled")}function p(i,u){let b='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';b+="  <tbody>";for(let s=0;s<=i;s+=1){b+="      <tr>";for(let f=0;f<=u;f+=1)b+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';b+="      </tr>"}return`${b}  </tbody></table>`}function n(i,u){let b=u?u.nextElementSibling:e.getBodyContainer(i)?.lastElementChild,s=b?.tagName==="TABLE"?b.querySelector("td p"):null;if(!s)return;let f=s.ownerDocument,m=f.defaultView?.getSelection?.();if(!m)return;let h=f.createRange();h.setStart(s.firstChild??s,0),h.collapse(!0),m.removeAllRanges(),m.addRange(h)}function d(i){let u=e.getInstance(i);if(!u){t();return}let b=p(oo(i,"data-row"),oo(i,"data-col")),s=e.getSelectionParagraph(u);e.withEdit(u,()=>{if(!s)return e.insertHtml(u,b);let f=s.nextElementSibling;f?e.insertHtmlBefore(u,f,b):e.appendToBody(u,b)}),t(),l(i),n(u,s)}return{getQuickTable:c,quickTableOver:r,hideQuickTable:t,quickTableClick:d}}};function Qo(o,e,t,r,a){let c=o.adaptador;if(c.versao===5){let p=mo(e,t);return p&&Eo(o,p)?(c.recusarEscrita(),!1):t.id?!0:!!o.win.SeiProGhs?.setAtributos(t,{id:r},e)}if(c.somenteLeitura(e))return c.recusarEscrita(),!1;if(a)for(let p of t.querySelectorAll(`a.${a}`))p.remove();let l=t.ownerDocument.createElement("a");return l.setAttribute("name",r),a&&(l.className=a),t.prepend(l),!0}function Oo(o,e,t=!1){if(t&&o.id)return o.id;let r=o.querySelector(`a[name^="${e}"]`);return r?r.getAttribute("name"):o.id?.startsWith(e)?o.id:null}var Va=[1,2,3,4],be=["Paragrafo_Numerado_Nivel","Item_Nivel"];function rr(o){let e=be.map(()=>[0,0,0,0]);return o.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of e)r.fill(0);return{item:""}}for(let r=0;r<be.length;r+=1)for(let a of Va){if(t!==`${be[r]}${a}`)continue;let c=e[r];c[a-1]=(c[a-1]??0)+1;for(let l=a;l<4;l+=1)c[l]=0;return{item:c.slice(0,a).join(".")}}return{item:""}})}var ko="RefPro_",Ga="refpro",ar=(o,e,t)=>`[${e||o.trim()===""?"":`${o.trim()} `}${t}]`,nr={id:"ref-interna",globais(o){let e=o.adaptador,t=i=>D(o.doc,i);function r(i){let u=i??e.getInstance();if(!u)return!1;let b=e.findInBody(u,"p");if(!b.length)return!1;let s=rr(b.map(m=>({classe:(m.getAttribute("class")??"").trim()}))),f=[];return b.forEach((m,h)=>{let y=s[h]?.item;if(!y)return;let x=Oo(m,ko,e.versao===5),k=x?.startsWith(ko)?x.slice(ko.length):x??po(16);f.push({ref:k,nome:x??`${ko}${k}`,item:y,text:m.textContent??"",ancorado:!!x,el:m})}),f}function a(i,u){let b=new Set(u.filter(s=>s.ancorado&&!s.nome.startsWith(ko)).map(s=>s.nome));return e.findInBody(i,'a[href^="#"]').filter(s=>(s.getAttribute("href")??"").startsWith(`#${ko}`)||b.has((s.getAttribute("href")??"").slice(1))&&/^\[[^\]]*\d[^\]]*\]$/.test((s.textContent??"").trim()))}function c(i,u,b){let s=r(i),f=[];if(!s)return{mudar:f,perdidas:0};let m=a(i,s);if(!m.length)return{mudar:f,perdidas:0};let h=new Map(s.filter(x=>x.ancorado).map(x=>[x.nome,x.item])),y=0;for(let x of m){let k=h.get((x.getAttribute("href")??"").slice(1));if(k===void 0){y+=1;continue}let v=ar(u,b,k);(x.textContent??"")!==v&&f.push({a:x,texto:v})}return{mudar:f,perdidas:y}}function l(i,u,b){let{mudar:s,perdidas:f}=c(i,u,b),m=0;return s.length&&e.withEdit(i,()=>m=ce(o,s)),{atualizadas:m,perdidas:f,recusadas:s.length-m}}function p(i,u,b){let s,f,m;typeof i=="string"||i===void 0?(s=e.getInstance(),f=i??"",m=u===!0):(s=i,f=typeof u=="string"?u:"",m=b===!0),s&&l(s,f,m)}function n(i){let u=e.getInstance(i);if(!u)return;let b=r(u);if(!b||b.length===0){t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");return}let s=g("input",{type:"text",id:"prefixo",placeholder:"ex.: item, par\xE1grafo, art.",autocomplete:"off"}),f=g("input",{type:"checkbox",id:"hidePrefix"}),m=g("label",{class:"spro-caixa"},f,g("span",{},"N\xE3o utilizar prefixo")),h=g("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(8,Math.max(4,b.length)))},...b.map(k=>{let v=k.text.trim(),E=v.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return g("option",{value:`${k.ref}-${k.item}`},`${k.item}. ${E}${E.length<v.length?"...":""}`)})),y=()=>f.matches(":checked")||s.value.trim()==="",x=H(o.doc,{titulo:"Inserir refer\xEAncia interna",largura:640,conteudo:z(P("Prefixo",{para:"prefixo"},s,m),P("Par\xE1grafos numerados",{para:"selectRef",dica:"Selecione um ou mais (Ctrl ou Shift para v\xE1rios)."},h),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:k,recusadas:v}=l(u,s.value,y());no(o),!v&&t(k?`Refer\xEAncias atualizadas. ${k} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let k=b.filter(v=>[...h.querySelectorAll("option")].some(E=>E.value===`${v.ref}-${v.item}`&&E.selected));if(!k.length){t("Selecione ao menos um par\xE1grafo numerado.");return}d(u,k,s.value,y())&&x.fechar()}},"Inserir")))})}function d(i,u,b,s){if(e.somenteLeitura(i))return e.recusarEscrita(),!1;let f=u.filter(x=>x.el.isConnected);if(!f.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let m=f.map(x=>`<a href="#${N(x.nome)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${N(ar(b,s,x.item))}</a>`),h=m.length>1?`${m.slice(0,-1).join(", ")} e ${m.at(-1)}`:m[0]??"",y=!1;return e.withEdit(i,()=>{let{mudar:x}=c(i,b,s);x.length&&ce(o,x);for(let k of f)if(!k.ancorado&&!Qo(o,i,k.el,k.nome,Ga))return;e.insertHtml(i,` ${h} `),y=!0}),no(o),y}return{getRefInterna:n,updateRefsInternas:p,getNiveisParagrafos:r,clickScroolToRef:()=>no(o)}},iniciar(o){no(o)}};var Ua='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Wa="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",ir={id:"session-break",globais:o=>({getSessionBreak:e=>zo(o,e,Ua,(t,r)=>{if(o.adaptador.versao!==5)return;let a=t,c=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,l=mo(a,r)?.previousSibling;c&&l?.name==="paragraph"&&c.setModelHtmlStyles("p",{"counter-reset":Wa},l)})})};var sr=["seiSlim","seiSlim_parent","seiSlim_view"],jo="seiSlim_editor";function lr(o,e){for(let t of o.doc.querySelectorAll(".getNewStyleButton"))t.classList.toggle("cke_button_on",e),t.classList.toggle("cke_button_off",!e)}function dr(o,e){if(e){for(let t of o.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))t.remove();o.win.insertFontIcon?.("head"),o.doc.body.classList.add(...sr),(o.win.localStorage?.getItem("darkModePro")||o.doc.documentElement.getAttribute("data-spro-tema")==="escuro")&&o.doc.body.classList.add("dark-mode")}else o.doc.body.classList.remove(...sr),o.win.localStorage?.getItem("seiSlim")||o.doc.body.classList.remove("dark-mode")}var cr={id:"style-editor",iniciar(o){o.win.addEventListener("storage",e=>{let t=e;if(t.key!==jo)return;let r=!!t.newValue;lr(o,r),dr(o,r)})},globais(o){function e(t){t==="set"?o.win.localStorage.setItem(jo,"true"):o.win.localStorage.removeItem(jo),dr(o,t==="set")}return{getBoxStyleEditor(t){let r=!o.win.localStorage.getItem(jo);lr(o,r),e(r?"set":"remove")},updateStyleEditor:e}}};var Ja="seipro-bookmark",pr="bookmark-",Ka=o=>o.replace(/^\./,""),ur={id:"sumario",globais(o){let e=o.adaptador,t=n=>D(o.doc,n);function r(n){let d=new Set;for(let i of e.findInBody(n,"p")){let u=(i.getAttribute("class")??"").trim().split(/\s+/)[0];u&&d.add(u)}return[...d]}function a(n,d,i){let u=n.map(b=>g("option",{value:`.${b}`,...b===i?{selected:"selected"}:{}},b));return d?[g("option",{value:""},"(nenhum)"),...u]:u}function c(n,d,i){let u=o.doc.querySelector(`select#${d}`);u&&u.replaceChildren(...i.map(([b,s])=>g("option",{value:s},b)))}function l(n,d,i){let u=i??e.getInstance();if(!u)return!1;let b=new Set(d.map(Ka).filter(Boolean));if(!b.size)return!1;if(e.somenteLeitura(u))return e.recusarEscrita(),!1;let s=e.findInBody(u,"p").filter(h=>(h.textContent??"").trim()!==""&&[...h.classList].some(y=>b.has(y)));if(!s.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let f='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>',m=0;return e.withEdit(u,()=>{for(let y of s){let x=Oo(y,pr,e.versao===5)??`${pr}${po(16)}`;Qo(o,u,y,x,Ja)&&(f+=`<p class="Texto_Alinhado_Esquerda"><a href="#${N(x)}">${N((y.textContent??"").trim())}</a></p>`,m+=1)}if(!m)return;let h=e.versao===5?e.getSelectionParagraph(u):null;h?e.insertHtmlBefore(u,h,f):e.insertHtml(u,f)}),m?!0:(t("N\xE3o foi poss\xEDvel criar o sum\xE1rio: nenhum t\xEDtulo aceitou a \xE2ncora."),!1)}function p(n,d){let i=d??e.getInstance();if(!i)return;let u=r(i);if(!u.length){t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");return}let b=(y,x,k)=>g("select",{id:y},...a(u,x,k)),s=b("listStyle1",!1,"Item_Nivel1"),f=b("listStyle2",!0,"Item_Nivel2"),m=b("listStyle3",!0,"Item_Nivel3"),h=H(o.doc,{titulo:"Inserir sum\xE1rio",conteudo:uo(Z("Estilo do T\xEDtulo 1",s,{dica:"Obrigat\xF3rio. Cada par\xE1grafo com este estilo vira um item do sum\xE1rio."}),Z("Estilo do T\xEDtulo 2",f,{opcional:!0}),Z("Estilo do T\xEDtulo 3",m,{opcional:!0}),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let y=[s.value,f.value,m.value].filter(x=>x!=="");if(!y.length){t("Escolha o estilo do T\xEDtulo 1.");return}l(null,[...new Set(y)],i)&&h.fechar()}},"Inserir")))});s.focus({preventScroll:!0})}return{getSumarioDocumento(n){let d=e.getInstance(n);d&&p(null,d)},getListStylesDocumento(n,d){let i=d??e.getInstance();return i?a(r(i),!1):[]},updateSelectDialog:(n,d)=>c(null,n,d),getDialogSumarioDocumento:n=>p(null,n),getDialogSumarioDocumento_:()=>p(null),insertSumarioDocumento:(n,d)=>l(null,n,d)}}};var wo={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function he(o,e=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${o.dark};margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${o.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${o.dark};margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:`background-color: ${o.light};`,tr:["",`background-color: ${o.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${e}%; border-left: none;border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${e}%;border: none;`,trCabecalho:`border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${o.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${e}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${e}%; border: none;`,trCabecalho:`border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${o.light};`,td:"",tdPrimeira:`background-color: ${o.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${o.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${o.dark}; margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:`border-bottom: 3px solid ${o.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${o.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${e}%;`,trCabecalho:`border-bottom: 3px solid ${o.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${o.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${e}%; border: none;`,trCabecalho:`border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${o.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${o.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${o.dark}; margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${o.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${e}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${o.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${o.dark};`,td:`background-color: ${o.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${o.dark}; border: 1px solid ${o.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${o.dark}; margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:`background-color: ${o.light}; border-bottom: 3px solid ${o.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${e}%; border: none;`,trCabecalho:`background-color: ${o.light}; border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${o.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${o.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${e}%;border: none;`,trCabecalho:`background-color: ${o.light}; border-bottom: 1px solid ${o.dark};`,tr:["border: none;",`border: none; background-color: ${o.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${e}%;border-left: none; border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:`border-bottom: 1px solid ${o.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${o.dark}; margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${o.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${o.dark};margin-left:auto; margin-right:auto;width:${e}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${o.light};`],tdCabecalho:`background-color: ${o.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${e}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${o.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${o.light};`,`color: #fff; border: none; background-color: ${o.dark};`],tdCabecalho:`background-color: ${o.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${e}%; border-left: none;border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark}; border-right: none;`,trCabecalho:`background-color: ${o.light}; border-bottom: 1px solid ${o.dark};`,tr:["border: none;",`border: none; background-color: ${o.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${e}%;border: none;`,trCabecalho:`background-color: ${o.light}; border-top: 1px solid ${o.dark}; border-bottom: 1px solid ${o.dark};`,tr:["border: none;",`border: none; background-color: ${o.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${o.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${o.dark};margin-left:auto; margin-right:auto; width:${e}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function Bo(o){let e={};for(let t of o.split(";")){let r=t.indexOf(":");if(r<=0)continue;let a=t.slice(0,r).trim(),c=t.slice(r+1).trim();a&&c&&(e[a]=c)}return e}function Xa(o,e,t){let r=[];for(let a=0;a<e;a+=1){let c=a===0,l=c?o.trCabecalho:Array.isArray(o.tr)?a%2===0?o.tr[1]:o.tr[0]:o.tr,p=Array.from({length:t},(n,d)=>({td:c?o.tdCabecalho:d===0?o.tdPrimeira:o.td,p:c?o.pCabecalho:o.p}));r.push({tr:l,celulas:p})}return{linhas:r}}var ve=o=>Array.from(o.children).filter(e=>e.tagName==="TD"||e.tagName==="TH"),Ya=o=>Array.from(o.querySelectorAll("tr")).filter(e=>e.closest("table")===o);function mr(o,e,t,r,a){let c=o.adaptador,l=Ya(t),p=Xa(r,l.length,Math.max(0,...l.map(n=>ve(n).length)));if(c.versao===5){let n=e,d=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,i=mo(n,t.closest("figure")??t);if(!d||!i)return D(o.doc,"N\xE3o foi poss\xEDvel aplicar o estilo: a tabela n\xE3o foi reconhecida pelo editor."),!1;if(Eo(o,i))return c.recusarEscrita(),!1;let u=(b,s,f)=>{let m=Object.keys(Bo(s.getAttribute("style")??""));m.length&&f&&typeof d.removeModelHtmlStyles=="function"&&d.removeModelHtmlStyles(b,m,f)};return c.withEdit(e,()=>{u("table",t,i),d.setModelHtmlStyles("table",Bo(r.table),i),l.forEach((b,s)=>{let f=p.linhas[s];if(!f)return;let m=mo(n,b);u("tr",b,m),m&&d.setModelHtmlStyles("tr",Bo(f.tr),m),ve(b).forEach((h,y)=>{let x=mo(n,h);if(x){u("td",h,x),d.setModelHtmlStyles("td",Bo(f.celulas[y]?.td??""),x);for(let k of x.getChildren())k.name==="paragraph"&&n.model.change(v=>v.setAttribute("estilo",f.celulas[y]?.p,k))}})}),r.cabecalho&&n.model.change(b=>b.setAttribute("headingRows",1,i))}),!0}return c.somenteLeitura(e)?(c.recusarEscrita(),!1):(c.withEdit(e,()=>{let n=t.ownerDocument;if(t.setAttribute("style",r.table),l.forEach((d,i)=>{let u=p.linhas[i];u&&(d.setAttribute("style",u.tr),ve(d).forEach((b,s)=>{b.setAttribute("style",u.celulas[s]?.td??"");let f=u.celulas[s]?.p??"",m=Array.from(b.querySelectorAll("p")).filter(h=>h.closest("td, th")===b);if(m.length)for(let h of m)h.setAttribute("class",f);else{let h=n.createElement("p");h.setAttribute("class",f),h.append(...Array.from(b.childNodes)),b.append(h)}}))}),r.cabecalho&&l[0]&&!t.querySelector("thead")){let d=n.createElement("thead");d.append(l[0]),t.prepend(d)}a?.aoFinalCk4?.(t)}),!0)}var gr="color1",Za="Clique na tabela que deseja aplicar o estilo!",xe="dark-mode-color-";function on(o){let e=Number.parseInt(o.slice(1,7),16);return Math.round(((e>>16&255)*299+(e>>8&255)*587+(e&255)*114)/1e3)}function en(o){for(let e of o.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(e.getAttribute("style")??"")?.[1];t&&(e.classList.remove(`${xe}black`,`${xe}white`),e.classList.add(`${xe}${on(t)>125?"black":"white"}`))}}var fr={id:"table-styles",globais(o){let e=o.adaptador,t=n=>e.getSelectionElement(n)?.closest("table")??null;function r(n,d){let i=n.querySelector("#addEstiloTabela");i&&d&&/^color\d+$/.test(d)&&(i.className=`spro-opcoes grade ${d}`)}function a(n,d,i,u=!0,b){let s=i??e.getInstance();if(!s||!d)return;let[f,m,h]=d,y=wo[m],x=Number(h),k=y&&Number.isFinite(x)?he(y,x)[f]:void 0,v=b?.isConnected?b:b?null:t(s);if(k){if(!v){D(o.doc,"A tabela n\xE3o est\xE1 mais no documento.");return}mr(o,s,v,{...k,cabecalho:u},{aoFinalCk4:en})}}function c(){let n=Object.keys(wo),d=Object.keys(he(wo[gr])),i=g("div",{id:"selectColorTabela",class:"spro-opcoes",role:"radiogroup","aria-label":"Cor da tabela"},...n.map((s,f)=>g("label",{class:"spro-opcao",for:`colorStyle${f+1}`,title:`Varia\xE7\xE3o ${f+1}`},g("input",{type:"radio",name:"colorStyle","data-colorid":s,id:`colorStyle${f+1}`,value:`colorStyle${f+1}`,...f===0?{checked:"checked"}:{}}),g("span",{class:"spro-amostra"},g("span",{style:`background-color: ${wo[s]?.light}`}),g("span",{style:`background-color: ${wo[s]?.dark}`}))))),u=g("div",{id:"addEstiloTabela",class:`spro-opcoes grade ${gr}`,role:"radiogroup","aria-label":"Estilo da tabela"},...d.map((s,f)=>{let m=f+1;return g("label",{class:"spro-opcao",for:`tableStyle${m}`,title:`Estilo ${m}`},g("input",{type:"radio",name:"tableStyle",id:`tableStyle${m}`,value:`tableStyle${m}`,...f===0?{checked:"checked"}:{}}),g("a",{class:"iconSelectStyleTable",style:`background-position-y: -${m*43}px`}))})),b=g("input",{type:"number",id:"addEstiloTableWidth",max:"100",step:"5",min:"5"});return z(P("Cor",{},i),P("Estilo",{},u),V("duas",P("Largura da tabela",{para:"addEstiloTableWidth"},Yo(b,"%")),P("Cabe\xE7alho",{},ro({id:"addEstiloTableHeader",checked:"checked"},"Primeira linha como cabe\xE7alho"))))}function l(n){try{let d=u=>Number.parseFloat(u?o.win.getComputedStyle(u).width:""),i=Math.round(100*d(n)/d(n?.parentElement??null));return Number.isFinite(i)?Math.min(100,Math.max(5,i)):80}catch{return 80}}function p(n,d){let i=d??e.getInstance();if(!i)return;let u=t(i),b=c(),s=b.querySelector("#addEstiloTableWidth");s&&(s.value=String(l(u)));for(let m of b.querySelectorAll('input[name="colorStyle"]'))m.addEventListener("change",()=>r(b,m.getAttribute("data-colorid")));let f=H(o.doc,{titulo:"Inserir estilo \xE0 tabela",largura:660,conteudo:g("div",{class:"spro-form"},b,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let m=b.querySelector('input[name="tableStyle"]:checked')?.value,h=b.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),y=b.querySelector("#addEstiloTableWidth")?.value,x=b.querySelector("#addEstiloTableHeader:checked")!==null;!m||!h||!y||(a(null,[m,h,y],i,x,u),f.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(n){let d=e.getInstance(n);d&&(t(d)?p(null,d):D(o.doc,Za))},changeColorTable(n){r(o.doc,n?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:c,openDialogSyleTable:n=>p(null,n),getSyleTable(n){let d=e.getInstance(n);d&&e.withEdit(d,()=>{})},setSyleTable:(n,d)=>a(null,n,d)}}};var br=/^[0-9A-Za-z-]+$/,tn="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",rn=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,hr={id:"tiny-url",globais(o){let e=l=>D(o.doc,l),t=l=>(o.fetch??o.win.fetch.bind(o.win))(l);async function r(l,p,n,d){let i=new URLSearchParams({url:l});p!==""&&i.set("alias",p);let u;try{u=await t(`https://tinyurl.com/api-create.php?${i}`)}catch{return e("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(u.status===400)return e("Erro: Nenhuma link gerado"),!1;if(u.status===422)return e("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let b=(await u.text()).trim();if(u.status!==200||!rn.test(b))return e("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return o.win.setInputTinyUrl?.(b),!0;let s=d??o.adaptador.getInstance();if(!s)return!1;let f=`<a href="${N(b)}" class="ancoraSei" target="_blank">${N(b)}</a>`;return o.adaptador.withEdit(s,()=>o.adaptador.insertHtml(s,f)),!0}function a(l){let p=o.adaptador.getInstance(l);if(!p)return;let n=g("input",{type:"text",id:"urlTiny",placeholder:"https://exemplo.gov.br/endereco-muito-longo",autocomplete:"off"}),d=g("input",{type:"text",id:"aliasTiny",placeholder:"ex.: relatorio-2026",autocomplete:"off"}),i=g("p",{id:"tinyResult",class:"spro-dica"}),u=String(o.win.getSelection?.()??"").trim();u!==""&&J(u)&&(n.value=u),d.addEventListener("input",()=>{i.replaceChildren();let s=d.value;s!==""&&(br.test(s)?i.append(`Resultado: https://tinyurl.com/${s}`):i.append(g("span",{class:"spro-erro"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let b=H(o.doc,{titulo:"Gerar link curto do TinyURL",conteudo:uo(Z("Link que deseja encurtar",n),Z("Nome personalizado",d,{opcional:!0,dica:"Letras, n\xFAmeros e travess\xF5es, com 5 caracteres ou mais."}),i,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let s=n.value.trim(),f=d.value.trim();if(s===""||!J(s))return e("Digite um link v\xE1lido!");if(f!==""&&!br.test(f))return e(tn);if(f!==""&&f.length<5)return e("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(s,f,"insert",p)&&b.fechar()}},"Inserir")))})}return{getTinyUrl:a,ajaxTinyUrl:(l,p,n)=>r(l,p,n)}}};var ye=[pt,Wt,ir,Ue,Ve,Ne,it,cr,tr,nt,hr,xt,Ye,Mt,fr,ur,et,bt,Ke,ut,Kt,nr,Ut,Yt,At];function vr(o,e,t){let r=o,a=[],c=[];for(let l of e){let p=!0;try{for(let[n,d]of Object.entries(l.globais(t))){if(r[n]!==void 0){p=!1,c.push({id:l.id,erro:new Error(`global ja definido: ${n}`)});continue}r[n]=d}}catch(n){p=!1,c.push({id:l.id,erro:n})}p&&a.push(l.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:l.id})}catch{}}return{instalados:a,falhas:c}}function xr(o,e){let t=[];for(let r of o)try{r.iniciar?.(e)}catch(a){t.push({id:r.id,erro:a})}return t}var yr=`/*
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
  text-align: left;
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
`;var Er=`/*
 * Kit de formul\xE1rio dos di\xE1logos do SEI Pro (editor e demais m\xF3dulos): grupo com r\xF3tulo e dica, grade responsiva,
 * seletor, controle deslizante, caixa, cor, bot\xE3o de texto, painel recolh\xEDvel, pr\xE9via e abas.
 *
 * Tudo usa os tokens do base.css (claro/escuro v\xEAm de l\xE1) e fica sob \`dialog.spro-dialogo\`, para vencer o CSS da
 * p\xE1gina do SEI e do CKEditor, que estiliza \`label\`, \`select\`, \`input\` e \`a\` de forma gen\xE9rica.
 */

/* ---------- Estrutura ---------- */
dialog.spro-dialogo .spro-form {
  display: grid;
  gap: 16px;
  min-width: 0;
}
dialog.spro-dialogo .spro-grupo {
  display: grid;
  gap: 6px;
  min-width: 0;
  align-content: start;
}
dialog.spro-dialogo .spro-rotulo {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin: 0;
  padding: 0;
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.3;
  color: var(--spro-texto);
}
dialog.spro-dialogo .spro-rotulo .spro-opcional {
  font-weight: 400;
  color: var(--spro-fraco);
}
dialog.spro-dialogo .spro-valor {
  flex: none;
  padding: 1px 8px;
  font-size: 11.5px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
dialog.spro-dialogo .spro-dica {
  margin: 0;
  font-size: 12px;
  line-height: 1.45;
  color: var(--spro-suave);
}
dialog.spro-dialogo .spro-dica a,
dialog.spro-dialogo a.spro-link {
  color: var(--spro-destaque);
  text-decoration: underline;
  text-underline-offset: 2px;
  cursor: pointer;
}
dialog.spro-dialogo .spro-dica a:hover,
dialog.spro-dialogo a.spro-link:hover {
  text-decoration-thickness: 2px;
}
dialog.spro-dialogo .spro-erro {
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-perigo);
}
dialog.spro-dialogo .spro-grade {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 14px 16px;
  min-width: 0;
}
dialog.spro-dialogo .spro-grade.duas {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
dialog.spro-dialogo .spro-grade.tres {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}
dialog.spro-dialogo .spro-grade > .spro-largo {
  grid-column: 1 / -1;
}
@media (max-width: 540px) {
  dialog.spro-dialogo .spro-grade.duas,
  dialog.spro-dialogo .spro-grade.tres {
    grid-template-columns: minmax(0, 1fr);
  }
}

/* ---------- Campos ---------- */
/* A p\xE1gina do SEI e o CKEditor estilizam input/select/textarea de forma gen\xE9rica (margens, preenchimento, fonte):
   o reset abaixo vale s\xF3 dentro do di\xE1logo e tem especificidade para venc\xEA-los. */
dialog.spro-dialogo :is(input, select, textarea).spro-campo {
  box-sizing: border-box;
  max-width: 100%;
  margin: 0 !important;
  padding: 6px 11px;
  font: inherit;
  font-size: 13px;
  line-height: 1.4;
  color: var(--spro-texto) !important;
  background-color: var(--spro-fundo) !important;
  background-image: none;
  border: 1px solid var(--spro-borda-forte) !important;
  border-radius: var(--spro-raio) !important;
  box-shadow: none;
}
dialog.spro-dialogo :is(input, select, textarea).spro-campo:hover {
  border-color: color-mix(in srgb, var(--spro-borda-forte) 70%, var(--spro-texto)) !important;
}
dialog.spro-dialogo :is(input, select, textarea).spro-campo:focus,
dialog.spro-dialogo :is(input, select, textarea).spro-campo:focus-visible {
  border-color: var(--spro-destaque) !important;
  box-shadow: var(--spro-anel);
}
dialog.spro-dialogo textarea.spro-campo {
  padding: 8px 11px;
  line-height: 1.5;
}
dialog.spro-dialogo .spro-grupo > .spro-campo,
dialog.spro-dialogo .spro-grupo > .spro-seletor,
dialog.spro-dialogo textarea.spro-campo,
dialog.spro-dialogo input.spro-campo {
  width: 100%;
}
dialog.spro-dialogo input.spro-campo,
dialog.spro-dialogo select.spro-campo {
  min-height: 34px;
}
dialog.spro-dialogo textarea.spro-campo {
  min-height: 84px;
}
dialog.spro-dialogo input[type="number"].spro-campo {
  font-variant-numeric: tabular-nums;
}
dialog.spro-dialogo .spro-campo:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
dialog.spro-dialogo input[type="file"].spro-campo {
  padding: 3px;
  color: var(--spro-suave);
}
dialog.spro-dialogo input[type="file"].spro-campo::file-selector-button {
  margin-right: 10px;
  padding: 4px 11px;
  font: inherit;
  font-weight: 500;
  color: var(--spro-texto);
  background: var(--spro-fundo-3);
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
dialog.spro-dialogo input[type="file"].spro-campo::file-selector-button:hover {
  background: var(--spro-borda-forte);
}

/* ---------- Seletor (select) ---------- */
dialog.spro-dialogo .spro-seletor {
  position: relative;
  display: block;
  min-width: 0;
}
dialog.spro-dialogo .spro-seletor > select.spro-campo {
  width: 100%;
  margin: 0 !important;
  padding-right: 34px;
  appearance: none;
  -webkit-appearance: none;
  text-overflow: ellipsis;
  cursor: pointer;
}
dialog.spro-dialogo .spro-seletor::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 12px;
  width: 12px;
  height: 12px;
  margin-top: -6px;
  background: var(--spro-suave);
  pointer-events: none;
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5.5 9.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E") center / contain no-repeat;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M5.5 9.5l6.5 6.5 6.5-6.5'/%3E%3C/svg%3E") center / contain no-repeat;
}
dialog.spro-dialogo .spro-seletor:hover::after {
  background: var(--spro-texto);
}
dialog.spro-dialogo select[multiple].spro-campo {
  width: 100%;
  height: auto !important;
  min-height: 132px;
  padding: 4px;
  cursor: default;
}
dialog.spro-dialogo select[multiple].spro-campo option {
  padding: 6px 8px;
  border-radius: var(--spro-raio-p);
}
dialog.spro-dialogo select[multiple].spro-campo option:checked {
  color: var(--spro-texto);
  background: var(--spro-destaque-medio) linear-gradient(0deg, var(--spro-destaque-medio), var(--spro-destaque-medio));
}

/* ---------- Controle deslizante ---------- */
dialog.spro-dialogo input.spro-intervalo {
  --p: 50%;
  box-sizing: border-box;
  width: 100%;
  height: 22px;
  min-height: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0 !important;
  border-radius: 0 !important;
  box-shadow: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}
dialog.spro-dialogo input.spro-intervalo:focus,
dialog.spro-dialogo input.spro-intervalo:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}
dialog.spro-dialogo input.spro-intervalo::-webkit-slider-runnable-track {
  height: 6px;
  background: linear-gradient(to right, var(--spro-destaque) var(--p), var(--spro-fundo-3) var(--p));
  border-radius: 999px;
}
dialog.spro-dialogo input.spro-intervalo::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  margin-top: -5px;
  background: var(--spro-fundo);
  border: 2px solid var(--spro-destaque);
  border-radius: 50%;
  box-shadow: var(--spro-sombra-1);
  transition: box-shadow var(--spro-dur);
}
dialog.spro-dialogo input.spro-intervalo:hover::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px var(--spro-destaque-suave);
}
dialog.spro-dialogo input.spro-intervalo:focus-visible::-webkit-slider-thumb {
  box-shadow: var(--spro-anel);
}
dialog.spro-dialogo input.spro-intervalo::-moz-range-track {
  height: 6px;
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
dialog.spro-dialogo input.spro-intervalo::-moz-range-progress {
  height: 6px;
  background: var(--spro-destaque);
  border-radius: 999px;
}
dialog.spro-dialogo input.spro-intervalo::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: var(--spro-fundo);
  border: 2px solid var(--spro-destaque);
  border-radius: 50%;
}

/* ---------- Caixa de marca\xE7\xE3o e op\xE7\xE3o ---------- */
dialog.spro-dialogo label.spro-caixa {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.35;
  color: var(--spro-texto);
  cursor: pointer;
}
dialog.spro-dialogo .spro-caixa > input[type="checkbox"],
dialog.spro-dialogo .spro-caixa > input[type="radio"] {
  display: grid;
  flex: none;
  place-content: center;
  width: 17px;
  height: 17px;
  margin: 0;
  background: var(--spro-fundo) !important;
  border: 1.5px solid var(--spro-borda-forte) !important;
  border-radius: 5px !important;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  transition:
    background var(--spro-dur),
    border-color var(--spro-dur),
    box-shadow var(--spro-dur);
}
dialog.spro-dialogo .spro-caixa > input[type="radio"] {
  border-radius: 50% !important;
}
dialog.spro-dialogo .spro-caixa > input:hover {
  border-color: var(--spro-destaque) !important;
}
dialog.spro-dialogo .spro-caixa > input:checked {
  background: var(--spro-destaque) !important;
  border-color: var(--spro-destaque) !important;
}
dialog.spro-dialogo .spro-caixa > input[type="checkbox"]:checked::after {
  content: "";
  width: 9px;
  height: 5px;
  margin-top: -1px;
  border-bottom: 2px solid var(--spro-destaque-texto);
  border-left: 2px solid var(--spro-destaque-texto);
  transform: rotate(-45deg);
}
dialog.spro-dialogo .spro-caixa > input[type="radio"]:checked::after {
  content: "";
  width: 7px;
  height: 7px;
  background: var(--spro-destaque-texto);
  border-radius: 50%;
}
dialog.spro-dialogo .spro-caixa > input:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}

/* ---------- Cor ---------- */
dialog.spro-dialogo label.spro-cor {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  min-height: 34px;
  margin: 0;
  padding: 3px 12px 3px 4px;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  cursor: pointer;
  transition: border-color var(--spro-dur);
}
dialog.spro-dialogo label.spro-cor:hover {
  border-color: color-mix(in srgb, var(--spro-borda-forte) 70%, var(--spro-texto));
}
dialog.spro-dialogo label.spro-cor:focus-within {
  border-color: var(--spro-destaque);
  box-shadow: var(--spro-anel);
}
dialog.spro-dialogo .spro-cor > input[type="color"] {
  flex: none;
  width: 26px;
  height: 26px;
  padding: 0;
  background: none;
  border: 0 !important;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
}
dialog.spro-dialogo .spro-cor > input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
dialog.spro-dialogo .spro-cor > input[type="color"]::-webkit-color-swatch {
  border: 1px solid color-mix(in srgb, var(--spro-texto) 24%, transparent);
  border-radius: 6px;
}
dialog.spro-dialogo .spro-cor > input[type="color"]::-moz-color-swatch {
  border: 1px solid color-mix(in srgb, var(--spro-texto) 24%, transparent);
  border-radius: 6px;
}
dialog.spro-dialogo .spro-cor-hex {
  font-family: var(--spro-mono);
  font-size: 12px;
  text-transform: uppercase;
  color: var(--spro-suave);
}

/* ---------- Bot\xE3o de texto, painel recolh\xEDvel e pr\xE9via ---------- */
dialog.spro-dialogo .spro-botao-texto {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  padding: 3px 4px;
  font: inherit;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--spro-destaque);
  background: none;
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
dialog.spro-dialogo .spro-botao-texto:hover {
  background: var(--spro-destaque-suave);
}
dialog.spro-dialogo .spro-botao-texto:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
dialog.spro-dialogo .spro-botao-texto .spro-icone {
  transition: transform var(--spro-dur) var(--spro-curva);
}
dialog.spro-dialogo .spro-botao-texto[aria-expanded="true"] .spro-icone {
  transform: rotate(180deg);
}
dialog.spro-dialogo .spro-barra {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-width: 0;
}
dialog.spro-dialogo .spro-painel {
  display: grid;
  gap: 16px;
  padding: 14px 16px;
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
dialog.spro-dialogo .spro-previa {
  display: grid;
  place-items: center;
  box-sizing: border-box;
  min-height: 96px;
  padding: 16px;
  overflow: auto;
  text-align: center;
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
dialog.spro-dialogo .spro-previa:empty::before {
  content: attr(data-vazio);
  font-size: 12px;
  color: var(--spro-fraco);
}
dialog.spro-dialogo .spro-previa img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}
dialog.spro-dialogo .spro-previa.xadrez {
  background-color: var(--spro-fundo-2);
  background-image:
    linear-gradient(45deg, var(--spro-fundo-3) 25%, transparent 25%, transparent 75%, var(--spro-fundo-3) 75%),
    linear-gradient(45deg, var(--spro-fundo-3) 25%, transparent 25%, transparent 75%, var(--spro-fundo-3) 75%);
  background-position:
    0 0,
    8px 8px;
  background-size: 16px 16px;
}

/* ---------- Abas (no estilo do .spro-segmentado) ---------- */
dialog.spro-dialogo .spro-segmentado.largo {
  display: flex;
  width: 100%;
  box-sizing: border-box;
}
dialog.spro-dialogo .spro-segmentado.largo button {
  flex: 1;
  min-width: 0;
  padding: 0 8px;
  overflow: hidden;
  text-overflow: ellipsis;
}
dialog.spro-dialogo [role="tabpanel"] {
  display: grid;
  gap: 14px;
  min-width: 0;
  margin-top: 14px;
}
dialog.spro-dialogo [role="tabpanel"][hidden] {
  display: none;
}

/* Rodap\xE9 fixo: o bot\xE3o principal fica sempre \xE0 vista, mesmo com o corpo rolando */
dialog.spro-dialogo .spro-dialogo-rodape .spro-botao.primario {
  min-width: 96px;
  min-height: 34px;
}

/* ---------- Subt\xEDtulo de se\xE7\xE3o e aviso embutido ---------- */
dialog.spro-dialogo .spro-subtitulo {
  margin: 0;
  font-size: 11px;
  font-weight: 650;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--spro-fraco);
}
dialog.spro-dialogo .spro-painel > .spro-subtitulo:not(:first-child) {
  margin-top: 2px;
  padding-top: 14px;
  border-top: 1px solid var(--spro-borda);
}
dialog.spro-dialogo .spro-aviso-inline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 8px 12px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-texto);
  background: color-mix(in srgb, var(--spro-aviso) 12%, var(--spro-fundo));
  border: 1px solid color-mix(in srgb, var(--spro-aviso) 35%, var(--spro-fundo));
  border-radius: var(--spro-raio);
}
dialog.spro-dialogo .spro-aviso-inline .spro-botao-texto {
  flex: none;
  color: var(--spro-texto);
}

/* ---------- Pr\xE9via ao lado das op\xE7\xF5es (QR): com as op\xE7\xF5es abertas, a pr\xE9via fica fixa \xE0 esquerda ---------- */
dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] {
  grid-template-columns: 240px minmax(0, 1fr);
  align-items: start;
  column-gap: 18px;
}
dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-aviso-inline {
  grid-column: 1 / -1;
}
dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-previa {
  position: sticky;
  top: 0;
  grid-column: 1;
  grid-row: span 2;
}
dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-barra,
dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-painel {
  grid-column: 2;
}
@media (max-width: 640px) {
  dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] {
    grid-template-columns: minmax(0, 1fr);
  }
  dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-previa,
  dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-barra,
  dialog.spro-dialogo .spro-form.spro-lateral[data-aberto] > .spro-painel {
    position: static;
    grid-column: 1;
    grid-row: auto;
  }
}

/* ---------- Op\xE7\xF5es selecion\xE1veis (cart\xF5es e amostras com radio escondido) ---------- */
dialog.spro-dialogo .spro-opcoes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  min-width: 0;
}
dialog.spro-dialogo .spro-opcoes.grade {
  display: grid;
  grid-template-columns: repeat(var(--colunas, 7), minmax(0, 1fr));
}
@media (max-width: 720px) {
  dialog.spro-dialogo .spro-opcoes.grade {
    grid-template-columns: repeat(auto-fill, minmax(78px, 1fr));
  }
}
dialog.spro-dialogo label.spro-opcao {
  position: relative;
  display: grid;
  place-items: center;
  box-sizing: border-box;
  margin: 0;
  padding: 6px;
  background: var(--spro-fundo);
  border: 2px solid var(--spro-borda);
  border-radius: var(--spro-raio);
  cursor: pointer;
  transition:
    border-color var(--spro-dur),
    background var(--spro-dur),
    box-shadow var(--spro-dur);
}
dialog.spro-dialogo label.spro-opcao > input[type="radio"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  opacity: 0;
  cursor: pointer;
}
dialog.spro-dialogo label.spro-opcao:hover {
  border-color: var(--spro-borda-forte);
}
dialog.spro-dialogo label.spro-opcao:has(> input:checked) {
  background: var(--spro-destaque-suave);
  border-color: var(--spro-destaque);
}
dialog.spro-dialogo label.spro-opcao:has(> input:focus-visible) {
  box-shadow: var(--spro-anel);
}
dialog.spro-dialogo .spro-amostra {
  display: inline-flex;
  width: 36px;
  height: 22px;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--spro-texto) 16%, transparent);
  border-radius: 6px;
}
dialog.spro-dialogo .spro-amostra > span {
  flex: 1;
}

/* Campo com sufixo fixo ("80 %") */
dialog.spro-dialogo .spro-sufixo {
  position: relative;
  display: block;
}
dialog.spro-dialogo .spro-sufixo > input.spro-campo {
  padding-right: 34px;
}
dialog.spro-dialogo .spro-sufixo > span {
  position: absolute;
  top: 50%;
  right: 12px;
  font-size: 12.5px;
  color: var(--spro-suave);
  transform: translateY(-50%);
  pointer-events: none;
}

/* ---------- Pr\xE9via de texto e lista de resultados ---------- */
dialog.spro-dialogo .spro-previa.texto {
  place-items: start;
  min-height: 56px;
  font-size: 12.5px;
  line-height: 1.5;
  text-align: left;
  white-space: break-spaces;
  color: var(--spro-texto);
}
dialog.spro-dialogo .spro-resultados {
  max-height: 300px;
  overflow: auto;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  scrollbar-width: thin;
}
dialog.spro-dialogo .spro-resultado {
  display: grid;
  gap: 6px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--spro-borda);
}
dialog.spro-dialogo .spro-resultado:last-child {
  border-bottom: 0;
}
dialog.spro-dialogo .spro-resultado-topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
dialog.spro-dialogo .spro-resultado-titulo {
  min-width: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}
dialog.spro-dialogo .spro-resultado-apelido {
  font-weight: 400;
  color: var(--spro-suave);
}
dialog.spro-dialogo .spro-selo {
  margin-left: 8px;
  padding: 1px 8px;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
dialog.spro-dialogo .spro-ementa {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.5;
  color: var(--spro-suave);
  overflow-wrap: anywhere;
  white-space: break-spaces;
}
dialog.spro-dialogo .spro-resultado.revogada .spro-ementa,
dialog.spro-dialogo .spro-resultado.revogada .spro-resultado-titulo > a {
  text-decoration: line-through;
  opacity: 0.7;
}
dialog.spro-dialogo .spro-resultado-aviso {
  margin: 8px;
  justify-content: center;
}
dialog.spro-dialogo .spro-ementa .spro-botao-texto {
  padding: 0 4px;
  vertical-align: baseline;
}

/* ---------- Variantes de densidade e de barra ---------- */
dialog.spro-dialogo .spro-form.compacto {
  gap: 12px;
}
dialog.spro-dialogo .spro-form.compacto .spro-grade {
  gap: 12px 14px;
}
dialog.spro-dialogo .spro-barra.fim {
  justify-content: flex-end;
}

/* Pr\xE9via que mostra o resultado como ele entra no documento (equa\xE7\xE3o: PNG escuro e transparente): sempre sobre papel branco */
dialog.spro-dialogo .spro-previa.papel {
  background: #fff;
  border-color: var(--spro-borda);
}

/* O CSS escuro do estilo antigo inverte cores de checkbox/radio/color por \`filter\`: dentro do di\xE1logo as cores s\xE3o as do kit */
dialog.spro-dialogo :is(input, select, textarea, label.spro-opcao, label.spro-cor) {
  filter: none !important;
}

dialog.spro-dialogo .spro-prefixo > input.spro-campo {
  padding-right: 11px;
  padding-left: 28px;
}
dialog.spro-dialogo .spro-prefixo > span {
  right: auto;
  left: 12px;
}

/* ---------- Campos din\xE2micos (lista com a\xE7\xF5es) e refer\xEAncia de hashtags ---------- */
dialog.spro-dialogo .spro-lista-campos {
  display: grid;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  overflow: hidden;
}
dialog.spro-dialogo .spro-lista-campos:empty {
  padding: 16px;
  border-style: dashed;
}
dialog.spro-dialogo .spro-lista-campos:empty::before {
  content: attr(data-vazio);
  font-size: 12.5px;
  text-align: center;
  color: var(--spro-fraco);
}
dialog.spro-dialogo .spro-linha-campo {
  display: grid;
  grid-template-columns: minmax(90px, 30%) minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 12px;
  border-bottom: 1px solid var(--spro-borda);
}
dialog.spro-dialogo .spro-linha-campo:last-child {
  border-bottom: 0;
}
dialog.spro-dialogo .spro-hash {
  font-family: var(--spro-mono);
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-destaque);
  overflow-wrap: anywhere;
}
dialog.spro-dialogo .spro-linha-valor {
  min-width: 0;
  font-size: 12.5px;
  color: var(--spro-suave);
  overflow-wrap: anywhere;
}
dialog.spro-dialogo .spro-linha-acoes {
  display: flex;
  gap: 2px;
}
dialog.spro-dialogo .spro-referencia .spro-linha-campo {
  grid-template-columns: minmax(130px, 34%) minmax(0, 1fr);
  align-items: baseline;
  padding: 8px 12px;
}
dialog.spro-dialogo .spro-referencia .spro-linha-valor em {
  color: var(--spro-fraco);
}
dialog.spro-dialogo .spro-nota label,
dialog.spro-dialogo .spro-nota i {
  font-size: 12.5px;
  font-style: normal;
}
dialog.spro-dialogo .spro-nota label {
  display: block;
  margin: 0;
  line-height: 1.5;
  color: var(--spro-suave);
}

/* ---------- Lista de marca\xE7\xE3o com filtro (documentos do processo) ---------- */
dialog.spro-dialogo .spro-checklist {
  display: grid;
  align-content: start;
  max-height: 300px;
  overflow: auto;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  scrollbar-width: thin;
}
dialog.spro-dialogo .spro-checklist:empty {
  display: none;
}
dialog.spro-dialogo .spro-checklist > label.spro-caixa {
  display: flex;
  padding: 9px 12px;
  border-bottom: 1px solid var(--spro-borda);
}
dialog.spro-dialogo .spro-checklist > label.spro-caixa[hidden] {
  display: none;
}
dialog.spro-dialogo .spro-checklist > label.spro-caixa:last-child {
  border-bottom: 0;
}
dialog.spro-dialogo .spro-checklist > label.spro-caixa:hover {
  background: var(--spro-destaque-suave);
}

dialog.spro-dialogo .spro-dica:empty {
  display: none;
}

/* ---------- Campo e bot\xE3o na mesma linha ---------- */
dialog.spro-dialogo .spro-linha {
  display: flex;
  align-items: stretch;
  gap: 8px;
  min-width: 0;
}
dialog.spro-dialogo .spro-linha > .spro-campo,
dialog.spro-dialogo .spro-linha > .spro-seletor {
  flex: 1;
  min-width: 0;
}
dialog.spro-dialogo .spro-linha > .spro-botao {
  flex: none;
}

/* ---------- Item de lista de marca\xE7\xE3o com t\xEDtulo, etiqueta e trecho ---------- */
dialog.spro-dialogo .spro-item-corpo {
  display: grid;
  gap: 2px;
  min-width: 0;
}
dialog.spro-dialogo .spro-item-corpo > b {
  font-size: 13px;
  font-weight: 650;
  overflow-wrap: anywhere;
}
dialog.spro-dialogo .spro-item-corpo > small,
dialog.spro-dialogo .spro-trecho {
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-suave);
  overflow-wrap: anywhere;
}
dialog.spro-dialogo .spro-selo.aviso {
  margin-left: 0;
  color: var(--spro-aviso);
  background: color-mix(in srgb, var(--spro-aviso) 14%, var(--spro-fundo));
}

/* ---------- Cart\xF5es de revis\xE3o (o mesmo markup do bal\xE3o do editor), dentro do di\xE1logo ---------- */
dialog.spro-dialogo .reviewDisplayPro {
  position: static !important;
  inset: auto !important;
  display: block !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 12px 14px !important;
  font-size: 13px;
  line-height: 1.5;
  color: var(--spro-texto);
  white-space: normal;
  background: var(--spro-fundo) !important;
  border: 1px solid var(--spro-borda) !important;
  border-radius: var(--spro-raio-g) !important;
}
dialog.spro-dialogo #boxReviews {
  max-height: 420px;
  overflow: auto;
  scrollbar-width: thin;
}

/* ---------- Zona de soltar arquivos e pr\xE9via de v\xE1rias imagens ---------- */
dialog.spro-dialogo .spro-zona {
  display: grid;
  gap: 4px;
  place-items: center;
  padding: 22px 14px;
  font-size: 13px;
  text-align: center;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border: 1.5px dashed var(--spro-borda-forte);
  border-radius: var(--spro-raio-g);
  cursor: pointer;
  transition:
    border-color var(--spro-dur),
    background var(--spro-dur);
}
dialog.spro-dialogo .spro-zona:hover {
  background: var(--spro-destaque-suave);
  border-color: var(--spro-destaque);
}
dialog.spro-dialogo .spro-zona strong {
  color: var(--spro-texto);
}
dialog.spro-dialogo .spro-previa.lista {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
  justify-content: center;
}
dialog.spro-dialogo .spro-previa.lista:empty {
  display: grid;
}
dialog.spro-dialogo .spro-previa .previewImage {
  float: none;
  max-width: 220px;
  max-height: 110px;
  margin: 0;
  cursor: move;
  border: 1px solid var(--spro-borda);
}

/* ---------- Imagem de fundo: op\xE7\xF5es \xE0 esquerda, pr\xE9via da p\xE1gina \xE0 direita ---------- */
dialog.spro-dialogo .spro-lateral-imgbg {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 22px;
  align-items: start;
}
dialog.spro-dialogo .spro-lateral-imgbg > .spro-pagina-previa {
  position: sticky;
  top: 0;
}
dialog.spro-dialogo .spro-previa.papel {
  min-height: 0;
  overflow: auto;
}
@media (max-width: 860px) {
  dialog.spro-dialogo .spro-lateral-imgbg {
    grid-template-columns: minmax(0, 1fr);
  }
  dialog.spro-dialogo .spro-lateral-imgbg > .spro-pagina-previa {
    position: static;
  }
}
`;Wo(`${yr}
${Er}`);var sn=0,Ee=new Map;function ln(o){return o?Array.isArray(o)?o:Object.entries(o).map(([e,t])=>({text:e,click:()=>t.call(null)})):[]}function dn(o){for(let e of[...o.querySelectorAll("script")])e.remove();for(let e of[o,...o.querySelectorAll("*")])for(let t of[...e.attributes])/^on/i.test(t.name)&&e.removeAttribute(t.name)}function ke(o){ho(o);for(let e of o.querySelectorAll("input.spro-intervalo"))e.getAttribute("data-spro-ligado")||(e.setAttribute("data-spro-ligado","1"),e.addEventListener("input",()=>ho(e.parentElement??o)));for(let e of o.querySelectorAll(".spro-cor > input[type='color']"))if(!e.getAttribute("data-spro-ligado")){e.setAttribute("data-spro-ligado","1");for(let t of["input","change"])e.addEventListener(t,()=>ho(e.parentElement??o))}for(let e of o.querySelectorAll("[data-spro-abas]")){if(e.getAttribute("data-spro-ligado"))continue;e.setAttribute("data-spro-ligado","1");let t=[...e.querySelectorAll("[role='tab'][data-aba]")],r=[...e.querySelectorAll("[data-painel]")],a=l=>{for(let p of t){let n=p.getAttribute("data-aba")===l;p.setAttribute("aria-selected",String(n)),p.setAttribute("tabindex",n?"0":"-1")}for(let p of r)p.getAttribute("data-painel")===l?p.removeAttribute("hidden"):p.setAttribute("hidden","")};t.forEach((l,p)=>{l.addEventListener("click",()=>a(l.getAttribute("data-aba")??"")),l.addEventListener("keydown",n=>{let d=n.key,i=d==="ArrowRight"?1:d==="ArrowLeft"?-1:0,u=t[(p+i+t.length)%t.length];!i||!u||(n.preventDefault(),a(u.getAttribute("data-aba")??""),u.focus())})});let c=t.find(l=>l.getAttribute("aria-selected")==="true")??t[0];c&&a(c.getAttribute("data-aba")??"")}}function kr(o,e,t){let r=t.id??`seiProDialog_${++sn}`;Ee.get(r)?.fechar();let a=g("div",{id:r,class:"spro-form spro-legado"}),c=new o.DOMParser().parseFromString(`<!doctype html><html><body>${t.html??""}</body></html>`,"text/html");dn(c.body),a.append(...[...c.body.childNodes].map(s=>e.importNode(s,!0)));let l=o.jQuery??o.$,p=l?l(a):a,n=()=>b.fechar();p.dialog=s=>((s==="close"||s==="destroy")&&n(),p);let d=ln(t.buttons),i=d.length?g("div",{class:"spro-dialogo-rodape"},...d.map(s=>g("button",{type:"button",class:s.primary?"spro-botao primario":"spro-botao",onclick:()=>s.click?.call(a,p)},s.text??""))):null,u=typeof t.width=="number"?t.width:void 0,b=H(e,{titulo:t.title??"",...u?{largura:u}:{},conteudo:g("div",{},a,i),aoFechar:()=>{Ee.delete(r),t.onClose?.()}});return Ee.set(r,b),ke(a),t.onOpen?.(p),p}var wr="__seiProEditorTs",we=window;if(!we[wr]){we[wr]=!0,we.SeiProUi={abrirHtml:t=>kr(window,document,t),ligar:ke};let o=Te(window);o.aoRecusarEscrita(()=>D(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let e={adaptador:o,doc:document,win:window,base:document.currentScript?.getAttribute(Pe)??"",checkOpcao:t=>De(t),verifyOpcao:t=>Ie(t)};for(let t of vr(window,ye,e).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);o.waitReady(2e4).then(()=>{for(let t of xr(ye,e))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
