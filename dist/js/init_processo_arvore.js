/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function cs(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function mt(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(cs(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function Me(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function To(o,e){let r=Me(o,e);return!(r===!1||r===0||r==="")}function Er(o,e){let r=Me(o,e);return r===!0||r===1||r==="1"}var ft=`/*
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
`;var ds={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function lo(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):ds[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var gt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var ps={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Te(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=ps[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var us=/[A-Za-z0-9\-_.*]/;function vt(o){let e="";for(let r of o)r===" "?e+="+":us.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function ht(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${vt(Te(r))}=${vt(Te(t??"",a))}`}).join("&")}function bt(o){let e=r=>encodeURIComponent(Te(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var xt="application/x-www-form-urlencoded";function yr(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=gt[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var At="application/x-www-form-urlencoded; charset=ISO-8859-1";var Et=null;function Uo(o){return Et?Et(o):new DOMParser().parseFromString(o,"text/html")}function w(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var E=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Eo(o){if(o instanceof E)return o;if(o instanceof DOMException&&o.name==="AbortError")return new E("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new E("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function yt(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=Uo(r)}}}function Pt(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new E("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new E("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=w(r);throw new E("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new E("SEI_VALIDACAO",r,r)}return o}function pe(o,e={}){let r=new URL(".",o),t=e.fetch??((...f)=>fetch(...f)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(f){n>=a&&await new Promise(u=>i.push(u)),n+=1;try{return await f()}finally{n-=1,i.shift()?.()}}let c=f=>new URL(f.replace(/&amp;/g,"&"),r).href;async function d(f,u,m){return s(async()=>{try{let g=await t(c(f),{credentials:"same-origin",redirect:"follow",...u,signal:m.sinal}),v=yr(await g.arrayBuffer());return Pt(yt(g.url||c(f),g.status,v),m)}catch(g){throw Eo(g)}})}async function p(f,u={}){return s(async()=>{try{let m=await t(c(f),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),g=new Uint8Array(await m.arrayBuffer()),v=(m.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();v==="text/html"&&Pt(yt(m.url||c(f),m.status,yr(g)),u);let x=m.headers?.get("content-disposition")??"",P=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(x)?.[1]??/filename="?([^";]+)"?/i.exec(x)?.[1]??"");return{bytes:g,tipo:v,nome:P}}catch(m){throw Eo(m)}})}return{base:r,absoluta:c,baixar:p,obter:(f,u={})=>d(f,{method:"GET"},u),enviar:(f,u,m={})=>d(f,m.utf8?{method:"POST",headers:{"Content-Type":xt},body:bt(u)}:{method:"POST",headers:{"Content-Type":At},body:ht(u,m.modos)},m)}}function Lo(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function Dt(){try{return window.top?.document??document}catch{return document}}var St=`/*
 * Pain\xE9is abaixo da \xE1rvore do processo (op\xE7\xE3o A da spec: lista refinada) e seus modais.
 * As cores v\xEAm dos tokens --spro-* de sei-comum/src/ui/base.css (anexado antes deste arquivo). O escuro vem de
 * data-tema="escuro" na raiz dos pain\xE9is e no di\xE1logo (o quadro e a janela de topo s\xE3o documentos diferentes).
 */
/* Os tokens do base.css seguem o esquema de cores do SISTEMA quando ninguem fixou o tema; aqui o tema e o do SEI
   (claro por padrao, escuro quando o SEI esta escuro), nunca o do sistema operacional. */
.spro-p-raiz,
.spro-pm,
.spro-f-barra,
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
.spro-f-barra[data-tema="escuro"],
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
  font-size: 12px;
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
  left: 8px;
  display: inline-flex;
  color: var(--spro-fraco);
  pointer-events: none;
}
.spro-f-busca {
  flex: 1 1 auto;
  min-width: 0;
  height: 28px;
  margin: 0;
  padding: 0 28px 0 27px;
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
  width: 22px;
  height: 22px;
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
  height: 22px;
  margin: 0;
  padding: 0 9px;
  font: inherit;
  font-size: 11.5px;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda-forte);
  border-radius: 11px;
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
  font-size: 11.5px;
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
`;var fs={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function ue(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=fs[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function Pr(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=ue(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function B(o){return typeof o=="string"?lo(o):o==null?"":String(o)}var gs=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function yo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(gs))e.add(r[0]);return[...e]}function j(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function F(o,e,r={}){let t=Array.isArray(o)?o:yo(o);for(let a of t){let n=j(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function wt(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=yo(r).filter(i=>j(i).get("acao")===e),n=(t.length?t:yo(o.html).filter(i=>j(i).get("acao")===e)).sort((i,s)=>[...j(i).keys()].length-[...j(s).keys()].length)[0];if(!n)throw new E("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Ct(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=Pr(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=ue(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function It(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=Pr(o,r.index+r[0].length);e.push({tipo:B(t[0]),idPai:B(t[2]),href:B(t[3]),titulo:B(t[5]),icone:B(t[6]),extra:t[8]==null?void 0:B(t[8])})}return e}function Ot(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Mt(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>B(e[1])))]}function Tt(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var vs=/\s*\(\d{5,}\)\s*$/;function Lt(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=B(r.args[1]),a=B(r.args[5]),n=B(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(f=>f.tipo==="ASSINATURA"&&f.idPai===t),{nivel:c,hipotese:d}=Ot(e,t),p=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:B(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(vs,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:p,nivel:c,hipotese:d,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(f=>f.tipo==="UNIDADE_GERADORA"&&f.idPai===t)?.extra,link:B(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:yo(r.props.acoes??""),botoes:Mt(r.props.acoes??""),funcoes:Tt(r.props.acoes??"")}})}function Nt(o){return Lt(Ct(o.html),It(o.html))}function Dr(o){let e=o.html,r=Ct(e),t=It(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new E("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=B(a.args[1]),i=Ot(t,n),s=Lt(r,t);return{idProcedimento:n,protocolo:B(a.args[5])||B(a.args[15]),tipo:B(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:yo(a.props.acoes??""),botoesProcesso:Mt(a.props.acoes??""),funcoesProcesso:Tt(a.props.acoes??""),linkProcesso:B(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:yo(e),pagina:o}}async function _t(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new E("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=F(t.html,"procedimento_visualizar")&&yo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Dr(t)}function Y(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?F(t.acoes,e):null}return F(o.acoesProcesso,e)??F(o.links,e,{id_procedimento:o.idProcedimento})}function J(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var Go={publico:"0",restrito:"1"},Bo={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function jo(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(lo(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Ht="\xA5",Sr="\xB1";function kt(o){return o.map(e=>`${e.id}${Sr}${e.texto}`).join(Ht)}function hs(o){return o?o.split(Ht).map(e=>{let[r,...t]=e.split(Sr);return{id:r,texto:t.join(Sr)}}):[]}function Rt(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var k=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=bs(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,w(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${$t(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??w(t),texto:w(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=ao(r),n=t.find(i=>i.valor===r)??t.find(i=>ao(i.texto)===a)??wr(t.filter(i=>ao(i.texto).includes(a)));if(!n)throw new E("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?hs(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:kt(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new E("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new E("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new E("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${w(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??wr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??w(r)??e]:[e,e]}hiddenDaLupa(e){let r=Rt(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Rt(this.pagina.html)){let t=this.elemento.querySelector(`select#${$t(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:w(n)}));(this.valor(r)??"")||this.definir({[r]:kt(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function bs(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(d=>d.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let d of c)e.push({nome:t,valor:d.getAttribute("value")??w(d)})}}return e}function ao(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Wo(o,e,r){let t=ao(e),a=o.find(n=>n.id===e)??o.find(n=>ao(n.texto)===t)??wr(o.filter(n=>ao(n.texto).includes(t)));if(!a)throw new E("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function wr(o){return o.length===1?o[0]:void 0}function $t(o){return o.replace(/([^\w-])/g,"\\$1")}function xs(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function As(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function me(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=xs(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:As(o),sigla:w(r)||w(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var Es=3e4,Le=class{constructor(e,r=null,t){this.paginaViva=r;this.http=pe(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new E("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return me(this.base())}linkMenu(e){return wt(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new E("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=k.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=j(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new E("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let p=j(lo(c)).get("id_procedimento")??"",f=s.get("id_protocolo")??"",u={idProcedimento:p,idDocumento:f&&f!==p?f:void 0,linkArvore:lo(c)};return this.localizados.set(t,u),u}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<Es)return a.arvore;let n=await _t(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:lo(i[1]),texto:lo(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=Uo(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function Xo(o,e,r){let t=Y(o,e);if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function fe(o,e,r){let t=await k.abrir(o,Xo(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var zt=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function qt(o,e,r){let t=zt.exec(r),a=r.replace(zt,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function ys(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(w(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>w(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return qt(s||void 0,w(i[t]),w(i[a]))}async function Ft(o,e,r){let t=await o.obter(Xo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=k.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return qt(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=ys(t);if(a===void 0)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",w(t.doc.querySelector("title")));return a}function Ps(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?ue(o.pagina.html,e.index+e[0].length-1)[0]:""}function Ds(o){if(!o.trim())return[];let e=Uo(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:w(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function Vt(o,e){let r=Ds(Ps(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??me(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!Y(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}var Ne=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function Ut(o,e){let r=o.filter(i=>i.unidade===e),t=i=>i.reduce((s,c)=>!s||Ne(c.data)>Ne(s.data)?c:s,null),a=t(r.filter(i=>i.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(i=>i.descricao.includes("Processo retirado do bloco")));return n&&Ne(a.data)<Ne(n.data)?null:a.descricao}function _e(o){let e=t=>!!Y(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function Gt(o,e,r){let t=await o.obter(Xo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",w(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:w(s[1]),texto:w(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:w(s[3]),data:w(s[4])}})}async function Bt(o,e,r){let a=(await k.abrir(o,Xo(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function jt(o,e,r){let t=await o.obter(Xo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=F(t.html,"andamento_marcador_cadastrar");if(!i)throw new E("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:w(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function Wt(o,e,r){let t=await o.obter(Xo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(d=>F(t.html,d)).find(Boolean);if(!c)throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=k.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function Xt(o,e,r){let t=Y(e,"procedimento_alterar")??Y(e,"procedimento_consultar");if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await k.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),async hipoteses(c,d){return(await jo(o,a,c,d)).map(p=>({valor:p.id,texto:p.texto}))}}}var ke=(o,e)=>o>0&&e-o<18e5;var ge=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function Cr(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:Ut(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function Re(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:ke(e.coletadoEm,o.agora().getTime())}:null}async function Yt(o){let e=await Re(o);return e?.vale?(Cr(o,e.historico),!0):!1}async function Yo(o,e={}){if(o.sigiloso)throw new ge;let r=await Re(o);if(r?.vale&&!e.forcar)return Cr(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),Cr(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var Kt="data-seipro-processo-paineis",Jt="data-seipro-processo-menu",Zt="data-seipro-processo-capa",Qt="data-seipro-processo-gantt",$e="spro-processo-gantt-abrir",He="spro-processo-capa-pedir",ze="spro-processo-capa-calcular",qe="spro-processo-capa-cancelar",Fe="data-spro-capa-coleta";var oa="filtroarvore";var Ve="processo/",Ir=(o,e)=>`${Ve}${o}/${e}`,Or=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},Mr="processo-historico/",Tr=(o,e)=>`${Mr}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var po={fill:"currentColor",stroke:"none"},ea="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",ra={estrela:[["path",{d:ea}]],estrelaCheia:[["path",{d:ea,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...po}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...po}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...po}],["circle",{cx:"12",cy:"12",r:"1.4",...po}],["circle",{cx:"19",cy:"12",r:"1.4",...po}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...po}],["circle",{cx:"15",cy:"6",r:"1.3",...po}],["circle",{cx:"9",cy:"12",r:"1.3",...po}],["circle",{cx:"15",cy:"12",r:"1.3",...po}],["circle",{cx:"9",cy:"18",r:"1.3",...po}],["circle",{cx:"15",cy:"18",r:"1.3",...po}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Ad=Object.keys(ra);function O(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of ra[o]){let c=r.createElementNS(t,i);for(let[d,p]of Object.entries(s))c.setAttribute(d,p);a.append(c)}return a}function Ss(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function ta(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function aa(o,e,r,t,a){let n=o.body??o.documentElement;for(let f of[n,...o.querySelectorAll("dialog")])for(let u of[...f.children])u.classList.contains("spro-aviso")&&u.remove();let i=l("div",{class:"spro-aviso",role:"status"},O("check",16),l("span",{},e),...Ss(r).map(f=>l("button",{type:"button",onclick:()=>{i.remove(),f.fazer()}},f.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,d=()=>{let f=ta(o);f.append(i),s(),f.localName==="dialog"&&f.addEventListener("close",()=>{if(!(!p||!f.contains(i))){if(a&&ta(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){p=!1,i.remove();return}d()}},{once:!0})},p=!0;return d(),setTimeout(()=>{p=!1,i.remove()},t),i}async function Lr(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function V(o,e,r=4e3){try{aa(o.topo,e,void 0,r)}catch{}}async function na(o,e){let r=await Lr(o.doc,e);V(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var ia={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},sa={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function Po(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function Ue(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":Po(o)}var ws=/[\u0300-\u036f]/g,Nr=o=>o.normalize("NFD").replace(ws,""),_r=o=>Nr(o).toLowerCase().replace(/\s+/g," ").trim(),ve=o=>String(o).padStart(2,"0"),Ge=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,ca=/(\d{1,2}):(\d{2})/;function he(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=Nr(e),t=r.length===e.length?r:e,a=Ge.exec(t);if(!a)return{prazo:null,texto:e};let n=ca.exec(t.slice(a.index+a[0].length))??ca.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${ve(Number(a[2]))}-${ve(Number(a[1]))}`,c=n?`${ve(Number(n[1]))}:${n[2]}`:"23:59",d=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),p=d?`${e.slice(0,d.index)} ${e.slice(d.index+d[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:p}}function da(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var Cs=864e5;function Ko(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),d=new Date(s.getFullYear(),s.getMonth(),s.getDate()),p=Math.round((d.getTime()-c.getTime())/Cs);return p===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:p>0?{rotulo:p===1?"amanh\xE3":`em ${p} dias`,nivel:p<=2?"atencao":"ok"}:{rotulo:p===-1?"ontem":`h\xE1 ${-p} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Be(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function pa(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var be=500,Is=/^\s*\[( |x|X)\]\s?/;function je(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=Is.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function ua(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function ma(o,e){let r=je(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",ua(r))}function fa(o,e,r){let t=je(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return ua(t)}function Os(o){let e=Ge.exec(Nr(o));return e?`${ve(Number(e[1]))}/${ve(Number(e[2]))}/${e[3]}`:null}function ga(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return Ge.test(o)?o.replace(Ge,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function We(o){let e=Os(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function so(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function va(o,e){return so(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function la(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function ha(o,e,r){return[{unidade:e,observacao:la(o)},...r.map(a=>({unidade:a.unidade,observacao:la(a.observacao)}))].filter(a=>a.observacao)}function ba(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function xa(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function Aa(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function Ea(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function ya(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function Pa(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var Da="spro-processo-estilo",kr="";function Sa(o){kr=o}function wo(o){if(!kr||o.getElementById(Da))return;let e=o.createElement("style");e.id=Da,e.textContent=kr,(o.head??o.documentElement).append(e)}function go(o){let e=Pa(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Jo(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function H(o,e){wo(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});go(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},O("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},O(e.icone,18)),l("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,d=[]){this.erro(""),t=!0,a.disabled=!0;for(let p of d)p.disabled=!0;r.setAttribute("aria-busy","true");try{let p=await c();return t=!1,r.close(),p&&V(o,p.aplicado?p.resumo:p.resumo||"Nada a alterar."),!0}catch(p){t=!1,a.disabled=!1;for(let f of d)f.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(Po(p)),!1}}}}function Xe(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function uo(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function K(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function Z(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function No(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function _o(o,e,r,t){let a=l("select",{class:"spro-campo spro-p-lista",size:String(Math.min(8,Math.max(4,o.length))),"aria-label":r}),n=e??"",i=d=>{let p=_r(d),f=p?o.filter(u=>_r(u.texto).includes(p)):o;a.replaceChildren(...f.map(u=>{let m=l("option",{value:u.valor},u.texto);return m.selected=u.valor===n,m}))};a.addEventListener("change",()=>{n=a.value,t?.(n)});let s=l("input",{type:"search",class:"spro-campo",placeholder:"Buscar\u2026","aria-label":`Buscar em ${r}`});return s.addEventListener("input",()=>i(s.value)),i(""),{el:l("div",{class:"spro-p-busca"},o.length>8?s:null,a),valor:()=>n,definir(d){n=d,i(s.value)}}}function Zo(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),i=l("button",{type:"button",class:"spro-botao"},"Cancelar"),s=H(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),K(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}var mo={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},Ms=120*1e3;function co(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Co=(o,e)=>o.startsWith(co(e));function Rr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function Ts(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function Qo(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function Ls(o){let e=[];return o.forEach((r,t)=>{let a=Ts(r.dataISO||Rr(r.data));a&&e.push({a:r,t:a,i:t,d:co(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function Ca(o,e){return co(o)===co(e)}function Ia(o,e,r){return Ca(o.unidade,e)?!o.unidadeNome||!r||co(o.unidadeNome)===co(r):!1}function xe(o,e,r){let t=o.filter(i=>Ca(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?co(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(i=>Ia(i,e,r));return n.length?n:t}function Ns(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,i)=>n.recebido.getTime()<r(i)&&i.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(co(n.unidade),[...a.get(co(n.unidade))??[],n]);for(let[n,i]of a){let s=i.some(c=>i.some(d=>c.unidadeNome&&d.unidadeNome&&co(c.unidadeNome)!==co(d.unidadeNome)&&t(c,d)));for(let c of i)c.chave=s&&c.unidadeNome?`${n}|${co(c.unidadeNome)}`:n}}function wa(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${mo.remetidoPrefixo}`,"i"),"")).trim()}function _s(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function Oa(o,e){let r=Ls(o),t=[],a=[],n=[],i=[],s=(m,g)=>xe(a,m,g)[0],c=(m,g)=>{let v=xe(n,m,g)[0];return v?n.indexOf(v):-1},d=(m,g)=>{let{a:v}=m;if(a.some(b=>Ia(b,v.unidade,v.unidadeNome)))return;let x={unidade:v.unidade,...v.unidadeNome?{unidadeNome:v.unidadeNome}:{},chave:"",recebido:m.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:g,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:v.usuario,...v.usuarioNome?{usuarioRecebeuNome:v.usuarioNome}:{}},P=c(v.unidade,v.unidadeNome);if(P>=0){let[b]=n.splice(P,1);x.chegouEm=b.em,x.origem=b.origem}a.push(x),t.push(x)},p=(m,g,v)=>{m.remetido=g.t,m.fim=v,m.usuarioEnviou=g.a.usuario,g.a.usuarioNome&&(m.usuarioEnviouNome=g.a.usuarioNome),a.splice(a.indexOf(m),1)},f=m=>{let{a:g}=m;if(s(g.unidade,g.unidadeNome))return;let v=c(g.unidade,g.unidadeNome),x={em:m.t,unidade:g.unidade,...g.unidadeNome?{unidadeNome:g.unidadeNome}:{},origem:wa(g),usuario:g.usuario,...g.usuarioNome?{usuarioNome:g.usuarioNome}:{}};v>=0?n[v]=x:n.push(x)};for(let m=0;m<r.length;){let g=m+1;for(;g<r.length&&r[g].t.getTime()===r[m].t.getTime();)g+=1;let v=r.slice(m,g);m=g;for(let x of v)Co(x.d,mo.remetidoPrefixo)&&f(x);for(let x of v)Co(x.d,mo.recebido)&&d(x,"recebido");for(let x of v){let{a:P,d:b}=x;if(mo.gerado.some(S=>Co(b,S)))d(x,"gerado");else if(Co(b,mo.reabertura))d(x,"reabertura");else if(Co(b,mo.conclusao)){let S=s(P.unidade,P.unidadeNome);S&&p(S,x,"conclusao")}else if(Co(b,mo.remetidoPrefixo)){let S=wa(P),D=P.unidadeCitadaNome,M=s(S,D);if(M)p(M,x,"remessa"),M.destinos.push(P.unidade);else{let y=xe(t,S,D).at(-1);y?.fim==="remessa"&&y.remetido&&x.t.getTime()-y.remetido.getTime()<=Ms&&!y.destinos.includes(P.unidade)&&y.destinos.push(P.unidade)}}else Co(b,mo.documentoGerado)?i.push({ev:x,assinado:!1}):Co(b,mo.documentoAssinado)&&i.push({ev:x,assinado:!0})}}for(let m of n)t.push({unidade:m.unidade,...m.unidadeNome?{unidadeNome:m.unidadeNome}:{},chave:"",recebido:m.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:m.em,origem:m.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:m.usuario,...m.usuarioNome?{usuarioEnviouNome:m.usuarioNome}:{}});for(let{ev:m,assinado:g}of i){let{a:v}=m,x=xe(t.filter(S=>!S.pendenteRecebimento&&S.recebido.getTime()<=m.t.getTime()),v.unidade,v.unidadeNome),P=[...x].reverse().find(S=>S.remetido===null||m.t.getTime()<=S.remetido.getTime())??x[x.length-1];if(!P)continue;let b={...v.nrSei?{nrSei:v.nrSei}:{},...v.idDocumento?{idDocumento:v.idDocumento}:{},em:m.t,titulo:_s(v),...v.usuario?{usuario:v.usuario}:{}};(g?P.assinaturas:P.documentos).push(b)}t.sort((m,g)=>m.recebido.getTime()-g.recebido.getTime());for(let m of o){if(!m.aberto)continue;let g=xe(t.filter(v=>!v.pendenteRecebimento),m.unidade,m.unidadeNome).at(-1);g?.fim==="remessa"&&g.remetido&&(g.enviouEm=g.remetido,g.remetido=null,g.fim=null,g.mantidoAberto=!0)}let u=Qo(e).getTime();for(let m of t)m.emCurso=m.remetido===null,m.duracaoMs=Math.max(0,(m.remetido?.getTime()??u)-m.recebido.getTime());return Ns(t,u),t.sort((m,g)=>m.recebido.getTime()-g.recebido.getTime())}var Ye=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],ks=3e4,Rs=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],$s=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],oe=o=>String(o).padStart(2,"0"),Hs=o=>Ye.find(e=>e.id===o)?.pxPorDia??2.2,$r=o=>`${oe(o.getUTCDate())}/${oe(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,Q=o=>`${$r(o)} ${oe(o.getUTCHours())}:${oe(o.getUTCMinutes())}`;function vo(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var Ke=o=>Math.round(Math.max(0,o)/864e5*10)/10,Io=o=>String(o).replace(".",","),Ae=o=>o.recebido.getTime()+o.duracaoMs,ko=(o,e)=>e&&o?`${e} (${o})`:e??o??"",Hr=(o,e)=>e>1?`${o} ${e}x`:o;function Ta(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=Hr(a.sigla,a.passagens.length);return t}var Ma=o=>Math.floor(o/864e5)*864e5;function Je(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let p of o)t=Math.min(t,p.recebido.getTime()),a=Math.max(a,Ae(p),...p.documentos.map(f=>f.em.getTime()));if(!Number.isFinite(t)){let p=r.agora?.getTime()??0;t=p,a=p}r.agora&&o.some(p=>p.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=Ma(t),i=Ma(a)+864e5,s=Math.max(1,(i-n)/864e5),c=r.pxPorDia??Hs(e),d=Math.min(c,ks/s);return{escala:e,pxPorDia:d,origem:n,fim:i,largura:s*d,x:p=>(p-n)/864e5*d}}function La(o,e=1e3){for(let r of Ye)if(Je(o,r.id).largura<=e)return r.id;return"mes"}function Na(o){let e=[],r=[],t=o.fim,a=(i,s,c,d)=>{let p=o.x(s);i.push({x:p,largura:Math.max(0,o.x(Math.min(c,t))-p),rotulo:d})},n=i=>new Date(i);if(o.escala==="mes")for(let i=n(o.origem).getUTCFullYear();Date.UTC(i,0,1)<t;i++)a(e,Math.max(Date.UTC(i,0,1),o.origem),Date.UTC(i+1,0,1),String(i));else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;){let d=Math.max(Date.UTC(s,c,1),o.origem);a(e,d,Date.UTC(s,c+1,1),`${$s[c]} de ${s}`),c+=1,c>11&&(c=0,s+=1)}}if(o.escala==="dia")for(let i=o.origem;i<t;i+=864e5)a(r,i,i+864e5,String(n(i).getUTCDate()));else if(o.escala==="semana"){let s=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-s*864e5;c<t;c+=7*864e5){let d=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${oe(d.getUTCDate())}/${oe(d.getUTCMonth()+1)}`)}}else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;)a(r,Math.max(Date.UTC(s,c,1),o.origem),Date.UTC(s,c+1,1),Rs[c]),c+=1,c>11&&(c=0,s+=1)}return{cima:e,baixo:r}}function ee(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var Ze={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function re(o){return o.titulo||o.nrSei||"Documento"}var zs=8;function zr(o){let e=[],r=ee(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${Q(o.recebido)}${o.usuarioEnviou?` por ${ko(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${Q(o.recebido)}${o.usuarioRecebeu?` por ${ko(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${Q(o.enviouEm)}${o.usuarioEnviou?` por ${ko(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${Q(o.remetido)}${o.usuarioEnviou?` por ${ko(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${vo(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${re(n)} - ${Q(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,zs);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:Ze[r],linhas:e,...t.length?{documentos:a}:{}}}function _a(o,e){return{titulo:re(o),linhas:[{rotulo:"Gerado em",valor:`${Q(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function ka(o){let e=zr(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function Qe(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:Ke(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function or(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,Ae(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var er=o=>Hr(o.unidade,o.passagens);function Ra(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,qs(r,o,a)},ocultar(){r.hidden=!0}}}function qs(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,i=o.offsetHeight||120,s=a.left-t.left+a.width/2-n/2;s=Math.max(6,Math.min(s,t.width-n-6));let c=a.top-t.top-i-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(s)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function $a(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var Fs="http://www.w3.org/2000/svg",ho=150,U=46,Ee=50,Ro=8,ye=20,Vs=38,$o=6,Ha=16,Us=0;function I(o,e={},...r){let t=document.createElementNS(Fs,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var z=o=>Math.round(o*10)/10,za=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function rr(o,e,r={}){let t=`spro-g${++Us}`,a=r.larguraAlvo!==void 0,n=Ta(o),i=Je(o,e,{...r.agora?{agora:r.agora}:{}}),s=a?Je(o,e,{pxPorDia:(r.larguraAlvo-ho-Ha)/Math.max(1,(i.fim-i.origem)/864e5),...r.agora?{agora:r.agora}:{}}):i,c=ho+s.largura+Ha,d=U+Math.max(1,n.length)*Ee+8,p=I("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${z(c)} ${d}`,width:a?"100%":z(c),...a?{}:{height:d},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});p.append(I("defs",{},I("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},I("rect",{width:8,height:8,class:"listra-fundo"}),I("rect",{width:4,height:8,class:"listra-traco"})),I("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},I("rect",{width:6,height:6,class:"pontos-fundo"}),I("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let f=ho,u=Na(s),m=I("g",{class:"spro-g-corpo"});n.forEach((b,S)=>{m.append(I("rect",{x:0,y:U+S*Ee,width:c,height:Ee,class:S%2?"raia-par":"raia-impar"}))});let g=I("g",{class:"spro-g-grade","aria-hidden":"true"});for(let b of u.baixo)g.append(I("line",{x1:z(f+b.x),x2:z(f+b.x),y1:U,y2:d,class:"grade"}));if(m.append(g),n.forEach((b,S)=>{let D=U+S*Ee,M=I("g",{class:"spro-g-raia","data-raia":b.chave});for(let y of b.passagens){let _=ee(y),$=f+s.x(y.recebido.getTime()),G=Math.max(4,s.x(Ae(y))-s.x(y.recebido.getTime())),X=I("g",{class:`spro-g-barra ${_}`,"data-situacao":_,...a?{}:{tabindex:0,role:"img"},"aria-label":ka(y)});if(X.append(I("rect",{x:z($),y:D+Ro,width:z(G),height:ye,rx:4,class:"fundo"})),_==="em-curso")X.append(I("rect",{x:z($),y:D+Ro,width:z(G),height:ye,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(_==="pendente")X.append(I("rect",{x:z($),y:D+Ro,width:z(G),height:ye,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(_==="mantido-aberto"&&y.enviouEm){let q=f+s.x(y.enviouEm.getTime());X.append(I("rect",{x:z(q),y:D+Ro,width:z(Math.max(2,$+G-q)),height:ye,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),X.append(I("line",{x1:z(q),x2:z(q),y1:D+Ro-3,y2:D+Ro+ye+3,class:"marca-remessa"}))}if(G>=44&&X.append(I("text",{x:z($+6),y:D+Ro+14,class:"texto-barra"},vo(y.duracaoMs))),!a&&r.dica){let q=r.dica,xo=zr(y);X.addEventListener("pointerenter",()=>q.mostrar(xo,X)),X.addEventListener("pointerleave",()=>q.ocultar()),X.addEventListener("focus",()=>q.mostrar(xo,X)),X.addEventListener("blur",()=>q.ocultar())}M.append(X);for(let q of y.documentos){let xo=f+s.x(q.em.getTime()),ro=I("path",{d:`M${z(xo)} ${D+Vs-$o}l${$o} ${$o}l-${$o} ${$o}l-${$o} -${$o}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${re(q)}, ${Q(q.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let fo=r.dica,So=_a(q,y);fo&&(ro.addEventListener("pointerenter",()=>fo.mostrar(So,ro)),ro.addEventListener("pointerleave",()=>fo.ocultar()),ro.addEventListener("focus",()=>fo.mostrar(So,ro)),ro.addEventListener("blur",()=>fo.ocultar()));let to=()=>r.aoAbrirDocumento?.(q,y);ro.addEventListener("click",to),ro.addEventListener("keydown",Mo=>{let Fo=Mo.key;(Fo==="Enter"||Fo===" ")&&(Mo.preventDefault(),to())})}M.append(ro)}}m.append(M)}),p.append(m),r.agora&&o.some(b=>b.emCurso)&&r.agora.getTime()>=s.origem&&r.agora.getTime()<=s.fim){let b=z(f+s.x(r.agora.getTime()));p.append(I("g",{class:"spro-g-agora","aria-hidden":"true"},I("line",{x1:b,x2:b,y1:U,y2:d}),I("text",{x:Math.min(b+4,c-40),y:U+11},"Agora")))}let v=I("g",{class:"spro-g-cabecalho","aria-hidden":"true"});v.append(I("rect",{x:0,y:0,width:c,height:U,class:"cabecalho-fundo"}));for(let b of u.cima)v.append(I("line",{x1:z(f+b.x),x2:z(f+b.x),y1:0,y2:U,class:"grade-forte"})),b.largura>36&&v.append(I("text",{x:z(f+b.x+6),y:15,class:"eixo-cima"},b.rotulo));for(let b of u.baixo)b.largura>=14&&v.append(I("text",{x:z(f+b.x+b.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},b.rotulo));v.append(I("line",{x1:0,x2:c,y1:U,y2:U,class:"grade-forte"})),p.append(v);let x=I("g",{class:"spro-g-rotulos"});x.append(I("rect",{x:0,y:U,width:ho,height:d-U,class:"rotulos-fundo"})),n.forEach((b,S)=>{let D=U+S*Ee,M=I("text",{x:10,y:D+22,class:"rotulo-raia"},za(b.rotulo,20)),y=b.nome&&b.nome!==b.sigla?b.nome:"",_=I("g",{"aria-label":`${b.sigla}${y?`, ${y}`:""}: ${b.passagens.length} passagem(ns)`,role:"img"},M);y&&_.append(I("text",{x:10,y:D+37,class:"rotulo-nome"},za(y,24))),x.append(_)}),x.append(I("line",{x1:ho,x2:ho,y1:U,y2:d,class:"grade-forte"})),p.append(x);let P=I("g",{class:"spro-g-canto","aria-hidden":"true"},I("rect",{x:0,y:0,width:ho,height:U,class:"cabecalho-fundo"}),I("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),I("line",{x1:ho,x2:ho,y1:0,y2:U,class:"grade-forte"}),I("line",{x1:0,x2:ho,y1:U,y2:U,class:"grade-forte"}));return p.append(P),n.length===0&&p.append(I("text",{x:f+12,y:U+28,class:"rotulo-nome"},"Sem passagens.")),p}function qa(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let i=e.scrollLeft,s=e.scrollTop;r?.setAttribute("transform",`translate(0 ${s})`),t?.setAttribute("transform",`translate(${i} 0)`),a?.setAttribute("transform",`translate(${i} ${s})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var Bs=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function Fa(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...Bs]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",Ze[ee(t)],Q(t.recebido),a?Q(a):"",Io(Math.round(t.duracaoMs/864e5*100)/100),vo(t.duracaoMs),t.pendenteRecebimento?"":ko(t.usuarioRecebeu,t.usuarioRecebeuNome),ko(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${re(n)} (${$r(n.em)})`).join(" | ")])}return $a(r)}function Va(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function Ua(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),i=o.createElement("a");return i.href=n,i.download=e,i.style.display="none",o.body.append(i),i.click(),i.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var js="spro-g-impressao";function Ws(o,e="mes"){let r=or(o.passagens),t=Qe(o.passagens),a=[...o.passagens].sort((c,d)=>c.recebido.getTime()-d.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},Ze[ee(c)]),l("td",{},Q(c.recebido)),l("td",{},c.remetido??c.enviouEm?Q(c.remetido??c.enviouEm):""),l("td",{},vo(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),i=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},er(c)),l("td",{},Io(c.dias)),l("td",{},`${Io(c.percentual)}%`),l("td",{},String(c.passagens)))))),s=rr(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:js,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${vo(r.corridoMs)} (${Io(Ke(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${Q(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},s),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),i)}function Ga(o,e,r="mes"){let t=o.defaultView??window,a=Ws(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var tr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${vo(o)}`,Ba=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:Oa(o,r)}),Ys=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function ja(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,i=!1,s=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,d=l("div",{class:"spro-g-visao"}),p=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function f(h){if(i||e.sigiloso)return;let A=p();n?.abort();let C=new AbortController;n=C,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...A?{anterior:A}:{}},to();try{let L=await Yo(e,{sinal:C.signal,forcar:h,aoProgresso:(T,R)=>{i||n!==C||r.tipo!=="coletando"||(r={...r,feito:T,total:R},G())}});if(i||n!==C)return;r={tipo:"pronto",dados:Ba(L.andamentos,L.coletadoEm,e.agora())}}catch(L){if(i||n!==C)return;L instanceof ge?r={tipo:"sigiloso"}:Ys(L)||C.signal.aborted?r={tipo:"cancelado",...A?{anterior:A}:{}}:r={tipo:"erro",mensagem:Po(L),...A?{anterior:A}:{}}}finally{n===C&&(n=null)}to()}function u(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},to(),n.abort())}let m=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),g=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),v=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},m,g),x=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),P=l("div",{class:"spro-g-progresso"}),b=l("div",{class:"spro-g-aviso",role:"status"}),S=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),D=l("button",{type:"button",class:"spro-botao"},O("atualizar",15),"Atualizar"),M=l("button",{type:"button",class:"spro-botao"},O("planilha",15),"Exportar CSV"),y=l("button",{type:"button",class:"spro-botao"},O("imprimir",15),"Imprimir"),_=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),D,M,y);d.append(l("div",{class:"spro-g-topo"},v,x),P,b,S,_);let $=(h,A=!1)=>{t=h,to(),A&&(h==="gantt"?m:g).focus()};m.addEventListener("click",()=>$("gantt")),g.addEventListener("click",()=>$("tempo")),v.addEventListener("keydown",h=>{let A=h.key;(A==="ArrowRight"||A==="ArrowLeft"||A==="Home"||A==="End")&&(h.preventDefault(),$(A==="Home"?"gantt":A==="End"||t==="gantt"?"tempo":"gantt",!0))}),D.addEventListener("click",()=>void f(!0)),M.addEventListener("click",()=>{let h=p();h?.passagens.length&&(Ua(e.topo,Va(e.protocolo),Fa(h.passagens)),V(e,"CSV do hist\xF3rico gerado.",2500))}),y.addEventListener("click",()=>{let h=p();h?.passagens.length&&Ga(e.topo,{protocolo:e.protocolo,passagens:h.passagens,agora:Qo(e.agora()),coletadoEm:Qo(new Date(h.coletadoEm))})});function G(){if(r.tipo!=="coletando")return;let{feito:h,total:A,cancelando:C}=r,L=C?"Cancelando a coleta\u2026":A>0?`Coletando o hist\xF3rico: p\xE1gina ${h} de ${A}`:"Coletando o hist\xF3rico\u2026",T=P.querySelector(".spro-g-prog-barra"),R=P.querySelector(".spro-g-prog-texto");if(R&&(R.textContent=L),T){let io=A>0?Math.round(h/A*100):0;T.setAttribute("aria-valuenow",String(io));let de=T.firstElementChild;de&&(de.style.width=A>0?`${io}%`:""),T.classList.toggle("indeterminado",A<=0)}}function X(){if(r.tipo!=="coletando"){P.hidden=!0,P.replaceChildren();return}P.hidden=!1;let h=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},O("cancelar",14),"Cancelar coleta");h.addEventListener("click",u),P.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),h),G()}function q(){let h=r,A=(T,R)=>{let io=l("button",{type:"button",class:"spro-botao pequeno"},T);return io.addEventListener("click",R),io};b.className="spro-g-aviso",b.replaceChildren(),b.hidden=!0;let C=(T,R,...io)=>{b.hidden=!1,b.className=`spro-g-aviso ${T}`,b.replaceChildren(O("alerta",15),l("span",{class:"spro-g-aviso-texto"},R),...io)},L=e.agora().getTime();h.tipo==="sigiloso"?C("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):h.tipo==="erro"?C("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${h.mensagem}`,A("Tentar de novo",()=>void f(!1))):h.tipo==="cancelado"?C("cancelado","Coleta cancelada.",A("Coletar de novo",()=>void f(!1))):h.tipo==="coletando"&&h.anterior&&!h.cancelando?C("desatualizado",`Mostrando o hist\xF3rico coletado ${tr(L-h.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):h.tipo==="pronto"&&L-h.dados.coletadoEm>=18e5&&C("desatualizado",`Este hist\xF3rico foi coletado ${tr(L-h.dados.coletadoEm)}.`,A("Atualizar agora",()=>void f(!0))),(h.tipo==="erro"||h.tipo==="cancelado")&&h.anterior&&C(h.tipo==="erro"?"erro":"cancelado",`${h.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${h.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${tr(L-h.anterior.coletadoEm)} (desatualizado).`,A("Tentar de novo",()=>void f(!1)))}function xo(){s?.(),s=null,S.replaceChildren();let h=p();if(r.tipo==="sigiloso"){S.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!h){S.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!h.passagens.length){S.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}S.setAttribute("aria-labelledby",`${c}-aba-${t}`),S.append(t==="gantt"?ro(h):fo(h))}function ro(h){let A=Qo(e.agora());a??=La(h.passagens,980);let C=a,L=l("div",{class:"spro-g-quadro"}),T=Ra(L,`${c}-dica`),R=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),io=rr(h.passagens,C,{agora:A,dica:T,aoAbrirDocumento:(Ao,Vo)=>o.abrirDocumento(Ao,Vo)});R.append(io),L.prepend(R),s=qa(io,R),R.addEventListener("scroll",()=>T.ocultar());let de=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let Ao of Ye){let Vo=l("button",{type:"button","aria-pressed":String(Ao.id===C),"data-escala":Ao.id},Ao.rotulo);Vo.addEventListener("click",()=>{if(a===Ao.id)return;let ss=R.scrollWidth>0?R.scrollLeft/R.scrollWidth:0;a=Ao.id,to();let Ar=S.querySelector(".spro-g-rolagem");Ar&&(Ar.scrollLeft=ss*Ar.scrollWidth)}),de.append(Vo)}let ut=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");ut.addEventListener("click",()=>{R.scrollLeft=R.scrollWidth});let is=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([Ao,Vo])=>l("li",{},l("span",{class:`spro-g-amostra ${Ao}`,"aria-hidden":"true"}),Vo)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},de,ut,is),L)}function fo(h){let A=Qe(h.passagens),C=or(h.passagens),L=Math.max(1,...A.map(T=>T.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${C.passagens} passagem(ns) por ${C.unidades} unidade(s). Tempo corrido do processo: ${vo(C.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...A.map(T=>{let R=l("span",{class:`spro-g-barra-pct${T.emCurso?" em-curso":""}`});return R.style.width=`${Math.max(1,Math.round(T.percentual/L*100))}%`,l("tr",{},l("th",{scope:"row"},er(T),T.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},Io(T.dias)),l("td",{class:"num"},`${Io(T.percentual)}%`),l("td",{class:"num"},String(T.passagens)),l("td",{class:"barra","aria-hidden":"true"},R))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function So(){let h=p(),A=r.tipo==="coletando",C=!h?.passagens.length;D.disabled=A||r.tipo==="sigiloso",M.disabled=C,y.disabled=C;let L=_.querySelector(".spro-g-frescor");L&&(L.textContent=h?`Coletado em ${Q(Qo(new Date(h.coletadoEm)))} (${tr(e.agora().getTime()-h.coletadoEm)})`:"")}function to(){m.setAttribute("aria-selected",String(t==="gantt")),g.setAttribute("aria-selected",String(t==="tempo")),m.setAttribute("tabindex",t==="gantt"?"0":"-1"),g.setAttribute("tabindex",t==="tempo"?"0":"-1");let h=p();x.textContent=h?.passagens.length?`${h.passagens.length} passagem(ns)`:"",X(),q(),xo(),So()}to();let Mo=setInterval(()=>{i||So()},3e4);Mo.unref?.();let Fo=(async()=>{if(e.sigiloso)return;let h=await Re(e);i||(h&&!h.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:Ba(h.historico.andamentos,h.historico.coletadoEm,e.agora())},to()),await f(!1))})();return{el:d,estado:()=>r,destruir(){i=!0,clearInterval(Mo),n?.abort(),s?.()},pronta:Fo}}function Ks(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function Wa(o,e){let r=e.nrSei??e.titulo,t=Ks(o,e);if(!t)return V(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return V(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return H(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var Xa="spro-g-dialogo";function Ya(o,e={}){let r=o.topo.querySelector(`dialog.${Xa}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=ja({ctx:o,abrirDocumento:n=>void Wa(o,n),...e}),a=H(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(Xa),{...t,fechar:a.fechar}}function Ka(o,e){let r=()=>{e().then(t=>{if(!t){V({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}Ya(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener($e,r),()=>o.removeEventListener($e,r)}async function qr(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var Za=0,Qa=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Pe=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return Ir(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Qa(e)?e:null}catch{return null}}async gravar(e){if(!Or(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return Za+=1,await tc(this.area,Za%25===0),!0}};async function tc(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(Ve)).length<=200)return 0;let r=await qr(o,Ve),t=Object.entries(r).filter(([,i])=>Qa(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var on=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),De=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return Tr(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return on(e)?e:null}catch{return null}}async gravar(e){if(!Or(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await ac(this.area,this.agora()),!0}};async function ac(o,e){try{let r=await qr(o,Mr),t=Object.entries(r).filter(([,n])=>on(n)).map(([n,i])=>({k:n,em:i.coletadoEm})).sort((n,i)=>i.em-n.em),a=new Set;t.forEach((n,i)=>{(i>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(i=>i.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var sc=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",ar=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new Pe(e,r,t),this.repoHistorico=new De(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}definir(e,r){this.fatias.set(e,r);for(let t of[...this.ouvintes])try{t(e)}catch{}if(r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:sc(i),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var Fr=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],cc={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},lc=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function en(o){let e=new Set(o?.length?o:lc),r=new Set(["descricao"]);for(let[t,a]of Object.entries(cc))e.has(a)&&r.add(t);return r}var rn=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),Vr={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};function te(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},O(o.icone,14))}function tn(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=O("chevron",14),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("span",{class:"spro-p-icone","aria-hidden":"true"},O(o.icone,15)),l("h3",{},o.titulo),e,a),r),i=s=>{n.toggleAttribute("data-recolhido",!s),a.setAttribute("aria-expanded",String(s)),r.hidden=!s};return i(o.aberto),a.addEventListener("click",()=>{let s=n.hasAttribute("data-recolhido");i(s),o.aoAlternar(s)}),{el:n,definirAberto:i,atualizar(s,c){n.setAttribute("data-estado",s),e.replaceChildren(...(c.acoes??[]).map(te)),r.replaceChildren(...c.corpo.filter(d=>d!=null&&d!==!1))}}}var dc="configViewFlashPanelArvorePro",an="optionsPro";function Ur(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function nn(o){let e=Ur(o,dc);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function nr(o){let e=Ur(o,an);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function sn(o){return nr(o).optionsFlashMenu_panelinfo!=="disabled"}function cn(o,e){return nr(o)[`panelDadosArvorePro_${e}`]!=="hide"}function ln(o,e,r){try{let t=nr(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(an,JSON.stringify(t))}catch{}}function ir(o,e){let r=Ur(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function Se(o,e){return nr(o)[`optionsFlashMenu_${e}`]!=="disabled"}function pc(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function dn(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},O("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function Ho(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function Oo(o){return l("div",{class:"spro-p-nota"},o)}function bo(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[dn(o.erro??"",e)]:[pc(t)];let a=r(o.dado);return o.estado==="erro"?[...a,dn(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}function pn(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os grupos\u2026")),a=H(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});o.op.opcoesAcompanhamento().then(({grupos:n,atual:i})=>{a.el.isConnected&&uc(o,a,t,n,i,e,r)}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar os grupos."),t.replaceChildren()})}function uc(o,e,r,t,a,n,i){let s=l("select",{class:"spro-campo","aria-label":"Grupo"},l("option",{value:""},"(sem grupo)"),...t.map(g=>l("option",{value:g.valor},g.texto)));s.value=a??"";let c=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});c.value=n?n.observacao??"":i.slice(0,450);let d=o.reaberturaProgramada||!!n?.reabertura,p=No("Reabertura programada",!!n?.reabertura,g=>f.hidden=!g),f=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!n?.reabertura});f.value=n?.reabertura?xa(n.reabertura):"";let u=Z("Salvar",()=>void m()),m=async()=>{if(d&&p.input.checked&&!f.value){e.erro("Informe a data da reabertura.");return}let g=Aa(c.value,d&&p.input.checked?ba(f.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.value,observacao:g}),[u])&&o.recarregar("acompanhamento")};Xe(r,d?p.el:null,d?l("div",{class:"spro-p-grade"},f):null,uo("Grupo",s),uo("Observa\xE7\xE3o",c),K(u))}var W=(o,e)=>o.loja.ler(e);function oo(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void na(o,e)},e,...t)}function ae(o,e){return Oo(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var eo=(...o)=>l("div",{class:"spro-p-linha"},...o);function mc(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?Ko({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},O("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var un={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=W(o,"acompanhamento"),r=W(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>pn(o,a,t)}]:[],corpo:bo(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[ae(i.motivo,"O acompanhamento especial")];if(!i.valor)return[Ho("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:d}=i.valor;return[eo(oo(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),d?eo(mc(d,o.agora())):null]})}}}};function sr(o,e){let r=l("textarea",{class:"spro-campo spro-p-anotacao",rows:"7",maxlength:String(be),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});r.value=e?.texto??"";let t=l("span",{class:"spro-p-contador","aria-live":"polite"}),a=()=>{let m=be-r.value.length;t.textContent=m<=0?"Limite de caracteres atingido.":`${m} caracteres restantes`};r.addEventListener("input",a),a();let n=m=>r.value.slice(0,m).split(`
`).length-1,i=l("button",{type:"button",class:"spro-botao pequeno","aria-label":"Transformar as linhas selecionadas em checklist"},O("check",14),"Checklist");i.addEventListener("click",()=>{r.value=fa(r.value,n(r.selectionStart??0),n(r.selectionEnd??0)).slice(0,be),a(),r.focus()});let s=l("input",{type:"date",class:"spro-campo spro-p-data","aria-label":"Data para inserir na anota\xE7\xE3o"});s.value=We(r.value)??"",s.addEventListener("change",()=>{s.value&&(r.value=ga(r.value,s.value).slice(0,be),a())});let c=No("Prioridade",e?.prioridade??!1,()=>{}),d=Z("Salvar",()=>void u(r.value,c.input.checked)),p=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover anota\xE7\xE3o"),f=H(o,{titulo:e?"Editar anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",icone:"nota",conteudo:[r,t,l("div",{class:"spro-p-ferramentas"},i,l("label",{class:"spro-p-opcao"},O("calendario",14),l("span",{},"Data"),s),c.el),K(e?p:null,d)]}),u=async(m,g)=>{await f.gravar(()=>o.op.anotar({texto:m.trim(),prioridade:g}),[d,p])&&o.recarregar("anotacao")};p.addEventListener("click",()=>{Zo(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(m=>{m&&u("",!1)})})}async function Gr(o,e){try{await e()}catch(r){V(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var mn={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=W(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null;return{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void Gr(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>sr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void Zo(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(a=>{a&&Gr(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>sr(o,null)}]:[],corpo:bo(e,()=>o.recarregar("anotacao"),a=>{if(!a.disponivel)return[ae(a.motivo,"As anota\xE7\xF5es")];if(!a.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>sr(o,null)},"Adicionar anota\xE7\xE3o"))];let{texto:n,prioridade:i}=a.valor,s=We(n),c=s?Ko({data:s,hora:"23:59",vencimento:!0},o.agora()):null,d=je(n).map((p,f)=>p.marca===null?l("div",{class:"spro-p-nota-linha"},p.texto||" "):l("label",{class:`spro-p-nota-linha item${p.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:p.marca==="feito",onchange:()=>void Gr(o,()=>o.op.alternarItemDaAnotacao(f))}),l("span",{},p.texto)));return[l("div",{class:`spro-p-post-it${i?" prioridade":""}`},i?l("span",{class:"spro-p-chip vencido"},O("alerta",11),"prioridade"):null,...d,s&&c?l("span",{class:`spro-p-chip ${c.nivel}`},O("calendario",11),`${Be({data:s,hora:"23:59",vencimento:!0})} \xB7 ${c.rotulo}`):null)]})}}}};function fn(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando a lista de usu\xE1rios\u2026")),a=H(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[t]});o.op.opcoesAtribuicao().then(({opcoes:n,atual:i})=>{if(!a.el.isConnected)return;let s=e.usuario?n.find(u=>u.texto.split(" - ")[0]?.trim().toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0,c=_o(n,i??s,"usu\xE1rios da unidade"),d=Z("Salvar",()=>void f(c.valor(),d,p)),p=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),f=async(u,...m)=>{if(u===""){a.erro("Escolha um usu\xE1rio.");return}let g=u===null?void 0:n.find(x=>x.valor===u);if(await a.gravar(()=>o.op.atribuir(u),m)){let[x="",...P]=(g?.texto??"").split(" - ");r(u===null?{usuario:null}:{usuario:x.trim(),nome:P.join(" - ").trim()})}};p.addEventListener("click",()=>void f(null,d,p)),t.replaceChildren(l("p",{class:"spro-p-nota"},"Atribuir para:"),c.el,K(e.usuario?p:null,d))}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar a lista de usu\xE1rios."),t.replaceChildren()})}var gn={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"pessoa",desenhar(o){let e=W(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:bo(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return eo(oo(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?te({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>fn(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let d=c.dado.linhas.map(p=>p===a?{...p,usuario:s.usuario,nomeUsuario:s.nome,texto:Ea(p.texto,s.usuario)}:p);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:d,usuario:s.usuario}})})}):null)}):[Oo(t.texto||"Processo sem andamento aberto.")],1)}}}};var vn={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"camadas",desenhar(o){let r=W(o,"blocoInterno").dado;if(r&&ke(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[eo(r.descricao?oo(o,r.descricao):Oo("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,i)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${i}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};async function Br(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var jr=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function hn(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=Z("Salvar",()=>void n()),a=H(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[uo("Especifica\xE7\xE3o",r),K(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function bn(o,e){let r=jr("Carregando os tipos de processo\u2026"),t=H(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[r]});Br(o,t,r,a=>{let n=a.tipoAtual??a.tipos.find(c=>c.texto===e)?.valor,i=_o(a.tipos,n,"tipos de processo"),s=Z("Salvar",async()=>{if(!i.valor()){t.erro("Escolha um tipo.");return}await t.gravar(()=>o.op.alterarProcesso({tipo:i.valor()}),[s])&&o.recarregar("dadosProcesso")});r.replaceChildren(uo("Tipo de processo",i.el),K(s))})}function xn(o){let e=jr("Carregando o formul\xE1rio do processo\u2026"),r=H(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});Br(o,r,e,async t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(u=>l("button",{type:"button",role:"radio","aria-checked":String(u===a),"data-nivel":u},u==="publico"?"P\xFAblico":"Restrito")),i=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"}),c=null,d=[],p=async()=>{if(!c){s.replaceChildren(l("p",{class:"spro-p-nota"},"Carregando as hip\xF3teses legais\u2026"));try{d=await t.hipoteses("1"),c=_o(d,t.hipoteseAtual,"hip\xF3teses legais"),s.replaceChildren(uo("Hip\xF3tese legal",c.el))}catch(u){s.replaceChildren(),r.erro(u instanceof Error?u.message:"N\xE3o foi poss\xEDvel carregar as hip\xF3teses legais.")}}};for(let u of n)u.addEventListener("click",()=>{a=u.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let m of n)m.setAttribute("aria-checked",String(m===u));s.hidden=a!=="restrito",a==="restrito"&&p()});let f=Z("Salvar",async()=>{if(a==="restrito"&&!c?.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:c?.valor()??""}:{nivel:a}),[f])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,s,K(f)),a==="restrito"&&await p()})}function An(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=Z("Salvar",()=>void n()),a=H(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[uo("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),K(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function En(o){let e=jr("Carregando os interessados\u2026"),r=H(o,{titulo:"Interessados do processo",icone:"pessoa",conteudo:[e]});Br(o,r,e,t=>{let a=new Map(t.interessados.map(s=>[s.id,s])),n=t.interessados.map(s=>{let c=l("button",{type:"button",class:"spro-p-acao perigo","aria-pressed":"false","aria-label":`Retirar ${s.texto}`},"Retirar"),d=l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},s.texto),c);return c.addEventListener("click",()=>{let p=a.has(s.id);p?a.delete(s.id):a.set(s.id,s),d.toggleAttribute("data-retirado",p),c.textContent=p?"Manter":"Retirar",c.setAttribute("aria-pressed",String(p)),i.disabled=a.size===t.interessados.length}),d}),i=Z("Salvar",async()=>{await r.gravar(()=>o.op.alterarProcesso({interessados:t.interessados.filter(c=>a.has(c.id))}),[i])&&o.recarregar("dadosProcesso")});i.disabled=!0,e.replaceChildren(n.length?l("ul",{class:"spro-p-lista-modal"},...n):l("p",{class:"spro-p-nota"},"O processo n\xE3o tem interessados."),l("p",{class:"spro-p-nota"},"Para incluir um interessado, use Consultar/Alterar Processo no SEI."),K(i))})}var zo=o=>{let e=W(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},we=o=>!o.sigiloso&&!!zo(o)?.editavel;async function cr(o,e){let r=zo(o);if(!r)return;let t=!so(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:va(r.especificacao,e).slice(0,100)});V(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){V(o,Po(a),7e3)}o.recarregar("dadosProcesso")}function lr(o,e,r=2){let t=W(o,"dadosProcesso");return bo(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[ae(a.motivo,"Este dado")],r)}var yn={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"documento",desenhar(o){let e=W(o,"dadosProcesso"),r=zo(o),t=[];return r&&we(o)&&(t.push({icone:"alerta",rotulo:so(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:so(r.especificacao,"URGENTE"),aoClicar:()=>void cr(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:so(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:so(r.especificacao,"TRANCADO"),aoClicar:()=>void cr(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>hn(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:lr(o,a=>[eo(oo(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${so(a.valor.especificacao,"URGENTE")?"urgente":""} ${so(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},Pn={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"pasta",desenhar(o){let e=zo(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&we(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>bn(o,r)}]:[],corpo:[eo(oo(o,r||"(n\xE3o informado)"))]}}}},Dn={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"cadeado",desenhar(o){let e=zo(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":sa.publico;return{estado:"pronto",desenho:{acoes:e&&we(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>xn(o)}]:[],corpo:[eo(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},O(ia[r],13)),oo(o,a))]}}}},Sn={tipo:"interessados",titulo:"Interessados",icone:"pessoa",desenhar(o){return{estado:W(o,"dadosProcesso").estado,desenho:{acoes:zo(o)&&we(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>En(o)}]:[],corpo:lr(o,r=>r.valor.interessados.length?r.valor.interessados.map(t=>l("div",{class:"spro-p-linha interessado"},...ya(t).map(a=>oo(o,a)))):[Ho("Sem interessados.")])}}}},wn={tipo:"assuntos",titulo:"Assuntos",icone:"etiqueta",desenhar(o){return{estado:W(o,"dadosProcesso").estado,desenho:{corpo:lr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>eo(oo(o,t))):[Ho("Sem assuntos.")])}}}},Cn={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"nota",desenhar(o){let e=W(o,"dadosProcesso"),r=zo(o);return{estado:e.estado,desenho:{acoes:r&&we(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>An(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:lr(o,t=>{let a=ha(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>eo(oo(o,`${n.unidade}: ${n.observacao}`))):[Oo("Sem observa\xE7\xF5es.")]})}}}};var fc=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function Wr(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os marcadores\u2026")),t=H(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});o.op.opcoesMarcador().then(a=>{t.el.isConnected&&gc(o,t,r,a,e)}).catch(a=>{t.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar os marcadores."),r.replaceChildren()})}function gc(o,e,r,t,a){let n=a?he(a.texto):{prazo:null,texto:""},i=_o(t,a?t.find(v=>v.texto===a.nome)?.valor:void 0,"marcadores"),s=No("Controlar prazo",!!n.prazo,v=>f.hidden=!v),c=No("Controlar vencimento (\u201CAt\xE9\u201D)",!!n.prazo?.vencimento,()=>{}),d=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});d.value=n.prazo?.data??fc(o.agora());let p=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});p.value=n.prazo?.hora??"23:59";let f=l("div",{class:"spro-p-grade",hidden:!n.prazo},c.el,l("div",{class:"spro-p-par"},d,p)),u=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});u.value=n.texto;let m=Z("Salvar",()=>void g()),g=async()=>{let v=t.find(b=>b.valor===i.valor());if(!v){e.erro("Escolha um marcador.");return}if(s.input.checked&&!d.value){e.erro("Informe a data do prazo.");return}let x=da({prazo:s.input.checked?{data:d.value,hora:p.value||"23:59",vencimento:c.input.checked}:null,texto:u.value}),P=await e.gravar(async()=>(a&&v.texto!==a.nome&&await o.op.desmarcar(a.nome),o.op.marcar({marcador:v.texto,texto:x})),[m]);return o.recarregar("marcador"),P};Xe(r,uo("Marcador",i.el),a?l("p",{class:"spro-p-nota"},O("etiqueta",12),` Atual: ${a.nome}. Escolher outro troca o marcador.`):null,s.el,f,uo("Texto",u),K(m))}function vc(o,e){let{prazo:r}=he(e);if(!r)return null;let t=Ko(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},O("relogio",11),`${r.vencimento?"at\xE9 ":""}${Be(r)} \xB7 ${t.rotulo}`)}async function hc(o,e){if(await Zo(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);V(o,r.resumo)}catch(r){V(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function bc(o,e,r){let{texto:t}=he(e.texto),a=e.icone?l("img",{class:"spro-p-marcador-icone",src:e.icone,alt:""}):O("etiqueta",14);return eo(l("div",{class:"spro-p-marcador"},oo(o,e.nome,"forte",a),vc(o,e.texto),t?oo(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},te({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>Wr(o,e)}),te({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void hc(o,e)})):null)}var In={tipo:"marcador",titulo:"Marcador",icone:"etiqueta",desenhar(o){let e=W(o,"marcador"),r=pa(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>Wr(o)}]:[],corpo:[...bo(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>bc(o,a,t.editavel)):[Ho("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},O("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var On=[mn,gn,vn,In,un,yn,Pn,Dn,Sn,wn,Cn];var Mn=1e4;function Xr(o){if(!o.getElementById("frmArvore"))return null;try{return Dr(Lo(o))}catch{return null}}function Yr(o,e=Mn){return new Promise(r=>{let t=Xr(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=u=>{i||(i=!0,d?.disconnect(),clearTimeout(f),clearInterval(p),r(u))},c=()=>{let u=Xr(o);u&&s(u)},d=typeof n=="function"&&o.documentElement?new n(c):null;d?.observe(o.documentElement,{childList:!0,subtree:!0});let p=setInterval(c,250),f=setTimeout(()=>s(null),e)})}var Ln="data-spro-processo-raiz";function xc(o){for(let e of o.querySelectorAll(`[${Ln}], [data-spro-slot="atividades"]`))e.remove()}function Nn(o){return On.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&rn.has(e.tipo)))}function _n(o){let e=new Set;for(let r of Nn(o))for(let t of Vr[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function Tn(o){let e=o.doc;wo(e),xc(e);let r=e.getElementById("frmArvore")??e.body,t=go(e),a=(b="")=>l("div",{class:`spro-p-raiz ${b}`.trim(),[Ln]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let d=e.getElementById("divRelacionados");d?d.before(s):i.after(s),r.append(n);let p=new Map,f=Nn(o),u=b=>Fr.indexOf(b);for(let b of f){let S=tn({tipo:b.tipo,titulo:b.titulo,icone:b.icone,aberto:cn(o.armazenamento,b.tipo),aoAlternar:D=>ln(o.armazenamento,b.tipo,D)});p.set(b.tipo,{def:b,casca:S})}for(let b of[...Fr].sort((S,D)=>u(S)-u(D))){let S=p.get(b);S&&n.append(S.casca.el)}let m=p.get("anotacoes");m&&i.append(m.casca.el);let g=b=>{let S=p.get(b);if(!S)return;let D;try{D=S.def.desenhar(o)}catch(M){console.warn(`[SEI Pro] painel ${b}:`,M),D=null}S.casca.el.hidden=D===null,D&&S.casca.atualizar(D.estado,D.desenho)},v=b=>{if(b)g(b);else for(let S of p.keys())g(S)},x=o.loja.aoMudar(b=>{for(let[S,D]of p)Vr[D.def.tipo].includes(b)&&g(S)});v();let P=Jo(e,()=>{let b=go(e);for(let S of[n,i])b?S.setAttribute("data-tema","escuro"):S.removeAttribute("data-tema")});return{raiz:n,redesenhar:v,desmontar(){x(),P(),n.remove(),i.remove(),s.remove()}}}function kn(o,e,r={}){let t=Tn(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=Tn(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}var Ac="seipro-historico-sessao",Kr="seiProHistoricoRestauro",Ec=600*1e3,Rn;function Jr(){if(Rn!==void 0)return Rn;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Hn(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};Jr()?.setItem(Kr,JSON.stringify(t))}catch{}}function dr(){try{Jr()?.removeItem(Kr)}catch{}}function Zr(o,e=Date.now()){try{let r=Jr()?.getItem(Kr);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>Ec?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var $n=Promise.resolve();function zn(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return r.request(Ac,e?{signal:e}:{},o).catch(n=>{throw Eo(n)});let t=$n.then(()=>{if(e?.aborted)throw Eo(new DOMException("cancelado","AbortError"));return o()});return $n=t.catch(()=>{}),t}var yc={resumido:"R",completo:"P",total:"T"};var Pc=2e3;function qn(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function Dc(o){let e=[...o.querySelectorAll("td")],r=w(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=w(e[3]),i={data:r,unidade:w(e[1]),...t?{unidadeNome:t}:{},usuario:w(e[2]),descricao:n},s=Rr(r);s&&(i.dataISO=s),a&&(i.usuarioNome=a),o.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let d=w(c);/^\d+$/.test(d)&&(i.nrSei=d);let p=j(c.getAttribute("href")??"").get("id_documento");p&&(i.idDocumento=p)}if(qn(n).startsWith(qn(mo.remetidoPrefixo))){let d=e[3]?.querySelector("a.ancoraSigla"),p=w(d);p&&(i.unidadeCitada=p);let f=d?.getAttribute("title")??"";f&&(i.unidadeCitadaNome=f)}return i}function Qr(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(w(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(Dc),total:r}}function Sc(o){if(o.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=Y(o,"procedimento_consultar_historico")??F(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new E("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function ie(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function ot(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(w(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Fn(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function wc(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let i=0;i<=a&&i+n<=t.length;i+=1){let s=!0;for(let c=0;c<n;c+=1)if(Fn(t[i+c])!==Fn(o.andamentos[c])){s=!1;break}if(s)return[...t.slice(0,i),...o.andamentos]}return null}async function Cc(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=Ic(o,t,r);return a||await zn(()=>Oc(o,e,r),r.sinal)}catch(t){throw Eo(t)}}function Ic(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(ie(e,"hdnTipoHistorico")||"R")!==r.tipo||(ie(e,"hdnInfraPaginaAtual")||"0")!=="0"||Zr(o.http.base.host))return null;let{itens:t,total:a}=Qr(e);return ot(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:ie(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Vn(o,e,r){await k.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function Oc(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new E("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",w(a.doc.querySelector("title")));let n=Zr(t);if(n){try{await Vn(o,a,n),dr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let i={tipo:ie(a,"hdnTipoHistorico")||"R",pagina:ie(a,"hdnInfraPaginaAtual")||"0"},s=i,c=!1,d=async(p,f)=>{c||(Hn(t,i),c=!0);let u={tipo:r.tipo,pagina:String(f)},m=await k.de(p,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:u.tipo,hdnInfraPaginaAtual:u.pagina}).enviar({sinal:r.sinal});return s=u,m};try{let p=i.tipo===r.tipo&&i.pagina==="0"?a:await d(a,0);if(!p.doc.querySelector("#tblHistorico"))throw new E("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",w(p.doc.querySelector("title")));let f=Qr(p),u=ie(p,"hdnInfraHashCriterios"),m=f.total,g=m?Math.min(m,r.limite):r.limite,v=wc(r.cache,u,m,f.itens);if(v)return r.aoProgresso?.(1,1),{andamentos:v,total:m,hash:u,completo:!0,aproveitouCache:!0};let x=[...f.itens],P=f.itens.length,b=p.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,S=b>0?b:m>P&&P>0?Math.ceil(m/P):1;r.aoProgresso?.(1,S);for(let M=1;x.length<g&&ot(p)&&M<Pc;M+=1){p=await d(p,M);let y=Qr(p);if(!y.itens.length)break;x.push(...y.itens),r.aoProgresso?.(M+1,Math.max(S,M+1))}let D=m?x.length>=m:!ot(p);return{andamentos:x,total:m||x.length,hash:u,completo:D,aproveitouCache:!1}}finally{if(c)if(s.tipo!==i.tipo||s.pagina!==i.pagina)try{await Vn(o,a,i),dr()}catch{}else dr()}}var ne=new Map;function Mc(o,e){return`${o.http.base.host}|${j(e).get("id_procedimento")??e}`}function Tc(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new E("CANCELADO","Opera\xE7\xE3o cancelada."));let t=Mc(o,e),a=ne.get(t);if(!a){let i=new AbortController,s=new Set,c={promessa:void 0,controle:i,interessados:0,progresso:s,ultimo:null};c.promessa=Cc(o,e,{tipo:yc.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:i.signal,cache:r.cache,aoProgresso:(d,p)=>{c.ultimo=[d,p];for(let f of s)f(d,p)}}).finally(()=>{ne.get(t)===c&&ne.delete(t)}),c.promessa.catch(()=>{}),ne.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((i,s)=>{let c=!1,d=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",p)},p=()=>{if(c)return;d(),n.interessados-=1;let f=new E("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){s(f);return}ne.get(t)===n&&ne.delete(t),n.controle.abort(),n.promessa.then(()=>s(f),()=>s(f))};r.sinal?.addEventListener("abort",p,{once:!0}),n.promessa.then(f=>{c||(d(),i(f))},f=>{c||(d(),s(Eo(f)))})})}function Un(o,e,r={}){return Tc(o,Sc(e),r)}var se=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Nt({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(Lc(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function qo(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function Lc(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function Bn(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function jn(o,e,r){let t=Y(o,e);if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Wn=o=>e=>j(e.url).get("acao")!==o;async function Nc(o,e,r,t){let a=await o.http.obter(jn(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return k.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>F(a.html,i)).find(Boolean);if(!n)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return k.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function et(o,e,r,t){let a=await Bn(o,e,t.sinal),n=await Nc(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??Wn(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function pr(o,e,r,t){return et(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=J("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...J("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Xn(o,e,r,t){return et(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(d=>d.valor===a.valor("selAtribuicao")&&d.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=ao(r),s=a.opcoes("selAtribuicao").filter(d=>d.valor!=="null"),c=s.find(d=>d.valor===r)??s.find(d=>ao(d.texto.split(" - ")[0])===i)??s.find(d=>ao(d.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(d=>ao(d.texto).includes(i)).length===1?s.find(d=>ao(d.texto).includes(i)):void 0);if(!c)throw new E("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(d=>d.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),J("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function Yn(o,e,r,t){return et(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(d=>d.valor===a.valor("selGrupoAcompanhamento")&&d.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...J("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...J("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function _c(o,e,r){let t=jn(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function Gn(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:w(t[1]),texto:w(t[2]),usuario:w(t[3]),data:w(t[4])}})}async function rt(o,e,r,t){let a=await Bn(o,e,t.sinal),n=await _c(o,a,t.sinal),i=Gn(n),s=ao(r.marcador),c=i.find(u=>ao(u.marcador)===s),d={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...d,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(d.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...d,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let u=F(n.html,"andamento_marcador_remover");if(!u)throw new E("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let m=k.de(n,"#frmGerenciarMarcador",o.http);m.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let g=await o.http.enviar(u,m.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(Gn(g).some(v=>v.id===c.id))throw new E("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...d,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let p;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))p=k.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=F(n.html,"andamento_marcador_cadastrar");if(!u)throw new E("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");p=await k.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let f=p.escolher("selMarcador",r.marcador);return p.definir({hdnIdMarcador:f.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),d.mudancas=c?J(`Texto do marcador ${f.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${f.texto}${r.texto?`: ${r.texto}`:""}`}],d.mudancas.length?t.aplicar?(await p.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Wn("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...d,aplicado:!0,resumo:`Marcador "${f.texto}" aplicado em ${a.protocolo}.`}):{...d,resumo:`Vai marcar ${a.protocolo} com "${f.texto}".`}:{...d,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function ur(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function Kn(o,e,r){let t=Y(e,"procedimento_alterar"),a=t??Y(e,"procedimento_consultar");if(!a)throw new E("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await k.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function mr(o){return o.map(e=>e.texto).filter(Boolean)}var kc={0:"publico",1:"restrito",2:"sigiloso"};async function Jn(o,e,r){let{form:t,editavel:a}=await Kn(o,e,r),n=kc[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:ur(t,"selHipoteseLegal").trim()||e.hipotese,s=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...i?{hipotese:i}:{},tipo:ur(t,"selTipoProcedimento")||e.tipo,especificacao:t.valor("txtDescricao")??"",assuntos:mr(t.itensLupa("selAssuntos")),interessados:mr(t.itensLupa("selInteressadosProcedimento")),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:Rc(t),editavel:a,...s?{autuacao:s}:{}}}function Rc(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=w(t[0]);a&&e.push({unidade:a,observacao:w(t[1])})}return e}async function Zn(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await Kn(o.http,a,{sinal:t.sinal});if(!i)throw new E("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...J("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let d=ur(n,"selTipoProcedimento"),p=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:p.valor}),s.push(...J("Tipo",d,p.texto))}if(r.nivel!==void 0){let d=Bo[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:Go[r.nivel]}),s.push(...J("N\xEDvel de acesso",d,Bo[Go[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let d=ur(n,"selHipoteseLegal"),p=n.valor("rdoNivelAcesso")||Go.restrito,f=Wo(await jo(o,n,p,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:f.id}),s.push(...J("Hip\xF3tese legal",d,f.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new E("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(s.push(...J("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(s.push(...J("Interessados",mr(n.itensLupa("selInteressadosProcedimento")).join("; "),mr(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:d=>j(d.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function Qn(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>Xn(o,t,n,i)),anotar:n=>a(i=>pr(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await fe(o.http,e);return pr(o,t,{texto:ma(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await fe(o.http,e);return i?pr(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>Yn(o,t,n,i)),marcar:n=>a(i=>rt(o,t,n,i)),desmarcar:n=>a(i=>rt(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>Zn(o,t,n,i)),opcoesAtribuicao:()=>Bt(o.http,e),opcoesMarcador:()=>jt(o.http,e),opcoesAcompanhamento:()=>Wt(o.http,e),formularioDoProcesso:()=>Xt(o,e)}}var Ce=class extends Le{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function oi(o,e){return`${o}|${e}`}function ei(o){let e=me(Lo(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function ri(o){let e=new Ce(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>Lo(o.topo)),r=new se(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:_e(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??Qn(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>Un(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await Yo(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}function $c(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function Hc(o){return async()=>{try{return await o()}catch(e){throw new Error(Ue(e))}}}function ti(o){let e=zc(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,Hc(t)]))}function zc(o){let e=_e(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await Jn(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await fe(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:$c(o.arv),editavel:!1}:{itens:await Gt(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await Ft(o.http,o.arv)}:t,atribuicao:async()=>({...Vt(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function tt(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function ai(o){o.documentElement?.setAttribute(Kt,"1")}function ni(o){o.documentElement?.setAttribute(Jt,"1")}function ii(o){o.documentElement?.setAttribute(Qt,"1")}function si(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function ci(o){o.documentElement?.setAttribute(Zt,"1")}function li(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}function fr(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var gr=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function Ie(o){return fr(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function qc(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function Fc(o){return o.externo&&o.formato!=="circular"}function Vc(o,e){if(!qc(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function Uc(o){let e=fr(o);return e?e.split(" "):[]}function Gc(o){return fr(`${o.titulo} ${o.numero}`)}function Bc(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&Vc(o,r)||e.externos&&Fc(o)||e.cancelados&&o.cancelado))return!1;let a=Uc(e.texto);if(a.length){let n=Gc(o);if(!a.every(i=>n.includes(i)))return!1}return!0}function di(o,e,r){let t=new Set;for(let a of o.documentos)Bc(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var ce="data-spro-f-oculto";function pi(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function ui(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!pi(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!pi(r));r=r.nextElementSibling);return e}function jc(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function Wc(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=jc((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),i=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),s=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:mi(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:i,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:s||void 0,link:"",src:"",acoes:[],botoes:[]}}function mi(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function fi(o,e,r,t,a){let n=o.getElementById("divArvore"),i={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return i;let s=new Map(e.map(g=>[g.id,g])),c=[],d=new Set;for(let g of n.querySelectorAll('a[id^="anchor"]')){let v=qo(g.id,"anchor");if(!v||v===r)continue;let x=s.get(v)??Wc(o,v);if(!x)continue;let P=mi(g);c.push({id:v,ancora:g,doc:P===x.pasta?x:{...x,pasta:P}}),P&&d.add(P)}let p=c.map(g=>g.doc),f=Ie(t),u=di({documentos:p},t,a),m=new Set;if(f){for(let g of c)if(!u.has(g.id))for(let v of ui(g.ancora))m.add(v)}for(let g of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(g.id))continue;let v=g.id.slice(6);if(i.pastas+=1,!d.has(v)){i.pastasFechadas+=1;continue}if(f&&!u.has(v)){for(let P of ui(g))m.add(P);let x=o.getElementById(`div${v}`);x&&m.add(x)}}for(let g of Array.from(n.querySelectorAll(`[${ce}]`)))m.has(g)||g.removeAttribute(ce);for(let g of m)g.hasAttribute(ce)||g.setAttribute(ce,"1");return i.total=p.length,i.visiveis=p.filter(g=>u.has(g.id)).length,i}function gi(o){for(let e of Array.from(o.querySelectorAll(`[${ce}]`)))e.removeAttribute(ce)}var Xc=90,vi=120,hi=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function Yc(o,e){if(!e)return{principal:"",dica:""};let r=o.total===1?"documento":"documentos",t=o.visiveis===0?`Nenhum documento encontrado (${o.total} na \xE1rvore).`:`${o.visiveis} de ${o.total} ${r}`,a=o.pastasFechadas>0?"Pastas fechadas n\xE3o entram: abra-as para filtrar os documentos delas.":"";return{principal:t,dica:a}}function Kc(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},O("fechar",12)),r=new Map;for(let i of hi)r.set(i.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":i.chave,"aria-pressed":"false","aria-label":`${i.rotulo}. ${i.ajuda}`},i.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-dica"});return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},O("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,a)),busca:o,limpar:e,chips:r,status:t,dica:a}}function bi(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;wo(r);let a=Kc(),n={...gr},i={visiveis:0,total:0,pastasFechadas:0,pastas:0},s,c,d=!1,p=()=>{let y=r.getElementById("divArvore");y?.parentElement&&(a.raiz.parentElement!==y.parentElement||a.raiz.nextElementSibling!==y)&&y.parentElement.insertBefore(a.raiz,y)},f=()=>{go(r)?a.raiz.setAttribute("data-tema","escuro"):a.raiz.removeAttribute("data-tema")},u=()=>{let y=Ie(n);for(let G of hi)a.chips.get(G.chave)?.setAttribute("aria-pressed",n[G.chave]?"true":"false");a.busca.value!==n.texto&&(a.busca.value=n.texto),a.limpar.hidden=!y;let{principal:_,dica:$}=Yc(i,y);(a.status.textContent!==_||a.dica.textContent!==$)&&(a.status.textContent=_,a.dica.textContent=$),a.status.parentElement.hidden=!y,a.raiz.toggleAttribute("data-ativo",y),a.raiz.hidden=i.total===0&&i.pastas===0&&!y},m=()=>(i=fi(r,o.documentos.todos(),o.idProcedimento,n,{unidade:o.unidade.sigla}),u(),i),g=0,v=()=>{if(d)return;p();let y=Date.now();y-g>=vi&&(g=y,m()),clearTimeout(c),c=setTimeout(()=>{d||(g=Date.now(),p(),m())},vi)},x=y=>{n={...n,...y},m()};a.busca.addEventListener("input",()=>{n={...n,texto:a.busca.value},clearTimeout(s),s=setTimeout(()=>{d||m()},Xc)}),a.busca.addEventListener("keydown",y=>{y.key==="Escape"&&Ie(n)&&(y.preventDefault(),y.stopPropagation(),P())});for(let[y,_]of a.chips)_.addEventListener("click",()=>x({[y]:!n[y]}));let P=()=>{clearTimeout(s),n={...gr},m(),a.busca.focus()};a.limpar.addEventListener("click",P);let b=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,S=r.getElementById("frmArvore")??t.parentElement,D=typeof b=="function"?new b(y=>{a.raiz.isConnected&&y.every($=>a.raiz.contains($.target)||$.addedNodes.length+$.removedNodes.length>0&&[...$.addedNodes,...$.removedNodes].every(G=>G===a.raiz))||v()}):null;D?.observe(S,{childList:!0,subtree:!0});let M=Jo(r,f);return p(),f(),m(),{estado:()=>({...n}),definir:x,limpar:()=>{clearTimeout(s),n={...gr},m()},reaplicar:m,barra:()=>a.raiz,destruir:()=>{d=!0,clearTimeout(s),clearTimeout(c),D?.disconnect(),M(),gi(r),a.raiz.remove()}}}var vr=["Copiar","Abrir","Acoes"],at={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},no={tipo:"local"},N=(...o)=>({tipo:"acao",acoes:o}),Do=(...o)=>({tipo:"funcao",funcoes:o}),hr=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:no,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:no,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:no,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:no,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:no,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:no,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:no,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:N("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:N("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:N("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:N("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:N("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:N("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:N("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Do("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Do("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Do("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:N("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Do("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Do("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:N("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:N("md_pet_intimacao_cadastrar")}],xi=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:no},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:no},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:no},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:no},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:no},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:no},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:N("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:N("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:N("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:N("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:N("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:N("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:N("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:N("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:N("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:N("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:N("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:N("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:N("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:N("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:N("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:N("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:N("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:N("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Do("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Do("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Do("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Do("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:N("arvore_ordenar")}],br="Ativar menu ao clicar",Ai=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],Ei=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],yi=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],Jc={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},Zc=o=>Jc[o]??o;function Pi(o,e){let r=Zc(e);return o.find(t=>t.nome===r)}var lf=hr.filter(o=>o.modo).map(o=>o.nome);function Di(o){return o.includes(" ")?o.split(" ").pop()??"":""}function le(o){let e=Di(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function Si(o){let e=o.trim(),r=Di(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function wi(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var Qc=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),nt=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),it=(o,e)=>`<a href="${Qc(o)}" target="_blank">${nt(e)}</a>`,Ci=o=>({texto:le(o.rotulo)});function Ii(o){let e=le(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${Si(o.rotulo)} (${wi(o.citacaoOpcao)}${e})`}}var Oi=o=>({texto:o.linkDocumento});function Mi(o){let e=le(o.rotulo);return{texto:e,html:it(o.linkDocumento,e)}}function Ti(o){let e=le(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:it(o.linkDocumento,e)};let r=Si(o.rotulo),t=wi(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${nt(r)} (${nt(t)}${it(o.linkDocumento,e)})`}}var Li=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function st(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function Ni(o){return vr.flatMap(e=>o.filter(r=>r.grupo===e))}function ct(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===br)continue;let i=Pi(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var _i=(o,e)=>{for(let r of e){let t=F([...o],r);if(t)return t}return null};function ki(o,e){return e.find(r=>o?.includes(r))??null}var Ri={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function ol(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var el=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function rl(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:st(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(Ci(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(Ii(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(Oi(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(Mi(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(Ti(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let d=c??(s?"processo fechado":void 0);return{desativado:!!d||void 0,dica:d,executar:async()=>{let p=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!p)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let f=!1;if(/minuta/i.test(e.rotulo)){let u=await t.perguntarMinuta();if(!u)return;f=u==="remover"}await t.duplicar(p,f)}}}default:return{executar:()=>{}}}}function $i(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||le(e.rotulo))||el.has(o.id)&&e.id.includes("-")?null:{...t,...rl(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let p=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(p,ol(e))}:{...t,executar:()=>a.abrirEmNovaAba(p)}}if(i.tipo==="acao"){let p=_i(n.acoes,i.acoes);return p?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(p)}:{...t,executar:()=>a.abrirNoVisualizador(p)}:null}let s=ki(n.funcoes,i.funcoes);if(!s)return null;let c=Ri[s];if(!c)return null;let d=async p=>{let f=await a.linkDaTela(n.link,c);if(!f)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);p==="aba"?a.abrirEmNovaAba(f):a.abrirNoVisualizador(f)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await d("visualizador")}};case"ciencia":return{...t,executar:()=>d("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>d("aba")};default:return{...t,executar:()=>d("aba")}}}function Hi(o,e){let r=[];for(let t of ct(hr,e.selecao,Ai)){let a=$i(t,o,e);a&&r.push(a)}return Ni(r)}function xr(o,e,r){let t=[];for(let a of ct(hr,r,yi)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=$i(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function zi(o){let e=o.servicos,r=[],t=st(o.base,o.idProcedimento);for(let a of ct(xi,o.selecao,Ei)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:Li(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=_i(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=ki(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=Ri[s];if(!c)continue;r.push({...n,executar:async()=>{let d=await e.linkDaTela(o.linkProcesso,c);if(!d)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(d):e.abrirNoVisualizador(d)}})}}return Ni(r)}var Oe="spro-pm-icone",qi="data-spro-pm-sig",Fi=["breackline_doc"];function tl(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function al(o,e){return l("span",{class:`action-doc action-${o.modo} ${Oe}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},O(o.icone,13))}function nl(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(Oe))a.push(i);else{if(Fi.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(qi)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Fi.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=al(i,e);s.setAttribute(qi,t),n.after(s),n=s}return!0}function Vi(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let d=qo(c.id,"anchor");if(!d||d===e||!o.getElementById(`anchorImg${d}`))continue;let p=r(d,tl(c)),f=xr(p,i,s);nl(c,d,f)&&(n+=1)}return n}function Ui(o){for(let e of o.querySelectorAll(`.${Oe}`))e.remove()}function Gi(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let d=u=>{if(u.getAttribute("aria-busy")==="true")return;let m=u.getAttribute("data-id")??"",g=u.getAttribute("data-action")??"";u.setAttribute("aria-busy","true");let v=()=>{u.removeAttribute("aria-busy"),u.classList.add("feito"),setTimeout(()=>u.classList.remove("feito"),900)};Promise.resolve(e(m,g)).catch(x=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",x)).finally(v)},p=u=>{let m=u.target?.closest?.(`.${Oe}`);m&&(u.preventDefault(),u.stopPropagation(),d(m))},f=u=>{if(u.key!=="Enter"&&u.key!==" ")return;let m=u.target?.closest?.(`.${Oe}`);m&&(u.preventDefault(),d(m))};return o.addEventListener("click",p,!0),o.addEventListener("keydown",f,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",p,!0),o.removeEventListener("keydown",f,!0)}}var Bi=new Set;var il=null;function sl(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function ji(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Wi(o,e,r){let t=o.ownerDocument,a=t.defaultView;sl(o).append(e);let n=!0,i=()=>{if(!n)return;let u=o.getBoundingClientRect?.();if(!u)return;let m=a?.innerHeight??0,g=a?.innerWidth??0,v=Math.min(r.largura??Math.max(u.width,r.larguraMinima??0),Math.max(180,g-16)),x=r.alinharDireita?u.right-v:u.left,P=Math.max(8,Math.min(x,g-v-8)),b=r.alturaMaxima??360;e.style.maxHeight="none";let S=Math.min(e.scrollHeight||b,b),D=m-u.bottom-8,M=u.top-8,y=il?.()??!1,_=!y&&D<Math.min(S,200)&&M>D;e.style.left=`${P}px`,e.style.width=`${v}px`,e.style.maxHeight=`${y?b:Math.max(140,Math.min(b,_?M:D>140?D:b))}px`,e.classList.toggle("spro-flutuante-cima",_),_?(e.style.top="",e.style.bottom=`${m-u.top+4}px`):(e.style.bottom="",e.style.top=`${u.bottom+4}px`),ji(a,_?0:Math.ceil(u.bottom+4+S+12))},s=u=>{let m=u.composedPath?.()??[],g=u.target,v=x=>m.includes(x)||!!g&&!!x.contains?.(g);v(e)||v(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},d=u=>{u.target instanceof Node&&e.contains(u.target)||c()},p=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",d,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",p);let f={ancora:o,fechar:()=>r.aoFechar()};return Bi.add(f),i(),{posicionar:i,fechar(){n&&(n=!1,Bi.delete(f),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",d,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",p),e.remove(),ji(a,0))}}}function Xi(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=u=>{let m=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${u.perigo?" spro-menu-perigo":""}${u.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":u.id,...u.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},O(u.icone,15)),l("span",{class:"spro-menu-rotulo"},u.rotulo),u.dica?l("span",{class:"spro-menu-dica"},u.dica):null);return m.addEventListener("click",g=>{g.preventDefault(),g.stopPropagation(),!u.desativado&&(p(!0),r.aoEscolher(u))}),n.push(m),m};for(let u of vr){let m=e.filter(g=>g.grupo===u);m.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":at[u]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},at[u]),...m.map(s)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=u=>{if(!n.length)return;let m=(u+n.length)%n.length;for(let[g,v]of n.entries())v.setAttribute("tabindex",g===m?"0":"-1");n[m]?.focus?.({preventScroll:!0})};for(let u of n)u.addEventListener("pointermove",()=>c(n.indexOf(u)));let d=Wi(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>p(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function p(u){if(i)return;i=!0;let m=a.contains(t.activeElement);d.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",f,!0),(u||m)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function f(u){if(u.key==="Escape"){u.preventDefault(),u.stopPropagation(),p(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let m=n.findIndex(g=>g.getAttribute("tabindex")==="0");switch(u.key){case"ArrowDown":c(m+1);break;case"ArrowUp":c(m-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[m]?.click();break;case"Tab":p(!0);return;default:return}u.preventDefault(),u.stopPropagation()}return t.addEventListener("keydown",f,!0),r.focar&&c(0),{el:a,fechar:()=>p(!1)}}async function Ki(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new E("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function cl(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?Go[r.nivel]:n;if(r.nivel&&(a.push(...J("N\xEDvel de acesso",Bo[n]??"",Bo[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new E("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await jo(o,e,i,t),c=Wo(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function ll(o,e,r){let t=await Ki(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=F(t.documento.acoes,a)??F(t.documento.acoes,/^documento_alterar/);if(!n)throw new E("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await k.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function dl(o,e,r){let t=Y(e,"documento_escolher_tipo");if(!t)throw new E("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await k.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=k.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function pl(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,w(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=j(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,w(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function ul(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await dl(o,e,t),i=pl(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new E("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:Wo(i,r,"Tipo de documento")}}async function ml(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=k.de(s,"#frmDocumentoCadastro",o.http),d=c.pagina.doc.querySelector("#lblNumero"),p=d!==null&&!/infraLabelOpcional/.test(d.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(p?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let v=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(P=>P.valor===v&&P.valor!=="null"))throw new E("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${v}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:v,hdnIdTextoPadrao:v})}else if(n.textoPadrao){let v=c.opcoes("selTextoPadrao").filter(P=>P.valor!=="null").map(P=>({id:P.valor,texto:P.texto})),x=Wo(v,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:x.id,hdnIdTextoPadrao:x.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await cl(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let f=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:v=>/acao_origem=documento_(?:gerar|cadastrar)/.test(v.url)||/editor_montar/.test(v.html)}),u=j(f.url).get("id_documento")??/id_documento=(\d+)/.exec(f.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:u,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let g=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(v=>v.id===u);return{idDocumento:u,numero:g?.numero??"",titulo:g?.titulo??""}}function Yi(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var fl=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function Ji(o,e,r,t={}){let a=await Ki(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new E("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await ll(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new E("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let d=c==="1"?"restrito":"publico",p=d==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(b=>b.selecionada&&b.valor!=="null")?.valor)??void 0:void 0,f=i.valor("hdnIdSerie")??"";if(!f)throw new E("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:u,tipo:m}=await ul(o,n.arvore,f,r.sinal,!0),g={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${m.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...g,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:v,numero:x,titulo:P}=await ml(o,e,n.arvore,u,m,{tipo:m.id,descricao:t.semMinuta?Yi(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:fl(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?Yi(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:d,hipotese:p},r.sinal);return{...g,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${P||m.texto} ${x?`(${x}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:v,numero:x}}}var gl="seipro-processo-menu",lt="data-spro-pm-pedido";async function vl(o,e){if(!e.html)return Lr(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function Zi(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function Qi(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>V(e,i,s),n=(i,s,c)=>new Promise(d=>{let p=null,f=H(e,{titulo:i,icone:"alerta",largura:420,conteudo:[l("p",{},s),K(...c.map(u=>u.principal?Z(u.rotulo,()=>{p=u.id,f.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{p=u.id,f.fechar()}},u.rotulo)))],aoFechar:()=>d(p)})});return{async copiar(i,s){let c=await vl(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=Zi(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=l("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=l("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await Ji(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(Po(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),d=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return d?(d[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(lt,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(gl)),r.documentElement.hasAttribute(lt)&&(r.documentElement.removeAttribute(lt),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await cr(e,"URGENTE")},clicarBotaoNativo(i){for(let s of Zi(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var hl="configViewFlashMenuPro",bl="configViewFlashDocMenuPro",xl="configViewFlashDocArvorePro";function os(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;wo(r);let n=new se(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new Ce(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>Lo(e.topo)),c=o.servicos??Qi({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),d=`${r.location?.origin??""}${r.location?.pathname??""}`,p=()=>!!Y(i(),"documento_escolher_tipo"),f=h=>({selecao:h,citacao:Me(o.dataValues,"citacaodoc"),base:d,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:p(),uploadLigado:To(o.dataValues,"uploaddocsexternos"),loteLigado:To(o.dataValues,"acoesemlote"),servicos:c}),u=()=>ir(e.armazenamento,bl),m=()=>ir(e.armazenamento,hl),g=()=>ir(e.armazenamento,xl),v=()=>u()?.includes(br)??!1,x=(h,A)=>{let C=n.obter(h);return C||(n.lerDoIframe(r),C=n.obter(h)),{id:h,rotulo:A,dado:C}},P={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},b=h=>{let A=h;if(!A?.closest)return null;let C=A.closest('a[id^="anchorImg"]');if(C){let T=qo(C.id,"anchorImg");return T&&T!==e.arv.idProcedimento&&Se(e.armazenamento,"menudoc")?{tipo:"documento",ancora:C,id:T}:null}let L=A.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return L&&Se(e.armazenamento,"menuproc")?{tipo:"processo",ancora:L}:null},S=h=>{if(h.tipo==="processo")return{itens:zi(f(m())),rotulo:"Menu do processo"};let A=r.getElementById(`anchor${h.id}`),C=x(h.id,(A?.textContent??"").replace(/\s+/g," ").trim());return{itens:Hi(C,f(u())),rotulo:"Menu do documento"}},D=null,M=null,y,_=()=>{clearTimeout(y),M&&clearTimeout(M.timer),M=null;let h=D;D=null,h?.menu.fechar()},$=(h,A)=>{if(D?.ancora===h.ancora)return;_();let{itens:C,rotulo:L}=S(h);if(!C.length)return;let T=Xi(h.ancora,C,{rotulo:L,escuro:go(r),focar:A,rodape:[P],aoFechar:()=>{D?.menu===T&&(D=null)},aoEscolher:R=>{Promise.resolve().then(()=>R.executar()).catch(io=>{console.warn("[SEI Pro] menu da \xE1rvore:",io),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});D={menu:T,ancora:h.ancora},T.el.addEventListener("mouseenter",()=>clearTimeout(y)),T.el.addEventListener("mouseleave",()=>G())},G=()=>{clearTimeout(y),y=setTimeout(_,a)},X=h=>{let A=h;return A?!!(D&&(D.ancora.contains(A)||D.menu.el.contains(A))||M?.ancora.contains(A)):!1},q=h=>{if(X(h.target)){clearTimeout(y);return}let A=b(h.target);if(M&&(clearTimeout(M.timer),M=null),!A||A.tipo==="documento"&&v()){D&&G();return}D&&G(),M={ancora:A.ancora,timer:setTimeout(()=>{M=null,$(A,!1)},t)}},xo=h=>{h.relatedTarget||(M&&(clearTimeout(M.timer),M=null),D&&G())},ro=h=>{let A=b(h.target);if(A){if(A.tipo==="documento"&&v()){h.preventDefault(),h.stopImmediatePropagation(),D?.ancora===A.ancora?_():$(A,!1);return}A.tipo==="documento"&&D?.ancora===A.ancora&&_()}},fo=h=>{let A=b(h.target);!A||!(h.key==="ArrowDown"||(h.key==="Enter"||h.key===" ")&&A.tipo==="documento"&&v())||(h.preventDefault(),h.stopImmediatePropagation(),$(A,!0))};r.addEventListener("mouseover",q),r.addEventListener("mouseout",xo),r.addEventListener("click",ro,!0),r.addEventListener("keydown",fo,!0);let So=null,to=()=>{if(!Se(e.armazenamento,"iconstree")){Ui(r);return}Vi(r,e.arv.idProcedimento,x,()=>f(u()),g)};Se(e.armazenamento,"iconstree")&&(So=Gi(r,async(h,A)=>{let C=r.getElementById(`anchor${h}`),L=x(h,(C?.textContent??"").replace(/\s+/g," ").trim());await xr(L,f(u()),g()).find(R=>R.modo===A)?.executar()},to),to());let Mo=n.acompanharPastas(r,()=>setTimeout(to,80)),Fo=Jo(r,()=>{D&&(go(r)?D.menu.el.setAttribute("data-tema","escuro"):D.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(h,A=!1){let C=qo(h.id,"anchorImg");if(C)return $({tipo:"documento",ancora:h,id:C},A);$({tipo:"processo",ancora:h},A)},atual:()=>D?.menu??null,parar(){_(),r.removeEventListener("mouseover",q),r.removeEventListener("mouseout",xo),r.removeEventListener("click",ro,!0),r.removeEventListener("keydown",fo,!0),So?.(),Mo(),Fo()}}}var Al='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function es(o,e,r){for(let t of o.querySelectorAll(Al)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function rs(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(es(o.doc,"urgentePro",so(t.valor.especificacao,"URGENTE")),o.usaTrancado&&es(o.doc,"trancadoPro",so(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function ts(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var El=["dadosProcesso","marcador"],yl=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function as(o,e){let r=null,t=s=>{let c=ts(s);c===null?o.documentElement?.removeAttribute(Fe):o.documentElement?.setAttribute(Fe,c)},a=()=>{e().then(s=>{if(!(!s||s.sigiloso))for(let c of El)s.loja.ler(c).estado!=="pronto"&&s.recarregar(c)}).catch(s=>console.warn("[SEI Pro] capa do processo:",s))},n=()=>{if(r)return;let s=new AbortController;r=s,t({fase:"coletando",feito:0,total:0}),e().then(async c=>{if(!c||c.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await Yo(c,{sinal:s.signal,aoProgresso:(d,p)=>t({fase:"coletando",feito:d,total:p})}),t("pronto")}).catch(c=>{yl(c)||s.signal.aborted?t({fase:"parada"}):t({fase:"erro",mensagem:Ue(c)})}).finally(()=>{r=null})},i=()=>r?.abort();return o.addEventListener(He,a),o.addEventListener(ze,n),o.addEventListener(qe,i),()=>{o.removeEventListener(He,a),o.removeEventListener(ze,n),o.removeEventListener(qe,i)}}var dt=null;Sa(`${ft}
${St}`);si(window)&&ci(document);tt(window)&&(ai(document),ni(document),ii(document));var ns=window;if(!ns.__seiProProcessoPaineis&&tt(window)&&!li(window)){ns.__seiProProcessoPaineis=!0,Ka(document,pt),as(document,pt);let o=()=>void Dl().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function pt(){return dt??=Pl().catch(o=>{throw dt=null,o}),dt}async function Pl(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await Yr(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=Dt(),t=ei(r),a=e.nivel==="sigiloso",n=new ar(mt(chrome.storage.local,"local"),oi(t.host,t.login),e.idProcedimento,{sigiloso:a}),i=pe(location.href),s=Er(o,"disablequery"),c=ti({http:i,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:s});return ri({doc:document,topo:r,arv:e,loja:n,...t,habilitados:en(nn(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:Er(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:d=>{let p=c[d];p&&n.carregar(d,p)}})}async function Dl(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=To(o,"infoarvore")&&sn(localStorage),r=To(o,"menurapido"),t=To(o,oa);if(!e&&!r&&!t)return;let a=await pt();if(a){if(e){kn(a),rs(a);for(let n of _n(a))a.recarregar(n);Yt(a).catch(()=>{})}r&&os({ctx:a,dataValues:o,http:pe(location.href)}),t&&bi(a)}}})();
