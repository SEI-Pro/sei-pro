/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function B(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,i=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(i.body.childNodes).map(s=>e.importNode(s,!0))}function F(e,o){if(!e||typeof o!="function")return;let t=e,i=t.__seiProCtxBuilders;if(!i){let s=[];i=t.__seiProCtxBuilders=s,e.addEventListener("contextmenu",l=>{let d=l;if(d.shiftKey)return;let f=[];for(let r of s)try{f=f.concat(r(d.target)||[])}catch{}f.length&&(d.preventDefault(),wo(e.ownerDocument,f,d.clientX,d.clientY))})}i.includes(o)||i.push(o)}function wo(e,o,t,i){e.getElementById("seiProCtxMenu")?.remove();let s=e.createElement("div");s.id="seiProCtxMenu",s.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",s.style.left=`${t}px`,s.style.top=`${i}px`;for(let d of o){let f=e.createElement("div");f.textContent=d.label,f.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",f.addEventListener("mouseenter",()=>{f.style.background="#eef"}),f.addEventListener("mouseleave",()=>{f.style.background=""}),f.addEventListener("click",()=>{s.remove(),d.action()}),s.append(f)}e.body.append(s);let l=()=>{s.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function ce(e,o,t){if(typeof t!="function")return;let i=e.__seiProCtx;if(!i){let s={acoes:{},construtores:[]};i=e.__seiProCtx=s;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let d=l?.$??null,f=null;for(let r of s.construtores){let c=[];try{c=r(d)||[]}catch{c=[]}for(let n of c){let p=`seiPro_${String(n.label).replace(/[^A-Za-z0-9]/g,"_")}`;s.acoes[p]=n.action,e.getCommand(p)||e.addCommand(p,{exec:()=>(s.acoes[p]?.(),!0)}),e.getMenuItem(p)||e.addMenuItem(p,{label:n.label,command:p,group:"seiProGroup"}),f=f??{},f[p]=o}}return f})}i.construtores.includes(t)||i.construtores.push(t)}var E=e=>e;function de(e,o={}){let t=()=>e.CKEDITOR,i=r=>!!r?.name&&t()?.instances[r.name]===r,s=r=>i(r)&&!r.readOnly,l=r=>E(r).document?.getBody()?.$??null,d=(r,c)=>{if(!r)return;let n=E(r);if(n.readOnly){o.fn?.();return}c(n)},f={versao:4,getInstance(r){let c=t();if(!c?.instances)return null;if(i(c.currentInstance))return c.currentInstance;let n=r?.closest?.("div.cke"),p=n?c.instances[n.id.replace("cke_","")]:void 0;if(s(p))return p;if(s(e.oEditor))return e.oEditor;let b=Object.values(c.instances);return b.find(a=>s(a))??b[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:r=>E(r).focus(),saveSnapshot:r=>E(r).fire("saveSnapshot"),withEdit(r,c){let n=E(r);n.focus(),n.fire("saveSnapshot"),n.fire("lockSnapshot",{dontUpdate:!0});try{c()}finally{n.fire("unlockSnapshot"),n.fire("saveSnapshot")}},insertHtml:(r,c)=>d(r,n=>n.insertHtml(c)),insertText:(r,c)=>d(r,n=>n.insertText(c)),getSelectionElement:r=>E(r).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(r){return f.getSelectionElement(r)?.closest("p")??null},insertHtmlBefore(r,c,n){d(r,()=>c.before(...B(c.ownerDocument,n)))},getToolbarContainer:r=>E(r).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:r=>l(r),findInBody(r,c){let n=l(r);return n?Array.from(n.querySelectorAll(c)):[]},appendToBody(r,c){d(r,n=>{let p=l(n);p&&p.append(...B(p.ownerDocument,c))})},transformBodyHtml(r,c){d(r,n=>{let p=l(n);if(!p)return;let b=p.innerHTML,a=c(b);typeof a=="string"&&a!==b&&p.replaceChildren(...B(p.ownerDocument,a))})},execCommand:(r,c,n)=>E(r).execCommand(c,n),applyStyle(r,c){let n=t()?.style;n&&E(r).applyStyle(new n(c))},getData:r=>E(r).getData(),setData:(r,c)=>d(r,n=>n.setData(c)),insertElement(r,c){d(r,n=>{let p=t()?.dom?.element.createFromHtml;p&&n.insertElement?n.insertElement(p(c,n.document)):n.insertHtml(c)})},saveSelection:r=>E(r).getSelection()?.createBookmarks(!0)??null,restoreSelection(r,c){let n=E(r).getSelection();n&&c&&n.selectBookmarks(c)},getSelectedText:r=>E(r).getSelection()?.getSelectedText()??"",getSelectedHtml(r){return E(r).getSelectedHtml?.()?.getHtml?.()??""},on:(r,c,n)=>E(r).on(c,n),off:(r,c,n)=>E(r).removeListener(c,n),fire:(r,c,n)=>E(r).fire(c,n),addContextMenu(r,c){let n=E(r),p=t();if(p&&n.contextMenu&&typeof n.addMenuItem=="function"){ce(n,p.TRISTATE_OFF,c);return}F(l(r),c)},waitReady(r){return new Promise((c,n)=>{let p=Date.now(),b=()=>{let a=Object.values(t()?.instances??{}).find(u=>u.status==="ready");if(a)return c(a);if(Date.now()-p>r)return n(new Error("Timeout aguardando CKEditor 4"));setTimeout(b,100)};b()})},somenteLeitura:r=>!!E(r).readOnly,aoRecusarEscrita(r){o.fn=r},recusarEscrita(){o.fn?.()}};return f}var y=e=>e,Co={strike:"strikethrough",strikethrough:"strikethrough"},So={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},Ao=0;function pe(e,o={}){let t=e.document,i=a=>Array.from(a.model.document.roots??[]).filter(u=>u.isAttached()&&u.rootName!=="$graveyard"),s=a=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[a],l=(a,u)=>{let m=a.editing.view.document.getRoot(u);return m?a.editing.view.domConverter.mapViewToDom(m):null},d=a=>{for(let g of i(a))if(s(g.rootName)?.principal){let x=l(a,g.rootName);if(x)return x}let u=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return u||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((g,x)=>x.childElementCount>(g?g.childElementCount:-1)?x:g,null)},f=a=>{let u=d(a);return u&&i(a).find(m=>l(a,m.rootName)===u)||null},r=a=>a.model.document.selection.getFirstPosition()?.root.rootName??null,c=a=>!!a&&!!s(a)?.somenteLeitura,n=(a,u)=>a.data.toModel(a.data.processor.toView(u)),p=(a,u)=>{let m=y(a);if(c(r(m)))return o.fn?.();m.model.change(()=>m.model.insertContent(n(m,u),m.model.document.selection))},b={versao:5,getInstance(){let a=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return a&&a.state==="ready"?a:null},getAllInstances(){let a=b.getInstance();return a?[a]:[]},focus:a=>y(a).focus(),saveSnapshot(){},withEdit(a,u){let m=y(a);m.focus(),m.model.change(()=>u())},insertHtml:p,insertText(a,u){let m=y(a);if(c(r(m)))return o.fn?.();m.model.change(g=>m.model.insertContent(g.createText(u)))},getSelectionElement(){let a=e.getSelection?.(),u=a&&a.rangeCount>0?a.anchorNode:null;return u?u.nodeType===1?u:u.parentElement:null},getSelectionParagraph:a=>b.getSelectionElement(a)?.closest("p")??null,insertHtmlBefore(a,u,m){let g=y(a),x=g.editing.view.domConverter.mapDomToView(u),v=x?g.editing.mapper.toModelElement(x):null;if(v){if(c(v.root?.rootName))return o.fn?.();g.model.change(k=>g.model.insertContent(n(g,m),k.createPositionBefore(v)));return}p(a,m)},getToolbarContainer(a){let u=y(a).ui?.view?.toolbar?.element;return u?u.querySelector(".ck-toolbar__items")??u:null},getBodyContainer:a=>d(y(a)),findInBody(a,u){let m=d(y(a));return m?Array.from(m.querySelectorAll(u)):[]},appendToBody(a,u){let m=y(a),g=f(m);if(!g)return p(a,u);if(c(g.rootName))return o.fn?.();m.model.change(x=>m.model.insertContent(n(m,u),x.createPositionAt(g,"end")))},transformBodyHtml(a,u){let m=y(a),g=f(m);if(!g)return;let x=m.data.get({rootName:g.rootName,seiProInterno:!0}),v=u(x);if(typeof v!="string"||v===x)return;let k=m.model.document.selection.getFirstRange(),C=k&&k.start.root.rootName===k.end.root.rootName?{raiz:k.start.root,ps:[...k.start.path],pe:[...k.end.path]}:null,I=m.model.document.selection.isBackward;m.data.set({[g.rootName]:v}),C&&m.model.change(M=>{let L,K;try{L=m.model.createPositionFromPath(C.raiz,C.ps),K=m.model.createPositionFromPath(C.raiz,C.pe)}catch{L=K=M.createPositionAt(C.raiz,"end")}M.setSelection(M.createRange(L,K),{backward:I})})},execCommand(a,u,m){y(a).execute(Co[u]??u,m!==void 0?{value:m}:void 0)},applyStyle(a,u){let m=So[u.element.toLowerCase()];m&&y(a).execute(m)},getData(a){let u=y(a),m=f(u);return m?u.data.get({rootName:m.rootName}):u.data.get()},setData(a,u){let m=y(a),g=f(m);g?m.data.set({[g.rootName]:u}):m.data.set(u)},insertElement:(a,u)=>b.insertHtml(a,u),saveSelection(a){let u=y(a),m=`spro-ed:${Ao++}`;return u.model.change(g=>{let x=u.model.document.selection.getFirstRange();x&&g.addMarker(m,{range:x,usingOperation:!1})}),m},restoreSelection(a,u){let m=y(a);if(typeof u!="string")return;let g=m.model.markers.get(u);g&&m.model.change(x=>x.setSelection(g.getRange())),m.model.change(x=>{m.model.markers.has(u)&&x.removeMarker(u)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let a=e.getSelection?.();if(!a||a.rangeCount===0)return"";let u=t.createElement("div");return u.append(a.getRangeAt(0).cloneContents()),u.innerHTML},on(a,u,m){if(u==="change")return y(a).model.document.on("change:data",m);d(y(a))?.addEventListener(u,m)},off(a,u,m){if(u==="change")return y(a).model.document.off("change:data",m);d(y(a))?.removeEventListener(u,m)},fire(a,u,m){d(y(a))?.dispatchEvent(new CustomEvent(u,{detail:m}))},addContextMenu(a,u){F(d(y(a)),u)},waitReady(a){return new Promise((u,m)=>{let g=Date.now(),x=()=>{let v=b.getInstance();if(v)return u(v);if(Date.now()-g>a)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(x,100)};x()})},somenteLeitura:a=>c(r(y(a))),aoRecusarEscrita(a){o.fn=a},recusarEscrita(){o.fn?.()}};return b}function W(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function ue(e){let o=null,t={},i=()=>{if(o)return o;let d=W(e);return d===5?o=pe(e,t):d===4&&(o=de(e,t)),o},s=()=>{let d=i();if(!d)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return d},l=d=>((...f)=>s()[d](...f));return{get versao(){return i()?.versao??0},getInstance:d=>i()?.getInstance(d)??null,getAllInstances:()=>i()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(d){t.fn=d},recusarEscrita(){t.fn?.()},waitReady(d){let f=Date.now();return new Promise((r,c)=>{let n=()=>{let p=i();if(p)return p.waitReady(Math.max(1,d-(Date.now()-f))).then(r,c);if(Date.now()-f>d)return c(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(n,100)};n()})}}}var me="data-base";function fe(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(s=>s?.configGeral).find(Array.isArray)?.find(s=>s?.name===o)?.value}function be(e,o){let t=fe(e,o);return!(t===!1||t===0||t==="")}function ge(e,o){let t=fe(e,o);return t===!0||t===1||t==="1"}function he(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function xe(e,o=localStorage){return be(he(o),e)}function ve(e,o=localStorage){return ge(he(o),e)}function j(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function Q(e){e.style.display="none"}var ye=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function ke(e){let o=()=>e.adaptador.versao===5,t=(i,s)=>{let l=i.editing.view.domConverter.mapDomToView(s);return l?i.editing.mapper.toModelElement(l):null};return{selecionados(i){let s=()=>{let a=e.adaptador.getSelectionParagraph(i);return a?[a]:[]};if(o()){let a=i,m=[...a.model.document.selection.getSelectedBlocks()].map(g=>{let x=a.editing.mapper.toViewElement(g);return x?a.editing.view.domConverter.mapViewToDom(x):null}).filter(g=>!!g&&g.tagName==="P");return m.length?m:s()}let d=e.adaptador.getBodyContainer(i)?.ownerDocument?.getSelection?.();if(!d||d.rangeCount===0||!d.anchorNode)return s();let f=ye(d.anchorNode),r=ye(d.focusNode);if(!f&&!r||(f=f??r,r=r??f,!f||!r))return s();if(f===r)return[f];let c=f,n=r;f.compareDocumentPosition(r)&2&&(c=r,n=f);let p=[],b=c;for(let a=0;b&&a<5e3&&(b.tagName.toLowerCase()==="p"&&p.push(b),b!==n);a+=1)b=b.nextElementSibling;return p.length?p:[c]},classeDeEstilo(i,s){return o()?t(i,s)?.getAttribute("estilo")??"":s.getAttribute("class")??""},definirClasse(i,s,l){if(o()){let d=i,f=t(d,s);f&&d.model.change(r=>r.setAttribute("estilo",l,f)),e.win.SeiProGhs?.setEstilos(s,{"text-align":null},i);return}s.removeAttribute("style"),s.setAttribute("class",l)},definirTextAlign(i,s,l){if(o()){e.win.SeiProGhs?.setEstilos(s,{"text-align":l},i);return}s.removeAttribute("style"),s.style.textAlign=l}}}var To=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function Mo(e,o){let t=To.find(i=>Object.values(i).includes(e));return t?t[o]:null}function _o(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let i=e?.parentElement??null;i;i=i.parentElement){let s=i.querySelector(".divAlignText");if(s)return s}return o.querySelector(".divAlignText")}var Ee={id:"align",globais(e){let o=ke(e);return{setAlignText(t,i){let s=e.adaptador.getInstance(t);if(!s||e.adaptador.somenteLeitura(s))return;let l=o.selecionados(s);l.length&&e.adaptador.withEdit(s,()=>{for(let d of l){let f=Mo(o.classeDeEstilo(s,d),i);f?o.definirClasse(s,d,f):o.definirTextAlign(s,d,i)}})},openAlignText(t){if(!t)return;let i=_o(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),i&&Q(i)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),i&&j(i))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function h(e,o={},...t){let i=document.createElement(e);for(let[s,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?i.addEventListener(s.replace(/^on/,""),l):l===!0?i.setAttribute(s,""):s==="class"?i.className=l:s==="value"&&e==="textarea"?i.value=l:i.setAttribute(s,l));for(let s of t)s!=null&&s!==!1&&i.append(s);return i}var A={fill:"currentColor",stroke:"none"},we="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Ce={estrela:[["path",{d:we}]],estrelaCheia:[["path",{d:we,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...A}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...A}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...A}],["circle",{cx:"12",cy:"12",r:"1.4",...A}],["circle",{cx:"19",cy:"12",r:"1.4",...A}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...A}],["circle",{cx:"15",cy:"6",r:"1.3",...A}],["circle",{cx:"9",cy:"12",r:"1.3",...A}],["circle",{cx:"15",cy:"12",r:"1.3",...A}],["circle",{cx:"9",cy:"18",r:"1.3",...A}],["circle",{cx:"15",cy:"18",r:"1.3",...A}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Pt=Object.keys(Ce);function z(e,o=18,t=document){let i="http://www.w3.org/2000/svg",s=t.createElementNS(i,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[d,f]of Object.entries(l))s.setAttribute(d,f);for(let[d,f]of Ce[e]){let r=t.createElementNS(i,d);for(let[c,n]of Object.entries(f))r.setAttribute(c,n);s.append(r)}return s}function qo(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function Se(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function Ae(e,o,t,i,s){let l=e.body??e.documentElement;for(let p of[l,...e.querySelectorAll("dialog")])for(let b of[...p.children])b.classList.contains("spro-aviso")&&b.remove();let d=h("div",{class:"spro-aviso",role:"status"},z("check",16),h("span",{},o),...qo(t).map(p=>h("button",{type:"button",onclick:()=>{d.remove(),p.fazer()}},p.rotulo)));d.setAttribute("popover","manual");let f=()=>{try{d.showPopover?.()}catch{}},r=Date.now()+i,c=()=>{let p=Se(e);p.append(d),f(),p.localName==="dialog"&&p.addEventListener("close",()=>{if(!(!n||!p.contains(d))){if(s&&Se(e).localName!=="dialog"&&s(o,t,Math.max(0,r-Date.now()))){n=!1,d.remove();return}c()}},{once:!0})},n=!0;return c(),setTimeout(()=>{n=!1,d.remove()},i),d}var Lo=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function Te(e={}){return({titulo:o,conteudo:t,icone:i,aoFechar:s})=>{let l=h("dialog",{class:"spro-dialogo","aria-label":o}),d=()=>{l.open&&l.close()};return l.append(h("header",{},i?h("span",{class:"spro-dialogo-icone","aria-hidden":"true"},z(i,18)):null,h("h2",{},o),h("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:d},z("fechar",16))),h("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),s?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(Lo)?.focus({preventScroll:!0}),{fechar:d}}}function Me(e){let o=Te();return(t,i)=>(J(t,e),o(i))}function J(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var X="";function Y(e){X=e}var T=(e,o)=>Me(X)(e,o);function _e(e){J(e,X)}function w(e,o){_e(e),Ae(e,o,void 0,7e3)}var Io=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),qe=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Do(e){let o=0,t=e.split("");return t.forEach((i,s)=>{let l=qe.get(i),d=qe.get(t[s+1]);o+=l<d?-l:l}),o}function Le(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Io.has(o.toLowerCase())&&t!==0?o.toLowerCase():Do(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function _(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Ie={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let i=e.adaptador.getSelectedText(t);if(!i||i.trim()===""){w(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,_(Le(i)))}})};var De="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Re(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let i of o)t+=De[i%De.length];return t}var Ro=()=>`<span class="ancoraSei checkboxSEI" data-id="${Re(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,$e={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Ro()))}})};var Z="copyStylePro",ee="cke_copyformatting_active",Pe=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function $o(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),i=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&i?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var He={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,i=()=>{try{return JSON.parse(t().getItem(Z)??"null")}catch{return null}},s=n=>o.getSelectedHtml(n).trim()!==""||o.getSelectedText(n).trim()!=="",l=n=>!!o.getBodyContainer(n)?.classList.contains(ee),d=n=>{for(let p of e.doc.querySelectorAll(".getCopyStyleButtom"))n==="desabilitar"?p.classList.add("cke_button_disabled"):n==="habilitar"?p.classList.remove("cke_button_disabled"):(p.classList.toggle("cke_button_on",n),p.classList.toggle("cke_button_off",!n))};function f(){let n=o.getInstance();n&&o.getBodyContainer(n)?.classList.remove(ee),t().removeItem(Z),d(!1)}function r(n){let p=n??o.getInstance();if(!p)return;if(l(p)){f();return}let b=o.getSelectionElement(p);b&&(t().setItem(Z,JSON.stringify($o(b))),o.getBodyContainer(p)?.classList.add(ee),d(!0))}function c(){let n=o.getInstance();if(!n)return;let p=s(n),b=l(n);d(p||b?"habilitar":"desabilitar");let a=i();if(!(a&&p&&b))return;o.withEdit(n,()=>{o.execCommand(n,"removeFormat");for(let[g,x]of[[a.bold,"bold"],[a.underline,"underline"],[a.italic,"italic"],[a.strike,"strike"],[a.subscript,"subscript"],[a.superscript,"superscript"]])g===!0&&o.execCommand(n,x);let m=[];if(typeof a.backgroundColor=="string"&&Pe.test(a.backgroundColor)&&m.push(`background-color: ${a.backgroundColor}`),typeof a.fontSize=="number"&&Number.isFinite(a.fontSize)&&a.fontSize>0&&a.fontSize<400&&m.push(`font-size: ${a.fontSize}px`),typeof a.color=="string"&&Pe.test(a.color)&&m.push(`color: ${a.color}`),m.length){let g=o.getSelectedHtml(n);g!==""&&o.insertHtml(n,`<span style="${m.join("; ")}">${g}</span>`)}}),!!e.win.event?.altKey||f()}return{setCopyStyle(n){let p=o.getInstance(n);p&&r(p)},actionCopyStyle:r,getCopyStyle:i,applyCopyStyle:c,removeCopyStyle:f,menuCopyStyle(n){n&&o.addContextMenu(n,p=>o.versao===5?[]:p?.closest("p")&&s(n)?[{label:"Copiar formata\xE7\xE3o",action:()=>r(n)}]:[])}}}};var oe="spro_editor_folha",ze="seipro-folha-editor",te="data-spro-folha-editor",Po=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function Ho(e){let o=`html[${te}]`,t=e?"#141619":"#f3f4f7",i=e?"#2a2d33":"#e3e6ee",s="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${s}, -14px 0 24px -14px ${s}`,d=`0 14px 24px -14px ${s}`,f=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${f} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${i}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${f}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${f}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${d}; clip-path: inset(0 -30px -30px); }
${f}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${f} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${i} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function Oe(e,o){if(!e.head||(e.querySelector(`style[data-style="${ze}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",ze),t.textContent=o,e.head.append(t)}function Ne(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[i,s]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),i&&e.style.setProperty("background-color",i,s||"")}}var Be={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(oe),i=()=>!!e.win.localStorage?.getItem("darkModePro"),s=!1;function l(r){for(let c of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let n=c.contentDocument;n?.head&&(Oe(n,r?Po:null),Ne(n.documentElement,r),Ne(n.body,r))}}function d(r){let c=[...o.querySelectorAll(".cke_contents")];c.forEach((n,p)=>{if(!r){n.removeAttribute("data-spro-folha");return}let b=[p===0?"primeira":"",p===c.length-1?"ultima":""].filter(Boolean);n.setAttribute("data-spro-folha",b.join(" ")||"meio")})}function f(r){Oe(o,r?Ho(i()):null),l(r),d(r),r?o.documentElement.setAttribute(te,""):o.documentElement.removeAttribute(te);for(let c of o.querySelectorAll(".getPaperViewButtom"))c.classList.toggle("cke_button_on",r),c.classList.toggle("cke_button_off",!r),c.setAttribute("aria-pressed",r?"true":"false")}return{aplicarFolhaEditorPro:f,getPaperViewButtom(r){let c=!t();c?e.win.localStorage.setItem(oe,"1"):e.win.localStorage.removeItem(oe),f(c)},initFolhaEditorPro(){let r=e.win.CKEDITOR;if(typeof r?.on=="function"&&!s){s=!0;let c=n=>n.on("contentDom",()=>t()&&l(!0));for(let n of Object.values(r.instances??{}))c(n);r.on("instanceReady",n=>c(n.editor))}f(t())}}}};function zo(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var Fe={id:"font-size",globais:e=>({changeFontSize(o,t){let i=e.adaptador.getInstance(o);if(!i)return;let s=e.adaptador.getSelectedHtml(i);if(!s||s.trim()===""){w(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=zo(e.adaptador.getSelectionElement(i)),d=t==="up"?l+2:l-2;d>7&&d<70&&e.adaptador.withEdit(i,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(i,{element:"span",attributes:{style:`font-size: ${d}px`}}):e.adaptador.insertHtml(i,`<span style="font-size: ${d}px">${s}</span>`)})}})};var V=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Oo=[{name:V,attributes:!0},{name:V,classes:!0},{name:V,styles:!0}],O=e=>e.split("").join("[\\t\\n\\r]*"),re=new RegExp(`^[\\s\\x00-\\x20]*(${O("javascript")}|${O("vbscript")}|${O("livescript")}|${O("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${O("text/html")})`,"i"),No=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:re}]}];function D(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function N(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var Bo=e=>!!(e?.model&&e.editing&&e.conversion),Fo=e=>N(e,"EstiloEditing")?.estilos??{},je=(e,o)=>Object.hasOwn(e,o);function Ge(e,o){let t=N(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function jo(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function Qo(e,o,t){if(!o?.is?.("element"))return;let i=t.mapper.toViewElement(o);if(!i)return;let s=Fo(e),l=o.getAttribute("estilo"),d=jo(o,Ge(e,"p")),f=t.writer,r=[];try{r=Array.from(i.getClassNames())}catch{}for(let c of r)c!==l&&je(s,c)&&f.removeClass(c,i);for(let c of d)je(s,c)||f.addClass(c,i);l&&f.addClass(l,i)}function Vo(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Ge(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let i of o)t.on(i,(s,l,d)=>{try{Qo(e,l.item,d)}catch{}},{priority:"lowest"})})}function Go(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function Qe(e,o){let t=N(o,"Salvar"),i=t?!!t.isDirty:!1;try{e()}finally{if(t&&!i)try{t.resetDirty()}catch{}}}function Uo(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function Ko(e,o){let t=e.getFullData({seiProInterno:!0}),i=o.INFRA_EDITOR_CONFIG?.initialData;return!i||typeof i!="object"||Uo(e)?t:Object.fromEntries(Object.keys(t).map(s=>[s,typeof i[s]=="string"?i[s]:t[s]]))}function Wo(e,o,t){try{let i=t??e.adaptador.getSelectionParagraph(o);if(!i)return null;if(typeof i.is=="function"&&i.is("element"))return i;let s=i.jquery?i.get(0):i;if(s?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(s);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function Jo(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function Ve(e){let o=l=>l??e.adaptador.getInstance();function t(l){let d=o(l);if(!Bo(d))return!1;if(d.__seiProGhsLiberado)return!0;let f=N(d,"DataFilter");if(!f)return D("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{f.allowElement({name:V,attributes:!0,classes:!0,styles:!0});for(let r of Oo)f.allowAttributes(r);if(typeof f.disallowAttributes=="function")for(let r of No)f.disallowAttributes(r)}catch(r){return D("falha ao liberar o GHS",r),!1}return d.__seiProGhsLiberado=!0,Vo(d),!0}function i(l){let d=o(l);if(!t(d)||typeof d.getFullData!="function")return!1;let f=!0;return Qe(()=>{try{d.data.set(Ko(d,e.win))}catch(r){D("falha ao reprocessar o conteudo",r),f=!1}},d),f}function s(l,d,f){let r=o(l);if(!t(r))return!1;let c=N(r,"GeneralHtmlSupport"),n=Wo(e,r,d),p=n?Jo(r,n):null;if(!c||!n||!p)return!1;try{return f(c,p,n),!0}catch(b){return D("falha ao aplicar no model",b),!1}}return{liberar:t,aplicarRegras:i,semSujar:(l,d)=>Qe(l,o(d)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,d,f)=>s(f,l,(r,c,n)=>r.addModelHtmlClass(c,d,n)),removeClasse:(l,d,f)=>s(f,l,(r,c,n)=>r.removeModelHtmlClass(c,d,n)),setEstilos:(l,d,f)=>s(f,l,(r,c,n)=>r.setModelHtmlStyles(c,d,n)),setAtributos:(l,d,f)=>s(f,l,(r,c,n)=>r.setModelHtmlAttributes(c,d,n))}}var Ue={id:"ghs-unlock",globais:e=>({SeiProGhs:Ve(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=Ve(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||Go(t)){D("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&D("classes, estilos e atributos liberados no editor")}}};function R(...e){return h("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function q(e,o){return o.classList.add("spro-campo"),o.style.width="100%",h("label",{style:"display:grid;gap:4px;font-size:13px;"},h("span",{},e),o)}function Ke(e,o){return new Promise((t,i)=>{let s=new e.Image;s.crossOrigin="anonymous",s.onload=()=>{try{let l=e.document.createElement("canvas");l.width=s.width,l.height=s.height,l.getContext("2d")?.drawImage(s,0,0),t(l.toDataURL("image/png"))}catch(l){i(l)}},s.onerror=()=>i(new Error("imagem nao carregou")),s.src=o})}var Xo="https://latex.codecogs.com/png.latex?",Yo="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",Zo="https://editor.codecogs.com/",We={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(r=>Ke(e.win,r)),i=r=>w(e.doc,r);function s(){let r=o;if(!r)return;let c=r.texto.value;r.geracao+=1;let n=r.geracao;if(r.previa.replaceChildren(),r.pronta=!1,r.falhou=!1,c==="")return;let p=h("img",{src:`${Xo}${encodeURI(c)}`});r.previa.append(p),t(p.getAttribute("src")??"").then(b=>{o!==r||r.geracao!==n||(p.setAttribute("src",b),p.className="img-base64",r.pronta=!0)},()=>{o===r&&r.geracao===n&&(r.falhou=!0)})}function l(){let r=o;if(!r)return!1;let c=r.texto.value;if(c==="")return i("Digite a equa\xE7\xE3o"),!1;if(r.falhou)return i("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let n=r.previa.querySelector("img");if(!r.pronta||!n)return i("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let p=r.ed,b=`<img class="img-base64" src="${_(n.getAttribute("src")??"")}" alt="${_(c)}">`;return e.adaptador.withEdit(p,()=>e.adaptador.insertHtml(p,b)),!0}function d(r){let c=e.adaptador.getInstance(r);if(!c)return;let n=h("textarea",{id:"MathText",rows:"5"});n.addEventListener("input",s);let p=h("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),b=T(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:R(q("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",n),p,h("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",h("a",{href:Yo,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",h("a",{href:Zo,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&b.fechar()}},"Inserir")))});o={ed:c,texto:n,previa:p,geracao:0,pronta:!1,falhou:!1};let a=String(e.win.getSelection?.()??"").trim();a!==""&&(n.value=a,s())}function f(){}return{updatePreviewLatex:s,openDialogLatex:d,getDialogLatex:f}}};function Je(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(i=>t.getBodyContainer(i)?.ownerDocument===o.ownerDocument)??t.getInstance()}function Xe(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function G(e,o,t,i){let s=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[i?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return s&&e.adaptador.recusarEscrita(),s}function Ye(e,o){let t=Je(e,o);if(!t)return!1;if(e.adaptador.versao===5){let i=t,s=Xe(i,o);return!s||G(e,t,o,s)?!1:(i.model.change(l=>l.setSelection(s)),i.execute("unlink"),!0)}return G(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Ze(e,o,t,i){let s=Je(e,o);if(!s)return!1;if(e.adaptador.versao===5){let l=s,d=Xe(l,o);return!d||G(e,s,o,d)?!1:(l.model.change(f=>{f.setSelection(d),l.model.insertContent(f.createText(t,{linkHref:i}))}),!0)}return G(e,s,o,null)?!1:(e.adaptador.withEdit(s,()=>{o.setAttribute("href",i),o.setAttribute("data-cke-saved-href",i),o.textContent=t}),!0)}function $(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var et="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",eo=new WeakMap,ot=e=>{let o=eo.get(e);if(o)return o;let t={balao:null};return eo.set(e,t),t},tt=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function oo(e){let o=ot(e),t=a=>w(e.doc,a);function i(a){let u=o.balao;if(u){if(!a){let m=!1;try{m=u.el.matches(":hover")}catch{m=!1}if(m)return}u.el.remove(),o.balao=null}}function s(){if(o.balao)return o.balao.link;let a=e.adaptador.getInstance();return(a?e.adaptador.getSelectionElement(a):null)?.closest("a[href]")??null}async function l(a){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(a),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function d(a,u){i(!0);let m=a?.closest?.("a[href]"),g=m?.getAttribute("href")??"";if(!m||!$(g))return;let x=h("a",{href:g,target:"_blank",rel:"noopener noreferrer",title:m.textContent??"",style:"color:inherit;text-decoration:underline;"},h("strong",{},tt(g))),v=(I,M,L)=>h("button",{type:"button",class:I,title:M,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:L},M),k=h("div",{class:"linkDisplayPro",style:et},x,v("spro-copiar","Copiar",()=>void l(g)),v("spro-editar","Editar",()=>n()),v("spro-remover","Remover",()=>f()));e.doc.body.append(k),o.balao={el:k,link:m};let C=m.getBoundingClientRect?.();if(C){let I=m.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),M=k.getBoundingClientRect?.().width??0,L=Math.max(8,Math.min(C.left+(I?.left??0),(e.win.innerWidth||0)-M-8));k.style.left=`${L}px`,k.style.top=`${C.bottom+(I?.top??0)+4}px`}}function f(a,u){let m=s();m&&(Ye(e,m),i(!0))}function r(a,u){let m=s()?.getAttribute("href");m&&$(m)&&e.win.open(m,"_blank","noopener,noreferrer")}function c(a,u){let m=s()?.getAttribute("href");m&&l(m)}function n(){let a=s();if(!a)return;let u=h("input",{type:"text",id:"linkProNome"}),m=h("input",{type:"text",id:"linkProUrl"});u.value=a.textContent??"",m.value=a.getAttribute("href")??"";let g=T(e.doc,{titulo:"Editar link",conteudo:R(q("Texto vis\xEDvel:",u),q("URL:",m),h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:()=>{let x=m.value.trim(),v=u.value.trim()||x;if(x==="")return t("Digite um link");if(re.test(x))return t("O link informado \xE9 inv\xE1lido.");Ze(e,a,v,x)&&(i(!0),g.fechar())}},"Salvar")))})}function p(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",a=>{let u=a.target;if(!u||o.balao?.el.contains(u))return;let m=u.closest?.("a[href]");m&&u.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?d(m):i(!1)},!0)}return{globais:{showLinkTips:d,hideLinkTips:a=>i(!1),openLinkPro:r,removeLinkPro:f,copyLinkPro:c,editLinkPro:a=>n(),openDialogLinkPro:n,getDialogLinkPro:()=>{}},iniciar:p}}var to={id:"link-pro",globais:e=>oo(e).globais,iniciar:e=>oo(e).iniciar()};function U(e,o,t,i){let s=e.adaptador.getInstance(o);if(!s)return;let l=e.adaptador.getSelectionParagraph(s);l&&e.adaptador.withEdit(s,()=>{e.adaptador.insertHtmlBefore(s,l,t),i?.(s,l)})}var rt='<div class="pageBreakPro" style="page-break-after: always"></div>',ro={id:"page-break",globais:e=>({getPageBreak:o=>U(e,o,rt)})};var ao=5,no=5,io=49,S=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function at(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let i=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(i)return i;for(let s=e?.previousElementSibling??null;s;s=s.previousElementSibling)if(s.classList.contains("divQuickTable"))return s;return o.querySelector(".divQuickTable")}var so={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let n of e.doc.querySelectorAll(".divQuickTable"))n.replaceChildren(),Q(n);for(let n of e.doc.querySelectorAll(".getQuickTableButtom"))n.classList.add("cke_button_off"),n.classList.remove("cke_button_on")}function i(n){if(!n)return;let p=S(n,"data-row"),b=S(n,"data-col"),a=n.closest("table");if(!a)return;for(let g of a.querySelectorAll("td"))g.classList.remove("td_hover");let u=()=>[...a.querySelectorAll("tr")];if(p>=3&&S(u().at(-1)?.querySelector("td"),"data-row")>p+1&&(u().at(-1)?.remove(),a.setAttribute("data-row",String(S(a,"data-row")-1))),b>=3&&S(u().at(-1)?.lastElementChild,"data-col")>b+1){for(let g of u())g.lastElementChild?.remove();a.setAttribute("data-col",String(S(a,"data-col")-1))}for(let g of a.querySelectorAll("td"))S(g,"data-row")<=p&&S(g,"data-col")<=b&&g.classList.add("td_hover");let m=n.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(m&&(m.textContent=`Tabela ${p+1}x${b+1}`),p===S(a,"data-row")&&p<io){let g=u().at(-1)?.cloneNode(!0);g&&(g.querySelectorAll("td").forEach((x,v)=>{x.setAttribute("data-row",String(p+1)),x.setAttribute("data-col",String(v)),x.classList.remove("td_hover")}),(a.querySelector("tbody")??a).append(g),a.setAttribute("data-row",String(p+1)))}if(b===S(a,"data-col")&&b<io){for(let g of u()){let x=g.lastElementChild?.cloneNode(!0);x&&(x.setAttribute("data-col",String(b+1)),x.classList.remove("td_hover"),g.append(x))}a.setAttribute("data-col",String(b+1))}}function s(){let n=e.doc,p=n.createDocumentFragment(),b=n.createElement("div");b.className="quickTableInfo",b.textContent="Inserir Tabela";let a=n.createElement("table");a.setAttribute("data-row",String(ao-1)),a.setAttribute("data-col",String(no-1));for(let m=0;m<ao;m+=1){let g=n.createElement("tr");for(let x=0;x<no;x+=1){let v=n.createElement("td");v.setAttribute("data-row",String(m)),v.setAttribute("data-col",String(x)),g.append(v)}a.append(g)}let u=m=>i(m.target?.closest("td")??null);return a.addEventListener("mouseover",u),a.addEventListener("mouseout",u),a.addEventListener("click",m=>{let g=m.target?.closest("td");g&&c(g)}),p.append(b,a),p}function l(n){if(!n)return;let p=at(n,e.doc);n.classList.contains("cke_button_on")?(t(),n.classList.add("cke_button_off"),n.classList.remove("cke_button_on")):(p&&(p.replaceChildren(s()),j(p)),n.classList.remove("cke_button_off"),n.classList.add("cke_button_on"))}function d(n){let p=n?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),b=p?[...p.querySelectorAll(".getTablestylesButtom")]:[];b.length||(b=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let a of b)a.classList.remove("cke_button_disabled")}function f(n,p){let b='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';b+="  <tbody>";for(let a=0;a<=n;a+=1){b+="      <tr>";for(let u=0;u<=p;u+=1)b+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';b+="      </tr>"}return`${b}  </tbody></table>`}function r(n,p){let b=p?p.nextElementSibling:o.getBodyContainer(n)?.lastElementChild,a=b?.tagName==="TABLE"?b.querySelector("td p"):null;if(!a)return;let u=a.ownerDocument,m=u.defaultView?.getSelection?.();if(!m)return;let g=u.createRange();g.setStart(a.firstChild??a,0),g.collapse(!0),m.removeAllRanges(),m.addRange(g)}function c(n){let p=o.getInstance(n);if(!p){t();return}let b=f(S(n,"data-row"),S(n,"data-col")),a=o.getSelectionParagraph(p);o.withEdit(p,()=>{if(!a)return o.insertHtml(p,b);let u=a.nextElementSibling;u?o.insertHtmlBefore(p,u,b):o.appendToBody(p,b)}),t(),d(n),r(p,a)}return{getQuickTable:l,quickTableOver:i,hideQuickTable:t,quickTableClick:c}}};function P(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function lo(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var nt='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',it="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",co={id:"session-break",globais:e=>({getSessionBreak:o=>U(e,o,nt,(t,i)=>{if(e.adaptador.versao!==5)return;let s=t,l=s.plugins?.has("GeneralHtmlSupport")?s.plugins.get("GeneralHtmlSupport"):null,d=P(s,i)?.previousSibling;l&&d?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":it},d)})})};var po=["seiSlim","seiSlim_parent","seiSlim_view"],uo={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=s=>{for(let l of o())l.classList.add(s?"cke_button_on":"cke_button_off"),l.classList.remove(s?"cke_button_off":"cke_button_on")};function i(s){if(s==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...po)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...po)}return{getBoxStyleEditor(s){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),i("remove")):(t(!0),i("set"))},updateStyleEditor:i}}};var H={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function ae(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function ne(e){let o={};for(let t of e.split(";")){let i=t.indexOf(":");if(i<=0)continue;let s=t.slice(0,i).trim(),l=t.slice(i+1).trim();s&&l&&(o[s]=l)}return o}function st(e,o,t){let i=[];for(let s=0;s<o;s+=1){let l=s===0,d=l?e.trCabecalho:Array.isArray(e.tr)?s%2===0?e.tr[1]:e.tr[0]:e.tr,f=Array.from({length:t},(r,c)=>({td:l?e.tdCabecalho:c===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));i.push({tr:d,celulas:f})}return{linhas:i}}var ie=e=>Array.from(e.querySelectorAll("td, th"));function mo(e,o,t,i,s){let l=e.adaptador,d=Array.from(t.querySelectorAll("tr")),f=st(i,d.length,Math.max(0,...d.map(r=>ie(r).length)));if(l.versao===5){let r=o,c=r.plugins?.has("GeneralHtmlSupport")?r.plugins.get("GeneralHtmlSupport"):null,n=P(r,t.closest("figure")??t);return!c||!n?!1:lo(e,n)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{c.setModelHtmlStyles("table",ne(i.table),n),d.forEach((p,b)=>{let a=f.linhas[b];if(!a)return;let u=P(r,p);u&&c.setModelHtmlStyles("tr",ne(a.tr),u),ie(p).forEach((m,g)=>{let x=P(r,m);if(x){c.setModelHtmlStyles("td",ne(a.celulas[g]?.td??""),x);for(let v of x.getChildren())v.name==="paragraph"&&r.model.change(k=>k.setAttribute("estilo",a.celulas[g]?.p,v))}})}),i.cabecalho&&r.model.change(p=>p.setAttribute("headingRows",1,n))}),!0)}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let r=t.ownerDocument;if(t.setAttribute("style",i.table),d.forEach((c,n)=>{let p=f.linhas[n];p&&(c.setAttribute("style",p.tr),ie(c).forEach((b,a)=>{b.setAttribute("style",p.celulas[a]?.td??"");let u=p.celulas[a]?.p??"",m=b.querySelectorAll("p");if(m.length)for(let g of m)g.setAttribute("class",u);else{let g=r.createElement("p");g.setAttribute("class",u),g.append(...Array.from(b.childNodes)),b.append(g)}}))}),i.cabecalho&&d[0]&&!t.querySelector("thead")){let c=r.createElement("thead");c.append(d[0]),t.prepend(c)}s?.aoFinalCk4?.(t)}),!0)}var fo="color1",lt="Clique na tabela que deseja aplicar o estilo!",se="dark-mode-color-";function ct(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function dt(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${se}black`,`${se}white`),o.classList.add(`${se}${ct(t)>125?"black":"white"}`))}}var bo={id:"table-styles",globais(e){let o=e.adaptador,t=r=>o.getSelectionElement(r)?.closest("table")??null;function i(r,c){let n=r.querySelector("#addEstiloTabela");n&&c&&/^color\d+$/.test(c)&&(n.className=c)}function s(r,c,n,p=!0,b){let a=n??o.getInstance();if(!a||!c)return;let[u,m,g]=c,x=H[m],v=Number(g),k=x&&Number.isFinite(v)?ae(x,v)[u]:void 0,C=b?.isConnected?b:b?null:t(a);!k||!C||mo(e,a,C,{...k,cabecalho:p},{aoFinalCk4:dt})}function l(){let r=Object.keys(H),c=Object.keys(ae(H[fo])),n=h("div",{id:"selectColorTabela",class:"listaCoresTabela"},...r.map((b,a)=>h("span",{},h("label",{for:`colorStyle${a+1}`},h("a",{class:"iconSelectColorTable",style:`background-color: ${H[b]?.light}`}),h("a",{class:"iconSelectColorTable",style:`background-color: ${H[b]?.dark}`})),h("br"),h("input",{type:"radio",name:"colorStyle","data-colorid":b,id:`colorStyle${a+1}`,value:`colorStyle${a+1}`,...a===0?{checked:"checked"}:{}})))),p=[];return c.forEach((b,a)=>{a%7===0&&p.push(h("div",{class:"listaEstiloTabela"}));let u=a+1;p[p.length-1]?.append(h("span",{},h("label",{for:`tableStyle${u}`},h("a",{class:"iconSelectStyleTable",style:`background-position-y: -${u*43}px`})),h("br"),h("input",{type:"radio",name:"tableStyle",id:`tableStyle${u}`,value:`tableStyle${u}`,...a===0?{checked:"checked"}:{}})))}),h("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},h("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),n,h("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),h("div",{id:"addEstiloTabela",class:fo},...p),h("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",h("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),h("div",{style:"padding: 10px 0;"},h("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",h("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function d(r){try{let c=p=>Number.parseFloat(p?e.win.getComputedStyle(p).width:""),n=Math.round(100*c(r)/c(r?.parentElement??null));return Number.isFinite(n)?Math.min(100,Math.max(5,n)):80}catch{return 80}}function f(r,c){let n=c??o.getInstance();if(!n)return;let p=t(n),b=l(),a=b.querySelector("#addEstiloTableWidth");a&&(a.value=String(d(p)));for(let m of b.querySelectorAll('input[name="colorStyle"]'))m.addEventListener("change",()=>i(b,m.getAttribute("data-colorid")));let u=T(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:h("div",{},b,h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:()=>{let m=b.querySelector('input[name="tableStyle"]:checked')?.value,g=b.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),x=b.querySelector("#addEstiloTableWidth")?.value,v=b.querySelector("#addEstiloTableHeader:checked")!==null;!m||!g||!x||(s(null,[m,g,x],n,v,p),u.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(r){let c=o.getInstance(r);c&&(t(c)?f(null,c):w(e.doc,lt))},changeColorTable(r){i(e.doc,r?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:r=>f(null,r),getSyleTable(r){let c=o.getInstance(r);c&&o.withEdit(c,()=>{})},setSyleTable:(r,c)=>s(null,r,c)}}};var go=/^[0-9A-Za-z-]+$/,pt="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",ut=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,ho={id:"tiny-url",globais(e){let o=d=>w(e.doc,d),t=d=>(e.fetch??e.win.fetch.bind(e.win))(d);async function i(d,f,r,c){let n=new URLSearchParams({url:d});f!==""&&n.set("alias",f);let p;try{p=await t(`https://tinyurl.com/api-create.php?${n}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(p.status===400)return o("Erro: Nenhuma link gerado"),!1;if(p.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let b=(await p.text()).trim();if(p.status!==200||!ut.test(b))return o("Erro: Nenhuma link gerado"),!1;if(r==="setinput")return e.win.setInputTinyUrl?.(b),!0;let a=c??e.adaptador.getInstance();if(!a)return!1;let u=`<a href="${_(b)}" class="ancoraSei" target="_blank">${_(b)}</a>`;return e.adaptador.withEdit(a,()=>e.adaptador.insertHtml(a,u)),!0}function s(d){let f=e.adaptador.getInstance(d);if(!f)return;let r=h("input",{type:"text",id:"urlTiny"}),c=h("input",{type:"text",id:"aliasTiny"}),n=h("div",{id:"tinyResult"}),p=String(e.win.getSelection?.()??"").trim();p!==""&&$(p)&&(r.value=p),c.addEventListener("input",()=>{n.replaceChildren();let a=c.value;a!==""&&(go.test(a)?n.append(`Resultado: https://tinyurl.com/${a}`):n.append(h("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let b=T(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:R(q("Insira o link que deseja encurtar:",r),q("Insira um Nome Personalizado para o link (opcional):",c),n,h("div",{class:"spro-dialogo-rodape"},h("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let a=r.value.trim(),u=c.value.trim();if(a===""||!$(a))return o("Digite um link v\xE1lido!");if(u!==""&&!go.test(u))return o(pt);if(u!==""&&u.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await i(a,u,"insert",f)&&b.fechar()}},"Inserir")))})}return{getTinyUrl:s,ajaxTinyUrl:(d,f,r)=>i(d,f,r)}}};var le=[Ue,ro,co,$e,Ie,Ee,Fe,uo,so,Be,ho,We,He,to,bo];function xo(e,o,t){let i=e,s=[],l=[];for(let d of o){let f=!0;try{for(let[r,c]of Object.entries(d.globais(t))){if(i[r]!==void 0){f=!1,l.push({id:d.id,erro:new Error(`global ja definido: ${r}`)});continue}i[r]=c}}catch(r){f=!1,l.push({id:d.id,erro:r})}f&&s.push(d.id);try{i.SeiProEditorAdapter?.registerFeature?.({id:d.id})}catch{}}return{instalados:s,falhas:l}}function vo(e,o){let t=[];for(let i of e)try{i.iniciar?.(o)}catch(s){t.push({id:i.id,erro:s})}return t}var yo=`/*
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
`;Y(yo);var ko="__seiProEditorTs",Eo=window;if(!Eo[ko]){Eo[ko]=!0;let e=ue(window);e.aoRecusarEscrita(()=>w(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(me)??"",checkOpcao:t=>xe(t),verifyOpcao:t=>ve(t)};for(let t of xo(window,le,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of vo(le,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
