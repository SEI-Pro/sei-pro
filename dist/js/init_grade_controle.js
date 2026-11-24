/* GERADO por grade-controle/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{function Fs(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function yr(o,e){return{obter:async(r=null)=>await o.get(r),gravar:async r=>{await o.set(r)},remover:async r=>{await o.remove(r)},chaves:typeof o.getKeys=="function"?async()=>await o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Fs(a))};try{chrome.storage.onChanged.addListener(t)}catch{}return()=>{try{chrome.storage.onChanged.removeListener(t)}catch{}}}}}var qt=o=>String(o).padStart(2,"0");function Uo(o=new Date){return`${o.getFullYear()}-${qt(o.getMonth()+1)}-${qt(o.getDate())}`}function Pe(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!e)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(e[1]),Number(e[2])-1,Number(e[3]),12)}function $o(o,e){return Math.round((Pe(e).getTime()-Pe(o).getTime())/864e5)}function uo(o){let[e,r,t]=o.split("-");return`${t}/${r}/${e}`}function Vt(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function Ht(o,e){let r=Vt(o,e);return!(r===!1||r===0||r==="")}function jt(o,e){let r=Vt(o,e);return r===!0||r===1||r==="1"}function Ft(o){try{return!!o.getItem("darkModePro")}catch{return!1}}function Gt(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function Ut(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function"||!o.documentElement)return()=>{};let t=new r(e);return t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>t.disconnect()}function Bt(o=crypto){if(typeof o.randomUUID=="function")return o.randomUUID();let e=o.getRandomValues(new Uint8Array(16));e[6]=(e[6]??0)&15|64,e[8]=(e[8]??0)&63|128;let r=[...e].map(t=>t.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var Qt=`/*
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
`;function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var po={fill:"currentColor",stroke:"none"},Xt="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Kt={estrela:[["path",{d:Xt}]],estrelaCheia:[["path",{d:Xt,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...po}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...po}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...po}],["circle",{cx:"12",cy:"12",r:"1.4",...po}],["circle",{cx:"19",cy:"12",r:"1.4",...po}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...po}],["circle",{cx:"15",cy:"6",r:"1.3",...po}],["circle",{cx:"9",cy:"12",r:"1.3",...po}],["circle",{cx:"15",cy:"12",r:"1.3",...po}],["circle",{cx:"9",cy:"18",r:"1.3",...po}],["circle",{cx:"15",cy:"18",r:"1.3",...po}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},Cl=Object.keys(Kt);function q(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of Kt[o]){let c=r.createElementNS(t,s);for(let[l,p]of Object.entries(i))c.setAttribute(l,p);a.append(c)}return a}function Jt(o,e,r,t=1e4){let a=URL.createObjectURL(new Blob([e],{type:r})),n=d("a",{href:a,download:o});document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),t).unref?.()}var k=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Er(o){if(o instanceof k)return o;if(o instanceof DOMException&&o.name==="AbortError")return new k("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new k("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}var Us={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function H(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Us[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Wt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Zt=null;function Me(o){return Zt?Zt(o):new DOMParser().parseFromString(o,"text/html")}function V(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var Bs={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Sr(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Bs[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function De(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=Sr(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function mo(o,e){let r=[],t=new RegExp(`\\b${e}\\(`,"g");for(let a of o.matchAll(t)){let[n]=De(o,a.index+a[0].length);r.push(n)}return r}function _(o){return typeof o=="string"?H(o):o==null?"":String(o)}var Qs=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function wo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Qs))e.add(r[0]);return[...e]}function Y(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function ro(o,e,r={}){let t=Array.isArray(o)?o:wo(o);for(let a of t){let n=Y(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function Yt(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=wo(r).filter(s=>Y(s).get("acao")===e),n=(t.length?t:wo(o.html).filter(s=>Y(s).get("acao")===e)).sort((s,i)=>[...Y(s).keys()].length-[...Y(i).keys()].length)[0];if(!n)throw new k("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Xs(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=De(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Sr(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Ks(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=De(o,r.index+r[0].length);e.push({tipo:_(t[0]),idPai:_(t[2]),href:_(t[3]),titulo:_(t[5]),icone:_(t[6]),extra:t[8]==null?void 0:_(t[8])})}return e}function oa(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function ea(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>_(e[1])))]}var Js=/\s*\(\d{5,}\)\s*$/;function Ws(o){let e=o.html,r=Xs(e),t=Ks(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=_(a.args[1]),s=oa(t,n),i=r.filter(c=>c.args[0]==="DOCUMENTO").map(c=>{let l=_(c.args[1]),p=_(c.args[5]),f=_(c.args[7]),m=(c.props.src??"").replace(/&amp;/g,"&"),y=t.find(x=>x.tipo==="ASSINATURA"&&x.idPai===l),{nivel:v,hipotese:M}=oa(t,l),E=(/documento_([a-z0-9]+)\.svg/.exec(f)?.[1]??"interno").replace("cancelado","interno");return{id:l,numero:_(c.args[15])||(/\((\d{5,})\)\s*$/.exec(p)?.[1]??""),titulo:p.replace(Js,""),pasta:c.args[2]&&String(c.args[2]).startsWith("PASTA")?String(c.args[2]):null,externo:/documento_download_anexo/.test(m)||!/documento_interno|documento_cancelado|formulario|email/.test(f),formato:E,nivel:v,hipotese:M,assinado:!!y,assinaturas:y?y.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(f),unidadeGeradora:t.find(x=>x.tipo==="UNIDADE_GERADORA"&&x.idPai===l)?.extra,link:_(c.args[3]).replace(/&amp;/g,"&"),src:m,acoes:wo(c.props.acoes??""),botoes:ea(c.props.acoes??"")}});return{idProcedimento:n,protocolo:_(a.args[5])||_(a.args[15]),tipo:_(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:wo(a.props.acoes??""),botoesProcesso:ea(a.props.acoes??""),linkProcesso:_(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:wo(e),pagina:o}}async function ra(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new k("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=ro(t.html,"procedimento_visualizar")&&wo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Ws(t)}function bo(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?ro(t.acoes,e):null}return ro(o.acoesProcesso,e)??ro(o.links,e,{id_procedimento:o.idProcedimento})}function co(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var ne={publico:"0",restrito:"1"},Ce={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function se(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(H(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var sa="\xA5",wr="\xB1";function ta(o){return o.map(e=>`${e.id}${wr}${e.texto}`).join(sa)}function Zs(o){return o?o.split(sa).map(e=>{let[r,...t]=e.split(wr);return{id:r,texto:t.join(wr)}}):[]}function aa(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var U=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Ys(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,V(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${na(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??V(t),texto:V(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=oo(r),n=t.find(s=>s.valor===r)??t.find(s=>oo(s.texto)===a)??Pr(t.filter(s=>oo(s.texto).includes(a)));if(!n)throw new k("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Zs(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:ta(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new k("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new k("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${V(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??Pr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??V(r)??e]:[e,e]}hiddenDaLupa(e){let r=aa(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of aa(this.pagina.html)){let t=this.elemento.querySelector(`select#${na(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:V(n)}));(this.valor(r)??"")||this.definir({[r]:ta(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function Ys(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(l=>l.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let l of c)e.push({nome:t,valor:l.getAttribute("value")??V(l)})}}return e}function oo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Mr(o,e,r){let t=oo(e),a=o.find(n=>n.id===e)??o.find(n=>oo(n.texto)===t)??Pr(o.filter(n=>oo(n.texto).includes(t)));if(!a)throw new k("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function Pr(o){return o.length===1?o[0]:void 0}function na(o){return o.replace(/([^\w-])/g,"\\$1")}var oi={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function ke(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=oi[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var ei=/[A-Za-z0-9\-_.*]/;function ia(o){let e="";for(let r of o)r===" "?e+="+":ei.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function ca(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${ia(ke(r))}=${ia(ke(t??"",a))}`}).join("&")}function la(o){let e=r=>encodeURIComponent(ke(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var da="application/x-www-form-urlencoded";function Dr(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=Wt[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var ua="application/x-www-form-urlencoded; charset=ISO-8859-1";async function ri(o,e,r){let t=bo(e,"documento_escolher_tipo");if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await U.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=U.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function ti(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,V(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=Y(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,V(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function pa(o,e,r){let t=await o.arvore(e,{sinal:r});return ti((await ri(o,t,r)).pagina)}var ma={tipos_processo:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selTipoProcedimento"},hipoteses_legais:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selHipoteseLegal"},usuarios:{acao:"procedimento_atribuicao_cadastrar",form:"#frmAtividadeAtribuir",campo:"selAtribuicao"},marcadores:{acao:"andamento_marcador_gerenciar",form:"#frmAndamentoMarcadorCadastro",campo:"selMarcador"},grupos_acompanhamento:{acao:"acompanhamento_gerenciar",form:"#frmAcompanhamentoCadastro",campo:"selGrupoAcompanhamento"}};async function fa(o,e,r,t={}){let a;if(e==="tipos_documento")a=(await pa(o,r,t.sinal)).map(s=>({id:s.id,nome:s.nome}));else{let s=ma[e];if(!s)throw new k("ARGUMENTO_INVALIDO",`Lista desconhecida: ${e}.`,Object.keys(ma).concat("tipos_documento").join(" | "));let i=await o.arvore(r,{sinal:t.sinal}),c=bo(i,s.acao);if(!c)throw new k("SEI_ACAO_INDISPONIVEL",`Para listar ${e} use um processo aberto na sua unidade.`);if(e==="marcadores"&&(c=ro((await o.http.obter(c,{sinal:t.sinal,aceitarValidacao:!0})).html,"andamento_marcador_cadastrar"),!c))throw new k("SEI_VERSAO_NAO_SUPORTADA","Tela de marcadores n\xE3o reconhecida.");let l=await U.abrir(o.http,c,s.form,{sinal:t.sinal,aceitarValidacao:!0});a=e==="hipoteses_legais"?(await se(o,l,"1",t.sinal)).map(p=>({id:p.id,nome:p.texto})):l.opcoes(s.campo).filter(p=>p.valor&&p.valor!=="null"&&p.texto).map(p=>({id:p.valor,nome:p.texto}))}let n=t.filtro?oo(t.filtro):"";return n?a.filter(s=>oo(s.nome).includes(n)):a}function ga(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function ai(o,e,r){let t=bo(e,"procedimento_alterar"),a=t??bo(e,"procedimento_consultar");if(!a)throw new k("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await U.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function ha(o){return o.map(e=>e.texto).filter(Boolean)}async function ba(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await ai(o.http,a,{sinal:t.sinal});if(!s)throw new k("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...co("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let l=ga(n,"selTipoProcedimento"),p=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:p.valor}),i.push(...co("Tipo",l,p.texto))}if(r.nivel!==void 0){let l=Ce[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:ne[r.nivel]}),i.push(...co("N\xEDvel de acesso",l,Ce[ne[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let l=ga(n,"selHipoteseLegal"),p=n.valor("rdoNivelAcesso")||ne.restrito,f=Mr(await se(o,n,p,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:f.id}),i.push(...co("Hip\xF3tese legal",l,f.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new k("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(i.push(...co("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(i.push(...co("Interessados",ha(n.itensLupa("selInteressadosProcedimento")).join("; "),ha(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:l=>Y(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}async function xa(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function Aa(o,e,r){let t=bo(o,e);if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var ya=o=>e=>Y(e.url).get("acao")!==o;async function ni(o,e,r,t){let a=await o.http.obter(Aa(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return U.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>ro(a.html,s)).find(Boolean);if(!n)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return U.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Ea(o,e,r,t){let a=await xa(o,e,t.sinal),n=await ni(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??ya(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Sa(o,e,r,t){return Ea(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=co("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...co("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function wa(o,e,r,t){return Ea(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(l=>l.valor===a.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=oo(r),i=a.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=i.find(l=>l.valor===r)??i.find(l=>oo(l.texto.split(" - ")[0])===s)??i.find(l=>oo(l.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(l=>oo(l.texto).includes(s)).length===1?i.find(l=>oo(l.texto).includes(s)):void 0);if(!c)throw new k("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(l=>l.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),co("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}async function si(o,e,r){let t=Aa(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function va(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:V(t[1]),texto:V(t[2]),usuario:V(t[3]),data:V(t[4])}})}async function Pa(o,e,r,t){let a=await xa(o,e,t.sinal),n=await si(o,a,t.sinal),s=va(n),i=oo(r.marcador),c=s.find(m=>oo(m.marcador)===i),l={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...l,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=ro(n.html,"andamento_marcador_remover");if(!m)throw new k("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let y=U.de(n,"#frmGerenciarMarcador",o.http);y.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let v=await o.http.enviar(m,y.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(va(v).some(M=>M.id===c.id))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let p;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))p=U.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=ro(n.html,"andamento_marcador_cadastrar");if(!m)throw new k("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");p=await U.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let f=p.escolher("selMarcador",r.marcador);return p.definir({hdnIdMarcador:f.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?co(`Texto do marcador ${f.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${f.texto}${r.texto?`: ${r.texto}`:""}`}],l.mudancas.length?t.aplicar?(await p.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:ya("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${f.texto}" aplicado em ${a.protocolo}.`}):{...l,resumo:`Vai marcar ${a.protocolo} com "${f.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}var ii={resumido:"R",completo:"P",total:"T"};function Ma(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(V(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(a=>{let n=[...a.querySelectorAll("td")],s=n[1]?.querySelector("a")?.getAttribute("title")??"";return{data:V(n[0]),unidade:V(n[1]),...s?{unidadeNome:s}:{},usuario:V(n[2]),descricao:V(n[3])}}),total:r}}async function Da(o,e,r={}){let t=r.limite??500,a=await o.http.obter(e,{sinal:r.sinal}),n=ii[r.tipo??"resumido"];n!=="R"&&(a=await U.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:"0"}).enviar({sinal:r.sinal}));let{itens:s,total:i}=Ma(a),c=[...s];for(let l=1;c.length<Math.min(i,t)&&s.length>0;l+=1)a=await U.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:String(l)}).enviar({sinal:r.sinal}),{itens:s}=Ma(a),c.push(...s);return{total:i||c.length,andamentos:c.slice(0,t)}}function Ca(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}`:void 0}var ci=["Processo recebido na unidade","Reabertura do processo na unidade"],ka=/^Processo (?:p\u00FAblico|restrito|sigiloso) gerado/i,li=/^Processo remetido pela unidade\s+(.+)$/i;function di(o,e){return o.unidade.trim()===e.sigla.trim()&&e.sigla.trim()?!0:!!e.nome?.trim()&&o.unidadeNome?.trim()===e.nome.trim()}function La(o,e){let r=typeof e=="string"?{sigla:e}:e,t={},a=o.filter(i=>ka.test(i.descricao.trim())),n=a[a.length-1],s=n?Ca(n.data):void 0;s&&(t.autuacao=s);for(let i of o){if(!di(i,r))continue;let c=i.descricao.trim(),l=Ca(i.data);if(l&&(!t.recebimento&&(ci.includes(c)||ka.test(c))&&(t.recebimento=l),!t.envio)){let p=li.exec(c);p&&(t.envio=l,t.unidadeEnvio=p[1].trim())}}return t}var Cr=[["hoje","Hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["trimestre","Nos \xFAltimos 90 dias"],["antigo","H\xE1 mais de 90 dias"],["sem","Sem informa\xE7\xE3o"]];function Oa(o,e){if(!o)return"sem";let r=$o(o,e);return Number.isNaN(r)||r<0?"sem":r<1?"hoje":r<=7?"semana":r<=30?"mes":r<=90?"trimestre":"antigo"}var kr=1440*6e4,ie=(o,e)=>e-o.consultadoEm>=0&&e-o.consultadoEm<kr;var Le=class extends Error{sessao=!0},ui=2,pi=250,mi=5,fi=o=>new Promise(e=>setTimeout(e,o));async function Ia(o){let e=[...o.alvos],r=o.esperar??fi,t={feitos:0,total:e.length,semDados:0},a="concluida",n=0,s=o.limiteErros??mi;async function i(){for(;a==="concluida";){if(o.sinal.aborted){a="cancelada";return}let c=e.shift();if(!c)return;try{let l=await o.consultar(c,o.sinal);n=0,t.feitos+=1,l||(t.semDados+=1),o.aoResolver(c,l,{...t},!1)}catch(l){if(o.sinal.aborted){a="cancelada";return}if(l.sessao){a="sessao";return}if(n+=1,t.feitos+=1,t.semDados+=1,o.aoResolver(c,null,{...t},!0),n>=s){a="erros";return}}e.length&&await r(o.pausaMs??pi)}}return await Promise.all(Array.from({length:Math.max(1,o.simultaneas??ui)},()=>i())),{motivo:a,progresso:t}}var gi=500;async function $a(o,e,r,t){if(!e.link)return null;try{let a=await o.http.obter(e.link,{sinal:t});if(!/acao=procedimento_visualizar/.test(a.url)){let c=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)return null;a=await o.http.obter(c.replace(/&amp;/g,"&"),{sinal:t})}let n=ro(a.html,"procedimento_consultar_historico");if(!n)return null;let{andamentos:s}=await Da(o,n,{tipo:"resumido",limite:gi,sinal:t}),i=La(s,r);return Object.keys(i).length?i:null}catch(a){if(a instanceof k&&a.codigo==="SEI_SESSAO_EXPIRADA")throw new Le(a.message);if(a instanceof k&&(a.codigo==="SEI_SIGILOSO"||a.codigo==="SEI_ACAO_INDISPONIVEL"||a.codigo==="SEI_NAO_ENCONTRADO"))return null;throw a}}function Ra(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Me(r)}}}function Na(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new k("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new k("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=V(r);throw new k("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new k("SEI_VALIDACAO",r,r)}return o}function Ta(o,e={}){let r=new URL(".",o),t=e.fetch??((...f)=>fetch(...f)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(f){n>=a&&await new Promise(m=>s.push(m)),n+=1;try{return await f()}finally{n-=1,s.shift()?.()}}let c=f=>new URL(f.replace(/&amp;/g,"&"),r).href;async function l(f,m,y){return i(async()=>{try{let v=await t(c(f),{credentials:"same-origin",redirect:"follow",...m,signal:y.sinal}),M=Dr(await v.arrayBuffer());return Na(Ra(v.url||c(f),v.status,M),y)}catch(v){throw Er(v)}})}async function p(f,m={}){return i(async()=>{try{let y=await t(c(f),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),v=new Uint8Array(await y.arrayBuffer()),M=(y.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();M==="text/html"&&Na(Ra(y.url||c(f),y.status,Dr(v)),m);let E=y.headers?.get("content-disposition")??"",x=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(E)?.[1]??/filename="?([^";]+)"?/i.exec(E)?.[1]??"");return{bytes:v,tipo:M,nome:x}}catch(y){throw Er(y)}})}return{base:r,absoluta:c,baixar:p,obter:(f,m={})=>l(f,{method:"GET"},m),enviar:(f,m,y={})=>l(f,y.utf8?{method:"POST",headers:{"Content-Type":da},body:la(m)}:{method:"POST",headers:{"Content-Type":ua},body:ca(m,y.modos)},y)}}function hi(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function bi(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Lr(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=hi(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:bi(o),sigla:V(r)||V(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var vi=3e4,Oe=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ta(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new k("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Lr(this.base())}linkMenu(e){return Yt(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new k("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=U.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=Y(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new k("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let p=Y(H(c)).get("id_procedimento")??"",f=i.get("id_protocolo")??"",m={idProcedimento:p,idDocumento:f&&f!==p?f:void 0,linkArvore:H(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<vi)return a.arvore;let n=await ra(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:H(s[1]),texto:H(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=Me(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function ce(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var za={recebidos:"Recebidos",gerados:"Gerados",detalhado:"Detalhado"},Ro=(o,e)=>`${o}:${e}`;function _a(o,e,r="resumida"){let t={},a=r==="detalhada"?["detalhado"]:["recebidos","gerados"];for(let n of a){let s=n==="detalhado"?[...o]:o.filter(f=>f.grupo===n);if(!s.length)continue;let i=[...new Set(s.map(f=>f.pagina))].sort((f,m)=>f-m),c=n==="detalhado"?"na lista":`em ${za[n]}`;if(i.length>1){let f=i.map(m=>m+1).join(" e ");return{ok:!1,motivo:`O SEI s\xF3 aceita, de uma vez, processos de uma mesma p\xE1gina ${c} (marcados nas p\xE1ginas ${f}). Deixe s\xF3 uma p\xE1gina marcada.`}}let l=i[0],p=e.get(Ro(n,l));if(!p?.itens||!p.hash)return{ok:!1,motivo:`Os dados da p\xE1gina ${l+1} ainda n\xE3o foram lidos. Espere o carregamento terminar.`};t[n]={ids:s.map(f=>f.id),pagina:l,selecao:p}}return{ok:!0,plano:{porGrupo:t,todosNaPaginaAtual:o.every(n=>n.naPaginaAtual)}}}function xi(o){let e={},r=o.porGrupo.detalhado?["detalhado"]:["recebidos","gerados"];for(let t of r){let a=o.porGrupo[t],n=za[t];if(e[`hdn${n}ItemId`]="",!a){e[`hdn${n}ItensSelecionados`]="";continue}e[`hdn${n}ItensSelecionados`]=a.ids.join(","),e[`hdn${n}Itens`]=a.selecao.itens,e[`hdn${n}ItensHash`]=a.selecao.hash}return e}function qa(o,e,r){let t=o.getElementById("frmProcedimentoControlar");if(!t)throw new Error("Formul\xE1rio do Controle de Processos n\xE3o encontrado.");let a=o.createElement("form");a.setAttribute("method","post"),a.setAttribute("action",e),a.style.display="none";let n=new Map;for(let s of Array.from(t.querySelectorAll("input, select, textarea")))!s.name||s.disabled||s.type==="checkbox"||s.type==="radio"||s.type==="button"||s.type==="submit"||n.set(s.name,s.value);for(let[s,i]of Object.entries(xi(r)))n.set(s,i);for(let[s,i]of n){let c=o.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",s),c.setAttribute("value",i),a.append(c)}o.body.append(a),a.submit()}var Va=o=>o.some(e=>e.sigiloso);var Ai='a[onclick*="acaoControleProcessos"]';function Ha(o){let e=/acaoControleProcessos\(\s*'([^']*)'\s*,\s*(true|false)\s*,\s*(true|false)/.exec(o.elemento.getAttribute("onclick")??"");return e?{url:e[1].replace(/&amp;/g,"&"),requerSelecao:e[2]==="true",aceitaSigiloso:e[3]==="true"}:null}function ja(o){let e=new Set,r=[];for(let t of o.querySelectorAll(Ai)){let a=/[?&]acao=([a-z0-9_]+)/.exec(t.getAttribute("onclick")??"")?.[1],n=t.querySelector("img");if(!a||!n||e.has(a))continue;e.add(a);let s=n.getAttribute("title")||n.getAttribute("alt")||a,i=n.getAttribute("src")??"";try{i=new URL(i,o.baseURI||o.location?.href).href}catch{}r.push({acao:a,rotulo:s,icone:i,elemento:t})}return r}var yi="data-spro-recolhido",Ei=".collapseTabelaProcesso";function Si(o){let e=[...o.querySelectorAll(Ei)].filter(r=>r.id!=="spro-grade");return e.length>0&&e.some(r=>r.classList.contains("displayNone"))}function Fa(o,e,r=o.defaultView?.MutationObserver){let t=()=>e.toggleAttribute(yi,Si(o));if(t(),!r)return()=>{};let a=new r(t);return a.observe(o.body??o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0}),()=>a.disconnect()}var wi=/^\s*\[( |x|X)\]\s?(.*)$/;function Po(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=wi.exec(e);return r?{marca:r[1]!==" ",texto:r[2]}:{marca:null,texto:e}})}function Ie(o){return o.map(e=>e.marca===null?e.texto:`${e.marca?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Or(o,e){let r=new Set(e.filter(a=>a>=0&&a<o.length));if(!r.size)return[...o];let t=[...r].every(a=>o[a].marca!==null);return o.map((a,n)=>r.has(n)?{...a,marca:t?null:a.marca??!1}:a)}function $e(o,e){return o.map((r,t)=>t===e&&r.marca!==null?{...r,marca:!r.marca}:r)}function Ga(o){return Po(o).filter(e=>e.marca!==null||e.texto.trim()).map(e=>e.marca===null?e.texto:`${e.marca?"\u2611":"\u2610"} ${e.texto}`).join(" / ")}var Ne="data-tip",Ua="data-tip-nota",Pi="data-tip-autor",Re=0,Mi=`
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
`,Ba=o=>o.nodeType===1,Di=o=>o.some(e=>Ba(e)&&(e.id==="spro-grade"||e.classList.contains("spro-grade-botao")));function Ir(o){if(!Di(o))return null;for(let e of o)if(Ba(e)){if(e.id==="spro-grade")return null;if(e.hasAttribute(Ne)||e.hasAttribute(Ua)||e.hasAttribute("title"))return e}return null}function No(o){let e=o.getAttribute("title");return e&&(o.hasAttribute(Ne)||o.setAttribute(Ne,e),!o.hasAttribute("aria-label")&&!(o.textContent??"").trim()&&o.setAttribute("aria-label",e.split(`
`)[0]),o.removeAttribute("title")),o.getAttribute(Ne)??""}function Ci(o,e,r){let t=o.ownerDocument,a=t.createElement("div");a.className="nota";for(let n of Po(e)){if(n.marca===null&&!n.texto.trim())continue;let s=t.createElement("div");s.className="nota-l",n.marca!==null&&s.setAttribute("data-t",n.marca?"x":"o"),s.textContent=n.texto,a.append(s)}if(r){let n=t.createElement("div");n.className="nota-autor",n.textContent=r,a.append(n)}o.replaceChildren(a)}var $r=null;function Qa(o){let e=a=>{if(a.nodeType!==1)return;let n=a;n.hasAttribute("title")&&No(n);for(let s of Array.from(n.querySelectorAll("[title]")))No(s)};if(e(o.nodeType===11?o.host:o),o.nodeType===11)for(let a of Array.from(o.querySelectorAll("[title]")))No(a);let r=(o.ownerDocument??o).defaultView?.MutationObserver;if(!r)return()=>{};let t=new r(a=>{for(let n of a)if(n.type==="attributes")e(n.target);else for(let s of Array.from(n.addedNodes))e(s);$r?.()});return t.observe(o,{attributes:!0,attributeFilter:["title"],childList:!0,subtree:!0}),()=>t.disconnect()}function ki(o){let e=[],r=o;for(;r;)e.push(r),r=r.nodeType===11?r.host??null:r.parentNode;return e}function Li(o,e,r){let a=o.bottom+8,n=!1;a+e.altura>r.h-4&&o.top-8-e.altura>=4&&(a=o.top-8-e.altura,n=!0);let s=o.left+o.width/2-e.largura/2;return s=Math.max(4,Math.min(s,r.w-e.largura-4)),{x:Math.round(s),y:Math.round(Math.max(4,a)),acima:n}}function Xa(o,e=()=>!1){let r=o.defaultView;if(!r)return()=>{};let t=o.createElement("div");t.id="spro-dica-host";let a=t.attachShadow({mode:"open"}),n=o.createElement("style");n.textContent=Mi;let s=o.createElement("div");s.className="dica",s.setAttribute("role","tooltip"),s.hidden=!0,s.setAttribute("popover","manual"),a.append(n,s),o.documentElement.append(t);let i=null,c,l=!1,p=null;function f(){clearTimeout(c),i=null,l=!1,s.classList.remove("on"),s.hidden=!0;try{s.matches?.(":popover-open")&&s.hidePopover()}catch{}}function m(){if(!i||!i.isConnected)return v();let P=i.getAttribute(Ua),A=P!==null?P:No(i);if(!A)return f();P!==null?Ci(s,P,i.getAttribute(Pi)??""):s.textContent=A,s.classList.toggle("claro",!e()),s.hidden=!1;try{typeof s.showPopover=="function"&&!s.matches(":popover-open")&&s.showPopover()}catch{}let w=i.getBoundingClientRect(),I=s.getBoundingClientRect(),O=Li(w,{largura:I.width,altura:I.height},{w:r.innerWidth,h:r.innerHeight});s.style.left=`${O.x}px`,s.style.top=`${O.y}px`,s.classList.add("on"),l=!0}function y(P,A){let w=o.elementFromPoint(P,A);for(let I=0;I<4&&w?.shadowRoot;I++){let O=w.shadowRoot.elementFromPoint(P,A);if(!O||O===w)break;w=O}return w}function v(){if(!p)return f();let P=y(p.x,p.y),A=P?Ir(ki(P)):null;if(A===i&&i?.isConnected)return;let w=l;f(),A&&(No(A),i=A,w||Re===0?m():c=setTimeout(m,Re))}$r=()=>{i&&!i.isConnected&&v()};let M=P=>{let A=P;typeof A.clientX=="number"&&(p={x:A.clientX,y:A.clientY});let w=Ir(P.composedPath());w===i&&i?.isConnected||(f(),w&&(No(w),i=w,Re>0?c=setTimeout(m,Re):m()))},E=P=>{let A=Ir(P.composedPath());!A||!A.matches?.(":focus-visible")||(f(),No(A),i=A,m())},x=()=>f();return o.addEventListener("pointerover",M,!0),o.addEventListener("mouseover",M,!0),o.addEventListener("pointermove",M,!0),o.addEventListener("mousemove",M,!0),o.addEventListener("focusin",E,!0),o.addEventListener("focusout",f,!0),o.addEventListener("pointerdown",f,!0),o.addEventListener("keydown",f,!0),o.addEventListener("scroll",f,!0),o.documentElement.addEventListener("pointerleave",x),()=>{f(),$r=null,o.removeEventListener("pointerover",M,!0),o.removeEventListener("mouseover",M,!0),o.removeEventListener("pointermove",M,!0),o.removeEventListener("mousemove",M,!0),o.documentElement.removeEventListener("pointerleave",x),o.removeEventListener("focusin",E,!0),o.removeEventListener("focusout",f,!0),o.removeEventListener("pointerdown",f,!0),o.removeEventListener("keydown",f,!0),o.removeEventListener("scroll",f,!0),t.remove()}}var to="data-spro-grade",vo="data-spro-grade-pronta",le="data-spro-grade-escuro",Rr="spro_grade",Nr="spro-grade-pre";var Oi="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function Ii(){let o=Oi.split(", ").map(t=>`html[${to}] ${t}`).join(`,
`),e=`html[${to}]:not([${vo}]) #divTabelaProcesso::before,
html[${to}]:not([${vo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before`,r=["#divFiltro","#newFiltro","#processosProActions","#processosKanban"].map(t=>`html[${to}] ${t}`).join(`,
`);return`${o} { display: none !important; }
/* Com a grade pronta, o container nativo das tabelas (min-height: 200px) so deixaria um vazio entre a grade e o painel de baixo. */
html[${to}][${vo}] #divTabelaProcesso { display: none !important; }
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
html[${to}][${le}]:not([${vo}]) #divTabelaProcesso::before,
html[${to}][${le}]:not([${vo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { --spro-sk: #2c333b; --spro-sk-2: #232a31; }
@keyframes spro-grade-pulso { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
@media (prefers-reduced-motion: reduce) {
  html[${to}]:not([${vo}]) #divTabelaProcesso::before,
  html[${to}]:not([${vo}]) #frmProcedimentoControlar:not(:has(#divTabelaProcesso))::before { animation: none; }
}`}function Ka(o){try{return o.getItem(Rr)==="1"}catch{return!1}}function Te(o,e){try{e?o.setItem(Rr,"1"):o.removeItem(Rr)}catch{}}function ze(o,e){let r=o.documentElement;if(r.setAttribute(to,"1"),r.removeAttribute(vo),e?r.setAttribute(le,"1"):r.removeAttribute(le),!o.getElementById(Nr)){let t=o.createElement("style");t.id=Nr,t.textContent=Ii(),(o.head??r).append(t)}}function _e(o){let e=o.documentElement;e.removeAttribute(to),e.removeAttribute(vo),e.removeAttribute(le),o.getElementById(Nr)?.remove()}var To=o=>o.documentElement.hasAttribute(to);function Tr(o){o.documentElement.setAttribute(vo,"1")}function qe(o,e={setTimeout:(r,t)=>setTimeout(r,t),clearTimeout:r=>clearTimeout(r)}){let r=!1,t,a=s=>{r||(r=!0,e.clearTimeout(n),e.clearTimeout(t),o(s))},n=e.setTimeout(()=>a("teto"),1e4);return{iniciarContagem(){r||(t=e.setTimeout(()=>a("prazo"),1500))},pronta(){r=!0,e.clearTimeout(n),e.clearTimeout(t)},falhou:s=>a(s),encerrada:()=>r}}var Ja="http://www.w3.org/2000/svg",$i={grade:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M3.5 9.5h17M9 9.5v10M3.5 14.5h17"}]],quadro:[["rect",{x:"3.5",y:"4.5",width:"4.6",height:"15",rx:"1.2"}],["rect",{x:"9.7",y:"4.5",width:"4.6",height:"9",rx:"1.2"}],["rect",{x:"15.9",y:"4.5",width:"4.6",height:"12",rx:"1.2"}]],lista:[["path",{d:"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"}]],agrupar:[["path",{d:"M4 6h16M4 12h10M4 18h13"}],["path",{d:"M18 10l3 2-3 2"}]],colunas:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M9.2 4.5v15M14.8 4.5v15"}]],disquete:[["path",{d:"M5 4.5h11l3.5 3.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"}],["path",{d:"M8 4.5v5h7v-5M8 20v-6h8v6"}]],densidade:[["path",{d:"M4 6h16M4 10h16M4 14h16M4 18h16"}]],semPessoa:[["circle",{cx:"12",cy:"8.5",r:"3.6"}],["path",{d:"M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5M4 4l16 16"}]],olhoFechado:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}],["path",{d:"M4 4l16 16"}]],recebido:[["path",{d:"M4 13.5l2.2-7A1.6 1.6 0 0 1 7.7 5.4h8.6a1.6 1.6 0 0 1 1.5 1.1l2.2 7"}],["path",{d:"M4 13.5V18a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18v-4.5h-4.6a3.4 3.4 0 0 1-6.8 0z"}]],gerado:[["path",{d:"M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z"}],["path",{d:"M14 3.5V7.5h4M9.5 14.5h5M9.5 17h3"}],["path",{d:"M9.5 11.5l2-2 2 2M11.5 9.5v3.5"}]],novaGuia:[["path",{d:"M14 4.5h5.5V10M19.5 4.5L11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],prioridade:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 7.5v5.5M12 16.4h.01"}]],seta:[["path",{d:"M6 9l6 6 6-6"}]],setaDireita:[["path",{d:"M9 6l6 6-6 6"}]],desfazer:[["path",{d:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"}]],bloquear:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],informacao:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 11v5M12 8h.01"}]]};function so(o,e=16,r=document){let t=r.createElementNS(Ja,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[n,s]of Object.entries(a))t.setAttribute(n,s);for(let[n,s]of $i[o]){let i=r.createElementNS(Ja,n);for(let[c,l]of Object.entries(s))i.setAttribute(c,l);t.append(i)}return t}var Ve="spro-grade-botao",Ri="#processosSEIPro .titlePanelHome, #processosSEIPro #divInfraBarraLocalizacao, #divInfraBarraLocalizacao.titlePanelHome, #divInfraBarraLocalizacao",Ni="Usar o Novo Controle de Processos",Ti="Voltar \xE0 vis\xE3o nativa do SEI";function zi(o,e,r){let t=o.querySelector(Ri);if(!t)return!1;let a=e?Ti:Ni,n=t.querySelector(`.${Ve}`);n||(n=o.createElement("button"),n.type="button",n.className=Ve,n.append(so("grade",18,o)),t.append(n));let s=[...t.children].filter(i=>i.classList.contains("spro-pnl-botao")).at(-1);return s&&s.compareDocumentPosition(n)&2&&s.after(n),n.setAttribute("data-tip",a),n.removeAttribute("title"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",String(e)),!0}function Za(o,e){let r=t=>{(t.composedPath?.()[0]??t.target)?.closest?.(`.${Ve}`)&&(t.preventDefault(),t.stopPropagation(),e())};return o.addEventListener("click",r,!0),()=>o.removeEventListener("click",r,!0)}var Wa=o=>{for(let e of o.querySelectorAll(`.${Ve}`))e.remove()};function He(o,e,r){let t=()=>zi(o,e(),r);t();let a=o.defaultView?.MutationObserver;if(!a||!o.body)return()=>Wa(o);let n=!1,s=new a(()=>{n||(n=!0,queueMicrotask(()=>{n=!1,s.disconnect(),t(),s.observe(o.body,{childList:!0,subtree:!0})}))});return s.observe(o.body,{childList:!0,subtree:!0}),()=>{s.disconnect(),Wa(o)}}function X(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var _i=/<div(?: style="text-decoration: line-through;")?><i class="(far fa-square|fas fa-check-square)"><\/i> ?([\s\S]*?)<\/div>/g;function qi(o){return o.includes("<div")?o.replace(_i,(e,r,t)=>`
${r==="far fa-square"?"[ ]":"[X]"} ${t}
`).replace(/\n{2,}/g,`
`).trim():o}var Vi=/^Anota[\u00e7c][\u00e3a]o( com prioridade)?\s+\/\s+([\s\S]*)\s+\/\s+(.*)$/i;function Ya(o){let e=o.querySelector('a[href*="acao=anotacao_registrar"]');if(!e)return null;let r=e.querySelector("img")?.getAttribute("src")??"",t=/anotacao2\.|prioridade/i.test(r),a=Vi.exec(e.getAttribute("aria-label")??"");if(a){let i=H(a[2]).replace(/\r\n?/g,`
`).trim();return i?{texto:i,autor:a[3].trim(),prioridade:!!a[1]||t}:null}let n=mo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];if(typeof n?.[0]!="string")return null;let s=qi(_(n[0])).trim();return s?{texto:s,autor:_(n[1]).trim(),prioridade:t}:null}function on(o,e,r){if(e){let a={idProcedimento:o,origem:"nativo",vencimento:e.data,idControlePrazo:e.idControlePrazo,sigla:e.sigla,linkNativo:e.link,...e.concluidoEm?{concluidoEm:e.concluidoEm}:{}};return r?.vencimento&&r.data===e.data?{...a,origem:"ambos",hora:r.hora,texto:r.texto||void 0}:a}if(!r)return null;let t={idProcedimento:o,origem:"marcador",hora:r.hora,texto:r.texto||void 0};return r.vencimento?{...t,vencimento:r.data}:{...t,inicio:r.data}}var Hi='a[href*="acao=controle_prazo_definir"]',ji=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,en=(o,e,r)=>`${r}-${e}-${o}`;function Fi(o){let e=o.trim().toLowerCase(),r=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(e);return r?{estado:"concluido",concluidoEm:en(r[1],r[2],r[3])}:/^at[e\u00E9] hoje$/.test(e)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(e)?{estado:"atrasado"}:/^\d+ dias?$/.test(e)?{estado:"noPrazo"}:null}function zr(o){let e=o.querySelector(Hi);if(!e)return null;let r=e.getAttribute("aria-label")??"";if(!r){let l=mo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof l?.[0]=="string"&&(r=`Controle de Prazo / ${_(l[0])}`)}let t=ji.exec(H(r).replace(/\s+/g," ").trim());if(!t)return null;let a=Fi(t[5]);if(!a)return null;let n=H(e.getAttribute("href")??""),s=Y(n),i=s.get("id_controle_prazo")??"",c=s.get("id_procedimento")??o.id.replace(/^P/,"");return!i||!c?null:{idControlePrazo:i,idProcedimento:c,sigla:t[1],data:en(t[2],t[3],t[4]),link:n,...a}}var rn=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,tn=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,an=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function Gi(o,e,r){let t=`${r}-${e}-${o}`;try{return Uo(Pe(t))===t?t:null}catch{return null}}var Ui=o=>o.padStart(2,"0");function _r(o){let e=o.replace(/\r\n?/g,`
`),r=rn.exec(e);if(!r)return null;let t=Gi(r[1],r[2],r[3]);if(!t)return null;let a=tn.exec(e),n=a?`${Ui(a[1])}:${a[2]}`:void 0,s=an.test(e),i=e.replace(an,"").replace(rn,"");return a&&(i=i.replace(tn,"")),i=i.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:s,texto:i}}function nn(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=mo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&e.push({texto:_(t[0]),nome:_(t[1])})}return e}function sn(o,e){let r=o.querySelector("input[type=checkbox]"),t=o.querySelector("a[href*='procedimento_trabalhar']");if(!r||!t)return null;let a=r.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(t.getAttribute("class")??""),s=[...o.querySelectorAll("td")],i=n?[]:[...s[1]?.querySelectorAll("a[aria-label]")??[]].map(c=>c.getAttribute("aria-label")??"");return{idProcedimento:r.getAttribute("value")??Y(t.getAttribute("href")??"").get("id_procedimento")??"",protocolo:r.getAttribute("title")??V(t),grupo:e,tipo:/Tipo (.*?)(?: \/ Especifica|$)/.exec(a)?.[1]?.trim()??"",especificacao:n?"":/Especifica\S* (.*)$/.exec(a)?.[1]?.trim()??"",sigiloso:n,novo:/NaoVisualizado/.test(t.getAttribute("class")??""),atribuido:V(s[s.length-1]).replace(/^\(|\)$/g,""),sinais:i,documentoNovo:!!s[1]?.querySelector("img[src*='exclamacao']")||i.some(c=>/documento foi inclu/i.test(c))}}var Bi=/marcador_([a-z0-9_]+)\.svg/i,Qi=/\b(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?\b/;function cn(o){let e=Qi.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function Xi(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=mo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],a=H(r.getAttribute("aria-label")??"").trim(),n=/^Marcador\s*\/\s*(.*)$/s.exec(a),s=(typeof t?.[1]=="string"&&t[1]?_(t[1]):n?.[1]??"").trim();if(!s)continue;let i=typeof t?.[0]=="string"?_(t[0]).trim():"",c=cn(a)??cn(i);e.push({nome:s,cor:Bi.exec(r.querySelector("img")?.getAttribute("src")??"")?.[1]??"",texto:i,...c!==void 0?{dataHora:c}:{}})}return e}function Ki(o){let e=[];for(let r of o.querySelectorAll("a")){let t=r.querySelector("img")?.getAttribute("src")??"",a=/retorno_(programado|aguardando)(\d)?\.svg/.exec(t);if(!a)continue;let n=H(r.getAttribute("aria-label")??"").trim();e.push({tipo:a[1],descricao:n,atrasado:a[2]==="3"||/atrasad/i.test(n)})}return e}function Ji(o){let e=o.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla'),r=e?.textContent?.trim();if(!e||!r)return;let t=H(e.getAttribute("title")??"").replace(/^Atribu[i\u00ED]do para\s+/i,"").trim();return{sigla:r,nome:t||r}}function qr(o,e){let r=sn(o,e.grupo);if(!r?.idProcedimento)return null;let t=Xi(o),a=null;for(let v of nn(o)){let M=_r(v.texto);if(M){a=M;break}}let n={id:r.idProcedimento,protocolo:r.protocolo,grupo:e.grupo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso,naoVisualizado:r.novo,marcadores:r.sigiloso?[]:t,retornos:r.sigiloso?[]:Ki(o),acompanhamentoEspecial:!r.sigiloso&&!!o.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),documentoNovo:r.documentoNovo,pagina:e.pagina,naPaginaAtual:e.naPaginaAtual},s=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("onmouseover")??"";/\(URGENTE\)/.test(s)&&(n.urgente=!0),/\(TRANCADO\)/.test(s)&&(n.trancado=!0);let i=o.querySelector(".acompanhamentoesp_icon");if(i){let v=mo(i.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof v?.[1]=="string"&&v[1]&&(n.acompanhamentoGrupo=_(v[1]))}let c=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("href");c&&(n.link=H(c));let l=o.querySelector('a[href*="acao=andamento_marcador_gerenciar"]')?.getAttribute("href");l&&!r.sigiloso&&(n.linkMarcadores=H(l));let p=o.querySelector('img[src*="exclamacao"]'),f=p?.closest("a")??p;if(f){let v=mo(f.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],M=((typeof v?.[0]=="string"&&v[0]?_(v[0]):"")||H(f.getAttribute("aria-label")??"")||H(f.getAttribute("title")??"")||H(p?.getAttribute("title")??"")||H(p?.getAttribute("alt")??"")).trim();M&&(n.documentoNovoDica=M)}let m=o.querySelector('a[href*="andamento_situacao_gerenciar"]');if(m&&!r.sigiloso){let v=mo(m.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],M=((typeof v?.[0]=="string"&&v[0]?_(v[0]):"")||H(m.getAttribute("aria-label")??"")).trim();M&&(n.pontoControle=M)}let y=Ji(o);if(y&&(n.atribuicao=y),!r.sigiloso){let v=Ya(o);v&&(n.anotacao=v);let M=on(n.id,zr(o),a);M&&(n.prazo=M)}return n}var dn="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado",Wi={recebidos:"tblProcessosRecebidos",gerados:"tblProcessosGerados"},Zi=[[/^tipo( do processo)?$/,"tipo"],[/^especificacao$/,"especificacao"],[/^(atribuicao|atribuido( para)?|responsavel)$/,"atribuicao"],[/^marcador(es)?$/,"marcador"],[/^prioridade$/,"prioridade"],[/^interessados?$/,"interessados"],[/^observacao$/,"observacao"],[/^ultima mov/,"ultimaMov"]];function Yi(o){let e=new Map;return[...(o.querySelector("thead tr")??[...o.querySelectorAll("tr")].find(t=>t.querySelector("th")))?.children??[]].forEach((t,a)=>{let n=X(t.textContent??""),s=Zi.find(([i])=>i.test(n));s&&e.set(a,s[1])}),e}function ln(o){let e=(o?.querySelector("caption")?.textContent??"").replace(/\s+/g," "),r=Number(/(\d+)\s+registro/.exec(e)?.[1]??0),t=/(\d+)\s+a\s+(\d+)\s*\)?/.exec(e);return{total:r,porPagina:t?Number(t[2])-Number(t[1])+1:0}}function oc(o,e,r){if(!r.size)return;let t=[...e.children];for(let[a,n]of r){let s=(t[a]?.textContent??"").replace(/\s+/g," ").trim();if(s)if(n==="tipo"&&!o.tipo)o.tipo=s;else if(n==="especificacao"&&!o.especificacao&&!o.sigiloso)o.especificacao=s;else if(n==="atribuicao"&&!o.atribuicao){let i=s.replace(/^\(|\)$/g,"");o.atribuicao={sigla:i,nome:i}}else if(n==="marcador"&&!o.marcadores.length&&!o.sigiloso)o.marcadores=[{nome:s,cor:"",texto:""}];else{if(o.sigiloso&&(n==="interessados"||n==="observacao"))continue;if(n==="prioridade")o.prioridade=s;else if(n==="interessados")o.interessados=s;else if(n==="observacao")o.observacao=s;else if(n==="ultimaMov"){let i=/(\d{2})\/(\d{2})\/(\d{4})/.exec(s);i&&(o.ultimaMov=`${i[3]}-${i[2]}-${i[1]}`)}}}}function ec(o){let e=o.querySelector("input[type=checkbox]")?.getAttribute("name")??"";return/^chkGerados/i.test(e)?"gerados":"recebidos"}function Bo(o,e={}){let r=e.pagina??0,t=e.naPaginaAtual??!0,a=[],n={recebidos:0,gerados:0},s={recebidos:0,gerados:0},i=o.getElementById("tblProcessosDetalhado"),c=new Set,l=m=>{m&&!c.has(m.id)&&(c.add(m.id),a.push(m))};for(let m of["recebidos","gerados"]){let y=o.getElementById(Wi[m]),{total:v,porPagina:M}=ln(y);n[m]=v,s[m]=M;for(let E of y?.querySelectorAll('tr[id^="P"]')??[]){let x=E.classList.contains("typeGerados")?"gerados":m;l(qr(E,{grupo:x,pagina:r,naPaginaAtual:t}))}}if(i){let m=Yi(i),{total:y,porPagina:v}=ln(i);for(let M of i.querySelectorAll("tr")){if(!M.querySelector('a[href*="procedimento_trabalhar"]'))continue;let E=ec(M),x=qr(M,{grupo:E,pagina:r,naPaginaAtual:t});x&&!c.has(x.id)&&(oc(x,M,m),l(x),n[E]=Math.max(n[E],y),s[E]=Math.max(s[E],v))}}let p=m=>o.getElementById(m)?.getAttribute("value")??"",f={recebidos:{itens:p("hdnRecebidosItens"),hash:p("hdnRecebidosItensHash")},gerados:{itens:p("hdnGeradosItens"),hash:p("hdnGeradosItensHash")},detalhado:{itens:p("hdnDetalhadoItens"),hash:p("hdnDetalhadoItensHash")}};return{processos:a,totais:n,porPagina:s,visao:i?"detalhada":"resumida",selecoes:f}}var rc=/\b(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})(?::(\d{2}))?\b/;function tc(o){let e=rc.exec(o);if(!e)return;let r=new Date(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]),Number(e[5]),Number(e[6]??0)).getTime();return Number.isFinite(r)?r:void 0}function ac(o){let e={};for(let r of o.querySelectorAll("tr.infraTrClara, tr.infraTrEscura, table.infraTable tr")){let t=[...r.children].filter(i=>i.tagName==="TD");if(t.length<3)continue;let a="",n;for(let i of t){let c=(i.textContent??"").replace(/\u00A0/g," ").replace(/\s+/g," ").trim();if(!a&&i.querySelector('img[src*="marcador_"]')&&(a=c||(i.querySelector("img")?.getAttribute("title")??"").trim()),n===void 0){let l=tc(c);l!==void 0&&(n=l)}}if(!a||n===void 0)continue;let s=X(a);(e[s]===void 0||n>e[s])&&(e[s]=n)}return e}async function un(o,e,r){if(!e.linkMarcadores)return null;try{let t=await o.http.obter(e.linkMarcadores,{sinal:r}),a=ac(t.doc);return Object.keys(a).length?a:null}catch(t){return t instanceof k&&(t.codigo==="SEI_SIGILOSO"||t.codigo==="SEI_ACAO_INDISPONIVEL"||t.codigo==="SEI_NAO_ENCONTRADO"||t.codigo==="CANCELADO"),null}}var nc=60;async function pn(o,e,r={}){let t=r.maxPaginas??nc,a=[],n=new Set(o.processos.map(l=>l.id)),s=!0,i,c=!1;try{for(let l of["recebidos","gerados"]){let p=o.totais[l],f=o.processos.filter(v=>v.grupo===l).length,m=o.porPagina[l]||f||1,y=Math.max(1,Math.ceil(p/m));for(let v=1;f<p;v+=1){if(r.sinal?.aborted)return s=!1,{processos:a,completo:s,...i?{erro:i}:{}};if(v>=t){s=!1;break}c=!0;let M=await e.pagina(l,v,r.sinal),E=Bo(M,{pagina:v,naPaginaAtual:!1}),x=E.processos.filter(P=>P.grupo===l&&!n.has(P.id));if(!x.length)break;for(let P of x)n.add(P.id);f+=x.length,a.push(...x),E.visao==="detalhada"?r.aoSelecao?.("detalhado",v,E.selecoes.detalhado):r.aoSelecao?.(l,v,E.selecoes[l]),r.aoPagina?.(x),r.aoProgresso?.({grupo:l,paginasLidas:v+1,paginasTotal:y,processos:f,total:p})}f<p&&(s=!1)}}catch(l){s=!1,i=l instanceof Error?l.message:String(l)}finally{if(c)try{await e.restaurar()}catch(l){i??=`N\xE3o foi poss\xEDvel voltar \xE0 primeira p\xE1gina: ${l instanceof Error?l.message:String(l)}`}}return{processos:a,completo:s,...i?{erro:i}:{}}}var sc=["hdnRecebidosItensSelecionados","hdnGeradosItensSelecionados","hdnRecebidosItemId","hdnGeradosItemId","hdnDetalhadoItensSelecionados","hdnDetalhadoItemId"];function Vr(o,e,r="resumida"){let t="#frmProcedimentoControlar",a=()=>({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",hdnDetalhadoPaginaAtual:"0",...Object.fromEntries(sc.map(n=>[n,""]))});return{async pagina(n,s,i){let c=r==="detalhada"?"hdnDetalhadoPaginaAtual":n==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual";return(await U.de(e,t,o).definir({...a(),[c]:String(s)}).enviar({sinal:i,aceitarValidacao:!0})).doc},async restaurar(n){await U.de(e,t,o).definir(a()).enviar({sinal:n,aceitarValidacao:!0})},restaurarAoSair(){try{let n=U.de(e,t,o);fetch(o.absoluta(n.action),{method:"POST",keepalive:!0,credentials:"include",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(n.definir(a()).pares()).toString()}).catch(()=>{})}catch{}}}}var ic=30*6e4,mn=5e3,Hr=()=>({vistoEm:{}});function gn(o){if(!o||typeof o!="object")return Hr();let e=o,r={};if(e.vistoEm&&typeof e.vistoEm=="object")for(let[i,c]of Object.entries(e.vistoEm))typeof c=="number"&&Number.isFinite(c)&&c>0&&(r[i]=c);let t=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0,a={vistoEm:r},n=t(e.visitaAtual),s=t(e.visitaAnterior);return n!==void 0&&(a.visitaAtual=n),s!==void 0&&(a.visitaAnterior=s),a}function hn(o,e){return o.visitaAtual===void 0?{...o,visitaAtual:e}:e-o.visitaAtual>ic?{...o,visitaAnterior:o.visitaAtual,visitaAtual:e}:o}function jr(o,e,r,t){let a={...o.vistoEm};for(let s of e)a[s]===void 0&&(a[s]=r);if(t){let s=new Set(e);for(let i of Object.keys(a))s.has(i)||delete a[i]}let n=Object.keys(a);if(n.length>mn)for(let s of n.sort((i,c)=>a[c]-a[i]).slice(mn))delete a[s];return{...o,vistoEm:a}}function bn(o,e){return o.map(r=>e.vistoEm[r.id]!==void 0?{...r,vistoEm:e.vistoEm[r.id]}:r)}function je(o){if(o===null)return"";if(o<1)return"hoje";if(o===1)return"1 dia";if(o<60)return`${o} dias`;let e=Math.floor(o/30);return e<24?`${e} meses`:`${Math.floor(o/365)} anos`}var vn="Contado desde a primeira vez que o SEI Pro viu o processo nesta unidade (o SEI n\xE3o informa a data de chegada).";var de=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao","caixa","parado","sinais"],Qo={processo:"Processo",tipo:"Tipo",especificacao:"Especifica\xE7\xE3o",responsavel:"Respons\xE1vel",marcadores:"Marcadores",prazo:"Prazo",anotacao:"Anota\xE7\xE3o",caixa:"Na caixa",parado:"Parado h\xE1",sinais:"Sinais"};var cc=30,lc=40,dc=()=>({colunas:"marcador",limite:0,raiasPorResponsavel:!1}),uc=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao"],Fr=2;function Xo(){return{id:"",nome:"Padr\xE3o",busca:"",ordem:[],agrupar:"nenhum",modo:"tabela",colv:Fr,colunas:[...uc],densidade:"confortavel",quadro:dc()}}var pc=["nenhum","responsavel","tipo","marcador","prazo","situacao","grupo","anotacao","acompanhamento","retorno","caixa","autuacao","recebimento","envio","unidadeEnvio"],mc=["protocolo","tipo","responsavel","marcador","prazo","caixa","parado","novo"],fc=["marcador","responsavel","prazo","tipo"];function Fe(o){let e=Xo();if(!o||typeof o!="object")return e;let r=o,t=Array.isArray(r.ordem)?r.ordem.filter(l=>!!l&&typeof l=="object"&&mc.includes(l.campo)).slice(0,4).map(l=>({campo:l.campo,decrescente:l.decrescente===!0})):[],a=Array.isArray(r.colunas)?[...new Set(r.colunas.filter(l=>de.includes(l)))]:[];if(a.includes("processo")&&r.colv!==Fr&&!a.includes("especificacao")){let l=a.indexOf("processo");a=[...a.slice(0,l+1),"especificacao",...a.slice(l+1)]}let n=r.quadro&&typeof r.quadro=="object"?r.quadro:{},s=Array.isArray(n.ordemColunas)?[...new Set(n.ordemColunas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,i=Array.isArray(n.colunasRecolhidas)?[...new Set(n.colunasRecolhidas.filter(l=>typeof l=="string"&&l.length>0))].slice(0,200):void 0,c=typeof n.larguraColuna=="number"&&Number.isFinite(n.larguraColuna)?Math.max(200,Math.min(500,Math.round(n.larguraColuna))):void 0;return{id:typeof r.id=="string"?r.id:"",colv:Fr,nome:typeof r.nome=="string"&&r.nome.trim()?r.nome.trim().slice(0,lc):e.nome,busca:typeof r.busca=="string"?r.busca.slice(0,500):"",ordem:t,agrupar:pc.includes(r.agrupar)?r.agrupar:"nenhum",modo:r.modo==="quadro"?"quadro":"tabela",colunas:a.length?a:e.colunas,densidade:r.densidade==="compacta"?"compacta":"confortavel",quadro:{colunas:fc.includes(n.colunas)?n.colunas:"marcador",limite:typeof n.limite=="number"&&n.limite>0?Math.min(99,Math.floor(n.limite)):0,raiasPorResponsavel:n.raiasPorResponsavel===!0,...s?.length?{ordemColunas:s}:{},...i?.length?{colunasRecolhidas:i}:{},...c!==void 0?{larguraColuna:c}:{}}}}function xn(o,e,r){let t=Fe(e),a=t.id?o.findIndex(s=>s.id===t.id):-1;if(a>=0){let s=[...o];return s[a]=t,{lista:s,visao:t}}if(o.length>=cc)return null;let n={...t,id:r()};return{lista:[...o,n],visao:n}}var An=(o,e)=>o.filter(r=>r.id!==e);function yn(o,e){let r=t=>JSON.stringify({...t,id:"",nome:""});return r(o)!==r(e)}var Ge="spro_grade_v_ids",Ue=o=>`spro_grade_v:${o}`,gc=o=>`spro_grade:${o||"x"}`,hc=(o,e)=>`spro_grade_and:${o||"x"}:${e||"x"}`,En=5e3;function bc(){return{visao:Xo(),idade:Hr(),recolhidos:[]}}function vc(o){if(!o||typeof o!="object")return bc();let e=o;return{visao:Fe(e.visao),idade:gn(e.idade),recolhidos:Array.isArray(e.recolhidos)?e.recolhidos.filter(r=>typeof r=="string").slice(0,200):[]}}var xc=/^\d{4}-\d{2}-\d{2}$/;function Ac(o){if(!o||typeof o!="object")return null;let e=o;if(typeof e.consultadoEm!="number"||!Number.isFinite(e.consultadoEm))return null;let r={consultadoEm:e.consultadoEm};for(let t of["autuacao","recebimento","envio"])typeof e[t]=="string"&&xc.test(e[t])&&(r[t]=e[t]);return typeof e.unidadeEnvio=="string"&&e.unidadeEnvio&&(r.unidadeEnvio=e.unidadeEnvio.slice(0,120)),r}function Sn(o,e,r=""){let{local:t,sync:a}=o,n=gc(e),s=hc(e,r);async function i(){return vc((await t.obter(n))[n])}async function c(y){let v=await i();await t.gravar({[n]:{...v,...y}})}async function l(){let y=(await a.obter(Ge))[Ge],v=Array.isArray(y)?y.filter(E=>typeof E=="string"):[];if(!v.length)return[];let M=await a.obter(v.map(Ue));return v.flatMap(E=>{let x=M[Ue(E)];return x?[{...Fe(x),id:E}]:[]})}async function p(y,v=[]){let M=new Set(y.map(P=>P.id)),E={[Ge]:y.map(P=>P.id)};for(let P of y)E[Ue(P.id)]=P;await a.gravar(E);let x=v.filter(P=>!M.has(P.id)).map(P=>Ue(P.id));x.length&&await a.remover(x)}async function f(y){let v=(await t.obter(s))[s],M=v&&typeof v=="object"?v.itens:void 0,E={};if(!M||typeof M!="object")return E;for(let[x,P]of Object.entries(M)){let A=Ac(P);A&&ie(A,y)&&(E[x]=A)}return E}async function m(y){let v=Object.keys(y),M=v.length>En?Object.fromEntries(v.sort((E,x)=>y[x].consultadoEm-y[E].consultadoEm).slice(0,En).map(E=>[E,y[E]])):y;await t.gravar({[s]:{itens:M}})}return{lerAndamentos:f,gravarAndamentos:m,lerEstado:i,gravarVisao:y=>c({visao:y}),gravarIdade:y=>c({idade:y}),gravarRecolhidos:y=>c({recolhidos:y}),lerVisoes:l,gravarVisoes:p,aoMudarVisoes:y=>a.aoMudar(v=>Ge in v||Object.keys(v).some(M=>M.startsWith("spro_grade_v:"))?y():void 0)}}var wn=new Set;var yc=null;function Ec(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Pn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Mn(o,e,r){let t=o.ownerDocument,a=t.defaultView;Ec(o).append(e);let n=!0,s=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let y=a?.innerHeight??0,v=a?.innerWidth??0,M=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,v-16)),E=r.alinharDireita?m.right-M:m.left,x=Math.max(8,Math.min(E,v-M-8)),P=r.alturaMaxima??360;e.style.maxHeight="none";let A=Math.min(e.scrollHeight||P,P),w=y-m.bottom-8,I=m.top-8,O=yc?.()??!1,R=!O&&w<Math.min(A,200)&&I>w;e.style.left=`${x}px`,e.style.width=`${M}px`,e.style.maxHeight=`${O?P:Math.max(140,Math.min(P,R?I:w>140?w:P))}px`,e.classList.toggle("spro-flutuante-cima",R),R?(e.style.top="",e.style.bottom=`${y-m.top+4}px`):(e.style.bottom="",e.style.top=`${m.bottom+4}px`),Pn(a,R?0:Math.ceil(m.bottom+4+A+12))},i=m=>{let y=m.composedPath?.()??[],v=m.target,M=E=>y.includes(E)||!!v&&!!E.contains?.(v);M(e)||M(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},l=m=>{m.target instanceof Node&&e.contains(m.target)||c()},p=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",p);let f={ancora:o,fechar:()=>r.aoFechar()};return wn.add(f),s(),{posicionar:s,fechar(){n&&(n=!1,wn.delete(f),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",p),e.remove(),Pn(a,0))}}}function Dn(o,e){let r=X(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=X(n.rotulo),c=`${i} ${X(n.descricao??"")}`;if(!t.every(p=>c.includes(p)))return;let l=i.startsWith(r)?0:i.split(" ").some(p=>p.startsWith(t[0]))?1:2;a.push({o:n,nota:l,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function Sc(o,e){let r=o.normalize("NFC"),t=X(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((l,p)=>{let f=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let m of f)n+=m,s.push(p)});let i=new Array(a.length).fill(!1);for(let l of t){let p=n.indexOf(l);if(!(p<0))for(let f=p;f<p+l.length;f++)i[s[f]]=!0}let c=[];return a.forEach((l,p)=>{let f=c[c.length-1];f&&f.marcado===i[p]?f.texto+=l:c.push({texto:l,marcado:i[p]})}),c}var wc=0;function ko(o){let e=`spro-combo-${++wc}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=S=>r().find(L=>L.valor===S)??t.get(S),n=[...o.valor??[]],s=null,i="",c=0,l=[],p=null,f=o.vazio??"Escolher\u2026",m=d("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),y=()=>o.aoMudar?.([...n]);function v(){let S=[];o.icone&&S.push(q(o.icone,15));let L=n.map(G=>a(G)).filter(G=>!!G),$=d("span",{class:"spro-combo-texto"});if(!L.length)$.classList.add("spro-combo-vazio"),$.append(f);else{let G=L[0];G.cor&&$.append(d("span",{class:"spro-combo-cor",style:`background:${G.cor}`})),$.append(d("span",{class:"spro-combo-rotulo"},G.rotulo)),L.length>1&&$.append(d("span",{class:"spro-combo-mais"},`+${L.length-1}`))}S.push($,q("chevron",14)),m.classList.toggle("spro-combo-ativo",o.multiplo===!0&&L.length>0),m.replaceChildren(...S)}let M=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function E(S){if(o.multiplo){n=n.includes(S.valor)?n.filter($=>$!==S.valor):[...n,S.valor],y(),v(),w();return}let L=n.length!==1||n[0]!==S.valor;n=[S.valor],v(),T(!0),L&&y()}async function x(){if(!o.criar)return;let S=i.trim();if(!S)return;let L=await o.criar(S);if(L){if(t.set(L.valor,L),i="",s){let $=s.querySelector(".spro-combo-busca");$&&($.value="")}o.multiplo&&n.includes(L.valor)?w():E(L)}}function P(S,L){let $=n.includes(S.valor),G=d("span",{class:"spro-combo-op-rotulo"});for(let z of Sc(S.rotulo,i))G.append(z.marcado?d("mark",{},z.texto):z.texto);let j=d("li",{role:"option",id:`${e}-op-${L}`,class:`spro-combo-op${L===c?" spro-combo-op-ativa":""}`,"data-valor":S.valor,"aria-selected":$?"true":"false"},o.multiplo?d("span",{class:"spro-combo-caixa","aria-hidden":"true"},$?q("check",12):null):null,S.cor?d("span",{class:"spro-combo-cor",style:`background:${S.cor}`}):null,S.icone?q(S.icone,15):null,d("span",{class:"spro-combo-op-textos"},G,S.descricao?d("span",{class:"spro-combo-op-desc"},S.descricao):null),S.contagem!==void 0?d("span",{class:"spro-combo-conta"},String(S.contagem)):null,!o.multiplo&&$?d("span",{class:"spro-combo-marca"},q("check",14)):null);return j.addEventListener("pointerdown",z=>z.preventDefault()),j.addEventListener("click",()=>{c=L,E(S)}),j.addEventListener("pointermove",()=>{c!==L&&(c=L,A())}),j}function A(){if(!s)return;let S=[...s.querySelectorAll('[role="option"]')];S.forEach((j,z)=>{j.classList.toggle("spro-combo-op-ativa",z===c)});let L=S[c],G=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');L?(G?.setAttribute("aria-activedescendant",L.id),L.scrollIntoView?.({block:"nearest"})):G?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;l=Dn(r(),i),c>=l.length&&(c=Math.max(0,l.length-1)),s.querySelector('[role="listbox"]').replaceChildren(...l.map(P));let L=s.querySelector(".spro-combo-extras");L.replaceChildren();let $=i.trim();l.length||L.append(d("p",{class:"spro-combo-nada"},$?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let G=r().some(z=>X(z.rotulo)===X($));if(o.criar&&$&&!G){let z=d("button",{type:"button",class:"spro-combo-criar"},q("mais",14),d("span",{},o.rotuloCriar?o.rotuloCriar($):`Criar \u201C${$}\u201D`));z.addEventListener("pointerdown",K=>K.preventDefault()),z.addEventListener("click",()=>void x()),L.append(z)}let j=s.querySelector(".spro-combo-rodape");if(j){let z=l.filter(go=>!n.includes(go.valor)),K=d("button",{type:"button",class:"spro-combo-acao",disabled:!$||!z.length},`Marcar os filtrados${$&&z.length?` (${z.length})`:""}`);K.addEventListener("click",()=>{n=[...n,...z.map(go=>go.valor)],y(),v(),w()});let Ho=d("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");Ho.addEventListener("click",()=>{n=[],y(),v(),w()}),j.replaceChildren(d("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),K,Ho)}A()}let I=()=>p?.posicionar();function O(S){let L=l.length,$=S.target,G=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled)")]:[],j=!!$?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(S.key==="Tab"){let K=G.indexOf($);if(!S.shiftKey&&K<G.length-1)G[K+1]?.focus();else if(S.shiftKey&&K>=0)K>0?G[K-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{T(!0);return}S.preventDefault(),S.stopPropagation();return}if(j&&S.key!=="Escape")return;let z=!s?.querySelector(".spro-combo-busca");if(z&&S.key===" "){let K=l[c];K&&E(K),S.preventDefault(),S.stopPropagation();return}if(z&&S.key.length===1&&!S.ctrlKey&&!S.metaKey&&!S.altKey){let K=X(S.key),go=[...l.keys()].map(Do=>(c+1+Do)%Math.max(1,L)).find(Do=>X(l[Do]?.rotulo??"").startsWith(K));go!==void 0&&(c=go,A()),S.preventDefault(),S.stopPropagation();return}switch(S.key){case"ArrowDown":c=L?(c+1)%L:0,A();break;case"ArrowUp":c=L?(c-1+L)%L:0,A();break;case"Home":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,A();break;case"End":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,L-1),A();break;case"Enter":{let K=l[c];K?E(K):x();break}case"Escape":T(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),y(),v(),w();break;default:return}S.preventDefault(),S.stopPropagation()}function R(S=""){if(s)return;i=S,c=S?0:(()=>{let j=Dn(r(),i).findIndex(z=>z.valor===n[n.length-1]);return j<0?0:j})();let $=M()?d("input",{type:"text",class:"spro-combo-busca",placeholder:o.criar?"Buscar ou criar\u2026":"Buscar\u2026","aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:S}):null;if($&&($.value=S,$.addEventListener("input",()=>{i=$.value,c=0,w(),I()})),s=d("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},$?d("div",{class:"spro-combo-cabeca"},q("busca",15),$):null,d("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:$?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),d("div",{class:"spro-combo-extras"}),o.multiplo?d("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",O),p=Mn(m,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>T(!1)}),m.setAttribute("aria-expanded","true"),m.setAttribute("aria-controls",`${e}-lista`),m.classList.add("spro-combo-aberto"),w(),I(),!s)return;($??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),$&&S&&$.setSelectionRange?.(S.length,S.length)}function T(S=!1){s&&(p?.fechar(),p=null,s=null,i="",m.setAttribute("aria-expanded","false"),m.removeAttribute("aria-controls"),m.classList.remove("spro-combo-aberto"),S&&m.focus?.({preventScroll:!0}))}return m.addEventListener("click",()=>s?T(!0):R()),m.addEventListener("keydown",S=>{s||(S.key==="ArrowDown"||S.key==="ArrowUp"?(S.preventDefault(),R()):S.key.length===1&&S.key!==" "&&!S.ctrlKey&&!S.metaKey&&!S.altKey&&M()&&(S.preventDefault(),R(S.key)))}),v(),{el:m,valor:()=>[...n],definir(S,L=!1){n=[...S],v(),w(),L&&y()},atualizar(){v(),w()},definirVazio(S){f=S,v()},abrir:R,fechar:()=>T(!1)}}var Cn="#tblProcessosRecebidos input[type=checkbox], #tblProcessosGerados input[type=checkbox], #tblProcessosDetalhado input[type=checkbox]",Gr=o=>o.getAttribute("value")??o.closest("tr")?.id.replace(/^P/,"")??"";function Ur(o){let e=new Set;for(let r of o.querySelectorAll(Cn))r.checked&&Gr(r)&&e.add(Gr(r));return e}function kn(o,e){let r=new Set(e);for(let t of o.querySelectorAll(Cn)){let a=Gr(t);a&&(r.delete(a),!t.disabled&&!!t.checked!==e.has(a)&&t.click())}return[...r]}function Pc(o){let e=o.composedPath?.()??[];if(e.length)return e.some(r=>r.id==="spro-grade");for(let r=o.target;r;r=r.parentNode)if(r.id==="spro-grade")return!0;return!1}function Ln(o,e){let r=!1,t=a=>{a&&Pc(a)||r||(r=!0,queueMicrotask(()=>{r=!1,e(Ur(o))}))};return o.addEventListener("click",t,!0),o.addEventListener("change",t,!0),()=>{o.removeEventListener("click",t,!0),o.removeEventListener("change",t,!0)}}function Mc(o){return/acaoControleProcessos\(\s*['"][^'"]*['"]\s*,\s*true/.test(o.elemento.getAttribute("onclick")??"")}function On(o,e){return Mc(o)&&e===0?{ok:!1,motivo:"Marque ao menos um processo."}:(o.elemento.click(),{ok:!0})}var Dc=o=>o instanceof Error?o.message:String(o);function In(o){if(o.tipo==="atribuicao")return{...o,para:o.de,de:o.para};let e={tipo:"marcador",id:o.id,protocolo:o.protocolo};return o.adicionar&&(e.remover=o.adicionar),o.remover&&(e.adicionar=o.remover,o.texto&&(e.texto=o.texto)),e}async function Cc(o,e){try{if(o.tipo==="atribuicao")return await e.atribuir(o.protocolo,o.para),{ok:!0,desfazer:In(o)};if(o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,...o.texto?{texto:o.texto}:{}}),o.remover)try{await e.marcador(o.protocolo,{marcador:o.remover,remover:!0})}catch(r){throw o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,remover:!0}).catch(()=>{}),r}return{ok:!0,desfazer:In(o)}}catch(r){return{ok:!1,erro:Dc(r)}}}function $n(o){let e=Promise.resolve();return{mover(r){let t=e.then(()=>Cc(r,o));return e=t.catch(()=>{}),t}}}var Be=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,Rn=Number.MAX_SAFE_INTEGER;function Br(o,e){let r=[e];return o.hora&&o.vencimento&&(r[0]=e.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&r.push(o.texto),o.sigla&&r.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),r.join(`
`)}function Nn(o,e){let r=o.vencimento;if(o.concluidoEm&&r)return{situacao:"concluido",texto:`conclu\xEDdo em ${uo(o.concluidoEm).slice(0,5)}`,dica:Br(o,`Prazo de ${uo(r)} conclu\xEDdo em ${uo(o.concluidoEm)}.`),ordem:Rn,sorter:`${r} 23:59:59`};if(r){let s=$o(e,r),i=`${r} ${o.hora??"23:59"}:00`,c=Br(o,`Vence em ${uo(r)}.`);return s===0?{situacao:"hoje",texto:"vence hoje",dica:c,ordem:0,sorter:i}:s<0?{situacao:"atrasado",texto:`${Be(-s)} de atraso`,dica:c,ordem:s,sorter:i}:{situacao:"noPrazo",texto:`vence em ${Be(s)}`,dica:c,ordem:s,sorter:i}}let t=o.inicio??e,a=$o(t,e);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${Be(a)}`:`em ${Be(-a)}`,dica:Br(o,`Contando desde ${uo(t)}.`),ordem:Rn-1,sorter:`${t} ${o.hora??"23:59"}:00`}}function lo(o,e){return o.prazo?Nn(o.prazo,e.hoje):null}function Mo(o,e){return o.vistoEm===void 0?null:Math.max(0,Math.floor((e.agora-o.vistoEm)/864e5))}function zo(o,e){return o.ultimaMov?Math.max(0,$o(o.ultimaMov,e.hoje)):null}function Tn(o,e){return e.visitaAnterior!==void 0&&o.vistoEm!==void 0&&o.vistoEm>e.visitaAnterior}function ue(o,e){let r=lo(o,e);return!r||r.situacao==="concluido"||r.situacao==="desde"?null:r.ordem}var kc={resp:"resp",responsavel:"resp",atribuido:"resp",atribuicao:"resp",tipo:"tipo",marcador:"marcador",marcadores:"marcador",marc:"marcador",espec:"espec",especificacao:"espec",anot:"anot",anotacao:"anot",nota:"anot",prazo:"prazo",caixa:"caixa",idade:"caixa",novo:"novo",sigilo:"sigilo",sigiloso:"sigilo",grupo:"grupo",retorno:"retorno",protocolo:"protocolo",proc:"protocolo",processo:"protocolo",parado:"parado",mov:"parado",prio:"prio",prioridade:"prio",interessado:"interessado",interessados:"interessado"};function Kr(o){let e=[],r="",t=!1;for(let a of o)a==='"'?(t=!t,r+=a):/\s/.test(a)&&!t?(r&&e.push(r),r=""):r+=a;return r&&e.push(r),e}var Lc=o=>o.replace(/^"|"$/g,"");function Jr(o){let e=[],r=[];for(let t of Kr(o)){let a=t,n=!1;a.startsWith("-")&&a.length>1&&(n=!0,a=a.slice(1));let s,i=/^([a-zA-Z\u00C0-\u017F]+):(.*)$/.exec(a);if(i){let f=kc[X(i[1])];f&&(s=f,a=i[2])}let c="=";s&&/^[<>]/.test(a)&&(c=a[0],a=a.slice(1));let l=X(Lc(a));if(!l&&!s)continue;let p={...s?{campo:s}:{},valor:l,original:t,negado:n,comparador:c};e.push(p),r.push({texto:t,termo:p})}return{termos:e,tokens:r}}var Oc=o=>X([o.protocolo,o.protocolo.replace(/\D/g,""),o.tipo,o.especificacao,o.atribuicao?.sigla,o.atribuicao?.nome,...o.marcadores.flatMap(e=>[e.nome,e.texto]),o.anotacao?.texto,o.prazo?.texto,o.prioridade,o.interessados,o.observacao].filter(Boolean).join(" ")),xo=(o,e)=>X(o??"").includes(e),zn=/^(s|sim|1|true|yes)$/;function Qr(o){let e=/^(\d+)\s*(d|dia|dias)?$/.exec(o);return e?Number(e[1]):null}function Xr(o,e,r){return o===null?!1:e==="<"?o<r:e===">"?o>r:o===r}function Ic(o,e,r){let t=lo(o,r),a=e.valor;if(a==="sem"||a==="nenhum"||a==="nao")return!o.prazo;if(a==="com"||a==="sim")return!!o.prazo;if(!t)return!1;if(a==="atrasado"||a==="atrasados"||a==="vencido")return t.situacao==="atrasado";if(a==="hoje")return t.situacao==="hoje";if(a==="concluido"||a==="concluidos")return t.situacao==="concluido";if(a==="semana"){let s=ue(o,r);return s!==null&&s>=0&&s<=7}let n=Qr(a);return n!==null?Xr(ue(o,r),e.comparador==="="?"<":e.comparador,n):xo(o.prazo?.texto,a)}function $c(o,e,r){let t=e.valor;switch(e.campo){case"resp":return t==="sem"||t==="ninguem"?!o.atribuicao:t==="eu"?!!r.eu&&X(o.atribuicao?.sigla??"")===X(r.eu):xo(o.atribuicao?.sigla,t)||xo(o.atribuicao?.nome,t);case"tipo":return xo(o.tipo,t);case"marcador":return t==="sem"||t==="nenhum"?o.marcadores.length===0:t==="com"?o.marcadores.length>0:o.marcadores.some(a=>xo(a.nome,t)||xo(a.texto,t));case"espec":return xo(o.especificacao,t);case"anot":return t==="sem"||t==="nao"?!o.anotacao:t==="com"||t==="sim"?!!o.anotacao:t==="prioridade"||t==="prioritaria"?!!o.anotacao?.prioridade:xo(o.anotacao?.texto,t);case"prazo":return Ic(o,e,r);case"caixa":{let a=Qr(t);return a===null?!1:Xr(Mo(o,r),e.comparador==="="?">":e.comparador,a)}case"novo":return t==="visita"?Tn(o,r):zn.test(t)?o.naoVisualizado:t==="nao"?!o.naoVisualizado:!1;case"sigilo":return zn.test(t)?o.sigiloso:!o.sigiloso;case"grupo":return t.startsWith("rec")?o.grupo==="recebidos":t.startsWith("ger")?o.grupo==="gerados":!1;case"retorno":return t==="sem"||t==="nao"?o.retornos.length===0:t==="atrasado"?o.retornos.some(a=>a.atrasado):t==="aguardando"?o.retornos.some(a=>a.tipo==="aguardando"):t==="programado"?o.retornos.some(a=>a.tipo==="programado"):o.retornos.length>0;case"parado":{let a=Qr(t);return a===null?!1:Xr(zo(o,r),e.comparador==="="?">":e.comparador,a)}case"prio":return xo(o.prioridade,t);case"interessado":return xo(o.interessados,t);case"protocolo":return X(o.protocolo).includes(t)||o.protocolo.replace(/\D/g,"").includes(t.replace(/\D/g,"")||"\0");default:return!0}}function Rc(o,e,r){if(!o.termos.length)return!0;let t;for(let a of o.termos){let n;if(a.campo?n=$c(e,a,r):(t??=Oc(e),n=t.includes(a.valor)),a.negado?n:!n)return!1}return!0}var _n=(o,e,r)=>{let t=Jr(e);return t.termos.length?o.filter(a=>Rc(t,a,r)):o};function Qe(o,e){return Kr(o).filter(r=>r!==e).join(" ")}function qn(o,e,r){let t=/\s/.test(r)?`"${r}"`:r,a=`${e}:${t}`,n=Kr(o);return n.includes(a)?o:[...n,a].join(" ")}var Nc=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Tc(o,e=[]){return[...o.values()].sort((r,t)=>{let a=e.indexOf(r.chave),n=e.indexOf(t.chave);return a>=0||n>=0?(a<0?-1:a)-(n<0?-1:n):Nc.compare(r.rotulo,t.rotulo)})}function J(o,e,r,t){let a=o.get(e);return a||(a={chave:e,rotulo:r,itens:[],...t?{tom:t}:{}},o.set(e,a)),a}var Ko=[["atrasado","Atrasados","perigo"],["hoje","Vencem hoje","aviso"],["semana","Pr\xF3ximos 7 dias","aviso"],["mes","Pr\xF3ximos 30 dias","neutro"],["depois","Depois de 30 dias","neutro"],["desde","Contando desde uma data","neutro"],["concluido","Prazo conclu\xEDdo","neutro"],["sem","Sem prazo","neutro"]];function pe(o,e){let r=lo(o,e);if(!r)return"sem";if(r.situacao==="concluido")return"concluido";if(r.situacao==="desde")return"desde";if(r.situacao==="atrasado")return"atrasado";if(r.situacao==="hoje")return"hoje";let t=ue(o,e)??0;return t<=7?"semana":t<=30?"mes":"depois"}var Vn=[["recente","Chegaram hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["antigo","H\xE1 mais de 30 dias"],["desconhecido","Sem registro"]];function zc(o,e){let r=Mo(o,e);return r===null?"desconhecido":r<1?"recente":r<=7?"semana":r<=30?"mes":"antigo"}function Lo(o,e){return e.map(r=>o.get(r[0])).filter(r=>!!r)}function me(o){if(!o.marcadores.length)return;if(o.marcadores.length===1)return o.marcadores[0];let e=o.marcadores[o.marcadores.length-1],r=e.dataHora!==void 0;for(let t=0;t<o.marcadores.length;t++){let a=o.marcadores[t];a.dataHora!==void 0&&(!r||a.dataHora>e.dataHora)&&(e=a,r=!0)}return e}function Xe(o,e,r){if(e==="nenhum")return[{chave:"todos",rotulo:"Todos",itens:o}];let t=new Map;for(let a of o)switch(e){case"responsavel":a.atribuicao?J(t,`u:${a.atribuicao.sigla}`,a.atribuicao.nome===a.atribuicao.sigla?a.atribuicao.sigla:`${a.atribuicao.nome} (${a.atribuicao.sigla})`).itens.push(a):J(t,"sem","Sem respons\xE1vel").itens.push(a);break;case"tipo":J(t,`t:${a.tipo||"-"}`,a.tipo||"Sem tipo").itens.push(a);break;case"marcador":{let n=me(a);n?J(t,`m:${n.nome}`,n.nome).itens.push(a):J(t,"sem","Sem marcador").itens.push(a);break}case"prazo":{let n=pe(a,r),s=Ko.find(i=>i[0]===n);J(t,n,s[1],s[2]).itens.push(a);break}case"situacao":a.naoVisualizado?J(t,"novo","N\xE3o visualizados","aviso").itens.push(a):J(t,"lido","Visualizados").itens.push(a);break;case"grupo":J(t,a.grupo,a.grupo==="recebidos"?"Recebidos":"Gerados").itens.push(a);break;case"anotacao":a.anotacao?.prioridade?J(t,"prio","Anota\xE7\xE3o com prioridade","aviso").itens.push(a):a.anotacao?J(t,"com","Com anota\xE7\xE3o").itens.push(a):J(t,"sem","Sem anota\xE7\xE3o").itens.push(a);break;case"acompanhamento":a.acompanhamentoEspecial?J(t,"com","Em acompanhamento especial").itens.push(a):J(t,"sem","Fora do acompanhamento especial").itens.push(a);break;case"retorno":a.retornos.some(n=>n.atrasado)?J(t,"atrasado","Retorno atrasado","perigo").itens.push(a):a.retornos.some(n=>n.tipo==="aguardando")?J(t,"aguardando","Aguardando retorno").itens.push(a):a.retornos.length?J(t,"programado","Retorno programado").itens.push(a):J(t,"sem","Sem retorno").itens.push(a);break;case"caixa":{let n=zc(a,r);J(t,n,Vn.find(s=>s[0]===n)[1]).itens.push(a);break}case"autuacao":case"recebimento":case"envio":{let n=Oa(r.andamentos?.[a.id]?.[e],r.hoje);J(t,n,Cr.find(s=>s[0]===n)[1]).itens.push(a);break}case"unidadeEnvio":{let n=r.andamentos?.[a.id]?.unidadeEnvio;n?J(t,`u:${n}`,n).itens.push(a):J(t,"sem","Sem informa\xE7\xE3o").itens.push(a);break}}return e==="prazo"?Lo(t,Ko):e==="caixa"?Lo(t,Vn):e==="autuacao"||e==="recebimento"||e==="envio"?Lo(t,Cr):e==="situacao"?Lo(t,[["novo",""],["lido",""]]):e==="grupo"?Lo(t,[["recebidos",""],["gerados",""]]):e==="anotacao"?Lo(t,[["prio",""],["com",""],["sem",""]]):e==="acompanhamento"?Lo(t,[["com",""],["sem",""]]):e==="retorno"?Lo(t,[["atrasado",""],["aguardando",""],["programado",""],["sem",""]]):Tc(t,["sem"])}var Wr={nenhum:"Sem agrupamento",responsavel:"Respons\xE1vel",tipo:"Tipo de processo",marcador:"Marcador",prazo:"Prazo",situacao:"Visualiza\xE7\xE3o",grupo:"Recebidos e gerados",anotacao:"Anota\xE7\xE3o",acompanhamento:"Acompanhamento especial",retorno:"Retorno programado",caixa:"Tempo na caixa",autuacao:"Data de autua\xE7\xE3o",recebimento:"Data de recebimento",envio:"Data de envio",unidadeEnvio:"Unidade de envio"};var _c=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Ke(o,e){let r=new Map;for(let t of o)for(let a of e(t)){let n=r.get(a.valor)??{valor:a.valor,rotulo:a.rotulo,n:0};n.n+=1,r.set(a.valor,n)}return[...r.values()].sort((t,a)=>a.n-t.n||_c.compare(t.rotulo,a.rotulo))}function Zr(o,e){let r=Ke(o,t=>{let a=pe(t,e),n=Ko.find(i=>i[0]===a)[1],s=a==="atrasado"?"atrasado":a==="hoje"?"hoje":a==="semana"?"semana":a==="sem"?"sem":a==="concluido"?"concluido":"";return s?[{valor:s,rotulo:n}]:[]});return{responsaveis:Ke(o,t=>t.atribuicao?[{valor:t.atribuicao.sigla,rotulo:`${t.atribuicao.nome} (${t.atribuicao.sigla})`}]:[{valor:"sem",rotulo:"Sem respons\xE1vel"}]),tipos:Ke(o,t=>t.tipo?[{valor:t.tipo,rotulo:t.tipo}]:[]),marcadores:Ke(o,t=>t.marcadores.length?t.marcadores.map(a=>({valor:a.nome,rotulo:a.nome})):[{valor:"sem",rotulo:"Sem marcador"}]),prazos:r}}function Hn(o){let e=[];o.sigiloso&&e.push("Sigiloso"),o.naoVisualizado&&e.push("N\xE3o visualizado"),o.documentoNovo&&e.push("Documento novo"),o.urgente&&e.push("Urgente"),o.trancado&&e.push("Trancado"),o.acompanhamentoEspecial&&e.push(o.acompanhamentoGrupo?`Acompanhamento especial (${o.acompanhamentoGrupo})`:"Acompanhamento especial");for(let r of o.retornos)e.push(`${r.tipo==="aguardando"?"Aguardando retorno":"Retorno programado"}${r.atrasado?" (atrasado)":""}`);return e}function jn(o,e){let r=lo(o,e);if(!o.prazo||!r)return"";let t=o.prazo.vencimento??o.prazo.inicio;return`${t?uo(t):""}${o.prazo.hora?` ${o.prazo.hora}`:""} (${r.texto})`.trim()}var qc=["ID","Protocolo","Link_Permanente","Atribuicao","Etiqueta","Etiqueta_Descricao","Anotacao","Anotacao_Responsavel","Ponto_Controle","Especificacao","Tipo","Data_Autuacao","Data_Autuacao_Descricao","Data_Recebimento","Data_Recebimento_Descricao","Data_Envio","Data_Envio_Descricao","Unidade_Envio","Documento_Incluido","Observacoes","Acompanhamento_Especial"];function Fn(o){let e=new Map;if(!o)return e;try{let r=o.getItem("configDataRecebimentoPro");if(!r)return e;let t=JSON.parse(r);if(!Array.isArray(t))return e;for(let a of t)a&&typeof a=="object"&&a.id_procedimento&&e.set(String(a.id_procedimento),a)}catch{}return e}function Jo(o){if(!o)return"-";let e=/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}:\d{2}(?::\d{2})?))?/.exec(o.trim());if(!e)return o.trim()||"-";let r=e[4]?e[4].length===5?`${e[4]}:00`:e[4]:"00:00:00";return`${e[3]}/${e[2]}/${e[1]} ${r}`}var ao=(o,e="-")=>(o??"").replace(/;/g,"").trim()||e;function Vc(o,e){if(o?.observacoes&&Array.isArray(o.observacoes)){let r=o.observacoes.filter(t=>t&&t.unidade).map(t=>`${t.unidade}: ${t.observacao??""}`);if(r.length)return ao(r.join(","))}return typeof o?.observacoes=="string"&&o.observacoes.trim()?ao(o.observacoes):ao(e)}function Gn(o,e,r={}){let t=r.urlBase??"",a=r.recebimentos;return[[...qc],...o.map(n=>{let s=me(n),i=a?.get(n.id),c=e.andamentos?.[n.id],l=t?`${t}?acao=procedimento_trabalhar&id_procedimento=${n.id}`:n.link??"-",p=i?.datageracao?Jo(i.datageracao):c?.autuacao?Jo(c.autuacao):"-",f=i?.datahora?Jo(i.datahora):c?.recebimento?Jo(c.recebimento):"-",m=i?.datesend?Jo(i.datesend):c?.envio?Jo(c.envio):"-",y=ao(i?.unidadesend??c?.unidadeEnvio),v=ao(i?.acompanhamentoesp??n.acompanhamentoGrupo);return[n.id,n.protocolo,l,ao(n.atribuicao?.sigla),ao(s?.nome),ao(s?.texto),ao(n.anotacao?.texto),ao(n.anotacao?.autor),ao(n.pontoControle),ao(n.especificacao),ao(n.tipo),p,ao(i?.descricaodatageracao),f,ao(i?.descricao),m,ao(i?.descricaosend),y,n.documentoNovo?"Um novo documento foi incluido ou assinado":"",Vc(i,n.observacao),v]})]}function Un(o){let e=r=>{let t=r.replace(/;/g,""),a=t!=="-"&&/^[=+@\t\r]/.test(t)?`'${t}`:t;return/["\n\r]/.test(a)?`"${a.replace(/"/g,'""')}"`:a};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}function Bn(o){let e=new Date(o),r=t=>String(t).padStart(2,"0");return`ListaProcessos_SEIPro_${e.getFullYear()}${r(e.getMonth()+1)}${r(e.getDate())}_${r(e.getHours())}_${r(e.getMinutes())}_${r(e.getSeconds())}.csv`}function Qn(o,e,r){let t=[];for(let a of o){let n=r&&e.has(a.chave);if(r&&t.push({tipo:"grupo",grupo:a,recolhido:n}),!n)for(let s of a.itens)t.push({tipo:"processo",processo:s,grupo:a.chave})}return t}var Yr=new Intl.Collator("pt-BR",{numeric:!0,sensitivity:"base"});function Xn(o){let e=/(\d+)\/(\d{4})-\d+\s*$/.exec(o);if(!e)return null;let r=/(\d+)\s*$/.exec(e[1].split(/[.-]/).pop()??"")?.[1]??e[1];return[Number(e[2]),Number(r)]}function Hc(o,e){let r=Xn(o),t=Xn(e);return r&&t&&(r[0]-t[0]||r[1]-t[1])||Yr.compare(o,e)}function Kn(o,e,r){switch(e){case"tipo":return o.tipo||null;case"responsavel":return o.atribuicao?.sigla??null;case"marcador":return o.marcadores[0]?.nome??null;case"prazo":{let t=lo(o,r);return t?t.ordem:null}case"caixa":return Mo(o,r);case"parado":return zo(o,r);case"novo":return o.naoVisualizado?0:1}}function jc(o,e){return(r,t)=>{for(let a of o){let n;if(a.campo==="protocolo")n=Hc(r.protocolo,t.protocolo),a.decrescente&&(n=-n);else{let s=Kn(r,a.campo,e),i=Kn(t,a.campo,e);if(s===null&&i===null)continue;if(s===null)return 1;if(i===null)return-1;n=typeof s=="number"&&typeof i=="number"?s-i:Yr.compare(String(s),String(i)),a.decrescente&&(n=-n)}if(n)return n}return 0}}function Jn(o,e,r){return e.length?[...o].sort(jc(e,r)):o}function Wn(o,e,r){let t=o.findIndex(s=>s.campo===e),a=t<0?{campo:e,decrescente:!1}:o[t].decrescente?null:{campo:e,decrescente:!0};if(!r)return a?[a]:[];if(t<0)return[...o,a];let n=[...o];return a?n[t]=a:n.splice(t,1),n}function Zn(o,e){let r=s=>s.trim().toLowerCase(),t=new Map;for(let s of e)s.nome.trim()&&!t.has(r(s.nome))&&t.set(r(s.nome),{nome:s.nome.trim(),texto:s.texto.trim().slice(0,250)});let a=new Map(o.map(s=>[r(s.nome),s])),n=[];for(let s of o)t.has(r(s.nome))||n.push({tipo:"remover",nome:s.nome});for(let[s,i]of t)a.has(s)||n.push({tipo:"adicionar",nome:i.nome,texto:i.texto});for(let[s,i]of t){let c=a.get(s);c&&c.texto.trim()!==i.texto&&n.push({tipo:"texto",nome:c.nome,texto:i.texto})}return n}function Yn(o,e,r=()=>""){let t=[...o.marcadores];for(let a of e)a.tipo==="remover"?t=t.filter(n=>n.nome!==a.nome):a.tipo==="adicionar"?t.push({nome:a.nome,cor:r(a.nome),texto:a.texto}):t=t.map(n=>n.nome===a.nome?{...n,texto:a.texto}:n);return{...o,marcadores:t}}function Je(o){return o.replace(/\r\n?/g,`
`).trim().slice(0,500)}function We(o,e,r,t=""){let a=Je(e);if(!a){let{anotacao:n,...s}=o;return s}return{...o,anotacao:{texto:a,autor:o.anotacao?.autor??t,prioridade:r}}}function os(o,e){if(!e){let{atribuicao:r,...t}=o;return t}return{...o,atribuicao:e}}function Ze(o,e,r,t,a){let n=new Set([o.id]);if(t)for(let s of e)n.add(s);return r.filter(s=>n.has(s.id)&&a(s))}function ot(o,e){let r=new Set(e.marcadores.map(t=>t.nome.trim().toLowerCase()));return o.filter(t=>{let a=r.has(t.nome.trim().toLowerCase());return t.tipo==="adicionar"?!a:a})}var et=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0}),fo="sem";function es(o,e,r,t={}){let a=new Map,n=(i,c,l,p,f)=>{let m=a.get(i);return m||(m={chave:i,titulo:c,itens:[],aceitaSoltar:l,excedeu:!1,...p?{motivoSomenteLeitura:p}:{},...f?{tom:f}:{}},a.set(i,m)),m};if(e.colunas==="marcador")for(let i of o){let c=me(i);c?n(`m:${c.nome}`,c.nome,!0).itens.push(i):n(fo,"Sem marcador",!0).itens.push(i)}else if(e.colunas==="responsavel"){n(fo,"Sem respons\xE1vel",!0);for(let i of t.responsaveis??[])n(`u:${i.sigla}`,`${i.nome} (${i.sigla})`,!0);for(let i of o)i.atribuicao?n(`u:${i.atribuicao.sigla}`,`${i.atribuicao.nome} (${i.atribuicao.sigla})`,!0).itens.push(i):n(fo,"Sem respons\xE1vel",!0).itens.push(i)}else if(e.colunas==="prazo"){for(let[i,c,l]of Ko)i!=="desde"&&n(i,c,!1,"O prazo \xE9 definido pelo bot\xE3o de prazo, n\xE3o arrastando.",l);for(let i of o){let c=pe(i,r);n(c==="desde"?"sem":c,"",!1).itens.push(i)}}else for(let i of o)n(`t:${i.tipo}`,i.tipo||"Sem tipo",!1,"O tipo do processo n\xE3o muda arrastando.").itens.push(i);let s=[...a.values()];if(e.colunas==="prazo"&&(s=s.filter(i=>i.itens.length||i.titulo)),e.colunas==="marcador"?(s=s.filter(i=>i.itens.length>0),s.sort((i,c)=>{let l=c.itens.length-i.itens.length;return l!==0?l:i.chave===fo?1:c.chave===fo?-1:et.compare(i.titulo,c.titulo)})):e.colunas==="responsavel"?s.sort((i,c)=>i.chave===fo?-1:c.chave===fo?1:et.compare(i.titulo,c.titulo)):e.colunas==="tipo"&&s.sort((i,c)=>et.compare(i.titulo,c.titulo)),e.ordemColunas?.length){let i=new Map(e.ordemColunas.map((c,l)=>[c,l]));s.sort((c,l)=>{let p=i.get(c.chave),f=i.get(l.chave);return p!==void 0&&f!==void 0?p-f:p!==void 0?-1:f!==void 0?1:0})}if(e.limite>0)for(let i of s)i.excedeu=i.itens.length>e.limite;return s}function rs(o,e,r){if(e===r)return[...o];let t=o.indexOf(e),a=o.indexOf(r);if(t<0||a<0)return[...o];let n=[...o];return n.splice(t,1),n.splice(a,0,e),n}var Ye=o=>o.slice(o.indexOf(":")+1);function ts(o,e,r,t){if(r===t)return{ok:!1,motivo:"Mesma coluna."};if(o==="marcador"){let a=r===fo?void 0:Ye(r),n=t===fo?void 0:Ye(t);if(a&&!e.marcadores.some(l=>l.nome===a))return{ok:!1,motivo:"O processo j\xE1 n\xE3o tem esse marcador."};let s=n?e.marcadores.some(l=>l.nome===n):!1,i=a?e.marcadores.find(l=>l.nome===a)?.texto:void 0,c={tipo:"marcador",id:e.id,protocolo:e.protocolo};return a&&(c.remover=a),n&&!s&&(c.adicionar=n,i&&(c.texto=i)),!c.remover&&!c.adicionar?{ok:!1,motivo:"Nada a mudar."}:{ok:!0,movimento:c}}return o==="responsavel"?{ok:!0,movimento:{tipo:"atribuicao",id:e.id,protocolo:e.protocolo,para:t===fo?null:Ye(t),de:r===fo?null:Ye(r)}}:{ok:!1,motivo:"Esta divis\xE3o do quadro \xE9 s\xF3 de leitura."}}function rt(o,e,r={}){if(e.tipo==="atribuicao"){if(e.para===null){let{atribuicao:a,...n}=o;return n}return{...o,atribuicao:{sigla:e.para,nome:r[e.para]??e.para}}}let t=o.marcadores;return e.remover&&(t=t.filter(a=>a.nome!==e.remover)),e.adicionar&&(t=[...t,{nome:e.adicionar,cor:"",texto:e.texto??"",dataHora:Date.now()}]),{...o,marcadores:t}}function Wo(o,e){let r=o.ownerDocument??document;for(let n of Array.from(o.querySelectorAll("dialog.spro-dialogo-grade")))n.remove();let t=d("dialog",{class:`spro-dialogo spro-dialogo-grade${e.largo?" spro-dialogo-largo":""}`,"aria-label":e.titulo}),a=()=>{t.open?t.close():t.remove()};return t.append(d("header",{},e.icone?d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},q(e.icone,18)):null,d("h2",{},e.titulo,e.subtitulo?d("small",{class:"spro-dialogo-sub"},e.subtitulo):null),d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:a},q("fechar",16))),d("div",{class:"spro-dialogo-corpo"},e.conteudo)),t.addEventListener("close",()=>{t.remove(),e.aoFechar?.()}),o.append(t),typeof t.showModal=="function"?t.showModal():t.setAttribute("open",""),t.querySelector(".spro-combo, textarea, input:not([type=checkbox])")?.focus({preventScroll:!0}),{fechar:a,dlg:t}}var Fc=["autuacao","recebimento","envio","unidadeEnvio"],ge=o=>Fc.includes(o);function Gc(o){let e=Math.floor(o/6e4);return e<1?"agora h\xE1 pouco":e<60?`h\xE1 ${e} min`:`h\xE1 ${Math.floor(e/60)} h`}var fe=(o,e,r)=>`${o} ${o===1?e:r}`;function as(o){let e={},r=null,t=!1,a=!1,n,s=d("div",{class:"spro-andamento",hidden:!0,role:"status","aria-live":"polite"}),i=()=>o.processos().filter(A=>!!A.link&&!A.sigiloso&&!A.naoVisualizado),c=()=>Object.values(e).filter(A=>ie(A,o.agora())),l=()=>i().filter(A=>!e[A.id]||!ie(e[A.id],o.agora())),p=()=>{let A=o.processos();return{naoVistos:A.filter(w=>w.naoVisualizado&&!w.sigiloso).length,sigilosos:A.filter(w=>w.sigiloso).length,semLink:A.filter(w=>!w.link&&!w.sigiloso&&!w.naoVisualizado).length}};async function f(){try{e=await o.armazem.lerAndamentos(o.agora())}catch{e={}}o.aoMudar()}function m(A,w){return new Promise(I=>{let O=!1,R=p(),T=[];R.naoVistos&&T.push(`${fe(R.naoVistos,"processo ainda n\xE3o visualizado","processos ainda n\xE3o visualizados")} nesta unidade (abrir o andamento o marcaria como visualizado ou recebido em seu nome)`),R.sigilosos&&T.push(`${fe(R.sigilosos,"processo sigiloso","processos sigilosos")}`);let S=d("button",{type:"button",class:"spro-botao primario",onclick:()=>{O=!0,I(!0),$.fechar()}},q("busca",15),"Consultar andamento"),L=d("div",{class:"spro-confirma-andamento"},d("p",{},"Para agrupar por data ou por unidade de envio, o SEI Pro precisa ",d("strong",{},"abrir o andamento de cada processo, um por um")," no SEI. A consulta \xE9 s\xF3 de leitura, mas faz v\xE1rias requisi\xE7\xF5es por processo e pode levar alguns minutos."),d("p",{},d("strong",{},`Ser\xE3o consultados ${fe(A,"processo","processos")}.`),w?` Outros ${w} j\xE1 est\xE3o guardados e ficam como est\xE3o.`:""),T.length?d("div",{},d("p",{},"Ficam de fora:"),d("ul",{},...T.map(G=>d("li",{},G)))):null,d("p",{class:"spro-suave"},"O resultado fica guardado neste navegador por 24 horas: ao recarregar a p\xE1gina, ele reaparece sem nova consulta. Voc\xEA pode cancelar a consulta a qualquer momento."),d("div",{class:"spro-dialogo-rodape"},S)),$=Wo(o.sombra,{titulo:"Consultar o andamento dos processos",icone:"alerta",conteudo:L,aoFechar:()=>I(O)})})}function y(){if(o.semDebounce)return o.aoMudar();n||(n=setTimeout(()=>{n=void 0,t||o.aoMudar()},400))}async function v(){try{await o.armazem.gravarAndamentos(e)}catch{}}async function M(A){if(r||!A.length||t)return;let w=new AbortController;r={ctl:w,progresso:{feitos:0,total:A.length,semDados:0}},P();let I=0,O=await Ia({alvos:A,sinal:w.signal,simultaneas:o.simultaneas,pausaMs:o.pausaMs,esperar:o.esperar,consultar:(R,T)=>o.consultar(R,T),aoResolver:(R,T,S,L)=>{r&&(r.progresso=S),L||(e[R.id]={...T??{},consultadoEm:o.agora()}),I+=1,I>=10&&(I=0,v()),P(),y()}});r=null,await v(),clearTimeout(n),n=void 0,!t&&(o.aoMudar(),O.motivo==="sessao"?o.aviso("A sess\xE3o do SEI expirou: a consulta parou. O que j\xE1 foi lido ficou guardado."):O.motivo==="erros"?o.aviso("O SEI parou de responder: a consulta foi interrompida. O que j\xE1 foi lido ficou guardado."):O.motivo==="concluida"&&o.aviso(`Andamento consultado: ${fe(O.progresso.feitos-O.progresso.semDados,"processo","processos")} com dados${O.progresso.semDados?`, ${O.progresso.semDados} sem informa\xE7\xE3o`:""}.`))}async function E(A){if(r)return!0;let w=A==="todos"?i():l();if(!w.length)return o.aviso(A==="todos"?"Nenhum processo eleg\xEDvel para consultar.":"Todos os processos j\xE1 t\xEAm o andamento guardado."),!1;let I=A==="todos"?0:i().length-w.length;return await m(w.length,I)?(M(w),!0):!1}async function x(){return r||!l().length?!0:await E("novo")||c().length>0}function P(){if(s.hidden=!a||t,s.hidden)return;if(r){let{feitos:R,total:T}=r.progresso;s.replaceChildren(d("span",{},`Consultando o andamento dos processos\u2026 ${R} de ${T}`),d("progress",{max:String(T),value:String(R),"aria-label":"Progresso da consulta"}),d("button",{type:"button",class:"spro-link",onclick:()=>r?.ctl.abort()},"Cancelar"));return}let A=c();if(!A.length){s.replaceChildren(d("span",{},'O andamento dos processos ainda n\xE3o foi consultado, por isso todos aparecem em "Sem informa\xE7\xE3o".'),d("button",{type:"button",class:"spro-link",onclick:()=>void E("novo")},"Consultar agora"));return}let w=Math.min(...A.map(R=>R.consultadoEm)),I=w+kr,O=l().length;s.replaceChildren(d("span",{},`Andamento consultado ${Gc(o.agora()-w)} (guardado at\xE9 ${new Date(I).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})`,O?` \xB7 ${fe(O,"processo ainda sem consulta","processos ainda sem consulta")}`:""),d("button",{type:"button",class:"spro-link",onclick:()=>void E("todos")},q("atualizar",13)," Atualizar"))}return{faixa:s,carregar:f,dados:()=>e,definirAtivo(A){a=A,P()},atualizarFaixa:P,aoEscolherAgrupamento:x,pedir:E,emAndamento:()=>!!r,fechar(){t=!0,r?.ctl.abort(),clearTimeout(n)}}}var Uc=[[/azul_marinho|marinho/,"#1d3557"],[/azul_claro|ciano|celeste/,"#2a9fd6"],[/azul/,"#2563c9"],[/verde_escuro/,"#166534"],[/verde|lima/,"#2e9e4f"],[/amarelo/,"#e0b000"],[/laranja/,"#ee7d11"],[/vermelho/,"#d1352b"],[/rosa|magenta/,"#d6409f"],[/roxo|violeta|lilas/,"#7048c6"],[/marrom/,"#8a5a3c"],[/preto/,"#222831"],[/branco/,"#ffffff"],[/cinza/,"#7b838c"]];function _o(o){let e=o.toLowerCase();return Uc.find(([r])=>r.test(e))?.[1]??"#8b939c"}var Bc="http://www.w3.org/2000/svg";function qo(o,e,r=document){let t=r.createElementNS(Bc,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,n);return t}function Qc(){let o=qo("svg",{viewBox:"0 0 24 24",width:"17",height:"17","aria-hidden":"true",focusable:"false"});return o.append(qo("path",{d:"M12 3L2.2 20h19.6L12 3z",fill:"#facc15",stroke:"#9ca3af","stroke-width":"1.4","stroke-linejoin":"round"}),qo("path",{d:"M12 9.2v5.2",stroke:"#111827","stroke-width":"2.1","stroke-linecap":"round"}),qo("circle",{cx:"12",cy:"17.3",r:"1.2",fill:"#111827"})),o}function Xc(o){let e=_o(o),r=e==="#ffffff"||e==="#e0b000",t=qo("svg",{viewBox:"0 0 24 24",width:"16",height:"16","aria-hidden":"true",focusable:"false"});return t.append(qo("path",{d:"M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z",fill:e,stroke:r?"#9ca3af":"none","stroke-width":r?"1.5":"0","stroke-linejoin":"round"}),qo("circle",{cx:"7.2",cy:"7.2",r:"1.7",fill:r?"#9ca3af":"#ffffff"})),t}var tt="application/x-spro-cartao",or="application/x-spro-coluna";function Kc(o,e){if(!o.anotacao?.texto?.trim())return null;let t=!o.sigiloso&&!!e.aoEditarAnotacao,n=Po(o.anotacao.texto).map((c,l)=>{if(c.marca===null)return d("div",{class:"spro-anot-linha"},c.texto||"\xA0");let p=d("button",{type:"button",role:"checkbox",class:`spro-anot-check${c.marca?" spro-anot-check-on":""}`,"aria-checked":String(c.marca),"aria-label":c.marca?`Desmarcar ${c.texto}`:`Marcar ${c.texto}`,title:c.marca?"Desmarcar tarefa":"Marcar tarefa como conclu\xEDda",draggable:"false",onmousedown:f=>f.stopPropagation(),onclick:f=>{f.preventDefault(),f.stopPropagation(),e.aoAlternarTarefa?.(o.id,l)}},c.marca?"\u2713":"");return d("div",{class:`spro-anot-linha spro-anot-tarefa${c.marca?" spro-anot-feita":""}`},p,d("span",{class:"spro-anot-txt"},c.texto))}),s=[o.anotacao?.autor?`\xDAltima edi\xE7\xE3o: ${o.anotacao.autor}`:"",t?"Clique para editar a anota\xE7\xE3o":""].filter(Boolean).join(`
`);return d("div",{class:`spro-cartao-anotacao${o.anotacao?.prioridade?" spro-cartao-anotacao-prio":""}${t?" spro-cartao-anotacao-editavel":""}`,title:s||void 0,...t?{onclick:c=>{c.stopPropagation(),e.aoEditarAnotacao?.(o.id)}}:{}},...n)}function Jc(o,e,r){let t=[];if(o.documentoNovo){let n=o.documentoNovoDica||"Um documento foi inclu\xEDdo ou assinado neste processo";t.push(d("span",{class:"spro-cartao-excl",title:n,"aria-label":n},Qc()))}let a=r.cfg.colunas==="marcador"?o.marcadores.filter(n=>`m:${n.nome}`!==e):o.marcadores;for(let n of a){let s=n.texto?`${n.nome}
${n.texto}`:n.nome;t.push(d("span",{class:"spro-cartao-marc-ic",title:s,"aria-label":s},Xc(n.cor)))}return t.length?d("div",{class:"spro-cartao-sinais"},...t):null}function Wc(o,e,r){let t=lo(o,r.ctx),a=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${o.protocolo}`});a.checked=r.selecionados.has(o.id),a.addEventListener("change",()=>r.aoSelecionar(o.id,a.checked));let n=t?"Editar o prazo":"Definir um prazo",s=r.aoAbrirPrazo?d("button",{type:"button",class:"spro-prazo-b",title:t?`${t.dica}

${n}`:n,"aria-label":n,onclick:f=>{f.preventDefault(),f.stopPropagation(),r.aoAbrirPrazo?.(o.id)}},t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`},t.texto):d("span",{class:"spro-prazo-vazio"},"definir")):t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`,title:t.dica},t.texto):null,i=Kc(o,r),c=Jc(o,e,r),l=!i&&!o.sigiloso&&r.aoEditarAnotacao?d("button",{type:"button",class:"spro-anot-vazia",title:"Adicionar anota\xE7\xE3o","aria-label":"Adicionar anota\xE7\xE3o",onclick:f=>{f.preventDefault(),f.stopPropagation(),r.aoEditarAnotacao?.(o.id)}},"+ anota\xE7\xE3o"):null,p=d("div",{class:`spro-cartao${a.checked?" spro-sel":""}`,draggable:"true","data-id":o.id,"data-de":e},d("div",{class:"spro-cartao-topo"},a,d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",draggable:"false"},o.protocolo)),o.tipo?d("div",{class:"spro-cartao-tipo"},o.tipo):null,o.especificacao?d("div",{class:"spro-cartao-espec",title:o.especificacao},o.especificacao):null,i,c,d("div",{class:"spro-cartao-rodape"},d("div",{class:"spro-cartao-acoes"},s,l),o.atribuicao?d("span",{class:"spro-avatar",title:o.atribuicao.nome},o.atribuicao.sigla.slice(0,2).toUpperCase()):null));return p.addEventListener("dragstart",f=>{f.stopPropagation(),f.dataTransfer?.setData(tt,JSON.stringify({id:o.id,de:e})),f.dataTransfer?.setData("text/plain",o.protocolo),f.dataTransfer&&(f.dataTransfer.effectAllowed="move"),p.classList.add("spro-arrastando")}),p.addEventListener("dragend",()=>p.classList.remove("spro-arrastando")),p}function Zc(o,e,r){let t=r.cfg.colunasRecolhidas?.includes(o.chave)??!1,a=d("div",{class:"spro-col-corpo"},...o.itens.map(p=>Wc(p,o.chave,r)));o.itens.length||a.append(d("div",{class:"spro-col-vazia"},o.aceitaSoltar?"Solte aqui":"Vazia"));let n=r.cfg.limite,s=!!r.aoReordenarColuna,i=r.aoAlternarColuna?d("button",{type:"button",class:"spro-col-recolher","aria-expanded":String(!t),"aria-label":t?`Expandir coluna ${o.titulo}`:`Recolher coluna ${o.titulo}`,title:t?"Expandir coluna":"Recolher coluna",draggable:"false",onmousedown:p=>p.stopPropagation(),onclick:p=>{p.preventDefault(),p.stopPropagation(),r.aoAlternarColuna?.(o.chave)}},t?"+":"\u2212"):null,c=d("div",{class:`spro-col-topo${s?" spro-col-arrastavel":""}`,...s?{draggable:"true",title:"Arraste para reordenar a coluna"}:{}},s?d("span",{class:"spro-col-alca","aria-hidden":"true"},"\u22EE\u22EE"):null,d("span",{class:"spro-col-titulo",title:o.titulo},o.titulo),d("span",{class:`spro-col-n${o.excedeu?" spro-excedeu":""}`,title:o.excedeu?`Passou do limite de ${n}`:void 0},n>0?`${o.itens.length}/${n}`:String(o.itens.length)),i,o.aceitaSoltar?null:d("span",{class:"spro-col-trava",title:o.motivoSomenteLeitura},so("bloquear",13))),l=d("section",{class:`spro-col${o.tom?` spro-tom-${o.tom}`:""}${o.excedeu?" spro-col-cheia":""}${t?" spro-col-recolhida":""}`,"data-chave":o.chave},c,a);return s&&(c.addEventListener("dragstart",p=>{p.stopPropagation(),p.dataTransfer?.setData(or,o.chave),p.dataTransfer?.setData("text/plain",o.titulo),p.dataTransfer&&(p.dataTransfer.effectAllowed="move"),l.classList.add("spro-col-arrastando")}),c.addEventListener("dragend",()=>l.classList.remove("spro-col-arrastando"))),l.addEventListener("dragover",p=>{if(s&&p.dataTransfer?.types.includes(or)){p.preventDefault(),l.classList.add("spro-col-alvo");return}p.dataTransfer?.types.includes(tt)&&o.aceitaSoltar&&(p.preventDefault(),l.classList.add("spro-alvo"))}),l.addEventListener("dragleave",()=>{l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo")}),l.addEventListener("drop",p=>{if(l.classList.remove("spro-alvo"),l.classList.remove("spro-col-alvo"),s&&p.dataTransfer?.types.includes(or)){let m=p.dataTransfer.getData(or);if(m){p.preventDefault(),m!==o.chave&&r.aoReordenarColuna?.(m,o.chave,e);return}}let f=p.dataTransfer?.getData(tt);if(f){p.preventDefault();try{let{id:m,de:y}=JSON.parse(f);r.aoMover(m,y,o.chave)}catch{}}}),l}function ns(o){let e=d("div",{class:"spro-quadro"});e.style.setProperty("--spro-col-largura",`${o.cfg.larguraColuna??280}px`);let r=t=>{let a=es(t,o.cfg,o.ctx,o.extras),n=a.map(s=>s.chave);return d("div",{class:"spro-colunas"},...a.map(s=>Zc(s,n,o)))};if(o.cfg.raiasPorResponsavel&&o.cfg.colunas!=="responsavel")for(let t of Xe(o.processos,"responsavel",o.ctx))e.append(d("div",{class:"spro-raia"},d("div",{class:"spro-raia-nome"},t.rotulo,d("span",{class:"spro-grupo-n"},String(t.itens.length))),r(t.itens)));else e.append(r(o.processos));return o.processos.length||e.prepend(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro.")),e}var ss=".spro-fav-estrela, .spro-prj-ic, .spro-dem-cx",Yc=[".spro-fav-",".spro-prj-",".spro-dem-cx"],is=(o,e)=>o.getElementById(`P${e}`)?.querySelectorAll("td")[1],er=["spro-fav-estrela","spro-prj-ic","spro-dem-cx"],at=o=>er.find(e=>o.classList.contains(e))??"";function ol(o,e,r){for(let t of Array.from(o.attributes))!e.hasAttribute(t.name)&&t.name!=="data-spro-id"&&t.name!=="data-tip"&&o.removeAttribute(t.name);for(let t of Array.from(e.attributes))t.name!=="aria-busy"&&t.name!=="title"&&o.getAttribute(t.name)!==t.value&&o.setAttribute(t.name,t.value);e.getAttribute("title")&&o.getAttribute("data-tip")!==e.getAttribute("title")&&o.setAttribute("data-tip",e.getAttribute("title")),o.removeAttribute("aria-busy"),o.setAttribute("data-spro-id",r),o.innerHTML!==e.innerHTML&&o.replaceChildren(...Array.from(e.cloneNode(!0).childNodes))}function cs(){let o=new Map;return function(r,t){let a=is(r,t),n=new Set,s=[];if(a){let i=[...a.querySelectorAll(ss)].sort((c,l)=>er.indexOf(at(c))-er.indexOf(at(l)));for(let c of i){let l=`${t}|${at(c)}`;n.add(l);let p=o.get(l);p?ol(p,c,t):(p=c.cloneNode(!0),p.removeAttribute("aria-busy"),p.setAttribute("data-spro-id",t),o.set(l,p)),s.push(p)}}for(let i of er)n.has(`${t}|${i}`)||o.delete(`${t}|${i}`);return s}}function nt(o,e){let r=is(o,e);return r?[...r.querySelectorAll(`${ss}, .acompanhamentoesp_icon`)].map(t=>`${t.className}|${t.getAttribute("aria-pressed")??""}|${t.getAttribute("aria-label")??""}|${t.hasAttribute("data-atraso")?1:0}|${t.querySelector('[class$="-n"]')?.textContent??""}`).join(";"):""}function ls(o){let e=[];for(let r of Array.from(o.styleSheets??[])){let t;try{t=r.cssRules}catch{continue}for(let a of Array.from(t)){let n=a.cssText;Yc.some(s=>n.includes(s))&&e.push(n)}}return e.join(`
`)}var el=30;function rl(o){let e=[],r=(a,n)=>{let s=a?.getAttribute("data-tarefa");e.push({marca:s==null?null:s==="x",texto:n.replace(/\u00a0/g," ").replace(/\n+$/,"")})},t="";for(let a of Array.from(o.childNodes))if(a.nodeType===3)t+=a.textContent??"";else if(a.nodeType===1){let n=a;if(t){for(let s of t.split(`
`))r(null,s);t=""}n.tagName==="BR"?r(null,""):r(n,n.textContent??"")}if(t)for(let a of t.split(`
`))r(null,a);return e.length?e:[{marca:null,texto:""}]}function ds(o,e){let r=o.ownerDocument;o.replaceChildren(...e.map(t=>{let a=r.createElement("div");return a.className="spro-pi-linha",t.marca!==null&&a.setAttribute("data-tarefa",t.marca?"x":"o"),t.texto?a.textContent=t.texto:a.append(r.createElement("br")),a}))}function us(o,e){let r=o.prioridade,t=()=>{},a=d("div",{class:"spro-pi-editor",contenteditable:"true",role:"textbox","aria-multiline":"true","aria-label":"Anota\xE7\xE3o",spellcheck:"true"}),n=d("span",{class:"spro-pi-contador"}),s=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Lista de tarefas (nas linhas selecionadas)","aria-label":"Lista de tarefas"},q("check",16)),i=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Prioridade","aria-label":"Prioridade"},so("prioridade",16)),c=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Inserir a data de hoje","aria-label":"Inserir a data de hoje"},q("calendario",16)),l=d("div",{class:"spro-pi-barra"},s,c,i,n),p=d("div",{class:"spro-pi"},a,l),f=()=>rl(a),m=()=>Ie(f());function y(){p.classList.toggle("spro-pi-prio",r),i.setAttribute("aria-pressed",String(r));let E=m().length;n.textContent=`${E}/${500}`,n.classList.toggle("spro-pi-estouro",E>500),t()}ds(a,Po(o.texto)),y();function v(){let E=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,x=Array.from(a.children),P=R=>{let T=R;for(;T&&T.parentNode!==a;)T=T.parentNode;return T?x.indexOf(T):-1};if(!E||!E.rangeCount)return[];let A=P(E.anchorNode),w=P(E.focusNode);if(A<0&&w<0)return[];let[I,O]=[Math.min(A<0?w:A,w<0?A:w),Math.max(A,w)];return Array.from({length:O-I+1},(R,T)=>I+T)}let M=E=>{ds(a,E),y()};for(let E of[s,c,i])E.addEventListener("mousedown",x=>x.preventDefault());return s.addEventListener("click",()=>{let E=f(),x=v();M(Or(E,x.length?x:E.map((P,A)=>A).filter(P=>P===E.length-1))),a.focus()}),i.addEventListener("click",()=>{r=!r,y()}),c.addEventListener("click",()=>{a.focus();let E=uo(Uo());e.ownerDocument.execCommand?.("insertText",!1,E)||(a.append(E),y())}),a.addEventListener("input",y),a.addEventListener("paste",E=>{E.preventDefault();let x=E.clipboardData?.getData("text/plain")??"";e.ownerDocument.execCommand?.("insertText",!1,x.replace(/\r\n?/g,`
`))}),a.addEventListener("mousedown",E=>{let x=E.target.closest?.(".spro-pi-linha");!x||!x.hasAttribute("data-tarefa")||E.clientX-x.getBoundingClientRect().left>el||(E.preventDefault(),M($e(f(),Array.from(a.children).indexOf(x))))}),a.addEventListener("keydown",E=>{if(E.key!=="Enter"||E.shiftKey)return;let x=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,P=v(),A=f();x?.isCollapsed&&P.length===1&&A[P[0]]?.marca!==null&&!A[P[0]].texto.trim()&&(E.preventDefault(),M(Or(A,[P[0]])))}),{el:p,texto:m,prioridade:()=>r,aoMudar:E=>{t=E},foco:()=>{a.focus()}}}var al=o=>o instanceof Error?o.message:String(o);async function st(o,e,r,t,a){let n=0,s=[],i=0;for(let c of e){let l=o.todos().find(p=>p.id===c.id)??c;o.aplicarLocal(l.id,r(l));try{await o.gravar(()=>t(l)),n+=1}catch(p){o.aplicarLocal(l.id,l),s.push(`${l.protocolo}: ${al(p)}`)}a?.(i+=1,e.length)}return{ok:n,falhas:s}}function it(o,e,r){e.falhas.length?o.aviso(`${r}: ${e.ok} ok, ${e.falhas.length} com erro \u2014 ${e.falhas[0]}`):o.aviso(`${r}: ${e.ok} ${e.ok===1?"processo atualizado":"processos atualizados"}.`)}function ps(o,e,r){let t=Ze(e,o.selecionados(),o.todos(),!0,r).filter(n=>n.id!==e.id);if(!t.length)return null;let a=d("input",{type:"checkbox"});return{el:d("label",{class:"spro-rotulo-linha spro-estender"},a,` Aplicar tamb\xE9m aos ${t.length} ${t.length===1?"outro selecionado":"outros selecionados"}`),marcado:()=>a.checked,n:()=>t.length}}var ct=(...o)=>d("div",{class:"spro-dialogo-rodape"},...o),lt=(o="Salvar")=>d("button",{type:"button",class:"spro-botao primario"},q("check",15),o);function ms(o,e){let r=[],t=e.atribuicao?.sigla??"",a=ko({rotulo:"Respons\xE1vel",icone:"pessoa",busca:!0,larguraLista:320,vazio:"Escolher o respons\xE1vel\u2026",opcoes:()=>[{valor:"",rotulo:"Sem respons\xE1vel",descricao:"Remove a atribui\xE7\xE3o"},...r.map(p=>({valor:p.sigla,rotulo:p.nome===p.sigla?p.sigla:p.nome,descricao:p.sigla}))],valor:[t],aoMudar:([p])=>{t=p??"",c()}}),n=ps(o,e,()=>!0),s=lt(),i=d("p",{class:"spro-suave"},"Carregando os usu\xE1rios da unidade\u2026"),c=()=>{s.disabled=!r.length||t===(e.atribuicao?.sigla??"")},l=Wo(o.raiz,{titulo:"Respons\xE1vel",subtitulo:e.protocolo,icone:"pessoa",conteudo:d("div",{class:"spro-form"},d("label",{class:"spro-campo-rotulo"},"Atribuir a",a.el),i,n?.el??null,ct(s))});o.extras().then(p=>{r=p.responsaveis??[],i.textContent=r.length?"":"N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade.",a.atualizar(),c()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade."}),c(),s.addEventListener("click",async()=>{let p=t?r.find(m=>m.sigla===t)??{sigla:t,nome:t}:null,f=n?.marcado()?Ze(e,o.selecionados(),o.todos(),!0,()=>!0):[e];s.disabled=!0,l.fechar(),it(o,await st(o,f,m=>os(m,p),m=>o.atribuir(m.protocolo,p?.sigla??null)),p?`Respons\xE1vel: ${p.nome}`:"Atribui\xE7\xE3o removida")})}function dt(o,e){let r=us({texto:e.anotacao?.texto??"",prioridade:e.anotacao?.prioridade??!1},o.raiz),t=lt(),a=e.anotacao?d("button",{type:"button",class:"spro-botao perigo"},q("lixeira",15),"Remover anota\xE7\xE3o"):null,n=()=>{let c=Je(r.texto()),l=r.texto().length>500;t.disabled=!c||l||c===(e.anotacao?.texto??"")&&r.prioridade()===(e.anotacao?.prioridade??!1)};r.aoMudar(n);let s=Wo(o.raiz,{titulo:"Anota\xE7\xE3o",subtitulo:e.protocolo,icone:"nota",largo:!0,conteudo:d("div",{class:"spro-form"},r.el,e.anotacao?.autor?d("p",{class:"spro-suave"},`\xDAltima edi\xE7\xE3o: ${e.anotacao.autor}`):null,ct(a,t))});r.foco(),n();let i=async(c,l,p)=>{s.fechar(),it(o,await st(o,[e],f=>We(f,c,l,o.autor),f=>o.anotar(f.protocolo,{texto:c,prioridade:l})),p)};t.addEventListener("click",()=>void i(Je(r.texto()),r.prioridade(),"Anota\xE7\xE3o salva")),a?.addEventListener("click",()=>void i("",!1,"Anota\xE7\xE3o removida"))}function fs(o,e){let r=e.marcadores.map(m=>({nome:m.nome,texto:m.texto})),t=[],a=d("div",{class:"spro-marcadores-lista"}),n=ps(o,e,m=>!m.sigiloso),s=lt(),i=d("p",{class:"spro-suave"},"Carregando os marcadores da unidade\u2026"),c=ko({rotulo:"Adicionar marcador",icone:"etiqueta",busca:!0,larguraLista:320,vazio:"Adicionar marcador\u2026",opcoes:()=>t.filter(m=>!r.some(y=>y.nome.toLowerCase()===m.toLowerCase())).map(m=>({valor:m,rotulo:m,cor:_o(o.corDoMarcador(m))})),aoMudar:([m])=>{m&&(r=[...r,{nome:m,texto:""}],c.definir([],!1),p())}}),l=()=>Zn(e.marcadores,r);function p(){a.replaceChildren(...r.length?r.map((m,y)=>{let v=d("input",{type:"text",class:"spro-campo",maxlength:String(250),placeholder:"Texto do marcador (opcional)","aria-label":`Texto de ${m.nome}`,value:m.texto});return v.addEventListener("input",()=>{r[y]={...m,texto:v.value},s.disabled=!l().length}),d("div",{class:"spro-marcador-linha"},d("span",{class:"spro-marcador",title:m.nome},d("i",{style:`background:${_o(o.corDoMarcador(m.nome))}`}),m.nome),v,d("button",{type:"button",class:"spro-botao-icone pequeno",title:`Remover ${m.nome}`,"aria-label":`Remover ${m.nome}`,onclick:()=>{r=r.filter((M,E)=>E!==y),p()}},q("fechar",13)))}):[d("p",{class:"spro-suave"},"Nenhum marcador. Adicione abaixo.")]),c.atualizar(),s.disabled=!l().length}let f=Wo(o.raiz,{titulo:"Marcadores",subtitulo:e.protocolo,icone:"etiqueta",conteudo:d("div",{class:"spro-form"},a,c.el,i,n?.el??null,ct(s))});p(),o.extras().then(m=>{t=m.marcadores??[],i.textContent=t.length?"":"N\xE3o foi poss\xEDvel ler os marcadores da unidade.",p()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os marcadores da unidade."}),s.addEventListener("click",async()=>{let m=l();if(!m.length)return;let y=n?.marcado()?Ze(e,o.selecionados(),o.todos(),!0,v=>!v.sigiloso):[e];f.fechar(),it(o,await st(o,y,v=>Yn(v,ot(m,v),o.corDoMarcador),async v=>{for(let M of ot(m,v))M.tipo==="remover"?await o.marcar(v.protocolo,{marcador:M.nome,remover:!0}):await o.marcar(v.protocolo,{marcador:M.nome,texto:M.texto})}),"Marcadores")})}function gs(o,e,r,t,a=8){let n=Math.max(1,e),s=t>0?t:n*40,i=Math.max(0,Math.min(o,Math.floor(r/n)-a)),c=Math.min(o,Math.ceil((r+s)/n)+a);return{inicio:i,fim:c,antes:i*n,depois:Math.max(0,o-c)*n}}var tr={compacta:34,confortavel:48},nl={processo:"minmax(340px, 370px)",tipo:"minmax(120px, 1.2fr)",especificacao:"minmax(200px, 2fr)",responsavel:"minmax(90px, 130px)",marcadores:"minmax(120px, 1.3fr)",prazo:"minmax(120px, 150px)",anotacao:"minmax(130px, 1.4fr)",caixa:"84px",parado:"84px",sinais:"minmax(110px, 150px)"},sl={processo:"protocolo",tipo:"tipo",responsavel:"responsavel",marcadores:"marcador",prazo:"prazo",caixa:"caixa",parado:"parado",sinais:"novo"};function il(o){let e=o.trim().split(/\s+/);return e.length>2?`${e[0]} ${e[e.length-1]}`:o}function ar(o,e){return d("button",{type:"button",class:"spro-lapis",title:o,"aria-label":o,onclick:r=>{r.preventDefault(),r.stopPropagation(),e()}},q("lapis",13))}var io=(o,e,r)=>d(o,{class:e},r);function cl(o,e,r,t){let a=io("div",`spro-c spro-c-${e}`);switch(e){case"processo":{let n=t.icones(o.id),s=p=>n.find(f=>f.classList.contains(p))??d("span",{class:"spro-slot"}),i=o.acompanhamentoEspecial?d("span",{class:"spro-acomp",title:o.acompanhamentoGrupo?`Acompanhamento especial: ${o.acompanhamentoGrupo}`:"Acompanhamento especial"},q("olho",15)):d("span",{class:"spro-slot"});a.append(d("span",{class:"spro-icones"},s("spro-fav-estrela"),s("spro-prj-ic"),s("spro-dem-cx"),i));let c=o.grupo==="recebidos";t.semOrigem||a.append(d("span",{class:`spro-origem spro-origem-${o.grupo}`,title:c?"Processo recebido: veio de outra unidade":"Processo gerado: autuado nesta unidade",role:"img","aria-label":c?"Processo recebido":"Processo gerado"},so(c?"recebido":"gerado",16)));let l=d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",title:"Abrir o processo"},o.protocolo);a.append(l),o.link&&a.append(d("a",{class:"spro-nova-guia",href:o.link,target:"_blank",rel:"noopener",title:"Abrir em nova guia","aria-label":`Abrir ${o.protocolo} em nova guia`},so("novaGuia",14))),o.sigiloso&&a.append(d("span",{class:"spro-sigilo",title:"Processo sigiloso"},"sigiloso")),o.urgente&&a.append(d("span",{class:"spro-urgente",title:"Marcado como urgente"},"urgente")),o.trancado&&a.append(d("span",{class:"spro-sigilo",title:"Processo trancado"},"trancado"));break}case"tipo":a.append(io("span","spro-corta",o.tipo)),a.title=o.tipo;break;case"especificacao":{if(a.classList.add("spro-editavel"),t.editando===o.id){let n=d("input",{type:"text",class:"spro-espec-input",maxlength:"100",value:t.rascunho,"aria-label":"Especifica\xE7\xE3o do processo"});n.addEventListener("input",()=>t.aoDigitarEspec(n.value)),n.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"?t.aoSalvarEspec(o.id):l.key==="Escape"&&t.aoCancelarEspec()});let s=l=>l.preventDefault(),i=d("button",{type:"button",class:"spro-lapis spro-lapis-ok",title:"Salvar (Enter)","aria-label":"Salvar",onclick:()=>t.aoSalvarEspec(o.id)},q("check",14)),c=d("button",{type:"button",class:"spro-lapis",title:"Cancelar (Esc)","aria-label":"Cancelar",onclick:()=>t.aoCancelarEspec()},q("fechar",14));i.addEventListener("pointerdown",s),c.addEventListener("pointerdown",s),a.append(d("span",{class:"spro-edicao"},n,i,c));break}a.append(io("span","spro-corta",o.especificacao)),a.title=o.especificacao,o.sigiloso||a.append(ar("Editar a especifica\xE7\xE3o",()=>t.aoEditarEspec(o.id)));break}case"responsavel":a.classList.add("spro-editavel"),o.atribuicao?(a.append(io("span","spro-corta",t.nomesCompletos?il(o.atribuicao.nome):o.atribuicao.sigla)),a.title=t.nomesCompletos?o.atribuicao.sigla:o.atribuicao.nome):a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"atribuir")),a.append(ar(o.atribuicao?"Mudar o respons\xE1vel":"Atribuir a algu\xE9m",()=>t.aoEditar(o.id,"responsavel")));break;case"marcadores":a.classList.add("spro-editavel"),o.marcadores.length&&a.append(d("span",{class:"spro-pilulas"},...o.marcadores.map(n=>d("span",{class:"spro-marcador",title:n.texto?`${n.nome}: ${n.texto}`:n.nome},d("i",{style:`background:${_o(n.cor)}`}),n.nome)))),o.sigiloso||(o.marcadores.length||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"marcar")),a.append(ar(o.marcadores.length?"Editar os marcadores":"Adicionar marcador",()=>t.aoEditar(o.id,"marcadores"))));break;case"prazo":{let n=lo(o,r);a.classList.add("spro-editavel");let s=n?"Editar o prazo":"Definir um prazo",i=d("button",{type:"button",class:"spro-prazo-b",title:n?`${jn(o,r)}
${n.dica}

${s}`:s,"aria-label":s,onclick:c=>{c.preventDefault(),c.stopPropagation(),t.aoAbrirPrazo(o.id)}},n?io("span",`spro-prazo spro-prazo-${n.situacao}`,n.texto):io("span","spro-prazo-vazio","definir"));a.append(i,d("span",{class:"spro-lapis spro-lapis-fixo","aria-hidden":"true"},q("lapis",13)));break}case"anotacao":a.classList.add("spro-editavel"),o.anotacao?(a.append(io("span",`spro-corta${o.anotacao.prioridade?" spro-prio":""}`,Ga(o.anotacao.texto))),a.setAttribute("data-tip-nota",o.anotacao.texto),a.setAttribute("data-tip-autor",o.anotacao.autor)):o.sigiloso||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"anotar")),o.sigiloso||a.append(ar(o.anotacao?"Editar a anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",()=>t.aoEditar(o.id,"anotacao")));break;case"caixa":{let n=je(Mo(o,r));a.append(io("span","spro-suave",n)),n&&(a.title=vn);break}case"parado":{let n=zo(o,r);a.append(io("span","spro-suave",je(n))),n!==null&&(a.title="Dias desde a \xFAltima movimenta\xE7\xE3o (vis\xE3o detalhada do SEI).");break}case"sinais":for(let n of Hn(o))a.append(io("span","spro-sinal",n));break}return a}function hs(o){let e=o,r=io("div","spro-cab"),t=io("div","spro-corpo"),a=d("div",{class:"spro-rolagem",tabindex:"-1"},t),n=d("div",{class:"spro-tabela",role:"table"},r,a),s="",i=!1,c=!1,l=()=>`36px ${e.colunas.map(x=>nl[x]).join(" ")}`;function p(){r.replaceChildren(),r.style.gridTemplateColumns=l();let x=e.linhas.filter(w=>w.tipo==="processo").map(w=>w.processo.id),P=x.filter(w=>e.selecionados.has(w)).length,A=d("input",{type:"checkbox",class:"spro-cb","aria-label":"Marcar todos os processos vis\xEDveis",title:"Marcar todos os vis\xEDveis",disabled:!x.length});A.checked=x.length>0&&P===x.length,A.indeterminate=P>0&&P<x.length,A.addEventListener("change",()=>e.aoMarcarGrupo(x,A.checked)),r.append(io("div","spro-c spro-c-cb")),r.firstElementChild.append(A);for(let w of e.colunas){let I=sl[w],O=I?e.ordem.findIndex(T=>T.campo===I):-1,R=d("div",{class:`spro-c spro-th${I?" spro-ordenavel":""}`,role:"columnheader",...O>=0?{"aria-sort":e.ordem[O].decrescente?"descending":"ascending"}:{}});if(I){let T=d("button",{type:"button",class:"spro-th-b",title:"Ordenar (Shift acrescenta outro crit\xE9rio)",onclick:S=>e.aoOrdenar(I,S.shiftKey)},Qo[w]);O>=0&&T.append(d("span",{class:"spro-seta-ordem"},`${e.ordem[O].decrescente?"\u2193":"\u2191"}${e.ordem.length>1?O+1:""}`)),R.append(T)}else R.append(Qo[w]);r.append(R)}}function f(x,P){let A=e.selecionados.has(x.id),w=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${x.protocolo}`,title:x.naPaginaAtual?void 0:`Est\xE1 na p\xE1gina ${x.pagina+1} do SEI: as a\xE7\xF5es do SEI aceitam processos de uma p\xE1gina por vez`});w.checked=A,w.addEventListener("change",()=>e.aoSelecionar(x.id,w.checked));let I=d("div",{class:`spro-linha${A?" spro-sel":""}${e.foco===x.id?" spro-foco":""}${x.urgente?" spro-linha-urgente":""}`,role:"row","data-id":x.id,"data-grupo":P});I.style.gridTemplateColumns=l(),I.style.height=`${tr[e.densidade]}px`;let O=io("div","spro-c spro-c-cb");return O.append(w),I.append(O,...e.colunas.map(R=>cl(x,R,e.ctx,e))),I}function m(x){let P=x.grupo.itens.map(I=>I.id),A=d("button",{type:"button",class:"spro-grupo-b","aria-expanded":String(!x.recolhido),onclick:()=>e.aoGrupo(x.grupo.chave)},d("span",{class:`spro-grupo-seta${x.recolhido?" spro-fechado":""}`},so("seta",14)),d("span",{class:"spro-grupo-nome"},x.grupo.rotulo),d("span",{class:"spro-grupo-n"},String(x.grupo.itens.length))),w=d("div",{class:`spro-grupo${x.grupo.tom?` spro-tom-${x.grupo.tom}`:""}`,role:"row"},A);if(P.length){let I=P.every(O=>e.selecionados.has(O));w.append(d("button",{type:"button",class:"spro-link",onclick:()=>e.aoMarcarGrupo(P,!I)},I?"Desmarcar grupo":"Marcar grupo"))}return w.style.height=`${tr[e.densidade]}px`,w}function y(){let x=tr[e.densidade],P=gs(e.linhas.length,x,a.scrollTop||0,a.clientHeight||0);t.style.paddingTop=`${P.antes}px`,t.style.paddingBottom=`${P.depois}px`,t.replaceChildren(...e.linhas.slice(P.inicio,P.fim).map(w=>w.tipo==="grupo"?m(w):f(w.processo,w.grupo)));let A=t.querySelector(".spro-espec-input");A&&i?(i=!1,A.focus(),A.setSelectionRange?.(A.value.length,A.value.length)):A&&A.getRootNode()instanceof ShadowRoot&&A.getRootNode().activeElement!==A&&c&&A.focus()}let v=0;a.addEventListener("scroll",()=>{if(v)return;let x=a.ownerDocument.defaultView;if(!x?.requestAnimationFrame)return y();v=x.requestAnimationFrame(()=>{v=0,y()})});function M(x){let P=x.colunas.join()!==e.colunas.join()||x.ordem!==e.ordem||x.selecionados!==e.selecionados;x.editando&&x.editando!==e.editando&&(i=!0),c=!!x.editando,e=x;let A=`${e.colunas.join()}|${e.densidade}`;if((P||A!==s)&&(p(),s=A),!e.linhas.length){t.style.paddingTop=t.style.paddingBottom="0",t.replaceChildren(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro."));return}y()}function E(x){let P=e.linhas.findIndex(w=>w.tipo==="processo"&&w.processo.id===x);if(P<0)return!1;let A=tr[e.densidade];return P*A<a.scrollTop?a.scrollTop=P*A:(P+1)*A>a.scrollTop+a.clientHeight&&a.clientHeight>0&&(a.scrollTop=(P+1)*A-a.clientHeight),y(),!0}return M(o),{el:n,atualizar:M,mostrar:E,rolagem:a}}var ll=[["/","Buscar"],["j / k","Linha seguinte / anterior"],["x","Marcar a linha"],["Enter","Abrir o processo"],["g t","Ver a tabela"],["g q","Ver o quadro"],["Esc","Limpar a busca ou a sele\xE7\xE3o"],["?","Esta ajuda"]],bs=o=>o==="grupo:recebidos"?"grupo:gerados":o==="grupo:gerados"?"grupo:recebidos":null,dl={"resp:eu":"Processos atribu\xEDdos a voc\xEA","grupo:recebidos":"Processos que vieram de outra unidade","grupo:gerados":"Processos autuados nesta unidade","prazo:atrasado":"Prazo vencido e ainda n\xE3o conclu\xEDdo","prazo:semana":"Vencem nos pr\xF3ximos 7 dias","resp:sem":"Processos sem respons\xE1vel","novo:sim":"Ainda n\xE3o abertos nesta unidade","novo:visita":"Chegaram depois da sua \xFAltima visita","parado:>30d":"Sem movimenta\xE7\xE3o h\xE1 mais de 30 dias (vis\xE3o detalhada do SEI)"},ul=[["Meus","resp:eu",{comum:"pessoa"},""],["Recebidos","grupo:recebidos",{grade:"recebido"},""],["Gerados","grupo:gerados",{grade:"gerado"},""],["Atrasados","prazo:atrasado",{comum:"alerta"},"perigo"],["Vencem na semana","prazo:semana",{comum:"calendario"},"aviso"],["Sem respons\xE1vel","resp:sem",{grade:"semPessoa"},""],["N\xE3o visualizados","novo:sim",{grade:"olhoFechado"},""],["Novos desde a \xFAltima visita","novo:visita",{comum:"brilho"},"novo"],["Parados h\xE1 +30 dias","parado:>30d",{comum:"historico"},""]];function vs(o){let{doc:e}=o,r=o.inicial.processos,t=Xo(),a=[],n="",s=new Set,i=new Set(Ur(e)),c=null,l={vistoEm:{}},p,f=null,m=!1,y=!1,v="",M={},E=!1,x=!1,P,A=!1,w=$n(o.mover),I=new AbortController,O=()=>({hoje:o.hoje(),agora:o.agora(),...o.eu?{eu:o.eu}:{},...p!==void 0?{visitaAnterior:p}:{},...j?{andamentos:j.dados()}:{}}),R=e.createElement("div");R.id="spro-grade",R.setAttribute("data-spro-grade-host","1"),R.setAttribute("data-tema",o.escuro?"escuro":"claro");let T=R.attachShadow({mode:"open"}),S=e.createElement("style");S.textContent=o.css;let L=d("div",{class:`spro-app${o.escuro?" spro-escuro":""}`}),$=e.createElement("style");T.append(S,$,L);let G=Qa(T),j=o.consultarAndamento?as({sombra:T,agora:()=>o.agora(),armazem:o.armazem,consultar:(u,g)=>o.consultarAndamento(u,g),processos:()=>r,aoMudar:()=>W(),aviso:u=>Z(u),simultaneas:o.andamentoSimultaneas,pausaMs:o.andamentoPausaMs,semDebounce:o.semDebounce}):null,z=d("input",{type:"search",class:"spro-busca",placeholder:"Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...","aria-label":"Buscar processos",spellcheck:"false",autocomplete:"off"}),K=d("div",{class:"spro-chips"}),Ho=d("div",{class:"spro-rapidos"}),go=d("div",{class:"spro-status",role:"status","aria-live":"polite"}),Do=d("div",{class:"spro-lote",hidden:!0}),oe=d("div",{class:"spro-conteudo"}),Co=d("div",{class:"spro-painel",hidden:!0}),mt=d("div",{class:"spro-avisos","aria-live":"polite"}),ee=d("div",{class:"spro-ajuda-atalhos",hidden:!0},d("strong",{},"Atalhos"),...ll.map(([u,g])=>d("div",{},d("kbd",{},u),` ${g}`))),ws=[["protocolo","N\xFAmero do processo"],["prazo","Prazo"],["tipo","Tipo"],["responsavel","Respons\xE1vel"],["marcador","Marcador"],["caixa","Tempo na caixa"],["parado","Parado h\xE1"],["novo","N\xE3o visualizados"]],cr=ko({rotulo:"Agrupar por",icone:"camadas",classe:"spro-combo-compacto",busca:!1,vazio:"Sem agrupamento",opcoes:Object.keys(Wr).filter(u=>j||!ge(u)).map(u=>({valor:u,rotulo:u==="nenhum"?"Sem agrupamento":`Agrupar: ${Wr[u]}`,...ge(u)?{descricao:"Consulta o andamento de cada processo"}:{}})),valor:["nenhum"],aoMudar:([u])=>{let g=u??"nenhum",h=t.agrupar;Q({agrupar:g}),j&&ge(g)&&j.aoEscolherAgrupamento().then(b=>{!b&&t.agrupar===g&&Q({agrupar:h})})}}),ft=ko({rotulo:"Ordenar por",icone:"ordenar",classe:"spro-combo-compacto",busca:!1,vazio:"Ordem do SEI",opcoes:[{valor:"",rotulo:"Ordem do SEI"},...ws.flatMap(([u,g])=>[{valor:`${u}:a`,rotulo:`${g} \u2191`,descricao:"Crescente"},{valor:`${u}:d`,rotulo:`${g} \u2193`,descricao:"Decrescente"}])],valor:[""],aoMudar:([u])=>{let[g,h]=(u??"").split(":");Q({ordem:g?[{campo:g,decrescente:h==="d"}]:[]})}}),be=Zr([],O()),lr=(u,g,h,b,D)=>{let C=ko({rotulo:u,vazio:g,icone:b,classe:"spro-combo-compacto",busca:!0,larguraLista:260,opcoes:()=>D().map(N=>({valor:N.valor,rotulo:N.rotulo,contagem:N.n})),aoMudar:([N])=>{N&&(Q({busca:qn(t.busca,h,N)}),z.value=t.busca,C.definir([],!1))}});return C},gt=lr("Filtrar por respons\xE1vel","Respons\xE1vel\u2026","resp","pessoa",()=>be.responsaveis),ht=lr("Filtrar por tipo","Tipo\u2026","tipo","documento",()=>be.tipos),bt=lr("Filtrar por marcador","Marcador\u2026","marcador","etiqueta",()=>be.marcadores),vt=(u,g)=>d("button",{type:"button",class:"spro-seg-b","data-modo":u,title:g,onclick:()=>Q({modo:u})},so(u==="tabela"?"lista":"quadro",16),d("span",{},g)),xt=d("div",{class:"spro-seg",role:"group","aria-label":"Modo de exibi\xE7\xE3o"},vt("tabela","Tabela"),vt("quadro","Quadro")),ve=(u,g,h,b="")=>d("button",{type:"button",class:`spro-bt ${b}`.trim(),title:g,"aria-label":g,onclick:h},so(u,16),d("span",{},g)),At=ve("colunas","Colunas",()=>Fo("colunas")),Ps=ve("disquete","Vis\xF5es",()=>Fo("visoes")),Ms=ve("lista","Exportar CSV",()=>_s()),Ds=d("button",{type:"button",class:"spro-bt spro-bt-icone",title:"Atalhos de teclado (?)","aria-label":"Atalhos de teclado",onclick:()=>{ee.hidden=!ee.hidden}},"?"),yt=ve("densidade","Densidade",()=>Q({densidade:t.densidade==="compacta"?"confortavel":"compacta"})),xe=d("div",{class:"spro-quadro-cfg",hidden:!0});L.append(d("div",{class:"spro-barra"},xt,d("div",{class:"spro-busca-caixa"},z),cr.el,ft.el,At,yt,Ps,Ms,Ds),K,d("div",{class:"spro-faixa"},Ho,gt.el,ht.el,bt.el),xe,ee,Co,go,...j?[j.faixa]:[],Do,oe,mt);let Et=()=>bn(r,l),re="",te=()=>_n(Et(),`${t.busca} ${re}`.trim(),O()),dr=()=>Jn(te(),t.ordem,O());function Q(u){t={...t,...u},u.busca===void 0?o.armazem.gravarVisao(t).catch(()=>{}):Cs(),W()}let ur;function Cs(){clearTimeout(ur),ur=setTimeout(()=>void o.armazem.gravarVisao(t).catch(()=>{}),400)}function Z(u,g){let h=d("div",{class:"spro-aviso",role:"status"},d("span",{},u));g&&h.append(d("button",{type:"button",class:"spro-link",onclick:()=>{g.fazer(),h.remove()}},g.rotulo)),h.append(d("button",{type:"button",class:"spro-aviso-x","aria-label":"Fechar aviso",onclick:()=>h.remove()},"\xD7")),mt.append(h),setTimeout(()=>h.remove(),g?9e3:6e3).unref?.()}function jo(u,g){let h=new Set(i);for(let b of u)g?h.add(b):h.delete(b);i=h,kn(e,h),gr(),ho()}let Ae=new Map;function Eo(u,g){let h=r.find(b=>b.id===u);if(h){let b=Ae.get(u)??{};for(let D of new Set([...Object.keys(h),...Object.keys(g)]))JSON.stringify(h[D])!==JSON.stringify(g[D])&&(b[D]=g[D]);Ae.set(u,b)}r=r.map(b=>b.id===u?g:b)}let St=Promise.resolve();function wt(u){Io+=1;let g=St.then(u,u);return St=g.catch(()=>{}).finally(()=>{Io-=1}),g}let pr=null,ye={raiz:T,extras:()=>(pr??=(o.extras?o.extras().then(u=>(M=u,u)):Promise.resolve({})).catch(u=>{throw pr=null,u}),pr),todos:()=>r,selecionados:()=>i,corDoMarcador:u=>r.flatMap(g=>g.marcadores).find(g=>g.nome===u)?.cor??"",autor:o.eu??"",aplicarLocal:(u,g)=>{Eo(u,g),W()},gravar:wt,atribuir:(u,g)=>o.mover.atribuir(u,g),marcar:(u,g)=>o.mover.marcador(u,g),anotar:(u,g)=>o.anotar(u,g),aviso:u=>Z(u)};async function ks(u,g,h){let b=r.find(F=>F.id===u);if(!b)return;let D=ts(t.quadro.colunas,b,g,h);if(!D.ok)return Z(D.motivo);let C=Object.fromEntries((M.responsaveis??[]).map(F=>[F.sigla,F.nome]));Eo(u,rt(b,D.movimento,C)),W(),Io+=1;let N=await w.mover(D.movimento).finally(()=>{Io-=1});if(!x){if(!N.ok)return Eo(u,b),W(),Z(`N\xE3o foi poss\xEDvel mover ${b.protocolo}: ${N.erro}`);Z(`${b.protocolo} movido.`,{rotulo:"Desfazer",fazer:()=>{let F=r.find(no=>no.id===u)??b;Eo(u,rt(F,N.desfazer,C)),W(),w.mover(N.desfazer).then(no=>{no.ok||x||(Eo(u,F),W(),Z(`N\xE3o foi poss\xEDvel desfazer: ${no.erro}`))})}})}}let Ls=cs(),mr=new Map([[Ro("recebidos",0),o.inicial.selecoes.recebidos],[Ro("gerados",0),o.inicial.selecoes.gerados],[Ro("detalhado",0),o.inicial.selecoes.detalhado]]),fr=o.inicial.visao==="detalhada";function Os(u){let g=r.filter(D=>i.has(D.id)),h=Ha(u);if(h?.requerSelecao&&!g.length)return Z("Marque ao menos um processo.");if(h&&!h.aceitaSigiloso&&Va(g))return Z("Opera\xE7\xE3o n\xE3o aplic\xE1vel em processo sigiloso.");let b=_a(g,mr,fr?"detalhada":"resumida");if(!b.ok)return Z(b.motivo);if(b.plano.todosNaPaginaAtual||!h){let D=On(u,g.length);!D.ok&&D.motivo&&Z(D.motivo);return}try{o.enviarAcao(h.url,b.plano)}catch(D){Z(`N\xE3o foi poss\xEDvel enviar a a\xE7\xE3o: ${D instanceof Error?D.message:String(D)}`)}}let Io=0,Ee=null,Se="",Pt=!1,Mt=u=>({linhas:u,colunas:t.colunas,densidade:t.densidade,ctx:O(),ordem:t.ordem,selecionados:i,foco:c,icones:g=>Ls(e,g),nomesCompletos:Pt,editando:Ee,rascunho:Se,semOrigem:fr,aoOrdenar:(g,h)=>Q({ordem:Wn(t.ordem,g,h)}),aoSelecionar:(g,h)=>jo([g],h),aoGrupo:g=>{let h=new Set(s);h.has(g)?h.delete(g):h.add(g),s=h,o.armazem.gravarRecolhidos([...h]).catch(()=>{}),ho()},aoMarcarGrupo:(g,h)=>jo(g,h),aoEditarEspec:g=>{Ee=g,Se=r.find(h=>h.id===g)?.especificacao??"",ho()},aoDigitarEspec:g=>{Se=g},aoCancelarEspec:()=>{Ee=null,ho()},aoSalvarEspec:g=>void Is(g),aoAbrirPrazo:g=>o.abrirPrazo(g),aoEditar:(g,h)=>{let b=r.find(D=>D.id===g);b&&(h==="responsavel"?ms(ye,b):h==="anotacao"?dt(ye,b):fs(ye,b))}}),we=hs(Mt([]));async function Is(u){let g=r.find(b=>b.id===u),h=Se.trim();if(Ee=null,!g||h===g.especificacao.trim())return ho();if(!h)return Z("A especifica\xE7\xE3o n\xE3o pode ficar vazia."),ho();Eo(u,{...g,especificacao:h}),W(),Io+=1;try{await o.editarEspecificacao(g.protocolo,h),Z(`Especifica\xE7\xE3o de ${g.protocolo} salva.`)}catch(b){Eo(u,g),W(),Z(`N\xE3o foi poss\xEDvel salvar a especifica\xE7\xE3o: ${b instanceof Error?b.message:String(b)}`)}finally{Io-=1}}async function $s(u,g){let h=r.find(N=>N.id===u);if(!h?.anotacao||h.sigiloso)return;let b=Po(h.anotacao.texto);if(b[g]?.marca==null)return;let D=Ie($e(b,g)),C=h.anotacao.prioridade;Eo(u,We(h,D,C,o.eu??"")),W();try{await wt(()=>o.anotar(h.protocolo,{texto:D,prioridade:C}))}catch(N){Eo(u,h),W(),Z(`N\xE3o foi poss\xEDvel atualizar a anota\xE7\xE3o: ${N instanceof Error?N.message:String(N)}`)}}function Rs(u){let g=t.quadro.colunasRecolhidas??[],h=g.includes(u)?g.filter(C=>C!==u):[...g,u],{colunasRecolhidas:b,...D}=t.quadro;Q({quadro:h.length?{...D,colunasRecolhidas:h}:D})}function ho(){let u=dr();if(t.modo==="quadro"){oe.replaceChildren(ns({processos:u,cfg:t.quadro,ctx:O(),extras:M,selecionados:i,aoMover:(h,b,D)=>void ks(h,b,D),aoSelecionar:(h,b)=>jo([h],b),aoAbrirPrazo:h=>o.abrirPrazo(h),aoReordenarColuna:(h,b,D)=>Q({quadro:{...t.quadro,ordemColunas:rs(D,h,b)}}),aoEditarAnotacao:h=>{let b=r.find(D=>D.id===h);b&&!b.sigiloso&&dt(ye,b)},aoAlternarTarefa:(h,b)=>void $s(h,b),aoAlternarColuna:h=>Rs(h)}));return}let g=Xe(u,t.agrupar,O());we.atualizar(Mt(Qn(g,s,t.agrupar!=="nenhum"))),oe.firstElementChild!==we.el&&oe.replaceChildren(we.el)}function Dt(u){let g=[`${u} de ${r.length} processo${r.length===1?"":"s"}`];re&&g.push(`filtro da pesquisa r\xE1pida: ${re}`);let h=o.inicial.totais.recebidos+o.inicial.totais.gerados;m&&f?g.push(`carregando ${f.grupo} (${f.paginasLidas}/${f.paginasTotal})\u2026`):!y&&h>r.length&&g.push(`o SEI informa ${h}; os demais n\xE3o foram carregados`),v&&g.push(`aviso: ${v}`),go.replaceChildren(g.join(" \xB7 ")),go.classList.toggle("spro-status-alerta",!!v||!y&&!m&&h>r.length)}function gr(){let u=i.size;if(Do.hidden=u===0,!u)return Do.replaceChildren();let g=new Set(te().map(b=>b.id)),h=[...i].filter(b=>!g.has(b)).length;Do.replaceChildren(d("strong",{},`${u} selecionado${u===1?"":"s"}`),...h?[d("span",{class:"spro-suave"},`(${h} fora do filtro atual)`)]:[],...o.acoes().map(b=>d("button",{type:"button",class:"spro-bt",title:b.rotulo,onclick:()=>Os(b)},d("img",{src:b.icone,alt:"",width:"16",height:"16"}),d("span",{},b.rotulo))),d("button",{type:"button",class:"spro-link",onclick:()=>jo([...i],!1)},"Limpar sele\xE7\xE3o"))}function Ns(){let u=Jr(t.busca);K.replaceChildren(...u.tokens.map(h=>d("span",{class:`spro-chip${h.termo.negado?" spro-chip-neg":""}`},h.texto,d("button",{type:"button","aria-label":`Remover ${h.texto}`,onclick:()=>{Q({busca:Qe(t.busca,h.texto)}),z.value=t.busca}},"\xD7")))),K.hidden=!u.tokens.length;let g=new Set(u.tokens.map(h=>h.texto));Ho.replaceChildren(...ul.filter(([,h])=>!(fr&&h.startsWith("grupo:"))).map(([h,b,D,C])=>d("button",{type:"button","data-tip":`${h}
${dl[b]??""}
Busca: ${b}${g.has(b)?`
Clique para desligar`:""}`,"aria-label":h,class:`spro-rapido${C?` spro-rapido-${C}`:""}${g.has(b)?" spro-rapido-on":""}`,"aria-pressed":String(g.has(b)),onclick:()=>{Q({busca:g.has(b)?Qe(t.busca,b):`${bs(b)?Qe(t.busca,bs(b)):t.busca} ${b}`.trim()}),z.value=t.busca}},"comum"in D?q(D.comum,14,e):so(D.grade,14,e),d("span",{class:"spro-rapido-rotulo"},h)))),Ct()}let So=R.shadowRoot.querySelector(".spro-faixa");function Ct(){x||(So.classList.remove("spro-faixa-c1","spro-faixa-c2"),So.clientWidth&&(So.scrollWidth>So.clientWidth+1&&So.classList.add("spro-faixa-c1"),So.scrollWidth>So.clientWidth+1&&So.classList.add("spro-faixa-c2")))}let kt=e.defaultView?.ResizeObserver,Lt=kt?new kt(()=>Ct()):null;Lt?.observe(So);let Ot=new Map,It=new Set,$t=u=>`${u.id}|${u.marcadores.map(g=>g.nome).join("|")}`;function Rt(u){if(u.marcadores.length<=1)return u;let g=Ot.get(u.id);if(!g)return u;let h=!1,b=u.marcadores.map(D=>{if(D.dataHora!==void 0)return D;let C=g[X(D.nome)];return C===void 0?D:(h=!0,{...D,dataHora:C})});return h?{...u,marcadores:b}:u}function Ts(){if(!o.consultarDatasMarcadores||x||!(t.modo==="quadro"&&t.quadro.colunas==="marcador"||t.modo==="tabela"&&t.agrupar==="marcador"))return;let g=r.filter(C=>C.marcadores.length>1&&C.linkMarcadores&&!It.has($t(C)));if(!g.length)return;for(let C of g)It.add($t(C));let h=[...g],b=Math.min(4,h.length),D=async()=>{for(;h.length&&!x&&!I.signal.aborted;){let C=h.shift(),N=await o.consultarDatasMarcadores(C,I.signal).catch(()=>null);!N||x||(Ot.set(C.id,N),r=r.map(F=>F.id===C.id?Rt(F):F),W())}};for(let C=0;C<b;C++)D()}function W(){if(x)return;be=Zr(Et(),O());for(let g of[gt,ht,bt])g.atualizar();cr.definir([t.agrupar],!1),cr.el.disabled=t.modo==="quadro",ft.definir([t.ordem[0]?`${t.ordem[0].campo}:${t.ordem[0].decrescente?"d":"a"}`:""],!1);for(let g of xt.querySelectorAll("[data-modo]"))g.setAttribute("aria-pressed",String(g.getAttribute("data-modo")===t.modo));yt.title=t.densidade==="compacta"?"Linhas confort\xE1veis":"Linhas compactas",At.hidden=t.modo==="quadro",zs(),Ns(),j?.definirAtivo(ge(t.agrupar)&&t.modo==="tabela"),ho(),Dt(te().length),gr(),Ts(),t.modo==="quadro"&&!E&&o.extras&&(E=!0,o.extras().then(g=>{M=g,x||ho()}).catch(()=>{}))}function zs(){if(xe.hidden=t.modo!=="quadro",xe.hidden)return;let u=t.quadro,g=ko({rotulo:"Colunas do quadro",icone:"mapa",classe:"spro-combo-compacto",busca:!1,opcoes:[{valor:"marcador",rotulo:"Colunas: marcador"},{valor:"responsavel",rotulo:"Colunas: respons\xE1vel"},{valor:"prazo",rotulo:"Colunas: prazo (leitura)"},{valor:"tipo",rotulo:"Colunas: tipo (leitura)"}],valor:[u.colunas],aoMudar:([eo])=>{E=!1,Q({quadro:{...u,colunas:eo??"marcador"}})}}),h=d("input",{type:"number",min:"0",max:"99",class:"spro-num",value:String(u.limite),"aria-label":"Limite de cart\xF5es por coluna (0 = sem limite)",title:"Limite de cart\xF5es por coluna (0 = sem limite)",onchange:eo=>Q({quadro:{...u,limite:Math.max(0,Math.min(99,Number(eo.target.value)||0))}})}),b=d("input",{type:"checkbox",onchange:eo=>Q({quadro:{...u,raiasPorResponsavel:eo.target.checked}})});b.checked=u.raiasPorResponsavel;let D=u.larguraColuna??280,C=eo=>{let Go=Math.max(200,Math.min(500,Math.round(eo)));Q({quadro:{...t.quadro,larguraColuna:Go}})},N=d("span",{class:"spro-largura-val"},`${D}px`),F=d("input",{type:"range",min:"200",max:"500",step:"20",value:String(D),class:"spro-largura-range","aria-label":"Largura das colunas",title:"Ajustar largura das colunas e cart\xF5es",oninput:eo=>{let Go=Number(eo.target.value)||280;N.textContent=`${Go}px`,oe.querySelector(".spro-quadro")?.style.setProperty("--spro-col-largura",`${Go}px`)},onchange:eo=>C(Number(eo.target.value)||280)}),no=d("div",{class:"spro-largura-ctrl"},d("span",{},"Largura"),d("button",{type:"button",class:"spro-largura-bt","aria-label":"Diminuir largura das colunas",title:"Diminuir largura das colunas",onclick:()=>C(D-20)},"\u2212"),F,d("button",{type:"button",class:"spro-largura-bt","aria-label":"Aumentar largura das colunas",title:"Aumentar largura das colunas",onclick:()=>C(D+20)},"+"),N),ae=u.ordemColunas?.length?d("button",{type:"button",class:"spro-link",title:"Voltar \xE0 ordena\xE7\xE3o autom\xE1tica das colunas",onclick:()=>{let{ordemColunas:eo,...Go}=t.quadro;Q({quadro:Go})}},"Restaurar ordem"):null;xe.replaceChildren(g.el,d("label",{class:"spro-rotulo-inline"},"Limite ",h),no,d("label",{class:"spro-rotulo-inline"},b," Raias por respons\xE1vel"),...ae?[ae]:[],d("span",{class:"spro-suave"},u.colunas==="marcador"||u.colunas==="responsavel"?"Arraste cart\xF5es ou cabe\xE7alhos das colunas.":"Arraste os cabe\xE7alhos para reordenar as colunas."))}function Fo(u){if(!Co.hidden&&Co.getAttribute("data-qual")===u){Co.hidden=!0;return}if(Co.setAttribute("data-qual",u),Co.hidden=!1,u==="colunas"){Co.replaceChildren(d("strong",{},"Colunas"),...de.map(C=>{let N=d("input",{type:"checkbox",disabled:C==="processo"});return N.checked=t.colunas.includes(C),N.addEventListener("change",()=>{let F=N.checked?de.filter(no=>no===C||t.colunas.includes(no)):t.colunas.filter(no=>no!==C);Q({colunas:F})}),d("label",{class:"spro-rotulo-linha"},N,` ${Qo[C]}`)}),d("button",{type:"button",class:"spro-link",onclick:()=>Q({colunas:Xo().colunas})},"Restaurar padr\xE3o"));return}let g=d("input",{type:"text",class:"spro-nome",maxlength:"40",placeholder:"Nome da vis\xE3o","aria-label":"Nome da vis\xE3o"}),h=a.find(C=>C.id===n);g.value=h?.nome??"";let b=async(C,N=a)=>{a=C,await o.armazem.gravarVisoes(C,N).catch(()=>Z("N\xE3o foi poss\xEDvel sincronizar as vis\xF5es."))},D=async C=>{let N={...t,nome:g.value.trim()||"Minha vis\xE3o",id:C==="atualizar"?n:""},F=xn(a,N,o.novoId);if(!F)return Z("Limite de vis\xF5es salvas atingido.");n=F.visao.id,await b(F.lista),Z(`Vis\xE3o "${F.visao.nome}" salva.`),Fo("visoes"),Fo("visoes")};Co.replaceChildren(d("strong",{},"Vis\xF5es salvas"),a.length?d("ul",{class:"spro-lista-visoes"},...a.map(C=>d("li",{},d("button",{type:"button",class:`spro-link${C.id===n?" spro-ativa":""}`,onclick:()=>{n=C.id,z.value=C.busca,Q({...C,id:""})}},C.nome),d("button",{type:"button",class:"spro-aviso-x","aria-label":`Excluir ${C.nome}`,title:"Excluir",onclick:async()=>{await b(An(a,C.id),a),n===C.id&&(n=""),Fo("visoes"),Fo("visoes")}},"\xD7")))):d("p",{class:"spro-suave"},"Nenhuma vis\xE3o salva ainda."),d("div",{class:"spro-linha-form"},g,d("button",{type:"button",class:"spro-bt",onclick:()=>void D("nova")},"Salvar como nova"),h&&yn(t,h)?d("button",{type:"button",class:"spro-bt",onclick:()=>void D("atualizar")},"Atualizar"):null))}function _s(){let u=e.defaultView?.location,g=u&&/^https?:$/i.test(u.protocol)?`${u.origin}${u.pathname}`:"",h=Fn(e.defaultView?.localStorage),b=Gn(dr(),O(),{urlBase:g,recebimentos:h});o.baixar(Bn(o.agora()),Un(b),"text/csv;charset=utf-8"),Z(`${b.length-1} processos exportados.`)}z.addEventListener("input",()=>{let u=z.value;if(o.semDebounce)return Q({busca:u});clearTimeout(P),P=setTimeout(()=>Q({busca:u}),120)}),z.addEventListener("keydown",u=>{u.key==="Escape"&&(z.value="",Q({busca:""}),z.blur())});function Nt(u){if(x||u.ctrlKey||u.metaKey||u.altKey)return;let g=u.target;if(g&&(/^(input|textarea|select)$/i.test(g.tagName)||g.isContentEditable)||R.hidden)return;let b=u.key;if(A){A=!1,b==="t"?Q({modo:"tabela"}):b==="q"&&Q({modo:"quadro"});return}let D=dr().map(N=>N.id),C=c?D.indexOf(c):-1;if(b==="/")u.preventDefault(),z.focus();else if(b==="?")ee.hidden=!ee.hidden;else if(b==="g")A=!0;else if(b==="Escape")i.size&&jo([...i],!1);else if((b==="j"||b==="k")&&t.modo==="tabela"&&D.length)c=D[Math.max(0,Math.min(D.length-1,C+(b==="j"?1:-1)))],ho(),we.mostrar(c);else if(b==="x"&&c)r.find(F=>F.id===c)&&jo([c],!i.has(c));else if(b==="Enter"&&c){let N=r.find(F=>F.id===c)?.link;N&&e.defaultView?.location.assign(N)}}e.addEventListener("keydown",Nt);let qs=Ln(e,u=>{i=u,gr(),ho()}),Vs=o.armazem.aoMudarVisoes(()=>void o.armazem.lerVisoes().then(u=>{a=u}).catch(()=>{})),hr=new Map;function br(){if(x||Io>0)return;let u=Bo(e),g=new Map(u.processos.map(b=>[b.id,b])),h=!1;r=r.map(b=>{if(!b.naPaginaAtual)return b;let D=g.get(b.id);if(!D)return b;let C=Ae.get(b.id),N=nt(e,b.id),F=hr.get(b.id);hr.set(b.id,N);let no=Rt(D);if(C){for(let eo of Object.keys(C))JSON.stringify(D[eo])===JSON.stringify(C[eo])&&delete C[eo];Object.keys(C).length?no={...D,...C}:Ae.delete(b.id)}let ae=JSON.stringify(no)===JSON.stringify(b);return ae&&F===N?b:(h=!0,ae?b:no)}),h&&(Ar(),W())}let vr,Tt=e.defaultView?.MutationObserver,xr=Tt?new Tt(()=>{clearTimeout(vr),vr=setTimeout(br,o.semDebounce?0:150)}):null,zt=e.querySelector("#frmProcedimentoControlar")??e.body;xr&&zt&&xr.observe(zt,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["aria-pressed","aria-label","onmouseover","src","href","class"]});function Ar(){let u=ls(e);$.textContent!==u&&($.textContent=u)}async function Hs(){if(!o.fonte)return y=!0,_t(!0);m=!0,W();let u=()=>o.fonte?.restaurarAoSair?.();e.defaultView?.addEventListener("pagehide",u);let g=await pn(o.inicial,o.fonte,{sinal:I.signal,aoProgresso:h=>{f=h,Dt(te().length)},aoSelecao:(h,b,D)=>{mr.set(Ro(h,b),D)},aoPagina:h=>{r=[...r,...h],W()}});e.defaultView?.removeEventListener("pagehide",u),m=!1,y=g.completo,g.erro&&(v=g.erro),_t(g.completo)}function _t(u){l=jr(l,r.map(g=>g.id),o.agora(),u),o.armazem.gravarIdade(l).catch(()=>{}),W()}async function js(){try{let u=await o.armazem.lerEstado();t=u.visao,s=new Set(u.recolhidos),l=hn(u.idade,o.agora()),p=l.visitaAnterior,a=await o.armazem.lerVisoes()}catch{}l=jr(l,r.map(u=>u.id),o.agora(),!1),j&&await j.carregar(),z.value=t.busca,Ar();for(let[u]of r.map(g=>[g.id]))hr.set(u,nt(e,u));W(),Hs();for(let u of[1200,3500])setTimeout(()=>{Ar(),br()},u).unref?.()}return{host:R,iniciar:js,render:W,estado:()=>({visao:t,todos:r,selecionados:i,completo:y,carregando:m,filtrados:te().length}),definirVisao:u=>{t={...t,...u},z.value=t.busca,W()},fechar(){x=!0,I.abort(),j?.fechar(),clearTimeout(P),clearTimeout(ur),clearTimeout(vr),xr?.disconnect(),Lt?.disconnect(),G(),e.removeEventListener("keydown",Nt),qs(),Vs(),R.remove()},mostrar:u=>{R.hidden=!u},definirTema:u=>{R.setAttribute("data-tema",u?"escuro":"claro"),L.classList.toggle("spro-escuro",u)},definirNomesCompletos:u=>{Pt=u,W()},definirFiltroExterno:u=>{let g=u.trim();g!==re&&(re=g,W())},sincronizar:br,registrarSelecaoParaTeste:(u,g,h)=>void mr.set(Ro(u,g),h)}}var xs=`/* Dentro do Shadow DOM: o base.css do sei-comum (tokens) vem antes deste arquivo. */
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
`;var As=`/* Na p\xE1gina do SEI (fora do Shadow DOM): o bot\xE3o alternador e o espa\xE7o da grade. */
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
`;var fl="gradecontrole",ys="data-spro-pesquisa-rapida";function gl(){return new URL(location.href).searchParams.get("acao")==="procedimento_controlar"}var Yo=()=>{let o=Gt(document);return o?o==="escuro":!!document.body?.classList.contains("dark-mode")||Ft(localStorage)},sr=null,Ao=!1,B=null,yo=null,Zo=null,Es=0,ut=!1,nr=null,Ss=null,Vo=null,pt=document.readyState!=="loading";function hl(){let o=document.querySelector(dn);return document.getElementById("divTabelaProcesso")??o?.parentElement??null}function Oo(o){yo?.pronta(),B?.mostrar(!1),_e(document),o&&o!=="usuario"&&console.warn("[SEI Pro] Grade do controle indispon\xEDvel, usando a vis\xE3o nativa:",o)}function ir(){if(B||!Ao)return;let o=new Oe(location.href,()=>ce(document,location.href)),e=Lr(ce(document,location.href)),r=e.unidade.id,t=Sn({local:yr(chrome.storage.local,"local"),sync:yr(chrome.storage.sync,"sync")},String(r),e.usuario.login);if(["hdnRecebidosPaginaAtual","hdnGeradosPaginaAtual","hdnDetalhadoPaginaAtual"].some(c=>document.getElementById(c)?.value&&document.getElementById(c).value!=="0")&&!sessionStorage.getItem("spro_grade_reset")){try{sessionStorage.setItem("spro_grade_reset","1")}catch{}Vr(o.http,ce(document,location.href)).restaurar().then(()=>location.reload()).catch(()=>Oo("pagina intermediaria"));return}try{sessionStorage.removeItem("spro_grade_reset")}catch{}let n=Bo(document);if(!n.processos.length&&!n.totais.recebidos&&!n.totais.gerados)return yo?.pronta(),Oo("caixa vazia");let s=hl();if(!s)return Oo("sem ponto de encaixe");let i=n.processos.filter(c=>!c.sigiloso&&c.naPaginaAtual).slice(0,6).map(c=>c.protocolo);B=vs({doc:document,inicial:n,agora:()=>Date.now(),hoje:()=>Uo(),eu:e.usuario.login||void 0,armazem:t,fonte:Vr(o.http,ce(document,location.href),n.visao),mover:{marcador:async(c,l)=>void await Pa(o,c,l,{aplicar:!0}),atribuir:async(c,l)=>void await wa(o,c,l,{aplicar:!0})},acoes:()=>ja(document),css:`${Qt}
${xs}`,escuro:Yo(),baixar:(c,l,p)=>Jt(c,l,p),novoId:()=>Bt(),extras:i.length?async()=>{let c=async f=>{let m;for(let y of i)try{return await fa(o,f,y)}catch(v){m=v}return console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${f}`,m instanceof Error?m.message:m),[]},[l,p]=await Promise.all([c("marcadores"),c("usuarios")]);return{marcadores:l.map(f=>f.nome),responsaveis:p.map(f=>{let[m,...y]=f.nome.split(" - ");return{sigla:m.trim(),nome:y.join(" - ").trim()||m.trim()}})}}:void 0,aoVoltarNativa:()=>he(),enviarAcao:(c,l)=>qa(document,c,l),editarEspecificacao:async(c,l)=>void await ba(o,c,{especificacao:l},{aplicar:!0}),abrirPrazo:c=>{document.documentElement.setAttribute("data-spro-prazos-alvo",c),document.dispatchEvent(new CustomEvent("spro-prazos-abrir"))},anotar:async(c,l)=>void await Sa(o,c,l,{aplicar:!0}),consultarAndamento:(c,l)=>$a(o,c,{sigla:e.unidade.sigla,nome:e.unidade.nome},l),consultarDatasMarcadores:(c,l)=>un(o,c,l)}),B.definirNomesCompletos(ut),bl(B),Ss?.(),Ss=Ut(document,()=>B?.definirTema(Yo())),s.before(B.host),Fa(document,B.host),vl(),B.iniciar().then(()=>{yo?.pronta(),To(document)&&Tr(document)}).catch(c=>Oo(String(c)))}function bl(o){Vo?.disconnect();let e=()=>o.definirFiltroExterno(document.documentElement.getAttribute(ys)??"");e(),Vo=new window.MutationObserver(e),Vo.observe(document.documentElement,{attributes:!0,attributeFilter:[ys]})}function vl(){nr?.disconnect();let o=window.MutationObserver,e=!1;nr=new o(()=>{e||(e=!0,setTimeout(()=>{if(e=!1,!(!B||!Ao||B.host.isConnected&&!!B.host.shadowRoot&&document.querySelectorAll("#spro-grade").length===1||Es>=6)){Es+=1,B.fechar(),B=null,Vo?.disconnect(),Vo=null;for(let t of document.querySelectorAll("#spro-grade"))t.remove();(To(document)||Ao)&&ir()}},150))}),nr.observe(document.body??document.documentElement,{childList:!0,subtree:!0})}function he(){sr&&(To(document)?(Ao=!1,Te(localStorage,!1),B?.mostrar(!1),_e(document)):(Ao=!0,Te(localStorage,!0),ze(document,Yo()),B&&B.host.isConnected&&B.host.shadowRoot?(B.mostrar(!0),Tr(document)):(B&&(B.fechar(),B=null),yo=qe(Oo),yo.iniciarContagem(),ir())),Zo?.(),Zo=He(document,()=>To(document),he))}function xl(o){o!==sr&&(sr=o,o?(pt&&(Zo??=He(document,()=>To(document),he)),Ao&&(ze(document,Yo()),yo??=qe(Oo),pt&&(yo.iniciarContagem(),ir()))):(Ao=!1,Te(localStorage,!1),Zo?.(),Zo=null,nr?.disconnect(),Vo?.disconnect(),Vo=null,B?.fechar(),B=null,yo?.pronta(),_e(document)))}function Al(){if(!gl())return;let o=document.createElement("style");o.textContent=As,(document.head??document.documentElement).append(o),Ka(localStorage)&&(Ao=!0,ze(document,Yo()),yo=qe(Oo)),Za(document,he),Xa(document,Yo);let e=()=>{pt=!0,Ao&&(yo?.iniciarContagem(),ir()),sr&&(Zo??=He(document,()=>To(document),he))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e();let r=a=>{ut=jt(a,"nomesusuarios"),B?.definirNomesCompletos(ut),xl(Ht(a,fl))},t=!1;chrome.storage.onChanged.addListener((a,n)=>{n!=="sync"||!("dataValues"in a)||(t=!0,r(a.dataValues.newValue))}),chrome.storage.sync.get("dataValues").then(a=>{t||r(a.dataValues)}).catch(()=>{Ao&&Oo("sem prefer\xEAncias")})}Al();})();
