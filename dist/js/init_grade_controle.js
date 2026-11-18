/* GERADO por grade-controle/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{function oi(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function gr(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(oi(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}var $t=o=>String(o).padStart(2,"0");function Fo(o=new Date){return`${o.getFullYear()}-${$t(o.getMonth()+1)}-${$t(o.getDate())}`}function Ae(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!e)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(e[1]),Number(e[2])-1,Number(e[3]),12)}function To(o,e){return Math.round((Ae(e).getTime()-Ae(o).getTime())/864e5)}function fo(o){let[e,r,t]=o.split("-");return`${t}/${r}/${e}`}function zt(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function _t(o,e){let r=zt(o,e);return!(r===!1||r===0||r==="")}function qt(o,e){let r=zt(o,e);return r===!0||r===1||r==="1"}function Vt(o){try{return!!o.getItem("darkModePro")}catch{return!1}}function Ht(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function Ft(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function"||!o.documentElement)return()=>{};let t=new r(e);return t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>t.disconnect()}function jt(o=crypto){if(typeof o.randomUUID=="function")return o.randomUUID();let e=o.getRandomValues(new Uint8Array(16));e[6]=(e[6]??0)&15|64,e[8]=(e[8]??0)&63|128;let r=[...e].map(t=>t.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var Gt=`/*
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
`;function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var go={fill:"currentColor",stroke:"none"},Ut="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Bt={estrela:[["path",{d:Ut}]],estrelaCheia:[["path",{d:Ut,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...go}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...go}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...go}],["circle",{cx:"12",cy:"12",r:"1.4",...go}],["circle",{cx:"19",cy:"12",r:"1.4",...go}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...go}],["circle",{cx:"15",cy:"6",r:"1.3",...go}],["circle",{cx:"9",cy:"12",r:"1.3",...go}],["circle",{cx:"15",cy:"12",r:"1.3",...go}],["circle",{cx:"9",cy:"18",r:"1.3",...go}],["circle",{cx:"15",cy:"18",r:"1.3",...go}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["path",{d:"M6.5 3.5h7l4 4v13h-11z"}],["path",{d:"M13.5 3.5v4h4"}],["path",{d:"M12 11.5v5M9.5 14h5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Zl=Object.keys(Bt);function _(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of Bt[o]){let c=r.createElementNS(t,s);for(let[l,u]of Object.entries(i))c.setAttribute(l,u);a.append(c)}return a}function Xt(o,e,r,t=1e4){let a=URL.createObjectURL(new Blob([e],{type:r})),n=d("a",{href:a,download:o});document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),t).unref?.()}var k=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Do(o){if(o instanceof k)return o;if(o instanceof DOMException&&o.name==="AbortError")return new k("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new k("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}var ri={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function B(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):ri[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Qt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Jt=null;function Ee(o){return Jt?Jt(o):new DOMParser().parseFromString(o,"text/html")}function q(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var ti={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function hr(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=ti[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function ye(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=hr(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function ho(o,e){let r=[],t=new RegExp(`\\b${e}\\(`,"g");for(let a of o.matchAll(t)){let[n]=ye(o,a.index+a[0].length);r.push(n)}return r}function V(o){return typeof o=="string"?B(o):o==null?"":String(o)}var ai=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Mo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(ai))e.add(r[0]);return[...e]}function J(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function no(o,e,r={}){let t=Array.isArray(o)?o:Mo(o);for(let a of t){let n=J(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function Kt(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=Mo(r).filter(s=>J(s).get("acao")===e),n=(t.length?t:Mo(o.html).filter(s=>J(s).get("acao")===e)).sort((s,i)=>[...J(s).keys()].length-[...J(i).keys()].length)[0];if(!n)throw new k("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function ni(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=ye(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=hr(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function si(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=ye(o,r.index+r[0].length);e.push({tipo:V(t[0]),idPai:V(t[2]),href:V(t[3]),titulo:V(t[5]),icone:V(t[6]),extra:t[8]==null?void 0:V(t[8])})}return e}function Wt(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Zt(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>V(e[1])))]}function Yt(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var ii=/\s*\(\d{5,}\)\s*$/;function ci(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=V(r.args[1]),a=V(r.args[5]),n=V(r.args[7]),s=(r.props.src??"").replace(/&amp;/g,"&"),i=e.find(p=>p.tipo==="ASSINATURA"&&p.idPai===t),{nivel:c,hipotese:l}=Wt(e,t),u=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:V(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(ii,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(s)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:u,nivel:c,hipotese:l,assinado:!!i,assinaturas:i?i.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(p=>p.tipo==="UNIDADE_GERADORA"&&p.idPai===t)?.extra,link:V(r.args[3]).replace(/&amp;/g,"&"),src:s,acoes:Mo(r.props.acoes??""),botoes:Zt(r.props.acoes??""),funcoes:Yt(r.props.acoes??"")}})}function li(o){let e=o.html,r=ni(e),t=si(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=V(a.args[1]),s=Wt(t,n),i=ci(r,t);return{idProcedimento:n,protocolo:V(a.args[5])||V(a.args[15]),tipo:V(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:Mo(a.props.acoes??""),botoesProcesso:Zt(a.props.acoes??""),funcoesProcesso:Yt(a.props.acoes??""),linkProcesso:V(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Mo(e),pagina:o}}async function oa(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new k("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=no(t.html,"procedimento_visualizar")&&Mo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return li(t)}function vo(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?no(t.acoes,e):null}return no(o.acoesProcesso,e)??no(o.links,e,{id_procedimento:o.idProcedimento})}function io(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var ee={publico:"0",restrito:"1"},Pe={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function re(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(B(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var aa="\xA5",br="\xB1";function ea(o){return o.map(e=>`${e.id}${br}${e.texto}`).join(aa)}function di(o){return o?o.split(aa).map(e=>{let[r,...t]=e.split(br);return{id:r,texto:t.join(br)}}):[]}function ra(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var j=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=ui(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,q(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${ta(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??q(t),texto:q(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=to(r),n=t.find(s=>s.valor===r)??t.find(s=>to(s.texto)===a)??vr(t.filter(s=>to(s.texto).includes(a)));if(!n)throw new k("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?di(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:ea(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new k("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new k("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${q(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??vr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??q(r)??e]:[e,e]}hiddenDaLupa(e){let r=ra(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of ra(this.pagina.html)){let t=this.elemento.querySelector(`select#${ta(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:q(n)}));(this.valor(r)??"")||this.definir({[r]:ea(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function ui(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(l=>l.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let l of c)e.push({nome:t,valor:l.getAttribute("value")??q(l)})}}return e}function to(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function xr(o,e,r){let t=to(e),a=o.find(n=>n.id===e)??o.find(n=>to(n.texto)===t)??vr(o.filter(n=>to(n.texto).includes(t)));if(!a)throw new k("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function vr(o){return o.length===1?o[0]:void 0}function ta(o){return o.replace(/([^\w-])/g,"\\$1")}var pi={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Se(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=pi[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var mi=/[A-Za-z0-9\-_.*]/;function na(o){let e="";for(let r of o)r===" "?e+="+":mi.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function sa(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${na(Se(r))}=${na(Se(t??"",a))}`}).join("&")}function ia(o){let e=r=>encodeURIComponent(Se(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var ca="application/x-www-form-urlencoded";function Ar(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=Qt[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var la="application/x-www-form-urlencoded; charset=ISO-8859-1";function Er(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let s of o.matchAll(a))n.set(s[1],s[2]);return n}async function fi(o,e,r){let t=vo(e,"documento_escolher_tipo");if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await j.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=j.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function gi(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,q(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=J(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,q(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function da(o,e,r){let t=await o.arvore(e,{sinal:r});return gi((await fi(o,t,r)).pagina)}var ua={tipos_processo:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selTipoProcedimento"},hipoteses_legais:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selHipoteseLegal"},usuarios:{acao:"procedimento_atribuicao_cadastrar",form:"#frmAtividadeAtribuir",campo:"selAtribuicao"},marcadores:{acao:"andamento_marcador_gerenciar",form:"#frmAndamentoMarcadorCadastro",campo:"selMarcador"},grupos_acompanhamento:{acao:"acompanhamento_gerenciar",form:"#frmAcompanhamentoCadastro",campo:"selGrupoAcompanhamento"}};async function pa(o,e,r,t={}){let a;if(e==="tipos_documento")a=(await da(o,r,t.sinal)).map(s=>({id:s.id,nome:s.nome}));else{let s=ua[e];if(!s)throw new k("ARGUMENTO_INVALIDO",`Lista desconhecida: ${e}.`,Object.keys(ua).concat("tipos_documento").join(" | "));let i=await o.arvore(r,{sinal:t.sinal}),c=vo(i,s.acao);if(!c)throw new k("SEI_ACAO_INDISPONIVEL",`Para listar ${e} use um processo aberto na sua unidade.`);if(e==="marcadores"&&(c=no((await o.http.obter(c,{sinal:t.sinal,aceitarValidacao:!0})).html,"andamento_marcador_cadastrar"),!c))throw new k("SEI_VERSAO_NAO_SUPORTADA","Tela de marcadores n\xE3o reconhecida.");let l=await j.abrir(o.http,c,s.form,{sinal:t.sinal,aceitarValidacao:!0});a=e==="hipoteses_legais"?(await re(o,l,"1",t.sinal)).map(u=>({id:u.id,nome:u.texto})):l.opcoes(s.campo).filter(u=>u.valor&&u.valor!=="null"&&u.texto).map(u=>({id:u.valor,nome:u.texto}))}let n=t.filtro?to(t.filtro):"";return n?a.filter(s=>to(s.nome).includes(n)):a}function ma(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function hi(o,e,r){let t=vo(e,"procedimento_alterar"),a=t??vo(e,"procedimento_consultar");if(!a)throw new k("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await j.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function we(o){return o.map(e=>e.texto).filter(Boolean)}function fa(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let s=r.get(n.id);if(s!==void 0&&!a.has(n.id))throw new k("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${s}.`)}}async function ga(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await hi(o.http,a,{sinal:t.sinal});if(!s)throw new k("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...io("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let l=ma(n,"selTipoProcedimento"),u=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:u.valor}),i.push(...io("Tipo",l,u.texto))}if(r.nivel!==void 0){let l=Pe[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:ee[r.nivel]}),i.push(...io("N\xEDvel de acesso",l,Pe[ee[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let l=ma(n,"selHipoteseLegal"),u=n.valor("rdoNivelAcesso")||ee.restrito,p=xr(await re(o,n,u,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:p.id}),i.push(...io("Hip\xF3tese legal",l,p.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new k("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(i.push(...io("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let l=n.itensLupa("selInteressadosProcedimento");fa(l,r.interessados,Er(n.pagina.html,"interessado"),"Interessado"),i.push(...io("Interessados",we(l).join("; "),we(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new k("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let l=n.itensLupa("selAssuntos");fa(l,r.assuntos,Er(n.pagina.html,"assunto"),"Assunto"),i.push(...io("Assuntos",we(l).join("; "),we(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:l=>J(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}async function ba(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function va(o,e,r){let t=vo(o,e);if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var xa=o=>e=>J(e.url).get("acao")!==o;async function bi(o,e,r,t){let a=await o.http.obter(va(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return j.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>no(a.html,s)).find(Boolean);if(!n)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return j.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Aa(o,e,r,t){let a=await ba(o,e,t.sinal),n=await bi(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??xa(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Ea(o,e,r,t){return Aa(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=io("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...io("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function ya(o,e,r,t){return Aa(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(l=>l.valor===a.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=to(r),i=a.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=i.find(l=>l.valor===r)??i.find(l=>to(l.texto.split(" - ")[0])===s)??i.find(l=>to(l.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(l=>to(l.texto).includes(s)).length===1?i.find(l=>to(l.texto).includes(s)):void 0);if(!c)throw new k("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(l=>l.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),io("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}async function vi(o,e,r){let t=va(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function ha(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:q(t[1]),texto:q(t[2]),usuario:q(t[3]),data:q(t[4])}})}async function Pa(o,e,r,t){let a=await ba(o,e,t.sinal),n=await vi(o,a,t.sinal),s=ha(n),i=to(r.marcador),c=s.find(m=>to(m.marcador)===i),l={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...l,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=no(n.html,"andamento_marcador_remover");if(!m)throw new k("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let v=j.de(n,"#frmGerenciarMarcador",o.http);v.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let x=await o.http.enviar(m,v.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(ha(x).some(M=>M.id===c.id))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let u;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))u=j.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=no(n.html,"andamento_marcador_cadastrar");if(!m)throw new k("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");u=await j.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let p=u.escolher("selMarcador",r.marcador);return u.definir({hdnIdMarcador:p.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?io(`Texto do marcador ${p.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${p.texto}${r.texto?`: ${r.texto}`:""}`}],l.mudancas.length?t.aplicar?(await u.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:xa("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${p.texto}" aplicado em ${a.protocolo}.`}):{...l,resumo:`Vai marcar ${a.protocolo} com "${p.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function xi(){let o=globalThis,e=o.wrappedJSObject??o.window?.wrappedJSObject,r=o.exportFunction;return!e||typeof r!="function"?null:{pagina:e,exportFunction:t=>r(t,e)}}function Ai(o,e){if(!e.pagina.Object)return o;let r=new e.pagina.Object;for(let[t,a]of Object.entries(o))a!==void 0&&(r[t]=a);return r}function Sa(o,e,r,t,a=xi()){if(!a)return r?o.request(e,r,t):o.request(e,t);let n=null,{pagina:s,exportFunction:i}=a,c=i(u=>new s.Promise(i(p=>{t(u).then(m=>{n={ok:!0,valor:m},p()},m=>{n={ok:!1,erro:m},p()})}))),l=r?o.request(e,Ai(r,a),c):o.request(e,c);return Promise.resolve(l).then(()=>{let u=n;if(!u)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(u.ok)return u.valor;throw u.erro})}var Ei="seipro-historico-sessao",yr="seiProHistoricoRestauro",yi=600*1e3,wa;function Pr(){if(wa!==void 0)return wa;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Da(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};Pr()?.setItem(yr,JSON.stringify(t))}catch{}}function Me(){try{Pr()?.removeItem(yr)}catch{}}function Sr(o,e=Date.now()){try{let r=Pr()?.getItem(yr);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>yi?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var Ma=Promise.resolve();function Oa(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return Sa(r,Ei,e?{signal:e}:null,()=>o()).catch(n=>{throw Do(n)});let t=Ma.then(()=>{if(e?.aborted)throw Do(new DOMException("cancelado","AbortError"));return o()});return Ma=t.catch(()=>{}),t}var Ca={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},cu=120*1e3;function La(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}var Pi={resumido:"R",completo:"P",total:"T"},Ia=500,Si=2e3;function ka(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function wi(o){let e=[...o.querySelectorAll("td")],r=q(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=q(e[3]),s={data:r,unidade:q(e[1]),...t?{unidadeNome:t}:{},usuario:q(e[2]),descricao:n},i=La(r);i&&(s.dataISO=i),a&&(s.usuarioNome=a),o.classList.contains("andamentoAberto")&&(s.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let l=q(c);/^\d+$/.test(l)&&(s.nrSei=l);let u=J(c.getAttribute("href")??"").get("id_documento");u&&(s.idDocumento=u)}if(ka(n).startsWith(ka(Ca.remetidoPrefixo))){let l=e[3]?.querySelector("a.ancoraSigla"),u=q(l);u&&(s.unidadeCitada=u);let p=l?.getAttribute("title")??"";p&&(s.unidadeCitadaNome=p)}return s}function wr(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(q(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(wi),total:r}}async function Ra(o,e,r={}){let t=await Di(o,e,{tipo:Pi[r.tipo??"resumido"],limite:r.limite??Ia,sinal:r.sinal});return{total:t.total,andamentos:t.andamentos.slice(0,r.limite??Ia)}}function jo(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function Mr(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(q(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Na(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function Mi(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let s=0;s<=a&&s+n<=t.length;s+=1){let i=!0;for(let c=0;c<n;c+=1)if(Na(t[s+c])!==Na(o.andamentos[c])){i=!1;break}if(i)return[...t.slice(0,s),...o.andamentos]}return null}async function Di(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=Oi(o,t,r);return a||await Oa(()=>Ci(o,e,r),r.sinal)}catch(t){throw Do(t)}}function Oi(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(jo(e,"hdnTipoHistorico")||"R")!==r.tipo||(jo(e,"hdnInfraPaginaAtual")||"0")!=="0"||Sr(o.http.base.host))return null;let{itens:t,total:a}=wr(e);return Mr(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:jo(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Ta(o,e,r){await j.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function Ci(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",q(a.doc.querySelector("title")));let n=Sr(t);if(n){try{await Ta(o,a,n),Me()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let s={tipo:jo(a,"hdnTipoHistorico")||"R",pagina:jo(a,"hdnInfraPaginaAtual")||"0"},i=s,c=!1,l=async(u,p)=>{c||(Da(t,s),c=!0);let m={tipo:r.tipo,pagina:String(p)},v=await j.de(u,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:m.tipo,hdnInfraPaginaAtual:m.pagina}).enviar({sinal:r.sinal});return i=m,v};try{let u=s.tipo===r.tipo&&s.pagina==="0"?a:await l(a,0);if(!u.doc.querySelector("#tblHistorico"))throw new k("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",q(u.doc.querySelector("title")));let p=wr(u),m=jo(u,"hdnInfraHashCriterios"),v=p.total,x=v?Math.min(v,r.limite):r.limite,M=Mi(r.cache,m,v,p.itens);if(M)return r.aoProgresso?.(1,1),{andamentos:M,total:v,hash:m,completo:!0,aproveitouCache:!0};let b=[...p.itens],C=p.itens.length,O=u.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,h=O>0?O:v>C&&C>0?Math.ceil(v/C):1;r.aoProgresso?.(1,h);for(let D=1;b.length<x&&Mr(u)&&D<Si;D+=1){u=await l(u,D);let w=wr(u);if(!w.itens.length)break;b.push(...w.itens),r.aoProgresso?.(D+1,Math.max(h,D+1))}let S=v?b.length>=v:!Mr(u);return{andamentos:b,total:v||b.length,hash:m,completo:S,aproveitouCache:!1}}finally{if(c)if(i.tipo!==s.tipo||i.pagina!==s.pagina)try{await Ta(o,a,s),Me()}catch{}else Me()}}function $a(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}`:void 0}var Li=["Processo recebido na unidade","Reabertura do processo na unidade"],za=/^Processo (?:p\u00FAblico|restrito|sigiloso) gerado/i,Ii=/^Processo remetido pela unidade\s+(.+)$/i;function ki(o,e){return o.unidade.trim()===e.sigla.trim()&&e.sigla.trim()?!0:!!e.nome?.trim()&&o.unidadeNome?.trim()===e.nome.trim()}function _a(o,e){let r=typeof e=="string"?{sigla:e}:e,t={},a=o.filter(i=>za.test(i.descricao.trim())),n=a[a.length-1],s=n?$a(n.data):void 0;s&&(t.autuacao=s);for(let i of o){if(!ki(i,r))continue;let c=i.descricao.trim(),l=$a(i.data);if(l&&(!t.recebimento&&(Li.includes(c)||za.test(c))&&(t.recebimento=l),!t.envio)){let u=Ii.exec(c);u&&(t.envio=l,t.unidadeEnvio=u[1].trim())}}return t}var Dr=[["hoje","Hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["trimestre","Nos \xFAltimos 90 dias"],["antigo","H\xE1 mais de 90 dias"],["sem","Sem informa\xE7\xE3o"]];function qa(o,e){if(!o)return"sem";let r=To(o,e);return Number.isNaN(r)||r<0?"sem":r<1?"hoje":r<=7?"semana":r<=30?"mes":r<=90?"trimestre":"antigo"}var Or=1440*6e4,te=(o,e)=>e-o.consultadoEm>=0&&e-o.consultadoEm<Or;var De=class extends Error{sessao=!0},Ni=2,Ti=250,Ri=5,$i=o=>new Promise(e=>setTimeout(e,o));async function Va(o){let e=[...o.alvos],r=o.esperar??$i,t={feitos:0,total:e.length,semDados:0},a="concluida",n=0,s=o.limiteErros??Ri;async function i(){for(;a==="concluida";){if(o.sinal.aborted){a="cancelada";return}let c=e.shift();if(!c)return;try{let l=await o.consultar(c,o.sinal);n=0,t.feitos+=1,l||(t.semDados+=1),o.aoResolver(c,l,{...t},!1)}catch(l){if(o.sinal.aborted){a="cancelada";return}if(l.sessao){a="sessao";return}if(n+=1,t.feitos+=1,t.semDados+=1,o.aoResolver(c,null,{...t},!0),n>=s){a="erros";return}}e.length&&await r(o.pausaMs??Ti)}}return await Promise.all(Array.from({length:Math.max(1,o.simultaneas??Ni)},()=>i())),{motivo:a,progresso:t}}var zi=500;async function Ha(o,e,r,t){if(!e.link)return null;try{let a=await o.http.obter(e.link,{sinal:t});if(!/acao=procedimento_visualizar/.test(a.url)){let c=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)return null;a=await o.http.obter(c.replace(/&amp;/g,"&"),{sinal:t})}let n=no(a.html,"procedimento_consultar_historico");if(!n)return null;let{andamentos:s}=await Ra(o,n,{tipo:"resumido",limite:zi,sinal:t}),i=_a(s,r);return Object.keys(i).length?i:null}catch(a){if(a instanceof k&&a.codigo==="SEI_SESSAO_EXPIRADA")throw new De(a.message);if(a instanceof k&&(a.codigo==="SEI_SIGILOSO"||a.codigo==="SEI_ACAO_INDISPONIVEL"||a.codigo==="SEI_NAO_ENCONTRADO"))return null;throw a}}function Fa(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Ee(r)}}}function ja(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new k("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new k("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=q(r);throw new k("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new k("SEI_VALIDACAO",r,r)}return o}function Ga(o,e={}){let r=new URL(".",o),t=e.fetch??((...p)=>fetch(...p)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(p){n>=a&&await new Promise(m=>s.push(m)),n+=1;try{return await p()}finally{n-=1,s.shift()?.()}}let c=p=>new URL(p.replace(/&amp;/g,"&"),r).href;async function l(p,m,v){return i(async()=>{try{let x=await t(c(p),{credentials:"same-origin",redirect:"follow",...m,signal:v.sinal}),M=Ar(await x.arrayBuffer());return ja(Fa(x.url||c(p),x.status,M),v)}catch(x){throw Do(x)}})}async function u(p,m={}){return i(async()=>{try{let v=await t(c(p),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),x=new Uint8Array(await v.arrayBuffer()),M=(v.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();M==="text/html"&&ja(Fa(v.url||c(p),v.status,Ar(x)),m);let b=v.headers?.get("content-disposition")??"",C=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(b)?.[1]??/filename="?([^";]+)"?/i.exec(b)?.[1]??"");return{bytes:x,tipo:M,nome:C}}catch(v){throw Do(v)}})}return{base:r,absoluta:c,baixar:u,obter:(p,m={})=>l(p,{method:"GET"},m),enviar:(p,m,v={})=>l(p,v.utf8?{method:"POST",headers:{"Content-Type":ca},body:ia(m)}:{method:"POST",headers:{"Content-Type":la},body:sa(m,v.modos)},v)}}function _i(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function qi(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Cr(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=_i(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:qi(o),sigla:q(r)||q(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var Vi=3e4,Oe=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ga(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new k("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Cr(this.base())}linkMenu(e){return Kt(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new k("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=j.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=J(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new k("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let u=J(B(c)).get("id_procedimento")??"",p=i.get("id_protocolo")??"",m={idProcedimento:u,idDocumento:p&&p!==u?p:void 0,linkArvore:B(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<Vi)return a.arvore;let n=await oa(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:B(s[1]),texto:B(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=Ee(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function ae(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var Ua={recebidos:"Recebidos",gerados:"Gerados",detalhado:"Detalhado"},Ro=(o,e)=>`${o}:${e}`;function Ba(o,e,r="resumida"){let t={},a=r==="detalhada"?["detalhado"]:["recebidos","gerados"];for(let n of a){let s=n==="detalhado"?[...o]:o.filter(p=>p.grupo===n);if(!s.length)continue;let i=[...new Set(s.map(p=>p.pagina))].sort((p,m)=>p-m),c=n==="detalhado"?"na lista":`em ${Ua[n]}`;if(i.length>1){let p=i.map(m=>m+1).join(" e ");return{ok:!1,motivo:`O SEI s\xF3 aceita, de uma vez, processos de uma mesma p\xE1gina ${c} (marcados nas p\xE1ginas ${p}). Deixe s\xF3 uma p\xE1gina marcada.`}}let l=i[0],u=e.get(Ro(n,l));if(!u?.itens||!u.hash)return{ok:!1,motivo:`Os dados da p\xE1gina ${l+1} ainda n\xE3o foram lidos. Espere o carregamento terminar.`};t[n]={ids:s.map(p=>p.id),pagina:l,selecao:u}}return{ok:!0,plano:{porGrupo:t,todosNaPaginaAtual:o.every(n=>n.naPaginaAtual)}}}function Hi(o){let e={},r=o.porGrupo.detalhado?["detalhado"]:["recebidos","gerados"];for(let t of r){let a=o.porGrupo[t],n=Ua[t];if(e[`hdn${n}ItemId`]="",!a){e[`hdn${n}ItensSelecionados`]="";continue}e[`hdn${n}ItensSelecionados`]=a.ids.join(","),e[`hdn${n}Itens`]=a.selecao.itens,e[`hdn${n}ItensHash`]=a.selecao.hash}return e}function Xa(o,e,r){let t=o.getElementById("frmProcedimentoControlar");if(!t)throw new Error("Formul\xE1rio do Controle de Processos n\xE3o encontrado.");let a=o.createElement("form");a.setAttribute("method","post"),a.setAttribute("action",e),a.style.display="none";let n=new Map;for(let s of Array.from(t.querySelectorAll("input, select, textarea")))!s.name||s.disabled||s.type==="checkbox"||s.type==="radio"||s.type==="button"||s.type==="submit"||n.set(s.name,s.value);for(let[s,i]of Object.entries(Hi(r)))n.set(s,i);for(let[s,i]of n){let c=o.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",s),c.setAttribute("value",i),a.append(c)}o.body.append(a),a.submit()}var Qa=o=>o.some(e=>e.sigiloso);var Fi='a[onclick*="acaoControleProcessos"]';function Ja(o){let e=/acaoControleProcessos\(\s*'([^']*)'\s*,\s*(true|false)\s*,\s*(true|false)/.exec(o.elemento.getAttribute("onclick")??"");return e?{url:e[1].replace(/&amp;/g,"&"),requerSelecao:e[2]==="true",aceitaSigiloso:e[3]==="true"}:null}function Ka(o){let e=new Set,r=[];for(let t of o.querySelectorAll(Fi)){let a=/[?&]acao=([a-z0-9_]+)/.exec(t.getAttribute("onclick")??"")?.[1],n=t.querySelector("img");if(!a||!n||e.has(a))continue;e.add(a);let s=n.getAttribute("title")||n.getAttribute("alt")||a,i=n.getAttribute("src")??"";try{i=new URL(i,o.baseURI||o.location?.href).href}catch{}r.push({acao:a,rotulo:s,icone:i,elemento:t})}return r}var ji="data-spro-recolhido",Gi=".collapseTabelaProcesso";function Ui(o){let e=[...o.querySelectorAll(Gi)].filter(r=>r.id!=="spro-grade");return e.length>0&&e.some(r=>r.classList.contains("displayNone"))}function Wa(o,e,r=o.defaultView?.MutationObserver){let t=()=>e.toggleAttribute(ji,Ui(o));if(t(),!r)return()=>{};let a=new r(t);return a.observe(o.body??o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0}),()=>a.disconnect()}var Bi=/^\s*\[( |x|X)\]\s?(.*)$/;function ne(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=Bi.exec(e);return r?{marca:r[1]!==" ",texto:r[2]}:{marca:null,texto:e}})}function Za(o){return o.map(e=>e.marca===null?e.texto:`${e.marca?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Lr(o,e){let r=new Set(e.filter(a=>a>=0&&a<o.length));if(!r.size)return[...o];let t=[...r].every(a=>o[a].marca!==null);return o.map((a,n)=>r.has(n)?{...a,marca:t?null:a.marca??!1}:a)}function Ya(o,e){return o.map((r,t)=>t===e&&r.marca!==null?{...r,marca:!r.marca}:r)}function on(o){return ne(o).filter(e=>e.marca!==null||e.texto.trim()).map(e=>e.marca===null?e.texto:`${e.marca?"\u2611":"\u2610"} ${e.texto}`).join(" / ")}var Le="data-tip",en="data-tip-nota",Xi="data-tip-autor",Ce=0,Qi=`
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
`,rn=o=>o.nodeType===1,Ji=o=>o.some(e=>rn(e)&&(e.id==="spro-grade"||e.classList.contains("spro-grade-botao")));function Ir(o){if(!Ji(o))return null;for(let e of o)if(rn(e)){if(e.id==="spro-grade")return null;if(e.hasAttribute(Le)||e.hasAttribute(en)||e.hasAttribute("title"))return e}return null}function $o(o){let e=o.getAttribute("title");return e&&(o.hasAttribute(Le)||o.setAttribute(Le,e),!o.hasAttribute("aria-label")&&!(o.textContent??"").trim()&&o.setAttribute("aria-label",e.split(`
`)[0]),o.removeAttribute("title")),o.getAttribute(Le)??""}function Ki(o,e,r){let t=o.ownerDocument,a=t.createElement("div");a.className="nota";for(let n of ne(e)){if(n.marca===null&&!n.texto.trim())continue;let s=t.createElement("div");s.className="nota-l",n.marca!==null&&s.setAttribute("data-t",n.marca?"x":"o"),s.textContent=n.texto,a.append(s)}if(r){let n=t.createElement("div");n.className="nota-autor",n.textContent=r,a.append(n)}o.replaceChildren(a)}var kr=null;function tn(o){let e=a=>{if(a.nodeType!==1)return;let n=a;n.hasAttribute("title")&&$o(n);for(let s of Array.from(n.querySelectorAll("[title]")))$o(s)};if(e(o.nodeType===11?o.host:o),o.nodeType===11)for(let a of Array.from(o.querySelectorAll("[title]")))$o(a);let r=(o.ownerDocument??o).defaultView?.MutationObserver;if(!r)return()=>{};let t=new r(a=>{for(let n of a)if(n.type==="attributes")e(n.target);else for(let s of Array.from(n.addedNodes))e(s);kr?.()});return t.observe(o,{attributes:!0,attributeFilter:["title"],childList:!0,subtree:!0}),()=>t.disconnect()}function Wi(o){let e=[],r=o;for(;r;)e.push(r),r=r.nodeType===11?r.host??null:r.parentNode;return e}function Zi(o,e,r){let a=o.bottom+8,n=!1;a+e.altura>r.h-4&&o.top-8-e.altura>=4&&(a=o.top-8-e.altura,n=!0);let s=o.left+o.width/2-e.largura/2;return s=Math.max(4,Math.min(s,r.w-e.largura-4)),{x:Math.round(s),y:Math.round(Math.max(4,a)),acima:n}}function an(o,e=()=>!1){let r=o.defaultView;if(!r)return()=>{};let t=o.createElement("div");t.id="spro-dica-host";let a=t.attachShadow({mode:"open"}),n=o.createElement("style");n.textContent=Qi;let s=o.createElement("div");s.className="dica",s.setAttribute("role","tooltip"),s.hidden=!0,s.setAttribute("popover","manual"),a.append(n,s),o.documentElement.append(t);let i=null,c,l=!1,u=null;function p(){clearTimeout(c),i=null,l=!1,s.classList.remove("on"),s.hidden=!0;try{s.matches?.(":popover-open")&&s.hidePopover()}catch{}}function m(){if(!i||!i.isConnected)return x();let O=i.getAttribute(en),h=O!==null?O:$o(i);if(!h)return p();O!==null?Ki(s,O,i.getAttribute(Xi)??""):s.textContent=h,s.classList.toggle("claro",!e()),s.hidden=!1;try{typeof s.showPopover=="function"&&!s.matches(":popover-open")&&s.showPopover()}catch{}let S=i.getBoundingClientRect(),D=s.getBoundingClientRect(),w=Zi(S,{largura:D.width,altura:D.height},{w:r.innerWidth,h:r.innerHeight});s.style.left=`${w.x}px`,s.style.top=`${w.y}px`,s.classList.add("on"),l=!0}function v(O,h){let S=o.elementFromPoint(O,h);for(let D=0;D<4&&S?.shadowRoot;D++){let w=S.shadowRoot.elementFromPoint(O,h);if(!w||w===S)break;S=w}return S}function x(){if(!u)return p();let O=v(u.x,u.y),h=O?Ir(Wi(O)):null;if(h===i&&i?.isConnected)return;let S=l;p(),h&&($o(h),i=h,S||Ce===0?m():c=setTimeout(m,Ce))}kr=()=>{i&&!i.isConnected&&x()};let M=O=>{let h=O;typeof h.clientX=="number"&&(u={x:h.clientX,y:h.clientY});let S=Ir(O.composedPath());S===i&&i?.isConnected||(p(),S&&($o(S),i=S,Ce>0?c=setTimeout(m,Ce):m()))},b=O=>{let h=Ir(O.composedPath());!h||!h.matches?.(":focus-visible")||(p(),$o(h),i=h,m())},C=()=>p();return o.addEventListener("pointerover",M,!0),o.addEventListener("mouseover",M,!0),o.addEventListener("pointermove",M,!0),o.addEventListener("mousemove",M,!0),o.addEventListener("focusin",b,!0),o.addEventListener("focusout",p,!0),o.addEventListener("pointerdown",p,!0),o.addEventListener("keydown",p,!0),o.addEventListener("scroll",p,!0),o.documentElement.addEventListener("pointerleave",C),()=>{p(),kr=null,o.removeEventListener("pointerover",M,!0),o.removeEventListener("mouseover",M,!0),o.removeEventListener("pointermove",M,!0),o.removeEventListener("mousemove",M,!0),o.documentElement.removeEventListener("pointerleave",C),o.removeEventListener("focusin",b,!0),o.removeEventListener("focusout",p,!0),o.removeEventListener("pointerdown",p,!0),o.removeEventListener("keydown",p,!0),o.removeEventListener("scroll",p,!0),t.remove()}}var so="data-spro-grade",xo="data-spro-grade-pronta",se="data-spro-grade-escuro",Nr="spro_grade",Tr="spro-grade-pre";var Yi="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function oc(){let o=Yi.split(", ").map(t=>`html[${so}] ${t}`).join(`,
`),e=`html[${so}]:not([${xo}]) #divTabelaProcesso::before,
html[${so}]:not([${xo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before`,r=["#divFiltro","#newFiltro","#processosProActions"].map(t=>`html[${so}] ${t}`).join(`,
`);return`${o} { display: none !important; }
/* Com a grade pronta, o container nativo das tabelas (min-height: 200px) so deixaria um vazio entre a grade e o painel de baixo. */
html[${so}][${xo}] #divTabelaProcesso { display: none !important; }
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
html[${so}][${se}]:not([${xo}]) #divTabelaProcesso::before,
html[${so}][${se}]:not([${xo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { --spro-sk: #2c333b; --spro-sk-2: #232a31; }
@keyframes spro-grade-pulso { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  html[${so}]:not([${xo}]) #divTabelaProcesso::before,
  html[${so}]:not([${xo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { animation: none; }
}`}function nn(o){try{return o.getItem(Nr)==="1"}catch{return!1}}function Ie(o,e){try{e?o.setItem(Nr,"1"):o.removeItem(Nr)}catch{}}function ke(o,e){let r=o.documentElement;if(r.setAttribute(so,"1"),r.removeAttribute(xo),e?r.setAttribute(se,"1"):r.removeAttribute(se),!o.getElementById(Tr)){let t=o.createElement("style");t.id=Tr,t.textContent=oc(),(o.head??r).append(t)}}function Ne(o){let e=o.documentElement;e.removeAttribute(so),e.removeAttribute(xo),e.removeAttribute(se),o.getElementById(Tr)?.remove()}var zo=o=>o.documentElement.hasAttribute(so);function Rr(o){o.documentElement.setAttribute(xo,"1")}function Te(o,e={setTimeout:(r,t)=>setTimeout(r,t),clearTimeout:r=>clearTimeout(r)}){let r=!1,t,a=s=>{r||(r=!0,e.clearTimeout(n),e.clearTimeout(t),o(s))},n=e.setTimeout(()=>a("teto"),1e4);return{iniciarContagem(){r||(t=e.setTimeout(()=>a("prazo"),1500))},pronta(){r=!0,e.clearTimeout(n),e.clearTimeout(t)},falhou:s=>a(s),encerrada:()=>r}}var sn="http://www.w3.org/2000/svg",ec={grade:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M3.5 9.5h17M9 9.5v10M3.5 14.5h17"}]],quadro:[["rect",{x:"3.5",y:"4.5",width:"4.6",height:"15",rx:"1.2"}],["rect",{x:"9.7",y:"4.5",width:"4.6",height:"9",rx:"1.2"}],["rect",{x:"15.9",y:"4.5",width:"4.6",height:"12",rx:"1.2"}]],lista:[["path",{d:"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"}]],agrupar:[["path",{d:"M4 6h16M4 12h10M4 18h13"}],["path",{d:"M18 10l3 2-3 2"}]],colunas:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M9.2 4.5v15M14.8 4.5v15"}]],disquete:[["path",{d:"M5 4.5h11l3.5 3.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"}],["path",{d:"M8 4.5v5h7v-5M8 20v-6h8v6"}]],densidade:[["path",{d:"M4 6h16M4 10h16M4 14h16M4 18h16"}]],semPessoa:[["circle",{cx:"12",cy:"8.5",r:"3.6"}],["path",{d:"M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5M4 4l16 16"}]],olhoFechado:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}],["path",{d:"M4 4l16 16"}]],recebido:[["path",{d:"M4 13.5l2.2-7A1.6 1.6 0 0 1 7.7 5.4h8.6a1.6 1.6 0 0 1 1.5 1.1l2.2 7"}],["path",{d:"M4 13.5V18a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18v-4.5h-4.6a3.4 3.4 0 0 1-6.8 0z"}]],gerado:[["path",{d:"M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z"}],["path",{d:"M14 3.5V7.5h4M9.5 14.5h5M9.5 17h3"}],["path",{d:"M9.5 11.5l2-2 2 2M11.5 9.5v3.5"}]],novaGuia:[["path",{d:"M14 4.5h5.5V10M19.5 4.5L11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],prioridade:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 7.5v5.5M12 16.4h.01"}]],seta:[["path",{d:"M6 9l6 6 6-6"}]],setaDireita:[["path",{d:"M9 6l6 6-6 6"}]],desfazer:[["path",{d:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"}]],bloquear:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],informacao:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 11v5M12 8h.01"}]]};function uo(o,e=16,r=document){let t=r.createElementNS(sn,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[n,s]of Object.entries(a))t.setAttribute(n,s);for(let[n,s]of ec[o]){let i=r.createElementNS(sn,n);for(let[c,l]of Object.entries(s))i.setAttribute(c,l);t.append(i)}return t}var Re="spro-grade-botao",rc="#processosSEIPro .titlePanelHome, #processosSEIPro #divInfraBarraLocalizacao, #divInfraBarraLocalizacao.titlePanelHome, #divInfraBarraLocalizacao",tc="Usar o Novo Controle de Processos",ac="Voltar \xE0 vis\xE3o nativa do SEI";function nc(o,e,r){let t=o.querySelector(rc);if(!t)return!1;let a=e?ac:tc,n=t.querySelector(`.${Re}`);n||(n=o.createElement("button"),n.type="button",n.className=Re,n.append(uo("grade",18,o)),t.append(n));let s=[...t.children].filter(i=>i.classList.contains("spro-pnl-botao")).at(-1);return s&&s.compareDocumentPosition(n)&2&&s.after(n),n.setAttribute("data-tip",a),n.removeAttribute("title"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",String(e)),!0}function ln(o,e){let r=t=>{(t.composedPath?.()[0]??t.target)?.closest?.(`.${Re}`)&&(t.preventDefault(),t.stopPropagation(),e())};return o.addEventListener("click",r,!0),()=>o.removeEventListener("click",r,!0)}var cn=o=>{for(let e of o.querySelectorAll(`.${Re}`))e.remove()};function $e(o,e,r){let t=()=>nc(o,e(),r);t();let a=o.defaultView?.MutationObserver;if(!a||!o.body)return()=>cn(o);let n=!1,s=new a(()=>{n||(n=!0,queueMicrotask(()=>{n=!1,s.disconnect(),t(),s.observe(o.body,{childList:!0,subtree:!0})}))});return s.observe(o.body,{childList:!0,subtree:!0}),()=>{s.disconnect(),cn(o)}}function K(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var sc=/<div(?: style="text-decoration: line-through;")?><i class="(far fa-square|fas fa-check-square)"><\/i> ?([\s\S]*?)<\/div>/g;function ic(o){return o.includes("<div")?o.replace(sc,(e,r,t)=>`
${r==="far fa-square"?"[ ]":"[X]"} ${t}
`).replace(/\n{2,}/g,`
`).trim():o}var cc=/^Anota[\u00e7c][\u00e3a]o( com prioridade)?\s+\/\s+([\s\S]*)\s+\/\s+(.*)$/i;function dn(o){let e=o.querySelector('a[href*="acao=anotacao_registrar"]');if(!e)return null;let r=e.querySelector("img")?.getAttribute("src")??"",t=/anotacao2\.|prioridade/i.test(r),a=cc.exec(e.getAttribute("aria-label")??"");if(a){let i=B(a[2]).replace(/\r\n?/g,`
`).trim();return i?{texto:i,autor:a[3].trim(),prioridade:!!a[1]||t}:null}let n=ho(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];if(typeof n?.[0]!="string")return null;let s=ic(V(n[0])).trim();return s?{texto:s,autor:V(n[1]).trim(),prioridade:t}:null}function un(o,e,r){if(e){let a={idProcedimento:o,origem:"nativo",vencimento:e.data,idControlePrazo:e.idControlePrazo,sigla:e.sigla,linkNativo:e.link,...e.concluidoEm?{concluidoEm:e.concluidoEm}:{}};return r?.vencimento&&r.data===e.data?{...a,origem:"ambos",hora:r.hora,texto:r.texto||void 0}:a}if(!r)return null;let t={idProcedimento:o,origem:"marcador",hora:r.hora,texto:r.texto||void 0};return r.vencimento?{...t,vencimento:r.data}:{...t,inicio:r.data}}var lc='a[href*="acao=controle_prazo_definir"]',dc=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,pn=(o,e,r)=>`${r}-${e}-${o}`;function uc(o){let e=o.trim().toLowerCase(),r=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(e);return r?{estado:"concluido",concluidoEm:pn(r[1],r[2],r[3])}:/^at[e\u00E9] hoje$/.test(e)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(e)?{estado:"atrasado"}:/^\d+ dias?$/.test(e)?{estado:"noPrazo"}:null}function $r(o){let e=o.querySelector(lc);if(!e)return null;let r=e.getAttribute("aria-label")??"";if(!r){let l=ho(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof l?.[0]=="string"&&(r=`Controle de Prazo / ${V(l[0])}`)}let t=dc.exec(B(r).replace(/\s+/g," ").trim());if(!t)return null;let a=uc(t[5]);if(!a)return null;let n=B(e.getAttribute("href")??""),s=J(n),i=s.get("id_controle_prazo")??"",c=s.get("id_procedimento")??o.id.replace(/^P/,"");return!i||!c?null:{idControlePrazo:i,idProcedimento:c,sigla:t[1],data:pn(t[2],t[3],t[4]),link:n,...a}}var mn=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,fn=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,gn=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function pc(o,e,r){let t=`${r}-${e}-${o}`;try{return Fo(Ae(t))===t?t:null}catch{return null}}var mc=o=>o.padStart(2,"0");function zr(o){let e=o.replace(/\r\n?/g,`
`),r=mn.exec(e);if(!r)return null;let t=pc(r[1],r[2],r[3]);if(!t)return null;let a=fn.exec(e),n=a?`${mc(a[1])}:${a[2]}`:void 0,s=gn.test(e),i=e.replace(gn,"").replace(mn,"");return a&&(i=i.replace(fn,"")),i=i.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:s,texto:i}}function hn(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=ho(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&e.push({texto:V(t[0]),nome:V(t[1])})}return e}function fc(o,e){let r=/Tipo (.*?)(?: \/ Especifica|$)/.exec(o)?.[1]?.trim()??"",t=/Especifica\S* (.*)$/.exec(o)?.[1]?.trim()??"";if(r)return{tipo:r,especificacao:t};let a=ho(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];return a&&a.length>=2?{tipo:V(a[1]).trim(),especificacao:V(a[0]).trim()}:{tipo:r,especificacao:t}}function bn(o,e){let r=o.querySelector("input[type=checkbox]"),t=o.querySelector("a[href*='procedimento_trabalhar']");if(!r||!t)return null;let a=r.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(t.getAttribute("class")??""),s=fc(a,t),i=[...o.querySelectorAll("td")],c=n?[]:[...i[1]?.querySelectorAll("a[aria-label]")??[]].map(l=>l.getAttribute("aria-label")??"");return{idProcedimento:r.getAttribute("value")??J(t.getAttribute("href")??"").get("id_procedimento")??"",protocolo:r.getAttribute("title")??q(t),grupo:e,tipo:s.tipo,especificacao:n?"":s.especificacao,sigiloso:n,novo:/NaoVisualizado/.test(t.getAttribute("class")??""),atribuido:q(i[i.length-1]).replace(/^\(|\)$/g,""),sinais:c,documentoNovo:!!i[1]?.querySelector("img[src*='exclamacao']")||c.some(l=>/documento foi inclu/i.test(l))}}var gc=/marcador_([a-z0-9_]+)\.svg/i;function hc(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=ho(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],a=/^Marcador\s*\/\s*(.*)$/s.exec(B(r.getAttribute("aria-label")??"").trim()),n=(typeof t?.[1]=="string"&&t[1]?V(t[1]):a?.[1]??"").trim();n&&e.push({nome:n,cor:gc.exec(r.querySelector("img")?.getAttribute("src")??"")?.[1]??"",texto:typeof t?.[0]=="string"?V(t[0]).trim():""})}return e}function bc(o){let e=[];for(let r of o.querySelectorAll("a")){let t=r.querySelector("img")?.getAttribute("src")??"",a=/retorno_(programado|aguardando)(\d)?\.svg/.exec(t);if(!a)continue;let n=B(r.getAttribute("aria-label")??"").trim();e.push({tipo:a[1],descricao:n,atrasado:a[2]==="3"||/atrasad/i.test(n)})}return e}function vc(o){let e=o.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla'),r=e?.textContent?.trim();if(!e||!r)return;let t=B(e.getAttribute("title")??"").replace(/^Atribu[i\u00ED]do para\s+/i,"").trim();return{sigla:r,nome:t||r}}function _r(o,e){let r=bn(o,e.grupo);if(!r?.idProcedimento)return null;let t=hc(o),a=null;for(let u of hn(o)){let p=zr(u.texto);if(p){a=p;break}}let n={id:r.idProcedimento,protocolo:r.protocolo,grupo:e.grupo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso,naoVisualizado:r.novo,marcadores:r.sigiloso?[]:t,retornos:r.sigiloso?[]:bc(o),acompanhamentoEspecial:!r.sigiloso&&!!o.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),documentoNovo:r.documentoNovo,pagina:e.pagina,naPaginaAtual:e.naPaginaAtual},s=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("onmouseover")??"";/\(URGENTE\)/.test(s)&&(n.urgente=!0),/\(TRANCADO\)/.test(s)&&(n.trancado=!0);let i=o.querySelector(".acompanhamentoesp_icon");if(i){let u=ho(i.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof u?.[1]=="string"&&u[1]&&(n.acompanhamentoGrupo=V(u[1]))}let c=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("href");c&&(n.link=B(c));let l=vc(o);if(l&&(n.atribuicao=l),!r.sigiloso){let u=dn(o);u&&(n.anotacao=u);let p=un(n.id,$r(o),a);p&&(n.prazo=p)}return n}var xn="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado",xc={recebidos:"tblProcessosRecebidos",gerados:"tblProcessosGerados"},Ac=[[/^tipo( do processo)?$/,"tipo"],[/^especificacao$/,"especificacao"],[/^(atribuicao|atribuido( para)?|responsavel)$/,"atribuicao"],[/^marcador(es)?$/,"marcador"],[/^prioridade$/,"prioridade"],[/^interessados?$/,"interessados"],[/^observacao$/,"observacao"],[/^ultima mov/,"ultimaMov"]];function Ec(o){let e=new Map;return[...(o.querySelector("thead tr")??[...o.querySelectorAll("tr")].find(t=>t.querySelector("th")))?.children??[]].forEach((t,a)=>{let n=K(t.textContent??""),s=Ac.find(([i])=>i.test(n));s&&e.set(a,s[1])}),e}function vn(o){let e=(o?.querySelector("caption")?.textContent??"").replace(/\s+/g," "),r=Number(/(\d+)\s+registro/.exec(e)?.[1]??0),t=/(\d+)\s+a\s+(\d+)\s*\)?/.exec(e);return{total:r,porPagina:t?Number(t[2])-Number(t[1])+1:0}}function yc(o,e,r){if(!r.size)return;let t=[...e.children];for(let[a,n]of r){let s=(t[a]?.textContent??"").replace(/\s+/g," ").trim();if(s)if(n==="tipo"&&!o.tipo)o.tipo=s;else if(n==="especificacao"&&!o.especificacao&&!o.sigiloso)o.especificacao=s;else if(n==="atribuicao"&&!o.atribuicao){let i=s.replace(/^\(|\)$/g,"");o.atribuicao={sigla:i,nome:i}}else if(n==="marcador"&&!o.marcadores.length&&!o.sigiloso)o.marcadores=[{nome:s,cor:"",texto:""}];else{if(o.sigiloso&&(n==="interessados"||n==="observacao"))continue;if(n==="prioridade")o.prioridade=s;else if(n==="interessados")o.interessados=s;else if(n==="observacao")o.observacao=s;else if(n==="ultimaMov"){let i=/(\d{2})\/(\d{2})\/(\d{4})/.exec(s);i&&(o.ultimaMov=`${i[3]}-${i[2]}-${i[1]}`)}}}}function Pc(o){let e=o.querySelector("input[type=checkbox]")?.getAttribute("name")??"";return/^chkGerados/i.test(e)?"gerados":"recebidos"}function Go(o,e={}){let r=e.pagina??0,t=e.naPaginaAtual??!0,a=[],n={recebidos:0,gerados:0},s={recebidos:0,gerados:0},i=o.getElementById("tblProcessosDetalhado"),c=new Set,l=m=>{m&&!c.has(m.id)&&(c.add(m.id),a.push(m))};for(let m of["recebidos","gerados"]){let v=o.getElementById(xc[m]),{total:x,porPagina:M}=vn(v);n[m]=x,s[m]=M;for(let b of v?.querySelectorAll('tr[id^="P"]')??[])l(_r(b,{grupo:m,pagina:r,naPaginaAtual:t}))}if(i){let m=Ec(i),{total:v,porPagina:x}=vn(i);for(let M of i.querySelectorAll("tr")){if(!M.querySelector('a[href*="procedimento_trabalhar"]'))continue;let b=Pc(M),C=_r(M,{grupo:b,pagina:r,naPaginaAtual:t});C&&!c.has(C.id)&&(yc(C,M,m),l(C),n[b]=Math.max(n[b],v),s[b]=Math.max(s[b],x))}}let u=m=>o.getElementById(m)?.getAttribute("value")??"",p={recebidos:{itens:u("hdnRecebidosItens"),hash:u("hdnRecebidosItensHash")},gerados:{itens:u("hdnGeradosItens"),hash:u("hdnGeradosItensHash")},detalhado:{itens:u("hdnDetalhadoItens"),hash:u("hdnDetalhadoItensHash")}};return{processos:a,totais:n,porPagina:s,visao:i?"detalhada":"resumida",selecoes:p}}var Sc=60;async function An(o,e,r={}){let t=r.maxPaginas??Sc,a=[],n=new Set(o.processos.map(l=>l.id)),s=!0,i,c=!1;try{for(let l of["recebidos","gerados"]){let u=o.totais[l],p=o.processos.filter(x=>x.grupo===l).length,m=o.porPagina[l]||p||1,v=Math.max(1,Math.ceil(u/m));for(let x=1;p<u;x+=1){if(r.sinal?.aborted)return s=!1,{processos:a,completo:s,...i?{erro:i}:{}};if(x>=t){s=!1;break}c=!0;let M=await e.pagina(l,x,r.sinal),b=Go(M,{pagina:x,naPaginaAtual:!1}),C=b.processos.filter(O=>O.grupo===l&&!n.has(O.id));if(!C.length)break;for(let O of C)n.add(O.id);p+=C.length,a.push(...C),b.visao==="detalhada"?r.aoSelecao?.("detalhado",x,b.selecoes.detalhado):r.aoSelecao?.(l,x,b.selecoes[l]),r.aoPagina?.(C),r.aoProgresso?.({grupo:l,paginasLidas:x+1,paginasTotal:v,processos:p,total:u})}p<u&&(s=!1)}}catch(l){s=!1,i=l instanceof Error?l.message:String(l)}finally{if(c)try{await e.restaurar()}catch(l){i??=`N\xE3o foi poss\xEDvel voltar \xE0 primeira p\xE1gina: ${l instanceof Error?l.message:String(l)}`}}return{processos:a,completo:s,...i?{erro:i}:{}}}var wc=["hdnRecebidosItensSelecionados","hdnGeradosItensSelecionados","hdnRecebidosItemId","hdnGeradosItemId","hdnDetalhadoItensSelecionados","hdnDetalhadoItemId"];function qr(o,e,r="resumida"){let t="#frmProcedimentoControlar",a=()=>({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",hdnDetalhadoPaginaAtual:"0",...Object.fromEntries(wc.map(n=>[n,""]))});return{async pagina(n,s,i){let c=r==="detalhada"?"hdnDetalhadoPaginaAtual":n==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual";return(await j.de(e,t,o).definir({...a(),[c]:String(s)}).enviar({sinal:i,aceitarValidacao:!0})).doc},async restaurar(n){await j.de(e,t,o).definir(a()).enviar({sinal:n,aceitarValidacao:!0})},restaurarAoSair(){try{let n=j.de(e,t,o);fetch(o.absoluta(n.action),{method:"POST",keepalive:!0,credentials:"include",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(n.definir(a()).pares()).toString()}).catch(()=>{})}catch{}}}}var Mc=30*6e4,En=5e3,Vr=()=>({vistoEm:{}});function Pn(o){if(!o||typeof o!="object")return Vr();let e=o,r={};if(e.vistoEm&&typeof e.vistoEm=="object")for(let[i,c]of Object.entries(e.vistoEm))typeof c=="number"&&Number.isFinite(c)&&c>0&&(r[i]=c);let t=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0,a={vistoEm:r},n=t(e.visitaAtual),s=t(e.visitaAnterior);return n!==void 0&&(a.visitaAtual=n),s!==void 0&&(a.visitaAnterior=s),a}function Sn(o,e){return o.visitaAtual===void 0?{...o,visitaAtual:e}:e-o.visitaAtual>Mc?{...o,visitaAnterior:o.visitaAtual,visitaAtual:e}:o}function Hr(o,e,r,t){let a={...o.vistoEm};for(let s of e)a[s]===void 0&&(a[s]=r);if(t){let s=new Set(e);for(let i of Object.keys(a))s.has(i)||delete a[i]}let n=Object.keys(a);if(n.length>En)for(let s of n.sort((i,c)=>a[c]-a[i]).slice(En))delete a[s];return{...o,vistoEm:a}}function wn(o,e){return o.map(r=>e.vistoEm[r.id]!==void 0?{...r,vistoEm:e.vistoEm[r.id]}:r)}function Uo(o){if(o===null)return"";if(o<1)return"hoje";if(o===1)return"1 dia";if(o<60)return`${o} dias`;let e=Math.floor(o/30);return e<24?`${e} meses`:`${Math.floor(o/365)} anos`}var Mn="Contado desde a primeira vez que o SEI Pro viu o processo nesta unidade (o SEI n\xE3o informa a data de chegada).";var Bo=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao","caixa","parado","sinais"],_o={processo:"Processo",tipo:"Tipo",especificacao:"Especifica\xE7\xE3o",responsavel:"Respons\xE1vel",marcadores:"Marcadores",prazo:"Prazo",anotacao:"Anota\xE7\xE3o",caixa:"Na caixa",parado:"Parado h\xE1",sinais:"Sinais"};var Dc=30,Oc=40,Cc=()=>({colunas:"marcador",limite:0,raiasPorResponsavel:!1}),Lc=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao"],Fr=2;function Xo(){return{id:"",nome:"Padr\xE3o",busca:"",ordem:[],agrupar:"nenhum",modo:"tabela",colv:Fr,colunas:[...Lc],densidade:"confortavel",quadro:Cc()}}var Ic=["nenhum","responsavel","tipo","marcador","prazo","situacao","grupo","anotacao","acompanhamento","retorno","caixa","autuacao","recebimento","envio","unidadeEnvio"],kc=["protocolo","tipo","responsavel","marcador","prazo","caixa","parado","novo"],Nc=["marcador","responsavel","prazo","tipo"];function ze(o){let e=Xo();if(!o||typeof o!="object")return e;let r=o,t=Array.isArray(r.ordem)?r.ordem.filter(s=>!!s&&typeof s=="object"&&kc.includes(s.campo)).slice(0,4).map(s=>({campo:s.campo,decrescente:s.decrescente===!0})):[],a=Array.isArray(r.colunas)?[...new Set(r.colunas.filter(s=>Bo.includes(s)))]:[];if(a.includes("processo")&&r.colv!==Fr&&!a.includes("especificacao")){let s=a.indexOf("processo");a=[...a.slice(0,s+1),"especificacao",...a.slice(s+1)]}let n=r.quadro&&typeof r.quadro=="object"?r.quadro:{};return{id:typeof r.id=="string"?r.id:"",colv:Fr,nome:typeof r.nome=="string"&&r.nome.trim()?r.nome.trim().slice(0,Oc):e.nome,busca:typeof r.busca=="string"?r.busca.slice(0,500):"",ordem:t,agrupar:Ic.includes(r.agrupar)?r.agrupar:"nenhum",modo:r.modo==="quadro"?"quadro":"tabela",colunas:a.length?a:e.colunas,densidade:r.densidade==="compacta"?"compacta":"confortavel",quadro:{colunas:Nc.includes(n.colunas)?n.colunas:"marcador",limite:typeof n.limite=="number"&&n.limite>0?Math.min(99,Math.floor(n.limite)):0,raiasPorResponsavel:n.raiasPorResponsavel===!0}}}function Dn(o,e,r){let t=ze(e),a=t.id?o.findIndex(s=>s.id===t.id):-1;if(a>=0){let s=[...o];return s[a]=t,{lista:s,visao:t}}if(o.length>=Dc)return null;let n={...t,id:r()};return{lista:[...o,n],visao:n}}var On=(o,e)=>o.filter(r=>r.id!==e);function Cn(o,e){let r=t=>JSON.stringify({...t,id:"",nome:""});return r(o)!==r(e)}var _e="spro_grade_v_ids",qe=o=>`spro_grade_v:${o}`,Tc=o=>`spro_grade:${o||"x"}`,Rc=(o,e)=>`spro_grade_and:${o||"x"}:${e||"x"}`,Ln=5e3;function $c(){return{visao:Xo(),idade:Vr(),recolhidos:[]}}function zc(o){if(!o||typeof o!="object")return $c();let e=o;return{visao:ze(e.visao),idade:Pn(e.idade),recolhidos:Array.isArray(e.recolhidos)?e.recolhidos.filter(r=>typeof r=="string").slice(0,200):[]}}var _c=/^\d{4}-\d{2}-\d{2}$/;function qc(o){if(!o||typeof o!="object")return null;let e=o;if(typeof e.consultadoEm!="number"||!Number.isFinite(e.consultadoEm))return null;let r={consultadoEm:e.consultadoEm};for(let t of["autuacao","recebimento","envio"])typeof e[t]=="string"&&_c.test(e[t])&&(r[t]=e[t]);return typeof e.unidadeEnvio=="string"&&e.unidadeEnvio&&(r.unidadeEnvio=e.unidadeEnvio.slice(0,120)),r}function In(o,e,r=""){let{local:t,sync:a}=o,n=Tc(e),s=Rc(e,r);async function i(){return zc((await t.obter(n))[n])}async function c(v){let x=await i();await t.gravar({[n]:{...x,...v}})}async function l(){let v=(await a.obter(_e))[_e],x=Array.isArray(v)?v.filter(b=>typeof b=="string"):[];if(!x.length)return[];let M=await a.obter(x.map(qe));return x.flatMap(b=>{let C=M[qe(b)];return C?[{...ze(C),id:b}]:[]})}async function u(v,x=[]){let M=new Set(v.map(O=>O.id)),b={[_e]:v.map(O=>O.id)};for(let O of v)b[qe(O.id)]=O;await a.gravar(b);let C=x.filter(O=>!M.has(O.id)).map(O=>qe(O.id));C.length&&await a.remover(C)}async function p(v){let x=(await t.obter(s))[s],M=x&&typeof x=="object"?x.itens:void 0,b={};if(!M||typeof M!="object")return b;for(let[C,O]of Object.entries(M)){let h=qc(O);h&&te(h,v)&&(b[C]=h)}return b}async function m(v){let x=Object.keys(v),M=x.length>Ln?Object.fromEntries(x.sort((b,C)=>v[C].consultadoEm-v[b].consultadoEm).slice(0,Ln).map(b=>[b,v[b]])):v;await t.gravar({[s]:{itens:M}})}return{areaLocal:t,lerAndamentos:p,gravarAndamentos:m,lerEstado:i,gravarVisao:v=>c({visao:v}),gravarIdade:v=>c({idade:v}),gravarRecolhidos:v=>c({recolhidos:v}),lerVisoes:l,gravarVisoes:u,aoMudarVisoes:v=>a.aoMudar(x=>_e in x||Object.keys(x).some(M=>M.startsWith("spro_grade_v:"))?v():void 0)}}function kn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var Nn=new Set;var Vc=null;function Hc(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Tn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Rn(o,e,r){let t=o.ownerDocument,a=t.defaultView;Hc(o).append(e);let n=!0,s=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let v=a?.innerHeight??0,x=a?.innerWidth??0,M=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,x-16)),b=r.alinharDireita?m.right-M:m.left,C=Math.max(8,Math.min(b,x-M-8)),O=r.alturaMaxima??360,h=r.distancia??4;e.style.maxHeight="none";let S=Math.min(e.scrollHeight||O,O),D=v-m.bottom-8,w=m.top-8,I=Vc?.()??!1,R=!I&&D<Math.min(S,200)&&w>D;e.style.left=`${C}px`,e.style.width=`${M}px`,e.style.maxHeight=`${I?O:Math.max(140,Math.min(O,R?w:D>140?D:O))}px`,e.classList.toggle("spro-flutuante-cima",R),R?(e.style.top="",e.style.bottom=`${v-m.top+h}px`):(e.style.bottom="",e.style.top=`${m.bottom+h}px`),Tn(a,R?0:Math.ceil(m.bottom+h+S+12))},i=m=>{let v=m.composedPath?.()??[],x=m.target,M=b=>v.includes(b)||!!x&&!!b.contains?.(x);M(e)||M(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},l=m=>{m.target instanceof Node&&e.contains(m.target)||c()},u=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",u);let p={ancora:o,fechar:()=>r.aoFechar()};return Nn.add(p),s(),{posicionar:s,fechar(){n&&(n=!1,Nn.delete(p),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",u),e.remove(),Tn(a,0))}}}function $n(o,e){let r=K(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=K(n.rotulo),c=K(n.complemento??""),l=`${i} ${c} ${K(n.descricao??"")}`;if(!t.every(p=>l.includes(p)))return;let u=i.startsWith(r)?0:`${i} ${c}`.split(" ").some(p=>p.startsWith(t[0]))?1:2;a.push({o:n,nota:u,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function zn(o,e){let r=o.normalize("NFC"),t=K(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((l,u)=>{let p=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let m of p)n+=m,s.push(u)});let i=new Array(a.length).fill(!1);for(let l of t){let u=n.indexOf(l);if(!(u<0))for(let p=u;p<u+l.length;p++)i[s[p]]=!0}let c=[];return a.forEach((l,u)=>{let p=c[c.length-1];p&&p.marcado===i[u]?p.texto+=l:c.push({texto:l,marcado:i[u]})}),c}var Fc=0;function Oo(o){let e=`spro-combo-${++Fc}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=A=>r().find(T=>T.valor===A)??t.get(A),n=[...o.valor??[]],s=null,i="",c=0,l=[],u=null,p=o.vazio??"Escolher\u2026",m={tipo:"pronto"},v=0,x=d("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),M=()=>o.aoMudar?.([...n]);function b(){let A=[];o.icone&&A.push(_(o.icone,15));let T=n.map(L=>a(L)).filter(L=>!!L),P=d("span",{class:"spro-combo-texto"});if(!T.length)P.classList.add("spro-combo-vazio"),P.append(p);else{let L=T[0];L.marca&&P.append(L.marca()),L.cor&&P.append(d("span",{class:"spro-combo-cor",style:`background:${L.cor}`})),P.append(d("span",{class:"spro-combo-rotulo"},L.rotulo)),L.complemento&&P.append(d("span",{class:"spro-combo-compl"},L.complemento)),T.length>1&&P.append(d("span",{class:"spro-combo-mais"},`+${T.length-1}`))}A.push(P,_("chevron",14)),x.setAttribute("aria-busy",m.tipo==="carregando"?"true":"false"),x.classList.toggle("spro-combo-erro",m.tipo==="erro"),x.classList.toggle("spro-combo-ativo",o.multiplo===!0&&T.length>0),x.replaceChildren(...A)}let C=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function O(A){if(o.multiplo){n=n.includes(A.valor)?n.filter(P=>P!==A.valor):[...n,A.valor],M(),b(),w();return}let T=n.length!==1||n[0]!==A.valor;n=[A.valor],b(),G(!0),T&&M()}async function h(){if(!o.criar)return;let A=i.trim();if(!A)return;let T=await o.criar(A);if(T){if(t.set(T.valor,T),i="",s){let P=s.querySelector(".spro-combo-busca");P&&(P.value="")}o.multiplo&&n.includes(T.valor)?w():O(T)}}function S(A,T){let P=n.includes(A.valor),L=d("span",{class:"spro-combo-op-rotulo"});for(let $ of zn(A.rotulo,i))L.append($.marcado?d("mark",{},$.texto):$.texto);let F=A.complemento?d("span",{class:"spro-combo-op-compl"}):null;if(F&&A.complemento)for(let $ of zn(A.complemento,i))F.append($.marcado?d("mark",{},$.texto):$.texto);let eo=d("li",{role:"option",id:`${e}-op-${T}`,class:`spro-combo-op${T===c?" spro-combo-op-ativa":""}`,"data-valor":A.valor,"aria-selected":P?"true":"false"},o.multiplo?d("span",{class:"spro-combo-caixa","aria-hidden":"true"},P?_("check",12):null):null,A.marca?A.marca():null,A.cor?d("span",{class:"spro-combo-cor",style:`background:${A.cor}`}):null,A.icone?_(A.icone,15):null,d("span",{class:"spro-combo-op-textos"},F?d("span",{class:"spro-combo-op-linha"},L,F):L,A.descricao?d("span",{class:"spro-combo-op-desc"},A.descricao):null),A.contagem!==void 0?d("span",{class:"spro-combo-conta"},String(A.contagem)):null,!o.multiplo&&P?d("span",{class:"spro-combo-marca"},_("check",14)):null);return eo.addEventListener("pointerdown",$=>$.preventDefault()),eo.addEventListener("click",()=>{c=T,O(A)}),eo.addEventListener("pointermove",()=>{c!==T&&(c=T,D())}),eo}function D(){if(!s)return;let A=[...s.querySelectorAll('[role="option"]')];A.forEach((F,eo)=>{F.classList.toggle("spro-combo-op-ativa",eo===c)});let T=A[c],L=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');T?(L?.setAttribute("aria-activedescendant",T.id),T.scrollIntoView?.({block:"nearest"})):L?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;let A=$n(r(),i);v=A.length,l=o.limite!==void 0&&A.length>o.limite?A.slice(0,o.limite):A,m.tipo!=="pronto"&&(l=[]),c>=l.length&&(c=Math.max(0,l.length-1));let T=s.querySelector('[role="listbox"]');T.setAttribute("aria-busy",m.tipo==="carregando"?"true":"false");let P=s.querySelector(".spro-combo-extras");if(P.replaceChildren(),m.tipo==="carregando")T.replaceChildren(...[62,84,48,74].map($=>d("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},d("span",{style:`width:${$}%`})))),P.append(d("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(m.tipo==="erro"){T.replaceChildren();let $=m.tentar;if(P.append(d("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},m.mensagem)),$){let ro=d("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},_("atualizar",14),d("span",{},"Tentar de novo"));ro.addEventListener("pointerdown",mo=>mo.preventDefault()),ro.addEventListener("click",$),P.append(ro)}}else{T.replaceChildren(...l.map(S));let $=i.trim();l.length||P.append(d("p",{class:"spro-combo-nada"},$?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let ro=l.length?o.resumo?.(l.length,v,r().length):void 0;ro&&P.append(d("p",{class:"spro-combo-resumo",role:"status"},ro)),l.length<v&&P.append(d("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${l.length} de ${v}. Digite para refinar.`))}let L=i.trim(),F=r().some($=>K($.rotulo)===K(L));if(o.criar&&L&&!F&&m.tipo==="pronto"){let $=d("button",{type:"button",class:"spro-combo-criar"},_("mais",14),d("span",{},o.rotuloCriar?o.rotuloCriar(L):`Criar \u201C${L}\u201D`));$.addEventListener("pointerdown",ro=>ro.preventDefault()),$.addEventListener("click",()=>void h()),P.append($)}let eo=s.querySelector(".spro-combo-rodape");if(eo){let $=l.filter(ao=>!n.includes(ao.valor)),ro=d("button",{type:"button",class:"spro-combo-acao",disabled:!L||!$.length},`Marcar os filtrados${L&&$.length?` (${$.length})`:""}`);ro.addEventListener("click",()=>{n=[...n,...$.map(ao=>ao.valor)],M(),b(),w()});let mo=d("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");mo.addEventListener("click",()=>{n=[],M(),b(),w()}),eo.replaceChildren(d("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),ro,mo)}D()}let I=()=>u?.posicionar();function R(A){let T=l.length,P=A.target,L=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],F=!!P?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(A.key==="Tab"){let $=L.indexOf(P);if(!A.shiftKey&&$<L.length-1)L[$+1]?.focus();else if(A.shiftKey&&$>=0)$>0?L[$-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{G(!0);return}A.preventDefault(),A.stopPropagation();return}if(F&&A.key!=="Escape")return;let eo=!s?.querySelector(".spro-combo-busca");if(eo&&A.key===" "){let $=l[c];$&&O($),A.preventDefault(),A.stopPropagation();return}if(eo&&A.key.length===1&&!A.ctrlKey&&!A.metaKey&&!A.altKey){let $=K(A.key),mo=[...l.keys()].map(ao=>(c+1+ao)%Math.max(1,T)).find(ao=>K(l[ao]?.rotulo??"").startsWith($));mo!==void 0&&(c=mo,D()),A.preventDefault(),A.stopPropagation();return}switch(A.key){case"ArrowDown":c=T?(c+1)%T:0,D();break;case"ArrowUp":c=T?(c-1+T)%T:0,D();break;case"Home":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,D();break;case"End":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,T-1),D();break;case"Enter":{let $=l[c];$?O($):h();break}case"Escape":G(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),M(),b(),w();break;default:return}A.preventDefault(),A.stopPropagation()}function Z(A=""){if(s)return;i=A,c=A?0:(()=>{let F=$n(r(),i).findIndex(eo=>eo.valor===n[n.length-1]);return F<0?0:F})();let P=C()?d("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:A}):null;if(P&&(P.value=A,P.addEventListener("input",()=>{i=P.value,c=0,w(),I()})),s=d("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},P?d("div",{class:"spro-combo-cabeca"},_("busca",15),P):null,d("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:P?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),d("div",{class:"spro-combo-extras"}),o.multiplo?d("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",R),u=Rn(x,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>G(!1)}),x.setAttribute("aria-expanded","true"),x.setAttribute("aria-controls",`${e}-lista`),x.classList.add("spro-combo-aberto"),w(),I(),!s)return;(P??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),P&&A&&P.setSelectionRange?.(A.length,A.length)}function G(A=!1){s&&(u?.fechar(),u=null,s=null,i="",x.setAttribute("aria-expanded","false"),x.removeAttribute("aria-controls"),x.classList.remove("spro-combo-aberto"),A&&x.focus?.({preventScroll:!0}))}return x.addEventListener("click",()=>s?G(!0):Z()),x.addEventListener("keydown",A=>{s||(A.key==="ArrowDown"||A.key==="ArrowUp"?(A.preventDefault(),Z()):A.key.length===1&&A.key!==" "&&!A.ctrlKey&&!A.metaKey&&!A.altKey&&C()&&(A.preventDefault(),Z(A.key)))}),b(),{el:x,valor:()=>[...n],definir(A,T=!1){n=[...A],b(),w(),T&&M()},atualizar(){b(),w()},definirVazio(A){p=A,b()},definirEstado(A){m=A,b(),w(),I()},abrir:Z,fechar:()=>G(!1)}}var _n="#tblProcessosRecebidos input[type=checkbox], #tblProcessosGerados input[type=checkbox], #tblProcessosDetalhado input[type=checkbox]",jr=o=>o.getAttribute("value")??o.closest("tr")?.id.replace(/^P/,"")??"";function Gr(o){let e=new Set;for(let r of o.querySelectorAll(_n))r.checked&&jr(r)&&e.add(jr(r));return e}function qn(o,e){let r=new Set(e);for(let t of o.querySelectorAll(_n)){let a=jr(t);a&&(r.delete(a),!t.disabled&&!!t.checked!==e.has(a)&&t.click())}return[...r]}function jc(o){let e=o.composedPath?.()??[];if(e.length)return e.some(r=>r.id==="spro-grade");for(let r=o.target;r;r=r.parentNode)if(r.id==="spro-grade")return!0;return!1}function Vn(o,e){let r=!1,t=a=>{a&&jc(a)||r||(r=!0,queueMicrotask(()=>{r=!1,e(Gr(o))}))};return o.addEventListener("click",t,!0),o.addEventListener("change",t,!0),()=>{o.removeEventListener("click",t,!0),o.removeEventListener("change",t,!0)}}function Gc(o){return/acaoControleProcessos\(\s*['"][^'"]*['"]\s*,\s*true/.test(o.elemento.getAttribute("onclick")??"")}function Hn(o,e){return Gc(o)&&e===0?{ok:!1,motivo:"Marque ao menos um processo."}:(o.elemento.click(),{ok:!0})}var Uc=o=>o instanceof Error?o.message:String(o);function Fn(o){if(o.tipo==="atribuicao")return{...o,para:o.de,de:o.para};let e={tipo:"marcador",id:o.id,protocolo:o.protocolo};return o.adicionar&&(e.remover=o.adicionar),o.remover&&(e.adicionar=o.remover,o.texto&&(e.texto=o.texto)),e}async function Bc(o,e){try{if(o.tipo==="atribuicao")return await e.atribuir(o.protocolo,o.para),{ok:!0,desfazer:Fn(o)};if(o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,...o.texto?{texto:o.texto}:{}}),o.remover)try{await e.marcador(o.protocolo,{marcador:o.remover,remover:!0})}catch(r){throw o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,remover:!0}).catch(()=>{}),r}return{ok:!0,desfazer:Fn(o)}}catch(r){return{ok:!1,erro:Uc(r)}}}function jn(o){let e=Promise.resolve();return{mover(r){let t=e.then(()=>Bc(r,o));return e=t.catch(()=>{}),t}}}var Ve=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,Gn=Number.MAX_SAFE_INTEGER;function Ur(o,e){let r=[e];return o.hora&&o.vencimento&&(r[0]=e.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&r.push(o.texto),o.sigla&&r.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),r.join(`
`)}function Un(o,e){let r=o.vencimento;if(o.concluidoEm&&r)return{situacao:"concluido",texto:`conclu\xEDdo em ${fo(o.concluidoEm).slice(0,5)}`,dica:Ur(o,`Prazo de ${fo(r)} conclu\xEDdo em ${fo(o.concluidoEm)}.`),ordem:Gn,sorter:`${r} 23:59:59`};if(r){let s=To(e,r),i=`${r} ${o.hora??"23:59"}:00`,c=Ur(o,`Vence em ${fo(r)}.`);return s===0?{situacao:"hoje",texto:"vence hoje",dica:c,ordem:0,sorter:i}:s<0?{situacao:"atrasado",texto:`${Ve(-s)} de atraso`,dica:c,ordem:s,sorter:i}:{situacao:"noPrazo",texto:`vence em ${Ve(s)}`,dica:c,ordem:s,sorter:i}}let t=o.inicio??e,a=To(t,e);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${Ve(a)}`:`em ${Ve(-a)}`,dica:Ur(o,`Contando desde ${fo(t)}.`),ordem:Gn-1,sorter:`${t} ${o.hora??"23:59"}:00`}}function po(o,e){return o.prazo?Un(o.prazo,e.hoje):null}function Ao(o,e){return o.vistoEm===void 0?null:Math.max(0,Math.floor((e.agora-o.vistoEm)/864e5))}function Co(o,e){return o.ultimaMov?Math.max(0,To(o.ultimaMov,e.hoje)):null}function Bn(o,e){return e.visitaAnterior!==void 0&&o.vistoEm!==void 0&&o.vistoEm>e.visitaAnterior}function ie(o,e){let r=po(o,e);return!r||r.situacao==="concluido"||r.situacao==="desde"?null:r.ordem}var Xc={resp:"resp",responsavel:"resp",atribuido:"resp",atribuicao:"resp",tipo:"tipo",marcador:"marcador",marcadores:"marcador",marc:"marcador",espec:"espec",especificacao:"espec",anot:"anot",anotacao:"anot",nota:"anot",prazo:"prazo",caixa:"caixa",idade:"caixa",novo:"novo",sigilo:"sigilo",sigiloso:"sigilo",grupo:"grupo",retorno:"retorno",protocolo:"protocolo",proc:"protocolo",processo:"protocolo",parado:"parado",mov:"parado",prio:"prio",prioridade:"prio",interessado:"interessado",interessados:"interessado"};function Qr(o){let e=[],r="",t=!1;for(let a of o)a==='"'?(t=!t,r+=a):/\s/.test(a)&&!t?(r&&e.push(r),r=""):r+=a;return r&&e.push(r),e}var Qc=o=>o.replace(/^"|"$/g,"");function Jr(o){let e=[],r=[];for(let t of Qr(o)){let a=t,n=!1;a.startsWith("-")&&a.length>1&&(n=!0,a=a.slice(1));let s,i=/^([a-zA-Z\u00C0-\u017F]+):(.*)$/.exec(a);if(i){let p=Xc[K(i[1])];p&&(s=p,a=i[2])}let c="=";s&&/^[<>]/.test(a)&&(c=a[0],a=a.slice(1));let l=K(Qc(a));if(!l&&!s)continue;let u={...s?{campo:s}:{},valor:l,original:t,negado:n,comparador:c};e.push(u),r.push({texto:t,termo:u})}return{termos:e,tokens:r}}var Jc=o=>K([o.protocolo,o.protocolo.replace(/\D/g,""),o.tipo,o.especificacao,o.atribuicao?.sigla,o.atribuicao?.nome,...o.marcadores.flatMap(e=>[e.nome,e.texto]),o.anotacao?.texto,o.prazo?.texto,o.prioridade,o.interessados,o.observacao].filter(Boolean).join(" ")),Eo=(o,e)=>K(o??"").includes(e),Xn=/^(s|sim|1|true|yes)$/;function Br(o){let e=/^(\d+)\s*(d|dia|dias)?$/.exec(o);return e?Number(e[1]):null}function Xr(o,e,r){return o===null?!1:e==="<"?o<r:e===">"?o>r:o===r}function Kc(o,e,r){let t=po(o,r),a=e.valor;if(a==="sem"||a==="nenhum"||a==="nao")return!o.prazo;if(a==="com"||a==="sim")return!!o.prazo;if(!t)return!1;if(a==="atrasado"||a==="atrasados"||a==="vencido")return t.situacao==="atrasado";if(a==="hoje")return t.situacao==="hoje";if(a==="concluido"||a==="concluidos")return t.situacao==="concluido";if(a==="semana"){let s=ie(o,r);return s!==null&&s>=0&&s<=7}let n=Br(a);return n!==null?Xr(ie(o,r),e.comparador==="="?"<":e.comparador,n):Eo(o.prazo?.texto,a)}function Wc(o,e,r){let t=e.valor;switch(e.campo){case"resp":return t==="sem"||t==="ninguem"?!o.atribuicao:t==="eu"?!!r.eu&&K(o.atribuicao?.sigla??"")===K(r.eu):Eo(o.atribuicao?.sigla,t)||Eo(o.atribuicao?.nome,t);case"tipo":return Eo(o.tipo,t);case"marcador":return t==="sem"||t==="nenhum"?o.marcadores.length===0:t==="com"?o.marcadores.length>0:o.marcadores.some(a=>Eo(a.nome,t)||Eo(a.texto,t));case"espec":return Eo(o.especificacao,t);case"anot":return t==="sem"||t==="nao"?!o.anotacao:t==="com"||t==="sim"?!!o.anotacao:t==="prioridade"||t==="prioritaria"?!!o.anotacao?.prioridade:Eo(o.anotacao?.texto,t);case"prazo":return Kc(o,e,r);case"caixa":{let a=Br(t);return a===null?!1:Xr(Ao(o,r),e.comparador==="="?">":e.comparador,a)}case"novo":return t==="visita"?Bn(o,r):Xn.test(t)?o.naoVisualizado:t==="nao"?!o.naoVisualizado:!1;case"sigilo":return Xn.test(t)?o.sigiloso:!o.sigiloso;case"grupo":return t.startsWith("rec")?o.grupo==="recebidos":t.startsWith("ger")?o.grupo==="gerados":!1;case"retorno":return t==="sem"||t==="nao"?o.retornos.length===0:t==="atrasado"?o.retornos.some(a=>a.atrasado):t==="aguardando"?o.retornos.some(a=>a.tipo==="aguardando"):t==="programado"?o.retornos.some(a=>a.tipo==="programado"):o.retornos.length>0;case"parado":{let a=Br(t);return a===null?!1:Xr(Co(o,r),e.comparador==="="?">":e.comparador,a)}case"prio":return Eo(o.prioridade,t);case"interessado":return Eo(o.interessados,t);case"protocolo":return K(o.protocolo).includes(t)||o.protocolo.replace(/\D/g,"").includes(t.replace(/\D/g,"")||"\0");default:return!0}}function Zc(o,e,r){if(!o.termos.length)return!0;let t;for(let a of o.termos){let n;if(a.campo?n=Wc(e,a,r):(t??=Jc(e),n=t.includes(a.valor)),a.negado?n:!n)return!1}return!0}var Qn=(o,e,r)=>{let t=Jr(e);return t.termos.length?o.filter(a=>Zc(t,a,r)):o};function He(o,e){return Qr(o).filter(r=>r!==e).join(" ")}function Jn(o,e,r){let t=/\s/.test(r)?`"${r}"`:r,a=`${e}:${t}`,n=Qr(o);return n.includes(a)?o:[...n,a].join(" ")}var Yc=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function ol(o,e=[]){return[...o.values()].sort((r,t)=>{let a=e.indexOf(r.chave),n=e.indexOf(t.chave);return a>=0||n>=0?(a<0?-1:a)-(n<0?-1:n):Yc.compare(r.rotulo,t.rotulo)})}function U(o,e,r,t){let a=o.get(e);return a||(a={chave:e,rotulo:r,itens:[],...t?{tom:t}:{}},o.set(e,a)),a}var Qo=[["atrasado","Atrasados","perigo"],["hoje","Vencem hoje","aviso"],["semana","Pr\xF3ximos 7 dias","aviso"],["mes","Pr\xF3ximos 30 dias","neutro"],["depois","Depois de 30 dias","neutro"],["desde","Contando desde uma data","neutro"],["concluido","Prazo conclu\xEDdo","neutro"],["sem","Sem prazo","neutro"]];function ce(o,e){let r=po(o,e);if(!r)return"sem";if(r.situacao==="concluido")return"concluido";if(r.situacao==="desde")return"desde";if(r.situacao==="atrasado")return"atrasado";if(r.situacao==="hoje")return"hoje";let t=ie(o,e)??0;return t<=7?"semana":t<=30?"mes":"depois"}var Kn=[["recente","Chegaram hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["antigo","H\xE1 mais de 30 dias"],["desconhecido","Sem registro"]];function el(o,e){let r=Ao(o,e);return r===null?"desconhecido":r<1?"recente":r<=7?"semana":r<=30?"mes":"antigo"}function Lo(o,e){return e.map(r=>o.get(r[0])).filter(r=>!!r)}function Fe(o,e,r){if(e==="nenhum")return[{chave:"todos",rotulo:"Todos",itens:o}];let t=new Map;for(let a of o)switch(e){case"responsavel":a.atribuicao?U(t,`u:${a.atribuicao.sigla}`,a.atribuicao.nome===a.atribuicao.sigla?a.atribuicao.sigla:`${a.atribuicao.nome} (${a.atribuicao.sigla})`).itens.push(a):U(t,"sem","Sem respons\xE1vel").itens.push(a);break;case"tipo":U(t,`t:${a.tipo||"-"}`,a.tipo||"Sem tipo").itens.push(a);break;case"marcador":if(a.marcadores.length)for(let n of a.marcadores)U(t,`m:${n.nome}`,n.nome).itens.push(a);else U(t,"sem","Sem marcador").itens.push(a);break;case"prazo":{let n=ce(a,r),s=Qo.find(i=>i[0]===n);U(t,n,s[1],s[2]).itens.push(a);break}case"situacao":a.naoVisualizado?U(t,"novo","N\xE3o visualizados","aviso").itens.push(a):U(t,"lido","Visualizados").itens.push(a);break;case"grupo":U(t,a.grupo,a.grupo==="recebidos"?"Recebidos":"Gerados").itens.push(a);break;case"anotacao":a.anotacao?.prioridade?U(t,"prio","Anota\xE7\xE3o com prioridade","aviso").itens.push(a):a.anotacao?U(t,"com","Com anota\xE7\xE3o").itens.push(a):U(t,"sem","Sem anota\xE7\xE3o").itens.push(a);break;case"acompanhamento":a.acompanhamentoEspecial?U(t,"com","Em acompanhamento especial").itens.push(a):U(t,"sem","Fora do acompanhamento especial").itens.push(a);break;case"retorno":a.retornos.some(n=>n.atrasado)?U(t,"atrasado","Retorno atrasado","perigo").itens.push(a):a.retornos.some(n=>n.tipo==="aguardando")?U(t,"aguardando","Aguardando retorno").itens.push(a):a.retornos.length?U(t,"programado","Retorno programado").itens.push(a):U(t,"sem","Sem retorno").itens.push(a);break;case"caixa":{let n=el(a,r);U(t,n,Kn.find(s=>s[0]===n)[1]).itens.push(a);break}case"autuacao":case"recebimento":case"envio":{let n=qa(r.andamentos?.[a.id]?.[e],r.hoje);U(t,n,Dr.find(s=>s[0]===n)[1]).itens.push(a);break}case"unidadeEnvio":{let n=r.andamentos?.[a.id]?.unidadeEnvio;n?U(t,`u:${n}`,n).itens.push(a):U(t,"sem","Sem informa\xE7\xE3o").itens.push(a);break}}return e==="prazo"?Lo(t,Qo):e==="caixa"?Lo(t,Kn):e==="autuacao"||e==="recebimento"||e==="envio"?Lo(t,Dr):e==="situacao"?Lo(t,[["novo",""],["lido",""]]):e==="grupo"?Lo(t,[["recebidos",""],["gerados",""]]):e==="anotacao"?Lo(t,[["prio",""],["com",""],["sem",""]]):e==="acompanhamento"?Lo(t,[["com",""],["sem",""]]):e==="retorno"?Lo(t,[["atrasado",""],["aguardando",""],["programado",""],["sem",""]]):ol(t,["sem"])}var Kr={nenhum:"Sem agrupamento",responsavel:"Respons\xE1vel",tipo:"Tipo de processo",marcador:"Marcador",prazo:"Prazo",situacao:"Visualiza\xE7\xE3o",grupo:"Recebidos e gerados",anotacao:"Anota\xE7\xE3o",acompanhamento:"Acompanhamento especial",retorno:"Retorno programado",caixa:"Tempo na caixa",autuacao:"Data de autua\xE7\xE3o",recebimento:"Data de recebimento",envio:"Data de envio",unidadeEnvio:"Unidade de envio"};var rl=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function je(o,e){let r=new Map;for(let t of o)for(let a of e(t)){let n=r.get(a.valor)??{valor:a.valor,rotulo:a.rotulo,n:0};n.n+=1,r.set(a.valor,n)}return[...r.values()].sort((t,a)=>a.n-t.n||rl.compare(t.rotulo,a.rotulo))}function Wr(o,e){let r=je(o,t=>{let a=ce(t,e),n=Qo.find(i=>i[0]===a)[1],s=a==="atrasado"?"atrasado":a==="hoje"?"hoje":a==="semana"?"semana":a==="sem"?"sem":a==="concluido"?"concluido":"";return s?[{valor:s,rotulo:n}]:[]});return{responsaveis:je(o,t=>t.atribuicao?[{valor:t.atribuicao.sigla,rotulo:`${t.atribuicao.nome} (${t.atribuicao.sigla})`}]:[{valor:"sem",rotulo:"Sem respons\xE1vel"}]),tipos:je(o,t=>t.tipo?[{valor:t.tipo,rotulo:t.tipo}]:[]),marcadores:je(o,t=>t.marcadores.length?t.marcadores.map(a=>({valor:a.nome,rotulo:a.nome})):[{valor:"sem",rotulo:"Sem marcador"}]),prazos:r}}function Zr(o){let e=[];o.sigiloso&&e.push("Sigiloso"),o.naoVisualizado&&e.push("N\xE3o visualizado"),o.documentoNovo&&e.push("Documento novo"),o.urgente&&e.push("Urgente"),o.trancado&&e.push("Trancado"),o.acompanhamentoEspecial&&e.push(o.acompanhamentoGrupo?`Acompanhamento especial (${o.acompanhamentoGrupo})`:"Acompanhamento especial");for(let r of o.retornos)e.push(`${r.tipo==="aguardando"?"Aguardando retorno":"Retorno programado"}${r.atrasado?" (atrasado)":""}`);return e}function Yr(o,e){let r=po(o,e);if(!o.prazo||!r)return"";let t=o.prazo.vencimento??o.prazo.inicio;return`${t?fo(t):""}${o.prazo.hora?` ${o.prazo.hora}`:""} (${r.texto})`.trim()}var tl=(o,e,r)=>{switch(e){case"processo":return o.protocolo;case"tipo":return o.tipo;case"especificacao":return o.especificacao;case"responsavel":return o.atribuicao?o.atribuicao.nome===o.atribuicao.sigla?o.atribuicao.sigla:`${o.atribuicao.nome} (${o.atribuicao.sigla})`:"";case"marcadores":return o.marcadores.map(t=>t.texto?`${t.nome}: ${t.texto}`:t.nome).join("; ");case"prazo":return Yr(o,r);case"anotacao":return o.anotacao?.texto.replace(/\s*\n\s*/g," / ")??"";case"caixa":return Uo(Ao(o,r));case"parado":return Uo(Co(o,r));case"sinais":return Zr(o).join("; ")}};function Wn(o,e,r){return[e.map(t=>_o[t]),...o.map(t=>e.map(a=>tl(t,a,r)))]}var Zn=o=>`processos-${o}.csv`;function Yn(o,e,r){let t=[];for(let a of o){let n=r&&e.has(a.chave);if(r&&t.push({tipo:"grupo",grupo:a,recolhido:n}),!n)for(let s of a.itens)t.push({tipo:"processo",processo:s,grupo:a.chave})}return t}var ot=new Intl.Collator("pt-BR",{numeric:!0,sensitivity:"base"});function os(o){let e=/(\d+)\/(\d{4})-\d+\s*$/.exec(o);if(!e)return null;let r=/(\d+)\s*$/.exec(e[1].split(/[.-]/).pop()??"")?.[1]??e[1];return[Number(e[2]),Number(r)]}function al(o,e){let r=os(o),t=os(e);return r&&t&&(r[0]-t[0]||r[1]-t[1])||ot.compare(o,e)}function es(o,e,r){switch(e){case"tipo":return o.tipo||null;case"responsavel":return o.atribuicao?.sigla??null;case"marcador":return o.marcadores[0]?.nome??null;case"prazo":{let t=po(o,r);return t?t.ordem:null}case"caixa":return Ao(o,r);case"parado":return Co(o,r);case"novo":return o.naoVisualizado?0:1}}function nl(o,e){return(r,t)=>{for(let a of o){let n;if(a.campo==="protocolo")n=al(r.protocolo,t.protocolo),a.decrescente&&(n=-n);else{let s=es(r,a.campo,e),i=es(t,a.campo,e);if(s===null&&i===null)continue;if(s===null)return 1;if(i===null)return-1;n=typeof s=="number"&&typeof i=="number"?s-i:ot.compare(String(s),String(i)),a.decrescente&&(n=-n)}if(n)return n}return 0}}function rs(o,e,r){return e.length?[...o].sort(nl(e,r)):o}function ts(o,e,r){let t=o.findIndex(s=>s.campo===e),a=t<0?{campo:e,decrescente:!1}:o[t].decrescente?null:{campo:e,decrescente:!0};if(!r)return a?[a]:[];if(t<0)return[...o,a];let n=[...o];return a?n[t]=a:n.splice(t,1),n}var et=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0}),yo="sem";function as(o,e,r,t={}){let a=new Map,n=(i,c,l,u,p)=>{let m=a.get(i);return m||(m={chave:i,titulo:c,itens:[],aceitaSoltar:l,excedeu:!1,...u?{motivoSomenteLeitura:u}:{},...p?{tom:p}:{}},a.set(i,m)),m};if(e.colunas==="marcador"){n(yo,"Sem marcador",!0);for(let i of[...t.marcadores??[]].sort(et.compare))n(`m:${i}`,i,!0);for(let i of o){i.marcadores.length||n(yo,"Sem marcador",!0).itens.push(i);for(let c of i.marcadores)n(`m:${c.nome}`,c.nome,!0).itens.push(i)}}else if(e.colunas==="responsavel"){n(yo,"Sem respons\xE1vel",!0);for(let i of t.responsaveis??[])n(`u:${i.sigla}`,`${i.nome} (${i.sigla})`,!0);for(let i of o)i.atribuicao?n(`u:${i.atribuicao.sigla}`,`${i.atribuicao.nome} (${i.atribuicao.sigla})`,!0).itens.push(i):n(yo,"Sem respons\xE1vel",!0).itens.push(i)}else if(e.colunas==="prazo"){for(let[i,c,l]of Qo)i!=="desde"&&n(i,c,!1,"O prazo \xE9 definido pelo bot\xE3o de prazo, n\xE3o arrastando.",l);for(let i of o){let c=ce(i,r);n(c==="desde"?"sem":c,"",!1).itens.push(i)}}else for(let i of o)n(`t:${i.tipo}`,i.tipo||"Sem tipo",!1,"O tipo do processo n\xE3o muda arrastando.").itens.push(i);let s=[...a.values()];if(e.colunas==="prazo"&&(s=s.filter(i=>i.itens.length||i.titulo)),e.colunas==="marcador"||e.colunas==="responsavel"?s.sort((i,c)=>i.chave===yo?-1:c.chave===yo?1:et.compare(i.titulo,c.titulo)):e.colunas==="tipo"&&s.sort((i,c)=>et.compare(i.titulo,c.titulo)),e.limite>0)for(let i of s)i.excedeu=i.itens.length>e.limite;return s}var Ge=o=>o.slice(o.indexOf(":")+1);function ns(o,e,r,t){if(r===t)return{ok:!1,motivo:"Mesma coluna."};if(o==="marcador"){let a=r===yo?void 0:Ge(r),n=t===yo?void 0:Ge(t);if(a&&!e.marcadores.some(l=>l.nome===a))return{ok:!1,motivo:"O processo j\xE1 n\xE3o tem esse marcador."};let s=n?e.marcadores.some(l=>l.nome===n):!1,i=a?e.marcadores.find(l=>l.nome===a)?.texto:void 0,c={tipo:"marcador",id:e.id,protocolo:e.protocolo};return a&&(c.remover=a),n&&!s&&(c.adicionar=n,i&&(c.texto=i)),!c.remover&&!c.adicionar?{ok:!1,motivo:"Nada a mudar."}:{ok:!0,movimento:c}}return o==="responsavel"?{ok:!0,movimento:{tipo:"atribuicao",id:e.id,protocolo:e.protocolo,para:t===yo?null:Ge(t),de:r===yo?null:Ge(r)}}:{ok:!1,motivo:"Esta divis\xE3o do quadro \xE9 s\xF3 de leitura."}}function rt(o,e,r={}){if(e.tipo==="atribuicao"){if(e.para===null){let{atribuicao:a,...n}=o;return n}return{...o,atribuicao:{sigla:e.para,nome:r[e.para]??e.para}}}let t=o.marcadores;return e.remover&&(t=t.filter(a=>a.nome!==e.remover)),e.adicionar&&(t=[...t,{nome:e.adicionar,cor:"",texto:e.texto??""}]),{...o,marcadores:t}}function Jo(o,e){let r=o.ownerDocument??document;for(let n of Array.from(o.querySelectorAll("dialog.spro-dialogo-grade")))n.remove();let t=d("dialog",{class:`spro-dialogo spro-dialogo-grade${e.largo?" spro-dialogo-largo":""}`,"aria-label":e.titulo}),a=()=>{t.open?t.close():t.remove()};return t.append(d("header",{},e.icone?d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},_(e.icone,18)):null,d("h2",{},e.titulo,e.subtitulo?d("small",{class:"spro-dialogo-sub"},e.subtitulo):null),d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:a},_("fechar",16))),d("div",{class:"spro-dialogo-corpo"},e.conteudo)),t.addEventListener("close",()=>{t.remove(),e.aoFechar?.()}),o.append(t),typeof t.showModal=="function"?t.showModal():t.setAttribute("open",""),t.querySelector(".spro-combo, textarea, input:not([type=checkbox])")?.focus({preventScroll:!0}),{fechar:a,dlg:t}}var sl=["autuacao","recebimento","envio","unidadeEnvio"],de=o=>sl.includes(o);function il(o){let e=Math.floor(o/6e4);return e<1?"agora h\xE1 pouco":e<60?`h\xE1 ${e} min`:`h\xE1 ${Math.floor(e/60)} h`}var le=(o,e,r)=>`${o} ${o===1?e:r}`;function ss(o){let e={},r=null,t=!1,a=!1,n,s=d("div",{class:"spro-andamento",hidden:!0,role:"status","aria-live":"polite"}),i=()=>o.processos().filter(h=>!!h.link&&!h.sigiloso&&!h.naoVisualizado),c=()=>Object.values(e).filter(h=>te(h,o.agora())),l=()=>i().filter(h=>!e[h.id]||!te(e[h.id],o.agora())),u=()=>{let h=o.processos();return{naoVistos:h.filter(S=>S.naoVisualizado&&!S.sigiloso).length,sigilosos:h.filter(S=>S.sigiloso).length,semLink:h.filter(S=>!S.link&&!S.sigiloso&&!S.naoVisualizado).length}};async function p(){try{e=await o.armazem.lerAndamentos(o.agora())}catch{e={}}o.aoMudar()}function m(h,S){return new Promise(D=>{let w=!1,I=u(),R=[];I.naoVistos&&R.push(`${le(I.naoVistos,"processo ainda n\xE3o visualizado","processos ainda n\xE3o visualizados")} nesta unidade (abrir o andamento o marcaria como visualizado ou recebido em seu nome)`),I.sigilosos&&R.push(`${le(I.sigilosos,"processo sigiloso","processos sigilosos")}`);let Z=d("button",{type:"button",class:"spro-botao primario",onclick:()=>{w=!0,D(!0),A.fechar()}},_("busca",15),"Consultar andamento"),G=d("div",{class:"spro-confirma-andamento"},d("p",{},"Para agrupar por data ou por unidade de envio, o SEI Pro precisa ",d("strong",{},"abrir o andamento de cada processo, um por um")," no SEI. A consulta \xE9 s\xF3 de leitura, mas faz v\xE1rias requisi\xE7\xF5es por processo e pode levar alguns minutos."),d("p",{},d("strong",{},`Ser\xE3o consultados ${le(h,"processo","processos")}.`),S?` Outros ${S} j\xE1 est\xE3o guardados e ficam como est\xE3o.`:""),R.length?d("div",{},d("p",{},"Ficam de fora:"),d("ul",{},...R.map(T=>d("li",{},T)))):null,d("p",{class:"spro-suave"},"O resultado fica guardado neste navegador por 24 horas: ao recarregar a p\xE1gina, ele reaparece sem nova consulta. Voc\xEA pode cancelar a consulta a qualquer momento."),d("div",{class:"spro-dialogo-rodape"},Z)),A=Jo(o.sombra,{titulo:"Consultar o andamento dos processos",icone:"alerta",conteudo:G,aoFechar:()=>D(w)})})}function v(){if(o.semDebounce)return o.aoMudar();n||(n=setTimeout(()=>{n=void 0,t||o.aoMudar()},400))}async function x(){try{await o.armazem.gravarAndamentos(e)}catch{}}async function M(h){if(r||!h.length||t)return;let S=new AbortController;r={ctl:S,progresso:{feitos:0,total:h.length,semDados:0}},O();let D=0,w=await Va({alvos:h,sinal:S.signal,simultaneas:o.simultaneas,pausaMs:o.pausaMs,esperar:o.esperar,consultar:(I,R)=>o.consultar(I,R),aoResolver:(I,R,Z,G)=>{r&&(r.progresso=Z),G||(e[I.id]={...R??{},consultadoEm:o.agora()}),D+=1,D>=10&&(D=0,x()),O(),v()}});r=null,await x(),clearTimeout(n),n=void 0,!t&&(o.aoMudar(),w.motivo==="sessao"?o.aviso("A sess\xE3o do SEI expirou: a consulta parou. O que j\xE1 foi lido ficou guardado."):w.motivo==="erros"?o.aviso("O SEI parou de responder: a consulta foi interrompida. O que j\xE1 foi lido ficou guardado."):w.motivo==="concluida"&&o.aviso(`Andamento consultado: ${le(w.progresso.feitos-w.progresso.semDados,"processo","processos")} com dados${w.progresso.semDados?`, ${w.progresso.semDados} sem informa\xE7\xE3o`:""}.`))}async function b(h){if(r)return!0;let S=h==="todos"?i():l();if(!S.length)return o.aviso(h==="todos"?"Nenhum processo eleg\xEDvel para consultar.":"Todos os processos j\xE1 t\xEAm o andamento guardado."),!1;let D=h==="todos"?0:i().length-S.length;return await m(S.length,D)?(M(S),!0):!1}async function C(){return r||!l().length?!0:await b("novo")||c().length>0}function O(){if(s.hidden=!a||t,s.hidden)return;if(r){let{feitos:I,total:R}=r.progresso;s.replaceChildren(d("span",{},`Consultando o andamento dos processos\u2026 ${I} de ${R}`),d("progress",{max:String(R),value:String(I),"aria-label":"Progresso da consulta"}),d("button",{type:"button",class:"spro-link",onclick:()=>r?.ctl.abort()},"Cancelar"));return}let h=c();if(!h.length){s.replaceChildren(d("span",{},'O andamento dos processos ainda n\xE3o foi consultado, por isso todos aparecem em "Sem informa\xE7\xE3o".'),d("button",{type:"button",class:"spro-link",onclick:()=>void b("novo")},"Consultar agora"));return}let S=Math.min(...h.map(I=>I.consultadoEm)),D=S+Or,w=l().length;s.replaceChildren(d("span",{},`Andamento consultado ${il(o.agora()-S)} (guardado at\xE9 ${new Date(D).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})`,w?` \xB7 ${le(w,"processo ainda sem consulta","processos ainda sem consulta")}`:""),d("button",{type:"button",class:"spro-link",onclick:()=>void b("todos")},_("atualizar",13)," Atualizar"))}return{faixa:s,carregar:p,dados:()=>e,definirAtivo(h){a=h,O()},atualizarFaixa:O,aoEscolherAgrupamento:C,pedir:b,emAndamento:()=>!!r,fechar(){t=!0,r?.ctl.abort(),clearTimeout(n)}}}var tt="application/x-spro-cartao";function cl(o,e,r){let t=po(o,r.ctx),a=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${o.protocolo}`});a.checked=r.selecionados.has(o.id),a.addEventListener("change",()=>r.aoSelecionar(o.id,a.checked));let n=d("div",{class:`spro-cartao${a.checked?" spro-sel":""}`,draggable:"true","data-id":o.id,"data-de":e},d("div",{class:"spro-cartao-topo"},a,d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",draggable:"false"},o.protocolo)),o.tipo?d("div",{class:"spro-cartao-tipo"},o.tipo):null,o.especificacao?d("div",{class:"spro-cartao-espec"},o.especificacao):null,d("div",{class:"spro-cartao-rodape"},t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`,title:t.dica},t.texto):null,o.atribuicao?d("span",{class:"spro-avatar",title:o.atribuicao.nome},o.atribuicao.sigla.slice(0,2).toUpperCase()):null));return n.addEventListener("dragstart",s=>{s.dataTransfer?.setData(tt,JSON.stringify({id:o.id,de:e})),s.dataTransfer?.setData("text/plain",o.protocolo),s.dataTransfer&&(s.dataTransfer.effectAllowed="move"),n.classList.add("spro-arrastando")}),n.addEventListener("dragend",()=>n.classList.remove("spro-arrastando")),n}function ll(o,e){let r=d("div",{class:"spro-col-corpo"},...o.itens.map(s=>cl(s,o.chave,e)));o.itens.length||r.append(d("div",{class:"spro-col-vazia"},o.aceitaSoltar?"Solte aqui":"Vazia"));let t=e.cfg.limite,a=d("div",{class:"spro-col-topo"},d("span",{class:"spro-col-titulo",title:o.titulo},o.titulo),d("span",{class:`spro-col-n${o.excedeu?" spro-excedeu":""}`,title:o.excedeu?`Passou do limite de ${t}`:void 0},t>0?`${o.itens.length}/${t}`:String(o.itens.length)),o.aceitaSoltar?null:d("span",{class:"spro-col-trava",title:o.motivoSomenteLeitura},uo("bloquear",13))),n=d("section",{class:`spro-col${o.tom?` spro-tom-${o.tom}`:""}${o.excedeu?" spro-col-cheia":""}`,"data-chave":o.chave},a,r);return n.addEventListener("dragover",s=>{s.dataTransfer?.types.includes(tt)&&o.aceitaSoltar&&(s.preventDefault(),n.classList.add("spro-alvo"))}),n.addEventListener("dragleave",()=>n.classList.remove("spro-alvo")),n.addEventListener("drop",s=>{n.classList.remove("spro-alvo");let i=s.dataTransfer?.getData(tt);if(i){s.preventDefault();try{let{id:c,de:l}=JSON.parse(i);e.aoMover(c,l,o.chave)}catch{}}}),n}function is(o){let e=d("div",{class:"spro-quadro"}),r=t=>d("div",{class:"spro-colunas"},...as(t,o.cfg,o.ctx,o.extras).map(a=>ll(a,o)));if(o.cfg.raiasPorResponsavel&&o.cfg.colunas!=="responsavel")for(let t of Fe(o.processos,"responsavel",o.ctx))e.append(d("div",{class:"spro-raia"},d("div",{class:"spro-raia-nome"},t.rotulo,d("span",{class:"spro-grupo-n"},String(t.itens.length))),r(t.itens)));else e.append(r(o.processos));return o.processos.length||e.prepend(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro.")),e}var cs=".spro-fav-estrela, .spro-prj-ic, .spro-dem-cx",dl=[".spro-fav-",".spro-prj-",".spro-dem-cx"],ls=(o,e)=>o.getElementById(`P${e}`)?.querySelectorAll("td")[1],Ue=["spro-fav-estrela","spro-prj-ic","spro-dem-cx"],at=o=>Ue.find(e=>o.classList.contains(e))??"";function ul(o,e,r){for(let t of Array.from(o.attributes))!e.hasAttribute(t.name)&&t.name!=="data-spro-id"&&t.name!=="data-tip"&&o.removeAttribute(t.name);for(let t of Array.from(e.attributes))t.name!=="aria-busy"&&t.name!=="title"&&o.getAttribute(t.name)!==t.value&&o.setAttribute(t.name,t.value);e.getAttribute("title")&&o.getAttribute("data-tip")!==e.getAttribute("title")&&o.setAttribute("data-tip",e.getAttribute("title")),o.removeAttribute("aria-busy"),o.setAttribute("data-spro-id",r),o.innerHTML!==e.innerHTML&&o.replaceChildren(...Array.from(e.cloneNode(!0).childNodes))}function ds(){let o=new Map;return function(r,t){let a=ls(r,t),n=new Set,s=[];if(a){let i=[...a.querySelectorAll(cs)].sort((c,l)=>Ue.indexOf(at(c))-Ue.indexOf(at(l)));for(let c of i){let l=`${t}|${at(c)}`;n.add(l);let u=o.get(l);u?ul(u,c,t):(u=c.cloneNode(!0),u.removeAttribute("aria-busy"),u.setAttribute("data-spro-id",t),o.set(l,u)),s.push(u)}}for(let i of Ue)n.has(`${t}|${i}`)||o.delete(`${t}|${i}`);return s}}function nt(o,e){let r=ls(o,e);return r?[...r.querySelectorAll(`${cs}, .acompanhamentoesp_icon`)].map(t=>`${t.className}|${t.getAttribute("aria-pressed")??""}|${t.getAttribute("aria-label")??""}|${t.hasAttribute("data-atraso")?1:0}|${t.querySelector('[class$="-n"]')?.textContent??""}`).join(";"):""}function us(o){let e=[];for(let r of Array.from(o.styleSheets??[])){let t;try{t=r.cssRules}catch{continue}for(let a of Array.from(t)){let n=a.cssText;dl.some(s=>n.includes(s))&&e.push(n)}}return e.join(`
`)}function ps(o,e){let r=s=>s.trim().toLowerCase(),t=new Map;for(let s of e)s.nome.trim()&&!t.has(r(s.nome))&&t.set(r(s.nome),{nome:s.nome.trim(),texto:s.texto.trim().slice(0,250)});let a=new Map(o.map(s=>[r(s.nome),s])),n=[];for(let s of o)t.has(r(s.nome))||n.push({tipo:"remover",nome:s.nome});for(let[s,i]of t)a.has(s)||n.push({tipo:"adicionar",nome:i.nome,texto:i.texto});for(let[s,i]of t){let c=a.get(s);c&&c.texto.trim()!==i.texto&&n.push({tipo:"texto",nome:c.nome,texto:i.texto})}return n}function ms(o,e,r=()=>""){let t=[...o.marcadores];for(let a of e)a.tipo==="remover"?t=t.filter(n=>n.nome!==a.nome):a.tipo==="adicionar"?t.push({nome:a.nome,cor:r(a.nome),texto:a.texto}):t=t.map(n=>n.nome===a.nome?{...n,texto:a.texto}:n);return{...o,marcadores:t}}function Be(o){return o.replace(/\r\n?/g,`
`).trim().slice(0,500)}function fs(o,e,r,t=""){let a=Be(e);if(!a){let{anotacao:n,...s}=o;return s}return{...o,anotacao:{texto:a,autor:o.anotacao?.autor??t,prioridade:r}}}function gs(o,e){if(!e){let{atribuicao:r,...t}=o;return t}return{...o,atribuicao:e}}function Xe(o,e,r,t,a){let n=new Set([o.id]);if(t)for(let s of e)n.add(s);return r.filter(s=>n.has(s.id)&&a(s))}function st(o,e){let r=new Set(e.marcadores.map(t=>t.nome.trim().toLowerCase()));return o.filter(t=>{let a=r.has(t.nome.trim().toLowerCase());return t.tipo==="adicionar"?!a:a})}var pl=30;function ml(o){let e=[],r=(a,n)=>{let s=a?.getAttribute("data-tarefa");e.push({marca:s==null?null:s==="x",texto:n.replace(/\u00a0/g," ").replace(/\n+$/,"")})},t="";for(let a of Array.from(o.childNodes))if(a.nodeType===3)t+=a.textContent??"";else if(a.nodeType===1){let n=a;if(t){for(let s of t.split(`
`))r(null,s);t=""}n.tagName==="BR"?r(null,""):r(n,n.textContent??"")}if(t)for(let a of t.split(`
`))r(null,a);return e.length?e:[{marca:null,texto:""}]}function hs(o,e){let r=o.ownerDocument;o.replaceChildren(...e.map(t=>{let a=r.createElement("div");return a.className="spro-pi-linha",t.marca!==null&&a.setAttribute("data-tarefa",t.marca?"x":"o"),t.texto?a.textContent=t.texto:a.append(r.createElement("br")),a}))}function bs(o,e){let r=o.prioridade,t=()=>{},a=d("div",{class:"spro-pi-editor",contenteditable:"true",role:"textbox","aria-multiline":"true","aria-label":"Anota\xE7\xE3o",spellcheck:"true"}),n=d("span",{class:"spro-pi-contador"}),s=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Lista de tarefas (nas linhas selecionadas)","aria-label":"Lista de tarefas"},_("check",16)),i=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Prioridade","aria-label":"Prioridade"},uo("prioridade",16)),c=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Inserir a data de hoje","aria-label":"Inserir a data de hoje"},_("calendario",16)),l=d("div",{class:"spro-pi-barra"},s,c,i,n),u=d("div",{class:"spro-pi"},a,l),p=()=>ml(a),m=()=>Za(p());function v(){u.classList.toggle("spro-pi-prio",r),i.setAttribute("aria-pressed",String(r));let b=m().length;n.textContent=`${b}/${500}`,n.classList.toggle("spro-pi-estouro",b>500),t()}hs(a,ne(o.texto)),v();function x(){let b=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,C=Array.from(a.children),O=I=>{let R=I;for(;R&&R.parentNode!==a;)R=R.parentNode;return R?C.indexOf(R):-1};if(!b||!b.rangeCount)return[];let h=O(b.anchorNode),S=O(b.focusNode);if(h<0&&S<0)return[];let[D,w]=[Math.min(h<0?S:h,S<0?h:S),Math.max(h,S)];return Array.from({length:w-D+1},(I,R)=>D+R)}let M=b=>{hs(a,b),v()};for(let b of[s,c,i])b.addEventListener("mousedown",C=>C.preventDefault());return s.addEventListener("click",()=>{let b=p(),C=x();M(Lr(b,C.length?C:b.map((O,h)=>h).filter(O=>O===b.length-1))),a.focus()}),i.addEventListener("click",()=>{r=!r,v()}),c.addEventListener("click",()=>{a.focus();let b=fo(Fo());e.ownerDocument.execCommand?.("insertText",!1,b)||(a.append(b),v())}),a.addEventListener("input",v),a.addEventListener("paste",b=>{b.preventDefault();let C=b.clipboardData?.getData("text/plain")??"";e.ownerDocument.execCommand?.("insertText",!1,C.replace(/\r\n?/g,`
`))}),a.addEventListener("mousedown",b=>{let C=b.target.closest?.(".spro-pi-linha");!C||!C.hasAttribute("data-tarefa")||b.clientX-C.getBoundingClientRect().left>pl||(b.preventDefault(),M(Ya(p(),Array.from(a.children).indexOf(C))))}),a.addEventListener("keydown",b=>{if(b.key!=="Enter"||b.shiftKey)return;let C=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,O=x(),h=p();C?.isCollapsed&&O.length===1&&h[O[0]]?.marca!==null&&!h[O[0]].texto.trim()&&(b.preventDefault(),M(Lr(h,[O[0]])))}),{el:u,texto:m,prioridade:()=>r,aoMudar:b=>{t=b},foco:()=>{a.focus()}}}var fl=[[/azul_marinho|marinho/,"#1d3557"],[/azul_claro|ciano|celeste/,"#2a9fd6"],[/azul/,"#2563c9"],[/verde_escuro/,"#166534"],[/verde|lima/,"#2e9e4f"],[/amarelo/,"#e0b000"],[/laranja/,"#ee7d11"],[/vermelho/,"#d1352b"],[/rosa|magenta/,"#d6409f"],[/roxo|violeta|lilas/,"#7048c6"],[/marrom/,"#8a5a3c"],[/preto/,"#222831"],[/cinza/,"#7b838c"]];function ue(o){let e=o.toLowerCase();return fl.find(([r])=>r.test(e))?.[1]??"#8b939c"}var hl=o=>o instanceof Error?o.message:String(o);async function it(o,e,r,t,a){let n=0,s=[],i=0;for(let c of e){let l=o.todos().find(u=>u.id===c.id)??c;o.aplicarLocal(l.id,r(l));try{await o.gravar(()=>t(l)),n+=1}catch(u){o.aplicarLocal(l.id,l),s.push(`${l.protocolo}: ${hl(u)}`)}a?.(i+=1,e.length)}return{ok:n,falhas:s}}function ct(o,e,r){e.falhas.length?o.aviso(`${r}: ${e.ok} ok, ${e.falhas.length} com erro \u2014 ${e.falhas[0]}`):o.aviso(`${r}: ${e.ok} ${e.ok===1?"processo atualizado":"processos atualizados"}.`)}function vs(o,e,r){let t=Xe(e,o.selecionados(),o.todos(),!0,r).filter(n=>n.id!==e.id);if(!t.length)return null;let a=d("input",{type:"checkbox"});return{el:d("label",{class:"spro-rotulo-linha spro-estender"},a,` Aplicar tamb\xE9m aos ${t.length} ${t.length===1?"outro selecionado":"outros selecionados"}`),marcado:()=>a.checked,n:()=>t.length}}var lt=(...o)=>d("div",{class:"spro-dialogo-rodape"},...o),dt=(o="Salvar")=>d("button",{type:"button",class:"spro-botao primario"},_("check",15),o);function xs(o,e){let r=[],t=e.atribuicao?.sigla??"",a=Oo({rotulo:"Respons\xE1vel",icone:"pessoa",busca:!0,larguraLista:320,vazio:"Escolher o respons\xE1vel\u2026",opcoes:()=>[{valor:"",rotulo:"Sem respons\xE1vel",descricao:"Remove a atribui\xE7\xE3o"},...r.map(u=>({valor:u.sigla,rotulo:u.nome===u.sigla?u.sigla:u.nome,descricao:u.sigla}))],valor:[t],aoMudar:([u])=>{t=u??"",c()}}),n=vs(o,e,()=>!0),s=dt(),i=d("p",{class:"spro-suave"},"Carregando os usu\xE1rios da unidade\u2026"),c=()=>{s.disabled=!r.length||t===(e.atribuicao?.sigla??"")},l=Jo(o.raiz,{titulo:"Respons\xE1vel",subtitulo:e.protocolo,icone:"pessoa",conteudo:d("div",{class:"spro-form"},d("label",{class:"spro-campo-rotulo"},"Atribuir a",a.el),i,n?.el??null,lt(s))});o.extras().then(u=>{r=u.responsaveis??[],i.textContent=r.length?"":"N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade.",a.atualizar(),c()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade."}),c(),s.addEventListener("click",async()=>{let u=t?r.find(m=>m.sigla===t)??{sigla:t,nome:t}:null,p=n?.marcado()?Xe(e,o.selecionados(),o.todos(),!0,()=>!0):[e];s.disabled=!0,l.fechar(),ct(o,await it(o,p,m=>gs(m,u),m=>o.atribuir(m.protocolo,u?.sigla??null)),u?`Respons\xE1vel: ${u.nome}`:"Atribui\xE7\xE3o removida")})}function As(o,e){let r=bs({texto:e.anotacao?.texto??"",prioridade:e.anotacao?.prioridade??!1},o.raiz),t=dt(),a=e.anotacao?d("button",{type:"button",class:"spro-botao perigo"},_("lixeira",15),"Remover anota\xE7\xE3o"):null,n=()=>{let c=Be(r.texto()),l=r.texto().length>500;t.disabled=!c||l||c===(e.anotacao?.texto??"")&&r.prioridade()===(e.anotacao?.prioridade??!1)};r.aoMudar(n);let s=Jo(o.raiz,{titulo:"Anota\xE7\xE3o",subtitulo:e.protocolo,icone:"nota",largo:!0,conteudo:d("div",{class:"spro-form"},r.el,e.anotacao?.autor?d("p",{class:"spro-suave"},`\xDAltima edi\xE7\xE3o: ${e.anotacao.autor}`):null,lt(a,t))});r.foco(),n();let i=async(c,l,u)=>{s.fechar(),ct(o,await it(o,[e],p=>fs(p,c,l,o.autor),p=>o.anotar(p.protocolo,{texto:c,prioridade:l})),u)};t.addEventListener("click",()=>void i(Be(r.texto()),r.prioridade(),"Anota\xE7\xE3o salva")),a?.addEventListener("click",()=>void i("",!1,"Anota\xE7\xE3o removida"))}function Es(o,e){let r=e.marcadores.map(m=>({nome:m.nome,texto:m.texto})),t=[],a=d("div",{class:"spro-marcadores-lista"}),n=vs(o,e,m=>!m.sigiloso),s=dt(),i=d("p",{class:"spro-suave"},"Carregando os marcadores da unidade\u2026"),c=Oo({rotulo:"Adicionar marcador",icone:"etiqueta",busca:!0,larguraLista:320,vazio:"Adicionar marcador\u2026",opcoes:()=>t.filter(m=>!r.some(v=>v.nome.toLowerCase()===m.toLowerCase())).map(m=>({valor:m,rotulo:m,cor:ue(o.corDoMarcador(m))})),aoMudar:([m])=>{m&&(r=[...r,{nome:m,texto:""}],c.definir([],!1),u())}}),l=()=>ps(e.marcadores,r);function u(){a.replaceChildren(...r.length?r.map((m,v)=>{let x=d("input",{type:"text",class:"spro-campo",maxlength:String(250),placeholder:"Texto do marcador (opcional)","aria-label":`Texto de ${m.nome}`,value:m.texto});return x.addEventListener("input",()=>{r[v]={...m,texto:x.value},s.disabled=!l().length}),d("div",{class:"spro-marcador-linha"},d("span",{class:"spro-marcador",title:m.nome},d("i",{style:`background:${ue(o.corDoMarcador(m.nome))}`}),m.nome),x,d("button",{type:"button",class:"spro-botao-icone pequeno",title:`Remover ${m.nome}`,"aria-label":`Remover ${m.nome}`,onclick:()=>{r=r.filter((M,b)=>b!==v),u()}},_("fechar",13)))}):[d("p",{class:"spro-suave"},"Nenhum marcador. Adicione abaixo.")]),c.atualizar(),s.disabled=!l().length}let p=Jo(o.raiz,{titulo:"Marcadores",subtitulo:e.protocolo,icone:"etiqueta",conteudo:d("div",{class:"spro-form"},a,c.el,i,n?.el??null,lt(s))});u(),o.extras().then(m=>{t=m.marcadores??[],i.textContent=t.length?"":"N\xE3o foi poss\xEDvel ler os marcadores da unidade.",u()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os marcadores da unidade."}),s.addEventListener("click",async()=>{let m=l();if(!m.length)return;let v=n?.marcado()?Xe(e,o.selecionados(),o.todos(),!0,x=>!x.sigiloso):[e];p.fechar(),ct(o,await it(o,v,x=>ms(x,st(m,x),o.corDoMarcador),async x=>{for(let M of st(m,x))M.tipo==="remover"?await o.marcar(x.protocolo,{marcador:M.nome,remover:!0}):await o.marcar(x.protocolo,{marcador:M.nome,texto:M.texto})}),"Marcadores")})}function ys(o,e,r,t,a=8){let n=Math.max(1,e),s=t>0?t:n*40,i=Math.max(0,Math.min(o,Math.floor(r/n)-a)),c=Math.min(o,Math.ceil((r+s)/n)+a);return{inicio:i,fim:c,antes:i*n,depois:Math.max(0,o-c)*n}}async function bl(o,e){let r=o.defaultView?.navigator?.clipboard?o.defaultView.navigator:globalThis.navigator;try{if(r?.clipboard?.writeText)return await r.clipboard.writeText(e),!0}catch{}try{let t=d("textarea",{readonly:!0,"aria-hidden":"true",style:"position:fixed;top:0;left:-9999px;opacity:0"});t.value=e,o.body.append(t),t.select();let a=o.execCommand("copy");return t.remove(),a}catch{return!1}}var vl=1500;function Ps(o){let r=p=>`${p}${o.compacto?" spro-acao-num-compacta":""}`,t=`Abrir ${o.protocolo} em nova aba`,a;o.href?(a=d("a",{class:r("spro-nova-guia"),href:o.href,target:"_blank",rel:"noopener","aria-label":t},_("novaAba",14)),a.addEventListener("click",p=>p.stopPropagation())):(a=d("button",{type:"button",class:r("spro-nova-guia"),"aria-label":t},_("novaAba",14)),a.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),o.aoAbrirNovaAba?.()})),a.addEventListener("keydown",p=>p.stopPropagation());let n=o.copiar??(p=>bl(o.doc,p)),s=d("span",{class:"spro-sr",role:"status","aria-live":"polite"}),i=d("button",{type:"button",class:r("spro-copiar-num"),"aria-label":"Copiar n\xFAmero do processo"},_("copiar",14),s),c,l=p=>{i.classList.toggle("spro-copiado",p),i.querySelector("svg")?.replaceWith(_(p?"check":"copiar",14))};i.addEventListener("keydown",p=>p.stopPropagation()),i.addEventListener("click",p=>{p.preventDefault(),p.stopPropagation(),n(o.protocolo).then(m=>{s.textContent=m?"N\xFAmero copiado":"N\xE3o foi poss\xEDvel copiar",m&&(l(!0),clearTimeout(c),c=setTimeout(()=>{l(!1),s.textContent=""},vl))})});let u=o.doc.createDocumentFragment();return u.append(a,i),u}var ut=5e3,ws=120,xl=480,Al=24,El=96,yl="spro_altura:",Pl={},Ss=new WeakMap,Sl=o=>{let e=o??Pl,r=Ss.get(e);if(r)return r;let t=new Map;return Ss.set(e,t),t};function wl(o,e=ws,r=ut){let t=typeof o=="object"&&o!==null?o:{},a=typeof t.px=="number"&&Number.isFinite(t.px)?Math.round(Math.min(r,Math.max(e,t.px))):null;return{auto:t.auto===!0,px:a}}function Ms(o){let{rolagem:e}=o,r=e.ownerDocument,t=o.minPx??ws,a=Math.max(t,o.maxPx??ut),n=o.area??null,s=Sl(n),i=`${yl}${o.chave}`,c=o.padraoVh!==void 0?`${o.padraoVh}vh`:`${o.padraoPx??xl}px`,l=P=>Math.round(Math.min(a,Math.max(t,P))),u=s.get(o.chave)??{auto:!1,px:null},p=s.has(o.chave),m=!1,v=0,x=null,M=`spro-altura-${o.chave.replace(/[^\w-]/g,"-")}`;e.classList.add("spro-altura-rolagem"),e.id||(e.id=M);let b=d("div",{class:"spro-altura-alca",role:"separator","aria-orientation":"horizontal","aria-label":o.rotulo??"Redimensionar a altura da lista","aria-controls":e.id,"aria-valuemin":String(t),"aria-valuemax":String(a),tabindex:"0"}),C=()=>{let P=e.getBoundingClientRect?.().height||e.offsetHeight||0;return P>0?P:u.px??t};function O(){e.style.setProperty("--spro-altura-max",u.auto?`${ut}px`:u.px!==null?`${u.px}px`:c);let P=u.auto?"auto":"limitada";e.setAttribute("data-altura",P),b.setAttribute("data-altura",P);let L=Math.round(C());b.setAttribute("aria-valuenow",String(Math.min(a,Math.max(t,L)))),b.setAttribute("aria-valuetext",u.auto?"Ajustada ao conte\xFAdo":`${L} pixels`),b.setAttribute("title",u.auto?"Duplo clique: voltar \xE0 altura limitada":"Arraste para mudar a altura. Duplo clique: ajustar ao conte\xFAdo")}function h(){if(s.set(o.chave,{...u}),!!n)try{n.gravar({[i]:{auto:u.auto,px:u.px}}).catch(()=>{})}catch{}}function S(P){let L=()=>{v=0,m||o.aoMudar?.({...u})},F=r.defaultView;if(P||!F?.requestAnimationFrame){v&&F?.cancelAnimationFrame&&F.cancelAnimationFrame(v),L();return}v||(v=F.requestAnimationFrame(L))}function D(P,L=!1){p=!0,u=P,O(),S(!L),L||h()}let w=()=>D({auto:!0,px:u.px}),I=P=>D({auto:!1,px:P!==void 0?l(P):u.px});function R(P){let L=P;if(!(L.button!==void 0&&L.button>0)){P.preventDefault(),x={y:L.clientY,base:C()},b.classList.add("spro-altura-arrastando");try{b.setPointerCapture?.(L.pointerId)}catch{}}}function Z(P){if(!x)return;let L=P;if(L.buttons===0)return G(P);D({auto:!1,px:l(x.base+(L.clientY-x.y))},!0)}function G(P){if(!x)return;let L=P;x=null,b.classList.remove("spro-altura-arrastando");try{b.releasePointerCapture?.(L.pointerId)}catch{}h(),S(!0)}function A(P){P.preventDefault(),u.auto?I():w()}function T(P){let L=P;P.stopPropagation();let F=L.shiftKey?El:Al;switch(L.key){case"ArrowUp":I(C()-F);break;case"ArrowDown":I(C()+F);break;case"Home":I(t);break;case"End":w();break;case"Enter":case" ":u.auto?I():w();break;default:return}P.preventDefault()}if(b.addEventListener("pointerdown",R),b.addEventListener("pointermove",Z),b.addEventListener("pointerup",G),b.addEventListener("pointercancel",G),b.addEventListener("lostpointercapture",G),b.addEventListener("dblclick",A),b.addEventListener("keydown",T),b.addEventListener("click",P=>P.stopPropagation()),O(),!p&&n)try{n.obter(i).then(P=>{p||m||!(i in P)||(u=wl(P[i],t,a),s.set(o.chave,{...u}),O(),S(!0))}).catch(()=>{})}catch{}return{alca:b,estado:()=>({...u}),ajustarAoConteudo:w,limitar:P=>I(P),destruir(){m=!0,x=null}}}var Je={compacta:34,confortavel:48},Ml={processo:"minmax(340px, 370px)",tipo:"minmax(120px, 1.2fr)",especificacao:"minmax(200px, 2fr)",responsavel:"minmax(90px, 130px)",marcadores:"minmax(120px, 1.3fr)",prazo:"minmax(120px, 150px)",anotacao:"minmax(130px, 1.4fr)",caixa:"84px",parado:"84px",sinais:"minmax(110px, 150px)"},Dl={processo:"protocolo",tipo:"tipo",responsavel:"responsavel",marcadores:"marcador",prazo:"prazo",caixa:"caixa",parado:"parado",sinais:"novo"};function Ol(o){let e=o.trim().split(/\s+/);return e.length>2?`${e[0]} ${e[e.length-1]}`:o}function Ke(o,e){return d("button",{type:"button",class:"spro-lapis",title:o,"aria-label":o,onclick:r=>{r.preventDefault(),r.stopPropagation(),e()}},_("lapis",13))}var co=(o,e,r)=>d(o,{class:e},r);function Cl(o,e,r,t){let a=co("div",`spro-c spro-c-${e}`);switch(e){case"processo":{let n=t.icones(o.id),s=u=>n.find(p=>p.classList.contains(u))??d("span",{class:"spro-slot"}),i=o.acompanhamentoEspecial?d("span",{class:"spro-acomp",title:o.acompanhamentoGrupo?`Acompanhamento especial: ${o.acompanhamentoGrupo}`:"Acompanhamento especial"},_("olho",15)):d("span",{class:"spro-slot"});a.append(d("span",{class:"spro-icones"},s("spro-fav-estrela"),s("spro-prj-ic"),s("spro-dem-cx"),i));let c=o.grupo==="recebidos";t.semOrigem||a.append(d("span",{class:`spro-origem spro-origem-${o.grupo}`,title:c?"Processo recebido: veio de outra unidade":"Processo gerado: autuado nesta unidade",role:"img","aria-label":c?"Processo recebido":"Processo gerado"},uo(c?"recebido":"gerado",16)));let l=d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",title:"Abrir o processo"},o.protocolo);a.append(l),a.append(Ps({protocolo:o.protocolo,doc:document,href:o.link})),o.sigiloso&&a.append(d("span",{class:"spro-sigilo",title:"Processo sigiloso"},"sigiloso")),o.urgente&&a.append(d("span",{class:"spro-urgente",title:"Marcado como urgente"},"urgente")),o.trancado&&a.append(d("span",{class:"spro-sigilo",title:"Processo trancado"},"trancado"));break}case"tipo":a.append(co("span","spro-corta",o.tipo)),a.title=o.tipo;break;case"especificacao":{if(a.classList.add("spro-editavel"),t.editando===o.id){let n=d("input",{type:"text",class:"spro-espec-input",maxlength:"100",value:t.rascunho,"aria-label":"Especifica\xE7\xE3o do processo"});n.addEventListener("input",()=>t.aoDigitarEspec(n.value)),n.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"?t.aoSalvarEspec(o.id):l.key==="Escape"&&t.aoCancelarEspec()});let s=l=>l.preventDefault(),i=d("button",{type:"button",class:"spro-lapis spro-lapis-ok",title:"Salvar (Enter)","aria-label":"Salvar",onclick:()=>t.aoSalvarEspec(o.id)},_("check",14)),c=d("button",{type:"button",class:"spro-lapis",title:"Cancelar (Esc)","aria-label":"Cancelar",onclick:()=>t.aoCancelarEspec()},_("fechar",14));i.addEventListener("pointerdown",s),c.addEventListener("pointerdown",s),a.append(d("span",{class:"spro-edicao"},n,i,c));break}a.append(co("span","spro-corta",o.especificacao)),a.title=o.especificacao,o.sigiloso||a.append(Ke("Editar a especifica\xE7\xE3o",()=>t.aoEditarEspec(o.id)));break}case"responsavel":a.classList.add("spro-editavel"),o.atribuicao?(a.append(co("span","spro-corta",t.nomesCompletos?Ol(o.atribuicao.nome):o.atribuicao.sigla)),a.title=t.nomesCompletos?o.atribuicao.sigla:o.atribuicao.nome):a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"atribuir")),a.append(Ke(o.atribuicao?"Mudar o respons\xE1vel":"Atribuir a algu\xE9m",()=>t.aoEditar(o.id,"responsavel")));break;case"marcadores":a.classList.add("spro-editavel"),o.marcadores.length&&a.append(d("span",{class:"spro-pilulas"},...o.marcadores.map(n=>d("span",{class:"spro-marcador",title:n.texto?`${n.nome}: ${n.texto}`:n.nome},d("i",{style:`background:${ue(n.cor)}`}),n.nome)))),o.sigiloso||(o.marcadores.length||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"marcar")),a.append(Ke(o.marcadores.length?"Editar os marcadores":"Adicionar marcador",()=>t.aoEditar(o.id,"marcadores"))));break;case"prazo":{let n=po(o,r);a.classList.add("spro-editavel");let s=n?"Editar o prazo":"Definir um prazo",i=d("button",{type:"button",class:"spro-prazo-b",title:n?`${Yr(o,r)}
${n.dica}

${s}`:s,"aria-label":s,onclick:c=>{c.preventDefault(),c.stopPropagation(),t.aoAbrirPrazo(o.id)}},n?co("span",`spro-prazo spro-prazo-${n.situacao}`,n.texto):co("span","spro-prazo-vazio","definir"));a.append(i,d("span",{class:"spro-lapis spro-lapis-fixo","aria-hidden":"true"},_("lapis",13)));break}case"anotacao":a.classList.add("spro-editavel"),o.anotacao?(a.append(co("span",`spro-corta${o.anotacao.prioridade?" spro-prio":""}`,on(o.anotacao.texto))),a.setAttribute("data-tip-nota",o.anotacao.texto),a.setAttribute("data-tip-autor",o.anotacao.autor)):o.sigiloso||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"anotar")),o.sigiloso||a.append(Ke(o.anotacao?"Editar a anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",()=>t.aoEditar(o.id,"anotacao")));break;case"caixa":{let n=Uo(Ao(o,r));a.append(co("span","spro-suave",n)),n&&(a.title=Mn);break}case"parado":{let n=Co(o,r);a.append(co("span","spro-suave",Uo(n))),n!==null&&(a.title="Dias desde a \xFAltima movimenta\xE7\xE3o (vis\xE3o detalhada do SEI).");break}case"sinais":for(let n of Zr(o))a.append(co("span","spro-sinal",n));break}return a}var Ll=68;function Ds(o,e={}){let r=o,t=co("div","spro-cab"),a=co("div","spro-corpo"),n=d("div",{class:"spro-rolagem",tabindex:"-1"},a),s=d("div",{class:"spro-tabela",role:"table"},t,n),i=Ms({rolagem:n,chave:"grade-controle",padraoVh:Ll,area:e.area??null,rotulo:"Redimensionar a altura da grade de processos",aoMudar:()=>{r.linhas.length&&M()}});s.append(i.alca);let c="",l=!1,u=!1,p=()=>`36px ${r.colunas.map(h=>Ml[h]).join(" ")}`;function m(){t.replaceChildren(),t.style.gridTemplateColumns=p();let h=r.linhas.filter(w=>w.tipo==="processo").map(w=>w.processo.id),S=h.filter(w=>r.selecionados.has(w)).length,D=d("input",{type:"checkbox",class:"spro-cb","aria-label":"Marcar todos os processos vis\xEDveis",title:"Marcar todos os vis\xEDveis",disabled:!h.length});D.checked=h.length>0&&S===h.length,D.indeterminate=S>0&&S<h.length,D.addEventListener("change",()=>r.aoMarcarGrupo(h,D.checked)),t.append(co("div","spro-c spro-c-cb")),t.firstElementChild.append(D);for(let w of r.colunas){let I=Dl[w],R=I?r.ordem.findIndex(G=>G.campo===I):-1,Z=d("div",{class:`spro-c spro-th${I?" spro-ordenavel":""}`,role:"columnheader",...R>=0?{"aria-sort":r.ordem[R].decrescente?"descending":"ascending"}:{}});if(I){let G=d("button",{type:"button",class:"spro-th-b",title:"Ordenar (Shift acrescenta outro crit\xE9rio)",onclick:A=>r.aoOrdenar(I,A.shiftKey)},_o[w]);R>=0&&G.append(d("span",{class:"spro-seta-ordem"},`${r.ordem[R].decrescente?"\u2193":"\u2191"}${r.ordem.length>1?R+1:""}`)),Z.append(G)}else Z.append(_o[w]);t.append(Z)}}function v(h,S){let D=r.selecionados.has(h.id),w=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${h.protocolo}`,title:h.naPaginaAtual?void 0:`Est\xE1 na p\xE1gina ${h.pagina+1} do SEI: as a\xE7\xF5es do SEI aceitam processos de uma p\xE1gina por vez`});w.checked=D,w.addEventListener("change",()=>r.aoSelecionar(h.id,w.checked));let I=d("div",{class:`spro-linha${D?" spro-sel":""}${r.foco===h.id?" spro-foco":""}${h.urgente?" spro-linha-urgente":""}`,role:"row","data-id":h.id,"data-grupo":S});I.style.gridTemplateColumns=p(),I.style.height=`${Je[r.densidade]}px`;let R=co("div","spro-c spro-c-cb");return R.append(w),I.append(R,...r.colunas.map(Z=>Cl(h,Z,r.ctx,r))),I}function x(h){let S=h.grupo.itens.map(I=>I.id),D=d("button",{type:"button",class:"spro-grupo-b","aria-expanded":String(!h.recolhido),onclick:()=>r.aoGrupo(h.grupo.chave)},d("span",{class:`spro-grupo-seta${h.recolhido?" spro-fechado":""}`},uo("seta",14)),d("span",{class:"spro-grupo-nome"},h.grupo.rotulo),d("span",{class:"spro-grupo-n"},String(h.grupo.itens.length))),w=d("div",{class:`spro-grupo${h.grupo.tom?` spro-tom-${h.grupo.tom}`:""}`,role:"row"},D);if(S.length){let I=S.every(R=>r.selecionados.has(R));w.append(d("button",{type:"button",class:"spro-link",onclick:()=>r.aoMarcarGrupo(S,!I)},I?"Desmarcar grupo":"Marcar grupo"))}return w.style.height=`${Je[r.densidade]}px`,w}function M(){let h=Je[r.densidade],S=ys(r.linhas.length,h,n.scrollTop||0,n.clientHeight||0);a.style.paddingTop=`${S.antes}px`,a.style.paddingBottom=`${S.depois}px`,a.replaceChildren(...r.linhas.slice(S.inicio,S.fim).map(w=>w.tipo==="grupo"?x(w):v(w.processo,w.grupo)));let D=a.querySelector(".spro-espec-input");D&&l?(l=!1,D.focus(),D.setSelectionRange?.(D.value.length,D.value.length)):D&&D.getRootNode()instanceof ShadowRoot&&D.getRootNode().activeElement!==D&&u&&D.focus()}let b=0;n.addEventListener("scroll",()=>{if(b)return;let h=n.ownerDocument.defaultView;if(!h?.requestAnimationFrame)return M();b=h.requestAnimationFrame(()=>{b=0,M()})});function C(h){let S=h.colunas.join()!==r.colunas.join()||h.ordem!==r.ordem||h.selecionados!==r.selecionados;h.editando&&h.editando!==r.editando&&(l=!0),u=!!h.editando,r=h;let D=`${r.colunas.join()}|${r.densidade}`;if((S||D!==c)&&(m(),c=D),!r.linhas.length){a.style.paddingTop=a.style.paddingBottom="0",a.replaceChildren(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro."));return}M()}function O(h){let S=r.linhas.findIndex(w=>w.tipo==="processo"&&w.processo.id===h);if(S<0)return!1;let D=Je[r.densidade];return S*D<n.scrollTop?n.scrollTop=S*D:(S+1)*D>n.scrollTop+n.clientHeight&&n.clientHeight>0&&(n.scrollTop=(S+1)*D-n.clientHeight),M(),!0}return C(o),{el:s,atualizar:C,mostrar:O,rolagem:n,altura:i}}var Il=[["/","Buscar"],["j / k","Linha seguinte / anterior"],["x","Marcar a linha"],["Enter","Abrir o processo"],["g t","Ver a tabela"],["g q","Ver o quadro"],["Esc","Limpar a busca ou a sele\xE7\xE3o"],["?","Esta ajuda"]],Os=o=>o==="grupo:recebidos"?"grupo:gerados":o==="grupo:gerados"?"grupo:recebidos":null,kl={"resp:eu":"Processos atribu\xEDdos a voc\xEA","grupo:recebidos":"Processos que vieram de outra unidade","grupo:gerados":"Processos autuados nesta unidade","prazo:atrasado":"Prazo vencido e ainda n\xE3o conclu\xEDdo","prazo:semana":"Vencem nos pr\xF3ximos 7 dias","resp:sem":"Processos sem respons\xE1vel","novo:sim":"Ainda n\xE3o abertos nesta unidade","novo:visita":"Chegaram depois da sua \xFAltima visita","parado:>30d":"Sem movimenta\xE7\xE3o h\xE1 mais de 30 dias (vis\xE3o detalhada do SEI)"},Nl=[["Meus","resp:eu",{comum:"pessoa"},""],["Recebidos","grupo:recebidos",{grade:"recebido"},""],["Gerados","grupo:gerados",{grade:"gerado"},""],["Atrasados","prazo:atrasado",{comum:"alerta"},"perigo"],["Vencem na semana","prazo:semana",{comum:"calendario"},"aviso"],["Sem respons\xE1vel","resp:sem",{grade:"semPessoa"},""],["N\xE3o visualizados","novo:sim",{grade:"olhoFechado"},""],["Novos desde a \xFAltima visita","novo:visita",{comum:"brilho"},"novo"],["Parados h\xE1 +30 dias","parado:>30d",{comum:"historico"},""]];function Cs(o){let{doc:e}=o,r=o.inicial.processos,t=Xo(),a=[],n="",s=new Set,i=new Set(Gr(e)),c=null,l={vistoEm:{}},u,p=null,m=!1,v=!1,x="",M={},b=!1,C=!1,O,h=!1,S=jn(o.mover),D=new AbortController,w=()=>({hoje:o.hoje(),agora:o.agora(),...o.eu?{eu:o.eu}:{},...u!==void 0?{visitaAnterior:u}:{},...P?{andamentos:P.dados()}:{}}),I=e.createElement("div");I.id="spro-grade",I.setAttribute("data-spro-grade-host","1"),I.setAttribute("data-tema",o.escuro?"escuro":"claro");let R=I.attachShadow({mode:"open"}),Z=e.createElement("style");Z.textContent=o.css;let G=d("div",{class:`spro-app${o.escuro?" spro-escuro":""}`}),A=e.createElement("style");R.append(Z,A,G);let T=tn(R),P=o.consultarAndamento?ss({sombra:R,agora:()=>o.agora(),armazem:o.armazem,consultar:(f,g)=>o.consultarAndamento(f,g),processos:()=>r,aoMudar:()=>oo(),aviso:f=>Y(f),simultaneas:o.andamentoSimultaneas,pausaMs:o.andamentoPausaMs,semDebounce:o.semDebounce}):null,L=d("input",{type:"search",class:"spro-busca",placeholder:"Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...","aria-label":"Buscar processos",spellcheck:"false",autocomplete:"off"}),F=d("div",{class:"spro-chips"}),eo=d("div",{class:"spro-rapidos"}),$=d("div",{class:"spro-status",role:"status","aria-live":"polite"}),ro=d("div",{class:"spro-lote",hidden:!0}),mo=d("div",{class:"spro-conteudo"}),ao=d("div",{class:"spro-painel",hidden:!0}),ft=d("div",{class:"spro-avisos","aria-live":"polite"}),Zo=d("div",{class:"spro-ajuda-atalhos",hidden:!0},d("strong",{},"Atalhos"),...Il.map(([f,g])=>d("div",{},d("kbd",{},f),` ${g}`))),zs=[["protocolo","N\xFAmero do processo"],["prazo","Prazo"],["tipo","Tipo"],["responsavel","Respons\xE1vel"],["marcador","Marcador"],["caixa","Tempo na caixa"],["parado","Parado h\xE1"],["novo","N\xE3o visualizados"]],or=Oo({rotulo:"Agrupar por",icone:"camadas",classe:"spro-combo-compacto",busca:!1,vazio:"Sem agrupamento",opcoes:Object.keys(Kr).filter(f=>P||!de(f)).map(f=>({valor:f,rotulo:f==="nenhum"?"Sem agrupamento":`Agrupar: ${Kr[f]}`,...de(f)?{descricao:"Consulta o andamento de cada processo"}:{}})),valor:["nenhum"],aoMudar:([f])=>{let g=f??"nenhum",y=t.agrupar;X({agrupar:g}),P&&de(g)&&P.aoEscolherAgrupamento().then(E=>{!E&&t.agrupar===g&&X({agrupar:y})})}}),gt=Oo({rotulo:"Ordenar por",icone:"ordenar",classe:"spro-combo-compacto",busca:!1,vazio:"Ordem do SEI",opcoes:[{valor:"",rotulo:"Ordem do SEI"},...zs.flatMap(([f,g])=>[{valor:`${f}:a`,rotulo:`${g} \u2191`,descricao:"Crescente"},{valor:`${f}:d`,rotulo:`${g} \u2193`,descricao:"Decrescente"}])],valor:[""],aoMudar:([f])=>{let[g,y]=(f??"").split(":");X({ordem:g?[{campo:g,decrescente:y==="d"}]:[]})}}),me=Wr([],w()),er=(f,g,y,E,N)=>{let z=Oo({rotulo:f,vazio:g,icone:E,classe:"spro-combo-compacto",busca:!0,larguraLista:260,opcoes:()=>N().map(H=>({valor:H.valor,rotulo:H.rotulo,contagem:H.n})),aoMudar:([H])=>{H&&(X({busca:Jn(t.busca,y,H)}),L.value=t.busca,z.definir([],!1))}});return z},ht=er("Filtrar por respons\xE1vel","Respons\xE1vel\u2026","resp","pessoa",()=>me.responsaveis),bt=er("Filtrar por tipo","Tipo\u2026","tipo","documento",()=>me.tipos),vt=er("Filtrar por marcador","Marcador\u2026","marcador","etiqueta",()=>me.marcadores),xt=(f,g)=>d("button",{type:"button",class:"spro-seg-b","data-modo":f,title:g,onclick:()=>X({modo:f})},uo(f==="tabela"?"lista":"quadro",16),d("span",{},g)),At=d("div",{class:"spro-seg",role:"group","aria-label":"Modo de exibi\xE7\xE3o"},xt("tabela","Tabela"),xt("quadro","Quadro")),fe=(f,g,y,E="")=>d("button",{type:"button",class:`spro-bt ${E}`.trim(),title:g,"aria-label":g,onclick:y},uo(f,16),d("span",{},g)),Et=fe("colunas","Colunas",()=>Ho("colunas")),_s=fe("disquete","Vis\xF5es",()=>Ho("visoes")),qs=fe("lista","Exportar CSV",()=>Js()),Vs=d("button",{type:"button",class:"spro-bt spro-bt-icone",title:"Atalhos de teclado (?)","aria-label":"Atalhos de teclado",onclick:()=>{Zo.hidden=!Zo.hidden}},"?"),yt=fe("densidade","Densidade",()=>X({densidade:t.densidade==="compacta"?"confortavel":"compacta"})),ge=d("div",{class:"spro-quadro-cfg",hidden:!0});G.append(d("div",{class:"spro-barra"},At,d("div",{class:"spro-busca-caixa"},L),or.el,gt.el,Et,yt,_s,qs,Vs),F,d("div",{class:"spro-faixa"},eo,ht.el,bt.el,vt.el),ge,Zo,ao,$,...P?[P.faixa]:[],ro,mo,ft);let Pt=()=>wn(r,l),Yo="",oe=()=>Qn(Pt(),`${t.busca} ${Yo}`.trim(),w()),rr=()=>rs(oe(),t.ordem,w());function X(f){t={...t,...f},f.busca===void 0?o.armazem.gravarVisao(t).catch(()=>{}):Hs(),oo()}let tr;function Hs(){clearTimeout(tr),tr=setTimeout(()=>void o.armazem.gravarVisao(t).catch(()=>{}),400)}function Y(f,g){let y=d("div",{class:"spro-aviso",role:"status"},d("span",{},f));g&&y.append(d("button",{type:"button",class:"spro-link",onclick:()=>{g.fazer(),y.remove()}},g.rotulo)),y.append(d("button",{type:"button",class:"spro-aviso-x","aria-label":"Fechar aviso",onclick:()=>y.remove()},"\xD7")),ft.append(y),setTimeout(()=>y.remove(),g?9e3:6e3).unref?.()}function Vo(f,g){let y=new Set(i);for(let E of f)g?y.add(E):y.delete(E);i=y,qn(e,y),cr(),bo()}let he=new Map;function ko(f,g){let y=r.find(E=>E.id===f);if(y){let E=he.get(f)??{};for(let N of new Set([...Object.keys(y),...Object.keys(g)]))JSON.stringify(y[N])!==JSON.stringify(g[N])&&(E[N]=g[N]);he.set(f,E)}r=r.map(E=>E.id===f?g:E)}let St=Promise.resolve();function Fs(f){No+=1;let g=St.then(f,f);return St=g.catch(()=>{}).finally(()=>{No-=1}),g}let ar=null,nr={raiz:R,extras:()=>(ar??=(o.extras?o.extras().then(f=>(M=f,f)):Promise.resolve({})).catch(f=>{throw ar=null,f}),ar),todos:()=>r,selecionados:()=>i,corDoMarcador:f=>r.flatMap(g=>g.marcadores).find(g=>g.nome===f)?.cor??"",autor:o.eu??"",aplicarLocal:(f,g)=>{ko(f,g),oo()},gravar:Fs,atribuir:(f,g)=>o.mover.atribuir(f,g),marcar:(f,g)=>o.mover.marcador(f,g),anotar:(f,g)=>o.anotar(f,g),aviso:f=>Y(f)};async function js(f,g,y){let E=r.find(Q=>Q.id===f);if(!E)return;let N=ns(t.quadro.colunas,E,g,y);if(!N.ok)return Y(N.motivo);let z=Object.fromEntries((M.responsaveis??[]).map(Q=>[Q.sigla,Q.nome]));ko(f,rt(E,N.movimento,z)),oo(),No+=1;let H=await S.mover(N.movimento).finally(()=>{No-=1});if(!C){if(!H.ok)return ko(f,E),oo(),Y(`N\xE3o foi poss\xEDvel mover ${E.protocolo}: ${H.erro}`);Y(`${E.protocolo} movido.`,{rotulo:"Desfazer",fazer:()=>{let Q=r.find(lo=>lo.id===f)??E;ko(f,rt(Q,H.desfazer,z)),oo(),S.mover(H.desfazer).then(lo=>{lo.ok||C||(ko(f,Q),oo(),Y(`N\xE3o foi poss\xEDvel desfazer: ${lo.erro}`))})}})}}let Gs=ds(),sr=new Map([[Ro("recebidos",0),o.inicial.selecoes.recebidos],[Ro("gerados",0),o.inicial.selecoes.gerados],[Ro("detalhado",0),o.inicial.selecoes.detalhado]]),ir=o.inicial.visao==="detalhada";function Us(f){let g=r.filter(N=>i.has(N.id)),y=Ja(f);if(y?.requerSelecao&&!g.length)return Y("Marque ao menos um processo.");if(y&&!y.aceitaSigiloso&&Qa(g))return Y("Opera\xE7\xE3o n\xE3o aplic\xE1vel em processo sigiloso.");let E=Ba(g,sr,ir?"detalhada":"resumida");if(!E.ok)return Y(E.motivo);if(E.plano.todosNaPaginaAtual||!y){let N=Hn(f,g.length);!N.ok&&N.motivo&&Y(N.motivo);return}try{o.enviarAcao(y.url,E.plano)}catch(N){Y(`N\xE3o foi poss\xEDvel enviar a a\xE7\xE3o: ${N instanceof Error?N.message:String(N)}`)}}let No=0,be=null,ve="",wt=!1,Mt=f=>({linhas:f,colunas:t.colunas,densidade:t.densidade,ctx:w(),ordem:t.ordem,selecionados:i,foco:c,icones:g=>Gs(e,g),nomesCompletos:wt,editando:be,rascunho:ve,semOrigem:ir,aoOrdenar:(g,y)=>X({ordem:ts(t.ordem,g,y)}),aoSelecionar:(g,y)=>Vo([g],y),aoGrupo:g=>{let y=new Set(s);y.has(g)?y.delete(g):y.add(g),s=y,o.armazem.gravarRecolhidos([...y]).catch(()=>{}),bo()},aoMarcarGrupo:(g,y)=>Vo(g,y),aoEditarEspec:g=>{be=g,ve=r.find(y=>y.id===g)?.especificacao??"",bo()},aoDigitarEspec:g=>{ve=g},aoCancelarEspec:()=>{be=null,bo()},aoSalvarEspec:g=>void Bs(g),aoAbrirPrazo:g=>o.abrirPrazo(g),aoEditar:(g,y)=>{let E=r.find(N=>N.id===g);E&&(y==="responsavel"?xs(nr,E):y==="anotacao"?As(nr,E):Es(nr,E))}}),xe=Ds(Mt([]),{area:o.armazem.areaLocal});async function Bs(f){let g=r.find(E=>E.id===f),y=ve.trim();if(be=null,!g||y===g.especificacao.trim())return bo();if(!y)return Y("A especifica\xE7\xE3o n\xE3o pode ficar vazia."),bo();ko(f,{...g,especificacao:y}),oo(),No+=1;try{await o.editarEspecificacao(g.protocolo,y),Y(`Especifica\xE7\xE3o de ${g.protocolo} salva.`)}catch(E){ko(f,g),oo(),Y(`N\xE3o foi poss\xEDvel salvar a especifica\xE7\xE3o: ${E instanceof Error?E.message:String(E)}`)}finally{No-=1}}function bo(){let f=rr();if(t.modo==="quadro"){mo.replaceChildren(is({processos:f,cfg:t.quadro,ctx:w(),extras:M,selecionados:i,aoMover:(y,E,N)=>void js(y,E,N),aoSelecionar:(y,E)=>Vo([y],E)}));return}let g=Fe(f,t.agrupar,w());xe.atualizar(Mt(Yn(g,s,t.agrupar!=="nenhum"))),mo.firstElementChild!==xe.el&&mo.replaceChildren(xe.el)}function Dt(f){let g=[`${f} de ${r.length} processo${r.length===1?"":"s"}`];Yo&&g.push(`filtro da pesquisa r\xE1pida: ${Yo}`);let y=o.inicial.totais.recebidos+o.inicial.totais.gerados;m&&p?g.push(`carregando ${p.grupo} (${p.paginasLidas}/${p.paginasTotal})\u2026`):!v&&y>r.length&&g.push(`o SEI informa ${y}; os demais n\xE3o foram carregados`),x&&g.push(`aviso: ${x}`),$.replaceChildren(g.join(" \xB7 ")),$.classList.toggle("spro-status-alerta",!!x||!v&&!m&&y>r.length)}function cr(){let f=i.size;if(ro.hidden=f===0,!f)return ro.replaceChildren();let g=new Set(oe().map(E=>E.id)),y=[...i].filter(E=>!g.has(E)).length;ro.replaceChildren(d("strong",{},`${f} selecionado${f===1?"":"s"}`),...y?[d("span",{class:"spro-suave"},`(${y} fora do filtro atual)`)]:[],...o.acoes().map(E=>d("button",{type:"button",class:"spro-bt",title:E.rotulo,onclick:()=>Us(E)},d("img",{src:E.icone,alt:"",width:"16",height:"16"}),d("span",{},E.rotulo))),d("button",{type:"button",class:"spro-link",onclick:()=>Vo([...i],!1)},"Limpar sele\xE7\xE3o"))}function Xs(){let f=Jr(t.busca);F.replaceChildren(...f.tokens.map(y=>d("span",{class:`spro-chip${y.termo.negado?" spro-chip-neg":""}`},y.texto,d("button",{type:"button","aria-label":`Remover ${y.texto}`,onclick:()=>{X({busca:He(t.busca,y.texto)}),L.value=t.busca}},"\xD7")))),F.hidden=!f.tokens.length;let g=new Set(f.tokens.map(y=>y.texto));eo.replaceChildren(...Nl.filter(([,y])=>!(ir&&y.startsWith("grupo:"))).map(([y,E,N,z])=>d("button",{type:"button","data-tip":`${y}
${kl[E]??""}
Busca: ${E}${g.has(E)?`
Clique para desligar`:""}`,"aria-label":y,class:`spro-rapido${z?` spro-rapido-${z}`:""}${g.has(E)?" spro-rapido-on":""}`,"aria-pressed":String(g.has(E)),onclick:()=>{X({busca:g.has(E)?He(t.busca,E):`${Os(E)?He(t.busca,Os(E)):t.busca} ${E}`.trim()}),L.value=t.busca}},"comum"in N?_(N.comum,14,e):uo(N.grade,14,e),d("span",{class:"spro-rapido-rotulo"},y)))),Ot()}let wo=I.shadowRoot.querySelector(".spro-faixa");function Ot(){C||(wo.classList.remove("spro-faixa-c1","spro-faixa-c2"),wo.clientWidth&&(wo.scrollWidth>wo.clientWidth+1&&wo.classList.add("spro-faixa-c1"),wo.scrollWidth>wo.clientWidth+1&&wo.classList.add("spro-faixa-c2")))}let Ct=e.defaultView?.ResizeObserver,Lt=Ct?new Ct(()=>Ot()):null;Lt?.observe(wo);function oo(){if(C)return;me=Wr(Pt(),w());for(let g of[ht,bt,vt])g.atualizar();or.definir([t.agrupar],!1),or.el.disabled=t.modo==="quadro",gt.definir([t.ordem[0]?`${t.ordem[0].campo}:${t.ordem[0].decrescente?"d":"a"}`:""],!1);for(let g of At.querySelectorAll("[data-modo]"))g.setAttribute("aria-pressed",String(g.getAttribute("data-modo")===t.modo));yt.title=t.densidade==="compacta"?"Linhas confort\xE1veis":"Linhas compactas",Et.hidden=t.modo==="quadro",Qs(),Xs(),P?.definirAtivo(de(t.agrupar)&&t.modo==="tabela"),bo(),Dt(oe().length),cr(),t.modo==="quadro"&&!b&&o.extras&&(b=!0,o.extras().then(g=>{M=g,C||bo()}).catch(()=>{}))}function Qs(){if(ge.hidden=t.modo!=="quadro",ge.hidden)return;let f=t.quadro,g=Oo({rotulo:"Colunas do quadro",icone:"mapa",classe:"spro-combo-compacto",busca:!1,opcoes:[{valor:"marcador",rotulo:"Colunas: marcador"},{valor:"responsavel",rotulo:"Colunas: respons\xE1vel"},{valor:"prazo",rotulo:"Colunas: prazo (leitura)"},{valor:"tipo",rotulo:"Colunas: tipo (leitura)"}],valor:[f.colunas],aoMudar:([N])=>{b=!1,X({quadro:{...f,colunas:N??"marcador"}})}}),y=d("input",{type:"number",min:"0",max:"99",class:"spro-num",value:String(f.limite),"aria-label":"Limite de cart\xF5es por coluna (0 = sem limite)",title:"Limite de cart\xF5es por coluna (0 = sem limite)",onchange:N=>X({quadro:{...f,limite:Math.max(0,Math.min(99,Number(N.target.value)||0))}})}),E=d("input",{type:"checkbox",onchange:N=>X({quadro:{...f,raiasPorResponsavel:N.target.checked}})});E.checked=f.raiasPorResponsavel,ge.replaceChildren(g.el,d("label",{class:"spro-rotulo-inline"},"Limite ",y),d("label",{class:"spro-rotulo-inline"},E," Raias por respons\xE1vel"),d("span",{class:"spro-suave"},f.colunas==="marcador"||f.colunas==="responsavel"?"Arraste os cart\xF5es entre as colunas.":"Esta divis\xE3o \xE9 s\xF3 de leitura."))}function Ho(f){if(!ao.hidden&&ao.getAttribute("data-qual")===f){ao.hidden=!0;return}if(ao.setAttribute("data-qual",f),ao.hidden=!1,f==="colunas"){ao.replaceChildren(d("strong",{},"Colunas"),...Bo.map(z=>{let H=d("input",{type:"checkbox",disabled:z==="processo"});return H.checked=t.colunas.includes(z),H.addEventListener("change",()=>{let Q=H.checked?Bo.filter(lo=>lo===z||t.colunas.includes(lo)):t.colunas.filter(lo=>lo!==z);X({colunas:Q})}),d("label",{class:"spro-rotulo-linha"},H,` ${_o[z]}`)}),d("button",{type:"button",class:"spro-link",onclick:()=>X({colunas:Xo().colunas})},"Restaurar padr\xE3o"));return}let g=d("input",{type:"text",class:"spro-nome",maxlength:"40",placeholder:"Nome da vis\xE3o","aria-label":"Nome da vis\xE3o"}),y=a.find(z=>z.id===n);g.value=y?.nome??"";let E=async(z,H=a)=>{a=z,await o.armazem.gravarVisoes(z,H).catch(()=>Y("N\xE3o foi poss\xEDvel sincronizar as vis\xF5es."))},N=async z=>{let H={...t,nome:g.value.trim()||"Minha vis\xE3o",id:z==="atualizar"?n:""},Q=Dn(a,H,o.novoId);if(!Q)return Y("Limite de vis\xF5es salvas atingido.");n=Q.visao.id,await E(Q.lista),Y(`Vis\xE3o "${Q.visao.nome}" salva.`),Ho("visoes"),Ho("visoes")};ao.replaceChildren(d("strong",{},"Vis\xF5es salvas"),a.length?d("ul",{class:"spro-lista-visoes"},...a.map(z=>d("li",{},d("button",{type:"button",class:`spro-link${z.id===n?" spro-ativa":""}`,onclick:()=>{n=z.id,L.value=z.busca,X({...z,id:""})}},z.nome),d("button",{type:"button",class:"spro-aviso-x","aria-label":`Excluir ${z.nome}`,title:"Excluir",onclick:async()=>{await E(On(a,z.id),a),n===z.id&&(n=""),Ho("visoes"),Ho("visoes")}},"\xD7")))):d("p",{class:"spro-suave"},"Nenhuma vis\xE3o salva ainda."),d("div",{class:"spro-linha-form"},g,d("button",{type:"button",class:"spro-bt",onclick:()=>void N("nova")},"Salvar como nova"),y&&Cn(t,y)?d("button",{type:"button",class:"spro-bt",onclick:()=>void N("atualizar")},"Atualizar"):null))}function Js(){let f=Wn(rr(),t.modo==="quadro"?[...Bo]:t.colunas,w());o.baixar(Zn(o.hoje()),kn(f),"text/csv;charset=utf-8"),Y(`${f.length-1} processos exportados.`)}L.addEventListener("input",()=>{let f=L.value;if(o.semDebounce)return X({busca:f});clearTimeout(O),O=setTimeout(()=>X({busca:f}),120)}),L.addEventListener("keydown",f=>{f.key==="Escape"&&(L.value="",X({busca:""}),L.blur())});function It(f){if(C||f.ctrlKey||f.metaKey||f.altKey)return;let g=f.target;if(g&&(/^(input|textarea|select)$/i.test(g.tagName)||g.isContentEditable)||I.hidden)return;let E=f.key;if(h){h=!1,E==="t"?X({modo:"tabela"}):E==="q"&&X({modo:"quadro"});return}let N=rr().map(H=>H.id),z=c?N.indexOf(c):-1;if(E==="/")f.preventDefault(),L.focus();else if(E==="?")Zo.hidden=!Zo.hidden;else if(E==="g")h=!0;else if(E==="Escape")i.size&&Vo([...i],!1);else if((E==="j"||E==="k")&&t.modo==="tabela"&&N.length)c=N[Math.max(0,Math.min(N.length-1,z+(E==="j"?1:-1)))],bo(),xe.mostrar(c);else if(E==="x"&&c)r.find(Q=>Q.id===c)&&Vo([c],!i.has(c));else if(E==="Enter"&&c){let H=r.find(Q=>Q.id===c)?.link;H&&e.defaultView?.location.assign(H)}}e.addEventListener("keydown",It);let Ks=Vn(e,f=>{i=f,cr(),bo()}),Ws=o.armazem.aoMudarVisoes(()=>void o.armazem.lerVisoes().then(f=>{a=f}).catch(()=>{})),lr=new Map;function dr(){if(C||No>0)return;let f=Go(e),g=new Map(f.processos.map(E=>[E.id,E])),y=!1;r=r.map(E=>{if(!E.naPaginaAtual)return E;let N=g.get(E.id);if(!N)return E;let z=he.get(E.id),H=nt(e,E.id),Q=lr.get(E.id);lr.set(E.id,H);let lo=N;if(z){for(let fr of Object.keys(z))JSON.stringify(N[fr])===JSON.stringify(z[fr])&&delete z[fr];Object.keys(z).length?lo={...N,...z}:he.delete(E.id)}let Rt=JSON.stringify(lo)===JSON.stringify(E);return Rt&&Q===H?E:(y=!0,Rt?E:lo)}),y&&(mr(),oo())}let ur,kt=e.defaultView?.MutationObserver,pr=kt?new kt(()=>{clearTimeout(ur),ur=setTimeout(dr,o.semDebounce?0:150)}):null,Nt=e.querySelector("#frmProcedimentoControlar")??e.body;pr&&Nt&&pr.observe(Nt,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["aria-pressed","aria-label","onmouseover","src","href","class"]});function mr(){let f=us(e);A.textContent!==f&&(A.textContent=f)}async function Zs(){if(!o.fonte)return v=!0,Tt(!0);m=!0,oo();let f=()=>o.fonte?.restaurarAoSair?.();e.defaultView?.addEventListener("pagehide",f);let g=await An(o.inicial,o.fonte,{sinal:D.signal,aoProgresso:y=>{p=y,Dt(oe().length)},aoSelecao:(y,E,N)=>{sr.set(Ro(y,E),N)},aoPagina:y=>{r=[...r,...y],oo()}});e.defaultView?.removeEventListener("pagehide",f),m=!1,v=g.completo,g.erro&&(x=g.erro),Tt(g.completo)}function Tt(f){l=Hr(l,r.map(g=>g.id),o.agora(),f),o.armazem.gravarIdade(l).catch(()=>{}),oo()}async function Ys(){try{let f=await o.armazem.lerEstado();t=f.visao,s=new Set(f.recolhidos),l=Sn(f.idade,o.agora()),u=l.visitaAnterior,a=await o.armazem.lerVisoes()}catch{}l=Hr(l,r.map(f=>f.id),o.agora(),!1),P&&await P.carregar(),L.value=t.busca,mr();for(let[f]of r.map(g=>[g.id]))lr.set(f,nt(e,f));oo(),Zs();for(let f of[1200,3500])setTimeout(()=>{mr(),dr()},f).unref?.()}return{host:I,iniciar:Ys,render:oo,estado:()=>({visao:t,todos:r,selecionados:i,completo:v,carregando:m,filtrados:oe().length}),definirVisao:f=>{t={...t,...f},L.value=t.busca,oo()},fechar(){C=!0,D.abort(),P?.fechar(),clearTimeout(O),clearTimeout(tr),clearTimeout(ur),pr?.disconnect(),Lt?.disconnect(),T(),e.removeEventListener("keydown",It),Ks(),Ws(),I.remove()},mostrar:f=>{I.hidden=!f},definirTema:f=>{I.setAttribute("data-tema",f?"escuro":"claro"),G.classList.toggle("spro-escuro",f)},definirNomesCompletos:f=>{wt=f,oo()},definirFiltroExterno:f=>{let g=f.trim();g!==Yo&&(Yo=g,oo())},sincronizar:dr,registrarSelecaoParaTeste:(f,g,y)=>void sr.set(Ro(f,g),y)}}var Ls=`/* Dentro do Shadow DOM: o base.css do sei-comum (tokens) vem antes deste arquivo. */
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
.spro-col { flex: 0 0 280px; max-height: 70vh; display: flex; flex-direction: column; background: var(--spro-fundo-2); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio-g); }
.spro-col-topo { display: flex; gap: 8px; align-items: center; padding: 8px 10px; font-weight: 700; border-bottom: 1px solid var(--spro-borda); }
.spro-col-titulo { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.spro-col-n { padding: 0 7px; font-size: 11px; color: var(--spro-suave); background: var(--spro-fundo-3); border-radius: 99px; }
.spro-excedeu { color: #fff; background: var(--spro-perigo); }
.spro-col-cheia { border-color: var(--spro-perigo); }
.spro-col-trava { color: var(--spro-fraco); display: inline-flex; }
.spro-col-corpo { display: flex; flex-direction: column; gap: 8px; padding: 8px; overflow-y: auto; min-height: 60px; }
.spro-col-vazia { padding: 18px 0; text-align: center; color: var(--spro-fraco); font-size: 12px; border: 1px dashed var(--spro-borda-forte); border-radius: var(--spro-raio); }
.spro-alvo { outline: 2px dashed var(--spro-destaque); outline-offset: -2px; }
.spro-cartao { display: flex; flex-direction: column; gap: 4px; padding: 8px 10px; cursor: grab; background: var(--spro-fundo); border: 1px solid var(--spro-borda); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-1); }
.spro-cartao:hover { border-color: var(--spro-borda-forte); box-shadow: var(--spro-sombra-2); }
.spro-arrastando { opacity: 0.45; }
.spro-cartao-topo { display: flex; gap: 6px; align-items: center; }
.spro-cartao-tipo { font-size: 12px; color: var(--spro-suave); }
.spro-cartao-espec { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.spro-cartao-rodape { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
.spro-avatar { display: inline-grid; place-items: center; width: 24px; height: 24px; font-size: 10px; font-weight: 700; color: var(--spro-destaque-texto); background: var(--spro-destaque); border-radius: 50%; }

.spro-avisos { position: fixed; right: 16px; bottom: 16px; z-index: 2147483000; display: flex; flex-direction: column; gap: 8px; }
.spro-aviso { display: flex; gap: 10px; align-items: center; max-width: 420px; padding: 10px 12px; color: var(--spro-texto); background: var(--spro-fundo); border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio); box-shadow: var(--spro-sombra-3); }
@media (max-width: 760px) { .spro-seg-b span, .spro-bt span { display: none; } .spro-col { flex-basis: 240px; } }
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
.spro-linha:hover .spro-prazo-vazio, .spro-prazo-b:focus-visible .spro-prazo-vazio { opacity: 1; }
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
`;var Is=`/* Botoes "Abrir em nova aba" e "Copiar numero do processo" ao lado do numero (acoesNumeroProcesso.ts). */
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
`;var ks=`/* Altura limitada com rolagem interna e a alca que a redimensiona (alturaRedimensionavel.ts). Usa os tokens de base.css. */
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
`;var Ns=`/* Na p\xE1gina do SEI (fora do Shadow DOM): o bot\xE3o alternador e o espa\xE7o da grade. */
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
`;var _l="gradecontrole",Ts="data-spro-pesquisa-rapida";function ql(){return new URL(location.href).searchParams.get("acao")==="procedimento_controlar"}var Wo=()=>{let o=Ht(document);return o?o==="escuro":!!document.body?.classList.contains("dark-mode")||Vt(localStorage)},Ze=null,Po=!1,W=null,So=null,Ko=null,Rs=0,pt=!1,We=null,$s=null,qo=null,mt=document.readyState!=="loading";function Vl(){let o=document.querySelector(xn);return document.getElementById("divTabelaProcesso")??o?.parentElement??null}function Io(o){So?.pronta(),W?.mostrar(!1),Ne(document),o&&o!=="usuario"&&console.warn("[SEI Pro] Grade do controle indispon\xEDvel, usando a vis\xE3o nativa:",o)}function Ye(){if(W||!Po)return;let o=new Oe(location.href,()=>ae(document,location.href)),e=Cr(ae(document,location.href)),r=e.unidade.id,t=In({local:gr(chrome.storage.local,"local"),sync:gr(chrome.storage.sync,"sync")},String(r),e.usuario.login);if(["hdnRecebidosPaginaAtual","hdnGeradosPaginaAtual","hdnDetalhadoPaginaAtual"].some(c=>document.getElementById(c)?.value&&document.getElementById(c).value!=="0")&&!sessionStorage.getItem("spro_grade_reset")){try{sessionStorage.setItem("spro_grade_reset","1")}catch{}qr(o.http,ae(document,location.href)).restaurar().then(()=>location.reload()).catch(()=>Io("pagina intermediaria"));return}try{sessionStorage.removeItem("spro_grade_reset")}catch{}let n=Go(document);if(!n.processos.length&&!n.totais.recebidos&&!n.totais.gerados)return So?.pronta(),Io("caixa vazia");let s=Vl();if(!s)return Io("sem ponto de encaixe");let i=n.processos.filter(c=>!c.sigiloso&&c.naPaginaAtual).slice(0,6).map(c=>c.protocolo);W=Cs({doc:document,inicial:n,agora:()=>Date.now(),hoje:()=>Fo(),eu:e.usuario.login||void 0,armazem:t,fonte:qr(o.http,ae(document,location.href),n.visao),mover:{marcador:async(c,l)=>void await Pa(o,c,l,{aplicar:!0}),atribuir:async(c,l)=>void await ya(o,c,l,{aplicar:!0})},acoes:()=>Ka(document),css:`${Gt}
${Is}
${ks}
${Ls}`,escuro:Wo(),baixar:(c,l,u)=>Xt(c,l,u),novoId:()=>jt(),extras:i.length?async()=>{let c=async p=>{let m;for(let v of i)try{return await pa(o,p,v)}catch(x){m=x}return console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${p}`,m instanceof Error?m.message:m),[]},[l,u]=await Promise.all([c("marcadores"),c("usuarios")]);return{marcadores:l.map(p=>p.nome),responsaveis:u.map(p=>{let[m,...v]=p.nome.split(" - ");return{sigla:m.trim(),nome:v.join(" - ").trim()||m.trim()}})}}:void 0,aoVoltarNativa:()=>pe(),enviarAcao:(c,l)=>Xa(document,c,l),editarEspecificacao:async(c,l)=>void await ga(o,c,{especificacao:l},{aplicar:!0}),abrirPrazo:c=>{document.documentElement.setAttribute("data-spro-prazos-alvo",c),document.dispatchEvent(new CustomEvent("spro-prazos-abrir"))},anotar:async(c,l)=>void await Ea(o,c,l,{aplicar:!0}),consultarAndamento:(c,l)=>Ha(o,c,{sigla:e.unidade.sigla,nome:e.unidade.nome},l)}),W.definirNomesCompletos(pt),Hl(W),$s?.(),$s=Ft(document,()=>W?.definirTema(Wo())),s.before(W.host),Wa(document,W.host),Fl(),W.iniciar().then(()=>{So?.pronta(),zo(document)&&Rr(document)}).catch(c=>Io(String(c)))}function Hl(o){qo?.disconnect();let e=()=>o.definirFiltroExterno(document.documentElement.getAttribute(Ts)??"");e(),qo=new window.MutationObserver(e),qo.observe(document.documentElement,{attributes:!0,attributeFilter:[Ts]})}function Fl(){We?.disconnect();let o=window.MutationObserver,e=!1;We=new o(()=>{e||(e=!0,setTimeout(()=>{if(e=!1,!(!W||!Po||W.host.isConnected&&!!W.host.shadowRoot&&document.querySelectorAll("#spro-grade").length===1||Rs>=6)){Rs+=1,W.fechar(),W=null,qo?.disconnect(),qo=null;for(let t of document.querySelectorAll("#spro-grade"))t.remove();(zo(document)||Po)&&Ye()}},150))}),We.observe(document.body??document.documentElement,{childList:!0,subtree:!0})}function pe(){Ze&&(zo(document)?(Po=!1,Ie(localStorage,!1),W?.mostrar(!1),Ne(document)):(Po=!0,Ie(localStorage,!0),ke(document,Wo()),W?(W.mostrar(!0),Rr(document)):(So=Te(Io),So.iniciarContagem(),Ye())),Ko?.(),Ko=$e(document,()=>zo(document),pe))}function jl(o){o!==Ze&&(Ze=o,o?(mt&&(Ko??=$e(document,()=>zo(document),pe)),Po&&(ke(document,Wo()),So??=Te(Io),mt&&(So.iniciarContagem(),Ye()))):(Po=!1,Ie(localStorage,!1),Ko?.(),Ko=null,We?.disconnect(),qo?.disconnect(),qo=null,W?.fechar(),W=null,So?.pronta(),Ne(document)))}function Gl(){if(!ql())return;let o=document.createElement("style");o.textContent=Ns,(document.head??document.documentElement).append(o),nn(localStorage)&&(Po=!0,ke(document,Wo()),So=Te(Io)),ln(document,pe),an(document,Wo);let e=()=>{mt=!0,Po&&(So?.iniciarContagem(),Ye()),Ze&&(Ko??=$e(document,()=>zo(document),pe))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e();let r=a=>{pt=qt(a,"nomesusuarios"),W?.definirNomesCompletos(pt),jl(_t(a,_l))},t=!1;chrome.storage.onChanged.addListener((a,n)=>{n!=="sync"||!("dataValues"in a)||(t=!0,r(a.dataValues.newValue))}),chrome.storage.sync.get("dataValues").then(a=>{t||r(a.dataValues)}).catch(()=>{Po&&Io("sem prefer\xEAncias")})}Gl();})();
