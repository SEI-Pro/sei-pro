/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Rc(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function dr(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Rc(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function ur(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function Vo(o,e){let r=ur(o,e);return!(r===!1||r===0||r==="")}function mr(o,e){let r=ur(o,e);return r===!0||r===1||r==="1"}var na=`/*
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
`;var zc={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function Do(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):zc[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var ia={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var qc={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Ve(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=qc[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return r}var Hc=/[A-Za-z0-9\-_.*]/;function sa(o){let e="";for(let r of o)r===" "?e+="+":Hc.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function ca(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${sa(Ve(r))}=${sa(Ve(t??"",a))}`}).join("&")}function la(o){let e=r=>encodeURIComponent(Ve(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var pa="application/x-www-form-urlencoded";function lt(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=ia[n[s]]??n[s];r.push(String.fromCharCode(...i))}return r.join("")}var da="application/x-www-form-urlencoded; charset=ISO-8859-1";var ua=null;function ue(o){return ua?ua(o):new DOMParser().parseFromString(o,"text/html")}function _(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var C=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Uo(o){if(o instanceof C)return o;if(o instanceof DOMException&&o.name==="AbortError")return new C("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new C("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function ma(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=ue(r)}}}function fa(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new C("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new C("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=_(r);throw new C("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new C("SEI_VALIDACAO",r,r)}return o}function Ue(o,e={}){let r=new URL(".",o),t=e.fetch??((...m)=>fetch(...m)),a=Math.max(1,e.concorrencia??3),n=0,i=[];async function s(m){n>=a&&await new Promise(u=>i.push(u)),n+=1;try{return await m()}finally{n-=1,i.shift()?.()}}let c=m=>new URL(m.replace(/&amp;/g,"&"),r).href;async function p(m,u,f){return s(async()=>{try{let v=await t(c(m),{credentials:"same-origin",redirect:"follow",...u,signal:f.sinal}),b=lt(await v.arrayBuffer());return fa(ma(v.url||c(m),v.status,b),f)}catch(v){throw Uo(v)}})}async function d(m,u={}){return s(async()=>{try{let f=await t(c(m),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),v=new Uint8Array(await f.arrayBuffer()),b=(f.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();b==="text/html"&&fa(ma(f.url||c(m),f.status,lt(v)),u);let g=f.headers?.get("content-disposition")??"",E=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(g)?.[1]??/filename="?([^";]+)"?/i.exec(g)?.[1]??"");return{bytes:v,tipo:b,nome:E}}catch(f){throw Uo(f)}})}return{base:r,absoluta:c,baixar:d,obter:(m,u={})=>p(m,{method:"GET"},u),enviar:(m,u,f={})=>p(m,f.utf8?{method:"POST",headers:{"Content-Type":pa},body:la(u)}:{method:"POST",headers:{"Content-Type":da},body:ca(u,f.modos)},f)}}function ae(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function fr(){try{return window.top?.document??document}catch{return document}}var ga=`/*
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
/* Lupa na fileira de \xEDcones do topo da \xE1rvore (#topmenu): glifo cheio azul, no tamanho dos \xEDcones do SEI Pro vizinhos. */
.spro-f-lupa-btn {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 26px;
  height: 24px;
  margin: 0 1px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: none;
  color: #1f5fbf;
  line-height: 0;
  vertical-align: baseline;
  cursor: pointer;
}
.spro-f-lupa-btn svg {
  display: block;
  width: 18px;
  height: 18px;
  margin: 3px auto;
}
.spro-f-lupa-btn:hover,
.spro-f-lupa-btn[aria-pressed="true"] {
  background: rgb(31 95 191 / 14%);
}
.spro-f-lupa-btn:focus-visible {
  outline: 2px solid #1a73e8;
  outline-offset: 1px;
}
.spro-f-lupa-btn[data-ativo]::after {
  content: "";
  position: absolute;
  top: 1px;
  right: 1px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #d1352b;
  border: 1.5px solid #fff;
}
.spro-f-lupa-btn[data-tema="escuro"] {
  color: #79acff;
}
.spro-f-lupa-btn[data-tema="escuro"]:hover,
.spro-f-lupa-btn[data-tema="escuro"][aria-pressed="true"] {
  background: rgb(121 172 255 / 18%);
}
.spro-f-lupa-btn[hidden] {
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
/* Carregamento das pastas fechadas (fila de pastas): linha de estado, botao e barra de progresso fina. */
.spro-f-fila {
  margin-top: 4px;
  font-size: var(--spro-p-fonte-pequena);
  color: var(--spro-suave);
}
.spro-f-fila-linha {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 8px;
}
.spro-f-fila[data-tom="ok"] .spro-f-fila-texto {
  color: var(--spro-ok);
}
.spro-f-fila[data-tom="aviso"] .spro-f-fila-texto {
  color: var(--spro-aviso);
}
.spro-f-fila-acao {
  margin: 0;
  padding: 0;
  font: inherit;
  font-weight: 600;
  color: var(--spro-destaque);
  background: none;
  border: 0;
  cursor: pointer;
  text-decoration: underline;
}
.spro-f-fila-acao:hover {
  filter: brightness(1.15);
}
.spro-f-fila-acao:focus-visible {
  outline: 2px solid var(--spro-destaque);
  outline-offset: 2px;
  border-radius: 2px;
}
.spro-f-prog {
  height: 4px;
  margin-top: 5px;
  overflow: hidden;
  background: var(--spro-borda-forte);
  border-radius: 2px;
}
.spro-f-prog-enchimento {
  width: 0;
  height: 100%;
  background: var(--spro-destaque);
  border-radius: 2px;
  transition: width 0.25s ease;
}
.spro-f-fila[data-tom="ok"] .spro-f-prog-enchimento {
  background: var(--spro-ok);
}
@media (prefers-reduced-motion: reduce) {
  .spro-f-prog-enchimento {
    transition: none;
  }
}
/* Na arvore do SEI: a pasta em carga ganha realce e um aro girando; a que falhou, um x. O atributo e posto pela fila e sai ao fim. */
a[data-spro-pasta="carregando"] {
  background: rgb(66 133 244 / 18%);
  border-radius: 3px;
}
a[data-spro-pasta="carregando"]::after {
  content: "";
  display: inline-block;
  box-sizing: border-box;
  width: 12px;
  height: 12px;
  margin-left: 6px;
  vertical-align: -2px;
  border: 2px solid #4285f4;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spro-f-gira 0.8s linear infinite;
}
a[data-spro-pasta="falhou"]::after {
  content: "\\00a0\\2715";
  margin-left: 4px;
  color: #d1352b;
  font-weight: 700;
}
@keyframes spro-f-gira {
  to {
    transform: rotate(360deg);
  }
}
@media (prefers-reduced-motion: reduce) {
  a[data-spro-pasta="carregando"]::after {
    animation: none;
    border-right-color: #4285f4;
  }
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
`;var Vc={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Be(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Vc[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function pt(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,c]=Be(o,t);r.push(s),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];r.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}r.push(null)}return[r,t]}function co(o){return typeof o=="string"?Do(o):o==null?"":String(o)}var Uc=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Bo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Uc))e.add(r[0]);return[...e]}function to(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function io(o,e,r={}){let t=Array.isArray(o)?o:Bo(o);for(let a of t){let n=to(a),i=n.get("acao")??"";if(!(typeof e=="string"?i!==e:!e.test(i))&&Object.entries(r).every(([s,c])=>n.get(s)===c))return a}return null}function va(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=Bo(r).filter(i=>to(i).get("acao")===e),n=(t.length?t:Bo(o.html).filter(i=>to(i).get("acao")===e)).sort((i,s)=>[...to(i).keys()].length-[...to(s).keys()].length)[0];if(!n)throw new C("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function ha(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=pt(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Be(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function ba(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=pt(o,r.index+r[0].length);e.push({tipo:co(t[0]),idPai:co(t[2]),href:co(t[3]),titulo:co(t[5]),icone:co(t[6]),extra:t[8]==null?void 0:co(t[8])})}return e}function xa(o,e){let r=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Aa(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>co(e[1])))]}function Ea(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var Bc=/\s*\(\d{5,}\)\s*$/;function ya(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=co(r.args[1]),a=co(r.args[5]),n=co(r.args[7]),i=(r.props.src??"").replace(/&amp;/g,"&"),s=e.find(m=>m.tipo==="ASSINATURA"&&m.idPai===t),{nivel:c,hipotese:p}=xa(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:co(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(Bc,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(i)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:p,assinado:!!s,assinaturas:s?s.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(m=>m.tipo==="UNIDADE_GERADORA"&&m.idPai===t)?.extra,link:co(r.args[3]).replace(/&amp;/g,"&"),src:i,acoes:Bo(r.props.acoes??""),botoes:Aa(r.props.acoes??""),funcoes:Ea(r.props.acoes??"")}})}function Pa(o){return ya(ha(o.html),ba(o.html))}function dt(o){let e=o.html,r=ha(e),t=ba(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new C("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=co(a.args[1]),i=xa(t,n),s=ya(r,t);return{idProcedimento:n,protocolo:co(a.args[5])||co(a.args[15]),tipo:co(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:Bo(a.props.acoes??""),botoesProcesso:Aa(a.props.acoes??""),funcoesProcesso:Ea(a.props.acoes??""),linkProcesso:co(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Bo(e),pagina:o}}async function Da(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new C("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=io(t.html,"procedimento_visualizar")&&Bo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return dt(t)}function po(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?io(t.acoes,e):null}return io(o.acoesProcesso,e)??io(o.links,e,{id_procedimento:o.idProcedimento})}function uo(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var me={publico:"0",restrito:"1"},fe={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function ge(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(Do(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Ca="\xA5",ut="\xB1";function wa(o){return o.map(e=>`${e.id}${ut}${e.texto}`).join(Ca)}function Gc(o){return o?o.split(Ca).map(e=>{let[r,...t]=e.split(ut);return{id:r,texto:t.join(ut)}}):[]}function Sa(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var Q=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=jc(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,_(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Ma(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??_(t),texto:_(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=Po(r),n=t.find(i=>i.valor===r)??t.find(i=>Po(i.texto)===a)??mt(t.filter(i=>Po(i.texto).includes(a)));if(!n)throw new C("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Gc(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:wa(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new C("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new C("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new C("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${_(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??mt([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??_(r)??e]:[e,e]}hiddenDaLupa(e){let r=Sa(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Sa(this.pagina.html)){let t=this.elemento.querySelector(`select#${Ma(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:_(n)}));(this.valor(r)??"")||this.definir({[r]:wa(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function jc(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],i=n.filter(p=>p.hasAttribute("selected")),s=r.hasAttribute("multiple"),c=i.length?i:!s&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??_(p)})}}return e}function Po(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function ve(o,e,r){let t=Po(e),a=o.find(n=>n.id===e)??o.find(n=>Po(n.texto)===t)??mt(o.filter(n=>Po(n.texto).includes(t)));if(!a)throw new C("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function mt(o){return o.length===1?o[0]:void 0}function Ma(o){return o.replace(/([^\w-])/g,"\\$1")}function Wc(o){let e=new Set;return o.filter(r=>!e.has(r.id)&&e.add(r.id))}function ft(o){return o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function gt(o,e){let t=new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${ft(e)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`).exec(o);return t?Do(t[1]):null}function vt(o,e){let t=new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${ft(e)}['"]`).exec(o)?.[1];if(!t)return!1;let a=new RegExp(`\\b${ft(t)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(o)?.[1];return!!a&&/encodeURIComponent\s*\(/.test(a)}async function ht(o,e,r,t,a=!1){let n=a?encodeURIComponent(Ve(r)):r,i=await o.ajax(e,[["palavras_pesquisa",n]],{sinal:t,utf8:!0});return Wc(i.map(s=>({...s,texto:Do(s.texto)})))}function he(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let i of o.matchAll(a))n.set(i[1],i[2]);return n}function Kc(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function Xc(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Ge(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=Kc(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:Xc(o),sigla:_(r)||_(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var Yc=3e4,gr=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Ue(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new C("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Ge(this.base())}linkMenu(e){return va(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new C("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=Q.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(r),s=to(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new C("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=to(Do(c)).get("id_procedimento")??"",m=s.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:m&&m!==d?m:void 0,linkArvore:Do(c)};return this.localizados.set(t,u),u}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<Yc)return a.arvore;let n=await Da(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:Do(i[1]),texto:Do(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=ue(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function be(o,e,r){let t=po(o,e);if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function je(o,e,r){let t=await Q.abrir(o,be(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var Ia=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Ta(o,e,r){let t=Ia.exec(r),a=r.replace(Ia,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function Jc(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(_(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>_(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let i=[...n.querySelectorAll("td")],s=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Ta(s||void 0,_(i[t]),_(i[a]))}async function ka(o,e,r){let t=await o.obter(be(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=Q.de(t,"#frmAcompanhamentoCadastro"),i=n.valor("hdnIdAcompanhamento");if(!i)return null;let s=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Ta(i,s.trim(),(n.valor("txaObservacao")??"").trim())}let a=Jc(t);if(a===void 0)throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",_(t.doc.querySelector("title")));return a}function Zc(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?Be(o.pagina.html,e.index+e[0].length-1)[0]:""}function Qc(o){if(!o.trim())return[];let e=ue(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let i=n;t.ancoras.push({sigla:_(i),nome:i.getAttribute("title")??i.getAttribute("alt")??""})}return a(),r}function La(o,e){let r=Qc(Zc(o)),t=[];for(let i of r){if(!i.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(i.texto)){t.push({texto:i.texto,unidade:i.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(i.texto)&&i.ancoras.length>1?i.ancoras[1]:null;t.push({texto:i.texto,unidade:i.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??Ge(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(i=>i.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!po(o,"procedimento_alterar"),texto:r.map(i=>i.texto).join(`
`),linhas:t}}var vr=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function Na(o,e){let r=o.filter(i=>i.unidade===e),t=i=>i.reduce((s,c)=>!s||vr(c.data)>vr(s.data)?c:s,null),a=t(r.filter(i=>i.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(i=>i.descricao.includes("Processo retirado do bloco")));return n&&vr(a.data)<vr(n.data)?null:a.descricao}function hr(o){let e=t=>!!po(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function _a(o,e,r){let t=await o.obter(be(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",_(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(i=>i.querySelector("input[type=checkbox]")).map(i=>{let s=[...i.querySelectorAll("td")];return{id:i.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:_(s[1]),texto:_(s[2]),icone:s[1]?.querySelector("img")?.getAttribute("src")??"",usuario:_(s[3]),data:_(s[4])}})}async function Ra(o,e,r){let a=(await Q.abrir(o,be(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(i=>i.selecionada&&i.valor!=="null")?.valor;return{opcoes:a.filter(i=>i.valor!=="null"&&i.texto).map(i=>({valor:i.valor,texto:i.texto})),...n?{atual:n}:{}}}async function $a(o,e,r){let t=await o.obter(be(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let i=io(t.html,"andamento_marcador_cadastrar");if(!i)throw new C("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(i,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(i=>({valor:i.getAttribute("value")??"",texto:_(i),icone:i.getAttribute("data-imagesrc")??void 0})).filter(i=>i.valor&&i.valor!=="null"&&i.texto).map(i=>i.icone?i:{valor:i.valor,texto:i.texto})}async function za(o,e,r){let t=await o.obter(be(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>io(t.html,p)).find(Boolean);if(!c)throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let i=Q.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),s=i.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:i.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...s?{atual:s}:{}}}async function qa(o,e,r){let t=po(e,"procedimento_alterar")??po(e,"procedimento_consultar");if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await Q.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),i=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,s=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...s?{tipoAtual:s}:{},nivel:a.valor("rdoNivelAcesso")??"",...i?{hipoteseAtual:i}:{},interessados:a.itensLupa("selInteressadosProcedimento"),assuntos:a.itensLupa("selAssuntos"),interessadosNegados:he(a.pagina.html,"interessado"),assuntosNegados:he(a.pagina.html,"assunto"),pesquisarAssuntos:(c,p)=>Oa(o,a,"hdnIdAssunto","assuntos",c,p),pesquisarContatos:(c,p)=>Oa(o,a,"hdnIdInteressadoProcedimento","contatos",c,p),async hipoteses(c,p){return(await ge(o,a,c,p)).map(d=>({valor:d.id,texto:d.texto}))}}}async function Oa(o,e,r,t,a,n){let i=gt(e.pagina.html,r);if(!i)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela de altera\xE7\xE3o do processo n\xE3o tem a pesquisa de ${t}.`);return ht(o,i,a,n,vt(e.pagina.html,r))}var br=(o,e)=>o>0&&e-o<18e5;var We=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function bt(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:Na(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function xe(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:br(e.coletadoEm,o.agora().getTime())}:null}async function Ha(o){let e=await xe(o);return e?.vale?(bt(o,e.historico),!0):!1}async function Ae(o,e={}){if(o.sigiloso)throw new We;let r=await xe(o);if(r?.vale&&!e.forcar)return bt(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),bt(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var Fa="data-seipro-processo-paineis",Va="data-seipro-processo-menu",Ua="data-seipro-processo-capa",Ba="data-seipro-processo-gantt",Ga="data-seipro-processo-titulo",ja="data-seipro-processo-aviso",Wa="naoassinados",xr="spro-processo-gantt-abrir",Ar="spro-processo-capa-pedir",Er="spro-processo-capa-calcular",yr="spro-processo-capa-cancelar",Pr="data-spro-capa-coleta";var Ka="filtroarvore";var Dr="processo/",xt=(o,e)=>`${Dr}${o}/${e}`,At=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},Et="processo-historico/",yt=(o,e)=>`${Et}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var Ro={fill:"currentColor",stroke:"none"},Xa="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Ya={estrela:[["path",{d:Xa}]],estrelaCheia:[["path",{d:Xa,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...Ro}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...Ro}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...Ro}],["circle",{cx:"12",cy:"12",r:"1.4",...Ro}],["circle",{cx:"19",cy:"12",r:"1.4",...Ro}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...Ro}],["circle",{cx:"15",cy:"6",r:"1.3",...Ro}],["circle",{cx:"9",cy:"12",r:"1.3",...Ro}],["circle",{cx:"15",cy:"12",r:"1.3",...Ro}],["circle",{cx:"9",cy:"18",r:"1.3",...Ro}],["circle",{cx:"15",cy:"18",r:"1.3",...Ro}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},Lu=Object.keys(Ya);function H(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of Ya[o]){let c=r.createElementNS(t,i);for(let[p,d]of Object.entries(s))c.setAttribute(p,d);a.append(c)}return a}function ol(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function Ja(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function Za(o,e,r,t,a){let n=o.body??o.documentElement;for(let m of[n,...o.querySelectorAll("dialog")])for(let u of[...m.children])u.classList.contains("spro-aviso")&&u.remove();let i=l("div",{class:"spro-aviso",role:"status"},H("check",16),l("span",{},e),...ol(r).map(m=>l("button",{type:"button",onclick:()=>{i.remove(),m.fazer()}},m.rotulo)));i.setAttribute("popover","manual");let s=()=>{try{i.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let m=Ja(o);m.append(i),s(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!d||!m.contains(i))){if(a&&Ja(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){d=!1,i.remove();return}p()}},{once:!0})},d=!0;return p(),setTimeout(()=>{d=!1,i.remove()},t),i}async function Pt(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function ao(o,e,r=4e3){try{Za(o.topo,e,void 0,r)}catch{}}async function Qa(o,e){let r=await Pt(o.doc,e);ao(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var on={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},en={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function wo(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function Go(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":wo(o)}function fo(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var rn=new Set;var el=null;function rl(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function tn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function wr(o,e,r){let t=o.ownerDocument,a=t.defaultView;rl(o).append(e);let n=!0,i=()=>{if(!n)return;let u=o.getBoundingClientRect?.();if(!u)return;let f=a?.innerHeight??0,v=a?.innerWidth??0,b=Math.min(r.largura??Math.max(u.width,r.larguraMinima??0),Math.max(180,v-16)),g=r.alinharDireita?u.right-b:u.left,E=Math.max(8,Math.min(g,v-b-8)),x=r.alturaMaxima??360;e.style.maxHeight="none";let S=Math.min(e.scrollHeight||x,x),M=f-u.bottom-8,D=u.top-8,w=el?.()??!1,L=!w&&M<Math.min(S,200)&&D>M;e.style.left=`${E}px`,e.style.width=`${b}px`,e.style.maxHeight=`${w?x:Math.max(140,Math.min(x,L?D:M>140?M:x))}px`,e.classList.toggle("spro-flutuante-cima",L),L?(e.style.top="",e.style.bottom=`${f-u.top+4}px`):(e.style.bottom="",e.style.top=`${u.bottom+4}px`),tn(a,L?0:Math.ceil(u.bottom+4+S+12))},s=u=>{let f=u.composedPath?.()??[],v=u.target,b=g=>f.includes(g)||!!v&&!!g.contains?.(v);b(e)||b(o)||r.aoFechar()},c=()=>{o.isConnected?i():r.aoFechar()},p=u=>{u.target instanceof Node&&e.contains(u.target)||c()},d=()=>r.aoFechar();t.addEventListener("pointerdown",s,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let m={ancora:o,fechar:()=>r.aoFechar()};return rn.add(m),i(),{posicionar:i,fechar(){n&&(n=!1,rn.delete(m),t.removeEventListener("pointerdown",s,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),e.remove(),tn(a,0))}}}function an(o,e){let r=fo(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,i)=>{let s=fo(n.rotulo),c=fo(n.complemento??""),p=`${s} ${c} ${fo(n.descricao??"")}`;if(!t.every(m=>p.includes(m)))return;let d=s.startsWith(r)?0:`${s} ${c}`.split(" ").some(m=>m.startsWith(t[0]))?1:2;a.push({o:n,nota:d,i})}),a.sort((n,i)=>n.nota-i.nota||n.i-i.i).map(n=>n.o)}function nn(o,e){let r=o.normalize("NFC"),t=fo(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",i=[];a.forEach((p,d)=>{let m=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let u of m)n+=u,i.push(d)});let s=new Array(a.length).fill(!1);for(let p of t){let d=n.indexOf(p);if(!(d<0))for(let m=d;m<d+p.length;m++)s[i[m]]=!0}let c=[];return a.forEach((p,d)=>{let m=c[c.length-1];m&&m.marcado===s[d]?m.texto+=p:c.push({texto:p,marcado:s[d]})}),c}var tl=0;function sn(o){let e=`spro-combo-${++tl}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=A=>r().find(k=>k.valor===A)??t.get(A),n=[...o.valor??[]],i=null,s="",c=0,p=[],d=null,m=o.vazio??"Escolher\u2026",u={tipo:"pronto"},f=0,v=l("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),b=()=>o.aoMudar?.([...n]);function g(){let A=[];o.icone&&A.push(H(o.icone,15));let k=n.map(N=>a(N)).filter(N=>!!N),T=l("span",{class:"spro-combo-texto"});if(!k.length)T.classList.add("spro-combo-vazio"),T.append(m);else{let N=k[0];N.marca&&T.append(N.marca()),N.cor&&T.append(l("span",{class:"spro-combo-cor",style:`background:${N.cor}`})),T.append(l("span",{class:"spro-combo-rotulo"},N.rotulo)),N.complemento&&T.append(l("span",{class:"spro-combo-compl"},N.complemento)),k.length>1&&T.append(l("span",{class:"spro-combo-mais"},`+${k.length-1}`))}A.push(T,H("chevron",14)),v.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false"),v.classList.toggle("spro-combo-erro",u.tipo==="erro"),v.classList.toggle("spro-combo-ativo",o.multiplo===!0&&k.length>0),v.replaceChildren(...A)}let E=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function x(A){if(o.multiplo){n=n.includes(A.valor)?n.filter(T=>T!==A.valor):[...n,A.valor],b(),g(),w();return}let k=n.length!==1||n[0]!==A.valor;n=[A.valor],g(),G(!0),k&&b()}async function S(){if(!o.criar)return;let A=s.trim();if(!A)return;let k=await o.criar(A);if(k){if(t.set(k.valor,k),s="",i){let T=i.querySelector(".spro-combo-busca");T&&(T.value="")}o.multiplo&&n.includes(k.valor)?w():x(k)}}function M(A,k){let T=n.includes(A.valor),N=l("span",{class:"spro-combo-op-rotulo"});for(let $ of nn(A.rotulo,s))N.append($.marcado?l("mark",{},$.texto):$.texto);let J=A.complemento?l("span",{class:"spro-combo-op-compl"}):null;if(J&&A.complemento)for(let $ of nn(A.complemento,s))J.append($.marcado?l("mark",{},$.texto):$.texto);let K=l("li",{role:"option",id:`${e}-op-${k}`,class:`spro-combo-op${k===c?" spro-combo-op-ativa":""}`,"data-valor":A.valor,"aria-selected":T?"true":"false"},o.multiplo?l("span",{class:"spro-combo-caixa","aria-hidden":"true"},T?H("check",12):null):null,A.marca?A.marca():null,A.cor?l("span",{class:"spro-combo-cor",style:`background:${A.cor}`}):null,A.icone?H(A.icone,15):null,l("span",{class:"spro-combo-op-textos"},J?l("span",{class:"spro-combo-op-linha"},N,J):N,A.descricao?l("span",{class:"spro-combo-op-desc"},A.descricao):null),A.contagem!==void 0?l("span",{class:"spro-combo-conta"},String(A.contagem)):null,!o.multiplo&&T?l("span",{class:"spro-combo-marca"},H("check",14)):null);return K.addEventListener("pointerdown",$=>$.preventDefault()),K.addEventListener("click",()=>{c=k,x(A)}),K.addEventListener("pointermove",()=>{c!==k&&(c=k,D())}),K}function D(){if(!i)return;let A=[...i.querySelectorAll('[role="option"]')];A.forEach((J,K)=>{J.classList.toggle("spro-combo-op-ativa",K===c)});let k=A[c],N=i.querySelector(".spro-combo-busca")??i.querySelector('[role="listbox"]');k?(N?.setAttribute("aria-activedescendant",k.id),k.scrollIntoView?.({block:"nearest"})):N?.removeAttribute("aria-activedescendant")}function w(){if(!i)return;let A=an(r(),s);f=A.length,p=o.limite!==void 0&&A.length>o.limite?A.slice(0,o.limite):A,u.tipo!=="pronto"&&(p=[]),c>=p.length&&(c=Math.max(0,p.length-1));let k=i.querySelector('[role="listbox"]');k.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false");let T=i.querySelector(".spro-combo-extras");if(T.replaceChildren(),u.tipo==="carregando")k.replaceChildren(...[62,84,48,74].map($=>l("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},l("span",{style:`width:${$}%`})))),T.append(l("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(u.tipo==="erro"){k.replaceChildren();let $=u.tentar;if(T.append(l("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},u.mensagem)),$){let y=l("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},H("atualizar",14),l("span",{},"Tentar de novo"));y.addEventListener("pointerdown",h=>h.preventDefault()),y.addEventListener("click",$),T.append(y)}}else{k.replaceChildren(...p.map(M));let $=s.trim();p.length||T.append(l("p",{class:"spro-combo-nada"},$?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let y=p.length?o.resumo?.(p.length,f,r().length):void 0;y&&T.append(l("p",{class:"spro-combo-resumo",role:"status"},y)),p.length<f&&T.append(l("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${p.length} de ${f}. Digite para refinar.`))}let N=s.trim(),J=r().some($=>fo($.rotulo)===fo(N));if(o.criar&&N&&!J&&u.tipo==="pronto"){let $=l("button",{type:"button",class:"spro-combo-criar"},H("mais",14),l("span",{},o.rotuloCriar?o.rotuloCriar(N):`Criar \u201C${N}\u201D`));$.addEventListener("pointerdown",y=>y.preventDefault()),$.addEventListener("click",()=>void S()),T.append($)}let K=i.querySelector(".spro-combo-rodape");if(K){let $=p.filter(P=>!n.includes(P.valor)),y=l("button",{type:"button",class:"spro-combo-acao",disabled:!N||!$.length},`Marcar os filtrados${N&&$.length?` (${$.length})`:""}`);y.addEventListener("click",()=>{n=[...n,...$.map(P=>P.valor)],b(),g(),w()});let h=l("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");h.addEventListener("click",()=>{n=[],b(),g(),w()}),K.replaceChildren(l("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),y,h)}D()}let L=()=>d?.posicionar();function j(A){let k=p.length,T=A.target,N=i?[...i.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],J=!!T?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(A.key==="Tab"){let $=N.indexOf(T);if(!A.shiftKey&&$<N.length-1)N[$+1]?.focus();else if(A.shiftKey&&$>=0)$>0?N[$-1]?.focus():(i?.querySelector(".spro-combo-busca")??i?.querySelector('[role="listbox"]'))?.focus();else{G(!0);return}A.preventDefault(),A.stopPropagation();return}if(J&&A.key!=="Escape")return;let K=!i?.querySelector(".spro-combo-busca");if(K&&A.key===" "){let $=p[c];$&&x($),A.preventDefault(),A.stopPropagation();return}if(K&&A.key.length===1&&!A.ctrlKey&&!A.metaKey&&!A.altKey){let $=fo(A.key),h=[...p.keys()].map(P=>(c+1+P)%Math.max(1,k)).find(P=>fo(p[P]?.rotulo??"").startsWith($));h!==void 0&&(c=h,D()),A.preventDefault(),A.stopPropagation();return}switch(A.key){case"ArrowDown":c=k?(c+1)%k:0,D();break;case"ArrowUp":c=k?(c-1+k)%k:0,D();break;case"Home":if(A.target?.classList?.contains("spro-combo-busca")&&s)return;c=0,D();break;case"End":if(A.target?.classList?.contains("spro-combo-busca")&&s)return;c=Math.max(0,k-1),D();break;case"Enter":{let $=p[c];$?x($):S();break}case"Escape":G(!0);break;case"Backspace":if(!o.multiplo||s||!n.length)return;n=n.slice(0,-1),b(),g(),w();break;default:return}A.preventDefault(),A.stopPropagation()}function W(A=""){if(i)return;s=A,c=A?0:(()=>{let J=an(r(),s).findIndex(K=>K.valor===n[n.length-1]);return J<0?0:J})();let T=E()?l("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:A}):null;if(T&&(T.value=A,T.addEventListener("input",()=>{s=T.value,c=0,w(),L()})),i=l("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},T?l("div",{class:"spro-combo-cabeca"},H("busca",15),T):null,l("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:T?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),l("div",{class:"spro-combo-extras"}),o.multiplo?l("div",{class:"spro-combo-rodape"}):null),i.addEventListener("keydown",j),d=wr(v,i,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>G(!1)}),v.setAttribute("aria-expanded","true"),v.setAttribute("aria-controls",`${e}-lista`),v.classList.add("spro-combo-aberto"),w(),L(),!i)return;(T??i.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),T&&A&&T.setSelectionRange?.(A.length,A.length)}function G(A=!1){i&&(d?.fechar(),d=null,i=null,s="",v.setAttribute("aria-expanded","false"),v.removeAttribute("aria-controls"),v.classList.remove("spro-combo-aberto"),A&&v.focus?.({preventScroll:!0}))}return v.addEventListener("click",()=>i?G(!0):W()),v.addEventListener("keydown",A=>{i||(A.key==="ArrowDown"||A.key==="ArrowUp"?(A.preventDefault(),W()):A.key.length===1&&A.key!==" "&&!A.ctrlKey&&!A.metaKey&&!A.altKey&&E()&&(A.preventDefault(),W(A.key)))}),g(),{el:v,valor:()=>[...n],definir(A,k=!1){n=[...A],g(),w(),k&&b()},atualizar(){g(),w()},definirVazio(A){m=A,g()},definirEstado(A){u=A,g(),w(),L()},abrir:W,fechar:()=>G(!1)}}function cn(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var ln="spro-processo-estilo",Dt="";function pn(o){Dt=o}function qo(o){if(!Dt||o.getElementById(ln))return;let e=o.createElement("style");e.id=ln,e.textContent=Dt,(o.head??o.documentElement).append(e)}function ko(o){let e=cn(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Ee(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function eo(o,e){qo(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});ko(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},H("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),i=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},H(e.icone,18)),l("h2",{},e.titulo),a),i);let s=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",s),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select, button[role=combobox])")?.focus({preventScroll:!0}),{el:r,corpo:i,fechar:s,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let d of p)d.disabled=!0;r.setAttribute("aria-busy","true");try{let d=await c();return t=!1,r.close(),d&&ao(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){t=!1,a.disabled=!1;for(let m of p)m.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(wo(d)),!1}}}}function Sr(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function So(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function go(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function bo(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function Jo(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function jo(o){let e=o.opcoes??[],r=typeof o.valor=="string"?o.valor:"",t=()=>r||e.some(p=>p.valor==="")?[r]:[],a=sn({rotulo:o.rotulo,opcoes:()=>e,valor:t(),vazio:o.carregar&&!o.adiar?"Carregando\u2026":o.vazio,busca:o.busca??!0,...o.limite!==void 0?{limite:o.limite}:{},...o.resumo?{resumo:o.resumo}:{},...o.dicaBusca?{dicaBusca:o.dicaBusca}:{},classe:"spro-p-combo",larguraLista:260,aoMudar:p=>{r=p[0]??"",o.aoMudar?.(r)}}),n=o.carregar,i=null,s=()=>(i||(i=c()),i);async function c(){if(n){a.definirVazio("Carregando\u2026"),a.definirEstado({tipo:"carregando"});try{e=await n(),typeof o.valor=="function"&&(r=o.valor(e)??r),a.definir(t()),a.definirVazio(o.vazio),a.definirEstado({tipo:"pronto"})}catch(p){a.definirVazio("N\xE3o foi poss\xEDvel carregar"),a.definirEstado({tipo:"erro",mensagem:wo(p),tentar:()=>void c()})}}}return{el:a.el,combo:a,valor:()=>r,definir(p){r=p,a.definir(t())},opcoes:()=>e,pronto:o.adiar?Promise.resolve():s(),carregarAgora:s}}function ye(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),i=l("button",{type:"button",class:"spro-botao"},"Cancelar"),s=eo(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),go(i,n)],aoFechar:()=>t(a)});i.addEventListener("click",()=>s.fechar()),n.addEventListener("click",()=>{a=!0,s.fechar()})})}var Mo={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},al=120*1e3;function Lo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Zo=(o,e)=>o.startsWith(Lo(e));function Mr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function un(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function ne(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function nl(o){let e=[];return o.forEach((r,t)=>{let a=un(r.dataISO||Mr(r.data));a&&e.push({a:r,t:a,i:t,d:Lo(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function mn(o,e){return Lo(o)===Lo(e)}function fn(o,e,r){return mn(o.unidade,e)?!o.unidadeNome||!r||Lo(o.unidadeNome)===Lo(r):!1}function Ke(o,e,r){let t=o.filter(i=>mn(i.unidade,e));if(new Set(t.map(i=>i.unidadeNome?Lo(i.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(i=>fn(i,e,r));return n.length?n:t}function il(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,i)=>n.recebido.getTime()<r(i)&&i.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(Lo(n.unidade),[...a.get(Lo(n.unidade))??[],n]);for(let[n,i]of a){let s=i.some(c=>i.some(p=>c.unidadeNome&&p.unidadeNome&&Lo(c.unidadeNome)!==Lo(p.unidadeNome)&&t(c,p)));for(let c of i)c.chave=s&&c.unidadeNome?`${n}|${Lo(c.unidadeNome)}`:n}}function dn(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${Mo.remetidoPrefixo}`,"i"),"")).trim()}function sl(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function gn(o,e){let r=nl(o),t=[],a=[],n=[],i=[],s=(f,v)=>Ke(a,f,v)[0],c=(f,v)=>{let b=Ke(n,f,v)[0];return b?n.indexOf(b):-1},p=(f,v)=>{let{a:b}=f;if(a.some(x=>fn(x,b.unidade,b.unidadeNome)))return;let g={unidade:b.unidade,...b.unidadeNome?{unidadeNome:b.unidadeNome}:{},chave:"",recebido:f.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:v,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:b.usuario,...b.usuarioNome?{usuarioRecebeuNome:b.usuarioNome}:{}},E=c(b.unidade,b.unidadeNome);if(E>=0){let[x]=n.splice(E,1);g.chegouEm=x.em,g.origem=x.origem}a.push(g),t.push(g)},d=(f,v,b)=>{f.remetido=v.t,f.fim=b,f.usuarioEnviou=v.a.usuario,v.a.usuarioNome&&(f.usuarioEnviouNome=v.a.usuarioNome),a.splice(a.indexOf(f),1)},m=f=>{let{a:v}=f;if(s(v.unidade,v.unidadeNome))return;let b=c(v.unidade,v.unidadeNome),g={em:f.t,unidade:v.unidade,...v.unidadeNome?{unidadeNome:v.unidadeNome}:{},origem:dn(v),usuario:v.usuario,...v.usuarioNome?{usuarioNome:v.usuarioNome}:{}};b>=0?n[b]=g:n.push(g)};for(let f=0;f<r.length;){let v=f+1;for(;v<r.length&&r[v].t.getTime()===r[f].t.getTime();)v+=1;let b=r.slice(f,v);f=v;for(let g of b)Zo(g.d,Mo.remetidoPrefixo)&&m(g);for(let g of b)Zo(g.d,Mo.recebido)&&p(g,"recebido");for(let g of b){let{a:E,d:x}=g;if(Mo.gerado.some(S=>Zo(x,S)))p(g,"gerado");else if(Zo(x,Mo.reabertura))p(g,"reabertura");else if(Zo(x,Mo.conclusao)){let S=s(E.unidade,E.unidadeNome);S&&d(S,g,"conclusao")}else if(Zo(x,Mo.remetidoPrefixo)){let S=dn(E),M=E.unidadeCitadaNome,D=s(S,M);if(D)d(D,g,"remessa"),D.destinos.push(E.unidade);else{let w=Ke(t,S,M).at(-1);w?.fim==="remessa"&&w.remetido&&g.t.getTime()-w.remetido.getTime()<=al&&!w.destinos.includes(E.unidade)&&w.destinos.push(E.unidade)}}else Zo(x,Mo.documentoGerado)?i.push({ev:g,assinado:!1}):Zo(x,Mo.documentoAssinado)&&i.push({ev:g,assinado:!0})}}for(let f of n)t.push({unidade:f.unidade,...f.unidadeNome?{unidadeNome:f.unidadeNome}:{},chave:"",recebido:f.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:f.em,origem:f.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:f.usuario,...f.usuarioNome?{usuarioEnviouNome:f.usuarioNome}:{}});for(let{ev:f,assinado:v}of i){let{a:b}=f,g=Ke(t.filter(S=>!S.pendenteRecebimento&&S.recebido.getTime()<=f.t.getTime()),b.unidade,b.unidadeNome),E=[...g].reverse().find(S=>S.remetido===null||f.t.getTime()<=S.remetido.getTime())??g[g.length-1];if(!E)continue;let x={...b.nrSei?{nrSei:b.nrSei}:{},...b.idDocumento?{idDocumento:b.idDocumento}:{},em:f.t,titulo:sl(b),...b.usuario?{usuario:b.usuario}:{}};(v?E.assinaturas:E.documentos).push(x)}t.sort((f,v)=>f.recebido.getTime()-v.recebido.getTime());for(let f of o){if(!f.aberto)continue;let v=Ke(t.filter(b=>!b.pendenteRecebimento),f.unidade,f.unidadeNome).at(-1);v?.fim==="remessa"&&v.remetido&&(v.enviouEm=v.remetido,v.remetido=null,v.fim=null,v.mantidoAberto=!0)}let u=ne(e).getTime();for(let f of t)f.emCurso=f.remetido===null,f.duracaoMs=Math.max(0,(f.remetido?.getTime()??u)-f.recebido.getTime());return il(t,u),t.sort((f,v)=>f.recebido.getTime()-v.recebido.getTime())}var Cr=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],cl=3e4,ll=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],pl=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],Pe=o=>String(o).padStart(2,"0"),dl=o=>Cr.find(e=>e.id===o)?.pxPorDia??2.2,Ir=o=>`${Pe(o.getUTCDate())}/${Pe(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,vo=o=>`${Ir(o)} ${Pe(o.getUTCHours())}:${Pe(o.getUTCMinutes())}`;function $o(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var Or=o=>Math.round(Math.max(0,o)/864e5*10)/10,oe=o=>String(o).replace(".",","),Xe=o=>o.recebido.getTime()+o.duracaoMs,Qo=(o,e)=>e&&o?`${e} (${o})`:e??o??"",wt=(o,e)=>e>1?`${o} ${e}x`:o;function hn(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=wt(a.sigla,a.passagens.length);return t}var vn=o=>Math.floor(o/864e5)*864e5;function Tr(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let d of o)t=Math.min(t,d.recebido.getTime()),a=Math.max(a,Xe(d),...d.documentos.map(m=>m.em.getTime()));if(!Number.isFinite(t)){let d=r.agora?.getTime()??0;t=d,a=d}r.agora&&o.some(d=>d.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=vn(t),i=vn(a)+864e5,s=Math.max(1,(i-n)/864e5),c=r.pxPorDia??dl(e),p=Math.min(c,cl/s);return{escala:e,pxPorDia:p,origem:n,fim:i,largura:s*p,x:d=>(d-n)/864e5*p}}function bn(o,e=1e3){for(let r of Cr)if(Tr(o,r.id).largura<=e)return r.id;return"mes"}function xn(o){let e=[],r=[],t=o.fim,a=(i,s,c,p)=>{let d=o.x(s);i.push({x:d,largura:Math.max(0,o.x(Math.min(c,t))-d),rotulo:p})},n=i=>new Date(i);if(o.escala==="mes")for(let i=n(o.origem).getUTCFullYear();Date.UTC(i,0,1)<t;i++)a(e,Math.max(Date.UTC(i,0,1),o.origem),Date.UTC(i+1,0,1),String(i));else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;){let p=Math.max(Date.UTC(s,c,1),o.origem);a(e,p,Date.UTC(s,c+1,1),`${pl[c]} de ${s}`),c+=1,c>11&&(c=0,s+=1)}}if(o.escala==="dia")for(let i=o.origem;i<t;i+=864e5)a(r,i,i+864e5,String(n(i).getUTCDate()));else if(o.escala==="semana"){let s=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-s*864e5;c<t;c+=7*864e5){let p=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${Pe(p.getUTCDate())}/${Pe(p.getUTCMonth()+1)}`)}}else{let i=n(o.origem);for(let s=i.getUTCFullYear(),c=i.getUTCMonth();Date.UTC(s,c,1)<t;)a(r,Math.max(Date.UTC(s,c,1),o.origem),Date.UTC(s,c+1,1),ll[c]),c+=1,c>11&&(c=0,s+=1)}return{cima:e,baixo:r}}function De(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var kr={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function we(o){return o.titulo||o.nrSei||"Documento"}var ul=8;function St(o){let e=[],r=De(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${vo(o.recebido)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${vo(o.recebido)}${o.usuarioRecebeu?` por ${Qo(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${vo(o.enviouEm)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${vo(o.remetido)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${$o(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${we(n)} - ${vo(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,ul);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:kr[r],linhas:e,...t.length?{documentos:a}:{}}}function An(o,e){return{titulo:we(o),linhas:[{rotulo:"Gerado em",valor:`${vo(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function En(o){let e=St(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function Lr(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:Or(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function Ye(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,Xe(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var Nr=o=>wt(o.unidade,o.passagens);function yn(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,ml(r,o,a)},ocultar(){r.hidden=!0}}}function ml(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,i=o.offsetHeight||120,s=a.left-t.left+a.width/2-n/2;s=Math.max(6,Math.min(s,t.width-n-6));let c=a.top-t.top-i-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(s)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function Pn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var fl="http://www.w3.org/2000/svg",Ho=150,so=46,Je=50,ie=8,Ze=20,gl=38,se=6,Dn=16,vl=0;function V(o,e={},...r){let t=document.createElementNS(fl,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var no=o=>Math.round(o*10)/10,wn=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function _r(o,e,r={}){let t=`spro-g${++vl}`,a=r.larguraAlvo!==void 0,n=hn(o),i=Tr(o,e,{...r.agora?{agora:r.agora}:{}}),s=a?Tr(o,e,{pxPorDia:(r.larguraAlvo-Ho-Dn)/Math.max(1,(i.fim-i.origem)/864e5),...r.agora?{agora:r.agora}:{}}):i,c=Ho+s.largura+Dn,p=so+Math.max(1,n.length)*Je+8,d=V("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${no(c)} ${p}`,width:a?"100%":no(c),...a?{}:{height:p},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});d.append(V("defs",{},V("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},V("rect",{width:8,height:8,class:"listra-fundo"}),V("rect",{width:4,height:8,class:"listra-traco"})),V("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},V("rect",{width:6,height:6,class:"pontos-fundo"}),V("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let m=Ho,u=xn(s),f=V("g",{class:"spro-g-corpo"});n.forEach((x,S)=>{f.append(V("rect",{x:0,y:so+S*Je,width:c,height:Je,class:S%2?"raia-par":"raia-impar"}))});let v=V("g",{class:"spro-g-grade","aria-hidden":"true"});for(let x of u.baixo)v.append(V("line",{x1:no(m+x.x),x2:no(m+x.x),y1:so,y2:p,class:"grade"}));if(f.append(v),n.forEach((x,S)=>{let M=so+S*Je,D=V("g",{class:"spro-g-raia","data-raia":x.chave});for(let w of x.passagens){let L=De(w),j=m+s.x(w.recebido.getTime()),W=Math.max(4,s.x(Xe(w))-s.x(w.recebido.getTime())),G=V("g",{class:`spro-g-barra ${L}`,"data-situacao":L,...a?{}:{tabindex:0,role:"img"},"aria-label":En(w)});if(G.append(V("rect",{x:no(j),y:M+ie,width:no(W),height:Ze,rx:4,class:"fundo"})),L==="em-curso")G.append(V("rect",{x:no(j),y:M+ie,width:no(W),height:Ze,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(L==="pendente")G.append(V("rect",{x:no(j),y:M+ie,width:no(W),height:Ze,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(L==="mantido-aberto"&&w.enviouEm){let A=m+s.x(w.enviouEm.getTime());G.append(V("rect",{x:no(A),y:M+ie,width:no(Math.max(2,j+W-A)),height:Ze,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),G.append(V("line",{x1:no(A),x2:no(A),y1:M+ie-3,y2:M+ie+Ze+3,class:"marca-remessa"}))}if(W>=44&&G.append(V("text",{x:no(j+6),y:M+ie+14,class:"texto-barra"},$o(w.duracaoMs))),!a&&r.dica){let A=r.dica,k=St(w);G.addEventListener("pointerenter",()=>A.mostrar(k,G)),G.addEventListener("pointerleave",()=>A.ocultar()),G.addEventListener("focus",()=>A.mostrar(k,G)),G.addEventListener("blur",()=>A.ocultar())}D.append(G);for(let A of w.documentos){let k=m+s.x(A.em.getTime()),T=V("path",{d:`M${no(k)} ${M+gl-se}l${se} ${se}l-${se} ${se}l-${se} -${se}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${we(A)}, ${vo(A.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let N=r.dica,J=An(A,w);N&&(T.addEventListener("pointerenter",()=>N.mostrar(J,T)),T.addEventListener("pointerleave",()=>N.ocultar()),T.addEventListener("focus",()=>N.mostrar(J,T)),T.addEventListener("blur",()=>N.ocultar()));let K=()=>r.aoAbrirDocumento?.(A,w);T.addEventListener("click",K),T.addEventListener("keydown",$=>{let y=$.key;(y==="Enter"||y===" ")&&($.preventDefault(),K())})}D.append(T)}}f.append(D)}),d.append(f),r.agora&&o.some(x=>x.emCurso)&&r.agora.getTime()>=s.origem&&r.agora.getTime()<=s.fim){let x=no(m+s.x(r.agora.getTime()));d.append(V("g",{class:"spro-g-agora","aria-hidden":"true"},V("line",{x1:x,x2:x,y1:so,y2:p}),V("text",{x:Math.min(x+4,c-40),y:so+11},"Agora")))}let b=V("g",{class:"spro-g-cabecalho","aria-hidden":"true"});b.append(V("rect",{x:0,y:0,width:c,height:so,class:"cabecalho-fundo"}));for(let x of u.cima)b.append(V("line",{x1:no(m+x.x),x2:no(m+x.x),y1:0,y2:so,class:"grade-forte"})),x.largura>36&&b.append(V("text",{x:no(m+x.x+6),y:15,class:"eixo-cima"},x.rotulo));for(let x of u.baixo)x.largura>=14&&b.append(V("text",{x:no(m+x.x+x.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},x.rotulo));b.append(V("line",{x1:0,x2:c,y1:so,y2:so,class:"grade-forte"})),d.append(b);let g=V("g",{class:"spro-g-rotulos"});g.append(V("rect",{x:0,y:so,width:Ho,height:p-so,class:"rotulos-fundo"})),n.forEach((x,S)=>{let M=so+S*Je,D=V("text",{x:10,y:M+22,class:"rotulo-raia"},wn(x.rotulo,20)),w=x.nome&&x.nome!==x.sigla?x.nome:"",L=V("g",{"aria-label":`${x.sigla}${w?`, ${w}`:""}: ${x.passagens.length} passagem(ns)`,role:"img"},D);w&&L.append(V("text",{x:10,y:M+37,class:"rotulo-nome"},wn(w,24))),g.append(L)}),g.append(V("line",{x1:Ho,x2:Ho,y1:so,y2:p,class:"grade-forte"})),d.append(g);let E=V("g",{class:"spro-g-canto","aria-hidden":"true"},V("rect",{x:0,y:0,width:Ho,height:so,class:"cabecalho-fundo"}),V("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),V("line",{x1:Ho,x2:Ho,y1:0,y2:so,class:"grade-forte"}),V("line",{x1:0,x2:Ho,y1:so,y2:so,class:"grade-forte"}));return d.append(E),n.length===0&&d.append(V("text",{x:m+12,y:so+28,class:"rotulo-nome"},"Sem passagens.")),d}function Sn(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let i=e.scrollLeft,s=e.scrollTop;r?.setAttribute("transform",`translate(0 ${s})`),t?.setAttribute("transform",`translate(${i} 0)`),a?.setAttribute("transform",`translate(${i} ${s})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var hl=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function Cn(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...hl]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",kr[De(t)],vo(t.recebido),a?vo(a):"",oe(Math.round(t.duracaoMs/864e5*100)/100),$o(t.duracaoMs),t.pendenteRecebimento?"":Qo(t.usuarioRecebeu,t.usuarioRecebeuNome),Qo(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${we(n)} (${Ir(n.em)})`).join(" | ")])}return Pn(r)}function In(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function On(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),i=o.createElement("a");return i.href=n,i.download=e,i.style.display="none",o.body.append(i),i.click(),i.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var bl="spro-g-impressao";function xl(o,e="mes"){let r=Ye(o.passagens),t=Lr(o.passagens),a=[...o.passagens].sort((c,p)=>c.recebido.getTime()-p.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},kr[De(c)]),l("td",{},vo(c.recebido)),l("td",{},c.remetido??c.enviouEm?vo(c.remetido??c.enviouEm):""),l("td",{},$o(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),i=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},Nr(c)),l("td",{},oe(c.dias)),l("td",{},`${oe(c.percentual)}%`),l("td",{},String(c.passagens)))))),s=_r(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:bl,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${$o(r.corridoMs)} (${oe(Or(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${vo(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},s),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),i)}function Tn(o,e,r="mes"){let t=o.defaultView??window,a=xl(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var Rr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${$o(o)}`,kn=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:gn(o,r)}),El=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Ln(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,i=!1,s=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,p=l("div",{class:"spro-g-visao"}),d=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function m(h){if(i||e.sigiloso)return;let P=d();n?.abort();let R=new AbortController;n=R,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...P?{anterior:P}:{}},K();try{let F=await Ae(e,{sinal:R.signal,forcar:h,aoProgresso:(q,Y)=>{i||n!==R||r.tipo!=="coletando"||(r={...r,feito:q,total:Y},W())}});if(i||n!==R)return;r={tipo:"pronto",dados:kn(F.andamentos,F.coletadoEm,e.agora())}}catch(F){if(i||n!==R)return;F instanceof We?r={tipo:"sigiloso"}:El(F)||R.signal.aborted?r={tipo:"cancelado",...P?{anterior:P}:{}}:r={tipo:"erro",mensagem:wo(F),...P?{anterior:P}:{}}}finally{n===R&&(n=null)}K()}function u(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},K(),n.abort())}let f=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),v=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),b=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},f,v),g=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),E=l("div",{class:"spro-g-progresso"}),x=l("div",{class:"spro-g-aviso",role:"status"}),S=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),M=l("button",{type:"button",class:"spro-botao"},H("atualizar",15),"Atualizar"),D=l("button",{type:"button",class:"spro-botao"},H("planilha",15),"Exportar CSV"),w=l("button",{type:"button",class:"spro-botao"},H("imprimir",15),"Imprimir"),L=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),M,D,w);p.append(l("div",{class:"spro-g-topo"},b,g),E,x,S,L);let j=(h,P=!1)=>{t=h,K(),P&&(h==="gantt"?f:v).focus()};f.addEventListener("click",()=>j("gantt")),v.addEventListener("click",()=>j("tempo")),b.addEventListener("keydown",h=>{let P=h.key;(P==="ArrowRight"||P==="ArrowLeft"||P==="Home"||P==="End")&&(h.preventDefault(),j(P==="Home"?"gantt":P==="End"||t==="gantt"?"tempo":"gantt",!0))}),M.addEventListener("click",()=>void m(!0)),D.addEventListener("click",()=>{let h=d();h?.passagens.length&&(On(e.topo,In(e.protocolo),Cn(h.passagens)),ao(e,"CSV do hist\xF3rico gerado.",2500))}),w.addEventListener("click",()=>{let h=d();h?.passagens.length&&Tn(e.topo,{protocolo:e.protocolo,passagens:h.passagens,agora:ne(e.agora()),coletadoEm:ne(new Date(h.coletadoEm))})});function W(){if(r.tipo!=="coletando")return;let{feito:h,total:P,cancelando:R}=r,F=R?"Cancelando a coleta\u2026":P>0?`Coletando o hist\xF3rico: p\xE1gina ${h} de ${P}`:"Coletando o hist\xF3rico\u2026",q=E.querySelector(".spro-g-prog-barra"),Y=E.querySelector(".spro-g-prog-texto");if(Y&&(Y.textContent=F),q){let ro=P>0?Math.round(h/P*100):0;q.setAttribute("aria-valuenow",String(ro));let Io=q.firstElementChild;Io&&(Io.style.width=P>0?`${ro}%`:""),q.classList.toggle("indeterminado",P<=0)}}function G(){if(r.tipo!=="coletando"){E.hidden=!0,E.replaceChildren();return}E.hidden=!1;let h=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},H("cancelar",14),"Cancelar coleta");h.addEventListener("click",u),E.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),h),W()}function A(){let h=r,P=(q,Y)=>{let ro=l("button",{type:"button",class:"spro-botao pequeno"},q);return ro.addEventListener("click",Y),ro};x.className="spro-g-aviso",x.replaceChildren(),x.hidden=!0;let R=(q,Y,...ro)=>{x.hidden=!1,x.className=`spro-g-aviso ${q}`,x.replaceChildren(H("alerta",15),l("span",{class:"spro-g-aviso-texto"},Y),...ro)},F=e.agora().getTime();h.tipo==="sigiloso"?R("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):h.tipo==="erro"?R("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${h.mensagem}`,P("Tentar de novo",()=>void m(!1))):h.tipo==="cancelado"?R("cancelado","Coleta cancelada.",P("Coletar de novo",()=>void m(!1))):h.tipo==="coletando"&&h.anterior&&!h.cancelando?R("desatualizado",`Mostrando o hist\xF3rico coletado ${Rr(F-h.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):h.tipo==="pronto"&&F-h.dados.coletadoEm>=18e5&&R("desatualizado",`Este hist\xF3rico foi coletado ${Rr(F-h.dados.coletadoEm)}.`,P("Atualizar agora",()=>void m(!0))),(h.tipo==="erro"||h.tipo==="cancelado")&&h.anterior&&R(h.tipo==="erro"?"erro":"cancelado",`${h.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${h.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${Rr(F-h.anterior.coletadoEm)} (desatualizado).`,P("Tentar de novo",()=>void m(!1)))}function k(){s?.(),s=null,S.replaceChildren();let h=d();if(r.tipo==="sigiloso"){S.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!h){S.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!h.passagens.length){S.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}S.setAttribute("aria-labelledby",`${c}-aba-${t}`),S.append(t==="gantt"?T(h):N(h))}function T(h){let P=ne(e.agora());a??=bn(h.passagens,980);let R=a,F=l("div",{class:"spro-g-quadro"}),q=yn(F,`${c}-dica`),Y=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),ro=_r(h.passagens,R,{agora:P,dica:q,aoAbrirDocumento:(B,X)=>o.abrirDocumento(B,X)});Y.append(ro),F.prepend(Y),s=Sn(ro,Y),Y.addEventListener("scroll",()=>q.ocultar());let Io=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let B of Cr){let X=l("button",{type:"button","aria-pressed":String(B.id===R),"data-escala":B.id},B.rotulo);X.addEventListener("click",()=>{if(a===B.id)return;let Oo=Y.scrollWidth>0?Y.scrollLeft/Y.scrollWidth:0;a=B.id,K();let Eo=S.querySelector(".spro-g-rolagem");Eo&&(Eo.scrollLeft=Oo*Eo.scrollWidth)}),Io.append(X)}let I=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");I.addEventListener("click",()=>{Y.scrollLeft=Y.scrollWidth});let U=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([B,X])=>l("li",{},l("span",{class:`spro-g-amostra ${B}`,"aria-hidden":"true"}),X)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},Io,I,U),F)}function N(h){let P=Lr(h.passagens),R=Ye(h.passagens),F=Math.max(1,...P.map(q=>q.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${R.passagens} passagem(ns) por ${R.unidades} unidade(s). Tempo corrido do processo: ${$o(R.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...P.map(q=>{let Y=l("span",{class:`spro-g-barra-pct${q.emCurso?" em-curso":""}`});return Y.style.width=`${Math.max(1,Math.round(q.percentual/F*100))}%`,l("tr",{},l("th",{scope:"row"},Nr(q),q.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},oe(q.dias)),l("td",{class:"num"},`${oe(q.percentual)}%`),l("td",{class:"num"},String(q.passagens)),l("td",{class:"barra","aria-hidden":"true"},Y))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function J(){let h=d(),P=r.tipo==="coletando",R=!h?.passagens.length;M.disabled=P||r.tipo==="sigiloso",D.disabled=R,w.disabled=R;let F=L.querySelector(".spro-g-frescor");F&&(F.textContent=h?`Coletado em ${vo(ne(new Date(h.coletadoEm)))} (${Rr(e.agora().getTime()-h.coletadoEm)})`:"")}function K(){f.setAttribute("aria-selected",String(t==="gantt")),v.setAttribute("aria-selected",String(t==="tempo")),f.setAttribute("tabindex",t==="gantt"?"0":"-1"),v.setAttribute("tabindex",t==="tempo"?"0":"-1");let h=d();g.textContent=h?.passagens.length?`${h.passagens.length} passagem(ns)`:"",G(),A(),k(),J()}K();let $=setInterval(()=>{i||J()},3e4);$.unref?.();let y=(async()=>{if(e.sigiloso)return;let h=await xe(e);i||(h&&!h.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:kn(h.historico.andamentos,h.historico.coletadoEm,e.agora())},K()),await m(!1))})();return{el:p,estado:()=>r,destruir(){i=!0,clearInterval($),n?.abort(),s?.()},pronta:y}}function yl(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function Nn(o,e){let r=e.nrSei??e.titulo,t=yl(o,e);if(!t)return ao(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return ao(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return eo(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var _n="spro-g-dialogo";function Rn(o,e={}){let r=o.topo.querySelector(`dialog.${_n}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=Ln({ctx:o,abrirDocumento:n=>void Nn(o,n),...e}),a=eo(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(_n),{...t,fechar:a.fechar}}function $n(o,e){let r=()=>{e().then(t=>{if(!t){ao({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}Rn(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(xr,r),()=>o.removeEventListener(xr,r)}async function Mt(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var qn=0,Hn=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",Qe=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return xt(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Hn(e)?e:null}catch{return null}}async gravar(e){if(!At(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return qn+=1,await Il(this.area,qn%25===0),!0}};async function Il(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(s=>s.startsWith(Dr)).length<=200)return 0;let r=await Mt(o,Dr),t=Object.entries(r).filter(([,i])=>Hn(i)).map(([i,s])=>({k:i,em:s.em,bytes:JSON.stringify(s).length})).sort((i,s)=>s.em-i.em),a=[],n=0;t.forEach((i,s)=>{n+=i.bytes,(s>=200||n>2097152)&&a.push(i.k)});for(let i of Object.keys(r))t.some(s=>s.k===i)||a.push(i);return a.length&&await o.remover(a),a.length}catch{return 0}}var Fn=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),or=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return yt(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Fn(e)?e:null}catch{return null}}async gravar(e){if(!At(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Ol(this.area,this.agora()),!0}};async function Ol(o,e){try{let r=await Mt(o,Et),t=Object.entries(r).filter(([,n])=>Fn(n)).map(([n,i])=>({k:n,em:i.coletadoEm})).sort((n,i)=>i.em-n.em),a=new Set;t.forEach((n,i)=>{(i>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(i=>i.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var Ll=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",Se=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new Qe(e,r,t),this.repoHistorico=new or(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(i=>setTimeout(i,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}renotificar(e){for(let r of[...this.ouvintes])try{r(e)}catch{}}definir(e,r){if(this.fatias.set(e,r),this.renotificar(e),r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let s=(await this.carregarCache())?.fatias[e];s&&(n={dado:s.dado,em:s.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let i;for(let s=0;s<t;s++){s>0&&await this.esperar(400*s);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){i=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:Ll(i),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var Ct=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],Nl={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},_l=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Vn(o){let e=new Set(o?.length?o:_l),r=new Set(["descricao"]);for(let[t,a]of Object.entries(Nl))e.has(a)&&r.add(t);return r}var Un=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),It={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};var Rl={nota:["M3.5 2h17A1.5 1.5 0 0 1 22 3.5V14l-8 8H3.5A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2z","M22 13.4H13.4V22H14l8-8z","M21 15h-6v6z"],usuarioGravata:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2L12 17.6z","M11 13.3h2l.7 1.7-1.3 6.2-.4.4-.4-.4-1.3-6.2z"],etiquetas:["M2 3.7C2 2.8 2.8 2 3.7 2h6.1c.5 0 .9.2 1.3.5l9.4 9.4c.7.7.7 1.8 0 2.5l-5.6 5.6c-.7.7-1.8.7-2.5 0L2.5 10.6C2.2 10.2 2 9.8 2 9.3z","M7.1 5.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z","M13.6 2h2.2c.5 0 .9.2 1.3.5l5.1 5.1c.7.7.7 1.8 0 2.5l-5.3 5.3-1.6-1.6 4.7-4.7c.3-.3.3-.8 0-1.1z"],tag:["M3 4.5A1.5 1.5 0 0 1 4.5 3h6.6c.4 0 .8.2 1.1.4l8.4 8.4c.6.6.6 1.5 0 2.1l-6.6 6.6c-.6.6-1.5.6-2.1 0L3.4 12.1c-.3-.3-.4-.7-.4-1.1z","M7.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"],olho:["M12 4.2C6.6 4.2 2.4 8 .9 12c1.5 4 5.7 7.8 11.1 7.8s9.6-3.8 11.1-7.8C21.6 8 17.4 4.2 12 4.2z","M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z","M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z"],livro:["M6 2h13.5c.8 0 1.5.7 1.5 1.5V17c0 .6-.3 1.1-.8 1.3v2.4c.5.2.8.7.8 1.3 0 .8-.7 1.5-1.5 1.5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z","M8 5.8h9v2.6H8z","M6 18.3h12.7V20.6H6A1.15 1.15 0 0 1 6 18.3z"],favorito:["M5.5 2h13c.8 0 1.5.7 1.5 1.5V22.3l-8-5.6-8 5.6V3.5C4 2.7 4.7 2 5.5 2z"],usuarios:["M9 3.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z","M2 20.4c0-3.8 2.8-6.4 7-6.4s7 2.6 7 6.4v.2c0 .8-.6 1.4-1.4 1.4H3.4C2.6 22 2 21.4 2 20.6z","M17.2 4.6a3.3 3.3 0 1 1 0 6.6c-.4 0-.8-.1-1.2-.2a5.6 5.6 0 0 0 0-5.6c.4-.5.7-.8 1.2-.8z","M17.6 13.2c2.4.5 4.4 2.4 4.4 5.4v2c0 .8-.6 1.4-1.4 1.4h-2.7c.3-.4.5-.9.5-1.4v-.2c0-2.4-.8-4.4-2.1-5.8.4-.5.8-1 1.3-1.4z"],balaoPontos:["M12 2.4c-5.8 0-10.5 3.8-10.5 8.6 0 2.2 1 4.2 2.8 5.7-.2 1.5-.8 2.8-1.7 3.9-.3.3 0 .8.4.8 2.2 0 4.1-.9 5.4-1.8.9.2 1.7.3 2.6.3 5.8 0 10.5-3.9 10.5-8.9S17.8 2.4 12 2.4z","M7.4 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M12 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M16.6 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"],balao:["M4 2.5h16A2.5 2.5 0 0 1 22.5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-6.2l-5.1 4v-4H4a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 4 2.5z"],caixa:["M5.4 3h13.2c.6 0 1.2.4 1.4 1l2 7.2V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7.8l2-7.2c.2-.6.8-1 1.4-1z","M5.4 6.2 4.2 11.2H8.8l1 2.6h4.4l1-2.6h4.6L18.6 6.2z"],globo:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M7.6 4.8 11 4.2l1.3 2.4-1.8 1.9.5 2.4-3 1-2.4-1.4-.1-2.9z","M12.8 13.6l2.8-.7 2.6 2.2-1 4-2.6 2.8-1.4-1.4.7-3.7z"],cadeado:["M5 10h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 22H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 10z","M7.5 10V7a4.5 4.5 0 0 1 9 0v3h-2.4V7a2.1 2.1 0 0 0-4.2 0v3z","M12 13.7a1.7 1.7 0 0 1 .8 3.2l.4 2.6h-2.4l.4-2.6a1.7 1.7 0 0 1 .8-3.2z"],semUsuario:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2-1.2 1.2-2.8 1.8-4.6 1.8s-3.4-.6-4.6-1.8z","M2.6 4.4 4 3l17.5 17.5-1.4 1.4z"],lapis:["M3 17.3V21h3.7L18.6 9.1l-3.7-3.7z","M21.5 6.2a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"],lixeira:["M6 21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6z","M19 4h-3.5l-1-1h-5l-1 1H5v2h14z"],mais:["M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"],alerta:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M10.6 6.5h2.8v7.3h-2.8z","M10.6 15.6h2.8v2.8h-2.8z"],chevron:["M3.5 8.2 5.4 6.3 12 12.9l6.6-6.6 1.9 1.9L12 16.7z"],disquete:["M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z","M12 12.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z","M5.5 5h8v4h-8z"],checkQuadro:["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M10.4 16.9 6.2 12.7l1.4-1.4 2.8 2.8 6-6 1.4 1.4z"],calendarioMais:["M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2z","M11 10.5h2v2.5h2.5v2H13v2.5h-2V15H8.5v-2H11z"],fechar:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M8.2 9.6 9.6 8.2 12 10.6l2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4z"],lupa:["M10.5 2a8.5 8.5 0 0 1 6.7 13.7l5.4 5.4-2.1 2.1-5.4-5.4A8.5 8.5 0 1 1 10.5 2z","M10.5 5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"],cima:["M12 3.5 4.5 11h5v9.5h5V11h5z"],baixo:["M12 20.5 4.5 13h5V3.5h5V13h5z"]};function xo(o,e=16,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"currentColor",stroke:"none","aria-hidden":"true",focusable:"false",class:"spro-glifo spro-icone"};for(let[s,c]of Object.entries(n))a.setAttribute(s,c);let i=r.createElementNS(t,"path");return i.setAttribute("d",Rl[o].join("")),i.setAttribute("fill-rule","evenodd"),a.append(i),a}function Me(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},xo(o.icone,16))}function $l(o,e){let r=o.ownerDocument,t=e.map(a=>typeof a=="string"?r.createTextNode(a):a);for(t.forEach((a,n)=>{let i=o.childNodes[n];i!==a&&(i&&i.nodeType===3&&a.nodeType===3&&i.textContent===a.textContent||o.insertBefore(a,i??null))});o.childNodes.length>t.length;)o.lastChild?.remove()}function Bn(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=xo("chevron",16),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("span",{class:"spro-p-icone","aria-hidden":"true"},xo(o.icone,16)),i=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("div",{class:"spro-p-titulo"},n,l("h3",{},o.titulo)),e,a),r),s=p=>{i.toggleAttribute("data-recolhido",!p),a.setAttribute("aria-expanded",String(p)),r.hidden=!p};s(o.aberto),a.addEventListener("click",()=>{let p=i.hasAttribute("data-recolhido");s(p),o.aoAlternar(p)});let c=o.icone;return{el:i,definirAberto:s,atualizar(p,d){i.setAttribute("data-estado",p),d.icone&&d.icone!==c&&(c=d.icone,n.replaceChildren(xo(d.icone,16))),e.replaceChildren(...(d.acoes??[]).map(Me)),$l(r,d.corpo.filter(m=>m!=null&&m!==!1))}}}var zl="configViewFlashPanelArvorePro",Ot="optionsPro";function Tt(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function jn(o){let e=Tt(o,zl);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function Ce(o){let e=Tt(o,Ot);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function Wn(o){return Ce(o).optionsFlashMenu_panelinfo!=="disabled"}function Kn(o,e){return Ce(o)[`panelDadosArvorePro_${e}`]!=="hide"}function Xn(o,e,r){try{let t=Ce(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Ot,JSON.stringify(t))}catch{}}function $r(o,e){let r=Tt(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function er(o,e){return Ce(o)[`optionsFlashMenu_${e}`]!=="disabled"}var Gn=o=>o===!0||o==="true";function Yn(o){let e=Ce(o);return{tramitadoNaUnidade:Gn(e.panelDadosArvoreInteressados_tramiteUnidade),mesmaNatureza:Gn(e.panelDadosArvoreInteressados_mesmaNatureza)}}function Jn(o,e){try{let r=Ce(o);r.panelDadosArvoreInteressados_tramiteUnidade=e.tramitadoNaUnidade,r.panelDadosArvoreInteressados_mesmaNatureza=e.mesmaNatureza,o.setItem(Ot,JSON.stringify(r))}catch{}}var ql=/[\u0300-\u036f]/g,oi=o=>o.normalize("NFD").replace(ql,"");var rr=o=>String(o).padStart(2,"0"),zr=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Zn=/(\d{1,2}):(\d{2})/;function tr(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=oi(e),t=r.length===e.length?r:e,a=zr.exec(t);if(!a)return{prazo:null,texto:e};let n=Zn.exec(t.slice(a.index+a[0].length))??Zn.exec(t),i=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),s=`${a[3]}-${rr(Number(a[2]))}-${rr(Number(a[1]))}`,c=n?`${rr(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:s,hora:c,vencimento:i},texto:d}}function ei(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var Hl=864e5;function Ie(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,i]=o.hora.split(":").map(Number),s=new Date(r??1970,(t??1)-1,a??1,n??23,i??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(s.getFullYear(),s.getMonth(),s.getDate()),d=Math.round((p.getTime()-c.getTime())/Hl);return d===0?{rotulo:s.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:s.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function qr(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function ri(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var ce=500,ti=/^\s*\[( |x|X)\]\s?/;function Hr(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=ti.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function ai(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function ni(o,e){let r=Hr(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",ai(r))}function ii(o,e,r){let t=Hr(o),a=t.slice(e,r+1),n=a.length>0&&a.every(i=>i.marca!==null);for(let i of a)i.marca=n?null:i.marca??"aberto";return ai(t)}function Fr(o,e){let r=0,t=Math.min(Math.max(e,0),o.length);for(let a=0;a<t;a++)o[a]===`
`&&(r+=1);return r}function Oe(o,e){let r=0;for(let t=0;t<o.length;t++){if(r===e)return t;o[t]===`
`&&(r+=1)}return o.length}function si(o,e,r,t){let a=o.replace(/\r\n?/g,`
`).split(`
`);if(e<0||r>=a.length||e>r||(t===-1?e===0:r===a.length-1))return null;let n=a.slice(e,r+1);if(t===-1){let s=a[e-1];return a.splice(e-1,n.length+1,...n,s),{texto:a.join(`
`),de:e-1,ate:r-1}}let i=a[r+1];return a.splice(e,n.length+1,i,...n),{texto:a.join(`
`),de:e+1,ate:r+1}}function ci(o,e){let r=Oe(o,Fr(o,e)),t=o.indexOf(`
`,r),a=t===-1?o.length:t,n=o.slice(r,a),i=ti.exec(n);if(!i||e<r+i[0].length)return null;if(n.slice(i[0].length).trim()===""&&e>=a)return{texto:`${o.slice(0,r)}${o.slice(a)}`,pos:r};let c=o.slice(0,e),p=o.slice(e);return{texto:`${c}
[ ] ${p.replace(/^[ \t]+/,"")}`,pos:c.length+5}}function Fl(o){let e=zr.exec(oi(o));return e?`${rr(Number(e[1]))}/${rr(Number(e[2]))}/${e[3]}`:null}function li(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return zr.test(o)?o.replace(zr,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function ar(o){let e=Fl(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function No(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function pi(o,e){return No(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function Qn(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function di(o,e,r){return[{unidade:e,observacao:Qn(o)},...r.map(a=>({unidade:a.unidade,observacao:Qn(a.observacao)}))].filter(a=>a.observacao)}function ui(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function mi(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function fi(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function gi(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function vi(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function Vl(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function hi(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},H("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function le(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function ee(o){return l("div",{class:"spro-p-nota"},o)}function Fo(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[hi(o.erro??"",e)]:[Vl(t)];let a=r(o.dado);return o.estado==="erro"?[...a,hi(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}var Ul={amarelo:"#fff200",amarelo_claro:"#dde134",amarelo_ouro:"#f7b431",azul:"#4285f4",azul_ceu:"#009df2",azul_marinho:"#002d9e",azul_riviera:"#205d8c",bege:"#f8d396",branco:"#ffffff",bronze:"#a56738",champagne:"#e0a076",ciano:"#00ffff",cinza:"#c0c0c0",cinza_escuro:"#527b79",laranja:"#ff5f00",lilas:"#c892d8",marrom:"#61280a",ouro:"#a7790b",prata:"#81979d",preto:"#000000",rosa:"#ff1cae",rosa_claro:"#ffa7dc",roxo:"#68339b",tijolo:"#c35107",verde:"#00ff00",verde_abacate:"#00a884",verde_agua:"#00c4ba",verde_amazonas:"#007725",verde_escuro:"#004225",verde_turquesa:"#00858a",vermelho:"#ff4545",vinho:"#633039"},bi="#9aa3ac";function Bl(o){let e=/marcador_([a-z_]+)\.(?:svg|png)/i.exec(o??"");return e?.[1]?e[1].toLowerCase():null}var xi=o=>{let e=o.length===4?`#${[...o.slice(1)].map(r=>r+r).join("")}`:o;return[1,3,5].map(r=>Number.parseInt(e.slice(r,r+2),16))};function Gl(o){let[e,r,t]=xi(o).map(a=>{let n=a/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4});return .2126*e+.7152*r+.0722*t}var jl=o=>`#${o.map(e=>Math.round(e).toString(16).padStart(2,"0")).join("")}`;function Wl(o,e){return jl(xi(o).map(r=>r+(255-r)*e))}function Kl(o){let e=Bl(o),r=e?Ul[e]:void 0;if(!r)return{nome:e,claro:bi,escuro:bi};if(e==="preto")return{nome:e,claro:r,escuro:"#d5d9de"};let t=r;for(let a=.2;Gl(t)<.17&&a<=.8;a+=.1)t=Wl(r,a);return{nome:e,claro:r,escuro:t}}function Te(o,e=16,r=document){let t=Kl(o),a=xo("tag",e,r);return a.setAttribute("class","spro-glifo spro-icone spro-tag"),a.setAttribute("style",`--spro-tag:${t.claro};--spro-tag-escuro:${t.escuro}`),t.nome&&a.setAttribute("data-cor",t.nome),a}function kt(o){let[e="",...r]=o.split(" - ");return r.length?{login:e.trim(),nome:r.join(" - ").trim()}:{login:o.trim(),nome:""}}function Ai(o){return o.map(e=>{let{login:r,nome:t}=kt(e.texto);return t?{valor:e.valor,rotulo:r,complemento:t}:{valor:e.valor,rotulo:r}})}function Ei(o,e=document){return o.map(r=>({valor:r.valor,rotulo:r.texto,marca:()=>Te(r.icone,16,e)}))}function nr(o){return o.map(e=>({valor:e.valor,rotulo:e.texto}))}function yi(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"}),a=eo(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});Xl(o,a,t,e,r)}function Xl(o,e,r,t,a){let n,i=jo({rotulo:"Grupo",vazio:"(sem grupo)",dicaBusca:"Buscar grupo\u2026",carregar:async()=>{let f=await o.op.opcoesAcompanhamento();return n=f.atual,[{valor:"",rotulo:"(sem grupo)"},...nr(f.grupos)]},valor:()=>n}),s=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});s.value=t?t.observacao??"":a.slice(0,450);let c=o.reaberturaProgramada||!!t?.reabertura,p=Jo("Reabertura programada",!!t?.reabertura,f=>d.hidden=!f),d=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!t?.reabertura});d.value=t?.reabertura?mi(t.reabertura):"";let m=bo("Salvar",()=>void u()),u=async()=>{if(c&&p.input.checked&&!d.value){e.erro("Informe a data da reabertura.");return}let f=fi(s.value,c&&p.input.checked?ui(d.value):null);await e.gravar(()=>o.op.acompanhar({grupo:i.valor(),observacao:f}),[m])&&o.recarregar("acompanhamento")};Sr(r,c?p.el:null,c?l("div",{class:"spro-p-grade"},d):null,So("Grupo",i.el),So("Observa\xE7\xE3o",s),go(m))}var lo=(o,e)=>o.loja.ler(e);function ho(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void Qa(o,e)},e,...t)}function ke(o,e){return ee(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var Ao=(...o)=>l("div",{class:"spro-p-linha"},...o);function Yl(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?Ie({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},H("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var Pi={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=lo(o,"acompanhamento"),r=lo(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>yi(o,a,t)}]:[],corpo:Fo(e,()=>o.recarregar("acompanhamento"),i=>{if(!i.disponivel)return[ke(i.motivo,"O acompanhamento especial")];if(!i.valor)return[le("Sem acompanhamento especial.")];let{observacao:s,grupo:c,reabertura:p}=i.valor;return[Ao(ho(o,s?`${s}${c?` (${c})`:""}`:c??"Acompanhado")),p?Ao(Yl(p,o.agora())):null]})}}}};var _o=o=>o.replace(/\r\n?/g,`
`).trim(),Di=(o,e)=>(o===null||_o(o.texto)==="")&&(e===null||_o(e.texto)==="")?!0:o!==null&&e!==null&&_o(o.texto)===_o(e.texto)&&o.prioridade===e.prioridade;function wi(o,e){let r=o.doc,t=e.confirmar??((O,z)=>ye(o,O,z)),a=e.ambiente??{focoEmOutroQuadro:()=>{let O=o.topo.activeElement,z=r.defaultView?.frameElement??null;return!!O&&O.tagName==="IFRAME"&&O!==z&&O.getClientRects().length>0},ativo:()=>r.activeElement},n=e.inicial&&_o(e.inicial.texto)?e.inicial:null,i=n?.prioridade??!1,s="editando",c=!1,p=!1,d=0,m=0,u=O=>Date.now()-O<1500,f=!1,v,b,g=l("textarea",{class:"spro-p-post-it-texto",rows:"4",maxlength:String(ce),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});g.value=n?.texto??"";let E=l("span",{class:"spro-p-contador"}),x=l("span",{class:"spro-p-post-it-situacao",role:"status","aria-live":"polite"}),S=l("span",{class:"spro-p-post-it-aviso-texto"}),M=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Tentar de novo"),D=l("div",{class:"spro-p-post-it-aviso erro",role:"alert",hidden:!0},S,M),w=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Usar a vers\xE3o do SEI"),L=l("div",{class:"spro-p-post-it-aviso desatualizado",role:"status",hidden:!0},l("span",{class:"spro-p-post-it-aviso-texto"},"Esta anota\xE7\xE3o mudou no SEI enquanto voc\xEA editava. Se salvar, a sua vers\xE3o substitui a do SEI."),w),j=(O,z,oo,yo="")=>l("button",{type:"button",class:`spro-p-post-it-botao${oo?"":" so-icone"}${yo?` ${yo}`:""}`,"aria-label":O},xo(z,16),oo?l("span",{class:"spro-p-post-it-botao-texto"},oo):null),W=j("Salvar anota\xE7\xE3o","disquete","Salvar","primario"),G=j("Prioridade","alerta","Prioridade","prioridade");G.setAttribute("aria-pressed",String(i));let A=j("Transformar as linhas selecionadas em checklist","checkQuadro","Checklist"),k=j("Subir as linhas selecionadas","cima",null),T=j("Descer as linhas selecionadas","baixo",null),N=l("input",{type:"date",class:"spro-p-post-it-data","aria-label":"Data para inserir na anota\xE7\xE3o"});N.value=ar(g.value)??"";let J=j("Remover anota\xE7\xE3o","lixeira",null,"perigo"),K=j("Descartar altera\xE7\xF5es (Esc)","fechar",null),$=l("div",{class:"spro-p-post-it-barra",role:"toolbar","aria-label":"Ferramentas da anota\xE7\xE3o"},W,G,A,k,T,l("span",{class:"spro-p-post-it-data-rotulo"},xo("calendarioMais",16),N),l("span",{class:"spro-p-post-it-espaco"}),n?J:null,K),y=l("div",{class:"spro-p-post-it spro-p-post-it-edicao","data-estado":"editando"},g,l("div",{class:"spro-p-post-it-rodape"},E,x),L,D,$),h=()=>{let O=_o(g.value);return O!==_o(n?.texto??"")?!0:O===""?!1:i!==(n?.prioridade??!1)},P=()=>{let O=ce-g.value.length;E.textContent=O<=0?"Voc\xEA atingiu o n\xFAmero m\xE1ximo de caracteres.":`${O} caracteres restantes`},R=()=>{g.style.height="auto";let O=g.scrollHeight;O&&(g.style.height=`${O}px`)},F=()=>{P(),R()},q=(O,z="")=>{s=O,y.setAttribute("data-estado",O);let oo=O==="salvando";g.readOnly=oo;for(let yo of[W,A,k,T,J,K,G])yo.disabled=oo;N.disabled=oo,oo?y.setAttribute("aria-busy","true"):y.removeAttribute("aria-busy"),x.textContent=oo?"Salvando\u2026":"",D.hidden=O!=="erro",S.textContent=O==="erro"?z:""},Y=()=>{clearTimeout(v),r.removeEventListener("pointerdown",To,!0),r.defaultView?.removeEventListener("blur",zo)},ro=O=>{f||(f=!0,Y(),e.aoEncerrar(O))},Io=()=>({ini:g.selectionStart??g.value.length,fim:g.selectionEnd??g.value.length}),I=(O,z=O)=>{try{g.setSelectionRange(O,z)}catch{g.selectionStart=O,g.selectionEnd=z}},U=()=>{let{ini:O,fim:z}=Io(),oo=Fr(g.value,O),yo=Fr(g.value,z),Xo=z>O&&Oe(g.value,yo)===z&&yo>oo?yo-1:yo;return{de:oo,ate:Xo}},B=async()=>{if(f||s==="salvando")return;let O=_o(g.value).slice(0,ce);if(!h()&&s!=="erro"){ro({gravou:!1});return}if(O===""){if(!n){ro({gravou:!1});return}c=!0;let oo=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!oo){g.focus();return}}let z=O===""?!1:i;q("salvando");try{await o.op.anotar({texto:O,prioridade:z})}catch(oo){q("erro",wo(oo)),g.focus();return}q("editando"),n=O===""?null:{texto:O,prioridade:z},ro({gravou:!0,valor:n})},X=async()=>{if(!(f||s==="salvando")){if(h()){c=!0;let O=await t("Descartar as altera\xE7\xF5es desta anota\xE7\xE3o?","Descartar");if(c=!1,!O){g.focus();return}}ro({gravou:!1})}},Oo=async()=>{if(f||s==="salvando"||!n)return;c=!0;let O=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!O){g.focus();return}q("salvando");try{await o.op.anotar({texto:"",prioridade:!1})}catch(z){q("erro",wo(z));return}q("editando"),n=null,ro({gravou:!0,valor:null})},Eo=()=>{clearTimeout(v),v=setTimeout(()=>{if(f||c||p||s!=="editando")return;let O=a.ativo();if(O&&y.contains(O))return;let z=u(m)&&a.focoEmOutroQuadro();if(!(!u(d)&&!z)){if(!h()){ro({gravou:!1});return}_o(g.value)===""&&n||B()}},e.esperaSaidaMs??150)};g.addEventListener("input",()=>{F(),s==="erro"&&(D.hidden=!1)}),g.addEventListener("keydown",O=>{let z=O;if(z.key==="Escape"){z.preventDefault(),z.stopPropagation(),X();return}if(z.key==="Enter"&&(z.ctrlKey||z.metaKey)){z.preventDefault(),B();return}if(z.key==="Enter"&&!z.shiftKey&&!z.altKey&&!z.isComposing){let{ini:oo,fim:yo}=Io();if(oo!==yo)return;let Xo=ci(g.value,oo);if(!Xo||Xo.texto.length>ce)return;z.preventDefault(),g.value=Xo.texto,I(Xo.pos),F();return}z.altKey&&(z.key==="ArrowUp"||z.key==="ArrowDown")&&(z.preventDefault(),mo(z.key==="ArrowUp"?-1:1))});let mo=O=>{let{ini:z,fim:oo}=Io(),{de:yo,ate:Xo}=U(),Yo=si(g.value,yo,Xo,O);if(!Yo)return;let Nc=z-Oe(g.value,yo);g.value=Yo.texto;let ct=Oe(Yo.texto,Yo.de);if(z===oo){let _c=(Yo.texto.split(`
`)[Yo.de]??"").length;I(ct+Math.min(Nc,_c))}else I(ct,Math.max(Oe(Yo.texto,Yo.ate+1)-1,ct));F(),g.focus()};W.addEventListener("click",()=>void B()),K.addEventListener("click",()=>void X()),J.addEventListener("click",()=>void Oo()),k.addEventListener("click",()=>mo(-1)),T.addEventListener("click",()=>mo(1)),G.addEventListener("click",()=>{i=!i,G.setAttribute("aria-pressed",String(i)),y.classList.toggle("prioridade",i)}),y.classList.toggle("prioridade",i),A.addEventListener("click",()=>{let{de:O,ate:z}=U();g.value=ii(g.value,O,z).slice(0,ce),F(),g.focus()}),N.addEventListener("change",()=>{N.value&&(g.value=li(g.value,N.value).slice(0,ce),F())}),M.addEventListener("click",()=>void B()),w.addEventListener("click",()=>{let O=b??null;n=O&&_o(O.texto)?O:null,g.value=n?.texto??"",i=n?.prioridade??!1,G.setAttribute("aria-pressed",String(i)),y.classList.toggle("prioridade",i),N.value=ar(g.value)??"",b=void 0,L.hidden=!0,y.removeAttribute("data-desatualizado"),F(),g.focus()}),y.addEventListener("pointerdown",()=>{p=!0,setTimeout(()=>{p=!1},600)});for(let O of["pointerup","pointercancel","click"])y.addEventListener(O,()=>{p=!1});let To=O=>{y.contains(O.target)||(d=Date.now())},zo=()=>{m=Date.now(),Eo()};return r.addEventListener("pointerdown",To,!0),r.defaultView?.addEventListener("blur",zo),y.addEventListener("keydown",O=>{O.key==="Tab"&&(d=Date.now())}),y.addEventListener("focusout",O=>{let z=O.relatedTarget;z&&y.contains(z)||Eo()}),P(),q("editando"),R(),{el:y,texto:()=>g.value,prioridade:()=>i,sujo:h,fatiaMudou(O){if(f)return;let z=_o(g.value)?{texto:_o(g.value),prioridade:i}:null,oo=!Di(O,n)&&!Di(O,z);b=oo?O:void 0,L.hidden=!oo,y.toggleAttribute("data-desatualizado",oo)},focar(){g.focus(),I(g.value.length),R()},saiuDoFoco:Eo,salvar:B,descartar:X,destruir(){f=!0,Y()}}}async function Lt(o,e){try{await e()}catch(r){ao(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var ir=new WeakMap;function Jl(o,e){ir.get(o)?.destruir(),ir.delete(o),e.gravou?(o.loja.definir("anotacao",{estado:"pronto",dado:{disponivel:!0,valor:e.valor},em:o.agora().getTime()}),o.recarregar("anotacao")):o.loja.renotificar("anotacao")}function Vr(o,e){let r=ir.get(o);if(r){r.focar();return}let t=wi(o,{inicial:e,aoEncerrar:a=>Jl(o,a)});ir.set(o,t),o.loja.renotificar("anotacao"),t.focar()}var Zl="label.item, input, a, button, textarea",Si={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=lo(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null,a=ir.get(o);return a?(a.fatiaMudou(t),{estado:e.estado,desenho:{acoes:[],corpo:[a.el]}}):{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void Lt(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>Vr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void ye(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(n=>{n&&Lt(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>Vr(o,null)}]:[],corpo:Fo(e,()=>o.recarregar("anotacao"),n=>{if(!n.disponivel)return[ke(n.motivo,"As anota\xE7\xF5es")];if(!n.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>Vr(o,null)},"Adicionar anota\xE7\xE3o"))];let i=n.valor,{texto:s,prioridade:c}=i,p=ar(s),d=p?Ie({data:p,hora:"23:59",vencimento:!0},o.agora()):null,m=Hr(s).map((u,f)=>u.marca===null?l("div",{class:"spro-p-nota-linha"},u.texto||" "):l("label",{class:`spro-p-nota-linha item${u.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:u.marca==="feito",onchange:()=>void Lt(o,()=>o.op.alternarItemDaAnotacao(f))}),l("span",{},u.texto)));return[l("div",{class:`spro-p-post-it editavel${c?" prioridade":""}`,onclick:u=>{u.target?.closest(Zl)||Vr(o,i)}},c?l("span",{class:"spro-p-chip vencido"},xo("alerta",12),"prioridade"):null,...m,p&&d?l("span",{class:`spro-p-chip ${d.nivel}`},xo("calendarioMais",12),`${qr({data:p,hora:"23:59",vencimento:!0})} \xB7 ${d.rotulo}`):null)]})}}}};function Mi(o,e,r){let t,a=jo({rotulo:"Usu\xE1rio da unidade",vazio:"Escolher um usu\xE1rio\u2026",dicaBusca:"Buscar por login ou nome\u2026",limite:150,resumo:(p,d,m)=>d===m?`${m} usu\xE1rios na unidade`:`${d} de ${m} usu\xE1rios`,carregar:async()=>{let{opcoes:p,atual:d}=await o.op.opcoesAtribuicao(),m=e.usuario?p.find(u=>kt(u.texto).login.toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0;return t=d??m,Ai(p)},valor:()=>t}),n=bo("Salvar",()=>void s(a.valor(),n,i)),i=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),s=async(p,...d)=>{if(p===""){c.erro("Escolha um usu\xE1rio.");return}let m=p===null?void 0:a.opcoes().find(f=>f.valor===p);await c.gravar(()=>o.op.atribuir(p),d)&&r(p===null?{usuario:null}:{usuario:m?.rotulo??"",nome:m?.complemento??""})};i.addEventListener("click",()=>void s(null,n,i));let c=eo(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[l("div",{class:"spro-p-modal-lugar"},So("Atribuir para",a.el,e.usuario?`Hoje: ${e.usuario}`:void 0),go(e.usuario?i:null,n))]})}var Ci={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"usuarioGravata",desenhar(o){let e=lo(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:Fo(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,i=t.editavel&&a.unidade.toLowerCase()===r;return Ao(ho(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,i?Me({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>Mi(o,a,s=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(d=>d===a?{...d,usuario:s.usuario,nomeUsuario:s.nome,texto:gi(d.texto,s.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:s.usuario}})})}):null)}):[ee(t.texto||"Processo sem andamento aberto.")],1)}}}};var Ii={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"livro",desenhar(o){let r=lo(o,"blocoInterno").dado;if(r&&br(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[Ao(r.descricao?ho(o,r.descricao):ee("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,i)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${i}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};var Ur=class extends Error{constructor(r,t){super(t);this.codigo=r;this.name="ErroRpc"}};function Ql(o,e){let r=e.replace(/\D/g,""),t=r?o.querySelector(`tr[id="P${r}"] a[href*="procedimento_trabalhar"]`):null;if(t)return{tipo:"linha",link:t};let a=o.querySelector("#frmProtocoloPesquisaRapida"),n=o.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function Oi(o,e,r,t){let a=Ql(o,e);if(!a)throw new Ur("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return t?o.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=r,t&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var Ti=Object.freeze({carregando:!1,erro:null,processos:[],total:null,completa:!1,vazia:!1}),ki=o=>o.idProcedimento??o.protocolo,Br=class{constructor(e,r,t=a=>a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar."){this.buscar=e;this.aoMudar=r;this.mensagemDeErro=t}estado={...Ti};versao=0;controle=null;atual(){return this.estado}iniciar(){this.controle?.abort();let e=++this.versao;this.publicar({...Ti,carregando:!0}),this.carregar(0,e,[])}mais(){let e=this.estado;if(e.carregando||e.completa||e.total===null)return;let r=++this.versao;this.controle?.abort(),this.publicar({...e,carregando:!0,erro:null}),this.carregar(e.processos.length,r,e.processos)}repetir(){this.estado.total===null||!this.estado.processos.length?this.iniciar():this.mais()}parar(){this.controle?.abort(),this.versao+=1}publicar(e){this.estado=e,this.aoMudar(e)}async carregar(e,r,t){let a=new AbortController;this.controle=a;try{let n=await this.buscar(e,a.signal);if(r!==this.versao)return;let i=new Set(t.map(ki)),s=[...t,...n.processos.filter(c=>!i.has(ki(c)))];this.publicar({carregando:!1,erro:null,processos:s,total:n.total,completa:s.length>=n.total||n.processos.length===0,vazia:s.length===0})}catch(n){if(r!==this.versao||a.signal.aborted)return;this.publicar({...this.estado,carregando:!1,erro:this.mensagemDeErro(n)})}}};var op=o=>o===1?"1 processo":`${o} processos`;function ep(o,e){let r=l("button",{type:"button",class:"spro-p-link spro-p-proc-num","aria-label":`Abrir o processo ${o.protocolo}`},H("pasta",14),o.protocolo);r.addEventListener("click",i=>e(o,i.ctrlKey||i.metaKey)),r.addEventListener("auxclick",i=>{i.button===1&&e(o,!0)});let t=o.unidade?o.unidadeNome&&o.unidadeNome!==o.unidade?`${o.unidade} (${o.unidadeNome})`:o.unidade:"",a=o.usuario?o.usuarioNome&&o.usuarioNome!==o.usuario?`${o.usuarioNome} (${o.usuario})`:o.usuario:"",n=[t,a,o.data].filter(Boolean);return l("li",{class:"spro-p-processo"},l("div",{class:"spro-p-processo-topo"},r,o.tipoProcesso?l("span",{class:"spro-p-chip"},o.tipoProcesso):null),n.length?l("div",{class:"spro-p-processo-meta"},...n.map(i=>l("span",{},i))):null)}function Li(o,e){let r=Yn(o.armazenamento),t=Jo("Tramitados na unidade",r.tramitadoNaUnidade,()=>v()),a=Jo(e.tipoNome?`De mesmo tipo (${e.tipoNome})`:"De mesmo tipo",r.mesmaNatureza,()=>v());a.input.disabled=!e.tipo;let n=l("div",{class:"spro-p-nota",role:"status","aria-live":"polite"}),i=l("ul",{class:"spro-p-lista-processos","aria-label":`Processos de ${e.nome}`}),s=l("div",{class:"spro-p-processos-rodape"}),c=l("div",{class:"spro-p-modal-lugar"},n,i,s),p=eo(o,{titulo:"Processos do interessado",icone:"pessoa",largura:640,conteudo:[l("p",{class:"spro-p-interessado-nome"},e.nome),l("div",{class:"spro-p-ferramentas",role:"group","aria-label":"Filtros da pesquisa"},t.el,a.el),c]});p.el.classList.add("spro-p-dialogo-processos");let d=e.id,m=async()=>{if(d)return d;let g=await o.op.formularioDoProcesso(),E=g.interessados.find(x=>x.texto===e.nome)??g.interessados.find(x=>x.texto.startsWith(e.nome));if(!E)throw new Error("N\xE3o achei este interessado no cadastro do processo.");return d=E.id,E.id},u=(g,E)=>{try{Oi(o.topo,g.idProcedimento??"",g.protocolo,E),E||p.fechar()}catch(x){ao(o,x instanceof Error?x.message:"N\xE3o foi poss\xEDvel abrir o processo.",6e3)}},f=new Br(async(g,E)=>o.op.processosDoInteressado({interessadoId:await m(),inicio:g,tramitadoNaUnidade:t.input.checked,...a.input.checked&&e.tipo?{tipoProcesso:e.tipo}:{}},E),g=>b(g),Go),v=()=>{Jn(o.armazenamento,{tramitadoNaUnidade:t.input.checked,mesmaNatureza:a.input.checked}),f.iniciar()};function b(g){if(c.setAttribute("aria-busy",String(g.carregando)),i.replaceChildren(...g.processos.map(E=>ep(E,u))),s.replaceChildren(),g.carregando&&!g.processos.length){n.textContent="Pesquisando os processos do interessado\u2026",i.append(l("li",{class:"spro-p-esqueleto","aria-hidden":"true"},l("span",{class:"spro-p-barra"}),l("span",{class:"spro-p-barra",style:"width:62%"})));return}if(g.erro&&!g.processos.length){n.replaceChildren();let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>f.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${g.erro} `,E));return}if(g.vazia){n.textContent="Nenhum processo encontrado. A pesquisa s\xF3 traz os que voc\xEA pode ver.";return}if(n.textContent=g.total===null?"":`${g.processos.length} de ${op(g.total)}.`,g.erro){let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>f.repetir()),s.append(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${g.erro} `,E))}else if(!g.completa){let E=l("button",{type:"button",class:"spro-botao"},g.carregando?"Carregando\u2026":`Mais resultados (${(g.total??0)-g.processos.length} restantes)`);E.disabled=g.carregando,E.addEventListener("click",()=>f.mais()),s.append(E)}}p.el.addEventListener("close",()=>f.parar()),f.iniciar()}var Gr=class{constructor(e,r=new Map){this.negados=r;this.atuais=[...e]}atuais;novos=[];retirados=new Set;linhas(){let e=r=>{let t=this.negados.get(r);return t===void 0?{}:{negadoPor:t}};return[...this.atuais.map(r=>({item:r,estado:this.retirados.has(r.id)?"retirado":"atual",...e(r.id)})),...this.novos.map(r=>({item:r,estado:"novo"}))]}tem(e){return this.novos.some(r=>r.id===e)||this.atuais.some(r=>r.id===e)&&!this.retirados.has(e)}adicionar(e){return this.tem(e.id)?!1:this.atuais.some(r=>r.id===e.id)?(this.retirados.delete(e.id),!0):(this.novos.push({id:e.id,texto:e.texto}),!0)}alternarRetirada(e){return!this.atuais.some(r=>r.id===e)||this.negados.has(e)?!1:(this.retirados.has(e)?this.retirados.delete(e):this.retirados.add(e),!0)}removerNovo(e){let r=this.novos.findIndex(t=>t.id===e);return r<0?!1:(this.novos.splice(r,1),!0)}resultado(){return[...this.atuais.filter(e=>!this.retirados.has(e.id)),...this.novos]}mudou(){return this.retirados.size>0||this.novos.length>0}contagem(){return{atuais:this.atuais.length-this.retirados.size,retirados:this.retirados.size,novos:this.novos.length}}};var Ni=o=>o.replace(/\s+/g," ").trim(),jr=class{constructor(e){this.o=e;this.minimo=e.minimo??3,this.esperaMs=e.esperaMs??350}versao=0;controle=null;minimo;esperaMs;digitou(e){let r=Ni(e),t=this.cancelar();if(!r)return this.o.aoMudar({tipo:"ocioso"});if(r.length<this.minimo)return this.o.aoMudar({tipo:"curto",falta:this.minimo-r.length});(this.o.esperar??(n=>new Promise(i=>setTimeout(i,n))))(this.esperaMs).then(()=>{t===this.versao&&this.executar(r,t)})}agora(e){let r=Ni(e),t=this.cancelar();if(r.length<this.minimo)return this.o.aoMudar(r?{tipo:"curto",falta:this.minimo-r.length}:{tipo:"ocioso"});this.executar(r,t)}repetir(e){this.agora(e)}parar(){this.cancelar()}cancelar(){return this.controle?.abort(),this.controle=null,++this.versao}async executar(e,r){let t=new AbortController;this.controle=t,this.o.aoMudar({tipo:"pesquisando",termo:e});try{let a=await this.o.pesquisar(e,t.signal);if(r!==this.versao)return;this.o.aoMudar(a.length?{tipo:"resultado",termo:e,itens:a}:{tipo:"vazio",termo:e})}catch(a){if(r!==this.versao||t.signal.aborted)return;this.o.aoMudar({tipo:"erro",termo:e,mensagem:this.o.mensagemDeErro?.(a)??(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar.")})}}};var rp=o=>{let e=[];return o.novos&&e.push(`${o.novos} a acrescentar`),o.retirados&&e.push(`${o.retirados} a retirar`),e.join(", ")};function Nt(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),t=eo(o,{titulo:e.titulo,icone:e.icone,largura:560,conteudo:[r]}),a=i=>{let s=new Gr(i.atuais,i.negados),c=l("h3",{class:"spro-p-lupa-titulo"}),p=l("ul",{class:"spro-p-lista-modal","aria-label":`${e.nomePlural} no processo`}),d=l("input",{type:"search",class:"spro-campo",autocomplete:"off","aria-label":`Pesquisar ${e.nome} para adicionar`,"aria-controls":"spro-p-lupa-resultados",placeholder:"Pesquisar\u2026"}),m=l("div",{class:"spro-p-nota spro-p-lupa-estado",role:"status","aria-live":"polite"}),u=l("ul",{class:"spro-p-lista-modal spro-p-resultados",id:"spro-p-lupa-resultados","aria-label":"Resultados da pesquisa"}),f=l("span",{class:"spro-p-nota spro-p-lupa-situacao","aria-live":"polite"}),v=bo("Salvar",()=>void M()),b={tipo:"ocioso"},g=()=>{let D=s.linhas(),w=s.contagem();c.textContent=`No processo (${w.atuais+w.novos})`,p.replaceChildren(...D.length?D.map(L=>{let j;if(L.negadoPor)j=l("span",{class:"spro-p-chip"},`Acrescentado por ${L.negadoPor}`);else{let W=l("button",L.estado==="novo"?{type:"button",class:"spro-p-acao perigo","aria-label":`Desfazer a inclus\xE3o de ${L.item.texto}`}:{type:"button",class:"spro-p-acao perigo","aria-pressed":String(L.estado==="retirado"),"aria-label":`${L.estado==="retirado"?"Manter":"Retirar"} ${L.item.texto}`},L.estado==="novo"?"Desfazer":L.estado==="retirado"?"Manter":"Retirar");W.addEventListener("click",()=>{L.estado==="novo"?s.removerNovo(L.item.id):s.alternarRetirada(L.item.id),x()}),j=W}return l("li",{class:"spro-p-linha-modal","data-estado":L.estado},L.estado==="novo"?l("span",{class:"spro-p-chip ok"},"Novo"):null,l("span",{class:"spro-p-texto-modal"},L.item.texto),j)}):[l("li",{class:"spro-p-vazio"},`O processo n\xE3o tem ${e.nomePlural}.`)]),v.disabled=!s.mudou(),f.textContent=rp(w)},E=D=>{if(b=D,u.replaceChildren(),u.removeAttribute("aria-busy"),D.tipo==="ocioso")m.textContent=e.dica;else if(D.tipo==="curto")m.textContent=`Digite mais ${D.falta===1?"1 letra":`${D.falta} letras`} para pesquisar.`;else if(D.tipo==="pesquisando")m.textContent="Pesquisando\u2026",u.setAttribute("aria-busy","true");else if(D.tipo==="vazio")m.textContent=`Nenhum resultado para \u201C${D.termo}\u201D.`;else if(D.tipo==="erro"){let w=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");w.addEventListener("click",()=>S.repetir(d.value)),m.replaceChildren(H("alerta",13),` ${D.mensagem} `,w)}else{m.textContent=D.itens.length===1?"1 resultado.":`${D.itens.length} resultados.`;for(let w of D.itens){let L=s.tem(w.id),j=l("button",{type:"button",class:"spro-p-acao","aria-label":L?`${w.texto} (j\xE1 est\xE1 no processo)`:`Adicionar ${w.texto}`},L?"No processo":"Adicionar");j.disabled=L,j.addEventListener("click",()=>{s.adicionar(w)&&(x(),E(b),u.querySelector("button:not([disabled])")?.focus())}),u.append(l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},w.texto),j))}return}},x=()=>g(),S=new jr({pesquisar:i.pesquisar,aoMudar:E,mensagemDeErro:Go,...e.esperaMs!==void 0?{esperaMs:e.esperaMs}:{}});d.addEventListener("input",()=>S.digitou(d.value)),d.addEventListener("keydown",D=>{if(D.key==="Enter")D.preventDefault(),S.agora(d.value);else if(D.key==="ArrowDown"){let w=u.querySelector("button:not([disabled])");w&&(D.preventDefault(),w.focus())}}),u.addEventListener("keydown",D=>{if(D.key!=="ArrowDown"&&D.key!=="ArrowUp")return;let w=[...u.querySelectorAll("button:not([disabled])")],L=w.indexOf(D.target);L<0||(D.preventDefault(),D.key==="ArrowDown"?w[Math.min(L+1,w.length-1)]?.focus():L===0?d.focus():w[L-1]?.focus())}),t.el.addEventListener("close",()=>S.parar());let M=async()=>{let D=s.resultado();if(e.obrigatorio&&!D.length){t.erro(e.obrigatorio);return}await t.gravar(()=>e.gravar(D),[v])&&e.depois()};r.replaceChildren(c,p,l("div",{class:"spro-p-lupa-busca"},l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},`Adicionar ${e.nome}`),d),m,u),go(f,v)),g(),E({tipo:"ocioso"}),d.focus({preventScroll:!0})},n=()=>{r.replaceChildren(l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),e.carregar().then(i=>{t.el.isConnected&&a(i)}).catch(i=>{if(!t.el.isConnected)return;let s=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");s.addEventListener("click",n),r.replaceChildren(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${Go(i)} `,s))})};n()}async function tp(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var ap=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function _i(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=bo("Salvar",()=>void n()),a=eo(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[So("Especifica\xE7\xE3o",r),go(t)]});r.addEventListener("keydown",i=>{i.key==="Enter"&&(i.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function Ri(o,e){let r,t=jo({rotulo:"Tipo de processo",vazio:"Escolher o tipo\u2026",dicaBusca:"Buscar tipo de processo\u2026",limite:150,resumo:(i,s,c)=>s===c?`${c} tipos`:`${s} de ${c} tipos`,carregar:async()=>{let i=await o.op.formularioDoProcesso();return r=i.tipoAtual??i.tipos.find(s=>s.texto===e)?.valor,nr(i.tipos)},valor:()=>r}),a=bo("Salvar",async()=>{if(!t.valor()){n.erro("Escolha um tipo.");return}await n.gravar(()=>o.op.alterarProcesso({tipo:t.valor()}),[a])&&o.recarregar("dadosProcesso")}),n=eo(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[l("div",{class:"spro-p-modal-lugar"},So("Tipo de processo",t.el),go(a))]})}function $i(o){let e=ap("Carregando o formul\xE1rio do processo\u2026"),r=eo(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});tp(o,r,e,t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(d=>l("button",{type:"button",role:"radio","aria-checked":String(d===a),"data-nivel":d},d==="publico"?"P\xFAblico":"Restrito")),i=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),s=jo({rotulo:"Hip\xF3tese legal",vazio:"Escolher a hip\xF3tese legal\u2026",dicaBusca:"Buscar hip\xF3tese legal\u2026",limite:150,adiar:!0,carregar:async()=>nr(await t.hipoteses("1")),valor:t.hipoteseAtual}),c=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"},So("Hip\xF3tese legal",s.el));for(let d of n)d.addEventListener("click",()=>{a=d.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let m of n)m.setAttribute("aria-checked",String(m===d));c.hidden=a!=="restrito",a==="restrito"&&s.carregarAgora()});a==="restrito"&&s.carregarAgora();let p=bo("Salvar",async()=>{if(a==="restrito"&&!s.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:s.valor()}:{nivel:a}),[p])&&o.recarregar("dadosProcesso")});e.replaceChildren(i,c,go(p))})}function zi(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=bo("Salvar",()=>void n()),a=eo(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[So("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),go(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}var qi=(o,e)=>async()=>{let r=await o.op.formularioDoProcesso();return e==="assuntos"?{atuais:r.assuntos,negados:r.assuntosNegados,pesquisar:(t,a)=>r.pesquisarAssuntos(t,a)}:{atuais:r.interessados,negados:r.interessadosNegados,pesquisar:(t,a)=>r.pesquisarContatos(t,a)}};function Hi(o){Nt(o,{titulo:"Interessados do processo",icone:"pessoa",nome:"interessado",nomePlural:"interessados",dica:"Digite o nome do contato para pesquisar.",carregar:qi(o,"interessados"),gravar:e=>o.op.alterarProcesso({interessados:e}),depois:()=>o.recarregar("dadosProcesso")})}function Fi(o){Nt(o,{titulo:"Assuntos do processo",icone:"etiqueta",nome:"assunto",nomePlural:"assuntos",dica:"Digite o c\xF3digo ou parte da descri\xE7\xE3o do assunto.",carregar:qi(o,"assuntos"),gravar:e=>o.op.alterarProcesso({assuntos:e}),depois:()=>o.recarregar("dadosProcesso"),obrigatorio:"O processo precisa ter ao menos um assunto."})}var re=o=>{let e=lo(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},Le=o=>!o.sigiloso&&!!re(o)?.editavel;async function Wr(o,e){let r=re(o);if(!r)return;let t=!No(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:pi(r.especificacao,e).slice(0,100)});ao(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){ao(o,wo(a),7e3)}o.recarregar("dadosProcesso")}function Kr(o,e,r=2){let t=lo(o,"dadosProcesso");return Fo(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[ke(a.motivo,"Este dado")],r)}var Vi={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"balaoPontos",desenhar(o){let e=lo(o,"dadosProcesso"),r=re(o),t=[];return r&&Le(o)&&(t.push({icone:"alerta",rotulo:No(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:No(r.especificacao,"URGENTE"),aoClicar:()=>void Wr(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:No(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:No(r.especificacao,"TRANCADO"),aoClicar:()=>void Wr(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>_i(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:Kr(o,a=>[Ao(ho(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${No(a.valor.especificacao,"URGENTE")?"urgente":""} ${No(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},Ui={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"caixa",desenhar(o){let e=re(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&Le(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>Ri(o,r)}]:[],corpo:[Ao(ho(o,r||"(n\xE3o informado)"))]}}}},Bi={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"globo",desenhar(o){let e=re(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":en.publico;return{estado:"pronto",desenho:{icone:r==="restrito"?"cadeado":r==="sigiloso"?"semUsuario":"globo",acoes:e&&Le(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>$i(o)}]:[],corpo:[Ao(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},H(on[r],13)),ho(o,a))]}}}},Gi={tipo:"interessados",titulo:"Interessados",icone:"usuarios",desenhar(o){return{estado:lo(o,"dadosProcesso").estado,desenho:{acoes:re(o)&&Le(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>Hi(o)}]:[],corpo:Kr(o,r=>r.valor.interessados.length?r.valor.interessados.map((t,a)=>{let n=r.valor.interessadosItens?.[a],i=n&&n.texto===t?n.id:void 0;return l("div",{class:"spro-p-linha interessado"},...vi(t).map(s=>ho(o,s)),l("button",{type:"button",class:"spro-p-acao spro-p-proc-do-interessado","aria-label":`Processos de ${t}`,onclick:()=>Li(o,{nome:t,...i?{id:i}:{},...r.valor.idTipo?{tipo:r.valor.idTipo}:{},...r.valor.tipo?{tipoNome:r.valor.tipo}:{}})},xo("lupa",16)))}):[le("Sem interessados.")])}}}},ji={tipo:"assuntos",titulo:"Assuntos",icone:"favorito",desenhar(o){return{estado:lo(o,"dadosProcesso").estado,desenho:{acoes:re(o)&&Le(o)?[{icone:"lapis",rotulo:"Editar assuntos",aoClicar:()=>Fi(o)}]:[],corpo:Kr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>Ao(ho(o,t))):[le("Sem assuntos.")])}}}},Wi={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"balao",desenhar(o){let e=lo(o,"dadosProcesso"),r=re(o);return{estado:e.estado,desenho:{acoes:r&&Le(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>zi(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:Kr(o,t=>{let a=di(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>Ao(ho(o,`${n.unidade}: ${n.observacao}`))):[ee("Sem observa\xE7\xF5es.")]})}}}};var np=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function _t(o,e){let r=l("div",{class:"spro-p-modal-lugar"}),t=eo(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});ip(o,t,r,e)}function ip(o,e,r,t){let a=t?tr(t.texto):{prazo:null,texto:""},n=[],i=jo({rotulo:"Marcador",vazio:"Escolher um marcador\u2026",dicaBusca:"Buscar marcador\u2026",limite:150,carregar:async()=>(n=await o.op.opcoesMarcador(),Ei(n,o.topo)),valor:()=>t?n.find(b=>b.texto===t.nome)?.valor:void 0}),s=Jo("Controlar prazo",!!a.prazo,b=>m.hidden=!b),c=Jo("Controlar vencimento (\u201CAt\xE9\u201D)",!!a.prazo?.vencimento,()=>{}),p=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=a.prazo?.data??np(o.agora());let d=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=a.prazo?.hora??"23:59";let m=l("div",{class:"spro-p-grade",hidden:!a.prazo},c.el,l("div",{class:"spro-p-par"},p,d)),u=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});u.value=a.texto;let f=bo("Salvar",()=>void v()),v=async()=>{let b=n.find(x=>x.valor===i.valor());if(!b){e.erro("Escolha um marcador.");return}if(s.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let g=ei({prazo:s.input.checked?{data:p.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:u.value}),E=await e.gravar(async()=>(t&&b.texto!==t.nome&&await o.op.desmarcar(t.nome),o.op.marcar({marcador:b.texto,texto:g})),[f]);return o.recarregar("marcador"),E};Sr(r,So("Marcador",i.el),t?l("p",{class:"spro-p-nota spro-p-nota-marcador"},Te(t.icone,13,o.topo),` Atual: ${t.nome}. Escolher outro troca o marcador.`):null,s.el,m,So("Texto",u),go(f))}function sp(o,e){let{prazo:r}=tr(e);if(!r)return null;let t=Ie(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},H("relogio",11),`${r.vencimento?"at\xE9 ":""}${qr(r)} \xB7 ${t.rotulo}`)}async function cp(o,e){if(await ye(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);ao(o,r.resumo)}catch(r){ao(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function lp(o,e,r){let{texto:t}=tr(e.texto),a=ho(o,e.nome,"forte");return a.prepend(Te(e.icone,15,o.doc)),Ao(l("div",{class:"spro-p-marcador"},a,sp(o,e.texto),t?ho(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},Me({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>_t(o,e)}),Me({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void cp(o,e)})):null)}var Ki={tipo:"marcador",titulo:"Marcador",icone:"etiquetas",desenhar(o){let e=lo(o,"marcador"),r=ri(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>_t(o)}]:[],corpo:[...Fo(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>lp(o,a,t.editavel)):[le("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},H("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var Xi=[Si,Ci,Ii,Ki,Pi,Vi,Ui,Bi,Gi,ji,Wi];var Yi=1e4;function Ne(o){if(!o.getElementById("frmArvore"))return null;try{return dt(ae(o))}catch{return null}}function sr(o,e=Yi){return new Promise(r=>{let t=Ne(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,i=!1,s=u=>{i||(i=!0,p?.disconnect(),clearTimeout(m),clearInterval(d),r(u))},c=()=>{let u=Ne(o);u&&s(u)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),m=setTimeout(()=>s(null),e)})}var Zi="data-spro-processo-raiz";function pp(o){for(let e of o.querySelectorAll(`[${Zi}], [data-spro-slot="atividades"]`))e.remove()}function Qi(o){return Xi.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&Un.has(e.tipo)))}function os(o){let e=new Set;for(let r of Qi(o))for(let t of It[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function Ji(o){let e=o.doc;qo(e),pp(e);let r=e.getElementById("frmArvore")??e.body,t=ko(e),a=(x="")=>l("div",{class:`spro-p-raiz ${x}`.trim(),[Zi]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),i=a("anotacoes"),s=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(i):r.prepend(i);let p=e.getElementById("divRelacionados");p?p.before(s):i.after(s),r.append(n);let d=new Map,m=Qi(o),u=x=>Ct.indexOf(x);for(let x of m){let S=Bn({tipo:x.tipo,titulo:x.titulo,icone:x.icone,aberto:Kn(o.armazenamento,x.tipo),aoAlternar:M=>Xn(o.armazenamento,x.tipo,M)});d.set(x.tipo,{def:x,casca:S})}for(let x of[...Ct].sort((S,M)=>u(S)-u(M))){let S=d.get(x);S&&n.append(S.casca.el)}let f=d.get("anotacoes");f&&i.append(f.casca.el);let v=x=>{let S=d.get(x);if(!S)return;let M;try{M=S.def.desenhar(o)}catch(D){console.warn(`[SEI Pro] painel ${x}:`,D),M=null}S.casca.el.hidden=M===null,M&&S.casca.atualizar(M.estado,M.desenho)},b=x=>{if(x)v(x);else for(let S of d.keys())v(S)},g=o.loja.aoMudar(x=>{for(let[S,M]of d)It[M.def.tipo].includes(x)&&v(S)});b();let E=Ee(e,()=>{let x=ko(e);for(let S of[n,i])x?S.setAttribute("data-tema","escuro"):S.removeAttribute("data-tema")});return{raiz:n,redesenhar:b,desmontar(){g(),E(),n.remove(),i.remove(),s.remove()}}}function es(o,e,r={}){let t=Ji(o),a=!1,n=o.doc.defaultView,i=r.Observador??n?.MutationObserver??globalThis.MutationObserver,s=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=Ji(o),e?.(t))},c=typeof i=="function"&&o.doc.body?new i(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(s,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}function dp(){let o=globalThis,e=o.wrappedJSObject??o.window?.wrappedJSObject,r=o.exportFunction;return!e||typeof r!="function"?null:{pagina:e,exportFunction:t=>r(t,e)}}function up(o,e){if(!e.pagina.Object)return o;let r=new e.pagina.Object;for(let[t,a]of Object.entries(o))a!==void 0&&(r[t]=a);return r}function rs(o,e,r,t,a=dp()){if(!a)return r?o.request(e,r,t):o.request(e,t);let n=null,{pagina:i,exportFunction:s}=a,c=s(d=>new i.Promise(s(m=>{t(d).then(u=>{n={ok:!0,valor:u},m()},u=>{n={ok:!1,erro:u},m()})}))),p=r?o.request(e,up(r,a),c):o.request(e,c);return Promise.resolve(p).then(()=>{let d=n;if(!d)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(d.ok)return d.valor;throw d.erro})}var mp="seipro-historico-sessao",Rt="seiProHistoricoRestauro",fp=600*1e3,ts;function $t(){if(ts!==void 0)return ts;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function ns(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};$t()?.setItem(Rt,JSON.stringify(t))}catch{}}function Xr(){try{$t()?.removeItem(Rt)}catch{}}function zt(o,e=Date.now()){try{let r=$t()?.getItem(Rt);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>fp?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var as=Promise.resolve();function is(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return rs(r,mp,e?{signal:e}:null,()=>o()).catch(n=>{throw Uo(n)});let t=as.then(()=>{if(e?.aborted)throw Uo(new DOMException("cancelado","AbortError"));return o()});return as=t.catch(()=>{}),t}var gp={resumido:"R",completo:"P",total:"T"};var vp=2e3;function ss(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function hp(o){let e=[...o.querySelectorAll("td")],r=_(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=_(e[3]),i={data:r,unidade:_(e[1]),...t?{unidadeNome:t}:{},usuario:_(e[2]),descricao:n},s=Mr(r);s&&(i.dataISO=s),a&&(i.usuarioNome=a),o.classList.contains("andamentoAberto")&&(i.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let p=_(c);/^\d+$/.test(p)&&(i.nrSei=p);let d=to(c.getAttribute("href")??"").get("id_documento");d&&(i.idDocumento=d)}if(ss(n).startsWith(ss(Mo.remetidoPrefixo))){let p=e[3]?.querySelector("a.ancoraSigla"),d=_(p);d&&(i.unidadeCitada=d);let m=p?.getAttribute("title")??"";m&&(i.unidadeCitadaNome=m)}return i}function qt(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(_(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(hp),total:r}}function bp(o){if(o.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=po(o,"procedimento_consultar_historico")??io(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new C("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function Re(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function Ht(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(_(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function cs(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function xp(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let i=0;i<=a&&i+n<=t.length;i+=1){let s=!0;for(let c=0;c<n;c+=1)if(cs(t[i+c])!==cs(o.andamentos[c])){s=!1;break}if(s)return[...t.slice(0,i),...o.andamentos]}return null}async function Ap(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=Ep(o,t,r);return a||await is(()=>yp(o,e,r),r.sinal)}catch(t){throw Uo(t)}}function Ep(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(Re(e,"hdnTipoHistorico")||"R")!==r.tipo||(Re(e,"hdnInfraPaginaAtual")||"0")!=="0"||zt(o.http.base.host))return null;let{itens:t,total:a}=qt(e);return Ht(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:Re(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function ls(o,e,r){await Q.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function yp(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new C("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",_(a.doc.querySelector("title")));let n=zt(t);if(n){try{await ls(o,a,n),Xr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let i={tipo:Re(a,"hdnTipoHistorico")||"R",pagina:Re(a,"hdnInfraPaginaAtual")||"0"},s=i,c=!1,p=async(d,m)=>{c||(ns(t,i),c=!0);let u={tipo:r.tipo,pagina:String(m)},f=await Q.de(d,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:u.tipo,hdnInfraPaginaAtual:u.pagina}).enviar({sinal:r.sinal});return s=u,f};try{let d=i.tipo===r.tipo&&i.pagina==="0"?a:await p(a,0);if(!d.doc.querySelector("#tblHistorico"))throw new C("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",_(d.doc.querySelector("title")));let m=qt(d),u=Re(d,"hdnInfraHashCriterios"),f=m.total,v=f?Math.min(f,r.limite):r.limite,b=xp(r.cache,u,f,m.itens);if(b)return r.aoProgresso?.(1,1),{andamentos:b,total:f,hash:u,completo:!0,aproveitouCache:!0};let g=[...m.itens],E=m.itens.length,x=d.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,S=x>0?x:f>E&&E>0?Math.ceil(f/E):1;r.aoProgresso?.(1,S);for(let D=1;g.length<v&&Ht(d)&&D<vp;D+=1){d=await p(d,D);let w=qt(d);if(!w.itens.length)break;g.push(...w.itens),r.aoProgresso?.(D+1,Math.max(S,D+1))}let M=f?g.length>=f:!Ht(d);return{andamentos:g,total:f||g.length,hash:u,completo:M,aproveitouCache:!1}}finally{if(c)if(s.tipo!==i.tipo||s.pagina!==i.pagina)try{await ls(o,a,i),Xr()}catch{}else Xr()}}var _e=new Map;function Pp(o,e){return`${o.http.base.host}|${to(e).get("id_procedimento")??e}`}function Dp(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new C("CANCELADO","Opera\xE7\xE3o cancelada."));let t=Pp(o,e),a=_e.get(t);if(!a){let i=new AbortController,s=new Set,c={promessa:void 0,controle:i,interessados:0,progresso:s,ultimo:null};c.promessa=Ap(o,e,{tipo:gp.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:i.signal,cache:r.cache,aoProgresso:(p,d)=>{c.ultimo=[p,d];for(let m of s)m(p,d)}}).finally(()=>{_e.get(t)===c&&_e.delete(t)}),c.promessa.catch(()=>{}),_e.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((i,s)=>{let c=!1,p=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",d)},d=()=>{if(c)return;p(),n.interessados-=1;let m=new C("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){s(m);return}_e.get(t)===n&&_e.delete(t),n.controle.abort(),n.promessa.then(()=>s(m),()=>s(m))};r.sinal?.addEventListener("abort",d,{once:!0}),n.promessa.then(m=>{c||(p(),i(m))},m=>{c||(p(),s(Uo(m)))})})}function ps(o,e,r={}){return Dp(o,bp(e),r)}var te=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}somar(e){this.porId.has(e.id)||this.porId.set(e.id,e)}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Pa({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(wp(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function Wo(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function wp(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function us(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function ms(o,e,r){let t=po(o,e);if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var fs=o=>e=>to(e.url).get("acao")!==o;async function Sp(o,e,r,t){let a=await o.http.obter(ms(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return Q.de(a,r.form,o.http);let n=(r.formularios??[]).map(i=>io(a.html,i)).find(Boolean);if(!n)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return Q.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Ft(o,e,r,t){let a=await us(o,e,t.sinal),n=await Sp(o,a,r,t.sinal),i=r.preparar(n),s={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??fs(r.acao)}),o.invalidar(a.idProcedimento),{...s,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...s,resumo:r.resumo(a.protocolo)}:{...s,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function Yr(o,e,r,t){return Ft(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),i=uo("Anota\xE7\xE3o",a.valor("txaDescricao"),n),s=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?s:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...i,...uo("Prioridade",s,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function gs(o,e,r,t){return Ft(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let i=Po(r),s=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=s.find(p=>p.valor===r)??s.find(p=>Po(p.texto.split(" - ")[0])===i)??s.find(p=>Po(p.texto.split(" - ").slice(1).join(" - "))===i)??(s.filter(p=>Po(p.texto).includes(i)).length===1?s.find(p=>Po(p.texto).includes(i)):void 0);if(!c)throw new C("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,s.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),uo("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function vs(o,e,r,t){return Ft(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],i=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let s=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...uo("Grupo",s,c.texto))}return r.observacao!==void 0&&(n.push(...uo("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),i&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function Mp(o,e,r){let t=ms(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function ds(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:_(t[1]),texto:_(t[2]),usuario:_(t[3]),data:_(t[4])}})}async function Vt(o,e,r,t){let a=await us(o,e,t.sinal),n=await Mp(o,a,t.sinal),i=ds(n),s=Po(r.marcador),c=i.find(u=>Po(u.marcador)===s),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let u=io(n.html,"andamento_marcador_remover");if(!u)throw new C("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let f=Q.de(n,"#frmGerenciarMarcador",o.http);f.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let v=await o.http.enviar(u,f.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(ds(v).some(b=>b.id===c.id))throw new C("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=Q.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=io(n.html,"andamento_marcador_cadastrar");if(!u)throw new C("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await Q.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let m=d.escolher("selMarcador",r.marcador);return d.definir({hdnIdMarcador:m.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?uo(`Texto do marcador ${m.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${m.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:fs("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${m.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${m.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function Cp(o){let e=_(o.doc.querySelector(".pesquisaBarra")),r=Number((/de\s+([\d.]+)\s*$/.exec(e)??/([\d.]+)\s+resultados?\s*$/i.exec(e)??[])[1]?.replace(/\./g,"")??0),t=[];for(let a of o.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")){let n=a.querySelector("td.pesquisaTituloEsquerda"),i=[...n?.querySelectorAll("a.protocoloNormal")??[]].find(g=>(g.getAttribute("href")??"").includes("procedimento_trabalhar")),s=a.querySelector("td.pesquisaTituloDireita a"),c=a.nextElementSibling,p=c?.nextElementSibling,d=g=>_([...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>_(E).startsWith(g))).replace(/^[^:]+:\s*/,""),m=s?.getAttribute("title")??"",u=g=>[...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>_(E).startsWith(g))?.querySelector("a"),f=u("Unidade"),v=u("Usu"),b=to(i?.getAttribute("href")??"").get("id_procedimento")??void 0;t.push({protocolo:_(i),...b?{idProcedimento:b}:{},tipoProcesso:i?.getAttribute("title")??_(n?.querySelector("span")).replace(/\s*N\u00BA\s*$/,""),...s?{documento:{numero:_(s),tipo:m}}:{},trecho:_(c?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/,""),unidade:d("Unidade"),...f?.getAttribute("title")?{unidadeNome:f.getAttribute("title")}:{},usuario:d("Usu"),...v?.getAttribute("title")?{usuarioNome:v.getAttribute("title")}:{},data:d("Inclus")||d("Data")})}return{itens:t,total:r||t.length}}async function hs(o,e,r){if(!e.interessadoId)throw new C("ARGUMENTO_INVALIDO","Informe o interessado.");let t=Math.max(0,Math.floor(e.inicio??0)),a=await Q.abrir(o.http,o.linkMenu("protocolo_pesquisar"),"#frmPesquisaProtocolo",{sinal:r});a.definir({rdoPesquisarEm:"P",hdnIdContato:e.interessadoId,chkSinTramitacao:e.tramitadoNaUnidade?"S":null,hdnInicio:String(t)}),e.tipoProcesso&&a.escolher("selTipoProcedimentoPesquisa",e.tipoProcesso);let n=await a.enviar({sinal:r,botao:"sbmPesquisar",aceitarValidacao:!0}),i=to(n.url).get("acao");if(i==="procedimento_trabalhar"){let p=_(n.doc.querySelector("title")).replace(/^SEI\s*-\s*/,""),d=to(n.url).get("id_procedimento")??void 0;return{total:1,inicio:0,processos:[{protocolo:p,...d?{idProcedimento:d}:{},tipoProcesso:"",trecho:"",unidade:"",usuario:"",data:""}]}}if(i!=="protocolo_pesquisar")throw new C("SEI_RESPOSTA_INESPERADA","A pesquisa do SEI n\xE3o respondeu como esperado.");let{itens:s,total:c}=Cp(n);return{total:s.length?c:0,inicio:t,processos:s}}function Jr(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function xs(o,e,r){let t=po(e,"procedimento_alterar"),a=t??po(e,"procedimento_consultar");if(!a)throw new C("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await Q.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function $e(o){return o.map(e=>e.texto).filter(Boolean)}var Ip={0:"publico",1:"restrito",2:"sigiloso"};async function As(o,e,r){let{form:t,editavel:a}=await xs(o,e,r),n=Ip[t.valor("rdoNivelAcesso")??""]??e.nivel,i=n==="publico"?void 0:Jr(t,"selHipoteseLegal").trim()||e.hipotese,s=(t.valor("hdnIdTipoProcedimento")??"").trim(),c=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...i?{hipotese:i}:{},tipo:Jr(t,"selTipoProcedimento")||e.tipo,...s?{idTipo:s}:{},especificacao:t.valor("txtDescricao")??"",assuntos:$e(t.itensLupa("selAssuntos")),interessados:$e(t.itensLupa("selInteressadosProcedimento")),assuntosItens:t.itensLupa("selAssuntos"),interessadosItens:t.itensLupa("selInteressadosProcedimento"),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:Op(t),editavel:a,...c?{autuacao:c}:{}}}function Op(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=_(t[0]);a&&e.push({unidade:a,observacao:_(t[1])})}return e}function bs(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let i=r.get(n.id);if(i!==void 0&&!a.has(n.id))throw new C("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${i}.`)}}async function Es(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:i}=await xs(o.http,a,{sinal:t.sinal});if(!i)throw new C("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let s=[];if(r.especificacao!==void 0&&(s.push(...uo("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=Jr(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),s.push(...uo("Tipo",p,d.texto))}if(r.nivel!==void 0){let p=fe[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:me[r.nivel]}),s.push(...uo("N\xEDvel de acesso",p,fe[me[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=Jr(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||me.restrito,m=ve(await ge(o,n,d,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:m.id}),s.push(...uo("Hip\xF3tese legal",p,m.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new C("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(s.push(...uo("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let p=n.itensLupa("selInteressadosProcedimento");bs(p,r.interessados,he(n.pagina.html,"interessado"),"Interessado"),s.push(...uo("Interessados",$e(p).join("; "),$e(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new C("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let p=n.itensLupa("selAssuntos");bs(p,r.assuntos,he(n.pagina.html,"assunto"),"Assunto"),s.push(...uo("Assuntos",$e(p).join("; "),$e(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>to(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${s.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function ys(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(i=>gs(o,t,n,i)),anotar:n=>a(i=>Yr(o,t,n,i)),alternarItemDaAnotacao:n=>a(async i=>{let s=await je(o.http,e);return Yr(o,t,{texto:ni(s?.texto??"",n),prioridade:s?.prioridade??!1},i)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let i=await je(o.http,e);return i?Yr(o,t,{texto:i.texto,prioridade:!i.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(i=>vs(o,t,n,i)),marcar:n=>a(i=>Vt(o,t,n,i)),desmarcar:n=>a(i=>Vt(o,t,{marcador:n,remover:!0},i)),alterarProcesso:n=>a(i=>Es(o,t,n,i)),opcoesAtribuicao:()=>Ra(o.http,e),opcoesMarcador:()=>$a(o.http,e),opcoesAcompanhamento:()=>za(o.http,e),formularioDoProcesso:()=>qa(o,e),processosDoInteressado:(n,i)=>hs(o,n,i)}}var cr=class extends gr{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),i=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let s=i?a.documentos.find(c=>c.numero.replace(/\D/g,"")===i):void 0;return s?{idProcedimento:a.idProcedimento,idDocumento:s.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function Zr(o,e){return`${o}|${e}`}function Qr(o){let e=Ge(ae(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function Ps(o){let e=new cr(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>ae(o.topo)),r=new te(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:hr(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??ys(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>ps(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await Ae(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}function Ds(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}var pe="data-spro-pasta",ot="data-spro-pastas-fila",Tp=500,kp=15e3,Bt=60,Lp=3,Np=3e4,_p=300,Rp=/^anchor(PASTA\d+)$/;function $p(o,e){let r=e.replace("PASTA",""),t=o.getElementById(`spanAGUARDE${r}`);return t?t.textContent??"":null}function de(o,e){if(!o.getElementById(`anchor${e}`))return"ausente";let r=o.getElementById(`div${e}`);if(!r)return"pendente";if(r.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])'))return"carregada";let t=$p(o,e);if(t===null)return r.children.length>0?"carregada":"pendente";let a=fo(t);return a.startsWith("nenhum protocolo")?"carregada":a.startsWith("erro")||a.startsWith("nao foi possivel")?"falhou":"pendente"}function et(o,e){let r=o.getElementById(`div${e}`);return r?.style.display==="block"?!0:r?.style.display==="none"?!1:/minus/.test(o.getElementById(`join${e}`)?.getAttribute("src")??"")}function Ut(o){let e=[];for(let r of o.querySelectorAll('a[id^="anchorPASTA"]')){let t=Rp.exec(r.id);t&&e.push(t[1])}return e}function zp(o,e){return(o.getElementById(`span${e}`)?.textContent??"").trim()||e.replace("PASTA","")}function qp(o){try{return!!o.getElementById("ifrPasta")?.contentDocument?.querySelector('#pwdSenha, input[name="pwdSenha"], #txtUsuario, #frmLogin')}catch{return!1}}function ws(o,e){let r=o.getElementById(`ancjoin${e}`)??o.getElementById(`anchor${e}`);return r?(r.addEventListener("click",t=>t.preventDefault(),{once:!0,capture:!0}),r.click(),!0):!1}var rt=o=>new Promise(e=>setTimeout(e,o));function tt(o,e={}){let r=e.intervaloMs??Tp,t=e.prazoPastaMs??kp,a=e.teto??Bt,n=e.falhasSeguidas??Lp,i=e.Observador??o.defaultView?.MutationObserver??globalThis.MutationObserver,s=e.sessaoExpirada??qp,c=`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,p="ociosa",d,m=null,u=0,f=0,v=!1,b=new Set,g=new Set,E=new Set,x=!1,S=!1,M=new Set,D=new Set,w=()=>Ut(o).filter(I=>{let U=de(o,I);return(U==="pendente"||U==="falhou")&&!b.has(I)}),L=()=>{let I=w().filter(U=>U!==m).length;return{fase:p,atual:m,nomeAtual:m?zp(o,m):"",feitas:u,total:u+(m?1:0)+I,restantes:I+(m?1:0),falhas:[...b],motivo:d}},j=(I,U)=>{let B=o.getElementById(`anchor${I}`);B&&(U===null?B.removeAttribute(pe):B.getAttribute(pe)!==U&&B.setAttribute(pe,U))},W=()=>{let I=L();for(let U of[...M])try{U(I)}catch{}},G=o.documentElement,A=()=>G.setAttribute(ot,`${c}:${Date.now()}`),k=()=>{(G.getAttribute(ot)??"").startsWith(`${c}:`)&&G.removeAttribute(ot)},T=()=>{let I=G.getAttribute(ot);if(!I||I.startsWith(`${c}:`))return!1;let U=Number(I.split(":")[1]);return Number.isFinite(U)&&Date.now()-U<Np},N=I=>{if(S||p==="ociosa")return;let U=I.target;if(!U?.closest)return;let B=U.closest('a[id^="ancjoinPASTA"], a[id^="anchorPASTA"], div[id^="divPASTA"]');if(!B)return;let X=/(PASTA\d+)$/.exec(B.id);X&&E.add(X[1])};o.addEventListener("click",N,!0);let J=async I=>{o.hidden&&(p="pausada",W(),await new Promise(U=>{let B=()=>{(!o.hidden||v||I!==f)&&(o.removeEventListener("visibilitychange",B),clearInterval(X),U())},X=setInterval(B,1e3);o.addEventListener("visibilitychange",B)}),I===f&&!v&&(p="carregando",W()))},K=()=>e.abrirCarregadas===!1?[]:Ut(o).filter(I=>{if(E.has(I)||et(o,I))return!1;let U=o.getElementById(`div${I}`);return de(o,I)==="carregada"&&!!U?.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])')}),$=()=>Ut(o).some(I=>de(o,I)==="pendente"&&et(o,I)&&!D.has(I)),y=async I=>{let U=Date.now()+t;for(;$()&&Date.now()<U&&I===f&&!v;)await rt(100)},h=I=>new Promise(U=>{let B=!1,X=null,Oo,Eo,mo=zo=>{B||(B=!0,X?.disconnect(),clearInterval(Oo),clearTimeout(Eo),U(zo))},To=()=>{if(v)mo("cancelada");else{let zo=de(o,I);zo==="carregada"?mo("ok"):zo==="falhou"?mo("falhou"):zo==="ausente"&&mo("sumiu")}};if(typeof i=="function"){X=new i(To);let zo=o.getElementById("divArvore")??o.body??G;X.observe(zo,{childList:!0,subtree:!0,characterData:!0})}Oo=setInterval(To,_p),Eo=setTimeout(()=>mo("tempo"),t),To()}),P=(I,U)=>{let B=o.activeElement,X=o.defaultView,Oo=X?.scrollX??0,Eo=X?.scrollY??0;S=!0;let mo=!0;try{for(let To=0;To<U&&mo;To+=1)mo=ws(o,I)}finally{S=!1}if(B&&o.activeElement!==B&&B.isConnected)try{B.focus({preventScroll:!0})}catch{}return X&&typeof X.scrollTo=="function"&&(X.scrollX!==Oo||X.scrollY!==Eo)&&X.scrollTo(Oo,Eo),mo},R=async I=>{if(e.abrir)return D.add(I),await e.abrir(o,I),!0;let U=et(o,I);D.add(I);let B=P(I,U?2:1);return U||g.add(I),B},F=()=>{for(let I of[...g])if(g.delete(I),!(E.has(I)||!et(o,I)||o.getElementById(`div${I}`)?.querySelector(".infraArvoreNoSelecionado"))&&de(o,I)!=="pendente"){S=!0;try{ws(o,I)}finally{S=!1}}},q=()=>{for(let I of o.querySelectorAll(`[${pe}]`))I.removeAttribute(pe)},Y=async I=>{let U=0,B=0;p="carregando",d=void 0,W();try{for(;;){if(I!==f||v||(await J(I),I!==f||v))return;for(let To of K())P(To,1)&&g.add(To);let X=w()[0];if(!X){p="concluida";return}if(u>=a){p="teto";return}let Oo=B?r-(Date.now()-B):0;if(Oo>0&&await rt(Oo),I!==f||v)return;if(T()){p="interrompida",d="ocupada";return}if(await y(I),I!==f||v)return;if(!w().includes(X)){await rt(10);continue}m=X,A(),j(X,"carregando"),W();let mo=await R(X).catch(()=>!1)?await h(X):"falhou";if(j(X,null),m=null,I!==f||v){x&&(x=!1,F()),W();return}if(B=Date.now(),mo==="ok")U=0,u+=1;else if(mo==="sumiu")await rt(Math.min(r,200));else{if(u+=1,b.add(X),j(X,"falhou"),U+=1,s(o)){p="interrompida",d="sessao";return}if(U>=n){p="interrompida",d="falhas";return}}W()}}finally{I===f&&(m=null,k(),(p==="carregando"||p==="pausada")&&(p="concluida"),x&&(x=!1,F()),W())}},ro=()=>{if(!v&&!(p==="carregando"||p==="pausada")&&!(!w().length&&!K().length)){if(T()){p="interrompida",d="ocupada",W();return}f+=1,u=0,A(),Y(f)}};return{iniciar(){p==="parada"||p==="teto"||p==="interrompida"||ro()},parar(){p!=="carregando"&&p!=="pausada"||(f+=1,p="parada",k(),W())},continuar(){b=new Set,Io(),p="ociosa",ro()},tentarDeNovo(){b=new Set,Io(),p="ociosa",ro()},encerrar(I){f+=1;let U=m!==null;p="ociosa",d=void 0,u=0,b=new Set,q(),I?U?x=!0:F():g.clear(),E.clear(),k(),W()},estado:L,pendentes:w,aoMudar(I){return M.add(I),()=>M.delete(I)},destruir(){v=!0,f+=1,o.removeEventListener("click",N,!0),q(),k(),M.clear()}};function Io(){for(let I of o.querySelectorAll(`[${pe}="falhou"]`))I.removeAttribute(pe)}}var lr=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function ze(o){return fo(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function Hp(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function Fp(o){return o.externo&&o.formato!=="circular"}function Gt(o,e){if(!Hp(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function Vp(o){let e=fo(o);return e?e.split(" "):[]}function Up(o){return fo(`${o.titulo} ${o.numero}`)}function Bp(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&Gt(o,r)||e.externos&&Fp(o)||e.cancelados&&o.cancelado))return!1;let a=Vp(e.texto);if(a.length){let n=Up(o);if(!a.every(i=>n.includes(i)))return!1}return!0}function Ss(o,e,r){let t=new Set;for(let a of o.documentos)Bp(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var qe="data-spro-f-oculto";function Ms(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function Cs(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!Ms(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!Ms(r));r=r.nextElementSibling);return e}function Gp(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function jt(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=Gp((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),i=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),s=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:Is(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:i,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:s||void 0,link:"",src:"",acoes:[],botoes:[]}}function Is(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function Os(o,e,r,t,a){let n=o.getElementById("divArvore"),i={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return i;let s=new Map(e.map(v=>[v.id,v])),c=[],p=new Set;for(let v of n.querySelectorAll('a[id^="anchor"]')){let b=Wo(v.id,"anchor");if(!b||b===r)continue;let g=s.get(b)??jt(o,b);if(!g)continue;let E=Is(v);c.push({id:b,ancora:v,doc:E===g.pasta?g:{...g,pasta:E}}),E&&p.add(E)}let d=c.map(v=>v.doc),m=ze(t),u=Ss({documentos:d},t,a),f=new Set;if(m){for(let v of c)if(!u.has(v.id))for(let b of Cs(v.ancora))f.add(b)}for(let v of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(v.id))continue;let b=v.id.slice(6);if(i.pastas+=1,!p.has(b)&&de(o,b)!=="carregada"){i.pastasFechadas+=1;continue}if(m&&!u.has(b)){for(let E of Cs(v))f.add(E);let g=o.getElementById(`div${b}`);g&&f.add(g)}}for(let v of Array.from(n.querySelectorAll(`[${qe}]`)))f.has(v)||v.removeAttribute(qe);for(let v of f)v.hasAttribute(qe)||v.setAttribute(qe,"1");return i.total=d.length,i.visiveis=d.filter(v=>u.has(v.id)).length,i}function Ts(o){for(let e of Array.from(o.querySelectorAll(`[${qe}]`)))e.removeAttribute(qe)}function ks(o,e){return o.filter(r=>Gt(r,{unidade:e})).map(r=>({id:r.id,numero:r.numero,titulo:r.titulo}))}function Ls(o){let e=new Map;for(let r of o)!r.nrSei||!r.descricao.startsWith(Mo.documentoGerado)||e.set(r.nrSei,r.data.slice(0,10));return e}function Ns(o,e){return e?o.map(r=>{let t=e.get(r.numero);return t?{...r,data:t}:r}):[...o]}var _s="spro-na-nao-assinados";function jp(o){let e=o.getElementById("divInfraBarraLocalizacao");if(e)return{pai:e,antes:null};let r=o.getElementById("frmAtividadeListar");return r?.parentElement?{pai:r.parentElement,antes:r}:null}function Wp(o,e){let r=o.getElementById(`anchor${e}`);return r?(r.click(),r.scrollIntoView?.({block:"center"}),!0):!1}function Kp(o,e){let r=new te(e.documentos);r.lerDoIframe(o);for(let t of o.querySelectorAll("#divArvore a[id^='anchor']")){let a=Wo(t.id,"anchor");if(!a||r.obter(a))continue;let n=jt(o,a);n&&r.somar(n)}return r.todos()}function Rs(o){let e=jp(o.doc);if(!e||o.doc.getElementById(_s))return null;qo(o.doc);let r=l("div",{id:_s,class:"spro-na",role:"status","aria-live":"polite"});ko(o.doc)&&r.setAttribute("data-tema","escuro"),e.pai.insertBefore(r,e.antes);let t=!1,a=!1,n=!0,i=()=>l("strong",{},o.unidade),s=(u,f,v,...b)=>{r.className=`spro-na ${u}`,r.replaceChildren(l("span",{class:"spro-na-icone","aria-hidden":"true"},H(f,15)),l("span",{},...v),...b)},c=(u,f)=>{let v=l("button",{type:"button",class:"spro-p-link"},u);return v.addEventListener("click",f),v},p=async(u,f)=>{if(a)return;a=!0;let v=tt(u,{...o.opcoesFila,abrirCarregadas:!1,...o.abrirPasta?{abrir:(g,E)=>o.abrirPasta?.(g,E)}:{}}),b=c("Parar",()=>v.parar());v.aoMudar(g=>{if(g.fase!=="carregando"&&g.fase!=="pausada")return;let E=g.nomeAtual?`: ${g.nomeAtual}`:"";s("falha","atualizar",[`Carregando as pastas da \xE1rvore (${Math.min(g.feitas+1,Math.max(g.total,1))} de ${Math.max(g.total,1)}${E})...`],b)});try{s("falha","atualizar",["Carregando as pastas da \xE1rvore..."],b),v.iniciar(),await new Promise(g=>{let E=()=>{let S=v.estado().fase;S==="carregando"||S==="pausada"||(x(),g())},x=v.aoMudar(E);E()})}finally{v.destruir(),a=!1}n=!0,m()},d=(u,f,v)=>{if(t)return;t=!0;let b=l("ul",{class:"spro-p-lista-modal spro-na-lista","aria-label":"Documentos n\xE3o assinados"}),g=S=>b.replaceChildren(...S.map(M=>{let D=l("button",{type:"button",class:"spro-p-link","aria-label":`Selecionar na \xE1rvore: ${M.titulo} (${M.numero})`},H("documento",14),`${M.titulo} (${M.numero})`);return D.addEventListener("click",()=>{x.fechar(),Wp(f,M.id)}),l("li",{class:"spro-p-linha-modal"},D,M.data?l("span",{class:"spro-na-data"},M.data):null)}));g(u);let E=c("Verificar pastas",()=>{x.fechar(),p(f,v)}),x=eo({topo:o.topo,doc:o.doc},{titulo:"Documentos pendentes de assinatura",icone:"caneta",largura:700,conteudo:[l("p",{class:"spro-p-nota"},u.length===1?`Existe 1 documento n\xE3o assinado na unidade ${o.unidade}.`:`Existem ${u.length} documentos n\xE3o assinados na unidade ${o.unidade}.`),b,v.length>0?l("p",{class:"spro-p-nota"},`${v.length===1?"1 pasta fechada n\xE3o foi verificada":`${v.length} pastas fechadas n\xE3o foram verificadas`}: o SEI s\xF3 traz os documentos de uma pasta quando ela \xE9 aberta. `,E):null],aoFechar:()=>{t=!1}});o.datas().then(S=>{S&&x.el.isConnected&&g(Ns(u,S))})},m=()=>{if(a)return;let u=o.quadroDaArvore(),f=u?o.lerArvore(u):null;if(!u||!f){s("falha","alerta",["N\xE3o foi poss\xEDvel verificar os documentos n\xE3o assinados na unidade ",i()],c("Tentar de novo",m));return}let v=Kp(u,f),b=ks(v,o.unidade),g=Ds({pagina:f.pagina,documentos:v}),E=g.length===1?"1 pasta fechada ainda n\xE3o foi verificada":`${g.length} pastas fechadas ainda n\xE3o foram verificadas`,x=g.length?c("Verificar pastas",()=>void p(u,g)):null;if(!b.length){x?s("falha","alerta",["Nenhum documento n\xE3o assinado na unidade ",i(),` na \xE1rvore aberta; ${E}`],x):s("ok","check",["Todos os documentos foram assinados na unidade ",i()]);return}s("pendente","alerta",["Existem documentos n\xE3o assinados na unidade ",i()],c("Detalhes",()=>d(b,u,g)),...x?[x]:[]),n&&d(b,u,g),n=!1};return m(),{verificar:m,remover:()=>r.remove()}}function zs(o){return o!==o.top&&/[?&]acao=procedimento_enviar(&|$)/.test(o.location.search)}function $s(o){try{return o.getElementById("ifrArvore")?.contentDocument??null}catch{return null}}async function qs(o=document){if(!o.getElementById("frmAtividadeListar"))return null;let{dataValues:e}=await chrome.storage.sync.get("dataValues");if(!Vo(e,Wa))return null;let r=fr(),t=$s(r),a=t?Ne(t)??await sr(t,5e3):null,n=Qr(r);return Rs({doc:o,topo:r,quadroDaArvore:()=>$s(r),lerArvore:i=>Ne(i),unidade:n.unidade.sigla,datas:async()=>{if(!a||a.nivel==="sigiloso"||!n.login)return null;let i=new Se(dr(chrome.storage.local,"local"),Zr(n.host,n.login),a.idProcedimento),s=await xe({loja:i,agora:()=>new Date,sigiloso:!1});return s?.vale?Ls(s.historico.andamentos):null}})}var Xp=90,Hs=120,Yp=4e3,Fs=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function Jp(o,e,r=!1){if(!e)return{principal:""};let t=o.total===1?"documento":"documentos";return o.visiveis===0?{principal:r?`Nenhum documento at\xE9 agora (${o.total} na \xE1rvore).`:`Nenhum documento encontrado (${o.total} na \xE1rvore).`}:{principal:`${o.visiveis} de ${o.total} ${t}`}}var He=(o,e,r)=>`${o} ${o===1?e:r}`;function Zp(o,e,r){if(!e)return null;let t=o.total>0?Math.min(100,Math.round(o.feitas/o.total*100)):null,a=o.falhas.length,n={id:"tentar",rotulo:"Tentar de novo",aria:"Tentar de novo carregar as pastas que falharam"},i={id:"continuar",rotulo:"Continuar",aria:"Continuar a carregar as pastas fechadas"};switch(o.fase){case"carregando":return o.total===0?null:{texto:`Carregando pastas ${Math.min(o.feitas+1,Math.max(o.total,1))} de ${Math.max(o.total,1)}${o.nomeAtual?`: ${o.nomeAtual}`:""}`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"pausada":return{texto:`Em pausa: a aba est\xE1 oculta (${o.feitas} de ${o.total} pastas)`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"parada":return{texto:`Parou: ${He(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:i,progresso:null,tom:"aviso"};case"teto":return{texto:`Limite de ${r.teto} pastas por vez: ${He(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:i,progresso:null,tom:"aviso"};case"interrompida":return o.motivo==="sessao"?{texto:"A sess\xE3o do SEI expirou: entre de novo e atualize a p\xE1gina.",acao:null,progresso:null,tom:"aviso"}:o.motivo==="ocupada"?{texto:"Outra carga de pastas est\xE1 em andamento neste quadro.",acao:n,progresso:null,tom:"aviso"}:{texto:`${He(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}; ${He(o.restantes,"ainda fechada","ainda fechadas")}.`,acao:n,progresso:null,tom:"aviso"};case"concluida":return a>0?{texto:`${He(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}.`,acao:n,progresso:null,tom:"aviso"}:o.feitas>0&&r.mostrarConcluida?{texto:"Todas as pastas carregadas",acao:null,progresso:100,tom:"ok"}:null;default:return r.pastasFechadas>0?{texto:`${He(r.pastasFechadas,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:i,progresso:null,tom:"aviso"}:null}}var Wt="Filtrar documentos";function Qp(o){let e="http://www.w3.org/2000/svg",r=o.createElementNS(e,"svg");for(let[a,n]of Object.entries({viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor","aria-hidden":"true",focusable:"false"}))r.setAttribute(a,n);let t=o.createElementNS(e,"path");return t.setAttribute("fill-rule","evenodd"),t.setAttribute("d","M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.74 4.74-1.41 1.41-4.74-4.74A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z"),r.append(t),r}function od(o){let e=o.createElement("button");return e.type="button",e.className="spro-f-lupa-btn",e.setAttribute("aria-label",Wt),e.setAttribute("aria-pressed","false"),e.append(Qp(o)),e}var ed=".spro-fav-estrela, .spro-fav-abrir, .spro-prj-ic, .iconFavoritePro";function rd(o,e){let r=[...o.children].filter(n=>n!==e),t=r.find(n=>n.matches(".spro-fav-estrela, .iconFavoritePro"));if(t)return t;let a=r.filter(n=>n.matches(ed));return a.length?a[a.length-1]??null:r.find(n=>n.matches('a.infraArvoreNo, a[target="ifrVisualizacao"], a[target="ifrConteudoVisualizacao"]'))??null}function td(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},H("fechar",12)),r=new Map;for(let d of Fs)r.set(d.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":d.chave,"aria-pressed":"false","aria-label":`${d.rotulo}. ${d.ajuda}`},d.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-fila-texto"}),n=l("button",{type:"button",class:"spro-f-fila-acao",hidden:!0}),i=l("div",{class:"spro-f-prog-enchimento"}),s=l("div",{class:"spro-f-prog",role:"progressbar","aria-label":"Progresso do carregamento das pastas","aria-valuemin":"0","aria-valuemax":"100",hidden:!0},i),c=l("div",{class:"spro-f-fila",hidden:!0},l("div",{class:"spro-f-fila-linha"},a,n),s);return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},H("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,c)),busca:o,limpar:e,chips:r,status:t,fila:{raiz:c,texto:a,acao:n,barra:s,enchimento:i}}}function Vs(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;qo(r);let a=td(),n=od(r);for(let y of r.querySelectorAll(".spro-f-lupa-btn"))y.remove();let i=!1,s={...lr},c={visiveis:0,total:0,pastasFechadas:0,pastas:0},p,d,m=!1,u=e.fila===void 0?tt(r,e.opcoesFila):e.fila,f=e.opcoesFila?.teto??Bt,v=!1,b,g=()=>{let y=r.getElementById("divArvore");y?.parentElement&&(a.raiz.parentElement!==y.parentElement||a.raiz.nextElementSibling!==y)&&y.parentElement.insertBefore(a.raiz,y)},E={el:null,obs:null},x=()=>{let y=r.getElementById("topmenu");if(!y)return n.isConnected;E.el!==y&&typeof N=="function"&&(E.obs?.disconnect(),E.el=y,E.obs=new N(()=>{m||(x(),D())}),E.obs.observe(y,{childList:!0}));let h=rd(y,n);return h?(n.parentElement===y&&n.previousElementSibling===h||h.after(n),!0):n.isConnected},S=()=>{for(let y of[a.raiz,n])ko(r)?y.setAttribute("data-tema","escuro"):y.removeAttribute("data-tema")},M=y=>{let h=a.fila;if(h.raiz.hidden=!y,!y){h.raiz.removeAttribute("data-tom");return}h.raiz.setAttribute("data-tom",y.tom),h.texto.textContent!==y.texto&&(h.texto.textContent=y.texto),h.acao.hidden=!y.acao,y.acao&&(h.acao.textContent!==y.acao.rotulo&&(h.acao.textContent=y.acao.rotulo),h.acao.setAttribute("aria-label",y.acao.aria),h.acao.setAttribute("data-acao",y.acao.id)),h.barra.hidden=y.progresso===null,y.progresso!==null&&(h.barra.setAttribute("aria-valuenow",String(y.progresso)),h.enchimento.style.width=`${y.progresso}%`)},D=()=>{let y=ze(s);for(let Y of Fs)a.chips.get(Y.chave)?.setAttribute("aria-pressed",s[Y.chave]?"true":"false");a.busca.value!==s.texto&&(a.busca.value=s.texto),a.limpar.hidden=!y;let h=u?.estado(),P=h?Zp(h,y,{pastasFechadas:c.pastasFechadas,teto:f,mostrarConcluida:v}):null,{principal:R}=Jp(c,y,h?.fase==="carregando"||h?.fase==="pausada");a.status.textContent!==R&&(a.status.textContent=R),M(P),a.status.parentElement.hidden=!y,a.raiz.toggleAttribute("data-ativo",y);let F=c.total===0&&c.pastas===0&&!y;a.raiz.hidden=F||!i&&n.isConnected,n.hidden=F,n.setAttribute("aria-pressed",i?"true":"false");let q=y&&!i;n.toggleAttribute("data-ativo",q),n.setAttribute("aria-label",q?`${Wt} (filtro ativo)`:Wt)},w=()=>(c=Os(r,o.documentos.todos(),o.idProcedimento,s,{unidade:o.unidade.sigla}),D(),c),L=0,j=()=>{if(m)return;g(),x();let y=Date.now();y-L>=Hs&&(L=y,w()),clearTimeout(d),d=setTimeout(()=>{m||(L=Date.now(),g(),x(),w())},Hs)},W=()=>{!u||m||(ze(s)?u.iniciar():u.encerrar(!0))},G=y=>{s={...s,...y},w(),W()};a.busca.addEventListener("input",()=>{s={...s,texto:a.busca.value},clearTimeout(p),p=setTimeout(()=>{m||(w(),W())},Xp)}),a.raiz.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),ze(s)&&y.target===a.busca?A():T(!0))}),n.addEventListener("click",()=>{i?T():k()});for(let[y,h]of a.chips)h.addEventListener("click",()=>G({[y]:!s[y]}));let A=()=>{clearTimeout(p),s={...lr},u?.encerrar(!0),w(),a.busca.focus()};a.limpar.addEventListener("click",A);let k=()=>{if(i){a.busca.focus();return}i=!0,D(),a.busca.focus()},T=(y=!1)=>{if(!i)return;clearTimeout(p);let h=y||a.raiz.contains(r.activeElement);s={...lr},i=!1,u?.encerrar(!0),w(),h&&n.focus()},N=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,J=r.getElementById("frmArvore")??t.parentElement,K=typeof N=="function"?new N(y=>{a.raiz.isConnected&&y.every(P=>a.raiz.contains(P.target)||P.addedNodes.length+P.removedNodes.length>0&&[...P.addedNodes,...P.removedNodes].every(R=>R===a.raiz))||j()}):null;K?.observe(J,{childList:!0,subtree:!0});let $=Ee(r,S);return u?.aoMudar(y=>{m||(y.fase==="concluida"&&y.falhas.length===0&&y.feitas>0&&!v?(v=!0,clearTimeout(b),b=setTimeout(()=>{v=!1,m||D()},e.esperaConcluidaMs??Yp)):y.fase!=="concluida"&&(v=!1),D(),y.fase==="carregando"&&w())}),a.fila.acao.addEventListener("click",()=>{let y=a.fila.acao.getAttribute("data-acao");y==="parar"?u?.parar():y==="continuar"?u?.continuar():y==="tentar"&&u?.tentarDeNovo()}),g(),x(),S(),w(),{estado:()=>({...s}),aberta:()=>i,abrir:k,fechar:T,lupa:()=>n,definir:G,limpar:()=>{clearTimeout(p),s={...lr},u?.encerrar(!0),w()},reaplicar:w,barra:()=>a.raiz,destruir:()=>{m=!0,clearTimeout(p),clearTimeout(d),clearTimeout(b),u?.encerrar(!0),u?.destruir(),K?.disconnect(),E.obs?.disconnect(),n.remove(),$(),Ts(r),a.raiz.remove()}}}function ad(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function nd(o){return async()=>{try{return await o()}catch(e){throw new Error(Go(e))}}}function Us(o){let e=id(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,nd(t)]))}function id(o){let e=hr(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await As(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await je(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:ad(o.arv),editavel:!1}:{itens:await _a(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await ka(o.http,o.arv)}:t,atribuicao:async()=>({...La(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function Kt(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function Bs(o){o.documentElement?.setAttribute(Fa,"1")}function Gs(o){o.documentElement?.setAttribute(Va,"1")}function js(o){o.documentElement?.setAttribute(Ba,"1")}function Xt(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function Ws(o){o.documentElement?.setAttribute(Ua,"1")}function Ks(o){o.documentElement?.setAttribute(Ga,"1"),o.documentElement?.setAttribute(ja,"1")}function Yt(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var at=["Copiar","Abrir","Acoes"],Jt={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},Co={tipo:"local"},Z=(...o)=>({tipo:"acao",acoes:o}),Ko=(...o)=>({tipo:"funcao",funcoes:o}),nt=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:Co,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:Co,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:Co,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:Co,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:Co,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:Co,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:Co,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:Z("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:Z("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:Z("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:Z("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:Z("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:Z("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:Z("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Ko("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Ko("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Ko("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:Z("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Ko("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Ko("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:Z("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:Z("md_pet_intimacao_cadastrar")}],Xs=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:Co},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:Co},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:Co},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:Co},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:Co},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:Co},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:Z("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:Z("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:Z("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:Z("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:Z("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:Z("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:Z("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:Z("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:Z("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:Z("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:Z("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:Z("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:Z("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:Z("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:Z("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:Z("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:Z("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:Z("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Ko("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Ko("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Ko("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Ko("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:Z("arvore_ordenar")}],it="Ativar menu ao clicar",Ys=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],Js=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],Zs=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],sd={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},cd=o=>sd[o]??o;function Qs(o,e){let r=cd(e);return o.find(t=>t.nome===r)}var ab=nt.filter(o=>o.modo).map(o=>o.nome);function oc(o){return o.includes(" ")?o.split(" ").pop()??"":""}function Fe(o){let e=oc(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function ec(o){let e=o.trim(),r=oc(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function rc(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var ld=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),Zt=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Qt=(o,e)=>`<a href="${ld(o)}" target="_blank">${Zt(e)}</a>`,tc=o=>({texto:Fe(o.rotulo)});function ac(o){let e=Fe(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${ec(o.rotulo)} (${rc(o.citacaoOpcao)}${e})`}}var nc=o=>({texto:o.linkDocumento});function ic(o){let e=Fe(o.rotulo);return{texto:e,html:Qt(o.linkDocumento,e)}}function sc(o){let e=Fe(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:Qt(o.linkDocumento,e)};let r=ec(o.rotulo),t=rc(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${Zt(r)} (${Zt(t)}${Qt(o.linkDocumento,e)})`}}var cc=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function oa(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function lc(o){return at.flatMap(e=>o.filter(r=>r.grupo===e))}function ea(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===it)continue;let i=Qs(o,n);i&&!t.has(i.id)&&(t.add(i.id),a.push(i))}return a}var pc=(o,e)=>{for(let r of e){let t=io([...o],r);if(t)return t}return null};function dc(o,e){return e.find(r=>o?.includes(r))??null}var uc={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function pd(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var dd=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function ud(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:oa(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(tc(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(ac(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(nc(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(ic(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(sc(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,i=e.dado?.cancelado===!0,s=!r.podeIncluirDocumento,c=i?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(s?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let d=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!d)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let m=!1;if(/minuta/i.test(e.rotulo)){let u=await t.perguntarMinuta();if(!u)return;m=u==="remover"}await t.duplicar(d,m)}}}default:return{executar:()=>{}}}}function mc(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,i=o.origem;if(i.tipo==="local")return!(n?.numero||Fe(e.rotulo))||dd.has(o.id)&&e.id.includes("-")?null:{...t,...ud(o,e,r)};if(!n)return null;if(i.tipo==="conteudo"){if(!n.src)return null;let d=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(d,pd(e))}:{...t,executar:()=>a.abrirEmNovaAba(d)}}if(i.tipo==="acao"){let d=pc(n.acoes,i.acoes);return d?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(d)}:{...t,executar:()=>a.abrirNoVisualizador(d)}:null}let s=dc(n.funcoes,i.funcoes);if(!s)return null;let c=uc[s];if(!c)return null;let p=async d=>{let m=await a.linkDaTela(n.link,c);if(!m)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);d==="aba"?a.abrirEmNovaAba(m):a.abrirNoVisualizador(m)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function fc(o,e){let r=[];for(let t of ea(nt,e.selecao,Ys)){let a=mc(t,o,e);a&&r.push(a)}return lc(r)}function st(o,e,r){let t=[];for(let a of ea(nt,r,Zs)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=mc(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function gc(o){let e=o.servicos,r=[],t=oa(o.base,o.idProcedimento);for(let a of ea(Xs,o.selecao,Js)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},i=a.origem;if(i.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:cc(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(i.tipo==="acao"){let s=pc(o.acoesProcesso,i.acoes);s&&r.push({...n,executar:()=>e.abrirNoVisualizador(s)});continue}if(i.tipo==="funcao"){let s=dc(o.funcoesProcesso,i.funcoes);if(!s)continue;if(s==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(s)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=uc[s];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);s==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return lc(r)}var pr="spro-pm-icone",vc="data-spro-pm-sig",hc=["breackline_doc"];function md(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function fd(o,e){return l("span",{class:`action-doc action-${o.modo} ${pr}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},H(o.icone,13))}function gd(o,e,r){let t=r.map(i=>i.modo).join(","),a=[];for(let i=o.nextElementSibling;i;i=i.nextElementSibling)if(i.classList.contains(pr))a.push(i);else{if(hc.some(s=>i.classList.contains(s))||i.classList.contains("action-doc"))continue;break}if(a=a.filter(i=>i.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(vc)===t&&a.length===r.length)return!1;for(let i of a)i.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&hc.some(i=>n.nextElementSibling?.classList.contains(i));)n=n.nextElementSibling;for(let i of r){let s=fd(i,e);s.setAttribute(vc,t),n.after(s),n=s}return!0}function bc(o,e,r,t,a){let n=0,i=t(),s=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=Wo(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let d=r(p,md(c)),m=st(d,i,s);gd(c,p,m)&&(n+=1)}return n}function xc(o){for(let e of o.querySelectorAll(`.${pr}`))e.remove()}function Ac(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,i=()=>{clearTimeout(n),n=setTimeout(r,150)},s=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&s?new a(i):null;c?.observe(s,{childList:!0,subtree:!0});let p=u=>{if(u.getAttribute("aria-busy")==="true")return;let f=u.getAttribute("data-id")??"",v=u.getAttribute("data-action")??"";u.setAttribute("aria-busy","true");let b=()=>{u.removeAttribute("aria-busy"),u.classList.add("feito"),setTimeout(()=>u.classList.remove("feito"),900)};Promise.resolve(e(f,v)).catch(g=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",g)).finally(b)},d=u=>{let f=u.target?.closest?.(`.${pr}`);f&&(u.preventDefault(),u.stopPropagation(),p(f))},m=u=>{if(u.key!=="Enter"&&u.key!==" ")return;let f=u.target?.closest?.(`.${pr}`);f&&(u.preventDefault(),p(f))};return o.addEventListener("click",d,!0),o.addEventListener("keydown",m,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",d,!0),o.removeEventListener("keydown",m,!0)}}function Ec(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],i=!1,s=u=>{let f=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${u.perigo?" spro-menu-perigo":""}${u.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":u.id,...u.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},H(u.icone,15)),l("span",{class:"spro-menu-rotulo"},u.rotulo),u.dica?l("span",{class:"spro-menu-dica"},u.dica):null);return f.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),!u.desativado&&(d(!0),r.aoEscolher(u))}),n.push(f),f};for(let u of at){let f=e.filter(v=>v.grupo===u);f.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":Jt[u]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},Jt[u]),...f.map(s)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(s));let c=u=>{if(!n.length)return;let f=(u+n.length)%n.length;for(let[v,b]of n.entries())b.setAttribute("tabindex",v===f?"0":"-1");n[f]?.focus?.({preventScroll:!0})};for(let u of n)u.addEventListener("pointermove",()=>c(n.indexOf(u)));let p=wr(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>d(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function d(u){if(i)return;i=!0;let f=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",m,!0),(u||f)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function m(u){if(u.key==="Escape"){u.preventDefault(),u.stopPropagation(),d(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let f=n.findIndex(v=>v.getAttribute("tabindex")==="0");switch(u.key){case"ArrowDown":c(f+1);break;case"ArrowUp":c(f-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[f]?.click();break;case"Tab":d(!0);return;default:return}u.preventDefault(),u.stopPropagation()}return t.addEventListener("keydown",m,!0),r.focar&&c(0),{el:a,fechar:()=>d(!1)}}async function Pc(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),i=a.documentos.find(s=>s.id===t.idDocumento)??a.documentos.find(s=>s.numero.replace(/\D/g,"")===n);if(!i)throw new C("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:i}}async function vd(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",i=r.nivel?me[r.nivel]:n;if(r.nivel&&(a.push(...uo("N\xEDvel de acesso",fe[n]??"",fe[i])),e.definir({rdoNivelAcesso:i,hdnStaNivelAcessoLocal:i})),i==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&i!==n){if(!r.hipotese)throw new C("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let s=await ge(o,e,i,t),c=ve(s,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function hd(o,e,r){let t=await Pc(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=io(t.documento.acoes,a)??io(t.documento.acoes,/^documento_alterar/);if(!n)throw new C("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let i=await Q.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:i}}async function bd(o,e,r){let t=po(e,"documento_escolher_tipo");if(!t)throw new C("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await Q.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=Q.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function xd(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,_(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=to(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,_(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Ad(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await bd(o,e,t),i=xd(n.pagina).filter(s=>s.id!=="-1").map(s=>({id:s.id,texto:s.nome}));if(a){let s=i.find(c=>c.id===r);if(!s)throw new C("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:s}}return{escolha:n,tipo:ve(i,r,"Tipo de documento")}}async function Ed(o,e,r,t,a,n,i){let s=await t.definir({hdnIdSerie:a.id}).enviar({sinal:i}),c=Q.de(s,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),d=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(d?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let b=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(E=>E.valor===b&&E.valor!=="null"))throw new C("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${b}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:b,hdnIdTextoPadrao:b})}else if(n.textoPadrao){let b=c.opcoes("selTextoPadrao").filter(E=>E.valor!=="null").map(E=>({id:E.valor,texto:E.texto})),g=ve(b,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:g.id,hdnIdTextoPadrao:g.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await vd(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},i),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let m=await c.enviar({sinal:i,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:b=>/acao_origem=documento_(?:gerar|cadastrar)/.test(b.url)||/editor_montar/.test(b.html)}),u=to(m.url).get("id_documento")??/id_documento=(\d+)/.exec(m.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:u,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let v=(await o.arvore(e,{forcar:!0,sinal:i})).documentos.find(b=>b.id===u);return{idDocumento:u,numero:v?.numero??"",titulo:v?.titulo??""}}function yc(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var yd=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function Dc(o,e,r,t={}){let a=await Pc(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new C("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:i}=await hd(o,e,r.sinal),s=n.documento,c=i.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??i.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new C("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",d=p==="restrito"?(i.valor("hdnIdHipoteseLegal")||i.opcoes("selHipoteseLegal").find(x=>x.selecionada&&x.valor!=="null")?.valor)??void 0:void 0,m=i.valor("hdnIdSerie")??"";if(!m)throw new C("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${s.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:u,tipo:f}=await Ad(o,n.arvore,m,r.sinal,!0),v={alvo:s.numero,mudancas:[{campo:"Documento",antes:"",depois:`${f.texto} (c\xF3pia de ${s.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...v,resumo:`Vai duplicar ${s.titulo} (${s.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:b,numero:g,titulo:E}=await Ed(o,e,n.arvore,u,f,{tipo:f.id,descricao:t.semMinuta?yc(i.valor("txtDescricao")??""):i.valor("txtDescricao")??"",numero:yd(i.valor("txtNumero")),nomeArvore:i.valor("txtNomeArvore")?t.semMinuta?yc(i.valor("txtNomeArvore")??""):i.valor("txtNomeArvore")??"":void 0,documentoModelo:s.numero,interessados:i.itensLupa("selInteressados"),assuntos:i.itensLupa("selAssuntos"),observacao:i.valor("txaObservacoes")??"",nivel:p,hipotese:d},r.sinal);return{...v,aplicado:!0,resumo:`Documento ${s.numero} duplicado: ${E||f.texto} ${g?`(${g}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:b,numero:g}}}var Pd="seipro-processo-menu",ra="data-spro-pm-pedido";async function Dd(o,e){if(!e.html)return Pt(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function wc(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function Sc(o){let{ctx:e}=o,r=e.doc,t=i=>new URL(i,r.baseURI).href,a=(i,s)=>ao(e,i,s),n=(i,s,c)=>new Promise(p=>{let d=null,m=eo(e,{titulo:i,icone:"alerta",largura:420,conteudo:[l("p",{},s),go(...c.map(u=>u.principal?bo(u.rotulo,()=>{d=u.id,m.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{d=u.id,m.fechar()}},u.rotulo)))],aoFechar:()=>p(d)})});return{async copiar(i,s){let c=await Dd(r,i);a(c?s:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(i){let s=wc(e.topo),c=s[s.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(i))},abrirEmNovaAba(i){let s=l("a",{href:t(i),target:"_blank",rel:"noopener"});r.body.append(s),s.click(),s.remove()},baixar(i,s){let c=l("a",{href:t(i),download:s});r.body.append(c),c.click(),c.remove()},async duplicar(i,s){a("Duplicando o documento...",2e4);try{await Dc(o.sei,i,{aplicar:!0},{semMinuta:s}),a(`Documento ${i} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(wo(c),8e3)}},async perguntarMinuta(){let i=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return i==="remover"||i==="manter"?i:null},async confirmar(i,s){return await n("Confirmar",i,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:s,principal:!0}])==="ok"},async linkDaTela(i,s){let c=await o.http.obter(i),p=new RegExp(`var\\s+${s}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(i,s){r.documentElement.setAttribute(ra,`${i}|${s??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(Pd)),r.documentElement.hasAttribute(ra)&&(r.documentElement.removeAttribute(ra),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await Wr(e,"URGENTE")},clicarBotaoNativo(i){for(let s of wc(e.topo))try{let c=s.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${i}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var wd="configViewFlashMenuPro",Sd="configViewFlashDocMenuPro",Md="configViewFlashDocArvorePro";function Mc(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;qo(r);let n=new te(e.arv.documentos);n.lerDoIframe(r);let i=()=>({...e.arv,documentos:n.todos()}),s=o.sei??new cr(r.location?.href??"https://sei.invalido/sei/controlador.php",i,()=>ae(e.topo)),c=o.servicos??Sc({ctx:e,http:o.http,sei:s,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,d=()=>!!po(i(),"documento_escolher_tipo"),m=h=>({selecao:h,citacao:ur(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:d(),uploadLigado:Vo(o.dataValues,"uploaddocsexternos"),loteLigado:Vo(o.dataValues,"acoesemlote"),servicos:c}),u=()=>$r(e.armazenamento,Sd),f=()=>$r(e.armazenamento,wd),v=()=>$r(e.armazenamento,Md),b=()=>u()?.includes(it)??!1,g=(h,P)=>{let R=n.obter(h);return R||(n.lerDoIframe(r),R=n.obter(h)),{id:h,rotulo:P,dado:R}},E={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},x=h=>{let P=h;if(!P?.closest)return null;let R=P.closest('a[id^="anchorImg"]');if(R){let q=Wo(R.id,"anchorImg");return q&&q!==e.arv.idProcedimento&&er(e.armazenamento,"menudoc")?{tipo:"documento",ancora:R,id:q}:null}let F=P.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return F&&er(e.armazenamento,"menuproc")?{tipo:"processo",ancora:F}:null},S=h=>{if(h.tipo==="processo")return{itens:gc(m(f())),rotulo:"Menu do processo"};let P=r.getElementById(`anchor${h.id}`),R=g(h.id,(P?.textContent??"").replace(/\s+/g," ").trim());return{itens:fc(R,m(u())),rotulo:"Menu do documento"}},M=null,D=null,w,L=()=>{clearTimeout(w),D&&clearTimeout(D.timer),D=null;let h=M;M=null,h?.menu.fechar()},j=(h,P)=>{if(M?.ancora===h.ancora)return;L();let{itens:R,rotulo:F}=S(h);if(!R.length)return;let q=Ec(h.ancora,R,{rotulo:F,escuro:ko(r),focar:P,rodape:[E],aoFechar:()=>{M?.menu===q&&(M=null)},aoEscolher:Y=>{Promise.resolve().then(()=>Y.executar()).catch(ro=>{console.warn("[SEI Pro] menu da \xE1rvore:",ro),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});M={menu:q,ancora:h.ancora},q.el.addEventListener("mouseenter",()=>clearTimeout(w)),q.el.addEventListener("mouseleave",()=>W())},W=()=>{clearTimeout(w),w=setTimeout(L,a)},G=h=>{let P=h;return P?!!(M&&(M.ancora.contains(P)||M.menu.el.contains(P))||D?.ancora.contains(P)):!1},A=h=>{if(G(h.target)){clearTimeout(w);return}let P=x(h.target);if(D&&(clearTimeout(D.timer),D=null),!P||P.tipo==="documento"&&b()){M&&W();return}M&&W(),D={ancora:P.ancora,timer:setTimeout(()=>{D=null,j(P,!1)},t)}},k=h=>{h.relatedTarget||(D&&(clearTimeout(D.timer),D=null),M&&W())},T=h=>{let P=x(h.target);if(P){if(P.tipo==="documento"&&b()){h.preventDefault(),h.stopImmediatePropagation(),M?.ancora===P.ancora?L():j(P,!1);return}P.tipo==="documento"&&M?.ancora===P.ancora&&L()}},N=h=>{let P=x(h.target);!P||!(h.key==="ArrowDown"||(h.key==="Enter"||h.key===" ")&&P.tipo==="documento"&&b())||(h.preventDefault(),h.stopImmediatePropagation(),j(P,!0))};r.addEventListener("mouseover",A),r.addEventListener("mouseout",k),r.addEventListener("click",T,!0),r.addEventListener("keydown",N,!0);let J=null,K=()=>{if(!er(e.armazenamento,"iconstree")){xc(r);return}bc(r,e.arv.idProcedimento,g,()=>m(u()),v)};er(e.armazenamento,"iconstree")&&(J=Ac(r,async(h,P)=>{let R=r.getElementById(`anchor${h}`),F=g(h,(R?.textContent??"").replace(/\s+/g," ").trim());await st(F,m(u()),v()).find(Y=>Y.modo===P)?.executar()},K),K());let $=n.acompanharPastas(r,()=>setTimeout(K,80)),y=Ee(r,()=>{M&&(ko(r)?M.menu.el.setAttribute("data-tema","escuro"):M.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(h,P=!1){let R=Wo(h.id,"anchorImg");if(R)return j({tipo:"documento",ancora:h,id:R},P);j({tipo:"processo",ancora:h},P)},atual:()=>M?.menu??null,parar(){L(),r.removeEventListener("mouseover",A),r.removeEventListener("mouseout",k),r.removeEventListener("click",T,!0),r.removeEventListener("keydown",N,!0),J?.(),$(),y()}}}var Cd='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function Cc(o,e,r){for(let t of o.querySelectorAll(Cd)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function Ic(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(Cc(o.doc,"urgentePro",No(t.valor.especificacao,"URGENTE")),o.usaTrancado&&Cc(o.doc,"trancadoPro",No(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function Oc(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var Id=["dadosProcesso","marcador"],Od=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Tc(o,e){let r=null,t=s=>{let c=Oc(s);c===null?o.documentElement?.removeAttribute(Pr):o.documentElement?.setAttribute(Pr,c)},a=()=>{e().then(s=>{if(!(!s||s.sigiloso))for(let c of Id)s.loja.ler(c).estado!=="pronto"&&s.recarregar(c)}).catch(s=>console.warn("[SEI Pro] capa do processo:",s))},n=()=>{if(r)return;let s=new AbortController;r=s,t({fase:"coletando",feito:0,total:0}),e().then(async c=>{if(!c||c.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await Ae(c,{sinal:s.signal,aoProgresso:(p,d)=>t({fase:"coletando",feito:p,total:d})}),t("pronto")}).catch(c=>{Od(c)||s.signal.aborted?t({fase:"parada"}):t({fase:"erro",mensagem:Go(c)})}).finally(()=>{r=null})},i=()=>r?.abort();return o.addEventListener(Ar,a),o.addEventListener(Er,n),o.addEventListener(yr,i),()=>{o.removeEventListener(Ar,a),o.removeEventListener(Er,n),o.removeEventListener(yr,i)}}function Td(o,e){let r=o.replace(/\s+/g," ").trim();return r?`${r} | SEI - Processo ${e}`:`SEI - Processo ${e}`}function kc(o){if(o.sigiloso||o.consultasDesativadas)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;if(!t||!t.disponivel)return;let a=Td(t.valor.especificacao,o.protocolo);o.topo.title!==a&&(o.topo.title=a)},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}var ta=null;pn(`${na}
${ga}`);Xt(window)&&(Ws(document),Ks(document));Kt(window)&&(Bs(document),Gs(document),js(document));var Lc=window;if(!Lc.__seiProProcessoPaineis&&Kt(window)&&!Yt(window)){Lc.__seiProProcessoPaineis=!0,$n(document,aa),Tc(document,aa);let o=()=>void Ld().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}if(zs(window)&&!Yt(window)){let o=()=>void qs().catch(e=>console.warn("[SEI Pro] aviso de n\xE3o assinados:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function aa(){return ta??=kd().catch(o=>{throw ta=null,o}),ta}async function kd(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await sr(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=fr(),t=Qr(r),a=e.nivel==="sigiloso",n=new Se(dr(chrome.storage.local,"local"),Zr(t.host,t.login),e.idProcedimento,{sigiloso:a}),i=Ue(location.href),s=mr(o,"disablequery"),c=Us({http:i,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:s});return Ps({doc:document,topo:r,arv:e,loja:n,...t,habilitados:Vn(jn(localStorage)),armazenamento:localStorage,consultasDesativadas:s,reaberturaProgramada:mr(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:p=>{let d=c[p];d&&n.carregar(p,d)}})}async function Ld(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=Vo(o,"infoarvore")&&Wn(localStorage),r=Vo(o,"menurapido"),t=Vo(o,Ka),a=!mr(o,"disablequery")&&Xt(window.top);if(!e&&!r&&!t&&!a)return;let n=await aa();if(n){if(a&&!n.sigiloso&&(kc(n),e||n.recarregar("dadosProcesso")),e){es(n),Ic(n);let i=new Set(os(n));a&&!n.sigiloso&&i.add("dadosProcesso");for(let s of i)n.recarregar(s);Ha(n).catch(()=>{})}r&&Mc({ctx:n,dataValues:o,http:Ue(location.href)}),t&&Vs(n)}}})();
