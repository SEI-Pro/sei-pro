/* GERADO por prazos/build.mjs. NAO EDITE. Rode: npm run build */
"use strict";(()=>{var Jo=o=>String(o).padStart(2,"0");function T(o=new Date){return`${o.getFullYear()}-${Jo(o.getMonth()+1)}-${Jo(o.getDate())}`}function F(o){let r=/^(\d{4})-(\d{2})-(\d{2})$/.exec(o);if(!r)throw new Error(`Data inv\xE1lida: ${o}`);return new Date(Number(r[1]),Number(r[2])-1,Number(r[3]),12)}function L(o,r){let e=F(o);return e.setDate(e.getDate()+r),T(e)}function Mo(o,r){return Math.round((F(r).getTime()-F(o).getTime())/864e5)}function ie(o,r){let e=F(o).getDay();return e!==0&&e!==6&&!r.has(o)}function Zo(o,r,e){let t=r<0?-1:1,a=o,n=Math.abs(r);for(;n>0;)a=L(a,t),ie(a,e)&&(n-=1);return a}function w(o){let[r,e,t]=o.split("-");return`${t}/${e}/${r}`}function se(o){let r=o%19,e=Math.floor(o/100),t=o%100,a=Math.floor(e/4),n=e%4,i=Math.floor((e+8)/25),s=Math.floor((e-i+1)/3),p=(19*r+e-a-s+15)%30,c=Math.floor(t/4),d=t%4,l=(32+2*n+2*c-p-d)%7,u=Math.floor((r+11*p+22*l)/451),m=Math.floor((p+l-7*u+114)/31),A=(p+l-7*u+114)%31+1;return`${o}-${String(m).padStart(2,"0")}-${String(A).padStart(2,"0")}`}function ce(o){let r=se(o),e=(t,a)=>({data:`${o}-${t}`,nome:a});return[e("01-01","Confraterniza\xE7\xE3o Universal"),{data:L(r,-48),nome:"Carnaval"},{data:L(r,-47),nome:"Carnaval"},{data:L(r,-2),nome:"Paix\xE3o de Cristo"},{data:r,nome:"P\xE1scoa"},e("04-21","Tiradentes"),e("05-01","Dia do Trabalho"),{data:L(r,60),nome:"Corpus Christi"},e("09-07","Independ\xEAncia do Brasil"),e("10-12","Nossa Senhora Aparecida"),e("11-02","Finados"),e("11-15","Proclama\xE7\xE3o da Rep\xFAblica"),e("11-20","Dia Nacional de Zumbi e da Consci\xEAncia Negra"),e("12-25","Natal")].sort((t,a)=>t.data<a.data?-1:1)}function Wo(o,r=[]){let e=new Set;for(let t of o)for(let a of ce(t))e.add(a.data);for(let t of r)e.add(t.data);return e}function pe(o,r){let e=o;if(typeof o=="string"){if(!o.trim())return;try{e=JSON.parse(o)}catch{return}}return!Array.isArray(e)||e.length===0?void 0:e.map(a=>a?.configGeral).find(Array.isArray)?.find(a=>a?.name===r)?.value}function Oo(o,r){let e=pe(o,r);return!(e===!1||e===0||e==="")}function Yo(o){try{return!!o.getItem("darkModePro")}catch{return!1}}var Qo=`/*
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
`;var g=class extends Error{codigo;detalhe;constructor(r,e,t){super(e),this.name="ErroSei",this.codigo=r,this.detalhe=t}paraJSON(){return{codigo:this.codigo,mensagem:this.message,detalhe:this.detalhe}}};function or(o){return o instanceof g}function Io(o){if(o instanceof g)return o;if(o instanceof DOMException&&o.name==="AbortError")return new g("CANCELADO","Opera\xE7\xE3o cancelada.");let r=o instanceof Error?o.message:String(o);return new g("SEI_REDE",`Falha ao falar com o SEI: ${r}`)}var le={AElig:198,Aacute:193,Acirc:194,Agrave:192,Aring:197,Atilde:195,Auml:196,Ccedil:199,ETH:208,Eacute:201,Ecirc:202,Egrave:200,Euml:203,Iacute:205,Icirc:206,Igrave:204,Iuml:207,Ntilde:209,Oacute:211,Ocirc:212,Ograve:210,Oslash:216,Otilde:213,Ouml:214,THORN:222,Uacute:218,Ucirc:219,Ugrave:217,Uuml:220,Yacute:221,aacute:225,acirc:226,acute:180,aelig:230,agrave:224,amp:38,apos:39,aring:229,atilde:227,auml:228,brvbar:166,bull:8226,ccedil:231,cedil:184,cent:162,copy:169,curren:164,deg:176,divide:247,eacute:233,ecirc:234,egrave:232,eth:240,euml:235,euro:8364,frac12:189,frac14:188,frac34:190,gt:62,hellip:8230,iacute:237,icirc:238,iexcl:161,igrave:236,iquest:191,iuml:239,laquo:171,ldquo:8220,lsquo:8216,lt:60,macr:175,mdash:8212,micro:181,middot:183,nbsp:160,ndash:8211,not:172,ntilde:241,oacute:243,ocirc:244,ograve:242,ordf:170,ordm:186,oslash:248,otilde:245,ouml:246,para:182,plusmn:177,pound:163,quot:34,raquo:187,rdquo:8221,reg:174,rsquo:8217,sect:167,shy:173,sup1:185,sup2:178,sup3:179,szlig:223,thorn:254,times:215,trade:8482,uacute:250,ucirc:251,ugrave:249,uml:168,uuml:252,yacute:253,yen:165,yuml:255};function P(o){return o.includes("&")?o.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g,(r,e)=>{let t=e[0]==="#"?e[1]==="x"||e[1]==="X"?parseInt(e.slice(2),16):parseInt(e.slice(1),10):le[e];return t===void 0||Number.isNaN(t)?r:String.fromCodePoint(t)}):o}var rr={128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};var er=null;function so(o){return er?er(o):new DOMParser().parseFromString(o,"text/html")}function E(o){return(o?.textContent??"").replace(/\s+/g," ").trim()}var ue={n:`
`,r:"\r",t:"	",b:"\b",f:"\f",v:"\v",0:"\0"};function ko(o,r){let e=o[r],t="";for(r+=1;r<o.length;){let a=o[r];if(a==="\\"){let n=o[r+1];if(n==="u"&&/^[0-9a-fA-F]{4}$/.test(o.slice(r+2,r+6))){t+=String.fromCharCode(parseInt(o.slice(r+2,r+6),16)),r+=6;continue}t+=ue[n]??n,r+=2;continue}if(a===e)return[t,r+1];t+=a,r+=1}return[t,r]}function co(o,r){let e=[],t=r;for(;t<o.length;){let a=o[t];if(a===")")return[e,t+1];if(a===","||/\s/.test(a)){t+=1;continue}if(a==='"'||a==="'"){let[s,p]=ko(o,t);e.push(s),t=p;continue}let n=/^(null|true|false|-?\d+(?:\.\d+)?)/.exec(o.slice(t,t+32));if(n){let s=n[1];e.push(s==="null"?null:s==="true"?!0:s==="false"?!1:Number(s)),t+=s.length;continue}let i=0;for(;t<o.length;){let s=o[t];if(s==="(")i+=1;else if(s===")"){if(i===0)break;i-=1}else if(s===","&&i===0)break;t+=1}e.push(null)}return[e,t]}function po(o,r){let e=[],t=new RegExp(`\\b${r}\\(`,"g");for(let a of o.matchAll(t)){let[n]=co(o,a.index+a[0].length);e.push(n)}return e}function b(o){return typeof o=="string"?P(o):o==null?"":String(o)}var me=/controlador(?:_ajax)?\.php\?acao=[^"'\s<>\\]*?infra_hash=[0-9a-f]{64,192}/g;function k(o){let r=new Set;for(let e of o.replace(/&amp;/g,"&").matchAll(me))r.add(e[0]);return[...r]}function D(o){let r=o.indexOf("?");return new URLSearchParams(r>=0?o.slice(r+1):"")}function _(o,r,e={}){let t=Array.isArray(o)?o:k(o);for(let a of t){let n=D(a),i=n.get("acao")??"";if(!(typeof r=="string"?i!==r:!r.test(i))&&Object.entries(e).every(([s,p])=>n.get(s)===p))return a}return null}function tr(o,r){let e=[...o.doc.querySelectorAll("#infraMenu a[href], #main-menu a[href], .infraMenu a[href]")].map(i=>i.getAttribute("href")??"").join(`
`),t=k(e).filter(i=>D(i).get("acao")===r),n=(t.length?t:k(o.html).filter(i=>D(i).get("acao")===r)).sort((i,s)=>[...D(i).keys()].length-[...D(s).keys()].length)[0];if(!n)throw new g("SEI_ACAO_INDISPONIVEL",`O menu do SEI n\xE3o oferece "${r}" para este usu\xE1rio.`);return n}function fe(o){let r=new Map;for(let e of o.matchAll(/Nos\[(\d+)\]\s*=\s*new\s+infraArvoreNo\(/g)){let[t]=co(o,e.index+e[0].length);r.set(Number(e[1]),{indice:Number(e[1]),args:t,props:{}})}for(let e of o.matchAll(/Nos\[(\d+)\]\.(\w+)\s*=\s*(['"])/g)){let t=r.get(Number(e[1]));if(!t)continue;let[a]=ko(o,e.index+e[0].length-1);t.props[e[2]]=a}return[...r.values()].sort((e,t)=>e.indice-t.indice)}function ge(o){let r=[];for(let e of o.matchAll(/new\s+infraArvoreAcao\(/g)){let[t]=co(o,e.index+e[0].length);r.push({tipo:b(t[0]),idPai:b(t[2]),href:b(t[3]),titulo:b(t[5]),icone:b(t[6]),extra:t[8]==null?void 0:b(t[8])})}return r}function ar(o,r){let e=o.find(i=>i.tipo==="NIVEL_ACESSO"&&i.idPai===r);if(!e)return{nivel:"publico"};let[t,...a]=e.titulo.split(`
`);return{nivel:/sigilos/i.test(t)||/sigiloso/.test(e.icone)?"sigiloso":"restrito",hipotese:a.join(" ").trim()||void 0}}function nr(o){return[...new Set([...o.matchAll(/<img[^>]*\btitle="([^"]+)"/g)].map(r=>b(r[1])))]}var he=/\s*\(\d{5,}\)\s*$/;function xe(o){let r=o.html,e=fe(r),t=ge(r),a=e.find(p=>p.args[0]==="PROCESSO");if(!a)throw new g("SEI_VERSAO_NAO_SUPORTADA","A \xE1rvore do processo n\xE3o tem o n\xF3 do processo.");let n=b(a.args[1]),i=ar(t,n),s=e.filter(p=>p.args[0]==="DOCUMENTO").map(p=>{let c=b(p.args[1]),d=b(p.args[5]),l=b(p.args[7]),u=(p.props.src??"").replace(/&amp;/g,"&"),m=t.find(S=>S.tipo==="ASSINATURA"&&S.idPai===c),{nivel:A,hipotese:f}=ar(t,c),v=(/documento_([a-z0-9]+)\.svg/.exec(l)?.[1]??"interno").replace("cancelado","interno");return{id:c,numero:b(p.args[15])||(/\((\d{5,})\)\s*$/.exec(d)?.[1]??""),titulo:d.replace(he,""),pasta:p.args[2]&&String(p.args[2]).startsWith("PASTA")?String(p.args[2]):null,externo:/documento_download_anexo/.test(u)||!/documento_interno|documento_cancelado|formulario|email/.test(l),formato:v,nivel:A,hipotese:f,assinado:!!m,assinaturas:m?m.titulo.split(`
`).slice(1).filter(Boolean):[],cancelado:/documento_cancelado/.test(l),unidadeGeradora:t.find(S=>S.tipo==="UNIDADE_GERADORA"&&S.idPai===c)?.extra,link:b(p.args[3]).replace(/&amp;/g,"&"),src:u,acoes:k(p.props.acoes??""),botoes:nr(p.props.acoes??"")}});return{idProcedimento:n,protocolo:b(a.args[5])||b(a.args[15]),tipo:b(a.args[6]),nivel:i.nivel,hipotese:i.hipotese,marcadores:t.filter(p=>p.tipo==="MARCADOR"&&p.idPai===n).map(p=>p.titulo.replace(/^Marcador\n/,"").replace(/\n/g," \u2014 ")),documentos:s,acoesProcesso:k(a.props.acoes??""),botoesProcesso:nr(a.props.acoes??""),linkProcesso:b(a.args[3]).replace(/&amp;/g,"&"),sinais:t.filter(p=>p.idPai===n),links:k(r),pagina:o}}async function ir(o,r,e){let t=await o.obter(r,e);if(!/acao=procedimento_visualizar/.test(t.url)){let a=t.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!a)throw new g("SEI_NAO_ENCONTRADO","N\xE3o foi poss\xEDvel abrir a \xE1rvore do processo.");t=await o.obter(a,e)}if(/infraArvoreNo\("PASTA"/.test(t.html)){let a=_(t.html,"procedimento_visualizar")&&k(t.html).find(n=>/abrir_pastas=1/.test(n));a&&(t=await o.obter(a,e))}return xe(t)}function sr(o,r,e){if(e){let t=o.documentos.find(a=>a.id===e);return t?_(t.acoes,r):null}return _(o.acoesProcesso,r)??_(o.links,r,{id_procedimento:o.idProcedimento})}function cr(o,r,e){let t=(r??"").trim(),a=(e??"").trim();return e===void 0||t===a?[]:[{campo:o,antes:t,depois:a}]}var mr="\xA5",Co="\xB1";function pr(o){return o.map(r=>`${r.id}${Co}${r.texto}`).join(mr)}function ve(o){return o?o.split(mr).map(r=>{let[e,...t]=r.split(Co);return{id:e,texto:t.join(Co)}}):[]}function dr(o){let r=[];for(let e of o.matchAll(/new\s+infraLupaSelect\(\s*['"]([\w-]+)['"]\s*,\s*['"]([\w-]+)['"]/g))r.push([e[1],e[2]]);return r}var z=class o{constructor(r,e,t){this.http=r;this.pagina=e;this.elemento=t,this.id=t.id,this.action=(t.getAttribute("action")??"").replace(/&amp;/g,"&"),this.campos=be(t),this.sincronizarLupas()}id;action;campos;elemento;static async abrir(r,e,t,a){let n=await r.obter(e,a);return o.de(n,t,r)}static de(r,e,t=null){let a=r.doc.querySelector(e);if(!a)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A tela do SEI n\xE3o tem o formul\xE1rio esperado (${e}).`,E(r.doc.querySelector("title")));return new o(t,r,a)}pares(){return this.campos.map(r=>[r.nome,r.valor])}valor(r){return this.campos.find(e=>e.nome===r)?.valor}tem(r){return this.elemento.querySelector(`[name="${r}"]`)!==null||this.campos.some(e=>e.nome===r)}opcoes(r){let e=this.elemento.querySelector(`select[name="${r}"], select#${ur(r)}`);return e?[...e.querySelectorAll("option")].map(t=>({valor:t.getAttribute("value")??E(t),texto:E(t),selecionada:t.hasAttribute("selected")})):[]}definir(r){for(let[e,t]of Object.entries(r)){if(t===void 0)continue;if(t===null){this.campos=this.campos.filter(n=>n.nome!==e);continue}let a=this.campos.find(n=>n.nome===e);a?a.valor=t:this.campos.push({nome:e,valor:t})}return this}escolher(r,e){let t=this.opcoes(r),a=U(e),n=t.find(i=>i.valor===e)??t.find(i=>U(i.texto)===a)??lr(t.filter(i=>U(i.texto).includes(a)));if(!n)throw new g("ARGUMENTO_INVALIDO",`"${e}" n\xE3o \xE9 uma op\xE7\xE3o de ${r}.`,t.slice(0,40).map(i=>i.texto).join(" | "));return this.definir({[r]:n.valor}),n}linhas(r){return[...this.elemento.querySelectorAll(`${r} tr`)].filter(e=>e.querySelector("input[type=checkbox]"))}itensLupa(r){let e=this.hiddenDaLupa(r);return e?ve(this.valor(e)??""):[]}definirLupa(r,e){let t=this.hiddenDaLupa(r);if(!t)throw new g("SEI_VERSAO_NAO_SUPORTADA",`A lupa ${r} n\xE3o existe nesta tela.`);return this.definir({[t]:pr(e)}),this.campos=this.campos.filter(a=>a.nome!==r&&a.nome!==`${r}[]`),this}async enviar(r={}){if(!this.http)throw new g("SEI_RESPOSTA_INESPERADA","Formul\xE1rio sem transporte HTTP.");if(!this.action)throw new g("SEI_VERSAO_NAO_SUPORTADA",`O formul\xE1rio ${this.id} n\xE3o tem action.`);let e=this.pares();r.botao&&e.push(this.botaoDeEnvio(r.botao));let t=await this.http.enviar(this.action,e,r);if(r.sucesso&&!r.sucesso(t))throw new g("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o confirmou ${r.operacao??"a opera\xE7\xE3o"}.`,`${E(t.doc.querySelector("title"))} \u2014 ${t.url.replace(/infra_hash=\w+/,"infra_hash=\u2026")}`);return t}botaoDeEnvio(r){let e=this.elemento.querySelector(`[name="${r}"]`)??lr([...this.elemento.querySelectorAll('button[type="submit"][name^="sbm"], input[type="submit"][name^="sbm"]')]);return e?[e.getAttribute("name")??r,e.getAttribute("value")??E(e)??r]:[r,r]}hiddenDaLupa(r){let e=dr(this.pagina.html).find(([t])=>t===r);return e?e[1]:null}sincronizarLupas(){for(let[r,e]of dr(this.pagina.html)){let t=this.elemento.querySelector(`select#${ur(r)}`);if(!t)continue;let a=[...t.querySelectorAll("option")].map(n=>({id:n.getAttribute("value")??"",texto:E(n)}));(this.valor(e)??"")||this.definir({[e]:pr(a)}),this.campos=this.campos.filter(n=>n.nome!==r&&n.nome!==`${r}[]`)}}};function be(o){let r=[];for(let e of o.querySelectorAll("input, select, textarea")){let t=e.getAttribute("name");if(!t||e.hasAttribute("disabled"))continue;let a=e.tagName.toLowerCase();if(a==="input"){let n=(e.getAttribute("type")??"text").toLowerCase();if(["submit","button","image","reset","file"].includes(n)||(n==="checkbox"||n==="radio")&&!e.hasAttribute("checked"))continue;r.push({nome:t,valor:e.getAttribute("value")??(n==="checkbox"||n==="radio"?"on":"")})}else if(a==="textarea")r.push({nome:t,valor:e.textContent??""});else{let n=[...e.querySelectorAll("option")],i=n.filter(c=>c.hasAttribute("selected")),s=e.hasAttribute("multiple"),p=i.length?i:!s&&n.length?[n[0]]:[];for(let c of p)r.push({nome:t,valor:c.getAttribute("value")??E(c)})}}return r}function U(o){return o.normalize("NFD").replace(/[\u0300-\u036F]/g,"").toLowerCase().replace(/\s+/g," ").trim()}function lr(o){return o.length===1?o[0]:void 0}function ur(o){return o.replace(/([^\w-])/g,"\\$1")}async function Ae(o,r,e){let t=await o.arvore(r,{sinal:e});if(t.nivel==="sigiloso")throw new g("SEI_SIGILOSO","Processo sigiloso: o agente n\xE3o atua nele.");return t}function ye(o,r,e){let t=sr(o,r);if(!t)throw new g("SEI_ACAO_INDISPONIVEL",`"${e}" n\xE3o est\xE1 dispon\xEDvel no processo ${o.protocolo} (processo fechado na unidade ou sem permiss\xE3o).`);return t}var Ee=o=>r=>D(r.url).get("acao")!==o;async function Se(o,r,e){let t=ye(r,"andamento_marcador_gerenciar","Gerenciar Marcador");return o.http.obter(t,{sinal:e,aceitarValidacao:!0})}function fr(o){return[...o.doc.querySelectorAll("#tblMarcadores tr")].filter(e=>e.querySelector("input[type=checkbox]")).map(e=>{let t=[...e.querySelectorAll("td")];return{id:e.querySelector("input[type=checkbox]")?.getAttribute("value")??"",marcador:E(t[1]),texto:E(t[2]),usuario:E(t[3]),data:E(t[4])}})}async function gr(o,r,e,t){let a=await Ae(o,r,t.sinal),n=await Se(o,a,t.sinal),i=fr(n),s=U(e.marcador),p=i.find(u=>U(u.marcador)===s),c={alvo:a.protocolo,mudancas:[],aplicado:!1,resumo:""};if(e.remover){if(!p)return{...c,resumo:`O processo ${a.protocolo} n\xE3o tem o marcador "${e.marcador}".`};if(c.mudancas=[{campo:"Marcador",antes:`${p.marcador}${p.texto?`: ${p.texto}`:""}`,depois:""}],!t.aplicar)return{...c,resumo:`Vai remover o marcador "${p.marcador}" de ${a.protocolo}.`};let u=_(n.html,"andamento_marcador_remover");if(!u)throw new g("SEI_ACAO_INDISPONIVEL","A tela de marcadores n\xE3o oferece remo\xE7\xE3o.");let m=z.de(n,"#frmGerenciarMarcador",o.http);m.definir({hdnInfraItemId:p.id,hdnInfraItensSelecionados:p.id});let A=await o.http.enviar(u,m.pares(),{sinal:t.sinal,aceitarValidacao:!0});if(fr(A).some(f=>f.id===p.id))throw new g("SEI_RESPOSTA_INESPERADA",`O SEI n\xE3o removeu o marcador "${p.marcador}".`);return o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Marcador "${p.marcador}" removido de ${a.protocolo}.`}}let d;if(n.doc.querySelector("#frmAndamentoMarcadorCadastro"))d=z.de(n,"#frmAndamentoMarcadorCadastro",o.http);else{let u=_(n.html,"andamento_marcador_cadastrar");if(!u)throw new g("SEI_VERSAO_NAO_SUPORTADA","Esta vers\xE3o do SEI n\xE3o tem a tela de marcadores esperada (4.1 ou superior).");d=await z.abrir(o.http,u,"#frmAndamentoMarcadorCadastro",{sinal:t.sinal})}let l=d.escolher("selMarcador",e.marcador);return d.definir({hdnIdMarcador:l.valor,txaTexto:(e.texto??p?.texto??"").slice(0,250)}),c.mudancas=p?cr(`Texto do marcador ${l.texto}`,p.texto,e.texto):[{campo:"Marcador",antes:"",depois:`${l.texto}${e.texto?`: ${e.texto}`:""}`}],c.mudancas.length?t.aplicar?(await d.enviar({sinal:t.sinal,botao:"sbmSalvar",operacao:`o marcador em ${a.protocolo}`,sucesso:Ee("andamento_marcador_cadastrar")}),o.invalidar(a.idProcedimento),{...c,aplicado:!0,resumo:`Marcador "${l.texto}" aplicado em ${a.protocolo}.`}):{...c,resumo:`Vai marcar ${a.protocolo} com "${l.texto}".`}:{...c,resumo:"Nada a alterar: o marcador j\xE1 est\xE1 assim."}}var ze={"\u2010":"-","\u2011":"-","\u2012":"-","\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","\u2018":"'","\u2019":"'","\u201A":"'","\u201B":"'","\u2032":"'","\u201C":'"',"\u201D":'"',"\u201E":'"',"\u201F":'"',"\u2033":'"',"\u2026":"...","\u2022":"-","\u2002":" ","\u2003":" ","\u2009":" ","\u202F":" ","\u205F":" ","\u200B":"","\u200C":"","\u200D":"","\u2060":"","\uFEFF":"","\u20AC":"EUR","\u2122":"(TM)","\u2192":"->","\u2190":"<-"};function No(o,r="texto"){let e="";for(let t of o){let a=t.codePointAt(0);if(a<=255){e+=t;continue}let n=ze[t];if(r==="html"){e+=n===""?"":`&#${a};`;continue}if(n!==void 0){e+=n;continue}let i=t.normalize("NFKD").replace(/[\u0300-\u036F]/g,"");e+=[...i].every(s=>s.codePointAt(0)<=255)?i:""}return e}var we=/[A-Za-z0-9\-_.*]/;function hr(o){let r="";for(let e of o)e===" "?r+="+":we.test(e)?r+=e:r+="%"+e.charCodeAt(0).toString(16).toUpperCase().padStart(2,"0");return r}function xr(o,r={}){return o.map(([e,t])=>{let a=r[e]??"texto";return`${hr(No(e))}=${hr(No(t??"",a))}`}).join("&")}function vr(o){let r=e=>encodeURIComponent(No(e)).replace(/%20/g,"+");return o.map(([e,t])=>`${r(e)}=${r(t??"")}`).join("&")}var br="application/x-www-form-urlencoded";function Lo(o){let r=o instanceof Uint8Array?o:new Uint8Array(o),e=[],t=16384;for(let a=0;a<r.length;a+=t){let n=r.subarray(a,a+t),i=new Array(n.length);for(let s=0;s<n.length;s+=1)i[s]=rr[n[s]]??n[s];e.push(String.fromCharCode(...i))}return e.join("")}var Ar="application/x-www-form-urlencoded; charset=ISO-8859-1";function yr(o,r,e){let t=null;return{url:o,status:r,html:e,get doc(){return t??=so(e)}}}function Er(o,r={}){if(/\/login\.php/i.test(o.url)||/[?&]acao=(?:infra_)?sair\b/.test(o.url))throw new g("SEI_SESSAO_EXPIRADA","A sess\xE3o do SEI foi encerrada. Fa\xE7a login de novo no SEI e repita o pedido.");if(o.status>=500)throw new g("SEI_EXCECAO",`O SEI respondeu com erro ${o.status}.`);if(o.html.includes('id="divInfraExcecao"')){let e=o.doc.querySelector("#divInfraExcecao");if(e){let t=E(e);throw new g("SEI_EXCECAO",t||"O SEI exibiu uma p\xE1gina de erro.",t)}}if(!r.aceitarValidacao&&o.html.includes("txaInfraValidacao")){let e=o.doc.querySelector("#txaInfraValidacao")?.textContent?.trim()??"";if(e)throw new g("SEI_VALIDACAO",e,e)}return o}function Sr(o,r={}){let e=new URL(".",o),t=r.fetch??((...l)=>fetch(...l)),a=Math.max(1,r.concorrencia??3),n=0,i=[];async function s(l){n>=a&&await new Promise(u=>i.push(u)),n+=1;try{return await l()}finally{n-=1,i.shift()?.()}}let p=l=>new URL(l.replace(/&amp;/g,"&"),e).href;async function c(l,u,m){return s(async()=>{try{let A=await t(p(l),{credentials:"same-origin",redirect:"follow",...u,signal:m.sinal}),f=Lo(await A.arrayBuffer());return Er(yr(A.url||p(l),A.status,f),m)}catch(A){throw Io(A)}})}async function d(l,u={}){return s(async()=>{try{let m=await t(p(l),{credentials:"same-origin",redirect:"follow",signal:u.sinal}),A=new Uint8Array(await m.arrayBuffer()),f=(m.headers?.get("content-type")??"").split(";")[0].trim().toLowerCase();f==="text/html"&&Er(yr(m.url||p(l),m.status,Lo(A)),u);let v=m.headers?.get("content-disposition")??"",S=decodeURIComponent(/filename\*=UTF-8''([^;]+)/i.exec(v)?.[1]??/filename="?([^";]+)"?/i.exec(v)?.[1]??"");return{bytes:A,tipo:f,nome:S}}catch(m){throw Io(m)}})}return{base:e,absoluta:p,baixar:d,obter:(l,u={})=>c(l,{method:"GET"},u),enviar:(l,u,m={})=>c(l,m.utf8?{method:"POST",headers:{"Content-Type":br},body:vr(u)}:{method:"POST",headers:{"Content-Type":Ar},body:xr(u,m.modos)},m)}}function Pe(o){let r=/Sistema Eletr(?:\u00F4|&ocirc;|\\u00F4)nico de Informa[^"]*?Vers(?:\u00E3|&atilde;)o\s*([\d.]+)/i.exec(o);return r?r[1]:/\.(?:js|svg|css)\?(\d+\.\d+\.\d+)-/.exec(o)?.[1]??""}function De(o){let r=o.doc.querySelector("#lnkInfraUnidade")?.getAttribute("onclick")??"",e=/infra_unidade_atual=(\d+)/.exec(r)?.[1];if(e)return e;let t=/[?&]infra_unidade_atual=(\d+)/.exec(o.url)?.[1];return t||(o.doc.querySelector("#selInfraUnidades option[selected]")?.getAttribute("value")??"")}function Me(o){let r=o.doc,e=r.querySelector("#lnkInfraUnidade"),t=r.querySelector("#lnkUsuarioSistema")?.getAttribute("title")??"",[,a="",n="",i=""]=/^(.*?)\s*\(([^/)]+)(?:\/([^)]+))?/.exec(t)??[],s=Pe(o.html);return{host:new URL(o.url).host,versao:s,maior:Number(s.split(".")[0])||0,unidade:{id:De(o),sigla:E(e)||E(r.querySelector("#selInfraUnidades option[selected]")),nome:e?.getAttribute("title")??""},usuario:{nome:a.trim(),login:n.trim(),orgao:i.trim()}}}var Oe=3e4,lo=class{constructor(r,e=null,t){this.paginaViva=e;this.http=Sr(r,t)}http;paginaBase=null;arvores=new Map;localizados=new Map;base(){let r=this.paginaViva?.();if(r&&r.html.includes("frmProtocoloPesquisaRapida"))return r;if(this.paginaBase)return this.paginaBase;if(r)return r;throw new g("SEI_NAO_ENCONTRADO","Abra uma tela do SEI (por exemplo, Controle de Processos) nesta aba.")}contexto(){return Me(this.base())}linkMenu(r){return tr(this.base(),r)}async renovarBase(r){return this.paginaBase=await this.http.obter(this.linkMenu("procedimento_controlar"),r),this.arvores.clear(),this.localizados.clear(),this.paginaBase}async localizar(r,e){let t=r.trim();if(!t)throw new g("ARGUMENTO_INVALIDO","Informe o n\xFAmero do processo ou o n\xBA SEI do documento.");let a=this.localizados.get(t);if(a)return a;let n=z.de(this.base(),"#frmProtocoloPesquisaRapida",this.http);n.definir({txtPesquisaRapida:t});let i=await n.enviar(e),s=D(i.url);if(s.get("acao")!=="procedimento_trabalhar")throw new g("SEI_NAO_ENCONTRADO",`Nada encontrado no SEI para "${t}", ou voc\xEA n\xE3o tem acesso a ele.`);let p=i.doc.querySelector("#ifrArvore")?.getAttribute("src");if(!p)throw new g("SEI_VERSAO_NAO_SUPORTADA","A tela do processo n\xE3o trouxe a \xE1rvore.");let d=D(P(p)).get("id_procedimento")??"",l=s.get("id_protocolo")??"",u={idProcedimento:d,idDocumento:l&&l!==d?l:void 0,linkArvore:P(p)};return this.localizados.set(t,u),u}async arvore(r,e={}){let t=await this.localizar(r,e),a=this.arvores.get(t.idProcedimento);if(a&&!e.forcar&&Date.now()-a.quando<Oe)return a.arvore;let n=await ir(this.http,t.linkArvore,e);return this.arvores.set(t.idProcedimento,{quando:Date.now(),arvore:n}),n}invalidar(r){r?this.arvores.delete(r):this.arvores.clear()}esquecer(r){this.localizados.delete(r.trim())}async ajax(r,e,t){let a=await this.http.enviar(r,e,{...t,aceitarValidacao:!0}),n=[];for(let i of a.html.matchAll(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/g))n.push({id:P(i[1]),texto:P(i[2]).trim()});for(let i of a.html.matchAll(/<item\s+([^>]*)>/g)){let s=so(`<i ${i[1]}></i>`).querySelector("i");n.push({id:s?.getAttribute("id")??"",texto:s?.getAttribute("descricao")??s?.getAttribute("complemento")??""})}return n.filter(i=>i.id&&i.id!=="null")}};function j(o,r=o.location?.href??"https://sei.invalido/sei/controlador.php"){return{url:r,status:200,get html(){return o.documentElement.outerHTML},doc:o}}var M={fill:"currentColor",stroke:"none"},zr="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",wr={estrela:[["path",{d:zr}]],estrelaCheia:[["path",{d:zr,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...M}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...M}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...M}],["circle",{cx:"12",cy:"12",r:"1.4",...M}],["circle",{cx:"19",cy:"12",r:"1.4",...M}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...M}],["circle",{cx:"15",cy:"6",r:"1.3",...M}],["circle",{cx:"9",cy:"12",r:"1.3",...M}],["circle",{cx:"15",cy:"12",r:"1.3",...M}],["circle",{cx:"9",cy:"18",r:"1.3",...M}],["circle",{cx:"15",cy:"18",r:"1.3",...M}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},Ct=Object.keys(wr);function B(o,r=18,e=document){let t="http://www.w3.org/2000/svg",a=e.createElementNS(t,"svg"),n={viewBox:"0 0 24 24",width:String(r),height:String(r),fill:"none",stroke:"currentColor","stroke-width":"1.8","stroke-linecap":"round","stroke-linejoin":"round","aria-hidden":"true",focusable:"false",class:"spro-icone"};for(let[i,s]of Object.entries(n))a.setAttribute(i,s);for(let[i,s]of wr[o]){let p=e.createElementNS(t,i);for(let[c,d]of Object.entries(s))p.setAttribute(c,d);a.append(p)}return a}var uo=o=>`${o} ${Math.abs(o)===1?"dia":"dias"}`,Pr=Number.MAX_SAFE_INTEGER;function _o(o,r){let e=[r];return o.hora&&o.vencimento&&(e[0]=r.replace(/\.$/,"")+` \xE0s ${o.hora}.`),o.texto&&e.push(o.texto),o.sigla&&e.push(`Definido por ${o.sigla} no controle de prazo do SEI.`),e.join(`
`)}function Dr(o,r){let e=o.vencimento;if(o.concluidoEm&&e)return{situacao:"concluido",texto:`conclu\xEDdo em ${w(o.concluidoEm).slice(0,5)}`,dica:_o(o,`Prazo de ${w(e)} conclu\xEDdo em ${w(o.concluidoEm)}.`),ordem:Pr,sorter:`${e} 23:59:59`};if(e){let i=Mo(r,e),s=`${e} ${o.hora??"23:59"}:00`,p=_o(o,`Vence em ${w(e)}.`);return i===0?{situacao:"hoje",texto:"vence hoje",dica:p,ordem:0,sorter:s}:i<0?{situacao:"atrasado",texto:`${uo(-i)} de atraso`,dica:p,ordem:i,sorter:s}:{situacao:"noPrazo",texto:`vence em ${uo(i)}`,dica:p,ordem:i,sorter:s}}let t=o.inicio??r,a=Mo(t,r);return{situacao:"desde",texto:a===0?"hoje":a>0?`h\xE1 ${uo(a)}`:`em ${uo(-a)}`,dica:_o(o,`Contando desde ${w(t)}.`),ordem:Pr-1,sorter:`${t} ${o.hora??"23:59"}:00`}}var Mr=/(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})/,Or=/\b([01]?\d|2[0-3]):([0-5]\d)\b/,Ir=new RegExp("(?<!\\p{L})at[e\\u00E9](?!\\p{L})","iu");function Ie(o,r,e){let t=`${e}-${r}-${o}`;try{return T(F(t))===t?t:null}catch{return null}}var ke=o=>o.padStart(2,"0");function kr(o){let r=o.replace(/\r\n?/g,`
`),e=Mr.exec(r);if(!e)return null;let t=Ie(e[1],e[2],e[3]);if(!t)return null;let a=Or.exec(r),n=a?`${ke(a[1])}:${a[2]}`:void 0,i=Ir.test(r),s=r.replace(Ir,"").replace(Mr,"");return a&&(s=s.replace(Or,"")),s=s.replace(/[ \t]+/g," ").replace(/^[ \t]*\n+|\n+[ \t]*$/g,"").trim(),{data:t,hora:n,vencimento:i,texto:s}}function Cr(o){let r=`${o.vencimento?"Ate ":""}${w(o.data)} ${o.hora||"23:59"}`,e=(o.texto??"").trim();return e?`${r}
${e}`:r}var mo='a[href*="acao=controle_prazo_definir"]',Ce=/^Controle de Prazo\s*\/\s*(\S+)\s+(\d{2})\/(\d{2})\/(\d{4})\s*\(([^)]*)\)\s*$/s,Nr=(o,r,e)=>`${e}-${r}-${o}`;function Ne(o){let r=o.trim().toLowerCase(),e=/^conclu[i\u00ED]do em (\d{2})\/(\d{2})\/(\d{4})$/.exec(r);return e?{estado:"concluido",concluidoEm:Nr(e[1],e[2],e[3])}:/^at[e\u00E9] hoje$/.test(r)?{estado:"hoje"}:/^atrasado \d+ dias?$/.test(r)?{estado:"atrasado"}:/^\d+ dias?$/.test(r)?{estado:"noPrazo"}:null}function fo(o){let r=o.querySelector(mo);if(!r)return null;let e=r.getAttribute("aria-label")??"";if(!e){let c=po(r.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof c?.[0]=="string"&&(e=`Controle de Prazo / ${b(c[0])}`)}let t=Ce.exec(P(e).replace(/\s+/g," ").trim());if(!t)return null;let a=Ne(t[5]);if(!a)return null;let n=P(r.getAttribute("href")??""),i=D(n),s=i.get("id_controle_prazo")??"",p=i.get("id_procedimento")??o.id.replace(/^P/,"");return!s||!p?null:{idControlePrazo:s,idProcedimento:p,sigla:t[1],data:Nr(t[2],t[3],t[4]),link:n,...a}}function $o(o){let r=new Map;for(let e of o.querySelectorAll('tr[id^="P"]')){let t=fo(e);t&&r.set(t.idProcedimento,t)}return r}function Lr(o){return!!o.querySelector('a[onclick*="acao=controle_prazo_definir"]')}var Y="#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado";function Le(o){let r=[];for(let e of o.querySelectorAll('a[href*="acao=andamento_marcador_gerenciar"]')){let t=po(e.getAttribute("onmouseover")??"","infraTooltipMostrar")[0];typeof t?.[0]=="string"&&r.push({texto:b(t[0]),nome:b(t[1])})}return r}function go(o){for(let r of Le(o)){let e=kr(r.texto);if(e)return{nativo:fo(o),marcador:e,nomeMarcador:r.nome}}return{nativo:fo(o),marcador:null}}function ho(o){return o.querySelector("input[type=checkbox]")?.getAttribute("title")??o.querySelector('a[href*="procedimento_trabalhar"]')?.textContent?.replace(/\s+/g,"")??""}function _r(o){let r=[];for(let e of o.querySelectorAll(Y.split(", ").map(t=>`${t} input[type=checkbox]`).join(", "))){if(!e.checked)continue;let t=e.getAttribute("value")??e.closest("tr")?.id.replace(/^P/,"");t&&r.push(t)}return r}var Q="td.prazoBoxDisplay",_e=40,$e={noPrazo:{classe:"date_noprazo",icone:"relogio"},hoje:{classe:"date_hoje",icone:"alerta"},atrasado:{classe:"date_atrasado",icone:"alerta"},desde:{classe:"date_vencido",icone:"historico"},concluido:{classe:"date_entregue",icone:"check"}};function $r(o,r,e,t){let a=o.createElement(r);return a.className=e,t!==void 0&&(a.textContent=t),a}function Re(o){return[...o.querySelectorAll(Y)].flatMap(r=>[...r.querySelectorAll('tr[id^="P"]')]).filter(r=>r.querySelector(Q))}function Rr(o,r,e){let t=o.querySelector(`#processosKanban .kanban-item[data-eid="${r}"] [data-type="prazo"]`);if(!t)return;let a=e.getAttribute("data-spro-prazo")??"";t.getAttribute("data-spro-prazo")!==a&&(t.setAttribute("data-spro-prazo",a),t.replaceChildren(...[...e.childNodes].map(n=>n.cloneNode(!0))))}function qe(o,r,e,t){let a=r.querySelector(Q);if(!a)return;let n=r.id.replace(/^P/,""),i=e.ler(n);if(!i){let c=r.querySelector("input[type=checkbox]")?.hasAttribute("disabled"),d=c?"vazio-bloqueado":"vazio";if(a.getAttribute("data-spro-prazo")!==d&&(a.setAttribute("data-spro-prazo",d),a.replaceChildren(),!c)){let l=$r(o,"a","addControlePrazo spro-prazo-vazio");l.setAttribute("role","button"),l.setAttribute("tabindex","0");let u=B("relogio",14,o);u.classList.add("spro-prazo-icone"),l.append(u,o.createTextNode(" Adicionar prazo")),a.append(l)}r.classList.remove("infraTrAtrasada","infraTrAlerta"),Rr(o,n,a);return}let s=Dr(i,t),p=`${s.sorter}|${s.texto}|${s.dica}|${i.origem}`;if(a.getAttribute("data-spro-prazo")!==p){a.setAttribute("data-spro-prazo",p);let c=$e[s.situacao],d=$r(o,"span",`dateboxDisplay spro-prazo spro-prazo-${s.situacao} tagTableText_${c.classe}`);d.setAttribute("data-time-sorter",s.sorter),d.setAttribute("data-duesetdate",String(!!i.vencimento)),d.setAttribute("data-nametag",s.situacao),d.setAttribute("role","button"),d.setAttribute("tabindex","0"),d.title=s.dica;let l=B(c.icone,14,o);l.classList.add("spro-prazo-icone"),d.append(l,o.createTextNode(` ${s.texto}`)),a.replaceChildren(d)}r.classList.toggle("infraTrAtrasada",s.situacao==="atrasado"),r.classList.toggle("infraTrAlerta",s.situacao==="hoje"),Rr(o,n,a)}function qr(o,r,e,t){let a=o.defaultView,n,i,s=!1,p=f=>{if(f.nodeType!==1)return!1;let v=f;return v.matches?.("tr, td, th, table, tbody")||!!v.querySelector?.(`tr, ${Q}`)};function c(){if(n=void 0,!s)return;i?.disconnect();let f=e();for(let v of Re(o))qe(o,v,r,f);l()}function d(){!s||n!==void 0||(n=setTimeout(c,_e))}function l(){!a||!o.body||(i??=new a.MutationObserver(f=>{f.some(v=>[...v.addedNodes].some(p)||[...v.removedNodes].some(p))&&d()}),i.observe(o.body,{childList:!0,subtree:!0}))}function u(f){let v=f.target,S=v?.closest?.(Q);if(S?.closest(Y)){let O=S.closest('tr[id^="P"]');if(!O)return;f.preventDefault(),f.stopPropagation(),t([O.id.replace(/^P/,"")]);return}let C=v?.closest?.("#processosKanban .kanban-item");if(C&&v?.closest?.('[data-type="prazo"] .addControlePrazo, [data-type="prazo"] .dateboxDisplay')){let O=C.getAttribute("data-eid");if(!O)return;f.preventDefault(),f.stopPropagation(),t([O])}}function m(f){let v=f.key;(v==="Enter"||v===" ")&&u(f)}let A=r.aoMudar(d);return{ligar(){s||(s=!0,o.addEventListener("click",u,!0),o.addEventListener("keydown",m,!0),c())},desligar(){s=!1,clearTimeout(n),n=void 0,i?.disconnect(),o.removeEventListener("click",u,!0),o.removeEventListener("keydown",m,!0);for(let f of o.querySelectorAll(`${Q}[data-spro-prazo], #processosKanban [data-type="prazo"][data-spro-prazo]`))f.removeAttribute("data-spro-prazo"),f.replaceChildren()},redesenhar:c,encerrar(){this.desligar(),A()}}}function Te(o){let r=o.querySelector("#divInfraMensagens .alert-danger, #divInfraMensagens .alert-warning");if(r){let t=r.cloneNode(!0);t.querySelectorAll("button").forEach(n=>n.remove());let a=E(t);if(a)return a}let e=o.querySelector("#txaInfraValidacao");return(e?.value??e?.textContent??"").trim()}function xo(o){let r=/[?&]acao=controle_prazo_definir\b/.test(o.url)&&!!o.doc.querySelector("#frmControlePrazoCadastro"),e=Te(o.doc);return e?{ok:!1,erro:e,pagina:o}:r?{ok:!1,erro:"O SEI n\xE3o confirmou a grava\xE7\xE3o do prazo.",pagina:o}:{ok:!0,pagina:o}}function vo(o,r){for(let e of o.querySelectorAll(`a[onclick*="acao=${r}"]`)){let t=/acaoControleProcessos\('([^']+)'/.exec(e.getAttribute("onclick")??"");if(t)return t[1].replace(/&amp;/g,"&")}return null}function To(o,r){let e=o.querySelector(`tr#P${r}:not(.typeGerados)`)??o.querySelector(`tr#P${r}`);if(!e)return null;if(e.classList.contains("typeGerados"))return"Gerados";let t=e.closest("table")?.id??"",a=/^tblProcessos(Recebidos|Gerados|Detalhado)$/.exec(t);return a?a[1]:null}var Ro=new WeakMap;async function Tr(o,r,e,t){let a=Ro.get(r);if(a)return a;let n=vo(r,"controle_prazo_definir");if(!n)throw new Error("Esta tela n\xE3o tem o controle de prazo nativo do SEI.");let i=To(r,t);if(!i)throw new Error("O processo n\xE3o est\xE1 numa tabela do Controle de Processos.");let s=z.de(j(r,e),"#frmProcedimentoControlar");s.definir({[`hdn${i}ItensSelecionados`]:t});let p=await o.enviar(n,s.pares(),{aceitarValidacao:!0}),c=z.de(p,"#frmControlePrazoCadastro").action;return Ro.set(r,c),c}function Ho(o){Ro.delete(o)}function qo(o,r,e=[]){return[["rdoPrazo",r],...e,["hdnIdControlePrazo",""],["hdnIdProcedimentos",o.join(",")],["sbmDefinirControlePrazo","Salvar"]]}async function Hr(o,r,e,t){let a=t.tipo==="data"?qo(e,"1",[["txtPrazo",w(t.data)],["txtDias",""]]):qo(e,"2",[["txtPrazo",""],["txtDias",String(t.dias)],...t.uteis?[["chkSinDiasUteis","on"]]:[]]);return xo(await o.enviar(r,a,{aceitarValidacao:!0}))}async function Vr(o,r,e){return xo(await o.enviar(r,qo(e,"3"),{aceitarValidacao:!0}))}async function Fr(o,r){let e=await o.obter(r,{aceitarValidacao:!0}),t=/\.action\s*=\s*'([^']*acao=controle_prazo_excluir[^']*)'/.exec(e.html)?.[1]?.replace(/&amp;/g,"&");if(!t)return{ok:!1,erro:"Voc\xEA n\xE3o tem permiss\xE3o para excluir o controle de prazo.",pagina:e};let a=z.de(e,"#frmControlePrazoCadastro");return xo(await o.enviar(t,a.pares(),{aceitarValidacao:!0}))}async function Ur(o,r,e,t){let a=vo(r,"andamento_marcador_cadastrar")??vo(r,"andamento_marcador_gerenciar"),n=To(r,t);if(!a||!n)return[];let i=z.de(j(r,e),"#frmProcedimentoControlar");i.definir({[`hdn${n}ItensSelecionados`]:t});let s=await o.enviar(a,i.pares(),{aceitarValidacao:!0});return z.de(s,"#frmAndamentoMarcadorCadastro, #frmGerenciarMarcador").opcoes("selMarcador").filter(c=>c.valor&&c.valor!=="null"&&c.valor!=="0").map(c=>({valor:c.valor,texto:c.texto}))}var jr="spro-prz-host";function h(o,r,e="",t){let a=o.createElement(r);return e&&(a.className=e),t!==void 0&&(a.textContent=t),a}function G(o,r,e){let t=h(o,"button",r,e);return t.type="button",t}function oo(o,r,...e){let t=h(o,"label","spro-prz-campo");return t.append(h(o,"span","spro-prz-rotulo",r),...e),t}function Br(o,r,e,t,a){o.querySelectorAll(`.${jr}`).forEach(y=>y.remove());let i=r.length===1?a.inicial?.prazo??null:null,s=h(o,"div",jr);s.setAttribute("data-tema",a.escuro?"escuro":"claro");let p=s.attachShadow({mode:"open"}),c=o.createElement("style");c.textContent=a.css??"";let d=h(o,"dialog","spro-dialogo spro-prz-dialogo");d.setAttribute("aria-labelledby","spro-prz-titulo");let l=h(o,"h2","spro-prz-titulo",a.titulo);l.id="spro-prz-titulo";let u=G(o,"spro-botao-icone","");u.setAttribute("aria-label","Fechar (Esc)"),u.title="Fechar (Esc)",u.append(B("fechar",16,o));let m=h(o,"span","spro-dialogo-icone");m.setAttribute("aria-hidden","true"),m.append(B("relogio",18,o));let A=o.createElement("header");A.append(m,l,u);let f=o.createElement("input");f.type="checkbox",f.id="spro-prz-venc",f.checked=i?!!i.vencimento:!0;let v=h(o,"label","spro-prz-interruptor");v.htmlFor="spro-prz-venc",v.append(f,o.createTextNode(" Controlar vencimento"));let S=G(o,"","Data"),C=G(o,"","Em N dias");S.setAttribute("role","radio"),C.setAttribute("role","radio");let O=h(o,"div","spro-segmentado");O.setAttribute("role","radiogroup"),O.setAttribute("aria-label","Como informar o vencimento"),O.append(S,C);let I="data",H=h(o,"input","spro-campo");H.type="date",H.value=i?.vencimento??i?.inicio??t();let N=h(o,"input","spro-campo spro-prz-dias");N.type="number",N.min="1",N.max="999",N.placeholder="dias";let ro=o.createElement("input");ro.type="checkbox";let Vo=h(o,"label","spro-prz-uteis");Vo.append(ro,o.createTextNode(" \xFAteis"));let X=h(o,"input","spro-campo spro-prz-hora");X.type="time",X.value=i?.hora??"";let J=h(o,"select","spro-campo"),yo=o.createElement("option");yo.value="",yo.textContent="\u2014 nenhum \u2014",J.append(yo);let $=h(o,"input","spro-campo");$.type="text",$.maxLength=200,$.value=i?.texto??"",$.placeholder="Opcional: Responder of\xEDcio";let Eo=h(o,"div","spro-prz-linha"),So=h(o,"div","spro-prz-linha");So.append(N,Vo),Eo.append(H);let Fo=oo(o,"Vencimento",O,Eo,So),Z=h(o,"input","spro-campo");Z.type="date",Z.value=i?.inicio??t();let zo=oo(o,"Data inicial",Z);zo.hidden=!0;let oe=oo(o,"Hora (opcional)",X),re=oo(o,"Marcador",J),ee=oo(o,"Texto (opcional)",$),eo=h(o,"p","spro-prz-destino");eo.setAttribute("aria-live","polite");let V=h(o,"p","spro-prz-erro");V.setAttribute("role","alert");let to=h(o,"p","spro-prz-progresso");to.setAttribute("aria-live","polite");let wo=h(o,"ul","spro-prz-falhas"),ao=G(o,"spro-botao perigo spro-esquerda spro-prz-remover","Remover prazo"),no=G(o,"spro-botao spro-prz-concluir","Concluir"),W=G(o,"spro-botao primario spro-prz-salvar","Salvar"),Uo=h(o,"div","spro-dialogo-rodape spro-prz-rodape");Uo.append(ao,no,W);let te=r.some(y=>e.ler(y)),ae=r.some(y=>e.ler(y)?.idControlePrazo);ao.hidden=!te,no.hidden=!ae;let jo=h(o,"div","spro-dialogo-corpo");jo.append(v,Fo,zo,oe,re,ee,eo,V,to,wo,Uo),d.append(A,jo),p.append(c,d);let ne=()=>f.checked?H.value:Z.value,Bo=()=>({ids:r,vencimento:f.checked,contagem:f.checked?I:"data",data:ne()||void 0,dias:N.value?Number(N.value):void 0,uteis:ro.checked,hora:X.value||void 0,texto:$.value.trim()||void 0,marcador:J.value||void 0});function R(){let y=f.checked;Fo.hidden=!y,zo.hidden=y,Eo.hidden=I!=="data",So.hidden=I!=="dias",S.setAttribute("aria-checked",String(I==="data")),C.setAttribute("aria-checked",String(I==="dias")),S.setAttribute("aria-selected",String(I==="data")),C.setAttribute("aria-selected",String(I==="dias"));let x=e.decidir(Bo());eo.textContent=x.aviso??(x.nativo&&!x.erro?"Ser\xE1 gravado no controle de prazo do SEI.":""),V.textContent=x.erro??"",W.disabled=!!x.erro||Go}let Go=!1,Ko=y=>{Go=y;for(let x of[W,ao,no])x.disabled=y;y||R()};for(let y of[f,H,Z,N,ro,X,J,$])y.addEventListener("input",R),y.addEventListener("change",R);S.addEventListener("click",()=>{I="data",R()}),C.addEventListener("click",()=>{I="dias",R()}),a.marcadores?.().then(y=>{let x=a.inicial?.marcador;for(let q of y){let io=o.createElement("option");io.value=q.valor,io.textContent=q.texto,x&&(q.texto===x||q.valor===x)&&(io.selected=!0),J.append(io)}R()}).catch(()=>{});let Po=()=>{d.close?.(),s.remove()};u.addEventListener("click",Po),d.addEventListener("cancel",()=>s.remove());async function Do(y){Ko(!0),V.textContent="",wo.replaceChildren();try{let x=await y();if(x.erro)V.textContent=x.erro;else if(x.falhas.length){to.textContent=`${x.gravados.length} de ${r.length} gravados.`;for(let q of x.falhas)wo.append(h(o,"li","",`${q.protocolo}: ${q.erro}`))}else{a.aoConcluir?.(r),Po();return}}catch(x){V.textContent=x instanceof Error?x.message:String(x)}Ko(!1)}let Xo=(y,x)=>{to.textContent=x>1?`Gravando ${y} de ${x}\u2026`:""};return W.addEventListener("click",()=>{W.disabled||Do(()=>e.salvar(Bo(),Xo))}),ao.addEventListener("click",()=>void Do(()=>e.remover(r,Xo))),no.addEventListener("click",()=>void Do(()=>e.concluir(r))),i?.vencimento&&!i.concluidoEm&&(H.value=i.vencimento),i?.concluidoEm&&(eo.textContent=`Prazo de ${w(i.vencimento??t())} conclu\xEDdo em ${w(i.concluidoEm)}.`),R(),(o.body??o.documentElement).append(s),typeof d.showModal=="function"?d.showModal():d.setAttribute("open",""),{fechar:Po}}function Gr(o,r,e){if(r){let a={idProcedimento:o,origem:"nativo",vencimento:r.data,idControlePrazo:r.idControlePrazo,sigla:r.sigla,linkNativo:r.link,...r.concluidoEm?{concluidoEm:r.concluidoEm}:{}};return e?.vencimento&&e.data===r.data?{...a,origem:"ambos",hora:e.hora,texto:e.texto||void 0}:a}if(!e)return null;let t={idProcedimento:o,origem:"marcador",hora:e.hora,texto:e.texto||void 0};return e.vencimento?{...t,vencimento:e.data}:{...t,inicio:e.data}}var K=o=>!o||!o.trim();function Kr(o,r,e,t=new Set){if(o.ids.length===0)return{nativo:!1,marcador:!1,erro:"Selecione ao menos um processo."};if(!o.vencimento)return o.data?{nativo:!1,marcador:!0,...K(o.marcador)?{erro:"Escolha o marcador em que a data inicial ser\xE1 gravada."}:{},aviso:"A data inicial fica s\xF3 no marcador: o controle de prazo do SEI s\xF3 aceita vencimentos."}:{nativo:!1,marcador:!0,erro:"Informe a data inicial."};if(o.contagem==="data"&&!o.data)return{nativo:!1,marcador:!1,erro:"Informe a data de vencimento."};if(o.contagem==="dias"&&!(Number.isInteger(o.dias)&&(o.dias??0)>=1&&(o.dias??0)<=999))return{nativo:!1,marcador:!1,erro:"Informe o n\xFAmero de dias (1 a 999)."};let a=o.contagem==="data"&&!!o.data&&o.data<e,n=!K(o.hora)||!K(o.texto)||!K(o.marcador);if(r&&!a)return n&&K(o.marcador)?{nativo:!0,marcador:!0,erro:"Escolha o marcador em que a hora e o texto ser\xE3o gravados."}:{nativo:!0,marcador:n,...n?{aviso:"O vencimento vai para o controle de prazo do SEI; a hora e o texto, para o marcador."}:{}};let i=o.contagem==="dias"?o.uteis?Zo(e,o.dias,t):L(e,o.dias):void 0;return{nativo:!1,marcador:!0,...K(o.marcador)?{erro:"Escolha o marcador em que o prazo ser\xE1 gravado."}:{},aviso:a?"A data j\xE1 passou e o controle de prazo do SEI s\xF3 aceita datas futuras: o prazo vai para o marcador.":"Este SEI n\xE3o oferece o controle de prazo nativo (4.1.5 ou superior) ou o seu perfil n\xE3o o permite: o prazo vai para o marcador.",...i?{dataCalculada:i}:{}}}var bo=o=>or(o)||o instanceof Error?o.message:String(o),Ao=class{constructor(r){this.d=r}sobre=new Map;ouvintes=new Set;nativoDisponivel(){return Lr(this.d.doc)}aoMudar(r){return this.ouvintes.add(r),()=>this.ouvintes.delete(r)}linha(r){return this.d.doc.querySelector(`tr#P${r}`)}ler(r){let e=this.linha(r),t=e?go(e):{nativo:null,marcador:null},a=this.sobre.get(r);return Gr(r,a?.nativo!==void 0?a.nativo:t.nativo,a?.marcador!==void 0?a.marcador:t.marcador)}marcadorDoPrazo(r){let e=this.sobre.get(r);if(e?.marcador!==void 0)return e.marcador?e.nomeMarcador:void 0;let t=this.linha(r);return t?go(t).nomeMarcador:void 0}decidir(r){let e=this.d.hoje();return Kr(r,this.nativoDisponivel(),e,this.d.feriados?.(e))}protocolo(r){let e=this.linha(r);return e&&ho(e)||r}notificar(){for(let r of this.ouvintes)r()}sincronizarIcone(r,e){let t=e.querySelector(`tr#P${r} ${mo}`);for(let a of this.d.doc.querySelectorAll(`tr#P${r}`)){let n=a.querySelector(mo);if(t){let i=this.d.doc.importNode(t,!0);n?n.replaceWith(i):(a.querySelectorAll("td")[1]??a).append(i)}else n?.remove()}}async acao(r){return Tr(this.d.http,this.d.doc,this.d.url,r)}async salvar(r,e=()=>{}){let t=this.decidir(r),a={gravados:[],falhas:[]};if(t.erro)return{...a,erro:t.erro};let n=(c,d)=>a.falhas.push({id:c,protocolo:this.protocolo(c),erro:d}),i=new Map,s=r.ids,p=0;if(e(0,s.length),t.nativo)try{let c=await this.acao(s[0]),d=await Hr(this.d.http,c,s,r.contagem==="data"?{tipo:"data",data:r.data}:{tipo:"dias",dias:r.dias,uteis:!!r.uteis});if(!d.ok)return{...a,erro:d.erro};let l=$o(d.pagina.doc);for(let u of s){let m=l.get(u);m?(this.sobre.set(u,{...this.sobre.get(u),nativo:m}),i.set(u,m.data)):r.data&&i.set(u,r.data),this.sincronizarIcone(u,d.pagina.doc)}if(s=s.filter(u=>t.marcador&&!i.has(u)?(n(u,"O SEI gravou o prazo, mas a data n\xE3o veio na resposta; o marcador n\xE3o foi atualizado."),!1):!0),!t.marcador)for(let u of s)a.gravados.push(u)}catch(c){return Ho(this.d.doc),{...a,erro:bo(c)}}if(t.marcador)for(let c of s){let d=i.get(c)??r.data??t.dataCalculada;if(!d){n(c,"Sem data para gravar no marcador.");continue}try{let l=Cr({vencimento:r.vencimento,data:d,hora:r.hora?.trim()||void 0,texto:r.texto});await this.d.escreverMarcador(this.protocolo(c),r.marcador,l),this.sobre.set(c,{...this.sobre.get(c),nomeMarcador:r.marcador,marcador:{data:d,hora:r.hora?.trim()||void 0,vencimento:r.vencimento,texto:(r.texto??"").trim()}}),a.gravados.push(c)}catch(l){n(c,bo(l))}e(++p,s.length)}return e(s.length,s.length),this.notificar(),a}async remover(r,e=()=>{}){let t={gravados:[],falhas:[]},a=0;for(let n of r){let i=this.ler(n),s=this.linha(n),p=s?go(s):null;try{let c=this.sobre.get(n),d=c?.nativo!==void 0?c.nativo:p?.nativo;if(d){let m=await Fr(this.d.http,d.link);if(!m.ok)throw new Error(m.erro);this.sobre.set(n,{...this.sobre.get(n),nativo:null}),this.sincronizarIcone(n,m.pagina.doc)}let l=c?.marcador!==void 0?c.marcador:p?.marcador,u=this.marcadorDoPrazo(n);u&&l&&(await this.d.escreverMarcador(this.protocolo(n),u,""),this.sobre.set(n,{...this.sobre.get(n),marcador:null,nomeMarcador:void 0})),i&&t.gravados.push(n)}catch(c){t.falhas.push({id:n,protocolo:this.protocolo(n),erro:bo(c)})}e(++a,r.length)}return this.notificar(),t}async concluir(r){let e={gravados:[],falhas:[]},t=r.filter(a=>this.ler(a)?.idControlePrazo);if(t.length===0)return{...e,erro:"Nenhum dos processos tem prazo no controle do SEI para concluir."};try{let a=await Vr(this.d.http,await this.acao(t[0]),t);if(!a.ok)return{...e,erro:a.erro};let n=$o(a.pagina.doc);for(let i of t){let s=n.get(i);s&&this.sobre.set(i,{...this.sobre.get(i),nativo:s}),this.sincronizarIcone(i,a.pagina.doc),e.gravados.push(i)}}catch(a){return Ho(this.d.doc),{...e,erro:bo(a)}}return this.notificar(),e}};var Xr=`/* O modal "Prazo", dentro do Shadow DOM, depois do base.css do sei-comum. */
.spro-prz-titulo { margin: 0; }
.spro-prz-campo {
  display: grid;
  gap: 5px;
}
.spro-prz-campo[hidden],
.spro-prz-linha[hidden],
.spro-prz-rodape button[hidden] { display: none; }
.spro-prz-rotulo {
  font-size: 12px;
  font-weight: 600;
  color: var(--spro-suave);
}
.spro-prz-linha {
  display: flex;
  align-items: center;
  gap: 10px;
}
.spro-prz-dias { width: 90px; }
.spro-prz-hora { width: 130px; }
.spro-prz-interruptor,
.spro-prz-uteis {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}
.spro-prz-interruptor { font-weight: 600; }
.spro-prz-destino {
  margin: 0;
  padding: 8px 10px;
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--spro-suave);
  background: var(--spro-fundo-2);
  border-radius: var(--spro-raio);
}
.spro-prz-destino:empty,
.spro-prz-erro:empty,
.spro-prz-progresso:empty,
.spro-prz-falhas:empty { display: none; }
.spro-prz-erro {
  margin: 0;
  font-size: 12.5px;
  color: var(--spro-perigo, #c0392b);
}
.spro-prz-progresso { margin: 0; font-size: 12.5px; color: var(--spro-suave); }
.spro-prz-falhas {
  margin: 0;
  padding-left: 18px;
  font-size: 12.5px;
  color: var(--spro-perigo, #c0392b);
}
`;var Jr=`/* A coluna "Prazos": a c\xE9lula \xE9 do legado; aqui s\xF3 o conte\xFAdo desenhado pelo m\xF3dulo. */
.tabelaControle .dateboxDisplay.spro-prazo,
#processosKanban .dateboxDisplay.spro-prazo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}
.dateboxDisplay.spro-prazo .spro-prazo-icone { flex: none; }
/* "Adicionar prazo" aparece ao passar o mouse: o legado (sei-pro.css) controla o display. */
td.prazoBoxDisplay .spro-prazo-vazio,
#processosKanban .spro-prazo-vazio { cursor: pointer; }
td.prazoBoxDisplay .spro-prazo-vazio .spro-prazo-icone,
#processosKanban .spro-prazo-vazio .spro-prazo-icone { vertical-align: -3px; margin-right: 2px; }
.dateboxDisplay.spro-prazo-noPrazo .spro-prazo-icone { color: #4285f4; }
.dateboxDisplay.spro-prazo-hoje .spro-prazo-icone { color: #b26a00; }
.dateboxDisplay.spro-prazo-atrasado .spro-prazo-icone { color: #c0392b; }
.dateboxDisplay.spro-prazo-atrasado { color: #a1281c; }
.dateboxDisplay.spro-prazo-concluido .spro-prazo-icone { color: #2e7d32; }
.dateboxDisplay.spro-prazo-concluido { color: #6a6a6a; }
.dateboxDisplay.spro-prazo-desde .spro-prazo-icone { color: #777; }
td.prazoBoxDisplay .spro-prazo-vazio,
#processosKanban .spro-prazo-vazio { color: #666; font-style: italic; font-size: 9pt; }
td.prazoBoxDisplay .spro-prazo-vazio .spro-prazo-icone,
#processosKanban .spro-prazo-vazio .spro-prazo-icone { color: #4285f4; }
/* O modo noturno do legado pinta todo elemento (.seiSlim.dark-mode *): devolve as cores com peso maior. */
.seiSlim.dark-mode td.prazoBoxDisplay .dateboxDisplay.spro-prazo-noPrazo .spro-prazo-icone,
.seiSlim.dark-mode #processosKanban .dateboxDisplay.spro-prazo-noPrazo .spro-prazo-icone { color: #7fb0ff; }
.seiSlim.dark-mode td.prazoBoxDisplay .dateboxDisplay.spro-prazo-hoje .spro-prazo-icone,
.seiSlim.dark-mode #processosKanban .dateboxDisplay.spro-prazo-hoje .spro-prazo-icone { color: #f0b040; }
.seiSlim.dark-mode td.prazoBoxDisplay .dateboxDisplay.spro-prazo-atrasado .spro-prazo-icone,
.seiSlim.dark-mode #processosKanban .dateboxDisplay.spro-prazo-atrasado .spro-prazo-icone { color: #ff7a6b; }
.seiSlim.dark-mode td.prazoBoxDisplay .dateboxDisplay.spro-prazo-concluido .spro-prazo-icone,
.seiSlim.dark-mode #processosKanban .dateboxDisplay.spro-prazo-concluido .spro-prazo-icone { color: #7bc67e; }
.seiSlim.dark-mode td.prazoBoxDisplay .spro-prazo-vazio .spro-prazo-icone,
.seiSlim.dark-mode #processosKanban .spro-prazo-vazio .spro-prazo-icone { color: #7fb0ff; }
`;var Zr="gerenciarprazos",Wr="data-spro-prazos",Yr="data-spro-prazos-alvo";function Qr(){if(new URL(location.href).searchParams.get("acao")!=="procedimento_controlar")return;let o=document.documentElement,r=new lo(location.href,()=>j(document,location.href)),e=new Ao({doc:document,url:location.href,http:r.http,hoje:()=>T(),feriados:c=>Wo(Array.from({length:4},(d,l)=>Number(c.slice(0,4))+l)),escreverMarcador:async(c,d,l)=>{await gr(r,c,{marcador:d,texto:l},{aplicar:!0})}});function t(c){let d=c.length?c:_r(document),l=d.length===1?d[0]:null,u=l?document.querySelector(`tr#P${l}`):null;Br(document,d,e,()=>T(),{css:`${Qo}
${Xr}`,escuro:!!document.body?.classList.contains("dark-mode")||Yo(localStorage),titulo:l?`Prazo do processo ${u?ho(u):l}`:d.length?`Prazo em ${d.length} processos`:"Prazo em processos",marcadores:d.length?()=>Ur(r.http,document,location.href,d[0]):void 0,inicial:l?{prazo:e.ler(l),marcador:e.marcadorDoPrazo(l)}:void 0,aoConcluir:m=>{for(let A of m)for(let f of document.querySelectorAll(`tr#P${A} input[type=checkbox]`))f.checked&&f.click()}})}let a=qr(document,e,()=>T(),t),n=null,i=!1;function s(c){c!==i&&(i=c,c?(n=document.createElement("style"),n.textContent=Jr,document.head.append(n),o.setAttribute(Wr,"1"),a.ligar()):(a.desligar(),o.removeAttribute(Wr),n?.remove(),n=null,document.dispatchEvent(new CustomEvent("spro-prazos-desligado"))))}document.addEventListener("spro-prazos-abrir",()=>{if(!i)return;let c=o.getAttribute(Yr)??"";o.removeAttribute(Yr),t(c?[c]:[])}),e.aoMudar(()=>document.dispatchEvent(new CustomEvent("spro-prazos-alterado")));let p=!1;chrome.storage.onChanged.addListener((c,d)=>{d!=="sync"||!("dataValues"in c)||(p=!0,s(Oo(c.dataValues.newValue,Zr)))}),chrome.storage.sync.get("dataValues").then(c=>{p||s(Oo(c.dataValues,Zr))}).catch(()=>{})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Qr,{once:!0}):Qr();})();
