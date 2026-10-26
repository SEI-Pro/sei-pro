/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Hc(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function mr(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Hc(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function fr(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function Vo(o,e){let r=fr(o,e);return!(r===!1||r===0||r==="")}function gr(o,e){let r=fr(o,e);return r===!0||r===1||r==="1"}var ca=`/*
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
`;var Vc={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function Do(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):Vc[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var la={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Uc={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Ue(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Uc[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var Bc=/[A-Za-z0-9\-_.*]/;function pa(o){let e="";for(let r of o)r===" "?e+="+":Bc.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function da(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${pa(Ue(r))}=${pa(Ue(t??"",a))}`}).join("&")}function ua(o){let e=r=>encodeURIComponent(Ue(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var ma="application/x-www-form-urlencoded";function mt(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=la[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var fa="application/x-www-form-urlencoded; charset=ISO-8859-1";var ga=null;function ue(o){return ga?ga(o):new DOMParser().parseFromString(o,"text/html")}function _(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var M=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Uo(o){if(o instanceof M)return o;if(o instanceof DOMException&&o.name==="AbortError")return new M("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new M("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function va(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=ue(r)}}}function ha(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new M("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new M("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=_(r);throw new M("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new M("SEI_VALIDACAO",r,r)}return o}function Be(o,e={}){let r=new URL(".",o),t=e.fetch??((...f)=>fetch(...f)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(f){n>=a&&await new Promise(u=>s.push(u)),n+=1;try{return await f()}finally{n-=1,s.shift()?.()}}let c=f=>new URL(f.replace(/&amp;/g,"&"),r).href;async function p(f,u,g){return i(async()=>{try{let v=await t(c(f),{credentials:"same-origin",redirect:"follow",...u,signal:g.sinal}),h=mt(await v.arrayBuffer());return ha(va(v.url||c(f),v.status,h),g)}catch(v){throw Uo(v)}})}async function d(f,u={}){return i(async()=>{try{let g=await t(c(f),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),v=new Uint8Array(await g.arrayBuffer()),h=(g.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();h==="text/html"&&ha(va(g.url||c(f),g.status,mt(v)),u);let m=g.headers?.get("content-disposition")??"",E=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(m)?.[1]??/filename="?([^";]+)"?/i.exec(m)?.[1]??"");return{bytes:v,tipo:h,nome:E}}catch(g){throw Uo(g)}})}return{base:r,absoluta:c,baixar:d,obter:(f,u={})=>p(f,{method:"GET"},u),enviar:(f,u,g={})=>p(f,g.utf8?{method:"POST",headers:{"Content-Type":ma},body:ua(u)}:{method:"POST",headers:{"Content-Type":fa},body:da(u,g.modos)},g)}}function ne(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function vr(){try{return window.top?.document??document}catch{return document}}var ba=`/*
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
`;var jc={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Ge(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=jc[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function ft(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=Ge(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function co(o){return typeof o=="string"?Do(o):o==null?"":String(o)}var Wc=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Bo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Wc))e.add(r[0]);return[...e]}function to(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function so(o,e,r={}){let t=Array.isArray(o)?o:Bo(o);for(let a of t){let n=to(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function xa(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=Bo(r).filter(s=>to(s).get("acao")===e),n=(t.length?t:Bo(o.html).filter(s=>to(s).get("acao")===e)).sort((s,i)=>[...to(s).keys()].length-[...to(i).keys()].length)[0];if(!n)throw new M("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function Aa(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=ft(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Ge(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Ea(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=ft(o,r.index+r[0].length);e.push({tipo:co(t[0]),idPai:co(t[2]),href:co(t[3]),titulo:co(t[5]),icone:co(t[6]),extra:t[8]==null?void 0:co(t[8])})}return e}function ya(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function Pa(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>co(e[1])))]}function Da(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var Kc=/\s*\(\d{5,}\)\s*$/;function wa(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=co(r.args[1]),a=co(r.args[5]),n=co(r.args[7]),s=(r.props.src??"").replace(/&amp;/g,"&"),i=e.find(f=>f.tipo==="ASSINATURA"&&f.idPai===t),{nivel:c,hipotese:p}=ya(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:co(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(Kc,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(s)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:p,assinado:!!i,assinaturas:i?i.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(f=>f.tipo==="UNIDADE_GERADORA"&&f.idPai===t)?.extra,link:co(r.args[3]).replace(/&amp;/g,"&"),src:s,acoes:Bo(r.props.acoes??""),botoes:Pa(r.props.acoes??""),funcoes:Da(r.props.acoes??"")}})}function Sa(o){return wa(Aa(o.html),Ea(o.html))}function gt(o){let e=o.html,r=Aa(e),t=Ea(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new M("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=co(a.args[1]),s=ya(t,n),i=wa(r,t);return{idProcedimento:n,protocolo:co(a.args[5])||co(a.args[15]),tipo:co(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:Bo(a.props.acoes??""),botoesProcesso:Pa(a.props.acoes??""),funcoesProcesso:Da(a.props.acoes??""),linkProcesso:co(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Bo(e),pagina:o}}async function Ca(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new M("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=so(t.html,"procedimento_visualizar")&&Bo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return gt(t)}function po(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?so(t.acoes,e):null}return so(o.acoesProcesso,e)??so(o.links,e,{id_procedimento:o.idProcedimento})}function uo(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var me={publico:"0",restrito:"1"},fe={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function ge(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(Do(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Ta="\xA5",vt="\xB1";function Ma(o){return o.map(e=>`${e.id}${vt}${e.texto}`).join(Ta)}function Xc(o){return o?o.split(Ta).map(e=>{let[r,...t]=e.split(vt);return{id:r,texto:t.join(vt)}}):[]}function Ia(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var Q=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Yc(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new M("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,_(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Oa(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??_(t),texto:_(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=Po(r),n=t.find(s=>s.valor===r)??t.find(s=>Po(s.texto)===a)??ht(t.filter(s=>Po(s.texto).includes(a)));if(!n)throw new M("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Xc(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new M("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Ma(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new M("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new M("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new M("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${_(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??ht([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??_(r)??e]:[e,e]}hiddenDaLupa(e){let r=Ia(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Ia(this.pagina.html)){let t=this.elemento.querySelector(`select#${Oa(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:_(n)}));(this.valor(r)??"")||this.definir({[r]:Ma(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function Yc(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(p=>p.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??_(p)})}}return e}function Po(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function ve(o,e,r){let t=Po(e),a=o.find(n=>n.id===e)??o.find(n=>Po(n.texto)===t)??ht(o.filter(n=>Po(n.texto).includes(t)));if(!a)throw new M("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function ht(o){return o.length===1?o[0]:void 0}function Oa(o){return o.replace(/([^\w-])/g,"\\$1")}function Jc(o){let e=new Set;return o.filter(r=>!e.has(r.id)&&e.add(r.id))}function bt(o){return o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function xt(o,e){let t=new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${bt(e)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`).exec(o);return t?Do(t[1]):null}function At(o,e){let t=new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${bt(e)}['"]`).exec(o)?.[1];if(!t)return!1;let a=new RegExp(`\\b${bt(t)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(o)?.[1];return!!a&&/encodeURIComponent\s*\(/.test(a)}async function Et(o,e,r,t,a=!1){let n=a?encodeURIComponent(Ue(r)):r,s=await o.ajax(e,[["palavras_pesquisa",n]],{sinal:t,utf8:!0});return Jc(s.map(i=>({...i,texto:Do(i.texto)})))}function he(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let s of o.matchAll(a))n.set(s[1],s[2]);return n}function Zc(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function Qc(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function je(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=Zc(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:Qc(o),sigla:_(r)||_(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var ol=3e4,hr=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Be(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new M("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return je(this.base())}linkMenu(e){return xa(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new M("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=Q.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=to(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new M("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=to(Do(c)).get("id_procedimento")??"",f=i.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:f&&f!==d?f:void 0,linkArvore:Do(c)};return this.localizados.set(t,u),u}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<ol)return a.arvore;let n=await Ca(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:Do(s[1]),texto:Do(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=ue(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function be(o,e,r){let t=po(o,e);if(!t)throw new M("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function We(o,e,r){let t=await Q.abrir(o,be(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var La=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Na(o,e,r){let t=La.exec(r),a=r.replace(La,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function el(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(_(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>_(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let s=[...n.querySelectorAll("td")],i=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Na(i||void 0,_(s[t]),_(s[a]))}async function _a(o,e,r){let t=await o.obter(be(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=Q.de(t,"#frmAcompanhamentoCadastro"),s=n.valor("hdnIdAcompanhamento");if(!s)return null;let i=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Na(s,i.trim(),(n.valor("txaObservacao")??"").trim())}let a=el(t);if(a===void 0)throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",_(t.doc.querySelector("title")));return a}function rl(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?Ge(o.pagina.html,e.index+e[0].length-1)[0]:""}function tl(o){if(!o.trim())return[];let e=ue(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let s=n;t.ancoras.push({sigla:_(s),nome:s.getAttribute("title")??s.getAttribute("alt")??""})}return a(),r}function Ra(o,e){let r=tl(rl(o)),t=[];for(let s of r){if(!s.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(s.texto)){t.push({texto:s.texto,unidade:s.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(s.texto)&&s.ancoras.length>1?s.ancoras[1]:null;t.push({texto:s.texto,unidade:s.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??je(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(s=>s.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!po(o,"procedimento_alterar"),texto:r.map(s=>s.texto).join(`
`),linhas:t}}var br=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function $a(o,e){let r=o.filter(s=>s.unidade===e),t=s=>s.reduce((i,c)=>!i||br(c.data)>br(i.data)?c:i,null),a=t(r.filter(s=>s.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(s=>s.descricao.includes("Processo retirado do bloco")));return n&&br(a.data)<br(n.data)?null:a.descricao}function xr(o){let e=t=>!!po(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function za(o,e,r){let t=await o.obter(be(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",_(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(s=>s.querySelector("input[type=checkbox]")).map(s=>{let i=[...s.querySelectorAll("td")];return{id:s.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:_(i[1]),texto:_(i[2]),icone:i[1]?.querySelector("img")?.getAttribute("src")??"",usuario:_(i[3]),data:_(i[4])}})}async function qa(o,e,r){let a=(await Q.abrir(o,be(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(s=>s.selecionada&&s.valor!=="null")?.valor;return{opcoes:a.filter(s=>s.valor!=="null"&&s.texto).map(s=>({valor:s.valor,texto:s.texto})),...n?{atual:n}:{}}}async function Ha(o,e,r){let t=await o.obter(be(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let s=so(t.html,"andamento_marcador_cadastrar");if(!s)throw new M("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(s,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(s=>({valor:s.getAttribute("value")??"",texto:_(s),icone:s.getAttribute("data-imagesrc")??void 0})).filter(s=>s.valor&&s.valor!=="null"&&s.texto).map(s=>s.icone?s:{valor:s.valor,texto:s.texto})}async function Fa(o,e,r){let t=await o.obter(be(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>so(t.html,p)).find(Boolean);if(!c)throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let s=Q.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),i=s.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:s.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...i?{atual:i}:{}}}async function Va(o,e,r){let t=po(e,"procedimento_alterar")??po(e,"procedimento_consultar");if(!t)throw new M("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await Q.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),s=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,i=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...i?{tipoAtual:i}:{},nivel:a.valor("rdoNivelAcesso")??"",...s?{hipoteseAtual:s}:{},interessados:a.itensLupa("selInteressadosProcedimento"),assuntos:a.itensLupa("selAssuntos"),interessadosNegados:he(a.pagina.html,"interessado"),assuntosNegados:he(a.pagina.html,"assunto"),pesquisarAssuntos:(c,p)=>ka(o,a,"hdnIdAssunto","assuntos",c,p),pesquisarContatos:(c,p)=>ka(o,a,"hdnIdInteressadoProcedimento","contatos",c,p),async hipoteses(c,p){return(await ge(o,a,c,p)).map(d=>({valor:d.id,texto:d.texto}))}}}async function ka(o,e,r,t,a,n){let s=xt(e.pagina.html,r);if(!s)throw new M("SEI_VERSAO_NAO_SUPORTADA",`A tela de altera\xE7\xE3o do processo n\xE3o tem a pesquisa de ${t}.`);return Et(o,s,a,n,At(e.pagina.html,r))}var Ar=(o,e)=>o>0&&e-o<18e5;var Ke=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function yt(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:$a(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function xe(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:Ar(e.coletadoEm,o.agora().getTime())}:null}async function Ua(o){let e=await xe(o);return e?.vale?(yt(o,e.historico),!0):!1}async function Ae(o,e={}){if(o.sigiloso)throw new Ke;let r=await xe(o);if(r?.vale&&!e.forcar)return yt(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),yt(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var Ba="data-seipro-processo-paineis",Ga="data-seipro-processo-menu",ja="data-seipro-processo-capa",Wa="data-seipro-processo-gantt",Ka="data-seipro-processo-titulo",Xa="data-seipro-processo-aviso",Ya="naoassinados",Er="spro-processo-gantt-abrir",yr="spro-processo-capa-pedir",Pr="spro-processo-capa-calcular",Dr="spro-processo-capa-cancelar",wr="data-spro-capa-coleta",Sr="spro-processo-capa-contar",Cr="spro-processo-capa-contar-parar",Xe="data-spro-capa-contagem";var Ja="filtroarvore";var Mr="processo/",Pt=(o,e)=>`${Mr}${o}/${e}`,Dt=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},wt="processo-historico/",St=(o,e)=>`${wt}${o}/${e}`;function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var Ro={fill:"currentColor",stroke:"none"},Za="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",Qa={estrela:[["path",{d:Za}]],estrelaCheia:[["path",{d:Za,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...Ro}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...Ro}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...Ro}],["circle",{cx:"12",cy:"12",r:"1.4",...Ro}],["circle",{cx:"19",cy:"12",r:"1.4",...Ro}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...Ro}],["circle",{cx:"15",cy:"6",r:"1.3",...Ro}],["circle",{cx:"9",cy:"12",r:"1.3",...Ro}],["circle",{cx:"15",cy:"12",r:"1.3",...Ro}],["circle",{cx:"9",cy:"18",r:"1.3",...Ro}],["circle",{cx:"15",cy:"18",r:"1.3",...Ro}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},zu=Object.keys(Qa);function H(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of Qa[o]){let c=r.createElementNS(t,s);for(let[p,d]of Object.entries(i))c.setAttribute(p,d);a.append(c)}return a}function al(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function on(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function en(o,e,r,t,a){let n=o.body??o.documentElement;for(let f of[n,...o.querySelectorAll("dialog")])for(let u of[...f.children])u.classList.contains("spro-aviso")&&u.remove();let s=l("div",{class:"spro-aviso",role:"status"},H("check",16),l("span",{},e),...al(r).map(f=>l("button",{type:"button",onclick:()=>{s.remove(),f.fazer()}},f.rotulo)));s.setAttribute("popover","manual");let i=()=>{try{s.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let f=on(o);f.append(s),i(),f.localName==="dialog"&&f.addEventListener("close",()=>{if(!(!d||!f.contains(s))){if(a&&on(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){d=!1,s.remove();return}p()}},{once:!0})},d=!0;return p(),setTimeout(()=>{d=!1,s.remove()},t),s}async function Ct(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function ao(o,e,r=4e3){try{en(o.topo,e,void 0,r)}catch{}}async function rn(o,e){let r=await Ct(o.doc,e);ao(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var tn={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},an={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function wo(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function Go(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":wo(o)}function fo(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var nn=new Set;var nl=null;function sl(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function sn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function Ir(o,e,r){let t=o.ownerDocument,a=t.defaultView;sl(o).append(e);let n=!0,s=()=>{if(!n)return;let u=o.getBoundingClientRect?.();if(!u)return;let g=a?.innerHeight??0,v=a?.innerWidth??0,h=Math.min(r.largura??Math.max(u.width,r.larguraMinima??0),Math.max(180,v-16)),m=r.alinharDireita?u.right-h:u.left,E=Math.max(8,Math.min(m,v-h-8)),x=r.alturaMaxima??360;e.style.maxHeight="none";let S=Math.min(e.scrollHeight||x,x),C=g-u.bottom-8,D=u.top-8,w=nl?.()??!1,k=!w&&C<Math.min(S,200)&&D>C;e.style.left=`${E}px`,e.style.width=`${h}px`,e.style.maxHeight=`${w?x:Math.max(140,Math.min(x,k?D:C>140?C:x))}px`,e.classList.toggle("spro-flutuante-cima",k),k?(e.style.top="",e.style.bottom=`${g-u.top+4}px`):(e.style.bottom="",e.style.top=`${u.bottom+4}px`),sn(a,k?0:Math.ceil(u.bottom+4+S+12))},i=u=>{let g=u.composedPath?.()??[],v=u.target,h=m=>g.includes(m)||!!v&&!!m.contains?.(v);h(e)||h(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},p=u=>{u.target instanceof Node&&e.contains(u.target)||c()},d=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let f={ancora:o,fechar:()=>r.aoFechar()};return nn.add(f),s(),{posicionar:s,fechar(){n&&(n=!1,nn.delete(f),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),e.remove(),sn(a,0))}}}function cn(o,e){let r=fo(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=fo(n.rotulo),c=fo(n.complemento??""),p=`${i} ${c} ${fo(n.descricao??"")}`;if(!t.every(f=>p.includes(f)))return;let d=i.startsWith(r)?0:`${i} ${c}`.split(" ").some(f=>f.startsWith(t[0]))?1:2;a.push({o:n,nota:d,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function ln(o,e){let r=o.normalize("NFC"),t=fo(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((p,d)=>{let f=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let u of f)n+=u,s.push(d)});let i=new Array(a.length).fill(!1);for(let p of t){let d=n.indexOf(p);if(!(d<0))for(let f=d;f<d+p.length;f++)i[s[f]]=!0}let c=[];return a.forEach((p,d)=>{let f=c[c.length-1];f&&f.marcado===i[d]?f.texto+=p:c.push({texto:p,marcado:i[d]})}),c}var il=0;function pn(o){let e=`spro-combo-${++il}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=A=>r().find(L=>L.valor===A)??t.get(A),n=[...o.valor??[]],s=null,i="",c=0,p=[],d=null,f=o.vazio??"Escolher\u2026",u={tipo:"pronto"},g=0,v=l("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),h=()=>o.aoMudar?.([...n]);function m(){let A=[];o.icone&&A.push(H(o.icone,15));let L=n.map(N=>a(N)).filter(N=>!!N),T=l("span",{class:"spro-combo-texto"});if(!L.length)T.classList.add("spro-combo-vazio"),T.append(f);else{let N=L[0];N.marca&&T.append(N.marca()),N.cor&&T.append(l("span",{class:"spro-combo-cor",style:`background:${N.cor}`})),T.append(l("span",{class:"spro-combo-rotulo"},N.rotulo)),N.complemento&&T.append(l("span",{class:"spro-combo-compl"},N.complemento)),L.length>1&&T.append(l("span",{class:"spro-combo-mais"},`+${L.length-1}`))}A.push(T,H("chevron",14)),v.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false"),v.classList.toggle("spro-combo-erro",u.tipo==="erro"),v.classList.toggle("spro-combo-ativo",o.multiplo===!0&&L.length>0),v.replaceChildren(...A)}let E=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function x(A){if(o.multiplo){n=n.includes(A.valor)?n.filter(T=>T!==A.valor):[...n,A.valor],h(),m(),w();return}let L=n.length!==1||n[0]!==A.valor;n=[A.valor],m(),G(!0),L&&h()}async function S(){if(!o.criar)return;let A=i.trim();if(!A)return;let L=await o.criar(A);if(L){if(t.set(L.valor,L),i="",s){let T=s.querySelector(".spro-combo-busca");T&&(T.value="")}o.multiplo&&n.includes(L.valor)?w():x(L)}}function C(A,L){let T=n.includes(A.valor),N=l("span",{class:"spro-combo-op-rotulo"});for(let $ of ln(A.rotulo,i))N.append($.marcado?l("mark",{},$.texto):$.texto);let J=A.complemento?l("span",{class:"spro-combo-op-compl"}):null;if(J&&A.complemento)for(let $ of ln(A.complemento,i))J.append($.marcado?l("mark",{},$.texto):$.texto);let K=l("li",{role:"option",id:`${e}-op-${L}`,class:`spro-combo-op${L===c?" spro-combo-op-ativa":""}`,"data-valor":A.valor,"aria-selected":T?"true":"false"},o.multiplo?l("span",{class:"spro-combo-caixa","aria-hidden":"true"},T?H("check",12):null):null,A.marca?A.marca():null,A.cor?l("span",{class:"spro-combo-cor",style:`background:${A.cor}`}):null,A.icone?H(A.icone,15):null,l("span",{class:"spro-combo-op-textos"},J?l("span",{class:"spro-combo-op-linha"},N,J):N,A.descricao?l("span",{class:"spro-combo-op-desc"},A.descricao):null),A.contagem!==void 0?l("span",{class:"spro-combo-conta"},String(A.contagem)):null,!o.multiplo&&T?l("span",{class:"spro-combo-marca"},H("check",14)):null);return K.addEventListener("pointerdown",$=>$.preventDefault()),K.addEventListener("click",()=>{c=L,x(A)}),K.addEventListener("pointermove",()=>{c!==L&&(c=L,D())}),K}function D(){if(!s)return;let A=[...s.querySelectorAll('[role="option"]')];A.forEach((J,K)=>{J.classList.toggle("spro-combo-op-ativa",K===c)});let L=A[c],N=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');L?(N?.setAttribute("aria-activedescendant",L.id),L.scrollIntoView?.({block:"nearest"})):N?.removeAttribute("aria-activedescendant")}function w(){if(!s)return;let A=cn(r(),i);g=A.length,p=o.limite!==void 0&&A.length>o.limite?A.slice(0,o.limite):A,u.tipo!=="pronto"&&(p=[]),c>=p.length&&(c=Math.max(0,p.length-1));let L=s.querySelector('[role="listbox"]');L.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false");let T=s.querySelector(".spro-combo-extras");if(T.replaceChildren(),u.tipo==="carregando")L.replaceChildren(...[62,84,48,74].map($=>l("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},l("span",{style:`width:${$}%`})))),T.append(l("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(u.tipo==="erro"){L.replaceChildren();let $=u.tentar;if(T.append(l("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},u.mensagem)),$){let y=l("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},H("atualizar",14),l("span",{},"Tentar de novo"));y.addEventListener("pointerdown",b=>b.preventDefault()),y.addEventListener("click",$),T.append(y)}}else{L.replaceChildren(...p.map(C));let $=i.trim();p.length||T.append(l("p",{class:"spro-combo-nada"},$?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let y=p.length?o.resumo?.(p.length,g,r().length):void 0;y&&T.append(l("p",{class:"spro-combo-resumo",role:"status"},y)),p.length<g&&T.append(l("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${p.length} de ${g}. Digite para refinar.`))}let N=i.trim(),J=r().some($=>fo($.rotulo)===fo(N));if(o.criar&&N&&!J&&u.tipo==="pronto"){let $=l("button",{type:"button",class:"spro-combo-criar"},H("mais",14),l("span",{},o.rotuloCriar?o.rotuloCriar(N):`Criar \u201C${N}\u201D`));$.addEventListener("pointerdown",y=>y.preventDefault()),$.addEventListener("click",()=>void S()),T.append($)}let K=s.querySelector(".spro-combo-rodape");if(K){let $=p.filter(P=>!n.includes(P.valor)),y=l("button",{type:"button",class:"spro-combo-acao",disabled:!N||!$.length},`Marcar os filtrados${N&&$.length?` (${$.length})`:""}`);y.addEventListener("click",()=>{n=[...n,...$.map(P=>P.valor)],h(),m(),w()});let b=l("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");b.addEventListener("click",()=>{n=[],h(),m(),w()}),K.replaceChildren(l("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),y,b)}D()}let k=()=>d?.posicionar();function j(A){let L=p.length,T=A.target,N=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],J=!!T?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(A.key==="Tab"){let $=N.indexOf(T);if(!A.shiftKey&&$<N.length-1)N[$+1]?.focus();else if(A.shiftKey&&$>=0)$>0?N[$-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{G(!0);return}A.preventDefault(),A.stopPropagation();return}if(J&&A.key!=="Escape")return;let K=!s?.querySelector(".spro-combo-busca");if(K&&A.key===" "){let $=p[c];$&&x($),A.preventDefault(),A.stopPropagation();return}if(K&&A.key.length===1&&!A.ctrlKey&&!A.metaKey&&!A.altKey){let $=fo(A.key),b=[...p.keys()].map(P=>(c+1+P)%Math.max(1,L)).find(P=>fo(p[P]?.rotulo??"").startsWith($));b!==void 0&&(c=b,D()),A.preventDefault(),A.stopPropagation();return}switch(A.key){case"ArrowDown":c=L?(c+1)%L:0,D();break;case"ArrowUp":c=L?(c-1+L)%L:0,D();break;case"Home":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,D();break;case"End":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,L-1),D();break;case"Enter":{let $=p[c];$?x($):S();break}case"Escape":G(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),h(),m(),w();break;default:return}A.preventDefault(),A.stopPropagation()}function W(A=""){if(s)return;i=A,c=A?0:(()=>{let J=cn(r(),i).findIndex(K=>K.valor===n[n.length-1]);return J<0?0:J})();let T=E()?l("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:A}):null;if(T&&(T.value=A,T.addEventListener("input",()=>{i=T.value,c=0,w(),k()})),s=l("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},T?l("div",{class:"spro-combo-cabeca"},H("busca",15),T):null,l("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:T?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),l("div",{class:"spro-combo-extras"}),o.multiplo?l("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",j),d=Ir(v,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>G(!1)}),v.setAttribute("aria-expanded","true"),v.setAttribute("aria-controls",`${e}-lista`),v.classList.add("spro-combo-aberto"),w(),k(),!s)return;(T??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),T&&A&&T.setSelectionRange?.(A.length,A.length)}function G(A=!1){s&&(d?.fechar(),d=null,s=null,i="",v.setAttribute("aria-expanded","false"),v.removeAttribute("aria-controls"),v.classList.remove("spro-combo-aberto"),A&&v.focus?.({preventScroll:!0}))}return v.addEventListener("click",()=>s?G(!0):W()),v.addEventListener("keydown",A=>{s||(A.key==="ArrowDown"||A.key==="ArrowUp"?(A.preventDefault(),W()):A.key.length===1&&A.key!==" "&&!A.ctrlKey&&!A.metaKey&&!A.altKey&&E()&&(A.preventDefault(),W(A.key)))}),m(),{el:v,valor:()=>[...n],definir(A,L=!1){n=[...A],m(),w(),L&&h()},atualizar(){m(),w()},definirVazio(A){f=A,m()},definirEstado(A){u=A,m(),w(),k()},abrir:W,fechar:()=>G(!1)}}function dn(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}var un="spro-processo-estilo",Mt="";function mn(o){Mt=o}function qo(o){if(!Mt||o.getElementById(un))return;let e=o.createElement("style");e.id=un,e.textContent=Mt,(o.head??o.documentElement).append(e)}function Lo(o){let e=dn(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Ee(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function eo(o,e){qo(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});Lo(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},H("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),s=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},H(e.icone,18)),l("h2",{},e.titulo),a),s);let i=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",i),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select, button[role=combobox])")?.focus({preventScroll:!0}),{el:r,corpo:s,fechar:i,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let d of p)d.disabled=!0;r.setAttribute("aria-busy","true");try{let d=await c();return t=!1,r.close(),d&&ao(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){t=!1,a.disabled=!1;for(let f of p)f.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(wo(d)),!1}}}}function Or(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function So(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function go(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function bo(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function Jo(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function jo(o){let e=o.opcoes??[],r=typeof o.valor=="string"?o.valor:"",t=()=>r||e.some(p=>p.valor==="")?[r]:[],a=pn({rotulo:o.rotulo,opcoes:()=>e,valor:t(),vazio:o.carregar&&!o.adiar?"Carregando\u2026":o.vazio,busca:o.busca??!0,...o.limite!==void 0?{limite:o.limite}:{},...o.resumo?{resumo:o.resumo}:{},...o.dicaBusca?{dicaBusca:o.dicaBusca}:{},classe:"spro-p-combo",larguraLista:260,aoMudar:p=>{r=p[0]??"",o.aoMudar?.(r)}}),n=o.carregar,s=null,i=()=>(s||(s=c()),s);async function c(){if(n){a.definirVazio("Carregando\u2026"),a.definirEstado({tipo:"carregando"});try{e=await n(),typeof o.valor=="function"&&(r=o.valor(e)??r),a.definir(t()),a.definirVazio(o.vazio),a.definirEstado({tipo:"pronto"})}catch(p){a.definirVazio("N\xE3o foi poss\xEDvel carregar"),a.definirEstado({tipo:"erro",mensagem:wo(p),tentar:()=>void c()})}}}return{el:a.el,combo:a,valor:()=>r,definir(p){r=p,a.definir(t())},opcoes:()=>e,pronto:o.adiar?Promise.resolve():i(),carregarAgora:i}}function ye(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),s=l("button",{type:"button",class:"spro-botao"},"Cancelar"),i=eo(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),go(s,n)],aoFechar:()=>t(a)});s.addEventListener("click",()=>i.fechar()),n.addEventListener("click",()=>{a=!0,i.fechar()})})}var Co={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},cl=120*1e3;function ko(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var Zo=(o,e)=>o.startsWith(ko(e));function Tr(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function gn(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function se(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function ll(o){let e=[];return o.forEach((r,t)=>{let a=gn(r.dataISO||Tr(r.data));a&&e.push({a:r,t:a,i:t,d:ko(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function vn(o,e){return ko(o)===ko(e)}function hn(o,e,r){return vn(o.unidade,e)?!o.unidadeNome||!r||ko(o.unidadeNome)===ko(r):!1}function Ye(o,e,r){let t=o.filter(s=>vn(s.unidade,e));if(new Set(t.map(s=>s.unidadeNome?ko(s.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(s=>hn(s,e,r));return n.length?n:t}function pl(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,s)=>n.recebido.getTime()<r(s)&&s.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(ko(n.unidade),[...a.get(ko(n.unidade))??[],n]);for(let[n,s]of a){let i=s.some(c=>s.some(p=>c.unidadeNome&&p.unidadeNome&&ko(c.unidadeNome)!==ko(p.unidadeNome)&&t(c,p)));for(let c of s)c.chave=i&&c.unidadeNome?`${n}|${ko(c.unidadeNome)}`:n}}function fn(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${Co.remetidoPrefixo}`,"i"),"")).trim()}function dl(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function bn(o,e){let r=ll(o),t=[],a=[],n=[],s=[],i=(g,v)=>Ye(a,g,v)[0],c=(g,v)=>{let h=Ye(n,g,v)[0];return h?n.indexOf(h):-1},p=(g,v)=>{let{a:h}=g;if(a.some(x=>hn(x,h.unidade,h.unidadeNome)))return;let m={unidade:h.unidade,...h.unidadeNome?{unidadeNome:h.unidadeNome}:{},chave:"",recebido:g.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:v,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:h.usuario,...h.usuarioNome?{usuarioRecebeuNome:h.usuarioNome}:{}},E=c(h.unidade,h.unidadeNome);if(E>=0){let[x]=n.splice(E,1);m.chegouEm=x.em,m.origem=x.origem}a.push(m),t.push(m)},d=(g,v,h)=>{g.remetido=v.t,g.fim=h,g.usuarioEnviou=v.a.usuario,v.a.usuarioNome&&(g.usuarioEnviouNome=v.a.usuarioNome),a.splice(a.indexOf(g),1)},f=g=>{let{a:v}=g;if(i(v.unidade,v.unidadeNome))return;let h=c(v.unidade,v.unidadeNome),m={em:g.t,unidade:v.unidade,...v.unidadeNome?{unidadeNome:v.unidadeNome}:{},origem:fn(v),usuario:v.usuario,...v.usuarioNome?{usuarioNome:v.usuarioNome}:{}};h>=0?n[h]=m:n.push(m)};for(let g=0;g<r.length;){let v=g+1;for(;v<r.length&&r[v].t.getTime()===r[g].t.getTime();)v+=1;let h=r.slice(g,v);g=v;for(let m of h)Zo(m.d,Co.remetidoPrefixo)&&f(m);for(let m of h)Zo(m.d,Co.recebido)&&p(m,"recebido");for(let m of h){let{a:E,d:x}=m;if(Co.gerado.some(S=>Zo(x,S)))p(m,"gerado");else if(Zo(x,Co.reabertura))p(m,"reabertura");else if(Zo(x,Co.conclusao)){let S=i(E.unidade,E.unidadeNome);S&&d(S,m,"conclusao")}else if(Zo(x,Co.remetidoPrefixo)){let S=fn(E),C=E.unidadeCitadaNome,D=i(S,C);if(D)d(D,m,"remessa"),D.destinos.push(E.unidade);else{let w=Ye(t,S,C).at(-1);w?.fim==="remessa"&&w.remetido&&m.t.getTime()-w.remetido.getTime()<=cl&&!w.destinos.includes(E.unidade)&&w.destinos.push(E.unidade)}}else Zo(x,Co.documentoGerado)?s.push({ev:m,assinado:!1}):Zo(x,Co.documentoAssinado)&&s.push({ev:m,assinado:!0})}}for(let g of n)t.push({unidade:g.unidade,...g.unidadeNome?{unidadeNome:g.unidadeNome}:{},chave:"",recebido:g.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:g.em,origem:g.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:g.usuario,...g.usuarioNome?{usuarioEnviouNome:g.usuarioNome}:{}});for(let{ev:g,assinado:v}of s){let{a:h}=g,m=Ye(t.filter(S=>!S.pendenteRecebimento&&S.recebido.getTime()<=g.t.getTime()),h.unidade,h.unidadeNome),E=[...m].reverse().find(S=>S.remetido===null||g.t.getTime()<=S.remetido.getTime())??m[m.length-1];if(!E)continue;let x={...h.nrSei?{nrSei:h.nrSei}:{},...h.idDocumento?{idDocumento:h.idDocumento}:{},em:g.t,titulo:dl(h),...h.usuario?{usuario:h.usuario}:{}};(v?E.assinaturas:E.documentos).push(x)}t.sort((g,v)=>g.recebido.getTime()-v.recebido.getTime());for(let g of o){if(!g.aberto)continue;let v=Ye(t.filter(h=>!h.pendenteRecebimento),g.unidade,g.unidadeNome).at(-1);v?.fim==="remessa"&&v.remetido&&(v.enviouEm=v.remetido,v.remetido=null,v.fim=null,v.mantidoAberto=!0)}let u=se(e).getTime();for(let g of t)g.emCurso=g.remetido===null,g.duracaoMs=Math.max(0,(g.remetido?.getTime()??u)-g.recebido.getTime());return pl(t,u),t.sort((g,v)=>g.recebido.getTime()-v.recebido.getTime())}var Lr=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],ul=3e4,ml=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],fl=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],Pe=o=>String(o).padStart(2,"0"),gl=o=>Lr.find(e=>e.id===o)?.pxPorDia??2.2,kr=o=>`${Pe(o.getUTCDate())}/${Pe(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,vo=o=>`${kr(o)} ${Pe(o.getUTCHours())}:${Pe(o.getUTCMinutes())}`;function $o(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var Nr=o=>Math.round(Math.max(0,o)/864e5*10)/10,oe=o=>String(o).replace(".",","),Je=o=>o.recebido.getTime()+o.duracaoMs,Qo=(o,e)=>e&&o?`${e} (${o})`:e??o??"",It=(o,e)=>e>1?`${o} ${e}x`:o;function An(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=It(a.sigla,a.passagens.length);return t}var xn=o=>Math.floor(o/864e5)*864e5;function _r(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let d of o)t=Math.min(t,d.recebido.getTime()),a=Math.max(a,Je(d),...d.documentos.map(f=>f.em.getTime()));if(!Number.isFinite(t)){let d=r.agora?.getTime()??0;t=d,a=d}r.agora&&o.some(d=>d.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=xn(t),s=xn(a)+864e5,i=Math.max(1,(s-n)/864e5),c=r.pxPorDia??gl(e),p=Math.min(c,ul/i);return{escala:e,pxPorDia:p,origem:n,fim:s,largura:i*p,x:d=>(d-n)/864e5*p}}function En(o,e=1e3){for(let r of Lr)if(_r(o,r.id).largura<=e)return r.id;return"mes"}function yn(o){let e=[],r=[],t=o.fim,a=(s,i,c,p)=>{let d=o.x(i);s.push({x:d,largura:Math.max(0,o.x(Math.min(c,t))-d),rotulo:p})},n=s=>new Date(s);if(o.escala==="mes")for(let s=n(o.origem).getUTCFullYear();Date.UTC(s,0,1)<t;s++)a(e,Math.max(Date.UTC(s,0,1),o.origem),Date.UTC(s+1,0,1),String(s));else{let s=n(o.origem);for(let i=s.getUTCFullYear(),c=s.getUTCMonth();Date.UTC(i,c,1)<t;){let p=Math.max(Date.UTC(i,c,1),o.origem);a(e,p,Date.UTC(i,c+1,1),`${fl[c]} de ${i}`),c+=1,c>11&&(c=0,i+=1)}}if(o.escala==="dia")for(let s=o.origem;s<t;s+=864e5)a(r,s,s+864e5,String(n(s).getUTCDate()));else if(o.escala==="semana"){let i=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-i*864e5;c<t;c+=7*864e5){let p=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${Pe(p.getUTCDate())}/${Pe(p.getUTCMonth()+1)}`)}}else{let s=n(o.origem);for(let i=s.getUTCFullYear(),c=s.getUTCMonth();Date.UTC(i,c,1)<t;)a(r,Math.max(Date.UTC(i,c,1),o.origem),Date.UTC(i,c+1,1),ml[c]),c+=1,c>11&&(c=0,i+=1)}return{cima:e,baixo:r}}function De(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var Rr={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function we(o){return o.titulo||o.nrSei||"Documento"}var vl=8;function Ot(o){let e=[],r=De(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${vo(o.recebido)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${vo(o.recebido)}${o.usuarioRecebeu?` por ${Qo(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${vo(o.enviouEm)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${vo(o.remetido)}${o.usuarioEnviou?` por ${Qo(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${$o(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${we(n)} - ${vo(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,vl);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:Rr[r],linhas:e,...t.length?{documentos:a}:{}}}function Pn(o,e){return{titulo:we(o),linhas:[{rotulo:"Gerado em",valor:`${vo(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function Dn(o){let e=Ot(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function $r(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:Nr(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function Ze(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,Je(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var zr=o=>It(o.unidade,o.passagens);function wn(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,hl(r,o,a)},ocultar(){r.hidden=!0}}}function hl(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,s=o.offsetHeight||120,i=a.left-t.left+a.width/2-n/2;i=Math.max(6,Math.min(i,t.width-n-6));let c=a.top-t.top-s-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(i)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function Sn(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var bl="http://www.w3.org/2000/svg",Ho=150,io=46,Qe=50,ie=8,or=20,xl=38,ce=6,Cn=16,Al=0;function V(o,e={},...r){let t=document.createElementNS(bl,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var no=o=>Math.round(o*10)/10,Mn=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function qr(o,e,r={}){let t=`spro-g${++Al}`,a=r.larguraAlvo!==void 0,n=An(o),s=_r(o,e,{...r.agora?{agora:r.agora}:{}}),i=a?_r(o,e,{pxPorDia:(r.larguraAlvo-Ho-Cn)/Math.max(1,(s.fim-s.origem)/864e5),...r.agora?{agora:r.agora}:{}}):s,c=Ho+i.largura+Cn,p=io+Math.max(1,n.length)*Qe+8,d=V("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${no(c)} ${p}`,width:a?"100%":no(c),...a?{}:{height:p},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});d.append(V("defs",{},V("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},V("rect",{width:8,height:8,class:"listra-fundo"}),V("rect",{width:4,height:8,class:"listra-traco"})),V("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},V("rect",{width:6,height:6,class:"pontos-fundo"}),V("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let f=Ho,u=yn(i),g=V("g",{class:"spro-g-corpo"});n.forEach((x,S)=>{g.append(V("rect",{x:0,y:io+S*Qe,width:c,height:Qe,class:S%2?"raia-par":"raia-impar"}))});let v=V("g",{class:"spro-g-grade","aria-hidden":"true"});for(let x of u.baixo)v.append(V("line",{x1:no(f+x.x),x2:no(f+x.x),y1:io,y2:p,class:"grade"}));if(g.append(v),n.forEach((x,S)=>{let C=io+S*Qe,D=V("g",{class:"spro-g-raia","data-raia":x.chave});for(let w of x.passagens){let k=De(w),j=f+i.x(w.recebido.getTime()),W=Math.max(4,i.x(Je(w))-i.x(w.recebido.getTime())),G=V("g",{class:`spro-g-barra ${k}`,"data-situacao":k,...a?{}:{tabindex:0,role:"img"},"aria-label":Dn(w)});if(G.append(V("rect",{x:no(j),y:C+ie,width:no(W),height:or,rx:4,class:"fundo"})),k==="em-curso")G.append(V("rect",{x:no(j),y:C+ie,width:no(W),height:or,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if(k==="pendente")G.append(V("rect",{x:no(j),y:C+ie,width:no(W),height:or,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if(k==="mantido-aberto"&&w.enviouEm){let A=f+i.x(w.enviouEm.getTime());G.append(V("rect",{x:no(A),y:C+ie,width:no(Math.max(2,j+W-A)),height:or,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),G.append(V("line",{x1:no(A),x2:no(A),y1:C+ie-3,y2:C+ie+or+3,class:"marca-remessa"}))}if(W>=44&&G.append(V("text",{x:no(j+6),y:C+ie+14,class:"texto-barra"},$o(w.duracaoMs))),!a&&r.dica){let A=r.dica,L=Ot(w);G.addEventListener("pointerenter",()=>A.mostrar(L,G)),G.addEventListener("pointerleave",()=>A.ocultar()),G.addEventListener("focus",()=>A.mostrar(L,G)),G.addEventListener("blur",()=>A.ocultar())}D.append(G);for(let A of w.documentos){let L=f+i.x(A.em.getTime()),T=V("path",{d:`M${no(L)} ${C+xl-ce}l${ce} ${ce}l-${ce} ${ce}l-${ce} -${ce}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${we(A)}, ${vo(A.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let N=r.dica,J=Pn(A,w);N&&(T.addEventListener("pointerenter",()=>N.mostrar(J,T)),T.addEventListener("pointerleave",()=>N.ocultar()),T.addEventListener("focus",()=>N.mostrar(J,T)),T.addEventListener("blur",()=>N.ocultar()));let K=()=>r.aoAbrirDocumento?.(A,w);T.addEventListener("click",K),T.addEventListener("keydown",$=>{let y=$.key;(y==="Enter"||y===" ")&&($.preventDefault(),K())})}D.append(T)}}g.append(D)}),d.append(g),r.agora&&o.some(x=>x.emCurso)&&r.agora.getTime()>=i.origem&&r.agora.getTime()<=i.fim){let x=no(f+i.x(r.agora.getTime()));d.append(V("g",{class:"spro-g-agora","aria-hidden":"true"},V("line",{x1:x,x2:x,y1:io,y2:p}),V("text",{x:Math.min(x+4,c-40),y:io+11},"Agora")))}let h=V("g",{class:"spro-g-cabecalho","aria-hidden":"true"});h.append(V("rect",{x:0,y:0,width:c,height:io,class:"cabecalho-fundo"}));for(let x of u.cima)h.append(V("line",{x1:no(f+x.x),x2:no(f+x.x),y1:0,y2:io,class:"grade-forte"})),x.largura>36&&h.append(V("text",{x:no(f+x.x+6),y:15,class:"eixo-cima"},x.rotulo));for(let x of u.baixo)x.largura>=14&&h.append(V("text",{x:no(f+x.x+x.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},x.rotulo));h.append(V("line",{x1:0,x2:c,y1:io,y2:io,class:"grade-forte"})),d.append(h);let m=V("g",{class:"spro-g-rotulos"});m.append(V("rect",{x:0,y:io,width:Ho,height:p-io,class:"rotulos-fundo"})),n.forEach((x,S)=>{let C=io+S*Qe,D=V("text",{x:10,y:C+22,class:"rotulo-raia"},Mn(x.rotulo,20)),w=x.nome&&x.nome!==x.sigla?x.nome:"",k=V("g",{"aria-label":`${x.sigla}${w?`, ${w}`:""}: ${x.passagens.length} passagem(ns)`,role:"img"},D);w&&k.append(V("text",{x:10,y:C+37,class:"rotulo-nome"},Mn(w,24))),m.append(k)}),m.append(V("line",{x1:Ho,x2:Ho,y1:io,y2:p,class:"grade-forte"})),d.append(m);let E=V("g",{class:"spro-g-canto","aria-hidden":"true"},V("rect",{x:0,y:0,width:Ho,height:io,class:"cabecalho-fundo"}),V("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),V("line",{x1:Ho,x2:Ho,y1:0,y2:io,class:"grade-forte"}),V("line",{x1:0,x2:Ho,y1:io,y2:io,class:"grade-forte"}));return d.append(E),n.length===0&&d.append(V("text",{x:f+12,y:io+28,class:"rotulo-nome"},"Sem passagens.")),d}function In(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let s=e.scrollLeft,i=e.scrollTop;r?.setAttribute("transform",`translate(0 ${i})`),t?.setAttribute("transform",`translate(${s} 0)`),a?.setAttribute("transform",`translate(${s} ${i})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var El=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function Tn(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...El]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",Rr[De(t)],vo(t.recebido),a?vo(a):"",oe(Math.round(t.duracaoMs/864e5*100)/100),$o(t.duracaoMs),t.pendenteRecebimento?"":Qo(t.usuarioRecebeu,t.usuarioRecebeuNome),Qo(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${we(n)} (${kr(n.em)})`).join(" | ")])}return Sn(r)}function Ln(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function kn(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),s=o.createElement("a");return s.href=n,s.download=e,s.style.display="none",o.body.append(s),s.click(),s.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var yl="spro-g-impressao";function Pl(o,e="mes"){let r=Ze(o.passagens),t=$r(o.passagens),a=[...o.passagens].sort((c,p)=>c.recebido.getTime()-p.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},Rr[De(c)]),l("td",{},vo(c.recebido)),l("td",{},c.remetido??c.enviouEm?vo(c.remetido??c.enviouEm):""),l("td",{},$o(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),s=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},zr(c)),l("td",{},oe(c.dias)),l("td",{},`${oe(c.percentual)}%`),l("td",{},String(c.passagens)))))),i=qr(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:yl,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${$o(r.corridoMs)} (${oe(Nr(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${vo(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},i),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),s)}function Nn(o,e,r="mes"){let t=o.defaultView??window,a=Pl(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var Hr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${$o(o)}`,_n=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:bn(o,r)}),wl=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function Rn(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,s=!1,i=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,p=l("div",{class:"spro-g-visao"}),d=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function f(b){if(s||e.sigiloso)return;let P=d();n?.abort();let R=new AbortController;n=R,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...P?{anterior:P}:{}},K();try{let F=await Ae(e,{sinal:R.signal,forcar:b,aoProgresso:(q,Y)=>{s||n!==R||r.tipo!=="coletando"||(r={...r,feito:q,total:Y},W())}});if(s||n!==R)return;r={tipo:"pronto",dados:_n(F.andamentos,F.coletadoEm,e.agora())}}catch(F){if(s||n!==R)return;F instanceof Ke?r={tipo:"sigiloso"}:wl(F)||R.signal.aborted?r={tipo:"cancelado",...P?{anterior:P}:{}}:r={tipo:"erro",mensagem:wo(F),...P?{anterior:P}:{}}}finally{n===R&&(n=null)}K()}function u(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},K(),n.abort())}let g=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),v=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),h=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},g,v),m=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),E=l("div",{class:"spro-g-progresso"}),x=l("div",{class:"spro-g-aviso",role:"status"}),S=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),C=l("button",{type:"button",class:"spro-botao"},H("atualizar",15),"Atualizar"),D=l("button",{type:"button",class:"spro-botao"},H("planilha",15),"Exportar CSV"),w=l("button",{type:"button",class:"spro-botao"},H("imprimir",15),"Imprimir"),k=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),C,D,w);p.append(l("div",{class:"spro-g-topo"},h,m),E,x,S,k);let j=(b,P=!1)=>{t=b,K(),P&&(b==="gantt"?g:v).focus()};g.addEventListener("click",()=>j("gantt")),v.addEventListener("click",()=>j("tempo")),h.addEventListener("keydown",b=>{let P=b.key;(P==="ArrowRight"||P==="ArrowLeft"||P==="Home"||P==="End")&&(b.preventDefault(),j(P==="Home"?"gantt":P==="End"||t==="gantt"?"tempo":"gantt",!0))}),C.addEventListener("click",()=>void f(!0)),D.addEventListener("click",()=>{let b=d();b?.passagens.length&&(kn(e.topo,Ln(e.protocolo),Tn(b.passagens)),ao(e,"CSV do hist\xF3rico gerado.",2500))}),w.addEventListener("click",()=>{let b=d();b?.passagens.length&&Nn(e.topo,{protocolo:e.protocolo,passagens:b.passagens,agora:se(e.agora()),coletadoEm:se(new Date(b.coletadoEm))})});function W(){if(r.tipo!=="coletando")return;let{feito:b,total:P,cancelando:R}=r,F=R?"Cancelando a coleta\u2026":P>0?`Coletando o hist\xF3rico: p\xE1gina ${b} de ${P}`:"Coletando o hist\xF3rico\u2026",q=E.querySelector(".spro-g-prog-barra"),Y=E.querySelector(".spro-g-prog-texto");if(Y&&(Y.textContent=F),q){let ro=P>0?Math.round(b/P*100):0;q.setAttribute("aria-valuenow",String(ro));let Io=q.firstElementChild;Io&&(Io.style.width=P>0?`${ro}%`:""),q.classList.toggle("indeterminado",P<=0)}}function G(){if(r.tipo!=="coletando"){E.hidden=!0,E.replaceChildren();return}E.hidden=!1;let b=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},H("cancelar",14),"Cancelar coleta");b.addEventListener("click",u),E.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),b),W()}function A(){let b=r,P=(q,Y)=>{let ro=l("button",{type:"button",class:"spro-botao pequeno"},q);return ro.addEventListener("click",Y),ro};x.className="spro-g-aviso",x.replaceChildren(),x.hidden=!0;let R=(q,Y,...ro)=>{x.hidden=!1,x.className=`spro-g-aviso ${q}`,x.replaceChildren(H("alerta",15),l("span",{class:"spro-g-aviso-texto"},Y),...ro)},F=e.agora().getTime();b.tipo==="sigiloso"?R("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):b.tipo==="erro"?R("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${b.mensagem}`,P("Tentar de novo",()=>void f(!1))):b.tipo==="cancelado"?R("cancelado","Coleta cancelada.",P("Coletar de novo",()=>void f(!1))):b.tipo==="coletando"&&b.anterior&&!b.cancelando?R("desatualizado",`Mostrando o hist\xF3rico coletado ${Hr(F-b.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):b.tipo==="pronto"&&F-b.dados.coletadoEm>=18e5&&R("desatualizado",`Este hist\xF3rico foi coletado ${Hr(F-b.dados.coletadoEm)}.`,P("Atualizar agora",()=>void f(!0))),(b.tipo==="erro"||b.tipo==="cancelado")&&b.anterior&&R(b.tipo==="erro"?"erro":"cancelado",`${b.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${b.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${Hr(F-b.anterior.coletadoEm)} (desatualizado).`,P("Tentar de novo",()=>void f(!1)))}function L(){i?.(),i=null,S.replaceChildren();let b=d();if(r.tipo==="sigiloso"){S.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!b){S.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!b.passagens.length){S.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}S.setAttribute("aria-labelledby",`${c}-aba-${t}`),S.append(t==="gantt"?T(b):N(b))}function T(b){let P=se(e.agora());a??=En(b.passagens,980);let R=a,F=l("div",{class:"spro-g-quadro"}),q=wn(F,`${c}-dica`),Y=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),ro=qr(b.passagens,R,{agora:P,dica:q,aoAbrirDocumento:(B,X)=>o.abrirDocumento(B,X)});Y.append(ro),F.prepend(Y),i=In(ro,Y),Y.addEventListener("scroll",()=>q.ocultar());let Io=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let B of Lr){let X=l("button",{type:"button","aria-pressed":String(B.id===R),"data-escala":B.id},B.rotulo);X.addEventListener("click",()=>{if(a===B.id)return;let Oo=Y.scrollWidth>0?Y.scrollLeft/Y.scrollWidth:0;a=B.id,K();let Eo=S.querySelector(".spro-g-rolagem");Eo&&(Eo.scrollLeft=Oo*Eo.scrollWidth)}),Io.append(X)}let I=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");I.addEventListener("click",()=>{Y.scrollLeft=Y.scrollWidth});let U=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([B,X])=>l("li",{},l("span",{class:`spro-g-amostra ${B}`,"aria-hidden":"true"}),X)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},Io,I,U),F)}function N(b){let P=$r(b.passagens),R=Ze(b.passagens),F=Math.max(1,...P.map(q=>q.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${R.passagens} passagem(ns) por ${R.unidades} unidade(s). Tempo corrido do processo: ${$o(R.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...P.map(q=>{let Y=l("span",{class:`spro-g-barra-pct${q.emCurso?" em-curso":""}`});return Y.style.width=`${Math.max(1,Math.round(q.percentual/F*100))}%`,l("tr",{},l("th",{scope:"row"},zr(q),q.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},oe(q.dias)),l("td",{class:"num"},`${oe(q.percentual)}%`),l("td",{class:"num"},String(q.passagens)),l("td",{class:"barra","aria-hidden":"true"},Y))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function J(){let b=d(),P=r.tipo==="coletando",R=!b?.passagens.length;C.disabled=P||r.tipo==="sigiloso",D.disabled=R,w.disabled=R;let F=k.querySelector(".spro-g-frescor");F&&(F.textContent=b?`Coletado em ${vo(se(new Date(b.coletadoEm)))} (${Hr(e.agora().getTime()-b.coletadoEm)})`:"")}function K(){g.setAttribute("aria-selected",String(t==="gantt")),v.setAttribute("aria-selected",String(t==="tempo")),g.setAttribute("tabindex",t==="gantt"?"0":"-1"),v.setAttribute("tabindex",t==="tempo"?"0":"-1");let b=d();m.textContent=b?.passagens.length?`${b.passagens.length} passagem(ns)`:"",G(),A(),L(),J()}K();let $=setInterval(()=>{s||J()},3e4);$.unref?.();let y=(async()=>{if(e.sigiloso)return;let b=await xe(e);s||(b&&!b.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:_n(b.historico.andamentos,b.historico.coletadoEm,e.agora())},K()),await f(!1))})();return{el:p,estado:()=>r,destruir(){s=!0,clearInterval($),n?.abort(),i?.()},pronta:y}}function Sl(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function $n(o,e){let r=e.nrSei??e.titulo,t=Sl(o,e);if(!t)return ao(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return ao(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return eo(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var zn="spro-g-dialogo";function qn(o,e={}){let r=o.topo.querySelector(`dialog.${zn}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=Rn({ctx:o,abrirDocumento:n=>void $n(o,n),...e}),a=eo(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(zn),{...t,fechar:a.fechar}}function Hn(o,e){let r=()=>{e().then(t=>{if(!t){ao({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}qn(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(Er,r),()=>o.removeEventListener(Er,r)}async function Tt(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var Vn=0,Un=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",er=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return Pt(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Un(e)?e:null}catch{return null}}async gravar(e){if(!Dt(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return Vn+=1,await kl(this.area,Vn%25===0),!0}};async function kl(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(i=>i.startsWith(Mr)).length<=200)return 0;let r=await Tt(o,Mr),t=Object.entries(r).filter(([,s])=>Un(s)).map(([s,i])=>({k:s,em:i.em,bytes:JSON.stringify(i).length})).sort((s,i)=>i.em-s.em),a=[],n=0;t.forEach((s,i)=>{n+=s.bytes,(i>=200||n>2097152)&&a.push(s.k)});for(let s of Object.keys(r))t.some(i=>i.k===s)||a.push(s);return a.length&&await o.remover(a),a.length}catch{return 0}}var Bn=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),rr=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return St(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Bn(e)?e:null}catch{return null}}async gravar(e){if(!Dt(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Nl(this.area,this.agora()),!0}};async function Nl(o,e){try{let r=await Tt(o,wt),t=Object.entries(r).filter(([,n])=>Bn(n)).map(([n,s])=>({k:n,em:s.coletadoEm})).sort((n,s)=>s.em-n.em),a=new Set;t.forEach((n,s)=>{(s>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(s=>s.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var $l=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",Se=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new er(e,r,t),this.repoHistorico=new rr(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(s=>setTimeout(s,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}renotificar(e){for(let r of[...this.ouvintes])try{r(e)}catch{}}definir(e,r){if(this.fatias.set(e,r),this.renotificar(e),r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let i=(await this.carregarCache())?.fatias[e];i&&(n={dado:i.dado,em:i.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let s;for(let i=0;i<t;i++){i>0&&await this.esperar(400*i);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){s=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:$l(s),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var Lt=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],zl={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},ql=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Gn(o){let e=new Set(o?.length?o:ql),r=new Set(["descricao"]);for(let[t,a]of Object.entries(zl))e.has(a)&&r.add(t);return r}var jn=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),kt={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};var Hl={nota:["M3.5 2h17A1.5 1.5 0 0 1 22 3.5V14l-8 8H3.5A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2z","M22 13.4H13.4V22H14l8-8z","M21 15h-6v6z"],usuarioGravata:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2L12 17.6z","M11 13.3h2l.7 1.7-1.3 6.2-.4.4-.4-.4-1.3-6.2z"],etiquetas:["M2 3.7C2 2.8 2.8 2 3.7 2h6.1c.5 0 .9.2 1.3.5l9.4 9.4c.7.7.7 1.8 0 2.5l-5.6 5.6c-.7.7-1.8.7-2.5 0L2.5 10.6C2.2 10.2 2 9.8 2 9.3z","M7.1 5.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z","M13.6 2h2.2c.5 0 .9.2 1.3.5l5.1 5.1c.7.7.7 1.8 0 2.5l-5.3 5.3-1.6-1.6 4.7-4.7c.3-.3.3-.8 0-1.1z"],tag:["M3 4.5A1.5 1.5 0 0 1 4.5 3h6.6c.4 0 .8.2 1.1.4l8.4 8.4c.6.6.6 1.5 0 2.1l-6.6 6.6c-.6.6-1.5.6-2.1 0L3.4 12.1c-.3-.3-.4-.7-.4-1.1z","M7.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"],olho:["M12 4.2C6.6 4.2 2.4 8 .9 12c1.5 4 5.7 7.8 11.1 7.8s9.6-3.8 11.1-7.8C21.6 8 17.4 4.2 12 4.2z","M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z","M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z"],livro:["M6 2h13.5c.8 0 1.5.7 1.5 1.5V17c0 .6-.3 1.1-.8 1.3v2.4c.5.2.8.7.8 1.3 0 .8-.7 1.5-1.5 1.5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z","M8 5.8h9v2.6H8z","M6 18.3h12.7V20.6H6A1.15 1.15 0 0 1 6 18.3z"],favorito:["M5.5 2h13c.8 0 1.5.7 1.5 1.5V22.3l-8-5.6-8 5.6V3.5C4 2.7 4.7 2 5.5 2z"],usuarios:["M9 3.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z","M2 20.4c0-3.8 2.8-6.4 7-6.4s7 2.6 7 6.4v.2c0 .8-.6 1.4-1.4 1.4H3.4C2.6 22 2 21.4 2 20.6z","M17.2 4.6a3.3 3.3 0 1 1 0 6.6c-.4 0-.8-.1-1.2-.2a5.6 5.6 0 0 0 0-5.6c.4-.5.7-.8 1.2-.8z","M17.6 13.2c2.4.5 4.4 2.4 4.4 5.4v2c0 .8-.6 1.4-1.4 1.4h-2.7c.3-.4.5-.9.5-1.4v-.2c0-2.4-.8-4.4-2.1-5.8.4-.5.8-1 1.3-1.4z"],balaoPontos:["M12 2.4c-5.8 0-10.5 3.8-10.5 8.6 0 2.2 1 4.2 2.8 5.7-.2 1.5-.8 2.8-1.7 3.9-.3.3 0 .8.4.8 2.2 0 4.1-.9 5.4-1.8.9.2 1.7.3 2.6.3 5.8 0 10.5-3.9 10.5-8.9S17.8 2.4 12 2.4z","M7.4 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M12 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M16.6 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"],balao:["M4 2.5h16A2.5 2.5 0 0 1 22.5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-6.2l-5.1 4v-4H4a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 4 2.5z"],caixa:["M5.4 3h13.2c.6 0 1.2.4 1.4 1l2 7.2V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7.8l2-7.2c.2-.6.8-1 1.4-1z","M5.4 6.2 4.2 11.2H8.8l1 2.6h4.4l1-2.6h4.6L18.6 6.2z"],globo:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M7.6 4.8 11 4.2l1.3 2.4-1.8 1.9.5 2.4-3 1-2.4-1.4-.1-2.9z","M12.8 13.6l2.8-.7 2.6 2.2-1 4-2.6 2.8-1.4-1.4.7-3.7z"],cadeado:["M5 10h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 22H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 10z","M7.5 10V7a4.5 4.5 0 0 1 9 0v3h-2.4V7a2.1 2.1 0 0 0-4.2 0v3z","M12 13.7a1.7 1.7 0 0 1 .8 3.2l.4 2.6h-2.4l.4-2.6a1.7 1.7 0 0 1 .8-3.2z"],semUsuario:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2-1.2 1.2-2.8 1.8-4.6 1.8s-3.4-.6-4.6-1.8z","M2.6 4.4 4 3l17.5 17.5-1.4 1.4z"],lapis:["M3 17.3V21h3.7L18.6 9.1l-3.7-3.7z","M21.5 6.2a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"],lixeira:["M6 21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6z","M19 4h-3.5l-1-1h-5l-1 1H5v2h14z"],mais:["M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"],alerta:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M10.6 6.5h2.8v7.3h-2.8z","M10.6 15.6h2.8v2.8h-2.8z"],chevron:["M3.5 8.2 5.4 6.3 12 12.9l6.6-6.6 1.9 1.9L12 16.7z"],disquete:["M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z","M12 12.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z","M5.5 5h8v4h-8z"],checkQuadro:["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M10.4 16.9 6.2 12.7l1.4-1.4 2.8 2.8 6-6 1.4 1.4z"],calendarioMais:["M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2z","M11 10.5h2v2.5h2.5v2H13v2.5h-2V15H8.5v-2H11z"],fechar:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M8.2 9.6 9.6 8.2 12 10.6l2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4z"],lupa:["M10.5 2a8.5 8.5 0 0 1 6.7 13.7l5.4 5.4-2.1 2.1-5.4-5.4A8.5 8.5 0 1 1 10.5 2z","M10.5 5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"],cima:["M12 3.5 4.5 11h5v9.5h5V11h5z"],baixo:["M12 20.5 4.5 13h5V3.5h5V13h5z"]};function xo(o,e=16,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"currentColor",stroke:"none","aria-hidden":"true",focusable:"false",class:"spro-glifo spro-icone"};for(let[i,c]of Object.entries(n))a.setAttribute(i,c);let s=r.createElementNS(t,"path");return s.setAttribute("d",Hl[o].join("")),s.setAttribute("fill-rule","evenodd"),a.append(s),a}function Ce(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},xo(o.icone,16))}function Fl(o,e){let r=o.ownerDocument,t=e.map(a=>typeof a=="string"?r.createTextNode(a):a);for(t.forEach((a,n)=>{let s=o.childNodes[n];s!==a&&(s&&s.nodeType===3&&a.nodeType===3&&s.textContent===a.textContent||o.insertBefore(a,s??null))});o.childNodes.length>t.length;)o.lastChild?.remove()}function Wn(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=xo("chevron",16),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("span",{class:"spro-p-icone","aria-hidden":"true"},xo(o.icone,16)),s=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("div",{class:"spro-p-titulo"},n,l("h3",{},o.titulo)),e,a),r),i=p=>{s.toggleAttribute("data-recolhido",!p),a.setAttribute("aria-expanded",String(p)),r.hidden=!p};i(o.aberto),a.addEventListener("click",()=>{let p=s.hasAttribute("data-recolhido");i(p),o.aoAlternar(p)});let c=o.icone;return{el:s,definirAberto:i,atualizar(p,d){s.setAttribute("data-estado",p),d.icone&&d.icone!==c&&(c=d.icone,n.replaceChildren(xo(d.icone,16))),e.replaceChildren(...(d.acoes??[]).map(Ce)),Fl(r,d.corpo.filter(f=>f!=null&&f!==!1))}}}var Vl="configViewFlashPanelArvorePro",Nt="optionsPro";function _t(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function Xn(o){let e=_t(o,Vl);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function Me(o){let e=_t(o,Nt);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function Yn(o){return Me(o).optionsFlashMenu_panelinfo!=="disabled"}function Jn(o,e){return Me(o)[`panelDadosArvorePro_${e}`]!=="hide"}function Zn(o,e,r){try{let t=Me(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Nt,JSON.stringify(t))}catch{}}function Fr(o,e){let r=_t(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function tr(o,e){return Me(o)[`optionsFlashMenu_${e}`]!=="disabled"}var Kn=o=>o===!0||o==="true";function Qn(o){let e=Me(o);return{tramitadoNaUnidade:Kn(e.panelDadosArvoreInteressados_tramiteUnidade),mesmaNatureza:Kn(e.panelDadosArvoreInteressados_mesmaNatureza)}}function os(o,e){try{let r=Me(o);r.panelDadosArvoreInteressados_tramiteUnidade=e.tramitadoNaUnidade,r.panelDadosArvoreInteressados_mesmaNatureza=e.mesmaNatureza,o.setItem(Nt,JSON.stringify(r))}catch{}}var Ul=/[\u0300-\u036f]/g,ts=o=>o.normalize("NFD").replace(Ul,"");var ar=o=>String(o).padStart(2,"0"),Vr=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,es=/(\d{1,2}):(\d{2})/;function nr(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=ts(e),t=r.length===e.length?r:e,a=Vr.exec(t);if(!a)return{prazo:null,texto:e};let n=es.exec(t.slice(a.index+a[0].length))??es.exec(t),s=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),i=`${a[3]}-${ar(Number(a[2]))}-${ar(Number(a[1]))}`,c=n?`${ar(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:i,hora:c,vencimento:s},texto:d}}function as(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var Bl=864e5;function Ie(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,s]=o.hora.split(":").map(Number),i=new Date(r??1970,(t??1)-1,a??1,n??23,s??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(i.getFullYear(),i.getMonth(),i.getDate()),d=Math.round((p.getTime()-c.getTime())/Bl);return d===0?{rotulo:i.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:i.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function Ur(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function ns(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var le=500,ss=/^\s*\[( |x|X)\]\s?/;function Br(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=ss.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function is(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function cs(o,e){let r=Br(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",is(r))}function ls(o,e,r){let t=Br(o),a=t.slice(e,r+1),n=a.length>0&&a.every(s=>s.marca!==null);for(let s of a)s.marca=n?null:s.marca??"aberto";return is(t)}function Gr(o,e){let r=0,t=Math.min(Math.max(e,0),o.length);for(let a=0;a<t;a++)o[a]===`
`&&(r+=1);return r}function Oe(o,e){let r=0;for(let t=0;t<o.length;t++){if(r===e)return t;o[t]===`
`&&(r+=1)}return o.length}function ps(o,e,r,t){let a=o.replace(/\r\n?/g,`
`).split(`
`);if(e<0||r>=a.length||e>r||(t===-1?e===0:r===a.length-1))return null;let n=a.slice(e,r+1);if(t===-1){let i=a[e-1];return a.splice(e-1,n.length+1,...n,i),{texto:a.join(`
`),de:e-1,ate:r-1}}let s=a[r+1];return a.splice(e,n.length+1,s,...n),{texto:a.join(`
`),de:e+1,ate:r+1}}function ds(o,e){let r=Oe(o,Gr(o,e)),t=o.indexOf(`
`,r),a=t===-1?o.length:t,n=o.slice(r,a),s=ss.exec(n);if(!s||e<r+s[0].length)return null;if(n.slice(s[0].length).trim()===""&&e>=a)return{texto:`${o.slice(0,r)}${o.slice(a)}`,pos:r};let c=o.slice(0,e),p=o.slice(e);return{texto:`${c}
[ ] ${p.replace(/^[ \t]+/,"")}`,pos:c.length+5}}function Gl(o){let e=Vr.exec(ts(o));return e?`${ar(Number(e[1]))}/${ar(Number(e[2]))}/${e[3]}`:null}function us(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return Vr.test(o)?o.replace(Vr,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function sr(o){let e=Gl(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function No(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function ms(o,e){return No(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function rs(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function fs(o,e,r){return[{unidade:e,observacao:rs(o)},...r.map(a=>({unidade:a.unidade,observacao:rs(a.observacao)}))].filter(a=>a.observacao)}function gs(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function vs(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function hs(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function bs(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function xs(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function jl(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function As(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},H("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function pe(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function ee(o){return l("div",{class:"spro-p-nota"},o)}function Fo(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[As(o.erro??"",e)]:[jl(t)];let a=r(o.dado);return o.estado==="erro"?[...a,As(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}var Wl={amarelo:"#fff200",amarelo_claro:"#dde134",amarelo_ouro:"#f7b431",azul:"#4285f4",azul_ceu:"#009df2",azul_marinho:"#002d9e",azul_riviera:"#205d8c",bege:"#f8d396",branco:"#ffffff",bronze:"#a56738",champagne:"#e0a076",ciano:"#00ffff",cinza:"#c0c0c0",cinza_escuro:"#527b79",laranja:"#ff5f00",lilas:"#c892d8",marrom:"#61280a",ouro:"#a7790b",prata:"#81979d",preto:"#000000",rosa:"#ff1cae",rosa_claro:"#ffa7dc",roxo:"#68339b",tijolo:"#c35107",verde:"#00ff00",verde_abacate:"#00a884",verde_agua:"#00c4ba",verde_amazonas:"#007725",verde_escuro:"#004225",verde_turquesa:"#00858a",vermelho:"#ff4545",vinho:"#633039"},Es="#9aa3ac";function Kl(o){let e=/marcador_([a-z_]+)\.(?:svg|png)/i.exec(o??"");return e?.[1]?e[1].toLowerCase():null}var ys=o=>{let e=o.length===4?`#${[...o.slice(1)].map(r=>r+r).join("")}`:o;return[1,3,5].map(r=>Number.parseInt(e.slice(r,r+2),16))};function Xl(o){let[e,r,t]=ys(o).map(a=>{let n=a/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4});return .2126*e+.7152*r+.0722*t}var Yl=o=>`#${o.map(e=>Math.round(e).toString(16).padStart(2,"0")).join("")}`;function Jl(o,e){return Yl(ys(o).map(r=>r+(255-r)*e))}function Zl(o){let e=Kl(o),r=e?Wl[e]:void 0;if(!r)return{nome:e,claro:Es,escuro:Es};if(e==="preto")return{nome:e,claro:r,escuro:"#d5d9de"};let t=r;for(let a=.2;Xl(t)<.17&&a<=.8;a+=.1)t=Jl(r,a);return{nome:e,claro:r,escuro:t}}function Te(o,e=16,r=document){let t=Zl(o),a=xo("tag",e,r);return a.setAttribute("class","spro-glifo spro-icone spro-tag"),a.setAttribute("style",`--spro-tag:${t.claro};--spro-tag-escuro:${t.escuro}`),t.nome&&a.setAttribute("data-cor",t.nome),a}function Rt(o){let[e="",...r]=o.split(" - ");return r.length?{login:e.trim(),nome:r.join(" - ").trim()}:{login:o.trim(),nome:""}}function Ps(o){return o.map(e=>{let{login:r,nome:t}=Rt(e.texto);return t?{valor:e.valor,rotulo:r,complemento:t}:{valor:e.valor,rotulo:r}})}function Ds(o,e=document){return o.map(r=>({valor:r.valor,rotulo:r.texto,marca:()=>Te(r.icone,16,e)}))}function ir(o){return o.map(e=>({valor:e.valor,rotulo:e.texto}))}function ws(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"}),a=eo(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});Ql(o,a,t,e,r)}function Ql(o,e,r,t,a){let n,s=jo({rotulo:"Grupo",vazio:"(sem grupo)",dicaBusca:"Buscar grupo\u2026",carregar:async()=>{let g=await o.op.opcoesAcompanhamento();return n=g.atual,[{valor:"",rotulo:"(sem grupo)"},...ir(g.grupos)]},valor:()=>n}),i=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});i.value=t?t.observacao??"":a.slice(0,450);let c=o.reaberturaProgramada||!!t?.reabertura,p=Jo("Reabertura programada",!!t?.reabertura,g=>d.hidden=!g),d=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!t?.reabertura});d.value=t?.reabertura?vs(t.reabertura):"";let f=bo("Salvar",()=>void u()),u=async()=>{if(c&&p.input.checked&&!d.value){e.erro("Informe a data da reabertura.");return}let g=hs(i.value,c&&p.input.checked?gs(d.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.valor(),observacao:g}),[f])&&o.recarregar("acompanhamento")};Or(r,c?p.el:null,c?l("div",{class:"spro-p-grade"},d):null,So("Grupo",s.el),So("Observa\xE7\xE3o",i),go(f))}var lo=(o,e)=>o.loja.ler(e);function ho(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void rn(o,e)},e,...t)}function Le(o,e){return ee(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var Ao=(...o)=>l("div",{class:"spro-p-linha"},...o);function op(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?Ie({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},H("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var Ss={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=lo(o,"acompanhamento"),r=lo(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>ws(o,a,t)}]:[],corpo:Fo(e,()=>o.recarregar("acompanhamento"),s=>{if(!s.disponivel)return[Le(s.motivo,"O acompanhamento especial")];if(!s.valor)return[pe("Sem acompanhamento especial.")];let{observacao:i,grupo:c,reabertura:p}=s.valor;return[Ao(ho(o,i?`${i}${c?` (${c})`:""}`:c??"Acompanhado")),p?Ao(op(p,o.agora())):null]})}}}};var _o=o=>o.replace(/\r\n?/g,`
`).trim(),Cs=(o,e)=>(o===null||_o(o.texto)==="")&&(e===null||_o(e.texto)==="")?!0:o!==null&&e!==null&&_o(o.texto)===_o(e.texto)&&o.prioridade===e.prioridade;function Ms(o,e){let r=o.doc,t=e.confirmar??((O,z)=>ye(o,O,z)),a=e.ambiente??{focoEmOutroQuadro:()=>{let O=o.topo.activeElement,z=r.defaultView?.frameElement??null;return!!O&&O.tagName==="IFRAME"&&O!==z&&O.getClientRects().length>0},ativo:()=>r.activeElement},n=e.inicial&&_o(e.inicial.texto)?e.inicial:null,s=n?.prioridade??!1,i="editando",c=!1,p=!1,d=0,f=0,u=O=>Date.now()-O<1500,g=!1,v,h,m=l("textarea",{class:"spro-p-post-it-texto",rows:"4",maxlength:String(le),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});m.value=n?.texto??"";let E=l("span",{class:"spro-p-contador"}),x=l("span",{class:"spro-p-post-it-situacao",role:"status","aria-live":"polite"}),S=l("span",{class:"spro-p-post-it-aviso-texto"}),C=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Tentar de novo"),D=l("div",{class:"spro-p-post-it-aviso erro",role:"alert",hidden:!0},S,C),w=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Usar a vers\xE3o do SEI"),k=l("div",{class:"spro-p-post-it-aviso desatualizado",role:"status",hidden:!0},l("span",{class:"spro-p-post-it-aviso-texto"},"Esta anota\xE7\xE3o mudou no SEI enquanto voc\xEA editava. Se salvar, a sua vers\xE3o substitui a do SEI."),w),j=(O,z,oo,yo="")=>l("button",{type:"button",class:`spro-p-post-it-botao${oo?"":" so-icone"}${yo?` ${yo}`:""}`,"aria-label":O},xo(z,16),oo?l("span",{class:"spro-p-post-it-botao-texto"},oo):null),W=j("Salvar anota\xE7\xE3o","disquete","Salvar","primario"),G=j("Prioridade","alerta","Prioridade","prioridade");G.setAttribute("aria-pressed",String(s));let A=j("Transformar as linhas selecionadas em checklist","checkQuadro","Checklist"),L=j("Subir as linhas selecionadas","cima",null),T=j("Descer as linhas selecionadas","baixo",null),N=l("input",{type:"date",class:"spro-p-post-it-data","aria-label":"Data para inserir na anota\xE7\xE3o"});N.value=sr(m.value)??"";let J=j("Remover anota\xE7\xE3o","lixeira",null,"perigo"),K=j("Descartar altera\xE7\xF5es (Esc)","fechar",null),$=l("div",{class:"spro-p-post-it-barra",role:"toolbar","aria-label":"Ferramentas da anota\xE7\xE3o"},W,G,A,L,T,l("span",{class:"spro-p-post-it-data-rotulo"},xo("calendarioMais",16),N),l("span",{class:"spro-p-post-it-espaco"}),n?J:null,K),y=l("div",{class:"spro-p-post-it spro-p-post-it-edicao","data-estado":"editando"},m,l("div",{class:"spro-p-post-it-rodape"},E,x),k,D,$),b=()=>{let O=_o(m.value);return O!==_o(n?.texto??"")?!0:O===""?!1:s!==(n?.prioridade??!1)},P=()=>{let O=le-m.value.length;E.textContent=O<=0?"Voc\xEA atingiu o n\xFAmero m\xE1ximo de caracteres.":`${O} caracteres restantes`},R=()=>{m.style.height="auto";let O=m.scrollHeight;O&&(m.style.height=`${O}px`)},F=()=>{P(),R()},q=(O,z="")=>{i=O,y.setAttribute("data-estado",O);let oo=O==="salvando";m.readOnly=oo;for(let yo of[W,A,L,T,J,K,G])yo.disabled=oo;N.disabled=oo,oo?y.setAttribute("aria-busy","true"):y.removeAttribute("aria-busy"),x.textContent=oo?"Salvando\u2026":"",D.hidden=O!=="erro",S.textContent=O==="erro"?z:""},Y=()=>{clearTimeout(v),r.removeEventListener("pointerdown",To,!0),r.defaultView?.removeEventListener("blur",zo)},ro=O=>{g||(g=!0,Y(),e.aoEncerrar(O))},Io=()=>({ini:m.selectionStart??m.value.length,fim:m.selectionEnd??m.value.length}),I=(O,z=O)=>{try{m.setSelectionRange(O,z)}catch{m.selectionStart=O,m.selectionEnd=z}},U=()=>{let{ini:O,fim:z}=Io(),oo=Gr(m.value,O),yo=Gr(m.value,z),Xo=z>O&&Oe(m.value,yo)===z&&yo>oo?yo-1:yo;return{de:oo,ate:Xo}},B=async()=>{if(g||i==="salvando")return;let O=_o(m.value).slice(0,le);if(!b()&&i!=="erro"){ro({gravou:!1});return}if(O===""){if(!n){ro({gravou:!1});return}c=!0;let oo=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!oo){m.focus();return}}let z=O===""?!1:s;q("salvando");try{await o.op.anotar({texto:O,prioridade:z})}catch(oo){q("erro",wo(oo)),m.focus();return}q("editando"),n=O===""?null:{texto:O,prioridade:z},ro({gravou:!0,valor:n})},X=async()=>{if(!(g||i==="salvando")){if(b()){c=!0;let O=await t("Descartar as altera\xE7\xF5es desta anota\xE7\xE3o?","Descartar");if(c=!1,!O){m.focus();return}}ro({gravou:!1})}},Oo=async()=>{if(g||i==="salvando"||!n)return;c=!0;let O=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!O){m.focus();return}q("salvando");try{await o.op.anotar({texto:"",prioridade:!1})}catch(z){q("erro",wo(z));return}q("editando"),n=null,ro({gravou:!0,valor:null})},Eo=()=>{clearTimeout(v),v=setTimeout(()=>{if(g||c||p||i!=="editando")return;let O=a.ativo();if(O&&y.contains(O))return;let z=u(f)&&a.focoEmOutroQuadro();if(!(!u(d)&&!z)){if(!b()){ro({gravou:!1});return}_o(m.value)===""&&n||B()}},e.esperaSaidaMs??150)};m.addEventListener("input",()=>{F(),i==="erro"&&(D.hidden=!1)}),m.addEventListener("keydown",O=>{let z=O;if(z.key==="Escape"){z.preventDefault(),z.stopPropagation(),X();return}if(z.key==="Enter"&&(z.ctrlKey||z.metaKey)){z.preventDefault(),B();return}if(z.key==="Enter"&&!z.shiftKey&&!z.altKey&&!z.isComposing){let{ini:oo,fim:yo}=Io();if(oo!==yo)return;let Xo=ds(m.value,oo);if(!Xo||Xo.texto.length>le)return;z.preventDefault(),m.value=Xo.texto,I(Xo.pos),F();return}z.altKey&&(z.key==="ArrowUp"||z.key==="ArrowDown")&&(z.preventDefault(),mo(z.key==="ArrowUp"?-1:1))});let mo=O=>{let{ini:z,fim:oo}=Io(),{de:yo,ate:Xo}=U(),Yo=ps(m.value,yo,Xo,O);if(!Yo)return;let zc=z-Oe(m.value,yo);m.value=Yo.texto;let ut=Oe(Yo.texto,Yo.de);if(z===oo){let qc=(Yo.texto.split(`
`)[Yo.de]??"").length;I(ut+Math.min(zc,qc))}else I(ut,Math.max(Oe(Yo.texto,Yo.ate+1)-1,ut));F(),m.focus()};W.addEventListener("click",()=>void B()),K.addEventListener("click",()=>void X()),J.addEventListener("click",()=>void Oo()),L.addEventListener("click",()=>mo(-1)),T.addEventListener("click",()=>mo(1)),G.addEventListener("click",()=>{s=!s,G.setAttribute("aria-pressed",String(s)),y.classList.toggle("prioridade",s)}),y.classList.toggle("prioridade",s),A.addEventListener("click",()=>{let{de:O,ate:z}=U();m.value=ls(m.value,O,z).slice(0,le),F(),m.focus()}),N.addEventListener("change",()=>{N.value&&(m.value=us(m.value,N.value).slice(0,le),F())}),C.addEventListener("click",()=>void B()),w.addEventListener("click",()=>{let O=h??null;n=O&&_o(O.texto)?O:null,m.value=n?.texto??"",s=n?.prioridade??!1,G.setAttribute("aria-pressed",String(s)),y.classList.toggle("prioridade",s),N.value=sr(m.value)??"",h=void 0,k.hidden=!0,y.removeAttribute("data-desatualizado"),F(),m.focus()}),y.addEventListener("pointerdown",()=>{p=!0,setTimeout(()=>{p=!1},600)});for(let O of["pointerup","pointercancel","click"])y.addEventListener(O,()=>{p=!1});let To=O=>{y.contains(O.target)||(d=Date.now())},zo=()=>{f=Date.now(),Eo()};return r.addEventListener("pointerdown",To,!0),r.defaultView?.addEventListener("blur",zo),y.addEventListener("keydown",O=>{O.key==="Tab"&&(d=Date.now())}),y.addEventListener("focusout",O=>{let z=O.relatedTarget;z&&y.contains(z)||Eo()}),P(),q("editando"),R(),{el:y,texto:()=>m.value,prioridade:()=>s,sujo:b,fatiaMudou(O){if(g)return;let z=_o(m.value)?{texto:_o(m.value),prioridade:s}:null,oo=!Cs(O,n)&&!Cs(O,z);h=oo?O:void 0,k.hidden=!oo,y.toggleAttribute("data-desatualizado",oo)},focar(){m.focus(),I(m.value.length),R()},saiuDoFoco:Eo,salvar:B,descartar:X,destruir(){g=!0,Y()}}}async function $t(o,e){try{await e()}catch(r){ao(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var cr=new WeakMap;function ep(o,e){cr.get(o)?.destruir(),cr.delete(o),e.gravou?(o.loja.definir("anotacao",{estado:"pronto",dado:{disponivel:!0,valor:e.valor},em:o.agora().getTime()}),o.recarregar("anotacao")):o.loja.renotificar("anotacao")}function jr(o,e){let r=cr.get(o);if(r){r.focar();return}let t=Ms(o,{inicial:e,aoEncerrar:a=>ep(o,a)});cr.set(o,t),o.loja.renotificar("anotacao"),t.focar()}var rp="label.item, input, a, button, textarea",Is={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=lo(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null,a=cr.get(o);return a?(a.fatiaMudou(t),{estado:e.estado,desenho:{acoes:[],corpo:[a.el]}}):{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void $t(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>jr(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void ye(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(n=>{n&&$t(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>jr(o,null)}]:[],corpo:Fo(e,()=>o.recarregar("anotacao"),n=>{if(!n.disponivel)return[Le(n.motivo,"As anota\xE7\xF5es")];if(!n.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>jr(o,null)},"Adicionar anota\xE7\xE3o"))];let s=n.valor,{texto:i,prioridade:c}=s,p=sr(i),d=p?Ie({data:p,hora:"23:59",vencimento:!0},o.agora()):null,f=Br(i).map((u,g)=>u.marca===null?l("div",{class:"spro-p-nota-linha"},u.texto||" "):l("label",{class:`spro-p-nota-linha item${u.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:u.marca==="feito",onchange:()=>void $t(o,()=>o.op.alternarItemDaAnotacao(g))}),l("span",{},u.texto)));return[l("div",{class:`spro-p-post-it editavel${c?" prioridade":""}`,onclick:u=>{u.target?.closest(rp)||jr(o,s)}},c?l("span",{class:"spro-p-chip vencido"},xo("alerta",12),"prioridade"):null,...f,p&&d?l("span",{class:`spro-p-chip ${d.nivel}`},xo("calendarioMais",12),`${Ur({data:p,hora:"23:59",vencimento:!0})} \xB7 ${d.rotulo}`):null)]})}}}};function Os(o,e,r){let t,a=jo({rotulo:"Usu\xE1rio da unidade",vazio:"Escolher um usu\xE1rio\u2026",dicaBusca:"Buscar por login ou nome\u2026",limite:150,resumo:(p,d,f)=>d===f?`${f} usu\xE1rios na unidade`:`${d} de ${f} usu\xE1rios`,carregar:async()=>{let{opcoes:p,atual:d}=await o.op.opcoesAtribuicao(),f=e.usuario?p.find(u=>Rt(u.texto).login.toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0;return t=d??f,Ps(p)},valor:()=>t}),n=bo("Salvar",()=>void i(a.valor(),n,s)),s=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),i=async(p,...d)=>{if(p===""){c.erro("Escolha um usu\xE1rio.");return}let f=p===null?void 0:a.opcoes().find(g=>g.valor===p);await c.gravar(()=>o.op.atribuir(p),d)&&r(p===null?{usuario:null}:{usuario:f?.rotulo??"",nome:f?.complemento??""})};s.addEventListener("click",()=>void i(null,n,s));let c=eo(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[l("div",{class:"spro-p-modal-lugar"},So("Atribuir para",a.el,e.usuario?`Hoje: ${e.usuario}`:void 0),go(e.usuario?s:null,n))]})}var Ts={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"usuarioGravata",desenhar(o){let e=lo(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:Fo(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,s=t.editavel&&a.unidade.toLowerCase()===r;return Ao(ho(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,s?Ce({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>Os(o,a,i=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(d=>d===a?{...d,usuario:i.usuario,nomeUsuario:i.nome,texto:bs(d.texto,i.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:i.usuario}})})}):null)}):[ee(t.texto||"Processo sem andamento aberto.")],1)}}}};var Ls={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"livro",desenhar(o){let r=lo(o,"blocoInterno").dado;if(r&&Ar(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[Ao(r.descricao?ho(o,r.descricao):ee("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,s)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${s}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};var Wr=class extends Error{constructor(r,t){super(t);this.codigo=r;this.name="ErroRpc"}};function tp(o,e){let r=e.replace(/\D/g,""),t=r?o.querySelector(`tr[id="P${r}"] a[href*="procedimento_trabalhar"]`):null;if(t)return{tipo:"linha",link:t};let a=o.querySelector("#frmProtocoloPesquisaRapida"),n=o.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function ks(o,e,r,t){let a=tp(o,e);if(!a)throw new Wr("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return t?o.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=r,t&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var Ns=Object.freeze({carregando:!1,erro:null,processos:[],total:null,completa:!1,vazia:!1}),_s=o=>o.idProcedimento??o.protocolo,Kr=class{constructor(e,r,t=a=>a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar."){this.buscar=e;this.aoMudar=r;this.mensagemDeErro=t}estado={...Ns};versao=0;controle=null;atual(){return this.estado}iniciar(){this.controle?.abort();let e=++this.versao;this.publicar({...Ns,carregando:!0}),this.carregar(0,e,[])}mais(){let e=this.estado;if(e.carregando||e.completa||e.total===null)return;let r=++this.versao;this.controle?.abort(),this.publicar({...e,carregando:!0,erro:null}),this.carregar(e.processos.length,r,e.processos)}repetir(){this.estado.total===null||!this.estado.processos.length?this.iniciar():this.mais()}parar(){this.controle?.abort(),this.versao+=1}publicar(e){this.estado=e,this.aoMudar(e)}async carregar(e,r,t){let a=new AbortController;this.controle=a;try{let n=await this.buscar(e,a.signal);if(r!==this.versao)return;let s=new Set(t.map(_s)),i=[...t,...n.processos.filter(c=>!s.has(_s(c)))];this.publicar({carregando:!1,erro:null,processos:i,total:n.total,completa:i.length>=n.total||n.processos.length===0,vazia:i.length===0})}catch(n){if(r!==this.versao||a.signal.aborted)return;this.publicar({...this.estado,carregando:!1,erro:this.mensagemDeErro(n)})}}};var ap=o=>o===1?"1 processo":`${o} processos`;function np(o,e){let r=l("button",{type:"button",class:"spro-p-link spro-p-proc-num","aria-label":`Abrir o processo ${o.protocolo}`},H("pasta",14),o.protocolo);r.addEventListener("click",s=>e(o,s.ctrlKey||s.metaKey)),r.addEventListener("auxclick",s=>{s.button===1&&e(o,!0)});let t=o.unidade?o.unidadeNome&&o.unidadeNome!==o.unidade?`${o.unidade} (${o.unidadeNome})`:o.unidade:"",a=o.usuario?o.usuarioNome&&o.usuarioNome!==o.usuario?`${o.usuarioNome} (${o.usuario})`:o.usuario:"",n=[t,a,o.data].filter(Boolean);return l("li",{class:"spro-p-processo"},l("div",{class:"spro-p-processo-topo"},r,o.tipoProcesso?l("span",{class:"spro-p-chip"},o.tipoProcesso):null),n.length?l("div",{class:"spro-p-processo-meta"},...n.map(s=>l("span",{},s))):null)}function Rs(o,e){let r=Qn(o.armazenamento),t=Jo("Tramitados na unidade",r.tramitadoNaUnidade,()=>v()),a=Jo(e.tipoNome?`De mesmo tipo (${e.tipoNome})`:"De mesmo tipo",r.mesmaNatureza,()=>v());a.input.disabled=!e.tipo;let n=l("div",{class:"spro-p-nota",role:"status","aria-live":"polite"}),s=l("ul",{class:"spro-p-lista-processos","aria-label":`Processos de ${e.nome}`}),i=l("div",{class:"spro-p-processos-rodape"}),c=l("div",{class:"spro-p-modal-lugar"},n,s,i),p=eo(o,{titulo:"Processos do interessado",icone:"pessoa",largura:640,conteudo:[l("p",{class:"spro-p-interessado-nome"},e.nome),l("div",{class:"spro-p-ferramentas",role:"group","aria-label":"Filtros da pesquisa"},t.el,a.el),c]});p.el.classList.add("spro-p-dialogo-processos");let d=e.id,f=async()=>{if(d)return d;let m=await o.op.formularioDoProcesso(),E=m.interessados.find(x=>x.texto===e.nome)??m.interessados.find(x=>x.texto.startsWith(e.nome));if(!E)throw new Error("N\xE3o achei este interessado no cadastro do processo.");return d=E.id,E.id},u=(m,E)=>{try{ks(o.topo,m.idProcedimento??"",m.protocolo,E),E||p.fechar()}catch(x){ao(o,x instanceof Error?x.message:"N\xE3o foi poss\xEDvel abrir o processo.",6e3)}},g=new Kr(async(m,E)=>o.op.processosDoInteressado({interessadoId:await f(),inicio:m,tramitadoNaUnidade:t.input.checked,...a.input.checked&&e.tipo?{tipoProcesso:e.tipo}:{}},E),m=>h(m),Go),v=()=>{os(o.armazenamento,{tramitadoNaUnidade:t.input.checked,mesmaNatureza:a.input.checked}),g.iniciar()};function h(m){if(c.setAttribute("aria-busy",String(m.carregando)),s.replaceChildren(...m.processos.map(E=>np(E,u))),i.replaceChildren(),m.carregando&&!m.processos.length){n.textContent="Pesquisando os processos do interessado\u2026",s.append(l("li",{class:"spro-p-esqueleto","aria-hidden":"true"},l("span",{class:"spro-p-barra"}),l("span",{class:"spro-p-barra",style:"width:62%"})));return}if(m.erro&&!m.processos.length){n.replaceChildren();let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>g.repetir()),i.append(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${m.erro} `,E));return}if(m.vazia){n.textContent="Nenhum processo encontrado. A pesquisa s\xF3 traz os que voc\xEA pode ver.";return}if(n.textContent=m.total===null?"":`${m.processos.length} de ${ap(m.total)}.`,m.erro){let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>g.repetir()),i.append(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${m.erro} `,E))}else if(!m.completa){let E=l("button",{type:"button",class:"spro-botao"},m.carregando?"Carregando\u2026":`Mais resultados (${(m.total??0)-m.processos.length} restantes)`);E.disabled=m.carregando,E.addEventListener("click",()=>g.mais()),i.append(E)}}p.el.addEventListener("close",()=>g.parar()),g.iniciar()}var Xr=class{constructor(e,r=new Map){this.negados=r;this.atuais=[...e]}atuais;novos=[];retirados=new Set;linhas(){let e=r=>{let t=this.negados.get(r);return t===void 0?{}:{negadoPor:t}};return[...this.atuais.map(r=>({item:r,estado:this.retirados.has(r.id)?"retirado":"atual",...e(r.id)})),...this.novos.map(r=>({item:r,estado:"novo"}))]}tem(e){return this.novos.some(r=>r.id===e)||this.atuais.some(r=>r.id===e)&&!this.retirados.has(e)}adicionar(e){return this.tem(e.id)?!1:this.atuais.some(r=>r.id===e.id)?(this.retirados.delete(e.id),!0):(this.novos.push({id:e.id,texto:e.texto}),!0)}alternarRetirada(e){return!this.atuais.some(r=>r.id===e)||this.negados.has(e)?!1:(this.retirados.has(e)?this.retirados.delete(e):this.retirados.add(e),!0)}removerNovo(e){let r=this.novos.findIndex(t=>t.id===e);return r<0?!1:(this.novos.splice(r,1),!0)}resultado(){return[...this.atuais.filter(e=>!this.retirados.has(e.id)),...this.novos]}mudou(){return this.retirados.size>0||this.novos.length>0}contagem(){return{atuais:this.atuais.length-this.retirados.size,retirados:this.retirados.size,novos:this.novos.length}}};var $s=o=>o.replace(/\s+/g," ").trim(),Yr=class{constructor(e){this.o=e;this.minimo=e.minimo??3,this.esperaMs=e.esperaMs??350}versao=0;controle=null;minimo;esperaMs;digitou(e){let r=$s(e),t=this.cancelar();if(!r)return this.o.aoMudar({tipo:"ocioso"});if(r.length<this.minimo)return this.o.aoMudar({tipo:"curto",falta:this.minimo-r.length});(this.o.esperar??(n=>new Promise(s=>setTimeout(s,n))))(this.esperaMs).then(()=>{t===this.versao&&this.executar(r,t)})}agora(e){let r=$s(e),t=this.cancelar();if(r.length<this.minimo)return this.o.aoMudar(r?{tipo:"curto",falta:this.minimo-r.length}:{tipo:"ocioso"});this.executar(r,t)}repetir(e){this.agora(e)}parar(){this.cancelar()}cancelar(){return this.controle?.abort(),this.controle=null,++this.versao}async executar(e,r){let t=new AbortController;this.controle=t,this.o.aoMudar({tipo:"pesquisando",termo:e});try{let a=await this.o.pesquisar(e,t.signal);if(r!==this.versao)return;this.o.aoMudar(a.length?{tipo:"resultado",termo:e,itens:a}:{tipo:"vazio",termo:e})}catch(a){if(r!==this.versao||t.signal.aborted)return;this.o.aoMudar({tipo:"erro",termo:e,mensagem:this.o.mensagemDeErro?.(a)??(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar.")})}}};var sp=o=>{let e=[];return o.novos&&e.push(`${o.novos} a acrescentar`),o.retirados&&e.push(`${o.retirados} a retirar`),e.join(", ")};function zt(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),t=eo(o,{titulo:e.titulo,icone:e.icone,largura:560,conteudo:[r]}),a=s=>{let i=new Xr(s.atuais,s.negados),c=l("h3",{class:"spro-p-lupa-titulo"}),p=l("ul",{class:"spro-p-lista-modal","aria-label":`${e.nomePlural} no processo`}),d=l("input",{type:"search",class:"spro-campo",autocomplete:"off","aria-label":`Pesquisar ${e.nome} para adicionar`,"aria-controls":"spro-p-lupa-resultados",placeholder:"Pesquisar\u2026"}),f=l("div",{class:"spro-p-nota spro-p-lupa-estado",role:"status","aria-live":"polite"}),u=l("ul",{class:"spro-p-lista-modal spro-p-resultados",id:"spro-p-lupa-resultados","aria-label":"Resultados da pesquisa"}),g=l("span",{class:"spro-p-nota spro-p-lupa-situacao","aria-live":"polite"}),v=bo("Salvar",()=>void C()),h={tipo:"ocioso"},m=()=>{let D=i.linhas(),w=i.contagem();c.textContent=`No processo (${w.atuais+w.novos})`,p.replaceChildren(...D.length?D.map(k=>{let j;if(k.negadoPor)j=l("span",{class:"spro-p-chip"},`Acrescentado por ${k.negadoPor}`);else{let W=l("button",k.estado==="novo"?{type:"button",class:"spro-p-acao perigo","aria-label":`Desfazer a inclus\xE3o de ${k.item.texto}`}:{type:"button",class:"spro-p-acao perigo","aria-pressed":String(k.estado==="retirado"),"aria-label":`${k.estado==="retirado"?"Manter":"Retirar"} ${k.item.texto}`},k.estado==="novo"?"Desfazer":k.estado==="retirado"?"Manter":"Retirar");W.addEventListener("click",()=>{k.estado==="novo"?i.removerNovo(k.item.id):i.alternarRetirada(k.item.id),x()}),j=W}return l("li",{class:"spro-p-linha-modal","data-estado":k.estado},k.estado==="novo"?l("span",{class:"spro-p-chip ok"},"Novo"):null,l("span",{class:"spro-p-texto-modal"},k.item.texto),j)}):[l("li",{class:"spro-p-vazio"},`O processo n\xE3o tem ${e.nomePlural}.`)]),v.disabled=!i.mudou(),g.textContent=sp(w)},E=D=>{if(h=D,u.replaceChildren(),u.removeAttribute("aria-busy"),D.tipo==="ocioso")f.textContent=e.dica;else if(D.tipo==="curto")f.textContent=`Digite mais ${D.falta===1?"1 letra":`${D.falta} letras`} para pesquisar.`;else if(D.tipo==="pesquisando")f.textContent="Pesquisando\u2026",u.setAttribute("aria-busy","true");else if(D.tipo==="vazio")f.textContent=`Nenhum resultado para \u201C${D.termo}\u201D.`;else if(D.tipo==="erro"){let w=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");w.addEventListener("click",()=>S.repetir(d.value)),f.replaceChildren(H("alerta",13),` ${D.mensagem} `,w)}else{f.textContent=D.itens.length===1?"1 resultado.":`${D.itens.length} resultados.`;for(let w of D.itens){let k=i.tem(w.id),j=l("button",{type:"button",class:"spro-p-acao","aria-label":k?`${w.texto} (j\xE1 est\xE1 no processo)`:`Adicionar ${w.texto}`},k?"No processo":"Adicionar");j.disabled=k,j.addEventListener("click",()=>{i.adicionar(w)&&(x(),E(h),u.querySelector("button:not([disabled])")?.focus())}),u.append(l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},w.texto),j))}return}},x=()=>m(),S=new Yr({pesquisar:s.pesquisar,aoMudar:E,mensagemDeErro:Go,...e.esperaMs!==void 0?{esperaMs:e.esperaMs}:{}});d.addEventListener("input",()=>S.digitou(d.value)),d.addEventListener("keydown",D=>{if(D.key==="Enter")D.preventDefault(),S.agora(d.value);else if(D.key==="ArrowDown"){let w=u.querySelector("button:not([disabled])");w&&(D.preventDefault(),w.focus())}}),u.addEventListener("keydown",D=>{if(D.key!=="ArrowDown"&&D.key!=="ArrowUp")return;let w=[...u.querySelectorAll("button:not([disabled])")],k=w.indexOf(D.target);k<0||(D.preventDefault(),D.key==="ArrowDown"?w[Math.min(k+1,w.length-1)]?.focus():k===0?d.focus():w[k-1]?.focus())}),t.el.addEventListener("close",()=>S.parar());let C=async()=>{let D=i.resultado();if(e.obrigatorio&&!D.length){t.erro(e.obrigatorio);return}await t.gravar(()=>e.gravar(D),[v])&&e.depois()};r.replaceChildren(c,p,l("div",{class:"spro-p-lupa-busca"},l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},`Adicionar ${e.nome}`),d),f,u),go(g,v)),m(),E({tipo:"ocioso"}),d.focus({preventScroll:!0})},n=()=>{r.replaceChildren(l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),e.carregar().then(s=>{t.el.isConnected&&a(s)}).catch(s=>{if(!t.el.isConnected)return;let i=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");i.addEventListener("click",n),r.replaceChildren(l("div",{class:"spro-p-erro",role:"alert"},H("alerta",13),` ${Go(s)} `,i))})};n()}async function ip(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var cp=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function zs(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=bo("Salvar",()=>void n()),a=eo(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[So("Especifica\xE7\xE3o",r),go(t)]});r.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function qs(o,e){let r,t=jo({rotulo:"Tipo de processo",vazio:"Escolher o tipo\u2026",dicaBusca:"Buscar tipo de processo\u2026",limite:150,resumo:(s,i,c)=>i===c?`${c} tipos`:`${i} de ${c} tipos`,carregar:async()=>{let s=await o.op.formularioDoProcesso();return r=s.tipoAtual??s.tipos.find(i=>i.texto===e)?.valor,ir(s.tipos)},valor:()=>r}),a=bo("Salvar",async()=>{if(!t.valor()){n.erro("Escolha um tipo.");return}await n.gravar(()=>o.op.alterarProcesso({tipo:t.valor()}),[a])&&o.recarregar("dadosProcesso")}),n=eo(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[l("div",{class:"spro-p-modal-lugar"},So("Tipo de processo",t.el),go(a))]})}function Hs(o){let e=cp("Carregando o formul\xE1rio do processo\u2026"),r=eo(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});ip(o,r,e,t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(d=>l("button",{type:"button",role:"radio","aria-checked":String(d===a),"data-nivel":d},d==="publico"?"P\xFAblico":"Restrito")),s=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),i=jo({rotulo:"Hip\xF3tese legal",vazio:"Escolher a hip\xF3tese legal\u2026",dicaBusca:"Buscar hip\xF3tese legal\u2026",limite:150,adiar:!0,carregar:async()=>ir(await t.hipoteses("1")),valor:t.hipoteseAtual}),c=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"},So("Hip\xF3tese legal",i.el));for(let d of n)d.addEventListener("click",()=>{a=d.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let f of n)f.setAttribute("aria-checked",String(f===d));c.hidden=a!=="restrito",a==="restrito"&&i.carregarAgora()});a==="restrito"&&i.carregarAgora();let p=bo("Salvar",async()=>{if(a==="restrito"&&!i.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:i.valor()}:{nivel:a}),[p])&&o.recarregar("dadosProcesso")});e.replaceChildren(s,c,go(p))})}function Fs(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=bo("Salvar",()=>void n()),a=eo(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[So("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),go(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}var Vs=(o,e)=>async()=>{let r=await o.op.formularioDoProcesso();return e==="assuntos"?{atuais:r.assuntos,negados:r.assuntosNegados,pesquisar:(t,a)=>r.pesquisarAssuntos(t,a)}:{atuais:r.interessados,negados:r.interessadosNegados,pesquisar:(t,a)=>r.pesquisarContatos(t,a)}};function Us(o){zt(o,{titulo:"Interessados do processo",icone:"pessoa",nome:"interessado",nomePlural:"interessados",dica:"Digite o nome do contato para pesquisar.",carregar:Vs(o,"interessados"),gravar:e=>o.op.alterarProcesso({interessados:e}),depois:()=>o.recarregar("dadosProcesso")})}function Bs(o){zt(o,{titulo:"Assuntos do processo",icone:"etiqueta",nome:"assunto",nomePlural:"assuntos",dica:"Digite o c\xF3digo ou parte da descri\xE7\xE3o do assunto.",carregar:Vs(o,"assuntos"),gravar:e=>o.op.alterarProcesso({assuntos:e}),depois:()=>o.recarregar("dadosProcesso"),obrigatorio:"O processo precisa ter ao menos um assunto."})}var re=o=>{let e=lo(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},ke=o=>!o.sigiloso&&!!re(o)?.editavel;async function Jr(o,e){let r=re(o);if(!r)return;let t=!No(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:ms(r.especificacao,e).slice(0,100)});ao(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){ao(o,wo(a),7e3)}o.recarregar("dadosProcesso")}function Zr(o,e,r=2){let t=lo(o,"dadosProcesso");return Fo(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[Le(a.motivo,"Este dado")],r)}var Gs={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"balaoPontos",desenhar(o){let e=lo(o,"dadosProcesso"),r=re(o),t=[];return r&&ke(o)&&(t.push({icone:"alerta",rotulo:No(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:No(r.especificacao,"URGENTE"),aoClicar:()=>void Jr(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:No(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:No(r.especificacao,"TRANCADO"),aoClicar:()=>void Jr(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>zs(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:Zr(o,a=>[Ao(ho(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${No(a.valor.especificacao,"URGENTE")?"urgente":""} ${No(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},js={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"caixa",desenhar(o){let e=re(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&ke(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>qs(o,r)}]:[],corpo:[Ao(ho(o,r||"(n\xE3o informado)"))]}}}},Ws={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"globo",desenhar(o){let e=re(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":an.publico;return{estado:"pronto",desenho:{icone:r==="restrito"?"cadeado":r==="sigiloso"?"semUsuario":"globo",acoes:e&&ke(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>Hs(o)}]:[],corpo:[Ao(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},H(tn[r],13)),ho(o,a))]}}}},Ks={tipo:"interessados",titulo:"Interessados",icone:"usuarios",desenhar(o){return{estado:lo(o,"dadosProcesso").estado,desenho:{acoes:re(o)&&ke(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>Us(o)}]:[],corpo:Zr(o,r=>r.valor.interessados.length?r.valor.interessados.map((t,a)=>{let n=r.valor.interessadosItens?.[a],s=n&&n.texto===t?n.id:void 0;return l("div",{class:"spro-p-linha interessado"},...xs(t).map(i=>ho(o,i)),l("button",{type:"button",class:"spro-p-acao spro-p-proc-do-interessado","aria-label":`Processos de ${t}`,onclick:()=>Rs(o,{nome:t,...s?{id:s}:{},...r.valor.idTipo?{tipo:r.valor.idTipo}:{},...r.valor.tipo?{tipoNome:r.valor.tipo}:{}})},xo("lupa",16)))}):[pe("Sem interessados.")])}}}},Xs={tipo:"assuntos",titulo:"Assuntos",icone:"favorito",desenhar(o){return{estado:lo(o,"dadosProcesso").estado,desenho:{acoes:re(o)&&ke(o)?[{icone:"lapis",rotulo:"Editar assuntos",aoClicar:()=>Bs(o)}]:[],corpo:Zr(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>Ao(ho(o,t))):[pe("Sem assuntos.")])}}}},Ys={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"balao",desenhar(o){let e=lo(o,"dadosProcesso"),r=re(o);return{estado:e.estado,desenho:{acoes:r&&ke(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>Fs(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:Zr(o,t=>{let a=fs(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>Ao(ho(o,`${n.unidade}: ${n.observacao}`))):[ee("Sem observa\xE7\xF5es.")]})}}}};var lp=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function qt(o,e){let r=l("div",{class:"spro-p-modal-lugar"}),t=eo(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});pp(o,t,r,e)}function pp(o,e,r,t){let a=t?nr(t.texto):{prazo:null,texto:""},n=[],s=jo({rotulo:"Marcador",vazio:"Escolher um marcador\u2026",dicaBusca:"Buscar marcador\u2026",limite:150,carregar:async()=>(n=await o.op.opcoesMarcador(),Ds(n,o.topo)),valor:()=>t?n.find(h=>h.texto===t.nome)?.valor:void 0}),i=Jo("Controlar prazo",!!a.prazo,h=>f.hidden=!h),c=Jo("Controlar vencimento (\u201CAt\xE9\u201D)",!!a.prazo?.vencimento,()=>{}),p=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=a.prazo?.data??lp(o.agora());let d=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=a.prazo?.hora??"23:59";let f=l("div",{class:"spro-p-grade",hidden:!a.prazo},c.el,l("div",{class:"spro-p-par"},p,d)),u=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});u.value=a.texto;let g=bo("Salvar",()=>void v()),v=async()=>{let h=n.find(x=>x.valor===s.valor());if(!h){e.erro("Escolha um marcador.");return}if(i.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let m=as({prazo:i.input.checked?{data:p.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:u.value}),E=await e.gravar(async()=>(t&&h.texto!==t.nome&&await o.op.desmarcar(t.nome),o.op.marcar({marcador:h.texto,texto:m})),[g]);return o.recarregar("marcador"),E};Or(r,So("Marcador",s.el),t?l("p",{class:"spro-p-nota spro-p-nota-marcador"},Te(t.icone,13,o.topo),` Atual: ${t.nome}. Escolher outro troca o marcador.`):null,i.el,f,So("Texto",u),go(g))}function dp(o,e){let{prazo:r}=nr(e);if(!r)return null;let t=Ie(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},H("relogio",11),`${r.vencimento?"at\xE9 ":""}${Ur(r)} \xB7 ${t.rotulo}`)}async function up(o,e){if(await ye(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);ao(o,r.resumo)}catch(r){ao(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function mp(o,e,r){let{texto:t}=nr(e.texto),a=ho(o,e.nome,"forte");return a.prepend(Te(e.icone,15,o.doc)),Ao(l("div",{class:"spro-p-marcador"},a,dp(o,e.texto),t?ho(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},Ce({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>qt(o,e)}),Ce({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void up(o,e)})):null)}var Js={tipo:"marcador",titulo:"Marcador",icone:"etiquetas",desenhar(o){let e=lo(o,"marcador"),r=ns(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>qt(o)}]:[],corpo:[...Fo(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>mp(o,a,t.editavel)):[pe("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},H("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var Zs=[Is,Ts,Ls,Js,Ss,Gs,js,Ws,Ks,Xs,Ys];var Qs=1e4;function Ne(o){if(!o.getElementById("frmArvore"))return null;try{return gt(ne(o))}catch{return null}}function lr(o,e=Qs){return new Promise(r=>{let t=Ne(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,s=!1,i=u=>{s||(s=!0,p?.disconnect(),clearTimeout(f),clearInterval(d),r(u))},c=()=>{let u=Ne(o);u&&i(u)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),f=setTimeout(()=>i(null),e)})}var ei="data-spro-processo-raiz";function fp(o){for(let e of o.querySelectorAll(`[${ei}], [data-spro-slot="atividades"]`))e.remove()}function ri(o){return Zs.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&jn.has(e.tipo)))}function ti(o){let e=new Set;for(let r of ri(o))for(let t of kt[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function oi(o){let e=o.doc;qo(e),fp(e);let r=e.getElementById("frmArvore")??e.body,t=Lo(e),a=(x="")=>l("div",{class:`spro-p-raiz ${x}`.trim(),[ei]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),s=a("anotacoes"),i=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(s):r.prepend(s);let p=e.getElementById("divRelacionados");p?p.before(i):s.after(i),r.append(n);let d=new Map,f=ri(o),u=x=>Lt.indexOf(x);for(let x of f){let S=Wn({tipo:x.tipo,titulo:x.titulo,icone:x.icone,aberto:Jn(o.armazenamento,x.tipo),aoAlternar:C=>Zn(o.armazenamento,x.tipo,C)});d.set(x.tipo,{def:x,casca:S})}for(let x of[...Lt].sort((S,C)=>u(S)-u(C))){let S=d.get(x);S&&n.append(S.casca.el)}let g=d.get("anotacoes");g&&s.append(g.casca.el);let v=x=>{let S=d.get(x);if(!S)return;let C;try{C=S.def.desenhar(o)}catch(D){console.warn(`[SEI Pro] painel ${x}:`,D),C=null}S.casca.el.hidden=C===null,C&&S.casca.atualizar(C.estado,C.desenho)},h=x=>{if(x)v(x);else for(let S of d.keys())v(S)},m=o.loja.aoMudar(x=>{for(let[S,C]of d)kt[C.def.tipo].includes(x)&&v(S)});h();let E=Ee(e,()=>{let x=Lo(e);for(let S of[n,s])x?S.setAttribute("data-tema","escuro"):S.removeAttribute("data-tema")});return{raiz:n,redesenhar:h,desmontar(){m(),E(),n.remove(),s.remove(),i.remove()}}}function ai(o,e,r={}){let t=oi(o),a=!1,n=o.doc.defaultView,s=r.Observador??n?.MutationObserver??globalThis.MutationObserver,i=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=oi(o),e?.(t))},c=typeof s=="function"&&o.doc.body?new s(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(i,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}function gp(){let o=globalThis,e=o.wrappedJSObject??o.window?.wrappedJSObject,r=o.exportFunction;return!e||typeof r!="function"?null:{pagina:e,exportFunction:t=>r(t,e)}}function vp(o,e){if(!e.pagina.Object)return o;let r=new e.pagina.Object;for(let[t,a]of Object.entries(o))a!==void 0&&(r[t]=a);return r}function ni(o,e,r,t,a=gp()){if(!a)return r?o.request(e,r,t):o.request(e,t);let n=null,{pagina:s,exportFunction:i}=a,c=i(d=>new s.Promise(i(f=>{t(d).then(u=>{n={ok:!0,valor:u},f()},u=>{n={ok:!1,erro:u},f()})}))),p=r?o.request(e,vp(r,a),c):o.request(e,c);return Promise.resolve(p).then(()=>{let d=n;if(!d)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(d.ok)return d.valor;throw d.erro})}var hp="seipro-historico-sessao",Ht="seiProHistoricoRestauro",bp=600*1e3,si;function Ft(){if(si!==void 0)return si;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function ci(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};Ft()?.setItem(Ht,JSON.stringify(t))}catch{}}function Qr(){try{Ft()?.removeItem(Ht)}catch{}}function Vt(o,e=Date.now()){try{let r=Ft()?.getItem(Ht);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>bp?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var ii=Promise.resolve();function li(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return ni(r,hp,e?{signal:e}:null,()=>o()).catch(n=>{throw Uo(n)});let t=ii.then(()=>{if(e?.aborted)throw Uo(new DOMException("cancelado","AbortError"));return o()});return ii=t.catch(()=>{}),t}var xp={resumido:"R",completo:"P",total:"T"};var Ap=2e3;function pi(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function Ep(o){let e=[...o.querySelectorAll("td")],r=_(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=_(e[3]),s={data:r,unidade:_(e[1]),...t?{unidadeNome:t}:{},usuario:_(e[2]),descricao:n},i=Tr(r);i&&(s.dataISO=i),a&&(s.usuarioNome=a),o.classList.contains("andamentoAberto")&&(s.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let p=_(c);/^\d+$/.test(p)&&(s.nrSei=p);let d=to(c.getAttribute("href")??"").get("id_documento");d&&(s.idDocumento=d)}if(pi(n).startsWith(pi(Co.remetidoPrefixo))){let p=e[3]?.querySelector("a.ancoraSigla"),d=_(p);d&&(s.unidadeCitada=d);let f=p?.getAttribute("title")??"";f&&(s.unidadeCitadaNome=f)}return s}function Ut(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(_(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(Ep),total:r}}function yp(o){if(o.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=po(o,"procedimento_consultar_historico")??so(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new M("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function Re(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function Bt(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(_(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function di(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function Pp(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let s=0;s<=a&&s+n<=t.length;s+=1){let i=!0;for(let c=0;c<n;c+=1)if(di(t[s+c])!==di(o.andamentos[c])){i=!1;break}if(i)return[...t.slice(0,s),...o.andamentos]}return null}async function Dp(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=wp(o,t,r);return a||await li(()=>Sp(o,e,r),r.sinal)}catch(t){throw Uo(t)}}function wp(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(Re(e,"hdnTipoHistorico")||"R")!==r.tipo||(Re(e,"hdnInfraPaginaAtual")||"0")!=="0"||Vt(o.http.base.host))return null;let{itens:t,total:a}=Ut(e);return Bt(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:Re(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function ui(o,e,r){await Q.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function Sp(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new M("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",_(a.doc.querySelector("title")));let n=Vt(t);if(n){try{await ui(o,a,n),Qr()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let s={tipo:Re(a,"hdnTipoHistorico")||"R",pagina:Re(a,"hdnInfraPaginaAtual")||"0"},i=s,c=!1,p=async(d,f)=>{c||(ci(t,s),c=!0);let u={tipo:r.tipo,pagina:String(f)},g=await Q.de(d,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:u.tipo,hdnInfraPaginaAtual:u.pagina}).enviar({sinal:r.sinal});return i=u,g};try{let d=s.tipo===r.tipo&&s.pagina==="0"?a:await p(a,0);if(!d.doc.querySelector("#tblHistorico"))throw new M("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",_(d.doc.querySelector("title")));let f=Ut(d),u=Re(d,"hdnInfraHashCriterios"),g=f.total,v=g?Math.min(g,r.limite):r.limite,h=Pp(r.cache,u,g,f.itens);if(h)return r.aoProgresso?.(1,1),{andamentos:h,total:g,hash:u,completo:!0,aproveitouCache:!0};let m=[...f.itens],E=f.itens.length,x=d.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,S=x>0?x:g>E&&E>0?Math.ceil(g/E):1;r.aoProgresso?.(1,S);for(let D=1;m.length<v&&Bt(d)&&D<Ap;D+=1){d=await p(d,D);let w=Ut(d);if(!w.itens.length)break;m.push(...w.itens),r.aoProgresso?.(D+1,Math.max(S,D+1))}let C=g?m.length>=g:!Bt(d);return{andamentos:m,total:g||m.length,hash:u,completo:C,aproveitouCache:!1}}finally{if(c)if(i.tipo!==s.tipo||i.pagina!==s.pagina)try{await ui(o,a,s),Qr()}catch{}else Qr()}}var _e=new Map;function Cp(o,e){return`${o.http.base.host}|${to(e).get("id_procedimento")??e}`}function Mp(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new M("CANCELADO","Opera\xE7\xE3o cancelada."));let t=Cp(o,e),a=_e.get(t);if(!a){let s=new AbortController,i=new Set,c={promessa:void 0,controle:s,interessados:0,progresso:i,ultimo:null};c.promessa=Dp(o,e,{tipo:xp.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:s.signal,cache:r.cache,aoProgresso:(p,d)=>{c.ultimo=[p,d];for(let f of i)f(p,d)}}).finally(()=>{_e.get(t)===c&&_e.delete(t)}),c.promessa.catch(()=>{}),_e.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((s,i)=>{let c=!1,p=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",d)},d=()=>{if(c)return;p(),n.interessados-=1;let f=new M("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){i(f);return}_e.get(t)===n&&_e.delete(t),n.controle.abort(),n.promessa.then(()=>i(f),()=>i(f))};r.sinal?.addEventListener("abort",d,{once:!0}),n.promessa.then(f=>{c||(p(),s(f))},f=>{c||(p(),i(Uo(f)))})})}function mi(o,e,r={}){return Mp(o,yp(e),r)}var te=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}somar(e){this.porId.has(e.id)||this.porId.set(e.id,e)}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Sa({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(Ip(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function Wo(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function Ip(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function gi(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function vi(o,e,r){let t=po(o,e);if(!t)throw new M("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var hi=o=>e=>to(e.url).get("acao")!==o;async function Op(o,e,r,t){let a=await o.http.obter(vi(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return Q.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>so(a.html,s)).find(Boolean);if(!n)throw new M("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return Q.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function Gt(o,e,r,t){let a=await gi(o,e,t.sinal),n=await Op(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??hi(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function ot(o,e,r,t){return Gt(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=uo("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...uo("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function bi(o,e,r,t){return Gt(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=Po(r),i=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=i.find(p=>p.valor===r)??i.find(p=>Po(p.texto.split(" - ")[0])===s)??i.find(p=>Po(p.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(p=>Po(p.texto).includes(s)).length===1?i.find(p=>Po(p.texto).includes(s)):void 0);if(!c)throw new M("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),uo("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function xi(o,e,r,t){return Gt(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],s=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let i=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...uo("Grupo",i,c.texto))}return r.observacao!==void 0&&(n.push(...uo("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),s&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function Tp(o,e,r){let t=vi(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function fi(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:_(t[1]),texto:_(t[2]),usuario:_(t[3]),data:_(t[4])}})}async function jt(o,e,r,t){let a=await gi(o,e,t.sinal),n=await Tp(o,a,t.sinal),s=fi(n),i=Po(r.marcador),c=s.find(u=>Po(u.marcador)===i),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let u=so(n.html,"andamento_marcador_remover");if(!u)throw new M("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let g=Q.de(n,"#frmGerenciarMarcador",o.http);g.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let v=await o.http.enviar(u,g.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(fi(v).some(h=>h.id===c.id))throw new M("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=Q.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=so(n.html,"andamento_marcador_cadastrar");if(!u)throw new M("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await Q.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let f=d.escolher("selMarcador",r.marcador);return d.definir({hdnIdMarcador:f.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?uo(`Texto do marcador ${f.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${f.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:hi("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${f.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${f.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function Lp(o){let e=_(o.doc.querySelector(".pesquisaBarra")),r=Number((/de\s+([\d.]+)\s*$/.exec(e)??/([\d.]+)\s+resultados?\s*$/i.exec(e)??[])[1]?.replace(/\./g,"")??0),t=[];for(let a of o.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")){let n=a.querySelector("td.pesquisaTituloEsquerda"),s=[...n?.querySelectorAll("a.protocoloNormal")??[]].find(m=>(m.getAttribute("href")??"").includes("procedimento_trabalhar")),i=a.querySelector("td.pesquisaTituloDireita a"),c=a.nextElementSibling,p=c?.nextElementSibling,d=m=>_([...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>_(E).startsWith(m))).replace(/^[^:]+:\s*/,""),f=i?.getAttribute("title")??"",u=m=>[...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>_(E).startsWith(m))?.querySelector("a"),g=u("Unidade"),v=u("Usu"),h=to(s?.getAttribute("href")??"").get("id_procedimento")??void 0;t.push({protocolo:_(s),...h?{idProcedimento:h}:{},tipoProcesso:s?.getAttribute("title")??_(n?.querySelector("span")).replace(/\s*N\u00BA\s*$/,""),...i?{documento:{numero:_(i),tipo:f}}:{},trecho:_(c?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/,""),unidade:d("Unidade"),...g?.getAttribute("title")?{unidadeNome:g.getAttribute("title")}:{},usuario:d("Usu"),...v?.getAttribute("title")?{usuarioNome:v.getAttribute("title")}:{},data:d("Inclus")||d("Data")})}return{itens:t,total:r||t.length}}async function Ai(o,e,r){if(!e.interessadoId)throw new M("ARGUMENTO_INVALIDO","Informe o interessado.");let t=Math.max(0,Math.floor(e.inicio??0)),a=await Q.abrir(o.http,o.linkMenu("protocolo_pesquisar"),"#frmPesquisaProtocolo",{sinal:r});a.definir({rdoPesquisarEm:"P",hdnIdContato:e.interessadoId,chkSinTramitacao:e.tramitadoNaUnidade?"S":null,hdnInicio:String(t)}),e.tipoProcesso&&a.escolher("selTipoProcedimentoPesquisa",e.tipoProcesso);let n=await a.enviar({sinal:r,botao:"sbmPesquisar",aceitarValidacao:!0}),s=to(n.url).get("acao");if(s==="procedimento_trabalhar"){let p=_(n.doc.querySelector("title")).replace(/^SEI\s*-\s*/,""),d=to(n.url).get("id_procedimento")??void 0;return{total:1,inicio:0,processos:[{protocolo:p,...d?{idProcedimento:d}:{},tipoProcesso:"",trecho:"",unidade:"",usuario:"",data:""}]}}if(s!=="protocolo_pesquisar")throw new M("SEI_RESPOSTA_INESPERADA","A pesquisa do SEI n\xE3o respondeu como esperado.");let{itens:i,total:c}=Lp(n);return{total:i.length?c:0,inicio:t,processos:i}}function et(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function yi(o,e,r){let t=po(e,"procedimento_alterar"),a=t??po(e,"procedimento_consultar");if(!a)throw new M("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await Q.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function $e(o){return o.map(e=>e.texto).filter(Boolean)}var kp={0:"publico",1:"restrito",2:"sigiloso"};async function Pi(o,e,r){let{form:t,editavel:a}=await yi(o,e,r),n=kp[t.valor("rdoNivelAcesso")??""]??e.nivel,s=n==="publico"?void 0:et(t,"selHipoteseLegal").trim()||e.hipotese,i=(t.valor("hdnIdTipoProcedimento")??"").trim(),c=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...s?{hipotese:s}:{},tipo:et(t,"selTipoProcedimento")||e.tipo,...i?{idTipo:i}:{},especificacao:t.valor("txtDescricao")??"",assuntos:$e(t.itensLupa("selAssuntos")),interessados:$e(t.itensLupa("selInteressadosProcedimento")),assuntosItens:t.itensLupa("selAssuntos"),interessadosItens:t.itensLupa("selInteressadosProcedimento"),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:Np(t),editavel:a,...c?{autuacao:c}:{}}}function Np(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=_(t[0]);a&&e.push({unidade:a,observacao:_(t[1])})}return e}function Ei(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let s=r.get(n.id);if(s!==void 0&&!a.has(n.id))throw new M("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${s}.`)}}async function Di(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await yi(o.http,a,{sinal:t.sinal});if(!s)throw new M("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...uo("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=et(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),i.push(...uo("Tipo",p,d.texto))}if(r.nivel!==void 0){let p=fe[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:me[r.nivel]}),i.push(...uo("N\xEDvel de acesso",p,fe[me[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=et(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||me.restrito,f=ve(await ge(o,n,d,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:f.id}),i.push(...uo("Hip\xF3tese legal",p,f.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new M("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(i.push(...uo("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let p=n.itensLupa("selInteressadosProcedimento");Ei(p,r.interessados,he(n.pagina.html,"interessado"),"Interessado"),i.push(...uo("Interessados",$e(p).join("; "),$e(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new M("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let p=n.itensLupa("selAssuntos");Ei(p,r.assuntos,he(n.pagina.html,"assunto"),"Assunto"),i.push(...uo("Assuntos",$e(p).join("; "),$e(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>to(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function wi(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(s=>bi(o,t,n,s)),anotar:n=>a(s=>ot(o,t,n,s)),alternarItemDaAnotacao:n=>a(async s=>{let i=await We(o.http,e);return ot(o,t,{texto:cs(i?.texto??"",n),prioridade:i?.prioridade??!1},s)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let s=await We(o.http,e);return s?ot(o,t,{texto:s.texto,prioridade:!s.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(s=>xi(o,t,n,s)),marcar:n=>a(s=>jt(o,t,n,s)),desmarcar:n=>a(s=>jt(o,t,{marcador:n,remover:!0},s)),alterarProcesso:n=>a(s=>Di(o,t,n,s)),opcoesAtribuicao:()=>qa(o.http,e),opcoesMarcador:()=>Ha(o.http,e),opcoesAcompanhamento:()=>Fa(o.http,e),formularioDoProcesso:()=>Va(o,e),processosDoInteressado:(n,s)=>Ai(o,n,s)}}var pr=class extends hr{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),s=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let i=s?a.documentos.find(c=>c.numero.replace(/\D/g,"")===s):void 0;return i?{idProcedimento:a.idProcedimento,idDocumento:i.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function rt(o,e){return`${o}|${e}`}function tt(o){let e=je(ne(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function Si(o){let e=new pr(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>ne(o.topo)),r=new te(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:xr(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??wi(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>mi(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await Ae(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}var de="data-spro-pasta",at="data-spro-pastas-fila",_p=500,Rp=15e3,Kt=60,$p=3,zp=3e4,qp=300,Hp=/^anchor(PASTA\d+)$/;function Fp(o,e){let r=e.replace("PASTA",""),t=o.getElementById(`spanAGUARDE${r}`);return t?t.textContent??"":null}function ae(o,e){if(!o.getElementById(`anchor${e}`))return"ausente";let r=o.getElementById(`div${e}`);if(!r)return"pendente";if(r.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])'))return"carregada";let t=Fp(o,e);if(t===null)return r.children.length>0?"carregada":"pendente";let a=fo(t);return a.startsWith("nenhum protocolo")?"carregada":a.startsWith("erro")||a.startsWith("nao foi possivel")?"falhou":"pendente"}function nt(o,e){let r=o.getElementById(`div${e}`);return r?.style.display==="block"?!0:r?.style.display==="none"?!1:/minus/.test(o.getElementById(`join${e}`)?.getAttribute("src")??"")}function Wt(o){let e=[];for(let r of o.querySelectorAll('a[id^="anchorPASTA"]')){let t=Hp.exec(r.id);t&&e.push(t[1])}return e}function Vp(o,e){return(o.getElementById(`span${e}`)?.textContent??"").trim()||e.replace("PASTA","")}function Up(o){try{return!!o.getElementById("ifrPasta")?.contentDocument?.querySelector('#pwdSenha, input[name="pwdSenha"], #txtUsuario, #frmLogin')}catch{return!1}}function Ci(o,e){let r=o.getElementById(`ancjoin${e}`)??o.getElementById(`anchor${e}`);return r?(r.addEventListener("click",t=>t.preventDefault(),{once:!0,capture:!0}),r.click(),!0):!1}var st=o=>new Promise(e=>setTimeout(e,o));function ze(o,e={}){let r=e.intervaloMs??_p,t=e.prazoPastaMs??Rp,a=e.teto??Kt,n=e.falhasSeguidas??$p,s=e.Observador??o.defaultView?.MutationObserver??globalThis.MutationObserver,i=e.sessaoExpirada??Up,c=`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,p="ociosa",d,f=null,u=0,g=0,v=!1,h=new Set,m=new Set,E=new Set,x=!1,S=!1,C=new Set,D=new Set,w=()=>Wt(o).filter(I=>{let U=ae(o,I);return(U==="pendente"||U==="falhou")&&!h.has(I)}),k=()=>{let I=w().filter(U=>U!==f).length;return{fase:p,atual:f,nomeAtual:f?Vp(o,f):"",feitas:u,total:u+(f?1:0)+I,restantes:I+(f?1:0),falhas:[...h],motivo:d}},j=(I,U)=>{let B=o.getElementById(`anchor${I}`);B&&(U===null?B.removeAttribute(de):B.getAttribute(de)!==U&&B.setAttribute(de,U))},W=()=>{let I=k();for(let U of[...C])try{U(I)}catch{}},G=o.documentElement,A=()=>G.setAttribute(at,`${c}:${Date.now()}`),L=()=>{(G.getAttribute(at)??"").startsWith(`${c}:`)&&G.removeAttribute(at)},T=()=>{let I=G.getAttribute(at);if(!I||I.startsWith(`${c}:`))return!1;let U=Number(I.split(":")[1]);return Number.isFinite(U)&&Date.now()-U<zp},N=I=>{if(S||p==="ociosa")return;let U=I.target;if(!U?.closest)return;let B=U.closest('a[id^="ancjoinPASTA"], a[id^="anchorPASTA"], div[id^="divPASTA"]');if(!B)return;let X=/(PASTA\d+)$/.exec(B.id);X&&E.add(X[1])};o.addEventListener("click",N,!0);let J=async I=>{o.hidden&&(p="pausada",W(),await new Promise(U=>{let B=()=>{(!o.hidden||v||I!==g)&&(o.removeEventListener("visibilitychange",B),clearInterval(X),U())},X=setInterval(B,1e3);o.addEventListener("visibilitychange",B)}),I===g&&!v&&(p="carregando",W()))},K=()=>e.abrirCarregadas===!1?[]:Wt(o).filter(I=>{if(E.has(I)||nt(o,I))return!1;let U=o.getElementById(`div${I}`);return ae(o,I)==="carregada"&&!!U?.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])')}),$=()=>Wt(o).some(I=>ae(o,I)==="pendente"&&nt(o,I)&&!D.has(I)),y=async I=>{let U=Date.now()+t;for(;$()&&Date.now()<U&&I===g&&!v;)await st(100)},b=I=>new Promise(U=>{let B=!1,X=null,Oo,Eo,mo=zo=>{B||(B=!0,X?.disconnect(),clearInterval(Oo),clearTimeout(Eo),U(zo))},To=()=>{if(v)mo("cancelada");else{let zo=ae(o,I);zo==="carregada"?mo("ok"):zo==="falhou"?mo("falhou"):zo==="ausente"&&mo("sumiu")}};if(typeof s=="function"){X=new s(To);let zo=o.getElementById("divArvore")??o.body??G;X.observe(zo,{childList:!0,subtree:!0,characterData:!0})}Oo=setInterval(To,qp),Eo=setTimeout(()=>mo("tempo"),t),To()}),P=(I,U)=>{let B=o.activeElement,X=o.defaultView,Oo=X?.scrollX??0,Eo=X?.scrollY??0;S=!0;let mo=!0;try{for(let To=0;To<U&&mo;To+=1)mo=Ci(o,I)}finally{S=!1}if(B&&o.activeElement!==B&&B.isConnected)try{B.focus({preventScroll:!0})}catch{}return X&&typeof X.scrollTo=="function"&&(X.scrollX!==Oo||X.scrollY!==Eo)&&X.scrollTo(Oo,Eo),mo},R=async I=>{if(e.abrir)return D.add(I),await e.abrir(o,I),!0;let U=nt(o,I);D.add(I);let B=P(I,U?2:1);return U||m.add(I),B},F=()=>{for(let I of[...m])if(m.delete(I),!(E.has(I)||!nt(o,I)||o.getElementById(`div${I}`)?.querySelector(".infraArvoreNoSelecionado"))&&ae(o,I)!=="pendente"){S=!0;try{Ci(o,I)}finally{S=!1}}},q=()=>{for(let I of o.querySelectorAll(`[${de}]`))I.removeAttribute(de)},Y=async I=>{let U=0,B=0;p="carregando",d=void 0,W();try{for(;;){if(I!==g||v||(await J(I),I!==g||v))return;for(let To of K())P(To,1)&&m.add(To);let X=w()[0];if(!X){p="concluida";return}if(u>=a){p="teto";return}let Oo=B?r-(Date.now()-B):0;if(Oo>0&&await st(Oo),I!==g||v)return;if(T()){p="interrompida",d="ocupada";return}if(await y(I),I!==g||v)return;if(!w().includes(X)){await st(10);continue}f=X,A(),j(X,"carregando"),W();let mo=await R(X).catch(()=>!1)?await b(X):"falhou";if(j(X,null),f=null,I!==g||v){x&&(x=!1,F()),W();return}if(B=Date.now(),mo==="ok")U=0,u+=1;else if(mo==="sumiu")await st(Math.min(r,200));else{if(u+=1,h.add(X),j(X,"falhou"),U+=1,i(o)){p="interrompida",d="sessao";return}if(U>=n){p="interrompida",d="falhas";return}}W()}}finally{I===g&&(f=null,L(),(p==="carregando"||p==="pausada")&&(p="concluida"),x&&(x=!1,F()),W())}},ro=()=>{if(!v&&!(p==="carregando"||p==="pausada")&&!(!w().length&&!K().length)){if(T()){p="interrompida",d="ocupada",W();return}g+=1,u=0,A(),Y(g)}};return{iniciar(){p==="parada"||p==="teto"||p==="interrompida"||ro()},parar(){p!=="carregando"&&p!=="pausada"||(g+=1,p="parada",L(),W())},continuar(){h=new Set,Io(),p="ociosa",ro()},tentarDeNovo(){h=new Set,Io(),p="ociosa",ro()},encerrar(I){g+=1;let U=f!==null;p="ociosa",d=void 0,u=0,h=new Set,q(),I?U?x=!0:F():m.clear(),E.clear(),L(),W()},estado:k,pendentes:w,aoMudar(I){return C.add(I),()=>C.delete(I)},destruir(){v=!0,g+=1,o.removeEventListener("click",N,!0),q(),L(),C.clear()}};function Io(){for(let I of o.querySelectorAll(`[${de}="falhou"]`))I.removeAttribute(de)}}var dr=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function qe(o){return fo(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function Bp(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function Gp(o){return o.externo&&o.formato!=="circular"}function Xt(o,e){if(!Bp(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function jp(o){let e=fo(o);return e?e.split(" "):[]}function Wp(o){return fo(`${o.titulo} ${o.numero}`)}function Kp(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&Xt(o,r)||e.externos&&Gp(o)||e.cancelados&&o.cancelado))return!1;let a=jp(e.texto);if(a.length){let n=Wp(o);if(!a.every(s=>n.includes(s)))return!1}return!0}function Mi(o,e,r){let t=new Set;for(let a of o.documentos)Kp(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var He="data-spro-f-oculto";function Ii(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function Oi(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!Ii(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!Ii(r));r=r.nextElementSibling);return e}function Xp(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function it(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=Xp((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),s=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),i=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:Ti(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:s,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:i||void 0,link:"",src:"",acoes:[],botoes:[]}}function Ti(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function Li(o,e,r,t,a){let n=o.getElementById("divArvore"),s={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return s;let i=new Map(e.map(v=>[v.id,v])),c=[],p=new Set;for(let v of n.querySelectorAll('a[id^="anchor"]')){let h=Wo(v.id,"anchor");if(!h||h===r)continue;let m=i.get(h)??it(o,h);if(!m)continue;let E=Ti(v);c.push({id:h,ancora:v,doc:E===m.pasta?m:{...m,pasta:E}}),E&&p.add(E)}let d=c.map(v=>v.doc),f=qe(t),u=Mi({documentos:d},t,a),g=new Set;if(f){for(let v of c)if(!u.has(v.id))for(let h of Oi(v.ancora))g.add(h)}for(let v of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(v.id))continue;let h=v.id.slice(6);if(s.pastas+=1,!p.has(h)&&ae(o,h)!=="carregada"){s.pastasFechadas+=1;continue}if(f&&!u.has(h)){for(let E of Oi(v))g.add(E);let m=o.getElementById(`div${h}`);m&&g.add(m)}}for(let v of Array.from(n.querySelectorAll(`[${He}]`)))g.has(v)||v.removeAttribute(He);for(let v of g)v.hasAttribute(He)||v.setAttribute(He,"1");return s.total=d.length,s.visiveis=d.filter(v=>u.has(v.id)).length,s}function ki(o){for(let e of Array.from(o.querySelectorAll(`[${He}]`)))e.removeAttribute(He)}function Ni(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}function _i(o,e){return o.filter(r=>Xt(r,{unidade:e})).map(r=>({id:r.id,numero:r.numero,titulo:r.titulo}))}function Ri(o){let e=new Map;for(let r of o)!r.nrSei||!r.descricao.startsWith(Co.documentoGerado)||e.set(r.nrSei,r.data.slice(0,10));return e}function $i(o,e){return e?o.map(r=>{let t=e.get(r.numero);return t?{...r,data:t}:r}):[...o]}var zi="spro-na-nao-assinados";function Yp(o){let e=o.getElementById("divInfraBarraLocalizacao");if(e)return{pai:e,antes:null};let r=o.getElementById("frmAtividadeListar");return r?.parentElement?{pai:r.parentElement,antes:r}:null}function Jp(o,e){let r=o.getElementById(`anchor${e}`);return r?(r.click(),r.scrollIntoView?.({block:"center"}),!0):!1}function Zp(o,e){let r=new te(e.documentos);r.lerDoIframe(o);for(let t of o.querySelectorAll("#divArvore a[id^='anchor']")){let a=Wo(t.id,"anchor");if(!a||r.obter(a))continue;let n=it(o,a);n&&r.somar(n)}return r.todos()}function qi(o){let e=Yp(o.doc);if(!e||o.doc.getElementById(zi))return null;qo(o.doc);let r=l("div",{id:zi,class:"spro-na",role:"status","aria-live":"polite"});Lo(o.doc)&&r.setAttribute("data-tema","escuro"),e.pai.insertBefore(r,e.antes);let t=!1,a=!1,n=!0,s=()=>l("strong",{},o.unidade),i=(u,g,v,...h)=>{r.className=`spro-na ${u}`,r.replaceChildren(l("span",{class:"spro-na-icone","aria-hidden":"true"},H(g,15)),l("span",{},...v),...h)},c=(u,g)=>{let v=l("button",{type:"button",class:"spro-p-link"},u);return v.addEventListener("click",g),v},p=async(u,g)=>{if(a)return;a=!0;let v=ze(u,{...o.opcoesFila,abrirCarregadas:!1,...o.abrirPasta?{abrir:(m,E)=>o.abrirPasta?.(m,E)}:{}}),h=c("Parar",()=>v.parar());v.aoMudar(m=>{if(m.fase!=="carregando"&&m.fase!=="pausada")return;let E=m.nomeAtual?`: ${m.nomeAtual}`:"";i("falha","atualizar",[`Carregando as pastas da \xE1rvore (${Math.min(m.feitas+1,Math.max(m.total,1))} de ${Math.max(m.total,1)}${E})...`],h)});try{i("falha","atualizar",["Carregando as pastas da \xE1rvore..."],h),v.iniciar(),await new Promise(m=>{let E=()=>{let S=v.estado().fase;S==="carregando"||S==="pausada"||(x(),m())},x=v.aoMudar(E);E()})}finally{v.destruir(),a=!1}n=!0,f()},d=(u,g,v)=>{if(t)return;t=!0;let h=l("ul",{class:"spro-p-lista-modal spro-na-lista","aria-label":"Documentos n\xE3o assinados"}),m=S=>h.replaceChildren(...S.map(C=>{let D=l("button",{type:"button",class:"spro-p-link","aria-label":`Selecionar na \xE1rvore: ${C.titulo} (${C.numero})`},H("documento",14),`${C.titulo} (${C.numero})`);return D.addEventListener("click",()=>{x.fechar(),Jp(g,C.id)}),l("li",{class:"spro-p-linha-modal"},D,C.data?l("span",{class:"spro-na-data"},C.data):null)}));m(u);let E=c("Verificar pastas",()=>{x.fechar(),p(g,v)}),x=eo({topo:o.topo,doc:o.doc},{titulo:"Documentos pendentes de assinatura",icone:"caneta",largura:700,conteudo:[l("p",{class:"spro-p-nota"},u.length===1?`Existe 1 documento n\xE3o assinado na unidade ${o.unidade}.`:`Existem ${u.length} documentos n\xE3o assinados na unidade ${o.unidade}.`),h,v.length>0?l("p",{class:"spro-p-nota"},`${v.length===1?"1 pasta fechada n\xE3o foi verificada":`${v.length} pastas fechadas n\xE3o foram verificadas`}: o SEI s\xF3 traz os documentos de uma pasta quando ela \xE9 aberta. `,E):null],aoFechar:()=>{t=!1}});o.datas().then(S=>{S&&x.el.isConnected&&m($i(u,S))})},f=()=>{if(a)return;let u=o.quadroDaArvore(),g=u?o.lerArvore(u):null;if(!u||!g){i("falha","alerta",["N\xE3o foi poss\xEDvel verificar os documentos n\xE3o assinados na unidade ",s()],c("Tentar de novo",f));return}let v=Zp(u,g),h=_i(v,o.unidade),m=Ni({pagina:g.pagina,documentos:v}),E=m.length===1?"1 pasta fechada ainda n\xE3o foi verificada":`${m.length} pastas fechadas ainda n\xE3o foram verificadas`,x=m.length?c("Verificar pastas",()=>void p(u,m)):null;if(!h.length){x?i("falha","alerta",["Nenhum documento n\xE3o assinado na unidade ",s(),` na \xE1rvore aberta; ${E}`],x):i("ok","check",["Todos os documentos foram assinados na unidade ",s()]);return}i("pendente","alerta",["Existem documentos n\xE3o assinados na unidade ",s()],c("Detalhes",()=>d(h,u,m)),...x?[x]:[]),n&&d(h,u,m),n=!1};return f(),{verificar:f,remover:()=>r.remove()}}function Fi(o){return o!==o.top&&/[?&]acao=procedimento_enviar(&|$)/.test(o.location.search)}function Hi(o){try{return o.getElementById("ifrArvore")?.contentDocument??null}catch{return null}}async function Vi(o=document){if(!o.getElementById("frmAtividadeListar"))return null;let{dataValues:e}=await chrome.storage.sync.get("dataValues");if(!Vo(e,Ya))return null;let r=vr(),t=Hi(r),a=t?Ne(t)??await lr(t,5e3):null,n=tt(r);return qi({doc:o,topo:r,quadroDaArvore:()=>Hi(r),lerArvore:s=>Ne(s),unidade:n.unidade.sigla,datas:async()=>{if(!a||a.nivel==="sigiloso"||!n.login)return null;let s=new Se(mr(chrome.storage.local,"local"),rt(n.host,n.login),a.idProcedimento),i=await xe({loja:s,agora:()=>new Date,sigiloso:!1});return i?.vale?Ri(i.historico.andamentos):null}})}var Qp=90,Ui=120,od=4e3,Bi=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function ed(o,e,r=!1){if(!e)return{principal:""};let t=o.total===1?"documento":"documentos";return o.visiveis===0?{principal:r?`Nenhum documento at\xE9 agora (${o.total} na \xE1rvore).`:`Nenhum documento encontrado (${o.total} na \xE1rvore).`}:{principal:`${o.visiveis} de ${o.total} ${t}`}}var Fe=(o,e,r)=>`${o} ${o===1?e:r}`;function rd(o,e,r){if(!e)return null;let t=o.total>0?Math.min(100,Math.round(o.feitas/o.total*100)):null,a=o.falhas.length,n={id:"tentar",rotulo:"Tentar de novo",aria:"Tentar de novo carregar as pastas que falharam"},s={id:"continuar",rotulo:"Continuar",aria:"Continuar a carregar as pastas fechadas"};switch(o.fase){case"carregando":return o.total===0?null:{texto:`Carregando pastas ${Math.min(o.feitas+1,Math.max(o.total,1))} de ${Math.max(o.total,1)}${o.nomeAtual?`: ${o.nomeAtual}`:""}`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"pausada":return{texto:`Em pausa: a aba est\xE1 oculta (${o.feitas} de ${o.total} pastas)`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"parada":return{texto:`Parou: ${Fe(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"};case"teto":return{texto:`Limite de ${r.teto} pastas por vez: ${Fe(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"};case"interrompida":return o.motivo==="sessao"?{texto:"A sess\xE3o do SEI expirou: entre de novo e atualize a p\xE1gina.",acao:null,progresso:null,tom:"aviso"}:o.motivo==="ocupada"?{texto:"Outra carga de pastas est\xE1 em andamento neste quadro.",acao:n,progresso:null,tom:"aviso"}:{texto:`${Fe(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}; ${Fe(o.restantes,"ainda fechada","ainda fechadas")}.`,acao:n,progresso:null,tom:"aviso"};case"concluida":return a>0?{texto:`${Fe(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}.`,acao:n,progresso:null,tom:"aviso"}:o.feitas>0&&r.mostrarConcluida?{texto:"Todas as pastas carregadas",acao:null,progresso:100,tom:"ok"}:null;default:return r.pastasFechadas>0?{texto:`${Fe(r.pastasFechadas,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"}:null}}var Yt="Filtrar documentos";function td(o){let e="http://www.w3.org/2000/svg",r=o.createElementNS(e,"svg");for(let[a,n]of Object.entries({viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor","aria-hidden":"true",focusable:"false"}))r.setAttribute(a,n);let t=o.createElementNS(e,"path");return t.setAttribute("fill-rule","evenodd"),t.setAttribute("d","M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.74 4.74-1.41 1.41-4.74-4.74A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z"),r.append(t),r}function ad(o){let e=o.createElement("button");return e.type="button",e.className="spro-f-lupa-btn",e.setAttribute("aria-label",Yt),e.setAttribute("aria-pressed","false"),e.append(td(o)),e}var nd=".spro-fav-estrela, .spro-fav-abrir, .spro-prj-ic, .iconFavoritePro";function sd(o,e){let r=[...o.children].filter(n=>n!==e),t=r.find(n=>n.matches(".spro-fav-estrela, .iconFavoritePro"));if(t)return t;let a=r.filter(n=>n.matches(nd));return a.length?a[a.length-1]??null:r.find(n=>n.matches('a.infraArvoreNo, a[target="ifrVisualizacao"], a[target="ifrConteudoVisualizacao"]'))??null}function id(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},H("fechar",12)),r=new Map;for(let d of Bi)r.set(d.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":d.chave,"aria-pressed":"false","aria-label":`${d.rotulo}. ${d.ajuda}`},d.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-fila-texto"}),n=l("button",{type:"button",class:"spro-f-fila-acao",hidden:!0}),s=l("div",{class:"spro-f-prog-enchimento"}),i=l("div",{class:"spro-f-prog",role:"progressbar","aria-label":"Progresso do carregamento das pastas","aria-valuemin":"0","aria-valuemax":"100",hidden:!0},s),c=l("div",{class:"spro-f-fila",hidden:!0},l("div",{class:"spro-f-fila-linha"},a,n),i);return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},H("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,c)),busca:o,limpar:e,chips:r,status:t,fila:{raiz:c,texto:a,acao:n,barra:i,enchimento:s}}}function Gi(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;qo(r);let a=id(),n=ad(r);for(let y of r.querySelectorAll(".spro-f-lupa-btn"))y.remove();let s=!1,i={...dr},c={visiveis:0,total:0,pastasFechadas:0,pastas:0},p,d,f=!1,u=e.fila===void 0?ze(r,e.opcoesFila):e.fila,g=e.opcoesFila?.teto??Kt,v=!1,h,m=()=>{let y=r.getElementById("divArvore");y?.parentElement&&(a.raiz.parentElement!==y.parentElement||a.raiz.nextElementSibling!==y)&&y.parentElement.insertBefore(a.raiz,y)},E={el:null,obs:null},x=()=>{let y=r.getElementById("topmenu");if(!y)return n.isConnected;E.el!==y&&typeof N=="function"&&(E.obs?.disconnect(),E.el=y,E.obs=new N(()=>{f||(x(),D())}),E.obs.observe(y,{childList:!0}));let b=sd(y,n);return b?(n.parentElement===y&&n.previousElementSibling===b||b.after(n),!0):n.isConnected},S=()=>{for(let y of[a.raiz,n])Lo(r)?y.setAttribute("data-tema","escuro"):y.removeAttribute("data-tema")},C=y=>{let b=a.fila;if(b.raiz.hidden=!y,!y){b.raiz.removeAttribute("data-tom");return}b.raiz.setAttribute("data-tom",y.tom),b.texto.textContent!==y.texto&&(b.texto.textContent=y.texto),b.acao.hidden=!y.acao,y.acao&&(b.acao.textContent!==y.acao.rotulo&&(b.acao.textContent=y.acao.rotulo),b.acao.setAttribute("aria-label",y.acao.aria),b.acao.setAttribute("data-acao",y.acao.id)),b.barra.hidden=y.progresso===null,y.progresso!==null&&(b.barra.setAttribute("aria-valuenow",String(y.progresso)),b.enchimento.style.width=`${y.progresso}%`)},D=()=>{let y=qe(i);for(let Y of Bi)a.chips.get(Y.chave)?.setAttribute("aria-pressed",i[Y.chave]?"true":"false");a.busca.value!==i.texto&&(a.busca.value=i.texto),a.limpar.hidden=!y;let b=u?.estado(),P=b?rd(b,y,{pastasFechadas:c.pastasFechadas,teto:g,mostrarConcluida:v}):null,{principal:R}=ed(c,y,b?.fase==="carregando"||b?.fase==="pausada");a.status.textContent!==R&&(a.status.textContent=R),C(P),a.status.parentElement.hidden=!y,a.raiz.toggleAttribute("data-ativo",y);let F=c.total===0&&c.pastas===0&&!y;a.raiz.hidden=F||!s&&n.isConnected,n.hidden=F,n.setAttribute("aria-pressed",s?"true":"false");let q=y&&!s;n.toggleAttribute("data-ativo",q),n.setAttribute("aria-label",q?`${Yt} (filtro ativo)`:Yt)},w=()=>(c=Li(r,o.documentos.todos(),o.idProcedimento,i,{unidade:o.unidade.sigla}),D(),c),k=0,j=()=>{if(f)return;m(),x();let y=Date.now();y-k>=Ui&&(k=y,w()),clearTimeout(d),d=setTimeout(()=>{f||(k=Date.now(),m(),x(),w())},Ui)},W=()=>{!u||f||(qe(i)?u.iniciar():u.encerrar(!0))},G=y=>{i={...i,...y},w(),W()};a.busca.addEventListener("input",()=>{i={...i,texto:a.busca.value},clearTimeout(p),p=setTimeout(()=>{f||(w(),W())},Qp)}),a.raiz.addEventListener("keydown",y=>{y.key==="Escape"&&(y.preventDefault(),y.stopPropagation(),qe(i)&&y.target===a.busca?A():T(!0))}),n.addEventListener("click",()=>{s?T():L()});for(let[y,b]of a.chips)b.addEventListener("click",()=>G({[y]:!i[y]}));let A=()=>{clearTimeout(p),i={...dr},u?.encerrar(!0),w(),a.busca.focus()};a.limpar.addEventListener("click",A);let L=()=>{if(s){a.busca.focus();return}s=!0,D(),a.busca.focus()},T=(y=!1)=>{if(!s)return;clearTimeout(p);let b=y||a.raiz.contains(r.activeElement);i={...dr},s=!1,u?.encerrar(!0),w(),b&&n.focus()},N=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,J=r.getElementById("frmArvore")??t.parentElement,K=typeof N=="function"?new N(y=>{a.raiz.isConnected&&y.every(P=>a.raiz.contains(P.target)||P.addedNodes.length+P.removedNodes.length>0&&[...P.addedNodes,...P.removedNodes].every(R=>R===a.raiz))||j()}):null;K?.observe(J,{childList:!0,subtree:!0});let $=Ee(r,S);return u?.aoMudar(y=>{f||(y.fase==="concluida"&&y.falhas.length===0&&y.feitas>0&&!v?(v=!0,clearTimeout(h),h=setTimeout(()=>{v=!1,f||D()},e.esperaConcluidaMs??od)):y.fase!=="concluida"&&(v=!1),D(),y.fase==="carregando"&&w())}),a.fila.acao.addEventListener("click",()=>{let y=a.fila.acao.getAttribute("data-acao");y==="parar"?u?.parar():y==="continuar"?u?.continuar():y==="tentar"&&u?.tentarDeNovo()}),m(),x(),S(),w(),{estado:()=>({...i}),aberta:()=>s,abrir:L,fechar:T,lupa:()=>n,definir:G,limpar:()=>{clearTimeout(p),i={...dr},u?.encerrar(!0),w()},reaplicar:w,barra:()=>a.raiz,destruir:()=>{f=!0,clearTimeout(p),clearTimeout(d),clearTimeout(h),u?.encerrar(!0),u?.destruir(),K?.disconnect(),E.obs?.disconnect(),n.remove(),$(),ki(r),a.raiz.remove()}}}function cd(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function ld(o){return async()=>{try{return await o()}catch(e){throw new Error(Go(e))}}}function ji(o){let e=pd(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,ld(t)]))}function pd(o){let e=xr(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await Pi(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await We(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:cd(o.arv),editavel:!1}:{itens:await za(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await _a(o.http,o.arv)}:t,atribuicao:async()=>({...Ra(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function Jt(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function Wi(o){o.documentElement?.setAttribute(Ba,"1")}function Ki(o){o.documentElement?.setAttribute(Ga,"1")}function Xi(o){o.documentElement?.setAttribute(Wa,"1")}function Zt(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function Yi(o){o.documentElement?.setAttribute(ja,"1")}function Ji(o){o.documentElement?.setAttribute(Ka,"1"),o.documentElement?.setAttribute(Xa,"1")}function Qt(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var ct=["Copiar","Abrir","Acoes"],oa={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},Mo={tipo:"local"},Z=(...o)=>({tipo:"acao",acoes:o}),Ko=(...o)=>({tipo:"funcao",funcoes:o}),lt=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:Mo,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:Mo,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:Mo,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:Mo,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:Mo,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:Mo,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:Mo,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:Z("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:Z("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:Z("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:Z("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:Z("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:Z("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:Z("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Ko("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Ko("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Ko("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:Z("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Ko("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Ko("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:Z("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:Z("md_pet_intimacao_cadastrar")}],Zi=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:Mo},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:Mo},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:Mo},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:Mo},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:Mo},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:Mo},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:Z("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:Z("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:Z("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:Z("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:Z("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:Z("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:Z("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:Z("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:Z("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:Z("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:Z("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:Z("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:Z("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:Z("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:Z("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:Z("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:Z("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:Z("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Ko("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Ko("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Ko("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Ko("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:Z("arvore_ordenar")}],pt="Ativar menu ao clicar",Qi=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],oc=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],ec=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],dd={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},ud=o=>dd[o]??o;function rc(o,e){let r=ud(e);return o.find(t=>t.nome===r)}var Pb=lt.filter(o=>o.modo).map(o=>o.nome);function tc(o){return o.includes(" ")?o.split(" ").pop()??"":""}function Ve(o){let e=tc(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function ac(o){let e=o.trim(),r=tc(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function nc(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var md=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),ea=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),ra=(o,e)=>`<a href="${md(o)}" target="_blank">${ea(e)}</a>`,sc=o=>({texto:Ve(o.rotulo)});function ic(o){let e=Ve(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${ac(o.rotulo)} (${nc(o.citacaoOpcao)}${e})`}}var cc=o=>({texto:o.linkDocumento});function lc(o){let e=Ve(o.rotulo);return{texto:e,html:ra(o.linkDocumento,e)}}function pc(o){let e=Ve(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:ra(o.linkDocumento,e)};let r=ac(o.rotulo),t=nc(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${ea(r)} (${ea(t)}${ra(o.linkDocumento,e)})`}}var dc=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function ta(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function uc(o){return ct.flatMap(e=>o.filter(r=>r.grupo===e))}function aa(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===pt)continue;let s=rc(o,n);s&&!t.has(s.id)&&(t.add(s.id),a.push(s))}return a}var mc=(o,e)=>{for(let r of e){let t=so([...o],r);if(t)return t}return null};function fc(o,e){return e.find(r=>o?.includes(r))??null}var gc={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function fd(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var gd=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function vd(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:ta(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(sc(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar(ic(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(cc(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(lc(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(pc(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,s=e.dado?.cancelado===!0,i=!r.podeIncluirDocumento,c=s?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(i?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let d=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!d)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let f=!1;if(/minuta/i.test(e.rotulo)){let u=await t.perguntarMinuta();if(!u)return;f=u==="remover"}await t.duplicar(d,f)}}}default:return{executar:()=>{}}}}function vc(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,s=o.origem;if(s.tipo==="local")return!(n?.numero||Ve(e.rotulo))||gd.has(o.id)&&e.id.includes("-")?null:{...t,...vd(o,e,r)};if(!n)return null;if(s.tipo==="conteudo"){if(!n.src)return null;let d=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(d,fd(e))}:{...t,executar:()=>a.abrirEmNovaAba(d)}}if(s.tipo==="acao"){let d=mc(n.acoes,s.acoes);return d?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(d)}:{...t,executar:()=>a.abrirNoVisualizador(d)}:null}let i=fc(n.funcoes,s.funcoes);if(!i)return null;let c=gc[i];if(!c)return null;let p=async d=>{let f=await a.linkDaTela(n.link,c);if(!f)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);d==="aba"?a.abrirEmNovaAba(f):a.abrirNoVisualizador(f)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function hc(o,e){let r=[];for(let t of aa(lt,e.selecao,Qi)){let a=vc(t,o,e);a&&r.push(a)}return uc(r)}function dt(o,e,r){let t=[];for(let a of aa(lt,r,ec)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=vc(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function bc(o){let e=o.servicos,r=[],t=ta(o.base,o.idProcedimento);for(let a of aa(Zi,o.selecao,oc)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},s=a.origem;if(s.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:dc(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(s.tipo==="acao"){let i=mc(o.acoesProcesso,s.acoes);i&&r.push({...n,executar:()=>e.abrirNoVisualizador(i)});continue}if(s.tipo==="funcao"){let i=fc(o.funcoesProcesso,s.funcoes);if(!i)continue;if(i==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(i)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=gc[i];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);i==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return uc(r)}var ur="spro-pm-icone",xc="data-spro-pm-sig",Ac=["breackline_doc"];function hd(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function bd(o,e){return l("span",{class:`action-doc action-${o.modo} ${ur}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},H(o.icone,13))}function xd(o,e,r){let t=r.map(s=>s.modo).join(","),a=[];for(let s=o.nextElementSibling;s;s=s.nextElementSibling)if(s.classList.contains(ur))a.push(s);else{if(Ac.some(i=>s.classList.contains(i))||s.classList.contains("action-doc"))continue;break}if(a=a.filter(s=>s.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(xc)===t&&a.length===r.length)return!1;for(let s of a)s.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Ac.some(s=>n.nextElementSibling?.classList.contains(s));)n=n.nextElementSibling;for(let s of r){let i=bd(s,e);i.setAttribute(xc,t),n.after(i),n=i}return!0}function Ec(o,e,r,t,a){let n=0,s=t(),i=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=Wo(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let d=r(p,hd(c)),f=dt(d,s,i);xd(c,p,f)&&(n+=1)}return n}function yc(o){for(let e of o.querySelectorAll(`.${ur}`))e.remove()}function Pc(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,s=()=>{clearTimeout(n),n=setTimeout(r,150)},i=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&i?new a(s):null;c?.observe(i,{childList:!0,subtree:!0});let p=u=>{if(u.getAttribute("aria-busy")==="true")return;let g=u.getAttribute("data-id")??"",v=u.getAttribute("data-action")??"";u.setAttribute("aria-busy","true");let h=()=>{u.removeAttribute("aria-busy"),u.classList.add("feito"),setTimeout(()=>u.classList.remove("feito"),900)};Promise.resolve(e(g,v)).catch(m=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",m)).finally(h)},d=u=>{let g=u.target?.closest?.(`.${ur}`);g&&(u.preventDefault(),u.stopPropagation(),p(g))},f=u=>{if(u.key!=="Enter"&&u.key!==" ")return;let g=u.target?.closest?.(`.${ur}`);g&&(u.preventDefault(),p(g))};return o.addEventListener("click",d,!0),o.addEventListener("keydown",f,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",d,!0),o.removeEventListener("keydown",f,!0)}}function Dc(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],s=!1,i=u=>{let g=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${u.perigo?" spro-menu-perigo":""}${u.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":u.id,...u.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},H(u.icone,15)),l("span",{class:"spro-menu-rotulo"},u.rotulo),u.dica?l("span",{class:"spro-menu-dica"},u.dica):null);return g.addEventListener("click",v=>{v.preventDefault(),v.stopPropagation(),!u.desativado&&(d(!0),r.aoEscolher(u))}),n.push(g),g};for(let u of ct){let g=e.filter(v=>v.grupo===u);g.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":oa[u]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},oa[u]),...g.map(i)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(i));let c=u=>{if(!n.length)return;let g=(u+n.length)%n.length;for(let[v,h]of n.entries())h.setAttribute("tabindex",v===g?"0":"-1");n[g]?.focus?.({preventScroll:!0})};for(let u of n)u.addEventListener("pointermove",()=>c(n.indexOf(u)));let p=Ir(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>d(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function d(u){if(s)return;s=!0;let g=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",f,!0),(u||g)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function f(u){if(u.key==="Escape"){u.preventDefault(),u.stopPropagation(),d(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let g=n.findIndex(v=>v.getAttribute("tabindex")==="0");switch(u.key){case"ArrowDown":c(g+1);break;case"ArrowUp":c(g-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[g]?.click();break;case"Tab":d(!0);return;default:return}u.preventDefault(),u.stopPropagation()}return t.addEventListener("keydown",f,!0),r.focar&&c(0),{el:a,fechar:()=>d(!1)}}async function Sc(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),s=a.documentos.find(i=>i.id===t.idDocumento)??a.documentos.find(i=>i.numero.replace(/\D/g,"")===n);if(!s)throw new M("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:s}}async function Ad(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",s=r.nivel?me[r.nivel]:n;if(r.nivel&&(a.push(...uo("N\xEDvel de acesso",fe[n]??"",fe[s])),e.definir({rdoNivelAcesso:s,hdnStaNivelAcessoLocal:s})),s==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&s!==n){if(!r.hipotese)throw new M("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let i=await ge(o,e,s,t),c=ve(i,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function Ed(o,e,r){let t=await Sc(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=so(t.documento.acoes,a)??so(t.documento.acoes,/^documento_alterar/);if(!n)throw new M("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let s=await Q.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:s}}async function yd(o,e,r){let t=po(e,"documento_escolher_tipo");if(!t)throw new M("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await Q.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=Q.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function Pd(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,_(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=to(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,_(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Dd(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await yd(o,e,t),s=Pd(n.pagina).filter(i=>i.id!=="-1").map(i=>({id:i.id,texto:i.nome}));if(a){let i=s.find(c=>c.id===r);if(!i)throw new M("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:i}}return{escolha:n,tipo:ve(s,r,"Tipo de documento")}}async function wd(o,e,r,t,a,n,s){let i=await t.definir({hdnIdSerie:a.id}).enviar({sinal:s}),c=Q.de(i,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),d=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(d?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let h=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(E=>E.valor===h&&E.valor!=="null"))throw new M("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${h}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:h,hdnIdTextoPadrao:h})}else if(n.textoPadrao){let h=c.opcoes("selTextoPadrao").filter(E=>E.valor!=="null").map(E=>({id:E.valor,texto:E.texto})),m=ve(h,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:m.id,hdnIdTextoPadrao:m.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await Ad(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},s),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let f=await c.enviar({sinal:s,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:h=>/acao_origem=documento_(?:gerar|cadastrar)/.test(h.url)||/editor_montar/.test(h.html)}),u=to(f.url).get("id_documento")??/id_documento=(\d+)/.exec(f.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:u,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let v=(await o.arvore(e,{forcar:!0,sinal:s})).documentos.find(h=>h.id===u);return{idDocumento:u,numero:v?.numero??"",titulo:v?.titulo??""}}function wc(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var Sd=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function Cc(o,e,r,t={}){let a=await Sc(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new M("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:s}=await Ed(o,e,r.sinal),i=n.documento,c=s.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??s.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new M("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",d=p==="restrito"?(s.valor("hdnIdHipoteseLegal")||s.opcoes("selHipoteseLegal").find(x=>x.selecionada&&x.valor!=="null")?.valor)??void 0:void 0,f=s.valor("hdnIdSerie")??"";if(!f)throw new M("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${i.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:u,tipo:g}=await Dd(o,n.arvore,f,r.sinal,!0),v={alvo:i.numero,mudancas:[{campo:"Documento",antes:"",depois:`${g.texto} (c\xF3pia de ${i.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...v,resumo:`Vai duplicar ${i.titulo} (${i.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:h,numero:m,titulo:E}=await wd(o,e,n.arvore,u,g,{tipo:g.id,descricao:t.semMinuta?wc(s.valor("txtDescricao")??""):s.valor("txtDescricao")??"",numero:Sd(s.valor("txtNumero")),nomeArvore:s.valor("txtNomeArvore")?t.semMinuta?wc(s.valor("txtNomeArvore")??""):s.valor("txtNomeArvore")??"":void 0,documentoModelo:i.numero,interessados:s.itensLupa("selInteressados"),assuntos:s.itensLupa("selAssuntos"),observacao:s.valor("txaObservacoes")??"",nivel:p,hipotese:d},r.sinal);return{...v,aplicado:!0,resumo:`Documento ${i.numero} duplicado: ${E||g.texto} ${m?`(${m}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:h,numero:m}}}var Cd="seipro-processo-menu",na="data-spro-pm-pedido";async function Md(o,e){if(!e.html)return Ct(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function Mc(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function Ic(o){let{ctx:e}=o,r=e.doc,t=s=>new URL(s,r.baseURI).href,a=(s,i)=>ao(e,s,i),n=(s,i,c)=>new Promise(p=>{let d=null,f=eo(e,{titulo:s,icone:"alerta",largura:420,conteudo:[l("p",{},i),go(...c.map(u=>u.principal?bo(u.rotulo,()=>{d=u.id,f.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{d=u.id,f.fechar()}},u.rotulo)))],aoFechar:()=>p(d)})});return{async copiar(s,i){let c=await Md(r,s);a(c?i:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(s){let i=Mc(e.topo),c=i[i.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(s))},abrirEmNovaAba(s){let i=l("a",{href:t(s),target:"_blank",rel:"noopener"});r.body.append(i),i.click(),i.remove()},baixar(s,i){let c=l("a",{href:t(s),download:i});r.body.append(c),c.click(),c.remove()},async duplicar(s,i){a("Duplicando o documento...",2e4);try{await Cc(o.sei,s,{aplicar:!0},{semMinuta:i}),a(`Documento ${s} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(wo(c),8e3)}},async perguntarMinuta(){let s=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return s==="remover"||s==="manter"?s:null},async confirmar(s,i){return await n("Confirmar",s,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:i,principal:!0}])==="ok"},async linkDaTela(s,i){let c=await o.http.obter(s),p=new RegExp(`var\\s+${i}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(s,i){r.documentElement.setAttribute(na,`${s}|${i??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(Cd)),r.documentElement.hasAttribute(na)&&(r.documentElement.removeAttribute(na),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await Jr(e,"URGENTE")},clicarBotaoNativo(s){for(let i of Mc(e.topo))try{let c=i.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${s}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var Id="configViewFlashMenuPro",Od="configViewFlashDocMenuPro",Td="configViewFlashDocArvorePro";function Oc(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;qo(r);let n=new te(e.arv.documentos);n.lerDoIframe(r);let s=()=>({...e.arv,documentos:n.todos()}),i=o.sei??new pr(r.location?.href??"https://sei.invalido/sei/controlador.php",s,()=>ne(e.topo)),c=o.servicos??Ic({ctx:e,http:o.http,sei:i,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,d=()=>!!po(s(),"documento_escolher_tipo"),f=b=>({selecao:b,citacao:fr(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:d(),uploadLigado:Vo(o.dataValues,"uploaddocsexternos"),loteLigado:Vo(o.dataValues,"acoesemlote"),servicos:c}),u=()=>Fr(e.armazenamento,Od),g=()=>Fr(e.armazenamento,Id),v=()=>Fr(e.armazenamento,Td),h=()=>u()?.includes(pt)??!1,m=(b,P)=>{let R=n.obter(b);return R||(n.lerDoIframe(r),R=n.obter(b)),{id:b,rotulo:P,dado:R}},E={id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>c.legado("personalizar")},x=b=>{let P=b;if(!P?.closest)return null;let R=P.closest('a[id^="anchorImg"]');if(R){let q=Wo(R.id,"anchorImg");return q&&q!==e.arv.idProcedimento&&tr(e.armazenamento,"menudoc")?{tipo:"documento",ancora:R,id:q}:null}let F=P.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return F&&tr(e.armazenamento,"menuproc")?{tipo:"processo",ancora:F}:null},S=b=>{if(b.tipo==="processo")return{itens:bc(f(g())),rotulo:"Menu do processo"};let P=r.getElementById(`anchor${b.id}`),R=m(b.id,(P?.textContent??"").replace(/\s+/g," ").trim());return{itens:hc(R,f(u())),rotulo:"Menu do documento"}},C=null,D=null,w,k=()=>{clearTimeout(w),D&&clearTimeout(D.timer),D=null;let b=C;C=null,b?.menu.fechar()},j=(b,P)=>{if(C?.ancora===b.ancora)return;k();let{itens:R,rotulo:F}=S(b);if(!R.length)return;let q=Dc(b.ancora,R,{rotulo:F,escuro:Lo(r),focar:P,rodape:[E],aoFechar:()=>{C?.menu===q&&(C=null)},aoEscolher:Y=>{Promise.resolve().then(()=>Y.executar()).catch(ro=>{console.warn("[SEI Pro] menu da \xE1rvore:",ro),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});C={menu:q,ancora:b.ancora},q.el.addEventListener("mouseenter",()=>clearTimeout(w)),q.el.addEventListener("mouseleave",()=>W())},W=()=>{clearTimeout(w),w=setTimeout(k,a)},G=b=>{let P=b;return P?!!(C&&(C.ancora.contains(P)||C.menu.el.contains(P))||D?.ancora.contains(P)):!1},A=b=>{if(G(b.target)){clearTimeout(w);return}let P=x(b.target);if(D&&(clearTimeout(D.timer),D=null),!P||P.tipo==="documento"&&h()){C&&W();return}C&&W(),D={ancora:P.ancora,timer:setTimeout(()=>{D=null,j(P,!1)},t)}},L=b=>{b.relatedTarget||(D&&(clearTimeout(D.timer),D=null),C&&W())},T=b=>{let P=x(b.target);if(P){if(P.tipo==="documento"&&h()){b.preventDefault(),b.stopImmediatePropagation(),C?.ancora===P.ancora?k():j(P,!1);return}P.tipo==="documento"&&C?.ancora===P.ancora&&k()}},N=b=>{let P=x(b.target);!P||!(b.key==="ArrowDown"||(b.key==="Enter"||b.key===" ")&&P.tipo==="documento"&&h())||(b.preventDefault(),b.stopImmediatePropagation(),j(P,!0))};r.addEventListener("mouseover",A),r.addEventListener("mouseout",L),r.addEventListener("click",T,!0),r.addEventListener("keydown",N,!0);let J=null,K=()=>{if(!tr(e.armazenamento,"iconstree")){yc(r);return}Ec(r,e.arv.idProcedimento,m,()=>f(u()),v)};tr(e.armazenamento,"iconstree")&&(J=Pc(r,async(b,P)=>{let R=r.getElementById(`anchor${b}`),F=m(b,(R?.textContent??"").replace(/\s+/g," ").trim());await dt(F,f(u()),v()).find(Y=>Y.modo===P)?.executar()},K),K());let $=n.acompanharPastas(r,()=>setTimeout(K,80)),y=Ee(r,()=>{C&&(Lo(r)?C.menu.el.setAttribute("data-tema","escuro"):C.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(b,P=!1){let R=Wo(b.id,"anchorImg");if(R)return j({tipo:"documento",ancora:b,id:R},P);j({tipo:"processo",ancora:b},P)},atual:()=>C?.menu??null,parar(){k(),r.removeEventListener("mouseover",A),r.removeEventListener("mouseout",L),r.removeEventListener("click",T,!0),r.removeEventListener("keydown",N,!0),J?.(),$(),y()}}}var Ld='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function Tc(o,e,r){for(let t of o.querySelectorAll(Ld)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function Lc(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(Tc(o.doc,"urgentePro",No(t.valor.especificacao,"URGENTE")),o.usaTrancado&&Tc(o.doc,"trancadoPro",No(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function kc(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}function Nc(o){return o==="pronto"?"pronto":o.fase==="contando"?`contando:${o.feito}/${o.total}`:o.fase==="parou"?`parou:${o.restantes}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var kd=["dadosProcesso","marcador"],Nd=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function _d(o){return o.fase==="carregando"||o.fase==="pausada"?{fase:"contando",feito:o.feitas,total:o.total}:o.fase==="concluida"?o.falhas.length?{fase:"erro",mensagem:`${o.falhas.length===1?"1 pasta n\xE3o carregou":`${o.falhas.length} pastas n\xE3o carregaram`}.`}:"pronto":o.fase==="parada"||o.fase==="teto"?{fase:"parou",restantes:o.restantes}:o.fase==="interrompida"?o.motivo==="sessao"?{fase:"erro",mensagem:"A sess\xE3o do SEI expirou."}:o.motivo==="ocupada"?{fase:"erro",mensagem:"Outra carga de pastas est\xE1 em andamento."}:{fase:"erro",mensagem:`${o.falhas.length} pastas n\xE3o carregaram.`}:{fase:"parada"}}function _c(o,e,r={}){let t=null,a=h=>{let m=kc(h);m===null?o.documentElement?.removeAttribute(wr):o.documentElement?.setAttribute(wr,m)},n=()=>{e().then(h=>{if(!(!h||h.sigiloso))for(let m of kd)h.loja.ler(m).estado!=="pronto"&&h.recarregar(m)}).catch(h=>console.warn("[SEI Pro] capa do processo:",h))},s=()=>{if(t)return;let h=new AbortController;t=h,a({fase:"coletando",feito:0,total:0}),e().then(async m=>{if(!m||m.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await Ae(m,{sinal:h.signal,aoProgresso:(E,x)=>a({fase:"coletando",feito:E,total:x})}),a("pronto")}).catch(m=>{Nd(m)||h.signal.aborted?a({fase:"parada"}):a({fase:"erro",mensagem:Go(m)})}).finally(()=>{t=null})},i=()=>t?.abort(),c=null,p=null,d=!1,f=h=>{let m=Nc(h);m===null?o.documentElement?.removeAttribute(Xe):o.documentElement?.setAttribute(Xe,m)},u=()=>{p?.(),p=null,c?.destruir(),c=null},g=()=>{if(d=!1,c){let E=c.estado().fase;if(E==="carregando"||E==="pausada")return;c.continuar();return}let h=ze(o,{abrirCarregadas:!1,...r});c=h;let m=!1;p=h.aoMudar(E=>{if(m||d)return;let x=_d(E);f(x),E.fase==="concluida"&&c===h&&(m=!0,h.encerrar(!0),m=!1,x==="pronto"&&u())}),h.iniciar(),h.estado().fase==="ociosa"&&(u(),f("pronto"))},v=()=>{let h=c;h&&(h.parar(),h.encerrar(!0),d=!0,f({fase:"parou",restantes:h.pendentes().length}))};return o.addEventListener(yr,n),o.addEventListener(Pr,s),o.addEventListener(Dr,i),o.addEventListener(Sr,g),o.addEventListener(Cr,v),()=>{u(),o.documentElement?.removeAttribute(Xe),o.removeEventListener(Sr,g),o.removeEventListener(Cr,v),o.removeEventListener(yr,n),o.removeEventListener(Pr,s),o.removeEventListener(Dr,i)}}function Rd(o,e){let r=o.replace(/\s+/g," ").trim();return r?`${r} | SEI - Processo ${e}`:`SEI - Processo ${e}`}function Rc(o){if(o.sigiloso||o.consultasDesativadas)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;if(!t||!t.disponivel)return;let a=Rd(t.valor.especificacao,o.protocolo);o.topo.title!==a&&(o.topo.title=a)},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}var sa=null;mn(`${ca}
${ba}`);Zt(window)&&(Yi(document),Ji(document));Jt(window)&&(Wi(document),Ki(document),Xi(document));var $c=window;if(!$c.__seiProProcessoPaineis&&Jt(window)&&!Qt(window)){$c.__seiProProcessoPaineis=!0,Hn(document,ia),_c(document,ia);let o=()=>void zd().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}if(Fi(window)&&!Qt(window)){let o=()=>void Vi().catch(e=>console.warn("[SEI Pro] aviso de n\xE3o assinados:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function ia(){return sa??=$d().catch(o=>{throw sa=null,o}),sa}async function $d(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await lr(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=vr(),t=tt(r),a=e.nivel==="sigiloso",n=new Se(mr(chrome.storage.local,"local"),rt(t.host,t.login),e.idProcedimento,{sigiloso:a}),s=Be(location.href),i=gr(o,"disablequery"),c=ji({http:s,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:i});return Si({doc:document,topo:r,arv:e,loja:n,...t,habilitados:Gn(Xn(localStorage)),armazenamento:localStorage,consultasDesativadas:i,reaberturaProgramada:gr(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:p=>{let d=c[p];d&&n.carregar(p,d)}})}async function zd(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=Vo(o,"infoarvore")&&Yn(localStorage),r=Vo(o,"menurapido"),t=Vo(o,Ja),a=!gr(o,"disablequery")&&Zt(window.top);if(!e&&!r&&!t&&!a)return;let n=await ia();if(n){if(a&&!n.sigiloso&&(Rc(n),e||n.recarregar("dadosProcesso")),e){ai(n),Lc(n);let s=new Set(ti(n));a&&!n.sigiloso&&s.add("dadosProcesso");for(let i of s)n.recarregar(i);Ua(n).catch(()=>{})}r&&Oc({ctx:n,dataValues:o,http:Be(location.href)}),t&&Gi(n)}}})();
