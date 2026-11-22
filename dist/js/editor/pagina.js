/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function F(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(a=>e.importNode(a,!0))}function ae(e,o){if(!e||typeof o!="function")return;let t=e,r=t.__seiProCtxBuilders;if(!r){let a=[];r=t.__seiProCtxBuilders=a,e.addEventListener("contextmenu",l=>{let d=l;if(d.shiftKey)return;let p=[];for(let n of a)try{p=p.concat(n(d.target)||[])}catch{}p.length&&(d.preventDefault(),bt(e.ownerDocument,p,d.clientX,d.clientY))})}r.includes(o)||r.push(o)}function bt(e,o,t,r){e.getElementById("seiProCtxMenu")?.remove();let a=e.createElement("div");a.id="seiProCtxMenu",a.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",a.style.left=`${t}px`,a.style.top=`${r}px`;for(let d of o){let p=e.createElement("div");p.textContent=d.label,p.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",p.addEventListener("mouseenter",()=>{p.style.background="#eef"}),p.addEventListener("mouseleave",()=>{p.style.background=""}),p.addEventListener("click",()=>{a.remove(),d.action()}),a.append(p)}e.body.append(a);let l=()=>{a.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function Qe(e,o,t){if(typeof t!="function")return;let r=e.__seiProCtx;if(!r){let a={acoes:{},construtores:[]};r=e.__seiProCtx=a;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let d=l?.$??null,p=null;for(let n of a.construtores){let c=[];try{c=n(d)||[]}catch{c=[]}for(let i of c){let u=`seiPro_${String(i.label).replace(/[^A-Za-z0-9]/g,"_")}`;a.acoes[u]=i.action,e.getCommand(u)||e.addCommand(u,{exec:()=>(a.acoes[u]?.(),!0)}),e.getMenuItem(u)||e.addMenuItem(u,{label:i.label,command:u,group:"seiProGroup"}),p=p??{},p[u]=o}}return p})}r.construtores.includes(t)||r.construtores.push(t)}var M=e=>e;function Ne(e,o={}){let t=()=>e.CKEDITOR,r=n=>!!n?.name&&t()?.instances[n.name]===n,a=n=>r(n)&&!n.readOnly,l=n=>M(n).document?.getBody()?.$??null,d=(n,c)=>{if(!n)return;let i=M(n);if(i.readOnly){o.fn?.();return}c(i)},p={versao:4,getInstance(n){let c=t();if(!c?.instances)return null;if(r(c.currentInstance))return c.currentInstance;let i=n?.closest?.("div.cke"),u=i?c.instances[i.id.replace("cke_","")]:void 0;if(a(u))return u;if(a(e.oEditor))return e.oEditor;let x=Object.values(c.instances);return x.find(s=>a(s))??x[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>M(n).focus(),saveSnapshot:n=>M(n).fire("saveSnapshot"),withEdit(n,c){let i=M(n);i.focus(),i.fire("saveSnapshot"),i.fire("lockSnapshot",{dontUpdate:!0});try{c()}finally{i.fire("unlockSnapshot"),i.fire("saveSnapshot")}},insertHtml:(n,c)=>d(n,i=>i.insertHtml(c)),insertText:(n,c)=>d(n,i=>i.insertText(c)),getSelectionElement:n=>M(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return p.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,c,i){d(n,()=>c.before(...F(c.ownerDocument,i)))},getToolbarContainer:n=>M(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>l(n),findInBody(n,c){let i=l(n);return i?Array.from(i.querySelectorAll(c)):[]},appendToBody(n,c){d(n,i=>{let u=l(i);u&&u.append(...F(u.ownerDocument,c))})},transformBodyHtml(n,c){d(n,i=>{let u=l(i);if(!u)return;let x=u.innerHTML,s=c(x);typeof s=="string"&&s!==x&&u.replaceChildren(...F(u.ownerDocument,s))})},execCommand:(n,c,i)=>M(n).execCommand(c,i),applyStyle(n,c){let i=t()?.style;i&&M(n).applyStyle(new i(c))},getData:n=>M(n).getData(),setData:(n,c)=>d(n,i=>i.setData(c)),insertElement(n,c){d(n,i=>{let u=t()?.dom?.element.createFromHtml;u&&i.insertElement?i.insertElement(u(c,i.document)):i.insertHtml(c)})},saveSelection:n=>M(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,c){let i=M(n).getSelection();i&&c&&i.selectBookmarks(c)},getSelectedText:n=>M(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return M(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,c,i)=>M(n).on(c,i),off:(n,c,i)=>M(n).removeListener(c,i),fire:(n,c,i)=>M(n).fire(c,i),addContextMenu(n,c){let i=M(n),u=t();if(u&&i.contextMenu&&typeof i.addMenuItem=="function"){Qe(i,u.TRISTATE_OFF,c);return}ae(l(n),c)},waitReady(n){return new Promise((c,i)=>{let u=Date.now(),x=()=>{let s=Object.values(t()?.instances??{}).find(f=>f.status==="ready");if(s)return c(s);if(Date.now()-u>n)return i(new Error("Timeout aguardando CKEditor 4"));setTimeout(x,100)};x()})},somenteLeitura:n=>!!M(n).readOnly,aoRecusarEscrita(n){o.fn=n},recusarEscrita(){o.fn?.()}};return p}var S=e=>e,ht={strike:"strikethrough",strikethrough:"strikethrough"},xt={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},vt=0;function He(e,o={}){let t=e.document,r=s=>Array.from(s.model.document.roots??[]).filter(f=>f.isAttached()&&f.rootName!=="$graveyard"),a=s=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[s],l=(s,f)=>{let m=s.editing.view.document.getRoot(f);return m?s.editing.view.domConverter.mapViewToDom(m):null},d=s=>{for(let g of r(s))if(a(g.rootName)?.principal){let h=l(s,g.rootName);if(h)return h}let f=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return f||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((g,h)=>h.childElementCount>(g?g.childElementCount:-1)?h:g,null)},p=s=>{let f=d(s);return f&&r(s).find(m=>l(s,m.rootName)===f)||null},n=s=>s.model.document.selection.getFirstPosition()?.root.rootName??null,c=s=>!!s&&!!a(s)?.somenteLeitura,i=(s,f)=>s.data.toModel(s.data.processor.toView(f)),u=(s,f)=>{let m=S(s);if(c(n(m)))return o.fn?.();m.model.change(()=>m.model.insertContent(i(m,f),m.model.document.selection))},x={versao:5,getInstance(){let s=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return s&&s.state==="ready"?s:null},getAllInstances(){let s=x.getInstance();return s?[s]:[]},focus:s=>S(s).focus(),saveSnapshot(){},withEdit(s,f){let m=S(s);m.focus(),m.model.change(()=>f())},insertHtml:u,insertText(s,f){let m=S(s);if(c(n(m)))return o.fn?.();m.model.change(g=>m.model.insertContent(g.createText(f)))},getSelectionElement(){let s=e.getSelection?.(),f=s&&s.rangeCount>0?s.anchorNode:null;return f?f.nodeType===1?f:f.parentElement:null},getSelectionParagraph:s=>x.getSelectionElement(s)?.closest("p")??null,insertHtmlBefore(s,f,m){let g=S(s),h=g.editing.view.domConverter.mapDomToView(f),v=h?g.editing.mapper.toModelElement(h):null;if(v){if(c(v.root?.rootName))return o.fn?.();g.model.change(E=>g.model.insertContent(i(g,m),E.createPositionBefore(v)));return}u(s,m)},getToolbarContainer(s){let f=S(s).ui?.view?.toolbar?.element;return f?f.querySelector(".ck-toolbar__items")??f:null},getBodyContainer:s=>d(S(s)),findInBody(s,f){let m=d(S(s));return m?Array.from(m.querySelectorAll(f)):[]},appendToBody(s,f){let m=S(s),g=p(m);if(!g)return u(s,f);if(c(g.rootName))return o.fn?.();m.model.change(h=>m.model.insertContent(i(m,f),h.createPositionAt(g,"end")))},transformBodyHtml(s,f){let m=S(s),g=p(m);if(!g)return;let h=m.data.get({rootName:g.rootName,seiProInterno:!0}),v=f(h);if(typeof v!="string"||v===h)return;let E=m.model.document.selection.getFirstRange(),y=E&&E.start.root.rootName===E.end.root.rootName?{raiz:E.start.root,ps:[...E.start.path],pe:[...E.end.path]}:null,k=m.model.document.selection.isBackward;m.data.set({[g.rootName]:v}),y&&m.model.change(C=>{let w,P;try{w=m.model.createPositionFromPath(y.raiz,y.ps),P=m.model.createPositionFromPath(y.raiz,y.pe)}catch{w=P=C.createPositionAt(y.raiz,"end")}C.setSelection(C.createRange(w,P),{backward:k})})},execCommand(s,f,m){S(s).execute(ht[f]??f,m!==void 0?{value:m}:void 0)},applyStyle(s,f){let m=xt[f.element.toLowerCase()];m&&S(s).execute(m)},getData(s){let f=S(s),m=p(f);return m?f.data.get({rootName:m.rootName}):f.data.get()},setData(s,f){let m=S(s),g=p(m);g?m.data.set({[g.rootName]:f}):m.data.set(f)},insertElement:(s,f)=>x.insertHtml(s,f),saveSelection(s){let f=S(s),m=`spro-ed:${vt++}`;return f.model.change(g=>{let h=f.model.document.selection.getFirstRange();h&&g.addMarker(m,{range:h,usingOperation:!1})}),m},restoreSelection(s,f){let m=S(s);if(typeof f!="string")return;let g=m.model.markers.get(f);g&&m.model.change(h=>h.setSelection(g.getRange())),m.model.change(h=>{m.model.markers.has(f)&&h.removeMarker(f)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let s=e.getSelection?.();if(!s||s.rangeCount===0)return"";let f=t.createElement("div");return f.append(s.getRangeAt(0).cloneContents()),f.innerHTML},on(s,f,m){if(f==="change")return S(s).model.document.on("change:data",m);d(S(s))?.addEventListener(f,m)},off(s,f,m){if(f==="change")return S(s).model.document.off("change:data",m);d(S(s))?.removeEventListener(f,m)},fire(s,f,m){d(S(s))?.dispatchEvent(new CustomEvent(f,{detail:m}))},addContextMenu(s,f){ae(d(S(s)),f)},waitReady(s){return new Promise((f,m)=>{let g=Date.now(),h=()=>{let v=x.getInstance();if(v)return f(v);if(Date.now()-g>s)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(h,100)};h()})},somenteLeitura:s=>c(n(S(s))),aoRecusarEscrita(s){o.fn=s},recusarEscrita(){o.fn?.()}};return x}function me(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function ze(e){let o=null,t={},r=()=>{if(o)return o;let d=me(e);return d===5?o=He(e,t):d===4&&(o=Ne(e,t)),o},a=()=>{let d=r();if(!d)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return d},l=d=>((...p)=>a()[d](...p));return{get versao(){return r()?.versao??0},getInstance:d=>r()?.getInstance(d)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(d){t.fn=d},recusarEscrita(){t.fn?.()},waitReady(d){let p=Date.now();return new Promise((n,c)=>{let i=()=>{let u=r();if(u)return u.waitReady(Math.max(1,d-(Date.now()-p))).then(n,c);if(Date.now()-p>d)return c(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(i,100)};i()})}}}var Oe="data-base";function je(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===o)?.value}function Be(e,o){let t=je(e,o);return!(t===!1||t===0||t==="")}function Fe(e,o){let t=je(e,o);return t===!0||t===1||t==="1"}function Ve(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function Ue(e,o=localStorage){return Be(Ve(o),e)}function Ge(e,o=localStorage){return Fe(Ve(o),e)}function ie(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function se(e){e.style.display="none"}var Ke=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function We(e){let o=()=>e.adaptador.versao===5,t=(r,a)=>{let l=r.editing.view.domConverter.mapDomToView(a);return l?r.editing.mapper.toModelElement(l):null};return{selecionados(r){let a=()=>{let s=e.adaptador.getSelectionParagraph(r);return s?[s]:[]};if(o()){let s=r,m=[...s.model.document.selection.getSelectedBlocks()].map(g=>{let h=s.editing.mapper.toViewElement(g);return h?s.editing.view.domConverter.mapViewToDom(h):null}).filter(g=>!!g&&g.tagName==="P");return m.length?m:a()}let d=e.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!d||d.rangeCount===0||!d.anchorNode)return a();let p=Ke(d.anchorNode),n=Ke(d.focusNode);if(!p&&!n||(p=p??n,n=n??p,!p||!n))return a();if(p===n)return[p];let c=p,i=n;p.compareDocumentPosition(n)&2&&(c=n,i=p);let u=[],x=c;for(let s=0;x&&s<5e3&&(x.tagName.toLowerCase()==="p"&&u.push(x),x!==i);s+=1)x=x.nextElementSibling;return u.length?u:[c]},classeDeEstilo(r,a){return o()?t(r,a)?.getAttribute("estilo")??"":a.getAttribute("class")??""},definirClasse(r,a,l){if(o()){let d=r,p=t(d,a);p&&d.model.change(n=>n.setAttribute("estilo",l,p)),e.win.SeiProGhs?.setEstilos(a,{"text-align":null},r);return}a.removeAttribute("style"),a.setAttribute("class",l)},definirTextAlign(r,a,l){if(o()){e.win.SeiProGhs?.setEstilos(a,{"text-align":l},r);return}a.removeAttribute("style"),a.style.textAlign=l}}}var yt=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function kt(e,o){let t=yt.find(r=>Object.values(r).includes(e));return t?t[o]:null}function Et(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=e?.parentElement??null;r;r=r.parentElement){let a=r.querySelector(".divAlignText");if(a)return a}return o.querySelector(".divAlignText")}var Je={id:"align",globais(e){let o=We(e);return{setAlignText(t,r){let a=e.adaptador.getInstance(t);if(!a||e.adaptador.somenteLeitura(a))return;let l=o.selecionados(a);l.length&&e.adaptador.withEdit(a,()=>{for(let d of l){let p=kt(o.classeDeEstilo(a,d),r);p?o.definirClasse(a,d,p):o.definirTextAlign(a,d,r)}})},openAlignText(t){if(!t)return;let r=Et(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&se(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&ie(r))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function b(e,o={},...t){let r=document.createElement(e);for(let[a,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?r.addEventListener(a.replace(/^on/,""),l):l===!0?r.setAttribute(a,""):a==="class"?r.className=l:a==="value"&&e==="textarea"?r.value=l:r.setAttribute(a,l));for(let a of t)a!=null&&a!==!1&&r.append(a);return r}var D={fill:"currentColor",stroke:"none"},Xe="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Ye={estrela:[["path",{d:Xe}]],estrelaCheia:[["path",{d:Xe,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...D}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...D}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...D}],["circle",{cx:"12",cy:"12",r:"1.4",...D}],["circle",{cx:"19",cy:"12",r:"1.4",...D}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...D}],["circle",{cx:"15",cy:"6",r:"1.3",...D}],["circle",{cx:"9",cy:"12",r:"1.3",...D}],["circle",{cx:"15",cy:"12",r:"1.3",...D}],["circle",{cx:"9",cy:"18",r:"1.3",...D}],["circle",{cx:"15",cy:"18",r:"1.3",...D}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Fr=Object.keys(Ye);function ee(e,o=18,t=document){let r="http://www.w3.org/2000/svg",a=t.createElementNS(r,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[d,p]of Object.entries(l))a.setAttribute(d,p);for(let[d,p]of Ye[e]){let n=t.createElementNS(r,d);for(let[c,i]of Object.entries(p))n.setAttribute(c,i);a.append(n)}return a}function Ct(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function Ze(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function eo(e,o,t,r,a){let l=e.body??e.documentElement;for(let u of[l,...e.querySelectorAll("dialog")])for(let x of[...u.children])x.classList.contains("spro-aviso")&&x.remove();let d=b("div",{class:"spro-aviso",role:"status"},ee("check",16),b("span",{},o),...Ct(t).map(u=>b("button",{type:"button",onclick:()=>{d.remove(),u.fazer()}},u.rotulo)));d.setAttribute("popover","manual");let p=()=>{try{d.showPopover?.()}catch{}},n=Date.now()+r,c=()=>{let u=Ze(e);u.append(d),p(),u.localName==="dialog"&&u.addEventListener("close",()=>{if(!(!i||!u.contains(d))){if(a&&Ze(e).localName!=="dialog"&&a(o,t,Math.max(0,n-Date.now()))){i=!1,d.remove();return}c()}},{once:!0})},i=!0;return c(),setTimeout(()=>{i=!1,d.remove()},r),d}var wt=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function oo(e={}){return({titulo:o,conteudo:t,icone:r,aoFechar:a})=>{let l=b("dialog",{class:"spro-dialogo","aria-label":o}),d=()=>{l.open&&l.close()};return l.append(b("header",{},r?b("span",{class:"spro-dialogo-icone","aria-hidden":"true"},ee(r,18)):null,b("h2",{},o),b("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:d},ee("fechar",16))),b("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),a?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(wt)?.focus({preventScroll:!0}),{fechar:d}}}function to(e){let o=oo();return(t,r)=>(fe(t,e),o(r))}function fe(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var ge="";function be(e){ge=e}var q=(e,o)=>to(ge)(e,o);function ro(e){fe(e,ge)}function T(e,o){ro(e),eo(e,o,void 0,7e3)}var At=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),no=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function St(e){let o=0,t=e.split("");return t.forEach((r,a)=>{let l=no.get(r),d=no.get(t[a+1]);o+=l<d?-l:l}),o}function V(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:At.has(o.toLowerCase())&&t!==0?o.toLowerCase():St(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function A(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ao={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let r=e.adaptador.getSelectedText(t);if(!r||r.trim()===""){T(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,A(V(r)))}})};var io="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function z(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let r of o)t+=io[r%io.length];return t}var Tt=()=>`<span class="ancoraSei checkboxSEI" data-id="${z(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,so={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Tt()))}})};var he="copyStylePro",xe="cke_copyformatting_active",lo=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function _t(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),r=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&r?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var co={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(he)??"null")}catch{return null}},a=i=>o.getSelectedHtml(i).trim()!==""||o.getSelectedText(i).trim()!=="",l=i=>!!o.getBodyContainer(i)?.classList.contains(xe),d=i=>{for(let u of e.doc.querySelectorAll(".getCopyStyleButtom"))i==="desabilitar"?u.classList.add("cke_button_disabled"):i==="habilitar"?u.classList.remove("cke_button_disabled"):(u.classList.toggle("cke_button_on",i),u.classList.toggle("cke_button_off",!i))};function p(){let i=o.getInstance();i&&o.getBodyContainer(i)?.classList.remove(xe),t().removeItem(he),d(!1)}function n(i){let u=i??o.getInstance();if(!u)return;if(l(u)){p();return}let x=o.getSelectionElement(u);x&&(t().setItem(he,JSON.stringify(_t(x))),o.getBodyContainer(u)?.classList.add(xe),d(!0))}function c(){let i=o.getInstance();if(!i)return;let u=a(i),x=l(i);d(u||x?"habilitar":"desabilitar");let s=r();if(!(s&&u&&x))return;o.withEdit(i,()=>{o.execCommand(i,"removeFormat");for(let[g,h]of[[s.bold,"bold"],[s.underline,"underline"],[s.italic,"italic"],[s.strike,"strike"],[s.subscript,"subscript"],[s.superscript,"superscript"]])g===!0&&o.execCommand(i,h);let m=[];if(typeof s.backgroundColor=="string"&&lo.test(s.backgroundColor)&&m.push(`background-color: ${s.backgroundColor}`),typeof s.fontSize=="number"&&Number.isFinite(s.fontSize)&&s.fontSize>0&&s.fontSize<400&&m.push(`font-size: ${s.fontSize}px`),typeof s.color=="string"&&lo.test(s.color)&&m.push(`color: ${s.color}`),m.length){let g=o.getSelectedHtml(i);g!==""&&o.insertHtml(i,`<span style="${m.join("; ")}">${g}</span>`)}}),!!e.win.event?.altKey||p()}return{setCopyStyle(i){let u=o.getInstance(i);u&&n(u)},actionCopyStyle:n,getCopyStyle:r,applyCopyStyle:c,removeCopyStyle:p,menuCopyStyle(i){i&&o.addContextMenu(i,u=>o.versao===5?[]:u?.closest("p")&&a(i)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(i)}]:[])}}}};var ve="spro_editor_folha",uo="seipro-folha-editor",ye="data-spro-folha-editor",Mt=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function qt(e){let o=`html[${ye}]`,t=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",a="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${a}, -14px 0 24px -14px ${a}`,d=`0 14px 24px -14px ${a}`,p=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${p} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${p}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${p}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${d}; clip-path: inset(0 -30px -30px); }
${p}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${p} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${r} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function po(e,o){if(!e.head||(e.querySelector(`style[data-style="${uo}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",uo),t.textContent=o,e.head.append(t)}function mo(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[r,a]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,a||"")}}var fo={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(ve),r=()=>!!e.win.localStorage?.getItem("darkModePro"),a=!1;function l(n){for(let c of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let i=c.contentDocument;i?.head&&(po(i,n?Mt:null),mo(i.documentElement,n),mo(i.body,n))}}function d(n){let c=[...o.querySelectorAll(".cke_contents")];c.forEach((i,u)=>{if(!n){i.removeAttribute("data-spro-folha");return}let x=[u===0?"primeira":"",u===c.length-1?"ultima":""].filter(Boolean);i.setAttribute("data-spro-folha",x.join(" ")||"meio")})}function p(n){po(o,n?qt(r()):null),l(n),d(n),n?o.documentElement.setAttribute(ye,""):o.documentElement.removeAttribute(ye);for(let c of o.querySelectorAll(".getPaperViewButtom"))c.classList.toggle("cke_button_on",n),c.classList.toggle("cke_button_off",!n),c.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:p,getPaperViewButtom(n){let c=!t();c?e.win.localStorage.setItem(ve,"1"):e.win.localStorage.removeItem(ve),p(c)},initFolhaEditorPro(){let n=e.win.CKEDITOR;if(typeof n?.on=="function"&&!a){a=!0;let c=i=>i.on("contentDom",()=>t()&&l(!0));for(let i of Object.values(n.instances??{}))c(i);n.on("instanceReady",i=>c(i.editor))}p(t())}}}};function Lt(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var go={id:"font-size",globais:e=>({changeFontSize(o,t){let r=e.adaptador.getInstance(o);if(!r)return;let a=e.adaptador.getSelectedHtml(r);if(!a||a.trim()===""){T(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=Lt(e.adaptador.getSelectionElement(r)),d=t==="up"?l+2:l-2;d>7&&d<70&&e.adaptador.withEdit(r,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${d}px`}}):e.adaptador.insertHtml(r,`<span style="font-size: ${d}px">${a}</span>`)})}})};var le=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Pt=[{name:le,attributes:!0},{name:le,classes:!0},{name:le,styles:!0}],oe=e=>e.split("").join("[\\t\\n\\r]*"),ke=new RegExp(`^[\\s\\x00-\\x20]*(${oe("javascript")}|${oe("vbscript")}|${oe("livescript")}|${oe("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${oe("text/html")})`,"i"),Rt=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:ke}]}];function K(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function te(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var It=e=>!!(e?.model&&e.editing&&e.conversion),Dt=e=>te(e,"EstiloEditing")?.estilos??{},bo=(e,o)=>Object.hasOwn(e,o);function vo(e,o){let t=te(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function $t(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function Qt(e,o,t){if(!o?.is?.("element"))return;let r=t.mapper.toViewElement(o);if(!r)return;let a=Dt(e),l=o.getAttribute("estilo"),d=$t(o,vo(e,"p")),p=t.writer,n=[];try{n=Array.from(r.getClassNames())}catch{}for(let c of n)c!==l&&bo(a,c)&&p.removeClass(c,r);for(let c of d)bo(a,c)||p.addClass(c,r);l&&p.addClass(l,r)}function Nt(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${vo(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let r of o)t.on(r,(a,l,d)=>{try{Qt(e,l.item,d)}catch{}},{priority:"lowest"})})}function Ht(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function ho(e,o){let t=te(o,"Salvar"),r=t?!!t.isDirty:!1;try{e()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function zt(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function Ot(e,o){let t=e.getFullData({seiProInterno:!0}),r=o.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||zt(e)?t:Object.fromEntries(Object.keys(t).map(a=>[a,typeof r[a]=="string"?r[a]:t[a]]))}function jt(e,o,t){try{let r=t??e.adaptador.getSelectionParagraph(o);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let a=r.jquery?r.get(0):r;if(a?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(a);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function Bt(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function xo(e){let o=l=>l??e.adaptador.getInstance();function t(l){let d=o(l);if(!It(d))return!1;if(d.__seiProGhsLiberado)return!0;let p=te(d,"DataFilter");if(!p)return K("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{p.allowElement({name:le,attributes:!0,classes:!0,styles:!0});for(let n of Pt)p.allowAttributes(n);if(typeof p.disallowAttributes=="function")for(let n of Rt)p.disallowAttributes(n)}catch(n){return K("falha ao liberar o GHS",n),!1}return d.__seiProGhsLiberado=!0,Nt(d),!0}function r(l){let d=o(l);if(!t(d)||typeof d.getFullData!="function")return!1;let p=!0;return ho(()=>{try{d.data.set(Ot(d,e.win))}catch(n){K("falha ao reprocessar o conteudo",n),p=!1}},d),p}function a(l,d,p){let n=o(l);if(!t(n))return!1;let c=te(n,"GeneralHtmlSupport"),i=jt(e,n,d),u=i?Bt(n,i):null;if(!c||!i||!u)return!1;try{return p(c,u,i),!0}catch(x){return K("falha ao aplicar no model",x),!1}}return{liberar:t,aplicarRegras:r,semSujar:(l,d)=>ho(l,o(d)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,d,p)=>a(p,l,(n,c,i)=>n.addModelHtmlClass(c,d,i)),removeClasse:(l,d,p)=>a(p,l,(n,c,i)=>n.removeModelHtmlClass(c,d,i)),setEstilos:(l,d,p)=>a(p,l,(n,c,i)=>n.setModelHtmlStyles(c,d,i)),setAtributos:(l,d,p)=>a(p,l,(n,c,i)=>n.setModelHtmlAttributes(c,d,i))}}var yo={id:"ghs-unlock",globais:e=>({SeiProGhs:xo(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=xo(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||Ht(t)){K("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&K("classes, estilos e atributos liberados no editor")}}};function O(...e){return b("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function R(e,o){return o.classList.add("spro-campo"),o.style.width="100%",b("label",{style:"display:grid;gap:4px;font-size:13px;"},b("span",{},e),o)}function ko(e,o){return new Promise((t,r)=>{let a=new e.Image;a.crossOrigin="anonymous",a.onload=()=>{try{let l=e.document.createElement("canvas");l.width=a.width,l.height=a.height,l.getContext("2d")?.drawImage(a,0,0),t(l.toDataURL("image/png"))}catch(l){r(l)}},a.onerror=()=>r(new Error("imagem nao carregou")),a.src=o})}var Ft="https://latex.codecogs.com/png.latex?",Vt="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",Ut="https://editor.codecogs.com/",Eo={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(n=>ko(e.win,n)),r=n=>T(e.doc,n);function a(){let n=o;if(!n)return;let c=n.texto.value;n.geracao+=1;let i=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,c==="")return;let u=b("img",{src:`${Ft}${encodeURI(c)}`});n.previa.append(u),t(u.getAttribute("src")??"").then(x=>{o!==n||n.geracao!==i||(u.setAttribute("src",x),u.className="img-base64",n.pronta=!0)},()=>{o===n&&n.geracao===i&&(n.falhou=!0)})}function l(){let n=o;if(!n)return!1;let c=n.texto.value;if(c==="")return r("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let i=n.previa.querySelector("img");if(!n.pronta||!i)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let u=n.ed,x=`<img class="img-base64" src="${A(i.getAttribute("src")??"")}" alt="${A(c)}">`;return e.adaptador.withEdit(u,()=>e.adaptador.insertHtml(u,x)),!0}function d(n){let c=e.adaptador.getInstance(n);if(!c)return;let i=b("textarea",{id:"MathText",rows:"5"});i.addEventListener("input",a);let u=b("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),x=q(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:O(R("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",i),u,b("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",b("a",{href:Vt,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",b("a",{href:Ut,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&x.fechar()}},"Inserir")))});o={ed:c,texto:i,previa:u,geracao:0,pronta:!1,falhou:!1};let s=String(e.win.getSelection?.()??"").trim();s!==""&&(i.value=s,a())}function p(){}return{updatePreviewLatex:a,openDialogLatex:d,getDialogLatex:p}}};function Ee(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===o.ownerDocument)??t.getInstance()}function Ce(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function W(e,o,t,r){let a=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return a&&e.adaptador.recusarEscrita(),a}function Co(e,o){let t=Ee(e,o);if(!t)return!1;if(e.adaptador.versao===5){let r=t,a=Ce(r,o);return!a||W(e,t,o,a)?!1:(r.model.change(l=>l.setSelection(a)),r.execute("unlink"),!0)}return W(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function wo(e,o,t,r){let a=Ee(e,o);if(!a)return!1;if(e.adaptador.versao===5){let l=a,d=Ce(l,o);return!d||W(e,a,o,d)?!1:(l.model.change(p=>{p.setSelection(d),l.model.insertContent(p.createText(t,{linkHref:r}))}),!0)}return W(e,a,o,null)?!1:(e.adaptador.withEdit(a,()=>{o.setAttribute("href",r),o.setAttribute("data-cke-saved-href",r),o.textContent=t}),!0)}function we(e,o){let t=0,r=[];for(let{a:l,texto:d}of o){let p=Ee(e,l);if(p)if(e.adaptador.versao===5){let n=Ce(p,l);if(!n||W(e,p,l,n))continue;r.push({a:l,texto:d,intervalo:n,ed:p})}else{if(W(e,p,l,null))continue;l.textContent=d,t+=1}}let a=r[0]?.ed;return a&&a.model.change(l=>{for(let{a:d,texto:p,intervalo:n}of[...r].reverse())l.remove(n),l.insertText(p,{linkHref:d.getAttribute("href")??""},n.start),t+=1}),t}function Q(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var Gt="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Ao=new WeakMap,Kt=e=>{let o=Ao.get(e);if(o)return o;let t={balao:null};return Ao.set(e,t),t},Wt=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function So(e){let o=Kt(e),t=s=>T(e.doc,s);function r(s){let f=o.balao;if(f){if(!s){let m=!1;try{m=f.el.matches(":hover")}catch{m=!1}if(m)return}f.el.remove(),o.balao=null}}function a(){if(o.balao)return o.balao.link;let s=e.adaptador.getInstance();return(s?e.adaptador.getSelectionElement(s):null)?.closest("a[href]")??null}async function l(s){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(s),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function d(s,f){r(!0);let m=s?.closest?.("a[href]"),g=m?.getAttribute("href")??"";if(!m||!Q(g))return;let h=b("a",{href:g,target:"_blank",rel:"noopener noreferrer",title:m.textContent??"",style:"color:inherit;text-decoration:underline;"},b("strong",{},Wt(g))),v=(k,C,w)=>b("button",{type:"button",class:k,title:C,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:w},C),E=b("div",{class:"linkDisplayPro",style:Gt},h,v("spro-copiar","Copiar",()=>void l(g)),v("spro-editar","Editar",()=>i()),v("spro-remover","Remover",()=>p()));e.doc.body.append(E),o.balao={el:E,link:m};let y=m.getBoundingClientRect?.();if(y){let k=m.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),C=E.getBoundingClientRect?.().width??0,w=Math.max(8,Math.min(y.left+(k?.left??0),(e.win.innerWidth||0)-C-8));E.style.left=`${w}px`,E.style.top=`${y.bottom+(k?.top??0)+4}px`}}function p(s,f){let m=a();m&&(Co(e,m),r(!0))}function n(s,f){let m=a()?.getAttribute("href");m&&Q(m)&&e.win.open(m,"_blank","noopener,noreferrer")}function c(s,f){let m=a()?.getAttribute("href");m&&l(m)}function i(){let s=a();if(!s)return;let f=b("input",{type:"text",id:"linkProNome"}),m=b("input",{type:"text",id:"linkProUrl"});f.value=s.textContent??"",m.value=s.getAttribute("href")??"";let g=q(e.doc,{titulo:"Editar link",conteudo:O(R("Texto vis\xEDvel:",f),R("URL:",m),b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=m.value.trim(),v=f.value.trim()||h;if(h==="")return t("Digite um link");if(ke.test(h))return t("O link informado \xE9 inv\xE1lido.");wo(e,s,v,h)&&(r(!0),g.fechar())}},"Salvar")))})}function u(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",s=>{let f=s.target;if(!f||o.balao?.el.contains(f))return;let m=f.closest?.("a[href]");m&&f.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?d(m):r(!1)},!0)}return{globais:{showLinkTips:d,hideLinkTips:s=>r(!1),openLinkPro:n,removeLinkPro:p,copyLinkPro:c,editLinkPro:s=>i(),openDialogLinkPro:i,getDialogLinkPro:()=>{}},iniciar:u}}var To={id:"link-pro",globais:e=>So(e).globais,iniciar:e=>So(e).iniciar()};var Jt=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function _o(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,r,a]=[Number(o[1]),Number(o[2]),Number(o[3])],l=new Date(t,r-1,a);return l.getFullYear()!==t||l.getMonth()!==r-1||l.getDate()!==a?"":`${a} de ${Jt[r-1]} de ${t}`}function Ae(e){let o=g=>A(g),t=g=>g!=="",r=t(e.nome)?`, ${o(V(e.nome.trim()))}`:"",a=o(e.sobrenome.toUpperCase()),l=t(e.titulo)?`. <strong>${o(V(e.titulo.trim()))}</strong>`:"",d=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",p=t(e.local)?`, ${o(V(e.local.trim()))}`:"",n=t(e.editora)?`: ${o(V(e.editora.trim()))}`:"",c=t(e.ano)?`, ${o(e.ano)}`:"",i=t(e.volume)?`, v. ${o(e.volume)}`:"",u=t(e.paginas)?`. p.${o(e.paginas)}`:"",x=t(e.link)&&Q(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",s=_o(e.data),f=s?`. Acesso em: ${s}`:"",m=a+r+l+d+p+n+c+i+u+x+f;return m===""?"":`${m}.`}function j(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function J(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Te="ntRodape_item",U="ntRodape_footer",qo=".ntRodape_item, .ntRodape, .ntRodape_tr",Lo='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function Po(e,o){let t=A(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function Ro(e){let o=A(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function Io(e,o=new Set){let t=new Map,r=0;for(let d of e)d.tipo==="item"&&t.set(d.ref,r+=1);let a=[],l=[];for(let d of e){if(d.tipo!=="footer")continue;let p=t.get(d.ref);p!==void 0?a.push({ref:d.ref,chave:p}):o.has(d.ref)?a.push({ref:d.ref,chave:Number.isFinite(d.numero)?d.numero:Number.MAX_SAFE_INTEGER}):l.push(d.ref)}return a.sort((d,p)=>d.chave-p.chave),{numeroDe:t,ordem:a.map(d=>d.ref),orfaos:l}}var Se=e=>e.getAttribute("data-ntrodape-ref")??"";function Do(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${Te}[data-ntrodape-ref]`)),r=Array.from(e.querySelectorAll("p.ntRodape")).filter(p=>p.querySelector(`.${U}[data-ntrodape-ref]`)),a=p=>Number.parseInt(p.querySelector(`.${U}`)?.getAttribute("data-ntrodape")??"",10),l=Io([...t.map(p=>({tipo:"item",ref:Se(p)})),...r.map(p=>({tipo:"footer",ref:Se(p.querySelector(`.${U}`)),numero:a(p)}))],o);t.forEach((p,n)=>{p.setAttribute("data-ntrodape",String(n+1)),p.textContent=`[${n+1}]`});let d=new Map;for(let p of r){let n=Se(p.querySelector(`.${U}`)),c=l.numeroDe.get(n),i=p.querySelector(`.${U}`);c!==void 0&&(i.setAttribute("data-ntrodape",String(c)),i.textContent=`[${c}]`),p.remove(),d.set(n,p)}for(let p of l.ordem){let n=d.get(p);n&&e.append(n)}if(!l.ordem.length)for(let p of e.querySelectorAll(".ntRodape_tr"))p.remove();return l}function $o(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${Te}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var Mo=e=>e.getAttribute?.("htmlSpan")?.classes??[],Xt=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function Qo(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of e.createRangeIn(o).getItems())if(r.is("$textProxy")||r.is("$text")){let a=Mo(r);a.includes(Te)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):a.includes(U)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===o){let a=Xt(r);if(a.includes("ntRodape_tr"))t.separadores.push(r);else if(a.includes("ntRodape")){let d=Array.from(e.createRangeIn(r).getItems()).find(p=>(p.is("$textProxy")||p.is("$text"))&&Mo(p).includes(U))?.getAttribute("htmlSpan")?.attributes??{};d["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:d["data-ntrodape-ref"],numero:Number.parseInt(d["data-ntrodape"],10)})}}return t}function Yt(e,o,t){let r=o.getAttribute("htmlSpan")??{},a=`[${t}]`;if(o.data===a&&r.attributes?.["data-ntrodape"]===String(t))return;let l=Object.fromEntries(o.getAttributes());l.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let d=e.createRangeOn(o),p=d.start;e.remove(d),e.insertText(a,l,p)}function No(e,o,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(a=>{let l=Qo(a,o),d=c=>c.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=Io([...l.itens.map(c=>({tipo:"item",ref:d(c)})),...l.rodapes.map(c=>({tipo:"footer",ref:c.ref,numero:c.numero}))],t);let p=[],n=0;for(let c of l.textos)if(c.tipo==="item")p.push({no:c.no,n:n+=1});else{let i=r.numeroDe.get(d(c.no));i!==void 0&&p.push({no:c.no,n:i})}for(let c of[...p].reverse())Yt(a,c.no,c.n);for(let c of r.orfaos){let i=l.rodapes.find(u=>u.ref===c);i&&a.remove(a.createRangeOn(i.bloco))}for(let c of r.ordem){let i=l.rodapes.find(u=>u.ref===c);i&&a.move(a.createRangeOn(i.bloco),a.createPositionAt(o,"end"))}if(!r.ordem.length)for(let c of l.separadores)a.remove(a.createRangeOn(c))}),r}function Ho(e,o){e.model.change(t=>{let r=Qo(t,o),a=[...r.itens,...r.rodapes.map(l=>l.bloco),...r.separadores];for(let l of[...a].reverse())t.remove(t.createRangeOn(l))})}function re(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=e.editing.view.document.getRoot(t.rootName);if(r&&e.editing.view.domConverter.mapViewToDom(r)===o)return t}catch{}return null}function zo(e,o,t){let r=new Set;for(let a of Array.from(e.model.document.roots??[]))if(!(!a||a===o||a.rootName==="$graveyard"))for(let l of t(e.data.get({rootName:a.rootName})))r.add(l);return r}var Zt='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',Oo=new WeakSet;function er(e,o){let t=e.querySelector(`[name="${o}"], [id="${o}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(o);return r?e.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${r[2]}"]`):null}function N(e){let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||Oo.has(t)||(Oo.add(t),t.addEventListener("click",r=>{let a=r.target?.closest?.(Zt);if(!a)return;let l=er(t,(a.getAttribute("href")??"").slice(1));(l?.closest("p")??l)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var or=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],jo={id:"nota-rodape",globais(e){let o=e.adaptador,t=m=>T(e.doc,m),r=m=>o.getBodyContainer(m),a=m=>o.findInBody(m,qo).length>0;function l(m,g){let h=o.versao===5?J(e,g):o.somenteLeitura(m);return h&&o.recusarEscrita(),h}function d(m){let g=e.doc.createElement("div");return g.append(...F(e.doc,m)),Array.from(g.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(h=>h.getAttribute("data-ntrodape-ref")??"")}function p(m){if(o.versao===5){let g=re(m,r(m));g&&No(m,g,zo(m,g,d))}else{let g=r(m);g&&Do(g)}}function n(m){let g=typeof m=="object"&&m&&"model"in m?m:o.getInstance();if(!g)return;let h=o.versao===5?re(g,r(g)):null;l(g,h)||o.withEdit(g,()=>p(g))}function c(m){let g=m??o.getInstance();if(g){if(!a(g))return t("O documento n\xE3o tem notas de rodap\xE9.");n(g),N(e),t("Notas de rodap\xE9 atualizadas com sucesso")}}function i(m,g){let h=g??o.getInstance();if(!h)return;if(!a(h))return t("O documento n\xE3o tem notas de rodap\xE9.");let v=o.versao===5?re(h,r(h)):null;l(h,v)||(o.withEdit(h,()=>{if(o.versao===5)Ho(h,v);else{let E=r(h);E&&$o(E)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function u(m,g){let h=g??o.getInstance();if(!h||m.trim()==="")return;let v=o.versao===5?re(h,r(h)):null;if(o.versao===5&&!v||l(h,v))return;let E=z(16);o.withEdit(h,()=>{if(o.versao===5){let y=h;y.model.document.selection.getFirstPosition()?.root!==v&&y.model.change(k=>k.setSelection(v,"end"))}o.findInBody(h,".ntRodape_tr").length||o.appendToBody(h,Lo),o.appendToBody(h,Po(E,m)),o.insertHtml(h,Ro(E)),p(h)}),N(e)}function x(m){let g=h=>(m.querySelector(`#${h}`)?.value??"").toString();return Object.fromEntries(or.map(([h,v])=>[h,g(v)]))}function s(m){let g=m??e.doc,h=g.querySelector("#nrABNTResult");h&&h.replaceChildren(...F(e.doc,Ae(x(g))))}function f(m){let g=m??o.getInstance();if(!g)return;let h=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],v=new Map,E=new Map,y=null,k=_=>{for(let[L]of h){let $=L===_;E.get(L)?.setAttribute("aria-selected",String($)),E.get(L)?.setAttribute("tabindex",$?"0":"-1"),$?v.get(L)?.removeAttribute("hidden"):v.get(L)?.setAttribute("hidden","")}y&&(_==="livre"||_==="abnt"?y.removeAttribute("hidden"):y.setAttribute("hidden",""))},C=b("textarea",{id:"textNotaRodape",rows:"3",style:"width:100%;"}),w=(_,L,$="text")=>b("label",{style:"display:grid;gap:2px;font-size:12px;color:#555;"},b("span",{},_),b("input",{type:$,id:L,style:"width:100%"})),P=b("div",{id:"nrABNTResult",style:"margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"}),B=b("div",{style:"display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;"},w("Nome do autor","nr_Nome"),w("Sobrenome do autor","nr_Sobrenome"),b("div",{style:"grid-column:1 / span 2;"},w("T\xEDtulo da publica\xE7\xE3o","nr_Titulo")),w("N\xFAmero da edi\xE7\xE3o","nr_Edicao","number"),w("Ano da publica\xE7\xE3o","nr_Ano","number"),w("Local (cidade)","nr_Local"),w("Nome da editora","nr_Editora"),w("N\xFAmero do volume","nr_Volume","number"),w("P\xE1ginas inicial-final","nr_Paginas"),w("Link da publica\xE7\xE3o","nr_Link"),w("Data do acesso","nr_Data","date"),b("div",{style:"grid-column:1 / span 2;"},P)),H={livre:b("div",{},b("label",{for:"textNotaRodape",style:"font-size:12px;color:#555;"},"Texto da nota de rodap\xE9:"),C),abnt:B,atualizar:b("div",{style:"padding:10px 0;display:grid;gap:10px;"},b("p",{},"Atualiza numera\xE7\xF5es e ordem das notas de rodap\xE9 j\xE1 existentes no documento."),b("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>c(g)},"Atualizar")),remover:b("div",{style:"padding:10px 0;display:grid;gap:10px;"},b("p",{},"Remove todas as notas de rodap\xE9 do documento (Ctrl+Z desfaz)."),b("button",{type:"button",id:"btnNrRemove",class:"spro-botao",onclick:()=>{i(null,g),G.fechar()}},"Remover todas"))},Z=b("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});h.forEach(([_,L],$)=>{let Ie=b("button",{type:"button",role:"tab",id:`ntTab_${_}`,"aria-controls":`ntPainel_${_}`,"aria-selected":"false",class:"spro-botao",onclick:()=>k(_),onkeydown:gt=>{let De=gt,$e=De.key==="ArrowRight"?1:De.key==="ArrowLeft"?-1:0,pe=h[($+$e+h.length)%h.length]?.[0];!$e||!pe||(k(pe),E.get(pe)?.focus())}},L);E.set(_,Ie),Z.append(Ie);let ft=b("div",{role:"tabpanel",id:`ntPainel_${_}`,"aria-labelledby":`ntTab_${_}`,hidden:""},H[_]);v.set(_,ft)}),y=b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let _=(P.textContent??"").trim()?Ae(x(B)):"",L=C.value.trim(),$=_||A(L).replace(/\r?\n/g,"<br>");if(!$)return t("Digite o texto da nota de rodap\xE9.");u($,g),G.fechar()}},"Inserir");for(let _ of B.querySelectorAll("input"))_.addEventListener("input",()=>s(B)),_.addEventListener("change",()=>s(B));let G=q(e.doc,{titulo:"Inserir nota de rodap\xE9",conteudo:b("div",{style:"min-width:480px;font-size:13px;"},Z,...v.values(),b("div",{class:"spro-dialogo-rodape"},y))});k("livre")}return{getNotaRodape(m){let g=o.getInstance(m);g&&f(g)},getDialogNotaRodape:()=>{},openDialogNotaRodape:f,removeNtRodape:i,updateNrABNT:s,insertNtRodape:u,updateNtRodape:c,reorderNtRodape:n}},iniciar(e){N(e)}};function ce(e,o,t,r){let a=e.adaptador.getInstance(o);if(!a)return;let l=e.adaptador.getSelectionParagraph(a);l&&e.adaptador.withEdit(a,()=>{e.adaptador.insertHtmlBefore(a,l,t),r?.(a,l)})}var tr='<div class="pageBreakPro" style="page-break-after: always"></div>',Bo={id:"page-break",globais:e=>({getPageBreak:o=>ce(e,o,tr)})};function Fo(e,o,t){let r=e.jQuery,a=r?.(o).qrcode;if(!r||typeof a!="function")return null;o.replaceChildren();try{r(o).qrcode?.(t)}catch{return o.replaceChildren(),null}return o.querySelector("img, canvas")}var ne={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},rr=[["QrPro-size","px"],["QrPro-minversion",""],["QrPro-quiet"," m\xF3dulos"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],nr=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],ar=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],ir=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],Vo={id:"qr-code",globais(e){let o=e.adaptador,t=y=>T(e.doc,y),r=y=>e.doc.querySelector(y),a=y=>r(`#${y}`)?.value??"",l=()=>e.win.NAMESPACE_SPRO??"SEI Pro",d=()=>`${e.base}icons/menu/seipro.png`,p=(y,k,C)=>b("div",{style:"display:grid;gap:2px;"},b("label",{for:k},y),C),n=(y,k,C,w)=>b("input",{id:y,type:"range",value:ne[y]??"",min:String(k),max:String(C),step:String(w)});function c(){let y=b("div",{id:"optionsQrAdvanced",style:"display:none;"},b("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;font-size:12px;"},p("Tamanho do QR: 140px","QrPro-size",n("QrPro-size",100,500,50)),p("Cor de Preenchimento","QrPro-fill",b("input",{id:"QrPro-fill",type:"color",value:ne["QrPro-fill"]??""})),p("Cor de Fundo","QrPro-background",b("div",{},b("input",{id:"QrPro-background",type:"color",value:ne["QrPro-background"]??""}),b("label",{style:"margin-left:12px;"},b("input",{id:"QrPro-background-transparent",type:"checkbox"})," Transparente"))),p("Vers\xE3o: 6","QrPro-minversion",n("QrPro-minversion",1,10,1)),p("N\xEDvel de corre\xE7\xE3o de erros","QrPro-eclevel",b("select",{id:"QrPro-eclevel"},...ir.map(([k,C])=>b("option",{value:k},C)))),p("Margens de folga: 1 m\xF3dulos","QrPro-quiet",n("QrPro-quiet",0,4,1)),p("Raio de canto: 50%","QrPro-radius",n("QrPro-radius",0,50,10)),p("Modo","QrPro-mode",b("select",{id:"QrPro-mode"},...ar.map(([k,C])=>b("option",{value:k},C)))),b("div"),b("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},b("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Tamanho da etiqueta: 20%","QrPro-msize",n("QrPro-msize",0,40,1)),p("Posi\xE7\xE3o X: 50%","QrPro-mposx",n("QrPro-mposx",0,100,1)),p("Posi\xE7\xE3o Y: 50%","QrPro-mposy",n("QrPro-mposy",0,100,1)))),b("div",{class:"QrMode-etiqueta",style:"display:none;grid-column:1 / span 3;"},b("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Nome da fonte","QrPro-font",b("select",{id:"QrPro-font"},...nr.map(k=>b("option",{value:k},k)))),p("Cor da fonte","QrPro-fontcolor",b("input",{id:"QrPro-fontcolor",type:"color",value:ne["QrPro-fontcolor"]??""})),p("Etiqueta","QrPro-label",b("input",{id:"QrPro-label",type:"text",value:l()})))),b("div",{class:"QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},p("Imagem","QrPro-image",b("input",{id:"QrPro-image",type:"file",accept:"image/*"})),b("img",{id:"QrPro-img-buffer",style:"display:none",src:d(),alt:""}))),b("a",{id:"QrPro-reset",class:"linkDialog",role:"button",tabindex:"0",style:"margin-top:14px;display:block;cursor:pointer;",onclick:()=>u()},"Resetar configura\xE7\xF5es"));return b("div",{id:"qrCodeLab"},b("div",{style:"text-align:right;"},b("a",{id:"toggleOptionsQR",class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>i()},"Op\xE7\xF5es avan\xE7adas ")),b("div",{style:"display:grid;gap:10px;"},y,b("div",{id:"qrCodeResult",style:"text-align:center;margin:10px 0;min-width:180px;"})))}function i(){let y=r("#optionsQrAdvanced");y&&(y.style.display=y.style.display==="none"?"":"none")}function u(){for(let[C,w]of Object.entries(ne)){let P=r(`#${C}`);P&&(P.value=w)}let y=r("#QrPro-label");y&&(y.value=l());let k=r("#QrPro-background-transparent");k&&(k.checked=!1,k.removeAttribute("checked")),r("#QrPro-img-buffer")?.setAttribute("src",d()),h()}function x(y){r("#tipQrCodeUrl")?.remove();let k=r("#toggleOptionsQR");if(y===""||!Q(y)||y.length<=50||!k)return;let C=r(".getTinyUrlButtom span")?.getAttribute("style")??"",w=b("span",{id:"tipQrCodeUrl",style:"display:block;margin-bottom:8px;padding:5px 8px 8px 8px;background:#f9f9dc;color:#333;border-radius:5px;"},"Dica: Experimente ",b("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>f()},b("span",{style:`width:16px;height:16px;display:inline-block;${C}`}),"Gerar link curto do TinyURL"));(k.parentElement??k).before(w)}function s(y){let k=r("#qrCodeText");k&&(k.value=y),h()}function f(){let y=a("qrCodeText").trim(),k=e.win.ajaxTinyUrl;if(typeof k!="function")return t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");Promise.resolve(k(y,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function m(){for(let[y,k]of rr){let C=r(`label[for="${y}"]`);C&&(C.textContent=(C.textContent??"").replace(/:.*/,`: ${a(y)}${k}`))}}function g(y){let k=C=>Number.parseInt(a(C),10);return{render:"image",ecLevel:a("QrPro-eclevel"),minVersion:k("QrPro-minversion"),fill:a("QrPro-fill"),background:r("#QrPro-background-transparent:checked")?null:a("QrPro-background"),text:y,size:k("QrPro-size"),radius:k("QrPro-radius")*.01,quiet:k("QrPro-quiet"),mode:k("QrPro-mode"),mSize:k("QrPro-msize")*.01,mPosX:k("QrPro-mposx")*.01,mPosY:k("QrPro-mposy")*.01,label:a("QrPro-label"),fontname:a("QrPro-font"),fontcolor:a("QrPro-fontcolor"),image:r("#QrPro-img-buffer")}}function h(){let y=r("#qrCodeResult");if(!y)return;y.replaceChildren();for(let w of e.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))w.style.display="none";m();let k=a("QrPro-mode");if(k==="1"||k==="2")for(let w of e.doc.querySelectorAll(".QrMode-etiqueta"))w.style.display="";else if(k==="3"||k==="4")for(let w of e.doc.querySelectorAll(".QrMode-imagem"))w.style.display="";let C=a("qrCodeText");C!==""&&!Fo(e.win,y,g(C))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),x(C)}function v(y,k){let C=k??o.getInstance();if(!C)return;let w=r("#qrCodeResult img")?.getAttribute("src")??"";if(!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(w))return t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto.");o.withEdit(C,()=>o.insertHtml(C,`<img src="${A(w)}" alt="${A(y)}">`))}function E(y){let k=y??o.getInstance();if(!k)return;let C=b("input",{type:"text",id:"qrCodeText",style:"width:100%;box-sizing:border-box;margin:6px 0 10px 0;"}),w=String(e.win.getSelection?.()??"").trim();w&&(C.value=w),C.addEventListener("input",()=>h()),C.addEventListener("change",()=>h());let P=c();for(let H of["input","change"])P.querySelector("#optionsQrAdvanced")?.addEventListener(H,()=>h());P.querySelector("#QrPro-image")?.addEventListener("change",H=>{let Z=H.target.files?.[0];if(!Z)return;let G=new FileReader;G.onload=()=>{let _=String(G.result??"");if(!/^data:image\//i.test(_))return t("Escolha um arquivo de imagem.");r("#QrPro-img-buffer")?.setAttribute("src",_);let L=r("#QrPro-mode");L&&(L.value="4"),setTimeout(h,200)},G.readAsDataURL(Z)});let B=q(e.doc,{titulo:"Gerar C\xF3digo QR",conteudo:b("div",{style:"min-width:560px;max-width:100%;font-size:13px;"},b("label",{for:"qrCodeText"},"Insira o texto que deseja codificar:"),C,P,b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let H=C.value.trim();if(!H)return t("Digite o texto a codificar");v(H,k),B.fechar()}},"Inserir")))});w&&h()}return{getQrCode(y){let k=o.getInstance(y);k&&E(k)},getDialogQrCode:()=>{},openDialogQrCode:E,buildHtmlQrCodeLab:c,resetOptionsQR:u,toggleOptionsQR:i,tipQrCodeUrl:x,setInputTinyUrl:s,convertTinyURL:f,updateQrCode:h,setQrCode:v}}};var Uo=5,Go=5,Ko=49,I=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function sr(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let a=e?.previousElementSibling??null;a;a=a.previousElementSibling)if(a.classList.contains("divQuickTable"))return a;return o.querySelector(".divQuickTable")}var Wo={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let i of e.doc.querySelectorAll(".divQuickTable"))i.replaceChildren(),se(i);for(let i of e.doc.querySelectorAll(".getQuickTableButtom"))i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")}function r(i){if(!i)return;let u=I(i,"data-row"),x=I(i,"data-col"),s=i.closest("table");if(!s)return;for(let g of s.querySelectorAll("td"))g.classList.remove("td_hover");let f=()=>[...s.querySelectorAll("tr")];if(u>=3&&I(f().at(-1)?.querySelector("td"),"data-row")>u+1&&(f().at(-1)?.remove(),s.setAttribute("data-row",String(I(s,"data-row")-1))),x>=3&&I(f().at(-1)?.lastElementChild,"data-col")>x+1){for(let g of f())g.lastElementChild?.remove();s.setAttribute("data-col",String(I(s,"data-col")-1))}for(let g of s.querySelectorAll("td"))I(g,"data-row")<=u&&I(g,"data-col")<=x&&g.classList.add("td_hover");let m=i.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(m&&(m.textContent=`Tabela ${u+1}x${x+1}`),u===I(s,"data-row")&&u<Ko){let g=f().at(-1)?.cloneNode(!0);g&&(g.querySelectorAll("td").forEach((h,v)=>{h.setAttribute("data-row",String(u+1)),h.setAttribute("data-col",String(v)),h.classList.remove("td_hover")}),(s.querySelector("tbody")??s).append(g),s.setAttribute("data-row",String(u+1)))}if(x===I(s,"data-col")&&x<Ko){for(let g of f()){let h=g.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(x+1)),h.classList.remove("td_hover"),g.append(h))}s.setAttribute("data-col",String(x+1))}}function a(){let i=e.doc,u=i.createDocumentFragment(),x=i.createElement("div");x.className="quickTableInfo",x.textContent="Inserir Tabela";let s=i.createElement("table");s.setAttribute("data-row",String(Uo-1)),s.setAttribute("data-col",String(Go-1));for(let m=0;m<Uo;m+=1){let g=i.createElement("tr");for(let h=0;h<Go;h+=1){let v=i.createElement("td");v.setAttribute("data-row",String(m)),v.setAttribute("data-col",String(h)),g.append(v)}s.append(g)}let f=m=>r(m.target?.closest("td")??null);return s.addEventListener("mouseover",f),s.addEventListener("mouseout",f),s.addEventListener("click",m=>{let g=m.target?.closest("td");g&&c(g)}),u.append(x,s),u}function l(i){if(!i)return;let u=sr(i,e.doc);i.classList.contains("cke_button_on")?(t(),i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")):(u&&(u.replaceChildren(a()),ie(u)),i.classList.remove("cke_button_off"),i.classList.add("cke_button_on"))}function d(i){let u=i?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),x=u?[...u.querySelectorAll(".getTablestylesButtom")]:[];x.length||(x=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let s of x)s.classList.remove("cke_button_disabled")}function p(i,u){let x='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';x+="  <tbody>";for(let s=0;s<=i;s+=1){x+="      <tr>";for(let f=0;f<=u;f+=1)x+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';x+="      </tr>"}return`${x}  </tbody></table>`}function n(i,u){let x=u?u.nextElementSibling:o.getBodyContainer(i)?.lastElementChild,s=x?.tagName==="TABLE"?x.querySelector("td p"):null;if(!s)return;let f=s.ownerDocument,m=f.defaultView?.getSelection?.();if(!m)return;let g=f.createRange();g.setStart(s.firstChild??s,0),g.collapse(!0),m.removeAllRanges(),m.addRange(g)}function c(i){let u=o.getInstance(i);if(!u){t();return}let x=p(I(i,"data-row"),I(i,"data-col")),s=o.getSelectionParagraph(u);o.withEdit(u,()=>{if(!s)return o.insertHtml(u,x);let f=s.nextElementSibling;f?o.insertHtmlBefore(u,f,x):o.appendToBody(u,x)}),t(),d(i),n(u,s)}return{getQuickTable:l,quickTableOver:r,hideQuickTable:t,quickTableClick:c}}};function de(e,o,t,r,a){let l=e.adaptador;if(l.versao===5){let p=j(o,t);return p&&J(e,p)?(l.recusarEscrita(),!1):!!e.win.SeiProGhs?.setAtributos(t,{id:r},o)}if(l.somenteLeitura(o))return l.recusarEscrita(),!1;if(a)for(let p of t.querySelectorAll(`a.${a}`))p.remove();let d=t.ownerDocument.createElement("a");return d.setAttribute("name",r),a&&(d.className=a),t.prepend(d),!0}function ue(e,o){let t=e.querySelector(`a[name^="${o}"]`);return t?t.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var lr=[1,2,3,4],_e=["Paragrafo_Numerado_Nivel","Item_Nivel"];function Jo(e){let o=_e.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of o)r.fill(0);return{item:""}}for(let r=0;r<_e.length;r+=1)for(let a of lr){if(t!==`${_e[r]}${a}`)continue;let l=o[r];l[a-1]=(l[a-1]??0)+1;for(let d=a;d<4;d+=1)l[d]=0;return{item:l.slice(0,a).join(".")}}return{item:""}})}var X="RefPro_",cr="refpro",dr=`a[href^="#${X}"]`,Xo=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,Yo={id:"ref-interna",globais(e){let o=e.adaptador,t=c=>T(e.doc,c);function r(c){let i=c??o.getInstance();if(!i)return!1;let u=o.findInBody(i,"p");if(!u.length)return!1;let x=Jo(u.map(f=>({classe:(f.getAttribute("class")??"").trim()}))),s=[];return u.forEach((f,m)=>{let g=x[m]?.item;if(!g)return;let h=ue(f,X);s.push({ref:h?h.slice(X.length):z(16),item:g,text:f.textContent??"",ancorado:!!h,el:f})}),s}function a(c,i,u){let x=r(c),s=o.findInBody(c,dr),f=[];if(!x||!s.length)return{mudar:f,perdidas:0};let m=new Map(x.filter(h=>h.ancorado).map(h=>[h.ref,h.item])),g=0;for(let h of s){let v=m.get((h.getAttribute("href")??"").slice(1+X.length));if(v===void 0){g+=1;continue}let E=Xo(i,u,v);(h.textContent??"")!==E&&f.push({a:h,texto:E})}return{mudar:f,perdidas:g}}function l(c,i,u){let{mudar:x,perdidas:s}=a(c,i,u),f=0;return x.length&&o.withEdit(c,()=>f=we(e,x)),{atualizadas:f,perdidas:s}}function d(c,i,u){let x,s,f;typeof c=="string"||c===void 0?(x=o.getInstance(),s=c??"",f=i===!0):(x=c,s=typeof i=="string"?i:"",f=u===!0),x&&l(x,s,f)}function p(c){let i=o.getInstance(c);if(!i)return;let u=r(i);if(!u||!u.length)return t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");let x=b("input",{type:"text",id:"prefixo",style:"width:70%"}),s=b("input",{type:"checkbox",id:"hidePrefix"}),f=b("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(10,u.length)),style:"width:100%"},...u.map(h=>{let v=h.text.trim(),E=v.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return b("option",{value:`${h.ref}-${h.item}`},`${h.item}. ${E}${E.length<v.length?"...":""}`)})),m=()=>s.matches(":checked")||x.value.trim()==="",g=q(e.doc,{titulo:"Inserir refer\xEAncia interna",conteudo:b("div",{style:"display:grid;gap:12px;min-width:420px;font-size:13px;"},b("label",{style:"display:grid;gap:4px;"},b("span",{},"Prefixo:"),x),b("label",{},s," N\xE3o utilizar prefixo"),b("label",{style:"display:grid;gap:4px;"},b("span",{},"Par\xE1grafo numerado:"),f),b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:h}=l(i,x.value,m());N(e),t(h?`Refer\xEAncias atualizadas. ${h} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=u.filter(v=>[...f.querySelectorAll("option")].some(E=>E.value===`${v.ref}-${v.item}`&&E.selected));if(!h.length)return t("Selecione ao menos um par\xE1grafo numerado.");n(i,h,x.value,m())&&g.fechar()}},"Inserir")))})}function n(c,i,u,x){if(o.somenteLeitura(c))return o.recusarEscrita(),!1;let s=i.filter(h=>h.el.isConnected);if(!s.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let f=s.map(h=>`<a href="#${X}${A(h.ref)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${A(Xo(u,x,h.item))}</a>`),m=f.length>1?`${f.slice(0,-1).join(", ")} e ${f.at(-1)}`:f[0]??"",g=!1;return o.withEdit(c,()=>{let{mudar:h}=a(c,u,x);h.length&&we(e,h);for(let v of s)if(!v.ancorado&&!de(e,c,v.el,`${X}${v.ref}`,cr))return;o.insertHtml(c,` ${m} `),g=!0}),N(e),g}return{getRefInterna:p,updateRefsInternas:d,getNiveisParagrafos:r,clickScroolToRef:()=>N(e)}},iniciar(e){N(e)}};var ur='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',pr="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",Zo={id:"session-break",globais:e=>({getSessionBreak:o=>ce(e,o,ur,(t,r)=>{if(e.adaptador.versao!==5)return;let a=t,l=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,d=j(a,r)?.previousSibling;l&&d?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":pr},d)})})};var et=["seiSlim","seiSlim_parent","seiSlim_view"],ot={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=a=>{for(let l of o())l.classList.add(a?"cke_button_on":"cke_button_off"),l.classList.remove(a?"cke_button_off":"cke_button_on")};function r(a){if(a==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...et)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...et)}return{getBoxStyleEditor(a){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),r("remove")):(t(!0),r("set"))},updateStyleEditor:r}}};var mr="seipro-bookmark",tt="bookmark-",fr=e=>e.replace(/^\./,""),rt={id:"sumario",globais(e){let o=e.adaptador,t=n=>T(e.doc,n);function r(n){let c=new Set;for(let i of o.findInBody(n,"p")){let u=(i.getAttribute("class")??"").trim().split(/\s+/)[0];u&&c.add(u)}return[...c]}function a(n,c,i){let u=n.map(x=>b("option",{value:`.${x}`,...x===i?{selected:"selected"}:{}},x));return c?[b("option",{value:""},"(nenhum)"),...u]:u}function l(n,c,i){let u=e.doc.querySelector(`select#${c}`);u&&u.replaceChildren(...i.map(([x,s])=>b("option",{value:s},x)))}function d(n,c,i){let u=i??o.getInstance();if(!u)return!1;let x=new Set(c.map(fr).filter(Boolean));if(!x.size)return!1;if(o.somenteLeitura(u))return o.recusarEscrita(),!1;let s=o.findInBody(u,"p").filter(m=>(m.textContent??"").trim()!==""&&[...m.classList].some(g=>x.has(g)));if(!s.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let f='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>';return o.withEdit(u,()=>{for(let g of s){let h=ue(g,tt)??`${tt}${z(16)}`;de(e,u,g,h,mr)&&(f+=`<p class="Texto_Alinhado_Esquerda"><a href="#${A(h)}">${A((g.textContent??"").trim())}</a></p>`)}let m=o.versao===5?o.getSelectionParagraph(u):null;m?o.insertHtmlBefore(u,m,f):o.insertHtml(u,f)}),!0}function p(n,c){let i=c??o.getInstance();if(!i)return;let u=r(i);if(!u.length)return t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");let x=(h,v,E)=>b("select",{id:h},...a(u,v,E)),s=x("listStyle1",!1,"Item_Nivel1"),f=x("listStyle2",!0,"Item_Nivel2"),m=x("listStyle3",!0,"Item_Nivel3"),g=q(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:O(R("Estilo do T\xEDtulo 1 (obrigat\xF3rio):",s),R("Estilo do T\xEDtulo 2:",f),R("Estilo do T\xEDtulo 3:",m),b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=[s.value,f.value,m.value].filter(v=>v!=="");if(!h.length)return t("Escolha o estilo do T\xEDtulo 1.");d(null,[...new Set(h)],i)&&g.fechar()}},"Inserir")))})}return{getSumarioDocumento(n){let c=o.getInstance(n);c&&p(null,c)},getListStylesDocumento(n,c){let i=c??o.getInstance();return i?a(r(i),!1):[]},updateSelectDialog:(n,c)=>l(null,n,c),getDialogSumarioDocumento:n=>p(null,n),getDialogSumarioDocumento_:()=>p(null),insertSumarioDocumento:(n,c)=>d(null,n,c)}}};var Y={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function Me(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function qe(e){let o={};for(let t of e.split(";")){let r=t.indexOf(":");if(r<=0)continue;let a=t.slice(0,r).trim(),l=t.slice(r+1).trim();a&&l&&(o[a]=l)}return o}function gr(e,o,t){let r=[];for(let a=0;a<o;a+=1){let l=a===0,d=l?e.trCabecalho:Array.isArray(e.tr)?a%2===0?e.tr[1]:e.tr[0]:e.tr,p=Array.from({length:t},(n,c)=>({td:l?e.tdCabecalho:c===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));r.push({tr:d,celulas:p})}return{linhas:r}}var Le=e=>Array.from(e.querySelectorAll("td, th"));function nt(e,o,t,r,a){let l=e.adaptador,d=Array.from(t.querySelectorAll("tr")),p=gr(r,d.length,Math.max(0,...d.map(n=>Le(n).length)));if(l.versao===5){let n=o,c=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,i=j(n,t.closest("figure")??t);return!c||!i?!1:J(e,i)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{c.setModelHtmlStyles("table",qe(r.table),i),d.forEach((u,x)=>{let s=p.linhas[x];if(!s)return;let f=j(n,u);f&&c.setModelHtmlStyles("tr",qe(s.tr),f),Le(u).forEach((m,g)=>{let h=j(n,m);if(h){c.setModelHtmlStyles("td",qe(s.celulas[g]?.td??""),h);for(let v of h.getChildren())v.name==="paragraph"&&n.model.change(E=>E.setAttribute("estilo",s.celulas[g]?.p,v))}})}),r.cabecalho&&n.model.change(u=>u.setAttribute("headingRows",1,i))}),!0)}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let n=t.ownerDocument;if(t.setAttribute("style",r.table),d.forEach((c,i)=>{let u=p.linhas[i];u&&(c.setAttribute("style",u.tr),Le(c).forEach((x,s)=>{x.setAttribute("style",u.celulas[s]?.td??"");let f=u.celulas[s]?.p??"",m=x.querySelectorAll("p");if(m.length)for(let g of m)g.setAttribute("class",f);else{let g=n.createElement("p");g.setAttribute("class",f),g.append(...Array.from(x.childNodes)),x.append(g)}}))}),r.cabecalho&&d[0]&&!t.querySelector("thead")){let c=n.createElement("thead");c.append(d[0]),t.prepend(c)}a?.aoFinalCk4?.(t)}),!0)}var at="color1",br="Clique na tabela que deseja aplicar o estilo!",Pe="dark-mode-color-";function hr(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function xr(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${Pe}black`,`${Pe}white`),o.classList.add(`${Pe}${hr(t)>125?"black":"white"}`))}}var it={id:"table-styles",globais(e){let o=e.adaptador,t=n=>o.getSelectionElement(n)?.closest("table")??null;function r(n,c){let i=n.querySelector("#addEstiloTabela");i&&c&&/^color\d+$/.test(c)&&(i.className=c)}function a(n,c,i,u=!0,x){let s=i??o.getInstance();if(!s||!c)return;let[f,m,g]=c,h=Y[m],v=Number(g),E=h&&Number.isFinite(v)?Me(h,v)[f]:void 0,y=x?.isConnected?x:x?null:t(s);!E||!y||nt(e,s,y,{...E,cabecalho:u},{aoFinalCk4:xr})}function l(){let n=Object.keys(Y),c=Object.keys(Me(Y[at])),i=b("div",{id:"selectColorTabela",class:"listaCoresTabela"},...n.map((x,s)=>b("span",{},b("label",{for:`colorStyle${s+1}`},b("a",{class:"iconSelectColorTable",style:`background-color: ${Y[x]?.light}`}),b("a",{class:"iconSelectColorTable",style:`background-color: ${Y[x]?.dark}`})),b("br"),b("input",{type:"radio",name:"colorStyle","data-colorid":x,id:`colorStyle${s+1}`,value:`colorStyle${s+1}`,...s===0?{checked:"checked"}:{}})))),u=[];return c.forEach((x,s)=>{s%7===0&&u.push(b("div",{class:"listaEstiloTabela"}));let f=s+1;u[u.length-1]?.append(b("span",{},b("label",{for:`tableStyle${f}`},b("a",{class:"iconSelectStyleTable",style:`background-position-y: -${f*43}px`})),b("br"),b("input",{type:"radio",name:"tableStyle",id:`tableStyle${f}`,value:`tableStyle${f}`,...s===0?{checked:"checked"}:{}})))}),b("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},b("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),i,b("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),b("div",{id:"addEstiloTabela",class:at},...u),b("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",b("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),b("div",{style:"padding: 10px 0;"},b("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",b("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function d(n){try{let c=u=>Number.parseFloat(u?e.win.getComputedStyle(u).width:""),i=Math.round(100*c(n)/c(n?.parentElement??null));return Number.isFinite(i)?Math.min(100,Math.max(5,i)):80}catch{return 80}}function p(n,c){let i=c??o.getInstance();if(!i)return;let u=t(i),x=l(),s=x.querySelector("#addEstiloTableWidth");s&&(s.value=String(d(u)));for(let m of x.querySelectorAll('input[name="colorStyle"]'))m.addEventListener("change",()=>r(x,m.getAttribute("data-colorid")));let f=q(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:b("div",{},x,b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:()=>{let m=x.querySelector('input[name="tableStyle"]:checked')?.value,g=x.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),h=x.querySelector("#addEstiloTableWidth")?.value,v=x.querySelector("#addEstiloTableHeader:checked")!==null;!m||!g||!h||(a(null,[m,g,h],i,v,u),f.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(n){let c=o.getInstance(n);c&&(t(c)?p(null,c):T(e.doc,br))},changeColorTable(n){r(e.doc,n?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:n=>p(null,n),getSyleTable(n){let c=o.getInstance(n);c&&o.withEdit(c,()=>{})},setSyleTable:(n,c)=>a(null,n,c)}}};var st=/^[0-9A-Za-z-]+$/,vr="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",yr=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,lt={id:"tiny-url",globais(e){let o=d=>T(e.doc,d),t=d=>(e.fetch??e.win.fetch.bind(e.win))(d);async function r(d,p,n,c){let i=new URLSearchParams({url:d});p!==""&&i.set("alias",p);let u;try{u=await t(`https://tinyurl.com/api-create.php?${i}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(u.status===400)return o("Erro: Nenhuma link gerado"),!1;if(u.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let x=(await u.text()).trim();if(u.status!==200||!yr.test(x))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(x),!0;let s=c??e.adaptador.getInstance();if(!s)return!1;let f=`<a href="${A(x)}" class="ancoraSei" target="_blank">${A(x)}</a>`;return e.adaptador.withEdit(s,()=>e.adaptador.insertHtml(s,f)),!0}function a(d){let p=e.adaptador.getInstance(d);if(!p)return;let n=b("input",{type:"text",id:"urlTiny"}),c=b("input",{type:"text",id:"aliasTiny"}),i=b("div",{id:"tinyResult"}),u=String(e.win.getSelection?.()??"").trim();u!==""&&Q(u)&&(n.value=u),c.addEventListener("input",()=>{i.replaceChildren();let s=c.value;s!==""&&(st.test(s)?i.append(`Resultado: https://tinyurl.com/${s}`):i.append(b("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let x=q(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:O(R("Insira o link que deseja encurtar:",n),R("Insira um Nome Personalizado para o link (opcional):",c),i,b("div",{class:"spro-dialogo-rodape"},b("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let s=n.value.trim(),f=c.value.trim();if(s===""||!Q(s))return o("Digite um link v\xE1lido!");if(f!==""&&!st.test(f))return o(vr);if(f!==""&&f.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(s,f,"insert",p)&&x.fechar()}},"Inserir")))})}return{getTinyUrl:a,ajaxTinyUrl:(d,p,n)=>r(d,p,n)}}};var Re=[yo,Bo,Zo,so,ao,Je,go,ot,Wo,fo,lt,Eo,co,To,it,rt,Yo,jo,Vo];function ct(e,o,t){let r=e,a=[],l=[];for(let d of o){let p=!0;try{for(let[n,c]of Object.entries(d.globais(t))){if(r[n]!==void 0){p=!1,l.push({id:d.id,erro:new Error(`global ja definido: ${n}`)});continue}r[n]=c}}catch(n){p=!1,l.push({id:d.id,erro:n})}p&&a.push(d.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:d.id})}catch{}}return{instalados:a,falhas:l}}function dt(e,o){let t=[];for(let r of e)try{r.iniciar?.(o)}catch(a){t.push({id:r.id,erro:a})}return t}var ut=`/*
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
`;be(ut);var pt="__seiProEditorTs",mt=window;if(!mt[pt]){mt[pt]=!0;let e=ze(window);e.aoRecusarEscrita(()=>T(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(Oe)??"",checkOpcao:t=>Ue(t),verifyOpcao:t=>Ge(t)};for(let t of ct(window,Re,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of dt(Re,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
