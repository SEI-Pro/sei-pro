/* GERADO por projetos/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
import{Ea as lo,Ha as uo,I as A,Ia as mo,Ja as fo,L as ao,M as to,N as so,P as no,Q as w,W as io,a as Z,b as oo,d as a,e as $,g as L,ja as po,ka as co,s as V,sa as F,w as ro,z as eo}from"./pagina-comum.js";var bo=`/*
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
`;var Lo=new Set(["criarProjeto","editarProjeto","arquivarProjeto","reativarProjeto","removerProjeto","restaurarProjeto","duplicarProjeto","criarFase","renomearFase","removerFase","criarEtapa","duplicarEtapa","editarEtapa","moverDatas","concluirEtapa","concluirSeAberta","reabrirEtapa","removerEtapa","restaurarEtapa","redefinirPlanoOriginal","criarProjetoDeModelo","salvarComoModelo","renomearModelo","removerModelo","importar","anotarVisibilidade"]),G="Sem o \u201CEntendi\u201D, os projetos de \u201CToda a unidade\u201D n\xE3o mudam. Para um projeto s\xF3 seu, escolha \u201CS\xF3 eu\u201D.",Vo="N\xE3o foi poss\xEDvel guardar a sua confirma\xE7\xE3o. Tente de novo.",_o="N\xE3o foi poss\xEDvel guardar a sua escolha. Tente de novo.",Ho="N\xE3o foi poss\xEDvel ler a sua confirma\xE7\xE3o. Tente de novo.";async function Bo(o){try{return await o.estado()}catch(r){throw console.warn("[SEI Pro] projetos: consentimento n\xE3o lido:",r instanceof Error?r.message:String(r)),new w([Ho])}}async function Fo(o,r){try{await o.definir(r)}catch(e){throw console.warn("[SEI Pro] projetos: consentimento n\xE3o gravado:",e instanceof Error?e.message:String(e)),new w([r==="ligado"?Vo:_o])}}function go(o,r){return new Proxy(o,{get(e,t,i){let s=Reflect.get(e,t,i);if(typeof s!="function")return s;let p=s.bind(e);return typeof t!="string"||!Lo.has(t)?p:async(...l)=>{if(!await r())throw new w([G]);return p(...l)}}})}function xo(o,r){let e=null;return async()=>await Bo(o)==="ligado"?!0:(e??=(async()=>{try{let t=await r();return t&&await Fo(o,"ligado"),t}finally{e=null}})(),e)}function U(o){if(!/^\d{4}-\d{2}-\d{2}$/.test(o))return null;let r=Number(o.slice(0,4));return r<2e3||r>2100?null:Z(oo(o))===o?o:null}function Go(o){let r=typeof o.protocolo=="string"?o.protocolo.trim():"";if(!ao.test(r)||!A(r))throw new w(["N\xE3o foi poss\xEDvel ler o n\xFAmero deste processo na tela do SEI."]);let e={protocolo:r};return typeof o.idProcedimento=="string"&&to.test(o.idProcedimento)&&(e.idProcedimento=o.idProcedimento),o.sigiloso===!0&&(e.sigiloso=!0),e}var X="Este j\xE1 \xE9 o processo do projeto.";async function ho(o,r,e){let t=Go(r.processo),i=o[r.vis],s=await i.obterProjeto(r.projeto);if(!s)throw new w(["O projeto n\xE3o existe mais."]);if(r.como==="projeto"){let j=s.processo;return typeof j?.protocolo=="string"&&A(j.protocolo)===A(t.protocolo)?X:(await i.editarProjeto(s.id,{processo:t}),`Este \xE9 agora o processo do projeto \u201C${s.nome}\u201D.`)}if(r.como==="ligar"){let j=r.etapa?await i.obterEtapa(r.etapa):void 0;if(!j||j.projeto!==s.id)throw new w(["Escolha a etapa."]);if(j.concluidaEm)throw new w(["Esta etapa j\xE1 foi conclu\xEDda."]);return await i.editarEtapa(j.id,{processo:t},e),`Processo ligado \xE0 etapa \u201C${j.nome}\u201D.`}let p=(r.nome??"").trim();if(!p)throw new w(["Informe o nome da etapa."]);let l=U(r.inicio??"");if(!l)throw new w(["Escolha a data de in\xEDcio (entre 2000 e 2100)."]);let c=Number(r.duracao);if(!Number.isInteger(c)||c<1||c>V)throw new w([`A dura\xE7\xE3o vai de 1 a ${V} dias \xFAteis.`]);return`Etapa \u201C${(await i.criarEtapa({projeto:s.id,nome:p,inicio:l,fim:eo(l,c),processo:t})).nome}\u201D adicionada a \u201C${s.nome}\u201D.`}var vo="Esta etapa j\xE1 foi conclu\xEDda (ou n\xE3o existe mais).";async function wo(o,r,e,t,i){let s=U(i);if(!s)throw new w(["Escolha a data da conclus\xE3o (entre 2000 e 2100)."]);let p;if(t?.numero){p={numero:t.numero.trim()};let m=t.titulo?.trim().slice(0,L.nome);m&&(p.titulo=m)}if(p){let m=io(p);if(m.length)throw new w(m)}let l=await o[r].obterEtapa(e);if(!l||l.concluidaEm)throw new w([vo]);let c=await o[r].concluirSeAberta(e,s,p);if(!c)throw new w([vo]);return`\u201C${c.nome}\u201D ${c.marco?"cumprido":"conclu\xEDda"} em ${s.split("-").reverse().join("/")}.`}var Uo=`:host{all:initial}
.pb{box-sizing:border-box;width:340px;max-width:var(--pb-max,340px);display:grid;gap:8px;padding:12px 14px;font:13px/1.4 var(--spro-fonte);color:var(--spro-texto);background:var(--spro-fundo);border:1px solid var(--spro-borda);border-radius:12px;box-shadow:var(--spro-sombra-3)}
.pb-cab{display:flex;align-items:center;gap:10px}
.pb-ic{display:grid;place-items:center;width:32px;height:32px;flex:none;border-radius:8px;color:var(--spro-destaque);background:var(--spro-destaque-suave)}
.pb-tit{flex:1;min-width:0;display:grid;line-height:1.25}
.pb-tit b{font-size:13.5px}
.pb-tit small{color:var(--spro-suave);font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pb-vinc{display:grid;gap:4px;padding:8px 10px;border:1px solid var(--spro-borda);border-radius:10px}
.pb-proj{display:flex;align-items:center;gap:6px;min-width:0;color:var(--spro-suave);font-size:12px}
.pb-proj span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pb-etapa{display:flex;align-items:center;gap:8px;min-width:0;font-weight:600}
.pb-etapa .pb-nome{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pb-data{margin-left:auto;color:var(--spro-suave);font-size:12px;font-weight:400;white-space:nowrap}
.pb-atrasada .pb-data{color:var(--spro-perigo)}
.pb-mais,.pb-vazio{color:var(--spro-suave);font-size:12px}
.pb-botoes{display:flex;flex-wrap:wrap;gap:6px;padding-top:4px}
.pb-rod{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;padding-top:4px}
.pb-form{display:grid;gap:10px;padding-top:10px;border-top:1px solid var(--spro-borda)}
.pb-vinc .pb-form{padding-top:8px}
.pb-form-como{display:grid;gap:10px}
.pb-campo{display:grid;gap:5px}
.pb-rotulo{font-size:12px;font-weight:600;color:var(--spro-suave)}
.pb-linha2{display:flex;gap:8px}
.pb-linha2>*{flex:1;min-width:0}
.pb-campo .spro-campo{box-sizing:border-box;width:100%}
.pb-dica{margin:0;color:var(--spro-suave);font-size:12px}
.pb-ok{margin:0;color:var(--spro-ok);font-size:12px}
.pb-erro{margin:0;color:var(--spro-perigo);font-size:12px}
.pb-nota{margin:0;color:var(--spro-suave);font-size:12px}
.pb-erro:empty,.pb-nota:empty,.pb-slot:empty{display:none}
.pb-pergunta{display:grid;gap:8px;padding:8px 10px;border:1px solid color-mix(in srgb,var(--spro-aviso) 35%,transparent);border-radius:8px;background:color-mix(in srgb,var(--spro-aviso) 8%,var(--spro-fundo))}
.pb-pergunta p{margin:0}
.pb .spro-segmentado{justify-self:start;flex-wrap:wrap}
.prj-st{flex:none}
.prj-st .prj-st-cor{fill:none;stroke-width:1.6}
.prj-st-concluida .prj-st-cor,.prj-st-atrasada .prj-st-cor{stroke:none}
.prj-st-concluida .prj-st-cor{fill:var(--spro-ok)}
.prj-st-atrasada .prj-st-cor{fill:var(--spro-perigo)}
.prj-st-andamento .prj-st-cor{stroke:var(--spro-destaque)}
.prj-st-andamento .prj-st-meio{fill:var(--spro-destaque)}
.prj-st-futura .prj-st-cor{stroke:var(--spro-borda-forte);stroke-dasharray:2.4 2}
.prj-st-sinal{fill:none;stroke:var(--spro-fundo);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.prj-st-ponto{fill:var(--spro-fundo)}
.prj-st-marco.prj-st-andamento .prj-st-cor,.prj-st-marco.prj-st-futura .prj-st-cor{stroke:var(--spro-novidade);stroke-dasharray:none}
.prj-st-marco.prj-st-atrasada .prj-st-cor{fill:none;stroke:var(--spro-perigo)}`,yo="button:not([disabled]), select, input, textarea, a[href]";function jo(o,r,e){uo()?.fechar();let t=o.ownerDocument,i=t.defaultView,s=t.createElement("div");s.setAttribute("data-tema",e.temaEscuro?"escuro":"claro"),s.className="spro-prj-balao";let p=s.attachShadow({mode:"open"}),l=t.createElement("style");l.textContent=`${e.cssBase}
${Uo}`;let c=t.createElement("div");c.setAttribute("role","dialog"),c.setAttribute("aria-label",e.rotulo),c.append(r),p.append(l,c);let m=()=>c.querySelector(yo)?.focus?.({preventScroll:!0}),j=g=>{let P=g.composedPath();!P.includes(s)&&!P.includes(o)&&n.fechar()},R=g=>{g.key==="Escape"&&n.fechar()},v=g=>{let P=g;if(P.key!=="Tab")return;let D=[...c.querySelectorAll(yo)];if(!D.length)return;let z=P.shiftKey?D[0]:D[D.length-1];g.target===z&&(g.preventDefault(),n.fechar())},M=g=>{let P=g.relatedTarget;!P||typeof P.nodeType!="number"||P===s||p.contains(P)||P===o||o.contains(P)||n.fechar()};c.addEventListener("keydown",v),c.addEventListener("focusout",M);let C=!1,n={raiz:p,ancora:o,trocar(g){C||(c.replaceChildren(g),m())},fechar(){C||(C=!0,s.remove(),t.removeEventListener("pointerdown",j,!0),t.removeEventListener("keydown",R,!0),fo(n),o.setAttribute("aria-expanded","false"),o.isConnected&&o.focus?.({preventScroll:!0}),e.aoFechar?.())}},d=o.getBoundingClientRect(),f=t.documentElement.clientWidth||i?.innerWidth||1024,y=Math.max(0,f-16),x=Math.max(8,Math.min(d.left,f-Math.min(340,y)-8))+(i?.scrollX??0),b=g=>{s.style.cssText=`position:absolute;z-index:2147483000;left:${Math.round(x)}px;top:${Math.round(g)}px;--pb-max:${y}px`};b(d.bottom+(i?.scrollY??0)+6),t.body.append(s);let k=s.getBoundingClientRect().height,E=t.documentElement.clientHeight||i?.innerHeight||0;return k&&E&&d.bottom+6+k>E&&d.top-6-k>0&&b(d.top+(i?.scrollY??0)-6-k),t.addEventListener("pointerdown",j,!0),t.addEventListener("keydown",R,!0),o.setAttribute("aria-expanded","true"),mo(n),m(),n}var Xo="O espa\xE7o do navegador para o SEI Pro est\xE1 cheio. Arquive ou exclua projetos antigos.";function Jo(o){let r=o,e=`${typeof r?.name=="string"?r.name:""} ${typeof r?.message=="string"?r.message:typeof o=="string"?o:""}`;return/quota/i.test(e)}function Eo(o){let r=o?.mensagens;return Array.isArray(r)&&r.length?r.map(String).join(" "):Jo(o)?Xo:o instanceof Error?o.message:String(o)}var Po="http://www.w3.org/2000/svg",Yo={modelo:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16M9.5 9.5V20"}]],checklist:[["path",{d:"m4 7 2 2 3.5-3.5M4 15l2 2 3.5-3.5M13 8h7M13 16h7"}]],progresso:[["path",{d:"M4 12a8 8 0 1 0 8-8"}],["path",{d:"M12 4v8l5 3"}]],voltar:[["path",{d:"m15 6-6 6 6 6"}]],abrir:[["path",{d:"M14 4h6v6M20 4l-9 9"}],["path",{d:"M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"}]]};function ko(o,r,e){let t=document.createElementNS(Po,"svg"),i={viewBox:r,width:String(o),height:String(o),"aria-hidden":"true",focusable:"false",...e};for(let[s,p]of Object.entries(i))t.setAttribute(s,p);return t}function q(o,r){let e=document.createElementNS(Po,o);for(let[t,i]of Object.entries(r))e.setAttribute(t,i);return e}function J(o,r=18){let e=ko(r,"0 0 24 24",{fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round",class:"spro-icone"});for(let[t,i]of Yo[o])e.append(q(t,i));return e}function So(o,r){let e=ko(16,"0 0 16 16",{class:`prj-st prj-st-${o}${r?" prj-st-marco":""}`});return r?(e.append(q("path",{class:"prj-st-cor",d:o==="concluida"?"M8 1.5 14.5 8 8 14.5 1.5 8z":"M8 2 14 8 8 14 2 8z"})),e):(o==="concluida"?e.append(q("circle",{class:"prj-st-cor",cx:"8",cy:"8",r:"7"}),q("path",{class:"prj-st-sinal",d:"m4.8 8.2 2.1 2.1 4.3-4.4"})):o==="atrasada"?e.append(q("circle",{class:"prj-st-cor",cx:"8",cy:"8",r:"7"}),q("path",{class:"prj-st-sinal",d:"M8 4.2v4.6"}),q("circle",{class:"prj-st-ponto",cx:"8",cy:"11.4",r:"1"})):o==="andamento"?e.append(q("circle",{class:"prj-st-cor",cx:"8",cy:"8",r:"6.2"}),q("path",{class:"prj-st-meio",d:"M8 1.8a6.2 6.2 0 0 1 0 12.4z"})):e.append(q("circle",{class:"prj-st-cor",cx:"8",cy:"8",r:"6.2"})),e)}var Y=4,Ko="Nada foi gravado: os projetos de \u201CToda a unidade\u201D s\xF3 mudam depois do \u201CEntendi\u201D.",Wo=o=>o instanceof w&&o.mensagens.length===1&&o.mensagens[0]===G;function Co(){let o=a("p",{class:"pb-erro",role:"alert"}),r=a("p",{class:"pb-nota",role:"status"});return{erro:o,nota:r,limpar(){o.textContent="",r.textContent=""},mostrar(e){Wo(e)?r.textContent=Ko:o.textContent=Eo(e)}}}var Qo=o=>o?.focus?.({preventScroll:!0}),Mo=new WeakMap,N=(o,r,e,...t)=>a("button",{type:"button",class:r,onclick:e},...t,o),O=(o,r)=>a("label",{class:"pb-campo"},a("span",{class:"pb-rotulo"},o),r),_=(o,r,e=!1)=>a("option",{value:o,selected:e},r),Ao=o=>ro(o.fim)?o.fim:"9999-12-31",qo=o=>o.etapas.filter(r=>!r.concluidaEm).sort((r,e)=>Ao(r).localeCompare(Ao(e)));function Zo(o){return o.sigiloso?"":(o.especificacao||o.tipo||"").trim().slice(0,L.nome)}function Do(o,r){let e=()=>{},t=new Promise(c=>{e=c}),i=o.querySelector(".pb-slot");if(!i)return e(!1),{resposta:t,cancelar:()=>{}};let s=!1,p=c=>{if(s)return;s=!0,i.replaceChildren(),e(c);let m=Mo.get(o);m?.isConnected&&m.focus?.({preventScroll:!0})},l=N("Entendi","spro-botao primario pequeno",()=>p(!0));return i.replaceChildren(a("div",{class:"pb-pergunta",role:"alert"},a("p",{},`Os projetos de \u201CToda a unidade\u201D ficam guardados no pr\xF3prio SEI, num Texto Padr\xE3o da ${r}: todos da unidade que usam o SEI Pro veem e editam. O n\xFAmero de processo sigiloso n\xE3o vai.`),a("div",{class:"pb-botoes"},l,N("Agora n\xE3o","spro-botao pequeno",()=>p(!1))))),l.focus?.({preventScroll:!0}),{resposta:t,cancelar:()=>p(!1)}}function Oo(o,r){let e=a("div",{class:"pb"}),t=null,i=o.modo==="arvore",s=a("div",{class:"pb-slot"}),p=null,l=null,c=(n,d)=>{p===n&&!l&&(l=d)},m=(n,d,...f)=>{let y=N(n,"spro-botao primario pequeno",()=>{Mo.set(e,y),d()},...f);return y},j=(n,d)=>{let f=Co(),y=a("select",{class:"spro-campo",name:"etapa"},...d.map((E,g)=>_(E.id,E.nome,g===0))),x=a("select",{class:"spro-campo",name:"documento"},_("",o.documentos.length?"(sem documento)":"Nenhum documento na \xE1rvore",!0),...o.documentos.map(E=>_(E.numero,`${E.titulo} (${E.numero})`))),b=a("input",{class:"spro-campo",type:"date",name:"data",value:o.hoje});c("concluir",d.length>1?y:x);let k=()=>{let E=o.documentos.find(g=>g.numero===x.value);f.limpar(),r.concluir(n.vis,y.value,E?{numero:E.numero,titulo:E.titulo}:void 0,b.value).catch(f.mostrar)};return a("div",{class:"pb-form"},d.length>1?O("Etapa",y):a("p",{class:"pb-dica"},`Concluir \u201C${d[0]?.nome??""}\u201D`),O("Documento",x),O("Conclu\xEDda em",b),f.erro,f.nota,a("div",{class:"pb-rod"},N("Cancelar","spro-botao pequeno",()=>{t=null,C(`voltar:${n.vis}:${n.projeto.id}`)}),m("Concluir",k,$("check",13))))},R=n=>{let d=N("Concluir com documento\u2026","spro-botao primario pequeno",()=>{t=n,C("concluir")},$("documento",13));return c(`voltar:${n}`,d),d},v=(n,d)=>{let f=qo(n),y=n.papel==="projeto"?"processo do projeto":n.etapas.length===1?"etapa":"etapas",x=`${n.vis}:${n.projeto.id}`;return a("div",{class:"pb-vinc","data-projeto":n.projeto.id},a("div",{class:"pb-proj",title:F(n.vis)},$(n.vis==="unidade"?"predio":"pessoa",13),a("span",{},`${n.projeto.nome} \xB7 ${y}`)),...f.slice(0,Y).map(b=>{let k=po(b,o.hoje);return a("div",{class:`pb-etapa${k==="atrasada"?" pb-atrasada":""}`,"data-etapa":b.id},So(k,b.marco),a("span",{class:"pb-nome"},b.nome),a("span",{class:"pb-data"},lo(b,o.hoje)))}),f.length>Y?a("div",{class:"pb-mais"},`e mais ${f.length-Y}`):null,f.length?null:a("div",{class:"pb-vazio"},n.etapas.length?"Todas as etapas ligadas est\xE3o conclu\xEDdas.":"Nenhuma etapa ligada ainda."),t===x?j(n,f):o.modo==="arvore"||d?a("div",{class:"pb-botoes"},o.modo==="arvore"&&f.length?R(x):null,N("Abrir no painel","spro-botao pequeno",()=>r.abrirNoPainel(n.projeto.id,f[0]?.id),J("abrir",13))):null)},M=()=>{if(!o.projetos.length)return a("div",{class:"pb-form"},a("p",{class:"pb-dica"},"Crie um projeto no painel do Controle de Processos para ligar este processo."));let n=new Set(o.vinculos.map(u=>`${u.vis}:${u.projeto.id}`)),d=u=>`${u.vis}:${u.projeto.id}`,f=o.projetos.find(u=>!n.has(d(u)))??o.projetos[0],y=d(f),x="etapa",b=Co(),k=a("select",{class:"spro-campo",name:"projeto"},...o.projetos.map(u=>_(d(u),`${u.projeto.nome} (${F(u.vis)})`,d(u)===y))),E=a("input",{class:"spro-campo",name:"nome",maxlength:String(L.nome),placeholder:"Nome da etapa",value:Zo(o.processo)}),g=a("input",{class:"spro-campo",type:"date",name:"inicio",value:o.hoje}),P=a("input",{class:"spro-campo",type:"number",name:"duracao",min:"1",max:String(V),step:"1",value:"10"});c("adicionar",k);let D=a("select",{class:"spro-campo",name:"etapaLigar"}),z=a("div",{class:"pb-form-como"}),K=()=>o.projetos.find(u=>d(u)===y)??f,W=[["etapa","Nova etapa"],["ligar","Ligar a uma etapa"],["projeto","Processo do projeto"]],H=A(o.processo.protocolo),Q=W.map(([u,h])=>a("button",{type:"button","aria-pressed":String(x===u),onclick:()=>{x=u,B()}},h)),$o=a("div",{class:"spro-segmentado",role:"group","aria-label":"Como"},...Q),B=()=>{Q.forEach((h,T)=>{let I=String(W[T]?.[0]===x);h.getAttribute("aria-pressed")!==I&&h.setAttribute("aria-pressed",I)});let u=K();if(x==="etapa")z.replaceChildren(O("Nome da etapa",E),a("div",{class:"pb-linha2"},O("In\xEDcio",g),O("Dura\xE7\xE3o (dias \xFAteis)",P)));else if(x==="ligar"){let h=S=>!!H&&typeof S?.protocolo=="string"&&A(S.protocolo)===H,T=h(u.projeto.processo),I=u.etapas.filter(S=>!S.concluidaEm&&(S.processo&&!so(S.processo)?!h(S.processo):!T));D.replaceChildren(...I.map((S,zo)=>_(S.id,S.processo?.protocolo||S.processo?.sigiloso?`${S.nome} (j\xE1 tem outro processo)`:S.nome,zo===0))),z.replaceChildren(I.length?O("Etapa",D):a("p",{class:"pb-dica"},"Este projeto n\xE3o tem etapa aberta para ligar."))}else{let h=u.projeto.processo;z.replaceChildren(a("p",{class:"pb-dica"},h?.protocolo||h?.sigiloso?A(h.protocolo)===H&&h.protocolo?X:`O projeto passa a ter este processo no lugar de ${h.sigiloso?"um processo sigiloso":h.protocolo}.`:"O projeto passa a ter este processo (as etapas sem processo pr\xF3prio v\xEAm junto)."))}};k.addEventListener("change",()=>{y=k.value,B()}),B();let Ro=()=>{let u=K(),h={protocolo:o.processo.protocolo};o.processo.idProcedimento&&(h.idProcedimento=o.processo.idProcedimento),o.processo.sigiloso&&(h.sigiloso=!0);let T={vis:u.vis,projeto:u.projeto.id,como:x,processo:h};x==="etapa"&&Object.assign(T,{nome:E.value,inicio:g.value,duracao:Number(P.value)}),x==="ligar"&&(T.etapa=D.value),b.limpar(),r.adicionar(T).catch(b.mostrar)};return a("div",{class:"pb-form"},o.modo==="arvore"?a("b",{},"Adicionar a um projeto"):null,O("Projeto",k),a("div",{class:"pb-campo"},a("span",{class:"pb-rotulo"},"Como"),$o),z,b.erro,b.nota,a("div",{class:"pb-rod"},m("Adicionar",Ro,$("mais",13))))};function C(n=null){p=n,l=null;let d=o.vinculos.length,f=o.modo==="arvore"?"Projetos deste processo":`Em ${d} ${d===1?"projeto":"projetos"}`,y=o.modo==="caixa"&&d===1,x=[a("div",{class:"pb-cab"},a("span",{class:"pb-ic"},$("gantt",17)),a("span",{class:"pb-tit"},a("b",{},f),a("small",{},o.processo.protocolo)),a("button",{type:"button",class:"spro-botao-icone pequeno","aria-label":"Fechar",title:"Fechar (Esc)",onclick:()=>r.fechar()},$("fechar",14))),o.mensagem?a("p",{class:"pb-ok",role:"status"},o.mensagem):null,s,...o.vinculos.map(b=>v(b,o.modo==="caixa"&&d>1)),o.modo==="arvore"&&!d?a("p",{class:"pb-dica"},"Este processo ainda n\xE3o est\xE1 em nenhum projeto."):null,i?M():a("div",{class:"pb-rod"},N(d?"Adicionar a outro projeto":"Adicionar a um projeto","spro-botao pequeno",()=>{i=!0,C("adicionar")}),y?N("Abrir no painel","spro-botao primario pequeno",()=>r.abrirNoPainel(o.vinculos[0].projeto.id,qo(o.vinculos[0])[0]?.id),J("abrir",13)):null)];e.replaceChildren(...x.filter(b=>b!==null)),p&&Qo(l),p=null,l=null}return C(),e}async function No(o,r,e){let t=r.hoje(),[i,s]=await Promise.all([r.repos.unidade.dados(),r.repos.eu.dados()]),p=[{vis:"unidade",dados:i},{vis:"eu",dados:s}],l=no(p.map(m=>({vis:m.vis,projetos:m.dados.projetos,etapas:m.dados.etapas}))),c={modo:r.modo,processo:o,vinculos:l.get(A(o.protocolo))??[],projetos:co(p,t).ativos,documentos:r.modo==="arvore"?r.documentos():[],hoje:t};return e&&(c.mensagem=e),c}async function To(o,r,e){let t=null,i=null,s=null,p=!1,l=()=>{if(p||!i)return Promise.resolve(!1);let v=Do(i,e.sigla);return s=v,v.resposta.finally(()=>{s===v&&(s=null)})},c={unidade:go(e.repos.unidade,xo(e.consentimento,l)),eu:e.repos.eu},m=v=>(i=Oo(v,R),i),j=async v=>{let M=await No(r,e,v);return p||t?.trocar(m(M)),v},R={fechar:()=>t?.fechar(),abrirNoPainel:(v,M)=>{t?.fechar(),e.abrirNoPainel(v,M)},adicionar:async v=>j(await ho(c,v,e.hoje())),concluir:async(v,M,C,n)=>j(await wo(c,v,M,C,n))};return t=jo(o,m(await No(r,e)),{cssBase:e.cssBase,temaEscuro:e.temaEscuro,rotulo:e.modo==="arvore"?"Projetos deste processo":`Projetos do processo ${r.protocolo}`,aoFechar:()=>{p=!0,s?.cancelar()}}),t}var Fr=(o,r,e)=>To(o,r,{...e,cssBase:bo});export{Fr as abrirBalao};
