/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function N(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,i=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(i.body.childNodes).map(s=>e.importNode(s,!0))}function B(e,o){if(!e||typeof o!="function")return;let t=e,i=t.__seiProCtxBuilders;if(!i){let s=[];i=t.__seiProCtxBuilders=s,e.addEventListener("contextmenu",l=>{let c=l;if(c.shiftKey)return;let f=[];for(let n of s)try{f=f.concat(n(c.target)||[])}catch{}f.length&&(c.preventDefault(),fo(e.ownerDocument,f,c.clientX,c.clientY))})}i.includes(o)||i.push(o)}function fo(e,o,t,i){e.getElementById("seiProCtxMenu")?.remove();let s=e.createElement("div");s.id="seiProCtxMenu",s.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",s.style.left=`${t}px`,s.style.top=`${i}px`;for(let c of o){let f=e.createElement("div");f.textContent=c.label,f.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",f.addEventListener("mouseenter",()=>{f.style.background="#eef"}),f.addEventListener("mouseleave",()=>{f.style.background=""}),f.addEventListener("click",()=>{s.remove(),c.action()}),s.append(f)}e.body.append(s);let l=()=>{s.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function re(e,o,t){if(typeof t!="function")return;let i=e.__seiProCtx;if(!i){let s={acoes:{},construtores:[]};i=e.__seiProCtx=s;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let c=l?.$??null,f=null;for(let n of s.construtores){let u=[];try{u=n(c)||[]}catch{u=[]}for(let a of u){let d=`seiPro_${String(a.label).replace(/[^A-Za-z0-9]/g,"_")}`;s.acoes[d]=a.action,e.getCommand(d)||e.addCommand(d,{exec:()=>(s.acoes[d]?.(),!0)}),e.getMenuItem(d)||e.addMenuItem(d,{label:a.label,command:d,group:"seiProGroup"}),f=f??{},f[d]=o}}return f})}i.construtores.includes(t)||i.construtores.push(t)}var k=e=>e;function ne(e,o={}){let t=()=>e.CKEDITOR,i=n=>!!n?.name&&t()?.instances[n.name]===n,s=n=>i(n)&&!n.readOnly,l=n=>k(n).document?.getBody()?.$??null,c=(n,u)=>{if(!n)return;let a=k(n);if(a.readOnly){o.fn?.();return}u(a)},f={versao:4,getInstance(n){let u=t();if(!u?.instances)return null;if(i(u.currentInstance))return u.currentInstance;let a=n?.closest?.("div.cke"),d=a?u.instances[a.id.replace("cke_","")]:void 0;if(s(d))return d;if(s(e.oEditor))return e.oEditor;let g=Object.values(u.instances);return g.find(r=>s(r))??g[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>k(n).focus(),saveSnapshot:n=>k(n).fire("saveSnapshot"),withEdit(n,u){let a=k(n);a.focus(),a.fire("saveSnapshot"),a.fire("lockSnapshot",{dontUpdate:!0});try{u()}finally{a.fire("unlockSnapshot"),a.fire("saveSnapshot")}},insertHtml:(n,u)=>c(n,a=>a.insertHtml(u)),insertText:(n,u)=>c(n,a=>a.insertText(u)),getSelectionElement:n=>k(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return f.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,u,a){c(n,()=>u.before(...N(u.ownerDocument,a)))},getToolbarContainer:n=>k(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>l(n),findInBody(n,u){let a=l(n);return a?Array.from(a.querySelectorAll(u)):[]},appendToBody(n,u){c(n,a=>{let d=l(a);d&&d.append(...N(d.ownerDocument,u))})},transformBodyHtml(n,u){c(n,a=>{let d=l(a);if(!d)return;let g=d.innerHTML,r=u(g);typeof r=="string"&&r!==g&&d.replaceChildren(...N(d.ownerDocument,r))})},execCommand:(n,u,a)=>k(n).execCommand(u,a),applyStyle(n,u){let a=t()?.style;a&&k(n).applyStyle(new a(u))},getData:n=>k(n).getData(),setData:(n,u)=>c(n,a=>a.setData(u)),insertElement(n,u){c(n,a=>{let d=t()?.dom?.element.createFromHtml;d&&a.insertElement?a.insertElement(d(u,a.document)):a.insertHtml(u)})},saveSelection:n=>k(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,u){let a=k(n).getSelection();a&&u&&a.selectBookmarks(u)},getSelectedText:n=>k(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return k(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,u,a)=>k(n).on(u,a),off:(n,u,a)=>k(n).removeListener(u,a),fire:(n,u,a)=>k(n).fire(u,a),addContextMenu(n,u){let a=k(n),d=t();if(d&&a.contextMenu&&typeof a.addMenuItem=="function"){re(a,d.TRISTATE_OFF,u);return}B(l(n),u)},waitReady(n){return new Promise((u,a)=>{let d=Date.now(),g=()=>{let r=Object.values(t()?.instances??{}).find(p=>p.status==="ready");if(r)return u(r);if(Date.now()-d>n)return a(new Error("Timeout aguardando CKEditor 4"));setTimeout(g,100)};g()})},somenteLeitura:n=>!!k(n).readOnly,aoRecusarEscrita(n){o.fn=n},recusarEscrita(){o.fn?.()}};return f}var x=e=>e,go={strike:"strikethrough",strikethrough:"strikethrough"},bo={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},ho=0;function ae(e,o={}){let t=e.document,i=r=>Array.from(r.model.document.roots??[]).filter(p=>p.isAttached()&&p.rootName!=="$graveyard"),s=r=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r],l=(r,p)=>{let m=r.editing.view.document.getRoot(p);return m?r.editing.view.domConverter.mapViewToDom(m):null},c=r=>{for(let b of i(r))if(s(b.rootName)?.principal){let h=l(r,b.rootName);if(h)return h}let p=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return p||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((b,h)=>h.childElementCount>(b?b.childElementCount:-1)?h:b,null)},f=r=>{let p=c(r);return p&&i(r).find(m=>l(r,m.rootName)===p)||null},n=r=>r.model.document.selection.getFirstPosition()?.root.rootName??null,u=r=>!!r&&!!s(r)?.somenteLeitura,a=(r,p)=>r.data.toModel(r.data.processor.toView(p)),d=(r,p)=>{let m=x(r);if(u(n(m)))return o.fn?.();m.model.change(()=>m.model.insertContent(a(m,p),m.model.document.selection))},g={versao:5,getInstance(){let r=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return r&&r.state==="ready"?r:null},getAllInstances(){let r=g.getInstance();return r?[r]:[]},focus:r=>x(r).focus(),saveSnapshot(){},withEdit(r,p){let m=x(r);m.focus(),m.model.change(()=>p())},insertHtml:d,insertText(r,p){let m=x(r);if(u(n(m)))return o.fn?.();m.model.change(b=>m.model.insertContent(b.createText(p)))},getSelectionElement(){let r=e.getSelection?.(),p=r&&r.rangeCount>0?r.anchorNode:null;return p?p.nodeType===1?p:p.parentElement:null},getSelectionParagraph:r=>g.getSelectionElement(r)?.closest("p")??null,insertHtmlBefore(r,p,m){let b=x(r),h=b.editing.view.domConverter.mapDomToView(p),y=h?b.editing.mapper.toModelElement(h):null;if(y){if(u(y.root?.rootName))return o.fn?.();b.model.change(w=>b.model.insertContent(a(b,m),w.createPositionBefore(y)));return}d(r,m)},getToolbarContainer(r){let p=x(r).ui?.view?.toolbar?.element;return p?p.querySelector(".ck-toolbar__items")??p:null},getBodyContainer:r=>c(x(r)),findInBody(r,p){let m=c(x(r));return m?Array.from(m.querySelectorAll(p)):[]},appendToBody(r,p){let m=x(r),b=f(m);if(!b)return d(r,p);if(u(b.rootName))return o.fn?.();m.model.change(h=>m.model.insertContent(a(m,p),h.createPositionAt(b,"end")))},transformBodyHtml(r,p){let m=x(r),b=f(m);if(!b)return;let h=m.data.get({rootName:b.rootName,seiProInterno:!0}),y=p(h);if(typeof y!="string"||y===h)return;let w=m.model.document.selection.getFirstRange(),A=w&&w.start.root.rootName===w.end.root.rootName?{raiz:w.start.root,ps:[...w.start.path],pe:[...w.end.path]}:null,I=m.model.document.selection.isBackward;m.data.set({[b.rootName]:y}),A&&m.model.change(S=>{let _,G;try{_=m.model.createPositionFromPath(A.raiz,A.ps),G=m.model.createPositionFromPath(A.raiz,A.pe)}catch{_=G=S.createPositionAt(A.raiz,"end")}S.setSelection(S.createRange(_,G),{backward:I})})},execCommand(r,p,m){x(r).execute(go[p]??p,m!==void 0?{value:m}:void 0)},applyStyle(r,p){let m=bo[p.element.toLowerCase()];m&&x(r).execute(m)},getData(r){let p=x(r),m=f(p);return m?p.data.get({rootName:m.rootName}):p.data.get()},setData(r,p){let m=x(r),b=f(m);b?m.data.set({[b.rootName]:p}):m.data.set(p)},insertElement:(r,p)=>g.insertHtml(r,p),saveSelection(r){let p=x(r),m=`spro-ed:${ho++}`;return p.model.change(b=>{let h=p.model.document.selection.getFirstRange();h&&b.addMarker(m,{range:h,usingOperation:!1})}),m},restoreSelection(r,p){let m=x(r);if(typeof p!="string")return;let b=m.model.markers.get(p);b&&m.model.change(h=>h.setSelection(b.getRange())),m.model.change(h=>{m.model.markers.has(p)&&h.removeMarker(p)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let r=e.getSelection?.();if(!r||r.rangeCount===0)return"";let p=t.createElement("div");return p.append(r.getRangeAt(0).cloneContents()),p.innerHTML},on(r,p,m){if(p==="change")return x(r).model.document.on("change:data",m);c(x(r))?.addEventListener(p,m)},off(r,p,m){if(p==="change")return x(r).model.document.off("change:data",m);c(x(r))?.removeEventListener(p,m)},fire(r,p,m){c(x(r))?.dispatchEvent(new CustomEvent(p,{detail:m}))},addContextMenu(r,p){B(c(x(r)),p)},waitReady(r){return new Promise((p,m)=>{let b=Date.now(),h=()=>{let y=g.getInstance();if(y)return p(y);if(Date.now()-b>r)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(h,100)};h()})},somenteLeitura:r=>u(n(x(r))),aoRecusarEscrita(r){o.fn=r},recusarEscrita(){o.fn?.()}};return g}function U(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function se(e){let o=null,t={},i=()=>{if(o)return o;let c=U(e);return c===5?o=ae(e,t):c===4&&(o=ne(e,t)),o},s=()=>{let c=i();if(!c)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return c},l=c=>((...f)=>s()[c](...f));return{get versao(){return i()?.versao??0},getInstance:c=>i()?.getInstance(c)??null,getAllInstances:()=>i()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(c){t.fn=c},recusarEscrita(){t.fn?.()},waitReady(c){let f=Date.now();return new Promise((n,u)=>{let a=()=>{let d=i();if(d)return d.waitReady(Math.max(1,c-(Date.now()-f))).then(n,u);if(Date.now()-f>c)return u(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(a,100)};a()})}}}var ie="data-base";function le(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(s=>s?.configGeral).find(Array.isArray)?.find(s=>s?.name===o)?.value}function ce(e,o){let t=le(e,o);return!(t===!1||t===0||t==="")}function de(e,o){let t=le(e,o);return t===!0||t===1||t==="1"}function ue(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function pe(e,o=localStorage){return ce(ue(o),e)}function me(e,o=localStorage){return de(ue(o),e)}function $(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function Q(e){e.style.display="none"}var fe=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function ge(e){let o=()=>e.adaptador.versao===5,t=(i,s)=>{let l=i.editing.view.domConverter.mapDomToView(s);return l?i.editing.mapper.toModelElement(l):null};return{selecionados(i){let s=()=>{let r=e.adaptador.getSelectionParagraph(i);return r?[r]:[]};if(o()){let r=i,m=[...r.model.document.selection.getSelectedBlocks()].map(b=>{let h=r.editing.mapper.toViewElement(b);return h?r.editing.view.domConverter.mapViewToDom(h):null}).filter(b=>!!b&&b.tagName==="P");return m.length?m:s()}let c=e.adaptador.getBodyContainer(i)?.ownerDocument?.getSelection?.();if(!c||c.rangeCount===0||!c.anchorNode)return s();let f=fe(c.anchorNode),n=fe(c.focusNode);if(!f&&!n||(f=f??n,n=n??f,!f||!n))return s();if(f===n)return[f];let u=f,a=n;f.compareDocumentPosition(n)&2&&(u=n,a=f);let d=[],g=u;for(let r=0;g&&r<5e3&&(g.tagName.toLowerCase()==="p"&&d.push(g),g!==a);r+=1)g=g.nextElementSibling;return d.length?d:[u]},classeDeEstilo(i,s){return o()?t(i,s)?.getAttribute("estilo")??"":s.getAttribute("class")??""},definirClasse(i,s,l){if(o()){let c=i,f=t(c,s);f&&c.model.change(n=>n.setAttribute("estilo",l,f)),e.win.SeiProGhs?.setEstilos(s,{"text-align":null},i);return}s.removeAttribute("style"),s.setAttribute("class",l)},definirTextAlign(i,s,l){if(o()){e.win.SeiProGhs?.setEstilos(s,{"text-align":l},i);return}s.removeAttribute("style"),s.style.textAlign=l}}}var vo=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function xo(e,o){let t=vo.find(i=>Object.values(i).includes(e));return t?t[o]:null}function yo(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let i=e?.parentElement??null;i;i=i.parentElement){let s=i.querySelector(".divAlignText");if(s)return s}return o.querySelector(".divAlignText")}var be={id:"align",globais(e){let o=ge(e);return{setAlignText(t,i){let s=e.adaptador.getInstance(t);if(!s||e.adaptador.somenteLeitura(s))return;let l=o.selecionados(s);l.length&&e.adaptador.withEdit(s,()=>{for(let c of l){let f=xo(o.classeDeEstilo(s,c),i);f?o.definirClasse(s,c,f):o.definirTextAlign(s,c,i)}})},openAlignText(t){if(!t)return;let i=yo(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),i&&Q(i)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),i&&$(i))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function v(e,o={},...t){let i=document.createElement(e);for(let[s,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?i.addEventListener(s.replace(/^on/,""),l):l===!0?i.setAttribute(s,""):s==="class"?i.className=l:s==="value"&&e==="textarea"?i.value=l:i.setAttribute(s,l));for(let s of t)s!=null&&s!==!1&&i.append(s);return i}var M={fill:"currentColor",stroke:"none"},he="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",ve={estrela:[["path",{d:he}]],estrelaCheia:[["path",{d:he,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...M}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...M}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...M}],["circle",{cx:"12",cy:"12",r:"1.4",...M}],["circle",{cx:"19",cy:"12",r:"1.4",...M}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...M}],["circle",{cx:"15",cy:"6",r:"1.3",...M}],["circle",{cx:"9",cy:"12",r:"1.3",...M}],["circle",{cx:"15",cy:"12",r:"1.3",...M}],["circle",{cx:"9",cy:"18",r:"1.3",...M}],["circle",{cx:"15",cy:"18",r:"1.3",...M}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Et=Object.keys(ve);function P(e,o=18,t=document){let i="http://www.w3.org/2000/svg",s=t.createElementNS(i,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[c,f]of Object.entries(l))s.setAttribute(c,f);for(let[c,f]of ve[e]){let n=t.createElementNS(i,c);for(let[u,a]of Object.entries(f))n.setAttribute(u,a);s.append(n)}return s}function ko(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function xe(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function ye(e,o,t,i,s){let l=e.body??e.documentElement;for(let d of[l,...e.querySelectorAll("dialog")])for(let g of[...d.children])g.classList.contains("spro-aviso")&&g.remove();let c=v("div",{class:"spro-aviso",role:"status"},P("check",16),v("span",{},o),...ko(t).map(d=>v("button",{type:"button",onclick:()=>{c.remove(),d.fazer()}},d.rotulo)));c.setAttribute("popover","manual");let f=()=>{try{c.showPopover?.()}catch{}},n=Date.now()+i,u=()=>{let d=xe(e);d.append(c),f(),d.localName==="dialog"&&d.addEventListener("close",()=>{if(!(!a||!d.contains(c))){if(s&&xe(e).localName!=="dialog"&&s(o,t,Math.max(0,n-Date.now()))){a=!1,c.remove();return}u()}},{once:!0})},a=!0;return u(),setTimeout(()=>{a=!1,c.remove()},i),c}var wo=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function ke(e={}){return({titulo:o,conteudo:t,icone:i,aoFechar:s})=>{let l=v("dialog",{class:"spro-dialogo","aria-label":o}),c=()=>{l.open&&l.close()};return l.append(v("header",{},i?v("span",{class:"spro-dialogo-icone","aria-hidden":"true"},P(i,18)):null,v("h2",{},o),v("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:c},P("fechar",16))),v("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),s?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(wo)?.focus({preventScroll:!0}),{fechar:c}}}function we(e){let o=ke();return(t,i)=>(K(t,e),o(i))}function K(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var J="";function W(e){J=e}var q=(e,o)=>we(J)(e,o);function Ee(e){K(e,J)}function E(e,o){Ee(e),ye(e,o,void 0,7e3)}var Eo=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),Ce=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Co(e){let o=0,t=e.split("");return t.forEach((i,s)=>{let l=Ce.get(i),c=Ce.get(t[s+1]);o+=l<c?-l:l}),o}function Me(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Eo.has(o.toLowerCase())&&t!==0?o.toLowerCase():Co(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function T(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var Ae={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let i=e.adaptador.getSelectedText(t);if(!i||i.trim()===""){E(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,T(Me(i)))}})};var Se="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Te(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let i of o)t+=Se[i%Se.length];return t}var Mo=()=>`<span class="ancoraSei checkboxSEI" data-id="${Te(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,Le={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Mo()))}})};var X="copyStylePro",Y="cke_copyformatting_active",_e=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function Ao(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),i=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&i?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var qe={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,i=()=>{try{return JSON.parse(t().getItem(X)??"null")}catch{return null}},s=a=>o.getSelectedHtml(a).trim()!==""||o.getSelectedText(a).trim()!=="",l=a=>!!o.getBodyContainer(a)?.classList.contains(Y),c=a=>{for(let d of e.doc.querySelectorAll(".getCopyStyleButtom"))a==="desabilitar"?d.classList.add("cke_button_disabled"):a==="habilitar"?d.classList.remove("cke_button_disabled"):(d.classList.toggle("cke_button_on",a),d.classList.toggle("cke_button_off",!a))};function f(){let a=o.getInstance();a&&o.getBodyContainer(a)?.classList.remove(Y),t().removeItem(X),c(!1)}function n(a){let d=a??o.getInstance();if(!d)return;if(l(d)){f();return}let g=o.getSelectionElement(d);g&&(t().setItem(X,JSON.stringify(Ao(g))),o.getBodyContainer(d)?.classList.add(Y),c(!0))}function u(){let a=o.getInstance();if(!a)return;let d=s(a),g=l(a);c(d||g?"habilitar":"desabilitar");let r=i();if(!(r&&d&&g))return;o.withEdit(a,()=>{o.execCommand(a,"removeFormat");for(let[b,h]of[[r.bold,"bold"],[r.underline,"underline"],[r.italic,"italic"],[r.strike,"strike"],[r.subscript,"subscript"],[r.superscript,"superscript"]])b===!0&&o.execCommand(a,h);let m=[];if(typeof r.backgroundColor=="string"&&_e.test(r.backgroundColor)&&m.push(`background-color: ${r.backgroundColor}`),typeof r.fontSize=="number"&&Number.isFinite(r.fontSize)&&r.fontSize>0&&r.fontSize<400&&m.push(`font-size: ${r.fontSize}px`),typeof r.color=="string"&&_e.test(r.color)&&m.push(`color: ${r.color}`),m.length){let b=o.getSelectedHtml(a);b!==""&&o.insertHtml(a,`<span style="${m.join("; ")}">${b}</span>`)}}),!!e.win.event?.altKey||f()}return{setCopyStyle(a){let d=o.getInstance(a);d&&n(d)},actionCopyStyle:n,getCopyStyle:i,applyCopyStyle:u,removeCopyStyle:f,menuCopyStyle(a){a&&o.addContextMenu(a,d=>o.versao===5?[]:d?.closest("p")&&s(a)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(a)}]:[])}}}};var Z="spro_editor_folha",Ie="seipro-folha-editor",ee="data-spro-folha-editor",So=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function To(e){let o=`html[${ee}]`,t=e?"#141619":"#f3f4f7",i=e?"#2a2d33":"#e3e6ee",s="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${s}, -14px 0 24px -14px ${s}`,c=`0 14px 24px -14px ${s}`,f=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${f} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${i}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${f}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${f}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${c}; clip-path: inset(0 -30px -30px); }
${f}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${f} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${i} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function Re(e,o){if(!e.head||(e.querySelector(`style[data-style="${Ie}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",Ie),t.textContent=o,e.head.append(t)}function De(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[i,s]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),i&&e.style.setProperty("background-color",i,s||"")}}var He={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(Z),i=()=>!!e.win.localStorage?.getItem("darkModePro"),s=!1;function l(n){for(let u of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let a=u.contentDocument;a?.head&&(Re(a,n?So:null),De(a.documentElement,n),De(a.body,n))}}function c(n){let u=[...o.querySelectorAll(".cke_contents")];u.forEach((a,d)=>{if(!n){a.removeAttribute("data-spro-folha");return}let g=[d===0?"primeira":"",d===u.length-1?"ultima":""].filter(Boolean);a.setAttribute("data-spro-folha",g.join(" ")||"meio")})}function f(n){Re(o,n?To(i()):null),l(n),c(n),n?o.documentElement.setAttribute(ee,""):o.documentElement.removeAttribute(ee);for(let u of o.querySelectorAll(".getPaperViewButtom"))u.classList.toggle("cke_button_on",n),u.classList.toggle("cke_button_off",!n),u.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:f,getPaperViewButtom(n){let u=!t();u?e.win.localStorage.setItem(Z,"1"):e.win.localStorage.removeItem(Z),f(u)},initFolhaEditorPro(){let n=e.win.CKEDITOR;if(typeof n?.on=="function"&&!s){s=!0;let u=a=>a.on("contentDom",()=>t()&&l(!0));for(let a of Object.values(n.instances??{}))u(a);n.on("instanceReady",a=>u(a.editor))}f(t())}}}};function Lo(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var Pe={id:"font-size",globais:e=>({changeFontSize(o,t){let i=e.adaptador.getInstance(o);if(!i)return;let s=e.adaptador.getSelectedHtml(i);if(!s||s.trim()===""){E(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=Lo(e.adaptador.getSelectionElement(i)),c=t==="up"?l+2:l-2;c>7&&c<70&&e.adaptador.withEdit(i,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(i,{element:"span",attributes:{style:`font-size: ${c}px`}}):e.adaptador.insertHtml(i,`<span style="font-size: ${c}px">${s}</span>`)})}})};var F=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,_o=[{name:F,attributes:!0},{name:F,classes:!0},{name:F,styles:!0}],O=e=>e.split("").join("[\\t\\n\\r]*"),oe=new RegExp(`^[\\s\\x00-\\x20]*(${O("javascript")}|${O("vbscript")}|${O("livescript")}|${O("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${O("text/html")})`,"i"),qo=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:oe}]}];function R(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function z(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var Io=e=>!!(e?.model&&e.editing&&e.conversion),Ro=e=>z(e,"EstiloEditing")?.estilos??{},Oe=(e,o)=>Object.hasOwn(e,o);function Be(e,o){let t=z(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function Do(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function Ho(e,o,t){if(!o?.is?.("element"))return;let i=t.mapper.toViewElement(o);if(!i)return;let s=Ro(e),l=o.getAttribute("estilo"),c=Do(o,Be(e,"p")),f=t.writer,n=[];try{n=Array.from(i.getClassNames())}catch{}for(let u of n)u!==l&&Oe(s,u)&&f.removeClass(u,i);for(let u of c)Oe(s,u)||f.addClass(u,i);l&&f.addClass(l,i)}function Po(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Be(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let i of o)t.on(i,(s,l,c)=>{try{Ho(e,l.item,c)}catch{}},{priority:"lowest"})})}function Oo(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function ze(e,o){let t=z(o,"Salvar"),i=t?!!t.isDirty:!1;try{e()}finally{if(t&&!i)try{t.resetDirty()}catch{}}}function zo(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function No(e,o){let t=e.getFullData({seiProInterno:!0}),i=o.INFRA_EDITOR_CONFIG?.initialData;return!i||typeof i!="object"||zo(e)?t:Object.fromEntries(Object.keys(t).map(s=>[s,typeof i[s]=="string"?i[s]:t[s]]))}function Bo(e,o,t){try{let i=t??e.adaptador.getSelectionParagraph(o);if(!i)return null;if(typeof i.is=="function"&&i.is("element"))return i;let s=i.jquery?i.get(0):i;if(s?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(s);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function $o(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function Ne(e){let o=l=>l??e.adaptador.getInstance();function t(l){let c=o(l);if(!Io(c))return!1;if(c.__seiProGhsLiberado)return!0;let f=z(c,"DataFilter");if(!f)return R("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{f.allowElement({name:F,attributes:!0,classes:!0,styles:!0});for(let n of _o)f.allowAttributes(n);if(typeof f.disallowAttributes=="function")for(let n of qo)f.disallowAttributes(n)}catch(n){return R("falha ao liberar o GHS",n),!1}return c.__seiProGhsLiberado=!0,Po(c),!0}function i(l){let c=o(l);if(!t(c)||typeof c.getFullData!="function")return!1;let f=!0;return ze(()=>{try{c.data.set(No(c,e.win))}catch(n){R("falha ao reprocessar o conteudo",n),f=!1}},c),f}function s(l,c,f){let n=o(l);if(!t(n))return!1;let u=z(n,"GeneralHtmlSupport"),a=Bo(e,n,c),d=a?$o(n,a):null;if(!u||!a||!d)return!1;try{return f(u,d,a),!0}catch(g){return R("falha ao aplicar no model",g),!1}}return{liberar:t,aplicarRegras:i,semSujar:(l,c)=>ze(l,o(c)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,c,f)=>s(f,l,(n,u,a)=>n.addModelHtmlClass(u,c,a)),removeClasse:(l,c,f)=>s(f,l,(n,u,a)=>n.removeModelHtmlClass(u,c,a)),setEstilos:(l,c,f)=>s(f,l,(n,u,a)=>n.setModelHtmlStyles(u,c,a)),setAtributos:(l,c,f)=>s(f,l,(n,u,a)=>n.setModelHtmlAttributes(u,c,a))}}var $e={id:"ghs-unlock",globais:e=>({SeiProGhs:Ne(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=Ne(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||Oo(t)){R("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&R("classes, estilos e atributos liberados no editor")}}};function D(...e){return v("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function L(e,o){return o.classList.add("spro-campo"),o.style.width="100%",v("label",{style:"display:grid;gap:4px;font-size:13px;"},v("span",{},e),o)}function Qe(e,o){return new Promise((t,i)=>{let s=new e.Image;s.crossOrigin="anonymous",s.onload=()=>{try{let l=e.document.createElement("canvas");l.width=s.width,l.height=s.height,l.getContext("2d")?.drawImage(s,0,0),t(l.toDataURL("image/png"))}catch(l){i(l)}},s.onerror=()=>i(new Error("imagem nao carregou")),s.src=o})}var Qo="https://latex.codecogs.com/png.latex?",Fo="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",jo="https://editor.codecogs.com/",Fe={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(n=>Qe(e.win,n)),i=n=>E(e.doc,n);function s(){let n=o;if(!n)return;let u=n.texto.value;n.geracao+=1;let a=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,u==="")return;let d=v("img",{src:`${Qo}${encodeURI(u)}`});n.previa.append(d),t(d.getAttribute("src")??"").then(g=>{o!==n||n.geracao!==a||(d.setAttribute("src",g),d.className="img-base64",n.pronta=!0)},()=>{o===n&&n.geracao===a&&(n.falhou=!0)})}function l(){let n=o;if(!n)return!1;let u=n.texto.value;if(u==="")return i("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return i("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let a=n.previa.querySelector("img");if(!n.pronta||!a)return i("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let d=n.ed,g=`<img class="img-base64" src="${T(a.getAttribute("src")??"")}" alt="${T(u)}">`;return e.adaptador.withEdit(d,()=>e.adaptador.insertHtml(d,g)),!0}function c(n){let u=e.adaptador.getInstance(n);if(!u)return;let a=v("textarea",{id:"MathText",rows:"5"});a.addEventListener("input",s);let d=v("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),g=q(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:D(L("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",a),d,v("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",v("a",{href:Fo,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",v("a",{href:jo,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),v("div",{class:"spro-dialogo-rodape"},v("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&g.fechar()}},"Inserir")))});o={ed:u,texto:a,previa:d,geracao:0,pronta:!1,falhou:!1};let r=String(e.win.getSelection?.()??"").trim();r!==""&&(a.value=r,s())}function f(){}return{updatePreviewLatex:s,openDialogLatex:c,getDialogLatex:f}}};function je(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(i=>t.getBodyContainer(i)?.ownerDocument===o.ownerDocument)??t.getInstance()}function Ve(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function j(e,o,t,i){let s=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[i?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return s&&e.adaptador.recusarEscrita(),s}function Ge(e,o){let t=je(e,o);if(!t)return!1;if(e.adaptador.versao===5){let i=t,s=Ve(i,o);return!s||j(e,t,o,s)?!1:(i.model.change(l=>l.setSelection(s)),i.execute("unlink"),!0)}return j(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Ue(e,o,t,i){let s=je(e,o);if(!s)return!1;if(e.adaptador.versao===5){let l=s,c=Ve(l,o);return!c||j(e,s,o,c)?!1:(l.model.change(f=>{f.setSelection(c),l.model.insertContent(f.createText(t,{linkHref:i}))}),!0)}return j(e,s,o,null)?!1:(e.adaptador.withEdit(s,()=>{o.setAttribute("href",i),o.setAttribute("data-cke-saved-href",i),o.textContent=t}),!0)}function H(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var Vo="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Ke=new WeakMap,Go=e=>{let o=Ke.get(e);if(o)return o;let t={balao:null};return Ke.set(e,t),t},Uo=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function Je(e){let o=Go(e),t=r=>E(e.doc,r);function i(r){let p=o.balao;if(p){if(!r){let m=!1;try{m=p.el.matches(":hover")}catch{m=!1}if(m)return}p.el.remove(),o.balao=null}}function s(){if(o.balao)return o.balao.link;let r=e.adaptador.getInstance();return(r?e.adaptador.getSelectionElement(r):null)?.closest("a[href]")??null}async function l(r){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(r),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function c(r,p){i(!0);let m=r?.closest?.("a[href]"),b=m?.getAttribute("href")??"";if(!m||!H(b))return;let h=v("a",{href:b,target:"_blank",rel:"noopener noreferrer",title:m.textContent??"",style:"color:inherit;text-decoration:underline;"},v("strong",{},Uo(b))),y=(I,S,_)=>v("button",{type:"button",class:I,title:S,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:_},S),w=v("div",{class:"linkDisplayPro",style:Vo},h,y("spro-copiar","Copiar",()=>void l(b)),y("spro-editar","Editar",()=>a()),y("spro-remover","Remover",()=>f()));e.doc.body.append(w),o.balao={el:w,link:m};let A=m.getBoundingClientRect?.();if(A){let I=m.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),S=w.getBoundingClientRect?.().width??0,_=Math.max(8,Math.min(A.left+(I?.left??0),(e.win.innerWidth||0)-S-8));w.style.left=`${_}px`,w.style.top=`${A.bottom+(I?.top??0)+4}px`}}function f(r,p){let m=s();m&&(Ge(e,m),i(!0))}function n(r,p){let m=s()?.getAttribute("href");m&&H(m)&&e.win.open(m,"_blank","noopener,noreferrer")}function u(r,p){let m=s()?.getAttribute("href");m&&l(m)}function a(){let r=s();if(!r)return;let p=v("input",{type:"text",id:"linkProNome"}),m=v("input",{type:"text",id:"linkProUrl"});p.value=r.textContent??"",m.value=r.getAttribute("href")??"";let b=q(e.doc,{titulo:"Editar link",conteudo:D(L("Texto vis\xEDvel:",p),L("URL:",m),v("div",{class:"spro-dialogo-rodape"},v("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=m.value.trim(),y=p.value.trim()||h;if(h==="")return t("Digite um link");if(oe.test(h))return t("O link informado \xE9 inv\xE1lido.");Ue(e,r,y,h)&&(i(!0),b.fechar())}},"Salvar")))})}function d(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",r=>{let p=r.target;if(!p||o.balao?.el.contains(p))return;let m=p.closest?.("a[href]");m&&p.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?c(m):i(!1)},!0)}return{globais:{showLinkTips:c,hideLinkTips:r=>i(!1),openLinkPro:n,removeLinkPro:f,copyLinkPro:u,editLinkPro:r=>a(),openDialogLinkPro:a,getDialogLinkPro:()=>{}},iniciar:d}}var We={id:"link-pro",globais:e=>Je(e).globais,iniciar:e=>Je(e).iniciar()};function V(e,o,t,i){let s=e.adaptador.getInstance(o);if(!s)return;let l=e.adaptador.getSelectionParagraph(s);l&&e.adaptador.withEdit(s,()=>{e.adaptador.insertHtmlBefore(s,l,t),i?.(s,l)})}var Ko='<div class="pageBreakPro" style="page-break-after: always"></div>',Xe={id:"page-break",globais:e=>({getPageBreak:o=>V(e,o,Ko)})};var Ye=5,Ze=5,eo=49,C=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function Jo(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let i=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(i)return i;for(let s=e?.previousElementSibling??null;s;s=s.previousElementSibling)if(s.classList.contains("divQuickTable"))return s;return o.querySelector(".divQuickTable")}var oo={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let a of e.doc.querySelectorAll(".divQuickTable"))a.replaceChildren(),Q(a);for(let a of e.doc.querySelectorAll(".getQuickTableButtom"))a.classList.add("cke_button_off"),a.classList.remove("cke_button_on")}function i(a){if(!a)return;let d=C(a,"data-row"),g=C(a,"data-col"),r=a.closest("table");if(!r)return;for(let b of r.querySelectorAll("td"))b.classList.remove("td_hover");let p=()=>[...r.querySelectorAll("tr")];if(d>=3&&C(p().at(-1)?.querySelector("td"),"data-row")>d+1&&(p().at(-1)?.remove(),r.setAttribute("data-row",String(C(r,"data-row")-1))),g>=3&&C(p().at(-1)?.lastElementChild,"data-col")>g+1){for(let b of p())b.lastElementChild?.remove();r.setAttribute("data-col",String(C(r,"data-col")-1))}for(let b of r.querySelectorAll("td"))C(b,"data-row")<=d&&C(b,"data-col")<=g&&b.classList.add("td_hover");let m=a.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(m&&(m.textContent=`Tabela ${d+1}x${g+1}`),d===C(r,"data-row")&&d<eo){let b=p().at(-1)?.cloneNode(!0);b&&(b.querySelectorAll("td").forEach((h,y)=>{h.setAttribute("data-row",String(d+1)),h.setAttribute("data-col",String(y)),h.classList.remove("td_hover")}),(r.querySelector("tbody")??r).append(b),r.setAttribute("data-row",String(d+1)))}if(g===C(r,"data-col")&&g<eo){for(let b of p()){let h=b.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(g+1)),h.classList.remove("td_hover"),b.append(h))}r.setAttribute("data-col",String(g+1))}}function s(){let a=e.doc,d=a.createDocumentFragment(),g=a.createElement("div");g.className="quickTableInfo",g.textContent="Inserir Tabela";let r=a.createElement("table");r.setAttribute("data-row",String(Ye-1)),r.setAttribute("data-col",String(Ze-1));for(let m=0;m<Ye;m+=1){let b=a.createElement("tr");for(let h=0;h<Ze;h+=1){let y=a.createElement("td");y.setAttribute("data-row",String(m)),y.setAttribute("data-col",String(h)),b.append(y)}r.append(b)}let p=m=>i(m.target?.closest("td")??null);return r.addEventListener("mouseover",p),r.addEventListener("mouseout",p),r.addEventListener("click",m=>{let b=m.target?.closest("td");b&&u(b)}),d.append(g,r),d}function l(a){if(!a)return;let d=Jo(a,e.doc);a.classList.contains("cke_button_on")?(t(),a.classList.add("cke_button_off"),a.classList.remove("cke_button_on")):(d&&(d.replaceChildren(s()),$(d)),a.classList.remove("cke_button_off"),a.classList.add("cke_button_on"))}function c(a){let d=a?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),g=d?[...d.querySelectorAll(".getTablestylesButtom")]:[];g.length||(g=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let r of g)r.classList.remove("cke_button_disabled")}function f(a,d){let g='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';g+="  <tbody>";for(let r=0;r<=a;r+=1){g+="      <tr>";for(let p=0;p<=d;p+=1)g+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';g+="      </tr>"}return`${g}  </tbody></table>`}function n(a,d){let g=d?d.nextElementSibling:o.getBodyContainer(a)?.lastElementChild,r=g?.tagName==="TABLE"?g.querySelector("td p"):null;if(!r)return;let p=r.ownerDocument,m=p.defaultView?.getSelection?.();if(!m)return;let b=p.createRange();b.setStart(r.firstChild??r,0),b.collapse(!0),m.removeAllRanges(),m.addRange(b)}function u(a){let d=o.getInstance(a);if(!d){t();return}let g=f(C(a,"data-row"),C(a,"data-col")),r=o.getSelectionParagraph(d);o.withEdit(d,()=>{if(!r)return o.insertHtml(d,g);let p=r.nextElementSibling;p?o.insertHtmlBefore(d,p,g):o.appendToBody(d,g)}),t(),c(a),n(d,r)}return{getQuickTable:l,quickTableOver:i,hideQuickTable:t,quickTableClick:u}}};function to(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}var Wo='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Xo="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",ro={id:"session-break",globais:e=>({getSessionBreak:o=>V(e,o,Wo,(t,i)=>{if(e.adaptador.versao!==5)return;let s=t,l=s.plugins?.has("GeneralHtmlSupport")?s.plugins.get("GeneralHtmlSupport"):null,c=to(s,i)?.previousSibling;l&&c?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":Xo},c)})})};var no=["seiSlim","seiSlim_parent","seiSlim_view"],ao={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=s=>{for(let l of o())l.classList.add(s?"cke_button_on":"cke_button_off"),l.classList.remove(s?"cke_button_off":"cke_button_on")};function i(s){if(s==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...no)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...no)}return{getBoxStyleEditor(s){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),i("remove")):(t(!0),i("set"))},updateStyleEditor:i}}};var so=/^[0-9A-Za-z-]+$/,Yo="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Zo=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,io={id:"tiny-url",globais(e){let o=c=>E(e.doc,c),t=c=>(e.fetch??e.win.fetch.bind(e.win))(c);async function i(c,f,n,u){let a=new URLSearchParams({url:c});f!==""&&a.set("alias",f);let d;try{d=await t(`https://tinyurl.com/api-create.php?${a}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(d.status===400)return o("Erro: Nenhuma link gerado"),!1;if(d.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let g=(await d.text()).trim();if(d.status!==200||!Zo.test(g))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(g),!0;let r=u??e.adaptador.getInstance();if(!r)return!1;let p=`<a href="${T(g)}" class="ancoraSei" target="_blank">${T(g)}</a>`;return e.adaptador.withEdit(r,()=>e.adaptador.insertHtml(r,p)),!0}function s(c){let f=e.adaptador.getInstance(c);if(!f)return;let n=v("input",{type:"text",id:"urlTiny"}),u=v("input",{type:"text",id:"aliasTiny"}),a=v("div",{id:"tinyResult"}),d=String(e.win.getSelection?.()??"").trim();d!==""&&H(d)&&(n.value=d),u.addEventListener("input",()=>{a.replaceChildren();let r=u.value;r!==""&&(so.test(r)?a.append(`Resultado: https://tinyurl.com/${r}`):a.append(v("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let g=q(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:D(L("Insira o link que deseja encurtar:",n),L("Insira um Nome Personalizado para o link (opcional):",u),a,v("div",{class:"spro-dialogo-rodape"},v("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let r=n.value.trim(),p=u.value.trim();if(r===""||!H(r))return o("Digite um link v\xE1lido!");if(p!==""&&!so.test(p))return o(Yo);if(p!==""&&p.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await i(r,p,"insert",f)&&g.fechar()}},"Inserir")))})}return{getTinyUrl:s,ajaxTinyUrl:(c,f,n)=>i(c,f,n)}}};var te=[$e,Xe,ro,Le,Ae,be,Pe,ao,oo,He,io,Fe,qe,We];function lo(e,o,t){let i=e,s=[],l=[];for(let c of o){let f=!0;try{for(let[n,u]of Object.entries(c.globais(t))){if(i[n]!==void 0){f=!1,l.push({id:c.id,erro:new Error(`global ja definido: ${n}`)});continue}i[n]=u}}catch(n){f=!1,l.push({id:c.id,erro:n})}f&&s.push(c.id);try{i.SeiProEditorAdapter?.registerFeature?.({id:c.id})}catch{}}return{instalados:s,falhas:l}}function co(e,o){let t=[];for(let i of e)try{i.iniciar?.(o)}catch(s){t.push({id:i.id,erro:s})}return t}var uo=`/*
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
`;W(uo);var po="__seiProEditorTs",mo=window;if(!mo[po]){mo[po]=!0;let e=se(window);e.aoRecusarEscrita(()=>E(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(ie)??"",checkOpcao:t=>pe(t),verifyOpcao:t=>me(t)};for(let t of lo(window,te,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of co(te,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
