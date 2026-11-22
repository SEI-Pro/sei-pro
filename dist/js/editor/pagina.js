/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function D(o,e){let r=o.defaultView?.DOMParser??globalThis.DOMParser,a=new r().parseFromString(`<!doctype html><html><body>${e}</body></html>`,"text/html");return Array.from(a.body.childNodes).map(i=>o.importNode(i,!0))}function H(o,e){if(!o||typeof e!="function")return;let r=o,a=r.__seiProCtxBuilders;if(!a){let i=[];a=r.__seiProCtxBuilders=i,o.addEventListener("contextmenu",l=>{let c=l;if(c.shiftKey)return;let u=[];for(let t of i)try{u=u.concat(t(c.target)||[])}catch{}u.length&&(c.preventDefault(),oe(o.ownerDocument,u,c.clientX,c.clientY))})}a.includes(e)||a.push(e)}function oe(o,e,r,a){o.getElementById("seiProCtxMenu")?.remove();let i=o.createElement("div");i.id="seiProCtxMenu",i.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",i.style.left=`${r}px`,i.style.top=`${a}px`;for(let c of e){let u=o.createElement("div");u.textContent=c.label,u.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",u.addEventListener("mouseenter",()=>{u.style.background="#eef"}),u.addEventListener("mouseleave",()=>{u.style.background=""}),u.addEventListener("click",()=>{i.remove(),c.action()}),i.append(u)}o.body.append(i);let l=()=>{i.remove(),o.removeEventListener("mousedown",l)};setTimeout(()=>o.addEventListener("mousedown",l),0)}function Y(o,e,r){if(typeof r!="function")return;let a=o.__seiProCtx;if(!a){let i={acoes:{},construtores:[]};a=o.__seiProCtx=i;try{o.addMenuGroup("seiProGroup",5)}catch{}o.contextMenu.addListener(l=>{let c=l?.$??null,u=null;for(let t of i.construtores){let d=[];try{d=t(c)||[]}catch{d=[]}for(let s of d){let p=`seiPro_${String(s.label).replace(/[^A-Za-z0-9]/g,"_")}`;i.acoes[p]=s.action,o.getCommand(p)||o.addCommand(p,{exec:()=>(i.acoes[p]?.(),!0)}),o.getMenuItem(p)||o.addMenuItem(p,{label:s.label,command:p,group:"seiProGroup"}),u=u??{},u[p]=e}}return u})}a.construtores.includes(r)||a.construtores.push(r)}var y=o=>o;function Z(o,e={}){let r=()=>o.CKEDITOR,a=t=>!!t?.name&&r()?.instances[t.name]===t,i=t=>a(t)&&!t.readOnly,l=t=>y(t).document?.getBody()?.$??null,c=(t,d)=>{if(!t)return;let s=y(t);if(s.readOnly){e.fn?.();return}d(s)},u={versao:4,getInstance(t){let d=r();if(!d?.instances)return null;if(a(d.currentInstance))return d.currentInstance;let s=t?.closest?.("div.cke"),p=s?d.instances[s.id.replace("cke_","")]:void 0;if(i(p))return p;if(i(o.oEditor))return o.oEditor;let g=Object.values(d.instances);return g.find(n=>i(n))??g[0]??null},getAllInstances:()=>Object.values(r()?.instances??{}),focus:t=>y(t).focus(),saveSnapshot:t=>y(t).fire("saveSnapshot"),withEdit(t,d){let s=y(t);s.focus(),s.fire("saveSnapshot");try{d()}finally{s.fire("saveSnapshot")}},insertHtml:(t,d)=>c(t,s=>s.insertHtml(d)),insertText:(t,d)=>c(t,s=>s.insertText(d)),getSelectionElement:t=>y(t).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(t){return u.getSelectionElement(t)?.closest("p")??null},insertHtmlBefore(t,d,s){c(t,()=>d.before(...D(d.ownerDocument,s)))},getToolbarContainer:t=>y(t).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:t=>l(t),findInBody(t,d){let s=l(t);return s?Array.from(s.querySelectorAll(d)):[]},appendToBody(t,d){c(t,s=>{let p=l(s);p&&p.append(...D(p.ownerDocument,d))})},transformBodyHtml(t,d){c(t,s=>{let p=l(s);if(!p)return;let g=p.innerHTML,n=d(g);typeof n=="string"&&n!==g&&p.replaceChildren(...D(p.ownerDocument,n))})},execCommand:(t,d,s)=>y(t).execCommand(d,s),applyStyle(t,d){let s=r()?.style;s&&y(t).applyStyle(new s(d))},getData:t=>y(t).getData(),setData:(t,d)=>c(t,s=>s.setData(d)),insertElement(t,d){c(t,s=>{let p=r()?.dom?.element.createFromHtml;p&&s.insertElement?s.insertElement(p(d,s.document)):s.insertHtml(d)})},saveSelection:t=>y(t).getSelection()?.createBookmarks(!0)??null,restoreSelection(t,d){let s=y(t).getSelection();s&&d&&s.selectBookmarks(d)},getSelectedText:t=>y(t).getSelection()?.getSelectedText()??"",getSelectedHtml(t){return y(t).getSelectedHtml?.()?.getHtml?.()??""},on:(t,d,s)=>y(t).on(d,s),off:(t,d,s)=>y(t).removeListener(d,s),fire:(t,d,s)=>y(t).fire(d,s),addContextMenu(t,d){let s=y(t),p=r();if(p&&s.contextMenu&&typeof s.addMenuItem=="function"){Y(s,p.TRISTATE_OFF,d);return}H(l(t),d)},waitReady(t){return new Promise((d,s)=>{let p=Date.now(),g=()=>{let n=Object.values(r()?.instances??{}).find(m=>m.status==="ready");if(n)return d(n);if(Date.now()-p>t)return s(new Error("Timeout aguardando CKEditor 4"));setTimeout(g,100)};g()})},somenteLeitura:t=>!!y(t).readOnly,aoRecusarEscrita(t){e.fn=t}};return u}var x=o=>o,ee={strike:"strikethrough",strikethrough:"strikethrough"},te={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},re=0;function oo(o,e={}){let r=o.document,a=n=>Array.from(n.model.document.roots??[]).filter(m=>m.isAttached()&&m.rootName!=="$graveyard"),i=n=>o.INFRA_EDITOR_CONFIG?.rootsAttributes?.[n],l=(n,m)=>{let f=n.editing.view.document.getRoot(m);return f?n.editing.view.domConverter.mapViewToDom(f):null},c=n=>{for(let b of a(n))if(i(b.rootName)?.principal){let h=l(n,b.rootName);if(h)return h}let m=r.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return m||Array.from(r.querySelectorAll(".ck-editor__editable_inline")).reduce((b,h)=>h.childElementCount>(b?b.childElementCount:-1)?h:b,null)},u=n=>{let m=c(n);return m&&a(n).find(f=>l(n,f.rootName)===m)||null},t=n=>n.model.document.selection.getFirstPosition()?.root.rootName??null,d=n=>!!n&&!!i(n)?.somenteLeitura,s=(n,m)=>n.data.toModel(n.data.processor.toView(m)),p=(n,m)=>{let f=x(n);if(d(t(f)))return e.fn?.();f.model.change(()=>f.model.insertContent(s(f,m),f.model.document.selection))},g={versao:5,getInstance(){let n=r.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return n&&n.state==="ready"?n:null},getAllInstances(){let n=g.getInstance();return n?[n]:[]},focus:n=>x(n).focus(),saveSnapshot(){},withEdit(n,m){let f=x(n);f.focus(),f.model.change(()=>m())},insertHtml:p,insertText(n,m){let f=x(n);if(d(t(f)))return e.fn?.();f.model.change(b=>f.model.insertContent(b.createText(m)))},getSelectionElement(){let n=o.getSelection?.(),m=n&&n.rangeCount>0?n.anchorNode:null;return m?m.nodeType===1?m:m.parentElement:null},getSelectionParagraph:n=>g.getSelectionElement(n)?.closest("p")??null,insertHtmlBefore(n,m,f){let b=x(n),h=b.editing.view.domConverter.mapDomToView(m),w=h?b.editing.mapper.toModelElement(h):null;if(w){if(d(w.root?.rootName))return e.fn?.();b.model.change(A=>b.model.insertContent(s(b,f),A.createPositionBefore(w)));return}p(n,f)},getToolbarContainer(n){let m=x(n).ui?.view?.toolbar?.element;return m?m.querySelector(".ck-toolbar__items")??m:null},getBodyContainer:n=>c(x(n)),findInBody(n,m){let f=c(x(n));return f?Array.from(f.querySelectorAll(m)):[]},appendToBody(n,m){let f=x(n),b=u(f);if(!b)return p(n,m);if(d(b.rootName))return e.fn?.();f.model.change(h=>f.model.insertContent(s(f,m),h.createPositionAt(b,"end")))},transformBodyHtml(n,m){let f=x(n),b=u(f);if(!b)return;let h=f.data.get({rootName:b.rootName,seiProInterno:!0}),w=m(h);if(typeof w!="string"||w===h)return;let A=f.model.document.selection.getFirstRange(),S=A&&A.start.root.rootName===A.end.root.rootName?{raiz:A.start.root,ps:[...A.start.path],pe:[...A.end.path]}:null,Zo=f.model.document.selection.isBackward;f.data.set({[b.rootName]:w}),S&&f.model.change(F=>{let $,j;try{$=f.model.createPositionFromPath(S.raiz,S.ps),j=f.model.createPositionFromPath(S.raiz,S.pe)}catch{$=j=F.createPositionAt(S.raiz,"end")}F.setSelection(F.createRange($,j),{backward:Zo})})},execCommand(n,m,f){x(n).execute(ee[m]??m,f!==void 0?{value:f}:void 0)},applyStyle(n,m){let f=te[m.element.toLowerCase()];f&&x(n).execute(f)},getData(n){let m=x(n),f=u(m);return f?m.data.get({rootName:f.rootName}):m.data.get()},setData(n,m){let f=x(n),b=u(f);b?f.data.set({[b.rootName]:m}):f.data.set(m)},insertElement:(n,m)=>g.insertHtml(n,m),saveSelection(n){let m=x(n),f=`spro-ed:${re++}`;return m.model.change(b=>{let h=m.model.document.selection.getFirstRange();h&&b.addMarker(f,{range:h,usingOperation:!1})}),f},restoreSelection(n,m){let f=x(n);if(typeof m!="string")return;let b=f.model.markers.get(m);b&&f.model.change(h=>h.setSelection(b.getRange())),f.model.change(h=>{f.model.markers.has(m)&&h.removeMarker(m)})},getSelectedText:()=>String(o.getSelection?.()??""),getSelectedHtml(){let n=o.getSelection?.();if(!n||n.rangeCount===0)return"";let m=r.createElement("div");return m.append(n.getRangeAt(0).cloneContents()),m.innerHTML},on(n,m,f){if(m==="change")return x(n).model.document.on("change:data",f);c(x(n))?.addEventListener(m,f)},off(n,m,f){if(m==="change")return x(n).model.document.off("change:data",f);c(x(n))?.removeEventListener(m,f)},fire(n,m,f){c(x(n))?.dispatchEvent(new CustomEvent(m,{detail:f}))},addContextMenu(n,m){H(c(x(n)),m)},waitReady(n){return new Promise((m,f)=>{let b=Date.now(),h=()=>{let w=g.getInstance();if(w)return m(w);if(Date.now()-b>n)return f(new Error("Timeout aguardando CKEditor 5"));setTimeout(h,100)};h()})},somenteLeitura:n=>d(t(x(n))),aoRecusarEscrita(n){e.fn=n}};return g}function Q(o){return o.document.querySelector(".ck-editor__editable")?5:o.CKEDITOR?.instances?4:0}function eo(o){let e=null,r={},a=()=>{if(e)return e;let c=Q(o);return c===5?e=oo(o,r):c===4&&(e=Z(o,r)),e},i=()=>{let c=a();if(!c)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return c},l=c=>((...u)=>i()[c](...u));return{get versao(){return a()?.versao??0},getInstance:c=>a()?.getInstance(c)??null,getAllInstances:()=>a()?.getAllInstances()??[],focus:l("focus"),saveSnapshot:l("saveSnapshot"),withEdit:l("withEdit"),insertHtml:l("insertHtml"),insertText:l("insertText"),getSelectionElement:l("getSelectionElement"),getSelectionParagraph:l("getSelectionParagraph"),insertHtmlBefore:l("insertHtmlBefore"),getToolbarContainer:l("getToolbarContainer"),getBodyContainer:l("getBodyContainer"),findInBody:l("findInBody"),appendToBody:l("appendToBody"),transformBodyHtml:l("transformBodyHtml"),execCommand:l("execCommand"),applyStyle:l("applyStyle"),getData:l("getData"),setData:l("setData"),insertElement:l("insertElement"),saveSelection:l("saveSelection"),restoreSelection:l("restoreSelection"),getSelectedText:l("getSelectedText"),getSelectedHtml:l("getSelectedHtml"),on:l("on"),off:l("off"),fire:l("fire"),addContextMenu:l("addContextMenu"),somenteLeitura:l("somenteLeitura"),aoRecusarEscrita(c){r.fn=c},waitReady(c){let u=Date.now();return new Promise((t,d)=>{let s=()=>{let p=a();if(p)return p.waitReady(Math.max(1,c-(Date.now()-u))).then(t,d);if(Date.now()-u>c)return d(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(s,100)};s()})}}}var to="data-base";function ro(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(i=>i?.configGeral).find(Array.isArray)?.find(i=>i?.name===e)?.value}function no(o,e){let r=ro(o,e);return!(r===!1||r===0||r==="")}function ao(o,e){let r=ro(o,e);return r===!0||r===1||r==="1"}function so(o=localStorage){try{return o.getItem("configBasePro")}catch{return null}}function io(o,e=localStorage){return no(so(e),o)}function lo(o,e=localStorage){return ao(so(e),o)}function P(o){o.style.display="",o.ownerDocument.defaultView?.getComputedStyle?.(o)?.display==="none"&&(o.style.display="block")}function z(o){o.style.display="none"}var co=o=>(o?.nodeType===1?o:o?.parentElement??null)?.closest("p")??null;function po(o){let e=()=>o.adaptador.versao===5,r=(a,i)=>{let l=a.editing.view.domConverter.mapDomToView(i);return l?a.editing.mapper.toModelElement(l):null};return{selecionados(a){let i=()=>{let n=o.adaptador.getSelectionParagraph(a);return n?[n]:[]};if(e()){let n=a,f=[...n.model.document.selection.getSelectedBlocks()].map(b=>{let h=n.editing.mapper.toViewElement(b);return h?n.editing.view.domConverter.mapViewToDom(h):null}).filter(b=>!!b&&b.tagName==="P");return f.length?f:i()}let c=o.adaptador.getBodyContainer(a)?.ownerDocument?.getSelection?.();if(!c||c.rangeCount===0||!c.anchorNode)return i();let u=co(c.anchorNode),t=co(c.focusNode);if(!u&&!t||(u=u??t,t=t??u,!u||!t))return i();if(u===t)return[u];let d=u,s=t;u.compareDocumentPosition(t)&2&&(d=t,s=u);let p=[],g=d;for(let n=0;g&&n<5e3&&(g.tagName.toLowerCase()==="p"&&p.push(g),g!==s);n+=1)g=g.nextElementSibling;return p.length?p:[d]},classeDeEstilo(a,i){return e()?r(a,i)?.getAttribute("estilo")??"":i.getAttribute("class")??""},definirClasse(a,i,l){if(e()){let c=a,u=r(c,i);u&&c.model.change(t=>t.setAttribute("estilo",l,u)),o.win.SeiProGhs?.setEstilos(i,{"text-align":null},a);return}i.removeAttribute("style"),i.setAttribute("class",l)},definirTextAlign(a,i,l){if(e()){o.win.SeiProGhs?.setEstilos(i,{"text-align":l},a);return}i.removeAttribute("style"),i.style.textAlign=l}}}var ne=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function ae(o,e){let r=ne.find(a=>Object.values(a).includes(o));return r?r[e]:null}function se(o,e){let r=o?.closest(".cke_top")?.querySelector(".divAlignText");if(r)return r;for(let a=o?.parentElement??null;a;a=a.parentElement){let i=a.querySelector(".divAlignText");if(i)return i}return e.querySelector(".divAlignText")}var uo={id:"align",globais(o){let e=po(o);return{setAlignText(r,a){let i=o.adaptador.getInstance(r);if(!i||o.adaptador.somenteLeitura(i))return;let l=e.selecionados(i);l.length&&o.adaptador.withEdit(i,()=>{for(let c of l){let u=ae(e.classeDeEstilo(i,c),a);u?e.definirClasse(i,c,u):e.definirTextAlign(i,c,a)}})},openAlignText(r){if(!r)return;let a=se(r,o.doc);r.classList.contains("cke_button_on")?(r.classList.replace("cke_button_on","cke_button_off"),a&&z(a)):(r.classList.remove("cke_button_off"),r.classList.add("cke_button_on"),a&&P(a))},closeAlignText(){for(let r of o.doc.querySelectorAll(".getAlignButtom"))r.classList.remove("cke_button_on"),r.classList.add("cke_button_off");for(let r of o.doc.querySelectorAll(".divAlignText"))r.style.display="none"}}}};function v(o,e={},...r){let a=document.createElement(o);for(let[i,l]of Object.entries(e))l===void 0||l===!1||(typeof l=="function"?a.addEventListener(i.replace(/^on/,""),l):l===!0?a.setAttribute(i,""):i==="class"?a.className=l:i==="value"&&o==="textarea"?a.value=l:a.setAttribute(i,l));for(let i of r)i!=null&&i!==!1&&a.append(i);return a}var E={fill:"currentColor",stroke:"none"},mo="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",fo={estrela:[["path",{d:mo}]],estrelaCheia:[["path",{d:mo,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...E}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...E}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...E}],["circle",{cx:"12",cy:"12",r:"1.4",...E}],["circle",{cx:"19",cy:"12",r:"1.4",...E}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...E}],["circle",{cx:"15",cy:"6",r:"1.3",...E}],["circle",{cx:"9",cy:"12",r:"1.3",...E}],["circle",{cx:"15",cy:"12",r:"1.3",...E}],["circle",{cx:"9",cy:"18",r:"1.3",...E}],["circle",{cx:"15",cy:"18",r:"1.3",...E}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},at=Object.keys(fo);function q(o,e=18,r=document){let a="http://www.w3.org/2000/svg",i=r.createElementNS(a,"svg"),l={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[c,u]of Object.entries(l))i.setAttribute(c,u);for(let[c,u]of fo[o]){let t=r.createElementNS(a,c);for(let[d,s]of Object.entries(u))t.setAttribute(d,s);i.append(t)}return i}function ie(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function go(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(l=>{try{return l.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function bo(o,e,r,a,i){let l=o.body??o.documentElement;for(let p of[l,...o.querySelectorAll("dialog")])for(let g of[...p.children])g.classList.contains("spro-aviso")&&g.remove();let c=v("div",{class:"spro-aviso",role:"status"},q("check",16),v("span",{},e),...ie(r).map(p=>v("button",{type:"button",onclick:()=>{c.remove(),p.fazer()}},p.rotulo)));c.setAttribute("popover","manual");let u=()=>{try{c.showPopover?.()}catch{}},t=Date.now()+a,d=()=>{let p=go(o);p.append(c),u(),p.localName==="dialog"&&p.addEventListener("close",()=>{if(!(!s||!p.contains(c))){if(i&&go(o).localName!=="dialog"&&i(e,r,Math.max(0,t-Date.now()))){s=!1,c.remove();return}d()}},{once:!0})},s=!0;return d(),setTimeout(()=>{s=!1,c.remove()},a),c}var le=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function ho(o={}){return({titulo:e,conteudo:r,icone:a,aoFechar:i})=>{let l=v("dialog",{class:"spro-dialogo","aria-label":e}),c=()=>{l.open&&l.close()};return l.append(v("header",{},a?v("span",{class:"spro-dialogo-icone","aria-hidden":"true"},q(a,18)):null,v("h2",{},e),v("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:c},q("fechar",16))),v("div",{class:"spro-dialogo-corpo"},r)),l.addEventListener("close",()=>{l.remove(),o.aoFechar?.(),i?.()}),document.body.append(l),o.aoAbrir?.(),l.showModal(),l.querySelector(le)?.focus({preventScroll:!0}),{fechar:c}}}function vo(o){let e=ho();return(r,a)=>(G(r,o),e(a))}function G(o,e){if(o.querySelector('style[data-seipro-editor="base"]'))return;let r=o.createElement("style");r.setAttribute("data-seipro-editor","base"),r.textContent=e,(o.head??o.documentElement).append(r)}var V="";function U(o){V=o}var L=(o,e)=>vo(V)(o,e);function xo(o){G(o,V)}function M(o,e){xo(o),bo(o,e,void 0,7e3)}var ce=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),yo=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function de(o){let e=0,r=o.split("");return r.forEach((a,i)=>{let l=yo.get(a),c=yo.get(r[i+1]);e+=l<c?-l:l}),e}function wo(o){return!o||typeof o!="string"||o.trim()===""?"":o.includes(" ")?o.split(" ").map((e,r)=>e===""?e:ce.has(e.toLowerCase())&&r!==0?e.toLowerCase():de(e)>0?e.toUpperCase():e[0].toUpperCase()+e.substring(1).toLowerCase()).join(" "):o[0].toUpperCase()+o.substring(1).toLowerCase()}function C(o){return o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ko={id:"cap-letter",globais:o=>({convertFirstLetter(e){let r=o.adaptador.getInstance(e);if(!r)return;let a=o.adaptador.getSelectedText(r);if(!a||a.trim()===""){M(o.doc,"Selecione um texto para converter");return}o.adaptador.insertHtml(r,C(wo(a)))}})};var Eo="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Mo(o){let e=new Uint32Array(Math.max(0,o));crypto.getRandomValues(e);let r="";for(let a of e)r+=Eo[a%Eo.length];return r}var pe=()=>`<span class="ancoraSei checkboxSEI" data-id="${Mo(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,Ao={id:"checkbox",globais:o=>({getInsertCheckboxButtom(e){let r=o.adaptador.getInstance(e);r&&o.adaptador.withEdit(r,()=>o.adaptador.insertHtml(r,pe()))}})};var K="spro_editor_folha",Co="seipro-folha-editor",J="data-spro-folha-editor",ue=`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }
`;function me(o){let e=`html[${J}]`,r=o?"#141619":"#f3f4f7",a=o?"#2a2d33":"#e3e6ee",i="rgba(20, 25, 50, .13)",l=`14px 0 24px -14px ${i}, -14px 0 24px -14px ${i}`,c=`0 14px 24px -14px ${i}`,u=`${e} .cke_contents[data-spro-folha]`;return`${e} #divEditores, ${e} .cke_inner, ${e} .cke { background-color: ${r} !important; }
${e} #divEditores { padding-bottom: 28px; }
${u} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important; border: 0 solid ${a}; border-width: 0 1px; box-shadow: ${l}; clip-path: inset(0 -30px); }
${u}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${u}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${l}, ${c}; clip-path: inset(0 -30px -30px); }
${u}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${u} { padding-left: 20px; padding-right: 20px; } }
${e} .ck-editor__main { background-color: ${r}; padding: 28px 12px; }
${e} .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important; padding: 40px 56px !important; background-color: #ffffff !important; border: 1px solid ${a} !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }
`}function So(o,e){if(!o.head||(o.querySelector(`style[data-style="${Co}"]`)?.remove(),!e))return;let r=o.createElement("style");r.setAttribute("data-style",Co),r.textContent=e,o.head.append(r)}function To(o,e){if(!o?.style)return;let r=o.getAttribute("data-spro-folha-bg");if(e)r===null&&o.setAttribute("data-spro-folha-bg",`${o.style.getPropertyValue("background-color")}|${o.style.getPropertyPriority("background-color")}`),o.style.setProperty("background-color","#ffffff","important");else if(r!==null){let[a,i]=r.split("|");o.removeAttribute("data-spro-folha-bg"),o.style.removeProperty("background-color"),a&&o.style.setProperty("background-color",a,i||"")}}var qo={id:"folha-papel",globais(o){let e=o.doc,r=()=>!!o.win.localStorage?.getItem(K),a=()=>!!o.win.localStorage?.getItem("darkModePro"),i=!1;function l(t){for(let d of e.querySelectorAll("iframe.cke_wysiwyg_frame")){let s=d.contentDocument;s?.head&&(So(s,t?ue:null),To(s.documentElement,t),To(s.body,t))}}function c(t){let d=[...e.querySelectorAll(".cke_contents")];d.forEach((s,p)=>{if(!t){s.removeAttribute("data-spro-folha");return}let g=[p===0?"primeira":"",p===d.length-1?"ultima":""].filter(Boolean);s.setAttribute("data-spro-folha",g.join(" ")||"meio")})}function u(t){So(e,t?me(a()):null),l(t),c(t),t?e.documentElement.setAttribute(J,""):e.documentElement.removeAttribute(J);for(let d of e.querySelectorAll(".getPaperViewButtom"))d.classList.toggle("cke_button_on",t),d.classList.toggle("cke_button_off",!t),d.setAttribute("aria-pressed",t?"true":"false")}return{aplicarFolhaEditorPro:u,getPaperViewButtom(t){let d=!r();d?o.win.localStorage.setItem(K,"1"):o.win.localStorage.removeItem(K),u(d)},initFolhaEditorPro(){let t=o.win.CKEDITOR;if(typeof t?.on=="function"&&!i){i=!0;let d=s=>s.on("contentDom",()=>r()&&l(!0));for(let s of Object.values(t.instances??{}))d(s);t.on("instanceReady",s=>d(s.editor))}u(r())}}}};function fe(o){if(!o)return 16;let e=Number.parseFloat(o.ownerDocument.defaultView?.getComputedStyle?.(o)?.fontSize??"");return Number.isNaN(e)?16:e}var Lo={id:"font-size",globais:o=>({changeFontSize(e,r){let a=o.adaptador.getInstance(e);if(!a)return;let i=o.adaptador.getSelectedHtml(a);if(!i||i.trim()===""){M(o.doc,"Selecione um texto para alterar o tamanho da fonte");return}let l=fe(o.adaptador.getSelectionElement(a)),c=r==="up"?l+2:l-2;c>7&&c<70&&o.adaptador.withEdit(a,()=>{o.adaptador.versao===4?o.adaptador.applyStyle(a,{element:"span",attributes:{style:`font-size: ${c}px`}}):o.adaptador.insertHtml(a,`<span style="font-size: ${c}px">${i}</span>`)})}})};var O=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,ge=[{name:O,attributes:!0},{name:O,classes:!0},{name:O,styles:!0}],I=o=>o.split("").join("[\\t\\n\\r]*"),be=new RegExp(`^[\\s\\x00-\\x20]*(${I("javascript")}|${I("vbscript")}|${I("livescript")}|${I("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${I("text/html")})`,"i"),he=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:be}]}];function T(o,e){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",o,e===void 0?"":e)}function _(o,e){try{return o?.plugins?.has(e)?o.plugins.get(e):null}catch{return null}}var ve=o=>!!(o?.model&&o.editing&&o.conversion),xe=o=>_(o,"EstiloEditing")?.estilos??{},Io=(o,e)=>Object.hasOwn(o,e);function Do(o,e){let r=_(o,"GeneralHtmlSupport");if(typeof r?.getGhsAttributeNameForElement=="function")try{return r.getGhsAttributeNameForElement(e)}catch{}return`html${e.charAt(0).toUpperCase()}${e.slice(1)}Attributes`}function ye(o,e){let r=o?.getAttribute?.(e)?.classes;return r?Array.isArray(r)?[...r]:Object.keys(r):[]}function we(o,e,r){if(!e?.is?.("element"))return;let a=r.mapper.toViewElement(e);if(!a)return;let i=xe(o),l=e.getAttribute("estilo"),c=ye(e,Do(o,"p")),u=r.writer,t=[];try{t=Array.from(a.getClassNames())}catch{}for(let d of t)d!==l&&Io(i,d)&&u.removeClass(d,a);for(let d of c)Io(i,d)||u.addClass(d,a);l&&u.addClass(l,a)}function ke(o){if(o.__seiProGhsConversor)return;o.__seiProGhsConversor=!0;let e=["attribute:estilo:paragraph",`attribute:${Do(o,"p")}:paragraph`];o.conversion.for("downcast").add(r=>{for(let a of e)r.on(a,(i,l,c)=>{try{we(o,l.item,c)}catch{}},{priority:"lowest"})})}function Ee(o){try{return Array.from(o.model.markers).some(e=>/coment/i.test(e.name))}catch{return!1}}function _o(o,e){let r=_(e,"Salvar"),a=r?!!r.isDirty:!1;try{o()}finally{if(r&&!a)try{r.resetDirty()}catch{}}}function Me(o){try{return o.model.document.history.getOperations().some(e=>e.batch?.isUndoable)}catch{return!0}}function Ae(o,e){let r=o.getFullData({seiProInterno:!0}),a=e.INFRA_EDITOR_CONFIG?.initialData;return!a||typeof a!="object"||Me(o)?r:Object.fromEntries(Object.keys(r).map(i=>[i,typeof a[i]=="string"?a[i]:r[i]]))}function Ce(o,e,r){try{let a=r??o.adaptador.getSelectionParagraph(e);if(!a)return null;if(typeof a.is=="function"&&a.is("element"))return a;let i=a.jquery?a.get(0):a;if(i?.nodeType!==1)return null;let l=e.editing.view.domConverter.mapDomToView(i);return l?e.editing.mapper.toModelElement(l):null}catch{return null}}function Se(o,e){try{return o.editing.mapper.toViewElement(e)?.name??null}catch{return null}}function Ro(o){let e=l=>l??o.adaptador.getInstance();function r(l){let c=e(l);if(!ve(c))return!1;if(c.__seiProGhsLiberado)return!0;let u=_(c,"DataFilter");if(!u)return T("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{u.allowElement({name:O,attributes:!0,classes:!0,styles:!0});for(let t of ge)u.allowAttributes(t);if(typeof u.disallowAttributes=="function")for(let t of he)u.disallowAttributes(t)}catch(t){return T("falha ao liberar o GHS",t),!1}return c.__seiProGhsLiberado=!0,ke(c),!0}function a(l){let c=e(l);if(!r(c)||typeof c.getFullData!="function")return!1;let u=!0;return _o(()=>{try{c.data.set(Ae(c,o.win))}catch(t){T("falha ao reprocessar o conteudo",t),u=!1}},c),u}function i(l,c,u){let t=e(l);if(!r(t))return!1;let d=_(t,"GeneralHtmlSupport"),s=Ce(o,t,c),p=s?Se(t,s):null;if(!d||!s||!p)return!1;try{return u(d,p,s),!0}catch(g){return T("falha ao aplicar no model",g),!1}}return{liberar:r,aplicarRegras:a,semSujar:(l,c)=>_o(l,e(c)),estaLiberado:l=>!!e(l)?.__seiProGhsLiberado,addClasse:(l,c,u)=>i(u,l,(t,d,s)=>t.addModelHtmlClass(d,c,s)),removeClasse:(l,c,u)=>i(u,l,(t,d,s)=>t.removeModelHtmlClass(d,c,s)),setEstilos:(l,c,u)=>i(u,l,(t,d,s)=>t.setModelHtmlStyles(d,c,s)),setAtributos:(l,c,u)=>i(u,l,(t,d,s)=>t.setModelHtmlAttributes(d,c,s))}}var Ho={id:"ghs-unlock",globais:o=>({SeiProGhs:Ro(o)}),iniciar(o){if(o.adaptador.versao!==5)return;let e=Ro(o),r=o.adaptador.getInstance();if(!(!r||!e.liberar(r))){if(o.win.SEIPRO_GHS_AUTO===!1||Ee(r)){T("regras liberadas (ativacao no pr\xF3ximo data.set)");return}e.aplicarRegras(r)&&T("classes, estilos e atributos liberados no editor")}}};function B(...o){return v("div",{style:"display:grid;gap:12px;min-width:360px;"},...o)}function R(o,e){return e.classList.add("spro-campo"),e.style.width="100%",v("label",{style:"display:grid;gap:4px;font-size:13px;"},v("span",{},o),e)}function Po(o,e){return new Promise((r,a)=>{let i=new o.Image;i.crossOrigin="anonymous",i.onload=()=>{try{let l=o.document.createElement("canvas");l.width=i.width,l.height=i.height,l.getContext("2d")?.drawImage(i,0,0),r(l.toDataURL("image/png"))}catch(l){a(l)}},i.onerror=()=>a(new Error("imagem nao carregou")),i.src=e})}var Te="https://latex.codecogs.com/png.latex?",qe="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",Le="https://editor.codecogs.com/",zo={id:"latex",globais(o){let e=null,r=o.imagemParaDataUri??(t=>Po(o.win,t)),a=t=>M(o.doc,t);function i(){let t=e;if(!t)return;let d=t.texto.value;t.geracao+=1;let s=t.geracao;if(t.previa.replaceChildren(),t.pronta=!1,t.falhou=!1,d==="")return;let p=v("img",{src:`${Te}${encodeURI(d)}`});t.previa.append(p),r(p.getAttribute("src")??"").then(g=>{e!==t||t.geracao!==s||(p.setAttribute("src",g),p.className="img-base64",t.pronta=!0)},()=>{e===t&&t.geracao===s&&(t.falhou=!0)})}function l(){let t=e;if(!t)return!1;let d=t.texto.value;if(d==="")return a("Digite a equa\xE7\xE3o"),!1;if(t.falhou)return a("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let s=t.previa.querySelector("img");if(!t.pronta||!s)return a("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let p=t.ed,g=`<img class="img-base64" src="${C(s.getAttribute("src")??"")}" alt="${C(d)}">`;return o.adaptador.withEdit(p,()=>o.adaptador.insertHtml(p,g)),!0}function c(t){let d=o.adaptador.getInstance(t);if(!d)return;let s=v("textarea",{id:"MathText",rows:"5"});s.addEventListener("input",i);let p=v("div",{id:"latexPreview",style:"text-align:center;margin:12px;min-height:24px;"}),g=L(o.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{e=null},conteudo:B(R("Digite a equa\xE7\xE3o no formato LaTeX/Mathematics:",s),p,v("p",{style:"font-style:italic;font-size:12px;margin:0;"},"Consulte o ",v("a",{href:qe,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",v("a",{href:Le,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),v("div",{class:"spro-dialogo-rodape"},v("button",{type:"button",class:"spro-botao primario",onclick:()=>{l()&&g.fechar()}},"Inserir")))});e={ed:d,texto:s,previa:p,geracao:0,pronta:!1,falhou:!1};let n=String(o.win.getSelection?.()??"").trim();n!==""&&(s.value=n,i())}function u(){}return{updatePreviewLatex:i,openDialogLatex:c,getDialogLatex:u}}};function N(o,e,r){let a=o.adaptador.getInstance(e);if(!a)return;let i=o.adaptador.getSelectionParagraph(a);i&&o.adaptador.withEdit(a,()=>o.adaptador.insertHtmlBefore(a,i,r))}var Ie='<div class="pageBreakPro" style="page-break-after: always"></div>',Oo={id:"page-break",globais:o=>({getPageBreak:e=>N(o,e,Ie)})};var Bo=5,No=5,Fo=49,k=(o,e)=>Number.parseInt(o?.getAttribute(e)??"",10);function _e(o,e){let r=o?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(r)return r;let a=o?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(a)return a;for(let i=o?.previousElementSibling??null;i;i=i.previousElementSibling)if(i.classList.contains("divQuickTable"))return i;return e.querySelector(".divQuickTable")}var $o={id:"quick-table",globais(o){let e=o.adaptador;function r(){for(let s of o.doc.querySelectorAll(".divQuickTable"))s.replaceChildren(),z(s);for(let s of o.doc.querySelectorAll(".getQuickTableButtom"))s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")}function a(s){if(!s)return;let p=k(s,"data-row"),g=k(s,"data-col"),n=s.closest("table");if(!n)return;for(let b of n.querySelectorAll("td"))b.classList.remove("td_hover");let m=()=>[...n.querySelectorAll("tr")];if(p>=3&&k(m().at(-1)?.querySelector("td"),"data-row")>p+1&&(m().at(-1)?.remove(),n.setAttribute("data-row",String(k(n,"data-row")-1))),g>=3&&k(m().at(-1)?.lastElementChild,"data-col")>g+1){for(let b of m())b.lastElementChild?.remove();n.setAttribute("data-col",String(k(n,"data-col")-1))}for(let b of n.querySelectorAll("td"))k(b,"data-row")<=p&&k(b,"data-col")<=g&&b.classList.add("td_hover");let f=s.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(f&&(f.textContent=`Tabela ${p+1}x${g+1}`),p===k(n,"data-row")&&p<Fo){let b=m().at(-1)?.cloneNode(!0);b&&(b.querySelectorAll("td").forEach((h,w)=>{h.setAttribute("data-row",String(p+1)),h.setAttribute("data-col",String(w)),h.classList.remove("td_hover")}),(n.querySelector("tbody")??n).append(b),n.setAttribute("data-row",String(p+1)))}if(g===k(n,"data-col")&&g<Fo){for(let b of m()){let h=b.lastElementChild?.cloneNode(!0);h&&(h.setAttribute("data-col",String(g+1)),h.classList.remove("td_hover"),b.append(h))}n.setAttribute("data-col",String(g+1))}}function i(){let s=o.doc,p=s.createDocumentFragment(),g=s.createElement("div");g.className="quickTableInfo",g.textContent="Inserir Tabela";let n=s.createElement("table");n.setAttribute("data-row",String(Bo-1)),n.setAttribute("data-col",String(No-1));for(let f=0;f<Bo;f+=1){let b=s.createElement("tr");for(let h=0;h<No;h+=1){let w=s.createElement("td");w.setAttribute("data-row",String(f)),w.setAttribute("data-col",String(h)),b.append(w)}n.append(b)}let m=f=>a(f.target?.closest("td")??null);return n.addEventListener("mouseover",m),n.addEventListener("mouseout",m),n.addEventListener("click",f=>{let b=f.target?.closest("td");b&&d(b)}),p.append(g,n),p}function l(s){if(!s)return;let p=_e(s,o.doc);s.classList.contains("cke_button_on")?(r(),s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")):(p&&(p.replaceChildren(i()),P(p)),s.classList.remove("cke_button_off"),s.classList.add("cke_button_on"))}function c(s){let p=s?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),g=p?[...p.querySelectorAll(".getTablestylesButtom")]:[];g.length||(g=[...o.doc.querySelectorAll(".getTablestylesButtom")]);for(let n of g)n.classList.remove("cke_button_disabled")}function u(s,p){let g='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';g+="  <tbody>";for(let n=0;n<=s;n+=1){g+="      <tr>";for(let m=0;m<=p;m+=1)g+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';g+="      </tr>"}return`${g}  </tbody></table>`}function t(s,p){let g=p?p.nextElementSibling:e.getBodyContainer(s)?.lastElementChild,n=g?.tagName==="TABLE"?g.querySelector("td p"):null;if(!n)return;let m=n.ownerDocument,f=m.defaultView?.getSelection?.();if(!f)return;let b=m.createRange();b.setStart(n.firstChild??n,0),b.collapse(!0),f.removeAllRanges(),f.addRange(b)}function d(s){let p=e.getInstance(s);if(!p){r();return}let g=u(k(s,"data-row"),k(s,"data-col")),n=e.getSelectionParagraph(p);e.withEdit(p,()=>{if(!n)return e.insertHtml(p,g);let m=n.nextElementSibling;m?e.insertHtmlBefore(p,m,g):e.appendToBody(p,g)}),r(),c(s),t(p,n)}return{getQuickTable:l,quickTableOver:a,hideQuickTable:r,quickTableClick:d}}};var Re='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',jo={id:"session-break",globais:o=>({getSessionBreak:e=>N(o,e,Re)})};var Qo=["seiSlim","seiSlim_parent","seiSlim_view"],Go={id:"style-editor",globais(o){let e=()=>[...o.doc.querySelectorAll(".getNewStyleButton")],r=i=>{for(let l of e())l.classList.add(i?"cke_button_on":"cke_button_off"),l.classList.remove(i?"cke_button_off":"cke_button_on")};function a(i){if(i==="set"){o.win.localStorage.setItem("seiSlim_editor","true");for(let l of o.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))l.remove();o.win.insertFontIcon?.("head"),o.doc.body.classList.add(...Qo)}else o.win.localStorage.removeItem("seiSlim_editor"),o.doc.body.classList.remove(...Qo)}return{getBoxStyleEditor(i){o.win.localStorage.getItem("seiSlim_editor")?(r(!1),a("remove")):(r(!0),a("set"))},updateStyleEditor:a}}};function W(o){try{let e=new URL(o);return e.protocol==="http:"||e.protocol==="https:"}catch{return!1}}var Vo=/^[0-9A-Za-z-]+$/,De="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",He=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,Uo={id:"tiny-url",globais(o){let e=c=>M(o.doc,c),r=c=>(o.fetch??o.win.fetch.bind(o.win))(c);async function a(c,u,t,d){let s=new URLSearchParams({url:c});u!==""&&s.set("alias",u);let p;try{p=await r(`https://tinyurl.com/api-create.php?${s}`)}catch{return e("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(p.status===400)return e("Erro: Nenhuma link gerado"),!1;if(p.status===422)return e("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let g=(await p.text()).trim();if(p.status!==200||!He.test(g))return e("Erro: Nenhuma link gerado"),!1;if(t==="setinput")return o.win.setInputTinyUrl?.(g),!0;let n=d??o.adaptador.getInstance();if(!n)return!1;let m=`<a href="${C(g)}" class="ancoraSei" target="_blank">${C(g)}</a>`;return o.adaptador.withEdit(n,()=>o.adaptador.insertHtml(n,m)),!0}function i(c){let u=o.adaptador.getInstance(c);if(!u)return;let t=v("input",{type:"text",id:"urlTiny"}),d=v("input",{type:"text",id:"aliasTiny"}),s=v("div",{id:"tinyResult"}),p=String(o.win.getSelection?.()??"").trim();p!==""&&W(p)&&(t.value=p),d.addEventListener("input",()=>{s.replaceChildren();let n=d.value;n!==""&&(Vo.test(n)?s.append(`Resultado: https://tinyurl.com/${n}`):s.append(v("strong",{style:"color:red;"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let g=L(o.doc,{titulo:"Gerar link curto do TinyURL",conteudo:B(R("Insira o link que deseja encurtar:",t),R("Insira um Nome Personalizado para o link (opcional):",d),s,v("div",{class:"spro-dialogo-rodape"},v("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let n=t.value.trim(),m=d.value.trim();if(n===""||!W(n))return e("Digite um link v\xE1lido!");if(m!==""&&!Vo.test(m))return e(De);if(m!==""&&m.length<5)return e("O nome personalizado deve ter mais de 4 (quatro) caracteres");await a(n,m,"insert",u)&&g.fechar()}},"Inserir")))})}return{getTinyUrl:i,ajaxTinyUrl:(c,u,t)=>a(c,u,t)}}};var X=[Ho,Oo,jo,Ao,ko,uo,Lo,Go,$o,qo,Uo,zo];function Ko(o,e,r){let a=o,i=[],l=[];for(let c of e){let u=!0;try{for(let[t,d]of Object.entries(c.globais(r))){if(a[t]!==void 0){u=!1,l.push({id:c.id,erro:new Error(`global ja definido: ${t}`)});continue}a[t]=d}}catch(t){u=!1,l.push({id:c.id,erro:t})}u&&i.push(c.id);try{a.SeiProEditorAdapter?.registerFeature?.({id:c.id})}catch{}}return{instalados:i,falhas:l}}function Jo(o,e){let r=[];for(let a of o)try{a.iniciar?.(e)}catch(i){r.push({id:a.id,erro:i})}return r}var Wo=`/*
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
`;U(Wo);var Xo="__seiProEditorTs",Yo=window;if(!Yo[Xo]){Yo[Xo]=!0;let o=eo(window);o.aoRecusarEscrita(()=>M(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let e={adaptador:o,doc:document,win:window,base:document.currentScript?.getAttribute(to)??"",checkOpcao:r=>io(r),verifyOpcao:r=>lo(r)};for(let r of Ko(window,X,e).falhas)console.warn(`[SEIPro] recurso ${r.id} nao instalado:`,r.erro);o.waitReady(2e4).then(()=>{for(let r of Jo(X,e))console.warn(`[SEIPro] recurso ${r.id} falhou ao iniciar:`,r.erro)}).catch(r=>console.warn("[SEIPro] editor nao detectado:",r))}})();
