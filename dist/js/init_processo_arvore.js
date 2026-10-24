/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function wc(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function tr(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(wc(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function ar(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function _o(o,e){let r=ar(o,e);return!(r===!1||r===0||r==="")}function nr(o,e){let r=ar(o,e);return r===!0||r===1||r==="1"}var Xt=`/*
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
`;var Mc={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function xo(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Mc[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Yt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Cc={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function ke(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Cc[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var Ic=/[A-Za-z0-9\-_.*]/;function Jt(o){let e="";for(let r of o)r===" "?e+="+":Ic.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Zt(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${Jt(ke(r))}=${Jt(ke(t??"",a))}`}).join("&")}function Qt(o){let e=r=>encodeURIComponent(ke(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var oa="application/x-www-form-urlencoded";function ot(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=Yt[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var ea="application/x-www-form-urlencoded; charset=ISO-8859-1";var ra=null;function ne(o){return ra?ra(o):new DOMParser().parseFromString(o,"text/html")}function T(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var S=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Ro(o){if(o instanceof S)return o;if(o instanceof DOMException&&o.name==="AbortError")return new S("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new S("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function ta(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=ne(r)}}}function aa(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new S("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new S("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=T(r);throw new S("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new S("SEI_VALIDACAO",r,r)}return o}function Ne(o,e={}){let r=new URL(".",o),t=e.fetch??((...f)=>fetch(...f)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(f){n>=a&&await new Promise(m=>i.push(m)),n+=1;try{return await f()}finally{n-=1,i.shift()?.()}}let c=f=>new URL(f.replace(/&amp;/g,"&"),r).href;async function p(f,m,u){return s(async()=>{try{let v=await t(c(f),{credentials:"same-origin",redirect:"follow",...m,signal:u.sinal}),h=ot(await v.arrayBuffer());return aa(ta(v.url||c(f),v.status,h),u)}catch(v){throw Ro(v)}})}async function d(f,m={}){return s(async()=>{try{let u=await t(c(f),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),v=new Uint8Array(await u.arrayBuffer()),h=(u.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();h==="text/html"&&aa(ta(u.url||c(f),u.status,ot(v)),m);let g=u.headers?.get("content-disposition")??"",y=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(g)?.[1]??/filename="?([^";]+)"?/i.exec(g)?.[1]??"");return{bytes:v,tipo:h,nome:y}}catch(u){throw Ro(u)}})}return{base:r,absoluta:c,baixar:d,obter:(f,m={})=>p(f,{method:"GET"},m),enviar:(f,m,u={})=>p(f,u.utf8?{method:"POST",headers:{"Content-Type":oa},body:Qt(m)}:{method:"POST",headers:{"Content-Type":ea},body:Zt(m,u.modos)},u)}}function Qo(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function ir(){try{return window.top?.document??document}catch{return document}}var na=`/*
 * Pain\xE9is abaixo da \xE1rvore do processo (op\xE7\xE3o A da spec: lista refinada) e seus modais.
 * As cores v\xEAm dos tokens --spro-* de sei-comum/src/ui/base.css (anexado antes deste arquivo). O escuro vem de
 * data-tema="escuro" na raiz dos pain\xE9is e no di\xE1logo (o quadro e a janela de topo s\xE3o documentos diferentes).
 */
/* Escala unica de tamanhos do quadro da arvore (README, "Escala de tamanhos"). Vale no <html> do quadro (para o que o legado
   desenha: Consultar Andamento e Processos Relacionados) e nos nossos paineis. Os modais e o menu do documento nao usam. */
html[data-seipro-processo-paineis],
.spro-p-raiz,
.spro-f-barra {
  --spro-p-fonte-titulo: 13.5px;
  --spro-p-fonte-corpo: 13px;
  --spro-p-fonte-pequena: 12px;
  --spro-p-icone: 16px;
  --spro-p-icone-mini: 13px;
  --spro-p-alvo: 26px;
  /* Cabecalho de painel = rotulo nativo "Consultar Andamento" (a.newLink do legado: cinza #666, peso 400, lupa azul #4285f4
     de 16 px com 5 px de cada lado). O icone fica 17,4 px depois da borda do quadro e o texto 21 px depois do icone, os
     mesmos x do rotulo nativo (8 + 2,4 de padding + 5 de margem + 5 de padding do link + 5 de margem do icone). */
  --spro-p-recuo: 17.4px;
  --spro-p-gap-icone: 5px;
  --spro-p-cor-titulo: #666666;
  --spro-p-cor-icone: #4285f4;
  --spro-p-cor-corpo: #444b52;
}
/* Os tokens do base.css seguem o esquema de cores do SISTEMA quando ninguem fixou o tema; aqui o tema e o do SEI
   (claro por padrao, escuro quando o SEI esta escuro), nunca o do sistema operacional. */
.spro-p-raiz,
.spro-pm,
.spro-f-barra,
.spro-g-impressao,
.spro-na,
dialog.spro-dialogo {
  --spro-fundo: #ffffff;
  --spro-fundo-2: #f6f7f9;
  --spro-fundo-3: #eceef2;
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
  --spro-estrela: #f2a516;
  --spro-sombra-3: 0 10px 24px -6px rgb(16 24 40 / 18%), 0 24px 56px -12px rgb(16 24 40 / 24%);
  --spro-veu: rgb(17 21 28 / 46%);
  --spro-destaque-suave: color-mix(in srgb, var(--spro-destaque) 10%, transparent);
  --spro-destaque-medio: color-mix(in srgb, var(--spro-destaque) 18%, transparent);
  color-scheme: light;
}
html[data-seipro-processo-paineis].dark-mode,
.spro-p-raiz[data-tema="escuro"],
.spro-f-barra[data-tema="escuro"] {
  --spro-p-cor-titulo: #fbfbfe;
  --spro-p-cor-icone: #0494c7;
  --spro-p-cor-corpo: #dfe2e6;
}
.spro-p-raiz[data-tema="escuro"],
.spro-pm[data-tema="escuro"],
.spro-f-barra[data-tema="escuro"],
.spro-na[data-tema="escuro"],
dialog.spro-dialogo[data-tema="escuro"] {
  --spro-fundo: #1a1d21;
  --spro-fundo-2: #22262b;
  --spro-fundo-3: #2b3036;
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
  --spro-sombra-3: 0 10px 24px -6px rgb(0 0 0 / 50%), 0 24px 56px -12px rgb(0 0 0 / 60%);
  --spro-veu: rgb(0 0 0 / 58%);
  --spro-destaque-suave: color-mix(in srgb, var(--spro-destaque) 14%, transparent);
  --spro-destaque-medio: color-mix(in srgb, var(--spro-destaque) 24%, transparent);
  color-scheme: dark;
}

.spro-p-raiz {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: var(--spro-fonte);
  font-size: var(--spro-p-fonte-corpo);
  line-height: 1.4;
  color: var(--spro-p-cor-corpo);
}
.spro-p-raiz *,
.spro-p-raiz *::before,
.spro-p-raiz *::after {
  box-sizing: border-box;
}
.spro-p-raiz.anotacoes {
  margin-top: 6px;
}
.spro-p-slot:empty {
  display: none;
}

/* ---------- Painel ---------- */
.spro-p-painel {
  margin: 0;
  padding: 8px 6px 8px var(--spro-p-recuo);
  border-top: 1px solid var(--spro-borda);
}
.spro-p-painel > header {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: var(--spro-p-alvo);
}
/* Icone e titulo como no link nativo: o icone (16 px) na linha de cima da caixa do texto, o texto 5 px depois. */
.spro-p-titulo {
  display: flex;
  flex: 1;
  align-items: flex-start;
  gap: var(--spro-p-gap-icone);
  min-width: 0;
}
.spro-p-painel > header h3 {
  flex: 1;
  min-width: 0;
  margin: 0;
  padding: 0;
  font: inherit;
  font-size: var(--spro-p-fonte-titulo);
  font-weight: 400;
  line-height: 18.9px;
  letter-spacing: normal;
  color: var(--spro-p-cor-titulo);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-p-icone {
  display: inline-flex;
  flex: none;
  width: var(--spro-p-icone);
  height: var(--spro-p-icone);
  margin-top: -0.5px;
  color: var(--spro-p-cor-icone);
}
/* O modo escuro antigo do SEI Pro pinta todo descendente (.seiSlim.dark-mode *) com !important: o icone reafirma o azul. */
.spro-p-raiz .spro-p-icone,
.spro-p-raiz .spro-p-icone .spro-glifo {
  color: var(--spro-p-cor-icone) !important;
}
.spro-p-raiz .spro-icone {
  width: var(--spro-p-icone);
  height: var(--spro-p-icone);
}
.spro-p-acoes {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 2px;
}
.spro-p-acao,
.spro-p-alternar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--spro-p-alvo);
  height: var(--spro-p-alvo);
  margin: 0;
  padding: 0;
  font: inherit;
  color: var(--spro-suave);
  background: transparent;
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
.spro-p-acao:hover,
.spro-p-alternar:hover {
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
}
.spro-p-acao.perigo:hover {
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 12%, transparent);
}
.spro-p-acao.ativa {
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 12%, transparent);
}
.spro-p-acao:focus-visible,
.spro-p-alternar:focus-visible,
.spro-p-copiavel:focus-visible,
.spro-p-link:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
.spro-p-alternar .spro-icone {
  transition: transform var(--spro-dur) var(--spro-curva);
}
.spro-p-painel[data-recolhido] .spro-p-alternar .spro-icone {
  transform: rotate(-90deg);
}
.spro-p-corpo {
  display: grid;
  gap: 3px;
  padding: 4px 0 0 calc(var(--spro-p-icone) + var(--spro-p-gap-icone));
}
.spro-p-painel[data-estado="desatualizado"] > header h3::after {
  content: "";
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  vertical-align: middle;
  background: var(--spro-fraco);
  border-radius: 50%;
  animation: spro-p-pulsa 1.1s ease-in-out infinite;
}
@keyframes spro-p-pulsa {
  50% {
    opacity: 0.25;
  }
}

/* ---------- Conte\xFAdo ---------- */
.spro-p-linha {
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 4px 6px;
  min-width: 0;
}
.spro-p-linha.interessado {
  padding-bottom: 3px;
  border-bottom: 1px solid var(--spro-borda);
}
.spro-p-linha.interessado:last-child {
  border-bottom: 0;
}
.spro-p-copiavel {
  display: inline;
  max-width: 100%;
  margin: 0;
  padding: 1px 3px;
  font: inherit;
  color: inherit;
  text-align: left;
  overflow-wrap: anywhere;
  background: transparent;
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: copy;
}
.spro-p-copiavel:hover {
  background: var(--spro-destaque-suave);
}
.spro-p-copiavel.forte {
  font-weight: 600;
}
.spro-p-copiavel.suave {
  color: var(--spro-suave);
}
.spro-p-copiavel.urgente {
  color: var(--spro-perigo);
  font-weight: 650;
}
.spro-p-copiavel.trancado {
  color: var(--spro-aviso);
  font-weight: 650;
}
.spro-p-copiavel img,
.spro-p-copiavel .spro-tag,
.spro-p-marcador-icone {
  width: var(--spro-p-icone);
  height: var(--spro-p-icone);
  margin-right: 5px;
  vertical-align: -2px;
}
.spro-p-marcador {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 6px;
  min-width: 0;
}
.spro-p-acoes-linha {
  display: inline-flex;
  flex: none;
  margin-left: auto;
}
.spro-p-prazo-nativo {
  margin-top: 4px;
}
.spro-p-linha:has(> .spro-p-nivel) {
  flex-wrap: nowrap;
}
.spro-p-nivel {
  display: inline-flex;
  color: var(--spro-destaque);
}
.spro-p-nivel.restrito {
  color: var(--spro-aviso);
}
.spro-p-nivel.sigiloso {
  color: var(--spro-perigo);
}
.spro-p-vazio,
.spro-p-nota {
  color: var(--spro-fraco);
  font-size: var(--spro-p-fonte-corpo);
}
.spro-p-raiz .spro-p-chip .spro-icone,
.spro-p-raiz .spro-p-erro-texto .spro-icone,
.spro-p-raiz .spro-p-nivel .spro-icone {
  width: var(--spro-p-icone-mini);
  height: var(--spro-p-icone-mini);
}
.spro-p-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  font-size: var(--spro-p-fonte-pequena);
  font-weight: 550;
  line-height: 1.5;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 999px;
}
.spro-p-chip.ok {
  color: var(--spro-ok);
  background: color-mix(in srgb, var(--spro-ok) 12%, transparent);
}
.spro-p-chip.atencao,
.spro-p-chip.aviso {
  color: var(--spro-aviso);
  background: color-mix(in srgb, var(--spro-aviso) 14%, transparent);
}
.spro-p-chip.vencido {
  color: var(--spro-perigo);
  background: color-mix(in srgb, var(--spro-perigo) 12%, transparent);
}
.spro-p-link {
  margin: 0;
  padding: 1px 3px;
  font: inherit;
  font-size: var(--spro-p-fonte-corpo);
  font-weight: 600;
  color: var(--spro-destaque);
  background: transparent;
  border: 0;
  border-radius: var(--spro-raio-p);
  cursor: pointer;
}
.spro-p-link:hover {
  text-decoration: underline;
}
.spro-p-link.discreto {
  font-weight: 500;
  color: var(--spro-fraco);
}
.spro-p-link.discreto:hover {
  color: var(--spro-destaque);
}

/* ---------- Anota\xE7\xE3o (post-it) ---------- */
/* A pele \xE9 a do post-it do legado (.stickNotePro): amarelo em degrad\xEA, borda tracejada fina, sombra suave e canto dobrado.
   O papel \xE9 amarelo nos dois temas (como um post-it de verdade), por isso as cores de texto e de estado s\xE3o fixas aqui. */
.spro-p-post-it {
  --spro-texto: #3b3320;
  --spro-suave: #5c5230;
  --spro-fraco: #7a6f45;
  --spro-perigo: #b3261e;
  --spro-aviso: #8f4a00;
  --spro-ok: #0d6b4c;
  --spro-destaque: #1f5fbf;
  position: relative;
  display: grid;
  gap: 3px;
  margin-top: 2px;
  padding: 10px 14px 12px;
  line-height: 1.5;
  color: var(--spro-texto);
  background: linear-gradient(#f9efaf, #f7e98d);
  border: 1px dashed rgb(150 125 30 / 55%);
  border-radius: 3px;
  box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
  overflow: hidden;
}
.spro-p-raiz[data-tema="escuro"] .spro-p-post-it,
dialog.spro-dialogo[data-tema="escuro"] .spro-p-post-it {
  background: linear-gradient(#e9dc9b, #dccb73);
  border-color: rgb(110 90 15 / 60%);
  box-shadow: 0 4px 8px rgb(0 0 0 / 40%);
}
.spro-p-post-it::after {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  width: 14px;
  height: 14px;
  background: linear-gradient(135deg, transparent 50%, rgb(140 115 20 / 28%) 50%);
  pointer-events: none;
}
.spro-p-post-it.prioridade,
.spro-p-raiz[data-tema="escuro"] .spro-p-post-it.prioridade {
  border-left: 4px solid var(--spro-perigo);
}
.spro-p-post-it .spro-p-chip {
  justify-self: start;
  margin-top: 3px;
  color: var(--spro-suave);
  background: rgb(120 95 10 / 14%);
}
.spro-p-post-it .spro-p-chip.vencido {
  color: #fff;
  background: var(--spro-perigo);
}
.spro-p-post-it .spro-p-chip.aviso,
.spro-p-post-it .spro-p-chip.atencao {
  color: var(--spro-aviso);
  background: rgb(143 74 0 / 16%);
}
.spro-p-post-it .spro-p-chip.ok {
  color: var(--spro-ok);
  background: rgb(13 107 76 / 14%);
}
.spro-p-nota-linha {
  min-height: 1.2em;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.spro-p-nota-linha.item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  white-space: normal;
}
.spro-p-nota-linha.item.feito span {
  color: var(--spro-fraco);
  text-decoration: line-through;
}
.spro-p-nota-linha.item input {
  flex: none;
  width: 16px;
  height: 16px;
  margin: 2px 0 0;
  accent-color: var(--spro-destaque);
}

/* O modo escuro do SEI Pro pinta todo descendente (.seiSlim.dark-mode *) de claro com !important; o papel segue amarelo,
   ent\xE3o o texto e os chips do post-it reafirmam as cores escuras com mais especificidade. */
.spro-p-raiz .spro-p-post-it .spro-p-nota-linha,
.spro-p-raiz .spro-p-post-it .spro-p-nota-linha span {
  color: var(--spro-texto) !important;
}
.spro-p-raiz .spro-p-post-it .spro-p-nota-linha.item.feito span {
  color: var(--spro-fraco) !important;
}
.spro-p-raiz .spro-p-post-it .spro-p-chip {
  color: var(--spro-suave) !important;
}
.spro-p-raiz .spro-p-post-it .spro-p-chip.vencido {
  color: #fff !important;
}
.spro-p-raiz .spro-p-post-it .spro-p-chip.aviso,
.spro-p-raiz .spro-p-post-it .spro-p-chip.atencao {
  color: var(--spro-aviso) !important;
}
.spro-p-raiz .spro-p-post-it .spro-p-chip.ok {
  color: var(--spro-ok) !important;
}

/* ---------- Esqueleto e erro ---------- */
.spro-p-esqueleto {
  display: grid;
  gap: 6px;
  padding: 3px 0;
}
.spro-p-barra {
  display: block;
  height: 12px;
  background: linear-gradient(90deg, var(--spro-fundo-3) 25%, var(--spro-fundo-2) 50%, var(--spro-fundo-3) 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: spro-p-brilho 1.2s linear infinite;
}
@keyframes spro-p-brilho {
  to {
    background-position: -200% 0;
  }
}
.spro-p-erro {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  color: var(--spro-perigo);
  font-size: var(--spro-p-fonte-corpo);
}
.spro-p-erro-texto {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
@media (prefers-reduced-motion: reduce) {
  .spro-p-barra,
  .spro-p-painel[data-estado="desatualizado"] > header h3::after {
    animation: none;
  }
}

/* ---------- Modais ---------- */
dialog.spro-p-dialogo > header h2 {
  text-align: left;
}
dialog.spro-p-dialogo .spro-dialogo-corpo {
  gap: 10px;
}
.spro-p-modal-lugar {
  display: grid;
  gap: 10px;
}
.spro-p-campo {
  display: grid;
  gap: 4px;
}
.spro-p-campo-rotulo {
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-suave);
}
.spro-p-campo-dica {
  font-size: 11.5px;
  color: var(--spro-fraco);
}
.spro-p-campo .spro-campo,
.spro-p-busca .spro-campo,
.spro-p-grade .spro-campo {
  width: 100%;
}
/* Seletor com busca dos modais (criarCombo): ocupa a largura do campo, com o botao do tamanho dos outros campos. */
.spro-p-campo .spro-p-combo {
  width: 100%;
  min-height: 32px;
}
.spro-p-campo .spro-p-combo .spro-combo-texto {
  flex: 1 1 auto;
}
dialog.spro-p-dialogo .spro-combo-pop {
  max-width: calc(100vw - 32px);
}
/* O CSS do SEI pinta todo input da pagina de topo (fundo cinza, borda); a busca do seletor volta a ser transparente. */
dialog.spro-p-dialogo .spro-combo-pop input.spro-combo-busca {
  height: 38px;
  padding: 0;
  color: var(--spro-texto);
  background: transparent;
  border: 0;
  border-radius: 0;
  box-shadow: none;
  outline: none;
}
/* Etiqueta do marcador: preenchida na cor dele (tema claro) ou na versao mais clara (tema escuro), com um contorno fino
   que segura o amarelo no branco e o azul marinho no escuro. */
.spro-tag {
  flex: none;
  color: var(--spro-tag, #9aa3ac);
  stroke: color-mix(in srgb, var(--spro-texto) 32%, transparent);
  stroke-width: 1.1;
  stroke-linejoin: round;
}
[data-tema="escuro"] .spro-tag {
  color: var(--spro-tag-escuro, #9aa3ac);
}
.spro-combo > .spro-tag,
.spro-combo-texto > .spro-tag,
.spro-combo-op > .spro-tag {
  color: var(--spro-tag, #9aa3ac);
}
[data-tema="escuro"] .spro-combo > .spro-tag,
[data-tema="escuro"] .spro-combo-texto > .spro-tag,
[data-tema="escuro"] .spro-combo-op > .spro-tag {
  color: var(--spro-tag-escuro, #9aa3ac);
}
.spro-p-nota-marcador {
  display: flex;
  align-items: center;
  gap: 5px;
}
.spro-p-grade {
  display: grid;
  gap: 8px;
}
.spro-p-par {
  display: grid;
  grid-template-columns: 1fr 120px;
  gap: 8px;
}
.spro-p-opcao {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}
.spro-p-opcao input[type="checkbox"] {
  accent-color: var(--spro-destaque);
}
.spro-p-ferramentas {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
}
.spro-p-data {
  width: auto !important;
  min-height: 28px;
}
.spro-p-contador {
  font-size: 11.5px;
  color: var(--spro-fraco);
}
.spro-p-pergunta {
  margin: 0;
  font-size: 13.5px;
}
.spro-p-lista-modal {
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
}
.spro-p-linha-modal {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--spro-fundo-2);
  border-radius: var(--spro-raio-p);
}
.spro-p-linha-modal[data-retirado] .spro-p-texto-modal {
  color: var(--spro-fraco);
  text-decoration: line-through;
}
.spro-p-texto-modal {
  flex: 1;
  min-width: 0;
  overflow-wrap: anywhere;
}
.spro-p-linha-modal .spro-p-acao {
  width: auto;
  padding: 0 8px;
  font-size: 12px;
}
dialog.spro-p-dialogo .spro-p-erro {
  padding: 8px 10px;
  background: color-mix(in srgb, var(--spro-perigo) 10%, transparent);
  border-radius: var(--spro-raio-p);
}

/* ---------- Menu da arvore (menuDoc/) ---------- */
.spro-pm {
  box-sizing: border-box;
  line-height: 1.35;
}
.spro-pm *,
.spro-pm *::before,
.spro-pm *::after {
  box-sizing: border-box;
}
.spro-pm-grupo + .spro-pm-grupo,
.spro-pm-grupo + .spro-menu-sep {
  margin-top: 2px;
}
.spro-pm-grupo + .spro-pm-grupo {
  padding-top: 2px;
  border-top: 1px solid var(--spro-borda);
}
.spro-pm-titulo {
  padding: 5px 10px 2px 8px;
  font-size: 10.5px;
  font-weight: 650;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--spro-fraco);
}
.spro-pm .spro-menu-item {
  padding: 5px 10px 5px 8px;
}
.spro-pm .spro-menu-item:focus-visible {
  box-shadow: var(--spro-anel);
}
.spro-pm .spro-menu-dica {
  margin-left: 6px;
}
.spro-pm-desativado {
  color: var(--spro-fraco);
  cursor: default;
}
.spro-pm-desativado:hover,
.spro-pm-desativado:focus {
  background: transparent;
}
.spro-pm-desativado .spro-menu-icone {
  opacity: 0.55;
}

/* Icones fixos ao lado do documento: ficam na propria arvore, entao as cores vem do SEI (claro por padrao). */
span.action-doc.spro-pm-icone {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 13px;
  margin: 0 1px;
  padding: 3px;
  vertical-align: middle;
  color: #017fff9c;
  border-radius: 5px;
  cursor: pointer;
}
span.action-doc.spro-pm-icone:hover,
span.action-doc.spro-pm-icone:focus-visible {
  color: #fff;
  background: #017fff;
  outline: none;
}
span.action-doc.spro-pm-icone.feito {
  color: #12805c;
}
span.action-doc.spro-pm-icone[aria-busy="true"] {
  opacity: 0.5;
  pointer-events: none;
}
span.action-doc.spro-pm-icone svg {
  display: block;
  pointer-events: none;
}
span.action-doc.spro-pm-icone[data-rotulo]:hover::after,
span.action-doc.spro-pm-icone[data-rotulo]:focus-visible::after {
  content: attr(data-rotulo);
  position: absolute;
  top: calc(100% + 3px);
  left: 0;
  z-index: 2147483000;
  padding: 3px 7px;
  font: 11px/1.3 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
  white-space: nowrap;
  color: #fff;
  background: #2b3036;
  border-radius: 5px;
  pointer-events: none;
}
.seiSlim.dark-mode span.action-doc.spro-pm-icone,
html[data-spro-tema="escuro"] span.action-doc.spro-pm-icone {
  color: #0494c7;
}
.seiSlim.dark-mode span.action-doc.spro-pm-icone:hover,
html[data-spro-tema="escuro"] span.action-doc.spro-pm-icone:hover {
  color: #fbfbfe;
  background: #0494c7;
}

/* ---------- Gantt de tramita\xE7\xE3o ---------- */
dialog.spro-g-dialogo {
  height: min(calc(100vh - 32px), 780px);
}
dialog.spro-g-dialogo .spro-dialogo-corpo {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 0;
  overflow: hidden;
}
.spro-g-visao {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 10px;
  min-height: 0;
}
.spro-g-topo,
.spro-g-ferramentas,
.spro-g-rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
}
.spro-g-topo {
  justify-content: space-between;
}
.spro-g-situacao,
.spro-g-frescor,
.spro-g-resumo,
.spro-g-nota {
  font-size: 12px;
  color: var(--spro-suave);
}
.spro-g-rodape {
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--spro-borda);
}
.spro-g-frescor {
  margin-right: auto;
}
.spro-g-progresso {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--spro-destaque-suave);
  border-radius: var(--spro-raio);
}
.spro-g-progresso[hidden],
.spro-g-aviso[hidden],
.spro-g-dica[hidden] {
  display: none;
}
.spro-g-prog-texto {
  font-size: 12.5px;
  min-width: 0;
}
.spro-g-prog-barra {
  flex: 1;
  height: 6px;
  overflow: hidden;
  background: var(--spro-borda);
  border-radius: 999px;
}
.spro-g-prog-barra > span {
  display: block;
  width: 0;
  height: 100%;
  background: var(--spro-destaque);
  transition: width 200ms var(--spro-curva);
}
.spro-g-prog-barra.indeterminado > span {
  width: 35%;
  animation: spro-g-vai-e-vem 1.1s ease-in-out infinite alternate;
}
@keyframes spro-g-vai-e-vem {
  to {
    transform: translateX(185%);
  }
}
.spro-g-aviso {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12.5px;
  border-radius: var(--spro-raio);
  background: color-mix(in srgb, var(--spro-aviso) 14%, transparent);
  color: var(--spro-texto);
}
.spro-g-aviso .spro-icone {
  flex: none;
  color: var(--spro-aviso);
}
.spro-g-aviso.erro {
  background: color-mix(in srgb, var(--spro-perigo) 12%, transparent);
}
.spro-g-aviso.erro .spro-icone {
  color: var(--spro-perigo);
}
.spro-g-aviso-texto {
  flex: 1;
  min-width: 0;
}
.spro-g-painel {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;
}
.spro-g-vazio {
  margin: 24px 0;
  text-align: center;
  color: var(--spro-suave);
}
.spro-g-gantt {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-height: 0;
}
.spro-g-legenda {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 0 0 0 auto;
  padding: 0;
  font-size: 11.5px;
  color: var(--spro-suave);
  list-style: none;
}
.spro-g-legenda li {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.spro-g-amostra {
  display: inline-block;
  width: 18px;
  height: 10px;
  border-radius: 3px;
  background: var(--spro-destaque);
}
.spro-g-amostra.em-curso {
  background: repeating-linear-gradient(135deg, var(--spro-ok) 0 4px, color-mix(in srgb, var(--spro-ok) 55%, #ffffff) 4px 8px);
}
.spro-g-amostra.pendente {
  background: radial-gradient(var(--spro-aviso) 1.2px, color-mix(in srgb, var(--spro-aviso) 20%, var(--spro-fundo)) 1.5px) 0 0 / 5px 5px;
  outline: 1px dashed var(--spro-aviso);
  outline-offset: -1px;
}
.spro-g-amostra.mantido-aberto {
  background: linear-gradient(90deg, var(--spro-destaque) 55%, var(--spro-ok) 55%);
}
.spro-g-amostra.losango {
  width: 9px;
  height: 9px;
  background: var(--spro-fundo);
  border: 2px solid var(--spro-destaque);
  border-radius: 1px;
  transform: rotate(45deg);
}
.spro-g-quadro {
  position: relative;
  flex: 1;
  min-height: 220px;
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio);
  overflow: hidden;
}
.spro-g-rolagem {
  position: absolute;
  inset: 0;
  overflow: auto;
  scrollbar-width: thin;
}
.spro-g-rolagem:focus-visible {
  outline: none;
  box-shadow: inset var(--spro-anel);
}
.spro-g-svg {
  display: block;
  max-width: none;
  font-family: var(--spro-fonte);
}
.spro-g-svg .raia-impar {
  fill: var(--spro-fundo);
}
.spro-g-svg .raia-par {
  fill: var(--spro-fundo-2);
}
.spro-g-svg .grade {
  stroke: var(--spro-borda);
  stroke-width: 1;
}
.spro-g-svg .grade-forte {
  stroke: var(--spro-borda-forte);
  stroke-width: 1;
}
.spro-g-svg .cabecalho-fundo {
  fill: var(--spro-fundo-2);
}
.spro-g-svg .rotulos-fundo {
  fill: var(--spro-fundo);
  fill-opacity: 0.96;
}
.spro-g-svg text {
  font-size: 11px;
}
.spro-g-svg .eixo-cima {
  font-weight: 600;
  fill: var(--spro-suave);
}
.spro-g-svg .eixo-baixo {
  font-size: 10px;
  fill: var(--spro-fraco);
}
.spro-g-svg .rotulo-raia {
  font-size: 12px;
  font-weight: 650;
  fill: var(--spro-texto);
}
.spro-g-svg .rotulo-nome {
  font-size: 10px;
  fill: var(--spro-suave);
}
.spro-g-svg .spro-g-barra .fundo {
  fill: var(--spro-destaque);
}
.spro-g-svg .spro-g-barra.em-curso .fundo {
  fill: var(--spro-ok);
}
.spro-g-svg .spro-g-barra.pendente .fundo {
  fill: color-mix(in srgb, var(--spro-aviso) 20%, var(--spro-fundo));
  stroke: var(--spro-aviso);
  stroke-width: 1.2;
  stroke-dasharray: 4 3;
}
.spro-g-svg .padrao {
  pointer-events: none;
}
.spro-g-svg .listra-fundo {
  fill: var(--spro-ok);
}
.spro-g-svg .listra-traco {
  fill: rgb(255 255 255 / 38%);
}
.spro-g-svg .pontos-fundo {
  fill: color-mix(in srgb, var(--spro-aviso) 20%, var(--spro-fundo));
}
.spro-g-svg .pontos-ponto {
  fill: var(--spro-aviso);
}
.spro-g-svg .texto-barra {
  font-size: 10.5px;
  font-weight: 600;
  fill: var(--spro-destaque-texto);
  pointer-events: none;
}
.spro-g-svg .spro-g-barra.pendente .texto-barra {
  fill: var(--spro-texto);
}
.spro-g-svg .marca-remessa {
  stroke: var(--spro-texto);
  stroke-width: 1.5;
  stroke-dasharray: 3 2;
}
.spro-g-svg .spro-g-barra,
.spro-g-svg .spro-g-losango {
  outline: none;
  cursor: default;
}
.spro-g-svg .spro-g-barra:hover .fundo,
.spro-g-svg .spro-g-barra:focus-visible .fundo {
  stroke: var(--spro-texto);
  stroke-width: 2;
  stroke-dasharray: none;
}
.spro-g-svg .spro-g-losango {
  fill: var(--spro-fundo);
  stroke: var(--spro-destaque);
  stroke-width: 1.8;
  cursor: pointer;
}
.spro-g-svg .spro-g-losango:hover,
.spro-g-svg .spro-g-losango:focus-visible {
  fill: var(--spro-destaque);
  stroke: var(--spro-texto);
}
.spro-g-svg .spro-g-agora line {
  stroke: var(--spro-perigo);
  stroke-width: 1.4;
  stroke-dasharray: 4 3;
}
.spro-g-svg .spro-g-agora text {
  font-size: 10px;
  font-weight: 600;
  fill: var(--spro-perigo);
}
.spro-g-dica {
  position: absolute;
  z-index: 3;
  box-sizing: border-box;
  max-width: 360px;
  padding: 9px 11px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  box-shadow: var(--spro-sombra-3);
  pointer-events: none;
}
.spro-g-dica-titulo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin-bottom: 4px;
  font-weight: 650;
}
.spro-g-dica-selo {
  padding: 0 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
  border-radius: 999px;
}
.spro-g-dica-linha {
  display: grid;
  grid-template-columns: 92px 1fr;
  gap: 8px;
}
.spro-g-dica-rotulo {
  color: var(--spro-suave);
}
.spro-g-dica-docs {
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid var(--spro-borda);
}
.spro-g-dica-docs > div {
  padding-left: 8px;
}
.spro-g-tempo {
  display: grid;
  gap: 10px;
  align-content: start;
  min-height: 0;
  overflow: auto;
}
.spro-g-tabela {
  width: 100%;
  font-size: 12.5px;
  border-collapse: collapse;
}
.spro-g-tabela th,
.spro-g-tabela td {
  padding: 6px 10px;
  text-align: left;
  border-bottom: 1px solid var(--spro-borda);
}
.spro-g-tabela thead th {
  font-size: 11.5px;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
}
.spro-g-tabela tbody th {
  font-weight: 600;
}
.spro-g-tabela .num {
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.spro-g-tabela td.barra {
  width: 34%;
}
.spro-g-legenda-tabela {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
}
.spro-g-barra-pct {
  display: block;
  height: 8px;
  background: var(--spro-destaque);
  border-radius: 999px;
}
.spro-g-barra-pct.em-curso {
  background: repeating-linear-gradient(135deg, var(--spro-ok) 0 4px, color-mix(in srgb, var(--spro-ok) 55%, #ffffff) 4px 8px);
}
.spro-g-selo-curso {
  margin-left: 8px;
  padding: 0 7px;
  font-size: 11px;
  font-weight: 600;
  color: var(--spro-ok);
  background: color-mix(in srgb, var(--spro-ok) 14%, transparent);
  border-radius: 999px;
}
dialog.spro-g-dialogo-doc {
  height: min(calc(100vh - 32px), 780px);
}
dialog.spro-g-dialogo-doc .spro-dialogo-corpo {
  flex: 1;
  padding-bottom: 12px;
}
.spro-g-documento {
  width: 100%;
  height: 100%;
  min-height: 420px;
  background: #ffffff;
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio);
}

/* Vis\xE3o para impress\xE3o: invis\xEDvel na tela; ao imprimir, \xE9 a \xFAnica coisa da p\xE1gina. */
.spro-g-impressao {
  display: none;
}
@media print {
  html[data-spro-imprimindo] body > *:not(.spro-g-impressao) {
    display: none !important;
  }
  html[data-spro-imprimindo] body {
    margin: 0 !important;
    background: #ffffff !important;
  }
  html[data-spro-imprimindo] .spro-g-impressao {
    display: block !important;
    box-sizing: border-box;
    padding: 8mm;
    font: 11px/1.4 system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
    color: #000000;
    background: #ffffff;
  }
  .spro-g-impressao h1 {
    margin: 0 0 4px;
    font-size: 16px;
  }
  .spro-g-impressao h2 {
    margin: 14px 0 4px;
    font-size: 13px;
    break-after: avoid;
  }
  .spro-g-impressao-sub {
    margin: 0 0 8px;
    color: #444444;
  }
  .spro-g-impressao .spro-g-svg {
    width: 100%;
    height: auto;
  }
  .spro-g-impressao .spro-g-tabela {
    break-inside: auto;
  }
  .spro-g-impressao .spro-g-tabela tr {
    break-inside: avoid;
  }
  .spro-g-impressao * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
@media (prefers-reduced-motion: reduce) {
  .spro-g-prog-barra.indeterminado > span {
    animation: none;
  }
}

/* ---------- Filtro da \xE1rvore ---------- */
/* O filtro s\xF3 esconde: o atributo vai em cada irm\xE3o da linha do n\xF3 (a \xE1rvore do SEI \xE9 plana) e sai ao limpar. */
[data-spro-f-oculto] {
  display: none !important;
}
.spro-f-barra {
  box-sizing: border-box;
  margin: 0 0 6px;
  padding: 6px 4px 4px;
  font-family: var(--spro-fonte);
  font-size: var(--spro-p-fonte-corpo);
  line-height: 1.4;
  color: var(--spro-texto);
  border-bottom: 1px solid var(--spro-borda);
}
.spro-f-barra[hidden],
.spro-f-barra [hidden] {
  display: none !important;
}
.spro-f-barra *,
.spro-f-barra *::before,
.spro-f-barra *::after {
  box-sizing: border-box;
}
.spro-f-linha {
  position: relative;
  display: flex;
  align-items: center;
}
.spro-f-lupa {
  position: absolute;
  left: 9px;
  display: inline-flex;
  color: var(--spro-fraco);
  pointer-events: none;
}
.spro-f-busca {
  flex: 1 1 auto;
  min-width: 0;
  height: 30px;
  margin: 0;
  padding: 0 30px 0 30px;
  font: inherit;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: 6px;
}
/* O bot\xE3o de limpar \xE9 o nosso (com aria-label); o do navegador apareceria dobrado. */
.spro-f-busca::-webkit-search-cancel-button,
.spro-f-busca::-webkit-search-decoration {
  -webkit-appearance: none;
  appearance: none;
}
.spro-f-busca::placeholder {
  color: var(--spro-fraco);
}
.spro-f-busca:focus-visible,
.spro-f-chip:focus-visible,
.spro-f-limpar:focus-visible {
  outline: 2px solid var(--spro-destaque);
  outline-offset: 1px;
}
.spro-f-limpar {
  position: absolute;
  right: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  color: var(--spro-suave);
  background: transparent;
  border: 0;
  border-radius: 4px;
  cursor: pointer;
}
.spro-f-limpar:hover {
  color: var(--spro-texto);
  background: var(--spro-fundo-3);
}
.spro-f-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 5px;
}
.spro-f-chip {
  height: 26px;
  margin: 0;
  padding: 0 10px;
  font: inherit;
  font-size: var(--spro-p-fonte-pequena);
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda-forte);
  border-radius: 13px;
  cursor: pointer;
}
.spro-f-chip:hover {
  color: var(--spro-texto);
  background: var(--spro-fundo-3);
}
.spro-f-chip[aria-pressed="true"] {
  color: var(--spro-destaque-texto);
  background: var(--spro-destaque);
  border-color: var(--spro-destaque);
}
.spro-f-status {
  margin-top: 5px;
  color: var(--spro-suave);
  font-size: var(--spro-p-fonte-corpo);
}
.spro-f-status-texto {
  font-weight: 600;
  color: var(--spro-texto);
}
.spro-f-dica {
  display: block;
  margin-top: 1px;
}
.spro-f-dica:empty {
  display: none;
}

/* ---------- Legado no quadro da arvore (Consultar Andamento, Processos Relacionados) na mesma escala ---------- */
/* O legado estiliza esses dois por classe (.newLink: 1.2em sobre 12px = 14,4px, lupa de 17px); com o modulo ativo eles descem
   um pouco e os nossos paineis sobem, para o cabecalho de cada painel ser IGUAL ao rotulo "Consultar Andamento" (README, "Escala"). */
html[data-seipro-processo-paineis] #divConsultarAndamento a.newLink,
html[data-seipro-processo-paineis] #divRelacionados label.newLink {
  font-size: var(--spro-p-fonte-titulo);
  line-height: 1.4;
  font-weight: 400;
  color: var(--spro-p-cor-titulo);
}
html[data-seipro-processo-paineis] #divConsultarAndamento a.newLink i.iconDadosProcesso,
html[data-seipro-processo-paineis] #divRelacionados label.newLink i.iconDadosProcesso {
  font-size: var(--spro-p-icone);
  line-height: 1;
}
/* "Processos Relacionados" e um label dentro do painel do legado (padding de 1,2em): o icone vai para o mesmo x do da lupa (25,4 px
   do quadro), numa caixa de 16 px (o glifo retweet tem 20 px de largura e se centra nela), e o texto 5 px depois. */
html[data-seipro-processo-paineis] #divRelacionados label.newLink i.iconDadosProcesso {
  display: inline-block;
  width: var(--spro-p-icone);
  margin: 0 var(--spro-p-gap-icone) 0 3px;
  text-align: center;
}
html[data-seipro-processo-paineis] #divRelacionados .divRelacionadosParcial a,
html[data-seipro-processo-paineis] #divRelacionadosParciais a {
  font-size: var(--spro-p-fonte-corpo);
}

/* ---------- Aviso de documentos nao assinados (quadro do Enviar Processo) ---------- */
.spro-na {
  box-sizing: border-box;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
  margin: 0 20px;
  padding: 4px 10px;
  font: 400 13px/1.4 var(--spro-fonte, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif);
  color: var(--spro-texto);
  background: var(--spro-fundo-2);
  border-radius: 6px;
  vertical-align: middle;
}
.spro-na.pendente {
  background: color-mix(in srgb, var(--spro-perigo) 12%, var(--spro-fundo));
}
.spro-na.falha {
  background: color-mix(in srgb, var(--spro-aviso) 14%, var(--spro-fundo));
}
.spro-na-icone {
  display: inline-flex;
}
.spro-na.pendente .spro-na-icone {
  color: var(--spro-perigo);
}
.spro-na.ok .spro-na-icone {
  color: var(--spro-ok);
}
.spro-na.falha .spro-na-icone {
  color: var(--spro-aviso);
}
.spro-na .spro-p-link {
  color: var(--spro-destaque);
}
.spro-na-lista {
  max-height: 280px;
  overflow-y: auto;
}
.spro-na-lista .spro-p-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  text-align: left;
}
.spro-na-data {
  margin-left: auto;
  flex: none;
  font-size: 12px;
  color: var(--spro-suave);
}

/* ---------- Modal de lista com pesquisa (assuntos e interessados) ---------- */
dialog.spro-p-dialogo .spro-p-lupa-titulo {
  margin: 0;
  font-size: 12.5px;
  font-weight: 650;
  letter-spacing: 0.02em;
  color: var(--spro-suave);
}
dialog.spro-p-dialogo .spro-p-lupa-busca {
  display: grid;
  gap: 6px;
  padding-top: 10px;
  border-top: 1px solid var(--spro-borda);
}
dialog.spro-p-dialogo .spro-p-lupa-estado {
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 1.4em;
}
dialog.spro-p-dialogo .spro-p-resultados,
dialog.spro-p-dialogo .spro-p-lista-modal[aria-label$="no processo"] {
  max-height: 220px;
  overflow-y: auto;
}
dialog.spro-p-dialogo .spro-p-lista-modal[aria-label$="no processo"] {
  max-height: 200px;
}
dialog.spro-p-dialogo .spro-p-linha-modal[data-estado="novo"] {
  background: color-mix(in srgb, var(--spro-ok) 9%, var(--spro-fundo-2));
}
dialog.spro-p-dialogo .spro-p-linha-modal[data-estado="retirado"] .spro-p-texto-modal {
  color: var(--spro-fraco);
  text-decoration: line-through;
}
dialog.spro-p-dialogo .spro-p-linha-modal .spro-p-acao:disabled {
  color: var(--spro-fraco);
  cursor: default;
}
dialog.spro-p-dialogo .spro-p-lupa-situacao {
  margin-right: auto;
  align-self: center;
}
dialog.spro-p-dialogo .spro-p-vazio {
  padding: 6px 2px;
  color: var(--spro-fraco);
}

/* ---------- Processos do interessado ---------- */
.spro-p-linha.interessado .spro-p-proc-do-interessado {
  margin-left: auto;
  flex: none;
}
dialog.spro-p-dialogo .spro-p-interessado-nome {
  margin: 0;
  font-weight: 650;
  overflow-wrap: anywhere;
}
dialog.spro-p-dialogo .spro-p-lista-processos {
  display: grid;
  gap: 6px;
  max-height: min(420px, 55vh);
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
}
dialog.spro-p-dialogo .spro-p-processo {
  display: grid;
  gap: 2px;
  padding: 7px 10px;
  background: var(--spro-fundo-2);
  border-radius: var(--spro-raio-p, 6px);
}
dialog.spro-p-dialogo .spro-p-processo-topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 8px;
}
dialog.spro-p-dialogo .spro-p-proc-num {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 650;
}
dialog.spro-p-dialogo .spro-p-processo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 14px;
  font-size: 12px;
  color: var(--spro-suave);
}
dialog.spro-p-dialogo .spro-p-processos-rodape {
  display: flex;
  justify-content: center;
}
dialog.spro-p-dialogo .spro-p-esqueleto {
  padding: 8px 10px;
  list-style: none;
}

/* ---------- Edicao da anotacao NO LUGAR (o proprio papel do post-it, sem modal) ---------- */
/* O papel e amarelo nos dois temas; o modo escuro antigo do SEI Pro pinta todo descendente (.seiSlim.dark-mode *) de claro com
   !important, por isso o que mora no papel reafirma cor e fundo com !important. */
.spro-p-post-it.editavel {
  cursor: text;
}
.spro-p-post-it-edicao {
  gap: 6px;
  padding: 10px 12px 8px;
  margin-top: 2px;
  cursor: auto;
}
.spro-p-post-it-edicao:focus-within {
  box-shadow: 0 0 0 2px var(--spro-destaque), 0 4px 6px rgb(0 0 0 / 10%);
}
.spro-p-raiz .spro-p-post-it-edicao textarea.spro-p-post-it-texto {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 5.8em;
  max-height: 60vh;
  margin: 0;
  padding: 0;
  font: var(--spro-p-fonte-corpo) / 1.5 var(--spro-fonte, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif);
  color: var(--spro-texto) !important;
  background: transparent !important;
  border: 0 !important;
  border-radius: 0;
  outline: none;
  box-shadow: none !important;
  resize: none;
  overflow-y: auto;
}
.spro-p-raiz .spro-p-post-it-edicao textarea.spro-p-post-it-texto::placeholder {
  color: var(--spro-fraco);
  opacity: 1;
}
.spro-p-raiz .spro-p-post-it-edicao textarea.spro-p-post-it-texto:read-only {
  opacity: 0.75;
}
/* Rodape do papel: o contador ocupa o que sobra e nunca passa por baixo da situacao (quebram de linha antes de sobrepor). */
.spro-p-post-it-rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 10px;
  min-width: 0;
  padding-top: 6px;
  border-top: 1px dashed rgb(150 125 30 / 45%);
}
.spro-p-raiz .spro-p-post-it-rodape .spro-p-contador {
  flex: 1 1 11em;
  min-width: 0;
  font-size: var(--spro-p-fonte-pequena);
  color: var(--spro-suave) !important;
}
.spro-p-raiz .spro-p-post-it-situacao {
  flex: none;
  font-size: var(--spro-p-fonte-pequena);
  color: var(--spro-suave) !important;
}
.spro-p-post-it-situacao:empty {
  display: none;
}
.spro-p-post-it-aviso {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 2px 8px;
  padding: 5px 8px;
  font-size: var(--spro-p-fonte-pequena);
  line-height: 1.4;
  background: rgb(255 255 255 / 55%);
  border-radius: 4px;
}
.spro-p-post-it-aviso[hidden] {
  display: none;
}
.spro-p-raiz .spro-p-post-it-aviso,
.spro-p-raiz .spro-p-post-it-aviso-texto {
  color: var(--spro-texto) !important;
}
.spro-p-post-it-aviso.erro {
  border-left: 3px solid var(--spro-perigo);
}
.spro-p-raiz .spro-p-post-it-aviso.erro .spro-p-post-it-aviso-texto {
  color: var(--spro-perigo) !important;
}
.spro-p-raiz .spro-p-post-it-aviso .spro-p-link {
  color: var(--spro-destaque) !important;
  background: transparent !important;
}
/* Barra de ferramentas: em linha propria; quebra de linha em vez de sobrepor, qualquer que seja a largura da coluna. */
.spro-p-post-it-barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
  min-width: 0;
}
.spro-p-post-it-espaco {
  flex: 1 1 0;
  min-width: 0;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao {
  display: inline-flex;
  flex: none;
  align-items: center;
  justify-content: center;
  gap: 5px;
  min-width: var(--spro-p-alvo);
  min-height: var(--spro-p-alvo);
  margin: 0;
  padding: 0 9px;
  font: 600 12.5px/1.4 var(--spro-fonte, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif);
  color: var(--spro-suave) !important;
  background: transparent !important;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao.so-icone {
  padding: 0;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao .spro-glifo,
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao-texto {
  color: inherit !important;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao:hover:not(:disabled) {
  color: var(--spro-destaque) !important;
  background: rgb(120 95 10 / 14%) !important;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao.perigo:hover:not(:disabled) {
  color: var(--spro-perigo) !important;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px var(--spro-destaque);
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao:disabled {
  opacity: 0.5;
  cursor: default;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao.primario {
  color: #fff !important;
  background: var(--spro-destaque) !important;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao.primario:hover:not(:disabled) {
  color: #fff !important;
  background: color-mix(in srgb, var(--spro-destaque) 85%, #000) !important;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-botao[aria-pressed="true"] {
  color: #fff !important;
  background: var(--spro-perigo) !important;
}
.spro-p-post-it-data-rotulo {
  display: inline-flex;
  flex: none;
  align-items: center;
  gap: 4px;
  padding-left: 4px;
}
.spro-p-raiz .spro-p-post-it-edicao .spro-p-post-it-data-rotulo {
  color: var(--spro-suave) !important;
}
.spro-p-raiz .spro-p-post-it-edicao input.spro-p-post-it-data {
  box-sizing: border-box;
  min-height: var(--spro-p-alvo);
  padding: 1px 6px;
  font: var(--spro-p-fonte-pequena) / 1.4 var(--spro-fonte, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif);
  color: var(--spro-texto) !important;
  background: rgb(255 255 255 / 45%) !important;
  border: 1px solid rgb(150 125 30 / 40%);
  border-radius: 6px;
  color-scheme: light;
}
`;var Tc={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function _e(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Tc[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function et(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=_e(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function ao(o){return typeof o=="string"?xo(o):o==null?"":String(o)}var Lc=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function $o(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Lc))e.add(r[0]);return[...e]}function Z(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function eo(o,e,r={}){let t=Array.isArray(o)?o:$o(o);for(let a of t){let n=Z(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function ia(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=$o(r).filter(i=>Z(i).get("acao")===e),n=(t.length?t:$o(o.html).filter(i=>Z(i).get("acao")===e)).sort((i,s)=>[...Z(i).keys()].length-[...Z(s).keys()].length)[0];if(!n)throw new S("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function sa(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=et(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=_e(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function ca(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=et(o,r.index+r[0].length);e.push({tipo:ao(t[0]),idPai:ao(t[2]),href:ao(t[3]),titulo:ao(t[5]),icone:ao(t[6]),extra:t[8]==null?void 0:ao(t[8])})}return e}function la(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function pa(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>ao(e[1])))]}function da(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var kc=/\s*\(\d{5,}\)\s*$/;function ua(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=ao(r.args[1]),a=ao(r.args[5]),n=ao(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(f=>f.tipo==="ASSINATURA"&&f.idPai===t),{nivel:c,hipotese:p}=la(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:ao(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(kc,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:p,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(f=>f.tipo==="UNIDADE_GERADORA"&&f.idPai===t)?.extra,link:ao(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:$o(r.props.acoes??""),botoes:pa(r.props.acoes??""),funcoes:da(r.props.acoes??"")}})}function ma(o){return ua(sa(o.html),ca(o.html))}function rt(o){let e=o.html,r=sa(e),t=ca(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new S("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=ao(a.args[1]),i=la(t,n),s=ua(r,t);return{idProcedimento:n,protocolo:ao(a.args[5])||ao(a.args[15]),tipo:ao(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:$o(a.props.acoes??""),botoesProcesso:pa(a.props.acoes??""),funcoesProcesso:da(a.props.acoes??""),linkProcesso:ao(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:$o(e),pagina:o}}async function fa(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new S("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=eo(t.html,"procedimento_visualizar")&&$o(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return rt(t)}function io(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?eo(t.acoes,e):null}return eo(o.acoesProcesso,e)??eo(o.links,e,{id_procedimento:o.idProcedimento})}function so(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var ie={publico:"0",restrito:"1"},se={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function ce(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(xo(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var ba="\xA5",tt="\xB1";function ga(o){return o.map(e=>`${e.id}${tt}${e.texto}`).join(ba)}function Nc(o){return o?o.split(ba).map(e=>{let[r,...t]=e.split(tt);return{id:r,texto:t.join(tt)}}):[]}function va(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var K=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=_c(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new S("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,T(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${ha(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??T(t),texto:T(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=ho(r),n=t.find(i=>i.valor===r)??t.find(i=>ho(i.texto)===a)??at(t.filter(i=>ho(i.texto).includes(a)));if(!n)throw new S("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Nc(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new S("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:ga(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new S("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new S("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new S("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${T(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??at([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??T(r)??e]:[e,e]}hiddenDaLupa(e){let r=va(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of va(this.pagina.html)){let t=this.elemento.querySelector(`select#${ha(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:T(n)}));(this.valor(r)??"")||this.definir({[r]:ga(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function _c(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(p=>p.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??T(p)})}}return e}function ho(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function le(o,e,r){let t=ho(e),a=o.find(n=>n.id===e)??o.find(n=>ho(n.texto)===t)??at(o.filter(n=>ho(n.texto).includes(t)));if(!a)throw new S("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function at(o){return o.length===1?o[0]:void 0}function ha(o){return o.replace(/([^\w-])/g,"\\$1")}function Rc(o){let e=new Set;return o.filter(r=>!e.has(r.id)&&e.add(r.id))}function nt(o){return o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function it(o,e){let t=new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${nt(e)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`).exec(o);return t?xo(t[1]):null}function st(o,e){let t=new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${nt(e)}['"]`).exec(o)?.[1];if(!t)return!1;let a=new RegExp(`\\b${nt(t)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(o)?.[1];return!!a&&/encodeURIComponent\s*\(/.test(a)}async function ct(o,e,r,t,a=!1){let n=a?encodeURIComponent(ke(r)):r,i=await o.ajax(e,[["palavras_pesquisa",n]],{sinal:t,utf8:!0});return Rc(i.map(s=>({...s,texto:xo(s.texto)})))}function pe(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let i of o.matchAll(a))n.set(i[1],i[2]);return n}function $c(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function zc(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Re(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=$c(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:zc(o),sigla:T(r)||T(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var qc=3e4,sr=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ne(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new S("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Re(this.base())}linkMenu(e){return ia(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new S("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=K.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=Z(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new S("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=Z(xo(c)).get("id_procedimento")??"",f=s.get("id_protocolo")??"",m={idProcedimento:d,idDocumento:f&&f!==d?f:void 0,linkArvore:xo(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<qc)return a.arvore;let n=await fa(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:xo(i[1]),texto:xo(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=ne(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function de(o,e,r){let t=io(o,e);if(!t)throw new S("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function $e(o,e,r){let t=await K.abrir(o,de(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var xa=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Ea(o,e,r){let t=xa.exec(r),a=r.replace(xa,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function Hc(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(T(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>T(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Ea(s||void 0,T(i[t]),T(i[a]))}async function ya(o,e,r){let t=await o.obter(de(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=K.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Ea(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=Hc(t);if(a===void 0)throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",T(t.doc.querySelector("title")));return a}function Fc(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?_e(o.pagina.html,e.index+e[0].length-1)[0]:""}function Vc(o){if(!o.trim())return[];let e=ne(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:T(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function Pa(o,e){let r=Vc(Fc(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??Re(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!io(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}var cr=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function Da(o,e){let r=o.filter(i=>i.unidade===e),t=i=>i.reduce((s,c)=>!s||cr(c.data)>cr(s.data)?c:s,null),a=t(r.filter(i=>i.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(i=>i.descricao.includes("Processo retirado do bloco")));return n&&cr(a.data)<cr(n.data)?null:a.descricao}function lr(o){let e=t=>!!io(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function wa(o,e,r){let t=await o.obter(de(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",T(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:T(s[1]),texto:T(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:T(s[3]),data:T(s[4])}})}async function Sa(o,e,r){let a=(await K.abrir(o,de(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function Ma(o,e,r){let t=await o.obter(de(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=eo(t.html,"andamento_marcador_cadastrar");if(!i)throw new S("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:T(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function Ca(o,e,r){let t=await o.obter(de(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>eo(t.html,p)).find(Boolean);if(!c)throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=K.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function Ia(o,e,r){let t=io(e,"procedimento_alterar")??io(e,"procedimento_consultar");if(!t)throw new S("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await K.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),assuntos:a.itensLupa("selAssuntos"),interessadosNegados:pe(a.pagina.html,"interessado"),assuntosNegados:pe(a.pagina.html,"assunto"),pesquisarAssuntos:(c,p)=>Aa(o,a,"hdnIdAssunto","assuntos",c,p),pesquisarContatos:(c,p)=>Aa(o,a,"hdnIdInteressadoProcedimento","contatos",c,p),async hipoteses(c,p){return(await ce(o,a,c,p)).map(d=>({valor:d.id,texto:d.texto}))}}}async function Aa(o,e,r,t,a,n){let i=it(e.pagina.html,r);if(!i)throw new S("SEI_VERSAO_NAO_SUPORTADA",`A tela de altera\xE7\xE3o do processo n\xE3o tem a pesquisa de ${t}.`);return ct(o,i,a,n,st(e.pagina.html,r))}var pr=(o,e)=>o>0&&e-o<18e5;var ze=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function lt(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:Da(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function ue(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:pr(e.coletadoEm,o.agora().getTime())}:null}async function Oa(o){let e=await ue(o);return e?.vale?(lt(o,e.historico),!0):!1}async function me(o,e={}){if(o.sigiloso)throw new ze;let r=await ue(o);if(r?.vale&&!e.forcar)return lt(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),lt(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var Ta="data-seipro-processo-paineis",La="data-seipro-processo-menu",ka="data-seipro-processo-capa",Na="data-seipro-processo-gantt",_a="data-seipro-processo-titulo",Ra="data-seipro-processo-aviso",$a="naoassinados",dr="spro-processo-gantt-abrir",ur="spro-processo-capa-pedir",mr="spro-processo-capa-calcular",fr="spro-processo-capa-cancelar",gr="data-spro-capa-coleta";var za="filtroarvore";var vr="processo/",pt=(o,e)=>`${vr}${o}/${e}`,dt=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},ut="processo-historico/",mt=(o,e)=>`${ut}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var Co={fill:"currentColor",stroke:"none"},qa="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Ha={estrela:[["path",{d:qa}]],estrelaCheia:[["path",{d:qa,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...Co}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...Co}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...Co}],["circle",{cx:"12",cy:"12",r:"1.4",...Co}],["circle",{cx:"19",cy:"12",r:"1.4",...Co}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...Co}],["circle",{cx:"15",cy:"6",r:"1.3",...Co}],["circle",{cx:"9",cy:"12",r:"1.3",...Co}],["circle",{cx:"15",cy:"12",r:"1.3",...Co}],["circle",{cx:"9",cy:"18",r:"1.3",...Co}],["circle",{cx:"15",cy:"18",r:"1.3",...Co}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},su=Object.keys(Ha);function $(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of Ha[o]){let c=r.createElementNS(t,i);for(let[p,d]of Object.entries(s))c.setAttribute(p,d);a.append(c)}return a}function Uc(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Fa(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function Va(o,e,r,t,a){let n=o.body??o.documentElement;for(let f of[n,...o.querySelectorAll("dialog")])for(let m of[...f.children])m.classList.contains("spro-aviso")&&m.remove();let i=l("div",{class:"spro-aviso",role:"status"},$("check",16),l("span",{},e),...Uc(r).map(f=>l("button",{type:"button",onclick:()=>{i.remove(),f.fazer()}},f.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let f=Fa(o);f.append(i),s(),f.localName==="dialog"&&f.addEventListener("close",()=>{if(!(!d||!f.contains(i))){if(a&&Fa(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){d=!1,i.remove();return}p()}},{once:!0})},d=!0;return p(),setTimeout(()=>{d=!1,i.remove()},t),i}async function ft(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function Q(o,e,r=4e3){try{Va(o.topo,e,void 0,r)}catch{}}async function Ua(o,e){let r=await ft(o.doc,e);Q(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var Ba={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},Ga={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function Ao(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function zo(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":Ao(o)}async function ja(o,e,r=100){let t=Date.now()+e;for(;Date.now()<t;){if(o())return!0;await new Promise(a=>setTimeout(a,r))}return o()}function bo(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Wa=new Set;var Bc=null;function Gc(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Ka(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function hr(o,e,r){let t=o.ownerDocument,a=t.defaultView;Gc(o).append(e);let n=!0,i=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let u=a?.innerHeight??0,v=a?.innerWidth??0,h=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,v-16)),g=r.alinharDireita?m.right-h:m.left,y=Math.max(8,Math.min(g,v-h-8)),b=r.alturaMaxima??360;e.style.maxHeight="none";let w=Math.min(e.scrollHeight||b,b),M=u-m.bottom-8,P=m.top-8,E=Bc?.()??!1,I=!E&&M<Math.min(w,200)&&P>M;e.style.left=`${y}px`,e.style.width=`${h}px`,e.style.maxHeight=`${E?b:Math.max(140,Math.min(b,I?P:M>140?M:b))}px`,e.classList.toggle("spro-flutuante-cima",I),I?(e.style.top="",e.style.bottom=`${u-m.top+4}px`):(e.style.bottom="",e.style.top=`${m.bottom+4}px`),Ka(a,I?0:Math.ceil(m.bottom+4+w+12))},s=m=>{let u=m.composedPath?.()??[],v=m.target,h=g=>u.includes(g)||!!v&&!!g.contains?.(v);h(e)||h(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},p=m=>{m.target instanceof Node&&e.contains(m.target)||c()},d=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let f={ancora:o,fechar:()=>r.aoFechar()};return Wa.add(f),i(),{posicionar:i,fechar(){n&&(n=!1,Wa.delete(f),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),e.remove(),Ka(a,0))}}}function Xa(o,e){let r=bo(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,i)=>{let s=bo(n.rotulo),c=bo(n.complemento??""),p=`${s} ${c} ${bo(n.descricao??"")}`;if(!t.every(f=>p.includes(f)))return;let d=s.startsWith(r)?0:`${s} ${c}`.split(" ").some(f=>f.startsWith(t[0]))?1:2;a.push({o:n,nota:d,i})}),a.sort((n,i)=>n.nota-i.nota||n.i-i.i).map(n=>n.o)}function Ya(o,e){let r=o.normalize("NFC"),t=bo(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",i=[];a.forEach((p,d)=>{let f=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let m of f)n+=m,i.push(d)});let s=new Array(a.length).fill(!1);for(let p of t){let d=n.indexOf(p);if(!(d<0))for(let f=d;f<d+p.length;f++)s[i[f]]=!0}let c=[];return a.forEach((p,d)=>{let f=c[c.length-1];f&&f.marcado===s[d]?f.texto+=p:c.push({texto:p,marcado:s[d]})}),c}var jc=0;function Ja(o){let e=`spro-combo-${++jc}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=A=>r().find(L=>L.valor===A)??t.get(A),n=[...o.valor??[]],i=null,s="",c=0,p=[],d=null,f=o.vazio??"Escolher\u2026",m={tipo:"pronto"},u=0,v=l("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),h=()=>o.aoMudar?.([...n]);function g(){let A=[];o.icone&&A.push($(o.icone,15));let L=n.map(N=>a(N)).filter(N=>!!N),O=l("span",{class:"spro-combo-texto"});if(!L.length)O.classList.add("spro-combo-vazio"),O.append(f);else{let N=L[0];N.marca&&O.append(N.marca()),N.cor&&O.append(l("span",{class:"spro-combo-cor",style:`background:${N.cor}`})),O.append(l("span",{class:"spro-combo-rotulo"},N.rotulo)),N.complemento&&O.append(l("span",{class:"spro-combo-compl"},N.complemento)),L.length>1&&O.append(l("span",{class:"spro-combo-mais"},`+${L.length-1}`))}A.push(O,$("chevron",14)),v.setAttribute("aria-busy",m.tipo==="carregando"?"true":"false"),v.classList.toggle("spro-combo-erro",m.tipo==="erro"),v.classList.toggle("spro-combo-ativo",o.multiplo===!0&&L.length>0),v.replaceChildren(...A)}let y=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function b(A){if(o.multiplo){n=n.includes(A.valor)?n.filter(O=>O!==A.valor):[...n,A.valor],h(),g(),E();return}let L=n.length!==1||n[0]!==A.valor;n=[A.valor],g(),B(!0),L&&h()}async function w(){if(!o.criar)return;let A=s.trim();if(!A)return;let L=await o.criar(A);if(L){if(t.set(L.valor,L),s="",i){let O=i.querySelector(".spro-combo-busca");O&&(O.value="")}o.multiplo&&n.includes(L.valor)?E():b(L)}}function M(A,L){let O=n.includes(A.valor),N=l("span",{class:"spro-combo-op-rotulo"});for(let k of Ya(A.rotulo,s))N.append(k.marcado?l("mark",{},k.texto):k.texto);let X=A.complemento?l("span",{class:"spro-combo-op-compl"}):null;if(X&&A.complemento)for(let k of Ya(A.complemento,s))X.append(k.marcado?l("mark",{},k.texto):k.texto);let U=l("li",{role:"option",id:`${e}-op-${L}`,class:`spro-combo-op${L===c?" spro-combo-op-ativa":""}`,"data-valor":A.valor,"aria-selected":O?"true":"false"},o.multiplo?l("span",{class:"spro-combo-caixa","aria-hidden":"true"},O?$("check",12):null):null,A.marca?A.marca():null,A.cor?l("span",{class:"spro-combo-cor",style:`background:${A.cor}`}):null,A.icone?$(A.icone,15):null,l("span",{class:"spro-combo-op-textos"},X?l("span",{class:"spro-combo-op-linha"},N,X):N,A.descricao?l("span",{class:"spro-combo-op-desc"},A.descricao):null),A.contagem!==void 0?l("span",{class:"spro-combo-conta"},String(A.contagem)):null,!o.multiplo&&O?l("span",{class:"spro-combo-marca"},$("check",14)):null);return U.addEventListener("pointerdown",k=>k.preventDefault()),U.addEventListener("click",()=>{c=L,b(A)}),U.addEventListener("pointermove",()=>{c!==L&&(c=L,P())}),U}function P(){if(!i)return;let A=[...i.querySelectorAll('[role="option"]')];A.forEach((X,U)=>{X.classList.toggle("spro-combo-op-ativa",U===c)});let L=A[c],N=i.querySelector(".spro-combo-busca")??i.querySelector('[role="listbox"]');L?(N?.setAttribute("aria-activedescendant",L.id),L.scrollIntoView?.({block:"nearest"})):N?.removeAttribute("aria-activedescendant")}function E(){if(!i)return;let A=Xa(r(),s);u=A.length,p=o.limite!==void 0&&A.length>o.limite?A.slice(0,o.limite):A,m.tipo!=="pronto"&&(p=[]),c>=p.length&&(c=Math.max(0,p.length-1));let L=i.querySelector('[role="listbox"]');L.setAttribute("aria-busy",m.tipo==="carregando"?"true":"false");let O=i.querySelector(".spro-combo-extras");if(O.replaceChildren(),m.tipo==="carregando")L.replaceChildren(...[62,84,48,74].map(k=>l("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},l("span",{style:`width:${k}%`})))),O.append(l("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(m.tipo==="erro"){L.replaceChildren();let k=m.tentar;if(O.append(l("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},m.mensagem)),k){let F=l("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},$("atualizar",14),l("span",{},"Tentar de novo"));F.addEventListener("pointerdown",x=>x.preventDefault()),F.addEventListener("click",k),O.append(F)}}else{L.replaceChildren(...p.map(M));let k=s.trim();p.length||O.append(l("p",{class:"spro-combo-nada"},k?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let F=p.length?o.resumo?.(p.length,u,r().length):void 0;F&&O.append(l("p",{class:"spro-combo-resumo",role:"status"},F)),p.length<u&&O.append(l("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${p.length} de ${u}. Digite para refinar.`))}let N=s.trim(),X=r().some(k=>bo(k.rotulo)===bo(N));if(o.criar&&N&&!X&&m.tipo==="pronto"){let k=l("button",{type:"button",class:"spro-combo-criar"},$("mais",14),l("span",{},o.rotuloCriar?o.rotuloCriar(N):`Criar \u201C${N}\u201D`));k.addEventListener("pointerdown",F=>F.preventDefault()),k.addEventListener("click",()=>void w()),O.append(k)}let U=i.querySelector(".spro-combo-rodape");if(U){let k=p.filter(D=>!n.includes(D.valor)),F=l("button",{type:"button",class:"spro-combo-acao",disabled:!N||!k.length},`Marcar os filtrados${N&&k.length?` (${k.length})`:""}`);F.addEventListener("click",()=>{n=[...n,...k.map(D=>D.valor)],h(),g(),E()});let x=l("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");x.addEventListener("click",()=>{n=[],h(),g(),E()}),U.replaceChildren(l("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),F,x)}P()}let I=()=>d?.posicionar();function z(A){let L=p.length,O=A.target,N=i?[...i.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],X=!!O?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(A.key==="Tab"){let k=N.indexOf(O);if(!A.shiftKey&&k<N.length-1)N[k+1]?.focus();else if(A.shiftKey&&k>=0)k>0?N[k-1]?.focus():(i?.querySelector(".spro-combo-busca")??i?.querySelector('[role="listbox"]'))?.focus();else{B(!0);return}A.preventDefault(),A.stopPropagation();return}if(X&&A.key!=="Escape")return;let U=!i?.querySelector(".spro-combo-busca");if(U&&A.key===" "){let k=p[c];k&&b(k),A.preventDefault(),A.stopPropagation();return}if(U&&A.key.length===1&&!A.ctrlKey&&!A.metaKey&&!A.altKey){let k=bo(A.key),x=[...p.keys()].map(D=>(c+1+D)%Math.max(1,L)).find(D=>bo(p[D]?.rotulo??"").startsWith(k));x!==void 0&&(c=x,P()),A.preventDefault(),A.stopPropagation();return}switch(A.key){case"ArrowDown":c=L?(c+1)%L:0,P();break;case"ArrowUp":c=L?(c-1+L)%L:0,P();break;case"Home":if(A.target?.classList?.contains("spro-combo-busca")&&s)return;c=0,P();break;case"End":if(A.target?.classList?.contains("spro-combo-busca")&&s)return;c=Math.max(0,L-1),P();break;case"Enter":{let k=p[c];k?b(k):w();break}case"Escape":B(!0);break;case"Backspace":if(!o.multiplo||s||!n.length)return;n=n.slice(0,-1),h(),g(),E();break;default:return}A.preventDefault(),A.stopPropagation()}function G(A=""){if(i)return;s=A,c=A?0:(()=>{let X=Xa(r(),s).findIndex(U=>U.valor===n[n.length-1]);return X<0?0:X})();let O=y()?l("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:A}):null;if(O&&(O.value=A,O.addEventListener("input",()=>{s=O.value,c=0,E(),I()})),i=l("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},O?l("div",{class:"spro-combo-cabeca"},$("busca",15),O):null,l("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:O?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),l("div",{class:"spro-combo-extras"}),o.multiplo?l("div",{class:"spro-combo-rodape"}):null),i.addEventListener("keydown",z),d=hr(v,i,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>B(!1)}),v.setAttribute("aria-expanded","true"),v.setAttribute("aria-controls",`${e}-lista`),v.classList.add("spro-combo-aberto"),E(),I(),!i)return;(O??i.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),O&&A&&O.setSelectionRange?.(A.length,A.length)}function B(A=!1){i&&(d?.fechar(),d=null,i=null,s="",v.setAttribute("aria-expanded","false"),v.removeAttribute("aria-controls"),v.classList.remove("spro-combo-aberto"),A&&v.focus?.({preventScroll:!0}))}return v.addEventListener("click",()=>i?B(!0):G()),v.addEventListener("keydown",A=>{i||(A.key==="ArrowDown"||A.key==="ArrowUp"?(A.preventDefault(),G()):A.key.length===1&&A.key!==" "&&!A.ctrlKey&&!A.metaKey&&!A.altKey&&y()&&(A.preventDefault(),G(A.key)))}),g(),{el:v,valor:()=>[...n],definir(A,L=!1){n=[...A],g(),E(),L&&h()},atualizar(){g(),E()},definirVazio(A){f=A,g()},definirEstado(A){m=A,g(),E(),I()},abrir:G,fechar:()=>B(!1)}}function Za(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var Qa="spro-processo-estilo",gt="";function on(o){gt=o}function To(o){if(!gt||o.getElementById(Qa))return;let e=o.createElement("style");e.id=Qa,e.textContent=gt,(o.head??o.documentElement).append(e)}function Do(o){let e=Za(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function fe(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function J(o,e){To(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});Do(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},$("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},$(e.icone,18)),l("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select, button[role=combobox])")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let d of p)d.disabled=!0;r.setAttribute("aria-busy","true");try{let d=await c();return t=!1,r.close(),d&&Q(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){t=!1,a.disabled=!1;for(let f of p)f.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(Ao(d)),!1}}}}function br(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function Eo(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function co(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function mo(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function Bo(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function qo(o){let e=o.opcoes??[],r=typeof o.valor=="string"?o.valor:"",t=()=>r||e.some(p=>p.valor==="")?[r]:[],a=Ja({rotulo:o.rotulo,opcoes:()=>e,valor:t(),vazio:o.carregar&&!o.adiar?"Carregando\u2026":o.vazio,busca:o.busca??!0,...o.limite!==void 0?{limite:o.limite}:{},...o.resumo?{resumo:o.resumo}:{},...o.dicaBusca?{dicaBusca:o.dicaBusca}:{},classe:"spro-p-combo",larguraLista:260,aoMudar:p=>{r=p[0]??"",o.aoMudar?.(r)}}),n=o.carregar,i=null,s=()=>(i||(i=c()),i);async function c(){if(n){a.definirVazio("Carregando\u2026"),a.definirEstado({tipo:"carregando"});try{e=await n(),typeof o.valor=="function"&&(r=o.valor(e)??r),a.definir(t()),a.definirVazio(o.vazio),a.definirEstado({tipo:"pronto"})}catch(p){a.definirVazio("N\xE3o foi poss\xEDvel carregar"),a.definirEstado({tipo:"erro",mensagem:Ao(p),tentar:()=>void c()})}}}return{el:a.el,combo:a,valor:()=>r,definir(p){r=p,a.definir(t())},opcoes:()=>e,pronto:o.adiar?Promise.resolve():s(),carregarAgora:s}}function ge(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),i=l("button",{type:"button",class:"spro-botao"},"Cancelar"),s=J(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),co(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}var yo={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},Wc=120*1e3;function wo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Go=(o,e)=>o.startsWith(wo(e));function xr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function rn(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function oe(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function Kc(o){let e=[];return o.forEach((r,t)=>{let a=rn(r.dataISO||xr(r.data));a&&e.push({a:r,t:a,i:t,d:wo(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function tn(o,e){return wo(o)===wo(e)}function an(o,e,r){return tn(o.unidade,e)?!o.unidadeNome||!r||wo(o.unidadeNome)===wo(r):!1}function qe(o,e,r){let t=o.filter(i=>tn(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?wo(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(i=>an(i,e,r));return n.length?n:t}function Xc(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,i)=>n.recebido.getTime()<r(i)&&i.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(wo(n.unidade),[...a.get(wo(n.unidade))??[],n]);for(let[n,i]of a){let s=i.some(c=>i.some(p=>c.unidadeNome&&p.unidadeNome&&wo(c.unidadeNome)!==wo(p.unidadeNome)&&t(c,p)));for(let c of i)c.chave=s&&c.unidadeNome?`${n}|${wo(c.unidadeNome)}`:n}}function en(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${yo.remetidoPrefixo}`,"i"),"")).trim()}function Yc(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function nn(o,e){let r=Kc(o),t=[],a=[],n=[],i=[],s=(u,v)=>qe(a,u,v)[0],c=(u,v)=>{let h=qe(n,u,v)[0];return h?n.indexOf(h):-1},p=(u,v)=>{let{a:h}=u;if(a.some(b=>an(b,h.unidade,h.unidadeNome)))return;let g={unidade:h.unidade,...h.unidadeNome?{unidadeNome:h.unidadeNome}:{},chave:"",recebido:u.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:v,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:h.usuario,...h.usuarioNome?{usuarioRecebeuNome:h.usuarioNome}:{}},y=c(h.unidade,h.unidadeNome);if(y>=0){let[b]=n.splice(y,1);g.chegouEm=b.em,g.origem=b.origem}a.push(g),t.push(g)},d=(u,v,h)=>{u.remetido=v.t,u.fim=h,u.usuarioEnviou=v.a.usuario,v.a.usuarioNome&&(u.usuarioEnviouNome=v.a.usuarioNome),a.splice(a.indexOf(u),1)},f=u=>{let{a:v}=u;if(s(v.unidade,v.unidadeNome))return;let h=c(v.unidade,v.unidadeNome),g={em:u.t,unidade:v.unidade,...v.unidadeNome?{unidadeNome:v.unidadeNome}:{},origem:en(v),usuario:v.usuario,...v.usuarioNome?{usuarioNome:v.usuarioNome}:{}};h>=0?n[h]=g:n.push(g)};for(let u=0;u<r.length;){let v=u+1;for(;v<r.length&&r[v].t.getTime()===r[u].t.getTime();)v+=1;let h=r.slice(u,v);u=v;for(let g of h)Go(g.d,yo.remetidoPrefixo)&&f(g);for(let g of h)Go(g.d,yo.recebido)&&p(g,"recebido");for(let g of h){let{a:y,d:b}=g;if(yo.gerado.some(w=>Go(b,w)))p(g,"gerado");else if(Go(b,yo.reabertura))p(g,"reabertura");else if(Go(b,yo.conclusao)){let w=s(y.unidade,y.unidadeNome);w&&d(w,g,"conclusao")}else if(Go(b,yo.remetidoPrefixo)){let w=en(y),M=y.unidadeCitadaNome,P=s(w,M);if(P)d(P,g,"remessa"),P.destinos.push(y.unidade);else{let E=qe(t,w,M).at(-1);E?.fim==="remessa"&&E.remetido&&g.t.getTime()-E.remetido.getTime()<=Wc&&!E.destinos.includes(y.unidade)&&E.destinos.push(y.unidade)}}else Go(b,yo.documentoGerado)?i.push({ev:g,assinado:!1}):Go(b,yo.documentoAssinado)&&i.push({ev:g,assinado:!0})}}for(let u of n)t.push({unidade:u.unidade,...u.unidadeNome?{unidadeNome:u.unidadeNome}:{},chave:"",recebido:u.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:u.em,origem:u.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:u.usuario,...u.usuarioNome?{usuarioEnviouNome:u.usuarioNome}:{}});for(let{ev:u,assinado:v}of i){let{a:h}=u,g=qe(t.filter(w=>!w.pendenteRecebimento&&w.recebido.getTime()<=u.t.getTime()),h.unidade,h.unidadeNome),y=[...g].reverse().find(w=>w.remetido===null||u.t.getTime()<=w.remetido.getTime())??g[g.length-1];if(!y)continue;let b={...h.nrSei?{nrSei:h.nrSei}:{},...h.idDocumento?{idDocumento:h.idDocumento}:{},em:u.t,titulo:Yc(h),...h.usuario?{usuario:h.usuario}:{}};(v?y.assinaturas:y.documentos).push(b)}t.sort((u,v)=>u.recebido.getTime()-v.recebido.getTime());for(let u of o){if(!u.aberto)continue;let v=qe(t.filter(h=>!h.pendenteRecebimento),u.unidade,u.unidadeNome).at(-1);v?.fim==="remessa"&&v.remetido&&(v.enviouEm=v.remetido,v.remetido=null,v.fim=null,v.mantidoAberto=!0)}let m=oe(e).getTime();for(let u of t)u.emCurso=u.remetido===null,u.duracaoMs=Math.max(0,(u.remetido?.getTime()??m)-u.recebido.getTime());return Xc(t,m),t.sort((u,v)=>u.recebido.getTime()-v.recebido.getTime())}var Ar=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],Jc=3e4,Zc=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],Qc=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],ve=o=>String(o).padStart(2,"0"),ol=o=>Ar.find(e=>e.id===o)?.pxPorDia??2.2,Er=o=>`${ve(o.getUTCDate())}/${ve(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,lo=o=>`${Er(o)} ${ve(o.getUTCHours())}:${ve(o.getUTCMinutes())}`;function Io(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var yr=o=>Math.round(Math.max(0,o)/864e5*10)/10,Wo=o=>String(o).replace(".",","),He=o=>o.recebido.getTime()+o.duracaoMs,jo=(o,e)=>e&&o?`${e} (${o})`:e??o??"",vt=(o,e)=>e>1?`${o} ${e}x`:o;function cn(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=vt(a.sigla,a.passagens.length);return t}var sn=o=>Math.floor(o/864e5)*864e5;function Pr(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let d of o)t=Math.min(t,d.recebido.getTime()),a=Math.max(a,He(d),...d.documentos.map(f=>f.em.getTime()));if(!Number.isFinite(t)){let d=r.agora?.getTime()??0;t=d,a=d}r.agora&&o.some(d=>d.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=sn(t),i=sn(a)+864e5,s=Math.max(1,(i-n)/864e5),c=r.pxPorDia??ol(e),p=Math.min(c,Jc/s);return{escala:e,pxPorDia:p,origem:n,fim:i,largura:s*p,x:d=>(d-n)/864e5*p}}function ln(o,e=1e3){for(let r of Ar)if(Pr(o,r.id).largura<=e)return r.id;return"mes"}function pn(o){let e=[],r=[],t=o.fim,a=(i,s,c,p)=>{let d=o.x(s);i.push({x:d,largura:Math.max(0,o.x(Math.min(c,t))-d),rotulo:p})},n=i=>new Date(i);if(o.escala==="mes")for(let i=n(o.origem).getUTCFullYear();Date.UTC(i,0,1)<t;i++)a(e,Math.max(Date.UTC(i,0,1),o.origem),Date.UTC(i+1,0,1),String(i));else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;){let p=Math.max(Date.UTC(s,c,1),o.origem);a(e,p,Date.UTC(s,c+1,1),`${Qc[c]} de ${s}`),c+=1,c>11&&(c=0,s+=1)}}if(o.escala==="dia")for(let i=o.origem;i<t;i+=864e5)a(r,i,i+864e5,String(n(i).getUTCDate()));else if(o.escala==="semana"){let s=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-s*864e5;c<t;c+=7*864e5){let p=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${ve(p.getUTCDate())}/${ve(p.getUTCMonth()+1)}`)}}else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;)a(r,Math.max(Date.UTC(s,c,1),o.origem),Date.UTC(s,c+1,1),Zc[c]),c+=1,c>11&&(c=0,s+=1)}return{cima:e,baixo:r}}function he(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var Dr={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function be(o){return o.titulo||o.nrSei||"Documento"}var el=8;function ht(o){let e=[],r=he(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${lo(o.recebido)}${o.usuarioEnviou?` por ${jo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${lo(o.recebido)}${o.usuarioRecebeu?` por ${jo(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${lo(o.enviouEm)}${o.usuarioEnviou?` por ${jo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${lo(o.remetido)}${o.usuarioEnviou?` por ${jo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${Io(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${be(n)} - ${lo(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,el);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:Dr[r],linhas:e,...t.length?{documentos:a}:{}}}function dn(o,e){return{titulo:be(o),linhas:[{rotulo:"Gerado em",valor:`${lo(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function un(o){let e=ht(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function wr(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:yr(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function Fe(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,He(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var Sr=o=>vt(o.unidade,o.passagens);function mn(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,rl(r,o,a)},ocultar(){r.hidden=!0}}}function rl(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,i=o.offsetHeight||120,s=a.left-t.left+a.width/2-n/2;s=Math.max(6,Math.min(s,t.width-n-6));let c=a.top-t.top-i-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(s)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function fn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var tl="http://www.w3.org/2000/svg",Lo=150,to=46,Ve=50,ee=8,Ue=20,al=38,re=6,gn=16,nl=0;function q(o,e={},...r){let t=document.createElementNS(tl,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var oo=o=>Math.round(o*10)/10,vn=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function Mr(o,e,r={}){let t=`spro-g${++nl}`,a=r.larguraAlvo!==void 0,n=cn(o),i=Pr(o,e,{...r.agora?{agora:r.agora}:{}}),s=a?Pr(o,e,{pxPorDia:(r.larguraAlvo-Lo-gn)/Math.max(1,(i.fim-i.origem)/864e5),...r.agora?{agora:r.agora}:{}}):i,c=Lo+s.largura+gn,p=to+Math.max(1,n.length)*Ve+8,d=q("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${oo(c)} ${p}`,width:a?"100%":oo(c),...a?{}:{height:p},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});d.append(q("defs",{},q("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},q("rect",{width:8,height:8,class:"listra-fundo"}),q("rect",{width:4,height:8,class:"listra-traco"})),q("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},q("rect",{width:6,height:6,class:"pontos-fundo"}),q("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let f=Lo,m=pn(s),u=q("g",{class:"spro-g-corpo"});n.forEach((b,w)=>{u.append(q("rect",{x:0,y:to+w*Ve,width:c,height:Ve,class:w%2?"raia-par":"raia-impar"}))});let v=q("g",{class:"spro-g-grade","aria-hidden":"true"});for(let b of m.baixo)v.append(q("line",{x1:oo(f+b.x),x2:oo(f+b.x),y1:to,y2:p,class:"grade"}));if(u.append(v),n.forEach((b,w)=>{let M=to+w*Ve,P=q("g",{class:"spro-g-raia","data-raia":b.chave});for(let E of b.passagens){let I=he(E),z=f+s.x(E.recebido.getTime()),G=Math.max(4,s.x(He(E))-s.x(E.recebido.getTime())),B=q("g",{class:`spro-g-barra ${I}`,"data-situacao":I,...a?{}:{tabindex:0,role:"img"},"aria-label":un(E)});if(B.append(q("rect",{x:oo(z),y:M+ee,width:oo(G),height:Ue,rx:4,class:"fundo"})),I==="em-curso")B.append(q("rect",{x:oo(z),y:M+ee,width:oo(G),height:Ue,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(I==="pendente")B.append(q("rect",{x:oo(z),y:M+ee,width:oo(G),height:Ue,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(I==="mantido-aberto"&&E.enviouEm){let A=f+s.x(E.enviouEm.getTime());B.append(q("rect",{x:oo(A),y:M+ee,width:oo(Math.max(2,z+G-A)),height:Ue,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),B.append(q("line",{x1:oo(A),x2:oo(A),y1:M+ee-3,y2:M+ee+Ue+3,class:"marca-remessa"}))}if(G>=44&&B.append(q("text",{x:oo(z+6),y:M+ee+14,class:"texto-barra"},Io(E.duracaoMs))),!a&&r.dica){let A=r.dica,L=ht(E);B.addEventListener("pointerenter",()=>A.mostrar(L,B)),B.addEventListener("pointerleave",()=>A.ocultar()),B.addEventListener("focus",()=>A.mostrar(L,B)),B.addEventListener("blur",()=>A.ocultar())}P.append(B);for(let A of E.documentos){let L=f+s.x(A.em.getTime()),O=q("path",{d:`M${oo(L)} ${M+al-re}l${re} ${re}l-${re} ${re}l-${re} -${re}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${be(A)}, ${lo(A.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let N=r.dica,X=dn(A,E);N&&(O.addEventListener("pointerenter",()=>N.mostrar(X,O)),O.addEventListener("pointerleave",()=>N.ocultar()),O.addEventListener("focus",()=>N.mostrar(X,O)),O.addEventListener("blur",()=>N.ocultar()));let U=()=>r.aoAbrirDocumento?.(A,E);O.addEventListener("click",U),O.addEventListener("keydown",k=>{let F=k.key;(F==="Enter"||F===" ")&&(k.preventDefault(),U())})}P.append(O)}}u.append(P)}),d.append(u),r.agora&&o.some(b=>b.emCurso)&&r.agora.getTime()>=s.origem&&r.agora.getTime()<=s.fim){let b=oo(f+s.x(r.agora.getTime()));d.append(q("g",{class:"spro-g-agora","aria-hidden":"true"},q("line",{x1:b,x2:b,y1:to,y2:p}),q("text",{x:Math.min(b+4,c-40),y:to+11},"Agora")))}let h=q("g",{class:"spro-g-cabecalho","aria-hidden":"true"});h.append(q("rect",{x:0,y:0,width:c,height:to,class:"cabecalho-fundo"}));for(let b of m.cima)h.append(q("line",{x1:oo(f+b.x),x2:oo(f+b.x),y1:0,y2:to,class:"grade-forte"})),b.largura>36&&h.append(q("text",{x:oo(f+b.x+6),y:15,class:"eixo-cima"},b.rotulo));for(let b of m.baixo)b.largura>=14&&h.append(q("text",{x:oo(f+b.x+b.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},b.rotulo));h.append(q("line",{x1:0,x2:c,y1:to,y2:to,class:"grade-forte"})),d.append(h);let g=q("g",{class:"spro-g-rotulos"});g.append(q("rect",{x:0,y:to,width:Lo,height:p-to,class:"rotulos-fundo"})),n.forEach((b,w)=>{let M=to+w*Ve,P=q("text",{x:10,y:M+22,class:"rotulo-raia"},vn(b.rotulo,20)),E=b.nome&&b.nome!==b.sigla?b.nome:"",I=q("g",{"aria-label":`${b.sigla}${E?`, ${E}`:""}: ${b.passagens.length} passagem(ns)`,role:"img"},P);E&&I.append(q("text",{x:10,y:M+37,class:"rotulo-nome"},vn(E,24))),g.append(I)}),g.append(q("line",{x1:Lo,x2:Lo,y1:to,y2:p,class:"grade-forte"})),d.append(g);let y=q("g",{class:"spro-g-canto","aria-hidden":"true"},q("rect",{x:0,y:0,width:Lo,height:to,class:"cabecalho-fundo"}),q("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),q("line",{x1:Lo,x2:Lo,y1:0,y2:to,class:"grade-forte"}),q("line",{x1:0,x2:Lo,y1:to,y2:to,class:"grade-forte"}));return d.append(y),n.length===0&&d.append(q("text",{x:f+12,y:to+28,class:"rotulo-nome"},"Sem passagens.")),d}function hn(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let i=e.scrollLeft,s=e.scrollTop;r?.setAttribute("transform",`translate(0 ${s})`),t?.setAttribute("transform",`translate(${i} 0)`),a?.setAttribute("transform",`translate(${i} ${s})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var il=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function xn(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...il]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",Dr[he(t)],lo(t.recebido),a?lo(a):"",Wo(Math.round(t.duracaoMs/864e5*100)/100),Io(t.duracaoMs),t.pendenteRecebimento?"":jo(t.usuarioRecebeu,t.usuarioRecebeuNome),jo(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${be(n)} (${Er(n.em)})`).join(" | ")])}return fn(r)}function An(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function En(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),i=o.createElement("a");return i.href=n,i.download=e,i.style.display="none",o.body.append(i),i.click(),i.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var sl="spro-g-impressao";function cl(o,e="mes"){let r=Fe(o.passagens),t=wr(o.passagens),a=[...o.passagens].sort((c,p)=>c.recebido.getTime()-p.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},Dr[he(c)]),l("td",{},lo(c.recebido)),l("td",{},c.remetido??c.enviouEm?lo(c.remetido??c.enviouEm):""),l("td",{},Io(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),i=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},Sr(c)),l("td",{},Wo(c.dias)),l("td",{},`${Wo(c.percentual)}%`),l("td",{},String(c.passagens)))))),s=Mr(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:sl,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${Io(r.corridoMs)} (${Wo(yr(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${lo(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},s),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),i)}function yn(o,e,r="mes"){let t=o.defaultView??window,a=cl(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var Cr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${Io(o)}`,Pn=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:nn(o,r)}),pl=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Dn(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,i=!1,s=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,p=l("div",{class:"spro-g-visao"}),d=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function f(x){if(i||e.sigiloso)return;let D=d();n?.abort();let _=new AbortController;n=_,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...D?{anterior:D}:{}},U();try{let V=await me(e,{sinal:_.signal,forcar:x,aoProgresso:(H,W)=>{i||n!==_||r.tipo!=="coletando"||(r={...r,feito:H,total:W},G())}});if(i||n!==_)return;r={tipo:"pronto",dados:Pn(V.andamentos,V.coletadoEm,e.agora())}}catch(V){if(i||n!==_)return;V instanceof ze?r={tipo:"sigiloso"}:pl(V)||_.signal.aborted?r={tipo:"cancelado",...D?{anterior:D}:{}}:r={tipo:"erro",mensagem:Ao(V),...D?{anterior:D}:{}}}finally{n===_&&(n=null)}U()}function m(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},U(),n.abort())}let u=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),v=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),h=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},u,v),g=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),y=l("div",{class:"spro-g-progresso"}),b=l("div",{class:"spro-g-aviso",role:"status"}),w=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),M=l("button",{type:"button",class:"spro-botao"},$("atualizar",15),"Atualizar"),P=l("button",{type:"button",class:"spro-botao"},$("planilha",15),"Exportar CSV"),E=l("button",{type:"button",class:"spro-botao"},$("imprimir",15),"Imprimir"),I=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),M,P,E);p.append(l("div",{class:"spro-g-topo"},h,g),y,b,w,I);let z=(x,D=!1)=>{t=x,U(),D&&(x==="gantt"?u:v).focus()};u.addEventListener("click",()=>z("gantt")),v.addEventListener("click",()=>z("tempo")),h.addEventListener("keydown",x=>{let D=x.key;(D==="ArrowRight"||D==="ArrowLeft"||D==="Home"||D==="End")&&(x.preventDefault(),z(D==="Home"?"gantt":D==="End"||t==="gantt"?"tempo":"gantt",!0))}),M.addEventListener("click",()=>void f(!0)),P.addEventListener("click",()=>{let x=d();x?.passagens.length&&(En(e.topo,An(e.protocolo),xn(x.passagens)),Q(e,"CSV do hist\xF3rico gerado.",2500))}),E.addEventListener("click",()=>{let x=d();x?.passagens.length&&yn(e.topo,{protocolo:e.protocolo,passagens:x.passagens,agora:oe(e.agora()),coletadoEm:oe(new Date(x.coletadoEm))})});function G(){if(r.tipo!=="coletando")return;let{feito:x,total:D,cancelando:_}=r,V=_?"Cancelando a coleta\u2026":D>0?`Coletando o hist\xF3rico: p\xE1gina ${x} de ${D}`:"Coletando o hist\xF3rico\u2026",H=y.querySelector(".spro-g-prog-barra"),W=y.querySelector(".spro-g-prog-texto");if(W&&(W.textContent=V),H){let ro=D>0?Math.round(x/D*100):0;H.setAttribute("aria-valuenow",String(ro));let No=H.firstElementChild;No&&(No.style.width=D>0?`${ro}%`:""),H.classList.toggle("indeterminado",D<=0)}}function B(){if(r.tipo!=="coletando"){y.hidden=!0,y.replaceChildren();return}y.hidden=!1;let x=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},$("cancelar",14),"Cancelar coleta");x.addEventListener("click",m),y.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),x),G()}function A(){let x=r,D=(H,W)=>{let ro=l("button",{type:"button",class:"spro-botao pequeno"},H);return ro.addEventListener("click",W),ro};b.className="spro-g-aviso",b.replaceChildren(),b.hidden=!0;let _=(H,W,...ro)=>{b.hidden=!1,b.className=`spro-g-aviso ${H}`,b.replaceChildren($("alerta",15),l("span",{class:"spro-g-aviso-texto"},W),...ro)},V=e.agora().getTime();x.tipo==="sigiloso"?_("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):x.tipo==="erro"?_("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${x.mensagem}`,D("Tentar de novo",()=>void f(!1))):x.tipo==="cancelado"?_("cancelado","Coleta cancelada.",D("Coletar de novo",()=>void f(!1))):x.tipo==="coletando"&&x.anterior&&!x.cancelando?_("desatualizado",`Mostrando o hist\xF3rico coletado ${Cr(V-x.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):x.tipo==="pronto"&&V-x.dados.coletadoEm>=18e5&&_("desatualizado",`Este hist\xF3rico foi coletado ${Cr(V-x.dados.coletadoEm)}.`,D("Atualizar agora",()=>void f(!0))),(x.tipo==="erro"||x.tipo==="cancelado")&&x.anterior&&_(x.tipo==="erro"?"erro":"cancelado",`${x.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${x.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${Cr(V-x.anterior.coletadoEm)} (desatualizado).`,D("Tentar de novo",()=>void f(!1)))}function L(){s?.(),s=null,w.replaceChildren();let x=d();if(r.tipo==="sigiloso"){w.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!x){w.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!x.passagens.length){w.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}w.setAttribute("aria-labelledby",`${c}-aba-${t}`),w.append(t==="gantt"?O(x):N(x))}function O(x){let D=oe(e.agora());a??=ln(x.passagens,980);let _=a,V=l("div",{class:"spro-g-quadro"}),H=mn(V,`${c}-dica`),W=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),ro=Mr(x.passagens,_,{agora:D,dica:H,aoAbrirDocumento:(uo,Oo)=>o.abrirDocumento(uo,Oo)});W.append(ro),V.prepend(W),s=hn(ro,W),W.addEventListener("scroll",()=>H.ocultar());let No=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let uo of Ar){let Oo=l("button",{type:"button","aria-pressed":String(uo.id===_),"data-escala":uo.id},uo.rotulo);Oo.addEventListener("click",()=>{if(a===uo.id)return;let Jr=W.scrollWidth>0?W.scrollLeft/W.scrollWidth:0;a=uo.id,U();let Zo=w.querySelector(".spro-g-rolagem");Zo&&(Zo.scrollLeft=Jr*Zo.scrollWidth)}),No.append(Oo)}let Jo=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");Jo.addEventListener("click",()=>{W.scrollLeft=W.scrollWidth});let rr=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([uo,Oo])=>l("li",{},l("span",{class:`spro-g-amostra ${uo}`,"aria-hidden":"true"}),Oo)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},No,Jo,rr),V)}function N(x){let D=wr(x.passagens),_=Fe(x.passagens),V=Math.max(1,...D.map(H=>H.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${_.passagens} passagem(ns) por ${_.unidades} unidade(s). Tempo corrido do processo: ${Io(_.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...D.map(H=>{let W=l("span",{class:`spro-g-barra-pct${H.emCurso?" em-curso":""}`});return W.style.width=`${Math.max(1,Math.round(H.percentual/V*100))}%`,l("tr",{},l("th",{scope:"row"},Sr(H),H.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},Wo(H.dias)),l("td",{class:"num"},`${Wo(H.percentual)}%`),l("td",{class:"num"},String(H.passagens)),l("td",{class:"barra","aria-hidden":"true"},W))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function X(){let x=d(),D=r.tipo==="coletando",_=!x?.passagens.length;M.disabled=D||r.tipo==="sigiloso",P.disabled=_,E.disabled=_;let V=I.querySelector(".spro-g-frescor");V&&(V.textContent=x?`Coletado em ${lo(oe(new Date(x.coletadoEm)))} (${Cr(e.agora().getTime()-x.coletadoEm)})`:"")}function U(){u.setAttribute("aria-selected",String(t==="gantt")),v.setAttribute("aria-selected",String(t==="tempo")),u.setAttribute("tabindex",t==="gantt"?"0":"-1"),v.setAttribute("tabindex",t==="tempo"?"0":"-1");let x=d();g.textContent=x?.passagens.length?`${x.passagens.length} passagem(ns)`:"",B(),A(),L(),X()}U();let k=setInterval(()=>{i||X()},3e4);k.unref?.();let F=(async()=>{if(e.sigiloso)return;let x=await ue(e);i||(x&&!x.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:Pn(x.historico.andamentos,x.historico.coletadoEm,e.agora())},U()),await f(!1))})();return{el:p,estado:()=>r,destruir(){i=!0,clearInterval(k),n?.abort(),s?.()},pronta:F}}function dl(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function wn(o,e){let r=e.nrSei??e.titulo,t=dl(o,e);if(!t)return Q(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return Q(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return J(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var Sn="spro-g-dialogo";function Mn(o,e={}){let r=o.topo.querySelector(`dialog.${Sn}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=Dn({ctx:o,abrirDocumento:n=>void wn(o,n),...e}),a=J(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(Sn),{...t,fechar:a.fechar}}function Cn(o,e){let r=()=>{e().then(t=>{if(!t){Q({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}Mn(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(dr,r),()=>o.removeEventListener(dr,r)}async function bt(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var On=0,Tn=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Be=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return pt(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Tn(e)?e:null}catch{return null}}async gravar(e){if(!dt(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return On+=1,await bl(this.area,On%25===0),!0}};async function bl(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(vr)).length<=200)return 0;let r=await bt(o,vr),t=Object.entries(r).filter(([,i])=>Tn(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var Ln=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),Ge=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return mt(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Ln(e)?e:null}catch{return null}}async gravar(e){if(!dt(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await xl(this.area,this.agora()),!0}};async function xl(o,e){try{let r=await bt(o,ut),t=Object.entries(r).filter(([,n])=>Ln(n)).map(([n,i])=>({k:n,em:i.coletadoEm})).sort((n,i)=>i.em-n.em),a=new Set;t.forEach((n,i)=>{(i>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(i=>i.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var yl=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",xe=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new Be(e,r,t),this.repoHistorico=new Ge(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}renotificar(e){for(let r of[...this.ouvintes])try{r(e)}catch{}}definir(e,r){if(this.fatias.set(e,r),this.renotificar(e),r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:yl(i),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var xt=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],Pl={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},Dl=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function kn(o){let e=new Set(o?.length?o:Dl),r=new Set(["descricao"]);for(let[t,a]of Object.entries(Pl))e.has(a)&&r.add(t);return r}var Nn=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),At={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};var wl={nota:["M3.5 2h17A1.5 1.5 0 0 1 22 3.5V14l-8 8H3.5A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2z","M22 13.4H13.4V22H14l8-8z","M21 15h-6v6z"],usuarioGravata:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2L12 17.6z","M11 13.3h2l.7 1.7-1.3 6.2-.4.4-.4-.4-1.3-6.2z"],etiquetas:["M2 3.7C2 2.8 2.8 2 3.7 2h6.1c.5 0 .9.2 1.3.5l9.4 9.4c.7.7.7 1.8 0 2.5l-5.6 5.6c-.7.7-1.8.7-2.5 0L2.5 10.6C2.2 10.2 2 9.8 2 9.3z","M7.1 5.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z","M13.6 2h2.2c.5 0 .9.2 1.3.5l5.1 5.1c.7.7.7 1.8 0 2.5l-5.3 5.3-1.6-1.6 4.7-4.7c.3-.3.3-.8 0-1.1z"],tag:["M3 4.5A1.5 1.5 0 0 1 4.5 3h6.6c.4 0 .8.2 1.1.4l8.4 8.4c.6.6.6 1.5 0 2.1l-6.6 6.6c-.6.6-1.5.6-2.1 0L3.4 12.1c-.3-.3-.4-.7-.4-1.1z","M7.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"],olho:["M12 4.2C6.6 4.2 2.4 8 .9 12c1.5 4 5.7 7.8 11.1 7.8s9.6-3.8 11.1-7.8C21.6 8 17.4 4.2 12 4.2z","M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z","M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z"],livro:["M6 2h13.5c.8 0 1.5.7 1.5 1.5V17c0 .6-.3 1.1-.8 1.3v2.4c.5.2.8.7.8 1.3 0 .8-.7 1.5-1.5 1.5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z","M8 5.8h9v2.6H8z","M6 18.3h12.7V20.6H6A1.15 1.15 0 0 1 6 18.3z"],favorito:["M5.5 2h13c.8 0 1.5.7 1.5 1.5V22.3l-8-5.6-8 5.6V3.5C4 2.7 4.7 2 5.5 2z"],usuarios:["M9 3.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z","M2 20.4c0-3.8 2.8-6.4 7-6.4s7 2.6 7 6.4v.2c0 .8-.6 1.4-1.4 1.4H3.4C2.6 22 2 21.4 2 20.6z","M17.2 4.6a3.3 3.3 0 1 1 0 6.6c-.4 0-.8-.1-1.2-.2a5.6 5.6 0 0 0 0-5.6c.4-.5.7-.8 1.2-.8z","M17.6 13.2c2.4.5 4.4 2.4 4.4 5.4v2c0 .8-.6 1.4-1.4 1.4h-2.7c.3-.4.5-.9.5-1.4v-.2c0-2.4-.8-4.4-2.1-5.8.4-.5.8-1 1.3-1.4z"],balaoPontos:["M12 2.4c-5.8 0-10.5 3.8-10.5 8.6 0 2.2 1 4.2 2.8 5.7-.2 1.5-.8 2.8-1.7 3.9-.3.3 0 .8.4.8 2.2 0 4.1-.9 5.4-1.8.9.2 1.7.3 2.6.3 5.8 0 10.5-3.9 10.5-8.9S17.8 2.4 12 2.4z","M7.4 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M12 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M16.6 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"],balao:["M4 2.5h16A2.5 2.5 0 0 1 22.5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-6.2l-5.1 4v-4H4a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 4 2.5z"],caixa:["M5.4 3h13.2c.6 0 1.2.4 1.4 1l2 7.2V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7.8l2-7.2c.2-.6.8-1 1.4-1z","M5.4 6.2 4.2 11.2H8.8l1 2.6h4.4l1-2.6h4.6L18.6 6.2z"],globo:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M7.6 4.8 11 4.2l1.3 2.4-1.8 1.9.5 2.4-3 1-2.4-1.4-.1-2.9z","M12.8 13.6l2.8-.7 2.6 2.2-1 4-2.6 2.8-1.4-1.4.7-3.7z"],cadeado:["M5 10h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 22H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 10z","M7.5 10V7a4.5 4.5 0 0 1 9 0v3h-2.4V7a2.1 2.1 0 0 0-4.2 0v3z","M12 13.7a1.7 1.7 0 0 1 .8 3.2l.4 2.6h-2.4l.4-2.6a1.7 1.7 0 0 1 .8-3.2z"],semUsuario:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2-1.2 1.2-2.8 1.8-4.6 1.8s-3.4-.6-4.6-1.8z","M2.6 4.4 4 3l17.5 17.5-1.4 1.4z"],lapis:["M3 17.3V21h3.7L18.6 9.1l-3.7-3.7z","M21.5 6.2a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"],lixeira:["M6 21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6z","M19 4h-3.5l-1-1h-5l-1 1H5v2h14z"],mais:["M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"],alerta:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M10.6 6.5h2.8v7.3h-2.8z","M10.6 15.6h2.8v2.8h-2.8z"],chevron:["M3.5 8.2 5.4 6.3 12 12.9l6.6-6.6 1.9 1.9L12 16.7z"],disquete:["M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z","M12 12.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z","M5.5 5h8v4h-8z"],checkQuadro:["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M10.4 16.9 6.2 12.7l1.4-1.4 2.8 2.8 6-6 1.4 1.4z"],calendarioMais:["M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2z","M11 10.5h2v2.5h2.5v2H13v2.5h-2V15H8.5v-2H11z"],fechar:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M8.2 9.6 9.6 8.2 12 10.6l2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4z"],lupa:["M10.5 2a8.5 8.5 0 0 1 6.7 13.7l5.4 5.4-2.1 2.1-5.4-5.4A8.5 8.5 0 1 1 10.5 2z","M10.5 5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"],cima:["M12 3.5 4.5 11h5v9.5h5V11h5z"],baixo:["M12 20.5 4.5 13h5V3.5h5V13h5z"]};function fo(o,e=16,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"currentColor",stroke:"none","aria-hidden":"true",focusable:"false",class:"spro-glifo spro-icone"};for(let[s,c]of Object.entries(n))a.setAttribute(s,c);let i=r.createElementNS(t,"path");return i.setAttribute("d",wl[o].join("")),i.setAttribute("fill-rule","evenodd"),a.append(i),a}function Ae(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},fo(o.icone,16))}function Sl(o,e){let r=o.ownerDocument,t=e.map(a=>typeof a=="string"?r.createTextNode(a):a);for(t.forEach((a,n)=>{let i=o.childNodes[n];i!==a&&(i&&i.nodeType===3&&a.nodeType===3&&i.textContent===a.textContent||o.insertBefore(a,i??null))});o.childNodes.length>t.length;)o.lastChild?.remove()}function _n(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=fo("chevron",16),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("span",{class:"spro-p-icone","aria-hidden":"true"},fo(o.icone,16)),i=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("div",{class:"spro-p-titulo"},n,l("h3",{},o.titulo)),e,a),r),s=p=>{i.toggleAttribute("data-recolhido",!p),a.setAttribute("aria-expanded",String(p)),r.hidden=!p};s(o.aberto),a.addEventListener("click",()=>{let p=i.hasAttribute("data-recolhido");s(p),o.aoAlternar(p)});let c=o.icone;return{el:i,definirAberto:s,atualizar(p,d){i.setAttribute("data-estado",p),d.icone&&d.icone!==c&&(c=d.icone,n.replaceChildren(fo(d.icone,16))),e.replaceChildren(...(d.acoes??[]).map(Ae)),Sl(r,d.corpo.filter(f=>f!=null&&f!==!1))}}}var Ml="configViewFlashPanelArvorePro",Et="optionsPro";function yt(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function $n(o){let e=yt(o,Ml);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function Ee(o){let e=yt(o,Et);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function zn(o){return Ee(o).optionsFlashMenu_panelinfo!=="disabled"}function qn(o,e){return Ee(o)[`panelDadosArvorePro_${e}`]!=="hide"}function Hn(o,e,r){try{let t=Ee(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Et,JSON.stringify(t))}catch{}}function Ir(o,e){let r=yt(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function je(o,e){return Ee(o)[`optionsFlashMenu_${e}`]!=="disabled"}var Rn=o=>o===!0||o==="true";function Fn(o){let e=Ee(o);return{tramitadoNaUnidade:Rn(e.panelDadosArvoreInteressados_tramiteUnidade),mesmaNatureza:Rn(e.panelDadosArvoreInteressados_mesmaNatureza)}}function Vn(o,e){try{let r=Ee(o);r.panelDadosArvoreInteressados_tramiteUnidade=e.tramitadoNaUnidade,r.panelDadosArvoreInteressados_mesmaNatureza=e.mesmaNatureza,o.setItem(Et,JSON.stringify(r))}catch{}}var Cl=/[\u0300-\u036f]/g,Gn=o=>o.normalize("NFD").replace(Cl,"");var We=o=>String(o).padStart(2,"0"),Or=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Un=/(\d{1,2}):(\d{2})/;function Ke(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=Gn(e),t=r.length===e.length?r:e,a=Or.exec(t);if(!a)return{prazo:null,texto:e};let n=Un.exec(t.slice(a.index+a[0].length))??Un.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${We(Number(a[2]))}-${We(Number(a[1]))}`,c=n?`${We(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:d}}function jn(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var Il=864e5;function ye(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(s.getFullYear(),s.getMonth(),s.getDate()),d=Math.round((p.getTime()-c.getTime())/Il);return d===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Tr(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function Wn(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var te=500,Kn=/^\s*\[( |x|X)\]\s?/;function Lr(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=Kn.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function Xn(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Yn(o,e){let r=Lr(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",Xn(r))}function Jn(o,e,r){let t=Lr(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return Xn(t)}function kr(o,e){let r=0,t=Math.min(Math.max(e,0),o.length);for(let a=0;a<t;a++)o[a]===`
`&&(r+=1);return r}function Pe(o,e){let r=0;for(let t=0;t<o.length;t++){if(r===e)return t;o[t]===`
`&&(r+=1)}return o.length}function Zn(o,e,r,t){let a=o.replace(/\r\n?/g,`
`).split(`
`);if(e<0||r>=a.length||e>r||(t===-1?e===0:r===a.length-1))return null;let n=a.slice(e,r+1);if(t===-1){let s=a[e-1];return a.splice(e-1,n.length+1,...n,s),{texto:a.join(`
`),de:e-1,ate:r-1}}let i=a[r+1];return a.splice(e,n.length+1,i,...n),{texto:a.join(`
`),de:e+1,ate:r+1}}function Qn(o,e){let r=Pe(o,kr(o,e)),t=o.indexOf(`
`,r),a=t===-1?o.length:t,n=o.slice(r,a),i=Kn.exec(n);if(!i||e<r+i[0].length)return null;if(n.slice(i[0].length).trim()===""&&e>=a)return{texto:`${o.slice(0,r)}${o.slice(a)}`,pos:r};let c=o.slice(0,e),p=o.slice(e);return{texto:`${c}
[ ] ${p.replace(/^[ \t]+/,"")}`,pos:c.length+5}}function Ol(o){let e=Or.exec(Gn(o));return e?`${We(Number(e[1]))}/${We(Number(e[2]))}/${e[3]}`:null}function oi(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return Or.test(o)?o.replace(Or,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function Xe(o){let e=Ol(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function So(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function ei(o,e){return So(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function Bn(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function ri(o,e,r){return[{unidade:e,observacao:Bn(o)},...r.map(a=>({unidade:a.unidade,observacao:Bn(a.observacao)}))].filter(a=>a.observacao)}function ti(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function ai(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function ni(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function ii(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function si(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function Tl(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function ci(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},$("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function ae(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function Ko(o){return l("div",{class:"spro-p-nota"},o)}function ko(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[ci(o.erro??"",e)]:[Tl(t)];let a=r(o.dado);return o.estado==="erro"?[...a,ci(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}var Ll={amarelo:"#fff200",amarelo_claro:"#dde134",amarelo_ouro:"#f7b431",azul:"#4285f4",azul_ceu:"#009df2",azul_marinho:"#002d9e",azul_riviera:"#205d8c",bege:"#f8d396",branco:"#ffffff",bronze:"#a56738",champagne:"#e0a076",ciano:"#00ffff",cinza:"#c0c0c0",cinza_escuro:"#527b79",laranja:"#ff5f00",lilas:"#c892d8",marrom:"#61280a",ouro:"#a7790b",prata:"#81979d",preto:"#000000",rosa:"#ff1cae",rosa_claro:"#ffa7dc",roxo:"#68339b",tijolo:"#c35107",verde:"#00ff00",verde_abacate:"#00a884",verde_agua:"#00c4ba",verde_amazonas:"#007725",verde_escuro:"#004225",verde_turquesa:"#00858a",vermelho:"#ff4545",vinho:"#633039"},li="#9aa3ac";function kl(o){let e=/marcador_([a-z_]+)\.(?:svg|png)/i.exec(o??"");return e?.[1]?e[1].toLowerCase():null}var pi=o=>{let e=o.length===4?`#${[...o.slice(1)].map(r=>r+r).join("")}`:o;return[1,3,5].map(r=>Number.parseInt(e.slice(r,r+2),16))};function Nl(o){let[e,r,t]=pi(o).map(a=>{let n=a/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4});return .2126*e+.7152*r+.0722*t}var _l=o=>`#${o.map(e=>Math.round(e).toString(16).padStart(2,"0")).join("")}`;function Rl(o,e){return _l(pi(o).map(r=>r+(255-r)*e))}function $l(o){let e=kl(o),r=e?Ll[e]:void 0;if(!r)return{nome:e,claro:li,escuro:li};if(e==="preto")return{nome:e,claro:r,escuro:"#d5d9de"};let t=r;for(let a=.2;Nl(t)<.17&&a<=.8;a+=.1)t=Rl(r,a);return{nome:e,claro:r,escuro:t}}function De(o,e=16,r=document){let t=$l(o),a=fo("tag",e,r);return a.setAttribute("class","spro-glifo spro-icone spro-tag"),a.setAttribute("style",`--spro-tag:${t.claro};--spro-tag-escuro:${t.escuro}`),t.nome&&a.setAttribute("data-cor",t.nome),a}function Pt(o){let[e="",...r]=o.split(" - ");return r.length?{login:e.trim(),nome:r.join(" - ").trim()}:{login:o.trim(),nome:""}}function di(o){return o.map(e=>{let{login:r,nome:t}=Pt(e.texto);return t?{valor:e.valor,rotulo:r,complemento:t}:{valor:e.valor,rotulo:r}})}function ui(o,e=document){return o.map(r=>({valor:r.valor,rotulo:r.texto,marca:()=>De(r.icone,16,e)}))}function Ye(o){return o.map(e=>({valor:e.valor,rotulo:e.texto}))}function mi(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"}),a=J(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});zl(o,a,t,e,r)}function zl(o,e,r,t,a){let n,i=qo({rotulo:"Grupo",vazio:"(sem grupo)",dicaBusca:"Buscar grupo\u2026",carregar:async()=>{let u=await o.op.opcoesAcompanhamento();return n=u.atual,[{valor:"",rotulo:"(sem grupo)"},...Ye(u.grupos)]},valor:()=>n}),s=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});s.value=t?t.observacao??"":a.slice(0,450);let c=o.reaberturaProgramada||!!t?.reabertura,p=Bo("Reabertura programada",!!t?.reabertura,u=>d.hidden=!u),d=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!t?.reabertura});d.value=t?.reabertura?ai(t.reabertura):"";let f=mo("Salvar",()=>void m()),m=async()=>{if(c&&p.input.checked&&!d.value){e.erro("Informe a data da reabertura.");return}let u=ni(s.value,c&&p.input.checked?ti(d.value):null);await e.gravar(()=>o.op.acompanhar({grupo:i.valor(),observacao:u}),[f])&&o.recarregar("acompanhamento")};br(r,c?p.el:null,c?l("div",{class:"spro-p-grade"},d):null,Eo("Grupo",i.el),Eo("Observa\xE7\xE3o",s),co(f))}var no=(o,e)=>o.loja.ler(e);function po(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void Ua(o,e)},e,...t)}function we(o,e){return Ko(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var go=(...o)=>l("div",{class:"spro-p-linha"},...o);function ql(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?ye({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},$("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var fi={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=no(o,"acompanhamento"),r=no(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>mi(o,a,t)}]:[],corpo:ko(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[we(i.motivo,"O acompanhamento especial")];if(!i.valor)return[ae("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:p}=i.valor;return[go(po(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),p?go(ql(p,o.agora())):null]})}}}};var Mo=o=>o.replace(/\r\n?/g,`
`).trim(),gi=(o,e)=>(o===null||Mo(o.texto)==="")&&(e===null||Mo(e.texto)==="")?!0:o!==null&&e!==null&&Mo(o.texto)===Mo(e.texto)&&o.prioridade===e.prioridade;function vi(o,e){let r=o.doc,t=e.confirmar??((C,R)=>ge(o,C,R)),a=e.ambiente??{focoEmOutroQuadro:()=>{let C=o.topo.activeElement,R=r.defaultView?.frameElement??null;return!!C&&C.tagName==="IFRAME"&&C!==R&&C.getClientRects().length>0},ativo:()=>r.activeElement},n=e.inicial&&Mo(e.inicial.texto)?e.inicial:null,i=n?.prioridade??!1,s="editando",c=!1,p=!1,d=0,f=0,m=C=>Date.now()-C<1500,u=!1,v,h,g=l("textarea",{class:"spro-p-post-it-texto",rows:"4",maxlength:String(te),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});g.value=n?.texto??"";let y=l("span",{class:"spro-p-contador"}),b=l("span",{class:"spro-p-post-it-situacao",role:"status","aria-live":"polite"}),w=l("span",{class:"spro-p-post-it-aviso-texto"}),M=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Tentar de novo"),P=l("div",{class:"spro-p-post-it-aviso erro",role:"alert",hidden:!0},w,M),E=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Usar a vers\xE3o do SEI"),I=l("div",{class:"spro-p-post-it-aviso desatualizado",role:"status",hidden:!0},l("span",{class:"spro-p-post-it-aviso-texto"},"Esta anota\xE7\xE3o mudou no SEI enquanto voc\xEA editava. Se salvar, a sua vers\xE3o substitui a do SEI."),E),z=(C,R,Y,vo="")=>l("button",{type:"button",class:`spro-p-post-it-botao${Y?"":" so-icone"}${vo?` ${vo}`:""}`,"aria-label":C},fo(R,16),Y?l("span",{class:"spro-p-post-it-botao-texto"},Y):null),G=z("Salvar anota\xE7\xE3o","disquete","Salvar","primario"),B=z("Prioridade","alerta","Prioridade","prioridade");B.setAttribute("aria-pressed",String(i));let A=z("Transformar as linhas selecionadas em checklist","checkQuadro","Checklist"),L=z("Subir as linhas selecionadas","cima",null),O=z("Descer as linhas selecionadas","baixo",null),N=l("input",{type:"date",class:"spro-p-post-it-data","aria-label":"Data para inserir na anota\xE7\xE3o"});N.value=Xe(g.value)??"";let X=z("Remover anota\xE7\xE3o","lixeira",null,"perigo"),U=z("Descartar altera\xE7\xF5es (Esc)","fechar",null),k=l("div",{class:"spro-p-post-it-barra",role:"toolbar","aria-label":"Ferramentas da anota\xE7\xE3o"},G,B,A,L,O,l("span",{class:"spro-p-post-it-data-rotulo"},fo("calendarioMais",16),N),l("span",{class:"spro-p-post-it-espaco"}),n?X:null,U),F=l("div",{class:"spro-p-post-it spro-p-post-it-edicao","data-estado":"editando"},g,l("div",{class:"spro-p-post-it-rodape"},y,b),I,P,k),x=()=>{let C=Mo(g.value);return C!==Mo(n?.texto??"")?!0:C===""?!1:i!==(n?.prioridade??!1)},D=()=>{let C=te-g.value.length;y.textContent=C<=0?"Voc\xEA atingiu o n\xFAmero m\xE1ximo de caracteres.":`${C} caracteres restantes`},_=()=>{g.style.height="auto";let C=g.scrollHeight;C&&(g.style.height=`${C}px`)},V=()=>{D(),_()},H=(C,R="")=>{s=C,F.setAttribute("data-estado",C);let Y=C==="salvando";g.readOnly=Y;for(let vo of[G,A,L,O,X,U,B])vo.disabled=Y;N.disabled=Y,Y?F.setAttribute("aria-busy","true"):F.removeAttribute("aria-busy"),b.textContent=Y?"Salvando\u2026":"",P.hidden=C!=="erro",w.textContent=C==="erro"?R:""},W=()=>{clearTimeout(v),r.removeEventListener("pointerdown",Wt,!0),r.defaultView?.removeEventListener("blur",Kt)},ro=C=>{u||(u=!0,W(),e.aoEncerrar(C))},No=()=>({ini:g.selectionStart??g.value.length,fim:g.selectionEnd??g.value.length}),Jo=(C,R=C)=>{try{g.setSelectionRange(C,R)}catch{g.selectionStart=C,g.selectionEnd=R}},rr=()=>{let{ini:C,fim:R}=No(),Y=kr(g.value,C),vo=kr(g.value,R),Vo=R>C&&Pe(g.value,vo)===R&&vo>Y?vo-1:vo;return{de:Y,ate:Vo}},uo=async()=>{if(u||s==="salvando")return;let C=Mo(g.value).slice(0,te);if(!x()&&s!=="erro"){ro({gravou:!1});return}if(C===""){if(!n){ro({gravou:!1});return}c=!0;let Y=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!Y){g.focus();return}}let R=C===""?!1:i;H("salvando");try{await o.op.anotar({texto:C,prioridade:R})}catch(Y){H("erro",Ao(Y)),g.focus();return}H("editando"),n=C===""?null:{texto:C,prioridade:R},ro({gravou:!0,valor:n})},Oo=async()=>{if(!(u||s==="salvando")){if(x()){c=!0;let C=await t("Descartar as altera\xE7\xF5es desta anota\xE7\xE3o?","Descartar");if(c=!1,!C){g.focus();return}}ro({gravou:!1})}},Jr=async()=>{if(u||s==="salvando"||!n)return;c=!0;let C=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!C){g.focus();return}H("salvando");try{await o.op.anotar({texto:"",prioridade:!1})}catch(R){H("erro",Ao(R));return}H("editando"),n=null,ro({gravou:!0,valor:null})},Zo=()=>{clearTimeout(v),v=setTimeout(()=>{if(u||c||p||s!=="editando")return;let C=a.ativo();if(C&&F.contains(C))return;let R=m(f)&&a.focoEmOutroQuadro();if(!(!m(d)&&!R)){if(!x()){ro({gravou:!1});return}Mo(g.value)===""&&n||uo()}},e.esperaSaidaMs??150)};g.addEventListener("input",()=>{V(),s==="erro"&&(P.hidden=!1)}),g.addEventListener("keydown",C=>{let R=C;if(R.key==="Escape"){R.preventDefault(),R.stopPropagation(),Oo();return}if(R.key==="Enter"&&(R.ctrlKey||R.metaKey)){R.preventDefault(),uo();return}if(R.key==="Enter"&&!R.shiftKey&&!R.altKey&&!R.isComposing){let{ini:Y,fim:vo}=No();if(Y!==vo)return;let Vo=Qn(g.value,Y);if(!Vo||Vo.texto.length>te)return;R.preventDefault(),g.value=Vo.texto,Jo(Vo.pos),V();return}R.altKey&&(R.key==="ArrowUp"||R.key==="ArrowDown")&&(R.preventDefault(),Zr(R.key==="ArrowUp"?-1:1))});let Zr=C=>{let{ini:R,fim:Y}=No(),{de:vo,ate:Vo}=rr(),Uo=Zn(g.value,vo,Vo,C);if(!Uo)return;let Pc=R-Pe(g.value,vo);g.value=Uo.texto;let Qr=Pe(Uo.texto,Uo.de);if(R===Y){let Dc=(Uo.texto.split(`
`)[Uo.de]??"").length;Jo(Qr+Math.min(Pc,Dc))}else Jo(Qr,Math.max(Pe(Uo.texto,Uo.ate+1)-1,Qr));V(),g.focus()};G.addEventListener("click",()=>void uo()),U.addEventListener("click",()=>void Oo()),X.addEventListener("click",()=>void Jr()),L.addEventListener("click",()=>Zr(-1)),O.addEventListener("click",()=>Zr(1)),B.addEventListener("click",()=>{i=!i,B.setAttribute("aria-pressed",String(i)),F.classList.toggle("prioridade",i)}),F.classList.toggle("prioridade",i),A.addEventListener("click",()=>{let{de:C,ate:R}=rr();g.value=Jn(g.value,C,R).slice(0,te),V(),g.focus()}),N.addEventListener("change",()=>{N.value&&(g.value=oi(g.value,N.value).slice(0,te),V())}),M.addEventListener("click",()=>void uo()),E.addEventListener("click",()=>{let C=h??null;n=C&&Mo(C.texto)?C:null,g.value=n?.texto??"",i=n?.prioridade??!1,B.setAttribute("aria-pressed",String(i)),F.classList.toggle("prioridade",i),N.value=Xe(g.value)??"",h=void 0,I.hidden=!0,F.removeAttribute("data-desatualizado"),V(),g.focus()}),F.addEventListener("pointerdown",()=>{p=!0,setTimeout(()=>{p=!1},600)});for(let C of["pointerup","pointercancel","click"])F.addEventListener(C,()=>{p=!1});let Wt=C=>{F.contains(C.target)||(d=Date.now())},Kt=()=>{f=Date.now(),Zo()};return r.addEventListener("pointerdown",Wt,!0),r.defaultView?.addEventListener("blur",Kt),F.addEventListener("keydown",C=>{C.key==="Tab"&&(d=Date.now())}),F.addEventListener("focusout",C=>{let R=C.relatedTarget;R&&F.contains(R)||Zo()}),D(),H("editando"),_(),{el:F,texto:()=>g.value,prioridade:()=>i,sujo:x,fatiaMudou(C){if(u)return;let R=Mo(g.value)?{texto:Mo(g.value),prioridade:i}:null,Y=!gi(C,n)&&!gi(C,R);h=Y?C:void 0,I.hidden=!Y,F.toggleAttribute("data-desatualizado",Y)},focar(){g.focus(),Jo(g.value.length),_()},saiuDoFoco:Zo,salvar:uo,descartar:Oo,destruir(){u=!0,W()}}}async function Dt(o,e){try{await e()}catch(r){Q(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var Je=new WeakMap;function Hl(o,e){Je.get(o)?.destruir(),Je.delete(o),e.gravou?(o.loja.definir("anotacao",{estado:"pronto",dado:{disponivel:!0,valor:e.valor},em:o.agora().getTime()}),o.recarregar("anotacao")):o.loja.renotificar("anotacao")}function Nr(o,e){let r=Je.get(o);if(r){r.focar();return}let t=vi(o,{inicial:e,aoEncerrar:a=>Hl(o,a)});Je.set(o,t),o.loja.renotificar("anotacao"),t.focar()}var Fl="label.item, input, a, button, textarea",hi={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=no(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null,a=Je.get(o);return a?(a.fatiaMudou(t),{estado:e.estado,desenho:{acoes:[],corpo:[a.el]}}):{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void Dt(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>Nr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void ge(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(n=>{n&&Dt(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>Nr(o,null)}]:[],corpo:ko(e,()=>o.recarregar("anotacao"),n=>{if(!n.disponivel)return[we(n.motivo,"As anota\xE7\xF5es")];if(!n.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>Nr(o,null)},"Adicionar anota\xE7\xE3o"))];let i=n.valor,{texto:s,prioridade:c}=i,p=Xe(s),d=p?ye({data:p,hora:"23:59",vencimento:!0},o.agora()):null,f=Lr(s).map((m,u)=>m.marca===null?l("div",{class:"spro-p-nota-linha"},m.texto||" "):l("label",{class:`spro-p-nota-linha item${m.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:m.marca==="feito",onchange:()=>void Dt(o,()=>o.op.alternarItemDaAnotacao(u))}),l("span",{},m.texto)));return[l("div",{class:`spro-p-post-it editavel${c?" prioridade":""}`,onclick:m=>{m.target?.closest(Fl)||Nr(o,i)}},c?l("span",{class:"spro-p-chip vencido"},fo("alerta",12),"prioridade"):null,...f,p&&d?l("span",{class:`spro-p-chip ${d.nivel}`},fo("calendarioMais",12),`${Tr({data:p,hora:"23:59",vencimento:!0})} \xB7 ${d.rotulo}`):null)]})}}}};function bi(o,e,r){let t,a=qo({rotulo:"Usu\xE1rio da unidade",vazio:"Escolher um usu\xE1rio\u2026",dicaBusca:"Buscar por login ou nome\u2026",limite:150,resumo:(p,d,f)=>d===f?`${f} usu\xE1rios na unidade`:`${d} de ${f} usu\xE1rios`,carregar:async()=>{let{opcoes:p,atual:d}=await o.op.opcoesAtribuicao(),f=e.usuario?p.find(m=>Pt(m.texto).login.toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0;return t=d??f,di(p)},valor:()=>t}),n=mo("Salvar",()=>void s(a.valor(),n,i)),i=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),s=async(p,...d)=>{if(p===""){c.erro("Escolha um usu\xE1rio.");return}let f=p===null?void 0:a.opcoes().find(u=>u.valor===p);await c.gravar(()=>o.op.atribuir(p),d)&&r(p===null?{usuario:null}:{usuario:f?.rotulo??"",nome:f?.complemento??""})};i.addEventListener("click",()=>void s(null,n,i));let c=J(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[l("div",{class:"spro-p-modal-lugar"},Eo("Atribuir para",a.el,e.usuario?`Hoje: ${e.usuario}`:void 0),co(e.usuario?i:null,n))]})}var xi={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"usuarioGravata",desenhar(o){let e=no(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:ko(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return go(po(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?Ae({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>bi(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(d=>d===a?{...d,usuario:s.usuario,nomeUsuario:s.nome,texto:ii(d.texto,s.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:s.usuario}})})}):null)}):[Ko(t.texto||"Processo sem andamento aberto.")],1)}}}};var Ai={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"livro",desenhar(o){let r=no(o,"blocoInterno").dado;if(r&&pr(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[go(r.descricao?po(o,r.descricao):Ko("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,i)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${i}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};var _r=class extends Error{constructor(r,t){super(t);this.codigo=r;this.name="ErroRpc"}};function Vl(o,e){let r=e.replace(/\D/g,""),t=r?o.querySelector(`tr[id="P${r}"] a[href*="procedimento_trabalhar"]`):null;if(t)return{tipo:"linha",link:t};let a=o.querySelector("#frmProtocoloPesquisaRapida"),n=o.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function Ei(o,e,r,t){let a=Vl(o,e);if(!a)throw new _r("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return t?o.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=r,t&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var yi=Object.freeze({carregando:!1,erro:null,processos:[],total:null,completa:!1,vazia:!1}),Pi=o=>o.idProcedimento??o.protocolo,Rr=class{constructor(e,r,t=a=>a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar."){this.buscar=e;this.aoMudar=r;this.mensagemDeErro=t}estado={...yi};versao=0;controle=null;atual(){return this.estado}iniciar(){this.controle?.abort();let e=++this.versao;this.publicar({...yi,carregando:!0}),this.carregar(0,e,[])}mais(){let e=this.estado;if(e.carregando||e.completa||e.total===null)return;let r=++this.versao;this.controle?.abort(),this.publicar({...e,carregando:!0,erro:null}),this.carregar(e.processos.length,r,e.processos)}repetir(){this.estado.total===null||!this.estado.processos.length?this.iniciar():this.mais()}parar(){this.controle?.abort(),this.versao+=1}publicar(e){this.estado=e,this.aoMudar(e)}async carregar(e,r,t){let a=new AbortController;this.controle=a;try{let n=await this.buscar(e,a.signal);if(r!==this.versao)return;let i=new Set(t.map(Pi)),s=[...t,...n.processos.filter(c=>!i.has(Pi(c)))];this.publicar({carregando:!1,erro:null,processos:s,total:n.total,completa:s.length>=n.total||n.processos.length===0,vazia:s.length===0})}catch(n){if(r!==this.versao||a.signal.aborted)return;this.publicar({...this.estado,carregando:!1,erro:this.mensagemDeErro(n)})}}};var Ul=o=>o===1?"1 processo":`${o} processos`;function Bl(o,e){let r=l("button",{type:"button",class:"spro-p-link spro-p-proc-num","aria-label":`Abrir o processo ${o.protocolo}`},$("pasta",14),o.protocolo);r.addEventListener("click",i=>e(o,i.ctrlKey||i.metaKey)),r.addEventListener("auxclick",i=>{i.button===1&&e(o,!0)});let t=o.unidade?o.unidadeNome&&o.unidadeNome!==o.unidade?`${o.unidade} (${o.unidadeNome})`:o.unidade:"",a=o.usuario?o.usuarioNome&&o.usuarioNome!==o.usuario?`${o.usuarioNome} (${o.usuario})`:o.usuario:"",n=[t,a,o.data].filter(Boolean);return l("li",{class:"spro-p-processo"},l("div",{class:"spro-p-processo-topo"},r,o.tipoProcesso?l("span",{class:"spro-p-chip"},o.tipoProcesso):null),n.length?l("div",{class:"spro-p-processo-meta"},...n.map(i=>l("span",{},i))):null)}function Di(o,e){let r=Fn(o.armazenamento),t=Bo("Tramitados na unidade",r.tramitadoNaUnidade,()=>v()),a=Bo(e.tipoNome?`De mesmo tipo (${e.tipoNome})`:"De mesmo tipo",r.mesmaNatureza,()=>v());a.input.disabled=!e.tipo;let n=l("div",{class:"spro-p-nota",role:"status","aria-live":"polite"}),i=l("ul",{class:"spro-p-lista-processos","aria-label":`Processos de ${e.nome}`}),s=l("div",{class:"spro-p-processos-rodape"}),c=l("div",{class:"spro-p-modal-lugar"},n,i,s),p=J(o,{titulo:"Processos do interessado",icone:"pessoa",largura:640,conteudo:[l("p",{class:"spro-p-interessado-nome"},e.nome),l("div",{class:"spro-p-ferramentas",role:"group","aria-label":"Filtros da pesquisa"},t.el,a.el),c]});p.el.classList.add("spro-p-dialogo-processos");let d=e.id,f=async()=>{if(d)return d;let g=await o.op.formularioDoProcesso(),y=g.interessados.find(b=>b.texto===e.nome)??g.interessados.find(b=>b.texto.startsWith(e.nome));if(!y)throw new Error("N\xE3o achei este interessado no cadastro do processo.");return d=y.id,y.id},m=(g,y)=>{try{Ei(o.topo,g.idProcedimento??"",g.protocolo,y),y||p.fechar()}catch(b){Q(o,b instanceof Error?b.message:"N\xE3o foi poss\xEDvel abrir o processo.",6e3)}},u=new Rr(async(g,y)=>o.op.processosDoInteressado({interessadoId:await f(),inicio:g,tramitadoNaUnidade:t.input.checked,...a.input.checked&&e.tipo?{tipoProcesso:e.tipo}:{}},y),g=>h(g),zo),v=()=>{Vn(o.armazenamento,{tramitadoNaUnidade:t.input.checked,mesmaNatureza:a.input.checked}),u.iniciar()};function h(g){if(c.setAttribute("aria-busy",String(g.carregando)),i.replaceChildren(...g.processos.map(y=>Bl(y,m))),s.replaceChildren(),g.carregando&&!g.processos.length){n.textContent="Pesquisando os processos do interessado\u2026",i.append(l("li",{class:"spro-p-esqueleto","aria-hidden":"true"},l("span",{class:"spro-p-barra"}),l("span",{class:"spro-p-barra",style:"width:62%"})));return}if(g.erro&&!g.processos.length){n.replaceChildren();let y=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");y.addEventListener("click",()=>u.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},$("alerta",13),` ${g.erro} `,y));return}if(g.vazia){n.textContent="Nenhum processo encontrado. A pesquisa s\xF3 traz os que voc\xEA pode ver.";return}if(n.textContent=g.total===null?"":`${g.processos.length} de ${Ul(g.total)}.`,g.erro){let y=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");y.addEventListener("click",()=>u.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},$("alerta",13),` ${g.erro} `,y))}else if(!g.completa){let y=l("button",{type:"button",class:"spro-botao"},g.carregando?"Carregando\u2026":`Mais resultados (${(g.total??0)-g.processos.length} restantes)`);y.disabled=g.carregando,y.addEventListener("click",()=>u.mais()),s.append(y)}}p.el.addEventListener("close",()=>u.parar()),u.iniciar()}var $r=class{constructor(e,r=new Map){this.negados=r;this.atuais=[...e]}atuais;novos=[];retirados=new Set;linhas(){let e=r=>{let t=this.negados.get(r);return t===void 0?{}:{negadoPor:t}};return[...this.atuais.map(r=>({item:r,estado:this.retirados.has(r.id)?"retirado":"atual",...e(r.id)})),...this.novos.map(r=>({item:r,estado:"novo"}))]}tem(e){return this.novos.some(r=>r.id===e)||this.atuais.some(r=>r.id===e)&&!this.retirados.has(e)}adicionar(e){return this.tem(e.id)?!1:this.atuais.some(r=>r.id===e.id)?(this.retirados.delete(e.id),!0):(this.novos.push({id:e.id,texto:e.texto}),!0)}alternarRetirada(e){return!this.atuais.some(r=>r.id===e)||this.negados.has(e)?!1:(this.retirados.has(e)?this.retirados.delete(e):this.retirados.add(e),!0)}removerNovo(e){let r=this.novos.findIndex(t=>t.id===e);return r<0?!1:(this.novos.splice(r,1),!0)}resultado(){return[...this.atuais.filter(e=>!this.retirados.has(e.id)),...this.novos]}mudou(){return this.retirados.size>0||this.novos.length>0}contagem(){return{atuais:this.atuais.length-this.retirados.size,retirados:this.retirados.size,novos:this.novos.length}}};var wi=o=>o.replace(/\s+/g," ").trim(),zr=class{constructor(e){this.o=e;this.minimo=e.minimo??3,this.esperaMs=e.esperaMs??350}versao=0;controle=null;minimo;esperaMs;digitou(e){let r=wi(e),t=this.cancelar();if(!r)return this.o.aoMudar({tipo:"ocioso"});if(r.length<this.minimo)return this.o.aoMudar({tipo:"curto",falta:this.minimo-r.length});(this.o.esperar??(n=>new Promise(i=>setTimeout(i,n))))(this.esperaMs).then(()=>{t===this.versao&&this.executar(r,t)})}agora(e){let r=wi(e),t=this.cancelar();if(r.length<this.minimo)return this.o.aoMudar(r?{tipo:"curto",falta:this.minimo-r.length}:{tipo:"ocioso"});this.executar(r,t)}repetir(e){this.agora(e)}parar(){this.cancelar()}cancelar(){return this.controle?.abort(),this.controle=null,++this.versao}async executar(e,r){let t=new AbortController;this.controle=t,this.o.aoMudar({tipo:"pesquisando",termo:e});try{let a=await this.o.pesquisar(e,t.signal);if(r!==this.versao)return;this.o.aoMudar(a.length?{tipo:"resultado",termo:e,itens:a}:{tipo:"vazio",termo:e})}catch(a){if(r!==this.versao||t.signal.aborted)return;this.o.aoMudar({tipo:"erro",termo:e,mensagem:this.o.mensagemDeErro?.(a)??(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar.")})}}};var Gl=o=>{let e=[];return o.novos&&e.push(`${o.novos} a acrescentar`),o.retirados&&e.push(`${o.retirados} a retirar`),e.join(", ")};function wt(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),t=J(o,{titulo:e.titulo,icone:e.icone,largura:560,conteudo:[r]}),a=i=>{let s=new $r(i.atuais,i.negados),c=l("h3",{class:"spro-p-lupa-titulo"}),p=l("ul",{class:"spro-p-lista-modal","aria-label":`${e.nomePlural} no processo`}),d=l("input",{type:"search",class:"spro-campo",autocomplete:"off","aria-label":`Pesquisar ${e.nome} para adicionar`,"aria-controls":"spro-p-lupa-resultados",placeholder:"Pesquisar\u2026"}),f=l("div",{class:"spro-p-nota spro-p-lupa-estado",role:"status","aria-live":"polite"}),m=l("ul",{class:"spro-p-lista-modal spro-p-resultados",id:"spro-p-lupa-resultados","aria-label":"Resultados da pesquisa"}),u=l("span",{class:"spro-p-nota spro-p-lupa-situacao","aria-live":"polite"}),v=mo("Salvar",()=>void M()),h={tipo:"ocioso"},g=()=>{let P=s.linhas(),E=s.contagem();c.textContent=`No processo (${E.atuais+E.novos})`,p.replaceChildren(...P.length?P.map(I=>{let z;if(I.negadoPor)z=l("span",{class:"spro-p-chip"},`Acrescentado por ${I.negadoPor}`);else{let G=l("button",I.estado==="novo"?{type:"button",class:"spro-p-acao perigo","aria-label":`Desfazer a inclus\xE3o de ${I.item.texto}`}:{type:"button",class:"spro-p-acao perigo","aria-pressed":String(I.estado==="retirado"),"aria-label":`${I.estado==="retirado"?"Manter":"Retirar"} ${I.item.texto}`},I.estado==="novo"?"Desfazer":I.estado==="retirado"?"Manter":"Retirar");G.addEventListener("click",()=>{I.estado==="novo"?s.removerNovo(I.item.id):s.alternarRetirada(I.item.id),b()}),z=G}return l("li",{class:"spro-p-linha-modal","data-estado":I.estado},I.estado==="novo"?l("span",{class:"spro-p-chip ok"},"Novo"):null,l("span",{class:"spro-p-texto-modal"},I.item.texto),z)}):[l("li",{class:"spro-p-vazio"},`O processo n\xE3o tem ${e.nomePlural}.`)]),v.disabled=!s.mudou(),u.textContent=Gl(E)},y=P=>{if(h=P,m.replaceChildren(),m.removeAttribute("aria-busy"),P.tipo==="ocioso")f.textContent=e.dica;else if(P.tipo==="curto")f.textContent=`Digite mais ${P.falta===1?"1 letra":`${P.falta} letras`} para pesquisar.`;else if(P.tipo==="pesquisando")f.textContent="Pesquisando\u2026",m.setAttribute("aria-busy","true");else if(P.tipo==="vazio")f.textContent=`Nenhum resultado para \u201C${P.termo}\u201D.`;else if(P.tipo==="erro"){let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>w.repetir(d.value)),f.replaceChildren($("alerta",13),` ${P.mensagem} `,E)}else{f.textContent=P.itens.length===1?"1 resultado.":`${P.itens.length} resultados.`;for(let E of P.itens){let I=s.tem(E.id),z=l("button",{type:"button",class:"spro-p-acao","aria-label":I?`${E.texto} (j\xE1 est\xE1 no processo)`:`Adicionar ${E.texto}`},I?"No processo":"Adicionar");z.disabled=I,z.addEventListener("click",()=>{s.adicionar(E)&&(b(),y(h),m.querySelector("button:not([disabled])")?.focus())}),m.append(l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},E.texto),z))}return}},b=()=>g(),w=new zr({pesquisar:i.pesquisar,aoMudar:y,mensagemDeErro:zo,...e.esperaMs!==void 0?{esperaMs:e.esperaMs}:{}});d.addEventListener("input",()=>w.digitou(d.value)),d.addEventListener("keydown",P=>{if(P.key==="Enter")P.preventDefault(),w.agora(d.value);else if(P.key==="ArrowDown"){let E=m.querySelector("button:not([disabled])");E&&(P.preventDefault(),E.focus())}}),m.addEventListener("keydown",P=>{if(P.key!=="ArrowDown"&&P.key!=="ArrowUp")return;let E=[...m.querySelectorAll("button:not([disabled])")],I=E.indexOf(P.target);I<0||(P.preventDefault(),P.key==="ArrowDown"?E[Math.min(I+1,E.length-1)]?.focus():I===0?d.focus():E[I-1]?.focus())}),t.el.addEventListener("close",()=>w.parar());let M=async()=>{let P=s.resultado();if(e.obrigatorio&&!P.length){t.erro(e.obrigatorio);return}await t.gravar(()=>e.gravar(P),[v])&&e.depois()};r.replaceChildren(c,p,l("div",{class:"spro-p-lupa-busca"},l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},`Adicionar ${e.nome}`),d),f,m),co(u,v)),g(),y({tipo:"ocioso"}),d.focus({preventScroll:!0})},n=()=>{r.replaceChildren(l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),e.carregar().then(i=>{t.el.isConnected&&a(i)}).catch(i=>{if(!t.el.isConnected)return;let s=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");s.addEventListener("click",n),r.replaceChildren(l("div",{class:"spro-p-erro",role:"alert"},$("alerta",13),` ${zo(i)} `,s))})};n()}async function jl(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var Wl=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function Si(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=mo("Salvar",()=>void n()),a=J(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[Eo("Especifica\xE7\xE3o",r),co(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function Mi(o,e){let r,t=qo({rotulo:"Tipo de processo",vazio:"Escolher o tipo\u2026",dicaBusca:"Buscar tipo de processo\u2026",limite:150,resumo:(i,s,c)=>s===c?`${c} tipos`:`${s} de ${c} tipos`,carregar:async()=>{let i=await o.op.formularioDoProcesso();return r=i.tipoAtual??i.tipos.find(s=>s.texto===e)?.valor,Ye(i.tipos)},valor:()=>r}),a=mo("Salvar",async()=>{if(!t.valor()){n.erro("Escolha um tipo.");return}await n.gravar(()=>o.op.alterarProcesso({tipo:t.valor()}),[a])&&o.recarregar("dadosProcesso")}),n=J(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[l("div",{class:"spro-p-modal-lugar"},Eo("Tipo de processo",t.el),co(a))]})}function Ci(o){let e=Wl("Carregando o formul\xE1rio do processo\u2026"),r=J(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});jl(o,r,e,t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(d=>l("button",{type:"button",role:"radio","aria-checked":String(d===a),"data-nivel":d},d==="publico"?"P\xFAblico":"Restrito")),i=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=qo({rotulo:"Hip\xF3tese legal",vazio:"Escolher a hip\xF3tese legal\u2026",dicaBusca:"Buscar hip\xF3tese legal\u2026",limite:150,adiar:!0,carregar:async()=>Ye(await t.hipoteses("1")),valor:t.hipoteseAtual}),c=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"},Eo("Hip\xF3tese legal",s.el));for(let d of n)d.addEventListener("click",()=>{a=d.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let f of n)f.setAttribute("aria-checked",String(f===d));c.hidden=a!=="restrito",a==="restrito"&&s.carregarAgora()});a==="restrito"&&s.carregarAgora();let p=mo("Salvar",async()=>{if(a==="restrito"&&!s.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:s.valor()}:{nivel:a}),[p])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,c,co(p))})}function Ii(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=mo("Salvar",()=>void n()),a=J(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[Eo("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),co(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}var Oi=(o,e)=>async()=>{let r=await o.op.formularioDoProcesso();return e==="assuntos"?{atuais:r.assuntos,negados:r.assuntosNegados,pesquisar:(t,a)=>r.pesquisarAssuntos(t,a)}:{atuais:r.interessados,negados:r.interessadosNegados,pesquisar:(t,a)=>r.pesquisarContatos(t,a)}};function Ti(o){wt(o,{titulo:"Interessados do processo",icone:"pessoa",nome:"interessado",nomePlural:"interessados",dica:"Digite o nome do contato para pesquisar.",carregar:Oi(o,"interessados"),gravar:e=>o.op.alterarProcesso({interessados:e}),depois:()=>o.recarregar("dadosProcesso")})}function Li(o){wt(o,{titulo:"Assuntos do processo",icone:"etiqueta",nome:"assunto",nomePlural:"assuntos",dica:"Digite o c\xF3digo ou parte da descri\xE7\xE3o do assunto.",carregar:Oi(o,"assuntos"),gravar:e=>o.op.alterarProcesso({assuntos:e}),depois:()=>o.recarregar("dadosProcesso"),obrigatorio:"O processo precisa ter ao menos um assunto."})}var Xo=o=>{let e=no(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},Se=o=>!o.sigiloso&&!!Xo(o)?.editavel;async function qr(o,e){let r=Xo(o);if(!r)return;let t=!So(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:ei(r.especificacao,e).slice(0,100)});Q(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){Q(o,Ao(a),7e3)}o.recarregar("dadosProcesso")}function Hr(o,e,r=2){let t=no(o,"dadosProcesso");return ko(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[we(a.motivo,"Este dado")],r)}var ki={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"balaoPontos",desenhar(o){let e=no(o,"dadosProcesso"),r=Xo(o),t=[];return r&&Se(o)&&(t.push({icone:"alerta",rotulo:So(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:So(r.especificacao,"URGENTE"),aoClicar:()=>void qr(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:So(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:So(r.especificacao,"TRANCADO"),aoClicar:()=>void qr(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>Si(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:Hr(o,a=>[go(po(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${So(a.valor.especificacao,"URGENTE")?"urgente":""} ${So(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},Ni={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"caixa",desenhar(o){let e=Xo(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&Se(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>Mi(o,r)}]:[],corpo:[go(po(o,r||"(n\xE3o informado)"))]}}}},_i={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"globo",desenhar(o){let e=Xo(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":Ga.publico;return{estado:"pronto",desenho:{icone:r==="restrito"?"cadeado":r==="sigiloso"?"semUsuario":"globo",acoes:e&&Se(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>Ci(o)}]:[],corpo:[go(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},$(Ba[r],13)),po(o,a))]}}}},Ri={tipo:"interessados",titulo:"Interessados",icone:"usuarios",desenhar(o){return{estado:no(o,"dadosProcesso").estado,desenho:{acoes:Xo(o)&&Se(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>Ti(o)}]:[],corpo:Hr(o,r=>r.valor.interessados.length?r.valor.interessados.map((t,a)=>{let n=r.valor.interessadosItens?.[a],i=n&&n.texto===t?n.id:void 0;return l("div",{class:"spro-p-linha interessado"},...si(t).map(s=>po(o,s)),l("button",{type:"button",class:"spro-p-acao spro-p-proc-do-interessado","aria-label":`Processos de ${t}`,onclick:()=>Di(o,{nome:t,...i?{id:i}:{},...r.valor.idTipo?{tipo:r.valor.idTipo}:{},...r.valor.tipo?{tipoNome:r.valor.tipo}:{}})},fo("lupa",16)))}):[ae("Sem interessados.")])}}}},$i={tipo:"assuntos",titulo:"Assuntos",icone:"favorito",desenhar(o){return{estado:no(o,"dadosProcesso").estado,desenho:{acoes:Xo(o)&&Se(o)?[{icone:"lapis",rotulo:"Editar assuntos",aoClicar:()=>Li(o)}]:[],corpo:Hr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>go(po(o,t))):[ae("Sem assuntos.")])}}}},zi={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"balao",desenhar(o){let e=no(o,"dadosProcesso"),r=Xo(o);return{estado:e.estado,desenho:{acoes:r&&Se(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>Ii(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:Hr(o,t=>{let a=ri(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>go(po(o,`${n.unidade}: ${n.observacao}`))):[Ko("Sem observa\xE7\xF5es.")]})}}}};var Kl=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function St(o,e){let r=l("div",{class:"spro-p-modal-lugar"}),t=J(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});Xl(o,t,r,e)}function Xl(o,e,r,t){let a=t?Ke(t.texto):{prazo:null,texto:""},n=[],i=qo({rotulo:"Marcador",vazio:"Escolher um marcador\u2026",dicaBusca:"Buscar marcador\u2026",limite:150,carregar:async()=>(n=await o.op.opcoesMarcador(),ui(n,o.topo)),valor:()=>t?n.find(h=>h.texto===t.nome)?.valor:void 0}),s=Bo("Controlar prazo",!!a.prazo,h=>f.hidden=!h),c=Bo("Controlar vencimento (\u201CAt\xE9\u201D)",!!a.prazo?.vencimento,()=>{}),p=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=a.prazo?.data??Kl(o.agora());let d=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=a.prazo?.hora??"23:59";let f=l("div",{class:"spro-p-grade",hidden:!a.prazo},c.el,l("div",{class:"spro-p-par"},p,d)),m=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});m.value=a.texto;let u=mo("Salvar",()=>void v()),v=async()=>{let h=n.find(b=>b.valor===i.valor());if(!h){e.erro("Escolha um marcador.");return}if(s.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let g=jn({prazo:s.input.checked?{data:p.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:m.value}),y=await e.gravar(async()=>(t&&h.texto!==t.nome&&await o.op.desmarcar(t.nome),o.op.marcar({marcador:h.texto,texto:g})),[u]);return o.recarregar("marcador"),y};br(r,Eo("Marcador",i.el),t?l("p",{class:"spro-p-nota spro-p-nota-marcador"},De(t.icone,13,o.topo),` Atual: ${t.nome}. Escolher outro troca o marcador.`):null,s.el,f,Eo("Texto",m),co(u))}function Yl(o,e){let{prazo:r}=Ke(e);if(!r)return null;let t=ye(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},$("relogio",11),`${r.vencimento?"at\xE9 ":""}${Tr(r)} \xB7 ${t.rotulo}`)}async function Jl(o,e){if(await ge(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);Q(o,r.resumo)}catch(r){Q(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function Zl(o,e,r){let{texto:t}=Ke(e.texto),a=po(o,e.nome,"forte");return a.prepend(De(e.icone,15,o.doc)),go(l("div",{class:"spro-p-marcador"},a,Yl(o,e.texto),t?po(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},Ae({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>St(o,e)}),Ae({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void Jl(o,e)})):null)}var qi={tipo:"marcador",titulo:"Marcador",icone:"etiquetas",desenhar(o){let e=no(o,"marcador"),r=Wn(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>St(o)}]:[],corpo:[...ko(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>Zl(o,a,t.editavel)):[ae("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},$("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var Hi=[hi,xi,Ai,qi,fi,ki,Ni,_i,Ri,$i,zi];var Fi=1e4;function Me(o){if(!o.getElementById("frmArvore"))return null;try{return rt(Qo(o))}catch{return null}}function Ze(o,e=Fi){return new Promise(r=>{let t=Me(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=m=>{i||(i=!0,p?.disconnect(),clearTimeout(f),clearInterval(d),r(m))},c=()=>{let m=Me(o);m&&s(m)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),f=setTimeout(()=>s(null),e)})}var Ui="data-spro-processo-raiz";function Ql(o){for(let e of o.querySelectorAll(`[${Ui}], [data-spro-slot="atividades"]`))e.remove()}function Bi(o){return Hi.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&Nn.has(e.tipo)))}function Gi(o){let e=new Set;for(let r of Bi(o))for(let t of At[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function Vi(o){let e=o.doc;To(e),Ql(e);let r=e.getElementById("frmArvore")??e.body,t=Do(e),a=(b="")=>l("div",{class:`spro-p-raiz ${b}`.trim(),[Ui]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let p=e.getElementById("divRelacionados");p?p.before(s):i.after(s),r.append(n);let d=new Map,f=Bi(o),m=b=>xt.indexOf(b);for(let b of f){let w=_n({tipo:b.tipo,titulo:b.titulo,icone:b.icone,aberto:qn(o.armazenamento,b.tipo),aoAlternar:M=>Hn(o.armazenamento,b.tipo,M)});d.set(b.tipo,{def:b,casca:w})}for(let b of[...xt].sort((w,M)=>m(w)-m(M))){let w=d.get(b);w&&n.append(w.casca.el)}let u=d.get("anotacoes");u&&i.append(u.casca.el);let v=b=>{let w=d.get(b);if(!w)return;let M;try{M=w.def.desenhar(o)}catch(P){console.warn(`[SEI Pro] painel ${b}:`,P),M=null}w.casca.el.hidden=M===null,M&&w.casca.atualizar(M.estado,M.desenho)},h=b=>{if(b)v(b);else for(let w of d.keys())v(w)},g=o.loja.aoMudar(b=>{for(let[w,M]of d)At[M.def.tipo].includes(b)&&v(w)});h();let y=fe(e,()=>{let b=Do(e);for(let w of[n,i])b?w.setAttribute("data-tema","escuro"):w.removeAttribute("data-tema")});return{raiz:n,redesenhar:h,desmontar(){g(),y(),n.remove(),i.remove(),s.remove()}}}function ji(o,e,r={}){let t=Vi(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=Vi(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}var op="seipro-historico-sessao",Mt="seiProHistoricoRestauro",ep=600*1e3,Wi;function Ct(){if(Wi!==void 0)return Wi;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Xi(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};Ct()?.setItem(Mt,JSON.stringify(t))}catch{}}function Fr(){try{Ct()?.removeItem(Mt)}catch{}}function It(o,e=Date.now()){try{let r=Ct()?.getItem(Mt);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>ep?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var Ki=Promise.resolve();function Yi(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return r.request(op,e?{signal:e}:{},o).catch(n=>{throw Ro(n)});let t=Ki.then(()=>{if(e?.aborted)throw Ro(new DOMException("cancelado","AbortError"));return o()});return Ki=t.catch(()=>{}),t}var rp={resumido:"R",completo:"P",total:"T"};var tp=2e3;function Ji(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function ap(o){let e=[...o.querySelectorAll("td")],r=T(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=T(e[3]),i={data:r,unidade:T(e[1]),...t?{unidadeNome:t}:{},usuario:T(e[2]),descricao:n},s=xr(r);s&&(i.dataISO=s),a&&(i.usuarioNome=a),o.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let p=T(c);/^\d+$/.test(p)&&(i.nrSei=p);let d=Z(c.getAttribute("href")??"").get("id_documento");d&&(i.idDocumento=d)}if(Ji(n).startsWith(Ji(yo.remetidoPrefixo))){let p=e[3]?.querySelector("a.ancoraSigla"),d=T(p);d&&(i.unidadeCitada=d);let f=p?.getAttribute("title")??"";f&&(i.unidadeCitadaNome=f)}return i}function Ot(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(T(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(ap),total:r}}function np(o){if(o.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=io(o,"procedimento_consultar_historico")??eo(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new S("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function Ie(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function Tt(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(T(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Zi(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function ip(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let i=0;i<=a&&i+n<=t.length;i+=1){let s=!0;for(let c=0;c<n;c+=1)if(Zi(t[i+c])!==Zi(o.andamentos[c])){s=!1;break}if(s)return[...t.slice(0,i),...o.andamentos]}return null}async function sp(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=cp(o,t,r);return a||await Yi(()=>lp(o,e,r),r.sinal)}catch(t){throw Ro(t)}}function cp(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(Ie(e,"hdnTipoHistorico")||"R")!==r.tipo||(Ie(e,"hdnInfraPaginaAtual")||"0")!=="0"||It(o.http.base.host))return null;let{itens:t,total:a}=Ot(e);return Tt(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:Ie(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Qi(o,e,r){await K.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function lp(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new S("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",T(a.doc.querySelector("title")));let n=It(t);if(n){try{await Qi(o,a,n),Fr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let i={tipo:Ie(a,"hdnTipoHistorico")||"R",pagina:Ie(a,"hdnInfraPaginaAtual")||"0"},s=i,c=!1,p=async(d,f)=>{c||(Xi(t,i),c=!0);let m={tipo:r.tipo,pagina:String(f)},u=await K.de(d,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:m.tipo,hdnInfraPaginaAtual:m.pagina}).enviar({sinal:r.sinal});return s=m,u};try{let d=i.tipo===r.tipo&&i.pagina==="0"?a:await p(a,0);if(!d.doc.querySelector("#tblHistorico"))throw new S("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",T(d.doc.querySelector("title")));let f=Ot(d),m=Ie(d,"hdnInfraHashCriterios"),u=f.total,v=u?Math.min(u,r.limite):r.limite,h=ip(r.cache,m,u,f.itens);if(h)return r.aoProgresso?.(1,1),{andamentos:h,total:u,hash:m,completo:!0,aproveitouCache:!0};let g=[...f.itens],y=f.itens.length,b=d.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,w=b>0?b:u>y&&y>0?Math.ceil(u/y):1;r.aoProgresso?.(1,w);for(let P=1;g.length<v&&Tt(d)&&P<tp;P+=1){d=await p(d,P);let E=Ot(d);if(!E.itens.length)break;g.push(...E.itens),r.aoProgresso?.(P+1,Math.max(w,P+1))}let M=u?g.length>=u:!Tt(d);return{andamentos:g,total:u||g.length,hash:m,completo:M,aproveitouCache:!1}}finally{if(c)if(s.tipo!==i.tipo||s.pagina!==i.pagina)try{await Qi(o,a,i),Fr()}catch{}else Fr()}}var Ce=new Map;function pp(o,e){return`${o.http.base.host}|${Z(e).get("id_procedimento")??e}`}function dp(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new S("CANCELADO","Opera\xE7\xE3o cancelada."));let t=pp(o,e),a=Ce.get(t);if(!a){let i=new AbortController,s=new Set,c={promessa:void 0,controle:i,interessados:0,progresso:s,ultimo:null};c.promessa=sp(o,e,{tipo:rp.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:i.signal,cache:r.cache,aoProgresso:(p,d)=>{c.ultimo=[p,d];for(let f of s)f(p,d)}}).finally(()=>{Ce.get(t)===c&&Ce.delete(t)}),c.promessa.catch(()=>{}),Ce.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((i,s)=>{let c=!1,p=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",d)},d=()=>{if(c)return;p(),n.interessados-=1;let f=new S("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){s(f);return}Ce.get(t)===n&&Ce.delete(t),n.controle.abort(),n.promessa.then(()=>s(f),()=>s(f))};r.sinal?.addEventListener("abort",d,{once:!0}),n.promessa.then(f=>{c||(p(),i(f))},f=>{c||(p(),s(Ro(f)))})})}function os(o,e,r={}){return dp(o,np(e),r)}var Yo=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}somar(e){this.porId.has(e.id)||this.porId.set(e.id,e)}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of ma({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(up(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function Ho(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function up(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function rs(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function ts(o,e,r){let t=io(o,e);if(!t)throw new S("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var as=o=>e=>Z(e.url).get("acao")!==o;async function mp(o,e,r,t){let a=await o.http.obter(ts(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return K.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>eo(a.html,i)).find(Boolean);if(!n)throw new S("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return K.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Lt(o,e,r,t){let a=await rs(o,e,t.sinal),n=await mp(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??as(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Vr(o,e,r,t){return Lt(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=so("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...so("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function ns(o,e,r,t){return Lt(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=ho(r),s=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=s.find(p=>p.valor===r)??s.find(p=>ho(p.texto.split(" - ")[0])===i)??s.find(p=>ho(p.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(p=>ho(p.texto).includes(i)).length===1?s.find(p=>ho(p.texto).includes(i)):void 0);if(!c)throw new S("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),so("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function is(o,e,r,t){return Lt(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...so("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...so("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function fp(o,e,r){let t=ts(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function es(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:T(t[1]),texto:T(t[2]),usuario:T(t[3]),data:T(t[4])}})}async function kt(o,e,r,t){let a=await rs(o,e,t.sinal),n=await fp(o,a,t.sinal),i=es(n),s=ho(r.marcador),c=i.find(m=>ho(m.marcador)===s),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=eo(n.html,"andamento_marcador_remover");if(!m)throw new S("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let u=K.de(n,"#frmGerenciarMarcador",o.http);u.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let v=await o.http.enviar(m,u.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(es(v).some(h=>h.id===c.id))throw new S("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=K.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=eo(n.html,"andamento_marcador_cadastrar");if(!m)throw new S("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await K.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let f=d.escolher("selMarcador",r.marcador);return d.definir({hdnIdMarcador:f.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?so(`Texto do marcador ${f.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${f.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:as("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${f.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${f.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function gp(o){let e=T(o.doc.querySelector(".pesquisaBarra")),r=Number((/de\s+([\d.]+)\s*$/.exec(e)??/([\d.]+)\s+resultados?\s*$/i.exec(e)??[])[1]?.replace(/\./g,"")??0),t=[];for(let a of o.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")){let n=a.querySelector("td.pesquisaTituloEsquerda"),i=[...n?.querySelectorAll("a.protocoloNormal")??[]].find(g=>(g.getAttribute("href")??"").includes("procedimento_trabalhar")),s=a.querySelector("td.pesquisaTituloDireita a"),c=a.nextElementSibling,p=c?.nextElementSibling,d=g=>T([...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(y=>T(y).startsWith(g))).replace(/^[^:]+:\s*/,""),f=s?.getAttribute("title")??"",m=g=>[...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(y=>T(y).startsWith(g))?.querySelector("a"),u=m("Unidade"),v=m("Usu"),h=Z(i?.getAttribute("href")??"").get("id_procedimento")??void 0;t.push({protocolo:T(i),...h?{idProcedimento:h}:{},tipoProcesso:i?.getAttribute("title")??T(n?.querySelector("span")).replace(/\s*N\u00BA\s*$/,""),...s?{documento:{numero:T(s),tipo:f}}:{},trecho:T(c?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/,""),unidade:d("Unidade"),...u?.getAttribute("title")?{unidadeNome:u.getAttribute("title")}:{},usuario:d("Usu"),...v?.getAttribute("title")?{usuarioNome:v.getAttribute("title")}:{},data:d("Inclus")||d("Data")})}return{itens:t,total:r||t.length}}async function ss(o,e,r){if(!e.interessadoId)throw new S("ARGUMENTO_INVALIDO","Informe o interessado.");let t=Math.max(0,Math.floor(e.inicio??0)),a=await K.abrir(o.http,o.linkMenu("protocolo_pesquisar"),"#frmPesquisaProtocolo",{sinal:r});a.definir({rdoPesquisarEm:"P",hdnIdContato:e.interessadoId,chkSinTramitacao:e.tramitadoNaUnidade?"S":null,hdnInicio:String(t)}),e.tipoProcesso&&a.escolher("selTipoProcedimentoPesquisa",e.tipoProcesso);let n=await a.enviar({sinal:r,botao:"sbmPesquisar",aceitarValidacao:!0}),i=Z(n.url).get("acao");if(i==="procedimento_trabalhar"){let p=T(n.doc.querySelector("title")).replace(/^SEI\s*-\s*/,""),d=Z(n.url).get("id_procedimento")??void 0;return{total:1,inicio:0,processos:[{protocolo:p,...d?{idProcedimento:d}:{},tipoProcesso:"",trecho:"",unidade:"",usuario:"",data:""}]}}if(i!=="protocolo_pesquisar")throw new S("SEI_RESPOSTA_INESPERADA","A pesquisa do SEI n\xE3o respondeu como esperado.");let{itens:s,total:c}=gp(n);return{total:s.length?c:0,inicio:t,processos:s}}function Ur(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function ls(o,e,r){let t=io(e,"procedimento_alterar"),a=t??io(e,"procedimento_consultar");if(!a)throw new S("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await K.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function Oe(o){return o.map(e=>e.texto).filter(Boolean)}var vp={0:"publico",1:"restrito",2:"sigiloso"};async function ps(o,e,r){let{form:t,editavel:a}=await ls(o,e,r),n=vp[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:Ur(t,"selHipoteseLegal").trim()||e.hipotese,s=(t.valor("hdnIdTipoProcedimento")??"").trim(),c=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...i?{hipotese:i}:{},tipo:Ur(t,"selTipoProcedimento")||e.tipo,...s?{idTipo:s}:{},especificacao:t.valor("txtDescricao")??"",assuntos:Oe(t.itensLupa("selAssuntos")),interessados:Oe(t.itensLupa("selInteressadosProcedimento")),assuntosItens:t.itensLupa("selAssuntos"),interessadosItens:t.itensLupa("selInteressadosProcedimento"),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:hp(t),editavel:a,...c?{autuacao:c}:{}}}function hp(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=T(t[0]);a&&e.push({unidade:a,observacao:T(t[1])})}return e}function cs(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let i=r.get(n.id);if(i!==void 0&&!a.has(n.id))throw new S("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${i}.`)}}async function ds(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await ls(o.http,a,{sinal:t.sinal});if(!i)throw new S("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...so("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=Ur(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),s.push(...so("Tipo",p,d.texto))}if(r.nivel!==void 0){let p=se[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:ie[r.nivel]}),s.push(...so("N\xEDvel de acesso",p,se[ie[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=Ur(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||ie.restrito,f=le(await ce(o,n,d,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:f.id}),s.push(...so("Hip\xF3tese legal",p,f.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new S("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(s.push(...so("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let p=n.itensLupa("selInteressadosProcedimento");cs(p,r.interessados,pe(n.pagina.html,"interessado"),"Interessado"),s.push(...so("Interessados",Oe(p).join("; "),Oe(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new S("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let p=n.itensLupa("selAssuntos");cs(p,r.assuntos,pe(n.pagina.html,"assunto"),"Assunto"),s.push(...so("Assuntos",Oe(p).join("; "),Oe(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>Z(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function us(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>ns(o,t,n,i)),anotar:n=>a(i=>Vr(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await $e(o.http,e);return Vr(o,t,{texto:Yn(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await $e(o.http,e);return i?Vr(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>is(o,t,n,i)),marcar:n=>a(i=>kt(o,t,n,i)),desmarcar:n=>a(i=>kt(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>ds(o,t,n,i)),opcoesAtribuicao:()=>Sa(o.http,e),opcoesMarcador:()=>Ma(o.http,e),opcoesAcompanhamento:()=>Ca(o.http,e),formularioDoProcesso:()=>Ia(o,e),processosDoInteressado:(n,i)=>ss(o,n,i)}}var Qe=class extends sr{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function Br(o,e){return`${o}|${e}`}function Gr(o){let e=Re(Qo(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function ms(o){let e=new Qe(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>Qo(o.topo)),r=new Yo(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:lr(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??us(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>os(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await me(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}function fs(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}var jr=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function or(o){return bo(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function bp(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function xp(o){return o.externo&&o.formato!=="circular"}function Nt(o,e){if(!bp(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function Ap(o){let e=bo(o);return e?e.split(" "):[]}function Ep(o){return bo(`${o.titulo} ${o.numero}`)}function yp(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&Nt(o,r)||e.externos&&xp(o)||e.cancelados&&o.cancelado))return!1;let a=Ap(e.texto);if(a.length){let n=Ep(o);if(!a.every(i=>n.includes(i)))return!1}return!0}function gs(o,e,r){let t=new Set;for(let a of o.documentos)yp(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var Te="data-spro-f-oculto";function vs(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function hs(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!vs(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!vs(r));r=r.nextElementSibling);return e}function Pp(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function _t(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=Pp((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),i=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),s=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:bs(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:i,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:s||void 0,link:"",src:"",acoes:[],botoes:[]}}function bs(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function xs(o,e,r,t,a){let n=o.getElementById("divArvore"),i={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return i;let s=new Map(e.map(v=>[v.id,v])),c=[],p=new Set;for(let v of n.querySelectorAll('a[id^="anchor"]')){let h=Ho(v.id,"anchor");if(!h||h===r)continue;let g=s.get(h)??_t(o,h);if(!g)continue;let y=bs(v);c.push({id:h,ancora:v,doc:y===g.pasta?g:{...g,pasta:y}}),y&&p.add(y)}let d=c.map(v=>v.doc),f=or(t),m=gs({documentos:d},t,a),u=new Set;if(f){for(let v of c)if(!m.has(v.id))for(let h of hs(v.ancora))u.add(h)}for(let v of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(v.id))continue;let h=v.id.slice(6);if(i.pastas+=1,!p.has(h)){i.pastasFechadas+=1;continue}if(f&&!m.has(h)){for(let y of hs(v))u.add(y);let g=o.getElementById(`div${h}`);g&&u.add(g)}}for(let v of Array.from(n.querySelectorAll(`[${Te}]`)))u.has(v)||v.removeAttribute(Te);for(let v of u)v.hasAttribute(Te)||v.setAttribute(Te,"1");return i.total=d.length,i.visiveis=d.filter(v=>m.has(v.id)).length,i}function As(o){for(let e of Array.from(o.querySelectorAll(`[${Te}]`)))e.removeAttribute(Te)}function Es(o,e){return o.filter(r=>Nt(r,{unidade:e})).map(r=>({id:r.id,numero:r.numero,titulo:r.titulo}))}function ys(o){let e=new Map;for(let r of o)!r.nrSei||!r.descricao.startsWith(yo.documentoGerado)||e.set(r.nrSei,r.data.slice(0,10));return e}function Ps(o,e){return e?o.map(r=>{let t=e.get(r.numero);return t?{...r,data:t}:r}):[...o]}var Ds="spro-na-nao-assinados",Dp=1e4;function wp(o){let e=o.getElementById("divInfraBarraLocalizacao");if(e)return{pai:e,antes:null};let r=o.getElementById("frmAtividadeListar");return r?.parentElement?{pai:r.parentElement,antes:r}:null}function Sp(o,e){let r=o.getElementById(`anchor${e}`);return r?(r.click(),r.scrollIntoView?.({block:"center"}),!0):!1}function Mp(o,e){let r=new Yo(e.documentos);r.lerDoIframe(o);for(let t of o.querySelectorAll("#divArvore a[id^='anchor']")){let a=Ho(t.id,"anchor");if(!a||r.obter(a))continue;let n=_t(o,a);n&&r.somar(n)}return r.todos()}async function Cp(o,e){let r=o.getElementById(`ancjoin${e}`)??o.getElementById(`anchor${e}`);return r?(r.addEventListener("click",t=>t.preventDefault(),{once:!0,capture:!0}),r.click(),ja(()=>!!o.querySelector(`#div${e} a[id^="anchor"]:not([id*="AGUARDE"])`),Dp)):!1}function ws(o){let e=wp(o.doc);if(!e||o.doc.getElementById(Ds))return null;To(o.doc);let r=l("div",{id:Ds,class:"spro-na",role:"status","aria-live":"polite"});Do(o.doc)&&r.setAttribute("data-tema","escuro"),e.pai.insertBefore(r,e.antes);let t=o.abrirPasta??Cp,a=!1,n=!1,i=!0,s=()=>l("strong",{},o.unidade),c=(u,v,h,...g)=>{r.className=`spro-na ${u}`,r.replaceChildren(l("span",{class:"spro-na-icone","aria-hidden":"true"},$(v,15)),l("span",{},...h),...g)},p=(u,v)=>{let h=l("button",{type:"button",class:"spro-p-link"},u);return h.addEventListener("click",v),h},d=async(u,v)=>{if(!n){n=!0;try{for(let[h,g]of v.entries())c("falha","atualizar",[`Abrindo as pastas da \xE1rvore (${h+1} de ${v.length})...`]),await t(u,g)}finally{n=!1}i=!0,m()}},f=(u,v,h)=>{if(a)return;a=!0;let g=l("ul",{class:"spro-p-lista-modal spro-na-lista","aria-label":"Documentos n\xE3o assinados"}),y=M=>g.replaceChildren(...M.map(P=>{let E=l("button",{type:"button",class:"spro-p-link","aria-label":`Selecionar na \xE1rvore: ${P.titulo} (${P.numero})`},$("documento",14),`${P.titulo} (${P.numero})`);return E.addEventListener("click",()=>{w.fechar(),Sp(v,P.id)}),l("li",{class:"spro-p-linha-modal"},E,P.data?l("span",{class:"spro-na-data"},P.data):null)}));y(u);let b=p("Verificar pastas",()=>{w.fechar(),d(v,h)}),w=J({topo:o.topo,doc:o.doc},{titulo:"Documentos pendentes de assinatura",icone:"caneta",largura:700,conteudo:[l("p",{class:"spro-p-nota"},u.length===1?`Existe 1 documento n\xE3o assinado na unidade ${o.unidade}.`:`Existem ${u.length} documentos n\xE3o assinados na unidade ${o.unidade}.`),g,h.length>0?l("p",{class:"spro-p-nota"},`${h.length===1?"1 pasta fechada n\xE3o foi verificada":`${h.length} pastas fechadas n\xE3o foram verificadas`}: o SEI s\xF3 traz os documentos de uma pasta quando ela \xE9 aberta. `,b):null],aoFechar:()=>{a=!1}});o.datas().then(M=>{M&&w.el.isConnected&&y(Ps(u,M))})},m=()=>{if(n)return;let u=o.quadroDaArvore(),v=u?o.lerArvore(u):null;if(!u||!v){c("falha","alerta",["N\xE3o foi poss\xEDvel verificar os documentos n\xE3o assinados na unidade ",s()],p("Tentar de novo",m));return}let h=Mp(u,v),g=Es(h,o.unidade),y=fs({pagina:v.pagina,documentos:h}),b=y.length===1?"1 pasta fechada ainda n\xE3o foi verificada":`${y.length} pastas fechadas ainda n\xE3o foram verificadas`,w=y.length?p("Verificar pastas",()=>void d(u,y)):null;if(!g.length){w?c("falha","alerta",["Nenhum documento n\xE3o assinado na unidade ",s(),` na \xE1rvore aberta; ${b}`],w):c("ok","check",["Todos os documentos foram assinados na unidade ",s()]);return}c("pendente","alerta",["Existem documentos n\xE3o assinados na unidade ",s()],p("Detalhes",()=>f(g,u,y)),...w?[w]:[]),i&&f(g,u,y),i=!1};return m(),{verificar:m,remover:()=>r.remove()}}function Ms(o){return o!==o.top&&/[?&]acao=procedimento_enviar(&|$)/.test(o.location.search)}function Ss(o){try{return o.getElementById("ifrArvore")?.contentDocument??null}catch{return null}}async function Cs(o=document){if(!o.getElementById("frmAtividadeListar"))return null;let{dataValues:e}=await chrome.storage.sync.get("dataValues");if(!_o(e,$a))return null;let r=ir(),t=Ss(r),a=t?Me(t)??await Ze(t,5e3):null,n=Gr(r);return ws({doc:o,topo:r,quadroDaArvore:()=>Ss(r),lerArvore:i=>Me(i),unidade:n.unidade.sigla,datas:async()=>{if(!a||a.nivel==="sigiloso"||!n.login)return null;let i=new xe(tr(chrome.storage.local,"local"),Br(n.host,n.login),a.idProcedimento),s=await ue({loja:i,agora:()=>new Date,sigiloso:!1});return s?.vale?ys(s.historico.andamentos):null}})}var Ip=90,Is=120,Os=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function Op(o,e){if(!e)return{principal:"",dica:""};let r=o.total===1?"documento":"documentos",t=o.visiveis===0?`Nenhum documento encontrado (${o.total} na \xE1rvore).`:`${o.visiveis} de ${o.total} ${r}`,a=o.pastasFechadas>0?"Pastas fechadas n\xE3o entram: abra-as para filtrar os documentos delas.":"";return{principal:t,dica:a}}function Tp(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},$("fechar",12)),r=new Map;for(let i of Os)r.set(i.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":i.chave,"aria-pressed":"false","aria-label":`${i.rotulo}. ${i.ajuda}`},i.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-dica"});return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},$("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,a)),busca:o,limpar:e,chips:r,status:t,dica:a}}function Ts(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;To(r);let a=Tp(),n={...jr},i={visiveis:0,total:0,pastasFechadas:0,pastas:0},s,c,p=!1,d=()=>{let E=r.getElementById("divArvore");E?.parentElement&&(a.raiz.parentElement!==E.parentElement||a.raiz.nextElementSibling!==E)&&E.parentElement.insertBefore(a.raiz,E)},f=()=>{Do(r)?a.raiz.setAttribute("data-tema","escuro"):a.raiz.removeAttribute("data-tema")},m=()=>{let E=or(n);for(let G of Os)a.chips.get(G.chave)?.setAttribute("aria-pressed",n[G.chave]?"true":"false");a.busca.value!==n.texto&&(a.busca.value=n.texto),a.limpar.hidden=!E;let{principal:I,dica:z}=Op(i,E);(a.status.textContent!==I||a.dica.textContent!==z)&&(a.status.textContent=I,a.dica.textContent=z),a.status.parentElement.hidden=!E,a.raiz.toggleAttribute("data-ativo",E),a.raiz.hidden=i.total===0&&i.pastas===0&&!E},u=()=>(i=xs(r,o.documentos.todos(),o.idProcedimento,n,{unidade:o.unidade.sigla}),m(),i),v=0,h=()=>{if(p)return;d();let E=Date.now();E-v>=Is&&(v=E,u()),clearTimeout(c),c=setTimeout(()=>{p||(v=Date.now(),d(),u())},Is)},g=E=>{n={...n,...E},u()};a.busca.addEventListener("input",()=>{n={...n,texto:a.busca.value},clearTimeout(s),s=setTimeout(()=>{p||u()},Ip)}),a.busca.addEventListener("keydown",E=>{E.key==="Escape"&&or(n)&&(E.preventDefault(),E.stopPropagation(),y())});for(let[E,I]of a.chips)I.addEventListener("click",()=>g({[E]:!n[E]}));let y=()=>{clearTimeout(s),n={...jr},u(),a.busca.focus()};a.limpar.addEventListener("click",y);let b=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,w=r.getElementById("frmArvore")??t.parentElement,M=typeof b=="function"?new b(E=>{a.raiz.isConnected&&E.every(z=>a.raiz.contains(z.target)||z.addedNodes.length+z.removedNodes.length>0&&[...z.addedNodes,...z.removedNodes].every(G=>G===a.raiz))||h()}):null;M?.observe(w,{childList:!0,subtree:!0});let P=fe(r,f);return d(),f(),u(),{estado:()=>({...n}),definir:g,limpar:()=>{clearTimeout(s),n={...jr},u()},reaplicar:u,barra:()=>a.raiz,destruir:()=>{p=!0,clearTimeout(s),clearTimeout(c),M?.disconnect(),P(),As(r),a.raiz.remove()}}}function Lp(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function kp(o){return async()=>{try{return await o()}catch(e){throw new Error(zo(e))}}}function Ls(o){let e=Np(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,kp(t)]))}function Np(o){let e=lr(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await ps(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await $e(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:Lp(o.arv),editavel:!1}:{itens:await wa(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await ya(o.http,o.arv)}:t,atribuicao:async()=>({...Pa(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function Rt(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function ks(o){o.documentElement?.setAttribute(Ta,"1")}function Ns(o){o.documentElement?.setAttribute(La,"1")}function _s(o){o.documentElement?.setAttribute(Na,"1")}function $t(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function Rs(o){o.documentElement?.setAttribute(ka,"1")}function $s(o){o.documentElement?.setAttribute(_a,"1"),o.documentElement?.setAttribute(Ra,"1")}function zt(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var Wr=["Copiar","Abrir","Acoes"],qt={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},Po={tipo:"local"},j=(...o)=>({tipo:"acao",acoes:o}),Fo=(...o)=>({tipo:"funcao",funcoes:o}),Kr=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:Po,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:Po,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:Po,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:Po,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:Po,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:Po,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:Po,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:j("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:j("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:j("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:j("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:j("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:j("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:j("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Fo("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Fo("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Fo("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:j("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Fo("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Fo("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:j("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:j("md_pet_intimacao_cadastrar")}],zs=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:Po},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:Po},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:Po},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:Po},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:Po},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:Po},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:j("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:j("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:j("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:j("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:j("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:j("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:j("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:j("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:j("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:j("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:j("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:j("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:j("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:j("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:j("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:j("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:j("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:j("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Fo("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Fo("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Fo("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Fo("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:j("arvore_ordenar")}],Xr="Ativar menu ao clicar",qs=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],Hs=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],Fs=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],_p={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},Rp=o=>_p[o]??o;function Vs(o,e){let r=Rp(e);return o.find(t=>t.nome===r)}var Sh=Kr.filter(o=>o.modo).map(o=>o.nome);function Us(o){return o.includes(" ")?o.split(" ").pop()??"":""}function Le(o){let e=Us(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function Bs(o){let e=o.trim(),r=Us(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function Gs(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var $p=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),Ht=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Ft=(o,e)=>`<a href="${$p(o)}" target="_blank">${Ht(e)}</a>`,js=o=>({texto:Le(o.rotulo)});function Ws(o){let e=Le(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${Bs(o.rotulo)} (${Gs(o.citacaoOpcao)}${e})`}}var Ks=o=>({texto:o.linkDocumento});function Xs(o){let e=Le(o.rotulo);return{texto:e,html:Ft(o.linkDocumento,e)}}function Ys(o){let e=Le(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:Ft(o.linkDocumento,e)};let r=Bs(o.rotulo),t=Gs(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${Ht(r)} (${Ht(t)}${Ft(o.linkDocumento,e)})`}}var Js=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function Vt(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function Zs(o){return Wr.flatMap(e=>o.filter(r=>r.grupo===e))}function Ut(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===Xr)continue;let i=Vs(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var Qs=(o,e)=>{for(let r of e){let t=eo([...o],r);if(t)return t}return null};function oc(o,e){return e.find(r=>o?.includes(r))??null}var ec={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function zp(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var qp=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function Hp(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:Vt(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(js(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(Ws(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(Ks(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(Xs(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(Ys(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(s?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let d=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!d)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let f=!1;if(/minuta/i.test(e.rotulo)){let m=await t.perguntarMinuta();if(!m)return;f=m==="remover"}await t.duplicar(d,f)}}}default:return{executar:()=>{}}}}function rc(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||Le(e.rotulo))||qp.has(o.id)&&e.id.includes("-")?null:{...t,...Hp(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let d=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(d,zp(e))}:{...t,executar:()=>a.abrirEmNovaAba(d)}}if(i.tipo==="acao"){let d=Qs(n.acoes,i.acoes);return d?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(d)}:{...t,executar:()=>a.abrirNoVisualizador(d)}:null}let s=oc(n.funcoes,i.funcoes);if(!s)return null;let c=ec[s];if(!c)return null;let p=async d=>{let f=await a.linkDaTela(n.link,c);if(!f)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);d==="aba"?a.abrirEmNovaAba(f):a.abrirNoVisualizador(f)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function tc(o,e){let r=[];for(let t of Ut(Kr,e.selecao,qs)){let a=rc(t,o,e);a&&r.push(a)}return Zs(r)}function Yr(o,e,r){let t=[];for(let a of Ut(Kr,r,Fs)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=rc(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function ac(o){let e=o.servicos,r=[],t=Vt(o.base,o.idProcedimento);for(let a of Ut(zs,o.selecao,Hs)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:Js(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=Qs(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=oc(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=ec[s];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return Zs(r)}var er="spro-pm-icone",nc="data-spro-pm-sig",ic=["breackline_doc"];function Fp(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function Vp(o,e){return l("span",{class:`action-doc action-${o.modo} ${er}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},$(o.icone,13))}function Up(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(er))a.push(i);else{if(ic.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(nc)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&ic.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=Vp(i,e);s.setAttribute(nc,t),n.after(s),n=s}return!0}function sc(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=Ho(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let d=r(p,Fp(c)),f=Yr(d,i,s);Up(c,p,f)&&(n+=1)}return n}function cc(o){for(let e of o.querySelectorAll(`.${er}`))e.remove()}function lc(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let p=m=>{if(m.getAttribute("aria-busy")==="true")return;let u=m.getAttribute("data-id")??"",v=m.getAttribute("data-action")??"";m.setAttribute("aria-busy","true");let h=()=>{m.removeAttribute("aria-busy"),m.classList.add("feito"),setTimeout(()=>m.classList.remove("feito"),900)};Promise.resolve(e(u,v)).catch(g=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",g)).finally(h)},d=m=>{let u=m.target?.closest?.(`.${er}`);u&&(m.preventDefault(),m.stopPropagation(),p(u))},f=m=>{if(m.key!=="Enter"&&m.key!==" ")return;let u=m.target?.closest?.(`.${er}`);u&&(m.preventDefault(),p(u))};return o.addEventListener("click",d,!0),o.addEventListener("keydown",f,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",d,!0),o.removeEventListener("keydown",f,!0)}}function pc(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=m=>{let u=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${m.perigo?" spro-menu-perigo":""}${m.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":m.id,...m.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},$(m.icone,15)),l("span",{class:"spro-menu-rotulo"},m.rotulo),m.dica?l("span",{class:"spro-menu-dica"},m.dica):null);return u.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),!m.desativado&&(d(!0),r.aoEscolher(m))}),n.push(u),u};for(let m of Wr){let u=e.filter(v=>v.grupo===m);u.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":qt[m]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},qt[m]),...u.map(s)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=m=>{if(!n.length)return;let u=(m+n.length)%n.length;for(let[v,h]of n.entries())h.setAttribute("tabindex",v===u?"0":"-1");n[u]?.focus?.({preventScroll:!0})};for(let m of n)m.addEventListener("pointermove",()=>c(n.indexOf(m)));let p=hr(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>d(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function d(m){if(i)return;i=!0;let u=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",f,!0),(m||u)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function f(m){if(m.key==="Escape"){m.preventDefault(),m.stopPropagation(),d(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let u=n.findIndex(v=>v.getAttribute("tabindex")==="0");switch(m.key){case"ArrowDown":c(u+1);break;case"ArrowUp":c(u-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[u]?.click();break;case"Tab":d(!0);return;default:return}m.preventDefault(),m.stopPropagation()}return t.addEventListener("keydown",f,!0),r.focar&&c(0),{el:a,fechar:()=>d(!1)}}async function uc(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new S("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function Bp(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?ie[r.nivel]:n;if(r.nivel&&(a.push(...so("N\xEDvel de acesso",se[n]??"",se[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new S("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await ce(o,e,i,t),c=le(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function Gp(o,e,r){let t=await uc(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=eo(t.documento.acoes,a)??eo(t.documento.acoes,/^documento_alterar/);if(!n)throw new S("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await K.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function jp(o,e,r){let t=io(e,"documento_escolher_tipo");if(!t)throw new S("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await K.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=K.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function Wp(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,T(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=Z(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,T(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Kp(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await jp(o,e,t),i=Wp(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new S("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:le(i,r,"Tipo de documento")}}async function Xp(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=K.de(s,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),d=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(d?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let h=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(y=>y.valor===h&&y.valor!=="null"))throw new S("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${h}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:h,hdnIdTextoPadrao:h})}else if(n.textoPadrao){let h=c.opcoes("selTextoPadrao").filter(y=>y.valor!=="null").map(y=>({id:y.valor,texto:y.texto})),g=le(h,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:g.id,hdnIdTextoPadrao:g.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await Bp(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let f=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:h=>/acao_origem=documento_(?:gerar|cadastrar)/.test(h.url)||/editor_montar/.test(h.html)}),m=Z(f.url).get("id_documento")??/id_documento=(\d+)/.exec(f.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:m,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let v=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(h=>h.id===m);return{idDocumento:m,numero:v?.numero??"",titulo:v?.titulo??""}}function dc(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var Yp=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function mc(o,e,r,t={}){let a=await uc(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new S("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await Gp(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new S("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",d=p==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(b=>b.selecionada&&b.valor!=="null")?.valor)??void 0:void 0,f=i.valor("hdnIdSerie")??"";if(!f)throw new S("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:m,tipo:u}=await Kp(o,n.arvore,f,r.sinal,!0),v={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${u.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...v,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:h,numero:g,titulo:y}=await Xp(o,e,n.arvore,m,u,{tipo:u.id,descricao:t.semMinuta?dc(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:Yp(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?dc(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:p,hipotese:d},r.sinal);return{...v,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${y||u.texto} ${g?`(${g}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:h,numero:g}}}var Jp="seipro-processo-menu",Bt="data-spro-pm-pedido";async function Zp(o,e){if(!e.html)return ft(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function fc(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function gc(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>Q(e,i,s),n=(i,s,c)=>new Promise(p=>{let d=null,f=J(e,{titulo:i,icone:"alerta",largura:420,conteudo:[l("p",{},s),co(...c.map(m=>m.principal?mo(m.rotulo,()=>{d=m.id,f.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{d=m.id,f.fechar()}},m.rotulo)))],aoFechar:()=>p(d)})});return{async copiar(i,s){let c=await Zp(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=fc(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=l("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=l("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await mc(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(Ao(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),p=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(Bt,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(Jp)),r.documentElement.hasAttribute(Bt)&&(r.documentElement.removeAttribute(Bt),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await qr(e,"URGENTE")},clicarBotaoNativo(i){for(let s of fc(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var Qp="configViewFlashMenuPro",od="configViewFlashDocMenuPro",ed="configViewFlashDocArvorePro";function vc(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;To(r);let n=new Yo(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new Qe(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>Qo(e.topo)),c=o.servicos??gc({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,d=()=>!!io(i(),"documento_escolher_tipo"),f=x=>({selecao:x,citacao:ar(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:d(),uploadLigado:_o(o.dataValues,"uploaddocsexternos"),loteLigado:_o(o.dataValues,"acoesemlote"),servicos:c}),m=()=>Ir(e.armazenamento,od),u=()=>Ir(e.armazenamento,Qp),v=()=>Ir(e.armazenamento,ed),h=()=>m()?.includes(Xr)??!1,g=(x,D)=>{let _=n.obter(x);return _||(n.lerDoIframe(r),_=n.obter(x)),{id:x,rotulo:D,dado:_}},y={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},b=x=>{let D=x;if(!D?.closest)return null;let _=D.closest('a[id^="anchorImg"]');if(_){let H=Ho(_.id,"anchorImg");return H&&H!==e.arv.idProcedimento&&je(e.armazenamento,"menudoc")?{tipo:"documento",ancora:_,id:H}:null}let V=D.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return V&&je(e.armazenamento,"menuproc")?{tipo:"processo",ancora:V}:null},w=x=>{if(x.tipo==="processo")return{itens:ac(f(u())),rotulo:"Menu do processo"};let D=r.getElementById(`anchor${x.id}`),_=g(x.id,(D?.textContent??"").replace(/\s+/g," ").trim());return{itens:tc(_,f(m())),rotulo:"Menu do documento"}},M=null,P=null,E,I=()=>{clearTimeout(E),P&&clearTimeout(P.timer),P=null;let x=M;M=null,x?.menu.fechar()},z=(x,D)=>{if(M?.ancora===x.ancora)return;I();let{itens:_,rotulo:V}=w(x);if(!_.length)return;let H=pc(x.ancora,_,{rotulo:V,escuro:Do(r),focar:D,rodape:[y],aoFechar:()=>{M?.menu===H&&(M=null)},aoEscolher:W=>{Promise.resolve().then(()=>W.executar()).catch(ro=>{console.warn("[SEI Pro] menu da \xE1rvore:",ro),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});M={menu:H,ancora:x.ancora},H.el.addEventListener("mouseenter",()=>clearTimeout(E)),H.el.addEventListener("mouseleave",()=>G())},G=()=>{clearTimeout(E),E=setTimeout(I,a)},B=x=>{let D=x;return D?!!(M&&(M.ancora.contains(D)||M.menu.el.contains(D))||P?.ancora.contains(D)):!1},A=x=>{if(B(x.target)){clearTimeout(E);return}let D=b(x.target);if(P&&(clearTimeout(P.timer),P=null),!D||D.tipo==="documento"&&h()){M&&G();return}M&&G(),P={ancora:D.ancora,timer:setTimeout(()=>{P=null,z(D,!1)},t)}},L=x=>{x.relatedTarget||(P&&(clearTimeout(P.timer),P=null),M&&G())},O=x=>{let D=b(x.target);if(D){if(D.tipo==="documento"&&h()){x.preventDefault(),x.stopImmediatePropagation(),M?.ancora===D.ancora?I():z(D,!1);return}D.tipo==="documento"&&M?.ancora===D.ancora&&I()}},N=x=>{let D=b(x.target);!D||!(x.key==="ArrowDown"||(x.key==="Enter"||x.key===" ")&&D.tipo==="documento"&&h())||(x.preventDefault(),x.stopImmediatePropagation(),z(D,!0))};r.addEventListener("mouseover",A),r.addEventListener("mouseout",L),r.addEventListener("click",O,!0),r.addEventListener("keydown",N,!0);let X=null,U=()=>{if(!je(e.armazenamento,"iconstree")){cc(r);return}sc(r,e.arv.idProcedimento,g,()=>f(m()),v)};je(e.armazenamento,"iconstree")&&(X=lc(r,async(x,D)=>{let _=r.getElementById(`anchor${x}`),V=g(x,(_?.textContent??"").replace(/\s+/g," ").trim());await Yr(V,f(m()),v()).find(W=>W.modo===D)?.executar()},U),U());let k=n.acompanharPastas(r,()=>setTimeout(U,80)),F=fe(r,()=>{M&&(Do(r)?M.menu.el.setAttribute("data-tema","escuro"):M.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(x,D=!1){let _=Ho(x.id,"anchorImg");if(_)return z({tipo:"documento",ancora:x,id:_},D);z({tipo:"processo",ancora:x},D)},atual:()=>M?.menu??null,parar(){I(),r.removeEventListener("mouseover",A),r.removeEventListener("mouseout",L),r.removeEventListener("click",O,!0),r.removeEventListener("keydown",N,!0),X?.(),k(),F()}}}var rd='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function hc(o,e,r){for(let t of o.querySelectorAll(rd)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function bc(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(hc(o.doc,"urgentePro",So(t.valor.especificacao,"URGENTE")),o.usaTrancado&&hc(o.doc,"trancadoPro",So(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function xc(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var td=["dadosProcesso","marcador"],ad=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Ac(o,e){let r=null,t=s=>{let c=xc(s);c===null?o.documentElement?.removeAttribute(gr):o.documentElement?.setAttribute(gr,c)},a=()=>{e().then(s=>{if(!(!s||s.sigiloso))for(let c of td)s.loja.ler(c).estado!=="pronto"&&s.recarregar(c)}).catch(s=>console.warn("[SEI Pro] capa do processo:",s))},n=()=>{if(r)return;let s=new AbortController;r=s,t({fase:"coletando",feito:0,total:0}),e().then(async c=>{if(!c||c.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await me(c,{sinal:s.signal,aoProgresso:(p,d)=>t({fase:"coletando",feito:p,total:d})}),t("pronto")}).catch(c=>{ad(c)||s.signal.aborted?t({fase:"parada"}):t({fase:"erro",mensagem:zo(c)})}).finally(()=>{r=null})},i=()=>r?.abort();return o.addEventListener(ur,a),o.addEventListener(mr,n),o.addEventListener(fr,i),()=>{o.removeEventListener(ur,a),o.removeEventListener(mr,n),o.removeEventListener(fr,i)}}function nd(o,e){let r=o.replace(/\s+/g," ").trim();return r?`${r} | SEI - Processo ${e}`:`SEI - Processo ${e}`}function Ec(o){if(o.sigiloso||o.consultasDesativadas)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;if(!t||!t.disponivel)return;let a=nd(t.valor.especificacao,o.protocolo);o.topo.title!==a&&(o.topo.title=a)},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}var Gt=null;on(`${Xt}
${na}`);$t(window)&&(Rs(document),$s(document));Rt(window)&&(ks(document),Ns(document),_s(document));var yc=window;if(!yc.__seiProProcessoPaineis&&Rt(window)&&!zt(window)){yc.__seiProProcessoPaineis=!0,Cn(document,jt),Ac(document,jt);let o=()=>void sd().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}if(Ms(window)&&!zt(window)){let o=()=>void Cs().catch(e=>console.warn("[SEI Pro] aviso de n\xE3o assinados:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function jt(){return Gt??=id().catch(o=>{throw Gt=null,o}),Gt}async function id(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await Ze(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=ir(),t=Gr(r),a=e.nivel==="sigiloso",n=new xe(tr(chrome.storage.local,"local"),Br(t.host,t.login),e.idProcedimento,{sigiloso:a}),i=Ne(location.href),s=nr(o,"disablequery"),c=Ls({http:i,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:s});return ms({doc:document,topo:r,arv:e,loja:n,...t,habilitados:kn($n(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:nr(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:p=>{let d=c[p];d&&n.carregar(p,d)}})}async function sd(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=_o(o,"infoarvore")&&zn(localStorage),r=_o(o,"menurapido"),t=_o(o,za),a=!nr(o,"disablequery")&&$t(window.top);if(!e&&!r&&!t&&!a)return;let n=await jt();if(n){if(a&&!n.sigiloso&&(Ec(n),e||n.recarregar("dadosProcesso")),e){ji(n),bc(n);let i=new Set(Gi(n));a&&!n.sigiloso&&i.add("dadosProcesso");for(let s of i)n.recarregar(s);Oa(n).catch(()=>{})}r&&vc({ctx:n,dataValues:o,http:Ne(location.href)}),t&&Ts(n)}}})();
