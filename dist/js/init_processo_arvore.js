/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function ba(o){let r={};for(let[e,a]of Object.entries(o)){let t={};a&&"newValue"in a&&(t.novo=a.newValue),a&&"oldValue"in a&&(t.antigo=a.oldValue),r[e]=t}return r}function rr(o,r){return{obter:(e=null)=>o.get(e),gravar:e=>o.set(e),remover:e=>o.remove(e),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(e){let a=(t,n)=>{n===r&&e(ba(t))};return chrome.storage.onChanged.addListener(a),()=>chrome.storage.onChanged.removeListener(a)}}}function er(o,r){let e=o;if(typeof o=="string"){if(!o.trim())return;try{e=JSON.parse(o)}catch{return}}return!Array.isArray(e)||e.length===0?void 0:e.map(t=>t?.configGeral).find(Array.isArray)?.find(t=>t?.name===r)?.value}function ar(o,r){let e=er(o,r);return!(e===!1||e===0||e==="")}function To(o,r){let e=er(o,r);return e===!0||e===1||e==="1"}var tr=`/*
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
`;var Aa={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function V(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(r,e)=>{let a=e[0]==="#"?e[1]==="x"||e[1]==="X"?parseInt(e.slice(2),16):parseInt(e.slice(1),10):Aa[e];return a===void 0||Number.isNaN(a)?r:String.fromCodePoint(a)}):o}var nr={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var ya={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function _o(o,r="texto"){let e="";for(let a of o){let t=a.codePointAt(0);if(t<=255){e+=a;continue}let n=ya[a];if(r==="html"){e+=n===""?"":`&#${t};`;continue}if(n!==void 0){e+=n;continue}let i=a.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");e+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return e}var Ea=/[A-Za-z0-9\-_.*]/;function ir(o){let r="";for(let e of o)e===" "?r+="+":Ea.test(e)?r+=e:r+="%"+e.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return r}function sr(o,r={}){return o.map(([e,a])=>{let t=r[e]??"texto";return`${ir(_o(e))}=${ir(_o(a??"",t))}`}).join("&")}function cr(o){let r=e=>encodeURIComponent(_o(e)).replace(/%20/g,"+");return o.map(([e,a])=>`${r(e)}=${r(a??"")}`).join("&")}var pr="application/x-www-form-urlencoded";function No(o){let r=o instanceof Uint8Array?o:new Uint8Array(o),e=[],a=16384;for(let t=0;t<r.length;t+=a){let n=r.subarray(t,t+a),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=nr[n[s]]??n[s];e.push(String.fromCharCode(...i))}return e.join("")}var lr="application/x-www-form-urlencoded; charset=ISO-8859-1";var dr=null;function Y(o){return dr?dr(o):new DOMParser().parseFromString(o,"text/html")}function v(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var f=class extends Error{codigo;detalhe;constructor(r,e,a){super(e),this.name="ErroSei",this.codigo=r,this.detalhe=a}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Lo(o){if(o instanceof f)return o;if(o instanceof DOMException&&o.name==="AbortError")return new f("CANCELADO","Opera\xE7\xE3o cancelada.");let r=o instanceof Error?o.message:String(o);return new f("SEI_REDE",`Falha ao falar com o SEI: ${r}`)}function ur(o,r,e){let a=null;return{url:o,status:r,html:e,get doc(){return a??=Y(e)}}}function mr(o,r={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new f("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new f("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let e=o.doc.querySelector("#divInfraExcecao");if(e){let a=v(e);throw new f("SEI_EXCECAO",a||"O SEI exibiu uma p\xE1gina de erro.",a)}}if(!r.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let e=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(e)throw new f("SEI_VALIDACAO",e,e)}return o}function mo(o,r={}){let e=new URL(".",o),a=r.fetch??((...u)=>fetch(...u)),t=Math.max(1,r.concorrencia??3),n=0,i=[];async function s(u){n>=t&&await new Promise(m=>i.push(m)),n+=1;try{return await u()}finally{n-=1,i.shift()?.()}}let c=u=>new URL(u.replace(/&amp;/g,"&"),e).href;async function l(u,m,g){return s(async()=>{try{let h=await a(c(u),{credentials:"same-origin",redirect:"follow",...m,signal:g.sinal}),A=No(await h.arrayBuffer());return mr(ur(h.url||c(u),h.status,A),g)}catch(h){throw Lo(h)}})}async function d(u,m={}){return s(async()=>{try{let g=await a(c(u),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),h=new Uint8Array(await g.arrayBuffer()),A=(g.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();A==="text/html"&&mr(ur(g.url||c(u),g.status,No(h)),m);let N=g.headers?.get("content-disposition")??"",T=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(N)?.[1]??/filename="?([^";]+)"?/i.exec(N)?.[1]??"");return{bytes:h,tipo:A,nome:T}}catch(g){throw Lo(g)}})}return{base:e,absoluta:c,baixar:d,obter:(u,m={})=>l(u,{method:"GET"},m),enviar:(u,m,g={})=>l(u,g.utf8?{method:"POST",headers:{"Content-Type":pr},body:cr(m)}:{method:"POST",headers:{"Content-Type":lr},body:sr(m,g.modos)},g)}}function eo(o,r=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:r,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function fr(){try{return window.top?.document??document}catch{return document}}var gr=`/*
 * Pain\xE9is abaixo da \xE1rvore do processo (op\xE7\xE3o A da spec: lista refinada) e seus modais.
 * As cores v\xEAm dos tokens --spro-* de sei-comum/src/ui/base.css (anexado antes deste arquivo). O escuro vem de
 * data-tema="escuro" na raiz dos pain\xE9is e no di\xE1logo (o quadro e a janela de topo s\xE3o documentos diferentes).
 */
/* Os tokens do base.css seguem o esquema de cores do SISTEMA quando ninguem fixou o tema; aqui o tema e o do SEI
   (claro por padrao, escuro quando o SEI esta escuro), nunca o do sistema operacional. */
.spro-p-raiz,
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
.spro-p-raiz[data-tema="escuro"],
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
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-texto);
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
  padding: 8px 6px 8px 4px;
  border-top: 1px solid var(--spro-borda);
}
.spro-p-painel > header {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 24px;
}
.spro-p-painel > header h3 {
  flex: 1;
  min-width: 0;
  margin: 0;
  font: inherit;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.01em;
  color: var(--spro-texto);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.spro-p-icone {
  display: inline-flex;
  flex: none;
  color: var(--spro-destaque);
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
  width: 22px;
  height: 22px;
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
  padding: 4px 0 0 21px;
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
  color: var(--spro-texto);
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
.spro-p-marcador-icone {
  width: 14px;
  height: 14px;
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
  font-size: 11.5px;
}
.spro-p-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 1px 7px;
  font-size: 11px;
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
  font-size: 11.5px;
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
.spro-p-post-it {
  display: grid;
  gap: 2px;
  padding: 7px 9px;
  background: color-mix(in srgb, var(--spro-estrela) 14%, var(--spro-fundo));
  border: 1px solid color-mix(in srgb, var(--spro-estrela) 38%, var(--spro-borda));
  border-radius: var(--spro-raio);
}
.spro-p-post-it.prioridade {
  border-left: 3px solid var(--spro-perigo);
}
.spro-p-post-it .spro-p-chip {
  justify-self: start;
  margin-top: 3px;
}
.spro-p-nota-linha {
  min-height: 1.2em;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}
.spro-p-nota-linha.item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  cursor: pointer;
  white-space: normal;
}
.spro-p-nota-linha.item.feito span {
  color: var(--spro-fraco);
  text-decoration: line-through;
}
.spro-p-nota-linha.item input {
  flex: none;
  margin: 2px 0 0;
  accent-color: var(--spro-destaque);
}

/* ---------- Esqueleto e erro ---------- */
.spro-p-esqueleto {
  display: grid;
  gap: 6px;
  padding: 3px 0;
}
.spro-p-barra {
  display: block;
  height: 10px;
  background: linear-gradient(90deg, var(--spro-fundo-3) 25%, var(--spro-fundo-2) 50%, var(--spro-fundo-3) 75%);
  background-size: 200% 100%;
  border-radius: 5px;
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
  font-size: 11.5px;
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
.spro-p-lista {
  padding: 4px;
}
.spro-p-lista option {
  padding: 4px 8px;
  border-radius: var(--spro-raio-p);
}
.spro-p-busca {
  display: grid;
  gap: 6px;
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
.spro-p-anotacao {
  width: 100%;
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
`;async function vr(o,r){if(o.chaves){let a=(await o.chaves()).filter(t=>t.startsWith(r));return a.length?o.obter(a):{}}let e=await o.obter(null);return Object.fromEntries(Object.entries(e).filter(([a])=>a.startsWith(r)))}var hr="data-seipro-processo-paineis";var fo="processo/",br=(o,r)=>`${fo}${o}/${r}`,xr=o=>{let r=o.indexOf("|");return r>0&&r<o.length-1};var yr=0,Er=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",go=class{constructor(r,e,a){this.area=r;this.escopo=e;this.id=a}get chave(){return br(this.escopo,this.id)}async ler(){try{let r=(await this.area.obter(this.chave))[this.chave];return Er(r)?r:null}catch{return null}}async gravar(r){if(!xr(this.escopo))return!1;try{if(JSON.stringify(r).length>65536)return!1;await this.area.gravar({[this.chave]:r})}catch{return!1}return yr+=1,await Da(this.area,yr%25===0),!0}};async function Da(o,r=!1){try{if(o.chaves&&!r&&(await o.chaves()).filter(s=>s.startsWith(fo)).length<=200)return 0;let e=await vr(o,fo),a=Object.entries(e).filter(([,i])=>Er(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),t=[],n=0;a.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&t.push(i.k)});for(let i of Object.keys(e))a.some(s=>s.k===i)||t.push(i);return t.length&&await o.remover(t),t.length}catch{return 0}}var Ca=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",vo=class{sigiloso;agora;esperar;repo;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(r,e,a,t={}){this.repo=new go(r,e,a),this.agora=t.agora??Date.now,this.esperar=t.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=t.sigiloso??!1}ler(r){return this.fatias.get(r)??{estado:"carregando",em:0}}definir(r,e){this.fatias.set(r,e);for(let a of[...this.ouvintes])try{a(r)}catch{}if(e.estado==="pronto"&&e.dado!==void 0){let a=e.dado;this.gravando=this.gravando.then(()=>this.guardar(r,a,e.em)).catch(()=>{})}}aoMudar(r){return this.ouvintes.add(r),()=>this.ouvintes.delete(r)}carregar(r,e,a={}){let t=this.emAndamento.get(r);if(t)return t;let n=this.executar(r,e,Math.max(1,a.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(r));return this.emAndamento.set(r,n),n}enfileirar(r){let e=this.fila.then(r,r);return this.fila=e.catch(()=>{}),e}async executar(r,e,a){let t=this.ler(r),n={dado:t.dado,em:t.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[r];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(r,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(r,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<a;s++){s>0&&await this.esperar(400*s);try{let c=await e();this.definir(r,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(r,{estado:"erro",dado:n.dado,erro:Ca(i),em:this.agora()})}carregarCache(){return this.cache??=this.repo.ler().then(r=>(r&&(this.espelho=r),r)),this.cache}async guardar(r,e,a){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:a,fatias:{...this.espelho.fatias,[r]:{dado:e,em:a}}},await this.repo.gravar(this.espelho)))}};var Ro=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],ka={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},Ta=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Pr(o){let r=new Set(o?.length?o:Ta),e=new Set(["descricao"]);for(let[a,t]of Object.entries(ka))r.has(t)&&e.add(a);return e}var wr=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),$o={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};function p(o,r={},...e){let a=document.createElement(o);for(let[t,n]of Object.entries(r))n===void 0||n===!1||(typeof n=="function"?a.addEventListener(t.replace(/^on/,""),n):n===!0?a.setAttribute(t,""):t==="class"?a.className=n:t==="value"&&o==="textarea"?a.value=n:a.setAttribute(t,n));for(let t of e)t!=null&&t!==!1&&a.append(t);return a}var z={fill:"currentColor",stroke:"none"},Sr="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Or={estrela:[["path",{d:Sr}]],estrelaCheia:[["path",{d:Sr,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...z}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...z}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...z}],["circle",{cx:"12",cy:"12",r:"1.4",...z}],["circle",{cx:"19",cy:"12",r:"1.4",...z}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...z}],["circle",{cx:"15",cy:"6",r:"1.3",...z}],["circle",{cx:"9",cy:"12",r:"1.3",...z}],["circle",{cx:"15",cy:"12",r:"1.3",...z}],["circle",{cx:"9",cy:"18",r:"1.3",...z}],["circle",{cx:"15",cy:"18",r:"1.3",...z}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},Vt=Object.keys(Or);function b(o,r=18,e=document){let a="http://www.w3.org/2000/svg",t=e.createElementNS(a,"svg"),n={viewBox:"0 0 24 24",width:String(r),height:String(r),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))t.setAttribute(i,s);for(let[i,s]of Or[o]){let c=e.createElementNS(a,i);for(let[l,d]of Object.entries(s))c.setAttribute(l,d);t.append(c)}return t}var _a={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function ao(o,r){let e=o[r],a="";for(r+=1;r<o.length;){let t=o[r];if(t==="\\"){let n=o[r+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(r+2,r+6))){a+=String.fromCharCode(parseInt(o.slice(r+2,r+6),16)),r+=6;continue}a+=_a[n]??n,r+=2;continue}if(t===e)return[a,r+1];a+=t,r+=1}return[a,r]}function zo(o,r){let e=[],a=r;for(;a<o.length;){let t=o[a];if(t===")")return[e,a+1];if(t===","||/\s/.test(t)){a+=1;continue}if(t==='"'||t==="'"){let[s,c]=ao(o,a);e.push(s),a=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(a,a+32));if(n){let s=n[1];e.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),a+=s.length;continue}let i=0;for(;a<o.length;){let s=o[a];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;a+=1}e.push(null)}return[e,a]}function E(o){return typeof o=="string"?V(o):o==null?"":String(o)}var Na=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function U(o){let r=new Set;for(let e of o.replace(/&amp;/g,"&").matchAll(Na))r.add(e[0]);return[...r]}function R(o){let r=o.indexOf("?");return new URLSearchParams(r>=0?o.slice(r+1):"")}function _(o,r,e={}){let a=Array.isArray(o)?o:U(o);for(let t of a){let n=R(t),i=n.get("acao")??"";if(!(typeof r=="string"?i!==r:!r.test(i))&&Object.entries(e).every(([s,c])=>n.get(s)===c))return t}return null}function Dr(o,r){let e=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),a=U(e).filter(i=>R(i).get("acao")===r),n=(a.length?a:U(o.html).filter(i=>R(i).get("acao")===r)).sort((i,s)=>[...R(i).keys()].length-[...R(s).keys()].length)[0];if(!n)throw new f("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${r}" para este usu\xE1rio.`);return n}function La(o){let r=new Map;for(let e of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[a]=zo(o,e.index+e[0].length);r.set(Number(e[1]),{indice:Number(e[1]),args:a,props:{}})}for(let e of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let a=r.get(Number(e[1]));if(!a)continue;let[t]=ao(o,e.index+e[0].length-1);a.props[e[2]]=t}return[...r.values()].sort((e,a)=>e.indice-a.indice)}function Ra(o){let r=[];for(let e of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[a]=zo(o,e.index+e[0].length);r.push({tipo:E(a[0]),idPai:E(a[2]),href:E(a[3]),titulo:E(a[5]),icone:E(a[6]),extra:a[8]==null?void 0:E(a[8])})}return r}function Mr(o,r){let e=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===r);if(!e)return{nivel:"publico"};let[a,...t]=e.titulo.split(`
`);return{nivel:/sigilos/i.test(a)||/sigiloso/.test(e.icone)?"sigiloso":"restrito",hipotese:t.join(" ").trim()||void 0}}function Ir(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(r=>E(r[1])))]}var $a=/\s*\(\d{5,}\)\s*$/;function qo(o){let r=o.html,e=La(r),a=Ra(r),t=e.find(c=>c.args[0]==="PROCESSO");if(!t)throw new f("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=E(t.args[1]),i=Mr(a,n),s=e.filter(c=>c.args[0]==="DOCUMENTO").map(c=>{let l=E(c.args[1]),d=E(c.args[5]),u=E(c.args[7]),m=(c.props.src??"").replace(/&amp;/g,"&"),g=a.find(T=>T.tipo==="ASSINATURA"&&T.idPai===l),{nivel:h,hipotese:A}=Mr(a,l),N=(/documento_([a-z0-9]+)\.svg/.exec(u)?.[1]??"interno").replace("cancelado","interno");return{id:l,numero:E(c.args[15])||(/\((\d{5,})\)\s*$/.exec(d)?.[1]??""),titulo:d.replace($a,""),pasta:c.args[2]&&String(c.args[2]).startsWith("PASTA")?String(c.args[2]):null,externo:/documento_download_anexo/.test(m)||!/documento_interno|documento_cancelado|formulario|email/.test(u),formato:N,nivel:h,hipotese:A,assinado:!!g,assinaturas:g?g.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(u),unidadeGeradora:a.find(T=>T.tipo==="UNIDADE_GERADORA"&&T.idPai===l)?.extra,link:E(c.args[3]).replace(/&amp;/g,"&"),src:m,acoes:U(c.props.acoes??""),botoes:Ir(c.props.acoes??"")}});return{idProcedimento:n,protocolo:E(t.args[5])||E(t.args[15]),tipo:E(t.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:a.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:U(t.props.acoes??""),botoesProcesso:Ir(t.props.acoes??""),linkProcesso:E(t.args[3]).replace(/&amp;/g,"&"),sinais:a.filter(c=>c.idPai===n),links:U(r),pagina:o}}async function Cr(o,r,e){let a=await o.obter(r,e);if(!/acao=procedimento_visualizar/.test(a.url)){let t=a.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!t)throw new f("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");a=await o.obter(t,e)}if(/infraArvoreNo\("PASTA"/.test(a.html)){let t=_(a.html,"procedimento_visualizar")&&U(a.html).find(n=>/abrir_pastas=1/.test(n));t&&(a=await o.obter(t,e))}return qo(a)}function q(o,r,e){if(e){let a=o.documentos.find(t=>t.id===e);return a?_(a.acoes,r):null}return _(o.acoesProcesso,r)??_(o.links,r,{id_procedimento:o.idProcedimento})}function K(o){return p("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:r=>{r.preventDefault(),r.stopPropagation(),o.aoClicar()}},b(o.icone,14))}function kr(o){let r=p("div",{class:"spro-p-acoes"}),e=p("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),a=b("chevron",14),t=p("button",{type:"button",class:"spro-p-alternar","aria-controls":e.id,"aria-label":`Recolher ou expandir ${o.titulo}`},a),n=p("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},p("header",{},p("span",{class:"spro-p-icone","aria-hidden":"true"},b(o.icone,15)),p("h3",{},o.titulo),r,t),e),i=s=>{n.toggleAttribute("data-recolhido",!s),t.setAttribute("aria-expanded",String(s)),e.hidden=!s};return i(o.aberto),t.addEventListener("click",()=>{let s=n.hasAttribute("data-recolhido");i(s),o.aoAlternar(s)}),{el:n,definirAberto:i,atualizar(s,c){n.setAttribute("data-estado",s),r.replaceChildren(...(c.acoes??[]).map(K)),e.replaceChildren(...c.corpo.filter(l=>l!=null&&l!==!1))}}}function Tr(o){let r=o.documentElement?.getAttribute("data-spro-tema");return r==="claro"||r==="escuro"?r:null}var _r="spro-processo-estilo",Ho="";function Nr(o){Ho=o}function ho(o){if(!Ho||o.getElementById(_r))return;let r=o.createElement("style");r.id=_r,r.textContent=Ho,(o.head??o.documentElement).append(r)}function to(o){let r=Tr(o);return r?r==="escuro":o.body?.classList.contains("dark-mode")??!1}function Lr(o,r){let e=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof e!="function")return()=>{};let a=new e(r);return o.documentElement&&a.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&a.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>a.disconnect()}var za="configViewFlashPanelArvorePro",Rr="optionsPro";function $r(o,r){try{let e=o.getItem(r);return e?JSON.parse(e):null}catch{return null}}function zr(o){let r=$r(o,za);if(!Array.isArray(r)||!r.length)return null;let e=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return e.length?e:null}function Fo(o){let r=$r(o,Rr);return r&&typeof r=="object"&&!Array.isArray(r)?r:{}}function qr(o){return Fo(o).optionsFlashMenu_panelinfo!=="disabled"}function Hr(o,r){return Fo(o)[`panelDadosArvorePro_${r}`]!=="hide"}function Fr(o,r,e){try{let a=Fo(o);a[`panelDadosArvorePro_${r}`]=e?"visible":"hide",o.setItem(Rr,JSON.stringify(a))}catch{}}var qa=/[\u0300-\u036f]/g,Vo=o=>o.normalize("NFD").replace(qa,""),jo=o=>Vo(o).toLowerCase().replace(/\s+/g," ").trim(),no=o=>String(o).padStart(2,"0"),bo=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Vr=/(\d{1,2}):(\d{2})/;function io(o){let r=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),e=Vo(r),a=e.length===r.length?e:r,t=bo.exec(a);if(!t)return{prazo:null,texto:r};let n=Vr.exec(a.slice(t.index+t[0].length))??Vr.exec(a),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(a),s=`${t[3]}-${no(Number(t[2]))}-${no(Number(t[1]))}`,c=n?`${no(Number(n[1]))}:${n[2]}`:"23:59",l=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(a),d=l?`${r.slice(0,l.index)} ${r.slice(l.index+l[0].length)}`.replace(/[ \t]{2,}/g," ").trim():r;return{prazo:{data:s,hora:c,vencimento:i},texto:d}}function Ur(o){let r=o.texto.trim();if(!o.prazo)return r;let[e,a,t]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${t}/${a}/${e} ${o.prazo.hora||"23:59"}`;return r?`${n}
${r}`:n}var Ha=864e5;function Z(o,r){let[e,a,t]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(e??1970,(a??1)-1,t??1,n??23,i??59),c=new Date(r.getFullYear(),r.getMonth(),r.getDate()),l=new Date(s.getFullYear(),s.getMonth(),s.getDate()),d=Math.round((l.getTime()-c.getTime())/Ha);return d===0?{rotulo:s.getTime()<r.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<r.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function xo(o){let[r,e,a]=o.data.split("-");return`${a}/${e}/${r}`}function Br(o){let r=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!r?.[1])return null;let e=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(r[1].replace(/\\n/g," "));if(!e?.[1]||e[2]===void 0)return null;let a=e[2].toLowerCase(),t=a.startsWith("atrasado")?"vencido":a.startsWith("conclu")?"concluido":"ok";return{data:e[1],estado:e[2],nivel:t}}var so=500,Fa=/^\s*\[( |x|X)\]\s?/;function Ao(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(r=>{let e=Fa.exec(r);return e?{texto:r.slice(e[0].length),marca:e[1]===" "?"aberto":"feito"}:{texto:r,marca:null}})}function Gr(o){return o.map(r=>r.marca===null?r.texto:`${r.marca==="feito"?"[X]":"[ ]"} ${r.texto}`).join(`
`)}function Xr(o,r){let e=Ao(o),a=e[r];return!a||a.marca===null?o:(a.marca=a.marca==="aberto"?"feito":"aberto",Gr(e))}function Wr(o,r,e){let a=Ao(o),t=a.slice(r,e+1),n=t.length>0&&t.every(i=>i.marca!==null);for(let i of t)i.marca=n?null:i.marca??"aberto";return Gr(a)}function Va(o){let r=bo.exec(Vo(o));return r?`${no(Number(r[1]))}/${no(Number(r[2]))}/${r[3]}`:null}function Jr(o,r){let[e,a,t]=r.split("-"),n=`${t}/${a}/${e}`;return bo.test(o)?o.replace(bo,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function yo(o){let r=Va(o);if(!r)return null;let[e,a,t]=r.split("/");return`${t}-${a}-${e}`}function $(o,r){return o.toLowerCase().includes(`(${r.toLowerCase()})`)}function Yr(o,r){return $(o,r)?o.replace(new RegExp(`\\(${r}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${r})`.trim()}function jr(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(r=>r.trim().charAt(0)!=="#").map(r=>r.trim()).filter(Boolean).join(" ")}function Kr(o,r,e){return[{unidade:r,observacao:jr(o)},...e.map(t=>({unidade:t.unidade,observacao:jr(t.observacao)}))].filter(t=>t.observacao)}function Zr(o){let r=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return r?`${r[3]}/${r[2]}/${r[1]} ${r[4]}:${r[5]}`:""}function Qr(o){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return r?`${r[3]}-${r[2]}-${r[1]}T${r[4]??"00"}:${r[5]??"00"}`:""}function oe(o,r){let e=o.trim();return r?`${e} ["Reabertura": "${r}"]`.trim().slice(0,500):e}function re(o,r){let e=/\s*\(atribu.do para [^)]*\)/i;return r===null?o.replace(e,""):e.test(o)?o.replace(e,` (atribu\xEDdo para ${r})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${r})$1`)}function ee(o){return o.includes("(")?o.split("(").map(r=>r.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function ja(o=2){return p("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(r,e)=>p("span",{class:"spro-p-barra",style:e===o-1&&o>1?"width:62%":void 0})))}function ae(o,r){return p("div",{class:"spro-p-erro",role:"alert"},p("span",{class:"spro-p-erro-texto"},b("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),p("button",{type:"button",class:"spro-p-link",onclick:r},"Tentar de novo"))}function G(o,...r){return p("div",{class:"spro-p-vazio"},o,...r)}function B(o){return p("div",{class:"spro-p-nota"},o)}function j(o,r,e,a=2){if(o.dado===void 0)return o.estado==="erro"?[ae(o.erro??"",r)]:[ja(a)];let t=e(o.dado);return o.estado==="erro"?[...t,ae(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",r)]:t}function Ua(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function te(o){let r=[...o.querySelectorAll("dialog[open]")],e=!0;return r.filter(n=>{try{return n.matches(":modal")}catch{return e=!1,!1}}).at(-1)??(e?void 0:r.at(-1))??o.body??o.documentElement}function ne(o,r,e,a,t){let n=o.body??o.documentElement;for(let u of[n,...o.querySelectorAll("dialog")])for(let m of[...u.children])m.classList.contains("spro-aviso")&&m.remove();let i=p("div",{class:"spro-aviso",role:"status"},b("check",16),p("span",{},r),...Ua(e).map(u=>p("button",{type:"button",onclick:()=>{i.remove(),u.fazer()}},u.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+a,l=()=>{let u=te(o);u.append(i),s(),u.localName==="dialog"&&u.addEventListener("close",()=>{if(!(!d||!u.contains(i))){if(t&&te(o).localName!=="dialog"&&t(r,e,Math.max(0,c-Date.now()))){d=!1,i.remove();return}l()}},{once:!0})},d=!0;return l(),setTimeout(()=>{d=!1,i.remove()},a),i}async function Ba(o,r){try{return await o.defaultView?.navigator.clipboard.writeText(r),!0}catch{let e=o.createElement("textarea");e.value=r,e.setAttribute("readonly",""),e.style.position="fixed",e.style.opacity="0",o.body.append(e),e.select();let a=!1;try{a=o.execCommand("copy")}catch{a=!1}return e.remove(),a}}function H(o,r,e=4e3){try{ne(o.topo,r,void 0,e)}catch{}}async function ie(o,r){let e=await Ba(o.doc,r);H(o,e?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var se={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},ce={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function co(o){if(o&&typeof o=="object"){let r=o,e=typeof r.message=="string"&&r.message?r.message:"N\xE3o foi poss\xEDvel concluir.",a=typeof r.detalhe=="string"&&r.detalhe&&r.codigo==="SEI_VALIDACAO"?` ${r.detalhe}`:"";return`${e}${a}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function pe(o){let r=o&&typeof o=="object"?o.codigo:void 0;return r==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":r==="SEI_VERSAO_NAO_SUPORTADA"||r==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":r==="SEI_REDE"?"Sem conex\xE3o com o SEI.":co(o)}function O(o,r){ho(o.topo);let e=p("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":r.titulo});to(o.doc)&&e.setAttribute("data-tema","escuro"),e.style.width=`min(${r.largura??480}px, calc(100vw - 24px))`;let a=!1,t=p("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},b("fechar",16)),n=p("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=p("div",{class:"spro-dialogo-corpo"},n,...r.conteudo);e.append(p("header",{},p("span",{class:"spro-dialogo-icone","aria-hidden":"true"},b(r.icone,18)),p("h2",{},r.titulo),t),i);let s=()=>{!a&&e.open&&e.close()};return t.addEventListener("click",s),e.addEventListener("cancel",c=>{a&&c.preventDefault()}),e.addEventListener("close",()=>{e.remove(),r.aoFechar?.()}),o.topo.body.append(e),e.showModal(),e.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")?.focus({preventScroll:!0}),{el:e,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,l=[]){this.erro(""),a=!0,t.disabled=!0;for(let d of l)d.disabled=!0;e.setAttribute("aria-busy","true");try{let d=await c();return a=!1,e.close(),d&&H(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){a=!1,t.disabled=!1;for(let u of l)u.disabled=!1;return e.removeAttribute("aria-busy"),this.erro(co(d)),!1}}}}function Eo(o,...r){o.replaceChildren(...r.filter(e=>e!=null&&e!==!1))}function F(o,r,e){return p("label",{class:"spro-p-campo"},p("span",{class:"spro-p-campo-rotulo"},o),r,e?p("span",{class:"spro-p-campo-dica"},e):null)}function D(...o){return p("div",{class:"spro-dialogo-rodape"},...o)}function I(o,r){return p("button",{type:"button",class:"spro-botao primario",onclick:r},o)}function X(o,r,e){let a=p("input",{type:"checkbox",class:"spro-p-interruptor"});return a.checked=r,a.addEventListener("change",()=>e(a.checked)),{el:p("label",{class:"spro-p-opcao"},a,p("span",{},o)),input:a}}function W(o,r,e,a){let t=p("select",{class:"spro-campo spro-p-lista",size:String(Math.min(8,Math.max(4,o.length))),"aria-label":e}),n=r??"",i=l=>{let d=jo(l),u=d?o.filter(m=>jo(m.texto).includes(d)):o;t.replaceChildren(...u.map(m=>{let g=p("option",{value:m.valor},m.texto);return g.selected=m.valor===n,g}))};t.addEventListener("change",()=>{n=t.value,a?.(n)});let s=p("input",{type:"search",class:"spro-campo",placeholder:"Buscar\u2026","aria-label":`Buscar em ${e}`});return s.addEventListener("input",()=>i(s.value)),i(""),{el:p("div",{class:"spro-p-busca"},o.length>8?s:null,t),valor:()=>n,definir(l){n=l,i(s.value)}}}function Q(o,r,e){return new Promise(a=>{let t=!1,n=p("button",{type:"button",class:"spro-botao primario perigo"},e),i=p("button",{type:"button",class:"spro-botao"},"Cancelar"),s=O(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[p("p",{class:"spro-p-pergunta"},r),D(i,n)],aoFechar:()=>a(t)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{t=!0,s.fechar()})})}function le(o,r,e){let a=p("div",{class:"spro-p-modal-lugar"},p("p",{class:"spro-p-nota"},"Carregando os grupos\u2026")),t=O(o,{titulo:r?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[a]});o.op.opcoesAcompanhamento().then(({grupos:n,atual:i})=>{t.el.isConnected&&Ga(o,t,a,n,i,r,e)}).catch(n=>{t.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar os grupos."),a.replaceChildren()})}function Ga(o,r,e,a,t,n,i){let s=p("select",{class:"spro-campo","aria-label":"Grupo"},p("option",{value:""},"(sem grupo)"),...a.map(h=>p("option",{value:h.valor},h.texto)));s.value=t??"";let c=p("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});c.value=n?n.observacao??"":i.slice(0,450);let l=o.reaberturaProgramada||!!n?.reabertura,d=X("Reabertura programada",!!n?.reabertura,h=>u.hidden=!h),u=p("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!n?.reabertura});u.value=n?.reabertura?Qr(n.reabertura):"";let m=I("Salvar",()=>void g()),g=async()=>{if(l&&d.input.checked&&!u.value){r.erro("Informe a data da reabertura.");return}let h=oe(c.value,l&&d.input.checked?Zr(u.value):null);await r.gravar(()=>o.op.acompanhar({grupo:s.value,observacao:h}),[m])&&o.recarregar("acompanhamento")};Eo(e,l?d.el:null,l?p("div",{class:"spro-p-grade"},u):null,F("Grupo",s),F("Observa\xE7\xE3o",c),D(m))}var P=(o,r)=>o.loja.ler(r);function S(o,r,e="",...a){return p("button",{type:"button",class:`spro-p-copiavel${e?` ${e}`:""}`,"aria-label":`Copiar: ${r}`,onclick:()=>void ie(o,r)},r,...a)}function oo(o,r){return B(o==="consultas"?`${r}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${r} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var M=(...o)=>p("div",{class:"spro-p-linha"},...o);function Xa(o,r){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),a=e?Z({data:`${e[3]}-${e[2]}-${e[1]}`,hora:`${e[4]??"00"}:${e[5]??"00"}`,vencimento:!1},r):null;return p("span",{class:`spro-p-chip ${a?.nivel==="vencido"?"atencao":a?.nivel??"ok"}`},b("relogio",11),`Reabertura: ${o}${a?` \xB7 ${a.rotulo}`:""}`)}var de={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let r=P(o,"acompanhamento"),e=P(o,"dadosProcesso").dado,a=e?.disponivel?e.valor.especificacao:"",t=r.dado?.disponivel?r.dado.valor:null,n=!!r.dado?.disponivel&&!o.sigiloso;return{estado:r.estado,desenho:{acoes:n?[{icone:t?"lapis":"mais",rotulo:t?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>le(o,t,a)}]:[],corpo:j(r,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[oo(i.motivo,"O acompanhamento especial")];if(!i.valor)return[G("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:l}=i.valor;return[M(S(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),l?M(Xa(l,o.agora())):null]})}}}};function Po(o,r){let e=p("textarea",{class:"spro-campo spro-p-anotacao",rows:"7",maxlength:String(so),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});e.value=r?.texto??"";let a=p("span",{class:"spro-p-contador","aria-live":"polite"}),t=()=>{let g=so-e.value.length;a.textContent=g<=0?"Limite de caracteres atingido.":`${g} caracteres restantes`};e.addEventListener("input",t),t();let n=g=>e.value.slice(0,g).split(`
`).length-1,i=p("button",{type:"button",class:"spro-botao pequeno","aria-label":"Transformar as linhas selecionadas em checklist"},b("check",14),"Checklist");i.addEventListener("click",()=>{e.value=Wr(e.value,n(e.selectionStart??0),n(e.selectionEnd??0)).slice(0,so),t(),e.focus()});let s=p("input",{type:"date",class:"spro-campo spro-p-data","aria-label":"Data para inserir na anota\xE7\xE3o"});s.value=yo(e.value)??"",s.addEventListener("change",()=>{s.value&&(e.value=Jr(e.value,s.value).slice(0,so),t())});let c=X("Prioridade",r?.prioridade??!1,()=>{}),l=I("Salvar",()=>void m(e.value,c.input.checked)),d=p("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover anota\xE7\xE3o"),u=O(o,{titulo:r?"Editar anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",icone:"nota",conteudo:[e,a,p("div",{class:"spro-p-ferramentas"},i,p("label",{class:"spro-p-opcao"},b("calendario",14),p("span",{},"Data"),s),c.el),D(r?d:null,l)]}),m=async(g,h)=>{await u.gravar(()=>o.op.anotar({texto:g.trim(),prioridade:h}),[l,d])&&o.recarregar("anotacao")};d.addEventListener("click",()=>{Q(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(g=>{g&&m("",!1)})})}async function Uo(o,r){try{await r()}catch(e){H(o,e instanceof Error?e.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var ue={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let r=P(o,"anotacao");if(r.dado&&!r.dado.disponivel&&r.dado.motivo==="acao")return null;let e=r.dado?.disponivel?r.dado:null,a=e?.valor??null;return{estado:r.estado,desenho:{acoes:e?a?[{icone:"alerta",rotulo:a.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:a.prioridade,aoClicar:()=>void Uo(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>Po(o,a)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void Q(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(t=>{t&&Uo(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>Po(o,null)}]:[],corpo:j(r,()=>o.recarregar("anotacao"),t=>{if(!t.disponivel)return[oo(t.motivo,"As anota\xE7\xF5es")];if(!t.valor)return[p("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",p("button",{type:"button",class:"spro-p-link",onclick:()=>Po(o,null)},"Adicionar anota\xE7\xE3o"))];let{texto:n,prioridade:i}=t.valor,s=yo(n),c=s?Z({data:s,hora:"23:59",vencimento:!0},o.agora()):null,l=Ao(n).map((d,u)=>d.marca===null?p("div",{class:"spro-p-nota-linha"},d.texto||" "):p("label",{class:`spro-p-nota-linha item${d.marca==="feito"?" feito":""}`},p("input",{type:"checkbox",checked:d.marca==="feito",onchange:()=>void Uo(o,()=>o.op.alternarItemDaAnotacao(u))}),p("span",{},d.texto)));return[p("div",{class:`spro-p-post-it${i?" prioridade":""}`},i?p("span",{class:"spro-p-chip vencido"},b("alerta",11),"prioridade"):null,...l,s&&c?p("span",{class:`spro-p-chip ${c.nivel}`},b("calendario",11),`${xo({data:s,hora:"23:59",vencimento:!0})} \xB7 ${c.rotulo}`):null)]})}}}};function me(o,r,e){let a=p("div",{class:"spro-p-modal-lugar"},p("p",{class:"spro-p-nota"},"Carregando a lista de usu\xE1rios\u2026")),t=O(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[a]});o.op.opcoesAtribuicao().then(({opcoes:n,atual:i})=>{if(!t.el.isConnected)return;let s=r.usuario?n.find(m=>m.texto.split(" - ")[0]?.trim().toLowerCase()===r.usuario?.toLowerCase())?.valor:void 0,c=W(n,i??s,"usu\xE1rios da unidade"),l=I("Salvar",()=>void u(c.valor(),l,d)),d=p("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),u=async(m,...g)=>{if(m===""){t.erro("Escolha um usu\xE1rio.");return}let h=m===null?void 0:n.find(N=>N.valor===m);if(await t.gravar(()=>o.op.atribuir(m),g)){let[N="",...T]=(h?.texto??"").split(" - ");e(m===null?{usuario:null}:{usuario:N.trim(),nome:T.join(" - ").trim()})}};d.addEventListener("click",()=>void u(null,l,d)),a.replaceChildren(p("p",{class:"spro-p-nota"},"Atribuir para:"),c.el,D(r.usuario?d:null,l))}).catch(n=>{t.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar a lista de usu\xE1rios."),a.replaceChildren()})}var fe={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"pessoa",desenhar(o){let r=P(o,"atribuicao"),e=o.unidade.sigla.toLowerCase();return{estado:r.estado,desenho:{corpo:j(r,()=>o.recarregar("atribuicao"),a=>a.linhas.length?a.linhas.map(t=>{let n=!t.usuario&&!o.sigiloso,i=a.editavel&&t.unidade.toLowerCase()===e;return M(S(o,t.texto),n?p("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?K({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>me(o,t,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let l=c.dado.linhas.map(d=>d===t?{...d,usuario:s.usuario,nomeUsuario:s.nome,texto:re(d.texto,s.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:l,usuario:s.usuario}})})}):null)}):[B(a.texto||"Processo sem andamento aberto.")],1)}}}};var ge=(o,r)=>o>0&&r-o<18e5;var ve={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"camadas",desenhar(o){let e=P(o,"blocoInterno").dado;if(e&&ge(e.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[M(e.descricao?S(o,e.descricao):B("Nenhum bloco localizado."))]}};let a=p("span",{class:"spro-p-nota",hidden:!0},"A coleta do hist\xF3rico ainda n\xE3o est\xE1 dispon\xEDvel nesta vers\xE3o."),t=p("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return t.addEventListener("click",()=>{o.aoPedirHistorico().then(n=>{a.hidden=n})}),{estado:"pronto",desenho:{corpo:[p("div",{class:"spro-p-linha"},t,a)]}}}};async function Bo(o,r,e,a){try{let t=await o.op.formularioDoProcesso();r.el.isConnected&&await a(t)}catch(t){r.erro(t instanceof Error?t.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),e.replaceChildren()}}var Go=o=>p("div",{class:"spro-p-modal-lugar"},p("p",{class:"spro-p-nota"},o));function he(o,r){let e=p("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});e.value=r.especificacao;let a=I("Salvar",()=>void n()),t=O(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[F("Especifica\xE7\xE3o",e),D(a)]});e.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await t.gravar(()=>o.op.alterarProcesso({especificacao:e.value.trim()}),[a])&&o.recarregar("dadosProcesso")}}function be(o,r){let e=Go("Carregando os tipos de processo\u2026"),a=O(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[e]});Bo(o,a,e,t=>{let n=t.tipoAtual??t.tipos.find(c=>c.texto===r)?.valor,i=W(t.tipos,n,"tipos de processo"),s=I("Salvar",async()=>{if(!i.valor()){a.erro("Escolha um tipo.");return}await a.gravar(()=>o.op.alterarProcesso({tipo:i.valor()}),[s])&&o.recarregar("dadosProcesso")});e.replaceChildren(F("Tipo de processo",i.el),D(s))})}function xe(o){let r=Go("Carregando o formul\xE1rio do processo\u2026"),e=O(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[r]});Bo(o,e,r,async a=>{let t=a.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(m=>p("button",{type:"button",role:"radio","aria-checked":String(m===t),"data-nivel":m},m==="publico"?"P\xFAblico":"Restrito")),i=p("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=p("div",{class:"spro-p-modal-lugar",hidden:t!=="restrito"}),c=null,l=[],d=async()=>{if(!c){s.replaceChildren(p("p",{class:"spro-p-nota"},"Carregando as hip\xF3teses legais\u2026"));try{l=await a.hipoteses("1"),c=W(l,a.hipoteseAtual,"hip\xF3teses legais"),s.replaceChildren(F("Hip\xF3tese legal",c.el))}catch(m){s.replaceChildren(),e.erro(m instanceof Error?m.message:"N\xE3o foi poss\xEDvel carregar as hip\xF3teses legais.")}}};for(let m of n)m.addEventListener("click",()=>{t=m.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let g of n)g.setAttribute("aria-checked",String(g===m));s.hidden=t!=="restrito",t==="restrito"&&d()});let u=I("Salvar",async()=>{if(t==="restrito"&&!c?.valor()){e.erro("Escolha a hip\xF3tese legal.");return}await e.gravar(()=>o.op.alterarProcesso(t==="restrito"?{nivel:t,hipotese:c?.valor()??""}:{nivel:t}),[u])&&o.recarregar("dadosProcesso")});r.replaceChildren(i,s,D(u)),t==="restrito"&&await d()})}function Ae(o,r){let e=p("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});e.value=r.observacoes;let a=I("Salvar",()=>void n()),t=O(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[F("Observa\xE7\xF5es",e,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),D(a)]}),n=async()=>{await t.gravar(()=>o.op.alterarProcesso({observacoes:e.value.trim()}),[a])&&o.recarregar("dadosProcesso")}}function ye(o){let r=Go("Carregando os interessados\u2026"),e=O(o,{titulo:"Interessados do processo",icone:"pessoa",conteudo:[r]});Bo(o,e,r,a=>{let t=new Map(a.interessados.map(s=>[s.id,s])),n=a.interessados.map(s=>{let c=p("button",{type:"button",class:"spro-p-acao perigo","aria-pressed":"false","aria-label":`Retirar ${s.texto}`},"Retirar"),l=p("li",{class:"spro-p-linha-modal"},p("span",{class:"spro-p-texto-modal"},s.texto),c);return c.addEventListener("click",()=>{let d=t.has(s.id);d?t.delete(s.id):t.set(s.id,s),l.toggleAttribute("data-retirado",d),c.textContent=d?"Manter":"Retirar",c.setAttribute("aria-pressed",String(d)),i.disabled=t.size===a.interessados.length}),l}),i=I("Salvar",async()=>{await e.gravar(()=>o.op.alterarProcesso({interessados:a.interessados.filter(c=>t.has(c.id))}),[i])&&o.recarregar("dadosProcesso")});i.disabled=!0,r.replaceChildren(n.length?p("ul",{class:"spro-p-lista-modal"},...n):p("p",{class:"spro-p-nota"},"O processo n\xE3o tem interessados."),p("p",{class:"spro-p-nota"},"Para incluir um interessado, use Consultar/Alterar Processo no SEI."),D(i))})}var J=o=>{let r=P(o,"dadosProcesso").dado;return r?.disponivel?r.valor:null},po=o=>!o.sigiloso&&!!J(o)?.editavel;async function Ee(o,r){let e=J(o);if(!e)return;let a=!$(e.especificacao,r);try{let t=await o.op.alterarProcesso({especificacao:Yr(e.especificacao,r).slice(0,100)});H(o,t.aplicado?r==="URGENTE"?a?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":a?"Marca de trancamento adicionada.":"Marca de trancamento removida.":t.resumo)}catch(t){H(o,co(t),7e3)}o.recarregar("dadosProcesso")}function wo(o,r,e=2){let a=P(o,"dadosProcesso");return j(a,()=>o.recarregar("dadosProcesso"),t=>t.disponivel?r(t):[oo(t.motivo,"Este dado")],e)}var Pe={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"documento",desenhar(o){let r=P(o,"dadosProcesso"),e=J(o),a=[];return e&&po(o)&&(a.push({icone:"alerta",rotulo:$(e.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:$(e.especificacao,"URGENTE"),aoClicar:()=>void Ee(o,"URGENTE")}),o.usaTrancado&&a.push({icone:"cadeado",rotulo:$(e.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:$(e.especificacao,"TRANCADO"),aoClicar:()=>void Ee(o,"TRANCADO")}),a.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>he(o,{especificacao:e.especificacao,observacoes:e.observacoes,nivel:e.nivel})})),{estado:r.estado,desenho:{acoes:a,corpo:wo(o,t=>[M(S(o,t.valor.especificacao||"(sem especifica\xE7\xE3o)",`${$(t.valor.especificacao,"URGENTE")?"urgente":""} ${$(t.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},we={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"pasta",desenhar(o){let r=J(o),e=r?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:r&&po(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>be(o,e)}]:[],corpo:[M(S(o,e||"(n\xE3o informado)"))]}}}},Se={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"cadeado",desenhar(o){let r=J(o),e=r?.nivel??o.arv.nivel,a=r?r.hipotese:o.arv.hipotese,t=e==="restrito"?`Restrito${a?`: ${a}`:""}`:e==="sigiloso"?"Sigiloso":ce.publico;return{estado:"pronto",desenho:{acoes:r&&po(o)&&e!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>xe(o)}]:[],corpo:[M(p("span",{class:`spro-p-nivel ${e}`,"aria-hidden":"true"},b(se[e],13)),S(o,t))]}}}},Oe={tipo:"interessados",titulo:"Interessados",icone:"pessoa",desenhar(o){return{estado:P(o,"dadosProcesso").estado,desenho:{acoes:J(o)&&po(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>ye(o)}]:[],corpo:wo(o,e=>e.valor.interessados.length?e.valor.interessados.map(a=>p("div",{class:"spro-p-linha interessado"},...ee(a).map(t=>S(o,t)))):[G("Sem interessados.")])}}}},De={tipo:"assuntos",titulo:"Assuntos",icone:"etiqueta",desenhar(o){return{estado:P(o,"dadosProcesso").estado,desenho:{corpo:wo(o,e=>e.valor.assuntos.length?e.valor.assuntos.map(a=>M(S(o,a))):[G("Sem assuntos.")])}}}},Me={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"nota",desenhar(o){let r=P(o,"dadosProcesso"),e=J(o);return{estado:r.estado,desenho:{acoes:e&&po(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>Ae(o,{especificacao:e.especificacao,observacoes:e.observacoes,nivel:e.nivel})}]:[],corpo:wo(o,a=>{let t=Kr(a.valor.observacoes,o.unidade.sigla,a.valor.observacoesOutras??[]);return t.length?t.map(n=>M(S(o,`${n.unidade}: ${n.observacao}`))):[B("Sem observa\xE7\xF5es.")]})}}}};var Wa=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function Xo(o,r){let e=p("div",{class:"spro-p-modal-lugar"},p("p",{class:"spro-p-nota"},"Carregando os marcadores\u2026")),a=O(o,{titulo:r?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[e]});o.op.opcoesMarcador().then(t=>{a.el.isConnected&&Ja(o,a,e,t,r)}).catch(t=>{a.erro(t instanceof Error?t.message:"N\xE3o foi poss\xEDvel carregar os marcadores."),e.replaceChildren()})}function Ja(o,r,e,a,t){let n=t?io(t.texto):{prazo:null,texto:""},i=W(a,t?a.find(A=>A.texto===t.nome)?.valor:void 0,"marcadores"),s=X("Controlar prazo",!!n.prazo,A=>u.hidden=!A),c=X("Controlar vencimento (\u201CAt\xE9\u201D)",!!n.prazo?.vencimento,()=>{}),l=p("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});l.value=n.prazo?.data??Wa(o.agora());let d=p("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=n.prazo?.hora??"23:59";let u=p("div",{class:"spro-p-grade",hidden:!n.prazo},c.el,p("div",{class:"spro-p-par"},l,d)),m=p("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});m.value=n.texto;let g=I("Salvar",()=>void h()),h=async()=>{let A=a.find(x=>x.valor===i.valor());if(!A){r.erro("Escolha um marcador.");return}if(s.input.checked&&!l.value){r.erro("Informe a data do prazo.");return}let N=Ur({prazo:s.input.checked?{data:l.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:m.value}),T=await r.gravar(async()=>(t&&A.texto!==t.nome&&await o.op.desmarcar(t.nome),o.op.marcar({marcador:A.texto,texto:N})),[g]);return o.recarregar("marcador"),T};Eo(e,F("Marcador",i.el),t?p("p",{class:"spro-p-nota"},b("etiqueta",12),` Atual: ${t.nome}. Escolher outro troca o marcador.`):null,s.el,u,F("Texto",m),D(g))}function Ya(o,r){let{prazo:e}=io(r);if(!e)return null;let a=Z(e,o.agora());return p("span",{class:`spro-p-chip ${a.nivel}`},b("relogio",11),`${e.vencimento?"at\xE9 ":""}${xo(e)} \xB7 ${a.rotulo}`)}async function Ka(o,r){if(await Q(o,`Remover o marcador \u201C${r.nome}\u201D deste processo?`,"Remover")){try{let e=await o.op.desmarcar(r.nome);H(o,e.resumo)}catch(e){H(o,e instanceof Error?e.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function Za(o,r,e){let{texto:a}=io(r.texto),t=r.icone?p("img",{class:"spro-p-marcador-icone",src:r.icone,alt:""}):b("etiqueta",14);return M(p("div",{class:"spro-p-marcador"},S(o,r.nome,"forte",t),Ya(o,r.texto),a?S(o,a,"suave"):null),e&&r.id?p("span",{class:"spro-p-acoes-linha"},K({icone:"lapis",rotulo:`Editar o marcador ${r.nome}`,aoClicar:()=>Xo(o,r)}),K({icone:"lixeira",rotulo:`Remover o marcador ${r.nome}`,perigo:!0,aoClicar:()=>void Ka(o,r)})):null)}var Ie={tipo:"marcador",titulo:"Marcador",icone:"etiqueta",desenhar(o){let r=P(o,"marcador"),e=Br(o.arv.pagina.html);return{estado:r.estado,desenho:{acoes:r.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>Xo(o)}]:[],corpo:[...j(r,()=>o.recarregar("marcador"),a=>a.itens.length?a.itens.map(t=>Za(o,t,a.editavel)):[G("Sem marcador.")]),e?p("div",{class:"spro-p-prazo-nativo"},p("span",{class:`spro-p-chip ${e.nivel==="concluido"?"ok":e.nivel}`},b("relogio",11),`Prazo do SEI: ${e.data} (${e.estado})`)):null]}}}};var Ce=[ue,fe,ve,Ie,de,Pe,we,Se,Oe,De,Me];var Qa=1e4;function ke(o){if(!o.getElementById("frmArvore"))return null;try{return qo(eo(o))}catch{return null}}function _e(o,r=Qa){return new Promise(e=>{let a=ke(o);if(a)return e(a);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=m=>{i||(i=!0,l?.disconnect(),clearTimeout(u),clearInterval(d),e(m))},c=()=>{let m=ke(o);m&&s(m)},l=typeof n=="function"&&o.documentElement?new n(c):null;l?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),u=setTimeout(()=>s(null),r)})}var Ne="data-spro-processo-raiz";function ot(o){for(let r of o.querySelectorAll(`[${Ne}], [data-spro-slot="atividades"]`))r.remove()}function Le(o){return Ce.filter(r=>o.habilitados.has(r.tipo)&&!(o.sigiloso&&wr.has(r.tipo)))}function Re(o){let r=new Set;for(let e of Le(o))for(let a of $o[e.tipo])r.add(a);return o.sigiloso&&r.delete("dadosProcesso"),[...r]}function Te(o){let r=o.doc;ho(r),ot(r);let e=r.getElementById("frmArvore")??r.body,a=to(r),t=(x="")=>p("div",{class:`spro-p-raiz ${x}`.trim(),[Ne]:"1",...a?{"data-tema":"escuro"}:{}}),n=t(),i=t("anotacoes"),s=p("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=r.getElementById("divConsultarAndamento");c?c.after(i):e.prepend(i);let l=r.getElementById("divRelacionados");l?l.before(s):i.after(s),e.append(n);let d=new Map,u=Le(o),m=x=>Ro.indexOf(x);for(let x of u){let y=kr({tipo:x.tipo,titulo:x.titulo,icone:x.icone,aberto:Hr(o.armazenamento,x.tipo),aoAlternar:L=>Fr(o.armazenamento,x.tipo,L)});d.set(x.tipo,{def:x,casca:y})}for(let x of[...Ro].sort((y,L)=>m(y)-m(L))){let y=d.get(x);y&&n.append(y.casca.el)}let g=d.get("anotacoes");g&&i.append(g.casca.el);let h=x=>{let y=d.get(x);if(!y)return;let L;try{L=y.def.desenhar(o)}catch(ha){console.warn(`[SEI Pro] painel ${x}:`,ha),L=null}y.casca.el.hidden=L===null,L&&y.casca.atualizar(L.estado,L.desenho)},A=x=>{if(x)h(x);else for(let y of d.keys())h(y)},N=o.loja.aoMudar(x=>{for(let[y,L]of d)$o[L.def.tipo].includes(x)&&h(y)});A();let T=Lr(r,()=>{let x=to(r);for(let y of[n,i])x?y.setAttribute("data-tema","escuro"):y.removeAttribute("data-tema")});return{raiz:n,redesenhar:A,desmontar(){N(),T(),n.remove(),i.remove(),s.remove()}}}function $e(o,r,e={}){let a=Te(o),t=!1,n=o.doc.defaultView,i=e.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{t=!1,!a.raiz.isConnected&&(a.desmontar(),a=Te(o),r?.(a))},c=typeof i=="function"&&o.doc.body?new i(()=>{t||a.raiz.isConnected||(t=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>a,parar(){c?.disconnect(),a.desmontar()}}}function C(o,r,e){let a=(r??"").trim(),t=(e??"").trim();return e===void 0||a===t?[]:[{campo:o,antes:a,depois:t}]}var So={publico:"0",restrito:"1"},Wo={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function Oo(o,r,e,a){let t=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(r.pagina.html)?.[0];return t?o.ajax(V(t),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",e]],{sinal:a}):r.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Fe="\xA5",Jo="\xB1";function ze(o){return o.map(r=>`${r.id}${Jo}${r.texto}`).join(Fe)}function rt(o){return o?o.split(Fe).map(r=>{let[e,...a]=r.split(Jo);return{id:e,texto:a.join(Jo)}}):[]}function qe(o){let r=[];for(let e of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))r.push([e[1],e[2]]);return r}var w=class o{constructor(r,e,a){this.http=r;this.pagina=e;this.elemento=a,this.id=a.id,this.action=(a.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=et(a),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(r,e,a,t){let n=await r.obter(e,t);return o.de(n,a,r)}static de(r,e,a=null){let t=r.doc.querySelector(e);if(!t)throw new f("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${e}).`,v(r.doc.querySelector("title")));return new o(a,r,t)}pares(){return this.campos.map(r=>[r.nome,r.valor])}valor(r){return this.campos.find(e=>e.nome===r)?.valor}tem(r){return this.elemento.querySelector(`[name="${r}"]`)!==null||this.campos.some(e=>e.nome===r)}opcoes(r){let e=this.elemento.querySelector(`select[name="${r}"], select#${He(r)}`);return e?[...e.querySelectorAll("option")].map(a=>({valor:a.getAttribute("value")??v(a),texto:v(a),selecionada:a.hasAttribute("selected")})):[]}definir(r){for(let[e,a]of Object.entries(r)){if(a===void 0)continue;if(a===null){this.campos=this.campos.filter(n=>n.nome!==e);continue}let t=this.campos.find(n=>n.nome===e);t?t.valor=a:this.campos.push({nome:e,valor:a})}return this}escolher(r,e){let a=this.opcoes(r),t=k(e),n=a.find(i=>i.valor===e)??a.find(i=>k(i.texto)===t)??Yo(a.filter(i=>k(i.texto).includes(t)));if(!n)throw new f("ARGUMENTO_INVALIDO",`"${e}" n\xE3o \xE9 uma op\xE7\xE3o de ${r}.`,a.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[r]:n.valor}),n}linhas(r){return[...this.elemento.querySelectorAll(`${r} tr`)].filter(e=>e.querySelector("input[type=checkbox]"))}itensLupa(r){let e=this.hiddenDaLupa(r);return e?rt(this.valor(e)??""):[]}definirLupa(r,e){let a=this.hiddenDaLupa(r);if(!a)throw new f("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${r} n\xE3o existe nesta tela.`);return this.definir({[a]:ze(e)}),this.campos=this.campos.filter(t=>t.nome!==r&&t.nome!==`${r}[]`),this}async enviar(r={}){if(!this.http)throw new f("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new f("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let e=this.pares();r.botao&&e.push(this.botaoDeEnvio(r.botao));let a=await this.http.enviar(this.action,e,r);if(r.sucesso&&!r.sucesso(a))throw new f("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${r.operacao??"a opera\xE7\xE3o"}.`,`${v(a.doc.querySelector("title"))} \u2014 ${a.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return a}botaoDeEnvio(r){let e=this.elemento.querySelector(`[name="${r}"]`)??Yo([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return e?[e.getAttribute("name")??r,e.getAttribute("value")??v(e)??r]:[r,r]}hiddenDaLupa(r){let e=qe(this.pagina.html).find(([a])=>a===r);return e?e[1]:null}sincronizarLupas(){for(let[r,e]of qe(this.pagina.html)){let a=this.elemento.querySelector(`select#${He(r)}`);if(!a)continue;let t=[...a.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:v(n)}));(this.valor(e)??"")||this.definir({[e]:ze(t)}),this.campos=this.campos.filter(n=>n.nome!==r&&n.nome!==`${r}[]`)}}};function et(o){let r=[];for(let e of o.querySelectorAll("input, select, textarea")){let a=e.getAttribute("name");if(!a||e.hasAttribute("disabled"))continue;let t=e.tagName.toLowerCase();if(t==="input"){let n=(e.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!e.hasAttribute("checked"))continue;r.push({nome:a,valor:e.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(t==="textarea")r.push({nome:a,valor:e.textContent??""});else{let n=[...e.querySelectorAll("option")],i=n.filter(l=>l.hasAttribute("selected")),s=e.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let l of c)r.push({nome:a,valor:l.getAttribute("value")??v(l)})}}return r}function k(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Ve(o,r,e){let a=k(r),t=o.find(n=>n.id===r)??o.find(n=>k(n.texto)===a)??Yo(o.filter(n=>k(n.texto).includes(a)));if(!t)throw new f("ARGUMENTO_INVALIDO",`${e} "${r}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return t}function Yo(o){return o.length===1?o[0]:void 0}function He(o){return o.replace(/([^\w-])/g,"\\$1")}function at(o){let r=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return r?r[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function tt(o){let r=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",e=/infra_unidade_atual=(\d+)/.exec(r)?.[1];if(e)return e;let a=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return a||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function lo(o){let r=o.doc,e=r.querySelector("#lnkInfraUnidade"),a=r.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,t="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(a)??[],s=at(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:tt(o),sigla:v(e)||v(r.querySelector("#selInfraUnidades option[selected]")),nome:e?.getAttribute("title")??""},usuario:{nome:t.trim(),login:n.trim(),orgao:i.trim()}}}var nt=3e4,Do=class{constructor(r,e=null,a){this.paginaViva=e;this.http=mo(r,a)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let r=this.paginaViva?.();if(r&&r.html.includes("frmProtocoloPesquisaRapida"))return r;if(this.paginaBase)return this.paginaBase;if(r)return r;throw new f("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return lo(this.base())}linkMenu(r){return Dr(this.base(),r)}async renovarBase(r){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),r),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(r,e){let a=r.trim();if(!a)throw new f("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let t=this.localizados.get(a);if(t)return t;let n=w.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:a});let i=await n.enviar(e),s=R(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new f("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${a}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new f("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=R(V(c)).get("id_procedimento")??"",u=s.get("id_protocolo")??"",m={idProcedimento:d,idDocumento:u&&u!==d?u:void 0,linkArvore:V(c)};return this.localizados.set(a,m),m}async arvore(r,e={}){let a=await this.localizar(r,e),t=this.arvores.get(a.idProcedimento);if(t&&!e.forcar&&Date.now()-t.quando<nt)return t.arvore;let n=await Cr(this.http,a.linkArvore,e);return this.arvores.set(a.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(r){r?this.arvores.delete(r):this.arvores.clear()}esquecer(r){this.localizados.delete(r.trim())}async ajax(r,e,a){let t=await this.http.enviar(r,e,{...a,aceitarValidacao:!0}),n=[];for(let i of t.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:V(i[1]),texto:V(i[2]).trim()});for(let i of t.html.matchAll(/<item\s+([^>]*)>/g)){let s=Y(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function ro(o,r,e){let a=q(o,r);if(!a)throw new f("SEI_ACAO_INDISPONIVEL",`"${e}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return a}async function uo(o,r,e){let a=await w.abrir(o,ro(r,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",e),t=(a.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return t?{texto:t,prioridade:a.valor("chkSinPrioridade")!==void 0}:null}var je=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Ue(o,r,e){let a=je.exec(e),t=e.replace(je,"").trim(),n={};return o&&(n.id=o),r&&(n.grupo=r),t&&(n.observacao=t),e&&(n.observacaoBruta=e),a&&(n.reabertura=a[1]),n}function it(o){let r=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(v(c.querySelector("th, tr"))||c.textContent||""));if(!r)return;let e=[...r.querySelectorAll("th")].map(c=>v(c).toLowerCase()),a=e.findIndex(c=>c.startsWith("grupo")),t=e.findIndex(c=>c.startsWith("observa"));if(a<0||t<0)return;let n=[...r.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>t);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Ue(s||void 0,v(i[a]),v(i[t]))}async function Be(o,r,e){let a=await o.obter(ro(r,"acompanhamento_gerenciar","Acompanhamento Especial"),{...e,aceitarValidacao:!0});if(a.doc.querySelector("#frmAcompanhamentoCadastro")){let n=w.de(a,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Ue(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let t=it(a);if(t===void 0)throw new f("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",v(a.doc.querySelector("title")));return t}function st(o){let r=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return r?ao(o.pagina.html,r.index+r[0].length-1)[0]:""}function ct(o){if(!o.trim())return[];let r=Y(`<div id="r">${o}</div>`).getElementById("r");if(!r)return[];let e=[],a={texto:"",ancoras:[]},t=()=>{let n=a.texto.replace(/\s+/g," ").trim();n&&e.push({texto:n,ancoras:a.ancoras}),a={texto:"",ancoras:[]}};for(let n of[...r.childNodes])if(n.nodeType===1&&n.tagName==="BR")t();else if(a.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;a.ancoras.push({sigla:v(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return t(),e}function Ge(o,r){let e=ct(st(o)),a=[];for(let i of e){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){a.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;a.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let t=(r??lo(o.pagina).unidade.sigla).trim().toLowerCase(),n=t?a.find(i=>i.unidade.toLowerCase()===t):a.length===1?a[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!q(o,"procedimento_alterar"),texto:e.map(i=>i.texto).join(`
`),linhas:a}}function Mo(o){let r=a=>!!q(o,a),e=r("procedimento_alterar");return{anotar:r("anotacao_registrar"),acompanhar:r("acompanhamento_gerenciar"),marcar:r("andamento_marcador_gerenciar"),atribuir:r("procedimento_atribuicao_cadastrar"),alterar:e,consultar:e||r("procedimento_consultar")}}async function Xe(o,r,e){let a=await o.obter(ro(r,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...e,aceitarValidacao:!0});if(a.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let t=a.doc.querySelector("#tblMarcadores");if(!t){if(/Nenhum registro encontrado|sem marcador/i.test(a.doc.body?.textContent??"")||a.doc.querySelector("#frmGerenciarMarcador"))return[];throw new f("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",v(a.doc.querySelector("title")))}return[...t.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:v(s[1]),texto:v(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:v(s[3]),data:v(s[4])}})}async function We(o,r,e){let t=(await w.abrir(o,ro(r,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...e,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=t.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:t.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function Je(o,r,e){let a=await o.obter(ro(r,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...e,aceitarValidacao:!0}),t=a;if(!a.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=_(a.html,"andamento_marcador_cadastrar");if(!i)throw new f("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");t=await o.obter(i,{...e,aceitarValidacao:!0})}let n=t.doc.querySelector("#selMarcador");if(!n)throw new f("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:v(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function Ye(o,r,e){let a=await o.obter(ro(r,"acompanhamento_gerenciar","Acompanhamento Especial"),{...e,aceitarValidacao:!0}),t=a;if(!a.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(l=>_(a.html,l)).find(Boolean);if(!c)throw new f("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");t=await o.obter(c,{...e,aceitarValidacao:!0})}let i=w.de(t,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function Ke(o,r,e){let a=q(r,"procedimento_alterar")??q(r,"procedimento_consultar");if(!a)throw new f("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${r.protocolo} para voc\xEA.`);let t=await w.abrir(o.http,a,"#frmProcedimentoCadastro",e),n=t.opcoes("selTipoProcedimento"),i=t.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:t.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:t.itensLupa("selInteressadosProcedimento"),async hipoteses(c,l){return(await Oo(o,t,c,l)).map(d=>({valor:d.id,texto:d.texto}))}}}async function Qe(o,r,e){let a=await o.arvore(r,{sinal:e});if(a.nivel==="sigiloso")throw new f("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return a}function oa(o,r,e){let a=q(o,r);if(!a)throw new f("SEI_ACAO_INDISPONIVEL",`"${e}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return a}var ra=o=>r=>R(r.url).get("acao")!==o;async function pt(o,r,e,a){let t=await o.http.obter(oa(r,e.acao,e.nomeAcao),{sinal:a,aceitarValidacao:!0});if(t.doc.querySelector(e.form))return w.de(t,e.form,o.http);let n=(e.formularios??[]).map(i=>_(t.html,i)).find(Boolean);if(!n)throw new f("SEI_VERSAO_NAO_SUPORTADA",`A tela "${e.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return w.abrir(o.http,n,e.form,{sinal:a,aceitarValidacao:!0})}async function Ko(o,r,e,a){let t=await Qe(o,r,a.sinal),n=await pt(o,t,e,a.sinal),i=e.preparar(n),s={alvo:t.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?a.aplicar?(await n.enviar({sinal:a.sinal,botao:e.botao,operacao:`${e.nomeAcao} em ${t.protocolo}`,sucesso:e.sucesso??ra(e.acao)}),o.invalidar(t.idProcedimento),{...s,aplicado:!0,resumo:e.resumo(t.protocolo).replace(/^Vai /,"")}):{...s,resumo:e.resumo(t.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Io(o,r,e,a){return Ko(o,r,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:t=>{let n=e.texto.slice(0,500),i=C("Anota\xE7\xE3o",t.valor("txaDescricao"),n),s=t.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?e.prioridade===void 0?s:e.prioridade?"sim":"n\xE3o":"n\xE3o";return t.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...C("Prioridade",s,c)]},resumo:t=>e.texto?`Anota\xE7\xE3o definida em ${t}.`:`Anota\xE7\xE3o removida de ${t}.`},a)}function ea(o,r,e,a){return Ko(o,r,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:t=>{let n=t.opcoes("selAtribuicao").find(l=>l.valor===t.valor("selAtribuicao")&&l.valor!=="null")?.texto??"";if(e===null)return t.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=k(e),s=t.opcoes("selAtribuicao").filter(l=>l.valor!=="null"),c=s.find(l=>l.valor===e)??s.find(l=>k(l.texto.split(" - ")[0])===i)??s.find(l=>k(l.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(l=>k(l.texto).includes(i)).length===1?s.find(l=>k(l.texto).includes(i)):void 0);if(!c)throw new f("ARGUMENTO_INVALIDO",`Usu\xE1rio "${e}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(l=>l.texto).join(" | "));return t.definir({selAtribuicao:c.valor}),C("Atribui\xE7\xE3o",n,c.texto)},resumo:t=>e?`Processo ${t} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${t}.`},a)}function aa(o,r,e,a){return Ko(o,r,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:t=>!t.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:t=>{let n=[],i=!t.valor("hdnIdAcompanhamento");if(e.grupo!==void 0){let s=t.opcoes("selGrupoAcompanhamento").find(l=>l.valor===t.valor("selGrupoAcompanhamento")&&l.valor!=="null")?.texto??"",c=e.grupo?t.escolher("selGrupoAcompanhamento",e.grupo):(t.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...C("Grupo",s,c.texto))}return e.observacao!==void 0&&(n.push(...C("Observa\xE7\xE3o",t.valor("txaObservacao"),e.observacao)),t.definir({txaObservacao:e.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:t=>`Acompanhamento especial registrado em ${t}.`},a)}async function lt(o,r,e){let a=oa(r,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(a,{sinal:e,aceitarValidacao:!0})}function Ze(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(e=>e.querySelector("input[type=checkbox]")).map(e=>{let a=[...e.querySelectorAll("td")];return{id:e.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:v(a[1]),texto:v(a[2]),usuario:v(a[3]),data:v(a[4])}})}async function Zo(o,r,e,a){let t=await Qe(o,r,a.sinal),n=await lt(o,t,a.sinal),i=Ze(n),s=k(e.marcador),c=i.find(m=>k(m.marcador)===s),l={alvo:t.protocolo,mudancas:[],aplicado:!1,resumo:""};if(e.remover){if(!c)return{...l,resumo:`O processo ${t.protocolo} n\xE3o tem o marcador "${e.marcador}".`};if(l.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!a.aplicar)return{...l,resumo:`Vai remover o marcador "${c.marcador}" de ${t.protocolo}.`};let m=_(n.html,"andamento_marcador_remover");if(!m)throw new f("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let g=w.de(n,"#frmGerenciarMarcador",o.http);g.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let h=await o.http.enviar(m,g.pares(),{sinal:a.sinal,aceitarValidacao:!0});if(Ze(h).some(A=>A.id===c.id))throw new f("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(t.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${t.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=w.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=_(n.html,"andamento_marcador_cadastrar");if(!m)throw new f("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await w.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:a.sinal})}let u=d.escolher("selMarcador",e.marcador);return d.definir({hdnIdMarcador:u.valor,txaTexto:(e.texto??c?.texto??"").slice(0,250)}),l.mudancas=c?C(`Texto do marcador ${u.texto}`,c.texto,e.texto):[{campo:"Marcador",antes:"",depois:`${u.texto}${e.texto?`: ${e.texto}`:""}`}],l.mudancas.length?a.aplicar?(await d.enviar({sinal:a.sinal,botao:"sbmSalvar",operacao:`o marcador em ${t.protocolo}`,sucesso:ra("andamento_marcador_cadastrar")}),o.invalidar(t.idProcedimento),{...l,aplicado:!0,resumo:`Marcador "${u.texto}" aplicado em ${t.protocolo}.`}):{...l,resumo:`Vai marcar ${t.protocolo} com "${u.texto}".`}:{...l,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function Co(o,r){let e=o.valor(r);return o.opcoes(r).find(a=>a.valor===e&&e!=="null")?.texto??""}async function ta(o,r,e){let a=q(r,"procedimento_alterar"),t=a??q(r,"procedimento_consultar");if(!t)throw new f("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${r.protocolo} para voc\xEA.`);return{form:await w.abrir(o,t,"#frmProcedimentoCadastro",e),editavel:!!a}}function ko(o){return o.map(r=>r.texto).filter(Boolean)}var dt={0:"publico",1:"restrito",2:"sigiloso"};async function na(o,r,e){let{form:a,editavel:t}=await ta(o,r,e),n=dt[a.valor("rdoNivelAcesso")??""]??r.nivel,i=n==="publico"?void 0:Co(a,"selHipoteseLegal").trim()||r.hipotese;return{nivel:n,...i?{hipotese:i}:{},tipo:Co(a,"selTipoProcedimento")||r.tipo,especificacao:a.valor("txtDescricao")??"",assuntos:ko(a.itensLupa("selAssuntos")),interessados:ko(a.itensLupa("selInteressadosProcedimento")),observacoes:a.valor("txaObservacoes")??"",observacoesOutras:ut(a),editavel:t}}function ut(o){let r=[];for(let e of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let a=[...e.querySelectorAll("td")],t=v(a[0]);t&&r.push({unidade:t,observacao:v(a[1])})}return r}async function ia(o,r,e,a){let t=await o.arvore(r,{sinal:a.sinal});if(t.nivel==="sigiloso")throw new f("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await ta(o.http,t,{sinal:a.sinal});if(!i)throw new f("SEI_ACAO_INDISPONIVEL",`O processo ${t.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(e.especificacao!==void 0&&(s.push(...C("Especifica\xE7\xE3o",n.valor("txtDescricao"),e.especificacao)),n.definir({txtDescricao:e.especificacao.slice(0,100)})),e.tipo!==void 0){let l=Co(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",e.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),s.push(...C("Tipo",l,d.texto))}if(e.nivel!==void 0){let l=Wo[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:So[e.nivel]}),s.push(...C("N\xEDvel de acesso",l,Wo[So[e.nivel]])),e.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(e.hipotese!==void 0){let l=Co(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||So.restrito,u=Ve(await Oo(o,n,d,a.sinal),e.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:u.id}),s.push(...C("Hip\xF3tese legal",l,u.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new f("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");e.observacoes!==void 0&&(s.push(...C("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),e.observacoes)),n.definir({txaObservacoes:e.observacoes})),e.interessados!==void 0&&(s.push(...C("Interessados",ko(n.itensLupa("selInteressadosProcedimento")).join("; "),ko(e.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",e.interessados));let c={alvo:t.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?a.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:a.sinal,operacao:`a altera\xE7\xE3o do processo ${t.protocolo}`,sucesso:l=>R(l.url).get("acao")!=="procedimento_alterar"}),o.invalidar(t.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${t.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function sa(o,r,e){let a=r.protocolo,t=n=>e.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>t(i=>ea(o,a,n,i)),anotar:n=>t(i=>Io(o,a,n,i)),alternarItemDaAnotacao:n=>t(async i=>{let s=await uo(o.http,r);return Io(o,a,{texto:Xr(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>t(async n=>{let i=await uo(o.http,r);return i?Io(o,a,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:a,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>t(i=>aa(o,a,n,i)),marcar:n=>t(i=>Zo(o,a,n,i)),desmarcar:n=>t(i=>Zo(o,a,{marcador:n,remover:!0},i)),alterarProcesso:n=>t(i=>ia(o,a,n,i)),opcoesAtribuicao:()=>We(o.http,r),opcoesMarcador:()=>Je(o.http,r),opcoesAcompanhamento:()=>Ye(o.http,r),formularioDoProcesso:()=>Ke(o,r)}}var Qo=class extends Do{constructor(e,a,t){super(e,t);this.daTela=a}async arvore(){return this.daTela()}};function ca(o,r){return`${o}|${r}`}function pa(o){let r=lo(eo(o));return{host:r.host,login:r.usuario.login.toLowerCase(),unidade:{id:r.unidade.id,sigla:r.unidade.sigla}}}function la(o){let r=new Qo(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>eo(o.topo));return{doc:o.doc,topo:o.topo,arv:o.arv,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:Mo(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??sa(r,o.arv,o.loja),recarregar:o.recarregar,aoPedirHistorico:o.aoPedirHistorico??(async()=>!1)}}function mt(o){return o.marcadores.map(r=>{let[e="",...a]=r.split(" \u2014 ");return{id:"",nome:e.trim(),texto:a.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function ft(o){return async()=>{try{return await o()}catch(r){throw new Error(pe(r))}}}function da(o){let r=gt(o);return Object.fromEntries(Object.entries(r).map(([e,a])=>[e,ft(a)]))}function gt(o){let r=Mo(o.arv),e={disponivel:!1,motivo:"consultas"},a={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?e:r.consultar?{disponivel:!0,valor:await na(o.http,o.arv)}:a,anotacao:async()=>o.consultasDesativadas?e:r.anotar?{disponivel:!0,valor:await uo(o.http,o.arv)}:a,marcador:async()=>o.consultasDesativadas||!r.marcar?{itens:mt(o.arv),editavel:!1}:{itens:await Xe(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?e:r.acompanhar?{disponivel:!0,valor:await Be(o.http,o.arv)}:a,atribuicao:async()=>({...Ge(o.arv,o.unidadeSigla),editavel:r.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function or(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function ua(o){o.documentElement?.setAttribute(hr,"1")}function ma(o){try{for(let r=o;r!==r.top;r=r.parent)if(r.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var vt='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function fa(o,r,e){for(let a of o.querySelectorAll(vt)){a.classList.toggle(r,e);let t=[...a.children].find(n=>n.classList.contains(r));if(e&&!t&&a.prepend(p("div",{class:r})),!e)for(let n of[...a.children])n.classList.contains(r)&&n.remove()}}function ga(o){if(o.sigiloso)return()=>{};let r=()=>{let a=o.loja.ler("dadosProcesso").dado;a?.disponivel&&(fa(o.doc,"urgentePro",$(a.valor.especificacao,"URGENTE")),o.usaTrancado&&fa(o.doc,"trancadoPro",$(a.valor.especificacao,"TRANCADO")))},e=o.loja.aoMudar(a=>{a==="dadosProcesso"&&r()});return r(),e}Nr(`${tr}
${gr}`);or(window)&&ua(document);var va=window;if(!va.__seiProProcessoPaineis&&or(window)&&!ma(window)){va.__seiProProcessoPaineis=!0;let o=()=>void ht().catch(r=>console.warn("[SEI Pro] pain\xE9is do processo:",r));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}async function ht(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues");if(!ar(o,"infoarvore")||!qr(localStorage))return;let r=await _e(document);if(!r){console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo.");return}let e=fr(),a=pa(e),t=r.nivel==="sigiloso",n=new vo(rr(chrome.storage.local,"local"),ca(a.host,a.login),r.idProcedimento,{sigiloso:t}),i=mo(location.href),s=To(o,"disablequery"),c=da({http:i,arv:r,loja:n,unidadeSigla:a.unidade.sigla,consultasDesativadas:s}),l=la({doc:document,topo:e,arv:r,loja:n,...a,habilitados:Pr(zr(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:To(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:d=>{let u=c[d];u&&n.carregar(d,u)}});$e(l),ga(l);for(let d of Re(l))l.recarregar(d)}})();
