/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Wa(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function je(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Wa(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function $o(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function po(o,e){let r=$o(o,e);return!(r===!1||r===0||r==="")}function ue(o,e){let r=$o(o,e);return r===!0||r===1||r==="1"}var Be=`/*
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
`;var Ja={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function G(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Ja[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Ge={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Ka={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function zo(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Ka[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var Za=/[A-Za-z0-9\-_.*]/;function We(o){let e="";for(let r of o)r===" "?e+="+":Za.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Xe(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${We(zo(r))}=${We(zo(t??"",a))}`}).join("&")}function Je(o){let e=r=>encodeURIComponent(zo(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var Ke="application/x-www-form-urlencoded";function me(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=Ge[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var Ze="application/x-www-form-urlencoded; charset=ISO-8859-1";var Ye=null;function uo(o){return Ye?Ye(o):new DOMParser().parseFromString(o,"text/html")}function A(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var g=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function fe(o){if(o instanceof g)return o;if(o instanceof DOMException&&o.name==="AbortError")return new g("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new g("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function Qe(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=uo(r)}}}function or(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new g("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new g("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=A(r);throw new g("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new g("SEI_VALIDACAO",r,r)}return o}function qo(o,e={}){let r=new URL(".",o),t=e.fetch??((...m)=>fetch(...m)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(m){n>=a&&await new Promise(l=>i.push(l)),n+=1;try{return await m()}finally{n-=1,i.shift()?.()}}let c=m=>new URL(m.replace(/&amp;/g,"&"),r).href;async function p(m,l,f){return s(async()=>{try{let v=await t(c(m),{credentials:"same-origin",redirect:"follow",...l,signal:f.sinal}),h=me(await v.arrayBuffer());return or(Qe(v.url||c(m),v.status,h),f)}catch(v){throw fe(v)}})}async function u(m,l={}){return s(async()=>{try{let f=await t(c(m),{credentials:"same-origin",redirect:"follow",signal:l.sinal}),v=new Uint8Array(await f.arrayBuffer()),h=(f.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();h==="text/html"&&or(Qe(f.url||c(m),f.status,me(v)),l);let D=f.headers?.get("content-disposition")??"",O=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(D)?.[1]??/filename="?([^";]+)"?/i.exec(D)?.[1]??"");return{bytes:v,tipo:h,nome:O}}catch(f){throw fe(f)}})}return{base:r,absoluta:c,baixar:u,obter:(m,l={})=>p(m,{method:"GET"},l),enviar:(m,l,f={})=>p(m,f.utf8?{method:"POST",headers:{"Content-Type":Ke},body:Je(l)}:{method:"POST",headers:{"Content-Type":Ze},body:Xe(l,f.modos)},f)}}function to(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function er(){try{return window.top?.document??document}catch{return document}}var rr=`/*
 * Pain\xE9is abaixo da \xE1rvore do processo (op\xE7\xE3o A da spec: lista refinada) e seus modais.
 * As cores v\xEAm dos tokens --spro-* de sei-comum/src/ui/base.css (anexado antes deste arquivo). O escuro vem de
 * data-tema="escuro" na raiz dos pain\xE9is e no di\xE1logo (o quadro e a janela de topo s\xE3o documentos diferentes).
 */
/* Os tokens do base.css seguem o esquema de cores do SISTEMA quando ninguem fixou o tema; aqui o tema e o do SEI
   (claro por padrao, escuro quando o SEI esta escuro), nunca o do sistema operacional. */
.spro-p-raiz,
.spro-pm,
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
`;async function tr(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var ar="data-seipro-processo-paineis",nr="data-seipro-processo-menu";var Ho="processo/",ir=(o,e)=>`${Ho}${o}/${e}`,sr=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1};var lr=0,pr=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Fo=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return ir(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return pr(e)?e:null}catch{return null}}async gravar(e){if(!sr(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return lr+=1,await rn(this.area,lr%25===0),!0}};async function rn(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(Ho)).length<=200)return 0;let r=await tr(o,Ho),t=Object.entries(r).filter(([,i])=>pr(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var nn=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",Vo=class{sigiloso;agora;esperar;repo;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.repo=new Fo(e,r,t),this.agora=a.agora??Date.now,this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}definir(e,r){this.fatias.set(e,r);for(let t of[...this.ouvintes])try{t(e)}catch{}if(r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:nn(i),em:this.agora()})}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var ge=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],sn={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},cn=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function dr(o){let e=new Set(o?.length?o:cn),r=new Set(["descricao"]);for(let[t,a]of Object.entries(sn))e.has(a)&&r.add(t);return r}var ur=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),ve={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};function d(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var W={fill:"currentColor",stroke:"none"},mr="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",fr={estrela:[["path",{d:mr}]],estrelaCheia:[["path",{d:mr,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...W}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...W}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...W}],["circle",{cx:"12",cy:"12",r:"1.4",...W}],["circle",{cx:"19",cy:"12",r:"1.4",...W}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...W}],["circle",{cx:"15",cy:"6",r:"1.3",...W}],["circle",{cx:"9",cy:"12",r:"1.3",...W}],["circle",{cx:"15",cy:"12",r:"1.3",...W}],["circle",{cx:"9",cy:"18",r:"1.3",...W}],["circle",{cx:"15",cy:"18",r:"1.3",...W}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},qi=Object.keys(fr);function P(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of fr[o]){let c=r.createElementNS(t,i);for(let[p,u]of Object.entries(s))c.setAttribute(p,u);a.append(c)}return a}var ln={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function wo(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=ln[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function he(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=wo(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function C(o){return typeof o=="string"?G(o):o==null?"":String(o)}var pn=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Y(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(pn))e.add(r[0]);return[...e]}function q(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function L(o,e,r={}){let t=Array.isArray(o)?o:Y(o);for(let a of t){let n=q(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function gr(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=Y(r).filter(i=>q(i).get("acao")===e),n=(t.length?t:Y(o.html).filter(i=>q(i).get("acao")===e)).sort((i,s)=>[...q(i).keys()].length-[...q(s).keys()].length)[0];if(!n)throw new g("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function vr(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=he(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=wo(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function hr(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=he(o,r.index+r[0].length);e.push({tipo:C(t[0]),idPai:C(t[2]),href:C(t[3]),titulo:C(t[5]),icone:C(t[6]),extra:t[8]==null?void 0:C(t[8])})}return e}function br(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function xr(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>C(e[1])))]}function Ar(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var dn=/\s*\(\d{5,}\)\s*$/;function Er(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=C(r.args[1]),a=C(r.args[5]),n=C(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(m=>m.tipo==="ASSINATURA"&&m.idPai===t),{nivel:c,hipotese:p}=br(e,t),u=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:C(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(dn,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:u,nivel:c,hipotese:p,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(m=>m.tipo==="UNIDADE_GERADORA"&&m.idPai===t)?.extra,link:C(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:Y(r.props.acoes??""),botoes:xr(r.props.acoes??""),funcoes:Ar(r.props.acoes??"")}})}function yr(o){return Er(vr(o.html),hr(o.html))}function be(o){let e=o.html,r=vr(e),t=hr(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new g("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=C(a.args[1]),i=br(t,n),s=Er(r,t);return{idProcedimento:n,protocolo:C(a.args[5])||C(a.args[15]),tipo:C(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:Y(a.props.acoes??""),botoesProcesso:xr(a.props.acoes??""),funcoesProcesso:Ar(a.props.acoes??""),linkProcesso:C(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Y(e),pagina:o}}async function Pr(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new g("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=L(t.html,"procedimento_visualizar")&&Y(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return be(t)}function H(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?L(t.acoes,e):null}return L(o.acoesProcesso,e)??L(o.links,e,{id_procedimento:o.idProcedimento})}function mo(o){return d("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},P(o.icone,14))}function Dr(o){let e=d("div",{class:"spro-p-acoes"}),r=d("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=P("chevron",14),a=d("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=d("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},d("header",{},d("span",{class:"spro-p-icone","aria-hidden":"true"},P(o.icone,15)),d("h3",{},o.titulo),e,a),r),i=s=>{n.toggleAttribute("data-recolhido",!s),a.setAttribute("aria-expanded",String(s)),r.hidden=!s};return i(o.aberto),a.addEventListener("click",()=>{let s=n.hasAttribute("data-recolhido");i(s),o.aoAlternar(s)}),{el:n,definirAberto:i,atualizar(s,c){n.setAttribute("data-estado",s),e.replaceChildren(...(c.acoes??[]).map(mo)),r.replaceChildren(...c.corpo.filter(p=>p!=null&&p!==!1))}}}function wr(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var Sr="spro-processo-estilo",xe="";function Ir(o){xe=o}function fo(o){if(!xe||o.getElementById(Sr))return;let e=o.createElement("style");e.id=Sr,e.textContent=xe,(o.head??o.documentElement).append(e)}function eo(o){let e=wr(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Uo(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}var un="configViewFlashPanelArvorePro",Or="optionsPro";function Ae(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function Mr(o){let e=Ae(o,un);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function jo(o){let e=Ae(o,Or);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function Cr(o){return jo(o).optionsFlashMenu_panelinfo!=="disabled"}function Lr(o,e){return jo(o)[`panelDadosArvorePro_${e}`]!=="hide"}function _r(o,e,r){try{let t=jo(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Or,JSON.stringify(t))}catch{}}function Bo(o,e){let r=Ae(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function So(o,e){return jo(o)[`optionsFlashMenu_${e}`]!=="disabled"}var mn=/[\u0300-\u036f]/g,Ee=o=>o.normalize("NFD").replace(mn,""),ye=o=>Ee(o).toLowerCase().replace(/\s+/g," ").trim(),Io=o=>String(o).padStart(2,"0"),Go=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,kr=/(\d{1,2}):(\d{2})/;function Oo(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=Ee(e),t=r.length===e.length?r:e,a=Go.exec(t);if(!a)return{prazo:null,texto:e};let n=kr.exec(t.slice(a.index+a[0].length))??kr.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${Io(Number(a[2]))}-${Io(Number(a[1]))}`,c=n?`${Io(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),u=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:u}}function Tr(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var fn=864e5;function go(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(s.getFullYear(),s.getMonth(),s.getDate()),u=Math.round((p.getTime()-c.getTime())/fn);return u===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:u>0?{rotulo:u===1?"amanh\xE3":`em ${u} dias`,nivel:u<=2?"atencao":"ok"}:{rotulo:u===-1?"ontem":`h\xE1 ${-u} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Wo(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function Rr(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var Mo=500,gn=/^\s*\[( |x|X)\]\s?/;function Xo(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=gn.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function $r(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function zr(o,e){let r=Xo(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",$r(r))}function qr(o,e,r){let t=Xo(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return $r(t)}function vn(o){let e=Go.exec(Ee(o));return e?`${Io(Number(e[1]))}/${Io(Number(e[2]))}/${e[3]}`:null}function Hr(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return Go.test(o)?o.replace(Go,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function Jo(o){let e=vn(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function B(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function Fr(o,e){return B(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function Nr(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function Vr(o,e,r){return[{unidade:e,observacao:Nr(o)},...r.map(a=>({unidade:a.unidade,observacao:Nr(a.observacao)}))].filter(a=>a.observacao)}function Ur(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function jr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function Br(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function Gr(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function Wr(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function hn(o=2){return d("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>d("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function Xr(o,e){return d("div",{class:"spro-p-erro",role:"alert"},d("span",{class:"spro-p-erro-texto"},P("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),d("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function ao(o,...e){return d("div",{class:"spro-p-vazio"},o,...e)}function ro(o){return d("div",{class:"spro-p-nota"},o)}function K(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[Xr(o.erro??"",e)]:[hn(t)];let a=r(o.dado);return o.estado==="erro"?[...a,Xr(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}function bn(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Jr(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function Kr(o,e,r,t,a){let n=o.body??o.documentElement;for(let m of[n,...o.querySelectorAll("dialog")])for(let l of[...m.children])l.classList.contains("spro-aviso")&&l.remove();let i=d("div",{class:"spro-aviso",role:"status"},P("check",16),d("span",{},e),...bn(r).map(m=>d("button",{type:"button",onclick:()=>{i.remove(),m.fazer()}},m.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let m=Jr(o);m.append(i),s(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!u||!m.contains(i))){if(a&&Jr(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){u=!1,i.remove();return}p()}},{once:!0})},u=!0;return p(),setTimeout(()=>{u=!1,i.remove()},t),i}async function Pe(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function U(o,e,r=4e3){try{Kr(o.topo,e,void 0,r)}catch{}}async function Zr(o,e){let r=await Pe(o.doc,e);U(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var Yr={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},Qr={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function no(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function ot(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":no(o)}function N(o,e){fo(o.topo);let r=d("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});eo(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=d("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},P("fechar",16)),n=d("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=d("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(d("header",{},d("span",{class:"spro-dialogo-icone","aria-hidden":"true"},P(e.icone,18)),d("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let u of p)u.disabled=!0;r.setAttribute("aria-busy","true");try{let u=await c();return t=!1,r.close(),u&&U(o,u.aplicado?u.resumo:u.resumo||"Nada a alterar."),!0}catch(u){t=!1,a.disabled=!1;for(let m of p)m.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(no(u)),!1}}}}function Ko(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function X(o,e,r){return d("label",{class:"spro-p-campo"},d("span",{class:"spro-p-campo-rotulo"},o),e,r?d("span",{class:"spro-p-campo-dica"},r):null)}function T(...o){return d("div",{class:"spro-dialogo-rodape"},...o)}function R(o,e){return d("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function io(o,e,r){let t=d("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:d("label",{class:"spro-p-opcao"},t,d("span",{},o)),input:t}}function so(o,e,r,t){let a=d("select",{class:"spro-campo spro-p-lista",size:String(Math.min(8,Math.max(4,o.length))),"aria-label":r}),n=e??"",i=p=>{let u=ye(p),m=u?o.filter(l=>ye(l.texto).includes(u)):o;a.replaceChildren(...m.map(l=>{let f=d("option",{value:l.valor},l.texto);return f.selected=l.valor===n,f}))};a.addEventListener("change",()=>{n=a.value,t?.(n)});let s=d("input",{type:"search",class:"spro-campo",placeholder:"Buscar\u2026","aria-label":`Buscar em ${r}`});return s.addEventListener("input",()=>i(s.value)),i(""),{el:d("div",{class:"spro-p-busca"},o.length>8?s:null,a),valor:()=>n,definir(p){n=p,i(s.value)}}}function vo(o,e,r){return new Promise(t=>{let a=!1,n=d("button",{type:"button",class:"spro-botao primario perigo"},r),i=d("button",{type:"button",class:"spro-botao"},"Cancelar"),s=N(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[d("p",{class:"spro-p-pergunta"},e),T(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}function et(o,e,r){let t=d("div",{class:"spro-p-modal-lugar"},d("p",{class:"spro-p-nota"},"Carregando os grupos\u2026")),a=N(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});o.op.opcoesAcompanhamento().then(({grupos:n,atual:i})=>{a.el.isConnected&&xn(o,a,t,n,i,e,r)}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar os grupos."),t.replaceChildren()})}function xn(o,e,r,t,a,n,i){let s=d("select",{class:"spro-campo","aria-label":"Grupo"},d("option",{value:""},"(sem grupo)"),...t.map(v=>d("option",{value:v.valor},v.texto)));s.value=a??"";let c=d("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});c.value=n?n.observacao??"":i.slice(0,450);let p=o.reaberturaProgramada||!!n?.reabertura,u=io("Reabertura programada",!!n?.reabertura,v=>m.hidden=!v),m=d("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!n?.reabertura});m.value=n?.reabertura?jr(n.reabertura):"";let l=R("Salvar",()=>void f()),f=async()=>{if(p&&u.input.checked&&!m.value){e.erro("Informe a data da reabertura.");return}let v=Br(c.value,p&&u.input.checked?Ur(m.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.value,observacao:v}),[l])&&o.recarregar("acompanhamento")};Ko(r,p?u.el:null,p?d("div",{class:"spro-p-grade"},m):null,X("Grupo",s),X("Observa\xE7\xE3o",c),T(l))}var _=(o,e)=>o.loja.ler(e);function $(o,e,r="",...t){return d("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void Zr(o,e)},e,...t)}function ho(o,e){return ro(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var F=(...o)=>d("div",{class:"spro-p-linha"},...o);function An(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?go({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return d("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},P("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var rt={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=_(o,"acompanhamento"),r=_(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>et(o,a,t)}]:[],corpo:K(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[ho(i.motivo,"O acompanhamento especial")];if(!i.valor)return[ao("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:p}=i.valor;return[F($(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),p?F(An(p,o.agora())):null]})}}}};function Zo(o,e){let r=d("textarea",{class:"spro-campo spro-p-anotacao",rows:"7",maxlength:String(Mo),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});r.value=e?.texto??"";let t=d("span",{class:"spro-p-contador","aria-live":"polite"}),a=()=>{let f=Mo-r.value.length;t.textContent=f<=0?"Limite de caracteres atingido.":`${f} caracteres restantes`};r.addEventListener("input",a),a();let n=f=>r.value.slice(0,f).split(`
`).length-1,i=d("button",{type:"button",class:"spro-botao pequeno","aria-label":"Transformar as linhas selecionadas em checklist"},P("check",14),"Checklist");i.addEventListener("click",()=>{r.value=qr(r.value,n(r.selectionStart??0),n(r.selectionEnd??0)).slice(0,Mo),a(),r.focus()});let s=d("input",{type:"date",class:"spro-campo spro-p-data","aria-label":"Data para inserir na anota\xE7\xE3o"});s.value=Jo(r.value)??"",s.addEventListener("change",()=>{s.value&&(r.value=Hr(r.value,s.value).slice(0,Mo),a())});let c=io("Prioridade",e?.prioridade??!1,()=>{}),p=R("Salvar",()=>void l(r.value,c.input.checked)),u=d("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover anota\xE7\xE3o"),m=N(o,{titulo:e?"Editar anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",icone:"nota",conteudo:[r,t,d("div",{class:"spro-p-ferramentas"},i,d("label",{class:"spro-p-opcao"},P("calendario",14),d("span",{},"Data"),s),c.el),T(e?u:null,p)]}),l=async(f,v)=>{await m.gravar(()=>o.op.anotar({texto:f.trim(),prioridade:v}),[p,u])&&o.recarregar("anotacao")};u.addEventListener("click",()=>{vo(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(f=>{f&&l("",!1)})})}async function De(o,e){try{await e()}catch(r){U(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var tt={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=_(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null;return{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void De(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>Zo(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void vo(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(a=>{a&&De(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>Zo(o,null)}]:[],corpo:K(e,()=>o.recarregar("anotacao"),a=>{if(!a.disponivel)return[ho(a.motivo,"As anota\xE7\xF5es")];if(!a.valor)return[d("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",d("button",{type:"button",class:"spro-p-link",onclick:()=>Zo(o,null)},"Adicionar anota\xE7\xE3o"))];let{texto:n,prioridade:i}=a.valor,s=Jo(n),c=s?go({data:s,hora:"23:59",vencimento:!0},o.agora()):null,p=Xo(n).map((u,m)=>u.marca===null?d("div",{class:"spro-p-nota-linha"},u.texto||" "):d("label",{class:`spro-p-nota-linha item${u.marca==="feito"?" feito":""}`},d("input",{type:"checkbox",checked:u.marca==="feito",onchange:()=>void De(o,()=>o.op.alternarItemDaAnotacao(m))}),d("span",{},u.texto)));return[d("div",{class:`spro-p-post-it${i?" prioridade":""}`},i?d("span",{class:"spro-p-chip vencido"},P("alerta",11),"prioridade"):null,...p,s&&c?d("span",{class:`spro-p-chip ${c.nivel}`},P("calendario",11),`${Wo({data:s,hora:"23:59",vencimento:!0})} \xB7 ${c.rotulo}`):null)]})}}}};function at(o,e,r){let t=d("div",{class:"spro-p-modal-lugar"},d("p",{class:"spro-p-nota"},"Carregando a lista de usu\xE1rios\u2026")),a=N(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[t]});o.op.opcoesAtribuicao().then(({opcoes:n,atual:i})=>{if(!a.el.isConnected)return;let s=e.usuario?n.find(l=>l.texto.split(" - ")[0]?.trim().toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0,c=so(n,i??s,"usu\xE1rios da unidade"),p=R("Salvar",()=>void m(c.valor(),p,u)),u=d("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),m=async(l,...f)=>{if(l===""){a.erro("Escolha um usu\xE1rio.");return}let v=l===null?void 0:n.find(D=>D.valor===l);if(await a.gravar(()=>o.op.atribuir(l),f)){let[D="",...O]=(v?.texto??"").split(" - ");r(l===null?{usuario:null}:{usuario:D.trim(),nome:O.join(" - ").trim()})}};u.addEventListener("click",()=>void m(null,p,u)),t.replaceChildren(d("p",{class:"spro-p-nota"},"Atribuir para:"),c.el,T(e.usuario?u:null,p))}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar a lista de usu\xE1rios."),t.replaceChildren()})}var nt={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"pessoa",desenhar(o){let e=_(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:K(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return F($(o,a.texto),n?d("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?mo({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>at(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(u=>u===a?{...u,usuario:s.usuario,nomeUsuario:s.nome,texto:Gr(u.texto,s.usuario)}:u);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:s.usuario}})})}):null)}):[ro(t.texto||"Processo sem andamento aberto.")],1)}}}};var it=(o,e)=>o>0&&e-o<18e5;var st={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"camadas",desenhar(o){let r=_(o,"blocoInterno").dado;if(r&&it(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[F(r.descricao?$(o,r.descricao):ro("Nenhum bloco localizado."))]}};let t=d("span",{class:"spro-p-nota",hidden:!0},"A coleta do hist\xF3rico ainda n\xE3o est\xE1 dispon\xEDvel nesta vers\xE3o."),a=d("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{o.aoPedirHistorico().then(n=>{t.hidden=n})}),{estado:"pronto",desenho:{corpo:[d("div",{class:"spro-p-linha"},a,t)]}}}};async function we(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var Se=o=>d("div",{class:"spro-p-modal-lugar"},d("p",{class:"spro-p-nota"},o));function ct(o,e){let r=d("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=R("Salvar",()=>void n()),a=N(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[X("Especifica\xE7\xE3o",r),T(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function lt(o,e){let r=Se("Carregando os tipos de processo\u2026"),t=N(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[r]});we(o,t,r,a=>{let n=a.tipoAtual??a.tipos.find(c=>c.texto===e)?.valor,i=so(a.tipos,n,"tipos de processo"),s=R("Salvar",async()=>{if(!i.valor()){t.erro("Escolha um tipo.");return}await t.gravar(()=>o.op.alterarProcesso({tipo:i.valor()}),[s])&&o.recarregar("dadosProcesso")});r.replaceChildren(X("Tipo de processo",i.el),T(s))})}function pt(o){let e=Se("Carregando o formul\xE1rio do processo\u2026"),r=N(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});we(o,r,e,async t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(l=>d("button",{type:"button",role:"radio","aria-checked":String(l===a),"data-nivel":l},l==="publico"?"P\xFAblico":"Restrito")),i=d("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=d("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"}),c=null,p=[],u=async()=>{if(!c){s.replaceChildren(d("p",{class:"spro-p-nota"},"Carregando as hip\xF3teses legais\u2026"));try{p=await t.hipoteses("1"),c=so(p,t.hipoteseAtual,"hip\xF3teses legais"),s.replaceChildren(X("Hip\xF3tese legal",c.el))}catch(l){s.replaceChildren(),r.erro(l instanceof Error?l.message:"N\xE3o foi poss\xEDvel carregar as hip\xF3teses legais.")}}};for(let l of n)l.addEventListener("click",()=>{a=l.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let f of n)f.setAttribute("aria-checked",String(f===l));s.hidden=a!=="restrito",a==="restrito"&&u()});let m=R("Salvar",async()=>{if(a==="restrito"&&!c?.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:c?.valor()??""}:{nivel:a}),[m])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,s,T(m)),a==="restrito"&&await u()})}function dt(o,e){let r=d("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=R("Salvar",()=>void n()),a=N(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[X("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),T(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function ut(o){let e=Se("Carregando os interessados\u2026"),r=N(o,{titulo:"Interessados do processo",icone:"pessoa",conteudo:[e]});we(o,r,e,t=>{let a=new Map(t.interessados.map(s=>[s.id,s])),n=t.interessados.map(s=>{let c=d("button",{type:"button",class:"spro-p-acao perigo","aria-pressed":"false","aria-label":`Retirar ${s.texto}`},"Retirar"),p=d("li",{class:"spro-p-linha-modal"},d("span",{class:"spro-p-texto-modal"},s.texto),c);return c.addEventListener("click",()=>{let u=a.has(s.id);u?a.delete(s.id):a.set(s.id,s),p.toggleAttribute("data-retirado",u),c.textContent=u?"Manter":"Retirar",c.setAttribute("aria-pressed",String(u)),i.disabled=a.size===t.interessados.length}),p}),i=R("Salvar",async()=>{await r.gravar(()=>o.op.alterarProcesso({interessados:t.interessados.filter(c=>a.has(c.id))}),[i])&&o.recarregar("dadosProcesso")});i.disabled=!0,e.replaceChildren(n.length?d("ul",{class:"spro-p-lista-modal"},...n):d("p",{class:"spro-p-nota"},"O processo n\xE3o tem interessados."),d("p",{class:"spro-p-nota"},"Para incluir um interessado, use Consultar/Alterar Processo no SEI."),T(i))})}var co=o=>{let e=_(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},Co=o=>!o.sigiloso&&!!co(o)?.editavel;async function Yo(o,e){let r=co(o);if(!r)return;let t=!B(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:Fr(r.especificacao,e).slice(0,100)});U(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){U(o,no(a),7e3)}o.recarregar("dadosProcesso")}function Qo(o,e,r=2){let t=_(o,"dadosProcesso");return K(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[ho(a.motivo,"Este dado")],r)}var mt={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"documento",desenhar(o){let e=_(o,"dadosProcesso"),r=co(o),t=[];return r&&Co(o)&&(t.push({icone:"alerta",rotulo:B(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:B(r.especificacao,"URGENTE"),aoClicar:()=>void Yo(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:B(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:B(r.especificacao,"TRANCADO"),aoClicar:()=>void Yo(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>ct(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:Qo(o,a=>[F($(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${B(a.valor.especificacao,"URGENTE")?"urgente":""} ${B(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},ft={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"pasta",desenhar(o){let e=co(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&Co(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>lt(o,r)}]:[],corpo:[F($(o,r||"(n\xE3o informado)"))]}}}},gt={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"cadeado",desenhar(o){let e=co(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":Qr.publico;return{estado:"pronto",desenho:{acoes:e&&Co(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>pt(o)}]:[],corpo:[F(d("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},P(Yr[r],13)),$(o,a))]}}}},vt={tipo:"interessados",titulo:"Interessados",icone:"pessoa",desenhar(o){return{estado:_(o,"dadosProcesso").estado,desenho:{acoes:co(o)&&Co(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>ut(o)}]:[],corpo:Qo(o,r=>r.valor.interessados.length?r.valor.interessados.map(t=>d("div",{class:"spro-p-linha interessado"},...Wr(t).map(a=>$(o,a)))):[ao("Sem interessados.")])}}}},ht={tipo:"assuntos",titulo:"Assuntos",icone:"etiqueta",desenhar(o){return{estado:_(o,"dadosProcesso").estado,desenho:{corpo:Qo(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>F($(o,t))):[ao("Sem assuntos.")])}}}},bt={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"nota",desenhar(o){let e=_(o,"dadosProcesso"),r=co(o);return{estado:e.estado,desenho:{acoes:r&&Co(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>dt(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:Qo(o,t=>{let a=Vr(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>F($(o,`${n.unidade}: ${n.observacao}`))):[ro("Sem observa\xE7\xF5es.")]})}}}};var En=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function Ie(o,e){let r=d("div",{class:"spro-p-modal-lugar"},d("p",{class:"spro-p-nota"},"Carregando os marcadores\u2026")),t=N(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});o.op.opcoesMarcador().then(a=>{t.el.isConnected&&yn(o,t,r,a,e)}).catch(a=>{t.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar os marcadores."),r.replaceChildren()})}function yn(o,e,r,t,a){let n=a?Oo(a.texto):{prazo:null,texto:""},i=so(t,a?t.find(h=>h.texto===a.nome)?.valor:void 0,"marcadores"),s=io("Controlar prazo",!!n.prazo,h=>m.hidden=!h),c=io("Controlar vencimento (\u201CAt\xE9\u201D)",!!n.prazo?.vencimento,()=>{}),p=d("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=n.prazo?.data??En(o.agora());let u=d("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});u.value=n.prazo?.hora??"23:59";let m=d("div",{class:"spro-p-grade",hidden:!n.prazo},c.el,d("div",{class:"spro-p-par"},p,u)),l=d("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});l.value=n.texto;let f=R("Salvar",()=>void v()),v=async()=>{let h=t.find(x=>x.valor===i.valor());if(!h){e.erro("Escolha um marcador.");return}if(s.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let D=Tr({prazo:s.input.checked?{data:p.value,hora:u.value||"23:59",vencimento:c.input.checked}:null,texto:l.value}),O=await e.gravar(async()=>(a&&h.texto!==a.nome&&await o.op.desmarcar(a.nome),o.op.marcar({marcador:h.texto,texto:D})),[f]);return o.recarregar("marcador"),O};Ko(r,X("Marcador",i.el),a?d("p",{class:"spro-p-nota"},P("etiqueta",12),` Atual: ${a.nome}. Escolher outro troca o marcador.`):null,s.el,m,X("Texto",l),T(f))}function Pn(o,e){let{prazo:r}=Oo(e);if(!r)return null;let t=go(r,o.agora());return d("span",{class:`spro-p-chip ${t.nivel}`},P("relogio",11),`${r.vencimento?"at\xE9 ":""}${Wo(r)} \xB7 ${t.rotulo}`)}async function Dn(o,e){if(await vo(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);U(o,r.resumo)}catch(r){U(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function wn(o,e,r){let{texto:t}=Oo(e.texto),a=e.icone?d("img",{class:"spro-p-marcador-icone",src:e.icone,alt:""}):P("etiqueta",14);return F(d("div",{class:"spro-p-marcador"},$(o,e.nome,"forte",a),Pn(o,e.texto),t?$(o,t,"suave"):null),r&&e.id?d("span",{class:"spro-p-acoes-linha"},mo({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>Ie(o,e)}),mo({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void Dn(o,e)})):null)}var xt={tipo:"marcador",titulo:"Marcador",icone:"etiqueta",desenhar(o){let e=_(o,"marcador"),r=Rr(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>Ie(o)}]:[],corpo:[...K(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>wn(o,a,t.editavel)):[ao("Sem marcador.")]),r?d("div",{class:"spro-p-prazo-nativo"},d("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},P("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var At=[tt,nt,st,xt,rt,mt,ft,gt,vt,ht,bt];var Sn=1e4;function Et(o){if(!o.getElementById("frmArvore"))return null;try{return be(to(o))}catch{return null}}function Pt(o,e=Sn){return new Promise(r=>{let t=Et(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=l=>{i||(i=!0,p?.disconnect(),clearTimeout(m),clearInterval(u),r(l))},c=()=>{let l=Et(o);l&&s(l)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let u=setInterval(c,250),m=setTimeout(()=>s(null),e)})}var Dt="data-spro-processo-raiz";function In(o){for(let e of o.querySelectorAll(`[${Dt}], [data-spro-slot="atividades"]`))e.remove()}function wt(o){return At.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&ur.has(e.tipo)))}function St(o){let e=new Set;for(let r of wt(o))for(let t of ve[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function yt(o){let e=o.doc;fo(e),In(e);let r=e.getElementById("frmArvore")??e.body,t=eo(e),a=(x="")=>d("div",{class:`spro-p-raiz ${x}`.trim(),[Dt]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=d("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let p=e.getElementById("divRelacionados");p?p.before(s):i.after(s),r.append(n);let u=new Map,m=wt(o),l=x=>ge.indexOf(x);for(let x of m){let S=Dr({tipo:x.tipo,titulo:x.titulo,icone:x.icone,aberto:Lr(o.armazenamento,x.tipo),aoAlternar:E=>_r(o.armazenamento,x.tipo,E)});u.set(x.tipo,{def:x,casca:S})}for(let x of[...ge].sort((S,E)=>l(S)-l(E))){let S=u.get(x);S&&n.append(S.casca.el)}let f=u.get("anotacoes");f&&i.append(f.casca.el);let v=x=>{let S=u.get(x);if(!S)return;let E;try{E=S.def.desenhar(o)}catch(k){console.warn(`[SEI Pro] painel ${x}:`,k),E=null}S.casca.el.hidden=E===null,E&&S.casca.atualizar(E.estado,E.desenho)},h=x=>{if(x)v(x);else for(let S of u.keys())v(S)},D=o.loja.aoMudar(x=>{for(let[S,E]of u)ve[E.def.tipo].includes(x)&&v(S)});h();let O=Uo(e,()=>{let x=eo(e);for(let S of[n,i])x?S.setAttribute("data-tema","escuro"):S.removeAttribute("data-tema")});return{raiz:n,redesenhar:h,desmontar(){D(),O(),n.remove(),i.remove(),s.remove()}}}function It(o,e,r={}){let t=yt(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=yt(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}function z(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var bo={publico:"0",restrito:"1"},xo={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function Ao(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(G(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Lt="\xA5",Oe="\xB1";function Ot(o){return o.map(e=>`${e.id}${Oe}${e.texto}`).join(Lt)}function On(o){return o?o.split(Lt).map(e=>{let[r,...t]=e.split(Oe);return{id:r,texto:t.join(Oe)}}):[]}function Mt(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var I=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Mn(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,A(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Ct(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??A(t),texto:A(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=V(r),n=t.find(i=>i.valor===r)??t.find(i=>V(i.texto)===a)??Me(t.filter(i=>V(i.texto).includes(a)));if(!n)throw new g("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?On(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Ot(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new g("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new g("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new g("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${A(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??Me([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??A(r)??e]:[e,e]}hiddenDaLupa(e){let r=Mt(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Mt(this.pagina.html)){let t=this.elemento.querySelector(`select#${Ct(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:A(n)}));(this.valor(r)??"")||this.definir({[r]:Ot(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function Mn(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(p=>p.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??A(p)})}}return e}function V(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Eo(o,e,r){let t=V(e),a=o.find(n=>n.id===e)??o.find(n=>V(n.texto)===t)??Me(o.filter(n=>V(n.texto).includes(t)));if(!a)throw new g("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function Me(o){return o.length===1?o[0]:void 0}function Ct(o){return o.replace(/([^\w-])/g,"\\$1")}function Cn(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function Ln(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Lo(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=Cn(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:Ln(o),sigla:A(r)||A(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var _n=3e4,oe=class{constructor(e,r=null,t){this.paginaViva=r;this.http=qo(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new g("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Lo(this.base())}linkMenu(e){return gr(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new g("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=I.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=q(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new g("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let u=q(G(c)).get("id_procedimento")??"",m=s.get("id_protocolo")??"",l={idProcedimento:u,idDocumento:m&&m!==u?m:void 0,linkArvore:G(c)};return this.localizados.set(t,l),l}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<_n)return a.arvore;let n=await Pr(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:G(i[1]),texto:G(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=uo(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function yo(o,e,r){let t=H(o,e);if(!t)throw new g("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function _o(o,e,r){let t=await I.abrir(o,yo(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var _t=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function kt(o,e,r){let t=_t.exec(r),a=r.replace(_t,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function kn(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(A(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>A(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return kt(s||void 0,A(i[t]),A(i[a]))}async function Nt(o,e,r){let t=await o.obter(yo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=I.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return kt(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=kn(t);if(a===void 0)throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",A(t.doc.querySelector("title")));return a}function Nn(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?wo(o.pagina.html,e.index+e[0].length-1)[0]:""}function Tn(o){if(!o.trim())return[];let e=uo(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:A(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function Tt(o,e){let r=Tn(Nn(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??Lo(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!H(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}function ee(o){let e=t=>!!H(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function Rt(o,e,r){let t=await o.obter(yo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",A(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:A(s[1]),texto:A(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:A(s[3]),data:A(s[4])}})}async function $t(o,e,r){let a=(await I.abrir(o,yo(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function zt(o,e,r){let t=await o.obter(yo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=L(t.html,"andamento_marcador_cadastrar");if(!i)throw new g("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:A(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function qt(o,e,r){let t=await o.obter(yo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>L(t.html,p)).find(Boolean);if(!c)throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=I.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function Ht(o,e,r){let t=H(e,"procedimento_alterar")??H(e,"procedimento_consultar");if(!t)throw new g("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await I.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),async hipoteses(c,p){return(await Ao(o,a,c,p)).map(u=>({valor:u.id,texto:u.texto}))}}}async function Vt(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function Ut(o,e,r){let t=H(o,e);if(!t)throw new g("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var jt=o=>e=>q(e.url).get("acao")!==o;async function Rn(o,e,r,t){let a=await o.http.obter(Ut(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return I.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>L(a.html,i)).find(Boolean);if(!n)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return I.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Ce(o,e,r,t){let a=await Vt(o,e,t.sinal),n=await Rn(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??jt(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function re(o,e,r,t){return Ce(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=z("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...z("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Bt(o,e,r,t){return Ce(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=V(r),s=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=s.find(p=>p.valor===r)??s.find(p=>V(p.texto.split(" - ")[0])===i)??s.find(p=>V(p.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(p=>V(p.texto).includes(i)).length===1?s.find(p=>V(p.texto).includes(i)):void 0);if(!c)throw new g("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),z("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function Gt(o,e,r,t){return Ce(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...z("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...z("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function $n(o,e,r){let t=Ut(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function Ft(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:A(t[1]),texto:A(t[2]),usuario:A(t[3]),data:A(t[4])}})}async function Le(o,e,r,t){let a=await Vt(o,e,t.sinal),n=await $n(o,a,t.sinal),i=Ft(n),s=V(r.marcador),c=i.find(l=>V(l.marcador)===s),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let l=L(n.html,"andamento_marcador_remover");if(!l)throw new g("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let f=I.de(n,"#frmGerenciarMarcador",o.http);f.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let v=await o.http.enviar(l,f.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(Ft(v).some(h=>h.id===c.id))throw new g("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let u;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))u=I.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let l=L(n.html,"andamento_marcador_cadastrar");if(!l)throw new g("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");u=await I.abrir(o.http,l,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let m=u.escolher("selMarcador",r.marcador);return u.definir({hdnIdMarcador:m.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?z(`Texto do marcador ${m.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${m.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await u.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:jt("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${m.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${m.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function te(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function Wt(o,e,r){let t=H(e,"procedimento_alterar"),a=t??H(e,"procedimento_consultar");if(!a)throw new g("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await I.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function ae(o){return o.map(e=>e.texto).filter(Boolean)}var zn={0:"publico",1:"restrito",2:"sigiloso"};async function Xt(o,e,r){let{form:t,editavel:a}=await Wt(o,e,r),n=zn[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:te(t,"selHipoteseLegal").trim()||e.hipotese;return{nivel:n,...i?{hipotese:i}:{},tipo:te(t,"selTipoProcedimento")||e.tipo,especificacao:t.valor("txtDescricao")??"",assuntos:ae(t.itensLupa("selAssuntos")),interessados:ae(t.itensLupa("selInteressadosProcedimento")),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:qn(t),editavel:a}}function qn(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=A(t[0]);a&&e.push({unidade:a,observacao:A(t[1])})}return e}async function Jt(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await Wt(o.http,a,{sinal:t.sinal});if(!i)throw new g("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...z("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=te(n,"selTipoProcedimento"),u=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:u.valor}),s.push(...z("Tipo",p,u.texto))}if(r.nivel!==void 0){let p=xo[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:bo[r.nivel]}),s.push(...z("N\xEDvel de acesso",p,xo[bo[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=te(n,"selHipoteseLegal"),u=n.valor("rdoNivelAcesso")||bo.restrito,m=Eo(await Ao(o,n,u,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:m.id}),s.push(...z("Hip\xF3tese legal",p,m.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new g("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");r.observacoes!==void 0&&(s.push(...z("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0&&(s.push(...z("Interessados",ae(n.itensLupa("selInteressadosProcedimento")).join("; "),ae(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados));let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>q(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function Kt(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>Bt(o,t,n,i)),anotar:n=>a(i=>re(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await _o(o.http,e);return re(o,t,{texto:zr(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await _o(o.http,e);return i?re(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>Gt(o,t,n,i)),marcar:n=>a(i=>Le(o,t,n,i)),desmarcar:n=>a(i=>Le(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>Jt(o,t,n,i)),opcoesAtribuicao:()=>$t(o.http,e),opcoesMarcador:()=>zt(o.http,e),opcoesAcompanhamento:()=>qt(o.http,e),formularioDoProcesso:()=>Ht(o,e)}}var ko=class extends oe{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function Zt(o,e){return`${o}|${e}`}function Yt(o){let e=Lo(to(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function Qt(o){let e=new ko(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>to(o.topo));return{doc:o.doc,topo:o.topo,arv:o.arv,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:ee(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??Kt(e,o.arv,o.loja),recarregar:o.recarregar,aoPedirHistorico:o.aoPedirHistorico??(async()=>!1)}}function Hn(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function Fn(o){return async()=>{try{return await o()}catch(e){throw new Error(ot(e))}}}function oa(o){let e=Vn(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,Fn(t)]))}function Vn(o){let e=ee(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await Xt(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await _o(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:Hn(o.arv),editavel:!1}:{itens:await Rt(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await Nt(o.http,o.arv)}:t,atribuicao:async()=>({...Tt(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function _e(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function ea(o){o.documentElement?.setAttribute(ar,"1")}function ra(o){o.documentElement?.setAttribute(nr,"1")}function ta(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var ne=["Copiar","Abrir","Acoes"],ke={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},j={tipo:"local"},w=(...o)=>({tipo:"acao",acoes:o}),Q=(...o)=>({tipo:"funcao",funcoes:o}),ie=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:j,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:j,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:j,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:j,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:j,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:j,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:j,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:w("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:w("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:w("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:w("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:w("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:w("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:w("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Q("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Q("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Q("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:w("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Q("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Q("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:w("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:w("md_pet_intimacao_cadastrar")}],aa=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:j},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:j},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:j},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:j},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:j},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:j},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:w("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:w("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:w("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:w("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:w("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:w("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:w("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:w("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:w("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:w("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:w("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:w("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:w("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:w("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:w("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:w("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:w("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:w("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Q("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Q("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Q("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Q("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:w("arvore_ordenar")}],se="Ativar menu ao clicar",na=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],ia=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],sa=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],Un={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},jn=o=>Un[o]??o;function ca(o,e){let r=jn(e);return o.find(t=>t.nome===r)}var $l=ie.filter(o=>o.modo).map(o=>o.nome);function la(o){return o.includes(" ")?o.split(" ").pop()??"":""}function Po(o){let e=la(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function pa(o){let e=o.trim(),r=la(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function da(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var Bn=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),Ne=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Te=(o,e)=>`<a href="${Bn(o)}" target="_blank">${Ne(e)}</a>`,ua=o=>({texto:Po(o.rotulo)});function ma(o){let e=Po(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${pa(o.rotulo)} (${da(o.citacaoOpcao)}${e})`}}var fa=o=>({texto:o.linkDocumento});function ga(o){let e=Po(o.rotulo);return{texto:e,html:Te(o.linkDocumento,e)}}function va(o){let e=Po(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:Te(o.linkDocumento,e)};let r=pa(o.rotulo),t=da(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${Ne(r)} (${Ne(t)}${Te(o.linkDocumento,e)})`}}var ha=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function Re(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function ba(o){return ne.flatMap(e=>o.filter(r=>r.grupo===e))}function $e(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===se)continue;let i=ca(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var xa=(o,e)=>{for(let r of e){let t=L([...o],r);if(t)return t}return null};function Aa(o,e){return e.find(r=>o?.includes(r))??null}var Ea={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function Gn(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var Wn=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function Xn(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:Re(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(ua(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(ma(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(fa(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(ga(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(va(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(s?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let u=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!u)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let m=!1;if(/minuta/i.test(e.rotulo)){let l=await t.perguntarMinuta();if(!l)return;m=l==="remover"}await t.duplicar(u,m)}}}default:return{executar:()=>{}}}}function ya(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||Po(e.rotulo))||Wn.has(o.id)&&e.id.includes("-")?null:{...t,...Xn(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let u=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(u,Gn(e))}:{...t,executar:()=>a.abrirEmNovaAba(u)}}if(i.tipo==="acao"){let u=xa(n.acoes,i.acoes);return u?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(u)}:{...t,executar:()=>a.abrirNoVisualizador(u)}:null}let s=Aa(n.funcoes,i.funcoes);if(!s)return null;let c=Ea[s];if(!c)return null;let p=async u=>{let m=await a.linkDaTela(n.link,c);if(!m)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);u==="aba"?a.abrirEmNovaAba(m):a.abrirNoVisualizador(m)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function Pa(o,e){let r=[];for(let t of $e(ie,e.selecao,na)){let a=ya(t,o,e);a&&r.push(a)}return ba(r)}function ce(o,e,r){let t=[];for(let a of $e(ie,r,sa)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=ya(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function Da(o){let e=o.servicos,r=[],t=Re(o.base,o.idProcedimento);for(let a of $e(aa,o.selecao,ia)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:ha(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=xa(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=Aa(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=Ea[s];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return ba(r)}var le=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of yr({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(Jn(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function No(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function Jn(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}var To="spro-pm-icone",wa="data-spro-pm-sig",Sa=["breackline_doc"];function Kn(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function Zn(o,e){return d("span",{class:`action-doc action-${o.modo} ${To}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},P(o.icone,13))}function Yn(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(To))a.push(i);else{if(Sa.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(wa)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Sa.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=Zn(i,e);s.setAttribute(wa,t),n.after(s),n=s}return!0}function Ia(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=No(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let u=r(p,Kn(c)),m=ce(u,i,s);Yn(c,p,m)&&(n+=1)}return n}function Oa(o){for(let e of o.querySelectorAll(`.${To}`))e.remove()}function Ma(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let p=l=>{if(l.getAttribute("aria-busy")==="true")return;let f=l.getAttribute("data-id")??"",v=l.getAttribute("data-action")??"";l.setAttribute("aria-busy","true");let h=()=>{l.removeAttribute("aria-busy"),l.classList.add("feito"),setTimeout(()=>l.classList.remove("feito"),900)};Promise.resolve(e(f,v)).catch(D=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",D)).finally(h)},u=l=>{let f=l.target?.closest?.(`.${To}`);f&&(l.preventDefault(),l.stopPropagation(),p(f))},m=l=>{if(l.key!=="Enter"&&l.key!==" ")return;let f=l.target?.closest?.(`.${To}`);f&&(l.preventDefault(),p(f))};return o.addEventListener("click",u,!0),o.addEventListener("keydown",m,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",u,!0),o.removeEventListener("keydown",m,!0)}}var Ca=new Set;var Qn=null;function oi(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function La(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function _a(o,e,r){let t=o.ownerDocument,a=t.defaultView;oi(o).append(e);let n=!0,i=()=>{if(!n)return;let l=o.getBoundingClientRect?.();if(!l)return;let f=a?.innerHeight??0,v=a?.innerWidth??0,h=Math.min(r.largura??Math.max(l.width,r.larguraMinima??0),Math.max(180,v-16)),D=r.alinharDireita?l.right-h:l.left,O=Math.max(8,Math.min(D,v-h-8)),x=r.alturaMaxima??360;e.style.maxHeight="none";let S=Math.min(e.scrollHeight||x,x),E=f-l.bottom-8,k=l.top-8,oo=Qn?.()??!1,J=!oo&&E<Math.min(S,200)&&k>E;e.style.left=`${O}px`,e.style.width=`${h}px`,e.style.maxHeight=`${oo?x:Math.max(140,Math.min(x,J?k:E>140?E:x))}px`,e.classList.toggle("spro-flutuante-cima",J),J?(e.style.top="",e.style.bottom=`${f-l.top+4}px`):(e.style.bottom="",e.style.top=`${l.bottom+4}px`),La(a,J?0:Math.ceil(l.bottom+4+S+12))},s=l=>{let f=l.composedPath?.()??[],v=l.target,h=D=>f.includes(D)||!!v&&!!D.contains?.(v);h(e)||h(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},p=l=>{l.target instanceof Node&&e.contains(l.target)||c()},u=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",u);let m={ancora:o,fechar:()=>r.aoFechar()};return Ca.add(m),i(),{posicionar:i,fechar(){n&&(n=!1,Ca.delete(m),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",u),e.remove(),La(a,0))}}}function ka(o,e,r){let t=o.ownerDocument,a=d("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=l=>{let f=d("button",{type:"button",role:"menuitem",class:`spro-menu-item${l.perigo?" spro-menu-perigo":""}${l.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":l.id,...l.desativado?{"aria-disabled":"true"}:{}},d("span",{class:"spro-menu-icone","aria-hidden":"true"},P(l.icone,15)),d("span",{class:"spro-menu-rotulo"},l.rotulo),l.dica?d("span",{class:"spro-menu-dica"},l.dica):null);return f.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),!l.desativado&&(u(!0),r.aoEscolher(l))}),n.push(f),f};for(let l of ne){let f=e.filter(v=>v.grupo===l);f.length&&a.append(d("div",{class:"spro-pm-grupo",role:"group","aria-label":ke[l]},d("div",{class:"spro-pm-titulo","aria-hidden":"true"},ke[l]),...f.map(s)))}r.rodape?.length&&a.append(d("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=l=>{if(!n.length)return;let f=(l+n.length)%n.length;for(let[v,h]of n.entries())h.setAttribute("tabindex",v===f?"0":"-1");n[f]?.focus?.({preventScroll:!0})};for(let l of n)l.addEventListener("pointermove",()=>c(n.indexOf(l)));let p=_a(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>u(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function u(l){if(i)return;i=!0;let f=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",m,!0),(l||f)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function m(l){if(l.key==="Escape"){l.preventDefault(),l.stopPropagation(),u(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let f=n.findIndex(v=>v.getAttribute("tabindex")==="0");switch(l.key){case"ArrowDown":c(f+1);break;case"ArrowUp":c(f-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[f]?.click();break;case"Tab":u(!0);return;default:return}l.preventDefault(),l.stopPropagation()}return t.addEventListener("keydown",m,!0),r.focar&&c(0),{el:a,fechar:()=>u(!1)}}async function Ta(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new g("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function ei(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?bo[r.nivel]:n;if(r.nivel&&(a.push(...z("N\xEDvel de acesso",xo[n]??"",xo[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new g("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await Ao(o,e,i,t),c=Eo(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function ri(o,e,r){let t=await Ta(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=L(t.documento.acoes,a)??L(t.documento.acoes,/^documento_alterar/);if(!n)throw new g("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await I.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function ti(o,e,r){let t=H(e,"documento_escolher_tipo");if(!t)throw new g("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await I.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=I.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function ai(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,A(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=q(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,A(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function ni(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await ti(o,e,t),i=ai(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new g("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:Eo(i,r,"Tipo de documento")}}async function ii(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=I.de(s,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),u=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(u?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let h=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(O=>O.valor===h&&O.valor!=="null"))throw new g("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${h}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:h,hdnIdTextoPadrao:h})}else if(n.textoPadrao){let h=c.opcoes("selTextoPadrao").filter(O=>O.valor!=="null").map(O=>({id:O.valor,texto:O.texto})),D=Eo(h,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:D.id,hdnIdTextoPadrao:D.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await ei(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let m=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:h=>/acao_origem=documento_(?:gerar|cadastrar)/.test(h.url)||/editor_montar/.test(h.html)}),l=q(m.url).get("id_documento")??/id_documento=(\d+)/.exec(m.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:l,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let v=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(h=>h.id===l);return{idDocumento:l,numero:v?.numero??"",titulo:v?.titulo??""}}function Na(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var si=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function Ra(o,e,r,t={}){let a=await Ta(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new g("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await ri(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",u=p==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(x=>x.selecionada&&x.valor!=="null")?.valor)??void 0:void 0,m=i.valor("hdnIdSerie")??"";if(!m)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:l,tipo:f}=await ni(o,n.arvore,m,r.sinal,!0),v={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${f.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...v,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:h,numero:D,titulo:O}=await ii(o,e,n.arvore,l,f,{tipo:f.id,descricao:t.semMinuta?Na(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:si(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?Na(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:p,hipotese:u},r.sinal);return{...v,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${O||f.texto} ${D?`(${D}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:h,numero:D}}}var ci="seipro-processo-menu",ze="data-spro-pm-pedido";async function li(o,e){if(!e.html)return Pe(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function $a(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function za(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>U(e,i,s),n=(i,s,c)=>new Promise(p=>{let u=null,m=N(e,{titulo:i,icone:"alerta",largura:420,conteudo:[d("p",{},s),T(...c.map(l=>l.principal?R(l.rotulo,()=>{u=l.id,m.fechar()}):d("button",{type:"button",class:"spro-botao",onclick:()=>{u=l.id,m.fechar()}},l.rotulo)))],aoFechar:()=>p(u)})});return{async copiar(i,s){let c=await li(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=$a(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=d("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=d("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await Ra(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(no(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),p=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(ze,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(ci)),r.documentElement.hasAttribute(ze)&&(r.documentElement.removeAttribute(ze),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await Yo(e,"URGENTE")},clicarBotaoNativo(i){for(let s of $a(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var pi="configViewFlashMenuPro",di="configViewFlashDocMenuPro",ui="configViewFlashDocArvorePro";function qa(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;fo(r);let n=new le(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new ko(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>to(e.topo)),c=o.servicos??za({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,u=()=>!!H(i(),"documento_escolher_tipo"),m=b=>({selecao:b,citacao:$o(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:u(),uploadLigado:po(o.dataValues,"uploaddocsexternos"),loteLigado:po(o.dataValues,"acoesemlote"),servicos:c}),l=()=>Bo(e.armazenamento,di),f=()=>Bo(e.armazenamento,pi),v=()=>Bo(e.armazenamento,ui),h=()=>l()?.includes(se)??!1,D=(b,y)=>{let M=n.obter(b);return M||(n.lerDoIframe(r),M=n.obter(b)),{id:b,rotulo:y,dado:M}},O={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},x=b=>{let y=b;if(!y?.closest)return null;let M=y.closest('a[id^="anchorImg"]');if(M){let Z=No(M.id,"anchorImg");return Z&&Z!==e.arv.idProcedimento&&So(e.armazenamento,"menudoc")?{tipo:"documento",ancora:M,id:Z}:null}let lo=y.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return lo&&So(e.armazenamento,"menuproc")?{tipo:"processo",ancora:lo}:null},S=b=>{if(b.tipo==="processo")return{itens:Da(m(f())),rotulo:"Menu do processo"};let y=r.getElementById(`anchor${b.id}`),M=D(b.id,(y?.textContent??"").replace(/\s+/g," ").trim());return{itens:Pa(M,m(l())),rotulo:"Menu do documento"}},E=null,k=null,oo,J=()=>{clearTimeout(oo),k&&clearTimeout(k.timer),k=null;let b=E;E=null,b?.menu.fechar()},Do=(b,y)=>{if(E?.ancora===b.ancora)return;J();let{itens:M,rotulo:lo}=S(b);if(!M.length)return;let Z=ka(b.ancora,M,{rotulo:lo,escuro:eo(r),focar:y,rodape:[O],aoFechar:()=>{E?.menu===Z&&(E=null)},aoEscolher:de=>{Promise.resolve().then(()=>de.executar()).catch(Ga=>{console.warn("[SEI Pro] menu da \xE1rvore:",Ga),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});E={menu:Z,ancora:b.ancora},Z.el.addEventListener("mouseenter",()=>clearTimeout(oo)),Z.el.addEventListener("mouseleave",()=>Ro())},Ro=()=>{clearTimeout(oo),oo=setTimeout(J,a)},Ua=b=>{let y=b;return y?!!(E&&(E.ancora.contains(y)||E.menu.el.contains(y))||k?.ancora.contains(y)):!1},qe=b=>{if(Ua(b.target)){clearTimeout(oo);return}let y=x(b.target);if(k&&(clearTimeout(k.timer),k=null),!y||y.tipo==="documento"&&h()){E&&Ro();return}E&&Ro(),k={ancora:y.ancora,timer:setTimeout(()=>{k=null,Do(y,!1)},t)}},He=b=>{b.relatedTarget||(k&&(clearTimeout(k.timer),k=null),E&&Ro())},Fe=b=>{let y=x(b.target);if(y){if(y.tipo==="documento"&&h()){b.preventDefault(),b.stopImmediatePropagation(),E?.ancora===y.ancora?J():Do(y,!1);return}y.tipo==="documento"&&E?.ancora===y.ancora&&J()}},Ve=b=>{let y=x(b.target);!y||!(b.key==="ArrowDown"||(b.key==="Enter"||b.key===" ")&&y.tipo==="documento"&&h())||(b.preventDefault(),b.stopImmediatePropagation(),Do(y,!0))};r.addEventListener("mouseover",qe),r.addEventListener("mouseout",He),r.addEventListener("click",Fe,!0),r.addEventListener("keydown",Ve,!0);let Ue=null,pe=()=>{if(!So(e.armazenamento,"iconstree")){Oa(r);return}Ia(r,e.arv.idProcedimento,D,()=>m(l()),v)};So(e.armazenamento,"iconstree")&&(Ue=Ma(r,async(b,y)=>{let M=r.getElementById(`anchor${b}`),lo=D(b,(M?.textContent??"").replace(/\s+/g," ").trim());await ce(lo,m(l()),v()).find(de=>de.modo===y)?.executar()},pe),pe());let ja=n.acompanharPastas(r,()=>setTimeout(pe,80)),Ba=Uo(r,()=>{E&&(eo(r)?E.menu.el.setAttribute("data-tema","escuro"):E.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(b,y=!1){let M=No(b.id,"anchorImg");if(M)return Do({tipo:"documento",ancora:b,id:M},y);Do({tipo:"processo",ancora:b},y)},atual:()=>E?.menu??null,parar(){J(),r.removeEventListener("mouseover",qe),r.removeEventListener("mouseout",He),r.removeEventListener("click",Fe,!0),r.removeEventListener("keydown",Ve,!0),Ue?.(),ja(),Ba()}}}var mi='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function Ha(o,e,r){for(let t of o.querySelectorAll(mi)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(d("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function Fa(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(Ha(o.doc,"urgentePro",B(t.valor.especificacao,"URGENTE")),o.usaTrancado&&Ha(o.doc,"trancadoPro",B(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}Ir(`${Be}
${rr}`);_e(window)&&(ea(document),ra(document));var Va=window;if(!Va.__seiProProcessoPaineis&&_e(window)&&!ta(window)){Va.__seiProProcessoPaineis=!0;let o=()=>void fi().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}async function fi(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=po(o,"infoarvore")&&Cr(localStorage),r=po(o,"menurapido");if(!e&&!r)return;let t=await Pt(document);if(!t){console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo.");return}let a=er(),n=Yt(a),i=t.nivel==="sigiloso",s=new Vo(je(chrome.storage.local,"local"),Zt(n.host,n.login),t.idProcedimento,{sigiloso:i}),c=qo(location.href),p=ue(o,"disablequery"),u=oa({http:c,arv:t,loja:s,unidadeSigla:n.unidade.sigla,consultasDesativadas:p}),m=Qt({doc:document,topo:a,arv:t,loja:s,...n,habilitados:dr(Mr(localStorage)),armazenamento:localStorage,consultasDesativadas:p,reaberturaProgramada:ue(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:l=>{let f=u[l];f&&s.carregar(l,f)}});if(e){It(m),Fa(m);for(let l of St(m))m.recarregar(l)}r&&qa({ctx:m,dataValues:o,http:c})}})();
