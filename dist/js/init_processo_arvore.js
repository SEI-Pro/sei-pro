/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Ks(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function He(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Ks(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function Fe(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function yo(o,e){let r=Fe(o,e);return!(r===!1||r===0||r==="")}function Ue(o,e){let r=Fe(o,e);return r===!0||r===1||r==="1"}var Ot=`/*
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
`;var Zs={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function no(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Zs[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Tt={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Qs={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function xe(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Qs[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var oc=/[A-Za-z0-9\-_.*]/;function Lt(o){let e="";for(let r of o)r===" "?e+="+":oc.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Nt(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${Lt(xe(r))}=${Lt(xe(t??"",a))}`}).join("&")}function kt(o){let e=r=>encodeURIComponent(xe(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var _t="application/x-www-form-urlencoded";function Rr(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=Tt[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var Rt="application/x-www-form-urlencoded; charset=ISO-8859-1";var $t=null;function jo(o){return $t?$t(o):new DOMParser().parseFromString(o,"text/html")}function I(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var y=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Do(o){if(o instanceof y)return o;if(o instanceof DOMException&&o.name==="AbortError")return new y("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new y("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function qt(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=jo(r)}}}function zt(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new y("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new y("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=I(r);throw new y("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new y("SEI_VALIDACAO",r,r)}return o}function Ae(o,e={}){let r=new URL(".",o),t=e.fetch??((...g)=>fetch(...g)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(g){n>=a&&await new Promise(m=>i.push(m)),n+=1;try{return await g()}finally{n-=1,i.shift()?.()}}let c=g=>new URL(g.replace(/&amp;/g,"&"),r).href;async function d(g,m,u){return s(async()=>{try{let f=await t(c(g),{credentials:"same-origin",redirect:"follow",...m,signal:u.sinal}),v=Rr(await f.arrayBuffer());return zt(qt(f.url||c(g),f.status,v),u)}catch(f){throw Do(f)}})}async function p(g,m={}){return s(async()=>{try{let u=await t(c(g),{credentials:"same-origin",redirect:"follow",signal:m.sinal}),f=new Uint8Array(await u.arrayBuffer()),v=(u.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();v==="text/html"&&zt(qt(u.url||c(g),u.status,Rr(f)),m);let h=u.headers?.get("content-disposition")??"",A=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(h)?.[1]??/filename="?([^";]+)"?/i.exec(h)?.[1]??"");return{bytes:f,tipo:v,nome:A}}catch(u){throw Do(u)}})}return{base:r,absoluta:c,baixar:p,obter:(g,m={})=>d(g,{method:"GET"},m),enviar:(g,m,u={})=>d(g,u.utf8?{method:"POST",headers:{"Content-Type":_t},body:kt(m)}:{method:"POST",headers:{"Content-Type":Rt},body:Nt(m,u.modos)},u)}}function qo(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function Ve(){try{return window.top?.document??document}catch{return document}}var Ht=`/*
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
  min-height: var(--spro-p-alvo);
}
.spro-p-painel > header h3 {
  flex: 1;
  min-width: 0;
  margin: 0;
  font: inherit;
  font-size: var(--spro-p-fonte-titulo);
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
  padding: 4px 0 0 calc(var(--spro-p-icone) + 6px);
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
.spro-p-raiz[data-tema="escuro"] .spro-p-post-it {
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
   um pouco e os nossos paineis sobem, para o cabecalho de cada painel pesar o mesmo que o rotulo "Consultar Andamento". */
html[data-seipro-processo-paineis] #divConsultarAndamento a.newLink,
html[data-seipro-processo-paineis] #divRelacionados label.newLink {
  font-size: var(--spro-p-fonte-titulo);
  line-height: 1.4;
}
html[data-seipro-processo-paineis] #divConsultarAndamento a.newLink i.iconDadosProcesso,
html[data-seipro-processo-paineis] #divRelacionados label.newLink i.iconDadosProcesso {
  font-size: var(--spro-p-icone);
  line-height: 1;
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
`;var rc={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Ee(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=rc[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function $r(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=Ee(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function j(o){return typeof o=="string"?no(o):o==null?"":String(o)}var tc=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function wo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(tc))e.add(r[0]);return[...e]}function z(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function B(o,e,r={}){let t=Array.isArray(o)?o:wo(o);for(let a of t){let n=z(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function Ft(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=wo(r).filter(i=>z(i).get("acao")===e),n=(t.length?t:wo(o.html).filter(i=>z(i).get("acao")===e)).sort((i,s)=>[...z(i).keys()].length-[...z(s).keys()].length)[0];if(!n)throw new y("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Ut(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=$r(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Ee(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Vt(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=$r(o,r.index+r[0].length);e.push({tipo:j(t[0]),idPai:j(t[2]),href:j(t[3]),titulo:j(t[5]),icone:j(t[6]),extra:t[8]==null?void 0:j(t[8])})}return e}function Bt(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Gt(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>j(e[1])))]}function jt(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var ac=/\s*\(\d{5,}\)\s*$/;function Wt(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=j(r.args[1]),a=j(r.args[5]),n=j(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(g=>g.tipo==="ASSINATURA"&&g.idPai===t),{nivel:c,hipotese:d}=Bt(e,t),p=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:j(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(ac,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:p,nivel:c,hipotese:d,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(g=>g.tipo==="UNIDADE_GERADORA"&&g.idPai===t)?.extra,link:j(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:wo(r.props.acoes??""),botoes:Gt(r.props.acoes??""),funcoes:jt(r.props.acoes??"")}})}function Xt(o){return Wt(Ut(o.html),Vt(o.html))}function qr(o){let e=o.html,r=Ut(e),t=Vt(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new y("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=j(a.args[1]),i=Bt(t,n),s=Wt(r,t);return{idProcedimento:n,protocolo:j(a.args[5])||j(a.args[15]),tipo:j(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:wo(a.props.acoes??""),botoesProcesso:Gt(a.props.acoes??""),funcoesProcesso:jt(a.props.acoes??""),linkProcesso:j(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:wo(e),pagina:o}}async function Yt(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new y("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=B(t.html,"procedimento_visualizar")&&wo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return qr(t)}function K(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?B(t.acoes,e):null}return B(o.acoesProcesso,e)??B(o.links,e,{id_procedimento:o.idProcedimento})}function J(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var Wo={publico:"0",restrito:"1"},Xo={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function Yo(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(no(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Qt="\xA5",zr="\xB1";function Kt(o){return o.map(e=>`${e.id}${zr}${e.texto}`).join(Qt)}function nc(o){return o?o.split(Qt).map(e=>{let[r,...t]=e.split(zr);return{id:r,texto:t.join(zr)}}):[]}function Jt(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var R=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=ic(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new y("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,I(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Zt(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??I(t),texto:I(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=ao(r),n=t.find(i=>i.valor===r)??t.find(i=>ao(i.texto)===a)??Hr(t.filter(i=>ao(i.texto).includes(a)));if(!n)throw new y("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?nc(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new y("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Kt(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new y("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new y("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new y("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${I(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??Hr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??I(r)??e]:[e,e]}hiddenDaLupa(e){let r=Jt(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Jt(this.pagina.html)){let t=this.elemento.querySelector(`select#${Zt(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:I(n)}));(this.valor(r)??"")||this.definir({[r]:Kt(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function ic(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(d=>d.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let d of c)e.push({nome:t,valor:d.getAttribute("value")??I(d)})}}return e}function ao(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Ko(o,e,r){let t=ao(e),a=o.find(n=>n.id===e)??o.find(n=>ao(n.texto)===t)??Hr(o.filter(n=>ao(n.texto).includes(t)));if(!a)throw new y("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function Hr(o){return o.length===1?o[0]:void 0}function Zt(o){return o.replace(/([^\w-])/g,"\\$1")}function sc(o){let e=new Set;return o.filter(r=>!e.has(r.id)&&e.add(r.id))}function Fr(o){return o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Ur(o,e){let t=new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${Fr(e)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`).exec(o);return t?no(t[1]):null}function Vr(o,e){let t=new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${Fr(e)}['"]`).exec(o)?.[1];if(!t)return!1;let a=new RegExp(`\\b${Fr(t)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(o)?.[1];return!!a&&/encodeURIComponent\s*\(/.test(a)}async function Br(o,e,r,t,a=!1){let n=a?encodeURIComponent(xe(r)):r,i=await o.ajax(e,[["palavras_pesquisa",n]],{sinal:t,utf8:!0});return sc(i.map(s=>({...s,texto:no(s.texto)})))}function Jo(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let i of o.matchAll(a))n.set(i[1],i[2]);return n}function cc(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function lc(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Pe(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=cc(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:lc(o),sigla:I(r)||I(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var dc=3e4,Be=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ae(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new y("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Pe(this.base())}linkMenu(e){return Ft(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new y("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=R.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=z(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new y("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let p=z(no(c)).get("id_procedimento")??"",g=s.get("id_protocolo")??"",m={idProcedimento:p,idDocumento:g&&g!==p?g:void 0,linkArvore:no(c)};return this.localizados.set(t,m),m}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<dc)return a.arvore;let n=await Yt(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:no(i[1]),texto:no(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=jo(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function Zo(o,e,r){let t=K(o,e);if(!t)throw new y("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function ye(o,e,r){let t=await R.abrir(o,Zo(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var oa=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function ra(o,e,r){let t=oa.exec(r),a=r.replace(oa,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function pc(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(I(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>I(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return ra(s||void 0,I(i[t]),I(i[a]))}async function ta(o,e,r){let t=await o.obter(Zo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=R.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return ra(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=pc(t);if(a===void 0)throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",I(t.doc.querySelector("title")));return a}function uc(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?Ee(o.pagina.html,e.index+e[0].length-1)[0]:""}function mc(o){if(!o.trim())return[];let e=jo(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:I(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function aa(o,e){let r=mc(uc(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??Pe(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!K(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}var Ge=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function na(o,e){let r=o.filter(i=>i.unidade===e),t=i=>i.reduce((s,c)=>!s||Ge(c.data)>Ge(s.data)?c:s,null),a=t(r.filter(i=>i.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(i=>i.descricao.includes("Processo retirado do bloco")));return n&&Ge(a.data)<Ge(n.data)?null:a.descricao}function je(o){let e=t=>!!K(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function ia(o,e,r){let t=await o.obter(Zo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",I(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:I(s[1]),texto:I(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:I(s[3]),data:I(s[4])}})}async function sa(o,e,r){let a=(await R.abrir(o,Zo(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function ca(o,e,r){let t=await o.obter(Zo(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=B(t.html,"andamento_marcador_cadastrar");if(!i)throw new y("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:I(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function la(o,e,r){let t=await o.obter(Zo(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(d=>B(t.html,d)).find(Boolean);if(!c)throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=R.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function da(o,e,r){let t=K(e,"procedimento_alterar")??K(e,"procedimento_consultar");if(!t)throw new y("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await R.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),assuntos:a.itensLupa("selAssuntos"),interessadosNegados:Jo(a.pagina.html,"interessado"),assuntosNegados:Jo(a.pagina.html,"assunto"),pesquisarAssuntos:(c,d)=>ea(o,a,"hdnIdAssunto","assuntos",c,d),pesquisarContatos:(c,d)=>ea(o,a,"hdnIdInteressadoProcedimento","contatos",c,d),async hipoteses(c,d){return(await Yo(o,a,c,d)).map(p=>({valor:p.id,texto:p.texto}))}}}async function ea(o,e,r,t,a,n){let i=Ur(e.pagina.html,r);if(!i)throw new y("SEI_VERSAO_NAO_SUPORTADA",`A tela de altera\xE7\xE3o do processo n\xE3o tem a pesquisa de ${t}.`);return Br(o,i,a,n,Vr(e.pagina.html,r))}var We=(o,e)=>o>0&&e-o<18e5;var De=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function Gr(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:na(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function Qo(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:We(e.coletadoEm,o.agora().getTime())}:null}async function pa(o){let e=await Qo(o);return e?.vale?(Gr(o,e.historico),!0):!1}async function oe(o,e={}){if(o.sigiloso)throw new De;let r=await Qo(o);if(r?.vale&&!e.forcar)return Gr(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),Gr(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var ua="data-seipro-processo-paineis",ma="data-seipro-processo-menu",ga="data-seipro-processo-capa",fa="data-seipro-processo-gantt",va="data-seipro-processo-titulo",ha="data-seipro-processo-aviso",ba="naoassinados",Xe="spro-processo-gantt-abrir",Ye="spro-processo-capa-pedir",Ke="spro-processo-capa-calcular",Je="spro-processo-capa-cancelar",Ze="data-spro-capa-coleta";var xa="filtroarvore";var Qe="processo/",jr=(o,e)=>`${Qe}${o}/${e}`,Wr=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},Xr="processo-historico/",Yr=(o,e)=>`${Xr}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var mo={fill:"currentColor",stroke:"none"},Aa="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Ea={estrela:[["path",{d:Aa}]],estrelaCheia:[["path",{d:Aa,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...mo}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...mo}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...mo}],["circle",{cx:"12",cy:"12",r:"1.4",...mo}],["circle",{cx:"19",cy:"12",r:"1.4",...mo}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...mo}],["circle",{cx:"15",cy:"6",r:"1.3",...mo}],["circle",{cx:"9",cy:"12",r:"1.3",...mo}],["circle",{cx:"15",cy:"12",r:"1.3",...mo}],["circle",{cx:"9",cy:"18",r:"1.3",...mo}],["circle",{cx:"15",cy:"18",r:"1.3",...mo}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Ap=Object.keys(Ea);function M(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of Ea[o]){let c=r.createElementNS(t,i);for(let[d,p]of Object.entries(s))c.setAttribute(d,p);a.append(c)}return a}function gc(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Pa(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function ya(o,e,r,t,a){let n=o.body??o.documentElement;for(let g of[n,...o.querySelectorAll("dialog")])for(let m of[...g.children])m.classList.contains("spro-aviso")&&m.remove();let i=l("div",{class:"spro-aviso",role:"status"},M("check",16),l("span",{},e),...gc(r).map(g=>l("button",{type:"button",onclick:()=>{i.remove(),g.fazer()}},g.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,d=()=>{let g=Pa(o);g.append(i),s(),g.localName==="dialog"&&g.addEventListener("close",()=>{if(!(!p||!g.contains(i))){if(a&&Pa(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){p=!1,i.remove();return}d()}},{once:!0})},p=!0;return d(),setTimeout(()=>{p=!1,i.remove()},t),i}async function Kr(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function H(o,e,r=4e3){try{ya(o.topo,e,void 0,r)}catch{}}async function Da(o,e){let r=await Kr(o.doc,e);H(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var wa={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},Sa={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function So(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function Io(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":So(o)}async function Ia(o,e,r=100){let t=Date.now()+e;for(;Date.now()<t;){if(o())return!0;await new Promise(a=>setTimeout(a,r))}return o()}var fc=/[\u0300-\u036f]/g,Jr=o=>o.normalize("NFD").replace(fc,""),er=o=>Jr(o).toLowerCase().replace(/\s+/g," ").trim(),we=o=>String(o).padStart(2,"0"),or=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Ca=/(\d{1,2}):(\d{2})/;function Se(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=Jr(e),t=r.length===e.length?r:e,a=or.exec(t);if(!a)return{prazo:null,texto:e};let n=Ca.exec(t.slice(a.index+a[0].length))??Ca.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${we(Number(a[2]))}-${we(Number(a[1]))}`,c=n?`${we(Number(n[1]))}:${n[2]}`:"23:59",d=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),p=d?`${e.slice(0,d.index)} ${e.slice(d.index+d[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:p}}function Oa(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var vc=864e5;function ee(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),d=new Date(s.getFullYear(),s.getMonth(),s.getDate()),p=Math.round((d.getTime()-c.getTime())/vc);return p===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:p>0?{rotulo:p===1?"amanh\xE3":`em ${p} dias`,nivel:p<=2?"atencao":"ok"}:{rotulo:p===-1?"ontem":`h\xE1 ${-p} dias`,nivel:o.vencimento?"vencido":"atencao"}}function rr(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function Ta(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var Ie=500,hc=/^\s*\[( |x|X)\]\s?/;function tr(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=hc.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function La(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Na(o,e){let r=tr(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",La(r))}function ka(o,e,r){let t=tr(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return La(t)}function bc(o){let e=or.exec(Jr(o));return e?`${we(Number(e[1]))}/${we(Number(e[2]))}/${e[3]}`:null}function _a(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return or.test(o)?o.replace(or,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function ar(o){let e=bc(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function lo(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function Ra(o,e){return lo(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function Ma(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function $a(o,e,r){return[{unidade:e,observacao:Ma(o)},...r.map(a=>({unidade:a.unidade,observacao:Ma(a.observacao)}))].filter(a=>a.observacao)}function qa(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function za(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function Ha(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function Fa(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function Ua(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function Va(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var Ba="spro-processo-estilo",Zr="";function Ga(o){Zr=o}function ho(o){if(!Zr||o.getElementById(Ba))return;let e=o.createElement("style");e.id=Ba,e.textContent=Zr,(o.head??o.documentElement).append(e)}function po(o){let e=Va(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function re(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function $(o,e){ho(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});po(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},M("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},M(e.icone,18)),l("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select)")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,d=[]){this.erro(""),t=!0,a.disabled=!0;for(let p of d)p.disabled=!0;r.setAttribute("aria-busy","true");try{let p=await c();return t=!1,r.close(),p&&H(o,p.aplicado?p.resumo:p.resumo||"Nada a alterar."),!0}catch(p){t=!1,a.disabled=!1;for(let g of d)g.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(So(p)),!1}}}}function nr(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function go(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function W(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function Z(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function bo(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function zo(o,e,r,t){let a=l("select",{class:"spro-campo spro-p-lista",size:String(Math.min(8,Math.max(4,o.length))),"aria-label":r}),n=e??"",i=d=>{let p=er(d),g=p?o.filter(m=>er(m.texto).includes(p)):o;a.replaceChildren(...g.map(m=>{let u=l("option",{value:m.valor},m.texto);return u.selected=m.valor===n,u}))};a.addEventListener("change",()=>{n=a.value,t?.(n)});let s=l("input",{type:"search",class:"spro-campo",placeholder:"Buscar\u2026","aria-label":`Buscar em ${r}`});return s.addEventListener("input",()=>i(s.value)),i(""),{el:l("div",{class:"spro-p-busca"},o.length>8?s:null,a),valor:()=>n,definir(d){n=d,i(s.value)}}}function te(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),i=l("button",{type:"button",class:"spro-botao"},"Cancelar"),s=$(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),W(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}var io={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},xc=120*1e3;function uo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var To=(o,e)=>o.startsWith(uo(e));function ir(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function Wa(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function Ho(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function Ac(o){let e=[];return o.forEach((r,t)=>{let a=Wa(r.dataISO||ir(r.data));a&&e.push({a:r,t:a,i:t,d:uo(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function Xa(o,e){return uo(o)===uo(e)}function Ya(o,e,r){return Xa(o.unidade,e)?!o.unidadeNome||!r||uo(o.unidadeNome)===uo(r):!1}function Ce(o,e,r){let t=o.filter(i=>Xa(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?uo(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(i=>Ya(i,e,r));return n.length?n:t}function Ec(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,i)=>n.recebido.getTime()<r(i)&&i.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(uo(n.unidade),[...a.get(uo(n.unidade))??[],n]);for(let[n,i]of a){let s=i.some(c=>i.some(d=>c.unidadeNome&&d.unidadeNome&&uo(c.unidadeNome)!==uo(d.unidadeNome)&&t(c,d)));for(let c of i)c.chave=s&&c.unidadeNome?`${n}|${uo(c.unidadeNome)}`:n}}function ja(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${io.remetidoPrefixo}`,"i"),"")).trim()}function Pc(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function Ka(o,e){let r=Ac(o),t=[],a=[],n=[],i=[],s=(u,f)=>Ce(a,u,f)[0],c=(u,f)=>{let v=Ce(n,u,f)[0];return v?n.indexOf(v):-1},d=(u,f)=>{let{a:v}=u;if(a.some(b=>Ya(b,v.unidade,v.unidadeNome)))return;let h={unidade:v.unidade,...v.unidadeNome?{unidadeNome:v.unidadeNome}:{},chave:"",recebido:u.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:f,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:v.usuario,...v.usuarioNome?{usuarioRecebeuNome:v.usuarioNome}:{}},A=c(v.unidade,v.unidadeNome);if(A>=0){let[b]=n.splice(A,1);h.chegouEm=b.em,h.origem=b.origem}a.push(h),t.push(h)},p=(u,f,v)=>{u.remetido=f.t,u.fim=v,u.usuarioEnviou=f.a.usuario,f.a.usuarioNome&&(u.usuarioEnviouNome=f.a.usuarioNome),a.splice(a.indexOf(u),1)},g=u=>{let{a:f}=u;if(s(f.unidade,f.unidadeNome))return;let v=c(f.unidade,f.unidadeNome),h={em:u.t,unidade:f.unidade,...f.unidadeNome?{unidadeNome:f.unidadeNome}:{},origem:ja(f),usuario:f.usuario,...f.usuarioNome?{usuarioNome:f.usuarioNome}:{}};v>=0?n[v]=h:n.push(h)};for(let u=0;u<r.length;){let f=u+1;for(;f<r.length&&r[f].t.getTime()===r[u].t.getTime();)f+=1;let v=r.slice(u,f);u=f;for(let h of v)To(h.d,io.remetidoPrefixo)&&g(h);for(let h of v)To(h.d,io.recebido)&&d(h,"recebido");for(let h of v){let{a:A,d:b}=h;if(io.gerado.some(D=>To(b,D)))d(h,"gerado");else if(To(b,io.reabertura))d(h,"reabertura");else if(To(b,io.conclusao)){let D=s(A.unidade,A.unidadeNome);D&&p(D,h,"conclusao")}else if(To(b,io.remetidoPrefixo)){let D=ja(A),S=A.unidadeCitadaNome,P=s(D,S);if(P)p(P,h,"remessa"),P.destinos.push(A.unidade);else{let E=Ce(t,D,S).at(-1);E?.fim==="remessa"&&E.remetido&&h.t.getTime()-E.remetido.getTime()<=xc&&!E.destinos.includes(A.unidade)&&E.destinos.push(A.unidade)}}else To(b,io.documentoGerado)?i.push({ev:h,assinado:!1}):To(b,io.documentoAssinado)&&i.push({ev:h,assinado:!0})}}for(let u of n)t.push({unidade:u.unidade,...u.unidadeNome?{unidadeNome:u.unidadeNome}:{},chave:"",recebido:u.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:u.em,origem:u.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:u.usuario,...u.usuarioNome?{usuarioEnviouNome:u.usuarioNome}:{}});for(let{ev:u,assinado:f}of i){let{a:v}=u,h=Ce(t.filter(D=>!D.pendenteRecebimento&&D.recebido.getTime()<=u.t.getTime()),v.unidade,v.unidadeNome),A=[...h].reverse().find(D=>D.remetido===null||u.t.getTime()<=D.remetido.getTime())??h[h.length-1];if(!A)continue;let b={...v.nrSei?{nrSei:v.nrSei}:{},...v.idDocumento?{idDocumento:v.idDocumento}:{},em:u.t,titulo:Pc(v),...v.usuario?{usuario:v.usuario}:{}};(f?A.assinaturas:A.documentos).push(b)}t.sort((u,f)=>u.recebido.getTime()-f.recebido.getTime());for(let u of o){if(!u.aberto)continue;let f=Ce(t.filter(v=>!v.pendenteRecebimento),u.unidade,u.unidadeNome).at(-1);f?.fim==="remessa"&&f.remetido&&(f.enviouEm=f.remetido,f.remetido=null,f.fim=null,f.mantidoAberto=!0)}let m=Ho(e).getTime();for(let u of t)u.emCurso=u.remetido===null,u.duracaoMs=Math.max(0,(u.remetido?.getTime()??m)-u.recebido.getTime());return Ec(t,m),t.sort((u,f)=>u.recebido.getTime()-f.recebido.getTime())}var sr=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],yc=3e4,Dc=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],wc=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],ae=o=>String(o).padStart(2,"0"),Sc=o=>sr.find(e=>e.id===o)?.pxPorDia??2.2,cr=o=>`${ae(o.getUTCDate())}/${ae(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,Q=o=>`${cr(o)} ${ae(o.getUTCHours())}:${ae(o.getUTCMinutes())}`;function fo(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var lr=o=>Math.round(Math.max(0,o)/864e5*10)/10,No=o=>String(o).replace(".",","),Me=o=>o.recebido.getTime()+o.duracaoMs,Lo=(o,e)=>e&&o?`${e} (${o})`:e??o??"",Qr=(o,e)=>e>1?`${o} ${e}x`:o;function Za(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=Qr(a.sigla,a.passagens.length);return t}var Ja=o=>Math.floor(o/864e5)*864e5;function dr(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let p of o)t=Math.min(t,p.recebido.getTime()),a=Math.max(a,Me(p),...p.documentos.map(g=>g.em.getTime()));if(!Number.isFinite(t)){let p=r.agora?.getTime()??0;t=p,a=p}r.agora&&o.some(p=>p.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=Ja(t),i=Ja(a)+864e5,s=Math.max(1,(i-n)/864e5),c=r.pxPorDia??Sc(e),d=Math.min(c,yc/s);return{escala:e,pxPorDia:d,origem:n,fim:i,largura:s*d,x:p=>(p-n)/864e5*d}}function Qa(o,e=1e3){for(let r of sr)if(dr(o,r.id).largura<=e)return r.id;return"mes"}function on(o){let e=[],r=[],t=o.fim,a=(i,s,c,d)=>{let p=o.x(s);i.push({x:p,largura:Math.max(0,o.x(Math.min(c,t))-p),rotulo:d})},n=i=>new Date(i);if(o.escala==="mes")for(let i=n(o.origem).getUTCFullYear();Date.UTC(i,0,1)<t;i++)a(e,Math.max(Date.UTC(i,0,1),o.origem),Date.UTC(i+1,0,1),String(i));else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;){let d=Math.max(Date.UTC(s,c,1),o.origem);a(e,d,Date.UTC(s,c+1,1),`${wc[c]} de ${s}`),c+=1,c>11&&(c=0,s+=1)}}if(o.escala==="dia")for(let i=o.origem;i<t;i+=864e5)a(r,i,i+864e5,String(n(i).getUTCDate()));else if(o.escala==="semana"){let s=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-s*864e5;c<t;c+=7*864e5){let d=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${ae(d.getUTCDate())}/${ae(d.getUTCMonth()+1)}`)}}else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;)a(r,Math.max(Date.UTC(s,c,1),o.origem),Date.UTC(s,c+1,1),Dc[c]),c+=1,c>11&&(c=0,s+=1)}return{cima:e,baixo:r}}function ne(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var pr={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function ie(o){return o.titulo||o.nrSei||"Documento"}var Ic=8;function ot(o){let e=[],r=ne(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${Q(o.recebido)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${Q(o.recebido)}${o.usuarioRecebeu?` por ${Lo(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${Q(o.enviouEm)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${Q(o.remetido)}${o.usuarioEnviou?` por ${Lo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${fo(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${ie(n)} - ${Q(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,Ic);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:pr[r],linhas:e,...t.length?{documentos:a}:{}}}function en(o,e){return{titulo:ie(o),linhas:[{rotulo:"Gerado em",valor:`${Q(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function rn(o){let e=ot(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function ur(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:lr(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function Oe(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,Me(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var mr=o=>Qr(o.unidade,o.passagens);function tn(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,Cc(r,o,a)},ocultar(){r.hidden=!0}}}function Cc(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,i=o.offsetHeight||120,s=a.left-t.left+a.width/2-n/2;s=Math.max(6,Math.min(s,t.width-n-6));let c=a.top-t.top-i-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(s)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function an(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var Mc="http://www.w3.org/2000/svg",xo=150,G=46,Te=50,Fo=8,Le=20,Oc=38,Uo=6,nn=16,Tc=0;function T(o,e={},...r){let t=document.createElementNS(Mc,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var U=o=>Math.round(o*10)/10,sn=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function gr(o,e,r={}){let t=`spro-g${++Tc}`,a=r.larguraAlvo!==void 0,n=Za(o),i=dr(o,e,{...r.agora?{agora:r.agora}:{}}),s=a?dr(o,e,{pxPorDia:(r.larguraAlvo-xo-nn)/Math.max(1,(i.fim-i.origem)/864e5),...r.agora?{agora:r.agora}:{}}):i,c=xo+s.largura+nn,d=G+Math.max(1,n.length)*Te+8,p=T("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${U(c)} ${d}`,width:a?"100%":U(c),...a?{}:{height:d},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});p.append(T("defs",{},T("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},T("rect",{width:8,height:8,class:"listra-fundo"}),T("rect",{width:4,height:8,class:"listra-traco"})),T("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},T("rect",{width:6,height:6,class:"pontos-fundo"}),T("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let g=xo,m=on(s),u=T("g",{class:"spro-g-corpo"});n.forEach((b,D)=>{u.append(T("rect",{x:0,y:G+D*Te,width:c,height:Te,class:D%2?"raia-par":"raia-impar"}))});let f=T("g",{class:"spro-g-grade","aria-hidden":"true"});for(let b of m.baixo)f.append(T("line",{x1:U(g+b.x),x2:U(g+b.x),y1:G,y2:d,class:"grade"}));if(u.append(f),n.forEach((b,D)=>{let S=G+D*Te,P=T("g",{class:"spro-g-raia","data-raia":b.chave});for(let E of b.passagens){let C=ne(E),N=g+s.x(E.recebido.getTime()),F=Math.max(4,s.x(Me(E))-s.x(E.recebido.getTime())),Y=T("g",{class:`spro-g-barra ${C}`,"data-situacao":C,...a?{}:{tabindex:0,role:"img"},"aria-label":rn(E)});if(Y.append(T("rect",{x:U(N),y:S+Fo,width:U(F),height:Le,rx:4,class:"fundo"})),C==="em-curso")Y.append(T("rect",{x:U(N),y:S+Fo,width:U(F),height:Le,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(C==="pendente")Y.append(T("rect",{x:U(N),y:S+Fo,width:U(F),height:Le,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(C==="mantido-aberto"&&E.enviouEm){let V=g+s.x(E.enviouEm.getTime());Y.append(T("rect",{x:U(V),y:S+Fo,width:U(Math.max(2,N+F-V)),height:Le,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),Y.append(T("line",{x1:U(V),x2:U(V),y1:S+Fo-3,y2:S+Fo+Le+3,class:"marca-remessa"}))}if(F>=44&&Y.append(T("text",{x:U(N+6),y:S+Fo+14,class:"texto-barra"},fo(E.duracaoMs))),!a&&r.dica){let V=r.dica,Eo=ot(E);Y.addEventListener("pointerenter",()=>V.mostrar(Eo,Y)),Y.addEventListener("pointerleave",()=>V.ocultar()),Y.addEventListener("focus",()=>V.mostrar(Eo,Y)),Y.addEventListener("blur",()=>V.ocultar())}P.append(Y);for(let V of E.documentos){let Eo=g+s.x(V.em.getTime()),ro=T("path",{d:`M${U(Eo)} ${S+Oc-Uo}l${Uo} ${Uo}l-${Uo} ${Uo}l-${Uo} -${Uo}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${ie(V)}, ${Q(V.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let vo=r.dica,Oo=en(V,E);vo&&(ro.addEventListener("pointerenter",()=>vo.mostrar(Oo,ro)),ro.addEventListener("pointerleave",()=>vo.ocultar()),ro.addEventListener("focus",()=>vo.mostrar(Oo,ro)),ro.addEventListener("blur",()=>vo.ocultar()));let to=()=>r.aoAbrirDocumento?.(V,E);ro.addEventListener("click",to),ro.addEventListener("keydown",$o=>{let Bo=$o.key;(Bo==="Enter"||Bo===" ")&&($o.preventDefault(),to())})}P.append(ro)}}u.append(P)}),p.append(u),r.agora&&o.some(b=>b.emCurso)&&r.agora.getTime()>=s.origem&&r.agora.getTime()<=s.fim){let b=U(g+s.x(r.agora.getTime()));p.append(T("g",{class:"spro-g-agora","aria-hidden":"true"},T("line",{x1:b,x2:b,y1:G,y2:d}),T("text",{x:Math.min(b+4,c-40),y:G+11},"Agora")))}let v=T("g",{class:"spro-g-cabecalho","aria-hidden":"true"});v.append(T("rect",{x:0,y:0,width:c,height:G,class:"cabecalho-fundo"}));for(let b of m.cima)v.append(T("line",{x1:U(g+b.x),x2:U(g+b.x),y1:0,y2:G,class:"grade-forte"})),b.largura>36&&v.append(T("text",{x:U(g+b.x+6),y:15,class:"eixo-cima"},b.rotulo));for(let b of m.baixo)b.largura>=14&&v.append(T("text",{x:U(g+b.x+b.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},b.rotulo));v.append(T("line",{x1:0,x2:c,y1:G,y2:G,class:"grade-forte"})),p.append(v);let h=T("g",{class:"spro-g-rotulos"});h.append(T("rect",{x:0,y:G,width:xo,height:d-G,class:"rotulos-fundo"})),n.forEach((b,D)=>{let S=G+D*Te,P=T("text",{x:10,y:S+22,class:"rotulo-raia"},sn(b.rotulo,20)),E=b.nome&&b.nome!==b.sigla?b.nome:"",C=T("g",{"aria-label":`${b.sigla}${E?`, ${E}`:""}: ${b.passagens.length} passagem(ns)`,role:"img"},P);E&&C.append(T("text",{x:10,y:S+37,class:"rotulo-nome"},sn(E,24))),h.append(C)}),h.append(T("line",{x1:xo,x2:xo,y1:G,y2:d,class:"grade-forte"})),p.append(h);let A=T("g",{class:"spro-g-canto","aria-hidden":"true"},T("rect",{x:0,y:0,width:xo,height:G,class:"cabecalho-fundo"}),T("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),T("line",{x1:xo,x2:xo,y1:0,y2:G,class:"grade-forte"}),T("line",{x1:0,x2:xo,y1:G,y2:G,class:"grade-forte"}));return p.append(A),n.length===0&&p.append(T("text",{x:g+12,y:G+28,class:"rotulo-nome"},"Sem passagens.")),p}function cn(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let i=e.scrollLeft,s=e.scrollTop;r?.setAttribute("transform",`translate(0 ${s})`),t?.setAttribute("transform",`translate(${i} 0)`),a?.setAttribute("transform",`translate(${i} ${s})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var Lc=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function dn(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...Lc]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",pr[ne(t)],Q(t.recebido),a?Q(a):"",No(Math.round(t.duracaoMs/864e5*100)/100),fo(t.duracaoMs),t.pendenteRecebimento?"":Lo(t.usuarioRecebeu,t.usuarioRecebeuNome),Lo(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${ie(n)} (${cr(n.em)})`).join(" | ")])}return an(r)}function pn(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function un(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),i=o.createElement("a");return i.href=n,i.download=e,i.style.display="none",o.body.append(i),i.click(),i.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var Nc="spro-g-impressao";function kc(o,e="mes"){let r=Oe(o.passagens),t=ur(o.passagens),a=[...o.passagens].sort((c,d)=>c.recebido.getTime()-d.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},pr[ne(c)]),l("td",{},Q(c.recebido)),l("td",{},c.remetido??c.enviouEm?Q(c.remetido??c.enviouEm):""),l("td",{},fo(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),i=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},mr(c)),l("td",{},No(c.dias)),l("td",{},`${No(c.percentual)}%`),l("td",{},String(c.passagens)))))),s=gr(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:Nc,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${fo(r.corridoMs)} (${No(lr(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${Q(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},s),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),i)}function mn(o,e,r="mes"){let t=o.defaultView??window,a=kc(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var fr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${fo(o)}`,gn=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:Ka(o,r)}),Rc=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function fn(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,i=!1,s=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,d=l("div",{class:"spro-g-visao"}),p=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function g(x){if(i||e.sigiloso)return;let w=p();n?.abort();let O=new AbortController;n=O,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...w?{anterior:w}:{}},to();try{let k=await oe(e,{sinal:O.signal,forcar:x,aoProgresso:(L,q)=>{i||n!==O||r.tipo!=="coletando"||(r={...r,feito:L,total:q},F())}});if(i||n!==O)return;r={tipo:"pronto",dados:gn(k.andamentos,k.coletadoEm,e.agora())}}catch(k){if(i||n!==O)return;k instanceof De?r={tipo:"sigiloso"}:Rc(k)||O.signal.aborted?r={tipo:"cancelado",...w?{anterior:w}:{}}:r={tipo:"erro",mensagem:So(k),...w?{anterior:w}:{}}}finally{n===O&&(n=null)}to()}function m(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},to(),n.abort())}let u=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),f=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),v=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},u,f),h=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),A=l("div",{class:"spro-g-progresso"}),b=l("div",{class:"spro-g-aviso",role:"status"}),D=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),S=l("button",{type:"button",class:"spro-botao"},M("atualizar",15),"Atualizar"),P=l("button",{type:"button",class:"spro-botao"},M("planilha",15),"Exportar CSV"),E=l("button",{type:"button",class:"spro-botao"},M("imprimir",15),"Imprimir"),C=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),S,P,E);d.append(l("div",{class:"spro-g-topo"},v,h),A,b,D,C);let N=(x,w=!1)=>{t=x,to(),w&&(x==="gantt"?u:f).focus()};u.addEventListener("click",()=>N("gantt")),f.addEventListener("click",()=>N("tempo")),v.addEventListener("keydown",x=>{let w=x.key;(w==="ArrowRight"||w==="ArrowLeft"||w==="Home"||w==="End")&&(x.preventDefault(),N(w==="Home"?"gantt":w==="End"||t==="gantt"?"tempo":"gantt",!0))}),S.addEventListener("click",()=>void g(!0)),P.addEventListener("click",()=>{let x=p();x?.passagens.length&&(un(e.topo,pn(e.protocolo),dn(x.passagens)),H(e,"CSV do hist\xF3rico gerado.",2500))}),E.addEventListener("click",()=>{let x=p();x?.passagens.length&&mn(e.topo,{protocolo:e.protocolo,passagens:x.passagens,agora:Ho(e.agora()),coletadoEm:Ho(new Date(x.coletadoEm))})});function F(){if(r.tipo!=="coletando")return;let{feito:x,total:w,cancelando:O}=r,k=O?"Cancelando a coleta\u2026":w>0?`Coletando o hist\xF3rico: p\xE1gina ${x} de ${w}`:"Coletando o hist\xF3rico\u2026",L=A.querySelector(".spro-g-prog-barra"),q=A.querySelector(".spro-g-prog-texto");if(q&&(q.textContent=k),L){let co=w>0?Math.round(x/w*100):0;L.setAttribute("aria-valuenow",String(co));let be=L.firstElementChild;be&&(be.style.width=w>0?`${co}%`:""),L.classList.toggle("indeterminado",w<=0)}}function Y(){if(r.tipo!=="coletando"){A.hidden=!0,A.replaceChildren();return}A.hidden=!1;let x=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},M("cancelar",14),"Cancelar coleta");x.addEventListener("click",m),A.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),x),F()}function V(){let x=r,w=(L,q)=>{let co=l("button",{type:"button",class:"spro-botao pequeno"},L);return co.addEventListener("click",q),co};b.className="spro-g-aviso",b.replaceChildren(),b.hidden=!0;let O=(L,q,...co)=>{b.hidden=!1,b.className=`spro-g-aviso ${L}`,b.replaceChildren(M("alerta",15),l("span",{class:"spro-g-aviso-texto"},q),...co)},k=e.agora().getTime();x.tipo==="sigiloso"?O("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):x.tipo==="erro"?O("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${x.mensagem}`,w("Tentar de novo",()=>void g(!1))):x.tipo==="cancelado"?O("cancelado","Coleta cancelada.",w("Coletar de novo",()=>void g(!1))):x.tipo==="coletando"&&x.anterior&&!x.cancelando?O("desatualizado",`Mostrando o hist\xF3rico coletado ${fr(k-x.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):x.tipo==="pronto"&&k-x.dados.coletadoEm>=18e5&&O("desatualizado",`Este hist\xF3rico foi coletado ${fr(k-x.dados.coletadoEm)}.`,w("Atualizar agora",()=>void g(!0))),(x.tipo==="erro"||x.tipo==="cancelado")&&x.anterior&&O(x.tipo==="erro"?"erro":"cancelado",`${x.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${x.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${fr(k-x.anterior.coletadoEm)} (desatualizado).`,w("Tentar de novo",()=>void g(!1)))}function Eo(){s?.(),s=null,D.replaceChildren();let x=p();if(r.tipo==="sigiloso"){D.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!x){D.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!x.passagens.length){D.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}D.setAttribute("aria-labelledby",`${c}-aba-${t}`),D.append(t==="gantt"?ro(x):vo(x))}function ro(x){let w=Ho(e.agora());a??=Qa(x.passagens,980);let O=a,k=l("div",{class:"spro-g-quadro"}),L=tn(k,`${c}-dica`),q=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),co=gr(x.passagens,O,{agora:w,dica:L,aoAbrirDocumento:(Po,Go)=>o.abrirDocumento(Po,Go)});q.append(co),k.prepend(q),s=cn(co,q),q.addEventListener("scroll",()=>L.ocultar());let be=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let Po of sr){let Go=l("button",{type:"button","aria-pressed":String(Po.id===O),"data-escala":Po.id},Po.rotulo);Go.addEventListener("click",()=>{if(a===Po.id)return;let Ys=q.scrollWidth>0?q.scrollLeft/q.scrollWidth:0;a=Po.id,to();let _r=D.querySelector(".spro-g-rolagem");_r&&(_r.scrollLeft=Ys*_r.scrollWidth)}),be.append(Go)}let Mt=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");Mt.addEventListener("click",()=>{q.scrollLeft=q.scrollWidth});let Xs=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([Po,Go])=>l("li",{},l("span",{class:`spro-g-amostra ${Po}`,"aria-hidden":"true"}),Go)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},be,Mt,Xs),k)}function vo(x){let w=ur(x.passagens),O=Oe(x.passagens),k=Math.max(1,...w.map(L=>L.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${O.passagens} passagem(ns) por ${O.unidades} unidade(s). Tempo corrido do processo: ${fo(O.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...w.map(L=>{let q=l("span",{class:`spro-g-barra-pct${L.emCurso?" em-curso":""}`});return q.style.width=`${Math.max(1,Math.round(L.percentual/k*100))}%`,l("tr",{},l("th",{scope:"row"},mr(L),L.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},No(L.dias)),l("td",{class:"num"},`${No(L.percentual)}%`),l("td",{class:"num"},String(L.passagens)),l("td",{class:"barra","aria-hidden":"true"},q))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function Oo(){let x=p(),w=r.tipo==="coletando",O=!x?.passagens.length;S.disabled=w||r.tipo==="sigiloso",P.disabled=O,E.disabled=O;let k=C.querySelector(".spro-g-frescor");k&&(k.textContent=x?`Coletado em ${Q(Ho(new Date(x.coletadoEm)))} (${fr(e.agora().getTime()-x.coletadoEm)})`:"")}function to(){u.setAttribute("aria-selected",String(t==="gantt")),f.setAttribute("aria-selected",String(t==="tempo")),u.setAttribute("tabindex",t==="gantt"?"0":"-1"),f.setAttribute("tabindex",t==="tempo"?"0":"-1");let x=p();h.textContent=x?.passagens.length?`${x.passagens.length} passagem(ns)`:"",Y(),V(),Eo(),Oo()}to();let $o=setInterval(()=>{i||Oo()},3e4);$o.unref?.();let Bo=(async()=>{if(e.sigiloso)return;let x=await Qo(e);i||(x&&!x.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:gn(x.historico.andamentos,x.historico.coletadoEm,e.agora())},to()),await g(!1))})();return{el:d,estado:()=>r,destruir(){i=!0,clearInterval($o),n?.abort(),s?.()},pronta:Bo}}function $c(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function vn(o,e){let r=e.nrSei??e.titulo,t=$c(o,e);if(!t)return H(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return H(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return $(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var hn="spro-g-dialogo";function bn(o,e={}){let r=o.topo.querySelector(`dialog.${hn}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=fn({ctx:o,abrirDocumento:n=>void vn(o,n),...e}),a=$(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(hn),{...t,fechar:a.fechar}}function xn(o,e){let r=()=>{e().then(t=>{if(!t){H({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}bn(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(Xe,r),()=>o.removeEventListener(Xe,r)}async function et(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var En=0,Pn=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Ne=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return jr(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Pn(e)?e:null}catch{return null}}async gravar(e){if(!Wr(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return En+=1,await Bc(this.area,En%25===0),!0}};async function Bc(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(Qe)).length<=200)return 0;let r=await et(o,Qe),t=Object.entries(r).filter(([,i])=>Pn(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var yn=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),ke=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return Yr(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return yn(e)?e:null}catch{return null}}async gravar(e){if(!Wr(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Gc(this.area,this.agora()),!0}};async function Gc(o,e){try{let r=await et(o,Xr),t=Object.entries(r).filter(([,n])=>yn(n)).map(([n,i])=>({k:n,em:i.coletadoEm})).sort((n,i)=>i.em-n.em),a=new Set;t.forEach((n,i)=>{(i>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(i=>i.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var Xc=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",se=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new Ne(e,r,t),this.repoHistorico=new ke(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}definir(e,r){this.fatias.set(e,r);for(let t of[...this.ouvintes])try{t(e)}catch{}if(r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:Xc(i),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var rt=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],Yc={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},Kc=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Dn(o){let e=new Set(o?.length?o:Kc),r=new Set(["descricao"]);for(let[t,a]of Object.entries(Yc))e.has(a)&&r.add(t);return r}var wn=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),tt={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};function ce(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},M(o.icone,14))}function Sn(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=M("chevron",14),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("span",{class:"spro-p-icone","aria-hidden":"true"},M(o.icone,15)),l("h3",{},o.titulo),e,a),r),i=s=>{n.toggleAttribute("data-recolhido",!s),a.setAttribute("aria-expanded",String(s)),r.hidden=!s};return i(o.aberto),a.addEventListener("click",()=>{let s=n.hasAttribute("data-recolhido");i(s),o.aoAlternar(s)}),{el:n,definirAberto:i,atualizar(s,c){n.setAttribute("data-estado",s),e.replaceChildren(...(c.acoes??[]).map(ce)),r.replaceChildren(...c.corpo.filter(d=>d!=null&&d!==!1))}}}var Jc="configViewFlashPanelArvorePro",at="optionsPro";function nt(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function Cn(o){let e=nt(o,Jc);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function le(o){let e=nt(o,at);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function Mn(o){return le(o).optionsFlashMenu_panelinfo!=="disabled"}function On(o,e){return le(o)[`panelDadosArvorePro_${e}`]!=="hide"}function Tn(o,e,r){try{let t=le(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(at,JSON.stringify(t))}catch{}}function vr(o,e){let r=nt(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function _e(o,e){return le(o)[`optionsFlashMenu_${e}`]!=="disabled"}var In=o=>o===!0||o==="true";function Ln(o){let e=le(o);return{tramitadoNaUnidade:In(e.panelDadosArvoreInteressados_tramiteUnidade),mesmaNatureza:In(e.panelDadosArvoreInteressados_mesmaNatureza)}}function Nn(o,e){try{let r=le(o);r.panelDadosArvoreInteressados_tramiteUnidade=e.tramitadoNaUnidade,r.panelDadosArvoreInteressados_mesmaNatureza=e.mesmaNatureza,o.setItem(at,JSON.stringify(r))}catch{}}function Zc(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function kn(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},M("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function Vo(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function ko(o){return l("div",{class:"spro-p-nota"},o)}function Ao(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[kn(o.erro??"",e)]:[Zc(t)];let a=r(o.dado);return o.estado==="erro"?[...a,kn(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}function _n(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os grupos\u2026")),a=$(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});o.op.opcoesAcompanhamento().then(({grupos:n,atual:i})=>{a.el.isConnected&&Qc(o,a,t,n,i,e,r)}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar os grupos."),t.replaceChildren()})}function Qc(o,e,r,t,a,n,i){let s=l("select",{class:"spro-campo","aria-label":"Grupo"},l("option",{value:""},"(sem grupo)"),...t.map(f=>l("option",{value:f.valor},f.texto)));s.value=a??"";let c=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});c.value=n?n.observacao??"":i.slice(0,450);let d=o.reaberturaProgramada||!!n?.reabertura,p=bo("Reabertura programada",!!n?.reabertura,f=>g.hidden=!f),g=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!n?.reabertura});g.value=n?.reabertura?za(n.reabertura):"";let m=Z("Salvar",()=>void u()),u=async()=>{if(d&&p.input.checked&&!g.value){e.erro("Informe a data da reabertura.");return}let f=Ha(c.value,d&&p.input.checked?qa(g.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.value,observacao:f}),[m])&&o.recarregar("acompanhamento")};nr(r,d?p.el:null,d?l("div",{class:"spro-p-grade"},g):null,go("Grupo",s),go("Observa\xE7\xE3o",c),W(m))}var X=(o,e)=>o.loja.ler(e);function oo(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void Da(o,e)},e,...t)}function de(o,e){return ko(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var eo=(...o)=>l("div",{class:"spro-p-linha"},...o);function ol(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?ee({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},M("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var Rn={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=X(o,"acompanhamento"),r=X(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>_n(o,a,t)}]:[],corpo:Ao(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[de(i.motivo,"O acompanhamento especial")];if(!i.valor)return[Vo("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:d}=i.valor;return[eo(oo(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),d?eo(ol(d,o.agora())):null]})}}}};function hr(o,e){let r=l("textarea",{class:"spro-campo spro-p-anotacao",rows:"7",maxlength:String(Ie),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});r.value=e?.texto??"";let t=l("span",{class:"spro-p-contador","aria-live":"polite"}),a=()=>{let u=Ie-r.value.length;t.textContent=u<=0?"Limite de caracteres atingido.":`${u} caracteres restantes`};r.addEventListener("input",a),a();let n=u=>r.value.slice(0,u).split(`
`).length-1,i=l("button",{type:"button",class:"spro-botao pequeno","aria-label":"Transformar as linhas selecionadas em checklist"},M("check",14),"Checklist");i.addEventListener("click",()=>{r.value=ka(r.value,n(r.selectionStart??0),n(r.selectionEnd??0)).slice(0,Ie),a(),r.focus()});let s=l("input",{type:"date",class:"spro-campo spro-p-data","aria-label":"Data para inserir na anota\xE7\xE3o"});s.value=ar(r.value)??"",s.addEventListener("change",()=>{s.value&&(r.value=_a(r.value,s.value).slice(0,Ie),a())});let c=bo("Prioridade",e?.prioridade??!1,()=>{}),d=Z("Salvar",()=>void m(r.value,c.input.checked)),p=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover anota\xE7\xE3o"),g=$(o,{titulo:e?"Editar anota\xE7\xE3o":"Adicionar anota\xE7\xE3o",icone:"nota",conteudo:[r,t,l("div",{class:"spro-p-ferramentas"},i,l("label",{class:"spro-p-opcao"},M("calendario",14),l("span",{},"Data"),s),c.el),W(e?p:null,d)]}),m=async(u,f)=>{await g.gravar(()=>o.op.anotar({texto:u.trim(),prioridade:f}),[d,p])&&o.recarregar("anotacao")};p.addEventListener("click",()=>{te(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(u=>{u&&m("",!1)})})}async function it(o,e){try{await e()}catch(r){H(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var $n={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=X(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null;return{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void it(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>hr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void te(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(a=>{a&&it(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>hr(o,null)}]:[],corpo:Ao(e,()=>o.recarregar("anotacao"),a=>{if(!a.disponivel)return[de(a.motivo,"As anota\xE7\xF5es")];if(!a.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>hr(o,null)},"Adicionar anota\xE7\xE3o"))];let{texto:n,prioridade:i}=a.valor,s=ar(n),c=s?ee({data:s,hora:"23:59",vencimento:!0},o.agora()):null,d=tr(n).map((p,g)=>p.marca===null?l("div",{class:"spro-p-nota-linha"},p.texto||" "):l("label",{class:`spro-p-nota-linha item${p.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:p.marca==="feito",onchange:()=>void it(o,()=>o.op.alternarItemDaAnotacao(g))}),l("span",{},p.texto)));return[l("div",{class:`spro-p-post-it${i?" prioridade":""}`},i?l("span",{class:"spro-p-chip vencido"},M("alerta",11),"prioridade"):null,...d,s&&c?l("span",{class:`spro-p-chip ${c.nivel}`},M("calendario",11),`${rr({data:s,hora:"23:59",vencimento:!0})} \xB7 ${c.rotulo}`):null)]})}}}};function qn(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando a lista de usu\xE1rios\u2026")),a=$(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[t]});o.op.opcoesAtribuicao().then(({opcoes:n,atual:i})=>{if(!a.el.isConnected)return;let s=e.usuario?n.find(m=>m.texto.split(" - ")[0]?.trim().toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0,c=zo(n,i??s,"usu\xE1rios da unidade"),d=Z("Salvar",()=>void g(c.valor(),d,p)),p=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),g=async(m,...u)=>{if(m===""){a.erro("Escolha um usu\xE1rio.");return}let f=m===null?void 0:n.find(h=>h.valor===m);if(await a.gravar(()=>o.op.atribuir(m),u)){let[h="",...A]=(f?.texto??"").split(" - ");r(m===null?{usuario:null}:{usuario:h.trim(),nome:A.join(" - ").trim()})}};p.addEventListener("click",()=>void g(null,d,p)),t.replaceChildren(l("p",{class:"spro-p-nota"},"Atribuir para:"),c.el,W(e.usuario?p:null,d))}).catch(n=>{a.erro(n instanceof Error?n.message:"N\xE3o foi poss\xEDvel carregar a lista de usu\xE1rios."),t.replaceChildren()})}var zn={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"pessoa",desenhar(o){let e=X(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:Ao(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return eo(oo(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?ce({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>qn(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let d=c.dado.linhas.map(p=>p===a?{...p,usuario:s.usuario,nomeUsuario:s.nome,texto:Fa(p.texto,s.usuario)}:p);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:d,usuario:s.usuario}})})}):null)}):[ko(t.texto||"Processo sem andamento aberto.")],1)}}}};var Hn={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"camadas",desenhar(o){let r=X(o,"blocoInterno").dado;if(r&&We(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[eo(r.descricao?oo(o,r.descricao):ko("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,i)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${i}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};var br=class extends Error{constructor(r,t){super(t);this.codigo=r;this.name="ErroRpc"}};function el(o,e){let r=e.replace(/\D/g,""),t=r?o.querySelector(`tr[id="P${r}"] a[href*="procedimento_trabalhar"]`):null;if(t)return{tipo:"linha",link:t};let a=o.querySelector("#frmProtocoloPesquisaRapida"),n=o.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function Fn(o,e,r,t){let a=el(o,e);if(!a)throw new br("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return t?o.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=r,t&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var Un=Object.freeze({carregando:!1,erro:null,processos:[],total:null,completa:!1,vazia:!1}),Vn=o=>o.idProcedimento??o.protocolo,xr=class{constructor(e,r,t=a=>a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar."){this.buscar=e;this.aoMudar=r;this.mensagemDeErro=t}estado={...Un};versao=0;controle=null;atual(){return this.estado}iniciar(){this.controle?.abort();let e=++this.versao;this.publicar({...Un,carregando:!0}),this.carregar(0,e,[])}mais(){let e=this.estado;if(e.carregando||e.completa||e.total===null)return;let r=++this.versao;this.controle?.abort(),this.publicar({...e,carregando:!0,erro:null}),this.carregar(e.processos.length,r,e.processos)}repetir(){this.estado.total===null||!this.estado.processos.length?this.iniciar():this.mais()}parar(){this.controle?.abort(),this.versao+=1}publicar(e){this.estado=e,this.aoMudar(e)}async carregar(e,r,t){let a=new AbortController;this.controle=a;try{let n=await this.buscar(e,a.signal);if(r!==this.versao)return;let i=new Set(t.map(Vn)),s=[...t,...n.processos.filter(c=>!i.has(Vn(c)))];this.publicar({carregando:!1,erro:null,processos:s,total:n.total,completa:s.length>=n.total||n.processos.length===0,vazia:s.length===0})}catch(n){if(r!==this.versao||a.signal.aborted)return;this.publicar({...this.estado,carregando:!1,erro:this.mensagemDeErro(n)})}}};var rl=o=>o===1?"1 processo":`${o} processos`;function tl(o,e){let r=l("button",{type:"button",class:"spro-p-link spro-p-proc-num","aria-label":`Abrir o processo ${o.protocolo}`},M("pasta",14),o.protocolo);r.addEventListener("click",i=>e(o,i.ctrlKey||i.metaKey)),r.addEventListener("auxclick",i=>{i.button===1&&e(o,!0)});let t=o.unidade?o.unidadeNome&&o.unidadeNome!==o.unidade?`${o.unidade} (${o.unidadeNome})`:o.unidade:"",a=o.usuario?o.usuarioNome&&o.usuarioNome!==o.usuario?`${o.usuarioNome} (${o.usuario})`:o.usuario:"",n=[t,a,o.data].filter(Boolean);return l("li",{class:"spro-p-processo"},l("div",{class:"spro-p-processo-topo"},r,o.tipoProcesso?l("span",{class:"spro-p-chip"},o.tipoProcesso):null),n.length?l("div",{class:"spro-p-processo-meta"},...n.map(i=>l("span",{},i))):null)}function Bn(o,e){let r=Ln(o.armazenamento),t=bo("Tramitados na unidade",r.tramitadoNaUnidade,()=>f()),a=bo(e.tipoNome?`De mesmo tipo (${e.tipoNome})`:"De mesmo tipo",r.mesmaNatureza,()=>f());a.input.disabled=!e.tipo;let n=l("div",{class:"spro-p-nota",role:"status","aria-live":"polite"}),i=l("ul",{class:"spro-p-lista-processos","aria-label":`Processos de ${e.nome}`}),s=l("div",{class:"spro-p-processos-rodape"}),c=l("div",{class:"spro-p-modal-lugar"},n,i,s),d=$(o,{titulo:"Processos do interessado",icone:"pessoa",largura:640,conteudo:[l("p",{class:"spro-p-interessado-nome"},e.nome),l("div",{class:"spro-p-ferramentas",role:"group","aria-label":"Filtros da pesquisa"},t.el,a.el),c]});d.el.classList.add("spro-p-dialogo-processos");let p=e.id,g=async()=>{if(p)return p;let h=await o.op.formularioDoProcesso(),A=h.interessados.find(b=>b.texto===e.nome)??h.interessados.find(b=>b.texto.startsWith(e.nome));if(!A)throw new Error("N\xE3o achei este interessado no cadastro do processo.");return p=A.id,A.id},m=(h,A)=>{try{Fn(o.topo,h.idProcedimento??"",h.protocolo,A),A||d.fechar()}catch(b){H(o,b instanceof Error?b.message:"N\xE3o foi poss\xEDvel abrir o processo.",6e3)}},u=new xr(async(h,A)=>o.op.processosDoInteressado({interessadoId:await g(),inicio:h,tramitadoNaUnidade:t.input.checked,...a.input.checked&&e.tipo?{tipoProcesso:e.tipo}:{}},A),h=>v(h),Io),f=()=>{Nn(o.armazenamento,{tramitadoNaUnidade:t.input.checked,mesmaNatureza:a.input.checked}),u.iniciar()};function v(h){if(c.setAttribute("aria-busy",String(h.carregando)),i.replaceChildren(...h.processos.map(A=>tl(A,m))),s.replaceChildren(),h.carregando&&!h.processos.length){n.textContent="Pesquisando os processos do interessado\u2026",i.append(l("li",{class:"spro-p-esqueleto","aria-hidden":"true"},l("span",{class:"spro-p-barra"}),l("span",{class:"spro-p-barra",style:"width:62%"})));return}if(h.erro&&!h.processos.length){n.replaceChildren();let A=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");A.addEventListener("click",()=>u.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},M("alerta",13),` ${h.erro} `,A));return}if(h.vazia){n.textContent="Nenhum processo encontrado. A pesquisa s\xF3 traz os que voc\xEA pode ver.";return}if(n.textContent=h.total===null?"":`${h.processos.length} de ${rl(h.total)}.`,h.erro){let A=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");A.addEventListener("click",()=>u.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},M("alerta",13),` ${h.erro} `,A))}else if(!h.completa){let A=l("button",{type:"button",class:"spro-botao"},h.carregando?"Carregando\u2026":`Mais resultados (${(h.total??0)-h.processos.length} restantes)`);A.disabled=h.carregando,A.addEventListener("click",()=>u.mais()),s.append(A)}}d.el.addEventListener("close",()=>u.parar()),u.iniciar()}var Ar=class{constructor(e,r=new Map){this.negados=r;this.atuais=[...e]}atuais;novos=[];retirados=new Set;linhas(){let e=r=>{let t=this.negados.get(r);return t===void 0?{}:{negadoPor:t}};return[...this.atuais.map(r=>({item:r,estado:this.retirados.has(r.id)?"retirado":"atual",...e(r.id)})),...this.novos.map(r=>({item:r,estado:"novo"}))]}tem(e){return this.novos.some(r=>r.id===e)||this.atuais.some(r=>r.id===e)&&!this.retirados.has(e)}adicionar(e){return this.tem(e.id)?!1:this.atuais.some(r=>r.id===e.id)?(this.retirados.delete(e.id),!0):(this.novos.push({id:e.id,texto:e.texto}),!0)}alternarRetirada(e){return!this.atuais.some(r=>r.id===e)||this.negados.has(e)?!1:(this.retirados.has(e)?this.retirados.delete(e):this.retirados.add(e),!0)}removerNovo(e){let r=this.novos.findIndex(t=>t.id===e);return r<0?!1:(this.novos.splice(r,1),!0)}resultado(){return[...this.atuais.filter(e=>!this.retirados.has(e.id)),...this.novos]}mudou(){return this.retirados.size>0||this.novos.length>0}contagem(){return{atuais:this.atuais.length-this.retirados.size,retirados:this.retirados.size,novos:this.novos.length}}};var Gn=o=>o.replace(/\s+/g," ").trim(),Er=class{constructor(e){this.o=e;this.minimo=e.minimo??3,this.esperaMs=e.esperaMs??350}versao=0;controle=null;minimo;esperaMs;digitou(e){let r=Gn(e),t=this.cancelar();if(!r)return this.o.aoMudar({tipo:"ocioso"});if(r.length<this.minimo)return this.o.aoMudar({tipo:"curto",falta:this.minimo-r.length});(this.o.esperar??(n=>new Promise(i=>setTimeout(i,n))))(this.esperaMs).then(()=>{t===this.versao&&this.executar(r,t)})}agora(e){let r=Gn(e),t=this.cancelar();if(r.length<this.minimo)return this.o.aoMudar(r?{tipo:"curto",falta:this.minimo-r.length}:{tipo:"ocioso"});this.executar(r,t)}repetir(e){this.agora(e)}parar(){this.cancelar()}cancelar(){return this.controle?.abort(),this.controle=null,++this.versao}async executar(e,r){let t=new AbortController;this.controle=t,this.o.aoMudar({tipo:"pesquisando",termo:e});try{let a=await this.o.pesquisar(e,t.signal);if(r!==this.versao)return;this.o.aoMudar(a.length?{tipo:"resultado",termo:e,itens:a}:{tipo:"vazio",termo:e})}catch(a){if(r!==this.versao||t.signal.aborted)return;this.o.aoMudar({tipo:"erro",termo:e,mensagem:this.o.mensagemDeErro?.(a)??(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar.")})}}};var al=o=>{let e=[];return o.novos&&e.push(`${o.novos} a acrescentar`),o.retirados&&e.push(`${o.retirados} a retirar`),e.join(", ")};function st(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),t=$(o,{titulo:e.titulo,icone:e.icone,largura:560,conteudo:[r]}),a=i=>{let s=new Ar(i.atuais,i.negados),c=l("h3",{class:"spro-p-lupa-titulo"}),d=l("ul",{class:"spro-p-lista-modal","aria-label":`${e.nomePlural} no processo`}),p=l("input",{type:"search",class:"spro-campo",autocomplete:"off","aria-label":`Pesquisar ${e.nome} para adicionar`,"aria-controls":"spro-p-lupa-resultados",placeholder:"Pesquisar\u2026"}),g=l("div",{class:"spro-p-nota spro-p-lupa-estado",role:"status","aria-live":"polite"}),m=l("ul",{class:"spro-p-lista-modal spro-p-resultados",id:"spro-p-lupa-resultados","aria-label":"Resultados da pesquisa"}),u=l("span",{class:"spro-p-nota spro-p-lupa-situacao","aria-live":"polite"}),f=Z("Salvar",()=>void S()),v={tipo:"ocioso"},h=()=>{let P=s.linhas(),E=s.contagem();c.textContent=`No processo (${E.atuais+E.novos})`,d.replaceChildren(...P.length?P.map(C=>{let N;if(C.negadoPor)N=l("span",{class:"spro-p-chip"},`Acrescentado por ${C.negadoPor}`);else{let F=l("button",C.estado==="novo"?{type:"button",class:"spro-p-acao perigo","aria-label":`Desfazer a inclus\xE3o de ${C.item.texto}`}:{type:"button",class:"spro-p-acao perigo","aria-pressed":String(C.estado==="retirado"),"aria-label":`${C.estado==="retirado"?"Manter":"Retirar"} ${C.item.texto}`},C.estado==="novo"?"Desfazer":C.estado==="retirado"?"Manter":"Retirar");F.addEventListener("click",()=>{C.estado==="novo"?s.removerNovo(C.item.id):s.alternarRetirada(C.item.id),b()}),N=F}return l("li",{class:"spro-p-linha-modal","data-estado":C.estado},C.estado==="novo"?l("span",{class:"spro-p-chip ok"},"Novo"):null,l("span",{class:"spro-p-texto-modal"},C.item.texto),N)}):[l("li",{class:"spro-p-vazio"},`O processo n\xE3o tem ${e.nomePlural}.`)]),f.disabled=!s.mudou(),u.textContent=al(E)},A=P=>{if(v=P,m.replaceChildren(),m.removeAttribute("aria-busy"),P.tipo==="ocioso")g.textContent=e.dica;else if(P.tipo==="curto")g.textContent=`Digite mais ${P.falta===1?"1 letra":`${P.falta} letras`} para pesquisar.`;else if(P.tipo==="pesquisando")g.textContent="Pesquisando\u2026",m.setAttribute("aria-busy","true");else if(P.tipo==="vazio")g.textContent=`Nenhum resultado para \u201C${P.termo}\u201D.`;else if(P.tipo==="erro"){let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>D.repetir(p.value)),g.replaceChildren(M("alerta",13),` ${P.mensagem} `,E)}else{g.textContent=P.itens.length===1?"1 resultado.":`${P.itens.length} resultados.`;for(let E of P.itens){let C=s.tem(E.id),N=l("button",{type:"button",class:"spro-p-acao","aria-label":C?`${E.texto} (j\xE1 est\xE1 no processo)`:`Adicionar ${E.texto}`},C?"No processo":"Adicionar");N.disabled=C,N.addEventListener("click",()=>{s.adicionar(E)&&(b(),A(v),m.querySelector("button:not([disabled])")?.focus())}),m.append(l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},E.texto),N))}return}},b=()=>h(),D=new Er({pesquisar:i.pesquisar,aoMudar:A,mensagemDeErro:Io,...e.esperaMs!==void 0?{esperaMs:e.esperaMs}:{}});p.addEventListener("input",()=>D.digitou(p.value)),p.addEventListener("keydown",P=>{if(P.key==="Enter")P.preventDefault(),D.agora(p.value);else if(P.key==="ArrowDown"){let E=m.querySelector("button:not([disabled])");E&&(P.preventDefault(),E.focus())}}),m.addEventListener("keydown",P=>{if(P.key!=="ArrowDown"&&P.key!=="ArrowUp")return;let E=[...m.querySelectorAll("button:not([disabled])")],C=E.indexOf(P.target);C<0||(P.preventDefault(),P.key==="ArrowDown"?E[Math.min(C+1,E.length-1)]?.focus():C===0?p.focus():E[C-1]?.focus())}),t.el.addEventListener("close",()=>D.parar());let S=async()=>{let P=s.resultado();if(e.obrigatorio&&!P.length){t.erro(e.obrigatorio);return}await t.gravar(()=>e.gravar(P),[f])&&e.depois()};r.replaceChildren(c,d,l("div",{class:"spro-p-lupa-busca"},l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},`Adicionar ${e.nome}`),p),g,m),W(u,f)),h(),A({tipo:"ocioso"}),p.focus({preventScroll:!0})},n=()=>{r.replaceChildren(l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),e.carregar().then(i=>{t.el.isConnected&&a(i)}).catch(i=>{if(!t.el.isConnected)return;let s=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");s.addEventListener("click",n),r.replaceChildren(l("div",{class:"spro-p-erro",role:"alert"},M("alerta",13),` ${Io(i)} `,s))})};n()}async function jn(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var Wn=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function Xn(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=Z("Salvar",()=>void n()),a=$(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[go("Especifica\xE7\xE3o",r),W(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function Yn(o,e){let r=Wn("Carregando os tipos de processo\u2026"),t=$(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[r]});jn(o,t,r,a=>{let n=a.tipoAtual??a.tipos.find(c=>c.texto===e)?.valor,i=zo(a.tipos,n,"tipos de processo"),s=Z("Salvar",async()=>{if(!i.valor()){t.erro("Escolha um tipo.");return}await t.gravar(()=>o.op.alterarProcesso({tipo:i.valor()}),[s])&&o.recarregar("dadosProcesso")});r.replaceChildren(go("Tipo de processo",i.el),W(s))})}function Kn(o){let e=Wn("Carregando o formul\xE1rio do processo\u2026"),r=$(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});jn(o,r,e,async t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(m=>l("button",{type:"button",role:"radio","aria-checked":String(m===a),"data-nivel":m},m==="publico"?"P\xFAblico":"Restrito")),i=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"}),c=null,d=[],p=async()=>{if(!c){s.replaceChildren(l("p",{class:"spro-p-nota"},"Carregando as hip\xF3teses legais\u2026"));try{d=await t.hipoteses("1"),c=zo(d,t.hipoteseAtual,"hip\xF3teses legais"),s.replaceChildren(go("Hip\xF3tese legal",c.el))}catch(m){s.replaceChildren(),r.erro(m instanceof Error?m.message:"N\xE3o foi poss\xEDvel carregar as hip\xF3teses legais.")}}};for(let m of n)m.addEventListener("click",()=>{a=m.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let u of n)u.setAttribute("aria-checked",String(u===m));s.hidden=a!=="restrito",a==="restrito"&&p()});let g=Z("Salvar",async()=>{if(a==="restrito"&&!c?.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:c?.valor()??""}:{nivel:a}),[g])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,s,W(g)),a==="restrito"&&await p()})}function Jn(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=Z("Salvar",()=>void n()),a=$(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[go("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),W(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}var Zn=(o,e)=>async()=>{let r=await o.op.formularioDoProcesso();return e==="assuntos"?{atuais:r.assuntos,negados:r.assuntosNegados,pesquisar:(t,a)=>r.pesquisarAssuntos(t,a)}:{atuais:r.interessados,negados:r.interessadosNegados,pesquisar:(t,a)=>r.pesquisarContatos(t,a)}};function Qn(o){st(o,{titulo:"Interessados do processo",icone:"pessoa",nome:"interessado",nomePlural:"interessados",dica:"Digite o nome do contato para pesquisar.",carregar:Zn(o,"interessados"),gravar:e=>o.op.alterarProcesso({interessados:e}),depois:()=>o.recarregar("dadosProcesso")})}function oi(o){st(o,{titulo:"Assuntos do processo",icone:"etiqueta",nome:"assunto",nomePlural:"assuntos",dica:"Digite o c\xF3digo ou parte da descri\xE7\xE3o do assunto.",carregar:Zn(o,"assuntos"),gravar:e=>o.op.alterarProcesso({assuntos:e}),depois:()=>o.recarregar("dadosProcesso"),obrigatorio:"O processo precisa ter ao menos um assunto."})}var _o=o=>{let e=X(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},pe=o=>!o.sigiloso&&!!_o(o)?.editavel;async function Pr(o,e){let r=_o(o);if(!r)return;let t=!lo(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:Ra(r.especificacao,e).slice(0,100)});H(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){H(o,So(a),7e3)}o.recarregar("dadosProcesso")}function yr(o,e,r=2){let t=X(o,"dadosProcesso");return Ao(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[de(a.motivo,"Este dado")],r)}var ei={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"documento",desenhar(o){let e=X(o,"dadosProcesso"),r=_o(o),t=[];return r&&pe(o)&&(t.push({icone:"alerta",rotulo:lo(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:lo(r.especificacao,"URGENTE"),aoClicar:()=>void Pr(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:lo(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:lo(r.especificacao,"TRANCADO"),aoClicar:()=>void Pr(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>Xn(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:yr(o,a=>[eo(oo(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${lo(a.valor.especificacao,"URGENTE")?"urgente":""} ${lo(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},ri={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"pasta",desenhar(o){let e=_o(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&pe(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>Yn(o,r)}]:[],corpo:[eo(oo(o,r||"(n\xE3o informado)"))]}}}},ti={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"cadeado",desenhar(o){let e=_o(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":Sa.publico;return{estado:"pronto",desenho:{acoes:e&&pe(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>Kn(o)}]:[],corpo:[eo(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},M(wa[r],13)),oo(o,a))]}}}},ai={tipo:"interessados",titulo:"Interessados",icone:"pessoa",desenhar(o){return{estado:X(o,"dadosProcesso").estado,desenho:{acoes:_o(o)&&pe(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>Qn(o)}]:[],corpo:yr(o,r=>r.valor.interessados.length?r.valor.interessados.map((t,a)=>{let n=r.valor.interessadosItens?.[a],i=n&&n.texto===t?n.id:void 0;return l("div",{class:"spro-p-linha interessado"},...Ua(t).map(s=>oo(o,s)),l("button",{type:"button",class:"spro-p-acao spro-p-proc-do-interessado","aria-label":`Processos de ${t}`,onclick:()=>Bn(o,{nome:t,...i?{id:i}:{},...r.valor.idTipo?{tipo:r.valor.idTipo}:{},...r.valor.tipo?{tipoNome:r.valor.tipo}:{}})},M("busca",14)))}):[Vo("Sem interessados.")])}}}},ni={tipo:"assuntos",titulo:"Assuntos",icone:"etiqueta",desenhar(o){return{estado:X(o,"dadosProcesso").estado,desenho:{acoes:_o(o)&&pe(o)?[{icone:"lapis",rotulo:"Editar assuntos",aoClicar:()=>oi(o)}]:[],corpo:yr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>eo(oo(o,t))):[Vo("Sem assuntos.")])}}}},ii={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"nota",desenhar(o){let e=X(o,"dadosProcesso"),r=_o(o);return{estado:e.estado,desenho:{acoes:r&&pe(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>Jn(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:yr(o,t=>{let a=$a(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>eo(oo(o,`${n.unidade}: ${n.observacao}`))):[ko("Sem observa\xE7\xF5es.")]})}}}};var nl=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function ct(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},"Carregando os marcadores\u2026")),t=$(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});o.op.opcoesMarcador().then(a=>{t.el.isConnected&&il(o,t,r,a,e)}).catch(a=>{t.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar os marcadores."),r.replaceChildren()})}function il(o,e,r,t,a){let n=a?Se(a.texto):{prazo:null,texto:""},i=zo(t,a?t.find(v=>v.texto===a.nome)?.valor:void 0,"marcadores"),s=bo("Controlar prazo",!!n.prazo,v=>g.hidden=!v),c=bo("Controlar vencimento (\u201CAt\xE9\u201D)",!!n.prazo?.vencimento,()=>{}),d=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});d.value=n.prazo?.data??nl(o.agora());let p=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});p.value=n.prazo?.hora??"23:59";let g=l("div",{class:"spro-p-grade",hidden:!n.prazo},c.el,l("div",{class:"spro-p-par"},d,p)),m=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});m.value=n.texto;let u=Z("Salvar",()=>void f()),f=async()=>{let v=t.find(b=>b.valor===i.valor());if(!v){e.erro("Escolha um marcador.");return}if(s.input.checked&&!d.value){e.erro("Informe a data do prazo.");return}let h=Oa({prazo:s.input.checked?{data:d.value,hora:p.value||"23:59",vencimento:c.input.checked}:null,texto:m.value}),A=await e.gravar(async()=>(a&&v.texto!==a.nome&&await o.op.desmarcar(a.nome),o.op.marcar({marcador:v.texto,texto:h})),[u]);return o.recarregar("marcador"),A};nr(r,go("Marcador",i.el),a?l("p",{class:"spro-p-nota"},M("etiqueta",12),` Atual: ${a.nome}. Escolher outro troca o marcador.`):null,s.el,g,go("Texto",m),W(u))}function sl(o,e){let{prazo:r}=Se(e);if(!r)return null;let t=ee(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},M("relogio",11),`${r.vencimento?"at\xE9 ":""}${rr(r)} \xB7 ${t.rotulo}`)}async function cl(o,e){if(await te(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);H(o,r.resumo)}catch(r){H(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function ll(o,e,r){let{texto:t}=Se(e.texto),a=e.icone?l("img",{class:"spro-p-marcador-icone",src:e.icone,alt:""}):M("etiqueta",14);return eo(l("div",{class:"spro-p-marcador"},oo(o,e.nome,"forte",a),sl(o,e.texto),t?oo(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},ce({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>ct(o,e)}),ce({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void cl(o,e)})):null)}var si={tipo:"marcador",titulo:"Marcador",icone:"etiqueta",desenhar(o){let e=X(o,"marcador"),r=Ta(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>ct(o)}]:[],corpo:[...Ao(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>ll(o,a,t.editavel)):[Vo("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},M("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var ci=[$n,zn,Hn,si,Rn,ei,ri,ti,ai,ni,ii];var li=1e4;function ue(o){if(!o.getElementById("frmArvore"))return null;try{return qr(qo(o))}catch{return null}}function Re(o,e=li){return new Promise(r=>{let t=ue(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=m=>{i||(i=!0,d?.disconnect(),clearTimeout(g),clearInterval(p),r(m))},c=()=>{let m=ue(o);m&&s(m)},d=typeof n=="function"&&o.documentElement?new n(c):null;d?.observe(o.documentElement,{childList:!0,subtree:!0});let p=setInterval(c,250),g=setTimeout(()=>s(null),e)})}var pi="data-spro-processo-raiz";function dl(o){for(let e of o.querySelectorAll(`[${pi}], [data-spro-slot="atividades"]`))e.remove()}function ui(o){return ci.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&wn.has(e.tipo)))}function mi(o){let e=new Set;for(let r of ui(o))for(let t of tt[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function di(o){let e=o.doc;ho(e),dl(e);let r=e.getElementById("frmArvore")??e.body,t=po(e),a=(b="")=>l("div",{class:`spro-p-raiz ${b}`.trim(),[pi]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let d=e.getElementById("divRelacionados");d?d.before(s):i.after(s),r.append(n);let p=new Map,g=ui(o),m=b=>rt.indexOf(b);for(let b of g){let D=Sn({tipo:b.tipo,titulo:b.titulo,icone:b.icone,aberto:On(o.armazenamento,b.tipo),aoAlternar:S=>Tn(o.armazenamento,b.tipo,S)});p.set(b.tipo,{def:b,casca:D})}for(let b of[...rt].sort((D,S)=>m(D)-m(S))){let D=p.get(b);D&&n.append(D.casca.el)}let u=p.get("anotacoes");u&&i.append(u.casca.el);let f=b=>{let D=p.get(b);if(!D)return;let S;try{S=D.def.desenhar(o)}catch(P){console.warn(`[SEI Pro] painel ${b}:`,P),S=null}D.casca.el.hidden=S===null,S&&D.casca.atualizar(S.estado,S.desenho)},v=b=>{if(b)f(b);else for(let D of p.keys())f(D)},h=o.loja.aoMudar(b=>{for(let[D,S]of p)tt[S.def.tipo].includes(b)&&f(D)});v();let A=re(e,()=>{let b=po(e);for(let D of[n,i])b?D.setAttribute("data-tema","escuro"):D.removeAttribute("data-tema")});return{raiz:n,redesenhar:v,desmontar(){h(),A(),n.remove(),i.remove(),s.remove()}}}function gi(o,e,r={}){let t=di(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=di(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}var pl="seipro-historico-sessao",lt="seiProHistoricoRestauro",ul=600*1e3,fi;function dt(){if(fi!==void 0)return fi;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function hi(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};dt()?.setItem(lt,JSON.stringify(t))}catch{}}function Dr(){try{dt()?.removeItem(lt)}catch{}}function pt(o,e=Date.now()){try{let r=dt()?.getItem(lt);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>ul?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var vi=Promise.resolve();function bi(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return r.request(pl,e?{signal:e}:{},o).catch(n=>{throw Do(n)});let t=vi.then(()=>{if(e?.aborted)throw Do(new DOMException("cancelado","AbortError"));return o()});return vi=t.catch(()=>{}),t}var ml={resumido:"R",completo:"P",total:"T"};var gl=2e3;function xi(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function fl(o){let e=[...o.querySelectorAll("td")],r=I(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=I(e[3]),i={data:r,unidade:I(e[1]),...t?{unidadeNome:t}:{},usuario:I(e[2]),descricao:n},s=ir(r);s&&(i.dataISO=s),a&&(i.usuarioNome=a),o.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let d=I(c);/^\d+$/.test(d)&&(i.nrSei=d);let p=z(c.getAttribute("href")??"").get("id_documento");p&&(i.idDocumento=p)}if(xi(n).startsWith(xi(io.remetidoPrefixo))){let d=e[3]?.querySelector("a.ancoraSigla"),p=I(d);p&&(i.unidadeCitada=p);let g=d?.getAttribute("title")??"";g&&(i.unidadeCitadaNome=g)}return i}function ut(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(I(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(fl),total:r}}function vl(o){if(o.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=K(o,"procedimento_consultar_historico")??B(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new y("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function ge(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function mt(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(I(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function Ai(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function hl(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let i=0;i<=a&&i+n<=t.length;i+=1){let s=!0;for(let c=0;c<n;c+=1)if(Ai(t[i+c])!==Ai(o.andamentos[c])){s=!1;break}if(s)return[...t.slice(0,i),...o.andamentos]}return null}async function bl(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=xl(o,t,r);return a||await bi(()=>Al(o,e,r),r.sinal)}catch(t){throw Do(t)}}function xl(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(ge(e,"hdnTipoHistorico")||"R")!==r.tipo||(ge(e,"hdnInfraPaginaAtual")||"0")!=="0"||pt(o.http.base.host))return null;let{itens:t,total:a}=ut(e);return mt(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:ge(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Ei(o,e,r){await R.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function Al(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new y("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",I(a.doc.querySelector("title")));let n=pt(t);if(n){try{await Ei(o,a,n),Dr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let i={tipo:ge(a,"hdnTipoHistorico")||"R",pagina:ge(a,"hdnInfraPaginaAtual")||"0"},s=i,c=!1,d=async(p,g)=>{c||(hi(t,i),c=!0);let m={tipo:r.tipo,pagina:String(g)},u=await R.de(p,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:m.tipo,hdnInfraPaginaAtual:m.pagina}).enviar({sinal:r.sinal});return s=m,u};try{let p=i.tipo===r.tipo&&i.pagina==="0"?a:await d(a,0);if(!p.doc.querySelector("#tblHistorico"))throw new y("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",I(p.doc.querySelector("title")));let g=ut(p),m=ge(p,"hdnInfraHashCriterios"),u=g.total,f=u?Math.min(u,r.limite):r.limite,v=hl(r.cache,m,u,g.itens);if(v)return r.aoProgresso?.(1,1),{andamentos:v,total:u,hash:m,completo:!0,aproveitouCache:!0};let h=[...g.itens],A=g.itens.length,b=p.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,D=b>0?b:u>A&&A>0?Math.ceil(u/A):1;r.aoProgresso?.(1,D);for(let P=1;h.length<f&&mt(p)&&P<gl;P+=1){p=await d(p,P);let E=ut(p);if(!E.itens.length)break;h.push(...E.itens),r.aoProgresso?.(P+1,Math.max(D,P+1))}let S=u?h.length>=u:!mt(p);return{andamentos:h,total:u||h.length,hash:m,completo:S,aproveitouCache:!1}}finally{if(c)if(s.tipo!==i.tipo||s.pagina!==i.pagina)try{await Ei(o,a,i),Dr()}catch{}else Dr()}}var me=new Map;function El(o,e){return`${o.http.base.host}|${z(e).get("id_procedimento")??e}`}function Pl(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new y("CANCELADO","Opera\xE7\xE3o cancelada."));let t=El(o,e),a=me.get(t);if(!a){let i=new AbortController,s=new Set,c={promessa:void 0,controle:i,interessados:0,progresso:s,ultimo:null};c.promessa=bl(o,e,{tipo:ml.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:i.signal,cache:r.cache,aoProgresso:(d,p)=>{c.ultimo=[d,p];for(let g of s)g(d,p)}}).finally(()=>{me.get(t)===c&&me.delete(t)}),c.promessa.catch(()=>{}),me.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((i,s)=>{let c=!1,d=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",p)},p=()=>{if(c)return;d(),n.interessados-=1;let g=new y("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){s(g);return}me.get(t)===n&&me.delete(t),n.controle.abort(),n.promessa.then(()=>s(g),()=>s(g))};r.sinal?.addEventListener("abort",p,{once:!0}),n.promessa.then(g=>{c||(d(),i(g))},g=>{c||(d(),s(Do(g)))})})}function Pi(o,e,r={}){return Pl(o,vl(e),r)}var Ro=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}somar(e){this.porId.has(e.id)||this.porId.set(e.id,e)}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Xt({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(yl(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function Co(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function yl(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function Di(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function wi(o,e,r){let t=K(o,e);if(!t)throw new y("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Si=o=>e=>z(e.url).get("acao")!==o;async function Dl(o,e,r,t){let a=await o.http.obter(wi(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return R.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>B(a.html,i)).find(Boolean);if(!n)throw new y("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return R.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function gt(o,e,r,t){let a=await Di(o,e,t.sinal),n=await Dl(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??Si(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function wr(o,e,r,t){return gt(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=J("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...J("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Ii(o,e,r,t){return gt(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(d=>d.valor===a.valor("selAtribuicao")&&d.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=ao(r),s=a.opcoes("selAtribuicao").filter(d=>d.valor!=="null"),c=s.find(d=>d.valor===r)??s.find(d=>ao(d.texto.split(" - ")[0])===i)??s.find(d=>ao(d.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(d=>ao(d.texto).includes(i)).length===1?s.find(d=>ao(d.texto).includes(i)):void 0);if(!c)throw new y("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(d=>d.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),J("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function Ci(o,e,r,t){return gt(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(d=>d.valor===a.valor("selGrupoAcompanhamento")&&d.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...J("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...J("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function wl(o,e,r){let t=wi(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function yi(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:I(t[1]),texto:I(t[2]),usuario:I(t[3]),data:I(t[4])}})}async function ft(o,e,r,t){let a=await Di(o,e,t.sinal),n=await wl(o,a,t.sinal),i=yi(n),s=ao(r.marcador),c=i.find(m=>ao(m.marcador)===s),d={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...d,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(d.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...d,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let m=B(n.html,"andamento_marcador_remover");if(!m)throw new y("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let u=R.de(n,"#frmGerenciarMarcador",o.http);u.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let f=await o.http.enviar(m,u.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(yi(f).some(v=>v.id===c.id))throw new y("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...d,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let p;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))p=R.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let m=B(n.html,"andamento_marcador_cadastrar");if(!m)throw new y("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");p=await R.abrir(o.http,m,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let g=p.escolher("selMarcador",r.marcador);return p.definir({hdnIdMarcador:g.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),d.mudancas=c?J(`Texto do marcador ${g.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${g.texto}${r.texto?`: ${r.texto}`:""}`}],d.mudancas.length?t.aplicar?(await p.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Si("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...d,aplicado:!0,resumo:`Marcador "${g.texto}" aplicado em ${a.protocolo}.`}):{...d,resumo:`Vai marcar ${a.protocolo} com "${g.texto}".`}:{...d,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function Sl(o){let e=I(o.doc.querySelector(".pesquisaBarra")),r=Number((/de\s+([\d.]+)\s*$/.exec(e)??/([\d.]+)\s+resultados?\s*$/i.exec(e)??[])[1]?.replace(/\./g,"")??0),t=[];for(let a of o.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")){let n=a.querySelector("td.pesquisaTituloEsquerda"),i=[...n?.querySelectorAll("a.protocoloNormal")??[]].find(h=>(h.getAttribute("href")??"").includes("procedimento_trabalhar")),s=a.querySelector("td.pesquisaTituloDireita a"),c=a.nextElementSibling,d=c?.nextElementSibling,p=h=>I([...d?.querySelectorAll("td.pesquisaMetatag")??[]].find(A=>I(A).startsWith(h))).replace(/^[^:]+:\s*/,""),g=s?.getAttribute("title")??"",m=h=>[...d?.querySelectorAll("td.pesquisaMetatag")??[]].find(A=>I(A).startsWith(h))?.querySelector("a"),u=m("Unidade"),f=m("Usu"),v=z(i?.getAttribute("href")??"").get("id_procedimento")??void 0;t.push({protocolo:I(i),...v?{idProcedimento:v}:{},tipoProcesso:i?.getAttribute("title")??I(n?.querySelector("span")).replace(/\s*N\u00BA\s*$/,""),...s?{documento:{numero:I(s),tipo:g}}:{},trecho:I(c?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/,""),unidade:p("Unidade"),...u?.getAttribute("title")?{unidadeNome:u.getAttribute("title")}:{},usuario:p("Usu"),...f?.getAttribute("title")?{usuarioNome:f.getAttribute("title")}:{},data:p("Inclus")||p("Data")})}return{itens:t,total:r||t.length}}async function Mi(o,e,r){if(!e.interessadoId)throw new y("ARGUMENTO_INVALIDO","Informe o interessado.");let t=Math.max(0,Math.floor(e.inicio??0)),a=await R.abrir(o.http,o.linkMenu("protocolo_pesquisar"),"#frmPesquisaProtocolo",{sinal:r});a.definir({rdoPesquisarEm:"P",hdnIdContato:e.interessadoId,chkSinTramitacao:e.tramitadoNaUnidade?"S":null,hdnInicio:String(t)}),e.tipoProcesso&&a.escolher("selTipoProcedimentoPesquisa",e.tipoProcesso);let n=await a.enviar({sinal:r,botao:"sbmPesquisar",aceitarValidacao:!0}),i=z(n.url).get("acao");if(i==="procedimento_trabalhar"){let d=I(n.doc.querySelector("title")).replace(/^SEI\s*-\s*/,""),p=z(n.url).get("id_procedimento")??void 0;return{total:1,inicio:0,processos:[{protocolo:d,...p?{idProcedimento:p}:{},tipoProcesso:"",trecho:"",unidade:"",usuario:"",data:""}]}}if(i!=="protocolo_pesquisar")throw new y("SEI_RESPOSTA_INESPERADA","A pesquisa do SEI n\xE3o respondeu como esperado.");let{itens:s,total:c}=Sl(n);return{total:s.length?c:0,inicio:t,processos:s}}function Sr(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function Ti(o,e,r){let t=K(e,"procedimento_alterar"),a=t??K(e,"procedimento_consultar");if(!a)throw new y("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await R.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function fe(o){return o.map(e=>e.texto).filter(Boolean)}var Il={0:"publico",1:"restrito",2:"sigiloso"};async function Li(o,e,r){let{form:t,editavel:a}=await Ti(o,e,r),n=Il[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:Sr(t,"selHipoteseLegal").trim()||e.hipotese,s=(t.valor("hdnIdTipoProcedimento")??"").trim(),c=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...i?{hipotese:i}:{},tipo:Sr(t,"selTipoProcedimento")||e.tipo,...s?{idTipo:s}:{},especificacao:t.valor("txtDescricao")??"",assuntos:fe(t.itensLupa("selAssuntos")),interessados:fe(t.itensLupa("selInteressadosProcedimento")),assuntosItens:t.itensLupa("selAssuntos"),interessadosItens:t.itensLupa("selInteressadosProcedimento"),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:Cl(t),editavel:a,...c?{autuacao:c}:{}}}function Cl(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=I(t[0]);a&&e.push({unidade:a,observacao:I(t[1])})}return e}function Oi(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let i=r.get(n.id);if(i!==void 0&&!a.has(n.id))throw new y("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${i}.`)}}async function Ni(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await Ti(o.http,a,{sinal:t.sinal});if(!i)throw new y("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...J("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let d=Sr(n,"selTipoProcedimento"),p=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:p.valor}),s.push(...J("Tipo",d,p.texto))}if(r.nivel!==void 0){let d=Xo[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:Wo[r.nivel]}),s.push(...J("N\xEDvel de acesso",d,Xo[Wo[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let d=Sr(n,"selHipoteseLegal"),p=n.valor("rdoNivelAcesso")||Wo.restrito,g=Ko(await Yo(o,n,p,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:g.id}),s.push(...J("Hip\xF3tese legal",d,g.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new y("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(s.push(...J("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let d=n.itensLupa("selInteressadosProcedimento");Oi(d,r.interessados,Jo(n.pagina.html,"interessado"),"Interessado"),s.push(...J("Interessados",fe(d).join("; "),fe(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new y("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let d=n.itensLupa("selAssuntos");Oi(d,r.assuntos,Jo(n.pagina.html,"assunto"),"Assunto"),s.push(...J("Assuntos",fe(d).join("; "),fe(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:d=>z(d.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function ki(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>Ii(o,t,n,i)),anotar:n=>a(i=>wr(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await ye(o.http,e);return wr(o,t,{texto:Na(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await ye(o.http,e);return i?wr(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>Ci(o,t,n,i)),marcar:n=>a(i=>ft(o,t,n,i)),desmarcar:n=>a(i=>ft(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>Ni(o,t,n,i)),opcoesAtribuicao:()=>sa(o.http,e),opcoesMarcador:()=>ca(o.http,e),opcoesAcompanhamento:()=>la(o.http,e),formularioDoProcesso:()=>da(o,e),processosDoInteressado:(n,i)=>Mi(o,n,i)}}var $e=class extends Be{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function Ir(o,e){return`${o}|${e}`}function Cr(o){let e=Pe(qo(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function _i(o){let e=new $e(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>qo(o.topo)),r=new Ro(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:je(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??ki(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>Pi(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await oe(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}function Ml(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function Ol(o){return async()=>{try{return await o()}catch(e){throw new Error(Io(e))}}}function Ri(o){let e=Tl(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,Ol(t)]))}function Tl(o){let e=je(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await Li(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await ye(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:Ml(o.arv),editavel:!1}:{itens:await ia(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await ta(o.http,o.arv)}:t,atribuicao:async()=>({...aa(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function vt(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function $i(o){o.documentElement?.setAttribute(ua,"1")}function qi(o){o.documentElement?.setAttribute(ma,"1")}function zi(o){o.documentElement?.setAttribute(fa,"1")}function ht(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function Hi(o){o.documentElement?.setAttribute(ga,"1")}function Fi(o){o.documentElement?.setAttribute(va,"1"),o.documentElement?.setAttribute(ha,"1")}function bt(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}function Ui(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}function Mr(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Or=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function qe(o){return Mr(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function Ll(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function Nl(o){return o.externo&&o.formato!=="circular"}function xt(o,e){if(!Ll(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function kl(o){let e=Mr(o);return e?e.split(" "):[]}function _l(o){return Mr(`${o.titulo} ${o.numero}`)}function Rl(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&xt(o,r)||e.externos&&Nl(o)||e.cancelados&&o.cancelado))return!1;let a=kl(e.texto);if(a.length){let n=_l(o);if(!a.every(i=>n.includes(i)))return!1}return!0}function Vi(o,e,r){let t=new Set;for(let a of o.documentos)Rl(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var ve="data-spro-f-oculto";function Bi(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function Gi(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!Bi(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!Bi(r));r=r.nextElementSibling);return e}function $l(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function At(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=$l((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),i=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),s=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:ji(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:i,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:s||void 0,link:"",src:"",acoes:[],botoes:[]}}function ji(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function Wi(o,e,r,t,a){let n=o.getElementById("divArvore"),i={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return i;let s=new Map(e.map(f=>[f.id,f])),c=[],d=new Set;for(let f of n.querySelectorAll('a[id^="anchor"]')){let v=Co(f.id,"anchor");if(!v||v===r)continue;let h=s.get(v)??At(o,v);if(!h)continue;let A=ji(f);c.push({id:v,ancora:f,doc:A===h.pasta?h:{...h,pasta:A}}),A&&d.add(A)}let p=c.map(f=>f.doc),g=qe(t),m=Vi({documentos:p},t,a),u=new Set;if(g){for(let f of c)if(!m.has(f.id))for(let v of Gi(f.ancora))u.add(v)}for(let f of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(f.id))continue;let v=f.id.slice(6);if(i.pastas+=1,!d.has(v)){i.pastasFechadas+=1;continue}if(g&&!m.has(v)){for(let A of Gi(f))u.add(A);let h=o.getElementById(`div${v}`);h&&u.add(h)}}for(let f of Array.from(n.querySelectorAll(`[${ve}]`)))u.has(f)||f.removeAttribute(ve);for(let f of u)f.hasAttribute(ve)||f.setAttribute(ve,"1");return i.total=p.length,i.visiveis=p.filter(f=>m.has(f.id)).length,i}function Xi(o){for(let e of Array.from(o.querySelectorAll(`[${ve}]`)))e.removeAttribute(ve)}function Yi(o,e){return o.filter(r=>xt(r,{unidade:e})).map(r=>({id:r.id,numero:r.numero,titulo:r.titulo}))}function Ki(o){let e=new Map;for(let r of o)!r.nrSei||!r.descricao.startsWith(io.documentoGerado)||e.set(r.nrSei,r.data.slice(0,10));return e}function Ji(o,e){return e?o.map(r=>{let t=e.get(r.numero);return t?{...r,data:t}:r}):[...o]}var Zi="spro-na-nao-assinados",ql=1e4;function zl(o){let e=o.getElementById("divInfraBarraLocalizacao");if(e)return{pai:e,antes:null};let r=o.getElementById("frmAtividadeListar");return r?.parentElement?{pai:r.parentElement,antes:r}:null}function Hl(o,e){let r=o.getElementById(`anchor${e}`);return r?(r.click(),r.scrollIntoView?.({block:"center"}),!0):!1}function Fl(o,e){let r=new Ro(e.documentos);r.lerDoIframe(o);for(let t of o.querySelectorAll("#divArvore a[id^='anchor']")){let a=Co(t.id,"anchor");if(!a||r.obter(a))continue;let n=At(o,a);n&&r.somar(n)}return r.todos()}async function Ul(o,e){let r=o.getElementById(`ancjoin${e}`)??o.getElementById(`anchor${e}`);return r?(r.addEventListener("click",t=>t.preventDefault(),{once:!0,capture:!0}),r.click(),Ia(()=>!!o.querySelector(`#div${e} a[id^="anchor"]:not([id*="AGUARDE"])`),ql)):!1}function Qi(o){let e=zl(o.doc);if(!e||o.doc.getElementById(Zi))return null;ho(o.doc);let r=l("div",{id:Zi,class:"spro-na",role:"status","aria-live":"polite"});po(o.doc)&&r.setAttribute("data-tema","escuro"),e.pai.insertBefore(r,e.antes);let t=o.abrirPasta??Ul,a=!1,n=!1,i=!0,s=()=>l("strong",{},o.unidade),c=(u,f,v,...h)=>{r.className=`spro-na ${u}`,r.replaceChildren(l("span",{class:"spro-na-icone","aria-hidden":"true"},M(f,15)),l("span",{},...v),...h)},d=(u,f)=>{let v=l("button",{type:"button",class:"spro-p-link"},u);return v.addEventListener("click",f),v},p=async(u,f)=>{if(!n){n=!0;try{for(let[v,h]of f.entries())c("falha","atualizar",[`Abrindo as pastas da \xE1rvore (${v+1} de ${f.length})...`]),await t(u,h)}finally{n=!1}i=!0,m()}},g=(u,f,v)=>{if(a)return;a=!0;let h=l("ul",{class:"spro-p-lista-modal spro-na-lista","aria-label":"Documentos n\xE3o assinados"}),A=S=>h.replaceChildren(...S.map(P=>{let E=l("button",{type:"button",class:"spro-p-link","aria-label":`Selecionar na \xE1rvore: ${P.titulo} (${P.numero})`},M("documento",14),`${P.titulo} (${P.numero})`);return E.addEventListener("click",()=>{D.fechar(),Hl(f,P.id)}),l("li",{class:"spro-p-linha-modal"},E,P.data?l("span",{class:"spro-na-data"},P.data):null)}));A(u);let b=d("Verificar pastas",()=>{D.fechar(),p(f,v)}),D=$({topo:o.topo,doc:o.doc},{titulo:"Documentos pendentes de assinatura",icone:"caneta",largura:700,conteudo:[l("p",{class:"spro-p-nota"},u.length===1?`Existe 1 documento n\xE3o assinado na unidade ${o.unidade}.`:`Existem ${u.length} documentos n\xE3o assinados na unidade ${o.unidade}.`),h,v.length>0?l("p",{class:"spro-p-nota"},`${v.length===1?"1 pasta fechada n\xE3o foi verificada":`${v.length} pastas fechadas n\xE3o foram verificadas`}: o SEI s\xF3 traz os documentos de uma pasta quando ela \xE9 aberta. `,b):null],aoFechar:()=>{a=!1}});o.datas().then(S=>{S&&D.el.isConnected&&A(Ji(u,S))})},m=()=>{if(n)return;let u=o.quadroDaArvore(),f=u?o.lerArvore(u):null;if(!u||!f){c("falha","alerta",["N\xE3o foi poss\xEDvel verificar os documentos n\xE3o assinados na unidade ",s()],d("Tentar de novo",m));return}let v=Fl(u,f),h=Yi(v,o.unidade),A=Ui({pagina:f.pagina,documentos:v}),b=A.length===1?"1 pasta fechada ainda n\xE3o foi verificada":`${A.length} pastas fechadas ainda n\xE3o foram verificadas`,D=A.length?d("Verificar pastas",()=>void p(u,A)):null;if(!h.length){D?c("falha","alerta",["Nenhum documento n\xE3o assinado na unidade ",s(),` na \xE1rvore aberta; ${b}`],D):c("ok","check",["Todos os documentos foram assinados na unidade ",s()]);return}c("pendente","alerta",["Existem documentos n\xE3o assinados na unidade ",s()],d("Detalhes",()=>g(h,u,A)),...D?[D]:[]),i&&g(h,u,A),i=!1};return m(),{verificar:m,remover:()=>r.remove()}}function es(o){return o!==o.top&&/[?&]acao=procedimento_enviar(&|$)/.test(o.location.search)}function os(o){try{return o.getElementById("ifrArvore")?.contentDocument??null}catch{return null}}async function rs(o=document){if(!o.getElementById("frmAtividadeListar"))return null;let{dataValues:e}=await chrome.storage.sync.get("dataValues");if(!yo(e,ba))return null;let r=Ve(),t=os(r),a=t?ue(t)??await Re(t,5e3):null,n=Cr(r);return Qi({doc:o,topo:r,quadroDaArvore:()=>os(r),lerArvore:i=>ue(i),unidade:n.unidade.sigla,datas:async()=>{if(!a||a.nivel==="sigiloso"||!n.login)return null;let i=new se(He(chrome.storage.local,"local"),Ir(n.host,n.login),a.idProcedimento),s=await Qo({loja:i,agora:()=>new Date,sigiloso:!1});return s?.vale?Ki(s.historico.andamentos):null}})}var Vl=90,ts=120,as=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function Bl(o,e){if(!e)return{principal:"",dica:""};let r=o.total===1?"documento":"documentos",t=o.visiveis===0?`Nenhum documento encontrado (${o.total} na \xE1rvore).`:`${o.visiveis} de ${o.total} ${r}`,a=o.pastasFechadas>0?"Pastas fechadas n\xE3o entram: abra-as para filtrar os documentos delas.":"";return{principal:t,dica:a}}function Gl(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},M("fechar",12)),r=new Map;for(let i of as)r.set(i.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":i.chave,"aria-pressed":"false","aria-label":`${i.rotulo}. ${i.ajuda}`},i.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-dica"});return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},M("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,a)),busca:o,limpar:e,chips:r,status:t,dica:a}}function ns(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;ho(r);let a=Gl(),n={...Or},i={visiveis:0,total:0,pastasFechadas:0,pastas:0},s,c,d=!1,p=()=>{let E=r.getElementById("divArvore");E?.parentElement&&(a.raiz.parentElement!==E.parentElement||a.raiz.nextElementSibling!==E)&&E.parentElement.insertBefore(a.raiz,E)},g=()=>{po(r)?a.raiz.setAttribute("data-tema","escuro"):a.raiz.removeAttribute("data-tema")},m=()=>{let E=qe(n);for(let F of as)a.chips.get(F.chave)?.setAttribute("aria-pressed",n[F.chave]?"true":"false");a.busca.value!==n.texto&&(a.busca.value=n.texto),a.limpar.hidden=!E;let{principal:C,dica:N}=Bl(i,E);(a.status.textContent!==C||a.dica.textContent!==N)&&(a.status.textContent=C,a.dica.textContent=N),a.status.parentElement.hidden=!E,a.raiz.toggleAttribute("data-ativo",E),a.raiz.hidden=i.total===0&&i.pastas===0&&!E},u=()=>(i=Wi(r,o.documentos.todos(),o.idProcedimento,n,{unidade:o.unidade.sigla}),m(),i),f=0,v=()=>{if(d)return;p();let E=Date.now();E-f>=ts&&(f=E,u()),clearTimeout(c),c=setTimeout(()=>{d||(f=Date.now(),p(),u())},ts)},h=E=>{n={...n,...E},u()};a.busca.addEventListener("input",()=>{n={...n,texto:a.busca.value},clearTimeout(s),s=setTimeout(()=>{d||u()},Vl)}),a.busca.addEventListener("keydown",E=>{E.key==="Escape"&&qe(n)&&(E.preventDefault(),E.stopPropagation(),A())});for(let[E,C]of a.chips)C.addEventListener("click",()=>h({[E]:!n[E]}));let A=()=>{clearTimeout(s),n={...Or},u(),a.busca.focus()};a.limpar.addEventListener("click",A);let b=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,D=r.getElementById("frmArvore")??t.parentElement,S=typeof b=="function"?new b(E=>{a.raiz.isConnected&&E.every(N=>a.raiz.contains(N.target)||N.addedNodes.length+N.removedNodes.length>0&&[...N.addedNodes,...N.removedNodes].every(F=>F===a.raiz))||v()}):null;S?.observe(D,{childList:!0,subtree:!0});let P=re(r,g);return p(),g(),u(),{estado:()=>({...n}),definir:h,limpar:()=>{clearTimeout(s),n={...Or},u()},reaplicar:u,barra:()=>a.raiz,destruir:()=>{d=!0,clearTimeout(s),clearTimeout(c),S?.disconnect(),P(),Xi(r),a.raiz.remove()}}}var Tr=["Copiar","Abrir","Acoes"],Et={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},so={tipo:"local"},_=(...o)=>({tipo:"acao",acoes:o}),Mo=(...o)=>({tipo:"funcao",funcoes:o}),Lr=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:so,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:so,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:so,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:so,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:so,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:so,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:so,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:_("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:_("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:_("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:_("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:_("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:_("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:_("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Mo("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Mo("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Mo("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:_("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Mo("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Mo("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:_("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:_("md_pet_intimacao_cadastrar")}],is=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:so},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:so},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:so},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:so},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:so},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:so},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:_("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:_("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:_("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:_("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:_("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:_("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:_("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:_("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:_("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:_("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:_("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:_("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:_("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:_("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:_("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:_("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:_("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:_("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Mo("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Mo("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Mo("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Mo("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:_("arvore_ordenar")}],Nr="Ativar menu ao clicar",ss=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],cs=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],ls=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],jl={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},Wl=o=>jl[o]??o;function ds(o,e){let r=Wl(e);return o.find(t=>t.nome===r)}var hv=Lr.filter(o=>o.modo).map(o=>o.nome);function ps(o){return o.includes(" ")?o.split(" ").pop()??"":""}function he(o){let e=ps(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function us(o){let e=o.trim(),r=ps(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function ms(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var Xl=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),Pt=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),yt=(o,e)=>`<a href="${Xl(o)}" target="_blank">${Pt(e)}</a>`,gs=o=>({texto:he(o.rotulo)});function fs(o){let e=he(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${us(o.rotulo)} (${ms(o.citacaoOpcao)}${e})`}}var vs=o=>({texto:o.linkDocumento});function hs(o){let e=he(o.rotulo);return{texto:e,html:yt(o.linkDocumento,e)}}function bs(o){let e=he(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:yt(o.linkDocumento,e)};let r=us(o.rotulo),t=ms(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${Pt(r)} (${Pt(t)}${yt(o.linkDocumento,e)})`}}var xs=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function Dt(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function As(o){return Tr.flatMap(e=>o.filter(r=>r.grupo===e))}function wt(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===Nr)continue;let i=ds(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var Es=(o,e)=>{for(let r of e){let t=B([...o],r);if(t)return t}return null};function Ps(o,e){return e.find(r=>o?.includes(r))??null}var ys={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function Yl(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var Kl=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function Jl(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:Dt(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(gs(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(fs(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(vs(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(hs(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(bs(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let d=c??(s?"processo fechado":void 0);return{desativado:!!d||void 0,dica:d,executar:async()=>{let p=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!p)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let g=!1;if(/minuta/i.test(e.rotulo)){let m=await t.perguntarMinuta();if(!m)return;g=m==="remover"}await t.duplicar(p,g)}}}default:return{executar:()=>{}}}}function Ds(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||he(e.rotulo))||Kl.has(o.id)&&e.id.includes("-")?null:{...t,...Jl(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let p=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(p,Yl(e))}:{...t,executar:()=>a.abrirEmNovaAba(p)}}if(i.tipo==="acao"){let p=Es(n.acoes,i.acoes);return p?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(p)}:{...t,executar:()=>a.abrirNoVisualizador(p)}:null}let s=Ps(n.funcoes,i.funcoes);if(!s)return null;let c=ys[s];if(!c)return null;let d=async p=>{let g=await a.linkDaTela(n.link,c);if(!g)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);p==="aba"?a.abrirEmNovaAba(g):a.abrirNoVisualizador(g)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await d("visualizador")}};case"ciencia":return{...t,executar:()=>d("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>d("aba")};default:return{...t,executar:()=>d("aba")}}}function ws(o,e){let r=[];for(let t of wt(Lr,e.selecao,ss)){let a=Ds(t,o,e);a&&r.push(a)}return As(r)}function kr(o,e,r){let t=[];for(let a of wt(Lr,r,ls)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=Ds(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function Ss(o){let e=o.servicos,r=[],t=Dt(o.base,o.idProcedimento);for(let a of wt(is,o.selecao,cs)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:xs(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=Es(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=Ps(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=ys[s];if(!c)continue;r.push({...n,executar:async()=>{let d=await e.linkDaTela(o.linkProcesso,c);if(!d)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(d):e.abrirNoVisualizador(d)}})}}return As(r)}var ze="spro-pm-icone",Is="data-spro-pm-sig",Cs=["breackline_doc"];function Zl(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function Ql(o,e){return l("span",{class:`action-doc action-${o.modo} ${ze}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},M(o.icone,13))}function od(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(ze))a.push(i);else{if(Cs.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(Is)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Cs.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=Ql(i,e);s.setAttribute(Is,t),n.after(s),n=s}return!0}function Ms(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let d=Co(c.id,"anchor");if(!d||d===e||!o.getElementById(`anchorImg${d}`))continue;let p=r(d,Zl(c)),g=kr(p,i,s);od(c,d,g)&&(n+=1)}return n}function Os(o){for(let e of o.querySelectorAll(`.${ze}`))e.remove()}function Ts(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let d=m=>{if(m.getAttribute("aria-busy")==="true")return;let u=m.getAttribute("data-id")??"",f=m.getAttribute("data-action")??"";m.setAttribute("aria-busy","true");let v=()=>{m.removeAttribute("aria-busy"),m.classList.add("feito"),setTimeout(()=>m.classList.remove("feito"),900)};Promise.resolve(e(u,f)).catch(h=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",h)).finally(v)},p=m=>{let u=m.target?.closest?.(`.${ze}`);u&&(m.preventDefault(),m.stopPropagation(),d(u))},g=m=>{if(m.key!=="Enter"&&m.key!==" ")return;let u=m.target?.closest?.(`.${ze}`);u&&(m.preventDefault(),d(u))};return o.addEventListener("click",p,!0),o.addEventListener("keydown",g,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",p,!0),o.removeEventListener("keydown",g,!0)}}var Ls=new Set;var ed=null;function rd(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function Ns(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function ks(o,e,r){let t=o.ownerDocument,a=t.defaultView;rd(o).append(e);let n=!0,i=()=>{if(!n)return;let m=o.getBoundingClientRect?.();if(!m)return;let u=a?.innerHeight??0,f=a?.innerWidth??0,v=Math.min(r.largura??Math.max(m.width,r.larguraMinima??0),Math.max(180,f-16)),h=r.alinharDireita?m.right-v:m.left,A=Math.max(8,Math.min(h,f-v-8)),b=r.alturaMaxima??360;e.style.maxHeight="none";let D=Math.min(e.scrollHeight||b,b),S=u-m.bottom-8,P=m.top-8,E=ed?.()??!1,C=!E&&S<Math.min(D,200)&&P>S;e.style.left=`${A}px`,e.style.width=`${v}px`,e.style.maxHeight=`${E?b:Math.max(140,Math.min(b,C?P:S>140?S:b))}px`,e.classList.toggle("spro-flutuante-cima",C),C?(e.style.top="",e.style.bottom=`${u-m.top+4}px`):(e.style.bottom="",e.style.top=`${m.bottom+4}px`),Ns(a,C?0:Math.ceil(m.bottom+4+D+12))},s=m=>{let u=m.composedPath?.()??[],f=m.target,v=h=>u.includes(h)||!!f&&!!h.contains?.(f);v(e)||v(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},d=m=>{m.target instanceof Node&&e.contains(m.target)||c()},p=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",d,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",p);let g={ancora:o,fechar:()=>r.aoFechar()};return Ls.add(g),i(),{posicionar:i,fechar(){n&&(n=!1,Ls.delete(g),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",d,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",p),e.remove(),Ns(a,0))}}}function _s(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=m=>{let u=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${m.perigo?" spro-menu-perigo":""}${m.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":m.id,...m.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},M(m.icone,15)),l("span",{class:"spro-menu-rotulo"},m.rotulo),m.dica?l("span",{class:"spro-menu-dica"},m.dica):null);return u.addEventListener("click",f=>{f.preventDefault(),f.stopPropagation(),!m.desativado&&(p(!0),r.aoEscolher(m))}),n.push(u),u};for(let m of Tr){let u=e.filter(f=>f.grupo===m);u.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":Et[m]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},Et[m]),...u.map(s)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=m=>{if(!n.length)return;let u=(m+n.length)%n.length;for(let[f,v]of n.entries())v.setAttribute("tabindex",f===u?"0":"-1");n[u]?.focus?.({preventScroll:!0})};for(let m of n)m.addEventListener("pointermove",()=>c(n.indexOf(m)));let d=ks(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>p(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function p(m){if(i)return;i=!0;let u=a.contains(t.activeElement);d.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",g,!0),(m||u)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function g(m){if(m.key==="Escape"){m.preventDefault(),m.stopPropagation(),p(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let u=n.findIndex(f=>f.getAttribute("tabindex")==="0");switch(m.key){case"ArrowDown":c(u+1);break;case"ArrowUp":c(u-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[u]?.click();break;case"Tab":p(!0);return;default:return}m.preventDefault(),m.stopPropagation()}return t.addEventListener("keydown",g,!0),r.focar&&c(0),{el:a,fechar:()=>p(!1)}}async function $s(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new y("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function td(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?Wo[r.nivel]:n;if(r.nivel&&(a.push(...J("N\xEDvel de acesso",Xo[n]??"",Xo[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new y("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await Yo(o,e,i,t),c=Ko(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function ad(o,e,r){let t=await $s(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=B(t.documento.acoes,a)??B(t.documento.acoes,/^documento_alterar/);if(!n)throw new y("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await R.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function nd(o,e,r){let t=K(e,"documento_escolher_tipo");if(!t)throw new y("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await R.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=R.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function id(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,I(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=z(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,I(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function sd(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await nd(o,e,t),i=id(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new y("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:Ko(i,r,"Tipo de documento")}}async function cd(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=R.de(s,"#frmDocumentoCadastro",o.http),d=c.pagina.doc.querySelector("#lblNumero"),p=d!==null&&!/infraLabelOpcional/.test(d.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(p?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let v=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(A=>A.valor===v&&A.valor!=="null"))throw new y("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${v}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:v,hdnIdTextoPadrao:v})}else if(n.textoPadrao){let v=c.opcoes("selTextoPadrao").filter(A=>A.valor!=="null").map(A=>({id:A.valor,texto:A.texto})),h=Ko(v,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:h.id,hdnIdTextoPadrao:h.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await td(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let g=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:v=>/acao_origem=documento_(?:gerar|cadastrar)/.test(v.url)||/editor_montar/.test(v.html)}),m=z(g.url).get("id_documento")??/id_documento=(\d+)/.exec(g.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:m,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let f=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(v=>v.id===m);return{idDocumento:m,numero:f?.numero??"",titulo:f?.titulo??""}}function Rs(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var ld=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function qs(o,e,r,t={}){let a=await $s(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new y("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await ad(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new y("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let d=c==="1"?"restrito":"publico",p=d==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(b=>b.selecionada&&b.valor!=="null")?.valor)??void 0:void 0,g=i.valor("hdnIdSerie")??"";if(!g)throw new y("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:m,tipo:u}=await sd(o,n.arvore,g,r.sinal,!0),f={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${u.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...f,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:v,numero:h,titulo:A}=await cd(o,e,n.arvore,m,u,{tipo:u.id,descricao:t.semMinuta?Rs(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:ld(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?Rs(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:d,hipotese:p},r.sinal);return{...f,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${A||u.texto} ${h?`(${h}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:v,numero:h}}}var dd="seipro-processo-menu",St="data-spro-pm-pedido";async function pd(o,e){if(!e.html)return Kr(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function zs(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function Hs(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>H(e,i,s),n=(i,s,c)=>new Promise(d=>{let p=null,g=$(e,{titulo:i,icone:"alerta",largura:420,conteudo:[l("p",{},s),W(...c.map(m=>m.principal?Z(m.rotulo,()=>{p=m.id,g.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{p=m.id,g.fechar()}},m.rotulo)))],aoFechar:()=>d(p)})});return{async copiar(i,s){let c=await pd(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=zs(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=l("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=l("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await qs(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(So(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),d=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return d?(d[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(St,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(dd)),r.documentElement.hasAttribute(St)&&(r.documentElement.removeAttribute(St),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await Pr(e,"URGENTE")},clicarBotaoNativo(i){for(let s of zs(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var ud="configViewFlashMenuPro",md="configViewFlashDocMenuPro",gd="configViewFlashDocArvorePro";function Fs(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;ho(r);let n=new Ro(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new $e(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>qo(e.topo)),c=o.servicos??Hs({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),d=`${r.location?.origin??""}${r.location?.pathname??""}`,p=()=>!!K(i(),"documento_escolher_tipo"),g=x=>({selecao:x,citacao:Fe(o.dataValues,"citacaodoc"),base:d,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:p(),uploadLigado:yo(o.dataValues,"uploaddocsexternos"),loteLigado:yo(o.dataValues,"acoesemlote"),servicos:c}),m=()=>vr(e.armazenamento,md),u=()=>vr(e.armazenamento,ud),f=()=>vr(e.armazenamento,gd),v=()=>m()?.includes(Nr)??!1,h=(x,w)=>{let O=n.obter(x);return O||(n.lerDoIframe(r),O=n.obter(x)),{id:x,rotulo:w,dado:O}},A={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},b=x=>{let w=x;if(!w?.closest)return null;let O=w.closest('a[id^="anchorImg"]');if(O){let L=Co(O.id,"anchorImg");return L&&L!==e.arv.idProcedimento&&_e(e.armazenamento,"menudoc")?{tipo:"documento",ancora:O,id:L}:null}let k=w.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return k&&_e(e.armazenamento,"menuproc")?{tipo:"processo",ancora:k}:null},D=x=>{if(x.tipo==="processo")return{itens:Ss(g(u())),rotulo:"Menu do processo"};let w=r.getElementById(`anchor${x.id}`),O=h(x.id,(w?.textContent??"").replace(/\s+/g," ").trim());return{itens:ws(O,g(m())),rotulo:"Menu do documento"}},S=null,P=null,E,C=()=>{clearTimeout(E),P&&clearTimeout(P.timer),P=null;let x=S;S=null,x?.menu.fechar()},N=(x,w)=>{if(S?.ancora===x.ancora)return;C();let{itens:O,rotulo:k}=D(x);if(!O.length)return;let L=_s(x.ancora,O,{rotulo:k,escuro:po(r),focar:w,rodape:[A],aoFechar:()=>{S?.menu===L&&(S=null)},aoEscolher:q=>{Promise.resolve().then(()=>q.executar()).catch(co=>{console.warn("[SEI Pro] menu da \xE1rvore:",co),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});S={menu:L,ancora:x.ancora},L.el.addEventListener("mouseenter",()=>clearTimeout(E)),L.el.addEventListener("mouseleave",()=>F())},F=()=>{clearTimeout(E),E=setTimeout(C,a)},Y=x=>{let w=x;return w?!!(S&&(S.ancora.contains(w)||S.menu.el.contains(w))||P?.ancora.contains(w)):!1},V=x=>{if(Y(x.target)){clearTimeout(E);return}let w=b(x.target);if(P&&(clearTimeout(P.timer),P=null),!w||w.tipo==="documento"&&v()){S&&F();return}S&&F(),P={ancora:w.ancora,timer:setTimeout(()=>{P=null,N(w,!1)},t)}},Eo=x=>{x.relatedTarget||(P&&(clearTimeout(P.timer),P=null),S&&F())},ro=x=>{let w=b(x.target);if(w){if(w.tipo==="documento"&&v()){x.preventDefault(),x.stopImmediatePropagation(),S?.ancora===w.ancora?C():N(w,!1);return}w.tipo==="documento"&&S?.ancora===w.ancora&&C()}},vo=x=>{let w=b(x.target);!w||!(x.key==="ArrowDown"||(x.key==="Enter"||x.key===" ")&&w.tipo==="documento"&&v())||(x.preventDefault(),x.stopImmediatePropagation(),N(w,!0))};r.addEventListener("mouseover",V),r.addEventListener("mouseout",Eo),r.addEventListener("click",ro,!0),r.addEventListener("keydown",vo,!0);let Oo=null,to=()=>{if(!_e(e.armazenamento,"iconstree")){Os(r);return}Ms(r,e.arv.idProcedimento,h,()=>g(m()),f)};_e(e.armazenamento,"iconstree")&&(Oo=Ts(r,async(x,w)=>{let O=r.getElementById(`anchor${x}`),k=h(x,(O?.textContent??"").replace(/\s+/g," ").trim());await kr(k,g(m()),f()).find(q=>q.modo===w)?.executar()},to),to());let $o=n.acompanharPastas(r,()=>setTimeout(to,80)),Bo=re(r,()=>{S&&(po(r)?S.menu.el.setAttribute("data-tema","escuro"):S.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(x,w=!1){let O=Co(x.id,"anchorImg");if(O)return N({tipo:"documento",ancora:x,id:O},w);N({tipo:"processo",ancora:x},w)},atual:()=>S?.menu??null,parar(){C(),r.removeEventListener("mouseover",V),r.removeEventListener("mouseout",Eo),r.removeEventListener("click",ro,!0),r.removeEventListener("keydown",vo,!0),Oo?.(),$o(),Bo()}}}var fd='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function Us(o,e,r){for(let t of o.querySelectorAll(fd)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function Vs(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(Us(o.doc,"urgentePro",lo(t.valor.especificacao,"URGENTE")),o.usaTrancado&&Us(o.doc,"trancadoPro",lo(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function Bs(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var vd=["dadosProcesso","marcador"],hd=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Gs(o,e){let r=null,t=s=>{let c=Bs(s);c===null?o.documentElement?.removeAttribute(Ze):o.documentElement?.setAttribute(Ze,c)},a=()=>{e().then(s=>{if(!(!s||s.sigiloso))for(let c of vd)s.loja.ler(c).estado!=="pronto"&&s.recarregar(c)}).catch(s=>console.warn("[SEI Pro] capa do processo:",s))},n=()=>{if(r)return;let s=new AbortController;r=s,t({fase:"coletando",feito:0,total:0}),e().then(async c=>{if(!c||c.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await oe(c,{sinal:s.signal,aoProgresso:(d,p)=>t({fase:"coletando",feito:d,total:p})}),t("pronto")}).catch(c=>{hd(c)||s.signal.aborted?t({fase:"parada"}):t({fase:"erro",mensagem:Io(c)})}).finally(()=>{r=null})},i=()=>r?.abort();return o.addEventListener(Ye,a),o.addEventListener(Ke,n),o.addEventListener(Je,i),()=>{o.removeEventListener(Ye,a),o.removeEventListener(Ke,n),o.removeEventListener(Je,i)}}function bd(o,e){let r=o.replace(/\s+/g," ").trim();return r?`${r} | SEI - Processo ${e}`:`SEI - Processo ${e}`}function js(o){if(o.sigiloso||o.consultasDesativadas)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;if(!t||!t.disponivel)return;let a=bd(t.valor.especificacao,o.protocolo);o.topo.title!==a&&(o.topo.title=a)},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}var It=null;Ga(`${Ot}
${Ht}`);ht(window)&&(Hi(document),Fi(document));vt(window)&&($i(document),qi(document),zi(document));var Ws=window;if(!Ws.__seiProProcessoPaineis&&vt(window)&&!bt(window)){Ws.__seiProProcessoPaineis=!0,xn(document,Ct),Gs(document,Ct);let o=()=>void Ad().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}if(es(window)&&!bt(window)){let o=()=>void rs().catch(e=>console.warn("[SEI Pro] aviso de n\xE3o assinados:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function Ct(){return It??=xd().catch(o=>{throw It=null,o}),It}async function xd(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await Re(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=Ve(),t=Cr(r),a=e.nivel==="sigiloso",n=new se(He(chrome.storage.local,"local"),Ir(t.host,t.login),e.idProcedimento,{sigiloso:a}),i=Ae(location.href),s=Ue(o,"disablequery"),c=Ri({http:i,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:s});return _i({doc:document,topo:r,arv:e,loja:n,...t,habilitados:Dn(Cn(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:Ue(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:d=>{let p=c[d];p&&n.carregar(d,p)}})}async function Ad(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=yo(o,"infoarvore")&&Mn(localStorage),r=yo(o,"menurapido"),t=yo(o,xa),a=!Ue(o,"disablequery")&&ht(window.top);if(!e&&!r&&!t&&!a)return;let n=await Ct();if(n){if(a&&!n.sigiloso&&(js(n),e||n.recarregar("dadosProcesso")),e){gi(n),Vs(n);let i=new Set(mi(n));a&&!n.sigiloso&&i.add("dadosProcesso");for(let s of i)n.recarregar(s);pa(n).catch(()=>{})}r&&Fs({ctx:n,dataValues:o,http:Ae(location.href)}),t&&ns(n)}}})();
