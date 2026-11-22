/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Z(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,r=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(r.body.childNodes).map(a=>e.importNode(a,!0))}function be(e,o){if(!e||typeof o!="function")return;let t=e,r=t.__seiProCtxBuilders;if(!r){let a=[];r=t.__seiProCtxBuilders=a,e.addEventListener("contextmenu",l=>{let c=l;if(c.shiftKey)return;let p=[];for(let n of a)try{p=p.concat(n(c.target)||[])}catch{}p.length&&(c.preventDefault(),Rt(e.ownerDocument,p,c.clientX,c.clientY))})}r.includes(o)||r.push(o)}function Rt(e,o,t,r){e.getElementById("seiProCtxMenu")?.remove();let a=e.createElement("div");a.id="seiProCtxMenu",a.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",a.style.left=`${t}px`,a.style.top=`${r}px`;for(let c of o){let p=e.createElement("div");p.textContent=c.label,p.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",p.addEventListener("mouseenter",()=>{p.style.background="#eef"}),p.addEventListener("mouseleave",()=>{p.style.background=""}),p.addEventListener("click",()=>{a.remove(),c.action()}),a.append(p)}e.body.append(a);let l=()=>{a.remove(),e.removeEventListener("mousedown",l)};setTimeout(()=>e.addEventListener("mousedown",l),0)}function We(e,o,t){if(typeof t!="function")return;let r=e.__seiProCtx;if(!r){let a={acoes:{},construtores:[]};r=e.__seiProCtx=a;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(l=>{let c=l?.$??null,p=null;for(let n of a.construtores){let u=[];try{u=n(c)||[]}catch{u=[]}for(let s of u){let m=`seiPro_${String(s.label).replace(/[^A-Za-z0-9]/g,"_")}`;a.acoes[m]=s.action,e.getCommand(m)||e.addCommand(m,{exec:()=>(a.acoes[m]?.(),!0)}),e.getMenuItem(m)||e.addMenuItem(m,{label:s.label,command:m,group:"seiProGroup"}),p=p??{},p[m]=o}}return p})}r.construtores.includes(t)||r.construtores.push(t)}var N=e=>e;function Xe(e,o={}){let t=()=>e.CKEDITOR,r=n=>!!n?.name&&t()?.instances[n.name]===n,a=n=>r(n)&&!n.readOnly,l=n=>N(n).document?.getBody()?.$??null,c=(n,u)=>{if(!n)return;let s=N(n);if(s.readOnly){o.fn?.();return}u(s)},p={versao:4,getInstance(n){let u=t();if(!u?.instances)return null;if(r(u.currentInstance))return u.currentInstance;let s=n?.closest?.("div.cke"),m=s?u.instances[s.id.replace("cke_","")]:void 0;if(a(m))return m;if(a(e.oEditor))return e.oEditor;let b=Object.values(u.instances);return b.find(i=>a(i))??b[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:n=>N(n).focus(),saveSnapshot:n=>N(n).fire("saveSnapshot"),withEdit(n,u){let s=N(n);s.focus(),s.fire("saveSnapshot"),s.fire("lockSnapshot",{dontUpdate:!0});try{u()}finally{s.fire("unlockSnapshot"),s.fire("saveSnapshot")}},insertHtml:(n,u)=>c(n,s=>s.insertHtml(u)),insertText:(n,u)=>c(n,s=>s.insertText(u)),getSelectionElement:n=>N(n).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(n){return p.getSelectionElement(n)?.closest("p")??null},insertHtmlBefore(n,u,s){c(n,()=>u.before(...Z(u.ownerDocument,s)))},getToolbarContainer:n=>N(n).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:n=>l(n),findInBody(n,u){let s=l(n);return s?Array.from(s.querySelectorAll(u)):[]},appendToBody(n,u){c(n,s=>{let m=l(s);m&&m.append(...Z(m.ownerDocument,u))})},transformBodyHtml(n,u){c(n,s=>{let m=l(s);if(!m)return;let b=m.innerHTML,i=u(b);typeof i=="string"&&i!==b&&m.replaceChildren(...Z(m.ownerDocument,i))})},execCommand:(n,u,s)=>N(n).execCommand(u,s),applyStyle(n,u){let s=t()?.style;s&&N(n).applyStyle(new s(u))},getData:n=>N(n).getData(),setData:(n,u)=>c(n,s=>s.setData(u)),insertElement(n,u){c(n,s=>{let m=t()?.dom?.element.createFromHtml;m&&s.insertElement?s.insertElement(m(u,s.document)):s.insertHtml(u)})},saveSelection:n=>N(n).getSelection()?.createBookmarks(!0)??null,restoreSelection(n,u){let s=N(n).getSelection();s&&u&&s.selectBookmarks(u)},getSelectedText:n=>N(n).getSelection()?.getSelectedText()??"",getSelectedHtml(n){return N(n).getSelectedHtml?.()?.getHtml?.()??""},on:(n,u,s)=>N(n).on(u,s),off:(n,u,s)=>N(n).removeListener(u,s),fire:(n,u,s)=>N(n).fire(u,s),addContextMenu(n,u){let s=N(n),m=t();if(m&&s.contextMenu&&typeof s.addMenuItem=="function"){We(s,m.TRISTATE_OFF,u);return}be(l(n),u)},waitReady(n){return new Promise((u,s)=>{let m=Date.now(),b=()=>{let i=Object.values(t()?.instances??{}).find(g=>g.status==="ready");if(i)return u(i);if(Date.now()-m>n)return s(new Error("Timeout aguardando CKEditor 4"));setTimeout(b,100)};b()})},somenteLeitura:n=>!!N(n).readOnly,aoRecusarEscrita(n){o.fn=n},recusarEscrita(){o.fn?.()}};return p}var $=e=>e,It={strike:"strikethrough",strikethrough:"strikethrough"},Dt={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},$t=0;function Ye(e,o={}){let t=e.document,r=i=>Array.from(i.model.document.roots??[]).filter(g=>g.isAttached()&&g.rootName!=="$graveyard"),a=i=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[i],l=(i,g)=>{let d=i.editing.view.document.getRoot(g);return d?i.editing.view.domConverter.mapViewToDom(d):null},c=i=>{for(let h of r(i))if(a(h.rootName)?.principal){let x=l(i,h.rootName);if(x)return x}let g=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return g||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((h,x)=>x.childElementCount>(h?h.childElementCount:-1)?x:h,null)},p=i=>{let g=c(i);return g&&r(i).find(d=>l(i,d.rootName)===g)||null},n=i=>i.model.document.selection.getFirstPosition()?.root.rootName??null,u=i=>!!i&&!!a(i)?.somenteLeitura,s=(i,g)=>i.data.toModel(i.data.processor.toView(g)),m=(i,g)=>{let d=$(i);if(u(n(d)))return o.fn?.();d.model.change(()=>d.model.insertContent(s(d,g),d.model.document.selection))},b={versao:5,getInstance(){let i=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return i&&i.state==="ready"?i:null},getAllInstances(){let i=b.getInstance();return i?[i]:[]},focus:i=>$(i).focus(),saveSnapshot(){},withEdit(i,g){let d=$(i);d.focus(),d.model.change(()=>g())},insertHtml:m,insertText(i,g){let d=$(i);if(u(n(d)))return o.fn?.();d.model.change(h=>d.model.insertContent(h.createText(g)))},getSelectionElement(){let i=e.getSelection?.(),g=i&&i.rangeCount>0?i.anchorNode:null;return g?g.nodeType===1?g:g.parentElement:null},getSelectionParagraph:i=>b.getSelectionElement(i)?.closest("p")??null,insertHtmlBefore(i,g,d){let h=$(i),x=h.editing.view.domConverter.mapDomToView(g),v=x?h.editing.mapper.toModelElement(x):null;if(v){if(u(v.root?.rootName))return o.fn?.();h.model.change(A=>h.model.insertContent(s(h,d),A.createPositionBefore(v)));return}m(i,d)},getToolbarContainer(i){let g=$(i).ui?.view?.toolbar?.element;return g?g.querySelector(".ck-toolbar__items")??g:null},getBodyContainer:i=>c($(i)),findInBody(i,g){let d=c($(i));return d?Array.from(d.querySelectorAll(g)):[]},appendToBody(i,g){let d=$(i),h=p(d);if(!h)return m(i,g);if(u(h.rootName))return o.fn?.();d.model.change(x=>d.model.insertContent(s(d,g),x.createPositionAt(h,"end")))},transformBodyHtml(i,g){let d=$(i),h=p(d);if(!h)return;let x=d.data.get({rootName:h.rootName,seiProInterno:!0}),v=g(x);if(typeof v!="string"||v===x)return;let A=d.model.document.selection.getFirstRange(),y=A&&A.start.root.rootName===A.end.root.rootName?{raiz:A.start.root,ps:[...A.start.path],pe:[...A.end.path]}:null,k=d.model.document.selection.isBackward;d.data.set({[h.rootName]:v}),y&&d.model.change(w=>{let _,E;try{_=d.model.createPositionFromPath(y.raiz,y.ps),E=d.model.createPositionFromPath(y.raiz,y.pe)}catch{_=E=w.createPositionAt(y.raiz,"end")}w.setSelection(w.createRange(_,E),{backward:k})})},execCommand(i,g,d){$(i).execute(It[g]??g,d!==void 0?{value:d}:void 0)},applyStyle(i,g){let d=Dt[g.element.toLowerCase()];d&&$(i).execute(d)},getData(i){let g=$(i),d=p(g);return d?g.data.get({rootName:d.rootName}):g.data.get()},setData(i,g){let d=$(i),h=p(d);h?d.data.set({[h.rootName]:g}):d.data.set(g)},insertElement:(i,g)=>b.insertHtml(i,g),saveSelection(i){let g=$(i),d=`spro-ed:${$t++}`;return g.model.change(h=>{let x=g.model.document.selection.getFirstRange();x&&h.addMarker(d,{range:x,usingOperation:!1})}),d},restoreSelection(i,g){let d=$(i);if(typeof g!="string")return;let h=d.model.markers.get(g);h&&d.model.change(x=>x.setSelection(h.getRange())),d.model.change(x=>{d.model.markers.has(g)&&x.removeMarker(g)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let i=e.getSelection?.();if(!i||i.rangeCount===0)return"";let g=t.createElement("div");return g.append(i.getRangeAt(0).cloneContents()),g.innerHTML},on(i,g,d){if(g==="change")return $(i).model.document.on("change:data",d);c($(i))?.addEventListener(g,d)},off(i,g,d){if(g==="change")return $(i).model.document.off("change:data",d);c($(i))?.removeEventListener(g,d)},fire(i,g,d){c($(i))?.dispatchEvent(new CustomEvent(g,{detail:d}))},addContextMenu(i,g){be(c($(i)),g)},waitReady(i){return new Promise((g,d)=>{let h=Date.now(),x=()=>{let v=b.getInstance();if(v)return g(v);if(Date.now()-h>i)return d(new Error("Timeout aguardando CKEditor 5"));setTimeout(x,100)};x()})},somenteLeitura:i=>u(n($(i))),aoRecusarEscrita(i){o.fn=i},recusarEscrita(){o.fn?.()}};return b}function Te(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function Ze(e){let o=null,t={},r=()=>{if(o)return o;let c=Te(e);return c===5?o=Ye(e,t):c===4&&(o=Xe(e,t)),o},a=()=>{let c=r();if(!c)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return c},l=c=>((...p)=>a()[c](...p));return{get versao(){return r()?.versao??0},getInstance:c=>r()?.getInstance(c)??null,getAllInstances:()=>r()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(c){t.fn=c},recusarEscrita(){t.fn?.()},waitReady(c){let p=Date.now();return new Promise((n,u)=>{let s=()=>{let m=r();if(m)return m.waitReady(Math.max(1,c-(Date.now()-p))).then(n,u);if(Date.now()-p>c)return u(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(s,100)};s()})}}}var eo="data-base";function oo(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===o)?.value}function to(e,o){let t=oo(e,o);return!(t===!1||t===0||t==="")}function ro(e,o){let t=oo(e,o);return t===!0||t===1||t==="1"}function no(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function ao(e,o=localStorage){return to(no(o),e)}function io(e,o=localStorage){return ro(no(o),e)}function he(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function xe(e){e.style.display="none"}var so=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function lo(e){let o=()=>e.adaptador.versao===5,t=(r,a)=>{let l=r.editing.view.domConverter.mapDomToView(a);return l?r.editing.mapper.toModelElement(l):null};return{selecionados(r){let a=()=>{let i=e.adaptador.getSelectionParagraph(r);return i?[i]:[]};if(o()){let i=r,d=[...i.model.document.selection.getSelectedBlocks()].map(h=>{let x=i.editing.mapper.toViewElement(h);return x?i.editing.view.domConverter.mapViewToDom(x):null}).filter(h=>!!h&&h.tagName==="P");return d.length?d:a()}let c=e.adaptador.getBodyContainer(r)?.ownerDocument?.getSelection?.();if(!c||c.rangeCount===0||!c.anchorNode)return a();let p=so(c.anchorNode),n=so(c.focusNode);if(!p&&!n||(p=p??n,n=n??p,!p||!n))return a();if(p===n)return[p];let u=p,s=n;p.compareDocumentPosition(n)&2&&(u=n,s=p);let m=[],b=u;for(let i=0;b&&i<5e3&&(b.tagName.toLowerCase()==="p"&&m.push(b),b!==s);i+=1)b=b.nextElementSibling;return m.length?m:[u]},classeDeEstilo(r,a){return o()?t(r,a)?.getAttribute("estilo")??"":a.getAttribute("class")??""},definirClasse(r,a,l){if(o()){let c=r,p=t(c,a);p&&c.model.change(n=>n.setAttribute("estilo",l,p)),e.win.SeiProGhs?.setEstilos(a,{"text-align":null},r);return}a.removeAttribute("style"),a.setAttribute("class",l)},definirTextAlign(r,a,l){if(o()){e.win.SeiProGhs?.setEstilos(a,{"text-align":l},r);return}a.removeAttribute("style"),a.style.textAlign=l}}}var Nt=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function Ht(e,o){let t=Nt.find(r=>Object.values(r).includes(e));return t?t[o]:null}function Qt(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let r=e?.parentElement??null;r;r=r.parentElement){let a=r.querySelector(".divAlignText");if(a)return a}return o.querySelector(".divAlignText")}var co={id:"align",globais(e){let o=lo(e);return{setAlignText(t,r){let a=e.adaptador.getInstance(t);if(!a||e.adaptador.somenteLeitura(a))return;let l=o.selecionados(a);l.length&&e.adaptador.withEdit(a,()=>{for(let c of l){let p=Ht(o.classeDeEstilo(a,c),r);p?o.definirClasse(a,c,p):o.definirTextAlign(a,c,r)}})},openAlignText(t){if(!t)return;let r=Qt(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),r&&xe(r)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),r&&he(r))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};function f(e,o={},...t){let r=document.createElement(e);for(let[a,l]of Object.entries(o))l===void 0||l===!1||(typeof l=="function"?r.addEventListener(a.replace(/^on/,""),l):l===!0?r.setAttribute(a,""):a==="class"?r.className=l:a==="value"&&e==="textarea"?r.value=l:r.setAttribute(a,l));for(let a of t)a!=null&&a!==!1&&r.append(a);return r}var U={fill:"currentColor",stroke:"none"},uo="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",po={estrela:[["path",{d:uo}]],estrelaCheia:[["path",{d:uo,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...U}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...U}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...U}],["circle",{cx:"12",cy:"12",r:"1.4",...U}],["circle",{cx:"19",cy:"12",r:"1.4",...U}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...U}],["circle",{cx:"15",cy:"6",r:"1.3",...U}],["circle",{cx:"9",cy:"12",r:"1.3",...U}],["circle",{cx:"15",cy:"12",r:"1.3",...U}],["circle",{cx:"9",cy:"18",r:"1.3",...U}],["circle",{cx:"15",cy:"18",r:"1.3",...U}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},vn=Object.keys(po);function de(e,o=18,t=document){let r="http://www.w3.org/2000/svg",a=t.createElementNS(r,"svg"),l={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[c,p]of Object.entries(l))a.setAttribute(c,p);for(let[c,p]of po[e]){let n=t.createElementNS(r,c);for(let[u,s]of Object.entries(p))n.setAttribute(u,s);a.append(n)}return a}function Ot(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function mo(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(l=>{try{return l.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function fo(e,o,t,r,a){let l=e.body??e.documentElement;for(let m of[l,...e.querySelectorAll("dialog")])for(let b of[...m.children])b.classList.contains("spro-aviso")&&b.remove();let c=f("div",{class:"spro-aviso",role:"status"},de("check",16),f("span",{},o),...Ot(t).map(m=>f("button",{type:"button",onclick:()=>{c.remove(),m.fazer()}},m.rotulo)));c.setAttribute("popover","manual");let p=()=>{try{c.showPopover?.()}catch{}},n=Date.now()+r,u=()=>{let m=mo(e);m.append(c),p(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!s||!m.contains(c))){if(a&&mo(e).localName!=="dialog"&&a(o,t,Math.max(0,n-Date.now()))){s=!1,c.remove();return}u()}},{once:!0})},s=!0;return u(),setTimeout(()=>{s=!1,c.remove()},r),c}var zt=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function go(e={}){return({titulo:o,conteudo:t,icone:r,aoFechar:a})=>{let l=f("dialog",{class:"spro-dialogo","aria-label":o}),c=()=>{l.open&&l.close()};return l.append(f("header",{},r?f("span",{class:"spro-dialogo-icone","aria-hidden":"true"},de(r,18)):null,f("h2",{},o),f("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:c},de("fechar",16))),f("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),a?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(zt)?.focus({preventScroll:!0}),{fechar:c}}}function bo(e){let o=go();return(t,r)=>(_e(t,e),o(r))}function _e(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var Me="";function Le(e){Me=e}var H=(e,o)=>bo(Me)(e,o);function ho(e){_e(e,Me)}function I(e,o){ho(e),fo(e,o,void 0,7e3)}var jt=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),xo=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Bt(e){let o=0,t=e.split("");return t.forEach((r,a)=>{let l=xo.get(r),c=xo.get(t[a+1]);o+=l<c?-l:l}),o}function ee(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:jt.has(o.toLowerCase())&&t!==0?o.toLowerCase():Bt(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function q(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var vo={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let r=e.adaptador.getSelectedText(t);if(!r||r.trim()===""){I(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,q(ee(r)))}})};var yo="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function K(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let r of o)t+=yo[r%yo.length];return t}var Ft=()=>`<span class="ancoraSei checkboxSEI" data-id="${K(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,Eo={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Ft()))}})};var qe="copyStylePro",Pe="cke_copyformatting_active",ko=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i;function Vt(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),r=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&r?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var Co={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,r=()=>{try{return JSON.parse(t().getItem(qe)??"null")}catch{return null}},a=s=>o.getSelectedHtml(s).trim()!==""||o.getSelectedText(s).trim()!=="",l=s=>!!o.getBodyContainer(s)?.classList.contains(Pe),c=s=>{for(let m of e.doc.querySelectorAll(".getCopyStyleButtom"))s==="desabilitar"?m.classList.add("cke_button_disabled"):s==="habilitar"?m.classList.remove("cke_button_disabled"):(m.classList.toggle("cke_button_on",s),m.classList.toggle("cke_button_off",!s))};function p(){let s=o.getInstance();s&&o.getBodyContainer(s)?.classList.remove(Pe),t().removeItem(qe),c(!1)}function n(s){let m=s??o.getInstance();if(!m)return;if(l(m)){p();return}let b=o.getSelectionElement(m);b&&(t().setItem(qe,JSON.stringify(Vt(b))),o.getBodyContainer(m)?.classList.add(Pe),c(!0))}function u(){let s=o.getInstance();if(!s)return;let m=a(s),b=l(s);c(m||b?"habilitar":"desabilitar");let i=r();if(!(i&&m&&b))return;o.withEdit(s,()=>{o.execCommand(s,"removeFormat");for(let[h,x]of[[i.bold,"bold"],[i.underline,"underline"],[i.italic,"italic"],[i.strike,"strike"],[i.subscript,"subscript"],[i.superscript,"superscript"]])h===!0&&o.execCommand(s,x);let d=[];if(typeof i.backgroundColor=="string"&&ko.test(i.backgroundColor)&&d.push(`background-color: ${i.backgroundColor}`),typeof i.fontSize=="number"&&Number.isFinite(i.fontSize)&&i.fontSize>0&&i.fontSize<400&&d.push(`font-size: ${i.fontSize}px`),typeof i.color=="string"&&ko.test(i.color)&&d.push(`color: ${i.color}`),d.length){let h=o.getSelectedHtml(s);h!==""&&o.insertHtml(s,`<span style="${d.join("; ")}">${h}</span>`)}}),!!e.win.event?.altKey||p()}return{setCopyStyle(s){let m=o.getInstance(s);m&&n(m)},actionCopyStyle:n,getCopyStyle:r,applyCopyStyle:u,removeCopyStyle:p,menuCopyStyle(s){s&&o.addContextMenu(s,m=>o.versao===5?[]:m?.closest("p")&&a(s)?[{label:"Copiar formata\xE7\xE3o",action:()=>n(s)}]:[])}}}};var Re="spro_editor_folha",Ao="seipro-folha-editor",Ie="data-spro-folha-editor",Ut=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function Gt(e){let o=`html[${Ie}]`,t=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",a="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${a}, -14px 0 24px -14px ${a}`,c=`0 14px 24px -14px ${a}`,p=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${t} !important; }
${o} #divEditores { padding-bottom: 28px; }
${p} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${p}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${p}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${c}; clip-path: inset(0 -30px -30px); }
${p}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${p} { padding-left: 20px; padding-right: 20px; } }
${o} .ck-editor__main { background-color: ${t}; padding: 28px 12px; }
${o} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${r} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function So(e,o){if(!e.head||(e.querySelector(`style[data-style="${Ao}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",Ao),t.textContent=o,e.head.append(t)}function wo(e,o){if(!e?.style)return;let t=e.getAttribute("data-spro-folha-bg");if(o)t===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color","#ffffff","important");else if(t!==null){let[r,a]=t.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,a||"")}}var To={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(Re),r=()=>!!e.win.localStorage?.getItem("darkModePro"),a=!1;function l(n){for(let u of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let s=u.contentDocument;s?.head&&(So(s,n?Ut:null),wo(s.documentElement,n),wo(s.body,n))}}function c(n){let u=[...o.querySelectorAll(".cke_contents")];u.forEach((s,m)=>{if(!n){s.removeAttribute("data-spro-folha");return}let b=[m===0?"primeira":"",m===u.length-1?"ultima":""].filter(Boolean);s.setAttribute("data-spro-folha",b.join(" ")||"meio")})}function p(n){So(o,n?Gt(r()):null),l(n),c(n),n?o.documentElement.setAttribute(Ie,""):o.documentElement.removeAttribute(Ie);for(let u of o.querySelectorAll(".getPaperViewButtom"))u.classList.toggle("cke_button_on",n),u.classList.toggle("cke_button_off",!n),u.setAttribute("aria-pressed",n?"true":"false")}return{aplicarFolhaEditorPro:p,getPaperViewButtom(n){let u=!t();u?e.win.localStorage.setItem(Re,"1"):e.win.localStorage.removeItem(Re),p(u)},initFolhaEditorPro(){let n=e.win.CKEDITOR;if(typeof n?.on=="function"&&!a){a=!0;let u=s=>s.on("contentDom",()=>t()&&l(!0));for(let s of Object.values(n.instances??{}))u(s);n.on("instanceReady",s=>u(s.editor))}p(t())}}}};function Jt(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var _o={id:"font-size",globais:e=>({changeFontSize(o,t){let r=e.adaptador.getInstance(o);if(!r)return;let a=e.adaptador.getSelectedHtml(r);if(!a||a.trim()===""){I(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=Jt(e.adaptador.getSelectionElement(r)),c=t==="up"?l+2:l-2;c>7&&c<70&&e.adaptador.withEdit(r,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(r,{element:"span",attributes:{style:`font-size: ${c}px`}}):e.adaptador.insertHtml(r,`<span style="font-size: ${c}px">${a}</span>`)})}})};var ve=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Kt=[{name:ve,attributes:!0},{name:ve,classes:!0},{name:ve,styles:!0}],ue=e=>e.split("").join("[\\t\\n\\r]*"),De=new RegExp(`^[\\s\\x00-\\x20]*(${ue("javascript")}|${ue("vbscript")}|${ue("livescript")}|${ue("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${ue("text/html")})`,"i"),Wt=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:De}]}];function re(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function pe(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var Xt=e=>!!(e?.model&&e.editing&&e.conversion),Yt=e=>pe(e,"EstiloEditing")?.estilos??{},Mo=(e,o)=>Object.hasOwn(e,o);function Po(e,o){let t=pe(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function Zt(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function er(e,o,t){if(!o?.is?.("element"))return;let r=t.mapper.toViewElement(o);if(!r)return;let a=Yt(e),l=o.getAttribute("estilo"),c=Zt(o,Po(e,"p")),p=t.writer,n=[];try{n=Array.from(r.getClassNames())}catch{}for(let u of n)u!==l&&Mo(a,u)&&p.removeClass(u,r);for(let u of c)Mo(a,u)||p.addClass(u,r);l&&p.addClass(l,r)}function or(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${Po(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let r of o)t.on(r,(a,l,c)=>{try{er(e,l.item,c)}catch{}},{priority:"lowest"})})}function tr(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function Lo(e,o){let t=pe(o,"Salvar"),r=t?!!t.isDirty:!1;try{e()}finally{if(t&&!r)try{t.resetDirty()}catch{}}}function rr(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function nr(e,o){let t=e.getFullData({seiProInterno:!0}),r=o.INFRA_EDITOR_CONFIG?.initialData;return!r||typeof r!="object"||rr(e)?t:Object.fromEntries(Object.keys(t).map(a=>[a,typeof r[a]=="string"?r[a]:t[a]]))}function ar(e,o,t){try{let r=t??e.adaptador.getSelectionParagraph(o);if(!r)return null;if(typeof r.is=="function"&&r.is("element"))return r;let a=r.jquery?r.get(0):r;if(a?.nodeType!==1)return null;let l=o.editing.view.domConverter.mapDomToView(a);return l?o.editing.mapper.toModelElement(l):null}catch{return null}}function ir(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function qo(e){let o=l=>l??e.adaptador.getInstance();function t(l){let c=o(l);if(!Xt(c))return!1;if(c.__seiProGhsLiberado)return!0;let p=pe(c,"DataFilter");if(!p)return re("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{p.allowElement({name:ve,attributes:!0,classes:!0,styles:!0});for(let n of Kt)p.allowAttributes(n);if(typeof p.disallowAttributes=="function")for(let n of Wt)p.disallowAttributes(n)}catch(n){return re("falha ao liberar o GHS",n),!1}return c.__seiProGhsLiberado=!0,or(c),!0}function r(l){let c=o(l);if(!t(c)||typeof c.getFullData!="function")return!1;let p=!0;return Lo(()=>{try{c.data.set(nr(c,e.win))}catch(n){re("falha ao reprocessar o conteudo",n),p=!1}},c),p}function a(l,c,p){let n=o(l);if(!t(n))return!1;let u=pe(n,"GeneralHtmlSupport"),s=ar(e,n,c),m=s?ir(n,s):null;if(!u||!s||!m)return!1;try{return p(u,m,s),!0}catch(b){return re("falha ao aplicar no model",b),!1}}return{liberar:t,aplicarRegras:r,semSujar:(l,c)=>Lo(l,o(c)),estaLiberado:l=>!!o(l)?.__seiProGhsLiberado,addClasse:(l,c,p)=>a(p,l,(n,u,s)=>n.addModelHtmlClass(u,c,s)),removeClasse:(l,c,p)=>a(p,l,(n,u,s)=>n.removeModelHtmlClass(u,c,s)),setEstilos:(l,c,p)=>a(p,l,(n,u,s)=>n.setModelHtmlStyles(u,c,s)),setAtributos:(l,c,p)=>a(p,l,(n,u,s)=>n.setModelHtmlAttributes(u,c,s))}}var Ro={id:"ghs-unlock",globais:e=>({SeiProGhs:qo(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=qo(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||tr(t)){re("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&re("classes, estilos e atributos liberados no editor")}}};function W(...e){return f("div",{style:"display:grid;gap:12px;min-width:360px;"},...e)}function j(e,o){return o.classList.add("spro-campo"),o.style.width="100%",f("label",{style:"display:grid;gap:4px;font-size:13px;"},f("span",{},e),o)}function Io(e,o){return new Promise((t,r)=>{let a=new e.Image;a.crossOrigin="anonymous",a.onload=()=>{try{let l=e.document.createElement("canvas");l.width=a.width,l.height=a.height,l.getContext("2d")?.drawImage(a,0,0),t(l.toDataURL("image/png"))}catch(l){r(l)}},a.onerror=()=>r(new Error("imagem nao carregou")),a.src=o})}var sr="https://latex.codecogs.com/png.latex?",lr="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",cr="https://editor.codecogs.com/",Do={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(n=>Io(e.win,n)),r=n=>I(e.doc,n);function a(){let n=o;if(!n)return;let u=n.texto.value;n.geracao+=1;let s=n.geracao;if(n.previa.replaceChildren(),n.pronta=!1,n.falhou=!1,u==="")return;let m=f("img",{src:`${sr}${encodeURI(u)}`});n.previa.append(m),t(m.getAttribute("src")??"").then(b=>{o!==n||n.geracao!==s||(m.setAttribute("src",b),m.className="img-base64",n.pronta=!0)},()=>{o===n&&n.geracao===s&&(n.falhou=!0)})}function l(){let n=o;if(!n)return!1;let u=n.texto.value;if(u==="")return r("Digite a equa\xE7\xE3o"),!1;if(n.falhou)return r("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let s=n.previa.querySelector("img");if(!n.pronta||!s)return r("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let m=n.ed,b=`<img class="img-base64" src="${q(s.getAttribute("src")??"")}" alt="${q(u)}">`;return e.adaptador.withEdit(m,()=>e.adaptador.insertHtml(m,b)),!0}function c(n){let u=e.adaptador.getInstance(n);if(!u)return;let s=f("textarea",{id:"MathText",rows:"5"});s.addEventListener("input",a);let m=f("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),b=H(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:W(j("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",s),m,f("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",f("a",{href:lr,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",f("a",{href:cr,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&b.fechar()}},"Inserir")))});o={ed:u,texto:s,previa:m,geracao:0,pronta:!1,falhou:!1};let i=String(e.win.getSelection?.()??"").trim();i!==""&&(s.value=i,a())}function p(){}return{updatePreviewLatex:a,openDialogLatex:c,getDialogLatex:p}}};function B(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}var ye="https://legis.seipro.app/v1",dr=50,ur={lei:"Lei","lei.complementar":"LC",decreto:"Dec","decreto.lei":"DecLei","medida.provisoria":"Mp","emenda.constitucional":"Ec","decreto.legislativo":"DecLeg",resolucao:"Res"};function pr(e){let o=String(e??""),t=o.split(","),r=/(\d{4})\s*$/.exec(o);return t.length>1&&r?`${(t[0]??"").trim()}, de ${r[1]}`:o}function mr(e){let o=String(e??"").replace(/\s+/g," ").trim();for(;/\s*\([^()]*\)$/.test(o);)o=o.replace(/\s*\([^()]*\)$/,"").trim();return!o||o===o.toUpperCase()?"":o}var fr=e=>B(e)?e:"";function $o(e){return{sigla:e.tipo==="constituicao"?"Cf":(ur[e.tipo??""]??String(e.tipo??"").replace(/[^A-Za-z]/g,""))+String(e.numero??"").replace(/[^0-9-]/g,""),titulo:e.titulo||e.titulo_curto||"",curto:e.titulo_curto||pr(e.titulo),apelido:mr(e.apelido),url:fr(e.url||(e.urn?`https://normas.leg.br/?urn=${e.urn}`:"")),ementa:e.ementa||"",revogada:e.situacao==="revogada"}}function No(e,o){let t=q,r=o?t(e.curto||e.titulo):t(e.titulo)+(e.apelido?`&nbsp;(${t(e.apelido)})`:""),a=e.url?` href="${t(e.url)}" target="_blank"`:"";return`<a class="ancoraSei legisSeiPro" data-norma="${t(e.sigla)}" data-normafull="${t(e.titulo)}" data-index="0"${a}>${r}</a>`}async function $e(e,o,t){let r=new URLSearchParams({per_page:String(dr)});for(let[p,n]of Object.entries(t))n!==""&&n!==null&&n!==void 0&&r.set(p,String(n));let a=await e(`${o}/normas?${r}`);if(!a.ok)throw new Error(`HTTP ${a.status}`);let l=await a.json(),c=(l?.itens??[]).map($o);return{total:l?.total??c.length,normas:c}}async function Ho(e,o,t){let r=[];for(let l of t){let c=String(l??"").trim().slice(0,60);c&&!r.includes(c)&&r.push(c)}let a={};if(!r.length)return a;try{let l=await e(`${o}/normas/resolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refs:r.slice(0,200)})});if(!l.ok)return a;let c=await l.json();for(let[p,n]of Object.entries(c?.resultados??{}))n&&(a[p]=$o(n))}catch{}return a}var Ne=e=>({ano:"exato",ate:"ate",apos:"apos"})[e]??"exato";function He(e){let o=String(e??"").split(/[/-]/)[0]?.replace(/[^0-9]+/g,"");return o?Number.parseInt(o,10):""}function Qo(e){let o=String(e??"").toLowerCase();return/emenda constitucional|\bec\b/.test(o)?"emenda.constitucional":/decreto legislativo/.test(o)?"decreto.legislativo":/lei complementar|\blc\b/.test(o)?"lei.complementar":/decreto-lei|decreto lei|\bdl\b/.test(o)?"decreto.lei":/medida provis[o\u00f3]ria|\bmp\b/.test(o)?"medida.provisoria":/decreto|\bdec\b/.test(o)?"decreto":/\blei\b/.test(o)?"lei":""}var gr=[["",""],["Lei","lei"],["Lei Complementar","lei.complementar"],["Decreto","decreto"],["Decreto-Lei","decreto.lei"],["Medida Provis\xF3ria","medida.provisoria"],["Emenda Constitucional","emenda.constitucional"],["Decreto Legislativo","decreto.legislativo"]],br=[["",""],["No ano","ano"],["At\xE9 o ano de...","ate"],["Ap\xF3s o ano de...","apos"]],hr=[["",""],["ANTAQ","Antaq"],["Cade","Cade"],["PRF","PRF"],["TSE","Tse"],["TRE RR","Trerr"],["TJ RR","TJRR"],["CNJ","CNJ"]],xr=[["",""],["Acordo/Plano/Ato/Nota","acord"],["Ata e Certid\xF5es de Julgamento","atas"],["Constitui\xE7\xE3o Estadual","ce"],["Decreto Estadual","decest"],["Edital","Edit"],["Enunciado Administrativo","enumadm"],["Emenda Constitucional","ec"],["Emenda Regimental","er"],["Emendas","Emenda"],["Instru\xE7\xE3o Normativa","in"],["Instru\xE7\xE3o Normativa Conjunta","resconj"],["Lei Complementar Estadual","lce"],["Lei Estadual","leiest"],["Lei Municipal","leimun"],["Nota T\xE9cnica","nt"],["Orienta\xE7\xE3o Normativa","on"],["Portaria","port"],["Portaria Conjunta","portconj"],["Portaria Interministerial","portinter"],["Portaria Interinstitucional","portinst"],["Provimento","prov"],["Recomenda\xE7\xE3o","Rec"],["Regimento Interno","regim"],["Resolu\xE7\xE3o Normativa","rn"],["Resolu\xE7\xE3o","res"],["Resolu\xE7\xE3o Conjunta","resconj"],["S\xFAmula Administrativa","sum"]],vr=[["",""],["C\xF3digo Brasileiro de Aeron\xE1utica","Lei7565/1986"],["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es","Lei4117/1962"],["C\xF3digo Civil","Lei10406/2002"],["C\xF3digo Comercial","Lei556/1850"],["C\xF3digo de Defesa do Consumidor","Lei8078/1990"],["Constitui\xE7\xE3o Federal","Cf"],["C\xF3digo Florestal","Lei12651/2012"],["Consolida\xE7\xE3o das Leis do Trabalho","DecLei5452/1943"],["C\xF3digo de \xC1guas","Dec24643/1934"],["C\xF3digo Eleitoral","Lei4737/1965"],["C\xF3digo de Minas","DecLei227/1967"],["C\xF3digo Penal","DecLei2848/1940"],["C\xF3digo de Processo Civil","Lei13105/2015"],["C\xF3digo Penal Militar","DecLei1001/1969"],["C\xF3digo de Processo Penal","DecLei3689/1941"],["C\xF3digo de Processo Penal Militar","DecLei1002/1969"],["C\xF3digo de Tr\xE2nsito Brasileiro","Lei9503/1997"],["C\xF3digo Tribut\xE1rio Nacional","Lei5172/1966"],["Estatuto da Crian\xE7a e do Adolescente","Lei8069/1990"],["Estatuto da Cidade","Lei10257/2001"],["Estatuto do Desarmamento","Lei10826/2003"],["Estatuto do Idoso","Lei10741/2003"],["Estatuto da Igualdade Racial","Lei12288/2010"],["Estatuto do \xCDndio","Lei6001/1973"],["Estatuto da Juventude","Lei12852/2013"],["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte","LC123/2006"],["Estatuto dos Militares","Lei6880/1980"],["Estatuto dos Museus","Lei11904/2009"],["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)","Lei8906/1994"],["Estatuto da Pessoa com Defici\xEAncia","Lei13146/2015"],["Estatuto dos Refugiados","Lei9474/1997"],["Estatuto da Terra","Lei4504/1964"],["Estatuto de Defesa do Torcedor","Lei10671/2003"]],yr="Servi\xE7o de legisla\xE7\xE3o indispon\xEDvel no momento. Tente novamente mais tarde.",Oo="Nenhuma legisla\xE7\xE3o encontrada";function Er(e){let o=e.replace(/(\r\n|\n|\r)/gm," ").trim();/[A-Z]/.test(o)&&o===o.toUpperCase()&&(o=o.charAt(0)+o.toLocaleLowerCase().slice(1));let t=o.length>170;return{curta:t?`${o.replace(/^(.{170}\S*)[\s\S]*/,"$1")}...`:o,completa:o,longa:t}}var zo={id:"legis",globais(e){let o=e.adaptador,t=E=>I(e.doc,E),r=(E,C)=>(e.fetch??e.win.fetch.bind(e.win))(E,C),a=[],l=null,c=0,p=null;function n(E,C){Ho(r,ye,E??[]).then(C)}function u(E,C){let S=C??o.getInstance();if(!S||!E)return;let L=o.findInBody(S,"a").some(T=>E.url&&T.getAttribute("href")===E.url||T.getAttribute("data-norma")===E.sigla),M=o.saveSelection(S);o.focus(S),M&&o.restoreSelection(S,M),o.withEdit(S,()=>{o.insertElement(S,No(E,L))})}function s(E,C){let S=C??p??o.getInstance();S&&n([E],L=>{let M=L[String(E??"").trim()];if(!M)return t(Oo);u(M,S)})}function m(E,C){let S=Er(E.ementa),L=E.revogada?"text-decoration:line-through;color:#adadad;":"",M=E.url?f("a",{class:"linkDialog",href:E.url,target:"_blank",rel:"noopener noreferrer"},E.titulo," \u2197"):f("span",{},E.titulo),T=f("button",{type:"button",class:"spro-botao","data-legis-idx":String(C),style:"float:right;margin-left:10px;",onclick:()=>A(T)},"Adicionar"),P=f("div",{class:"searchLegis_linha",style:"border-bottom:2px solid #efefef;padding:10px 0;"},f("p",{},M,E.apelido?f("span",{style:"opacity:.7;"},` (${E.apelido})`):null,E.revogada?f("span",{style:"background:#e0e0e0;padding:1px 5px;color:#444;border-radius:5px;margin-left:10px;"},"Revogada"):null,T));if(S.completa){let D=`font-style:italic;word-break:break-word;white-space:break-spaces;max-width:500px;padding:6px 0 0;${L}`;P.append(f("p",{class:"searchLegis_ementa",style:D},`${S.curta} `,S.longa?f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",onclick:Q=>y(Q.currentTarget)},"mais"):null),f("p",{class:"searchLegis_ementafull",style:`display:none;${D}`},`${S.completa} `,f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;",onclick:Q=>y(Q.currentTarget)},"menos")))}return P}let b=E=>f("p",{style:"margin:10px;text-align:center;background:#fdfbe4;color:#333;padding:5px;border-radius:5px;"},E);function i(E,C,S,L){a=C;let M=E.querySelector("#searchLegis_result");if(!M)return;let T=[];L&&T.push(b(L)),T.push(...C.map((D,Q)=>m(D,Q))),S>C.length?T.push(b(`Mostrando ${C.length} de ${S} resultados. Restrinja sua pesquisa.`)):C.length||T.push(b("Nenhum resultado encontrado :(")),M.replaceChildren(...T),M.style.display="";let P=E.querySelector("#searchLegis_load");P&&(P.style.display="none")}function g(E){let C=E.querySelector("#searchLegis_load");C&&(C.style.display="none"),t(yr)}let d=(E,C)=>E.querySelector(`#${C}`)?.value??"",h=(E,C)=>{let S=E.querySelector("#searchLegis_load");S&&(S.style.display=C?"":"none")};function x(E){let C=E?.closest(".dialogBoxDiv")??e.doc.querySelector(".dialogBoxDiv");if(!C)return;let S=d(C,"legis_anoNorma").trim();h(C,!0);let L=C.querySelector("#searchLegis_result");L&&(L.style.display="none"),c+=1;let M=c;$e(r,ye,{q:d(C,"legis_termoNorma").trim(),tipo:d(C,"legis_tipoNorma"),numero:He(d(C,"legis_numeroNorma")),ano:S,periodo:S?Ne(d(C,"legis_periodoNorma")):""}).then(T=>M===c&&i(C,T.normas,T.total),()=>M===c&&g(C))}function v(E,C,S,L,M,T){h(E,!0),c+=1;let P=c;$e(r,ye,{tipo:C,numero:S,ano:L,periodo:L?Ne(M):""}).then(({normas:D,total:Q})=>{P===c&&(h(E,!1),D.length===1&&Q<=1?(l?.(),u(D[0],T)):D.length?i(E,D,Q||D.length,`H\xE1 ${Q||D.length} normas com esse n\xFAmero. Escolha abaixo ou informe o ano.`):t(Oo))},()=>P===c&&g(E))}function A(E){let C=a[Number.parseInt(E?.getAttribute("data-legis-idx")??"",10)];if(!C)return;let S=p??void 0;l?.(),u(C,S)}function y(E){let C=E?.closest(".searchLegis_linha"),S=C?.querySelector(".searchLegis_ementa"),L=C?.querySelector(".searchLegis_ementafull");if(!S||!L)return;let M=S.style.display==="none";S.style.display=M?"":"none",L.style.display=M?"none":""}function k(E,C,S){return f("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},f("span",{},E),f("select",{id:C,style:"width:100%;"},...S.map(([L,M])=>f("option",{value:M},L))))}function w(E,C,S="text"){return f("label",{style:"display:grid;gap:2px;font-size:12px;margin-bottom:8px;"},f("span",{},E),f("input",{type:S,id:C,style:"width:100%;"}))}function _(E){let C=E??o.getInstance();if(!C)return;a=[];let S=[["federal","Legisla\xE7\xE3o Federal"],["infra","Norma Infralegal"],["lista","Lista de Normas"]],L=new Map,M=new Map,T=R=>{for(let[z]of S)L.get(z)?.setAttribute("aria-selected",String(z===R)),L.get(z)?.setAttribute("tabindex",z===R?"0":"-1"),z===R?M.get(z)?.removeAttribute("hidden"):M.get(z)?.setAttribute("hidden","")},P=f("span",{id:"searchLegis_load",style:"margin-left:10px;display:none;"},"Pesquisando..."),D={federal:f("div",{},k("Tipo de Legisla\xE7\xE3o","legis_tipoNorma",gr),w("N\xFAmero da Legisla\xE7\xE3o","legis_numeroNorma","number"),k("Per\xEDodo da Publica\xE7\xE3o","legis_periodoNorma",br),w("Ano da Publica\xE7\xE3o","legis_anoNorma","number"),w("Conte\xFAdo da Legisla\xE7\xE3o (palavras-chave)","legis_termoNorma"),f("div",{style:"text-align:right;margin-top:6px;"},f("button",{type:"button",id:"searchLegis_uiElement",class:"spro-botao",title:"Pesquisar",onclick:R=>x(R.currentTarget)},"Pesquisar"),P),f("div",{id:"searchLegis_result",style:"display:none;max-height:250px;overflow-y:auto;margin-top:15px;"})),infra:f("div",{},k("Autoridade Signat\xE1ria","legis_orgaoInfraNorma",hr),k("Tipo de Legisla\xE7\xE3o","legis_tipoInfraNorma",xr),w("N\xFAmero da Norma","legis_numeroInfraNorma","number")),lista:f("div",{},k("Nome da Legisla\xE7\xE3o","legis_nomeNorma",vr))},Q=f("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});S.forEach(([R,z],Y)=>{let G=f("button",{type:"button",role:"tab",id:`legisTab_${R}`,"aria-controls":`legisPainel_${R}`,"aria-selected":"false",class:"spro-botao",onclick:()=>T(R),onkeydown:ce=>{let ge=ce.key==="ArrowRight"?1:ce.key==="ArrowLeft"?-1:0,we=S[(Y+ge+S.length)%S.length]?.[0];!ge||!we||(T(we),L.get(we)?.focus())}},z);L.set(R,G),Q.append(G),M.set(R,f("div",{role:"tabpanel",id:`legisPainel_${R}`,"aria-labelledby":`legisTab_${R}`,hidden:""},D[R]))});let O=f("div",{class:"dialogBoxDiv",style:"min-width:480px;font-size:13px;"},Q,...M.values(),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let R=d(O,"legis_tipoNorma"),z=He(d(O,"legis_numeroNorma")),Y=d(O,"legis_tipoInfraNorma"),G=d(O,"legis_numeroInfraNorma"),ce=d(O,"legis_nomeNorma");if(R!==""&&z!=="")return v(O,R,z,d(O,"legis_anoNorma").trim(),d(O,"legis_periodoNorma"),C);if(Y!==""&&G!==""){let ge=(G.includes("/")?G.split("/")[0]??"":G).replace(/[^0-9-]+/g,"");s(d(O,"legis_orgaoInfraNorma")+Y+ge,C)}else if(ce!=="")s(ce,C);else return t("Informe o tipo e o n\xFAmero da norma, ou escolha uma norma da lista.");l?.()}},"Inserir")));p=C;let Se=H(e.doc,{titulo:"Adicionar Link de Legisla\xE7\xE3o",conteudo:O,aoFechar:()=>{c+=1,p=null}});l=()=>Se.fechar(),T("federal");let V=o.getSelectedText(C)||"",le=Qo(V),te=O.querySelector("#legis_tipoNorma");if(le&&te&&(te.value=le),/\d/.test(V)){let R=V.includes("/")?V.split("/")[0]??"":V;R=V.includes(",")?V.split(",")[0]??"":R;let z=O.querySelector("#legis_numeroNorma");z&&(z.value=/\d/.test(R)?R.replace(/\D/g,""):"");let Y=/(?:\/|\bde\s+)(\d{4})\b/.exec(V),G=O.querySelector("#legis_anoNorma");Y&&G&&(G.value=Y[1]??"")}try{let R=e.win;e.verifyOpcao("substituiselecao")&&typeof R.setChosenInCke=="function"&&R.setChosenInCke()}catch{}}return{resolverNormasLegisPro:n,sendLegisSEI:s,insertLegisSEI:A,getLegisSEI(E){let C=o.getInstance(E);C&&_(C)},getSearchLegisMore:y,getSearchLegis:x,getDialogLegisSEI:()=>{}}}};function Qe(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(r=>t.getBodyContainer(r)?.ownerDocument===o.ownerDocument)??t.getInstance()}function Oe(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function ne(e,o,t,r){let a=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[r?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return a&&e.adaptador.recusarEscrita(),a}function jo(e,o){let t=Qe(e,o);if(!t)return!1;if(e.adaptador.versao===5){let r=t,a=Oe(r,o);return!a||ne(e,t,o,a)?!1:(r.model.change(l=>l.setSelection(a)),r.execute("unlink"),!0)}return ne(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Bo(e,o,t,r){let a=Qe(e,o);if(!a)return!1;if(e.adaptador.versao===5){let l=a,c=Oe(l,o);return!c||ne(e,a,o,c)?!1:(l.model.change(p=>{p.setSelection(c),l.model.insertContent(p.createText(t,{linkHref:r}))}),!0)}return ne(e,a,o,null)?!1:(e.adaptador.withEdit(a,()=>{o.setAttribute("href",r),o.setAttribute("data-cke-saved-href",r),o.textContent=t}),!0)}function ze(e,o){let t=0,r=[];for(let{a:l,texto:c}of o){let p=Qe(e,l);if(p)if(e.adaptador.versao===5){let n=Oe(p,l);if(!n||ne(e,p,l,n))continue;r.push({a:l,texto:c,intervalo:n,ed:p})}else{if(ne(e,p,l,null))continue;l.textContent=c,t+=1}}let a=r[0]?.ed;return a&&a.model.change(l=>{for(let{a:c,texto:p,intervalo:n}of[...r].reverse())l.remove(n),l.insertText(p,{linkHref:c.getAttribute("href")??""},n.start),t+=1}),t}var kr="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Fo=new WeakMap,Cr=e=>{let o=Fo.get(e);if(o)return o;let t={balao:null};return Fo.set(e,t),t},Ar=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function Vo(e){let o=Cr(e),t=i=>I(e.doc,i);function r(i){let g=o.balao;if(g){if(!i){let d=!1;try{d=g.el.matches(":hover")}catch{d=!1}if(d)return}g.el.remove(),o.balao=null}}function a(){if(o.balao)return o.balao.link;let i=e.adaptador.getInstance();return(i?e.adaptador.getSelectionElement(i):null)?.closest("a[href]")??null}async function l(i){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(i),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function c(i,g){r(!0);let d=i?.closest?.("a[href]"),h=d?.getAttribute("href")??"";if(!d||!B(h))return;let x=f("a",{href:h,target:"_blank",rel:"noopener noreferrer",title:d.textContent??"",style:"color:inherit;text-decoration:underline;"},f("strong",{},Ar(h))),v=(k,w,_)=>f("button",{type:"button",class:k,title:w,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:_},w),A=f("div",{class:"linkDisplayPro",style:kr},x,v("spro-copiar","Copiar",()=>void l(h)),v("spro-editar","Editar",()=>s()),v("spro-remover","Remover",()=>p()));e.doc.body.append(A),o.balao={el:A,link:d};let y=d.getBoundingClientRect?.();if(y){let k=d.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),w=A.getBoundingClientRect?.().width??0,_=Math.max(8,Math.min(y.left+(k?.left??0),(e.win.innerWidth||0)-w-8));A.style.left=`${_}px`,A.style.top=`${y.bottom+(k?.top??0)+4}px`}}function p(i,g){let d=a();d&&(jo(e,d),r(!0))}function n(i,g){let d=a()?.getAttribute("href");d&&B(d)&&e.win.open(d,"_blank","noopener,noreferrer")}function u(i,g){let d=a()?.getAttribute("href");d&&l(d)}function s(){let i=a();if(!i)return;let g=f("input",{type:"text",id:"linkProNome"}),d=f("input",{type:"text",id:"linkProUrl"});g.value=i.textContent??"",d.value=i.getAttribute("href")??"";let h=H(e.doc,{titulo:"Editar link",conteudo:W(j("Texto vis\xEDvel:",g),j("URL:",d),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let x=d.value.trim(),v=g.value.trim()||x;if(x==="")return t("Digite um link");if(De.test(x))return t("O link informado \xE9 inv\xE1lido.");Bo(e,i,v,x)&&(r(!0),h.fechar())}},"Salvar")))})}function m(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",i=>{let g=i.target;if(!g||o.balao?.el.contains(g))return;let d=g.closest?.("a[href]");d&&g.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?c(d):r(!1)},!0)}return{globais:{showLinkTips:c,hideLinkTips:i=>r(!1),openLinkPro:n,removeLinkPro:p,copyLinkPro:u,editLinkPro:i=>s(),openDialogLinkPro:s,getDialogLinkPro:()=>{}},iniciar:m}}var Uo={id:"link-pro",globais:e=>Vo(e).globais,iniciar:e=>Vo(e).iniciar()};var Sr=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function Go(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,r,a]=[Number(o[1]),Number(o[2]),Number(o[3])],l=new Date(t,r-1,a);return l.getFullYear()!==t||l.getMonth()!==r-1||l.getDate()!==a?"":`${a} de ${Sr[r-1]} de ${t}`}function je(e){let o=h=>q(h),t=h=>h!=="",r=t(e.nome)?`, ${o(ee(e.nome.trim()))}`:"",a=o(e.sobrenome.toUpperCase()),l=t(e.titulo)?`. <strong>${o(ee(e.titulo.trim()))}</strong>`:"",c=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",p=t(e.local)?`, ${o(ee(e.local.trim()))}`:"",n=t(e.editora)?`: ${o(ee(e.editora.trim()))}`:"",u=t(e.ano)?`, ${o(e.ano)}`:"",s=t(e.volume)?`, v. ${o(e.volume)}`:"",m=t(e.paginas)?`. p.${o(e.paginas)}`:"",b=t(e.link)&&B(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",i=Go(e.data),g=i?`. Acesso em: ${i}`:"",d=a+r+l+c+p+n+u+s+m+b+g;return d===""?"":`${d}.`}function X(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function ae(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Fe="ntRodape_item",oe="ntRodape_footer",Ko=".ntRodape_item, .ntRodape, .ntRodape_tr",Wo='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function Xo(e,o){let t=q(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function Yo(e){let o=q(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function Zo(e,o=new Set){let t=new Map,r=0;for(let c of e)c.tipo==="item"&&(r+=1,t.set(c.ref,r));let a=[],l=[];for(let c of e){if(c.tipo!=="footer")continue;let p=t.get(c.ref);p!==void 0?a.push({ref:c.ref,chave:p}):o.has(c.ref)?a.push({ref:c.ref,chave:Number.isFinite(c.numero)?c.numero:Number.MAX_SAFE_INTEGER}):l.push(c.ref)}return a.sort((c,p)=>c.chave-p.chave),{numeroDe:t,ordem:a.map(c=>c.ref),orfaos:l}}var Be=e=>e.getAttribute("data-ntrodape-ref")??"";function et(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${Fe}[data-ntrodape-ref]`)),r=Array.from(e.querySelectorAll("p.ntRodape")).filter(p=>p.querySelector(`.${oe}[data-ntrodape-ref]`)),a=p=>Number.parseInt(p.querySelector(`.${oe}`)?.getAttribute("data-ntrodape")??"",10),l=Zo([...t.map(p=>({tipo:"item",ref:Be(p)})),...r.map(p=>({tipo:"footer",ref:Be(p.querySelector(`.${oe}`)),numero:a(p)}))],o);t.forEach((p,n)=>{p.setAttribute("data-ntrodape",String(n+1)),p.textContent=`[${n+1}]`});let c=new Map;for(let p of r){let n=Be(p.querySelector(`.${oe}`)),u=l.numeroDe.get(n),s=p.querySelector(`.${oe}`);u!==void 0&&(s.setAttribute("data-ntrodape",String(u)),s.textContent=`[${u}]`),p.remove(),c.set(n,p)}for(let p of l.ordem){let n=c.get(p);n&&e.append(n)}if(!l.ordem.length)for(let p of e.querySelectorAll(".ntRodape_tr"))p.remove();return l}function ot(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${Fe}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var Jo=e=>e.getAttribute?.("htmlSpan")?.classes??[],wr=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function tt(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let r of e.createRangeIn(o).getItems())if(r.is("$textProxy")||r.is("$text")){let a=Jo(r);a.includes(Fe)?(t.itens.push(r),t.textos.push({no:r,tipo:"item"})):a.includes(oe)&&t.textos.push({no:r,tipo:"rodape"})}else if(r.is("element")&&r.parent===o){let a=wr(r);if(a.includes("ntRodape_tr"))t.separadores.push(r);else if(a.includes("ntRodape")){let c=Array.from(e.createRangeIn(r).getItems()).find(p=>(p.is("$textProxy")||p.is("$text"))&&Jo(p).includes(oe))?.getAttribute("htmlSpan")?.attributes??{};c["data-ntrodape-ref"]&&t.rodapes.push({bloco:r,ref:c["data-ntrodape-ref"],numero:Number.parseInt(c["data-ntrodape"],10)})}}return t}function Tr(e,o,t){let r=o.getAttribute("htmlSpan")??{},a=`[${t}]`;if(o.data===a&&r.attributes?.["data-ntrodape"]===String(t))return;let l=Object.fromEntries(o.getAttributes());l.htmlSpan={...r,attributes:{...r.attributes,"data-ntrodape":String(t)}};let c=e.createRangeOn(o),p=c.start;e.remove(c),e.insertText(a,l,p)}function rt(e,o,t=new Set){let r={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(a=>{let l=tt(a,o),c=u=>u.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";r=Zo([...l.itens.map(u=>({tipo:"item",ref:c(u)})),...l.rodapes.map(u=>({tipo:"footer",ref:u.ref,numero:u.numero}))],t);let p=[],n=0;for(let u of l.textos)if(u.tipo==="item")n+=1,p.push({no:u.no,n});else{let s=r.numeroDe.get(c(u.no));s!==void 0&&p.push({no:u.no,n:s})}for(let u of[...p].reverse())Tr(a,u.no,u.n);for(let u of r.orfaos){let s=l.rodapes.find(m=>m.ref===u);s&&a.remove(a.createRangeOn(s.bloco))}for(let u of r.ordem){let s=l.rodapes.find(m=>m.ref===u);s&&a.move(a.createRangeOn(s.bloco),a.createPositionAt(o,"end"))}if(!r.ordem.length)for(let u of l.separadores)a.remove(a.createRangeOn(u))}),r}function nt(e,o){e.model.change(t=>{let r=tt(t,o),a=[...r.itens,...r.rodapes.map(l=>l.bloco),...r.separadores];for(let l of[...a].reverse())t.remove(t.createRangeOn(l))})}function me(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let r=e.editing.view.document.getRoot(t.rootName);if(r&&e.editing.view.domConverter.mapViewToDom(r)===o)return t}catch{}return null}function at(e,o,t){let r=new Set;for(let a of Array.from(e.model.document.roots??[]))if(!(!a||a===o||a.rootName==="$graveyard"))for(let l of t(e.data.get({rootName:a.rootName})))r.add(l);return r}var _r='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',it=new WeakSet;function Mr(e,o){let t=e.querySelector(`[name="${o}"], [id="${o}"]`);if(t)return t;let r=/^(item|footer)_(.+)$/.exec(o);return r?e.querySelector(`.ntRodape_${r[1]}[data-ntrodape-ref="${r[2]}"]`):null}function J(e){let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||it.has(t)||(it.add(t),t.addEventListener("click",r=>{let a=r.target?.closest?.(_r);if(!a)return;let l=Mr(t,(a.getAttribute("href")??"").slice(1));(l?.closest("p")??l)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var Lr=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],st={id:"nota-rodape",globais(e){let o=e.adaptador,t=d=>I(e.doc,d),r=d=>o.getBodyContainer(d),a=d=>o.findInBody(d,Ko).length>0;function l(d,h){let x=o.versao===5?ae(e,h):o.somenteLeitura(d);return x&&o.recusarEscrita(),x}function c(d){let h=e.doc.createElement("div");return h.append(...Z(e.doc,d)),Array.from(h.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(x=>x.getAttribute("data-ntrodape-ref")??"")}function p(d){if(o.versao===5){let h=me(d,r(d));h&&rt(d,h,at(d,h,c))}else{let h=r(d);h&&et(h)}}function n(d){let x=typeof d=="object"&&d!==null&&("model"in d||o.getAllInstances().includes(d))?d:o.getInstance();if(!x)return;let v=o.versao===5?me(x,r(x)):null;l(x,v)||o.withEdit(x,()=>p(x))}function u(d){let h=d??o.getInstance();if(h){if(!a(h)){t("O documento n\xE3o tem notas de rodap\xE9.");return}n(h),J(e),t("Notas de rodap\xE9 atualizadas com sucesso")}}function s(d,h){let x=h??o.getInstance();if(!x)return;if(!a(x)){t("O documento n\xE3o tem notas de rodap\xE9.");return}let v=o.versao===5?me(x,r(x)):null;l(x,v)||(o.withEdit(x,()=>{if(o.versao===5)nt(x,v);else{let A=r(x);A&&ot(A)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function m(d,h){let x=h??o.getInstance();if(!x||d.trim()==="")return;let v=o.versao===5?me(x,r(x)):null;if(o.versao===5&&!v||l(x,v))return;let A=K(16);o.withEdit(x,()=>{if(o.versao===5){let y=x;y.model.document.selection.getFirstPosition()?.root!==v&&y.model.change(k=>k.setSelection(v,"end"))}o.findInBody(x,".ntRodape_tr").length||o.appendToBody(x,Wo),o.appendToBody(x,Xo(A,d)),o.insertHtml(x,Yo(A)),p(x)}),J(e)}function b(d){let h=x=>(d.querySelector(`#${x}`)?.value??"").toString();return Object.fromEntries(Lr.map(([x,v])=>[x,h(v)]))}function i(d){let h=d??e.doc,x=h.querySelector("#nrABNTResult");x&&x.replaceChildren(...Z(e.doc,je(b(h))))}function g(d){let h=d??o.getInstance();if(!h)return;let x=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],v=new Map,A=new Map,y=null,k=T=>{for(let[P]of x){let D=P===T;A.get(P)?.setAttribute("aria-selected",String(D)),A.get(P)?.setAttribute("tabindex",D?"0":"-1"),D?v.get(P)?.removeAttribute("hidden"):v.get(P)?.setAttribute("hidden","")}y&&(T==="livre"||T==="abnt"?y.removeAttribute("hidden"):y.setAttribute("hidden",""))},w=f("textarea",{id:"textNotaRodape",rows:"3",style:"width:100%;"}),_=(T,P,D="text")=>f("label",{style:"display:grid;gap:2px;font-size:12px;color:#555;"},f("span",{},T),f("input",{type:D,id:P,style:"width:100%"})),E=f("div",{id:"nrABNTResult",style:"margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"}),C=f("div",{style:"display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;"},_("Nome do autor","nr_Nome"),_("Sobrenome do autor","nr_Sobrenome"),f("div",{style:"grid-column:1 / span 2;"},_("T\xEDtulo da publica\xE7\xE3o","nr_Titulo")),_("N\xFAmero da edi\xE7\xE3o","nr_Edicao","number"),_("Ano da publica\xE7\xE3o","nr_Ano","number"),_("Local (cidade)","nr_Local"),_("Nome da editora","nr_Editora"),_("N\xFAmero do volume","nr_Volume","number"),_("P\xE1ginas inicial-final","nr_Paginas"),_("Link da publica\xE7\xE3o","nr_Link"),_("Data do acesso","nr_Data","date"),f("div",{style:"grid-column:1 / span 2;"},E)),S={livre:f("div",{},f("label",{for:"textNotaRodape",style:"font-size:12px;color:#555;"},"Texto da nota de rodap\xE9:"),w),abnt:C,atualizar:f("div",{style:"padding:10px 0;display:grid;gap:10px;"},f("p",{},"Atualiza numera\xE7\xF5es e ordem das notas de rodap\xE9 j\xE1 existentes no documento."),f("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>u(h)},"Atualizar")),remover:f("div",{style:"padding:10px 0;display:grid;gap:10px;"},f("p",{},"Remove todas as notas de rodap\xE9 do documento (Ctrl+Z desfaz)."),f("button",{type:"button",id:"btnNrRemove",class:"spro-botao",onclick:()=>{s(null,h),M.fechar()}},"Remover todas"))},L=f("div",{role:"tablist",style:"display:flex;gap:4px;border-bottom:1px solid #ccc;margin-bottom:10px;"});x.forEach(([T,P],D)=>{let Q=f("button",{type:"button",role:"tab",id:`ntTab_${T}`,"aria-controls":`ntPainel_${T}`,"aria-selected":"false",class:"spro-botao",onclick:()=>k(T),onkeydown:Se=>{let V=Se,le=V.key==="ArrowRight"?1:V.key==="ArrowLeft"?-1:0,te=x[(D+le+x.length)%x.length]?.[0];!le||!te||(k(te),A.get(te)?.focus())}},P);A.set(T,Q),L.append(Q);let O=f("div",{role:"tabpanel",id:`ntPainel_${T}`,"aria-labelledby":`ntTab_${T}`,hidden:""},S[T]);v.set(T,O)}),y=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let T=(E.textContent??"").trim()?je(b(C)):"",P=w.value.trim(),D=T||q(P).replace(/\r?\n/g,"<br>");if(!D){t("Digite o texto da nota de rodap\xE9.");return}m(D,h),M.fechar()}},"Inserir");for(let T of C.querySelectorAll("input"))T.addEventListener("input",()=>i(C)),T.addEventListener("change",()=>i(C));let M=H(e.doc,{titulo:"Inserir nota de rodap\xE9",conteudo:f("div",{style:"min-width:480px;font-size:13px;"},L,...v.values(),f("div",{class:"spro-dialogo-rodape"},y))});k("livre")}return{getNotaRodape(d){let h=o.getInstance(d);h&&g(h)},getDialogNotaRodape:()=>{},openDialogNotaRodape:g,removeNtRodape:s,updateNrABNT:i,insertNtRodape:m,updateNtRodape:u,reorderNtRodape:n}},iniciar(e){J(e)}};function Ee(e,o,t,r){let a=e.adaptador.getInstance(o);if(!a)return;let l=e.adaptador.getSelectionParagraph(a);if(l){if(e.adaptador.somenteLeitura(a)){e.adaptador.recusarEscrita();return}e.adaptador.withEdit(a,()=>{e.adaptador.insertHtmlBefore(a,l,t),r?.(a,l)})}}var qr='<div class="pageBreakPro" style="page-break-after: always"></div>',lt={id:"page-break",globais:e=>({getPageBreak:o=>Ee(e,o,qr)})};function ct(e,o,t){let r=e.jQuery,a=r?.(o).qrcode;if(!r||typeof a!="function")return null;o.replaceChildren();try{r(o).qrcode?.(t)}catch{return o.replaceChildren(),null}return o.querySelector("img, canvas")}var fe={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},Pr=[["QrPro-size","px"],["QrPro-minversion",""],["QrPro-quiet"," m\xF3dulos"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],Rr=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],Ir=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],Dr=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],dt={id:"qr-code",globais(e){let o=e.adaptador,t=y=>I(e.doc,y),r=y=>e.doc.querySelector(y),a=y=>r(`#${y}`)?.value??"",l=()=>e.win.NAMESPACE_SPRO??"SEI Pro",c=()=>`${e.base}icons/menu/seipro.png`,p=(y,k,w)=>f("div",{style:"display:grid;gap:2px;"},f("label",{for:k},y),w),n=(y,k,w,_)=>f("input",{id:y,type:"range",value:fe[y]??"",min:String(k),max:String(w),step:String(_)});function u(){let y=f("div",{id:"optionsQrAdvanced",style:"display:none;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;font-size:12px;"},p("Tamanho do QR: 140px","QrPro-size",n("QrPro-size",100,500,50)),p("Cor de Preenchimento","QrPro-fill",f("input",{id:"QrPro-fill",type:"color",value:fe["QrPro-fill"]??""})),p("Cor de Fundo","QrPro-background",f("div",{},f("input",{id:"QrPro-background",type:"color",value:fe["QrPro-background"]??""}),f("label",{style:"margin-left:12px;"},f("input",{id:"QrPro-background-transparent",type:"checkbox"})," Transparente"))),p("Vers\xE3o: 6","QrPro-minversion",n("QrPro-minversion",1,10,1)),p("N\xEDvel de corre\xE7\xE3o de erros","QrPro-eclevel",f("select",{id:"QrPro-eclevel"},...Dr.map(([k,w])=>f("option",{value:k},w)))),p("Margens de folga: 1 m\xF3dulos","QrPro-quiet",n("QrPro-quiet",0,4,1)),p("Raio de canto: 50%","QrPro-radius",n("QrPro-radius",0,50,10)),p("Modo","QrPro-mode",f("select",{id:"QrPro-mode"},...Ir.map(([k,w])=>f("option",{value:k},w)))),f("div"),f("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Tamanho da etiqueta: 20%","QrPro-msize",n("QrPro-msize",0,40,1)),p("Posi\xE7\xE3o X: 50%","QrPro-mposx",n("QrPro-mposx",0,100,1)),p("Posi\xE7\xE3o Y: 50%","QrPro-mposy",n("QrPro-mposy",0,100,1)))),f("div",{class:"QrMode-etiqueta",style:"display:none;grid-column:1 / span 3;"},f("div",{style:"display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 14px;"},p("Nome da fonte","QrPro-font",f("select",{id:"QrPro-font"},...Rr.map(k=>f("option",{value:k},k)))),p("Cor da fonte","QrPro-fontcolor",f("input",{id:"QrPro-fontcolor",type:"color",value:fe["QrPro-fontcolor"]??""})),p("Etiqueta","QrPro-label",f("input",{id:"QrPro-label",type:"text",value:l()})))),f("div",{class:"QrMode-imagem",style:"display:none;grid-column:1 / span 3;"},p("Imagem","QrPro-image",f("input",{id:"QrPro-image",type:"file",accept:"image/*"})),f("img",{id:"QrPro-img-buffer",style:"display:none",src:c(),alt:""}))),f("a",{id:"QrPro-reset",class:"linkDialog",role:"button",tabindex:"0",style:"margin-top:14px;display:block;cursor:pointer;",onclick:()=>m()},"Resetar configura\xE7\xF5es"));return f("div",{id:"qrCodeLab"},f("div",{style:"text-align:right;"},f("a",{id:"toggleOptionsQR",class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>s()},"Op\xE7\xF5es avan\xE7adas ")),f("div",{style:"display:grid;gap:10px;"},y,f("div",{id:"qrCodeResult",style:"text-align:center;margin:10px 0;min-width:180px;"})))}function s(){let y=r("#optionsQrAdvanced");y&&(y.style.display=y.style.display==="none"?"":"none")}function m(){for(let[w,_]of Object.entries(fe)){let E=r(`#${w}`);E&&(E.value=_)}let y=r("#QrPro-label");y&&(y.value=l());let k=r("#QrPro-background-transparent");k&&(k.checked=!1,k.removeAttribute("checked")),r("#QrPro-img-buffer")?.setAttribute("src",c()),x()}function b(y){r("#tipQrCodeUrl")?.remove();let k=r("#toggleOptionsQR");if(y===""||!B(y)||y.length<=50||!k)return;let w=r(".getTinyUrlButtom span")?.getAttribute("style")??"",_=f("span",{id:"tipQrCodeUrl",style:"display:block;margin-bottom:8px;padding:5px 8px 8px 8px;background:#f9f9dc;color:#333;border-radius:5px;"},"Dica: Experimente ",f("a",{class:"linkDialog",role:"button",tabindex:"0",style:"cursor:pointer;color:inherit;text-decoration:underline;",onclick:()=>g()},f("span",{style:`width:16px;height:16px;display:inline-block;${w}`}),"Gerar link curto do TinyURL"));(k.parentElement??k).before(_)}function i(y){let k=r("#qrCodeText");k&&(k.value=y),x()}function g(){let y=a("qrCodeText").trim(),k=e.win.ajaxTinyUrl;if(typeof k!="function"){t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");return}Promise.resolve(k(y,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function d(){for(let[y,k]of Pr){let w=r(`label[for="${y}"]`);w&&(w.textContent=(w.textContent??"").replace(/:.*/,`: ${a(y)}${k}`))}}function h(y){let k=w=>Number.parseInt(a(w),10);return{render:"image",ecLevel:a("QrPro-eclevel"),minVersion:k("QrPro-minversion"),fill:a("QrPro-fill"),background:r("#QrPro-background-transparent:checked")?null:a("QrPro-background"),text:y,size:k("QrPro-size"),radius:k("QrPro-radius")*.01,quiet:k("QrPro-quiet"),mode:k("QrPro-mode"),mSize:k("QrPro-msize")*.01,mPosX:k("QrPro-mposx")*.01,mPosY:k("QrPro-mposy")*.01,label:a("QrPro-label"),fontname:a("QrPro-font"),fontcolor:a("QrPro-fontcolor"),image:r("#QrPro-img-buffer")}}function x(){let y=r("#qrCodeResult");if(!y)return;y.replaceChildren();for(let _ of e.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))_.style.display="none";d();let k=a("QrPro-mode");if(k==="1"||k==="2")for(let _ of e.doc.querySelectorAll(".QrMode-etiqueta"))_.style.display="";else if(k==="3"||k==="4")for(let _ of e.doc.querySelectorAll(".QrMode-imagem"))_.style.display="";let w=a("qrCodeText");w!==""&&!ct(e.win,y,h(w))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),b(w)}function v(y,k){let w=k??o.getInstance();if(!w)return;let _=r("#qrCodeResult img")?.getAttribute("src")??"";if(!/^data:image\/(png|jpeg|gif|webp);base64,/i.test(_)){t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto.");return}o.withEdit(w,()=>o.insertHtml(w,`<img src="${q(_)}" alt="${q(y)}">`))}function A(y){let k=y??o.getInstance();if(!k)return;let w=f("input",{type:"text",id:"qrCodeText",style:"width:100%;box-sizing:border-box;margin:6px 0 10px 0;"}),_=String(e.win.getSelection?.()??"").trim();_&&(w.value=_),w.addEventListener("input",()=>x()),w.addEventListener("change",()=>x());let E=u();for(let S of["input","change"])E.querySelector("#optionsQrAdvanced")?.addEventListener(S,()=>x());E.querySelector("#QrPro-image")?.addEventListener("change",S=>{let L=S.target.files?.[0];if(!L)return;let M=new FileReader;M.onload=()=>{let T=String(M.result??"");if(!/^data:image\//i.test(T)){t("Escolha um arquivo de imagem.");return}r("#QrPro-img-buffer")?.setAttribute("src",T);let P=r("#QrPro-mode");P&&(P.value="4"),setTimeout(x,200)},M.readAsDataURL(L)});let C=H(e.doc,{titulo:"Gerar C\xF3digo QR",conteudo:f("div",{style:"min-width:560px;max-width:100%;font-size:13px;"},f("label",{for:"qrCodeText"},"Insira o texto que deseja codificar:"),w,E,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let S=w.value.trim();if(!S){t("Digite o texto a codificar");return}v(S,k),C.fechar()}},"Inserir")))});_&&x()}return{getQrCode(y){let k=o.getInstance(y);k&&A(k)},getDialogQrCode:()=>{},openDialogQrCode:A,buildHtmlQrCodeLab:u,resetOptionsQR:m,toggleOptionsQR:s,tipQrCodeUrl:b,setInputTinyUrl:i,convertTinyURL:g,updateQrCode:x,setQrCode:v}}};var ut=5,pt=5,mt=49,F=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function $r(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let r=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(r)return r;for(let a=e?.previousElementSibling??null;a;a=a.previousElementSibling)if(a.classList.contains("divQuickTable"))return a;return o.querySelector(".divQuickTable")}var ft={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let s of e.doc.querySelectorAll(".divQuickTable"))s.replaceChildren(),xe(s);for(let s of e.doc.querySelectorAll(".getQuickTableButtom"))s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")}function r(s){if(!s)return;let m=F(s,"data-row"),b=F(s,"data-col"),i=s.closest("table");if(!i)return;for(let h of i.querySelectorAll("td"))h.classList.remove("td_hover");let g=()=>[...i.querySelectorAll("tr")];if(m>=3&&F(g().at(-1)?.querySelector("td"),"data-row")>m+1&&(g().at(-1)?.remove(),i.setAttribute("data-row",String(F(i,"data-row")-1))),b>=3&&F(g().at(-1)?.lastElementChild,"data-col")>b+1){for(let h of g())h.lastElementChild?.remove();i.setAttribute("data-col",String(F(i,"data-col")-1))}for(let h of i.querySelectorAll("td"))F(h,"data-row")<=m&&F(h,"data-col")<=b&&h.classList.add("td_hover");let d=s.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(d&&(d.textContent=`Tabela ${m+1}x${b+1}`),m===F(i,"data-row")&&m<mt){let h=g().at(-1)?.cloneNode(!0);h&&(h.querySelectorAll("td").forEach((x,v)=>{x.setAttribute("data-row",String(m+1)),x.setAttribute("data-col",String(v)),x.classList.remove("td_hover")}),(i.querySelector("tbody")??i).append(h),i.setAttribute("data-row",String(m+1)))}if(b===F(i,"data-col")&&b<mt){for(let h of g()){let x=h.lastElementChild?.cloneNode(!0);x&&(x.setAttribute("data-col",String(b+1)),x.classList.remove("td_hover"),h.append(x))}i.setAttribute("data-col",String(b+1))}}function a(){let s=e.doc,m=s.createDocumentFragment(),b=s.createElement("div");b.className="quickTableInfo",b.textContent="Inserir Tabela";let i=s.createElement("table");i.setAttribute("data-row",String(ut-1)),i.setAttribute("data-col",String(pt-1));for(let d=0;d<ut;d+=1){let h=s.createElement("tr");for(let x=0;x<pt;x+=1){let v=s.createElement("td");v.setAttribute("data-row",String(d)),v.setAttribute("data-col",String(x)),h.append(v)}i.append(h)}let g=d=>r(d.target?.closest("td")??null);return i.addEventListener("mouseover",g),i.addEventListener("mouseout",g),i.addEventListener("click",d=>{let h=d.target?.closest("td");h&&u(h)}),m.append(b,i),m}function l(s){if(!s)return;let m=$r(s,e.doc);s.classList.contains("cke_button_on")?(t(),s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")):(m&&(m.replaceChildren(a()),he(m)),s.classList.remove("cke_button_off"),s.classList.add("cke_button_on"))}function c(s){let m=s?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),b=m?[...m.querySelectorAll(".getTablestylesButtom")]:[];b.length||(b=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let i of b)i.classList.remove("cke_button_disabled")}function p(s,m){let b='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';b+="  <tbody>";for(let i=0;i<=s;i+=1){b+="      <tr>";for(let g=0;g<=m;g+=1)b+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';b+="      </tr>"}return`${b}  </tbody></table>`}function n(s,m){let b=m?m.nextElementSibling:o.getBodyContainer(s)?.lastElementChild,i=b?.tagName==="TABLE"?b.querySelector("td p"):null;if(!i)return;let g=i.ownerDocument,d=g.defaultView?.getSelection?.();if(!d)return;let h=g.createRange();h.setStart(i.firstChild??i,0),h.collapse(!0),d.removeAllRanges(),d.addRange(h)}function u(s){let m=o.getInstance(s);if(!m){t();return}let b=p(F(s,"data-row"),F(s,"data-col")),i=o.getSelectionParagraph(m);o.withEdit(m,()=>{if(!i)return o.insertHtml(m,b);let g=i.nextElementSibling;g?o.insertHtmlBefore(m,g,b):o.appendToBody(m,b)}),t(),c(s),n(m,i)}return{getQuickTable:l,quickTableOver:r,hideQuickTable:t,quickTableClick:u}}};function ke(e,o,t,r,a){let l=e.adaptador;if(l.versao===5){let p=X(o,t);return p&&ae(e,p)?(l.recusarEscrita(),!1):t.id?!0:!!e.win.SeiProGhs?.setAtributos(t,{id:r},o)}if(l.somenteLeitura(o))return l.recusarEscrita(),!1;if(a)for(let p of t.querySelectorAll(`a.${a}`))p.remove();let c=t.ownerDocument.createElement("a");return c.setAttribute("name",r),a&&(c.className=a),t.prepend(c),!0}function Ce(e,o,t=!1){if(t&&e.id)return e.id;let r=e.querySelector(`a[name^="${o}"]`);return r?r.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var Nr=[1,2,3,4],Ve=["Paragrafo_Numerado_Nivel","Item_Nivel"];function gt(e){let o=Ve.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let r of o)r.fill(0);return{item:""}}for(let r=0;r<Ve.length;r+=1)for(let a of Nr){if(t!==`${Ve[r]}${a}`)continue;let l=o[r];l[a-1]=(l[a-1]??0)+1;for(let c=a;c<4;c+=1)l[c]=0;return{item:l.slice(0,a).join(".")}}return{item:""}})}var ie="RefPro_",Hr="refpro",bt=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,ht={id:"ref-interna",globais(e){let o=e.adaptador,t=s=>I(e.doc,s);function r(s){let m=s??o.getInstance();if(!m)return!1;let b=o.findInBody(m,"p");if(!b.length)return!1;let i=gt(b.map(d=>({classe:(d.getAttribute("class")??"").trim()}))),g=[];return b.forEach((d,h)=>{let x=i[h]?.item;if(!x)return;let v=Ce(d,ie,o.versao===5),A=v?.startsWith(ie)?v.slice(ie.length):v??K(16);g.push({ref:A,nome:v??`${ie}${A}`,item:x,text:d.textContent??"",ancorado:!!v,el:d})}),g}function a(s,m){let b=new Set(m.filter(i=>i.ancorado&&!i.nome.startsWith(ie)).map(i=>i.nome));return o.findInBody(s,'a[href^="#"]').filter(i=>(i.getAttribute("href")??"").startsWith(`#${ie}`)||b.has((i.getAttribute("href")??"").slice(1))&&/^\[[^\]]*\d[^\]]*\]$/.test((i.textContent??"").trim()))}function l(s,m,b){let i=r(s),g=[];if(!i)return{mudar:g,perdidas:0};let d=a(s,i);if(!d.length)return{mudar:g,perdidas:0};let h=new Map(i.filter(v=>v.ancorado).map(v=>[v.nome,v.item])),x=0;for(let v of d){let A=h.get((v.getAttribute("href")??"").slice(1));if(A===void 0){x+=1;continue}let y=bt(m,b,A);(v.textContent??"")!==y&&g.push({a:v,texto:y})}return{mudar:g,perdidas:x}}function c(s,m,b){let{mudar:i,perdidas:g}=l(s,m,b),d=0;return i.length&&o.withEdit(s,()=>d=ze(e,i)),{atualizadas:d,perdidas:g}}function p(s,m,b){let i,g,d;typeof s=="string"||s===void 0?(i=o.getInstance(),g=s??"",d=m===!0):(i=s,g=typeof m=="string"?m:"",d=b===!0),i&&c(i,g,d)}function n(s){let m=o.getInstance(s);if(!m)return;let b=r(m);if(!b||b.length===0){t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");return}let i=f("input",{type:"text",id:"prefixo",style:"width:70%"}),g=f("input",{type:"checkbox",id:"hidePrefix"}),d=f("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(10,b.length)),style:"width:100%"},...b.map(v=>{let A=v.text.trim(),y=A.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return f("option",{value:`${v.ref}-${v.item}`},`${v.item}. ${y}${y.length<A.length?"...":""}`)})),h=()=>g.matches(":checked")||i.value.trim()==="",x=H(e.doc,{titulo:"Inserir refer\xEAncia interna",conteudo:f("div",{style:"display:grid;gap:12px;min-width:420px;font-size:13px;"},f("label",{style:"display:grid;gap:4px;"},f("span",{},"Prefixo:"),i),f("label",{},g," N\xE3o utilizar prefixo"),f("label",{style:"display:grid;gap:4px;"},f("span",{},"Par\xE1grafo numerado:"),d),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:v}=c(m,i.value,h());J(e),t(v?`Refer\xEAncias atualizadas. ${v} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let v=b.filter(A=>[...d.querySelectorAll("option")].some(y=>y.value===`${A.ref}-${A.item}`&&y.selected));if(!v.length){t("Selecione ao menos um par\xE1grafo numerado.");return}u(m,v,i.value,h())&&x.fechar()}},"Inserir")))})}function u(s,m,b,i){if(o.somenteLeitura(s))return o.recusarEscrita(),!1;let g=m.filter(v=>v.el.isConnected);if(!g.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let d=g.map(v=>`<a href="#${q(v.nome)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${q(bt(b,i,v.item))}</a>`),h=d.length>1?`${d.slice(0,-1).join(", ")} e ${d.at(-1)}`:d[0]??"",x=!1;return o.withEdit(s,()=>{let{mudar:v}=l(s,b,i);v.length&&ze(e,v);for(let A of g)if(!A.ancorado&&!ke(e,s,A.el,A.nome,Hr))return;o.insertHtml(s,` ${h} `),x=!0}),J(e),x}return{getRefInterna:n,updateRefsInternas:p,getNiveisParagrafos:r,clickScroolToRef:()=>J(e)}},iniciar(e){J(e)}};var Qr='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',Or="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",xt={id:"session-break",globais:e=>({getSessionBreak:o=>Ee(e,o,Qr,(t,r)=>{if(e.adaptador.versao!==5)return;let a=t,l=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,c=X(a,r)?.previousSibling;l&&c?.name==="paragraph"&&l.setModelHtmlStyles("p",{"counter-reset":Or},c)})})};var vt=["seiSlim","seiSlim_parent","seiSlim_view"],yt={id:"style-editor",globais(e){let o=()=>[...e.doc.querySelectorAll(".getNewStyleButton")],t=a=>{for(let l of o())l.classList.add(a?"cke_button_on":"cke_button_off"),l.classList.remove(a?"cke_button_off":"cke_button_on")};function r(a){if(a==="set"){e.win.localStorage.setItem("seiSlim_editor","true");for(let l of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...vt)}else e.win.localStorage.removeItem("seiSlim_editor"),e.doc.body.classList.remove(...vt)}return{getBoxStyleEditor(a){e.win.localStorage.getItem("seiSlim_editor")?(t(!1),r("remove")):(t(!0),r("set"))},updateStyleEditor:r}}};var zr="seipro-bookmark",Et="bookmark-",jr=e=>e.replace(/^\./,""),kt={id:"sumario",globais(e){let o=e.adaptador,t=n=>I(e.doc,n);function r(n){let u=new Set;for(let s of o.findInBody(n,"p")){let m=(s.getAttribute("class")??"").trim().split(/\s+/)[0];m&&u.add(m)}return[...u]}function a(n,u,s){let m=n.map(b=>f("option",{value:`.${b}`,...b===s?{selected:"selected"}:{}},b));return u?[f("option",{value:""},"(nenhum)"),...m]:m}function l(n,u,s){let m=e.doc.querySelector(`select#${u}`);m&&m.replaceChildren(...s.map(([b,i])=>f("option",{value:i},b)))}function c(n,u,s){let m=s??o.getInstance();if(!m)return!1;let b=new Set(u.map(jr).filter(Boolean));if(!b.size)return!1;if(o.somenteLeitura(m))return o.recusarEscrita(),!1;let i=o.findInBody(m,"p").filter(d=>(d.textContent??"").trim()!==""&&[...d.classList].some(h=>b.has(h)));if(!i.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let g='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>';return o.withEdit(m,()=>{for(let h of i){let x=Ce(h,Et,o.versao===5)??`${Et}${K(16)}`;ke(e,m,h,x,zr)&&(g+=`<p class="Texto_Alinhado_Esquerda"><a href="#${q(x)}">${q((h.textContent??"").trim())}</a></p>`)}let d=o.versao===5?o.getSelectionParagraph(m):null;d?o.insertHtmlBefore(m,d,g):o.insertHtml(m,g)}),!0}function p(n,u){let s=u??o.getInstance();if(!s)return;let m=r(s);if(!m.length){t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");return}let b=(x,v,A)=>f("select",{id:x},...a(m,v,A)),i=b("listStyle1",!1,"Item_Nivel1"),g=b("listStyle2",!0,"Item_Nivel2"),d=b("listStyle3",!0,"Item_Nivel3"),h=H(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:W(j("Estilo do T\xEDtulo 1 (obrigat\xF3rio):",i),j("Estilo do T\xEDtulo 2:",g),j("Estilo do T\xEDtulo 3:",d),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let x=[i.value,g.value,d.value].filter(v=>v!=="");if(!x.length){t("Escolha o estilo do T\xEDtulo 1.");return}c(null,[...new Set(x)],s)&&h.fechar()}},"Inserir")))})}return{getSumarioDocumento(n){let u=o.getInstance(n);u&&p(null,u)},getListStylesDocumento(n,u){let s=u??o.getInstance();return s?a(r(s),!1):[]},updateSelectDialog:(n,u)=>l(null,n,u),getDialogSumarioDocumento:n=>p(null,n),getDialogSumarioDocumento_:()=>p(null),insertSumarioDocumento:(n,u)=>c(null,n,u)}}};var se={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function Ue(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function Ae(e){let o={};for(let t of e.split(";")){let r=t.indexOf(":");if(r<=0)continue;let a=t.slice(0,r).trim(),l=t.slice(r+1).trim();a&&l&&(o[a]=l)}return o}function Br(e,o,t){let r=[];for(let a=0;a<o;a+=1){let l=a===0,c=l?e.trCabecalho:Array.isArray(e.tr)?a%2===0?e.tr[1]:e.tr[0]:e.tr,p=Array.from({length:t},(n,u)=>({td:l?e.tdCabecalho:u===0?e.tdPrimeira:e.td,p:l?e.pCabecalho:e.p}));r.push({tr:c,celulas:p})}return{linhas:r}}var Ge=e=>Array.from(e.querySelectorAll("td, th"));function Ct(e,o,t,r,a){let l=e.adaptador,c=Array.from(t.querySelectorAll("tr")),p=Br(r,c.length,Math.max(0,...c.map(n=>Ge(n).length)));if(l.versao===5){let n=o,u=n.plugins?.has("GeneralHtmlSupport")?n.plugins.get("GeneralHtmlSupport"):null,s=X(n,t.closest("figure")??t);if(!u||!s)return!1;if(ae(e,s))return l.recusarEscrita(),!1;let m=(b,i,g)=>{let d=Object.keys(Ae(i.getAttribute("style")??""));d.length&&g&&typeof u.removeModelHtmlStyles=="function"&&u.removeModelHtmlStyles(b,d,g)};return l.withEdit(o,()=>{m("table",t,s),u.setModelHtmlStyles("table",Ae(r.table),s),c.forEach((b,i)=>{let g=p.linhas[i];if(!g)return;let d=X(n,b);m("tr",b,d),d&&u.setModelHtmlStyles("tr",Ae(g.tr),d),Ge(b).forEach((h,x)=>{let v=X(n,h);if(v){m("td",h,v),u.setModelHtmlStyles("td",Ae(g.celulas[x]?.td??""),v);for(let A of v.getChildren())A.name==="paragraph"&&n.model.change(y=>y.setAttribute("estilo",g.celulas[x]?.p,A))}})}),r.cabecalho&&n.model.change(b=>b.setAttribute("headingRows",1,s))}),!0}return l.somenteLeitura(o)?(l.recusarEscrita(),!1):(l.withEdit(o,()=>{let n=t.ownerDocument;if(t.setAttribute("style",r.table),c.forEach((u,s)=>{let m=p.linhas[s];m&&(u.setAttribute("style",m.tr),Ge(u).forEach((b,i)=>{b.setAttribute("style",m.celulas[i]?.td??"");let g=m.celulas[i]?.p??"",d=b.querySelectorAll("p");if(d.length)for(let h of d)h.setAttribute("class",g);else{let h=n.createElement("p");h.setAttribute("class",g),h.append(...Array.from(b.childNodes)),b.append(h)}}))}),r.cabecalho&&c[0]&&!t.querySelector("thead")){let u=n.createElement("thead");u.append(c[0]),t.prepend(u)}a?.aoFinalCk4?.(t)}),!0)}var At="color1",Fr="Clique na tabela que deseja aplicar o estilo!",Je="dark-mode-color-";function Vr(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function Ur(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${Je}black`,`${Je}white`),o.classList.add(`${Je}${Vr(t)>125?"black":"white"}`))}}var St={id:"table-styles",globais(e){let o=e.adaptador,t=n=>o.getSelectionElement(n)?.closest("table")??null;function r(n,u){let s=n.querySelector("#addEstiloTabela");s&&u&&/^color\d+$/.test(u)&&(s.className=u)}function a(n,u,s,m=!0,b){let i=s??o.getInstance();if(!i||!u)return;let[g,d,h]=u,x=se[d],v=Number(h),A=x&&Number.isFinite(v)?Ue(x,v)[g]:void 0,y=b?.isConnected?b:b?null:t(i);!A||!y||Ct(e,i,y,{...A,cabecalho:m},{aoFinalCk4:Ur})}function l(){let n=Object.keys(se),u=Object.keys(Ue(se[At])),s=f("div",{id:"selectColorTabela",class:"listaCoresTabela"},...n.map((b,i)=>f("span",{},f("label",{for:`colorStyle${i+1}`},f("a",{class:"iconSelectColorTable",style:`background-color: ${se[b]?.light}`}),f("a",{class:"iconSelectColorTable",style:`background-color: ${se[b]?.dark}`})),f("br"),f("input",{type:"radio",name:"colorStyle","data-colorid":b,id:`colorStyle${i+1}`,value:`colorStyle${i+1}`,...i===0?{checked:"checked"}:{}})))),m=[];return u.forEach((b,i)=>{i%7===0&&m.push(f("div",{class:"listaEstiloTabela"}));let g=i+1;m[m.length-1]?.append(f("span",{},f("label",{for:`tableStyle${g}`},f("a",{class:"iconSelectStyleTable",style:`background-position-y: -${g*43}px`})),f("br"),f("input",{type:"radio",name:"tableStyle",id:`tableStyle${g}`,value:`tableStyle${g}`,...i===0?{checked:"checked"}:{}})))}),f("div",{class:"dialogBoxDiv",style:"font-size:11pt;line-height:14pt;color:#616161;"},f("div",{style:"padding-bottom: 10px;"},"Selecione a varia\xE7\xE3o de cores da tabela:"),s,f("div",{style:"padding-bottom: 10px;"},"Selecione o estilo da tabela:"),f("div",{id:"addEstiloTabela",class:At},...m),f("div",{style:"padding: 10px 0;"},"Selecione a largura da tabela: ",f("input",{type:"number",id:"addEstiloTableWidth",style:"background: #f5f5f5; padding: 5px; border-radius: 5px; width: 50px; border: 1px solid #ccc;",max:"100",step:"5",min:"5"})," %"),f("div",{style:"padding: 10px 0;"},f("input",{type:"checkbox",id:"addEstiloTableHeader",checked:"checked"})," ",f("label",{for:"addEstiloTableHeader"},"Determinar a primeira linha como cabe\xE7alho da tabela")))}function c(n){try{let u=m=>Number.parseFloat(m?e.win.getComputedStyle(m).width:""),s=Math.round(100*u(n)/u(n?.parentElement??null));return Number.isFinite(s)?Math.min(100,Math.max(5,s)):80}catch{return 80}}function p(n,u){let s=u??o.getInstance();if(!s)return;let m=t(s),b=l(),i=b.querySelector("#addEstiloTableWidth");i&&(i.value=String(c(m)));for(let d of b.querySelectorAll('input[name="colorStyle"]'))d.addEventListener("change",()=>r(b,d.getAttribute("data-colorid")));let g=H(e.doc,{titulo:"Inserir estilo \xE0 tabela",conteudo:f("div",{},b,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let d=b.querySelector('input[name="tableStyle"]:checked')?.value,h=b.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),x=b.querySelector("#addEstiloTableWidth")?.value,v=b.querySelector("#addEstiloTableHeader:checked")!==null;!d||!h||!x||(a(null,[d,h,x],s,v,m),g.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(n){let u=o.getInstance(n);u&&(t(u)?p(null,u):I(e.doc,Fr))},changeColorTable(n){r(e.doc,n?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:l,openDialogSyleTable:n=>p(null,n),getSyleTable(n){let u=o.getInstance(n);u&&o.withEdit(u,()=>{})},setSyleTable:(n,u)=>a(null,n,u)}}};var wt=/^[0-9A-Za-z-]+$/,Gr="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Jr=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,Tt={id:"tiny-url",globais(e){let o=c=>I(e.doc,c),t=c=>(e.fetch??e.win.fetch.bind(e.win))(c);async function r(c,p,n,u){let s=new URLSearchParams({url:c});p!==""&&s.set("alias",p);let m;try{m=await t(`https://tinyurl.com/api-create.php?${s}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(m.status===400)return o("Erro: Nenhuma link gerado"),!1;if(m.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let b=(await m.text()).trim();if(m.status!==200||!Jr.test(b))return o("Erro: Nenhuma link gerado"),!1;if(n==="setinput")return e.win.setInputTinyUrl?.(b),!0;let i=u??e.adaptador.getInstance();if(!i)return!1;let g=`<a href="${q(b)}" class="ancoraSei" target="_blank">${q(b)}</a>`;return e.adaptador.withEdit(i,()=>e.adaptador.insertHtml(i,g)),!0}function a(c){let p=e.adaptador.getInstance(c);if(!p)return;let n=f("input",{type:"text",id:"urlTiny"}),u=f("input",{type:"text",id:"aliasTiny"}),s=f("div",{id:"tinyResult"}),m=String(e.win.getSelection?.()??"").trim();m!==""&&B(m)&&(n.value=m),u.addEventListener("input",()=>{s.replaceChildren();let i=u.value;i!==""&&(wt.test(i)?s.append(`Resultado: https://tinyurl.com/${i}`):s.append(f("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let b=H(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:W(j("Insira o link que deseja encurtar:",n),j("Insira um Nome Personalizado para o link (opcional):",u),s,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let i=n.value.trim(),g=u.value.trim();if(i===""||!B(i))return o("Digite um link v\xE1lido!");if(g!==""&&!wt.test(g))return o(Gr);if(g!==""&&g.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await r(i,g,"insert",p)&&b.fechar()}},"Inserir")))})}return{getTinyUrl:a,ajaxTinyUrl:(c,p,n)=>r(c,p,n)}}};var Ke=[Ro,lt,xt,Eo,vo,co,_o,yt,ft,To,Tt,Do,Co,Uo,St,kt,ht,st,dt,zo];function _t(e,o,t){let r=e,a=[],l=[];for(let c of o){let p=!0;try{for(let[n,u]of Object.entries(c.globais(t))){if(r[n]!==void 0){p=!1,l.push({id:c.id,erro:new Error(`global ja definido: ${n}`)});continue}r[n]=u}}catch(n){p=!1,l.push({id:c.id,erro:n})}p&&a.push(c.id);try{r.SeiProEditorAdapter?.registerFeature?.({id:c.id})}catch{}}return{instalados:a,falhas:l}}function Mt(e,o){let t=[];for(let r of e)try{r.iniciar?.(o)}catch(a){t.push({id:r.id,erro:a})}return t}var Lt=`/*
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
`;Le(Lt);var qt="__seiProEditorTs",Pt=window;if(!Pt[qt]){Pt[qt]=!0;let e=Ze(window);e.aoRecusarEscrita(()=>I(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute(eo)??"",checkOpcao:t=>ao(t),verifyOpcao:t=>io(t)};for(let t of _t(window,Ke,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of Mt(Ke,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
