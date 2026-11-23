/* GERADO por grade-controle/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{function qs(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function br(o,e){return{obter:async(r=null)=>await o.get(r),gravar:async r=>{await o.set(r)},remover:async r=>{await o.remove(r)},chaves:typeof o.getKeys=="function"?async()=>await o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(qs(a))};try{chrome.storage.onChanged.addListener(t)}catch{}return()=>{try{chrome.storage.onChanged.removeListener(t)}catch{}}}}}var _t=o=>String(o).padStart(2,"0");function Fo(o=new Date){return`${o.getFullYear()}-${_t(o.getMonth()+1)}-${_t(o.getDate())}`}function Ee(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!e)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(e[1]),Number(e[2])-1,Number(e[3]),12)}function $o(o,e){return Math.round((Ee(e).getTime()-Ee(o).getTime())/864e5)}function lo(o){let[e,r,t]=o.split("-");return`${t}/${r}/${e}`}function qt(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function Vt(o,e){let r=qt(o,e);return!(r===!1||r===0||r==="")}function Ht(o,e){let r=qt(o,e);return r===!0||r===1||r==="1"}function jt(o){try{return!!o.getItem("darkModePro")}catch{return!1}}function Ft(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function Gt(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function"||!o.documentElement)return()=>{};let t=new r(e);return t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>t.disconnect()}function Ut(o=crypto){if(typeof o.randomUUID=="function")return o.randomUUID();let e=o.getRandomValues(new Uint8Array(16));e[6]=(e[6]??0)&15|64,e[8]=(e[8]??0)&63|128;let r=[...e].map(t=>t.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var Bt=`/*
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
  .spro-aviso {
    animation: none;
  }
  * {
    transition-duration: 0ms !important;
  }
}
`;function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var po={fill:"currentColor",stroke:"none"},Qt="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Xt={estrela:[["path",{d:Qt}]],estrelaCheia:[["path",{d:Qt,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...po}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...po}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...po}],["circle",{cx:"12",cy:"12",r:"1.4",...po}],["circle",{cx:"19",cy:"12",r:"1.4",...po}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...po}],["circle",{cx:"15",cy:"6",r:"1.3",...po}],["circle",{cx:"9",cy:"12",r:"1.3",...po}],["circle",{cx:"15",cy:"12",r:"1.3",...po}],["circle",{cx:"9",cy:"18",r:"1.3",...po}],["circle",{cx:"15",cy:"18",r:"1.3",...po}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},xl=Object.keys(Xt);function _(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of Xt[o]){let c=r.createElementNS(t,s);for(let[l,p]of Object.entries(i))c.setAttribute(l,p);a.append(c)}return a}function Kt(o,e,r,t=1e4){let a=URL.createObjectURL(new Blob([e],{type:r})),n=d("a",{href:a,download:o});document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),t).unref?.()}var O=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function vr(o){if(o instanceof O)return o;if(o instanceof DOMException&&o.name==="AbortError")return new O("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new O("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}var Hs={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function K(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Hs[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Jt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Wt=null;function Se(o){return Wt?Wt(o):new DOMParser().parseFromString(o,"text/html")}function q(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var js={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function xr(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=js[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function we(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=xr(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function So(o,e){let r=[],t=new RegExp(`\\b${e}\\(`,"g");for(let a of o.matchAll(t)){let[n]=we(o,a.index+a[0].length);r.push(n)}return r}function V(o){return typeof o=="string"?K(o):o==null?"":String(o)}var Fs=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function wo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Fs))e.add(r[0]);return[...e]}function Y(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function ro(o,e,r={}){let t=Array.isArray(o)?o:wo(o);for(let a of t){let n=Y(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function Zt(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=wo(r).filter(s=>Y(s).get("acao")===e),n=(t.length?t:wo(o.html).filter(s=>Y(s).get("acao")===e)).sort((s,i)=>[...Y(s).keys()].length-[...Y(i).keys()].length)[0];if(!n)throw new O("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Gs(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=we(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=xr(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Us(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=we(o,r.index+r[0].length);e.push({tipo:V(t[0]),idPai:V(t[2]),href:V(t[3]),titulo:V(t[5]),icone:V(t[6]),extra:t[8]==null?void 0:V(t[8])})}return e}function Yt(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function oa(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>V(e[1])))]}var Bs=/\s*\(\d{5,}\)\s*$/;function Qs(o){let e=o.html,r=Gs(e),t=Us(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new O("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=V(a.args[1]),s=Yt(t,n),i=r.filter(c=>c.args[0]==="DOCUMENTO").map(c=>{let l=V(c.args[1]),p=V(c.args[5]),g=V(c.args[7]),m=(c.props.src??"").replace(/&amp;/g,"&"),A=t.find(v=>v.tipo==="ASSINATURA"&&v.idPai===l),{nivel:y,hipotese:M}=Yt(t,l),E=(/documento_([a-z0-9]+)\.svg/.exec(g)?.[1]??"interno").replace("cancelado","interno");return{id:l,numero:V(c.args[15])||(/\((\d{5,})\)\s*$/.exec(p)?.[1]??""),titulo:p.replace(Bs,""),pasta:c.args[2]&&String(c.args[2]).startsWith("PASTA")?String(c.args[2]):null,externo:/documento_download_anexo/.test(m)||!/documento_interno|documento_cancelado|formulario|email/.test(g),formato:E,nivel:y,hipotese:M,assinado:!!A,assinaturas:A?A.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(g),unidadeGeradora:t.find(v=>v.tipo==="UNIDADE_GERADORA"&&v.idPai===l)?.extra,link:V(c.args[3]).replace(/&amp;/g,"&"),src:m,acoes:wo(c.props.acoes??""),botoes:oa(c.props.acoes??"")}});return{idProcedimento:n,protocolo:V(a.args[5])||V(a.args[15]),tipo:V(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:wo(a.props.acoes??""),botoesProcesso:oa(a.props.acoes??""),linkProcesso:V(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:wo(e),pagina:o}}async function ea(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new O("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=ro(t.html,"procedimento_visualizar")&&wo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Qs(t)}function go(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?ro(t.acoes,e):null}return ro(o.acoesProcesso,e)??ro(o.links,e,{id_procedimento:o.idProcedimento})}function io(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var te={publico:"0",restrito:"1"},Pe={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function ae(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(K(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var na="\xA5",Ar="\xB1";function ra(o){return o.map(e=>`${e.id}${Ar}${e.texto}`).join(na)}function Xs(o){return o?o.split(na).map(e=>{let[r,...t]=e.split(Ar);return{id:r,texto:t.join(Ar)}}):[]}function ta(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var G=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Ks(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new O("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,q(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${aa(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??q(t),texto:q(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=oo(r),n=t.find(s=>s.valor===r)??t.find(s=>oo(s.texto)===a)??yr(t.filter(s=>oo(s.texto).includes(a)));if(!n)throw new O("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Xs(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new O("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:ra(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new O("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new O("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new O("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${q(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??yr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??q(r)??e]:[e,e]}hiddenDaLupa(e){let r=ta(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of ta(this.pagina.html)){let t=this.elemento.querySelector(`select#${aa(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:q(n)}));(this.valor(r)??"")||this.definir({[r]:ra(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function Ks(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(l=>l.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let l of c)e.push({nome:t,valor:l.getAttribute("value")??q(l)})}}return e}function oo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Er(o,e,r){let t=oo(e),a=o.find(n=>n.id===e)??o.find(n=>oo(n.texto)===t)??yr(o.filter(n=>oo(n.texto).includes(t)));if(!a)throw new O("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function yr(o){return o.length===1?o[0]:void 0}function aa(o){return o.replace(/([^\w-])/g,"\\$1")}var Js={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Me(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Js[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var Ws=/[A-Za-z0-9\-_.*]/;function sa(o){let e="";for(let r of o)r===" "?e+="+":Ws.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function ia(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${sa(Me(r))}=${sa(Me(t??"",a))}`}).join("&")}function ca(o){let e=r=>encodeURIComponent(Me(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var la="application/x-www-form-urlencoded";function Sr(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=Jt[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var da="application/x-www-form-urlencoded; charset=ISO-8859-1";async function Zs(o,e,r){let t=go(e,"documento_escolher_tipo");if(!t)throw new O("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await G.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=G.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function Ys(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,q(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=Y(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,q(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function pa(o,e,r){let t=await o.arvore(e,{sinal:r});return Ys((await Zs(o,t,r)).pagina)}var ua={tipos_processo:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selTipoProcedimento"},hipoteses_legais:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selHipoteseLegal"},usuarios:{acao:"procedimento_atribuicao_cadastrar",form:"#frmAtividadeAtribuir",campo:"selAtribuicao"},marcadores:{acao:"andamento_marcador_gerenciar",form:"#frmAndamentoMarcadorCadastro",campo:"selMarcador"},grupos_acompanhamento:{acao:"acompanhamento_gerenciar",form:"#frmAcompanhamentoCadastro",campo:"selGrupoAcompanhamento"}};async function ma(o,e,r,t={}){let a;if(e==="tipos_documento")a=(await pa(o,r,t.sinal)).map(s=>({id:s.id,nome:s.nome}));else{let s=ua[e];if(!s)throw new O("ARGUMENTO_INVALIDO",`Lista desconhecida: ${e}.`,Object.keys(ua).concat("tipos_documento").join(" | "));let i=await o.arvore(r,{sinal:t.sinal}),c=go(i,s.acao);if(!c)throw new O("SEI_ACAO_INDISPONIVEL",`Para listar ${e} use um processo aberto na sua unidade.`);if(e==="marcadores"&&(c=ro((await o.http.obter(c,{sinal:t.sinal,aceitarValidacao:!0})).html,"andamento_marcador_cadastrar"),!c))throw new O("SEI_VERSAO_NAO_SUPORTADA","Tela de marcadores n\xE3o reconhecida.");let l=await G.abrir(o.http,c,s.form,{sinal:t.sinal,aceitarValidacao:!0});a=e==="hipoteses_legais"?(await ae(o,l,"1",t.sinal)).map(p=>({id:p.id,nome:p.texto})):l.opcoes(s.campo).filter(p=>p.valor&&p.valor!=="null"&&p.texto).map(p=>({id:p.valor,nome:p.texto}))}let n=t.filtro?oo(t.filtro):"";return n?a.filter(s=>oo(s.nome).includes(n)):a}function fa(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function oi(o,e,r){let t=go(e,"procedimento_alterar"),a=t??go(e,"procedimento_consultar");if(!a)throw new O("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await G.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function ga(o){return o.map(e=>e.texto).filter(Boolean)}async function ha(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new O("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await oi(o.http,a,{sinal:t.sinal});if(!s)throw new O("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...io("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let l=fa(n,"selTipoProcedimento"),p=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:p.valor}),i.push(...io("Tipo",l,p.texto))}if(r.nivel!==void 0){let l=Pe[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:te[r.nivel]}),i.push(...io("N\xEDvel de acesso",l,Pe[te[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let l=fa(n,"selHipoteseLegal"),p=n.valor("rdoNivelAcesso")||te.restrito,g=Er(await ae(o,n,p,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:g.id}),i.push(...io("Hip\xF3tese legal",l,g.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new O("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(i.push(...io("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(i.push(...io("Interessados",ga(n.itensLupa("selInteressadosProcedimento")).join("; "),ga(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:l=>Y(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}async function va(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new O("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function xa(o,e,r){let t=go(o,e);if(!t)throw new O("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Aa=o=>e=>Y(e.url).get("acao")!==o;async function ei(o,e,r,t){let a=await o.http.obter(xa(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return G.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>ro(a.html,s)).find(Boolean);if(!n)throw new O("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return G.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function ya(o,e,r,t){let a=await va(o,e,t.sinal),n=await ei(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??Aa(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Ea(o,e,r,t){return ya(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=io("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...io("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Sa(o,e,r,t){return ya(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(l=>l.valor===a.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=oo(r),i=a.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=i.find(l=>l.valor===r)??i.find(l=>oo(l.texto.split(" - ")[0])===s)??i.find(l=>oo(l.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(l=>oo(l.texto).includes(s)).length===1?i.find(l=>oo(l.texto).includes(s)):void 0);if(!c)throw new O("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(l=>l.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),io("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}async function ri(o,e,r){let t=xa(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function ba(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:q(t[1]),texto:q(t[2]),usuario:q(t[3]),data:q(t[4])}})}async function wa(o,e,r,t){let a=await va(o,e,t.sinal),n=await ri(o,a,t.sinal),s=ba(n),i=oo(r.marcador),c=s.find(m=>oo(m.marcador)===i),l={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...l,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=ro(n.html,"andamento_marcador_remover");if(!m)throw new O("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let A=G.de(n,"#frmGerenciarMarcador",o.http);A.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let y=await o.http.enviar(m,A.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(ba(y).some(M=>M.id===c.id))throw new O("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let p;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))p=G.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=ro(n.html,"andamento_marcador_cadastrar");if(!m)throw new O("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");p=await G.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let g=p.escolher("selMarcador",r.marcador);return p.definir({hdnIdMarcador:g.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?io(`Texto do marcador ${g.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${g.texto}${r.texto?`: ${r.texto}`:""}`}],l.mudancas.length?t.aplicar?(await p.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Aa("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${g.texto}" aplicado em ${a.protocolo}.`}):{...l,resumo:`Vai marcar ${a.protocolo} com "${g.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}var ti={resumido:"R",completo:"P",total:"T"};function Pa(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(q(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(a=>{let n=[...a.querySelectorAll("td")],s=n[1]?.querySelector("a")?.getAttribute("title")??"";return{data:q(n[0]),unidade:q(n[1]),...s?{unidadeNome:s}:{},usuario:q(n[2]),descricao:q(n[3])}}),total:r}}async function Ma(o,e,r={}){let t=r.limite??500,a=await o.http.obter(e,{sinal:r.sinal}),n=ti[r.tipo??"resumido"];n!=="R"&&(a=await G.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:"0"}).enviar({sinal:r.sinal}));let{itens:s,total:i}=Pa(a),c=[...s];for(let l=1;c.length<Math.min(i,t)&&s.length>0;l+=1)a=await G.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:String(l)}).enviar({sinal:r.sinal}),{itens:s}=Pa(a),c.push(...s);return{total:i||c.length,andamentos:c.slice(0,t)}}function Da(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}`:void 0}var ai=["Processo recebido na unidade","Reabertura do processo na unidade"],Ca=/^Processo (?:p\u00FAblico|restrito|sigiloso) gerado/i,ni=/^Processo remetido pela unidade\s+(.+)$/i;function si(o,e){return o.unidade.trim()===e.sigla.trim()&&e.sigla.trim()?!0:!!e.nome?.trim()&&o.unidadeNome?.trim()===e.nome.trim()}function Oa(o,e){let r=typeof e=="string"?{sigla:e}:e,t={},a=o.filter(i=>Ca.test(i.descricao.trim())),n=a[a.length-1],s=n?Da(n.data):void 0;s&&(t.autuacao=s);for(let i of o){if(!si(i,r))continue;let c=i.descricao.trim(),l=Da(i.data);if(l&&(!t.recebimento&&(ai.includes(c)||Ca.test(c))&&(t.recebimento=l),!t.envio)){let p=ni.exec(c);p&&(t.envio=l,t.unidadeEnvio=p[1].trim())}}return t}var wr=[["hoje","Hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["trimestre","Nos \xFAltimos 90 dias"],["antigo","H\xE1 mais de 90 dias"],["sem","Sem informa\xE7\xE3o"]];function ka(o,e){if(!o)return"sem";let r=$o(o,e);return Number.isNaN(r)||r<0?"sem":r<1?"hoje":r<=7?"semana":r<=30?"mes":r<=90?"trimestre":"antigo"}var Pr=1440*6e4,ne=(o,e)=>e-o.consultadoEm>=0&&e-o.consultadoEm<Pr;var De=class extends Error{sessao=!0},ii=2,ci=250,li=5,di=o=>new Promise(e=>setTimeout(e,o));async function La(o){let e=[...o.alvos],r=o.esperar??di,t={feitos:0,total:e.length,semDados:0},a="concluida",n=0,s=o.limiteErros??li;async function i(){for(;a==="concluida";){if(o.sinal.aborted){a="cancelada";return}let c=e.shift();if(!c)return;try{let l=await o.consultar(c,o.sinal);n=0,t.feitos+=1,l||(t.semDados+=1),o.aoResolver(c,l,{...t},!1)}catch(l){if(o.sinal.aborted){a="cancelada";return}if(l.sessao){a="sessao";return}if(n+=1,t.feitos+=1,t.semDados+=1,o.aoResolver(c,null,{...t},!0),n>=s){a="erros";return}}e.length&&await r(o.pausaMs??ci)}}return await Promise.all(Array.from({length:Math.max(1,o.simultaneas??ii)},()=>i())),{motivo:a,progresso:t}}var pi=500;async function Ia(o,e,r,t){if(!e.link)return null;try{let a=await o.http.obter(e.link,{sinal:t});if(!/acao=procedimento_visualizar/.test(a.url)){let c=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)return null;a=await o.http.obter(c.replace(/&amp;/g,"&"),{sinal:t})}let n=ro(a.html,"procedimento_consultar_historico");if(!n)return null;let{andamentos:s}=await Ma(o,n,{tipo:"resumido",limite:pi,sinal:t}),i=Oa(s,r);return Object.keys(i).length?i:null}catch(a){if(a instanceof O&&a.codigo==="SEI_SESSAO_EXPIRADA")throw new De(a.message);if(a instanceof O&&(a.codigo==="SEI_SIGILOSO"||a.codigo==="SEI_ACAO_INDISPONIVEL"||a.codigo==="SEI_NAO_ENCONTRADO"))return null;throw a}}function $a(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Se(r)}}}function Na(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new O("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new O("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=q(r);throw new O("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new O("SEI_VALIDACAO",r,r)}return o}function Ra(o,e={}){let r=new URL(".",o),t=e.fetch??((...g)=>fetch(...g)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(g){n>=a&&await new Promise(m=>s.push(m)),n+=1;try{return await g()}finally{n-=1,s.shift()?.()}}let c=g=>new URL(g.replace(/&amp;/g,"&"),r).href;async function l(g,m,A){return i(async()=>{try{let y=await t(c(g),{credentials:"same-origin",redirect:"follow",...m,signal:A.sinal}),M=Sr(await y.arrayBuffer());return Na($a(y.url||c(g),y.status,M),A)}catch(y){throw vr(y)}})}async function p(g,m={}){return i(async()=>{try{let A=await t(c(g),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),y=new Uint8Array(await A.arrayBuffer()),M=(A.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();M==="text/html"&&Na($a(A.url||c(g),A.status,Sr(y)),m);let E=A.headers?.get("content-disposition")??"",v=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(E)?.[1]??/filename="?([^";]+)"?/i.exec(E)?.[1]??"");return{bytes:y,tipo:M,nome:v}}catch(A){throw vr(A)}})}return{base:r,absoluta:c,baixar:p,obter:(g,m={})=>l(g,{method:"GET"},m),enviar:(g,m,A={})=>l(g,A.utf8?{method:"POST",headers:{"Content-Type":la},body:ca(m)}:{method:"POST",headers:{"Content-Type":da},body:ia(m,A.modos)},A)}}function ui(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function mi(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Mr(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=ui(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:mi(o),sigla:q(r)||q(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var fi=3e4,Ce=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ra(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new O("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Mr(this.base())}linkMenu(e){return Zt(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new O("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=G.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=Y(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new O("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new O("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let p=Y(K(c)).get("id_procedimento")??"",g=i.get("id_protocolo")??"",m={idProcedimento:p,idDocumento:g&&g!==p?g:void 0,linkArvore:K(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<fi)return a.arvore;let n=await ea(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:K(s[1]),texto:K(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=Se(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function se(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var Ta={recebidos:"Recebidos",gerados:"Gerados",detalhado:"Detalhado"},No=(o,e)=>`${o}:${e}`;function za(o,e,r="resumida"){let t={},a=r==="detalhada"?["detalhado"]:["recebidos","gerados"];for(let n of a){let s=n==="detalhado"?[...o]:o.filter(g=>g.grupo===n);if(!s.length)continue;let i=[...new Set(s.map(g=>g.pagina))].sort((g,m)=>g-m),c=n==="detalhado"?"na lista":`em ${Ta[n]}`;if(i.length>1){let g=i.map(m=>m+1).join(" e ");return{ok:!1,motivo:`O SEI s\xF3 aceita, de uma vez, processos de uma mesma p\xE1gina ${c} (marcados nas p\xE1ginas ${g}). Deixe s\xF3 uma p\xE1gina marcada.`}}let l=i[0],p=e.get(No(n,l));if(!p?.itens||!p.hash)return{ok:!1,motivo:`Os dados da p\xE1gina ${l+1} ainda n\xE3o foram lidos. Espere o carregamento terminar.`};t[n]={ids:s.map(g=>g.id),pagina:l,selecao:p}}return{ok:!0,plano:{porGrupo:t,todosNaPaginaAtual:o.every(n=>n.naPaginaAtual)}}}function gi(o){let e={},r=o.porGrupo.detalhado?["detalhado"]:["recebidos","gerados"];for(let t of r){let a=o.porGrupo[t],n=Ta[t];if(e[`hdn${n}ItemId`]="",!a){e[`hdn${n}ItensSelecionados`]="";continue}e[`hdn${n}ItensSelecionados`]=a.ids.join(","),e[`hdn${n}Itens`]=a.selecao.itens,e[`hdn${n}ItensHash`]=a.selecao.hash}return e}function _a(o,e,r){let t=o.getElementById("frmProcedimentoControlar");if(!t)throw new Error("Formul\xE1rio do Controle de Processos n\xE3o encontrado.");let a=o.createElement("form");a.setAttribute("method","post"),a.setAttribute("action",e),a.style.display="none";let n=new Map;for(let s of Array.from(t.querySelectorAll("input, select, textarea")))!s.name||s.disabled||s.type==="checkbox"||s.type==="radio"||s.type==="button"||s.type==="submit"||n.set(s.name,s.value);for(let[s,i]of Object.entries(gi(r)))n.set(s,i);for(let[s,i]of n){let c=o.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",s),c.setAttribute("value",i),a.append(c)}o.body.append(a),a.submit()}var qa=o=>o.some(e=>e.sigiloso);var hi='a[onclick*="acaoControleProcessos"]';function Va(o){let e=/acaoControleProcessos\(\s*'([^']*)'\s*,\s*(true|false)\s*,\s*(true|false)/.exec(o.elemento.getAttribute("onclick")??"");return e?{url:e[1].replace(/&amp;/g,"&"),requerSelecao:e[2]==="true",aceitaSigiloso:e[3]==="true"}:null}function Ha(o){let e=new Set,r=[];for(let t of o.querySelectorAll(hi)){let a=/[?&]acao=([a-z0-9_]+)/.exec(t.getAttribute("onclick")??"")?.[1],n=t.querySelector("img");if(!a||!n||e.has(a))continue;e.add(a);let s=n.getAttribute("title")||n.getAttribute("alt")||a,i=n.getAttribute("src")??"";try{i=new URL(i,o.baseURI||o.location?.href).href}catch{}r.push({acao:a,rotulo:s,icone:i,elemento:t})}return r}var bi="data-spro-recolhido",vi=".collapseTabelaProcesso";function xi(o){let e=[...o.querySelectorAll(vi)].filter(r=>r.id!=="spro-grade");return e.length>0&&e.some(r=>r.classList.contains("displayNone"))}function ja(o,e,r=o.defaultView?.MutationObserver){let t=()=>e.toggleAttribute(bi,xi(o));if(t(),!r)return()=>{};let a=new r(t);return a.observe(o.body??o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0}),()=>a.disconnect()}var Ai=/^\s*\[( |x|X)\]\s?(.*)$/;function Po(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=Ai.exec(e);return r?{marca:r[1]!==" ",texto:r[2]}:{marca:null,texto:e}})}function Oe(o){return o.map(e=>e.marca===null?e.texto:`${e.marca?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Dr(o,e){let r=new Set(e.filter(a=>a>=0&&a<o.length));if(!r.size)return[...o];let t=[...r].every(a=>o[a].marca!==null);return o.map((a,n)=>r.has(n)?{...a,marca:t?null:a.marca??!1}:a)}function ke(o,e){return o.map((r,t)=>t===e&&r.marca!==null?{...r,marca:!r.marca}:r)}function Fa(o){return Po(o).filter(e=>e.marca!==null||e.texto.trim()).map(e=>e.marca===null?e.texto:`${e.marca?"\u2611":"\u2610"} ${e.texto}`).join(" / ")}var Ie="data-tip",Ga="data-tip-nota",yi="data-tip-autor",Le=0,Ei=`
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
`,Ua=o=>o.nodeType===1,Si=o=>o.some(e=>Ua(e)&&(e.id==="spro-grade"||e.classList.contains("spro-grade-botao")));function Cr(o){if(!Si(o))return null;for(let e of o)if(Ua(e)){if(e.id==="spro-grade")return null;if(e.hasAttribute(Ie)||e.hasAttribute(Ga)||e.hasAttribute("title"))return e}return null}function Ro(o){let e=o.getAttribute("title");return e&&(o.hasAttribute(Ie)||o.setAttribute(Ie,e),!o.hasAttribute("aria-label")&&!(o.textContent??"").trim()&&o.setAttribute("aria-label",e.split(`
`)[0]),o.removeAttribute("title")),o.getAttribute(Ie)??""}function wi(o,e,r){let t=o.ownerDocument,a=t.createElement("div");a.className="nota";for(let n of Po(e)){if(n.marca===null&&!n.texto.trim())continue;let s=t.createElement("div");s.className="nota-l",n.marca!==null&&s.setAttribute("data-t",n.marca?"x":"o"),s.textContent=n.texto,a.append(s)}if(r){let n=t.createElement("div");n.className="nota-autor",n.textContent=r,a.append(n)}o.replaceChildren(a)}var Or=null;function Ba(o){let e=a=>{if(a.nodeType!==1)return;let n=a;n.hasAttribute("title")&&Ro(n);for(let s of Array.from(n.querySelectorAll("[title]")))Ro(s)};if(e(o.nodeType===11?o.host:o),o.nodeType===11)for(let a of Array.from(o.querySelectorAll("[title]")))Ro(a);let r=(o.ownerDocument??o).defaultView?.MutationObserver;if(!r)return()=>{};let t=new r(a=>{for(let n of a)if(n.type==="attributes")e(n.target);else for(let s of Array.from(n.addedNodes))e(s);Or?.()});return t.observe(o,{attributes:!0,attributeFilter:["title"],childList:!0,subtree:!0}),()=>t.disconnect()}function Pi(o){let e=[],r=o;for(;r;)e.push(r),r=r.nodeType===11?r.host??null:r.parentNode;return e}function Mi(o,e,r){let a=o.bottom+8,n=!1;a+e.altura>r.h-4&&o.top-8-e.altura>=4&&(a=o.top-8-e.altura,n=!0);let s=o.left+o.width/2-e.largura/2;return s=Math.max(4,Math.min(s,r.w-e.largura-4)),{x:Math.round(s),y:Math.round(Math.max(4,a)),acima:n}}function Qa(o,e=()=>!1){let r=o.defaultView;if(!r)return()=>{};let t=o.createElement("div");t.id="spro-dica-host";let a=t.attachShadow({mode:"open"}),n=o.createElement("style");n.textContent=Ei;let s=o.createElement("div");s.className="dica",s.setAttribute("role","tooltip"),s.hidden=!0,s.setAttribute("popover","manual"),a.append(n,s),o.documentElement.append(t);let i=null,c,l=!1,p=null;function g(){clearTimeout(c),i=null,l=!1,s.classList.remove("on"),s.hidden=!0;try{s.matches?.(":popover-open")&&s.hidePopover()}catch{}}function m(){if(!i||!i.isConnected)return y();let P=i.getAttribute(Ga),x=P!==null?P:Ro(i);if(!x)return g();P!==null?wi(s,P,i.getAttribute(yi)??""):s.textContent=x,s.classList.toggle("claro",!e()),s.hidden=!1;try{typeof s.showPopover=="function"&&!s.matches(":popover-open")&&s.showPopover()}catch{}let w=i.getBoundingClientRect(),I=s.getBoundingClientRect(),L=Mi(w,{largura:I.width,altura:I.height},{w:r.innerWidth,h:r.innerHeight});s.style.left=`${L.x}px`,s.style.top=`${L.y}px`,s.classList.add("on"),l=!0}function A(P,x){let w=o.elementFromPoint(P,x);for(let I=0;I<4&&w?.shadowRoot;I++){let L=w.shadowRoot.elementFromPoint(P,x);if(!L||L===w)break;w=L}return w}function y(){if(!p)return g();let P=A(p.x,p.y),x=P?Cr(Pi(P)):null;if(x===i&&i?.isConnected)return;let w=l;g(),x&&(Ro(x),i=x,w||Le===0?m():c=setTimeout(m,Le))}Or=()=>{i&&!i.isConnected&&y()};let M=P=>{let x=P;typeof x.clientX=="number"&&(p={x:x.clientX,y:x.clientY});let w=Cr(P.composedPath());w===i&&i?.isConnected||(g(),w&&(Ro(w),i=w,Le>0?c=setTimeout(m,Le):m()))},E=P=>{let x=Cr(P.composedPath());!x||!x.matches?.(":focus-visible")||(g(),Ro(x),i=x,m())},v=()=>g();return o.addEventListener("pointerover",M,!0),o.addEventListener("mouseover",M,!0),o.addEventListener("pointermove",M,!0),o.addEventListener("mousemove",M,!0),o.addEventListener("focusin",E,!0),o.addEventListener("focusout",g,!0),o.addEventListener("pointerdown",g,!0),o.addEventListener("keydown",g,!0),o.addEventListener("scroll",g,!0),o.documentElement.addEventListener("pointerleave",v),()=>{g(),Or=null,o.removeEventListener("pointerover",M,!0),o.removeEventListener("mouseover",M,!0),o.removeEventListener("pointermove",M,!0),o.removeEventListener("mousemove",M,!0),o.documentElement.removeEventListener("pointerleave",v),o.removeEventListener("focusin",E,!0),o.removeEventListener("focusout",g,!0),o.removeEventListener("pointerdown",g,!0),o.removeEventListener("keydown",g,!0),o.removeEventListener("scroll",g,!0),t.remove()}}var to="data-spro-grade",ho="data-spro-grade-pronta",ie="data-spro-grade-escuro",kr="spro_grade",Lr="spro-grade-pre";var Di="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function Ci(){let o=Di.split(", ").map(t=>`html[${to}] ${t}`).join(`,
`),e=`html[${to}]:not([${ho}]) #divTabelaProcesso::before,
html[${to}]:not([${ho}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before`,r=["#divFiltro","#newFiltro","#processosProActions","#processosKanban"].map(t=>`html[${to}] ${t}`).join(`,
`);return`${o} { display: none !important; }
/* Com a grade pronta, o container nativo das tabelas (min-height: 200px) so deixaria um vazio entre a grade e o painel de baixo. */
html[${to}][${ho}] #divTabelaProcesso { display: none !important; }
${r} { display: none !important; }
html[${to}] #divRecebidosAreaPaginacaoSuperior, html[${to}] #divRecebidosAreaPaginacaoInferior,
html[${to}] #divGeradosAreaPaginacaoSuperior, html[${to}] #divGeradosAreaPaginacaoInferior { display: none !important; }
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
html[${to}][${ie}]:not([${ho}]) #divTabelaProcesso::before,
html[${to}][${ie}]:not([${ho}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { --spro-sk: #2c333b; --spro-sk-2: #232a31; }
@keyframes spro-grade-pulso { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  html[${to}]:not([${ho}]) #divTabelaProcesso::before,
  html[${to}]:not([${ho}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { animation: none; }
}`}function Xa(o){try{return o.getItem(kr)==="1"}catch{return!1}}function $e(o,e){try{e?o.setItem(kr,"1"):o.removeItem(kr)}catch{}}function Ne(o,e){let r=o.documentElement;if(r.setAttribute(to,"1"),r.removeAttribute(ho),e?r.setAttribute(ie,"1"):r.removeAttribute(ie),!o.getElementById(Lr)){let t=o.createElement("style");t.id=Lr,t.textContent=Ci(),(o.head??r).append(t)}}function Re(o){let e=o.documentElement;e.removeAttribute(to),e.removeAttribute(ho),e.removeAttribute(ie),o.getElementById(Lr)?.remove()}var To=o=>o.documentElement.hasAttribute(to);function Ir(o){o.documentElement.setAttribute(ho,"1")}function Te(o,e={setTimeout:(r,t)=>setTimeout(r,t),clearTimeout:r=>clearTimeout(r)}){let r=!1,t,a=s=>{r||(r=!0,e.clearTimeout(n),e.clearTimeout(t),o(s))},n=e.setTimeout(()=>a("teto"),1e4);return{iniciarContagem(){r||(t=e.setTimeout(()=>a("prazo"),1500))},pronta(){r=!0,e.clearTimeout(n),e.clearTimeout(t)},falhou:s=>a(s),encerrada:()=>r}}var Ka="http://www.w3.org/2000/svg",Oi={grade:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M3.5 9.5h17M9 9.5v10M3.5 14.5h17"}]],quadro:[["rect",{x:"3.5",y:"4.5",width:"4.6",height:"15",rx:"1.2"}],["rect",{x:"9.7",y:"4.5",width:"4.6",height:"9",rx:"1.2"}],["rect",{x:"15.9",y:"4.5",width:"4.6",height:"12",rx:"1.2"}]],lista:[["path",{d:"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"}]],agrupar:[["path",{d:"M4 6h16M4 12h10M4 18h13"}],["path",{d:"M18 10l3 2-3 2"}]],colunas:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M9.2 4.5v15M14.8 4.5v15"}]],disquete:[["path",{d:"M5 4.5h11l3.5 3.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"}],["path",{d:"M8 4.5v5h7v-5M8 20v-6h8v6"}]],densidade:[["path",{d:"M4 6h16M4 10h16M4 14h16M4 18h16"}]],semPessoa:[["circle",{cx:"12",cy:"8.5",r:"3.6"}],["path",{d:"M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5M4 4l16 16"}]],olhoFechado:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}],["path",{d:"M4 4l16 16"}]],recebido:[["path",{d:"M4 13.5l2.2-7A1.6 1.6 0 0 1 7.7 5.4h8.6a1.6 1.6 0 0 1 1.5 1.1l2.2 7"}],["path",{d:"M4 13.5V18a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18v-4.5h-4.6a3.4 3.4 0 0 1-6.8 0z"}]],gerado:[["path",{d:"M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z"}],["path",{d:"M14 3.5V7.5h4M9.5 14.5h5M9.5 17h3"}],["path",{d:"M9.5 11.5l2-2 2 2M11.5 9.5v3.5"}]],novaGuia:[["path",{d:"M14 4.5h5.5V10M19.5 4.5L11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],prioridade:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 7.5v5.5M12 16.4h.01"}]],seta:[["path",{d:"M6 9l6 6 6-6"}]],setaDireita:[["path",{d:"M9 6l6 6-6 6"}]],desfazer:[["path",{d:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"}]],bloquear:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],informacao:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 11v5M12 8h.01"}]]};function no(o,e=16,r=document){let t=r.createElementNS(Ka,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[n,s]of Object.entries(a))t.setAttribute(n,s);for(let[n,s]of Oi[o]){let i=r.createElementNS(Ka,n);for(let[c,l]of Object.entries(s))i.setAttribute(c,l);t.append(i)}return t}var ze="spro-grade-botao",ki="#processosSEIPro .titlePanelHome, #processosSEIPro #divInfraBarraLocalizacao, #divInfraBarraLocalizacao.titlePanelHome, #divInfraBarraLocalizacao",Li="Usar o Novo Controle de Processos",Ii="Voltar \xE0 vis\xE3o nativa do SEI";function $i(o,e,r){let t=o.querySelector(ki);if(!t)return!1;let a=e?Ii:Li,n=t.querySelector(`.${ze}`);n||(n=o.createElement("button"),n.type="button",n.className=ze,n.append(no("grade",18,o)),t.append(n));let s=[...t.children].filter(i=>i.classList.contains("spro-pnl-botao")).at(-1);return s&&s.compareDocumentPosition(n)&2&&s.after(n),n.setAttribute("data-tip",a),n.removeAttribute("title"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",String(e)),!0}function Wa(o,e){let r=t=>{(t.composedPath?.()[0]??t.target)?.closest?.(`.${ze}`)&&(t.preventDefault(),t.stopPropagation(),e())};return o.addEventListener("click",r,!0),()=>o.removeEventListener("click",r,!0)}var Ja=o=>{for(let e of o.querySelectorAll(`.${ze}`))e.remove()};function _e(o,e,r){let t=()=>$i(o,e(),r);t();let a=o.defaultView?.MutationObserver;if(!a||!o.body)return()=>Ja(o);let n=!1,s=new a(()=>{n||(n=!0,queueMicrotask(()=>{n=!1,s.disconnect(),t(),s.observe(o.body,{childList:!0,subtree:!0})}))});return s.observe(o.body,{childList:!0,subtree:!0}),()=>{s.disconnect(),Ja(o)}}function Q(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Ni=/<div(?: style="text-decoration: line-through;")?><i class="(far fa-square|fas fa-check-square)"><\/i> ?([\s\S]*?)<\/div>/g;function Ri(o){return o.includes("<div")?o.replace(Ni,(e,r,t)=>`
${r==="far fa-square"?"[ ]":"[X]"} ${t}
`).replace(/\n{2,}/g,`
`).trim():o}var Ti=/^Anota[\u00e7c][\u00e3a]o( com prioridade)?\s+\/\s+([\s\S]*)\s+\/\s+(.*)$/i;function Za(o){let e=o.querySelector('a[href*="acao=anotacao_registrar"]');if(!e)return null;let r=e.querySelector("img")?.getAttribute("src")??"",t=/anotacao2\.|prioridade/i.test(r),a=Ti.exec(e.getAttribute("aria-label")??"");if(a){let i=K(a[2]).replace(/\r\n?/g,`
`).trim();return i?{texto:i,autor:a[3].trim(),prioridade:!!a[1]||t}:null}let n=So(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];if(typeof n?.[0]!="string")return null;let s=Ri(V(n[0])).trim();return s?{texto:s,autor:V(n[1]).trim(),prioridade:t}:null}function Ya(o,e,r){if(e){let a={idProcedimento:o,origem:"nativo",vencimento:e.data,idControlePrazo:e.idControlePrazo,sigla:e.sigla,linkNativo:e.link,...e.concluidoEm?{concluidoEm:e.concluidoEm}:{}};return r?.vencimento&&r.data===e.data?{...a,origem:"ambos",hora:r.hora,texto:r.texto||void 0}:a}if(!r)return null;let t={idProcedimento:o,origem:"marcador",hora:r.hora,texto:r.texto||void 0};return r.vencimento?{...t,vencimento:r.data}:{...t,inicio:r.data}}var zi='a[href*="acao=controle_prazo_definir"]',_i=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,on=(o,e,r)=>`${r}-${e}-${o}`;function qi(o){let e=o.trim().toLowerCase(),r=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(e);return r?{estado:"concluido",concluidoEm:on(r[1],r[2],r[3])}:/^at[e\u00E9] hoje$/.test(e)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(e)?{estado:"atrasado"}:/^\d+ dias?$/.test(e)?{estado:"noPrazo"}:null}function $r(o){let e=o.querySelector(zi);if(!e)return null;let r=e.getAttribute("aria-label")??"";if(!r){let l=So(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof l?.[0]=="string"&&(r=`Controle de Prazo / ${V(l[0])}`)}let t=_i.exec(K(r).replace(/\s+/g," ").trim());if(!t)return null;let a=qi(t[5]);if(!a)return null;let n=K(e.getAttribute("href")??""),s=Y(n),i=s.get("id_controle_prazo")??"",c=s.get("id_procedimento")??o.id.replace(/^P/,"");return!i||!c?null:{idControlePrazo:i,idProcedimento:c,sigla:t[1],data:on(t[2],t[3],t[4]),link:n,...a}}var en=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,rn=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,tn=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function Vi(o,e,r){let t=`${r}-${e}-${o}`;try{return Fo(Ee(t))===t?t:null}catch{return null}}var Hi=o=>o.padStart(2,"0");function Nr(o){let e=o.replace(/\r\n?/g,`
`),r=en.exec(e);if(!r)return null;let t=Vi(r[1],r[2],r[3]);if(!t)return null;let a=rn.exec(e),n=a?`${Hi(a[1])}:${a[2]}`:void 0,s=tn.test(e),i=e.replace(tn,"").replace(en,"");return a&&(i=i.replace(rn,"")),i=i.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:s,texto:i}}function an(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=So(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&e.push({texto:V(t[0]),nome:V(t[1])})}return e}function nn(o,e){let r=o.querySelector("input[type=checkbox]"),t=o.querySelector("a[href*='procedimento_trabalhar']");if(!r||!t)return null;let a=r.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(t.getAttribute("class")??""),s=[...o.querySelectorAll("td")],i=n?[]:[...s[1]?.querySelectorAll("a[aria-label]")??[]].map(c=>c.getAttribute("aria-label")??"");return{idProcedimento:r.getAttribute("value")??Y(t.getAttribute("href")??"").get("id_procedimento")??"",protocolo:r.getAttribute("title")??q(t),grupo:e,tipo:/Tipo (.*?)(?: \/ Especifica|$)/.exec(a)?.[1]?.trim()??"",especificacao:n?"":/Especifica\S* (.*)$/.exec(a)?.[1]?.trim()??"",sigiloso:n,novo:/NaoVisualizado/.test(t.getAttribute("class")??""),atribuido:q(s[s.length-1]).replace(/^\(|\)$/g,""),sinais:i,documentoNovo:!!s[1]?.querySelector("img[src*='exclamacao']")||i.some(c=>/documento foi inclu/i.test(c))}}var ji=/marcador_([a-z0-9_]+)\.svg/i,Fi=/\b(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?\b/;function sn(o){let e=Fi.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function Gi(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=So(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],a=K(r.getAttribute("aria-label")??"").trim(),n=/^Marcador\s*\/\s*(.*)$/s.exec(a),s=(typeof t?.[1]=="string"&&t[1]?V(t[1]):n?.[1]??"").trim();if(!s)continue;let i=typeof t?.[0]=="string"?V(t[0]).trim():"",c=sn(a)??sn(i);e.push({nome:s,cor:ji.exec(r.querySelector("img")?.getAttribute("src")??"")?.[1]??"",texto:i,...c!==void 0?{dataHora:c}:{}})}return e}function Ui(o){let e=[];for(let r of o.querySelectorAll("a")){let t=r.querySelector("img")?.getAttribute("src")??"",a=/retorno_(programado|aguardando)(\d)?\.svg/.exec(t);if(!a)continue;let n=K(r.getAttribute("aria-label")??"").trim();e.push({tipo:a[1],descricao:n,atrasado:a[2]==="3"||/atrasad/i.test(n)})}return e}function Bi(o){let e=o.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla'),r=e?.textContent?.trim();if(!e||!r)return;let t=K(e.getAttribute("title")??"").replace(/^Atribu[i\u00ED]do para\s+/i,"").trim();return{sigla:r,nome:t||r}}function Rr(o,e){let r=nn(o,e.grupo);if(!r?.idProcedimento)return null;let t=Gi(o),a=null;for(let g of an(o)){let m=Nr(g.texto);if(m){a=m;break}}let n={id:r.idProcedimento,protocolo:r.protocolo,grupo:e.grupo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso,naoVisualizado:r.novo,marcadores:r.sigiloso?[]:t,retornos:r.sigiloso?[]:Ui(o),acompanhamentoEspecial:!r.sigiloso&&!!o.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),documentoNovo:r.documentoNovo,pagina:e.pagina,naPaginaAtual:e.naPaginaAtual},s=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("onmouseover")??"";/\(URGENTE\)/.test(s)&&(n.urgente=!0),/\(TRANCADO\)/.test(s)&&(n.trancado=!0);let i=o.querySelector(".acompanhamentoesp_icon");if(i){let g=So(i.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof g?.[1]=="string"&&g[1]&&(n.acompanhamentoGrupo=V(g[1]))}let c=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("href");c&&(n.link=K(c));let l=o.querySelector('a[href*="acao=andamento_marcador_gerenciar"]')?.getAttribute("href");l&&!r.sigiloso&&(n.linkMarcadores=K(l));let p=Bi(o);if(p&&(n.atribuicao=p),!r.sigiloso){let g=Za(o);g&&(n.anotacao=g);let m=Ya(n.id,$r(o),a);m&&(n.prazo=m)}return n}var ln="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado",Qi={recebidos:"tblProcessosRecebidos",gerados:"tblProcessosGerados"},Xi=[[/^tipo( do processo)?$/,"tipo"],[/^especificacao$/,"especificacao"],[/^(atribuicao|atribuido( para)?|responsavel)$/,"atribuicao"],[/^marcador(es)?$/,"marcador"],[/^prioridade$/,"prioridade"],[/^interessados?$/,"interessados"],[/^observacao$/,"observacao"],[/^ultima mov/,"ultimaMov"]];function Ki(o){let e=new Map;return[...(o.querySelector("thead tr")??[...o.querySelectorAll("tr")].find(t=>t.querySelector("th")))?.children??[]].forEach((t,a)=>{let n=Q(t.textContent??""),s=Xi.find(([i])=>i.test(n));s&&e.set(a,s[1])}),e}function cn(o){let e=(o?.querySelector("caption")?.textContent??"").replace(/\s+/g," "),r=Number(/(\d+)\s+registro/.exec(e)?.[1]??0),t=/(\d+)\s+a\s+(\d+)\s*\)?/.exec(e);return{total:r,porPagina:t?Number(t[2])-Number(t[1])+1:0}}function Ji(o,e,r){if(!r.size)return;let t=[...e.children];for(let[a,n]of r){let s=(t[a]?.textContent??"").replace(/\s+/g," ").trim();if(s)if(n==="tipo"&&!o.tipo)o.tipo=s;else if(n==="especificacao"&&!o.especificacao&&!o.sigiloso)o.especificacao=s;else if(n==="atribuicao"&&!o.atribuicao){let i=s.replace(/^\(|\)$/g,"");o.atribuicao={sigla:i,nome:i}}else if(n==="marcador"&&!o.marcadores.length&&!o.sigiloso)o.marcadores=[{nome:s,cor:"",texto:""}];else{if(o.sigiloso&&(n==="interessados"||n==="observacao"))continue;if(n==="prioridade")o.prioridade=s;else if(n==="interessados")o.interessados=s;else if(n==="observacao")o.observacao=s;else if(n==="ultimaMov"){let i=/(\d{2})\/(\d{2})\/(\d{4})/.exec(s);i&&(o.ultimaMov=`${i[3]}-${i[2]}-${i[1]}`)}}}}function Wi(o){let e=o.querySelector("input[type=checkbox]")?.getAttribute("name")??"";return/^chkGerados/i.test(e)?"gerados":"recebidos"}function Go(o,e={}){let r=e.pagina??0,t=e.naPaginaAtual??!0,a=[],n={recebidos:0,gerados:0},s={recebidos:0,gerados:0},i=o.getElementById("tblProcessosDetalhado"),c=new Set,l=m=>{m&&!c.has(m.id)&&(c.add(m.id),a.push(m))};for(let m of["recebidos","gerados"]){let A=o.getElementById(Qi[m]),{total:y,porPagina:M}=cn(A);n[m]=y,s[m]=M;for(let E of A?.querySelectorAll('tr[id^="P"]')??[]){let v=E.classList.contains("typeGerados")?"gerados":m;l(Rr(E,{grupo:v,pagina:r,naPaginaAtual:t}))}}if(i){let m=Ki(i),{total:A,porPagina:y}=cn(i);for(let M of i.querySelectorAll("tr")){if(!M.querySelector('a[href*="procedimento_trabalhar"]'))continue;let E=Wi(M),v=Rr(M,{grupo:E,pagina:r,naPaginaAtual:t});v&&!c.has(v.id)&&(Ji(v,M,m),l(v),n[E]=Math.max(n[E],A),s[E]=Math.max(s[E],y))}}let p=m=>o.getElementById(m)?.getAttribute("value")??"",g={recebidos:{itens:p("hdnRecebidosItens"),hash:p("hdnRecebidosItensHash")},gerados:{itens:p("hdnGeradosItens"),hash:p("hdnGeradosItensHash")},detalhado:{itens:p("hdnDetalhadoItens"),hash:p("hdnDetalhadoItensHash")}};return{processos:a,totais:n,porPagina:s,visao:i?"detalhada":"resumida",selecoes:g}}var Zi=/\b(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\b/;function Yi(o){let e=Zi.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]),Number(e[5]),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function oc(o){let e={};for(let r of o.querySelectorAll("tr.infraTrClara, tr.infraTrEscura, table.infraTable tr")){let t=[...r.children].filter(i=>i.tagName==="TD");if(t.length<3)continue;let a="",n;for(let i of t){let c=(i.textContent??"").replace(/\u00A0/g," ").replace(/\s+/g," ").trim();if(!a&&i.querySelector('img[src*="marcador_"]')&&(a=c||(i.querySelector("img")?.getAttribute("title")??"").trim()),n===void 0){let l=Yi(c);l!==void 0&&(n=l)}}if(!a||n===void 0)continue;let s=Q(a);(e[s]===void 0||n>e[s])&&(e[s]=n)}return e}async function dn(o,e,r){if(!e.linkMarcadores)return null;try{let t=await o.http.obter(e.linkMarcadores,{sinal:r}),a=oc(t.doc);return Object.keys(a).length?a:null}catch(t){return t instanceof O&&(t.codigo==="SEI_SIGILOSO"||t.codigo==="SEI_ACAO_INDISPONIVEL"||t.codigo==="SEI_NAO_ENCONTRADO"||t.codigo==="CANCELADO"),null}}var ec=60;async function pn(o,e,r={}){let t=r.maxPaginas??ec,a=[],n=new Set(o.processos.map(l=>l.id)),s=!0,i,c=!1;try{for(let l of["recebidos","gerados"]){let p=o.totais[l],g=o.processos.filter(y=>y.grupo===l).length,m=o.porPagina[l]||g||1,A=Math.max(1,Math.ceil(p/m));for(let y=1;g<p;y+=1){if(r.sinal?.aborted)return s=!1,{processos:a,completo:s,...i?{erro:i}:{}};if(y>=t){s=!1;break}c=!0;let M=await e.pagina(l,y,r.sinal),E=Go(M,{pagina:y,naPaginaAtual:!1}),v=E.processos.filter(P=>P.grupo===l&&!n.has(P.id));if(!v.length)break;for(let P of v)n.add(P.id);g+=v.length,a.push(...v),E.visao==="detalhada"?r.aoSelecao?.("detalhado",y,E.selecoes.detalhado):r.aoSelecao?.(l,y,E.selecoes[l]),r.aoPagina?.(v),r.aoProgresso?.({grupo:l,paginasLidas:y+1,paginasTotal:A,processos:g,total:p})}g<p&&(s=!1)}}catch(l){s=!1,i=l instanceof Error?l.message:String(l)}finally{if(c)try{await e.restaurar()}catch(l){i??=`N\xE3o foi poss\xEDvel voltar \xE0 primeira p\xE1gina: ${l instanceof Error?l.message:String(l)}`}}return{processos:a,completo:s,...i?{erro:i}:{}}}var rc=["hdnRecebidosItensSelecionados","hdnGeradosItensSelecionados","hdnRecebidosItemId","hdnGeradosItemId","hdnDetalhadoItensSelecionados","hdnDetalhadoItemId"];function Tr(o,e,r="resumida"){let t="#frmProcedimentoControlar",a=()=>({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",hdnDetalhadoPaginaAtual:"0",...Object.fromEntries(rc.map(n=>[n,""]))});return{async pagina(n,s,i){let c=r==="detalhada"?"hdnDetalhadoPaginaAtual":n==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual";return(await G.de(e,t,o).definir({...a(),[c]:String(s)}).enviar({sinal:i,aceitarValidacao:!0})).doc},async restaurar(n){await G.de(e,t,o).definir(a()).enviar({sinal:n,aceitarValidacao:!0})},restaurarAoSair(){try{let n=G.de(e,t,o);fetch(o.absoluta(n.action),{method:"POST",keepalive:!0,credentials:"include",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(n.definir(a()).pares()).toString()}).catch(()=>{})}catch{}}}}var tc=30*6e4,un=5e3,zr=()=>({vistoEm:{}});function fn(o){if(!o||typeof o!="object")return zr();let e=o,r={};if(e.vistoEm&&typeof e.vistoEm=="object")for(let[i,c]of Object.entries(e.vistoEm))typeof c=="number"&&Number.isFinite(c)&&c>0&&(r[i]=c);let t=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0,a={vistoEm:r},n=t(e.visitaAtual),s=t(e.visitaAnterior);return n!==void 0&&(a.visitaAtual=n),s!==void 0&&(a.visitaAnterior=s),a}function gn(o,e){return o.visitaAtual===void 0?{...o,visitaAtual:e}:e-o.visitaAtual>tc?{...o,visitaAnterior:o.visitaAtual,visitaAtual:e}:o}function _r(o,e,r,t){let a={...o.vistoEm};for(let s of e)a[s]===void 0&&(a[s]=r);if(t){let s=new Set(e);for(let i of Object.keys(a))s.has(i)||delete a[i]}let n=Object.keys(a);if(n.length>un)for(let s of n.sort((i,c)=>a[c]-a[i]).slice(un))delete a[s];return{...o,vistoEm:a}}function hn(o,e){return o.map(r=>e.vistoEm[r.id]!==void 0?{...r,vistoEm:e.vistoEm[r.id]}:r)}function Uo(o){if(o===null)return"";if(o<1)return"hoje";if(o===1)return"1 dia";if(o<60)return`${o} dias`;let e=Math.floor(o/30);return e<24?`${e} meses`:`${Math.floor(o/365)} anos`}var bn="Contado desde a primeira vez que o SEI Pro viu o processo nesta unidade (o SEI n\xE3o informa a data de chegada).";var Bo=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao","caixa","parado","sinais"],zo={processo:"Processo",tipo:"Tipo",especificacao:"Especifica\xE7\xE3o",responsavel:"Respons\xE1vel",marcadores:"Marcadores",prazo:"Prazo",anotacao:"Anota\xE7\xE3o",caixa:"Na caixa",parado:"Parado h\xE1",sinais:"Sinais"};var ac=30,nc=40,sc=()=>({colunas:"marcador",limite:0,raiasPorResponsavel:!1}),ic=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao"],qr=2;function Qo(){return{id:"",nome:"Padr\xE3o",busca:"",ordem:[],agrupar:"nenhum",modo:"tabela",colv:qr,colunas:[...ic],densidade:"confortavel",quadro:sc()}}var cc=["nenhum","responsavel","tipo","marcador","prazo","situacao","grupo","anotacao","acompanhamento","retorno","caixa","autuacao","recebimento","envio","unidadeEnvio"],lc=["protocolo","tipo","responsavel","marcador","prazo","caixa","parado","novo"],dc=["marcador","responsavel","prazo","tipo"];function qe(o){let e=Qo();if(!o||typeof o!="object")return e;let r=o,t=Array.isArray(r.ordem)?r.ordem.filter(l=>!!l&&typeof l=="object"&&lc.includes(l.campo)).slice(0,4).map(l=>({campo:l.campo,decrescente:l.decrescente===!0})):[],a=Array.isArray(r.colunas)?[...new Set(r.colunas.filter(l=>Bo.includes(l)))]:[];if(a.includes("processo")&&r.colv!==qr&&!a.includes("especificacao")){let l=a.indexOf("processo");a=[...a.slice(0,l+1),"especificacao",...a.slice(l+1)]}let n=r.quadro&&typeof r.quadro=="object"?r.quadro:{},s=Array.isArray(n.ordemColunas)?[...new Set(n.ordemColunas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,i=Array.isArray(n.colunasRecolhidas)?[...new Set(n.colunasRecolhidas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,c=typeof n.larguraColuna=="number"&&Number.isFinite(n.larguraColuna)?Math.max(200,Math.min(500,Math.round(n.larguraColuna))):void 0;return{id:typeof r.id=="string"?r.id:"",colv:qr,nome:typeof r.nome=="string"&&r.nome.trim()?r.nome.trim().slice(0,nc):e.nome,busca:typeof r.busca=="string"?r.busca.slice(0,500):"",ordem:t,agrupar:cc.includes(r.agrupar)?r.agrupar:"nenhum",modo:r.modo==="quadro"?"quadro":"tabela",colunas:a.length?a:e.colunas,densidade:r.densidade==="compacta"?"compacta":"confortavel",quadro:{colunas:dc.includes(n.colunas)?n.colunas:"marcador",limite:typeof n.limite=="number"&&n.limite>0?Math.min(99,Math.floor(n.limite)):0,raiasPorResponsavel:n.raiasPorResponsavel===!0,...s?.length?{ordemColunas:s}:{},...i?.length?{colunasRecolhidas:i}:{},...c!==void 0?{larguraColuna:c}:{}}}}function vn(o,e,r){let t=qe(e),a=t.id?o.findIndex(s=>s.id===t.id):-1;if(a>=0){let s=[...o];return s[a]=t,{lista:s,visao:t}}if(o.length>=ac)return null;let n={...t,id:r()};return{lista:[...o,n],visao:n}}var xn=(o,e)=>o.filter(r=>r.id!==e);function An(o,e){let r=t=>JSON.stringify({...t,id:"",nome:""});return r(o)!==r(e)}var Ve="spro_grade_v_ids",He=o=>`spro_grade_v:${o}`,pc=o=>`spro_grade:${o||"x"}`,uc=(o,e)=>`spro_grade_and:${o||"x"}:${e||"x"}`,yn=5e3;function mc(){return{visao:Qo(),idade:zr(),recolhidos:[]}}function fc(o){if(!o||typeof o!="object")return mc();let e=o;return{visao:qe(e.visao),idade:fn(e.idade),recolhidos:Array.isArray(e.recolhidos)?e.recolhidos.filter(r=>typeof r=="string").slice(0,200):[]}}var gc=/^\d{4}-\d{2}-\d{2}$/;function hc(o){if(!o||typeof o!="object")return null;let e=o;if(typeof e.consultadoEm!="number"||!Number.isFinite(e.consultadoEm))return null;let r={consultadoEm:e.consultadoEm};for(let t of["autuacao","recebimento","envio"])typeof e[t]=="string"&&gc.test(e[t])&&(r[t]=e[t]);return typeof e.unidadeEnvio=="string"&&e.unidadeEnvio&&(r.unidadeEnvio=e.unidadeEnvio.slice(0,120)),r}function En(o,e,r=""){let{local:t,sync:a}=o,n=pc(e),s=uc(e,r);async function i(){return fc((await t.obter(n))[n])}async function c(A){let y=await i();await t.gravar({[n]:{...y,...A}})}async function l(){let A=(await a.obter(Ve))[Ve],y=Array.isArray(A)?A.filter(E=>typeof E=="string"):[];if(!y.length)return[];let M=await a.obter(y.map(He));return y.flatMap(E=>{let v=M[He(E)];return v?[{...qe(v),id:E}]:[]})}async function p(A,y=[]){let M=new Set(A.map(P=>P.id)),E={[Ve]:A.map(P=>P.id)};for(let P of A)E[He(P.id)]=P;await a.gravar(E);let v=y.filter(P=>!M.has(P.id)).map(P=>He(P.id));v.length&&await a.remover(v)}async function g(A){let y=(await t.obter(s))[s],M=y&&typeof y=="object"?y.itens:void 0,E={};if(!M||typeof M!="object")return E;for(let[v,P]of Object.entries(M)){let x=hc(P);x&&ne(x,A)&&(E[v]=x)}return E}async function m(A){let y=Object.keys(A),M=y.length>yn?Object.fromEntries(y.sort((E,v)=>A[v].consultadoEm-A[E].consultadoEm).slice(0,yn).map(E=>[E,A[E]])):A;await t.gravar({[s]:{itens:M}})}return{lerAndamentos:g,gravarAndamentos:m,lerEstado:i,gravarVisao:A=>c({visao:A}),gravarIdade:A=>c({idade:A}),gravarRecolhidos:A=>c({recolhidos:A}),lerVisoes:l,gravarVisoes:p,aoMudarVisoes:A=>a.aoMudar(y=>Ve in y||Object.keys(y).some(M=>M.startsWith("spro_grade_v:"))?A():void 0)}}function Sn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var wn=new Set;var bc=null;function vc(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Pn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Mn(o,e,r){let t=o.ownerDocument,a=t.defaultView;vc(o).append(e);let n=!0,s=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let A=a?.innerHeight??0,y=a?.innerWidth??0,M=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,y-16)),E=r.alinharDireita?m.right-M:m.left,v=Math.max(8,Math.min(E,y-M-8)),P=r.alturaMaxima??360;e.style.maxHeight="none";let x=Math.min(e.scrollHeight||P,P),w=A-m.bottom-8,I=m.top-8,L=bc?.()??!1,N=!L&&w<Math.min(x,200)&&I>w;e.style.left=`${v}px`,e.style.width=`${M}px`,e.style.maxHeight=`${L?P:Math.max(140,Math.min(P,N?I:w>140?w:P))}px`,e.classList.toggle("spro-flutuante-cima",N),N?(e.style.top="",e.style.bottom=`${A-m.top+4}px`):(e.style.bottom="",e.style.top=`${m.bottom+4}px`),Pn(a,N?0:Math.ceil(m.bottom+4+x+12))},i=m=>{let A=m.composedPath?.()??[],y=m.target,M=E=>A.includes(E)||!!y&&!!E.contains?.(y);M(e)||M(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},l=m=>{m.target instanceof Node&&e.contains(m.target)||c()},p=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",p);let g={ancora:o,fechar:()=>r.aoFechar()};return wn.add(g),s(),{posicionar:s,fechar(){n&&(n=!1,wn.delete(g),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",p),e.remove(),Pn(a,0))}}}function Dn(o,e){let r=Q(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=Q(n.rotulo),c=`${i} ${Q(n.descricao??"")}`;if(!t.every(p=>c.includes(p)))return;let l=i.startsWith(r)?0:i.split(" ").some(p=>p.startsWith(t[0]))?1:2;a.push({o:n,nota:l,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function xc(o,e){let r=o.normalize("NFC"),t=Q(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((l,p)=>{let g=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let m of g)n+=m,s.push(p)});let i=new Array(a.length).fill(!1);for(let l of t){let p=n.indexOf(l);if(!(p<0))for(let g=p;g<p+l.length;g++)i[s[g]]=!0}let c=[];return a.forEach((l,p)=>{let g=c[c.length-1];g&&g.marcado===i[p]?g.texto+=l:c.push({texto:l,marcado:i[p]})}),c}var Ac=0;function Co(o){let e=`spro-combo-${++Ac}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=S=>r().find(k=>k.valor===S)??t.get(S),n=[...o.valor??[]],s=null,i="",c=0,l=[],p=null,g=o.vazio??"Escolher\u2026",m=d("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),A=()=>o.aoMudar?.([...n]);function y(){let S=[];o.icone&&S.push(_(o.icone,15));let k=n.map(F=>a(F)).filter(F=>!!F),$=d("span",{class:"spro-combo-texto"});if(!k.length)$.classList.add("spro-combo-vazio"),$.append(g);else{let F=k[0];F.cor&&$.append(d("span",{class:"spro-combo-cor",style:`background:${F.cor}`})),$.append(d("span",{class:"spro-combo-rotulo"},F.rotulo)),k.length>1&&$.append(d("span",{class:"spro-combo-mais"},`+${k.length-1}`))}S.push($,_("chevron",14)),m.classList.toggle("spro-combo-ativo",o.multiplo===!0&&k.length>0),m.replaceChildren(...S)}let M=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function E(S){if(o.multiplo){n=n.includes(S.valor)?n.filter($=>$!==S.valor):[...n,S.valor],A(),y(),w();return}let k=n.length!==1||n[0]!==S.valor;n=[S.valor],y(),T(!0),k&&A()}async function v(){if(!o.criar)return;let S=i.trim();if(!S)return;let k=await o.criar(S);if(k){if(t.set(k.valor,k),i="",s){let $=s.querySelector(".spro-combo-busca");$&&($.value="")}o.multiplo&&n.includes(k.valor)?w():E(k)}}function P(S,k){let $=n.includes(S.valor),F=d("span",{class:"spro-combo-op-rotulo"});for(let z of xc(S.rotulo,i))F.append(z.marcado?d("mark",{},z.texto):z.texto);let H=d("li",{role:"option",id:`${e}-op-${k}`,class:`spro-combo-op${k===c?" spro-combo-op-ativa":""}`,"data-valor":S.valor,"aria-selected":$?"true":"false"},o.multiplo?d("span",{class:"spro-combo-caixa","aria-hidden":"true"},$?_("check",12):null):null,S.cor?d("span",{class:"spro-combo-cor",style:`background:${S.cor}`}):null,S.icone?_(S.icone,15):null,d("span",{class:"spro-combo-op-textos"},F,S.descricao?d("span",{class:"spro-combo-op-desc"},S.descricao):null),S.contagem!==void 0?d("span",{class:"spro-combo-conta"},String(S.contagem)):null,!o.multiplo&&$?d("span",{class:"spro-combo-marca"},_("check",14)):null);return H.addEventListener("pointerdown",z=>z.preventDefault()),H.addEventListener("click",()=>{c=k,E(S)}),H.addEventListener("pointermove",()=>{c!==k&&(c=k,x())}),H}function x(){if(!s)return;let S=[...s.querySelectorAll('[role="option"]')];S.forEach((H,z)=>{H.classList.toggle("spro-combo-op-ativa",z===c)});let k=S[c],F=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');k?(F?.setAttribute("aria-activedescendant",k.id),k.scrollIntoView?.({block:"nearest"})):F?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;l=Dn(r(),i),c>=l.length&&(c=Math.max(0,l.length-1)),s.querySelector('[role="listbox"]').replaceChildren(...l.map(P));let k=s.querySelector(".spro-combo-extras");k.replaceChildren();let $=i.trim();l.length||k.append(d("p",{class:"spro-combo-nada"},$?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let F=r().some(z=>Q(z.rotulo)===Q($));if(o.criar&&$&&!F){let z=d("button",{type:"button",class:"spro-combo-criar"},_("mais",14),d("span",{},o.rotuloCriar?o.rotuloCriar($):`Criar \u201C${$}\u201D`));z.addEventListener("pointerdown",X=>X.preventDefault()),z.addEventListener("click",()=>void v()),k.append(z)}let H=s.querySelector(".spro-combo-rodape");if(H){let z=l.filter(mo=>!n.includes(mo.valor)),X=d("button",{type:"button",class:"spro-combo-acao",disabled:!$||!z.length},`Marcar os filtrados${$&&z.length?` (${z.length})`:""}`);X.addEventListener("click",()=>{n=[...n,...z.map(mo=>mo.valor)],A(),y(),w()});let qo=d("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");qo.addEventListener("click",()=>{n=[],A(),y(),w()}),H.replaceChildren(d("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),X,qo)}x()}let I=()=>p?.posicionar();function L(S){let k=l.length,$=S.target,F=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled)")]:[],H=!!$?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(S.key==="Tab"){let X=F.indexOf($);if(!S.shiftKey&&X<F.length-1)F[X+1]?.focus();else if(S.shiftKey&&X>=0)X>0?F[X-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{T(!0);return}S.preventDefault(),S.stopPropagation();return}if(H&&S.key!=="Escape")return;let z=!s?.querySelector(".spro-combo-busca");if(z&&S.key===" "){let X=l[c];X&&E(X),S.preventDefault(),S.stopPropagation();return}if(z&&S.key.length===1&&!S.ctrlKey&&!S.metaKey&&!S.altKey){let X=Q(S.key),mo=[...l.keys()].map(Mo=>(c+1+Mo)%Math.max(1,k)).find(Mo=>Q(l[Mo]?.rotulo??"").startsWith(X));mo!==void 0&&(c=mo,x()),S.preventDefault(),S.stopPropagation();return}switch(S.key){case"ArrowDown":c=k?(c+1)%k:0,x();break;case"ArrowUp":c=k?(c-1+k)%k:0,x();break;case"Home":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,x();break;case"End":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,k-1),x();break;case"Enter":{let X=l[c];X?E(X):v();break}case"Escape":T(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),A(),y(),w();break;default:return}S.preventDefault(),S.stopPropagation()}function N(S=""){if(s)return;i=S,c=S?0:(()=>{let H=Dn(r(),i).findIndex(z=>z.valor===n[n.length-1]);return H<0?0:H})();let $=M()?d("input",{type:"text",class:"spro-combo-busca",placeholder:o.criar?"Buscar ou criar\u2026":"Buscar\u2026","aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:S}):null;if($&&($.value=S,$.addEventListener("input",()=>{i=$.value,c=0,w(),I()})),s=d("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},$?d("div",{class:"spro-combo-cabeca"},_("busca",15),$):null,d("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:$?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),d("div",{class:"spro-combo-extras"}),o.multiplo?d("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",L),p=Mn(m,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>T(!1)}),m.setAttribute("aria-expanded","true"),m.setAttribute("aria-controls",`${e}-lista`),m.classList.add("spro-combo-aberto"),w(),I(),!s)return;($??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),$&&S&&$.setSelectionRange?.(S.length,S.length)}function T(S=!1){s&&(p?.fechar(),p=null,s=null,i="",m.setAttribute("aria-expanded","false"),m.removeAttribute("aria-controls"),m.classList.remove("spro-combo-aberto"),S&&m.focus?.({preventScroll:!0}))}return m.addEventListener("click",()=>s?T(!0):N()),m.addEventListener("keydown",S=>{s||(S.key==="ArrowDown"||S.key==="ArrowUp"?(S.preventDefault(),N()):S.key.length===1&&S.key!==" "&&!S.ctrlKey&&!S.metaKey&&!S.altKey&&M()&&(S.preventDefault(),N(S.key)))}),y(),{el:m,valor:()=>[...n],definir(S,k=!1){n=[...S],y(),w(),k&&A()},atualizar(){y(),w()},definirVazio(S){g=S,y()},abrir:N,fechar:()=>T(!1)}}var Cn="#tblProcessosRecebidos input[type=checkbox], #tblProcessosGerados input[type=checkbox], #tblProcessosDetalhado input[type=checkbox]",Vr=o=>o.getAttribute("value")??o.closest("tr")?.id.replace(/^P/,"")??"";function Hr(o){let e=new Set;for(let r of o.querySelectorAll(Cn))r.checked&&Vr(r)&&e.add(Vr(r));return e}function On(o,e){let r=new Set(e);for(let t of o.querySelectorAll(Cn)){let a=Vr(t);a&&(r.delete(a),!t.disabled&&!!t.checked!==e.has(a)&&t.click())}return[...r]}function yc(o){let e=o.composedPath?.()??[];if(e.length)return e.some(r=>r.id==="spro-grade");for(let r=o.target;r;r=r.parentNode)if(r.id==="spro-grade")return!0;return!1}function kn(o,e){let r=!1,t=a=>{a&&yc(a)||r||(r=!0,queueMicrotask(()=>{r=!1,e(Hr(o))}))};return o.addEventListener("click",t,!0),o.addEventListener("change",t,!0),()=>{o.removeEventListener("click",t,!0),o.removeEventListener("change",t,!0)}}function Ec(o){return/acaoControleProcessos\(\s*['"][^'"]*['"]\s*,\s*true/.test(o.elemento.getAttribute("onclick")??"")}function Ln(o,e){return Ec(o)&&e===0?{ok:!1,motivo:"Marque ao menos um processo."}:(o.elemento.click(),{ok:!0})}var Sc=o=>o instanceof Error?o.message:String(o);function In(o){if(o.tipo==="atribuicao")return{...o,para:o.de,de:o.para};let e={tipo:"marcador",id:o.id,protocolo:o.protocolo};return o.adicionar&&(e.remover=o.adicionar),o.remover&&(e.adicionar=o.remover,o.texto&&(e.texto=o.texto)),e}async function wc(o,e){try{if(o.tipo==="atribuicao")return await e.atribuir(o.protocolo,o.para),{ok:!0,desfazer:In(o)};if(o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,...o.texto?{texto:o.texto}:{}}),o.remover)try{await e.marcador(o.protocolo,{marcador:o.remover,remover:!0})}catch(r){throw o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,remover:!0}).catch(()=>{}),r}return{ok:!0,desfazer:In(o)}}catch(r){return{ok:!1,erro:Sc(r)}}}function $n(o){let e=Promise.resolve();return{mover(r){let t=e.then(()=>wc(r,o));return e=t.catch(()=>{}),t}}}var je=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,Nn=Number.MAX_SAFE_INTEGER;function jr(o,e){let r=[e];return o.hora&&o.vencimento&&(r[0]=e.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&r.push(o.texto),o.sigla&&r.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),r.join(`
`)}function Rn(o,e){let r=o.vencimento;if(o.concluidoEm&&r)return{situacao:"concluido",texto:`conclu\xEDdo em ${lo(o.concluidoEm).slice(0,5)}`,dica:jr(o,`Prazo de ${lo(r)} conclu\xEDdo em ${lo(o.concluidoEm)}.`),ordem:Nn,sorter:`${r} 23:59:59`};if(r){let s=$o(e,r),i=`${r} ${o.hora??"23:59"}:00`,c=jr(o,`Vence em ${lo(r)}.`);return s===0?{situacao:"hoje",texto:"vence hoje",dica:c,ordem:0,sorter:i}:s<0?{situacao:"atrasado",texto:`${je(-s)} de atraso`,dica:c,ordem:s,sorter:i}:{situacao:"noPrazo",texto:`vence em ${je(s)}`,dica:c,ordem:s,sorter:i}}let t=o.inicio??e,a=$o(t,e);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${je(a)}`:`em ${je(-a)}`,dica:jr(o,`Contando desde ${lo(t)}.`),ordem:Nn-1,sorter:`${t} ${o.hora??"23:59"}:00`}}function co(o,e){return o.prazo?Rn(o.prazo,e.hoje):null}function bo(o,e){return o.vistoEm===void 0?null:Math.max(0,Math.floor((e.agora-o.vistoEm)/864e5))}function Oo(o,e){return o.ultimaMov?Math.max(0,$o(o.ultimaMov,e.hoje)):null}function Tn(o,e){return e.visitaAnterior!==void 0&&o.vistoEm!==void 0&&o.vistoEm>e.visitaAnterior}function ce(o,e){let r=co(o,e);return!r||r.situacao==="concluido"||r.situacao==="desde"?null:r.ordem}var Pc={resp:"resp",responsavel:"resp",atribuido:"resp",atribuicao:"resp",tipo:"tipo",marcador:"marcador",marcadores:"marcador",marc:"marcador",espec:"espec",especificacao:"espec",anot:"anot",anotacao:"anot",nota:"anot",prazo:"prazo",caixa:"caixa",idade:"caixa",novo:"novo",sigilo:"sigilo",sigiloso:"sigilo",grupo:"grupo",retorno:"retorno",protocolo:"protocolo",proc:"protocolo",processo:"protocolo",parado:"parado",mov:"parado",prio:"prio",prioridade:"prio",interessado:"interessado",interessados:"interessado"};function Ur(o){let e=[],r="",t=!1;for(let a of o)a==='"'?(t=!t,r+=a):/\s/.test(a)&&!t?(r&&e.push(r),r=""):r+=a;return r&&e.push(r),e}var Mc=o=>o.replace(/^"|"$/g,"");function Br(o){let e=[],r=[];for(let t of Ur(o)){let a=t,n=!1;a.startsWith("-")&&a.length>1&&(n=!0,a=a.slice(1));let s,i=/^([a-zA-Z\u00C0-\u017F]+):(.*)$/.exec(a);if(i){let g=Pc[Q(i[1])];g&&(s=g,a=i[2])}let c="=";s&&/^[<>]/.test(a)&&(c=a[0],a=a.slice(1));let l=Q(Mc(a));if(!l&&!s)continue;let p={...s?{campo:s}:{},valor:l,original:t,negado:n,comparador:c};e.push(p),r.push({texto:t,termo:p})}return{termos:e,tokens:r}}var Dc=o=>Q([o.protocolo,o.protocolo.replace(/\D/g,""),o.tipo,o.especificacao,o.atribuicao?.sigla,o.atribuicao?.nome,...o.marcadores.flatMap(e=>[e.nome,e.texto]),o.anotacao?.texto,o.prazo?.texto,o.prioridade,o.interessados,o.observacao].filter(Boolean).join(" ")),vo=(o,e)=>Q(o??"").includes(e),zn=/^(s|sim|1|true|yes)$/;function Fr(o){let e=/^(\d+)\s*(d|dia|dias)?$/.exec(o);return e?Number(e[1]):null}function Gr(o,e,r){return o===null?!1:e==="<"?o<r:e===">"?o>r:o===r}function Cc(o,e,r){let t=co(o,r),a=e.valor;if(a==="sem"||a==="nenhum"||a==="nao")return!o.prazo;if(a==="com"||a==="sim")return!!o.prazo;if(!t)return!1;if(a==="atrasado"||a==="atrasados"||a==="vencido")return t.situacao==="atrasado";if(a==="hoje")return t.situacao==="hoje";if(a==="concluido"||a==="concluidos")return t.situacao==="concluido";if(a==="semana"){let s=ce(o,r);return s!==null&&s>=0&&s<=7}let n=Fr(a);return n!==null?Gr(ce(o,r),e.comparador==="="?"<":e.comparador,n):vo(o.prazo?.texto,a)}function Oc(o,e,r){let t=e.valor;switch(e.campo){case"resp":return t==="sem"||t==="ninguem"?!o.atribuicao:t==="eu"?!!r.eu&&Q(o.atribuicao?.sigla??"")===Q(r.eu):vo(o.atribuicao?.sigla,t)||vo(o.atribuicao?.nome,t);case"tipo":return vo(o.tipo,t);case"marcador":return t==="sem"||t==="nenhum"?o.marcadores.length===0:t==="com"?o.marcadores.length>0:o.marcadores.some(a=>vo(a.nome,t)||vo(a.texto,t));case"espec":return vo(o.especificacao,t);case"anot":return t==="sem"||t==="nao"?!o.anotacao:t==="com"||t==="sim"?!!o.anotacao:t==="prioridade"||t==="prioritaria"?!!o.anotacao?.prioridade:vo(o.anotacao?.texto,t);case"prazo":return Cc(o,e,r);case"caixa":{let a=Fr(t);return a===null?!1:Gr(bo(o,r),e.comparador==="="?">":e.comparador,a)}case"novo":return t==="visita"?Tn(o,r):zn.test(t)?o.naoVisualizado:t==="nao"?!o.naoVisualizado:!1;case"sigilo":return zn.test(t)?o.sigiloso:!o.sigiloso;case"grupo":return t.startsWith("rec")?o.grupo==="recebidos":t.startsWith("ger")?o.grupo==="gerados":!1;case"retorno":return t==="sem"||t==="nao"?o.retornos.length===0:t==="atrasado"?o.retornos.some(a=>a.atrasado):t==="aguardando"?o.retornos.some(a=>a.tipo==="aguardando"):t==="programado"?o.retornos.some(a=>a.tipo==="programado"):o.retornos.length>0;case"parado":{let a=Fr(t);return a===null?!1:Gr(Oo(o,r),e.comparador==="="?">":e.comparador,a)}case"prio":return vo(o.prioridade,t);case"interessado":return vo(o.interessados,t);case"protocolo":return Q(o.protocolo).includes(t)||o.protocolo.replace(/\D/g,"").includes(t.replace(/\D/g,"")||"\0");default:return!0}}function kc(o,e,r){if(!o.termos.length)return!0;let t;for(let a of o.termos){let n;if(a.campo?n=Oc(e,a,r):(t??=Dc(e),n=t.includes(a.valor)),a.negado?n:!n)return!1}return!0}var _n=(o,e,r)=>{let t=Br(e);return t.termos.length?o.filter(a=>kc(t,a,r)):o};function Fe(o,e){return Ur(o).filter(r=>r!==e).join(" ")}function qn(o,e,r){let t=/\s/.test(r)?`"${r}"`:r,a=`${e}:${t}`,n=Ur(o);return n.includes(a)?o:[...n,a].join(" ")}var Lc=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Ic(o,e=[]){return[...o.values()].sort((r,t)=>{let a=e.indexOf(r.chave),n=e.indexOf(t.chave);return a>=0||n>=0?(a<0?-1:a)-(n<0?-1:n):Lc.compare(r.rotulo,t.rotulo)})}function J(o,e,r,t){let a=o.get(e);return a||(a={chave:e,rotulo:r,itens:[],...t?{tom:t}:{}},o.set(e,a)),a}var Xo=[["atrasado","Atrasados","perigo"],["hoje","Vencem hoje","aviso"],["semana","Pr\xF3ximos 7 dias","aviso"],["mes","Pr\xF3ximos 30 dias","neutro"],["depois","Depois de 30 dias","neutro"],["desde","Contando desde uma data","neutro"],["concluido","Prazo conclu\xEDdo","neutro"],["sem","Sem prazo","neutro"]];function le(o,e){let r=co(o,e);if(!r)return"sem";if(r.situacao==="concluido")return"concluido";if(r.situacao==="desde")return"desde";if(r.situacao==="atrasado")return"atrasado";if(r.situacao==="hoje")return"hoje";let t=ce(o,e)??0;return t<=7?"semana":t<=30?"mes":"depois"}var Vn=[["recente","Chegaram hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["antigo","H\xE1 mais de 30 dias"],["desconhecido","Sem registro"]];function $c(o,e){let r=bo(o,e);return r===null?"desconhecido":r<1?"recente":r<=7?"semana":r<=30?"mes":"antigo"}function ko(o,e){return e.map(r=>o.get(r[0])).filter(r=>!!r)}function Qr(o){if(!o.marcadores.length)return;if(o.marcadores.length===1)return o.marcadores[0];let e=o.marcadores[o.marcadores.length-1],r=e.dataHora!==void 0;for(let t=0;t<o.marcadores.length;t++){let a=o.marcadores[t];a.dataHora!==void 0&&(!r||a.dataHora>e.dataHora)&&(e=a,r=!0)}return e}function Ge(o,e,r){if(e==="nenhum")return[{chave:"todos",rotulo:"Todos",itens:o}];let t=new Map;for(let a of o)switch(e){case"responsavel":a.atribuicao?J(t,`u:${a.atribuicao.sigla}`,a.atribuicao.nome===a.atribuicao.sigla?a.atribuicao.sigla:`${a.atribuicao.nome} (${a.atribuicao.sigla})`).itens.push(a):J(t,"sem","Sem respons\xE1vel").itens.push(a);break;case"tipo":J(t,`t:${a.tipo||"-"}`,a.tipo||"Sem tipo").itens.push(a);break;case"marcador":{let n=Qr(a);n?J(t,`m:${n.nome}`,n.nome).itens.push(a):J(t,"sem","Sem marcador").itens.push(a);break}case"prazo":{let n=le(a,r),s=Xo.find(i=>i[0]===n);J(t,n,s[1],s[2]).itens.push(a);break}case"situacao":a.naoVisualizado?J(t,"novo","N\xE3o visualizados","aviso").itens.push(a):J(t,"lido","Visualizados").itens.push(a);break;case"grupo":J(t,a.grupo,a.grupo==="recebidos"?"Recebidos":"Gerados").itens.push(a);break;case"anotacao":a.anotacao?.prioridade?J(t,"prio","Anota\xE7\xE3o com prioridade","aviso").itens.push(a):a.anotacao?J(t,"com","Com anota\xE7\xE3o").itens.push(a):J(t,"sem","Sem anota\xE7\xE3o").itens.push(a);break;case"acompanhamento":a.acompanhamentoEspecial?J(t,"com","Em acompanhamento especial").itens.push(a):J(t,"sem","Fora do acompanhamento especial").itens.push(a);break;case"retorno":a.retornos.some(n=>n.atrasado)?J(t,"atrasado","Retorno atrasado","perigo").itens.push(a):a.retornos.some(n=>n.tipo==="aguardando")?J(t,"aguardando","Aguardando retorno").itens.push(a):a.retornos.length?J(t,"programado","Retorno programado").itens.push(a):J(t,"sem","Sem retorno").itens.push(a);break;case"caixa":{let n=$c(a,r);J(t,n,Vn.find(s=>s[0]===n)[1]).itens.push(a);break}case"autuacao":case"recebimento":case"envio":{let n=ka(r.andamentos?.[a.id]?.[e],r.hoje);J(t,n,wr.find(s=>s[0]===n)[1]).itens.push(a);break}case"unidadeEnvio":{let n=r.andamentos?.[a.id]?.unidadeEnvio;n?J(t,`u:${n}`,n).itens.push(a):J(t,"sem","Sem informa\xE7\xE3o").itens.push(a);break}}return e==="prazo"?ko(t,Xo):e==="caixa"?ko(t,Vn):e==="autuacao"||e==="recebimento"||e==="envio"?ko(t,wr):e==="situacao"?ko(t,[["novo",""],["lido",""]]):e==="grupo"?ko(t,[["recebidos",""],["gerados",""]]):e==="anotacao"?ko(t,[["prio",""],["com",""],["sem",""]]):e==="acompanhamento"?ko(t,[["com",""],["sem",""]]):e==="retorno"?ko(t,[["atrasado",""],["aguardando",""],["programado",""],["sem",""]]):Ic(t,["sem"])}var Xr={nenhum:"Sem agrupamento",responsavel:"Respons\xE1vel",tipo:"Tipo de processo",marcador:"Marcador",prazo:"Prazo",situacao:"Visualiza\xE7\xE3o",grupo:"Recebidos e gerados",anotacao:"Anota\xE7\xE3o",acompanhamento:"Acompanhamento especial",retorno:"Retorno programado",caixa:"Tempo na caixa",autuacao:"Data de autua\xE7\xE3o",recebimento:"Data de recebimento",envio:"Data de envio",unidadeEnvio:"Unidade de envio"};var Nc=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Ue(o,e){let r=new Map;for(let t of o)for(let a of e(t)){let n=r.get(a.valor)??{valor:a.valor,rotulo:a.rotulo,n:0};n.n+=1,r.set(a.valor,n)}return[...r.values()].sort((t,a)=>a.n-t.n||Nc.compare(t.rotulo,a.rotulo))}function Kr(o,e){let r=Ue(o,t=>{let a=le(t,e),n=Xo.find(i=>i[0]===a)[1],s=a==="atrasado"?"atrasado":a==="hoje"?"hoje":a==="semana"?"semana":a==="sem"?"sem":a==="concluido"?"concluido":"";return s?[{valor:s,rotulo:n}]:[]});return{responsaveis:Ue(o,t=>t.atribuicao?[{valor:t.atribuicao.sigla,rotulo:`${t.atribuicao.nome} (${t.atribuicao.sigla})`}]:[{valor:"sem",rotulo:"Sem respons\xE1vel"}]),tipos:Ue(o,t=>t.tipo?[{valor:t.tipo,rotulo:t.tipo}]:[]),marcadores:Ue(o,t=>t.marcadores.length?t.marcadores.map(a=>({valor:a.nome,rotulo:a.nome})):[{valor:"sem",rotulo:"Sem marcador"}]),prazos:r}}function Jr(o){let e=[];o.sigiloso&&e.push("Sigiloso"),o.naoVisualizado&&e.push("N\xE3o visualizado"),o.documentoNovo&&e.push("Documento novo"),o.urgente&&e.push("Urgente"),o.trancado&&e.push("Trancado"),o.acompanhamentoEspecial&&e.push(o.acompanhamentoGrupo?`Acompanhamento especial (${o.acompanhamentoGrupo})`:"Acompanhamento especial");for(let r of o.retornos)e.push(`${r.tipo==="aguardando"?"Aguardando retorno":"Retorno programado"}${r.atrasado?" (atrasado)":""}`);return e}function Wr(o,e){let r=co(o,e);if(!o.prazo||!r)return"";let t=o.prazo.vencimento??o.prazo.inicio;return`${t?lo(t):""}${o.prazo.hora?` ${o.prazo.hora}`:""} (${r.texto})`.trim()}var Rc=(o,e,r)=>{switch(e){case"processo":return o.protocolo;case"tipo":return o.tipo;case"especificacao":return o.especificacao;case"responsavel":return o.atribuicao?o.atribuicao.nome===o.atribuicao.sigla?o.atribuicao.sigla:`${o.atribuicao.nome} (${o.atribuicao.sigla})`:"";case"marcadores":return o.marcadores.map(t=>t.texto?`${t.nome}: ${t.texto}`:t.nome).join("; ");case"prazo":return Wr(o,r);case"anotacao":return o.anotacao?.texto.replace(/\s*\n\s*/g," / ")??"";case"caixa":return Uo(bo(o,r));case"parado":return Uo(Oo(o,r));case"sinais":return Jr(o).join("; ")}};function Hn(o,e,r){return[e.map(t=>zo[t]),...o.map(t=>e.map(a=>Rc(t,a,r)))]}var jn=o=>`processos-${o}.csv`;function Fn(o,e,r){let t=[];for(let a of o){let n=r&&e.has(a.chave);if(r&&t.push({tipo:"grupo",grupo:a,recolhido:n}),!n)for(let s of a.itens)t.push({tipo:"processo",processo:s,grupo:a.chave})}return t}var Zr=new Intl.Collator("pt-BR",{numeric:!0,sensitivity:"base"});function Gn(o){let e=/(\d+)\/(\d{4})-\d+\s*$/.exec(o);if(!e)return null;let r=/(\d+)\s*$/.exec(e[1].split(/[.-]/).pop()??"")?.[1]??e[1];return[Number(e[2]),Number(r)]}function Tc(o,e){let r=Gn(o),t=Gn(e);return r&&t&&(r[0]-t[0]||r[1]-t[1])||Zr.compare(o,e)}function Un(o,e,r){switch(e){case"tipo":return o.tipo||null;case"responsavel":return o.atribuicao?.sigla??null;case"marcador":return o.marcadores[0]?.nome??null;case"prazo":{let t=co(o,r);return t?t.ordem:null}case"caixa":return bo(o,r);case"parado":return Oo(o,r);case"novo":return o.naoVisualizado?0:1}}function zc(o,e){return(r,t)=>{for(let a of o){let n;if(a.campo==="protocolo")n=Tc(r.protocolo,t.protocolo),a.decrescente&&(n=-n);else{let s=Un(r,a.campo,e),i=Un(t,a.campo,e);if(s===null&&i===null)continue;if(s===null)return 1;if(i===null)return-1;n=typeof s=="number"&&typeof i=="number"?s-i:Zr.compare(String(s),String(i)),a.decrescente&&(n=-n)}if(n)return n}return 0}}function Bn(o,e,r){return e.length?[...o].sort(zc(e,r)):o}function Qn(o,e,r){let t=o.findIndex(s=>s.campo===e),a=t<0?{campo:e,decrescente:!1}:o[t].decrescente?null:{campo:e,decrescente:!0};if(!r)return a?[a]:[];if(t<0)return[...o,a];let n=[...o];return a?n[t]=a:n.splice(t,1),n}function Xn(o,e){let r=s=>s.trim().toLowerCase(),t=new Map;for(let s of e)s.nome.trim()&&!t.has(r(s.nome))&&t.set(r(s.nome),{nome:s.nome.trim(),texto:s.texto.trim().slice(0,250)});let a=new Map(o.map(s=>[r(s.nome),s])),n=[];for(let s of o)t.has(r(s.nome))||n.push({tipo:"remover",nome:s.nome});for(let[s,i]of t)a.has(s)||n.push({tipo:"adicionar",nome:i.nome,texto:i.texto});for(let[s,i]of t){let c=a.get(s);c&&c.texto.trim()!==i.texto&&n.push({tipo:"texto",nome:c.nome,texto:i.texto})}return n}function Kn(o,e,r=()=>""){let t=[...o.marcadores];for(let a of e)a.tipo==="remover"?t=t.filter(n=>n.nome!==a.nome):a.tipo==="adicionar"?t.push({nome:a.nome,cor:r(a.nome),texto:a.texto}):t=t.map(n=>n.nome===a.nome?{...n,texto:a.texto}:n);return{...o,marcadores:t}}function Be(o){return o.replace(/\r\n?/g,`
`).trim().slice(0,500)}function Qe(o,e,r,t=""){let a=Be(e);if(!a){let{anotacao:n,...s}=o;return s}return{...o,anotacao:{texto:a,autor:o.anotacao?.autor??t,prioridade:r}}}function Jn(o,e){if(!e){let{atribuicao:r,...t}=o;return t}return{...o,atribuicao:e}}function Xe(o,e,r,t,a){let n=new Set([o.id]);if(t)for(let s of e)n.add(s);return r.filter(s=>n.has(s.id)&&a(s))}function Yr(o,e){let r=new Set(e.marcadores.map(t=>t.nome.trim().toLowerCase()));return o.filter(t=>{let a=r.has(t.nome.trim().toLowerCase());return t.tipo==="adicionar"?!a:a})}var ot=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0}),uo="sem";function Wn(o,e,r,t={}){let a=new Map,n=(i,c,l,p,g)=>{let m=a.get(i);return m||(m={chave:i,titulo:c,itens:[],aceitaSoltar:l,excedeu:!1,...p?{motivoSomenteLeitura:p}:{},...g?{tom:g}:{}},a.set(i,m)),m};if(e.colunas==="marcador")for(let i of o){let c=Qr(i);c?n(`m:${c.nome}`,c.nome,!0).itens.push(i):n(uo,"Sem marcador",!0).itens.push(i)}else if(e.colunas==="responsavel"){n(uo,"Sem respons\xE1vel",!0);for(let i of t.responsaveis??[])n(`u:${i.sigla}`,`${i.nome} (${i.sigla})`,!0);for(let i of o)i.atribuicao?n(`u:${i.atribuicao.sigla}`,`${i.atribuicao.nome} (${i.atribuicao.sigla})`,!0).itens.push(i):n(uo,"Sem respons\xE1vel",!0).itens.push(i)}else if(e.colunas==="prazo"){for(let[i,c,l]of Xo)i!=="desde"&&n(i,c,!1,"O prazo \xE9 definido pelo bot\xE3o de prazo, n\xE3o arrastando.",l);for(let i of o){let c=le(i,r);n(c==="desde"?"sem":c,"",!1).itens.push(i)}}else for(let i of o)n(`t:${i.tipo}`,i.tipo||"Sem tipo",!1,"O tipo do processo n\xE3o muda arrastando.").itens.push(i);let s=[...a.values()];if(e.colunas==="prazo"&&(s=s.filter(i=>i.itens.length||i.titulo)),e.colunas==="marcador"?(s=s.filter(i=>i.itens.length>0),s.sort((i,c)=>{let l=c.itens.length-i.itens.length;return l!==0?l:i.chave===uo?1:c.chave===uo?-1:ot.compare(i.titulo,c.titulo)})):e.colunas==="responsavel"?s.sort((i,c)=>i.chave===uo?-1:c.chave===uo?1:ot.compare(i.titulo,c.titulo)):e.colunas==="tipo"&&s.sort((i,c)=>ot.compare(i.titulo,c.titulo)),e.ordemColunas?.length){let i=new Map(e.ordemColunas.map((c,l)=>[c,l]));s.sort((c,l)=>{let p=i.get(c.chave),g=i.get(l.chave);return p!==void 0&&g!==void 0?p-g:p!==void 0?-1:g!==void 0?1:0})}if(e.limite>0)for(let i of s)i.excedeu=i.itens.length>e.limite;return s}function Zn(o,e,r){if(e===r)return[...o];let t=o.indexOf(e),a=o.indexOf(r);if(t<0||a<0)return[...o];let n=[...o];return n.splice(t,1),n.splice(a,0,e),n}var Ke=o=>o.slice(o.indexOf(":")+1);function Yn(o,e,r,t){if(r===t)return{ok:!1,motivo:"Mesma coluna."};if(o==="marcador"){let a=r===uo?void 0:Ke(r),n=t===uo?void 0:Ke(t);if(a&&!e.marcadores.some(l=>l.nome===a))return{ok:!1,motivo:"O processo j\xE1 n\xE3o tem esse marcador."};let s=n?e.marcadores.some(l=>l.nome===n):!1,i=a?e.marcadores.find(l=>l.nome===a)?.texto:void 0,c={tipo:"marcador",id:e.id,protocolo:e.protocolo};return a&&(c.remover=a),n&&!s&&(c.adicionar=n,i&&(c.texto=i)),!c.remover&&!c.adicionar?{ok:!1,motivo:"Nada a mudar."}:{ok:!0,movimento:c}}return o==="responsavel"?{ok:!0,movimento:{tipo:"atribuicao",id:e.id,protocolo:e.protocolo,para:t===uo?null:Ke(t),de:r===uo?null:Ke(r)}}:{ok:!1,motivo:"Esta divis\xE3o do quadro \xE9 s\xF3 de leitura."}}function et(o,e,r={}){if(e.tipo==="atribuicao"){if(e.para===null){let{atribuicao:a,...n}=o;return n}return{...o,atribuicao:{sigla:e.para,nome:r[e.para]??e.para}}}let t=o.marcadores;return e.remover&&(t=t.filter(a=>a.nome!==e.remover)),e.adicionar&&(t=[...t,{nome:e.adicionar,cor:"",texto:e.texto??"",dataHora:Date.now()}]),{...o,marcadores:t}}function Ko(o,e){let r=o.ownerDocument??document;for(let n of Array.from(o.querySelectorAll("dialog.spro-dialogo-grade")))n.remove();let t=d("dialog",{class:`spro-dialogo spro-dialogo-grade${e.largo?" spro-dialogo-largo":""}`,"aria-label":e.titulo}),a=()=>{t.open?t.close():t.remove()};return t.append(d("header",{},e.icone?d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},_(e.icone,18)):null,d("h2",{},e.titulo,e.subtitulo?d("small",{class:"spro-dialogo-sub"},e.subtitulo):null),d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:a},_("fechar",16))),d("div",{class:"spro-dialogo-corpo"},e.conteudo)),t.addEventListener("close",()=>{t.remove(),e.aoFechar?.()}),o.append(t),typeof t.showModal=="function"?t.showModal():t.setAttribute("open",""),t.querySelector(".spro-combo, textarea, input:not([type=checkbox])")?.focus({preventScroll:!0}),{fechar:a,dlg:t}}var _c=["autuacao","recebimento","envio","unidadeEnvio"],pe=o=>_c.includes(o);function qc(o){let e=Math.floor(o/6e4);return e<1?"agora h\xE1 pouco":e<60?`h\xE1 ${e} min`:`h\xE1 ${Math.floor(e/60)} h`}var de=(o,e,r)=>`${o} ${o===1?e:r}`;function os(o){let e={},r=null,t=!1,a=!1,n,s=d("div",{class:"spro-andamento",hidden:!0,role:"status","aria-live":"polite"}),i=()=>o.processos().filter(x=>!!x.link&&!x.sigiloso&&!x.naoVisualizado),c=()=>Object.values(e).filter(x=>ne(x,o.agora())),l=()=>i().filter(x=>!e[x.id]||!ne(e[x.id],o.agora())),p=()=>{let x=o.processos();return{naoVistos:x.filter(w=>w.naoVisualizado&&!w.sigiloso).length,sigilosos:x.filter(w=>w.sigiloso).length,semLink:x.filter(w=>!w.link&&!w.sigiloso&&!w.naoVisualizado).length}};async function g(){try{e=await o.armazem.lerAndamentos(o.agora())}catch{e={}}o.aoMudar()}function m(x,w){return new Promise(I=>{let L=!1,N=p(),T=[];N.naoVistos&&T.push(`${de(N.naoVistos,"processo ainda n\xE3o visualizado","processos ainda n\xE3o visualizados")} nesta unidade (abrir o andamento o marcaria como visualizado ou recebido em seu nome)`),N.sigilosos&&T.push(`${de(N.sigilosos,"processo sigiloso","processos sigilosos")}`);let S=d("button",{type:"button",class:"spro-botao primario",onclick:()=>{L=!0,I(!0),$.fechar()}},_("busca",15),"Consultar andamento"),k=d("div",{class:"spro-confirma-andamento"},d("p",{},"Para agrupar por data ou por unidade de envio, o SEI Pro precisa ",d("strong",{},"abrir o andamento de cada processo, um por um")," no SEI. A consulta \xE9 s\xF3 de leitura, mas faz v\xE1rias requisi\xE7\xF5es por processo e pode levar alguns minutos."),d("p",{},d("strong",{},`Ser\xE3o consultados ${de(x,"processo","processos")}.`),w?` Outros ${w} j\xE1 est\xE3o guardados e ficam como est\xE3o.`:""),T.length?d("div",{},d("p",{},"Ficam de fora:"),d("ul",{},...T.map(F=>d("li",{},F)))):null,d("p",{class:"spro-suave"},"O resultado fica guardado neste navegador por 24 horas: ao recarregar a p\xE1gina, ele reaparece sem nova consulta. Voc\xEA pode cancelar a consulta a qualquer momento."),d("div",{class:"spro-dialogo-rodape"},S)),$=Ko(o.sombra,{titulo:"Consultar o andamento dos processos",icone:"alerta",conteudo:k,aoFechar:()=>I(L)})})}function A(){if(o.semDebounce)return o.aoMudar();n||(n=setTimeout(()=>{n=void 0,t||o.aoMudar()},400))}async function y(){try{await o.armazem.gravarAndamentos(e)}catch{}}async function M(x){if(r||!x.length||t)return;let w=new AbortController;r={ctl:w,progresso:{feitos:0,total:x.length,semDados:0}},P();let I=0,L=await La({alvos:x,sinal:w.signal,simultaneas:o.simultaneas,pausaMs:o.pausaMs,esperar:o.esperar,consultar:(N,T)=>o.consultar(N,T),aoResolver:(N,T,S,k)=>{r&&(r.progresso=S),k||(e[N.id]={...T??{},consultadoEm:o.agora()}),I+=1,I>=10&&(I=0,y()),P(),A()}});r=null,await y(),clearTimeout(n),n=void 0,!t&&(o.aoMudar(),L.motivo==="sessao"?o.aviso("A sess\xE3o do SEI expirou: a consulta parou. O que j\xE1 foi lido ficou guardado."):L.motivo==="erros"?o.aviso("O SEI parou de responder: a consulta foi interrompida. O que j\xE1 foi lido ficou guardado."):L.motivo==="concluida"&&o.aviso(`Andamento consultado: ${de(L.progresso.feitos-L.progresso.semDados,"processo","processos")} com dados${L.progresso.semDados?`, ${L.progresso.semDados} sem informa\xE7\xE3o`:""}.`))}async function E(x){if(r)return!0;let w=x==="todos"?i():l();if(!w.length)return o.aviso(x==="todos"?"Nenhum processo eleg\xEDvel para consultar.":"Todos os processos j\xE1 t\xEAm o andamento guardado."),!1;let I=x==="todos"?0:i().length-w.length;return await m(w.length,I)?(M(w),!0):!1}async function v(){return r||!l().length?!0:await E("novo")||c().length>0}function P(){if(s.hidden=!a||t,s.hidden)return;if(r){let{feitos:N,total:T}=r.progresso;s.replaceChildren(d("span",{},`Consultando o andamento dos processos\u2026 ${N} de ${T}`),d("progress",{max:String(T),value:String(N),"aria-label":"Progresso da consulta"}),d("button",{type:"button",class:"spro-link",onclick:()=>r?.ctl.abort()},"Cancelar"));return}let x=c();if(!x.length){s.replaceChildren(d("span",{},'O andamento dos processos ainda n\xE3o foi consultado, por isso todos aparecem em "Sem informa\xE7\xE3o".'),d("button",{type:"button",class:"spro-link",onclick:()=>void E("novo")},"Consultar agora"));return}let w=Math.min(...x.map(N=>N.consultadoEm)),I=w+Pr,L=l().length;s.replaceChildren(d("span",{},`Andamento consultado ${qc(o.agora()-w)} (guardado at\xE9 ${new Date(I).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})`,L?` \xB7 ${de(L,"processo ainda sem consulta","processos ainda sem consulta")}`:""),d("button",{type:"button",class:"spro-link",onclick:()=>void E("todos")},_("atualizar",13)," Atualizar"))}return{faixa:s,carregar:g,dados:()=>e,definirAtivo(x){a=x,P()},atualizarFaixa:P,aoEscolherAgrupamento:v,pedir:E,emAndamento:()=>!!r,fechar(){t=!0,r?.ctl.abort(),clearTimeout(n)}}}var rt="application/x-spro-cartao",Je="application/x-spro-coluna";function Vc(o,e){if(!o.anotacao?.texto?.trim())return null;let t=!o.sigiloso&&!!e.aoEditarAnotacao,n=Po(o.anotacao.texto).map((c,l)=>{if(c.marca===null)return d("div",{class:"spro-anot-linha"},c.texto||"\xA0");let p=d("button",{type:"button",role:"checkbox",class:`spro-anot-check${c.marca?" spro-anot-check-on":""}`,"aria-checked":String(c.marca),"aria-label":c.marca?`Desmarcar ${c.texto}`:`Marcar ${c.texto}`,title:c.marca?"Desmarcar tarefa":"Marcar tarefa como conclu\xEDda",draggable:"false",onmousedown:g=>g.stopPropagation(),onclick:g=>{g.preventDefault(),g.stopPropagation(),e.aoAlternarTarefa?.(o.id,l)}},c.marca?"\u2713":"");return d("div",{class:`spro-anot-linha spro-anot-tarefa${c.marca?" spro-anot-feita":""}`},p,d("span",{class:"spro-anot-txt"},c.texto))}),s=[o.anotacao?.autor?`\xDAltima edi\xE7\xE3o: ${o.anotacao.autor}`:"",t?"Clique para editar a anota\xE7\xE3o":""].filter(Boolean).join(`
`);return d("div",{class:`spro-cartao-anotacao${o.anotacao?.prioridade?" spro-cartao-anotacao-prio":""}${t?" spro-cartao-anotacao-editavel":""}`,title:s||void 0,...t?{onclick:c=>{c.stopPropagation(),e.aoEditarAnotacao?.(o.id)}}:{}},...n)}function Hc(o,e,r){let t=co(o,r.ctx),a=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${o.protocolo}`});a.checked=r.selecionados.has(o.id),a.addEventListener("change",()=>r.aoSelecionar(o.id,a.checked));let n=t?"Editar o prazo":"Definir um prazo",s=r.aoAbrirPrazo?d("button",{type:"button",class:"spro-prazo-b",title:t?`${t.dica}

${n}`:n,"aria-label":n,onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoAbrirPrazo?.(o.id)}},t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`},t.texto):d("span",{class:"spro-prazo-vazio"},"definir")):t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`,title:t.dica},t.texto):null,i=Vc(o,r),c=!i&&!o.sigiloso&&r.aoEditarAnotacao?d("button",{type:"button",class:"spro-anot-vazia",title:"Adicionar anota\xE7\xE3o","aria-label":"Adicionar anota\xE7\xE3o",onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoEditarAnotacao?.(o.id)}},"+ anota\xE7\xE3o"):null,l=d("div",{class:`spro-cartao${a.checked?" spro-sel":""}`,draggable:"true","data-id":o.id,"data-de":e},d("div",{class:"spro-cartao-topo"},a,d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",draggable:"false"},o.protocolo)),o.tipo?d("div",{class:"spro-cartao-tipo"},o.tipo):null,o.especificacao?d("div",{class:"spro-cartao-espec",title:o.especificacao},o.especificacao):null,i,d("div",{class:"spro-cartao-rodape"},d("div",{class:"spro-cartao-acoes"},s,c),o.atribuicao?d("span",{class:"spro-avatar",title:o.atribuicao.nome},o.atribuicao.sigla.slice(0,2).toUpperCase()):null));return l.addEventListener("dragstart",p=>{p.stopPropagation(),p.dataTransfer?.setData(rt,JSON.stringify({id:o.id,de:e})),p.dataTransfer?.setData("text/plain",o.protocolo),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"),l.classList.add("spro-arrastando")}),l.addEventListener("dragend",()=>l.classList.remove("spro-arrastando")),l}function jc(o,e,r){let t=r.cfg.colunasRecolhidas?.includes(o.chave)??!1,a=d("div",{class:"spro-col-corpo"},...o.itens.map(p=>Hc(p,o.chave,r)));o.itens.length||a.append(d("div",{class:"spro-col-vazia"},o.aceitaSoltar?"Solte aqui":"Vazia"));let n=r.cfg.limite,s=!!r.aoReordenarColuna,i=r.aoAlternarColuna?d("button",{type:"button",class:"spro-col-recolher","aria-expanded":String(!t),"aria-label":t?`Expandir coluna ${o.titulo}`:`Recolher coluna ${o.titulo}`,title:t?"Expandir coluna":"Recolher coluna",draggable:"false",onmousedown:p=>p.stopPropagation(),onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoAlternarColuna?.(o.chave)}},t?"+":"\u2212"):null,c=d("div",{class:`spro-col-topo${s?" spro-col-arrastavel":""}`,...s?{draggable:"true",title:"Arraste para reordenar a coluna"}:{}},s?d("span",{class:"spro-col-alca","aria-hidden":"true"},"\u22EE\u22EE"):null,d("span",{class:"spro-col-titulo",title:o.titulo},o.titulo),d("span",{class:`spro-col-n${o.excedeu?" spro-excedeu":""}`,title:o.excedeu?`Passou do limite de ${n}`:void 0},n>0?`${o.itens.length}/${n}`:String(o.itens.length)),i,o.aceitaSoltar?null:d("span",{class:"spro-col-trava",title:o.motivoSomenteLeitura},no("bloquear",13))),l=d("section",{class:`spro-col${o.tom?` spro-tom-${o.tom}`:""}${o.excedeu?" spro-col-cheia":""}${t?" spro-col-recolhida":""}`,"data-chave":o.chave},c,a);return s&&(c.addEventListener("dragstart",p=>{p.stopPropagation(),p.dataTransfer?.setData(Je,o.chave),p.dataTransfer?.setData("text/plain",o.titulo),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"),l.classList.add("spro-col-arrastando")}),c.addEventListener("dragend",()=>l.classList.remove("spro-col-arrastando"))),l.addEventListener("dragover",p=>{if(s&&p.dataTransfer?.types.includes(Je)){p.preventDefault(),l.classList.add("spro-col-alvo");return}p.dataTransfer?.types.includes(rt)&&o.aceitaSoltar&&(p.preventDefault(),l.classList.add("spro-alvo"))}),l.addEventListener("dragleave",()=>{l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo")}),l.addEventListener("drop",p=>{if(l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo"),s&&p.dataTransfer?.types.includes(Je)){let m=p.dataTransfer.getData(Je);if(m){p.preventDefault(),m!==o.chave&&r.aoReordenarColuna?.(m,o.chave,e);return}}let g=p.dataTransfer?.getData(rt);if(g){p.preventDefault();try{let{id:m,de:A}=JSON.parse(g);r.aoMover(m,A,o.chave)}catch{}}}),l}function es(o){let e=d("div",{class:"spro-quadro"});e.style.setProperty("--spro-col-largura",`${o.cfg.larguraColuna??280}px`);let r=t=>{let a=Wn(t,o.cfg,o.ctx,o.extras),n=a.map(s=>s.chave);return d("div",{class:"spro-colunas"},...a.map(s=>jc(s,n,o)))};if(o.cfg.raiasPorResponsavel&&o.cfg.colunas!=="responsavel")for(let t of Ge(o.processos,"responsavel",o.ctx))e.append(d("div",{class:"spro-raia"},d("div",{class:"spro-raia-nome"},t.rotulo,d("span",{class:"spro-grupo-n"},String(t.itens.length))),r(t.itens)));else e.append(r(o.processos));return o.processos.length||e.prepend(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro.")),e}var rs=".spro-fav-estrela, .spro-prj-ic, .spro-dem-cx",Fc=[".spro-fav-",".spro-prj-",".spro-dem-cx"],ts=(o,e)=>o.getElementById(`P${e}`)?.querySelectorAll("td")[1],We=["spro-fav-estrela","spro-prj-ic","spro-dem-cx"],tt=o=>We.find(e=>o.classList.contains(e))??"";function Gc(o,e,r){for(let t of Array.from(o.attributes))!e.hasAttribute(t.name)&&t.name!=="data-spro-id"&&t.name!=="data-tip"&&o.removeAttribute(t.name);for(let t of Array.from(e.attributes))t.name!=="aria-busy"&&t.name!=="title"&&o.getAttribute(t.name)!==t.value&&o.setAttribute(t.name,t.value);e.getAttribute("title")&&o.getAttribute("data-tip")!==e.getAttribute("title")&&o.setAttribute("data-tip",e.getAttribute("title")),o.removeAttribute("aria-busy"),o.setAttribute("data-spro-id",r),o.innerHTML!==e.innerHTML&&o.replaceChildren(...Array.from(e.cloneNode(!0).childNodes))}function as(){let o=new Map;return function(r,t){let a=ts(r,t),n=new Set,s=[];if(a){let i=[...a.querySelectorAll(rs)].sort((c,l)=>We.indexOf(tt(c))-We.indexOf(tt(l)));for(let c of i){let l=`${t}|${tt(c)}`;n.add(l);let p=o.get(l);p?Gc(p,c,t):(p=c.cloneNode(!0),p.removeAttribute("aria-busy"),p.setAttribute("data-spro-id",t),o.set(l,p)),s.push(p)}}for(let i of We)n.has(`${t}|${i}`)||o.delete(`${t}|${i}`);return s}}function at(o,e){let r=ts(o,e);return r?[...r.querySelectorAll(`${rs}, .acompanhamentoesp_icon`)].map(t=>`${t.className}|${t.getAttribute("aria-pressed")??""}|${t.getAttribute("aria-label")??""}|${t.hasAttribute("data-atraso")?1:0}|${t.querySelector('[class$="-n"]')?.textContent??""}`).join(";"):""}function ns(o){let e=[];for(let r of Array.from(o.styleSheets??[])){let t;try{t=r.cssRules}catch{continue}for(let a of Array.from(t)){let n=a.cssText;Fc.some(s=>n.includes(s))&&e.push(n)}}return e.join(`
`)}var Uc=30;function Bc(o){let e=[],r=(a,n)=>{let s=a?.getAttribute("data-tarefa");e.push({marca:s==null?null:s==="x",texto:n.replace(/\u00a0/g," ").replace(/\n+$/,"")})},t="";for(let a of Array.from(o.childNodes))if(a.nodeType===3)t+=a.textContent??"";else if(a.nodeType===1){let n=a;if(t){for(let s of t.split(`
`))r(null,s);t=""}n.tagName==="BR"?r(null,""):r(n,n.textContent??"")}if(t)for(let a of t.split(`
`))r(null,a);return e.length?e:[{marca:null,texto:""}]}function ss(o,e){let r=o.ownerDocument;o.replaceChildren(...e.map(t=>{let a=r.createElement("div");return a.className="spro-pi-linha",t.marca!==null&&a.setAttribute("data-tarefa",t.marca?"x":"o"),t.texto?a.textContent=t.texto:a.append(r.createElement("br")),a}))}function is(o,e){let r=o.prioridade,t=()=>{},a=d("div",{class:"spro-pi-editor",contenteditable:"true",role:"textbox","aria-multiline":"true","aria-label":"Anota\xE7\xE3o",spellcheck:"true"}),n=d("span",{class:"spro-pi-contador"}),s=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Lista de tarefas (nas linhas selecionadas)","aria-label":"Lista de tarefas"},_("check",16)),i=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Prioridade","aria-label":"Prioridade"},no("prioridade",16)),c=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Inserir a data de hoje","aria-label":"Inserir a data de hoje"},_("calendario",16)),l=d("div",{class:"spro-pi-barra"},s,c,i,n),p=d("div",{class:"spro-pi"},a,l),g=()=>Bc(a),m=()=>Oe(g());function A(){p.classList.toggle("spro-pi-prio",r),i.setAttribute("aria-pressed",String(r));let E=m().length;n.textContent=`${E}/${500}`,n.classList.toggle("spro-pi-estouro",E>500),t()}ss(a,Po(o.texto)),A();function y(){let E=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,v=Array.from(a.children),P=N=>{let T=N;for(;T&&T.parentNode!==a;)T=T.parentNode;return T?v.indexOf(T):-1};if(!E||!E.rangeCount)return[];let x=P(E.anchorNode),w=P(E.focusNode);if(x<0&&w<0)return[];let[I,L]=[Math.min(x<0?w:x,w<0?x:w),Math.max(x,w)];return Array.from({length:L-I+1},(N,T)=>I+T)}let M=E=>{ss(a,E),A()};for(let E of[s,c,i])E.addEventListener("mousedown",v=>v.preventDefault());return s.addEventListener("click",()=>{let E=g(),v=y();M(Dr(E,v.length?v:E.map((P,x)=>x).filter(P=>P===E.length-1))),a.focus()}),i.addEventListener("click",()=>{r=!r,A()}),c.addEventListener("click",()=>{a.focus();let E=lo(Fo());e.ownerDocument.execCommand?.("insertText",!1,E)||(a.append(E),A())}),a.addEventListener("input",A),a.addEventListener("paste",E=>{E.preventDefault();let v=E.clipboardData?.getData("text/plain")??"";e.ownerDocument.execCommand?.("insertText",!1,v.replace(/\r\n?/g,`
`))}),a.addEventListener("mousedown",E=>{let v=E.target.closest?.(".spro-pi-linha");!v||!v.hasAttribute("data-tarefa")||E.clientX-v.getBoundingClientRect().left>Uc||(E.preventDefault(),M(ke(g(),Array.from(a.children).indexOf(v))))}),a.addEventListener("keydown",E=>{if(E.key!=="Enter"||E.shiftKey)return;let v=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,P=y(),x=g();v?.isCollapsed&&P.length===1&&x[P[0]]?.marca!==null&&!x[P[0]].texto.trim()&&(E.preventDefault(),M(Dr(x,[P[0]])))}),{el:p,texto:m,prioridade:()=>r,aoMudar:E=>{t=E},foco:()=>{a.focus()}}}var Qc=[[/azul_marinho|marinho/,"#1d3557"],[/azul_claro|ciano|celeste/,"#2a9fd6"],[/azul/,"#2563c9"],[/verde_escuro/,"#166534"],[/verde|lima/,"#2e9e4f"],[/amarelo/,"#e0b000"],[/laranja/,"#ee7d11"],[/vermelho/,"#d1352b"],[/rosa|magenta/,"#d6409f"],[/roxo|violeta|lilas/,"#7048c6"],[/marrom/,"#8a5a3c"],[/preto/,"#222831"],[/cinza/,"#7b838c"]];function ue(o){let e=o.toLowerCase();return Qc.find(([r])=>r.test(e))?.[1]??"#8b939c"}var Kc=o=>o instanceof Error?o.message:String(o);async function nt(o,e,r,t,a){let n=0,s=[],i=0;for(let c of e){let l=o.todos().find(p=>p.id===c.id)??c;o.aplicarLocal(l.id,r(l));try{await o.gravar(()=>t(l)),n+=1}catch(p){o.aplicarLocal(l.id,l),s.push(`${l.protocolo}: ${Kc(p)}`)}a?.(i+=1,e.length)}return{ok:n,falhas:s}}function st(o,e,r){e.falhas.length?o.aviso(`${r}: ${e.ok} ok, ${e.falhas.length} com erro \u2014 ${e.falhas[0]}`):o.aviso(`${r}: ${e.ok} ${e.ok===1?"processo atualizado":"processos atualizados"}.`)}function cs(o,e,r){let t=Xe(e,o.selecionados(),o.todos(),!0,r).filter(n=>n.id!==e.id);if(!t.length)return null;let a=d("input",{type:"checkbox"});return{el:d("label",{class:"spro-rotulo-linha spro-estender"},a,` Aplicar tamb\xE9m aos ${t.length} ${t.length===1?"outro selecionado":"outros selecionados"}`),marcado:()=>a.checked,n:()=>t.length}}var it=(...o)=>d("div",{class:"spro-dialogo-rodape"},...o),ct=(o="Salvar")=>d("button",{type:"button",class:"spro-botao primario"},_("check",15),o);function ls(o,e){let r=[],t=e.atribuicao?.sigla??"",a=Co({rotulo:"Respons\xE1vel",icone:"pessoa",busca:!0,larguraLista:320,vazio:"Escolher o respons\xE1vel\u2026",opcoes:()=>[{valor:"",rotulo:"Sem respons\xE1vel",descricao:"Remove a atribui\xE7\xE3o"},...r.map(p=>({valor:p.sigla,rotulo:p.nome===p.sigla?p.sigla:p.nome,descricao:p.sigla}))],valor:[t],aoMudar:([p])=>{t=p??"",c()}}),n=cs(o,e,()=>!0),s=ct(),i=d("p",{class:"spro-suave"},"Carregando os usu\xE1rios da unidade\u2026"),c=()=>{s.disabled=!r.length||t===(e.atribuicao?.sigla??"")},l=Ko(o.raiz,{titulo:"Respons\xE1vel",subtitulo:e.protocolo,icone:"pessoa",conteudo:d("div",{class:"spro-form"},d("label",{class:"spro-campo-rotulo"},"Atribuir a",a.el),i,n?.el??null,it(s))});o.extras().then(p=>{r=p.responsaveis??[],i.textContent=r.length?"":"N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade.",a.atualizar(),c()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade."}),c(),s.addEventListener("click",async()=>{let p=t?r.find(m=>m.sigla===t)??{sigla:t,nome:t}:null,g=n?.marcado()?Xe(e,o.selecionados(),o.todos(),!0,()=>!0):[e];s.disabled=!0,l.fechar(),st(o,await nt(o,g,m=>Jn(m,p),m=>o.atribuir(m.protocolo,p?.sigla??null)),p?`Respons\xE1vel: ${p.nome}`:"Atribui\xE7\xE3o removida")})}function lt(o,e){let r=is({texto:e.anotacao?.texto??"",prioridade:e.anotacao?.prioridade??!1},o.raiz),t=ct(),a=e.anotacao?d("button",{type:"button",class:"spro-botao perigo"},_("lixeira",15),"Remover anota\xE7\xE3o"):null,n=()=>{let c=Be(r.texto()),l=r.texto().length>500;t.disabled=!c||l||c===(e.anotacao?.texto??"")&&r.prioridade()===(e.anotacao?.prioridade??!1)};r.aoMudar(n);let s=Ko(o.raiz,{titulo:"Anota\xE7\xE3o",subtitulo:e.protocolo,icone:"nota",largo:!0,conteudo:d("div",{class:"spro-form"},r.el,e.anotacao?.autor?d("p",{class:"spro-suave"},`\xDAltima edi\xE7\xE3o: ${e.anotacao.autor}`):null,it(a,t))});r.foco(),n();let i=async(c,l,p)=>{s.fechar(),st(o,await nt(o,[e],g=>Qe(g,c,l,o.autor),g=>o.anotar(g.protocolo,{texto:c,prioridade:l})),p)};t.addEventListener("click",()=>void i(Be(r.texto()),r.prioridade(),"Anota\xE7\xE3o salva")),a?.addEventListener("click",()=>void i("",!1,"Anota\xE7\xE3o removida"))}function ds(o,e){let r=e.marcadores.map(m=>({nome:m.nome,texto:m.texto})),t=[],a=d("div",{class:"spro-marcadores-lista"}),n=cs(o,e,m=>!m.sigiloso),s=ct(),i=d("p",{class:"spro-suave"},"Carregando os marcadores da unidade\u2026"),c=Co({rotulo:"Adicionar marcador",icone:"etiqueta",busca:!0,larguraLista:320,vazio:"Adicionar marcador\u2026",opcoes:()=>t.filter(m=>!r.some(A=>A.nome.toLowerCase()===m.toLowerCase())).map(m=>({valor:m,rotulo:m,cor:ue(o.corDoMarcador(m))})),aoMudar:([m])=>{m&&(r=[...r,{nome:m,texto:""}],c.definir([],!1),p())}}),l=()=>Xn(e.marcadores,r);function p(){a.replaceChildren(...r.length?r.map((m,A)=>{let y=d("input",{type:"text",class:"spro-campo",maxlength:String(250),placeholder:"Texto do marcador (opcional)","aria-label":`Texto de ${m.nome}`,value:m.texto});return y.addEventListener("input",()=>{r[A]={...m,texto:y.value},s.disabled=!l().length}),d("div",{class:"spro-marcador-linha"},d("span",{class:"spro-marcador",title:m.nome},d("i",{style:`background:${ue(o.corDoMarcador(m.nome))}`}),m.nome),y,d("button",{type:"button",class:"spro-botao-icone pequeno",title:`Remover ${m.nome}`,"aria-label":`Remover ${m.nome}`,onclick:()=>{r=r.filter((M,E)=>E!==A),p()}},_("fechar",13)))}):[d("p",{class:"spro-suave"},"Nenhum marcador. Adicione abaixo.")]),c.atualizar(),s.disabled=!l().length}let g=Ko(o.raiz,{titulo:"Marcadores",subtitulo:e.protocolo,icone:"etiqueta",conteudo:d("div",{class:"spro-form"},a,c.el,i,n?.el??null,it(s))});p(),o.extras().then(m=>{t=m.marcadores??[],i.textContent=t.length?"":"N\xE3o foi poss\xEDvel ler os marcadores da unidade.",p()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os marcadores da unidade."}),s.addEventListener("click",async()=>{let m=l();if(!m.length)return;let A=n?.marcado()?Xe(e,o.selecionados(),o.todos(),!0,y=>!y.sigiloso):[e];g.fechar(),st(o,await nt(o,A,y=>Kn(y,Yr(m,y),o.corDoMarcador),async y=>{for(let M of Yr(m,y))M.tipo==="remover"?await o.marcar(y.protocolo,{marcador:M.nome,remover:!0}):await o.marcar(y.protocolo,{marcador:M.nome,texto:M.texto})}),"Marcadores")})}function ps(o,e,r,t,a=8){let n=Math.max(1,e),s=t>0?t:n*40,i=Math.max(0,Math.min(o,Math.floor(r/n)-a)),c=Math.min(o,Math.ceil((r+s)/n)+a);return{inicio:i,fim:c,antes:i*n,depois:Math.max(0,o-c)*n}}var Ye={compacta:34,confortavel:48},Jc={processo:"minmax(340px, 370px)",tipo:"minmax(120px, 1.2fr)",especificacao:"minmax(200px, 2fr)",responsavel:"minmax(90px, 130px)",marcadores:"minmax(120px, 1.3fr)",prazo:"minmax(120px, 150px)",anotacao:"minmax(130px, 1.4fr)",caixa:"84px",parado:"84px",sinais:"minmax(110px, 150px)"},Wc={processo:"protocolo",tipo:"tipo",responsavel:"responsavel",marcadores:"marcador",prazo:"prazo",caixa:"caixa",parado:"parado",sinais:"novo"};function Zc(o){let e=o.trim().split(/\s+/);return e.length>2?`${e[0]} ${e[e.length-1]}`:o}function or(o,e){return d("button",{type:"button",class:"spro-lapis",title:o,"aria-label":o,onclick:r=>{r.preventDefault(),r.stopPropagation(),e()}},_("lapis",13))}var so=(o,e,r)=>d(o,{class:e},r);function Yc(o,e,r,t){let a=so("div",`spro-c spro-c-${e}`);switch(e){case"processo":{let n=t.icones(o.id),s=p=>n.find(g=>g.classList.contains(p))??d("span",{class:"spro-slot"}),i=o.acompanhamentoEspecial?d("span",{class:"spro-acomp",title:o.acompanhamentoGrupo?`Acompanhamento especial: ${o.acompanhamentoGrupo}`:"Acompanhamento especial"},_("olho",15)):d("span",{class:"spro-slot"});a.append(d("span",{class:"spro-icones"},s("spro-fav-estrela"),s("spro-prj-ic"),s("spro-dem-cx"),i));let c=o.grupo==="recebidos";t.semOrigem||a.append(d("span",{class:`spro-origem spro-origem-${o.grupo}`,title:c?"Processo recebido: veio de outra unidade":"Processo gerado: autuado nesta unidade",role:"img","aria-label":c?"Processo recebido":"Processo gerado"},no(c?"recebido":"gerado",16)));let l=d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",title:"Abrir o processo"},o.protocolo);a.append(l),o.link&&a.append(d("a",{class:"spro-nova-guia",href:o.link,target:"_blank",rel:"noopener",title:"Abrir em nova guia","aria-label":`Abrir ${o.protocolo} em nova guia`},no("novaGuia",14))),o.sigiloso&&a.append(d("span",{class:"spro-sigilo",title:"Processo sigiloso"},"sigiloso")),o.urgente&&a.append(d("span",{class:"spro-urgente",title:"Marcado como urgente"},"urgente")),o.trancado&&a.append(d("span",{class:"spro-sigilo",title:"Processo trancado"},"trancado"));break}case"tipo":a.append(so("span","spro-corta",o.tipo)),a.title=o.tipo;break;case"especificacao":{if(a.classList.add("spro-editavel"),t.editando===o.id){let n=d("input",{type:"text",class:"spro-espec-input",maxlength:"100",value:t.rascunho,"aria-label":"Especifica\xE7\xE3o do processo"});n.addEventListener("input",()=>t.aoDigitarEspec(n.value)),n.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"?t.aoSalvarEspec(o.id):l.key==="Escape"&&t.aoCancelarEspec()});let s=l=>l.preventDefault(),i=d("button",{type:"button",class:"spro-lapis spro-lapis-ok",title:"Salvar (Enter)","aria-label":"Salvar",onclick:()=>t.aoSalvarEspec(o.id)},_("check",14)),c=d("button",{type:"button",class:"spro-lapis",title:"Cancelar (Esc)","aria-label":"Cancelar",onclick:()=>t.aoCancelarEspec()},_("fechar",14));i.addEventListener("pointerdown",s),c.addEventListener("pointerdown",s),a.append(d("span",{class:"spro-edicao"},n,i,c));break}a.append(so("span","spro-corta",o.especificacao)),a.title=o.especificacao,o.sigiloso||a.append(or("Editar a especifica\xE7\xE3o",()=>t.aoEditarEspec(o.id)));break}case"responsavel":a.classList.add("spro-editavel"),o.atribuicao?(a.append(so("span","spro-corta",t.nomesCompletos?Zc(o.atribuicao.nome):o.atribuicao.sigla)),a.title=t.nomesCompletos?o.atribuicao.sigla:o.atribuicao.nome):a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"atribuir")),a.append(or(o.atribuicao?"Mudar o respons\xE1vel":"Atribuir a algu\xE9m",()=>t.aoEditar(o.id,"responsavel")));break;case"marcadores":a.classList.add("spro-editavel"),o.marcadores.length&&a.append(d("span",{class:"spro-pilulas"},...o.marcadores.map(n=>d("span",{class:"spro-marcador",title:n.texto?`${n.nome}: ${n.texto}`:n.nome},d("i",{style:`background:${ue(n.cor)}`}),n.nome)))),o.sigiloso||(o.marcadores.length||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"marcar")),a.append(or(o.marcadores.length?"Editar os marcadores":"Adicionar marcador",()=>t.aoEditar(o.id,"marcadores"))));break;case"prazo":{let n=co(o,r);a.classList.add("spro-editavel");let s=n?"Editar o prazo":"Definir um prazo",i=d("button",{type:"button",class:"spro-prazo-b",title:n?`${Wr(o,r)}
${n.dica}

${s}`:s,"aria-label":s,onclick:c=>{c.preventDefault(),c.stopPropagation(),t.aoAbrirPrazo(o.id)}},n?so("span",`spro-prazo spro-prazo-${n.situacao}`,n.texto):so("span","spro-prazo-vazio","definir"));a.append(i,d("span",{class:"spro-lapis spro-lapis-fixo","aria-hidden":"true"},_("lapis",13)));break}case"anotacao":a.classList.add("spro-editavel"),o.anotacao?(a.append(so("span",`spro-corta${o.anotacao.prioridade?" spro-prio":""}`,Fa(o.anotacao.texto))),a.setAttribute("data-tip-nota",o.anotacao.texto),a.setAttribute("data-tip-autor",o.anotacao.autor)):o.sigiloso||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"anotar")),o.sigiloso||a.append(or(o.anotacao?"Editar a anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",()=>t.aoEditar(o.id,"anotacao")));break;case"caixa":{let n=Uo(bo(o,r));a.append(so("span","spro-suave",n)),n&&(a.title=bn);break}case"parado":{let n=Oo(o,r);a.append(so("span","spro-suave",Uo(n))),n!==null&&(a.title="Dias desde a \xFAltima movimenta\xE7\xE3o (vis\xE3o detalhada do SEI).");break}case"sinais":for(let n of Jr(o))a.append(so("span","spro-sinal",n));break}return a}function us(o){let e=o,r=so("div","spro-cab"),t=so("div","spro-corpo"),a=d("div",{class:"spro-rolagem",tabindex:"-1"},t),n=d("div",{class:"spro-tabela",role:"table"},r,a),s="",i=!1,c=!1,l=()=>`36px ${e.colunas.map(v=>Jc[v]).join(" ")}`;function p(){r.replaceChildren(),r.style.gridTemplateColumns=l();let v=e.linhas.filter(w=>w.tipo==="processo").map(w=>w.processo.id),P=v.filter(w=>e.selecionados.has(w)).length,x=d("input",{type:"checkbox",class:"spro-cb","aria-label":"Marcar todos os processos vis\xEDveis",title:"Marcar todos os vis\xEDveis",disabled:!v.length});x.checked=v.length>0&&P===v.length,x.indeterminate=P>0&&P<v.length,x.addEventListener("change",()=>e.aoMarcarGrupo(v,x.checked)),r.append(so("div","spro-c spro-c-cb")),r.firstElementChild.append(x);for(let w of e.colunas){let I=Wc[w],L=I?e.ordem.findIndex(T=>T.campo===I):-1,N=d("div",{class:`spro-c spro-th${I?" spro-ordenavel":""}`,role:"columnheader",...L>=0?{"aria-sort":e.ordem[L].decrescente?"descending":"ascending"}:{}});if(I){let T=d("button",{type:"button",class:"spro-th-b",title:"Ordenar (Shift acrescenta outro crit\xE9rio)",onclick:S=>e.aoOrdenar(I,S.shiftKey)},zo[w]);L>=0&&T.append(d("span",{class:"spro-seta-ordem"},`${e.ordem[L].decrescente?"\u2193":"\u2191"}${e.ordem.length>1?L+1:""}`)),N.append(T)}else N.append(zo[w]);r.append(N)}}function g(v,P){let x=e.selecionados.has(v.id),w=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${v.protocolo}`,title:v.naPaginaAtual?void 0:`Est\xE1 na p\xE1gina ${v.pagina+1} do SEI: as a\xE7\xF5es do SEI aceitam processos de uma p\xE1gina por vez`});w.checked=x,w.addEventListener("change",()=>e.aoSelecionar(v.id,w.checked));let I=d("div",{class:`spro-linha${x?" spro-sel":""}${e.foco===v.id?" spro-foco":""}${v.urgente?" spro-linha-urgente":""}`,role:"row","data-id":v.id,"data-grupo":P});I.style.gridTemplateColumns=l(),I.style.height=`${Ye[e.densidade]}px`;let L=so("div","spro-c spro-c-cb");return L.append(w),I.append(L,...e.colunas.map(N=>Yc(v,N,e.ctx,e))),I}function m(v){let P=v.grupo.itens.map(I=>I.id),x=d("button",{type:"button",class:"spro-grupo-b","aria-expanded":String(!v.recolhido),onclick:()=>e.aoGrupo(v.grupo.chave)},d("span",{class:`spro-grupo-seta${v.recolhido?" spro-fechado":""}`},no("seta",14)),d("span",{class:"spro-grupo-nome"},v.grupo.rotulo),d("span",{class:"spro-grupo-n"},String(v.grupo.itens.length))),w=d("div",{class:`spro-grupo${v.grupo.tom?` spro-tom-${v.grupo.tom}`:""}`,role:"row"},x);if(P.length){let I=P.every(L=>e.selecionados.has(L));w.append(d("button",{type:"button",class:"spro-link",onclick:()=>e.aoMarcarGrupo(P,!I)},I?"Desmarcar grupo":"Marcar grupo"))}return w.style.height=`${Ye[e.densidade]}px`,w}function A(){let v=Ye[e.densidade],P=ps(e.linhas.length,v,a.scrollTop||0,a.clientHeight||0);t.style.paddingTop=`${P.antes}px`,t.style.paddingBottom=`${P.depois}px`,t.replaceChildren(...e.linhas.slice(P.inicio,P.fim).map(w=>w.tipo==="grupo"?m(w):g(w.processo,w.grupo)));let x=t.querySelector(".spro-espec-input");x&&i?(i=!1,x.focus(),x.setSelectionRange?.(x.value.length,x.value.length)):x&&x.getRootNode()instanceof ShadowRoot&&x.getRootNode().activeElement!==x&&c&&x.focus()}let y=0;a.addEventListener("scroll",()=>{if(y)return;let v=a.ownerDocument.defaultView;if(!v?.requestAnimationFrame)return A();y=v.requestAnimationFrame(()=>{y=0,A()})});function M(v){let P=v.colunas.join()!==e.colunas.join()||v.ordem!==e.ordem||v.selecionados!==e.selecionados;v.editando&&v.editando!==e.editando&&(i=!0),c=!!v.editando,e=v;let x=`${e.colunas.join()}|${e.densidade}`;if((P||x!==s)&&(p(),s=x),!e.linhas.length){t.style.paddingTop=t.style.paddingBottom="0",t.replaceChildren(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro."));return}A()}function E(v){let P=e.linhas.findIndex(w=>w.tipo==="processo"&&w.processo.id===v);if(P<0)return!1;let x=Ye[e.densidade];return P*x<a.scrollTop?a.scrollTop=P*x:(P+1)*x>a.scrollTop+a.clientHeight&&a.clientHeight>0&&(a.scrollTop=(P+1)*x-a.clientHeight),A(),!0}return M(o),{el:n,atualizar:M,mostrar:E,rolagem:a}}var ol=[["/","Buscar"],["j / k","Linha seguinte / anterior"],["x","Marcar a linha"],["Enter","Abrir o processo"],["g t","Ver a tabela"],["g q","Ver o quadro"],["Esc","Limpar a busca ou a sele\xE7\xE3o"],["?","Esta ajuda"]],ms=o=>o==="grupo:recebidos"?"grupo:gerados":o==="grupo:gerados"?"grupo:recebidos":null,el={"resp:eu":"Processos atribu\xEDdos a voc\xEA","grupo:recebidos":"Processos que vieram de outra unidade","grupo:gerados":"Processos autuados nesta unidade","prazo:atrasado":"Prazo vencido e ainda n\xE3o conclu\xEDdo","prazo:semana":"Vencem nos pr\xF3ximos 7 dias","resp:sem":"Processos sem respons\xE1vel","novo:sim":"Ainda n\xE3o abertos nesta unidade","novo:visita":"Chegaram depois da sua \xFAltima visita","parado:>30d":"Sem movimenta\xE7\xE3o h\xE1 mais de 30 dias (vis\xE3o detalhada do SEI)"},rl=[["Meus","resp:eu",{comum:"pessoa"},""],["Recebidos","grupo:recebidos",{grade:"recebido"},""],["Gerados","grupo:gerados",{grade:"gerado"},""],["Atrasados","prazo:atrasado",{comum:"alerta"},"perigo"],["Vencem na semana","prazo:semana",{comum:"calendario"},"aviso"],["Sem respons\xE1vel","resp:sem",{grade:"semPessoa"},""],["N\xE3o visualizados","novo:sim",{grade:"olhoFechado"},""],["Novos desde a \xFAltima visita","novo:visita",{comum:"brilho"},"novo"],["Parados h\xE1 +30 dias","parado:>30d",{comum:"historico"},""]];function fs(o){let{doc:e}=o,r=o.inicial.processos,t=Qo(),a=[],n="",s=new Set,i=new Set(Hr(e)),c=null,l={vistoEm:{}},p,g=null,m=!1,A=!1,y="",M={},E=!1,v=!1,P,x=!1,w=$n(o.mover),I=new AbortController,L=()=>({hoje:o.hoje(),agora:o.agora(),...o.eu?{eu:o.eu}:{},...p!==void 0?{visitaAnterior:p}:{},...H?{andamentos:H.dados()}:{}}),N=e.createElement("div");N.id="spro-grade",N.setAttribute("data-spro-grade-host","1"),N.setAttribute("data-tema",o.escuro?"escuro":"claro");let T=N.attachShadow({mode:"open"}),S=e.createElement("style");S.textContent=o.css;let k=d("div",{class:`spro-app${o.escuro?" spro-escuro":""}`}),$=e.createElement("style");T.append(S,$,k);let F=Ba(T),H=o.consultarAndamento?os({sombra:T,agora:()=>o.agora(),armazem:o.armazem,consultar:(u,f)=>o.consultarAndamento(u,f),processos:()=>r,aoMudar:()=>W(),aviso:u=>Z(u),simultaneas:o.andamentoSimultaneas,pausaMs:o.andamentoPausaMs,semDebounce:o.semDebounce}):null,z=d("input",{type:"search",class:"spro-busca",placeholder:"Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...","aria-label":"Buscar processos",spellcheck:"false",autocomplete:"off"}),X=d("div",{class:"spro-chips"}),qo=d("div",{class:"spro-rapidos"}),mo=d("div",{class:"spro-status",role:"status","aria-live":"polite"}),Mo=d("div",{class:"spro-lote",hidden:!0}),Zo=d("div",{class:"spro-conteudo"}),Do=d("div",{class:"spro-painel",hidden:!0}),ut=d("div",{class:"spro-avisos","aria-live":"polite"}),Yo=d("div",{class:"spro-ajuda-atalhos",hidden:!0},d("strong",{},"Atalhos"),...ol.map(([u,f])=>d("div",{},d("kbd",{},u),` ${f}`))),As=[["protocolo","N\xFAmero do processo"],["prazo","Prazo"],["tipo","Tipo"],["responsavel","Respons\xE1vel"],["marcador","Marcador"],["caixa","Tempo na caixa"],["parado","Parado h\xE1"],["novo","N\xE3o visualizados"]],ar=Co({rotulo:"Agrupar por",icone:"camadas",classe:"spro-combo-compacto",busca:!1,vazio:"Sem agrupamento",opcoes:Object.keys(Xr).filter(u=>H||!pe(u)).map(u=>({valor:u,rotulo:u==="nenhum"?"Sem agrupamento":`Agrupar: ${Xr[u]}`,...pe(u)?{descricao:"Consulta o andamento de cada processo"}:{}})),valor:["nenhum"],aoMudar:([u])=>{let f=u??"nenhum",h=t.agrupar;B({agrupar:f}),H&&pe(f)&&H.aoEscolherAgrupamento().then(b=>{!b&&t.agrupar===f&&B({agrupar:h})})}}),mt=Co({rotulo:"Ordenar por",icone:"ordenar",classe:"spro-combo-compacto",busca:!1,vazio:"Ordem do SEI",opcoes:[{valor:"",rotulo:"Ordem do SEI"},...As.flatMap(([u,f])=>[{valor:`${u}:a`,rotulo:`${f} \u2191`,descricao:"Crescente"},{valor:`${u}:d`,rotulo:`${f} \u2193`,descricao:"Decrescente"}])],valor:[""],aoMudar:([u])=>{let[f,h]=(u??"").split(":");B({ordem:f?[{campo:f,decrescente:h==="d"}]:[]})}}),fe=Kr([],L()),nr=(u,f,h,b,D)=>{let C=Co({rotulo:u,vazio:f,icone:b,classe:"spro-combo-compacto",busca:!0,larguraLista:260,opcoes:()=>D().map(R=>({valor:R.valor,rotulo:R.rotulo,contagem:R.n})),aoMudar:([R])=>{R&&(B({busca:qn(t.busca,h,R)}),z.value=t.busca,C.definir([],!1))}});return C},ft=nr("Filtrar por respons\xE1vel","Respons\xE1vel\u2026","resp","pessoa",()=>fe.responsaveis),gt=nr("Filtrar por tipo","Tipo\u2026","tipo","documento",()=>fe.tipos),ht=nr("Filtrar por marcador","Marcador\u2026","marcador","etiqueta",()=>fe.marcadores),bt=(u,f)=>d("button",{type:"button",class:"spro-seg-b","data-modo":u,title:f,onclick:()=>B({modo:u})},no(u==="tabela"?"lista":"quadro",16),d("span",{},f)),vt=d("div",{class:"spro-seg",role:"group","aria-label":"Modo de exibi\xE7\xE3o"},bt("tabela","Tabela"),bt("quadro","Quadro")),ge=(u,f,h,b="")=>d("button",{type:"button",class:`spro-bt ${b}`.trim(),title:f,"aria-label":f,onclick:h},no(u,16),d("span",{},f)),xt=ge("colunas","Colunas",()=>Ho("colunas")),ys=ge("disquete","Vis\xF5es",()=>Ho("visoes")),Es=ge("lista","Exportar CSV",()=>Ns()),Ss=d("button",{type:"button",class:"spro-bt spro-bt-icone",title:"Atalhos de teclado (?)","aria-label":"Atalhos de teclado",onclick:()=>{Yo.hidden=!Yo.hidden}},"?"),At=ge("densidade","Densidade",()=>B({densidade:t.densidade==="compacta"?"confortavel":"compacta"})),he=d("div",{class:"spro-quadro-cfg",hidden:!0});k.append(d("div",{class:"spro-barra"},vt,d("div",{class:"spro-busca-caixa"},z),ar.el,mt.el,xt,At,ys,Es,Ss),X,d("div",{class:"spro-faixa"},qo,ft.el,gt.el,ht.el),he,Yo,Do,mo,...H?[H.faixa]:[],Mo,Zo,ut);let yt=()=>hn(r,l),oe="",ee=()=>_n(yt(),`${t.busca} ${oe}`.trim(),L()),sr=()=>Bn(ee(),t.ordem,L());function B(u){t={...t,...u},u.busca===void 0?o.armazem.gravarVisao(t).catch(()=>{}):ws(),W()}let ir;function ws(){clearTimeout(ir),ir=setTimeout(()=>void o.armazem.gravarVisao(t).catch(()=>{}),400)}function Z(u,f){let h=d("div",{class:"spro-aviso",role:"status"},d("span",{},u));f&&h.append(d("button",{type:"button",class:"spro-link",onclick:()=>{f.fazer(),h.remove()}},f.rotulo)),h.append(d("button",{type:"button",class:"spro-aviso-x","aria-label":"Fechar aviso",onclick:()=>h.remove()},"\xD7")),ut.append(h),setTimeout(()=>h.remove(),f?9e3:6e3).unref?.()}function Vo(u,f){let h=new Set(i);for(let b of u)f?h.add(b):h.delete(b);i=h,On(e,h),pr(),fo()}let be=new Map;function yo(u,f){let h=r.find(b=>b.id===u);if(h){let b=be.get(u)??{};for(let D of new Set([...Object.keys(h),...Object.keys(f)]))JSON.stringify(h[D])!==JSON.stringify(f[D])&&(b[D]=f[D]);be.set(u,b)}r=r.map(b=>b.id===u?f:b)}let Et=Promise.resolve();function St(u){Io+=1;let f=Et.then(u,u);return Et=f.catch(()=>{}).finally(()=>{Io-=1}),f}let cr=null,ve={raiz:T,extras:()=>(cr??=(o.extras?o.extras().then(u=>(M=u,u)):Promise.resolve({})).catch(u=>{throw cr=null,u}),cr),todos:()=>r,selecionados:()=>i,corDoMarcador:u=>r.flatMap(f=>f.marcadores).find(f=>f.nome===u)?.cor??"",autor:o.eu??"",aplicarLocal:(u,f)=>{yo(u,f),W()},gravar:St,atribuir:(u,f)=>o.mover.atribuir(u,f),marcar:(u,f)=>o.mover.marcador(u,f),anotar:(u,f)=>o.anotar(u,f),aviso:u=>Z(u)};async function Ps(u,f,h){let b=r.find(j=>j.id===u);if(!b)return;let D=Yn(t.quadro.colunas,b,f,h);if(!D.ok)return Z(D.motivo);let C=Object.fromEntries((M.responsaveis??[]).map(j=>[j.sigla,j.nome]));yo(u,et(b,D.movimento,C)),W(),Io+=1;let R=await w.mover(D.movimento).finally(()=>{Io-=1});if(!v){if(!R.ok)return yo(u,b),W(),Z(`N\xE3o foi poss\xEDvel mover ${b.protocolo}: ${R.erro}`);Z(`${b.protocolo} movido.`,{rotulo:"Desfazer",fazer:()=>{let j=r.find(ao=>ao.id===u)??b;yo(u,et(j,R.desfazer,C)),W(),w.mover(R.desfazer).then(ao=>{ao.ok||v||(yo(u,j),W(),Z(`N\xE3o foi poss\xEDvel desfazer: ${ao.erro}`))})}})}}let Ms=as(),lr=new Map([[No("recebidos",0),o.inicial.selecoes.recebidos],[No("gerados",0),o.inicial.selecoes.gerados],[No("detalhado",0),o.inicial.selecoes.detalhado]]),dr=o.inicial.visao==="detalhada";function Ds(u){let f=r.filter(D=>i.has(D.id)),h=Va(u);if(h?.requerSelecao&&!f.length)return Z("Marque ao menos um processo.");if(h&&!h.aceitaSigiloso&&qa(f))return Z("Opera\xE7\xE3o n\xE3o aplic\xE1vel em processo sigiloso.");let b=za(f,lr,dr?"detalhada":"resumida");if(!b.ok)return Z(b.motivo);if(b.plano.todosNaPaginaAtual||!h){let D=Ln(u,f.length);!D.ok&&D.motivo&&Z(D.motivo);return}try{o.enviarAcao(h.url,b.plano)}catch(D){Z(`N\xE3o foi poss\xEDvel enviar a a\xE7\xE3o: ${D instanceof Error?D.message:String(D)}`)}}let Io=0,xe=null,Ae="",wt=!1,Pt=u=>({linhas:u,colunas:t.colunas,densidade:t.densidade,ctx:L(),ordem:t.ordem,selecionados:i,foco:c,icones:f=>Ms(e,f),nomesCompletos:wt,editando:xe,rascunho:Ae,semOrigem:dr,aoOrdenar:(f,h)=>B({ordem:Qn(t.ordem,f,h)}),aoSelecionar:(f,h)=>Vo([f],h),aoGrupo:f=>{let h=new Set(s);h.has(f)?h.delete(f):h.add(f),s=h,o.armazem.gravarRecolhidos([...h]).catch(()=>{}),fo()},aoMarcarGrupo:(f,h)=>Vo(f,h),aoEditarEspec:f=>{xe=f,Ae=r.find(h=>h.id===f)?.especificacao??"",fo()},aoDigitarEspec:f=>{Ae=f},aoCancelarEspec:()=>{xe=null,fo()},aoSalvarEspec:f=>void Cs(f),aoAbrirPrazo:f=>o.abrirPrazo(f),aoEditar:(f,h)=>{let b=r.find(D=>D.id===f);b&&(h==="responsavel"?ls(ve,b):h==="anotacao"?lt(ve,b):ds(ve,b))}}),ye=us(Pt([]));async function Cs(u){let f=r.find(b=>b.id===u),h=Ae.trim();if(xe=null,!f||h===f.especificacao.trim())return fo();if(!h)return Z("A especifica\xE7\xE3o n\xE3o pode ficar vazia."),fo();yo(u,{...f,especificacao:h}),W(),Io+=1;try{await o.editarEspecificacao(f.protocolo,h),Z(`Especifica\xE7\xE3o de ${f.protocolo} salva.`)}catch(b){yo(u,f),W(),Z(`N\xE3o foi poss\xEDvel salvar a especifica\xE7\xE3o: ${b instanceof Error?b.message:String(b)}`)}finally{Io-=1}}async function Os(u,f){let h=r.find(R=>R.id===u);if(!h?.anotacao||h.sigiloso)return;let b=Po(h.anotacao.texto);if(b[f]?.marca==null)return;let D=Oe(ke(b,f)),C=h.anotacao.prioridade;yo(u,Qe(h,D,C,o.eu??"")),W();try{await St(()=>o.anotar(h.protocolo,{texto:D,prioridade:C}))}catch(R){yo(u,h),W(),Z(`N\xE3o foi poss\xEDvel atualizar a anota\xE7\xE3o: ${R instanceof Error?R.message:String(R)}`)}}function ks(u){let f=t.quadro.colunasRecolhidas??[],h=f.includes(u)?f.filter(C=>C!==u):[...f,u],{colunasRecolhidas:b,...D}=t.quadro;B({quadro:h.length?{...D,colunasRecolhidas:h}:D})}function fo(){let u=sr();if(t.modo==="quadro"){Zo.replaceChildren(es({processos:u,cfg:t.quadro,ctx:L(),extras:M,selecionados:i,aoMover:(h,b,D)=>void Ps(h,b,D),aoSelecionar:(h,b)=>Vo([h],b),aoAbrirPrazo:h=>o.abrirPrazo(h),aoReordenarColuna:(h,b,D)=>B({quadro:{...t.quadro,ordemColunas:Zn(D,h,b)}}),aoEditarAnotacao:h=>{let b=r.find(D=>D.id===h);b&&!b.sigiloso&&lt(ve,b)},aoAlternarTarefa:(h,b)=>void Os(h,b),aoAlternarColuna:h=>ks(h)}));return}let f=Ge(u,t.agrupar,L());ye.atualizar(Pt(Fn(f,s,t.agrupar!=="nenhum"))),Zo.firstElementChild!==ye.el&&Zo.replaceChildren(ye.el)}function Mt(u){let f=[`${u} de ${r.length} processo${r.length===1?"":"s"}`];oe&&f.push(`filtro da pesquisa r\xE1pida: ${oe}`);let h=o.inicial.totais.recebidos+o.inicial.totais.gerados;m&&g?f.push(`carregando ${g.grupo} (${g.paginasLidas}/${g.paginasTotal})\u2026`):!A&&h>r.length&&f.push(`o SEI informa ${h}; os demais n\xE3o foram carregados`),y&&f.push(`aviso: ${y}`),mo.replaceChildren(f.join(" \xB7 ")),mo.classList.toggle("spro-status-alerta",!!y||!A&&!m&&h>r.length)}function pr(){let u=i.size;if(Mo.hidden=u===0,!u)return Mo.replaceChildren();let f=new Set(ee().map(b=>b.id)),h=[...i].filter(b=>!f.has(b)).length;Mo.replaceChildren(d("strong",{},`${u} selecionado${u===1?"":"s"}`),...h?[d("span",{class:"spro-suave"},`(${h} fora do filtro atual)`)]:[],...o.acoes().map(b=>d("button",{type:"button",class:"spro-bt",title:b.rotulo,onclick:()=>Ds(b)},d("img",{src:b.icone,alt:"",width:"16",height:"16"}),d("span",{},b.rotulo))),d("button",{type:"button",class:"spro-link",onclick:()=>Vo([...i],!1)},"Limpar sele\xE7\xE3o"))}function Ls(){let u=Br(t.busca);X.replaceChildren(...u.tokens.map(h=>d("span",{class:`spro-chip${h.termo.negado?" spro-chip-neg":""}`},h.texto,d("button",{type:"button","aria-label":`Remover ${h.texto}`,onclick:()=>{B({busca:Fe(t.busca,h.texto)}),z.value=t.busca}},"\xD7")))),X.hidden=!u.tokens.length;let f=new Set(u.tokens.map(h=>h.texto));qo.replaceChildren(...rl.filter(([,h])=>!(dr&&h.startsWith("grupo:"))).map(([h,b,D,C])=>d("button",{type:"button","data-tip":`${h}
${el[b]??""}
Busca: ${b}${f.has(b)?`
Clique para desligar`:""}`,"aria-label":h,class:`spro-rapido${C?` spro-rapido-${C}`:""}${f.has(b)?" spro-rapido-on":""}`,"aria-pressed":String(f.has(b)),onclick:()=>{B({busca:f.has(b)?Fe(t.busca,b):`${ms(b)?Fe(t.busca,ms(b)):t.busca} ${b}`.trim()}),z.value=t.busca}},"comum"in D?_(D.comum,14,e):no(D.grade,14,e),d("span",{class:"spro-rapido-rotulo"},h)))),Dt()}let Eo=N.shadowRoot.querySelector(".spro-faixa");function Dt(){v||(Eo.classList.remove("spro-faixa-c1","spro-faixa-c2"),Eo.clientWidth&&(Eo.scrollWidth>Eo.clientWidth+1&&Eo.classList.add("spro-faixa-c1"),Eo.scrollWidth>Eo.clientWidth+1&&Eo.classList.add("spro-faixa-c2")))}let Ct=e.defaultView?.ResizeObserver,Ot=Ct?new Ct(()=>Dt()):null;Ot?.observe(Eo);let kt=new Map,Lt=new Set,It=u=>`${u.id}|${u.marcadores.map(f=>f.nome).join("|")}`;function $t(u){if(u.marcadores.length<=1)return u;let f=kt.get(u.id);if(!f)return u;let h=!1,b=u.marcadores.map(D=>{if(D.dataHora!==void 0)return D;let C=f[Q(D.nome)];return C===void 0?D:(h=!0,{...D,dataHora:C})});return h?{...u,marcadores:b}:u}function Is(){if(!o.consultarDatasMarcadores||v||!(t.modo==="quadro"&&t.quadro.colunas==="marcador"||t.modo==="tabela"&&t.agrupar==="marcador"))return;let f=r.filter(C=>C.marcadores.length>1&&C.linkMarcadores&&!Lt.has(It(C)));if(!f.length)return;for(let C of f)Lt.add(It(C));let h=[...f],b=Math.min(4,h.length),D=async()=>{for(;h.length&&!v&&!I.signal.aborted;){let C=h.shift(),R=await o.consultarDatasMarcadores(C,I.signal).catch(()=>null);!R||v||(kt.set(C.id,R),r=r.map(j=>j.id===C.id?$t(j):j),W())}};for(let C=0;C<b;C++)D()}function W(){if(v)return;fe=Kr(yt(),L());for(let f of[ft,gt,ht])f.atualizar();ar.definir([t.agrupar],!1),ar.el.disabled=t.modo==="quadro",mt.definir([t.ordem[0]?`${t.ordem[0].campo}:${t.ordem[0].decrescente?"d":"a"}`:""],!1);for(let f of vt.querySelectorAll("[data-modo]"))f.setAttribute("aria-pressed",String(f.getAttribute("data-modo")===t.modo));At.title=t.densidade==="compacta"?"Linhas confort\xE1veis":"Linhas compactas",xt.hidden=t.modo==="quadro",$s(),Ls(),H?.definirAtivo(pe(t.agrupar)&&t.modo==="tabela"),fo(),Mt(ee().length),pr(),Is(),t.modo==="quadro"&&!E&&o.extras&&(E=!0,o.extras().then(f=>{M=f,v||fo()}).catch(()=>{}))}function $s(){if(he.hidden=t.modo!=="quadro",he.hidden)return;let u=t.quadro,f=Co({rotulo:"Colunas do quadro",icone:"mapa",classe:"spro-combo-compacto",busca:!1,opcoes:[{valor:"marcador",rotulo:"Colunas: marcador"},{valor:"responsavel",rotulo:"Colunas: respons\xE1vel"},{valor:"prazo",rotulo:"Colunas: prazo (leitura)"},{valor:"tipo",rotulo:"Colunas: tipo (leitura)"}],valor:[u.colunas],aoMudar:([eo])=>{E=!1,B({quadro:{...u,colunas:eo??"marcador"}})}}),h=d("input",{type:"number",min:"0",max:"99",class:"spro-num",value:String(u.limite),"aria-label":"Limite de cart\xF5es por coluna (0 = sem limite)",title:"Limite de cart\xF5es por coluna (0 = sem limite)",onchange:eo=>B({quadro:{...u,limite:Math.max(0,Math.min(99,Number(eo.target.value)||0))}})}),b=d("input",{type:"checkbox",onchange:eo=>B({quadro:{...u,raiasPorResponsavel:eo.target.checked}})});b.checked=u.raiasPorResponsavel;let D=u.larguraColuna??280,C=eo=>{let jo=Math.max(200,Math.min(500,Math.round(eo)));B({quadro:{...t.quadro,larguraColuna:jo}})},R=d("span",{class:"spro-largura-val"},`${D}px`),j=d("input",{type:"range",min:"200",max:"500",step:"20",value:String(D),class:"spro-largura-range","aria-label":"Largura das colunas",title:"Ajustar largura das colunas e cart\xF5es",oninput:eo=>{let jo=Number(eo.target.value)||280;R.textContent=`${jo}px`,Zo.querySelector(".spro-quadro")?.style.setProperty("--spro-col-largura",`${jo}px`)},onchange:eo=>C(Number(eo.target.value)||280)}),ao=d("div",{class:"spro-largura-ctrl"},d("span",{},"Largura"),d("button",{type:"button",class:"spro-largura-bt","aria-label":"Diminuir largura das colunas",title:"Diminuir largura das colunas",onclick:()=>C(D-20)},"\u2212"),j,d("button",{type:"button",class:"spro-largura-bt","aria-label":"Aumentar largura das colunas",title:"Aumentar largura das colunas",onclick:()=>C(D+20)},"+"),R),re=u.ordemColunas?.length?d("button",{type:"button",class:"spro-link",title:"Voltar \xE0 ordena\xE7\xE3o autom\xE1tica das colunas",onclick:()=>{let{ordemColunas:eo,...jo}=t.quadro;B({quadro:jo})}},"Restaurar ordem"):null;he.replaceChildren(f.el,d("label",{class:"spro-rotulo-inline"},"Limite ",h),ao,d("label",{class:"spro-rotulo-inline"},b," Raias por respons\xE1vel"),...re?[re]:[],d("span",{class:"spro-suave"},u.colunas==="marcador"||u.colunas==="responsavel"?"Arraste cart\xF5es ou cabe\xE7alhos das colunas.":"Arraste os cabe\xE7alhos para reordenar as colunas."))}function Ho(u){if(!Do.hidden&&Do.getAttribute("data-qual")===u){Do.hidden=!0;return}if(Do.setAttribute("data-qual",u),Do.hidden=!1,u==="colunas"){Do.replaceChildren(d("strong",{},"Colunas"),...Bo.map(C=>{let R=d("input",{type:"checkbox",disabled:C==="processo"});return R.checked=t.colunas.includes(C),R.addEventListener("change",()=>{let j=R.checked?Bo.filter(ao=>ao===C||t.colunas.includes(ao)):t.colunas.filter(ao=>ao!==C);B({colunas:j})}),d("label",{class:"spro-rotulo-linha"},R,` ${zo[C]}`)}),d("button",{type:"button",class:"spro-link",onclick:()=>B({colunas:Qo().colunas})},"Restaurar padr\xE3o"));return}let f=d("input",{type:"text",class:"spro-nome",maxlength:"40",placeholder:"Nome da vis\xE3o","aria-label":"Nome da vis\xE3o"}),h=a.find(C=>C.id===n);f.value=h?.nome??"";let b=async(C,R=a)=>{a=C,await o.armazem.gravarVisoes(C,R).catch(()=>Z("N\xE3o foi poss\xEDvel sincronizar as vis\xF5es."))},D=async C=>{let R={...t,nome:f.value.trim()||"Minha vis\xE3o",id:C==="atualizar"?n:""},j=vn(a,R,o.novoId);if(!j)return Z("Limite de vis\xF5es salvas atingido.");n=j.visao.id,await b(j.lista),Z(`Vis\xE3o "${j.visao.nome}" salva.`),Ho("visoes"),Ho("visoes")};Do.replaceChildren(d("strong",{},"Vis\xF5es salvas"),a.length?d("ul",{class:"spro-lista-visoes"},...a.map(C=>d("li",{},d("button",{type:"button",class:`spro-link${C.id===n?" spro-ativa":""}`,onclick:()=>{n=C.id,z.value=C.busca,B({...C,id:""})}},C.nome),d("button",{type:"button",class:"spro-aviso-x","aria-label":`Excluir ${C.nome}`,title:"Excluir",onclick:async()=>{await b(xn(a,C.id),a),n===C.id&&(n=""),Ho("visoes"),Ho("visoes")}},"\xD7")))):d("p",{class:"spro-suave"},"Nenhuma vis\xE3o salva ainda."),d("div",{class:"spro-linha-form"},f,d("button",{type:"button",class:"spro-bt",onclick:()=>void D("nova")},"Salvar como nova"),h&&An(t,h)?d("button",{type:"button",class:"spro-bt",onclick:()=>void D("atualizar")},"Atualizar"):null))}function Ns(){let u=Hn(sr(),t.modo==="quadro"?[...Bo]:t.colunas,L());o.baixar(jn(o.hoje()),Sn(u),"text/csv;charset=utf-8"),Z(`${u.length-1} processos exportados.`)}z.addEventListener("input",()=>{let u=z.value;if(o.semDebounce)return B({busca:u});clearTimeout(P),P=setTimeout(()=>B({busca:u}),120)}),z.addEventListener("keydown",u=>{u.key==="Escape"&&(z.value="",B({busca:""}),z.blur())});function Nt(u){if(v||u.ctrlKey||u.metaKey||u.altKey)return;let f=u.target;if(f&&(/^(input|textarea|select)$/i.test(f.tagName)||f.isContentEditable)||N.hidden)return;let b=u.key;if(x){x=!1,b==="t"?B({modo:"tabela"}):b==="q"&&B({modo:"quadro"});return}let D=sr().map(R=>R.id),C=c?D.indexOf(c):-1;if(b==="/")u.preventDefault(),z.focus();else if(b==="?")Yo.hidden=!Yo.hidden;else if(b==="g")x=!0;else if(b==="Escape")i.size&&Vo([...i],!1);else if((b==="j"||b==="k")&&t.modo==="tabela"&&D.length)c=D[Math.max(0,Math.min(D.length-1,C+(b==="j"?1:-1)))],fo(),ye.mostrar(c);else if(b==="x"&&c)r.find(j=>j.id===c)&&Vo([c],!i.has(c));else if(b==="Enter"&&c){let R=r.find(j=>j.id===c)?.link;R&&e.defaultView?.location.assign(R)}}e.addEventListener("keydown",Nt);let Rs=kn(e,u=>{i=u,pr(),fo()}),Ts=o.armazem.aoMudarVisoes(()=>void o.armazem.lerVisoes().then(u=>{a=u}).catch(()=>{})),ur=new Map;function mr(){if(v||Io>0)return;let u=Go(e),f=new Map(u.processos.map(b=>[b.id,b])),h=!1;r=r.map(b=>{if(!b.naPaginaAtual)return b;let D=f.get(b.id);if(!D)return b;let C=be.get(b.id),R=at(e,b.id),j=ur.get(b.id);ur.set(b.id,R);let ao=$t(D);if(C){for(let eo of Object.keys(C))JSON.stringify(D[eo])===JSON.stringify(C[eo])&&delete C[eo];Object.keys(C).length?ao={...D,...C}:be.delete(b.id)}let re=JSON.stringify(ao)===JSON.stringify(b);return re&&j===R?b:(h=!0,re?b:ao)}),h&&(hr(),W())}let fr,Rt=e.defaultView?.MutationObserver,gr=Rt?new Rt(()=>{clearTimeout(fr),fr=setTimeout(mr,o.semDebounce?0:150)}):null,Tt=e.querySelector("#frmProcedimentoControlar")??e.body;gr&&Tt&&gr.observe(Tt,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["aria-pressed","aria-label","onmouseover","src","href","class"]});function hr(){let u=ns(e);$.textContent!==u&&($.textContent=u)}async function zs(){if(!o.fonte)return A=!0,zt(!0);m=!0,W();let u=()=>o.fonte?.restaurarAoSair?.();e.defaultView?.addEventListener("pagehide",u);let f=await pn(o.inicial,o.fonte,{sinal:I.signal,aoProgresso:h=>{g=h,Mt(ee().length)},aoSelecao:(h,b,D)=>{lr.set(No(h,b),D)},aoPagina:h=>{r=[...r,...h],W()}});e.defaultView?.removeEventListener("pagehide",u),m=!1,A=f.completo,f.erro&&(y=f.erro),zt(f.completo)}function zt(u){l=_r(l,r.map(f=>f.id),o.agora(),u),o.armazem.gravarIdade(l).catch(()=>{}),W()}async function _s(){try{let u=await o.armazem.lerEstado();t=u.visao,s=new Set(u.recolhidos),l=gn(u.idade,o.agora()),p=l.visitaAnterior,a=await o.armazem.lerVisoes()}catch{}l=_r(l,r.map(u=>u.id),o.agora(),!1),H&&await H.carregar(),z.value=t.busca,hr();for(let[u]of r.map(f=>[f.id]))ur.set(u,at(e,u));W(),zs();for(let u of[1200,3500])setTimeout(()=>{hr(),mr()},u).unref?.()}return{host:N,iniciar:_s,render:W,estado:()=>({visao:t,todos:r,selecionados:i,completo:A,carregando:m,filtrados:ee().length}),definirVisao:u=>{t={...t,...u},z.value=t.busca,W()},fechar(){v=!0,I.abort(),H?.fechar(),clearTimeout(P),clearTimeout(ir),clearTimeout(fr),gr?.disconnect(),Ot?.disconnect(),F(),e.removeEventListener("keydown",Nt),Rs(),Ts(),N.remove()},mostrar:u=>{N.hidden=!u},definirTema:u=>{N.setAttribute("data-tema",u?"escuro":"claro"),k.classList.toggle("spro-escuro",u)},definirNomesCompletos:u=>{wt=u,W()},definirFiltroExterno:u=>{let f=u.trim();f!==oe&&(oe=f,W())},sincronizar:mr,registrarSelecaoParaTeste:(u,f,h)=>void lr.set(No(u,f),h)}}var gs=`/* Dentro do Shadow DOM: o base.css do sei-comum (tokens) vem antes deste arquivo. */
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
.spro-rolagem { max-height: 68vh; overflow: auto; }
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
.spro-nova-guia { display: inline-flex; flex: none; align-items: center; justify-content: center; width: 22px; height: 22px; margin-left: 4px; color: var(--spro-suave); border-radius: 6px; opacity: 0; transition: opacity var(--spro-dur); }
.spro-linha:hover .spro-nova-guia, .spro-nova-guia:focus-visible { opacity: 1; }
.spro-nova-guia:hover { color: var(--spro-destaque); background: var(--spro-fundo-3); text-decoration: none; }

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
`;var hs=`/* Na p\xE1gina do SEI (fora do Shadow DOM): o bot\xE3o alternador e o espa\xE7o da grade. */
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
`;var nl="gradecontrole",bs="data-spro-pesquisa-rapida";function sl(){return new URL(location.href).searchParams.get("acao")==="procedimento_controlar"}var Wo=()=>{let o=Ft(document);return o?o==="escuro":!!document.body?.classList.contains("dark-mode")||jt(localStorage)},rr=null,xo=!1,U=null,Ao=null,Jo=null,vs=0,dt=!1,er=null,xs=null,_o=null,pt=document.readyState!=="loading";function il(){let o=document.querySelector(ln);return document.getElementById("divTabelaProcesso")??o?.parentElement??null}function Lo(o){Ao?.pronta(),U?.mostrar(!1),Re(document),o&&o!=="usuario"&&console.warn("[SEI Pro] Grade do controle indispon\xEDvel, usando a vis\xE3o nativa:",o)}function tr(){if(U||!xo)return;let o=new Ce(location.href,()=>se(document,location.href)),e=Mr(se(document,location.href)),r=e.unidade.id,t=En({local:br(chrome.storage.local,"local"),sync:br(chrome.storage.sync,"sync")},String(r),e.usuario.login);if(["hdnRecebidosPaginaAtual","hdnGeradosPaginaAtual","hdnDetalhadoPaginaAtual"].some(c=>document.getElementById(c)?.value&&document.getElementById(c).value!=="0")&&!sessionStorage.getItem("spro_grade_reset")){try{sessionStorage.setItem("spro_grade_reset","1")}catch{}Tr(o.http,se(document,location.href)).restaurar().then(()=>location.reload()).catch(()=>Lo("pagina intermediaria"));return}try{sessionStorage.removeItem("spro_grade_reset")}catch{}let n=Go(document);if(!n.processos.length&&!n.totais.recebidos&&!n.totais.gerados)return Ao?.pronta(),Lo("caixa vazia");let s=il();if(!s)return Lo("sem ponto de encaixe");let i=n.processos.filter(c=>!c.sigiloso&&c.naPaginaAtual).slice(0,6).map(c=>c.protocolo);U=fs({doc:document,inicial:n,agora:()=>Date.now(),hoje:()=>Fo(),eu:e.usuario.login||void 0,armazem:t,fonte:Tr(o.http,se(document,location.href),n.visao),mover:{marcador:async(c,l)=>void await wa(o,c,l,{aplicar:!0}),atribuir:async(c,l)=>void await Sa(o,c,l,{aplicar:!0})},acoes:()=>Ha(document),css:`${Bt}
${gs}`,escuro:Wo(),baixar:(c,l,p)=>Kt(c,l,p),novoId:()=>Ut(),extras:i.length?async()=>{let c=async g=>{let m;for(let A of i)try{return await ma(o,g,A)}catch(y){m=y}return console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${g}`,m instanceof Error?m.message:m),[]},[l,p]=await Promise.all([c("marcadores"),c("usuarios")]);return{marcadores:l.map(g=>g.nome),responsaveis:p.map(g=>{let[m,...A]=g.nome.split(" - ");return{sigla:m.trim(),nome:A.join(" - ").trim()||m.trim()}})}}:void 0,aoVoltarNativa:()=>me(),enviarAcao:(c,l)=>_a(document,c,l),editarEspecificacao:async(c,l)=>void await ha(o,c,{especificacao:l},{aplicar:!0}),abrirPrazo:c=>{document.documentElement.setAttribute("data-spro-prazos-alvo",c),document.dispatchEvent(new CustomEvent("spro-prazos-abrir"))},anotar:async(c,l)=>void await Ea(o,c,l,{aplicar:!0}),consultarAndamento:(c,l)=>Ia(o,c,{sigla:e.unidade.sigla,nome:e.unidade.nome},l),consultarDatasMarcadores:(c,l)=>dn(o,c,l)}),U.definirNomesCompletos(dt),cl(U),xs?.(),xs=Gt(document,()=>U?.definirTema(Wo())),s.before(U.host),ja(document,U.host),ll(),U.iniciar().then(()=>{Ao?.pronta(),To(document)&&Ir(document)}).catch(c=>Lo(String(c)))}function cl(o){_o?.disconnect();let e=()=>o.definirFiltroExterno(document.documentElement.getAttribute(bs)??"");e(),_o=new window.MutationObserver(e),_o.observe(document.documentElement,{attributes:!0,attributeFilter:[bs]})}function ll(){er?.disconnect();let o=window.MutationObserver,e=!1;er=new o(()=>{e||(e=!0,setTimeout(()=>{if(e=!1,!(!U||!xo||U.host.isConnected&&!!U.host.shadowRoot&&document.querySelectorAll("#spro-grade").length===1||vs>=6)){vs+=1,U.fechar(),U=null,_o?.disconnect(),_o=null;for(let t of document.querySelectorAll("#spro-grade"))t.remove();(To(document)||xo)&&tr()}},150))}),er.observe(document.body??document.documentElement,{childList:!0,subtree:!0})}function me(){rr&&(To(document)?(xo=!1,$e(localStorage,!1),U?.mostrar(!1),Re(document)):(xo=!0,$e(localStorage,!0),Ne(document,Wo()),U&&U.host.isConnected&&U.host.shadowRoot?(U.mostrar(!0),Ir(document)):(U&&(U.fechar(),U=null),Ao=Te(Lo),Ao.iniciarContagem(),tr())),Jo?.(),Jo=_e(document,()=>To(document),me))}function dl(o){o!==rr&&(rr=o,o?(pt&&(Jo??=_e(document,()=>To(document),me)),xo&&(Ne(document,Wo()),Ao??=Te(Lo),pt&&(Ao.iniciarContagem(),tr()))):(xo=!1,$e(localStorage,!1),Jo?.(),Jo=null,er?.disconnect(),_o?.disconnect(),_o=null,U?.fechar(),U=null,Ao?.pronta(),Re(document)))}function pl(){if(!sl())return;let o=document.createElement("style");o.textContent=hs,(document.head??document.documentElement).append(o),Xa(localStorage)&&(xo=!0,Ne(document,Wo()),Ao=Te(Lo)),Wa(document,me),Qa(document,Wo);let e=()=>{pt=!0,xo&&(Ao?.iniciarContagem(),tr()),rr&&(Jo??=_e(document,()=>To(document),me))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e();let r=a=>{dt=Ht(a,"nomesusuarios"),U?.definirNomesCompletos(dt),dl(Vt(a,nl))},t=!1;chrome.storage.onChanged.addListener((a,n)=>{n!=="sync"||!("dataValues"in a)||(t=!0,r(a.dataValues.newValue))}),chrome.storage.sync.get("dataValues").then(a=>{t||r(a.dataValues)}).catch(()=>{xo&&Lo("sem prefer\xEAncias")})}pl();})();
