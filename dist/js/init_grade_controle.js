/* GERADO por grade-controle/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{function Si(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function Dr(o,e){return{obter:async(r=null)=>await o.get(r),gravar:async r=>{await o.set(r)},remover:async r=>{await o.remove(r)},chaves:typeof o.getKeys=="function"?async()=>await o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Si(a))};try{chrome.storage.onChanged.addListener(t)}catch{}return()=>{try{chrome.storage.onChanged.removeListener(t)}catch{}}}}}var oa=o=>String(o).padStart(2,"0");function Jo(o=new Date){return`${o.getFullYear()}-${oa(o.getMonth()+1)}-${oa(o.getDate())}`}function Oe(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!e)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(e[1]),Number(e[2])-1,Number(e[3]),12)}function _o(o,e){return Math.round((Oe(e).getTime()-Oe(o).getTime())/864e5)}function vo(o){let[e,r,t]=o.split("-");return`${t}/${r}/${e}`}function ea(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function ra(o,e){let r=ea(o,e);return!(r===!1||r===0||r==="")}function ta(o,e){let r=ea(o,e);return r===!0||r===1||r==="1"}function aa(o){try{return!!o.getItem("darkModePro")}catch{return!1}}function na(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function sa(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function"||!o.documentElement)return()=>{};let t=new r(e);return t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>t.disconnect()}function ia(o=crypto){if(typeof o.randomUUID=="function")return o.randomUUID();let e=o.getRandomValues(new Uint8Array(16));e[6]=(e[6]??0)&15|64,e[8]=(e[8]??0)&63|128;let r=[...e].map(t=>t.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var ca=`/*
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
`;function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var xo={fill:"currentColor",stroke:"none"},la="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",da={estrela:[["path",{d:la}]],estrelaCheia:[["path",{d:la,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...xo}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...xo}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...xo}],["circle",{cx:"12",cy:"12",r:"1.4",...xo}],["circle",{cx:"19",cy:"12",r:"1.4",...xo}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...xo}],["circle",{cx:"15",cy:"6",r:"1.3",...xo}],["circle",{cx:"9",cy:"12",r:"1.3",...xo}],["circle",{cx:"15",cy:"12",r:"1.3",...xo}],["circle",{cx:"9",cy:"18",r:"1.3",...xo}],["circle",{cx:"15",cy:"18",r:"1.3",...xo}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Nd=Object.keys(da);function q(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of da[o]){let c=r.createElementNS(t,s);for(let[l,u]of Object.entries(i))c.setAttribute(l,u);a.append(c)}return a}function ua(o,e,r,t=1e4){let a=URL.createObjectURL(new Blob([e],{type:r})),n=d("a",{href:a,download:o});document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),t).unref?.()}var T=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Lo(o){if(o instanceof T)return o;if(o instanceof DOMException&&o.name==="AbortError")return new T("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new T("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}var Mi={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function j(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Mi[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var pa={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var ma=null;function Le(o){return ma?ma(o):new DOMParser().parseFromString(o,"text/html")}function H(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var Di={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Cr(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Di[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function Ie(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=Cr(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function fo(o,e){let r=[],t=new RegExp(`\\b${e}\\(`,"g");for(let a of o.matchAll(t)){let[n]=Ie(o,a.index+a[0].length);r.push(n)}return r}function V(o){return typeof o=="string"?j(o):o==null?"":String(o)}var Ci=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function ko(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Ci))e.add(r[0]);return[...e]}function Y(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function no(o,e,r={}){let t=Array.isArray(o)?o:ko(o);for(let a of t){let n=Y(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function fa(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=ko(r).filter(s=>Y(s).get("acao")===e),n=(t.length?t:ko(o.html).filter(s=>Y(s).get("acao")===e)).sort((s,i)=>[...Y(s).keys()].length-[...Y(i).keys()].length)[0];if(!n)throw new T("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function ki(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=Ie(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Cr(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Oi(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=Ie(o,r.index+r[0].length);e.push({tipo:V(t[0]),idPai:V(t[2]),href:V(t[3]),titulo:V(t[5]),icone:V(t[6]),extra:t[8]==null?void 0:V(t[8])})}return e}function ga(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function ha(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>V(e[1])))]}function ba(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var Li=/\s*\(\d{5,}\)\s*$/;function Ii(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=V(r.args[1]),a=V(r.args[5]),n=V(r.args[7]),s=(r.props.src??"").replace(/&amp;/g,"&"),i=e.find(p=>p.tipo==="ASSINATURA"&&p.idPai===t),{nivel:c,hipotese:l}=ga(e,t),u=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:V(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(Li,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(s)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:u,nivel:c,hipotese:l,assinado:!!i,assinaturas:i?i.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(p=>p.tipo==="UNIDADE_GERADORA"&&p.idPai===t)?.extra,link:V(r.args[3]).replace(/&amp;/g,"&"),src:s,acoes:ko(r.props.acoes??""),botoes:ha(r.props.acoes??""),funcoes:ba(r.props.acoes??"")}})}function Ni(o){let e=o.html,r=ki(e),t=Oi(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new T("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=V(a.args[1]),s=ga(t,n),i=Ii(r,t);return{idProcedimento:n,protocolo:V(a.args[5])||V(a.args[15]),tipo:V(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:ko(a.props.acoes??""),botoesProcesso:ha(a.props.acoes??""),funcoesProcesso:ba(a.props.acoes??""),linkProcesso:V(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:ko(e),pagina:o}}async function va(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new T("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=no(t.html,"procedimento_visualizar")&&ko(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Ni(t)}function yo(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?no(t.acoes,e):null}return no(o.acoesProcesso,e)??no(o.links,e,{id_procedimento:o.idProcedimento})}function uo(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var de={publico:"0",restrito:"1"},Ne={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function ue(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(j(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Ea="\xA5",kr="\xB1";function xa(o){return o.map(e=>`${e.id}${kr}${e.texto}`).join(Ea)}function Ti(o){return o?o.split(Ea).map(e=>{let[r,...t]=e.split(kr);return{id:r,texto:t.join(kr)}}):[]}function Aa(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var B=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=$i(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new T("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,H(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${ya(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??H(t),texto:H(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=to(r),n=t.find(s=>s.valor===r)??t.find(s=>to(s.texto)===a)??Or(t.filter(s=>to(s.texto).includes(a)));if(!n)throw new T("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Ti(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new T("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:xa(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new T("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new T("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new T("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${H(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??Or([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??H(r)??e]:[e,e]}hiddenDaLupa(e){let r=Aa(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Aa(this.pagina.html)){let t=this.elemento.querySelector(`select#${ya(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:H(n)}));(this.valor(r)??"")||this.definir({[r]:xa(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function $i(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(l=>l.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let l of c)e.push({nome:t,valor:l.getAttribute("value")??H(l)})}}return e}function to(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Lr(o,e,r){let t=to(e),a=o.find(n=>n.id===e)??o.find(n=>to(n.texto)===t)??Or(o.filter(n=>to(n.texto).includes(t)));if(!a)throw new T("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function Or(o){return o.length===1?o[0]:void 0}function ya(o){return o.replace(/([^\w-])/g,"\\$1")}var Ri={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Te(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Ri[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var zi=/[A-Za-z0-9\-_.*]/;function Pa(o){let e="";for(let r of o)r===" "?e+="+":zi.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Sa(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${Pa(Te(r))}=${Pa(Te(t??"",a))}`}).join("&")}function wa(o){let e=r=>encodeURIComponent(Te(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var Ma="application/x-www-form-urlencoded";function Ir(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=pa[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var Da="application/x-www-form-urlencoded; charset=ISO-8859-1";function Nr(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let s of o.matchAll(a))n.set(s[1],s[2]);return n}async function _i(o,e,r){let t=yo(e,"documento_escolher_tipo");if(!t)throw new T("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await B.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=B.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function qi(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,H(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=Y(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,H(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Ca(o,e,r){let t=await o.arvore(e,{sinal:r});return qi((await _i(o,t,r)).pagina)}var ka={tipos_processo:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selTipoProcedimento"},hipoteses_legais:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selHipoteseLegal"},usuarios:{acao:"procedimento_atribuicao_cadastrar",form:"#frmAtividadeAtribuir",campo:"selAtribuicao"},marcadores:{acao:"andamento_marcador_gerenciar",form:"#frmAndamentoMarcadorCadastro",campo:"selMarcador"},grupos_acompanhamento:{acao:"acompanhamento_gerenciar",form:"#frmAcompanhamentoCadastro",campo:"selGrupoAcompanhamento"}};async function Oa(o,e,r,t={}){let a;if(e==="tipos_documento")a=(await Ca(o,r,t.sinal)).map(s=>({id:s.id,nome:s.nome}));else{let s=ka[e];if(!s)throw new T("ARGUMENTO_INVALIDO",`Lista desconhecida: ${e}.`,Object.keys(ka).concat("tipos_documento").join(" | "));let i=await o.arvore(r,{sinal:t.sinal}),c=yo(i,s.acao);if(!c)throw new T("SEI_ACAO_INDISPONIVEL",`Para listar ${e} use um processo aberto na sua unidade.`);if(e==="marcadores"&&(c=no((await o.http.obter(c,{sinal:t.sinal,aceitarValidacao:!0})).html,"andamento_marcador_cadastrar"),!c))throw new T("SEI_VERSAO_NAO_SUPORTADA","Tela de marcadores n\xE3o reconhecida.");let l=await B.abrir(o.http,c,s.form,{sinal:t.sinal,aceitarValidacao:!0});a=e==="hipoteses_legais"?(await ue(o,l,"1",t.sinal)).map(u=>({id:u.id,nome:u.texto})):l.opcoes(s.campo).filter(u=>u.valor&&u.valor!=="null"&&u.texto).map(u=>({id:u.valor,nome:u.texto}))}let n=t.filtro?to(t.filtro):"";return n?a.filter(s=>to(s.nome).includes(n)):a}function La(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function Hi(o,e,r){let t=yo(e,"procedimento_alterar"),a=t??yo(e,"procedimento_consultar");if(!a)throw new T("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await B.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function $e(o){return o.map(e=>e.texto).filter(Boolean)}function Ia(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let s=r.get(n.id);if(s!==void 0&&!a.has(n.id))throw new T("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${s}.`)}}async function Na(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new T("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await Hi(o.http,a,{sinal:t.sinal});if(!s)throw new T("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...uo("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let l=La(n,"selTipoProcedimento"),u=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:u.valor}),i.push(...uo("Tipo",l,u.texto))}if(r.nivel!==void 0){let l=Ne[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:de[r.nivel]}),i.push(...uo("N\xEDvel de acesso",l,Ne[de[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let l=La(n,"selHipoteseLegal"),u=n.valor("rdoNivelAcesso")||de.restrito,p=Lr(await ue(o,n,u,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:p.id}),i.push(...uo("Hip\xF3tese legal",l,p.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new T("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(i.push(...uo("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let l=n.itensLupa("selInteressadosProcedimento");Ia(l,r.interessados,Nr(n.pagina.html,"interessado"),"Interessado"),i.push(...uo("Interessados",$e(l).join("; "),$e(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new T("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let l=n.itensLupa("selAssuntos");Ia(l,r.assuntos,Nr(n.pagina.html,"assunto"),"Assunto"),i.push(...uo("Assuntos",$e(l).join("; "),$e(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:l=>Y(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}async function $a(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new T("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function Ra(o,e,r){let t=yo(o,e);if(!t)throw new T("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var za=o=>e=>Y(e.url).get("acao")!==o;async function Vi(o,e,r,t){let a=await o.http.obter(Ra(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return B.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>no(a.html,s)).find(Boolean);if(!n)throw new T("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return B.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function _a(o,e,r,t){let a=await $a(o,e,t.sinal),n=await Vi(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??za(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function qa(o,e,r,t){return _a(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=uo("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...uo("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Ha(o,e,r,t){return _a(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(l=>l.valor===a.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=to(r),i=a.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=i.find(l=>l.valor===r)??i.find(l=>to(l.texto.split(" - ")[0])===s)??i.find(l=>to(l.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(l=>to(l.texto).includes(s)).length===1?i.find(l=>to(l.texto).includes(s)):void 0);if(!c)throw new T("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(l=>l.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),uo("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}async function Fi(o,e,r){let t=Ra(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function Ta(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:H(t[1]),texto:H(t[2]),usuario:H(t[3]),data:H(t[4])}})}async function Va(o,e,r,t){let a=await $a(o,e,t.sinal),n=await Fi(o,a,t.sinal),s=Ta(n),i=to(r.marcador),c=s.find(f=>to(f.marcador)===i),l={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...l,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let f=no(n.html,"andamento_marcador_remover");if(!f)throw new T("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let y=B.de(n,"#frmGerenciarMarcador",o.http);y.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let b=await o.http.enviar(f,y.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(Ta(b).some(P=>P.id===c.id))throw new T("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let u;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))u=B.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let f=no(n.html,"andamento_marcador_cadastrar");if(!f)throw new T("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");u=await B.abrir(o.http,f,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let p=u.escolher("selMarcador",r.marcador);return u.definir({hdnIdMarcador:p.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?uo(`Texto do marcador ${p.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${p.texto}${r.texto?`: ${r.texto}`:""}`}],l.mudancas.length?t.aplicar?(await u.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:za("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${p.texto}" aplicado em ${a.protocolo}.`}):{...l,resumo:`Vai marcar ${a.protocolo} com "${p.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function ji(){let o=globalThis,e=o.wrappedJSObject??o.window?.wrappedJSObject,r=o.exportFunction;return!e||typeof r!="function"?null:{pagina:e,exportFunction:t=>r(t,e)}}function Gi(o,e){if(!e.pagina.Object)return o;let r=new e.pagina.Object;for(let[t,a]of Object.entries(o))a!==void 0&&(r[t]=a);return r}function Fa(o,e,r,t,a=ji()){if(!a)return r?o.request(e,r,t):o.request(e,t);let n=null,{pagina:s,exportFunction:i}=a,c=i(u=>new s.Promise(i(p=>{t(u).then(f=>{n={ok:!0,valor:f},p()},f=>{n={ok:!1,erro:f},p()})}))),l=r?o.request(e,Gi(r,a),c):o.request(e,c);return Promise.resolve(l).then(()=>{let u=n;if(!u)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(u.ok)return u.valor;throw u.erro})}var Ui="seipro-historico-sessao",Tr="seiProHistoricoRestauro",Bi=600*1e3,ja;function $r(){if(ja!==void 0)return ja;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Ua(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};$r()?.setItem(Tr,JSON.stringify(t))}catch{}}function Re(){try{$r()?.removeItem(Tr)}catch{}}function Rr(o,e=Date.now()){try{let r=$r()?.getItem(Tr);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>Bi?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var Ga=Promise.resolve();function Ba(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return Fa(r,Ui,e?{signal:e}:null,()=>o()).catch(n=>{throw Lo(n)});let t=Ga.then(()=>{if(e?.aborted)throw Lo(new DOMException("cancelado","AbortError"));return o()});return Ga=t.catch(()=>{}),t}var Xa={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},ju=120*1e3;function Qa(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}var Xi={resumido:"R",completo:"P",total:"T"},Ja=500,Qi=2e3;function Ka(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function Ji(o){let e=[...o.querySelectorAll("td")],r=H(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=H(e[3]),s={data:r,unidade:H(e[1]),...t?{unidadeNome:t}:{},usuario:H(e[2]),descricao:n},i=Qa(r);i&&(s.dataISO=i),a&&(s.usuarioNome=a),o.classList.contains("andamentoAberto")&&(s.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let l=H(c);/^\d+$/.test(l)&&(s.nrSei=l);let u=Y(c.getAttribute("href")??"").get("id_documento");u&&(s.idDocumento=u)}if(Ka(n).startsWith(Ka(Xa.remetidoPrefixo))){let l=e[3]?.querySelector("a.ancoraSigla"),u=H(l);u&&(s.unidadeCitada=u);let p=l?.getAttribute("title")??"";p&&(s.unidadeCitadaNome=p)}return s}function zr(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(H(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(Ji),total:r}}async function Ya(o,e,r={}){let t=await Wi(o,e,{tipo:Xi[r.tipo??"resumido"],limite:r.limite??Ja,sinal:r.sinal});return{total:t.total,andamentos:t.andamentos.slice(0,r.limite??Ja)}}function Ko(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function _r(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(H(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Wa(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function Ki(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let s=0;s<=a&&s+n<=t.length;s+=1){let i=!0;for(let c=0;c<n;c+=1)if(Wa(t[s+c])!==Wa(o.andamentos[c])){i=!1;break}if(i)return[...t.slice(0,s),...o.andamentos]}return null}async function Wi(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=Zi(o,t,r);return a||await Ba(()=>Yi(o,e,r),r.sinal)}catch(t){throw Lo(t)}}function Zi(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(Ko(e,"hdnTipoHistorico")||"R")!==r.tipo||(Ko(e,"hdnInfraPaginaAtual")||"0")!=="0"||Rr(o.http.base.host))return null;let{itens:t,total:a}=zr(e);return _r(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:Ko(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Za(o,e,r){await B.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function Yi(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new T("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",H(a.doc.querySelector("title")));let n=Rr(t);if(n){try{await Za(o,a,n),Re()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let s={tipo:Ko(a,"hdnTipoHistorico")||"R",pagina:Ko(a,"hdnInfraPaginaAtual")||"0"},i=s,c=!1,l=async(u,p)=>{c||(Ua(t,s),c=!0);let f={tipo:r.tipo,pagina:String(p)},y=await B.de(u,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:f.tipo,hdnInfraPaginaAtual:f.pagina}).enviar({sinal:r.sinal});return i=f,y};try{let u=s.tipo===r.tipo&&s.pagina==="0"?a:await l(a,0);if(!u.doc.querySelector("#tblHistorico"))throw new T("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",H(u.doc.querySelector("title")));let p=zr(u),f=Ko(u,"hdnInfraHashCriterios"),y=p.total,b=y?Math.min(y,r.limite):r.limite,P=Ki(r.cache,f,y,p.itens);if(P)return r.aoProgresso?.(1,1),{andamentos:P,total:y,hash:f,completo:!0,aproveitouCache:!0};let x=[...p.itens],C=p.itens.length,k=u.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,v=k>0?k:y>C&&C>0?Math.ceil(y/C):1;r.aoProgresso?.(1,v);for(let D=1;x.length<b&&_r(u)&&D<Qi;D+=1){u=await l(u,D);let w=zr(u);if(!w.itens.length)break;x.push(...w.itens),r.aoProgresso?.(D+1,Math.max(v,D+1))}let M=y?x.length>=y:!_r(u);return{andamentos:x,total:y||x.length,hash:f,completo:M,aproveitouCache:!1}}finally{if(c)if(i.tipo!==s.tipo||i.pagina!==s.pagina)try{await Za(o,a,s),Re()}catch{}else Re()}}function on(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}`:void 0}var oc=["Processo recebido na unidade","Reabertura do processo na unidade"],en=/^Processo (?:p\u00FAblico|restrito|sigiloso) gerado/i,ec=/^Processo remetido pela unidade\s+(.+)$/i;function rc(o,e){return o.unidade.trim()===e.sigla.trim()&&e.sigla.trim()?!0:!!e.nome?.trim()&&o.unidadeNome?.trim()===e.nome.trim()}function rn(o,e){let r=typeof e=="string"?{sigla:e}:e,t={},a=o.filter(i=>en.test(i.descricao.trim())),n=a[a.length-1],s=n?on(n.data):void 0;s&&(t.autuacao=s);for(let i of o){if(!rc(i,r))continue;let c=i.descricao.trim(),l=on(i.data);if(l&&(!t.recebimento&&(oc.includes(c)||en.test(c))&&(t.recebimento=l),!t.envio)){let u=ec.exec(c);u&&(t.envio=l,t.unidadeEnvio=u[1].trim())}}return t}var qr=[["hoje","Hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["trimestre","Nos \xFAltimos 90 dias"],["antigo","H\xE1 mais de 90 dias"],["sem","Sem informa\xE7\xE3o"]];function tn(o,e){if(!o)return"sem";let r=_o(o,e);return Number.isNaN(r)||r<0?"sem":r<1?"hoje":r<=7?"semana":r<=30?"mes":r<=90?"trimestre":"antigo"}var Hr=1440*6e4,pe=(o,e)=>e-o.consultadoEm>=0&&e-o.consultadoEm<Hr;var ze=class extends Error{sessao=!0},tc=2,ac=250,nc=5,sc=o=>new Promise(e=>setTimeout(e,o));async function an(o){let e=[...o.alvos],r=o.esperar??sc,t={feitos:0,total:e.length,semDados:0},a="concluida",n=0,s=o.limiteErros??nc;async function i(){for(;a==="concluida";){if(o.sinal.aborted){a="cancelada";return}let c=e.shift();if(!c)return;try{let l=await o.consultar(c,o.sinal);n=0,t.feitos+=1,l||(t.semDados+=1),o.aoResolver(c,l,{...t},!1)}catch(l){if(o.sinal.aborted){a="cancelada";return}if(l.sessao){a="sessao";return}if(n+=1,t.feitos+=1,t.semDados+=1,o.aoResolver(c,null,{...t},!0),n>=s){a="erros";return}}e.length&&await r(o.pausaMs??ac)}}return await Promise.all(Array.from({length:Math.max(1,o.simultaneas??tc)},()=>i())),{motivo:a,progresso:t}}var ic=500;async function nn(o,e,r,t){if(!e.link)return null;try{let a=await o.http.obter(e.link,{sinal:t});if(!/acao=procedimento_visualizar/.test(a.url)){let c=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)return null;a=await o.http.obter(c.replace(/&amp;/g,"&"),{sinal:t})}let n=no(a.html,"procedimento_consultar_historico");if(!n)return null;let{andamentos:s}=await Ya(o,n,{tipo:"resumido",limite:ic,sinal:t}),i=rn(s,r);return Object.keys(i).length?i:null}catch(a){if(a instanceof T&&a.codigo==="SEI_SESSAO_EXPIRADA")throw new ze(a.message);if(a instanceof T&&(a.codigo==="SEI_SIGILOSO"||a.codigo==="SEI_ACAO_INDISPONIVEL"||a.codigo==="SEI_NAO_ENCONTRADO"))return null;throw a}}function sn(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Le(r)}}}function cn(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new T("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new T("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=H(r);throw new T("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new T("SEI_VALIDACAO",r,r)}return o}function ln(o,e={}){let r=new URL(".",o),t=e.fetch??((...p)=>fetch(...p)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(p){n>=a&&await new Promise(f=>s.push(f)),n+=1;try{return await p()}finally{n-=1,s.shift()?.()}}let c=p=>new URL(p.replace(/&amp;/g,"&"),r).href;async function l(p,f,y){return i(async()=>{try{let b=await t(c(p),{credentials:"same-origin",redirect:"follow",...f,signal:y.sinal}),P=Ir(await b.arrayBuffer());return cn(sn(b.url||c(p),b.status,P),y)}catch(b){throw Lo(b)}})}async function u(p,f={}){return i(async()=>{try{let y=await t(c(p),{credentials:"same-origin",redirect:"follow",signal:f.sinal}),b=new Uint8Array(await y.arrayBuffer()),P=(y.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();P==="text/html"&&cn(sn(y.url||c(p),y.status,Ir(b)),f);let x=y.headers?.get("content-disposition")??"",C=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(x)?.[1]??/filename="?([^";]+)"?/i.exec(x)?.[1]??"");return{bytes:b,tipo:P,nome:C}}catch(y){throw Lo(y)}})}return{base:r,absoluta:c,baixar:u,obter:(p,f={})=>l(p,{method:"GET"},f),enviar:(p,f,y={})=>l(p,y.utf8?{method:"POST",headers:{"Content-Type":Ma},body:wa(f)}:{method:"POST",headers:{"Content-Type":Da},body:Sa(f,y.modos)},y)}}function cc(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function lc(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Vr(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=cc(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:lc(o),sigla:H(r)||H(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var dc=3e4,_e=class{constructor(e,r=null,t){this.paginaViva=r;this.http=ln(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new T("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Vr(this.base())}linkMenu(e){return fa(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new T("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=B.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=Y(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new T("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new T("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let u=Y(j(c)).get("id_procedimento")??"",p=i.get("id_protocolo")??"",f={idProcedimento:u,idDocumento:p&&p!==u?p:void 0,linkArvore:j(c)};return this.localizados.set(t,f),f}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<dc)return a.arvore;let n=await va(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:j(s[1]),texto:j(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=Le(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function me(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var dn={recebidos:"Recebidos",gerados:"Gerados",detalhado:"Detalhado"},qo=(o,e)=>`${o}:${e}`;function un(o,e,r="resumida"){let t={},a=r==="detalhada"?["detalhado"]:["recebidos","gerados"];for(let n of a){let s=n==="detalhado"?[...o]:o.filter(p=>p.grupo===n);if(!s.length)continue;let i=[...new Set(s.map(p=>p.pagina))].sort((p,f)=>p-f),c=n==="detalhado"?"na lista":`em ${dn[n]}`;if(i.length>1){let p=i.map(f=>f+1).join(" e ");return{ok:!1,motivo:`O SEI s\xF3 aceita, de uma vez, processos de uma mesma p\xE1gina ${c} (marcados nas p\xE1ginas ${p}). Deixe s\xF3 uma p\xE1gina marcada.`}}let l=i[0],u=e.get(qo(n,l));if(!u?.itens||!u.hash)return{ok:!1,motivo:`Os dados da p\xE1gina ${l+1} ainda n\xE3o foram lidos. Espere o carregamento terminar.`};t[n]={ids:s.map(p=>p.id),pagina:l,selecao:u}}return{ok:!0,plano:{porGrupo:t,todosNaPaginaAtual:o.every(n=>n.naPaginaAtual)}}}function uc(o){let e={},r=o.porGrupo.detalhado?["detalhado"]:["recebidos","gerados"];for(let t of r){let a=o.porGrupo[t],n=dn[t];if(e[`hdn${n}ItemId`]="",!a){e[`hdn${n}ItensSelecionados`]="";continue}e[`hdn${n}ItensSelecionados`]=a.ids.join(","),e[`hdn${n}Itens`]=a.selecao.itens,e[`hdn${n}ItensHash`]=a.selecao.hash}return e}function pn(o,e,r){let t=o.getElementById("frmProcedimentoControlar");if(!t)throw new Error("Formul\xE1rio do Controle de Processos n\xE3o encontrado.");let a=o.createElement("form");a.setAttribute("method","post"),a.setAttribute("action",e),a.style.display="none";let n=new Map;for(let s of Array.from(t.querySelectorAll("input, select, textarea")))!s.name||s.disabled||s.type==="checkbox"||s.type==="radio"||s.type==="button"||s.type==="submit"||n.set(s.name,s.value);for(let[s,i]of Object.entries(uc(r)))n.set(s,i);for(let[s,i]of n){let c=o.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",s),c.setAttribute("value",i),a.append(c)}o.body.append(a),a.submit()}var mn=o=>o.some(e=>e.sigiloso);var pc='a[onclick*="acaoControleProcessos"]';function fn(o){let e=/acaoControleProcessos\(\s*'([^']*)'\s*,\s*(true|false)\s*,\s*(true|false)/.exec(o.elemento.getAttribute("onclick")??"");return e?{url:e[1].replace(/&amp;/g,"&"),requerSelecao:e[2]==="true",aceitaSigiloso:e[3]==="true"}:null}function gn(o){let e=new Set,r=[];for(let t of o.querySelectorAll(pc)){let a=/[?&]acao=([a-z0-9_]+)/.exec(t.getAttribute("onclick")??"")?.[1],n=t.querySelector("img");if(!a||!n||e.has(a))continue;e.add(a);let s=n.getAttribute("title")||n.getAttribute("alt")||a,i=n.getAttribute("src")??"";try{i=new URL(i,o.baseURI||o.location?.href).href}catch{}r.push({acao:a,rotulo:s,icone:i,elemento:t})}return r}var mc="data-spro-recolhido",fc=".collapseTabelaProcesso";function gc(o){let e=[...o.querySelectorAll(fc)].filter(r=>r.id!=="spro-grade");return e.length>0&&e.some(r=>r.classList.contains("displayNone"))}function hn(o,e,r=o.defaultView?.MutationObserver){let t=()=>e.toggleAttribute(mc,gc(o));if(t(),!r)return()=>{};let a=new r(t);return a.observe(o.body??o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0}),()=>a.disconnect()}var hc=/^\s*\[( |x|X)\]\s?(.*)$/;function Oo(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=hc.exec(e);return r?{marca:r[1]!==" ",texto:r[2]}:{marca:null,texto:e}})}function qe(o){return o.map(e=>e.marca===null?e.texto:`${e.marca?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Fr(o,e){let r=new Set(e.filter(a=>a>=0&&a<o.length));if(!r.size)return[...o];let t=[...r].every(a=>o[a].marca!==null);return o.map((a,n)=>r.has(n)?{...a,marca:t?null:a.marca??!1}:a)}function He(o,e){return o.map((r,t)=>t===e&&r.marca!==null?{...r,marca:!r.marca}:r)}function bn(o){return Oo(o).filter(e=>e.marca!==null||e.texto.trim()).map(e=>e.marca===null?e.texto:`${e.marca?"\u2611":"\u2610"} ${e.texto}`).join(" / ")}var Fe="data-tip",vn="data-tip-nota",bc="data-tip-autor",Ve=0,vc=`
:host { all: initial; }
.dica { position: fixed; inset: auto; margin: 0; border: 0; overflow: visible; z-index: 2147483647; max-width: 320px; padding: 6px 10px; font: 12px/1.45 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; color: #fff; white-space: pre-line; pointer-events: none; background: #1b1f24; border-radius: 8px; box-shadow: 0 6px 18px rgb(0 0 0 / 28%); opacity: 0; transform: translateY(2px); transition: opacity 120ms ease, transform 120ms ease; }
.dica.claro { color: #1b1f24; background: #fff; box-shadow: 0 6px 18px rgb(0 0 0 / 22%), 0 0 0 1px rgb(0 0 0 / 10%); }
.dica.on { opacity: 1; transform: none; }
.nota { display: flex; flex-direction: column; gap: 3px; }
.nota-l { position: relative; min-height: 1.45em; }
.nota-l[data-t] { padding-left: 22px; }
.nota-l[data-t]::before { content: ""; position: absolute; left: 1px; top: 0.2em; box-sizing: border-box; width: 14px; height: 14px; border: 1.6px solid currentColor; border-radius: 4px; opacity: 0.75; }
.nota-l[data-t="x"] { text-decoration: line-through; opacity: 0.8; }
.nota-l[data-t="x"]::before { content: "\\2713"; opacity: 1; text-align: center; font: 700 11px/11px system-ui; color: #fff; background: #4a8f5a; border-color: #4a8f5a; }
.nota-autor { margin-top: 4px; font-size: 11px; opacity: 0.7; }
.dica[hidden] { display: none; }
@media (prefers-reduced-motion: reduce) { .dica { transition: none; } }
`,xn=o=>o.nodeType===1,xc=o=>o.some(e=>xn(e)&&(e.id==="spro-grade"||e.classList.contains("spro-grade-botao")));function jr(o){if(!xc(o))return null;for(let e of o)if(xn(e)){if(e.id==="spro-grade")return null;if(e.hasAttribute(Fe)||e.hasAttribute(vn)||e.hasAttribute("title"))return e}return null}function Ho(o){let e=o.getAttribute("title");return e&&(o.hasAttribute(Fe)||o.setAttribute(Fe,e),!o.hasAttribute("aria-label")&&!(o.textContent??"").trim()&&o.setAttribute("aria-label",e.split(`
`)[0]),o.removeAttribute("title")),o.getAttribute(Fe)??""}function Ac(o,e,r){let t=o.ownerDocument,a=t.createElement("div");a.className="nota";for(let n of Oo(e)){if(n.marca===null&&!n.texto.trim())continue;let s=t.createElement("div");s.className="nota-l",n.marca!==null&&s.setAttribute("data-t",n.marca?"x":"o"),s.textContent=n.texto,a.append(s)}if(r){let n=t.createElement("div");n.className="nota-autor",n.textContent=r,a.append(n)}o.replaceChildren(a)}var Gr=null;function An(o){let e=a=>{if(a.nodeType!==1)return;let n=a;n.hasAttribute("title")&&Ho(n);for(let s of Array.from(n.querySelectorAll("[title]")))Ho(s)};if(e(o.nodeType===11?o.host:o),o.nodeType===11)for(let a of Array.from(o.querySelectorAll("[title]")))Ho(a);let r=(o.ownerDocument??o).defaultView?.MutationObserver;if(!r)return()=>{};let t=new r(a=>{for(let n of a)if(n.type==="attributes")e(n.target);else for(let s of Array.from(n.addedNodes))e(s);Gr?.()});return t.observe(o,{attributes:!0,attributeFilter:["title"],childList:!0,subtree:!0}),()=>t.disconnect()}function yc(o){let e=[],r=o;for(;r;)e.push(r),r=r.nodeType===11?r.host??null:r.parentNode;return e}function Ec(o,e,r){let a=o.bottom+8,n=!1;a+e.altura>r.h-4&&o.top-8-e.altura>=4&&(a=o.top-8-e.altura,n=!0);let s=o.left+o.width/2-e.largura/2;return s=Math.max(4,Math.min(s,r.w-e.largura-4)),{x:Math.round(s),y:Math.round(Math.max(4,a)),acima:n}}function yn(o,e=()=>!1){let r=o.defaultView;if(!r)return()=>{};let t=o.createElement("div");t.id="spro-dica-host";let a=t.attachShadow({mode:"open"}),n=o.createElement("style");n.textContent=vc;let s=o.createElement("div");s.className="dica",s.setAttribute("role","tooltip"),s.hidden=!0,s.setAttribute("popover","manual"),a.append(n,s),o.documentElement.append(t);let i=null,c,l=!1,u=null;function p(){clearTimeout(c),i=null,l=!1,s.classList.remove("on"),s.hidden=!0;try{s.matches?.(":popover-open")&&s.hidePopover()}catch{}}function f(){if(!i||!i.isConnected)return b();let k=i.getAttribute(vn),v=k!==null?k:Ho(i);if(!v)return p();k!==null?Ac(s,k,i.getAttribute(bc)??""):s.textContent=v,s.classList.toggle("claro",!e()),s.hidden=!1;try{typeof s.showPopover=="function"&&!s.matches(":popover-open")&&s.showPopover()}catch{}let M=i.getBoundingClientRect(),D=s.getBoundingClientRect(),w=Ec(M,{largura:D.width,altura:D.height},{w:r.innerWidth,h:r.innerHeight});s.style.left=`${w.x}px`,s.style.top=`${w.y}px`,s.classList.add("on"),l=!0}function y(k,v){let M=o.elementFromPoint(k,v);for(let D=0;D<4&&M?.shadowRoot;D++){let w=M.shadowRoot.elementFromPoint(k,v);if(!w||w===M)break;M=w}return M}function b(){if(!u)return p();let k=y(u.x,u.y),v=k?jr(yc(k)):null;if(v===i&&i?.isConnected)return;let M=l;p(),v&&(Ho(v),i=v,M||Ve===0?f():c=setTimeout(f,Ve))}Gr=()=>{i&&!i.isConnected&&b()};let P=k=>{let v=k;typeof v.clientX=="number"&&(u={x:v.clientX,y:v.clientY});let M=jr(k.composedPath());M===i&&i?.isConnected||(p(),M&&(Ho(M),i=M,Ve>0?c=setTimeout(f,Ve):f()))},x=k=>{let v=jr(k.composedPath());!v||!v.matches?.(":focus-visible")||(p(),Ho(v),i=v,f())},C=()=>p();return o.addEventListener("pointerover",P,!0),o.addEventListener("mouseover",P,!0),o.addEventListener("pointermove",P,!0),o.addEventListener("mousemove",P,!0),o.addEventListener("focusin",x,!0),o.addEventListener("focusout",p,!0),o.addEventListener("pointerdown",p,!0),o.addEventListener("keydown",p,!0),o.addEventListener("scroll",p,!0),o.documentElement.addEventListener("pointerleave",C),()=>{p(),Gr=null,o.removeEventListener("pointerover",P,!0),o.removeEventListener("mouseover",P,!0),o.removeEventListener("pointermove",P,!0),o.removeEventListener("mousemove",P,!0),o.documentElement.removeEventListener("pointerleave",C),o.removeEventListener("focusin",x,!0),o.removeEventListener("focusout",p,!0),o.removeEventListener("pointerdown",p,!0),o.removeEventListener("keydown",p,!0),o.removeEventListener("scroll",p,!0),t.remove()}}var so="data-spro-grade",Eo="data-spro-grade-pronta",fe="data-spro-grade-escuro",Ur="spro_grade",Br="spro-grade-pre";var Pc="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function Sc(){let o=Pc.split(", ").map(t=>`html[${so}] ${t}`).join(`,
`),e=`html[${so}]:not([${Eo}]) #divTabelaProcesso::before,
html[${so}]:not([${Eo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before`,r=["#divFiltro","#newFiltro","#processosProActions","#processosKanban"].map(t=>`html[${so}] ${t}`).join(`,
`);return`${o} { display: none !important; }
/* Com a grade pronta, o container nativo das tabelas (min-height: 200px) so deixaria um vazio entre a grade e o painel de baixo. */
html[${so}][${Eo}] #divTabelaProcesso { display: none !important; }
${r} { display: none !important; }
html[${so}] #divRecebidosAreaPaginacaoSuperior, html[${so}] #divRecebidosAreaPaginacaoInferior,
html[${so}] #divGeradosAreaPaginacaoSuperior, html[${so}] #divGeradosAreaPaginacaoInferior { display: none !important; }
${e} {
  content: "";
  display: block;
  flex: 0 0 100%;
  box-sizing: border-box;
  width: 100%;
  height: 392px;
  margin: 6px 0;
  border-radius: 10px;
  --spro-sk: #e6e9ee;
  --spro-sk-2: #f3f4f7;
  background:
    linear-gradient(var(--spro-sk), var(--spro-sk)) 0 0 / 38% 36px no-repeat,
    linear-gradient(var(--spro-sk-2), var(--spro-sk-2)) 100% 0 / 56% 36px no-repeat,
    linear-gradient(var(--spro-sk-2), var(--spro-sk-2)) 0 52px / 100% 34px no-repeat,
    repeating-linear-gradient(to bottom, var(--spro-sk) 0 20px, transparent 20px 44px) 0 100px / 100% 352px no-repeat;
  animation: spro-grade-pulso 1.3s ease-in-out infinite;
}
html[${so}][${fe}]:not([${Eo}]) #divTabelaProcesso::before,
html[${so}][${fe}]:not([${Eo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { --spro-sk: #2c333b; --spro-sk-2: #232a31; }
@keyframes spro-grade-pulso { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  html[${so}]:not([${Eo}]) #divTabelaProcesso::before,
  html[${so}]:not([${Eo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { animation: none; }
}`}function En(o){try{return o.getItem(Ur)==="1"}catch{return!1}}function je(o,e){try{e?o.setItem(Ur,"1"):o.removeItem(Ur)}catch{}}function Ge(o,e){let r=o.documentElement;if(r.setAttribute(so,"1"),r.removeAttribute(Eo),e?r.setAttribute(fe,"1"):r.removeAttribute(fe),!o.getElementById(Br)){let t=o.createElement("style");t.id=Br,t.textContent=Sc(),(o.head??r).append(t)}}function Ue(o){let e=o.documentElement;e.removeAttribute(so),e.removeAttribute(Eo),e.removeAttribute(fe),o.getElementById(Br)?.remove()}var Vo=o=>o.documentElement.hasAttribute(so);function Xr(o){o.documentElement.setAttribute(Eo,"1")}function Be(o,e={setTimeout:(r,t)=>setTimeout(r,t),clearTimeout:r=>clearTimeout(r)}){let r=!1,t,a=s=>{r||(r=!0,e.clearTimeout(n),e.clearTimeout(t),o(s))},n=e.setTimeout(()=>a("teto"),1e4);return{iniciarContagem(){r||(t=e.setTimeout(()=>a("prazo"),1500))},pronta(){r=!0,e.clearTimeout(n),e.clearTimeout(t)},falhou:s=>a(s),encerrada:()=>r}}var Pn="http://www.w3.org/2000/svg",wc={grade:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M3.5 9.5h17M9 9.5v10M3.5 14.5h17"}]],quadro:[["rect",{x:"3.5",y:"4.5",width:"4.6",height:"15",rx:"1.2"}],["rect",{x:"9.7",y:"4.5",width:"4.6",height:"9",rx:"1.2"}],["rect",{x:"15.9",y:"4.5",width:"4.6",height:"12",rx:"1.2"}]],lista:[["path",{d:"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"}]],agrupar:[["path",{d:"M4 6h16M4 12h10M4 18h13"}],["path",{d:"M18 10l3 2-3 2"}]],colunas:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M9.2 4.5v15M14.8 4.5v15"}]],disquete:[["path",{d:"M5 4.5h11l3.5 3.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"}],["path",{d:"M8 4.5v5h7v-5M8 20v-6h8v6"}]],densidade:[["path",{d:"M4 6h16M4 10h16M4 14h16M4 18h16"}]],semPessoa:[["circle",{cx:"12",cy:"8.5",r:"3.6"}],["path",{d:"M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5M4 4l16 16"}]],olhoFechado:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}],["path",{d:"M4 4l16 16"}]],recebido:[["path",{d:"M4 13.5l2.2-7A1.6 1.6 0 0 1 7.7 5.4h8.6a1.6 1.6 0 0 1 1.5 1.1l2.2 7"}],["path",{d:"M4 13.5V18a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18v-4.5h-4.6a3.4 3.4 0 0 1-6.8 0z"}]],gerado:[["path",{d:"M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z"}],["path",{d:"M14 3.5V7.5h4M9.5 14.5h5M9.5 17h3"}],["path",{d:"M9.5 11.5l2-2 2 2M11.5 9.5v3.5"}]],novaGuia:[["path",{d:"M14 4.5h5.5V10M19.5 4.5L11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],prioridade:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 7.5v5.5M12 16.4h.01"}]],seta:[["path",{d:"M6 9l6 6 6-6"}]],setaDireita:[["path",{d:"M9 6l6 6-6 6"}]],desfazer:[["path",{d:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"}]],bloquear:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],informacao:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 11v5M12 8h.01"}]]};function go(o,e=16,r=document){let t=r.createElementNS(Pn,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[n,s]of Object.entries(a))t.setAttribute(n,s);for(let[n,s]of wc[o]){let i=r.createElementNS(Pn,n);for(let[c,l]of Object.entries(s))i.setAttribute(c,l);t.append(i)}return t}var Xe="spro-grade-botao",Mc="#processosSEIPro .titlePanelHome, #processosSEIPro #divInfraBarraLocalizacao, #divInfraBarraLocalizacao.titlePanelHome, #divInfraBarraLocalizacao",Dc="Usar o Novo Controle de Processos",Cc="Voltar \xE0 vis\xE3o nativa do SEI";function kc(o,e,r){let t=o.querySelector(Mc);if(!t)return!1;let a=e?Cc:Dc,n=t.querySelector(`.${Xe}`);n||(n=o.createElement("button"),n.type="button",n.className=Xe,n.append(go("grade",18,o)),t.append(n));let s=[...t.children].filter(i=>i.classList.contains("spro-pnl-botao")).at(-1);return s&&s.compareDocumentPosition(n)&2&&s.after(n),n.setAttribute("data-tip",a),n.removeAttribute("title"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",String(e)),!0}function wn(o,e){let r=t=>{(t.composedPath?.()[0]??t.target)?.closest?.(`.${Xe}`)&&(t.preventDefault(),t.stopPropagation(),e())};return o.addEventListener("click",r,!0),()=>o.removeEventListener("click",r,!0)}var Sn=o=>{for(let e of o.querySelectorAll(`.${Xe}`))e.remove()};function Qe(o,e,r){let t=()=>kc(o,e(),r);t();let a=o.defaultView?.MutationObserver;if(!a||!o.body)return()=>Sn(o);let n=!1,s=new a(()=>{n||(n=!0,queueMicrotask(()=>{n=!1,s.disconnect(),t(),s.observe(o.body,{childList:!0,subtree:!0})}))});return s.observe(o.body,{childList:!0,subtree:!0}),()=>{s.disconnect(),Sn(o)}}function J(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Oc=/<div(?: style="text-decoration: line-through;")?><i class="(far fa-square|fas fa-check-square)"><\/i> ?([\s\S]*?)<\/div>/g;function Lc(o){return o.includes("<div")?o.replace(Oc,(e,r,t)=>`
${r==="far fa-square"?"[ ]":"[X]"} ${t}
`).replace(/\n{2,}/g,`
`).trim():o}var Ic=/^Anota[\u00e7c][\u00e3a]o( com prioridade)?\s+\/\s+([\s\S]*)\s+\/\s+(.*)$/i;function Mn(o){let e=o.querySelector('a[href*="acao=anotacao_registrar"]');if(!e)return null;let r=e.querySelector("img")?.getAttribute("src")??"",t=/anotacao2\.|prioridade/i.test(r),a=Ic.exec(e.getAttribute("aria-label")??"");if(a){let i=j(a[2]).replace(/\r\n?/g,`
`).trim();return i?{texto:i,autor:a[3].trim(),prioridade:!!a[1]||t}:null}let n=fo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];if(typeof n?.[0]!="string")return null;let s=Lc(V(n[0])).trim();return s?{texto:s,autor:V(n[1]).trim(),prioridade:t}:null}function Dn(o,e,r){if(e){let a={idProcedimento:o,origem:"nativo",vencimento:e.data,idControlePrazo:e.idControlePrazo,sigla:e.sigla,linkNativo:e.link,...e.concluidoEm?{concluidoEm:e.concluidoEm}:{}};return r?.vencimento&&r.data===e.data?{...a,origem:"ambos",hora:r.hora,texto:r.texto||void 0}:a}if(!r)return null;let t={idProcedimento:o,origem:"marcador",hora:r.hora,texto:r.texto||void 0};return r.vencimento?{...t,vencimento:r.data}:{...t,inicio:r.data}}var Nc='a[href*="acao=controle_prazo_definir"]',Tc=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,Cn=(o,e,r)=>`${r}-${e}-${o}`;function $c(o){let e=o.trim().toLowerCase(),r=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(e);return r?{estado:"concluido",concluidoEm:Cn(r[1],r[2],r[3])}:/^at[e\u00E9] hoje$/.test(e)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(e)?{estado:"atrasado"}:/^\d+ dias?$/.test(e)?{estado:"noPrazo"}:null}function Qr(o){let e=o.querySelector(Nc);if(!e)return null;let r=e.getAttribute("aria-label")??"";if(!r){let l=fo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof l?.[0]=="string"&&(r=`Controle de Prazo / ${V(l[0])}`)}let t=Tc.exec(j(r).replace(/\s+/g," ").trim());if(!t)return null;let a=$c(t[5]);if(!a)return null;let n=j(e.getAttribute("href")??""),s=Y(n),i=s.get("id_controle_prazo")??"",c=s.get("id_procedimento")??o.id.replace(/^P/,"");return!i||!c?null:{idControlePrazo:i,idProcedimento:c,sigla:t[1],data:Cn(t[2],t[3],t[4]),link:n,...a}}var kn=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,On=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,Ln=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function Rc(o,e,r){let t=`${r}-${e}-${o}`;try{return Jo(Oe(t))===t?t:null}catch{return null}}var zc=o=>o.padStart(2,"0");function Jr(o){let e=o.replace(/\r\n?/g,`
`),r=kn.exec(e);if(!r)return null;let t=Rc(r[1],r[2],r[3]);if(!t)return null;let a=On.exec(e),n=a?`${zc(a[1])}:${a[2]}`:void 0,s=Ln.test(e),i=e.replace(Ln,"").replace(kn,"");return a&&(i=i.replace(On,"")),i=i.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:s,texto:i}}function In(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=fo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&e.push({texto:V(t[0]),nome:V(t[1])})}return e}function _c(o,e){let r=/Tipo (.*?)(?: \/ Especifica|$)/.exec(o)?.[1]?.trim()??"",t=/Especifica\S* (.*)$/.exec(o)?.[1]?.trim()??"";if(r)return{tipo:r,especificacao:t};let a=fo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];return a&&a.length>=2?{tipo:V(a[1]).trim(),especificacao:V(a[0]).trim()}:{tipo:r,especificacao:t}}function Nn(o,e){let r=o.querySelector("input[type=checkbox]"),t=o.querySelector("a[href*='procedimento_trabalhar']");if(!r||!t)return null;let a=r.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(t.getAttribute("class")??""),s=_c(a,t),i=[...o.querySelectorAll("td")],c=n?[]:[...i[1]?.querySelectorAll("a[aria-label]")??[]].map(l=>l.getAttribute("aria-label")??"");return{idProcedimento:r.getAttribute("value")??Y(t.getAttribute("href")??"").get("id_procedimento")??"",protocolo:r.getAttribute("title")??H(t),grupo:e,tipo:s.tipo,especificacao:n?"":s.especificacao,sigiloso:n,novo:/NaoVisualizado/.test(t.getAttribute("class")??""),atribuido:H(i[i.length-1]).replace(/^\(|\)$/g,""),sinais:c,documentoNovo:!!i[1]?.querySelector("img[src*='exclamacao']")||c.some(l=>/documento foi inclu/i.test(l))}}var qc=/marcador_([a-z0-9_]+)\.svg/i,Hc=/\b(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?\b/;function Tn(o){let e=Hc.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function Vc(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=fo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],a=j(r.getAttribute("aria-label")??"").trim(),n=/^Marcador\s*\/\s*(.*)$/s.exec(a),s=(typeof t?.[1]=="string"&&t[1]?V(t[1]):n?.[1]??"").trim();if(!s)continue;let i=typeof t?.[0]=="string"?V(t[0]).trim():"",c=Tn(a)??Tn(i);e.push({nome:s,cor:qc.exec(r.querySelector("img")?.getAttribute("src")??"")?.[1]??"",texto:i,...c!==void 0?{dataHora:c}:{}})}return e}function Fc(o){let e=[];for(let r of o.querySelectorAll("a")){let t=r.querySelector("img")?.getAttribute("src")??"",a=/retorno_(programado|aguardando)(\d)?\.svg/.exec(t);if(!a)continue;let n=j(r.getAttribute("aria-label")??"").trim();e.push({tipo:a[1],descricao:n,atrasado:a[2]==="3"||/atrasad/i.test(n)})}return e}function jc(o){let e=o.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla'),r=e?.textContent?.trim();if(!e||!r)return;let t=j(e.getAttribute("title")??"").replace(/^Atribu[i\u00ED]do para\s+/i,"").trim();return{sigla:r,nome:t||r}}function Kr(o,e){let r=Nn(o,e.grupo);if(!r?.idProcedimento)return null;let t=Vc(o),a=null;for(let b of In(o)){let P=Jr(b.texto);if(P){a=P;break}}let n={id:r.idProcedimento,protocolo:r.protocolo,grupo:e.grupo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso,naoVisualizado:r.novo,marcadores:r.sigiloso?[]:t,retornos:r.sigiloso?[]:Fc(o),acompanhamentoEspecial:!r.sigiloso&&!!o.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),documentoNovo:r.documentoNovo,pagina:e.pagina,naPaginaAtual:e.naPaginaAtual},s=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("onmouseover")??"";/\(URGENTE\)/.test(s)&&(n.urgente=!0),/\(TRANCADO\)/.test(s)&&(n.trancado=!0);let i=o.querySelector(".acompanhamentoesp_icon");if(i){let b=fo(i.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof b?.[1]=="string"&&b[1]&&(n.acompanhamentoGrupo=V(b[1]))}let c=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("href");c&&(n.link=j(c));let l=o.querySelector('a[href*="acao=andamento_marcador_gerenciar"]')?.getAttribute("href");l&&!r.sigiloso&&(n.linkMarcadores=j(l));let u=o.querySelector('img[src*="exclamacao"]'),p=u?.closest("a")??u;if(p){let b=fo(p.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],P=((typeof b?.[0]=="string"&&b[0]?V(b[0]):"")||j(p.getAttribute("aria-label")??"")||j(p.getAttribute("title")??"")||j(u?.getAttribute("title")??"")||j(u?.getAttribute("alt")??"")).trim();P&&(n.documentoNovoDica=P)}let f=o.querySelector('a[href*="andamento_situacao_gerenciar"]');if(f&&!r.sigiloso){let b=fo(f.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],P=((typeof b?.[0]=="string"&&b[0]?V(b[0]):"")||j(f.getAttribute("aria-label")??"")).trim();P&&(n.pontoControle=P)}let y=jc(o);if(y&&(n.atribuicao=y),!r.sigiloso){let b=Mn(o);b&&(n.anotacao=b);let P=Dn(n.id,Qr(o),a);P&&(n.prazo=P)}return n}var Rn="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado",Gc={recebidos:"tblProcessosRecebidos",gerados:"tblProcessosGerados"},Uc=[[/^tipo( do processo)?$/,"tipo"],[/^especificacao$/,"especificacao"],[/^(atribuicao|atribuido( para)?|responsavel)$/,"atribuicao"],[/^marcador(es)?$/,"marcador"],[/^prioridade$/,"prioridade"],[/^interessados?$/,"interessados"],[/^observacao$/,"observacao"],[/^ultima mov/,"ultimaMov"]];function Bc(o){let e=new Map;return[...(o.querySelector("thead tr")??[...o.querySelectorAll("tr")].find(t=>t.querySelector("th")))?.children??[]].forEach((t,a)=>{let n=J(t.textContent??""),s=Uc.find(([i])=>i.test(n));s&&e.set(a,s[1])}),e}function $n(o){let e=(o?.querySelector("caption")?.textContent??"").replace(/\s+/g," "),r=Number(/(\d+)\s+registro/.exec(e)?.[1]??0),t=/(\d+)\s+a\s+(\d+)\s*\)?/.exec(e);return{total:r,porPagina:t?Number(t[2])-Number(t[1])+1:0}}function Xc(o,e,r){if(!r.size)return;let t=[...e.children];for(let[a,n]of r){let s=(t[a]?.textContent??"").replace(/\s+/g," ").trim();if(s)if(n==="tipo"&&!o.tipo)o.tipo=s;else if(n==="especificacao"&&!o.especificacao&&!o.sigiloso)o.especificacao=s;else if(n==="atribuicao"&&!o.atribuicao){let i=s.replace(/^\(|\)$/g,"");o.atribuicao={sigla:i,nome:i}}else if(n==="marcador"&&!o.marcadores.length&&!o.sigiloso)o.marcadores=[{nome:s,cor:"",texto:""}];else{if(o.sigiloso&&(n==="interessados"||n==="observacao"))continue;if(n==="prioridade")o.prioridade=s;else if(n==="interessados")o.interessados=s;else if(n==="observacao")o.observacao=s;else if(n==="ultimaMov"){let i=/(\d{2})\/(\d{2})\/(\d{4})/.exec(s);i&&(o.ultimaMov=`${i[3]}-${i[2]}-${i[1]}`)}}}}function Qc(o){let e=o.querySelector("input[type=checkbox]")?.getAttribute("name")??"";return/^chkGerados/i.test(e)?"gerados":"recebidos"}function Wo(o,e={}){let r=e.pagina??0,t=e.naPaginaAtual??!0,a=[],n={recebidos:0,gerados:0},s={recebidos:0,gerados:0},i=o.getElementById("tblProcessosDetalhado"),c=new Set,l=f=>{f&&!c.has(f.id)&&(c.add(f.id),a.push(f))};for(let f of["recebidos","gerados"]){let y=o.getElementById(Gc[f]),{total:b,porPagina:P}=$n(y);n[f]=b,s[f]=P;for(let x of y?.querySelectorAll('tr[id^="P"]')??[]){let C=x.classList.contains("typeGerados")?"gerados":f;l(Kr(x,{grupo:C,pagina:r,naPaginaAtual:t}))}}if(i){let f=Bc(i),{total:y,porPagina:b}=$n(i);for(let P of i.querySelectorAll("tr")){if(!P.querySelector('a[href*="procedimento_trabalhar"]'))continue;let x=Qc(P),C=Kr(P,{grupo:x,pagina:r,naPaginaAtual:t});C&&!c.has(C.id)&&(Xc(C,P,f),l(C),n[x]=Math.max(n[x],y),s[x]=Math.max(s[x],b))}}let u=f=>o.getElementById(f)?.getAttribute("value")??"",p={recebidos:{itens:u("hdnRecebidosItens"),hash:u("hdnRecebidosItensHash")},gerados:{itens:u("hdnGeradosItens"),hash:u("hdnGeradosItensHash")},detalhado:{itens:u("hdnDetalhadoItens"),hash:u("hdnDetalhadoItensHash")}};return{processos:a,totais:n,porPagina:s,visao:i?"detalhada":"resumida",selecoes:p}}var Jc=/\b(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\b/;function Kc(o){let e=Jc.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]),Number(e[5]),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function Wc(o){let e={};for(let r of o.querySelectorAll("tr.infraTrClara, tr.infraTrEscura, table.infraTable tr")){let t=[...r.children].filter(i=>i.tagName==="TD");if(t.length<3)continue;let a="",n;for(let i of t){let c=(i.textContent??"").replace(/\u00A0/g," ").replace(/\s+/g," ").trim();if(!a&&i.querySelector('img[src*="marcador_"]')&&(a=c||(i.querySelector("img")?.getAttribute("title")??"").trim()),n===void 0){let l=Kc(c);l!==void 0&&(n=l)}}if(!a||n===void 0)continue;let s=J(a);(e[s]===void 0||n>e[s])&&(e[s]=n)}return e}async function zn(o,e,r){if(!e.linkMarcadores)return null;try{let t=await o.http.obter(e.linkMarcadores,{sinal:r}),a=Wc(t.doc);return Object.keys(a).length?a:null}catch(t){return t instanceof T&&(t.codigo==="SEI_SIGILOSO"||t.codigo==="SEI_ACAO_INDISPONIVEL"||t.codigo==="SEI_NAO_ENCONTRADO"||t.codigo==="CANCELADO"),null}}var Zc=60;async function _n(o,e,r={}){let t=r.maxPaginas??Zc,a=[],n=new Set(o.processos.map(l=>l.id)),s=!0,i,c=!1;try{for(let l of["recebidos","gerados"]){let u=o.totais[l],p=o.processos.filter(b=>b.grupo===l).length,f=o.porPagina[l]||p||1,y=Math.max(1,Math.ceil(u/f));for(let b=1;p<u;b+=1){if(r.sinal?.aborted)return s=!1,{processos:a,completo:s,...i?{erro:i}:{}};if(b>=t){s=!1;break}c=!0;let P=await e.pagina(l,b,r.sinal),x=Wo(P,{pagina:b,naPaginaAtual:!1}),C=x.processos.filter(k=>k.grupo===l&&!n.has(k.id));if(!C.length)break;for(let k of C)n.add(k.id);p+=C.length,a.push(...C),x.visao==="detalhada"?r.aoSelecao?.("detalhado",b,x.selecoes.detalhado):r.aoSelecao?.(l,b,x.selecoes[l]),r.aoPagina?.(C),r.aoProgresso?.({grupo:l,paginasLidas:b+1,paginasTotal:y,processos:p,total:u})}p<u&&(s=!1)}}catch(l){s=!1,i=l instanceof Error?l.message:String(l)}finally{if(c)try{await e.restaurar()}catch(l){i??=`N\xE3o foi poss\xEDvel voltar \xE0 primeira p\xE1gina: ${l instanceof Error?l.message:String(l)}`}}return{processos:a,completo:s,...i?{erro:i}:{}}}var Yc=["hdnRecebidosItensSelecionados","hdnGeradosItensSelecionados","hdnRecebidosItemId","hdnGeradosItemId","hdnDetalhadoItensSelecionados","hdnDetalhadoItemId"];function Wr(o,e,r="resumida"){let t="#frmProcedimentoControlar",a=()=>({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",hdnDetalhadoPaginaAtual:"0",...Object.fromEntries(Yc.map(n=>[n,""]))});return{async pagina(n,s,i){let c=r==="detalhada"?"hdnDetalhadoPaginaAtual":n==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual";return(await B.de(e,t,o).definir({...a(),[c]:String(s)}).enviar({sinal:i,aceitarValidacao:!0})).doc},async restaurar(n){await B.de(e,t,o).definir(a()).enviar({sinal:n,aceitarValidacao:!0})},restaurarAoSair(){try{let n=B.de(e,t,o);fetch(o.absoluta(n.action),{method:"POST",keepalive:!0,credentials:"include",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(n.definir(a()).pares()).toString()}).catch(()=>{})}catch{}}}}var ol=30*6e4,qn=5e3,Zr=()=>({vistoEm:{}});function Vn(o){if(!o||typeof o!="object")return Zr();let e=o,r={};if(e.vistoEm&&typeof e.vistoEm=="object")for(let[i,c]of Object.entries(e.vistoEm))typeof c=="number"&&Number.isFinite(c)&&c>0&&(r[i]=c);let t=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0,a={vistoEm:r},n=t(e.visitaAtual),s=t(e.visitaAnterior);return n!==void 0&&(a.visitaAtual=n),s!==void 0&&(a.visitaAnterior=s),a}function Fn(o,e){return o.visitaAtual===void 0?{...o,visitaAtual:e}:e-o.visitaAtual>ol?{...o,visitaAnterior:o.visitaAtual,visitaAtual:e}:o}function Yr(o,e,r,t){let a={...o.vistoEm};for(let s of e)a[s]===void 0&&(a[s]=r);if(t){let s=new Set(e);for(let i of Object.keys(a))s.has(i)||delete a[i]}let n=Object.keys(a);if(n.length>qn)for(let s of n.sort((i,c)=>a[c]-a[i]).slice(qn))delete a[s];return{...o,vistoEm:a}}function jn(o,e){return o.map(r=>e.vistoEm[r.id]!==void 0?{...r,vistoEm:e.vistoEm[r.id]}:r)}function Zo(o){if(o===null)return"";if(o<1)return"hoje";if(o===1)return"1 dia";if(o<60)return`${o} dias`;let e=Math.floor(o/30);return e<24?`${e} meses`:`${Math.floor(o/365)} anos`}var Gn="Contado desde a primeira vez que o SEI Pro viu o processo nesta unidade (o SEI n\xE3o informa a data de chegada).";var Yo=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao","caixa","parado","sinais"],Fo={processo:"Processo",tipo:"Tipo",especificacao:"Especifica\xE7\xE3o",responsavel:"Respons\xE1vel",marcadores:"Marcadores",prazo:"Prazo",anotacao:"Anota\xE7\xE3o",caixa:"Na caixa",parado:"Parado h\xE1",sinais:"Sinais"};var el=30,rl=40,tl=()=>({colunas:"marcador",limite:0,raiasPorResponsavel:!1}),al=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao"],ot=2;function oe(){return{id:"",nome:"Padr\xE3o",busca:"",ordem:[],agrupar:"nenhum",modo:"tabela",colv:ot,colunas:[...al],densidade:"confortavel",quadro:tl()}}var nl=["nenhum","responsavel","tipo","marcador","prazo","situacao","grupo","anotacao","acompanhamento","retorno","caixa","autuacao","recebimento","envio","unidadeEnvio"],sl=["protocolo","tipo","responsavel","marcador","prazo","caixa","parado","novo"],il=["marcador","responsavel","prazo","tipo"];function Je(o){let e=oe();if(!o||typeof o!="object")return e;let r=o,t=Array.isArray(r.ordem)?r.ordem.filter(l=>!!l&&typeof l=="object"&&sl.includes(l.campo)).slice(0,4).map(l=>({campo:l.campo,decrescente:l.decrescente===!0})):[],a=Array.isArray(r.colunas)?[...new Set(r.colunas.filter(l=>Yo.includes(l)))]:[];if(a.includes("processo")&&r.colv!==ot&&!a.includes("especificacao")){let l=a.indexOf("processo");a=[...a.slice(0,l+1),"especificacao",...a.slice(l+1)]}let n=r.quadro&&typeof r.quadro=="object"?r.quadro:{},s=Array.isArray(n.ordemColunas)?[...new Set(n.ordemColunas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,i=Array.isArray(n.colunasRecolhidas)?[...new Set(n.colunasRecolhidas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,c=typeof n.larguraColuna=="number"&&Number.isFinite(n.larguraColuna)?Math.max(200,Math.min(500,Math.round(n.larguraColuna))):void 0;return{id:typeof r.id=="string"?r.id:"",colv:ot,nome:typeof r.nome=="string"&&r.nome.trim()?r.nome.trim().slice(0,rl):e.nome,busca:typeof r.busca=="string"?r.busca.slice(0,500):"",ordem:t,agrupar:nl.includes(r.agrupar)?r.agrupar:"nenhum",modo:r.modo==="quadro"?"quadro":"tabela",colunas:a.length?a:e.colunas,densidade:r.densidade==="compacta"?"compacta":"confortavel",quadro:{colunas:il.includes(n.colunas)?n.colunas:"marcador",limite:typeof n.limite=="number"&&n.limite>0?Math.min(99,Math.floor(n.limite)):0,raiasPorResponsavel:n.raiasPorResponsavel===!0,...s?.length?{ordemColunas:s}:{},...i?.length?{colunasRecolhidas:i}:{},...c!==void 0?{larguraColuna:c}:{},...n.colunasVazias===!0?{colunasVazias:!0}:{}}}}function Un(o,e,r){let t=Je(e),a=t.id?o.findIndex(s=>s.id===t.id):-1;if(a>=0){let s=[...o];return s[a]=t,{lista:s,visao:t}}if(o.length>=el)return null;let n={...t,id:r()};return{lista:[...o,n],visao:n}}var Bn=(o,e)=>o.filter(r=>r.id!==e);function Xn(o,e){let r=t=>JSON.stringify({...t,id:"",nome:""});return r(o)!==r(e)}var Ke="spro_grade_v_ids",We=o=>`spro_grade_v:${o}`,cl=o=>`spro_grade:${o||"x"}`,ll=(o,e)=>`spro_grade_and:${o||"x"}:${e||"x"}`,Qn=5e3;function dl(){return{visao:oe(),idade:Zr(),recolhidos:[]}}function ul(o){if(!o||typeof o!="object")return dl();let e=o;return{visao:Je(e.visao),idade:Vn(e.idade),recolhidos:Array.isArray(e.recolhidos)?e.recolhidos.filter(r=>typeof r=="string").slice(0,200):[]}}var pl=/^\d{4}-\d{2}-\d{2}$/;function ml(o){if(!o||typeof o!="object")return null;let e=o;if(typeof e.consultadoEm!="number"||!Number.isFinite(e.consultadoEm))return null;let r={consultadoEm:e.consultadoEm};for(let t of["autuacao","recebimento","envio"])typeof e[t]=="string"&&pl.test(e[t])&&(r[t]=e[t]);return typeof e.unidadeEnvio=="string"&&e.unidadeEnvio&&(r.unidadeEnvio=e.unidadeEnvio.slice(0,120)),r}function Jn(o,e,r=""){let{local:t,sync:a}=o,n=cl(e),s=ll(e,r);async function i(){return ul((await t.obter(n))[n])}async function c(y){let b=await i();await t.gravar({[n]:{...b,...y}})}async function l(){let y=(await a.obter(Ke))[Ke],b=Array.isArray(y)?y.filter(x=>typeof x=="string"):[];if(!b.length)return[];let P=await a.obter(b.map(We));return b.flatMap(x=>{let C=P[We(x)];return C?[{...Je(C),id:x}]:[]})}async function u(y,b=[]){let P=new Set(y.map(k=>k.id)),x={[Ke]:y.map(k=>k.id)};for(let k of y)x[We(k.id)]=k;await a.gravar(x);let C=b.filter(k=>!P.has(k.id)).map(k=>We(k.id));C.length&&await a.remover(C)}async function p(y){let b=(await t.obter(s))[s],P=b&&typeof b=="object"?b.itens:void 0,x={};if(!P||typeof P!="object")return x;for(let[C,k]of Object.entries(P)){let v=ml(k);v&&pe(v,y)&&(x[C]=v)}return x}async function f(y){let b=Object.keys(y),P=b.length>Qn?Object.fromEntries(b.sort((x,C)=>y[C].consultadoEm-y[x].consultadoEm).slice(0,Qn).map(x=>[x,y[x]])):y;await t.gravar({[s]:{itens:P}})}return{areaLocal:t,lerAndamentos:p,gravarAndamentos:f,lerEstado:i,gravarVisao:y=>c({visao:y}),gravarIdade:y=>c({idade:y}),gravarRecolhidos:y=>c({recolhidos:y}),lerVisoes:l,gravarVisoes:u,aoMudarVisoes:y=>a.aoMudar(b=>Ke in b||Object.keys(b).some(P=>P.startsWith("spro_grade_v:"))?y():void 0)}}function Kn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var Wn=new Set;var fl=null;function gl(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Zn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Yn(o,e,r){let t=o.ownerDocument,a=t.defaultView;gl(o).append(e);let n=!0,s=()=>{if(!n)return;let f=o.getBoundingClientRect?.();if(!f)return;let y=a?.innerHeight??0,b=a?.innerWidth??0,P=Math.min(r.largura??Math.max(f.width,r.larguraMinima??0),Math.max(180,b-16)),x=r.alinharDireita?f.right-P:f.left,C=Math.max(8,Math.min(x,b-P-8)),k=r.alturaMaxima??360,v=r.distancia??4;e.style.maxHeight="none";let M=Math.min(e.scrollHeight||k,k),D=y-f.bottom-8,w=f.top-8,N=fl?.()??!1,R=!N&&D<Math.min(M,200)&&w>D;e.style.left=`${C}px`,e.style.width=`${P}px`,e.style.maxHeight=`${N?k:Math.max(140,Math.min(k,R?w:D>140?D:k))}px`,e.classList.toggle("spro-flutuante-cima",R),R?(e.style.top="",e.style.bottom=`${y-f.top+v}px`):(e.style.bottom="",e.style.top=`${f.bottom+v}px`),Zn(a,R?0:Math.ceil(f.bottom+v+M+12))},i=f=>{let y=f.composedPath?.()??[],b=f.target,P=x=>y.includes(x)||!!b&&!!x.contains?.(b);P(e)||P(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},l=f=>{f.target instanceof Node&&e.contains(f.target)||c()},u=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",u);let p={ancora:o,fechar:()=>r.aoFechar()};return Wn.add(p),s(),{posicionar:s,fechar(){n&&(n=!1,Wn.delete(p),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",u),e.remove(),Zn(a,0))}}}function os(o,e){let r=J(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=J(n.rotulo),c=J(n.complemento??""),l=`${i} ${c} ${J(n.descricao??"")}`;if(!t.every(p=>l.includes(p)))return;let u=i.startsWith(r)?0:`${i} ${c}`.split(" ").some(p=>p.startsWith(t[0]))?1:2;a.push({o:n,nota:u,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function es(o,e){let r=o.normalize("NFC"),t=J(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((l,u)=>{let p=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let f of p)n+=f,s.push(u)});let i=new Array(a.length).fill(!1);for(let l of t){let u=n.indexOf(l);if(!(u<0))for(let p=u;p<u+l.length;p++)i[s[p]]=!0}let c=[];return a.forEach((l,u)=>{let p=c[c.length-1];p&&p.marcado===i[u]?p.texto+=l:c.push({texto:l,marcado:i[u]})}),c}var hl=0;function Io(o){let e=`spro-combo-${++hl}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=E=>r().find($=>$.valor===E)??t.get(E),n=[...o.valor??[]],s=null,i="",c=0,l=[],u=null,p=o.vazio??"Escolher\u2026",f={tipo:"pronto"},y=0,b=d("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),P=()=>o.aoMudar?.([...n]);function x(){let E=[];o.icone&&E.push(q(o.icone,15));let $=n.map(O=>a(O)).filter(O=>!!O),S=d("span",{class:"spro-combo-texto"});if(!$.length)S.classList.add("spro-combo-vazio"),S.append(p);else{let O=$[0];O.marca&&S.append(O.marca()),O.cor&&S.append(d("span",{class:"spro-combo-cor",style:`background:${O.cor}`})),S.append(d("span",{class:"spro-combo-rotulo"},O.rotulo)),O.complemento&&S.append(d("span",{class:"spro-combo-compl"},O.complemento)),$.length>1&&S.append(d("span",{class:"spro-combo-mais"},`+${$.length-1}`))}E.push(S,q("chevron",14)),b.setAttribute("aria-busy",f.tipo==="carregando"?"true":"false"),b.classList.toggle("spro-combo-erro",f.tipo==="erro"),b.classList.toggle("spro-combo-ativo",o.multiplo===!0&&$.length>0),b.replaceChildren(...E)}let C=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function k(E){if(o.multiplo){n=n.includes(E.valor)?n.filter(S=>S!==E.valor):[...n,E.valor],P(),x(),w();return}let $=n.length!==1||n[0]!==E.valor;n=[E.valor],x(),Q(!0),$&&P()}async function v(){if(!o.criar)return;let E=i.trim();if(!E)return;let $=await o.criar(E);if($){if(t.set($.valor,$),i="",s){let S=s.querySelector(".spro-combo-busca");S&&(S.value="")}o.multiplo&&n.includes($.valor)?w():k($)}}function M(E,$){let S=n.includes(E.valor),O=d("span",{class:"spro-combo-op-rotulo"});for(let z of es(E.rotulo,i))O.append(z.marcado?d("mark",{},z.texto):z.texto);let G=E.complemento?d("span",{class:"spro-combo-op-compl"}):null;if(G&&E.complemento)for(let z of es(E.complemento,i))G.append(z.marcado?d("mark",{},z.texto):z.texto);let eo=d("li",{role:"option",id:`${e}-op-${$}`,class:`spro-combo-op${$===c?" spro-combo-op-ativa":""}`,"data-valor":E.valor,"aria-selected":S?"true":"false"},o.multiplo?d("span",{class:"spro-combo-caixa","aria-hidden":"true"},S?q("check",12):null):null,E.marca?E.marca():null,E.cor?d("span",{class:"spro-combo-cor",style:`background:${E.cor}`}):null,E.icone?q(E.icone,15):null,d("span",{class:"spro-combo-op-textos"},G?d("span",{class:"spro-combo-op-linha"},O,G):O,E.descricao?d("span",{class:"spro-combo-op-desc"},E.descricao):null),E.contagem!==void 0?d("span",{class:"spro-combo-conta"},String(E.contagem)):null,!o.multiplo&&S?d("span",{class:"spro-combo-marca"},q("check",14)):null);return eo.addEventListener("pointerdown",z=>z.preventDefault()),eo.addEventListener("click",()=>{c=$,k(E)}),eo.addEventListener("pointermove",()=>{c!==$&&(c=$,D())}),eo}function D(){if(!s)return;let E=[...s.querySelectorAll('[role="option"]')];E.forEach((G,eo)=>{G.classList.toggle("spro-combo-op-ativa",eo===c)});let $=E[c],O=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');$?(O?.setAttribute("aria-activedescendant",$.id),$.scrollIntoView?.({block:"nearest"})):O?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;let E=os(r(),i);y=E.length,l=o.limite!==void 0&&E.length>o.limite?E.slice(0,o.limite):E,f.tipo!=="pronto"&&(l=[]),c>=l.length&&(c=Math.max(0,l.length-1));let $=s.querySelector('[role="listbox"]');$.setAttribute("aria-busy",f.tipo==="carregando"?"true":"false");let S=s.querySelector(".spro-combo-extras");if(S.replaceChildren(),f.tipo==="carregando")$.replaceChildren(...[62,84,48,74].map(z=>d("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},d("span",{style:`width:${z}%`})))),S.append(d("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(f.tipo==="erro"){$.replaceChildren();let z=f.tentar;if(S.append(d("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},f.mensagem)),z){let ro=d("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},q("atualizar",14),d("span",{},"Tentar de novo"));ro.addEventListener("pointerdown",mo=>mo.preventDefault()),ro.addEventListener("click",z),S.append(ro)}}else{$.replaceChildren(...l.map(M));let z=i.trim();l.length||S.append(d("p",{class:"spro-combo-nada"},z?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let ro=l.length?o.resumo?.(l.length,y,r().length):void 0;ro&&S.append(d("p",{class:"spro-combo-resumo",role:"status"},ro)),l.length<y&&S.append(d("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${l.length} de ${y}. Digite para refinar.`))}let O=i.trim(),G=r().some(z=>J(z.rotulo)===J(O));if(o.criar&&O&&!G&&f.tipo==="pronto"){let z=d("button",{type:"button",class:"spro-combo-criar"},q("mais",14),d("span",{},o.rotuloCriar?o.rotuloCriar(O):`Criar \u201C${O}\u201D`));z.addEventListener("pointerdown",ro=>ro.preventDefault()),z.addEventListener("click",()=>void v()),S.append(z)}let eo=s.querySelector(".spro-combo-rodape");if(eo){let z=l.filter(ao=>!n.includes(ao.valor)),ro=d("button",{type:"button",class:"spro-combo-acao",disabled:!O||!z.length},`Marcar os filtrados${O&&z.length?` (${z.length})`:""}`);ro.addEventListener("click",()=>{n=[...n,...z.map(ao=>ao.valor)],P(),x(),w()});let mo=d("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");mo.addEventListener("click",()=>{n=[],P(),x(),w()}),eo.replaceChildren(d("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),ro,mo)}D()}let N=()=>u?.posicionar();function R(E){let $=l.length,S=E.target,O=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],G=!!S?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(E.key==="Tab"){let z=O.indexOf(S);if(!E.shiftKey&&z<O.length-1)O[z+1]?.focus();else if(E.shiftKey&&z>=0)z>0?O[z-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{Q(!0);return}E.preventDefault(),E.stopPropagation();return}if(G&&E.key!=="Escape")return;let eo=!s?.querySelector(".spro-combo-busca");if(eo&&E.key===" "){let z=l[c];z&&k(z),E.preventDefault(),E.stopPropagation();return}if(eo&&E.key.length===1&&!E.ctrlKey&&!E.metaKey&&!E.altKey){let z=J(E.key),mo=[...l.keys()].map(ao=>(c+1+ao)%Math.max(1,$)).find(ao=>J(l[ao]?.rotulo??"").startsWith(z));mo!==void 0&&(c=mo,D()),E.preventDefault(),E.stopPropagation();return}switch(E.key){case"ArrowDown":c=$?(c+1)%$:0,D();break;case"ArrowUp":c=$?(c-1+$)%$:0,D();break;case"Home":if(E.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,D();break;case"End":if(E.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,$-1),D();break;case"Enter":{let z=l[c];z?k(z):v();break}case"Escape":Q(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),P(),x(),w();break;default:return}E.preventDefault(),E.stopPropagation()}function oo(E=""){if(s)return;i=E,c=E?0:(()=>{let G=os(r(),i).findIndex(eo=>eo.valor===n[n.length-1]);return G<0?0:G})();let S=C()?d("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:E}):null;if(S&&(S.value=E,S.addEventListener("input",()=>{i=S.value,c=0,w(),N()})),s=d("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},S?d("div",{class:"spro-combo-cabeca"},q("busca",15),S):null,d("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:S?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),d("div",{class:"spro-combo-extras"}),o.multiplo?d("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",R),u=Yn(b,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>Q(!1)}),b.setAttribute("aria-expanded","true"),b.setAttribute("aria-controls",`${e}-lista`),b.classList.add("spro-combo-aberto"),w(),N(),!s)return;(S??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),S&&E&&S.setSelectionRange?.(E.length,E.length)}function Q(E=!1){s&&(u?.fechar(),u=null,s=null,i="",b.setAttribute("aria-expanded","false"),b.removeAttribute("aria-controls"),b.classList.remove("spro-combo-aberto"),E&&b.focus?.({preventScroll:!0}))}return b.addEventListener("click",()=>s?Q(!0):oo()),b.addEventListener("keydown",E=>{s||(E.key==="ArrowDown"||E.key==="ArrowUp"?(E.preventDefault(),oo()):E.key.length===1&&E.key!==" "&&!E.ctrlKey&&!E.metaKey&&!E.altKey&&C()&&(E.preventDefault(),oo(E.key)))}),x(),{el:b,valor:()=>[...n],definir(E,$=!1){n=[...E],x(),w(),$&&P()},atualizar(){x(),w()},definirVazio(E){p=E,x()},definirEstado(E){f=E,x(),w(),N()},abrir:oo,fechar:()=>Q(!1)}}var rs="#tblProcessosRecebidos input[type=checkbox], #tblProcessosGerados input[type=checkbox], #tblProcessosDetalhado input[type=checkbox]",et=o=>o.getAttribute("value")??o.closest("tr")?.id.replace(/^P/,"")??"";function rt(o){let e=new Set;for(let r of o.querySelectorAll(rs))r.checked&&et(r)&&e.add(et(r));return e}function ts(o,e){let r=new Set(e);for(let t of o.querySelectorAll(rs)){let a=et(t);a&&(r.delete(a),!t.disabled&&!!t.checked!==e.has(a)&&t.click())}return[...r]}function bl(o){let e=o.composedPath?.()??[];if(e.length)return e.some(r=>r.id==="spro-grade");for(let r=o.target;r;r=r.parentNode)if(r.id==="spro-grade")return!0;return!1}function as(o,e){let r=!1,t=a=>{a&&bl(a)||r||(r=!0,queueMicrotask(()=>{r=!1,e(rt(o))}))};return o.addEventListener("click",t,!0),o.addEventListener("change",t,!0),()=>{o.removeEventListener("click",t,!0),o.removeEventListener("change",t,!0)}}function vl(o){return/acaoControleProcessos\(\s*['"][^'"]*['"]\s*,\s*true/.test(o.elemento.getAttribute("onclick")??"")}function ns(o,e){return vl(o)&&e===0?{ok:!1,motivo:"Marque ao menos um processo."}:(o.elemento.click(),{ok:!0})}var xl=o=>o instanceof Error?o.message:String(o);function ss(o){if(o.tipo==="atribuicao")return{...o,para:o.de,de:o.para};let e={tipo:"marcador",id:o.id,protocolo:o.protocolo};return o.adicionar&&(e.remover=o.adicionar),o.remover&&(e.adicionar=o.remover,o.texto&&(e.texto=o.texto)),e}async function Al(o,e){try{if(o.tipo==="atribuicao")return await e.atribuir(o.protocolo,o.para),{ok:!0,desfazer:ss(o)};if(o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,...o.texto?{texto:o.texto}:{}}),o.remover)try{await e.marcador(o.protocolo,{marcador:o.remover,remover:!0})}catch(r){throw o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,remover:!0}).catch(()=>{}),r}return{ok:!0,desfazer:ss(o)}}catch(r){return{ok:!1,erro:xl(r)}}}function is(o){let e=Promise.resolve();return{mover(r){let t=e.then(()=>Al(r,o));return e=t.catch(()=>{}),t}}}var Ze=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,cs=Number.MAX_SAFE_INTEGER;function tt(o,e){let r=[e];return o.hora&&o.vencimento&&(r[0]=e.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&r.push(o.texto),o.sigla&&r.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),r.join(`
`)}function ls(o,e){let r=o.vencimento;if(o.concluidoEm&&r)return{situacao:"concluido",texto:`conclu\xEDdo em ${vo(o.concluidoEm).slice(0,5)}`,dica:tt(o,`Prazo de ${vo(r)} conclu\xEDdo em ${vo(o.concluidoEm)}.`),ordem:cs,sorter:`${r} 23:59:59`};if(r){let s=_o(e,r),i=`${r} ${o.hora??"23:59"}:00`,c=tt(o,`Vence em ${vo(r)}.`);return s===0?{situacao:"hoje",texto:"vence hoje",dica:c,ordem:0,sorter:i}:s<0?{situacao:"atrasado",texto:`${Ze(-s)} de atraso`,dica:c,ordem:s,sorter:i}:{situacao:"noPrazo",texto:`vence em ${Ze(s)}`,dica:c,ordem:s,sorter:i}}let t=o.inicio??e,a=_o(t,e);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${Ze(a)}`:`em ${Ze(-a)}`,dica:tt(o,`Contando desde ${vo(t)}.`),ordem:cs-1,sorter:`${t} ${o.hora??"23:59"}:00`}}function ho(o,e){return o.prazo?ls(o.prazo,e.hoje):null}function Po(o,e){return o.vistoEm===void 0?null:Math.max(0,Math.floor((e.agora-o.vistoEm)/864e5))}function No(o,e){return o.ultimaMov?Math.max(0,_o(o.ultimaMov,e.hoje)):null}function ds(o,e){return e.visitaAnterior!==void 0&&o.vistoEm!==void 0&&o.vistoEm>e.visitaAnterior}function ge(o,e){let r=ho(o,e);return!r||r.situacao==="concluido"||r.situacao==="desde"?null:r.ordem}var yl={resp:"resp",responsavel:"resp",atribuido:"resp",atribuicao:"resp",tipo:"tipo",marcador:"marcador",marcadores:"marcador",marc:"marcador",espec:"espec",especificacao:"espec",anot:"anot",anotacao:"anot",nota:"anot",prazo:"prazo",caixa:"caixa",idade:"caixa",novo:"novo",sigilo:"sigilo",sigiloso:"sigilo",grupo:"grupo",retorno:"retorno",protocolo:"protocolo",proc:"protocolo",processo:"protocolo",parado:"parado",mov:"parado",prio:"prio",prioridade:"prio",interessado:"interessado",interessados:"interessado"};function st(o){let e=[],r="",t=!1;for(let a of o)a==='"'?(t=!t,r+=a):/\s/.test(a)&&!t?(r&&e.push(r),r=""):r+=a;return r&&e.push(r),e}var El=o=>o.replace(/^"|"$/g,"");function it(o){let e=[],r=[];for(let t of st(o)){let a=t,n=!1;a.startsWith("-")&&a.length>1&&(n=!0,a=a.slice(1));let s,i=/^([a-zA-Z\u00C0-\u017F]+):(.*)$/.exec(a);if(i){let p=yl[J(i[1])];p&&(s=p,a=i[2])}let c="=";s&&/^[<>]/.test(a)&&(c=a[0],a=a.slice(1));let l=J(El(a));if(!l&&!s)continue;let u={...s?{campo:s}:{},valor:l,original:t,negado:n,comparador:c};e.push(u),r.push({texto:t,termo:u})}return{termos:e,tokens:r}}var Pl=o=>J([o.protocolo,o.protocolo.replace(/\D/g,""),o.tipo,o.especificacao,o.atribuicao?.sigla,o.atribuicao?.nome,...o.marcadores.flatMap(e=>[e.nome,e.texto]),o.anotacao?.texto,o.prazo?.texto,o.prioridade,o.interessados,o.observacao].filter(Boolean).join(" ")),So=(o,e)=>J(o??"").includes(e),us=/^(s|sim|1|true|yes)$/;function at(o){let e=/^(\d+)\s*(d|dia|dias)?$/.exec(o);return e?Number(e[1]):null}function nt(o,e,r){return o===null?!1:e==="<"?o<r:e===">"?o>r:o===r}function Sl(o,e,r){let t=ho(o,r),a=e.valor;if(a==="sem"||a==="nenhum"||a==="nao")return!o.prazo;if(a==="com"||a==="sim")return!!o.prazo;if(!t)return!1;if(a==="atrasado"||a==="atrasados"||a==="vencido")return t.situacao==="atrasado";if(a==="hoje")return t.situacao==="hoje";if(a==="concluido"||a==="concluidos")return t.situacao==="concluido";if(a==="semana"){let s=ge(o,r);return s!==null&&s>=0&&s<=7}let n=at(a);return n!==null?nt(ge(o,r),e.comparador==="="?"<":e.comparador,n):So(o.prazo?.texto,a)}function wl(o,e,r){let t=e.valor;switch(e.campo){case"resp":return t==="sem"||t==="ninguem"?!o.atribuicao:t==="eu"?!!r.eu&&J(o.atribuicao?.sigla??"")===J(r.eu):So(o.atribuicao?.sigla,t)||So(o.atribuicao?.nome,t);case"tipo":return So(o.tipo,t);case"marcador":return t==="sem"||t==="nenhum"?o.marcadores.length===0:t==="com"?o.marcadores.length>0:o.marcadores.some(a=>So(a.nome,t)||So(a.texto,t));case"espec":return So(o.especificacao,t);case"anot":return t==="sem"||t==="nao"?!o.anotacao:t==="com"||t==="sim"?!!o.anotacao:t==="prioridade"||t==="prioritaria"?!!o.anotacao?.prioridade:So(o.anotacao?.texto,t);case"prazo":return Sl(o,e,r);case"caixa":{let a=at(t);return a===null?!1:nt(Po(o,r),e.comparador==="="?">":e.comparador,a)}case"novo":return t==="visita"?ds(o,r):us.test(t)?o.naoVisualizado:t==="nao"?!o.naoVisualizado:!1;case"sigilo":return us.test(t)?o.sigiloso:!o.sigiloso;case"grupo":return t.startsWith("rec")?o.grupo==="recebidos":t.startsWith("ger")?o.grupo==="gerados":!1;case"retorno":return t==="sem"||t==="nao"?o.retornos.length===0:t==="atrasado"?o.retornos.some(a=>a.atrasado):t==="aguardando"?o.retornos.some(a=>a.tipo==="aguardando"):t==="programado"?o.retornos.some(a=>a.tipo==="programado"):o.retornos.length>0;case"parado":{let a=at(t);return a===null?!1:nt(No(o,r),e.comparador==="="?">":e.comparador,a)}case"prio":return So(o.prioridade,t);case"interessado":return So(o.interessados,t);case"protocolo":return J(o.protocolo).includes(t)||o.protocolo.replace(/\D/g,"").includes(t.replace(/\D/g,"")||"\0");default:return!0}}function Ml(o,e,r){if(!o.termos.length)return!0;let t;for(let a of o.termos){let n;if(a.campo?n=wl(e,a,r):(t??=Pl(e),n=t.includes(a.valor)),a.negado?n:!n)return!1}return!0}var ps=(o,e,r)=>{let t=it(e);return t.termos.length?o.filter(a=>Ml(t,a,r)):o};function Ye(o,e){return st(o).filter(r=>r!==e).join(" ")}function ms(o,e,r){let t=/\s/.test(r)?`"${r}"`:r,a=`${e}:${t}`,n=st(o);return n.includes(a)?o:[...n,a].join(" ")}var Dl=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Cl(o,e=[]){return[...o.values()].sort((r,t)=>{let a=e.indexOf(r.chave),n=e.indexOf(t.chave);return a>=0||n>=0?(a<0?-1:a)-(n<0?-1:n):Dl.compare(r.rotulo,t.rotulo)})}function K(o,e,r,t){let a=o.get(e);return a||(a={chave:e,rotulo:r,itens:[],...t?{tom:t}:{}},o.set(e,a)),a}var ee=[["atrasado","Atrasados","perigo"],["hoje","Vencem hoje","aviso"],["semana","Pr\xF3ximos 7 dias","aviso"],["mes","Pr\xF3ximos 30 dias","neutro"],["depois","Depois de 30 dias","neutro"],["desde","Contando desde uma data","neutro"],["concluido","Prazo conclu\xEDdo","neutro"],["sem","Sem prazo","neutro"]];function he(o,e){let r=ho(o,e);if(!r)return"sem";if(r.situacao==="concluido")return"concluido";if(r.situacao==="desde")return"desde";if(r.situacao==="atrasado")return"atrasado";if(r.situacao==="hoje")return"hoje";let t=ge(o,e)??0;return t<=7?"semana":t<=30?"mes":"depois"}var fs=[["recente","Chegaram hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["antigo","H\xE1 mais de 30 dias"],["desconhecido","Sem registro"]];function kl(o,e){let r=Po(o,e);return r===null?"desconhecido":r<1?"recente":r<=7?"semana":r<=30?"mes":"antigo"}function To(o,e){return e.map(r=>o.get(r[0])).filter(r=>!!r)}function be(o){if(!o.marcadores.length)return;if(o.marcadores.length===1)return o.marcadores[0];let e=o.marcadores[o.marcadores.length-1],r=e.dataHora!==void 0;for(let t=0;t<o.marcadores.length;t++){let a=o.marcadores[t];a.dataHora!==void 0&&(!r||a.dataHora>e.dataHora)&&(e=a,r=!0)}return e}function or(o,e,r){if(e==="nenhum")return[{chave:"todos",rotulo:"Todos",itens:o}];let t=new Map;for(let a of o)switch(e){case"responsavel":a.atribuicao?K(t,`u:${a.atribuicao.sigla}`,a.atribuicao.nome===a.atribuicao.sigla?a.atribuicao.sigla:`${a.atribuicao.nome} (${a.atribuicao.sigla})`).itens.push(a):K(t,"sem","Sem respons\xE1vel").itens.push(a);break;case"tipo":K(t,`t:${a.tipo||"-"}`,a.tipo||"Sem tipo").itens.push(a);break;case"marcador":{let n=be(a);n?K(t,`m:${n.nome}`,n.nome).itens.push(a):K(t,"sem","Sem marcador").itens.push(a);break}case"prazo":{let n=he(a,r),s=ee.find(i=>i[0]===n);K(t,n,s[1],s[2]).itens.push(a);break}case"situacao":a.naoVisualizado?K(t,"novo","N\xE3o visualizados","aviso").itens.push(a):K(t,"lido","Visualizados").itens.push(a);break;case"grupo":K(t,a.grupo,a.grupo==="recebidos"?"Recebidos":"Gerados").itens.push(a);break;case"anotacao":a.anotacao?.prioridade?K(t,"prio","Anota\xE7\xE3o com prioridade","aviso").itens.push(a):a.anotacao?K(t,"com","Com anota\xE7\xE3o").itens.push(a):K(t,"sem","Sem anota\xE7\xE3o").itens.push(a);break;case"acompanhamento":a.acompanhamentoEspecial?K(t,"com","Em acompanhamento especial").itens.push(a):K(t,"sem","Fora do acompanhamento especial").itens.push(a);break;case"retorno":a.retornos.some(n=>n.atrasado)?K(t,"atrasado","Retorno atrasado","perigo").itens.push(a):a.retornos.some(n=>n.tipo==="aguardando")?K(t,"aguardando","Aguardando retorno").itens.push(a):a.retornos.length?K(t,"programado","Retorno programado").itens.push(a):K(t,"sem","Sem retorno").itens.push(a);break;case"caixa":{let n=kl(a,r);K(t,n,fs.find(s=>s[0]===n)[1]).itens.push(a);break}case"autuacao":case"recebimento":case"envio":{let n=tn(r.andamentos?.[a.id]?.[e],r.hoje);K(t,n,qr.find(s=>s[0]===n)[1]).itens.push(a);break}case"unidadeEnvio":{let n=r.andamentos?.[a.id]?.unidadeEnvio;n?K(t,`u:${n}`,n).itens.push(a):K(t,"sem","Sem informa\xE7\xE3o").itens.push(a);break}}return e==="prazo"?To(t,ee):e==="caixa"?To(t,fs):e==="autuacao"||e==="recebimento"||e==="envio"?To(t,qr):e==="situacao"?To(t,[["novo",""],["lido",""]]):e==="grupo"?To(t,[["recebidos",""],["gerados",""]]):e==="anotacao"?To(t,[["prio",""],["com",""],["sem",""]]):e==="acompanhamento"?To(t,[["com",""],["sem",""]]):e==="retorno"?To(t,[["atrasado",""],["aguardando",""],["programado",""],["sem",""]]):Cl(t,["sem"])}var ct={nenhum:"Sem agrupamento",responsavel:"Respons\xE1vel",tipo:"Tipo de processo",marcador:"Marcador",prazo:"Prazo",situacao:"Visualiza\xE7\xE3o",grupo:"Recebidos e gerados",anotacao:"Anota\xE7\xE3o",acompanhamento:"Acompanhamento especial",retorno:"Retorno programado",caixa:"Tempo na caixa",autuacao:"Data de autua\xE7\xE3o",recebimento:"Data de recebimento",envio:"Data de envio",unidadeEnvio:"Unidade de envio"};var Ol=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function er(o,e){let r=new Map;for(let t of o)for(let a of e(t)){let n=r.get(a.valor)??{valor:a.valor,rotulo:a.rotulo,n:0};n.n+=1,r.set(a.valor,n)}return[...r.values()].sort((t,a)=>a.n-t.n||Ol.compare(t.rotulo,a.rotulo))}function lt(o,e){let r=er(o,t=>{let a=he(t,e),n=ee.find(i=>i[0]===a)[1],s=a==="atrasado"?"atrasado":a==="hoje"?"hoje":a==="semana"?"semana":a==="sem"?"sem":a==="concluido"?"concluido":"";return s?[{valor:s,rotulo:n}]:[]});return{responsaveis:er(o,t=>t.atribuicao?[{valor:t.atribuicao.sigla,rotulo:`${t.atribuicao.nome} (${t.atribuicao.sigla})`}]:[{valor:"sem",rotulo:"Sem respons\xE1vel"}]),tipos:er(o,t=>t.tipo?[{valor:t.tipo,rotulo:t.tipo}]:[]),marcadores:er(o,t=>t.marcadores.length?t.marcadores.map(a=>({valor:a.nome,rotulo:a.nome})):[{valor:"sem",rotulo:"Sem marcador"}]),prazos:r}}function dt(o){let e=[];o.sigiloso&&e.push("Sigiloso"),o.naoVisualizado&&e.push("N\xE3o visualizado"),o.documentoNovo&&e.push("Documento novo"),o.urgente&&e.push("Urgente"),o.trancado&&e.push("Trancado"),o.acompanhamentoEspecial&&e.push(o.acompanhamentoGrupo?`Acompanhamento especial (${o.acompanhamentoGrupo})`:"Acompanhamento especial");for(let r of o.retornos)e.push(`${r.tipo==="aguardando"?"Aguardando retorno":"Retorno programado"}${r.atrasado?" (atrasado)":""}`);return e}function ut(o,e){let r=ho(o,e);if(!o.prazo||!r)return"";let t=o.prazo.vencimento??o.prazo.inicio;return`${t?vo(t):""}${o.prazo.hora?` ${o.prazo.hora}`:""} (${r.texto})`.trim()}var Ll=(o,e,r)=>{switch(e){case"processo":return o.protocolo;case"tipo":return o.tipo;case"especificacao":return o.especificacao;case"responsavel":return o.atribuicao?o.atribuicao.nome===o.atribuicao.sigla?o.atribuicao.sigla:`${o.atribuicao.nome} (${o.atribuicao.sigla})`:"";case"marcadores":return o.marcadores.map(t=>t.texto?`${t.nome}: ${t.texto}`:t.nome).join("; ");case"prazo":return ut(o,r);case"anotacao":return o.anotacao?.texto.replace(/\s*\n\s*/g," / ")??"";case"caixa":return Zo(Po(o,r));case"parado":return Zo(No(o,r));case"sinais":return dt(o).join("; ")}};function gs(o,e,r){return[e.map(t=>Fo[t]),...o.map(t=>e.map(a=>Ll(t,a,r)))]}var hs=o=>`processos-${o}.csv`,Il=["ID","Protocolo","Link_Permanente","Atribuicao","Etiqueta","Etiqueta_Descricao","Anotacao","Anotacao_Responsavel","Ponto_Controle","Especificacao","Tipo","Data_Autuacao","Data_Autuacao_Descricao","Data_Recebimento","Data_Recebimento_Descricao","Data_Envio","Data_Envio_Descricao","Unidade_Envio","Documento_Incluido","Observacoes","Acompanhamento_Especial"];function bs(o){let e=new Map;if(!o)return e;try{let r=o.getItem("configDataRecebimentoPro");if(!r)return e;let t=JSON.parse(r);if(!Array.isArray(t))return e;for(let a of t)a&&typeof a=="object"&&a.id_procedimento&&e.set(String(a.id_procedimento),a)}catch{}return e}function re(o){if(!o)return"-";let e=/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/.exec(o.trim());if(!e)return o.trim()||"-";let r=e[4]?e[4].length===5?`${e[4]}:00`:e[4]:"00:00:00";return`${e[3]}/${e[2]}/${e[1]} ${r}`}var io=(o,e="-")=>(o??"").replace(/;/g,"").trim()||e;function Nl(o,e){if(o?.observacoes&&Array.isArray(o.observacoes)){let r=o.observacoes.filter(t=>t&&t.unidade).map(t=>`${t.unidade}: ${t.observacao??""}`);if(r.length)return io(r.join(","))}return typeof o?.observacoes=="string"&&o.observacoes.trim()?io(o.observacoes):io(e)}function vs(o,e,r={}){let t=r.urlBase??"",a=r.recebimentos;return[[...Il],...o.map(n=>{let s=be(n),i=a?.get(n.id),c=e.andamentos?.[n.id],l=t?`${t}?acao=procedimento_trabalhar&id_procedimento=${n.id}`:n.link??"-",u=i?.datageracao?re(i.datageracao):c?.autuacao?re(c.autuacao):"-",p=i?.datahora?re(i.datahora):c?.recebimento?re(c.recebimento):"-",f=i?.datesend?re(i.datesend):c?.envio?re(c.envio):"-",y=io(i?.unidadesend??c?.unidadeEnvio),b=io(i?.acompanhamentoesp??n.acompanhamentoGrupo);return[n.id,n.protocolo,l,io(n.atribuicao?.sigla),io(s?.nome),io(s?.texto),io(n.anotacao?.texto),io(n.anotacao?.autor),io(n.pontoControle),io(n.especificacao),io(n.tipo),u,io(i?.descricaodatageracao),p,io(i?.descricao),f,io(i?.descricaosend),y,n.documentoNovo?"Um novo documento foi incluido ou assinado":"",Nl(i,n.observacao),b]})]}function xs(o){let e=r=>{let t=r.replace(/;/g,""),a=t!=="-"&&/^[=+\-@\t\r]/.test(t)?`'${t}`:t;return/["\n\r]/.test(a)?`"${a.replace(/"/g,'""')}"`:a};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}function As(o){let e=new Date(o),r=t=>String(t).padStart(2,"0");return`ListaProcessos_SEIPro_${e.getFullYear()}${r(e.getMonth()+1)}${r(e.getDate())}_${r(e.getHours())}_${r(e.getMinutes())}_${r(e.getSeconds())}.csv`}function ys(o,e,r){let t=[];for(let a of o){let n=r&&e.has(a.chave);if(r&&t.push({tipo:"grupo",grupo:a,recolhido:n}),!n)for(let s of a.itens)t.push({tipo:"processo",processo:s,grupo:a.chave})}return t}var pt=new Intl.Collator("pt-BR",{numeric:!0,sensitivity:"base"});function Es(o){let e=/(\d+)\/(\d{4})-\d+\s*$/.exec(o);if(!e)return null;let r=/(\d+)\s*$/.exec(e[1].split(/[.-]/).pop()??"")?.[1]??e[1];return[Number(e[2]),Number(r)]}function Tl(o,e){let r=Es(o),t=Es(e);return r&&t&&(r[0]-t[0]||r[1]-t[1])||pt.compare(o,e)}function Ps(o,e,r){switch(e){case"tipo":return o.tipo||null;case"responsavel":return o.atribuicao?.sigla??null;case"marcador":return o.marcadores[0]?.nome??null;case"prazo":{let t=ho(o,r);return t?t.ordem:null}case"caixa":return Po(o,r);case"parado":return No(o,r);case"novo":return o.naoVisualizado?0:1}}function $l(o,e){return(r,t)=>{for(let a of o){let n;if(a.campo==="protocolo")n=Tl(r.protocolo,t.protocolo),a.decrescente&&(n=-n);else{let s=Ps(r,a.campo,e),i=Ps(t,a.campo,e);if(s===null&&i===null)continue;if(s===null)return 1;if(i===null)return-1;n=typeof s=="number"&&typeof i=="number"?s-i:pt.compare(String(s),String(i)),a.decrescente&&(n=-n)}if(n)return n}return 0}}function Ss(o,e,r){return e.length?[...o].sort($l(e,r)):o}function ws(o,e,r){let t=o.findIndex(s=>s.campo===e),a=t<0?{campo:e,decrescente:!1}:o[t].decrescente?null:{campo:e,decrescente:!0};if(!r)return a?[a]:[];if(t<0)return[...o,a];let n=[...o];return a?n[t]=a:n.splice(t,1),n}function Ms(o,e){let r=s=>s.trim().toLowerCase(),t=new Map;for(let s of e)s.nome.trim()&&!t.has(r(s.nome))&&t.set(r(s.nome),{nome:s.nome.trim(),texto:s.texto.trim().slice(0,250)});let a=new Map(o.map(s=>[r(s.nome),s])),n=[];for(let s of o)t.has(r(s.nome))||n.push({tipo:"remover",nome:s.nome});for(let[s,i]of t)a.has(s)||n.push({tipo:"adicionar",nome:i.nome,texto:i.texto});for(let[s,i]of t){let c=a.get(s);c&&c.texto.trim()!==i.texto&&n.push({tipo:"texto",nome:c.nome,texto:i.texto})}return n}function Ds(o,e,r=()=>""){let t=[...o.marcadores];for(let a of e)a.tipo==="remover"?t=t.filter(n=>n.nome!==a.nome):a.tipo==="adicionar"?t.push({nome:a.nome,cor:r(a.nome),texto:a.texto}):t=t.map(n=>n.nome===a.nome?{...n,texto:a.texto}:n);return{...o,marcadores:t}}function rr(o){return o.replace(/\r\n?/g,`
`).trim().slice(0,500)}function tr(o,e,r,t=""){let a=rr(e);if(!a){let{anotacao:n,...s}=o;return s}return{...o,anotacao:{texto:a,autor:o.anotacao?.autor??t,prioridade:r}}}function Cs(o,e){if(!e){let{atribuicao:r,...t}=o;return t}return{...o,atribuicao:e}}function ar(o,e,r,t,a){let n=new Set([o.id]);if(t)for(let s of e)n.add(s);return r.filter(s=>n.has(s.id)&&a(s))}function mt(o,e){let r=new Set(e.marcadores.map(t=>t.nome.trim().toLowerCase()));return o.filter(t=>{let a=r.has(t.nome.trim().toLowerCase());return t.tipo==="adicionar"?!a:a})}var nr=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0}),bo="sem";function ks(o,e,r,t={}){let a=new Map,n=(i,c,l,u,p)=>{let f=a.get(i);return f||(f={chave:i,titulo:c,itens:[],aceitaSoltar:l,excedeu:!1,...u?{motivoSomenteLeitura:u}:{},...p?{tom:p}:{}},a.set(i,f)),f};if(e.colunas==="marcador"){if(e.colunasVazias){n(bo,"Sem marcador",!0);for(let i of[...t.marcadores??[]].sort(nr.compare))n(`m:${i}`,i,!0)}for(let i of o){let c=be(i);c?n(`m:${c.nome}`,c.nome,!0).itens.push(i):n(bo,"Sem marcador",!0).itens.push(i)}}else if(e.colunas==="responsavel"){n(bo,"Sem respons\xE1vel",!0);for(let i of t.responsaveis??[])n(`u:${i.sigla}`,`${i.nome} (${i.sigla})`,!0);for(let i of o)i.atribuicao?n(`u:${i.atribuicao.sigla}`,`${i.atribuicao.nome} (${i.atribuicao.sigla})`,!0).itens.push(i):n(bo,"Sem respons\xE1vel",!0).itens.push(i)}else if(e.colunas==="prazo"){for(let[i,c,l]of ee)i!=="desde"&&n(i,c,!1,"O prazo \xE9 definido pelo bot\xE3o de prazo, n\xE3o arrastando.",l);for(let i of o){let c=he(i,r);n(c==="desde"?"sem":c,"",!1).itens.push(i)}}else for(let i of o)n(`t:${i.tipo}`,i.tipo||"Sem tipo",!1,"O tipo do processo n\xE3o muda arrastando.").itens.push(i);let s=[...a.values()];if(e.colunas==="prazo"&&(s=s.filter(i=>i.itens.length||i.titulo)),e.colunas==="marcador"?(e.colunasVazias||(s=s.filter(i=>i.itens.length>0)),s.sort((i,c)=>{let l=c.itens.length-i.itens.length;return l!==0?l:i.chave===bo?1:c.chave===bo?-1:nr.compare(i.titulo,c.titulo)})):e.colunas==="responsavel"?s.sort((i,c)=>i.chave===bo?-1:c.chave===bo?1:nr.compare(i.titulo,c.titulo)):e.colunas==="tipo"&&s.sort((i,c)=>nr.compare(i.titulo,c.titulo)),e.ordemColunas?.length){let i=new Map(e.ordemColunas.map((c,l)=>[c,l]));s.sort((c,l)=>{let u=i.get(c.chave),p=i.get(l.chave);return u!==void 0&&p!==void 0?u-p:u!==void 0?-1:p!==void 0?1:0})}if(e.limite>0)for(let i of s)i.excedeu=i.itens.length>e.limite;return s}function Os(o,e,r){if(e===r)return[...o];let t=o.indexOf(e),a=o.indexOf(r);if(t<0||a<0)return[...o];let n=[...o];return n.splice(t,1),n.splice(a,0,e),n}var sr=o=>o.slice(o.indexOf(":")+1);function Ls(o,e,r,t){if(r===t)return{ok:!1,motivo:"Mesma coluna."};if(o==="marcador"){let a=r===bo?void 0:sr(r),n=t===bo?void 0:sr(t);if(a&&!e.marcadores.some(l=>l.nome===a))return{ok:!1,motivo:"O processo j\xE1 n\xE3o tem esse marcador."};let s=n?e.marcadores.some(l=>l.nome===n):!1,i=a?e.marcadores.find(l=>l.nome===a)?.texto:void 0,c={tipo:"marcador",id:e.id,protocolo:e.protocolo};return a&&(c.remover=a),n&&!s&&(c.adicionar=n,i&&(c.texto=i)),!c.remover&&!c.adicionar?{ok:!1,motivo:"Nada a mudar."}:{ok:!0,movimento:c}}return o==="responsavel"?{ok:!0,movimento:{tipo:"atribuicao",id:e.id,protocolo:e.protocolo,para:t===bo?null:sr(t),de:r===bo?null:sr(r)}}:{ok:!1,motivo:"Esta divis\xE3o do quadro \xE9 s\xF3 de leitura."}}function ft(o,e,r={}){if(e.tipo==="atribuicao"){if(e.para===null){let{atribuicao:a,...n}=o;return n}return{...o,atribuicao:{sigla:e.para,nome:r[e.para]??e.para}}}let t=o.marcadores;return e.remover&&(t=t.filter(a=>a.nome!==e.remover)),e.adicionar&&(t=[...t,{nome:e.adicionar,cor:"",texto:e.texto??"",dataHora:Date.now()}]),{...o,marcadores:t}}function te(o,e){let r=o.ownerDocument??document;for(let n of Array.from(o.querySelectorAll("dialog.spro-dialogo-grade")))n.remove();let t=d("dialog",{class:`spro-dialogo spro-dialogo-grade${e.largo?" spro-dialogo-largo":""}`,"aria-label":e.titulo}),a=()=>{t.open?t.close():t.remove()};return t.append(d("header",{},e.icone?d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},q(e.icone,18)):null,d("h2",{},e.titulo,e.subtitulo?d("small",{class:"spro-dialogo-sub"},e.subtitulo):null),d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:a},q("fechar",16))),d("div",{class:"spro-dialogo-corpo"},e.conteudo)),t.addEventListener("close",()=>{t.remove(),e.aoFechar?.()}),o.append(t),typeof t.showModal=="function"?t.showModal():t.setAttribute("open",""),t.querySelector(".spro-combo, textarea, input:not([type=checkbox])")?.focus({preventScroll:!0}),{fechar:a,dlg:t}}var Rl=["autuacao","recebimento","envio","unidadeEnvio"],xe=o=>Rl.includes(o);function zl(o){let e=Math.floor(o/6e4);return e<1?"agora h\xE1 pouco":e<60?`h\xE1 ${e} min`:`h\xE1 ${Math.floor(e/60)} h`}var ve=(o,e,r)=>`${o} ${o===1?e:r}`;function Is(o){let e={},r=null,t=!1,a=!1,n,s=d("div",{class:"spro-andamento",hidden:!0,role:"status","aria-live":"polite"}),i=()=>o.processos().filter(v=>!!v.link&&!v.sigiloso&&!v.naoVisualizado),c=()=>Object.values(e).filter(v=>pe(v,o.agora())),l=()=>i().filter(v=>!e[v.id]||!pe(e[v.id],o.agora())),u=()=>{let v=o.processos();return{naoVistos:v.filter(M=>M.naoVisualizado&&!M.sigiloso).length,sigilosos:v.filter(M=>M.sigiloso).length,semLink:v.filter(M=>!M.link&&!M.sigiloso&&!M.naoVisualizado).length}};async function p(){try{e=await o.armazem.lerAndamentos(o.agora())}catch{e={}}o.aoMudar()}function f(v,M){return new Promise(D=>{let w=!1,N=u(),R=[];N.naoVistos&&R.push(`${ve(N.naoVistos,"processo ainda n\xE3o visualizado","processos ainda n\xE3o visualizados")} nesta unidade (abrir o andamento o marcaria como visualizado ou recebido em seu nome)`),N.sigilosos&&R.push(`${ve(N.sigilosos,"processo sigiloso","processos sigilosos")}`);let oo=d("button",{type:"button",class:"spro-botao primario",onclick:()=>{w=!0,D(!0),E.fechar()}},q("busca",15),"Consultar andamento"),Q=d("div",{class:"spro-confirma-andamento"},d("p",{},"Para agrupar por data ou por unidade de envio, o SEI Pro precisa ",d("strong",{},"abrir o andamento de cada processo, um por um")," no SEI. A consulta \xE9 s\xF3 de leitura, mas faz v\xE1rias requisi\xE7\xF5es por processo e pode levar alguns minutos."),d("p",{},d("strong",{},`Ser\xE3o consultados ${ve(v,"processo","processos")}.`),M?` Outros ${M} j\xE1 est\xE3o guardados e ficam como est\xE3o.`:""),R.length?d("div",{},d("p",{},"Ficam de fora:"),d("ul",{},...R.map($=>d("li",{},$)))):null,d("p",{class:"spro-suave"},"O resultado fica guardado neste navegador por 24 horas: ao recarregar a p\xE1gina, ele reaparece sem nova consulta. Voc\xEA pode cancelar a consulta a qualquer momento."),d("div",{class:"spro-dialogo-rodape"},oo)),E=te(o.sombra,{titulo:"Consultar o andamento dos processos",icone:"alerta",conteudo:Q,aoFechar:()=>D(w)})})}function y(){if(o.semDebounce)return o.aoMudar();n||(n=setTimeout(()=>{n=void 0,t||o.aoMudar()},400))}async function b(){try{await o.armazem.gravarAndamentos(e)}catch{}}async function P(v){if(r||!v.length||t)return;let M=new AbortController;r={ctl:M,progresso:{feitos:0,total:v.length,semDados:0}},k();let D=0,w=await an({alvos:v,sinal:M.signal,simultaneas:o.simultaneas,pausaMs:o.pausaMs,esperar:o.esperar,consultar:(N,R)=>o.consultar(N,R),aoResolver:(N,R,oo,Q)=>{r&&(r.progresso=oo),Q||(e[N.id]={...R??{},consultadoEm:o.agora()}),D+=1,D>=10&&(D=0,b()),k(),y()}});r=null,await b(),clearTimeout(n),n=void 0,!t&&(o.aoMudar(),w.motivo==="sessao"?o.aviso("A sess\xE3o do SEI expirou: a consulta parou. O que j\xE1 foi lido ficou guardado."):w.motivo==="erros"?o.aviso("O SEI parou de responder: a consulta foi interrompida. O que j\xE1 foi lido ficou guardado."):w.motivo==="concluida"&&o.aviso(`Andamento consultado: ${ve(w.progresso.feitos-w.progresso.semDados,"processo","processos")} com dados${w.progresso.semDados?`, ${w.progresso.semDados} sem informa\xE7\xE3o`:""}.`))}async function x(v){if(r)return!0;let M=v==="todos"?i():l();if(!M.length)return o.aviso(v==="todos"?"Nenhum processo eleg\xEDvel para consultar.":"Todos os processos j\xE1 t\xEAm o andamento guardado."),!1;let D=v==="todos"?0:i().length-M.length;return await f(M.length,D)?(P(M),!0):!1}async function C(){return r||!l().length?!0:await x("novo")||c().length>0}function k(){if(s.hidden=!a||t,s.hidden)return;if(r){let{feitos:N,total:R}=r.progresso;s.replaceChildren(d("span",{},`Consultando o andamento dos processos\u2026 ${N} de ${R}`),d("progress",{max:String(R),value:String(N),"aria-label":"Progresso da consulta"}),d("button",{type:"button",class:"spro-link",onclick:()=>r?.ctl.abort()},"Cancelar"));return}let v=c();if(!v.length){s.replaceChildren(d("span",{},'O andamento dos processos ainda n\xE3o foi consultado, por isso todos aparecem em "Sem informa\xE7\xE3o".'),d("button",{type:"button",class:"spro-link",onclick:()=>void x("novo")},"Consultar agora"));return}let M=Math.min(...v.map(N=>N.consultadoEm)),D=M+Hr,w=l().length;s.replaceChildren(d("span",{},`Andamento consultado ${zl(o.agora()-M)} (guardado at\xE9 ${new Date(D).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})`,w?` \xB7 ${ve(w,"processo ainda sem consulta","processos ainda sem consulta")}`:""),d("button",{type:"button",class:"spro-link",onclick:()=>void x("todos")},q("atualizar",13)," Atualizar"))}return{faixa:s,carregar:p,dados:()=>e,definirAtivo(v){a=v,k()},atualizarFaixa:k,aoEscolherAgrupamento:C,pedir:x,emAndamento:()=>!!r,fechar(){t=!0,r?.ctl.abort(),clearTimeout(n)}}}var _l=[[/azul_marinho|marinho/,"#1d3557"],[/azul_claro|ciano|celeste/,"#2a9fd6"],[/azul/,"#2563c9"],[/verde_escuro/,"#166534"],[/verde|lima/,"#2e9e4f"],[/amarelo/,"#e0b000"],[/laranja/,"#ee7d11"],[/vermelho/,"#d1352b"],[/rosa|magenta/,"#d6409f"],[/roxo|violeta|lilas/,"#7048c6"],[/marrom/,"#8a5a3c"],[/preto/,"#222831"],[/branco/,"#ffffff"],[/cinza/,"#7b838c"]];function jo(o){let e=o.toLowerCase();return _l.find(([r])=>r.test(e))?.[1]??"#8b939c"}var ql="http://www.w3.org/2000/svg";function Go(o,e,r=document){let t=r.createElementNS(ql,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,n);return t}function Hl(){let o=Go("svg",{viewBox:"0 0 24 24",width:"17",height:"17","aria-hidden":"true",focusable:"false"});return o.append(Go("path",{d:"M12 3L2.2 20h19.6L12 3z",fill:"#facc15",stroke:"#9ca3af","stroke-width":"1.4","stroke-linejoin":"round"}),Go("path",{d:"M12 9.2v5.2",stroke:"#111827","stroke-width":"2.1","stroke-linecap":"round"}),Go("circle",{cx:"12",cy:"17.3",r:"1.2",fill:"#111827"})),o}function Vl(o){let e=jo(o),r=e==="#ffffff"||e==="#e0b000",t=Go("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",focusable:"false"});return t.append(Go("path",{d:"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",fill:e,stroke:r?"#9ca3af":"none","stroke-width":r?"1.5":"0","stroke-linejoin":"round"}),Go("circle",{cx:"7.2",cy:"7.2",r:"1.7",fill:r?"#9ca3af":"#ffffff"})),t}var gt="application/x-spro-cartao",ir="application/x-spro-coluna";function Fl(o,e){if(!o.anotacao?.texto?.trim())return null;let t=!o.sigiloso&&!!e.aoEditarAnotacao,n=Oo(o.anotacao.texto).map((c,l)=>{if(c.marca===null)return d("div",{class:"spro-anot-linha"},c.texto||"\xA0");let u=d("button",{type:"button",role:"checkbox",class:`spro-anot-check${c.marca?" spro-anot-check-on":""}`,"aria-checked":String(c.marca),"aria-label":c.marca?`Desmarcar ${c.texto}`:`Marcar ${c.texto}`,title:c.marca?"Desmarcar tarefa":"Marcar tarefa como conclu\xEDda",draggable:"false",onmousedown:p=>p.stopPropagation(),onclick:p=>{p.preventDefault(),p.stopPropagation(),e.aoAlternarTarefa?.(o.id,l)}},c.marca?"\u2713":"");return d("div",{class:`spro-anot-linha spro-anot-tarefa${c.marca?" spro-anot-feita":""}`},u,d("span",{class:"spro-anot-txt"},c.texto))}),s=[o.anotacao?.autor?`\xDAltima edi\xE7\xE3o: ${o.anotacao.autor}`:"",t?"Clique para editar a anota\xE7\xE3o":""].filter(Boolean).join(`
`);return d("div",{class:`spro-cartao-anotacao${o.anotacao?.prioridade?" spro-cartao-anotacao-prio":""}${t?" spro-cartao-anotacao-editavel":""}`,title:s||void 0,...t?{onclick:c=>{c.stopPropagation(),e.aoEditarAnotacao?.(o.id)}}:{}},...n)}function jl(o,e,r){let t=[];if(o.documentoNovo){let n=o.documentoNovoDica||"Um documento foi inclu\xEDdo ou assinado neste processo";t.push(d("span",{class:"spro-cartao-excl",title:n,"aria-label":n},Hl()))}let a=r.cfg.colunas==="marcador"?o.marcadores.filter(n=>`m:${n.nome}`!==e):o.marcadores;for(let n of a){let s=n.texto?`${n.nome}
${n.texto}`:n.nome;t.push(d("span",{class:"spro-cartao-marc-ic",title:s,"aria-label":s},Vl(n.cor)))}return t.length?d("div",{class:"spro-cartao-sinais"},...t):null}function Gl(o,e,r){let t=ho(o,r.ctx),a=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${o.protocolo}`});a.checked=r.selecionados.has(o.id),a.addEventListener("change",()=>r.aoSelecionar(o.id,a.checked));let n=t?"Editar o prazo":"Definir um prazo",s=r.aoAbrirPrazo?d("button",{type:"button",class:"spro-prazo-b",title:t?`${t.dica}

${n}`:n,"aria-label":n,onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoAbrirPrazo?.(o.id)}},t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`},t.texto):d("span",{class:"spro-prazo-vazio"},"definir")):t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`,title:t.dica},t.texto):null,i=Fl(o,r),c=jl(o,e,r),l=!i&&!o.sigiloso&&r.aoEditarAnotacao?d("button",{type:"button",class:"spro-anot-vazia",title:"Adicionar anota\xE7\xE3o","aria-label":"Adicionar anota\xE7\xE3o",onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoEditarAnotacao?.(o.id)}},"+ anota\xE7\xE3o"):null,u=d("div",{class:`spro-cartao${a.checked?" spro-sel":""}`,draggable:"true","data-id":o.id,"data-de":e},d("div",{class:"spro-cartao-topo"},a,d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",draggable:"false"},o.protocolo)),o.tipo?d("div",{class:"spro-cartao-tipo"},o.tipo):null,o.especificacao?d("div",{class:"spro-cartao-espec",title:o.especificacao},o.especificacao):null,i,c,d("div",{class:"spro-cartao-rodape"},d("div",{class:"spro-cartao-acoes"},s,l),o.atribuicao?d("span",{class:"spro-avatar",title:o.atribuicao.nome},o.atribuicao.sigla.slice(0,2).toUpperCase()):null));return u.addEventListener("dragstart",p=>{p.stopPropagation(),p.dataTransfer?.setData(gt,JSON.stringify({id:o.id,de:e})),p.dataTransfer?.setData("text/plain",o.protocolo),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"),u.classList.add("spro-arrastando")}),u.addEventListener("dragend",()=>u.classList.remove("spro-arrastando")),u}function Ul(o,e,r){let t=r.cfg.colunasRecolhidas?.includes(o.chave)??!1,a=d("div",{class:"spro-col-corpo"},...o.itens.map(u=>Gl(u,o.chave,r)));o.itens.length||a.append(d("div",{class:"spro-col-vazia"},o.aceitaSoltar?"Solte aqui":"Vazia"));let n=r.cfg.limite,s=!!r.aoReordenarColuna,i=r.aoAlternarColuna?d("button",{type:"button",class:"spro-col-recolher","aria-expanded":String(!t),"aria-label":t?`Expandir coluna ${o.titulo}`:`Recolher coluna ${o.titulo}`,title:t?"Expandir coluna":"Recolher coluna",draggable:"false",onmousedown:u=>u.stopPropagation(),onclick:u=>{u.preventDefault(),u.stopPropagation(),r.aoAlternarColuna?.(o.chave)}},t?"+":"\u2212"):null,c=d("div",{class:`spro-col-topo${s?" spro-col-arrastavel":""}`,...s?{draggable:"true",title:"Arraste para reordenar a coluna"}:{}},s?d("span",{class:"spro-col-alca","aria-hidden":"true"},"\u22EE\u22EE"):null,d("span",{class:"spro-col-titulo",title:o.titulo},o.titulo),d("span",{class:`spro-col-n${o.excedeu?" spro-excedeu":""}`,title:o.excedeu?`Passou do limite de ${n}`:void 0},n>0?`${o.itens.length}/${n}`:String(o.itens.length)),i,o.aceitaSoltar?null:d("span",{class:"spro-col-trava",title:o.motivoSomenteLeitura},go("bloquear",13))),l=d("section",{class:`spro-col${o.tom?` spro-tom-${o.tom}`:""}${o.excedeu?" spro-col-cheia":""}${t?" spro-col-recolhida":""}`,"data-chave":o.chave},c,a);return s&&(c.addEventListener("dragstart",u=>{u.stopPropagation(),u.dataTransfer?.setData(ir,o.chave),u.dataTransfer?.setData("text/plain",o.titulo),u.dataTransfer&&(u.dataTransfer.effectAllowed="move"),l.classList.add("spro-col-arrastando")}),c.addEventListener("dragend",()=>l.classList.remove("spro-col-arrastando"))),l.addEventListener("dragover",u=>{if(s&&u.dataTransfer?.types.includes(ir)){u.preventDefault(),l.classList.add("spro-col-alvo");return}u.dataTransfer?.types.includes(gt)&&o.aceitaSoltar&&(u.preventDefault(),l.classList.add("spro-alvo"))}),l.addEventListener("dragleave",()=>{l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo")}),l.addEventListener("drop",u=>{if(l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo"),s&&u.dataTransfer?.types.includes(ir)){let f=u.dataTransfer.getData(ir);if(f){u.preventDefault(),f!==o.chave&&r.aoReordenarColuna?.(f,o.chave,e);return}}let p=u.dataTransfer?.getData(gt);if(p){u.preventDefault();try{let{id:f,de:y}=JSON.parse(p);r.aoMover(f,y,o.chave)}catch{}}}),l}function Ns(o){let e=d("div",{class:"spro-quadro"});e.style.setProperty("--spro-col-largura",`${o.cfg.larguraColuna??280}px`);let r=t=>{let a=ks(t,o.cfg,o.ctx,o.extras),n=a.map(s=>s.chave);return d("div",{class:"spro-colunas"},...a.map(s=>Ul(s,n,o)))};if(o.cfg.raiasPorResponsavel&&o.cfg.colunas!=="responsavel")for(let t of or(o.processos,"responsavel",o.ctx))e.append(d("div",{class:"spro-raia"},d("div",{class:"spro-raia-nome"},t.rotulo,d("span",{class:"spro-grupo-n"},String(t.itens.length))),r(t.itens)));else e.append(r(o.processos));return o.processos.length||e.prepend(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro.")),e}var Ts=".spro-fav-estrela, .spro-prj-ic, .spro-dem-cx",Bl=[".spro-fav-",".spro-prj-",".spro-dem-cx"],$s=(o,e)=>o.getElementById(`P${e}`)?.querySelectorAll("td")[1],cr=["spro-fav-estrela","spro-prj-ic","spro-dem-cx"],ht=o=>cr.find(e=>o.classList.contains(e))??"";function Xl(o,e,r){for(let t of Array.from(o.attributes))!e.hasAttribute(t.name)&&t.name!=="data-spro-id"&&t.name!=="data-tip"&&o.removeAttribute(t.name);for(let t of Array.from(e.attributes))t.name!=="aria-busy"&&t.name!=="title"&&o.getAttribute(t.name)!==t.value&&o.setAttribute(t.name,t.value);e.getAttribute("title")&&o.getAttribute("data-tip")!==e.getAttribute("title")&&o.setAttribute("data-tip",e.getAttribute("title")),o.removeAttribute("aria-busy"),o.setAttribute("data-spro-id",r),o.innerHTML!==e.innerHTML&&o.replaceChildren(...Array.from(e.cloneNode(!0).childNodes))}function Rs(){let o=new Map;return function(r,t){let a=$s(r,t),n=new Set,s=[];if(a){let i=[...a.querySelectorAll(Ts)].sort((c,l)=>cr.indexOf(ht(c))-cr.indexOf(ht(l)));for(let c of i){let l=`${t}|${ht(c)}`;n.add(l);let u=o.get(l);u?Xl(u,c,t):(u=c.cloneNode(!0),u.removeAttribute("aria-busy"),u.setAttribute("data-spro-id",t),o.set(l,u)),s.push(u)}}for(let i of cr)n.has(`${t}|${i}`)||o.delete(`${t}|${i}`);return s}}function bt(o,e){let r=$s(o,e);return r?[...r.querySelectorAll(`${Ts}, .acompanhamentoesp_icon`)].map(t=>`${t.className}|${t.getAttribute("aria-pressed")??""}|${t.getAttribute("aria-label")??""}|${t.hasAttribute("data-atraso")?1:0}|${t.querySelector('[class$="-n"]')?.textContent??""}`).join(";"):""}function zs(o){let e=[];for(let r of Array.from(o.styleSheets??[])){let t;try{t=r.cssRules}catch{continue}for(let a of Array.from(t)){let n=a.cssText;Bl.some(s=>n.includes(s))&&e.push(n)}}return e.join(`
`)}var Ql=30;function Jl(o){let e=[],r=(a,n)=>{let s=a?.getAttribute("data-tarefa");e.push({marca:s==null?null:s==="x",texto:n.replace(/\u00a0/g," ").replace(/\n+$/,"")})},t="";for(let a of Array.from(o.childNodes))if(a.nodeType===3)t+=a.textContent??"";else if(a.nodeType===1){let n=a;if(t){for(let s of t.split(`
`))r(null,s);t=""}n.tagName==="BR"?r(null,""):r(n,n.textContent??"")}if(t)for(let a of t.split(`
`))r(null,a);return e.length?e:[{marca:null,texto:""}]}function _s(o,e){let r=o.ownerDocument;o.replaceChildren(...e.map(t=>{let a=r.createElement("div");return a.className="spro-pi-linha",t.marca!==null&&a.setAttribute("data-tarefa",t.marca?"x":"o"),t.texto?a.textContent=t.texto:a.append(r.createElement("br")),a}))}function qs(o,e){let r=o.prioridade,t=()=>{},a=d("div",{class:"spro-pi-editor",contenteditable:"true",role:"textbox","aria-multiline":"true","aria-label":"Anota\xE7\xE3o",spellcheck:"true"}),n=d("span",{class:"spro-pi-contador"}),s=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Lista de tarefas (nas linhas selecionadas)","aria-label":"Lista de tarefas"},q("check",16)),i=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Prioridade","aria-label":"Prioridade"},go("prioridade",16)),c=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Inserir a data de hoje","aria-label":"Inserir a data de hoje"},q("calendario",16)),l=d("div",{class:"spro-pi-barra"},s,c,i,n),u=d("div",{class:"spro-pi"},a,l),p=()=>Jl(a),f=()=>qe(p());function y(){u.classList.toggle("spro-pi-prio",r),i.setAttribute("aria-pressed",String(r));let x=f().length;n.textContent=`${x}/${500}`,n.classList.toggle("spro-pi-estouro",x>500),t()}_s(a,Oo(o.texto)),y();function b(){let x=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,C=Array.from(a.children),k=N=>{let R=N;for(;R&&R.parentNode!==a;)R=R.parentNode;return R?C.indexOf(R):-1};if(!x||!x.rangeCount)return[];let v=k(x.anchorNode),M=k(x.focusNode);if(v<0&&M<0)return[];let[D,w]=[Math.min(v<0?M:v,M<0?v:M),Math.max(v,M)];return Array.from({length:w-D+1},(N,R)=>D+R)}let P=x=>{_s(a,x),y()};for(let x of[s,c,i])x.addEventListener("mousedown",C=>C.preventDefault());return s.addEventListener("click",()=>{let x=p(),C=b();P(Fr(x,C.length?C:x.map((k,v)=>v).filter(k=>k===x.length-1))),a.focus()}),i.addEventListener("click",()=>{r=!r,y()}),c.addEventListener("click",()=>{a.focus();let x=vo(Jo());e.ownerDocument.execCommand?.("insertText",!1,x)||(a.append(x),y())}),a.addEventListener("input",y),a.addEventListener("paste",x=>{x.preventDefault();let C=x.clipboardData?.getData("text/plain")??"";e.ownerDocument.execCommand?.("insertText",!1,C.replace(/\r\n?/g,`
`))}),a.addEventListener("mousedown",x=>{let C=x.target.closest?.(".spro-pi-linha");!C||!C.hasAttribute("data-tarefa")||x.clientX-C.getBoundingClientRect().left>Ql||(x.preventDefault(),P(He(p(),Array.from(a.children).indexOf(C))))}),a.addEventListener("keydown",x=>{if(x.key!=="Enter"||x.shiftKey)return;let C=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,k=b(),v=p();C?.isCollapsed&&k.length===1&&v[k[0]]?.marca!==null&&!v[k[0]].texto.trim()&&(x.preventDefault(),P(Fr(v,[k[0]])))}),{el:u,texto:f,prioridade:()=>r,aoMudar:x=>{t=x},foco:()=>{a.focus()}}}var Wl=o=>o instanceof Error?o.message:String(o);async function vt(o,e,r,t,a){let n=0,s=[],i=0;for(let c of e){let l=o.todos().find(u=>u.id===c.id)??c;o.aplicarLocal(l.id,r(l));try{await o.gravar(()=>t(l)),n+=1}catch(u){o.aplicarLocal(l.id,l),s.push(`${l.protocolo}: ${Wl(u)}`)}a?.(i+=1,e.length)}return{ok:n,falhas:s}}function xt(o,e,r){e.falhas.length?o.aviso(`${r}: ${e.ok} ok, ${e.falhas.length} com erro \u2014 ${e.falhas[0]}`):o.aviso(`${r}: ${e.ok} ${e.ok===1?"processo atualizado":"processos atualizados"}.`)}function Hs(o,e,r){let t=ar(e,o.selecionados(),o.todos(),!0,r).filter(n=>n.id!==e.id);if(!t.length)return null;let a=d("input",{type:"checkbox"});return{el:d("label",{class:"spro-rotulo-linha spro-estender"},a,` Aplicar tamb\xE9m aos ${t.length} ${t.length===1?"outro selecionado":"outros selecionados"}`),marcado:()=>a.checked,n:()=>t.length}}var At=(...o)=>d("div",{class:"spro-dialogo-rodape"},...o),yt=(o="Salvar")=>d("button",{type:"button",class:"spro-botao primario"},q("check",15),o);function Vs(o,e){let r=[],t=e.atribuicao?.sigla??"",a=Io({rotulo:"Respons\xE1vel",icone:"pessoa",busca:!0,larguraLista:320,vazio:"Escolher o respons\xE1vel\u2026",opcoes:()=>[{valor:"",rotulo:"Sem respons\xE1vel",descricao:"Remove a atribui\xE7\xE3o"},...r.map(u=>({valor:u.sigla,rotulo:u.nome===u.sigla?u.sigla:u.nome,descricao:u.sigla}))],valor:[t],aoMudar:([u])=>{t=u??"",c()}}),n=Hs(o,e,()=>!0),s=yt(),i=d("p",{class:"spro-suave"},"Carregando os usu\xE1rios da unidade\u2026"),c=()=>{s.disabled=!r.length||t===(e.atribuicao?.sigla??"")},l=te(o.raiz,{titulo:"Respons\xE1vel",subtitulo:e.protocolo,icone:"pessoa",conteudo:d("div",{class:"spro-form"},d("label",{class:"spro-campo-rotulo"},"Atribuir a",a.el),i,n?.el??null,At(s))});o.extras().then(u=>{r=u.responsaveis??[],i.textContent=r.length?"":"N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade.",a.atualizar(),c()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade."}),c(),s.addEventListener("click",async()=>{let u=t?r.find(f=>f.sigla===t)??{sigla:t,nome:t}:null,p=n?.marcado()?ar(e,o.selecionados(),o.todos(),!0,()=>!0):[e];s.disabled=!0,l.fechar(),xt(o,await vt(o,p,f=>Cs(f,u),f=>o.atribuir(f.protocolo,u?.sigla??null)),u?`Respons\xE1vel: ${u.nome}`:"Atribui\xE7\xE3o removida")})}function Et(o,e){let r=qs({texto:e.anotacao?.texto??"",prioridade:e.anotacao?.prioridade??!1},o.raiz),t=yt(),a=e.anotacao?d("button",{type:"button",class:"spro-botao perigo"},q("lixeira",15),"Remover anota\xE7\xE3o"):null,n=()=>{let c=rr(r.texto()),l=r.texto().length>500;t.disabled=!c||l||c===(e.anotacao?.texto??"")&&r.prioridade()===(e.anotacao?.prioridade??!1)};r.aoMudar(n);let s=te(o.raiz,{titulo:"Anota\xE7\xE3o",subtitulo:e.protocolo,icone:"nota",largo:!0,conteudo:d("div",{class:"spro-form"},r.el,e.anotacao?.autor?d("p",{class:"spro-suave"},`\xDAltima edi\xE7\xE3o: ${e.anotacao.autor}`):null,At(a,t))});r.foco(),n();let i=async(c,l,u)=>{s.fechar(),xt(o,await vt(o,[e],p=>tr(p,c,l,o.autor),p=>o.anotar(p.protocolo,{texto:c,prioridade:l})),u)};t.addEventListener("click",()=>void i(rr(r.texto()),r.prioridade(),"Anota\xE7\xE3o salva")),a?.addEventListener("click",()=>void i("",!1,"Anota\xE7\xE3o removida"))}function Fs(o,e){let r=e.marcadores.map(f=>({nome:f.nome,texto:f.texto})),t=[],a=d("div",{class:"spro-marcadores-lista"}),n=Hs(o,e,f=>!f.sigiloso),s=yt(),i=d("p",{class:"spro-suave"},"Carregando os marcadores da unidade\u2026"),c=Io({rotulo:"Adicionar marcador",icone:"etiqueta",busca:!0,larguraLista:320,vazio:"Adicionar marcador\u2026",opcoes:()=>t.filter(f=>!r.some(y=>y.nome.toLowerCase()===f.toLowerCase())).map(f=>({valor:f,rotulo:f,cor:jo(o.corDoMarcador(f))})),aoMudar:([f])=>{f&&(r=[...r,{nome:f,texto:""}],c.definir([],!1),u())}}),l=()=>Ms(e.marcadores,r);function u(){a.replaceChildren(...r.length?r.map((f,y)=>{let b=d("input",{type:"text",class:"spro-campo",maxlength:String(250),placeholder:"Texto do marcador (opcional)","aria-label":`Texto de ${f.nome}`,value:f.texto});return b.addEventListener("input",()=>{r[y]={...f,texto:b.value},s.disabled=!l().length}),d("div",{class:"spro-marcador-linha"},d("span",{class:"spro-marcador",title:f.nome},d("i",{style:`background:${jo(o.corDoMarcador(f.nome))}`}),f.nome),b,d("button",{type:"button",class:"spro-botao-icone pequeno",title:`Remover ${f.nome}`,"aria-label":`Remover ${f.nome}`,onclick:()=>{r=r.filter((P,x)=>x!==y),u()}},q("fechar",13)))}):[d("p",{class:"spro-suave"},"Nenhum marcador. Adicione abaixo.")]),c.atualizar(),s.disabled=!l().length}let p=te(o.raiz,{titulo:"Marcadores",subtitulo:e.protocolo,icone:"etiqueta",conteudo:d("div",{class:"spro-form"},a,c.el,i,n?.el??null,At(s))});u(),o.extras().then(f=>{t=f.marcadores??[],i.textContent=t.length?"":"N\xE3o foi poss\xEDvel ler os marcadores da unidade.",u()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os marcadores da unidade."}),s.addEventListener("click",async()=>{let f=l();if(!f.length)return;let y=n?.marcado()?ar(e,o.selecionados(),o.todos(),!0,b=>!b.sigiloso):[e];p.fechar(),xt(o,await vt(o,y,b=>Ds(b,mt(f,b),o.corDoMarcador),async b=>{for(let P of mt(f,b))P.tipo==="remover"?await o.marcar(b.protocolo,{marcador:P.nome,remover:!0}):await o.marcar(b.protocolo,{marcador:P.nome,texto:P.texto})}),"Marcadores")})}function js(o,e,r,t,a=8){let n=Math.max(1,e),s=t>0?t:n*40,i=Math.max(0,Math.min(o,Math.floor(r/n)-a)),c=Math.min(o,Math.ceil((r+s)/n)+a);return{inicio:i,fim:c,antes:i*n,depois:Math.max(0,o-c)*n}}async function Zl(o,e){let r=o.defaultView?.navigator?.clipboard?o.defaultView.navigator:globalThis.navigator;try{if(r?.clipboard?.writeText)return await r.clipboard.writeText(e),!0}catch{}try{let t=d("textarea",{readonly:!0,"aria-hidden":"true",style:"position:fixed;top:0;left:-9999px;opacity:0"});t.value=e,o.body.append(t),t.select();let a=o.execCommand("copy");return t.remove(),a}catch{return!1}}var Yl=1500;function Gs(o){let r=p=>`${p}${o.compacto?" spro-acao-num-compacta":""}`,t=`Abrir ${o.protocolo} em nova aba`,a;o.href?(a=d("a",{class:r("spro-nova-guia"),href:o.href,target:"_blank",rel:"noopener","aria-label":t},q("novaAba",14)),a.addEventListener("click",p=>p.stopPropagation())):(a=d("button",{type:"button",class:r("spro-nova-guia"),"aria-label":t},q("novaAba",14)),a.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),o.aoAbrirNovaAba?.()})),a.addEventListener("keydown",p=>p.stopPropagation());let n=o.copiar??(p=>Zl(o.doc,p)),s=d("span",{class:"spro-sr",role:"status","aria-live":"polite"}),i=d("button",{type:"button",class:r("spro-copiar-num"),"aria-label":"Copiar n\xFAmero do processo"},q("copiar",14),s),c,l=p=>{i.classList.toggle("spro-copiado",p),i.querySelector("svg")?.replaceWith(q(p?"check":"copiar",14))};i.addEventListener("keydown",p=>p.stopPropagation()),i.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),n(o.protocolo).then(f=>{s.textContent=f?"N\xFAmero copiado":"N\xE3o foi poss\xEDvel copiar",f&&(l(!0),clearTimeout(c),c=setTimeout(()=>{l(!1),s.textContent=""},Yl))})});let u=o.doc.createDocumentFragment();return u.append(a,i),u}var Pt=5e3,Bs=120,od=480,ed=24,rd=96,td="spro_altura:",ad={},Us=new WeakMap,nd=o=>{let e=o??ad,r=Us.get(e);if(r)return r;let t=new Map;return Us.set(e,t),t};function sd(o,e=Bs,r=Pt){let t=typeof o=="object"&&o!==null?o:{},a=typeof t.px=="number"&&Number.isFinite(t.px)?Math.round(Math.min(r,Math.max(e,t.px))):null;return{auto:t.auto===!0,px:a}}function Xs(o){let{rolagem:e}=o,r=e.ownerDocument,t=o.minPx??Bs,a=Math.max(t,o.maxPx??Pt),n=o.area??null,s=nd(n),i=`${td}${o.chave}`,c=o.padraoVh!==void 0?`${o.padraoVh}vh`:`${o.padraoPx??od}px`,l=S=>Math.round(Math.min(a,Math.max(t,S))),u=s.get(o.chave)??{auto:!1,px:null},p=s.has(o.chave),f=!1,y=0,b=null,P=`spro-altura-${o.chave.replace(/[^\w-]/g,"-")}`;e.classList.add("spro-altura-rolagem"),e.id||(e.id=P);let x=d("div",{class:"spro-altura-alca",role:"separator","aria-orientation":"horizontal","aria-label":o.rotulo??"Redimensionar a altura da lista","aria-controls":e.id,"aria-valuemin":String(t),"aria-valuemax":String(a),tabindex:"0"}),C=()=>{let S=e.getBoundingClientRect?.().height||e.offsetHeight||0;return S>0?S:u.px??t};function k(){e.style.setProperty("--spro-altura-max",u.auto?`${Pt}px`:u.px!==null?`${u.px}px`:c);let S=u.auto?"auto":"limitada";e.setAttribute("data-altura",S),x.setAttribute("data-altura",S);let O=Math.round(C());x.setAttribute("aria-valuenow",String(Math.min(a,Math.max(t,O)))),x.setAttribute("aria-valuetext",u.auto?"Ajustada ao conte\xFAdo":`${O} pixels`),x.setAttribute("title",u.auto?"Duplo clique: voltar \xE0 altura limitada":"Arraste para mudar a altura. Duplo clique: ajustar ao conte\xFAdo")}function v(){if(s.set(o.chave,{...u}),!!n)try{n.gravar({[i]:{auto:u.auto,px:u.px}}).catch(()=>{})}catch{}}function M(S){let O=()=>{y=0,f||o.aoMudar?.({...u})},G=r.defaultView;if(S||!G?.requestAnimationFrame){y&&G?.cancelAnimationFrame&&G.cancelAnimationFrame(y),O();return}y||(y=G.requestAnimationFrame(O))}function D(S,O=!1){p=!0,u=S,k(),M(!O),O||v()}let w=()=>D({auto:!0,px:u.px}),N=S=>D({auto:!1,px:S!==void 0?l(S):u.px});function R(S){let O=S;if(!(O.button!==void 0&&O.button>0)){S.preventDefault(),b={y:O.clientY,base:C()},x.classList.add("spro-altura-arrastando");try{x.setPointerCapture?.(O.pointerId)}catch{}}}function oo(S){if(!b)return;let O=S;if(O.buttons===0)return Q(S);D({auto:!1,px:l(b.base+(O.clientY-b.y))},!0)}function Q(S){if(!b)return;let O=S;b=null,x.classList.remove("spro-altura-arrastando");try{x.releasePointerCapture?.(O.pointerId)}catch{}v(),M(!0)}function E(S){S.preventDefault(),u.auto?N():w()}function $(S){let O=S;S.stopPropagation();let G=O.shiftKey?rd:ed;switch(O.key){case"ArrowUp":N(C()-G);break;case"ArrowDown":N(C()+G);break;case"Home":N(t);break;case"End":w();break;case"Enter":case" ":u.auto?N():w();break;default:return}S.preventDefault()}if(x.addEventListener("pointerdown",R),x.addEventListener("pointermove",oo),x.addEventListener("pointerup",Q),x.addEventListener("pointercancel",Q),x.addEventListener("lostpointercapture",Q),x.addEventListener("dblclick",E),x.addEventListener("keydown",$),x.addEventListener("click",S=>S.stopPropagation()),k(),!p&&n)try{n.obter(i).then(S=>{p||f||!(i in S)||(u=sd(S[i],t,a),s.set(o.chave,{...u}),k(),M(!0))}).catch(()=>{})}catch{}return{alca:x,estado:()=>({...u}),ajustarAoConteudo:w,limitar:S=>N(S),destruir(){f=!0,b=null}}}var dr={compacta:34,confortavel:48},id={processo:"minmax(340px, 370px)",tipo:"minmax(120px, 1.2fr)",especificacao:"minmax(200px, 2fr)",responsavel:"minmax(90px, 130px)",marcadores:"minmax(120px, 1.3fr)",prazo:"minmax(120px, 150px)",anotacao:"minmax(130px, 1.4fr)",caixa:"84px",parado:"84px",sinais:"minmax(110px, 150px)"},cd={processo:"protocolo",tipo:"tipo",responsavel:"responsavel",marcadores:"marcador",prazo:"prazo",caixa:"caixa",parado:"parado",sinais:"novo"};function ld(o){let e=o.trim().split(/\s+/);return e.length>2?`${e[0]} ${e[e.length-1]}`:o}function ur(o,e){return d("button",{type:"button",class:"spro-lapis",title:o,"aria-label":o,onclick:r=>{r.preventDefault(),r.stopPropagation(),e()}},q("lapis",13))}var po=(o,e,r)=>d(o,{class:e},r);function dd(o,e,r,t){let a=po("div",`spro-c spro-c-${e}`);switch(e){case"processo":{let n=t.icones(o.id),s=u=>n.find(p=>p.classList.contains(u))??d("span",{class:"spro-slot"}),i=o.acompanhamentoEspecial?d("span",{class:"spro-acomp",title:o.acompanhamentoGrupo?`Acompanhamento especial: ${o.acompanhamentoGrupo}`:"Acompanhamento especial"},q("olho",15)):d("span",{class:"spro-slot"});a.append(d("span",{class:"spro-icones"},s("spro-fav-estrela"),s("spro-prj-ic"),s("spro-dem-cx"),i));let c=o.grupo==="recebidos";t.semOrigem||a.append(d("span",{class:`spro-origem spro-origem-${o.grupo}`,title:c?"Processo recebido: veio de outra unidade":"Processo gerado: autuado nesta unidade",role:"img","aria-label":c?"Processo recebido":"Processo gerado"},go(c?"recebido":"gerado",16)));let l=d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",title:"Abrir o processo"},o.protocolo);a.append(l),a.append(Gs({protocolo:o.protocolo,doc:document,href:o.link})),o.sigiloso&&a.append(d("span",{class:"spro-sigilo",title:"Processo sigiloso"},"sigiloso")),o.urgente&&a.append(d("span",{class:"spro-urgente",title:"Marcado como urgente"},"urgente")),o.trancado&&a.append(d("span",{class:"spro-sigilo",title:"Processo trancado"},"trancado"));break}case"tipo":a.append(po("span","spro-corta",o.tipo)),a.title=o.tipo;break;case"especificacao":{if(a.classList.add("spro-editavel"),t.editando===o.id){let n=d("input",{type:"text",class:"spro-espec-input",maxlength:"100",value:t.rascunho,"aria-label":"Especifica\xE7\xE3o do processo"});n.addEventListener("input",()=>t.aoDigitarEspec(n.value)),n.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"?t.aoSalvarEspec(o.id):l.key==="Escape"&&t.aoCancelarEspec()});let s=l=>l.preventDefault(),i=d("button",{type:"button",class:"spro-lapis spro-lapis-ok",title:"Salvar (Enter)","aria-label":"Salvar",onclick:()=>t.aoSalvarEspec(o.id)},q("check",14)),c=d("button",{type:"button",class:"spro-lapis",title:"Cancelar (Esc)","aria-label":"Cancelar",onclick:()=>t.aoCancelarEspec()},q("fechar",14));i.addEventListener("pointerdown",s),c.addEventListener("pointerdown",s),a.append(d("span",{class:"spro-edicao"},n,i,c));break}a.append(po("span","spro-corta",o.especificacao)),a.title=o.especificacao,o.sigiloso||a.append(ur("Editar a especifica\xE7\xE3o",()=>t.aoEditarEspec(o.id)));break}case"responsavel":a.classList.add("spro-editavel"),o.atribuicao?(a.append(po("span","spro-corta",t.nomesCompletos?ld(o.atribuicao.nome):o.atribuicao.sigla)),a.title=t.nomesCompletos?o.atribuicao.sigla:o.atribuicao.nome):a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"atribuir")),a.append(ur(o.atribuicao?"Mudar o respons\xE1vel":"Atribuir a algu\xE9m",()=>t.aoEditar(o.id,"responsavel")));break;case"marcadores":a.classList.add("spro-editavel"),o.marcadores.length&&a.append(d("span",{class:"spro-pilulas"},...o.marcadores.map(n=>d("span",{class:"spro-marcador",title:n.texto?`${n.nome}: ${n.texto}`:n.nome},d("i",{style:`background:${jo(n.cor)}`}),n.nome)))),o.sigiloso||(o.marcadores.length||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"marcar")),a.append(ur(o.marcadores.length?"Editar os marcadores":"Adicionar marcador",()=>t.aoEditar(o.id,"marcadores"))));break;case"prazo":{let n=ho(o,r);a.classList.add("spro-editavel");let s=n?"Editar o prazo":"Definir um prazo",i=d("button",{type:"button",class:"spro-prazo-b",title:n?`${ut(o,r)}
${n.dica}

${s}`:s,"aria-label":s,onclick:c=>{c.preventDefault(),c.stopPropagation(),t.aoAbrirPrazo(o.id)}},n?po("span",`spro-prazo spro-prazo-${n.situacao}`,n.texto):po("span","spro-prazo-vazio","definir"));a.append(i,d("span",{class:"spro-lapis spro-lapis-fixo","aria-hidden":"true"},q("lapis",13)));break}case"anotacao":a.classList.add("spro-editavel"),o.anotacao?(a.append(po("span",`spro-corta${o.anotacao.prioridade?" spro-prio":""}`,bn(o.anotacao.texto))),a.setAttribute("data-tip-nota",o.anotacao.texto),a.setAttribute("data-tip-autor",o.anotacao.autor)):o.sigiloso||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"anotar")),o.sigiloso||a.append(ur(o.anotacao?"Editar a anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",()=>t.aoEditar(o.id,"anotacao")));break;case"caixa":{let n=Zo(Po(o,r));a.append(po("span","spro-suave",n)),n&&(a.title=Gn);break}case"parado":{let n=No(o,r);a.append(po("span","spro-suave",Zo(n))),n!==null&&(a.title="Dias desde a \xFAltima movimenta\xE7\xE3o (vis\xE3o detalhada do SEI).");break}case"sinais":for(let n of dt(o))a.append(po("span","spro-sinal",n));break}return a}var ud=68;function Qs(o,e={}){let r=o,t=po("div","spro-cab"),a=po("div","spro-corpo"),n=d("div",{class:"spro-rolagem",tabindex:"-1"},a),s=d("div",{class:"spro-tabela",role:"table"},t,n),i=Xs({rolagem:n,chave:"grade-controle",padraoVh:ud,area:e.area??null,rotulo:"Redimensionar a altura da grade de processos",aoMudar:()=>{r.linhas.length&&P()}});s.append(i.alca);let c="",l=!1,u=!1,p=()=>`36px ${r.colunas.map(v=>id[v]).join(" ")}`;function f(){t.replaceChildren(),t.style.gridTemplateColumns=p();let v=r.linhas.filter(w=>w.tipo==="processo").map(w=>w.processo.id),M=v.filter(w=>r.selecionados.has(w)).length,D=d("input",{type:"checkbox",class:"spro-cb","aria-label":"Marcar todos os processos vis\xEDveis",title:"Marcar todos os vis\xEDveis",disabled:!v.length});D.checked=v.length>0&&M===v.length,D.indeterminate=M>0&&M<v.length,D.addEventListener("change",()=>r.aoMarcarGrupo(v,D.checked)),t.append(po("div","spro-c spro-c-cb")),t.firstElementChild.append(D);for(let w of r.colunas){let N=cd[w],R=N?r.ordem.findIndex(Q=>Q.campo===N):-1,oo=d("div",{class:`spro-c spro-th${N?" spro-ordenavel":""}`,role:"columnheader",...R>=0?{"aria-sort":r.ordem[R].decrescente?"descending":"ascending"}:{}});if(N){let Q=d("button",{type:"button",class:"spro-th-b",title:"Ordenar (Shift acrescenta outro crit\xE9rio)",onclick:E=>r.aoOrdenar(N,E.shiftKey)},Fo[w]);R>=0&&Q.append(d("span",{class:"spro-seta-ordem"},`${r.ordem[R].decrescente?"\u2193":"\u2191"}${r.ordem.length>1?R+1:""}`)),oo.append(Q)}else oo.append(Fo[w]);t.append(oo)}}function y(v,M){let D=r.selecionados.has(v.id),w=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${v.protocolo}`,title:v.naPaginaAtual?void 0:`Est\xE1 na p\xE1gina ${v.pagina+1} do SEI: as a\xE7\xF5es do SEI aceitam processos de uma p\xE1gina por vez`});w.checked=D,w.addEventListener("change",()=>r.aoSelecionar(v.id,w.checked));let N=d("div",{class:`spro-linha${D?" spro-sel":""}${r.foco===v.id?" spro-foco":""}${v.urgente?" spro-linha-urgente":""}`,role:"row","data-id":v.id,"data-grupo":M});N.style.gridTemplateColumns=p(),N.style.height=`${dr[r.densidade]}px`;let R=po("div","spro-c spro-c-cb");return R.append(w),N.append(R,...r.colunas.map(oo=>dd(v,oo,r.ctx,r))),N}function b(v){let M=v.grupo.itens.map(N=>N.id),D=d("button",{type:"button",class:"spro-grupo-b","aria-expanded":String(!v.recolhido),onclick:()=>r.aoGrupo(v.grupo.chave)},d("span",{class:`spro-grupo-seta${v.recolhido?" spro-fechado":""}`},go("seta",14)),d("span",{class:"spro-grupo-nome"},v.grupo.rotulo),d("span",{class:"spro-grupo-n"},String(v.grupo.itens.length))),w=d("div",{class:`spro-grupo${v.grupo.tom?` spro-tom-${v.grupo.tom}`:""}`,role:"row"},D);if(M.length){let N=M.every(R=>r.selecionados.has(R));w.append(d("button",{type:"button",class:"spro-link",onclick:()=>r.aoMarcarGrupo(M,!N)},N?"Desmarcar grupo":"Marcar grupo"))}return w.style.height=`${dr[r.densidade]}px`,w}function P(){let v=dr[r.densidade],M=js(r.linhas.length,v,n.scrollTop||0,n.clientHeight||0);a.style.paddingTop=`${M.antes}px`,a.style.paddingBottom=`${M.depois}px`,a.replaceChildren(...r.linhas.slice(M.inicio,M.fim).map(w=>w.tipo==="grupo"?b(w):y(w.processo,w.grupo)));let D=a.querySelector(".spro-espec-input");D&&l?(l=!1,D.focus(),D.setSelectionRange?.(D.value.length,D.value.length)):D&&D.getRootNode()instanceof ShadowRoot&&D.getRootNode().activeElement!==D&&u&&D.focus()}let x=0;n.addEventListener("scroll",()=>{if(x)return;let v=n.ownerDocument.defaultView;if(!v?.requestAnimationFrame)return P();x=v.requestAnimationFrame(()=>{x=0,P()})});function C(v){let M=v.colunas.join()!==r.colunas.join()||v.ordem!==r.ordem||v.selecionados!==r.selecionados;v.editando&&v.editando!==r.editando&&(l=!0),u=!!v.editando,r=v;let D=`${r.colunas.join()}|${r.densidade}`;if((M||D!==c)&&(f(),c=D),!r.linhas.length){a.style.paddingTop=a.style.paddingBottom="0",a.replaceChildren(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro."));return}P()}function k(v){let M=r.linhas.findIndex(w=>w.tipo==="processo"&&w.processo.id===v);if(M<0)return!1;let D=dr[r.densidade];return M*D<n.scrollTop?n.scrollTop=M*D:(M+1)*D>n.scrollTop+n.clientHeight&&n.clientHeight>0&&(n.scrollTop=(M+1)*D-n.clientHeight),P(),!0}return C(o),{el:s,atualizar:C,mostrar:k,rolagem:n,altura:i}}var pd=[["/","Buscar"],["j / k","Linha seguinte / anterior"],["x","Marcar a linha"],["Enter","Abrir o processo"],["g t","Ver a tabela"],["g q","Ver o quadro"],["Esc","Limpar a busca ou a sele\xE7\xE3o"],["?","Esta ajuda"]],Js=o=>o==="grupo:recebidos"?"grupo:gerados":o==="grupo:gerados"?"grupo:recebidos":null,md={"resp:eu":"Processos atribu\xEDdos a voc\xEA","grupo:recebidos":"Processos que vieram de outra unidade","grupo:gerados":"Processos autuados nesta unidade","prazo:atrasado":"Prazo vencido e ainda n\xE3o conclu\xEDdo","prazo:semana":"Vencem nos pr\xF3ximos 7 dias","resp:sem":"Processos sem respons\xE1vel","novo:sim":"Ainda n\xE3o abertos nesta unidade","novo:visita":"Chegaram depois da sua \xFAltima visita","parado:>30d":"Sem movimenta\xE7\xE3o h\xE1 mais de 30 dias (vis\xE3o detalhada do SEI)"},fd=[["Meus","resp:eu",{comum:"pessoa"},""],["Recebidos","grupo:recebidos",{grade:"recebido"},""],["Gerados","grupo:gerados",{grade:"gerado"},""],["Atrasados","prazo:atrasado",{comum:"alerta"},"perigo"],["Vencem na semana","prazo:semana",{comum:"calendario"},"aviso"],["Sem respons\xE1vel","resp:sem",{grade:"semPessoa"},""],["N\xE3o visualizados","novo:sim",{grade:"olhoFechado"},""],["Novos desde a \xFAltima visita","novo:visita",{comum:"brilho"},"novo"],["Parados h\xE1 +30 dias","parado:>30d",{comum:"historico"},""]];function Ks(o){let{doc:e}=o,r=o.inicial.processos,t=oe(),a=[],n="",s=new Set,i=new Set(rt(e)),c=null,l={vistoEm:{}},u,p=null,f=!1,y=!1,b="",P={},x=!1,C=!1,k,v=!1,M=is(o.mover),D=new AbortController,w=()=>({hoje:o.hoje(),agora:o.agora(),...o.eu?{eu:o.eu}:{},...u!==void 0?{visitaAnterior:u}:{},...S?{andamentos:S.dados()}:{}}),N=e.createElement("div");N.id="spro-grade",N.setAttribute("data-spro-grade-host","1"),N.setAttribute("data-tema",o.escuro?"escuro":"claro");let R=N.attachShadow({mode:"open"}),oo=e.createElement("style");oo.textContent=o.css;let Q=d("div",{class:`spro-app${o.escuro?" spro-escuro":""}`}),E=e.createElement("style");R.append(oo,E,Q);let $=An(R),S=o.consultarAndamento?Is({sombra:R,agora:()=>o.agora(),armazem:o.armazem,consultar:(m,g)=>o.consultarAndamento(m,g),processos:()=>r,aoMudar:()=>W(),aviso:m=>Z(m),simultaneas:o.andamentoSimultaneas,pausaMs:o.andamentoPausaMs,semDebounce:o.semDebounce}):null,O=d("input",{type:"search",class:"spro-busca",placeholder:"Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...","aria-label":"Buscar processos",spellcheck:"false",autocomplete:"off"}),G=d("div",{class:"spro-chips"}),eo=d("div",{class:"spro-rapidos"}),z=d("div",{class:"spro-status",role:"status","aria-live":"polite"}),ro=d("div",{class:"spro-lote",hidden:!0}),mo=d("div",{class:"spro-conteudo"}),ao=d("div",{class:"spro-painel",hidden:!0}),Mt=d("div",{class:"spro-avisos","aria-live":"polite"}),se=d("div",{class:"spro-ajuda-atalhos",hidden:!0},d("strong",{},"Atalhos"),...pd.map(([m,g])=>d("div",{},d("kbd",{},m),` ${g}`))),ai=[["protocolo","N\xFAmero do processo"],["prazo","Prazo"],["tipo","Tipo"],["responsavel","Respons\xE1vel"],["marcador","Marcador"],["caixa","Tempo na caixa"],["parado","Parado h\xE1"],["novo","N\xE3o visualizados"]],gr=Io({rotulo:"Agrupar por",icone:"camadas",classe:"spro-combo-compacto",busca:!1,vazio:"Sem agrupamento",opcoes:Object.keys(ct).filter(m=>S||!xe(m)).map(m=>({valor:m,rotulo:m==="nenhum"?"Sem agrupamento":`Agrupar: ${ct[m]}`,...xe(m)?{descricao:"Consulta o andamento de cada processo"}:{}})),valor:["nenhum"],aoMudar:([m])=>{let g=m??"nenhum",h=t.agrupar;U({agrupar:g}),S&&xe(g)&&S.aoEscolherAgrupamento().then(A=>{!A&&t.agrupar===g&&U({agrupar:h})})}}),Dt=Io({rotulo:"Ordenar por",icone:"ordenar",classe:"spro-combo-compacto",busca:!1,vazio:"Ordem do SEI",opcoes:[{valor:"",rotulo:"Ordem do SEI"},...ai.flatMap(([m,g])=>[{valor:`${m}:a`,rotulo:`${g} \u2191`,descricao:"Crescente"},{valor:`${m}:d`,rotulo:`${g} \u2193`,descricao:"Decrescente"}])],valor:[""],aoMudar:([m])=>{let[g,h]=(m??"").split(":");U({ordem:g?[{campo:g,decrescente:h==="d"}]:[]})}}),ye=lt([],w()),hr=(m,g,h,A,L)=>{let I=Io({rotulo:m,vazio:g,icone:A,classe:"spro-combo-compacto",busca:!0,larguraLista:260,opcoes:()=>L().map(_=>({valor:_.valor,rotulo:_.rotulo,contagem:_.n})),aoMudar:([_])=>{_&&(U({busca:ms(t.busca,h,_)}),O.value=t.busca,I.definir([],!1))}});return I},Ct=hr("Filtrar por respons\xE1vel","Respons\xE1vel\u2026","resp","pessoa",()=>ye.responsaveis),kt=hr("Filtrar por tipo","Tipo\u2026","tipo","documento",()=>ye.tipos),Ot=hr("Filtrar por marcador","Marcador\u2026","marcador","etiqueta",()=>ye.marcadores),Lt=(m,g)=>d("button",{type:"button",class:"spro-seg-b","data-modo":m,title:g,onclick:()=>U({modo:m})},go(m==="tabela"?"lista":"quadro",16),d("span",{},g)),It=d("div",{class:"spro-seg",role:"group","aria-label":"Modo de exibi\xE7\xE3o"},Lt("tabela","Tabela"),Lt("quadro","Quadro")),ie=(m,g,h,A="")=>d("button",{type:"button",class:`spro-bt ${A}`.trim(),title:g,"aria-label":g,onclick:h},go(m,16),d("span",{},g)),Nt=ie("colunas","Colunas",()=>Xo("colunas")),ni=ie("disquete","Vis\xF5es",()=>Xo("visoes")),si=ie("lista","Exportar CSV",()=>vi()),Tt=ie("lista","CSV completo",()=>xi());Tt.title="CSV completo (ListaProcessos_SEIPro, 21 colunas)";let ii=d("button",{type:"button",class:"spro-bt spro-bt-icone",title:"Atalhos de teclado (?)","aria-label":"Atalhos de teclado",onclick:()=>{se.hidden=!se.hidden}},"?"),$t=ie("densidade","Densidade",()=>U({densidade:t.densidade==="compacta"?"confortavel":"compacta"})),Ee=d("div",{class:"spro-quadro-cfg",hidden:!0});Q.append(d("div",{class:"spro-barra"},It,d("div",{class:"spro-busca-caixa"},O),gr.el,Dt.el,Nt,$t,ni,si,Tt,ii),G,d("div",{class:"spro-faixa"},eo,Ct.el,kt.el,Ot.el),Ee,se,ao,z,...S?[S.faixa]:[],ro,mo,Mt);let Rt=()=>jn(r,l),ce="",le=()=>ps(Rt(),`${t.busca} ${ce}`.trim(),w()),Pe=()=>Ss(le(),t.ordem,w());function U(m){t={...t,...m},m.busca===void 0?o.armazem.gravarVisao(t).catch(()=>{}):ci(),W()}let br;function ci(){clearTimeout(br),br=setTimeout(()=>void o.armazem.gravarVisao(t).catch(()=>{}),400)}function Z(m,g){let h=d("div",{class:"spro-aviso",role:"status"},d("span",{},m));g&&h.append(d("button",{type:"button",class:"spro-link",onclick:()=>{g.fazer(),h.remove()}},g.rotulo)),h.append(d("button",{type:"button",class:"spro-aviso-x","aria-label":"Fechar aviso",onclick:()=>h.remove()},"\xD7")),Mt.append(h),setTimeout(()=>h.remove(),g?9e3:6e3).unref?.()}function Bo(m,g){let h=new Set(i);for(let A of m)g?h.add(A):h.delete(A);i=h,ts(e,h),yr(),Ao()}let Se=new Map;function Do(m,g){let h=r.find(A=>A.id===m);if(h){let A=Se.get(m)??{};for(let L of new Set([...Object.keys(h),...Object.keys(g)]))JSON.stringify(h[L])!==JSON.stringify(g[L])&&(A[L]=g[L]);Se.set(m,A)}r=r.map(A=>A.id===m?g:A)}let zt=Promise.resolve();function _t(m){Ro+=1;let g=zt.then(m,m);return zt=g.catch(()=>{}).finally(()=>{Ro-=1}),g}let vr=null,we={raiz:R,extras:()=>(vr??=(o.extras?o.extras().then(m=>(P=m,m)):Promise.resolve({})).catch(m=>{throw vr=null,m}),vr),todos:()=>r,selecionados:()=>i,corDoMarcador:m=>r.flatMap(g=>g.marcadores).find(g=>g.nome===m)?.cor??"",autor:o.eu??"",aplicarLocal:(m,g)=>{Do(m,g),W()},gravar:_t,atribuir:(m,g)=>o.mover.atribuir(m,g),marcar:(m,g)=>o.mover.marcador(m,g),anotar:(m,g)=>o.anotar(m,g),aviso:m=>Z(m)};async function li(m,g,h){let A=r.find(F=>F.id===m);if(!A)return;let L=Ls(t.quadro.colunas,A,g,h);if(!L.ok)return Z(L.motivo);let I=Object.fromEntries((P.responsaveis??[]).map(F=>[F.sigla,F.nome]));Do(m,ft(A,L.movimento,I)),W(),Ro+=1;let _=await M.mover(L.movimento).finally(()=>{Ro-=1});if(!C){if(!_.ok)return Do(m,A),W(),Z(`N\xE3o foi poss\xEDvel mover ${A.protocolo}: ${_.erro}`);Z(`${A.protocolo} movido.`,{rotulo:"Desfazer",fazer:()=>{let F=r.find(co=>co.id===m)??A;Do(m,ft(F,_.desfazer,I)),W(),M.mover(_.desfazer).then(co=>{co.ok||C||(Do(m,F),W(),Z(`N\xE3o foi poss\xEDvel desfazer: ${co.erro}`))})}})}}let di=Rs(),xr=new Map([[qo("recebidos",0),o.inicial.selecoes.recebidos],[qo("gerados",0),o.inicial.selecoes.gerados],[qo("detalhado",0),o.inicial.selecoes.detalhado]]),Ar=o.inicial.visao==="detalhada";function ui(m){let g=r.filter(L=>i.has(L.id)),h=fn(m);if(h?.requerSelecao&&!g.length)return Z("Marque ao menos um processo.");if(h&&!h.aceitaSigiloso&&mn(g))return Z("Opera\xE7\xE3o n\xE3o aplic\xE1vel em processo sigiloso.");let A=un(g,xr,Ar?"detalhada":"resumida");if(!A.ok)return Z(A.motivo);if(A.plano.todosNaPaginaAtual||!h){let L=ns(m,g.length);!L.ok&&L.motivo&&Z(L.motivo);return}try{o.enviarAcao(h.url,A.plano)}catch(L){Z(`N\xE3o foi poss\xEDvel enviar a a\xE7\xE3o: ${L instanceof Error?L.message:String(L)}`)}}let Ro=0,Me=null,De="",qt=!1,Ht=m=>({linhas:m,colunas:t.colunas,densidade:t.densidade,ctx:w(),ordem:t.ordem,selecionados:i,foco:c,icones:g=>di(e,g),nomesCompletos:qt,editando:Me,rascunho:De,semOrigem:Ar,aoOrdenar:(g,h)=>U({ordem:ws(t.ordem,g,h)}),aoSelecionar:(g,h)=>Bo([g],h),aoGrupo:g=>{let h=new Set(s);h.has(g)?h.delete(g):h.add(g),s=h,o.armazem.gravarRecolhidos([...h]).catch(()=>{}),Ao()},aoMarcarGrupo:(g,h)=>Bo(g,h),aoEditarEspec:g=>{Me=g,De=r.find(h=>h.id===g)?.especificacao??"",Ao()},aoDigitarEspec:g=>{De=g},aoCancelarEspec:()=>{Me=null,Ao()},aoSalvarEspec:g=>void pi(g),aoAbrirPrazo:g=>o.abrirPrazo(g),aoEditar:(g,h)=>{let A=r.find(L=>L.id===g);A&&(h==="responsavel"?Vs(we,A):h==="anotacao"?Et(we,A):Fs(we,A))}}),Ce=Qs(Ht([]),{area:o.armazem.areaLocal});async function pi(m){let g=r.find(A=>A.id===m),h=De.trim();if(Me=null,!g||h===g.especificacao.trim())return Ao();if(!h)return Z("A especifica\xE7\xE3o n\xE3o pode ficar vazia."),Ao();Do(m,{...g,especificacao:h}),W(),Ro+=1;try{await o.editarEspecificacao(g.protocolo,h),Z(`Especifica\xE7\xE3o de ${g.protocolo} salva.`)}catch(A){Do(m,g),W(),Z(`N\xE3o foi poss\xEDvel salvar a especifica\xE7\xE3o: ${A instanceof Error?A.message:String(A)}`)}finally{Ro-=1}}async function mi(m,g){let h=r.find(_=>_.id===m);if(!h?.anotacao||h.sigiloso)return;let A=Oo(h.anotacao.texto);if(A[g]?.marca==null)return;let L=qe(He(A,g)),I=h.anotacao.prioridade;Do(m,tr(h,L,I,o.eu??"")),W();try{await _t(()=>o.anotar(h.protocolo,{texto:L,prioridade:I}))}catch(_){Do(m,h),W(),Z(`N\xE3o foi poss\xEDvel atualizar a anota\xE7\xE3o: ${_ instanceof Error?_.message:String(_)}`)}}function fi(m){let g=t.quadro.colunasRecolhidas??[],h=g.includes(m)?g.filter(I=>I!==m):[...g,m],{colunasRecolhidas:A,...L}=t.quadro;U({quadro:h.length?{...L,colunasRecolhidas:h}:L})}function Ao(){let m=Pe();if(t.modo==="quadro"){mo.replaceChildren(Ns({processos:m,cfg:t.quadro,ctx:w(),extras:P,selecionados:i,aoMover:(h,A,L)=>void li(h,A,L),aoSelecionar:(h,A)=>Bo([h],A),aoAbrirPrazo:h=>o.abrirPrazo(h),aoReordenarColuna:(h,A,L)=>U({quadro:{...t.quadro,ordemColunas:Os(L,h,A)}}),aoEditarAnotacao:h=>{let A=r.find(L=>L.id===h);A&&!A.sigiloso&&Et(we,A)},aoAlternarTarefa:(h,A)=>void mi(h,A),aoAlternarColuna:h=>fi(h)}));return}let g=or(m,t.agrupar,w());Ce.atualizar(Ht(ys(g,s,t.agrupar!=="nenhum"))),mo.firstElementChild!==Ce.el&&mo.replaceChildren(Ce.el)}function Vt(m){let g=[`${m} de ${r.length} processo${r.length===1?"":"s"}`];ce&&g.push(`filtro da pesquisa r\xE1pida: ${ce}`);let h=o.inicial.totais.recebidos+o.inicial.totais.gerados;f&&p?g.push(`carregando ${p.grupo} (${p.paginasLidas}/${p.paginasTotal})\u2026`):!y&&h>r.length&&g.push(`o SEI informa ${h}; os demais n\xE3o foram carregados`),b&&g.push(`aviso: ${b}`),z.replaceChildren(g.join(" \xB7 ")),z.classList.toggle("spro-status-alerta",!!b||!y&&!f&&h>r.length)}function yr(){let m=i.size;if(ro.hidden=m===0,!m)return ro.replaceChildren();let g=new Set(le().map(A=>A.id)),h=[...i].filter(A=>!g.has(A)).length;ro.replaceChildren(d("strong",{},`${m} selecionado${m===1?"":"s"}`),...h?[d("span",{class:"spro-suave"},`(${h} fora do filtro atual)`)]:[],...o.acoes().map(A=>d("button",{type:"button",class:"spro-bt",title:A.rotulo,onclick:()=>ui(A)},d("img",{src:A.icone,alt:"",width:"16",height:"16"}),d("span",{},A.rotulo))),d("button",{type:"button",class:"spro-link",onclick:()=>Bo([...i],!1)},"Limpar sele\xE7\xE3o"))}function gi(){let m=it(t.busca);G.replaceChildren(...m.tokens.map(h=>d("span",{class:`spro-chip${h.termo.negado?" spro-chip-neg":""}`},h.texto,d("button",{type:"button","aria-label":`Remover ${h.texto}`,onclick:()=>{U({busca:Ye(t.busca,h.texto)}),O.value=t.busca}},"\xD7")))),G.hidden=!m.tokens.length;let g=new Set(m.tokens.map(h=>h.texto));eo.replaceChildren(...fd.filter(([,h])=>!(Ar&&h.startsWith("grupo:"))).map(([h,A,L,I])=>d("button",{type:"button","data-tip":`${h}
${md[A]??""}
Busca: ${A}${g.has(A)?`
Clique para desligar`:""}`,"aria-label":h,class:`spro-rapido${I?` spro-rapido-${I}`:""}${g.has(A)?" spro-rapido-on":""}`,"aria-pressed":String(g.has(A)),onclick:()=>{U({busca:g.has(A)?Ye(t.busca,A):`${Js(A)?Ye(t.busca,Js(A)):t.busca} ${A}`.trim()}),O.value=t.busca}},"comum"in L?q(L.comum,14,e):go(L.grade,14,e),d("span",{class:"spro-rapido-rotulo"},h)))),Ft()}let Co=N.shadowRoot.querySelector(".spro-faixa");function Ft(){C||(Co.classList.remove("spro-faixa-c1","spro-faixa-c2"),Co.clientWidth&&(Co.scrollWidth>Co.clientWidth+1&&Co.classList.add("spro-faixa-c1"),Co.scrollWidth>Co.clientWidth+1&&Co.classList.add("spro-faixa-c2")))}let jt=e.defaultView?.ResizeObserver,Gt=jt?new jt(()=>Ft()):null;Gt?.observe(Co);let Ut=new Map,Bt=new Set,Xt=m=>`${m.id}|${m.marcadores.map(g=>g.nome).join("|")}`;function Qt(m){if(m.marcadores.length<=1)return m;let g=Ut.get(m.id);if(!g)return m;let h=!1,A=m.marcadores.map(L=>{if(L.dataHora!==void 0)return L;let I=g[J(L.nome)];return I===void 0?L:(h=!0,{...L,dataHora:I})});return h?{...m,marcadores:A}:m}function hi(){if(!o.consultarDatasMarcadores||C||!(t.modo==="quadro"&&t.quadro.colunas==="marcador"||t.modo==="tabela"&&t.agrupar==="marcador"))return;let g=r.filter(I=>I.marcadores.length>1&&I.linkMarcadores&&!Bt.has(Xt(I)));if(!g.length)return;for(let I of g)Bt.add(Xt(I));let h=[...g],A=Math.min(4,h.length),L=async()=>{for(;h.length&&!C&&!D.signal.aborted;){let I=h.shift(),_=await o.consultarDatasMarcadores(I,D.signal).catch(()=>null);!_||C||(Ut.set(I.id,_),r=r.map(F=>F.id===I.id?Qt(F):F),W())}};for(let I=0;I<A;I++)L()}function W(){if(C)return;ye=lt(Rt(),w());for(let g of[Ct,kt,Ot])g.atualizar();gr.definir([t.agrupar],!1),gr.el.disabled=t.modo==="quadro",Dt.definir([t.ordem[0]?`${t.ordem[0].campo}:${t.ordem[0].decrescente?"d":"a"}`:""],!1);for(let g of It.querySelectorAll("[data-modo]"))g.setAttribute("aria-pressed",String(g.getAttribute("data-modo")===t.modo));$t.title=t.densidade==="compacta"?"Linhas confort\xE1veis":"Linhas compactas",Nt.hidden=t.modo==="quadro",bi(),gi(),S?.definirAtivo(xe(t.agrupar)&&t.modo==="tabela"),Ao(),Vt(le().length),yr(),hi(),t.modo==="quadro"&&!x&&o.extras&&(x=!0,o.extras().then(g=>{P=g,C||Ao()}).catch(()=>{}))}function bi(){if(Ee.hidden=t.modo!=="quadro",Ee.hidden)return;let m=t.quadro,g=Io({rotulo:"Colunas do quadro",icone:"mapa",classe:"spro-combo-compacto",busca:!1,opcoes:[{valor:"marcador",rotulo:"Colunas: marcador"},{valor:"responsavel",rotulo:"Colunas: respons\xE1vel"},{valor:"prazo",rotulo:"Colunas: prazo (leitura)"},{valor:"tipo",rotulo:"Colunas: tipo (leitura)"}],valor:[m.colunas],aoMudar:([lo])=>{x=!1,U({quadro:{...m,colunas:lo??"marcador"}})}}),h=d("input",{type:"number",min:"0",max:"99",class:"spro-num",value:String(m.limite),"aria-label":"Limite de cart\xF5es por coluna (0 = sem limite)",title:"Limite de cart\xF5es por coluna (0 = sem limite)",onchange:lo=>U({quadro:{...m,limite:Math.max(0,Math.min(99,Number(lo.target.value)||0))}})}),A=d("input",{type:"checkbox",onchange:lo=>{let{colunasVazias:zo,...Yt}=t.quadro;U({quadro:lo.target.checked?{...Yt,colunasVazias:!0}:Yt})}});A.checked=m.colunasVazias===!0;let L=d("input",{type:"checkbox",onchange:lo=>U({quadro:{...m,raiasPorResponsavel:lo.target.checked}})});L.checked=m.raiasPorResponsavel;let I=m.larguraColuna??280,_=lo=>{let zo=Math.max(200,Math.min(500,Math.round(lo)));U({quadro:{...t.quadro,larguraColuna:zo}})},F=d("span",{class:"spro-largura-val"},`${I}px`),co=d("input",{type:"range",min:"200",max:"500",step:"20",value:String(I),class:"spro-largura-range","aria-label":"Largura das colunas",title:"Ajustar largura das colunas e cart\xF5es",oninput:lo=>{let zo=Number(lo.target.value)||280;F.textContent=`${zo}px`,mo.querySelector(".spro-quadro")?.style.setProperty("--spro-col-largura",`${zo}px`)},onchange:lo=>_(Number(lo.target.value)||280)}),ke=d("div",{class:"spro-largura-ctrl"},d("span",{},"Largura"),d("button",{type:"button",class:"spro-largura-bt","aria-label":"Diminuir largura das colunas",title:"Diminuir largura das colunas",onclick:()=>_(I-20)},"\u2212"),co,d("button",{type:"button",class:"spro-largura-bt","aria-label":"Aumentar largura das colunas",title:"Aumentar largura das colunas",onclick:()=>_(I+20)},"+"),F),Qo=m.ordemColunas?.length?d("button",{type:"button",class:"spro-link",title:"Voltar \xE0 ordena\xE7\xE3o autom\xE1tica das colunas",onclick:()=>{let{ordemColunas:lo,...zo}=t.quadro;U({quadro:zo})}},"Restaurar ordem"):null;Ee.replaceChildren(g.el,d("label",{class:"spro-rotulo-inline"},"Limite ",h),ke,d("label",{class:"spro-rotulo-inline"},L," Raias por respons\xE1vel"),...m.colunas==="marcador"?[d("label",{class:"spro-rotulo-inline",title:"Mostra marcadores sem processos, para arrastar cart\xF5es at\xE9 eles"},A," Colunas vazias")]:[],...Qo?[Qo]:[],d("span",{class:"spro-suave"},m.colunas==="marcador"||m.colunas==="responsavel"?"Arraste cart\xF5es ou cabe\xE7alhos das colunas.":"Arraste os cabe\xE7alhos para reordenar as colunas."))}function Xo(m){if(!ao.hidden&&ao.getAttribute("data-qual")===m){ao.hidden=!0;return}if(ao.setAttribute("data-qual",m),ao.hidden=!1,m==="colunas"){ao.replaceChildren(d("strong",{},"Colunas"),...Yo.map(I=>{let _=d("input",{type:"checkbox",disabled:I==="processo"});return _.checked=t.colunas.includes(I),_.addEventListener("change",()=>{let F=_.checked?Yo.filter(co=>co===I||t.colunas.includes(co)):t.colunas.filter(co=>co!==I);U({colunas:F})}),d("label",{class:"spro-rotulo-linha"},_,` ${Fo[I]}`)}),d("button",{type:"button",class:"spro-link",onclick:()=>U({colunas:oe().colunas})},"Restaurar padr\xE3o"));return}let g=d("input",{type:"text",class:"spro-nome",maxlength:"40",placeholder:"Nome da vis\xE3o","aria-label":"Nome da vis\xE3o"}),h=a.find(I=>I.id===n);g.value=h?.nome??"";let A=async(I,_=a)=>{a=I,await o.armazem.gravarVisoes(I,_).catch(()=>Z("N\xE3o foi poss\xEDvel sincronizar as vis\xF5es."))},L=async I=>{let _={...t,nome:g.value.trim()||"Minha vis\xE3o",id:I==="atualizar"?n:""},F=Un(a,_,o.novoId);if(!F)return Z("Limite de vis\xF5es salvas atingido.");n=F.visao.id,await A(F.lista),Z(`Vis\xE3o "${F.visao.nome}" salva.`),Xo("visoes"),Xo("visoes")};ao.replaceChildren(d("strong",{},"Vis\xF5es salvas"),a.length?d("ul",{class:"spro-lista-visoes"},...a.map(I=>d("li",{},d("button",{type:"button",class:`spro-link${I.id===n?" spro-ativa":""}`,onclick:()=>{n=I.id,O.value=I.busca,U({...I,id:""})}},I.nome),d("button",{type:"button",class:"spro-aviso-x","aria-label":`Excluir ${I.nome}`,title:"Excluir",onclick:async()=>{await A(Bn(a,I.id),a),n===I.id&&(n=""),Xo("visoes"),Xo("visoes")}},"\xD7")))):d("p",{class:"spro-suave"},"Nenhuma vis\xE3o salva ainda."),d("div",{class:"spro-linha-form"},g,d("button",{type:"button",class:"spro-bt",onclick:()=>void L("nova")},"Salvar como nova"),h&&Xn(t,h)?d("button",{type:"button",class:"spro-bt",onclick:()=>void L("atualizar")},"Atualizar"):null))}function vi(){let m=gs(Pe(),t.modo==="quadro"?[...Yo]:t.colunas,w());o.baixar(hs(o.hoje()),Kn(m),"text/csv;charset=utf-8"),Z(`${m.length-1} processos exportados.`)}function xi(){let m=e.defaultView?.location,g=m&&/^https?:$/i.test(m.protocol)?`${m.origin}${m.pathname}`:"",h=bs(e.defaultView?.localStorage),A=vs(Pe(),w(),{urlBase:g,recebimentos:h});o.baixar(As(o.agora()),xs(A),"text/csv;charset=utf-8"),Z(`${A.length-1} processos exportados.`)}O.addEventListener("input",()=>{let m=O.value;if(o.semDebounce)return U({busca:m});clearTimeout(k),k=setTimeout(()=>U({busca:m}),120)}),O.addEventListener("keydown",m=>{m.key==="Escape"&&(O.value="",U({busca:""}),O.blur())});function Jt(m){if(C||m.ctrlKey||m.metaKey||m.altKey)return;let g=m.target;if(g&&(/^(input|textarea|select)$/i.test(g.tagName)||g.isContentEditable)||N.hidden)return;let A=m.key;if(v){v=!1,A==="t"?U({modo:"tabela"}):A==="q"&&U({modo:"quadro"});return}let L=Pe().map(_=>_.id),I=c?L.indexOf(c):-1;if(A==="/")m.preventDefault(),O.focus();else if(A==="?")se.hidden=!se.hidden;else if(A==="g")v=!0;else if(A==="Escape")i.size&&Bo([...i],!1);else if((A==="j"||A==="k")&&t.modo==="tabela"&&L.length)c=L[Math.max(0,Math.min(L.length-1,I+(A==="j"?1:-1)))],Ao(),Ce.mostrar(c);else if(A==="x"&&c)r.find(F=>F.id===c)&&Bo([c],!i.has(c));else if(A==="Enter"&&c){let _=r.find(F=>F.id===c)?.link;_&&e.defaultView?.location.assign(_)}}e.addEventListener("keydown",Jt);let Ai=as(e,m=>{i=m,yr(),Ao()}),yi=o.armazem.aoMudarVisoes(()=>void o.armazem.lerVisoes().then(m=>{a=m}).catch(()=>{})),Er=new Map;function Pr(){if(C||Ro>0)return;let m=Wo(e),g=new Map(m.processos.map(A=>[A.id,A])),h=!1;r=r.map(A=>{if(!A.naPaginaAtual)return A;let L=g.get(A.id);if(!L)return A;let I=Se.get(A.id),_=bt(e,A.id),F=Er.get(A.id);Er.set(A.id,_);let co=Qt(L);if(I){for(let Qo of Object.keys(I))JSON.stringify(L[Qo])===JSON.stringify(I[Qo])&&delete I[Qo];Object.keys(I).length?co={...L,...I}:Se.delete(A.id)}let ke=JSON.stringify(co)===JSON.stringify(A);return ke&&F===_?A:(h=!0,ke?A:co)}),h&&(Mr(),W())}let Sr,Kt=e.defaultView?.MutationObserver,wr=Kt?new Kt(()=>{clearTimeout(Sr),Sr=setTimeout(Pr,o.semDebounce?0:150)}):null,Wt=e.querySelector("#frmProcedimentoControlar")??e.body;wr&&Wt&&wr.observe(Wt,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["aria-pressed","aria-label","onmouseover","src","href","class"]});function Mr(){let m=zs(e);E.textContent!==m&&(E.textContent=m)}async function Ei(){if(!o.fonte)return y=!0,Zt(!0);f=!0,W();let m=()=>o.fonte?.restaurarAoSair?.();e.defaultView?.addEventListener("pagehide",m);let g=await _n(o.inicial,o.fonte,{sinal:D.signal,aoProgresso:h=>{p=h,Vt(le().length)},aoSelecao:(h,A,L)=>{xr.set(qo(h,A),L)},aoPagina:h=>{r=[...r,...h],W()}});e.defaultView?.removeEventListener("pagehide",m),f=!1,y=g.completo,g.erro&&(b=g.erro),Zt(g.completo)}function Zt(m){l=Yr(l,r.map(g=>g.id),o.agora(),m),o.armazem.gravarIdade(l).catch(()=>{}),W()}async function Pi(){try{let m=await o.armazem.lerEstado();t=m.visao,s=new Set(m.recolhidos),l=Fn(m.idade,o.agora()),u=l.visitaAnterior,a=await o.armazem.lerVisoes()}catch{}l=Yr(l,r.map(m=>m.id),o.agora(),!1),S&&await S.carregar(),O.value=t.busca,Mr();for(let[m]of r.map(g=>[g.id]))Er.set(m,bt(e,m));W(),Ei();for(let m of[1200,3500])setTimeout(()=>{Mr(),Pr()},m).unref?.()}return{host:N,iniciar:Pi,render:W,estado:()=>({visao:t,todos:r,selecionados:i,completo:y,carregando:f,filtrados:le().length}),definirVisao:m=>{t={...t,...m},O.value=t.busca,W()},fechar(){C=!0,D.abort(),S?.fechar(),clearTimeout(k),clearTimeout(br),clearTimeout(Sr),wr?.disconnect(),Gt?.disconnect(),$(),e.removeEventListener("keydown",Jt),Ai(),yi(),N.remove()},mostrar:m=>{N.hidden=!m},definirTema:m=>{N.setAttribute("data-tema",m?"escuro":"claro"),Q.classList.toggle("spro-escuro",m)},definirNomesCompletos:m=>{qt=m,W()},definirFiltroExterno:m=>{let g=m.trim();g!==ce&&(ce=g,W())},sincronizar:Pr,registrarSelecaoParaTeste:(m,g,h)=>void xr.set(qo(m,g),h)}}var Ws=`/* Dentro do Shadow DOM: o base.css do sei-comum (tokens) vem antes deste arquivo. */
:host { display: block; all: initial; font-family: var(--spro-fonte); }
:host([hidden]) { display: none; }
.spro-app { --fundo: var(--spro-fundo); display: block; box-sizing: border-box; margin: 4px 0 12px; color: var(--spro-texto); font: 13px/1.4 var(--spro-fonte); }
.spro-app *, .spro-app *::before, .spro-app *::after { box-sizing: border-box; }
.spro-escuro { color-scheme: dark; }
button, input, select { font: inherit; color: inherit; }
a { color: var(--spro-destaque); text-decoration: none; }
a:hover { text-decoration: underline; }
:focus-visible { outline: 2px solid var(--spro-destaque); outline-offset: 1px; }

.spro-barra { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-bottom: 8px; }
.spro-busca-caixa { flex: 1 1 260px; min-width: 200px; }
.spro-busca { width: 100%; height: 34px; padding: 0 12px; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); }
.spro-busca:focus { border-color: var(--spro-destaque); }
.spro-combo-compacto { height: 34px; min-width: 150px; max-width: 220px; }
.spro-faixa .spro-combo-compacto { height: 28px; font-size: 12px; min-width: 130px; }
.spro-sel-campo, .spro-nome, .spro-num { height: 34px; max-width: 190px; padding: 0 8px; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); }
.spro-num { width: 64px; }
.spro-nome { max-width: none; flex: 1; }
.spro-bt { display: inline-flex; gap: 6px; align-items: center; height: 34px; padding: 0 10px; cursor: pointer; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); }
.spro-bt:hover { background: var(--spro-fundo-2); }
.spro-bt-icone { width: 34px; justify-content: center; padding: 0; font-weight: 600; }
.spro-bt[hidden] { display: none; }
/* Botoes so com icone: o rotulo fica no tooltip (title) e no aria-label. */
.spro-barra .spro-bt span, .spro-seg-b span, .spro-lote .spro-bt span { display: none; }
.spro-barra .spro-bt, .spro-lote .spro-bt { width: 34px; justify-content: center; padding: 0; }
.spro-seg-b { width: 34px; justify-content: center; padding: 0; }
.spro-seg { display: inline-flex; border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); overflow: hidden; }
.spro-seg-b { display: inline-flex; gap: 6px; align-items: center; height: 32px; padding: 0 10px; cursor: pointer; background: var(--spro-fundo); border: 0; }
.spro-seg-b[aria-pressed="true"] { background: var(--spro-destaque); color: var(--spro-destaque-texto); }
.spro-link { padding: 0; cursor: pointer; background: none; border: 0; color: var(--spro-destaque); }
.spro-link:hover { text-decoration: underline; }
.spro-ativa { font-weight: 700; }

.spro-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 6px; }
.spro-chip { display: inline-flex; gap: 4px; align-items: center; padding: 2px 4px 2px 10px; background: color-mix(in srgb, var(--spro-destaque) 14%, transparent); border-radius: 99px; }
.spro-chip-neg { background: color-mix(in srgb, var(--spro-perigo) 16%, transparent); }
.spro-chip button, .spro-aviso-x { width: 20px; height: 20px; line-height: 1; cursor: pointer; background: none; border: 0; border-radius: 99px; }
.spro-chip button:hover, .spro-aviso-x:hover { background: color-mix(in srgb, currentColor 16%, transparent); }
.spro-faixa { display: flex; flex-wrap: nowrap; gap: 6px; align-items: center; margin-bottom: 8px; overflow: hidden; }
.spro-rapidos { display: flex; flex: none; flex-wrap: nowrap; gap: 6px; }
.spro-faixa .spro-rapido { flex: none; white-space: nowrap; }
.spro-faixa .spro-combo-compacto { flex: none; }
/* Sem espaco: os filtros rapidos viram so icone (o nome fica na dica). */
/* Os tres primeiros (Meus, Recebidos, Gerados) mantem o rotulo sempre. */
.spro-faixa-c1 .spro-rapido:nth-child(n+4) .spro-rapido-rotulo { display: none; }
.spro-faixa-c1 .spro-rapido:nth-child(n+4) { width: 30px; padding: 0; justify-content: center; }
/* Ainda sem espaco: os seletores encolhem e cortam o texto com reticencias. */
.spro-faixa-c2 .spro-combo-compacto { flex: 0 1 auto; min-width: 74px; }
.spro-faixa-c2 .spro-combo-compacto .spro-combo-texto { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spro-rapido { height: 26px; padding: 0 10px; cursor: pointer; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: 99px; font-size: 12px; }
.spro-rapido { display: inline-flex; gap: 5px; align-items: center; }
.spro-rapido-perigo .spro-icone { color: var(--spro-perigo); }
.spro-rapido-aviso .spro-icone { color: var(--spro-aviso); }
.spro-rapido-novo .spro-icone { color: var(--spro-novidade); }
.spro-rapido-on .spro-icone { color: inherit; }
.spro-rapido-on { color: var(--spro-destaque-texto); background: var(--spro-destaque); border-color: var(--spro-destaque); }
.spro-faixa .spro-sel-campo { height: 28px; font-size: 12px; }
.spro-quadro-cfg { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin-bottom: 8px; }
.spro-rotulo-inline { display: inline-flex; gap: 4px; align-items: center; }
.spro-painel, .spro-ajuda-atalhos { display: flex; flex-direction: column; gap: 6px; max-width: 420px; padding: 12px; margin-bottom: 8px; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-2); }
.spro-painel[hidden], .spro-ajuda-atalhos[hidden], .spro-lote[hidden], .spro-quadro-cfg[hidden], .spro-chips[hidden] { display: none; }
.spro-rotulo-linha { display: flex; gap: 6px; align-items: center; }
.spro-linha-form { display: flex; gap: 6px; flex-wrap: wrap; }
.spro-lista-visoes { padding: 0; margin: 0; list-style: none; }
.spro-lista-visoes li { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
kbd { padding: 0 5px; font: 12px var(--spro-mono); background: var(--spro-fundo-3); border: 1px solid var(--spro-borda-forte); border-radius: 4px; }
.spro-status { margin: 4px 2px 8px; color: var(--spro-suave); font-size: 12px; }
.spro-status-alerta { color: var(--spro-aviso); }
.spro-suave { color: var(--spro-suave); }
.spro-lote { position: sticky; top: 0; z-index: 5; display: flex; flex-wrap: wrap; gap: 8px; align-items: center; padding: 8px 10px; margin-bottom: 8px; background: var(--spro-fundo); border: 1px solid var(--spro-destaque); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-2); }
.spro-lote .spro-bt { height: 30px; }

.spro-tabela { background: var(--spro-fundo); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio-g); overflow: hidden; }
.spro-cab, .spro-linha { display: grid; align-items: center; column-gap: 8px; padding: 0 10px; }
.spro-cab { height: 38px; font-weight: 600; background: var(--spro-fundo-2); border-bottom: 1px solid var(--spro-borda); }
.spro-th-b { display: inline-flex; gap: 4px; align-items: center; padding: 0; font-weight: 600; cursor: pointer; background: none; border: 0; }
.spro-seta-ordem { color: var(--spro-destaque); font-size: 11px; }
/* A altura (68vh por padrao) e a rolagem vem de .spro-altura-rolagem (sei-comum/ui/alturaRedimensionavel.css). */
.spro-rolagem { overflow: auto; }
.spro-linha { border-bottom: 1px solid var(--spro-borda); }
.spro-linha:hover { background: var(--spro-fundo-2); }
.spro-sel { background: color-mix(in srgb, var(--spro-destaque) 10%, transparent); }
.spro-foco { box-shadow: inset 3px 0 0 var(--spro-destaque); }
.spro-c { min-width: 0; overflow: hidden; }
.spro-c-marcadores, .spro-c-sinais { display: flex; flex-wrap: wrap; gap: 4px; align-items: center; max-height: 100%; }
/* Marcadores: as p\xEDlulas quebram dentro de .spro-pilulas; o l\xE1pis nunca desce para a linha de baixo. */
.spro-c-marcadores { flex-wrap: nowrap; }
.spro-corta { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spro-proc { font-weight: 600; white-space: nowrap; }
.spro-novo { font-weight: 800; color: var(--spro-perigo); }
.spro-novo:hover { color: var(--spro-perigo); }
.spro-novo::before { content: ""; display: inline-block; width: 7px; height: 7px; margin-right: 5px; background: var(--spro-perigo); border-radius: 50%; }
.spro-sigilo { margin-left: 6px; padding: 0 5px; font-size: 11px; color: var(--spro-perigo); border: 1px solid currentColor; border-radius: 99px; }
.spro-pilulas { display: flex; flex: 0 1 auto; flex-wrap: wrap; gap: 4px; align-items: center; min-width: 0; }
.spro-marcador { display: inline-flex; gap: 4px; align-items: center; max-width: 100%; box-sizing: border-box; height: 20px; padding: 0 7px; overflow: hidden; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; background: var(--spro-fundo-3); border-radius: 99px; }
.spro-marcador i { flex: none; width: 8px; height: 8px; border-radius: 50%; }
.spro-prazo { display: inline-flex; align-items: center; box-sizing: border-box; height: 20px; padding: 0 7px; font-size: 12px; white-space: nowrap; border-radius: 99px; background: var(--spro-fundo-3); }
.spro-prazo-atrasado { color: #fff; background: var(--spro-perigo); }
.spro-prazo-hoje { color: #fff; background: var(--spro-aviso); }
.spro-prazo-noPrazo { background: color-mix(in srgb, var(--spro-ok) 18%, transparent); }
.spro-prazo-concluido { color: var(--spro-suave); text-decoration: line-through; }
.spro-prio { color: var(--spro-aviso); font-weight: 600; }
.spro-sinal { padding: 0 6px; font-size: 11px; color: var(--spro-suave); border: 1px solid var(--spro-borda-forte); border-radius: 99px; white-space: nowrap; }
.spro-grupo { display: flex; gap: 12px; align-items: center; padding: 0 10px; background: var(--spro-fundo-2); border-bottom: 1px solid var(--spro-borda); }
.spro-tom-perigo > .spro-grupo-b, .spro-tom-perigo .spro-col-titulo { color: var(--spro-perigo); }
.spro-grupo-b { display: inline-flex; gap: 6px; align-items: center; font-weight: 700; cursor: pointer; background: none; border: 0; }
.spro-grupo-seta { display: inline-flex; transition: transform var(--spro-dur); }
.spro-fechado { transform: rotate(-90deg); }
.spro-grupo-n { padding: 0 7px; font-size: 11px; font-weight: 600; color: var(--spro-suave); background: var(--spro-fundo-3); border-radius: 99px; }
.spro-vazio { padding: 32px 16px; text-align: center; color: var(--spro-suave); }
.spro-cb { width: 16px; height: 16px; cursor: pointer; }

.spro-quadro { display: flex; flex-direction: column; gap: 14px; }
.spro-colunas { display: flex; gap: 10px; padding-bottom: 8px; overflow-x: auto; align-items: flex-start; }
.spro-raia-nome { margin-bottom: 6px; font-weight: 700; }
.spro-col { flex: 0 0 var(--spro-col-largura, 280px); width: var(--spro-col-largura, 280px); max-height: 70vh; display: flex; flex-direction: column; background: var(--spro-fundo-2); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio-g); }
.spro-col-topo { display: flex; gap: 6px; align-items: center; padding: 8px 10px; font-weight: 700; border-bottom: 1px solid var(--spro-borda); }
.spro-col-arrastavel { cursor: grab; user-select: none; }
.spro-col-arrastavel:active { cursor: grabbing; }
.spro-col-alca { color: var(--spro-fraco); font-size: 12px; letter-spacing: -2px; line-height: 1; flex: none; }
.spro-col-arrastando { opacity: 0.45; }
.spro-col-alvo { outline: 2px solid var(--spro-destaque); outline-offset: -2px; }
.spro-col-titulo { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spro-col-n { padding: 0 7px; font-size: 11px; color: var(--spro-suave); background: var(--spro-fundo-3); border-radius: 99px; }
.spro-col-recolher { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; font-size: 14px; font-weight: 700; line-height: 1; color: var(--spro-suave); cursor: pointer; background: none; border: 1px solid transparent; border-radius: var(--spro-raio-p); }
.spro-col-recolher:hover { color: var(--spro-texto); background: var(--spro-fundo-3); border-color: var(--spro-borda-forte); }
.spro-col-recolhida .spro-col-topo { border-bottom: 0; }
.spro-col-recolhida .spro-col-corpo { display: none; }
.spro-excedeu { color: #fff; background: var(--spro-perigo); }
.spro-col-cheia { border-color: var(--spro-perigo); }
.spro-col-trava { color: var(--spro-fraco); display: inline-flex; }
.spro-col-corpo { display: flex; flex-direction: column; gap: 8px; padding: 8px; overflow-y: auto; min-height: 60px; }
.spro-col-vazia { padding: 18px 0; text-align: center; color: var(--spro-fraco); font-size: 12px; border: 1px dashed var(--spro-borda-forte); border-radius: var(--spro-raio); }
.spro-alvo { outline: 2px dashed var(--spro-destaque); outline-offset: -2px; }
.spro-cartao { display: flex; flex-direction: column; gap: 6px; padding: 8px 10px; cursor: grab; background: var(--spro-fundo); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-1); }
.spro-cartao:hover { border-color: var(--spro-borda-forte); box-shadow: var(--spro-sombra-2); }
.spro-arrastando { opacity: 0.45; }
.spro-cartao-topo { display: flex; gap: 6px; align-items: center; }
.spro-cartao-tipo { font-size: 12px; color: var(--spro-suave); }
.spro-cartao-espec { padding: 5px 8px; font-size: 12px; line-height: 1.35; background: rgba(34, 197, 94, 0.14); border: 1px solid rgba(34, 197, 94, 0.28); border-radius: 8px; word-break: break-word; }
.spro-escuro .spro-cartao-espec { background: rgba(34, 197, 94, 0.16); border-color: rgba(74, 222, 128, 0.28); }
.spro-cartao-anotacao { display: flex; flex-direction: column; gap: 3px; padding: 6px 8px; font-size: 12px; line-height: 1.4; background: rgba(250, 204, 21, 0.2); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: 8px; word-break: break-word; }
.spro-cartao-anotacao-editavel { cursor: pointer; transition: border-color var(--spro-dur), background-color var(--spro-dur); }
.spro-cartao-anotacao-editavel:hover { background: rgba(250, 204, 21, 0.28); border-color: rgba(202, 138, 4, 0.55); }
.spro-escuro .spro-cartao-anotacao { background: rgba(250, 204, 21, 0.16); border-color: rgba(250, 204, 21, 0.3); }
.spro-escuro .spro-cartao-anotacao-editavel:hover { background: rgba(250, 204, 21, 0.24); border-color: rgba(250, 204, 21, 0.55); }
.spro-cartao-anotacao-prio { border-color: rgba(234, 179, 8, 0.65); }
.spro-anot-linha { min-height: 1.2em; }
.spro-anot-tarefa { display: flex; gap: 6px; align-items: flex-start; }
.spro-anot-check { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 15px; height: 15px; margin-top: 1px; padding: 0; font: 700 11px/1 system-ui; color: #fff; cursor: pointer; background: rgba(255, 255, 255, 0.55); border: 1.6px solid rgba(75, 85, 99, 0.8); border-radius: 3px; }
.spro-anot-check:hover { border-color: var(--spro-texto); }
.spro-anot-check-on { background: #4b5563; border-color: #4b5563; }
.spro-escuro .spro-anot-check { background: rgba(255, 255, 255, 0.08); border-color: rgba(209, 213, 219, 0.7); }
.spro-escuro .spro-anot-check-on { background: #9ca3af; border-color: #9ca3af; color: #111827; }
.spro-anot-txt { flex: 1; min-width: 0; }
.spro-anot-feita .spro-anot-txt { text-decoration: line-through; opacity: 0.72; }
.spro-cartao-sinais { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding-top: 2px; }
.spro-cartao-excl, .spro-cartao-marc-ic { display: inline-flex; align-items: center; justify-content: center; line-height: 0; cursor: default; }
.spro-cartao-rodape { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
.spro-cartao-acoes { display: inline-flex; gap: 6px; align-items: center; flex-wrap: wrap; }
.spro-anot-vazia { padding: 1px 8px; font-size: 12px; color: var(--spro-fraco); cursor: pointer; background: none; border: 1px dashed var(--spro-borda-forte); border-radius: 99px; opacity: 0; }
.spro-cartao:hover .spro-anot-vazia, .spro-anot-vazia:focus-visible { opacity: 1; }
.spro-anot-vazia:hover { color: var(--spro-texto); border-color: var(--spro-destaque); }
.spro-avatar { display: inline-grid; place-items: center; width: 24px; height: 24px; font-size: 10px; font-weight: 700; color: var(--spro-destaque-texto); background: var(--spro-destaque); border-radius: 50%; }
.spro-largura-ctrl { display: inline-flex; gap: 4px; align-items: center; }
.spro-largura-bt { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; padding: 0; font-weight: 700; cursor: pointer; background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio-p); }
.spro-largura-bt:hover { background: var(--spro-fundo-2); }
.spro-largura-range { width: 84px; accent-color: var(--spro-destaque); cursor: pointer; }
.spro-largura-val { min-width: 38px; font-size: 11px; color: var(--spro-suave); text-align: right; }

.spro-avisos { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000; display: flex; flex-direction: column; gap: 8px; }
.spro-aviso { display: flex; gap: 10px; align-items: center; max-width: 420px; padding: 10px 12px; color: var(--spro-texto); background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-3); }
@media (max-width: 760px) { .spro-seg-b span, .spro-bt span { display: none; } .spro-col { flex-basis: min(var(--spro-col-largura, 280px), 85vw); width: min(var(--spro-col-largura, 280px), 85vw); } }
@media (prefers-reduced-motion: reduce) { .spro-grupo-seta { transition: none; } }

/* ---- Icones dos outros modulos, edicao inline ---- */
.spro-icones { display: inline-flex; gap: 2px; align-items: center; margin-right: 6px; vertical-align: middle; }
.spro-icones > * { box-sizing: border-box; flex: 0 0 22px; width: 22px; min-width: 0; max-width: 22px; height: 24px; padding: 0 !important; margin: 0 !important; }
.spro-slot { display: inline-block; }
.spro-acomp { align-items: center; justify-content: center; }
.spro-icones button { display: inline-flex; align-items: center; justify-content: center; padding: 2px; cursor: pointer; background: none; border: 0; border-radius: 6px; color: var(--spro-suave); position: relative; }
.spro-icones button:hover { background: var(--spro-fundo-3); }
.spro-icones .spro-fav-estrela[aria-pressed="true"] { color: var(--spro-estrela); }
.spro-acomp { display: inline-flex; color: var(--spro-destaque); }
.spro-urgente { margin-left: 6px; padding: 0 6px; font-size: 11px; font-weight: 700; color: #fff; background: var(--spro-perigo); border-radius: 99px; }
.spro-linha-urgente { box-shadow: inset 3px 0 0 var(--spro-perigo); }
.spro-c-processo { display: flex; align-items: center; min-width: 0; }
.spro-c-processo .spro-proc { flex: none; }
.spro-editavel { position: relative; display: flex; align-items: center; gap: 4px; }
.spro-lapis { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 22px; height: 22px; padding: 0; cursor: pointer; color: var(--spro-suave); background: none; border: 0; border-radius: 6px; opacity: 0; transition: opacity var(--spro-dur); }
.spro-linha:hover .spro-lapis, .spro-lapis:focus-visible, .spro-edicao .spro-lapis { opacity: 1; }
.spro-lapis:hover { color: var(--spro-destaque); background: var(--spro-fundo-3); }
.spro-lapis-ok { color: var(--spro-ok); }
.spro-lapis-fixo { cursor: default; pointer-events: none; }
.spro-edicao { display: flex; flex: 1; gap: 2px; align-items: center; min-width: 0; }
.spro-espec-input { flex: 1; min-width: 0; height: 28px; padding: 0 8px; background: var(--spro-fundo); border: 1px solid var(--spro-destaque); border-radius: var(--spro-raio-p); }
.spro-prazo-b { display: inline-flex; padding: 0; cursor: pointer; background: none; border: 0; text-align: left; }
.spro-prazo-vazio { padding: 1px 8px; font-size: 12px; color: var(--spro-fraco); border: 1px dashed var(--spro-borda-forte); border-radius: 99px; opacity: 0; }
.spro-linha:hover .spro-prazo-vazio, .spro-cartao:hover .spro-prazo-vazio, .spro-prazo-b:focus-visible .spro-prazo-vazio { opacity: 1; }
.spro-prazo-b:hover .spro-prazo, .spro-prazo-b:hover .spro-prazo-vazio { outline: 2px solid color-mix(in srgb, var(--spro-destaque) 40%, transparent); }
.spro-corta { flex: 1; min-width: 0; }

/* ---- Modais de edicao (responsavel, anotacao, marcadores) ---- */
.spro-form { display: flex; flex-direction: column; gap: 12px; min-width: min(420px, 80vw); }
.spro-campo-rotulo { display: flex; flex-direction: column; gap: 6px; font-weight: 600; }
.spro-area { width: 100%; min-height: 120px; padding: 8px 10px; resize: vertical; font: inherit; }
.spro-contador { margin-left: auto; font-size: 12px; }
.spro-estender { padding: 8px 10px; background: var(--spro-fundo-2); border-radius: var(--spro-raio); }
.spro-dialogo-sub { display: block; margin-top: 2px; font-size: 12px; font-weight: 400; color: var(--spro-suave); }
.spro-marcadores-lista { display: flex; flex-direction: column; gap: 8px; }
.spro-marcador-linha { display: grid; grid-template-columns: minmax(120px, 190px) 1fr auto; gap: 8px; align-items: center; }
.spro-vazio-edicao { opacity: 0; font-size: 11px; }
.spro-linha:hover .spro-vazio-edicao { opacity: 1; }

/* ---- Origem do processo e abrir em nova guia ---- */
.spro-origem { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 22px; height: 24px; margin-right: 4px; color: var(--spro-suave); }
.spro-origem-recebidos { color: var(--spro-destaque); }
.spro-origem-gerados { color: var(--spro-ok); }

/* ---- Anotacao em post-it com lista de tarefas ---- */
.spro-dialogo-largo { width: min(640px, 94vw); }
.spro-dialogo-largo .spro-form { min-width: 0; }
.spro-pi { position: relative; display: flex; flex-direction: column; border-radius: 3px; background: linear-gradient(rgb(249, 239, 175), rgb(247, 233, 141)); box-shadow: rgb(0 0 0 / 14%) 0 4px 8px; transition: background 300ms linear; }
.spro-pi-prio { background: linear-gradient(rgb(253, 221, 221), rgb(250, 194, 195)); }
.spro-pi-prio::after { content: "!"; position: absolute; top: 6px; right: 20px; font: 700 54px/1 var(--spro-fonte); color: #e46f642d; pointer-events: none; }
.spro-pi-editor { min-height: 170px; max-height: 46vh; padding: 20px 34px 16px; overflow-y: auto; outline: none; font-size: 14.5px; line-height: 1.55; color: rgb(97, 97, 97); word-break: break-word; white-space: pre-wrap; }
.spro-pi-linha { position: relative; min-height: 1.55em; }
.spro-pi-linha[data-tarefa] { padding-left: 30px; }
.spro-pi-linha[data-tarefa]::before { content: ""; position: absolute; left: 2px; top: 0.28em; width: 16px; height: 16px; box-sizing: border-box; cursor: pointer; border: 1.8px solid rgb(120, 110, 60); border-radius: 4px; background: rgb(255 255 255 / 55%); }
.spro-pi-linha[data-tarefa="x"] { text-decoration: line-through; opacity: 0.8; }
.spro-pi-linha[data-tarefa="x"]::before { content: "\\2713"; text-align: center; font: 700 13px/13px system-ui; color: #fff; background: #4a8f5a; border-color: #4a8f5a; }
.spro-pi-barra { display: flex; gap: 4px; align-items: center; padding: 6px 12px 10px 28px; }
.spro-pi-bt { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; padding: 0; cursor: pointer; color: #4285f4; background: none; border: 0; border-radius: 6px; }
.spro-pi-bt:hover { background: rgb(0 0 0 / 7%); }
.spro-pi-bt[aria-pressed="true"] { color: #e46e64; background: rgb(228 110 100 / 14%); }
.spro-pi-contador { margin-left: auto; font-size: 11px; color: #666; }
.spro-pi-estouro { color: var(--spro-perigo); font-weight: 700; }
.spro-escuro .spro-pi-editor { color: #4b4b4b; }

/* ---- Consulta do andamento (agrupar por data de recebimento, envio, autuacao e unidade de envio) ---- */
.spro-andamento { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 0 0 8px; padding: 6px 10px; font-size: 12px; color: var(--spro-suave); background: var(--spro-fundo-2); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); }
.spro-andamento[hidden] { display: none; }
.spro-andamento progress { flex: 1 1 120px; max-width: 260px; height: 8px; accent-color: var(--spro-destaque); }
.spro-andamento .spro-link { display: inline-flex; gap: 4px; align-items: center; }
.spro-confirma-andamento p { margin: 0 0 10px; line-height: 1.45; }
.spro-confirma-andamento ul { margin: 0 0 10px 18px; padding: 0; }
.spro-confirma-andamento .spro-dialogo-rodape { margin-top: 14px; }
`;var Zs=`/* Botoes "Abrir em nova aba" e "Copiar numero do processo" ao lado do numero (acoesNumeroProcesso.ts). */
.spro-nova-guia,
.spro-copiar-num {
  position: relative;
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  color: var(--spro-suave);
  background: none;
  border: 0;
  border-radius: 6px;
  opacity: 0;
  transition: opacity var(--spro-dur);
}
.spro-nova-guia {
  margin-left: 4px;
}
.spro-copiar-num {
  margin-left: 2px;
}
.spro-acao-num-compacta {
  width: 20px;
  height: 20px;
}
.spro-linha:hover .spro-nova-guia,
.spro-linha:hover .spro-copiar-num,
.spro-lista-item:hover .spro-nova-guia,
.spro-lista-item:hover .spro-copiar-num,
.spro-lista-item:focus-within .spro-nova-guia,
.spro-lista-item:focus-within .spro-copiar-num,
.fav-item:hover .spro-nova-guia,
.fav-item:hover .spro-copiar-num,
.fav-item:focus-within .spro-nova-guia,
.fav-item:focus-within .spro-copiar-num,
.spro-nova-guia:focus-visible,
.spro-copiar-num:focus-visible,
.spro-copiar-num.spro-copiado {
  opacity: 1;
}
@media (hover: none) {
  .spro-nova-guia,
  .spro-copiar-num {
    opacity: 1;
  }
}
.spro-nova-guia:hover,
.spro-copiar-num:hover {
  color: var(--spro-destaque);
  background: var(--spro-fundo-3);
  text-decoration: none;
}
.spro-nova-guia:focus-visible,
.spro-copiar-num:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
.spro-copiar-num.spro-copiado {
  color: var(--spro-ok);
}
.spro-sr {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
`;var Ys=`/* Altura limitada com rolagem interna e a alca que a redimensiona (alturaRedimensionavel.ts). Usa os tokens de base.css. */
.spro-altura-rolagem {
  max-height: var(--spro-altura-max, 480px);
  overflow: auto;
}
/* Tabela dentro da area: o cabecalho acompanha a rolagem. */
.spro-altura-rolagem > table > thead th {
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--spro-fundo);
  box-shadow: inset 0 -1px 0 var(--spro-borda);
}
.spro-altura-alca {
  position: relative;
  box-sizing: border-box;
  height: 14px;
  cursor: ns-resize;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  background: var(--spro-fundo-2);
  border-top: 1px solid var(--spro-borda);
  outline: none;
}
.spro-altura-alca::before {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 44px;
  height: 4px;
  content: "";
  background: var(--spro-borda-forte);
  border-radius: 2px;
  transform: translate(-50%, -50%);
  transition: background var(--spro-dur), width var(--spro-dur);
}
.spro-altura-alca[data-altura="auto"]::before {
  width: 28px;
}
.spro-altura-alca:hover::before,
.spro-altura-alca.spro-altura-arrastando::before {
  background: var(--spro-destaque);
}
.spro-altura-alca:focus-visible {
  box-shadow: inset var(--spro-anel);
}
.spro-altura-alca:focus-visible::before {
  background: var(--spro-destaque);
}
@media (pointer: coarse) {
  .spro-altura-alca {
    height: 22px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spro-altura-alca::before {
    transition: none;
  }
}
`;var oi=`/* Na p\xE1gina do SEI (fora do Shadow DOM): o bot\xE3o alternador e o espa\xE7o da grade. */
/* Mesmo tamanho, margem e cor dos botoes vizinhos da barra de titulo (seta de recolher e ordenar os paineis). */
.spro-grade-botao { display: inline-flex; flex: none; align-items: center; justify-content: center; margin-left: 4px; padding: 2px; line-height: 0; color: inherit; vertical-align: middle; position: relative; top: -3px; cursor: pointer; background: none; border: 0; border-radius: 6px; }
.spro-grade-botao:hover { background: color-mix(in srgb, currentColor 14%, transparent); }
.spro-grade-botao[aria-pressed="true"] { background: color-mix(in srgb, currentColor 9%, transparent); }
.spro-grade-botao:focus-visible { outline: 2px solid #1f5fbf; outline-offset: 1px; }
/* Com a grade ativa a barra de acoes sobe um pouco e ganha respiro antes da barra de ferramentas da grade. */
html[data-spro-grade] #collapseControle { margin-top: -6px; margin-bottom: 22px; }
#spro-grade { display: block; width: 100%; flex: 0 0 100%; }
#spro-grade[hidden], #spro-grade[data-spro-recolhido] { display: none !important; }

/* A seta de recolher (do legado) e os outros botoes da barra de titulo ficam na mesma linha de centro. */
#divInfraBarraLocalizacao:has(.spro-grade-botao) .spro-fav-recolher { vertical-align: middle; position: relative; top: -3px; }
`;var xd="gradecontrole",ei="data-spro-pesquisa-rapida";function Ad(){return new URL(location.href).searchParams.get("acao")==="procedimento_controlar"}var ne=()=>{let o=na(document);return o?o==="escuro":!!document.body?.classList.contains("dark-mode")||aa(localStorage)},mr=null,wo=!1,X=null,Mo=null,ae=null,ri=0,St=!1,pr=null,ti=null,Uo=null,wt=document.readyState!=="loading";function yd(){let o=document.querySelector(Rn);return document.getElementById("divTabelaProcesso")??o?.parentElement??null}function $o(o){Mo?.pronta(),X?.mostrar(!1),Ue(document),o&&o!=="usuario"&&console.warn("[SEI Pro] Grade do controle indispon\xEDvel, usando a vis\xE3o nativa:",o)}function fr(){if(X||!wo)return;let o=new _e(location.href,()=>me(document,location.href)),e=Vr(me(document,location.href)),r=e.unidade.id,t=Jn({local:Dr(chrome.storage.local,"local"),sync:Dr(chrome.storage.sync,"sync")},String(r),e.usuario.login);if(["hdnRecebidosPaginaAtual","hdnGeradosPaginaAtual","hdnDetalhadoPaginaAtual"].some(c=>document.getElementById(c)?.value&&document.getElementById(c).value!=="0")&&!sessionStorage.getItem("spro_grade_reset")){try{sessionStorage.setItem("spro_grade_reset","1")}catch{}Wr(o.http,me(document,location.href)).restaurar().then(()=>location.reload()).catch(()=>$o("pagina intermediaria"));return}try{sessionStorage.removeItem("spro_grade_reset")}catch{}let n=Wo(document);if(!n.processos.length&&!n.totais.recebidos&&!n.totais.gerados)return Mo?.pronta(),$o("caixa vazia");let s=yd();if(!s)return $o("sem ponto de encaixe");let i=n.processos.filter(c=>!c.sigiloso&&c.naPaginaAtual).slice(0,6).map(c=>c.protocolo);X=Ks({doc:document,inicial:n,agora:()=>Date.now(),hoje:()=>Jo(),eu:e.usuario.login||void 0,armazem:t,fonte:Wr(o.http,me(document,location.href),n.visao),mover:{marcador:async(c,l)=>void await Va(o,c,l,{aplicar:!0}),atribuir:async(c,l)=>void await Ha(o,c,l,{aplicar:!0})},acoes:()=>gn(document),css:`${ca}
${Zs}
${Ys}
${Ws}`,escuro:ne(),baixar:(c,l,u)=>ua(c,l,u),novoId:()=>ia(),extras:i.length?async()=>{let c=async p=>{let f;for(let y of i)try{return await Oa(o,p,y)}catch(b){f=b}return console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${p}`,f instanceof Error?f.message:f),[]},[l,u]=await Promise.all([c("marcadores"),c("usuarios")]);return{marcadores:l.map(p=>p.nome),responsaveis:u.map(p=>{let[f,...y]=p.nome.split(" - ");return{sigla:f.trim(),nome:y.join(" - ").trim()||f.trim()}})}}:void 0,aoVoltarNativa:()=>Ae(),enviarAcao:(c,l)=>pn(document,c,l),editarEspecificacao:async(c,l)=>void await Na(o,c,{especificacao:l},{aplicar:!0}),abrirPrazo:c=>{document.documentElement.setAttribute("data-spro-prazos-alvo",c),document.dispatchEvent(new CustomEvent("spro-prazos-abrir"))},anotar:async(c,l)=>void await qa(o,c,l,{aplicar:!0}),consultarAndamento:(c,l)=>nn(o,c,{sigla:e.unidade.sigla,nome:e.unidade.nome},l),consultarDatasMarcadores:(c,l)=>zn(o,c,l)}),X.definirNomesCompletos(St),Ed(X),ti?.(),ti=sa(document,()=>X?.definirTema(ne())),s.before(X.host),hn(document,X.host),Pd(),X.iniciar().then(()=>{Mo?.pronta(),Vo(document)&&Xr(document)}).catch(c=>$o(String(c)))}function Ed(o){Uo?.disconnect();let e=()=>o.definirFiltroExterno(document.documentElement.getAttribute(ei)??"");e(),Uo=new window.MutationObserver(e),Uo.observe(document.documentElement,{attributes:!0,attributeFilter:[ei]})}function Pd(){pr?.disconnect();let o=window.MutationObserver,e=!1;pr=new o(()=>{e||(e=!0,setTimeout(()=>{if(e=!1,!(!X||!wo||X.host.isConnected&&!!X.host.shadowRoot&&document.querySelectorAll("#spro-grade").length===1||ri>=6)){ri+=1,X.fechar(),X=null,Uo?.disconnect(),Uo=null;for(let t of document.querySelectorAll("#spro-grade"))t.remove();(Vo(document)||wo)&&fr()}},150))}),pr.observe(document.body??document.documentElement,{childList:!0,subtree:!0})}function Ae(){mr&&(Vo(document)?(wo=!1,je(localStorage,!1),X?.mostrar(!1),Ue(document)):(wo=!0,je(localStorage,!0),Ge(document,ne()),X&&X.host.isConnected&&X.host.shadowRoot?(X.mostrar(!0),Xr(document)):(X&&(X.fechar(),X=null),Mo=Be($o),Mo.iniciarContagem(),fr())),ae?.(),ae=Qe(document,()=>Vo(document),Ae))}function Sd(o){o!==mr&&(mr=o,o?(wt&&(ae??=Qe(document,()=>Vo(document),Ae)),wo&&(Ge(document,ne()),Mo??=Be($o),wt&&(Mo.iniciarContagem(),fr()))):(wo=!1,je(localStorage,!1),ae?.(),ae=null,pr?.disconnect(),Uo?.disconnect(),Uo=null,X?.fechar(),X=null,Mo?.pronta(),Ue(document)))}function wd(){if(!Ad())return;let o=document.createElement("style");o.textContent=oi,(document.head??document.documentElement).append(o),En(localStorage)&&(wo=!0,Ge(document,ne()),Mo=Be($o)),wn(document,Ae),yn(document,ne);let e=()=>{wt=!0,wo&&(Mo?.iniciarContagem(),fr()),mr&&(ae??=Qe(document,()=>Vo(document),Ae))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e();let r=a=>{St=ta(a,"nomesusuarios"),X?.definirNomesCompletos(St),Sd(ra(a,xd))},t=!1;chrome.storage.onChanged.addListener((a,n)=>{n!=="sync"||!("dataValues"in a)||(t=!0,r(a.dataValues.newValue))}),chrome.storage.sync.get("dataValues").then(a=>{t||r(a.dataValues)}).catch(()=>{wo&&$o("sem prefer\xEAncias")})}wd();})();
