/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Z(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(n=>e.importNode(n,!0))}function xe(e,o){if(!e||typeof o!="function")return;let t=e,r=t.__seiProCtxBuilders;if(!r){let n=[];r=t.__seiProCtxBuilders=n,e.addEventListener("contextmenu",l=>{let c=l;if(c.shiftKey)return;let p=[];for(let a of n)try{p=p.concat(a(c.target)||[])}catch{}p.length&&(c.preventDefault(),Ht(e.ownerDocument,p,c.clientX,c.clientY))})}r.includes(o)||r.push(o)}function Ht(e,o,t,r){e.getElementById("seiProCtxMenu")?.remove();let n=e.createElement("div");n.id="seiProCtxMenu",n.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",n.style.left=`${t}px`,n.style.top=`${r}px`;for(let c of o){let p=e.createElement("div");p.textContent=c.label,p.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",p.addEventListener("mouseenter",()=>{p.style.background="#eef"}),p.addEventListener("mouseleave",()=>{p.style.background=""}),p.addEventListener("click",()=>{n.remove(),c.action()}),n.append(p)}e.body.append(n);let l=()=>{n.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function Ze(e,o,t){if(typeof t!="function")return;let r=e.__seiProCtx;if(!r){let n={acoes:{},construtores:[]};r=e.__seiProCtx=n;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let c=l?.$??null,p=null;for(let a of n.construtores){let d=[];try{d=a(c)||[]}catch{d=[]}for(let i of d){let m=`seiPro_${String(i.label).replace(/[^A-Za-z0-9]/g,"_")}`;n.acoes[m]=i.action,e.getCommand(m)||e.addCommand(m,{exec:()=>(n.acoes[m]?.(),!0)}),e.getMenuItem(m)||e.addMenuItem(m,{label:i.label,command:m,group:"seiProGroup"}),p=p??{},p[m]=o}}return p})}r.construtores.includes(t)||r.construtores.push(t)}var $=e=>e;function eo(e,o={}){let t=()=>e.CKEDITOR,r=a=>!!a?.name&&t()?.instances[a.name]===a,n=a=>r(a)&&!a.readOnly,l=a=>$(a).document?.getBody()?.$??null,c=(a,d)=>{if(!a)return;let i=$(a);if(i.readOnly){o.fn?.();return}d(i)},p={versao:4,getInstance(a){let d=t();if(!d?.instances)return null;if(r(d.currentInstance))return d.currentInstance;let i=a?.closest?.("div.cke"),m=i?d.instances[i.id.replace("cke_","")]:void 0;if(n(m))return m;if(n(e.oEditor))return e.oEditor;let b=Object.values(d.instances);return b.find(s=>n(s))??b[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:a=>$(a).focus(),saveSnapshot:a=>$(a).fire("saveSnapshot"),withEdit(a,d){let i=$(a);i.focus(),i.fire("saveSnapshot"),i.fire("lockSnapshot",{dontUpdate:!0});try{d()}finally{i.fire("unlockSnapshot"),i.fire("saveSnapshot")}},insertHtml:(a,d)=>c(a,i=>i.insertHtml(d)),insertText:(a,d)=>c(a,i=>i.insertText(d)),getSelectionElement:a=>$(a).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(a){return p.getSelectionElement(a)?.closest("p")??null},insertHtmlBefore(a,d,i){c(a,()=>d.before(...Z(d.ownerDocument,i)))},getToolbarContainer:a=>$(a).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:a=>l(a),findInBody(a,d){let i=l(a);return i?Array.from(i.querySelectorAll(d)):[]},appendToBody(a,d){c(a,i=>{let m=l(i);m&&m.append(...Z(m.ownerDocument,d))})},transformBodyHtml(a,d){c(a,i=>{let m=l(i);if(!m)return;let b=m.innerHTML,s=d(b);typeof s=="string"&&s!==b&&m.replaceChildren(...Z(m.ownerDocument,s))})},execCommand:(a,d,i)=>$(a).execCommand(d,i),applyStyle(a,d){let i=t()?.style;i&&$(a).applyStyle(new i(d))},getData:a=>$(a).getData(),setData:(a,d)=>c(a,i=>i.setData(d)),insertElement(a,d){c(a,i=>{let m=t()?.dom?.element.createFromHtml;m&&i.insertElement?i.insertElement(m(d,i.document)):i.insertHtml(d)})},saveSelection:a=>$(a).getSelection()?.createBookmarks(!0)??null,restoreSelection(a,d){let i=$(a).getSelection();i&&d&&i.selectBookmarks(d)},getSelectedText:a=>$(a).getSelection()?.getSelectedText()??"",getSelectedHtml(a){return $(a).getSelectedHtml?.()?.getHtml?.()??""},on:(a,d,i)=>$(a).on(d,i),off:(a,d,i)=>$(a).removeListener(d,i),fire:(a,d,i)=>$(a).fire(d,i),addContextMenu(a,d){let i=$(a),m=t();if(m&&i.contextMenu&&typeof i.addMenuItem=="function"){Ze(i,m.TRISTATE_OFF,d);return}xe(l(a),d)},waitReady(a){return new Promise((d,i)=>{let m=Date.now(),b=()=>{let s=Object.values(t()?.instances??{}).find(g=>g.status==="ready");if(s)return d(s);if(Date.now()-m>a)return i(new Error("Timeout aguardando CKEditor 4"));setTimeout(b,100)};b()})},somenteLeitura:a=>!!$(a).readOnly,aoRecusarEscrita(a){o.fn=a},recusarEscrita(){o.fn?.()}};return p}var N=e=>e,Qt={strike:"strikethrough",strikethrough:"strikethrough"},Ot={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},zt=0;function oo(e,o={}){let t=e.document,r=s=>Array.from(s.model.document.roots??[]).filter(g=>g.isAttached()&&g.rootName!=="$graveyard"),n=s=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[s],l=(s,g)=>{let u=s.editing.view.document.getRoot(g);return u?s.editing.view.domConverter.mapViewToDom(u):null},c=s=>{for(let h of r(s))if(n(h.rootName)?.principal){let x=l(s,h.rootName);if(x)return x}let g=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return g||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((h,x)=>x.childElementCount>(h?h.childElementCount:-1)?x:h,null)},p=s=>{let g=c(s);return g&&r(s).find(u=>l(s,u.rootName)===g)||null},a=s=>s.model.document.selection.getFirstPosition()?.root.rootName??null,d=s=>!!s&&!!n(s)?.somenteLeitura,i=(s,g)=>s.data.toModel(s.data.processor.toView(g)),m=(s,g)=>{let u=N(s);if(d(a(u)))return o.fn?.();u.model.change(()=>u.model.insertContent(i(u,g),u.model.document.selection))},b={versao:5,getInstance(){let s=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return s&&s.state==="ready"?s:null},getAllInstances(){let s=b.getInstance();return s?[s]:[]},focus:s=>N(s).focus(),saveSnapshot(){},withEdit(s,g){let u=N(s);u.focus(),u.model.change(()=>g())},insertHtml:m,insertText(s,g){let u=N(s);if(d(a(u)))return o.fn?.();u.model.change(h=>u.model.insertContent(h.createText(g)))},getSelectionElement(){let s=e.getSelection?.(),g=s&&s.rangeCount>0?s.anchorNode:null;return g?g.nodeType===1?g:g.parentElement:null},getSelectionParagraph:s=>b.getSelectionElement(s)?.closest("p")??null,insertHtmlBefore(s,g,u){let h=N(s),x=h.editing.view.domConverter.mapDomToView(g),v=x?h.editing.mapper.toModelElement(x):null;if(v){if(d(v.root?.rootName))return o.fn?.();h.model.change(A=>h.model.insertContent(i(h,u),A.createPositionBefore(v)));return}m(s,u)},getToolbarContainer(s){let g=N(s).ui?.view?.toolbar?.element;return g?g.querySelector(".ck-toolbar__items")??g:null},getBodyContainer:s=>c(N(s)),findInBody(s,g){let u=c(N(s));return u?Array.from(u.querySelectorAll(g)):[]},appendToBody(s,g){let u=N(s),h=p(u);if(!h)return m(s,g);if(d(h.rootName))return o.fn?.();u.model.change(x=>u.model.insertContent(i(u,g),x.createPositionAt(h,"end")))},transformBodyHtml(s,g){let u=N(s),h=p(u);if(!h)return;let x=u.data.get({rootName:h.rootName,seiProInterno:!0}),v=g(x);if(typeof v!="string"||v===x)return;let A=u.model.document.selection.getFirstRange(),y=A&&A.start.root.rootName===A.end.root.rootName?{raiz:A.start.root,ps:[...A.start.path],pe:[...A.end.path]}:null,E=u.model.document.selection.isBackward;u.data.set({[h.rootName]:v}),y&&u.model.change(w=>{let _,k;try{_=u.model.createPositionFromPath(y.raiz,y.ps),k=u.model.createPositionFromPath(y.raiz,y.pe)}catch{_=k=w.createPositionAt(y.raiz,"end")}w.setSelection(w.createRange(_,k),{backward:E})})},execCommand(s,g,u){N(s).execute(Qt[g]??g,u!==void 0?{value:u}:void 0)},applyStyle(s,g){let u=Ot[g.element.toLowerCase()];u&&N(s).execute(u)},getData(s){let g=N(s),u=p(g);return u?g.data.get({rootName:u.rootName}):g.data.get()},setData(s,g){let u=N(s),h=p(u);h?u.data.set({[h.rootName]:g}):u.data.set(g)},insertElement:(s,g)=>b.insertHtml(s,g),saveSelection(s){let g=N(s),u=`spro-ed:${zt++}`;return g.model.change(h=>{let x=g.model.document.selection.getFirstRange();x&&h.addMarker(u,{range:x,usingOperation:!1})}),u},restoreSelection(s,g){let u=N(s);if(typeof g!="string")return;let h=u.model.markers.get(g);h&&u.model.change(x=>x.setSelection(h.getRange())),u.model.change(x=>{u.model.markers.has(g)&&x.removeMarker(g)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let s=e.getSelection?.();if(!s||s.rangeCount===0)return"";let g=t.createElement("div");return g.append(s.getRangeAt(0).cloneContents()),g.innerHTML},on(s,g,u){if(g==="change")return N(s).model.document.on("change:data",u);c(N(s))?.addEventListener(g,u)},off(s,g,u){if(g==="change")return N(s).model.document.off("change:data",u);c(N(s))?.removeEventListener(g,u)},fire(s,g,u){c(N(s))?.dispatchEvent(new CustomEvent(g,{detail:u}))},addContextMenu(s,g){xe(c(N(s)),g)},waitReady(s){return new Promise((g,u)=>{let h=Date.now(),x=()=>{let v=b.getInstance();if(v)return g(v);if(Date.now()-h>s)return u(new Error("Timeout aguardando CKEditor 5"));setTimeout(x,100)};x()})},somenteLeitura:s=>d(a(N(s))),aoRecusarEscrita(s){o.fn=s},recusarEscrita(){o.fn?.()}};return b}function _e(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function to(e){let o=null,t={},r=()=>{if(o)return o;let c=_e(e);return c===5?o=oo(e,t):c===4&&(o=eo(e,t)),o},n=()=>{let c=r();if(!c)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return c},l=c=>((...p)=>n()[c](...p));return{get versao(){return r()?.versao??0},getInstance:c=>r()?.getInstance(c)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(c){t.fn=c},recusarEscrita(){t.fn?.()},waitReady(c){let p=Date.now();return new Promise((a,d)=>{let i=()=>{let m=r();if(m)return m.waitReady(Math.max(1,c-(Date.now()-p))).then(a,d);if(Date.now()-p>c)return d(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(i,100)};i()})}}}var ro="data-base";function no(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(n=>n?.configGeral).find(Array.isArray)?.find(n=>n?.name===o)?.value}function ao(e,o){let t=no(e,o);return!(t===!1||t===0||t==="")}function io(e,o){let t=no(e,o);return t===!0||t===1||t==="1"}function so(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function lo(e,o=localStorage){return ao(so(o),e)}function co(e,o=localStorage){return io(so(o),e)}function ve(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function ye(e){e.style.display="none"}var uo=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function po(e){let o=()=>e.adaptador.versao===5,t=(r,n)=>{let l=r.editing.view.domConverter.mapDomToView(n);return l?r.editing.mapper.toModelElement(l):null};return{selecionados(r){let n=()=>{let s=e.adaptador.getSelectionParagraph(r);return s?[s]:[]};if(o()){let s=r,u=[...s.model.document.selection.getSelectedBlocks()].map(h=>{let x=s.editing.mapper.toViewElement(h);return x?s.editing.view.domConverter.mapViewToDom(x):null}).filter(h=>!!h&&h.tagName==="P");return u.length?u:n()}let c=e.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!c||c.rangeCount===0||!c.anchorNode)return n();let p=uo(c.anchorNode),a=uo(c.focusNode);if(!p&&!a||(p=p??a,a=a??p,!p||!a))return n();if(p===a)return[p];let d=p,i=a;p.compareDocumentPosition(a)&2&&(d=a,i=p);let m=[],b=d;for(let s=0;b&&s<5e3&&(b.tagName.toLowerCase()==="p"&&m.push(b),b!==i);s+=1)b=b.nextElementSibling;return m.length?m:[d]},classeDeEstilo(r,n){return o()?t(r,n)?.getAttribute("estilo")??"":n.getAttribute("class")??""},definirClasse(r,n,l){if(o()){let c=r,p=t(c,n);p&&c.model.change(a=>a.setAttribute("estilo",l,p)),e.win.SeiProGhs?.setEstilos(n,{"text-align":null},r);return}n.removeAttribute("style"),n.setAttribute("class",l)},definirTextAlign(r,n,l){if(o()){e.win.SeiProGhs?.setEstilos(n,{"text-align":l},r);return}n.removeAttribute("style"),n.style.textAlign=l}}}var jt=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function Bt(e,o){let t=jt.find(r=>Object.values(r).includes(e));return t?t[o]:null}function Ft(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=e?.parentElement??null;r;r=r.parentElement){let n=r.querySelector(".divAlignText");if(n)return n}return o.querySelector(".divAlignText")}var mo={id:"align",globais(e){let o=po(e);return{setAlignText(t,r){let n=e.adaptador.getInstance(t);if(!n||e.adaptador.somenteLeitura(n))return;let l=o.selecionados(n);l.length&&e.adaptador.withEdit(n,()=>{for(let c of l){let p=Bt(o.classeDeEstilo(n,c),r);p?o.definirClasse(n,c,p):o.definirTextAlign(n,c,r)}})},openAlignText(t){if(!t)return;let r=Ft(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&ye(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&ve(r))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function f(e,o={},...t){let r=document.createElement(e);for(let[n,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?r.addEventListener(n.replace(/^on/,""),l):l===!0?r.setAttribute(n,""):n==="class"?r.className=l:n==="value"&&e==="textarea"?r.value=l:r.setAttribute(n,l));for(let n of t)n!=null&&n!==!1&&r.append(n);return r}var U={fill:"currentColor",stroke:"none"},fo="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",go={estrela:[["path",{d:fo}]],estrelaCheia:[["path",{d:fo,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...U}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...U}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...U}],["circle",{cx:"12",cy:"12",r:"1.4",...U}],["circle",{cx:"19",cy:"12",r:"1.4",...U}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...U}],["circle",{cx:"15",cy:"6",r:"1.3",...U}],["circle",{cx:"9",cy:"12",r:"1.3",...U}],["circle",{cx:"15",cy:"12",r:"1.3",...U}],["circle",{cx:"9",cy:"18",r:"1.3",...U}],["circle",{cx:"15",cy:"18",r:"1.3",...U}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},wn=Object.keys(go);function ue(e,o=18,t=document){let r="http://www.w3.org/2000/svg",n=t.createElementNS(r,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[c,p]of Object.entries(l))n.setAttribute(c,p);for(let[c,p]of go[e]){let a=t.createElementNS(r,c);for(let[d,i]of Object.entries(p))a.setAttribute(d,i);n.append(a)}return n}function Vt(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function bo(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function ho(e,o,t,r,n){let l=e.body??e.documentElement;for(let m of[l,...e.querySelectorAll("dialog")])for(let b of[...m.children])b.classList.contains("spro-aviso")&&b.remove();let c=f("div",{class:"spro-aviso",role:"status"},ue("check",16),f("span",{},o),...Vt(t).map(m=>f("button",{type:"button",onclick:()=>{c.remove(),m.fazer()}},m.rotulo)));c.setAttribute("popover","manual");let p=()=>{try{c.showPopover?.()}catch{}},a=Date.now()+r,d=()=>{let m=bo(e);m.append(c),p(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!i||!m.contains(c))){if(n&&bo(e).localName!=="dialog"&&n(o,t,Math.max(0,a-Date.now()))){i=!1,c.remove();return}d()}},{once:!0})},i=!0;return d(),setTimeout(()=>{i=!1,c.remove()},r),c}var Ut=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function xo(e={}){return({titulo:o,conteudo:t,icone:r,aoFechar:n})=>{let l=f("dialog",{class:"spro-dialogo","aria-label":o}),c=()=>{l.open&&l.close()};return l.append(f("header",{},r?f("span",{class:"spro-dialogo-icone","aria-hidden":"true"},ue(r,18)):null,f("h2",{},o),f("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:c},ue("fechar",16))),f("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),n?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(Ut)?.focus({preventScroll:!0}),{fechar:c}}}function vo(e){let o=xo();return(t,r)=>(Me(t,e),o(r))}function Me(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var Le="";function qe(e){Le=e}var H=(e,o)=>vo(Le)(e,o);function yo(e){Me(e,Le)}function L(e,o){yo(e),ho(e,o,void 0,7e3)}var Gt=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),Eo=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Jt(e){let o=0,t=e.split("");return t.forEach((r,n)=>{let l=Eo.get(r),c=Eo.get(t[n+1]);o+=l<c?-l:l}),o}function ee(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Gt.has(o.toLowerCase())&&t!==0?o.toLowerCase():Jt(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function P(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ko={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let r=e.adaptador.getSelectedText(t);if(!r||r.trim()===""){L(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,P(ee(r)))}})};var Co="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function K(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let r of o)t+=Co[r%Co.length];return t}var Kt=()=>`<span class="ancoraSei checkboxSEI" data-id="${K(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,Ao={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Kt()))}})};var Pe="copyStylePro",Re="cke_copyformatting_active",So=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i,Wt="rgb(251, 251, 254)";function Xt(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),r=!!e.ownerDocument.documentElement.classList.contains("dark-mode"),n=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&n?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"||o.color===Wt&&r?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var wo={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(Pe)??"null")}catch{return null}},n=i=>o.getSelectedHtml(i).trim()!==""||o.getSelectedText(i).trim()!=="",l=i=>!!o.getBodyContainer(i)?.classList.contains(Re),c=i=>{for(let m of e.doc.querySelectorAll(".getCopyStyleButtom"))i==="desabilitar"?m.classList.add("cke_button_disabled"):i==="habilitar"?m.classList.remove("cke_button_disabled"):(m.classList.toggle("cke_button_on",i),m.classList.toggle("cke_button_off",!i))};function p(){let i=o.getInstance();i&&o.getBodyContainer(i)?.classList.remove(Re),t().removeItem(Pe),c(!1)}function a(i){let m=i??o.getInstance();if(!m)return;if(l(m)){p();return}let b=o.getSelectionElement(m);b&&(t().setItem(Pe,JSON.stringify(Xt(b))),o.getBodyContainer(m)?.classList.add(Re),c(!0))}function d(){let i=o.getInstance();if(!i)return;let m=n(i),b=l(i);c(m||b?"habilitar":"desabilitar");let s=r();if(!(s&&m&&b))return;o.withEdit(i,()=>{o.execCommand(i,"removeFormat");for(let[h,x]of[[s.bold,"bold"],[s.underline,"underline"],[s.italic,"italic"],[s.strike,"strike"],[s.subscript,"subscript"],[s.superscript,"superscript"]])h===!0&&o.execCommand(i,x);let u=[];if(typeof s.backgroundColor=="string"&&So.test(s.backgroundColor)&&u.push(`background-color: ${s.backgroundColor}`),typeof s.fontSize=="number"&&Number.isFinite(s.fontSize)&&s.fontSize>0&&s.fontSize<400&&u.push(`font-size: ${s.fontSize}px`),typeof s.color=="string"&&So.test(s.color)&&u.push(`color: ${s.color}`),u.length){let h=o.getSelectedHtml(i);h!==""&&o.insertHtml(i,`<span style="${u.join("; ")}">${h}</span>`)}}),!!e.win.event?.altKey||p()}return{setCopyStyle(i){let m=o.getInstance(i);m&&a(m)},actionCopyStyle:a,getCopyStyle:r,applyCopyStyle:d,removeCopyStyle:p,menuCopyStyle(i){i&&o.addContextMenu(i,m=>o.versao===5?[]:m?.closest("p")&&n(i)?[{label:"Copiar formata\xE7\xE3o",action:()=>a(i)}]:[])}}}};var Ie="spro_editor_folha",To="seipro-folha-editor",De="data-spro-folha-editor",Yt=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function Zt(e){let o=`html[${De}]`,t=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",n="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${n}, -14px 0 24px -14px ${n}`,c=`0 14px 24px -14px ${n}`,p=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${p} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${p}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${p}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${c}; clip-path: inset(0 -30px -30px); }
${p}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${p} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${r} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function _o(e,o){if(!e.head||(e.querySelector(`style[data-style="${To}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",To),t.textContent=o,e.head.append(t)}function Mo(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[r,n]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,n||"")}}var Lo={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(Ie),r=()=>!!e.win.localStorage?.getItem("darkModePro"),n=!1;function l(a){for(let d of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let i=d.contentDocument;i?.head&&(_o(i,a?Yt:null),Mo(i.documentElement,a),Mo(i.body,a))}}function c(a){let d=[...o.querySelectorAll(".cke_contents")];d.forEach((i,m)=>{if(!a){i.removeAttribute("data-spro-folha");return}let b=[m===0?"primeira":"",m===d.length-1?"ultima":""].filter(Boolean);i.setAttribute("data-spro-folha",b.join(" ")||"meio")})}function p(a){_o(o,a?Zt(r()):null),l(a),c(a),a?o.documentElement.setAttribute(De,""):o.documentElement.removeAttribute(De);for(let d of o.querySelectorAll(".getPaperViewButtom"))d.classList.toggle("cke_button_on",a),d.classList.toggle("cke_button_off",!a),d.setAttribute("aria-pressed",a?"true":"false")}return{aplicarFolhaEditorPro:p,getPaperViewButtom(a){let d=!t();d?e.win.localStorage.setItem(Ie,"1"):e.win.localStorage.removeItem(Ie),p(d)},initFolhaEditorPro(){let a=e.win.CKEDITOR;if(typeof a?.on=="function"&&!n){n=!0;let d=i=>i.on("contentDom",()=>t()&&l(!0));for(let i of Object.values(a.instances??{}))d(i);a.on("instanceReady",i=>d(i.editor))}p(t())}}}};function er(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var qo={id:"font-size",globais:e=>({changeFontSize(o,t){let r=e.adaptador.getInstance(o);if(!r)return;let n=e.adaptador.getSelectedHtml(r);if(!n||n.trim()===""){L(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=er(e.adaptador.getSelectionElement(r)),c=t==="up"?l+2:l-2;c>7&&c<70&&e.adaptador.withEdit(r,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${c}px`}}):e.adaptador.insertHtml(r,`<span style="font-size: ${c}px">${n}</span>`)})}})};var Ee=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,or=[{name:Ee,attributes:!0},{name:Ee,classes:!0},{name:Ee,styles:!0}],pe=e=>e.split("").join("[\\t\\n\\r]*"),Ne=new RegExp(`^[\\s\\x00-\\x20]*(${pe("javascript")}|${pe("vbscript")}|${pe("livescript")}|${pe("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${pe("text/html")})`,"i"),tr=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:Ne}]}];function ne(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function me(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var rr=e=>!!(e?.model&&e.editing&&e.conversion),nr=e=>me(e,"EstiloEditing")?.estilos??{},Po=(e,o)=>Object.hasOwn(e,o);function Do(e,o){let t=me(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function ar(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function ir(e,o,t){if(!o?.is?.("element"))return;let r=t.mapper.toViewElement(o);if(!r)return;let n=nr(e),l=o.getAttribute("estilo"),c=ar(o,Do(e,"p")),p=t.writer,a=[];try{a=Array.from(r.getClassNames())}catch{}for(let d of a)d!==l&&Po(n,d)&&p.removeClass(d,r);for(let d of c)Po(n,d)||p.addClass(d,r);l&&p.addClass(l,r)}function sr(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Do(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let r of o)t.on(r,(n,l,c)=>{try{ir(e,l.item,c)}catch{}},{priority:"lowest"})})}function lr(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function Ro(e,o){let t=me(o,"Salvar"),r=t?!!t.isDirty:!1;try{e()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function cr(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function dr(e,o){let t=e.getFullData({seiProInterno:!0}),r=o.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||cr(e)?t:Object.fromEntries(Object.keys(t).map(n=>[n,typeof r[n]=="string"?r[n]:t[n]]))}function ur(e,o,t){try{let r=t??e.adaptador.getSelectionParagraph(o);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let n=r.jquery?r.get(0):r;if(n?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(n);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function pr(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function Io(e){let o=l=>l??e.adaptador.getInstance();function t(l){let c=o(l);if(!rr(c))return!1;if(c.__seiProGhsLiberado)return!0;let p=me(c,"DataFilter");if(!p)return ne("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{p.allowElement({name:Ee,attributes:!0,classes:!0,styles:!0});for(let a of or)p.allowAttributes(a);if(typeof p.disallowAttributes=="function")for(let a of tr)p.disallowAttributes(a)}catch(a){return ne("falha ao liberar o GHS",a),!1}return c.__seiProGhsLiberado=!0,sr(c),!0}function r(l){let c=o(l);if(!t(c)||typeof c.getFullData!="function")return!1;let p=!0;return Ro(()=>{try{c.data.set(dr(c,e.win))}catch(a){ne("falha ao reprocessar o conteudo",a),p=!1}},c),p}function n(l,c,p){let a=o(l);if(!t(a))return!1;let d=me(a,"GeneralHtmlSupport"),i=ur(e,a,c),m=i?pr(a,i):null;if(!d||!i||!m)return!1;try{return p(d,m,i),!0}catch(b){return ne("falha ao aplicar no model",b),!1}}return{liberar:t,aplicarRegras:r,semSujar:(l,c)=>Ro(l,o(c)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,c,p)=>n(p,l,(a,d,i)=>a.addModelHtmlClass(d,c,i)),removeClasse:(l,c,p)=>n(p,l,(a,d,i)=>a.removeModelHtmlClass(d,c,i)),setEstilos:(l,c,p)=>n(p,l,(a,d,i)=>a.setModelHtmlStyles(d,c,i)),setAtributos:(l,c,p)=>n(p,l,(a,d,i)=>a.setModelHtmlAttributes(d,c,i))}}var No={id:"ghs-unlock",globais:e=>({SeiProGhs:Io(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=Io(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||lr(t)){ne("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&ne("classes, estilos e atributos liberados no editor")}}};function W(...e){return f("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function j(e,o){return o.classList.add("spro-campo"),o.style.width="100%",f("label",{style:"display:grid;gap:4px;font-size:13px;"},f("span",{},e),o)}function $o(e,o){return new Promise((t,r)=>{let n=new e.Image;n.crossOrigin="anonymous",n.onload=()=>{try{let l=e.document.createElement("canvas");l.width=n.width,l.height=n.height,l.getContext("2d")?.drawImage(n,0,0),t(l.toDataURL("image/png"))}catch(l){r(l)}},n.onerror=()=>r(new Error("imagem nao carregou")),n.src=o})}var mr="https://latex.codecogs.com/png.latex?",fr="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",gr="https://editor.codecogs.com/",Ho={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(a=>$o(e.win,a)),r=a=>L(e.doc,a);function n(){let a=o;if(!a)return;let d=a.texto.value;a.geracao+=1;let i=a.geracao;if(a.previa.replaceChildren(),a.pronta=!1,a.falhou=!1,d==="")return;let m=f("img",{src:`${mr}${encodeURI(d)}`});a.previa.append(m),t(m.getAttribute("src")??"").then(b=>{o!==a||a.geracao!==i||(m.setAttribute("src",b),m.className="img-base64",a.pronta=!0)},()=>{o===a&&a.geracao===i&&(a.falhou=!0)})}function l(){let a=o;if(!a)return!1;let d=a.texto.value;if(d==="")return r("Digite a equa\xE7\xE3o"),!1;if(a.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let i=a.previa.querySelector("img");if(!a.pronta||!i)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let m=a.ed,b=`<img class="img-base64" src="${P(i.getAttribute("src")??"")}" alt="${P(d)}">`;return e.adaptador.withEdit(m,()=>e.adaptador.insertHtml(m,b)),!0}function c(a){let d=e.adaptador.getInstance(a);if(!d)return;let i=f("textarea",{id:"MathText",rows:"5"});i.addEventListener("input",n);let m=f("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),b=H(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:W(j("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",i),m,f("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",f("a",{href:fr,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",f("a",{href:gr,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&b.fechar()}},"Inserir")))});o={ed:d,texto:i,previa:m,geracao:0,pronta:!1,falhou:!1};let s=String(e.win.getSelection?.()??"").trim();s!==""&&(i.value=s,n())}function p(){}return{updatePreviewLatex:n,openDialogLatex:c,getDialogLatex:p}}};function oe(e){return{onclick:e,onkeydown:o=>{let t=o.key;t!=="Enter"&&t!==" "||(o.preventDefault(),e(o))}}}function B(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var fe="https://legis.seipro.app/v1",br=50,hr={lei:"Lei","lei.complementar":"LC",decreto:"Dec","decreto.lei":"DecLei","medida.provisoria":"Mp","emenda.constitucional":"Ec","decreto.legislativo":"DecLeg",resolucao:"Res"};function xr(e){let o=String(e??""),t=o.split(","),r=/(\d{4})\s*$/.exec(o);return t.length>1&&r?`${(t[0]??"").trim()}, de ${r[1]}`:o}function vr(e){let o=String(e??"").replace(/\s+/g," ").trim();for(;/\s*\([^()]*\)$/.test(o);)o=o.replace(/\s*\([^()]*\)$/,"").trim();return!o||o===o.toUpperCase()?"":o}var yr=e=>B(e)?e:"";function Qo(e){return{sigla:e.tipo==="constituicao"?"Cf":(hr[e.tipo??""]??String(e.tipo??"").replace(/[^A-Za-z]/g,""))+String(e.numero??"").replace(/[^0-9-]/g,""),titulo:e.titulo||e.titulo_curto||"",curto:e.titulo_curto||xr(e.titulo),apelido:vr(e.apelido),url:yr(e.url||(e.urn?`https://normas.leg.br/?urn=${e.urn}`:"")),ementa:e.ementa||"",revogada:e.situacao==="revogada"}}function Oo(e,o){let t=P,r=o?t(e.curto||e.titulo):t(e.titulo)+(e.apelido?`&nbsp;(${t(e.apelido)})`:""),n=e.url?` href="${t(e.url)}" target="_blank"`:"";return`<a class="ancoraSei legisSeiPro" data-norma="${t(e.sigla)}" data-normafull="${t(e.titulo)}" data-index="0"${n}>${r}</a>`}async function $e(e,o,t){let r=new URLSearchParams({per_page:String(br)});for(let[p,a]of Object.entries(t))a!==""&&a!==null&&a!==void 0&&r.set(p,String(a));let n=await e(`${o}/normas?${r}`);if(!n.ok)throw new Error(`HTTP ${n.status}`);let l=await n.json(),c=(l?.itens??[]).map(Qo);return{total:l?.total??c.length,normas:c}}async function He(e,o,t,r=!1){let n=[];for(let c of t){let p=String(c??"").trim().slice(0,60);p&&!n.includes(p)&&n.push(p)}let l={};if(!n.length)return l;try{let c=await e(`${o}/normas/resolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refs:n.slice(0,200)})});if(!c.ok){if(r)throw new Error(`HTTP ${c.status}`);return l}let p=await c.json();for(let[a,d]of Object.entries(p?.resultados??{}))d&&(l[a]=Qo(d))}catch(c){if(r)throw c}return l}var Qe=e=>({ano:"exato",ate:"ate",apos:"apos"})[e]??"exato";function Oe(e){let o=String(e??"").split(/[/-]/)[0]?.replace(/[^0-9]+/g,"");return o?Number.parseInt(o,10):""}function zo(e){let o=String(e??"").toLowerCase();return/emenda constitucional|\bec\b/.test(o)?"emenda.constitucional":/decreto legislativo/.test(o)?"decreto.legislativo":/lei complementar|\blc\b/.test(o)?"lei.complementar":/decreto-lei|decreto lei|\bdl\b/.test(o)?"decreto.lei":/medida provis[o\u00f3]ria|\bmp\b/.test(o)?"medida.provisoria":/decreto|\bdec\b/.test(o)?"decreto":/\blei\b/.test(o)?"lei":""}var Er=[["",""],["Lei","lei"],["Lei Complementar","lei.complementar"],["Decreto","decreto"],["Decreto-Lei","decreto.lei"],["Medida Provis\xF3ria","medida.provisoria"],["Emenda Constitucional","emenda.constitucional"],["Decreto Legislativo","decreto.legislativo"]],kr=[["",""],["No ano","ano"],["At\xE9 o ano de...","ate"],["Ap\xF3s o ano de...","apos"]],Cr=[["",""],["ANTAQ","Antaq"],["Cade","Cade"],["PRF","PRF"],["TSE","Tse"],["TRE RR","Trerr"],["TJ RR","TJRR"],["CNJ","CNJ"]],Ar=[["",""],["Acordo/Plano/Ato/Nota","acord"],["Ata e Certid\xF5es de Julgamento","atas"],["Constitui\xE7\xE3o Estadual","ce"],["Decreto Estadual","decest"],["Edital","Edit"],["Enunciado Administrativo","enumadm"],["Emenda Constitucional","ec"],["Emenda Regimental","er"],["Emendas","Emenda"],["Instru\xE7\xE3o Normativa","in"],["Instru\xE7\xE3o Normativa Conjunta","resconj"],["Lei Complementar Estadual","lce"],["Lei Estadual","leiest"],["Lei Municipal","leimun"],["Nota T\xE9cnica","nt"],["Orienta\xE7\xE3o Normativa","on"],["Portaria","port"],["Portaria Conjunta","portconj"],["Portaria Interministerial","portinter"],["Portaria Interinstitucional","portinst"],["Provimento","prov"],["Recomenda\xE7\xE3o","Rec"],["Regimento Interno","regim"],["Resolu\xE7\xE3o Normativa","rn"],["Resolu\xE7\xE3o","res"],["Resolu\xE7\xE3o Conjunta","resconj"],["S\xFAmula Administrativa","sum"]],Sr=[["",""],["C\xF3digo Brasileiro de Aeron\xE1utica","Lei7565/1986"],["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es","Lei4117/1962"],["C\xF3digo Civil","Lei10406/2002"],["C\xF3digo Comercial","Lei556/1850"],["C\xF3digo de Defesa do Consumidor","Lei8078/1990"],["Constitui\xE7\xE3o Federal","Cf"],["C\xF3digo Florestal","Lei12651/2012"],["Consolida\xE7\xE3o das Leis do Trabalho","DecLei5452/1943"],["C\xF3digo de \xC1guas","Dec24643/1934"],["C\xF3digo Eleitoral","Lei4737/1965"],["C\xF3digo de Minas","DecLei227/1967"],["C\xF3digo Penal","DecLei2848/1940"],["C\xF3digo de Processo Civil","Lei13105/2015"],["C\xF3digo Penal Militar","DecLei1001/1969"],["C\xF3digo de Processo Penal","DecLei3689/1941"],["C\xF3digo de Processo Penal Militar","DecLei1002/1969"],["C\xF3digo de Tr\xE2nsito Brasileiro","Lei9503/1997"],["C\xF3digo Tribut\xE1rio Nacional","Lei5172/1966"],["Estatuto da Crian\xE7a e do Adolescente","Lei8069/1990"],["Estatuto da Cidade","Lei10257/2001"],["Estatuto do Desarmamento","Lei10826/2003"],["Estatuto do Idoso","Lei10741/2003"],["Estatuto da Igualdade Racial","Lei12288/2010"],["Estatuto do \xCDndio","Lei6001/1973"],["Estatuto da Juventude","Lei12852/2013"],["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte","LC123/2006"],["Estatuto dos Militares","Lei6880/1980"],["Estatuto dos Museus","Lei11904/2009"],["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)","Lei8906/1994"],["Estatuto da Pessoa com Defici\xEAncia","Lei13146/2015"],["Estatuto dos Refugiados","Lei9474/1997"],["Estatuto da Terra","Lei4504/1964"],["Estatuto de Defesa do Torcedor","Lei10671/2003"]],jo="Servi\xE7o de legisla\xE7\xE3o indispon\xEDvel no momento. Tente novamente mais tarde.",Bo="Nenhuma legisla\xE7\xE3o encontrada";function wr(e){let o=e.replace(/(\r\n|\n|\r)/gm," ").trim();/[A-Z]/.test(o)&&o===o.toUpperCase()&&(o=o.charAt(0)+o.toLocaleLowerCase().slice(1));let t=o.length>170;return{curta:t?`${o.replace(/^(.{170}\S*)[\s\S]*/,"$1")}...`:o,completa:o,longa:t}}var Fo={id:"legis",globais(e){let o=e.adaptador,t=k=>L(e.doc,k),r=(k,C)=>(e.fetch??e.win.fetch.bind(e.win))(k,C),n=[],l=null,c=0,p=null;function a(k,C){He(r,fe,k??[]).then(C)}function d(k,C){let S=C??o.getInstance();if(!S||!k)return;let q=o.findInBody(S,"a").some(T=>k.url&&T.getAttribute("href")===k.url||T.getAttribute("data-norma")===k.sigla),M=o.saveSelection(S);o.focus(S),M&&o.restoreSelection(S,M),o.withEdit(S,()=>{o.insertElement(S,Oo(k,q))})}function i(k,C){let S=C??p??o.getInstance();S&&He(r,fe,[k],!0).then(q=>{let M=q[String(k??"").trim()];if(!M)return t(Bo);d(M,S)},()=>t(jo))}function m(k,C){let S=wr(k.ementa),q=k.revogada?"text-decoration:line-through;color:#adadad;":"",M=k.url?f("a",{class:"linkDialog",href:k.url,target:"_blank",rel:"noopener noreferrer"},k.titulo," \u2197"):f("span",{},k.titulo),T=f("button",{type:"button",class:"spro-botao","data-legis-idx":String(C),style:"float:right;margin-left:10px;",onclick:()=>A(T)},"Adicionar"),R=f("div",{class:"searchLegis_linha",style:"border-bottom:2px solid #efefef;padding:10px 0;"},f("p",{},M,k.apelido?f("span",{style:"opacity:.7;"},` (${k.apelido})`):null,k.revogada?f("span",{style:"background:#e0e0e0;padding:1px 5px;color:#444;border-radius:5px;margin-left:10px;"},"Revogada"):null,T));if(S.completa){let D=`font-style:italic;word-break:break-word;white-space:break-spaces;max-width:500px;padding:6px 0 0;${q}`;R.append(f("p",{class:"searchLegis_ementa",style:D},`${S.curta} `,S.longa?f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",...oe(Q=>y(Q.currentTarget))},"mais"):null),f("p",{class:"searchLegis_ementafull",style:`display:none;${D}`},`${S.completa} `,f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",...oe(Q=>y(Q.currentTarget))},"menos")))}return R}let b=k=>f("p",{style:"margin:10px;text-align:center;background:#fdfbe4;color:#333;padding:5px;border-radius:5px;"},k);function s(k,C,S,q){n=C;let M=k.querySelector("#searchLegis_result");if(!M)return;let T=[];q&&T.push(b(q)),T.push(...C.map((D,Q)=>m(D,Q))),S>C.length?T.push(b(`Mostrando ${C.length} de ${S} resultados. Restrinja sua pesquisa.`)):C.length||T.push(b("Nenhum resultado encontrado :(")),M.replaceChildren(...T),M.style.display="";let R=k.querySelector("#searchLegis_load");R&&(R.style.display="none")}function g(k){let C=k.querySelector("#searchLegis_load");C&&(C.style.display="none"),t(jo)}let u=(k,C)=>k.querySelector(`#${C}`)?.value??"",h=(k,C)=>{let S=k.querySelector("#searchLegis_load");S&&(S.style.display=C?"":"none")};function x(k){let C=k?.closest(".dialogBoxDiv")??e.doc.querySelector(".dialogBoxDiv");if(!C)return;let S=u(C,"legis_anoNorma").trim();h(C,!0);let q=C.querySelector("#searchLegis_result");q&&(q.style.display="none"),c+=1;let M=c;$e(r,fe,{q:u(C,"legis_termoNorma").trim(),tipo:u(C,"legis_tipoNorma"),numero:Oe(u(C,"legis_numeroNorma")),ano:S,periodo:S?Qe(u(C,"legis_periodoNorma")):""}).then(T=>M===c&&s(C,T.normas,T.total),()=>M===c&&g(C))}function v(k,C,S,q,M,T){h(k,!0),c+=1;let R=c;$e(r,fe,{tipo:C,numero:S,ano:q,periodo:q?Qe(M):""}).then(({normas:D,total:Q})=>{R===c&&(h(k,!1),D.length===1&&Q<=1?(l?.(),d(D[0],T)):D.length?s(k,D,Q||D.length,`H\xE1 ${Q||D.length} normas com esse n\xFAmero. Escolha abaixo ou informe o ano.`):t(Bo))},()=>R===c&&g(k))}function A(k){let C=n[Number.parseInt(k?.getAttribute("data-legis-idx")??"",10)];if(!C)return;let S=p??void 0;l?.(),d(C,S)}function y(k){let C=k?.closest(".searchLegis_linha"),S=C?.querySelector(".searchLegis_ementa"),q=C?.querySelector(".searchLegis_ementafull");if(!S||!q)return;let M=S.style.display==="none";S.style.display=M?"":"none",q.style.display=M?"none":""}function E(k,C,S){return f("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},f("span",{},k),f("select",{id:C,style:"width:100%;"},...S.map(([q,M])=>f("option",{value:M},q))))}function w(k,C,S="text"){return f("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},f("span",{},k),f("input",{type:S,id:C,style:"width:100%;"}))}function _(k){let C=k??o.getInstance();if(!C)return;n=[];let S=[["federal","Legisla\xE7\xE3o Federal"],["infra","Norma Infralegal"],["lista","Lista de Normas"]],q=new Map,M=new Map,T=I=>{for(let[z]of S)q.get(z)?.setAttribute("aria-selected",String(z===I)),q.get(z)?.setAttribute("tabindex",z===I?"0":"-1"),z===I?M.get(z)?.removeAttribute("hidden"):M.get(z)?.setAttribute("hidden","")},R=f("span",{id:"searchLegis_load",style:"margin-left:10px;display:none;"},"Pesquisando..."),D={federal:f("div",{},E("Tipo de Legisla\xE7\xE3o","legis_tipoNorma",Er),w("N\xFAmero da Legisla\xE7\xE3o","legis_numeroNorma","number"),E("Per\xEDodo da Publica\xE7\xE3o","legis_periodoNorma",kr),w("Ano da Publica\xE7\xE3o","legis_anoNorma","number"),w("Conte\xFAdo da Legisla\xE7\xE3o (palavras-chave)","legis_termoNorma"),f("div",{style:"text-align:right;margin-top:6px;"},f("button",{type:"button",id:"searchLegis_uiElement",class:"spro-botao",title:"Pesquisar",onclick:I=>x(I.currentTarget)},"Pesquisar"),R),f("div",{id:"searchLegis_result",style:"display:none;max-height:250px;overflow-y:auto;margin-top:15px;"})),infra:f("div",{},E("Autoridade Signat\xE1ria","legis_orgaoInfraNorma",Cr),E("Tipo de Legisla\xE7\xE3o","legis_tipoInfraNorma",Ar),w("N\xFAmero da Norma","legis_numeroInfraNorma","number")),lista:f("div",{},E("Nome da Legisla\xE7\xE3o","legis_nomeNorma",Sr))},Q=f("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});S.forEach(([I,z],Y)=>{let G=f("button",{type:"button",role:"tab",id:`legisTab_${I}`,"aria-controls":`legisPainel_${I}`,"aria-selected":"false",class:"spro-botao",onclick:()=>T(I),onkeydown:de=>{let he=de.key==="ArrowRight"?1:de.key==="ArrowLeft"?-1:0,Te=S[(Y+he+S.length)%S.length]?.[0];!he||!Te||(T(Te),q.get(Te)?.focus())}},z);q.set(I,G),Q.append(G),M.set(I,f("div",{role:"tabpanel",id:`legisPainel_${I}`,"aria-labelledby":`legisTab_${I}`,hidden:""},D[I]))});let O=f("div",{class:"dialogBoxDiv",style:"min-width:480px;font-size:13px;"},Q,...M.values(),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let I=u(O,"legis_tipoNorma"),z=Oe(u(O,"legis_numeroNorma")),Y=u(O,"legis_tipoInfraNorma"),G=u(O,"legis_numeroInfraNorma"),de=u(O,"legis_nomeNorma");if(I!==""&&z!=="")return v(O,I,z,u(O,"legis_anoNorma").trim(),u(O,"legis_periodoNorma"),C);if(Y!==""&&G!==""){let he=(G.includes("/")?G.split("/")[0]??"":G).replace(/[^0-9-]+/g,"");i(u(O,"legis_orgaoInfraNorma")+Y+he,C)}else if(de!=="")i(de,C);else return t("Informe o tipo e o n\xFAmero da norma, ou escolha uma norma da lista.");l?.()}},"Inserir")));p=C;let we=H(e.doc,{titulo:"Adicionar Link de Legisla\xE7\xE3o",conteudo:O,aoFechar:()=>{c+=1,p=null}});l=()=>we.fechar(),T("federal");let V=o.getSelectedText(C)||"",ce=zo(V),re=O.querySelector("#legis_tipoNorma");if(ce&&re&&(re.value=ce),/\d/.test(V)){let I=V.includes("/")?V.split("/")[0]??"":V;I=V.includes(",")?V.split(",")[0]??"":I;let z=O.querySelector("#legis_numeroNorma");z&&(z.value=/\d/.test(I)?I.replace(/\D/g,""):"");let Y=/(?:\/|\bde\s+)(\d{4})\b/.exec(V),G=O.querySelector("#legis_anoNorma");Y&&G&&(G.value=Y[1]??"")}try{let I=e.win;e.verifyOpcao("substituiselecao")&&typeof I.setChosenInCke=="function"&&I.setChosenInCke()}catch{}}return{resolverNormasLegisPro:a,sendLegisSEI:i,insertLegisSEI:A,getLegisSEI(k){let C=o.getInstance(k);C&&_(C)},getSearchLegisMore:y,getSearchLegis:x,getDialogLegisSEI:()=>{}}}};function ze(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===o.ownerDocument)??t.getInstance()}function je(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function ae(e,o,t,r){let n=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return n&&e.adaptador.recusarEscrita(),n}function Vo(e,o){return o.isConnected?!0:(L(e.doc,"O link n\xE3o est\xE1 mais no documento."),!1)}function Uo(e,o){if(!Vo(e,o))return!1;let t=ze(e,o);if(!t)return!1;if(e.adaptador.versao===5){let r=t,n=je(r,o);return n?ae(e,t,o,n)?!1:(r.model.change(l=>l.setSelection(n)),r.execute("unlink"),!0):(L(e.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return ae(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Go(e,o,t,r){if(!Vo(e,o))return!1;let n=ze(e,o);if(!n)return!1;if(e.adaptador.versao===5){let l=n,c=je(l,o);return c?ae(e,n,o,c)?!1:(l.model.change(p=>{p.setSelection(c),l.model.insertContent(p.createText(t,{linkHref:r}))}),!0):(L(e.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return ae(e,n,o,null)?!1:(e.adaptador.withEdit(n,()=>{o.setAttribute("href",r),o.setAttribute("data-cke-saved-href",r),o.textContent=t}),!0)}function Tr(e,o){let t=[],r=c=>{for(let p of Array.from(c.childNodes))p.nodeType===3?t.push(p):r(p)};r(e);let[n,...l]=t;if(!n){e.textContent=o;return}n.textContent=o;for(let c of l)c.parentNode?.removeChild(c)}function Be(e,o){let t=0,r=[];for(let{a:l,texto:c}of o){let p=ze(e,l);if(p)if(e.adaptador.versao===5){let a=je(p,l);if(!a||ae(e,p,l,a))continue;r.push({a:l,texto:c,intervalo:a,ed:p})}else{if(ae(e,p,l,null))continue;Tr(l,c),t+=1}}let n=r[0]?.ed;return n&&n.model.change(l=>{for(let{a:c,texto:p,intervalo:a}of[...r].reverse()){let d={},i=[...a.getItems?.()??[]].find(m=>typeof m.getAttributes=="function");if(i)for(let[m,b]of i.getAttributes())d[m]=b;d.linkHref=c.getAttribute("href")??"",l.remove(a),l.insertText(p,d,a.start),t+=1}}),t}var _r="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Jo=new WeakMap,Mr=e=>{let o=Jo.get(e);if(o)return o;let t={balao:null};return Jo.set(e,t),t},Lr=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function Ko(e){let o=Mr(e),t=s=>L(e.doc,s);function r(s){let g=o.balao;if(g){if(!s){let u=!1;try{u=g.el.matches(":hover")}catch{u=!1}if(u)return}g.el.remove(),o.balao=null}}function n(){if(o.balao)return o.balao.link;let s=e.adaptador.getInstance();return(s?e.adaptador.getSelectionElement(s):null)?.closest("a[href]")??null}async function l(s){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(s),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function c(s,g){r(!0);let u=s?.closest?.("a[href]"),h=u?.getAttribute("href")??"";if(!u||!B(h))return;let x=f("a",{href:h,target:"_blank",rel:"noopener noreferrer",title:u.textContent??"",style:"color:inherit;text-decoration:underline;"},f("strong",{},Lr(h))),v=(E,w,_)=>f("button",{type:"button",class:E,title:w,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:_},w),A=f("div",{class:"linkDisplayPro",style:_r},x,v("spro-copiar","Copiar",()=>void l(h)),v("spro-editar","Editar",()=>i()),v("spro-remover","Remover",()=>p()));e.doc.body.append(A),o.balao={el:A,link:u};let y=u.getBoundingClientRect?.();if(y){let E=u.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),w=A.getBoundingClientRect?.().width??0,_=Math.max(8,Math.min(y.left+(E?.left??0),(e.win.innerWidth||0)-w-8));A.style.left=`${_}px`,A.style.top=`${y.bottom+(E?.top??0)+4}px`}}function p(s,g){let u=n();u&&(Uo(e,u),r(!0))}function a(s,g){let u=n()?.getAttribute("href");u&&B(u)&&e.win.open(u,"_blank","noopener,noreferrer")}function d(s,g){let u=n()?.getAttribute("href");u&&l(u)}function i(){let s=n();if(!s)return;let g=f("input",{type:"text",id:"linkProNome"}),u=f("input",{type:"text",id:"linkProUrl"});g.value=s.textContent??"",u.value=s.getAttribute("href")??"";let h=H(e.doc,{titulo:"Editar link",conteudo:W(j("Texto vis\xEDvel:",g),j("URL:",u),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let x=u.value.trim(),v=g.value.trim()||x;if(x==="")return t("Digite um link");if(Ne.test(x))return t("O link informado \xE9 inv\xE1lido.");Go(e,s,v,x)&&(r(!0),h.fechar())}},"Salvar")))})}function m(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",s=>{let g=s.target;if(!g||o.balao?.el.contains(g))return;let u=g.closest?.("a[href]");u&&g.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?c(u):r(!1)},!0)}return{globais:{showLinkTips:c,hideLinkTips:s=>r(!1),openLinkPro:a,removeLinkPro:p,copyLinkPro:d,editLinkPro:s=>i(),openDialogLinkPro:i,getDialogLinkPro:()=>{}},iniciar:m}}var Wo={id:"link-pro",globais:e=>Ko(e).globais,iniciar:e=>Ko(e).iniciar()};var qr=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function Xo(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,r,n]=[Number(o[1]),Number(o[2]),Number(o[3])],l=new Date(t,r-1,n);return l.getFullYear()!==t||l.getMonth()!==r-1||l.getDate()!==n?"":`${n} de ${qr[r-1]} de ${t}`}function Fe(e){let o=h=>P(h),t=h=>h!=="",r=t(e.nome)?`, ${o(ee(e.nome.trim()))}`:"",n=o(e.sobrenome.toUpperCase()),l=t(e.titulo)?`. <strong>${o(ee(e.titulo.trim()))}</strong>`:"",c=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",p=t(e.local)?`, ${o(ee(e.local.trim()))}`:"",a=t(e.editora)?`: ${o(ee(e.editora.trim()))}`:"",d=t(e.ano)?`, ${o(e.ano)}`:"",i=t(e.volume)?`, v. ${o(e.volume)}`:"",m=t(e.paginas)?`. p.${o(e.paginas)}`:"",b=t(e.link)&&B(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",s=Xo(e.data),g=s?`. Acesso em: ${s}`:"",u=n+r+l+c+p+a+d+i+m+b+g;return u===""?"":`${u}.`}function X(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function ie(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Ue="ntRodape_item",te="ntRodape_footer",Zo=".ntRodape_item, .ntRodape, .ntRodape_tr",et='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function ot(e,o){let t=P(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function tt(e){let o=P(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function rt(e,o=new Set){let t=new Map,r=0;for(let c of e)c.tipo==="item"&&(r+=1,t.set(c.ref,r));let n=[],l=[];for(let c of e){if(c.tipo!=="footer")continue;let p=t.get(c.ref);p!==void 0?n.push({ref:c.ref,chave:p}):o.has(c.ref)?n.push({ref:c.ref,chave:Number.isFinite(c.numero)?c.numero:Number.MAX_SAFE_INTEGER}):l.push(c.ref)}return n.sort((c,p)=>c.chave-p.chave),{numeroDe:t,ordem:n.map(c=>c.ref),orfaos:l}}var Ve=e=>e.getAttribute("data-ntrodape-ref")??"";function nt(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${Ue}[data-ntrodape-ref]`)),r=Array.from(e.querySelectorAll("p.ntRodape")).filter(p=>p.querySelector(`.${te}[data-ntrodape-ref]`)),n=p=>Number.parseInt(p.querySelector(`.${te}`)?.getAttribute("data-ntrodape")??"",10),l=rt([...t.map(p=>({tipo:"item",ref:Ve(p)})),...r.map(p=>({tipo:"footer",ref:Ve(p.querySelector(`.${te}`)),numero:n(p)}))],o);t.forEach((p,a)=>{p.setAttribute("data-ntrodape",String(a+1)),p.textContent=`[${a+1}]`});let c=new Map;for(let p of r){let a=Ve(p.querySelector(`.${te}`)),d=l.numeroDe.get(a),i=p.querySelector(`.${te}`);d!==void 0&&(i.setAttribute("data-ntrodape",String(d)),i.textContent=`[${d}]`),p.remove(),c.set(a,p)}for(let p of l.ordem){let a=c.get(p);a&&e.append(a)}if(!l.ordem.length)for(let p of e.querySelectorAll(".ntRodape_tr"))p.remove();return l}function at(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${Ue}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var Yo=e=>e.getAttribute?.("htmlSpan")?.classes??[],Pr=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function it(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of e.createRangeIn(o).getItems())if(r.is("$textProxy")||r.is("$text")){let n=Yo(r);n.includes(Ue)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):n.includes(te)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===o){let n=Pr(r);if(n.includes("ntRodape_tr"))t.separadores.push(r);else if(n.includes("ntRodape")){let c=Array.from(e.createRangeIn(r).getItems()).find(p=>(p.is("$textProxy")||p.is("$text"))&&Yo(p).includes(te))?.getAttribute("htmlSpan")?.attributes??{};c["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:c["data-ntrodape-ref"],numero:Number.parseInt(c["data-ntrodape"],10)})}}return t}function Rr(e,o,t){let r=o.getAttribute("htmlSpan")??{},n=`[${t}]`;if(o.data===n&&r.attributes?.["data-ntrodape"]===String(t))return;let l=Object.fromEntries(o.getAttributes());l.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let c=e.createRangeOn(o),p=c.start;e.remove(c),e.insertText(n,l,p)}function st(e,o,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(n=>{let l=it(n,o),c=d=>d.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=rt([...l.itens.map(d=>({tipo:"item",ref:c(d)})),...l.rodapes.map(d=>({tipo:"footer",ref:d.ref,numero:d.numero}))],t);let p=[],a=0;for(let d of l.textos)if(d.tipo==="item")a+=1,p.push({no:d.no,n:a});else{let i=r.numeroDe.get(c(d.no));i!==void 0&&p.push({no:d.no,n:i})}for(let d of[...p].reverse())Rr(n,d.no,d.n);for(let d of r.orfaos){let i=l.rodapes.find(m=>m.ref===d);i&&n.remove(n.createRangeOn(i.bloco))}for(let d of r.ordem){let i=l.rodapes.find(m=>m.ref===d);i&&n.move(n.createRangeOn(i.bloco),n.createPositionAt(o,"end"))}if(!r.ordem.length)for(let d of l.separadores)n.remove(n.createRangeOn(d))}),r}function lt(e,o){e.model.change(t=>{let r=it(t,o),n=[...r.itens,...r.rodapes.map(l=>l.bloco),...r.separadores];for(let l of[...n].reverse())t.remove(t.createRangeOn(l))})}function ge(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=e.editing.view.document.getRoot(t.rootName);if(r&&e.editing.view.domConverter.mapViewToDom(r)===o)return t}catch{}return null}function ct(e,o,t){let r=new Set;for(let n of Array.from(e.model.document.roots??[]))if(!(!n||n===o||n.rootName==="$graveyard"))for(let l of t(e.data.get({rootName:n.rootName})))r.add(l);return r}var Ir='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',dt=new WeakSet,ut=new WeakSet,Ge=e=>e.replace(/["\\]/g,"\\$&");function Dr(e,o){let t=e.querySelector(`[name="${Ge(o)}"], [id="${Ge(o)}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(o);return r?e.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${Ge(r[2]??"")}"]`):null}function J(e){if(e.adaptador.versao!==5)for(let t of e.adaptador.getAllInstances())ut.has(t)||(ut.add(t),e.adaptador.on(t,"contentDom",()=>J(e)));let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||dt.has(t)||(dt.add(t),t.addEventListener("click",r=>{let n=r.target?.closest?.(Ir);if(!n)return;let l=Dr(t,(n.getAttribute("href")??"").slice(1));(l?.closest("p")??l)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var Nr=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],pt={id:"nota-rodape",globais(e){let o=e.adaptador,t=u=>L(e.doc,u),r=u=>o.getBodyContainer(u),n=u=>o.findInBody(u,Zo).length>0;function l(u,h){let x=o.versao===5?ie(e,h):o.somenteLeitura(u);return x&&o.recusarEscrita(),x}function c(u){let h=e.doc.createElement("div");return h.append(...Z(e.doc,u)),Array.from(h.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(x=>x.getAttribute("data-ntrodape-ref")??"")}function p(u){if(o.versao===5){let h=ge(u,r(u));h&&st(u,h,ct(u,h,c))}else{let h=r(u);h&&nt(h)}}function a(u){let x=typeof u=="object"&&u!==null&&("model"in u||o.getAllInstances().includes(u))?u:o.getInstance();if(!x)return!1;let v=o.versao===5?ge(x,r(x)):null;return o.versao===5&&!v?(t("N\xE3o foi poss\xEDvel localizar o corpo do documento para atualizar as notas."),!1):l(x,v)?!1:(o.withEdit(x,()=>p(x)),!0)}function d(u){let h=u??o.getInstance();if(h){if(!n(h)){t("O documento n\xE3o tem notas de rodap\xE9.");return}a(h)&&(J(e),t("Notas de rodap\xE9 atualizadas com sucesso"))}}function i(u,h){let x=h??o.getInstance();if(!x)return;if(!n(x)){t("O documento n\xE3o tem notas de rodap\xE9.");return}let v=o.versao===5?ge(x,r(x)):null;if(o.versao===5&&!v){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para remover as notas.");return}l(x,v)||(o.withEdit(x,()=>{if(o.versao===5)lt(x,v);else{let A=r(x);A&&at(A)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function m(u,h){let x=h??o.getInstance();if(!x||u.trim()==="")return;let v=o.versao===5?ge(x,r(x)):null;if(o.versao===5&&!v){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para inserir a nota.");return}if(l(x,v))return;let A=K(16);o.withEdit(x,()=>{if(o.versao===5){let y=x;y.model.document.selection.getFirstPosition()?.root!==v&&y.model.change(E=>E.setSelection(v,"end"))}o.findInBody(x,".ntRodape_tr").length||o.appendToBody(x,et),o.appendToBody(x,ot(A,u)),o.insertHtml(x,tt(A)),p(x)}),J(e)}function b(u){let h=x=>(u.querySelector(`#${x}`)?.value??"").toString();return Object.fromEntries(Nr.map(([x,v])=>[x,h(v)]))}function s(u){let h=u??e.doc,x=h.querySelector("#nrABNTResult");x&&x.replaceChildren(...Z(e.doc,Fe(b(h))))}function g(u){let h=u??o.getInstance();if(!h)return;let x=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],v=new Map,A=new Map,y=null,E=T=>{for(let[R]of x){let D=R===T;A.get(R)?.setAttribute("aria-selected",String(D)),A.get(R)?.setAttribute("tabindex",D?"0":"-1"),D?v.get(R)?.removeAttribute("hidden"):v.get(R)?.setAttribute("hidden","")}y&&(T==="livre"||T==="abnt"?y.removeAttribute("hidden"):y.setAttribute("hidden",""))},w=f("textarea",{id:"textNotaRodape",rows:"3",style:"width:100%;"}),_=(T,R,D="text")=>f("label",{style:"display:grid;gap:2px;font-size:12px;color:#555;"},f("span",{},T),f("input",{type:D,id:R,style:"width:100%"})),k=f("div",{id:"nrABNTResult",style:"margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"}),C=f("div",{style:"display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;"},_("Nome do autor","nr_Nome"),_("Sobrenome do autor","nr_Sobrenome"),f("div",{style:"grid-column:1 / span 2;"},_("T\xEDtulo da publica\xE7\xE3o","nr_Titulo")),_("N\xFAmero da edi\xE7\xE3o","nr_Edicao","number"),_("Ano da publica\xE7\xE3o","nr_Ano","number"),_("Local (cidade)","nr_Local"),_("Nome da editora","nr_Editora"),_("N\xFAmero do volume","nr_Volume","number"),_("P\xE1ginas inicial-final","nr_Paginas"),_("Link da publica\xE7\xE3o","nr_Link"),_("Data do acesso","nr_Data","date"),f("div",{style:"grid-column:1 / span 2;"},k)),S={livre:f("div",{},f("label",{for:"textNotaRodape",style:"font-size:12px;color:#555;"},"Texto da nota de rodap\xE9:"),w),abnt:C,atualizar:f("div",{style:"padding:10px 0;display:grid;gap:10px;"},f("p",{},"Atualiza numera\xE7\xF5es e ordem das notas de rodap\xE9 j\xE1 existentes no documento."),f("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>d(h)},"Atualizar")),remover:f("div",{style:"padding:10px 0;display:grid;gap:10px;"},f("p",{},"Remove todas as notas de rodap\xE9 do documento (Ctrl+Z desfaz)."),f("button",{type:"button",id:"btnNrRemove",class:"spro-botao",onclick:()=>{i(null,h),M.fechar()}},"Remover todas"))},q=f("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});x.forEach(([T,R],D)=>{let Q=f("button",{type:"button",role:"tab",id:`ntTab_${T}`,"aria-controls":`ntPainel_${T}`,"aria-selected":"false",class:"spro-botao",onclick:()=>E(T),onkeydown:we=>{let V=we,ce=V.key==="ArrowRight"?1:V.key==="ArrowLeft"?-1:0,re=x[(D+ce+x.length)%x.length]?.[0];!ce||!re||(E(re),A.get(re)?.focus())}},R);A.set(T,Q),q.append(Q);let O=f("div",{role:"tabpanel",id:`ntPainel_${T}`,"aria-labelledby":`ntTab_${T}`,hidden:""},S[T]);v.set(T,O)}),y=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let T=(k.textContent??"").trim()?Fe(b(C)):"",R=w.value.trim(),D=T||P(R).replace(/\r?\n/g,"<br>");if(!D){t("Digite o texto da nota de rodap\xE9.");return}m(D,h),M.fechar()}},"Inserir");for(let T of C.querySelectorAll("input"))T.addEventListener("input",()=>s(C)),T.addEventListener("change",()=>s(C));let M=H(e.doc,{titulo:"Inserir nota de rodap\xE9",conteudo:f("div",{style:"min-width:480px;font-size:13px;"},q,...v.values(),f("div",{class:"spro-dialogo-rodape"},y))});E("livre")}return{getNotaRodape(u){let h=o.getInstance(u);h&&g(h)},getDialogNotaRodape:()=>{},openDialogNotaRodape:g,removeNtRodape:i,updateNrABNT:s,insertNtRodape:m,updateNtRodape:d,reorderNtRodape:a}},iniciar(e){J(e)}};function ke(e,o,t,r){let n=e.adaptador.getInstance(o);if(!n)return;let l=e.adaptador.getSelectionParagraph(n);if(l){if(e.adaptador.somenteLeitura(n)){e.adaptador.recusarEscrita();return}e.adaptador.withEdit(n,()=>{e.adaptador.insertHtmlBefore(n,l,t),r?.(n,l)})}}var $r='<div class="pageBreakPro" style="page-break-after: always"></div>',mt={id:"page-break",globais:e=>({getPageBreak:o=>ke(e,o,$r)})};function ft(e,o,t){let r=e.jQuery,n=r?.(o).qrcode;if(!r||typeof n!="function")return null;o.replaceChildren();try{r(o).qrcode?.(t)}catch{return o.replaceChildren(),null}return o.querySelector("img, canvas")}var be={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},Hr=[["QrPro-size","px"],["QrPro-minversion",""],["QrPro-quiet"," m\xF3dulos"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],Qr=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],Or=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],zr=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],gt={id:"qr-code",globais(e){let o=e.adaptador,t=y=>L(e.doc,y),r=y=>e.doc.querySelector(y),n=y=>r(`#${y}`)?.value??"",l=()=>e.win.NAMESPACE_SPRO??"SEI Pro",c=()=>`${e.base}icons/menu/seipro.png`,p=(y,E,w)=>f("div",{style:"display:grid;gap:2px;"},f("label",{for:E},y),w),a=(y,E,w,_)=>f("input",{id:y,type:"range",value:be[y]??"",min:String(E),max:String(w),step:String(_)});function d(){let y=f("div",{id:"optionsQrAdvanced",style:"display:none;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;font-size:12px;"},p("Tamanho do QR: 140px","QrPro-size",a("QrPro-size",100,500,50)),p("Cor de Preenchimento","QrPro-fill",f("input",{id:"QrPro-fill",type:"color",value:be["QrPro-fill"]??""})),p("Cor de Fundo","QrPro-background",f("div",{},f("input",{id:"QrPro-background",type:"color",value:be["QrPro-background"]??""}),f("label",{style:"margin-left:12px;"},f("input",{id:"QrPro-background-transparent",type:"checkbox"})," Transparente"))),p("Vers\xE3o: 6","QrPro-minversion",a("QrPro-minversion",1,10,1)),p("N\xEDvel de corre\xE7\xE3o de erros","QrPro-eclevel",f("select",{id:"QrPro-eclevel"},...zr.map(([E,w])=>f("option",{value:E},w)))),p("Margens de folga: 1 m\xF3dulos","QrPro-quiet",a("QrPro-quiet",0,4,1)),p("Raio de canto: 50%","QrPro-radius",a("QrPro-radius",0,50,10)),p("Modo","QrPro-mode",f("select",{id:"QrPro-mode"},...Or.map(([E,w])=>f("option",{value:E},w)))),f("div"),f("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Tamanho da etiqueta: 20%","QrPro-msize",a("QrPro-msize",0,40,1)),p("Posi\xE7\xE3o X: 50%","QrPro-mposx",a("QrPro-mposx",0,100,1)),p("Posi\xE7\xE3o Y: 50%","QrPro-mposy",a("QrPro-mposy",0,100,1)))),f("div",{class:"QrMode-etiqueta",style:"display:none;grid-column:1 / span 3;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Nome da fonte","QrPro-font",f("select",{id:"QrPro-font"},...Qr.map(E=>f("option",{value:E},E)))),p("Cor da fonte","QrPro-fontcolor",f("input",{id:"QrPro-fontcolor",type:"color",value:be["QrPro-fontcolor"]??""})),p("Etiqueta","QrPro-label",f("input",{id:"QrPro-label",type:"text",value:l()})))),f("div",{class:"QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},p("Imagem","QrPro-image",f("input",{id:"QrPro-image",type:"file",accept:"image/*"})),f("img",{id:"QrPro-img-buffer",style:"display:none",src:c(),alt:""}))),f("a",{id:"QrPro-reset",class:"linkDialog",role:"button",tabindex:"0",style:"margin-top:14px;display:block;cursor:pointer;",...oe(()=>m())},"Resetar configura\xE7\xF5es"));return f("div",{id:"qrCodeLab"},f("div",{style:"text-align:right;"},f("a",{id:"toggleOptionsQR",class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",...oe(()=>i())},"Op\xE7\xF5es avan\xE7adas ")),f("div",{style:"display:grid;gap:10px;"},y,f("div",{id:"qrCodeResult",style:"text-align:center;margin:10px 0;min-width:180px;"})))}function i(){let y=r("#optionsQrAdvanced");y&&(y.style.display=y.style.display==="none"?"":"none")}function m(){for(let[w,_]of Object.entries(be)){let k=r(`#${w}`);k&&(k.value=_)}let y=r("#QrPro-label");y&&(y.value=l());let E=r("#QrPro-background-transparent");E&&(E.checked=!1,E.removeAttribute("checked")),r("#QrPro-img-buffer")?.setAttribute("src",c()),x()}function b(y){r("#tipQrCodeUrl")?.remove();let E=r("#toggleOptionsQR");if(y===""||!B(y)||y.length<=50||!E)return;let w=r(".getTinyUrlButtom span")?.getAttribute("style")??"",_=f("span",{id:"tipQrCodeUrl",style:"display:block;margin-bottom:8px;padding:5px 8px 8px 8px;background:#f9f9dc;color:#333;border-radius:5px;"},"Dica: Experimente ",f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",...oe(()=>g())},f("span",{style:`width:16px;height:16px;display:inline-block;${w}`}),"Gerar link curto do TinyURL"));(E.parentElement??E).before(_)}function s(y){let E=r("#qrCodeText");E&&(E.value=y),x()}function g(){let y=n("qrCodeText").trim(),E=e.win.ajaxTinyUrl;if(typeof E!="function"){t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");return}Promise.resolve(E(y,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function u(){for(let[y,E]of Hr){let w=r(`label[for="${y}"]`);w&&(w.textContent=(w.textContent??"").replace(/:.*/,`: ${n(y)}${E}`))}}function h(y){let E=w=>Number.parseInt(n(w),10);return{render:"image",ecLevel:n("QrPro-eclevel"),minVersion:E("QrPro-minversion"),fill:n("QrPro-fill"),background:r("#QrPro-background-transparent:checked")?null:n("QrPro-background"),text:y,size:E("QrPro-size"),radius:E("QrPro-radius")*.01,quiet:E("QrPro-quiet"),mode:E("QrPro-mode"),mSize:E("QrPro-msize")*.01,mPosX:E("QrPro-mposx")*.01,mPosY:E("QrPro-mposy")*.01,label:n("QrPro-label"),fontname:n("QrPro-font"),fontcolor:n("QrPro-fontcolor"),image:r("#QrPro-img-buffer")}}function x(){let y=r("#qrCodeResult");if(!y)return;y.replaceChildren();for(let _ of e.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))_.style.display="none";u();let E=n("QrPro-mode");if(E==="1"||E==="2")for(let _ of e.doc.querySelectorAll(".QrMode-etiqueta"))_.style.display="";else if(E==="3"||E==="4")for(let _ of e.doc.querySelectorAll(".QrMode-imagem"))_.style.display="";let w=n("qrCodeText");w!==""&&!ft(e.win,y,h(w))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),b(w)}function v(y,E){let w=E??o.getInstance();if(!w)return!1;let _=r("#qrCodeResult img")?.getAttribute("src")??"";return/^data:image\/(png|jpeg|gif|webp);base64,/i.test(_)?o.somenteLeitura(w)?(o.recusarEscrita(),!1):(o.withEdit(w,()=>o.insertHtml(w,`<img src="${P(_)}" alt="${P(y)}">`)),!0):(t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),!1)}function A(y){let E=y??o.getInstance();if(!E)return;let w=f("input",{type:"text",id:"qrCodeText",style:"width:100%;box-sizing:border-box;margin:6px 0 10px 0;"}),_=(o.getSelectedText(E)||String(e.win.getSelection?.()??"")).trim();_&&(w.value=_),w.addEventListener("input",()=>x()),w.addEventListener("change",()=>x());let k=d();for(let S of["input","change"])k.querySelector("#optionsQrAdvanced")?.addEventListener(S,()=>x());k.querySelector("#QrPro-image")?.addEventListener("change",S=>{let q=S.target.files?.[0];if(!q)return;let M=new FileReader;M.onload=()=>{let T=String(M.result??"");if(!/^data:image\//i.test(T)){t("Escolha um arquivo de imagem.");return}r("#QrPro-img-buffer")?.setAttribute("src",T);let R=r("#QrPro-mode");R&&(R.value="4"),setTimeout(x,200)},M.readAsDataURL(q)});let C=H(e.doc,{titulo:"Gerar C\xF3digo QR",conteudo:f("div",{style:"min-width:560px;max-width:100%;font-size:13px;"},f("label",{for:"qrCodeText"},"Insira o texto que deseja codificar:"),w,k,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let S=w.value.trim();if(!S){t("Digite o texto a codificar");return}v(S,E)&&C.fechar()}},"Inserir")))});_&&x()}return{getQrCode(y){let E=o.getInstance(y);E&&A(E)},getDialogQrCode:()=>{},openDialogQrCode:A,buildHtmlQrCodeLab:d,resetOptionsQR:m,toggleOptionsQR:i,tipQrCodeUrl:b,setInputTinyUrl:s,convertTinyURL:g,updateQrCode:x,setQrCode:v}}};var bt=5,ht=5,xt=49,F=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function jr(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let n=e?.previousElementSibling??null;n;n=n.previousElementSibling)if(n.classList.contains("divQuickTable"))return n;return o.querySelector(".divQuickTable")}var vt={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let i of e.doc.querySelectorAll(".divQuickTable"))i.replaceChildren(),ye(i);for(let i of e.doc.querySelectorAll(".getQuickTableButtom"))i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")}function r(i){if(!i)return;let m=F(i,"data-row"),b=F(i,"data-col"),s=i.closest("table");if(!s)return;for(let h of s.querySelectorAll("td"))h.classList.remove("td_hover");let g=()=>[...s.querySelectorAll("tr")];if(m>=3&&F(g().at(-1)?.querySelector("td"),"data-row")>m+1&&(g().at(-1)?.remove(),s.setAttribute("data-row",String(F(s,"data-row")-1))),b>=3&&F(g().at(-1)?.lastElementChild,"data-col")>b+1){for(let h of g())h.lastElementChild?.remove();s.setAttribute("data-col",String(F(s,"data-col")-1))}for(let h of s.querySelectorAll("td"))F(h,"data-row")<=m&&F(h,"data-col")<=b&&h.classList.add("td_hover");let u=i.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(u&&(u.textContent=`Tabela ${m+1}x${b+1}`),m===F(s,"data-row")&&m<xt){let h=g().at(-1)?.cloneNode(!0);h&&(h.querySelectorAll("td").forEach((x,v)=>{x.setAttribute("data-row",String(m+1)),x.setAttribute("data-col",String(v)),x.classList.remove("td_hover")}),(s.querySelector("tbody")??s).append(h),s.setAttribute("data-row",String(m+1)))}if(b===F(s,"data-col")&&b<xt){for(let h of g()){let x=h.lastElementChild?.cloneNode(!0);x&&(x.setAttribute("data-col",String(b+1)),x.classList.remove("td_hover"),h.append(x))}s.setAttribute("data-col",String(b+1))}}function n(){let i=e.doc,m=i.createDocumentFragment(),b=i.createElement("div");b.className="quickTableInfo",b.textContent="Inserir Tabela";let s=i.createElement("table");s.setAttribute("data-row",String(bt-1)),s.setAttribute("data-col",String(ht-1));for(let u=0;u<bt;u+=1){let h=i.createElement("tr");for(let x=0;x<ht;x+=1){let v=i.createElement("td");v.setAttribute("data-row",String(u)),v.setAttribute("data-col",String(x)),h.append(v)}s.append(h)}let g=u=>r(u.target?.closest("td")??null);return s.addEventListener("mouseover",g),s.addEventListener("mouseout",g),s.addEventListener("click",u=>{let h=u.target?.closest("td");h&&d(h)}),m.append(b,s),m}function l(i){if(!i)return;let m=jr(i,e.doc);i.classList.contains("cke_button_on")?(t(),i.classList.add("cke_button_off"),i.classList.remove("cke_button_on")):(m&&(m.replaceChildren(n()),ve(m)),i.classList.remove("cke_button_off"),i.classList.add("cke_button_on"))}function c(i){let m=i?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),b=m?[...m.querySelectorAll(".getTablestylesButtom")]:[];b.length||(b=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let s of b)s.classList.remove("cke_button_disabled")}function p(i,m){let b='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';b+="  <tbody>";for(let s=0;s<=i;s+=1){b+="      <tr>";for(let g=0;g<=m;g+=1)b+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';b+="      </tr>"}return`${b}  </tbody></table>`}function a(i,m){let b=m?m.nextElementSibling:o.getBodyContainer(i)?.lastElementChild,s=b?.tagName==="TABLE"?b.querySelector("td p"):null;if(!s)return;let g=s.ownerDocument,u=g.defaultView?.getSelection?.();if(!u)return;let h=g.createRange();h.setStart(s.firstChild??s,0),h.collapse(!0),u.removeAllRanges(),u.addRange(h)}function d(i){let m=o.getInstance(i);if(!m){t();return}let b=p(F(i,"data-row"),F(i,"data-col")),s=o.getSelectionParagraph(m);o.withEdit(m,()=>{if(!s)return o.insertHtml(m,b);let g=s.nextElementSibling;g?o.insertHtmlBefore(m,g,b):o.appendToBody(m,b)}),t(),c(i),a(m,s)}return{getQuickTable:l,quickTableOver:r,hideQuickTable:t,quickTableClick:d}}};function Ce(e,o,t,r,n){let l=e.adaptador;if(l.versao===5){let p=X(o,t);return p&&ie(e,p)?(l.recusarEscrita(),!1):t.id?!0:!!e.win.SeiProGhs?.setAtributos(t,{id:r},o)}if(l.somenteLeitura(o))return l.recusarEscrita(),!1;if(n)for(let p of t.querySelectorAll(`a.${n}`))p.remove();let c=t.ownerDocument.createElement("a");return c.setAttribute("name",r),n&&(c.className=n),t.prepend(c),!0}function Ae(e,o,t=!1){if(t&&e.id)return e.id;let r=e.querySelector(`a[name^="${o}"]`);return r?r.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var Br=[1,2,3,4],Je=["Paragrafo_Numerado_Nivel","Item_Nivel"];function yt(e){let o=Je.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of o)r.fill(0);return{item:""}}for(let r=0;r<Je.length;r+=1)for(let n of Br){if(t!==`${Je[r]}${n}`)continue;let l=o[r];l[n-1]=(l[n-1]??0)+1;for(let c=n;c<4;c+=1)l[c]=0;return{item:l.slice(0,n).join(".")}}return{item:""}})}var se="RefPro_",Fr="refpro",Et=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,kt={id:"ref-interna",globais(e){let o=e.adaptador,t=i=>L(e.doc,i);function r(i){let m=i??o.getInstance();if(!m)return!1;let b=o.findInBody(m,"p");if(!b.length)return!1;let s=yt(b.map(u=>({classe:(u.getAttribute("class")??"").trim()}))),g=[];return b.forEach((u,h)=>{let x=s[h]?.item;if(!x)return;let v=Ae(u,se,o.versao===5),A=v?.startsWith(se)?v.slice(se.length):v??K(16);g.push({ref:A,nome:v??`${se}${A}`,item:x,text:u.textContent??"",ancorado:!!v,el:u})}),g}function n(i,m){let b=new Set(m.filter(s=>s.ancorado&&!s.nome.startsWith(se)).map(s=>s.nome));return o.findInBody(i,'a[href^="#"]').filter(s=>(s.getAttribute("href")??"").startsWith(`#${se}`)||b.has((s.getAttribute("href")??"").slice(1))&&/^\[[^\]]*\d[^\]]*\]$/.test((s.textContent??"").trim()))}function l(i,m,b){let s=r(i),g=[];if(!s)return{mudar:g,perdidas:0};let u=n(i,s);if(!u.length)return{mudar:g,perdidas:0};let h=new Map(s.filter(v=>v.ancorado).map(v=>[v.nome,v.item])),x=0;for(let v of u){let A=h.get((v.getAttribute("href")??"").slice(1));if(A===void 0){x+=1;continue}let y=Et(m,b,A);(v.textContent??"")!==y&&g.push({a:v,texto:y})}return{mudar:g,perdidas:x}}function c(i,m,b){let{mudar:s,perdidas:g}=l(i,m,b),u=0;return s.length&&o.withEdit(i,()=>u=Be(e,s)),{atualizadas:u,perdidas:g,recusadas:s.length-u}}function p(i,m,b){let s,g,u;typeof i=="string"||i===void 0?(s=o.getInstance(),g=i??"",u=m===!0):(s=i,g=typeof m=="string"?m:"",u=b===!0),s&&c(s,g,u)}function a(i){let m=o.getInstance(i);if(!m)return;let b=r(m);if(!b||b.length===0){t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");return}let s=f("input",{type:"text",id:"prefixo",style:"width:70%"}),g=f("input",{type:"checkbox",id:"hidePrefix"}),u=f("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(10,b.length)),style:"width:100%"},...b.map(v=>{let A=v.text.trim(),y=A.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return f("option",{value:`${v.ref}-${v.item}`},`${v.item}. ${y}${y.length<A.length?"...":""}`)})),h=()=>g.matches(":checked")||s.value.trim()==="",x=H(e.doc,{titulo:"Inserir refer\xEAncia interna",conteudo:f("div",{style:"display:grid;gap:12px;min-width:420px;font-size:13px;"},f("label",{style:"display:grid;gap:4px;"},f("span",{},"Prefixo:"),s),f("label",{},g," N\xE3o utilizar prefixo"),f("label",{style:"display:grid;gap:4px;"},f("span",{},"Par\xE1grafo numerado:"),u),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:v,recusadas:A}=c(m,s.value,h());J(e),!A&&t(v?`Refer\xEAncias atualizadas. ${v} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let v=b.filter(A=>[...u.querySelectorAll("option")].some(y=>y.value===`${A.ref}-${A.item}`&&y.selected));if(!v.length){t("Selecione ao menos um par\xE1grafo numerado.");return}d(m,v,s.value,h())&&x.fechar()}},"Inserir")))})}function d(i,m,b,s){if(o.somenteLeitura(i))return o.recusarEscrita(),!1;let g=m.filter(v=>v.el.isConnected);if(!g.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let u=g.map(v=>`<a href="#${P(v.nome)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${P(Et(b,s,v.item))}</a>`),h=u.length>1?`${u.slice(0,-1).join(", ")} e ${u.at(-1)}`:u[0]??"",x=!1;return o.withEdit(i,()=>{let{mudar:v}=l(i,b,s);v.length&&Be(e,v);for(let A of g)if(!A.ancorado&&!Ce(e,i,A.el,A.nome,Fr))return;o.insertHtml(i,` ${h} `),x=!0}),J(e),x}return{getRefInterna:a,updateRefsInternas:p,getNiveisParagrafos:r,clickScroolToRef:()=>J(e)}},iniciar(e){J(e)}};var Vr='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Ur="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",Ct={id:"session-break",globais:e=>({getSessionBreak:o=>ke(e,o,Vr,(t,r)=>{if(e.adaptador.versao!==5)return;let n=t,l=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,c=X(n,r)?.previousSibling;l&&c?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":Ur},c)})})};var At=["seiSlim","seiSlim_parent","seiSlim_view"],St={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=n=>{for(let l of o())l.classList.add(n?"cke_button_on":"cke_button_off"),l.classList.remove(n?"cke_button_off":"cke_button_on")};function r(n){if(n==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...At)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...At)}return{getBoxStyleEditor(n){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),r("remove")):(t(!0),r("set"))},updateStyleEditor:r}}};var Gr="seipro-bookmark",wt="bookmark-",Jr=e=>e.replace(/^\./,""),Tt={id:"sumario",globais(e){let o=e.adaptador,t=a=>L(e.doc,a);function r(a){let d=new Set;for(let i of o.findInBody(a,"p")){let m=(i.getAttribute("class")??"").trim().split(/\s+/)[0];m&&d.add(m)}return[...d]}function n(a,d,i){let m=a.map(b=>f("option",{value:`.${b}`,...b===i?{selected:"selected"}:{}},b));return d?[f("option",{value:""},"(nenhum)"),...m]:m}function l(a,d,i){let m=e.doc.querySelector(`select#${d}`);m&&m.replaceChildren(...i.map(([b,s])=>f("option",{value:s},b)))}function c(a,d,i){let m=i??o.getInstance();if(!m)return!1;let b=new Set(d.map(Jr).filter(Boolean));if(!b.size)return!1;if(o.somenteLeitura(m))return o.recusarEscrita(),!1;let s=o.findInBody(m,"p").filter(h=>(h.textContent??"").trim()!==""&&[...h.classList].some(x=>b.has(x)));if(!s.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let g='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>',u=0;return o.withEdit(m,()=>{for(let x of s){let v=Ae(x,wt,o.versao===5)??`${wt}${K(16)}`;Ce(e,m,x,v,Gr)&&(g+=`<p class="Texto_Alinhado_Esquerda"><a href="#${P(v)}">${P((x.textContent??"").trim())}</a></p>`,u+=1)}if(!u)return;let h=o.versao===5?o.getSelectionParagraph(m):null;h?o.insertHtmlBefore(m,h,g):o.insertHtml(m,g)}),u?!0:(t("N\xE3o foi poss\xEDvel criar o sum\xE1rio: nenhum t\xEDtulo aceitou a \xE2ncora."),!1)}function p(a,d){let i=d??o.getInstance();if(!i)return;let m=r(i);if(!m.length){t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");return}let b=(x,v,A)=>f("select",{id:x},...n(m,v,A)),s=b("listStyle1",!1,"Item_Nivel1"),g=b("listStyle2",!0,"Item_Nivel2"),u=b("listStyle3",!0,"Item_Nivel3"),h=H(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:W(j("Estilo do T\xEDtulo 1 (obrigat\xF3rio):",s),j("Estilo do T\xEDtulo 2:",g),j("Estilo do T\xEDtulo 3:",u),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let x=[s.value,g.value,u.value].filter(v=>v!=="");if(!x.length){t("Escolha o estilo do T\xEDtulo 1.");return}c(null,[...new Set(x)],i)&&h.fechar()}},"Inserir")))})}return{getSumarioDocumento(a){let d=o.getInstance(a);d&&p(null,d)},getListStylesDocumento(a,d){let i=d??o.getInstance();return i?n(r(i),!1):[]},updateSelectDialog:(a,d)=>l(null,a,d),getDialogSumarioDocumento:a=>p(null,a),getDialogSumarioDocumento_:()=>p(null),insertSumarioDocumento:(a,d)=>c(null,a,d)}}};var le={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function Ke(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function Se(e){let o={};for(let t of e.split(";")){let r=t.indexOf(":");if(r<=0)continue;let n=t.slice(0,r).trim(),l=t.slice(r+1).trim();n&&l&&(o[n]=l)}return o}function Kr(e,o,t){let r=[];for(let n=0;n<o;n+=1){let l=n===0,c=l?e.trCabecalho:Array.isArray(e.tr)?n%2===0?e.tr[1]:e.tr[0]:e.tr,p=Array.from({length:t},(a,d)=>({td:l?e.tdCabecalho:d===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));r.push({tr:c,celulas:p})}return{linhas:r}}var We=e=>Array.from(e.children).filter(o=>o.tagName==="TD"||o.tagName==="TH"),Wr=e=>Array.from(e.querySelectorAll("tr")).filter(o=>o.closest("table")===e);function _t(e,o,t,r,n){let l=e.adaptador,c=Wr(t),p=Kr(r,c.length,Math.max(0,...c.map(a=>We(a).length)));if(l.versao===5){let a=o,d=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,i=X(a,t.closest("figure")??t);if(!d||!i)return L(e.doc,"N\xE3o foi poss\xEDvel aplicar o estilo: a tabela n\xE3o foi reconhecida pelo editor."),!1;if(ie(e,i))return l.recusarEscrita(),!1;let m=(b,s,g)=>{let u=Object.keys(Se(s.getAttribute("style")??""));u.length&&g&&typeof d.removeModelHtmlStyles=="function"&&d.removeModelHtmlStyles(b,u,g)};return l.withEdit(o,()=>{m("table",t,i),d.setModelHtmlStyles("table",Se(r.table),i),c.forEach((b,s)=>{let g=p.linhas[s];if(!g)return;let u=X(a,b);m("tr",b,u),u&&d.setModelHtmlStyles("tr",Se(g.tr),u),We(b).forEach((h,x)=>{let v=X(a,h);if(v){m("td",h,v),d.setModelHtmlStyles("td",Se(g.celulas[x]?.td??""),v);for(let A of v.getChildren())A.name==="paragraph"&&a.model.change(y=>y.setAttribute("estilo",g.celulas[x]?.p,A))}})}),r.cabecalho&&a.model.change(b=>b.setAttribute("headingRows",1,i))}),!0}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let a=t.ownerDocument;if(t.setAttribute("style",r.table),c.forEach((d,i)=>{let m=p.linhas[i];m&&(d.setAttribute("style",m.tr),We(d).forEach((b,s)=>{b.setAttribute("style",m.celulas[s]?.td??"");let g=m.celulas[s]?.p??"",u=Array.from(b.querySelectorAll("p")).filter(h=>h.closest("td, th")===b);if(u.length)for(let h of u)h.setAttribute("class",g);else{let h=a.createElement("p");h.setAttribute("class",g),h.append(...Array.from(b.childNodes)),b.append(h)}}))}),r.cabecalho&&c[0]&&!t.querySelector("thead")){let d=a.createElement("thead");d.append(c[0]),t.prepend(d)}n?.aoFinalCk4?.(t)}),!0)}var Mt="color1",Xr="Clique na tabela que deseja aplicar o estilo!",Xe="dark-mode-color-";function Yr(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function Zr(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${Xe}black`,`${Xe}white`),o.classList.add(`${Xe}${Yr(t)>125?"black":"white"}`))}}var Lt={id:"table-styles",globais(e){let o=e.adaptador,t=a=>o.getSelectionElement(a)?.closest("table")??null;function r(a,d){let i=a.querySelector("#addEstiloTabela");i&&d&&/^color\d+$/.test(d)&&(i.className=d)}function n(a,d,i,m=!0,b){let s=i??o.getInstance();if(!s||!d)return;let[g,u,h]=d,x=le[u],v=Number(h),A=x&&Number.isFinite(v)?Ke(x,v)[g]:void 0,y=b?.isConnected?b:b?null:t(s);if(A){if(!y){L(e.doc,"A tabela n\xE3o est\xE1 mais no documento.");return}_t(e,s,y,{...A,cabecalho:m},{aoFinalCk4:Zr})}}function l(){let a=Object.keys(le),d=Object.keys(Ke(le[Mt])),i=f("div",{id:"selectColorTabela",class:"listaCoresTabela"},...a.map((b,s)=>f("span",{},f("label",{for:`colorStyle${s+1}`},f("a",{class:"iconSelectColorTable",style:`background-color: ${le[b]?.light}`}),f("a",{class:"iconSelectColorTable",style:`background-color: ${le[b]?.dark}`})),f("br"),f("input",{type:"radio",name:"colorStyle","data-colorid":b,id:`colorStyle${s+1}`,value:`colorStyle${s+1}`,...s===0?{checked:"checked"}:{}})))),m=[];return d.forEach((b,s)=>{s%7===0&&m.push(f("div",{class:"listaEstiloTabela"}));let g=s+1;m[m.length-1]?.append(f("span",{},f("label",{for:`tableStyle${g}`},f("a",{class:"iconSelectStyleTable",style:`background-position-y: -${g*43}px`})),f("br"),f("input",{type:"radio",name:"tableStyle",id:`tableStyle${g}`,value:`tableStyle${g}`,...s===0?{checked:"checked"}:{}})))}),f("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},f("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),i,f("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),f("div",{id:"addEstiloTabela",class:Mt},...m),f("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",f("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),f("div",{style:"padding: 10px 0;"},f("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",f("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function c(a){try{let d=m=>Number.parseFloat(m?e.win.getComputedStyle(m).width:""),i=Math.round(100*d(a)/d(a?.parentElement??null));return Number.isFinite(i)?Math.min(100,Math.max(5,i)):80}catch{return 80}}function p(a,d){let i=d??o.getInstance();if(!i)return;let m=t(i),b=l(),s=b.querySelector("#addEstiloTableWidth");s&&(s.value=String(c(m)));for(let u of b.querySelectorAll('input[name="colorStyle"]'))u.addEventListener("change",()=>r(b,u.getAttribute("data-colorid")));let g=H(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:f("div",{},b,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let u=b.querySelector('input[name="tableStyle"]:checked')?.value,h=b.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),x=b.querySelector("#addEstiloTableWidth")?.value,v=b.querySelector("#addEstiloTableHeader:checked")!==null;!u||!h||!x||(n(null,[u,h,x],i,v,m),g.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(a){let d=o.getInstance(a);d&&(t(d)?p(null,d):L(e.doc,Xr))},changeColorTable(a){r(e.doc,a?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:a=>p(null,a),getSyleTable(a){let d=o.getInstance(a);d&&o.withEdit(d,()=>{})},setSyleTable:(a,d)=>n(null,a,d)}}};var qt=/^[0-9A-Za-z-]+$/,en="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",on=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,Pt={id:"tiny-url",globais(e){let o=c=>L(e.doc,c),t=c=>(e.fetch??e.win.fetch.bind(e.win))(c);async function r(c,p,a,d){let i=new URLSearchParams({url:c});p!==""&&i.set("alias",p);let m;try{m=await t(`https://tinyurl.com/api-create.php?${i}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(m.status===400)return o("Erro: Nenhuma link gerado"),!1;if(m.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let b=(await m.text()).trim();if(m.status!==200||!on.test(b))return o("Erro: Nenhuma link gerado"),!1;if(a==="setinput")return e.win.setInputTinyUrl?.(b),!0;let s=d??e.adaptador.getInstance();if(!s)return!1;let g=`<a href="${P(b)}" class="ancoraSei" target="_blank">${P(b)}</a>`;return e.adaptador.withEdit(s,()=>e.adaptador.insertHtml(s,g)),!0}function n(c){let p=e.adaptador.getInstance(c);if(!p)return;let a=f("input",{type:"text",id:"urlTiny"}),d=f("input",{type:"text",id:"aliasTiny"}),i=f("div",{id:"tinyResult"}),m=String(e.win.getSelection?.()??"").trim();m!==""&&B(m)&&(a.value=m),d.addEventListener("input",()=>{i.replaceChildren();let s=d.value;s!==""&&(qt.test(s)?i.append(`Resultado: https://tinyurl.com/${s}`):i.append(f("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let b=H(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:W(j("Insira o link que deseja encurtar:",a),j("Insira um Nome Personalizado para o link (opcional):",d),i,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let s=a.value.trim(),g=d.value.trim();if(s===""||!B(s))return o("Digite um link v\xE1lido!");if(g!==""&&!qt.test(g))return o(en);if(g!==""&&g.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(s,g,"insert",p)&&b.fechar()}},"Inserir")))})}return{getTinyUrl:n,ajaxTinyUrl:(c,p,a)=>r(c,p,a)}}};var Ye=[No,mt,Ct,Ao,ko,mo,qo,St,vt,Lo,Pt,Ho,wo,Wo,Lt,Tt,kt,pt,gt,Fo];function Rt(e,o,t){let r=e,n=[],l=[];for(let c of o){let p=!0;try{for(let[a,d]of Object.entries(c.globais(t))){if(r[a]!==void 0){p=!1,l.push({id:c.id,erro:new Error(`global ja definido: ${a}`)});continue}r[a]=d}}catch(a){p=!1,l.push({id:c.id,erro:a})}p&&n.push(c.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:c.id})}catch{}}return{instalados:n,falhas:l}}function It(e,o){let t=[];for(let r of e)try{r.iniciar?.(o)}catch(n){t.push({id:r.id,erro:n})}return t}var Dt=`/*
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
`;qe(Dt);var Nt="__seiProEditorTs",$t=window;if(!$t[Nt]){$t[Nt]=!0;let e=to(window);e.aoRecusarEscrita(()=>L(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(ro)??"",checkOpcao:t=>lo(t),verifyOpcao:t=>co(t)};for(let t of Rt(window,Ye,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of It(Ye,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
