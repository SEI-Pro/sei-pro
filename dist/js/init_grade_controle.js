/* GERADO por grade-controle/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{function Os(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function fr(o,e){return{obter:async(r=null)=>await o.get(r),gravar:async r=>{await o.set(r)},remover:async r=>{await o.remove(r)},chaves:typeof o.getKeys=="function"?async()=>await o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Os(a))};try{chrome.storage.onChanged.addListener(t)}catch{}return()=>{try{chrome.storage.onChanged.removeListener(t)}catch{}}}}}var Ct=o=>String(o).padStart(2,"0");function Fo(o=new Date){return`${o.getFullYear()}-${Ct(o.getMonth()+1)}-${Ct(o.getDate())}`}function ye(o){let e=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!e)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(e[1]),Number(e[2])-1,Number(e[3]),12)}function Io(o,e){return Math.round((ye(e).getTime()-ye(o).getTime())/864e5)}function lo(o){let[e,r,t]=o.split("-");return`${t}/${r}/${e}`}function Ot(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function Lt(o,e){let r=Ot(o,e);return!(r===!1||r===0||r==="")}function kt(o,e){let r=Ot(o,e);return r===!0||r===1||r==="1"}function It(o){try{return!!o.getItem("darkModePro")}catch{return!1}}function $t(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function Rt(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function"||!o.documentElement)return()=>{};let t=new r(e);return t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),()=>t.disconnect()}function Tt(o=crypto){if(typeof o.randomUUID=="function")return o.randomUUID();let e=o.getRandomValues(new Uint8Array(16));e[6]=(e[6]??0)&15|64,e[8]=(e[8]??0)&63|128;let r=[...e].map(t=>t.toString(16).padStart(2,"0")).join("");return`${r.slice(0,8)}-${r.slice(8,12)}-${r.slice(12,16)}-${r.slice(16,20)}-${r.slice(20)}`}var Nt=`/*
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
`;function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var po={fill:"currentColor",stroke:"none"},zt="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",_t={estrela:[["path",{d:zt}]],estrelaCheia:[["path",{d:zt,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...po}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...po}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...po}],["circle",{cx:"12",cy:"12",r:"1.4",...po}],["circle",{cx:"19",cy:"12",r:"1.4",...po}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...po}],["circle",{cx:"15",cy:"6",r:"1.3",...po}],["circle",{cx:"9",cy:"12",r:"1.3",...po}],["circle",{cx:"15",cy:"12",r:"1.3",...po}],["circle",{cx:"9",cy:"18",r:"1.3",...po}],["circle",{cx:"15",cy:"18",r:"1.3",...po}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},al=Object.keys(_t);function _(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of _t[o]){let c=r.createElementNS(t,s);for(let[l,u]of Object.entries(i))c.setAttribute(l,u);a.append(c)}return a}function qt(o,e,r,t=1e4){let a=URL.createObjectURL(new Blob([e],{type:r})),n=d("a",{href:a,download:o});document.body.append(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(a),t).unref?.()}var C=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function gr(o){if(o instanceof C)return o;if(o instanceof DOMException&&o.name==="AbortError")return new C("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new C("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}var ks={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function K(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):ks[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Vt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Ht=null;function Ee(o){return Ht?Ht(o):new DOMParser().parseFromString(o,"text/html")}function q(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var Is={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function hr(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Is[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function Se(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=hr(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function Eo(o,e){let r=[],t=new RegExp(`\\b${e}\\(`,"g");for(let a of o.matchAll(t)){let[n]=Se(o,a.index+a[0].length);r.push(n)}return r}function V(o){return typeof o=="string"?K(o):o==null?"":String(o)}var $s=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function So(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll($s))e.add(r[0]);return[...e]}function Y(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function ro(o,e,r={}){let t=Array.isArray(o)?o:So(o);for(let a of t){let n=Y(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function Ft(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=So(r).filter(s=>Y(s).get("acao")===e),n=(t.length?t:So(o.html).filter(s=>Y(s).get("acao")===e)).sort((s,i)=>[...Y(s).keys()].length-[...Y(i).keys()].length)[0];if(!n)throw new C("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Rs(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=Se(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=hr(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Ts(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=Se(o,r.index+r[0].length);e.push({tipo:V(t[0]),idPai:V(t[2]),href:V(t[3]),titulo:V(t[5]),icone:V(t[6]),extra:t[8]==null?void 0:V(t[8])})}return e}function jt(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Gt(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>V(e[1])))]}var Ns=/\s*\(\d{5,}\)\s*$/;function zs(o){let e=o.html,r=Rs(e),t=Ts(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new C("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=V(a.args[1]),s=jt(t,n),i=r.filter(c=>c.args[0]==="DOCUMENTO").map(c=>{let l=V(c.args[1]),u=V(c.args[5]),g=V(c.args[7]),m=(c.props.src??"").replace(/&amp;/g,"&"),A=t.find(b=>b.tipo==="ASSINATURA"&&b.idPai===l),{nivel:y,hipotese:M}=jt(t,l),E=(/documento_([a-z0-9]+)\.svg/.exec(g)?.[1]??"interno").replace("cancelado","interno");return{id:l,numero:V(c.args[15])||(/\((\d{5,})\)\s*$/.exec(u)?.[1]??""),titulo:u.replace(Ns,""),pasta:c.args[2]&&String(c.args[2]).startsWith("PASTA")?String(c.args[2]):null,externo:/documento_download_anexo/.test(m)||!/documento_interno|documento_cancelado|formulario|email/.test(g),formato:E,nivel:y,hipotese:M,assinado:!!A,assinaturas:A?A.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(g),unidadeGeradora:t.find(b=>b.tipo==="UNIDADE_GERADORA"&&b.idPai===l)?.extra,link:V(c.args[3]).replace(/&amp;/g,"&"),src:m,acoes:So(c.props.acoes??""),botoes:Gt(c.props.acoes??"")}});return{idProcedimento:n,protocolo:V(a.args[5])||V(a.args[15]),tipo:V(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:So(a.props.acoes??""),botoesProcesso:Gt(a.props.acoes??""),linkProcesso:V(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:So(e),pagina:o}}async function Ut(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new C("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=ro(t.html,"procedimento_visualizar")&&So(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return zs(t)}function go(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?ro(t.acoes,e):null}return ro(o.acoesProcesso,e)??ro(o.links,e,{id_procedimento:o.idProcedimento})}function io(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var re={publico:"0",restrito:"1"},we={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function te(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(K(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Kt="\xA5",br="\xB1";function Bt(o){return o.map(e=>`${e.id}${br}${e.texto}`).join(Kt)}function _s(o){return o?o.split(Kt).map(e=>{let[r,...t]=e.split(br);return{id:r,texto:t.join(br)}}):[]}function Qt(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var j=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=qs(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,q(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Xt(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??q(t),texto:q(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=oo(r),n=t.find(s=>s.valor===r)??t.find(s=>oo(s.texto)===a)??vr(t.filter(s=>oo(s.texto).includes(a)));if(!n)throw new C("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?_s(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Bt(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new C("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new C("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new C("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${q(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??vr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??q(r)??e]:[e,e]}hiddenDaLupa(e){let r=Qt(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Qt(this.pagina.html)){let t=this.elemento.querySelector(`select#${Xt(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:q(n)}));(this.valor(r)??"")||this.definir({[r]:Bt(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function qs(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(l=>l.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let l of c)e.push({nome:t,valor:l.getAttribute("value")??q(l)})}}return e}function oo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function xr(o,e,r){let t=oo(e),a=o.find(n=>n.id===e)??o.find(n=>oo(n.texto)===t)??vr(o.filter(n=>oo(n.texto).includes(t)));if(!a)throw new C("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function vr(o){return o.length===1?o[0]:void 0}function Xt(o){return o.replace(/([^\w-])/g,"\\$1")}var Vs={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Pe(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Vs[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var Hs=/[A-Za-z0-9\-_.*]/;function Jt(o){let e="";for(let r of o)r===" "?e+="+":Hs.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Wt(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${Jt(Pe(r))}=${Jt(Pe(t??"",a))}`}).join("&")}function Zt(o){let e=r=>encodeURIComponent(Pe(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var Yt="application/x-www-form-urlencoded";function Ar(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=Vt[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var oa="application/x-www-form-urlencoded; charset=ISO-8859-1";async function Fs(o,e,r){let t=go(e,"documento_escolher_tipo");if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await j.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=j.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function js(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,q(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=Y(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,q(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function ea(o,e,r){let t=await o.arvore(e,{sinal:r});return js((await Fs(o,t,r)).pagina)}var ra={tipos_processo:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selTipoProcedimento"},hipoteses_legais:{acao:"procedimento_alterar",form:"#frmProcedimentoCadastro",campo:"selHipoteseLegal"},usuarios:{acao:"procedimento_atribuicao_cadastrar",form:"#frmAtividadeAtribuir",campo:"selAtribuicao"},marcadores:{acao:"andamento_marcador_gerenciar",form:"#frmAndamentoMarcadorCadastro",campo:"selMarcador"},grupos_acompanhamento:{acao:"acompanhamento_gerenciar",form:"#frmAcompanhamentoCadastro",campo:"selGrupoAcompanhamento"}};async function ta(o,e,r,t={}){let a;if(e==="tipos_documento")a=(await ea(o,r,t.sinal)).map(s=>({id:s.id,nome:s.nome}));else{let s=ra[e];if(!s)throw new C("ARGUMENTO_INVALIDO",`Lista desconhecida: ${e}.`,Object.keys(ra).concat("tipos_documento").join(" | "));let i=await o.arvore(r,{sinal:t.sinal}),c=go(i,s.acao);if(!c)throw new C("SEI_ACAO_INDISPONIVEL",`Para listar ${e} use um processo aberto na sua unidade.`);if(e==="marcadores"&&(c=ro((await o.http.obter(c,{sinal:t.sinal,aceitarValidacao:!0})).html,"andamento_marcador_cadastrar"),!c))throw new C("SEI_VERSAO_NAO_SUPORTADA","Tela de marcadores n\xE3o reconhecida.");let l=await j.abrir(o.http,c,s.form,{sinal:t.sinal,aceitarValidacao:!0});a=e==="hipoteses_legais"?(await te(o,l,"1",t.sinal)).map(u=>({id:u.id,nome:u.texto})):l.opcoes(s.campo).filter(u=>u.valor&&u.valor!=="null"&&u.texto).map(u=>({id:u.valor,nome:u.texto}))}let n=t.filtro?oo(t.filtro):"";return n?a.filter(s=>oo(s.nome).includes(n)):a}function aa(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function Gs(o,e,r){let t=go(e,"procedimento_alterar"),a=t??go(e,"procedimento_consultar");if(!a)throw new C("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await j.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function na(o){return o.map(e=>e.texto).filter(Boolean)}async function sa(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await Gs(o.http,a,{sinal:t.sinal});if(!s)throw new C("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...io("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let l=aa(n,"selTipoProcedimento"),u=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:u.valor}),i.push(...io("Tipo",l,u.texto))}if(r.nivel!==void 0){let l=we[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:re[r.nivel]}),i.push(...io("N\xEDvel de acesso",l,we[re[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let l=aa(n,"selHipoteseLegal"),u=n.valor("rdoNivelAcesso")||re.restrito,g=xr(await te(o,n,u,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:g.id}),i.push(...io("Hip\xF3tese legal",l,g.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new C("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(i.push(...io("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(i.push(...io("Interessados",na(n.itensLupa("selInteressadosProcedimento")).join("; "),na(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:l=>Y(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}async function ca(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function la(o,e,r){let t=go(o,e);if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var da=o=>e=>Y(e.url).get("acao")!==o;async function Us(o,e,r,t){let a=await o.http.obter(la(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return j.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>ro(a.html,s)).find(Boolean);if(!n)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return j.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function pa(o,e,r,t){let a=await ca(o,e,t.sinal),n=await Us(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??da(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function ua(o,e,r,t){return pa(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=io("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...io("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function ma(o,e,r,t){return pa(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(l=>l.valor===a.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=oo(r),i=a.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=i.find(l=>l.valor===r)??i.find(l=>oo(l.texto.split(" - ")[0])===s)??i.find(l=>oo(l.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(l=>oo(l.texto).includes(s)).length===1?i.find(l=>oo(l.texto).includes(s)):void 0);if(!c)throw new C("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(l=>l.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),io("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}async function Bs(o,e,r){let t=la(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function ia(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:q(t[1]),texto:q(t[2]),usuario:q(t[3]),data:q(t[4])}})}async function fa(o,e,r,t){let a=await ca(o,e,t.sinal),n=await Bs(o,a,t.sinal),s=ia(n),i=oo(r.marcador),c=s.find(m=>oo(m.marcador)===i),l={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...l,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=ro(n.html,"andamento_marcador_remover");if(!m)throw new C("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let A=j.de(n,"#frmGerenciarMarcador",o.http);A.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let y=await o.http.enviar(m,A.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(ia(y).some(M=>M.id===c.id))throw new C("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let u;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))u=j.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=ro(n.html,"andamento_marcador_cadastrar");if(!m)throw new C("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");u=await j.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let g=u.escolher("selMarcador",r.marcador);return u.definir({hdnIdMarcador:g.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?io(`Texto do marcador ${g.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${g.texto}${r.texto?`: ${r.texto}`:""}`}],l.mudancas.length?t.aplicar?(await u.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:da("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${g.texto}" aplicado em ${a.protocolo}.`}):{...l,resumo:`Vai marcar ${a.protocolo} com "${g.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}var Qs={resumido:"R",completo:"P",total:"T"};function ga(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(q(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(a=>{let n=[...a.querySelectorAll("td")],s=n[1]?.querySelector("a")?.getAttribute("title")??"";return{data:q(n[0]),unidade:q(n[1]),...s?{unidadeNome:s}:{},usuario:q(n[2]),descricao:q(n[3])}}),total:r}}async function ha(o,e,r={}){let t=r.limite??500,a=await o.http.obter(e,{sinal:r.sinal}),n=Qs[r.tipo??"resumido"];n!=="R"&&(a=await j.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:"0"}).enviar({sinal:r.sinal}));let{itens:s,total:i}=ga(a),c=[...s];for(let l=1;c.length<Math.min(i,t)&&s.length>0;l+=1)a=await j.de(a,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:n,hdnInfraPaginaAtual:String(l)}).enviar({sinal:r.sinal}),{itens:s}=ga(a),c.push(...s);return{total:i||c.length,andamentos:c.slice(0,t)}}function ba(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}`:void 0}var Xs=["Processo recebido na unidade","Reabertura do processo na unidade"],va=/^Processo (?:p\u00FAblico|restrito|sigiloso) gerado/i,Ks=/^Processo remetido pela unidade\s+(.+)$/i;function Js(o,e){return o.unidade.trim()===e.sigla.trim()&&e.sigla.trim()?!0:!!e.nome?.trim()&&o.unidadeNome?.trim()===e.nome.trim()}function xa(o,e){let r=typeof e=="string"?{sigla:e}:e,t={},a=o.filter(i=>va.test(i.descricao.trim())),n=a[a.length-1],s=n?ba(n.data):void 0;s&&(t.autuacao=s);for(let i of o){if(!Js(i,r))continue;let c=i.descricao.trim(),l=ba(i.data);if(l&&(!t.recebimento&&(Xs.includes(c)||va.test(c))&&(t.recebimento=l),!t.envio)){let u=Ks.exec(c);u&&(t.envio=l,t.unidadeEnvio=u[1].trim())}}return t}var yr=[["hoje","Hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["trimestre","Nos \xFAltimos 90 dias"],["antigo","H\xE1 mais de 90 dias"],["sem","Sem informa\xE7\xE3o"]];function Aa(o,e){if(!o)return"sem";let r=Io(o,e);return Number.isNaN(r)||r<0?"sem":r<1?"hoje":r<=7?"semana":r<=30?"mes":r<=90?"trimestre":"antigo"}var Er=1440*6e4,ae=(o,e)=>e-o.consultadoEm>=0&&e-o.consultadoEm<Er;var Me=class extends Error{sessao=!0},Ws=2,Zs=250,Ys=5,oi=o=>new Promise(e=>setTimeout(e,o));async function ya(o){let e=[...o.alvos],r=o.esperar??oi,t={feitos:0,total:e.length,semDados:0},a="concluida",n=0,s=o.limiteErros??Ys;async function i(){for(;a==="concluida";){if(o.sinal.aborted){a="cancelada";return}let c=e.shift();if(!c)return;try{let l=await o.consultar(c,o.sinal);n=0,t.feitos+=1,l||(t.semDados+=1),o.aoResolver(c,l,{...t},!1)}catch(l){if(o.sinal.aborted){a="cancelada";return}if(l.sessao){a="sessao";return}if(n+=1,t.feitos+=1,t.semDados+=1,o.aoResolver(c,null,{...t},!0),n>=s){a="erros";return}}e.length&&await r(o.pausaMs??Zs)}}return await Promise.all(Array.from({length:Math.max(1,o.simultaneas??Ws)},()=>i())),{motivo:a,progresso:t}}var ei=500;async function Ea(o,e,r,t){if(!e.link)return null;try{let a=await o.http.obter(e.link,{sinal:t});if(!/acao=procedimento_visualizar/.test(a.url)){let c=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)return null;a=await o.http.obter(c.replace(/&amp;/g,"&"),{sinal:t})}let n=ro(a.html,"procedimento_consultar_historico");if(!n)return null;let{andamentos:s}=await ha(o,n,{tipo:"resumido",limite:ei,sinal:t}),i=xa(s,r);return Object.keys(i).length?i:null}catch(a){if(a instanceof C&&a.codigo==="SEI_SESSAO_EXPIRADA")throw new Me(a.message);if(a instanceof C&&(a.codigo==="SEI_SIGILOSO"||a.codigo==="SEI_ACAO_INDISPONIVEL"||a.codigo==="SEI_NAO_ENCONTRADO"))return null;throw a}}function Sa(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Ee(r)}}}function wa(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new C("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new C("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=q(r);throw new C("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new C("SEI_VALIDACAO",r,r)}return o}function Pa(o,e={}){let r=new URL(".",o),t=e.fetch??((...g)=>fetch(...g)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(g){n>=a&&await new Promise(m=>s.push(m)),n+=1;try{return await g()}finally{n-=1,s.shift()?.()}}let c=g=>new URL(g.replace(/&amp;/g,"&"),r).href;async function l(g,m,A){return i(async()=>{try{let y=await t(c(g),{credentials:"same-origin",redirect:"follow",...m,signal:A.sinal}),M=Ar(await y.arrayBuffer());return wa(Sa(y.url||c(g),y.status,M),A)}catch(y){throw gr(y)}})}async function u(g,m={}){return i(async()=>{try{let A=await t(c(g),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),y=new Uint8Array(await A.arrayBuffer()),M=(A.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();M==="text/html"&&wa(Sa(A.url||c(g),A.status,Ar(y)),m);let E=A.headers?.get("content-disposition")??"",b=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(E)?.[1]??/filename="?([^";]+)"?/i.exec(E)?.[1]??"");return{bytes:y,tipo:M,nome:b}}catch(A){throw gr(A)}})}return{base:r,absoluta:c,baixar:u,obter:(g,m={})=>l(g,{method:"GET"},m),enviar:(g,m,A={})=>l(g,A.utf8?{method:"POST",headers:{"Content-Type":Yt},body:Zt(m)}:{method:"POST",headers:{"Content-Type":oa},body:Wt(m,A.modos)},A)}}function ri(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function ti(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Sr(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=ri(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:ti(o),sigla:q(r)||q(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var ai=3e4,De=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Pa(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new C("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Sr(this.base())}linkMenu(e){return Ft(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new C("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=j.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=Y(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new C("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let u=Y(K(c)).get("id_procedimento")??"",g=i.get("id_protocolo")??"",m={idProcedimento:u,idDocumento:g&&g!==u?g:void 0,linkArvore:K(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<ai)return a.arvore;let n=await Ut(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:K(s[1]),texto:K(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=Ee(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function ne(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var Ma={recebidos:"Recebidos",gerados:"Gerados",detalhado:"Detalhado"},$o=(o,e)=>`${o}:${e}`;function Da(o,e,r="resumida"){let t={},a=r==="detalhada"?["detalhado"]:["recebidos","gerados"];for(let n of a){let s=n==="detalhado"?[...o]:o.filter(g=>g.grupo===n);if(!s.length)continue;let i=[...new Set(s.map(g=>g.pagina))].sort((g,m)=>g-m),c=n==="detalhado"?"na lista":`em ${Ma[n]}`;if(i.length>1){let g=i.map(m=>m+1).join(" e ");return{ok:!1,motivo:`O SEI s\xF3 aceita, de uma vez, processos de uma mesma p\xE1gina ${c} (marcados nas p\xE1ginas ${g}). Deixe s\xF3 uma p\xE1gina marcada.`}}let l=i[0],u=e.get($o(n,l));if(!u?.itens||!u.hash)return{ok:!1,motivo:`Os dados da p\xE1gina ${l+1} ainda n\xE3o foram lidos. Espere o carregamento terminar.`};t[n]={ids:s.map(g=>g.id),pagina:l,selecao:u}}return{ok:!0,plano:{porGrupo:t,todosNaPaginaAtual:o.every(n=>n.naPaginaAtual)}}}function ni(o){let e={},r=o.porGrupo.detalhado?["detalhado"]:["recebidos","gerados"];for(let t of r){let a=o.porGrupo[t],n=Ma[t];if(e[`hdn${n}ItemId`]="",!a){e[`hdn${n}ItensSelecionados`]="";continue}e[`hdn${n}ItensSelecionados`]=a.ids.join(","),e[`hdn${n}Itens`]=a.selecao.itens,e[`hdn${n}ItensHash`]=a.selecao.hash}return e}function Ca(o,e,r){let t=o.getElementById("frmProcedimentoControlar");if(!t)throw new Error("Formul\xE1rio do Controle de Processos n\xE3o encontrado.");let a=o.createElement("form");a.setAttribute("method","post"),a.setAttribute("action",e),a.style.display="none";let n=new Map;for(let s of Array.from(t.querySelectorAll("input, select, textarea")))!s.name||s.disabled||s.type==="checkbox"||s.type==="radio"||s.type==="button"||s.type==="submit"||n.set(s.name,s.value);for(let[s,i]of Object.entries(ni(r)))n.set(s,i);for(let[s,i]of n){let c=o.createElement("input");c.setAttribute("type","hidden"),c.setAttribute("name",s),c.setAttribute("value",i),a.append(c)}o.body.append(a),a.submit()}var Oa=o=>o.some(e=>e.sigiloso);var si='a[onclick*="acaoControleProcessos"]';function La(o){let e=/acaoControleProcessos\(\s*'([^']*)'\s*,\s*(true|false)\s*,\s*(true|false)/.exec(o.elemento.getAttribute("onclick")??"");return e?{url:e[1].replace(/&amp;/g,"&"),requerSelecao:e[2]==="true",aceitaSigiloso:e[3]==="true"}:null}function ka(o){let e=new Set,r=[];for(let t of o.querySelectorAll(si)){let a=/[?&]acao=([a-z0-9_]+)/.exec(t.getAttribute("onclick")??"")?.[1],n=t.querySelector("img");if(!a||!n||e.has(a))continue;e.add(a);let s=n.getAttribute("title")||n.getAttribute("alt")||a,i=n.getAttribute("src")??"";try{i=new URL(i,o.baseURI||o.location?.href).href}catch{}r.push({acao:a,rotulo:s,icone:i,elemento:t})}return r}var ii="data-spro-recolhido",ci=".collapseTabelaProcesso";function li(o){let e=[...o.querySelectorAll(ci)].filter(r=>r.id!=="spro-grade");return e.length>0&&e.some(r=>r.classList.contains("displayNone"))}function Ia(o,e,r=o.defaultView?.MutationObserver){let t=()=>e.toggleAttribute(ii,li(o));if(t(),!r)return()=>{};let a=new r(t);return a.observe(o.body??o.documentElement,{attributes:!0,attributeFilter:["class"],subtree:!0}),()=>a.disconnect()}var di=/^\s*\[( |x|X)\]\s?(.*)$/;function se(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=di.exec(e);return r?{marca:r[1]!==" ",texto:r[2]}:{marca:null,texto:e}})}function $a(o){return o.map(e=>e.marca===null?e.texto:`${e.marca?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function wr(o,e){let r=new Set(e.filter(a=>a>=0&&a<o.length));if(!r.size)return[...o];let t=[...r].every(a=>o[a].marca!==null);return o.map((a,n)=>r.has(n)?{...a,marca:t?null:a.marca??!1}:a)}function Ra(o,e){return o.map((r,t)=>t===e&&r.marca!==null?{...r,marca:!r.marca}:r)}function Ta(o){return se(o).filter(e=>e.marca!==null||e.texto.trim()).map(e=>e.marca===null?e.texto:`${e.marca?"\u2611":"\u2610"} ${e.texto}`).join(" / ")}var Oe="data-tip",Na="data-tip-nota",pi="data-tip-autor",Ce=0,ui=`
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
`,za=o=>o.nodeType===1,mi=o=>o.some(e=>za(e)&&(e.id==="spro-grade"||e.classList.contains("spro-grade-botao")));function Pr(o){if(!mi(o))return null;for(let e of o)if(za(e)){if(e.id==="spro-grade")return null;if(e.hasAttribute(Oe)||e.hasAttribute(Na)||e.hasAttribute("title"))return e}return null}function Ro(o){let e=o.getAttribute("title");return e&&(o.hasAttribute(Oe)||o.setAttribute(Oe,e),!o.hasAttribute("aria-label")&&!(o.textContent??"").trim()&&o.setAttribute("aria-label",e.split(`
`)[0]),o.removeAttribute("title")),o.getAttribute(Oe)??""}function fi(o,e,r){let t=o.ownerDocument,a=t.createElement("div");a.className="nota";for(let n of se(e)){if(n.marca===null&&!n.texto.trim())continue;let s=t.createElement("div");s.className="nota-l",n.marca!==null&&s.setAttribute("data-t",n.marca?"x":"o"),s.textContent=n.texto,a.append(s)}if(r){let n=t.createElement("div");n.className="nota-autor",n.textContent=r,a.append(n)}o.replaceChildren(a)}var Mr=null;function _a(o){let e=a=>{if(a.nodeType!==1)return;let n=a;n.hasAttribute("title")&&Ro(n);for(let s of Array.from(n.querySelectorAll("[title]")))Ro(s)};if(e(o.nodeType===11?o.host:o),o.nodeType===11)for(let a of Array.from(o.querySelectorAll("[title]")))Ro(a);let r=(o.ownerDocument??o).defaultView?.MutationObserver;if(!r)return()=>{};let t=new r(a=>{for(let n of a)if(n.type==="attributes")e(n.target);else for(let s of Array.from(n.addedNodes))e(s);Mr?.()});return t.observe(o,{attributes:!0,attributeFilter:["title"],childList:!0,subtree:!0}),()=>t.disconnect()}function gi(o){let e=[],r=o;for(;r;)e.push(r),r=r.nodeType===11?r.host??null:r.parentNode;return e}function hi(o,e,r){let a=o.bottom+8,n=!1;a+e.altura>r.h-4&&o.top-8-e.altura>=4&&(a=o.top-8-e.altura,n=!0);let s=o.left+o.width/2-e.largura/2;return s=Math.max(4,Math.min(s,r.w-e.largura-4)),{x:Math.round(s),y:Math.round(Math.max(4,a)),acima:n}}function qa(o,e=()=>!1){let r=o.defaultView;if(!r)return()=>{};let t=o.createElement("div");t.id="spro-dica-host";let a=t.attachShadow({mode:"open"}),n=o.createElement("style");n.textContent=ui;let s=o.createElement("div");s.className="dica",s.setAttribute("role","tooltip"),s.hidden=!0,s.setAttribute("popover","manual"),a.append(n,s),o.documentElement.append(t);let i=null,c,l=!1,u=null;function g(){clearTimeout(c),i=null,l=!1,s.classList.remove("on"),s.hidden=!0;try{s.matches?.(":popover-open")&&s.hidePopover()}catch{}}function m(){if(!i||!i.isConnected)return y();let P=i.getAttribute(Na),h=P!==null?P:Ro(i);if(!h)return g();P!==null?fi(s,P,i.getAttribute(pi)??""):s.textContent=h,s.classList.toggle("claro",!e()),s.hidden=!1;try{typeof s.showPopover=="function"&&!s.matches(":popover-open")&&s.showPopover()}catch{}let w=i.getBoundingClientRect(),k=s.getBoundingClientRect(),L=hi(w,{largura:k.width,altura:k.height},{w:r.innerWidth,h:r.innerHeight});s.style.left=`${L.x}px`,s.style.top=`${L.y}px`,s.classList.add("on"),l=!0}function A(P,h){let w=o.elementFromPoint(P,h);for(let k=0;k<4&&w?.shadowRoot;k++){let L=w.shadowRoot.elementFromPoint(P,h);if(!L||L===w)break;w=L}return w}function y(){if(!u)return g();let P=A(u.x,u.y),h=P?Pr(gi(P)):null;if(h===i&&i?.isConnected)return;let w=l;g(),h&&(Ro(h),i=h,w||Ce===0?m():c=setTimeout(m,Ce))}Mr=()=>{i&&!i.isConnected&&y()};let M=P=>{let h=P;typeof h.clientX=="number"&&(u={x:h.clientX,y:h.clientY});let w=Pr(P.composedPath());w===i&&i?.isConnected||(g(),w&&(Ro(w),i=w,Ce>0?c=setTimeout(m,Ce):m()))},E=P=>{let h=Pr(P.composedPath());!h||!h.matches?.(":focus-visible")||(g(),Ro(h),i=h,m())},b=()=>g();return o.addEventListener("pointerover",M,!0),o.addEventListener("mouseover",M,!0),o.addEventListener("pointermove",M,!0),o.addEventListener("mousemove",M,!0),o.addEventListener("focusin",E,!0),o.addEventListener("focusout",g,!0),o.addEventListener("pointerdown",g,!0),o.addEventListener("keydown",g,!0),o.addEventListener("scroll",g,!0),o.documentElement.addEventListener("pointerleave",b),()=>{g(),Mr=null,o.removeEventListener("pointerover",M,!0),o.removeEventListener("mouseover",M,!0),o.removeEventListener("pointermove",M,!0),o.removeEventListener("mousemove",M,!0),o.documentElement.removeEventListener("pointerleave",b),o.removeEventListener("focusin",E,!0),o.removeEventListener("focusout",g,!0),o.removeEventListener("pointerdown",g,!0),o.removeEventListener("keydown",g,!0),o.removeEventListener("scroll",g,!0),t.remove()}}var to="data-spro-grade",ho="data-spro-grade-pronta",ie="data-spro-grade-escuro",Dr="spro_grade",Cr="spro-grade-pre";var bi="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function vi(){let o=bi.split(", ").map(t=>`html[${to}] ${t}`).join(`,
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
}`}function Va(o){try{return o.getItem(Dr)==="1"}catch{return!1}}function Le(o,e){try{e?o.setItem(Dr,"1"):o.removeItem(Dr)}catch{}}function ke(o,e){let r=o.documentElement;if(r.setAttribute(to,"1"),r.removeAttribute(ho),e?r.setAttribute(ie,"1"):r.removeAttribute(ie),!o.getElementById(Cr)){let t=o.createElement("style");t.id=Cr,t.textContent=vi(),(o.head??r).append(t)}}function Ie(o){let e=o.documentElement;e.removeAttribute(to),e.removeAttribute(ho),e.removeAttribute(ie),o.getElementById(Cr)?.remove()}var To=o=>o.documentElement.hasAttribute(to);function Or(o){o.documentElement.setAttribute(ho,"1")}function $e(o,e={setTimeout:(r,t)=>setTimeout(r,t),clearTimeout:r=>clearTimeout(r)}){let r=!1,t,a=s=>{r||(r=!0,e.clearTimeout(n),e.clearTimeout(t),o(s))},n=e.setTimeout(()=>a("teto"),1e4);return{iniciarContagem(){r||(t=e.setTimeout(()=>a("prazo"),1500))},pronta(){r=!0,e.clearTimeout(n),e.clearTimeout(t)},falhou:s=>a(s),encerrada:()=>r}}var Ha="http://www.w3.org/2000/svg",xi={grade:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M3.5 9.5h17M9 9.5v10M3.5 14.5h17"}]],quadro:[["rect",{x:"3.5",y:"4.5",width:"4.6",height:"15",rx:"1.2"}],["rect",{x:"9.7",y:"4.5",width:"4.6",height:"9",rx:"1.2"}],["rect",{x:"15.9",y:"4.5",width:"4.6",height:"12",rx:"1.2"}]],lista:[["path",{d:"M8 6.5h12M8 12h12M8 17.5h12M4 6.5h.01M4 12h.01M4 17.5h.01"}]],agrupar:[["path",{d:"M4 6h16M4 12h10M4 18h13"}],["path",{d:"M18 10l3 2-3 2"}]],colunas:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M9.2 4.5v15M14.8 4.5v15"}]],disquete:[["path",{d:"M5 4.5h11l3.5 3.5v11a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 19z"}],["path",{d:"M8 4.5v5h7v-5M8 20v-6h8v6"}]],densidade:[["path",{d:"M4 6h16M4 10h16M4 14h16M4 18h16"}]],semPessoa:[["circle",{cx:"12",cy:"8.5",r:"3.6"}],["path",{d:"M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5M4 4l16 16"}]],olhoFechado:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}],["path",{d:"M4 4l16 16"}]],recebido:[["path",{d:"M4 13.5l2.2-7A1.6 1.6 0 0 1 7.7 5.4h8.6a1.6 1.6 0 0 1 1.5 1.1l2.2 7"}],["path",{d:"M4 13.5V18a1.6 1.6 0 0 0 1.6 1.6h12.8A1.6 1.6 0 0 0 20 18v-4.5h-4.6a3.4 3.4 0 0 1-6.8 0z"}]],gerado:[["path",{d:"M14 3.5H7.5A1.5 1.5 0 0 0 6 5v14a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 18 19V7.5z"}],["path",{d:"M14 3.5V7.5h4M9.5 14.5h5M9.5 17h3"}],["path",{d:"M9.5 11.5l2-2 2 2M11.5 9.5v3.5"}]],novaGuia:[["path",{d:"M14 4.5h5.5V10M19.5 4.5L11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],prioridade:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 7.5v5.5M12 16.4h.01"}]],seta:[["path",{d:"M6 9l6 6 6-6"}]],setaDireita:[["path",{d:"M9 6l6 6-6 6"}]],desfazer:[["path",{d:"M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3"}]],bloquear:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],informacao:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M12 11v5M12 8h.01"}]]};function no(o,e=16,r=document){let t=r.createElementNS(Ha,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[n,s]of Object.entries(a))t.setAttribute(n,s);for(let[n,s]of xi[o]){let i=r.createElementNS(Ha,n);for(let[c,l]of Object.entries(s))i.setAttribute(c,l);t.append(i)}return t}var Re="spro-grade-botao",Ai="#processosSEIPro .titlePanelHome, #processosSEIPro #divInfraBarraLocalizacao, #divInfraBarraLocalizacao.titlePanelHome, #divInfraBarraLocalizacao",yi="Usar o Novo Controle de Processos",Ei="Voltar \xE0 vis\xE3o nativa do SEI";function Si(o,e,r){let t=o.querySelector(Ai);if(!t)return!1;let a=e?Ei:yi,n=t.querySelector(`.${Re}`);n||(n=o.createElement("button"),n.type="button",n.className=Re,n.append(no("grade",18,o)),t.append(n));let s=[...t.children].filter(i=>i.classList.contains("spro-pnl-botao")).at(-1);return s&&s.compareDocumentPosition(n)&2&&s.after(n),n.setAttribute("data-tip",a),n.removeAttribute("title"),n.setAttribute("aria-label",a),n.setAttribute("aria-pressed",String(e)),!0}function ja(o,e){let r=t=>{(t.composedPath?.()[0]??t.target)?.closest?.(`.${Re}`)&&(t.preventDefault(),t.stopPropagation(),e())};return o.addEventListener("click",r,!0),()=>o.removeEventListener("click",r,!0)}var Fa=o=>{for(let e of o.querySelectorAll(`.${Re}`))e.remove()};function Te(o,e,r){let t=()=>Si(o,e(),r);t();let a=o.defaultView?.MutationObserver;if(!a||!o.body)return()=>Fa(o);let n=!1,s=new a(()=>{n||(n=!0,queueMicrotask(()=>{n=!1,s.disconnect(),t(),s.observe(o.body,{childList:!0,subtree:!0})}))});return s.observe(o.body,{childList:!0,subtree:!0}),()=>{s.disconnect(),Fa(o)}}function J(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var wi=/<div(?: style="text-decoration: line-through;")?><i class="(far fa-square|fas fa-check-square)"><\/i> ?([\s\S]*?)<\/div>/g;function Pi(o){return o.includes("<div")?o.replace(wi,(e,r,t)=>`
${r==="far fa-square"?"[ ]":"[X]"} ${t}
`).replace(/\n{2,}/g,`
`).trim():o}var Mi=/^Anota[\u00e7c][\u00e3a]o( com prioridade)?\s+\/\s+([\s\S]*)\s+\/\s+(.*)$/i;function Ga(o){let e=o.querySelector('a[href*="acao=anotacao_registrar"]');if(!e)return null;let r=e.querySelector("img")?.getAttribute("src")??"",t=/anotacao2\.|prioridade/i.test(r),a=Mi.exec(e.getAttribute("aria-label")??"");if(a){let i=K(a[2]).replace(/\r\n?/g,`
`).trim();return i?{texto:i,autor:a[3].trim(),prioridade:!!a[1]||t}:null}let n=Eo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];if(typeof n?.[0]!="string")return null;let s=Pi(V(n[0])).trim();return s?{texto:s,autor:V(n[1]).trim(),prioridade:t}:null}function Ua(o,e,r){if(e){let a={idProcedimento:o,origem:"nativo",vencimento:e.data,idControlePrazo:e.idControlePrazo,sigla:e.sigla,linkNativo:e.link,...e.concluidoEm?{concluidoEm:e.concluidoEm}:{}};return r?.vencimento&&r.data===e.data?{...a,origem:"ambos",hora:r.hora,texto:r.texto||void 0}:a}if(!r)return null;let t={idProcedimento:o,origem:"marcador",hora:r.hora,texto:r.texto||void 0};return r.vencimento?{...t,vencimento:r.data}:{...t,inicio:r.data}}var Di='a[href*="acao=controle_prazo_definir"]',Ci=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,Ba=(o,e,r)=>`${r}-${e}-${o}`;function Oi(o){let e=o.trim().toLowerCase(),r=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(e);return r?{estado:"concluido",concluidoEm:Ba(r[1],r[2],r[3])}:/^at[e\u00E9] hoje$/.test(e)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(e)?{estado:"atrasado"}:/^\d+ dias?$/.test(e)?{estado:"noPrazo"}:null}function Lr(o){let e=o.querySelector(Di);if(!e)return null;let r=e.getAttribute("aria-label")??"";if(!r){let l=Eo(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof l?.[0]=="string"&&(r=`Controle de Prazo / ${V(l[0])}`)}let t=Ci.exec(K(r).replace(/\s+/g," ").trim());if(!t)return null;let a=Oi(t[5]);if(!a)return null;let n=K(e.getAttribute("href")??""),s=Y(n),i=s.get("id_controle_prazo")??"",c=s.get("id_procedimento")??o.id.replace(/^P/,"");return!i||!c?null:{idControlePrazo:i,idProcedimento:c,sigla:t[1],data:Ba(t[2],t[3],t[4]),link:n,...a}}var Qa=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,Xa=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,Ka=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function Li(o,e,r){let t=`${r}-${e}-${o}`;try{return Fo(ye(t))===t?t:null}catch{return null}}var ki=o=>o.padStart(2,"0");function kr(o){let e=o.replace(/\r\n?/g,`
`),r=Qa.exec(e);if(!r)return null;let t=Li(r[1],r[2],r[3]);if(!t)return null;let a=Xa.exec(e),n=a?`${ki(a[1])}:${a[2]}`:void 0,s=Ka.test(e),i=e.replace(Ka,"").replace(Qa,"");return a&&(i=i.replace(Xa,"")),i=i.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:s,texto:i}}function Ja(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=Eo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&e.push({texto:V(t[0]),nome:V(t[1])})}return e}function Wa(o,e){let r=o.querySelector("input[type=checkbox]"),t=o.querySelector("a[href*='procedimento_trabalhar']");if(!r||!t)return null;let a=r.getAttribute("aria-label")??"",n=/^Sigiloso\b/.test(a)||/Sigiloso/.test(t.getAttribute("class")??""),s=[...o.querySelectorAll("td")],i=n?[]:[...s[1]?.querySelectorAll("a[aria-label]")??[]].map(c=>c.getAttribute("aria-label")??"");return{idProcedimento:r.getAttribute("value")??Y(t.getAttribute("href")??"").get("id_procedimento")??"",protocolo:r.getAttribute("title")??q(t),grupo:e,tipo:/Tipo (.*?)(?: \/ Especifica|$)/.exec(a)?.[1]?.trim()??"",especificacao:n?"":/Especifica\S* (.*)$/.exec(a)?.[1]?.trim()??"",sigiloso:n,novo:/NaoVisualizado/.test(t.getAttribute("class")??""),atribuido:q(s[s.length-1]).replace(/^\(|\)$/g,""),sinais:i,documentoNovo:!!s[1]?.querySelector("img[src*='exclamacao']")||i.some(c=>/documento foi inclu/i.test(c))}}var Ii=/marcador_([a-z0-9_]+)\.svg/i;function $i(o){let e=[];for(let r of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=Eo(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0],a=/^Marcador\s*\/\s*(.*)$/s.exec(K(r.getAttribute("aria-label")??"").trim()),n=(typeof t?.[1]=="string"&&t[1]?V(t[1]):a?.[1]??"").trim();n&&e.push({nome:n,cor:Ii.exec(r.querySelector("img")?.getAttribute("src")??"")?.[1]??"",texto:typeof t?.[0]=="string"?V(t[0]).trim():""})}return e}function Ri(o){let e=[];for(let r of o.querySelectorAll("a")){let t=r.querySelector("img")?.getAttribute("src")??"",a=/retorno_(programado|aguardando)(\d)?\.svg/.exec(t);if(!a)continue;let n=K(r.getAttribute("aria-label")??"").trim();e.push({tipo:a[1],descricao:n,atrasado:a[2]==="3"||/atrasad/i.test(n)})}return e}function Ti(o){let e=o.querySelector('a[href*="acao=procedimento_atribuicao_listar"], a.ancoraSigla'),r=e?.textContent?.trim();if(!e||!r)return;let t=K(e.getAttribute("title")??"").replace(/^Atribu[i\u00ED]do para\s+/i,"").trim();return{sigla:r,nome:t||r}}function Ir(o,e){let r=Wa(o,e.grupo);if(!r?.idProcedimento)return null;let t=$i(o),a=null;for(let u of Ja(o)){let g=kr(u.texto);if(g){a=g;break}}let n={id:r.idProcedimento,protocolo:r.protocolo,grupo:e.grupo,tipo:r.tipo,especificacao:r.especificacao,sigiloso:r.sigiloso,naoVisualizado:r.novo,marcadores:r.sigiloso?[]:t,retornos:r.sigiloso?[]:Ri(o),acompanhamentoEspecial:!r.sigiloso&&!!o.querySelector('a[href*="acao=acompanhamento"] , img[src*="acompanhamento_especial"], .acompanhamentoesp_icon'),documentoNovo:r.documentoNovo,pagina:e.pagina,naPaginaAtual:e.naPaginaAtual},s=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("onmouseover")??"";/\(URGENTE\)/.test(s)&&(n.urgente=!0),/\(TRANCADO\)/.test(s)&&(n.trancado=!0);let i=o.querySelector(".acompanhamentoesp_icon");if(i){let u=Eo(i.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof u?.[1]=="string"&&u[1]&&(n.acompanhamentoGrupo=V(u[1]))}let c=o.querySelector('a[href*="acao=procedimento_trabalhar"]')?.getAttribute("href");c&&(n.link=K(c));let l=Ti(o);if(l&&(n.atribuicao=l),!r.sigiloso){let u=Ga(o);u&&(n.anotacao=u);let g=Ua(n.id,Lr(o),a);g&&(n.prazo=g)}return n}var Ya="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado",Ni={recebidos:"tblProcessosRecebidos",gerados:"tblProcessosGerados"},zi=[[/^tipo( do processo)?$/,"tipo"],[/^especificacao$/,"especificacao"],[/^(atribuicao|atribuido( para)?|responsavel)$/,"atribuicao"],[/^marcador(es)?$/,"marcador"],[/^prioridade$/,"prioridade"],[/^interessados?$/,"interessados"],[/^observacao$/,"observacao"],[/^ultima mov/,"ultimaMov"]];function _i(o){let e=new Map;return[...(o.querySelector("thead tr")??[...o.querySelectorAll("tr")].find(t=>t.querySelector("th")))?.children??[]].forEach((t,a)=>{let n=J(t.textContent??""),s=zi.find(([i])=>i.test(n));s&&e.set(a,s[1])}),e}function Za(o){let e=(o?.querySelector("caption")?.textContent??"").replace(/\s+/g," "),r=Number(/(\d+)\s+registro/.exec(e)?.[1]??0),t=/(\d+)\s+a\s+(\d+)\s*\)?/.exec(e);return{total:r,porPagina:t?Number(t[2])-Number(t[1])+1:0}}function qi(o,e,r){if(!r.size)return;let t=[...e.children];for(let[a,n]of r){let s=(t[a]?.textContent??"").replace(/\s+/g," ").trim();if(s)if(n==="tipo"&&!o.tipo)o.tipo=s;else if(n==="especificacao"&&!o.especificacao&&!o.sigiloso)o.especificacao=s;else if(n==="atribuicao"&&!o.atribuicao){let i=s.replace(/^\(|\)$/g,"");o.atribuicao={sigla:i,nome:i}}else if(n==="marcador"&&!o.marcadores.length&&!o.sigiloso)o.marcadores=[{nome:s,cor:"",texto:""}];else{if(o.sigiloso&&(n==="interessados"||n==="observacao"))continue;if(n==="prioridade")o.prioridade=s;else if(n==="interessados")o.interessados=s;else if(n==="observacao")o.observacao=s;else if(n==="ultimaMov"){let i=/(\d{2})\/(\d{2})\/(\d{4})/.exec(s);i&&(o.ultimaMov=`${i[3]}-${i[2]}-${i[1]}`)}}}}function Vi(o){let e=o.querySelector("input[type=checkbox]")?.getAttribute("name")??"";return/^chkGerados/i.test(e)?"gerados":"recebidos"}function jo(o,e={}){let r=e.pagina??0,t=e.naPaginaAtual??!0,a=[],n={recebidos:0,gerados:0},s={recebidos:0,gerados:0},i=o.getElementById("tblProcessosDetalhado"),c=new Set,l=m=>{m&&!c.has(m.id)&&(c.add(m.id),a.push(m))};for(let m of["recebidos","gerados"]){let A=o.getElementById(Ni[m]),{total:y,porPagina:M}=Za(A);n[m]=y,s[m]=M;for(let E of A?.querySelectorAll('tr[id^="P"]')??[]){let b=E.classList.contains("typeGerados")?"gerados":m;l(Ir(E,{grupo:b,pagina:r,naPaginaAtual:t}))}}if(i){let m=_i(i),{total:A,porPagina:y}=Za(i);for(let M of i.querySelectorAll("tr")){if(!M.querySelector('a[href*="procedimento_trabalhar"]'))continue;let E=Vi(M),b=Ir(M,{grupo:E,pagina:r,naPaginaAtual:t});b&&!c.has(b.id)&&(qi(b,M,m),l(b),n[E]=Math.max(n[E],A),s[E]=Math.max(s[E],y))}}let u=m=>o.getElementById(m)?.getAttribute("value")??"",g={recebidos:{itens:u("hdnRecebidosItens"),hash:u("hdnRecebidosItensHash")},gerados:{itens:u("hdnGeradosItens"),hash:u("hdnGeradosItensHash")},detalhado:{itens:u("hdnDetalhadoItens"),hash:u("hdnDetalhadoItensHash")}};return{processos:a,totais:n,porPagina:s,visao:i?"detalhada":"resumida",selecoes:g}}var Hi=60;async function on(o,e,r={}){let t=r.maxPaginas??Hi,a=[],n=new Set(o.processos.map(l=>l.id)),s=!0,i,c=!1;try{for(let l of["recebidos","gerados"]){let u=o.totais[l],g=o.processos.filter(y=>y.grupo===l).length,m=o.porPagina[l]||g||1,A=Math.max(1,Math.ceil(u/m));for(let y=1;g<u;y+=1){if(r.sinal?.aborted)return s=!1,{processos:a,completo:s,...i?{erro:i}:{}};if(y>=t){s=!1;break}c=!0;let M=await e.pagina(l,y,r.sinal),E=jo(M,{pagina:y,naPaginaAtual:!1}),b=E.processos.filter(P=>P.grupo===l&&!n.has(P.id));if(!b.length)break;for(let P of b)n.add(P.id);g+=b.length,a.push(...b),E.visao==="detalhada"?r.aoSelecao?.("detalhado",y,E.selecoes.detalhado):r.aoSelecao?.(l,y,E.selecoes[l]),r.aoPagina?.(b),r.aoProgresso?.({grupo:l,paginasLidas:y+1,paginasTotal:A,processos:g,total:u})}g<u&&(s=!1)}}catch(l){s=!1,i=l instanceof Error?l.message:String(l)}finally{if(c)try{await e.restaurar()}catch(l){i??=`N\xE3o foi poss\xEDvel voltar \xE0 primeira p\xE1gina: ${l instanceof Error?l.message:String(l)}`}}return{processos:a,completo:s,...i?{erro:i}:{}}}var Fi=["hdnRecebidosItensSelecionados","hdnGeradosItensSelecionados","hdnRecebidosItemId","hdnGeradosItemId","hdnDetalhadoItensSelecionados","hdnDetalhadoItemId"];function $r(o,e,r="resumida"){let t="#frmProcedimentoControlar",a=()=>({hdnRecebidosPaginaAtual:"0",hdnGeradosPaginaAtual:"0",hdnDetalhadoPaginaAtual:"0",...Object.fromEntries(Fi.map(n=>[n,""]))});return{async pagina(n,s,i){let c=r==="detalhada"?"hdnDetalhadoPaginaAtual":n==="recebidos"?"hdnRecebidosPaginaAtual":"hdnGeradosPaginaAtual";return(await j.de(e,t,o).definir({...a(),[c]:String(s)}).enviar({sinal:i,aceitarValidacao:!0})).doc},async restaurar(n){await j.de(e,t,o).definir(a()).enviar({sinal:n,aceitarValidacao:!0})},restaurarAoSair(){try{let n=j.de(e,t,o);fetch(o.absoluta(n.action),{method:"POST",keepalive:!0,credentials:"include",headers:{"content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(n.definir(a()).pares()).toString()}).catch(()=>{})}catch{}}}}var ji=30*6e4,en=5e3,Rr=()=>({vistoEm:{}});function tn(o){if(!o||typeof o!="object")return Rr();let e=o,r={};if(e.vistoEm&&typeof e.vistoEm=="object")for(let[i,c]of Object.entries(e.vistoEm))typeof c=="number"&&Number.isFinite(c)&&c>0&&(r[i]=c);let t=i=>typeof i=="number"&&Number.isFinite(i)?i:void 0,a={vistoEm:r},n=t(e.visitaAtual),s=t(e.visitaAnterior);return n!==void 0&&(a.visitaAtual=n),s!==void 0&&(a.visitaAnterior=s),a}function an(o,e){return o.visitaAtual===void 0?{...o,visitaAtual:e}:e-o.visitaAtual>ji?{...o,visitaAnterior:o.visitaAtual,visitaAtual:e}:o}function Tr(o,e,r,t){let a={...o.vistoEm};for(let s of e)a[s]===void 0&&(a[s]=r);if(t){let s=new Set(e);for(let i of Object.keys(a))s.has(i)||delete a[i]}let n=Object.keys(a);if(n.length>en)for(let s of n.sort((i,c)=>a[c]-a[i]).slice(en))delete a[s];return{...o,vistoEm:a}}function nn(o,e){return o.map(r=>e.vistoEm[r.id]!==void 0?{...r,vistoEm:e.vistoEm[r.id]}:r)}function Go(o){if(o===null)return"";if(o<1)return"hoje";if(o===1)return"1 dia";if(o<60)return`${o} dias`;let e=Math.floor(o/30);return e<24?`${e} meses`:`${Math.floor(o/365)} anos`}var sn="Contado desde a primeira vez que o SEI Pro viu o processo nesta unidade (o SEI n\xE3o informa a data de chegada).";var Uo=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao","caixa","parado","sinais"],No={processo:"Processo",tipo:"Tipo",especificacao:"Especifica\xE7\xE3o",responsavel:"Respons\xE1vel",marcadores:"Marcadores",prazo:"Prazo",anotacao:"Anota\xE7\xE3o",caixa:"Na caixa",parado:"Parado h\xE1",sinais:"Sinais"};var Gi=30,Ui=40,Bi=()=>({colunas:"marcador",limite:0,raiasPorResponsavel:!1}),Qi=["processo","especificacao","tipo","responsavel","marcadores","prazo","anotacao"],Nr=2;function Bo(){return{id:"",nome:"Padr\xE3o",busca:"",ordem:[],agrupar:"nenhum",modo:"tabela",colv:Nr,colunas:[...Qi],densidade:"confortavel",quadro:Bi()}}var Xi=["nenhum","responsavel","tipo","marcador","prazo","situacao","grupo","anotacao","acompanhamento","retorno","caixa","autuacao","recebimento","envio","unidadeEnvio"],Ki=["protocolo","tipo","responsavel","marcador","prazo","caixa","parado","novo"],Ji=["marcador","responsavel","prazo","tipo"];function Ne(o){let e=Bo();if(!o||typeof o!="object")return e;let r=o,t=Array.isArray(r.ordem)?r.ordem.filter(c=>!!c&&typeof c=="object"&&Ki.includes(c.campo)).slice(0,4).map(c=>({campo:c.campo,decrescente:c.decrescente===!0})):[],a=Array.isArray(r.colunas)?[...new Set(r.colunas.filter(c=>Uo.includes(c)))]:[];if(a.includes("processo")&&r.colv!==Nr&&!a.includes("especificacao")){let c=a.indexOf("processo");a=[...a.slice(0,c+1),"especificacao",...a.slice(c+1)]}let n=r.quadro&&typeof r.quadro=="object"?r.quadro:{},s=Array.isArray(n.ordemColunas)?[...new Set(n.ordemColunas.filter(c=>typeof c=="string"&&c.length>0))].slice(0,200):void 0,i=typeof n.larguraColuna=="number"&&Number.isFinite(n.larguraColuna)?Math.max(200,Math.min(500,Math.round(n.larguraColuna))):void 0;return{id:typeof r.id=="string"?r.id:"",colv:Nr,nome:typeof r.nome=="string"&&r.nome.trim()?r.nome.trim().slice(0,Ui):e.nome,busca:typeof r.busca=="string"?r.busca.slice(0,500):"",ordem:t,agrupar:Xi.includes(r.agrupar)?r.agrupar:"nenhum",modo:r.modo==="quadro"?"quadro":"tabela",colunas:a.length?a:e.colunas,densidade:r.densidade==="compacta"?"compacta":"confortavel",quadro:{colunas:Ji.includes(n.colunas)?n.colunas:"marcador",limite:typeof n.limite=="number"&&n.limite>0?Math.min(99,Math.floor(n.limite)):0,raiasPorResponsavel:n.raiasPorResponsavel===!0,...s?.length?{ordemColunas:s}:{},...i!==void 0?{larguraColuna:i}:{}}}}function cn(o,e,r){let t=Ne(e),a=t.id?o.findIndex(s=>s.id===t.id):-1;if(a>=0){let s=[...o];return s[a]=t,{lista:s,visao:t}}if(o.length>=Gi)return null;let n={...t,id:r()};return{lista:[...o,n],visao:n}}var ln=(o,e)=>o.filter(r=>r.id!==e);function dn(o,e){let r=t=>JSON.stringify({...t,id:"",nome:""});return r(o)!==r(e)}var ze="spro_grade_v_ids",_e=o=>`spro_grade_v:${o}`,Wi=o=>`spro_grade:${o||"x"}`,Zi=(o,e)=>`spro_grade_and:${o||"x"}:${e||"x"}`,pn=5e3;function Yi(){return{visao:Bo(),idade:Rr(),recolhidos:[]}}function oc(o){if(!o||typeof o!="object")return Yi();let e=o;return{visao:Ne(e.visao),idade:tn(e.idade),recolhidos:Array.isArray(e.recolhidos)?e.recolhidos.filter(r=>typeof r=="string").slice(0,200):[]}}var ec=/^\d{4}-\d{2}-\d{2}$/;function rc(o){if(!o||typeof o!="object")return null;let e=o;if(typeof e.consultadoEm!="number"||!Number.isFinite(e.consultadoEm))return null;let r={consultadoEm:e.consultadoEm};for(let t of["autuacao","recebimento","envio"])typeof e[t]=="string"&&ec.test(e[t])&&(r[t]=e[t]);return typeof e.unidadeEnvio=="string"&&e.unidadeEnvio&&(r.unidadeEnvio=e.unidadeEnvio.slice(0,120)),r}function un(o,e,r=""){let{local:t,sync:a}=o,n=Wi(e),s=Zi(e,r);async function i(){return oc((await t.obter(n))[n])}async function c(A){let y=await i();await t.gravar({[n]:{...y,...A}})}async function l(){let A=(await a.obter(ze))[ze],y=Array.isArray(A)?A.filter(E=>typeof E=="string"):[];if(!y.length)return[];let M=await a.obter(y.map(_e));return y.flatMap(E=>{let b=M[_e(E)];return b?[{...Ne(b),id:E}]:[]})}async function u(A,y=[]){let M=new Set(A.map(P=>P.id)),E={[ze]:A.map(P=>P.id)};for(let P of A)E[_e(P.id)]=P;await a.gravar(E);let b=y.filter(P=>!M.has(P.id)).map(P=>_e(P.id));b.length&&await a.remover(b)}async function g(A){let y=(await t.obter(s))[s],M=y&&typeof y=="object"?y.itens:void 0,E={};if(!M||typeof M!="object")return E;for(let[b,P]of Object.entries(M)){let h=rc(P);h&&ae(h,A)&&(E[b]=h)}return E}async function m(A){let y=Object.keys(A),M=y.length>pn?Object.fromEntries(y.sort((E,b)=>A[b].consultadoEm-A[E].consultadoEm).slice(0,pn).map(E=>[E,A[E]])):A;await t.gravar({[s]:{itens:M}})}return{lerAndamentos:g,gravarAndamentos:m,lerEstado:i,gravarVisao:A=>c({visao:A}),gravarIdade:A=>c({idade:A}),gravarRecolhidos:A=>c({recolhidos:A}),lerVisoes:l,gravarVisoes:u,aoMudarVisoes:A=>a.aoMudar(y=>ze in y||Object.keys(y).some(M=>M.startsWith("spro_grade_v:"))?A():void 0)}}function mn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var fn=new Set;var tc=null;function ac(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function gn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function hn(o,e,r){let t=o.ownerDocument,a=t.defaultView;ac(o).append(e);let n=!0,s=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let A=a?.innerHeight??0,y=a?.innerWidth??0,M=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,y-16)),E=r.alinharDireita?m.right-M:m.left,b=Math.max(8,Math.min(E,y-M-8)),P=r.alturaMaxima??360;e.style.maxHeight="none";let h=Math.min(e.scrollHeight||P,P),w=A-m.bottom-8,k=m.top-8,L=tc?.()??!1,$=!L&&w<Math.min(h,200)&&k>w;e.style.left=`${b}px`,e.style.width=`${M}px`,e.style.maxHeight=`${L?P:Math.max(140,Math.min(P,$?k:w>140?w:P))}px`,e.classList.toggle("spro-flutuante-cima",$),$?(e.style.top="",e.style.bottom=`${A-m.top+4}px`):(e.style.bottom="",e.style.top=`${m.bottom+4}px`),gn(a,$?0:Math.ceil(m.bottom+4+h+12))},i=m=>{let A=m.composedPath?.()??[],y=m.target,M=E=>A.includes(E)||!!y&&!!E.contains?.(y);M(e)||M(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},l=m=>{m.target instanceof Node&&e.contains(m.target)||c()},u=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",l,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",u);let g={ancora:o,fechar:()=>r.aoFechar()};return fn.add(g),s(),{posicionar:s,fechar(){n&&(n=!1,fn.delete(g),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",l,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",u),e.remove(),gn(a,0))}}}function bn(o,e){let r=J(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=J(n.rotulo),c=`${i} ${J(n.descricao??"")}`;if(!t.every(u=>c.includes(u)))return;let l=i.startsWith(r)?0:i.split(" ").some(u=>u.startsWith(t[0]))?1:2;a.push({o:n,nota:l,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function nc(o,e){let r=o.normalize("NFC"),t=J(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((l,u)=>{let g=l.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let m of g)n+=m,s.push(u)});let i=new Array(a.length).fill(!1);for(let l of t){let u=n.indexOf(l);if(!(u<0))for(let g=u;g<u+l.length;g++)i[s[g]]=!0}let c=[];return a.forEach((l,u)=>{let g=c[c.length-1];g&&g.marcado===i[u]?g.texto+=l:c.push({texto:l,marcado:i[u]})}),c}var sc=0;function Mo(o){let e=`spro-combo-${++sc}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=S=>r().find(O=>O.valor===S)??t.get(S),n=[...o.valor??[]],s=null,i="",c=0,l=[],u=null,g=o.vazio??"Escolher\u2026",m=d("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),A=()=>o.aoMudar?.([...n]);function y(){let S=[];o.icone&&S.push(_(o.icone,15));let O=n.map(F=>a(F)).filter(F=>!!F),I=d("span",{class:"spro-combo-texto"});if(!O.length)I.classList.add("spro-combo-vazio"),I.append(g);else{let F=O[0];F.cor&&I.append(d("span",{class:"spro-combo-cor",style:`background:${F.cor}`})),I.append(d("span",{class:"spro-combo-rotulo"},F.rotulo)),O.length>1&&I.append(d("span",{class:"spro-combo-mais"},`+${O.length-1}`))}S.push(I,_("chevron",14)),m.classList.toggle("spro-combo-ativo",o.multiplo===!0&&O.length>0),m.replaceChildren(...S)}let M=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function E(S){if(o.multiplo){n=n.includes(S.valor)?n.filter(I=>I!==S.valor):[...n,S.valor],A(),y(),w();return}let O=n.length!==1||n[0]!==S.valor;n=[S.valor],y(),T(!0),O&&A()}async function b(){if(!o.criar)return;let S=i.trim();if(!S)return;let O=await o.criar(S);if(O){if(t.set(O.valor,O),i="",s){let I=s.querySelector(".spro-combo-busca");I&&(I.value="")}o.multiplo&&n.includes(O.valor)?w():E(O)}}function P(S,O){let I=n.includes(S.valor),F=d("span",{class:"spro-combo-op-rotulo"});for(let N of nc(S.rotulo,i))F.append(N.marcado?d("mark",{},N.texto):N.texto);let H=d("li",{role:"option",id:`${e}-op-${O}`,class:`spro-combo-op${O===c?" spro-combo-op-ativa":""}`,"data-valor":S.valor,"aria-selected":I?"true":"false"},o.multiplo?d("span",{class:"spro-combo-caixa","aria-hidden":"true"},I?_("check",12):null):null,S.cor?d("span",{class:"spro-combo-cor",style:`background:${S.cor}`}):null,S.icone?_(S.icone,15):null,d("span",{class:"spro-combo-op-textos"},F,S.descricao?d("span",{class:"spro-combo-op-desc"},S.descricao):null),S.contagem!==void 0?d("span",{class:"spro-combo-conta"},String(S.contagem)):null,!o.multiplo&&I?d("span",{class:"spro-combo-marca"},_("check",14)):null);return H.addEventListener("pointerdown",N=>N.preventDefault()),H.addEventListener("click",()=>{c=O,E(S)}),H.addEventListener("pointermove",()=>{c!==O&&(c=O,h())}),H}function h(){if(!s)return;let S=[...s.querySelectorAll('[role="option"]')];S.forEach((H,N)=>{H.classList.toggle("spro-combo-op-ativa",N===c)});let O=S[c],F=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');O?(F?.setAttribute("aria-activedescendant",O.id),O.scrollIntoView?.({block:"nearest"})):F?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;l=bn(r(),i),c>=l.length&&(c=Math.max(0,l.length-1)),s.querySelector('[role="listbox"]').replaceChildren(...l.map(P));let O=s.querySelector(".spro-combo-extras");O.replaceChildren();let I=i.trim();l.length||O.append(d("p",{class:"spro-combo-nada"},I?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let F=r().some(N=>J(N.rotulo)===J(I));if(o.criar&&I&&!F){let N=d("button",{type:"button",class:"spro-combo-criar"},_("mais",14),d("span",{},o.rotuloCriar?o.rotuloCriar(I):`Criar \u201C${I}\u201D`));N.addEventListener("pointerdown",B=>B.preventDefault()),N.addEventListener("click",()=>void b()),O.append(N)}let H=s.querySelector(".spro-combo-rodape");if(H){let N=l.filter(mo=>!n.includes(mo.valor)),B=d("button",{type:"button",class:"spro-combo-acao",disabled:!I||!N.length},`Marcar os filtrados${I&&N.length?` (${N.length})`:""}`);B.addEventListener("click",()=>{n=[...n,...N.map(mo=>mo.valor)],A(),y(),w()});let _o=d("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");_o.addEventListener("click",()=>{n=[],A(),y(),w()}),H.replaceChildren(d("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),B,_o)}h()}let k=()=>u?.posicionar();function L(S){let O=l.length,I=S.target,F=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled)")]:[],H=!!I?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(S.key==="Tab"){let B=F.indexOf(I);if(!S.shiftKey&&B<F.length-1)F[B+1]?.focus();else if(S.shiftKey&&B>=0)B>0?F[B-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{T(!0);return}S.preventDefault(),S.stopPropagation();return}if(H&&S.key!=="Escape")return;let N=!s?.querySelector(".spro-combo-busca");if(N&&S.key===" "){let B=l[c];B&&E(B),S.preventDefault(),S.stopPropagation();return}if(N&&S.key.length===1&&!S.ctrlKey&&!S.metaKey&&!S.altKey){let B=J(S.key),mo=[...l.keys()].map(wo=>(c+1+wo)%Math.max(1,O)).find(wo=>J(l[wo]?.rotulo??"").startsWith(B));mo!==void 0&&(c=mo,h()),S.preventDefault(),S.stopPropagation();return}switch(S.key){case"ArrowDown":c=O?(c+1)%O:0,h();break;case"ArrowUp":c=O?(c-1+O)%O:0,h();break;case"Home":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,h();break;case"End":if(S.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,O-1),h();break;case"Enter":{let B=l[c];B?E(B):b();break}case"Escape":T(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),A(),y(),w();break;default:return}S.preventDefault(),S.stopPropagation()}function $(S=""){if(s)return;i=S,c=S?0:(()=>{let H=bn(r(),i).findIndex(N=>N.valor===n[n.length-1]);return H<0?0:H})();let I=M()?d("input",{type:"text",class:"spro-combo-busca",placeholder:o.criar?"Buscar ou criar\u2026":"Buscar\u2026","aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:S}):null;if(I&&(I.value=S,I.addEventListener("input",()=>{i=I.value,c=0,w(),k()})),s=d("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},I?d("div",{class:"spro-combo-cabeca"},_("busca",15),I):null,d("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:I?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),d("div",{class:"spro-combo-extras"}),o.multiplo?d("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",L),u=hn(m,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>T(!1)}),m.setAttribute("aria-expanded","true"),m.setAttribute("aria-controls",`${e}-lista`),m.classList.add("spro-combo-aberto"),w(),k(),!s)return;(I??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),I&&S&&I.setSelectionRange?.(S.length,S.length)}function T(S=!1){s&&(u?.fechar(),u=null,s=null,i="",m.setAttribute("aria-expanded","false"),m.removeAttribute("aria-controls"),m.classList.remove("spro-combo-aberto"),S&&m.focus?.({preventScroll:!0}))}return m.addEventListener("click",()=>s?T(!0):$()),m.addEventListener("keydown",S=>{s||(S.key==="ArrowDown"||S.key==="ArrowUp"?(S.preventDefault(),$()):S.key.length===1&&S.key!==" "&&!S.ctrlKey&&!S.metaKey&&!S.altKey&&M()&&(S.preventDefault(),$(S.key)))}),y(),{el:m,valor:()=>[...n],definir(S,O=!1){n=[...S],y(),w(),O&&A()},atualizar(){y(),w()},definirVazio(S){g=S,y()},abrir:$,fechar:()=>T(!1)}}var vn="#tblProcessosRecebidos input[type=checkbox], #tblProcessosGerados input[type=checkbox], #tblProcessosDetalhado input[type=checkbox]",zr=o=>o.getAttribute("value")??o.closest("tr")?.id.replace(/^P/,"")??"";function _r(o){let e=new Set;for(let r of o.querySelectorAll(vn))r.checked&&zr(r)&&e.add(zr(r));return e}function xn(o,e){let r=new Set(e);for(let t of o.querySelectorAll(vn)){let a=zr(t);a&&(r.delete(a),!t.disabled&&!!t.checked!==e.has(a)&&t.click())}return[...r]}function ic(o){let e=o.composedPath?.()??[];if(e.length)return e.some(r=>r.id==="spro-grade");for(let r=o.target;r;r=r.parentNode)if(r.id==="spro-grade")return!0;return!1}function An(o,e){let r=!1,t=a=>{a&&ic(a)||r||(r=!0,queueMicrotask(()=>{r=!1,e(_r(o))}))};return o.addEventListener("click",t,!0),o.addEventListener("change",t,!0),()=>{o.removeEventListener("click",t,!0),o.removeEventListener("change",t,!0)}}function cc(o){return/acaoControleProcessos\(\s*['"][^'"]*['"]\s*,\s*true/.test(o.elemento.getAttribute("onclick")??"")}function yn(o,e){return cc(o)&&e===0?{ok:!1,motivo:"Marque ao menos um processo."}:(o.elemento.click(),{ok:!0})}var lc=o=>o instanceof Error?o.message:String(o);function En(o){if(o.tipo==="atribuicao")return{...o,para:o.de,de:o.para};let e={tipo:"marcador",id:o.id,protocolo:o.protocolo};return o.adicionar&&(e.remover=o.adicionar),o.remover&&(e.adicionar=o.remover,o.texto&&(e.texto=o.texto)),e}async function dc(o,e){try{if(o.tipo==="atribuicao")return await e.atribuir(o.protocolo,o.para),{ok:!0,desfazer:En(o)};if(o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,...o.texto?{texto:o.texto}:{}}),o.remover)try{await e.marcador(o.protocolo,{marcador:o.remover,remover:!0})}catch(r){throw o.adicionar&&await e.marcador(o.protocolo,{marcador:o.adicionar,remover:!0}).catch(()=>{}),r}return{ok:!0,desfazer:En(o)}}catch(r){return{ok:!1,erro:lc(r)}}}function Sn(o){let e=Promise.resolve();return{mover(r){let t=e.then(()=>dc(r,o));return e=t.catch(()=>{}),t}}}var qe=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,wn=Number.MAX_SAFE_INTEGER;function qr(o,e){let r=[e];return o.hora&&o.vencimento&&(r[0]=e.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&r.push(o.texto),o.sigla&&r.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),r.join(`
`)}function Pn(o,e){let r=o.vencimento;if(o.concluidoEm&&r)return{situacao:"concluido",texto:`conclu\xEDdo em ${lo(o.concluidoEm).slice(0,5)}`,dica:qr(o,`Prazo de ${lo(r)} conclu\xEDdo em ${lo(o.concluidoEm)}.`),ordem:wn,sorter:`${r} 23:59:59`};if(r){let s=Io(e,r),i=`${r} ${o.hora??"23:59"}:00`,c=qr(o,`Vence em ${lo(r)}.`);return s===0?{situacao:"hoje",texto:"vence hoje",dica:c,ordem:0,sorter:i}:s<0?{situacao:"atrasado",texto:`${qe(-s)} de atraso`,dica:c,ordem:s,sorter:i}:{situacao:"noPrazo",texto:`vence em ${qe(s)}`,dica:c,ordem:s,sorter:i}}let t=o.inicio??e,a=Io(t,e);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${qe(a)}`:`em ${qe(-a)}`,dica:qr(o,`Contando desde ${lo(t)}.`),ordem:wn-1,sorter:`${t} ${o.hora??"23:59"}:00`}}function co(o,e){return o.prazo?Pn(o.prazo,e.hoje):null}function bo(o,e){return o.vistoEm===void 0?null:Math.max(0,Math.floor((e.agora-o.vistoEm)/864e5))}function Do(o,e){return o.ultimaMov?Math.max(0,Io(o.ultimaMov,e.hoje)):null}function Mn(o,e){return e.visitaAnterior!==void 0&&o.vistoEm!==void 0&&o.vistoEm>e.visitaAnterior}function ce(o,e){let r=co(o,e);return!r||r.situacao==="concluido"||r.situacao==="desde"?null:r.ordem}var pc={resp:"resp",responsavel:"resp",atribuido:"resp",atribuicao:"resp",tipo:"tipo",marcador:"marcador",marcadores:"marcador",marc:"marcador",espec:"espec",especificacao:"espec",anot:"anot",anotacao:"anot",nota:"anot",prazo:"prazo",caixa:"caixa",idade:"caixa",novo:"novo",sigilo:"sigilo",sigiloso:"sigilo",grupo:"grupo",retorno:"retorno",protocolo:"protocolo",proc:"protocolo",processo:"protocolo",parado:"parado",mov:"parado",prio:"prio",prioridade:"prio",interessado:"interessado",interessados:"interessado"};function Fr(o){let e=[],r="",t=!1;for(let a of o)a==='"'?(t=!t,r+=a):/\s/.test(a)&&!t?(r&&e.push(r),r=""):r+=a;return r&&e.push(r),e}var uc=o=>o.replace(/^"|"$/g,"");function jr(o){let e=[],r=[];for(let t of Fr(o)){let a=t,n=!1;a.startsWith("-")&&a.length>1&&(n=!0,a=a.slice(1));let s,i=/^([a-zA-Z\u00C0-\u017F]+):(.*)$/.exec(a);if(i){let g=pc[J(i[1])];g&&(s=g,a=i[2])}let c="=";s&&/^[<>]/.test(a)&&(c=a[0],a=a.slice(1));let l=J(uc(a));if(!l&&!s)continue;let u={...s?{campo:s}:{},valor:l,original:t,negado:n,comparador:c};e.push(u),r.push({texto:t,termo:u})}return{termos:e,tokens:r}}var mc=o=>J([o.protocolo,o.protocolo.replace(/\D/g,""),o.tipo,o.especificacao,o.atribuicao?.sigla,o.atribuicao?.nome,...o.marcadores.flatMap(e=>[e.nome,e.texto]),o.anotacao?.texto,o.prazo?.texto,o.prioridade,o.interessados,o.observacao].filter(Boolean).join(" ")),vo=(o,e)=>J(o??"").includes(e),Dn=/^(s|sim|1|true|yes)$/;function Vr(o){let e=/^(\d+)\s*(d|dia|dias)?$/.exec(o);return e?Number(e[1]):null}function Hr(o,e,r){return o===null?!1:e==="<"?o<r:e===">"?o>r:o===r}function fc(o,e,r){let t=co(o,r),a=e.valor;if(a==="sem"||a==="nenhum"||a==="nao")return!o.prazo;if(a==="com"||a==="sim")return!!o.prazo;if(!t)return!1;if(a==="atrasado"||a==="atrasados"||a==="vencido")return t.situacao==="atrasado";if(a==="hoje")return t.situacao==="hoje";if(a==="concluido"||a==="concluidos")return t.situacao==="concluido";if(a==="semana"){let s=ce(o,r);return s!==null&&s>=0&&s<=7}let n=Vr(a);return n!==null?Hr(ce(o,r),e.comparador==="="?"<":e.comparador,n):vo(o.prazo?.texto,a)}function gc(o,e,r){let t=e.valor;switch(e.campo){case"resp":return t==="sem"||t==="ninguem"?!o.atribuicao:t==="eu"?!!r.eu&&J(o.atribuicao?.sigla??"")===J(r.eu):vo(o.atribuicao?.sigla,t)||vo(o.atribuicao?.nome,t);case"tipo":return vo(o.tipo,t);case"marcador":return t==="sem"||t==="nenhum"?o.marcadores.length===0:t==="com"?o.marcadores.length>0:o.marcadores.some(a=>vo(a.nome,t)||vo(a.texto,t));case"espec":return vo(o.especificacao,t);case"anot":return t==="sem"||t==="nao"?!o.anotacao:t==="com"||t==="sim"?!!o.anotacao:t==="prioridade"||t==="prioritaria"?!!o.anotacao?.prioridade:vo(o.anotacao?.texto,t);case"prazo":return fc(o,e,r);case"caixa":{let a=Vr(t);return a===null?!1:Hr(bo(o,r),e.comparador==="="?">":e.comparador,a)}case"novo":return t==="visita"?Mn(o,r):Dn.test(t)?o.naoVisualizado:t==="nao"?!o.naoVisualizado:!1;case"sigilo":return Dn.test(t)?o.sigiloso:!o.sigiloso;case"grupo":return t.startsWith("rec")?o.grupo==="recebidos":t.startsWith("ger")?o.grupo==="gerados":!1;case"retorno":return t==="sem"||t==="nao"?o.retornos.length===0:t==="atrasado"?o.retornos.some(a=>a.atrasado):t==="aguardando"?o.retornos.some(a=>a.tipo==="aguardando"):t==="programado"?o.retornos.some(a=>a.tipo==="programado"):o.retornos.length>0;case"parado":{let a=Vr(t);return a===null?!1:Hr(Do(o,r),e.comparador==="="?">":e.comparador,a)}case"prio":return vo(o.prioridade,t);case"interessado":return vo(o.interessados,t);case"protocolo":return J(o.protocolo).includes(t)||o.protocolo.replace(/\D/g,"").includes(t.replace(/\D/g,"")||"\0");default:return!0}}function hc(o,e,r){if(!o.termos.length)return!0;let t;for(let a of o.termos){let n;if(a.campo?n=gc(e,a,r):(t??=mc(e),n=t.includes(a.valor)),a.negado?n:!n)return!1}return!0}var Cn=(o,e,r)=>{let t=jr(e);return t.termos.length?o.filter(a=>hc(t,a,r)):o};function Ve(o,e){return Fr(o).filter(r=>r!==e).join(" ")}function On(o,e,r){let t=/\s/.test(r)?`"${r}"`:r,a=`${e}:${t}`,n=Fr(o);return n.includes(a)?o:[...n,a].join(" ")}var bc=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function vc(o,e=[]){return[...o.values()].sort((r,t)=>{let a=e.indexOf(r.chave),n=e.indexOf(t.chave);return a>=0||n>=0?(a<0?-1:a)-(n<0?-1:n):bc.compare(r.rotulo,t.rotulo)})}function X(o,e,r,t){let a=o.get(e);return a||(a={chave:e,rotulo:r,itens:[],...t?{tom:t}:{}},o.set(e,a)),a}var Qo=[["atrasado","Atrasados","perigo"],["hoje","Vencem hoje","aviso"],["semana","Pr\xF3ximos 7 dias","aviso"],["mes","Pr\xF3ximos 30 dias","neutro"],["depois","Depois de 30 dias","neutro"],["desde","Contando desde uma data","neutro"],["concluido","Prazo conclu\xEDdo","neutro"],["sem","Sem prazo","neutro"]];function le(o,e){let r=co(o,e);if(!r)return"sem";if(r.situacao==="concluido")return"concluido";if(r.situacao==="desde")return"desde";if(r.situacao==="atrasado")return"atrasado";if(r.situacao==="hoje")return"hoje";let t=ce(o,e)??0;return t<=7?"semana":t<=30?"mes":"depois"}var Ln=[["recente","Chegaram hoje"],["semana","Nos \xFAltimos 7 dias"],["mes","Nos \xFAltimos 30 dias"],["antigo","H\xE1 mais de 30 dias"],["desconhecido","Sem registro"]];function xc(o,e){let r=bo(o,e);return r===null?"desconhecido":r<1?"recente":r<=7?"semana":r<=30?"mes":"antigo"}function Co(o,e){return e.map(r=>o.get(r[0])).filter(r=>!!r)}function He(o,e,r){if(e==="nenhum")return[{chave:"todos",rotulo:"Todos",itens:o}];let t=new Map;for(let a of o)switch(e){case"responsavel":a.atribuicao?X(t,`u:${a.atribuicao.sigla}`,a.atribuicao.nome===a.atribuicao.sigla?a.atribuicao.sigla:`${a.atribuicao.nome} (${a.atribuicao.sigla})`).itens.push(a):X(t,"sem","Sem respons\xE1vel").itens.push(a);break;case"tipo":X(t,`t:${a.tipo||"-"}`,a.tipo||"Sem tipo").itens.push(a);break;case"marcador":if(a.marcadores.length)for(let n of a.marcadores)X(t,`m:${n.nome}`,n.nome).itens.push(a);else X(t,"sem","Sem marcador").itens.push(a);break;case"prazo":{let n=le(a,r),s=Qo.find(i=>i[0]===n);X(t,n,s[1],s[2]).itens.push(a);break}case"situacao":a.naoVisualizado?X(t,"novo","N\xE3o visualizados","aviso").itens.push(a):X(t,"lido","Visualizados").itens.push(a);break;case"grupo":X(t,a.grupo,a.grupo==="recebidos"?"Recebidos":"Gerados").itens.push(a);break;case"anotacao":a.anotacao?.prioridade?X(t,"prio","Anota\xE7\xE3o com prioridade","aviso").itens.push(a):a.anotacao?X(t,"com","Com anota\xE7\xE3o").itens.push(a):X(t,"sem","Sem anota\xE7\xE3o").itens.push(a);break;case"acompanhamento":a.acompanhamentoEspecial?X(t,"com","Em acompanhamento especial").itens.push(a):X(t,"sem","Fora do acompanhamento especial").itens.push(a);break;case"retorno":a.retornos.some(n=>n.atrasado)?X(t,"atrasado","Retorno atrasado","perigo").itens.push(a):a.retornos.some(n=>n.tipo==="aguardando")?X(t,"aguardando","Aguardando retorno").itens.push(a):a.retornos.length?X(t,"programado","Retorno programado").itens.push(a):X(t,"sem","Sem retorno").itens.push(a);break;case"caixa":{let n=xc(a,r);X(t,n,Ln.find(s=>s[0]===n)[1]).itens.push(a);break}case"autuacao":case"recebimento":case"envio":{let n=Aa(r.andamentos?.[a.id]?.[e],r.hoje);X(t,n,yr.find(s=>s[0]===n)[1]).itens.push(a);break}case"unidadeEnvio":{let n=r.andamentos?.[a.id]?.unidadeEnvio;n?X(t,`u:${n}`,n).itens.push(a):X(t,"sem","Sem informa\xE7\xE3o").itens.push(a);break}}return e==="prazo"?Co(t,Qo):e==="caixa"?Co(t,Ln):e==="autuacao"||e==="recebimento"||e==="envio"?Co(t,yr):e==="situacao"?Co(t,[["novo",""],["lido",""]]):e==="grupo"?Co(t,[["recebidos",""],["gerados",""]]):e==="anotacao"?Co(t,[["prio",""],["com",""],["sem",""]]):e==="acompanhamento"?Co(t,[["com",""],["sem",""]]):e==="retorno"?Co(t,[["atrasado",""],["aguardando",""],["programado",""],["sem",""]]):vc(t,["sem"])}var Gr={nenhum:"Sem agrupamento",responsavel:"Respons\xE1vel",tipo:"Tipo de processo",marcador:"Marcador",prazo:"Prazo",situacao:"Visualiza\xE7\xE3o",grupo:"Recebidos e gerados",anotacao:"Anota\xE7\xE3o",acompanhamento:"Acompanhamento especial",retorno:"Retorno programado",caixa:"Tempo na caixa",autuacao:"Data de autua\xE7\xE3o",recebimento:"Data de recebimento",envio:"Data de envio",unidadeEnvio:"Unidade de envio"};var Ac=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0});function Fe(o,e){let r=new Map;for(let t of o)for(let a of e(t)){let n=r.get(a.valor)??{valor:a.valor,rotulo:a.rotulo,n:0};n.n+=1,r.set(a.valor,n)}return[...r.values()].sort((t,a)=>a.n-t.n||Ac.compare(t.rotulo,a.rotulo))}function Ur(o,e){let r=Fe(o,t=>{let a=le(t,e),n=Qo.find(i=>i[0]===a)[1],s=a==="atrasado"?"atrasado":a==="hoje"?"hoje":a==="semana"?"semana":a==="sem"?"sem":a==="concluido"?"concluido":"";return s?[{valor:s,rotulo:n}]:[]});return{responsaveis:Fe(o,t=>t.atribuicao?[{valor:t.atribuicao.sigla,rotulo:`${t.atribuicao.nome} (${t.atribuicao.sigla})`}]:[{valor:"sem",rotulo:"Sem respons\xE1vel"}]),tipos:Fe(o,t=>t.tipo?[{valor:t.tipo,rotulo:t.tipo}]:[]),marcadores:Fe(o,t=>t.marcadores.length?t.marcadores.map(a=>({valor:a.nome,rotulo:a.nome})):[{valor:"sem",rotulo:"Sem marcador"}]),prazos:r}}function Br(o){let e=[];o.sigiloso&&e.push("Sigiloso"),o.naoVisualizado&&e.push("N\xE3o visualizado"),o.documentoNovo&&e.push("Documento novo"),o.urgente&&e.push("Urgente"),o.trancado&&e.push("Trancado"),o.acompanhamentoEspecial&&e.push(o.acompanhamentoGrupo?`Acompanhamento especial (${o.acompanhamentoGrupo})`:"Acompanhamento especial");for(let r of o.retornos)e.push(`${r.tipo==="aguardando"?"Aguardando retorno":"Retorno programado"}${r.atrasado?" (atrasado)":""}`);return e}function Qr(o,e){let r=co(o,e);if(!o.prazo||!r)return"";let t=o.prazo.vencimento??o.prazo.inicio;return`${t?lo(t):""}${o.prazo.hora?` ${o.prazo.hora}`:""} (${r.texto})`.trim()}var yc=(o,e,r)=>{switch(e){case"processo":return o.protocolo;case"tipo":return o.tipo;case"especificacao":return o.especificacao;case"responsavel":return o.atribuicao?o.atribuicao.nome===o.atribuicao.sigla?o.atribuicao.sigla:`${o.atribuicao.nome} (${o.atribuicao.sigla})`:"";case"marcadores":return o.marcadores.map(t=>t.texto?`${t.nome}: ${t.texto}`:t.nome).join("; ");case"prazo":return Qr(o,r);case"anotacao":return o.anotacao?.texto.replace(/\s*\n\s*/g," / ")??"";case"caixa":return Go(bo(o,r));case"parado":return Go(Do(o,r));case"sinais":return Br(o).join("; ")}};function kn(o,e,r){return[e.map(t=>No[t]),...o.map(t=>e.map(a=>yc(t,a,r)))]}var In=o=>`processos-${o}.csv`;function $n(o,e,r){let t=[];for(let a of o){let n=r&&e.has(a.chave);if(r&&t.push({tipo:"grupo",grupo:a,recolhido:n}),!n)for(let s of a.itens)t.push({tipo:"processo",processo:s,grupo:a.chave})}return t}var Xr=new Intl.Collator("pt-BR",{numeric:!0,sensitivity:"base"});function Rn(o){let e=/(\d+)\/(\d{4})-\d+\s*$/.exec(o);if(!e)return null;let r=/(\d+)\s*$/.exec(e[1].split(/[.-]/).pop()??"")?.[1]??e[1];return[Number(e[2]),Number(r)]}function Ec(o,e){let r=Rn(o),t=Rn(e);return r&&t&&(r[0]-t[0]||r[1]-t[1])||Xr.compare(o,e)}function Tn(o,e,r){switch(e){case"tipo":return o.tipo||null;case"responsavel":return o.atribuicao?.sigla??null;case"marcador":return o.marcadores[0]?.nome??null;case"prazo":{let t=co(o,r);return t?t.ordem:null}case"caixa":return bo(o,r);case"parado":return Do(o,r);case"novo":return o.naoVisualizado?0:1}}function Sc(o,e){return(r,t)=>{for(let a of o){let n;if(a.campo==="protocolo")n=Ec(r.protocolo,t.protocolo),a.decrescente&&(n=-n);else{let s=Tn(r,a.campo,e),i=Tn(t,a.campo,e);if(s===null&&i===null)continue;if(s===null)return 1;if(i===null)return-1;n=typeof s=="number"&&typeof i=="number"?s-i:Xr.compare(String(s),String(i)),a.decrescente&&(n=-n)}if(n)return n}return 0}}function Nn(o,e,r){return e.length?[...o].sort(Sc(e,r)):o}function zn(o,e,r){let t=o.findIndex(s=>s.campo===e),a=t<0?{campo:e,decrescente:!1}:o[t].decrescente?null:{campo:e,decrescente:!0};if(!r)return a?[a]:[];if(t<0)return[...o,a];let n=[...o];return a?n[t]=a:n.splice(t,1),n}var Kr=new Intl.Collator("pt-BR",{sensitivity:"base",numeric:!0}),uo="sem";function _n(o,e,r,t={}){let a=new Map,n=(i,c,l,u,g)=>{let m=a.get(i);return m||(m={chave:i,titulo:c,itens:[],aceitaSoltar:l,excedeu:!1,...u?{motivoSomenteLeitura:u}:{},...g?{tom:g}:{}},a.set(i,m)),m};if(e.colunas==="marcador")for(let i of o){i.marcadores.length||n(uo,"Sem marcador",!0).itens.push(i);for(let c of i.marcadores)n(`m:${c.nome}`,c.nome,!0).itens.push(i)}else if(e.colunas==="responsavel"){n(uo,"Sem respons\xE1vel",!0);for(let i of t.responsaveis??[])n(`u:${i.sigla}`,`${i.nome} (${i.sigla})`,!0);for(let i of o)i.atribuicao?n(`u:${i.atribuicao.sigla}`,`${i.atribuicao.nome} (${i.atribuicao.sigla})`,!0).itens.push(i):n(uo,"Sem respons\xE1vel",!0).itens.push(i)}else if(e.colunas==="prazo"){for(let[i,c,l]of Qo)i!=="desde"&&n(i,c,!1,"O prazo \xE9 definido pelo bot\xE3o de prazo, n\xE3o arrastando.",l);for(let i of o){let c=le(i,r);n(c==="desde"?"sem":c,"",!1).itens.push(i)}}else for(let i of o)n(`t:${i.tipo}`,i.tipo||"Sem tipo",!1,"O tipo do processo n\xE3o muda arrastando.").itens.push(i);let s=[...a.values()];if(e.colunas==="prazo"&&(s=s.filter(i=>i.itens.length||i.titulo)),e.colunas==="marcador"?(s=s.filter(i=>i.itens.length>0),s.sort((i,c)=>{let l=c.itens.length-i.itens.length;return l!==0?l:i.chave===uo?1:c.chave===uo?-1:Kr.compare(i.titulo,c.titulo)})):e.colunas==="responsavel"?s.sort((i,c)=>i.chave===uo?-1:c.chave===uo?1:Kr.compare(i.titulo,c.titulo)):e.colunas==="tipo"&&s.sort((i,c)=>Kr.compare(i.titulo,c.titulo)),e.ordemColunas?.length){let i=new Map(e.ordemColunas.map((c,l)=>[c,l]));s.sort((c,l)=>{let u=i.get(c.chave),g=i.get(l.chave);return u!==void 0&&g!==void 0?u-g:u!==void 0?-1:g!==void 0?1:0})}if(e.limite>0)for(let i of s)i.excedeu=i.itens.length>e.limite;return s}function qn(o,e,r){if(e===r)return[...o];let t=o.indexOf(e),a=o.indexOf(r);if(t<0||a<0)return[...o];let n=[...o];return n.splice(t,1),n.splice(a,0,e),n}var je=o=>o.slice(o.indexOf(":")+1);function Vn(o,e,r,t){if(r===t)return{ok:!1,motivo:"Mesma coluna."};if(o==="marcador"){let a=r===uo?void 0:je(r),n=t===uo?void 0:je(t);if(a&&!e.marcadores.some(l=>l.nome===a))return{ok:!1,motivo:"O processo j\xE1 n\xE3o tem esse marcador."};let s=n?e.marcadores.some(l=>l.nome===n):!1,i=a?e.marcadores.find(l=>l.nome===a)?.texto:void 0,c={tipo:"marcador",id:e.id,protocolo:e.protocolo};return a&&(c.remover=a),n&&!s&&(c.adicionar=n,i&&(c.texto=i)),!c.remover&&!c.adicionar?{ok:!1,motivo:"Nada a mudar."}:{ok:!0,movimento:c}}return o==="responsavel"?{ok:!0,movimento:{tipo:"atribuicao",id:e.id,protocolo:e.protocolo,para:t===uo?null:je(t),de:r===uo?null:je(r)}}:{ok:!1,motivo:"Esta divis\xE3o do quadro \xE9 s\xF3 de leitura."}}function Jr(o,e,r={}){if(e.tipo==="atribuicao"){if(e.para===null){let{atribuicao:a,...n}=o;return n}return{...o,atribuicao:{sigla:e.para,nome:r[e.para]??e.para}}}let t=o.marcadores;return e.remover&&(t=t.filter(a=>a.nome!==e.remover)),e.adicionar&&(t=[...t,{nome:e.adicionar,cor:"",texto:e.texto??""}]),{...o,marcadores:t}}function Xo(o,e){let r=o.ownerDocument??document;for(let n of Array.from(o.querySelectorAll("dialog.spro-dialogo-grade")))n.remove();let t=d("dialog",{class:`spro-dialogo spro-dialogo-grade${e.largo?" spro-dialogo-largo":""}`,"aria-label":e.titulo}),a=()=>{t.open?t.close():t.remove()};return t.append(d("header",{},e.icone?d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},_(e.icone,18)):null,d("h2",{},e.titulo,e.subtitulo?d("small",{class:"spro-dialogo-sub"},e.subtitulo):null),d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar",title:"Fechar (Esc)",onclick:a},_("fechar",16))),d("div",{class:"spro-dialogo-corpo"},e.conteudo)),t.addEventListener("close",()=>{t.remove(),e.aoFechar?.()}),o.append(t),typeof t.showModal=="function"?t.showModal():t.setAttribute("open",""),t.querySelector(".spro-combo, textarea, input:not([type=checkbox])")?.focus({preventScroll:!0}),{fechar:a,dlg:t}}var wc=["autuacao","recebimento","envio","unidadeEnvio"],pe=o=>wc.includes(o);function Pc(o){let e=Math.floor(o/6e4);return e<1?"agora h\xE1 pouco":e<60?`h\xE1 ${e} min`:`h\xE1 ${Math.floor(e/60)} h`}var de=(o,e,r)=>`${o} ${o===1?e:r}`;function Hn(o){let e={},r=null,t=!1,a=!1,n,s=d("div",{class:"spro-andamento",hidden:!0,role:"status","aria-live":"polite"}),i=()=>o.processos().filter(h=>!!h.link&&!h.sigiloso&&!h.naoVisualizado),c=()=>Object.values(e).filter(h=>ae(h,o.agora())),l=()=>i().filter(h=>!e[h.id]||!ae(e[h.id],o.agora())),u=()=>{let h=o.processos();return{naoVistos:h.filter(w=>w.naoVisualizado&&!w.sigiloso).length,sigilosos:h.filter(w=>w.sigiloso).length,semLink:h.filter(w=>!w.link&&!w.sigiloso&&!w.naoVisualizado).length}};async function g(){try{e=await o.armazem.lerAndamentos(o.agora())}catch{e={}}o.aoMudar()}function m(h,w){return new Promise(k=>{let L=!1,$=u(),T=[];$.naoVistos&&T.push(`${de($.naoVistos,"processo ainda n\xE3o visualizado","processos ainda n\xE3o visualizados")} nesta unidade (abrir o andamento o marcaria como visualizado ou recebido em seu nome)`),$.sigilosos&&T.push(`${de($.sigilosos,"processo sigiloso","processos sigilosos")}`);let S=d("button",{type:"button",class:"spro-botao primario",onclick:()=>{L=!0,k(!0),I.fechar()}},_("busca",15),"Consultar andamento"),O=d("div",{class:"spro-confirma-andamento"},d("p",{},"Para agrupar por data ou por unidade de envio, o SEI Pro precisa ",d("strong",{},"abrir o andamento de cada processo, um por um")," no SEI. A consulta \xE9 s\xF3 de leitura, mas faz v\xE1rias requisi\xE7\xF5es por processo e pode levar alguns minutos."),d("p",{},d("strong",{},`Ser\xE3o consultados ${de(h,"processo","processos")}.`),w?` Outros ${w} j\xE1 est\xE3o guardados e ficam como est\xE3o.`:""),T.length?d("div",{},d("p",{},"Ficam de fora:"),d("ul",{},...T.map(F=>d("li",{},F)))):null,d("p",{class:"spro-suave"},"O resultado fica guardado neste navegador por 24 horas: ao recarregar a p\xE1gina, ele reaparece sem nova consulta. Voc\xEA pode cancelar a consulta a qualquer momento."),d("div",{class:"spro-dialogo-rodape"},S)),I=Xo(o.sombra,{titulo:"Consultar o andamento dos processos",icone:"alerta",conteudo:O,aoFechar:()=>k(L)})})}function A(){if(o.semDebounce)return o.aoMudar();n||(n=setTimeout(()=>{n=void 0,t||o.aoMudar()},400))}async function y(){try{await o.armazem.gravarAndamentos(e)}catch{}}async function M(h){if(r||!h.length||t)return;let w=new AbortController;r={ctl:w,progresso:{feitos:0,total:h.length,semDados:0}},P();let k=0,L=await ya({alvos:h,sinal:w.signal,simultaneas:o.simultaneas,pausaMs:o.pausaMs,esperar:o.esperar,consultar:($,T)=>o.consultar($,T),aoResolver:($,T,S,O)=>{r&&(r.progresso=S),O||(e[$.id]={...T??{},consultadoEm:o.agora()}),k+=1,k>=10&&(k=0,y()),P(),A()}});r=null,await y(),clearTimeout(n),n=void 0,!t&&(o.aoMudar(),L.motivo==="sessao"?o.aviso("A sess\xE3o do SEI expirou: a consulta parou. O que j\xE1 foi lido ficou guardado."):L.motivo==="erros"?o.aviso("O SEI parou de responder: a consulta foi interrompida. O que j\xE1 foi lido ficou guardado."):L.motivo==="concluida"&&o.aviso(`Andamento consultado: ${de(L.progresso.feitos-L.progresso.semDados,"processo","processos")} com dados${L.progresso.semDados?`, ${L.progresso.semDados} sem informa\xE7\xE3o`:""}.`))}async function E(h){if(r)return!0;let w=h==="todos"?i():l();if(!w.length)return o.aviso(h==="todos"?"Nenhum processo eleg\xEDvel para consultar.":"Todos os processos j\xE1 t\xEAm o andamento guardado."),!1;let k=h==="todos"?0:i().length-w.length;return await m(w.length,k)?(M(w),!0):!1}async function b(){return r||!l().length?!0:await E("novo")||c().length>0}function P(){if(s.hidden=!a||t,s.hidden)return;if(r){let{feitos:$,total:T}=r.progresso;s.replaceChildren(d("span",{},`Consultando o andamento dos processos\u2026 ${$} de ${T}`),d("progress",{max:String(T),value:String($),"aria-label":"Progresso da consulta"}),d("button",{type:"button",class:"spro-link",onclick:()=>r?.ctl.abort()},"Cancelar"));return}let h=c();if(!h.length){s.replaceChildren(d("span",{},'O andamento dos processos ainda n\xE3o foi consultado, por isso todos aparecem em "Sem informa\xE7\xE3o".'),d("button",{type:"button",class:"spro-link",onclick:()=>void E("novo")},"Consultar agora"));return}let w=Math.min(...h.map($=>$.consultadoEm)),k=w+Er,L=l().length;s.replaceChildren(d("span",{},`Andamento consultado ${Pc(o.agora()-w)} (guardado at\xE9 ${new Date(k).toLocaleString("pt-BR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})})`,L?` \xB7 ${de(L,"processo ainda sem consulta","processos ainda sem consulta")}`:""),d("button",{type:"button",class:"spro-link",onclick:()=>void E("todos")},_("atualizar",13)," Atualizar"))}return{faixa:s,carregar:g,dados:()=>e,definirAtivo(h){a=h,P()},atualizarFaixa:P,aoEscolherAgrupamento:b,pedir:E,emAndamento:()=>!!r,fechar(){t=!0,r?.ctl.abort(),clearTimeout(n)}}}var Wr="application/x-spro-cartao",Ge="application/x-spro-coluna";function Mc(o,e,r){let t=co(o,r.ctx),a=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${o.protocolo}`});a.checked=r.selecionados.has(o.id),a.addEventListener("change",()=>r.aoSelecionar(o.id,a.checked));let n=t?"Editar o prazo":"Definir um prazo",s=r.aoAbrirPrazo?d("button",{type:"button",class:"spro-prazo-b",title:t?`${t.dica}

${n}`:n,"aria-label":n,onclick:l=>{l.preventDefault(),l.stopPropagation(),r.aoAbrirPrazo?.(o.id)}},t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`},t.texto):d("span",{class:"spro-prazo-vazio"},"definir")):t?d("span",{class:`spro-prazo spro-prazo-${t.situacao}`,title:t.dica},t.texto):null,i=o.anotacao?.texto?.trim(),c=d("div",{class:`spro-cartao${a.checked?" spro-sel":""}`,draggable:"true","data-id":o.id,"data-de":e},d("div",{class:"spro-cartao-topo"},a,d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",draggable:"false"},o.protocolo)),o.tipo?d("div",{class:"spro-cartao-tipo"},o.tipo):null,o.especificacao?d("div",{class:"spro-cartao-espec",title:o.especificacao},o.especificacao):null,i?d("div",{class:`spro-cartao-anotacao${o.anotacao?.prioridade?" spro-cartao-anotacao-prio":""}`,title:o.anotacao?.autor?`${i}
\u2014 ${o.anotacao.autor}`:i},i):null,d("div",{class:"spro-cartao-rodape"},s,o.atribuicao?d("span",{class:"spro-avatar",title:o.atribuicao.nome},o.atribuicao.sigla.slice(0,2).toUpperCase()):null));return c.addEventListener("dragstart",l=>{l.stopPropagation(),l.dataTransfer?.setData(Wr,JSON.stringify({id:o.id,de:e})),l.dataTransfer?.setData("text/plain",o.protocolo),l.dataTransfer&&(l.dataTransfer.effectAllowed="move"),c.classList.add("spro-arrastando")}),c.addEventListener("dragend",()=>c.classList.remove("spro-arrastando")),c}function Dc(o,e,r){let t=d("div",{class:"spro-col-corpo"},...o.itens.map(c=>Mc(c,o.chave,r)));o.itens.length||t.append(d("div",{class:"spro-col-vazia"},o.aceitaSoltar?"Solte aqui":"Vazia"));let a=r.cfg.limite,n=!!r.aoReordenarColuna,s=d("div",{class:`spro-col-topo${n?" spro-col-arrastavel":""}`,...n?{draggable:"true",title:"Arraste para reordenar a coluna"}:{}},n?d("span",{class:"spro-col-alca","aria-hidden":"true"},"\u22EE\u22EE"):null,d("span",{class:"spro-col-titulo",title:o.titulo},o.titulo),d("span",{class:`spro-col-n${o.excedeu?" spro-excedeu":""}`,title:o.excedeu?`Passou do limite de ${a}`:void 0},a>0?`${o.itens.length}/${a}`:String(o.itens.length)),o.aceitaSoltar?null:d("span",{class:"spro-col-trava",title:o.motivoSomenteLeitura},no("bloquear",13))),i=d("section",{class:`spro-col${o.tom?` spro-tom-${o.tom}`:""}${o.excedeu?" spro-col-cheia":""}`,"data-chave":o.chave},s,t);return n&&(s.addEventListener("dragstart",c=>{c.stopPropagation(),c.dataTransfer?.setData(Ge,o.chave),c.dataTransfer?.setData("text/plain",o.titulo),c.dataTransfer&&(c.dataTransfer.effectAllowed="move"),i.classList.add("spro-col-arrastando")}),s.addEventListener("dragend",()=>i.classList.remove("spro-col-arrastando"))),i.addEventListener("dragover",c=>{if(n&&c.dataTransfer?.types.includes(Ge)){c.preventDefault(),i.classList.add("spro-col-alvo");return}c.dataTransfer?.types.includes(Wr)&&o.aceitaSoltar&&(c.preventDefault(),i.classList.add("spro-alvo"))}),i.addEventListener("dragleave",()=>{i.classList.remove("spro-alvo"),i.classList.remove("spro-col-alvo")}),i.addEventListener("drop",c=>{if(i.classList.remove("spro-alvo"),i.classList.remove("spro-col-alvo"),n&&c.dataTransfer?.types.includes(Ge)){let u=c.dataTransfer.getData(Ge);if(u){c.preventDefault(),u!==o.chave&&r.aoReordenarColuna?.(u,o.chave,e);return}}let l=c.dataTransfer?.getData(Wr);if(l){c.preventDefault();try{let{id:u,de:g}=JSON.parse(l);r.aoMover(u,g,o.chave)}catch{}}}),i}function Fn(o){let e=d("div",{class:"spro-quadro"});e.style.setProperty("--spro-col-largura",`${o.cfg.larguraColuna??280}px`);let r=t=>{let a=_n(t,o.cfg,o.ctx,o.extras),n=a.map(s=>s.chave);return d("div",{class:"spro-colunas"},...a.map(s=>Dc(s,n,o)))};if(o.cfg.raiasPorResponsavel&&o.cfg.colunas!=="responsavel")for(let t of He(o.processos,"responsavel",o.ctx))e.append(d("div",{class:"spro-raia"},d("div",{class:"spro-raia-nome"},t.rotulo,d("span",{class:"spro-grupo-n"},String(t.itens.length))),r(t.itens)));else e.append(r(o.processos));return o.processos.length||e.prepend(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro.")),e}var jn=".spro-fav-estrela, .spro-prj-ic, .spro-dem-cx",Cc=[".spro-fav-",".spro-prj-",".spro-dem-cx"],Gn=(o,e)=>o.getElementById(`P${e}`)?.querySelectorAll("td")[1],Ue=["spro-fav-estrela","spro-prj-ic","spro-dem-cx"],Zr=o=>Ue.find(e=>o.classList.contains(e))??"";function Oc(o,e,r){for(let t of Array.from(o.attributes))!e.hasAttribute(t.name)&&t.name!=="data-spro-id"&&t.name!=="data-tip"&&o.removeAttribute(t.name);for(let t of Array.from(e.attributes))t.name!=="aria-busy"&&t.name!=="title"&&o.getAttribute(t.name)!==t.value&&o.setAttribute(t.name,t.value);e.getAttribute("title")&&o.getAttribute("data-tip")!==e.getAttribute("title")&&o.setAttribute("data-tip",e.getAttribute("title")),o.removeAttribute("aria-busy"),o.setAttribute("data-spro-id",r),o.innerHTML!==e.innerHTML&&o.replaceChildren(...Array.from(e.cloneNode(!0).childNodes))}function Un(){let o=new Map;return function(r,t){let a=Gn(r,t),n=new Set,s=[];if(a){let i=[...a.querySelectorAll(jn)].sort((c,l)=>Ue.indexOf(Zr(c))-Ue.indexOf(Zr(l)));for(let c of i){let l=`${t}|${Zr(c)}`;n.add(l);let u=o.get(l);u?Oc(u,c,t):(u=c.cloneNode(!0),u.removeAttribute("aria-busy"),u.setAttribute("data-spro-id",t),o.set(l,u)),s.push(u)}}for(let i of Ue)n.has(`${t}|${i}`)||o.delete(`${t}|${i}`);return s}}function Yr(o,e){let r=Gn(o,e);return r?[...r.querySelectorAll(`${jn}, .acompanhamentoesp_icon`)].map(t=>`${t.className}|${t.getAttribute("aria-pressed")??""}|${t.getAttribute("aria-label")??""}|${t.hasAttribute("data-atraso")?1:0}|${t.querySelector('[class$="-n"]')?.textContent??""}`).join(";"):""}function Bn(o){let e=[];for(let r of Array.from(o.styleSheets??[])){let t;try{t=r.cssRules}catch{continue}for(let a of Array.from(t)){let n=a.cssText;Cc.some(s=>n.includes(s))&&e.push(n)}}return e.join(`
`)}function Qn(o,e){let r=s=>s.trim().toLowerCase(),t=new Map;for(let s of e)s.nome.trim()&&!t.has(r(s.nome))&&t.set(r(s.nome),{nome:s.nome.trim(),texto:s.texto.trim().slice(0,250)});let a=new Map(o.map(s=>[r(s.nome),s])),n=[];for(let s of o)t.has(r(s.nome))||n.push({tipo:"remover",nome:s.nome});for(let[s,i]of t)a.has(s)||n.push({tipo:"adicionar",nome:i.nome,texto:i.texto});for(let[s,i]of t){let c=a.get(s);c&&c.texto.trim()!==i.texto&&n.push({tipo:"texto",nome:c.nome,texto:i.texto})}return n}function Xn(o,e,r=()=>""){let t=[...o.marcadores];for(let a of e)a.tipo==="remover"?t=t.filter(n=>n.nome!==a.nome):a.tipo==="adicionar"?t.push({nome:a.nome,cor:r(a.nome),texto:a.texto}):t=t.map(n=>n.nome===a.nome?{...n,texto:a.texto}:n);return{...o,marcadores:t}}function Be(o){return o.replace(/\r\n?/g,`
`).trim().slice(0,500)}function Kn(o,e,r,t=""){let a=Be(e);if(!a){let{anotacao:n,...s}=o;return s}return{...o,anotacao:{texto:a,autor:o.anotacao?.autor??t,prioridade:r}}}function Jn(o,e){if(!e){let{atribuicao:r,...t}=o;return t}return{...o,atribuicao:e}}function Qe(o,e,r,t,a){let n=new Set([o.id]);if(t)for(let s of e)n.add(s);return r.filter(s=>n.has(s.id)&&a(s))}function ot(o,e){let r=new Set(e.marcadores.map(t=>t.nome.trim().toLowerCase()));return o.filter(t=>{let a=r.has(t.nome.trim().toLowerCase());return t.tipo==="adicionar"?!a:a})}var Lc=30;function kc(o){let e=[],r=(a,n)=>{let s=a?.getAttribute("data-tarefa");e.push({marca:s==null?null:s==="x",texto:n.replace(/\u00a0/g," ").replace(/\n+$/,"")})},t="";for(let a of Array.from(o.childNodes))if(a.nodeType===3)t+=a.textContent??"";else if(a.nodeType===1){let n=a;if(t){for(let s of t.split(`
`))r(null,s);t=""}n.tagName==="BR"?r(null,""):r(n,n.textContent??"")}if(t)for(let a of t.split(`
`))r(null,a);return e.length?e:[{marca:null,texto:""}]}function Wn(o,e){let r=o.ownerDocument;o.replaceChildren(...e.map(t=>{let a=r.createElement("div");return a.className="spro-pi-linha",t.marca!==null&&a.setAttribute("data-tarefa",t.marca?"x":"o"),t.texto?a.textContent=t.texto:a.append(r.createElement("br")),a}))}function Zn(o,e){let r=o.prioridade,t=()=>{},a=d("div",{class:"spro-pi-editor",contenteditable:"true",role:"textbox","aria-multiline":"true","aria-label":"Anota\xE7\xE3o",spellcheck:"true"}),n=d("span",{class:"spro-pi-contador"}),s=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Lista de tarefas (nas linhas selecionadas)","aria-label":"Lista de tarefas"},_("check",16)),i=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Prioridade","aria-label":"Prioridade"},no("prioridade",16)),c=d("button",{type:"button",class:"spro-pi-bt","data-tip":"Inserir a data de hoje","aria-label":"Inserir a data de hoje"},_("calendario",16)),l=d("div",{class:"spro-pi-barra"},s,c,i,n),u=d("div",{class:"spro-pi"},a,l),g=()=>kc(a),m=()=>$a(g());function A(){u.classList.toggle("spro-pi-prio",r),i.setAttribute("aria-pressed",String(r));let E=m().length;n.textContent=`${E}/${500}`,n.classList.toggle("spro-pi-estouro",E>500),t()}Wn(a,se(o.texto)),A();function y(){let E=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,b=Array.from(a.children),P=$=>{let T=$;for(;T&&T.parentNode!==a;)T=T.parentNode;return T?b.indexOf(T):-1};if(!E||!E.rangeCount)return[];let h=P(E.anchorNode),w=P(E.focusNode);if(h<0&&w<0)return[];let[k,L]=[Math.min(h<0?w:h,w<0?h:w),Math.max(h,w)];return Array.from({length:L-k+1},($,T)=>k+T)}let M=E=>{Wn(a,E),A()};for(let E of[s,c,i])E.addEventListener("mousedown",b=>b.preventDefault());return s.addEventListener("click",()=>{let E=g(),b=y();M(wr(E,b.length?b:E.map((P,h)=>h).filter(P=>P===E.length-1))),a.focus()}),i.addEventListener("click",()=>{r=!r,A()}),c.addEventListener("click",()=>{a.focus();let E=lo(Fo());e.ownerDocument.execCommand?.("insertText",!1,E)||(a.append(E),A())}),a.addEventListener("input",A),a.addEventListener("paste",E=>{E.preventDefault();let b=E.clipboardData?.getData("text/plain")??"";e.ownerDocument.execCommand?.("insertText",!1,b.replace(/\r\n?/g,`
`))}),a.addEventListener("mousedown",E=>{let b=E.target.closest?.(".spro-pi-linha");!b||!b.hasAttribute("data-tarefa")||E.clientX-b.getBoundingClientRect().left>Lc||(E.preventDefault(),M(Ra(g(),Array.from(a.children).indexOf(b))))}),a.addEventListener("keydown",E=>{if(E.key!=="Enter"||E.shiftKey)return;let b=e.getSelection?.()??e.ownerDocument.getSelection?.()??null,P=y(),h=g();b?.isCollapsed&&P.length===1&&h[P[0]]?.marca!==null&&!h[P[0]].texto.trim()&&(E.preventDefault(),M(wr(h,[P[0]])))}),{el:u,texto:m,prioridade:()=>r,aoMudar:E=>{t=E},foco:()=>{a.focus()}}}var Ic=[[/azul_marinho|marinho/,"#1d3557"],[/azul_claro|ciano|celeste/,"#2a9fd6"],[/azul/,"#2563c9"],[/verde_escuro/,"#166534"],[/verde|lima/,"#2e9e4f"],[/amarelo/,"#e0b000"],[/laranja/,"#ee7d11"],[/vermelho/,"#d1352b"],[/rosa|magenta/,"#d6409f"],[/roxo|violeta|lilas/,"#7048c6"],[/marrom/,"#8a5a3c"],[/preto/,"#222831"],[/cinza/,"#7b838c"]];function ue(o){let e=o.toLowerCase();return Ic.find(([r])=>r.test(e))?.[1]??"#8b939c"}var Rc=o=>o instanceof Error?o.message:String(o);async function et(o,e,r,t,a){let n=0,s=[],i=0;for(let c of e){let l=o.todos().find(u=>u.id===c.id)??c;o.aplicarLocal(l.id,r(l));try{await o.gravar(()=>t(l)),n+=1}catch(u){o.aplicarLocal(l.id,l),s.push(`${l.protocolo}: ${Rc(u)}`)}a?.(i+=1,e.length)}return{ok:n,falhas:s}}function rt(o,e,r){e.falhas.length?o.aviso(`${r}: ${e.ok} ok, ${e.falhas.length} com erro \u2014 ${e.falhas[0]}`):o.aviso(`${r}: ${e.ok} ${e.ok===1?"processo atualizado":"processos atualizados"}.`)}function Yn(o,e,r){let t=Qe(e,o.selecionados(),o.todos(),!0,r).filter(n=>n.id!==e.id);if(!t.length)return null;let a=d("input",{type:"checkbox"});return{el:d("label",{class:"spro-rotulo-linha spro-estender"},a,` Aplicar tamb\xE9m aos ${t.length} ${t.length===1?"outro selecionado":"outros selecionados"}`),marcado:()=>a.checked,n:()=>t.length}}var tt=(...o)=>d("div",{class:"spro-dialogo-rodape"},...o),at=(o="Salvar")=>d("button",{type:"button",class:"spro-botao primario"},_("check",15),o);function os(o,e){let r=[],t=e.atribuicao?.sigla??"",a=Mo({rotulo:"Respons\xE1vel",icone:"pessoa",busca:!0,larguraLista:320,vazio:"Escolher o respons\xE1vel\u2026",opcoes:()=>[{valor:"",rotulo:"Sem respons\xE1vel",descricao:"Remove a atribui\xE7\xE3o"},...r.map(u=>({valor:u.sigla,rotulo:u.nome===u.sigla?u.sigla:u.nome,descricao:u.sigla}))],valor:[t],aoMudar:([u])=>{t=u??"",c()}}),n=Yn(o,e,()=>!0),s=at(),i=d("p",{class:"spro-suave"},"Carregando os usu\xE1rios da unidade\u2026"),c=()=>{s.disabled=!r.length||t===(e.atribuicao?.sigla??"")},l=Xo(o.raiz,{titulo:"Respons\xE1vel",subtitulo:e.protocolo,icone:"pessoa",conteudo:d("div",{class:"spro-form"},d("label",{class:"spro-campo-rotulo"},"Atribuir a",a.el),i,n?.el??null,tt(s))});o.extras().then(u=>{r=u.responsaveis??[],i.textContent=r.length?"":"N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade.",a.atualizar(),c()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os usu\xE1rios da unidade."}),c(),s.addEventListener("click",async()=>{let u=t?r.find(m=>m.sigla===t)??{sigla:t,nome:t}:null,g=n?.marcado()?Qe(e,o.selecionados(),o.todos(),!0,()=>!0):[e];s.disabled=!0,l.fechar(),rt(o,await et(o,g,m=>Jn(m,u),m=>o.atribuir(m.protocolo,u?.sigla??null)),u?`Respons\xE1vel: ${u.nome}`:"Atribui\xE7\xE3o removida")})}function es(o,e){let r=Zn({texto:e.anotacao?.texto??"",prioridade:e.anotacao?.prioridade??!1},o.raiz),t=at(),a=e.anotacao?d("button",{type:"button",class:"spro-botao perigo"},_("lixeira",15),"Remover anota\xE7\xE3o"):null,n=()=>{let c=Be(r.texto()),l=r.texto().length>500;t.disabled=!c||l||c===(e.anotacao?.texto??"")&&r.prioridade()===(e.anotacao?.prioridade??!1)};r.aoMudar(n);let s=Xo(o.raiz,{titulo:"Anota\xE7\xE3o",subtitulo:e.protocolo,icone:"nota",largo:!0,conteudo:d("div",{class:"spro-form"},r.el,e.anotacao?.autor?d("p",{class:"spro-suave"},`\xDAltima edi\xE7\xE3o: ${e.anotacao.autor}`):null,tt(a,t))});r.foco(),n();let i=async(c,l,u)=>{s.fechar(),rt(o,await et(o,[e],g=>Kn(g,c,l,o.autor),g=>o.anotar(g.protocolo,{texto:c,prioridade:l})),u)};t.addEventListener("click",()=>void i(Be(r.texto()),r.prioridade(),"Anota\xE7\xE3o salva")),a?.addEventListener("click",()=>void i("",!1,"Anota\xE7\xE3o removida"))}function rs(o,e){let r=e.marcadores.map(m=>({nome:m.nome,texto:m.texto})),t=[],a=d("div",{class:"spro-marcadores-lista"}),n=Yn(o,e,m=>!m.sigiloso),s=at(),i=d("p",{class:"spro-suave"},"Carregando os marcadores da unidade\u2026"),c=Mo({rotulo:"Adicionar marcador",icone:"etiqueta",busca:!0,larguraLista:320,vazio:"Adicionar marcador\u2026",opcoes:()=>t.filter(m=>!r.some(A=>A.nome.toLowerCase()===m.toLowerCase())).map(m=>({valor:m,rotulo:m,cor:ue(o.corDoMarcador(m))})),aoMudar:([m])=>{m&&(r=[...r,{nome:m,texto:""}],c.definir([],!1),u())}}),l=()=>Qn(e.marcadores,r);function u(){a.replaceChildren(...r.length?r.map((m,A)=>{let y=d("input",{type:"text",class:"spro-campo",maxlength:String(250),placeholder:"Texto do marcador (opcional)","aria-label":`Texto de ${m.nome}`,value:m.texto});return y.addEventListener("input",()=>{r[A]={...m,texto:y.value},s.disabled=!l().length}),d("div",{class:"spro-marcador-linha"},d("span",{class:"spro-marcador",title:m.nome},d("i",{style:`background:${ue(o.corDoMarcador(m.nome))}`}),m.nome),y,d("button",{type:"button",class:"spro-botao-icone pequeno",title:`Remover ${m.nome}`,"aria-label":`Remover ${m.nome}`,onclick:()=>{r=r.filter((M,E)=>E!==A),u()}},_("fechar",13)))}):[d("p",{class:"spro-suave"},"Nenhum marcador. Adicione abaixo.")]),c.atualizar(),s.disabled=!l().length}let g=Xo(o.raiz,{titulo:"Marcadores",subtitulo:e.protocolo,icone:"etiqueta",conteudo:d("div",{class:"spro-form"},a,c.el,i,n?.el??null,tt(s))});u(),o.extras().then(m=>{t=m.marcadores??[],i.textContent=t.length?"":"N\xE3o foi poss\xEDvel ler os marcadores da unidade.",u()}).catch(()=>{i.textContent="N\xE3o foi poss\xEDvel ler os marcadores da unidade."}),s.addEventListener("click",async()=>{let m=l();if(!m.length)return;let A=n?.marcado()?Qe(e,o.selecionados(),o.todos(),!0,y=>!y.sigiloso):[e];g.fechar(),rt(o,await et(o,A,y=>Xn(y,ot(m,y),o.corDoMarcador),async y=>{for(let M of ot(m,y))M.tipo==="remover"?await o.marcar(y.protocolo,{marcador:M.nome,remover:!0}):await o.marcar(y.protocolo,{marcador:M.nome,texto:M.texto})}),"Marcadores")})}function ts(o,e,r,t,a=8){let n=Math.max(1,e),s=t>0?t:n*40,i=Math.max(0,Math.min(o,Math.floor(r/n)-a)),c=Math.min(o,Math.ceil((r+s)/n)+a);return{inicio:i,fim:c,antes:i*n,depois:Math.max(0,o-c)*n}}var Ke={compacta:34,confortavel:48},Tc={processo:"minmax(340px, 370px)",tipo:"minmax(120px, 1.2fr)",especificacao:"minmax(200px, 2fr)",responsavel:"minmax(90px, 130px)",marcadores:"minmax(120px, 1.3fr)",prazo:"minmax(120px, 150px)",anotacao:"minmax(130px, 1.4fr)",caixa:"84px",parado:"84px",sinais:"minmax(110px, 150px)"},Nc={processo:"protocolo",tipo:"tipo",responsavel:"responsavel",marcadores:"marcador",prazo:"prazo",caixa:"caixa",parado:"parado",sinais:"novo"};function zc(o){let e=o.trim().split(/\s+/);return e.length>2?`${e[0]} ${e[e.length-1]}`:o}function Je(o,e){return d("button",{type:"button",class:"spro-lapis",title:o,"aria-label":o,onclick:r=>{r.preventDefault(),r.stopPropagation(),e()}},_("lapis",13))}var so=(o,e,r)=>d(o,{class:e},r);function _c(o,e,r,t){let a=so("div",`spro-c spro-c-${e}`);switch(e){case"processo":{let n=t.icones(o.id),s=u=>n.find(g=>g.classList.contains(u))??d("span",{class:"spro-slot"}),i=o.acompanhamentoEspecial?d("span",{class:"spro-acomp",title:o.acompanhamentoGrupo?`Acompanhamento especial: ${o.acompanhamentoGrupo}`:"Acompanhamento especial"},_("olho",15)):d("span",{class:"spro-slot"});a.append(d("span",{class:"spro-icones"},s("spro-fav-estrela"),s("spro-prj-ic"),s("spro-dem-cx"),i));let c=o.grupo==="recebidos";t.semOrigem||a.append(d("span",{class:`spro-origem spro-origem-${o.grupo}`,title:c?"Processo recebido: veio de outra unidade":"Processo gerado: autuado nesta unidade",role:"img","aria-label":c?"Processo recebido":"Processo gerado"},no(c?"recebido":"gerado",16)));let l=d("a",{class:`spro-proc${o.naoVisualizado?" spro-novo":""}`,href:o.link??"#",title:"Abrir o processo"},o.protocolo);a.append(l),o.link&&a.append(d("a",{class:"spro-nova-guia",href:o.link,target:"_blank",rel:"noopener",title:"Abrir em nova guia","aria-label":`Abrir ${o.protocolo} em nova guia`},no("novaGuia",14))),o.sigiloso&&a.append(d("span",{class:"spro-sigilo",title:"Processo sigiloso"},"sigiloso")),o.urgente&&a.append(d("span",{class:"spro-urgente",title:"Marcado como urgente"},"urgente")),o.trancado&&a.append(d("span",{class:"spro-sigilo",title:"Processo trancado"},"trancado"));break}case"tipo":a.append(so("span","spro-corta",o.tipo)),a.title=o.tipo;break;case"especificacao":{if(a.classList.add("spro-editavel"),t.editando===o.id){let n=d("input",{type:"text",class:"spro-espec-input",maxlength:"100",value:t.rascunho,"aria-label":"Especifica\xE7\xE3o do processo"});n.addEventListener("input",()=>t.aoDigitarEspec(n.value)),n.addEventListener("keydown",l=>{l.stopPropagation(),l.key==="Enter"?t.aoSalvarEspec(o.id):l.key==="Escape"&&t.aoCancelarEspec()});let s=l=>l.preventDefault(),i=d("button",{type:"button",class:"spro-lapis spro-lapis-ok",title:"Salvar (Enter)","aria-label":"Salvar",onclick:()=>t.aoSalvarEspec(o.id)},_("check",14)),c=d("button",{type:"button",class:"spro-lapis",title:"Cancelar (Esc)","aria-label":"Cancelar",onclick:()=>t.aoCancelarEspec()},_("fechar",14));i.addEventListener("pointerdown",s),c.addEventListener("pointerdown",s),a.append(d("span",{class:"spro-edicao"},n,i,c));break}a.append(so("span","spro-corta",o.especificacao)),a.title=o.especificacao,o.sigiloso||a.append(Je("Editar a especifica\xE7\xE3o",()=>t.aoEditarEspec(o.id)));break}case"responsavel":a.classList.add("spro-editavel"),o.atribuicao?(a.append(so("span","spro-corta",t.nomesCompletos?zc(o.atribuicao.nome):o.atribuicao.sigla)),a.title=t.nomesCompletos?o.atribuicao.sigla:o.atribuicao.nome):a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"atribuir")),a.append(Je(o.atribuicao?"Mudar o respons\xE1vel":"Atribuir a algu\xE9m",()=>t.aoEditar(o.id,"responsavel")));break;case"marcadores":a.classList.add("spro-editavel"),o.marcadores.length&&a.append(d("span",{class:"spro-pilulas"},...o.marcadores.map(n=>d("span",{class:"spro-marcador",title:n.texto?`${n.nome}: ${n.texto}`:n.nome},d("i",{style:`background:${ue(n.cor)}`}),n.nome)))),o.sigiloso||(o.marcadores.length||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"marcar")),a.append(Je(o.marcadores.length?"Editar os marcadores":"Adicionar marcador",()=>t.aoEditar(o.id,"marcadores"))));break;case"prazo":{let n=co(o,r);a.classList.add("spro-editavel");let s=n?"Editar o prazo":"Definir um prazo",i=d("button",{type:"button",class:"spro-prazo-b",title:n?`${Qr(o,r)}
${n.dica}

${s}`:s,"aria-label":s,onclick:c=>{c.preventDefault(),c.stopPropagation(),t.aoAbrirPrazo(o.id)}},n?so("span",`spro-prazo spro-prazo-${n.situacao}`,n.texto):so("span","spro-prazo-vazio","definir"));a.append(i,d("span",{class:"spro-lapis spro-lapis-fixo","aria-hidden":"true"},_("lapis",13)));break}case"anotacao":a.classList.add("spro-editavel"),o.anotacao?(a.append(so("span",`spro-corta${o.anotacao.prioridade?" spro-prio":""}`,Ta(o.anotacao.texto))),a.setAttribute("data-tip-nota",o.anotacao.texto),a.setAttribute("data-tip-autor",o.anotacao.autor)):o.sigiloso||a.append(d("span",{class:"spro-prazo-vazio spro-vazio-edicao"},"anotar")),o.sigiloso||a.append(Je(o.anotacao?"Editar a anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",()=>t.aoEditar(o.id,"anotacao")));break;case"caixa":{let n=Go(bo(o,r));a.append(so("span","spro-suave",n)),n&&(a.title=sn);break}case"parado":{let n=Do(o,r);a.append(so("span","spro-suave",Go(n))),n!==null&&(a.title="Dias desde a \xFAltima movimenta\xE7\xE3o (vis\xE3o detalhada do SEI).");break}case"sinais":for(let n of Br(o))a.append(so("span","spro-sinal",n));break}return a}function as(o){let e=o,r=so("div","spro-cab"),t=so("div","spro-corpo"),a=d("div",{class:"spro-rolagem",tabindex:"-1"},t),n=d("div",{class:"spro-tabela",role:"table"},r,a),s="",i=!1,c=!1,l=()=>`36px ${e.colunas.map(b=>Tc[b]).join(" ")}`;function u(){r.replaceChildren(),r.style.gridTemplateColumns=l();let b=e.linhas.filter(w=>w.tipo==="processo").map(w=>w.processo.id),P=b.filter(w=>e.selecionados.has(w)).length,h=d("input",{type:"checkbox",class:"spro-cb","aria-label":"Marcar todos os processos vis\xEDveis",title:"Marcar todos os vis\xEDveis",disabled:!b.length});h.checked=b.length>0&&P===b.length,h.indeterminate=P>0&&P<b.length,h.addEventListener("change",()=>e.aoMarcarGrupo(b,h.checked)),r.append(so("div","spro-c spro-c-cb")),r.firstElementChild.append(h);for(let w of e.colunas){let k=Nc[w],L=k?e.ordem.findIndex(T=>T.campo===k):-1,$=d("div",{class:`spro-c spro-th${k?" spro-ordenavel":""}`,role:"columnheader",...L>=0?{"aria-sort":e.ordem[L].decrescente?"descending":"ascending"}:{}});if(k){let T=d("button",{type:"button",class:"spro-th-b",title:"Ordenar (Shift acrescenta outro crit\xE9rio)",onclick:S=>e.aoOrdenar(k,S.shiftKey)},No[w]);L>=0&&T.append(d("span",{class:"spro-seta-ordem"},`${e.ordem[L].decrescente?"\u2193":"\u2191"}${e.ordem.length>1?L+1:""}`)),$.append(T)}else $.append(No[w]);r.append($)}}function g(b,P){let h=e.selecionados.has(b.id),w=d("input",{type:"checkbox",class:"spro-cb","aria-label":`Marcar ${b.protocolo}`,title:b.naPaginaAtual?void 0:`Est\xE1 na p\xE1gina ${b.pagina+1} do SEI: as a\xE7\xF5es do SEI aceitam processos de uma p\xE1gina por vez`});w.checked=h,w.addEventListener("change",()=>e.aoSelecionar(b.id,w.checked));let k=d("div",{class:`spro-linha${h?" spro-sel":""}${e.foco===b.id?" spro-foco":""}${b.urgente?" spro-linha-urgente":""}`,role:"row","data-id":b.id,"data-grupo":P});k.style.gridTemplateColumns=l(),k.style.height=`${Ke[e.densidade]}px`;let L=so("div","spro-c spro-c-cb");return L.append(w),k.append(L,...e.colunas.map($=>_c(b,$,e.ctx,e))),k}function m(b){let P=b.grupo.itens.map(k=>k.id),h=d("button",{type:"button",class:"spro-grupo-b","aria-expanded":String(!b.recolhido),onclick:()=>e.aoGrupo(b.grupo.chave)},d("span",{class:`spro-grupo-seta${b.recolhido?" spro-fechado":""}`},no("seta",14)),d("span",{class:"spro-grupo-nome"},b.grupo.rotulo),d("span",{class:"spro-grupo-n"},String(b.grupo.itens.length))),w=d("div",{class:`spro-grupo${b.grupo.tom?` spro-tom-${b.grupo.tom}`:""}`,role:"row"},h);if(P.length){let k=P.every(L=>e.selecionados.has(L));w.append(d("button",{type:"button",class:"spro-link",onclick:()=>e.aoMarcarGrupo(P,!k)},k?"Desmarcar grupo":"Marcar grupo"))}return w.style.height=`${Ke[e.densidade]}px`,w}function A(){let b=Ke[e.densidade],P=ts(e.linhas.length,b,a.scrollTop||0,a.clientHeight||0);t.style.paddingTop=`${P.antes}px`,t.style.paddingBottom=`${P.depois}px`,t.replaceChildren(...e.linhas.slice(P.inicio,P.fim).map(w=>w.tipo==="grupo"?m(w):g(w.processo,w.grupo)));let h=t.querySelector(".spro-espec-input");h&&i?(i=!1,h.focus(),h.setSelectionRange?.(h.value.length,h.value.length)):h&&h.getRootNode()instanceof ShadowRoot&&h.getRootNode().activeElement!==h&&c&&h.focus()}let y=0;a.addEventListener("scroll",()=>{if(y)return;let b=a.ownerDocument.defaultView;if(!b?.requestAnimationFrame)return A();y=b.requestAnimationFrame(()=>{y=0,A()})});function M(b){let P=b.colunas.join()!==e.colunas.join()||b.ordem!==e.ordem||b.selecionados!==e.selecionados;b.editando&&b.editando!==e.editando&&(i=!0),c=!!b.editando,e=b;let h=`${e.colunas.join()}|${e.densidade}`;if((P||h!==s)&&(u(),s=h),!e.linhas.length){t.style.paddingTop=t.style.paddingBottom="0",t.replaceChildren(d("div",{class:"spro-vazio"},"Nenhum processo corresponde ao filtro."));return}A()}function E(b){let P=e.linhas.findIndex(w=>w.tipo==="processo"&&w.processo.id===b);if(P<0)return!1;let h=Ke[e.densidade];return P*h<a.scrollTop?a.scrollTop=P*h:(P+1)*h>a.scrollTop+a.clientHeight&&a.clientHeight>0&&(a.scrollTop=(P+1)*h-a.clientHeight),A(),!0}return M(o),{el:n,atualizar:M,mostrar:E,rolagem:a}}var qc=[["/","Buscar"],["j / k","Linha seguinte / anterior"],["x","Marcar a linha"],["Enter","Abrir o processo"],["g t","Ver a tabela"],["g q","Ver o quadro"],["Esc","Limpar a busca ou a sele\xE7\xE3o"],["?","Esta ajuda"]],ns=o=>o==="grupo:recebidos"?"grupo:gerados":o==="grupo:gerados"?"grupo:recebidos":null,Vc={"resp:eu":"Processos atribu\xEDdos a voc\xEA","grupo:recebidos":"Processos que vieram de outra unidade","grupo:gerados":"Processos autuados nesta unidade","prazo:atrasado":"Prazo vencido e ainda n\xE3o conclu\xEDdo","prazo:semana":"Vencem nos pr\xF3ximos 7 dias","resp:sem":"Processos sem respons\xE1vel","novo:sim":"Ainda n\xE3o abertos nesta unidade","novo:visita":"Chegaram depois da sua \xFAltima visita","parado:>30d":"Sem movimenta\xE7\xE3o h\xE1 mais de 30 dias (vis\xE3o detalhada do SEI)"},Hc=[["Meus","resp:eu",{comum:"pessoa"},""],["Recebidos","grupo:recebidos",{grade:"recebido"},""],["Gerados","grupo:gerados",{grade:"gerado"},""],["Atrasados","prazo:atrasado",{comum:"alerta"},"perigo"],["Vencem na semana","prazo:semana",{comum:"calendario"},"aviso"],["Sem respons\xE1vel","resp:sem",{grade:"semPessoa"},""],["N\xE3o visualizados","novo:sim",{grade:"olhoFechado"},""],["Novos desde a \xFAltima visita","novo:visita",{comum:"brilho"},"novo"],["Parados h\xE1 +30 dias","parado:>30d",{comum:"historico"},""]];function ss(o){let{doc:e}=o,r=o.inicial.processos,t=Bo(),a=[],n="",s=new Set,i=new Set(_r(e)),c=null,l={vistoEm:{}},u,g=null,m=!1,A=!1,y="",M={},E=!1,b=!1,P,h=!1,w=Sn(o.mover),k=new AbortController,L=()=>({hoje:o.hoje(),agora:o.agora(),...o.eu?{eu:o.eu}:{},...u!==void 0?{visitaAnterior:u}:{},...H?{andamentos:H.dados()}:{}}),$=e.createElement("div");$.id="spro-grade",$.setAttribute("data-spro-grade-host","1"),$.setAttribute("data-tema",o.escuro?"escuro":"claro");let T=$.attachShadow({mode:"open"}),S=e.createElement("style");S.textContent=o.css;let O=d("div",{class:`spro-app${o.escuro?" spro-escuro":""}`}),I=e.createElement("style");T.append(S,I,O);let F=_a(T),H=o.consultarAndamento?Hn({sombra:T,agora:()=>o.agora(),armazem:o.armazem,consultar:(p,f)=>o.consultarAndamento(p,f),processos:()=>r,aoMudar:()=>Z(),aviso:p=>W(p),simultaneas:o.andamentoSimultaneas,pausaMs:o.andamentoPausaMs,semDebounce:o.semDebounce}):null,N=d("input",{type:"search",class:"spro-busca",placeholder:"Buscar: texto, resp:ana, prazo:<7d, marcador:urgente...","aria-label":"Buscar processos",spellcheck:"false",autocomplete:"off"}),B=d("div",{class:"spro-chips"}),_o=d("div",{class:"spro-rapidos"}),mo=d("div",{class:"spro-status",role:"status","aria-live":"polite"}),wo=d("div",{class:"spro-lote",hidden:!0}),Wo=d("div",{class:"spro-conteudo"}),Po=d("div",{class:"spro-painel",hidden:!0}),it=d("div",{class:"spro-avisos","aria-live":"polite"}),Zo=d("div",{class:"spro-ajuda-atalhos",hidden:!0},d("strong",{},"Atalhos"),...qc.map(([p,f])=>d("div",{},d("kbd",{},p),` ${f}`))),us=[["protocolo","N\xFAmero do processo"],["prazo","Prazo"],["tipo","Tipo"],["responsavel","Respons\xE1vel"],["marcador","Marcador"],["caixa","Tempo na caixa"],["parado","Parado h\xE1"],["novo","N\xE3o visualizados"]],or=Mo({rotulo:"Agrupar por",icone:"camadas",classe:"spro-combo-compacto",busca:!1,vazio:"Sem agrupamento",opcoes:Object.keys(Gr).filter(p=>H||!pe(p)).map(p=>({valor:p,rotulo:p==="nenhum"?"Sem agrupamento":`Agrupar: ${Gr[p]}`,...pe(p)?{descricao:"Consulta o andamento de cada processo"}:{}})),valor:["nenhum"],aoMudar:([p])=>{let f=p??"nenhum",x=t.agrupar;U({agrupar:f}),H&&pe(f)&&H.aoEscolherAgrupamento().then(v=>{!v&&t.agrupar===f&&U({agrupar:x})})}}),ct=Mo({rotulo:"Ordenar por",icone:"ordenar",classe:"spro-combo-compacto",busca:!1,vazio:"Ordem do SEI",opcoes:[{valor:"",rotulo:"Ordem do SEI"},...us.flatMap(([p,f])=>[{valor:`${p}:a`,rotulo:`${f} \u2191`,descricao:"Crescente"},{valor:`${p}:d`,rotulo:`${f} \u2193`,descricao:"Decrescente"}])],valor:[""],aoMudar:([p])=>{let[f,x]=(p??"").split(":");U({ordem:f?[{campo:f,decrescente:x==="d"}]:[]})}}),fe=Ur([],L()),er=(p,f,x,v,D)=>{let R=Mo({rotulo:p,vazio:f,icone:v,classe:"spro-combo-compacto",busca:!0,larguraLista:260,opcoes:()=>D().map(z=>({valor:z.valor,rotulo:z.rotulo,contagem:z.n})),aoMudar:([z])=>{z&&(U({busca:On(t.busca,x,z)}),N.value=t.busca,R.definir([],!1))}});return R},lt=er("Filtrar por respons\xE1vel","Respons\xE1vel\u2026","resp","pessoa",()=>fe.responsaveis),dt=er("Filtrar por tipo","Tipo\u2026","tipo","documento",()=>fe.tipos),pt=er("Filtrar por marcador","Marcador\u2026","marcador","etiqueta",()=>fe.marcadores),ut=(p,f)=>d("button",{type:"button",class:"spro-seg-b","data-modo":p,title:f,onclick:()=>U({modo:p})},no(p==="tabela"?"lista":"quadro",16),d("span",{},f)),mt=d("div",{class:"spro-seg",role:"group","aria-label":"Modo de exibi\xE7\xE3o"},ut("tabela","Tabela"),ut("quadro","Quadro")),ge=(p,f,x,v="")=>d("button",{type:"button",class:`spro-bt ${v}`.trim(),title:f,"aria-label":f,onclick:x},no(p,16),d("span",{},f)),ft=ge("colunas","Colunas",()=>Vo("colunas")),ms=ge("disquete","Vis\xF5es",()=>Vo("visoes")),fs=ge("lista","Exportar CSV",()=>ws()),gs=d("button",{type:"button",class:"spro-bt spro-bt-icone",title:"Atalhos de teclado (?)","aria-label":"Atalhos de teclado",onclick:()=>{Zo.hidden=!Zo.hidden}},"?"),gt=ge("densidade","Densidade",()=>U({densidade:t.densidade==="compacta"?"confortavel":"compacta"})),he=d("div",{class:"spro-quadro-cfg",hidden:!0});O.append(d("div",{class:"spro-barra"},mt,d("div",{class:"spro-busca-caixa"},N),or.el,ct.el,ft,gt,ms,fs,gs),B,d("div",{class:"spro-faixa"},_o,lt.el,dt.el,pt.el),he,Zo,Po,mo,...H?[H.faixa]:[],wo,Wo,it);let ht=()=>nn(r,l),Yo="",oe=()=>Cn(ht(),`${t.busca} ${Yo}`.trim(),L()),rr=()=>Nn(oe(),t.ordem,L());function U(p){t={...t,...p},p.busca===void 0?o.armazem.gravarVisao(t).catch(()=>{}):hs(),Z()}let tr;function hs(){clearTimeout(tr),tr=setTimeout(()=>void o.armazem.gravarVisao(t).catch(()=>{}),400)}function W(p,f){let x=d("div",{class:"spro-aviso",role:"status"},d("span",{},p));f&&x.append(d("button",{type:"button",class:"spro-link",onclick:()=>{f.fazer(),x.remove()}},f.rotulo)),x.append(d("button",{type:"button",class:"spro-aviso-x","aria-label":"Fechar aviso",onclick:()=>x.remove()},"\xD7")),it.append(x),setTimeout(()=>x.remove(),f?9e3:6e3).unref?.()}function qo(p,f){let x=new Set(i);for(let v of p)f?x.add(v):x.delete(v);i=x,xn(e,x),cr(),fo()}let be=new Map;function Lo(p,f){let x=r.find(v=>v.id===p);if(x){let v=be.get(p)??{};for(let D of new Set([...Object.keys(x),...Object.keys(f)]))JSON.stringify(x[D])!==JSON.stringify(f[D])&&(v[D]=f[D]);be.set(p,v)}r=r.map(v=>v.id===p?f:v)}let bt=Promise.resolve();function bs(p){ko+=1;let f=bt.then(p,p);return bt=f.catch(()=>{}).finally(()=>{ko-=1}),f}let ar=null,nr={raiz:T,extras:()=>(ar??=(o.extras?o.extras().then(p=>(M=p,p)):Promise.resolve({})).catch(p=>{throw ar=null,p}),ar),todos:()=>r,selecionados:()=>i,corDoMarcador:p=>r.flatMap(f=>f.marcadores).find(f=>f.nome===p)?.cor??"",autor:o.eu??"",aplicarLocal:(p,f)=>{Lo(p,f),Z()},gravar:bs,atribuir:(p,f)=>o.mover.atribuir(p,f),marcar:(p,f)=>o.mover.marcador(p,f),anotar:(p,f)=>o.anotar(p,f),aviso:p=>W(p)};async function vs(p,f,x){let v=r.find(Q=>Q.id===p);if(!v)return;let D=Vn(t.quadro.colunas,v,f,x);if(!D.ok)return W(D.motivo);let R=Object.fromEntries((M.responsaveis??[]).map(Q=>[Q.sigla,Q.nome]));Lo(p,Jr(v,D.movimento,R)),Z(),ko+=1;let z=await w.mover(D.movimento).finally(()=>{ko-=1});if(!b){if(!z.ok)return Lo(p,v),Z(),W(`N\xE3o foi poss\xEDvel mover ${v.protocolo}: ${z.erro}`);W(`${v.protocolo} movido.`,{rotulo:"Desfazer",fazer:()=>{let Q=r.find(ao=>ao.id===p)??v;Lo(p,Jr(Q,z.desfazer,R)),Z(),w.mover(z.desfazer).then(ao=>{ao.ok||b||(Lo(p,Q),Z(),W(`N\xE3o foi poss\xEDvel desfazer: ${ao.erro}`))})}})}}let xs=Un(),sr=new Map([[$o("recebidos",0),o.inicial.selecoes.recebidos],[$o("gerados",0),o.inicial.selecoes.gerados],[$o("detalhado",0),o.inicial.selecoes.detalhado]]),ir=o.inicial.visao==="detalhada";function As(p){let f=r.filter(D=>i.has(D.id)),x=La(p);if(x?.requerSelecao&&!f.length)return W("Marque ao menos um processo.");if(x&&!x.aceitaSigiloso&&Oa(f))return W("Opera\xE7\xE3o n\xE3o aplic\xE1vel em processo sigiloso.");let v=Da(f,sr,ir?"detalhada":"resumida");if(!v.ok)return W(v.motivo);if(v.plano.todosNaPaginaAtual||!x){let D=yn(p,f.length);!D.ok&&D.motivo&&W(D.motivo);return}try{o.enviarAcao(x.url,v.plano)}catch(D){W(`N\xE3o foi poss\xEDvel enviar a a\xE7\xE3o: ${D instanceof Error?D.message:String(D)}`)}}let ko=0,ve=null,xe="",vt=!1,xt=p=>({linhas:p,colunas:t.colunas,densidade:t.densidade,ctx:L(),ordem:t.ordem,selecionados:i,foco:c,icones:f=>xs(e,f),nomesCompletos:vt,editando:ve,rascunho:xe,semOrigem:ir,aoOrdenar:(f,x)=>U({ordem:zn(t.ordem,f,x)}),aoSelecionar:(f,x)=>qo([f],x),aoGrupo:f=>{let x=new Set(s);x.has(f)?x.delete(f):x.add(f),s=x,o.armazem.gravarRecolhidos([...x]).catch(()=>{}),fo()},aoMarcarGrupo:(f,x)=>qo(f,x),aoEditarEspec:f=>{ve=f,xe=r.find(x=>x.id===f)?.especificacao??"",fo()},aoDigitarEspec:f=>{xe=f},aoCancelarEspec:()=>{ve=null,fo()},aoSalvarEspec:f=>void ys(f),aoAbrirPrazo:f=>o.abrirPrazo(f),aoEditar:(f,x)=>{let v=r.find(D=>D.id===f);v&&(x==="responsavel"?os(nr,v):x==="anotacao"?es(nr,v):rs(nr,v))}}),Ae=as(xt([]));async function ys(p){let f=r.find(v=>v.id===p),x=xe.trim();if(ve=null,!f||x===f.especificacao.trim())return fo();if(!x)return W("A especifica\xE7\xE3o n\xE3o pode ficar vazia."),fo();Lo(p,{...f,especificacao:x}),Z(),ko+=1;try{await o.editarEspecificacao(f.protocolo,x),W(`Especifica\xE7\xE3o de ${f.protocolo} salva.`)}catch(v){Lo(p,f),Z(),W(`N\xE3o foi poss\xEDvel salvar a especifica\xE7\xE3o: ${v instanceof Error?v.message:String(v)}`)}finally{ko-=1}}function fo(){let p=rr();if(t.modo==="quadro"){Wo.replaceChildren(Fn({processos:p,cfg:t.quadro,ctx:L(),extras:M,selecionados:i,aoMover:(x,v,D)=>void vs(x,v,D),aoSelecionar:(x,v)=>qo([x],v),aoAbrirPrazo:x=>o.abrirPrazo(x),aoReordenarColuna:(x,v,D)=>U({quadro:{...t.quadro,ordemColunas:qn(D,x,v)}})}));return}let f=He(p,t.agrupar,L());Ae.atualizar(xt($n(f,s,t.agrupar!=="nenhum"))),Wo.firstElementChild!==Ae.el&&Wo.replaceChildren(Ae.el)}function At(p){let f=[`${p} de ${r.length} processo${r.length===1?"":"s"}`];Yo&&f.push(`filtro da pesquisa r\xE1pida: ${Yo}`);let x=o.inicial.totais.recebidos+o.inicial.totais.gerados;m&&g?f.push(`carregando ${g.grupo} (${g.paginasLidas}/${g.paginasTotal})\u2026`):!A&&x>r.length&&f.push(`o SEI informa ${x}; os demais n\xE3o foram carregados`),y&&f.push(`aviso: ${y}`),mo.replaceChildren(f.join(" \xB7 ")),mo.classList.toggle("spro-status-alerta",!!y||!A&&!m&&x>r.length)}function cr(){let p=i.size;if(wo.hidden=p===0,!p)return wo.replaceChildren();let f=new Set(oe().map(v=>v.id)),x=[...i].filter(v=>!f.has(v)).length;wo.replaceChildren(d("strong",{},`${p} selecionado${p===1?"":"s"}`),...x?[d("span",{class:"spro-suave"},`(${x} fora do filtro atual)`)]:[],...o.acoes().map(v=>d("button",{type:"button",class:"spro-bt",title:v.rotulo,onclick:()=>As(v)},d("img",{src:v.icone,alt:"",width:"16",height:"16"}),d("span",{},v.rotulo))),d("button",{type:"button",class:"spro-link",onclick:()=>qo([...i],!1)},"Limpar sele\xE7\xE3o"))}function Es(){let p=jr(t.busca);B.replaceChildren(...p.tokens.map(x=>d("span",{class:`spro-chip${x.termo.negado?" spro-chip-neg":""}`},x.texto,d("button",{type:"button","aria-label":`Remover ${x.texto}`,onclick:()=>{U({busca:Ve(t.busca,x.texto)}),N.value=t.busca}},"\xD7")))),B.hidden=!p.tokens.length;let f=new Set(p.tokens.map(x=>x.texto));_o.replaceChildren(...Hc.filter(([,x])=>!(ir&&x.startsWith("grupo:"))).map(([x,v,D,R])=>d("button",{type:"button","data-tip":`${x}
${Vc[v]??""}
Busca: ${v}${f.has(v)?`
Clique para desligar`:""}`,"aria-label":x,class:`spro-rapido${R?` spro-rapido-${R}`:""}${f.has(v)?" spro-rapido-on":""}`,"aria-pressed":String(f.has(v)),onclick:()=>{U({busca:f.has(v)?Ve(t.busca,v):`${ns(v)?Ve(t.busca,ns(v)):t.busca} ${v}`.trim()}),N.value=t.busca}},"comum"in D?_(D.comum,14,e):no(D.grade,14,e),d("span",{class:"spro-rapido-rotulo"},x)))),yt()}let yo=$.shadowRoot.querySelector(".spro-faixa");function yt(){b||(yo.classList.remove("spro-faixa-c1","spro-faixa-c2"),yo.clientWidth&&(yo.scrollWidth>yo.clientWidth+1&&yo.classList.add("spro-faixa-c1"),yo.scrollWidth>yo.clientWidth+1&&yo.classList.add("spro-faixa-c2")))}let Et=e.defaultView?.ResizeObserver,St=Et?new Et(()=>yt()):null;St?.observe(yo);function Z(){if(b)return;fe=Ur(ht(),L());for(let f of[lt,dt,pt])f.atualizar();or.definir([t.agrupar],!1),or.el.disabled=t.modo==="quadro",ct.definir([t.ordem[0]?`${t.ordem[0].campo}:${t.ordem[0].decrescente?"d":"a"}`:""],!1);for(let f of mt.querySelectorAll("[data-modo]"))f.setAttribute("aria-pressed",String(f.getAttribute("data-modo")===t.modo));gt.title=t.densidade==="compacta"?"Linhas confort\xE1veis":"Linhas compactas",ft.hidden=t.modo==="quadro",Ss(),Es(),H?.definirAtivo(pe(t.agrupar)&&t.modo==="tabela"),fo(),At(oe().length),cr(),t.modo==="quadro"&&!E&&o.extras&&(E=!0,o.extras().then(f=>{M=f,b||fo()}).catch(()=>{}))}function Ss(){if(he.hidden=t.modo!=="quadro",he.hidden)return;let p=t.quadro,f=Mo({rotulo:"Colunas do quadro",icone:"mapa",classe:"spro-combo-compacto",busca:!1,opcoes:[{valor:"marcador",rotulo:"Colunas: marcador"},{valor:"responsavel",rotulo:"Colunas: respons\xE1vel"},{valor:"prazo",rotulo:"Colunas: prazo (leitura)"},{valor:"tipo",rotulo:"Colunas: tipo (leitura)"}],valor:[p.colunas],aoMudar:([eo])=>{E=!1,U({quadro:{...p,colunas:eo??"marcador"}})}}),x=d("input",{type:"number",min:"0",max:"99",class:"spro-num",value:String(p.limite),"aria-label":"Limite de cart\xF5es por coluna (0 = sem limite)",title:"Limite de cart\xF5es por coluna (0 = sem limite)",onchange:eo=>U({quadro:{...p,limite:Math.max(0,Math.min(99,Number(eo.target.value)||0))}})}),v=d("input",{type:"checkbox",onchange:eo=>U({quadro:{...p,raiasPorResponsavel:eo.target.checked}})});v.checked=p.raiasPorResponsavel;let D=p.larguraColuna??280,R=eo=>{let Ho=Math.max(200,Math.min(500,Math.round(eo)));U({quadro:{...t.quadro,larguraColuna:Ho}})},z=d("span",{class:"spro-largura-val"},`${D}px`),Q=d("input",{type:"range",min:"200",max:"500",step:"20",value:String(D),class:"spro-largura-range","aria-label":"Largura das colunas",title:"Ajustar largura das colunas e cart\xF5es",oninput:eo=>{let Ho=Number(eo.target.value)||280;z.textContent=`${Ho}px`,Wo.querySelector(".spro-quadro")?.style.setProperty("--spro-col-largura",`${Ho}px`)},onchange:eo=>R(Number(eo.target.value)||280)}),ao=d("div",{class:"spro-largura-ctrl"},d("span",{},"Largura"),d("button",{type:"button",class:"spro-largura-bt","aria-label":"Diminuir largura das colunas",title:"Diminuir largura das colunas",onclick:()=>R(D-20)},"\u2212"),Q,d("button",{type:"button",class:"spro-largura-bt","aria-label":"Aumentar largura das colunas",title:"Aumentar largura das colunas",onclick:()=>R(D+20)},"+"),z),ee=p.ordemColunas?.length?d("button",{type:"button",class:"spro-link",title:"Voltar \xE0 ordena\xE7\xE3o autom\xE1tica das colunas",onclick:()=>{let{ordemColunas:eo,...Ho}=t.quadro;U({quadro:Ho})}},"Restaurar ordem"):null;he.replaceChildren(f.el,d("label",{class:"spro-rotulo-inline"},"Limite ",x),ao,d("label",{class:"spro-rotulo-inline"},v," Raias por respons\xE1vel"),...ee?[ee]:[],d("span",{class:"spro-suave"},p.colunas==="marcador"||p.colunas==="responsavel"?"Arraste cart\xF5es ou cabe\xE7alhos das colunas.":"Arraste os cabe\xE7alhos para reordenar as colunas."))}function Vo(p){if(!Po.hidden&&Po.getAttribute("data-qual")===p){Po.hidden=!0;return}if(Po.setAttribute("data-qual",p),Po.hidden=!1,p==="colunas"){Po.replaceChildren(d("strong",{},"Colunas"),...Uo.map(R=>{let z=d("input",{type:"checkbox",disabled:R==="processo"});return z.checked=t.colunas.includes(R),z.addEventListener("change",()=>{let Q=z.checked?Uo.filter(ao=>ao===R||t.colunas.includes(ao)):t.colunas.filter(ao=>ao!==R);U({colunas:Q})}),d("label",{class:"spro-rotulo-linha"},z,` ${No[R]}`)}),d("button",{type:"button",class:"spro-link",onclick:()=>U({colunas:Bo().colunas})},"Restaurar padr\xE3o"));return}let f=d("input",{type:"text",class:"spro-nome",maxlength:"40",placeholder:"Nome da vis\xE3o","aria-label":"Nome da vis\xE3o"}),x=a.find(R=>R.id===n);f.value=x?.nome??"";let v=async(R,z=a)=>{a=R,await o.armazem.gravarVisoes(R,z).catch(()=>W("N\xE3o foi poss\xEDvel sincronizar as vis\xF5es."))},D=async R=>{let z={...t,nome:f.value.trim()||"Minha vis\xE3o",id:R==="atualizar"?n:""},Q=cn(a,z,o.novoId);if(!Q)return W("Limite de vis\xF5es salvas atingido.");n=Q.visao.id,await v(Q.lista),W(`Vis\xE3o "${Q.visao.nome}" salva.`),Vo("visoes"),Vo("visoes")};Po.replaceChildren(d("strong",{},"Vis\xF5es salvas"),a.length?d("ul",{class:"spro-lista-visoes"},...a.map(R=>d("li",{},d("button",{type:"button",class:`spro-link${R.id===n?" spro-ativa":""}`,onclick:()=>{n=R.id,N.value=R.busca,U({...R,id:""})}},R.nome),d("button",{type:"button",class:"spro-aviso-x","aria-label":`Excluir ${R.nome}`,title:"Excluir",onclick:async()=>{await v(ln(a,R.id),a),n===R.id&&(n=""),Vo("visoes"),Vo("visoes")}},"\xD7")))):d("p",{class:"spro-suave"},"Nenhuma vis\xE3o salva ainda."),d("div",{class:"spro-linha-form"},f,d("button",{type:"button",class:"spro-bt",onclick:()=>void D("nova")},"Salvar como nova"),x&&dn(t,x)?d("button",{type:"button",class:"spro-bt",onclick:()=>void D("atualizar")},"Atualizar"):null))}function ws(){let p=kn(rr(),t.modo==="quadro"?[...Uo]:t.colunas,L());o.baixar(In(o.hoje()),mn(p),"text/csv;charset=utf-8"),W(`${p.length-1} processos exportados.`)}N.addEventListener("input",()=>{let p=N.value;if(o.semDebounce)return U({busca:p});clearTimeout(P),P=setTimeout(()=>U({busca:p}),120)}),N.addEventListener("keydown",p=>{p.key==="Escape"&&(N.value="",U({busca:""}),N.blur())});function wt(p){if(b||p.ctrlKey||p.metaKey||p.altKey)return;let f=p.target;if(f&&(/^(input|textarea|select)$/i.test(f.tagName)||f.isContentEditable)||$.hidden)return;let v=p.key;if(h){h=!1,v==="t"?U({modo:"tabela"}):v==="q"&&U({modo:"quadro"});return}let D=rr().map(z=>z.id),R=c?D.indexOf(c):-1;if(v==="/")p.preventDefault(),N.focus();else if(v==="?")Zo.hidden=!Zo.hidden;else if(v==="g")h=!0;else if(v==="Escape")i.size&&qo([...i],!1);else if((v==="j"||v==="k")&&t.modo==="tabela"&&D.length)c=D[Math.max(0,Math.min(D.length-1,R+(v==="j"?1:-1)))],fo(),Ae.mostrar(c);else if(v==="x"&&c)r.find(Q=>Q.id===c)&&qo([c],!i.has(c));else if(v==="Enter"&&c){let z=r.find(Q=>Q.id===c)?.link;z&&e.defaultView?.location.assign(z)}}e.addEventListener("keydown",wt);let Ps=An(e,p=>{i=p,cr(),fo()}),Ms=o.armazem.aoMudarVisoes(()=>void o.armazem.lerVisoes().then(p=>{a=p}).catch(()=>{})),lr=new Map;function dr(){if(b||ko>0)return;let p=jo(e),f=new Map(p.processos.map(v=>[v.id,v])),x=!1;r=r.map(v=>{if(!v.naPaginaAtual)return v;let D=f.get(v.id);if(!D)return v;let R=be.get(v.id),z=Yr(e,v.id),Q=lr.get(v.id);lr.set(v.id,z);let ao=D;if(R){for(let eo of Object.keys(R))JSON.stringify(D[eo])===JSON.stringify(R[eo])&&delete R[eo];Object.keys(R).length?ao={...D,...R}:be.delete(v.id)}let ee=JSON.stringify(ao)===JSON.stringify(v);return ee&&Q===z?v:(x=!0,ee?v:ao)}),x&&(mr(),Z())}let pr,Pt=e.defaultView?.MutationObserver,ur=Pt?new Pt(()=>{clearTimeout(pr),pr=setTimeout(dr,o.semDebounce?0:150)}):null,Mt=e.querySelector("#frmProcedimentoControlar")??e.body;ur&&Mt&&ur.observe(Mt,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["aria-pressed","aria-label","onmouseover","src","href","class"]});function mr(){let p=Bn(e);I.textContent!==p&&(I.textContent=p)}async function Ds(){if(!o.fonte)return A=!0,Dt(!0);m=!0,Z();let p=()=>o.fonte?.restaurarAoSair?.();e.defaultView?.addEventListener("pagehide",p);let f=await on(o.inicial,o.fonte,{sinal:k.signal,aoProgresso:x=>{g=x,At(oe().length)},aoSelecao:(x,v,D)=>{sr.set($o(x,v),D)},aoPagina:x=>{r=[...r,...x],Z()}});e.defaultView?.removeEventListener("pagehide",p),m=!1,A=f.completo,f.erro&&(y=f.erro),Dt(f.completo)}function Dt(p){l=Tr(l,r.map(f=>f.id),o.agora(),p),o.armazem.gravarIdade(l).catch(()=>{}),Z()}async function Cs(){try{let p=await o.armazem.lerEstado();t=p.visao,s=new Set(p.recolhidos),l=an(p.idade,o.agora()),u=l.visitaAnterior,a=await o.armazem.lerVisoes()}catch{}l=Tr(l,r.map(p=>p.id),o.agora(),!1),H&&await H.carregar(),N.value=t.busca,mr();for(let[p]of r.map(f=>[f.id]))lr.set(p,Yr(e,p));Z(),Ds();for(let p of[1200,3500])setTimeout(()=>{mr(),dr()},p).unref?.()}return{host:$,iniciar:Cs,render:Z,estado:()=>({visao:t,todos:r,selecionados:i,completo:A,carregando:m,filtrados:oe().length}),definirVisao:p=>{t={...t,...p},N.value=t.busca,Z()},fechar(){b=!0,k.abort(),H?.fechar(),clearTimeout(P),clearTimeout(tr),clearTimeout(pr),ur?.disconnect(),St?.disconnect(),F(),e.removeEventListener("keydown",wt),Ps(),Ms(),$.remove()},mostrar:p=>{$.hidden=!p},definirTema:p=>{$.setAttribute("data-tema",p?"escuro":"claro"),O.classList.toggle("spro-escuro",p)},definirNomesCompletos:p=>{vt=p,Z()},definirFiltroExterno:p=>{let f=p.trim();f!==Yo&&(Yo=f,Z())},sincronizar:dr,registrarSelecaoParaTeste:(p,f,x)=>void sr.set($o(p,f),x)}}var is=`/* Dentro do Shadow DOM: o base.css do sei-comum (tokens) vem antes deste arquivo. */
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
.spro-cartao-anotacao { padding: 5px 8px; font-size: 12px; line-height: 1.35; background: rgba(250, 204, 21, 0.2); border: 1px solid rgba(234, 179, 8, 0.35); border-radius: 8px; white-space: pre-wrap; word-break: break-word; }
.spro-escuro .spro-cartao-anotacao { background: rgba(250, 204, 21, 0.16); border-color: rgba(250, 204, 21, 0.3); }
.spro-cartao-anotacao-prio { border-color: rgba(234, 179, 8, 0.65); }
.spro-cartao-rodape { display: flex; gap: 6px; align-items: center; justify-content: space-between; }
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
`;var cs=`/* Na p\xE1gina do SEI (fora do Shadow DOM): o bot\xE3o alternador e o espa\xE7o da grade. */
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
`;var Gc="gradecontrole",ls="data-spro-pesquisa-rapida";function Uc(){return new URL(location.href).searchParams.get("acao")==="procedimento_controlar"}var Jo=()=>{let o=$t(document);return o?o==="escuro":!!document.body?.classList.contains("dark-mode")||It(localStorage)},Ze=null,xo=!1,G=null,Ao=null,Ko=null,ds=0,nt=!1,We=null,ps=null,zo=null,st=document.readyState!=="loading";function Bc(){let o=document.querySelector(Ya);return document.getElementById("divTabelaProcesso")??o?.parentElement??null}function Oo(o){Ao?.pronta(),G?.mostrar(!1),Ie(document),o&&o!=="usuario"&&console.warn("[SEI Pro] Grade do controle indispon\xEDvel, usando a vis\xE3o nativa:",o)}function Ye(){if(G||!xo)return;let o=new De(location.href,()=>ne(document,location.href)),e=Sr(ne(document,location.href)),r=e.unidade.id,t=un({local:fr(chrome.storage.local,"local"),sync:fr(chrome.storage.sync,"sync")},String(r),e.usuario.login);if(["hdnRecebidosPaginaAtual","hdnGeradosPaginaAtual","hdnDetalhadoPaginaAtual"].some(c=>document.getElementById(c)?.value&&document.getElementById(c).value!=="0")&&!sessionStorage.getItem("spro_grade_reset")){try{sessionStorage.setItem("spro_grade_reset","1")}catch{}$r(o.http,ne(document,location.href)).restaurar().then(()=>location.reload()).catch(()=>Oo("pagina intermediaria"));return}try{sessionStorage.removeItem("spro_grade_reset")}catch{}let n=jo(document);if(!n.processos.length&&!n.totais.recebidos&&!n.totais.gerados)return Ao?.pronta(),Oo("caixa vazia");let s=Bc();if(!s)return Oo("sem ponto de encaixe");let i=n.processos.filter(c=>!c.sigiloso&&c.naPaginaAtual).slice(0,6).map(c=>c.protocolo);G=ss({doc:document,inicial:n,agora:()=>Date.now(),hoje:()=>Fo(),eu:e.usuario.login||void 0,armazem:t,fonte:$r(o.http,ne(document,location.href),n.visao),mover:{marcador:async(c,l)=>void await fa(o,c,l,{aplicar:!0}),atribuir:async(c,l)=>void await ma(o,c,l,{aplicar:!0})},acoes:()=>ka(document),css:`${Nt}
${is}`,escuro:Jo(),baixar:(c,l,u)=>qt(c,l,u),novoId:()=>Tt(),extras:i.length?async()=>{let c=async g=>{let m;for(let A of i)try{return await ta(o,g,A)}catch(y){m=y}return console.warn(`[SEI Pro] Grade: nao foi possivel ler a lista de ${g}`,m instanceof Error?m.message:m),[]},[l,u]=await Promise.all([c("marcadores"),c("usuarios")]);return{marcadores:l.map(g=>g.nome),responsaveis:u.map(g=>{let[m,...A]=g.nome.split(" - ");return{sigla:m.trim(),nome:A.join(" - ").trim()||m.trim()}})}}:void 0,aoVoltarNativa:()=>me(),enviarAcao:(c,l)=>Ca(document,c,l),editarEspecificacao:async(c,l)=>void await sa(o,c,{especificacao:l},{aplicar:!0}),abrirPrazo:c=>{document.documentElement.setAttribute("data-spro-prazos-alvo",c),document.dispatchEvent(new CustomEvent("spro-prazos-abrir"))},anotar:async(c,l)=>void await ua(o,c,l,{aplicar:!0}),consultarAndamento:(c,l)=>Ea(o,c,{sigla:e.unidade.sigla,nome:e.unidade.nome},l)}),G.definirNomesCompletos(nt),Qc(G),ps?.(),ps=Rt(document,()=>G?.definirTema(Jo())),s.before(G.host),Ia(document,G.host),Xc(),G.iniciar().then(()=>{Ao?.pronta(),To(document)&&Or(document)}).catch(c=>Oo(String(c)))}function Qc(o){zo?.disconnect();let e=()=>o.definirFiltroExterno(document.documentElement.getAttribute(ls)??"");e(),zo=new window.MutationObserver(e),zo.observe(document.documentElement,{attributes:!0,attributeFilter:[ls]})}function Xc(){We?.disconnect();let o=window.MutationObserver,e=!1;We=new o(()=>{e||(e=!0,setTimeout(()=>{if(e=!1,!(!G||!xo||G.host.isConnected&&!!G.host.shadowRoot&&document.querySelectorAll("#spro-grade").length===1||ds>=6)){ds+=1,G.fechar(),G=null,zo?.disconnect(),zo=null;for(let t of document.querySelectorAll("#spro-grade"))t.remove();(To(document)||xo)&&Ye()}},150))}),We.observe(document.body??document.documentElement,{childList:!0,subtree:!0})}function me(){Ze&&(To(document)?(xo=!1,Le(localStorage,!1),G?.mostrar(!1),Ie(document)):(xo=!0,Le(localStorage,!0),ke(document,Jo()),G&&G.host.isConnected&&G.host.shadowRoot?(G.mostrar(!0),Or(document)):(G&&(G.fechar(),G=null),Ao=$e(Oo),Ao.iniciarContagem(),Ye())),Ko?.(),Ko=Te(document,()=>To(document),me))}function Kc(o){o!==Ze&&(Ze=o,o?(st&&(Ko??=Te(document,()=>To(document),me)),xo&&(ke(document,Jo()),Ao??=$e(Oo),st&&(Ao.iniciarContagem(),Ye()))):(xo=!1,Le(localStorage,!1),Ko?.(),Ko=null,We?.disconnect(),zo?.disconnect(),zo=null,G?.fechar(),G=null,Ao?.pronta(),Ie(document)))}function Jc(){if(!Uc())return;let o=document.createElement("style");o.textContent=cs,(document.head??document.documentElement).append(o),Va(localStorage)&&(xo=!0,ke(document,Jo()),Ao=$e(Oo)),ja(document,me),qa(document,Jo);let e=()=>{st=!0,xo&&(Ao?.iniciarContagem(),Ye()),Ze&&(Ko??=Te(document,()=>To(document),me))};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",e,{once:!0}):e();let r=a=>{nt=kt(a,"nomesusuarios"),G?.definirNomesCompletos(nt),Kc(Lt(a,Gc))},t=!1;chrome.storage.onChanged.addListener((a,n)=>{n!=="sync"||!("dataValues"in a)||(t=!0,r(a.dataValues.newValue))}),chrome.storage.sync.get("dataValues").then(a=>{t||r(a.dataValues)}).catch(()=>{xo&&Oo("sem prefer\xEAncias")})}Jc();})();
