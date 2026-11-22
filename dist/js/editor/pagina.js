/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Y(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(a=>e.importNode(a,!0))}function me(e,o){if(!e||typeof o!="function")return;let t=e,r=t.__seiProCtxBuilders;if(!r){let a=[];r=t.__seiProCtxBuilders=a,e.addEventListener("contextmenu",l=>{let d=l;if(d.shiftKey)return;let p=[];for(let n of a)try{p=p.concat(n(d.target)||[])}catch{}p.length&&(d.preventDefault(),qt(e.ownerDocument,p,d.clientX,d.clientY))})}r.includes(o)||r.push(o)}function qt(e,o,t,r){e.getElementById("seiProCtxMenu")?.remove();let a=e.createElement("div");a.id="seiProCtxMenu",a.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",a.style.left=`${t}px`,a.style.top=`${r}px`;for(let d of o){let p=e.createElement("div");p.textContent=d.label,p.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",p.addEventListener("mouseenter",()=>{p.style.background="#eef"}),p.addEventListener("mouseleave",()=>{p.style.background=""}),p.addEventListener("click",()=>{a.remove(),d.action()}),a.append(p)}e.body.append(a);let l=()=>{a.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function Ge(e,o,t){if(typeof t!="function")return;let r=e.__seiProCtx;if(!r){let a={acoes:{},construtores:[]};r=e.__seiProCtx=a;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let d=l?.$??null,p=null;for(let n of a.construtores){let c=[];try{c=n(d)||[]}catch{c=[]}for(let s of c){let u=`seiPro_${String(s.label).replace(/[^A-Za-z0-9]/g,"_")}`;a.acoes[u]=s.action,e.getCommand(u)||e.addCommand(u,{exec:()=>(a.acoes[u]?.(),!0)}),e.getMenuItem(u)||e.addMenuItem(u,{label:s.label,command:u,group:"seiProGroup"}),p=p??{},p[u]=o}}return p})}r.construtores.includes(t)||r.construtores.push(t)}var N=e=>e;function Je(e,o={}){let t=()=>e.CKEDITOR,r=n=>!!n?.name&&t()?.instances[n.name]===n,a=n=>r(n)&&!n.readOnly,l=n=>N(n).document?.getBody()?.$??null,d=(n,c)=>{if(!n)return;let s=N(n);if(s.readOnly){o.fn?.();return}c(s)},p={versao:4,getInstance(n){let c=t();if(!c?.instances)return null;if(r(c.currentInstance))return c.currentInstance;let s=n?.closest?.("div.cke"),u=s?c.instances[s.id.replace("cke_","")]:void 0;if(a(u))return u;if(a(e.oEditor))return e.oEditor;let x=Object.values(c.instances);return x.find(i=>a(i))??x[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>N(n).focus(),saveSnapshot:n=>N(n).fire("saveSnapshot"),withEdit(n,c){let s=N(n);s.focus(),s.fire("saveSnapshot"),s.fire("lockSnapshot",{dontUpdate:!0});try{c()}finally{s.fire("unlockSnapshot"),s.fire("saveSnapshot")}},insertHtml:(n,c)=>d(n,s=>s.insertHtml(c)),insertText:(n,c)=>d(n,s=>s.insertText(c)),getSelectionElement:n=>N(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return p.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,c,s){d(n,()=>c.before(...Y(c.ownerDocument,s)))},getToolbarContainer:n=>N(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>l(n),findInBody(n,c){let s=l(n);return s?Array.from(s.querySelectorAll(c)):[]},appendToBody(n,c){d(n,s=>{let u=l(s);u&&u.append(...Y(u.ownerDocument,c))})},transformBodyHtml(n,c){d(n,s=>{let u=l(s);if(!u)return;let x=u.innerHTML,i=c(x);typeof i=="string"&&i!==x&&u.replaceChildren(...Y(u.ownerDocument,i))})},execCommand:(n,c,s)=>N(n).execCommand(c,s),applyStyle(n,c){let s=t()?.style;s&&N(n).applyStyle(new s(c))},getData:n=>N(n).getData(),setData:(n,c)=>d(n,s=>s.setData(c)),insertElement(n,c){d(n,s=>{let u=t()?.dom?.element.createFromHtml;u&&s.insertElement?s.insertElement(u(c,s.document)):s.insertHtml(c)})},saveSelection:n=>N(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,c){let s=N(n).getSelection();s&&c&&s.selectBookmarks(c)},getSelectedText:n=>N(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return N(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,c,s)=>N(n).on(c,s),off:(n,c,s)=>N(n).removeListener(c,s),fire:(n,c,s)=>N(n).fire(c,s),addContextMenu(n,c){let s=N(n),u=t();if(u&&s.contextMenu&&typeof s.addMenuItem=="function"){Ge(s,u.TRISTATE_OFF,c);return}me(l(n),c)},waitReady(n){return new Promise((c,s)=>{let u=Date.now(),x=()=>{let i=Object.values(t()?.instances??{}).find(f=>f.status==="ready");if(i)return c(i);if(Date.now()-u>n)return s(new Error("Timeout aguardando CKEditor 4"));setTimeout(x,100)};x()})},somenteLeitura:n=>!!N(n).readOnly,aoRecusarEscrita(n){o.fn=n},recusarEscrita(){o.fn?.()}};return p}var $=e=>e,Pt={strike:"strikethrough",strikethrough:"strikethrough"},Rt={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},It=0;function Ke(e,o={}){let t=e.document,r=i=>Array.from(i.model.document.roots??[]).filter(f=>f.isAttached()&&f.rootName!=="$graveyard"),a=i=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[i],l=(i,f)=>{let m=i.editing.view.document.getRoot(f);return m?i.editing.view.domConverter.mapViewToDom(m):null},d=i=>{for(let b of r(i))if(a(b.rootName)?.principal){let h=l(i,b.rootName);if(h)return h}let f=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return f||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((b,h)=>h.childElementCount>(b?b.childElementCount:-1)?h:b,null)},p=i=>{let f=d(i);return f&&r(i).find(m=>l(i,m.rootName)===f)||null},n=i=>i.model.document.selection.getFirstPosition()?.root.rootName??null,c=i=>!!i&&!!a(i)?.somenteLeitura,s=(i,f)=>i.data.toModel(i.data.processor.toView(f)),u=(i,f)=>{let m=$(i);if(c(n(m)))return o.fn?.();m.model.change(()=>m.model.insertContent(s(m,f),m.model.document.selection))},x={versao:5,getInstance(){let i=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return i&&i.state==="ready"?i:null},getAllInstances(){let i=x.getInstance();return i?[i]:[]},focus:i=>$(i).focus(),saveSnapshot(){},withEdit(i,f){let m=$(i);m.focus(),m.model.change(()=>f())},insertHtml:u,insertText(i,f){let m=$(i);if(c(n(m)))return o.fn?.();m.model.change(b=>m.model.insertContent(b.createText(f)))},getSelectionElement(){let i=e.getSelection?.(),f=i&&i.rangeCount>0?i.anchorNode:null;return f?f.nodeType===1?f:f.parentElement:null},getSelectionParagraph:i=>x.getSelectionElement(i)?.closest("p")??null,insertHtmlBefore(i,f,m){let b=$(i),h=b.editing.view.domConverter.mapDomToView(f),E=h?b.editing.mapper.toModelElement(h):null;if(E){if(c(E.root?.rootName))return o.fn?.();b.model.change(A=>b.model.insertContent(s(b,m),A.createPositionBefore(E)));return}u(i,m)},getToolbarContainer(i){let f=$(i).ui?.view?.toolbar?.element;return f?f.querySelector(".ck-toolbar__items")??f:null},getBodyContainer:i=>d($(i)),findInBody(i,f){let m=d($(i));return m?Array.from(m.querySelectorAll(f)):[]},appendToBody(i,f){let m=$(i),b=p(m);if(!b)return u(i,f);if(c(b.rootName))return o.fn?.();m.model.change(h=>m.model.insertContent(s(m,f),h.createPositionAt(b,"end")))},transformBodyHtml(i,f){let m=$(i),b=p(m);if(!b)return;let h=m.data.get({rootName:b.rootName,seiProInterno:!0}),E=f(h);if(typeof E!="string"||E===h)return;let A=m.model.document.selection.getFirstRange(),y=A&&A.start.root.rootName===A.end.root.rootName?{raiz:A.start.root,ps:[...A.start.path],pe:[...A.end.path]}:null,C=m.model.document.selection.isBackward;m.data.set({[b.rootName]:E}),y&&m.model.change(S=>{let v,k;try{v=m.model.createPositionFromPath(y.raiz,y.ps),k=m.model.createPositionFromPath(y.raiz,y.pe)}catch{v=k=S.createPositionAt(y.raiz,"end")}S.setSelection(S.createRange(v,k),{backward:C})})},execCommand(i,f,m){$(i).execute(Pt[f]??f,m!==void 0?{value:m}:void 0)},applyStyle(i,f){let m=Rt[f.element.toLowerCase()];m&&$(i).execute(m)},getData(i){let f=$(i),m=p(f);return m?f.data.get({rootName:m.rootName}):f.data.get()},setData(i,f){let m=$(i),b=p(m);b?m.data.set({[b.rootName]:f}):m.data.set(f)},insertElement:(i,f)=>x.insertHtml(i,f),saveSelection(i){let f=$(i),m=`spro-ed:${It++}`;return f.model.change(b=>{let h=f.model.document.selection.getFirstRange();h&&b.addMarker(m,{range:h,usingOperation:!1})}),m},restoreSelection(i,f){let m=$(i);if(typeof f!="string")return;let b=m.model.markers.get(f);b&&m.model.change(h=>h.setSelection(b.getRange())),m.model.change(h=>{m.model.markers.has(f)&&h.removeMarker(f)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let i=e.getSelection?.();if(!i||i.rangeCount===0)return"";let f=t.createElement("div");return f.append(i.getRangeAt(0).cloneContents()),f.innerHTML},on(i,f,m){if(f==="change")return $(i).model.document.on("change:data",m);d($(i))?.addEventListener(f,m)},off(i,f,m){if(f==="change")return $(i).model.document.off("change:data",m);d($(i))?.removeEventListener(f,m)},fire(i,f,m){d($(i))?.dispatchEvent(new CustomEvent(f,{detail:m}))},addContextMenu(i,f){me(d($(i)),f)},waitReady(i){return new Promise((f,m)=>{let b=Date.now(),h=()=>{let E=x.getInstance();if(E)return f(E);if(Date.now()-b>i)return m(new Error("Timeout aguardando CKEditor 5"));setTimeout(h,100)};h()})},somenteLeitura:i=>c(n($(i))),aoRecusarEscrita(i){o.fn=i},recusarEscrita(){o.fn?.()}};return x}function ke(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function We(e){let o=null,t={},r=()=>{if(o)return o;let d=ke(e);return d===5?o=Ke(e,t):d===4&&(o=Je(e,t)),o},a=()=>{let d=r();if(!d)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return d},l=d=>((...p)=>a()[d](...p));return{get versao(){return r()?.versao??0},getInstance:d=>r()?.getInstance(d)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(d){t.fn=d},recusarEscrita(){t.fn?.()},waitReady(d){let p=Date.now();return new Promise((n,c)=>{let s=()=>{let u=r();if(u)return u.waitReady(Math.max(1,d-(Date.now()-p))).then(n,c);if(Date.now()-p>d)return c(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(s,100)};s()})}}}var Xe="data-base";function Ye(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===o)?.value}function Ze(e,o){let t=Ye(e,o);return!(t===!1||t===0||t==="")}function eo(e,o){let t=Ye(e,o);return t===!0||t===1||t==="1"}function oo(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function to(e,o=localStorage){return Ze(oo(o),e)}function ro(e,o=localStorage){return eo(oo(o),e)}function fe(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function ge(e){e.style.display="none"}var no=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function ao(e){let o=()=>e.adaptador.versao===5,t=(r,a)=>{let l=r.editing.view.domConverter.mapDomToView(a);return l?r.editing.mapper.toModelElement(l):null};return{selecionados(r){let a=()=>{let i=e.adaptador.getSelectionParagraph(r);return i?[i]:[]};if(o()){let i=r,m=[...i.model.document.selection.getSelectedBlocks()].map(b=>{let h=i.editing.mapper.toViewElement(b);return h?i.editing.view.domConverter.mapViewToDom(h):null}).filter(b=>!!b&&b.tagName==="P");return m.length?m:a()}let d=e.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!d||d.rangeCount===0||!d.anchorNode)return a();let p=no(d.anchorNode),n=no(d.focusNode);if(!p&&!n||(p=p??n,n=n??p,!p||!n))return a();if(p===n)return[p];let c=p,s=n;p.compareDocumentPosition(n)&2&&(c=n,s=p);let u=[],x=c;for(let i=0;x&&i<5e3&&(x.tagName.toLowerCase()==="p"&&u.push(x),x!==s);i+=1)x=x.nextElementSibling;return u.length?u:[c]},classeDeEstilo(r,a){return o()?t(r,a)?.getAttribute("estilo")??"":a.getAttribute("class")??""},definirClasse(r,a,l){if(o()){let d=r,p=t(d,a);p&&d.model.change(n=>n.setAttribute("estilo",l,p)),e.win.SeiProGhs?.setEstilos(a,{"text-align":null},r);return}a.removeAttribute("style"),a.setAttribute("class",l)},definirTextAlign(r,a,l){if(o()){e.win.SeiProGhs?.setEstilos(a,{"text-align":l},r);return}a.removeAttribute("style"),a.style.textAlign=l}}}var Dt=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function $t(e,o){let t=Dt.find(r=>Object.values(r).includes(e));return t?t[o]:null}function Nt(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=e?.parentElement??null;r;r=r.parentElement){let a=r.querySelector(".divAlignText");if(a)return a}return o.querySelector(".divAlignText")}var io={id:"align",globais(e){let o=ao(e);return{setAlignText(t,r){let a=e.adaptador.getInstance(t);if(!a||e.adaptador.somenteLeitura(a))return;let l=o.selecionados(a);l.length&&e.adaptador.withEdit(a,()=>{for(let d of l){let p=$t(o.classeDeEstilo(a,d),r);p?o.definirClasse(a,d,p):o.definirTextAlign(a,d,r)}})},openAlignText(t){if(!t)return;let r=Nt(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&ge(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&fe(r))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function g(e,o={},...t){let r=document.createElement(e);for(let[a,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?r.addEventListener(a.replace(/^on/,""),l):l===!0?r.setAttribute(a,""):a==="class"?r.className=l:a==="value"&&e==="textarea"?r.value=l:r.setAttribute(a,l));for(let a of t)a!=null&&a!==!1&&r.append(a);return r}var F={fill:"currentColor",stroke:"none"},so="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",lo={estrela:[["path",{d:so}]],estrelaCheia:[["path",{d:so,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...F}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...F}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...F}],["circle",{cx:"12",cy:"12",r:"1.4",...F}],["circle",{cx:"19",cy:"12",r:"1.4",...F}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...F}],["circle",{cx:"15",cy:"6",r:"1.3",...F}],["circle",{cx:"9",cy:"12",r:"1.3",...F}],["circle",{cx:"15",cy:"12",r:"1.3",...F}],["circle",{cx:"9",cy:"18",r:"1.3",...F}],["circle",{cx:"15",cy:"18",r:"1.3",...F}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},xn=Object.keys(lo);function le(e,o=18,t=document){let r="http://www.w3.org/2000/svg",a=t.createElementNS(r,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[d,p]of Object.entries(l))a.setAttribute(d,p);for(let[d,p]of lo[e]){let n=t.createElementNS(r,d);for(let[c,s]of Object.entries(p))n.setAttribute(c,s);a.append(n)}return a}function Ht(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function co(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function uo(e,o,t,r,a){let l=e.body??e.documentElement;for(let u of[l,...e.querySelectorAll("dialog")])for(let x of[...u.children])x.classList.contains("spro-aviso")&&x.remove();let d=g("div",{class:"spro-aviso",role:"status"},le("check",16),g("span",{},o),...Ht(t).map(u=>g("button",{type:"button",onclick:()=>{d.remove(),u.fazer()}},u.rotulo)));d.setAttribute("popover","manual");let p=()=>{try{d.showPopover?.()}catch{}},n=Date.now()+r,c=()=>{let u=co(e);u.append(d),p(),u.localName==="dialog"&&u.addEventListener("close",()=>{if(!(!s||!u.contains(d))){if(a&&co(e).localName!=="dialog"&&a(o,t,Math.max(0,n-Date.now()))){s=!1,d.remove();return}c()}},{once:!0})},s=!0;return c(),setTimeout(()=>{s=!1,d.remove()},r),d}var Qt=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function po(e={}){return({titulo:o,conteudo:t,icone:r,aoFechar:a})=>{let l=g("dialog",{class:"spro-dialogo","aria-label":o}),d=()=>{l.open&&l.close()};return l.append(g("header",{},r?g("span",{class:"spro-dialogo-icone","aria-hidden":"true"},le(r,18)):null,g("h2",{},o),g("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:d},le("fechar",16))),g("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),a?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(Qt)?.focus({preventScroll:!0}),{fechar:d}}}function mo(e){let o=po();return(t,r)=>(Ce(t,e),o(r))}function Ce(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var Ae="";function Se(e){Ae=e}var H=(e,o)=>mo(Ae)(e,o);function fo(e){Ce(e,Ae)}function I(e,o){fo(e),uo(e,o,void 0,7e3)}var Ot=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),go=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function zt(e){let o=0,t=e.split("");return t.forEach((r,a)=>{let l=go.get(r),d=go.get(t[a+1]);o+=l<d?-l:l}),o}function Z(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Ot.has(o.toLowerCase())&&t!==0?o.toLowerCase():zt(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function R(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var bo={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let r=e.adaptador.getSelectedText(t);if(!r||r.trim()===""){I(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,R(Z(r)))}})};var ho="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function J(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let r of o)t+=ho[r%ho.length];return t}var jt=()=>`<span class="ancoraSei checkboxSEI" data-id="${J(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,xo={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,jt()))}})};var we="copyStylePro",Te="cke_copyformatting_active",vo=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function Bt(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),r=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&r?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var yo={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(we)??"null")}catch{return null}},a=s=>o.getSelectedHtml(s).trim()!==""||o.getSelectedText(s).trim()!=="",l=s=>!!o.getBodyContainer(s)?.classList.contains(Te),d=s=>{for(let u of e.doc.querySelectorAll(".getCopyStyleButtom"))s==="desabilitar"?u.classList.add("cke_button_disabled"):s==="habilitar"?u.classList.remove("cke_button_disabled"):(u.classList.toggle("cke_button_on",s),u.classList.toggle("cke_button_off",!s))};function p(){let s=o.getInstance();s&&o.getBodyContainer(s)?.classList.remove(Te),t().removeItem(we),d(!1)}function n(s){let u=s??o.getInstance();if(!u)return;if(l(u)){p();return}let x=o.getSelectionElement(u);x&&(t().setItem(we,JSON.stringify(Bt(x))),o.getBodyContainer(u)?.classList.add(Te),d(!0))}function c(){let s=o.getInstance();if(!s)return;let u=a(s),x=l(s);d(u||x?"habilitar":"desabilitar");let i=r();if(!(i&&u&&x))return;o.withEdit(s,()=>{o.execCommand(s,"removeFormat");for(let[b,h]of[[i.bold,"bold"],[i.underline,"underline"],[i.italic,"italic"],[i.strike,"strike"],[i.subscript,"subscript"],[i.superscript,"superscript"]])b===!0&&o.execCommand(s,h);let m=[];if(typeof i.backgroundColor=="string"&&vo.test(i.backgroundColor)&&m.push(`background-color: ${i.backgroundColor}`),typeof i.fontSize=="number"&&Number.isFinite(i.fontSize)&&i.fontSize>0&&i.fontSize<400&&m.push(`font-size: ${i.fontSize}px`),typeof i.color=="string"&&vo.test(i.color)&&m.push(`color: ${i.color}`),m.length){let b=o.getSelectedHtml(s);b!==""&&o.insertHtml(s,`<span style="${m.join("; ")}">${b}</span>`)}}),!!e.win.event?.altKey||p()}return{setCopyStyle(s){let u=o.getInstance(s);u&&n(u)},actionCopyStyle:n,getCopyStyle:r,applyCopyStyle:c,removeCopyStyle:p,menuCopyStyle(s){s&&o.addContextMenu(s,u=>o.versao===5?[]:u?.closest("p")&&a(s)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(s)}]:[])}}}};var _e="spro_editor_folha",Eo="seipro-folha-editor",Me="data-spro-folha-editor",Ft=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function Vt(e){let o=`html[${Me}]`,t=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",a="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${a}, -14px 0 24px -14px ${a}`,d=`0 14px 24px -14px ${a}`,p=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${p} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${p}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${p}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${d}; clip-path: inset(0 -30px -30px); }
${p}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${p} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${r} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function ko(e,o){if(!e.head||(e.querySelector(`style[data-style="${Eo}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",Eo),t.textContent=o,e.head.append(t)}function Co(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[r,a]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,a||"")}}var Ao={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(_e),r=()=>!!e.win.localStorage?.getItem("darkModePro"),a=!1;function l(n){for(let c of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let s=c.contentDocument;s?.head&&(ko(s,n?Ft:null),Co(s.documentElement,n),Co(s.body,n))}}function d(n){let c=[...o.querySelectorAll(".cke_contents")];c.forEach((s,u)=>{if(!n){s.removeAttribute("data-spro-folha");return}let x=[u===0?"primeira":"",u===c.length-1?"ultima":""].filter(Boolean);s.setAttribute("data-spro-folha",x.join(" ")||"meio")})}function p(n){ko(o,n?Vt(r()):null),l(n),d(n),n?o.documentElement.setAttribute(Me,""):o.documentElement.removeAttribute(Me);for(let c of o.querySelectorAll(".getPaperViewButtom"))c.classList.toggle("cke_button_on",n),c.classList.toggle("cke_button_off",!n),c.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:p,getPaperViewButtom(n){let c=!t();c?e.win.localStorage.setItem(_e,"1"):e.win.localStorage.removeItem(_e),p(c)},initFolhaEditorPro(){let n=e.win.CKEDITOR;if(typeof n?.on=="function"&&!a){a=!0;let c=s=>s.on("contentDom",()=>t()&&l(!0));for(let s of Object.values(n.instances??{}))c(s);n.on("instanceReady",s=>c(s.editor))}p(t())}}}};function Ut(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var So={id:"font-size",globais:e=>({changeFontSize(o,t){let r=e.adaptador.getInstance(o);if(!r)return;let a=e.adaptador.getSelectedHtml(r);if(!a||a.trim()===""){I(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=Ut(e.adaptador.getSelectionElement(r)),d=t==="up"?l+2:l-2;d>7&&d<70&&e.adaptador.withEdit(r,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${d}px`}}):e.adaptador.insertHtml(r,`<span style="font-size: ${d}px">${a}</span>`)})}})};var be=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Gt=[{name:be,attributes:!0},{name:be,classes:!0},{name:be,styles:!0}],ce=e=>e.split("").join("[\\t\\n\\r]*"),Le=new RegExp(`^[\\s\\x00-\\x20]*(${ce("javascript")}|${ce("vbscript")}|${ce("livescript")}|${ce("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${ce("text/html")})`,"i"),Jt=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:Le}]}];function oe(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function de(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var Kt=e=>!!(e?.model&&e.editing&&e.conversion),Wt=e=>de(e,"EstiloEditing")?.estilos??{},wo=(e,o)=>Object.hasOwn(e,o);function Mo(e,o){let t=de(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function Xt(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function Yt(e,o,t){if(!o?.is?.("element"))return;let r=t.mapper.toViewElement(o);if(!r)return;let a=Wt(e),l=o.getAttribute("estilo"),d=Xt(o,Mo(e,"p")),p=t.writer,n=[];try{n=Array.from(r.getClassNames())}catch{}for(let c of n)c!==l&&wo(a,c)&&p.removeClass(c,r);for(let c of d)wo(a,c)||p.addClass(c,r);l&&p.addClass(l,r)}function Zt(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Mo(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let r of o)t.on(r,(a,l,d)=>{try{Yt(e,l.item,d)}catch{}},{priority:"lowest"})})}function er(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function To(e,o){let t=de(o,"Salvar"),r=t?!!t.isDirty:!1;try{e()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function or(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function tr(e,o){let t=e.getFullData({seiProInterno:!0}),r=o.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||or(e)?t:Object.fromEntries(Object.keys(t).map(a=>[a,typeof r[a]=="string"?r[a]:t[a]]))}function rr(e,o,t){try{let r=t??e.adaptador.getSelectionParagraph(o);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let a=r.jquery?r.get(0):r;if(a?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(a);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function nr(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function _o(e){let o=l=>l??e.adaptador.getInstance();function t(l){let d=o(l);if(!Kt(d))return!1;if(d.__seiProGhsLiberado)return!0;let p=de(d,"DataFilter");if(!p)return oe("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{p.allowElement({name:be,attributes:!0,classes:!0,styles:!0});for(let n of Gt)p.allowAttributes(n);if(typeof p.disallowAttributes=="function")for(let n of Jt)p.disallowAttributes(n)}catch(n){return oe("falha ao liberar o GHS",n),!1}return d.__seiProGhsLiberado=!0,Zt(d),!0}function r(l){let d=o(l);if(!t(d)||typeof d.getFullData!="function")return!1;let p=!0;return To(()=>{try{d.data.set(tr(d,e.win))}catch(n){oe("falha ao reprocessar o conteudo",n),p=!1}},d),p}function a(l,d,p){let n=o(l);if(!t(n))return!1;let c=de(n,"GeneralHtmlSupport"),s=rr(e,n,d),u=s?nr(n,s):null;if(!c||!s||!u)return!1;try{return p(c,u,s),!0}catch(x){return oe("falha ao aplicar no model",x),!1}}return{liberar:t,aplicarRegras:r,semSujar:(l,d)=>To(l,o(d)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,d,p)=>a(p,l,(n,c,s)=>n.addModelHtmlClass(c,d,s)),removeClasse:(l,d,p)=>a(p,l,(n,c,s)=>n.removeModelHtmlClass(c,d,s)),setEstilos:(l,d,p)=>a(p,l,(n,c,s)=>n.setModelHtmlStyles(c,d,s)),setAtributos:(l,d,p)=>a(p,l,(n,c,s)=>n.setModelHtmlAttributes(c,d,s))}}var Lo={id:"ghs-unlock",globais:e=>({SeiProGhs:_o(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=_o(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||er(t)){oe("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&oe("classes, estilos e atributos liberados no editor")}}};function K(...e){return g("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function z(e,o){return o.classList.add("spro-campo"),o.style.width="100%",g("label",{style:"display:grid;gap:4px;font-size:13px;"},g("span",{},e),o)}function qo(e,o){return new Promise((t,r)=>{let a=new e.Image;a.crossOrigin="anonymous",a.onload=()=>{try{let l=e.document.createElement("canvas");l.width=a.width,l.height=a.height,l.getContext("2d")?.drawImage(a,0,0),t(l.toDataURL("image/png"))}catch(l){r(l)}},a.onerror=()=>r(new Error("imagem nao carregou")),a.src=o})}var ar="https://latex.codecogs.com/png.latex?",ir="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",sr="https://editor.codecogs.com/",Po={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(n=>qo(e.win,n)),r=n=>I(e.doc,n);function a(){let n=o;if(!n)return;let c=n.texto.value;n.geracao+=1;let s=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,c==="")return;let u=g("img",{src:`${ar}${encodeURI(c)}`});n.previa.append(u),t(u.getAttribute("src")??"").then(x=>{o!==n||n.geracao!==s||(u.setAttribute("src",x),u.className="img-base64",n.pronta=!0)},()=>{o===n&&n.geracao===s&&(n.falhou=!0)})}function l(){let n=o;if(!n)return!1;let c=n.texto.value;if(c==="")return r("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let s=n.previa.querySelector("img");if(!n.pronta||!s)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let u=n.ed,x=`<img class="img-base64" src="${R(s.getAttribute("src")??"")}" alt="${R(c)}">`;return e.adaptador.withEdit(u,()=>e.adaptador.insertHtml(u,x)),!0}function d(n){let c=e.adaptador.getInstance(n);if(!c)return;let s=g("textarea",{id:"MathText",rows:"5"});s.addEventListener("input",a);let u=g("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),x=H(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:K(z("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",s),u,g("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",g("a",{href:ir,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",g("a",{href:sr,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&x.fechar()}},"Inserir")))});o={ed:c,texto:s,previa:u,geracao:0,pronta:!1,falhou:!1};let i=String(e.win.getSelection?.()??"").trim();i!==""&&(s.value=i,a())}function p(){}return{updatePreviewLatex:a,openDialogLatex:d,getDialogLatex:p}}};function j(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var he="https://legis.seipro.app/v1",lr=50,cr={lei:"Lei","lei.complementar":"LC",decreto:"Dec","decreto.lei":"DecLei","medida.provisoria":"Mp","emenda.constitucional":"Ec","decreto.legislativo":"DecLeg",resolucao:"Res"};function dr(e){let o=String(e??""),t=o.split(","),r=/(\d{4})\s*$/.exec(o);return t.length>1&&r?`${(t[0]??"").trim()}, de ${r[1]}`:o}function ur(e){let o=String(e??"").replace(/\s+/g," ").trim();for(;/\s*\([^()]*\)$/.test(o);)o=o.replace(/\s*\([^()]*\)$/,"").trim();return!o||o===o.toUpperCase()?"":o}var pr=e=>j(e)?e:"";function Ro(e){return{sigla:e.tipo==="constituicao"?"Cf":(cr[e.tipo??""]??String(e.tipo??"").replace(/[^A-Za-z]/g,""))+String(e.numero??"").replace(/[^0-9-]/g,""),titulo:e.titulo||e.titulo_curto||"",curto:e.titulo_curto||dr(e.titulo),apelido:ur(e.apelido),url:pr(e.url||(e.urn?`https://normas.leg.br/?urn=${e.urn}`:"")),ementa:e.ementa||"",revogada:e.situacao==="revogada"}}function Io(e,o){let t=R,r=o?t(e.curto||e.titulo):t(e.titulo)+(e.apelido?`&nbsp;(${t(e.apelido)})`:""),a=e.url?` href="${t(e.url)}" target="_blank"`:"";return`<a class="ancoraSei legisSeiPro" data-norma="${t(e.sigla)}" data-normafull="${t(e.titulo)}" data-index="0"${a}>${r}</a>`}async function qe(e,o,t){let r=new URLSearchParams({per_page:String(lr)});for(let[p,n]of Object.entries(t))n!==""&&n!==null&&n!==void 0&&r.set(p,String(n));let a=await e(`${o}/normas?${r}`);if(!a.ok)throw new Error(`HTTP ${a.status}`);let l=await a.json(),d=(l?.itens??[]).map(Ro);return{total:l?.total??d.length,normas:d}}async function Do(e,o,t){let r=[];for(let l of t){let d=String(l??"").trim().slice(0,60);d&&!r.includes(d)&&r.push(d)}let a={};if(!r.length)return a;try{let l=await e(`${o}/normas/resolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refs:r.slice(0,200)})});if(!l.ok)return a;let d=await l.json();for(let[p,n]of Object.entries(d?.resultados??{}))n&&(a[p]=Ro(n))}catch{}return a}var Pe=e=>({ano:"exato",ate:"ate",apos:"apos"})[e]??"exato";function Re(e){let o=String(e??"").split(/[/-]/)[0]?.replace(/[^0-9]+/g,"");return o?Number.parseInt(o,10):""}function $o(e){let o=String(e??"").toLowerCase();return/emenda constitucional|\bec\b/.test(o)?"emenda.constitucional":/decreto legislativo/.test(o)?"decreto.legislativo":/lei complementar|\blc\b/.test(o)?"lei.complementar":/decreto-lei|decreto lei|\bdl\b/.test(o)?"decreto.lei":/medida provis[o\u00f3]ria|\bmp\b/.test(o)?"medida.provisoria":/decreto|\bdec\b/.test(o)?"decreto":/\blei\b/.test(o)?"lei":""}var mr=[["",""],["Lei","lei"],["Lei Complementar","lei.complementar"],["Decreto","decreto"],["Decreto-Lei","decreto.lei"],["Medida Provis\xF3ria","medida.provisoria"],["Emenda Constitucional","emenda.constitucional"],["Decreto Legislativo","decreto.legislativo"]],fr=[["",""],["No ano","ano"],["At\xE9 o ano de...","ate"],["Ap\xF3s o ano de...","apos"]],gr=[["",""],["ANTAQ","Antaq"],["Cade","Cade"],["PRF","PRF"],["TSE","Tse"],["TRE RR","Trerr"],["TJ RR","TJRR"],["CNJ","CNJ"]],br=[["",""],["Acordo/Plano/Ato/Nota","acord"],["Ata e Certid\xF5es de Julgamento","atas"],["Constitui\xE7\xE3o Estadual","ce"],["Decreto Estadual","decest"],["Edital","Edit"],["Enunciado Administrativo","enumadm"],["Emenda Constitucional","ec"],["Emenda Regimental","er"],["Emendas","Emenda"],["Instru\xE7\xE3o Normativa","in"],["Instru\xE7\xE3o Normativa Conjunta","resconj"],["Lei Complementar Estadual","lce"],["Lei Estadual","leiest"],["Lei Municipal","leimun"],["Nota T\xE9cnica","nt"],["Orienta\xE7\xE3o Normativa","on"],["Portaria","port"],["Portaria Conjunta","portconj"],["Portaria Interministerial","portinter"],["Portaria Interinstitucional","portinst"],["Provimento","prov"],["Recomenda\xE7\xE3o","Rec"],["Regimento Interno","regim"],["Resolu\xE7\xE3o Normativa","rn"],["Resolu\xE7\xE3o","res"],["Resolu\xE7\xE3o Conjunta","resconj"],["S\xFAmula Administrativa","sum"]],hr=[["",""],["C\xF3digo Brasileiro de Aeron\xE1utica","Lei7565/1986"],["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es","Lei4117/1962"],["C\xF3digo Civil","Lei10406/2002"],["C\xF3digo Comercial","Lei556/1850"],["C\xF3digo de Defesa do Consumidor","Lei8078/1990"],["Constitui\xE7\xE3o Federal","Cf"],["C\xF3digo Florestal","Lei12651/2012"],["Consolida\xE7\xE3o das Leis do Trabalho","DecLei5452/1943"],["C\xF3digo de \xC1guas","Dec24643/1934"],["C\xF3digo Eleitoral","Lei4737/1965"],["C\xF3digo de Minas","DecLei227/1967"],["C\xF3digo Penal","DecLei2848/1940"],["C\xF3digo de Processo Civil","Lei13105/2015"],["C\xF3digo Penal Militar","DecLei1001/1969"],["C\xF3digo de Processo Penal","DecLei3689/1941"],["C\xF3digo de Processo Penal Militar","DecLei1002/1969"],["C\xF3digo de Tr\xE2nsito Brasileiro","Lei9503/1997"],["C\xF3digo Tribut\xE1rio Nacional","Lei5172/1966"],["Estatuto da Crian\xE7a e do Adolescente","Lei8069/1990"],["Estatuto da Cidade","Lei10257/2001"],["Estatuto do Desarmamento","Lei10826/2003"],["Estatuto do Idoso","Lei10741/2003"],["Estatuto da Igualdade Racial","Lei12288/2010"],["Estatuto do \xCDndio","Lei6001/1973"],["Estatuto da Juventude","Lei12852/2013"],["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte","LC123/2006"],["Estatuto dos Militares","Lei6880/1980"],["Estatuto dos Museus","Lei11904/2009"],["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)","Lei8906/1994"],["Estatuto da Pessoa com Defici\xEAncia","Lei13146/2015"],["Estatuto dos Refugiados","Lei9474/1997"],["Estatuto da Terra","Lei4504/1964"],["Estatuto de Defesa do Torcedor","Lei10671/2003"]],xr="Servi\xE7o de legisla\xE7\xE3o indispon\xEDvel no momento. Tente novamente mais tarde.",No="Nenhuma legisla\xE7\xE3o encontrada";function vr(e){let o=e.replace(/(\r\n|\n|\r)/gm," ").trim();/[A-Z]/.test(o)&&o===o.toUpperCase()&&(o=o.charAt(0)+o.toLocaleLowerCase().slice(1));let t=o.length>170;return{curta:t?`${o.replace(/^(.{170}\S*)[\s\S]*/,"$1")}...`:o,completa:o,longa:t}}var Ho={id:"legis",globais(e){let o=e.adaptador,t=v=>I(e.doc,v),r=(v,k)=>(e.fetch??e.win.fetch.bind(e.win))(v,k),a=[],l=null,d=0;function p(v,k){Do(r,he,v??[]).then(k)}function n(v,k){let w=k??o.getInstance();if(!w||!v)return;let T=o.findInBody(w,"a").some(P=>v.url&&P.getAttribute("href")===v.url||P.getAttribute("data-norma")===v.sigla),M=o.saveSelection(w);o.focus(w),M&&o.restoreSelection(w,M),o.withEdit(w,()=>{o.insertElement(w,Io(v,T))})}function c(v){let k=o.getInstance();k&&p([v],w=>{let T=w[String(v??"").trim()];if(!T)return t(No);n(T,k)})}function s(v,k){let w=vr(v.ementa),T=v.revogada?"text-decoration:line-through;color:#adadad;":"",M=v.url?g("a",{class:"linkDialog",href:v.url,target:"_blank",rel:"noopener noreferrer"},v.titulo," \u2197"):g("span",{},v.titulo),P=g("button",{type:"button",class:"spro-botao","data-legis-idx":String(k),style:"float:right;margin-left:10px;",onclick:()=>E(P)},"Adicionar"),_=g("div",{class:"searchLegis_linha",style:"border-bottom:2px solid #efefef;padding:10px 0;"},g("p",{},M,v.apelido?g("span",{style:"opacity:.7;"},` (${v.apelido})`):null,v.revogada?g("span",{style:"background:#e0e0e0;padding:1px 5px;color:#444;border-radius:5px;margin-left:10px;"},"Revogada"):null,P));if(w.completa){let q=`font-style:italic;word-break:break-word;white-space:break-spaces;max-width:500px;padding:6px 0 0;${T}`;_.append(g("p",{class:"searchLegis_ementa",style:q},`${w.curta} `,w.longa?g("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",onclick:D=>A(D.currentTarget)},"mais"):null),g("p",{class:"searchLegis_ementafull",style:`display:none;${q}`},`${w.completa} `,g("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",onclick:D=>A(D.currentTarget)},"menos")))}return _}let u=v=>g("p",{style:"margin:10px;text-align:center;background:#fdfbe4;color:#333;padding:5px;border-radius:5px;"},v);function x(v,k,w,T){a=k;let M=v.querySelector("#searchLegis_result");if(!M)return;let P=[];T&&P.push(u(T)),P.push(...k.map((q,D)=>s(q,D))),w>k.length?P.push(u(`Mostrando ${k.length} de ${w} resultados. Restrinja sua pesquisa.`)):k.length||P.push(u("Nenhum resultado encontrado :(")),M.replaceChildren(...P),M.style.display="";let _=v.querySelector("#searchLegis_load");_&&(_.style.display="none")}function i(v){let k=v.querySelector("#searchLegis_load");k&&(k.style.display="none"),t(xr)}let f=(v,k)=>v.querySelector(`#${k}`)?.value??"",m=(v,k)=>{let w=v.querySelector("#searchLegis_load");w&&(w.style.display=k?"":"none")};function b(v){let k=v?.closest(".dialogBoxDiv")??e.doc.querySelector(".dialogBoxDiv");if(!k)return;let w=f(k,"legis_anoNorma").trim();m(k,!0);let T=k.querySelector("#searchLegis_result");T&&(T.style.display="none"),d+=1;let M=d;qe(r,he,{q:f(k,"legis_termoNorma").trim(),tipo:f(k,"legis_tipoNorma"),numero:Re(f(k,"legis_numeroNorma")),ano:w,periodo:w?Pe(f(k,"legis_periodoNorma")):""}).then(P=>M===d&&x(k,P.normas,P.total),()=>M===d&&i(k))}function h(v,k,w,T,M,P){m(v,!0),d+=1;let _=d;qe(r,he,{tipo:k,numero:w,ano:T,periodo:T?Pe(M):""}).then(({normas:q,total:D})=>{_===d&&(m(v,!1),q.length===1&&D<=1?(l?.(),n(q[0],P)):q.length?x(v,q,D||q.length,`H\xE1 ${D||q.length} normas com esse n\xFAmero. Escolha abaixo ou informe o ano.`):t(No))},()=>_===d&&i(v))}function E(v){let k=a[Number.parseInt(v?.getAttribute("data-legis-idx")??"",10)];k&&(l?.(),n(k))}function A(v){let k=v?.closest(".searchLegis_linha"),w=k?.querySelector(".searchLegis_ementa"),T=k?.querySelector(".searchLegis_ementafull");if(!w||!T)return;let M=w.style.display==="none";w.style.display=M?"":"none",T.style.display=M?"none":""}function y(v,k,w){return g("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},g("span",{},v),g("select",{id:k,style:"width:100%;"},...w.map(([T,M])=>g("option",{value:M},T))))}function C(v,k,w="text"){return g("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},g("span",{},v),g("input",{type:w,id:k,style:"width:100%;"}))}function S(v){let k=v??o.getInstance();if(!k)return;a=[];let w=[["federal","Legisla\xE7\xE3o Federal"],["infra","Norma Infralegal"],["lista","Lista de Normas"]],T=new Map,M=new Map,P=L=>{for(let[O]of w)T.get(O)?.setAttribute("aria-selected",String(O===L)),T.get(O)?.setAttribute("tabindex",O===L?"0":"-1"),O===L?M.get(O)?.removeAttribute("hidden"):M.get(O)?.setAttribute("hidden","")},_=g("span",{id:"searchLegis_load",style:"margin-left:10px;display:none;"},"Pesquisando..."),q={federal:g("div",{},y("Tipo de Legisla\xE7\xE3o","legis_tipoNorma",mr),C("N\xFAmero da Legisla\xE7\xE3o","legis_numeroNorma","number"),y("Per\xEDodo da Publica\xE7\xE3o","legis_periodoNorma",fr),C("Ano da Publica\xE7\xE3o","legis_anoNorma","number"),C("Conte\xFAdo da Legisla\xE7\xE3o (palavras-chave)","legis_termoNorma"),g("div",{style:"text-align:right;margin-top:6px;"},g("button",{type:"button",id:"searchLegis_uiElement",class:"spro-botao",title:"Pesquisar",onclick:L=>b(L.currentTarget)},"Pesquisar"),_),g("div",{id:"searchLegis_result",style:"display:none;max-height:250px;overflow-y:auto;margin-top:15px;"})),infra:g("div",{},y("Autoridade Signat\xE1ria","legis_orgaoInfraNorma",gr),y("Tipo de Legisla\xE7\xE3o","legis_tipoInfraNorma",br),C("N\xFAmero da Norma","legis_numeroInfraNorma","number")),lista:g("div",{},y("Nome da Legisla\xE7\xE3o","legis_nomeNorma",hr))},D=g("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});w.forEach(([L,O])=>{let G=g("button",{type:"button",role:"tab",id:`legisTab_${L}`,"aria-controls":`legisPainel_${L}`,"aria-selected":"false",class:"spro-botao",onclick:()=>P(L)},O);T.set(L,G),D.append(G),M.set(L,g("div",{role:"tabpanel",id:`legisPainel_${L}`,"aria-labelledby":`legisTab_${L}`,hidden:""},q[L]))});let Q=g("div",{class:"dialogBoxDiv",style:"min-width:480px;font-size:13px;"},D,...M.values(),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let L=f(Q,"legis_tipoNorma"),O=Re(f(Q,"legis_numeroNorma")),G=f(Q,"legis_tipoInfraNorma"),X=f(Q,"legis_numeroInfraNorma"),Ue=f(Q,"legis_nomeNorma");if(L!==""&&O!=="")return h(Q,L,O,f(Q,"legis_anoNorma").trim(),f(Q,"legis_periodoNorma"),k);if(G!==""&&X!==""){let Lt=(X.includes("/")?X.split("/")[0]??"":X).replace(/[^0-9-]+/g,"");c(f(Q,"legis_orgaoInfraNorma")+G+Lt)}else if(Ue!=="")c(Ue);else return t("Informe o tipo e o n\xFAmero da norma, ou escolha uma norma da lista.");l?.()}},"Inserir"))),Ee=H(e.doc,{titulo:"Adicionar Link de Legisla\xE7\xE3o",conteudo:Q});l=()=>Ee.fechar(),P("federal");let V=o.getSelectedText(k)||"",ie=$o(V),se=Q.querySelector("#legis_tipoNorma");if(ie&&se&&(se.value=ie),/\d/.test(V)){let L=V.includes("/")?V.split("/")[0]??"":V;L=V.includes(",")?V.split(",")[0]??"":L;let O=Q.querySelector("#legis_numeroNorma");O&&(O.value=/\d/.test(L)?L.replace(/\D/g,""):"");let G=/(?:\/|\bde\s+)(\d{4})\b/.exec(V),X=Q.querySelector("#legis_anoNorma");G&&X&&(X.value=G[1]??"")}try{let L=e.win;e.verifyOpcao("substituiselecao")&&typeof L.setChosenInCke=="function"&&L.setChosenInCke()}catch{}}return{resolverNormasLegisPro:p,sendLegisSEI:c,insertLegisSEI:E,getLegisSEI(v){let k=o.getInstance(v);k&&S(k)},getSearchLegisMore:A,getSearchLegis:b,getDialogLegisSEI:()=>{}}}};function Ie(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===o.ownerDocument)??t.getInstance()}function De(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function te(e,o,t,r){let a=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return a&&e.adaptador.recusarEscrita(),a}function Qo(e,o){let t=Ie(e,o);if(!t)return!1;if(e.adaptador.versao===5){let r=t,a=De(r,o);return!a||te(e,t,o,a)?!1:(r.model.change(l=>l.setSelection(a)),r.execute("unlink"),!0)}return te(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Oo(e,o,t,r){let a=Ie(e,o);if(!a)return!1;if(e.adaptador.versao===5){let l=a,d=De(l,o);return!d||te(e,a,o,d)?!1:(l.model.change(p=>{p.setSelection(d),l.model.insertContent(p.createText(t,{linkHref:r}))}),!0)}return te(e,a,o,null)?!1:(e.adaptador.withEdit(a,()=>{o.setAttribute("href",r),o.setAttribute("data-cke-saved-href",r),o.textContent=t}),!0)}function $e(e,o){let t=0,r=[];for(let{a:l,texto:d}of o){let p=Ie(e,l);if(p)if(e.adaptador.versao===5){let n=De(p,l);if(!n||te(e,p,l,n))continue;r.push({a:l,texto:d,intervalo:n,ed:p})}else{if(te(e,p,l,null))continue;l.textContent=d,t+=1}}let a=r[0]?.ed;return a&&a.model.change(l=>{for(let{a:d,texto:p,intervalo:n}of[...r].reverse())l.remove(n),l.insertText(p,{linkHref:d.getAttribute("href")??""},n.start),t+=1}),t}var yr="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",zo=new WeakMap,Er=e=>{let o=zo.get(e);if(o)return o;let t={balao:null};return zo.set(e,t),t},kr=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function jo(e){let o=Er(e),t=i=>I(e.doc,i);function r(i){let f=o.balao;if(f){if(!i){let m=!1;try{m=f.el.matches(":hover")}catch{m=!1}if(m)return}f.el.remove(),o.balao=null}}function a(){if(o.balao)return o.balao.link;let i=e.adaptador.getInstance();return(i?e.adaptador.getSelectionElement(i):null)?.closest("a[href]")??null}async function l(i){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(i),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function d(i,f){r(!0);let m=i?.closest?.("a[href]"),b=m?.getAttribute("href")??"";if(!m||!j(b))return;let h=g("a",{href:b,target:"_blank",rel:"noopener noreferrer",title:m.textContent??"",style:"color:inherit;text-decoration:underline;"},g("strong",{},kr(b))),E=(C,S,v)=>g("button",{type:"button",class:C,title:S,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:v},S),A=g("div",{class:"linkDisplayPro",style:yr},h,E("spro-copiar","Copiar",()=>void l(b)),E("spro-editar","Editar",()=>s()),E("spro-remover","Remover",()=>p()));e.doc.body.append(A),o.balao={el:A,link:m};let y=m.getBoundingClientRect?.();if(y){let C=m.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),S=A.getBoundingClientRect?.().width??0,v=Math.max(8,Math.min(y.left+(C?.left??0),(e.win.innerWidth||0)-S-8));A.style.left=`${v}px`,A.style.top=`${y.bottom+(C?.top??0)+4}px`}}function p(i,f){let m=a();m&&(Qo(e,m),r(!0))}function n(i,f){let m=a()?.getAttribute("href");m&&j(m)&&e.win.open(m,"_blank","noopener,noreferrer")}function c(i,f){let m=a()?.getAttribute("href");m&&l(m)}function s(){let i=a();if(!i)return;let f=g("input",{type:"text",id:"linkProNome"}),m=g("input",{type:"text",id:"linkProUrl"});f.value=i.textContent??"",m.value=i.getAttribute("href")??"";let b=H(e.doc,{titulo:"Editar link",conteudo:K(z("Texto vis\xEDvel:",f),z("URL:",m),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=m.value.trim(),E=f.value.trim()||h;if(h==="")return t("Digite um link");if(Le.test(h))return t("O link informado \xE9 inv\xE1lido.");Oo(e,i,E,h)&&(r(!0),b.fechar())}},"Salvar")))})}function u(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",i=>{let f=i.target;if(!f||o.balao?.el.contains(f))return;let m=f.closest?.("a[href]");m&&f.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?d(m):r(!1)},!0)}return{globais:{showLinkTips:d,hideLinkTips:i=>r(!1),openLinkPro:n,removeLinkPro:p,copyLinkPro:c,editLinkPro:i=>s(),openDialogLinkPro:s,getDialogLinkPro:()=>{}},iniciar:u}}var Bo={id:"link-pro",globais:e=>jo(e).globais,iniciar:e=>jo(e).iniciar()};var Cr=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function Fo(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,r,a]=[Number(o[1]),Number(o[2]),Number(o[3])],l=new Date(t,r-1,a);return l.getFullYear()!==t||l.getMonth()!==r-1||l.getDate()!==a?"":`${a} de ${Cr[r-1]} de ${t}`}function Ne(e){let o=b=>R(b),t=b=>b!=="",r=t(e.nome)?`, ${o(Z(e.nome.trim()))}`:"",a=o(e.sobrenome.toUpperCase()),l=t(e.titulo)?`. <strong>${o(Z(e.titulo.trim()))}</strong>`:"",d=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",p=t(e.local)?`, ${o(Z(e.local.trim()))}`:"",n=t(e.editora)?`: ${o(Z(e.editora.trim()))}`:"",c=t(e.ano)?`, ${o(e.ano)}`:"",s=t(e.volume)?`, v. ${o(e.volume)}`:"",u=t(e.paginas)?`. p.${o(e.paginas)}`:"",x=t(e.link)&&j(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",i=Fo(e.data),f=i?`. Acesso em: ${i}`:"",m=a+r+l+d+p+n+c+s+u+x+f;return m===""?"":`${m}.`}function W(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function re(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Qe="ntRodape_item",ee="ntRodape_footer",Uo=".ntRodape_item, .ntRodape, .ntRodape_tr",Go='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function Jo(e,o){let t=R(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function Ko(e){let o=R(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function Wo(e,o=new Set){let t=new Map,r=0;for(let d of e)d.tipo==="item"&&(r+=1,t.set(d.ref,r));let a=[],l=[];for(let d of e){if(d.tipo!=="footer")continue;let p=t.get(d.ref);p!==void 0?a.push({ref:d.ref,chave:p}):o.has(d.ref)?a.push({ref:d.ref,chave:Number.isFinite(d.numero)?d.numero:Number.MAX_SAFE_INTEGER}):l.push(d.ref)}return a.sort((d,p)=>d.chave-p.chave),{numeroDe:t,ordem:a.map(d=>d.ref),orfaos:l}}var He=e=>e.getAttribute("data-ntrodape-ref")??"";function Xo(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${Qe}[data-ntrodape-ref]`)),r=Array.from(e.querySelectorAll("p.ntRodape")).filter(p=>p.querySelector(`.${ee}[data-ntrodape-ref]`)),a=p=>Number.parseInt(p.querySelector(`.${ee}`)?.getAttribute("data-ntrodape")??"",10),l=Wo([...t.map(p=>({tipo:"item",ref:He(p)})),...r.map(p=>({tipo:"footer",ref:He(p.querySelector(`.${ee}`)),numero:a(p)}))],o);t.forEach((p,n)=>{p.setAttribute("data-ntrodape",String(n+1)),p.textContent=`[${n+1}]`});let d=new Map;for(let p of r){let n=He(p.querySelector(`.${ee}`)),c=l.numeroDe.get(n),s=p.querySelector(`.${ee}`);c!==void 0&&(s.setAttribute("data-ntrodape",String(c)),s.textContent=`[${c}]`),p.remove(),d.set(n,p)}for(let p of l.ordem){let n=d.get(p);n&&e.append(n)}if(!l.ordem.length)for(let p of e.querySelectorAll(".ntRodape_tr"))p.remove();return l}function Yo(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${Qe}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var Vo=e=>e.getAttribute?.("htmlSpan")?.classes??[],Ar=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function Zo(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of e.createRangeIn(o).getItems())if(r.is("$textProxy")||r.is("$text")){let a=Vo(r);a.includes(Qe)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):a.includes(ee)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===o){let a=Ar(r);if(a.includes("ntRodape_tr"))t.separadores.push(r);else if(a.includes("ntRodape")){let d=Array.from(e.createRangeIn(r).getItems()).find(p=>(p.is("$textProxy")||p.is("$text"))&&Vo(p).includes(ee))?.getAttribute("htmlSpan")?.attributes??{};d["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:d["data-ntrodape-ref"],numero:Number.parseInt(d["data-ntrodape"],10)})}}return t}function Sr(e,o,t){let r=o.getAttribute("htmlSpan")??{},a=`[${t}]`;if(o.data===a&&r.attributes?.["data-ntrodape"]===String(t))return;let l=Object.fromEntries(o.getAttributes());l.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let d=e.createRangeOn(o),p=d.start;e.remove(d),e.insertText(a,l,p)}function et(e,o,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(a=>{let l=Zo(a,o),d=c=>c.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=Wo([...l.itens.map(c=>({tipo:"item",ref:d(c)})),...l.rodapes.map(c=>({tipo:"footer",ref:c.ref,numero:c.numero}))],t);let p=[],n=0;for(let c of l.textos)if(c.tipo==="item")n+=1,p.push({no:c.no,n});else{let s=r.numeroDe.get(d(c.no));s!==void 0&&p.push({no:c.no,n:s})}for(let c of[...p].reverse())Sr(a,c.no,c.n);for(let c of r.orfaos){let s=l.rodapes.find(u=>u.ref===c);s&&a.remove(a.createRangeOn(s.bloco))}for(let c of r.ordem){let s=l.rodapes.find(u=>u.ref===c);s&&a.move(a.createRangeOn(s.bloco),a.createPositionAt(o,"end"))}if(!r.ordem.length)for(let c of l.separadores)a.remove(a.createRangeOn(c))}),r}function ot(e,o){e.model.change(t=>{let r=Zo(t,o),a=[...r.itens,...r.rodapes.map(l=>l.bloco),...r.separadores];for(let l of[...a].reverse())t.remove(t.createRangeOn(l))})}function ue(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=e.editing.view.document.getRoot(t.rootName);if(r&&e.editing.view.domConverter.mapViewToDom(r)===o)return t}catch{}return null}function tt(e,o,t){let r=new Set;for(let a of Array.from(e.model.document.roots??[]))if(!(!a||a===o||a.rootName==="$graveyard"))for(let l of t(e.data.get({rootName:a.rootName})))r.add(l);return r}var wr='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',rt=new WeakSet;function Tr(e,o){let t=e.querySelector(`[name="${o}"], [id="${o}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(o);return r?e.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${r[2]}"]`):null}function U(e){let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||rt.has(t)||(rt.add(t),t.addEventListener("click",r=>{let a=r.target?.closest?.(wr);if(!a)return;let l=Tr(t,(a.getAttribute("href")??"").slice(1));(l?.closest("p")??l)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var _r=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],nt={id:"nota-rodape",globais(e){let o=e.adaptador,t=m=>I(e.doc,m),r=m=>o.getBodyContainer(m),a=m=>o.findInBody(m,Uo).length>0;function l(m,b){let h=o.versao===5?re(e,b):o.somenteLeitura(m);return h&&o.recusarEscrita(),h}function d(m){let b=e.doc.createElement("div");return b.append(...Y(e.doc,m)),Array.from(b.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(h=>h.getAttribute("data-ntrodape-ref")??"")}function p(m){if(o.versao===5){let b=ue(m,r(m));b&&et(m,b,tt(m,b,d))}else{let b=r(m);b&&Xo(b)}}function n(m){let b=typeof m=="object"&&m&&"model"in m?m:o.getInstance();if(!b)return;let h=o.versao===5?ue(b,r(b)):null;l(b,h)||o.withEdit(b,()=>p(b))}function c(m){let b=m??o.getInstance();if(b){if(!a(b)){t("O documento n\xE3o tem notas de rodap\xE9.");return}n(b),U(e),t("Notas de rodap\xE9 atualizadas com sucesso")}}function s(m,b){let h=b??o.getInstance();if(!h)return;if(!a(h)){t("O documento n\xE3o tem notas de rodap\xE9.");return}let E=o.versao===5?ue(h,r(h)):null;l(h,E)||(o.withEdit(h,()=>{if(o.versao===5)ot(h,E);else{let A=r(h);A&&Yo(A)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function u(m,b){let h=b??o.getInstance();if(!h||m.trim()==="")return;let E=o.versao===5?ue(h,r(h)):null;if(o.versao===5&&!E||l(h,E))return;let A=J(16);o.withEdit(h,()=>{if(o.versao===5){let y=h;y.model.document.selection.getFirstPosition()?.root!==E&&y.model.change(C=>C.setSelection(E,"end"))}o.findInBody(h,".ntRodape_tr").length||o.appendToBody(h,Go),o.appendToBody(h,Jo(A,m)),o.insertHtml(h,Ko(A)),p(h)}),U(e)}function x(m){let b=h=>(m.querySelector(`#${h}`)?.value??"").toString();return Object.fromEntries(_r.map(([h,E])=>[h,b(E)]))}function i(m){let b=m??e.doc,h=b.querySelector("#nrABNTResult");h&&h.replaceChildren(...Y(e.doc,Ne(x(b))))}function f(m){let b=m??o.getInstance();if(!b)return;let h=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],E=new Map,A=new Map,y=null,C=_=>{for(let[q]of h){let D=q===_;A.get(q)?.setAttribute("aria-selected",String(D)),A.get(q)?.setAttribute("tabindex",D?"0":"-1"),D?E.get(q)?.removeAttribute("hidden"):E.get(q)?.setAttribute("hidden","")}y&&(_==="livre"||_==="abnt"?y.removeAttribute("hidden"):y.setAttribute("hidden",""))},S=g("textarea",{id:"textNotaRodape",rows:"3",style:"width:100%;"}),v=(_,q,D="text")=>g("label",{style:"display:grid;gap:2px;font-size:12px;color:#555;"},g("span",{},_),g("input",{type:D,id:q,style:"width:100%"})),k=g("div",{id:"nrABNTResult",style:"margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"}),w=g("div",{style:"display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;"},v("Nome do autor","nr_Nome"),v("Sobrenome do autor","nr_Sobrenome"),g("div",{style:"grid-column:1 / span 2;"},v("T\xEDtulo da publica\xE7\xE3o","nr_Titulo")),v("N\xFAmero da edi\xE7\xE3o","nr_Edicao","number"),v("Ano da publica\xE7\xE3o","nr_Ano","number"),v("Local (cidade)","nr_Local"),v("Nome da editora","nr_Editora"),v("N\xFAmero do volume","nr_Volume","number"),v("P\xE1ginas inicial-final","nr_Paginas"),v("Link da publica\xE7\xE3o","nr_Link"),v("Data do acesso","nr_Data","date"),g("div",{style:"grid-column:1 / span 2;"},k)),T={livre:g("div",{},g("label",{for:"textNotaRodape",style:"font-size:12px;color:#555;"},"Texto da nota de rodap\xE9:"),S),abnt:w,atualizar:g("div",{style:"padding:10px 0;display:grid;gap:10px;"},g("p",{},"Atualiza numera\xE7\xF5es e ordem das notas de rodap\xE9 j\xE1 existentes no documento."),g("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>c(b)},"Atualizar")),remover:g("div",{style:"padding:10px 0;display:grid;gap:10px;"},g("p",{},"Remove todas as notas de rodap\xE9 do documento (Ctrl+Z desfaz)."),g("button",{type:"button",id:"btnNrRemove",class:"spro-botao",onclick:()=>{s(null,b),P.fechar()}},"Remover todas"))},M=g("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});h.forEach(([_,q],D)=>{let Q=g("button",{type:"button",role:"tab",id:`ntTab_${_}`,"aria-controls":`ntPainel_${_}`,"aria-selected":"false",class:"spro-botao",onclick:()=>C(_),onkeydown:V=>{let ie=V,se=ie.key==="ArrowRight"?1:ie.key==="ArrowLeft"?-1:0,L=h[(D+se+h.length)%h.length]?.[0];!se||!L||(C(L),A.get(L)?.focus())}},q);A.set(_,Q),M.append(Q);let Ee=g("div",{role:"tabpanel",id:`ntPainel_${_}`,"aria-labelledby":`ntTab_${_}`,hidden:""},T[_]);E.set(_,Ee)}),y=g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let _=(k.textContent??"").trim()?Ne(x(w)):"",q=S.value.trim(),D=_||R(q).replace(/\r?\n/g,"<br>");if(!D){t("Digite o texto da nota de rodap\xE9.");return}u(D,b),P.fechar()}},"Inserir");for(let _ of w.querySelectorAll("input"))_.addEventListener("input",()=>i(w)),_.addEventListener("change",()=>i(w));let P=H(e.doc,{titulo:"Inserir nota de rodap\xE9",conteudo:g("div",{style:"min-width:480px;font-size:13px;"},M,...E.values(),g("div",{class:"spro-dialogo-rodape"},y))});C("livre")}return{getNotaRodape(m){let b=o.getInstance(m);b&&f(b)},getDialogNotaRodape:()=>{},openDialogNotaRodape:f,removeNtRodape:s,updateNrABNT:i,insertNtRodape:u,updateNtRodape:c,reorderNtRodape:n}},iniciar(e){U(e)}};function xe(e,o,t,r){let a=e.adaptador.getInstance(o);if(!a)return;let l=e.adaptador.getSelectionParagraph(a);l&&e.adaptador.withEdit(a,()=>{e.adaptador.insertHtmlBefore(a,l,t),r?.(a,l)})}var Mr='<div class="pageBreakPro" style="page-break-after: always"></div>',at={id:"page-break",globais:e=>({getPageBreak:o=>xe(e,o,Mr)})};function it(e,o,t){let r=e.jQuery,a=r?.(o).qrcode;if(!r||typeof a!="function")return null;o.replaceChildren();try{r(o).qrcode?.(t)}catch{return o.replaceChildren(),null}return o.querySelector("img, canvas")}var pe={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},Lr=[["QrPro-size","px"],["QrPro-minversion",""],["QrPro-quiet"," m\xF3dulos"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],qr=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],Pr=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],Rr=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],st={id:"qr-code",globais(e){let o=e.adaptador,t=y=>I(e.doc,y),r=y=>e.doc.querySelector(y),a=y=>r(`#${y}`)?.value??"",l=()=>e.win.NAMESPACE_SPRO??"SEI Pro",d=()=>`${e.base}icons/menu/seipro.png`,p=(y,C,S)=>g("div",{style:"display:grid;gap:2px;"},g("label",{for:C},y),S),n=(y,C,S,v)=>g("input",{id:y,type:"range",value:pe[y]??"",min:String(C),max:String(S),step:String(v)});function c(){let y=g("div",{id:"optionsQrAdvanced",style:"display:none;"},g("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;font-size:12px;"},p("Tamanho do QR: 140px","QrPro-size",n("QrPro-size",100,500,50)),p("Cor de Preenchimento","QrPro-fill",g("input",{id:"QrPro-fill",type:"color",value:pe["QrPro-fill"]??""})),p("Cor de Fundo","QrPro-background",g("div",{},g("input",{id:"QrPro-background",type:"color",value:pe["QrPro-background"]??""}),g("label",{style:"margin-left:12px;"},g("input",{id:"QrPro-background-transparent",type:"checkbox"})," Transparente"))),p("Vers\xE3o: 6","QrPro-minversion",n("QrPro-minversion",1,10,1)),p("N\xEDvel de corre\xE7\xE3o de erros","QrPro-eclevel",g("select",{id:"QrPro-eclevel"},...Rr.map(([C,S])=>g("option",{value:C},S)))),p("Margens de folga: 1 m\xF3dulos","QrPro-quiet",n("QrPro-quiet",0,4,1)),p("Raio de canto: 50%","QrPro-radius",n("QrPro-radius",0,50,10)),p("Modo","QrPro-mode",g("select",{id:"QrPro-mode"},...Pr.map(([C,S])=>g("option",{value:C},S)))),g("div"),g("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},g("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Tamanho da etiqueta: 20%","QrPro-msize",n("QrPro-msize",0,40,1)),p("Posi\xE7\xE3o X: 50%","QrPro-mposx",n("QrPro-mposx",0,100,1)),p("Posi\xE7\xE3o Y: 50%","QrPro-mposy",n("QrPro-mposy",0,100,1)))),g("div",{class:"QrMode-etiqueta",style:"display:none;grid-column:1 / span 3;"},g("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Nome da fonte","QrPro-font",g("select",{id:"QrPro-font"},...qr.map(C=>g("option",{value:C},C)))),p("Cor da fonte","QrPro-fontcolor",g("input",{id:"QrPro-fontcolor",type:"color",value:pe["QrPro-fontcolor"]??""})),p("Etiqueta","QrPro-label",g("input",{id:"QrPro-label",type:"text",value:l()})))),g("div",{class:"QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},p("Imagem","QrPro-image",g("input",{id:"QrPro-image",type:"file",accept:"image/*"})),g("img",{id:"QrPro-img-buffer",style:"display:none",src:d(),alt:""}))),g("a",{id:"QrPro-reset",class:"linkDialog",role:"button",tabindex:"0",style:"margin-top:14px;display:block;cursor:pointer;",onclick:()=>u()},"Resetar configura\xE7\xF5es"));return g("div",{id:"qrCodeLab"},g("div",{style:"text-align:right;"},g("a",{id:"toggleOptionsQR",class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>s()},"Op\xE7\xF5es avan\xE7adas ")),g("div",{style:"display:grid;gap:10px;"},y,g("div",{id:"qrCodeResult",style:"text-align:center;margin:10px 0;min-width:180px;"})))}function s(){let y=r("#optionsQrAdvanced");y&&(y.style.display=y.style.display==="none"?"":"none")}function u(){for(let[S,v]of Object.entries(pe)){let k=r(`#${S}`);k&&(k.value=v)}let y=r("#QrPro-label");y&&(y.value=l());let C=r("#QrPro-background-transparent");C&&(C.checked=!1,C.removeAttribute("checked")),r("#QrPro-img-buffer")?.setAttribute("src",d()),h()}function x(y){r("#tipQrCodeUrl")?.remove();let C=r("#toggleOptionsQR");if(y===""||!j(y)||y.length<=50||!C)return;let S=r(".getTinyUrlButtom span")?.getAttribute("style")??"",v=g("span",{id:"tipQrCodeUrl",style:"display:block;margin-bottom:8px;padding:5px 8px 8px 8px;background:#f9f9dc;color:#333;border-radius:5px;"},"Dica: Experimente ",g("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>f()},g("span",{style:`width:16px;height:16px;display:inline-block;${S}`}),"Gerar link curto do TinyURL"));(C.parentElement??C).before(v)}function i(y){let C=r("#qrCodeText");C&&(C.value=y),h()}function f(){let y=a("qrCodeText").trim(),C=e.win.ajaxTinyUrl;if(typeof C!="function"){t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");return}Promise.resolve(C(y,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function m(){for(let[y,C]of Lr){let S=r(`label[for="${y}"]`);S&&(S.textContent=(S.textContent??"").replace(/:.*/,`: ${a(y)}${C}`))}}function b(y){let C=S=>Number.parseInt(a(S),10);return{render:"image",ecLevel:a("QrPro-eclevel"),minVersion:C("QrPro-minversion"),fill:a("QrPro-fill"),background:r("#QrPro-background-transparent:checked")?null:a("QrPro-background"),text:y,size:C("QrPro-size"),radius:C("QrPro-radius")*.01,quiet:C("QrPro-quiet"),mode:C("QrPro-mode"),mSize:C("QrPro-msize")*.01,mPosX:C("QrPro-mposx")*.01,mPosY:C("QrPro-mposy")*.01,label:a("QrPro-label"),fontname:a("QrPro-font"),fontcolor:a("QrPro-fontcolor"),image:r("#QrPro-img-buffer")}}function h(){let y=r("#qrCodeResult");if(!y)return;y.replaceChildren();for(let v of e.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))v.style.display="none";m();let C=a("QrPro-mode");if(C==="1"||C==="2")for(let v of e.doc.querySelectorAll(".QrMode-etiqueta"))v.style.display="";else if(C==="3"||C==="4")for(let v of e.doc.querySelectorAll(".QrMode-imagem"))v.style.display="";let S=a("qrCodeText");S!==""&&!it(e.win,y,b(S))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),x(S)}function E(y,C){let S=C??o.getInstance();if(!S)return;let v=r("#qrCodeResult img")?.getAttribute("src")??"";if(!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(v)){t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto.");return}o.withEdit(S,()=>o.insertHtml(S,`<img src="${R(v)}" alt="${R(y)}">`))}function A(y){let C=y??o.getInstance();if(!C)return;let S=g("input",{type:"text",id:"qrCodeText",style:"width:100%;box-sizing:border-box;margin:6px 0 10px 0;"}),v=String(e.win.getSelection?.()??"").trim();v&&(S.value=v),S.addEventListener("input",()=>h()),S.addEventListener("change",()=>h());let k=c();for(let T of["input","change"])k.querySelector("#optionsQrAdvanced")?.addEventListener(T,()=>h());k.querySelector("#QrPro-image")?.addEventListener("change",T=>{let M=T.target.files?.[0];if(!M)return;let P=new FileReader;P.onload=()=>{let _=String(P.result??"");if(!/^data:image\//i.test(_)){t("Escolha um arquivo de imagem.");return}r("#QrPro-img-buffer")?.setAttribute("src",_);let q=r("#QrPro-mode");q&&(q.value="4"),setTimeout(h,200)},P.readAsDataURL(M)});let w=H(e.doc,{titulo:"Gerar C\xF3digo QR",conteudo:g("div",{style:"min-width:560px;max-width:100%;font-size:13px;"},g("label",{for:"qrCodeText"},"Insira o texto que deseja codificar:"),S,k,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let T=S.value.trim();if(!T){t("Digite o texto a codificar");return}E(T,C),w.fechar()}},"Inserir")))});v&&h()}return{getQrCode(y){let C=o.getInstance(y);C&&A(C)},getDialogQrCode:()=>{},openDialogQrCode:A,buildHtmlQrCodeLab:c,resetOptionsQR:u,toggleOptionsQR:s,tipQrCodeUrl:x,setInputTinyUrl:i,convertTinyURL:f,updateQrCode:h,setQrCode:E}}};var lt=5,ct=5,dt=49,B=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function Ir(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let a=e?.previousElementSibling??null;a;a=a.previousElementSibling)if(a.classList.contains("divQuickTable"))return a;return o.querySelector(".divQuickTable")}var ut={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let s of e.doc.querySelectorAll(".divQuickTable"))s.replaceChildren(),ge(s);for(let s of e.doc.querySelectorAll(".getQuickTableButtom"))s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")}function r(s){if(!s)return;let u=B(s,"data-row"),x=B(s,"data-col"),i=s.closest("table");if(!i)return;for(let b of i.querySelectorAll("td"))b.classList.remove("td_hover");let f=()=>[...i.querySelectorAll("tr")];if(u>=3&&B(f().at(-1)?.querySelector("td"),"data-row")>u+1&&(f().at(-1)?.remove(),i.setAttribute("data-row",String(B(i,"data-row")-1))),x>=3&&B(f().at(-1)?.lastElementChild,"data-col")>x+1){for(let b of f())b.lastElementChild?.remove();i.setAttribute("data-col",String(B(i,"data-col")-1))}for(let b of i.querySelectorAll("td"))B(b,"data-row")<=u&&B(b,"data-col")<=x&&b.classList.add("td_hover");let m=s.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(m&&(m.textContent=`Tabela ${u+1}x${x+1}`),u===B(i,"data-row")&&u<dt){let b=f().at(-1)?.cloneNode(!0);b&&(b.querySelectorAll("td").forEach((h,E)=>{h.setAttribute("data-row",String(u+1)),h.setAttribute("data-col",String(E)),h.classList.remove("td_hover")}),(i.querySelector("tbody")??i).append(b),i.setAttribute("data-row",String(u+1)))}if(x===B(i,"data-col")&&x<dt){for(let b of f()){let h=b.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(x+1)),h.classList.remove("td_hover"),b.append(h))}i.setAttribute("data-col",String(x+1))}}function a(){let s=e.doc,u=s.createDocumentFragment(),x=s.createElement("div");x.className="quickTableInfo",x.textContent="Inserir Tabela";let i=s.createElement("table");i.setAttribute("data-row",String(lt-1)),i.setAttribute("data-col",String(ct-1));for(let m=0;m<lt;m+=1){let b=s.createElement("tr");for(let h=0;h<ct;h+=1){let E=s.createElement("td");E.setAttribute("data-row",String(m)),E.setAttribute("data-col",String(h)),b.append(E)}i.append(b)}let f=m=>r(m.target?.closest("td")??null);return i.addEventListener("mouseover",f),i.addEventListener("mouseout",f),i.addEventListener("click",m=>{let b=m.target?.closest("td");b&&c(b)}),u.append(x,i),u}function l(s){if(!s)return;let u=Ir(s,e.doc);s.classList.contains("cke_button_on")?(t(),s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")):(u&&(u.replaceChildren(a()),fe(u)),s.classList.remove("cke_button_off"),s.classList.add("cke_button_on"))}function d(s){let u=s?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),x=u?[...u.querySelectorAll(".getTablestylesButtom")]:[];x.length||(x=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let i of x)i.classList.remove("cke_button_disabled")}function p(s,u){let x='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';x+="  <tbody>";for(let i=0;i<=s;i+=1){x+="      <tr>";for(let f=0;f<=u;f+=1)x+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';x+="      </tr>"}return`${x}  </tbody></table>`}function n(s,u){let x=u?u.nextElementSibling:o.getBodyContainer(s)?.lastElementChild,i=x?.tagName==="TABLE"?x.querySelector("td p"):null;if(!i)return;let f=i.ownerDocument,m=f.defaultView?.getSelection?.();if(!m)return;let b=f.createRange();b.setStart(i.firstChild??i,0),b.collapse(!0),m.removeAllRanges(),m.addRange(b)}function c(s){let u=o.getInstance(s);if(!u){t();return}let x=p(B(s,"data-row"),B(s,"data-col")),i=o.getSelectionParagraph(u);o.withEdit(u,()=>{if(!i)return o.insertHtml(u,x);let f=i.nextElementSibling;f?o.insertHtmlBefore(u,f,x):o.appendToBody(u,x)}),t(),d(s),n(u,i)}return{getQuickTable:l,quickTableOver:r,hideQuickTable:t,quickTableClick:c}}};function ve(e,o,t,r,a){let l=e.adaptador;if(l.versao===5){let p=W(o,t);return p&&re(e,p)?(l.recusarEscrita(),!1):!!e.win.SeiProGhs?.setAtributos(t,{id:r},o)}if(l.somenteLeitura(o))return l.recusarEscrita(),!1;if(a)for(let p of t.querySelectorAll(`a.${a}`))p.remove();let d=t.ownerDocument.createElement("a");return d.setAttribute("name",r),a&&(d.className=a),t.prepend(d),!0}function ye(e,o){let t=e.querySelector(`a[name^="${o}"]`);return t?t.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var Dr=[1,2,3,4],Oe=["Paragrafo_Numerado_Nivel","Item_Nivel"];function pt(e){let o=Oe.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of o)r.fill(0);return{item:""}}for(let r=0;r<Oe.length;r+=1)for(let a of Dr){if(t!==`${Oe[r]}${a}`)continue;let l=o[r];l[a-1]=(l[a-1]??0)+1;for(let d=a;d<4;d+=1)l[d]=0;return{item:l.slice(0,a).join(".")}}return{item:""}})}var ne="RefPro_",$r="refpro",Nr=`a[href^="#${ne}"]`,mt=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,ft={id:"ref-interna",globais(e){let o=e.adaptador,t=c=>I(e.doc,c);function r(c){let s=c??o.getInstance();if(!s)return!1;let u=o.findInBody(s,"p");if(!u.length)return!1;let x=pt(u.map(f=>({classe:(f.getAttribute("class")??"").trim()}))),i=[];return u.forEach((f,m)=>{let b=x[m]?.item;if(!b)return;let h=ye(f,ne);i.push({ref:h?h.slice(ne.length):J(16),item:b,text:f.textContent??"",ancorado:!!h,el:f})}),i}function a(c,s,u){let x=r(c),i=o.findInBody(c,Nr),f=[];if(!x||!i.length)return{mudar:f,perdidas:0};let m=new Map(x.filter(h=>h.ancorado).map(h=>[h.ref,h.item])),b=0;for(let h of i){let E=m.get((h.getAttribute("href")??"").slice(1+ne.length));if(E===void 0){b+=1;continue}let A=mt(s,u,E);(h.textContent??"")!==A&&f.push({a:h,texto:A})}return{mudar:f,perdidas:b}}function l(c,s,u){let{mudar:x,perdidas:i}=a(c,s,u),f=0;return x.length&&o.withEdit(c,()=>f=$e(e,x)),{atualizadas:f,perdidas:i}}function d(c,s,u){let x,i,f;typeof c=="string"||c===void 0?(x=o.getInstance(),i=c??"",f=s===!0):(x=c,i=typeof s=="string"?s:"",f=u===!0),x&&l(x,i,f)}function p(c){let s=o.getInstance(c);if(!s)return;let u=r(s);if(!u||u.length===0){t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");return}let x=g("input",{type:"text",id:"prefixo",style:"width:70%"}),i=g("input",{type:"checkbox",id:"hidePrefix"}),f=g("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(10,u.length)),style:"width:100%"},...u.map(h=>{let E=h.text.trim(),A=E.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return g("option",{value:`${h.ref}-${h.item}`},`${h.item}. ${A}${A.length<E.length?"...":""}`)})),m=()=>i.matches(":checked")||x.value.trim()==="",b=H(e.doc,{titulo:"Inserir refer\xEAncia interna",conteudo:g("div",{style:"display:grid;gap:12px;min-width:420px;font-size:13px;"},g("label",{style:"display:grid;gap:4px;"},g("span",{},"Prefixo:"),x),g("label",{},i," N\xE3o utilizar prefixo"),g("label",{style:"display:grid;gap:4px;"},g("span",{},"Par\xE1grafo numerado:"),f),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:h}=l(s,x.value,m());U(e),t(h?`Refer\xEAncias atualizadas. ${h} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=u.filter(E=>[...f.querySelectorAll("option")].some(A=>A.value===`${E.ref}-${E.item}`&&A.selected));if(!h.length){t("Selecione ao menos um par\xE1grafo numerado.");return}n(s,h,x.value,m())&&b.fechar()}},"Inserir")))})}function n(c,s,u,x){if(o.somenteLeitura(c))return o.recusarEscrita(),!1;let i=s.filter(h=>h.el.isConnected);if(!i.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let f=i.map(h=>`<a href="#${ne}${R(h.ref)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${R(mt(u,x,h.item))}</a>`),m=f.length>1?`${f.slice(0,-1).join(", ")} e ${f.at(-1)}`:f[0]??"",b=!1;return o.withEdit(c,()=>{let{mudar:h}=a(c,u,x);h.length&&$e(e,h);for(let E of i)if(!E.ancorado&&!ve(e,c,E.el,`${ne}${E.ref}`,$r))return;o.insertHtml(c,` ${m} `),b=!0}),U(e),b}return{getRefInterna:p,updateRefsInternas:d,getNiveisParagrafos:r,clickScroolToRef:()=>U(e)}},iniciar(e){U(e)}};var Hr='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Qr="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",gt={id:"session-break",globais:e=>({getSessionBreak:o=>xe(e,o,Hr,(t,r)=>{if(e.adaptador.versao!==5)return;let a=t,l=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,d=W(a,r)?.previousSibling;l&&d?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":Qr},d)})})};var bt=["seiSlim","seiSlim_parent","seiSlim_view"],ht={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=a=>{for(let l of o())l.classList.add(a?"cke_button_on":"cke_button_off"),l.classList.remove(a?"cke_button_off":"cke_button_on")};function r(a){if(a==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...bt)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...bt)}return{getBoxStyleEditor(a){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),r("remove")):(t(!0),r("set"))},updateStyleEditor:r}}};var Or="seipro-bookmark",xt="bookmark-",zr=e=>e.replace(/^\./,""),vt={id:"sumario",globais(e){let o=e.adaptador,t=n=>I(e.doc,n);function r(n){let c=new Set;for(let s of o.findInBody(n,"p")){let u=(s.getAttribute("class")??"").trim().split(/\s+/)[0];u&&c.add(u)}return[...c]}function a(n,c,s){let u=n.map(x=>g("option",{value:`.${x}`,...x===s?{selected:"selected"}:{}},x));return c?[g("option",{value:""},"(nenhum)"),...u]:u}function l(n,c,s){let u=e.doc.querySelector(`select#${c}`);u&&u.replaceChildren(...s.map(([x,i])=>g("option",{value:i},x)))}function d(n,c,s){let u=s??o.getInstance();if(!u)return!1;let x=new Set(c.map(zr).filter(Boolean));if(!x.size)return!1;if(o.somenteLeitura(u))return o.recusarEscrita(),!1;let i=o.findInBody(u,"p").filter(m=>(m.textContent??"").trim()!==""&&[...m.classList].some(b=>x.has(b)));if(!i.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let f='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>';return o.withEdit(u,()=>{for(let b of i){let h=ye(b,xt)??`${xt}${J(16)}`;ve(e,u,b,h,Or)&&(f+=`<p class="Texto_Alinhado_Esquerda"><a href="#${R(h)}">${R((b.textContent??"").trim())}</a></p>`)}let m=o.versao===5?o.getSelectionParagraph(u):null;m?o.insertHtmlBefore(u,m,f):o.insertHtml(u,f)}),!0}function p(n,c){let s=c??o.getInstance();if(!s)return;let u=r(s);if(!u.length){t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");return}let x=(h,E,A)=>g("select",{id:h},...a(u,E,A)),i=x("listStyle1",!1,"Item_Nivel1"),f=x("listStyle2",!0,"Item_Nivel2"),m=x("listStyle3",!0,"Item_Nivel3"),b=H(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:K(z("Estilo do T\xEDtulo 1 (obrigat\xF3rio):",i),z("Estilo do T\xEDtulo 2:",f),z("Estilo do T\xEDtulo 3:",m),g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let h=[i.value,f.value,m.value].filter(E=>E!=="");if(!h.length){t("Escolha o estilo do T\xEDtulo 1.");return}d(null,[...new Set(h)],s)&&b.fechar()}},"Inserir")))})}return{getSumarioDocumento(n){let c=o.getInstance(n);c&&p(null,c)},getListStylesDocumento(n,c){let s=c??o.getInstance();return s?a(r(s),!1):[]},updateSelectDialog:(n,c)=>l(null,n,c),getDialogSumarioDocumento:n=>p(null,n),getDialogSumarioDocumento_:()=>p(null),insertSumarioDocumento:(n,c)=>d(null,n,c)}}};var ae={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function ze(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function je(e){let o={};for(let t of e.split(";")){let r=t.indexOf(":");if(r<=0)continue;let a=t.slice(0,r).trim(),l=t.slice(r+1).trim();a&&l&&(o[a]=l)}return o}function jr(e,o,t){let r=[];for(let a=0;a<o;a+=1){let l=a===0,d=l?e.trCabecalho:Array.isArray(e.tr)?a%2===0?e.tr[1]:e.tr[0]:e.tr,p=Array.from({length:t},(n,c)=>({td:l?e.tdCabecalho:c===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));r.push({tr:d,celulas:p})}return{linhas:r}}var Be=e=>Array.from(e.querySelectorAll("td, th"));function yt(e,o,t,r,a){let l=e.adaptador,d=Array.from(t.querySelectorAll("tr")),p=jr(r,d.length,Math.max(0,...d.map(n=>Be(n).length)));if(l.versao===5){let n=o,c=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,s=W(n,t.closest("figure")??t);return!c||!s?!1:re(e,s)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{c.setModelHtmlStyles("table",je(r.table),s),d.forEach((u,x)=>{let i=p.linhas[x];if(!i)return;let f=W(n,u);f&&c.setModelHtmlStyles("tr",je(i.tr),f),Be(u).forEach((m,b)=>{let h=W(n,m);if(h){c.setModelHtmlStyles("td",je(i.celulas[b]?.td??""),h);for(let E of h.getChildren())E.name==="paragraph"&&n.model.change(A=>A.setAttribute("estilo",i.celulas[b]?.p,E))}})}),r.cabecalho&&n.model.change(u=>u.setAttribute("headingRows",1,s))}),!0)}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let n=t.ownerDocument;if(t.setAttribute("style",r.table),d.forEach((c,s)=>{let u=p.linhas[s];u&&(c.setAttribute("style",u.tr),Be(c).forEach((x,i)=>{x.setAttribute("style",u.celulas[i]?.td??"");let f=u.celulas[i]?.p??"",m=x.querySelectorAll("p");if(m.length)for(let b of m)b.setAttribute("class",f);else{let b=n.createElement("p");b.setAttribute("class",f),b.append(...Array.from(x.childNodes)),x.append(b)}}))}),r.cabecalho&&d[0]&&!t.querySelector("thead")){let c=n.createElement("thead");c.append(d[0]),t.prepend(c)}a?.aoFinalCk4?.(t)}),!0)}var Et="color1",Br="Clique na tabela que deseja aplicar o estilo!",Fe="dark-mode-color-";function Fr(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function Vr(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${Fe}black`,`${Fe}white`),o.classList.add(`${Fe}${Fr(t)>125?"black":"white"}`))}}var kt={id:"table-styles",globais(e){let o=e.adaptador,t=n=>o.getSelectionElement(n)?.closest("table")??null;function r(n,c){let s=n.querySelector("#addEstiloTabela");s&&c&&/^color\d+$/.test(c)&&(s.className=c)}function a(n,c,s,u=!0,x){let i=s??o.getInstance();if(!i||!c)return;let[f,m,b]=c,h=ae[m],E=Number(b),A=h&&Number.isFinite(E)?ze(h,E)[f]:void 0,y=x?.isConnected?x:x?null:t(i);!A||!y||yt(e,i,y,{...A,cabecalho:u},{aoFinalCk4:Vr})}function l(){let n=Object.keys(ae),c=Object.keys(ze(ae[Et])),s=g("div",{id:"selectColorTabela",class:"listaCoresTabela"},...n.map((x,i)=>g("span",{},g("label",{for:`colorStyle${i+1}`},g("a",{class:"iconSelectColorTable",style:`background-color: ${ae[x]?.light}`}),g("a",{class:"iconSelectColorTable",style:`background-color: ${ae[x]?.dark}`})),g("br"),g("input",{type:"radio",name:"colorStyle","data-colorid":x,id:`colorStyle${i+1}`,value:`colorStyle${i+1}`,...i===0?{checked:"checked"}:{}})))),u=[];return c.forEach((x,i)=>{i%7===0&&u.push(g("div",{class:"listaEstiloTabela"}));let f=i+1;u[u.length-1]?.append(g("span",{},g("label",{for:`tableStyle${f}`},g("a",{class:"iconSelectStyleTable",style:`background-position-y: -${f*43}px`})),g("br"),g("input",{type:"radio",name:"tableStyle",id:`tableStyle${f}`,value:`tableStyle${f}`,...i===0?{checked:"checked"}:{}})))}),g("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},g("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),s,g("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),g("div",{id:"addEstiloTabela",class:Et},...u),g("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",g("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),g("div",{style:"padding: 10px 0;"},g("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",g("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function d(n){try{let c=u=>Number.parseFloat(u?e.win.getComputedStyle(u).width:""),s=Math.round(100*c(n)/c(n?.parentElement??null));return Number.isFinite(s)?Math.min(100,Math.max(5,s)):80}catch{return 80}}function p(n,c){let s=c??o.getInstance();if(!s)return;let u=t(s),x=l(),i=x.querySelector("#addEstiloTableWidth");i&&(i.value=String(d(u)));for(let m of x.querySelectorAll('input[name="colorStyle"]'))m.addEventListener("change",()=>r(x,m.getAttribute("data-colorid")));let f=H(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:g("div",{},x,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:()=>{let m=x.querySelector('input[name="tableStyle"]:checked')?.value,b=x.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),h=x.querySelector("#addEstiloTableWidth")?.value,E=x.querySelector("#addEstiloTableHeader:checked")!==null;!m||!b||!h||(a(null,[m,b,h],s,E,u),f.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(n){let c=o.getInstance(n);c&&(t(c)?p(null,c):I(e.doc,Br))},changeColorTable(n){r(e.doc,n?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:n=>p(null,n),getSyleTable(n){let c=o.getInstance(n);c&&o.withEdit(c,()=>{})},setSyleTable:(n,c)=>a(null,n,c)}}};var Ct=/^[0-9A-Za-z-]+$/,Ur="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Gr=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,At={id:"tiny-url",globais(e){let o=d=>I(e.doc,d),t=d=>(e.fetch??e.win.fetch.bind(e.win))(d);async function r(d,p,n,c){let s=new URLSearchParams({url:d});p!==""&&s.set("alias",p);let u;try{u=await t(`https://tinyurl.com/api-create.php?${s}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(u.status===400)return o("Erro: Nenhuma link gerado"),!1;if(u.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let x=(await u.text()).trim();if(u.status!==200||!Gr.test(x))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(x),!0;let i=c??e.adaptador.getInstance();if(!i)return!1;let f=`<a href="${R(x)}" class="ancoraSei" target="_blank">${R(x)}</a>`;return e.adaptador.withEdit(i,()=>e.adaptador.insertHtml(i,f)),!0}function a(d){let p=e.adaptador.getInstance(d);if(!p)return;let n=g("input",{type:"text",id:"urlTiny"}),c=g("input",{type:"text",id:"aliasTiny"}),s=g("div",{id:"tinyResult"}),u=String(e.win.getSelection?.()??"").trim();u!==""&&j(u)&&(n.value=u),c.addEventListener("input",()=>{s.replaceChildren();let i=c.value;i!==""&&(Ct.test(i)?s.append(`Resultado: https://tinyurl.com/${i}`):s.append(g("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let x=H(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:K(z("Insira o link que deseja encurtar:",n),z("Insira um Nome Personalizado para o link (opcional):",c),s,g("div",{class:"spro-dialogo-rodape"},g("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let i=n.value.trim(),f=c.value.trim();if(i===""||!j(i))return o("Digite um link v\xE1lido!");if(f!==""&&!Ct.test(f))return o(Ur);if(f!==""&&f.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(i,f,"insert",p)&&x.fechar()}},"Inserir")))})}return{getTinyUrl:a,ajaxTinyUrl:(d,p,n)=>r(d,p,n)}}};var Ve=[Lo,at,gt,xo,bo,io,So,ht,ut,Ao,At,Po,yo,Bo,kt,vt,ft,nt,st,Ho];function St(e,o,t){let r=e,a=[],l=[];for(let d of o){let p=!0;try{for(let[n,c]of Object.entries(d.globais(t))){if(r[n]!==void 0){p=!1,l.push({id:d.id,erro:new Error(`global ja definido: ${n}`)});continue}r[n]=c}}catch(n){p=!1,l.push({id:d.id,erro:n})}p&&a.push(d.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:d.id})}catch{}}return{instalados:a,falhas:l}}function wt(e,o){let t=[];for(let r of e)try{r.iniciar?.(o)}catch(a){t.push({id:r.id,erro:a})}return t}var Tt=`/*
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
`;Se(Tt);var _t="__seiProEditorTs",Mt=window;if(!Mt[_t]){Mt[_t]=!0;let e=We(window);e.aoRecusarEscrita(()=>I(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(Xe)??"",checkOpcao:t=>to(t),verifyOpcao:t=>ro(t)};for(let t of St(window,Ve,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of wt(Ve,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
