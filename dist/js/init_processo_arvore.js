/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Xi(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function lt(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Xi(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function Ce(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function qo(o,e){let r=Ce(o,e);return!(r===!1||r===0||r==="")}function hr(o,e){let r=Ce(o,e);return r===!0||r===1||r==="1"}var pt=`/*
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
`;var Ki={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function lo(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Ki[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var dt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Ji={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Ie(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Ji[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var Zi=/[A-Za-z0-9\-_.*]/;function ut(o){let e="";for(let r of o)r===" "?e+="+":Zi.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function mt(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${ut(Ie(r))}=${ut(Ie(t??"",a))}`}).join("&")}function gt(o){let e=r=>encodeURIComponent(Ie(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var ft="application/x-www-form-urlencoded";function br(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=dt[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var vt="application/x-www-form-urlencoded; charset=ISO-8859-1";var ht=null;function Fo(o){return ht?ht(o):new DOMParser().parseFromString(o,"text/html")}function w(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var E=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Ao(o){if(o instanceof E)return o;if(o instanceof DOMException&&o.name==="AbortError")return new E("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new E("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function bt(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Fo(r)}}}function xt(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new E("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new E("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=w(r);throw new E("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new E("SEI_VALIDACAO",r,r)}return o}function ce(o,e={}){let r=new URL(".",o),t=e.fetch??((...g)=>fetch(...g)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(g){n>=a&&await new Promise(u=>i.push(u)),n+=1;try{return await g()}finally{n-=1,i.shift()?.()}}let c=g=>new URL(g.replace(/&amp;/g,"&"),r).href;async function p(g,u,m){return s(async()=>{try{let f=await t(c(g),{credentials:"same-origin",redirect:"follow",...u,signal:m.sinal}),h=br(await f.arrayBuffer());return xt(bt(f.url||c(g),f.status,h),m)}catch(f){throw Ao(f)}})}async function d(g,u={}){return s(async()=>{try{let m=await t(c(g),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),f=new Uint8Array(await m.arrayBuffer()),h=(m.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();h==="text/html"&&xt(bt(m.url||c(g),m.status,br(f)),u);let A=m.headers?.get("content-disposition")??"",D=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(A)?.[1]??/filename="?([^";]+)"?/i.exec(A)?.[1]??"");return{bytes:f,tipo:h,nome:D}}catch(m){throw Ao(m)}})}return{base:r,absoluta:c,baixar:d,obter:(g,u={})=>p(g,{method:"GET"},u),enviar:(g,u,m={})=>p(g,m.utf8?{method:"POST",headers:{"Content-Type":ft},body:gt(u)}:{method:"POST",headers:{"Content-Type":vt},body:mt(u,m.modos)},m)}}function Mo(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function At(){try{return window.top?.document??document}catch{return document}}var Et=`/*
 * Pain\xE9is abaixo da \xE1rvore do processo (op\xE7\xE3o A da spec: lista refinada) e seus modais.
 * As cores v\xEAm dos tokens --spro-* de sei-comum/src/ui/base.css (anexado antes deste arquivo). O escuro vem de
 * data-tema="escuro" na raiz dos pain\xE9is e no di\xE1logo (o quadro e a janela de topo s\xE3o documentos diferentes).
 */
/* Os tokens do base.css seguem o esquema de cores do SISTEMA quando ninguem fixou o tema; aqui o tema e o do SEI
   (claro por padrao, escuro quando o SEI esta escuro), nunca o do sistema operacional. */
.spro-p-raiz,
.spro-pm,
.spro-g-impressao,
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
.spro-pm[data-tema="escuro"],
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
`;var os={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function le(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=os[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function xr(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=le(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function U(o){return typeof o=="string"?lo(o):o==null?"":String(o)}var es=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Eo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(es))e.add(r[0]);return[...e]}function G(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function q(o,e,r={}){let t=Array.isArray(o)?o:Eo(o);for(let a of t){let n=G(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function Pt(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=Eo(r).filter(i=>G(i).get("acao")===e),n=(t.length?t:Eo(o.html).filter(i=>G(i).get("acao")===e)).sort((i,s)=>[...G(i).keys()].length-[...G(s).keys()].length)[0];if(!n)throw new E("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function yt(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=xr(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=le(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Dt(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=xr(o,r.index+r[0].length);e.push({tipo:U(t[0]),idPai:U(t[2]),href:U(t[3]),titulo:U(t[5]),icone:U(t[6]),extra:t[8]==null?void 0:U(t[8])})}return e}function wt(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function St(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>U(e[1])))]}function Ct(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var rs=/\s*\(\d{5,}\)\s*$/;function It(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=U(r.args[1]),a=U(r.args[5]),n=U(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(g=>g.tipo==="ASSINATURA"&&g.idPai===t),{nivel:c,hipotese:p}=wt(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:U(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(rs,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:p,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(g=>g.tipo==="UNIDADE_GERADORA"&&g.idPai===t)?.extra,link:U(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:Eo(r.props.acoes??""),botoes:St(r.props.acoes??""),funcoes:Ct(r.props.acoes??"")}})}function Ot(o){return It(yt(o.html),Dt(o.html))}function Ar(o){let e=o.html,r=yt(e),t=Dt(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new E("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=U(a.args[1]),i=wt(t,n),s=It(r,t);return{idProcedimento:n,protocolo:U(a.args[5])||U(a.args[15]),tipo:U(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:Eo(a.props.acoes??""),botoesProcesso:St(a.props.acoes??""),funcoesProcesso:Ct(a.props.acoes??""),linkProcesso:U(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Eo(e),pagina:o}}async function Mt(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new E("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=q(t.html,"procedimento_visualizar")&&Eo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Ar(t)}function W(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?q(t.acoes,e):null}return q(o.acoesProcesso,e)??q(o.links,e,{id_procedimento:o.idProcedimento})}function Y(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var Vo={publico:"0",restrito:"1"},Uo={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function Go(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(lo(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var _t="\xA5",Er="\xB1";function Tt(o){return o.map(e=>`${e.id}${Er}${e.texto}`).join(_t)}function ts(o){return o?o.split(_t).map(e=>{let[r,...t]=e.split(Er);return{id:r,texto:t.join(Er)}}):[]}function Nt(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var _=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=as(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,w(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Lt(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??w(t),texto:w(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=to(r),n=t.find(i=>i.valor===r)??t.find(i=>to(i.texto)===a)??Pr(t.filter(i=>to(i.texto).includes(a)));if(!n)throw new E("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?ts(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Tt(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new E("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new E("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new E("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${w(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??Pr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??w(r)??e]:[e,e]}hiddenDaLupa(e){let r=Nt(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Nt(this.pagina.html)){let t=this.elemento.querySelector(`select#${Lt(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:w(n)}));(this.valor(r)??"")||this.definir({[r]:Tt(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function as(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(p=>p.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??w(p)})}}return e}function to(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function jo(o,e,r){let t=to(e),a=o.find(n=>n.id===e)??o.find(n=>to(n.texto)===t)??Pr(o.filter(n=>to(n.texto).includes(t)));if(!a)throw new E("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function Pr(o){return o.length===1?o[0]:void 0}function Lt(o){return o.replace(/([^\w-])/g,"\\$1")}function ns(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function is(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function pe(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=ns(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:is(o),sigla:w(r)||w(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var ss=3e4,Oe=class{constructor(e,r=null,t){this.paginaViva=r;this.http=ce(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new E("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return pe(this.base())}linkMenu(e){return Pt(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new E("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=_.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=G(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new E("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=G(lo(c)).get("id_procedimento")??"",g=s.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:g&&g!==d?g:void 0,linkArvore:lo(c)};return this.localizados.set(t,u),u}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<ss)return a.arvore;let n=await Mt(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:lo(i[1]),texto:lo(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=Fo(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function Bo(o,e,r){let t=W(o,e);if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function de(o,e,r){let t=await _.abrir(o,Bo(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var kt=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Rt(o,e,r){let t=kt.exec(r),a=r.replace(kt,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function cs(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(w(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>w(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Rt(s||void 0,w(i[t]),w(i[a]))}async function $t(o,e,r){let t=await o.obter(Bo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=_.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Rt(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=cs(t);if(a===void 0)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",w(t.doc.querySelector("title")));return a}function ls(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?le(o.pagina.html,e.index+e[0].length-1)[0]:""}function ps(o){if(!o.trim())return[];let e=Fo(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:w(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function Ht(o,e){let r=ps(ls(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??pe(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!W(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}var Me=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function zt(o,e){let r=o.filter(i=>i.unidade===e),t=i=>i.reduce((s,c)=>!s||Me(c.data)>Me(s.data)?c:s,null),a=t(r.filter(i=>i.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(i=>i.descricao.includes("Processo retirado do bloco")));return n&&Me(a.data)<Me(n.data)?null:a.descricao}function Te(o){let e=t=>!!W(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function qt(o,e,r){let t=await o.obter(Bo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",w(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:w(s[1]),texto:w(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:w(s[3]),data:w(s[4])}})}async function Ft(o,e,r){let a=(await _.abrir(o,Bo(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function Vt(o,e,r){let t=await o.obter(Bo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=q(t.html,"andamento_marcador_cadastrar");if(!i)throw new E("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:w(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function Ut(o,e,r){let t=await o.obter(Bo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>q(t.html,p)).find(Boolean);if(!c)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=_.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function Gt(o,e,r){let t=W(e,"procedimento_alterar")??W(e,"procedimento_consultar");if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await _.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),async hipoteses(c,p){return(await Go(o,a,c,p)).map(d=>({valor:d.id,texto:d.texto}))}}}var Ne=(o,e)=>o>0&&e-o<18e5;var ue=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function yr(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:zt(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function Le(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:Ne(e.coletadoEm,o.agora().getTime())}:null}async function jt(o){let e=await Le(o);return e?.vale?(yr(o,e.historico),!0):!1}async function Wo(o,e={}){if(o.sigiloso)throw new ue;let r=await Le(o);if(r?.vale&&!e.forcar)return yr(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),yr(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var Bt="data-seipro-processo-paineis",Wt="data-seipro-processo-menu",Xt="data-seipro-processo-capa",Yt="data-seipro-processo-gantt",_e="spro-processo-gantt-abrir",ke="spro-processo-capa-pedir",Re="spro-processo-capa-calcular",$e="spro-processo-capa-cancelar",He="data-spro-capa-coleta";var ze="processo/",Dr=(o,e)=>`${ze}${o}/${e}`,wr=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},Sr="processo-historico/",Cr=(o,e)=>`${Sr}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var po={fill:"currentColor",stroke:"none"},Kt="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Jt={estrela:[["path",{d:Kt}]],estrelaCheia:[["path",{d:Kt,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...po}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...po}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...po}],["circle",{cx:"12",cy:"12",r:"1.4",...po}],["circle",{cx:"19",cy:"12",r:"1.4",...po}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...po}],["circle",{cx:"15",cy:"6",r:"1.3",...po}],["circle",{cx:"9",cy:"12",r:"1.3",...po}],["circle",{cx:"15",cy:"12",r:"1.3",...po}],["circle",{cx:"9",cy:"18",r:"1.3",...po}],["circle",{cx:"15",cy:"18",r:"1.3",...po}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Yl=Object.keys(Jt);function M(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of Jt[o]){let c=r.createElementNS(t,i);for(let[p,d]of Object.entries(s))c.setAttribute(p,d);a.append(c)}return a}function ds(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Zt(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function Qt(o,e,r,t,a){let n=o.body??o.documentElement;for(let g of[n,...o.querySelectorAll("dialog")])for(let u of[...g.children])u.classList.contains("spro-aviso")&&u.remove();let i=l("div",{class:"spro-aviso",role:"status"},M("check",16),l("span",{},e),...ds(r).map(g=>l("button",{type:"button",onclick:()=>{i.remove(),g.fazer()}},g.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let g=Zt(o);g.append(i),s(),g.localName==="dialog"&&g.addEventListener("close",()=>{if(!(!d||!g.contains(i))){if(a&&Zt(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){d=!1,i.remove();return}p()}},{once:!0})},d=!0;return p(),setTimeout(()=>{d=!1,i.remove()},t),i}async function Ir(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function F(o,e,r=4e3){try{Qt(o.topo,e,void 0,r)}catch{}}async function oa(o,e){let r=await Ir(o.doc,e);F(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var ea={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},ra={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function Po(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function qe(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":Po(o)}var us=/[\u0300-\u036f]/g,Or=o=>o.normalize("NFD").replace(us,""),Mr=o=>Or(o).toLowerCase().replace(/\s+/g," ").trim(),me=o=>String(o).padStart(2,"0"),Fe=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,ta=/(\d{1,2}):(\d{2})/;function ge(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=Or(e),t=r.length===e.length?r:e,a=Fe.exec(t);if(!a)return{prazo:null,texto:e};let n=ta.exec(t.slice(a.index+a[0].length))??ta.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${me(Number(a[2]))}-${me(Number(a[1]))}`,c=n?`${me(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:d}}function na(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var ms=864e5;function Xo(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(s.getFullYear(),s.getMonth(),s.getDate()),d=Math.round((p.getTime()-c.getTime())/ms);return d===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Ve(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function ia(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var fe=500,gs=/^\s*\[( |x|X)\]\s?/;function Ue(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=gs.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function sa(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function ca(o,e){let r=Ue(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",sa(r))}function la(o,e,r){let t=Ue(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return sa(t)}function fs(o){let e=Fe.exec(Or(o));return e?`${me(Number(e[1]))}/${me(Number(e[2]))}/${e[3]}`:null}function pa(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return Fe.test(o)?o.replace(Fe,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function Ge(o){let e=fs(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function so(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function da(o,e){return so(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function aa(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function ua(o,e,r){return[{unidade:e,observacao:aa(o)},...r.map(a=>({unidade:a.unidade,observacao:aa(a.observacao)}))].filter(a=>a.observacao)}function ma(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function ga(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function fa(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function va(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function ha(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function ba(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var xa="spro-processo-estilo",Tr="";function Aa(o){Tr=o}function Yo(o){if(!Tr||o.getElementById(xa))return;let e=o.createElement("style");e.id=xa,e.textContent=Tr,(o.head??o.documentElement).append(e)}function wo(o){let e=ba(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function je(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function $(o,e){Yo(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});wo(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},M("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},M(e.icone,18)),l("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let d of p)d.disabled=!0;r.setAttribute("aria-busy","true");try{let d=await c();return t=!1,r.close(),d&&F(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){t=!1,a.disabled=!1;for(let g of p)g.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(Po(d)),!1}}}}function Be(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function uo(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function X(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function K(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function To(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function No(o,e,r,t){let a=l("select",{class:"spro-campo spro-p-lista",size:String(Math.min(8,Math.max(4,o.length))),"aria-label":r}),n=e??"",i=p=>{let d=Mr(p),g=d?o.filter(u=>Mr(u.texto).includes(d)):o;a.replaceChildren(...g.map(u=>{let m=l("option",{value:u.valor},u.texto);return m.selected=u.valor===n,m}))};a.addEventListener("change",()=>{n=a.value,t?.(n)});let s=l("input",{type:"search",class:"spro-campo",placeholder:"Buscar\u2026","aria-label":`Buscar em ${r}`});return s.addEventListener("input",()=>i(s.value)),i(""),{el:l("div",{class:"spro-p-busca"},o.length>8?s:null,a),valor:()=>n,definir(p){n=p,i(s.value)}}}function Ko(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),i=l("button",{type:"button",class:"spro-botao"},"Cancelar"),s=$(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),X(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}var mo={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},vs=120*1e3;function co(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var So=(o,e)=>o.startsWith(co(e));function Nr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function hs(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function Jo(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function bs(o){let e=[];return o.forEach((r,t)=>{let a=hs(r.dataISO||Nr(r.data));a&&e.push({a:r,t:a,i:t,d:co(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function Pa(o,e){return co(o)===co(e)}function ya(o,e,r){return Pa(o.unidade,e)?!o.unidadeNome||!r||co(o.unidadeNome)===co(r):!1}function ve(o,e,r){let t=o.filter(i=>Pa(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?co(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(i=>ya(i,e,r));return n.length?n:t}function xs(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,i)=>n.recebido.getTime()<r(i)&&i.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(co(n.unidade),[...a.get(co(n.unidade))??[],n]);for(let[n,i]of a){let s=i.some(c=>i.some(p=>c.unidadeNome&&p.unidadeNome&&co(c.unidadeNome)!==co(p.unidadeNome)&&t(c,p)));for(let c of i)c.chave=s&&c.unidadeNome?`${n}|${co(c.unidadeNome)}`:n}}function Ea(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${mo.remetidoPrefixo}`,"i"),"")).trim()}function As(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function Da(o,e){let r=bs(o),t=[],a=[],n=[],i=[],s=(m,f)=>ve(a,m,f)[0],c=(m,f)=>{let h=ve(n,m,f)[0];return h?n.indexOf(h):-1},p=(m,f)=>{let{a:h}=m;if(a.some(b=>ya(b,h.unidade,h.unidadeNome)))return;let A={unidade:h.unidade,...h.unidadeNome?{unidadeNome:h.unidadeNome}:{},chave:"",recebido:m.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:f,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:h.usuario,...h.usuarioNome?{usuarioRecebeuNome:h.usuarioNome}:{}},D=c(h.unidade,h.unidadeNome);if(D>=0){let[b]=n.splice(D,1);A.chegouEm=b.em,A.origem=b.origem}a.push(A),t.push(A)},d=(m,f,h)=>{m.remetido=f.t,m.fim=h,m.usuarioEnviou=f.a.usuario,f.a.usuarioNome&&(m.usuarioEnviouNome=f.a.usuarioNome),a.splice(a.indexOf(m),1)},g=m=>{let{a:f}=m;if(s(f.unidade,f.unidadeNome))return;let h=c(f.unidade,f.unidadeNome),A={em:m.t,unidade:f.unidade,...f.unidadeNome?{unidadeNome:f.unidadeNome}:{},origem:Ea(f),usuario:f.usuario,...f.usuarioNome?{usuarioNome:f.usuarioNome}:{}};h>=0?n[h]=A:n.push(A)};for(let m=0;m<r.length;){let f=m+1;for(;f<r.length&&r[f].t.getTime()===r[m].t.getTime();)f+=1;let h=r.slice(m,f);m=f;for(let A of h)So(A.d,mo.remetidoPrefixo)&&g(A);for(let A of h)So(A.d,mo.recebido)&&p(A,"recebido");for(let A of h){let{a:D,d:b}=A;if(mo.gerado.some(y=>So(b,y)))p(A,"gerado");else if(So(b,mo.reabertura))p(A,"reabertura");else if(So(b,mo.conclusao)){let y=s(D.unidade,D.unidadeNome);y&&d(y,A,"conclusao")}else if(So(b,mo.remetidoPrefixo)){let y=Ea(D),P=D.unidadeCitadaNome,O=s(y,P);if(O)d(O,A,"remessa"),O.destinos.push(D.unidade);else{let I=ve(t,y,P).at(-1);I?.fim==="remessa"&&I.remetido&&A.t.getTime()-I.remetido.getTime()<=vs&&!I.destinos.includes(D.unidade)&&I.destinos.push(D.unidade)}}else So(b,mo.documentoGerado)?i.push({ev:A,assinado:!1}):So(b,mo.documentoAssinado)&&i.push({ev:A,assinado:!0})}}for(let m of n)t.push({unidade:m.unidade,...m.unidadeNome?{unidadeNome:m.unidadeNome}:{},chave:"",recebido:m.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:m.em,origem:m.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:m.usuario,...m.usuarioNome?{usuarioEnviouNome:m.usuarioNome}:{}});for(let{ev:m,assinado:f}of i){let{a:h}=m,A=ve(t.filter(y=>!y.pendenteRecebimento&&y.recebido.getTime()<=m.t.getTime()),h.unidade,h.unidadeNome),D=[...A].reverse().find(y=>y.remetido===null||m.t.getTime()<=y.remetido.getTime())??A[A.length-1];if(!D)continue;let b={...h.nrSei?{nrSei:h.nrSei}:{},...h.idDocumento?{idDocumento:h.idDocumento}:{},em:m.t,titulo:As(h),...h.usuario?{usuario:h.usuario}:{}};(f?D.assinaturas:D.documentos).push(b)}t.sort((m,f)=>m.recebido.getTime()-f.recebido.getTime());for(let m of o){if(!m.aberto)continue;let f=ve(t.filter(h=>!h.pendenteRecebimento),m.unidade,m.unidadeNome).at(-1);f?.fim==="remessa"&&f.remetido&&(f.enviouEm=f.remetido,f.remetido=null,f.fim=null,f.mantidoAberto=!0)}let u=Jo(e).getTime();for(let m of t)m.emCurso=m.remetido===null,m.duracaoMs=Math.max(0,(m.remetido?.getTime()??u)-m.recebido.getTime());return xs(t,u),t.sort((m,f)=>m.recebido.getTime()-f.recebido.getTime())}var We=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],Es=3e4,Ps=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],ys=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],Zo=o=>String(o).padStart(2,"0"),Ds=o=>We.find(e=>e.id===o)?.pxPorDia??2.2,Lr=o=>`${Zo(o.getUTCDate())}/${Zo(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,J=o=>`${Lr(o)} ${Zo(o.getUTCHours())}:${Zo(o.getUTCMinutes())}`;function fo(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var Xe=o=>Math.round(Math.max(0,o)/864e5*10)/10,Co=o=>String(o).replace(".",","),he=o=>o.recebido.getTime()+o.duracaoMs,Lo=(o,e)=>e&&o?`${e} (${o})`:e??o??"",_r=(o,e)=>e>1?`${o} ${e}x`:o;function Sa(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=_r(a.sigla,a.passagens.length);return t}var wa=o=>Math.floor(o/864e5)*864e5;function Ye(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let d of o)t=Math.min(t,d.recebido.getTime()),a=Math.max(a,he(d),...d.documentos.map(g=>g.em.getTime()));if(!Number.isFinite(t)){let d=r.agora?.getTime()??0;t=d,a=d}r.agora&&o.some(d=>d.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=wa(t),i=wa(a)+864e5,s=Math.max(1,(i-n)/864e5),c=r.pxPorDia??Ds(e),p=Math.min(c,Es/s);return{escala:e,pxPorDia:p,origem:n,fim:i,largura:s*p,x:d=>(d-n)/864e5*p}}function Ca(o,e=1e3){for(let r of We)if(Ye(o,r.id).largura<=e)return r.id;return"mes"}function Ia(o){let e=[],r=[],t=o.fim,a=(i,s,c,p)=>{let d=o.x(s);i.push({x:d,largura:Math.max(0,o.x(Math.min(c,t))-d),rotulo:p})},n=i=>new Date(i);if(o.escala==="mes")for(let i=n(o.origem).getUTCFullYear();Date.UTC(i,0,1)<t;i++)a(e,Math.max(Date.UTC(i,0,1),o.origem),Date.UTC(i+1,0,1),String(i));else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;){let p=Math.max(Date.UTC(s,c,1),o.origem);a(e,p,Date.UTC(s,c+1,1),`${ys[c]} de ${s}`),c+=1,c>11&&(c=0,s+=1)}}if(o.escala==="dia")for(let i=o.origem;i<t;i+=864e5)a(r,i,i+864e5,String(n(i).getUTCDate()));else if(o.escala==="semana"){let s=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-s*864e5;c<t;c+=7*864e5){let p=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${Zo(p.getUTCDate())}/${Zo(p.getUTCMonth()+1)}`)}}else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;)a(r,Math.max(Date.UTC(s,c,1),o.origem),Date.UTC(s,c+1,1),Ps[c]),c+=1,c>11&&(c=0,s+=1)}return{cima:e,baixo:r}}function Qo(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var Ke={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function oe(o){return o.titulo||o.nrSei||"Documento"}var ws=8;function kr(o){let e=[],r=Qo(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${J(o.recebido)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${J(o.recebido)}${o.usuarioRecebeu?` por ${Lo(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${J(o.enviouEm)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${J(o.remetido)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${fo(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${oe(n)} - ${J(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,ws);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:Ke[r],linhas:e,...t.length?{documentos:a}:{}}}function Oa(o,e){return{titulo:oe(o),linhas:[{rotulo:"Gerado em",valor:`${J(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function Ma(o){let e=kr(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function Je(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:Xe(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function Ze(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,he(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var Qe=o=>_r(o.unidade,o.passagens);function Ta(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,Ss(r,o,a)},ocultar(){r.hidden=!0}}}function Ss(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,i=o.offsetHeight||120,s=a.left-t.left+a.width/2-n/2;s=Math.max(6,Math.min(s,t.width-n-6));let c=a.top-t.top-i-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(s)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function Na(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var Cs="http://www.w3.org/2000/svg",vo=150,V=46,be=50,_o=8,xe=20,Is=38,ko=6,La=16,Os=0;function C(o,e={},...r){let t=document.createElementNS(Cs,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var H=o=>Math.round(o*10)/10,_a=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function or(o,e,r={}){let t=`spro-g${++Os}`,a=r.larguraAlvo!==void 0,n=Sa(o),i=Ye(o,e,{...r.agora?{agora:r.agora}:{}}),s=a?Ye(o,e,{pxPorDia:(r.larguraAlvo-vo-La)/Math.max(1,(i.fim-i.origem)/864e5),...r.agora?{agora:r.agora}:{}}):i,c=vo+s.largura+La,p=V+Math.max(1,n.length)*be+8,d=C("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${H(c)} ${p}`,width:a?"100%":H(c),...a?{}:{height:p},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});d.append(C("defs",{},C("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},C("rect",{width:8,height:8,class:"listra-fundo"}),C("rect",{width:4,height:8,class:"listra-traco"})),C("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},C("rect",{width:6,height:6,class:"pontos-fundo"}),C("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let g=vo,u=Ia(s),m=C("g",{class:"spro-g-corpo"});n.forEach((b,y)=>{m.append(C("rect",{x:0,y:V+y*be,width:c,height:be,class:y%2?"raia-par":"raia-impar"}))});let f=C("g",{class:"spro-g-grade","aria-hidden":"true"});for(let b of u.baixo)f.append(C("line",{x1:H(g+b.x),x2:H(g+b.x),y1:V,y2:p,class:"grade"}));if(m.append(f),n.forEach((b,y)=>{let P=V+y*be,O=C("g",{class:"spro-g-raia","data-raia":b.chave});for(let I of b.passagens){let R=Qo(I),Q=g+s.x(I.recebido.getTime()),ao=Math.max(4,s.x(he(I))-s.x(I.recebido.getTime())),B=C("g",{class:`spro-g-barra ${R}`,"data-situacao":R,...a?{}:{tabindex:0,role:"img"},"aria-label":Ma(I)});if(B.append(C("rect",{x:H(Q),y:P+_o,width:H(ao),height:xe,rx:4,class:"fundo"})),R==="em-curso")B.append(C("rect",{x:H(Q),y:P+_o,width:H(ao),height:xe,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(R==="pendente")B.append(C("rect",{x:H(Q),y:P+_o,width:H(ao),height:xe,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(R==="mantido-aberto"&&I.enviouEm){let z=g+s.x(I.enviouEm.getTime());B.append(C("rect",{x:H(z),y:P+_o,width:H(Math.max(2,Q+ao-z)),height:xe,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),B.append(C("line",{x1:H(z),x2:H(z),y1:P+_o-3,y2:P+_o+xe+3,class:"marca-remessa"}))}if(ao>=44&&B.append(C("text",{x:H(Q+6),y:P+_o+14,class:"texto-barra"},fo(I.duracaoMs))),!a&&r.dica){let z=r.dica,bo=kr(I);B.addEventListener("pointerenter",()=>z.mostrar(bo,B)),B.addEventListener("pointerleave",()=>z.ocultar()),B.addEventListener("focus",()=>z.mostrar(bo,B)),B.addEventListener("blur",()=>z.ocultar())}O.append(B);for(let z of I.documentos){let bo=g+s.x(z.em.getTime()),eo=C("path",{d:`M${H(bo)} ${P+Is-ko}l${ko} ${ko}l-${ko} ${ko}l-${ko} -${ko}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${oe(z)}, ${J(z.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let go=r.dica,Do=Oa(z,I);go&&(eo.addEventListener("pointerenter",()=>go.mostrar(Do,eo)),eo.addEventListener("pointerleave",()=>go.ocultar()),eo.addEventListener("focus",()=>go.mostrar(Do,eo)),eo.addEventListener("blur",()=>go.ocultar()));let ro=()=>r.aoAbrirDocumento?.(z,I);eo.addEventListener("click",ro),eo.addEventListener("keydown",Oo=>{let Ho=Oo.key;(Ho==="Enter"||Ho===" ")&&(Oo.preventDefault(),ro())})}O.append(eo)}}m.append(O)}),d.append(m),r.agora&&o.some(b=>b.emCurso)&&r.agora.getTime()>=s.origem&&r.agora.getTime()<=s.fim){let b=H(g+s.x(r.agora.getTime()));d.append(C("g",{class:"spro-g-agora","aria-hidden":"true"},C("line",{x1:b,x2:b,y1:V,y2:p}),C("text",{x:Math.min(b+4,c-40),y:V+11},"Agora")))}let h=C("g",{class:"spro-g-cabecalho","aria-hidden":"true"});h.append(C("rect",{x:0,y:0,width:c,height:V,class:"cabecalho-fundo"}));for(let b of u.cima)h.append(C("line",{x1:H(g+b.x),x2:H(g+b.x),y1:0,y2:V,class:"grade-forte"})),b.largura>36&&h.append(C("text",{x:H(g+b.x+6),y:15,class:"eixo-cima"},b.rotulo));for(let b of u.baixo)b.largura>=14&&h.append(C("text",{x:H(g+b.x+b.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},b.rotulo));h.append(C("line",{x1:0,x2:c,y1:V,y2:V,class:"grade-forte"})),d.append(h);let A=C("g",{class:"spro-g-rotulos"});A.append(C("rect",{x:0,y:V,width:vo,height:p-V,class:"rotulos-fundo"})),n.forEach((b,y)=>{let P=V+y*be,O=C("text",{x:10,y:P+22,class:"rotulo-raia"},_a(b.rotulo,20)),I=b.nome&&b.nome!==b.sigla?b.nome:"",R=C("g",{"aria-label":`${b.sigla}${I?`, ${I}`:""}: ${b.passagens.length} passagem(ns)`,role:"img"},O);I&&R.append(C("text",{x:10,y:P+37,class:"rotulo-nome"},_a(I,24))),A.append(R)}),A.append(C("line",{x1:vo,x2:vo,y1:V,y2:p,class:"grade-forte"})),d.append(A);let D=C("g",{class:"spro-g-canto","aria-hidden":"true"},C("rect",{x:0,y:0,width:vo,height:V,class:"cabecalho-fundo"}),C("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),C("line",{x1:vo,x2:vo,y1:0,y2:V,class:"grade-forte"}),C("line",{x1:0,x2:vo,y1:V,y2:V,class:"grade-forte"}));return d.append(D),n.length===0&&d.append(C("text",{x:g+12,y:V+28,class:"rotulo-nome"},"Sem passagens.")),d}function ka(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let i=e.scrollLeft,s=e.scrollTop;r?.setAttribute("transform",`translate(0 ${s})`),t?.setAttribute("transform",`translate(${i} 0)`),a?.setAttribute("transform",`translate(${i} ${s})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var Ts=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function Ra(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...Ts]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",Ke[Qo(t)],J(t.recebido),a?J(a):"",Co(Math.round(t.duracaoMs/864e5*100)/100),fo(t.duracaoMs),t.pendenteRecebimento?"":Lo(t.usuarioRecebeu,t.usuarioRecebeuNome),Lo(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${oe(n)} (${Lr(n.em)})`).join(" | ")])}return Na(r)}function $a(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function Ha(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),i=o.createElement("a");return i.href=n,i.download=e,i.style.display="none",o.body.append(i),i.click(),i.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var Ns="spro-g-impressao";function Ls(o,e="mes"){let r=Ze(o.passagens),t=Je(o.passagens),a=[...o.passagens].sort((c,p)=>c.recebido.getTime()-p.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},Ke[Qo(c)]),l("td",{},J(c.recebido)),l("td",{},c.remetido??c.enviouEm?J(c.remetido??c.enviouEm):""),l("td",{},fo(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),i=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},Qe(c)),l("td",{},Co(c.dias)),l("td",{},`${Co(c.percentual)}%`),l("td",{},String(c.passagens)))))),s=or(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:Ns,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${fo(r.corridoMs)} (${Co(Xe(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${J(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},s),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),i)}function za(o,e,r="mes"){let t=o.defaultView??window,a=Ls(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var er=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${fo(o)}`,qa=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:Da(o,r)}),ks=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Fa(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,i=!1,s=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,p=l("div",{class:"spro-g-visao"}),d=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function g(v){if(i||e.sigiloso)return;let x=d();n?.abort();let S=new AbortController;n=S,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...x?{anterior:x}:{}},ro();try{let N=await Wo(e,{sinal:S.signal,forcar:v,aoProgresso:(T,k)=>{i||n!==S||r.tipo!=="coletando"||(r={...r,feito:T,total:k},ao())}});if(i||n!==S)return;r={tipo:"pronto",dados:qa(N.andamentos,N.coletadoEm,e.agora())}}catch(N){if(i||n!==S)return;N instanceof ue?r={tipo:"sigiloso"}:ks(N)||S.signal.aborted?r={tipo:"cancelado",...x?{anterior:x}:{}}:r={tipo:"erro",mensagem:Po(N),...x?{anterior:x}:{}}}finally{n===S&&(n=null)}ro()}function u(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},ro(),n.abort())}let m=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),f=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),h=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},m,f),A=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),D=l("div",{class:"spro-g-progresso"}),b=l("div",{class:"spro-g-aviso",role:"status"}),y=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),P=l("button",{type:"button",class:"spro-botao"},M("atualizar",15),"Atualizar"),O=l("button",{type:"button",class:"spro-botao"},M("planilha",15),"Exportar CSV"),I=l("button",{type:"button",class:"spro-botao"},M("imprimir",15),"Imprimir"),R=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),P,O,I);p.append(l("div",{class:"spro-g-topo"},h,A),D,b,y,R);let Q=(v,x=!1)=>{t=v,ro(),x&&(v==="gantt"?m:f).focus()};m.addEventListener("click",()=>Q("gantt")),f.addEventListener("click",()=>Q("tempo")),h.addEventListener("keydown",v=>{let x=v.key;(x==="ArrowRight"||x==="ArrowLeft"||x==="Home"||x==="End")&&(v.preventDefault(),Q(x==="Home"?"gantt":x==="End"||t==="gantt"?"tempo":"gantt",!0))}),P.addEventListener("click",()=>void g(!0)),O.addEventListener("click",()=>{let v=d();v?.passagens.length&&(Ha(e.topo,$a(e.protocolo),Ra(v.passagens)),F(e,"CSV do hist\xF3rico gerado.",2500))}),I.addEventListener("click",()=>{let v=d();v?.passagens.length&&za(e.topo,{protocolo:e.protocolo,passagens:v.passagens,agora:Jo(e.agora()),coletadoEm:Jo(new Date(v.coletadoEm))})});function ao(){if(r.tipo!=="coletando")return;let{feito:v,total:x,cancelando:S}=r,N=S?"Cancelando a coleta\u2026":x>0?`Coletando o hist\xF3rico: p\xE1gina ${v} de ${x}`:"Coletando o hist\xF3rico\u2026",T=D.querySelector(".spro-g-prog-barra"),k=D.querySelector(".spro-g-prog-texto");if(k&&(k.textContent=N),T){let io=x>0?Math.round(v/x*100):0;T.setAttribute("aria-valuenow",String(io));let se=T.firstElementChild;se&&(se.style.width=x>0?`${io}%`:""),T.classList.toggle("indeterminado",x<=0)}}function B(){if(r.tipo!=="coletando"){D.hidden=!0,D.replaceChildren();return}D.hidden=!1;let v=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},M("cancelar",14),"Cancelar coleta");v.addEventListener("click",u),D.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),v),ao()}function z(){let v=r,x=(T,k)=>{let io=l("button",{type:"button",class:"spro-botao pequeno"},T);return io.addEventListener("click",k),io};b.className="spro-g-aviso",b.replaceChildren(),b.hidden=!0;let S=(T,k,...io)=>{b.hidden=!1,b.className=`spro-g-aviso ${T}`,b.replaceChildren(M("alerta",15),l("span",{class:"spro-g-aviso-texto"},k),...io)},N=e.agora().getTime();v.tipo==="sigiloso"?S("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):v.tipo==="erro"?S("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${v.mensagem}`,x("Tentar de novo",()=>void g(!1))):v.tipo==="cancelado"?S("cancelado","Coleta cancelada.",x("Coletar de novo",()=>void g(!1))):v.tipo==="coletando"&&v.anterior&&!v.cancelando?S("desatualizado",`Mostrando o hist\xF3rico coletado ${er(N-v.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):v.tipo==="pronto"&&N-v.dados.coletadoEm>=18e5&&S("desatualizado",`Este hist\xF3rico foi coletado ${er(N-v.dados.coletadoEm)}.`,x("Atualizar agora",()=>void g(!0))),(v.tipo==="erro"||v.tipo==="cancelado")&&v.anterior&&S(v.tipo==="erro"?"erro":"cancelado",`${v.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${v.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${er(N-v.anterior.coletadoEm)} (desatualizado).`,x("Tentar de novo",()=>void g(!1)))}function bo(){s?.(),s=null,y.replaceChildren();let v=d();if(r.tipo==="sigiloso"){y.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!v){y.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!v.passagens.length){y.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}y.setAttribute("aria-labelledby",`${c}-aba-${t}`),y.append(t==="gantt"?eo(v):go(v))}function eo(v){let x=Jo(e.agora());a??=Ca(v.passagens,980);let S=a,N=l("div",{class:"spro-g-quadro"}),T=Ta(N,`${c}-dica`),k=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),io=or(v.passagens,S,{agora:x,dica:T,aoAbrirDocumento:(xo,zo)=>o.abrirDocumento(xo,zo)});k.append(io),N.prepend(k),s=ka(io,k),k.addEventListener("scroll",()=>T.ocultar());let se=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let xo of We){let zo=l("button",{type:"button","aria-pressed":String(xo.id===S),"data-escala":xo.id},xo.rotulo);zo.addEventListener("click",()=>{if(a===xo.id)return;let Wi=k.scrollWidth>0?k.scrollLeft/k.scrollWidth:0;a=xo.id,ro();let vr=y.querySelector(".spro-g-rolagem");vr&&(vr.scrollLeft=Wi*vr.scrollWidth)}),se.append(zo)}let ct=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");ct.addEventListener("click",()=>{k.scrollLeft=k.scrollWidth});let Bi=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([xo,zo])=>l("li",{},l("span",{class:`spro-g-amostra ${xo}`,"aria-hidden":"true"}),zo)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},se,ct,Bi),N)}function go(v){let x=Je(v.passagens),S=Ze(v.passagens),N=Math.max(1,...x.map(T=>T.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${S.passagens} passagem(ns) por ${S.unidades} unidade(s). Tempo corrido do processo: ${fo(S.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...x.map(T=>{let k=l("span",{class:`spro-g-barra-pct${T.emCurso?" em-curso":""}`});return k.style.width=`${Math.max(1,Math.round(T.percentual/N*100))}%`,l("tr",{},l("th",{scope:"row"},Qe(T),T.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},Co(T.dias)),l("td",{class:"num"},`${Co(T.percentual)}%`),l("td",{class:"num"},String(T.passagens)),l("td",{class:"barra","aria-hidden":"true"},k))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function Do(){let v=d(),x=r.tipo==="coletando",S=!v?.passagens.length;P.disabled=x||r.tipo==="sigiloso",O.disabled=S,I.disabled=S;let N=R.querySelector(".spro-g-frescor");N&&(N.textContent=v?`Coletado em ${J(Jo(new Date(v.coletadoEm)))} (${er(e.agora().getTime()-v.coletadoEm)})`:"")}function ro(){m.setAttribute("aria-selected",String(t==="gantt")),f.setAttribute("aria-selected",String(t==="tempo")),m.setAttribute("tabindex",t==="gantt"?"0":"-1"),f.setAttribute("tabindex",t==="tempo"?"0":"-1");let v=d();A.textContent=v?.passagens.length?`${v.passagens.length} passagem(ns)`:"",B(),z(),bo(),Do()}ro();let Oo=setInterval(()=>{i||Do()},3e4);Oo.unref?.();let Ho=(async()=>{if(e.sigiloso)return;let v=await Le(e);i||(v&&!v.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:qa(v.historico.andamentos,v.historico.coletadoEm,e.agora())},ro()),await g(!1))})();return{el:p,estado:()=>r,destruir(){i=!0,clearInterval(Oo),n?.abort(),s?.()},pronta:Ho}}function Rs(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function Va(o,e){let r=e.nrSei??e.titulo,t=Rs(o,e);if(!t)return F(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return F(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return $(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var Ua="spro-g-dialogo";function Ga(o,e={}){let r=o.topo.querySelector(`dialog.${Ua}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=Fa({ctx:o,abrirDocumento:n=>void Va(o,n),...e}),a=$(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(Ua),{...t,fechar:a.fechar}}function ja(o,e){let r=()=>{e().then(t=>{if(!t){F({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}Ga(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(_e,r),()=>o.removeEventListener(_e,r)}async function Rr(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var Wa=0,Xa=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Ae=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return Dr(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Xa(e)?e:null}catch{return null}}async gravar(e){if(!wr(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return Wa+=1,await Us(this.area,Wa%25===0),!0}};async function Us(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(ze)).length<=200)return 0;let r=await Rr(o,ze),t=Object.entries(r).filter(([,i])=>Xa(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var Ya=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),Ee=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return Cr(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Ya(e)?e:null}catch{return null}}async gravar(e){if(!wr(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Gs(this.area,this.agora()),!0}};async function Gs(o,e){try{let r=await Rr(o,Sr),t=Object.entries(r).filter(([,n])=>Ya(n)).map(([n,i])=>({k:n,em:i.coletadoEm})).sort((n,i)=>i.em-n.em),a=new Set;t.forEach((n,i)=>{(i>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(i=>i.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var Ws=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",rr=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new Ae(e,r,t),this.repoHistorico=new Ee(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}definir(e,r){this.fatias.set(e,r);for(let t of[...this.ouvintes])try{t(e)}catch{}if(r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:Ws(i),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var $r=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],Xs={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},Ys=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Ka(o){let e=new Set(o?.length?o:Ys),r=new Set(["descricao"]);for(let[t,a]of Object.entries(Xs))e.has(a)&&r.add(t);return r}var Ja=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),Hr={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};function ee(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},M(o.icone,14))}function Za(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=M("chevron",14),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("span",{class:"spro-p-icone","aria-hidden":"true"},M(o.icone,15)),l("h3",{},o.titulo),e,a),r),i=s=>{n.toggleAttribute("data-recolhido",!s),a.setAttribute("aria-expanded",String(s)),r.hidden=!s};return i(o.aberto),a.addEventListener("click",()=>{let s=n.hasAttribute("data-recolhido");i(s),o.aoAlternar(s)}),{el:n,definirAberto:i,atualizar(s,c){n.setAttribute("data-estado",s),e.replaceChildren(...(c.acoes??[]).map(ee)),r.replaceChildren(...c.corpo.filter(p=>p!=null&&p!==!1))}}}var Ks="configViewFlashPanelArvorePro",Qa="optionsPro";function zr(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function on(o){let e=zr(o,Ks);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function tr(o){let e=zr(o,Qa);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function en(o){return tr(o).optionsFlashMenu_panelinfo!=="disabled"}function rn(o,e){return tr(o)[`panelDadosArvorePro_${e}`]!=="hide"}function tn(o,e,r){try{let t=tr(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Qa,JSON.stringify(t))}catch{}}function ar(o,e){let r=zr(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function Pe(o,e){return tr(o)[`optionsFlashMenu_${e}`]!=="disabled"}function Js(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function an(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},M("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function Ro(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function Io(o){return l("div",{class:"spro-p-nota"},o)}function ho(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[an(o.erro??"",e)]:[Js(t)];let a=r(o.dado);return o.estado==="erro"?[...a,an(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}function nn(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os grupos\u2026")),a=$(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});o.op.opcoesAcompanhamento().then(({grupos:n,atual:i})=>{a.el.isConnected&&Zs(o,a,t,n,i,e,r)}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar os grupos."),t.replaceChildren()})}function Zs(o,e,r,t,a,n,i){let s=l("select",{class:"spro-campo","aria-label":"Grupo"},l("option",{value:""},"(sem grupo)"),...t.map(f=>l("option",{value:f.valor},f.texto)));s.value=a??"";let c=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});c.value=n?n.observacao??"":i.slice(0,450);let p=o.reaberturaProgramada||!!n?.reabertura,d=To("Reabertura programada",!!n?.reabertura,f=>g.hidden=!f),g=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!n?.reabertura});g.value=n?.reabertura?ga(n.reabertura):"";let u=K("Salvar",()=>void m()),m=async()=>{if(p&&d.input.checked&&!g.value){e.erro("Informe a data da reabertura.");return}let f=fa(c.value,p&&d.input.checked?ma(g.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.value,observacao:f}),[u])&&o.recarregar("acompanhamento")};Be(r,p?d.el:null,p?l("div",{class:"spro-p-grade"},g):null,uo("Grupo",s),uo("Observa\xE7\xE3o",c),X(u))}var j=(o,e)=>o.loja.ler(e);function Z(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void oa(o,e)},e,...t)}function re(o,e){return Io(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var oo=(...o)=>l("div",{class:"spro-p-linha"},...o);function Qs(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?Xo({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},M("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var sn={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=j(o,"acompanhamento"),r=j(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>nn(o,a,t)}]:[],corpo:ho(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[re(i.motivo,"O acompanhamento especial")];if(!i.valor)return[Ro("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:p}=i.valor;return[oo(Z(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),p?oo(Qs(p,o.agora())):null]})}}}};function nr(o,e){let r=l("textarea",{class:"spro-campo spro-p-anotacao",rows:"7",maxlength:String(fe),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});r.value=e?.texto??"";let t=l("span",{class:"spro-p-contador","aria-live":"polite"}),a=()=>{let m=fe-r.value.length;t.textContent=m<=0?"Limite de caracteres atingido.":`${m} caracteres restantes`};r.addEventListener("input",a),a();let n=m=>r.value.slice(0,m).split(`
`).length-1,i=l("button",{type:"button",class:"spro-botao pequeno","aria-label":"Transformar as linhas selecionadas em checklist"},M("check",14),"Checklist");i.addEventListener("click",()=>{r.value=la(r.value,n(r.selectionStart??0),n(r.selectionEnd??0)).slice(0,fe),a(),r.focus()});let s=l("input",{type:"date",class:"spro-campo spro-p-data","aria-label":"Data para inserir na anota\xE7\xE3o"});s.value=Ge(r.value)??"",s.addEventListener("change",()=>{s.value&&(r.value=pa(r.value,s.value).slice(0,fe),a())});let c=To("Prioridade",e?.prioridade??!1,()=>{}),p=K("Salvar",()=>void u(r.value,c.input.checked)),d=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover anota\xE7\xE3o"),g=$(o,{titulo:e?"Editar anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",icone:"nota",conteudo:[r,t,l("div",{class:"spro-p-ferramentas"},i,l("label",{class:"spro-p-opcao"},M("calendario",14),l("span",{},"Data"),s),c.el),X(e?d:null,p)]}),u=async(m,f)=>{await g.gravar(()=>o.op.anotar({texto:m.trim(),prioridade:f}),[p,d])&&o.recarregar("anotacao")};d.addEventListener("click",()=>{Ko(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(m=>{m&&u("",!1)})})}async function qr(o,e){try{await e()}catch(r){F(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var cn={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=j(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null;return{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void qr(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>nr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void Ko(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(a=>{a&&qr(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>nr(o,null)}]:[],corpo:ho(e,()=>o.recarregar("anotacao"),a=>{if(!a.disponivel)return[re(a.motivo,"As anota\xE7\xF5es")];if(!a.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>nr(o,null)},"Adicionar anota\xE7\xE3o"))];let{texto:n,prioridade:i}=a.valor,s=Ge(n),c=s?Xo({data:s,hora:"23:59",vencimento:!0},o.agora()):null,p=Ue(n).map((d,g)=>d.marca===null?l("div",{class:"spro-p-nota-linha"},d.texto||" "):l("label",{class:`spro-p-nota-linha item${d.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:d.marca==="feito",onchange:()=>void qr(o,()=>o.op.alternarItemDaAnotacao(g))}),l("span",{},d.texto)));return[l("div",{class:`spro-p-post-it${i?" prioridade":""}`},i?l("span",{class:"spro-p-chip vencido"},M("alerta",11),"prioridade"):null,...p,s&&c?l("span",{class:`spro-p-chip ${c.nivel}`},M("calendario",11),`${Ve({data:s,hora:"23:59",vencimento:!0})} \xB7 ${c.rotulo}`):null)]})}}}};function ln(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando a lista de usu\xE1rios\u2026")),a=$(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[t]});o.op.opcoesAtribuicao().then(({opcoes:n,atual:i})=>{if(!a.el.isConnected)return;let s=e.usuario?n.find(u=>u.texto.split(" - ")[0]?.trim().toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0,c=No(n,i??s,"usu\xE1rios da unidade"),p=K("Salvar",()=>void g(c.valor(),p,d)),d=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),g=async(u,...m)=>{if(u===""){a.erro("Escolha um usu\xE1rio.");return}let f=u===null?void 0:n.find(A=>A.valor===u);if(await a.gravar(()=>o.op.atribuir(u),m)){let[A="",...D]=(f?.texto??"").split(" - ");r(u===null?{usuario:null}:{usuario:A.trim(),nome:D.join(" - ").trim()})}};d.addEventListener("click",()=>void g(null,p,d)),t.replaceChildren(l("p",{class:"spro-p-nota"},"Atribuir para:"),c.el,X(e.usuario?d:null,p))}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar a lista de usu\xE1rios."),t.replaceChildren()})}var pn={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"pessoa",desenhar(o){let e=j(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:ho(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return oo(Z(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?ee({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>ln(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(d=>d===a?{...d,usuario:s.usuario,nomeUsuario:s.nome,texto:va(d.texto,s.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:s.usuario}})})}):null)}):[Io(t.texto||"Processo sem andamento aberto.")],1)}}}};var dn={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"camadas",desenhar(o){let r=j(o,"blocoInterno").dado;if(r&&Ne(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[oo(r.descricao?Z(o,r.descricao):Io("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,i)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${i}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};async function Fr(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var Vr=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function un(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=K("Salvar",()=>void n()),a=$(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[uo("Especifica\xE7\xE3o",r),X(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function mn(o,e){let r=Vr("Carregando os tipos de processo\u2026"),t=$(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[r]});Fr(o,t,r,a=>{let n=a.tipoAtual??a.tipos.find(c=>c.texto===e)?.valor,i=No(a.tipos,n,"tipos de processo"),s=K("Salvar",async()=>{if(!i.valor()){t.erro("Escolha um tipo.");return}await t.gravar(()=>o.op.alterarProcesso({tipo:i.valor()}),[s])&&o.recarregar("dadosProcesso")});r.replaceChildren(uo("Tipo de processo",i.el),X(s))})}function gn(o){let e=Vr("Carregando o formul\xE1rio do processo\u2026"),r=$(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});Fr(o,r,e,async t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(u=>l("button",{type:"button",role:"radio","aria-checked":String(u===a),"data-nivel":u},u==="publico"?"P\xFAblico":"Restrito")),i=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"}),c=null,p=[],d=async()=>{if(!c){s.replaceChildren(l("p",{class:"spro-p-nota"},"Carregando as hip\xF3teses legais\u2026"));try{p=await t.hipoteses("1"),c=No(p,t.hipoteseAtual,"hip\xF3teses legais"),s.replaceChildren(uo("Hip\xF3tese legal",c.el))}catch(u){s.replaceChildren(),r.erro(u instanceof Error?u.message:"N\xE3o foi poss\xEDvel carregar as hip\xF3teses legais.")}}};for(let u of n)u.addEventListener("click",()=>{a=u.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let m of n)m.setAttribute("aria-checked",String(m===u));s.hidden=a!=="restrito",a==="restrito"&&d()});let g=K("Salvar",async()=>{if(a==="restrito"&&!c?.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:c?.valor()??""}:{nivel:a}),[g])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,s,X(g)),a==="restrito"&&await d()})}function fn(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=K("Salvar",()=>void n()),a=$(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[uo("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),X(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function vn(o){let e=Vr("Carregando os interessados\u2026"),r=$(o,{titulo:"Interessados do processo",icone:"pessoa",conteudo:[e]});Fr(o,r,e,t=>{let a=new Map(t.interessados.map(s=>[s.id,s])),n=t.interessados.map(s=>{let c=l("button",{type:"button",class:"spro-p-acao perigo","aria-pressed":"false","aria-label":`Retirar ${s.texto}`},"Retirar"),p=l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},s.texto),c);return c.addEventListener("click",()=>{let d=a.has(s.id);d?a.delete(s.id):a.set(s.id,s),p.toggleAttribute("data-retirado",d),c.textContent=d?"Manter":"Retirar",c.setAttribute("aria-pressed",String(d)),i.disabled=a.size===t.interessados.length}),p}),i=K("Salvar",async()=>{await r.gravar(()=>o.op.alterarProcesso({interessados:t.interessados.filter(c=>a.has(c.id))}),[i])&&o.recarregar("dadosProcesso")});i.disabled=!0,e.replaceChildren(n.length?l("ul",{class:"spro-p-lista-modal"},...n):l("p",{class:"spro-p-nota"},"O processo n\xE3o tem interessados."),l("p",{class:"spro-p-nota"},"Para incluir um interessado, use Consultar/Alterar Processo no SEI."),X(i))})}var $o=o=>{let e=j(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},ye=o=>!o.sigiloso&&!!$o(o)?.editavel;async function ir(o,e){let r=$o(o);if(!r)return;let t=!so(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:da(r.especificacao,e).slice(0,100)});F(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){F(o,Po(a),7e3)}o.recarregar("dadosProcesso")}function sr(o,e,r=2){let t=j(o,"dadosProcesso");return ho(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[re(a.motivo,"Este dado")],r)}var hn={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"documento",desenhar(o){let e=j(o,"dadosProcesso"),r=$o(o),t=[];return r&&ye(o)&&(t.push({icone:"alerta",rotulo:so(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:so(r.especificacao,"URGENTE"),aoClicar:()=>void ir(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:so(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:so(r.especificacao,"TRANCADO"),aoClicar:()=>void ir(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>un(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:sr(o,a=>[oo(Z(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${so(a.valor.especificacao,"URGENTE")?"urgente":""} ${so(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},bn={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"pasta",desenhar(o){let e=$o(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&ye(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>mn(o,r)}]:[],corpo:[oo(Z(o,r||"(n\xE3o informado)"))]}}}},xn={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"cadeado",desenhar(o){let e=$o(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":ra.publico;return{estado:"pronto",desenho:{acoes:e&&ye(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>gn(o)}]:[],corpo:[oo(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},M(ea[r],13)),Z(o,a))]}}}},An={tipo:"interessados",titulo:"Interessados",icone:"pessoa",desenhar(o){return{estado:j(o,"dadosProcesso").estado,desenho:{acoes:$o(o)&&ye(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>vn(o)}]:[],corpo:sr(o,r=>r.valor.interessados.length?r.valor.interessados.map(t=>l("div",{class:"spro-p-linha interessado"},...ha(t).map(a=>Z(o,a)))):[Ro("Sem interessados.")])}}}},En={tipo:"assuntos",titulo:"Assuntos",icone:"etiqueta",desenhar(o){return{estado:j(o,"dadosProcesso").estado,desenho:{corpo:sr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>oo(Z(o,t))):[Ro("Sem assuntos.")])}}}},Pn={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"nota",desenhar(o){let e=j(o,"dadosProcesso"),r=$o(o);return{estado:e.estado,desenho:{acoes:r&&ye(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>fn(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:sr(o,t=>{let a=ua(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>oo(Z(o,`${n.unidade}: ${n.observacao}`))):[Io("Sem observa\xE7\xF5es.")]})}}}};var oc=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function Ur(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os marcadores\u2026")),t=$(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});o.op.opcoesMarcador().then(a=>{t.el.isConnected&&ec(o,t,r,a,e)}).catch(a=>{t.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar os marcadores."),r.replaceChildren()})}function ec(o,e,r,t,a){let n=a?ge(a.texto):{prazo:null,texto:""},i=No(t,a?t.find(h=>h.texto===a.nome)?.valor:void 0,"marcadores"),s=To("Controlar prazo",!!n.prazo,h=>g.hidden=!h),c=To("Controlar vencimento (\u201CAt\xE9\u201D)",!!n.prazo?.vencimento,()=>{}),p=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=n.prazo?.data??oc(o.agora());let d=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=n.prazo?.hora??"23:59";let g=l("div",{class:"spro-p-grade",hidden:!n.prazo},c.el,l("div",{class:"spro-p-par"},p,d)),u=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});u.value=n.texto;let m=K("Salvar",()=>void f()),f=async()=>{let h=t.find(b=>b.valor===i.valor());if(!h){e.erro("Escolha um marcador.");return}if(s.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let A=na({prazo:s.input.checked?{data:p.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:u.value}),D=await e.gravar(async()=>(a&&h.texto!==a.nome&&await o.op.desmarcar(a.nome),o.op.marcar({marcador:h.texto,texto:A})),[m]);return o.recarregar("marcador"),D};Be(r,uo("Marcador",i.el),a?l("p",{class:"spro-p-nota"},M("etiqueta",12),` Atual: ${a.nome}. Escolher outro troca o marcador.`):null,s.el,g,uo("Texto",u),X(m))}function rc(o,e){let{prazo:r}=ge(e);if(!r)return null;let t=Xo(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},M("relogio",11),`${r.vencimento?"at\xE9 ":""}${Ve(r)} \xB7 ${t.rotulo}`)}async function tc(o,e){if(await Ko(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);F(o,r.resumo)}catch(r){F(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function ac(o,e,r){let{texto:t}=ge(e.texto),a=e.icone?l("img",{class:"spro-p-marcador-icone",src:e.icone,alt:""}):M("etiqueta",14);return oo(l("div",{class:"spro-p-marcador"},Z(o,e.nome,"forte",a),rc(o,e.texto),t?Z(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},ee({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>Ur(o,e)}),ee({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void tc(o,e)})):null)}var yn={tipo:"marcador",titulo:"Marcador",icone:"etiqueta",desenhar(o){let e=j(o,"marcador"),r=ia(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>Ur(o)}]:[],corpo:[...ho(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>ac(o,a,t.editavel)):[Ro("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},M("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var Dn=[cn,pn,dn,yn,sn,hn,bn,xn,An,En,Pn];var wn=1e4;function Gr(o){if(!o.getElementById("frmArvore"))return null;try{return Ar(Mo(o))}catch{return null}}function jr(o,e=wn){return new Promise(r=>{let t=Gr(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=u=>{i||(i=!0,p?.disconnect(),clearTimeout(g),clearInterval(d),r(u))},c=()=>{let u=Gr(o);u&&s(u)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),g=setTimeout(()=>s(null),e)})}var Cn="data-spro-processo-raiz";function nc(o){for(let e of o.querySelectorAll(`[${Cn}], [data-spro-slot="atividades"]`))e.remove()}function In(o){return Dn.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&Ja.has(e.tipo)))}function On(o){let e=new Set;for(let r of In(o))for(let t of Hr[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function Sn(o){let e=o.doc;Yo(e),nc(e);let r=e.getElementById("frmArvore")??e.body,t=wo(e),a=(b="")=>l("div",{class:`spro-p-raiz ${b}`.trim(),[Cn]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let p=e.getElementById("divRelacionados");p?p.before(s):i.after(s),r.append(n);let d=new Map,g=In(o),u=b=>$r.indexOf(b);for(let b of g){let y=Za({tipo:b.tipo,titulo:b.titulo,icone:b.icone,aberto:rn(o.armazenamento,b.tipo),aoAlternar:P=>tn(o.armazenamento,b.tipo,P)});d.set(b.tipo,{def:b,casca:y})}for(let b of[...$r].sort((y,P)=>u(y)-u(P))){let y=d.get(b);y&&n.append(y.casca.el)}let m=d.get("anotacoes");m&&i.append(m.casca.el);let f=b=>{let y=d.get(b);if(!y)return;let P;try{P=y.def.desenhar(o)}catch(O){console.warn(`[SEI Pro] painel ${b}:`,O),P=null}y.casca.el.hidden=P===null,P&&y.casca.atualizar(P.estado,P.desenho)},h=b=>{if(b)f(b);else for(let y of d.keys())f(y)},A=o.loja.aoMudar(b=>{for(let[y,P]of d)Hr[P.def.tipo].includes(b)&&f(y)});h();let D=je(e,()=>{let b=wo(e);for(let y of[n,i])b?y.setAttribute("data-tema","escuro"):y.removeAttribute("data-tema")});return{raiz:n,redesenhar:h,desmontar(){A(),D(),n.remove(),i.remove(),s.remove()}}}function Mn(o,e,r={}){let t=Sn(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=Sn(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}var ic="seipro-historico-sessao",Br="seiProHistoricoRestauro",sc=600*1e3,Tn;function Wr(){if(Tn!==void 0)return Tn;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Ln(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};Wr()?.setItem(Br,JSON.stringify(t))}catch{}}function cr(){try{Wr()?.removeItem(Br)}catch{}}function Xr(o,e=Date.now()){try{let r=Wr()?.getItem(Br);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>sc?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var Nn=Promise.resolve();function _n(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return r.request(ic,e?{signal:e}:{},o).catch(n=>{throw Ao(n)});let t=Nn.then(()=>{if(e?.aborted)throw Ao(new DOMException("cancelado","AbortError"));return o()});return Nn=t.catch(()=>{}),t}var cc={resumido:"R",completo:"P",total:"T"};var lc=2e3;function kn(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function pc(o){let e=[...o.querySelectorAll("td")],r=w(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=w(e[3]),i={data:r,unidade:w(e[1]),...t?{unidadeNome:t}:{},usuario:w(e[2]),descricao:n},s=Nr(r);s&&(i.dataISO=s),a&&(i.usuarioNome=a),o.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let p=w(c);/^\d+$/.test(p)&&(i.nrSei=p);let d=G(c.getAttribute("href")??"").get("id_documento");d&&(i.idDocumento=d)}if(kn(n).startsWith(kn(mo.remetidoPrefixo))){let p=e[3]?.querySelector("a.ancoraSigla"),d=w(p);d&&(i.unidadeCitada=d);let g=p?.getAttribute("title")??"";g&&(i.unidadeCitadaNome=g)}return i}function Yr(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(w(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(pc),total:r}}function dc(o){if(o.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=W(o,"procedimento_consultar_historico")??q(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new E("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function ae(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function Kr(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(w(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Rn(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function uc(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let i=0;i<=a&&i+n<=t.length;i+=1){let s=!0;for(let c=0;c<n;c+=1)if(Rn(t[i+c])!==Rn(o.andamentos[c])){s=!1;break}if(s)return[...t.slice(0,i),...o.andamentos]}return null}async function mc(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=gc(o,t,r);return a||await _n(()=>fc(o,e,r),r.sinal)}catch(t){throw Ao(t)}}function gc(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(ae(e,"hdnTipoHistorico")||"R")!==r.tipo||(ae(e,"hdnInfraPaginaAtual")||"0")!=="0"||Xr(o.http.base.host))return null;let{itens:t,total:a}=Yr(e);return Kr(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:ae(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function $n(o,e,r){await _.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function fc(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",w(a.doc.querySelector("title")));let n=Xr(t);if(n){try{await $n(o,a,n),cr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let i={tipo:ae(a,"hdnTipoHistorico")||"R",pagina:ae(a,"hdnInfraPaginaAtual")||"0"},s=i,c=!1,p=async(d,g)=>{c||(Ln(t,i),c=!0);let u={tipo:r.tipo,pagina:String(g)},m=await _.de(d,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:u.tipo,hdnInfraPaginaAtual:u.pagina}).enviar({sinal:r.sinal});return s=u,m};try{let d=i.tipo===r.tipo&&i.pagina==="0"?a:await p(a,0);if(!d.doc.querySelector("#tblHistorico"))throw new E("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",w(d.doc.querySelector("title")));let g=Yr(d),u=ae(d,"hdnInfraHashCriterios"),m=g.total,f=m?Math.min(m,r.limite):r.limite,h=uc(r.cache,u,m,g.itens);if(h)return r.aoProgresso?.(1,1),{andamentos:h,total:m,hash:u,completo:!0,aproveitouCache:!0};let A=[...g.itens],D=g.itens.length,b=d.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,y=b>0?b:m>D&&D>0?Math.ceil(m/D):1;r.aoProgresso?.(1,y);for(let O=1;A.length<f&&Kr(d)&&O<lc;O+=1){d=await p(d,O);let I=Yr(d);if(!I.itens.length)break;A.push(...I.itens),r.aoProgresso?.(O+1,Math.max(y,O+1))}let P=m?A.length>=m:!Kr(d);return{andamentos:A,total:m||A.length,hash:u,completo:P,aproveitouCache:!1}}finally{if(c)if(s.tipo!==i.tipo||s.pagina!==i.pagina)try{await $n(o,a,i),cr()}catch{}else cr()}}var te=new Map;function vc(o,e){return`${o.http.base.host}|${G(e).get("id_procedimento")??e}`}function hc(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new E("CANCELADO","Opera\xE7\xE3o cancelada."));let t=vc(o,e),a=te.get(t);if(!a){let i=new AbortController,s=new Set,c={promessa:void 0,controle:i,interessados:0,progresso:s,ultimo:null};c.promessa=mc(o,e,{tipo:cc.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:i.signal,cache:r.cache,aoProgresso:(p,d)=>{c.ultimo=[p,d];for(let g of s)g(p,d)}}).finally(()=>{te.get(t)===c&&te.delete(t)}),c.promessa.catch(()=>{}),te.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((i,s)=>{let c=!1,p=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",d)},d=()=>{if(c)return;p(),n.interessados-=1;let g=new E("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){s(g);return}te.get(t)===n&&te.delete(t),n.controle.abort(),n.promessa.then(()=>s(g),()=>s(g))};r.sinal?.addEventListener("abort",d,{once:!0}),n.promessa.then(g=>{c||(p(),i(g))},g=>{c||(p(),s(Ao(g)))})})}function Hn(o,e,r={}){return hc(o,dc(e),r)}var ne=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Ot({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(bc(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function De(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function bc(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function qn(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function Fn(o,e,r){let t=W(o,e);if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Vn=o=>e=>G(e.url).get("acao")!==o;async function xc(o,e,r,t){let a=await o.http.obter(Fn(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return _.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>q(a.html,i)).find(Boolean);if(!n)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return _.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Jr(o,e,r,t){let a=await qn(o,e,t.sinal),n=await xc(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??Vn(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function lr(o,e,r,t){return Jr(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=Y("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...Y("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Un(o,e,r,t){return Jr(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=to(r),s=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=s.find(p=>p.valor===r)??s.find(p=>to(p.texto.split(" - ")[0])===i)??s.find(p=>to(p.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(p=>to(p.texto).includes(i)).length===1?s.find(p=>to(p.texto).includes(i)):void 0);if(!c)throw new E("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),Y("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function Gn(o,e,r,t){return Jr(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...Y("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...Y("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function Ac(o,e,r){let t=Fn(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function zn(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:w(t[1]),texto:w(t[2]),usuario:w(t[3]),data:w(t[4])}})}async function Zr(o,e,r,t){let a=await qn(o,e,t.sinal),n=await Ac(o,a,t.sinal),i=zn(n),s=to(r.marcador),c=i.find(u=>to(u.marcador)===s),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let u=q(n.html,"andamento_marcador_remover");if(!u)throw new E("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let m=_.de(n,"#frmGerenciarMarcador",o.http);m.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let f=await o.http.enviar(u,m.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(zn(f).some(h=>h.id===c.id))throw new E("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=_.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=q(n.html,"andamento_marcador_cadastrar");if(!u)throw new E("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await _.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let g=d.escolher("selMarcador",r.marcador);return d.definir({hdnIdMarcador:g.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?Y(`Texto do marcador ${g.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${g.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Vn("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${g.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${g.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function pr(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function jn(o,e,r){let t=W(e,"procedimento_alterar"),a=t??W(e,"procedimento_consultar");if(!a)throw new E("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await _.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function dr(o){return o.map(e=>e.texto).filter(Boolean)}var Ec={0:"publico",1:"restrito",2:"sigiloso"};async function Bn(o,e,r){let{form:t,editavel:a}=await jn(o,e,r),n=Ec[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:pr(t,"selHipoteseLegal").trim()||e.hipotese,s=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...i?{hipotese:i}:{},tipo:pr(t,"selTipoProcedimento")||e.tipo,especificacao:t.valor("txtDescricao")??"",assuntos:dr(t.itensLupa("selAssuntos")),interessados:dr(t.itensLupa("selInteressadosProcedimento")),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:Pc(t),editavel:a,...s?{autuacao:s}:{}}}function Pc(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=w(t[0]);a&&e.push({unidade:a,observacao:w(t[1])})}return e}async function Wn(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await jn(o.http,a,{sinal:t.sinal});if(!i)throw new E("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...Y("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=pr(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),s.push(...Y("Tipo",p,d.texto))}if(r.nivel!==void 0){let p=Uo[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:Vo[r.nivel]}),s.push(...Y("N\xEDvel de acesso",p,Uo[Vo[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=pr(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||Vo.restrito,g=jo(await Go(o,n,d,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:g.id}),s.push(...Y("Hip\xF3tese legal",p,g.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new E("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(s.push(...Y("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(s.push(...Y("Interessados",dr(n.itensLupa("selInteressadosProcedimento")).join("; "),dr(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>G(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function Xn(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>Un(o,t,n,i)),anotar:n=>a(i=>lr(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await de(o.http,e);return lr(o,t,{texto:ca(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await de(o.http,e);return i?lr(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>Gn(o,t,n,i)),marcar:n=>a(i=>Zr(o,t,n,i)),desmarcar:n=>a(i=>Zr(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>Wn(o,t,n,i)),opcoesAtribuicao:()=>Ft(o.http,e),opcoesMarcador:()=>Vt(o.http,e),opcoesAcompanhamento:()=>Ut(o.http,e),formularioDoProcesso:()=>Gt(o,e)}}var we=class extends Oe{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function Yn(o,e){return`${o}|${e}`}function Kn(o){let e=pe(Mo(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function Jn(o){let e=new we(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>Mo(o.topo)),r=new ne(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:Te(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??Xn(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>Hn(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await Wo(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}function yc(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function Dc(o){return async()=>{try{return await o()}catch(e){throw new Error(qe(e))}}}function Zn(o){let e=wc(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,Dc(t)]))}function wc(o){let e=Te(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await Bn(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await de(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:yc(o.arv),editavel:!1}:{itens:await qt(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await $t(o.http,o.arv)}:t,atribuicao:async()=>({...Ht(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function Qr(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function Qn(o){o.documentElement?.setAttribute(Bt,"1")}function oi(o){o.documentElement?.setAttribute(Wt,"1")}function ei(o){o.documentElement?.setAttribute(Yt,"1")}function ri(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function ti(o){o.documentElement?.setAttribute(Xt,"1")}function ai(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var ur=["Copiar","Abrir","Acoes"],ot={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},no={tipo:"local"},L=(...o)=>({tipo:"acao",acoes:o}),yo=(...o)=>({tipo:"funcao",funcoes:o}),mr=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:no,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:no,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:no,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:no,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:no,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:no,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:no,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:L("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:L("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:L("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:L("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:L("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:L("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:L("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:yo("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:yo("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:yo("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:L("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:yo("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:yo("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:L("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:L("md_pet_intimacao_cadastrar")}],ni=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:no},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:no},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:no},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:no},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:no},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:no},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:L("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:L("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:L("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:L("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:L("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:L("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:L("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:L("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:L("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:L("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:L("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:L("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:L("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:L("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:L("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:L("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:L("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:L("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:yo("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:yo("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:yo("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:yo("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:L("arvore_ordenar")}],gr="Ativar menu ao clicar",ii=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],si=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],ci=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],Sc={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},Cc=o=>Sc[o]??o;function li(o,e){let r=Cc(e);return o.find(t=>t.nome===r)}var Sm=mr.filter(o=>o.modo).map(o=>o.nome);function pi(o){return o.includes(" ")?o.split(" ").pop()??"":""}function ie(o){let e=pi(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function di(o){let e=o.trim(),r=pi(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function ui(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var Ic=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),et=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),rt=(o,e)=>`<a href="${Ic(o)}" target="_blank">${et(e)}</a>`,mi=o=>({texto:ie(o.rotulo)});function gi(o){let e=ie(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${di(o.rotulo)} (${ui(o.citacaoOpcao)}${e})`}}var fi=o=>({texto:o.linkDocumento});function vi(o){let e=ie(o.rotulo);return{texto:e,html:rt(o.linkDocumento,e)}}function hi(o){let e=ie(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:rt(o.linkDocumento,e)};let r=di(o.rotulo),t=ui(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${et(r)} (${et(t)}${rt(o.linkDocumento,e)})`}}var bi=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function tt(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function xi(o){return ur.flatMap(e=>o.filter(r=>r.grupo===e))}function at(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===gr)continue;let i=li(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var Ai=(o,e)=>{for(let r of e){let t=q([...o],r);if(t)return t}return null};function Ei(o,e){return e.find(r=>o?.includes(r))??null}var Pi={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function Oc(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var Mc=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function Tc(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:tt(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(mi(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(gi(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(fi(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(vi(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(hi(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(s?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let d=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!d)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let g=!1;if(/minuta/i.test(e.rotulo)){let u=await t.perguntarMinuta();if(!u)return;g=u==="remover"}await t.duplicar(d,g)}}}default:return{executar:()=>{}}}}function yi(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||ie(e.rotulo))||Mc.has(o.id)&&e.id.includes("-")?null:{...t,...Tc(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let d=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(d,Oc(e))}:{...t,executar:()=>a.abrirEmNovaAba(d)}}if(i.tipo==="acao"){let d=Ai(n.acoes,i.acoes);return d?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(d)}:{...t,executar:()=>a.abrirNoVisualizador(d)}:null}let s=Ei(n.funcoes,i.funcoes);if(!s)return null;let c=Pi[s];if(!c)return null;let p=async d=>{let g=await a.linkDaTela(n.link,c);if(!g)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);d==="aba"?a.abrirEmNovaAba(g):a.abrirNoVisualizador(g)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function Di(o,e){let r=[];for(let t of at(mr,e.selecao,ii)){let a=yi(t,o,e);a&&r.push(a)}return xi(r)}function fr(o,e,r){let t=[];for(let a of at(mr,r,ci)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=yi(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function wi(o){let e=o.servicos,r=[],t=tt(o.base,o.idProcedimento);for(let a of at(ni,o.selecao,si)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:bi(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=Ai(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=Ei(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=Pi[s];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return xi(r)}var Se="spro-pm-icone",Si="data-spro-pm-sig",Ci=["breackline_doc"];function Nc(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function Lc(o,e){return l("span",{class:`action-doc action-${o.modo} ${Se}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},M(o.icone,13))}function _c(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(Se))a.push(i);else{if(Ci.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(Si)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Ci.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=Lc(i,e);s.setAttribute(Si,t),n.after(s),n=s}return!0}function Ii(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=De(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let d=r(p,Nc(c)),g=fr(d,i,s);_c(c,p,g)&&(n+=1)}return n}function Oi(o){for(let e of o.querySelectorAll(`.${Se}`))e.remove()}function Mi(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let p=u=>{if(u.getAttribute("aria-busy")==="true")return;let m=u.getAttribute("data-id")??"",f=u.getAttribute("data-action")??"";u.setAttribute("aria-busy","true");let h=()=>{u.removeAttribute("aria-busy"),u.classList.add("feito"),setTimeout(()=>u.classList.remove("feito"),900)};Promise.resolve(e(m,f)).catch(A=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",A)).finally(h)},d=u=>{let m=u.target?.closest?.(`.${Se}`);m&&(u.preventDefault(),u.stopPropagation(),p(m))},g=u=>{if(u.key!=="Enter"&&u.key!==" ")return;let m=u.target?.closest?.(`.${Se}`);m&&(u.preventDefault(),p(m))};return o.addEventListener("click",d,!0),o.addEventListener("keydown",g,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",d,!0),o.removeEventListener("keydown",g,!0)}}var Ti=new Set;var kc=null;function Rc(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Ni(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Li(o,e,r){let t=o.ownerDocument,a=t.defaultView;Rc(o).append(e);let n=!0,i=()=>{if(!n)return;let u=o.getBoundingClientRect?.();if(!u)return;let m=a?.innerHeight??0,f=a?.innerWidth??0,h=Math.min(r.largura??Math.max(u.width,r.larguraMinima??0),Math.max(180,f-16)),A=r.alinharDireita?u.right-h:u.left,D=Math.max(8,Math.min(A,f-h-8)),b=r.alturaMaxima??360;e.style.maxHeight="none";let y=Math.min(e.scrollHeight||b,b),P=m-u.bottom-8,O=u.top-8,I=kc?.()??!1,R=!I&&P<Math.min(y,200)&&O>P;e.style.left=`${D}px`,e.style.width=`${h}px`,e.style.maxHeight=`${I?b:Math.max(140,Math.min(b,R?O:P>140?P:b))}px`,e.classList.toggle("spro-flutuante-cima",R),R?(e.style.top="",e.style.bottom=`${m-u.top+4}px`):(e.style.bottom="",e.style.top=`${u.bottom+4}px`),Ni(a,R?0:Math.ceil(u.bottom+4+y+12))},s=u=>{let m=u.composedPath?.()??[],f=u.target,h=A=>m.includes(A)||!!f&&!!A.contains?.(f);h(e)||h(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},p=u=>{u.target instanceof Node&&e.contains(u.target)||c()},d=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let g={ancora:o,fechar:()=>r.aoFechar()};return Ti.add(g),i(),{posicionar:i,fechar(){n&&(n=!1,Ti.delete(g),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),e.remove(),Ni(a,0))}}}function _i(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=u=>{let m=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${u.perigo?" spro-menu-perigo":""}${u.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":u.id,...u.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},M(u.icone,15)),l("span",{class:"spro-menu-rotulo"},u.rotulo),u.dica?l("span",{class:"spro-menu-dica"},u.dica):null);return m.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),!u.desativado&&(d(!0),r.aoEscolher(u))}),n.push(m),m};for(let u of ur){let m=e.filter(f=>f.grupo===u);m.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":ot[u]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},ot[u]),...m.map(s)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=u=>{if(!n.length)return;let m=(u+n.length)%n.length;for(let[f,h]of n.entries())h.setAttribute("tabindex",f===m?"0":"-1");n[m]?.focus?.({preventScroll:!0})};for(let u of n)u.addEventListener("pointermove",()=>c(n.indexOf(u)));let p=Li(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>d(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function d(u){if(i)return;i=!0;let m=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",g,!0),(u||m)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function g(u){if(u.key==="Escape"){u.preventDefault(),u.stopPropagation(),d(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let m=n.findIndex(f=>f.getAttribute("tabindex")==="0");switch(u.key){case"ArrowDown":c(m+1);break;case"ArrowUp":c(m-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[m]?.click();break;case"Tab":d(!0);return;default:return}u.preventDefault(),u.stopPropagation()}return t.addEventListener("keydown",g,!0),r.focar&&c(0),{el:a,fechar:()=>d(!1)}}async function Ri(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new E("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function $c(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?Vo[r.nivel]:n;if(r.nivel&&(a.push(...Y("N\xEDvel de acesso",Uo[n]??"",Uo[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new E("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await Go(o,e,i,t),c=jo(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function Hc(o,e,r){let t=await Ri(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=q(t.documento.acoes,a)??q(t.documento.acoes,/^documento_alterar/);if(!n)throw new E("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await _.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function zc(o,e,r){let t=W(e,"documento_escolher_tipo");if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await _.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=_.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function qc(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,w(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=G(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,w(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Fc(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await zc(o,e,t),i=qc(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new E("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:jo(i,r,"Tipo de documento")}}async function Vc(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=_.de(s,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),d=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(d?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let h=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(D=>D.valor===h&&D.valor!=="null"))throw new E("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${h}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:h,hdnIdTextoPadrao:h})}else if(n.textoPadrao){let h=c.opcoes("selTextoPadrao").filter(D=>D.valor!=="null").map(D=>({id:D.valor,texto:D.texto})),A=jo(h,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:A.id,hdnIdTextoPadrao:A.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await $c(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let g=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:h=>/acao_origem=documento_(?:gerar|cadastrar)/.test(h.url)||/editor_montar/.test(h.html)}),u=G(g.url).get("id_documento")??/id_documento=(\d+)/.exec(g.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:u,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let f=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(h=>h.id===u);return{idDocumento:u,numero:f?.numero??"",titulo:f?.titulo??""}}function ki(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var Uc=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function $i(o,e,r,t={}){let a=await Ri(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new E("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await Hc(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",d=p==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(b=>b.selecionada&&b.valor!=="null")?.valor)??void 0:void 0,g=i.valor("hdnIdSerie")??"";if(!g)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:u,tipo:m}=await Fc(o,n.arvore,g,r.sinal,!0),f={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${m.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...f,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:h,numero:A,titulo:D}=await Vc(o,e,n.arvore,u,m,{tipo:m.id,descricao:t.semMinuta?ki(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:Uc(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?ki(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:p,hipotese:d},r.sinal);return{...f,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${D||m.texto} ${A?`(${A}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:h,numero:A}}}var Gc="seipro-processo-menu",nt="data-spro-pm-pedido";async function jc(o,e){if(!e.html)return Ir(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function Hi(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function zi(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>F(e,i,s),n=(i,s,c)=>new Promise(p=>{let d=null,g=$(e,{titulo:i,icone:"alerta",largura:420,conteudo:[l("p",{},s),X(...c.map(u=>u.principal?K(u.rotulo,()=>{d=u.id,g.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{d=u.id,g.fechar()}},u.rotulo)))],aoFechar:()=>p(d)})});return{async copiar(i,s){let c=await jc(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=Hi(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=l("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=l("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await $i(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(Po(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),p=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(nt,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(Gc)),r.documentElement.hasAttribute(nt)&&(r.documentElement.removeAttribute(nt),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await ir(e,"URGENTE")},clicarBotaoNativo(i){for(let s of Hi(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var Bc="configViewFlashMenuPro",Wc="configViewFlashDocMenuPro",Xc="configViewFlashDocArvorePro";function qi(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;Yo(r);let n=new ne(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new we(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>Mo(e.topo)),c=o.servicos??zi({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,d=()=>!!W(i(),"documento_escolher_tipo"),g=v=>({selecao:v,citacao:Ce(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:d(),uploadLigado:qo(o.dataValues,"uploaddocsexternos"),loteLigado:qo(o.dataValues,"acoesemlote"),servicos:c}),u=()=>ar(e.armazenamento,Wc),m=()=>ar(e.armazenamento,Bc),f=()=>ar(e.armazenamento,Xc),h=()=>u()?.includes(gr)??!1,A=(v,x)=>{let S=n.obter(v);return S||(n.lerDoIframe(r),S=n.obter(v)),{id:v,rotulo:x,dado:S}},D={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},b=v=>{let x=v;if(!x?.closest)return null;let S=x.closest('a[id^="anchorImg"]');if(S){let T=De(S.id,"anchorImg");return T&&T!==e.arv.idProcedimento&&Pe(e.armazenamento,"menudoc")?{tipo:"documento",ancora:S,id:T}:null}let N=x.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return N&&Pe(e.armazenamento,"menuproc")?{tipo:"processo",ancora:N}:null},y=v=>{if(v.tipo==="processo")return{itens:wi(g(m())),rotulo:"Menu do processo"};let x=r.getElementById(`anchor${v.id}`),S=A(v.id,(x?.textContent??"").replace(/\s+/g," ").trim());return{itens:Di(S,g(u())),rotulo:"Menu do documento"}},P=null,O=null,I,R=()=>{clearTimeout(I),O&&clearTimeout(O.timer),O=null;let v=P;P=null,v?.menu.fechar()},Q=(v,x)=>{if(P?.ancora===v.ancora)return;R();let{itens:S,rotulo:N}=y(v);if(!S.length)return;let T=_i(v.ancora,S,{rotulo:N,escuro:wo(r),focar:x,rodape:[D],aoFechar:()=>{P?.menu===T&&(P=null)},aoEscolher:k=>{Promise.resolve().then(()=>k.executar()).catch(io=>{console.warn("[SEI Pro] menu da \xE1rvore:",io),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});P={menu:T,ancora:v.ancora},T.el.addEventListener("mouseenter",()=>clearTimeout(I)),T.el.addEventListener("mouseleave",()=>ao())},ao=()=>{clearTimeout(I),I=setTimeout(R,a)},B=v=>{let x=v;return x?!!(P&&(P.ancora.contains(x)||P.menu.el.contains(x))||O?.ancora.contains(x)):!1},z=v=>{if(B(v.target)){clearTimeout(I);return}let x=b(v.target);if(O&&(clearTimeout(O.timer),O=null),!x||x.tipo==="documento"&&h()){P&&ao();return}P&&ao(),O={ancora:x.ancora,timer:setTimeout(()=>{O=null,Q(x,!1)},t)}},bo=v=>{v.relatedTarget||(O&&(clearTimeout(O.timer),O=null),P&&ao())},eo=v=>{let x=b(v.target);if(x){if(x.tipo==="documento"&&h()){v.preventDefault(),v.stopImmediatePropagation(),P?.ancora===x.ancora?R():Q(x,!1);return}x.tipo==="documento"&&P?.ancora===x.ancora&&R()}},go=v=>{let x=b(v.target);!x||!(v.key==="ArrowDown"||(v.key==="Enter"||v.key===" ")&&x.tipo==="documento"&&h())||(v.preventDefault(),v.stopImmediatePropagation(),Q(x,!0))};r.addEventListener("mouseover",z),r.addEventListener("mouseout",bo),r.addEventListener("click",eo,!0),r.addEventListener("keydown",go,!0);let Do=null,ro=()=>{if(!Pe(e.armazenamento,"iconstree")){Oi(r);return}Ii(r,e.arv.idProcedimento,A,()=>g(u()),f)};Pe(e.armazenamento,"iconstree")&&(Do=Mi(r,async(v,x)=>{let S=r.getElementById(`anchor${v}`),N=A(v,(S?.textContent??"").replace(/\s+/g," ").trim());await fr(N,g(u()),f()).find(k=>k.modo===x)?.executar()},ro),ro());let Oo=n.acompanharPastas(r,()=>setTimeout(ro,80)),Ho=je(r,()=>{P&&(wo(r)?P.menu.el.setAttribute("data-tema","escuro"):P.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(v,x=!1){let S=De(v.id,"anchorImg");if(S)return Q({tipo:"documento",ancora:v,id:S},x);Q({tipo:"processo",ancora:v},x)},atual:()=>P?.menu??null,parar(){R(),r.removeEventListener("mouseover",z),r.removeEventListener("mouseout",bo),r.removeEventListener("click",eo,!0),r.removeEventListener("keydown",go,!0),Do?.(),Oo(),Ho()}}}var Yc='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function Fi(o,e,r){for(let t of o.querySelectorAll(Yc)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function Vi(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(Fi(o.doc,"urgentePro",so(t.valor.especificacao,"URGENTE")),o.usaTrancado&&Fi(o.doc,"trancadoPro",so(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function Ui(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var Kc=["dadosProcesso","marcador"],Jc=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Gi(o,e){let r=null,t=s=>{let c=Ui(s);c===null?o.documentElement?.removeAttribute(He):o.documentElement?.setAttribute(He,c)},a=()=>{e().then(s=>{if(!(!s||s.sigiloso))for(let c of Kc)s.loja.ler(c).estado!=="pronto"&&s.recarregar(c)}).catch(s=>console.warn("[SEI Pro] capa do processo:",s))},n=()=>{if(r)return;let s=new AbortController;r=s,t({fase:"coletando",feito:0,total:0}),e().then(async c=>{if(!c||c.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await Wo(c,{sinal:s.signal,aoProgresso:(p,d)=>t({fase:"coletando",feito:p,total:d})}),t("pronto")}).catch(c=>{Jc(c)||s.signal.aborted?t({fase:"parada"}):t({fase:"erro",mensagem:qe(c)})}).finally(()=>{r=null})},i=()=>r?.abort();return o.addEventListener(ke,a),o.addEventListener(Re,n),o.addEventListener($e,i),()=>{o.removeEventListener(ke,a),o.removeEventListener(Re,n),o.removeEventListener($e,i)}}var it=null;Aa(`${pt}
${Et}`);ri(window)&&ti(document);Qr(window)&&(Qn(document),oi(document),ei(document));var ji=window;if(!ji.__seiProProcessoPaineis&&Qr(window)&&!ai(window)){ji.__seiProProcessoPaineis=!0,ja(document,st),Gi(document,st);let o=()=>void Qc().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function st(){return it??=Zc().catch(o=>{throw it=null,o}),it}async function Zc(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await jr(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=At(),t=Kn(r),a=e.nivel==="sigiloso",n=new rr(lt(chrome.storage.local,"local"),Yn(t.host,t.login),e.idProcedimento,{sigiloso:a}),i=ce(location.href),s=hr(o,"disablequery"),c=Zn({http:i,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:s});return Jn({doc:document,topo:r,arv:e,loja:n,...t,habilitados:Ka(on(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:hr(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:p=>{let d=c[p];d&&n.carregar(p,d)}})}async function Qc(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=qo(o,"infoarvore")&&en(localStorage),r=qo(o,"menurapido");if(!e&&!r)return;let t=await st();if(t){if(e){Mn(t),Vi(t);for(let a of On(t))t.recarregar(a);jt(t).catch(()=>{})}r&&qi({ctx:t,dataValues:o,http:ce(location.href)})}}})();
