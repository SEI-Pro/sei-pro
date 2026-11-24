/* GERADO por editor/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Ee(e,o){let t=e.defaultView?.DOMParser??globalThis.DOMParser,n=new t().parseFromString(`<!doctype html><html><body>${o}</body></html>`,"text/html");return Array.from(n.body.childNodes).map(r=>e.importNode(r,!0))}function po(e,o){if(!e||typeof o!="function")return;let t=e,n=t.__seiProCtxBuilders;if(!n){let r=[];n=t.__seiProCtxBuilders=r,e.addEventListener("contextmenu",i=>{let l=i;if(l.shiftKey)return;let c=[];for(let a of r)try{c=c.concat(a(l.target)||[])}catch{}c.length&&(l.preventDefault(),$a(e.ownerDocument,c,l.clientX,l.clientY))})}n.includes(o)||n.push(o)}function $a(e,o,t,n){e.getElementById("seiProCtxMenu")?.remove();let r=e.createElement("div");r.id="seiProCtxMenu",r.style.cssText="position:fixed;z-index:2147483647;background:#fff;border:1px solid #ccc;box-shadow:0 2px 8px rgba(0,0,0,.2);border-radius:4px;padding:4px 0;min-width:160px;font:13px sans-serif;",r.style.left=`${t}px`,r.style.top=`${n}px`;for(let l of o){let c=e.createElement("div");c.textContent=l.label,c.style.cssText="padding:6px 14px;cursor:pointer;white-space:nowrap;",c.addEventListener("mouseenter",()=>{c.style.background="#eef"}),c.addEventListener("mouseleave",()=>{c.style.background=""}),c.addEventListener("click",()=>{r.remove(),l.action()}),r.append(c)}e.body.append(r);let i=()=>{r.remove(),e.removeEventListener("mousedown",i)};setTimeout(()=>e.addEventListener("mousedown",i),0)}function Rt(e,o,t){if(typeof t!="function")return;let n=e.__seiProCtx;if(!n){let r={acoes:{},construtores:[]};n=e.__seiProCtx=r;try{e.addMenuGroup("seiProGroup",5)}catch{}e.contextMenu.addListener(i=>{let l=i?.$??null,c=null;for(let a of r.construtores){let u=[];try{u=a(l)||[]}catch{u=[]}for(let s of u){let g=`seiPro_${String(s.label).replace(/[^A-Za-z0-9]/g,"_")}`;r.acoes[g]=s.action,e.getCommand(g)||e.addCommand(g,{exec:()=>(r.acoes[g]?.(),!0)}),e.getMenuItem(g)||e.addMenuItem(g,{label:s.label,command:g,group:"seiProGroup"}),c=c??{},c[g]=o}}return c})}n.construtores.includes(t)||n.construtores.push(t)}var he=e=>e;function Dt(e,o={}){let t=()=>e.CKEDITOR,n=a=>!!a?.name&&t()?.instances[a.name]===a,r=a=>n(a)&&!a.readOnly,i=a=>he(a).document?.getBody()?.$??null,l=(a,u)=>{if(!a)return;let s=he(a);if(s.readOnly){o.fn?.();return}u(s)},c={versao:4,getInstance(a){let u=t();if(!u?.instances)return null;if(n(u.currentInstance))return u.currentInstance;let s=a?.closest?.("div.cke"),g=s?u.instances[s.id.replace("cke_","")]:void 0;if(r(g))return g;if(r(e.oEditor))return e.oEditor;let x=Object.values(u.instances);return x.find(p=>r(p))??x[0]??null},getAllInstances:()=>Object.values(t()?.instances??{}),focus:a=>he(a).focus(),saveSnapshot:a=>he(a).fire("saveSnapshot"),withEdit(a,u){let s=he(a);s.focus(),s.fire("saveSnapshot"),s.fire("lockSnapshot",{dontUpdate:!0});try{u()}finally{s.fire("unlockSnapshot"),s.fire("saveSnapshot")}},insertHtml:(a,u)=>l(a,s=>s.insertHtml(u)),insertText:(a,u)=>l(a,s=>s.insertText(u)),getSelectionElement:a=>he(a).getSelection()?.getStartElement()?.$??null,getSelectionParagraph(a){return c.getSelectionElement(a)?.closest("p")??null},insertHtmlBefore(a,u,s){l(a,()=>u.before(...Ee(u.ownerDocument,s)))},getToolbarContainer:a=>he(a).container?.$.querySelector("span.cke_toolbox")??null,getBodyContainer:a=>i(a),findInBody(a,u){let s=i(a);return s?Array.from(s.querySelectorAll(u)):[]},appendToBody(a,u){l(a,s=>{let g=i(s);g&&g.append(...Ee(g.ownerDocument,u))})},transformBodyHtml(a,u){l(a,s=>{let g=i(s);if(!g)return;let x=g.innerHTML,p=u(x);typeof p=="string"&&p!==x&&g.replaceChildren(...Ee(g.ownerDocument,p))})},execCommand:(a,u,s)=>he(a).execCommand(u,s),applyStyle(a,u){let s=t()?.style;s&&he(a).applyStyle(new s(u))},getData:a=>he(a).getData(),setData:(a,u)=>l(a,s=>s.setData(u)),insertElement(a,u){l(a,s=>{let g=t()?.dom?.element.createFromHtml;g&&s.insertElement?s.insertElement(g(u,s.document)):s.insertHtml(u)})},saveSelection:a=>he(a).getSelection()?.createBookmarks(!0)??null,restoreSelection(a,u){let s=he(a).getSelection();s&&u&&s.selectBookmarks(u)},getSelectedText:a=>he(a).getSelection()?.getSelectedText()??"",getSelectedHtml(a){return he(a).getSelectedHtml?.()?.getHtml?.()??""},on:(a,u,s)=>he(a).on(u,s),off:(a,u,s)=>he(a).removeListener(u,s),fire:(a,u,s)=>he(a).fire(u,s),addContextMenu(a,u){let s=he(a),g=t();if(g&&s.contextMenu&&typeof s.addMenuItem=="function"){Rt(s,g.TRISTATE_OFF,u);return}po(i(a),u)},waitReady(a){return new Promise((u,s)=>{let g=Date.now(),x=()=>{let p=Object.values(t()?.instances??{}).find(b=>b.status==="ready");if(p)return u(p);if(Date.now()-g>a)return s(new Error("Timeout aguardando CKEditor 4"));setTimeout(x,100)};x()})},somenteLeitura:a=>!!he(a).readOnly,aoRecusarEscrita(a){o.fn=a},recusarEscrita(){o.fn?.()}};return c}var me=e=>e,Oa={strike:"strikethrough",strikethrough:"strikethrough"},Ha={strong:"bold",b:"bold",em:"italic",i:"italic",u:"underline",s:"strikethrough",strike:"strikethrough"},za=0;function Nt(e,o={}){let t=e.document,n=p=>Array.from(p.model.document.roots??[]).filter(b=>b.isAttached()&&b.rootName!=="$graveyard"),r=p=>e.INFRA_EDITOR_CONFIG?.rootsAttributes?.[p],i=(p,b)=>{let d=p.editing.view.document.getRoot(b);return d?p.editing.view.domConverter.mapViewToDom(d):null},l=p=>{for(let h of n(p))if(r(h.rootName)?.principal){let A=i(p,h.rootName);if(A)return A}let b=t.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');return b||Array.from(t.querySelectorAll(".ck-editor__editable_inline")).reduce((h,A)=>A.childElementCount>(h?h.childElementCount:-1)?A:h,null)},c=p=>{let b=l(p);return b&&n(p).find(d=>i(p,d.rootName)===b)||null},a=p=>p.model.document.selection.getFirstPosition()?.root.rootName??null,u=p=>!!p&&!!r(p)?.somenteLeitura,s=(p,b)=>p.data.toModel(p.data.processor.toView(b)),g=(p,b)=>{let d=me(p);if(u(a(d)))return o.fn?.();d.model.change(()=>d.model.insertContent(s(d,b),d.model.document.selection))},x={versao:5,getInstance(){let p=t.querySelector(".ck-editor__editable_inline")?.ckeditorInstance;return p&&p.state==="ready"?p:null},getAllInstances(){let p=x.getInstance();return p?[p]:[]},focus:p=>me(p).focus(),saveSnapshot(){},withEdit(p,b){let d=me(p);d.focus(),d.model.change(()=>b())},insertHtml:g,insertText(p,b){let d=me(p);if(u(a(d)))return o.fn?.();d.model.change(h=>d.model.insertContent(h.createText(b)))},getSelectionElement(){let p=e.getSelection?.(),b=p&&p.rangeCount>0?p.anchorNode:null;return b?b.nodeType===1?b:b.parentElement:null},getSelectionParagraph:p=>x.getSelectionElement(p)?.closest("p")??null,insertHtmlBefore(p,b,d){let h=me(p),A=h.editing.view.domConverter.mapDomToView(b),E=A?h.editing.mapper.toModelElement(A):null;if(E){if(u(E.root?.rootName))return o.fn?.();h.model.change(w=>h.model.insertContent(s(h,d),w.createPositionBefore(E)));return}g(p,d)},getToolbarContainer(p){let b=me(p).ui?.view?.toolbar?.element;return b?b.querySelector(".ck-toolbar__items")??b:null},getBodyContainer:p=>l(me(p)),findInBody(p,b){let d=l(me(p));return d?Array.from(d.querySelectorAll(b)):[]},appendToBody(p,b){let d=me(p),h=c(d);if(!h)return g(p,b);if(u(h.rootName))return o.fn?.();d.model.change(A=>d.model.insertContent(s(d,b),A.createPositionAt(h,"end")))},transformBodyHtml(p,b){let d=me(p),h=c(d);if(!h)return;let A=d.data.get({rootName:h.rootName,seiProInterno:!0}),E=b(A);if(typeof E!="string"||E===A)return;let w=d.model.document.selection.getFirstRange(),y=w&&w.start.root.rootName===w.end.root.rootName?{raiz:w.start.root,ps:[...w.start.path],pe:[...w.end.path]}:null,S=d.model.document.selection.isBackward;d.data.set({[h.rootName]:E}),y&&d.model.change(D=>{let H,O;try{H=d.model.createPositionFromPath(y.raiz,y.ps),O=d.model.createPositionFromPath(y.raiz,y.pe)}catch{H=O=D.createPositionAt(y.raiz,"end")}D.setSelection(D.createRange(H,O),{backward:S})})},execCommand(p,b,d){me(p).execute(Oa[b]??b,d!==void 0?{value:d}:void 0)},applyStyle(p,b){let d=Ha[b.element.toLowerCase()];d&&me(p).execute(d)},getData(p){let b=me(p),d=c(b);return d?b.data.get({rootName:d.rootName}):b.data.get()},setData(p,b){let d=me(p),h=c(d);h?d.data.set({[h.rootName]:b}):d.data.set(b)},insertElement:(p,b)=>x.insertHtml(p,b),saveSelection(p){let b=me(p),d=`spro-ed:${za++}`;return b.model.change(h=>{let A=b.model.document.selection.getFirstRange();A&&h.addMarker(d,{range:A,usingOperation:!1})}),d},restoreSelection(p,b){let d=me(p);if(typeof b!="string")return;let h=d.model.markers.get(b);h&&d.model.change(A=>A.setSelection(h.getRange())),d.model.change(A=>{d.model.markers.has(b)&&A.removeMarker(b)})},getSelectedText:()=>String(e.getSelection?.()??""),getSelectedHtml(){let p=e.getSelection?.();if(!p||p.rangeCount===0)return"";let b=t.createElement("div");return b.append(p.getRangeAt(0).cloneContents()),b.innerHTML},on(p,b,d){if(b==="change")return me(p).model.document.on("change:data",d);l(me(p))?.addEventListener(b,d)},off(p,b,d){if(b==="change")return me(p).model.document.off("change:data",d);l(me(p))?.removeEventListener(b,d)},fire(p,b,d){l(me(p))?.dispatchEvent(new CustomEvent(b,{detail:d}))},addContextMenu(p,b){po(l(me(p)),b)},waitReady(p){return new Promise((b,d)=>{let h=Date.now(),A=()=>{let E=x.getInstance();if(E)return b(E);if(Date.now()-h>p)return d(new Error("Timeout aguardando CKEditor 5"));setTimeout(A,100)};A()})},somenteLeitura:p=>u(a(me(p))),aoRecusarEscrita(p){o.fn=p},recusarEscrita(){o.fn?.()}};return x}function Ro(e){return e.document.querySelector(".ck-editor__editable")?5:e.CKEDITOR?.instances?4:0}function qt(e){let o=null,t={},n=()=>{if(o)return o;let l=Ro(e);return l===5?o=Nt(e,t):l===4&&(o=Dt(e,t)),o},r=()=>{let l=n();if(!l)throw new Error("Editor ainda nao detectado (nem CK4 nem CK5)");return l},i=l=>((...c)=>r()[l](...c));return{get versao(){return n()?.versao??0},getInstance:l=>n()?.getInstance(l)??null,getAllInstances:()=>n()?.getAllInstances()??[],focus:i("focus"),saveSnapshot:i("saveSnapshot"),withEdit:i("withEdit"),insertHtml:i("insertHtml"),insertText:i("insertText"),getSelectionElement:i("getSelectionElement"),getSelectionParagraph:i("getSelectionParagraph"),insertHtmlBefore:i("insertHtmlBefore"),getToolbarContainer:i("getToolbarContainer"),getBodyContainer:i("getBodyContainer"),findInBody:i("findInBody"),appendToBody:i("appendToBody"),transformBodyHtml:i("transformBodyHtml"),execCommand:i("execCommand"),applyStyle:i("applyStyle"),getData:i("getData"),setData:i("setData"),insertElement:i("insertElement"),saveSelection:i("saveSelection"),restoreSelection:i("restoreSelection"),getSelectedText:i("getSelectedText"),getSelectedHtml:i("getSelectedHtml"),on:i("on"),off:i("off"),fire:i("fire"),addContextMenu:i("addContextMenu"),somenteLeitura:i("somenteLeitura"),aoRecusarEscrita(l){t.fn=l},recusarEscrita(){t.fn?.()},waitReady(l){let c=Date.now();return new Promise((a,u)=>{let s=()=>{let g=n();if(g)return g.waitReady(Math.max(1,l-(Date.now()-c))).then(a,u);if(Date.now()-c>l)return u(new Error("Editor nao detectado (nem CK4 nem CK5)"));setTimeout(s,100)};s()})}}}var $t="data-base";function Ot(e,o){let t=e;if(typeof e=="string"){if(!e.trim())return;try{t=JSON.parse(e)}catch{return}}return!Array.isArray(t)||t.length===0?void 0:t.map(r=>r?.configGeral).find(Array.isArray)?.find(r=>r?.name===o)?.value}function Ht(e,o){let t=Ot(e,o);return!(t===!1||t===0||t==="")}function zt(e,o){let t=Ot(e,o);return t===!0||t===1||t==="1"}function Bt(e=localStorage){try{return e.getItem("configBasePro")}catch{return null}}function Ft(e,o=localStorage){return Ht(Bt(o),e)}function jt(e,o=localStorage){return zt(Bt(o),e)}function mo(e){e.style.display="",e.ownerDocument.defaultView?.getComputedStyle?.(e)?.display==="none"&&(e.style.display="block")}function go(e){e.style.display="none"}var Qt=e=>(e?.nodeType===1?e:e?.parentElement??null)?.closest("p")??null;function Ut(e){let o=()=>e.adaptador.versao===5,t=(n,r)=>{let i=n.editing.view.domConverter.mapDomToView(r);return i?n.editing.mapper.toModelElement(i):null};return{selecionados(n){let r=()=>{let p=e.adaptador.getSelectionParagraph(n);return p?[p]:[]};if(o()){let p=n,d=[...p.model.document.selection.getSelectedBlocks()].map(h=>{let A=p.editing.mapper.toViewElement(h);return A?p.editing.view.domConverter.mapViewToDom(A):null}).filter(h=>!!h&&h.tagName==="P");return d.length?d:r()}let l=e.adaptador.getBodyContainer(n)?.ownerDocument?.getSelection?.();if(!l||l.rangeCount===0||!l.anchorNode)return r();let c=Qt(l.anchorNode),a=Qt(l.focusNode);if(!c&&!a||(c=c??a,a=a??c,!c||!a))return r();if(c===a)return[c];let u=c,s=a;c.compareDocumentPosition(a)&2&&(u=a,s=c);let g=[],x=u;for(let p=0;x&&p<5e3&&(x.tagName.toLowerCase()==="p"&&g.push(x),x!==s);p+=1)x=x.nextElementSibling;return g.length?g:[u]},classeDeEstilo(n,r){return o()?t(n,r)?.getAttribute("estilo")??"":r.getAttribute("class")??""},definirClasse(n,r,i){if(o()){let l=n,c=t(l,r);c&&l.model.change(a=>a.setAttribute("estilo",i,c)),e.win.SeiProGhs?.setEstilos(r,{"text-align":null},n);return}r.removeAttribute("style"),r.setAttribute("class",i)},definirTextAlign(n,r,i){if(o()){e.win.SeiProGhs?.setEstilos(r,{"text-align":i},n);return}r.removeAttribute("style"),r.style.textAlign=i}}}var Ba=[{left:"Texto_Alinhado_Esquerda",center:"Texto_Centralizado",right:"Texto_Alinhado_Direita",justify:"Texto_Justificado"},{left:"Tabela_Texto_Alinhado_Esquerda",center:"Tabela_Texto_Centralizado",right:"Tabela_Texto_Alinhado_Direita",justify:"Tabela_Texto_Justificado"},{left:"Texto_Alinhado_Esquerda_Maiusc",center:"Texto_Centralizado_Maiusculas",right:"Texto_Alinhado_Direita_Maiusc",justify:"Texto_Justificado_Maiusculas"}];function Fa(e,o){let t=Ba.find(n=>Object.values(n).includes(e));return t?t[o]:null}function ja(e,o){let t=e?.closest(".cke_top")?.querySelector(".divAlignText");if(t)return t;for(let n=e?.parentElement??null;n;n=n.parentElement){let r=n.querySelector(".divAlignText");if(r)return r}return o.querySelector(".divAlignText")}var Vt={id:"align",globais(e){let o=Ut(e);return{setAlignText(t,n){let r=e.adaptador.getInstance(t);if(!r||e.adaptador.somenteLeitura(r))return;let i=o.selecionados(r);i.length&&e.adaptador.withEdit(r,()=>{for(let l of i){let c=Fa(o.classeDeEstilo(r,l),n);c?o.definirClasse(r,l,c):o.definirTextAlign(r,l,n)}})},openAlignText(t){if(!t)return;let n=ja(t,e.doc);t.classList.contains("cke_button_on")?(t.classList.replace("cke_button_on","cke_button_off"),n&&go(n)):(t.classList.remove("cke_button_off"),t.classList.add("cke_button_on"),n&&mo(n))},closeAlignText(){for(let t of e.doc.querySelectorAll(".getAlignButtom"))t.classList.remove("cke_button_on"),t.classList.add("cke_button_off");for(let t of e.doc.querySelectorAll(".divAlignText"))t.style.display="none"}}}};var Do=["contenteditable","spellcheck","data-editor","data-processed","data-complete","data-hveid"],No=["data-cke-saved-","data-sfc-","data-copy-service"],qo=["cke_","dark-mode-"],Wt=["contenteditable"],Qa=/<[^>]*\s(on[a-z]+\s*=|(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)\s*=\s*["']?[\s\u0000- ]*(javascript|vbscript|livescript|data\s*:\s*text\/html))/i,Ua=/^[\s\u0000- ]*(javascript|vbscript|livescript|data\s*:\s*text\/html)/i,Va=/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,$o=(e,o)=>!!e&&e.indexOf(o)!==-1;function fo(e,o,t){let n=r=>{let i=(r&255).toString(16);return i.length===1?`0${i}`:i};return`#${n(e)}${n(o)}${n(t)}`}function Kt(e,o=fo){return e&&e.replace(/rgba?\(\s*(\d+)(?:\s*,\s*|\s+)(\d+)(?:\s*,\s*|\s+)(\d+)\s*(?:[,/]\s*([\d.]+)(%?)\s*)?\)/gi,(t,n,r,i,l,c)=>{let a=Number.parseInt(n,10),u=Number.parseInt(r,10),s=Number.parseInt(i,10),g=l?Number.parseFloat(l)/(c?100:1):1;if(Number.isNaN(g)||g>=1)return o(a,u,s);if(g<=0)return"transparent";let x=p=>Math.round(g*p+(1-g)*255);return o(x(a),x(u),x(s))})}function Oo(e,o){return/rgba?\(|cke_protected|data-cke-saved|data-sfc|data-copy-service|data-hveid|dark-mode-|\sspellcheck|\bcke_/i.test(e)||Qa.test(e)?!0:!$o(o,"contenteditable")&&/\scontenteditable/i.test(e)}function Jt(e,o){for(let t of Array.from(e.childNodes))t.nodeType===8?/cke_protected/.test(t.nodeValue??"")&&o.push(t):t.nodeType===1&&Jt(t,o)}function Xt(e,o,t=fo){let n=[];Jt(e,n);for(let i of n)i.parentNode?.removeChild(i);let r=e.querySelectorAll("*");for(let i=0;i<r.length;i++){let l=r[i];for(let a of Do)$o(o,a)||l.hasAttribute(a)&&l.removeAttribute(a);for(let a of Array.from(l.attributes)){let u=a.name;if(/^on/i.test(u)||Va.test(u)&&Ua.test(a.value||"")){l.removeAttribute(u);continue}for(let s of No)if(u.indexOf(s)===0){l.removeAttribute(u);break}}if(l.classList?.length){for(let a of Array.from(l.classList))for(let u of qo)if(a.indexOf(u)===0){l.classList.remove(a);break}l.classList.length||l.removeAttribute("class")}let c=l.getAttribute("style");c&&/rgba?\(/i.test(c)&&l.setAttribute("style",Kt(c,t))}return e}function Ga(e,o,t,n=fo){if(typeof e!="string"||e===""||!Oo(e,o))return e;let r=new t().parseFromString(`<!doctype html><html><body>${e}</body></html>`,"text/html");return Xt(r.body,o,n),r.body.innerHTML}var oo=e=>e,Wa='.cke_button__save, button[data-cke-tooltip-text*="Salvar"], button[aria-label*="Salvar"], #divInfraBarraComandosSuperior button';function Gt(e){let o=e.adaptador,t=e.win,n=()=>e.doc.defaultView?.DOMParser??globalThis.DOMParser,r=(d,h,A)=>typeof t.rgbToHex=="function"?t.rgbToHex(d,h,A):fo(d,h,A),i=()=>Wt,l=(d,h)=>Ga(d,h,n(),r),c=d=>Kt(d,r),a=(d,h)=>Xt(d,h,r);function u(d){let h=d||o.getInstance();if(!h)return!1;let A=o.getData(h),E=l(A,i());return E===A?!1:(o.setData(h,E),typeof t.enableButtonSavePro=="function"&&t.enableButtonSavePro(),!0)}function s(d){let h=oo(d);if(!h._limpezaProEmAndamento){h._limpezaProEmAndamento=!0;try{o.transformBodyHtml(d,A=>l(A,i()))}catch{}setTimeout(()=>{h._limpezaProEmAndamento=!1},0)}}function g(d){let h=oo(d).dataProcessor;if(!h?.htmlFilter||typeof h.htmlFilter.addRules!="function")return!1;let A=i();return h.htmlFilter.addRules({elements:{$:E=>{let w=E.attributes;if(w){for(let y in w)if(!(!Object.hasOwn(w,y)||$o(A,y))){if(Do.indexOf(y)!==-1){delete w[y];continue}for(let S of No)if(S!=="data-cke-saved-"&&y.indexOf(S)===0){delete w[y];break}}if(typeof w.class=="string"){let y=w.class.split(/\s+/).filter(S=>{if(!S)return!1;for(let D of qo)if(S.indexOf(D)===0)return!1;return!0});y.length?w.class=y.join(" "):delete w.class}typeof w.style=="string"&&/rgba?\(/i.test(w.style)&&(w.style=c(w.style))}}}},{applyToAll:!0}),!0}function x(d){let h=oo(d).data;if(!h||typeof h.on!="function")return!1;let A=i();return h.on("get",(E,w)=>{w?.[0]?.seiProInterno||typeof E.return=="string"&&(E.return=l(E.return,A))},{priority:"low"}),!0}function p(d){let h=oo(d);h._limpezaProSalvarHook||(h._limpezaProSalvarHook=!0,e.doc.addEventListener("mousedown",A=>{let E=A.target,w=!1;try{w=!!E?.closest?.(Wa)}catch{w=!1}w&&s(d)}))}function b(d){if(!d)return;let h=oo(d);if(h._limpezaProRegistrada||(h._limpezaProRegistrada=!0,h.model&&x(d)))return;if(!h.model&&g(d)){o.on(d,"paste",E=>{let w=E;w?.data&&typeof w.data.dataValue=="string"&&(w.data.dataValue=l(w.data.dataValue,i()))});return}o.on(d,"paste",E=>{let w=E;if(w?.data&&typeof w.data.dataValue=="string"){w.data.dataValue=l(w.data.dataValue,i());return}setTimeout(()=>s(d),0)}),p(d);let A=!1;o.on(d,"change",()=>{h._limpezaProEmAndamento||A||(A=!0,setTimeout(()=>{A=!1;let E=o.getData(d);typeof E=="string"&&Oo(E,i())&&s(d)},400))})}return{limparHtmlPro:l,rgbParaHexPro:c,limparRaizPro:a,limparEditorPro:u,registrarLimpezaAutomaticaPro:b}}var Zt={id:"auto-cleanup",globais(e){let o=Gt(e);return{ATRIBUTOS_LIXO_PRO:Do,PREFIXOS_ATRIBUTO_LIXO_PRO:No,PREFIXOS_CLASSE_LIXO_PRO:qo,ATRIBUTOS_PRESERVADOS_CK4_PRO:Wt,precisaLimparEditorPro:Oo,rgbParaHexPro:o.rgbParaHexPro,limparRaizEditorPro:o.limparRaizPro,limparHtmlEditorPro:o.limparHtmlPro,limparEditorPro:o.limparEditorPro,registrarLimpezaAutomaticaPro:o.registrarLimpezaAutomaticaPro}},iniciar(e){if(e.adaptador.versao===5)try{Gt(e).registrarLimpezaAutomaticaPro(e.adaptador.getInstance())}catch{}}};function f(e,o={},...t){let n=document.createElement(e);for(let[r,i]of Object.entries(o))i===void 0||i===!1||(typeof i=="function"?n.addEventListener(r.replace(/^on/,""),i):i===!0?n.setAttribute(r,""):r==="class"?n.className=i:r==="value"&&e==="textarea"?n.value=i:n.setAttribute(r,i));for(let r of t)r!=null&&r!==!1&&n.append(r);return n}var Te={fill:"currentColor",stroke:"none"},Yt="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",er={estrela:[["path",{d:Yt}]],estrelaCheia:[["path",{d:Yt,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...Te}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...Te}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...Te}],["circle",{cx:"12",cy:"12",r:"1.4",...Te}],["circle",{cx:"19",cy:"12",r:"1.4",...Te}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...Te}],["circle",{cx:"15",cy:"6",r:"1.3",...Te}],["circle",{cx:"9",cy:"12",r:"1.3",...Te}],["circle",{cx:"15",cy:"12",r:"1.3",...Te}],["circle",{cx:"9",cy:"18",r:"1.3",...Te}],["circle",{cx:"15",cy:"18",r:"1.3",...Te}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},oc=Object.keys(er);function fe(e,o=18,t=document){let n="http://www.w3.org/2000/svg",r=t.createElementNS(n,"svg"),i={viewBox:"0 0 24 24",width:String(o),height:String(o),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[l,c]of Object.entries(i))r.setAttribute(l,c);for(let[l,c]of er[e]){let a=t.createElementNS(n,l);for(let[u,s]of Object.entries(c))a.setAttribute(u,s);r.append(a)}return r}function Ka(e){return e===void 0?[]:"rotulo"in e?[e]:[...e]}function or(e){let o=[...e.querySelectorAll("dialog[open]")],t=!0;return o.filter(i=>{try{return i.matches(":modal")}catch{return t=!1,!1}}).at(-1)??(t?void 0:o.at(-1))??e.body??e.documentElement}function tr(e,o,t,n,r){let i=e.body??e.documentElement;for(let g of[i,...e.querySelectorAll("dialog")])for(let x of[...g.children])x.classList.contains("spro-aviso")&&x.remove();let l=f("div",{class:"spro-aviso",role:"status"},fe("check",16),f("span",{},o),...Ka(t).map(g=>f("button",{type:"button",onclick:()=>{l.remove(),g.fazer()}},g.rotulo)));l.setAttribute("popover","manual");let c=()=>{try{l.showPopover?.()}catch{}},a=Date.now()+n,u=()=>{let g=or(e);g.append(l),c(),g.localName==="dialog"&&g.addEventListener("close",()=>{if(!(!s||!g.contains(l))){if(r&&or(e).localName!=="dialog"&&r(o,t,Math.max(0,a-Date.now()))){s=!1,l.remove();return}u()}},{once:!0})},s=!0;return u(),setTimeout(()=>{s=!1,l.remove()},n),l}var Ja=".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, .spro-combo, .spro-botao.primario)";function bo(e={}){return({titulo:o,conteudo:t,icone:n,largura:r,aoFechar:i})=>{let l=f("dialog",{class:"spro-dialogo","aria-label":o});r&&(l.style.width=`min(${r}px, calc(100vw - 24px))`);let c=()=>{l.open&&l.close()};return l.append(f("header",{},n?f("span",{class:"spro-dialogo-icone","aria-hidden":"true"},fe(n,18)):null,f("h2",{},o),f("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:c},fe("fechar",16))),f("div",{class:"spro-dialogo-corpo"},t)),l.addEventListener("close",()=>{l.remove(),e.aoFechar?.(),i?.()}),document.body.append(l),e.aoAbrir?.(),l.showModal(),l.querySelector(Ja)?.focus({preventScroll:!0}),{fechar:c}}}function rr(e){return(o,t="Confirmar",n="Cancelar")=>new Promise(r=>{let i=!1,l=null,c=f("div",{},f("p",{},o),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao",onclick:()=>l?.fechar()},n),f("button",{type:"button",class:"spro-botao perigo",onclick:()=>{i=!0,l?.fechar()}},t)));l=e({titulo:"Confirmar",icone:"alerta",conteudo:c,aoFechar:()=>r(i)})})}function nr(e){let o=bo();return(t,n)=>(zo(t,e),Ho(t),o(n))}function Ho(e){let o=e.documentElement.getAttribute("data-spro-tema")==="escuro";try{o||=!!e.defaultView?.localStorage?.getItem("darkModePro")}catch{}e.documentElement.setAttribute("data-tema",o?"escuro":"claro")}function zo(e,o){if(e.querySelector('style[data-seipro-editor="base"]'))return;let t=e.createElement("style");t.setAttribute("data-seipro-editor","base"),t.textContent=o,(e.head??e.documentElement).append(t)}var Bo="";function Fo(e){Bo=e}var te=(e,o)=>nr(Bo)(e,o);function ho(e){zo(e,Bo),Ho(e)}function Y(e,o){ho(e),tr(e,o,void 0,7e3)}var Xa=new Set(["a","\xE0","algo","algu\xE9m","algum","alguma","algumas","alguns","ao","aos","aquela","aquelas","aquele","aqueles","aquilo","as","\xE0s","cada","certa","certas","certo","certos","com","comigo","como","conosco","consigo","contigo","convosco","cuja","cujas","cujo","cujos","da","das","de","dessa","dessas","desse","desses","desta","destas","do","dos","dum","duma","dumas","duns","e","\xE9","ela","elas","ele","eles","em","entre","essa","essas","esse","esses","esta","estas","este","estes","eu","isso","isto","la","las","lhe","lhes","lo","los","me","mesma","mesmas","mesmo","mesmos","meu","meus","mim","minha","minhas","muita","muitas","muito","muitos","na","nada","n\xE3o","nas","nenhum","nenhuma","nenhumas","nenhuns","ningu\xE9m","no","nos","n\xF3s","nossa","nossas","nosso","nossos","num","numa","numas","nuns","o","onde","os","ou","outra","outras","outrem","outro","outros","para","pela","pelas","pelo","por","pouca","poucas","pouco","poucos","quais","quaisquer","qual","qualquer","quando","quanta","quantas","quanto","quantos","que","quem","s\xE3o","se","seja","sem","seu","seus","si","sob","sobre","sua","suas","tanta","tantas","tanto","tantos","te","teu","teus","ti","toda","todas","todo","todos","tu","tua","tuas","tudo","um","uma","umas","uns","v\xE1ria","v\xE1rias","v\xE1rio","v\xE1rios","voc\xEA","voc\xEAs","vos","v\xF3s","vossa","vossas","vosso","vossos"," "," "," ","","0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"]),ar=new Map([["I",1],["V",5],["X",10],["L",50],["C",100],["D",500],["M",1e3]]);function Za(e){let o=0,t=e.split("");return t.forEach((n,r)=>{let i=ar.get(n),l=ar.get(t[r+1]);o+=i<l?-i:i}),o}function je(e){return!e||typeof e!="string"||e.trim()===""?"":e.includes(" ")?e.split(" ").map((o,t)=>o===""?o:Xa.has(o.toLowerCase())&&t!==0?o.toLowerCase():Za(o)>0?o.toUpperCase():o[0].toUpperCase()+o.substring(1).toLowerCase()).join(" "):e[0].toUpperCase()+e.substring(1).toLowerCase()}function ne(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ir={id:"cap-letter",globais:e=>({convertFirstLetter(o){let t=e.adaptador.getInstance(o);if(!t)return;let n=e.adaptador.getSelectedText(t);if(!n||n.trim()===""){Y(e.doc,"Selecione um texto para converter");return}e.adaptador.insertHtml(t,ne(je(n)))}})};var sr="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";function Le(e){let o=new Uint32Array(Math.max(0,e));crypto.getRandomValues(o);let t="";for(let n of o)t+=sr[n%sr.length];return t}var Ya=()=>`<span class="ancoraSei checkboxSEI" data-id="${Le(16)}" style="font-size: 1.5em;font-weight: bold;">&#9744;</span>&nbsp;`,lr={id:"checkbox",globais:e=>({getInsertCheckboxButtom(o){let t=e.adaptador.getInstance(o);t&&e.adaptador.withEdit(t,()=>e.adaptador.insertHtml(t,Ya()))}})};function re(...e){return f("div",{class:"spro-form"},...e)}function le(e,...o){return f("div",{class:e==="auto"?"spro-grade":`spro-grade ${e}`},...o)}function ce(...e){return f("p",{class:"spro-dica"},...e)}var ei=new Set(["text","number","date","url","search","password","email","tel","file",""]);function oi(e){if(e.nodeType!==1)return e;let o=e,t=o.tagName;return t==="SELECT"?(o.classList.add("spro-campo"),o.hasAttribute("multiple")?o:f("div",{class:"spro-seletor"},o)):((t==="TEXTAREA"||t==="INPUT"&&ei.has(o.getAttribute("type")??""))&&o.classList.add("spro-campo"),o)}function j(e,o,...t){let n=[e??""];o.opcional&&n.push(" ",f("span",{class:"spro-opcional"},"(opcional)"));let r=e?f(o.para?"label":"div",{class:"spro-rotulo",...o.para?{for:o.para}:{}},f("span",{},...n),o.valor!==void 0?f("span",{class:"spro-valor",...o.para?{"data-valor-de":o.para}:{}},o.valor):null):null;return f("div",{class:o.largo?"spro-grupo spro-largo":"spro-grupo"},r,...t.map(oi),o.dica?f("p",{class:"spro-dica"},o.dica):null)}function Qe(e,o,t){let n=e.querySelector(`[data-valor-de="${o}"]`);n&&(n.textContent=t)}function Uo(e,o){return e.classList.add("spro-campo"),f("div",{class:"spro-sufixo spro-prefixo"},f("span",{},o),e)}function to(e,o){return e.classList.add("spro-campo"),f("div",{class:"spro-sufixo"},e,f("span",{},o))}function jo(e){let o=Number(e.getAttribute("min")??0),t=Number(e.getAttribute("max")??100),n=t>o?(Number(e.value)-o)/(t-o)*100:0;e.style.setProperty("--p",`${Math.min(100,Math.max(0,n))}%`)}function ro(e){let o=f("input",{type:"range",class:"spro-intervalo",id:e.id,min:String(e.min),max:String(e.max),step:String(e.step),...e.value!==void 0?{value:String(e.value)}:{}});return jo(o),o.addEventListener("input",()=>jo(o)),o}function ge(e,o,t="checkbox"){return f("label",{class:"spro-caixa"},f("input",{type:t,...e}),f("span",{},o))}function Qo(e){let o=e.parentElement?.querySelector(".spro-cor-hex");o&&(o.textContent=e.value)}function no(e){let o=f("input",{type:"color",...e}),t=f("label",{class:"spro-cor"},o,f("span",{class:"spro-cor-hex"},e.value));return o.addEventListener("input",()=>Qo(o)),o.addEventListener("change",()=>Qo(o)),t}function Ue(e){for(let o of e.querySelectorAll("input.spro-intervalo"))jo(o);for(let o of e.querySelectorAll(".spro-cor > input[type='color']"))Qo(o)}function Re(e,o,t={}){let n=f("button",{type:"button",class:"spro-botao-texto",...t.id?{id:t.id}:{},...t.expansivel?{"aria-expanded":"false"}:{}},e,t.expansivel?fe("chevron",14):null);return n.addEventListener("click",()=>{t.expansivel&&n.setAttribute("aria-expanded",String(n.getAttribute("aria-expanded")!=="true")),o()}),n}function Vo(e,...o){return f("div",{class:"spro-painel",...e},...o)}function qe(e,o={}){return f("div",{class:o.xadrez?"spro-previa xadrez":"spro-previa",...o.vazio?{"data-vazio":o.vazio}:{},...e})}function we(e,o,t,n){let r=new Map,i=new Map,l=a=>{for(let[u]of o){let s=u===a;r.get(u)?.setAttribute("aria-selected",String(s)),r.get(u)?.setAttribute("tabindex",s?"0":"-1"),s?i.get(u)?.removeAttribute("hidden"):i.get(u)?.setAttribute("hidden","")}n?.(a)},c=f("div",{class:"spro-segmentado largo",role:"tablist"});return o.forEach(([a,u],s)=>{let g=f("button",{type:"button",role:"tab",id:`${e}Tab_${a}`,"aria-controls":`${e}Painel_${a}`,"aria-selected":"false",tabindex:"-1",onclick:()=>l(a),onkeydown:x=>{let p=x.key,b=p==="ArrowRight"?1:p==="ArrowLeft"?-1:0,d=o[(s+b+o.length)%o.length]?.[0];!b||!d||(x.preventDefault(),l(d),r.get(d)?.focus())}},u);r.set(a,g),c.append(g),i.set(a,f("div",{role:"tabpanel",id:`${e}Painel_${a}`,"aria-labelledby":`${e}Tab_${a}`,hidden:""},t[a]))}),{barra:c,paineis:[...i.values()],selecionar:l}}function Be(...e){return re(...e)}function Ce(e,o,t={}){return j(e,{para:o.id||void 0,...t},o)}function cr(e){return e.nr_sei!==""?`${e.documento} (${e.nr_sei})`:e.documento}var dr=e=>e.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase(),ur={id:"citacao",globais(e){let o=e.adaptador,t=e.win,n=a=>Y(e.doc,a),r=()=>t.dadosProcessoPro?.listDocumentos??[];function i(a,u=9e3){if(t.checkProcessoSigiloso?.()){n("N\xE3o dispon\xEDvel para processos sigilosos"),o.getInstance(a);return}if(!(u<=0)){if(t.dadosProcessoPro?.listDocumentos!==void 0){o.getInstance(a),l(a);return}setTimeout(()=>i(a,u-100),500)}}function l(a){if(t.checkProcessoSigiloso?.())return;let u=o.getInstance(a);if(!u)return;let s=r().filter(y=>y.documento!==""),g=f("input",{type:"search",id:"filtroCitacao",placeholder:"Filtrar por tipo ou n\xFAmero SEI\u2026",autocomplete:"off"}),x=f("div",{id:"listaCitacao",class:"spro-checklist",role:"group","aria-label":"Documentos do processo"}),p=s.map(y=>{let S=ge({value:y.id_protocolo,name:"citacaoDocumento"},cr(y));return S.setAttribute("data-busca",dr(cr(y))),S});x.append(...p);let b=f("p",{class:"spro-dica",id:"resumoCitacao"}),d=()=>p.map(y=>y.querySelector("input")).filter(y=>typeof y.checked=="boolean"?y.checked:y.hasAttribute("checked")).map(y=>y.getAttribute("value")??""),h=()=>{let y=d().length;Qe(E,"filtroCitacao",`${y} ${y===1?"selecionado":"selecionados"}`);let S=dr(g.value.trim()),D=0;for(let H of p)S===""||(H.getAttribute("data-busca")??"").includes(S)?(H.removeAttribute("hidden"),D+=1):H.setAttribute("hidden","");b.textContent=s.length===0?"O processo ainda n\xE3o tem documentos para referenciar.":D===0?"Nenhum documento corresponde ao filtro.":""};g.addEventListener("input",h),x.addEventListener("change",h);let A=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let y=d();if(!y.length){n("Selecione ao menos um documento.");return}y.forEach((S,D)=>{let H=c(S,u);H&&D<y.length-2&&o.insertText(u,", "),H&&D===y.length-2&&o.insertText(u," e ")}),w.fechar()}},"Inserir"),E=re(j("Documentos do processo",{para:"filtroCitacao",valor:"0 selecionados"},g),x,b,ce("Cada documento marcado entra no texto como refer\xEAncia, na ordem da lista, separados por v\xEDrgula e \u201Ce\u201D."),f("div",{class:"spro-dialogo-rodape"},A)),w=te(e.doc,{titulo:"Inserir refer\xEAncia de documento do processo",largura:600,conteudo:E});h(),g.focus({preventScroll:!0})}function c(a,u){let s=u??o.getInstance();if(!s)return!1;let g=r().find(A=>A.id_protocolo===a);if(!g?.documento)return!1;let x=t.textoParaHtmlPro??ne,p=g.nr_sei!==""?g.nr_sei:g.documento,b=t.getCitacaoDoc?.()??"SEI n\xBA ",d=`<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei${x(g.id_protocolo)}" style="text-indent:0;">${x(p)}</a></span>`,h=g.nr_sei!==""||t.getConfigValue?.("citacaodoc")==="citacaodoc_4"?`${x(g.documento.trim())}&nbsp;(${b}${d})`:d;return t.htmlLinksProtocoloEditorPro&&(h=t.htmlLinksProtocoloEditorPro(h,s)),o.withEdit(s,()=>o.insertHtml(s,h)),!0}return{getCitacaoDocumento:i,getDialogCitacaoDocumento:l,insertCitacaoDocumento:c}}};var ti="Texto_Justificado_Recuo_Primeira_Linha";function De(e,o){if(!e)return null;let t=e.nodeType===1?e:e.parentElement;return t?.closest?t.closest(o):null}function pr(e,o){let t=-1,n=e.childNodes;for(let r=0;r<n.length;r++)if(n[r]?.nodeType===1&&(t++,t===o))return r;return 0}var mr=e=>(e?.textContent??"").trim();function ri(e,o,t,n){let r=mr(e.childNodes[pr(e,t)]),i=mr(o.childNodes[pr(o,t)]);return r?i?n==="desc"?i.localeCompare(r,void 0,{numeric:!0}):r.localeCompare(i,void 0,{numeric:!0}):-1:i?1:0}var gr={id:"context-menu",globais(e){let o=e.adaptador,t=e.win,n=b=>{if(typeof t.hasSelection=="function")try{return!!t.hasSelection(b)}catch{}return o.getSelectedText(b).length>0},r=b=>o.somenteLeitura(b)?(o.recusarEscrita(),!0):!1;function i(b){typeof t.openDialogSyleTable=="function"?t.openDialogSyleTable(b):typeof t.getSyleSelectedTable=="function"&&t.getSyleSelectedTable(null)}let l=(b,d)=>De(d,"table")??De(o.getSelectionElement(b),"table");function c(b,d){let h=l(b,d);if(!h||r(b))return;let A=o.versao===5?e.doc:h.ownerDocument,E=A.createElement("p");E.className=ti,E.append(A.createElement("br")),o.withEdit(b,()=>{o.versao===5?o.insertHtmlBefore(b,h.nextElementSibling??h,E.outerHTML+h.outerHTML):h.after(E,h.cloneNode(!0))})}function a(b,d,h){let A=De(d,"td,th")??De(o.getSelectionElement(b),"td,th"),E=De(d,"table")??De(o.getSelectionElement(b),"table");if(!A||!E||r(b))return;let w=0;for(let S=A.previousElementSibling;S;S=S.previousElementSibling)w++;let y=E.querySelector("tbody")??E;o.withEdit(b,()=>{let S=Array.from(y.childNodes).filter(D=>D.nodeType===1);S.sort((D,H)=>ri(D,H,w,h));for(let D of S)y.appendChild(D)})}function u(b,d){if(o.versao===5){typeof t.alertaBoxPro=="function"&&t.alertaBoxPro("Info","info-circle","Bloquear Edi\xE7\xE3o ainda n\xE3o est\xE1 dispon\xEDvel no editor do SEI 5.");return}let h=De(d,"p")??o.getSelectionParagraph(b);if(!h||r(b))return;let A=h;try{let w=o.getBodyContainer(b)?.ownerDocument,y=w?.getSelection?.()??w?.defaultView?.getSelection?.()??null,S=De(y?.focusNode,"p");S&&(A=S)}catch{}o.withEdit(b,()=>{let E=h;for(let w=0;E&&w<5e3;w++){let y=E.getAttribute("contenteditable")==="false";if(E.setAttribute("contenteditable",y?"true":"false"),E===A)break;E=E.nextElementSibling}})}function s(b){b&&o.addContextMenu(b,d=>o.versao===5?[]:De(d,"p")&&n(b)?[{label:"Bloquear Edi\xE7\xE3o",action:()=>u(b,d)}]:[])}function g(b){b&&o.addContextMenu(b,d=>De(d,"tr")?[{label:"Adicionar Estilo",action:()=>i(b)},{label:"Duplicar Tabela",action:()=>c(b,d)},{label:"Classificar A \u2192 Z",action:()=>a(b,d,"asc")},{label:"Classificar Z \u2192 A",action:()=>a(b,d,"desc")}]:[])}function x(b){let d=b;if(!d||d.__seiProCtxIniciado)return;d.__seiProCtxIniciado=!0,g(d),typeof t.menuCopyStyle=="function"&&t.menuCopyStyle(d),s(d),(typeof t.restrictConfigValue=="function"?!!t.restrictConfigValue("ferramentasia"):!1)&&typeof t.menuPlataformAI=="function"&&t.menuPlataformAI(d),e.checkOpcao("editarimagens")&&typeof t.editImgPro=="function"&&t.editImgPro(d)}function p(){let b=(o.getAllInstances()||[]).filter(d=>d&&!d.readOnly);if(!b.length){let d=o.getInstance();d&&(b=[d])}for(let d of b)x(d)}return{menuBlockEdition:s,tableSorterPro:g,initContextMenuPro:p}}};var Go="copyStylePro",Wo="cke_copyformatting_active",fr=/^(?:#[0-9a-f]{3,8}|rgba?\(\s*\d{1,3}(?:\.\d+)?\s*(?:,\s*\d{1,3}(?:\.\d+)?\s*){2,3}\)|[a-z]{3,30})$/i,ni="rgb(251, 251, 254)";function ai(e){let o=e.ownerDocument.defaultView?.getComputedStyle?.(e),t=Number.parseFloat(o?.fontSize??""),n=!!e.ownerDocument.documentElement.classList.contains("dark-mode"),r=!!e.closest("sub")||!!e.closest("sup");return{fontSize:Number.isNaN(t)||t===16&&r?!1:t,color:!o?.color||o.color==="rgb(0, 0, 0)"||o.color===ni&&n?!1:o.color,backgroundColor:!o?.backgroundColor||o.backgroundColor==="rgba(0, 0, 0, 0)"?!1:o.backgroundColor,bold:!!e.closest("strong, b"),underline:!!e.closest("u"),italic:!!e.closest("em, i"),strike:!!e.closest("s, strike, del"),subscript:!!e.closest("sub"),superscript:!!e.closest("sup")}}var br={id:"copy-style",globais(e){let o=e.adaptador,t=()=>e.win.sessionStorage,n=()=>{try{return JSON.parse(t().getItem(Go)??"null")}catch{return null}},r=s=>o.getSelectedHtml(s).trim()!==""||o.getSelectedText(s).trim()!=="",i=s=>!!o.getBodyContainer(s)?.classList.contains(Wo),l=s=>{for(let g of e.doc.querySelectorAll(".getCopyStyleButtom"))s==="desabilitar"?g.classList.add("cke_button_disabled"):s==="habilitar"?g.classList.remove("cke_button_disabled"):(g.classList.toggle("cke_button_on",s),g.classList.toggle("cke_button_off",!s))};function c(){let s=o.getInstance();s&&o.getBodyContainer(s)?.classList.remove(Wo),t().removeItem(Go),l(!1)}function a(s){let g=s??o.getInstance();if(!g)return;if(i(g)){c();return}let x=o.getSelectionElement(g);x&&(t().setItem(Go,JSON.stringify(ai(x))),o.getBodyContainer(g)?.classList.add(Wo),l(!0))}function u(){let s=o.getInstance();if(!s)return;let g=r(s),x=i(s);l(g||x?"habilitar":"desabilitar");let p=n();if(!(p&&g&&x))return;o.withEdit(s,()=>{o.execCommand(s,"removeFormat");for(let[h,A]of[[p.bold,"bold"],[p.underline,"underline"],[p.italic,"italic"],[p.strike,"strike"],[p.subscript,"subscript"],[p.superscript,"superscript"]])h===!0&&o.execCommand(s,A);let d=[];if(typeof p.backgroundColor=="string"&&fr.test(p.backgroundColor)&&d.push(`background-color: ${p.backgroundColor}`),typeof p.fontSize=="number"&&Number.isFinite(p.fontSize)&&p.fontSize>0&&p.fontSize<400&&d.push(`font-size: ${p.fontSize}px`),typeof p.color=="string"&&fr.test(p.color)&&d.push(`color: ${p.color}`),d.length){let h=o.getSelectedHtml(s);h!==""&&o.insertHtml(s,`<span style="${d.join("; ")}">${h}</span>`)}}),!!e.win.event?.altKey||c()}return{setCopyStyle(s){let g=o.getInstance(s);g&&a(g)},actionCopyStyle:a,getCopyStyle:n,applyCopyStyle:u,removeCopyStyle:c,menuCopyStyle(s){s&&o.addContextMenu(s,g=>o.versao===5?[]:g?.closest("p")&&r(s)?[{label:"Copiar formata\xE7\xE3o",action:()=>a(s)}]:[])}}}};var hr=[["processo","N\xFAmero do processo","com link"],["processo_texto","N\xFAmero do processo","sem link"],["autuacao","Data de autua\xE7\xE3o do processo","formato DD/MM/AAAA"],["tipo","Tipo do processo"],["especificacao","Especifica\xE7\xE3o do processo"],["assuntos","Classifica\xE7\xE3o por assuntos do processo","separados por v\xEDrgula"],["assuntos_lista","Classifica\xE7\xE3o por assuntos do processo","em formato de lista"],["interessados","Interessados do processo","separados por v\xEDrgula"],["interessados_lista","Interessados do processo","em formato de lista"],["observacoes","Observa\xE7\xF5es do processo","separadas por v\xEDrgula"],["observacoes_lista","Observa\xE7\xF5es do processo","em formato de lista"],["observacao","Observa\xE7\xE3o da unidade atual"],["acesso","N\xEDvel de acesso do processo"],["acesso_texto","N\xEDvel de acesso do processo","sem \xEDcone"],["documentos","Lista de todos os documentos do processo","separados por v\xEDrgula"],["totaldocumentos","N\xFAmero de documentos do processo"],["documentos_lista","Lista de todos os documentos do processo","em formato de lista"],["hoje","Data de hoje","formato [dia] de [m\xEAs] de [ano]"],["ano","Ano corrente","4 d\xEDgitos [YYYY]"],["qrcode","QR Code do link para acesso ao processo (SEI interno)"]],vr=[["assunto1","Primeiro assunto do processo"],["assunto3","Terceiro assunto do processo"],["interessado1","Primeiro interessado do processo"],["interessado4","Quarto interessado do processo"],["observacao1","Primeira observa\xE7\xE3o do processo"],["observacao2","Segunda observa\xE7\xE3o do processo"],["documento1","Primeiro documento do processo"],["documento5","Quinto documento do processo"],["documento+1","Pr\xF3ximo documento do processo em rela\xE7\xE3o ao atual"],["documento+3","Terceiro documento do processo em rela\xE7\xE3o ao atual"],["documento-1","Primeiro documento do processo anterior ao atual"],["documento-6","Sexto documento do processo anterior ao atual"],["hoje+1","Amanh\xE3","formato [dia] de [m\xEAs] de [ano]"],["hoje-1","Ontem","formato [dia] de [m\xEAs] de [ano]"],["hoje+7","Data daqui a 7 dias","formato [dia] de [m\xEAs] de [ano]"],["hoje-5","Data de 5 dias atr\xE1s","formato [dia] de [m\xEAs] de [ano]"]],ii=new Set([...hr,...vr].map(([e])=>e.replace(/[^a-zA-Z_]+/g,""))),si={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:"\xA0"};function li(e){return e.replace(/&(?:#x([0-9a-f]+)|#(\d+)|([a-z]+));/gi,(o,t,n,r)=>t?String.fromCodePoint(Number.parseInt(t,16)):n?String.fromCodePoint(Number(n)):r&&si[r.toLowerCase()]||o)}var ci=/[\u0300-\u036f]/g,di=e=>e.normalize("NFD").replace(ci,""),xr={id:"dados-processo",globais(e){let o=e.adaptador,t=e.win,n=u=>Y(e.doc,u),r=()=>String(t.siglaUnidadeAtual??""),i=()=>{let u=t.dadosProcessoPro?.propProcesso?.txaTagsObservacoes??[];return u.find(s=>s.unidade===r())??u.find(s=>s.unidade==="")};function l(u,s=9e3){if(t.checkProcessoSigiloso?.()){o.getInstance(u),n("N\xE3o dispon\xEDvel para processos sigilosos");return}if(s<=0)return;let g=t.dadosProcessoPro;if(g?.propProcesso!==void 0&&g.listDocumentos!==void 0&&(t.arrayDadosEditor?.().length??0)>0){c(u);return}setTimeout(()=>{if(t.dadosProcessoPro?.propProcesso===void 0){let x=t.getDadosProcessoSession?.();x&&(t.dadosProcessoPro=x)}l(u,s-100)},500)}function c(u){if(u===void 0||t.checkProcessoSigiloso?.())return;let s=o.getInstance(u);if(!s)return;try{t.setParamEditor?.(u)}catch{}let g=t.arrayDadosEditor?.()??[],x=f("select",{id:"listDados"},...g.map(([T,L])=>f("option",{value:String(L??"")},li(String(T??""))||"Selecione um dado\u2026"))),p=j("Dado do processo",{para:"listDados",dica:"O valor escolhido entra no documento, no ponto do cursor."},x),d=o.findInBody(s,"p").map(T=>T.textContent??"").join(" "),h=t.getHashTagsPro?.(d).length??0,A=f("div",{id:"tabReplaceTag_result",class:"spro-nota"});A.append(f("label",{},`${h} ${h===1?"campo din\xE2mico detectado":"campos din\xE2micos detectados"} no documento.`));let E=f("button",{type:"button",class:"spro-botao",onclick:()=>t.replaceDadosEditor?.(E)},"Substituir campos din\xE2micos"),w=re(ce("Troca as #hashtags j\xE1 digitadas no documento (como #processo ou #hoje) pelos valores reais do processo."),f("div",{},E),A),y=f("input",{type:"text",id:"dinNome",placeholder:"ex.: gestor ou prazo_resposta",autocomplete:"off",spellcheck:"false"}),S=f("input",{type:"text",id:"dinValor",placeholder:"Texto que substitui o campo",autocomplete:"off"}),D=f("div",{id:"tabNewDynamicField_alert",class:"spro-nota",hidden:""}),H=f("div",{id:"tabNewDynamicField_result",class:"spro-lista-campos","data-vazio":"Nenhum campo personalizado nesta unidade ainda"}),O=T=>{D.replaceChildren(f("label",{},T)),D.removeAttribute("hidden")},$=(T,L)=>{let N=f("div",{class:"spro-linha-campo","data-tag":T,"data-valor":L});return N.append(f("b",{class:"spro-hash"},`#${T}`),f("span",{class:"spro-linha-valor"},L),f("div",{class:"spro-linha-acoes"},f("button",{type:"button",class:"spro-botao-icone pequeno",title:"Editar","aria-label":`Editar #${T}`,onclick:()=>V(N)},fe("lapis",15)),f("button",{type:"button",class:"spro-botao-icone pequeno",title:"Remover","aria-label":`Remover #${T}`,onclick:()=>G(N)},fe("lixeira",15)))),N};for(let T of i()?.tags??[])H.append($(T.name,T.value));function B(){for(let Q of[...x.querySelectorAll("option")])(Q.textContent??"").trim().startsWith("Personalizado")&&Q.remove();let T=[...H.querySelectorAll(".spro-linha-campo")].map(Q=>({name:Q.getAttribute("data-tag")??"",value:Q.getAttribute("data-valor")??""})),L="";for(let{name:Q,value:X}of T){let oe=t.textoParaHtmlPro?t.textoParaHtmlPro(X):X;x.append(f("option",{value:oe},`Personalizado (${r()}) #${Q}: ${X}`)),L+=`#${Q}: ${X}
`}let N=t.dadosProcessoPro?.propProcesso;for(let Q of N?.txaTagsObservacoes??[])Q.unidade===r()&&(Q.tags=T);let z=N?.txaObservacoes?.find(Q=>Q.unidade===r())?.observacao;t.updateDadosProcesso?.("txaObservacoes",z!=null?L+z:L)}function G(T){T.remove(),B(),O("Campo din\xE2mico exclu\xEDdo com sucesso.")}function V(T){y.value=T.getAttribute("data-tag")??"",S.value=T.getAttribute("data-valor")??"",S.focus()}function W(){D.setAttribute("hidden","");let T=X=>t.removeAcentos?t.removeAcentos(X):di(X),L=y.value.trim(),N=L===""?"":T(L.split(":")[0]?.replace("#","")??"").replace(/ /g,"").toLowerCase().trim(),z=S.value.trim();if(N===""||z===""){O("Informe o nome e o valor do campo.");return}if(ii.has(N)){O("Esse nome \xE9 reservado para uso interno (veja a aba Lista de campos). Escolha outro.");return}let Q=[...H.querySelectorAll(".spro-linha-campo")].find(X=>X.getAttribute("data-tag")===N);Q?Q.replaceWith($(N,z)):H.prepend($(N,z)),y.value="",S.value="",B(),O("Campo din\xE2mico salvo com sucesso.")}let _=f("button",{type:"button",id:"buttonNewDynamicField",class:"spro-botao",onclick:W},"Salvar campo"),C=re(ce("Crie campos pr\xF3prios, como #gestor, para usar nos documentos deste processo. Ficam salvos nas observa\xE7\xF5es da unidade."),j("Nome do campo",{para:"dinNome",dica:"Sem acentos nem espa\xE7os."},Uo(y,"#")),j("Valor do campo",{para:"dinValor"},S),f("div",{},_),D,j("Campos salvos",{},H)),m=(T,L)=>j(T,{},f("div",{class:"spro-lista-campos spro-referencia"},...L.map(([N,z,Q])=>f("div",{class:"spro-linha-campo"},f("b",{class:"spro-hash"},`#${N}`),f("span",{class:"spro-linha-valor"},z,Q?f("em",{},` (${Q})`):null))))),v=re(m("Campos dispon\xEDveis",hr),m("Campos avan\xE7ados (posi\xE7\xE3o ou data relativa)",vr)),P=null,I=we("dados",[["inserir","Inserir dados"],["substituir","Substituir campos"],["personalizados","Personalizados"],["lista","Lista de campos"]],{inserir:p,substituir:w,personalizados:C,lista:v},T=>{P&&(T==="inserir"?P.removeAttribute("hidden"):P.setAttribute("hidden",""))}),k=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let T=x.value;if(!T){n("Escolha o dado a inserir.");return}a(T,s),M.fechar()}},"Inserir");P=f("div",{class:"spro-dialogo-rodape"},k);let M=te(e.doc,{titulo:"Dados do processo",largura:700,conteudo:f("div",{class:"spro-form"},I.barra,f("div",{},...I.paineis),P)});I.selecionar("inserir"),x.focus({preventScroll:!0})}function a(u,s){let g=s??o.getInstance();if(!g)return;let x=t.htmlLinksProtocoloEditorPro?t.htmlLinksProtocoloEditorPro(u,g):u;o.withEdit(g,()=>o.insertHtml(g,x))}return{getDadosEditor:l,getDialogDadosEditor:c,insertDadosEditor:a}}};var ui=[["Afrikaans",["af-ZA"]],["Bahasa Indonesia",["id-ID"]],["Bahasa Melayu",["ms-MY"]],["Catal\xE0",["ca-ES"]],["\u010Ce\u0161tina",["cs-CZ"]],["Deutsch",["de-DE"]],["English",["en-AU","Australia"],["en-CA","Canada"],["en-IN","India"],["en-NZ","New Zealand"],["en-ZA","South Africa"],["en-GB","United Kingdom"],["en-US","United States"]],["Espa\xF1ol",["es-AR","Argentina"],["es-BO","Bolivia"],["es-CL","Chile"],["es-CO","Colombia"],["es-CR","Costa Rica"],["es-EC","Ecuador"],["es-SV","El Salvador"],["es-ES","Espa\xF1a"],["es-US","Estados Unidos"],["es-GT","Guatemala"],["es-HN","Honduras"],["es-MX","M\xE9xico"],["es-NI","Nicaragua"],["es-PA","Panam\xE1"],["es-PY","Paraguay"],["es-PE","Per\xFA"],["es-PR","Puerto Rico"],["es-DO","Rep\xFAblica Dominicana"],["es-UY","Uruguay"],["es-VE","Venezuela"]],["Euskara",["eu-ES"]],["Fran\xE7ais",["fr-FR"]],["Galego",["gl-ES"]],["Hrvatski",["hr_HR"]],["IsiZulu",["zu-ZA"]],["\xCDslenska",["is-IS"]],["Italiano",["it-IT","Italia"],["it-CH","Svizzera"]],["Magyar",["hu-HU"]],["Nederlands",["nl-NL"]],["Norsk bokm\xE5l",["nb-NO"]],["Polski",["pl-PL"]],["Portugu\xEAs",["pt-BR","Brasil"],["pt-PT","Portugal"]],["Rom\xE2n\u0103",["ro-RO"]],["Sloven\u010Dina",["sk-SK"]],["Suomi",["fi-FI"]],["Svenska",["sv-SE"]],["T\xFCrk\xE7e",["tr-TR"]],["\u0431\u044A\u043B\u0433\u0430\u0440\u0441\u043A\u0438",["bg-BG"]],["P\u0443\u0441\u0441\u043A\u0438\u0439",["ru-RU"]],["\u0421\u0440\u043F\u0441\u043A\u0438",["sr-RS"]],["\uD55C\uAD6D\uC5B4",["ko-KR"]],["\u4E2D\u6587",["cmn-Hans-CN","\u666E\u901A\u8BDD (\u4E2D\u56FD\u5927\u9646)"],["cmn-Hans-HK","\u666E\u901A\u8BDD (\u9999\u6E2F)"],["cmn-Hant-TW","\u4E2D\u6587 (\u53F0\u7063)"],["yue-Hant-HK","\u7CB5\u8A9E (\u9999\u6E2F)"]],["\u65E5\u672C\u8A9E",["ja-JP"]],["Lingua lat\u012Bna",["la"]]],pi=[[" abre par\xEAnteses ","("],[" fecha par\xEAnteses ",")"],[" abre colchete ","["],[" fecha colchete ","]"],[" abre aspas ",'"'],[" fecha aspas ",'"'],[" espa\xE7o "," "],[" aspas ",'"'],[" travess\xE3o "," \u2013 "],[" tra\xE7o ","- "],[" ponto e v\xEDrgula ","; "],[" dois pontos ",": "],[" 2 pontos ",": "],[" ponto ",". "],[" v\xEDrgula ",", "]];function yr(e){for(let[n,r]of pi)e.includes(n)&&(e=e.replace(n,r));let o=Array.from(e.trim())[0];return(o===","||o===";"||o===":"||o==="-"||o==="."?"":" ")+e.trim()}var mi=["nova linha","ponto final","novo par\xE1grafo"],Ko=class{constructor(o,t,n,r,i){this._langs=o;this.amb=n;this.A=r;this.editor=i;this.iniciarServico(),t!==void 0&&this.setDialectByCulture(t)}_currentCulture={val:"pt-BR",langVal:19};_recognizing=!1;_recognition=null;_start_timestamp=0;isUnlockedService(){return"webkitSpeechRecognition"in this.amb.win||"SpeechRecognition"in this.amb.win}iniciarServico(){if(!this.isUnlockedService())return;let o=this.amb.win,t=o.webkitSpeechRecognition??o.SpeechRecognition;if(!t)return;let n=new t;n.continuous=!0,n.interimResults=!1,n.onstart=()=>this.onStart(),n.onerror=()=>this.onError(),n.onend=()=>this.onEnd(),n.onresult=r=>this.onResult(r),n.onspeechstart=()=>{},n.onspeechend=()=>this.updateIcons(),this._recognition=n}updateIcons(){let{doc:o,base:t}=this.amb,n=this._recognizing,r=n?`url('${t}icons/editor/webspeech-enable.gif')`:`url('${t}icons/editor/webspeech.png')`;for(let i of o.querySelectorAll(".cke_button__ditado_icon"))i.style.setProperty("background",r);for(let i of o.querySelectorAll(".getDitadoButton"))i.classList.add(n?"cke_button_on":"cke_button_off"),i.classList.remove(n?"cke_button_off":"cke_button_on")}onStart(){this._recognizing=!0,this.updateIcons()}onError(){this.updateIcons()}onEnd(){this._recognizing=!1,this.updateIcons()}ed(){return this.editor??=this.A.getInstance(),this.editor}onResult(o){let t=this.ed();if(typeof o.results>"u"){this._recognizing=!1,this._recognition&&(this._recognition.onend=null,this._recognition.stop()),this.updateIcons();return}if(t)for(let n=o.resultIndex;n<o.results.length;++n){let r=o.results[n];r?.isFinal&&this.inserirTranscricao(t,` ${r[0]?.transcript??""} `)}}escrever(o,t){this.A.insertText(o,t)}comando(o,t){if(this.A.somenteLeitura(o)){this.A.recusarEscrita();return}this.A.execCommand(o,t)}inserirTranscricao(o,t){let n=mi.filter(i=>t.includes(` ${i} `));if(n.length){let i=n[n.length-1],l=t.trim().split(i).filter(c=>c);if(!l.length){this.comando(o,"enter");return}l.forEach((c,a)=>{if(c.trim()==="")return;let u=a<l.length-1?".":"";this.escrever(o,yr(c)+u),u!==""&&this.comando(o,"enter")});return}let r=t.trim().toLocaleLowerCase();r==="desfazer"?this.comando(o,"undo"):r==="refazer"?this.comando(o,"redo"):this.escrever(o,yr(t))}toogleSpeech(){if(!this._recognition){this.amb.avisarIndisponivel();return}if(this._recognizing)this._recognition.stop();else{this._recognition.lang=this._currentCulture.val;try{this._recognition.start()}catch{}this._start_timestamp=Date.now()}}setDialectByCulture(o){for(let t=0;t<this._langs.length;t++){let n=this._langs[t];for(let r=1;r<n.length;r++){let i=n[r][0];if(i.toLowerCase()===o.toLowerCase())return this._currentCulture={val:i,langVal:t},this._currentCulture}}return this._currentCulture}setDialectByLanguage(o){let t=this._langs[o]?.[1]?.[0];t&&this.setDialectByCulture(t)}getLanguages(){return this._langs.map((o,t)=>[o[0],t])}getCultures(o=this._currentCulture.langVal){let t=this._langs[o];return t?t.slice(1).map(n=>[n[0]]):[]}nomeDaCultura(o,t){return this._langs[o]?.slice(1).find(i=>i[0]===t)?.[1]??""}},Er={id:"ditado",globais(e){let o=e.adaptador,t=e.win,n={win:e.win,doc:e.doc,base:e.base,avisarIndisponivel(){let c="Seu navegador n\xE3o suporta reconhecimento de voz (webkitSpeechRecognition).";typeof t.alertaBoxPro=="function"?t.alertaBoxPro("Ditado indispon\xEDvel","exclamation-triangle",c):Y(e.doc,c)}};function r(c){if(!c)return null;let a=c;if(a.ckWebSpeech===void 0||a.ckWebSpeech===null){a.ckWebSpeech=new Ko(ui,"pt-BR",n,o,c);try{o.addContextMenu(c,()=>o.versao===5?[]:e.checkOpcao("ditado")?[{label:"Ditado",action:()=>a.ckWebSpeech?.toogleSpeech()}]:[])}catch{}try{let u=o.getBodyContainer(c);u&&!u.__seiProDitadoKey&&(u.__seiProDitadoKey=!0,u.addEventListener("keydown",s=>{let g=s;g.ctrlKey&&g.shiftKey&&(g.code==="Space"||g.key===" "||g.keyCode===32)&&(g.preventDefault(),a.ckWebSpeech?.toogleSpeech())}))}catch{}}return a.ckWebSpeech??null}function i(c){let a=c._currentCulture,u=b=>{for(;b.firstChild;)b.removeChild(b.firstChild)},s=f("select",{id:"wslanguages"},...c.getLanguages().map(([b,d])=>f("option",{value:String(d),selected:d===a.langVal},b))),g=f("select",{id:"wscultures"}),x=(b,d)=>{u(g);for(let[h]of c.getCultures(b)){let A=c.nomeDaCultura(b,h);g.append(f("option",{value:h,selected:h===d},A?`${h} \u2013 ${A}`:h))}};x(a.langVal,a.val),s.addEventListener("change",()=>{let b=Number.parseInt(s.value,10);Number.isNaN(b)||x(b,c.getCultures(b)[0]?.[0]??"")});let p=te(e.doc,{titulo:"Configura\xE7\xF5es do Ditado",largura:460,conteudo:re(le("duas",j("Idioma",{para:"wslanguages"},s),j("Cultura",{para:"wscultures"},g)),ce("Atalho: ",f("strong",{},"Ctrl + Shift + Espa\xE7o")," liga/desliga o ditado."),ce("Comandos de voz: \u201Cnova linha\u201D, \u201Cnovo par\xE1grafo\u201D e \u201Cponto final\u201D quebram a linha; \u201Cv\xEDrgula\u201D, \u201Cponto\u201D, \u201Cdois pontos\u201D, \u201Cponto e v\xEDrgula\u201D, \u201Cabre/fecha par\xEAnteses\u201D e \u201Cabre/fecha aspas\u201D inserem a pontua\xE7\xE3o; \u201Cdesfazer\u201D e \u201Crefazer\u201D voltam e refazem."),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",id:"dialogDitadoOk",class:"spro-botao primario",onclick:()=>{let b=g.value;b&&c.setDialectByCulture(b),p.fechar()}},"OK")))})}function l(){}return{instanceDitadoPro(c){r(c||o.getInstance())},getBoxDitado(c){let a=[...e.doc.querySelectorAll(".getDitadoButton")],u=a.some(g=>g.classList.contains("cke_button_off"));for(let g of a)g.classList.add(u?"cke_button_on":"cke_button_off"),g.classList.remove(u?"cke_button_off":"cke_button_on");let s=o.getInstance(c);s&&r(s)?.toogleSpeech()},getBoxCtrDitado(c){if(typeof t.setParamEditor=="function")try{t.setParamEditor(c)}catch{}let a=o.getInstance(c);if(!a)return;let u=r(a);u&&i(u)},getDialogDitado(){e.checkOpcao("revisaotexto")&&void 0},initDitadoPro:l}}};var Pr=40,gi=2,kr=60,Jo=30,fi=1e4;function ao(e){let o=String(e??"");try{o=o.normalize("NFD").replace(/[\u0300-\u036f]/g,"")}catch{}return o.toLowerCase()}function Xo(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var bi=/[\s\u00a0([{"'\u201c\u2018\u00ab]/;function wr(e,o=["#","@"]){let t=String(e??""),n=null;for(let r of o){let i=t.lastIndexOf(r);if(i<0||i>0&&!bi.test(t.charAt(i-1)))continue;let l=t.slice(i+1);/[\r\n]/.test(l)||/^[\s\u00a0]/.test(l)||l.length>Pr||(!n||i>n.inicio)&&(n={marcador:r,consulta:l.replace(/\u00a0/g," "),inicio:i})}return n}function Ar(e){return typeof e=="string"&&!/^[\s\u00a0]/.test(e)&&!/[\r\n]/.test(e)&&e.length<=Pr}var Cr=new WeakMap;function Sr(e,o={}){let t=Cr.get(e);if(t)return t;let n=hi(e,o);return Cr.set(e,n),n}function hi(e,o){let t=e.adaptador,n=e.doc,r=e.win,i=o.tempoLimiteUnidadesMs??fi,l=()=>{try{return!!e.verifyOpcao("escrivainterativa")}catch{return!1}},c=k=>Ee(n,String(k??"")).map(M=>M.textContent??"").join("").replace(/\s+/g," ").trim();function a(){let k=[],M=(T,L,N)=>{if(!T||!L)return;let z=c(T);z&&k.push({rotulo:z,html:String(L),tipo:N,chave:ao(z)})};try{if(typeof r.arrayDadosEditor=="function")for(let T of r.arrayDadosEditor()??[])T&&M(T[0],T[1],"dado")}catch(T){console.warn("[SEIPro] escrita interativa: dados do processo",T?.message)}try{let T=r.dadosProcessoPro?.listDocumentos??[],L=typeof r.getCitacaoDoc=="function"?r.getCitacaoDoc():"",N=typeof r.getConfigValue=="function"&&r.getConfigValue("citacaodoc")==="citacaodoc_4",z=Q=>typeof r.textoParaHtmlPro=="function"?r.textoParaHtmlPro(String(Q??"")):Xo(Q);for(let Q of T){if(!Q?.documento)continue;let X=(Q.nr_sei??"")!=="",oe=X?Q.nr_sei:Q.documento,ie=X?`${Q.documento} (${Q.nr_sei})`:Q.documento,Z=`<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei${z(Q.id_protocolo)}" style="text-indent:0;">${z(oe)}</a></span>`,ue=X||N?`${z(String(Q.documento).trim())}&nbsp;(${L}${Z})`:Z;M(z(ie),ue,"documento")}}catch(T){console.warn("[SEIPro] escrita interativa: documentos",T?.message)}return k}let u={marcador:"#",buscar(k){let M=ao(k),T=a(),L=M?T.filter(N=>N.chave.indexOf(M)!==-1):T;return M&&L.sort((N,z)=>(N.chave.indexOf(M)===0?0:1)-(z.chave.indexOf(M)===0?0:1)),L.slice(0,kr).map((N,z)=>({id:`#seipro${z}`,text:N.rotulo,seiPro:"campo",tipo:N.tipo,rotulo:N.rotulo,html:N.html}))}},s={},g=!1;function x(k){let M=ao(k),T=s[M];return T?Promise.resolve(T):new Promise(L=>{if(typeof r.getInteressadosProcesso!="function")return L([]);let N=!1,z=Q=>{N||(N=!0,L(Array.isArray(Q)?Q:[]))};setTimeout(()=>z([]),i);try{r.getInteressadosProcesso(k,z)}catch{z([])}}).then(L=>(L.length&&(s[M]=L),L))}let b={"#":u,"@":{marcador:"@",buscar(k){if(k===""&&r.linkPesquisaInteressado===void 0&&!g&&typeof r.getInteressadosProcesso=="function"){g=!0;try{r.getInteressadosProcesso("",()=>{})}catch{}}if(!Ar(k)||k.length<gi||k.indexOf("@")!==-1)return Promise.resolve([]);let M=ao(k);return x(k).then(T=>{let L=T.filter(N=>N?.id&&N.descricao).map(N=>{let z=String(N.descricao),Q=z.indexOf(" - "),X=Q>0?z.slice(0,Q):z,oe=Q>0?z.slice(Q+3):"",ie=ao(X),Z=ie===M?0:ie.indexOf(M)===0?1:ie.indexOf(M)!==-1?2:3;return{id:`@seipro${N.id}`,text:z,seiPro:"unidade",rank:Z,idUnidade:String(N.id),sigla:X,nome:oe,rotulo:z,html:`<span class="ancoraSei interessadoSeiPro" data-id="${Xo(N.id)}" style="text-indent:0px;">${Xo(z)}</span>`}});return L.sort((N,z)=>(N.rank??0)-(z.rank??0)||(N.sigla?.length??0)-(z.sigla?.length??0)),L.slice(0,Jo)})}}};function d(k,M){let T=b[k];if(!T||!l()||!Ar(M))return Promise.resolve([]);try{return Promise.resolve(T.buscar(M))}catch{return Promise.resolve([])}}function h(k){let M=n.createElement("span");M.className=`seipro-escrita-item seipro-escrita-${k.seiPro}`;let T=n.createElement("i");T.className=`fas ${k.seiPro==="unidade"?"fa-building":k.tipo==="documento"?"fa-file-alt":"fa-hashtag"}`,M.appendChild(T);let L=n.createElement("span");if(L.className="seipro-escrita-texto",k.seiPro==="unidade"){let N=n.createElement("b");N.textContent=k.sigla??"",L.appendChild(N),k.nome&&L.appendChild(n.createTextNode(` \u2014 ${k.nome}`))}else L.textContent=k.rotulo;return L.title=k.rotulo,M.appendChild(L),M}function A(){if(n.getElementById("seipro-escrita-css"))return;let k=n.createElement("style");k.id="seipro-escrita-css",k.textContent=[".seipro-escrita-item { display: flex !important; align-items: baseline; gap: 7px; max-width: 520px; width: 100%; text-align: left; cursor: pointer; }",".seipro-escrita-item i { width: 14px; flex: none; text-align: center; opacity: .6; font-size: 11px; }",'.seipro-escrita-item i.fas { font-family: "Font Awesome 5 Pro" !important; font-weight: 900 !important; font-style: normal !important; }',".seipro-escrita-texto { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }",".ck.ck-mentions .seipro-escrita-item { padding: 6px 10px; box-sizing: border-box; }",".seipro-escrita-lista { position: fixed; z-index: 99999; min-width: 260px; max-width: 540px; max-height: 300px; overflow-y: auto; margin: 0; padding: 4px 0; list-style: none; background: #fff; border: 1px solid #c4c4c4; border-radius: 3px; box-shadow: 0 2px 8px rgba(0,0,0,.18); font: 13px/1.4 Arial, sans-serif; color: #333; }",".seipro-escrita-lista li { padding: 5px 10px; }",".seipro-escrita-lista li.ativo { background: #3875d7; color: #fff; }",".seipro-escrita-lista li.vazio { color: #888; font-style: italic; cursor: default; }","html.dark-mode .seipro-escrita-lista { background: #3d3d3d; border-color: #555; color: #fbfbfe; }"].join(`
`),(n.head||n.documentElement).appendChild(k)}function E(k){let M=k;if(!M?.plugins?.has?.("MentionUI"))return!1;let T=M.plugins.get("MentionUI");if(T._seiProEscrita)return!0;if(!T._mentionsConfigurations||typeof T._setupTextWatcher!="function"||!T._mentionsView)return console.warn("[SEIPro] escrita interativa: MentionUI sem a API esperada"),!1;A();let L=z=>Q=>Q?.seiPro?h(Q):typeof z=="function"?z(Q):Q.id,N=T._mentionsConfigurations.get("@");if(N){let z=N.feedCallback;N.feedCallback=Q=>{let X;try{X=z?z(Q):[]}catch{X=[]}return Promise.resolve(X).then(oe=>{let ie=Array.isArray(oe)?oe:[];return d("@",Q).then(Z=>ie.concat(Z))})},N.itemRenderer=L(N.itemRenderer),N.dropdownLimit=Math.max(N.dropdownLimit||M.config?.get?.("mention.dropdownLimit")||10,Jo+10)}else T._mentionsConfigurations.set("@",{marker:"@",feedCallback:z=>d("@",z),itemRenderer:L(null),dropdownLimit:Jo});return T._mentionsConfigurations.set("#",{marker:"#",feedCallback:z=>d("#",z),itemRenderer:L(null),dropdownLimit:kr}),T._setupTextWatcher([{marker:"@",minimumCharacters:0},{marker:"#",minimumCharacters:0}]),T._mentionsView.on("execute",(z,Q)=>{let X=Q?.item;if(!X?.seiPro)return;z.stop();let oe=M.model,ie=oe.markers.get("mention");if(!ie)return;let Z=oe.createRange(oe.createPositionAt(ie.getStart()),oe.createPositionAt(oe.document.selection.focus));T._hideUIAndRemoveMarker();let ue=typeof r.htmlLinksProtocoloEditorPro=="function"?r.htmlLinksProtocoloEditorPro(X.html,M):X.html;try{oe.change(de=>{let ae=M.data.toModel(M.data.processor.toView(ue),"$block"),R=oe.insertContent(ae,Z),q=oe.insertContent(de.createText(" "),R.end);de.setSelection(q.end)})}catch(de){console.warn("[SEIPro] escrita interativa: falha ao inserir",de?.message)}M.editing.view.focus()},{priority:"highest"}),T._seiProEscrita=!0,!0}let w={lista:null,itens:[],indice:0,gatilho:null,editor:null,seq:0,scrollJanelaLigado:!1},y=()=>e.win.CKEDITOR;function S(k){let T=k.getSelection()?.getRanges()[0];if(!T?.collapsed)return null;T=T.clone();let L=T.startPath(),N=L.block||L.blockLimit;return N?(T.setStartAt(N,y().POSITION_AFTER_START),T.cloneContents().$.textContent):null}function D(){w.lista&&(w.lista.remove(),w.lista=null),w.itens=[],w.indice=0,w.gatilho=null,w.seq++}function H(k){try{let M=k.window.$,T=M.getSelection();if(!T?.rangeCount)return null;let L=T.getRangeAt(0).cloneRange(),N=L.getClientRects(),z=N.length?N[N.length-1]:null;(!z||!z.width&&!z.height)&&L.startContainer.nodeType===3&&L.startOffset>0&&(L.setStart(L.startContainer,L.startOffset-1),N=L.getClientRects(),z=N.length?N[N.length-1]:null),z||(z=L.startContainer.nodeType===1?L.startContainer.getBoundingClientRect():L.startContainer.parentNode.getBoundingClientRect());let Q=M.frameElement?M.frameElement.getBoundingClientRect():{left:0,top:0};return{left:Q.left+z.right,top:Q.top+z.top,bottom:Q.top+z.bottom}}catch{return null}}function O(k){if(!w.lista||!w.itens.length)return;let M=w.itens.length;w.indice=(k+M)%M;let T=w.lista.querySelectorAll("li[data-i]");Array.prototype.forEach.call(T,N=>N.classList.toggle("ativo",Number(N.getAttribute("data-i"))===w.indice));let L=T[w.indice];L?.scrollIntoView&&L.scrollIntoView({block:"nearest"})}let $=k=>k.target?.closest?.("li[data-i]")??null;function B(k,M){if(A(),!w.lista){let Z=n.createElement("ul");Z.className="seipro-escrita-lista",Z.addEventListener("mousedown",ue=>{ue.preventDefault();let de=$(ue);de&&V(Number(de.getAttribute("data-i")))}),Z.addEventListener("mouseover",ue=>{let de=$(ue);de&&O(Number(de.getAttribute("data-i")))}),n.body.appendChild(Z),w.lista=Z}let T=w.lista;for(;T.firstChild;)T.removeChild(T.firstChild);if(w.itens=M,w.indice=0,!M.length){let Z=n.createElement("li");Z.className="vazio",Z.textContent="Nenhum resultado encontrado",T.appendChild(Z)}M.forEach((Z,ue)=>{let de=n.createElement("li");de.setAttribute("data-i",String(ue)),de.appendChild(h(Z)),T.appendChild(de)}),O(0);let L=H(k);if(!L){D();return}let N=T.offsetHeight||0,z=T.offsetWidth||0,Q=e.win.innerHeight||Number.POSITIVE_INFINITY,X=e.win.innerWidth||Number.POSITIVE_INFINITY,oe=L.bottom+4+N>Q&&L.top-4-N>0?L.top-4-N:L.bottom+4,ie=Math.max(4,Math.min(L.left,X-z-8));T.style.top=`${oe}px`,T.style.left=`${ie}px`}function G(k,M){let T=k.window.$,L=T.getSelection();if(!L?.rangeCount)return!1;let N=L.getRangeAt(0),z=N.startContainer,Q=N.startOffset;if(z.nodeType!==3){let ae=z,R=Q>0?ae.childNodes[Q-1]??null:null;for(;R&&R.nodeType!==3&&R.lastChild;)R=R.lastChild;if(R?.nodeType!==3)return!1;z=R,Q=z.data.length}let X=z.parentNode;for(;X&&X.nodeType===1&&!/^(P|DIV|LI|TD|TH|H[1-6]|BODY|BLOCKQUOTE)$/.test(X.nodeName);)X=X.parentNode;let oe=T.document.createTreeWalker(X||T.document.body,4,null);oe.currentNode=z;let ie=M;for(;ie>Q;){ie-=Q;let ae=oe.previousNode();if(!ae)return!1;z=ae,Q=ae.data.length}let Z=T.document.createRange();Z.setStart(z,Q-ie),Z.setEnd(N.endContainer,N.endOffset);let ue=k.createRange(),de=y().dom.node;return ue.setStart(new de(Z.startContainer),Z.startOffset),ue.setEnd(new de(Z.endContainer),Z.endOffset),ue.select(),!0}function V(k){let M=w.itens[k],T=w.gatilho,L=w.editor;D(),!(!M||!T||!L)&&t.withEdit(L,()=>{G(L,1+T.consulta.length)&&t.insertHtml(L,`${M.html}&nbsp;`)})}function W(k){if(!(!k||k._seiProEscrita)){k._seiProEscrita=!0,k.on("blur",()=>D()),k.on("destroy",()=>D());try{k.window.$.addEventListener("scroll",D,!0)}catch{}w.scrollJanelaLigado||(w.scrollJanelaLigado=!0,e.win.addEventListener("scroll",()=>{w.lista&&D()},!0))}}function _(k,M){let T=k;return!w.lista||w.editor!==T?!1:M===40?(O(w.indice+1),!0):M===38?(O(w.indice-1),!0):M===27?(D(),!0):M===13||M===9?w.itens.length?(V(w.indice),!0):(D(),!1):!1}let C=k=>{try{return!!k.readOnly}catch{return!1}};function m(k){let M=k;if(!M||!l()||C(M)){D();return}W(M);let T;try{T=S(M)}catch{T=null}let L=T?wr(T):null;if(!L){D();return}if(w.gatilho&&w.editor===M&&w.gatilho.marcador===L.marcador&&w.gatilho.consulta===L.consulta&&w.gatilho.inicio===L.inicio)return;let N=++w.seq;d(L.marcador,L.consulta).then(z=>{if(N===w.seq){if(!z.length&&(L.marcador==="@"||!L.consulta)){D();return}w.gatilho=L,w.editor=M,B(M,z),w.seq=N}})}let v={detectarGatilho:wr,buscar:d,provedores:b,instalarCK5:E,ck4Tecla:_,ck4AoDigitar:m,ck4Fechar:D},P=!1;return{api:v,iniciar:()=>{P||(P=!0,t.waitReady(3e4).then(()=>{if(t.versao!==5)return;let k=t.getInstance();E(k)||console.warn("[SEIPro] escrita interativa: CK5 sem plugin Mention")}).catch(()=>{}))}}}var Tr={id:"escrita-interativa",globais:e=>({SeiProEscritaInterativa:Sr(e).api}),iniciar:e=>Sr(e).iniciar()};var Zo="spro_editor_folha",Ir="seipro-folha-editor",vo="data-spro-folha-editor";function vi(e){return`html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable, html:root body[contenteditable] { background-color: ${e} !important; background-image: none !important; }
`}function xi(e){let o=`html[${vo}]`,t=`[${vo}]`,n=e?"#141619":"#f3f4f7",r=e?"#2a2d33":"#e3e6ee",i=e?"#202123":"#ffffff",l="rgba(20, 25, 50, .13)",c=`14px 0 24px -14px ${l}, -14px 0 24px -14px ${l}`,a=`0 14px 24px -14px ${l}`,u=`${o} .cke_contents[data-spro-folha]`;return`${o} #divEditores, ${o} .cke_inner, ${o} .cke { background-color: ${n} !important; }
${o} #divEditores { padding-bottom: 28px; }
${u} { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: ${i} !important; border: 0 solid ${r}; border-width: 0 1px; box-shadow: ${c}; clip-path: inset(0 -30px); }
${u}[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }
${u}[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px; box-shadow: ${c}, ${a}; clip-path: inset(0 -30px -30px); }
${u}[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }
@media (max-width: 1000px) { ${u} { padding-left: 20px; padding-right: 20px; } }
${o} .infra-editor__editor-completo { background-color: ${n} !important; }
${o} .infra-editor__editable-inner-container { box-sizing: border-box; width: min(940px, calc(100% - 24px)); margin: 28px auto; padding: 0; background-color: ${i} !important; border: 1px solid ${r}; border-radius: 12px; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12); }
${o} .infra-editor__editable-inner-container > .ck-content { box-sizing: border-box; width: 100%; max-width: none; margin: 0 !important; padding: 12px 56px !important; background-color: transparent !important; border: 0 !important; border-radius: 0 !important; box-shadow: none !important; }
${o} .infra-editor__editable-inner-container > .ck-content:first-child { padding-top: 40px !important; }
${o} .infra-editor__editable-inner-container > .ck-content:last-child { padding-bottom: 40px !important; }
html[data-spro-tema="escuro"]${t} .infra-editor__editor-completo { background-color: #141619 !important; }
html[data-spro-tema="escuro"]${t} .infra-editor__editable-inner-container { background-color: #202123 !important; border-color: #2a2d33; }
`}function _r(e,o){if(!e.head||(e.querySelector(`style[data-style="${Ir}"]`)?.remove(),!o))return;let t=e.createElement("style");t.setAttribute("data-style",Ir),t.textContent=o,e.head.append(t)}function Mr(e,o,t="#ffffff"){if(!e?.style)return;let n=e.getAttribute("data-spro-folha-bg");if(o)n===null&&e.setAttribute("data-spro-folha-bg",`${e.style.getPropertyValue("background-color")}|${e.style.getPropertyPriority("background-color")}`),e.style.setProperty("background-color",t,"important");else if(n!==null){let[r,i]=n.split("|");e.removeAttribute("data-spro-folha-bg"),e.style.removeProperty("background-color"),r&&e.style.setProperty("background-color",r,i||"")}}var Lr={id:"folha-papel",globais(e){let o=e.doc,t=()=>!!e.win.localStorage?.getItem(Zo),n=()=>!!e.win.localStorage?.getItem("darkModePro")||o.documentElement.getAttribute("data-spro-tema")==="escuro",r=!1;function i(a){for(let u of o.querySelectorAll("iframe.cke_wysiwyg_frame")){let s=u.contentDocument;if(!s?.head)continue;let g=n()?"#202123":"#ffffff";_r(s,a?vi(g):null),Mr(s.documentElement,a,g),Mr(s.body,a,g)}}function l(a){let u=[...o.querySelectorAll(".cke_contents")];u.forEach((s,g)=>{if(!a){s.removeAttribute("data-spro-folha");return}let x=[g===0?"primeira":"",g===u.length-1?"ultima":""].filter(Boolean);s.setAttribute("data-spro-folha",x.join(" ")||"meio")})}function c(a){_r(o,a?xi(n()):null),i(a),l(a),a?o.documentElement.setAttribute(vo,""):o.documentElement.removeAttribute(vo);for(let u of o.querySelectorAll(".getPaperViewButtom"))u.classList.toggle("cke_button_on",a),u.classList.toggle("cke_button_off",!a),u.setAttribute("aria-pressed",a?"true":"false")}return{aplicarFolhaEditorPro:c,getPaperViewButtom(a){let u=!t();u?e.win.localStorage.setItem(Zo,"1"):e.win.localStorage.removeItem(Zo),c(u)},initFolhaEditorPro(){let a=e.win.CKEDITOR;if(typeof a?.on=="function"&&!r){r=!0;let u=s=>s.on("contentDom",()=>t()&&i(!0));for(let s of Object.values(a.instances??{}))u(s);a.on("instanceReady",s=>u(s.editor))}c(t())}}}};function yi(e){if(!e)return 16;let o=Number.parseFloat(e.ownerDocument.defaultView?.getComputedStyle?.(e)?.fontSize??"");return Number.isNaN(o)?16:o}var Rr={id:"font-size",globais:e=>({changeFontSize(o,t){let n=e.adaptador.getInstance(o);if(!n)return;let r=e.adaptador.getSelectedHtml(n);if(!r||r.trim()===""){Y(e.doc,"Selecione um texto para alterar o tamanho da fonte");return}let i=yi(e.adaptador.getSelectionElement(n)),l=t==="up"?i+2:i-2;l>7&&l<70&&e.adaptador.withEdit(n,()=>{e.adaptador.versao===4?e.adaptador.applyStyle(n,{element:"span",attributes:{style:`font-size: ${l}px`}}):e.adaptador.insertHtml(n,`<span style="font-size: ${l}px">${r}</span>`)})}})};var xo=/^(p|span|a|div|section|font|strong|b|em|i|u|s|strike|sub|sup|br|hr|img|style|table|thead|tbody|tfoot|tr|td|th|caption|colgroup|col|ul|ol|li|dl|dt|dd|blockquote|pre|code|h1|h2|h3|h4|h5|h6)$/,Ei=[{name:xo,attributes:!0},{name:xo,classes:!0},{name:xo,styles:!0}],io=e=>e.split("").join("[\\t\\n\\r]*"),Yo=new RegExp(`^[\\s\\x00-\\x20]*(${io("javascript")}|${io("vbscript")}|${io("livescript")}|${io("data")}[\\t\\n\\r\\s]*:[\\t\\n\\r\\s]*${io("text/html")})`,"i"),ki=[{name:/[\s\S]+/,attributes:[{key:/^on/i,value:!0}]},{name:/[\s\S]+/,attributes:[{key:/^(href|src|srcset|action|formaction|background|poster|lowsrc|dynsrc|data|xlink:href)$/i,value:Yo}]}];function Ke(e,o){console.log("%c[SEIPro/GHS]","color:#3f51b5;font-weight:bold;",e,o===void 0?"":o)}function so(e,o){try{return e?.plugins?.has(o)?e.plugins.get(o):null}catch{return null}}var wi=e=>!!(e?.model&&e.editing&&e.conversion),Ai=e=>so(e,"EstiloEditing")?.estilos??{},Dr=(e,o)=>Object.hasOwn(e,o);function $r(e,o){let t=so(e,"GeneralHtmlSupport");if(typeof t?.getGhsAttributeNameForElement=="function")try{return t.getGhsAttributeNameForElement(o)}catch{}return`html${o.charAt(0).toUpperCase()}${o.slice(1)}Attributes`}function Ci(e,o){let t=e?.getAttribute?.(o)?.classes;return t?Array.isArray(t)?[...t]:Object.keys(t):[]}function Si(e,o,t){if(!o?.is?.("element"))return;let n=t.mapper.toViewElement(o);if(!n)return;let r=Ai(e),i=o.getAttribute("estilo"),l=Ci(o,$r(e,"p")),c=t.writer,a=[];try{a=Array.from(n.getClassNames())}catch{}for(let u of a)u!==i&&Dr(r,u)&&c.removeClass(u,n);for(let u of l)Dr(r,u)||c.addClass(u,n);i&&c.addClass(i,n)}function Pi(e){if(e.__seiProGhsConversor)return;e.__seiProGhsConversor=!0;let o=["attribute:estilo:paragraph",`attribute:${$r(e,"p")}:paragraph`];e.conversion.for("downcast").add(t=>{for(let n of o)t.on(n,(r,i,l)=>{try{Si(e,i.item,l)}catch{}},{priority:"lowest"})})}function Ti(e){try{return Array.from(e.model.markers).some(o=>/coment/i.test(o.name))}catch{return!1}}function Nr(e,o){let t=so(o,"Salvar"),n=t?!!t.isDirty:!1;try{e()}finally{if(t&&!n)try{t.resetDirty()}catch{}}}function Ii(e){try{return e.model.document.history.getOperations().some(o=>o.batch?.isUndoable)}catch{return!0}}function _i(e,o){let t=e.getFullData({seiProInterno:!0}),n=o.INFRA_EDITOR_CONFIG?.initialData;return!n||typeof n!="object"||Ii(e)?t:Object.fromEntries(Object.keys(t).map(r=>[r,typeof n[r]=="string"?n[r]:t[r]]))}function Mi(e,o,t){try{let n=t??e.adaptador.getSelectionParagraph(o);if(!n)return null;if(typeof n.is=="function"&&n.is("element"))return n;let r=n.jquery?n.get(0):n;if(r?.nodeType!==1)return null;let i=o.editing.view.domConverter.mapDomToView(r);return i?o.editing.mapper.toModelElement(i):null}catch{return null}}function Li(e,o){try{return e.editing.mapper.toViewElement(o)?.name??null}catch{return null}}function qr(e){let o=i=>i??e.adaptador.getInstance();function t(i){let l=o(i);if(!wi(l))return!1;if(l.__seiProGhsLiberado)return!0;let c=so(l,"DataFilter");if(!c)return Ke("DataFilter (GHS) ausente neste editor; nada a liberar"),!1;try{c.allowElement({name:xo,attributes:!0,classes:!0,styles:!0});for(let a of Ei)c.allowAttributes(a);if(typeof c.disallowAttributes=="function")for(let a of ki)c.disallowAttributes(a)}catch(a){return Ke("falha ao liberar o GHS",a),!1}return l.__seiProGhsLiberado=!0,Pi(l),!0}function n(i){let l=o(i);if(!t(l)||typeof l.getFullData!="function")return!1;let c=!0;return Nr(()=>{try{l.data.set(_i(l,e.win))}catch(a){Ke("falha ao reprocessar o conteudo",a),c=!1}},l),c}function r(i,l,c){let a=o(i);if(!t(a))return!1;let u=so(a,"GeneralHtmlSupport"),s=Mi(e,a,l),g=s?Li(a,s):null;if(!u||!s||!g)return!1;try{return c(u,g,s),!0}catch(x){return Ke("falha ao aplicar no model",x),!1}}return{liberar:t,aplicarRegras:n,semSujar:(i,l)=>Nr(i,o(l)),estaLiberado:i=>!!o(i)?.__seiProGhsLiberado,addClasse:(i,l,c)=>r(c,i,(a,u,s)=>a.addModelHtmlClass(u,l,s)),removeClasse:(i,l,c)=>r(c,i,(a,u,s)=>a.removeModelHtmlClass(u,l,s)),setEstilos:(i,l,c)=>r(c,i,(a,u,s)=>a.setModelHtmlStyles(u,l,s)),setAtributos:(i,l,c)=>r(c,i,(a,u,s)=>a.setModelHtmlAttributes(u,l,s))}}var Or={id:"ghs-unlock",globais:e=>({SeiProGhs:qr(e)}),iniciar(e){if(e.adaptador.versao!==5)return;let o=qr(e),t=e.adaptador.getInstance();if(!(!t||!o.liberar(t))){if(e.win.SEIPRO_GHS_AUTO===!1||Ti(t)){Ke("regras liberadas (ativacao no pr\xF3ximo data.set)");return}o.aplicarRegras(t)&&Ke("classes, estilos e atributos liberados no editor")}}};var Hr="\u{1F5A8}\uFE0F * CONFIGURA\xC7\xD5ES DE IMPRESS\xC3O",Ri="Configura\xE7\xF5es de impress\xE3o (r\xF3tulo recuperado pelo SEI Pro)",zr='style[data-style="seipro-imagebg-print"]',Br="dialogPageImageBackground",Gr=[["landscape","Paisagem"],["portrait","Retrato"]],Wr=[["A5","A5"],["A4","A4"],["A3","A3"],["tabloid","Tabloid"],["letter","Letter"],["legal","Legal"]],Kr=[["3cm 2cm 3cm 2cm","Padr\xE3o (3cm 2cm)"],["0cm","Nenhuma (0cm)"],["1cm 1cm 1cm 1cm","M\xEDnima (1cm)"]],Jr=[["3cm 2cm 3cm 2cm","Padr\xE3o (3cm 2cm)"],["0cm","Nenhuma (0cm)"],["1cm 1cm 1cm 1cm","M\xEDnima (1cm)"]],Xr=["Helvetica","Arial","Arial Black","Calibri","Verdana","Tahoma","Trebuchet MS","Impact","Gill Sans","Times New Roman","Georgia","Palatino","Baskerville","Andal\xE9 Mono","Courier","Lucida","Monaco","Bradley Hand","Brush Script MT","Luminari","Comic Sans MS"],Zr=[["top center","Topo Centralizada \u2238"],["top right","Top Direito \u25F3"],["top left","Top Esquerdo \u25F0"],["bottom center","Inferior Centralizado \u2A66"],["bottom right","Inferior Direito \u25F2"],["bottom left","Inferior Esquerdo \u25F1"],["center center","Meio Direito \u27E5"],["center left","Meio Esquerdo \u27E4"]],Yr=[["cover","Capa (cover)"],["contain","Contida (contain)"]],en=[["no-repeat","Sem repeti\xE7\xE3o"],["repeat-x","Repeti\xE7\xE3o horizontal"],["repeat-y","Repeti\xE7\xE3o vertical"],["repeat","Repeti\xE7\xE3o vertical e horizontal"],["round","Comprimida ou estivada"],["space","Repeti\xE7\xE3o em corte"]],on=[["background","Imagem de fundo"],["page_cover","Imagem como capa de livro"]],ye={primeirapg:!1,cabecalho:"",rodape:"",visivel:!0,reducao:!0,layout:"portrait",papel:"A4",margem:"0cm",padding:"3cm 2cm 3cm 2cm",escala:"100",fonte:"Calibri",posicao:"top center",disposicao:"contain",utilizacao:"background",repeticao:"no-repeat"},Fr={A5:[148,210],A4:[210,297],A3:[297,420],tabloid:[279,432],letter:[215.9,279.4],legal:[216,356]},Di={"A4 landscape":"21cm","A4 portrait":"29.7cm","letter landscape":"21.59cm","letter portrait":"27.94cm","legal landscape":"21.6cm","legal portrait":"35.6cm","tabloid landscape":"27.9cm","tabloid portrait":"43.2cm","A5 landscape":"14.8cm","A5 portrait":"21cm","A3 landscape":"29.7cm","A3 portrait":"42cm"},Ni=["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam ut mi lacus. Nulla et metus finibus, pretium enim at, ultrices dui. Aliquam ut mauris convallis, eleifend orci quis, pulvinar augue. Aenean ultrices malesuada ante, non tempor sem placerat in. Nunc ultrices odio ut lorem gravida volutpat. Praesent sed arcu sollicitudin, molestie urna eget, consectetur nulla. Ut sed orci mollis, consequat tortor sed, congue leo.","Donec ac auctor libero, eu rutrum libero. Nunc sollicitudin felis tempor, convallis augue vitae, tincidunt elit. In quis volutpat erat. Phasellus feugiat purus porta libero vehicula sodales. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.","Sed convallis ante leo, eu rhoncus nisi dignissim a. Nullam convallis magna sed magna consectetur, nec gravida velit suscipit. Donec sit amet mi ut massa dapibus imperdiet nec quis eros. Vestibulum fringilla mattis metus at lobortis."],Fe=e=>e.map(o=>o[0]),$e=(e,o,t)=>typeof e=="string"&&o.includes(e)?e:t;function tn(e){let o=Number(String(e??"").trim());return Number.isFinite(o)&&o>0&&o<=1e3?String(o):ye.escala}function ot(e){let o=ye,t=(r,i)=>typeof r=="boolean"?r:i,n=r=>typeof r=="string"?r:typeof r=="number"?String(r):"";return{primeirapg:t(e.primeirapg,o.primeirapg),cabecalho:n(e.cabecalho),rodape:n(e.rodape),visivel:t(e.visivel,o.visivel),reducao:t(e.reducao,o.reducao),layout:$e(e.layout,Fe(Gr),o.layout),papel:$e(e.papel,Fe(Wr),o.papel),margem:$e(e.margem,Fe(Kr),o.margem),padding:$e(e.padding,Fe(Jr),o.padding),escala:tn(e.escala),fonte:$e(e.fonte,Xr,o.fonte),posicao:$e(e.posicao,Fe(Zr),o.posicao),disposicao:$e(e.disposicao,Fe(Yr),o.disposicao),utilizacao:$e(e.utilizacao,Fe(on),o.utilizacao),repeticao:$e(e.repeticao,Fe(en),o.repeticao)}}function jr(e,o){let[t,n]=Fr[e]??Fr.A4;return o==="landscape"?[n,t]:[t,n]}function Qr(e){return e.replace(/\\/g,"\\\\").replace(/"/g,'\\"').replace(/[\r\n]+/g," ").replace(/</g,"\\3c ")}function et(e){return/^(data:image\/[a-z0-9.+-]+(;[a-z0-9=.+-]+)*[;,][^"'()<>\s\\]*|https?:\/\/[^"'()<>\s\\]+)$/i.test(e)}function qi(e,o){let t=o.cabecalho===""?"":`body:before { display: block; position: fixed; text-align: center; content: "${Qr(o.cabecalho)}"; top: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }`,n=o.rodape===""?"":`body:after { display: block; position: fixed; text-align: center; content: "${Qr(o.rodape)}"; bottom: 0.5cm; width: 100%; color: #717171; font-size: 8pt; font-family: Calibri; }`,r="";if(o.utilizacao==="page_cover"){let i=Di[`${o.papel} ${o.layout}`];i&&(r=`padding-top: ${i} !important;`)}return`.imgBgAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; } html.dark-mode .imgBgAncora, html.dark-mode .imgBgAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; } body.cke_editable .imgBgAncora:after { content: " [delete isto para remover]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; } @media print {   @page${o.primeirapg?":first":""} { size: ${o.papel} ${o.layout}; margin: ${o.margem}; }`+(o.visivel?"":" }")+`   body p, body p * { font-size: ${o.escala}% !important; font-family: ${o.fonte} !important; }   .imgBgAncora { display: none; }   body { padding: ${o.padding}; ${r} background-position: ${o.posicao}; background-size: ${o.disposicao}; background-repeat: ${o.repeticao}; background-image: url("${e}"); }   ${t}   ${n}`+(o.visivel?" }":"")}function $i(e){let o=[`Layout: ${e.layout==="portrait"?"Retrato":"Paisagem"}`,`Tamanho do Papel: ${e.papel}`,`Escala (%): ${e.escala}`,`Margens Externas: ${e.margem}`,`Margens Internas: ${e.padding}`,`Fonte: ${e.fonte}`,`Posi\xE7\xE3o da Imagem: ${e.posicao}`,`Disposi\xE7\xE3o da Imagem: ${e.disposicao}`,`Repeti\xE7\xE3o da Imagem: ${e.repeticao}`,`Utiliza\xE7\xE3o da Imagem: ${e.utilizacao==="page_cover"?"Imagem como capa de livro":"Imagem de fundo"}`];return e.cabecalho&&o.push(`Texto do Cabe\xE7alho: ${e.cabecalho}`),e.rodape&&o.push(`Texto do Rodap\xE9: ${e.rodape}`),o.push(`Vis\xEDvel apenas ao imprimir: ${e.visivel?"Sim":"N\xE3o"}`),o.push(`Aplicar apenas na primeira p\xE1gina: ${e.primeirapg?"Sim":"N\xE3o"}`),o.push(`Reduzir qualidade da imagem: ${e.reducao?"Sim":"N\xE3o"}`),o.join(`
`)}function Ur(e){let o=n=>e.getAttribute(`data-${n}`)??void 0,t=n=>{let r=o(n);return r===void 0?void 0:r==="true"};return ot({primeirapg:t("primeirapg"),cabecalho:o("cabecalho"),rodape:o("rodape"),visivel:t("visivel"),reducao:t("reducao"),layout:o("layout"),papel:o("papel"),margem:o("margem"),padding:o("padding"),escala:o("escala"),fonte:o("fonte"),posicao:o("posicao"),disposicao:o("disposicao"),utilizacao:o("utilizacao"),repeticao:o("repeticao")})}function Vr(e){if(!e?.querySelector||e.querySelector(".imgBgAncora")||!e.querySelector("style"))return!1;let o=e.cloneNode(!0);for(let t of Array.from(o.querySelectorAll("style")))t.remove();return(o.textContent??"").replace(/[\s\u00a0]/g,"")===""}var tt={id:"image-background",globais(e){let o=e.adaptador,t=e.win,n=_=>Y(e.doc,_),r=null,i=_=>_??e.doc.querySelector(`#${Br}`)??e.doc,l=(_,C)=>_.querySelector(`#${C}`),c=(_,C)=>l(_,C)?.value??"",a=(_,C,m)=>{let v=l(_,C);v&&(v.value=m)},u=(_,C)=>{let m=l(_,C);return!!m&&(typeof m.checked=="boolean"?m.checked:m.hasAttribute("checked"))},s=(_,C,m)=>{let v=l(_,C);v&&(v.checked=m,m?v.setAttribute("checked",""):v.removeAttribute("checked"))};function g(_,C,m){return f("select",{id:_,class:_},...C.map(([v,P])=>f("option",{value:v,selected:v===m},P)))}function x(){let[_,C]=jr(ye.papel,ye.layout),m=[];return Ni.forEach((v,P)=>{P>0&&m.push(f("br")),m.push(v)}),f("div",{class:"spro-pagina-previa"},f("div",{class:"spro-previa papel"},f("div",{id:"boxBgPreview",style:`text-align:left;width:${_}px;height:${C}px;margin:18px auto;background:#fff;border:1px solid rgb(204,204,204);border-radius:5px;box-shadow:rgb(219,219,219) 0px 6px 5px -5px;overflow:hidden;font-size:100%;`},f("div",{id:"imgBgPreview",style:"padding:30px 20px;"},f("p",{style:"font-family:Calibri;color:rgb(119,119,119);font-size:100%;white-space:pre-line;"},...m)))))}function p(_){let C=l(_,"boxBgPreview"),m=l(_,"imgBgPreview");if(!C||!m)return;let[v,P]=jr(c(_,"tipoPapel"),c(_,"tipoLayout"));C.style.setProperty("width",`${v}px`),C.style.setProperty("height",`${P}px`);let I=C.querySelector("p");I&&(I.style.setProperty("font-size",`${tn(c(_,"tipoEscala"))}%`),I.style.setProperty("font-family",c(_,"tipoFonte")),I.style.setProperty("visibility",c(_,"tipoUtilizacao")==="page_cover"?"hidden":"visible")),m.style.setProperty("background-position",c(_,"tipoPosicao")),m.style.setProperty("background-size",c(_,"tipoDisposicao")),m.style.setProperty("background-repeat",c(_,"tipoRepeticao"));let k=M=>M==="3cm 2cm 3cm 2cm"?"30px 20px":M==="1cm 1cm 1cm 1cm"?"10px":"0";m.style.setProperty("padding",k(c(_,"tipoPadding"))),m.style.setProperty("margin",k(c(_,"tipoMargem")))}function b(_,C){let m=i(_),v=l(m,"imgBgPreview");y(m,C,!1,P=>{v&&et(P)&&v.style.setProperty("background-image",`url("${P}")`)})}function d(_,C){try{if(C){let v=C.querySelector("style");if(v||(v=C.closest("p")?.querySelector("style")??null),v)return v.textContent??""}let m=o.findInBody(_,zr)[0];if(m)return m.textContent??""}catch{}return""}function h(_){return o.findInBody(_,".imgBgAncora")[0]}function A(_,C){let m=C??r??o.getInstance(),v=i(_),P=l(v,"imgBgPreview");if(!m)return P?.style.setProperty("background-image","none"),!1;let I=h(m),k=I?Ur(I):null,M=d(m,I).match(/\((.*?)\)/),T=M?.[1]?M[1].replace(/('|")/g,""):"";return T&&et(T)?(P?.style.setProperty("background-image",`url("${T}")`),k&&(P?.style.setProperty("background-position",k.posicao),P?.style.setProperty("background-size",k.disposicao),P?.style.setProperty("background-repeat",k.repeticao)),T):(P?.style.setProperty("background-image","none"),!1)}function E(_,C){let m=C??r??o.getInstance(),v=i(_),P=m?h(m):void 0,I=P?Ur(P):ye,k=l(v,"fileInputImportImage");k&&(k.value=""),a(v,"tipoLayout",I.layout),a(v,"tipoPapel",I.papel),a(v,"tipoEscala",I.escala),a(v,"tipoMargem",I.margem),a(v,"tipoPadding",I.padding),a(v,"tipoFonte",I.fonte),a(v,"tipoPosicao",I.posicao),a(v,"tipoDisposicao",I.disposicao),a(v,"textoCabecalho",I.cabecalho),a(v,"textoRodape",I.rodape),s(v,"visibleOnPrint",I.visivel),s(v,"onlyFirst",I.primeirapg),s(v,"reduceQualityImg",I.reducao),a(v,"tipoRepeticao",I.repeticao),a(v,"tipoUtilizacao",I.utilizacao),p(v),m&&A(v,m),b(v,m)}function w(_){return ot({primeirapg:u(_,"onlyFirst"),cabecalho:c(_,"textoCabecalho"),rodape:c(_,"textoRodape"),visivel:u(_,"visibleOnPrint"),reducao:u(_,"reduceQualityImg"),layout:c(_,"tipoLayout"),papel:c(_,"tipoPapel"),margem:c(_,"tipoMargem"),padding:c(_,"tipoPadding"),escala:c(_,"tipoEscala"),fonte:c(_,"tipoFonte"),posicao:c(_,"tipoPosicao"),disposicao:c(_,"tipoDisposicao"),utilizacao:c(_,"tipoUtilizacao"),repeticao:c(_,"tipoRepeticao")})}function y(_,C,m=!1,v){let P=C??r??o.getInstance(),I=i(_),k=P?A(I,P):!1,M=l(I,"fileInputImportImage")?.files?.[0],T=w(I);return M?M.type&&!/^image\//i.test(M.type)?(n("Escolha um arquivo de imagem."),!1):(S(M,T,v||void 0),!0):m&&k?($(k,T,P),!0):!m&&k&&typeof v=="function"?(v(k,T),!0):!1}function S(_,C,m){let v=new t.FileReader;v.onload=()=>{let P=String(v.result??"");if(!/^data:image\//i.test(P)){n("Escolha um arquivo de imagem.");return}if(Number(t.qualidadeImagens??0)>0&&C.reducao&&typeof t.qualityImages=="function"){let k=e.doc.createElement("img");k.className="img-base64",k.onload=()=>{try{t.qualityImages?.(k,k)}catch{}let M=0,T=()=>{M+=1;let L=k.getAttribute("src")??P;L!==P||M>=50?m?.(L,C):setTimeout(T,60)};setTimeout(T,60)},k.src=P}else setTimeout(()=>m?.(P,C),10)},v.onerror=()=>n("N\xE3o foi poss\xEDvel ler a imagem."),v.readAsDataURL(_)}function D(_){let C=e.win.DOMParser??globalThis.DOMParser;return new C().parseFromString(`<!doctype html><html><body>${_}</body></html>`,"text/html")}function H(_,C,m){let v=_.createElement("p");v.setAttribute("class","Tabela_Texto_Alinhado_Esquerda");let P=_.createElement("span");P.setAttribute("class","imgBgAncora"),P.setAttribute("title",$i(m));let I=[["cabecalho",m.cabecalho],["rodape",m.rodape],["primeirapg",String(m.primeirapg)],["visivel",String(m.visivel)],["reducao",String(m.reducao)],["layout",m.layout],["papel",m.papel],["margem",m.margem],["padding",m.padding],["escala",m.escala],["fonte",m.fonte],["posicao",m.posicao],["disposicao",m.disposicao],["utilizacao",m.utilizacao],["repeticao",m.repeticao]];for(let[M,T]of I)P.setAttribute(`data-${M}`,T);P.append(_.createTextNode(Hr));let k=_.createElement("style");return k.setAttribute("data-style","seipro-imagebg-print"),k.setAttribute("type","text/css"),k.append(_.createTextNode(qi(C,m))),v.append(P,k),v}function O(_){let C=h(_);if(!C)return;let m=[0,1,0,1];C.style.setProperty("transition","opacity .1s"),m.forEach((v,P)=>{setTimeout(()=>{C.style.setProperty("opacity",String(v)),P===m.length-1&&(C.style.removeProperty("opacity"),C.style.removeProperty("transition"))},P*100)});try{C.scrollIntoView?.()}catch{}}function $(_,C,m){let v=m??r??o.getInstance();if(!v)return;if(!et(_)){n("Imagem de fundo inv\xE1lida: use uma imagem do computador (PNG, JPG ou SVG).");return}if(o.somenteLeitura(v)){o.recusarEscrita();return}let P=ot(C);o.focus(v),o.saveSnapshot(v),o.transformBodyHtml(v,I=>{let k=D(I),M=k.body,T=M.querySelector(".imgBgAncora");T&&(T.closest("p")??T).remove();for(let L of Array.from(M.querySelectorAll(zr)))(L.closest("p")??L).remove();return M.prepend(H(k,_,P)),M.innerHTML}),o.saveSnapshot(v),t.enableButtonSavePro?.(),setTimeout(()=>O(v),0)}function B(_){return o.findInBody(_,"style").some(C=>Vr(C.closest("p")))}function G(_){let C=_??o.getInstance();if(!C||!B(C))return!1;let m=()=>{o.transformBodyHtml(C,v=>{let P=D(v);for(let I of Array.from(P.body.querySelectorAll("p > style"))){let k=I.parentElement;if(!k||!Vr(k))continue;let M=P.createElement("span");M.setAttribute("class","imgBgAncora"),M.setAttribute("title",Ri),M.append(P.createTextNode(Hr)),k.prepend(M)}return P.body.innerHTML})};return t.SeiProGhs?.semSujar?t.SeiProGhs.semSujar(m,C):m(),!0}function V(_){let C=_??r??o.getInstance();if(!C)return;r=C;let m=f("input",{type:"file",id:"fileInputImportImage",accept:"image/*"}),v=f("input",{type:"number",step:"10",id:"tipoEscala",class:"tipoEscala",value:ye.escala}),P=f("input",{type:"text",id:"textoCabecalho",class:"textoCabecalho",value:""}),I=f("input",{type:"text",id:"textoRodape",class:"textoRodape",value:""}),k=Xr.map(Q=>[Q,Q]),M=Re("Restaurar padr\xF5es",()=>E(N,C),{id:"resetImgBgLink"}),T=f("button",{type:"button",id:"okImgBg",class:"spro-botao primario",onclick:()=>{if(o.somenteLeitura(C)){o.recusarEscrita();return}if(!y(N,C,!0,(X,oe)=>$(X,oe,C))){l(N,"fileInputImportImage")?.files?.[0]||n("Selecione uma imagem para usar como fundo da p\xE1gina.");return}z.fechar()}},"OK"),L=re(j("Importar imagem (PNG, JPG ou SVG)",{para:"fileInputImportImage"},m),le("tres",j("Layout",{para:"tipoLayout"},g("tipoLayout",Gr,ye.layout)),j("Tamanho do Papel",{para:"tipoPapel"},g("tipoPapel",Wr,ye.papel)),j("Escala (%)",{para:"tipoEscala"},to(v,"%"))),le("tres",j("Margens Externas",{para:"tipoMargem"},g("tipoMargem",Kr,ye.margem)),j("Margens Internas",{para:"tipoPadding"},g("tipoPadding",Jr,ye.padding)),j("Fonte",{para:"tipoFonte"},g("tipoFonte",k,ye.fonte))),le("tres",j("Posi\xE7\xE3o da Imagem",{para:"tipoPosicao"},g("tipoPosicao",Zr,ye.posicao)),j("Disposi\xE7\xE3o da Imagem",{para:"tipoDisposicao"},g("tipoDisposicao",Yr,ye.disposicao)),j("Repeti\xE7\xE3o da Imagem",{para:"tipoRepeticao"},g("tipoRepeticao",en,ye.repeticao))),le("tres",j("Utiliza\xE7\xE3o da Imagem",{para:"tipoUtilizacao"},g("tipoUtilizacao",on,ye.utilizacao)),j("Texto do Cabe\xE7alho",{para:"textoCabecalho"},P),j("Texto do Rodap\xE9",{para:"textoRodape"},I)),f("div",{class:"spro-checklist"},ge({id:"visibleOnPrint",class:"visibleOnPrint",checked:!0},"Vis\xEDvel apenas ao imprimir"),ge({id:"onlyFirst",class:"onlyFirst"},"Aplicar apenas na primeira p\xE1gina"),ge({id:"reduceQualityImg",class:"reduceQualityImg",checked:!0},"Reduzir qualidade da imagem")),f("div",{class:"spro-dialogo-rodape"},M,T)),N=f("div",{id:Br,class:"spro-lateral-imgbg"},L,x());for(let Q of Array.from(N.querySelectorAll("input, select")))Q.addEventListener("change",()=>{p(N),b(N,C)});v.addEventListener("input",()=>p(N));let z=te(e.doc,{titulo:"Adicionar Imagem de Fundo e Configura\xE7\xF5es de P\xE1gina para Impress\xE3o",largura:960,conteudo:N});E(N,C)}function W(_){t.setParamEditor?.(_);let C=o.getInstance(_);if(!C){typeof t.alertaBoxPro=="function"?t.alertaBoxPro("Aten\xE7\xE3o","exclamation-circle","Editor n\xE3o encontrado."):n("Editor n\xE3o encontrado.");return}r=C,V(C)}return{pageImageBackground:W,getDialogPageImageBackground:()=>{},openDialogPageImageBackground:V,getImagemBgOnEditor:A,resetOptionsImgBg:E,getPreviewImagePageBackground:b,getImagePageBackground:y,loadImagePageBackground:S,templateImagePageBackground:$,normalizeImgBgAncora:G}},iniciar(e){if(e.adaptador.versao!==5)return;let o=e.win,t=tt.globais(e),n=15,r=()=>{let i=e.adaptador.getInstance();if(i&&o.SeiProGhs?.estaLiberado?.(i)){t.normalizeImgBgAncora(i);return}n-=1,n>0&&setTimeout(r,200)};r()}};function rn(e){return{onclick:e,onkeydown:o=>{let t=o.key;t!=="Enter"&&t!==" "||(o.preventDefault(),e(o))}}}function yo(e,o){return new Promise((t,n)=>{let r=new e.Image;r.crossOrigin="anonymous",r.onload=()=>{try{let i=e.document.createElement("canvas");i.width=r.width,i.height=r.height,i.getContext("2d")?.drawImage(r,0,0),t(i.toDataURL("image/png"))}catch(i){n(i)}},r.onerror=()=>n(new Error("imagem nao carregou")),r.src=o})}function ve(e){try{let o=new URL(e);return o.protocol==="http:"||o.protocol==="https:"}catch{return!1}}function rt(e){let o=Number.parseInt(String(e??""),10);return Number.isNaN(o)?60:Math.min(100,Math.max(1,o))}var nn={id:"image-quality",globais(e){let o=e.adaptador,t=e.win;function n(r){let i=o.getInstance(r);if(!i)return;let l=ro({id:"batchImgQualityRange",min:1,max:100,step:1,value:rt(t.qualidadeImagens)});l.addEventListener("input",()=>Qe(a,"batchImgQualityRange",`${l.value}%`));let c=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let s=Number(l.value);o.withEdit(i,()=>{for(let g of o.findInBody(i,"img"))t.qualityImages?.(g,g,s*.01)}),u.fechar()}},"Aplicar"),a=re(j("Qualidade da imagem",{para:"batchImgQualityRange",valor:`${l.value}%`},l),ce("Qualidade menor deixa o arquivo mais leve, com mais perda de nitidez. Vale para todas as imagens do documento."),f("div",{class:"spro-dialogo-rodape"},c)),u=te(e.doc,{titulo:"Reduzir qualidade das imagens",largura:460,conteudo:a})}return{openDialogBatchImgQuality:n,getDialogBatchImgQuality:()=>{}}}};var Oi="Escolha um arquivo de imagem.",Hi="Escolha uma imagem ou informe a URL.",zi="Informe uma URL de imagem v\xE1lida (http ou https).",Bi="N\xE3o foi poss\xEDvel converter a imagem da URL em base64 (o servidor da imagem n\xE3o permite a c\xF3pia). Baixe a imagem e envie o arquivo.",Fi="Na imagem centralizada (em bloco) o SEI 5 guarda s\xF3 o tamanho e o texto alternativo. Para margens, borda, filtro e alinhamento, escolha antes \u201CTexto ao redor\u201D na barra da imagem.";function ji(e){return e>1099511627776?`${Math.round(e/1099511627776*100)/100} Tb`:e>1073741824?`${Math.round(e/1073741824*100)/100} Gb`:e>1048576?`${Math.round(e/1048576*100)/100} Mb`:`${Math.round(e/1024*100)/100} Kb`}function Qi(e){let o=e.replace(/\s+/g,"");if(!/^[A-Za-z0-9+/]*={0,2}$/.test(o))return null;let t=o.endsWith("==")?2:o.endsWith("=")?1:0;return Math.floor(o.length*3/4)-t}function Ui(e){let o=new Map;for(let t of(e.getAttribute("style")??"").split(";")){let n=t.indexOf(":");if(n<0)continue;let r=t.slice(0,n).trim().toLowerCase();r&&o.set(r,t.slice(n+1).trim())}return o}function an(e,o,t){let n=`<img src="${ne(e)}"`;for(let[r,i]of Object.entries(o)){if(i===""){r==="alt"&&(n+=' alt=""');continue}n+=` ${r}="${ne(i)}"`}return t&&(n+=` style="${ne(t)}"`),`${n}>`}var Vi=[{k:"width",attr:"width",css:"width:#;",minimo:1},{k:"height",attr:"height",css:"height:#;",minimo:1},{k:"maxwidth",attr:"maxwidth",css:"max-width:#;object-fit: contain;",minimo:1},{k:"maxheight",attr:"maxheight",css:"max-height:#;object-fit: contain;",minimo:1},{k:"vmargin",attr:"vspace",css:"margin-top:#;margin-bottom:#;",minimo:0},{k:"hmargin",attr:"hspace",css:"margin-left:#;margin-right:#;",minimo:0},{k:"align",attr:"align",css:""},{k:"filter",attr:"filter",css:""},{k:"border",attr:"border",css:"border:# solid black;",minimo:0}],sn={grayscale:"filter:grayscale(1);",blur:"filter:blur(3px);",shadow:"filter:drop-shadow(2px 4px 6px black);",invert:"filter:invert(1);",sepia:"filter:sepia(1);"},Gi=[["none","N\xE3o definido"],["top","Superior"],["bottom","Inferior"],["left","Esquerda"],["right","Direita"]],Wi=[["none","N\xE3o definido"],["grayscale","Escala de Cinza"],["blur","Borrado"],["shadow","Caixa Sombreada"],["invert","Cores Invertidas"],["sepia","Envelhecido"]],Ki=e=>e?typeof e.checked=="boolean"?e.checked:e.hasAttribute("checked"):!1,ln={id:"image-base64",globais(e){let o=e.adaptador,t=e.win,n=m=>Y(e.doc,m),r=m=>{let v=Number.parseFloat(String(t.qualidadeImagens));return Number.isNaN(v)?m:v},i=()=>{let m=e.win.Image;return m?new m:e.doc.createElement("img")},l=m=>(e.imagemParaDataUri??(v=>yo(e.win,v)))(m),c=(m,v)=>m.querySelector(`#${v}`),a=(m,v)=>c(m,v)?.value??"",u=(m,v,P)=>{let I=c(m,v);I&&(I.value=P)},s=(m,v,P)=>{if(typeof P!="string"||P==="")return;let I=c(m,v);I&&(I.tagName==="SELECT"&&![...I.querySelectorAll("option")].some(k=>k.getAttribute("value")===P)||(I.value=P))},g=(m,v)=>{let P=m.querySelector("#b64_loading");P&&(P.textContent=v)};function x(m){let v=M=>a(m,M),P=M=>{let T=Number.parseInt(M,10);return Number.isNaN(T)?0:T},[I,k]=[v("b64_width"),v("b64_height")];return{w:P(I),h:P(k),uw:I.includes("%")?"%":"px",uh:k.includes("%")?"%":"px"}}function p(m,v,P){let I=x(m),k="px";P==="width"?(I.uw==="%"&&(k="%"),I.h=Math.round(I.w/v.imgScal)):(I.uh==="%"&&(k="%"),I.w=Math.round(I.h*v.imgScal)),u(m,"b64_width",k==="%"?`${I.w}%`:String(I.w)),u(m,"b64_height",k==="%"?`${I.h}%`:String(I.h))}function b(m,v){let P=a(m,v),I=Number.parseInt(P,10);u(m,v,`${Number.isNaN(I)?0:I}${P.includes("%")?"%":""}`)}function d(m,v,P){if(typeof P!="string"||!P){g(m,"");return}let I=m.querySelector("#b64_preview"),k=i();g(m,"Carregando..."),k.onload=()=>{g(m,"");let M=k.naturalWidth||k.width||0,T=k.naturalHeight||k.height||0,L=!a(m,"b64_width"),N=!a(m,"b64_height");L&&(u(m,"b64_width",String(M)),v.autoW=String(M)),N&&(u(m,"b64_height",String(T)),v.autoH=String(T)),L&&N&&M>0&&T>0&&(v.imgScal=M/T),k.classList.add("previewImage"),k.setAttribute("alt",""),k.getAttribute("data-width")||k.setAttribute("data-width",String(M)),k.getAttribute("data-height")||k.setAttribute("data-height",String(T)),I?.append(k)},k.onerror=()=>g(m,""),k.onabort=()=>g(m,""),k.src=P,/^data:/i.test(P)||l(P).then(M=>{k.setAttribute("src",M)},()=>{})}function h(m,v,P){if(!P?.length)return;g(m,"Carregando...");let I=e.win.FileReader,k=!1,M=!1;for(let T of Array.from(P)){if(T?.type&&!/image.*/.test(T.type)){M=!0;continue}if(!I)continue;k=!0;let L=new I;L.onload=()=>{g(m,""),d(m,v,String(L.result??""))},L.onerror=()=>g(m,""),L.onabort=()=>g(m,"");try{L.readAsDataURL(T)}catch{g(m,"")}}k||(g(m,""),M&&n(Oi))}function A(m){let v=o.getSelectionElement(m);return v?.tagName&&v.tagName.toLowerCase()==="img"?v:v?.querySelector?.("img")??null}function E(m,v,P){let I=P.getAttribute("src"),k=P;if(typeof I=="string"&&I.startsWith("data:")){let N=Qi(I.slice(I.indexOf(",")+1)),z=m.querySelector("#b64_imglength");N!==null&&z&&(z.textContent=`Tamanho da imagem: ${ji(N)}`)}let M=P.getAttribute("width"),T=P.getAttribute("height");if((M===null||T===null)&&k.naturalWidth&&(M=String(k.width||k.naturalWidth),T=String(k.height||k.naturalHeight||"")),M!==null&&T!==null){u(m,"b64_width",M),u(m,"b64_height",T);let N=Number.parseInt(M,10),z=Number.parseInt(T,10);v.imgScal=!Number.isNaN(N)&&!Number.isNaN(z)&&z>0&&N>0?N/z:1}typeof I=="string"&&(I.startsWith("data:")?d(m,v,I):(u(m,"b64_url",I),v.ultimaUrl=I)),s(m,"b64_alt",P.getAttribute("alt")),s(m,"b64_hmargin",P.getAttribute("hspace")),s(m,"b64_vmargin",P.getAttribute("vspace")),s(m,"b64_border",P.getAttribute("border")),s(m,"b64_maxwidth",P.getAttribute("maxwidth")),s(m,"b64_maxheight",P.getAttribute("maxheight")),s(m,"b64_filter",P.getAttribute("filter"));let L=P.getAttribute("quality");if(typeof L=="string"&&L!==""){let N=Math.round(Number.parseFloat(L)*100);Number.isNaN(N)||u(m,"b64_quality",String(N))}switch(P.getAttribute("align")){case"top":case"text-top":u(m,"b64_align","top");break;case"baseline":case"bottom":case"text-bottom":u(m,"b64_align","bottom");break;case"left":u(m,"b64_align","left");break;case"right":u(m,"b64_align","right");break}}function w(m,v){let I=v.closest?.(".ck-widget")?.parentElement;if(I?.tagName!=="SPAN"||!I.getAttribute("style"))return;let k=Ui(I),M=ie=>{let Z=Number.parseInt(ie??"",10);return Number.isNaN(Z)?"":String(Z)},T=k.get("border"),[L,N]=T?T.split(/\s+/):[k.get("border-top-width"),k.get("border-top-style")];N&&N!=="none"&&s(m,"b64_border",M(L)),s(m,"b64_hmargin",M(k.get("margin-left"))),s(m,"b64_vmargin",M(k.get("margin-top"))),s(m,"b64_maxwidth",M(k.get("max-width"))),s(m,"b64_maxheight",M(k.get("max-height")));let z=k.get("filter")??"",Q=/invert/.test(z)?"invert":/grayscale/.test(z)?"grayscale":/blur/.test(z)?"blur":/drop-shadow/.test(z)?"shadow":/sepia/.test(z)?"sepia":"";s(m,"b64_filter",Q);let X=k.get("float"),oe=k.get("vertical-align");s(m,"b64_align",X==="left"||X==="right"?X:oe==="top"||oe==="bottom"?oe:"")}function y(m,v,P,I){let k=P.getAttribute("src");if(typeof k!="string"||k==="")return null;let M=P.getAttribute("data-width"),T=P.getAttribute("data-height"),L={src:k,attrs:{alt:a(m,"b64_alt").trim()},css:[]},N=!1,z=!1;for(let{k:ie,attr:Z,css:ue,minimo:de}of Vi){let ae=a(m,`b64_${ie}`),R=ae,q=ae,F=ae,K=ue;if(ie==="align"?ae==="top"||ae==="bottom"?K="vertical-align:#;":ae==="left"||ae==="right"?K="float:#;":R=null:ie==="filter"&&(sn[ae]?K=sn[ae]:R=null),de!==void 0){let J=Number.parseInt(ae,10);Number.isNaN(J)||J<de?R=null:ae.includes("%")?(q=`${J}%`,F=`${J}%`):(q=String(J),F=`${J}px`)}R!==null&&(ie==="width"&&M&&!I&&ae===v.autoW?L.attrs.width=M:ie==="height"&&T&&!I&&ae===v.autoH?L.attrs.height=T:(L.attrs[Z]=q,L.css.push(K.replace(/#/g,F)),ie==="maxwidth"&&(N=!0),ie==="maxheight"&&(z=!0)))}N&&delete L.attrs.height,z&&delete L.attrs.width;let Q=r(60),X=a(m,"b64_quality").trim(),oe=X!==""?Number.parseInt(X,10)*.01:Q*.01;return Number.isNaN(oe)&&(oe=Q*.01),oe=Math.round(Math.min(1,Math.max(0,oe))*100)/100,Q>0&&(L.attrs.quality=String(oe)),L}function S(m,v){let P=m.attrs.width,I=P?`width:${/%$/.test(P)?P:`${Number.parseInt(P,10)}px`};`:"",k=an(m.src,{alt:m.attrs.alt??""},I),M=m.css.filter(T=>!/^(width|height):/.test(T)&&!/^(border|margin)[^:]*:0(px|%)?[ ;]/.test(T)).map(T=>T.replace(/object-fit:\s*contain;?/g,"")).filter(T=>T);return!v||!M.length?{html:k,estilos:M}:(M.some(T=>/^(margin|border)/.test(T))&&M.unshift("display:inline-block;"),{html:`<span style="${ne(M.join(""))}">${k}</span>`,estilos:M})}function D(m,v){return new Promise(P=>{if(!/^data:image\/(png|jpe?g|webp|bmp)/i.test(m)||!(v>0&&v<1))return P(m);let I=i();I.onload=()=>{try{let k=e.doc.createElement("canvas");k.width=I.naturalWidth,k.height=I.naturalHeight;let M=k.getContext("2d");if(!M)return P(m);M.fillStyle="#fff",M.fillRect(0,0,k.width,k.height),M.drawImage(I,0,0);let T=k.toDataURL("image/jpeg",v);P(T.length<m.length?T:m)}catch{P(m)}},I.onerror=()=>P(m),I.onabort=()=>P(m),I.src=m})}function H(m,v){try{let P=v.closest?.(".ck-widget"),I=P?m.editing.view.domConverter.mapDomToView(P):null;return I?m.editing.mapper.toModelElement(I):null}catch{return null}}function O(m,v,P){try{let I=H(m,v);if(!I||!/^image/.test(I.name))return!1;let k=I.name==="imageBlock"?"$root":"$block",M=m.data.toModel(m.data.processor.toView(P),k),T=null,L=z=>{if(!(T||!z.is?.("element"))){if(/^image/.test(z.name)){T=z;return}for(let Q of z.getChildren())L(Q)}};for(let z of M.getChildren())L(z);let N=T;return N?(m.model.change(z=>{if(N.name!==I.name){m.model.insertContent(M,m.model.createRangeOn(I));return}let Q=new Set;for(let[X]of N.getAttributes())Q.add(X);for(let X of Array.from(I.getAttributeKeys()))Q.has(X)||z.removeAttribute(X,I);for(let[X,oe]of N.getAttributes())z.setAttribute(X,oe,I)}),!0):!1}catch(I){return console.warn("[SEIPro] Formatar imagem (SEI 5):",I instanceof Error?I.message:I),!1}}async function $(m,v,P){let I=m,M=(P?H(I,P):null)?.name==="imageBlock",L=!P||P.getAttribute("src")!==v.src?Number.parseFloat(v.attrs.quality??""):Number.NaN;v.src=await D(v.src,L);let N=S(v,!M);if(P&&O(I,P,N.html)){M&&N.estilos.length&&n(Fi);return}o.withEdit(m,()=>o.insertHtml(m,N.html))}function B(m,v,P){o.withEdit(m,()=>{if(P&&typeof P.setAttribute=="function"){P.setAttribute("src",v.src);for(let[k,M]of Object.entries(v.attrs))M!==""&&P.setAttribute(k,M);v.css.length&&P.setAttribute("style",v.css.join(""))}else o.insertElement(m,an(v.src,v.attrs,v.css.join("")))});let I=r(0);I>0&&typeof t.qualityImages=="function"&&setTimeout(()=>{try{for(let k of o.findInBody(m,"img")){if(k.getAttribute("data-cke-quality-applied"))continue;let M=k.getAttribute("quality");t.qualityImages?.(k,k,M?Number.parseFloat(M):I*.01),k.setAttribute("data-cke-quality-applied","1")}}catch{}},0)}async function G(m,v,P){o.versao===5&&"model"in m?await $(m,v,P):B(m,v,P)}async function V(m,v,P,I){if(o.somenteLeitura(P))return o.recusarEscrita(),!1;let k=[...m.querySelectorAll("#b64_preview img.previewImage")];if(!k.length){let T=a(m,"b64_url").trim();if(!T)return n(Hi),!1;if(!ve(T)&&!/^data:image\//i.test(T))return n(zi),!1;let L=e.doc.createElement("img");L.setAttribute("src",T);let N=y(m,v,L,I);return N&&await G(P,N,I),!0}let M=!1;for(let T of k){if(ve(T.getAttribute("src")??""))continue;let L=y(m,v,T,I);L&&(await G(P,L,I),M=!0)}return M?!0:(n(Bi),!1)}let W=(m,v={})=>f("input",{type:"text",id:m,autocomplete:"off",...v}),_=(m,v)=>f("select",{id:m},...v.map(([P,I])=>f("option",{value:P},I)));function C(m,v){let I=m!==null&&typeof m=="object"&&("model"in m||"insertElement"in m||"getSelection"in m)?m:o.getInstance(m??null);if(!I)return;let k=typeof e.win.FileReader<"u",T=(v&&v.nodeType===1?v:null)??A(I),L={imgScal:1,lock:!0,autoW:"",autoH:"",ultimaUrl:""},N=W("b64_url",{spellcheck:"false",placeholder:"https://\u2026"}),z=k?ge({id:"b64_urlcheckbox"},"URL da Imagem:"):null,Q=[],X=null,oe=null;if(k){oe=f("input",{type:"file",id:"b64_file",accept:"image/*",multiple:!0,style:"display:none;"});let U=oe;X=f("div",{id:"b64_dropzone",class:"spro-zona dropFilePro",role:"button",tabindex:"0",...rn(ee=>{ee.target?.getAttribute?.("id")!=="b64_file"&&typeof U.click=="function"&&U.click()})},f("span",{},"Arraste arquivos para c\xE1 ou clique para selecionar"),oe),Q.push(j(null,{},ge({id:"b64_filecheckbox",checked:"checked"},"Navegar neste computador:"),X)),Q.push(j(null,{para:"b64_url"},z,N))}else Q.push(j("URL da Imagem:",{para:"b64_url"},N));let ie=re(...Q,f("div",{id:"b64_loading",class:"spro-dica",role:"status","aria-live":"polite"}),f("div",{id:"b64_preview",class:"spro-previa lista dropFilePro","data-vazio":"Nenhuma imagem selecionada"}));ie.id="b64TabSource";let Z=W("b64_width"),ue=W("b64_height"),de=f("input",{type:"number",id:"b64_quality",min:"1",max:"100",value:String(rt(t.qualidadeImagens))}),ae=re(j("Texto Alternativo",{para:"b64_alt",largo:!0},W("b64_alt")),le("tres",j("Largura",{para:"b64_width"},Z),j("Altura",{para:"b64_height"},ue),j(null,{},ge({id:"b64_lock",checked:"checked"},"Travar Propor\xE7\xF5es"))),le("tres",j("Margem Vertical",{para:"b64_vmargin"},W("b64_vmargin",{value:"0"})),j("Margem Horizontal",{para:"b64_hmargin"},W("b64_hmargin",{value:"0"})),j("Borda",{para:"b64_border"},W("b64_border",{value:"0"}))),le("tres",j("Largura M\xE1xima",{para:"b64_maxwidth"},W("b64_maxwidth",{value:"0"})),j("Altura M\xE1xima",{para:"b64_maxheight"},W("b64_maxheight",{value:"0"})),j("Alinhamento",{para:"b64_align"},_("b64_align",Gi))),le("tres",j("Qualidade da Imagem (1 = baixa / 100 = alta)",{para:"b64_quality"},de),j("Filtro",{para:"b64_filter"},_("b64_filter",Wi)),j(null,{},f("div",{id:"b64_imglength",class:"spro-dica"}))));ae.id="b64TabProps";let R=we("b64",[["source","Imagem"],["props","Propriedades"]],{source:ie,props:ae}),q=f("button",{type:"button",class:"spro-botao primario"},T?"Aplicar":"Inserir"),F=f("div",{id:"dialogUploadImgBase64Pro",class:"spro-form seipro-b64-dialog"},f("div",{id:"b64Tabs"},R.barra,f("div",{},...R.paineis)),f("div",{class:"spro-dialogo-rodape"},q));X&&oe&&(X.addEventListener("dragover",U=>{U.preventDefault(),U.stopPropagation()}),X.addEventListener("drop",U=>{U.preventDefault(),U.stopPropagation(),h(F,L,U.dataTransfer?.files)}),oe.addEventListener("change",()=>h(F,L,oe?.files)));let K=()=>{let U=N.value.trim();if(z){let ee=z.querySelector("input");ee&&(typeof ee.checked=="boolean"?ee.checked=!!U:U?ee.setAttribute("checked","checked"):ee.removeAttribute("checked"))}!U||U===L.ultimaUrl||(L.ultimaUrl=U,d(F,L,U))};N.addEventListener("change",K),N.addEventListener("blur",K),c(F,"b64_lock")?.addEventListener("change",()=>{L.lock=Ki(c(F,"b64_lock")),L.lock&&p(F,L,"width")});for(let U of["input","keyup"]){Z.addEventListener(U,()=>L.lock&&p(F,L,"width")),ue.addEventListener(U,()=>L.lock&&p(F,L,"height"));for(let ee of["b64_vmargin","b64_hmargin","b64_border","b64_maxwidth","b64_maxheight"])c(F,ee)?.addEventListener(U,()=>b(F,ee))}T&&(E(F,L,T),o.versao===5&&w(F,T)),q.addEventListener("click",()=>{q.hasAttribute("disabled")||(q.setAttribute("disabled",""),V(F,L,I,T).then(U=>{U&&J.fechar()}).catch(U=>n(`N\xE3o foi poss\xEDvel inserir a imagem: ${U instanceof Error?U.message:String(U)}`)).finally(()=>q.removeAttribute("disabled")))});let J=te(e.doc,{titulo:"Imagem",largura:760,conteudo:F});R.selecionar(T?"props":"source")}return{initDialogUploadImgBase64:()=>{},getDialogUploadImgBase64:()=>{},openDialogUploadImgBase64:C}}};function Ie(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelElement(t):null}function Je(e,o){let t=o?.root?.rootName;return!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[t]?.somenteLeitura}var Ji='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V8h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H8V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/><circle cx="10.5" cy="6.8" r="1.3"/><path d="M16.4 9.6l1.99 2a.75.75 0 0 1 0 1.06l-5.3 5.3a.75.75 0 0 1-.4.2l-2.4.4a.5.5 0 0 1-.57-.57l.4-2.4a.75.75 0 0 1 .2-.4l5.3-5.3a.75.75 0 0 1 1.06 0zm-.53 1.6l-4.6 4.6-.2 1.13 1.13-.2 4.6-4.6-.93-.93z"/></svg>',Xi='<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2.5 3h11A1.5 1.5 0 0 1 15 4.5V9h-1.5V4.5h-11v8.2l3.1-3.1a.75.75 0 0 1 1.06 0l2 2-1.06 1.06L6.13 11.2 2.5 14.83v.67H9V17H2.5A1.5 1.5 0 0 1 1 15.5v-11A1.5 1.5 0 0 1 2.5 3z"/><circle cx="10.5" cy="6.8" r="1.3"/><path d="M11 11h8v1.5h-8zM11 14h8v1.5h-8zM11 17h8v1.5h-8z"/><path d="M13 10h1.5v3.5H13zM16.5 13h1.5v3.5h-1.5zM13.5 16h1.5v3.5h-1.5z"/></svg>',Zi=".ck-widget_selected img, .image_selected img, img.ck-widget_selected";function cn(e){let o=e.adaptador,t=e.win,n=h=>Y(e.doc,h),r=[{nome:"seiProFormatarImagem",label:"Formatar imagem (SEI Pro)",rotuloMenu:"Formatar Imagem",icone:Xi,executar:(h,A)=>{typeof t.openDialogUploadImgBase64=="function"&&t.openDialogUploadImgBase64(h,A)}},{nome:"seiProEditarImagem",label:"Editar imagem (SEI Pro)",rotuloMenu:"Editar Imagem",icone:Ji,executar:(h,A)=>a(null,A)}];function i(h){let A=o.getSelectionElement(h);if(A){if(A.tagName?.toLowerCase()==="img")return A;let E=A.querySelector?.("img");if(E)return E;let y=A.closest?.("figure, .image, .image-inline, .ck-widget")?.querySelector("img");if(y)return y}try{let E=o.findInBody(h,Zi);if(E.length)return E[0]}catch{}try{let E=o.findInBody(h,"img");if(E.length===1)return E[0]}catch{}return null}function l(h,A,E){try{let w=A.closest(".ck-widget"),y=w?Ie(h,w):null;if(y?.hasAttribute("src"))return h.model.change(S=>S.setAttribute("src",E,y)),!0}catch{}return!1}function c(h,A,E,w){if(!A||!w)return;if(o.versao!==5){o.withEdit(h,()=>A.setAttribute("src",w));return}let y=!1;if(o.withEdit(h,()=>{y=l(h,A,w)}),y)return;let S=!1;try{o.transformBodyHtml(h,D=>{if(typeof D!="string"||!E)return D;let H=D.indexOf(E);return H===-1?D:(S=!0,D.slice(0,H)+w+D.slice(H+E.length))})}catch{}if(!S){try{A.setAttribute("src",w)}catch{}n("A imagem foi editada, mas a grava\xE7\xE3o no SEI 5 pode n\xE3o persistir. Verifique antes de salvar.")}}function a(h,A){if(!e.checkOpcao("editarimagens"))return;let E=h,w=E&&typeof E=="object"&&E.nodeType===void 0?E:o.getInstance(E??null);if(!w)return;let y=A||i(w),S=y?.getAttribute("src");if(!y||typeof S!="string"){n("Selecione uma imagem para editar.");return}if(o.somenteLeitura(w)){o.recusarEscrita();return}let D=Math.max(320,Math.min((t.innerWidth||905)-5,900)),H=Math.max(320,Math.min((t.innerHeight||700)-170,900)),O=!1,$=null,B=()=>$?.fechar(),G=C=>{C&&(o.somenteLeitura(w)?o.recusarEscrita():c(w,y,S,C)),B()},V=f("div",{id:"ImageEditorPro",style:`width:100%;height:${H}px;`}),W=f("button",{type:"button",id:"ImageEditorProAplicar",class:"spro-botao primario",onclick:()=>{let C=t.imgEditor;if(!C||typeof C.getCurrentImgData!="function")return B();G(C.getCurrentImgData()?.imageData?.imageBase64)}},"Aplicar");$=te(e.doc,{titulo:"Editar Imagem",conteudo:f("div",{style:`width:min(${D}px,calc(100vw - 80px));`},V,f("div",{class:"spro-barra fim"},W)),aoFechar:()=>{O=!0;try{t.imgEditor?.terminate?.()}catch{}t.imgEditor=null}});let _=()=>{if(O)return;let C=t.FilerobotImageEditor;if(typeof C>"u"){B(),n("N\xE3o foi poss\xEDvel carregar o editor de imagem.");return}let{TABS:m,TOOLS:v}=C,P=new C(V,{source:S,onSave:I=>G(I?.imageBase64),annotationsCommon:{fill:"#ff0000"},Text:{text:`${t.NAMESPACE_SPRO??""}...`},translations:{"toolbar.adjust":"Ajustes"},language:"pt",tabsIds:[m.ADJUST,m.ANNOTATE,m.FINETUNE,m.FILTERS,m.RESIZE,m.WATERMARK],defaultTabId:m.ADJUST,defaultToolId:v.TEXT,loadableDesignState:!1,observePluginContainerSize:!0});P.render({onClose:()=>{try{P.terminate?.()}catch{}B()}}),t.imgEditor=P,setTimeout(()=>{V.style.height=`${H}px`},500)};typeof t.checkLoadFileRobot=="function"?t.checkLoadFileRobot(_):_()}function u(h,A){try{let E=A.closest(".ck-widget"),w=E?Ie(h,E):null;w&&h.model.change(y=>y.setSelection(w,"on"))}catch{}}function s(h){let A=h.model.document.selection.getSelectedElement();if(!A?.is("element")||!/^image/.test(A.name))return null;let E=h.editing.mapper.toViewElement(A),w=E?h.editing.view.domConverter.mapViewToDom(E):null;return w?w.tagName==="IMG"?w:w.querySelector("img"):null}function g(h){if(!h?.ui||!h.plugins?.has("WidgetToolbarRepository"))return!1;let E=h.plugins.get("WidgetToolbarRepository")._toolbarDefinitions?.get("image");if(!E)return!1;let w=h.ui.componentFactory,y=r[0];if(!y||w.has(y.nome))return!0;let S=null;try{S=w.create("imageTextAlternative").constructor}catch{}if(!S)return!1;for(let H of r)w.add(H.nome,O=>{let $=new S(O);return $.set({label:H.label,icon:H.icone,tooltip:!0,withText:!1}),$.bind("isEnabled").to(h,"isReadOnly",B=>!B),$.on("execute",()=>H.executar(h,s(h))),$});let D=r.map(H=>H.nome);if(Array.isArray(E.itemsConfig)&&!E.itemsConfig.includes(D[0])&&E.itemsConfig.push("|",...D),E.initialized&&E.view?.items){let H=null;for(let O of E.view.items)if(O.element?.classList.contains("ck-toolbar__separator")){H=O;break}if(H)try{E.view.items.add(new H.constructor(h.locale))}catch{}for(let O of D)E.view.items.add(w.create(O))}return!0}function x(h){h?.model&&o.addContextMenu(h,A=>{let E=A&&(A.nodeType===1?A:A.parentElement),w=E?.closest?.(".ck-widget"),y=E?.tagName==="IMG"?E:w?.querySelector("img")??null;return!y||h.isReadOnly?[]:r.map(S=>({label:S.rotuloMenu,action:()=>{u(h,y),S.executar(h,y)}}))})}function p(){}function b(){return{imgEditor:null,openImageEditorPro:a,initDialogImageEditorPro:()=>{e.checkOpcao("editarimagens")&&void 0},getDialogImageEditorPro:p,menuImagemCK5Pro:x}}function d(){o.waitReady(3e4).then(h=>{o.versao!==5||!e.checkOpcao("editarimagens")||g(h)}).catch(()=>{})}return{globais:b,iniciar:d}}var dn={id:"image-editor",globais:e=>cn(e).globais(),iniciar:e=>cn(e).iniciar()};var un="Nenhum documento encontrado! Confira se o documento est\xE1 acess\xEDvel por qualquer pessoa na internet e tente novamente.",Yi="https://docs.google.com/feeds/download/documents/export/Export?id=",es="https://docs.google.com/spreadsheets/d/e/";function mn(e){for(let o of[...e.childNodes])o.nodeType===8?o.parentNode?.removeChild(o):mn(o)}function pn(e){for(;e.firstChild;)e.parentNode?.insertBefore(e.firstChild,e);e.parentNode?.removeChild(e)}function os(e,o){let t=o(`<!doctype html><html><body>${e}</body></html>`),n=t.body;for(let r of n.querySelectorAll("link, script, style, meta"))r.parentNode?.removeChild(r);for(let r of n.querySelectorAll("o\\:p"))r.parentNode?.removeChild(r);for(let r of n.querySelectorAll("a.msocomanchor"))r.parentNode?.removeChild(r);for(let r of n.querySelectorAll('div[style="mso-element:comment-list"]'))r.parentNode?.removeChild(r);mn(n);for(let r of n.querySelectorAll("p.MsoNormal")){let i=r.getAttribute("align")==="center"?"Texto_Centralizado":"Texto_Justificado_Recuo_Primeira_Linha";r.classList.remove("MsoNormal"),r.removeAttribute("align"),r.removeAttribute("style"),r.classList.add(i);for(let c of[...r.querySelectorAll("span")])pn(c);let l=(c,a,u)=>{if((c.textContent??"").replace(/\u00a0/g," ").trim()!==""||c.querySelector("*")){let s=t.createElement("span");s.setAttribute("style",a);let g=t.createElement(u);for(;c.firstChild;)g.append(c.firstChild);s.append(g),c.parentNode?.insertBefore(s,c),c.parentNode?.insertBefore(t.createTextNode(" "),c)}c.parentNode?.removeChild(c)};for(let c of[...r.querySelectorAll("del")])l(c,"color:#FF0000;","s");for(let c of[...r.querySelectorAll("ins")])l(c,"color:#0000FF;","u")}for(let r of[...n.querySelectorAll(".WordSection1")])pn(r);return n.innerHTML}function ts(e,o){let t=o(e),n=t.body??t.documentElement;for(let r of n.querySelectorAll("link, script, style, meta, title"))r.parentNode?.removeChild(r);for(let r of n.querySelectorAll("a[href]")){let i=r.getAttribute("href")??"";if(i.includes("https://www.google.com/url?q="))try{let l=new URL(i).searchParams.get("q");l&&(i=l)}catch{}r.setAttribute("href",i),r.setAttribute("target","_blank"),r.setAttribute("rel","noreferrer")}return n.innerHTML}var gn={id:"importar-doc",globais(e){let o=e.adaptador,t=e.win,n=E=>Y(e.doc,E),r=E=>new e.win.DOMParser().parseFromString(E,"text/html"),i=E=>(e.fetch??e.win.fetch.bind(e.win))(E),l=null;function c(){return t.mammoth?Promise.resolve():(l??=new Promise(E=>{let w=e.doc.createElement("script");w.src=`${e.base}js/lib/mammoth.browser.min.js`,w.onload=()=>E(),w.onerror=()=>E(),e.doc.head.append(w)}),l)}async function a(){return ho(e.doc),rr(bo())("Substituir todo o conte\xFAdo atual do documento pelo conte\xFAdo importado?","Substituir","Voltar")}function u(E,w,y){let S=y??o.getInstance();S&&(o.withEdit(S,()=>{if(w.substituir)o.setData(S,E);else{let D=o.getSelectionParagraph(S);D?o.insertHtmlBefore(S,D,E):o.insertHtml(S,E)}}),setTimeout(()=>{s(S),t.enableButtonSavePro?.()},0))}function s(E){let w=E,y=w&&(w.model||w.name)?w:o.getInstance();y&&o.transformBodyHtml(y,S=>os(S,r))}async function g(E,w){let y=await E.arrayBuffer();return new TextDecoder(w?"windows-1252":"utf-8").decode(y)}async function x(E){return await c(),t.mammoth?(await t.mammoth.convertToHtml({arrayBuffer:await E.arrayBuffer()})).value:(n("Conversor de Word n\xE3o carregado. Tente novamente em instantes."),null)}async function p(E,w,y){let S=E.name.split(".").pop()?.toLowerCase()??"";if(S!=="docx"&&S!=="html"&&S!=="htm")return n("Formato n\xE3o suportado. Use um arquivo .docx ou .html"),!1;if(w.substituir&&!await a())return!1;try{let D=S==="docx"?await x(E):await g(E,w.windows1252);return D===null?!1:(u(D,w,y),w.trocarCampos&&setTimeout(()=>t.replaceDadosEditor?.(null),500),!0)}catch{return n("N\xE3o foi poss\xEDvel ler o arquivo. Confira se ele n\xE3o est\xE1 corrompido."),!1}}async function b(E,w,y,S){let D=S??o.getInstance();if(o.versao===4&&typeof t.loadGoogleDocs=="function"&&t.iframeEditor)return t.loadGoogleDocs(E,t.iframeEditor,w),!0;if(!D)return n("Editor n\xE3o encontrado."),!1;if(y&&!await a())return!1;try{let H=await i(E),O=H.ok?await H.text():"";return O?(u(ts(O,r),{substituir:y},D),!0):(n(un),!1)}catch{return n(un),!1}}function d(E,w,y){let S=/\/d\/(.*?)(\/|$)/.exec(E);return S?b(`${Yi}${S[1]}&exportFormat=html`,"docs",w,y):(n("Endere\xE7o do documento inv\xE1lido!"),Promise.resolve(!1))}function h(E,w,y){let S=/\/e\/(.*?)(\/|$)/.exec(E);return S?b(`${es}${S[1]}/pubhtml`,"sheets",w,y):(n("Endere\xE7o da planilha inv\xE1lido!"),Promise.resolve(!1))}function A(E){try{t.setParamEditor?.(E)}catch{}let w=o.getInstance(E);if(!w)return;c();let y=f("input",{type:"file",id:"fileInputImportHTMLDocx",accept:".docx,.html,.htm"}),S=(m,v,P)=>ge({id:m,...P?{checked:"checked"}:{}},v),D=re(j("Arquivo do computador",{para:"fileInputImportHTMLDocx",dica:"Aceita Word (.docx) e HTML (.html)."},y),j("Op\xE7\xF5es",{},S("replaceText","Substituir todo o documento pelo conte\xFAdo externo",!0),S("replaceTags","Substituir campos din\xE2micos no documento (se dispon\xEDvel)",!0),S("importWord","Corrigir erros de codifica\xE7\xE3o de documentos Word (acentos quebrados em .html)",!1))),H=f("input",{type:"text",id:"urlGDocs",placeholder:"https://docs.google.com/document/d/\u2026",autocomplete:"off",spellcheck:"false"}),O=re(j("Endere\xE7o do Google Docs",{para:"urlGDocs"},H),S("replaceTextDocs","Substituir todo o documento pelo conte\xFAdo externo",!0),f("div",{class:"spro-aviso-inline"},f("span",{},"Antes de importar, confira se o documento est\xE1 acess\xEDvel por qualquer pessoa na internet. ",f("a",{class:"spro-link",href:"https://seipro.app/pages/INSERIRDOC.html",target:"_blank",rel:"noopener noreferrer"},"Veja a ajuda"),"."))),$=f("input",{type:"text",id:"urlGSheets",placeholder:"https://docs.google.com/spreadsheets/d/e/\u2026",autocomplete:"off",spellcheck:"false"}),B=re(j("Endere\xE7o do Google Planilhas (Publicar na Web)",{para:"urlGSheets"},$),S("replaceTextSheets","Substituir todo o documento pelo conte\xFAdo externo",!0),f("div",{class:"spro-aviso-inline"},f("span",{},"Antes de importar, confira se a planilha est\xE1 publicada na web. O endere\xE7o publicado \xE9 diferente do endere\xE7o da planilha. ",f("a",{class:"spro-link",href:"https://seipro.app/pages/INSERIRPLANILHA.html",target:"_blank",rel:"noopener noreferrer"},"Veja a ajuda"),"."))),G="arquivo",V=we("imp",[["arquivo","Word ou HTML"],["docs","Google Docs"],["sheets","Google Planilhas"]],{arquivo:D,docs:O,sheets:B},m=>{G=m}),W=m=>fn(e.doc.querySelector(`#${m}`)),_=f("button",{type:"button",class:"spro-botao primario"},"Inserir");_.addEventListener("click",()=>{(async()=>{let m=!1;if(G==="arquivo"){let v=y.files?.[0];if(!v)return void n("Escolha um arquivo .docx ou .html.");m=await p(v,{substituir:W("replaceText"),trocarCampos:W("replaceTags"),windows1252:W("importWord")},w)}else if(G==="docs"){let v=H.value.trim();if(!v)return void n("Informe o endere\xE7o do Google Docs.");m=await d(v,W("replaceTextDocs"),w)}else{let v=$.value.trim();if(!v)return void n("Informe o endere\xE7o da planilha publicada.");m=await h(v,W("replaceTextSheets"),w)}m&&C.fechar()})()});let C=te(e.doc,{titulo:"Inserir conte\xFAdo externo",largura:640,conteudo:f("div",{class:"spro-form"},V.barra,f("div",{},...V.paineis),f("div",{class:"spro-dialogo-rodape"},_))});V.selecionar("arquivo"),y.focus({preventScroll:!0})}return{importDocPro:A,getGoogleDocs:(E,w,y)=>d(E,_e(e.doc,"replaceTextDocs"),y),getGoogleSheets:(E,w,y)=>h(E,_e(e.doc,"replaceTextSheets"),y),importGoogleByUrl:(E,w,y)=>b(E,w,_e(e.doc,w==="sheets"?"replaceTextSheets":"replaceTextDocs"),y),handleFileImport:(E,w,y)=>E[0]?p(E[0],{substituir:_e(e.doc,"replaceText"),trocarCampos:_e(e.doc,"replaceTags"),windows1252:_e(e.doc,"importWord")},y):Promise.resolve(!1),converterDocxParaHtml:(E,w,y)=>E[0]?p(E[0],{substituir:_e(e.doc,"replaceText"),trocarCampos:!1,windows1252:!1},y):Promise.resolve(!1),loadFileImportHTML:(E,w,y)=>E[0]?p(E[0],{substituir:_e(e.doc,"replaceText"),trocarCampos:_e(e.doc,"replaceTags"),windows1252:_e(e.doc,"importWord")},y):Promise.resolve(!1),loadFileImportEditor:(E,w,y)=>u(E,{substituir:_e(e.doc,"replaceText")},y),wordToSEI:s}}};function fn(e){return e?typeof e.checked=="boolean"?e.checked:e.hasAttribute("checked"):!1}function _e(e,o){let t=e.querySelector(`#${o}`);return t?fn(t):o.startsWith("replaceText")}var rs="https://latex.codecogs.com/png.latex?",ns="https://pt.wikipedia.org/wiki/Ajuda:Guia_de_edi%C3%A7%C3%A3o/F%C3%B3rmulas_TeX",as="https://editor.codecogs.com/",bn={id:"latex",globais(e){let o=null,t=e.imagemParaDataUri??(a=>yo(e.win,a)),n=a=>Y(e.doc,a);function r(){let a=o;if(!a)return;let u=a.texto.value;a.geracao+=1;let s=a.geracao;if(a.previa.replaceChildren(),a.pronta=!1,a.falhou=!1,u==="")return;let g=f("img",{src:`${rs}${encodeURI(u)}`});a.previa.append(g),t(g.getAttribute("src")??"").then(x=>{o!==a||a.geracao!==s||(g.setAttribute("src",x),g.className="img-base64",a.pronta=!0)},()=>{o===a&&a.geracao===s&&(a.falhou=!0)})}function i(){let a=o;if(!a)return!1;let u=a.texto.value;if(u==="")return n("Digite a equa\xE7\xE3o"),!1;if(a.falhou)return n("N\xE3o foi poss\xEDvel carregar a imagem da equa\xE7\xE3o"),!1;let s=a.previa.querySelector("img");if(!a.pronta||!s)return n("Aguarde a equa\xE7\xE3o carregar e tente de novo"),!1;let g=a.ed,x=`<img class="img-base64" src="${ne(s.getAttribute("src")??"")}" alt="${ne(u)}">`;return e.adaptador.withEdit(g,()=>e.adaptador.insertHtml(g,x)),!0}function l(a){let u=e.adaptador.getInstance(a);if(!u)return;let s=f("textarea",{id:"MathText",rows:"4",placeholder:"\\frac{a}{b} + \\sqrt{x^2}",spellcheck:"false"});s.addEventListener("input",r);let g=qe({id:"latexPreview"},{vazio:"A equa\xE7\xE3o aparece aqui"});g.classList.add("papel");let x=te(e.doc,{titulo:"Inserir Equa\xE7\xE3o",aoFechar:()=>{o=null},conteudo:Be(Ce("Equa\xE7\xE3o em LaTeX",s),g,ce("Consulte o ",f("a",{href:ns,target:"_blank",rel:"noopener noreferrer"},"Guia de edi\xE7\xE3o/F\xF3rmulas TeX")," para utilizar a linguagem LaTeX. Se preferir, utilize um ",f("a",{href:as,target:"_blank",rel:"noopener noreferrer"},"editor visual de equa\xE7\xF5es LaTeX"),"."),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{i()&&x.fechar()}},"Inserir")))});o={ed:u,texto:s,previa:g,geracao:0,pronta:!1,falhou:!1};let p=String(e.win.getSelection?.()??"").trim();p!==""&&(s.value=p,r())}function c(){}return{updatePreviewLatex:r,openDialogLatex:l,getDialogLatex:c}}};var lo="https://legis.seipro.app/v1",is=50,ss={lei:"Lei","lei.complementar":"LC",decreto:"Dec","decreto.lei":"DecLei","medida.provisoria":"Mp","emenda.constitucional":"Ec","decreto.legislativo":"DecLeg",resolucao:"Res"};function ls(e){let o=String(e??""),t=o.split(","),n=/(\d{4})\s*$/.exec(o);return t.length>1&&n?`${(t[0]??"").trim()}, de ${n[1]}`:o}function cs(e){let o=String(e??"").replace(/\s+/g," ").trim();for(;/\s*\([^()]*\)$/.test(o);)o=o.replace(/\s*\([^()]*\)$/,"").trim();return!o||o===o.toUpperCase()?"":o}var ds=e=>ve(e)?e:"";function hn(e){return{sigla:e.tipo==="constituicao"?"Cf":(ss[e.tipo??""]??String(e.tipo??"").replace(/[^A-Za-z]/g,""))+String(e.numero??"").replace(/[^0-9-]/g,""),titulo:e.titulo||e.titulo_curto||"",curto:e.titulo_curto||ls(e.titulo),apelido:cs(e.apelido),url:ds(e.url||(e.urn?`https://normas.leg.br/?urn=${e.urn}`:"")),ementa:e.ementa||"",revogada:e.situacao==="revogada"}}function vn(e,o){let t=ne,n=o?t(e.curto||e.titulo):t(e.titulo)+(e.apelido?`&nbsp;(${t(e.apelido)})`:""),r=e.url?` href="${t(e.url)}" target="_blank"`:"";return`<a class="ancoraSei legisSeiPro" data-norma="${t(e.sigla)}" data-normafull="${t(e.titulo)}" data-index="0"${r}>${n}</a>`}async function nt(e,o,t){let n=new URLSearchParams({per_page:String(is)});for(let[c,a]of Object.entries(t))a!==""&&a!==null&&a!==void 0&&n.set(c,String(a));let r=await e(`${o}/normas?${n}`);if(!r.ok)throw new Error(`HTTP ${r.status}`);let i=await r.json(),l=(i?.itens??[]).map(hn);return{total:i?.total??l.length,normas:l}}async function at(e,o,t,n=!1){let r=[];for(let l of t){let c=String(l??"").trim().slice(0,60);c&&!r.includes(c)&&r.push(c)}let i={};if(!r.length)return i;try{let l=await e(`${o}/normas/resolver`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refs:r.slice(0,200)})});if(!l.ok){if(n)throw new Error(`HTTP ${l.status}`);return i}let c=await l.json();for(let[a,u]of Object.entries(c?.resultados??{}))u&&(i[a]=hn(u))}catch(l){if(n)throw l}return i}var it=e=>({ano:"exato",ate:"ate",apos:"apos"})[e]??"exato";function st(e){let o=String(e??"").split(/[/-]/)[0]?.replace(/[^0-9]+/g,"");return o?Number.parseInt(o,10):""}function xn(e){let o=String(e??"").toLowerCase();return/emenda constitucional|\bec\b/.test(o)?"emenda.constitucional":/decreto legislativo/.test(o)?"decreto.legislativo":/lei complementar|\blc\b/.test(o)?"lei.complementar":/decreto-lei|decreto lei|\bdl\b/.test(o)?"decreto.lei":/medida provis[o\u00f3]ria|\bmp\b/.test(o)?"medida.provisoria":/decreto|\bdec\b/.test(o)?"decreto":/\blei\b/.test(o)?"lei":""}var us=[["",""],["Lei","lei"],["Lei Complementar","lei.complementar"],["Decreto","decreto"],["Decreto-Lei","decreto.lei"],["Medida Provis\xF3ria","medida.provisoria"],["Emenda Constitucional","emenda.constitucional"],["Decreto Legislativo","decreto.legislativo"]],ps=[["",""],["No ano","ano"],["At\xE9 o ano de...","ate"],["Ap\xF3s o ano de...","apos"]],ms=[["",""],["ANTAQ","Antaq"],["Cade","Cade"],["PRF","PRF"],["TSE","Tse"],["TRE RR","Trerr"],["TJ RR","TJRR"],["CNJ","CNJ"]],gs=[["",""],["Acordo/Plano/Ato/Nota","acord"],["Ata e Certid\xF5es de Julgamento","atas"],["Constitui\xE7\xE3o Estadual","ce"],["Decreto Estadual","decest"],["Edital","Edit"],["Enunciado Administrativo","enumadm"],["Emenda Constitucional","ec"],["Emenda Regimental","er"],["Emendas","Emenda"],["Instru\xE7\xE3o Normativa","in"],["Instru\xE7\xE3o Normativa Conjunta","resconj"],["Lei Complementar Estadual","lce"],["Lei Estadual","leiest"],["Lei Municipal","leimun"],["Nota T\xE9cnica","nt"],["Orienta\xE7\xE3o Normativa","on"],["Portaria","port"],["Portaria Conjunta","portconj"],["Portaria Interministerial","portinter"],["Portaria Interinstitucional","portinst"],["Provimento","prov"],["Recomenda\xE7\xE3o","Rec"],["Regimento Interno","regim"],["Resolu\xE7\xE3o Normativa","rn"],["Resolu\xE7\xE3o","res"],["Resolu\xE7\xE3o Conjunta","resconj"],["S\xFAmula Administrativa","sum"]],fs=[["",""],["C\xF3digo Brasileiro de Aeron\xE1utica","Lei7565/1986"],["C\xF3digo Brasileiro de Telecomunica\xE7\xF5es","Lei4117/1962"],["C\xF3digo Civil","Lei10406/2002"],["C\xF3digo Comercial","Lei556/1850"],["C\xF3digo de Defesa do Consumidor","Lei8078/1990"],["Constitui\xE7\xE3o Federal","Cf"],["C\xF3digo Florestal","Lei12651/2012"],["Consolida\xE7\xE3o das Leis do Trabalho","DecLei5452/1943"],["C\xF3digo de \xC1guas","Dec24643/1934"],["C\xF3digo Eleitoral","Lei4737/1965"],["C\xF3digo de Minas","DecLei227/1967"],["C\xF3digo Penal","DecLei2848/1940"],["C\xF3digo de Processo Civil","Lei13105/2015"],["C\xF3digo Penal Militar","DecLei1001/1969"],["C\xF3digo de Processo Penal","DecLei3689/1941"],["C\xF3digo de Processo Penal Militar","DecLei1002/1969"],["C\xF3digo de Tr\xE2nsito Brasileiro","Lei9503/1997"],["C\xF3digo Tribut\xE1rio Nacional","Lei5172/1966"],["Estatuto da Crian\xE7a e do Adolescente","Lei8069/1990"],["Estatuto da Cidade","Lei10257/2001"],["Estatuto do Desarmamento","Lei10826/2003"],["Estatuto do Idoso","Lei10741/2003"],["Estatuto da Igualdade Racial","Lei12288/2010"],["Estatuto do \xCDndio","Lei6001/1973"],["Estatuto da Juventude","Lei12852/2013"],["Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte","LC123/2006"],["Estatuto dos Militares","Lei6880/1980"],["Estatuto dos Museus","Lei11904/2009"],["Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)","Lei8906/1994"],["Estatuto da Pessoa com Defici\xEAncia","Lei13146/2015"],["Estatuto dos Refugiados","Lei9474/1997"],["Estatuto da Terra","Lei4504/1964"],["Estatuto de Defesa do Torcedor","Lei10671/2003"]],yn="Servi\xE7o de legisla\xE7\xE3o indispon\xEDvel no momento. Tente novamente mais tarde.",En="Nenhuma legisla\xE7\xE3o encontrada";function bs(e){let o=e.replace(/(\r\n|\n|\r)/gm," ").trim();/[A-Z]/.test(o)&&o===o.toUpperCase()&&(o=o.charAt(0)+o.toLocaleLowerCase().slice(1));let t=o.length>170;return{curta:t?`${o.replace(/^(.{170}\S*)[\s\S]*/,"$1")}...`:o,completa:o,longa:t}}var kn={id:"legis",globais(e){let o=e.adaptador,t=O=>Y(e.doc,O),n=(O,$)=>(e.fetch??e.win.fetch.bind(e.win))(O,$),r=[],i=null,l=0,c=null;function a(O,$){at(n,lo,O??[]).then($)}function u(O,$){let B=$??o.getInstance();if(!B||!O)return;let G=o.findInBody(B,"a").some(W=>O.url&&W.getAttribute("href")===O.url||W.getAttribute("data-norma")===O.sigla),V=o.saveSelection(B);o.focus(B),V&&o.restoreSelection(B,V),o.withEdit(B,()=>{o.insertElement(B,vn(O,G))})}function s(O,$){let B=$??c??o.getInstance();B&&at(n,lo,[O],!0).then(G=>{let V=G[String(O??"").trim()];if(!V)return t(En);u(V,B)},()=>t(yn))}function g(O,$){let B=bs(O.ementa),G=O.url?f("a",{class:"spro-link",href:O.url,target:"_blank",rel:"noopener noreferrer"},O.titulo," \u2197"):f("span",{},O.titulo),V=f("button",{type:"button",class:"spro-botao pequeno","data-legis-idx":String($),onclick:()=>w(V)},"Adicionar"),W=C=>f("button",{type:"button",class:"spro-botao-texto",onclick:m=>y(m.currentTarget)},C),_=f("div",{class:O.revogada?"searchLegis_linha spro-resultado revogada":"searchLegis_linha spro-resultado"},f("div",{class:"spro-resultado-topo"},f("div",{class:"spro-resultado-titulo"},G,O.apelido?f("span",{class:"spro-resultado-apelido"},` (${O.apelido})`):null,O.revogada?f("span",{class:"spro-selo"},"Revogada"):null),V));return B.completa&&_.append(f("p",{class:"searchLegis_ementa spro-ementa"},`${B.curta} `,B.longa?W("mais"):null),f("p",{class:"searchLegis_ementafull spro-ementa",style:"display:none;"},`${B.completa} `,W("menos"))),_}let x=O=>f("div",{class:"spro-aviso-inline spro-resultado-aviso"},O);function p(O,$,B,G){r=$;let V=O.querySelector("#searchLegis_result");if(!V)return;let W=[];G&&W.push(x(G)),W.push(...$.map((C,m)=>g(C,m))),B>$.length?W.push(x(`Mostrando ${$.length} de ${B} resultados. Restrinja sua pesquisa.`)):$.length||W.push(x("Nenhum resultado encontrado :(")),V.replaceChildren(...W),V.style.display="";let _=O.querySelector("#searchLegis_load");_&&(_.style.display="none")}function b(O){let $=O.querySelector("#searchLegis_load");$&&($.style.display="none"),t(yn)}let d=(O,$)=>O.querySelector(`#${$}`)?.value??"",h=(O,$)=>{let B=O.querySelector("#searchLegis_load");B&&(B.style.display=$?"":"none")};function A(O){let $=O?.closest(".spro-legis")??e.doc.querySelector(".spro-legis");if(!$)return;let B=d($,"legis_anoNorma").trim();h($,!0);let G=$.querySelector("#searchLegis_result");G&&(G.style.display="none"),l+=1;let V=l;nt(n,lo,{q:d($,"legis_termoNorma").trim(),tipo:d($,"legis_tipoNorma"),numero:st(d($,"legis_numeroNorma")),ano:B,periodo:B?it(d($,"legis_periodoNorma")):""}).then(W=>V===l&&p($,W.normas,W.total),()=>V===l&&b($))}function E(O,$,B,G,V,W){h(O,!0),l+=1;let _=l;nt(n,lo,{tipo:$,numero:B,ano:G,periodo:G?it(V):""}).then(({normas:C,total:m})=>{_===l&&(h(O,!1),C.length===1&&m<=1?(i?.(),u(C[0],W)):C.length?p(O,C,m||C.length,`H\xE1 ${m||C.length} normas com esse n\xFAmero. Escolha abaixo ou informe o ano.`):t(En))},()=>_===l&&b(O))}function w(O){let $=r[Number.parseInt(O?.getAttribute("data-legis-idx")??"",10)];if(!$)return;let B=c??void 0;i?.(),u($,B)}function y(O){let $=O?.closest(".searchLegis_linha"),B=$?.querySelector(".searchLegis_ementa"),G=$?.querySelector(".searchLegis_ementafull");if(!B||!G)return;let V=B.style.display==="none";B.style.display=V?"":"none",G.style.display=V?"none":""}function S(O,$,B,G=!1){return j(O,{para:$,largo:G},f("select",{id:$},...B.map(([V,W])=>f("option",{value:W},V===""?"Selecione\u2026":V))))}function D(O,$,B="text",G=!1){return j(O,{para:$,largo:G},f("input",{type:B,id:$,autocomplete:"off"}))}function H(O){let $=O??o.getInstance();if(!$)return;r=[];let B=[["federal","Legisla\xE7\xE3o Federal"],["infra","Norma Infralegal"],["lista","Lista de Normas"]],G=f("span",{id:"searchLegis_load",class:"spro-dica",style:"display:none;"},"Pesquisando\u2026"),V={federal:f("div",{class:"spro-form"},le("duas",S("Tipo de legisla\xE7\xE3o","legis_tipoNorma",us),D("N\xFAmero","legis_numeroNorma","number"),S("Per\xEDodo da publica\xE7\xE3o","legis_periodoNorma",ps),D("Ano da publica\xE7\xE3o","legis_anoNorma","number"),D("Palavras-chave do conte\xFAdo","legis_termoNorma","text",!0)),f("div",{class:"spro-barra fim"},G,f("button",{type:"button",id:"searchLegis_uiElement",class:"spro-botao",title:"Pesquisar",onclick:k=>A(k.currentTarget)},"Pesquisar")),f("div",{id:"searchLegis_result",class:"spro-resultados",style:"display:none;"})),infra:f("div",{class:"spro-form"},le("duas",S("Autoridade signat\xE1ria","legis_orgaoInfraNorma",ms),S("Tipo de legisla\xE7\xE3o","legis_tipoInfraNorma",gs),D("N\xFAmero da norma","legis_numeroInfraNorma","number"))),lista:f("div",{class:"spro-form"},S("Nome da legisla\xE7\xE3o","legis_nomeNorma",fs))},W=we("legis",B,V),_=W.selecionar,C=f("div",{class:"spro-form spro-legis"},W.barra,f("div",{},...W.paineis),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let k=d(C,"legis_tipoNorma"),M=st(d(C,"legis_numeroNorma")),T=d(C,"legis_tipoInfraNorma"),L=d(C,"legis_numeroInfraNorma"),N=d(C,"legis_nomeNorma");if(k!==""&&M!=="")return E(C,k,M,d(C,"legis_anoNorma").trim(),d(C,"legis_periodoNorma"),$);if(T!==""&&L!==""){let z=(L.includes("/")?L.split("/")[0]??"":L).replace(/[^0-9-]+/g,"");s(d(C,"legis_orgaoInfraNorma")+T+z,$)}else if(N!=="")s(N,$);else return t("Informe o tipo e o n\xFAmero da norma, ou escolha uma norma da lista.");i?.()}},"Inserir")));c=$;let m=te(e.doc,{titulo:"Adicionar link de legisla\xE7\xE3o",largura:640,conteudo:C,aoFechar:()=>{l+=1,c=null}});i=()=>m.fechar(),_("federal"),C.querySelector("#legis_tipoNorma")?.focus({preventScroll:!0});let v=o.getSelectedText($)||"",P=xn(v),I=C.querySelector("#legis_tipoNorma");if(P&&I&&(I.value=P),/\d/.test(v)){let k=v.includes("/")?v.split("/")[0]??"":v;k=v.includes(",")?v.split(",")[0]??"":k;let M=C.querySelector("#legis_numeroNorma");M&&(M.value=/\d/.test(k)?k.replace(/\D/g,""):"");let T=/(?:\/|\bde\s+)(\d{4})\b/.exec(v),L=C.querySelector("#legis_anoNorma");T&&L&&(L.value=T[1]??"")}try{let k=e.win;e.verifyOpcao("substituiselecao")&&typeof k.setChosenInCke=="function"&&k.setChosenInCke()}catch{}}return{resolverNormasLegisPro:a,sendLegisSEI:s,insertLegisSEI:w,getLegisSEI(O){let $=o.getInstance(O);$&&H($)},getSearchLegisMore:y,getSearchLegis:A,getDialogLegisSEI:()=>{}}}};function lt(e,o){let t=e.adaptador;return t.versao===5?t.getInstance():t.getAllInstances().find(n=>t.getBodyContainer(n)?.ownerDocument===o.ownerDocument)??t.getInstance()}function ct(e,o){let t=e.editing.view.domConverter.mapDomToView(o);return t?e.editing.mapper.toModelRange(e.editing.view.createRangeOn(t)):null}function Xe(e,o,t,n){let r=e.adaptador.versao===5?!!e.win.INFRA_EDITOR_CONFIG?.rootsAttributes?.[n?.root?.rootName]?.somenteLeitura:e.adaptador.somenteLeitura(o);return r&&e.adaptador.recusarEscrita(),r}function wn(e,o){return o.isConnected?!0:(Y(e.doc,"O link n\xE3o est\xE1 mais no documento."),!1)}function An(e,o){if(!wn(e,o))return!1;let t=lt(e,o);if(!t)return!1;if(e.adaptador.versao===5){let n=t,r=ct(n,o);return r?Xe(e,t,o,r)?!1:(n.model.change(i=>i.setSelection(r)),n.execute("unlink"),!0):(Y(e.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return Xe(e,t,o,null)?!1:(e.adaptador.withEdit(t,()=>o.replaceWith(...Array.from(o.childNodes))),!0)}function Cn(e,o,t,n){if(!wn(e,o))return!1;let r=lt(e,o);if(!r)return!1;if(e.adaptador.versao===5){let i=r,l=ct(i,o);return l?Xe(e,r,o,l)?!1:(i.model.change(c=>{c.setSelection(l),i.model.insertContent(c.createText(t,{linkHref:n}))}),!0):(Y(e.doc,"N\xE3o foi poss\xEDvel localizar o link no editor."),!1)}return Xe(e,r,o,null)?!1:(e.adaptador.withEdit(r,()=>{o.setAttribute("href",n),o.setAttribute("data-cke-saved-href",n),o.textContent=t}),!0)}function hs(e,o){let t=[],n=l=>{for(let c of Array.from(l.childNodes))c.nodeType===3?t.push(c):n(c)};n(e);let[r,...i]=t;if(!r){e.textContent=o;return}r.textContent=o;for(let l of i)l.parentNode?.removeChild(l)}function dt(e,o){let t=0,n=[];for(let{a:i,texto:l}of o){let c=lt(e,i);if(c)if(e.adaptador.versao===5){let a=ct(c,i);if(!a||Xe(e,c,i,a))continue;n.push({a:i,texto:l,intervalo:a,ed:c})}else{if(Xe(e,c,i,null))continue;hs(i,l),t+=1}}let r=n[0]?.ed;return r&&r.model.change(i=>{for(let{a:l,texto:c,intervalo:a}of[...n].reverse()){let u={},s=[...a.getItems?.()??[]].find(g=>typeof g.getAttributes=="function");if(s)for(let[g,x]of s.getAttributes())u[g]=x;u.linkHref=l.getAttribute("href")??"",i.remove(a),i.insertText(c,u,a.start),t+=1}}),t}var vs="position:fixed;z-index:2147483000;display:flex;gap:10px;align-items:center;max-width:90%;padding:6px 12px;font:13px sans-serif;background:#fff;color:#1155cc;border:1px solid #ccc;border-radius:4px;box-shadow:0 2px 8px rgba(0,0,0,.2);",Sn=new WeakMap,xs=e=>{let o=Sn.get(e);if(o)return o;let t={balao:null};return Sn.set(e,t),t},ys=e=>e.length>50?`${e.replace(/^(.{50}[^\s]*).*/,"$1")}...`:e;function Pn(e){let o=xs(e),t=p=>Y(e.doc,p);function n(p){let b=o.balao;if(b){if(!p){let d=!1;try{d=b.el.matches(":hover")}catch{d=!1}if(d)return}b.el.remove(),o.balao=null}}function r(){if(o.balao)return o.balao.link;let p=e.adaptador.getInstance();return(p?e.adaptador.getSelectionElement(p):null)?.closest("a[href]")??null}async function i(p){try{await(e.areaDeTransferencia??e.win.navigator.clipboard).writeText(p),t("Link copiado!")}catch{t("N\xE3o foi poss\xEDvel copiar o link")}}function l(p,b){n(!0);let d=p?.closest?.("a[href]"),h=d?.getAttribute("href")??"";if(!d||!ve(h))return;let A=f("a",{href:h,target:"_blank",rel:"noopener noreferrer",title:d.textContent??"",style:"color:inherit;text-decoration:underline;"},f("strong",{},ys(h))),E=(S,D,H)=>f("button",{type:"button",class:S,title:D,style:"background:none;border:0;color:#777;cursor:pointer;font:inherit;padding:0 2px;text-decoration:underline;",onclick:H},D),w=f("div",{class:"linkDisplayPro",style:vs},A,E("spro-copiar","Copiar",()=>void i(h)),E("spro-editar","Editar",()=>s()),E("spro-remover","Remover",()=>c()));e.doc.body.append(w),o.balao={el:w,link:d};let y=d.getBoundingClientRect?.();if(y){let S=d.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),D=w.getBoundingClientRect?.().width??0,H=Math.max(8,Math.min(y.left+(S?.left??0),(e.win.innerWidth||0)-D-8));w.style.left=`${H}px`,w.style.top=`${y.bottom+(S?.top??0)+4}px`}}function c(p,b){let d=r();d&&(An(e,d),n(!0))}function a(p,b){let d=r()?.getAttribute("href");d&&ve(d)&&e.win.open(d,"_blank","noopener,noreferrer")}function u(p,b){let d=r()?.getAttribute("href");d&&i(d)}function s(){let p=r();if(!p)return;let b=f("input",{type:"text",id:"linkProNome",autocomplete:"off"}),d=f("input",{type:"text",id:"linkProUrl",placeholder:"https://",autocomplete:"off",spellcheck:"false"});b.value=p.textContent??"",d.value=p.getAttribute("href")??"";let h=te(e.doc,{titulo:"Editar link",conteudo:Be(Ce("Texto do link",b),Ce("Endere\xE7o (URL)",d),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let A=d.value.trim(),E=b.value.trim()||A;if(A==="")return t("Digite um link");if(Yo.test(A))return t("O link informado \xE9 inv\xE1lido.");Cn(e,p,E,A)&&(n(!0),h.fechar())}},"Salvar")))})}function g(){e.adaptador.versao===5&&e.doc.addEventListener("mousedown",p=>{let b=p.target;if(!b||o.balao?.el.contains(b))return;let d=b.closest?.("a[href]");d&&b.closest(".ck-editor__editable_inline")&&e.checkOpcao("editarlinks")?l(d):n(!1)},!0)}return{globais:{showLinkTips:l,hideLinkTips:p=>n(!1),openLinkPro:a,removeLinkPro:c,copyLinkPro:u,editLinkPro:p=>s(),openDialogLinkPro:s,getDialogLinkPro:()=>{}},iniciar:g}}var Tn={id:"link-pro",globais:e=>Pn(e).globais,iniciar:e=>Pn(e).iniciar()};var ut=300,Eo={pausa:500,assentar:900,espia:150,limiteDialogo:8e3},Es="\\d[\\d.\\-]{3,}\\d\\/(?:19|20)\\d{2}-\\d{2}",ks="00000.000000/0000-00",In="Converter n\xFAmeros SEI em links";function ws(e){return String(e).replace(/\d+|\D/g,o=>/\d/.test(o)?`\\d{${o.length}}`:o.replace(/[.*+?^${}()|[\]\\/]/g,"\\$&"))}function As(e){return new RegExp(`\\b(${e.map(o=>`\\d{${o}}`).join("|")})\\b`,"g")}function Cs(e){return new RegExp(`(?<![\\w./]|\\d-)(?:${e.join("|")})(?![\\w]|[./-]\\d)`,"g")}function Ss(e,o){let t=[];o.processo.lastIndex=0;for(let r=o.processo.exec(e);r!==null;r=o.processo.exec(e))t.push({numero:r[0],tipo:"processo",proprio:r[0]===o.processoAtual,inicio:r.index,fim:r.index+r[0].length});let n=t.slice();o.documento.lastIndex=0;for(let r=o.documento.exec(e);r!==null;r=o.documento.exec(e)){let i=r.index,l=i+r[0].length;n.some(c=>i<c.fim&&l>c.inicio)||t.push({numero:r[0],tipo:"documento",proprio:!1,inicio:i,fim:l})}return t.sort((r,i)=>r.inicio-i.inicio)}function pt(e){let o={};for(let t of e)o[t.numero]=(o[t.numero]??0)+1;return o}function Ps(e,o,t){let n=e.slice(Math.max(0,o-40),o).replace(/\s+/g," "),r=e.slice(t,t+40).replace(/\s+/g," ");return`${o>40?"...":""}${n}\u2039${e.slice(o,t)}\u203A${r}${t+40<e.length?"...":""}`}function Ts(e){let o=[],t=r=>{let i=r.pai??r.no,l=o.indexOf(i);return l===-1&&(o.push(i),l=o.length-1),l};return e.map(r=>({oc:r,chave:t(r)})).sort((r,i)=>r.chave!==i.chave?r.chave-i.chave:i.oc.inicio-r.oc.inicio).map(r=>r.oc)}var _n=e=>e===1?"n\xFAmero":"n\xFAmeros";function Mn(e){return typeof e.checked=="boolean"?e.checked:e.hasAttribute("checked")}function Ln(e,o){e.checked=o,o?e.setAttribute("checked","checked"):e.removeAttribute("checked")}var mt=e=>new Promise(o=>setTimeout(o,e)),ko=(e,o)=>String(e).slice(0,o),Rn={id:"link-sei-lote",globais(e){let o=e.adaptador,t=e.win,n=_=>Y(e.doc,_),r=()=>o.versao===5,i=!1,l=()=>e.win.location?.search??"";function c(){let _=t.dadosProcessoPro??{};if(_.propProcesso)return _;try{let C=new URLSearchParams(l()).get("id_procedimento"),m=typeof t.sessionStorageRestorePro=="function"?t.sessionStorageRestorePro("dadosSessionProcessoPro"):null;if(C&&Array.isArray(m)){for(let v of m)if(v?.propProcesso&&String(v.propProcesso.hdnIdProcedimento)===C)return v}}catch{}return _}function a(){let _=[],C=c().listDocumentos;for(let m of Array.isArray(C)?C:[]){let v=String(m?.nr_sei??"").replace(/\D/g,"");v.length>=5&&v.length<=12&&!_.includes(v.length)&&_.push(v.length)}return _.length?_.sort((m,v)=>m-v):[7,8]}function u(){let _=c().propProcesso;return _?String(_.txtProtocoloExibir||_.hdnProtocoloFormatado||"").trim():""}function s(){let _=u(),C=[Es];_.replace(/\D/g,"").length>=8&&C.unshift(ws(_));let m=a();return{tamanhos:m,processoAtual:_,exemploProcesso:_||ks,documento:As(m),processo:Cs(C)}}let g=(_,C)=>Ss(_,C).map(m=>({...m,trecho:Ps(_,m.inicio,m.fim)}));function x(_){let C=[];try{C=Array.from(_.model.document.getRootNames())}catch{return[]}let m=e.win.INFRA_EDITOR_CONFIG?.rootsAttributes;return C.filter(v=>{if(v==="$graveyard"||m?.[v]?.somenteLeitura)return!1;let P=null;try{P=_.ui?.getEditableElement?.(v)}catch{P=null}return P??=e.doc.getElementById(v),!P?.classList.contains("ck-read-only")})}function p(_,C){let m=[];for(let v of x(_)){let P=_.model.document.getRoot(v);if(!P)continue;let I=_.model.createRangeIn(P).getItems();for(let k=I.next();!k.done;k=I.next()){let M=k.value;if(!M.is?.("$textProxy"))continue;let T=M.textNode?.parent,L=M.startOffset??0;for(let N of g(String(M.data??""),C))m.push({...N,pai:T,inicio:L+N.inicio,fim:L+N.fim})}}return m}function b(_){let C=o.getAllInstances().filter(m=>!o.somenteLeitura(m)&&!!o.getBodyContainer(m));return C.length?C:o.somenteLeitura(_)?[]:[_]}function d(_,C){for(let m of Array.from(_.childNodes))if(m.nodeType===3)C.push(m);else if(m.nodeType===1){let v=m.tagName.toLowerCase();v!=="a"&&v!=="script"&&v!=="style"&&d(m,C)}}function h(_,C){let m=[];for(let v of b(_)){let P=o.getBodyContainer(v);if(!P?.ownerDocument)continue;let I=[];d(P,I);for(let k of I)for(let M of g(k.nodeValue??"",C))m.push({...M,inst:v,no:k})}return m}let A=(_,C)=>r()?p(_,C):h(_,C);function E(_){return r()?x(_).length===0:b(_).length===0}async function w(_){let C=t.INFRA_EDITOR_CONFIG?.sei?.urlBuscarProtocoloSei;if(!C)return{erro:"O SEI n\xE3o exp\xF4s o endere\xE7o de consulta de protocolo"};try{let m=new URLSearchParams(l()),v=`idProtocoloDigitado=${encodeURIComponent(_)}&idProcedimento=${encodeURIComponent(m.get("id_procedimento")??"")}&idDocumento=${encodeURIComponent(m.get("id_documento")??"")}`,I=await(e.fetch??e.win.fetch.bind(e.win))(new URL(C,e.win.location.href).href,{method:"POST",credentials:"include",headers:{"Content-Type":"application/x-www-form-urlencoded; charset=UTF-8"},body:v}),k=new TextDecoder("iso-8859-1").decode(await I.arrayBuffer()),M=new e.win.DOMParser().parseFromString(k,"text/xml"),T=M.querySelector("erro");if(T)return{erro:T.getAttribute("descricao")||"Protocolo n\xE3o encontrado."};let L={};for(let N of Array.from(M.querySelectorAll("complemento")))L[N.getAttribute("nome")??""]=N.textContent??"";return L.IdProtocolo?{idProtocolo:L.IdProtocolo,formatado:L.ProtocoloFormatado||_,identificacao:L.Identificacao||""}:{erro:"Resposta do SEI sem o identificador do protocolo"}}catch(m){return{erro:`Falha ao consultar o SEI: ${ko(m,80)}`}}}async function y(_,C){let m=await w(C.numero);return m.erro||_.model.change(v=>{let P=v.createRange(v.createPositionAt(C.pai,C.inicio),v.createPositionAt(C.pai,C.fim)),I=v.createElement("SEILink",{id:`lnkSei${m.idProtocolo}`,text:m.formatado??C.numero});v.remove(P),v.insert(I,v.createPositionAt(C.pai,C.inicio))}),m}function S(_,C){let m=C.inst??_,v=t.CKEDITOR?.dom;if(!v||!C.no)throw new Error("CKEditor 4 indispon\xEDvel");m.focus();let P=new v.range(m.document),I=new v.text(C.no);P.setStart(I,C.inicio),P.setEnd(I,C.fim),m.getSelection()?.selectRanges([P]),o.execCommand(C.inst??_,"linkseiDialog")}async function D(){let _=Date.now()+Eo.limiteDialogo,C=()=>{try{return t.CKEDITOR?.dialog?.getCurrent()??null}catch{return null}};for(;C()&&Date.now()<=_;)await mt(Eo.espia);try{C()?.hide()}catch{}}async function H(_){let C=t.alert,m=[];t.alert=v=>{m.push(String(v))};try{return{resultado:await _(),avisos:m}}finally{t.alert=C}}function O(_,C,m,v,P){let I=pt(A(_,s()));for(let L of Object.keys(P))I[L]&&(I[L]=Math.max(0,I[L]-(P[L]??0)));let k=new Set(m.map(L=>L.numero)),M=v.length?String(v[0]).replace(/\s+/g," ").trim():"O SEI n\xE3o converteu este n\xFAmero",T=0;for(let L of C)(I[L.numero]??0)>0&&(I[L.numero]=(I[L.numero]??0)-1,T++,k.has(L.numero)||(m.push({numero:L.numero,motivo:M}),k.add(L.numero)));return{total:C.length,falhas:m,semLink:T}}async function $(_,C,m){let v=Ts(C),P=[],I=async()=>{for(let k of v){if(r()){let M=await y(_,k);M.erro&&P.push({numero:k.numero,motivo:M.erro})}else try{S(_,k),await D()}catch(M){P.push({numero:k.numero,motivo:ko(M,90)})}await mt(Eo.pausa)}};try{let k=await H(I);return await mt(Eo.assentar),O(_,v,P,k.avisos,m)}catch(k){return O(_,v,P.concat([{numero:"-",motivo:ko(k,90)}]),[],m)}}function B(_,C){let m=0,v=0;for(let I of _)I.tipo==="processo"&&v++;m=_.length-v;let P=[];return m&&P.push(f("strong",{},String(m)),` de documento (${C.tamanhos.join(" ou ")} d\xEDgitos, como os documentos deste processo)`),v&&(P.length&&P.push(" e "),P.push(f("strong",{},String(v))," de processo")),P}function G(_){let C=_.total-_.semLink,m=P=>`${P} ${P===1?"n\xFAmero convertido":"n\xFAmeros convertidos"}`;if(!_.falhas.length){n(`${m(C)} em link.`);return}let v=f("div",{class:"spro-resultados",id:"linkSeiLoteFalhas"},..._.falhas.map(P=>f("div",{class:"spro-resultado"},f("div",{class:"spro-resultado-topo"},f("div",{class:"spro-resultado-titulo"},P.numero,f("span",{class:"spro-selo aviso"},P.motivo))))));te(e.doc,{titulo:In,largura:560,conteudo:re(f("div",{id:"linkSeiLoteResumo"},ce(`${C} de ${_.total} ${_.total===1?"n\xFAmero convertido":"n\xFAmeros convertidos"}.`)),f("p",{class:"spro-subtitulo"},"Ficaram sem link"),v)})}function V(_,C,m,v,P){let I=C.some(Z=>Z.proprio),k=C.map((Z,ue)=>ge({class:"linkSeiLoteItem","data-i":String(ue),...Z.proprio?{}:{checked:"checked"}},f("span",{class:"spro-item-corpo"},f("b",{},Z.numero),f("small",{},Z.proprio?"este processo":Z.tipo),f("span",{class:"spro-trecho"},Z.trecho)))),M=f("div",{class:"spro-checklist",id:"linkSeiLoteLista"},...k),T=()=>Array.from(M.querySelectorAll("input.linkSeiLoteItem")),L=f("span",{id:"linkSeiLoteContagem",class:"spro-dica"}),N=()=>{let Z=T().filter(Mn).length;L.textContent=`${Z} de ${C.length} marcados`};M.addEventListener("change",N),N();let z=Re("Marcar todos",()=>{for(let Z of T())Ln(Z,!0);N()},{id:"linkSeiLoteTodos"}),Q=Re("Desmarcar todos",()=>{for(let Z of T())Ln(Z,!1);N()},{id:"linkSeiLoteNenhum"}),X=f("button",{type:"button",class:"spro-botao primario",id:"linkSeiLoteConverter"},"Converter"),oe=re(ce("Encontrei ",f("strong",{},String(C.length)),` ${_n(C.length)} neste texto: `,...B(C,m),"."),ce(`Desmarque o que n\xE3o for documento ou processo do SEI.${I?" O n\xFAmero deste pr\xF3prio processo vem desmarcado.":""} Cada n\xFAmero marcado \xE9 uma consulta ao servidor.`),P>0?ce(`Foram listadas as primeiras ${ut} ocorr\xEAncias; converta e abra de novo para tratar as ${P} restantes.`):null,f("div",{class:"spro-barra"},f("div",{class:"spro-linha"},z,Q),L),M,f("div",{class:"spro-barra fim"},X));oe.id="linkSeiLoteBox";let ie=te(e.doc,{titulo:In,largura:620,conteudo:oe});X.addEventListener("click",()=>{let Z=T().filter(Mn).map(ae=>C[Number.parseInt(ae.getAttribute("data-i")??"",10)]).filter(ae=>!!ae);if(ie.fechar(),!Z.length)return;let ue=pt(Z),de={};for(let ae of Object.keys(v))de[ae]=(v[ae]??0)-(ue[ae]??0);i=!0,n(`Convertendo ${Z.length} ${_n(Z.length)}...`),$(_,Z,de).then(G).catch(ae=>n(`N\xE3o foi poss\xEDvel converter: ${ko(ae,90)}`)).finally(()=>{i=!1})})}function W(_){let C=o.getInstance(_);if(!C)return;if(i){n("J\xE1 h\xE1 uma convers\xE3o em andamento. Aguarde o fim para iniciar outra.");return}if(E(C)){o.recusarEscrita();return}let m=s(),v=A(C,m);if(!v.length){n(`Nenhum n\xFAmero de documento (${m.tamanhos.join(" ou ")} d\xEDgitos) ou de processo (como ${m.exemploProcesso}) foi encontrado no texto. Os que j\xE1 s\xE3o link n\xE3o entram na conta.`);return}let P=pt(v),I=Math.max(0,v.length-ut);I&&(v=v.slice(0,ut)),V(C,v,m,P,I)}return{converterNumerosSeiEmLotePro:W}}};function Is(e,o){return`<p class="Texto_Alinhado_Esquerda">
   <span contenteditable="false" class="minutaAncora" data-type="${o}">
      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">
          <style type="text/css" data-style="seipro-watermark">
              body:after, .ck-editor__editable_inline:after { content: "${e}"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }
              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }
              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }
              body.cke_editable .minutaAncora:after, .ck-editor__editable_inline .minutaAncora:after { content: " [delete isto para remover a marca d'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }
              body.cke_editable:after, .ck-editor__editable_inline:after { width: fit-content; margin: 0 33%; overflow: hidden; }
          </style>
          * ${e} DE DOCUMENTO      </a>   </span>&nbsp;&nbsp;
</p>
`}var Dn={id:"minuta-watermark",globais(e){let o=e.adaptador,t=e.win;function n(s,g){let x=e.win.DOMParser??globalThis.DOMParser,p=new x().parseFromString(`<!doctype html><html><body>${s}</body></html>`,"text/html");return g(p.body),p.body.innerHTML}function r(s,g){o.transformBodyHtml(s,x=>n(x,p=>{for(let b of Array.from(p.querySelectorAll(g))){let d=b.closest("p");d?.parentNode?d.parentNode.removeChild(d):b.parentNode?.removeChild(b)}}))}function i(){try{let s=t.dadosProcessoPro?.listDocumentos;if(!Array.isArray(s))return null;let g=new URL(e.win.location.href).searchParams.get("id_documento"),x=s.find(p=>p.id_protocolo===g)?.documento;return typeof x=="string"?x:null}catch{return null}}function l(s,g,x="minuta"){let p=o.getInstance();if(!p)return;let d=(i()?.toLowerCase().includes("modelo")??!1)||x==="modelo"?"MODELO":"MINUTA",h=Is(d,g);o.transformBodyHtml(p,A=>h+(A||"")),t.enableButtonSavePro?.()}function c(s){setTimeout(()=>{let g=o.findInBody(s,".minutaAncora")[0];if(!g)return;let x=[0,1,0,1];x.forEach((p,b)=>{setTimeout(()=>{g.style.opacity=String(p)},100*(b+1))}),setTimeout(()=>g.style.removeProperty("opacity"),100*(x.length+1)),g.scrollIntoView?.()},0)}function a(s){let g=o.getInstance(s);if(!g)return;let x=o.findInBody(g,".minutaAncora");if(x.length===0){l(null,"manual");return}let b=x.map(d=>d.textContent??"").join("").includes("MINUTA")?"modelo":"minuta";r(g,".minutaAncora"),l(null,"manual",b),c(g)}function u(){let s=o.getInstance();if(!s)return;i()?.toLowerCase().includes("minuta")?o.findInBody(s,".minutaAncora").length===0&&l(null,"auto"):o.findInBody(s,'.minutaAncora[data-type="auto"]').length>0&&r(s,'.minutaAncora[data-type="auto"]')}return{getMinutaWatermark:a,insertMinutaWatermark:l,insertAutomaticMinutaWatermark:u}}};var _s=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"];function Nn(e){let o=/^(\d{4})-(\d{2})-(\d{2})$/.exec(e.trim());if(!o)return"";let[t,n,r]=[Number(o[1]),Number(o[2]),Number(o[3])],i=new Date(t,n-1,r);return i.getFullYear()!==t||i.getMonth()!==n-1||i.getDate()!==r?"":`${r} de ${_s[n-1]} de ${t}`}function gt(e){let o=h=>ne(h),t=h=>h!=="",n=t(e.nome)?`, ${o(je(e.nome.trim()))}`:"",r=o(e.sobrenome.toUpperCase()),i=t(e.titulo)?`. <strong>${o(je(e.titulo.trim()))}</strong>`:"",l=t(e.edicao)?`. ${o(e.edicao)}. ed.`:"",c=t(e.local)?`, ${o(je(e.local.trim()))}`:"",a=t(e.editora)?`: ${o(je(e.editora.trim()))}`:"",u=t(e.ano)?`, ${o(e.ano)}`:"",s=t(e.volume)?`, v. ${o(e.volume)}`:"",g=t(e.paginas)?`. p.${o(e.paginas)}`:"",x=t(e.link)&&ve(e.link)?`. Dispon\xEDvel em: <a href="${o(e.link)}" target="_blank">&lt;${o(e.link)}&gt;</a>`:"",p=Nn(e.data),b=p?`. Acesso em: ${p}`:"",d=r+n+i+l+c+a+u+s+g+x+b;return d===""?"":`${d}.`}var bt="ntRodape_item",Ve="ntRodape_footer",$n=".ntRodape_item, .ntRodape, .ntRodape_tr",On='<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>';function Hn(e,o){let t=ne(e);return`<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_${t}" href="#item_${t}" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="${t}" data-ntrodape="?" contenteditable="false">[?]</span></a> ${o}</p>`}function zn(e){let o=ne(e);return`<sup><a href="#footer_${o}" name="item_${o}" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="${o}" contenteditable="false">[?]</span></a></sup> `}function Bn(e,o=new Set){let t=new Map,n=0;for(let l of e)l.tipo==="item"&&(n+=1,t.set(l.ref,n));let r=[],i=[];for(let l of e){if(l.tipo!=="footer")continue;let c=t.get(l.ref);c!==void 0?r.push({ref:l.ref,chave:c}):o.has(l.ref)?r.push({ref:l.ref,chave:Number.isFinite(l.numero)?l.numero:Number.MAX_SAFE_INTEGER}):i.push(l.ref)}return r.sort((l,c)=>l.chave-c.chave),{numeroDe:t,ordem:r.map(l=>l.ref),orfaos:i}}var ft=e=>e.getAttribute("data-ntrodape-ref")??"";function Fn(e,o=new Set){let t=Array.from(e.querySelectorAll(`.${bt}[data-ntrodape-ref]`)),n=Array.from(e.querySelectorAll("p.ntRodape")).filter(c=>c.querySelector(`.${Ve}[data-ntrodape-ref]`)),r=c=>Number.parseInt(c.querySelector(`.${Ve}`)?.getAttribute("data-ntrodape")??"",10),i=Bn([...t.map(c=>({tipo:"item",ref:ft(c)})),...n.map(c=>({tipo:"footer",ref:ft(c.querySelector(`.${Ve}`)),numero:r(c)}))],o);t.forEach((c,a)=>{c.setAttribute("data-ntrodape",String(a+1)),c.textContent=`[${a+1}]`});let l=new Map;for(let c of n){let a=ft(c.querySelector(`.${Ve}`)),u=i.numeroDe.get(a),s=c.querySelector(`.${Ve}`);u!==void 0&&(s.setAttribute("data-ntrodape",String(u)),s.textContent=`[${u}]`),c.remove(),l.set(a,c)}for(let c of i.ordem){let a=l.get(c);a&&e.append(a)}if(!i.ordem.length)for(let c of e.querySelectorAll(".ntRodape_tr"))c.remove();return i}function jn(e){for(let o of e.querySelectorAll(".ntRodape, .ntRodape_tr"))o.remove();for(let o of e.querySelectorAll(`.${bt}[data-ntrodape-ref]`))(o.closest("sup")??o).remove();for(let o of e.querySelectorAll('a[href^="#footer_"], a[href^="#item_"]'))o.remove()}var qn=e=>e.getAttribute?.("htmlSpan")?.classes??[],Ms=e=>e.getAttribute?.("htmlPAttributes")?.classes??[];function Qn(e,o){let t={itens:[],textos:[],rodapes:[],separadores:[]};for(let n of e.createRangeIn(o).getItems())if(n.is("$textProxy")||n.is("$text")){let r=qn(n);r.includes(bt)?(t.itens.push(n),t.textos.push({no:n,tipo:"item"})):r.includes(Ve)&&t.textos.push({no:n,tipo:"rodape"})}else if(n.is("element")&&n.parent===o){let r=Ms(n);if(r.includes("ntRodape_tr"))t.separadores.push(n);else if(r.includes("ntRodape")){let l=Array.from(e.createRangeIn(n).getItems()).find(c=>(c.is("$textProxy")||c.is("$text"))&&qn(c).includes(Ve))?.getAttribute("htmlSpan")?.attributes??{};l["data-ntrodape-ref"]&&t.rodapes.push({bloco:n,ref:l["data-ntrodape-ref"],numero:Number.parseInt(l["data-ntrodape"],10)})}}return t}function Ls(e,o,t){let n=o.getAttribute("htmlSpan")??{},r=`[${t}]`;if(o.data===r&&n.attributes?.["data-ntrodape"]===String(t))return;let i=Object.fromEntries(o.getAttributes());i.htmlSpan={...n,attributes:{...n.attributes,"data-ntrodape":String(t)}};let l=e.createRangeOn(o),c=l.start;e.remove(l),e.insertText(r,i,c)}function Un(e,o,t=new Set){let n={numeroDe:new Map,ordem:[],orfaos:[]};return e.model.change(r=>{let i=Qn(r,o),l=u=>u.getAttribute("htmlSpan")?.attributes?.["data-ntrodape-ref"]??"";n=Bn([...i.itens.map(u=>({tipo:"item",ref:l(u)})),...i.rodapes.map(u=>({tipo:"footer",ref:u.ref,numero:u.numero}))],t);let c=[],a=0;for(let u of i.textos)if(u.tipo==="item")a+=1,c.push({no:u.no,n:a});else{let s=n.numeroDe.get(l(u.no));s!==void 0&&c.push({no:u.no,n:s})}for(let u of[...c].reverse())Ls(r,u.no,u.n);for(let u of n.orfaos){let s=i.rodapes.find(g=>g.ref===u);s&&r.remove(r.createRangeOn(s.bloco))}for(let u of n.ordem){let s=i.rodapes.find(g=>g.ref===u);s&&r.move(r.createRangeOn(s.bloco),r.createPositionAt(o,"end"))}if(!n.ordem.length)for(let u of i.separadores)r.remove(r.createRangeOn(u))}),n}function Vn(e,o){e.model.change(t=>{let n=Qn(t,o),r=[...n.itens,...n.rodapes.map(i=>i.bloco),...n.separadores];for(let i of[...r].reverse())t.remove(t.createRangeOn(i))})}function co(e,o){if(!e?.model||!e.editing||!o)return null;for(let t of Array.from(e.model.document.roots??[]))if(!(!t||t.rootName==="$graveyard"))try{let n=e.editing.view.document.getRoot(t.rootName);if(n&&e.editing.view.domConverter.mapViewToDom(n)===o)return t}catch{}return null}function Gn(e,o,t){let n=new Set;for(let r of Array.from(e.model.document.roots??[]))if(!(!r||r===o||r.rootName==="$graveyard"))for(let i of t(e.data.get({rootName:r.rootName})))n.add(i);return n}var Rs='a[href^="#RefPro_"], a[href^="#footer_"], a[href^="#item_"]',Wn=new WeakSet,Kn=new WeakSet,ht=e=>e.replace(/["\\]/g,"\\$&");function Ds(e,o){let t=e.querySelector(`[name="${ht(o)}"], [id="${ht(o)}"]`);if(t)return t;let n=/^(item|footer)_(.+)$/.exec(o);return n?e.querySelector(`.ntRodape_${n[1]}[data-ntrodape-ref="${ht(n[2]??"")}"]`):null}function Ne(e){if(e.adaptador.versao!==5)for(let t of e.adaptador.getAllInstances())Kn.has(t)||(Kn.add(t),e.adaptador.on(t,"contentDom",()=>Ne(e)));let o=e.adaptador.versao===5?[e.doc]:e.adaptador.getAllInstances().map(t=>e.adaptador.getBodyContainer(t)?.ownerDocument);for(let t of o)!t||Wn.has(t)||(Wn.add(t),t.addEventListener("click",n=>{let r=n.target?.closest?.(Rs);if(!r)return;let i=Ds(t,(r.getAttribute("href")??"").slice(1));(i?.closest("p")??i)?.scrollIntoView?.({behavior:"smooth",block:"center"})}))}var Ns=[["nome","nr_Nome"],["sobrenome","nr_Sobrenome"],["titulo","nr_Titulo"],["edicao","nr_Edicao"],["ano","nr_Ano"],["local","nr_Local"],["editora","nr_Editora"],["volume","nr_Volume"],["paginas","nr_Paginas"],["link","nr_Link"],["data","nr_Data"]],Jn={id:"nota-rodape",globais(e){let o=e.adaptador,t=d=>Y(e.doc,d),n=d=>o.getBodyContainer(d),r=d=>o.findInBody(d,$n).length>0;function i(d,h){let A=o.versao===5?Je(e,h):o.somenteLeitura(d);return A&&o.recusarEscrita(),A}function l(d){let h=e.doc.createElement("div");return h.append(...Ee(e.doc,d)),Array.from(h.querySelectorAll(".ntRodape_item[data-ntrodape-ref]")).map(A=>A.getAttribute("data-ntrodape-ref")??"")}function c(d){if(o.versao===5){let h=co(d,n(d));h&&Un(d,h,Gn(d,h,l))}else{let h=n(d);h&&Fn(h)}}function a(d){let A=typeof d=="object"&&d!==null&&("model"in d||o.getAllInstances().includes(d))?d:o.getInstance();if(!A)return!1;let E=o.versao===5?co(A,n(A)):null;return o.versao===5&&!E?(t("N\xE3o foi poss\xEDvel localizar o corpo do documento para atualizar as notas."),!1):i(A,E)?!1:(o.withEdit(A,()=>c(A)),!0)}function u(d){let h=d??o.getInstance();if(h){if(!r(h)){t("O documento n\xE3o tem notas de rodap\xE9.");return}a(h)&&(Ne(e),t("Notas de rodap\xE9 atualizadas com sucesso"))}}function s(d,h){let A=h??o.getInstance();if(!A)return;if(!r(A)){t("O documento n\xE3o tem notas de rodap\xE9.");return}let E=o.versao===5?co(A,n(A)):null;if(o.versao===5&&!E){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para remover as notas.");return}i(A,E)||(o.withEdit(A,()=>{if(o.versao===5)Vn(A,E);else{let w=n(A);w&&jn(w)}}),t("Notas de rodap\xE9 removidas com sucesso"))}function g(d,h){let A=h??o.getInstance();if(!A||d.trim()==="")return;let E=o.versao===5?co(A,n(A)):null;if(o.versao===5&&!E){t("N\xE3o foi poss\xEDvel localizar o corpo do documento para inserir a nota.");return}if(i(A,E))return;let w=Le(16);o.withEdit(A,()=>{if(o.versao===5){let y=A;y.model.document.selection.getFirstPosition()?.root!==E&&y.model.change(S=>S.setSelection(E,"end"))}o.findInBody(A,".ntRodape_tr").length||o.appendToBody(A,On),o.appendToBody(A,Hn(w,d)),o.insertHtml(A,zn(w)),c(A)}),Ne(e)}function x(d){let h=A=>(d.querySelector(`#${A}`)?.value??"").toString();return Object.fromEntries(Ns.map(([A,E])=>[A,h(E)]))}function p(d){let h=d??e.doc,A=h.querySelector("#nrABNTResult");A&&A.replaceChildren(...Ee(e.doc,gt(x(h))))}function b(d){let h=d??o.getInstance();if(!h)return;let A=[["livre","Texto livre"],["abnt","Padr\xE3o ABNT"],["atualizar","Atualizar notas"],["remover","Remover notas"]],E=null,w=G=>{E&&(G==="livre"||G==="abnt"?E.removeAttribute("hidden"):E.setAttribute("hidden",""))},y=f("textarea",{id:"textNotaRodape",rows:"4",placeholder:"Digite o texto da nota de rodap\xE9"}),S=(G,V,W="text",_={})=>j(G,{para:V,largo:_.largo},f("input",{type:W,id:V,autocomplete:"off",..._.placeholder?{placeholder:_.placeholder}:{}})),D=qe({id:"nrABNTResult"},{vazio:"A nota formatada aparece aqui"});D.classList.add("texto");let H=re(le("duas",S("Nome do autor","nr_Nome"),S("Sobrenome do autor","nr_Sobrenome")),S("T\xEDtulo da publica\xE7\xE3o","nr_Titulo"),le("tres",S("Edi\xE7\xE3o","nr_Edicao","number"),S("Ano","nr_Ano","number"),S("Volume","nr_Volume","number")),le("duas",S("Local (cidade)","nr_Local"),S("Editora","nr_Editora")),le("duas",S("P\xE1ginas (inicial-final)","nr_Paginas"),S("Data do acesso","nr_Data","date")),S("Link da publica\xE7\xE3o","nr_Link","text",{placeholder:"https://"}),j("Nota formatada",{},D));H.classList.add("compacto");let O={livre:j("Texto da nota de rodap\xE9",{para:"textNotaRodape"},y),abnt:H,atualizar:f("div",{class:"spro-form"},ce("Atualiza a numera\xE7\xE3o e a ordem das notas de rodap\xE9 que j\xE1 existem no documento."),f("div",{},f("button",{type:"button",id:"btnNrUpdate",class:"spro-botao",onclick:()=>u(h)},"Atualizar notas"))),remover:f("div",{class:"spro-form"},ce("Remove todas as notas de rodap\xE9 do documento. Ctrl+Z desfaz."),f("div",{},f("button",{type:"button",id:"btnNrRemove",class:"spro-botao perigo",onclick:()=>{s(null,h),B.fechar()}},"Remover todas")))},$=we("nt",A,O,w);E=f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let G=(D.textContent??"").trim()?gt(x(H)):"",V=y.value.trim(),W=G||ne(V).replace(/\r?\n/g,"<br>");if(!W){t("Digite o texto da nota de rodap\xE9.");return}g(W,h),B.fechar()}},"Inserir");for(let G of H.querySelectorAll("input"))G.addEventListener("input",()=>p(H)),G.addEventListener("change",()=>p(H));let B=te(e.doc,{titulo:"Inserir nota de rodap\xE9",largura:640,conteudo:f("div",{class:"spro-form"},$.barra,f("div",{},...$.paineis),f("div",{class:"spro-dialogo-rodape"},E))});$.selecionar("livre"),y.focus({preventScroll:!0})}return{getNotaRodape(d){let h=o.getInstance(d);h&&b(h)},getDialogNotaRodape:()=>{},openDialogNotaRodape:b,removeNtRodape:s,updateNrABNT:p,insertNtRodape:g,updateNtRodape:u,reorderNtRodape:a}},iniciar(e){Ne(e)}};function wo(e,o,t,n){let r=e.adaptador.getInstance(o);if(!r)return;let i=e.adaptador.getSelectionParagraph(r);if(i){if(e.adaptador.somenteLeitura(r)){e.adaptador.recusarEscrita();return}e.adaptador.withEdit(r,()=>{e.adaptador.insertHtmlBefore(r,i,t),n?.(r,i)})}}var qs='<div class="pageBreakPro" style="page-break-after: always"></div>',Xn={id:"page-break",globais:e=>({getPageBreak:o=>wo(e,o,qs)})};var Zn="/sei/modulos/pesquisa/",vt="frmCheckerProcessoPublicoPro",$s=60,Os=500;function Hs(e,o,t,n){let r=[];for(let l of e.querySelectorAll("#tblDocumentos tr.infraTrClara")){let c=[...l.querySelectorAll("td")].map(d=>(d.textContent??"").trim()),a=l.querySelector("a.ancoraPadraoAzul")?.getAttribute("onclick")??"",u=/'([^']+)'/.exec(a)?.[1],s=u?`${o}${Zn}${u}`:"",g=c[2]??"",x=c[1]??"",p=`${ne(g)}&nbsp;(${ne(n)}${ne(x)})`,b=s===""||!ve(s);r.push({html:b?p:`<a class="ancoraSei" href="${ne(s)}" target="_blank">${p}</a>`,rotulo:`${g} (${n}${x})${b?" [documento restrito]":""}`,restrito:b})}let i=(e.querySelector("#tblCabecalho tr.infraTrClara")?.querySelectorAll("td")[1]?.textContent??"").trim();return i&&r.push({html:ve(t)?`<a class="ancoraSei" href="${ne(t)}" target="_blank">${ne(i)}</a>`:ne(i),rotulo:`${i} (o processo)`,restrito:!1}),r}var Yn={id:"processo-publico",globais(e){let o=e.adaptador,t=e.win,n=x=>Y(e.doc,x),r=()=>e.win.location?.origin??"",i=()=>`${r()}/sei/modulos/pesquisa/md_pesq_processo_pesquisar.php?acao_externa=protocolo_pesquisar&acao_origem_externa=protocolo_pesquisar&id_orgao_acesso_externo=0`,l=x=>new Promise(p=>setTimeout(p,x)),c=x=>new e.win.DOMParser().parseFromString(x,"text/html");function a(){let x=e.doc.getElementById(vt);return x||(x=e.doc.createElement("iframe"),x.id=vt,x.setAttribute("style","width:1px;height:1px;position:absolute;top:-100px;display:none;"),x.setAttribute("tabindex","-1"),x.setAttribute("scrolling","no"),e.doc.body.append(x)),x}let u=()=>{try{return e.doc.getElementById(vt)?.contentDocument??null}catch{return null}};async function s(x){for(let p=0;p<$s;p+=1){let b=u(),d=b?x(b):null;if(d)return d;await l(Os)}return null}function g(x){try{t.setParamEditor?.(x)}catch{}let p=o.getInstance(x);if(!p)return;let b=f("input",{type:"text",id:"processoPub",autocomplete:"off",placeholder:"N\xFAmero do processo"});b.value=t.dadosProcessoPro?.listAndamento?.processo??"";let d=f("input",{type:"text",id:"captchaPub",autocomplete:"off",placeholder:"C\xF3digo da imagem"}),h=qe({id:"searchPub_captcha"},{vazio:"Carregando o c\xF3digo\u2026"}),A=f("p",{id:"searchPub_result",class:"spro-dica",style:"flex:1;"}),E=f("div",{id:"listaDocPublico",class:"spro-checklist",role:"radiogroup","aria-label":"Documentos do processo"}),w=j("Documentos do processo",{largo:!0},E);w.setAttribute("hidden","");let y=[],S=0,D=f("button",{type:"button",id:"searchPub_search",class:"spro-botao"},fe("busca",15),"Pesquisar"),H=f("button",{type:"button",class:"spro-botao primario",disabled:""},"Inserir"),O=(C,m="")=>{A.textContent=m,C?D.setAttribute("disabled",""):D.removeAttribute("disabled")},$=()=>{t.delayCrash=!1,O(!1,"N\xE3o foi poss\xEDvel usar a pesquisa p\xFAblica agora. Tente de novo.")};async function B(){S+=1;let C=S;h.replaceChildren(),d.value="",O(!0,"Carregando o c\xF3digo de verifica\xE7\xE3o\u2026");let m=a();m.src=i();let v=await s(I=>I.querySelector("#seiSearch")?I.querySelector("#lblCaptcha img")?.getAttribute("src")??I.querySelector("#imgCaptcha")?.getAttribute("src")??null:null);if(C!==S)return;if(!v){O(!1,"N\xE3o foi poss\xEDvel carregar a pesquisa p\xFAblica. Tente de novo.");return}let P=f("button",{type:"button",class:"spro-botao-icone pequeno",title:"Outro c\xF3digo","aria-label":"Outro c\xF3digo",onclick:()=>void B()},fe("atualizar",15));h.replaceChildren(f("img",{src:v,alt:"C\xF3digo de verifica\xE7\xE3o"}),P),O(!1,""),d.focus({preventScroll:!0})}async function G(){let C=b.value.trim(),m=d.value.trim();if(!C||!m){n("Digite o processo e o c\xF3digo da imagem.");return}t.delayCrash=!0,w.setAttribute("hidden",""),H.setAttribute("disabled",""),O(!0,"Pesquisando\u2026");let v=u();if(!v){O(!1,"A pesquisa p\xFAblica n\xE3o est\xE1 carregada."),t.delayCrash=!1;return}let P=v.querySelector("#txtCaptcha")??v.querySelector("#txtInfraCaptcha"),I=v.querySelector("#txtProtocoloPesquisa");I&&(I.value=C),P&&(P.value=m),v.querySelector("#sbmPesquisar")?.click(),await l(800);let k=await s(M=>M.querySelector("#conteudo a.protocoloNormal")?.getAttribute("href")??null);if(t.delayCrash=!1,!k){O(!1,"Processo n\xE3o encontrado ou c\xF3digo incorreto. Confira e tente com outro c\xF3digo."),B().catch($);return}await V(`${r()}${Zn}${k}`)}async function V(C){try{let m=await(e.fetch??e.win.fetch.bind(e.win))(C),v=c(await m.text());y=Hs(v,r(),C,t.getCitacaoDoc?.()??"SEI n\xBA ")}catch{O(!1,"N\xE3o foi poss\xEDvel ler o processo. Tente de novo.");return}E.replaceChildren(...y.map((m,v)=>ge({name:"docPublico",value:String(v),...v===0?{checked:"checked"}:{}},m.rotulo,"radio"))),w.removeAttribute("hidden"),H.removeAttribute("disabled"),O(!1,y.length?`${y.length} ${y.length===1?"item encontrado":"itens encontrados"}.`:"O processo n\xE3o tem documentos p\xFAblicos.")}D.addEventListener("click",()=>void G().catch($)),d.addEventListener("keydown",C=>{C.key==="Enter"&&(C.preventDefault(),G().catch($))}),H.addEventListener("click",()=>{let C=[...E.querySelectorAll("input")].find(v=>typeof v.checked=="boolean"?v.checked:v.hasAttribute("checked")),m=C?y[Number(C.getAttribute("value"))]:void 0;if(!m){n("Escolha o documento a inserir.");return}o.withEdit(p,()=>o.insertHtml(p,m.html)),_.fechar()});let W=re(j("Processo",{para:"processoPub"},b),le("duas",j("Imagem de verifica\xE7\xE3o",{},h),j("Digite o c\xF3digo da imagem",{para:"captchaPub"},d)),f("div",{class:"spro-barra fim"},A,D),w,f("div",{class:"spro-dialogo-rodape"},H)),_=te(e.doc,{titulo:"Adicionar link de documento p\xFAblico",largura:640,conteudo:W,aoFechar:()=>{S+=1,t.delayCrash=!1}});B().catch($)}return{getCheckerProcessoPublicoPro:a,openDialogProcessoPublicoPro:g}}};function ea(e,o,t){let n=e.jQuery,r=n?.(o).qrcode;if(!n||typeof r!="function")return null;o.replaceChildren();try{n(o).qrcode?.(t)}catch{return o.replaceChildren(),null}return o.querySelector("img, canvas")}var uo={"QrPro-size":"140","QrPro-fill":"#333333","QrPro-background":"#ffffff","QrPro-minversion":"6","QrPro-eclevel":"L","QrPro-quiet":"1","QrPro-radius":"50","QrPro-mode":"0","QrPro-msize":"20","QrPro-mposx":"50","QrPro-mposy":"50","QrPro-font":"Arial","QrPro-fontcolor":"#ff9818"},zs=[["QrPro-size"," px"],["QrPro-minversion",""],["QrPro-quiet","m\xF3dulo"],["QrPro-radius","%"],["QrPro-msize","%"],["QrPro-mposx","%"],["QrPro-mposy","%"]],Bs=["Arial","Helvetica","Times","Times New Roman","Courier","Courier New","Verdana","Tahoma","Impact"],Fs=[["0","Normal"],["1","Etiqueta em faixa"],["2","Etiqueta em caixa"],["3","Imagem em faixa"],["4","Imagem em caixa"]],js=[["L","Baixo (7%)"],["M","M\xE9dio (15%)"],["Q","1/4 (25%)"],["H","Alto (30%)"]],oa={id:"qr-code",globais(e){let o=e.adaptador,t=y=>Y(e.doc,y),n=y=>e.doc.querySelector(y),r=y=>n(`#${y}`)?.value??"",i=()=>e.win.NAMESPACE_SPRO??"SEI Pro",l=()=>`${e.base}icons/menu/seipro.png`,c=(y,S,D,H)=>ro({id:y,min:S,max:D,step:H,value:uo[y]??""}),a=y=>f("p",{class:"spro-subtitulo"},y);function u(){let y=Vo({id:"optionsQrAdvanced",style:"display:none;"},a("Tamanho e margens"),le("duas",j("Tamanho do QR",{para:"QrPro-size",valor:"140 px"},c("QrPro-size",100,500,50)),j("Vers\xE3o",{para:"QrPro-minversion",valor:"6"},c("QrPro-minversion",1,10,1)),j("Margem de folga",{para:"QrPro-quiet",valor:"1 m\xF3dulo"},c("QrPro-quiet",0,4,1)),j("Raio de canto",{para:"QrPro-radius",valor:"50%"},c("QrPro-radius",0,50,10))),a("Cores"),le("duas",j("Preenchimento",{para:"QrPro-fill"},no({id:"QrPro-fill",value:uo["QrPro-fill"]??""})),j("Fundo",{para:"QrPro-background"},no({id:"QrPro-background",value:uo["QrPro-background"]??""}),ge({id:"QrPro-background-transparent"},"Fundo transparente"))),a("Corre\xE7\xE3o e modo"),le("duas",j("Corre\xE7\xE3o de erros",{para:"QrPro-eclevel"},f("select",{id:"QrPro-eclevel"},...js.map(([D,H])=>f("option",{value:D},H)))),j("Modo",{para:"QrPro-mode"},f("select",{id:"QrPro-mode"},...Fs.map(([D,H])=>f("option",{value:D},H))))),f("div",{class:"QrMode-etiqueta QrMode-imagem",style:"display:none;"},le("tres",j("Tamanho da etiqueta",{para:"QrPro-msize",valor:"20%"},c("QrPro-msize",0,40,1)),j("Posi\xE7\xE3o X",{para:"QrPro-mposx",valor:"50%"},c("QrPro-mposx",0,100,1)),j("Posi\xE7\xE3o Y",{para:"QrPro-mposy",valor:"50%"},c("QrPro-mposy",0,100,1)))),f("div",{class:"QrMode-etiqueta",style:"display:none;"},le("tres",j("Nome da fonte",{para:"QrPro-font"},f("select",{id:"QrPro-font"},...Bs.map(D=>f("option",{value:D},D)))),j("Cor da fonte",{para:"QrPro-fontcolor"},no({id:"QrPro-fontcolor",value:uo["QrPro-fontcolor"]??""})),j("Etiqueta",{para:"QrPro-label"},f("input",{id:"QrPro-label",type:"text",value:i()})))),f("div",{class:"QrMode-imagem",style:"display:none;"},j("Imagem",{para:"QrPro-image",dica:"A imagem entra no QR conforme o modo escolhido."},f("input",{id:"QrPro-image",type:"file",accept:"image/*"})),f("img",{id:"QrPro-img-buffer",style:"display:none",src:l(),alt:""}))),S=Re("Restaurar padr\xF5es",()=>g(),{id:"QrPro-reset"});return S.style.display="none",f("div",{id:"qrCodeLab",class:"spro-form spro-lateral"},qe({id:"qrCodeResult"},{vazio:"A pr\xE9via do QR aparece aqui",xadrez:!1}),f("div",{class:"spro-barra"},Re("Op\xE7\xF5es avan\xE7adas",()=>s(),{id:"toggleOptionsQR",expansivel:!0}),S),y)}function s(){let y=n("#optionsQrAdvanced");if(!y)return;y.style.display=y.style.display==="none"?"":"none";let S=n("#qrCodeLab");y.style.display===""?S?.setAttribute("data-aberto",""):S?.removeAttribute("data-aberto");let D=n("#QrPro-reset");D&&(D.style.display=y.style.display)}function g(){for(let[H,O]of Object.entries(uo)){let $=n(`#${H}`);$&&($.value=O)}let y=n("#QrPro-label");y&&(y.value=i());let S=n("#QrPro-background-transparent");S&&(S.checked=!1,S.removeAttribute("checked")),n("#QrPro-img-buffer")?.setAttribute("src",l());let D=n("#qrCodeLab");D&&Ue(D),A()}function x(y){n("#tipQrCodeUrl")?.remove();let S=n("#qrCodeResult");if(y===""||!ve(y)||y.length<=50||!S)return;let D=f("div",{id:"tipQrCodeUrl",class:"spro-aviso-inline"},f("span",{},"Endere\xE7o longo deixa o QR denso e dif\xEDcil de ler."),Re("Gerar link curto",()=>b()));S.before(D)}function p(y){let S=n("#qrCodeText");S&&(S.value=y),A()}function b(){let y=r("qrCodeText").trim(),S=e.win.ajaxTinyUrl;if(typeof S!="function"){t("O servi\xE7o de link curto n\xE3o est\xE1 dispon\xEDvel.");return}Promise.resolve(S(y,"","setinput")).catch(()=>t("Erro: n\xE3o foi poss\xEDvel gerar o link curto"))}function d(){let y=n("#qrCodeLab");if(y)for(let[S,D]of zs){let H=r(S);Qe(y,S,D==="m\xF3dulo"?`${H} ${H==="1"?"m\xF3dulo":"m\xF3dulos"}`:`${H}${D}`)}}function h(y){let S=D=>Number.parseInt(r(D),10);return{render:"image",ecLevel:r("QrPro-eclevel"),minVersion:S("QrPro-minversion"),fill:r("QrPro-fill"),background:n("#QrPro-background-transparent:checked")?null:r("QrPro-background"),text:y,size:S("QrPro-size"),radius:S("QrPro-radius")*.01,quiet:S("QrPro-quiet"),mode:S("QrPro-mode"),mSize:S("QrPro-msize")*.01,mPosX:S("QrPro-mposx")*.01,mPosY:S("QrPro-mposy")*.01,label:r("QrPro-label"),fontname:r("QrPro-font"),fontcolor:r("QrPro-fontcolor"),image:n("#QrPro-img-buffer")}}function A(){let y=n("#qrCodeResult");if(!y)return;y.replaceChildren(),y.classList.toggle("xadrez",n("#QrPro-background-transparent:checked")!==null);for(let H of e.doc.querySelectorAll(".QrMode-etiqueta, .QrMode-imagem"))H.style.display="none";d();let S=r("QrPro-mode");if(S==="1"||S==="2")for(let H of e.doc.querySelectorAll(".QrMode-etiqueta"))H.style.display="";else if(S==="3"||S==="4")for(let H of e.doc.querySelectorAll(".QrMode-imagem"))H.style.display="";let D=r("qrCodeText");D!==""&&!ea(e.win,y,h(D))&&t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),x(D)}function E(y,S){let D=S??o.getInstance();if(!D)return!1;let H=n("#qrCodeResult img")?.getAttribute("src")??"";return/^data:image\/(png|jpeg|gif|webp);base64,/i.test(H)?o.somenteLeitura(D)?(o.recusarEscrita(),!1):(o.withEdit(D,()=>o.insertHtml(D,`<img src="${ne(H)}" alt="${ne(y)}">`)),!0):(t("N\xE3o foi poss\xEDvel gerar o QR Code para este texto."),!1)}function w(y){let S=y??o.getInstance();if(!S)return;let D=f("input",{type:"text",id:"qrCodeText",placeholder:"Endere\xE7o, texto ou qualquer dado",autocomplete:"off"}),H=(o.getSelectedText(S)||String(e.win.getSelection?.()??"")).trim();H&&(D.value=H),D.addEventListener("input",()=>A()),D.addEventListener("change",()=>A());let O=u();for(let B of["input","change"])O.querySelector("#optionsQrAdvanced")?.addEventListener(B,()=>A());O.querySelector("#QrPro-image")?.addEventListener("change",B=>{let G=B.target.files?.[0];if(!G)return;let V=new FileReader;V.onload=()=>{let W=String(V.result??"");if(!/^data:image\//i.test(W)){t("Escolha um arquivo de imagem.");return}n("#QrPro-img-buffer")?.setAttribute("src",W);let _=n("#QrPro-mode");_&&(_.value="4"),setTimeout(A,200)},V.readAsDataURL(G)});let $=te(e.doc,{titulo:"Gerar C\xF3digo QR",largura:760,conteudo:re(j("Texto a codificar",{para:"qrCodeText"},D),O,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let B=D.value.trim();if(!B){t("Digite o texto a codificar");return}E(B,S)&&$.fechar()}},"Inserir")))});H&&A()}return{getQrCode(y){let S=o.getInstance(y);S&&w(S)},getDialogQrCode:()=>{},openDialogQrCode:w,buildHtmlQrCodeLab:u,resetOptionsQR:g,toggleOptionsQR:s,tipQrCodeUrl:x,setInputTinyUrl:p,convertTinyURL:b,updateQrCode:A,setQrCode:E}}};var ta=5,ra=5,na=49,Se=(e,o)=>Number.parseInt(e?.getAttribute(o)??"",10);function Qs(e,o){let t=e?.closest(".cke_toolgroup")?.querySelector(".divQuickTable");if(t)return t;let n=e?.closest(".ck-toolbar__items")?.querySelector(".divQuickTable");if(n)return n;for(let r=e?.previousElementSibling??null;r;r=r.previousElementSibling)if(r.classList.contains("divQuickTable"))return r;return o.querySelector(".divQuickTable")}var aa={id:"quick-table",globais(e){let o=e.adaptador;function t(){for(let s of e.doc.querySelectorAll(".divQuickTable"))s.replaceChildren(),go(s);for(let s of e.doc.querySelectorAll(".getQuickTableButtom"))s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")}function n(s){if(!s)return;let g=Se(s,"data-row"),x=Se(s,"data-col"),p=s.closest("table");if(!p)return;for(let h of p.querySelectorAll("td"))h.classList.remove("td_hover");let b=()=>[...p.querySelectorAll("tr")];if(g>=3&&Se(b().at(-1)?.querySelector("td"),"data-row")>g+1&&(b().at(-1)?.remove(),p.setAttribute("data-row",String(Se(p,"data-row")-1))),x>=3&&Se(b().at(-1)?.lastElementChild,"data-col")>x+1){for(let h of b())h.lastElementChild?.remove();p.setAttribute("data-col",String(Se(p,"data-col")-1))}for(let h of p.querySelectorAll("td"))Se(h,"data-row")<=g&&Se(h,"data-col")<=x&&h.classList.add("td_hover");let d=s.closest(".divQuickTable")?.querySelector(".quickTableInfo");if(d&&(d.textContent=`Tabela ${g+1}x${x+1}`),g===Se(p,"data-row")&&g<na){let h=b().at(-1)?.cloneNode(!0);h&&(h.querySelectorAll("td").forEach((A,E)=>{A.setAttribute("data-row",String(g+1)),A.setAttribute("data-col",String(E)),A.classList.remove("td_hover")}),(p.querySelector("tbody")??p).append(h),p.setAttribute("data-row",String(g+1)))}if(x===Se(p,"data-col")&&x<na){for(let h of b()){let A=h.lastElementChild?.cloneNode(!0);A&&(A.setAttribute("data-col",String(x+1)),A.classList.remove("td_hover"),h.append(A))}p.setAttribute("data-col",String(x+1))}}function r(){let s=e.doc,g=s.createDocumentFragment(),x=s.createElement("div");x.className="quickTableInfo",x.textContent="Inserir Tabela";let p=s.createElement("table");p.setAttribute("data-row",String(ta-1)),p.setAttribute("data-col",String(ra-1));for(let d=0;d<ta;d+=1){let h=s.createElement("tr");for(let A=0;A<ra;A+=1){let E=s.createElement("td");E.setAttribute("data-row",String(d)),E.setAttribute("data-col",String(A)),h.append(E)}p.append(h)}let b=d=>n(d.target?.closest("td")??null);return p.addEventListener("mouseover",b),p.addEventListener("mouseout",b),p.addEventListener("click",d=>{let h=d.target?.closest("td");h&&u(h)}),g.append(x,p),g}function i(s){if(!s)return;let g=Qs(s,e.doc);s.classList.contains("cke_button_on")?(t(),s.classList.add("cke_button_off"),s.classList.remove("cke_button_on")):(g&&(g.replaceChildren(r()),mo(g)),s.classList.remove("cke_button_off"),s.classList.add("cke_button_on"))}function l(s){let g=s?.closest(".ck-toolbar__items, .cke_toolbox, .cke"),x=g?[...g.querySelectorAll(".getTablestylesButtom")]:[];x.length||(x=[...e.doc.querySelectorAll(".getTablestylesButtom")]);for(let p of x)p.classList.remove("cke_button_disabled")}function c(s,g){let x='<table border="1" cellspacing="1" cellpadding="1" style="border-collapse:collapse; border-color:#646464;margin-left:auto; margin-right:auto; width:80%;">';x+="  <tbody>";for(let p=0;p<=s;p+=1){x+="      <tr>";for(let b=0;b<=g;b+=1)x+='          <td><p class="Tabela_Texto_Alinhado_Esquerda" ><br></p></td>';x+="      </tr>"}return`${x}  </tbody></table>`}function a(s,g){let x=g?g.nextElementSibling:o.getBodyContainer(s)?.lastElementChild,p=x?.tagName==="TABLE"?x.querySelector("td p"):null;if(!p)return;let b=p.ownerDocument,d=b.defaultView?.getSelection?.();if(!d)return;let h=b.createRange();h.setStart(p.firstChild??p,0),h.collapse(!0),d.removeAllRanges(),d.addRange(h)}function u(s){let g=o.getInstance(s);if(!g){t();return}let x=c(Se(s,"data-row"),Se(s,"data-col")),p=o.getSelectionParagraph(g);o.withEdit(g,()=>{if(!p)return o.insertHtml(g,x);let b=p.nextElementSibling;b?o.insertHtmlBefore(g,b,x):o.appendToBody(g,x)}),t(),l(s),a(g,p)}return{getQuickTable:i,quickTableOver:n,hideQuickTable:t,quickTableClick:u}}};function Ao(e,o,t,n,r){let i=e.adaptador;if(i.versao===5){let c=Ie(o,t);return c&&Je(e,c)?(i.recusarEscrita(),!1):t.id?!0:!!e.win.SeiProGhs?.setAtributos(t,{id:n},o)}if(i.somenteLeitura(o))return i.recusarEscrita(),!1;if(r)for(let c of t.querySelectorAll(`a.${r}`))c.remove();let l=t.ownerDocument.createElement("a");return l.setAttribute("name",n),r&&(l.className=r),t.prepend(l),!0}function Co(e,o,t=!1){if(t&&e.id)return e.id;let n=e.querySelector(`a[name^="${o}"]`);return n?n.getAttribute("name"):e.id?.startsWith(o)?e.id:null}var Us=[1,2,3,4],xt=["Paragrafo_Numerado_Nivel","Item_Nivel"];function ia(e){let o=xt.map(()=>[0,0,0,0]);return e.map(({classe:t})=>{if(t==="sessionBreakPro"){for(let n of o)n.fill(0);return{item:""}}for(let n=0;n<xt.length;n+=1)for(let r of Us){if(t!==`${xt[n]}${r}`)continue;let i=o[n];i[r-1]=(i[r-1]??0)+1;for(let l=r;l<4;l+=1)i[l]=0;return{item:i.slice(0,r).join(".")}}return{item:""}})}var Ze="RefPro_",Vs="refpro",sa=(e,o,t)=>`[${o||e.trim()===""?"":`${e.trim()} `}${t}]`,la={id:"ref-interna",globais(e){let o=e.adaptador,t=s=>Y(e.doc,s);function n(s){let g=s??o.getInstance();if(!g)return!1;let x=o.findInBody(g,"p");if(!x.length)return!1;let p=ia(x.map(d=>({classe:(d.getAttribute("class")??"").trim()}))),b=[];return x.forEach((d,h)=>{let A=p[h]?.item;if(!A)return;let E=Co(d,Ze,o.versao===5),w=E?.startsWith(Ze)?E.slice(Ze.length):E??Le(16);b.push({ref:w,nome:E??`${Ze}${w}`,item:A,text:d.textContent??"",ancorado:!!E,el:d})}),b}function r(s,g){let x=new Set(g.filter(p=>p.ancorado&&!p.nome.startsWith(Ze)).map(p=>p.nome));return o.findInBody(s,'a[href^="#"]').filter(p=>(p.getAttribute("href")??"").startsWith(`#${Ze}`)||x.has((p.getAttribute("href")??"").slice(1))&&/^\[[^\]]*\d[^\]]*\]$/.test((p.textContent??"").trim()))}function i(s,g,x){let p=n(s),b=[];if(!p)return{mudar:b,perdidas:0};let d=r(s,p);if(!d.length)return{mudar:b,perdidas:0};let h=new Map(p.filter(E=>E.ancorado).map(E=>[E.nome,E.item])),A=0;for(let E of d){let w=h.get((E.getAttribute("href")??"").slice(1));if(w===void 0){A+=1;continue}let y=sa(g,x,w);(E.textContent??"")!==y&&b.push({a:E,texto:y})}return{mudar:b,perdidas:A}}function l(s,g,x){let{mudar:p,perdidas:b}=i(s,g,x),d=0;return p.length&&o.withEdit(s,()=>d=dt(e,p)),{atualizadas:d,perdidas:b,recusadas:p.length-d}}function c(s,g,x){let p,b,d;typeof s=="string"||s===void 0?(p=o.getInstance(),b=s??"",d=g===!0):(p=s,b=typeof g=="string"?g:"",d=x===!0),p&&l(p,b,d)}function a(s){let g=o.getInstance(s);if(!g)return;let x=n(g);if(!x||x.length===0){t("O documento n\xE3o tem par\xE1grafos numerados para referenciar.");return}let p=f("input",{type:"text",id:"prefixo",placeholder:"ex.: item, par\xE1grafo, art.",autocomplete:"off"}),b=f("input",{type:"checkbox",id:"hidePrefix"}),d=f("label",{class:"spro-caixa"},b,f("span",{},"N\xE3o utilizar prefixo")),h=f("select",{id:"selectRef",multiple:"multiple",size:String(Math.min(8,Math.max(4,x.length)))},...x.map(w=>{let y=w.text.trim(),S=y.replace(/^(.{50}[^\s]*)[\s\S]*/,"$1");return f("option",{value:`${w.ref}-${w.item}`},`${w.item}. ${S}${S.length<y.length?"...":""}`)})),A=()=>b.matches(":checked")||p.value.trim()==="",E=te(e.doc,{titulo:"Inserir refer\xEAncia interna",largura:640,conteudo:re(j("Prefixo",{para:"prefixo"},p,d),j("Par\xE1grafos numerados",{para:"selectRef",dica:"Selecione um ou mais (Ctrl ou Shift para v\xE1rios)."},h),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao",onclick:()=>{let{perdidas:w,recusadas:y}=l(g,p.value,A());Ne(e),!y&&t(w?`Refer\xEAncias atualizadas. ${w} apontam para par\xE1grafos que n\xE3o existem mais.`:"Refer\xEAncias atualizadas com sucesso")}},"Atualizar refer\xEAncias"),f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let w=x.filter(y=>[...h.querySelectorAll("option")].some(S=>S.value===`${y.ref}-${y.item}`&&S.selected));if(!w.length){t("Selecione ao menos um par\xE1grafo numerado.");return}u(g,w,p.value,A())&&E.fechar()}},"Inserir")))})}function u(s,g,x,p){if(o.somenteLeitura(s))return o.recusarEscrita(),!1;let b=g.filter(E=>E.el.isConnected);if(!b.length)return t("Os par\xE1grafos escolhidos n\xE3o existem mais no documento."),!1;let d=b.map(E=>`<a href="#${ne(E.nome)}" class="ancoraSei refInternaPro anchorRefInternaPro" contenteditable="false">${ne(sa(x,p,E.item))}</a>`),h=d.length>1?`${d.slice(0,-1).join(", ")} e ${d.at(-1)}`:d[0]??"",A=!1;return o.withEdit(s,()=>{let{mudar:E}=i(s,x,p);E.length&&dt(e,E);for(let w of b)if(!w.ancorado&&!Ao(e,s,w.el,w.nome,Vs))return;o.insertHtml(s,` ${h} `),A=!0}),Ne(e),A}return{getRefInterna:a,updateRefsInternas:c,getNiveisParagrafos:n,clickScroolToRef:()=>Ne(e)}},iniciar(e){Ne(e)}};var Gs={fundo:"#F0F8FF",texto:"#0000FF",tag:"u"},Ws={fundo:"#FFF0F5",texto:"#FF0000",tag:"s"},Ye=e=>e==="add"?Gs:Ws,Ks="position:fixed;z-index:2147483000;padding:10px;background:#fff;border:1px solid #ccc;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.2);text-align:left;",Js=new Set(["Shift","Meta","Control","Alt","AltGraph","CapsLock","NumLock","ScrollLock","Escape","ContextMenu","Dead","Unidentified","Process","Home","End","PageUp","PageDown","Insert"]),Xs="Nenhuma revis\xE3o identificada neste documento.",Zs="Revis\xF5es realizadas com sucesso",Ys="No editor do SEI 5, o rastreio autom\xE1tico de altera\xE7\xF5es ao digitar ainda n\xE3o est\xE1 dispon\xEDvel. Selecione um trecho antes de digitar para registrar a revis\xE3o, ou use o gerenciador de revis\xF5es.";function yt(){let e=new Date,o=t=>String(t).padStart(2,"0");return`${o(e.getDate())}/${o(e.getMonth()+1)}/${e.getFullYear()} ${o(e.getHours())}:${o(e.getMinutes())}`}function So(e){let o=e.parentNode;o&&(o.insertBefore(e.ownerDocument.createTextNode(e.textContent??""),e),o.removeChild(e))}function ca(e){let o=e.previousElementSibling;o?.classList?.contains("reviewSP")&&o.parentNode?.removeChild(o)}function Ge(e){e.parentNode?.removeChild(e)}function el(e,o){for(let i of[...e.querySelectorAll(".reviewDisplayPro")])Ge(i);let t=o.mode;if(t==="acceptAll"||t==="rejectAll"){for(let i of[...e.querySelectorAll(".reviewSeiPro")]){let l=i.getAttribute("data-review");l==="add"?(ca(i),t==="acceptAll"?So(i):Ge(i)):l==="delete"&&(t==="acceptAll"?Ge(i):So(i))}return}if(t!=="accept"&&t!=="reject")return;let n=[...e.querySelectorAll("span[data-id-review]")].find(i=>i.getAttribute("data-id-review")===String(o.idReview));if(!n)return;let r=(n.getAttribute("data-review")??o.type)==="add";r&&ca(n),t==="accept"?r?So(n):Ge(n):r?Ge(n):So(n)}var ol=new Set(["P","SPAN","B","I","U","S","STRONG","EM","BR","SUB","SUP","DEL","INS"]),tl=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","LINK","META","BASE","FORM","SVG","MATH","TEMPLATE","NOSCRIPT"]),rl=new Set(["class","style"]);function nl(e){for(let o of[...e.querySelectorAll(".reviewDisplayPro")])Ge(o);for(let o of[...e.querySelectorAll("*")]){if(!o.parentNode)continue;let t=o.tagName.toUpperCase();tl.has(t)?Ge(o):ol.has(t)||o.replaceWith(...o.childNodes)}for(let o of[e,...e.querySelectorAll("*")])for(let t of[...o.attributes]){let n=t.name.toLowerCase(),r=n==="style"&&/url\s*\(|expression|javascript:|@import/i.test(t.value);(!rl.has(n)||r)&&o.removeAttribute(t.name)}}var da=new WeakMap,al=e=>{let o=da.get(e);if(o)return o;let t={balao:null,gerenciador:null,instrumentados:new WeakSet,avisouCk5:!1,mousedownLigado:!1};return da.set(e,t),t};function ua(e){let o=e.adaptador,t=al(e),n=e.win,r=e.doc,i=R=>Y(r,R),l=()=>{let R=n.getOptionsPro?.("usuarioSistema");return typeof R=="string"?R:""},c=R=>new e.win.DOMParser().parseFromString(`<!doctype html><html><body>${R}</body></html>`,"text/html");function a(R,q,F){let K=R.comment??"",J=String(R.id_review),U=String(R.type),ee=Ye(U),se=R.html?typeof R.html=="string"?Ee(r,R.html):R.html:null,pe=(Pe,ke,We,Na,qa)=>{let Lo=f("span",{class:"action",role:"button",tabindex:"0",style:`float:right;font-size:80%;margin-left:10px;cursor:pointer;color:${ke};`,...F?{}:{"data-spro-click":"parent.removeReviewPro"},"data-readonly":String(q),"data-id-review":J,"data-mode":Pe,"data-type":U,title:Na},fe(qa,14,r),` ${We}`);return F&&(Lo.addEventListener("click",()=>F.decidir(Pe,J,U,q)),Lo.addEventListener("keydown",Mt=>{let Lt=Mt.key;(Lt==="Enter"||Lt===" ")&&(Mt.preventDefault(),F.decidir(Pe,J,U,q))})),Lo},be=K===""?q?"Nenhum coment\xE1rio":"Adicionar coment\xE1rio":K,xe=Pe=>{let ke=f("span",{style:"color:#777;font-size:90%;display:block;font-style:italic;margin:10px 0 5px 0;padding:5px;border-radius:5px;",...Pe?{"data-info":K===""?"new":"update",...F?{}:{"data-spro-click":"parent.addCommentReviewPro"}}:{}},fe("nota",14,r)," ",f("span",{class:"commentReview info",style:"padding:3px;"},be));return Pe&&F&&ke.addEventListener("click",()=>F.comentar(ke)),ke},ze=l()===R.user&&!q;return f("div",{class:"reviewDisplayPro",unselectable:"on"},f("span",{contenteditable:"false"},R.text?f("span",{style:"margin:5px;display:block;"},f("span",{style:`background-color:${ee.fundo};`},f(ee.tag,{style:`color:${ee.texto};`},R.text))):null,se?f("div",{class:"textReview","data-spro-tip":"Clique para rolar at\xE9 o texto",...F?{onclick:()=>F.rolar(J)}:{"data-spro-click":"scroolToReview","data-spro-args":JSON.stringify([J])}},...se):null,f("span",{style:"color:#777;font-size:90%;margin-left:5px;"},fe("pessoa",14,r),f("span",{class:"info"})," ",f("strong",{class:"title-reviewtip",title:R.user},R.user)),f("span",{style:"color:#777;font-size:80%;margin-left:10px;font-style:italic;"},fe("relogio",13,r),` ${R.date}`),pe("accept","#9CB639","Aceitar","Aceitar revis\xE3o","check"),pe("reject","#E46E64","Rejeitar","Rejeitar revis\xE3o","cancelar"),ze?xe(!0):K===""&&!q?null:xe(!1)))}function u(R){return{date:R.getAttribute("data-date-review")??"",id_review:R.getAttribute("data-id-review")??"",type:R.getAttribute("data-review")??"",user:R.getAttribute("data-user-review")??"",comment:R.getAttribute("data-comment")??"",text:!1}}function s(R,q){return o.somenteLeitura(R)?(o.recusarEscrita(),!1):(o.versao===4?o.withEdit(R,()=>o.transformBodyHtml(R,q)):o.transformBodyHtml(R,q),!0)}function g(R,q){let F=c(R).body;return q(F),F.innerHTML}function x(R){let q=t.balao;if(q){if(!R){let F=!1;try{F=q.el.matches(":hover")}catch{F=!1}if(F)return}q.el.remove(),t.balao=null}}function p(R,q){x(!0);let F=R?.closest?.("span.reviewSeiPro");if(!F)return;let K={rolar:ee=>O(ee),decidir:(ee,se,pe,be)=>S({mode:ee,idReview:se,type:pe,readonly:be}),comentar:ee=>A(ee)},J=a(u(F),!1,K);J.setAttribute("style",Ks),r.body.append(J),t.balao={el:J,marca:F};let U=F.getBoundingClientRect?.();if(U){let ee=F.ownerDocument.defaultView?.frameElement?.getBoundingClientRect?.(),se=J.getBoundingClientRect?.().width??0,pe=Math.max(8,Math.min(U.left+(ee?.left??0),(e.win.innerWidth||0)-se-8));J.style.left=`${pe}px`,J.style.top=`${U.bottom+(ee?.top??0)+4}px`,J.style.setProperty("margin","0","important")}}function b(R){x(!1)}function d(R,q){q!==""?(R.setAttribute("data-comment",q.replace(/(\r\n|\n|\r)/gm," ")),R.setAttribute("data-date-review",yt())):R.removeAttribute("data-comment")}function h(R){let q=o.getInstance(R);if(!q)return;if(o.versao!==5){o.saveSnapshot(q);return}let F=R.getAttribute("data-id-review")??"",K=R.getAttribute("data-comment"),J=R.getAttribute("data-date-review");s(q,U=>g(U,ee=>{let se=[...ee.querySelectorAll("span[data-id-review]")].find(pe=>pe.getAttribute("data-id-review")===F);se&&(K!==null?(se.setAttribute("data-comment",K),J!==null&&se.setAttribute("data-date-review",J)):se.removeAttribute("data-comment"))}))}function A(R){let q=R.querySelector(".commentReview");if(!q)return;let F=o.getInstance(R);if(F&&o.somenteLeitura(F)){o.recusarEscrita();return}let K=(t.balao?.el.contains(R)?t.balao.marca:null)??R.closest(".reviewSeiPro");if(!K||(R.getAttribute("data-info")==="new"&&(q.textContent=""),q.setAttribute("contenteditable","true"),q.focus?.(),q.getAttribute("data-spro-edicao")))return;q.setAttribute("data-spro-edicao","sim");let J=()=>{let U=(q.textContent??"").trim();R.setAttribute("data-info",U!==""?"update":"new"),d(K,U)};q.addEventListener("keydown",U=>{if(U.key==="Enter"){U.preventDefault(),q.blur?.();return}setTimeout(J,100)}),q.addEventListener("blur",()=>{J(),h(K)})}function E(R){R&&A(R)}function w(R){let q=r.querySelector("#boxReviews");q&&(q.replaceChildren(f("div",{class:"spro-nota"},f("label",{},R))),r.querySelector("#reviewBarra")?.setAttribute("hidden",""))}function y(R,q,F){let K=q??o.getInstance(R);if(!K)return;let J=F??{mode:R?.getAttribute("data-mode")??void 0,idReview:R?.getAttribute("data-id-review")??void 0,type:R?.getAttribute("data-type")??void 0,readonly:R?.getAttribute("data-readonly")==="true"};if(x(!0),!s(K,ee=>g(ee,se=>el(se,J))))return;if(J.mode==="acceptAll"||J.mode==="rejectAll"){if(!r.querySelector("#boxReviews"))return;w(Zs);let ee=t.gerenciador;setTimeout(()=>{ee&&t.gerenciador===ee&&ee.fechar()},3e3)}else J.readonly&&Z()}function S(R){let q=o.getInstance();q&&y(null,q,R)}function D(R){let q=o.getInstance(R);q&&y(R,q)}function H(R){for(let q of o.getAllInstances()){let F=o.findInBody(q,".reviewSeiPro").find(K=>K.getAttribute("data-id-review")===R);if(F)return F}return null}function O(R){let q=H(String(R));if(!q)return;let F=r.getElementById("divEditores");if(o.versao===4&&F?.scrollTo){let K=q.closest("p")??q,J=K.getBoundingClientRect?.();if(J){F.scrollTo({top:J.top+(K.ownerDocument.defaultView?.pageYOffset??0)+200,behavior:"smooth"});return}}q.scrollIntoView?.({behavior:"smooth",block:"center"})}function $(R,q,F,K=!0){let J=Ye(R);return f("span",{"data-review":R,class:"reviewSeiPro","data-id-review":q,"data-date-review":yt(),"data-user-review":l(),style:`background-color:${J.fundo};`},...K?[f(J.tag,{style:`color:${J.texto};`},...F)]:F)}function B(R,q,F,K,J,U){let ee=Le(8);if(F==="change"){if(o.versao===4){let We={"data-review":q,"data-user-review":l(),"data-date-review":yt(),"data-id-review":ee,class:"reviewSeiPro"};o.applyStyle(R,{element:"span",attributes:{...We,style:`background-color: ${Ye(q).fundo}`}}),o.applyStyle(R,{element:Ye(q).tag,attributes:{...We,style:`color:${Ye(q).texto}`}});return}let xe=o.getSelectedHtml(R),ze=Ye(q),Pe=xe?Ee(r,xe):[f(ze.tag,{style:`color:${ze.texto};`})],ke=$(q,ee,Pe,!1);o.withEdit(R,()=>o.insertHtml(R,ke.outerHTML));return}let se=$(q,ee,[r.createTextNode(K)]),pe=J?'<span class="reviewSP">&nbsp;</span> ':"",be=U?`${f("p",{class:U},se).outerHTML} `:se.outerHTML+pe;o.withEdit(R,()=>o.insertHtml(R,be))}function G(R,q,F,K,J){let U=o.getInstance();U&&B(U,R==="delete"?"delete":"add",q==="change"?"change":"insert",F??"",K??!1,J??!1)}let V=()=>[...r.querySelectorAll(".getReviewButton")],W=()=>V().some(R=>R.classList.contains("cke_button_on"));function _(R){let q=R,F=typeof q.getSelection=="function"?q.getSelection():null;return F&&typeof F.getRanges=="function"&&typeof q.createRange=="function"?q:null}let C=()=>e.win.CKEDITOR??{};function m(R){let q=R.getSelection()?.getRanges()??[],F=q[q.length-1];if(!F||!R.createRange)return null;let K=R.createRange();return K.setStart(F.endContainer,F.endOffset),K.setEnd(F.endContainer,F.endOffset),K}function v(R,q){let F=R.getSelection()?.getRanges()[0];if(!F)return null;let K=F.startContainer,J=C(),U=J.NODE_TEXT??3,ee=q==="prev"?F.startOffset-1:F.startOffset;if(K.type===U&&F.startOffset)return K.getText()[ee]??null;let se=J.dom?.walker;if(!se||!R.editable)return null;F.collapse(!0),F.setStartAt(R.editable(),J.POSITION_AFTER_START??3);let pe=new se(F);for(let be=pe.previous();be;be=pe.previous())if(be.type===U)return be.getText().slice(-1);return null}function P(R){let q=R.getSelection()?.getNative?.(),F=q?.focusNode?.parentElement??null,K=q?.anchorNode?.parentElement??null,J=[];for(let U=F;U&&(J.push(U.cloneNode(!0)),U!==K);U=U.nextElementSibling);return J}let I=R=>R?.closest("span")?.getAttribute("data-review")==="add";function k(R,q,F){let K=F.data?.keyCode,J=F.data?.domEvent?.$?.key??"",U=q.getSelection();if(!U)return;let ee=U.getStartElement()?.$??null,se=ee?.closest("span")??null,pe=U.getSelectedText();if(se?.classList.contains("commentReview"))return;let be=xe=>xe===" "?"\xA0":xe;if(pe===""&&K===8&&se?.getAttribute("data-review")!=="add"){o.saveSnapshot(R);let xe=m(q),ze=v(q,"prev");ze&&B(R,"delete","insert",be(ze),!1,!1),xe&&U.selectRanges([xe]),o.saveSnapshot(R)}else if(pe===""&&K===46){o.saveSnapshot(R),m(q);let xe=v(q,"next");xe&&B(R,"delete","insert",be(xe),!1,!1),o.saveSnapshot(R)}else if(!M(J,F))if(pe!==""){o.saveSnapshot(R);let xe=L(K,J);if(pe.includes(`

`)){for(let ke of P(q))B(R,"delete","insert",ke.textContent??"",!0,ke.getAttribute("class")??!1);o.saveSnapshot(R)}else B(R,"delete","insert",pe,!0,!1),B(R,"add","insert",xe,!1,!1),o.saveSnapshot(R);let Pe=(q.getSelection()?.getStartElement()?.$??null)?.closest("span")??null;if(K!==8&&K!==46&&J.length===1&&Pe?.getAttribute("data-review")==="add"){let ke=m(q);setTimeout(()=>{for(let We of Pe.querySelectorAll("u"))We.textContent=J;ke&&q.getSelection()?.selectRanges([ke])})}}else I(ee)||(o.saveSnapshot(R),B(R,"add","change","",!1,!1),o.saveSnapshot(R))}let M=(R,q)=>R===""||Js.has(R)||R.startsWith("Arrow")||T(q),T=R=>{let q=R.data?.domEvent?.$;return!!(q&&(q.ctrlKey||q.metaKey)&&!q.altKey)};function L(R,q){return R===8?" ":R===46||R===32?"":q.length===1?q:""}function N(R,q){let F=q.data?.keyCode,K=q.data?.domEvent?.$?.key??"";if(M(K,q))return;let J=o.getSelectedText(R);if(J!==""){let U=L(F,K);B(R,"delete","insert",J,!0,!1),U&&B(R,"add","insert",U,!1,!1);return}t.avisouCk5||(t.avisouCk5=!0,i(Ys))}function z(R){let q=o.getInstance();q&&X(q,R??{})}function Q(R){let q=o.getInstance(R??null);return!q||t.instrumentados.has(q)?!1:(o.versao===4?o.on(q,"key",F=>{W()&&X(q,F)}):o.on(q,"keydown",F=>{let K=F;W()&&X(q,{data:{keyCode:K.keyCode,domEvent:{$:K}}})}),t.instrumentados.add(q),!0)}function X(R,q){let F=o.versao===4?_(R):null;F?k(R,F,q):N(R,q)}function oe(R){let q=V(),F=!W();for(let K of q)K.classList.add(F?"cke_button_on":"cke_button_off"),K.classList.remove(F?"cke_button_off":"cke_button_on"),K.setAttribute("aria-pressed",String(F));F&&Q(R??null)}function ie(R){let q=o.findInBody(R,".reviewSeiPro"),F=new Set,K={rolar:U=>O(U),decidir:(U,ee,se,pe)=>S({mode:U,idReview:ee,type:se,readonly:pe}),comentar:()=>{}},J=[];for(let U of q){let ee=U.getAttribute("data-id-review")??"";if(ee!==""&&F.has(ee))continue;F.add(ee);let se=(U.closest("p")??U).cloneNode(!0);for(let be of[se,...se.querySelectorAll(".reviewSeiPro")])be.classList.contains("reviewSeiPro")&&(be.getAttribute("data-id-review")??"")===ee&&be.classList.add("reviewHighlights");nl(se);let pe=[...se.childNodes].map(be=>r.importNode(be,!0));J.push(a({...u(U),html:pe},!0,K))}return J}function Z(R){let q=r.querySelector("#boxReviews");if(!q)return;x(!0);let F=o.getInstance(),K=F?ie(F):[],J=r.querySelector("#reviewBarra");if(K.length===0){q.replaceChildren(f("div",{class:"spro-nota"},f("label",{},R??Xs))),J?.setAttribute("hidden","");return}q.replaceChildren(...K),J?.removeAttribute("hidden");let U=r.querySelector("#reviewContagem");U&&(U.textContent=K.length===1?"1 revis\xE3o no documento":`${K.length} revis\xF5es no documento`)}function ue(R){if(!o.getInstance(R??null))return;t.gerenciador?.fechar();let F=se=>()=>S({mode:se}),K=f("button",{type:"button",class:"spro-botao",id:"reviewRejectAll",title:"Rejeitar todas as revis\xF5es",onclick:F("rejectAll")},"Rejeitar todas"),J=f("button",{type:"button",class:"spro-botao primario",id:"reviewAcceptAll",title:"Aceitar todas as revis\xF5es",onclick:F("acceptAll")},"Aceitar todas"),U=re(ce("Altera\xE7\xF5es e coment\xE1rios marcados no texto. Aceitar mant\xE9m a altera\xE7\xE3o; rejeitar a desfaz. Clique no trecho para ir at\xE9 ele no documento."),f("div",{class:"spro-barra",id:"reviewBarra"},f("span",{class:"spro-nota",id:"reviewContagem"}),f("div",{style:"display:flex;gap:8px;"},K,J)),f("div",{id:"boxReviews"}));U.id="dialogReviewPro";let ee=te(r,{titulo:"Gerenciar Revis\xF5es",largura:700,conteudo:U,aoFechar:()=>{t.gerenciador===ee&&(t.gerenciador=null),x(!0)}});t.gerenciador=ee,Z()}return{globais:{setStyleReview:G,showReviewTips:p,hideReviewTips:b,scroolToReview:O,getHtmlReviewDisplayPro:(R,q)=>a(R,q??!1,null).outerHTML,addCommentReviewPro:E,removeReviewPro:D,setRemoveReviewPro:y,getBoxCtrReview:ue,getDialogReview:()=>{},contentDialogReview:Z,getBoxReview:oe,initStyleReview:Q,getStyleReview:z},iniciar:()=>{o.versao!==5||t.mousedownLigado||(t.mousedownLigado=!0,r.addEventListener("mousedown",R=>{let q=R.target;if(!q||t.balao?.el.contains(q))return;let F=q.closest?.("span.reviewSeiPro");F&&q.closest(".ck-editor__editable_inline")&&e.checkOpcao("revisaotexto")?p(F):x(!1)},!0))}}}var pa={id:"review",globais:e=>ua(e).globais,iniciar:e=>ua(e).iniciar()};var il='<p class="sessionBreakPro" style="counter-reset: paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 "></p>',sl="paragrafo-n1 paragrafo-n2 paragrafo-n3 paragrafo-n4 romano_maiusculo letra_minuscula item-n1 item-n2 item-n3 item-n4 ",ma={id:"session-break",globais:e=>({getSessionBreak:o=>wo(e,o,il,(t,n)=>{if(e.adaptador.versao!==5)return;let r=t,i=r.plugins?.has("GeneralHtmlSupport")?r.plugins.get("GeneralHtmlSupport"):null,l=Ie(r,n)?.previousSibling;i&&l?.name==="paragraph"&&i.setModelHtmlStyles("p",{"counter-reset":sl},l)})})};var ll="\u2588",Ae="sigiloSEI",He="sigiloSEI_tarja",cl="https://seipro.app/pages/SIGILODOC.html",Io=e=>e,dl=e=>String(e).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),To=(e,o)=>new RegExp(`\\b${dl(e)}\\b`,o),Oe=(e,o,t)=>e===1?o:t,ul=e=>e.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi)??[],pl=e=>e.match(/(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))/gi)??[],ga=e=>[...e].sort().filter((o,t,n)=>!t||o!==n[t-1]);function Et(e){let o=e.parentNode;if(o){for(;e.firstChild;)o.insertBefore(e.firstChild,e);o.removeChild(e)}}function fa(e,o){let t=To(o,"igm");for(let n of[...e.childNodes])if(n.nodeType===3){let r=n.nodeValue??"";if(t.lastIndex=0,!t.test(r))continue;t.lastIndex=0;let i=n.ownerDocument,l=i.createDocumentFragment(),c=0,a=t.exec(r);for(;a!==null;){if(a[0]==="")t.lastIndex++;else{a.index>c&&l.appendChild(i.createTextNode(r.slice(c,a.index)));let u=i.createElement("span");u.className=Ae,u.textContent=a[0],l.appendChild(u),c=a.index+a[0].length}a=t.exec(r)}c<r.length&&l.appendChild(i.createTextNode(r.slice(c))),n.parentNode?.insertBefore(l,n),n.parentNode?.removeChild(n)}else if(n.nodeType===1){let r=n;if(r.classList?.contains(Ae)||r.classList?.contains(He))continue;fa(r,o)}}function ba(e){let o=e?.classes;if(!o)return[];if(typeof o=="string")return o.split(/\s+/);if(Array.isArray(o))return o.slice();let t=o;if(typeof t.forEach=="function"){let n=[];return t.forEach(r=>{n.push(r)}),n}return Object.keys(o)}function Po(e){return!e||typeof e.is!="function"||!e.is("$text")?!1:ba(e.getAttribute("htmlSpan")).includes(Ae)}function ml(e){let o={...e},t=ba(e).filter(r=>r&&r!==Ae);t.length?o.classes=t:delete o.classes;let n=r=>!r||typeof r=="object"&&Object.keys(r).length===0;return n(o.classes)&&n(o.attributes)&&n(o.styles)?null:o}function gl(e){try{let o=e.document.selection,t=o.getFirstPosition();if(!t)return null;let n=t.textNode;if(Po(n)||(n=Po(t.nodeAfter)?t.nodeAfter:o.isCollapsed&&Po(t.nodeBefore)?t.nodeBefore:null),!n)return null;let r=n.getAttribute("htmlSpan"),i=JSON.stringify(r),l=u=>Po(u)&&JSON.stringify(u.getAttribute("htmlSpan"))===i,c=n,a=n;for(;l(c.previousSibling);)c=c.previousSibling;for(;l(a.nextSibling);)a=a.nextSibling;return{range:e.createRange(e.createPositionBefore(c),e.createPositionAfter(a)),valor:r}}catch{return null}}function kt(e){if(!e)return;let o=Io(e);if(o.model||o._saidaSigiloProRegistrada)return;let t=o.dataProcessor?.htmlFilter;!t||typeof t.addRules!="function"||(o._saidaSigiloProRegistrada=!0,t.addRules({elements:{span(n){let r=n.attributes;r&&/(^|\s)sigiloSEI_tarja(\s|$)/.test(r.class??"")&&delete r["data-text"]}}},{applyToAll:!0}))}function fl(e){if(!e)return!1;if(typeof e=="string")return/(^|\s)sigiloSEI_tarja(\s|$)/.test(e);let o=e;return typeof o.indexOf=="function"?o.indexOf(He)!==-1:typeof o.has=="function"?o.has(He):Object.hasOwn(e,He)}function wt(e){if(!e)return;let o=Io(e);if(!o.model||o._saidaSigiloCK5ProRegistrada)return;let t=o.data?.downcastDispatcher;!t||typeof t.on!="function"||(o._saidaSigiloCK5ProRegistrada=!0,t.on("attribute",(n,r,i)=>{if(i?.options?.seiProInterno)return;let l=r?.attributeNewValue;if(!l||typeof l!="object"||!l.attributes||!Object.hasOwn(l.attributes,"data-text")||!fl(l.classes))return;let c={};for(let a of Object.keys(l.attributes))a!=="data-text"&&(c[a]=l.attributes[a]);r.attributeNewValue={...l,attributes:c}},{priority:"high"}))}function bl(e){kt(e),wt(e)}function Me(e,...o){let t=e==="ok"?"check":e==="aviso"?"alerta":"nota",n=e==="ok"?"var(--spro-ok)":e==="aviso"?"var(--spro-aviso)":"var(--spro-destaque)",r=fe(t,15);return r.setAttribute("style",`color:${n};vertical-align:-2px;margin-right:6px;`),f("label",{},r,...o)}var hl=()=>f("br"),ha={id:"sigilo",globais(e){let o=e.adaptador,t=e.win,n=y=>Y(e.doc,y);function r(y,S){let D=e.doc.defaultView?.DOMParser??globalThis.DOMParser,H=new D().parseFromString(`<!doctype html><html><body>${y}</body></html>`,"text/html");return S(H.body),H.body.innerHTML}function i(y){let S=null;return o.transformBodyHtml(y,D=>(S=D,D)),S}let l=(y,S)=>typeof t.randomNumber=="function"?t.randomNumber(y,S):Math.floor(Math.random()*(S-y+1)+y);function c(y,S){if(typeof t.hasSelection=="function"&&!t.hasSelection(y))return n(S),null;let D=o.getSelectedHtml(y);return D||(n(S),null)}function a(y){let S=o.getInstance(y);if(!S)return;if(o.somenteLeitura(S)){o.recusarEscrita();return}let D=Io(S).model;if(D){let B=gl(D);if(B){D.change(G=>{let V=ml(B.valor);V?G.setAttribute("htmlSpan",V,B.range):G.removeAttribute("htmlSpan",B.range)});return}}let H=D?null:o.getSelectionElement(S),O=H?.closest?H.closest(`span.${Ae}`):null;if(O){let B=`seiProUnmark_${Date.now()}`;try{O.setAttribute("data-seipro-unmark",B)}catch{}o.transformBodyHtml(S,G=>r(G,V=>{let W=V.querySelector(`span.${Ae}[data-seipro-unmark="${B}"]`);W&&Et(W)}));return}let $=c(S,"Selecione um texto para adicionar a marca de sigilo.");$!==null&&o.withEdit(S,()=>o.insertHtml(S,`<span class="${Ae}">${$}</span>`))}function u(y){let S=o.getInstance(y);if(!S)return;if(o.somenteLeitura(S)){o.recusarEscrita();return}let D=c(S,"Selecione um texto para tarjar.");D!==null&&(o.withEdit(S,()=>o.insertHtml(S,`<span class="${Ae}">${D}</span>`)),setTimeout(()=>h(null,"apply",!1,!1,S),0))}let s=(y,S)=>y?.querySelector(`#${S}`)??null,g=(y,...S)=>{y&&(y.replaceChildren(...S),y.removeAttribute("hidden"))},x=y=>{y&&(y.replaceChildren(),y.setAttribute("hidden",""))},p=y=>y&&typeof y.querySelector=="function"?y:null;function b(y,S){let D=p(y);if(!D)return;let H=S??o.getInstance();if(!H)return;let O=o.getBodyContainer(H),$=O?O.querySelectorAll(`p span.${Ae}`).length:0;g(s(D,"tabSigilo1_result"),$===0?Me("info",'Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba "Localizar texto" ou adicione manualmente com o bot\xE3o de marca de sigilo da barra de ferramentas.'):Me("info",`${$} ${Oe($,"marca","marcas")} de sigilo ${Oe($,"encontrada","encontradas")} no documento!`))}function d(y){let S=y??o.getInstance();S&&o.transformBodyHtml(S,D=>r(D,H=>{let O=H.querySelectorAll(`.${He}`).length;for(let $ of H.querySelectorAll(".sigiloSEI_sigilo_mark"))$.parentNode?.removeChild($);if(O>0){let $=H.ownerDocument.createElement("p");$.setAttribute("class","sigiloSEI_sigilo_mark"),$.setAttribute("contenteditable","false"),$.setAttribute("style","font-size: 6pt;color: #ccc;font-family: monospace;"),$.textContent=`#_contem_${O}_marcas_sigilo`,H.appendChild($)}}))}function h(y,S,D=!1,H=!1,O){let $=O??o.getInstance();if(!$)return;let B=p(y),G=s(B,"tabSigilo1_result"),V=s(B,"tabSigilo2_result"),W=s(B,"tabSigilo3_result"),_=Io($).model;if(S==="replace"){let C=s(B,"inputSigiloTexto"),m=D||(B?(C?.value??"").trim():""),v;if(m!==""){let P=0;H&&B&&(P=Number.parseInt(V?.querySelector(".count")?.textContent??"0",10)||0);let I=0,k=0;if(o.transformBodyHtml($,M=>r(M,T=>{for(let N of T.querySelectorAll("p")){for(let z of N.querySelectorAll(`span.${Ae}`))To(m,"igm").test(z.textContent??"")&&Et(z);fa(N,m)}I=[...T.querySelectorAll("p")].map(N=>N.textContent).join(" ").match(To(m,"igm"))?.length??0})),_&&I>0){let M=To(m,"i"),T=i($);k=I,I=0,typeof T=="string"&&r(T,L=>{for(let N of L.querySelectorAll(`p span.${Ae}`))M.test(N.textContent??"")&&I++})}if(I===0&&k>0)v=Me("aviso","Texto encontrado, mas o editor n\xE3o manteve a marca de sigilo.");else if(I>0){let M=I+P;v=Me("ok",f("span",{class:"count"},String(M)),` ${Oe(M,"marca","marcas")} ${Oe(M,"adicionada","adicionadas")} com sucesso!`)}else v=Me("info","Nenhum texto encontrado!")}else v=Me("info","Digite um texto para adicionar a marca de sigilo");B&&(g(V,v),x(W),b(B,$))}else if(S==="remove"){let C=0;o.transformBodyHtml($,v=>r(v,P=>{for(let I of P.querySelectorAll(`span.${Ae}`))Et(I),C++;for(let I of P.querySelectorAll(`span.${He}`)){let k=I.getAttribute("data-text");if(typeof k!="string"||k==="")continue;let M=Ee(P.ownerDocument,`<div>${k}</div>`)[0];for(;M?.firstChild;)I.parentNode?.insertBefore(M.firstChild,I);I.parentNode?.removeChild(I),C++}}));let m=C===0?Me("info","Nenhuma marca encontrada!"):Me("ok",`${C} ${Oe(C,"marca","marcas")} ${Oe(C,"removida","removidas")} com sucesso!`);B&&(g(W,m),x(V),b(B,$)),d($)}else if(S==="apply"){bl($);let C=0,m=0;if(o.transformBodyHtml($,v=>r(v,P=>{m=P.querySelectorAll(`span.${He}`).length;for(let I of P.querySelectorAll(`span.${Ae}`))P.contains(I)&&(I.setAttribute("data-text",I.innerHTML),I.textContent=ll.repeat(l(8,15)),I.setAttribute("class",He),C++)})),_&&C>0){let v=i($);typeof v=="string"&&r(v,P=>{C=Math.min(C,Math.max(0,P.querySelectorAll(`span.${He}`).length-m))})}C>0?g(G,Me("ok",`${C} ${Oe(C,"marca","marcas")} ${Oe(C,"tarjada","tarjadas")} com sucesso!`,hl(),`${Oe(C,"Esta marca tarjada poder\xE1 ser revertida","Estas marcas tarjadas poder\xE3o ser revertidas")} na aba "Remover marcas" somente enquanto aberto este editor de documentos.`)):B&&b(B,$),B&&(x(V),x(W)),d($)}else if(S==="email_cpf"){B&&x(V);let m=o.getBodyContainer($)?.textContent??"",v=ga(ul(m)),I=[...ga(pl(m)),...v];if(I.length===0){B&&g(V,Me("info","Nenhum dado pessoal (e-mail ou CPF) encontrado!"));return}for(let k of I)h(B,"replace",k,!0,$)}}function A(y){let S=y??o.getInstance();if(!S)return;let D=o.getSelectedText(S)||"",H=f("input",{type:"text",id:"inputSigiloTexto",value:D,placeholder:"Texto a marcar",autocomplete:"off",spellcheck:"false"}),O=(v,P,I,k=!0)=>f("button",{type:"button",id:v,class:k?"spro-botao primario":"spro-botao",onclick:I},P),$=v=>f("div",{id:v,class:"spro-nota",hidden:""}),B=f("div",{id:"dialogSigiloPro",class:"spro-form"}),G=v=>()=>h(B,v,!1,!1,S),V=re(ce("Marque de uma vez, em todo o documento, um texto ou os dados pessoais encontrados nele."),j("Localizar texto e adicionar marca de sigilo",{para:"inputSigiloTexto",dica:"Cada ocorr\xEAncia do texto, no documento inteiro, recebe a marca de sigilo."},f("div",{class:"spro-linha"},H,O("btnSigiloReplace","Adicionar",G("replace")))),j("Localizar dados pessoais",{dica:"Procura e-mails e CPFs em todo o documento e adiciona a marca de sigilo a cada um."},f("div",{},O("btnSigiloEmailCpf","Localizar dados pessoais",G("email_cpf"),!1))),$("tabSigilo2_result")),W=re(ce("A tarja cobre com blocos pretos todo o texto que est\xE1 com marca de sigilo."),j("Aplicar tarja de sigilo no documento",{},f("div",{},O("btnSigiloApply","Aplicar tarja",G("apply")))),$("tabSigilo1_result")),_=re(ce("Tira as marcas de sigilo e devolve o texto original das tarjas."),j("Remover todas as marcas de sigilo do documento",{},f("div",{},O("btnSigiloRemove","Remover marcas",G("remove")))),$("tabSigilo3_result"),f("div",{id:"tabSigilo3_info",class:"spro-nota"},Me("aviso","Marcas de sigilo j\xE1 tarjadas n\xE3o poder\xE3o ser revertidas ap\xF3s salvar e abandonar este editor de documentos."))),C=re(ce("Acesse o guia r\xE1pido sobre como ",f("a",{href:cl,target:"_blank",rel:"noopener noreferrer",class:"linkDialog"},"adicionar marca de sigilo e tarjas pretas de confidencialidade"),".")),m=we("sigilo",[["localizar","1. Localizar texto e dados pessoais"],["tarjar","2. Tarjar marcas de sigilo"],["remover","Remover marcas"],["guia","Guia r\xE1pido"]],{localizar:V,tarjar:W,remover:_,guia:C});B.append(f("div",{id:"sigiloTabs"},m.barra,f("div",{},...m.paineis))),te(e.doc,{titulo:"Gerenciar marcas de sigilo do documento",largura:720,conteudo:B}),m.selecionar("localizar"),b(B,S)}function E(y){let S=o.getInstance(y);S&&A(S)}function w(){}return{getMarkSigilo:a,getTarjaSigilo:u,getBoxSigilo:E,getDialogSigilo:w,openDialogSigilo:A,actionsMarkSigilo:h,registrarSaidaSigiloCK4Pro:kt,registrarSaidaSigiloCK5Pro:wt,rodapeSigiloMark:d,htmlTabSigiloResult:b}},iniciar(e){if(e.adaptador.versao===5)wt(e.adaptador.getInstance());else for(let o of e.adaptador.getAllInstances())kt(o)}};var va=["seiSlim","seiSlim_parent","seiSlim_view"],_o="seiSlim_editor";function xa(e,o){for(let t of e.doc.querySelectorAll(".getNewStyleButton"))t.classList.toggle("cke_button_on",o),t.classList.toggle("cke_button_off",!o)}function ya(e,o){if(o){for(let t of e.doc.head.querySelectorAll('link[data-style="seipro-fonticon"], style[data-style="seipro-fonticon"]'))t.remove();e.win.insertFontIcon?.("head"),e.doc.body.classList.add(...va),(e.win.localStorage?.getItem("darkModePro")||e.doc.documentElement.getAttribute("data-spro-tema")==="escuro")&&e.doc.body.classList.add("dark-mode")}else e.doc.body.classList.remove(...va),e.win.localStorage?.getItem("seiSlim")||e.doc.body.classList.remove("dark-mode")}var Ea={id:"style-editor",iniciar(e){e.win.addEventListener("storage",o=>{let t=o;if(t.key!==_o)return;let n=!!t.newValue;xa(e,n),ya(e,n)})},globais(e){function o(t){t==="set"?e.win.localStorage.setItem(_o,"true"):e.win.localStorage.removeItem(_o),ya(e,t==="set")}return{getBoxStyleEditor(t){let n=!e.win.localStorage.getItem(_o);xa(e,n),o(n?"set":"remove")},updateStyleEditor:o}}};var vl="seipro-bookmark",ka="bookmark-",xl=e=>e.replace(/^\./,""),wa={id:"sumario",globais(e){let o=e.adaptador,t=a=>Y(e.doc,a);function n(a){let u=new Set;for(let s of o.findInBody(a,"p")){let g=(s.getAttribute("class")??"").trim().split(/\s+/)[0];g&&u.add(g)}return[...u]}function r(a,u,s){let g=a.map(x=>f("option",{value:`.${x}`,...x===s?{selected:"selected"}:{}},x));return u?[f("option",{value:""},"(nenhum)"),...g]:g}function i(a,u,s){let g=e.doc.querySelector(`select#${u}`);g&&g.replaceChildren(...s.map(([x,p])=>f("option",{value:p},x)))}function l(a,u,s){let g=s??o.getInstance();if(!g)return!1;let x=new Set(u.map(xl).filter(Boolean));if(!x.size)return!1;if(o.somenteLeitura(g))return o.recusarEscrita(),!1;let p=o.findInBody(g,"p").filter(h=>(h.textContent??"").trim()!==""&&[...h.classList].some(A=>x.has(A)));if(!p.length)return t("Nenhum par\xE1grafo do documento tem os estilos escolhidos."),!1;let b='<p class="Texto_Alinhado_Esquerda"><strong>SUM\xC1RIO</strong></p>',d=0;return o.withEdit(g,()=>{for(let A of p){let E=Co(A,ka,o.versao===5)??`${ka}${Le(16)}`;Ao(e,g,A,E,vl)&&(b+=`<p class="Texto_Alinhado_Esquerda"><a href="#${ne(E)}">${ne((A.textContent??"").trim())}</a></p>`,d+=1)}if(!d)return;let h=o.versao===5?o.getSelectionParagraph(g):null;h?o.insertHtmlBefore(g,h,b):o.insertHtml(g,b)}),d?!0:(t("N\xE3o foi poss\xEDvel criar o sum\xE1rio: nenhum t\xEDtulo aceitou a \xE2ncora."),!1)}function c(a,u){let s=u??o.getInstance();if(!s)return;let g=n(s);if(!g.length){t("O documento n\xE3o tem par\xE1grafos com estilo para montar o sum\xE1rio.");return}let x=(A,E,w)=>f("select",{id:A},...r(g,E,w)),p=x("listStyle1",!1,"Item_Nivel1"),b=x("listStyle2",!0,"Item_Nivel2"),d=x("listStyle3",!0,"Item_Nivel3"),h=te(e.doc,{titulo:"Inserir sum\xE1rio",conteudo:Be(Ce("Estilo do T\xEDtulo 1",p,{dica:"Obrigat\xF3rio. Cada par\xE1grafo com este estilo vira um item do sum\xE1rio."}),Ce("Estilo do T\xEDtulo 2",b,{opcional:!0}),Ce("Estilo do T\xEDtulo 3",d,{opcional:!0}),f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let A=[p.value,b.value,d.value].filter(E=>E!=="");if(!A.length){t("Escolha o estilo do T\xEDtulo 1.");return}l(null,[...new Set(A)],s)&&h.fechar()}},"Inserir")))});p.focus({preventScroll:!0})}return{getSumarioDocumento(a){let u=o.getInstance(a);u&&c(null,u)},getListStylesDocumento(a,u){let s=u??o.getInstance();return s?r(n(s),!1):[]},updateSelectDialog:(a,u)=>i(null,a,u),getDialogSumarioDocumento:a=>c(null,a),getDialogSumarioDocumento_:()=>c(null),insertSumarioDocumento:(a,u)=>l(null,a,u)}}};var eo={color1:{light:"#dddddd",dark:"#646464"},color2:{light:"#e2daf1",dark:"#7b54c0"},color3:{light:"#eed7e9",dark:"#b1489c"},color4:{light:"#f2d7dc",dark:"#c2495e"},color5:{light:"#ecdacf",dark:"#a85723"},color6:{light:"#dfdfc8",dark:"#6e6b06"},color7:{light:"#d1e2cc",dark:"#2f7c16"},color8:{light:"#c9e4d7",dark:"#0a824a"},color9:{light:"#cae2e6",dark:"#0e7a8b"},color10:{light:"#d4def0",dark:"#3b68b9"}};function At(e,o=80){return{tableStyle1:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle2:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light};`,tr:["",`background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle3:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle4:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle5:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:"border: none;",tr:"border: none;",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle6:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:`background-color: ${e.light};`,td:"",tdPrimeira:`background-color: ${e.light}; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle7:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle8:{table:`border-collapse:collapse; border-bottom: 1px solid ${e.dark}; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:${o}%;`,trCabecalho:`border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:`border-left: 1px solid ${e.dark};`,tdPrimeira:"border-right: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle9:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle10:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle11:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%; border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important`,tr:"border: none;",tdCabecalho:`background-color: ${e.dark};`,td:`background-color: ${e.light}; border-bottom: 1px solid #fff; border-right: 1px solid #fff`,tdPrimeira:`color: #fff;background-color: ${e.dark}; border: 1px solid ${e.dark}; border-bottom: 1px solid #fff !important;`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle12:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:`background-color: ${e.light}; border-bottom: 3px solid ${e.dark};`,tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle13:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto ;width:${o}%; border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:"border: none;",tdCabecalho:"",td:`border: 1px solid ${e.dark};`,tdPrimeira:`border-left: none;border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle14:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle15:{table:`border-collapse:collapse;margin-left:auto;margin-right:auto;width:${o}%;border-left: none; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:`border-bottom: 1px solid ${e.dark};`,tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle16:{table:`border-collapse:collapse; border-color:${e.dark}; margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"color: #fff;",tr:"",tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle17:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto;width:${o}%;`,trCabecalho:"color: #fff;",tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:`background-color: ${e.dark};`,td:"border: none;",tdPrimeira:"border: none;",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle18:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto; width:${o}%;border: none;`,trCabecalho:`color: #fff; border: 1px solid ${e.dark}; border-bottom: 3px solid #fff !important`,tr:[`border: none; background-color: ${e.light};`,`color: #fff; border: none; background-color: ${e.dark};`],tdCabecalho:`background-color: ${e.dark};`,td:"border:none;",tdPrimeira:"border: none; border-right: 3px solid #fff",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle19:{table:`border-collapse:collapse; margin-left:auto; margin-right:auto;width:${o}%; border-left: none;border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark}; border-right: none;`,trCabecalho:`background-color: ${e.light}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle20:{table:`border-collapse:collapse; margin-left:auto;margin-right:auto;width:${o}%;border: none;`,trCabecalho:`background-color: ${e.light}; border-top: 1px solid ${e.dark}; border-bottom: 1px solid ${e.dark};`,tr:["border: none;",`border: none; background-color: ${e.light};`],tdCabecalho:"",td:"",tdPrimeira:`border-left: none; border-top: none;border-bottom: none;border-right: 1px solid ${e.dark};`,pCabecalho:"Texto_Centralizado",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0},tableStyle21:{table:`border-collapse:collapse; border-color:${e.dark};margin-left:auto; margin-right:auto; width:${o}%;`,trCabecalho:"",tr:"",tdCabecalho:"",td:"",tdPrimeira:"",pCabecalho:"Tabela_Texto_Alinhado_Esquerda",p:"Tabela_Texto_Alinhado_Esquerda",cabecalho:!0}}}function Mo(e){let o={};for(let t of e.split(";")){let n=t.indexOf(":");if(n<=0)continue;let r=t.slice(0,n).trim(),i=t.slice(n+1).trim();r&&i&&(o[r]=i)}return o}function yl(e,o,t){let n=[];for(let r=0;r<o;r+=1){let i=r===0,l=i?e.trCabecalho:Array.isArray(e.tr)?r%2===0?e.tr[1]:e.tr[0]:e.tr,c=Array.from({length:t},(a,u)=>({td:i?e.tdCabecalho:u===0?e.tdPrimeira:e.td,p:i?e.pCabecalho:e.p}));n.push({tr:l,celulas:c})}return{linhas:n}}var Ct=e=>Array.from(e.children).filter(o=>o.tagName==="TD"||o.tagName==="TH"),El=e=>Array.from(e.querySelectorAll("tr")).filter(o=>o.closest("table")===e);function Aa(e,o,t,n,r){let i=e.adaptador,l=El(t),c=yl(n,l.length,Math.max(0,...l.map(a=>Ct(a).length)));if(i.versao===5){let a=o,u=a.plugins?.has("GeneralHtmlSupport")?a.plugins.get("GeneralHtmlSupport"):null,s=Ie(a,t.closest("figure")??t);if(!u||!s)return Y(e.doc,"N\xE3o foi poss\xEDvel aplicar o estilo: a tabela n\xE3o foi reconhecida pelo editor."),!1;if(Je(e,s))return i.recusarEscrita(),!1;let g=(x,p,b)=>{let d=Object.keys(Mo(p.getAttribute("style")??""));d.length&&b&&typeof u.removeModelHtmlStyles=="function"&&u.removeModelHtmlStyles(x,d,b)};return i.withEdit(o,()=>{g("table",t,s),u.setModelHtmlStyles("table",Mo(n.table),s),l.forEach((x,p)=>{let b=c.linhas[p];if(!b)return;let d=Ie(a,x);g("tr",x,d),d&&u.setModelHtmlStyles("tr",Mo(b.tr),d),Ct(x).forEach((h,A)=>{let E=Ie(a,h);if(E){g("td",h,E),u.setModelHtmlStyles("td",Mo(b.celulas[A]?.td??""),E);for(let w of E.getChildren())w.name==="paragraph"&&a.model.change(y=>y.setAttribute("estilo",b.celulas[A]?.p,w))}})}),n.cabecalho&&a.model.change(x=>x.setAttribute("headingRows",1,s))}),!0}return i.somenteLeitura(o)?(i.recusarEscrita(),!1):(i.withEdit(o,()=>{let a=t.ownerDocument;if(t.setAttribute("style",n.table),l.forEach((u,s)=>{let g=c.linhas[s];g&&(u.setAttribute("style",g.tr),Ct(u).forEach((x,p)=>{x.setAttribute("style",g.celulas[p]?.td??"");let b=g.celulas[p]?.p??"",d=Array.from(x.querySelectorAll("p")).filter(h=>h.closest("td, th")===x);if(d.length)for(let h of d)h.setAttribute("class",b);else{let h=a.createElement("p");h.setAttribute("class",b),h.append(...Array.from(x.childNodes)),x.append(h)}}))}),n.cabecalho&&l[0]&&!t.querySelector("thead")){let u=a.createElement("thead");u.append(l[0]),t.prepend(u)}r?.aoFinalCk4?.(t)}),!0)}var Ca="color1",kl="Clique na tabela que deseja aplicar o estilo!",St="dark-mode-color-";function wl(e){let o=Number.parseInt(e.slice(1,7),16);return Math.round(((o>>16&255)*299+(o>>8&255)*587+(o&255)*114)/1e3)}function Al(e){for(let o of e.querySelectorAll("tr, td")){let t=/background-color:\s*(#[0-9a-fA-F]{6})\b/.exec(o.getAttribute("style")??"")?.[1];t&&(o.classList.remove(`${St}black`,`${St}white`),o.classList.add(`${St}${wl(t)>125?"black":"white"}`))}}var Sa={id:"table-styles",globais(e){let o=e.adaptador,t=a=>o.getSelectionElement(a)?.closest("table")??null;function n(a,u){let s=a.querySelector("#addEstiloTabela");s&&u&&/^color\d+$/.test(u)&&(s.className=`spro-opcoes grade ${u}`)}function r(a,u,s,g=!0,x){let p=s??o.getInstance();if(!p||!u)return;let[b,d,h]=u,A=eo[d],E=Number(h),w=A&&Number.isFinite(E)?At(A,E)[b]:void 0,y=x?.isConnected?x:x?null:t(p);if(w){if(!y){Y(e.doc,"A tabela n\xE3o est\xE1 mais no documento.");return}Aa(e,p,y,{...w,cabecalho:g},{aoFinalCk4:Al})}}function i(){let a=Object.keys(eo),u=Object.keys(At(eo[Ca])),s=f("div",{id:"selectColorTabela",class:"spro-opcoes",role:"radiogroup","aria-label":"Cor da tabela"},...a.map((p,b)=>f("label",{class:"spro-opcao",for:`colorStyle${b+1}`,title:`Varia\xE7\xE3o ${b+1}`},f("input",{type:"radio",name:"colorStyle","data-colorid":p,id:`colorStyle${b+1}`,value:`colorStyle${b+1}`,...b===0?{checked:"checked"}:{}}),f("span",{class:"spro-amostra"},f("span",{style:`background-color: ${eo[p]?.light}`}),f("span",{style:`background-color: ${eo[p]?.dark}`}))))),g=f("div",{id:"addEstiloTabela",class:`spro-opcoes grade ${Ca}`,role:"radiogroup","aria-label":"Estilo da tabela"},...u.map((p,b)=>{let d=b+1;return f("label",{class:"spro-opcao",for:`tableStyle${d}`,title:`Estilo ${d}`},f("input",{type:"radio",name:"tableStyle",id:`tableStyle${d}`,value:`tableStyle${d}`,...b===0?{checked:"checked"}:{}}),f("a",{class:"iconSelectStyleTable",style:`background-position-y: -${d*43}px`}))})),x=f("input",{type:"number",id:"addEstiloTableWidth",max:"100",step:"5",min:"5"});return re(j("Cor",{},s),j("Estilo",{},g),le("duas",j("Largura da tabela",{para:"addEstiloTableWidth"},to(x,"%")),j("Cabe\xE7alho",{},ge({id:"addEstiloTableHeader",checked:"checked"},"Primeira linha como cabe\xE7alho"))))}function l(a){try{let u=g=>Number.parseFloat(g?e.win.getComputedStyle(g).width:""),s=Math.round(100*u(a)/u(a?.parentElement??null));return Number.isFinite(s)?Math.min(100,Math.max(5,s)):80}catch{return 80}}function c(a,u){let s=u??o.getInstance();if(!s)return;let g=t(s),x=i(),p=x.querySelector("#addEstiloTableWidth");p&&(p.value=String(l(g)));for(let d of x.querySelectorAll('input[name="colorStyle"]'))d.addEventListener("change",()=>n(x,d.getAttribute("data-colorid")));let b=te(e.doc,{titulo:"Inserir estilo \xE0 tabela",largura:660,conteudo:f("div",{class:"spro-form"},x,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:()=>{let d=x.querySelector('input[name="tableStyle"]:checked')?.value,h=x.querySelector('input[name="colorStyle"]:checked')?.getAttribute("data-colorid"),A=x.querySelector("#addEstiloTableWidth")?.value,E=x.querySelector("#addEstiloTableHeader:checked")!==null;!d||!h||!A||(r(null,[d,h,A],s,E,g),b.fechar())}},"Aplicar")))})}return{getSyleSelectedTable(a){let u=o.getInstance(a);u&&(t(u)?c(null,u):Y(e.doc,kl))},changeColorTable(a){n(e.doc,a?.getAttribute("data-colorid")??null)},getDialogSyleTable(){},buildHtmlSyleTable:i,openDialogSyleTable:a=>c(null,a),getSyleTable(a){let u=o.getInstance(a);u&&o.withEdit(u,()=>{})},setSyleTable:(a,u)=>r(null,a,u)}}};var Pa=/^[0-9A-Za-z-]+$/,Cl="O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es!",Sl=/^https?:\/\/tinyurl\.com\/[0-9A-Za-z-]+$/,Ta={id:"tiny-url",globais(e){let o=l=>Y(e.doc,l),t=l=>(e.fetch??e.win.fetch.bind(e.win))(l);async function n(l,c,a,u){let s=new URLSearchParams({url:l});c!==""&&s.set("alias",c);let g;try{g=await t(`https://tinyurl.com/api-create.php?${s}`)}catch{return o("Erro: n\xE3o foi poss\xEDvel gerar o link curto"),!1}if(g.status===400)return o("Erro: Nenhuma link gerado"),!1;if(g.status===422)return o("Erro: O nome personalizado j\xE1 existe. Insira outro."),!1;let x=(await g.text()).trim();if(g.status!==200||!Sl.test(x))return o("Erro: Nenhuma link gerado"),!1;if(a==="setinput")return e.win.setInputTinyUrl?.(x),!0;let p=u??e.adaptador.getInstance();if(!p)return!1;let b=`<a href="${ne(x)}" class="ancoraSei" target="_blank">${ne(x)}</a>`;return e.adaptador.withEdit(p,()=>e.adaptador.insertHtml(p,b)),!0}function r(l){let c=e.adaptador.getInstance(l);if(!c)return;let a=f("input",{type:"text",id:"urlTiny",placeholder:"https://exemplo.gov.br/endereco-muito-longo",autocomplete:"off"}),u=f("input",{type:"text",id:"aliasTiny",placeholder:"ex.: relatorio-2026",autocomplete:"off"}),s=f("p",{id:"tinyResult",class:"spro-dica"}),g=String(e.win.getSelection?.()??"").trim();g!==""&&ve(g)&&(a.value=g),u.addEventListener("input",()=>{s.replaceChildren();let p=u.value;p!==""&&(Pa.test(p)?s.append(`Resultado: https://tinyurl.com/${p}`):s.append(f("span",{class:"spro-erro"},"O nome personalizado deve conter apenas letras, n\xFAmeros e travess\xF5es.")))});let x=te(e.doc,{titulo:"Gerar link curto do TinyURL",conteudo:Be(Ce("Link que deseja encurtar",a),Ce("Nome personalizado",u,{opcional:!0,dica:"Letras, n\xFAmeros e travess\xF5es, com 5 caracteres ou mais."}),s,f("div",{class:"spro-dialogo-rodape"},f("button",{type:"button",class:"spro-botao primario",onclick:async()=>{let p=a.value.trim(),b=u.value.trim();if(p===""||!ve(p))return o("Digite um link v\xE1lido!");if(b!==""&&!Pa.test(b))return o(Cl);if(b!==""&&b.length<5)return o("O nome personalizado deve ter mais de 4 (quatro) caracteres");await n(p,b,"insert",c)&&x.fechar()}},"Inserir")))})}return{getTinyUrl:r,ajaxTinyUrl:(l,c,a)=>n(l,c,a)}}};var Pt=[Or,Xn,ma,lr,ir,Vt,Rr,Ea,aa,Lr,Ta,bn,br,Tn,Sa,wa,xr,gn,ur,nn,Yn,la,Jn,oa,kn,Er,dn,ha,Rn,pa,ln,tt,Dn,gr,Zt,Tr];function Ia(e,o,t){let n=e,r=[],i=[];for(let l of o){let c=!0;try{for(let[a,u]of Object.entries(l.globais(t))){if(n[a]!==void 0){c=!1,i.push({id:l.id,erro:new Error(`global ja definido: ${a}`)});continue}n[a]=u}}catch(a){c=!1,i.push({id:l.id,erro:a})}c&&r.push(l.id);try{n.SeiProEditorAdapter?.registerFeature?.({id:l.id})}catch{}}return{instalados:r,falhas:i}}function _a(e,o){let t=[];for(let n of e)try{n.iniciar?.(o)}catch(r){t.push({id:n.id,erro:r})}return t}var Ma=`/*
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
`;var La=`/*
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
`;Fo(`${Ma}
${La}`);var Il=0,Tt=new Map;function _l(e){return e?Array.isArray(e)?e:Object.entries(e).map(([o,t])=>({text:o,click:()=>t.call(null)})):[]}function Ml(e){for(let o of[...e.querySelectorAll("script")])o.remove();for(let o of[e,...e.querySelectorAll("*")])for(let t of[...o.attributes])/^on/i.test(t.name)&&o.removeAttribute(t.name)}function It(e){Ue(e);for(let o of e.querySelectorAll("input.spro-intervalo"))o.getAttribute("data-spro-ligado")||(o.setAttribute("data-spro-ligado","1"),o.addEventListener("input",()=>Ue(o.parentElement??e)));for(let o of e.querySelectorAll(".spro-cor > input[type='color']"))if(!o.getAttribute("data-spro-ligado")){o.setAttribute("data-spro-ligado","1");for(let t of["input","change"])o.addEventListener(t,()=>Ue(o.parentElement??e))}for(let o of e.querySelectorAll("[data-spro-abas]")){if(o.getAttribute("data-spro-ligado"))continue;o.setAttribute("data-spro-ligado","1");let t=[...o.querySelectorAll("[role='tab'][data-aba]")],n=[...o.querySelectorAll("[data-painel]")],r=l=>{for(let c of t){let a=c.getAttribute("data-aba")===l;c.setAttribute("aria-selected",String(a)),c.setAttribute("tabindex",a?"0":"-1")}for(let c of n)c.getAttribute("data-painel")===l?c.removeAttribute("hidden"):c.setAttribute("hidden","")};t.forEach((l,c)=>{l.addEventListener("click",()=>r(l.getAttribute("data-aba")??"")),l.addEventListener("keydown",a=>{let u=a.key,s=u==="ArrowRight"?1:u==="ArrowLeft"?-1:0,g=t[(c+s+t.length)%t.length];!s||!g||(a.preventDefault(),r(g.getAttribute("data-aba")??""),g.focus())})});let i=t.find(l=>l.getAttribute("aria-selected")==="true")??t[0];i&&r(i.getAttribute("data-aba")??"")}}function Ra(e,o,t){let n=t.id??`seiProDialog_${++Il}`;Tt.get(n)?.fechar();let r=f("div",{id:n,class:"spro-form spro-legado"}),i=new e.DOMParser().parseFromString(`<!doctype html><html><body>${t.html??""}</body></html>`,"text/html");Ml(i.body),r.append(...[...i.body.childNodes].map(p=>o.importNode(p,!0)));let l=e.jQuery??e.$,c=l?l(r):r,a=()=>x.fechar();c.dialog=p=>((p==="close"||p==="destroy")&&a(),c);let u=_l(t.buttons),s=u.length?f("div",{class:"spro-dialogo-rodape"},...u.map(p=>f("button",{type:"button",class:p.primary?"spro-botao primario":"spro-botao",onclick:()=>p.click?.call(r,c)},p.text??""))):null,g=typeof t.width=="number"?t.width:void 0,x=te(o,{titulo:t.title??"",...g?{largura:g}:{},conteudo:f("div",{},r,s),aoFechar:()=>{Tt.delete(n),t.onClose?.()}});return Tt.set(n,x),It(r),t.onOpen?.(c),c}var Da="__seiProEditorTs",_t=window;if(!_t[Da]){_t[Da]=!0,_t.SeiProUi={abrirHtml:t=>Ra(window,document,t),ligar:It};let e=qt(window);e.aoRecusarEscrita(()=>Y(document,"Esta se\xE7\xE3o do documento \xE9 somente leitura."));let o={adaptador:e,doc:document,win:window,base:document.currentScript?.getAttribute($t)??"",checkOpcao:t=>Ft(t),verifyOpcao:t=>jt(t)};for(let t of Ia(window,Pt,o).falhas)console.warn(`[SEIPro] recurso ${t.id} nao instalado:`,t.erro);e.waitReady(2e4).then(()=>{for(let t of _a(Pt,o))console.warn(`[SEIPro] recurso ${t.id} falhou ao iniciar:`,t.erro)}).catch(t=>console.warn("[SEIPro] editor nao detectado:",t))}})();
