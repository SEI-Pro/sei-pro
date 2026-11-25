/* GERADO por demandas/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
import{$ as so,D as O,F as K,G as J,H as Z,N as g,V as oo,W as ro,X as eo,Z as ao,_ as to,a as _,b as Q,d as H,e as C,f as t,g as N,h as V,j as W,q as Y,r as T}from"./pagina-comum.js";var no=`/*
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
  text-align: left;
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
`;var To=`:host{all:initial}
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
.prj-st-marco.prj-st-atrasada .prj-st-cor{fill:none;stroke:var(--spro-perigo)}`,io="button:not([disabled]), select, input, textarea, a[href]";function po(o,r,e){ao()?.fechar();let a=o.ownerDocument,s=a.defaultView,i=a.createElement("div");i.setAttribute("data-tema",e.temaEscuro?"escuro":"claro"),i.className="spro-prj-balao";let p=i.attachShadow({mode:"open"}),l=a.createElement("style");l.textContent=`${e.cssBase}
${To}`;let c=a.createElement("div");c.setAttribute("role","dialog"),c.setAttribute("aria-label",e.rotulo),c.append(r),p.append(l,c);let f=()=>c.querySelector(io)?.focus?.({preventScroll:!0}),w=x=>{let h=x.composedPath();!h.includes(i)&&!h.includes(o)&&n.fechar()},P=x=>{x.key==="Escape"&&n.fechar()},m=x=>{let h=x;if(h.key!=="Tab")return;let $=[...c.querySelectorAll(io)];if(!$.length)return;let L=h.shiftKey?$[0]:$[$.length-1];x.target===L&&(x.preventDefault(),n.fechar())},D=x=>{let h=x.relatedTarget;!h||typeof h.nodeType!="number"||h===i||p.contains(h)||h===o||o.contains(h)||n.fechar()};c.addEventListener("keydown",m),c.addEventListener("focusout",D);let k=!1,n={raiz:p,ancora:o,trocar(x){k||(c.replaceChildren(x),f())},fechar(){k||(k=!0,i.remove(),a.removeEventListener("pointerdown",w,!0),a.removeEventListener("keydown",P,!0),so(n),o.setAttribute("aria-expanded","false"),o.isConnected&&o.focus?.({preventScroll:!0}),e.aoFechar?.())}},d=o.getBoundingClientRect(),b=a.documentElement.clientWidth||s?.innerWidth||1024,u=Math.max(0,b-16),q=Math.max(8,Math.min(d.left,b-Math.min(340,u)-8))+(s?.scrollX??0),y=x=>{i.style.cssText=`position:absolute;z-index:2147483000;left:${Math.round(q)}px;top:${Math.round(x)}px;--pb-max:${u}px`};y(d.bottom+(s?.scrollY??0)+6),a.body.append(i);let v=i.getBoundingClientRect().height,z=a.documentElement.clientHeight||s?.innerHeight||0;return v&&z&&d.bottom+6+v>z&&d.top-6-v>0&&y(d.top+(s?.scrollY??0)-6-v),a.addEventListener("pointerdown",w,!0),a.addEventListener("keydown",P,!0),o.setAttribute("aria-expanded","true"),to(n),f(),n}function co(o){let r=o,e=`${typeof r?.name=="string"?r.name:""} ${typeof r?.message=="string"?r.message:typeof o=="string"?o:""}`;return/quota/i.test(e)}var $o="O navegador n\xE3o tem mais espa\xE7o para guardar as demandas. Arquive as conclu\xEDdas antigas e exporte o arquivo morto.";function B(o){return o instanceof g||o instanceof oo?o.message:co(o)?$o:o instanceof Error?o.message:String(o)}function U(o,r,e){return`${o} ${o===1?r:e}`}function M(o){if(!/^\d{4}-\d{2}-\d{2}$/.test(o))return null;let r=Number(o.slice(0,4));return r<2e3||r>2100?null:_(Q(o))===o?o:null}function lo(o){if(o===void 0)return"";let r=Math.floor(o/60),e=o%60;return r?e?`${r}h${String(e).padStart(2,"0")}`:`${r}h`:`${e}min`}function uo(o){let r=o.trim().toLowerCase().replace(/\s+/g,"");if(!r)return;let e=/^(\d+)(?:h|:)(\d{1,2})(?:min)?$/.exec(r);return e?Number(e[2])>59?null:Number(e[1])*60+Number(e[2]):(e=/^(\d+)h$/.exec(r),e?Number(e[1])*60:(e=/^(\d+)(?:min)?$/.exec(r),e?Number(e[1]):null))}var mo={nao_iniciada:"N\xE3o iniciada",iniciada:"Iniciada",pausada:"Pausada",concluida:"Conclu\xEDda",avaliada:"Avaliada",arquivada:"Arquivada"};function fo(o,r){switch(o.prazo){case"atrasada":return`Atrasada h\xE1 ${U(o.diasAtraso,"dia","dias")}`;case"concluida_no_prazo":return"Entregue no prazo";case"concluida_fora_do_prazo":return"Entregue com atraso";default:return r===void 0?"No prazo":o.demanda.prazo===r?"Vence hoje":`Vence em ${U(H(r,o.demanda.prazo),"dia","dias")}`}}var Ao=o=>o==="unidade"?"Toda a unidade":"S\xF3 eu";function No(o){let r=typeof o.protocolo=="string"?o.protocolo.trim():"";if(!J.test(r)||!O(r))throw new g("processos","N\xE3o foi poss\xEDvel ler o n\xFAmero deste processo na tela do SEI.");let e={protocolo:r};return o.idProcedimento&&Z.test(o.idProcedimento)&&(e.idProcedimento=o.idProcedimento),o.sigiloso&&(e.sigiloso=!0),e}function Ro(o,r){let e=(o??"").replace(/\s*\(\d{5,20}\)\s*$/,"").trim();return r&&e.endsWith(r)&&(e.length===r.length||/\s/.test(e[e.length-r.length-1]??""))&&(e=e.slice(0,e.length-r.length).trim()),e}function bo(o,r){if(r?.sigiloso)return"";let e=r?Ro(r.titulo,r.numero):"";return o.sigiloso?e.slice(0,T.titulo):(r?`${e} ${r.numero}`.trim():(o.tipo??"").trim()).slice(0,T.titulo)}function Oo(o,r,e){let a=o.numero.trim();if(!a)return;if(!K.test(a))throw new g("documento","N\xFAmero de documento inv\xE1lido (s\xF3 d\xEDgitos, at\xE9 20).");let s={numero:a},i=o.titulo.trim().slice(0,T.titulo);return i&&(s.titulo=i),(r.sigiloso||e?.numero===a&&e.sigiloso)&&(s.sigiloso=!0),s}async function go(o,r,e){let a=M(r.prazo);if(!a)throw new g("prazo","Informe um prazo v\xE1lido (dia/m\xEAs/ano).");let s=No(r.processo),i=o[r.vis],p=r.vis==="eu"?e:r.responsavel,l=await i.criar({titulo:r.titulo,...p?{responsavel:p}:{},prazo:a,prioridade:r.prioridade,processos:[s]});return s.sigiloso&&await i.marcarSigilosos([s.protocolo]).catch(()=>{}),`Demanda \u201C${l.titulo}\u201D criada (${Ao(r.vis)}), prazo ${C(l.prazo)}.`}async function vo(o,r,e){let a=await o[r].obter(e);if(!a)throw new g("id","Esta demanda n\xE3o existe mais.");if(V(a)!=="nao_iniciada")throw new g("situacao","Esta demanda j\xE1 foi iniciada.");return`\u201C${(await o[r].aplicar(e,(i,p)=>ro(i,p))).titulo}\u201D iniciada.`}async function xo(o,r,e,a,s,i){let p=M(a.data);if(!p)throw new g("data","Informe uma data de conclus\xE3o v\xE1lida.");let l=uo(a.tempo);if(l===null)throw new g("tempo","Tempo gasto inv\xE1lido. Use 1h30, 1:30, 45min ou s\xF3 os minutos.");let c=Oo(a,s,i),f=await o[r].obter(e);if(!f)throw new g("id","Esta demanda n\xE3o existe mais.");let w=V(f);if(w!=="iniciada"&&w!=="pausada")throw new g("situacao","S\xF3 uma demanda iniciada ou pausada pode ser conclu\xEDda.");if(p<f.distribuidaEm)throw new g("data",`A conclus\xE3o n\xE3o pode ser antes da distribui\xE7\xE3o (${C(f.distribuidaEm)}).`);let P=a.observacao.trim();return`\u201C${(await o[r].aplicar(e,(D,k)=>eo(D,{data:p,...l!==void 0?{tempoGastoMin:l}:{},...P?{observacao:P}:{},...c?{documento:c}:{}},k))).titulo}\u201D conclu\xEDda em ${C(p)}.`}var Mo=new Set(["criar","editar","aplicar","arquivarVarias","descartar","remover","restaurar","duplicar","reordenar","importar"]),j="consentimento",ho="Sem o \u201CEntendi\u201D, as demandas de \u201CToda a unidade\u201D n\xE3o mudam. Para uma demanda s\xF3 sua, escolha \u201CS\xF3 eu\u201D.",jo="N\xE3o foi poss\xEDvel ler a sua confirma\xE7\xE3o. Tente de novo.",Io="N\xE3o foi poss\xEDvel guardar a sua confirma\xE7\xE3o. Tente de novo.",wo=o=>o instanceof g&&o.campo===j&&o.message===ho;async function Lo(o){try{return await o.estado()}catch(r){throw console.warn("[SEI Pro] demandas: consentimento n\xE3o lido:",r instanceof Error?r.message:String(r)),new g(j,jo)}}function yo(o,r){return new Proxy(o,{get(e,a,s){let i=Reflect.get(e,a,s);if(typeof i!="function")return i;let p=i.bind(e);return typeof a!="string"||!Mo.has(a)?p:async(...l)=>{if(!await r())throw new g(j,ho);return p(...l)}}})}function Eo(o,r){let e=null;return async()=>await Lo(o)==="ligado"?!0:(e??=(async()=>{try{let a=await r();if(a)try{await o.definir("ligado")}catch(s){throw console.warn("[SEI Pro] demandas: consentimento n\xE3o gravado:",s instanceof Error?s.message:String(s)),new g(j,Io)}return a}finally{e=null}})(),e)}var F=5,_o="Nada foi gravado: as demandas de \u201CToda a unidade\u201D s\xF3 mudam depois do \u201CEntendi\u201D.";function G(){let o=t("p",{class:"pb-erro",role:"alert"}),r=t("p",{class:"pb-nota",role:"status"});return{erro:o,nota:r,limpar(){o.textContent="",r.textContent=""},mostrar(e){wo(e)?r.textContent=_o:o.textContent=B(e)}}}var Ho=o=>o?.focus?.({preventScroll:!0}),ko=new WeakMap,R=(o,r,e,...a)=>t("button",{type:"button",class:r,onclick:e},...a,o),S=(o,r)=>t("label",{class:"pb-campo"},t("span",{class:"pb-rotulo"},o),r),I=(o,r,e=!1)=>t("option",{value:o,selected:e},r);function Do(o,r){let e=()=>{},a=new Promise(c=>{e=c}),s=o.querySelector(".pb-slot");if(!s)return e(!1),{resposta:a,cancelar:()=>{}};let i=!1,p=c=>{if(i)return;i=!0,s.replaceChildren(),e(c);let f=ko.get(o);f?.isConnected&&f.focus?.({preventScroll:!0})},l=R("Entendi","spro-botao primario pequeno",()=>p(!0));return s.replaceChildren(t("div",{class:"pb-pergunta",role:"alert"},t("p",{},`As demandas de \u201CToda a unidade\u201D ficam guardadas no pr\xF3prio SEI, num Texto Padr\xE3o da ${r}: todos da unidade que usam o SEI Pro veem e editam. O n\xFAmero de processo sigiloso n\xE3o vai.`),t("p",{},Vo),t("div",{class:"pb-botoes"},l,R("Agora n\xE3o","spro-botao pequeno",()=>p(!1))))),l.focus?.({preventScroll:!0}),{resposta:a,cancelar:()=>p(!1)}}var Vo="N\xE3o escreva dados sigilosos no t\xEDtulo ou na descri\xE7\xE3o: ficam no Texto Padr\xE3o e todos da unidade os leem.";function Bo(o,r){let e=new Set,a=[];for(let s of[o,...r]){let i=(s.login??s.nome).trim().toLowerCase();!i||!s.nome.trim()||e.has(i)||(e.add(i),a.push(s.login?{login:s.login,nome:s.nome}:{nome:s.nome}))}return a}function Po(o,r){let e=t("div",{class:"pb"}),a=null,s=o.ligadas.length===0,i=t("div",{class:"pb-slot"}),p=null,l=null,c=(n,d)=>{p===n&&!l&&(l=d)},f=(n,d,...b)=>{let u=R(n,"spro-botao primario pequeno",()=>{ko.set(e,u),d()},...b);return u},w=n=>`${n.vis}:${n.demanda.id}`,P=n=>{let d=G(),b=t("input",{class:"spro-campo",type:"date",name:"data",value:o.hoje}),u=t("input",{class:"spro-campo",type:"text",name:"tempo",placeholder:"1h30",value:lo(n.demanda.tempoGastoMin)}),q=t("textarea",{class:"spro-campo",name:"observacao",rows:"2",maxlength:String(T.observacao)}),y=t("input",{class:"spro-campo",type:"text",name:"numero",inputmode:"numeric",placeholder:"N\xFAmero SEI",maxlength:"30",value:o.documento?.numero??""}),v=t("input",{class:"spro-campo",type:"text",name:"titulo",maxlength:String(T.titulo),placeholder:"T\xEDtulo do documento",value:o.documento?.titulo??""});c(`concluir:${w(n)}`,b);let z=()=>{d.limpar(),r.concluir(n.vis,n.demanda.id,{data:b.value,tempo:u.value,observacao:q.value,numero:y.value,titulo:v.value}).catch(d.mostrar)};return t("div",{class:"pb-form","data-concluir":n.demanda.id},t("b",{},"Concluir com este documento"),t("div",{class:"pb-linha2"},S("Conclu\xEDda em",b),S("Tempo gasto (opcional)",u)),S("N\xFAmero SEI do documento entregue",y),S("T\xEDtulo do documento (opcional)",v),S("Observa\xE7\xE3o (opcional)",q),o.documento?null:t("p",{class:"pb-dica"},"Nenhum documento aberto: informe o n\xFAmero ou deixe em branco."),d.erro,d.nota,t("div",{class:"pb-rod"},R("Voltar","spro-botao pequeno",()=>{a=null,k(`voltar:${w(n)}`)}),f("Concluir",z,N("check",13))))},m=n=>{let d=w(n),b=G(),u=n.demanda,q=n.situacao==="iniciada"||n.situacao==="pausada",y=[];if(n.situacao==="nao_iniciada"&&y.push(f("Iniciar",()=>{b.limpar(),r.iniciar(n.vis,u.id).catch(b.mostrar)})),q){let v=R("Concluir com este documento\u2026","spro-botao primario pequeno",()=>{a=d,k(`concluir:${d}`)},N("documento",13));c(`voltar:${d}`,v),y.push(v)}return y.push(R("Abrir no painel","spro-botao pequeno",()=>r.abrirNoPainel(u.id))),t("div",{class:`pb-vinc${n.prazo==="atrasada"?" pb-atrasada":""}`,"data-demanda":u.id},t("div",{class:"pb-proj",title:Y(n.vis)},N(n.vis==="unidade"?"predio":"pessoa",13),t("span",{},`${mo[n.situacao]}${u.responsavel?` \xB7 ${u.responsavel.nome}`:""}`)),t("div",{class:"pb-etapa"},t("span",{class:"pb-nome"},u.titulo),t("span",{class:"pb-data"},`${fo(n,o.hoje)} \xB7 ${C(u.prazo)}`)),a===d?P(n):t("div",{class:"pb-botoes"},...y),a===d?null:b.erro,a===d?null:b.nota)},D=()=>{let n=G(),d=Bo(o.eu,o.usuarios),b=t("input",{class:"spro-campo",type:"text",name:"titulo",maxlength:String(T.titulo),placeholder:"T\xEDtulo da demanda",value:bo(o.processo,o.documento)}),u=t("select",{class:"spro-campo",name:"responsavel"},...d.map((E,A)=>I(String(A),A===0?`${E.nome} (eu)`:E.nome,A===0))),q=t("input",{class:"spro-campo",type:"date",name:"prazo",value:o.hoje}),y=t("select",{class:"spro-campo",name:"prioridade"},I("normal","Normal",!0),I("importante","Importante"),I("urgente","Urgente")),v="unidade",z=[["unidade","Toda a unidade"],["eu","S\xF3 eu"]],x=z.map(([E,A])=>t("button",{type:"button","aria-pressed":String(v===E),onclick:()=>{v=E,h()}},A)),h=()=>{x.forEach((E,A)=>{let X=String(z[A]?.[0]===v);E.getAttribute("aria-pressed")!==X&&E.setAttribute("aria-pressed",X)}),v==="eu"?u.setAttribute("disabled",""):u.removeAttribute("disabled")};c("nova",b);let $=()=>{n.limpar();let E=d[Number(u.value)]??o.eu;r.criar({vis:v,titulo:b.value,prazo:q.value,prioridade:y.value,...v==="unidade"?{responsavel:E}:{},processo:o.processo}).catch(n.mostrar)};b.addEventListener("keydown",E=>{E.key==="Enter"&&(E.preventDefault(),$())});let L=t("div",{class:"pb-form","data-nova":"1"},t("b",{},"Nova demanda deste processo"),S("T\xEDtulo",b),o.processo.sigiloso?t("p",{class:"pb-dica"},"Processo sigiloso: o n\xFAmero dele n\xE3o vai ao Texto Padr\xE3o da unidade."):t("p",{class:"pb-dica"},`Processo ${o.processo.protocolo}`),t("div",{class:"pb-linha2"},S("Respons\xE1vel",u),S("Prazo",q)),t("div",{class:"pb-linha2"},S("Prioridade",y)),t("div",{class:"pb-campo"},t("span",{class:"pb-rotulo"},"Quem v\xEA"),t("div",{class:"spro-segmentado",role:"group","aria-label":"Quem v\xEA"},...x)),n.erro,n.nota,t("div",{class:"pb-rod"},f("Criar demanda",$,N("mais",13))));return h(),L};function k(n=null){p=n,l=null;let d=o.ligadas.length,b=[t("div",{class:"pb-cab"},t("span",{class:"pb-ic"},N("demandas",17)),t("span",{class:"pb-tit"},t("b",{},"Demandas deste processo"),t("small",{},o.processo.protocolo)),t("button",{type:"button",class:"spro-botao-icone pequeno","aria-label":"Fechar",title:"Fechar (Esc)",onclick:()=>r.fechar()},N("fechar",14))),o.mensagem?t("p",{class:"pb-ok",role:"status"},o.mensagem):null,i,...o.ligadas.slice(0,F).map(m),d>F?t("div",{class:"pb-mais"},`e mais ${d-F}`):null,d?null:t("p",{class:"pb-dica"},"Este processo ainda n\xE3o tem demanda."),s?D():t("div",{class:"pb-rod"},R("Nova demanda deste processo","spro-botao pequeno",()=>{s=!0,k("nova")}))];e.replaceChildren(...b.filter(u=>u!==null)),p&&Ho(l),p=null,l=null}return k(),e}async function qo(o,r,e){let a=r.hoje(),s=O(o.processo.protocolo),[i,p]=await Promise.all([W(r.repos,a),r.usuarios().catch(()=>[])]),l={processo:o.processo,documento:o.documento,ligadas:i.filter(c=>c.situacao!=="arquivada"&&c.demanda.processos.some(f=>!!f.protocolo&&O(f.protocolo)===s)),hoje:a,eu:r.eu,usuarios:p};return e&&(l.mensagem=e),l}async function So(o,r,e){let a=null,s=null,i=null,p=!1,l=()=>{if(p||!s)return Promise.resolve(!1);let m=Do(s,e.sigla);return i=m,m.resposta.finally(()=>{i===m&&(i=null)})},c={unidade:yo(e.repos.unidade,Eo(e.consentimento,l)),eu:e.repos.eu},f=m=>(s=Po(m,P),s),w=async m=>{let D=await qo(r,e,m);return p||a?.trocar(f(D)),m},P={fechar:()=>a?.fechar(),abrirNoPainel:m=>{a?.fechar(),e.abrirNoPainel(m)},criar:async m=>w(await go(c,m,e.eu)),iniciar:async(m,D)=>w(await vo(c,m,D)),concluir:async(m,D,k)=>w(await xo(c,m,D,k,r.processo,r.documento))};return a=po(o,f(await qo(r,e)),{cssBase:e.cssBase,temaEscuro:e.temaEscuro,rotulo:`Demandas do processo ${r.processo.protocolo}`,aoFechar:()=>{p=!0,i?.cancelar()}}),a}var jr=(o,r,e)=>So(o,r,{...e,cssBase:no});export{jr as abrirBalao};
