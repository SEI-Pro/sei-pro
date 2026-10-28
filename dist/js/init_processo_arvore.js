/* GERADO por processo/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{function Ol(o){let e={};for(let[r,t]of Object.entries(o)){let a={};t&&"newValue"in t&&(a.novo=t.newValue),t&&"oldValue"in t&&(a.antigo=t.oldValue),e[r]=a}return e}function yr(o,e){return{obter:(r=null)=>o.get(r),gravar:r=>o.set(r),remover:r=>o.remove(r),chaves:typeof o.getKeys=="function"?()=>o.getKeys():void 0,aoMudar(r){let t=(a,n)=>{n===e&&r(Ol(a))};return chrome.storage.onChanged.addListener(t),()=>chrome.storage.onChanged.removeListener(t)}}}function Pr(o,e){let r=o;if(typeof o=="string"){if(!o.trim())return;try{r=JSON.parse(o)}catch{return}}return!Array.isArray(r)||r.length===0?void 0:r.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===e)?.value}function zo(o,e){let r=Pr(o,e);return!(r===!1||r===0||r==="")}function Dr(o,e){let r=Pr(o,e);return r===!0||r===1||r==="1"}var Ba=`/*
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
`;var kl={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function Io(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(e,r)=>{let t=r[0]==="#"?r[1]==="x"||r[1]==="X"?parseInt(r.slice(2),16):parseInt(r.slice(1),10):kl[r];return t===void 0||Number.isNaN(t)?e:String.fromCodePoint(t)}):o}var Ga={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var Nl={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function Ke(o,e="texto"){let r="";for(let t of o){let a=t.codePointAt(0);if(a<=255){r+=t;continue}let n=Nl[t];if(e==="html"){r+=n===""?"":`&#${a};`;continue}if(n!==void 0){r+=n;continue}let s=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");r+=[...s].every(i=>i.codePointAt(0)<=255)?s:""}return r}var _l=/[A-Za-z0-9\-_.*]/;function ja(o){let e="";for(let r of o)r===" "?e+="+":_l.test(r)?e+=r:e+="%"+r.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return e}function Wa(o,e={}){return o.map(([r,t])=>{let a=e[r]??"texto";return`${ja(Ke(r))}=${ja(Ke(t??"",a))}`}).join("&")}function Ka(o){let e=r=>encodeURIComponent(Ke(r)).replace(/%20/g,"+");return o.map(([r,t])=>`${e(r)}=${e(t??"")}`).join("&")}var Xa="application/x-www-form-urlencoded";function Nt(o){let e=o instanceof Uint8Array?o:new Uint8Array(o),r=[],t=16384;for(let a=0;a<e.length;a+=t){let n=e.subarray(a,a+t),s=new Array(n.length);for(let i=0;i<n.length;i+=1)s[i]=Ga[n[i]]??n[i];r.push(String.fromCharCode(...s))}return r.join("")}var Ja="application/x-www-form-urlencoded; charset=ISO-8859-1";var Ya=null;function ve(o){return Ya?Ya(o):new DOMParser().parseFromString(o,"text/html")}function V(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var k=class extends Error{codigo;detalhe;constructor(e,r,t){super(r),this.name="ErroSei",this.codigo=e,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function Wo(o){if(o instanceof k)return o;if(o instanceof DOMException&&o.name==="AbortError")return new k("CANCELADO","Opera\xE7\xE3o cancelada.");let e=o instanceof Error?o.message:String(o);return new k("SEI_REDE",`Falha ao falar com o SEI: ${e}`)}function Za(o,e,r){let t=null;return{url:o,status:e,html:r,get doc(){return t??=ve(r)}}}function Qa(o,e={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new k("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new k("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let r=o.doc.querySelector("#divInfraExcecao");if(r){let t=V(r);throw new k("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!e.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let r=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(r)throw new k("SEI_VALIDACAO",r,r)}return o}function Xe(o,e={}){let r=new URL(".",o),t=e.fetch??((...m)=>fetch(...m)),a=Math.max(1,e.concorrencia??3),n=0,s=[];async function i(m){n>=a&&await new Promise(u=>s.push(u)),n+=1;try{return await m()}finally{n-=1,s.shift()?.()}}let c=m=>new URL(m.replace(/&amp;/g,"&"),r).href;async function p(m,u,g){return i(async()=>{try{let h=await t(c(m),{credentials:"same-origin",redirect:"follow",...u,signal:g.sinal}),b=Nt(await h.arrayBuffer());return Qa(Za(h.url||c(m),h.status,b),g)}catch(h){throw Wo(h)}})}async function d(m,u={}){return i(async()=>{try{let g=await t(c(m),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),h=new Uint8Array(await g.arrayBuffer()),b=(g.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();b==="text/html"&&Qa(Za(g.url||c(m),g.status,Nt(h)),u);let f=g.headers?.get("content-disposition")??"",E=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(f)?.[1]??/filename="?([^";]+)"?/i.exec(f)?.[1]??"");return{bytes:h,tipo:b,nome:E}}catch(g){throw Wo(g)}})}return{base:r,absoluta:c,baixar:d,obter:(m,u={})=>p(m,{method:"GET"},u),enviar:(m,u,g={})=>p(m,g.utf8?{method:"POST",headers:{"Content-Type":Xa},body:Ka(u)}:{method:"POST",headers:{"Content-Type":Ja},body:Wa(u,g.modos)},g)}}function le(o,e=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:e,status:200,get html(){return o.documentElement.outerHTML},doc:o}}function Je(){try{return window.top?.document??document}catch{return document}}var on=`/*
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
/* Alinhamento vertical: a arvore do SEI e \`div.infraArvore { line-height: 0 }\` com o nome (a.infraArvoreNo), a unidade e os
   icones nativos em \`vertical-align: text-top\`. Com line-height 0 o centro dessas caixas cai exatamente no topo da area de
   conteudo da linha. O icone e uma caixa atomica (inline-flex) de altura --spro-pm-h: no mesmo text-top ele ficaria com o TOPO
   ali (centro 8 px abaixo do texto), entao sobe metade da altura (margin-top negativo) e o centro fica no do texto. Mesmo
   porte dos icones de monitoramento (caixa de 20 px, glifo de 16 px). No Estilo Avancado (\`.seiSlim_arvore\`) o nome vira \`baseline\` e a regra e outra (abaixo). */
span.action-doc.spro-pm-icone {
  --spro-pm-h: 20px;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: var(--spro-pm-h);
  min-width: var(--spro-pm-h);
  margin: calc(var(--spro-pm-h) / -2) 1px 0;
  padding: 2px;
  vertical-align: text-top;
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
  width: 16px;
  height: 16px;
  pointer-events: none;
}
/* Estilo Avancado: o nome da arvore fica em \`baseline\` (sei-slim.css), cujo centro e ~1,6 px acima do de uma caixa \`middle\`. */
.seiSlim.seiSlim_arvore span.action-doc.spro-pm-icone {
  margin: 0 1px;
  vertical-align: middle;
  top: -1.6px;
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

/* ---------- Personalizar menu rapido (personalizar/) ---------- */
/* Cor de destaque do tema do SEI (a barra do sistema), como a capa; no escuro, clareada para ter contraste. */
dialog.spro-dialogo[data-cor-sei] {
  --spro-destaque: var(--spro-cor-sei);
}
dialog.spro-dialogo[data-cor-sei][data-tema="escuro"] {
  --spro-destaque: color-mix(in srgb, var(--spro-cor-sei) 45%, #ffffff);
}
dialog.spro-pp .spro-dialogo-corpo {
  gap: 10px;
}
dialog.spro-pp *,
dialog.spro-pp *::before,
dialog.spro-pp *::after {
  box-sizing: border-box;
}
.spro-pp-topo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.spro-pp-topo .spro-pp-busca {
  flex: 1 1 auto;
  width: auto;
  min-width: 0;
  height: 32px;
  color: var(--spro-texto);
  background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  box-shadow: none;
}
.spro-pp-topo .spro-botao {
  flex: none;
  min-height: 32px;
}
.spro-pp-abas {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  border-bottom: 1px solid var(--spro-borda);
}
.spro-pp-aba {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 36px;
  margin: 0 0 -1px;
  padding: 0 12px;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: var(--spro-suave);
  background: transparent;
  border: 0;
  border-bottom: 2px solid transparent;
  border-radius: 6px 6px 0 0;
  box-shadow: none;
  cursor: pointer;
}
.spro-pp-aba:hover {
  color: var(--spro-texto);
  background: var(--spro-fundo-2);
}
.spro-pp-aba[aria-selected="true"] {
  color: var(--spro-destaque);
  border-bottom-color: var(--spro-destaque);
}
.spro-pp-aba:focus-visible {
  outline: 2px solid var(--spro-destaque);
  outline-offset: -2px;
}
.spro-pp-aba-glifo {
  display: inline-flex;
}
.spro-pp-aba-conta {
  min-width: 18px;
  padding: 0 5px;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  color: var(--spro-destaque);
  background: var(--spro-destaque-suave);
  border-radius: 9px;
}
.spro-pp-palco {
  display: grid;
  min-height: 0;
}
.spro-pp-painel {
  display: grid;
  gap: 8px;
  min-height: 0;
  align-content: start;
}
.spro-pp-painel[hidden] {
  display: none;
}
.spro-pp-cabeca {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-top: 4px;
}
.spro-pp-cabeca-glifo {
  display: inline-flex;
  flex: none;
  color: var(--spro-destaque);
}
.spro-pp-cabeca-texto {
  flex: 1 1 auto;
  min-width: 0;
}
.spro-pp-cabeca h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.3;
  color: var(--spro-texto);
}
.spro-pp-cabeca p {
  margin: 2px 0 0;
  font-size: 12px;
  line-height: 1.35;
  color: var(--spro-suave);
}
.spro-pp-resumo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--spro-fraco);
}
.spro-pp-aviso {
  margin: 0;
  padding: 8px 10px;
  font-size: 12px;
  line-height: 1.4;
  color: var(--spro-texto);
  background: color-mix(in srgb, var(--spro-aviso) 12%, transparent);
  border-radius: var(--spro-raio-p);
}
.spro-pp-aviso[hidden],
.spro-pp-vazio[hidden] {
  display: none;
}
.spro-pp-vazio {
  margin: 0;
  padding: 14px 4px;
  font-size: 13px;
  color: var(--spro-suave);
}
.spro-pp-lista {
  display: grid;
  gap: 1px;
  max-height: min(48vh, 440px);
  margin: 0;
  padding: 0 2px 0 0;
  overflow-y: auto;
  list-style: none;
  scrollbar-width: thin;
}
.spro-pp-painel[data-geral="false"] .spro-pp-lista {
  opacity: 0.5;
}
.spro-pp-linha {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  margin: 0;
  padding: 5px 8px;
  font-size: 13px;
  border-radius: 8px;
}
.spro-pp-linha[hidden] {
  display: none;
}
.spro-pp-linha:hover {
  background: var(--spro-fundo-2);
}
.spro-pp-especial {
  margin-bottom: 6px;
  background: var(--spro-fundo-2);
}
.spro-pp-alca {
  display: inline-flex;
  flex: none;
  justify-content: center;
  width: 16px;
  color: var(--spro-fraco);
  cursor: grab;
}
.spro-pp-alca.vazio {
  cursor: default;
}
.spro-pp-glifo {
  display: inline-flex;
  flex: none;
  justify-content: center;
  width: 22px;
  color: var(--spro-fraco);
}
.spro-pp-linha[data-ativo="true"] .spro-pp-glifo {
  color: var(--spro-destaque);
}
.spro-pp-texto {
  display: grid;
  flex: 1 1 auto;
  min-width: 0;
  line-height: 1.3;
}
.spro-pp-nome {
  color: var(--spro-texto);
}
.spro-pp-dica {
  font-size: 11.5px;
  color: var(--spro-fraco);
}
.spro-pp-grupo {
  flex: none;
  padding: 0 7px;
  font-size: 11.5px;
  line-height: 18px;
  color: var(--spro-suave);
  background: var(--spro-fundo-3);
  border-radius: 9px;
}
.spro-pp-setas {
  display: inline-flex;
  flex: none;
}
.spro-pp-setas.vazio {
  display: none;
}
.spro-pp-mover {
  width: 26px;
  height: 26px;
}
.spro-pp-linha[data-arrastando] {
  opacity: 0.45;
}
.spro-pp-linha[data-sobre] {
  box-shadow: inset 0 2px 0 var(--spro-destaque);
}
.spro-pp-switch {
  position: relative;
  flex: none;
  width: 38px;
  height: 22px;
  min-width: 38px;
  min-height: 22px;
  margin: 0;
  padding: 0;
  background: var(--spro-borda-forte);
  border: 0;
  border-radius: 11px;
  box-shadow: none;
  cursor: pointer;
  transition: background-color 120ms;
}
.spro-pp-switch[aria-checked="true"] {
  background: var(--spro-destaque);
}
.spro-pp-knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 18px;
  height: 18px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 1px 2px rgb(0 0 0 / 28%);
  transition: transform 120ms;
}
.spro-pp-switch[aria-checked="true"] .spro-pp-knob {
  transform: translateX(16px);
}
.spro-pp-switch:focus-visible {
  outline: 2px solid var(--spro-destaque);
  outline-offset: 2px;
}
.spro-pp-switch:disabled {
  cursor: default;
}
.spro-pp-geral {
  width: 44px;
  height: 26px;
  min-width: 44px;
  min-height: 26px;
  border-radius: 13px;
}
.spro-pp-geral .spro-pp-knob {
  width: 22px;
  height: 22px;
}
.spro-pp-geral[aria-checked="true"] .spro-pp-knob {
  transform: translateX(18px);
}
.spro-pp-rodape {
  display: flex;
  justify-content: flex-end;
  padding-top: 2px;
  border-top: 1px solid var(--spro-borda);
}
.spro-pp-situacao {
  padding-top: 8px;
  font-size: 12px;
  color: var(--spro-fraco);
}
.spro-pp-situacao[data-salvo] {
  color: var(--spro-ok);
}
@media (prefers-reduced-motion: reduce) {
  .spro-pp-switch,
  .spro-pp-knob {
    transition: none;
  }
}
`;var en="data-seipro-processo-paineis",rn="data-seipro-processo-menu",tn="data-seipro-processo-capa",an="data-seipro-processo-gantt",nn="data-seipro-processo-titulo",sn="data-seipro-processo-aviso",cn="naoassinados",wr="spro-processo-gantt-abrir",Sr="spro-processo-capa-pedir",Mr="spro-processo-capa-calcular",Cr="spro-processo-capa-cancelar",Ir="data-spro-capa-coleta",Lr="spro-processo-capa-contar",Or="spro-processo-capa-contar-parar",Ye="data-spro-capa-contagem";var ln="filtroarvore";var Tr="processo/",_t=(o,e)=>`${Tr}${o}/${e}`,zt=o=>{let e=o.indexOf("|");return e>0&&e<o.length-1},Rt="processo-historico/",$t=(o,e)=>`${Rt}${o}/${e}`;var Ht="spro-processo-personalizar-abrir",pn="data-spro-pers-ack";function l(o,e={},...r){let t=document.createElement(o);for(let[a,n]of Object.entries(e))n===void 0||n===!1||(typeof n=="function"?t.addEventListener(a.replace(/^on/,""),n):n===!0?t.setAttribute(a,""):a==="class"?t.className=n:a==="value"&&o==="textarea"?t.value=n:t.setAttribute(a,n));for(let a of r)a!=null&&a!==!1&&t.append(a);return t}var qo={fill:"currentColor",stroke:"none"},dn="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",un={estrela:[["path",{d:dn}]],estrelaCheia:[["path",{d:dn,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...qo}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...qo}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...qo}],["circle",{cx:"12",cy:"12",r:"1.4",...qo}],["circle",{cx:"19",cy:"12",r:"1.4",...qo}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...qo}],["circle",{cx:"15",cy:"6",r:"1.3",...qo}],["circle",{cx:"9",cy:"12",r:"1.3",...qo}],["circle",{cx:"15",cy:"12",r:"1.3",...qo}],["circle",{cx:"9",cy:"18",r:"1.3",...qo}],["circle",{cx:"15",cy:"18",r:"1.3",...qo}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"}],["path",{d:"M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],novaAba:[["path",{d:"M13.5 4.5H19.5V10.5"}],["path",{d:"M19.5 4.5 11 13"}],["path",{d:"M17.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V8A1.5 1.5 0 0 1 6 6.5h4"}]],imprimir:[["path",{d:"M7 9V4.5h10V9"}],["rect",{x:"4",y:"9",width:"16",height:"8",rx:"2"}],["path",{d:"M7 14h10v5.5H7z"}]],caneta:[["path",{d:"M14.5 5.5 18.5 9.5"}],["path",{d:"M4.5 19.5 5.6 15 16 4.6a1.5 1.5 0 0 1 2.1 0l1.3 1.3a1.5 1.5 0 0 1 0 2.1L9 18.4z"}],["path",{d:"M13 20h7"}]],cancelar:[["circle",{cx:"12",cy:"12",r:"8.5"}],["path",{d:"M6 6l12 12"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"11",height:"11",rx:"2"}],["path",{d:"M15.5 8.5V6A1.5 1.5 0 0 0 14 4.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2"}],["path",{d:"M4 7.5l8 6 8-6"}]]},em=Object.keys(un);function W(o,e=18,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[s,i]of Object.entries(n))a.setAttribute(s,i);for(let[s,i]of un[o]){let c=r.createElementNS(t,s);for(let[p,d]of Object.entries(i))c.setAttribute(p,d);a.append(c)}return a}function Rl(o){return o===void 0?[]:"rotulo"in o?[o]:[...o]}function mn(o){let e=[...o.querySelectorAll("dialog[open]")],r=!0;return e.filter(n=>{try{return n.matches(":modal")}catch{return r=!1,!1}}).at(-1)??(r?void 0:e.at(-1))??o.body??o.documentElement}function fn(o,e,r,t,a){let n=o.body??o.documentElement;for(let m of[n,...o.querySelectorAll("dialog")])for(let u of[...m.children])u.classList.contains("spro-aviso")&&u.remove();let s=l("div",{class:"spro-aviso",role:"status"},W("check",16),l("span",{},e),...Rl(r).map(m=>l("button",{type:"button",onclick:()=>{s.remove(),m.fazer()}},m.rotulo)));s.setAttribute("popover","manual");let i=()=>{try{s.showPopover?.()}catch{}},c=Date.now()+t,p=()=>{let m=mn(o);m.append(s),i(),m.localName==="dialog"&&m.addEventListener("close",()=>{if(!(!d||!m.contains(s))){if(a&&mn(o).localName!=="dialog"&&a(e,r,Math.max(0,c-Date.now()))){d=!1,s.remove();return}p()}},{once:!0})},d=!0;return p(),setTimeout(()=>{d=!1,s.remove()},t),s}async function qt(o,e){try{return await o.defaultView?.navigator.clipboard.writeText(e),!0}catch{let r=o.createElement("textarea");r.value=e,r.setAttribute("readonly",""),r.style.position="fixed",r.style.opacity="0",o.body.append(r),r.select();let t=!1;try{t=o.execCommand("copy")}catch{t=!1}return r.remove(),t}}function co(o,e,r=4e3){try{fn(o.topo,e,void 0,r)}catch{}}async function gn(o,e){let r=await qt(o.doc,e);co(o,r?"Copiado.":"N\xE3o foi poss\xEDvel copiar.",1800)}var vn={publico:"olho",restrito:"cadeado",sigiloso:"cadeado"},hn={publico:"P\xFAblico",restrito:"Restrito",sigiloso:"Sigiloso"};function Lo(o){if(o&&typeof o=="object"){let e=o,r=typeof e.message=="string"&&e.message?e.message:"N\xE3o foi poss\xEDvel concluir.",t=typeof e.detalhe=="string"&&e.detalhe&&e.codigo==="SEI_VALIDACAO"?` ${e.detalhe}`:"";return`${r}${t}`.trim()}return typeof o=="string"&&o?o:"N\xE3o foi poss\xEDvel concluir."}function Ko(o){let e=o&&typeof o=="object"?o.codigo:void 0;return e==="SEI_SESSAO_EXPIRADA"?"Sua sess\xE3o do SEI expirou. Entre de novo e atualize a p\xE1gina.":e==="SEI_VERSAO_NAO_SUPORTADA"||e==="SEI_RESPOSTA_INESPERADA"?"O SEI respondeu uma tela inesperada (a sess\xE3o pode ter expirado).":e==="SEI_REDE"?"Sem conex\xE3o com o SEI.":Lo(o)}function xo(o){return o.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var bn=new Set;var $l=null;function Hl(o){let e=o.closest?.("dialog[open]");if(e)return e;let r=o.getRootNode?.(),t=o.ownerDocument;return r&&r!==t&&r.host?r:t.body??t.documentElement}function xn(o,e){let r=o;try{r?.CustomEvent&&r.dispatchEvent(new r.CustomEvent("spro-popover",{detail:{fundo:e}}))}catch{}}function kr(o,e,r){let t=o.ownerDocument,a=t.defaultView;Hl(o).append(e);let n=!0,s=()=>{if(!n)return;let u=o.getBoundingClientRect?.();if(!u)return;let g=a?.innerHeight??0,h=a?.innerWidth??0,b=Math.min(r.largura??Math.max(u.width,r.larguraMinima??0),Math.max(180,h-16)),f=r.alinharDireita?u.right-b:u.left,E=Math.max(8,Math.min(f,h-b-8)),x=r.alturaMaxima??360;e.style.maxHeight="none";let I=Math.min(e.scrollHeight||x,x),L=g-u.bottom-8,S=u.top-8,M=$l?.()??!1,$=!M&&L<Math.min(I,200)&&S>L;e.style.left=`${E}px`,e.style.width=`${b}px`,e.style.maxHeight=`${M?x:Math.max(140,Math.min(x,$?S:L>140?L:x))}px`,e.classList.toggle("spro-flutuante-cima",$),$?(e.style.top="",e.style.bottom=`${g-u.top+4}px`):(e.style.bottom="",e.style.top=`${u.bottom+4}px`),xn(a,$?0:Math.ceil(u.bottom+4+I+12))},i=u=>{let g=u.composedPath?.()??[],h=u.target,b=f=>g.includes(f)||!!h&&!!f.contains?.(h);b(e)||b(o)||r.aoFechar()},c=()=>{o.isConnected?s():r.aoFechar()},p=u=>{u.target instanceof Node&&e.contains(u.target)||c()},d=()=>r.aoFechar();t.addEventListener("pointerdown",i,!0),a?.addEventListener("scroll",p,!0),a?.addEventListener("resize",c),a?.addEventListener("blur",d);let m={ancora:o,fechar:()=>r.aoFechar()};return bn.add(m),s(),{posicionar:s,fechar(){n&&(n=!1,bn.delete(m),t.removeEventListener("pointerdown",i,!0),a?.removeEventListener("scroll",p,!0),a?.removeEventListener("resize",c),a?.removeEventListener("blur",d),e.remove(),xn(a,0))}}}function An(o,e){let r=xo(e);if(!r)return[...o];let t=r.split(" "),a=[];return o.forEach((n,s)=>{let i=xo(n.rotulo),c=xo(n.complemento??""),p=`${i} ${c} ${xo(n.descricao??"")}`;if(!t.every(m=>p.includes(m)))return;let d=i.startsWith(r)?0:`${i} ${c}`.split(" ").some(m=>m.startsWith(t[0]))?1:2;a.push({o:n,nota:d,i:s})}),a.sort((n,s)=>n.nota-s.nota||n.i-s.i).map(n=>n.o)}function En(o,e){let r=o.normalize("NFC"),t=xo(e).split(" ").filter(Boolean);if(!t.length)return[{texto:r,marcado:!1}];let a=[...r],n="",s=[];a.forEach((p,d)=>{let m=p.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();for(let u of m)n+=u,s.push(d)});let i=new Array(a.length).fill(!1);for(let p of t){let d=n.indexOf(p);if(!(d<0))for(let m=d;m<d+p.length;m++)i[s[m]]=!0}let c=[];return a.forEach((p,d)=>{let m=c[c.length-1];m&&m.marcado===i[d]?m.texto+=p:c.push({texto:p,marcado:i[d]})}),c}var ql=0;function yn(o){let e=`spro-combo-${++ql}`,r=()=>typeof o.opcoes=="function"?o.opcoes():o.opcoes,t=new Map,a=A=>r().find(R=>R.valor===A)??t.get(A),n=[...o.valor??[]],s=null,i="",c=0,p=[],d=null,m=o.vazio??"Escolher\u2026",u={tipo:"pronto"},g=0,h=l("button",{type:"button",class:`spro-combo${o.classe?` ${o.classe}`:""}`,role:"combobox","aria-haspopup":"listbox","aria-expanded":"false","aria-label":o.rotulo,title:o.rotulo}),b=()=>o.aoMudar?.([...n]);function f(){let A=[];o.icone&&A.push(W(o.icone,15));let R=n.map(q=>a(q)).filter(q=>!!q),z=l("span",{class:"spro-combo-texto"});if(!R.length)z.classList.add("spro-combo-vazio"),z.append(m);else{let q=R[0];q.marca&&z.append(q.marca()),q.cor&&z.append(l("span",{class:"spro-combo-cor",style:`background:${q.cor}`})),z.append(l("span",{class:"spro-combo-rotulo"},q.rotulo)),q.complemento&&z.append(l("span",{class:"spro-combo-compl"},q.complemento)),R.length>1&&z.append(l("span",{class:"spro-combo-mais"},`+${R.length-1}`))}A.push(z,W("chevron",14)),h.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false"),h.classList.toggle("spro-combo-erro",u.tipo==="erro"),h.classList.toggle("spro-combo-ativo",o.multiplo===!0&&R.length>0),h.replaceChildren(...A)}let E=()=>o.busca??(r().length>7||!!o.multiplo||!!o.criar);function x(A){if(o.multiplo){n=n.includes(A.valor)?n.filter(z=>z!==A.valor):[...n,A.valor],b(),f(),M();return}let R=n.length!==1||n[0]!==A.valor;n=[A.valor],f(),X(!0),R&&b()}async function I(){if(!o.criar)return;let A=i.trim();if(!A)return;let R=await o.criar(A);if(R){if(t.set(R.valor,R),i="",s){let z=s.querySelector(".spro-combo-busca");z&&(z.value="")}o.multiplo&&n.includes(R.valor)?M():x(R)}}function L(A,R){let z=n.includes(A.valor),q=l("span",{class:"spro-combo-op-rotulo"});for(let F of En(A.rotulo,i))q.append(F.marcado?l("mark",{},F.texto):F.texto);let Q=A.complemento?l("span",{class:"spro-combo-op-compl"}):null;if(Q&&A.complemento)for(let F of En(A.complemento,i))Q.append(F.marcado?l("mark",{},F.texto):F.texto);let J=l("li",{role:"option",id:`${e}-op-${R}`,class:`spro-combo-op${R===c?" spro-combo-op-ativa":""}`,"data-valor":A.valor,"aria-selected":z?"true":"false"},o.multiplo?l("span",{class:"spro-combo-caixa","aria-hidden":"true"},z?W("check",12):null):null,A.marca?A.marca():null,A.cor?l("span",{class:"spro-combo-cor",style:`background:${A.cor}`}):null,A.icone?W(A.icone,15):null,l("span",{class:"spro-combo-op-textos"},Q?l("span",{class:"spro-combo-op-linha"},q,Q):q,A.descricao?l("span",{class:"spro-combo-op-desc"},A.descricao):null),A.contagem!==void 0?l("span",{class:"spro-combo-conta"},String(A.contagem)):null,!o.multiplo&&z?l("span",{class:"spro-combo-marca"},W("check",14)):null);return J.addEventListener("pointerdown",F=>F.preventDefault()),J.addEventListener("click",()=>{c=R,x(A)}),J.addEventListener("pointermove",()=>{c!==R&&(c=R,S())}),J}function S(){if(!s)return;let A=[...s.querySelectorAll('[role="option"]')];A.forEach((Q,J)=>{Q.classList.toggle("spro-combo-op-ativa",J===c)});let R=A[c],q=s.querySelector(".spro-combo-busca")??s.querySelector('[role="listbox"]');R?(q?.setAttribute("aria-activedescendant",R.id),R.scrollIntoView?.({block:"nearest"})):q?.removeAttribute("aria-activedescendant")}function M(){if(!s)return;let A=An(r(),i);g=A.length,p=o.limite!==void 0&&A.length>o.limite?A.slice(0,o.limite):A,u.tipo!=="pronto"&&(p=[]),c>=p.length&&(c=Math.max(0,p.length-1));let R=s.querySelector('[role="listbox"]');R.setAttribute("aria-busy",u.tipo==="carregando"?"true":"false");let z=s.querySelector(".spro-combo-extras");if(z.replaceChildren(),u.tipo==="carregando")R.replaceChildren(...[62,84,48,74].map(F=>l("li",{role:"presentation",class:"spro-combo-esqueleto","aria-hidden":"true"},l("span",{style:`width:${F}%`})))),z.append(l("p",{class:"spro-combo-nada",role:"status"},"Carregando\u2026"));else if(u.tipo==="erro"){R.replaceChildren();let F=u.tentar;if(z.append(l("p",{class:"spro-combo-nada spro-combo-falha",role:"alert"},u.mensagem)),F){let P=l("button",{type:"button",class:"spro-combo-criar spro-combo-de-novo"},W("atualizar",14),l("span",{},"Tentar de novo"));P.addEventListener("pointerdown",D=>D.preventDefault()),P.addEventListener("click",F),z.append(P)}}else{R.replaceChildren(...p.map(L));let F=i.trim();p.length||z.append(l("p",{class:"spro-combo-nada"},F?"Nada encontrado.":"Nenhuma op\xE7\xE3o."));let P=p.length?o.resumo?.(p.length,g,r().length):void 0;P&&z.append(l("p",{class:"spro-combo-resumo",role:"status"},P)),p.length<g&&z.append(l("p",{class:"spro-combo-resumo",role:"status"},`Mostrando ${p.length} de ${g}. Digite para refinar.`))}let q=i.trim(),Q=r().some(F=>xo(F.rotulo)===xo(q));if(o.criar&&q&&!Q&&u.tipo==="pronto"){let F=l("button",{type:"button",class:"spro-combo-criar"},W("mais",14),l("span",{},o.rotuloCriar?o.rotuloCriar(q):`Criar \u201C${q}\u201D`));F.addEventListener("pointerdown",P=>P.preventDefault()),F.addEventListener("click",()=>void I()),z.append(F)}let J=s.querySelector(".spro-combo-rodape");if(J){let F=p.filter(H=>!n.includes(H.valor)),P=l("button",{type:"button",class:"spro-combo-acao",disabled:!q||!F.length},`Marcar os filtrados${q&&F.length?` (${F.length})`:""}`);P.addEventListener("click",()=>{n=[...n,...F.map(H=>H.valor)],b(),f(),M()});let D=l("button",{type:"button",class:"spro-combo-acao spro-combo-limpar",disabled:!n.length},"Limpar");D.addEventListener("click",()=>{n=[],b(),f(),M()}),J.replaceChildren(l("span",{class:"spro-combo-total"},n.length?`${n.length} marcado${n.length>1?"s":""}`:""),P,D)}S()}let $=()=>d?.posicionar();function Z(A){let R=p.length,z=A.target,q=s?[...s.querySelectorAll(".spro-combo-rodape button:not(:disabled), .spro-combo-de-novo")]:[],Q=!!z?.closest?.(".spro-combo-rodape, .spro-combo-criar");if(A.key==="Tab"){let F=q.indexOf(z);if(!A.shiftKey&&F<q.length-1)q[F+1]?.focus();else if(A.shiftKey&&F>=0)F>0?q[F-1]?.focus():(s?.querySelector(".spro-combo-busca")??s?.querySelector('[role="listbox"]'))?.focus();else{X(!0);return}A.preventDefault(),A.stopPropagation();return}if(Q&&A.key!=="Escape")return;let J=!s?.querySelector(".spro-combo-busca");if(J&&A.key===" "){let F=p[c];F&&x(F),A.preventDefault(),A.stopPropagation();return}if(J&&A.key.length===1&&!A.ctrlKey&&!A.metaKey&&!A.altKey){let F=xo(A.key),D=[...p.keys()].map(H=>(c+1+H)%Math.max(1,R)).find(H=>xo(p[H]?.rotulo??"").startsWith(F));D!==void 0&&(c=D,S()),A.preventDefault(),A.stopPropagation();return}switch(A.key){case"ArrowDown":c=R?(c+1)%R:0,S();break;case"ArrowUp":c=R?(c-1+R)%R:0,S();break;case"Home":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=0,S();break;case"End":if(A.target?.classList?.contains("spro-combo-busca")&&i)return;c=Math.max(0,R-1),S();break;case"Enter":{let F=p[c];F?x(F):I();break}case"Escape":X(!0);break;case"Backspace":if(!o.multiplo||i||!n.length)return;n=n.slice(0,-1),b(),f(),M();break;default:return}A.preventDefault(),A.stopPropagation()}function K(A=""){if(s)return;i=A,c=A?0:(()=>{let Q=An(r(),i).findIndex(J=>J.valor===n[n.length-1]);return Q<0?0:Q})();let z=E()?l("input",{type:"text",class:"spro-combo-busca",placeholder:o.dicaBusca??(o.criar?"Buscar ou criar\u2026":"Buscar\u2026"),"aria-label":`Filtrar ${o.rotulo.toLowerCase()}`,"aria-controls":`${e}-lista`,"aria-autocomplete":"list",autocomplete:"off",spellcheck:"false",value:A}):null;if(z&&(z.value=A,z.addEventListener("input",()=>{i=z.value,c=0,M(),$()})),s=l("div",{class:`spro-combo-pop${o.multiplo?" spro-combo-pop-multi":""}`},z?l("div",{class:"spro-combo-cabeca"},W("busca",15),z):null,l("ul",{role:"listbox",id:`${e}-lista`,class:"spro-combo-lista",tabindex:z?void 0:"-1","aria-label":o.rotulo,"aria-multiselectable":o.multiplo?"true":void 0}),l("div",{class:"spro-combo-extras"}),o.multiplo?l("div",{class:"spro-combo-rodape"}):null),s.addEventListener("keydown",Z),d=kr(h,s,{larguraMinima:o.larguraLista??220,alturaMaxima:360,aoFechar:()=>X(!1)}),h.setAttribute("aria-expanded","true"),h.setAttribute("aria-controls",`${e}-lista`),h.classList.add("spro-combo-aberto"),M(),$(),!s)return;(z??s.querySelector('[role="listbox"]'))?.focus?.({preventScroll:!0}),z&&A&&z.setSelectionRange?.(A.length,A.length)}function X(A=!1){s&&(d?.fechar(),d=null,s=null,i="",h.setAttribute("aria-expanded","false"),h.removeAttribute("aria-controls"),h.classList.remove("spro-combo-aberto"),A&&h.focus?.({preventScroll:!0}))}return h.addEventListener("click",()=>s?X(!0):K()),h.addEventListener("keydown",A=>{s||(A.key==="ArrowDown"||A.key==="ArrowUp"?(A.preventDefault(),K()):A.key.length===1&&A.key!==" "&&!A.ctrlKey&&!A.metaKey&&!A.altKey&&E()&&(A.preventDefault(),K(A.key)))}),f(),{el:h,valor:()=>[...n],definir(A,R=!1){n=[...A],f(),M(),R&&b()},atualizar(){f(),M()},definirVazio(A){m=A,f()},definirEstado(A){u=A,f(),M(),$()},abrir:K,fechar:()=>X(!1)}}function Dn(o){let e=o.documentElement?.getAttribute("data-spro-tema");return e==="claro"||e==="escuro"?e:null}function Ft(o){let e=o.defaultView;for(let r of[".infraCorBarraSistema","#divInfraBarraSistema","#divInfraBarraSistemaE"]){let t=o.querySelector(r);if(t)try{let a=Vl(e?.getComputedStyle?.(t).backgroundColor??"");if(a)return a}catch{}}}function Fl(o){let e=/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(o);if(!e)return"#1f2328";let[r,t,a]=[e[1],e[2],e[3]].map(n=>Number.parseInt(n??"0",16));return(r*299+t*587+a*114)/1e3>140?"#1f2328":"#ffffff"}function Vl(o){let e=o.trim().toLowerCase(),r=null,t=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(e);t&&(r=[t[1],t[2],t[3]].map(m=>Number.parseInt(m??"0",16)));let a=/^rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(e);if(a){if((a[4]===void 0?1:a[4].endsWith("%")?Number.parseFloat(a[4])/100:Number.parseFloat(a[4]))<.9)return null;r=[a[1],a[2],a[3]].map(u=>Number(u))}if(!r||r.some(m=>!Number.isFinite(m)||m<0||m>255))return null;let[n,s,i]=r,c=Math.max(n,s,i),p=Math.min(n,s,i);if(c===0||(c-p)/c<.25)return null;let d=[n,s,i];for(let m=0;m<12&&Fl(Pn(d))!=="#ffffff";m++)d=d.map(u=>Math.round(u*.88));return Pn(d)}function Pn(o){return`#${o.map(e=>e.toString(16).padStart(2,"0")).join("")}`}var wn="spro-processo-estilo",Vt="";function Sn(o){Vt=o}function Bo(o){if(!Vt||o.getElementById(wn))return;let e=o.createElement("style");e.id=wn,e.textContent=Vt,(o.head??o.documentElement).append(e)}function So(o){let e=Dn(o);return e?e==="escuro":o.body?.classList.contains("dark-mode")??!1}function Qo(o,e){let r=o.defaultView?.MutationObserver??globalThis.MutationObserver;if(typeof r!="function")return()=>{};let t=new r(e);return o.documentElement&&t.observe(o.documentElement,{attributes:!0,attributeFilter:["data-spro-tema"]}),o.body&&t.observe(o.body,{attributes:!0,attributeFilter:["class"]}),()=>t.disconnect()}function ao(o,e){Bo(o.topo);let r=l("dialog",{class:"spro-dialogo spro-p-dialogo","aria-label":e.titulo});So(o.doc)&&r.setAttribute("data-tema","escuro"),r.style.width=`min(${e.largura??480}px, calc(100vw - 24px))`;let t=!1,a=l("button",{type:"button",class:"spro-botao-icone","aria-label":"Fechar (Esc)"},W("fechar",16)),n=l("div",{class:"spro-p-erro",role:"alert",hidden:!0}),s=l("div",{class:"spro-dialogo-corpo"},n,...e.conteudo);r.append(l("header",{},l("span",{class:"spro-dialogo-icone","aria-hidden":"true"},W(e.icone,18)),l("h2",{},e.titulo),a),s);let i=()=>{!t&&r.open&&r.close()};return a.addEventListener("click",i),r.addEventListener("cancel",c=>{t&&c.preventDefault()}),r.addEventListener("close",()=>{r.remove(),e.aoFechar?.()}),o.topo.body.append(r),r.showModal(),r.querySelector(".spro-dialogo-corpo :is(input:not([type=hidden]):not([type=checkbox]), textarea, select, button[role=combobox])")?.focus({preventScroll:!0}),{el:r,corpo:s,fechar:i,erro(c){n.textContent=c,n.hidden=!c},async gravar(c,p=[]){this.erro(""),t=!0,a.disabled=!0;for(let d of p)d.disabled=!0;r.setAttribute("aria-busy","true");try{let d=await c();return t=!1,r.close(),d&&co(o,d.aplicado?d.resumo:d.resumo||"Nada a alterar."),!0}catch(d){t=!1,a.disabled=!1;for(let m of p)m.disabled=!1;return r.removeAttribute("aria-busy"),this.erro(Lo(d)),!1}}}}function Nr(o,...e){o.replaceChildren(...e.filter(r=>r!=null&&r!==!1))}function Oo(o,e,r){return l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},o),e,r?l("span",{class:"spro-p-campo-dica"},r):null)}function Ao(...o){return l("div",{class:"spro-dialogo-rodape"},...o)}function Po(o,e){return l("button",{type:"button",class:"spro-botao primario",onclick:e},o)}function oe(o,e,r){let t=l("input",{type:"checkbox",class:"spro-p-interruptor"});return t.checked=e,t.addEventListener("change",()=>r(t.checked)),{el:l("label",{class:"spro-p-opcao"},t,l("span",{},o)),input:t}}function Xo(o){let e=o.opcoes??[],r=typeof o.valor=="string"?o.valor:"",t=()=>r||e.some(p=>p.valor==="")?[r]:[],a=yn({rotulo:o.rotulo,opcoes:()=>e,valor:t(),vazio:o.carregar&&!o.adiar?"Carregando\u2026":o.vazio,busca:o.busca??!0,...o.limite!==void 0?{limite:o.limite}:{},...o.resumo?{resumo:o.resumo}:{},...o.dicaBusca?{dicaBusca:o.dicaBusca}:{},classe:"spro-p-combo",larguraLista:260,aoMudar:p=>{r=p[0]??"",o.aoMudar?.(r)}}),n=o.carregar,s=null,i=()=>(s||(s=c()),s);async function c(){if(n){a.definirVazio("Carregando\u2026"),a.definirEstado({tipo:"carregando"});try{e=await n(),typeof o.valor=="function"&&(r=o.valor(e)??r),a.definir(t()),a.definirVazio(o.vazio),a.definirEstado({tipo:"pronto"})}catch(p){a.definirVazio("N\xE3o foi poss\xEDvel carregar"),a.definirEstado({tipo:"erro",mensagem:Lo(p),tentar:()=>void c()})}}}return{el:a.el,combo:a,valor:()=>r,definir(p){r=p,a.definir(t())},opcoes:()=>e,pronto:o.adiar?Promise.resolve():i(),carregarAgora:i}}function ee(o,e,r){return new Promise(t=>{let a=!1,n=l("button",{type:"button",class:"spro-botao primario perigo"},r),s=l("button",{type:"button",class:"spro-botao"},"Cancelar"),i=ao(o,{titulo:"Confirmar",icone:"alerta",largura:400,conteudo:[l("p",{class:"spro-p-pergunta"},e),Ao(s,n)],aoFechar:()=>t(a)});s.addEventListener("click",()=>i.fechar()),n.addEventListener("click",()=>{a=!0,i.fechar()})})}var To={gerado:["Processo p\xFAblico gerado","Processo restrito gerado","Processo sigiloso gerado"],recebido:"Processo recebido na unidade",remetidoPrefixo:"Processo remetido pela unidade",reabertura:"Reabertura do processo na unidade",conclusao:"Conclus\xE3o do processo na unidade",documentoGerado:"Gerado documento",documentoAssinado:"Assinado Documento"},Ul=120*1e3;function Ro(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}var re=(o,e)=>o.startsWith(Ro(e));function _r(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{1,2}):(\d{2})/.exec(o.trim());return e?`${e[3]}-${e[2]}-${e[1]}T${e[4].padStart(2,"0")}:${e[5]}:00`:""}function Cn(o){if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?$/.test(o))return null;let e=new Date(`${o.length===16?`${o}:00`:o}Z`);return Number.isNaN(e.getTime())?null:e}function pe(o){return new Date(Date.UTC(o.getFullYear(),o.getMonth(),o.getDate(),o.getHours(),o.getMinutes(),o.getSeconds()))}function Bl(o){let e=[];return o.forEach((r,t)=>{let a=Cn(r.dataISO||_r(r.data));a&&e.push({a:r,t:a,i:t,d:Ro(r.descricao)})}),e.sort((r,t)=>r.t.getTime()-t.t.getTime()||t.i-r.i)}function In(o,e){return Ro(o)===Ro(e)}function Ln(o,e,r){return In(o.unidade,e)?!o.unidadeNome||!r||Ro(o.unidadeNome)===Ro(r):!1}function Ze(o,e,r){let t=o.filter(s=>In(s.unidade,e));if(new Set(t.map(s=>s.unidadeNome?Ro(s.unidadeNome):"").filter(Boolean)).size<=1||!r)return t;let n=t.filter(s=>Ln(s,e,r));return n.length?n:t}function Gl(o,e){let r=n=>n.remetido?.getTime()??e,t=(n,s)=>n.recebido.getTime()<r(s)&&s.recebido.getTime()<r(n),a=new Map;for(let n of o)a.set(Ro(n.unidade),[...a.get(Ro(n.unidade))??[],n]);for(let[n,s]of a){let i=s.some(c=>s.some(p=>c.unidadeNome&&p.unidadeNome&&Ro(c.unidadeNome)!==Ro(p.unidadeNome)&&t(c,p)));for(let c of s)c.chave=i&&c.unidadeNome?`${n}|${Ro(c.unidadeNome)}`:n}}function Mn(o){return(o.unidadeCitada||o.descricao.replace(new RegExp(`^${To.remetidoPrefixo}`,"i"),"")).trim()}function jl(o){let e=o.nrSei?o.descricao.indexOf(o.nrSei):-1;return(e>=0?o.descricao.slice(e):o.descricao).trim()}function On(o,e){let r=Bl(o),t=[],a=[],n=[],s=[],i=(g,h)=>Ze(a,g,h)[0],c=(g,h)=>{let b=Ze(n,g,h)[0];return b?n.indexOf(b):-1},p=(g,h)=>{let{a:b}=g;if(a.some(x=>Ln(x,b.unidade,b.unidadeNome)))return;let f={unidade:b.unidade,...b.unidadeNome?{unidadeNome:b.unidadeNome}:{},chave:"",recebido:g.t,remetido:null,emCurso:!0,duracaoMs:0,inicio:h,fim:null,destinos:[],documentos:[],assinaturas:[],usuarioRecebeu:b.usuario,...b.usuarioNome?{usuarioRecebeuNome:b.usuarioNome}:{}},E=c(b.unidade,b.unidadeNome);if(E>=0){let[x]=n.splice(E,1);f.chegouEm=x.em,f.origem=x.origem}a.push(f),t.push(f)},d=(g,h,b)=>{g.remetido=h.t,g.fim=b,g.usuarioEnviou=h.a.usuario,h.a.usuarioNome&&(g.usuarioEnviouNome=h.a.usuarioNome),a.splice(a.indexOf(g),1)},m=g=>{let{a:h}=g;if(i(h.unidade,h.unidadeNome))return;let b=c(h.unidade,h.unidadeNome),f={em:g.t,unidade:h.unidade,...h.unidadeNome?{unidadeNome:h.unidadeNome}:{},origem:Mn(h),usuario:h.usuario,...h.usuarioNome?{usuarioNome:h.usuarioNome}:{}};b>=0?n[b]=f:n.push(f)};for(let g=0;g<r.length;){let h=g+1;for(;h<r.length&&r[h].t.getTime()===r[g].t.getTime();)h+=1;let b=r.slice(g,h);g=h;for(let f of b)re(f.d,To.remetidoPrefixo)&&m(f);for(let f of b)re(f.d,To.recebido)&&p(f,"recebido");for(let f of b){let{a:E,d:x}=f;if(To.gerado.some(I=>re(x,I)))p(f,"gerado");else if(re(x,To.reabertura))p(f,"reabertura");else if(re(x,To.conclusao)){let I=i(E.unidade,E.unidadeNome);I&&d(I,f,"conclusao")}else if(re(x,To.remetidoPrefixo)){let I=Mn(E),L=E.unidadeCitadaNome,S=i(I,L);if(S)d(S,f,"remessa"),S.destinos.push(E.unidade);else{let M=Ze(t,I,L).at(-1);M?.fim==="remessa"&&M.remetido&&f.t.getTime()-M.remetido.getTime()<=Ul&&!M.destinos.includes(E.unidade)&&M.destinos.push(E.unidade)}}else re(x,To.documentoGerado)?s.push({ev:f,assinado:!1}):re(x,To.documentoAssinado)&&s.push({ev:f,assinado:!0})}}for(let g of n)t.push({unidade:g.unidade,...g.unidadeNome?{unidadeNome:g.unidadeNome}:{},chave:"",recebido:g.em,remetido:null,emCurso:!0,duracaoMs:0,inicio:"remessa",fim:null,chegouEm:g.em,origem:g.origem,destinos:[],pendenteRecebimento:!0,documentos:[],assinaturas:[],usuarioEnviou:g.usuario,...g.usuarioNome?{usuarioEnviouNome:g.usuarioNome}:{}});for(let{ev:g,assinado:h}of s){let{a:b}=g,f=Ze(t.filter(I=>!I.pendenteRecebimento&&I.recebido.getTime()<=g.t.getTime()),b.unidade,b.unidadeNome),E=[...f].reverse().find(I=>I.remetido===null||g.t.getTime()<=I.remetido.getTime())??f[f.length-1];if(!E)continue;let x={...b.nrSei?{nrSei:b.nrSei}:{},...b.idDocumento?{idDocumento:b.idDocumento}:{},em:g.t,titulo:jl(b),...b.usuario?{usuario:b.usuario}:{}};(h?E.assinaturas:E.documentos).push(x)}t.sort((g,h)=>g.recebido.getTime()-h.recebido.getTime());for(let g of o){if(!g.aberto)continue;let h=Ze(t.filter(b=>!b.pendenteRecebimento),g.unidade,g.unidadeNome).at(-1);h?.fim==="remessa"&&h.remetido&&(h.enviouEm=h.remetido,h.remetido=null,h.fim=null,h.mantidoAberto=!0)}let u=pe(e).getTime();for(let g of t)g.emCurso=g.remetido===null,g.duracaoMs=Math.max(0,(g.remetido?.getTime()??u)-g.recebido.getTime());return Gl(t,u),t.sort((g,h)=>g.recebido.getTime()-h.recebido.getTime())}var zr=(o,e)=>o>0&&e-o<18e5;var Wl={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function Qe(o,e){let r=o[e],t="";for(e+=1;e<o.length;){let a=o[e];if(a==="\\"){let n=o[e+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(e+2,e+6))){t+=String.fromCharCode(parseInt(o.slice(e+2,e+6),16)),e+=6;continue}t+=Wl[n]??n,e+=2;continue}if(a===r)return[t,e+1];t+=a,e+=1}return[t,e]}function Ut(o,e){let r=[],t=e;for(;t<o.length;){let a=o[t];if(a===")")return[r,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[i,c]=Qe(o,t);r.push(i),t=c;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let i=n[1];r.push(i==="null"?null:i==="true"?!0:i==="false"?!1:Number(i)),t+=i.length;continue}let s=0;for(;t<o.length;){let i=o[t];if(i==="(")s+=1;else if(i===")"){if(s===0)break;s-=1}else if(i===","&&s===0)break;t+=1}r.push(null)}return[r,t]}function fo(o){return typeof o=="string"?Io(o):o==null?"":String(o)}var Kl=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function Jo(o){let e=new Set;for(let r of o.replace(/&amp;/g,"&").matchAll(Kl))e.add(r[0]);return[...e]}function lo(o){let e=o.indexOf("?");return new URLSearchParams(e>=0?o.slice(e+1):"")}function uo(o,e,r={}){let t=Array.isArray(o)?o:Jo(o);for(let a of t){let n=lo(a),s=n.get("acao")??"";if(!(typeof e=="string"?s!==e:!e.test(s))&&Object.entries(r).every(([i,c])=>n.get(i)===c))return a}return null}function Tn(o,e){let r=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(s=>s.getAttribute("href")??"").join(`
`),t=Jo(r).filter(s=>lo(s).get("acao")===e),n=(t.length?t:Jo(o.html).filter(s=>lo(s).get("acao")===e)).sort((s,i)=>[...lo(s).keys()].length-[...lo(i).keys()].length)[0];if(!n)throw new k("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${e}" para este usu\xE1rio.`);return n}function kn(o){let e=new Map;for(let r of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=Ut(o,r.index+r[0].length);e.set(Number(r[1]),{indice:Number(r[1]),args:t,props:{}})}for(let r of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=e.get(Number(r[1]));if(!t)continue;let[a]=Qe(o,r.index+r[0].length-1);t.props[r[2]]=a}return[...e.values()].sort((r,t)=>r.indice-t.indice)}function Nn(o){let e=[];for(let r of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=Ut(o,r.index+r[0].length);e.push({tipo:fo(t[0]),idPai:fo(t[2]),href:fo(t[3]),titulo:fo(t[5]),icone:fo(t[6]),extra:t[8]==null?void 0:fo(t[8])})}return e}function _n(o,e){let r=o.find(s=>s.tipo==="NIVEL_ACESSO"&&s.idPai===e);if(!r)return{nivel:"publico"};let[t,...a]=r.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(r.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function zn(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(e=>fo(e[1])))]}function Rn(o){return[...new Set([...o.matchAll(/onclick=\\?"([A-Za-z_]\w*)\(/g)].map(e=>e[1]))]}var Xl=/\s*\(\d{5,}\)\s*$/;function $n(o,e){return o.filter(r=>r.args[0]==="DOCUMENTO").map(r=>{let t=fo(r.args[1]),a=fo(r.args[5]),n=fo(r.args[7]),s=(r.props.src??"").replace(/&amp;/g,"&"),i=e.find(m=>m.tipo==="ASSINATURA"&&m.idPai===t),{nivel:c,hipotese:p}=_n(e,t),d=(/documento_([a-z0-9]+)\.svg/.exec(n)?.[1]??"interno").replace("cancelado","interno");return{id:t,numero:fo(r.args[15])||(/\((\d{5,})\)\s*$/.exec(a)?.[1]??""),titulo:a.replace(Xl,""),pasta:r.args[2]&&String(r.args[2]).startsWith("PASTA")?String(r.args[2]):null,externo:/documento_download_anexo/.test(s)||!/documento_interno|documento_cancelado|formulario|email/.test(n),formato:d,nivel:c,hipotese:p,assinado:!!i,assinaturas:i?i.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(n),unidadeGeradora:e.find(m=>m.tipo==="UNIDADE_GERADORA"&&m.idPai===t)?.extra,link:fo(r.args[3]).replace(/&amp;/g,"&"),src:s,acoes:Jo(r.props.acoes??""),botoes:zn(r.props.acoes??""),funcoes:Rn(r.props.acoes??"")}})}function Hn(o){return $n(kn(o.html),Nn(o.html))}function Bt(o){let e=o.html,r=kn(e),t=Nn(e),a=r.find(c=>c.args[0]==="PROCESSO");if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=fo(a.args[1]),s=_n(t,n),i=$n(r,t);return{idProcedimento:n,protocolo:fo(a.args[5])||fo(a.args[15]),tipo:fo(a.args[6]),nivel:s.nivel,hipotese:s.hipotese,marcadores:t.filter(c=>c.tipo==="MARCADOR"&&c.idPai===n).map(c=>c.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:i,acoesProcesso:Jo(a.props.acoes??""),botoesProcesso:zn(a.props.acoes??""),funcoesProcesso:Rn(a.props.acoes??""),linkProcesso:fo(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(c=>c.idPai===n),links:Jo(e),pagina:o}}async function qn(o,e,r){let t=await o.obter(e,r);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new k("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,r)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=uo(t.html,"procedimento_visualizar")&&Jo(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,r))}return Bt(t)}function ho(o,e,r){if(r){let t=o.documentos.find(a=>a.id===r);return t?uo(t.acoes,e):null}return uo(o.acoesProcesso,e)??uo(o.links,e,{id_procedimento:o.idProcedimento})}function bo(o,e,r){let t=(e??"").trim(),a=(r??"").trim();return r===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var he={publico:"0",restrito:"1"},be={0:"P\xFAblico",1:"Restrito",2:"Sigiloso"};async function xe(o,e,r,t){let a=/controlador_ajax\.php\?acao_ajax=hipotese_legal_select[^'"]*/.exec(e.pagina.html)?.[0];return a?o.ajax(Io(a),[["primeiroItemValor","null"],["primeiroItemDescricao"," "],["valorItemSelecionado",""],["staNivelAcesso",r]],{sinal:t}):e.opcoes("selHipoteseLegal").filter(n=>n.valor!=="null").map(n=>({id:n.valor,texto:n.texto}))}var Bn="\xA5",Gt="\xB1";function Fn(o){return o.map(e=>`${e.id}${Gt}${e.texto}`).join(Bn)}function Jl(o){return o?o.split(Bn).map(e=>{let[r,...t]=e.split(Gt);return{id:r,texto:t.join(Gt)}}):[]}function Vn(o){let e=[];for(let r of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))e.push([r[1],r[2]]);return e}var to=class o{constructor(e,r,t){this.http=e;this.pagina=r;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=Yl(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(e,r,t,a){let n=await e.obter(r,a);return o.de(n,t,e)}static de(e,r,t=null){let a=e.doc.querySelector(r);if(!a)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${r}).`,V(e.doc.querySelector("title")));return new o(t,e,a)}pares(){return this.campos.map(e=>[e.nome,e.valor])}valor(e){return this.campos.find(r=>r.nome===e)?.valor}tem(e){return this.elemento.querySelector(`[name="${e}"]`)!==null||this.campos.some(r=>r.nome===e)}opcoes(e){let r=this.elemento.querySelector(`select[name="${e}"], select#${Un(e)}`);return r?[...r.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??V(t),texto:V(t),selecionada:t.hasAttribute("selected")})):[]}definir(e){for(let[r,t]of Object.entries(e)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==r);continue}let a=this.campos.find(n=>n.nome===r);a?a.valor=t:this.campos.push({nome:r,valor:t})}return this}escolher(e,r){let t=this.opcoes(e),a=Mo(r),n=t.find(s=>s.valor===r)??t.find(s=>Mo(s.texto)===a)??jt(t.filter(s=>Mo(s.texto).includes(a)));if(!n)throw new k("ARGUMENTO_INVALIDO",`"${r}" n\xE3o \xE9 uma op\xE7\xE3o de ${e}.`,t.slice(0,40).map(s=>s.texto).join(" | "));return this.definir({[e]:n.valor}),n}linhas(e){return[...this.elemento.querySelectorAll(`${e} tr`)].filter(r=>r.querySelector("input[type=checkbox]"))}itensLupa(e){let r=this.hiddenDaLupa(e);return r?Jl(this.valor(r)??""):[]}definirLupa(e,r){let t=this.hiddenDaLupa(e);if(!t)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${e} n\xE3o existe nesta tela.`);return this.definir({[t]:Fn(r)}),this.campos=this.campos.filter(a=>a.nome!==e&&a.nome!==`${e}[]`),this}async enviar(e={}){if(!this.http)throw new k("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new k("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let r=this.pares();e.botao&&r.push(this.botaoDeEnvio(e.botao));let t=await this.http.enviar(this.action,r,e);if(e.sucesso&&!e.sucesso(t))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${e.operacao??"a opera\xE7\xE3o"}.`,`${V(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(e){let r=this.elemento.querySelector(`[name="${e}"]`)??jt([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return r?[r.getAttribute("name")??e,r.getAttribute("value")??V(r)??e]:[e,e]}hiddenDaLupa(e){let r=Vn(this.pagina.html).find(([t])=>t===e);return r?r[1]:null}sincronizarLupas(){for(let[e,r]of Vn(this.pagina.html)){let t=this.elemento.querySelector(`select#${Un(e)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:V(n)}));(this.valor(r)??"")||this.definir({[r]:Fn(a)}),this.campos=this.campos.filter(n=>n.nome!==e&&n.nome!==`${e}[]`)}}};function Yl(o){let e=[];for(let r of o.querySelectorAll("input, select, textarea")){let t=r.getAttribute("name");if(!t||r.hasAttribute("disabled"))continue;let a=r.tagName.toLowerCase();if(a==="input"){let n=(r.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!r.hasAttribute("checked"))continue;e.push({nome:t,valor:r.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")e.push({nome:t,valor:r.textContent??""});else{let n=[...r.querySelectorAll("option")],s=n.filter(p=>p.hasAttribute("selected")),i=r.hasAttribute("multiple"),c=s.length?s:!i&&n.length?[n[0]]:[];for(let p of c)e.push({nome:t,valor:p.getAttribute("value")??V(p)})}}return e}function Mo(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function Ae(o,e,r){let t=Mo(e),a=o.find(n=>n.id===e)??o.find(n=>Mo(n.texto)===t)??jt(o.filter(n=>Mo(n.texto).includes(t)));if(!a)throw new k("ARGUMENTO_INVALIDO",`${r} "${e}" n\xE3o encontrado(a) ou amb\xEDguo(a).`,o.slice(0,40).map(n=>n.texto).join(" | "));return a}function jt(o){return o.length===1?o[0]:void 0}function Un(o){return o.replace(/([^\w-])/g,"\\$1")}function Zl(o){let e=new Set;return o.filter(r=>!e.has(r.id)&&e.add(r.id))}function Wt(o){return o.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function Kt(o,e){let t=new RegExp(`new\\s+infraAjaxAutoCompletar\\(\\s*['"]${Wt(e)}['"]\\s*,\\s*['"][\\w-]+['"]\\s*,\\s*['"]([^'"]+)['"]`).exec(o);return t?Io(t[1]):null}function Xt(o,e){let t=new RegExp(`(\\w+)\\s*=\\s*new\\s+infraAjaxAutoCompletar\\(\\s*['"]${Wt(e)}['"]`).exec(o)?.[1];if(!t)return!1;let a=new RegExp(`\\b${Wt(t)}\\.prepararExecucao\\s*=\\s*function\\s*\\([^)]*\\)\\s*\\{([^}]*)\\}`).exec(o)?.[1];return!!a&&/encodeURIComponent\s*\(/.test(a)}async function Jt(o,e,r,t,a=!1){let n=a?encodeURIComponent(Ke(r)):r,s=await o.ajax(e,[["palavras_pesquisa",n]],{sinal:t,utf8:!0});return Zl(s.map(i=>({...i,texto:Io(i.texto)})))}function Ee(o,e){let r=e==="assunto"?"arrAssuntosNegados":"arrInteressadosNegados",t=e==="assunto"?"id_assunto":"id_contato",a=new RegExp(`${r}\\[\\d+\\]\\s*=\\s*\\{\\s*${t}\\s*:\\s*['"]([^'"]*)['"]\\s*,\\s*sigla_unidade\\s*:\\s*['"]([^'"]*)['"]`,"g"),n=new Map;for(let s of o.matchAll(a))n.set(s[1],s[2]);return n}function Ql(o){let e=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return e?e[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function op(o){let e=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",r=/infra_unidade_atual=(\d+)/.exec(e)?.[1];if(r)return r;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function or(o){let e=o.doc,r=e.querySelector("#lnkInfraUnidade"),t=e.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",s=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],i=Ql(o.html);return{host:new URL(o.url).host,versao:i,maior:Number(i.split(".")[0])||0,unidade:{id:op(o),sigla:V(r)||V(e.querySelector("#selInfraUnidades option[selected]")),nome:r?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:s.trim()}}}var ep=3e4,Rr=class{constructor(e,r=null,t){this.paginaViva=r;this.http=Xe(e,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let e=this.paginaViva?.();if(e&&e.html.includes("frmProtocoloPesquisaRapida"))return e;if(this.paginaBase)return this.paginaBase;if(e)return e;throw new k("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return or(this.base())}linkMenu(e){return Tn(this.base(),e)}async renovarBase(e){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),e),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(e,r){let t=e.trim();if(!t)throw new k("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=to.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let s=await n.enviar(r),i=lo(s.url);if(i.get("acao")!=="procedimento_trabalhar")throw new k("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let c=s.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!c)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=lo(Io(c)).get("id_procedimento")??"",m=i.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:m&&m!==d?m:void 0,linkArvore:Io(c)};return this.localizados.set(t,u),u}async arvore(e,r={}){let t=await this.localizar(e,r),a=this.arvores.get(t.idProcedimento);if(a&&!r.forcar&&Date.now()-a.quando<ep)return a.arvore;let n=await qn(this.http,t.linkArvore,r);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(e){e?this.arvores.delete(e):this.arvores.clear()}esquecer(e){this.localizados.delete(e.trim())}async ajax(e,r,t){let a=await this.http.enviar(e,r,{...t,aceitarValidacao:!0}),n=[];for(let s of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:Io(s[1]),texto:Io(s[2]).trim()});for(let s of a.html.matchAll(/<item\s+([^>]*)>/g)){let i=ve(`<i ${s[1]}></i>`).querySelector("i");n.push({id:i?.getAttribute("id")??"",texto:i?.getAttribute("descricao")??i?.getAttribute("complemento")??""})}return n.filter(s=>s.id&&s.id!=="null")}};function ye(o,e,r){let t=ho(o,e);if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}async function er(o,e,r){let t=await to.abrir(o,ye(e,"anotacao_registrar","Anota\xE7\xF5es"),"#frmAnotacaoCadastro",r),a=(t.valor("txaDescricao")??"").replace(/\r\n?/g,`
`).trim();return a?{texto:a,prioridade:t.valor("chkSinPrioridade")!==void 0}:null}var Gn=/\s*\[\s*"Reabertura"\s*:\s*"([^"]+)"\s*\]\s*$/;function Wn(o,e,r){let t=Gn.exec(r),a=r.replace(Gn,"").trim(),n={};return o&&(n.id=o),e&&(n.grupo=e),a&&(n.observacao=a),r&&(n.observacaoBruta=r),t&&(n.reabertura=t[1]),n}function rp(o){let e=[...o.doc.querySelectorAll("table")].find(c=>/Grupo/i.test(V(c.querySelector("th, tr"))||c.textContent||""));if(!e)return;let r=[...e.querySelectorAll("th")].map(c=>V(c).toLowerCase()),t=r.findIndex(c=>c.startsWith("grupo")),a=r.findIndex(c=>c.startsWith("observa"));if(t<0||a<0)return;let n=[...e.querySelectorAll("tr")].find(c=>c.querySelectorAll("td").length>a);if(!n)return null;let s=[...n.querySelectorAll("td")],i=n.querySelector("input[type=checkbox]")?.getAttribute("value")??/id_acompanhamento=(\d+)/.exec(n.innerHTML??"")?.[1]??void 0;return Wn(i||void 0,V(s[t]),V(s[a]))}async function Kn(o,e,r){let t=await o.obter(ye(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAcompanhamentoCadastro")){let n=to.de(t,"#frmAcompanhamentoCadastro"),s=n.valor("hdnIdAcompanhamento");if(!s)return null;let i=n.opcoes("selGrupoAcompanhamento").find(c=>c.valor===n.valor("selGrupoAcompanhamento")&&c.valor!=="null")?.texto??"";return Wn(s,i.trim(),(n.valor("txaObservacao")??"").trim())}let a=rp(t);if(a===void 0)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",V(t.doc.querySelector("title")));return a}function tp(o){let e=/Nos\[0\]\.html\s*=\s*(['"])/.exec(o.pagina.html);return e?Qe(o.pagina.html,e.index+e[0].length-1)[0]:""}function ap(o){if(!o.trim())return[];let e=ve(`<div id="r">${o}</div>`).getElementById("r");if(!e)return[];let r=[],t={texto:"",ancoras:[]},a=()=>{let n=t.texto.replace(/\s+/g," ").trim();n&&r.push({texto:n,ancoras:t.ancoras}),t={texto:"",ancoras:[]}};for(let n of[...e.childNodes])if(n.nodeType===1&&n.tagName==="BR")a();else if(t.texto+=n.textContent??"",n.nodeType===1&&n.classList?.contains("ancoraSigla")){let s=n;t.ancoras.push({sigla:V(s),nome:s.getAttribute("title")??s.getAttribute("alt")??""})}return a(),r}function Xn(o,e){let r=ap(tp(o)),t=[];for(let s of r){if(!s.ancoras.length)continue;if(/\bcom (?:o|os) usu.rios?\b/i.test(s.texto)){t.push({texto:s.texto,unidade:s.ancoras[1]?.sigla??"",usuario:null});continue}let c=/atribu.do para/i.test(s.texto)&&s.ancoras.length>1?s.ancoras[1]:null;t.push({texto:s.texto,unidade:s.ancoras[0].sigla,usuario:c?.sigla??null,...c?.nome?{nomeUsuario:c.nome}:{}})}let a=(e??or(o.pagina).unidade.sigla).trim().toLowerCase(),n=a?t.find(s=>s.unidade.toLowerCase()===a):t.length===1?t[0]:void 0;return{usuario:n?.usuario??null,...n?.nomeUsuario?{nomeUsuario:n.nomeUsuario}:{},unidadeAberta:!!ho(o,"procedimento_alterar"),texto:r.map(s=>s.texto).join(`
`),linhas:t}}var $r=o=>{let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?Date.UTC(Number(e[3]),Number(e[2])-1,Number(e[1]),Number(e[4]??0),Number(e[5]??0)):Number.NaN};function Jn(o,e){let r=o.filter(s=>s.unidade===e),t=s=>s.reduce((i,c)=>!i||$r(c.data)>$r(i.data)?c:i,null),a=t(r.filter(s=>s.descricao.includes("Processo inserido no bloco")));if(!a)return null;let n=t(r.filter(s=>s.descricao.includes("Processo retirado do bloco")));return n&&$r(a.data)<$r(n.data)?null:a.descricao}function Hr(o){let e=t=>!!ho(o,t),r=e("procedimento_alterar");return{anotar:e("anotacao_registrar"),acompanhar:e("acompanhamento_gerenciar"),marcar:e("andamento_marcador_gerenciar"),atribuir:e("procedimento_atribuicao_cadastrar"),alterar:r,consultar:r||e("procedimento_consultar")}}async function Yn(o,e,r){let t=await o.obter(ye(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0});if(t.doc.querySelector("#frmAndamentoMarcadorCadastro"))return[];let a=t.doc.querySelector("#tblMarcadores");if(!a){if(/Nenhum registro encontrado|sem marcador/i.test(t.doc.body?.textContent??"")||t.doc.querySelector("#frmGerenciarMarcador"))return[];throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o \xE9 a lista nem o formul\xE1rio esperados.",V(t.doc.querySelector("title")))}return[...a.querySelectorAll("tr")].filter(s=>s.querySelector("input[type=checkbox]")).map(s=>{let i=[...s.querySelectorAll("td")];return{id:s.querySelector("input[type=checkbox]")?.getAttribute("value")??"",nome:V(i[1]),texto:V(i[2]),icone:i[1]?.querySelector("img")?.getAttribute("src")??"",usuario:V(i[3]),data:V(i[4])}})}async function Zn(o,e,r){let a=(await to.abrir(o,ye(e,"procedimento_atribuicao_cadastrar","Atribuir Processo"),"#frmAtividadeAtribuir",{...r,aceitarValidacao:!0})).opcoes("selAtribuicao"),n=a.find(s=>s.selecionada&&s.valor!=="null")?.valor;return{opcoes:a.filter(s=>s.valor!=="null"&&s.texto).map(s=>({valor:s.valor,texto:s.texto})),...n?{atual:n}:{}}}async function Qn(o,e,r){let t=await o.obter(ye(e,"andamento_marcador_gerenciar","Gerenciar Marcador"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAndamentoMarcadorCadastro")){let s=uo(t.html,"andamento_marcador_cadastrar");if(!s)throw new k("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");a=await o.obter(s,{...r,aceitarValidacao:!0})}let n=a.doc.querySelector("#selMarcador");if(!n)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela de marcadores n\xE3o tem a lista de marcadores.");return[...n.querySelectorAll("option")].map(s=>({valor:s.getAttribute("value")??"",texto:V(s),icone:s.getAttribute("data-imagesrc")??void 0})).filter(s=>s.valor&&s.valor!=="null"&&s.texto).map(s=>s.icone?s:{valor:s.valor,texto:s.texto})}async function os(o,e,r){let t=await o.obter(ye(e,"acompanhamento_gerenciar","Acompanhamento Especial"),{...r,aceitarValidacao:!0}),a=t;if(!t.doc.querySelector("#frmAcompanhamentoCadastro")){let c=["acompanhamento_alterar","acompanhamento_cadastrar"].map(p=>uo(t.html,p)).find(Boolean);if(!c)throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela de acompanhamento especial n\xE3o tem o formul\xE1rio esperado.");a=await o.obter(c,{...r,aceitarValidacao:!0})}let s=to.de(a,"#frmAcompanhamentoCadastro").opcoes("selGrupoAcompanhamento"),i=s.find(c=>c.selecionada&&c.valor!=="null")?.valor;return{grupos:s.filter(c=>c.valor!=="null"&&c.texto).map(c=>({valor:c.valor,texto:c.texto})),...i?{atual:i}:{}}}async function es(o,e,r){let t=ho(e,"procedimento_alterar")??ho(e,"procedimento_consultar");if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);let a=await to.abrir(o.http,t,"#frmProcedimentoCadastro",r),n=a.opcoes("selTipoProcedimento"),s=a.opcoes("selHipoteseLegal").find(c=>c.selecionada&&c.valor!=="null")?.valor,i=n.find(c=>c.selecionada)?.valor;return{tipos:n.filter(c=>c.valor&&c.valor!=="null").map(c=>({valor:c.valor,texto:c.texto})),...i?{tipoAtual:i}:{},nivel:a.valor("rdoNivelAcesso")??"",...s?{hipoteseAtual:s}:{},interessados:a.itensLupa("selInteressadosProcedimento"),assuntos:a.itensLupa("selAssuntos"),interessadosNegados:Ee(a.pagina.html,"interessado"),assuntosNegados:Ee(a.pagina.html,"assunto"),pesquisarAssuntos:(c,p)=>jn(o,a,"hdnIdAssunto","assuntos",c,p),pesquisarContatos:(c,p)=>jn(o,a,"hdnIdInteressadoProcedimento","contatos",c,p),async hipoteses(c,p){return(await xe(o,a,c,p)).map(d=>({valor:d.id,texto:d.texto}))}}}async function jn(o,e,r,t,a,n){let s=Kt(e.pagina.html,r);if(!s)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela de altera\xE7\xE3o do processo n\xE3o tem a pesquisa de ${t}.`);return Jt(o,s,a,n,Xt(e.pagina.html,r))}var rr=class extends Error{codigo="PROCESSO_SIGILOSO";constructor(){super("Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado.")}};function Yt(o,e){o.loja.definir("blocoInterno",{estado:"pronto",dado:{descricao:Jn(e.andamentos,o.unidade.sigla),coletadoEm:e.coletadoEm},em:o.agora().getTime()})}async function Pe(o){if(o.sigiloso)return null;let e=await o.loja.lerHistorico();return e?{historico:e,vale:zr(e.coletadoEm,o.agora().getTime())}:null}async function rs(o){let e=await Pe(o);return e?.vale?(Yt(o,e.historico),!0):!1}async function De(o,e={}){if(o.sigiloso)throw new rr;let r=await Pe(o);if(r?.vale&&!e.forcar)return Yt(o,r.historico),{andamentos:r.historico.andamentos,coletadoEm:r.historico.coletadoEm,origem:"cache"};let t=r?.historico,a=await o.coletarHistorico({...e.sinal?{sinal:e.sinal}:{},...e.aoProgresso?{aoProgresso:e.aoProgresso}:{},cache:t?{hash:t.hash,total:t.total,andamentos:t.andamentos}:null});if(!a.completo)throw new Error("O hist\xF3rico veio incompleto.");let n={coletadoEm:o.agora().getTime(),hash:a.hash,total:a.total,andamentos:a.andamentos};return await o.loja.guardarHistorico(n),Yt(o,n),{andamentos:a.andamentos,coletadoEm:n.coletadoEm,origem:"rede",aproveitouCache:a.aproveitouCache}}var qr=[{id:"dia",rotulo:"Dia",pxPorDia:28},{id:"semana",rotulo:"Semana",pxPorDia:9},{id:"mes",rotulo:"M\xEAs",pxPorDia:2.2}],np=3e4,sp=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],ip=["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"],we=o=>String(o).padStart(2,"0"),cp=o=>qr.find(e=>e.id===o)?.pxPorDia??2.2,Fr=o=>`${we(o.getUTCDate())}/${we(o.getUTCMonth()+1)}/${o.getUTCFullYear()}`,Eo=o=>`${Fr(o)} ${we(o.getUTCHours())}:${we(o.getUTCMinutes())}`;function Fo(o){let e=Math.round(Math.max(0,o)/6e4);if(e<1)return"menos de 1 min";if(e<60)return`${e} min`;let r=Math.floor(e/60),t=e%60;if(r<24)return t?`${r} h ${t} min`:`${r} h`;let a=Math.floor(r/24),n=r%24;return a<30&&n?`${a} d ${n} h`:`${a} d`}var Vr=o=>Math.round(Math.max(0,o)/864e5*10)/10,ae=o=>String(o).replace(".",","),tr=o=>o.recebido.getTime()+o.duracaoMs,te=(o,e)=>e&&o?`${e} (${o})`:e??o??"",Zt=(o,e)=>e>1?`${o} ${e}x`:o;function as(o){let e=new Map,r=[...o].sort((a,n)=>a.recebido.getTime()-n.recebido.getTime());for(let a of r){let n=e.get(a.chave);n||(n={chave:a.chave,rotulo:"",sigla:a.unidade,...a.unidadeNome?{nome:a.unidadeNome}:{},passagens:[]},e.set(a.chave,n)),n.passagens.push(a)}let t=[...e.values()];for(let a of t)a.rotulo=Zt(a.sigla,a.passagens.length);return t}var ts=o=>Math.floor(o/864e5)*864e5;function Ur(o,e,r={}){let t=Number.POSITIVE_INFINITY,a=Number.NEGATIVE_INFINITY;for(let d of o)t=Math.min(t,d.recebido.getTime()),a=Math.max(a,tr(d),...d.documentos.map(m=>m.em.getTime()));if(!Number.isFinite(t)){let d=r.agora?.getTime()??0;t=d,a=d}r.agora&&o.some(d=>d.emCurso)&&(a=Math.max(a,r.agora.getTime()));let n=ts(t),s=ts(a)+864e5,i=Math.max(1,(s-n)/864e5),c=r.pxPorDia??cp(e),p=Math.min(c,np/i);return{escala:e,pxPorDia:p,origem:n,fim:s,largura:i*p,x:d=>(d-n)/864e5*p}}function ns(o,e=1e3){for(let r of qr)if(Ur(o,r.id).largura<=e)return r.id;return"mes"}function ss(o){let e=[],r=[],t=o.fim,a=(s,i,c,p)=>{let d=o.x(i);s.push({x:d,largura:Math.max(0,o.x(Math.min(c,t))-d),rotulo:p})},n=s=>new Date(s);if(o.escala==="mes")for(let s=n(o.origem).getUTCFullYear();Date.UTC(s,0,1)<t;s++)a(e,Math.max(Date.UTC(s,0,1),o.origem),Date.UTC(s+1,0,1),String(s));else{let s=n(o.origem);for(let i=s.getUTCFullYear(),c=s.getUTCMonth();Date.UTC(i,c,1)<t;){let p=Math.max(Date.UTC(i,c,1),o.origem);a(e,p,Date.UTC(i,c+1,1),`${ip[c]} de ${i}`),c+=1,c>11&&(c=0,i+=1)}}if(o.escala==="dia")for(let s=o.origem;s<t;s+=864e5)a(r,s,s+864e5,String(n(s).getUTCDate()));else if(o.escala==="semana"){let i=(n(o.origem).getUTCDay()+6)%7;for(let c=o.origem-i*864e5;c<t;c+=7*864e5){let p=n(c);a(r,Math.max(c,o.origem),c+7*864e5,`${we(p.getUTCDate())}/${we(p.getUTCMonth()+1)}`)}}else{let s=n(o.origem);for(let i=s.getUTCFullYear(),c=s.getUTCMonth();Date.UTC(i,c,1)<t;)a(r,Math.max(Date.UTC(i,c,1),o.origem),Date.UTC(i,c+1,1),sp[c]),c+=1,c>11&&(c=0,i+=1)}return{cima:e,baixo:r}}function Se(o){return o.pendenteRecebimento?"pendente":o.mantidoAberto?"mantido-aberto":o.emCurso?"em-curso":"concluida"}var Br={concluida:"Conclu\xEDda","em-curso":"Em curso",pendente:"Aguardando recebimento","mantido-aberto":"Mantido aberto"};function Me(o){return o.titulo||o.nrSei||"Documento"}var lp=8;function Qt(o){let e=[],r=Se(o);if(r==="pendente")e.push({rotulo:"Remetido em",valor:`${Eo(o.recebido)}${o.usuarioEnviou?` por ${te(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),e.push({rotulo:"Situa\xE7\xE3o",valor:"A unidade ainda n\xE3o abriu o processo"});else{if(e.push({rotulo:"Recebido em",valor:`${Eo(o.recebido)}${o.usuarioRecebeu?` por ${te(o.usuarioRecebeu,o.usuarioRecebeuNome)}`:""}`}),o.origem&&e.push({rotulo:"Veio de",valor:o.origem}),r==="mantido-aberto"&&o.enviouEm)e.push({rotulo:"Remetido em",valor:`${Eo(o.enviouEm)}${o.usuarioEnviou?` por ${te(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}, mantendo o processo aberto na unidade`});else if(o.remetido){let n=o.fim==="conclusao"?"Conclu\xEDdo em":"Remetido em";e.push({rotulo:n,valor:`${Eo(o.remetido)}${o.usuarioEnviou?` por ${te(o.usuarioEnviou,o.usuarioEnviouNome)}`:""}`})}else e.push({rotulo:"Situa\xE7\xE3o",valor:"Em curso: ainda est\xE1 na unidade"});o.destinos.length&&e.push({rotulo:"Para",valor:o.destinos.join(", ")}),e.push({rotulo:"Dura\xE7\xE3o",valor:`${Fo(o.duracaoMs)}${o.emCurso?" at\xE9 agora":""}`})}let t=o.documentos.map(n=>`${Me(n)} - ${Eo(n.em)}${n.usuario?` - ${n.usuario}`:""}`);o.assinaturas.length&&e.push({rotulo:"Assinaturas",valor:String(o.assinaturas.length)});let a=t.slice(0,lp);return t.length>a.length&&a.push(`e mais ${t.length-a.length}`),{titulo:o.unidadeNome?`${o.unidade} - ${o.unidadeNome}`:o.unidade,selo:Br[r],linhas:e,...t.length?{documentos:a}:{}}}function is(o,e){return{titulo:Me(o),linhas:[{rotulo:"Gerado em",valor:`${Eo(o.em)}${o.usuario?` por ${o.usuario}`:""}`},{rotulo:"Unidade",valor:e.unidade}]}}function cs(o){let e=Qt(o);return[`${e.titulo}: ${e.selo}`,...e.linhas.map(r=>`${r.rotulo} ${r.valor}`),o.documentos.length?`${o.documentos.length} documento(s) gerado(s)`:""].filter(Boolean).join(". ")}function Gr(o){let e=new Map;for(let t of o){let a=e.get(t.chave)??{unidade:t.unidade,chave:t.chave,ms:0,n:0,emCurso:!1};a.ms+=Math.max(0,t.duracaoMs),a.n+=1,a.emCurso||=t.emCurso,e.set(t.chave,a)}let r=[...e.values()].reduce((t,a)=>t+a.ms,0);return[...e.values()].map(t=>({unidade:t.unidade,chave:t.chave,dias:Vr(t.ms),ms:t.ms,percentual:r>0?Math.round(t.ms/r*1e3)/10:0,passagens:t.n,emCurso:t.emCurso})).sort((t,a)=>a.ms-t.ms||t.unidade.localeCompare(a.unidade,"pt-BR"))}function ar(o){if(!o.length)return{totalMs:0,corridoMs:0,unidades:0,passagens:0};let e=Number.POSITIVE_INFINITY,r=Number.NEGATIVE_INFINITY,t=0;for(let a of o)e=Math.min(e,a.recebido.getTime()),r=Math.max(r,tr(a)),t+=Math.max(0,a.duracaoMs);return{totalMs:t,corridoMs:Math.max(0,r-e),unidades:new Set(o.map(a=>a.chave)).size,passagens:o.length}}var jr=o=>Zt(o.unidade,o.passagens);function ls(o,e){let r=l("div",{class:"spro-g-dica",role:"tooltip",id:e,hidden:!0});return o.append(r),{el:r,mostrar(t,a){r.replaceChildren(l("div",{class:"spro-g-dica-titulo"},t.titulo,t.selo?l("span",{class:"spro-g-dica-selo"},t.selo):null),...t.linhas.map(n=>l("div",{class:"spro-g-dica-linha"},l("span",{class:"spro-g-dica-rotulo"},n.rotulo),l("span",{},n.valor))),...t.documentos?.length?[l("div",{class:"spro-g-dica-docs"},l("span",{class:"spro-g-dica-rotulo"},"Documentos gerados"),...t.documentos.map(n=>l("div",{},n)))]:[]),r.hidden=!1,pp(r,o,a)},ocultar(){r.hidden=!0}}}function pp(o,e,r){try{let t=e.getBoundingClientRect(),a=r.getBoundingClientRect(),n=o.offsetWidth||300,s=o.offsetHeight||120,i=a.left-t.left+a.width/2-n/2;i=Math.max(6,Math.min(i,t.width-n-6));let c=a.top-t.top-s-8;c<4&&(c=a.bottom-t.top+8),o.style.left=`${Math.round(i)}px`,o.style.top=`${Math.round(c)}px`}catch{}}function ps(o){let e=r=>{let t=/^[=+\-@\t\r]/.test(r)?`'${r}`:r;return/[;"\n\r]/.test(t)?`"${t.replace(/"/g,'""')}"`:t};return`\uFEFF${o.map(r=>r.map(e).join(";")).join(`\r
`)}`}var dp="http://www.w3.org/2000/svg",Go=150,mo=46,nr=50,de=8,sr=20,up=38,ue=6,ds=16,mp=0;function Y(o,e={},...r){let t=document.createElementNS(dp,o);for(let[a,n]of Object.entries(e))t.setAttribute(a,String(n));for(let a of r)t.append(a);return t}var po=o=>Math.round(o*10)/10,us=(o,e)=>o.length>e?`${o.slice(0,Math.max(1,e-1))}\u2026`:o;function Wr(o,e,r={}){let t=`spro-g${++mp}`,a=r.larguraAlvo!==void 0,n=as(o),s=Ur(o,e,{...r.agora?{agora:r.agora}:{}}),i=a?Ur(o,e,{pxPorDia:(r.larguraAlvo-Go-ds)/Math.max(1,(s.fim-s.origem)/864e5),...r.agora?{agora:r.agora}:{}}):s,c=Go+i.largura+ds,p=mo+Math.max(1,n.length)*nr+8,d=Y("svg",{class:`spro-g-svg${a?" estatico":""}`,viewBox:`0 0 ${po(c)} ${p}`,width:a?"100%":po(c),...a?{}:{height:p},role:"group","aria-label":`Linha do tempo do processo: ${n.length} unidade(s) e ${o.length} passagem(ns)`,"data-escala":e});d.append(Y("defs",{},Y("pattern",{id:`${t}-listra`,width:8,height:8,patternUnits:"userSpaceOnUse",patternTransform:"rotate(45)"},Y("rect",{width:8,height:8,class:"listra-fundo"}),Y("rect",{width:4,height:8,class:"listra-traco"})),Y("pattern",{id:`${t}-pontos`,width:6,height:6,patternUnits:"userSpaceOnUse"},Y("rect",{width:6,height:6,class:"pontos-fundo"}),Y("circle",{cx:3,cy:3,r:1.2,class:"pontos-ponto"}))));let m=Go,u=ss(i),g=Y("g",{class:"spro-g-corpo"});n.forEach((x,I)=>{g.append(Y("rect",{x:0,y:mo+I*nr,width:c,height:nr,class:I%2?"raia-par":"raia-impar"}))});let h=Y("g",{class:"spro-g-grade","aria-hidden":"true"});for(let x of u.baixo)h.append(Y("line",{x1:po(m+x.x),x2:po(m+x.x),y1:mo,y2:p,class:"grade"}));if(g.append(h),n.forEach((x,I)=>{let L=mo+I*nr,S=Y("g",{class:"spro-g-raia","data-raia":x.chave});for(let M of x.passagens){let $=Se(M),Z=m+i.x(M.recebido.getTime()),K=Math.max(4,i.x(tr(M))-i.x(M.recebido.getTime())),X=Y("g",{class:`spro-g-barra ${$}`,"data-situacao":$,...a?{}:{tabindex:0,role:"img"},"aria-label":cs(M)});if(X.append(Y("rect",{x:po(Z),y:L+de,width:po(K),height:sr,rx:4,class:"fundo"})),$==="em-curso")X.append(Y("rect",{x:po(Z),y:L+de,width:po(K),height:sr,rx:4,fill:`url(#${t}-listra)`,class:"padrao"}));else if($==="pendente")X.append(Y("rect",{x:po(Z),y:L+de,width:po(K),height:sr,rx:4,fill:`url(#${t}-pontos)`,class:"padrao"}));else if($==="mantido-aberto"&&M.enviouEm){let A=m+i.x(M.enviouEm.getTime());X.append(Y("rect",{x:po(A),y:L+de,width:po(Math.max(2,Z+K-A)),height:sr,rx:4,fill:`url(#${t}-listra)`,class:"padrao"})),X.append(Y("line",{x1:po(A),x2:po(A),y1:L+de-3,y2:L+de+sr+3,class:"marca-remessa"}))}if(K>=44&&X.append(Y("text",{x:po(Z+6),y:L+de+14,class:"texto-barra"},Fo(M.duracaoMs))),!a&&r.dica){let A=r.dica,R=Qt(M);X.addEventListener("pointerenter",()=>A.mostrar(R,X)),X.addEventListener("pointerleave",()=>A.ocultar()),X.addEventListener("focus",()=>A.mostrar(R,X)),X.addEventListener("blur",()=>A.ocultar())}S.append(X);for(let A of M.documentos){let R=m+i.x(A.em.getTime()),z=Y("path",{d:`M${po(R)} ${L+up-ue}l${ue} ${ue}l-${ue} ${ue}l-${ue} -${ue}z`,class:"spro-g-losango",...a?{}:{tabindex:0,role:"button"},"aria-label":`Documento ${Me(A)}, ${Eo(A.em)}. Abrir visualiza\xE7\xE3o r\xE1pida`});if(!a){let q=r.dica,Q=is(A,M);q&&(z.addEventListener("pointerenter",()=>q.mostrar(Q,z)),z.addEventListener("pointerleave",()=>q.ocultar()),z.addEventListener("focus",()=>q.mostrar(Q,z)),z.addEventListener("blur",()=>q.ocultar()));let J=()=>r.aoAbrirDocumento?.(A,M);z.addEventListener("click",J),z.addEventListener("keydown",F=>{let P=F.key;(P==="Enter"||P===" ")&&(F.preventDefault(),J())})}S.append(z)}}g.append(S)}),d.append(g),r.agora&&o.some(x=>x.emCurso)&&r.agora.getTime()>=i.origem&&r.agora.getTime()<=i.fim){let x=po(m+i.x(r.agora.getTime()));d.append(Y("g",{class:"spro-g-agora","aria-hidden":"true"},Y("line",{x1:x,x2:x,y1:mo,y2:p}),Y("text",{x:Math.min(x+4,c-40),y:mo+11},"Agora")))}let b=Y("g",{class:"spro-g-cabecalho","aria-hidden":"true"});b.append(Y("rect",{x:0,y:0,width:c,height:mo,class:"cabecalho-fundo"}));for(let x of u.cima)b.append(Y("line",{x1:po(m+x.x),x2:po(m+x.x),y1:0,y2:mo,class:"grade-forte"})),x.largura>36&&b.append(Y("text",{x:po(m+x.x+6),y:15,class:"eixo-cima"},x.rotulo));for(let x of u.baixo)x.largura>=14&&b.append(Y("text",{x:po(m+x.x+x.largura/2),y:36,class:"eixo-baixo","text-anchor":"middle"},x.rotulo));b.append(Y("line",{x1:0,x2:c,y1:mo,y2:mo,class:"grade-forte"})),d.append(b);let f=Y("g",{class:"spro-g-rotulos"});f.append(Y("rect",{x:0,y:mo,width:Go,height:p-mo,class:"rotulos-fundo"})),n.forEach((x,I)=>{let L=mo+I*nr,S=Y("text",{x:10,y:L+22,class:"rotulo-raia"},us(x.rotulo,20)),M=x.nome&&x.nome!==x.sigla?x.nome:"",$=Y("g",{"aria-label":`${x.sigla}${M?`, ${M}`:""}: ${x.passagens.length} passagem(ns)`,role:"img"},S);M&&$.append(Y("text",{x:10,y:L+37,class:"rotulo-nome"},us(M,24))),f.append($)}),f.append(Y("line",{x1:Go,x2:Go,y1:mo,y2:p,class:"grade-forte"})),d.append(f);let E=Y("g",{class:"spro-g-canto","aria-hidden":"true"},Y("rect",{x:0,y:0,width:Go,height:mo,class:"cabecalho-fundo"}),Y("text",{x:10,y:28,class:"eixo-cima"},"Unidade"),Y("line",{x1:Go,x2:Go,y1:0,y2:mo,class:"grade-forte"}),Y("line",{x1:0,x2:Go,y1:mo,y2:mo,class:"grade-forte"}));return d.append(E),n.length===0&&d.append(Y("text",{x:m+12,y:mo+28,class:"rotulo-nome"},"Sem passagens.")),d}function ms(o,e){let r=o.querySelector(".spro-g-cabecalho"),t=o.querySelector(".spro-g-rotulos"),a=o.querySelector(".spro-g-canto"),n=()=>{let s=e.scrollLeft,i=e.scrollTop;r?.setAttribute("transform",`translate(0 ${i})`),t?.setAttribute("transform",`translate(${s} 0)`),a?.setAttribute("transform",`translate(${s} ${i})`)};return e.addEventListener("scroll",n),n(),()=>e.removeEventListener("scroll",n)}var fp=["Unidade","Nome da unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o (dias)","Dura\xE7\xE3o","Recebido por","Enviado por","Veio de","Enviado para","Documentos gerados","Documentos"];function gs(o){let e=[...o].sort((t,a)=>t.recebido.getTime()-a.recebido.getTime()),r=[[...fp]];for(let t of e){let a=t.remetido??t.enviouEm??null;r.push([t.unidade,t.unidadeNome??"",Br[Se(t)],Eo(t.recebido),a?Eo(a):"",ae(Math.round(t.duracaoMs/864e5*100)/100),Fo(t.duracaoMs),t.pendenteRecebimento?"":te(t.usuarioRecebeu,t.usuarioRecebeuNome),te(t.usuarioEnviou,t.usuarioEnviouNome),t.origem??"",t.destinos.join(", "),String(t.documentos.length),t.documentos.map(n=>`${Me(n)} (${Fr(n.em)})`).join(" | ")])}return ps(r)}function vs(o){return`historico-${o.replace(/[^0-9A-Za-z.-]+/g,"_").replace(/^_+|_+$/g,"")||"processo"}.csv`}function hs(o,e,r,t="text/csv;charset=utf-8"){let a=o.defaultView??window,n=a.URL.createObjectURL(new a.Blob([r],{type:t})),s=o.createElement("a");return s.href=n,s.download=e,s.style.display="none",o.body.append(s),s.click(),s.remove(),a.setTimeout(()=>a.URL.revokeObjectURL(n),3e4),n}var gp="spro-g-impressao";function vp(o,e="mes"){let r=ar(o.passagens),t=Gr(o.passagens),a=[...o.passagens].sort((c,p)=>c.recebido.getTime()-p.recebido.getTime()),n=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Situa\xE7\xE3o","Recebido em","Enviado em","Dura\xE7\xE3o","Documentos"].map(c=>l("th",{},c)))),l("tbody",{},...a.map(c=>l("tr",{},l("td",{},c.unidade),l("td",{},Br[Se(c)]),l("td",{},Eo(c.recebido)),l("td",{},c.remetido??c.enviouEm?Eo(c.remetido??c.enviouEm):""),l("td",{},Fo(c.duracaoMs)),l("td",{},String(c.documentos.length)))))),s=l("table",{class:"spro-g-tabela"},l("thead",{},l("tr",{},...["Unidade","Dias","% do total","Passagens"].map(c=>l("th",{},c)))),l("tbody",{},...t.map(c=>l("tr",{},l("td",{},jr(c)),l("td",{},ae(c.dias)),l("td",{},`${ae(c.percentual)}%`),l("td",{},String(c.passagens)))))),i=Wr(o.passagens,e,{agora:o.agora,larguraAlvo:1e3});return l("div",{class:gp,"aria-hidden":"true"},l("h1",{},`Hist\xF3rico de tramita\xE7\xE3o - processo ${o.protocolo}`),l("p",{class:"spro-g-impressao-sub"},`${r.passagens} passagem(ns) por ${r.unidades} unidade(s); tempo corrido: ${Fo(r.corridoMs)} (${ae(Vr(r.corridoMs))} dias).${o.coletadoEm?` Hist\xF3rico coletado em ${Eo(o.coletadoEm)}.`:""}`),l("div",{class:"spro-g-impressao-grafico"},i),l("h2",{},"Passagens"),n,l("h2",{},"Tempo por unidade"),s)}function bs(o,e,r="mes"){let t=o.defaultView??window,a=vp(e,r);o.body.append(a),o.documentElement.setAttribute("data-spro-imprimindo","1");let n=()=>{a.remove(),o.documentElement.removeAttribute("data-spro-imprimindo"),t.removeEventListener("afterprint",n)};t.addEventListener("afterprint",n);try{t.print()}finally{t.setTimeout(n,3e4)}}var Kr=o=>o<6e4?"agora h\xE1 pouco":`h\xE1 ${Fo(o)}`,xs=(o,e,r)=>({andamentos:o,coletadoEm:e,passagens:On(o,r)}),bp=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function As(o){let{ctx:e}=o,r=e.sigiloso?{tipo:"sigiloso"}:{tipo:"coletando",feito:0,total:0,cancelando:!1},t=o.aba??"gantt",a=o.escala??null,n=null,s=!1,i=null,c=`spro-g-visao-${Math.floor(Math.random()*1e6)}`,p=l("div",{class:"spro-g-visao"}),d=()=>{if(r.tipo==="pronto")return r.dados;if(r.tipo==="coletando"||r.tipo==="erro"||r.tipo==="cancelado")return r.anterior};async function m(D){if(s||e.sigiloso)return;let H=d();n?.abort();let C=new AbortController;n=C,r={tipo:"coletando",feito:0,total:0,cancelando:!1,...H?{anterior:H}:{}},J();try{let O=await De(e,{sinal:C.signal,forcar:D,aoProgresso:(v,w)=>{s||n!==C||r.tipo!=="coletando"||(r={...r,feito:v,total:w},K())}});if(s||n!==C)return;r={tipo:"pronto",dados:xs(O.andamentos,O.coletadoEm,e.agora())}}catch(O){if(s||n!==C)return;O instanceof rr?r={tipo:"sigiloso"}:bp(O)||C.signal.aborted?r={tipo:"cancelado",...H?{anterior:H}:{}}:r={tipo:"erro",mensagem:Lo(O),...H?{anterior:H}:{}}}finally{n===C&&(n=null)}J()}function u(){r.tipo!=="coletando"||!n||(r={...r,cancelando:!0},J(),n.abort())}let g=l("button",{type:"button",role:"tab",id:`${c}-aba-gantt`,"aria-controls":`${c}-painel`},"Gantt"),h=l("button",{type:"button",role:"tab",id:`${c}-aba-tempo`,"aria-controls":`${c}-painel`},"Tempo por unidade"),b=l("div",{class:"spro-segmentado spro-g-abas",role:"tablist","aria-label":"Vis\xF5es do hist\xF3rico"},g,h),f=l("span",{class:"spro-g-situacao",role:"status","aria-live":"polite"}),E=l("div",{class:"spro-g-progresso"}),x=l("div",{class:"spro-g-aviso",role:"status"}),I=l("div",{class:"spro-g-painel",role:"tabpanel",id:`${c}-painel`}),L=l("button",{type:"button",class:"spro-botao"},W("atualizar",15),"Atualizar"),S=l("button",{type:"button",class:"spro-botao"},W("planilha",15),"Exportar CSV"),M=l("button",{type:"button",class:"spro-botao"},W("imprimir",15),"Imprimir"),$=l("div",{class:"spro-g-rodape"},l("span",{class:"spro-g-frescor"}),L,S,M);p.append(l("div",{class:"spro-g-topo"},b,f),E,x,I,$);let Z=(D,H=!1)=>{t=D,J(),H&&(D==="gantt"?g:h).focus()};g.addEventListener("click",()=>Z("gantt")),h.addEventListener("click",()=>Z("tempo")),b.addEventListener("keydown",D=>{let H=D.key;(H==="ArrowRight"||H==="ArrowLeft"||H==="Home"||H==="End")&&(D.preventDefault(),Z(H==="Home"?"gantt":H==="End"||t==="gantt"?"tempo":"gantt",!0))}),L.addEventListener("click",()=>void m(!0)),S.addEventListener("click",()=>{let D=d();D?.passagens.length&&(hs(e.topo,vs(e.protocolo),gs(D.passagens)),co(e,"CSV do hist\xF3rico gerado.",2500))}),M.addEventListener("click",()=>{let D=d();D?.passagens.length&&bs(e.topo,{protocolo:e.protocolo,passagens:D.passagens,agora:pe(e.agora()),coletadoEm:pe(new Date(D.coletadoEm))})});function K(){if(r.tipo!=="coletando")return;let{feito:D,total:H,cancelando:C}=r,O=C?"Cancelando a coleta\u2026":H>0?`Coletando o hist\xF3rico: p\xE1gina ${D} de ${H}`:"Coletando o hist\xF3rico\u2026",v=E.querySelector(".spro-g-prog-barra"),w=E.querySelector(".spro-g-prog-texto");if(w&&(w.textContent=O),v){let N=H>0?Math.round(D/H*100):0;v.setAttribute("aria-valuenow",String(N));let B=v.firstElementChild;B&&(B.style.width=H>0?`${N}%`:""),v.classList.toggle("indeterminado",H<=0)}}function X(){if(r.tipo!=="coletando"){E.hidden=!0,E.replaceChildren();return}E.hidden=!1;let D=l("button",{type:"button",class:"spro-botao pequeno",...r.cancelando?{disabled:!0}:{}},W("cancelar",14),"Cancelar coleta");D.addEventListener("click",u),E.replaceChildren(l("div",{class:"spro-g-prog-texto","aria-live":"polite"}),l("div",{class:"spro-g-prog-barra",role:"progressbar","aria-label":"Andamento da coleta do hist\xF3rico","aria-valuemin":"0","aria-valuemax":"100"},l("span",{})),D),K()}function A(){let D=r,H=(v,w)=>{let N=l("button",{type:"button",class:"spro-botao pequeno"},v);return N.addEventListener("click",w),N};x.className="spro-g-aviso",x.replaceChildren(),x.hidden=!0;let C=(v,w,...N)=>{x.hidden=!1,x.className=`spro-g-aviso ${v}`,x.replaceChildren(W("alerta",15),l("span",{class:"spro-g-aviso-texto"},w),...N)},O=e.agora().getTime();D.tipo==="sigiloso"?C("sigiloso","Processo sigiloso: o hist\xF3rico completo n\xE3o \xE9 coletado nem guardado pelo SEI Pro."):D.tipo==="erro"?C("erro",`N\xE3o foi poss\xEDvel coletar o hist\xF3rico. ${D.mensagem}`,H("Tentar de novo",()=>void m(!1))):D.tipo==="cancelado"?C("cancelado","Coleta cancelada.",H("Coletar de novo",()=>void m(!1))):D.tipo==="coletando"&&D.anterior&&!D.cancelando?C("desatualizado",`Mostrando o hist\xF3rico coletado ${Kr(O-D.anterior.coletadoEm)} enquanto ele \xE9 atualizado.`):D.tipo==="pronto"&&O-D.dados.coletadoEm>=18e5&&C("desatualizado",`Este hist\xF3rico foi coletado ${Kr(O-D.dados.coletadoEm)}.`,H("Atualizar agora",()=>void m(!0))),(D.tipo==="erro"||D.tipo==="cancelado")&&D.anterior&&C(D.tipo==="erro"?"erro":"cancelado",`${D.tipo==="erro"?`N\xE3o foi poss\xEDvel atualizar o hist\xF3rico. ${D.mensagem}`:"Atualiza\xE7\xE3o cancelada."} Mostrando o que foi coletado ${Kr(O-D.anterior.coletadoEm)} (desatualizado).`,H("Tentar de novo",()=>void m(!1)))}function R(){i?.(),i=null,I.replaceChildren();let D=d();if(r.tipo==="sigiloso"){I.append(l("p",{class:"spro-g-vazio"},"Nenhum dado de tramita\xE7\xE3o \xE9 lido de processo sigiloso."));return}if(!D){I.append(l("p",{class:"spro-g-vazio"},r.tipo==="coletando"?"Coletando o hist\xF3rico do processo. Isto pode levar alguns segundos em processos grandes.":"O hist\xF3rico ainda n\xE3o foi coletado."));return}if(!D.passagens.length){I.append(l("p",{class:"spro-g-vazio"},"Este processo n\xE3o tem tramita\xE7\xE3o registrada no hist\xF3rico."));return}I.setAttribute("aria-labelledby",`${c}-aba-${t}`),I.append(t==="gantt"?z(D):q(D))}function z(D){let H=pe(e.agora());a??=ns(D.passagens,980);let C=a,O=l("div",{class:"spro-g-quadro"}),v=ls(O,`${c}-dica`),w=l("div",{class:"spro-g-rolagem",tabindex:"0","aria-label":"Linha do tempo. Role para os lados e para baixo."}),N=Wr(D.passagens,C,{agora:H,dica:v,aoAbrirDocumento:(U,j)=>o.abrirDocumento(U,j)});w.append(N),O.prepend(w),i=ms(N,w),w.addEventListener("scroll",()=>v.ocultar());let B=l("div",{class:"spro-segmentado",role:"group","aria-label":"Escala de tempo"});for(let U of qr){let j=l("button",{type:"button","aria-pressed":String(U.id===C),"data-escala":U.id},U.rotulo);j.addEventListener("click",()=>{if(a===U.id)return;let io=w.scrollWidth>0?w.scrollLeft/w.scrollWidth:0;a=U.id,J();let eo=I.querySelector(".spro-g-rolagem");eo&&(eo.scrollLeft=io*eo.scrollWidth)}),B.append(j)}let y=l("button",{type:"button",class:"spro-botao pequeno"},"Ir para o mais recente");y.addEventListener("click",()=>{w.scrollLeft=w.scrollWidth});let T=l("ul",{class:"spro-g-legenda","aria-label":"Legenda"},...[["concluida","Passagem conclu\xEDda"],["em-curso","Em curso"],["pendente","Aguardando recebimento"],["mantido-aberto","Remetido, mantido aberto"]].map(([U,j])=>l("li",{},l("span",{class:`spro-g-amostra ${U}`,"aria-hidden":"true"}),j)),l("li",{},l("span",{class:"spro-g-amostra losango","aria-hidden":"true"}),"Documento gerado"));return l("div",{class:"spro-g-gantt"},l("div",{class:"spro-g-ferramentas"},B,y,T),O)}function q(D){let H=Gr(D.passagens),C=ar(D.passagens),O=Math.max(1,...H.map(v=>v.percentual));return l("div",{class:"spro-g-tempo"},l("p",{class:"spro-g-resumo"},`${C.passagens} passagem(ns) por ${C.unidades} unidade(s). Tempo corrido do processo: ${Fo(C.corridoMs)}.`),l("table",{class:"spro-g-tabela"},l("caption",{class:"spro-g-legenda-tabela"},"Tempo que o processo ficou em cada unidade, do maior para o menor"),l("thead",{},l("tr",{},l("th",{scope:"col"},"Unidade"),l("th",{scope:"col"},"Dias"),l("th",{scope:"col"},"% do total"),l("th",{scope:"col"},"Passagens"),l("th",{scope:"col","aria-hidden":"true"},""))),l("tbody",{},...H.map(v=>{let w=l("span",{class:`spro-g-barra-pct${v.emCurso?" em-curso":""}`});return w.style.width=`${Math.max(1,Math.round(v.percentual/O*100))}%`,l("tr",{},l("th",{scope:"row"},jr(v),v.emCurso?l("span",{class:"spro-g-selo-curso"},"em curso"):null),l("td",{class:"num"},ae(v.dias)),l("td",{class:"num"},`${ae(v.percentual)}%`),l("td",{class:"num"},String(v.passagens)),l("td",{class:"barra","aria-hidden":"true"},w))}))),l("p",{class:"spro-g-nota"},"Passagem em curso conta at\xE9 agora. Passagens simult\xE2neas (remessa para v\xE1rias unidades) contam cada uma na sua unidade; o percentual \xE9 sobre a soma do tempo de todas as passagens."))}function Q(){let D=d(),H=r.tipo==="coletando",C=!D?.passagens.length;L.disabled=H||r.tipo==="sigiloso",S.disabled=C,M.disabled=C;let O=$.querySelector(".spro-g-frescor");O&&(O.textContent=D?`Coletado em ${Eo(pe(new Date(D.coletadoEm)))} (${Kr(e.agora().getTime()-D.coletadoEm)})`:"")}function J(){g.setAttribute("aria-selected",String(t==="gantt")),h.setAttribute("aria-selected",String(t==="tempo")),g.setAttribute("tabindex",t==="gantt"?"0":"-1"),h.setAttribute("tabindex",t==="tempo"?"0":"-1");let D=d();f.textContent=D?.passagens.length?`${D.passagens.length} passagem(ns)`:"",X(),A(),R(),Q()}J();let F=setInterval(()=>{s||Q()},3e4);F.unref?.();let P=(async()=>{if(e.sigiloso)return;let D=await Pe(e);s||(D&&!D.vale&&(r={tipo:"coletando",feito:0,total:0,cancelando:!1,anterior:xs(D.historico.andamentos,D.historico.coletadoEm,e.agora())},J()),await m(!1))})();return{el:p,estado:()=>r,destruir(){s=!0,clearInterval(F),n?.abort(),i?.()},pronta:P}}function xp(o,e){let r=a=>a.find(n=>e.idDocumento&&n.id===e.idDocumento||e.nrSei&&n.numero===e.nrSei)??null,t=r(o.arv.documentos);return t||(o.documentos.lerDoIframe(o.doc),r(o.documentos.todos()))}function Es(o,e){let r=e.nrSei??e.titulo,t=xp(o,e);if(!t)return co(o,`O documento ${r} n\xE3o est\xE1 na \xE1rvore (foi exclu\xEDdo ou est\xE1 numa pasta fechada). Abra a pasta e tente de novo.`,6e3),!1;if(!t.src)return co(o,`O documento ${r} n\xE3o tem conte\xFAdo para visualizar${t.cancelado?" (est\xE1 cancelado)":""}.`,5e3),!1;let a=l("iframe",{class:"spro-g-documento",src:t.src,"aria-label":`Conte\xFAdo do documento ${t.numero}`});return ao(o,{titulo:`${t.titulo} (${t.numero})`,icone:"documento",largura:960,conteudo:[a]}).el.classList.add("spro-g-dialogo-doc"),!0}var ys="spro-g-dialogo";function Ps(o,e={}){let r=o.topo.querySelector(`dialog.${ys}`);if(r)return r.querySelector("[role=tab][aria-selected=true]")?.focus(),null;let t=As({ctx:o,abrirDocumento:n=>void Es(o,n),...e}),a=ao(o,{titulo:`Hist\xF3rico de tramita\xE7\xE3o - ${o.protocolo}`,icone:"gantt",largura:1180,conteudo:[t.el],aoFechar:()=>t.destruir()});return a.el.classList.add(ys),{...t,fechar:a.fechar}}function Ds(o,e){let r=()=>{e().then(t=>{if(!t){co({topo:o},"N\xE3o foi poss\xEDvel abrir o hist\xF3rico: a \xE1rvore do processo n\xE3o chegou.",5e3);return}Ps(t)}).catch(t=>console.warn("[SEI Pro] Gantt do processo:",t))};return o.addEventListener(wr,r),()=>o.removeEventListener(wr,r)}async function oa(o,e){if(o.chaves){let t=(await o.chaves()).filter(a=>a.startsWith(e));return t.length?o.obter(t):{}}let r=await o.obter(null);return Object.fromEntries(Object.entries(r).filter(([t])=>t.startsWith(e)))}var Ss=0,Ms=o=>!!o&&typeof o=="object"&&typeof o.em=="number"&&!!o.fatias&&typeof o.fatias=="object",ir=class{constructor(e,r,t){this.area=e;this.escopo=r;this.id=t}get chave(){return _t(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Ms(e)?e:null}catch{return null}}async gravar(e){if(!zt(this.escopo))return!1;try{if(JSON.stringify(e).length>65536)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return Ss+=1,await Sp(this.area,Ss%25===0),!0}};async function Sp(o,e=!1){try{if(o.chaves&&!e&&(await o.chaves()).filter(i=>i.startsWith(Tr)).length<=200)return 0;let r=await oa(o,Tr),t=Object.entries(r).filter(([,s])=>Ms(s)).map(([s,i])=>({k:s,em:i.em,bytes:JSON.stringify(i).length})).sort((s,i)=>i.em-s.em),a=[],n=0;t.forEach((s,i)=>{n+=s.bytes,(i>=200||n>2097152)&&a.push(s.k)});for(let s of Object.keys(r))t.some(i=>i.k===s)||a.push(s);return a.length&&await o.remover(a),a.length}catch{return 0}}var Cs=o=>!!o&&typeof o=="object"&&typeof o.coletadoEm=="number"&&typeof o.hash=="string"&&typeof o.total=="number"&&Array.isArray(o.andamentos),cr=class{constructor(e,r,t,a=Date.now){this.area=e;this.escopo=r;this.id=t;this.agora=a}get chave(){return $t(this.escopo,this.id)}async ler(){try{let e=(await this.area.obter(this.chave))[this.chave];return Cs(e)?e:null}catch{return null}}async gravar(e){if(!zt(this.escopo))return!1;try{if(JSON.stringify(e).length>921600)return!1;await this.area.gravar({[this.chave]:e})}catch{return!1}return await Mp(this.area,this.agora()),!0}};async function Mp(o,e){try{let r=await oa(o,Rt),t=Object.entries(r).filter(([,n])=>Cs(n)).map(([n,s])=>({k:n,em:s.coletadoEm})).sort((n,s)=>s.em-n.em),a=new Set;t.forEach((n,s)=>{(s>=12||e-n.em>864e5)&&a.add(n.k)});for(let n of Object.keys(r))t.some(s=>s.k===n)||a.add(n);return a.size&&await o.remover([...a]),a.size}catch{return 0}}var Lp=o=>o instanceof Error?o.message:typeof o=="string"?o:"Falha ao carregar.",Ce=class{sigiloso;agora;esperar;repo;repoHistorico;historico;fatias=new Map;ouvintes=new Set;emAndamento=new Map;cache=null;espelho={em:0,fatias:{}};fila=Promise.resolve();gravando=Promise.resolve();constructor(e,r,t,a={}){this.agora=a.agora??Date.now,this.repo=new ir(e,r,t),this.repoHistorico=new cr(e,r,t,this.agora),this.esperar=a.esperar??(n=>new Promise(s=>setTimeout(s,n))),this.sigiloso=a.sigiloso??!1}ler(e){return this.fatias.get(e)??{estado:"carregando",em:0}}renotificar(e){for(let r of[...this.ouvintes])try{r(e)}catch{}}definir(e,r){if(this.fatias.set(e,r),this.renotificar(e),r.estado==="pronto"&&r.dado!==void 0){let t=r.dado;this.gravando=this.gravando.then(()=>this.guardar(e,t,r.em)).catch(()=>{})}}aoMudar(e){return this.ouvintes.add(e),()=>this.ouvintes.delete(e)}carregar(e,r,t={}){let a=this.emAndamento.get(e);if(a)return a;let n=this.executar(e,r,Math.max(1,t.tentativas??2)).then(()=>this.gravando).finally(()=>this.emAndamento.delete(e));return this.emAndamento.set(e,n),n}enfileirar(e){let r=this.fila.then(e,e);return this.fila=r.catch(()=>{}),r}async executar(e,r,t){let a=this.ler(e),n={dado:a.dado,em:a.em};if(n.dado===void 0&&!this.sigiloso){let i=(await this.carregarCache())?.fatias[e];i&&(n={dado:i.dado,em:i.em})}n.dado!==void 0?this.definir(e,{estado:"desatualizado",dado:n.dado,em:n.em}):this.definir(e,{estado:"carregando",em:this.agora()});let s;for(let i=0;i<t;i++){i>0&&await this.esperar(400*i);try{let c=await r();this.definir(e,{estado:"pronto",dado:c,em:this.agora()});return}catch(c){s=c}}this.definir(e,{estado:"erro",dado:n.dado,erro:Lp(s),em:this.agora()})}async lerHistorico(){return this.sigiloso?null:(this.historico===void 0&&(this.historico=await this.repoHistorico.ler()),this.historico)}async guardarHistorico(e){this.sigiloso||(this.historico=e,await this.repoHistorico.gravar(e))}carregarCache(){return this.cache??=this.repo.ler().then(e=>(e&&(this.espelho=e),e)),this.cache}async guardar(e,r,t){this.sigiloso||(await this.carregarCache(),!this.sigiloso&&(this.espelho={em:t,fatias:{...this.espelho.fatias,[e]:{dado:r,em:t}}},await this.repo.gravar(this.espelho)))}};var ea=["responsaveis","bloco_interno","marcador","acompanhamento_especial","descricao","tipo_procedimento","nivel_acesso","interessados","assuntos","observacoes"],Op={anotacoes:"Anota\xE7\xF5es",responsaveis:"Atribui\xE7\xE3o",bloco_interno:"Bloco Interno",marcador:"Marcador",acompanhamento_especial:"Acompanhamento Especial",tipo_procedimento:"Tipo de Procedimento",nivel_acesso:"N\xEDvel de Acesso",interessados:"Interessados",assuntos:"Assuntos",observacoes:"Observa\xE7\xF5es"},ra=["Anota\xE7\xF5es","Marcador","Acompanhamento Especial","Tipo de Procedimento","Assuntos","Interessados","Atribui\xE7\xE3o","N\xEDvel de Acesso","Observa\xE7\xF5es"];function Xr(o){let e=new Set(o?.length?o:ra),r=new Set(["descricao"]);for(let[t,a]of Object.entries(Op))e.has(a)&&r.add(t);return r}var Is=new Set(["descricao","interessados","assuntos","observacoes","bloco_interno"]),ta={anotacoes:["anotacao"],responsaveis:["atribuicao"],bloco_interno:["blocoInterno"],marcador:["marcador"],acompanhamento_especial:["acompanhamento"],descricao:["dadosProcesso"],tipo_procedimento:["dadosProcesso"],nivel_acesso:["dadosProcesso"],interessados:["dadosProcesso"],assuntos:["dadosProcesso"],observacoes:["dadosProcesso"]};var aa={nota:["M3.5 2h17A1.5 1.5 0 0 1 22 3.5V14l-8 8H3.5A1.5 1.5 0 0 1 2 20.5v-17A1.5 1.5 0 0 1 3.5 2z","M22 13.4H13.4V22H14l8-8z","M21 15h-6v6z"],usuarioGravata:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2L12 17.6z","M11 13.3h2l.7 1.7-1.3 6.2-.4.4-.4-.4-1.3-6.2z"],etiquetas:["M2 3.7C2 2.8 2.8 2 3.7 2h6.1c.5 0 .9.2 1.3.5l9.4 9.4c.7.7.7 1.8 0 2.5l-5.6 5.6c-.7.7-1.8.7-2.5 0L2.5 10.6C2.2 10.2 2 9.8 2 9.3z","M7.1 5.2a1.9 1.9 0 1 0 0 3.8 1.9 1.9 0 0 0 0-3.8z","M13.6 2h2.2c.5 0 .9.2 1.3.5l5.1 5.1c.7.7.7 1.8 0 2.5l-5.3 5.3-1.6-1.6 4.7-4.7c.3-.3.3-.8 0-1.1z"],tag:["M3 4.5A1.5 1.5 0 0 1 4.5 3h6.6c.4 0 .8.2 1.1.4l8.4 8.4c.6.6.6 1.5 0 2.1l-6.6 6.6c-.6.6-1.5.6-2.1 0L3.4 12.1c-.3-.3-.4-.7-.4-1.1z","M7.8 6.1a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4z"],olho:["M12 4.2C6.6 4.2 2.4 8 .9 12c1.5 4 5.7 7.8 11.1 7.8s9.6-3.8 11.1-7.8C21.6 8 17.4 4.2 12 4.2z","M12 6.9a5.1 5.1 0 1 0 0 10.2 5.1 5.1 0 0 0 0-10.2z","M12 9.6a2.4 2.4 0 1 1 0 4.8 2.4 2.4 0 0 1 0-4.8z"],livro:["M6 2h13.5c.8 0 1.5.7 1.5 1.5V17c0 .6-.3 1.1-.8 1.3v2.4c.5.2.8.7.8 1.3 0 .8-.7 1.5-1.5 1.5H6a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z","M8 5.8h9v2.6H8z","M6 18.3h12.7V20.6H6A1.15 1.15 0 0 1 6 18.3z"],favorito:["M5.5 2h13c.8 0 1.5.7 1.5 1.5V22.3l-8-5.6-8 5.6V3.5C4 2.7 4.7 2 5.5 2z"],usuarios:["M9 3.4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z","M2 20.4c0-3.8 2.8-6.4 7-6.4s7 2.6 7 6.4v.2c0 .8-.6 1.4-1.4 1.4H3.4C2.6 22 2 21.4 2 20.6z","M17.2 4.6a3.3 3.3 0 1 1 0 6.6c-.4 0-.8-.1-1.2-.2a5.6 5.6 0 0 0 0-5.6c.4-.5.7-.8 1.2-.8z","M17.6 13.2c2.4.5 4.4 2.4 4.4 5.4v2c0 .8-.6 1.4-1.4 1.4h-2.7c.3-.4.5-.9.5-1.4v-.2c0-2.4-.8-4.4-2.1-5.8.4-.5.8-1 1.3-1.4z"],balaoPontos:["M12 2.4c-5.8 0-10.5 3.8-10.5 8.6 0 2.2 1 4.2 2.8 5.7-.2 1.5-.8 2.8-1.7 3.9-.3.3 0 .8.4.8 2.2 0 4.1-.9 5.4-1.8.9.2 1.7.3 2.6.3 5.8 0 10.5-3.9 10.5-8.9S17.8 2.4 12 2.4z","M7.4 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M12 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z","M16.6 9.7a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8z"],balao:["M4 2.5h16A2.5 2.5 0 0 1 22.5 5v10.5a2.5 2.5 0 0 1-2.5 2.5h-6.2l-5.1 4v-4H4a2.5 2.5 0 0 1-2.5-2.5V5A2.5 2.5 0 0 1 4 2.5z"],caixa:["M5.4 3h13.2c.6 0 1.2.4 1.4 1l2 7.2V19c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7.8l2-7.2c.2-.6.8-1 1.4-1z","M5.4 6.2 4.2 11.2H8.8l1 2.6h4.4l1-2.6h4.6L18.6 6.2z"],globo:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M7.6 4.8 11 4.2l1.3 2.4-1.8 1.9.5 2.4-3 1-2.4-1.4-.1-2.9z","M12.8 13.6l2.8-.7 2.6 2.2-1 4-2.6 2.8-1.4-1.4.7-3.7z"],cadeado:["M5 10h14a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 22H5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 5 10z","M7.5 10V7a4.5 4.5 0 0 1 9 0v3h-2.4V7a2.1 2.1 0 0 0-4.2 0v3z","M12 13.7a1.7 1.7 0 0 1 .8 3.2l.4 2.6h-2.4l.4-2.6a1.7 1.7 0 0 1 .8-3.2z"],semUsuario:["M12 1.6a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2z","M7.4 12.2C4.7 13.1 3 15.4 3 18.4v2.1c0 .8.7 1.5 1.5 1.5h15c.8 0 1.5-.7 1.5-1.5v-2.1c0-3-1.7-5.3-4.4-6.2-1.2 1.2-2.8 1.8-4.6 1.8s-3.4-.6-4.6-1.8z","M2.6 4.4 4 3l17.5 17.5-1.4 1.4z"],lapis:["M3 17.3V21h3.7L18.6 9.1l-3.7-3.7z","M21.5 6.2a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.7 3.7z"],lixeira:["M6 21c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8H6z","M19 4h-3.5l-1-1h-5l-1 1H5v2h14z"],mais:["M10.5 3h3v7.5H21v3h-7.5V21h-3v-7.5H3v-3h7.5z"],alerta:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M10.6 6.5h2.8v7.3h-2.8z","M10.6 15.6h2.8v2.8h-2.8z"],chevron:["M3.5 8.2 5.4 6.3 12 12.9l6.6-6.6 1.9 1.9L12 16.7z"],disquete:["M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7z","M12 12.6a3 3 0 1 0 0 6 3 3 0 0 0 0-6z","M5.5 5h8v4h-8z"],checkQuadro:["M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z","M10.4 16.9 6.2 12.7l1.4-1.4 2.8 2.8 6-6 1.4 1.4z"],calendarioMais:["M7 2h2v2h6V2h2v2h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2z","M11 10.5h2v2.5h2.5v2H13v2.5h-2V15H8.5v-2H11z"],fechar:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M8.2 9.6 9.6 8.2 12 10.6l2.4-2.4 1.4 1.4-2.4 2.4 2.4 2.4-1.4 1.4-2.4-2.4-2.4 2.4-1.4-1.4 2.4-2.4z"],lupa:["M10.5 2a8.5 8.5 0 0 1 6.7 13.7l5.4 5.4-2.1 2.1-5.4-5.4A8.5 8.5 0 1 1 10.5 2z","M10.5 5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z"],cima:["M12 3.5 4.5 11h5v9.5h5V11h5z"],baixo:["M12 20.5 4.5 13h5V3.5h5V13h5z"]};function Do(o,e=16,r=document){let t="http://www.w3.org/2000/svg",a=r.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"currentColor",stroke:"none","aria-hidden":"true",focusable:"false",class:"spro-glifo spro-icone"};for(let[i,c]of Object.entries(n))a.setAttribute(i,c);let s=r.createElementNS(t,"path");return s.setAttribute("d",aa[o].join("")),s.setAttribute("fill-rule","evenodd"),a.append(s),a}function Ie(o){return l("button",{type:"button",class:`spro-p-acao${o.perigo?" perigo":""}${o.ativa?" ativa":""}`,"aria-label":o.rotulo,"aria-pressed":o.ativa===void 0?void 0:String(o.ativa),onclick:e=>{e.preventDefault(),e.stopPropagation(),o.aoClicar()}},Do(o.icone,16))}function Tp(o,e){let r=o.ownerDocument,t=e.map(a=>typeof a=="string"?r.createTextNode(a):a);for(t.forEach((a,n)=>{let s=o.childNodes[n];s!==a&&(s&&s.nodeType===3&&a.nodeType===3&&s.textContent===a.textContent||o.insertBefore(a,s??null))});o.childNodes.length>t.length;)o.lastChild?.remove()}function Ls(o){let e=l("div",{class:"spro-p-acoes"}),r=l("div",{class:"spro-p-corpo",id:`spro-p-corpo-${o.tipo}`,role:"region","aria-label":o.titulo}),t=Do("chevron",16),a=l("button",{type:"button",class:"spro-p-alternar","aria-controls":r.id,"aria-label":`Recolher ou expandir ${o.titulo}`},t),n=l("span",{class:"spro-p-icone","aria-hidden":"true"},Do(o.icone,16)),s=l("section",{class:"spro-p-painel","data-spro-painel":o.tipo,"data-estado":"carregando"},l("header",{},l("div",{class:"spro-p-titulo"},n,l("h3",{},o.titulo)),e,a),r),i=p=>{s.toggleAttribute("data-recolhido",!p),a.setAttribute("aria-expanded",String(p)),r.hidden=!p};i(o.aberto),a.addEventListener("click",()=>{let p=s.hasAttribute("data-recolhido");i(p),o.aoAlternar(p)});let c=o.icone;return{el:s,definirAberto:i,atualizar(p,d){s.setAttribute("data-estado",p),d.icone&&d.icone!==c&&(c=d.icone,n.replaceChildren(Do(d.icone,16))),e.replaceChildren(...(d.acoes??[]).map(Ie)),Tp(r,d.corpo.filter(m=>m!=null&&m!==!1))}}}var kp="configViewFlashPanelArvorePro",Jr="optionsPro";function Yr(o,e){try{let r=o.getItem(e);return r?JSON.parse(r):null}catch{return null}}function Zr(o){let e=Yr(o,kp);if(!Array.isArray(e)||!e.length)return null;let r=e.map(t=>Array.isArray(t)?t[0]:t).filter(t=>typeof t=="string");return r.length?r:null}function Le(o){let e=Yr(o,Jr);return e&&typeof e=="object"&&!Array.isArray(e)?e:{}}function Oe(o,e){let r=Le(o)[e];if(r!=null)return r;let t=Yr(o,e);if(t!==null)return t;try{let a=o.getItem(e);return a==="enabled"||a==="disabled"?a:void 0}catch{return}}function Ts(o,e,r){let t=Le(o);t[e]=r,o.setItem(Jr,JSON.stringify(t));try{o.removeItem?.(e)}catch{}}function Qr(o){return Oe(o,"optionsFlashMenu_panelinfo")!=="disabled"}function ks(o,e){return Le(o)[`panelDadosArvorePro_${e}`]!=="hide"}function Ns(o,e,r){try{let t=Le(o);t[`panelDadosArvorePro_${e}`]=r?"visible":"hide",o.setItem(Jr,JSON.stringify(t))}catch{}}function Te(o,e){let r=Yr(o,e);if(!Array.isArray(r)||!r.length)return null;let t=r.map(a=>Array.isArray(a)?a[0]:a).filter(a=>typeof a=="string");return t.length?t:null}function lr(o,e){return Oe(o,`optionsFlashMenu_${e}`)!=="disabled"}var Os=o=>o===!0||o==="true";function _s(o){let e=Le(o);return{tramitadoNaUnidade:Os(e.panelDadosArvoreInteressados_tramiteUnidade),mesmaNatureza:Os(e.panelDadosArvoreInteressados_mesmaNatureza)}}function zs(o,e){try{let r=Le(o);r.panelDadosArvoreInteressados_tramiteUnidade=e.tramitadoNaUnidade,r.panelDadosArvoreInteressados_mesmaNatureza=e.mesmaNatureza,o.setItem(Jr,JSON.stringify(r))}catch{}}var Np=/[\u0300-\u036f]/g,et=o=>o.normalize("NFD").replace(Np,"");var pr=o=>String(o).padStart(2,"0"),ot=/(\d{1,2})\/(\d{1,2})\/(\d{4})/,Rs=/(\d{1,2}):(\d{2})/;function dr(o){let e=(o??"").replace(/\\r\\n/g,`
`).replace(/\r\n?/g,`
`).trim(),r=et(e),t=r.length===e.length?r:e,a=ot.exec(t);if(!a)return{prazo:null,texto:e};let n=Rs.exec(t.slice(a.index+a[0].length))??Rs.exec(t),s=/(^|\s)ate\s+\d{1,2}\/\d{1,2}\/\d{4}/i.test(t),i=`${a[3]}-${pr(Number(a[2]))}-${pr(Number(a[1]))}`,c=n?`${pr(Number(n[1]))}:${n[2]}`:"23:59",p=/(?:ate\s+)?\d{1,2}\/\d{1,2}\/\d{4}(?:\s+\d{1,2}:\d{2})?/i.exec(t),d=p?`${e.slice(0,p.index)} ${e.slice(p.index+p[0].length)}`.replace(/[ \t]{2,}/g," ").trim():e;return{prazo:{data:i,hora:c,vencimento:s},texto:d}}function Hs(o){let e=o.texto.trim();if(!o.prazo)return e;let[r,t,a]=o.prazo.data.split("-"),n=`${o.prazo.vencimento?"Ate ":""}${a}/${t}/${r} ${o.prazo.hora||"23:59"}`;return e?`${n}
${e}`:n}var _p=864e5;function ke(o,e){let[r,t,a]=o.data.split("-").map(Number),[n,s]=o.hora.split(":").map(Number),i=new Date(r??1970,(t??1)-1,a??1,n??23,s??59),c=new Date(e.getFullYear(),e.getMonth(),e.getDate()),p=new Date(i.getFullYear(),i.getMonth(),i.getDate()),d=Math.round((p.getTime()-c.getTime())/_p);return d===0?{rotulo:i.getTime()<e.getTime()&&o.vencimento?"venceu hoje":"hoje",nivel:i.getTime()<e.getTime()&&o.vencimento?"vencido":"atencao"}:d>0?{rotulo:d===1?"amanh\xE3":`em ${d} dias`,nivel:d<=2?"atencao":"ok"}:{rotulo:d===-1?"ontem":`h\xE1 ${-d} dias`,nivel:o.vencimento?"vencido":"atencao"}}function rt(o){let[e,r,t]=o.data.split("-");return`${t}/${r}/${e}`}function qs(o){let e=/infraArvoreAcao\("CONTROLEPRAZO","[^"]*","[^"]*","(?:[^"\\]|\\.)*",(?:null|"(?:[^"\\]|\\.)*"),"((?:[^"\\]|\\.)*)"/.exec(o);if(!e?.[1])return null;let r=/(\d{2}\/\d{2}\/\d{4})\s*\(([^)]*)\)/.exec(e[1].replace(/\\n/g," "));if(!r?.[1]||r[2]===void 0)return null;let t=r[2].toLowerCase(),a=t.startsWith("atrasado")?"vencido":t.startsWith("conclu")?"concluido":"ok";return{data:r[1],estado:r[2],nivel:a}}var me=500,Fs=/^\s*\[( |x|X)\]\s?/;function tt(o){return o.replace(/\r\n?/g,`
`).split(`
`).map(e=>{let r=Fs.exec(e);return r?{texto:e.slice(r[0].length),marca:r[1]===" "?"aberto":"feito"}:{texto:e,marca:null}})}function Vs(o){return o.map(e=>e.marca===null?e.texto:`${e.marca==="feito"?"[X]":"[ ]"} ${e.texto}`).join(`
`)}function Us(o,e){let r=tt(o),t=r[e];return!t||t.marca===null?o:(t.marca=t.marca==="aberto"?"feito":"aberto",Vs(r))}function Bs(o,e,r){let t=tt(o),a=t.slice(e,r+1),n=a.length>0&&a.every(s=>s.marca!==null);for(let s of a)s.marca=n?null:s.marca??"aberto";return Vs(t)}function at(o,e){let r=0,t=Math.min(Math.max(e,0),o.length);for(let a=0;a<t;a++)o[a]===`
`&&(r+=1);return r}function Ne(o,e){let r=0;for(let t=0;t<o.length;t++){if(r===e)return t;o[t]===`
`&&(r+=1)}return o.length}function Gs(o,e,r,t){let a=o.replace(/\r\n?/g,`
`).split(`
`);if(e<0||r>=a.length||e>r||(t===-1?e===0:r===a.length-1))return null;let n=a.slice(e,r+1);if(t===-1){let i=a[e-1];return a.splice(e-1,n.length+1,...n,i),{texto:a.join(`
`),de:e-1,ate:r-1}}let s=a[r+1];return a.splice(e,n.length+1,s,...n),{texto:a.join(`
`),de:e+1,ate:r+1}}function js(o,e){let r=Ne(o,at(o,e)),t=o.indexOf(`
`,r),a=t===-1?o.length:t,n=o.slice(r,a),s=Fs.exec(n);if(!s||e<r+s[0].length)return null;if(n.slice(s[0].length).trim()===""&&e>=a)return{texto:`${o.slice(0,r)}${o.slice(a)}`,pos:r};let c=o.slice(0,e),p=o.slice(e);return{texto:`${c}
[ ] ${p.replace(/^[ \t]+/,"")}`,pos:c.length+5}}function zp(o){let e=ot.exec(et(o));return e?`${pr(Number(e[1]))}/${pr(Number(e[2]))}/${e[3]}`:null}function Ws(o,e){let[r,t,a]=e.split("-"),n=`${a}/${t}/${r}`;return ot.test(o)?o.replace(ot,n):o.trim()?`${o.replace(/\s+$/,"")} ${n}`:n}function ur(o){let e=zp(o);if(!e)return null;let[r,t,a]=e.split("/");return`${a}-${t}-${r}`}function $o(o,e){return o.toLowerCase().includes(`(${e.toLowerCase()})`)}function Ks(o,e){return $o(o,e)?o.replace(new RegExp(`\\(${e}\\)`,"ig"),"").replace(/\s{2,}/g," ").trim():`${o} (${e})`.trim()}function $s(o){return o.replace(/\r\n?/g,`
`).split(`
`).filter(e=>e.trim().charAt(0)!=="#").map(e=>e.trim()).filter(Boolean).join(" ")}function Xs(o,e,r){return[{unidade:e,observacao:$s(o)},...r.map(a=>({unidade:a.unidade,observacao:$s(a.observacao)}))].filter(a=>a.observacao)}function Js(o){let e=/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/.exec(o);return e?`${e[3]}/${e[2]}/${e[1]} ${e[4]}:${e[5]}`:""}function Ys(o){let e=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o);return e?`${e[3]}-${e[2]}-${e[1]}T${e[4]??"00"}:${e[5]??"00"}`:""}function Zs(o,e){let r=o.trim();return e?`${r} ["Reabertura": "${e}"]`.trim().slice(0,500):r}function Qs(o,e){let r=/\s*\(atribu.do para [^)]*\)/i;return e===null?o.replace(r,""):r.test(o)?o.replace(r,` (atribu\xEDdo para ${e})`):o.replace(/(\.?)\s*$/,` (atribu\xEDdo para ${e})$1`)}function oi(o){return o.includes("(")?o.split("(").map(e=>e.trim().replace(/\)\s*$/,"").replace(")","").trim()).filter(Boolean):[o.trim()]}function Rp(o=2){return l("div",{class:"spro-p-esqueleto","aria-busy":"true","aria-label":"Carregando"},...Array.from({length:o},(e,r)=>l("span",{class:"spro-p-barra",style:r===o-1&&o>1?"width:62%":void 0})))}function ei(o,e){return l("div",{class:"spro-p-erro",role:"alert"},l("span",{class:"spro-p-erro-texto"},W("alerta",13),o||"N\xE3o foi poss\xEDvel carregar."),l("button",{type:"button",class:"spro-p-link",onclick:e},"Tentar de novo"))}function fe(o,...e){return l("div",{class:"spro-p-vazio"},o,...e)}function ne(o){return l("div",{class:"spro-p-nota"},o)}function jo(o,e,r,t=2){if(o.dado===void 0)return o.estado==="erro"?[ei(o.erro??"",e)]:[Rp(t)];let a=r(o.dado);return o.estado==="erro"?[...a,ei(o.erro?`N\xE3o foi poss\xEDvel atualizar: ${o.erro}`:"N\xE3o foi poss\xEDvel atualizar.",e)]:a}var $p={amarelo:"#fff200",amarelo_claro:"#dde134",amarelo_ouro:"#f7b431",azul:"#4285f4",azul_ceu:"#009df2",azul_marinho:"#002d9e",azul_riviera:"#205d8c",bege:"#f8d396",branco:"#ffffff",bronze:"#a56738",champagne:"#e0a076",ciano:"#00ffff",cinza:"#c0c0c0",cinza_escuro:"#527b79",laranja:"#ff5f00",lilas:"#c892d8",marrom:"#61280a",ouro:"#a7790b",prata:"#81979d",preto:"#000000",rosa:"#ff1cae",rosa_claro:"#ffa7dc",roxo:"#68339b",tijolo:"#c35107",verde:"#00ff00",verde_abacate:"#00a884",verde_agua:"#00c4ba",verde_amazonas:"#007725",verde_escuro:"#004225",verde_turquesa:"#00858a",vermelho:"#ff4545",vinho:"#633039"},ri="#9aa3ac";function Hp(o){let e=/marcador_([a-z_]+)\.(?:svg|png)/i.exec(o??"");return e?.[1]?e[1].toLowerCase():null}var ti=o=>{let e=o.length===4?`#${[...o.slice(1)].map(r=>r+r).join("")}`:o;return[1,3,5].map(r=>Number.parseInt(e.slice(r,r+2),16))};function qp(o){let[e,r,t]=ti(o).map(a=>{let n=a/255;return n<=.03928?n/12.92:((n+.055)/1.055)**2.4});return .2126*e+.7152*r+.0722*t}var Fp=o=>`#${o.map(e=>Math.round(e).toString(16).padStart(2,"0")).join("")}`;function Vp(o,e){return Fp(ti(o).map(r=>r+(255-r)*e))}function Up(o){let e=Hp(o),r=e?$p[e]:void 0;if(!r)return{nome:e,claro:ri,escuro:ri};if(e==="preto")return{nome:e,claro:r,escuro:"#d5d9de"};let t=r;for(let a=.2;qp(t)<.17&&a<=.8;a+=.1)t=Vp(r,a);return{nome:e,claro:r,escuro:t}}function _e(o,e=16,r=document){let t=Up(o),a=Do("tag",e,r);return a.setAttribute("class","spro-glifo spro-icone spro-tag"),a.setAttribute("style",`--spro-tag:${t.claro};--spro-tag-escuro:${t.escuro}`),t.nome&&a.setAttribute("data-cor",t.nome),a}function na(o){let[e="",...r]=o.split(" - ");return r.length?{login:e.trim(),nome:r.join(" - ").trim()}:{login:o.trim(),nome:""}}function ai(o){return o.map(e=>{let{login:r,nome:t}=na(e.texto);return t?{valor:e.valor,rotulo:r,complemento:t}:{valor:e.valor,rotulo:r}})}function ni(o,e=document){return o.map(r=>({valor:r.valor,rotulo:r.texto,marca:()=>_e(r.icone,16,e)}))}function mr(o){return o.map(e=>({valor:e.valor,rotulo:e.texto}))}function si(o,e,r){let t=l("div",{class:"spro-p-modal-lugar"}),a=ao(o,{titulo:e?"Editar acompanhamento especial":"Acompanhamento especial",icone:"olho",largura:520,conteudo:[t]});Bp(o,a,t,e,r)}function Bp(o,e,r,t,a){let n,s=Xo({rotulo:"Grupo",vazio:"(sem grupo)",dicaBusca:"Buscar grupo\u2026",carregar:async()=>{let g=await o.op.opcoesAcompanhamento();return n=g.atual,[{valor:"",rotulo:"(sem grupo)"},...mr(g.grupos)]},valor:()=>n}),i=l("textarea",{class:"spro-campo",rows:"3",maxlength:"450",placeholder:"Observa\xE7\xE3o"});i.value=t?t.observacao??"":a.slice(0,450);let c=o.reaberturaProgramada||!!t?.reabertura,p=oe("Reabertura programada",!!t?.reabertura,g=>d.hidden=!g),d=l("input",{type:"datetime-local",class:"spro-campo","aria-label":"Data e hora da reabertura",hidden:!t?.reabertura});d.value=t?.reabertura?Ys(t.reabertura):"";let m=Po("Salvar",()=>void u()),u=async()=>{if(c&&p.input.checked&&!d.value){e.erro("Informe a data da reabertura.");return}let g=Zs(i.value,c&&p.input.checked?Js(d.value):null);await e.gravar(()=>o.op.acompanhar({grupo:s.valor(),observacao:g}),[m])&&o.recarregar("acompanhamento")};Nr(r,c?p.el:null,c?l("div",{class:"spro-p-grade"},d):null,Oo("Grupo",s.el),Oo("Observa\xE7\xE3o",i),Ao(m))}var go=(o,e)=>o.loja.ler(e);function yo(o,e,r="",...t){return l("button",{type:"button",class:`spro-p-copiavel${r?` ${r}`:""}`,"aria-label":`Copiar: ${e}`,onclick:()=>void gn(o,e)},e,...t)}function ze(o,e){return ne(o==="consultas"?`${e}: as consultas adicionais est\xE3o desativadas nas op\xE7\xF5es do SEI Pro.`:`${e} n\xE3o est\xE1 dispon\xEDvel: o processo n\xE3o est\xE1 aberto na sua unidade.`)}var wo=(...o)=>l("div",{class:"spro-p-linha"},...o);function Gp(o,e){let r=/^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}))?/.exec(o),t=r?ke({data:`${r[3]}-${r[2]}-${r[1]}`,hora:`${r[4]??"00"}:${r[5]??"00"}`,vencimento:!1},e):null;return l("span",{class:`spro-p-chip ${t?.nivel==="vencido"?"atencao":t?.nivel??"ok"}`},W("relogio",11),`Reabertura: ${o}${t?` \xB7 ${t.rotulo}`:""}`)}var ii={tipo:"acompanhamento_especial",titulo:"Acompanhamento Especial",icone:"olho",desenhar(o){let e=go(o,"acompanhamento"),r=go(o,"dadosProcesso").dado,t=r?.disponivel?r.valor.especificacao:"",a=e.dado?.disponivel?e.dado.valor:null,n=!!e.dado?.disponivel&&!o.sigiloso;return{estado:e.estado,desenho:{acoes:n?[{icone:a?"lapis":"mais",rotulo:a?"Editar acompanhamento especial":"Incluir acompanhamento especial",aoClicar:()=>si(o,a,t)}]:[],corpo:jo(e,()=>o.recarregar("acompanhamento"),s=>{if(!s.disponivel)return[ze(s.motivo,"O acompanhamento especial")];if(!s.valor)return[fe("Sem acompanhamento especial.")];let{observacao:i,grupo:c,reabertura:p}=s.valor;return[wo(yo(o,i?`${i}${c?` (${c})`:""}`:c??"Acompanhado")),p?wo(Gp(p,o.agora())):null]})}}}};var Ho=o=>o.replace(/\r\n?/g,`
`).trim(),ci=(o,e)=>(o===null||Ho(o.texto)==="")&&(e===null||Ho(e.texto)==="")?!0:o!==null&&e!==null&&Ho(o.texto)===Ho(e.texto)&&o.prioridade===e.prioridade;function li(o,e){let r=o.doc,t=e.confirmar??((_,G)=>ee(o,_,G)),a=e.ambiente??{focoEmOutroQuadro:()=>{let _=o.topo.activeElement,G=r.defaultView?.frameElement??null;return!!_&&_.tagName==="IFRAME"&&_!==G&&_.getClientRects().length>0},ativo:()=>r.activeElement},n=e.inicial&&Ho(e.inicial.texto)?e.inicial:null,s=n?.prioridade??!1,i="editando",c=!1,p=!1,d=0,m=0,u=_=>Date.now()-_<1500,g=!1,h,b,f=l("textarea",{class:"spro-p-post-it-texto",rows:"4",maxlength:String(me),"aria-label":"Anota\xE7\xE3o",placeholder:"Escreva a anota\xE7\xE3o"});f.value=n?.texto??"";let E=l("span",{class:"spro-p-contador"}),x=l("span",{class:"spro-p-post-it-situacao",role:"status","aria-live":"polite"}),I=l("span",{class:"spro-p-post-it-aviso-texto"}),L=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Tentar de novo"),S=l("div",{class:"spro-p-post-it-aviso erro",role:"alert",hidden:!0},I,L),M=l("button",{type:"button",class:"spro-p-link spro-p-post-it-tentar"},"Usar a vers\xE3o do SEI"),$=l("div",{class:"spro-p-post-it-aviso desatualizado",role:"status",hidden:!0},l("span",{class:"spro-p-post-it-aviso-texto"},"Esta anota\xE7\xE3o mudou no SEI enquanto voc\xEA editava. Se salvar, a sua vers\xE3o substitui a do SEI."),M),Z=(_,G,oo,vo="")=>l("button",{type:"button",class:`spro-p-post-it-botao${oo?"":" so-icone"}${vo?` ${vo}`:""}`,"aria-label":_},Do(G,16),oo?l("span",{class:"spro-p-post-it-botao-texto"},oo):null),K=Z("Salvar anota\xE7\xE3o","disquete","Salvar","primario"),X=Z("Prioridade","alerta","Prioridade","prioridade");X.setAttribute("aria-pressed",String(s));let A=Z("Transformar as linhas selecionadas em checklist","checkQuadro","Checklist"),R=Z("Subir as linhas selecionadas","cima",null),z=Z("Descer as linhas selecionadas","baixo",null),q=l("input",{type:"date",class:"spro-p-post-it-data","aria-label":"Data para inserir na anota\xE7\xE3o"});q.value=ur(f.value)??"";let Q=Z("Remover anota\xE7\xE3o","lixeira",null,"perigo"),J=Z("Descartar altera\xE7\xF5es (Esc)","fechar",null),F=l("div",{class:"spro-p-post-it-barra",role:"toolbar","aria-label":"Ferramentas da anota\xE7\xE3o"},K,X,A,R,z,l("span",{class:"spro-p-post-it-data-rotulo"},Do("calendarioMais",16),q),l("span",{class:"spro-p-post-it-espaco"}),n?Q:null,J),P=l("div",{class:"spro-p-post-it spro-p-post-it-edicao","data-estado":"editando"},f,l("div",{class:"spro-p-post-it-rodape"},E,x),$,S,F),D=()=>{let _=Ho(f.value);return _!==Ho(n?.texto??"")?!0:_===""?!1:s!==(n?.prioridade??!1)},H=()=>{let _=me-f.value.length;E.textContent=_<=0?"Voc\xEA atingiu o n\xFAmero m\xE1ximo de caracteres.":`${_} caracteres restantes`},C=()=>{f.style.height="auto";let _=f.scrollHeight;_&&(f.style.height=`${_}px`)},O=()=>{H(),C()},v=(_,G="")=>{i=_,P.setAttribute("data-estado",_);let oo=_==="salvando";f.readOnly=oo;for(let vo of[K,A,R,z,Q,J,X])vo.disabled=oo;q.disabled=oo,oo?P.setAttribute("aria-busy","true"):P.removeAttribute("aria-busy"),x.textContent=oo?"Salvando\u2026":"",S.hidden=_!=="erro",I.textContent=_==="erro"?G:""},w=()=>{clearTimeout(h),r.removeEventListener("pointerdown",no,!0),r.defaultView?.removeEventListener("blur",No)},N=_=>{g||(g=!0,w(),e.aoEncerrar(_))},B=()=>({ini:f.selectionStart??f.value.length,fim:f.selectionEnd??f.value.length}),y=(_,G=_)=>{try{f.setSelectionRange(_,G)}catch{f.selectionStart=_,f.selectionEnd=G}},T=()=>{let{ini:_,fim:G}=B(),oo=at(f.value,_),vo=at(f.value,G),Co=G>_&&Ne(f.value,vo)===G&&vo>oo?vo-1:vo;return{de:oo,ate:Co}},U=async()=>{if(g||i==="salvando")return;let _=Ho(f.value).slice(0,me);if(!D()&&i!=="erro"){N({gravou:!1});return}if(_===""){if(!n){N({gravou:!1});return}c=!0;let oo=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!oo){f.focus();return}}let G=_===""?!1:s;v("salvando");try{await o.op.anotar({texto:_,prioridade:G})}catch(oo){v("erro",Lo(oo)),f.focus();return}v("editando"),n=_===""?null:{texto:_,prioridade:G},N({gravou:!0,valor:n})},j=async()=>{if(!(g||i==="salvando")){if(D()){c=!0;let _=await t("Descartar as altera\xE7\xF5es desta anota\xE7\xE3o?","Descartar");if(c=!1,!_){f.focus();return}}N({gravou:!1})}},io=async()=>{if(g||i==="salvando"||!n)return;c=!0;let _=await t("Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover");if(c=!1,!_){f.focus();return}v("salvando");try{await o.op.anotar({texto:"",prioridade:!1})}catch(G){v("erro",Lo(G));return}v("editando"),n=null,N({gravou:!0,valor:null})},eo=()=>{clearTimeout(h),h=setTimeout(()=>{if(g||c||p||i!=="editando")return;let _=a.ativo();if(_&&P.contains(_))return;let G=u(m)&&a.focoEmOutroQuadro();if(!(!u(d)&&!G)){if(!D()){N({gravou:!1});return}Ho(f.value)===""&&n||U()}},e.esperaSaidaMs??150)};f.addEventListener("input",()=>{O(),i==="erro"&&(S.hidden=!1)}),f.addEventListener("keydown",_=>{let G=_;if(G.key==="Escape"){G.preventDefault(),G.stopPropagation(),j();return}if(G.key==="Enter"&&(G.ctrlKey||G.metaKey)){G.preventDefault(),U();return}if(G.key==="Enter"&&!G.shiftKey&&!G.altKey&&!G.isComposing){let{ini:oo,fim:vo}=B();if(oo!==vo)return;let Co=js(f.value,oo);if(!Co||Co.texto.length>me)return;G.preventDefault(),f.value=Co.texto,y(Co.pos),O();return}G.altKey&&(G.key==="ArrowUp"||G.key==="ArrowDown")&&(G.preventDefault(),so(G.key==="ArrowUp"?-1:1))});let so=_=>{let{ini:G,fim:oo}=B(),{de:vo,ate:Co}=T(),_o=Gs(f.value,vo,Co,_);if(!_o)return;let Er=G-Ne(f.value,vo);f.value=_o.texto;let kt=Ne(_o.texto,_o.de);if(G===oo){let Ll=(_o.texto.split(`
`)[_o.de]??"").length;y(kt+Math.min(Er,Ll))}else y(kt,Math.max(Ne(_o.texto,_o.ate+1)-1,kt));O(),f.focus()};K.addEventListener("click",()=>void U()),J.addEventListener("click",()=>void j()),Q.addEventListener("click",()=>void io()),R.addEventListener("click",()=>so(-1)),z.addEventListener("click",()=>so(1)),X.addEventListener("click",()=>{s=!s,X.setAttribute("aria-pressed",String(s)),P.classList.toggle("prioridade",s)}),P.classList.toggle("prioridade",s),A.addEventListener("click",()=>{let{de:_,ate:G}=T();f.value=Bs(f.value,_,G).slice(0,me),O(),f.focus()}),q.addEventListener("change",()=>{q.value&&(f.value=Ws(f.value,q.value).slice(0,me),O())}),L.addEventListener("click",()=>void U()),M.addEventListener("click",()=>{let _=b??null;n=_&&Ho(_.texto)?_:null,f.value=n?.texto??"",s=n?.prioridade??!1,X.setAttribute("aria-pressed",String(s)),P.classList.toggle("prioridade",s),q.value=ur(f.value)??"",b=void 0,$.hidden=!0,P.removeAttribute("data-desatualizado"),O(),f.focus()}),P.addEventListener("pointerdown",()=>{p=!0,setTimeout(()=>{p=!1},600)});for(let _ of["pointerup","pointercancel","click"])P.addEventListener(_,()=>{p=!1});let no=_=>{P.contains(_.target)||(d=Date.now())},No=()=>{m=Date.now(),eo()};return r.addEventListener("pointerdown",no,!0),r.defaultView?.addEventListener("blur",No),P.addEventListener("keydown",_=>{_.key==="Tab"&&(d=Date.now())}),P.addEventListener("focusout",_=>{let G=_.relatedTarget;G&&P.contains(G)||eo()}),H(),v("editando"),C(),{el:P,texto:()=>f.value,prioridade:()=>s,sujo:D,fatiaMudou(_){if(g)return;let G=Ho(f.value)?{texto:Ho(f.value),prioridade:s}:null,oo=!ci(_,n)&&!ci(_,G);b=oo?_:void 0,$.hidden=!oo,P.toggleAttribute("data-desatualizado",oo)},focar(){f.focus(),y(f.value.length),C()},saiuDoFoco:eo,salvar:U,descartar:j,destruir(){g=!0,w()}}}async function sa(o,e){try{await e()}catch(r){co(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel gravar a anota\xE7\xE3o.",7e3)}o.recarregar("anotacao")}var fr=new WeakMap;function jp(o,e){fr.get(o)?.destruir(),fr.delete(o),e.gravou?(o.loja.definir("anotacao",{estado:"pronto",dado:{disponivel:!0,valor:e.valor},em:o.agora().getTime()}),o.recarregar("anotacao")):o.loja.renotificar("anotacao")}function nt(o,e){let r=fr.get(o);if(r){r.focar();return}let t=li(o,{inicial:e,aoEncerrar:a=>jp(o,a)});fr.set(o,t),o.loja.renotificar("anotacao"),t.focar()}var Wp="label.item, input, a, button, textarea",pi={tipo:"anotacoes",titulo:"Anota\xE7\xF5es",icone:"nota",desenhar(o){let e=go(o,"anotacao");if(e.dado&&!e.dado.disponivel&&e.dado.motivo==="acao")return null;let r=e.dado?.disponivel?e.dado:null,t=r?.valor??null,a=fr.get(o);return a?(a.fatiaMudou(t),{estado:e.estado,desenho:{acoes:[],corpo:[a.el]}}):{estado:e.estado,desenho:{acoes:r?t?[{icone:"alerta",rotulo:t.prioridade?"Tirar a prioridade":"Marcar como prioridade",ativa:t.prioridade,aoClicar:()=>void sa(o,()=>o.op.alternarPrioridadeDaAnotacao())},{icone:"lapis",rotulo:"Editar anota\xE7\xE3o",aoClicar:()=>nt(o,t)},{icone:"lixeira",rotulo:"Remover anota\xE7\xE3o",perigo:!0,aoClicar:()=>void ee(o,"Tem certeza que deseja remover esta anota\xE7\xE3o?","Remover").then(n=>{n&&sa(o,()=>o.op.anotar({texto:"",prioridade:!1}))})}]:[{icone:"mais",rotulo:"Adicionar anota\xE7\xE3o",aoClicar:()=>nt(o,null)}]:[],corpo:jo(e,()=>o.recarregar("anotacao"),n=>{if(!n.disponivel)return[ze(n.motivo,"As anota\xE7\xF5es")];if(!n.valor)return[l("div",{class:"spro-p-vazio"},"Sem anota\xE7\xE3o."," ",l("button",{type:"button",class:"spro-p-link",onclick:()=>nt(o,null)},"Adicionar anota\xE7\xE3o"))];let s=n.valor,{texto:i,prioridade:c}=s,p=ur(i),d=p?ke({data:p,hora:"23:59",vencimento:!0},o.agora()):null,m=tt(i).map((u,g)=>u.marca===null?l("div",{class:"spro-p-nota-linha"},u.texto||" "):l("label",{class:`spro-p-nota-linha item${u.marca==="feito"?" feito":""}`},l("input",{type:"checkbox",checked:u.marca==="feito",onchange:()=>void sa(o,()=>o.op.alternarItemDaAnotacao(g))}),l("span",{},u.texto)));return[l("div",{class:`spro-p-post-it editavel${c?" prioridade":""}`,onclick:u=>{u.target?.closest(Wp)||nt(o,s)}},c?l("span",{class:"spro-p-chip vencido"},Do("alerta",12),"prioridade"):null,...m,p&&d?l("span",{class:`spro-p-chip ${d.nivel}`},Do("calendarioMais",12),`${rt({data:p,hora:"23:59",vencimento:!0})} \xB7 ${d.rotulo}`):null)]})}}}};function di(o,e,r){let t,a=Xo({rotulo:"Usu\xE1rio da unidade",vazio:"Escolher um usu\xE1rio\u2026",dicaBusca:"Buscar por login ou nome\u2026",limite:150,resumo:(p,d,m)=>d===m?`${m} usu\xE1rios na unidade`:`${d} de ${m} usu\xE1rios`,carregar:async()=>{let{opcoes:p,atual:d}=await o.op.opcoesAtribuicao(),m=e.usuario?p.find(u=>na(u.texto).login.toLowerCase()===e.usuario?.toLowerCase())?.valor:void 0;return t=d??m,ai(p)},valor:()=>t}),n=Po("Salvar",()=>void i(a.valor(),n,s)),s=l("button",{type:"button",class:"spro-botao perigo spro-esquerda"},"Remover atribui\xE7\xE3o"),i=async(p,...d)=>{if(p===""){c.erro("Escolha um usu\xE1rio.");return}let m=p===null?void 0:a.opcoes().find(g=>g.valor===p);await c.gravar(()=>o.op.atribuir(p),d)&&r(p===null?{usuario:null}:{usuario:m?.rotulo??"",nome:m?.complemento??""})};s.addEventListener("click",()=>void i(null,n,s));let c=ao(o,{titulo:"Atribui\xE7\xE3o do processo",icone:"pessoa",conteudo:[l("div",{class:"spro-p-modal-lugar"},Oo("Atribuir para",a.el,e.usuario?`Hoje: ${e.usuario}`:void 0),Ao(e.usuario?s:null,n))]})}var ui={tipo:"responsaveis",titulo:"Atribui\xE7\xE3o",icone:"usuarioGravata",desenhar(o){let e=go(o,"atribuicao"),r=o.unidade.sigla.toLowerCase();return{estado:e.estado,desenho:{corpo:jo(e,()=>o.recarregar("atribuicao"),t=>t.linhas.length?t.linhas.map(a=>{let n=!a.usuario&&!o.sigiloso,s=t.editavel&&a.unidade.toLowerCase()===r;return wo(yo(o,a.texto),n?l("span",{class:"spro-p-chip aviso"},"n\xE3o atribu\xEDdo"):null,s?Ie({icone:"lapis",rotulo:"Editar atribui\xE7\xE3o",aoClicar:()=>di(o,a,i=>{let c=o.loja.ler("atribuicao");if(!c.dado)return;let p=c.dado.linhas.map(d=>d===a?{...d,usuario:i.usuario,nomeUsuario:i.nome,texto:Qs(d.texto,i.usuario)}:d);o.loja.definir("atribuicao",{estado:"pronto",em:o.agora().getTime(),dado:{...c.dado,linhas:p,usuario:i.usuario}})})}):null)}):[ne(t.texto||"Processo sem andamento aberto.")],1)}}}};var mi={tipo:"bloco_interno",titulo:"Bloco Interno",icone:"livro",desenhar(o){let r=go(o,"blocoInterno").dado;if(r&&zr(r.coletadoEm,o.agora().getTime()))return{estado:"pronto",desenho:{corpo:[wo(r.descricao?yo(o,r.descricao):ne("Nenhum bloco localizado."))]}};let t=l("span",{class:"spro-p-nota",hidden:!0},"N\xE3o foi poss\xEDvel carregar o hist\xF3rico do processo."),a=l("button",{type:"button",class:"spro-p-link discreto"},"Carregar do hist\xF3rico");return a.addEventListener("click",()=>{a.disabled||(a.disabled=!0,t.hidden=!0,a.textContent="Carregando\u2026",o.aoPedirHistorico((n,s)=>{a.textContent=`Carregando\u2026 p\xE1gina ${n} de ${s}`}).then(n=>{a.disabled=!1,a.textContent="Carregar do hist\xF3rico",t.hidden=n}))}),{estado:"pronto",desenho:{corpo:[l("div",{class:"spro-p-linha"},a,t)]}}}};var st=class extends Error{constructor(r,t){super(t);this.codigo=r;this.name="ErroRpc"}};function Kp(o,e){let r=e.replace(/\D/g,""),t=r?o.querySelector(`tr[id="P${r}"] a[href*="procedimento_trabalhar"]`):null;if(t)return{tipo:"linha",link:t};let a=o.querySelector("#frmProtocoloPesquisaRapida"),n=o.querySelector("#txtPesquisaRapida");return a&&n?{tipo:"pesquisa",form:a,campo:n}:null}function fi(o,e,r,t){let a=Kp(o,e);if(!a)throw new st("SEM_PESQUISA","Esta tela do SEI n\xE3o tem a pesquisa r\xE1pida para abrir o processo.");if(a.tipo==="linha")return t?o.defaultView?.open(a.link.href,"_blank","noopener"):a.link.click(),"linha";let n=a.form.getAttribute("target");a.campo.value=r,t&&a.form.setAttribute("target","_blank");try{typeof a.form.requestSubmit=="function"?a.form.requestSubmit():a.form.submit()}finally{n===null?a.form.removeAttribute("target"):a.form.setAttribute("target",n)}return"pesquisa"}var gi=Object.freeze({carregando:!1,erro:null,processos:[],total:null,completa:!1,vazia:!1}),vi=o=>o.idProcedimento??o.protocolo,it=class{constructor(e,r,t=a=>a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar."){this.buscar=e;this.aoMudar=r;this.mensagemDeErro=t}estado={...gi};versao=0;controle=null;atual(){return this.estado}iniciar(){this.controle?.abort();let e=++this.versao;this.publicar({...gi,carregando:!0}),this.carregar(0,e,[])}mais(){let e=this.estado;if(e.carregando||e.completa||e.total===null)return;let r=++this.versao;this.controle?.abort(),this.publicar({...e,carregando:!0,erro:null}),this.carregar(e.processos.length,r,e.processos)}repetir(){this.estado.total===null||!this.estado.processos.length?this.iniciar():this.mais()}parar(){this.controle?.abort(),this.versao+=1}publicar(e){this.estado=e,this.aoMudar(e)}async carregar(e,r,t){let a=new AbortController;this.controle=a;try{let n=await this.buscar(e,a.signal);if(r!==this.versao)return;let s=new Set(t.map(vi)),i=[...t,...n.processos.filter(c=>!s.has(vi(c)))];this.publicar({carregando:!1,erro:null,processos:i,total:n.total,completa:i.length>=n.total||n.processos.length===0,vazia:i.length===0})}catch(n){if(r!==this.versao||a.signal.aborted)return;this.publicar({...this.estado,carregando:!1,erro:this.mensagemDeErro(n)})}}};var Xp=o=>o===1?"1 processo":`${o} processos`;function Jp(o,e){let r=l("button",{type:"button",class:"spro-p-link spro-p-proc-num","aria-label":`Abrir o processo ${o.protocolo}`},W("pasta",14),o.protocolo);r.addEventListener("click",s=>e(o,s.ctrlKey||s.metaKey)),r.addEventListener("auxclick",s=>{s.button===1&&e(o,!0)});let t=o.unidade?o.unidadeNome&&o.unidadeNome!==o.unidade?`${o.unidade} (${o.unidadeNome})`:o.unidade:"",a=o.usuario?o.usuarioNome&&o.usuarioNome!==o.usuario?`${o.usuarioNome} (${o.usuario})`:o.usuario:"",n=[t,a,o.data].filter(Boolean);return l("li",{class:"spro-p-processo"},l("div",{class:"spro-p-processo-topo"},r,o.tipoProcesso?l("span",{class:"spro-p-chip"},o.tipoProcesso):null),n.length?l("div",{class:"spro-p-processo-meta"},...n.map(s=>l("span",{},s))):null)}function hi(o,e){let r=_s(o.armazenamento),t=oe("Tramitados na unidade",r.tramitadoNaUnidade,()=>h()),a=oe(e.tipoNome?`De mesmo tipo (${e.tipoNome})`:"De mesmo tipo",r.mesmaNatureza,()=>h());a.input.disabled=!e.tipo;let n=l("div",{class:"spro-p-nota",role:"status","aria-live":"polite"}),s=l("ul",{class:"spro-p-lista-processos","aria-label":`Processos de ${e.nome}`}),i=l("div",{class:"spro-p-processos-rodape"}),c=l("div",{class:"spro-p-modal-lugar"},n,s,i),p=ao(o,{titulo:"Processos do interessado",icone:"pessoa",largura:640,conteudo:[l("p",{class:"spro-p-interessado-nome"},e.nome),l("div",{class:"spro-p-ferramentas",role:"group","aria-label":"Filtros da pesquisa"},t.el,a.el),c]});p.el.classList.add("spro-p-dialogo-processos");let d=e.id,m=async()=>{if(d)return d;let f=await o.op.formularioDoProcesso(),E=f.interessados.find(x=>x.texto===e.nome)??f.interessados.find(x=>x.texto.startsWith(e.nome));if(!E)throw new Error("N\xE3o achei este interessado no cadastro do processo.");return d=E.id,E.id},u=(f,E)=>{try{fi(o.topo,f.idProcedimento??"",f.protocolo,E),E||p.fechar()}catch(x){co(o,x instanceof Error?x.message:"N\xE3o foi poss\xEDvel abrir o processo.",6e3)}},g=new it(async(f,E)=>o.op.processosDoInteressado({interessadoId:await m(),inicio:f,tramitadoNaUnidade:t.input.checked,...a.input.checked&&e.tipo?{tipoProcesso:e.tipo}:{}},E),f=>b(f),Ko),h=()=>{zs(o.armazenamento,{tramitadoNaUnidade:t.input.checked,mesmaNatureza:a.input.checked}),g.iniciar()};function b(f){if(c.setAttribute("aria-busy",String(f.carregando)),s.replaceChildren(...f.processos.map(E=>Jp(E,u))),i.replaceChildren(),f.carregando&&!f.processos.length){n.textContent="Pesquisando os processos do interessado\u2026",s.append(l("li",{class:"spro-p-esqueleto","aria-hidden":"true"},l("span",{class:"spro-p-barra"}),l("span",{class:"spro-p-barra",style:"width:62%"})));return}if(f.erro&&!f.processos.length){n.replaceChildren();let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>g.repetir()),i.append(l("div",{class:"spro-p-erro",role:"alert"},W("alerta",13),` ${f.erro} `,E));return}if(f.vazia){n.textContent="Nenhum processo encontrado. A pesquisa s\xF3 traz os que voc\xEA pode ver.";return}if(n.textContent=f.total===null?"":`${f.processos.length} de ${Xp(f.total)}.`,f.erro){let E=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");E.addEventListener("click",()=>g.repetir()),i.append(l("div",{class:"spro-p-erro",role:"alert"},W("alerta",13),` ${f.erro} `,E))}else if(!f.completa){let E=l("button",{type:"button",class:"spro-botao"},f.carregando?"Carregando\u2026":`Mais resultados (${(f.total??0)-f.processos.length} restantes)`);E.disabled=f.carregando,E.addEventListener("click",()=>g.mais()),i.append(E)}}p.el.addEventListener("close",()=>g.parar()),g.iniciar()}var ct=class{constructor(e,r=new Map){this.negados=r;this.atuais=[...e]}atuais;novos=[];retirados=new Set;linhas(){let e=r=>{let t=this.negados.get(r);return t===void 0?{}:{negadoPor:t}};return[...this.atuais.map(r=>({item:r,estado:this.retirados.has(r.id)?"retirado":"atual",...e(r.id)})),...this.novos.map(r=>({item:r,estado:"novo"}))]}tem(e){return this.novos.some(r=>r.id===e)||this.atuais.some(r=>r.id===e)&&!this.retirados.has(e)}adicionar(e){return this.tem(e.id)?!1:this.atuais.some(r=>r.id===e.id)?(this.retirados.delete(e.id),!0):(this.novos.push({id:e.id,texto:e.texto}),!0)}alternarRetirada(e){return!this.atuais.some(r=>r.id===e)||this.negados.has(e)?!1:(this.retirados.has(e)?this.retirados.delete(e):this.retirados.add(e),!0)}removerNovo(e){let r=this.novos.findIndex(t=>t.id===e);return r<0?!1:(this.novos.splice(r,1),!0)}resultado(){return[...this.atuais.filter(e=>!this.retirados.has(e.id)),...this.novos]}mudou(){return this.retirados.size>0||this.novos.length>0}contagem(){return{atuais:this.atuais.length-this.retirados.size,retirados:this.retirados.size,novos:this.novos.length}}};var bi=o=>o.replace(/\s+/g," ").trim(),lt=class{constructor(e){this.o=e;this.minimo=e.minimo??3,this.esperaMs=e.esperaMs??350}versao=0;controle=null;minimo;esperaMs;digitou(e){let r=bi(e),t=this.cancelar();if(!r)return this.o.aoMudar({tipo:"ocioso"});if(r.length<this.minimo)return this.o.aoMudar({tipo:"curto",falta:this.minimo-r.length});(this.o.esperar??(n=>new Promise(s=>setTimeout(s,n))))(this.esperaMs).then(()=>{t===this.versao&&this.executar(r,t)})}agora(e){let r=bi(e),t=this.cancelar();if(r.length<this.minimo)return this.o.aoMudar(r?{tipo:"curto",falta:this.minimo-r.length}:{tipo:"ocioso"});this.executar(r,t)}repetir(e){this.agora(e)}parar(){this.cancelar()}cancelar(){return this.controle?.abort(),this.controle=null,++this.versao}async executar(e,r){let t=new AbortController;this.controle=t,this.o.aoMudar({tipo:"pesquisando",termo:e});try{let a=await this.o.pesquisar(e,t.signal);if(r!==this.versao)return;this.o.aoMudar(a.length?{tipo:"resultado",termo:e,itens:a}:{tipo:"vazio",termo:e})}catch(a){if(r!==this.versao||t.signal.aborted)return;this.o.aoMudar({tipo:"erro",termo:e,mensagem:this.o.mensagemDeErro?.(a)??(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel pesquisar.")})}}};var Yp=o=>{let e=[];return o.novos&&e.push(`${o.novos} a acrescentar`),o.retirados&&e.push(`${o.retirados} a retirar`),e.join(", ")};function ia(o,e){let r=l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),t=ao(o,{titulo:e.titulo,icone:e.icone,largura:560,conteudo:[r]}),a=s=>{let i=new ct(s.atuais,s.negados),c=l("h3",{class:"spro-p-lupa-titulo"}),p=l("ul",{class:"spro-p-lista-modal","aria-label":`${e.nomePlural} no processo`}),d=l("input",{type:"search",class:"spro-campo",autocomplete:"off","aria-label":`Pesquisar ${e.nome} para adicionar`,"aria-controls":"spro-p-lupa-resultados",placeholder:"Pesquisar\u2026"}),m=l("div",{class:"spro-p-nota spro-p-lupa-estado",role:"status","aria-live":"polite"}),u=l("ul",{class:"spro-p-lista-modal spro-p-resultados",id:"spro-p-lupa-resultados","aria-label":"Resultados da pesquisa"}),g=l("span",{class:"spro-p-nota spro-p-lupa-situacao","aria-live":"polite"}),h=Po("Salvar",()=>void L()),b={tipo:"ocioso"},f=()=>{let S=i.linhas(),M=i.contagem();c.textContent=`No processo (${M.atuais+M.novos})`,p.replaceChildren(...S.length?S.map($=>{let Z;if($.negadoPor)Z=l("span",{class:"spro-p-chip"},`Acrescentado por ${$.negadoPor}`);else{let K=l("button",$.estado==="novo"?{type:"button",class:"spro-p-acao perigo","aria-label":`Desfazer a inclus\xE3o de ${$.item.texto}`}:{type:"button",class:"spro-p-acao perigo","aria-pressed":String($.estado==="retirado"),"aria-label":`${$.estado==="retirado"?"Manter":"Retirar"} ${$.item.texto}`},$.estado==="novo"?"Desfazer":$.estado==="retirado"?"Manter":"Retirar");K.addEventListener("click",()=>{$.estado==="novo"?i.removerNovo($.item.id):i.alternarRetirada($.item.id),x()}),Z=K}return l("li",{class:"spro-p-linha-modal","data-estado":$.estado},$.estado==="novo"?l("span",{class:"spro-p-chip ok"},"Novo"):null,l("span",{class:"spro-p-texto-modal"},$.item.texto),Z)}):[l("li",{class:"spro-p-vazio"},`O processo n\xE3o tem ${e.nomePlural}.`)]),h.disabled=!i.mudou(),g.textContent=Yp(M)},E=S=>{if(b=S,u.replaceChildren(),u.removeAttribute("aria-busy"),S.tipo==="ocioso")m.textContent=e.dica;else if(S.tipo==="curto")m.textContent=`Digite mais ${S.falta===1?"1 letra":`${S.falta} letras`} para pesquisar.`;else if(S.tipo==="pesquisando")m.textContent="Pesquisando\u2026",u.setAttribute("aria-busy","true");else if(S.tipo==="vazio")m.textContent=`Nenhum resultado para \u201C${S.termo}\u201D.`;else if(S.tipo==="erro"){let M=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");M.addEventListener("click",()=>I.repetir(d.value)),m.replaceChildren(W("alerta",13),` ${S.mensagem} `,M)}else{m.textContent=S.itens.length===1?"1 resultado.":`${S.itens.length} resultados.`;for(let M of S.itens){let $=i.tem(M.id),Z=l("button",{type:"button",class:"spro-p-acao","aria-label":$?`${M.texto} (j\xE1 est\xE1 no processo)`:`Adicionar ${M.texto}`},$?"No processo":"Adicionar");Z.disabled=$,Z.addEventListener("click",()=>{i.adicionar(M)&&(x(),E(b),u.querySelector("button:not([disabled])")?.focus())}),u.append(l("li",{class:"spro-p-linha-modal"},l("span",{class:"spro-p-texto-modal"},M.texto),Z))}return}},x=()=>f(),I=new lt({pesquisar:s.pesquisar,aoMudar:E,mensagemDeErro:Ko,...e.esperaMs!==void 0?{esperaMs:e.esperaMs}:{}});d.addEventListener("input",()=>I.digitou(d.value)),d.addEventListener("keydown",S=>{if(S.key==="Enter")S.preventDefault(),I.agora(d.value);else if(S.key==="ArrowDown"){let M=u.querySelector("button:not([disabled])");M&&(S.preventDefault(),M.focus())}}),u.addEventListener("keydown",S=>{if(S.key!=="ArrowDown"&&S.key!=="ArrowUp")return;let M=[...u.querySelectorAll("button:not([disabled])")],$=M.indexOf(S.target);$<0||(S.preventDefault(),S.key==="ArrowDown"?M[Math.min($+1,M.length-1)]?.focus():$===0?d.focus():M[$-1]?.focus())}),t.el.addEventListener("close",()=>I.parar());let L=async()=>{let S=i.resultado();if(e.obrigatorio&&!S.length){t.erro(e.obrigatorio);return}await t.gravar(()=>e.gravar(S),[h])&&e.depois()};r.replaceChildren(c,p,l("div",{class:"spro-p-lupa-busca"},l("label",{class:"spro-p-campo"},l("span",{class:"spro-p-campo-rotulo"},`Adicionar ${e.nome}`),d),m,u),Ao(g,h)),f(),E({tipo:"ocioso"}),d.focus({preventScroll:!0})},n=()=>{r.replaceChildren(l("p",{class:"spro-p-nota"},`Carregando ${e.nomePlural} do processo\u2026`)),e.carregar().then(s=>{t.el.isConnected&&a(s)}).catch(s=>{if(!t.el.isConnected)return;let i=l("button",{type:"button",class:"spro-p-link"},"Tentar de novo");i.addEventListener("click",n),r.replaceChildren(l("div",{class:"spro-p-erro",role:"alert"},W("alerta",13),` ${Ko(s)} `,i))})};n()}async function Zp(o,e,r,t){try{let a=await o.op.formularioDoProcesso();e.el.isConnected&&await t(a)}catch(a){e.erro(a instanceof Error?a.message:"N\xE3o foi poss\xEDvel carregar o formul\xE1rio do processo."),r.replaceChildren()}}var Qp=o=>l("div",{class:"spro-p-modal-lugar"},l("p",{class:"spro-p-nota"},o));function xi(o,e){let r=l("input",{type:"text",class:"spro-campo",maxlength:"100","aria-label":"Especifica\xE7\xE3o"});r.value=e.especificacao;let t=Po("Salvar",()=>void n()),a=ao(o,{titulo:"Editar especifica\xE7\xE3o do processo",icone:"documento",conteudo:[Oo("Especifica\xE7\xE3o",r),Ao(t)]});r.addEventListener("keydown",s=>{s.key==="Enter"&&(s.preventDefault(),n())});let n=async()=>{await a.gravar(()=>o.op.alterarProcesso({especificacao:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}function Ai(o,e){let r,t=Xo({rotulo:"Tipo de processo",vazio:"Escolher o tipo\u2026",dicaBusca:"Buscar tipo de processo\u2026",limite:150,resumo:(s,i,c)=>i===c?`${c} tipos`:`${i} de ${c} tipos`,carregar:async()=>{let s=await o.op.formularioDoProcesso();return r=s.tipoAtual??s.tipos.find(i=>i.texto===e)?.valor,mr(s.tipos)},valor:()=>r}),a=Po("Salvar",async()=>{if(!t.valor()){n.erro("Escolha um tipo.");return}await n.gravar(()=>o.op.alterarProcesso({tipo:t.valor()}),[a])&&o.recarregar("dadosProcesso")}),n=ao(o,{titulo:"Editar tipo de processo",icone:"pasta",conteudo:[l("div",{class:"spro-p-modal-lugar"},Oo("Tipo de processo",t.el),Ao(a))]})}function Ei(o){let e=Qp("Carregando o formul\xE1rio do processo\u2026"),r=ao(o,{titulo:"Editar n\xEDvel de acesso",icone:"cadeado",conteudo:[e]});Zp(o,r,e,t=>{let a=t.nivel==="1"?"restrito":"publico",n=["publico","restrito"].map(d=>l("button",{type:"button",role:"radio","aria-checked":String(d===a),"data-nivel":d},d==="publico"?"P\xFAblico":"Restrito")),s=l("div",{class:"spro-segmentado",role:"radiogroup","aria-label":"N\xEDvel de acesso"},...n),i=Xo({rotulo:"Hip\xF3tese legal",vazio:"Escolher a hip\xF3tese legal\u2026",dicaBusca:"Buscar hip\xF3tese legal\u2026",limite:150,adiar:!0,carregar:async()=>mr(await t.hipoteses("1")),valor:t.hipoteseAtual}),c=l("div",{class:"spro-p-modal-lugar",hidden:a!=="restrito"},Oo("Hip\xF3tese legal",i.el));for(let d of n)d.addEventListener("click",()=>{a=d.getAttribute("data-nivel")==="restrito"?"restrito":"publico";for(let m of n)m.setAttribute("aria-checked",String(m===d));c.hidden=a!=="restrito",a==="restrito"&&i.carregarAgora()});a==="restrito"&&i.carregarAgora();let p=Po("Salvar",async()=>{if(a==="restrito"&&!i.valor()){r.erro("Escolha a hip\xF3tese legal.");return}await r.gravar(()=>o.op.alterarProcesso(a==="restrito"?{nivel:a,hipotese:i.valor()}:{nivel:a}),[p])&&o.recarregar("dadosProcesso")});e.replaceChildren(s,c,Ao(p))})}function yi(o,e){let r=l("textarea",{class:"spro-campo",rows:"5",maxlength:"1000","aria-label":"Observa\xE7\xF5es desta unidade"});r.value=e.observacoes;let t=Po("Salvar",()=>void n()),a=ao(o,{titulo:"Observa\xE7\xF5es desta unidade",icone:"nota",conteudo:[Oo("Observa\xE7\xF5es",r,"Linhas que come\xE7am com # s\xE3o etiquetas e n\xE3o aparecem no painel."),Ao(t)]}),n=async()=>{await a.gravar(()=>o.op.alterarProcesso({observacoes:r.value.trim()}),[t])&&o.recarregar("dadosProcesso")}}var Pi=(o,e)=>async()=>{let r=await o.op.formularioDoProcesso();return e==="assuntos"?{atuais:r.assuntos,negados:r.assuntosNegados,pesquisar:(t,a)=>r.pesquisarAssuntos(t,a)}:{atuais:r.interessados,negados:r.interessadosNegados,pesquisar:(t,a)=>r.pesquisarContatos(t,a)}};function Di(o){ia(o,{titulo:"Interessados do processo",icone:"pessoa",nome:"interessado",nomePlural:"interessados",dica:"Digite o nome do contato para pesquisar.",carregar:Pi(o,"interessados"),gravar:e=>o.op.alterarProcesso({interessados:e}),depois:()=>o.recarregar("dadosProcesso")})}function wi(o){ia(o,{titulo:"Assuntos do processo",icone:"etiqueta",nome:"assunto",nomePlural:"assuntos",dica:"Digite o c\xF3digo ou parte da descri\xE7\xE3o do assunto.",carregar:Pi(o,"assuntos"),gravar:e=>o.op.alterarProcesso({assuntos:e}),depois:()=>o.recarregar("dadosProcesso"),obrigatorio:"O processo precisa ter ao menos um assunto."})}var se=o=>{let e=go(o,"dadosProcesso").dado;return e?.disponivel?e.valor:null},Re=o=>!o.sigiloso&&!!se(o)?.editavel;async function pt(o,e){let r=se(o);if(!r)return;let t=!$o(r.especificacao,e);try{let a=await o.op.alterarProcesso({especificacao:Ks(r.especificacao,e).slice(0,100)});co(o,a.aplicado?e==="URGENTE"?t?"Marca de urg\xEAncia adicionada.":"Marca de urg\xEAncia removida.":t?"Marca de trancamento adicionada.":"Marca de trancamento removida.":a.resumo)}catch(a){co(o,Lo(a),7e3)}o.recarregar("dadosProcesso")}function dt(o,e,r=2){let t=go(o,"dadosProcesso");return jo(t,()=>o.recarregar("dadosProcesso"),a=>a.disponivel?e(a):[ze(a.motivo,"Este dado")],r)}var Si={tipo:"descricao",titulo:"Especifica\xE7\xE3o",icone:"balaoPontos",desenhar(o){let e=go(o,"dadosProcesso"),r=se(o),t=[];return r&&Re(o)&&(t.push({icone:"alerta",rotulo:$o(r.especificacao,"URGENTE")?"Remover a marca de urg\xEAncia":"Marcar como urgente",ativa:$o(r.especificacao,"URGENTE"),aoClicar:()=>void pt(o,"URGENTE")}),o.usaTrancado&&t.push({icone:"cadeado",rotulo:$o(r.especificacao,"TRANCADO")?"Remover o trancamento":"Trancar para peticionamento intercorrente",ativa:$o(r.especificacao,"TRANCADO"),aoClicar:()=>void pt(o,"TRANCADO")}),t.push({icone:"lapis",rotulo:"Editar especifica\xE7\xE3o",aoClicar:()=>xi(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})})),{estado:e.estado,desenho:{acoes:t,corpo:dt(o,a=>[wo(yo(o,a.valor.especificacao||"(sem especifica\xE7\xE3o)",`${$o(a.valor.especificacao,"URGENTE")?"urgente":""} ${$o(a.valor.especificacao,"TRANCADO")?"trancado":""}`.trim()))])}}}},Mi={tipo:"tipo_procedimento",titulo:"Tipo de Processo",icone:"caixa",desenhar(o){let e=se(o),r=e?.tipo||o.arv.tipo;return{estado:"pronto",desenho:{acoes:e&&Re(o)?[{icone:"lapis",rotulo:"Editar tipo de processo",aoClicar:()=>Ai(o,r)}]:[],corpo:[wo(yo(o,r||"(n\xE3o informado)"))]}}}},Ci={tipo:"nivel_acesso",titulo:"N\xEDvel de Acesso",icone:"globo",desenhar(o){let e=se(o),r=e?.nivel??o.arv.nivel,t=e?e.hipotese:o.arv.hipotese,a=r==="restrito"?`Restrito${t?`: ${t}`:""}`:r==="sigiloso"?"Sigiloso":hn.publico;return{estado:"pronto",desenho:{icone:r==="restrito"?"cadeado":r==="sigiloso"?"semUsuario":"globo",acoes:e&&Re(o)&&r!=="sigiloso"?[{icone:"lapis",rotulo:"Editar n\xEDvel de acesso",aoClicar:()=>Ei(o)}]:[],corpo:[wo(l("span",{class:`spro-p-nivel ${r}`,"aria-hidden":"true"},W(vn[r],13)),yo(o,a))]}}}},Ii={tipo:"interessados",titulo:"Interessados",icone:"usuarios",desenhar(o){return{estado:go(o,"dadosProcesso").estado,desenho:{acoes:se(o)&&Re(o)?[{icone:"lapis",rotulo:"Editar interessados",aoClicar:()=>Di(o)}]:[],corpo:dt(o,r=>r.valor.interessados.length?r.valor.interessados.map((t,a)=>{let n=r.valor.interessadosItens?.[a],s=n&&n.texto===t?n.id:void 0;return l("div",{class:"spro-p-linha interessado"},...oi(t).map(i=>yo(o,i)),l("button",{type:"button",class:"spro-p-acao spro-p-proc-do-interessado","aria-label":`Processos de ${t}`,onclick:()=>hi(o,{nome:t,...s?{id:s}:{},...r.valor.idTipo?{tipo:r.valor.idTipo}:{},...r.valor.tipo?{tipoNome:r.valor.tipo}:{}})},Do("lupa",16)))}):[fe("Sem interessados.")])}}}},Li={tipo:"assuntos",titulo:"Assuntos",icone:"favorito",desenhar(o){return{estado:go(o,"dadosProcesso").estado,desenho:{acoes:se(o)&&Re(o)?[{icone:"lapis",rotulo:"Editar assuntos",aoClicar:()=>wi(o)}]:[],corpo:dt(o,r=>r.valor.assuntos.length?r.valor.assuntos.map(t=>wo(yo(o,t))):[fe("Sem assuntos.")])}}}},Oi={tipo:"observacoes",titulo:"Observa\xE7\xF5es",icone:"balao",desenhar(o){let e=go(o,"dadosProcesso"),r=se(o);return{estado:e.estado,desenho:{acoes:r&&Re(o)?[{icone:"lapis",rotulo:"Editar observa\xE7\xF5es desta unidade",aoClicar:()=>yi(o,{especificacao:r.especificacao,observacoes:r.observacoes,nivel:r.nivel})}]:[],corpo:dt(o,t=>{let a=Xs(t.valor.observacoes,o.unidade.sigla,t.valor.observacoesOutras??[]);return a.length?a.map(n=>wo(yo(o,`${n.unidade}: ${n.observacao}`))):[ne("Sem observa\xE7\xF5es.")]})}}}};var od=o=>`${o.getFullYear()}-${String(o.getMonth()+1).padStart(2,"0")}-${String(o.getDate()).padStart(2,"0")}`;function ca(o,e){let r=l("div",{class:"spro-p-modal-lugar"}),t=ao(o,{titulo:e?"Editar marcador":"Adicionar marcador",icone:"etiqueta",largura:520,conteudo:[r]});ed(o,t,r,e)}function ed(o,e,r,t){let a=t?dr(t.texto):{prazo:null,texto:""},n=[],s=Xo({rotulo:"Marcador",vazio:"Escolher um marcador\u2026",dicaBusca:"Buscar marcador\u2026",limite:150,carregar:async()=>(n=await o.op.opcoesMarcador(),ni(n,o.topo)),valor:()=>t?n.find(b=>b.texto===t.nome)?.valor:void 0}),i=oe("Controlar prazo",!!a.prazo,b=>m.hidden=!b),c=oe("Controlar vencimento (\u201CAt\xE9\u201D)",!!a.prazo?.vencimento,()=>{}),p=l("input",{type:"date",class:"spro-campo","aria-label":"Data do prazo"});p.value=a.prazo?.data??od(o.agora());let d=l("input",{type:"time",class:"spro-campo","aria-label":"Hora do prazo"});d.value=a.prazo?.hora??"23:59";let m=l("div",{class:"spro-p-grade",hidden:!a.prazo},c.el,l("div",{class:"spro-p-par"},p,d)),u=l("textarea",{class:"spro-campo",rows:"3",maxlength:"200",placeholder:"Texto do marcador (opcional)"});u.value=a.texto;let g=Po("Salvar",()=>void h()),h=async()=>{let b=n.find(x=>x.valor===s.valor());if(!b){e.erro("Escolha um marcador.");return}if(i.input.checked&&!p.value){e.erro("Informe a data do prazo.");return}let f=Hs({prazo:i.input.checked?{data:p.value,hora:d.value||"23:59",vencimento:c.input.checked}:null,texto:u.value}),E=await e.gravar(async()=>(t&&b.texto!==t.nome&&await o.op.desmarcar(t.nome),o.op.marcar({marcador:b.texto,texto:f})),[g]);return o.recarregar("marcador"),E};Nr(r,Oo("Marcador",s.el),t?l("p",{class:"spro-p-nota spro-p-nota-marcador"},_e(t.icone,13,o.topo),` Atual: ${t.nome}. Escolher outro troca o marcador.`):null,i.el,m,Oo("Texto",u),Ao(g))}function rd(o,e){let{prazo:r}=dr(e);if(!r)return null;let t=ke(r,o.agora());return l("span",{class:`spro-p-chip ${t.nivel}`},W("relogio",11),`${r.vencimento?"at\xE9 ":""}${rt(r)} \xB7 ${t.rotulo}`)}async function td(o,e){if(await ee(o,`Remover o marcador \u201C${e.nome}\u201D deste processo?`,"Remover")){try{let r=await o.op.desmarcar(e.nome);co(o,r.resumo)}catch(r){co(o,r instanceof Error?r.message:"N\xE3o foi poss\xEDvel remover o marcador.",7e3)}o.recarregar("marcador")}}function ad(o,e,r){let{texto:t}=dr(e.texto),a=yo(o,e.nome,"forte");return a.prepend(_e(e.icone,15,o.doc)),wo(l("div",{class:"spro-p-marcador"},a,rd(o,e.texto),t?yo(o,t,"suave"):null),r&&e.id?l("span",{class:"spro-p-acoes-linha"},Ie({icone:"lapis",rotulo:`Editar o marcador ${e.nome}`,aoClicar:()=>ca(o,e)}),Ie({icone:"lixeira",rotulo:`Remover o marcador ${e.nome}`,perigo:!0,aoClicar:()=>void td(o,e)})):null)}var Ti={tipo:"marcador",titulo:"Marcador",icone:"etiquetas",desenhar(o){let e=go(o,"marcador"),r=qs(o.arv.pagina.html);return{estado:e.estado,desenho:{acoes:e.dado?.editavel?[{icone:"mais",rotulo:"Adicionar marcador",aoClicar:()=>ca(o)}]:[],corpo:[...jo(e,()=>o.recarregar("marcador"),t=>t.itens.length?t.itens.map(a=>ad(o,a,t.editavel)):[fe("Sem marcador.")]),r?l("div",{class:"spro-p-prazo-nativo"},l("span",{class:`spro-p-chip ${r.nivel==="concluido"?"ok":r.nivel}`},W("relogio",11),`Prazo do SEI: ${r.data} (${r.estado})`)):null]}}}};var ki=[pi,ui,mi,Ti,ii,Si,Mi,Ci,Ii,Li,Oi];var Ni=1e4;function $e(o){if(!o.getElementById("frmArvore"))return null;try{return Bt(le(o))}catch{return null}}function gr(o,e=Ni){return new Promise(r=>{let t=$e(o);if(t)return r(t);let n=o.defaultView?.MutationObserver??globalThis.MutationObserver,s=!1,i=u=>{s||(s=!0,p?.disconnect(),clearTimeout(m),clearInterval(d),r(u))},c=()=>{let u=$e(o);u&&i(u)},p=typeof n=="function"&&o.documentElement?new n(c):null;p?.observe(o.documentElement,{childList:!0,subtree:!0});let d=setInterval(c,250),m=setTimeout(()=>i(null),e)})}var zi="data-spro-processo-raiz";function nd(o){for(let e of o.querySelectorAll(`[${zi}], [data-spro-slot="atividades"]`))e.remove()}function Ri(o){return ki.filter(e=>o.habilitados.has(e.tipo)&&!(o.sigiloso&&Is.has(e.tipo)))}function $i(o){let e=new Set;for(let r of Ri(o))for(let t of ta[r.tipo])e.add(t);return o.sigiloso&&e.delete("dadosProcesso"),[...e]}function _i(o){let e=o.doc;Bo(e),nd(e);let r=e.getElementById("frmArvore")??e.body,t=So(e),a=(x="")=>l("div",{class:`spro-p-raiz ${x}`.trim(),[zi]:"1",...t?{"data-tema":"escuro"}:{}}),n=a(),s=a("anotacoes"),i=l("div",{"data-spro-slot":"atividades",class:"spro-p-slot"}),c=e.getElementById("divConsultarAndamento");c?c.after(s):r.prepend(s);let p=e.getElementById("divRelacionados");p?p.before(i):s.after(i),r.append(n);let d=new Map,m=Ri(o),u=x=>ea.indexOf(x);for(let x of m){let I=Ls({tipo:x.tipo,titulo:x.titulo,icone:x.icone,aberto:ks(o.armazenamento,x.tipo),aoAlternar:L=>Ns(o.armazenamento,x.tipo,L)});d.set(x.tipo,{def:x,casca:I})}for(let x of[...ea].sort((I,L)=>u(I)-u(L))){let I=d.get(x);I&&n.append(I.casca.el)}let g=d.get("anotacoes");g&&s.append(g.casca.el);let h=x=>{let I=d.get(x);if(!I)return;let L;try{L=I.def.desenhar(o)}catch(S){console.warn(`[SEI Pro] painel ${x}:`,S),L=null}I.casca.el.hidden=L===null,L&&I.casca.atualizar(L.estado,L.desenho)},b=x=>{if(x)h(x);else for(let I of d.keys())h(I)},f=o.loja.aoMudar(x=>{for(let[I,L]of d)ta[L.def.tipo].includes(x)&&h(I)});b();let E=Qo(e,()=>{let x=So(e);for(let I of[n,s])x?I.setAttribute("data-tema","escuro"):I.removeAttribute("data-tema")});return{raiz:n,redesenhar:b,desmontar(){f(),E(),n.remove(),s.remove(),i.remove()}}}function Hi(o,e,r={}){let t=_i(o),a=!1,n=o.doc.defaultView,s=r.Observador??n?.MutationObserver??globalThis.MutationObserver,i=()=>{a=!1,!t.raiz.isConnected&&(t.desmontar(),t=_i(o),e?.(t))},c=typeof s=="function"&&o.doc.body?new s(()=>{a||t.raiz.isConnected||(a=!0,setTimeout(i,30))}):null;return c?.observe(o.doc.body,{childList:!0,subtree:!0}),{atual:()=>t,parar(){c?.disconnect(),t.desmontar()}}}function sd(){let o=globalThis,e=o.wrappedJSObject??o.window?.wrappedJSObject,r=o.exportFunction;return!e||typeof r!="function"?null:{pagina:e,exportFunction:t=>r(t,e)}}function id(o,e){if(!e.pagina.Object)return o;let r=new e.pagina.Object;for(let[t,a]of Object.entries(o))a!==void 0&&(r[t]=a);return r}function qi(o,e,r,t,a=sd()){if(!a)return r?o.request(e,r,t):o.request(e,t);let n=null,{pagina:s,exportFunction:i}=a,c=i(d=>new s.Promise(i(m=>{t(d).then(u=>{n={ok:!0,valor:u},m()},u=>{n={ok:!1,erro:u},m()})}))),p=r?o.request(e,id(r,a),c):o.request(e,c);return Promise.resolve(p).then(()=>{let d=n;if(!d)throw new Error("trava: o gerente de travas soltou sem rodar a fun\xE7\xE3o");if(d.ok)return d.valor;throw d.erro})}var cd="seipro-historico-sessao",la="seiProHistoricoRestauro",ld=600*1e3,Fi;function pa(){if(Fi!==void 0)return Fi;try{return typeof localStorage<"u"?localStorage:null}catch{return null}}function Ui(o,e,r=Date.now()){try{let t={host:o,tipo:e.tipo,pagina:e.pagina,em:r};pa()?.setItem(la,JSON.stringify(t))}catch{}}function ut(){try{pa()?.removeItem(la)}catch{}}function da(o,e=Date.now()){try{let r=pa()?.getItem(la);if(!r)return null;let t=JSON.parse(r);return t.host!==o||typeof t.tipo!="string"||typeof t.pagina!="string"||typeof t.em!="number"||e-t.em>ld?null:{tipo:t.tipo,pagina:t.pagina}}catch{return null}}var Vi=Promise.resolve();function Bi(o,e){let r=typeof navigator<"u"?navigator.locks:void 0;if(r?.request)return qi(r,cd,e?{signal:e}:null,()=>o()).catch(n=>{throw Wo(n)});let t=Vi.then(()=>{if(e?.aborted)throw Wo(new DOMException("cancelado","AbortError"));return o()});return Vi=t.catch(()=>{}),t}var pd={resumido:"R",completo:"P",total:"T"};var dd=2e3;function Gi(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase()}function ud(o){let e=[...o.querySelectorAll("td")],r=V(e[0]),t=e[1]?.querySelector("a")?.getAttribute("title")??"",a=e[2]?.querySelector("a")?.getAttribute("title")??"",n=V(e[3]),s={data:r,unidade:V(e[1]),...t?{unidadeNome:t}:{},usuario:V(e[2]),descricao:n},i=_r(r);i&&(s.dataISO=i),a&&(s.usuarioNome=a),o.classList.contains("andamentoAberto")&&(s.aberto=!0);let c=e[3]?.querySelector("a.ancoraHistoricoProcesso");if(c){let p=V(c);/^\d+$/.test(p)&&(s.nrSei=p);let d=lo(c.getAttribute("href")??"").get("id_documento");d&&(s.idDocumento=d)}if(Gi(n).startsWith(Gi(To.remetidoPrefixo))){let p=e[3]?.querySelector("a.ancoraSigla"),d=V(p);d&&(s.unidadeCitada=d);let m=p?.getAttribute("title")??"";m&&(s.unidadeCitadaNome=m)}return s}function ua(o){let e=o.doc.querySelector("#tblHistorico"),r=Number(/\((\d+)\s+registro/.exec(V(e?.querySelector("caption")))?.[1]??0);return{itens:[...e?.querySelectorAll("tr")??[]].filter(a=>a.querySelector("td")).map(ud),total:r}}function md(o){if(o.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let e=ho(o,"procedimento_consultar_historico")??uo(o.pagina.html,"procedimento_consultar_historico");if(!e)throw new k("SEI_ACAO_INDISPONIVEL","O hist\xF3rico deste processo n\xE3o est\xE1 dispon\xEDvel.");return e}function qe(o,e){return o.doc.querySelector(`#frmProcedimentoHistorico input[name="${e}"]`)?.getAttribute("value")??""}function ma(o){let e=/\((\d+)\s+registros?\s*-\s*\d+\s+a\s+(\d+)\)/.exec(V(o.doc.querySelector("#tblHistorico caption")));if(e)return Number(e[2])<Number(e[1]);if([...o.doc.querySelectorAll("#lnkInfraProximaPaginaSuperior, #lnkInfraProximaPaginaInferior")].some(a=>!a.classList.contains("disabled")&&a.getAttribute("aria-disabled")!=="true"))return!0;let t=[...o.doc.querySelectorAll("#selInfraPaginacaoSuperior option")];return t.length>0&&!t[t.length-1].hasAttribute("selected")}function ji(o){return[o.dataISO||o.data,o.unidade,o.usuario,o.descricao].join("|")}function fd(o,e,r,t){if(!o||!e||!r||o.hash!==e||!o.andamentos.length||o.andamentos.length!==o.total||!t.length)return null;let a=r-o.total;if(a<0)return null;let n=Math.min(10,o.andamentos.length);for(let s=0;s<=a&&s+n<=t.length;s+=1){let i=!0;for(let c=0;c<n;c+=1)if(ji(t[s+c])!==ji(o.andamentos[c])){i=!1;break}if(i)return[...t.slice(0,s),...o.andamentos]}return null}async function gd(o,e,r){try{r.sinal?.throwIfAborted();let t=await o.http.obter(e,{sinal:r.sinal}),a=vd(o,t,r);return a||await Bi(()=>hd(o,e,r),r.sinal)}catch(t){throw Wo(t)}}function vd(o,e,r){if(!e.doc.querySelector("#frmProcedimentoHistorico")||!e.doc.querySelector("#tblHistorico")||(qe(e,"hdnTipoHistorico")||"R")!==r.tipo||(qe(e,"hdnInfraPaginaAtual")||"0")!=="0"||da(o.http.base.host))return null;let{itens:t,total:a}=ua(e);return ma(e)&&t.length<r.limite?null:(r.aoProgresso?.(1,1),{andamentos:t,total:a||t.length,hash:qe(e,"hdnInfraHashCriterios"),completo:a?t.length>=a:!0,aproveitouCache:!1})}async function Wi(o,e,r){await to.de(e,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:r.tipo,hdnInfraPaginaAtual:r.pagina}).enviar()}async function hd(o,e,r){let t=o.http.base.host,a=await o.http.obter(e,{sinal:r.sinal});if(!a.doc.querySelector("#frmProcedimentoHistorico"))throw new k("SEI_VERSAO_NAO_SUPORTADA","A tela do SEI n\xE3o \xE9 a do hist\xF3rico do processo.",V(a.doc.querySelector("title")));let n=da(t);if(n){try{await Wi(o,a,n),ut()}catch{}a=await o.http.obter(e,{sinal:r.sinal})}let s={tipo:qe(a,"hdnTipoHistorico")||"R",pagina:qe(a,"hdnInfraPaginaAtual")||"0"},i=s,c=!1,p=async(d,m)=>{c||(Ui(t,s),c=!0);let u={tipo:r.tipo,pagina:String(m)},g=await to.de(d,"#frmProcedimentoHistorico",o.http).definir({hdnTipoHistorico:u.tipo,hdnInfraPaginaAtual:u.pagina}).enviar({sinal:r.sinal});return i=u,g};try{let d=s.tipo===r.tipo&&s.pagina==="0"?a:await p(a,0);if(!d.doc.querySelector("#tblHistorico"))throw new k("SEI_RESPOSTA_INESPERADA","O SEI n\xE3o devolveu a tabela de andamentos.",V(d.doc.querySelector("title")));let m=ua(d),u=qe(d,"hdnInfraHashCriterios"),g=m.total,h=g?Math.min(g,r.limite):r.limite,b=fd(r.cache,u,g,m.itens);if(b)return r.aoProgresso?.(1,1),{andamentos:b,total:g,hash:u,completo:!0,aproveitouCache:!0};let f=[...m.itens],E=m.itens.length,x=d.doc.querySelectorAll("#selInfraPaginacaoSuperior option").length,I=x>0?x:g>E&&E>0?Math.ceil(g/E):1;r.aoProgresso?.(1,I);for(let S=1;f.length<h&&ma(d)&&S<dd;S+=1){d=await p(d,S);let M=ua(d);if(!M.itens.length)break;f.push(...M.itens),r.aoProgresso?.(S+1,Math.max(I,S+1))}let L=g?f.length>=g:!ma(d);return{andamentos:f,total:g||f.length,hash:u,completo:L,aproveitouCache:!1}}finally{if(c)if(i.tipo!==s.tipo||i.pagina!==s.pagina)try{await Wi(o,a,s),ut()}catch{}else ut()}}var He=new Map;function bd(o,e){return`${o.http.base.host}|${lo(e).get("id_procedimento")??e}`}function xd(o,e,r={}){if(r.sinal?.aborted)return Promise.reject(new k("CANCELADO","Opera\xE7\xE3o cancelada."));let t=bd(o,e),a=He.get(t);if(!a){let s=new AbortController,i=new Set,c={promessa:void 0,controle:s,interessados:0,progresso:i,ultimo:null};c.promessa=gd(o,e,{tipo:pd.completo,limite:r.limite??Number.POSITIVE_INFINITY,sinal:s.signal,cache:r.cache,aoProgresso:(p,d)=>{c.ultimo=[p,d];for(let m of i)m(p,d)}}).finally(()=>{He.get(t)===c&&He.delete(t)}),c.promessa.catch(()=>{}),He.set(t,c),a=c}let n=a;return n.interessados+=1,r.aoProgresso&&(n.progresso.add(r.aoProgresso),n.ultimo&&r.aoProgresso(n.ultimo[0],n.ultimo[1])),new Promise((s,i)=>{let c=!1,p=()=>{c=!0,r.aoProgresso&&n.progresso.delete(r.aoProgresso),r.sinal?.removeEventListener("abort",d)},d=()=>{if(c)return;p(),n.interessados-=1;let m=new k("CANCELADO","Opera\xE7\xE3o cancelada.");if(n.interessados>0){i(m);return}He.get(t)===n&&He.delete(t),n.controle.abort(),n.promessa.then(()=>i(m),()=>i(m))};r.sinal?.addEventListener("abort",d,{once:!0}),n.promessa.then(m=>{c||(p(),s(m))},m=>{c||(p(),i(Wo(m)))})})}function Ki(o,e,r={}){return xd(o,md(e),r)}var ie=class{porId=new Map;constructor(e){for(let r of e)this.porId.set(r.id,r)}obter(e){return this.porId.get(e)??null}todos(){return[...this.porId.values()]}somar(e){this.porId.has(e.id)||this.porId.set(e.id,e)}tamanho(){return this.porId.size}somarDaPasta(e){if(!e?.includes("infraArvoreNo"))return 0;let r=0;try{for(let t of Hn({html:e}))this.porId.set(t.id,t),r+=1}catch{}return r}lerDoIframe(e){try{let t=e.getElementById("ifrPasta")?.contentDocument;return t?this.somarDaPasta(Ad(t)):0}catch{return 0}}acompanharPastas(e,r){let t=e.getElementById("ifrPasta");if(!t)return()=>{};let a=()=>{this.lerDoIframe(e)>0&&r?.()};return t.addEventListener("load",a),()=>t.removeEventListener("load",a)}};function Yo(o,e){if(!o?.startsWith(e))return null;let r=o.slice(e.length);return/^\d+(?:-\d+)?$/.test(r)?r:null}function Ad(o){let e=[],r=t=>{for(let a of Array.from(t.childNodes))a.nodeType===8?e.push(a.data):a.nodeType===1&&r(a)};return r(o),e.join(`
`)}async function Ji(o,e,r){let t=await o.arvore(e,{sinal:r});if(t.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function Yi(o,e,r){let t=ho(o,e);if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`"${r}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Zi=o=>e=>lo(e.url).get("acao")!==o;async function Ed(o,e,r,t){let a=await o.http.obter(Yi(e,r.acao,r.nomeAcao),{sinal:t,aceitarValidacao:!0});if(a.doc.querySelector(r.form))return to.de(a,r.form,o.http);let n=(r.formularios??[]).map(s=>uo(a.html,s)).find(Boolean);if(!n)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela "${r.nomeAcao}" n\xE3o tem o formul\xE1rio esperado.`);return to.abrir(o.http,n,r.form,{sinal:t,aceitarValidacao:!0})}async function fa(o,e,r,t){let a=await Ji(o,e,t.sinal),n=await Ed(o,a,r,t.sinal),s=r.preparar(n),i={alvo:a.protocolo,mudancas:s,aplicado:!1,resumo:""};return s.length?t.aplicar?(await n.enviar({sinal:t.sinal,botao:r.botao,operacao:`${r.nomeAcao} em ${a.protocolo}`,sucesso:r.sucesso??Zi(r.acao)}),o.invalidar(a.idProcedimento),{...i,aplicado:!0,resumo:r.resumo(a.protocolo).replace(/^Vai /,"")}):{...i,resumo:r.resumo(a.protocolo)}:{...i,resumo:"Nada a alterar: j\xE1 est\xE1 assim."}}function mt(o,e,r,t){return fa(o,e,{acao:"anotacao_registrar",nomeAcao:"Anota\xE7\xF5es",form:"#frmAnotacaoCadastro",botao:"sbmRegistrarAnotacao",preparar:a=>{let n=r.texto.slice(0,500),s=bo("Anota\xE7\xE3o",a.valor("txaDescricao"),n),i=a.valor("chkSinPrioridade")?"sim":"n\xE3o",c=n?r.prioridade===void 0?i:r.prioridade?"sim":"n\xE3o":"n\xE3o";return a.definir({txaDescricao:n,chkSinPrioridade:c==="sim"?"on":null}),[...s,...bo("Prioridade",i,c)]},resumo:a=>r.texto?`Anota\xE7\xE3o definida em ${a}.`:`Anota\xE7\xE3o removida de ${a}.`},t)}function Qi(o,e,r,t){return fa(o,e,{acao:"procedimento_atribuicao_cadastrar",nomeAcao:"Atribuir Processo",form:"#frmAtividadeAtribuir",botao:"sbmSalvar",preparar:a=>{let n=a.opcoes("selAtribuicao").find(p=>p.valor===a.valor("selAtribuicao")&&p.valor!=="null")?.texto??"";if(r===null)return a.definir({selAtribuicao:"null"}),[{campo:"Atribui\xE7\xE3o",antes:n||"(atribui\xE7\xE3o atual)",depois:"(nenhuma)"}];let s=Mo(r),i=a.opcoes("selAtribuicao").filter(p=>p.valor!=="null"),c=i.find(p=>p.valor===r)??i.find(p=>Mo(p.texto.split(" - ")[0])===s)??i.find(p=>Mo(p.texto.split(" - ").slice(1).join(" - "))===s)??(i.filter(p=>Mo(p.texto).includes(s)).length===1?i.find(p=>Mo(p.texto).includes(s)):void 0);if(!c)throw new k("ARGUMENTO_INVALIDO",`Usu\xE1rio "${r}" n\xE3o encontrado (ou amb\xEDguo) na unidade.`,i.map(p=>p.texto).join(" | "));return a.definir({selAtribuicao:c.valor}),bo("Atribui\xE7\xE3o",n,c.texto)},resumo:a=>r?`Processo ${a} atribu\xEDdo.`:`Atribui\xE7\xE3o removida de ${a}.`},t)}function oc(o,e,r,t){return fa(o,e,{acao:"acompanhamento_gerenciar",nomeAcao:"Acompanhamento Especial",form:"#frmAcompanhamentoCadastro",formularios:["acompanhamento_alterar","acompanhamento_cadastrar"],botao:"sbmCadastrarAcompanhamento",sucesso:a=>!a.doc.querySelector("#frmAcompanhamentoCadastro"),preparar:a=>{let n=[],s=!a.valor("hdnIdAcompanhamento");if(r.grupo!==void 0){let i=a.opcoes("selGrupoAcompanhamento").find(p=>p.valor===a.valor("selGrupoAcompanhamento")&&p.valor!=="null")?.texto??"",c=r.grupo?a.escolher("selGrupoAcompanhamento",r.grupo):(a.definir({selGrupoAcompanhamento:"null"}),{texto:""});n.push(...bo("Grupo",i,c.texto))}return r.observacao!==void 0&&(n.push(...bo("Observa\xE7\xE3o",a.valor("txaObservacao"),r.observacao)),a.definir({txaObservacao:r.observacao.slice(0,500)})),s&&n.unshift({campo:"Acompanhamento especial",antes:"",depois:"incluir"}),n},resumo:a=>`Acompanhamento especial registrado em ${a}.`},t)}async function yd(o,e,r){let t=Yi(e,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:r,aceitarValidacao:!0})}function Xi(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(r=>r.querySelector("input[type=checkbox]")).map(r=>{let t=[...r.querySelectorAll("td")];return{id:r.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:V(t[1]),texto:V(t[2]),usuario:V(t[3]),data:V(t[4])}})}async function ga(o,e,r,t){let a=await Ji(o,e,t.sinal),n=await yd(o,a,t.sinal),s=Xi(n),i=Mo(r.marcador),c=s.find(u=>Mo(u.marcador)===i),p={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(r.remover){if(!c)return{...p,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${r.marcador}".`};if(p.mudancas=[{campo:"Marcador",antes:`${c.marcador}${c.texto?`: ${c.texto}`:""}`,depois:""}],!t.aplicar)return{...p,resumo:`Vai remover o marcador "${c.marcador}" de ${a.protocolo}.`};let u=uo(n.html,"andamento_marcador_remover");if(!u)throw new k("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let g=to.de(n,"#frmGerenciarMarcador",o.http);g.definir({hdnInfraItemId:c.id,hdnInfraItensSelecionados:c.id});let h=await o.http.enviar(u,g.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(Xi(h).some(b=>b.id===c.id))throw new k("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${c.marcador}".`);return o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${c.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=to.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=uo(n.html,"andamento_marcador_cadastrar");if(!u)throw new k("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await to.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let m=d.escolher("selMarcador",r.marcador);return d.definir({hdnIdMarcador:m.valor,txaTexto:(r.texto??c?.texto??"").slice(0,250)}),p.mudancas=c?bo(`Texto do marcador ${m.texto}`,c.texto,r.texto):[{campo:"Marcador",antes:"",depois:`${m.texto}${r.texto?`: ${r.texto}`:""}`}],p.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Zi("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...p,aplicado:!0,resumo:`Marcador "${m.texto}" aplicado em ${a.protocolo}.`}):{...p,resumo:`Vai marcar ${a.protocolo} com "${m.texto}".`}:{...p,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}function Pd(o){let e=V(o.doc.querySelector(".pesquisaBarra")),r=Number((/de\s+([\d.]+)\s*$/.exec(e)??/([\d.]+)\s+resultados?\s*$/i.exec(e)??[])[1]?.replace(/\./g,"")??0),t=[];for(let a of o.doc.querySelectorAll("table.pesquisaResultado tr.pesquisaTituloRegistro")){let n=a.querySelector("td.pesquisaTituloEsquerda"),s=[...n?.querySelectorAll("a.protocoloNormal")??[]].find(f=>(f.getAttribute("href")??"").includes("procedimento_trabalhar")),i=a.querySelector("td.pesquisaTituloDireita a"),c=a.nextElementSibling,p=c?.nextElementSibling,d=f=>V([...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>V(E).startsWith(f))).replace(/^[^:]+:\s*/,""),m=i?.getAttribute("title")??"",u=f=>[...p?.querySelectorAll("td.pesquisaMetatag")??[]].find(E=>V(E).startsWith(f))?.querySelector("a"),g=u("Unidade"),h=u("Usu"),b=lo(s?.getAttribute("href")??"").get("id_procedimento")??void 0;t.push({protocolo:V(s),...b?{idProcedimento:b}:{},tipoProcesso:s?.getAttribute("title")??V(n?.querySelector("span")).replace(/\s*N\u00BA\s*$/,""),...i?{documento:{numero:V(i),tipo:m}}:{},trecho:V(c?.querySelector("td.pesquisaSnippet")).replace(/\s*\.\.\.\s*$/,""),unidade:d("Unidade"),...g?.getAttribute("title")?{unidadeNome:g.getAttribute("title")}:{},usuario:d("Usu"),...h?.getAttribute("title")?{usuarioNome:h.getAttribute("title")}:{},data:d("Inclus")||d("Data")})}return{itens:t,total:r||t.length}}async function ec(o,e,r){if(!e.interessadoId)throw new k("ARGUMENTO_INVALIDO","Informe o interessado.");let t=Math.max(0,Math.floor(e.inicio??0)),a=await to.abrir(o.http,o.linkMenu("protocolo_pesquisar"),"#frmPesquisaProtocolo",{sinal:r});a.definir({rdoPesquisarEm:"P",hdnIdContato:e.interessadoId,chkSinTramitacao:e.tramitadoNaUnidade?"S":null,hdnInicio:String(t)}),e.tipoProcesso&&a.escolher("selTipoProcedimentoPesquisa",e.tipoProcesso);let n=await a.enviar({sinal:r,botao:"sbmPesquisar",aceitarValidacao:!0}),s=lo(n.url).get("acao");if(s==="procedimento_trabalhar"){let p=V(n.doc.querySelector("title")).replace(/^SEI\s*-\s*/,""),d=lo(n.url).get("id_procedimento")??void 0;return{total:1,inicio:0,processos:[{protocolo:p,...d?{idProcedimento:d}:{},tipoProcesso:"",trecho:"",unidade:"",usuario:"",data:""}]}}if(s!=="protocolo_pesquisar")throw new k("SEI_RESPOSTA_INESPERADA","A pesquisa do SEI n\xE3o respondeu como esperado.");let{itens:i,total:c}=Pd(n);return{total:i.length?c:0,inicio:t,processos:i}}function ft(o,e){let r=o.valor(e);return o.opcoes(e).find(t=>t.valor===r&&r!=="null")?.texto??""}async function tc(o,e,r){let t=ho(e,"procedimento_alterar"),a=t??ho(e,"procedimento_consultar");if(!a)throw new k("SEI_ACAO_INDISPONIVEL",`O SEI n\xE3o oferece a consulta do processo ${e.protocolo} para voc\xEA.`);return{form:await to.abrir(o,a,"#frmProcedimentoCadastro",r),editavel:!!t}}function Fe(o){return o.map(e=>e.texto).filter(Boolean)}var Dd={0:"publico",1:"restrito",2:"sigiloso"};async function ac(o,e,r){let{form:t,editavel:a}=await tc(o,e,r),n=Dd[t.valor("rdoNivelAcesso")??""]??e.nivel,s=n==="publico"?void 0:ft(t,"selHipoteseLegal").trim()||e.hipotese,i=(t.valor("hdnIdTipoProcedimento")??"").trim(),c=(t.valor("hdnDtaGeracao")??t.valor("txtDtaGeracaoExibir")??"").trim();return{nivel:n,...s?{hipotese:s}:{},tipo:ft(t,"selTipoProcedimento")||e.tipo,...i?{idTipo:i}:{},especificacao:t.valor("txtDescricao")??"",assuntos:Fe(t.itensLupa("selAssuntos")),interessados:Fe(t.itensLupa("selInteressadosProcedimento")),assuntosItens:t.itensLupa("selAssuntos"),interessadosItens:t.itensLupa("selInteressadosProcedimento"),observacoes:t.valor("txaObservacoes")??"",observacoesOutras:wd(t),editavel:a,...c?{autuacao:c}:{}}}function wd(o){let e=[];for(let r of o.pagina.doc.querySelectorAll("#divObservacoesOutras tbody tr")){let t=[...r.querySelectorAll("td")],a=V(t[0]);a&&e.push({unidade:a,observacao:V(t[1])})}return e}function rc(o,e,r,t){let a=new Set(e.map(n=>n.id));for(let n of o){let s=r.get(n.id);if(s!==void 0&&!a.has(n.id))throw new k("ARGUMENTO_INVALIDO",`${t} "${n.texto}" n\xE3o pode ser removido porque foi adicionado pela unidade ${s}.`)}}async function nc(o,e,r,t){let a=await o.arvore(e,{sinal:t.sinal});if(a.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let{form:n,editavel:s}=await tc(o.http,a,{sinal:t.sinal});if(!s)throw new k("SEI_ACAO_INDISPONIVEL",`O processo ${a.protocolo} n\xE3o est\xE1 aberto na sua unidade.`);let i=[];if(r.especificacao!==void 0&&(i.push(...bo("Especifica\xE7\xE3o",n.valor("txtDescricao"),r.especificacao)),n.definir({txtDescricao:r.especificacao.slice(0,100)})),r.tipo!==void 0){let p=ft(n,"selTipoProcedimento"),d=n.escolher("selTipoProcedimento",r.tipo);n.definir({hdnIdTipoProcedimento:d.valor}),i.push(...bo("Tipo",p,d.texto))}if(r.nivel!==void 0){let p=be[n.valor("rdoNivelAcesso")??""]??"";n.definir({rdoNivelAcesso:he[r.nivel]}),i.push(...bo("N\xEDvel de acesso",p,be[he[r.nivel]])),r.nivel==="publico"&&n.definir({selHipoteseLegal:"null"})}if(r.hipotese!==void 0){let p=ft(n,"selHipoteseLegal"),d=n.valor("rdoNivelAcesso")||he.restrito,m=Ae(await xe(o,n,d,t.sinal),r.hipotese,"Hip\xF3tese legal");n.definir({selHipoteseLegal:m.id}),i.push(...bo("Hip\xF3tese legal",p,m.texto))}if(n.valor("rdoNivelAcesso")==="1"&&(n.valor("selHipoteseLegal")??"null")==="null")throw new k("ARGUMENTO_INVALIDO","Processo restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");if(r.observacoes!==void 0&&(i.push(...bo("Observa\xE7\xF5es da unidade",n.valor("txaObservacoes"),r.observacoes)),n.definir({txaObservacoes:r.observacoes})),r.interessados!==void 0){let p=n.itensLupa("selInteressadosProcedimento");rc(p,r.interessados,Ee(n.pagina.html,"interessado"),"Interessado"),i.push(...bo("Interessados",Fe(p).join("; "),Fe(r.interessados).join("; "))),n.definirLupa("selInteressadosProcedimento",r.interessados)}if(r.assuntos!==void 0){if(!r.assuntos.length)throw new k("ARGUMENTO_INVALIDO","Informe os assuntos: o processo precisa ter ao menos um.");let p=n.itensLupa("selAssuntos");rc(p,r.assuntos,Ee(n.pagina.html,"assunto"),"Assunto"),i.push(...bo("Assuntos",Fe(p).join("; "),Fe(r.assuntos).join("; "))),n.definirLupa("selAssuntos",r.assuntos)}let c={alvo:a.protocolo,mudancas:i,aplicado:!1,resumo:""};return i.length?t.aplicar?(n.definir({hdnFlagProcedimentoCadastro:"2"}),await n.enviar({sinal:t.sinal,operacao:`a altera\xE7\xE3o do processo ${a.protocolo}`,sucesso:p=>lo(p.url).get("acao")!=="procedimento_alterar"}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Processo ${a.protocolo} alterado.`}):{...c,resumo:`${i.length} campo(s) a alterar.`}:{...c,resumo:"Nada a alterar: os valores j\xE1 s\xE3o esses."}}function sc(o,e,r){let t=e.protocolo,a=n=>r.enfileirar(()=>n({aplicar:!0}));return{atribuir:n=>a(s=>Qi(o,t,n,s)),anotar:n=>a(s=>mt(o,t,n,s)),alternarItemDaAnotacao:n=>a(async s=>{let i=await er(o.http,e);return mt(o,t,{texto:Us(i?.texto??"",n),prioridade:i?.prioridade??!1},s)}),alternarPrioridadeDaAnotacao:()=>a(async n=>{let s=await er(o.http,e);return s?mt(o,t,{texto:s.texto,prioridade:!s.prioridade},n):{alvo:t,mudancas:[],aplicado:!1,resumo:"N\xE3o h\xE1 anota\xE7\xE3o."}}),acompanhar:n=>a(s=>oc(o,t,n,s)),marcar:n=>a(s=>ga(o,t,n,s)),desmarcar:n=>a(s=>ga(o,t,{marcador:n,remover:!0},s)),alterarProcesso:n=>a(s=>nc(o,t,n,s)),opcoesAtribuicao:()=>Zn(o.http,e),opcoesMarcador:()=>Qn(o.http,e),opcoesAcompanhamento:()=>os(o.http,e),formularioDoProcesso:()=>es(o,e),processosDoInteressado:(n,s)=>ec(o,n,s)}}var vr=class extends Rr{constructor(r,t,a){super(r,a);this.daTela=t}async arvore(){return this.daTela()}async localizar(r,t){let a=this.daTela(),n=r.trim(),s=n.replace(/\D/g,"");if(n===a.protocolo)return{idProcedimento:a.idProcedimento,linkArvore:a.linkProcesso};let i=s?a.documentos.find(c=>c.numero.replace(/\D/g,"")===s):void 0;return i?{idProcedimento:a.idProcedimento,idDocumento:i.id,linkArvore:a.linkProcesso}:super.localizar(r,t)}};function gt(o,e){return`${o}|${e}`}function vt(o){let e=or(le(o));return{host:e.host,login:e.usuario.login.toLowerCase(),unidade:{id:e.unidade.id,sigla:e.unidade.sigla}}}function ic(o){let e=new vr(o.doc.location?.href??"https://sei.invalido/sei/controlador.php",()=>o.arv,()=>le(o.topo)),r=new ie(o.arv.documentos);r.lerDoIframe(o.doc),r.acompanharPastas(o.doc);let t={doc:o.doc,topo:o.topo,arv:o.arv,documentos:r,idProcedimento:o.arv.idProcedimento,protocolo:o.arv.protocolo,host:o.host,login:o.login,unidade:o.unidade,sigiloso:o.arv.nivel==="sigiloso",acoes:Hr(o.arv),loja:o.loja,habilitados:o.habilitados,armazenamento:o.armazenamento,consultasDesativadas:o.consultasDesativadas,reaberturaProgramada:o.reaberturaProgramada,usaTrancado:o.usaTrancado,agora:o.agora??(()=>new Date),op:o.op??sc(e,o.arv,o.loja),recarregar:o.recarregar,coletarHistorico:o.coletarHistorico??(a=>Ki(e,o.arv,a)),aoPedirHistorico:async()=>!1};return t.aoPedirHistorico=o.aoPedirHistorico??(async a=>{try{return await De(t,a?{aoProgresso:a}:{}),!0}catch{return!1}}),t}var ge="data-spro-pasta",ht="data-spro-pastas-fila",Sd=500,Md=15e3,ha=60,Cd=3,Id=3e4,Ld=300,Od=/^anchor(PASTA\d+)$/;function Td(o,e){let r=e.replace("PASTA",""),t=o.getElementById(`spanAGUARDE${r}`);return t?t.textContent??"":null}function ce(o,e){if(!o.getElementById(`anchor${e}`))return"ausente";let r=o.getElementById(`div${e}`);if(!r)return"pendente";if(r.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])'))return"carregada";let t=Td(o,e);if(t===null)return r.children.length>0?"carregada":"pendente";let a=xo(t);return a.startsWith("nenhum protocolo")?"carregada":a.startsWith("erro")||a.startsWith("nao foi possivel")?"falhou":"pendente"}function bt(o,e){let r=o.getElementById(`div${e}`);return r?.style.display==="block"?!0:r?.style.display==="none"?!1:/minus/.test(o.getElementById(`join${e}`)?.getAttribute("src")??"")}function va(o){let e=[];for(let r of o.querySelectorAll('a[id^="anchorPASTA"]')){let t=Od.exec(r.id);t&&e.push(t[1])}return e}function kd(o,e){return(o.getElementById(`span${e}`)?.textContent??"").trim()||e.replace("PASTA","")}function Nd(o){try{return!!o.getElementById("ifrPasta")?.contentDocument?.querySelector('#pwdSenha, input[name="pwdSenha"], #txtUsuario, #frmLogin')}catch{return!1}}function cc(o,e){let r=o.getElementById(`ancjoin${e}`)??o.getElementById(`anchor${e}`);return r?(r.addEventListener("click",t=>t.preventDefault(),{once:!0,capture:!0}),r.click(),!0):!1}var xt=o=>new Promise(e=>setTimeout(e,o));function Ve(o,e={}){let r=e.intervaloMs??Sd,t=e.prazoPastaMs??Md,a=e.teto??ha,n=e.falhasSeguidas??Cd,s=e.Observador??o.defaultView?.MutationObserver??globalThis.MutationObserver,i=e.sessaoExpirada??Nd,c=`${Date.now().toString(36)}${Math.random().toString(36).slice(2,8)}`,p="ociosa",d,m=null,u=0,g=0,h=!1,b=new Set,f=new Set,E=new Set,x=!1,I=!1,L=new Set,S=new Set,M=()=>va(o).filter(y=>{let T=ce(o,y);return(T==="pendente"||T==="falhou")&&!b.has(y)}),$=()=>{let y=M().filter(T=>T!==m).length;return{fase:p,atual:m,nomeAtual:m?kd(o,m):"",feitas:u,total:u+(m?1:0)+y,restantes:y+(m?1:0),falhas:[...b],motivo:d}},Z=(y,T)=>{let U=o.getElementById(`anchor${y}`);U&&(T===null?U.removeAttribute(ge):U.getAttribute(ge)!==T&&U.setAttribute(ge,T))},K=()=>{let y=$();for(let T of[...L])try{T(y)}catch{}},X=o.documentElement,A=()=>X.setAttribute(ht,`${c}:${Date.now()}`),R=()=>{(X.getAttribute(ht)??"").startsWith(`${c}:`)&&X.removeAttribute(ht)},z=()=>{let y=X.getAttribute(ht);if(!y||y.startsWith(`${c}:`))return!1;let T=Number(y.split(":")[1]);return Number.isFinite(T)&&Date.now()-T<Id},q=y=>{if(I||p==="ociosa")return;let T=y.target;if(!T?.closest)return;let U=T.closest('a[id^="ancjoinPASTA"], a[id^="anchorPASTA"], div[id^="divPASTA"]');if(!U)return;let j=/(PASTA\d+)$/.exec(U.id);j&&E.add(j[1])};o.addEventListener("click",q,!0);let Q=async y=>{o.hidden&&(p="pausada",K(),await new Promise(T=>{let U=()=>{(!o.hidden||h||y!==g)&&(o.removeEventListener("visibilitychange",U),clearInterval(j),T())},j=setInterval(U,1e3);o.addEventListener("visibilitychange",U)}),y===g&&!h&&(p="carregando",K()))},J=()=>e.abrirCarregadas===!1?[]:va(o).filter(y=>{if(E.has(y)||bt(o,y))return!1;let T=o.getElementById(`div${y}`);return ce(o,y)==="carregada"&&!!T?.querySelector('a[id^="anchor"]:not([id*="AGUARDE"])')}),F=()=>va(o).some(y=>ce(o,y)==="pendente"&&bt(o,y)&&!S.has(y)),P=async y=>{let T=Date.now()+t;for(;F()&&Date.now()<T&&y===g&&!h;)await xt(100)},D=y=>new Promise(T=>{let U=!1,j=null,io,eo,so=No=>{U||(U=!0,j?.disconnect(),clearInterval(io),clearTimeout(eo),T(No))},no=()=>{if(h)so("cancelada");else{let No=ce(o,y);No==="carregada"?so("ok"):No==="falhou"?so("falhou"):No==="ausente"&&so("sumiu")}};if(typeof s=="function"){j=new s(no);let No=o.getElementById("divArvore")??o.body??X;j.observe(No,{childList:!0,subtree:!0,characterData:!0})}io=setInterval(no,Ld),eo=setTimeout(()=>so("tempo"),t),no()}),H=(y,T)=>{let U=o.activeElement,j=o.defaultView,io=j?.scrollX??0,eo=j?.scrollY??0;I=!0;let so=!0;try{for(let no=0;no<T&&so;no+=1)so=cc(o,y)}finally{I=!1}if(U&&o.activeElement!==U&&U.isConnected)try{U.focus({preventScroll:!0})}catch{}return j&&typeof j.scrollTo=="function"&&(j.scrollX!==io||j.scrollY!==eo)&&j.scrollTo(io,eo),so},C=async y=>{if(e.abrir)return S.add(y),await e.abrir(o,y),!0;let T=bt(o,y);S.add(y);let U=H(y,T?2:1);return T||f.add(y),U},O=()=>{for(let y of[...f])if(f.delete(y),!(E.has(y)||!bt(o,y)||o.getElementById(`div${y}`)?.querySelector(".infraArvoreNoSelecionado"))&&ce(o,y)!=="pendente"){I=!0;try{cc(o,y)}finally{I=!1}}},v=()=>{for(let y of o.querySelectorAll(`[${ge}]`))y.removeAttribute(ge)},w=async y=>{let T=0,U=0;p="carregando",d=void 0,K();try{for(;;){if(y!==g||h||(await Q(y),y!==g||h))return;for(let no of J())H(no,1)&&f.add(no);let j=M()[0];if(!j){p="concluida";return}if(u>=a){p="teto";return}let io=U?r-(Date.now()-U):0;if(io>0&&await xt(io),y!==g||h)return;if(z()){p="interrompida",d="ocupada";return}if(await P(y),y!==g||h)return;if(!M().includes(j)){await xt(10);continue}m=j,A(),Z(j,"carregando"),K();let so=await C(j).catch(()=>!1)?await D(j):"falhou";if(Z(j,null),m=null,y!==g||h){x&&(x=!1,O()),K();return}if(U=Date.now(),so==="ok")T=0,u+=1;else if(so==="sumiu")await xt(Math.min(r,200));else{if(u+=1,b.add(j),Z(j,"falhou"),T+=1,i(o)){p="interrompida",d="sessao";return}if(T>=n){p="interrompida",d="falhas";return}}K()}}finally{y===g&&(m=null,R(),(p==="carregando"||p==="pausada")&&(p="concluida"),x&&(x=!1,O()),K())}},N=()=>{if(!h&&!(p==="carregando"||p==="pausada")&&!(!M().length&&!J().length)){if(z()){p="interrompida",d="ocupada",K();return}g+=1,u=0,A(),w(g)}};return{iniciar(){p==="parada"||p==="teto"||p==="interrompida"||N()},parar(){p!=="carregando"&&p!=="pausada"||(g+=1,p="parada",R(),K())},continuar(){b=new Set,B(),p="ociosa",N()},tentarDeNovo(){b=new Set,B(),p="ociosa",N()},encerrar(y){g+=1;let T=m!==null;p="ociosa",d=void 0,u=0,b=new Set,v(),y?T?x=!0:O():f.clear(),E.clear(),R(),K()},estado:$,pendentes:M,aoMudar(y){return L.add(y),()=>L.delete(y)},destruir(){h=!0,g+=1,o.removeEventListener("click",q,!0),v(),R(),L.clear()}};function B(){for(let y of o.querySelectorAll(`[${ge}="falhou"]`))y.removeAttribute(ge)}}var hr=Object.freeze({texto:"",naoAssinados:!1,externos:!1,cancelados:!1});function Ue(o){return xo(o.texto)!==""||o.naoAssinados||o.externos||o.cancelados}function _d(o){return!o.cancelado&&(o.formato==="interno"||o.formato==="circular")}function zd(o){return o.externo&&o.formato!=="circular"}function ba(o,e){if(!_d(o)||o.assinado)return!1;let r=(e?.unidade??"").trim().toUpperCase(),t=(o.unidadeGeradora??"").trim().toUpperCase();return!(r&&t&&r!==t)}function Rd(o){let e=xo(o);return e?e.split(" "):[]}function $d(o){return xo(`${o.titulo} ${o.numero}`)}function Hd(o,e,r){if((e.naoAssinados||e.externos||e.cancelados)&&!(e.naoAssinados&&ba(o,r)||e.externos&&zd(o)||e.cancelados&&o.cancelado))return!1;let a=Rd(e.texto);if(a.length){let n=$d(o);if(!a.every(s=>n.includes(s)))return!1}return!0}function lc(o,e,r){let t=new Set;for(let a of o.documentos)Hd(a,e,r)&&(t.add(a.id),a.pasta&&t.add(a.pasta));return t}var Be="data-spro-f-oculto";function pc(o){return o.tagName==="SPAN"&&!o.className&&o.childElementCount===1&&o.firstElementChild?.tagName==="BR"}function dc(o){let e=[o];for(let r=o.previousElementSibling;r&&r.tagName!=="DIV"&&!pc(r);r=r.previousElementSibling)e.unshift(r);for(let r=o.nextElementSibling;r&&r.tagName!=="DIV"&&(e.push(r),!pc(r));r=r.nextElementSibling);return e}function qd(o){let e=/^(.*?)\s*\((\d{5,})\)\s*$/.exec(o);return e?{titulo:e[1],numero:e[2]}:{titulo:o,numero:""}}function At(o,e){let r=o.getElementById(`anchor${e}`);if(!r)return null;let t=o.getElementById(`icon${e}`)?.getAttribute("src")??o.getElementById(`anchorImg${e}`)?.querySelector("img")?.getAttribute("src")??"";if(!/documento_|formulario|download_anexo/.test(t))return null;let{titulo:a,numero:n}=qd((o.getElementById(`span${e}`)?.textContent??r.textContent??"").replace(/\s+/g," ").trim()),s=(/documento_([a-z0-9]+)\.svg/.exec(t)?.[1]??"interno").replace("cancelado","interno"),i=o.getElementById(`anchorUG${e}`)?.textContent?.trim();return{id:e,numero:n,titulo:a,pasta:uc(r),externo:!/documento_interno|documento_cancelado|formulario|email/.test(t),formato:s,nivel:"publico",assinado:!!o.getElementById(`anchorA${e}`),assinaturas:[],cancelado:/documento_cancelado/.test(t),unidadeGeradora:i||void 0,link:"",src:"",acoes:[],botoes:[]}}function uc(o){let e=o.closest('div[id^="divPASTA"]');return e?e.id.slice(3):null}function mc(o,e,r,t,a){let n=o.getElementById("divArvore"),s={visiveis:0,total:0,pastasFechadas:0,pastas:0};if(!n)return s;let i=new Map(e.map(h=>[h.id,h])),c=[],p=new Set;for(let h of n.querySelectorAll('a[id^="anchor"]')){let b=Yo(h.id,"anchor");if(!b||b===r)continue;let f=i.get(b)??At(o,b);if(!f)continue;let E=uc(h);c.push({id:b,ancora:h,doc:E===f.pasta?f:{...f,pasta:E}}),E&&p.add(E)}let d=c.map(h=>h.doc),m=Ue(t),u=lc({documentos:d},t,a),g=new Set;if(m){for(let h of c)if(!u.has(h.id))for(let b of dc(h.ancora))g.add(b)}for(let h of n.querySelectorAll('a[id^="anchorPASTA"]')){if(!/^anchorPASTA\d+$/.test(h.id))continue;let b=h.id.slice(6);if(s.pastas+=1,!p.has(b)&&ce(o,b)!=="carregada"){s.pastasFechadas+=1;continue}if(m&&!u.has(b)){for(let E of dc(h))g.add(E);let f=o.getElementById(`div${b}`);f&&g.add(f)}}for(let h of Array.from(n.querySelectorAll(`[${Be}]`)))g.has(h)||h.removeAttribute(Be);for(let h of g)h.hasAttribute(Be)||h.setAttribute(Be,"1");return s.total=d.length,s.visiveis=d.filter(h=>u.has(h.id)).length,s}function fc(o){for(let e of Array.from(o.querySelectorAll(`[${Be}]`)))e.removeAttribute(Be)}function gc(o){try{let e=[...o.pagina.html.matchAll(/infraArvoreNo\("PASTA","(PASTA\d+)"/g)].map(t=>t[1]),r=new Set(o.documentos.map(t=>t.pasta).filter(Boolean));return e.filter(t=>!r.has(t))}catch{return[]}}function vc(o,e){return o.filter(r=>ba(r,{unidade:e})).map(r=>({id:r.id,numero:r.numero,titulo:r.titulo}))}function hc(o){let e=new Map;for(let r of o)!r.nrSei||!r.descricao.startsWith(To.documentoGerado)||e.set(r.nrSei,r.data.slice(0,10));return e}function bc(o,e){return e?o.map(r=>{let t=e.get(r.numero);return t?{...r,data:t}:r}):[...o]}var xc="spro-na-nao-assinados";function Fd(o){let e=o.getElementById("divInfraBarraLocalizacao");if(e)return{pai:e,antes:null};let r=o.getElementById("frmAtividadeListar");return r?.parentElement?{pai:r.parentElement,antes:r}:null}function Vd(o,e){let r=o.getElementById(`anchor${e}`);return r?(r.click(),r.scrollIntoView?.({block:"center"}),!0):!1}function Ud(o,e){let r=new ie(e.documentos);r.lerDoIframe(o);for(let t of o.querySelectorAll("#divArvore a[id^='anchor']")){let a=Yo(t.id,"anchor");if(!a||r.obter(a))continue;let n=At(o,a);n&&r.somar(n)}return r.todos()}function Ac(o){let e=Fd(o.doc);if(!e||o.doc.getElementById(xc))return null;Bo(o.doc);let r=l("div",{id:xc,class:"spro-na",role:"status","aria-live":"polite"});So(o.doc)&&r.setAttribute("data-tema","escuro"),e.pai.insertBefore(r,e.antes);let t=!1,a=!1,n=!0,s=()=>l("strong",{},o.unidade),i=(u,g,h,...b)=>{r.className=`spro-na ${u}`,r.replaceChildren(l("span",{class:"spro-na-icone","aria-hidden":"true"},W(g,15)),l("span",{},...h),...b)},c=(u,g)=>{let h=l("button",{type:"button",class:"spro-p-link"},u);return h.addEventListener("click",g),h},p=async(u,g)=>{if(a)return;a=!0;let h=Ve(u,{...o.opcoesFila,abrirCarregadas:!1,...o.abrirPasta?{abrir:(f,E)=>o.abrirPasta?.(f,E)}:{}}),b=c("Parar",()=>h.parar());h.aoMudar(f=>{if(f.fase!=="carregando"&&f.fase!=="pausada")return;let E=f.nomeAtual?`: ${f.nomeAtual}`:"";i("falha","atualizar",[`Carregando as pastas da \xE1rvore (${Math.min(f.feitas+1,Math.max(f.total,1))} de ${Math.max(f.total,1)}${E})...`],b)});try{i("falha","atualizar",["Carregando as pastas da \xE1rvore..."],b),h.iniciar(),await new Promise(f=>{let E=()=>{let I=h.estado().fase;I==="carregando"||I==="pausada"||(x(),f())},x=h.aoMudar(E);E()})}finally{h.destruir(),a=!1}n=!0,m()},d=(u,g,h)=>{if(t)return;t=!0;let b=l("ul",{class:"spro-p-lista-modal spro-na-lista","aria-label":"Documentos n\xE3o assinados"}),f=I=>b.replaceChildren(...I.map(L=>{let S=l("button",{type:"button",class:"spro-p-link","aria-label":`Selecionar na \xE1rvore: ${L.titulo} (${L.numero})`},W("documento",14),`${L.titulo} (${L.numero})`);return S.addEventListener("click",()=>{x.fechar(),Vd(g,L.id)}),l("li",{class:"spro-p-linha-modal"},S,L.data?l("span",{class:"spro-na-data"},L.data):null)}));f(u);let E=c("Verificar pastas",()=>{x.fechar(),p(g,h)}),x=ao({topo:o.topo,doc:o.doc},{titulo:"Documentos pendentes de assinatura",icone:"caneta",largura:700,conteudo:[l("p",{class:"spro-p-nota"},u.length===1?`Existe 1 documento n\xE3o assinado na unidade ${o.unidade}.`:`Existem ${u.length} documentos n\xE3o assinados na unidade ${o.unidade}.`),b,h.length>0?l("p",{class:"spro-p-nota"},`${h.length===1?"1 pasta fechada n\xE3o foi verificada":`${h.length} pastas fechadas n\xE3o foram verificadas`}: o SEI s\xF3 traz os documentos de uma pasta quando ela \xE9 aberta. `,E):null],aoFechar:()=>{t=!1}});o.datas().then(I=>{I&&x.el.isConnected&&f(bc(u,I))})},m=()=>{if(a)return;let u=o.quadroDaArvore(),g=u?o.lerArvore(u):null;if(!u||!g){i("falha","alerta",["N\xE3o foi poss\xEDvel verificar os documentos n\xE3o assinados na unidade ",s()],c("Tentar de novo",m));return}let h=Ud(u,g),b=vc(h,o.unidade),f=gc({pagina:g.pagina,documentos:h}),E=f.length===1?"1 pasta fechada ainda n\xE3o foi verificada":`${f.length} pastas fechadas ainda n\xE3o foram verificadas`,x=f.length?c("Verificar pastas",()=>void p(u,f)):null;if(!b.length){x?i("falha","alerta",["Nenhum documento n\xE3o assinado na unidade ",s(),` na \xE1rvore aberta; ${E}`],x):i("ok","check",["Todos os documentos foram assinados na unidade ",s()]);return}i("pendente","alerta",["Existem documentos n\xE3o assinados na unidade ",s()],c("Detalhes",()=>d(b,u,f)),...x?[x]:[]),n&&d(b,u,f),n=!1};return m(),{verificar:m,remover:()=>r.remove()}}function yc(o){return o!==o.top&&/[?&]acao=procedimento_enviar(&|$)/.test(o.location.search)}function Ec(o){try{return o.getElementById("ifrArvore")?.contentDocument??null}catch{return null}}async function Pc(o=document){if(!o.getElementById("frmAtividadeListar"))return null;let{dataValues:e}=await chrome.storage.sync.get("dataValues");if(!zo(e,cn))return null;let r=Je(),t=Ec(r),a=t?$e(t)??await gr(t,5e3):null,n=vt(r);return Ac({doc:o,topo:r,quadroDaArvore:()=>Ec(r),lerArvore:s=>$e(s),unidade:n.unidade.sigla,datas:async()=>{if(!a||a.nivel==="sigiloso"||!n.login)return null;let s=new Ce(yr(chrome.storage.local,"local"),gt(n.host,n.login),a.idProcedimento),i=await Pe({loja:s,agora:()=>new Date,sigiloso:!1});return i?.vale?hc(i.historico.andamentos):null}})}var Bd=90,Dc=120,Gd=4e3,wc=[{chave:"naoAssinados",rotulo:"N\xE3o assinados",ajuda:"Mostrar s\xF3 os documentos do editor da sua unidade que ainda n\xE3o foram assinados"},{chave:"externos",rotulo:"Externos",ajuda:"Mostrar s\xF3 os documentos externos (anexos)"},{chave:"cancelados",rotulo:"Cancelados",ajuda:"Mostrar s\xF3 os documentos cancelados"}];function jd(o,e,r=!1){if(!e)return{principal:""};let t=o.total===1?"documento":"documentos";return o.visiveis===0?{principal:r?`Nenhum documento at\xE9 agora (${o.total} na \xE1rvore).`:`Nenhum documento encontrado (${o.total} na \xE1rvore).`}:{principal:`${o.visiveis} de ${o.total} ${t}`}}var Ge=(o,e,r)=>`${o} ${o===1?e:r}`;function Wd(o,e,r){if(!e)return null;let t=o.total>0?Math.min(100,Math.round(o.feitas/o.total*100)):null,a=o.falhas.length,n={id:"tentar",rotulo:"Tentar de novo",aria:"Tentar de novo carregar as pastas que falharam"},s={id:"continuar",rotulo:"Continuar",aria:"Continuar a carregar as pastas fechadas"};switch(o.fase){case"carregando":return o.total===0?null:{texto:`Carregando pastas ${Math.min(o.feitas+1,Math.max(o.total,1))} de ${Math.max(o.total,1)}${o.nomeAtual?`: ${o.nomeAtual}`:""}`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"pausada":return{texto:`Em pausa: a aba est\xE1 oculta (${o.feitas} de ${o.total} pastas)`,acao:{id:"parar",rotulo:"Parar",aria:"Parar de carregar as pastas"},progresso:t,tom:"carregando"};case"parada":return{texto:`Parou: ${Ge(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"};case"teto":return{texto:`Limite de ${r.teto} pastas por vez: ${Ge(o.restantes,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"};case"interrompida":return o.motivo==="sessao"?{texto:"A sess\xE3o do SEI expirou: entre de novo e atualize a p\xE1gina.",acao:null,progresso:null,tom:"aviso"}:o.motivo==="ocupada"?{texto:"Outra carga de pastas est\xE1 em andamento neste quadro.",acao:n,progresso:null,tom:"aviso"}:{texto:`${Ge(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}; ${Ge(o.restantes,"ainda fechada","ainda fechadas")}.`,acao:n,progresso:null,tom:"aviso"};case"concluida":return a>0?{texto:`${Ge(a,"pasta n\xE3o carregou","pastas n\xE3o carregaram")}.`,acao:n,progresso:null,tom:"aviso"}:o.feitas>0&&r.mostrarConcluida?{texto:"Todas as pastas carregadas",acao:null,progresso:100,tom:"ok"}:null;default:return r.pastasFechadas>0?{texto:`${Ge(r.pastasFechadas,"pasta ainda fechada","pastas ainda fechadas")}.`,acao:s,progresso:null,tom:"aviso"}:null}}var xa="Filtrar documentos";function Kd(o){let e="http://www.w3.org/2000/svg",r=o.createElementNS(e,"svg");for(let[a,n]of Object.entries({viewBox:"0 0 24 24",width:"18",height:"18",fill:"currentColor","aria-hidden":"true",focusable:"false"}))r.setAttribute(a,n);let t=o.createElementNS(e,"path");return t.setAttribute("fill-rule","evenodd"),t.setAttribute("d","M10.5 3a7.5 7.5 0 0 1 5.96 12.05l4.74 4.74-1.41 1.41-4.74-4.74A7.5 7.5 0 1 1 10.5 3zm0 2.2a5.3 5.3 0 1 0 0 10.6 5.3 5.3 0 0 0 0-10.6z"),r.append(t),r}function Xd(o){let e=o.createElement("button");return e.type="button",e.className="spro-f-lupa-btn",e.setAttribute("aria-label",xa),e.setAttribute("aria-pressed","false"),e.append(Kd(o)),e}var Jd=".spro-fav-estrela, .spro-fav-abrir, .spro-prj-ic, .iconFavoritePro";function Yd(o,e){let r=[...o.children].filter(n=>n!==e),t=r.find(n=>n.matches(".spro-fav-estrela, .iconFavoritePro"));if(t)return t;let a=r.filter(n=>n.matches(Jd));return a.length?a[a.length-1]??null:r.find(n=>n.matches('a.infraArvoreNo, a[target="ifrVisualizacao"], a[target="ifrConteudoVisualizacao"]'))??null}function Zd(){let o=l("input",{type:"search",class:"spro-f-busca",placeholder:"Filtrar documentos","aria-label":"Filtrar documentos da \xE1rvore por nome ou n\xFAmero SEI",autocomplete:"off",spellcheck:"false"}),e=l("button",{type:"button",class:"spro-f-limpar","aria-label":"Limpar filtro",hidden:!0},W("fechar",12)),r=new Map;for(let d of wc)r.set(d.chave,l("button",{type:"button",class:"spro-f-chip","data-chip":d.chave,"aria-pressed":"false","aria-label":`${d.rotulo}. ${d.ajuda}`},d.rotulo));let t=l("span",{class:"spro-f-status-texto"}),a=l("span",{class:"spro-f-fila-texto"}),n=l("button",{type:"button",class:"spro-f-fila-acao",hidden:!0}),s=l("div",{class:"spro-f-prog-enchimento"}),i=l("div",{class:"spro-f-prog",role:"progressbar","aria-label":"Progresso do carregamento das pastas","aria-valuemin":"0","aria-valuemax":"100",hidden:!0},s),c=l("div",{class:"spro-f-fila",hidden:!0},l("div",{class:"spro-f-fila-linha"},a,n),i);return{raiz:l("div",{class:"spro-f-barra",role:"search","aria-label":"Filtro da \xE1rvore do processo","data-spro-processo-filtro":"1"},l("div",{class:"spro-f-linha"},l("span",{class:"spro-f-lupa","aria-hidden":"true"},W("busca",13)),o,e),l("div",{class:"spro-f-chips",role:"group","aria-label":"Mostrar s\xF3"},...r.values()),l("div",{class:"spro-f-status",role:"status","aria-live":"polite",hidden:!0},t,c)),busca:o,limpar:e,chips:r,status:t,fila:{raiz:c,texto:a,acao:n,barra:i,enchimento:s}}}function Sc(o,e={}){let r=o.doc,t=r.getElementById("divArvore");if(!t?.parentElement)return null;Bo(r);let a=Zd(),n=Xd(r);for(let P of r.querySelectorAll(".spro-f-lupa-btn"))P.remove();let s=!1,i={...hr},c={visiveis:0,total:0,pastasFechadas:0,pastas:0},p,d,m=!1,u=e.fila===void 0?Ve(r,e.opcoesFila):e.fila,g=e.opcoesFila?.teto??ha,h=!1,b,f=()=>{let P=r.getElementById("divArvore");P?.parentElement&&(a.raiz.parentElement!==P.parentElement||a.raiz.nextElementSibling!==P)&&P.parentElement.insertBefore(a.raiz,P)},E={el:null,obs:null},x=()=>{let P=r.getElementById("topmenu");if(!P)return n.isConnected;E.el!==P&&typeof q=="function"&&(E.obs?.disconnect(),E.el=P,E.obs=new q(()=>{m||(x(),S())}),E.obs.observe(P,{childList:!0}));let D=Yd(P,n);return D?(n.parentElement===P&&n.previousElementSibling===D||D.after(n),!0):n.isConnected},I=()=>{for(let P of[a.raiz,n])So(r)?P.setAttribute("data-tema","escuro"):P.removeAttribute("data-tema")},L=P=>{let D=a.fila;if(D.raiz.hidden=!P,!P){D.raiz.removeAttribute("data-tom");return}D.raiz.setAttribute("data-tom",P.tom),D.texto.textContent!==P.texto&&(D.texto.textContent=P.texto),D.acao.hidden=!P.acao,P.acao&&(D.acao.textContent!==P.acao.rotulo&&(D.acao.textContent=P.acao.rotulo),D.acao.setAttribute("aria-label",P.acao.aria),D.acao.setAttribute("data-acao",P.acao.id)),D.barra.hidden=P.progresso===null,P.progresso!==null&&(D.barra.setAttribute("aria-valuenow",String(P.progresso)),D.enchimento.style.width=`${P.progresso}%`)},S=()=>{let P=Ue(i);for(let w of wc)a.chips.get(w.chave)?.setAttribute("aria-pressed",i[w.chave]?"true":"false");a.busca.value!==i.texto&&(a.busca.value=i.texto),a.limpar.hidden=!P;let D=u?.estado(),H=D?Wd(D,P,{pastasFechadas:c.pastasFechadas,teto:g,mostrarConcluida:h}):null,{principal:C}=jd(c,P,D?.fase==="carregando"||D?.fase==="pausada");a.status.textContent!==C&&(a.status.textContent=C),L(H),a.status.parentElement.hidden=!P,a.raiz.toggleAttribute("data-ativo",P);let O=c.total===0&&c.pastas===0&&!P;a.raiz.hidden=O||!s&&n.isConnected,n.hidden=O,n.setAttribute("aria-pressed",s?"true":"false");let v=P&&!s;n.toggleAttribute("data-ativo",v),n.setAttribute("aria-label",v?`${xa} (filtro ativo)`:xa)},M=()=>(c=mc(r,o.documentos.todos(),o.idProcedimento,i,{unidade:o.unidade.sigla}),S(),c),$=0,Z=()=>{if(m)return;f(),x();let P=Date.now();P-$>=Dc&&($=P,M()),clearTimeout(d),d=setTimeout(()=>{m||($=Date.now(),f(),x(),M())},Dc)},K=()=>{!u||m||(Ue(i)?u.iniciar():u.encerrar(!0))},X=P=>{i={...i,...P},M(),K()};a.busca.addEventListener("input",()=>{i={...i,texto:a.busca.value},clearTimeout(p),p=setTimeout(()=>{m||(M(),K())},Bd)}),a.raiz.addEventListener("keydown",P=>{P.key==="Escape"&&(P.preventDefault(),P.stopPropagation(),Ue(i)&&P.target===a.busca?A():z(!0))}),n.addEventListener("click",()=>{s?z():R()});for(let[P,D]of a.chips)D.addEventListener("click",()=>X({[P]:!i[P]}));let A=()=>{clearTimeout(p),i={...hr},u?.encerrar(!0),M(),a.busca.focus()};a.limpar.addEventListener("click",A);let R=()=>{if(s){a.busca.focus();return}s=!0,S(),a.busca.focus()},z=(P=!1)=>{if(!s)return;clearTimeout(p);let D=P||a.raiz.contains(r.activeElement);i={...hr},s=!1,u?.encerrar(!0),M(),D&&n.focus()},q=e.Observador??r.defaultView?.MutationObserver??globalThis.MutationObserver,Q=r.getElementById("frmArvore")??t.parentElement,J=typeof q=="function"?new q(P=>{a.raiz.isConnected&&P.every(H=>a.raiz.contains(H.target)||H.addedNodes.length+H.removedNodes.length>0&&[...H.addedNodes,...H.removedNodes].every(C=>C===a.raiz))||Z()}):null;J?.observe(Q,{childList:!0,subtree:!0});let F=Qo(r,I);return u?.aoMudar(P=>{m||(P.fase==="concluida"&&P.falhas.length===0&&P.feitas>0&&!h?(h=!0,clearTimeout(b),b=setTimeout(()=>{h=!1,m||S()},e.esperaConcluidaMs??Gd)):P.fase!=="concluida"&&(h=!1),S(),P.fase==="carregando"&&M())}),a.fila.acao.addEventListener("click",()=>{let P=a.fila.acao.getAttribute("data-acao");P==="parar"?u?.parar():P==="continuar"?u?.continuar():P==="tentar"&&u?.tentarDeNovo()}),f(),x(),I(),M(),{estado:()=>({...i}),aberta:()=>s,abrir:R,fechar:z,lupa:()=>n,definir:X,limpar:()=>{clearTimeout(p),i={...hr},u?.encerrar(!0),M()},reaplicar:M,barra:()=>a.raiz,destruir:()=>{m=!0,clearTimeout(p),clearTimeout(d),clearTimeout(b),u?.encerrar(!0),u?.destruir(),J?.disconnect(),E.obs?.disconnect(),n.remove(),F(),fc(r),a.raiz.remove()}}}function Qd(o){return o.marcadores.map(e=>{let[r="",...t]=e.split(" \u2014 ");return{id:"",nome:r.trim(),texto:t.join(" \u2014 ").trim(),icone:"",usuario:"",data:""}})}function ou(o){return async()=>{try{return await o()}catch(e){throw new Error(Ko(e))}}}function Mc(o){let e=eu(o);return Object.fromEntries(Object.entries(e).map(([r,t])=>[r,ou(t)]))}function eu(o){let e=Hr(o.arv),r={disponivel:!1,motivo:"consultas"},t={disponivel:!1,motivo:"acao"};return{dadosProcesso:async()=>o.consultasDesativadas?r:e.consultar?{disponivel:!0,valor:await ac(o.http,o.arv)}:t,anotacao:async()=>o.consultasDesativadas?r:e.anotar?{disponivel:!0,valor:await er(o.http,o.arv)}:t,marcador:async()=>o.consultasDesativadas||!e.marcar?{itens:Qd(o.arv),editavel:!1}:{itens:await Yn(o.http,o.arv),editavel:!0},acompanhamento:async()=>o.consultasDesativadas?r:e.acompanhar?{disponivel:!0,valor:await Kn(o.http,o.arv)}:t,atribuicao:async()=>({...Xn(o.arv,o.unidadeSigla),editavel:e.atribuir&&o.arv.nivel!=="sigiloso"}),blocoInterno:async()=>o.loja.ler("blocoInterno").dado??{descricao:null,coletadoEm:0}}}function Aa(o){return o!==o.top&&/[?&]acao=procedimento_visualizar(&|$)/.test(o.location.search)}function Cc(o){o.documentElement?.setAttribute(en,"1")}function Ic(o){o.documentElement?.setAttribute(rn,"1")}function Lc(o){o.documentElement?.setAttribute(an,"1")}function Ea(o){return o===o.top&&/[?&]acao=procedimento_trabalhar(&|$)/.test(o.location.search)}function Oc(o){o.documentElement?.setAttribute(tn,"1")}function Tc(o){o.documentElement?.setAttribute(nn,"1"),o.documentElement?.setAttribute(sn,"1")}function ya(o){try{for(let e=o;e!==e.top;e=e.parent)if(e.frameElement?.id==="frmCheckerProcessoPro")return!0}catch{}return!1}var Et=["Copiar","Abrir","Acoes"],br={Copiar:"Copiar",Abrir:"Abrir",Acoes:"A\xE7\xF5es"},ko={tipo:"local"},ro=(...o)=>({tipo:"acao",acoes:o}),Zo=(...o)=>({tipo:"funcao",funcoes:o}),je=[{id:"copiar-numero",nome:"Copiar n\xFAmero SEI",rotulo:"Copiar n\xFAmero SEI",grupo:"Copiar",icone:"copiar",origem:ko,modo:"copy"},{id:"copiar-nome",nome:"Copiar nome do documento",rotulo:"Copiar nome do documento",grupo:"Copiar",icone:"documento",origem:ko,modo:"name"},{id:"copiar-link",nome:"Copiar link do documento",rotulo:"Copiar link do documento",grupo:"Copiar",icone:"link",origem:ko,modo:"link"},{id:"copiar-numero-link",nome:"Copiar n\xFAmero com link",rotulo:"Copiar n\xFAmero com link",grupo:"Copiar",icone:"link",origem:ko,modo:"numberlink"},{id:"copiar-nome-link",nome:"Copiar nome com link",rotulo:"Copiar nome com link",grupo:"Copiar",icone:"link",origem:ko,modo:"namelink"},{id:"duplicar",nome:"Duplicar documento",rotulo:"Duplicar documento",grupo:"Acoes",icone:"duplicar",origem:ko,modo:"clone"},{id:"copiar-para",nome:"Copiar para...",rotulo:"Copiar para outro processo",grupo:"Acoes",icone:"saida",origem:ko,modo:"copyto"},{id:"imprimir-web",nome:"Imprimir Web",rotulo:"Imprimir Web",grupo:"Abrir",icone:"imprimir",origem:ro("documento_imprimir_web")},{id:"nova-aba",nome:"Visualizar em nova aba",rotulo:"Visualizar em nova aba",grupo:"Abrir",icone:"novaAba",origem:{tipo:"conteudo"},modo:"view"},{id:"baixar",nome:"Baixar documento",rotulo:"Baixar documento",grupo:"Abrir",icone:"baixar",origem:{tipo:"conteudo"}},{id:"consultar",nome:"Consultar documento",rotulo:"Consultar documento",grupo:"Abrir",icone:"olho",origem:ro("documento_alterar","documento_alterar_recebido","documento_consultar","documento_consultar_recebido")},{id:"versoes",nome:"Vers\xF5es do documento",rotulo:"Vers\xF5es do documento",grupo:"Abrir",icone:"historico",origem:ro("documento_versao_listar")},{id:"bloco",nome:"Incluir em bloco",rotulo:"Incluir em bloco",grupo:"Acoes",icone:"camadas",origem:ro("bloco_escolher")},{id:"cancelar",nome:"Cancelar documento",rotulo:"Cancelar documento",grupo:"Acoes",icone:"cancelar",origem:ro("documento_cancelar")},{id:"circular",nome:"Gerar circular",rotulo:"Gerar circular",grupo:"Acoes",icone:"atualizar",origem:ro("documento_gerar_circular")},{id:"assinatura-externa",nome:"Assinatura externa",rotulo:"Assinatura externa",grupo:"Acoes",icone:"caneta",origem:ro("assinatura_externa_gerenciar")},{id:"excluir",nome:"Excluir documento",rotulo:"Excluir documento",grupo:"Acoes",icone:"lixeira",origem:Zo("excluirDocumento")},{id:"editar",nome:"Editar documento",rotulo:"Editar documento",grupo:"Acoes",icone:"lapis",origem:Zo("editarConteudo")},{id:"assinar",nome:"Assinar documento",rotulo:"Assinar documento",grupo:"Acoes",icone:"caneta",origem:Zo("assinarDocumento")},{id:"favorito",nome:"Adicionar aos favoritos",rotulo:"Adicionar aos favoritos",grupo:"Acoes",icone:"estrela",origem:ro("protocolo_modelo_gerenciar","protocolo_modelo_cadastrar")},{id:"ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Zo("cienciaDocumento")},{id:"email",nome:"Enviar por e-mail",rotulo:"Enviar por e-mail",grupo:"Acoes",icone:"email",origem:Zo("enviarEmailDocumento","encaminharEmail")},{id:"mover",nome:"Mover p/ outro processo",rotulo:"Mover p/ outro processo",grupo:"Acoes",icone:"mover",origem:ro("documento_mover")},{id:"intimacao",nome:"Intima\xE7\xE3o eletr\xF4nica",rotulo:"Intima\xE7\xE3o eletr\xF4nica",grupo:"Acoes",icone:"sino",origem:ro("md_pet_intimacao_cadastrar")}],yt=[{id:"p-copiar-numero",nome:"Copiar n\xFAmero do processo",rotulo:"Copiar n\xFAmero do processo",grupo:"Copiar",icone:"copiar",origem:ko},{id:"p-copiar-so-numero",nome:"Copiar somente o n\xFAmero",rotulo:"Copiar somente o n\xFAmero",grupo:"Copiar",icone:"teclado",origem:ko},{id:"p-copiar-link",nome:"Copiar link do processo",rotulo:"Copiar link do processo",grupo:"Copiar",icone:"link",origem:ko},{id:"p-upload",nome:"Enviar Documento Externo",rotulo:"Enviar Documento Externo",grupo:"Acoes",icone:"subir",origem:ko},{id:"p-lote",nome:"A\xE7\xF5es em Lote",rotulo:"A\xE7\xF5es em Lote",grupo:"Acoes",icone:"ajustes",origem:ko},{id:"p-urgencia",nome:"Adicionar ou Remover Urg\xEAncia",rotulo:"Adicionar/Remover Urg\xEAncia",grupo:"Acoes",icone:"alerta",origem:ko},{id:"p-incluir-doc",nome:"Incluir Documento",rotulo:"Incluir Novo Documento",grupo:"Acoes",icone:"mais",origem:ro("documento_escolher_tipo")},{id:"p-alterar",nome:"Consultar/Alterar Processo",rotulo:"Consultar/Alterar Processo",grupo:"Abrir",icone:"lapis",origem:ro("procedimento_alterar","procedimento_consultar")},{id:"p-relacionado",nome:"Iniciar Processo Relacionado",rotulo:"Iniciar Proc. Relacionado",grupo:"Acoes",icone:"atualizar",origem:ro("procedimento_escolher_tipo_relacionado")},{id:"p-acompanhamento",nome:"Acompanhamento Especial",rotulo:"Acompanhamento Especial",grupo:"Abrir",icone:"olho",origem:ro("acompanhamento_gerenciar")},{id:"p-enviar",nome:"Enviar Processo",rotulo:"Enviar Processo",grupo:"Acoes",icone:"saida",origem:ro("procedimento_enviar")},{id:"p-andamento",nome:"Atualizar Andamento",rotulo:"Atualizar Andamento",grupo:"Acoes",icone:"atualizar",origem:ro("procedimento_atualizar_andamento")},{id:"p-atribuir",nome:"Atribuir Processo",rotulo:"Atribuir Processo",grupo:"Acoes",icone:"pessoa",origem:ro("procedimento_atribuicao_cadastrar")},{id:"p-duplicar",nome:"Duplicar Processo",rotulo:"Duplicar Processo",grupo:"Acoes",icone:"duplicar",origem:ro("procedimento_duplicar")},{id:"p-relacionamentos",nome:"Relacionamentos do Processo",rotulo:"Relacionamentos do Processo",grupo:"Abrir",icone:"camadas",origem:ro("procedimento_relacionar")},{id:"p-acesso-externo",nome:"Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo",rotulo:"Gerenciar Acesso Externo",grupo:"Abrir",icone:"pessoa",origem:ro("acesso_externo_gerenciar")},{id:"p-anotacoes",nome:"Anota\xE7\xF5es",rotulo:"Anota\xE7\xF5es",grupo:"Abrir",icone:"nota",origem:ro("anotacao_registrar")},{id:"p-sobrestar",nome:"Sobrestar Processo",rotulo:"Sobrestar Processo",grupo:"Acoes",icone:"relogio",origem:ro("procedimento_sobrestar")},{id:"p-anexar",nome:"Anexar Processo",rotulo:"Anexar Processo",grupo:"Acoes",icone:"alca",origem:ro("procedimento_anexar")},{id:"p-pdf",nome:"Gerar Arquivo PDF do Processo",rotulo:"Gerar Arquivo PDF",grupo:"Abrir",icone:"baixar",origem:ro("procedimento_gerar_pdf")},{id:"p-zip",nome:"Gerar Arquivo ZIP do Processo",rotulo:"Gerar Arquivo ZIP",grupo:"Abrir",icone:"baixar",origem:ro("procedimento_gerar_zip")},{id:"p-ponto-controle",nome:"Gerenciar Ponto de Controle",rotulo:"Gerenciar Ponto de Controle",grupo:"Abrir",icone:"calendario",origem:ro("ponto_controle_gerenciar","controle_prazo_definir")},{id:"p-marcador",nome:"Gerenciar Marcador",rotulo:"Gerenciar Marcador",grupo:"Abrir",icone:"etiqueta",origem:ro("andamento_marcador_gerenciar")},{id:"p-concluir",nome:"Concluir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"check",origem:ro("procedimento_concluir")},{id:"p-ciencia",nome:"Ci\xEAncia",rotulo:"Ci\xEAncia",grupo:"Acoes",icone:"check",origem:Zo("cienciaProcesso")},{id:"p-correspondencia",nome:"Enviar Correspond\xEAncia Eletr\xF4nica",rotulo:"Enviar Correspond\xEAncia",grupo:"Acoes",icone:"email",origem:Zo("enviarEmailProcedimento")},{id:"p-bloco",nome:"Incluir em Bloco",rotulo:"Incluir em Bloco",grupo:"Acoes",icone:"camadas",origem:Zo("incluirEmBloco")},{id:"p-reabrir",nome:"Reabrir Processo",rotulo:"Concluir/Reabrir Processo",grupo:"Acoes",icone:"restaurar",origem:Zo("reabrirProcesso")},{id:"p-ordenar",nome:"Ordenar \xC1rvore do Processo",rotulo:"Ordenar \xC1rvore",grupo:"Acoes",icone:"ordenar",origem:ro("arvore_ordenar")}],Vo="Ativar menu ao clicar",Pt=["Copiar n\xFAmero SEI","Copiar nome do documento","Copiar link do documento","Duplicar documento","Copiar para..."],Dt=["Copiar n\xFAmero do processo","Copiar link do processo","Enviar Documento Externo","A\xE7\xF5es em Lote","Atribuir Processo","Adicionar ou Remover Urg\xEAncia"],wt=["Copiar n\xFAmero SEI","Copiar link do documento","Duplicar documento"],ru={"Add/Remover Urg\xEAncia":"Adicionar ou Remover Urg\xEAncia","A\xE7\xF5es em lote":"A\xE7\xF5es em Lote"},Pa=o=>ru[o]??o;function xr(o,e){let r=Pa(e);return o.find(t=>t.nome===r)}var Px=je.filter(o=>o.modo).map(o=>o.nome);var Da="configViewFlashMenuPro",wa="configViewFlashDocMenuPro",Sa="configViewFlashDocArvorePro",Ma="configViewFlashPanelArvorePro",tu=[["Copiar n\xFAmero do processo","direitos"],["Copiar somente o n\xFAmero","letraC"],["Copiar link do processo","link"],["Enviar Documento Externo","subir","Precisa da op\xE7\xE3o de envio de documentos externos"],["A\xE7\xF5es em Lote","engrenagem","Precisa da op\xE7\xE3o A\xE7\xF5es em lote"],["Adicionar ou Remover Urg\xEAncia","alerta","P\xF5e ou tira o (URGENTE) da especifica\xE7\xE3o"],["Incluir Documento","documentoTexto"],["Consultar/Alterar Processo","documentoAssinado"],["Iniciar Processo Relacionado","sincronizar"],["Acompanhamento Especial","olho"],["Enviar Processo","compartilhar"],["Atualizar Andamento","globo"],["Atribuir Processo","usuarios"],["Duplicar Processo","copia"],["Relacionamentos do Processo","relacionar"],["Gerenciar Disponibiliza\xE7\xF5es de Acesso Externo","usuarioGravata"],["Anota\xE7\xF5es","nota"],["Sobrestar Processo","pausa"],["Anexar Processo","clipe"],["Gerar Arquivo PDF do Processo","pdf"],["Gerar Arquivo ZIP do Processo","zip"],["Gerenciar Ponto de Controle","bandeira"],["Gerenciar Marcador","etiquetas"],["Concluir Processo","pastaAberta"],["Ci\xEAncia","joia"],["Enviar Correspond\xEAncia Eletr\xF4nica","envelope"],["Incluir em Bloco","camadas"],["Reabrir Processo","pastaAberta"],["Ordenar \xC1rvore do Processo","ordenar"]],au=[["Copiar n\xFAmero SEI","direitos"],["Copiar nome do documento","documentoTexto"],["Copiar link do documento","link"],["Duplicar documento","copia"],["Copiar para...","encaminhar","Abre a janela de copiar para outro processo"],["Imprimir Web","imprimir"],["Visualizar em nova aba","janelas"],["Baixar documento","baixar"],["Consultar documento","usuarios"],["Incluir em bloco","livro"],["Cancelar documento","proibido"],["Vers\xF5es do documento","ramificacao"],["Gerar circular","circulo"],["Assinatura externa","documentoAssinado"],["Excluir documento","lixeira"],["Editar documento","lapis"],["Assinar documento","caneta"],["Adicionar aos favoritos","estrela"],["Ci\xEAncia","joia"],["Enviar por e-mail","arroba"],["Mover p/ outro processo","pastaSeta"],["Intima\xE7\xE3o eletr\xF4nica","megafone"],["Copiar n\xFAmero com link","circuloSeta"],["Copiar nome com link","linkExterno"]],nu=[["Copiar n\xFAmero SEI","direitos"],["Copiar nome do documento","documentoTexto"],["Copiar link do documento","link"],["Duplicar documento","copia"],["Copiar para...","encaminhar","Copiar documento para outro processo"],["Copiar n\xFAmero com link","circuloSeta"],["Copiar nome com link","linkExterno"],["Visualizar em nova aba","janelas"]],su=[["Anota\xE7\xF5es","nota","Notas do processo, logo abaixo de Consultar Andamento"],["Atribui\xE7\xE3o","usuarioGravata","Quem est\xE1 com o processo na unidade"],["Tipo de Procedimento","caixa","O tipo do processo"],["Marcador","etiquetas","Os marcadores do processo na unidade"],["N\xEDvel de Acesso","cadeado","P\xFAblico, restrito ou sigiloso"],["Interessados","usuarios","Quem \xE9 interessado no processo"],["Assuntos","favorito","Os assuntos do processo"],["Observa\xE7\xF5es","balao","As observa\xE7\xF5es da unidade"],["Bloco Interno","livro","Os blocos internos que incluem o processo"],["Acompanhamento Especial","olho","O acompanhamento especial do processo"]];function St(o,e){return o.map(([r,t,a])=>{let n=e==="processo"?xr(yt,r):e==="documento"?xr(je,r):void 0;return{nome:r,glifo:t,...a?{dica:a}:{},...n?{grupo:br[n.grupo]}:{}}})}var Uo=[{id:"processo",rotulo:"Processo",glifo:"pastaAberta",titulo:"Menu r\xE1pido do processo",descricao:"O menu que abre no n\xFAmero do processo, no alto da \xE1rvore.",chave:Da,bloco:"menuproc",rotuloGeral:"Menu r\xE1pido do processo",itens:St(tu,"processo"),padrao:Dt,ordenavel:!0},{id:"documentos",rotulo:"Documentos",glifo:"documentoTexto",titulo:"Menu r\xE1pido dos documentos",descricao:"O menu que abre no \xEDcone de cada documento. O que depende do SEI s\xF3 aparece quando ele oferece a a\xE7\xE3o para o documento.",chave:wa,bloco:"menudoc",rotuloGeral:"Menu r\xE1pido dos documentos",itens:St(au,"documento"),padrao:Pt,ordenavel:!0},{id:"arvore",rotulo:"\xC1rvore",glifo:"arvore",titulo:"\xCDcones r\xE1pidos na \xE1rvore",descricao:"Os \xEDcones que ficam ao lado do nome de cada documento, na ordem escolhida.",chave:Sa,bloco:"iconstree",rotuloGeral:"\xCDcones r\xE1pidos na \xE1rvore",itens:St(nu,null),padrao:wt,ordenavel:!0},{id:"painel",rotulo:"Painel",glifo:"informacao",titulo:"Painel de Informa\xE7\xF5es na \xE1rvore",descricao:"Os pain\xE9is que aparecem abaixo da \xE1rvore do processo.",chave:Ma,bloco:"panelinfo",rotuloGeral:"Painel de Informa\xE7\xF5es na \xE1rvore",itens:St(su,null),padrao:ra,ordenavel:!1}];var Ca={nome:Vo,glifo:"cursor",dica:"Abre o menu ao clicar no \xEDcone do documento, em vez de ao passar o mouse"};var Ia=new Set;function iu(o){return Ia.add(o),()=>void Ia.delete(o)}function Mt(o){for(let e of[...Ia])try{e(o)}catch(r){console.warn("[SEI Pro] personaliza\xE7\xE3o:",r)}}var cu={[Da]:"processo",[wa]:"documentos",[Sa]:"arvore",[Ma]:"painel"};function lu(o){let e=r=>{let t=r.key;if(t===null||t==="optionsPro")return Mt("todas");let a=cu[t];a&&Mt(a)};return o.addEventListener("storage",e),()=>o.removeEventListener("storage",e)}function kc(o,e){let r=Uo.find(a=>a.id===e);if(!r)return"";let t=null;try{t=o.getItem(r.chave)}catch{t=null}return`${t??""}|${String(Oe(o,`optionsFlashMenu_${r.bloco}`)??"")}`}function Ct(o,e,r){let t=new Map(Uo.map(i=>[i.id,kc(o,i.id)])),n=iu(i=>{for(let c of Uo){if(i!=="todas"&&i!==c.id)continue;let p=kc(o,c.id);p!==t.get(c.id)&&(t.set(c.id,p),r(c.id))}}),s=e?lu(e):()=>{};return()=>{n(),s()}}function Nc(o){return o.includes(" ")?o.split(" ").pop()??"":""}function We(o){let e=Nc(o.trim());return e.includes("(")?e.replace(")","").replace("(","").trim():e}function _c(o){let e=o.trim(),r=Nc(e);return r&&e.split(" ").includes(r)?e.replace(r,"").trim():e}function zc(o){return o==="citacaodoc_2"?"SEI ":o==="citacaodoc_5"?"Doc. SEI n\xBA ":o==="citacaodoc_3"||o==="citacaodoc_4"?"":"SEI n\xBA "}var pu=o=>o.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;"),La=o=>o.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"),Oa=(o,e)=>`<a href="${pu(o)}" target="_blank">${La(e)}</a>`,Rc=o=>({texto:We(o.rotulo)});function $c(o){let e=We(o.rotulo);return o.citacaoOpcao==="citacaodoc_4"?{texto:e}:{texto:`${_c(o.rotulo)} (${zc(o.citacaoOpcao)}${e})`}}var Hc=o=>({texto:o.linkDocumento});function qc(o){let e=We(o.rotulo);return{texto:e,html:Oa(o.linkDocumento,e)}}function Fc(o){let e=We(o.rotulo);if(o.citacaoOpcao==="citacaodoc_4")return{texto:e,html:Oa(o.linkDocumento,e)};let r=_c(o.rotulo),t=zc(o.citacaoOpcao);return{texto:`${r} (${t}${e})`,html:`${La(r)} (${La(t)}${Oa(o.linkDocumento,e)})`}}var Vc=o=>/\d/.test(o)?(o.match(/\d+/g)??[]).join(""):o;function Ta(o,e,r){return`${o}?acao=procedimento_trabalhar&id_procedimento=${e}${r?`&id_documento=${r}`:""}`}function Uc(o){return Et.flatMap(e=>o.filter(r=>r.grupo===e))}function ka(o,e,r){let t=new Set,a=[];for(let n of e??r){if(n===Vo)continue;let s=xr(o,n);s&&!t.has(s.id)&&(t.add(s.id),a.push(s))}return a}var Bc=(o,e)=>{for(let r of e){let t=uo([...o],r);if(t)return t}return null};function Gc(o,e){return e.find(r=>o?.includes(r))??null}var jc={excluirDocumento:"linkExcluirDocumento",cienciaDocumento:"linkCienciaDocumento",assinarDocumento:"linkAssinarDocumento",editarConteudo:"linkEditarConteudo",enviarEmailDocumento:"linkDocumentoEnviarEmail",encaminharEmail:"linkEncaminharEmail",cienciaProcesso:"linkCienciaProcesso",reabrirProcesso:"linkReabrirProcesso",enviarEmailProcedimento:"linkProcedimentoEnviarEmail"};function du(o){let e=o.rotulo.trim()||o.id;return o.dado?.externo?e:`${e}.html`}var uu=new Set(["copiar-link","copiar-numero-link","copiar-nome-link"]);function mu(o,e,r){let t=r.servicos,a={rotulo:e.rotulo,citacaoOpcao:r.citacao,linkDocumento:Ta(r.base,r.idProcedimento,e.id)};switch(o.id){case"copiar-numero":return{executar:()=>t.copiar(Rc(a),"N\xFAmero SEI copiado.")};case"copiar-nome":return{executar:()=>t.copiar($c(a),"Nome copiado.")};case"copiar-link":return{executar:()=>t.copiar(Hc(a),"Link copiado.")};case"copiar-numero-link":return{executar:()=>t.copiar(qc(a),"N\xFAmero com link copiado.")};case"copiar-nome-link":return{executar:()=>t.copiar(Fc(a),"Nome com link copiado.")};case"duplicar":case"copiar-para":{let n=e.dado?.externo===!0,s=e.dado?.cancelado===!0,i=!r.podeIncluirDocumento,c=s?"cancelado":n?"s\xF3 documento do SEI":e.dado?void 0:"indispon\xEDvel";if(o.id==="copiar-para")return{desativado:!!c||void 0,dica:c,executar:()=>t.legado("copiar-para",e.id)};let p=c??(i?"processo fechado":void 0);return{desativado:!!p||void 0,dica:p,executar:async()=>{let d=e.dado?.numero||(e.rotulo.match(/(\d{5,})\)?\s*$/)?.[1]??"");if(!d)return t.avisar("N\xE3o foi poss\xEDvel achar o n\xFAmero SEI deste documento.",6e3);let m=!1;if(/minuta/i.test(e.rotulo)){let u=await t.perguntarMinuta();if(!u)return;m=u==="remover"}await t.duplicar(d,m)}}}default:return{executar:()=>{}}}}function Wc(o,e,r){let t={id:o.id,nome:o.nome,grupo:o.grupo,rotulo:o.rotulo,icone:o.icone},a=r.servicos,n=e.dado,s=o.origem;if(s.tipo==="local")return!(n?.numero||We(e.rotulo))||uu.has(o.id)&&e.id.includes("-")?null:{...t,...mu(o,e,r)};if(!n)return null;if(s.tipo==="conteudo"){if(!n.src)return null;let d=n.src;return o.id==="baixar"?{...t,executar:()=>a.baixar(d,du(e))}:{...t,executar:()=>a.abrirEmNovaAba(d)}}if(s.tipo==="acao"){let d=Bc(n.acoes,s.acoes);return d?o.id==="imprimir-web"?{...t,executar:()=>a.abrirEmNovaAba(d)}:{...t,executar:()=>a.abrirNoVisualizador(d)}:null}let i=Gc(n.funcoes,s.funcoes);if(!i)return null;let c=jc[i];if(!c)return null;let p=async d=>{let m=await a.linkDaTela(n.link,c);if(!m)return a.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o documento e use o bot\xE3o da barra.",6e3);d==="aba"?a.abrirEmNovaAba(m):a.abrirNoVisualizador(m)};switch(o.id){case"excluir":return{...t,perigo:!0,executar:async()=>{await a.confirmar(`Excluir o documento ${e.rotulo.trim()}?`,"Excluir")&&await p("visualizador")}};case"ciencia":return{...t,executar:()=>p("visualizador")};case"editar":return n.assinado||n.cancelado?null:{...t,executar:()=>p("aba")};default:return{...t,executar:()=>p("aba")}}}function Kc(o,e){let r=[];for(let t of ka(je,e.selecao,Pt)){let a=Wc(t,o,e);a&&r.push(a)}return Uc(r)}function It(o,e,r){let t=[];for(let a of ka(je,r,wt)){if(!a.modo||a.id==="duplicar"&&(o.dado?.externo!==!1||!e.podeIncluirDocumento)||a.id==="nova-aba"&&!o.dado?.src)continue;let n=Wc(a,o,e);n&&!n.desativado&&t.push({...n,modo:a.modo})}return t}function Xc(o){let e=o.servicos,r=[],t=Ta(o.base,o.idProcedimento);for(let a of ka(yt,o.selecao,Dt)){let n={id:a.id,nome:a.nome,grupo:a.grupo,rotulo:a.rotulo,icone:a.icone},s=a.origem;if(s.tipo==="local"){switch(a.id){case"p-copiar-numero":r.push({...n,executar:()=>e.copiar({texto:o.protocolo},"N\xFAmero do processo copiado.")});break;case"p-copiar-so-numero":r.push({...n,executar:()=>e.copiar({texto:Vc(o.protocolo)},"N\xFAmero copiado.")});break;case"p-copiar-link":r.push({...n,executar:()=>e.copiar({texto:t},"Link do processo copiado.")});break;case"p-upload":o.uploadLigado&&r.push({...n,executar:()=>e.legado("enviar-externo")});break;case"p-lote":o.loteLigado&&r.push({...n,executar:()=>e.legado("acoes-em-lote")});break;case"p-urgencia":r.push({...n,executar:()=>e.alternarUrgencia()});break}continue}if(s.tipo==="acao"){let i=Bc(o.acoesProcesso,s.acoes);i&&r.push({...n,executar:()=>e.abrirNoVisualizador(i)});continue}if(s.tipo==="funcao"){let i=Gc(o.funcoesProcesso,s.funcoes);if(!i)continue;if(i==="incluirEmBloco"){r.push({...n,executar:()=>{e.clicarBotaoNativo(i)||e.avisar("Clique no n\xFAmero do processo para abri-lo e use este item de novo.",6e3)}});continue}let c=jc[i];if(!c)continue;r.push({...n,executar:async()=>{let p=await e.linkDaTela(o.linkProcesso,c);if(!p)return e.avisar("O SEI n\xE3o devolveu o endere\xE7o desta a\xE7\xE3o. Abra o processo e use o bot\xE3o da barra.",6e3);i==="enviarEmailProcedimento"?e.abrirEmNovaAba(p):e.abrirNoVisualizador(p)}})}}return Uc(r)}var Ar="spro-pm-icone",Jc="data-spro-pm-sig",Yc=["breackline_doc"];function fu(o){return(o.textContent??"").replace(/\s+/g," ").trim()}function gu(o,e){return l("span",{class:`action-doc action-${o.modo} ${Ar}`,"data-id":e,"data-action":o.modo,"data-rotulo":o.rotulo,role:"button",tabindex:"-1","aria-label":o.rotulo},W(o.icone,12))}function vu(o,e,r){let t=r.map(s=>s.modo).join(","),a=[];for(let s=o.nextElementSibling;s;s=s.nextElementSibling)if(s.classList.contains(Ar))a.push(s);else{if(Yc.some(i=>s.classList.contains(i))||s.classList.contains("action-doc"))continue;break}if(a=a.filter(s=>s.getAttribute("data-id")===e),a.length&&a[0]?.getAttribute(Jc)===t&&a.length===r.length)return!1;for(let s of a)s.remove();if(!r.length)return!0;let n=o;for(;n.nextElementSibling&&Yc.some(s=>n.nextElementSibling?.classList.contains(s));)n=n.nextElementSibling;for(let s of r){let i=gu(s,e);i.setAttribute(Jc,t),n.after(i),n=i}return!0}function Zc(o,e,r,t,a){let n=0,s=t(),i=a();for(let c of o.querySelectorAll('a[id^="anchor"]:not([id^="anchorImg"])')){let p=Yo(c.id,"anchor");if(!p||p===e||!o.getElementById(`anchorImg${p}`))continue;let d=r(p,fu(c)),m=It(d,s,i);vu(c,p,m)&&(n+=1)}return n}function Na(o){for(let e of o.querySelectorAll(`.${Ar}`))e.remove()}function Qc(o,e,r){let a=o.defaultView?.MutationObserver??globalThis.MutationObserver,n,s=()=>{clearTimeout(n),n=setTimeout(r,150)},i=o.querySelector("#divArvore")??o.body,c=typeof a=="function"&&i?new a(s):null;c?.observe(i,{childList:!0,subtree:!0});let p=u=>{if(u.getAttribute("aria-busy")==="true")return;let g=u.getAttribute("data-id")??"",h=u.getAttribute("data-action")??"";u.setAttribute("aria-busy","true");let b=()=>{u.removeAttribute("aria-busy"),u.classList.add("feito"),setTimeout(()=>u.classList.remove("feito"),900)};Promise.resolve(e(g,h)).catch(f=>console.warn("[SEI Pro] \xEDcone r\xE1pido:",f)).finally(b)},d=u=>{let g=u.target?.closest?.(`.${Ar}`);g&&(u.preventDefault(),u.stopPropagation(),p(g))},m=u=>{if(u.key!=="Enter"&&u.key!==" ")return;let g=u.target?.closest?.(`.${Ar}`);g&&(u.preventDefault(),p(g))};return o.addEventListener("click",d,!0),o.addEventListener("keydown",m,!0),()=>{c?.disconnect(),clearTimeout(n),o.removeEventListener("click",d,!0),o.removeEventListener("keydown",m,!0)}}function ol(o,e,r){let t=o.ownerDocument,a=l("div",{class:"spro-menu-pop spro-pm",role:"menu","aria-label":r.rotulo,...r.escuro?{"data-tema":"escuro"}:{}}),n=[],s=!1,i=u=>{let g=l("button",{type:"button",role:"menuitem",class:`spro-menu-item${u.perigo?" spro-menu-perigo":""}${u.desativado?" spro-pm-desativado":""}`,tabindex:"-1","data-item":u.id,...u.desativado?{"aria-disabled":"true"}:{}},l("span",{class:"spro-menu-icone","aria-hidden":"true"},W(u.icone,15)),l("span",{class:"spro-menu-rotulo"},u.rotulo),u.dica?l("span",{class:"spro-menu-dica"},u.dica):null);return g.addEventListener("click",h=>{h.preventDefault(),h.stopPropagation(),!u.desativado&&(d(!0),r.aoEscolher(u))}),n.push(g),g};for(let u of Et){let g=e.filter(h=>h.grupo===u);g.length&&a.append(l("div",{class:"spro-pm-grupo",role:"group","aria-label":br[u]},l("div",{class:"spro-pm-titulo","aria-hidden":"true"},br[u]),...g.map(i)))}r.rodape?.length&&a.append(l("div",{class:"spro-menu-sep",role:"separator"}),...r.rodape.map(i));let c=u=>{if(!n.length)return;let g=(u+n.length)%n.length;for(let[h,b]of n.entries())b.setAttribute("tabindex",h===g?"0":"-1");n[g]?.focus?.({preventScroll:!0})};for(let u of n)u.addEventListener("pointermove",()=>c(n.indexOf(u)));let p=kr(o,a,{largura:r.largura??236,alturaMaxima:440,aoFechar:()=>d(!1)});o.setAttribute("aria-haspopup","menu"),o.setAttribute("aria-expanded","true");function d(u){if(s)return;s=!0;let g=a.contains(t.activeElement);p.fechar(),o.setAttribute("aria-expanded","false"),t.removeEventListener("keydown",m,!0),(u||g)&&o.focus?.({preventScroll:!0}),r.aoFechar()}function m(u){if(u.key==="Escape"){u.preventDefault(),u.stopPropagation(),d(!0);return}if(!r.focar&&!a.contains(t.activeElement))return;let g=n.findIndex(h=>h.getAttribute("tabindex")==="0");switch(u.key){case"ArrowDown":c(g+1);break;case"ArrowUp":c(g-1);break;case"Home":c(0);break;case"End":c(n.length-1);break;case"Enter":case" ":n[g]?.click();break;case"Tab":d(!0);return;default:return}u.preventDefault(),u.stopPropagation()}return t.addEventListener("keydown",m,!0),r.focar&&c(0),{el:a,fechar:()=>d(!1)}}async function rl(o,e,r){let t=await o.localizar(e,r),a=await o.arvore(e,r),n=e.replace(/\D/g,""),s=a.documentos.find(i=>i.id===t.idDocumento)??a.documentos.find(i=>i.numero.replace(/\D/g,"")===n);if(!s)throw new k("SEI_NAO_ENCONTRADO",`O documento ${e} n\xE3o est\xE1 na \xE1rvore do processo ${a.protocolo}.`);return{arvore:a,documento:s}}async function hu(o,e,r,t){let a=[],n=e.valor("rdoNivelAcesso")??e.valor("hdnStaNivelAcessoLocal")??"",s=r.nivel?he[r.nivel]:n;if(r.nivel&&(a.push(...bo("N\xEDvel de acesso",be[n]??"",be[s])),e.definir({rdoNivelAcesso:s,hdnStaNivelAcessoLocal:s})),s==="0")e.definir({selHipoteseLegal:"null",hdnIdHipoteseLegal:""});else if(r.hipotese!==void 0||r.nivel==="restrito"&&s!==n){if(!r.hipotese)throw new k("ARGUMENTO_INVALIDO","Documento restrito exige hip\xF3tese legal. Informe a hip\xF3tese.");let i=await xe(o,e,s,t),c=Ae(i,r.hipotese,"Hip\xF3tese legal");a.push({campo:"Hip\xF3tese legal",antes:"",depois:c.texto}),e.definir({selHipoteseLegal:c.id,hdnIdHipoteseLegal:c.id})}return a}async function bu(o,e,r){let t=await rl(o,e,{sinal:r});if(t.documento.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let a=t.documento.externo?"documento_alterar_recebido":"documento_alterar",n=uo(t.documento.acoes,a)??uo(t.documento.acoes,/^documento_alterar/);if(!n)throw new k("SEI_ACAO_INDISPONIVEL",`O documento ${t.documento.numero} n\xE3o pode ser alterado por voc\xEA (assinado por outra unidade, ou processo fechado).`);let s=await to.abrir(o.http,n,"#frmDocumentoCadastro",{sinal:r});return{d:t,acao:a,form:s}}async function xu(o,e,r){let t=ho(e,"documento_escolher_tipo");if(!t)throw new k("SEI_ACAO_INDISPONIVEL",`N\xE3o \xE9 poss\xEDvel incluir documento no processo ${e.protocolo} (fechado na unidade?).`);let a=await to.abrir(o.http,t,"#frmDocumentoEscolherTipo",{sinal:r});if(a.tem("hdnFiltroSerie")&&a.valor("hdnFiltroSerie")!=="T"){let n=await a.definir({hdnFiltroSerie:"T"}).enviar({sinal:r});a=to.de(n,"#frmDocumentoEscolherTipo",o.http)}return a}function Au(o){let e=new Map;for(let r of o.doc.querySelectorAll("[onclick*='escolher(']")){let t=/escolher\((-?\d+)\)/.exec(r.getAttribute("onclick")??"")?.[1];t&&!e.has(t)&&e.set(t,V(r))}for(let r of o.doc.querySelectorAll("a[href*='id_serie=']")){let t=lo(r.getAttribute("href")??"").get("id_serie");t&&!e.has(t)&&e.set(t,V(r))}return[...e].filter(([,r])=>r).map(([r,t])=>({id:r,nome:t}))}async function Eu(o,e,r,t,a=!1){if(e.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");let n=await xu(o,e,t),s=Au(n.pagina).filter(i=>i.id!=="-1").map(i=>({id:i.id,texto:i.nome}));if(a){let i=s.find(c=>c.id===r);if(!i)throw new k("SEI_ACAO_INDISPONIVEL",`O tipo (id ${r}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);return{escolha:n,tipo:i}}return{escolha:n,tipo:Ae(s,r,"Tipo de documento")}}async function yu(o,e,r,t,a,n,s){let i=await t.definir({hdnIdSerie:a.id}).enviar({sinal:s}),c=to.de(i,"#frmDocumentoCadastro",o.http),p=c.pagina.doc.querySelector("#lblNumero"),d=p!==null&&!/infraLabelOpcional/.test(p.getAttribute("class")??"");if(c.definir({txtDescricao:(n.descricao??"").slice(0,250),txtNumero:n.numero??(d?n.numeroSeExigido:void 0)??c.valor("txtNumero")??"",txtNomeArvore:n.nomeArvore??c.valor("txtNomeArvore")??"",rdoTextoInicial:"N"}),n.documentoModelo&&c.definir({rdoTextoInicial:"D",txtProtocoloDocumentoTextoBase:n.documentoModelo}),n.textoPadraoId){let b=n.textoPadraoId;if(c.pagina.doc.querySelector("#frmDocumentoCadastro select[name='selTextoPadrao'], #frmDocumentoCadastro select#selTextoPadrao")&&!c.opcoes("selTextoPadrao").some(E=>E.valor===b&&E.valor!=="null"))throw new k("SEI_ACAO_INDISPONIVEL",`O texto padr\xE3o (id ${b}) n\xE3o est\xE1 dispon\xEDvel nesta unidade.`);c.definir({rdoTextoInicial:"T",selTextoPadrao:b,hdnIdTextoPadrao:b})}else if(n.textoPadrao){let b=c.opcoes("selTextoPadrao").filter(E=>E.valor!=="null").map(E=>({id:E.valor,texto:E.texto})),f=Ae(b,n.textoPadrao,"Texto padr\xE3o");c.definir({rdoTextoInicial:"T",selTextoPadrao:f.id,hdnIdTextoPadrao:f.id})}n.interessados?.length?c.definirLupa("selInteressados",n.interessados):n.interessados&&c.itensLupa("selInteressados").length&&c.definirLupa("selInteressados",[]),n.assuntos?.length&&c.definirLupa("selAssuntos",n.assuntos),n.observacao&&c.definir({txaObservacoes:n.observacao.slice(0,1e3)}),await hu(o,c,{nivel:n.nivel??"publico",hipotese:n.hipotese},s),c.definir({hdnFlagDocumentoCadastro:"2"}),n.acompanharCadastro?.({fase:"enviando"});let m=await c.enviar({sinal:s,operacao:`a cria\xE7\xE3o do documento em ${r.protocolo}`,sucesso:b=>/acao_origem=documento_(?:gerar|cadastrar)/.test(b.url)||/editor_montar/.test(b.html)}),u=lo(m.url).get("id_documento")??/id_documento=(\d+)/.exec(m.html)?.[1]??"";n.acompanharCadastro?.({fase:"enviado",idDocumento:u,idProcedimento:r.idProcedimento}),o.invalidar(r.idProcedimento);let h=(await o.arvore(e,{forcar:!0,sinal:s})).documentos.find(b=>b.id===u);return{idDocumento:u,numero:h?.numero??"",titulo:h?.titulo??""}}function el(o){return o.replace(/(?:\s*[-\u2013]\s*)?\bminuta\b/gi,"").replace(/\s{2,}/g," ").replace(/^[-\u2013\s]+/,"").trim()}var Pu=o=>o&&!/^\d+$/.test(o.trim())?o:void 0;async function tl(o,e,r,t={}){let a=await rl(o,e,{sinal:r.sinal});if(a.documento.nivel==="sigiloso"||a.arvore.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");if(a.documento.externo)throw new k("SEI_ACAO_INDISPONIVEL",`O documento ${a.documento.numero} \xE9 externo (anexo): s\xF3 documento gerado no SEI pode ser duplicado.`);let{d:n,form:s}=await bu(o,e,r.sinal),i=n.documento,c=s.pagina.doc.querySelector("input[name=rdoNivelAcesso][checked]")?.getAttribute("value")??s.valor("hdnStaNivelAcessoLocal")??"0";if(c==="2"||n.arvore.nivel==="sigiloso")throw new k("SEI_SIGILOSO","Documento sigiloso: o agente n\xE3o atua nele.");let p=c==="1"?"restrito":"publico",d=p==="restrito"?(s.valor("hdnIdHipoteseLegal")||s.opcoes("selHipoteseLegal").find(x=>x.selecionada&&x.valor!=="null")?.valor)??void 0:void 0,m=s.valor("hdnIdSerie")??"";if(!m)throw new k("SEI_VERSAO_NAO_SUPORTADA",`A tela do documento ${i.numero} n\xE3o informa o tipo (hdnIdSerie).`);let{escolha:u,tipo:g}=await Eu(o,n.arvore,m,r.sinal,!0),h={alvo:i.numero,mudancas:[{campo:"Documento",antes:"",depois:`${g.texto} (c\xF3pia de ${i.numero})`}],aplicado:!1,resumo:""};if(!r.aplicar)return{...h,resumo:`Vai duplicar ${i.titulo} (${i.numero}) no processo ${n.arvore.protocolo}.`};let{idDocumento:b,numero:f,titulo:E}=await yu(o,e,n.arvore,u,g,{tipo:g.id,descricao:t.semMinuta?el(s.valor("txtDescricao")??""):s.valor("txtDescricao")??"",numero:Pu(s.valor("txtNumero")),nomeArvore:s.valor("txtNomeArvore")?t.semMinuta?el(s.valor("txtNomeArvore")??""):s.valor("txtNomeArvore")??"":void 0,documentoModelo:i.numero,interessados:s.itensLupa("selInteressados"),assuntos:s.itensLupa("selAssuntos"),observacao:s.valor("txaObservacoes")??"",nivel:p,hipotese:d},r.sinal);return{...h,aplicado:!0,resumo:`Documento ${i.numero} duplicado: ${E||g.texto} ${f?`(${f}) `:""}no processo ${n.arvore.protocolo}.`,dados:{idDocumento:b,numero:f}}}var Du="seipro-processo-menu",_a="data-spro-pm-pedido";async function wu(o,e){if(!e.html)return qt(o,e.texto);let r=o.defaultView;try{if(r?.ClipboardItem&&r.navigator.clipboard?.write)return await r.navigator.clipboard.write([new r.ClipboardItem({"text/html":new Blob([e.html],{type:"text/html"}),"text/plain":new Blob([e.texto],{type:"text/plain"})})]),!0}catch{}let t=!1,a=n=>{n.clipboardData?.setData("text/html",e.html??""),n.clipboardData?.setData("text/plain",e.texto),n.preventDefault()};o.addEventListener("copy",a);try{t=o.execCommand("copy")}catch{t=!1}return o.removeEventListener("copy",a),t}function al(o){let e=o.getElementById("ifrConteudoVisualizacao")??o.getElementById("ifrVisualizacao");if(!e)return[];let r=[e];try{let t=e.contentDocument?.getElementById("ifrVisualizacao");t&&t!==e&&r.push(t)}catch{}return r}function nl(o){let{ctx:e}=o,r=e.doc,t=s=>new URL(s,r.baseURI).href,a=(s,i)=>co(e,s,i),n=(s,i,c)=>new Promise(p=>{let d=null,m=ao(e,{titulo:s,icone:"alerta",largura:420,conteudo:[l("p",{},i),Ao(...c.map(u=>u.principal?Po(u.rotulo,()=>{d=u.id,m.fechar()}):l("button",{type:"button",class:"spro-botao",onclick:()=>{d=u.id,m.fechar()}},u.rotulo)))],aoFechar:()=>p(d)})});return{async copiar(s,i){let c=await wu(r,s);a(c?i:"N\xE3o foi poss\xEDvel copiar.",1800)},abrirNoVisualizador(s){let i=al(e.topo),c=i[i.length-1];if(!c)return a("N\xE3o achei o visualizador do SEI nesta tela.",5e3);c.setAttribute("src",t(s))},abrirEmNovaAba(s){let i=l("a",{href:t(s),target:"_blank",rel:"noopener"});r.body.append(i),i.click(),i.remove()},baixar(s,i){let c=l("a",{href:t(s),download:i});r.body.append(c),c.click(),c.remove()},async duplicar(s,i){a("Duplicando o documento...",2e4);try{await tl(o.sei,s,{aplicar:!0},{semMinuta:i}),a(`Documento ${s} duplicado. Atualizando a \xE1rvore...`,5e3),o.recarregarArvore()}catch(c){a(Lo(c),8e3)}},async perguntarMinuta(){let s=await n("Duplicar documento","Deseja duplicar o documento sem a denomina\xE7\xE3o MINUTA?",[{id:"manter",rotulo:"Mantenha MINUTA"},{id:"remover",rotulo:"Remova a denomina\xE7\xE3o MINUTA",principal:!0}]);return s==="remover"||s==="manter"?s:null},async confirmar(s,i){return await n("Confirmar",s,[{id:"voltar",rotulo:"Voltar"},{id:"ok",rotulo:i,principal:!0}])==="ok"},async linkDaTela(s,i){let c=await o.http.obter(s),p=new RegExp(`var\\s+${i}\\s*=\\s*'([^']+)'`).exec(c.html);return p?(p[1]??"").replace(/&amp;/g,"&"):null},legado(s,i){r.documentElement.setAttribute(_a,`${s}|${i??""}`);let c=r.defaultView?.Event??Event;r.dispatchEvent(new c(Du)),r.documentElement.hasAttribute(_a)&&(r.documentElement.removeAttribute(_a),a("Esta fun\xE7\xE3o ainda est\xE1 carregando. Tente de novo em instantes.",5e3))},async alternarUrgencia(){if(!e.loja.ler("dadosProcesso").dado?.disponivel)return e.recarregar("dadosProcesso"),a("Carregando os dados do processo. Tente de novo em instantes.",5e3);await pt(e,"URGENTE")},clicarBotaoNativo(s){for(let i of al(e.topo))try{let c=i.contentDocument?.querySelector(`#divArvoreAcoes a[onclick*="${s}("]`);if(c)return c.click(),!0}catch{}return!1},avisar:a}}var Su="configViewFlashMenuPro",Mu="configViewFlashDocMenuPro",Cu="configViewFlashDocArvorePro";function sl(o){let{ctx:e}=o,r=e.doc,t=o.esperaAbrir??150,a=o.esperaFechar??300;Bo(r);let n=new ie(e.arv.documentos);n.lerDoIframe(r);let s=()=>({...e.arv,documentos:n.todos()}),i=o.sei??new vr(r.location?.href??"https://sei.invalido/sei/controlador.php",s,()=>le(e.topo)),c=o.servicos??nl({ctx:e,http:o.http,sei:i,recarregarArvore:o.recarregarArvore??(()=>r.location.reload())}),p=`${r.location?.origin??""}${r.location?.pathname??""}`,d=()=>!!ho(s(),"documento_escolher_tipo"),m=C=>({selecao:C,citacao:Pr(o.dataValues,"citacaodoc"),base:p,idProcedimento:e.arv.idProcedimento,protocolo:e.arv.protocolo,linkProcesso:e.arv.linkProcesso,acoesProcesso:e.arv.acoesProcesso,funcoesProcesso:e.arv.funcoesProcesso??[],podeIncluirDocumento:d(),uploadLigado:zo(o.dataValues,"uploaddocsexternos"),loteLigado:zo(o.dataValues,"acoesemlote"),servicos:c}),u=()=>Te(e.armazenamento,Mu),g=()=>Te(e.armazenamento,Su),h=()=>Te(e.armazenamento,Cu),b=()=>u()?.includes(Vo)??!1,f=(C,O)=>{let v=n.obter(C);return v||(n.lerDoIframe(r),v=n.obter(C)),{id:C,rotulo:O,dado:v}},E=C=>({id:"personalizar",nome:"Personalizar Menu",grupo:"Acoes",rotulo:"Personalizar menu",icone:"ajustes",executar:()=>o.personalizar?o.personalizar(C):c.legado("personalizar")}),x=C=>{let O=C;if(!O?.closest)return null;let v=O.closest('a[id^="anchorImg"]');if(v){let N=Yo(v.id,"anchorImg");return N&&N!==e.arv.idProcedimento&&lr(e.armazenamento,"menudoc")?{tipo:"documento",ancora:v,id:N}:null}let w=O.closest(`a[id="anchor${e.arv.idProcedimento}"]`);return w&&lr(e.armazenamento,"menuproc")?{tipo:"processo",ancora:w}:null},I=C=>{if(C.tipo==="processo")return{itens:Xc(m(g())),rotulo:"Menu do processo"};let O=r.getElementById(`anchor${C.id}`),v=f(C.id,(O?.textContent??"").replace(/\s+/g," ").trim());return{itens:Kc(v,m(u())),rotulo:"Menu do documento"}},L=null,S=null,M,$=()=>{clearTimeout(M),S&&clearTimeout(S.timer),S=null;let C=L;L=null,C?.menu.fechar()},Z=(C,O)=>{if(L?.ancora===C.ancora)return;$();let{itens:v,rotulo:w}=I(C);if(!v.length)return;let N=ol(C.ancora,v,{rotulo:w,escuro:So(r),focar:O,rodape:[E(C.tipo==="processo"?"processo":"documentos")],aoFechar:()=>{L?.menu===N&&(L=null)},aoEscolher:B=>{Promise.resolve().then(()=>B.executar()).catch(y=>{console.warn("[SEI Pro] menu da \xE1rvore:",y),c.avisar("N\xE3o foi poss\xEDvel concluir a a\xE7\xE3o.",5e3)})}});L={menu:N,ancora:C.ancora},N.el.addEventListener("mouseenter",()=>clearTimeout(M)),N.el.addEventListener("mouseleave",()=>K())},K=()=>{clearTimeout(M),M=setTimeout($,a)},X=C=>{let O=C;return O?!!(L&&(L.ancora.contains(O)||L.menu.el.contains(O))||S?.ancora.contains(O)):!1},A=C=>{if(X(C.target)){clearTimeout(M);return}let O=x(C.target);if(S&&(clearTimeout(S.timer),S=null),!O||O.tipo==="documento"&&b()){L&&K();return}L&&K(),S={ancora:O.ancora,timer:setTimeout(()=>{S=null,Z(O,!1)},t)}},R=C=>{C.relatedTarget||(S&&(clearTimeout(S.timer),S=null),L&&K())},z=C=>{let O=x(C.target);if(O){if(O.tipo==="documento"&&b()){C.preventDefault(),C.stopImmediatePropagation(),L?.ancora===O.ancora?$():Z(O,!1);return}O.tipo==="documento"&&L?.ancora===O.ancora&&$()}},q=C=>{let O=x(C.target);!O||!(C.key==="ArrowDown"||(C.key==="Enter"||C.key===" ")&&O.tipo==="documento"&&b())||(C.preventDefault(),C.stopImmediatePropagation(),Z(O,!0))};r.addEventListener("mouseover",A),r.addEventListener("mouseout",R),r.addEventListener("click",z,!0),r.addEventListener("keydown",q,!0);let Q=null,J=()=>{if(!lr(e.armazenamento,"iconstree")){Na(r);return}Zc(r,e.arv.idProcedimento,f,()=>m(u()),h)},F=()=>{if(!lr(e.armazenamento,"iconstree")){Q?.(),Q=null,Na(r);return}Q??=Qc(r,async(C,O)=>{let v=r.getElementById(`anchor${C}`),w=f(C,(v?.textContent??"").replace(/\s+/g," ").trim());await It(w,m(u()),h()).find(B=>B.modo===O)?.executar()},J),J()};F();let P=Ct(e.armazenamento,r.defaultView,C=>{C!=="painel"&&($(),F())}),D=n.acompanharPastas(r,()=>setTimeout(J,80)),H=Qo(r,()=>{L&&(So(r)?L.menu.el.setAttribute("data-tema","escuro"):L.menu.el.removeAttribute("data-tema"))});return{documentos:n,abrir(C,O=!1){let v=Yo(C.id,"anchorImg");if(v)return Z({tipo:"documento",ancora:C,id:v},O);Z({tipo:"processo",ancora:C},O)},atual:()=>L?.menu??null,parar(){$(),r.removeEventListener("mouseover",A),r.removeEventListener("mouseout",R),r.removeEventListener("click",z,!0),r.removeEventListener("keydown",q,!0),Q?.(),P(),D(),H()}}}var Iu='#topmenu a[target="ifrVisualizacao"][href*="controlador.php?acao=arvore_visualizar"]';function il(o,e,r){for(let t of o.querySelectorAll(Iu)){t.classList.toggle(e,r);let a=[...t.children].find(n=>n.classList.contains(e));if(r&&!a&&t.prepend(l("div",{class:e})),!r)for(let n of[...t.children])n.classList.contains(e)&&n.remove()}}function cl(o){if(o.sigiloso)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;t?.disponivel&&(il(o.doc,"urgentePro",$o(t.valor.especificacao,"URGENTE")),o.usaTrancado&&il(o.doc,"trancadoPro",$o(t.valor.especificacao,"TRANCADO")))},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}function ll(o,e){let r=null,t=null,a=!0,n=new Set,s=()=>{if(r?.parar(),r=null,!Qr(o.armazenamento))return;o.habilitados=Xr(Zr(o.armazenamento)),r=Hi(o),t??=cl(o);let c=new Set($i(o));e.comTitulo&&!o.sigiloso&&c.add("dadosProcesso");for(let p of c)n.has(p)||(n.add(p),o.recarregar(p));a&&rs(o).catch(()=>{}),a=!1};s();let i=Ct(o.armazenamento,e.janela,c=>{c==="painel"&&s()});return{aplicar:s,parar(){i(),r?.parar(),r=null,t?.(),t=null}}}var pl={direitos:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M16.59 8.79A5.6 5.6 0 1 0 16.59 15.21L14.78 13.95A3.4 3.4 0 1 1 14.78 10.05z"],letraC:["M19.28 6.11A9.5 9.5 0 1 0 19.28 17.89L16.21 15.54A5.5 5.5 0 1 1 16.21 8.46z"],link:["M9.01 21.49L12.69 17.81A4.6 4.6 0 0 0 6.19 11.31L2.51 14.99A4.6 4.6 0 0 0 9.01 21.49z","M7.46 19.94L11.14 16.26A2.4 2.4 0 0 0 7.74 12.86L4.06 16.54A2.4 2.4 0 0 0 7.46 19.94z","M17.81 12.69L21.49 9.01A4.6 4.6 0 0 0 14.99 2.51L11.31 6.19A4.6 4.6 0 0 0 17.81 12.69z","M16.26 11.14L19.94 7.46A2.4 2.4 0 0 0 16.54 4.06L12.86 7.74A2.4 2.4 0 0 0 16.26 11.14z","M10.62 15.15L15.15 10.62A1.25 1.25 0 0 0 13.38 8.85L8.85 13.38A1.25 1.25 0 0 0 10.62 15.15z"],subir:["M12 2.5 5.5 9h4.3v7h4.4V9h4.3z","M3 15.5h3v3.5h12v-3.5h3V22H3z"],baixar:["M12 17.5 5.5 11h4.3V3h4.4v8h4.3z","M3 15.5h3v3.5h12v-3.5h3V22H3z"],engrenagem:["M19.84 9.6L22.34 10.18L22.34 13.82L19.84 14.4L19.24 15.85L20.6 18.02L18.02 20.6L15.85 19.24L14.4 19.84L13.82 22.34L10.18 22.34L9.6 19.84L8.15 19.24L5.98 20.6L3.4 18.02L4.76 15.85L4.16 14.4L1.66 13.82L1.66 10.18L4.16 9.6L4.76 8.15L3.4 5.98L5.98 3.4L8.15 4.76L9.6 4.16L10.18 1.66L13.82 1.66L14.4 4.16L15.85 4.76L18.02 3.4L20.6 5.98L19.24 8.15z","M8.4 12a3.6 3.6 0 1 0 7.2 0a3.6 3.6 0 1 0 -7.2 0z"],documentoTexto:["M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M14 3.6v4.4h4.4z","M7.6 12h8.8v1.7H7.6z","M7.6 15.6h8.8v1.7H7.6z"],documentoAssinado:["M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M14 3.6v4.4h4.4z","M8.2 16.2l1.3-1.3 1.6 1.6 3.4-3.4 1.3 1.3-4.7 4.7z"],sincronizar:["M4.48 9.26A8 8 0 0 1 18.3 7.07L16.1 8.8A5.2 5.2 0 0 0 7.11 10.22zM14.22 9.92L19.44 11.76L20.46 6.32z","M19.52 14.74A8 8 0 0 1 5.7 16.93L7.9 15.2A5.2 5.2 0 0 0 16.89 13.78zM9.78 14.08L4.56 12.24L3.54 17.68z"],compartilhar:["M5.5 4H12v2.4H6.4v11.2h11.2V13H20v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5.5A1.5 1.5 0 0 1 5.5 4z","M14.5 2.5H21.5V9.5L18.9 6.9 12.9 12.9 11.1 11.1 17.1 5.1z"],copia:["M9 7h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z","M4 2h10a2 2 0 0 1 2 2v1.5h-2.2V4.2H4.2v10H5.5v2.3H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"],relacionar:["M3 12L3 8.5L6.5 5L14 5L14 2L21 6.5L14 11L14 8L7.5 8L6 9.5L6 12z","M21 12L21 15.5L17.5 19L10 19L10 22L3 17.5L10 13L10 16L16.5 16L18 14.5L18 12z"],pausa:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M8.4 7.5h2.5v9H8.4z","M13.1 7.5h2.5v9h-2.5z"],clipe:["M11.78 20.23L18.98 11.65A5.2 5.2 0 0 0 11.02 4.97L3.82 13.55A5.2 5.2 0 0 0 11.78 20.23z","M10.33 19.01L17.53 10.43A3.3 3.3 0 0 0 12.47 6.19L5.27 14.77A3.3 3.3 0 0 0 10.33 19.01z"],pdf:["M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M14 3.6v4.4h4.4z","M7.2 13h9.6v5H7.2z"],zip:["M6 2h8.5l5.5 5.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z","M10.2 3.2h1.8v1.8h-1.8z","M12 5h1.8v1.8H12z","M10.2 6.8h1.8v1.8h-1.8z","M12 8.6h1.8v1.8H12z","M10.2 10.4h1.8v1.8h-1.8z","M10 13.6h4V19h-4z"],bandeira:["M4.5 2.5h2V22h-2z","M6.5 4C9.5 2.4 12 5.4 15.5 4.4c1.6-.5 2.7-1 4-1.6v10c-1.3.7-2.4 1.2-4 1.7-3.5 1-6-2-9-.5z"],pastaAberta:["M2.5 5.5a2 2 0 0 1 2-2h4.6l2 2.4h7.4a2 2 0 0 1 2 2V10H7.2a2 2 0 0 0-1.9 1.4L2.5 19.6z","M5.9 11.9a1 1 0 0 1 .95-.7H22a.8.8 0 0 1 .76 1.05l-2.3 7.2a1.8 1.8 0 0 1-1.7 1.25H3.6z"],joia:["M2 10.5h4.4V21H2z","M8 10.5l3.4-7.2c.3-.7 1-1.1 1.7-1.1 1.3 0 2.2 1.2 1.9 2.4L14 9h5.5a2.5 2.5 0 0 1 2.4 3.1l-1.7 6.6a2.5 2.5 0 0 1-2.4 1.8H8z"],envelope:["M3 9.4 12 3l9 6.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z","M7.4 11.4h9.2v1.7H7.4z","M7.4 14.9h6v1.7h-6z"],camadas:["M12 2 2 7.5 12 13l10-5.5z","M3.6 11.2 2 12l10 5.5 10-5.5-1.6-.8L12 15.4z","M3.6 15.7 2 16.5 12 22l10-5.5-1.6-.8L12 19.9z"],ordenar:["M6.2 3h2.4v13H11.4l-4 4.6-4-4.6h2.8z","M13 4h4.2v2.3H13z","M13 9h7v2.3h-7z","M13 14h9.2v2.3H13z","M13 19h4v2.3h-4z"],encaminhar:["M14 4 22 11l-8 7v-4C8.8 14 5 16 2.6 20 3.2 13.4 6.9 9.2 14 8.4z"],imprimir:["M7 2h10v5H7z","M5 8.5h14a3 3 0 0 1 3 3V17h-4v-3H6v3H2v-5.5a3 3 0 0 1 3-3z","M7.5 15.5h9V22h-9z","M9.4 17.6h5.2V19H9.4z","M9.4 19.9h5.2v1.3H9.4z"],janelas:["M8 3h11.5A1.5 1.5 0 0 1 21 4.5V15a1.5 1.5 0 0 1-1.5 1.5H18V14.4h.8V7.2H9.2v1.2H7V4.5A1.5 1.5 0 0 1 8.5 3z","M3.5 8.5H15A1.5 1.5 0 0 1 16.5 10v9.5A1.5 1.5 0 0 1 15 21H3.5A1.5 1.5 0 0 1 2 19.5V10a1.5 1.5 0 0 1 1.5-1.5z","M4.2 12h9.6v6.6H4.2z"],proibido:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M12 4a8 8 0 1 1 0 16 8 8 0 0 1 0-16z","M5.56 7.12 7.12 5.56 18.44 16.88 16.88 18.44z"],ramificacao:["M6 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z","M6 16.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z","M18 2.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z","M5 7.6h2v8.8H5z","M17 7.6h2V9a4.2 4.2 0 0 1-4.2 4.2H11a2.6 2.6 0 0 0-2.6 2.6v.6H6.4v-.6A4.6 4.6 0 0 1 11 11.2h3.8A2.2 2.2 0 0 0 17 9z"],circulo:["M17.1 3.17A10.2 10.2 0 1 1 8.51 2.42L9.4 4.86A7.6 7.6 0 1 0 15.8 5.42z"],caneta:["M15.6 2.4 21.6 8.4 10.8 19.2 3.6 20.4l1.2-7.2z","M14.6 8.6a1.7 1.7 0 1 0 2.4 2.4 1.7 1.7 0 0 0-2.4-2.4z"],estrela:["M12 2l2.9 6.9 7.1.6-5.4 4.7 1.7 7.3L12 17.8l-6.3 3.7 1.7-7.3L2 9.5l7.1-.6z"],arroba:["M20.6 18.02A10.5 10.5 0 1 1 22.5 12L20.2 12A8.2 8.2 0 1 0 18.72 16.7z","M7.6 12a4.4 4.4 0 1 0 8.8 0a4.4 4.4 0 1 0 -8.8 0z","M9.8 12a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0z","M15.6 8.4h2.4v8.4h-2.4z"],pastaSeta:["M2.5 5.5a2 2 0 0 1 2-2h4.6l2 2.4h8.4a2 2 0 0 1 2 2v10.2a2 2 0 0 1-2 2H4.5a2 2 0 0 1-2-2z","M7 11.2h5.6V9.2l4.2 3.3-4.2 3.3v-2H7z"],megafone:["M3 9.2h4.2L16.4 4v16l-9.2-5.2H3z","M5 15.6h3l1.2 5H6.4z","M18.4 8.6l2.8-1.6.9 1.5-2.8 1.6z","M18.6 11.2h3.4v1.8h-3.4z","M18.4 15.2l2.8 1.6-.9 1.5-2.8-1.6z"],linkExterno:["M5.5 4H11v2.4H6.4v11.2h11.2V13H20v6a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V5.5A1.5 1.5 0 0 1 5.5 4z","M14 2.5h7.5V10L18.7 7.2 11.9 14 10.1 12.2 16.9 5.4z"],cursor:["M5 2l14 10.5-6.2 1 3.7 7-2.8 1.5-3.7-7L5 20z"],circuloSeta:["M22.5 12A10.5 10.5 0 1 1 22.5 11.98L20.3 11.99A8.3 8.3 0 1 0 20.3 12z","M7.11 10.22A5.2 5.2 0 0 1 17.2 12L15 12A3 3 0 0 0 9.18 10.97z"],arvore:["M9 2h6v5H9z","M2 16h6v5H2z","M16 16h6v5h-6z","M11 7h2v3.5h6V16h-2v-3.5H7V16H5v-5.5h6z"],informacao:["M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21z","M10.7 10.5h2.6V18h-2.6z","M10.6 6h2.8v2.6h-2.8z"]},dl="http://www.w3.org/2000/svg";function Lu(o){return o in pl?pl[o]:aa[o]}function Lt(o,e=16,r=document){let t=r.createElementNS(dl,"svg"),a={viewBox:"0 0 24 24",width:String(e),height:String(e),fill:"currentColor",stroke:"none","aria-hidden":"true",focusable:"false",class:"spro-glifo spro-icone"};for(let[s,i]of Object.entries(a))t.setAttribute(s,i);let n=r.createElementNS(dl,"path");return n.setAttribute("d",Lu(o).join("")),n.setAttribute("fill-rule","evenodd"),t.append(n),t}var ml=o=>`optionsFlashMenu_${o.bloco}`,za=o=>o.id==="documentos";function Ot(o,e){let t=Te(o,e.chave)??e.padrao,a=new Set(e.itens.map(i=>i.nome)),n=[];for(let i of t){let c=Pa(i);a.has(c)&&!n.includes(c)&&n.push(c)}let s=[...n.map(i=>({nome:i,ativo:!0})),...e.itens.filter(i=>!n.includes(i.nome)).map(i=>({nome:i.nome,ativo:!1}))];return{geral:Oe(o,ml(e))!=="disabled",linhas:s,aoClicar:za(e)&&t.includes(Vo)}}function fl(o,e){let r=e.linhas.filter(t=>t.ativo).map(t=>t.nome);return za(o)&&e.aoClicar?[Vo,...r]:r}function Ra(o,e,r){o.setItem(e.chave,JSON.stringify(fl(e,r).map(t=>[t])))}function $a(o,e,r){Ts(o,ml(e),r?"enabled":"disabled")}function gl(o,e){return fl(o,{linhas:e.linhas,aoClicar:!1}).length===0&&!(za(o)&&e.aoClicar)}function vl(o,e){let r=!1;if(o.removeItem)try{o.removeItem(e.chave),r=!0}catch{r=!1}return r||o.setItem(e.chave,JSON.stringify(e.padrao.map(t=>[t]))),$a(o,e,!0),Ot(o,e)}var ul=o=>et(o).toLowerCase().trim();function Ha(o,e){let r=ul(e),t=new Set;for(let a of o)(!r||ul(`${a.nome} ${a.dica??""} ${a.grupo??""}`).includes(r))&&t.add(a.nome);return t}function hl(o){return{ativos:o.filter(e=>e.ativo).length,total:o.length}}function bl(o,e,r,t=()=>!0){let a=o.findIndex(i=>i.nome===e);if(a<0||!o[a].ativo)return[...o];let n=a+r;for(;n>=0&&n<o.length&&!(o[n].ativo&&t(o[n].nome));)n+=r;if(n<0||n>=o.length)return[...o];let s=[...o];return[s[a],s[n]]=[s[n],s[a]],s}function qa(o,e,r,t=()=>!0){let a=o.findIndex(n=>n.nome===e);if(a<0||!o[a].ativo)return!1;for(let n=a+r;n>=0&&n<o.length;n+=r)if(o[n].ativo&&t(o[n].nome))return!0;return!1}function xl(o,e,r){let t=o.find(s=>s.nome===e);if(!t||e===r)return[...o];let a=o.filter(s=>s.nome!==e),n=r===null?a.length:a.findIndex(s=>s.nome===r);return a.splice(n<0?a.length:n,0,t),a}var Tt=new WeakMap,Ou=(o,e)=>`${o} de ${e} ativos`;function Al(o,e,r){return l("button",{type:"button",role:"switch",class:"spro-pp-switch","aria-checked":String(e),"aria-label":o,...r?{"aria-describedby":r}:{}},l("span",{class:"spro-pp-knob","aria-hidden":"true"}))}var Fa=(o,e)=>{o.setAttribute("aria-checked",String(e))};function El(o){let e=Tt.get(o.topo);if(e?.dialogo.el.isConnected)return o.aba&&e.selecionar(o.aba),e;let r=o.armazenamento,t=o.aoMudar??(v=>Mt(v)),a=o.confirmar??((v,w)=>ee({topo:o.topo,doc:o.doc},v,w)),n="",s=o.aba??"processo",i,c=null,p=null,d=new Map,m=l("input",{type:"search",class:"spro-campo spro-pp-busca",placeholder:"Buscar item pelo nome","aria-label":"Buscar item pelo nome",autocomplete:"off",spellcheck:"false"}),u=l("button",{type:"button",class:"spro-botao pequeno"},"Restaurar padr\xE3o"),g=l("span",{class:"spro-pp-situacao",role:"status","aria-live":"polite"},"As mudan\xE7as s\xE3o salvas na hora."),h=l("div",{class:"spro-pp-abas",role:"tablist","aria-label":"Partes do menu r\xE1pido"}),b=l("div",{class:"spro-pp-palco"}),f=v=>{g.textContent=v},E=()=>{f("Salvo."),g.setAttribute("data-salvo",""),clearTimeout(i),i=setTimeout(()=>{g.removeAttribute("data-salvo"),f("As mudan\xE7as s\xE3o salvas na hora.")},2200)},x=ao({topo:o.topo,doc:o.doc},{titulo:"Personalizar menu r\xE1pido",icone:"ajustes",largura:660,conteudo:[l("div",{class:"spro-pp-topo"},m,u),h,b,l("div",{class:"spro-pp-rodape"},g)],aoFechar:()=>{clearTimeout(i),L(),Tt.get(o.topo)?.dialogo===x&&Tt.delete(o.topo)}});x.el.classList.add("spro-pp");let I=()=>{So(o.doc)?x.el.setAttribute("data-tema","escuro"):x.el.removeAttribute("data-tema");let v=Ft(o.doc)??Ft(o.topo);v?(x.el.style.setProperty("--spro-cor-sei",v),x.el.setAttribute("data-cor-sei","")):(x.el.style.removeProperty("--spro-cor-sei"),x.el.removeAttribute("data-cor-sei"))};I();let L=Qo(o.doc,I),S=(v,w)=>{try{return w(),x.erro(""),t(v.def.id),E(),!0}catch{return x.erro("N\xE3o foi poss\xEDvel salvar a personaliza\xE7\xE3o neste navegador (armazenamento cheio ou bloqueado)."),v.estado=Ot(r,v.def),P(v),!1}},M=v=>{let w=Ha($(v.def),n);return N=>w.has(N)};function $(v){return v.id==="documentos"?[Ca,...v.itens]:[...v.itens]}let Z=(v,w)=>v.itens.find(N=>N.nome===w)??{nome:w,glifo:"documentoTexto"};function K(v,w,N,B,y){let T=`spro-pp-${v.def.id}-${N}`,U=l("span",{class:"spro-pp-nome"},w.nome),j=w.dica?l("span",{class:"spro-pp-dica",id:`${T}-dica`},w.dica):null,io=Al(w.nome,B,j?`${T}-dica`:void 0),eo=l("li",{class:"spro-pp-linha","data-nome":w.nome,"data-ativo":String(B)},y?l("span",{class:"spro-pp-alca",draggable:"true","aria-hidden":"true"},W("alca",14,o.topo)):l("span",{class:"spro-pp-alca vazio","aria-hidden":"true"}),l("span",{class:"spro-pp-glifo","aria-hidden":"true"},Lt(w.glifo,16,o.topo)),l("span",{class:"spro-pp-texto"},U,j),w.grupo?l("span",{class:"spro-pp-grupo"},w.grupo):null);if(y){let so=l("button",{type:"button",class:"spro-botao-icone spro-pp-mover","data-mover":"subir","aria-label":`Subir ${w.nome}`},W("setaCima",14,o.topo)),no=l("button",{type:"button",class:"spro-botao-icone spro-pp-mover","data-mover":"descer","aria-label":`Descer ${w.nome}`},W("setaBaixo",14,o.topo));so.addEventListener("click",()=>R(v,w.nome,-1,"subir")),no.addEventListener("click",()=>R(v,w.nome,1,"descer")),eo.append(l("span",{class:"spro-pp-setas"},so,no))}else eo.append(l("span",{class:"spro-pp-setas vazio","aria-hidden":"true"}));return eo.append(io),io.addEventListener("click",()=>z(v,w.nome,eo,io)),eo.addEventListener("keydown",so=>{let no=so;!y||!no.altKey||no.key!=="ArrowUp"&&no.key!=="ArrowDown"||(no.preventDefault(),no.stopPropagation(),R(v,w.nome,no.key==="ArrowUp"?-1:1,"switch"))}),y&&X(v,eo,w.nome),eo}function X(v,w,N){w.querySelector(".spro-pp-alca")?.addEventListener("dragstart",B=>{let y=B;p=N,y.dataTransfer?.setData("text/plain",N),y.dataTransfer&&(y.dataTransfer.effectAllowed="move"),w.setAttribute("data-arrastando","")}),w.querySelector(".spro-pp-alca")?.addEventListener("dragend",()=>{p=null,w.removeAttribute("data-arrastando");for(let B of v.lista.querySelectorAll("[data-sobre]"))B.removeAttribute("data-sobre")}),w.addEventListener("dragover",B=>{!p||p===N||(B.preventDefault(),w.setAttribute("data-sobre",""))}),w.addEventListener("dragleave",()=>w.removeAttribute("data-sobre")),w.addEventListener("drop",B=>{B.preventDefault(),w.removeAttribute("data-sobre");let y=p;if(p=null,!y||y===N)return;let T=v.estado.linhas,U=T.findIndex(eo=>eo.nome===y),j=T.findIndex(eo=>eo.nome===N);if(U<0||j<0)return;let io=U<j?T[j+1]?.nome??null:N;A(v,xl(T,y,io),{nome:y,controle:"switch"})})}function A(v,w,N){let B=v.estado.linhas;v.estado={...v.estado,linhas:w},!w.every((y,T)=>y.nome===B[T]?.nome)&&(c=N,S(v,()=>Ra(r,v.def,v.estado))&&P(v))}function R(v,w,N,B){v.estado.geral&&A(v,bl(v.estado.linhas,w,N,M(v)),{nome:w,controle:B})}function z(v,w,N,B){if(v.estado.geral){if(w===Vo)v.estado={...v.estado,aoClicar:!v.estado.aoClicar},Fa(B,v.estado.aoClicar),N.setAttribute("data-ativo",String(v.estado.aoClicar));else{v.estado={...v.estado,linhas:v.estado.linhas.map(T=>T.nome===w?{...T,ativo:!T.ativo}:T)};let y=v.estado.linhas.find(T=>T.nome===w)?.ativo??!1;Fa(B,y),N.setAttribute("data-ativo",String(y))}S(v,()=>Ra(r,v.def,v.estado)),F(v)}}function q(v){v.estado={...v.estado,geral:!v.estado.geral},S(v,()=>$a(r,v.def,v.estado.geral)),P(v)}async function Q(){let v=d.get(s);if(!(!v||!await a(`Restaurar o padr\xE3o de \u201C${v.def.titulo}\u201D? Os itens e a ordem voltam ao padr\xE3o do SEI Pro e a fun\xE7\xE3o fica ligada.`,"Restaurar"))){try{v.estado=vl(r,v.def),x.erro(""),t(v.def.id),E(),f("Padr\xE3o restaurado.")}catch{x.erro("N\xE3o foi poss\xEDvel salvar a personaliza\xE7\xE3o neste navegador (armazenamento cheio ou bloqueado).");return}P(v)}}function J(v){if(!v.def.ordenavel)return;let w=M(v);for(let N of v.lista.querySelectorAll("li")){let B=N.getAttribute("data-nome")??"",y=N.querySelector('button[data-mover="subir"]'),T=N.querySelector('button[data-mover="descer"]');y&&(y.disabled=!v.estado.geral||!qa(v.estado.linhas,B,-1,w)),T&&(T.disabled=!v.estado.geral||!qa(v.estado.linhas,B,1,w));let U=v.estado.linhas.find(io=>io.nome===B)?.ativo===!0,j=N.querySelector(".spro-pp-alca[draggable]");j&&j.setAttribute("draggable",String(U&&v.estado.geral))}}function F(v){J(v);let{ativos:w,total:N}=hl(v.estado.linhas);v.contador.textContent=Ou(w,N),v.semNada.hidden=!(v.estado.geral&&gl(v.def,v.estado))}function P(v){let{def:w,estado:N}=v;Fa(v.geral,N.geral),v.painel.setAttribute("data-geral",String(N.geral)),v.lista.setAttribute("aria-disabled",String(!N.geral));let B=[];if(w.id==="documentos"){let y=K(v,Ca,0,N.aoClicar,!1);y.classList.add("spro-pp-especial"),B.push(y)}for(let[y,T]of N.linhas.entries())B.push(K(v,Z(w,T.nome),y+1,T.ativo,w.ordenavel));v.lista.replaceChildren(...B);for(let y of v.lista.querySelectorAll("button"))y.disabled=!N.geral;if(F(v),D(v),c){let y=[...v.lista.querySelectorAll("li")].find(U=>U.getAttribute("data-nome")===c?.nome),T=y?.querySelector(c.controle==="switch"?"button[role=switch]":`button[data-mover="${c.controle}"]`);(T&&!T.disabled?T:y?.querySelector("button[role=switch]"))?.focus?.({preventScroll:!1}),c=null}}function D(v){let w=M(v),N=0;for(let y of v.lista.querySelectorAll("li")){let T=w(y.getAttribute("data-nome")??"");y.hidden=!T,T&&(N+=1)}J(v),v.vazioBusca.hidden=N>0,v.vazioBusca.textContent=`Nenhum item com \u201C${n.trim()}\u201D.`;let B=[...Ha($(v.def),n)].length;v.contaDaAba.textContent=n.trim()?String(B):"",v.contaDaAba.hidden=!n.trim(),v.botaoAba.setAttribute("aria-label",n.trim()?`${v.def.rotulo} (${B} ${B===1?"item":"itens"} com a busca)`:v.def.rotulo)}function H(v){let w=Ot(r,v),N=`spro-pp-aba-${v.id}`,B=`spro-pp-painel-${v.id}`,y=l("span",{class:"spro-pp-aba-conta",hidden:!0}),T=l("button",{type:"button",role:"tab",id:N,class:"spro-pp-aba","aria-controls":B,"aria-selected":"false",tabindex:"-1","data-aba":v.id},l("span",{class:"spro-pp-aba-glifo","aria-hidden":"true"},Lt(v.glifo,15,o.topo)),l("span",{},v.rotulo),y),U=Al(v.rotuloGeral,w.geral);U.classList.add("spro-pp-geral");let j=l("span",{class:"spro-pp-contador",role:"status","aria-live":"polite"}),io=l("p",{class:"spro-pp-aviso",role:"status",hidden:!0},"Nenhum item marcado: o SEI Pro usa a lista padr\xE3o. Para esconder tudo, desligue a chave de cima."),eo=l("p",{class:"spro-pp-vazio",role:"status",hidden:!0}),so=l("ul",{class:"spro-pp-lista","aria-label":v.titulo}),no=o.avisos?.[v.id],No=l("div",{role:"tabpanel",id:B,class:"spro-pp-painel","aria-labelledby":N,hidden:!0,"data-aba":v.id},l("div",{class:"spro-pp-cabeca"},l("span",{class:"spro-pp-cabeca-glifo","aria-hidden":"true"},Lt(v.glifo,20,o.topo)),l("div",{class:"spro-pp-cabeca-texto"},l("h3",{},v.titulo),l("p",{},v.descricao)),U),no?l("p",{class:"spro-pp-aviso",role:"note"},no):null,l("div",{class:"spro-pp-resumo"},j),io,so,eo),_={def:v,estado:w,botaoAba:T,contaDaAba:y,painel:No,geral:U,contador:j,semNada:io,vazioBusca:eo,lista:so};return U.addEventListener("click",()=>q(_)),T.addEventListener("click",()=>C(v.id,!0)),T.addEventListener("keydown",G=>{let oo=G,vo=Uo.findIndex(_o=>_o.id===v.id),Co=_o=>{oo.preventDefault();let Er=Uo[(_o+Uo.length)%Uo.length];Er&&C(Er.id,!0)};oo.key==="ArrowRight"?Co(vo+1):oo.key==="ArrowLeft"?Co(vo-1):oo.key==="Home"?Co(0):oo.key==="End"&&Co(Uo.length-1)}),_}function C(v,w=!1){s=v;for(let[N,B]of d){let y=N===v;B.painel.hidden=!y,B.botaoAba.setAttribute("aria-selected",String(y)),B.botaoAba.tabIndex=y?0:-1,y&&w&&B.botaoAba.focus?.({preventScroll:!0})}}for(let v of Uo){let w=H(v);d.set(v.id,w),h.append(w.botaoAba),b.append(w.painel),P(w)}C(s),m.addEventListener("input",()=>{n=m.value;for(let v of d.values())D(v)}),m.addEventListener("keydown",v=>{v.key==="Escape"&&m.value&&(v.preventDefault(),v.stopPropagation(),m.value="",m.dispatchEvent(new o.topo.defaultView.Event("input",{bubbles:!0})))}),u.addEventListener("click",()=>void Q());let O={dialogo:x,selecionar:v=>C(v),fechar:()=>x.fechar()};return Tt.set(o.topo,O),O}function Tu(o){let e={};if(!zo(o,"menurapido")){let r="O menu r\xE1pido est\xE1 desligado nas Op\xE7\xF5es do SEI Pro. Estas escolhas ficam salvas e passam a valer quando voc\xEA o ligar.";e.processo=r,e.documentos=r,e.arvore=r}return zo(o,"infoarvore")||(e.painel="Os pain\xE9is da \xE1rvore est\xE3o desligados nas Op\xE7\xF5es do SEI Pro. Estas escolhas ficam salvas e passam a valer quando voc\xEA os ligar."),e}function yl(o){return e=>{o.dataValues().catch(()=>{}).then(r=>(o.abrir??El)({topo:o.topo(),doc:o.doc,armazenamento:o.armazenamento,...e?{aba:e}:{},avisos:Tu(r)})).catch(r=>console.warn("[SEI Pro] personalizar menu:",r))}}function Pl(o,e){let r=()=>{o.documentElement?.setAttribute(pn,"1"),e()};return o.addEventListener(Ht,r),()=>o.removeEventListener(Ht,r)}function Dl(o){return o==="pronto"?"pronto":o.fase==="coletando"?`coletando:${o.feito}/${o.total}`:o.fase==="erro"?`erro:${o.mensagem}`:null}function wl(o){return o==="pronto"?"pronto":o.fase==="contando"?`contando:${o.feito}/${o.total}`:o.fase==="parou"?`parou:${o.restantes}`:o.fase==="erro"?`erro:${o.mensagem}`:null}var ku=["dadosProcesso","marcador"],Nu=o=>!!o&&typeof o=="object"&&o.codigo==="CANCELADO";function _u(o){return o.fase==="carregando"||o.fase==="pausada"?{fase:"contando",feito:o.feitas,total:o.total}:o.fase==="concluida"?o.falhas.length?{fase:"erro",mensagem:`${o.falhas.length===1?"1 pasta n\xE3o carregou":`${o.falhas.length} pastas n\xE3o carregaram`}.`}:"pronto":o.fase==="parada"||o.fase==="teto"?{fase:"parou",restantes:o.restantes}:o.fase==="interrompida"?o.motivo==="sessao"?{fase:"erro",mensagem:"A sess\xE3o do SEI expirou."}:o.motivo==="ocupada"?{fase:"erro",mensagem:"Outra carga de pastas est\xE1 em andamento."}:{fase:"erro",mensagem:`${o.falhas.length} pastas n\xE3o carregaram.`}:{fase:"parada"}}function Sl(o,e,r={}){let t=null,a=b=>{let f=Dl(b);f===null?o.documentElement?.removeAttribute(Ir):o.documentElement?.setAttribute(Ir,f)},n=()=>{e().then(b=>{if(!(!b||b.sigiloso))for(let f of ku)b.loja.ler(f).estado!=="pronto"&&b.recarregar(f)}).catch(b=>console.warn("[SEI Pro] capa do processo:",b))},s=()=>{if(t)return;let b=new AbortController;t=b,a({fase:"coletando",feito:0,total:0}),e().then(async f=>{if(!f||f.sigiloso)throw new Error("O hist\xF3rico n\xE3o est\xE1 dispon\xEDvel para este processo.");await De(f,{sinal:b.signal,aoProgresso:(E,x)=>a({fase:"coletando",feito:E,total:x})}),a("pronto")}).catch(f=>{Nu(f)||b.signal.aborted?a({fase:"parada"}):a({fase:"erro",mensagem:Ko(f)})}).finally(()=>{t=null})},i=()=>t?.abort(),c=null,p=null,d=!1,m=b=>{let f=wl(b);f===null?o.documentElement?.removeAttribute(Ye):o.documentElement?.setAttribute(Ye,f)},u=()=>{p?.(),p=null,c?.destruir(),c=null},g=()=>{if(d=!1,c){let E=c.estado().fase;if(E==="carregando"||E==="pausada")return;c.continuar();return}let b=Ve(o,{abrirCarregadas:!1,...r});c=b;let f=!1;p=b.aoMudar(E=>{if(f||d)return;let x=_u(E);m(x),E.fase==="concluida"&&c===b&&(f=!0,b.encerrar(!0),f=!1,x==="pronto"&&u())}),b.iniciar(),b.estado().fase==="ociosa"&&(u(),m("pronto"))},h=()=>{let b=c;b&&(b.parar(),b.encerrar(!0),d=!0,m({fase:"parou",restantes:b.pendentes().length}))};return o.addEventListener(Sr,n),o.addEventListener(Mr,s),o.addEventListener(Cr,i),o.addEventListener(Lr,g),o.addEventListener(Or,h),()=>{u(),o.documentElement?.removeAttribute(Ye),o.removeEventListener(Lr,g),o.removeEventListener(Or,h),o.removeEventListener(Sr,n),o.removeEventListener(Mr,s),o.removeEventListener(Cr,i)}}function zu(o,e){let r=o.replace(/\s+/g," ").trim();return r?`${r} | SEI - Processo ${e}`:`SEI - Processo ${e}`}function Ml(o){if(o.sigiloso||o.consultasDesativadas)return()=>{};let e=()=>{let t=o.loja.ler("dadosProcesso").dado;if(!t||!t.disponivel)return;let a=zu(t.valor.especificacao,o.protocolo);o.topo.title!==a&&(o.topo.title=a)},r=o.loja.aoMudar(t=>{t==="dadosProcesso"&&e()});return e(),r}var Va=null,Il=yl({doc:document,topo:Je,armazenamento:localStorage,dataValues:async()=>(await chrome.storage.sync.get("dataValues")).dataValues});Sn(`${Ba}
${on}`);Ea(window)&&(Oc(document),Tc(document));Aa(window)&&(Cc(document),Ic(document),Lc(document));var Cl=window;if(!Cl.__seiProProcessoPaineis&&Aa(window)&&!ya(window)){Cl.__seiProProcessoPaineis=!0,Ds(document,Ua),Pl(document,Il),Sl(document,Ua);let o=()=>void $u().catch(e=>console.warn("[SEI Pro] pain\xE9is do processo:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}if(yc(window)&&!ya(window)){let o=()=>void Pc().catch(e=>console.warn("[SEI Pro] aviso de n\xE3o assinados:",e));document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o,{once:!0}):o()}function Ua(){return Va??=Ru().catch(o=>{throw Va=null,o}),Va}async function Ru(){let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=await gr(document);if(!e)return console.warn("[SEI Pro] pain\xE9is do processo: a \xE1rvore n\xE3o chegou no prazo."),null;let r=Je(),t=vt(r),a=e.nivel==="sigiloso",n=new Ce(yr(chrome.storage.local,"local"),gt(t.host,t.login),e.idProcedimento,{sigiloso:a}),s=Xe(location.href),i=Dr(o,"disablequery"),c=Mc({http:s,arv:e,loja:n,unidadeSigla:t.unidade.sigla,consultasDesativadas:i});return ic({doc:document,topo:r,arv:e,loja:n,...t,habilitados:Xr(Zr(localStorage)),armazenamento:localStorage,consultasDesativadas:i,reaberturaProgramada:Dr(o,"reaberturaprogramada"),usaTrancado:chrome.runtime.getManifest().short_name==="SEI Pro Lab",recarregar:p=>{let d=c[p];d&&n.carregar(p,d)}})}async function $u(){if(!document.querySelector("#topmenu")&&!document.querySelector("#divArvore")&&!document.getElementById("frmArvore"))return;let{dataValues:o}=await chrome.storage.sync.get("dataValues"),e=zo(o,"infoarvore"),r=zo(o,"menurapido"),t=zo(o,ln),a=!Dr(o,"disablequery")&&Ea(window.top);if(!e&&!r&&!t&&!a)return;let n=await Ua();n&&(a&&!n.sigiloso&&(Ml(n),e&&Qr(localStorage)||n.recarregar("dadosProcesso")),e&&ll(n,{comTitulo:a,janela:window}),r&&sl({ctx:n,dataValues:o,http:Xe(location.href),personalizar:s=>Il(s)}),t&&Sc(n))}})();
