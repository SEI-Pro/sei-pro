/* GERADO por estilo-avancado/build.mjs. NAO EDITE ESTE ARQUIVO. Rode: npm run build */
"use strict";(()=>{var z="#1f5fbf",ea="#79acff",uo="#14181d",sa={claro:"#ffffff",escuro:"#1a1d21"},mo=4.5,N=[{id:"sei-pro",nome:"SEI Pro",cor:"#1f5fbf"},{id:"oceano",nome:"Oceano",cor:"#0b6e99"},{id:"floresta",nome:"Floresta",cor:"#1f7a4d"},{id:"esmeralda",nome:"Esmeralda",cor:"#0e7c66"},{id:"grafite",nome:"Grafite",cor:"#3a4350"},{id:"vinho",nome:"Vinho",cor:"#8a2a43"},{id:"roxo",nome:"Roxo",cor:"#5b43b8"},{id:"ambar",nome:"\xC2mbar",cor:"#a85d00"},{id:"ardosia",nome:"Ard\xF3sia",cor:"#475c7a"},{id:"preto",nome:"Preto",cor:"#14181d"},{id:"rosa",nome:"Rosa",cor:"#c2417a"},{id:"magenta",nome:"Magenta",cor:"#9c2a8c"},{id:"indigo",nome:"\xCDndigo",cor:"#3949ab"},{id:"turquesa",nome:"Turquesa",cor:"#0a7c86"},{id:"terracota",nome:"Terracota",cor:"#a8452a"},{id:"oliva",nome:"Oliva",cor:"#5a7424"},{id:"cobre",nome:"Cobre",cor:"#8a5a3c"},{id:"azul-petroleo",nome:"Azul-petr\xF3leo",cor:"#1b4f72"}],Q=(o,a=0,t=1)=>Math.min(t,Math.max(a,o));function y(o){let a=String(o).trim().toLowerCase(),t=/^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(a);if(t)return[t[1],t[2],t[3]].map(e=>Number.parseInt(e+e,16));let r=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/.exec(a);return r?[r[1],r[2],r[3]].map(e=>Number.parseInt(e,16)):null}var H=o=>`#${o.map(a=>Math.round(Q(a,0,255)).toString(16).padStart(2,"0")).join("")}`,bo=o=>o<=.04045?o/12.92:((o+.055)/1.055)**2.4,na=o=>o<=.0031308?12.92*o:1.055*o**(1/2.4)-.055;function ia(o){let[a,t,r]=o.map(d=>bo(d/255)),e=Math.cbrt(.4122214708*a+.5363325363*t+.0514459929*r),s=Math.cbrt(.2119034982*a+.6806995451*t+.1073969566*r),n=Math.cbrt(.0883024619*a+.2817188376*t+.6299787005*r);return[.2104542553*e+.793617785*s-.0040720468*n,1.9779984951*e-2.428592205*s+.4505937099*n,.0259040371*e+.7827717662*s-.808675766*n]}function da(o,a,t){let r=(o+.3963377774*a+.2158037573*t)**3,e=(o-.1055613458*a-.0638541728*t)**3,s=(o-.0894841775*a-1.291485548*t)**3;return[4.0767416621*r-3.3077115913*e+.2309699292*s,-1.2684380046*r+2.6097574011*e-.3413193965*s,-.0041960863*r-.7034186147*e+1.707614701*s]}function B(o){let a=y(o)??y(z),[t,r,e]=ia(a),s=Math.hypot(r,e);return{l:t,c:s,h:s<1e-4?0:(Math.atan2(e,r)*180/Math.PI+360)%360}}var vo=o=>o.every(a=>a>=-5e-4&&a<=1.0005);function E({l:o,c:a,h:t}){let r=Q(o),e=t*Math.PI/180,s=d=>da(r,d*Math.cos(e),d*Math.sin(e)),n=s(a);if(!vo(n)){let d=0,l=a;for(let m=0;m<24;m++){let u=(d+l)/2;vo(s(u))?d=u:l=u}n=s(d)}return H(n.map(d=>na(Q(d))*255))}function fo(o){let a=y(o)??[0,0,0],[t,r,e]=a.map(s=>bo(s/255));return .2126*t+.7152*r+.0722*e}function L(o,a){let[t,r]=[fo(o),fo(a)];return(Math.max(t,r)+.05)/(Math.min(t,r)+.05)}function $(o,a){let t=y(o)?o:z,{l:r,c:e,h:s}=B(t),n=e<.03;a==="escuro"&&(r=Math.min(r,.42),e*=.85);let d=E({l:r,c:e,h:s}),l=L("#ffffff",d)>=L(uo,d)?"#ffffff":uo;for(let v=0;v<100&&L(l,d)<mo;v++)r+=l==="#ffffff"?-.01:.01,d=E({l:r,c:e,h:s});let u=E({l:r+(a==="escuro"?.05:-.05),c:e,h:s}),i=E({l:r-.08,c:e,h:s}),c=E({l:Math.min(r,.26),c:e*.55,h:s}),h=sa[a],b=B(n?a==="escuro"?ea:z:t),f=a==="escuro"?Math.max(b.l,.7):Math.min(b.l,.55),g=E({l:f,c:b.c,h:b.h});for(let v=0;v<100&&L(g,h)<mo;v++)f+=a==="escuro"?.01:-.01,g=E({l:f,c:b.c,h:b.h});return{barra:d,texto:l,hover:u,borda:i,menu:c,destaque:g}}var A="spro_tema",V="spro_tema_cache",C={versao:1,ativo:!1,modo:"auto",paleta:"sei-pro",corBarra:z,escurecerDocumentos:!0};function k(o){if(typeof o=="string")try{return k(JSON.parse(o))}catch{return{...C}}if(!o||typeof o!="object"||o.versao!==1)return{...C};let a=o,t=a.modo==="claro"||a.modo==="escuro"||a.modo==="auto"?a.modo:C.modo,r=N.find(l=>l.id===a.paleta),e=typeof a.corBarra=="string"?a.corBarra.trim().toLowerCase():"",s=y(e)&&/^#[0-9a-f]{6}$/.test(e)?e:null,n=r?r.id:"livre",d=r?r.cor:s??C.corBarra;return{versao:1,ativo:a.ativo===!0,modo:t,paleta:r||s?n:C.paleta,corBarra:d,escurecerDocumentos:a.escurecerDocumentos!==!1}}function P(o,a){return o.modo==="claro"?"claro":o.modo==="escuro"||a?"escuro":"claro"}var go=`/*
 * Folha base do Estilo Avan\xE7ado (sub-projeto 1): barra, p\xE1gina, links, tabelas, campos,
 * bot\xF5es e di\xE1logos. S\xF3 var(--spro-*): nenhuma cor literal aqui (h\xE1 um teste que confere).
 * Tudo sob :root[data-spro-tema-ativo], que s\xF3 existe com a op\xE7\xE3o ligada.
 *
 * Seletores do SEI 4.1.5 e do 5.0.x (infra-global-esquema-3.css). A casca completa
 * (menu, \xE1rvore, barra de a\xE7\xF5es) \xE9 do sub-projeto 2; telas nativas, do 3.
 */

/*
 * Tema nativo do SEI (esquemas de cor do infra): o SEI define as cores da barra, do menu e do
 * t\xEDtulo dos di\xE1logos em classes com !important e em vari\xE1veis no :root. S\xF3 aqui o !important
 * \xE9 permitido (o teste confere): \xE9 a \xFAnica forma de uma regra de tema vencer outra de tema.
 */
:root[data-spro-tema-ativo] {
  --infra-esquema-cor-barra-superior: var(--spro-barra-borda);
  --infra-esquema-cor-barra-sistema: var(--spro-barra);
  --infra-esquema-cor-clara: var(--spro-destaque);
  --infra-esquema-cor-escura: var(--spro-barra-borda);
  --infra-esquema-cor-texto: var(--spro-texto);
}
/* No escuro, a "cor escura" do esquema serve de texto de destaque (r\xF3tulos de cart\xF5es do Painel de Controle): precisa ser clara */
:root[data-spro-tema="escuro"] {
  --infra-esquema-cor-escura: var(--spro-destaque);
}
:root[data-spro-tema-ativo] .infraCorBarraSuperior {
  background-color: var(--spro-barra-borda) !important;
}
:root[data-spro-tema-ativo] .infraCorBarraSistema:not(img):not(#divInfraBarraSistemaPadraoE) {
  background-color: var(--spro-barra) !important;
  color: var(--spro-barra-texto);
}
/* O SEI Pro p\xF5e infraCorBarraSistema nas imagens dos bot\xF5es que injeta (Monitorados, PDF, Agente de IA, Fluxos):
   o esquema do SEI as pintaria com a cor da barra. \xCDcone \xE9 \xEDcone: sem fundo, como os bot\xF5es nativos. */
:root[data-spro-tema-ativo] img.infraCorBarraSistema,
:root[data-spro-tema-ativo] .botaoSEI img {
  background-color: transparent !important;
}
:root[data-spro-tema-ativo] .infraCorMenu {
  background-color: var(--spro-menu) !important;
}
:root[data-spro-tema-ativo] .sparkling-modal-title {
  background-color: var(--spro-barra) !important;
  color: var(--spro-barra-texto);
}
:root[data-spro-tema-ativo] div.pesquisaPaginaSelecionada {
  background-color: var(--spro-destaque) !important;
  color: var(--spro-destaque-texto);
}
:root[data-spro-tema-ativo] .divInfraAreaTelaE,
:root[data-spro-tema-ativo] #divInfraPesquisarMenu {
  background-color: var(--spro-menu);
  color: var(--spro-menu-texto);
}

/* O bot\xE3o da unidade e os da barra conjugada t\xEAm cor fixa com !important no SEI */
:root[data-spro-tema-ativo] a.infraAcaoBarraConjugada {
  color: var(--spro-texto) !important;
}

/* P\xE1gina */
:root[data-spro-tema-ativo] body,
:root[data-spro-tema-ativo] #divInfraAreaGlobal,
:root[data-spro-tema-ativo] div.infraAreaGlobal,
:root[data-spro-tema-ativo] #divInfraAreaTela,
:root[data-spro-tema-ativo] div.infraAreaTela {
  background-color: var(--spro-pagina);
  color: var(--spro-texto);
  font-family: var(--spro-fonte);
}
:root[data-spro-tema-ativo] div.infraAreaTela {
  background-image: none;
}
:root[data-spro-tema-ativo] div.infraBarraLocalizacao,
:root[data-spro-tema-ativo] label,
:root[data-spro-tema-ativo] .infraLegend,
:root[data-spro-tema-ativo] legend {
  color: var(--spro-texto);
}

/* Barra superior */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao,
:root[data-spro-tema-ativo] #divInfraBarraSistema,
:root[data-spro-tema-ativo] div.infraBarraSistema,
:root[data-spro-tema-ativo] .infraBarraSistemaPadraoE,
:root[data-spro-tema-ativo] .infraCorBarraSistema {
  background-color: var(--spro-barra);
  color: var(--spro-barra-texto);
}
/* O bloco da logo n\xE3o tem cor pr\xF3pria: deixa o degrad\xEA da barra (no pai) aparecer */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadraoE {
  background-color: transparent;
  color: var(--spro-barra-texto);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaLinha {
  background-color: var(--spro-barra-borda);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a,
:root[data-spro-tema-ativo] #divInfraBarraSistema a,
:root[data-spro-tema-ativo] div.infraBarraSistema a,
:root[data-spro-tema-ativo] div.infraBarraSistema h6,
:root[data-spro-tema-ativo] #spnInfraIdentificacaoSistema,
:root[data-spro-tema-ativo] .infraBarraSistemaPadraoE span {
  color: var(--spro-barra-texto);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a:hover,
:root[data-spro-tema-ativo] div.infraAcaoBarraSistema a:hover {
  background-color: var(--spro-barra-hover);
}

/* Painel de visualiza\xE7\xE3o (SEI 4.1 aninha a tela da \xE1rvore dentro dele; o 5 usa os mesmos cont\xEAineres) */
:root[data-spro-tema-ativo] #divArvoreConteudo,
:root[data-spro-tema-ativo] #divArvoreConteudoIfr,
:root[data-spro-tema-ativo] #divArvoreAcoes,
:root[data-spro-tema-ativo] div.barraBotoesSEI,
:root[data-spro-tema-ativo] iframe.ifrVisualizacao {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
}

/* T\xEDtulos de bloco dos formul\xE1rios (o esquema do SEI pinta com a cor dele) */
:root[data-spro-tema-ativo] label.infraLabelTitulo,
:root[data-spro-tema-ativo] legend.infraLegend {
  background: var(--spro-barra);
  color: var(--spro-barra-texto);
  border-radius: var(--spro-raio-p);
}

/* \xC1rea ao redor do documento, \xE1rvore do processo e capa (SEI Pro e SEI 4.1/5) */
:root[data-spro-tema-ativo] #divInfraAreaTelaD,
:root[data-spro-tema-ativo] .divInfraAreaTelaD {
  background-color: var(--spro-pagina);
}
:root[data-spro-tema-ativo] span.noVisitado,
:root[data-spro-tema-ativo] span.noVisitado a {
  background-color: var(--spro-destaque-suave);
  color: var(--spro-texto);
  border-radius: var(--spro-raio-p);
}
:root[data-spro-tema-ativo] a.newLink,
:root[data-spro-tema-ativo] .newLink {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] a.newLink:hover {
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] .txt_cinza,
:root[data-spro-tema-ativo] .label.txt_cinza {
  color: var(--spro-suave);
}
:root[data-spro-tema-ativo] a#lnkInfraUnidade {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border: 1px solid var(--spro-borda-forte);
}

/* Capa do processo (o SEI Pro injeta cores fixas com #capaProcessoPro) */
:root[data-spro-tema-ativo] div#capaProcessoPro .data a.newLink,
:root[data-spro-tema-ativo] div#capaProcessoPro a.newLink {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] div#capaProcessoPro .label,
:root[data-spro-tema-ativo] div#capaProcessoPro .label i {
  color: var(--spro-suave);
}

/* Destaques e superf\xEDcies que o SEI e o SEI Pro pintam de claro */
:root[data-spro-tema-ativo] a.infraArvoreNo.highlight,
:root[data-spro-tema-ativo] .highlight,
:root[data-spro-tema-ativo] .highlight span {
  background-color: var(--spro-destaque-medio);
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] a.openNewTab {
  background-color: var(--spro-fundo-2) !important;
  color: var(--spro-texto) !important;
}
:root[data-spro-tema-ativo] table.infraTable {
  background-color: var(--spro-fundo);
}
:root[data-spro-tema-ativo] span.spanRealce {
  background-color: var(--spro-destaque-medio);
  color: var(--spro-texto);
}

/* Tooltips do SEI (o que aparece ao passar o mouse) e caixas de alerta */
:root[data-spro-tema-ativo] div.infraTooltip,
:root[data-spro-tema-ativo] div#divInfraTooltip {
  background-color: var(--spro-fundo-3);
  color: var(--spro-texto);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  box-shadow: var(--spro-sombra-2);
}
:root[data-spro-tema-ativo] .infoAlerta {
  background-color: color-mix(in srgb, var(--spro-perigo) 18%, var(--spro-fundo));
  color: var(--spro-texto);
  border-color: color-mix(in srgb, var(--spro-perigo) 45%, transparent);
}
/* O fundo deste alerta \xE9 inline (gravado pelo SEI Pro): s\xF3 !important vence */
:root[data-spro-tema-ativo] #checkNaoAssinados {
  background-color: color-mix(in srgb, var(--spro-perigo) 18%, var(--spro-fundo)) !important;
  color: var(--spro-texto);
  border-color: color-mix(in srgb, var(--spro-perigo) 45%, transparent);
}

/* Linhas de status das listas (o SEI Pro injeta o fundo rosado das atrasadas com !important) */
:root[data-spro-tema-ativo] tr.infraTrAtrasada,
:root[data-spro-tema-ativo] td.infraTdAtrasada,
:root[data-spro-tema-ativo] tr.infraTrVermelha {
  background-color: color-mix(in srgb, var(--spro-perigo) 16%, var(--spro-fundo)) !important;
}
:root[data-spro-tema-ativo] tr.infraTrAlerta {
  background-color: color-mix(in srgb, var(--spro-aviso) 16%, var(--spro-fundo)) !important;
}
/* Caixa do menu do SEI 5 (aplicativo do SEI) com fundo claro inline */
:root[data-spro-tema-ativo] #divInfraAreaTelaE div[style*="f5f6f7"] {
  background-color: var(--spro-fundo-2) !important;
  color: var(--spro-menu-texto) !important;
}
/* Bot\xF5es claros do Bootstrap do SEI 5 e o quadro do modal */
:root[data-spro-tema-ativo] .btn-light,
:root[data-spro-tema-ativo] .btn-default {
  background-color: var(--spro-fundo-3);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] .btn-light.active,
:root[data-spro-tema-ativo] .btn-light:hover,
:root[data-spro-tema-ativo] .btn-default:hover {
  background-color: var(--spro-destaque-medio);
}
:root[data-spro-tema-ativo] .sparkling-modal-frame {
  background-color: var(--spro-fundo);
}

/* Selos de prazo do SEI Pro e bot\xF5es do Bootstrap: as variantes escuras deles s\xE3o do modo noturno antigo (.seiSlim.dark-mode) */
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-atrasado,
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-atrasado .spro-prazo-icone {
  color: var(--spro-perigo);
}
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-concluido {
  color: var(--spro-suave);
}
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-concluido .spro-prazo-icone {
  color: var(--spro-ok);
}
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-hoje .spro-prazo-icone {
  color: var(--spro-aviso);
}
:root[data-spro-tema="escuro"] .dateboxDisplay.spro-prazo-desde .spro-prazo-icone {
  color: var(--spro-suave);
}
:root[data-spro-tema-ativo] .btn-light *,
:root[data-spro-tema-ativo] .btn-default * {
  color: inherit;
}

/* O SEI Pro reinjeta cor fixa em .btn-light:not(:disabled):not(.disabled):active; precisa da mesma especificidade */
:root[data-spro-tema-ativo] .btn-light:not(:disabled):not(.disabled),
:root[data-spro-tema-ativo] .btn-default:not(:disabled):not(.disabled) {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] .btn-light:not(:disabled):not(.disabled):active,
:root[data-spro-tema-ativo] .btn-default:not(:disabled):not(.disabled):active {
  background-color: var(--spro-destaque-medio);
}

/* Listagens do SEI: a tabela orden\xE1vel (tablesorter) traz fundo #ccc inline, e a legenda fica sobre ele */
:root[data-spro-tema-ativo] table.tablesorter,
:root[data-spro-tema-ativo] table.infraTable {
  background-color: var(--spro-fundo) !important;
}
:root[data-spro-tema-ativo] caption.infraCaption {
  color: var(--spro-suave);
  background-color: transparent;
}
/* Linhas de destaque das listas (Blocos de Assinatura etc.): tom do tema, texto normal */
:root[data-spro-tema-ativo] tr.trVermelha,
:root[data-spro-tema-ativo] tr.trVermelha > td {
  background-color: color-mix(in srgb, var(--spro-perigo) 16%, var(--spro-fundo));
}
/* Os !important do SEI para a linha marcada (ciano) e o destaque de "sigiloso" (vermelho puro) */
:root[data-spro-tema-ativo] tr.infraTrMarcada,
:root[data-spro-tema-ativo] tr.infraTrMarcada td,
:root[data-spro-tema-ativo] td.infraTdMarcada {
  background-color: var(--spro-destaque-medio) !important;
}
/* Iniciar Processo: a lista de tipos (SEI 5 for\xE7a branco com !important) e os tipos sigilosos (vermelho do SEI) */
:root[data-spro-tema-ativo] table.tabelaOpcoes,
:root[data-spro-tema-ativo] table.tabelaOpcoes tr {
  background-color: var(--spro-fundo) !important;
}
:root[data-spro-tema-ativo] td.tdOpcaoSigiloso,
:root[data-spro-tema-ativo] td.tdOpcaoSigiloso a {
  background-color: color-mix(in srgb, var(--spro-perigo) 24%, var(--spro-fundo)) !important;
  color: var(--spro-texto);
}
/* Calend\xE1rio do SEI (Retorno Programado, datas) */
:root[data-spro-tema-ativo] #divCalendario td.diaUtil {
  background-color: var(--spro-fundo-3);
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] #divCalendario td.diaFimDeSemana {
  background-color: var(--spro-fundo-2);
  color: var(--spro-texto);
}
/* Texto vermelho inline (#ed1c24) do Painel de Controle: no escuro usa o vermelho do tema */
:root[data-spro-tema="escuro"] [style*="color:#ed1c24"] {
  color: var(--spro-perigo) !important;
}

/* Bootstrap do SEI 5 (telas de administra\xE7\xE3o e dos m\xF3dulos): campos, fieldsets, alertas e r\xF3tulos */
:root[data-spro-tema-ativo] .form-control,
:root[data-spro-tema-ativo] fieldset.infraFieldset {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] .input-group-text {
  background-color: var(--spro-fundo-3);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] .alert {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] .alert-danger {
  background-color: color-mix(in srgb, var(--spro-perigo) 16%, var(--spro-fundo));
  border-color: color-mix(in srgb, var(--spro-perigo) 40%, transparent);
}
:root[data-spro-tema-ativo] .alert-warning {
  background-color: color-mix(in srgb, var(--spro-aviso) 16%, var(--spro-fundo));
  border-color: color-mix(in srgb, var(--spro-aviso) 40%, transparent);
}
:root[data-spro-tema-ativo] .alert-success {
  background-color: color-mix(in srgb, var(--spro-ok) 16%, var(--spro-fundo));
  border-color: color-mix(in srgb, var(--spro-ok) 40%, transparent);
}
:root[data-spro-tema-ativo] .alert-info {
  background-color: var(--spro-destaque-suave);
  border-color: var(--spro-destaque-medio);
}
:root[data-spro-tema-ativo] label.input-label-first,
:root[data-spro-tema-ativo] label.input-label-second {
  color: var(--spro-suave) !important;
}
:root[data-spro-tema-ativo] .cke_inner,
:root[data-spro-tema-ativo] iframe.cke_wysiwyg_frame {
  background-color: var(--spro-fundo);
}
/* Linha de destaque laranja que um m\xF3dulo grava no atributo bgcolor (#F4A460) */
:root[data-spro-tema-ativo] tr[bgcolor="#f4a460" i],
:root[data-spro-tema-ativo] tr[bgcolor="#f4a460" i] > td {
  background-color: color-mix(in srgb, var(--spro-aviso) 18%, var(--spro-fundo));
}
/* Linha de destaque verde que um m\xF3dulo grava inline (#d8f5b9) */
:root[data-spro-tema-ativo] tr[style*="d8f5b9"] {
  background-color: color-mix(in srgb, var(--spro-ok) 16%, var(--spro-fundo)) !important;
}

/* Seletor m\xFAltiplo (multiple-select), campos somente leitura e cart\xF5es do Bootstrap (Painel de Controle) */
:root[data-spro-tema-ativo] button.ms-choice,
:root[data-spro-tema-ativo] .ms-drop {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] input.infraReadOnly,
:root[data-spro-tema-ativo] input.infraText[readonly],
:root[data-spro-tema-ativo] input.infraText:disabled {
  background-color: var(--spro-fundo-2);
  color: var(--spro-suave);
}
:root[data-spro-tema-ativo] .card,
:root[data-spro-tema-ativo] .card-body,
:root[data-spro-tema-ativo] .card-header {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}

/* O SEI pinta o r\xF3tulo do menu de branco com !important (div.infraSidebarMenu span); o menu agora \xE9 uma superf\xEDcie neutra */
:root[data-spro-tema-ativo] #infraMenu li > a {
  color: var(--spro-texto) !important;
}
:root[data-spro-tema-ativo] #infraMenu li > a > span {
  color: inherit !important;
}
:root[data-spro-tema-ativo] #infraMenu li > a.infraMenuSelecionado,
:root[data-spro-tema-ativo] #infraMenu li > a[aria-current] {
  color: var(--spro-destaque) !important;
}

/* Controles do Estilo Avan\xE7ado v1 (interruptor do modo noturno e paleta) no mesmo eixo dos \xEDcones da barra.
   O SEI Pro os escreve com style inline (display, float, margin): s\xF3 !important vence. */
:root[data-spro-tema-ativo] div[data-ref="infraAcaoBarraSistema"] {
  display: flex !important;
  align-items: center;
  float: none !important;
  gap: 10px;
  height: 40px;
  margin: 5px 10px 0 4px !important;
}
:root[data-spro-tema-ativo] div[data-ref="infraAcaoBarraSistema"] > i {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  cursor: pointer;
  transition: background-color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] div[data-ref="infraAcaoBarraSistema"] > i:hover {
  background-color: color-mix(in srgb, var(--spro-barra-texto) 18%, transparent);
}

/* Menu suspenso dos documentos e do processo na \xE1rvore (jquery.toolbar do SEI Pro): o plugin for\xE7a cores com !important */
:root[data-spro-tema-ativo] .tool-container {
  background-color: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: 12px;
  box-shadow: var(--spro-sombra-3);
}
:root[data-spro-tema-ativo] .tool-container .tool-item {
  color: var(--spro-texto) !important;
  border-radius: 8px;
}
:root[data-spro-tema-ativo] .tool-container .tool-item > .fa {
  color: var(--spro-suave);
}
:root[data-spro-tema-ativo] .tool-container .tool-item .info {
  color: var(--spro-texto);
  font-size: 13px;
}
:root[data-spro-tema-ativo] .tool-container .tool-item:hover,
:root[data-spro-tema-ativo] .tool-container .tool-item.selected {
  background: var(--spro-destaque-suave);
  color: var(--spro-texto) !important;
  border-radius: 8px;
}
:root[data-spro-tema-ativo] .tool-container .tool-item:hover > .fa,
:root[data-spro-tema-ativo] .tool-container .tool-item.selected > .fa {
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] .tool-container .tool-item:hover .info,
:root[data-spro-tema-ativo] .tool-container .tool-item.selected .info {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] .tool-container.tool-bottom .arrow {
  border-color: transparent transparent var(--spro-borda);
}
:root[data-spro-tema-ativo] .tool-container.tool-top .arrow {
  border-color: var(--spro-borda) transparent transparent;
}

/* Links */
:root[data-spro-tema-ativo] a,
:root[data-spro-tema-ativo] a.ancoraPadraoAzul,
:root[data-spro-tema-ativo] a.ancoraPadraoPreta,
:root[data-spro-tema-ativo] a.infraAncoraSigla {
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a {
  color: var(--spro-barra-texto);
}

/* Tabelas */
:root[data-spro-tema-ativo] table.infraTable {
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] table.infraTable td {
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] tr.infraTrMarcada,
:root[data-spro-tema-ativo] tr.infraTrAcessada {
  background-color: var(--spro-destaque-suave);
}
/* O hover do SEI marca a linha com infraTrSelecionada (via JS) e o esquema pinta #e5e5e5 com !important:
   no tema, a linha ganha o destaque suave e o texto continua leg\xEDvel */
:root[data-spro-tema-ativo] tr.infraTrSelecionada,
:root[data-spro-tema-ativo] tr.infraTrSelecionada td,
:root[data-spro-tema-ativo] td.infraTdSelecionada {
  background-color: var(--spro-destaque-suave) !important;
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] tr.infraTrClara:hover,
:root[data-spro-tema-ativo] tr.infraTrEscura:hover {
  background-color: var(--spro-destaque-suave);
}
:root[data-spro-tema-ativo] caption.infraCaption {
  color: var(--spro-suave);
}

/* Campos */
:root[data-spro-tema-ativo] input.infraText,
:root[data-spro-tema-ativo] textarea.infraTextarea,
:root[data-spro-tema-ativo] select.infraSelect,
:root[data-spro-tema-ativo] input[type="text"],
:root[data-spro-tema-ativo] input[type="password"],
:root[data-spro-tema-ativo] input[type="search"],
:root[data-spro-tema-ativo] input[type="date"],
:root[data-spro-tema-ativo] input[type="number"],
:root[data-spro-tema-ativo] textarea,
:root[data-spro-tema-ativo] select,
:root[data-spro-tema-ativo] .chosen-container-single .chosen-single,
:root[data-spro-tema-ativo] .chosen-container-multi .chosen-choices {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio-p);
}
:root[data-spro-tema-ativo] input.infraText:focus,
:root[data-spro-tema-ativo] textarea.infraTextarea:focus,
:root[data-spro-tema-ativo] select.infraSelect:focus,
:root[data-spro-tema-ativo] input:focus,
:root[data-spro-tema-ativo] textarea:focus,
:root[data-spro-tema-ativo] select:focus {
  outline: none;
  border-color: var(--spro-destaque);
  box-shadow: var(--spro-anel);
}
:root[data-spro-tema-ativo] input:disabled,
:root[data-spro-tema-ativo] input[readonly],
:root[data-spro-tema-ativo] textarea:disabled,
:root[data-spro-tema-ativo] select:disabled {
  background-color: var(--spro-fundo-2);
  color: var(--spro-suave);
}
:root[data-spro-tema-ativo] ::placeholder {
  color: var(--spro-fraco);
}

/* Bot\xF5es */
:root[data-spro-tema-ativo] input.infraButton,
:root[data-spro-tema-ativo] button.infraButton,
:root[data-spro-tema-ativo] a.infraAnchorButton {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border: 1px solid var(--spro-borda-forte);
  border-radius: var(--spro-raio);
  transition: background-color var(--spro-dur), border-color var(--spro-dur), box-shadow var(--spro-dur);
}
:root[data-spro-tema-ativo] input.infraButton span,
:root[data-spro-tema-ativo] button.infraButton span,
:root[data-spro-tema-ativo] button.infraButton:hover span,
:root[data-spro-tema-ativo] input.infraButton:hover span {
  color: inherit;
}
:root[data-spro-tema-ativo] input.infraButton:focus-visible,
:root[data-spro-tema-ativo] button.infraButton:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}

/* Di\xE1logos (jQuery UI e Bootstrap do SEI 5) */
:root[data-spro-tema-ativo] .ui-dialog,
:root[data-spro-tema-ativo] .modal-content,
:root[data-spro-tema-ativo] .ui-widget-content {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] .ui-dialog {
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-3);
}
:root[data-spro-tema-ativo] .ui-dialog-titlebar,
:root[data-spro-tema-ativo] .ui-widget-header,
:root[data-spro-tema-ativo] .modal-header,
:root[data-spro-tema-ativo] .modal-footer,
:root[data-spro-tema-ativo] .ui-dialog-buttonpane {
  background-color: var(--spro-fundo-2);
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] .ui-widget-overlay {
  background: var(--spro-veu);
  opacity: 1;
}

/* Rolagem */
:root[data-spro-tema-ativo] {
  scrollbar-color: var(--spro-borda-forte) var(--spro-pagina);
}

/* Editor CKEditor 4 (SEI 4.x e as \xE1reas edit\xE1veis, que s\xE3o iframes about:srcdoc) */
:root[data-spro-tema-ativo] .cke_chrome {
  border-color: var(--spro-borda);
  background: var(--spro-fundo);
  box-shadow: none;
}
:root[data-spro-tema-ativo] .cke_top,
:root[data-spro-tema-ativo] .cke_bottom,
:root[data-spro-tema-ativo] .cke_dialog_footer {
  background: var(--spro-fundo-2);
  border-color: var(--spro-borda);
  box-shadow: none;
}
:root[data-spro-tema-ativo] .cke_toolgroup,
:root[data-spro-tema-ativo] .cke_combo_button {
  background: var(--spro-fundo-3);
  border-color: var(--spro-borda-forte);
  box-shadow: none;
  border-radius: var(--spro-raio-p);
}
:root[data-spro-tema-ativo] a.cke_button,
:root[data-spro-tema-ativo] .cke_button_label,
:root[data-spro-tema-ativo] .cke_combo_text,
:root[data-spro-tema-ativo] .cke_combo_label,
:root[data-spro-tema-ativo] .cke_path_item,
:root[data-spro-tema-ativo] .cke_voice_label {
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] a.cke_button_on,
:root[data-spro-tema-ativo] a.cke_button_off:hover,
:root[data-spro-tema-ativo] a.cke_button_off:focus {
  background: var(--spro-destaque-medio);
  border-color: var(--spro-destaque);
}
/* Os \xEDcones do CK4 s\xE3o imagens escuras: no escuro viram claros (s\xF3 decora\xE7\xE3o, n\xE3o conte\xFAdo). */
:root[data-spro-tema="escuro"] .cke_button_icon,
:root[data-spro-tema="escuro"] .cke_combo_arrow,
:root[data-spro-tema="escuro"] .cke_toolbox_collapser {
  filter: invert(0.88) hue-rotate(180deg);
}
:root[data-spro-tema-ativo] .cke_contents {
  background: var(--spro-pagina);
}
:root[data-spro-tema-ativo] .cke_dialog,
:root[data-spro-tema-ativo] .cke_dialog_body,
:root[data-spro-tema-ativo] .cke_dialog_contents,
:root[data-spro-tema-ativo] .cke_dialog_contents_body,
:root[data-spro-tema-ativo] .cke_dialog_title,
:root[data-spro-tema-ativo] .cke_dialog_tabs {
  background: var(--spro-fundo);
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] a.cke_dialog_tab {
  background: var(--spro-fundo-2);
  color: var(--spro-texto);
  border-color: var(--spro-borda);
}
:root[data-spro-tema-ativo] a.cke_dialog_tab_selected {
  background: var(--spro-fundo);
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] .cke_dialog_ui_input_text input,
:root[data-spro-tema-ativo] .cke_dialog_ui_input_password input,
:root[data-spro-tema-ativo] .cke_dialog_ui_input_textarea textarea,
:root[data-spro-tema-ativo] .cke_dialog_ui_input_select select {
  background: var(--spro-fundo-2);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] a.cke_dialog_ui_button {
  background: var(--spro-fundo-3);
  color: var(--spro-texto);
  border-color: var(--spro-borda-forte);
}
:root[data-spro-tema-ativo] a.cke_dialog_ui_button_ok {
  background: var(--spro-destaque);
  color: var(--spro-destaque-texto);
}

/* Se\xE7\xF5es do documento no editor: o body das somente-leitura traz fundo cinza inline (s\xF3 !important vence, sem tocar no DOM) */
:root[data-spro-tema-ativo] body.cke_editable {
  background-color: var(--spro-pagina) !important;
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] a.cke_button_off:hover,
:root[data-spro-tema-ativo] a.cke_button_on {
  background-image: none;
}

/* A borda superior das se\xE7\xF5es da \xE1rvore \xE9 inline (SEI Pro): zerada aqui; o fio degrad\xEA est\xE1 em casca.css. */
:root[data-spro-tema-ativo] #divConsultarAndamento,
:root[data-spro-tema-ativo] .panelDadosArvore,
:root[data-spro-tema-ativo] .panelDadosArvorePro,
:root[data-spro-tema-ativo] .stickDadosArvore,
:root[data-spro-tema-ativo] #divRelacionados {
  border-top: 0 !important;
}

/* Barra de a\xE7\xF5es fixa: o legado grava o top inline (altura da barra no instante da rolagem); acompanha a altura atual. */
:root[data-spro-tema-ativo]:has(#navInfraBarraNavegacao) #divComandos.fixed,
:root[data-spro-tema-ativo]:has(#navInfraBarraNavegacao) #divBotoesControleProcessos.fixed {
  /* 5 px abaixo do fim da barra superior: respiro fino pedido (colada, ela parecia invadir a barra) */
  top: calc(var(--spro-nav-fim, var(--spro-nav-total)) + 5px) !important;
}

/* Bot\xF5es do canto do documento (Abrir em nova aba, Baixar HTML/DOCX): o SEI Pro os p\xF5e em posi\xE7\xE3o absoluta, com cor,
   margem e raio inline; no grupo (largura.ts) eles seguem o estilo do bot\xE3o de largura. */
:root[data-spro-tema-ativo] a.openNewTab.spro-doc-acao {
  position: static !important;
  margin: 0 !important;
  padding: 0 12px !important;
  border-radius: var(--spro-raio) var(--spro-raio) 0 0 !important;
  background-color: var(--spro-fundo-2) !important;
  color: var(--spro-texto) !important;
}

/* Menu suspenso do documento na \xE1rvore (plugin de toolbar do SEI Pro): a largura vem fixa (185/175 px) e o texto
   quebrava ("Copiar nome do documento"); passa a acompanhar o conte\xFAdo, sem quebrar. */
:root[data-spro-tema-ativo] .tool-container.toolbar-menu {
  width: max-content !important;
  min-width: 185px;
  max-width: calc(100vw - 16px);
}
:root[data-spro-tema-ativo] .tool-container.toolbar-menu .tool-items {
  width: auto !important;
}
:root[data-spro-tema-ativo] .tool-container.toolbar-menu .tool-item {
  width: auto !important;
  float: none !important;
  clear: both;
  white-space: nowrap;
}
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] > a.openNewTab.spro-doc-acao {
  padding: 0 !important;
}
`;var ho=`/*
 * Casca do SEI (sub-projeto 2): a barra superior, o menu lateral, a barra de a\xE7\xF5es, os t\xEDtulos, os
 * tooltips e a \xE1rvore do processo, redesenhados no vocabul\xE1rio dos pain\xE9is (Favoritos, Projetos,
 * Demandas): superf\xEDcies em camadas, raios generosos, \xEDcones de tra\xE7o (m\xE1scaras geradas em
 * src/icones) e estados de hover, foco e sele\xE7\xE3o bem marcados. S\xF3 var(--spro-*): nenhuma cor
 * literal e nenhum !important aqui (o teste confere). As cores base v\xEAm da folha base.
 */

/* ============================== Barra superior ============================== */
/* Profundidade: um brilho sutil sobre a cor escolhida (a cor em si vem da folha base, com !important do SEI) */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao,
:root[data-spro-tema-ativo] #divInfraBarraSistema .infraCorBarraSistema {
  background-image: linear-gradient(180deg, color-mix(in srgb, var(--spro-barra-texto) 10%, transparent), transparent 70%);
  box-shadow: 0 1px 0 var(--spro-barra-borda), 0 6px 18px -8px color-mix(in srgb, var(--spro-barra) 70%, transparent);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao img.infraImg,
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a > img[src*="svg/"] {
  color: var(--spro-barra-texto);
}
/* Altura da barra: mais alta no topo da p\xE1gina, normal depois de rolar (navbar.ts liga data-spro-nav-compacta).
   A barra de a\xE7\xF5es fixa acompanha por --spro-nav-total, com a mesma transi\xE7\xE3o. */
:root[data-spro-tema-ativo] {
  --spro-nav-base: 65px;
  --spro-nav-extra: 14px;
  /* A troca de altura \xE9 lenta e suave (a barra de a\xE7\xF5es fixa acompanha quadro a quadro pelo valor medido) */
  --spro-nav-dur: 380ms;
  --spro-nav-curva: cubic-bezier(0.22, 0.61, 0.36, 1);
  --spro-nav-total: calc(var(--spro-nav-base) + var(--spro-nav-extra));
}
/* Compacta: some a faixa do \xF3rg\xE3o (4 + 15 px) e a barra fica s\xF3 com a altura da linha principal */
:root[data-spro-tema-ativo][data-spro-nav-compacta] {
  --spro-nav-extra: 0px;
  --spro-nav-total: 50px;
}
/* A faixa com o nome do \xF3rg\xE3o: recolhe suave ao compactar (o nome passa para junto da logo) */
:root[data-spro-tema-ativo] #divInfraBarraSistemaLinha,
:root[data-spro-tema-ativo] #divInfraBarraSistema > h6.d-md-block {
  max-height: 20px;
  overflow: hidden;
  transition:
    max-height var(--spro-nav-dur) var(--spro-nav-curva),
    opacity calc(var(--spro-nav-dur) * 0.7) var(--spro-nav-curva);
}
:root[data-spro-tema-ativo][data-spro-nav-compacta] #divInfraBarraSistemaLinha,
:root[data-spro-tema-ativo][data-spro-nav-compacta] #divInfraBarraSistema > h6.d-md-block {
  max-height: 0;
  opacity: 0;
}
/* O nome do \xF3rg\xE3o, ao lado da logo, s\xF3 na barra compacta (navbar.ts copia o texto para data-spro-orgao) */
:root[data-spro-tema-ativo][data-spro-nav-compacta] #divInfraBarraSistemaPadraoE > div[data-spro-orgao]::after {
  content: attr(data-spro-orgao);
  display: inline-block;
  margin-left: 14px;
  padding-left: 14px;
  border-left: 1px solid color-mix(in srgb, var(--spro-barra-texto) 32%, transparent);
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30vw;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: color-mix(in srgb, var(--spro-barra-texto) 88%, transparent);
  animation: spro-orgao-entra var(--spro-nav-dur) var(--spro-nav-curva);
}
@keyframes spro-orgao-entra {
  from {
    opacity: 0;
    transform: translateX(-6px);
  }
}

:root[data-spro-tema-ativo] #navInfraBarraNavegacao {
  height: var(--spro-nav-total);
  min-height: var(--spro-nav-total);
  transition:
    height var(--spro-nav-dur) var(--spro-nav-curva),
    min-height var(--spro-nav-dur) var(--spro-nav-curva);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao {
  height: calc(50px + var(--spro-nav-extra));
  min-height: calc(50px + var(--spro-nav-extra));
  align-items: center;
  transition:
    height var(--spro-nav-dur) var(--spro-nav-curva),
    min-height var(--spro-nav-dur) var(--spro-nav-curva);
}
/* \xCDcones da barra: bot\xF5es redondos de 40 px */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a.align-self-center,
:root[data-spro-tema-ativo] #lnkInfraMenuSistema,
:root[data-spro-tema-ativo] #lnkInfraMenuSistemaMovel {
  /* O Bootstrap do SEI for\xE7a display:block (d-md-block): o centro vem do respiro, n\xE3o do flex */
  box-sizing: border-box;
  width: 40px;
  height: 40px;
  padding: 8px;
  border-radius: 999px;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    transform var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a.align-self-center:hover,
:root[data-spro-tema-ativo] #lnkInfraMenuSistema:hover,
:root[data-spro-tema-ativo] #lnkInfraMenuSistemaMovel:hover {
  background-color: color-mix(in srgb, var(--spro-barra-texto) 18%, transparent);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a.align-self-center:active {
  transform: scale(0.94);
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a:focus-visible,
:root[data-spro-tema-ativo] #lnkInfraMenuSistema:focus-visible {
  outline: 2px solid var(--spro-barra-texto);
  outline-offset: 1px;
}
/* O bot\xE3o "Menu" tem texto: vira uma p\xEDlula com respiro, afastada da pesquisa */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a#lnkInfraMenuSistema {
  display: flex;
  align-items: center;
  width: auto;
  margin-right: 10px;
  padding: 0 14px;
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao a#lnkInfraMenuSistema > span {
  padding: 0;
  font-size: 14px;
  letter-spacing: 0.2px;
}
/* Pesquisa r\xE1pida: p\xEDlula transl\xFAcida que vira superf\xEDcie ao focar */
:root[data-spro-tema-ativo] #txtPesquisaRapida {
  height: 36px;
  padding-left: 16px;
  color: var(--spro-barra-texto);
  background-color: color-mix(in srgb, var(--spro-barra-texto) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--spro-barra-texto) 22%, transparent);
  border-radius: 999px 0 0 999px;
  transition:
    background-color var(--spro-dur),
    border-color var(--spro-dur);
}
:root[data-spro-tema-ativo] #txtPesquisaRapida::placeholder {
  color: color-mix(in srgb, var(--spro-barra-texto) 72%, transparent);
}
:root[data-spro-tema-ativo] #txtPesquisaRapida:focus {
  color: var(--spro-texto);
  background-color: var(--spro-fundo);
  border-color: transparent;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--spro-barra-texto) 28%, transparent);
}
:root[data-spro-tema-ativo] #txtPesquisaRapida:focus::placeholder {
  color: var(--spro-fraco);
}
/* O bot\xE3o da lupa fecha a p\xEDlula da pesquisa; fica sobre superf\xEDcie clara, ent\xE3o o \xEDcone usa a cor do texto */
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao span.infraAcaoBarraConjugada {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 46px;
  height: 36px;
  min-height: 0;
  padding: 0;
  background-color: var(--spro-fundo);
  border: 0;
  border-radius: 0 999px 999px 0;
}
:root[data-spro-tema-ativo] #divInfraBarraSistemaPadrao .infraAcaoBarraConjugada img {
  color: var(--spro-texto);
}
/* A unidade vira uma p\xEDlula */
:root[data-spro-tema-ativo] a#lnkInfraUnidade {
  display: inline-flex;
  align-items: center;
  min-height: 34px;
  padding: 0 14px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.3px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--spro-barra-texto) 24%, transparent);
  box-shadow: var(--spro-sombra-1);
}

/* ============================== Menu lateral ============================== */
:root[data-spro-tema-ativo] .divInfraAreaTelaE,
:root[data-spro-tema-ativo] #divInfraAreaTelaE {
  background-color: var(--spro-fundo);
  color: var(--spro-texto);
  border-right: 1px solid var(--spro-borda);
}
:root[data-spro-tema-ativo] #divInfraPesquisarMenu {
  background-color: var(--spro-fundo);
  /* respiro antes e depois do campo: ele n\xE3o cola na barra nem no primeiro item.
     O SEI fixa a altura do cont\xEAiner (36px, sticky): sem altura autom\xE1tica o campo vaza para fora dele. */
  box-sizing: border-box;
  height: auto;
  min-height: 0;
  padding: 18px 12px 16px;
}
:root[data-spro-tema-ativo] #txtInfraPesquisarMenu {
  height: 38px;
  padding-left: 14px;
  color: var(--spro-texto);
  background-color: var(--spro-fundo-2);
  border: 1px solid var(--spro-borda);
  border-radius: 999px;
}
:root[data-spro-tema-ativo] #txtInfraPesquisarMenu:focus {
  background-color: var(--spro-fundo);
  border-color: var(--spro-destaque);
  box-shadow: var(--spro-anel);
}
:root[data-spro-tema-ativo] #infraMenu {
  padding: 4px 0 16px;
}
:root[data-spro-tema-ativo] #infraMenu li > a {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 42px;
  margin: 2px 10px;
  padding-right: 10px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 12px;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #infraMenu li > a > img:not(.infraImgSetaMenu),
:root[data-spro-tema-ativo] #infraMenu li > a > svg.iconMenuPro {
  flex: none;
  margin-left: 6px;
  color: var(--spro-suave);
  transition: color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #infraMenu li > a > span {
  flex: 1;
  min-width: 0;
}
:root[data-spro-tema-ativo] #infraMenu li > a:hover {
  background-color: var(--spro-fundo-3);
}
:root[data-spro-tema-ativo] #infraMenu li > a:hover > img:not(.infraImgSetaMenu),
:root[data-spro-tema-ativo] #infraMenu li > a:hover > svg.iconMenuPro {
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] #infraMenu li > a:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
/* Item da tela atual (o SEI marca com a classe infraMenuSelecionado): faixa de destaque */
:root[data-spro-tema-ativo] #infraMenu li > a.infraMenuSelecionado,
:root[data-spro-tema-ativo] #infraMenu li > a.active,
:root[data-spro-tema-ativo] #infraMenu li > a[aria-current] {
  font-weight: 650;
  background-color: var(--spro-destaque-suave);
  box-shadow: inset 3px 0 0 var(--spro-destaque);
}
:root[data-spro-tema-ativo] #infraMenu li > a.infraMenuSelecionado > img:not(.infraImgSetaMenu) {
  color: var(--spro-destaque);
}
/* Itens do SEI Pro: mesmo ritmo dos nativos (o r\xF3tulo vem sem <span>) */
:root[data-spro-tema-ativo] #infraMenu a.newLinksMenuPro {
  padding-left: 5px;
  padding-right: 12px;
}

/* A seta dos submenus vira um chevron de tra\xE7o */
:root[data-spro-tema-ativo] #infraMenu img.infraImgSetaMenu {
  flex: none;
  width: 16px;
  height: 16px;
  margin-right: 2px;
  content: url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");
  background-color: var(--spro-fraco);
  -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") center / contain no-repeat;
  transition: transform var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #infraMenu a[aria-expanded="true"] img.infraImgSetaMenu {
  transform: rotate(180deg);
}
/* Submenus: recuados, com uma guia \xE0 esquerda */
:root[data-spro-tema-ativo] #infraMenu ul.collapse,
:root[data-spro-tema-ativo] #infraMenu ul.collapsing,
:root[data-spro-tema-ativo] #infraMenu ul.show {
  margin-left: 28px;
  border-left: 1px solid var(--spro-borda);
}

/* ============================== T\xEDtulos ============================== */
:root[data-spro-tema-ativo] div.infraBarraLocalizacao {
  font-size: 24px;
  font-weight: 750;
  letter-spacing: -0.015em;
  line-height: 1.2;
  color: var(--spro-texto);
}

/* ============================== Barra de a\xE7\xF5es (processo e Controle) ============================== */
:root[data-spro-tema-ativo] div.barraBotoesSEI {
  padding: 6px;
  background-color: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-2);
}
:root[data-spro-tema-ativo] a.botaoSEI {
  border-radius: 12px;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    color var(--spro-dur) var(--spro-curva),
    transform var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] a.botaoSEI > img {
  color: var(--spro-suave);
  transition: color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] a.botaoSEI:hover {
  background-color: var(--spro-fundo-3);
  transform: translateY(-1px);
}
:root[data-spro-tema-ativo] a.botaoSEI:active {
  transform: translateY(0) scale(0.96);
}
:root[data-spro-tema-ativo] a.botaoSEI:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}

/* ============================== Tooltips ============================== */
:root[data-spro-tema-ativo] div.infraTooltip,
:root[data-spro-tema-ativo] div#divInfraTooltip,
:root[data-spro-tema-ativo] div[data-spro-dica-caixa] {
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.3;
  color: var(--spro-fundo);
  background-color: var(--spro-texto);
  border: 0;
  border-radius: var(--spro-raio);
  box-shadow: var(--spro-sombra-3);
}
/* A caixa pr\xF3pria (bot\xF5es que s\xF3 tinham title): flutua sobre tudo e nunca captura o mouse */
:root[data-spro-tema-ativo] div[data-spro-dica-caixa] {
  position: fixed;
  z-index: 2147483600;
  max-width: 280px;
  font-family: var(--spro-fonte);
  pointer-events: none;
  animation: spro-dica-entra var(--spro-dur) var(--spro-curva);
}
@keyframes spro-dica-entra {
  from {
    opacity: 0;
    transform: translateY(-3px);
  }
}

/* ============================== \xC1rvore do processo ============================== */
:root[data-spro-tema-ativo] a.infraArvoreNo span {
  padding: 2px 6px;
  border-radius: var(--spro-raio-p);
  transition: background-color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] a.infraArvoreNo:hover span {
  background-color: var(--spro-fundo-3);
}
:root[data-spro-tema-ativo] a.infraArvoreNo span.infraArvoreNoSelecionado {
  background-color: var(--spro-destaque-medio);
  color: var(--spro-texto);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--spro-destaque) 45%, transparent);
}

/* ============================== P\xE1gina do processo: divisor, selo da unidade e se\xE7\xF5es ============================== */
/* Divisor vertical entre a \xE1rvore e o visualizador: fio fino com uma al\xE7a que acende ao passar o mouse. */
:root[data-spro-tema-ativo] #divIframeArvore > .ui-resizable-e {
  background: linear-gradient(var(--spro-borda), var(--spro-borda)) center / 1px 100% no-repeat var(--spro-pagina);
  transition: background-color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #divIframeArvore > .ui-resizable-e::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 5px;
  height: 44px;
  transform: translate(-50%, -50%);
  border-radius: 999px;
  background-color: var(--spro-borda-forte);
  box-shadow: 0 0 0 2px var(--spro-pagina);
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    height var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] #divIframeArvore > .ui-resizable-e:hover {
  background: linear-gradient(var(--spro-destaque), var(--spro-destaque)) center / 2px 100% no-repeat var(--spro-pagina);
}
:root[data-spro-tema-ativo] #divIframeArvore > .ui-resizable-e:hover::before {
  height: 64px;
  background-color: var(--spro-destaque);
}

/* Selo da unidade ao lado de cada documento. */
:root[data-spro-tema-ativo] a.infraArvoreInformacao > span {
  display: inline-block;
  padding: 1px 8px;
  border: 0;
  border-radius: 999px;
  background-color: var(--spro-destaque-suave);
  color: var(--spro-destaque);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--spro-destaque) 30%, transparent);
  font-size: 10px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.04em;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] a.infraArvoreInformacao:hover > span {
  background-color: var(--spro-destaque);
  color: var(--spro-destaque-texto);
}

/* Divisores das se\xE7\xF5es da coluna da \xE1rvore: fio que some nas pontas, no lugar da linha cheia
   (a linha cheia vem de estilo inline, zerada em base.css). */
:root[data-spro-tema-ativo] #divConsultarAndamento,
:root[data-spro-tema-ativo] .panelDadosArvore,
:root[data-spro-tema-ativo] .panelDadosArvorePro,
:root[data-spro-tema-ativo] .stickDadosArvore,
:root[data-spro-tema-ativo] #divRelacionados {
  background-image: linear-gradient(
    90deg,
    transparent,
    var(--spro-borda-forte) 14%,
    var(--spro-borda-forte) 86%,
    transparent
  );
  background-position: top;
  background-repeat: no-repeat;
  background-size: 100% 1px;
}

/* ============================== Barra de a\xE7\xF5es fixa no topo ============================== */
/* O legado cria uma c\xF3pia da barra (fica no fluxo, guardando o espa\xE7o) e fixa a original. A fixa gruda na barra
   superior, sem v\xE3o e com os cantos de cima retos, como uma aba que desce dela; a c\xF3pia s\xF3 segura o lugar. */
:root[data-spro-tema-ativo]:has(#navInfraBarraNavegacao) div.barraBotoesSEI.fixed {
  margin-top: 0;
  border-top-color: transparent;
  border-radius: 0 0 var(--spro-raio-g) var(--spro-raio-g);
  box-shadow:
    0 10px 24px -10px color-mix(in srgb, var(--spro-barra) 45%, transparent),
    var(--spro-sombra-2);
  animation: spro-barra-fixa var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo]:has(#navInfraBarraNavegacao) div.barraBotoesSEI:has(+ div.barraBotoesSEI.fixed) {
  visibility: hidden;
}
@keyframes spro-barra-fixa {
  from {
    opacity: 0.6;
    transform: translateY(-8px);
  }
}

/* ============================== P\xE1gina do processo: respiro e alinhamento da \xE1rvore ============================== */
/* Respiro entre a barra superior e a linha do n\xFAmero do processo (a tela da \xE1rvore tem o cabe\xE7alho de altura fixa) */
:root[data-spro-tema-ativo] body:has(> #header.px-2) {
  padding-top: 12px;
}
/* O selo da unidade ao lado de cada documento: o legado o p\xF5e em "text-top" (fica mais baixo que os \xEDcones de copiar,
   que est\xE3o em "super"); no mesmo alinhamento deles, os dois ficam na mesma linha horizontal. */
:root[data-spro-tema-ativo] .infraArvore > a.infraArvoreInformacao {
  vertical-align: super;
}
`;var xo=`/*
 * Tabelas e bot\xF5es do SEI e do SEI Pro no vocabul\xE1rio dos pain\xE9is refatorados (Favoritos, Projetos,
 * Demandas): as medidas, os raios e os estados de .spro-botao (sei-comum/src/ui/base.css) e de
 * .dem-tabela (demandas.css), s\xF3 que sobre os elementos nativos. S\xF3 var(--spro-*): nenhuma cor
 * literal e nenhum !important aqui. Vem depois da base e da casca, ent\xE3o ganha dela no empate.
 */

/* ---------- Bot\xF5es nativos (infraButton) ---------- */
:root[data-spro-tema-ativo] input.infraButton,
:root[data-spro-tema-ativo] button.infraButton,
:root[data-spro-tema-ativo] a.infraAnchorButton {
  min-height: 36px;
  padding: 0 18px;
  font-size: 13.5px;
  font-weight: 600;
  letter-spacing: 0.1px;
  line-height: 1.2;
  color: var(--spro-texto);
  background-color: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  border-radius: 10px;
  box-shadow: var(--spro-sombra-1);
  cursor: pointer;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    border-color var(--spro-dur) var(--spro-curva),
    box-shadow var(--spro-dur) var(--spro-curva),
    transform var(--spro-dur) var(--spro-curva),
    color var(--spro-dur);
}
:root[data-spro-tema-ativo] input.infraButton:hover,
:root[data-spro-tema-ativo] button.infraButton:hover,
:root[data-spro-tema-ativo] a.infraAnchorButton:hover {
  color: var(--spro-texto);
  background-color: var(--spro-fundo-2);
  border-color: color-mix(in srgb, var(--spro-destaque) 45%, var(--spro-borda-forte));
  box-shadow: var(--spro-sombra-2);
  transform: translateY(-1px);
}
:root[data-spro-tema-ativo] input.infraButton:active,
:root[data-spro-tema-ativo] button.infraButton:active,
:root[data-spro-tema-ativo] a.infraAnchorButton:active {
  background-color: var(--spro-fundo-3);
  box-shadow: none;
  transform: translateY(0);
}
:root[data-spro-tema-ativo] input.infraButton:focus-visible,
:root[data-spro-tema-ativo] button.infraButton:focus-visible,
:root[data-spro-tema-ativo] a.infraAnchorButton:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
/* O bot\xE3o que envia o formul\xE1rio (Salvar, Pesquisar...) \xE9 o prim\xE1rio: gradiente, brilho interno e halo na cor de destaque */
:root[data-spro-tema-ativo] input[type="submit"].infraButton,
:root[data-spro-tema-ativo] button[type="submit"].infraButton {
  color: var(--spro-destaque-texto);
  background-color: var(--spro-destaque);
  background-image: linear-gradient(180deg, color-mix(in srgb, var(--spro-destaque-texto) 16%, transparent), transparent 60%);
  border-color: transparent;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--spro-destaque-texto) 28%, transparent),
    0 6px 14px -6px color-mix(in srgb, var(--spro-destaque) 70%, transparent);
}
:root[data-spro-tema-ativo] input[type="submit"].infraButton:hover,
:root[data-spro-tema-ativo] button[type="submit"].infraButton:hover {
  color: var(--spro-destaque-texto);
  background-color: color-mix(in srgb, var(--spro-destaque) 90%, var(--spro-texto));
  border-color: transparent;
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--spro-destaque-texto) 28%, transparent),
    0 10px 20px -8px color-mix(in srgb, var(--spro-destaque) 80%, transparent);
}
:root[data-spro-tema-ativo] input.infraButton:disabled,
:root[data-spro-tema-ativo] button.infraButton:disabled {
  opacity: 0.5;
  cursor: default;
}

/* ---------- Grupo de bot\xF5es da tabela (Baixar, Copiar, Pesquisar) e bot\xF5es dos di\xE1logos do SEI Pro ---------- */
:root[data-spro-tema-ativo] .btn-group.filterIfraTable .btn,
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-buttonpane button {
  min-height: 34px;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.2;
  color: var(--spro-texto);
  background-color: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte);
  box-shadow: var(--spro-sombra-1);
  transition:
    background-color var(--spro-dur),
    border-color var(--spro-dur);
}
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-buttonpane button {
  border-radius: 10px;
  padding: 0 16px;
  cursor: pointer;
}
:root[data-spro-tema-ativo] .btn-group.filterIfraTable .btn:hover,
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-buttonpane button:hover {
  background-color: var(--spro-fundo-2);
  border-color: color-mix(in srgb, var(--spro-borda-forte) 60%, var(--spro-texto));
}
:root[data-spro-tema-ativo] .btn-group.filterIfraTable .btn:focus-visible,
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-buttonpane button:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}
:root[data-spro-tema-ativo] .btn-group.filterIfraTable .btn:first-child {
  border-radius: var(--spro-raio) 0 0 var(--spro-raio);
}
:root[data-spro-tema-ativo] .btn-group.filterIfraTable .btn:last-child {
  border-radius: 0 var(--spro-raio) var(--spro-raio) 0;
}

/* ---------- Tabelas (infraTable): a caixa, o cabe\xE7alho e as linhas como em .dem-tabela ---------- */
:root[data-spro-tema-ativo] table.infraTable {
  border-collapse: separate;
  border-spacing: 0;
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
}
/* Os cantos s\xE3o das c\xE9lulas das pontas (overflow: hidden cortaria o grupo de bot\xF5es que mora na legenda da tabela) */
:root[data-spro-tema-ativo] table.infraTable > thead > tr:first-child > th:first-child {
  border-top-left-radius: calc(var(--spro-raio-g) - 1px);
}
:root[data-spro-tema-ativo] table.infraTable > thead > tr:first-child > th:last-child {
  border-top-right-radius: calc(var(--spro-raio-g) - 1px);
}
:root[data-spro-tema-ativo] table.infraTable > tbody > tr:last-child > td:first-child {
  border-bottom-left-radius: calc(var(--spro-raio-g) - 1px);
}
:root[data-spro-tema-ativo] table.infraTable > tbody > tr:last-child > td:last-child {
  border-bottom-right-radius: calc(var(--spro-raio-g) - 1px);
}
:root[data-spro-tema-ativo] table.infraTable thead tr,
:root[data-spro-tema-ativo] table.infraTable tr > th.infraTh,
:root[data-spro-tema-ativo] th.infraTh {
  padding: 8px 10px;
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  color: var(--spro-suave);
  background-color: var(--spro-fundo-2);
  border-top: 0;
  border-bottom: 1px solid var(--spro-borda);
}
:root[data-spro-tema-ativo] th.infraTh a,
:root[data-spro-tema-ativo] th.infraTh span {
  color: inherit;
}
:root[data-spro-tema-ativo] th.infraTh div.tablesorter-header-inner,
:root[data-spro-tema-ativo] th.infraTh div.infraDivRotuloOrdenacao,
:root[data-spro-tema-ativo] th.infraTh div.infraDivThCheckRotulo {
  color: inherit;
}
:root[data-spro-tema-ativo] table.infraTable td {
  padding: 8px 10px;
  border-top: 0;
  border-bottom: 1px solid color-mix(in srgb, var(--spro-borda) 60%, transparent);
}
:root[data-spro-tema-ativo] table.infraTable tr:last-child > td {
  border-bottom: 0;
}
/* Sem zebra, como nos pain\xE9is */
:root[data-spro-tema-ativo] tr.infraTrClara,
:root[data-spro-tema-ativo] td.infraTdClara,
:root[data-spro-tema-ativo] tr.infraTrEscura,
:root[data-spro-tema-ativo] td.infraTdEscura {
  background-color: var(--spro-fundo);
}
:root[data-spro-tema-ativo] tr.infraTrClara:hover,
:root[data-spro-tema-ativo] tr.infraTrEscura:hover {
  background-color: var(--spro-destaque-suave);
}

/* ---------- Campos e formul\xE1rios ---------- */
:root[data-spro-tema-ativo] input.infraText,
:root[data-spro-tema-ativo] select.infraSelect,
:root[data-spro-tema-ativo] input[type="text"],
:root[data-spro-tema-ativo] input[type="password"],
:root[data-spro-tema-ativo] input[type="search"],
:root[data-spro-tema-ativo] input[type="date"],
:root[data-spro-tema-ativo] input[type="number"],
:root[data-spro-tema-ativo] select {
  min-height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  transition:
    border-color var(--spro-dur),
    box-shadow var(--spro-dur);
}
:root[data-spro-tema-ativo] textarea.infraTextarea,
:root[data-spro-tema-ativo] textarea {
  padding: 10px 12px;
  border-radius: 10px;
}
:root[data-spro-tema-ativo] label.infraLabelObrigatorio,
:root[data-spro-tema-ativo] label.infraLabelOpcional {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1px;
  color: var(--spro-suave);
}
/* Respiro entre r\xF3tulo e campo, e entre um campo e o r\xF3tulo seguinte (nas telas internas eles vinham colados) */
:root[data-spro-tema-ativo] label.infraLabelObrigatorio:has(+ :is(input, select, textarea, .chosen-container, div.infraAreaDados)),
:root[data-spro-tema-ativo] label.infraLabelOpcional:has(+ :is(input, select, textarea, .chosen-container, div.infraAreaDados)) {
  display: inline-block;
  margin-bottom: 6px;
}
:root[data-spro-tema-ativo] :is(input.infraText, select.infraSelect, textarea.infraTextarea, .chosen-container):has(+ label) {
  margin-bottom: 16px;
}

/* Quadros de formul\xE1rio viram cart\xF5es; a legenda vira uma etiqueta pequena */
:root[data-spro-tema-ativo] fieldset.infraFieldset {
  padding: 16px 18px 14px;
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-1);
}
:root[data-spro-tema-ativo] legend.infraLegend {
  padding: 3px 12px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  border-radius: 999px;
}
:root[data-spro-tema-ativo] input[type="checkbox"],
:root[data-spro-tema-ativo] input[type="radio"] {
  accent-color: var(--spro-destaque);
}

/* ---------- Di\xE1logos (jQuery UI e do SEI Pro) ---------- */
:root[data-spro-tema-ativo] .ui-dialog {
  border-radius: 16px;
  box-shadow: var(--spro-sombra-3);
  overflow: hidden;
}
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-titlebar {
  padding: 14px 18px;
  font-size: 15px;
  font-weight: 650;
  background-color: var(--spro-fundo);
  border: 0;
  border-bottom: 1px solid var(--spro-borda);
  border-radius: 0;
}
:root[data-spro-tema-ativo] .ui-dialog .ui-dialog-buttonpane {
  padding: 12px 18px;
  background-color: var(--spro-fundo-2);
  border-top: 1px solid var(--spro-borda);
}
:root[data-spro-tema-ativo] .ui-widget-overlay {
  backdrop-filter: blur(3px);
}

/* ---------- Sele\xE7\xE3o de texto e barras de rolagem ---------- */
:root[data-spro-tema-ativo] ::selection {
  background-color: var(--spro-destaque-medio);
}
:root[data-spro-tema-ativo] ::-webkit-scrollbar {
  width: 11px;
  height: 11px;
}
:root[data-spro-tema-ativo] ::-webkit-scrollbar-thumb {
  background-color: var(--spro-borda-forte);
  background-clip: padding-box;
  border: 3px solid transparent;
  border-radius: 999px;
}
:root[data-spro-tema-ativo] ::-webkit-scrollbar-thumb:hover {
  background-color: var(--spro-fraco);
}
:root[data-spro-tema-ativo] ::-webkit-scrollbar-track {
  background: transparent;
}

/* ---------- O documento como papel (s\xF3 nas telas de leitura) ---------- */
:root[data-spro-tema-ativo][data-spro-papel] {
  background-color: var(--spro-pagina);
}
:root[data-spro-tema-ativo][data-spro-papel] body {
  box-sizing: border-box;
  max-width: 940px;
  margin: 52px auto 28px;
  padding: 40px 56px;
  background-color: var(--spro-fundo);
  border: 1px solid var(--spro-borda);
  border-radius: var(--spro-raio-g);
  box-shadow: var(--spro-sombra-2);
}

/* ---------- Visualiza\xE7\xE3o do documento: uma caixa s\xF3 (o papel), e a largura escolhida ---------- */
/* A tela de fora (arvore_visualizar) tinha um cart\xE3o branco com sombra em volta do iframe, e o papel de dentro
   outro: ficam s\xF3 o papel (estreito) ou o documento em toda a largura. */
:root[data-spro-tema-ativo] #divArvoreConteudoIfr {
  padding: 0;
  background-color: transparent;
  border-radius: 0;
  box-shadow: none;
}
:root[data-spro-tema-ativo] #divArvoreConteudoIfr iframe.ifrVisualizacao {
  background-color: transparent;
}
:root[data-spro-tema-ativo][data-spro-papel][data-spro-papel-largo] body {
  max-width: none;
  margin: 52px 16px 16px;
}
/* Grupo de bot\xF5es no canto do documento: o de largura e os do SEI Pro, no mesmo estilo (aba presa ao papel) */
:root[data-spro-tema-ativo] div.spro-doc-acoes {
  position: absolute;
  z-index: 2;
  right: 28px;
  display: flex;
  align-items: stretch;
  gap: 6px;
  margin-top: 10px;
}
:root[data-spro-tema-ativo] .spro-doc-acao {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  min-width: 0;
  border: 1px solid var(--spro-borda);
  font: 600 12px/1 var(--spro-fonte);
  white-space: nowrap;
  text-decoration: none;
  cursor: pointer;
  user-select: none;
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    color var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] button.spro-largura {
  margin: 0;
  padding: 0 12px;
  border-radius: var(--spro-raio) var(--spro-raio) 0 0;
  background-color: var(--spro-fundo-2);
  color: var(--spro-texto);
}
:root[data-spro-tema-ativo] .spro-doc-acao[data-spro-rotulo]::after {
  content: attr(data-spro-rotulo);
}
:root[data-spro-tema-ativo] .spro-doc-acao img {
  width: 16px;
  height: 16px;
}
:root[data-spro-tema-ativo] button.spro-largura::before {
  content: "\\2194";
  font-size: 14px;
  color: var(--spro-destaque);
}
:root[data-spro-tema-ativo] .spro-doc-acao:hover {
  background-color: var(--spro-destaque-suave);
}
:root[data-spro-tema-ativo] button.spro-largura[aria-pressed="true"] {
  background-color: var(--spro-destaque-suave);
  border-color: color-mix(in srgb, var(--spro-destaque) 45%, transparent);
}
:root[data-spro-tema-ativo] button.spro-largura:focus-visible {
  outline: none;
  box-shadow: var(--spro-anel);
}

/* O iframe da visualiza\xE7\xE3o n\xE3o mostra um documento (formul\xE1rio, capa): sem bot\xF5es de largura, nova aba e baixar */
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-sem-documento] {
  display: none;
}

/* Documento rolado: os bot\xF5es do canto ficam s\xF3 com o \xEDcone, encostados \xE0 direita (os r\xF3tulos continuam nos tooltips) */
:root[data-spro-tema-ativo] div.spro-doc-acoes {
  transition: gap var(--spro-dur) var(--spro-curva);
}
:root[data-spro-tema-ativo] .spro-doc-acao {
  transition:
    background-color var(--spro-dur) var(--spro-curva),
    color var(--spro-dur) var(--spro-curva),
    font-size var(--spro-nav-dur, 380ms) var(--spro-nav-curva, ease),
    width var(--spro-nav-dur, 380ms) var(--spro-nav-curva, ease),
    padding var(--spro-nav-dur, 380ms) var(--spro-nav-curva, ease),
    gap var(--spro-nav-dur, 380ms) var(--spro-nav-curva, ease);
}
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] {
  justify-content: flex-end;
  gap: 4px;
}
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] > .spro-doc-acao {
  gap: 0;
  width: 32px;
  justify-content: center;
  font-size: 0;
}
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] > button.spro-largura::before {
  font-size: 15px;
}
/* O texto some com font-size 0, mas o \xEDcone (fonte de \xEDcones ou imagem) mant\xE9m o tamanho dele */
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] > a.spro-doc-acao > * {
  font-size: 14px;
}
/* Largura "auto" tamb\xE9m anima (o bot\xE3o encolhe at\xE9 o \xEDcone em vez de saltar) */
:root[data-spro-tema-ativo] .spro-doc-acao {
  interpolate-size: allow-keywords;
  width: auto;
  overflow: hidden;
}
:root[data-spro-tema-ativo] div.spro-doc-acoes[data-spro-compacto] > .spro-doc-acao {
  width: 32px;
}
`;function p(o,a={},...t){let r=document.createElement(o);for(let[e,s]of Object.entries(a))s===void 0||s===!1||(typeof s=="function"?r.addEventListener(e.replace(/^on/,""),s):s===!0?r.setAttribute(e,""):e==="class"?r.className=s:e==="value"&&o==="textarea"?r.value=s:r.setAttribute(e,s));for(let e of t)e!=null&&e!==!1&&r.append(e);return r}var S={fill:"currentColor",stroke:"none"},Ao="M12 3.2l2.7 5.5 6 .9-4.35 4.25 1 6L12 17l-5.35 2.85 1-6L3.3 9.6l6-.9z",J={estrela:[["path",{d:Ao}]],estrelaCheia:[["path",{d:Ao,fill:"currentColor"}]],alvo:[["circle",{cx:"12",cy:"12",r:"7.5"}],["circle",{cx:"12",cy:"12",r:"3.2"}]],alvoAtivo:[["circle",{cx:"12",cy:"12",r:"6.6"}],["circle",{cx:"12",cy:"12",r:"2.4",fill:"currentColor"}],["path",{d:"M12 2.2v3.4M12 18.4v3.4M2.2 12h3.4M18.4 12h3.4"}]],pasta:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}]],etiqueta:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1 1 0 0 1 0 1.4l-7.1 7.1a1 1 0 0 1-1.4 0z"}],["circle",{cx:"8",cy:"8",r:"1.4",...S}]],relogio:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M12 7.2V12l3.2 1.9"}]],nota:[["path",{d:"M6 3.5h9l3.5 3.5v13.5H6z"}],["path",{d:"M9 11h6"}],["path",{d:"M9 15h6"}]],lixeira:[["path",{d:"M4.5 6.5h15"}],["path",{d:"M9.5 6.5V4.8c0-.7.6-1.3 1.3-1.3h2.4c.7 0 1.3.6 1.3 1.3v1.7"}],["path",{d:"M6.8 6.5 7.6 19c0 .8.7 1.5 1.5 1.5h5.8c.8 0 1.5-.7 1.5-1.5l.8-12.5"}]],lapis:[["path",{d:"M17.5 3.5a2.1 2.1 0 0 1 3 3L9 18l-4.5 1.5L6 15z"}],["path",{d:"M15 6l3 3"}]],fechar:[["path",{d:"M18 6 6 18"}],["path",{d:"M6 6l12 12"}]],mais:[["path",{d:"M12 5v14"}],["path",{d:"M5 12h14"}]],busca:[["circle",{cx:"11",cy:"11",r:"6.5"}],["path",{d:"M20.5 20.5l-4.8-4.8"}]],baixar:[["path",{d:"M12 3.5v11"}],["path",{d:"M7.5 10.2 12 14.7l4.5-4.5"}],["path",{d:"M4.5 19.5h15"}]],subir:[["path",{d:"M12 14.5v-11"}],["path",{d:"M7.5 7.8 12 3.3l4.5 4.5"}],["path",{d:"M4.5 19.5h15"}]],copiar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V5.5a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"}]],restaurar:[["path",{d:"M9 14 4 9l5-5"}],["path",{d:"M4 9h9a7 7 0 0 1 7 7v4"}]],check:[["path",{d:"M20 6.5 9.2 17.3 4 12.1"}]],alerta:[["path",{d:"M10.3 4.4 2.8 17.6a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.4a2 2 0 0 0-3.4 0z"}],["path",{d:"M12 9.5v4"}],["circle",{cx:"12",cy:"16.8",r:"1",...S}]],menu:[["circle",{cx:"5",cy:"12",r:"1.4",...S}],["circle",{cx:"12",cy:"12",r:"1.4",...S}],["circle",{cx:"19",cy:"12",r:"1.4",...S}]],alca:[["circle",{cx:"9",cy:"6",r:"1.3",...S}],["circle",{cx:"15",cy:"6",r:"1.3",...S}],["circle",{cx:"9",cy:"12",r:"1.3",...S}],["circle",{cx:"15",cy:"12",r:"1.3",...S}],["circle",{cx:"9",cy:"18",r:"1.3",...S}],["circle",{cx:"15",cy:"18",r:"1.3",...S}]],ajustes:[["path",{d:"M4 7h5"}],["path",{d:"M13 7h7"}],["circle",{cx:"11",cy:"7",r:"2.1"}],["path",{d:"M4 17h9"}],["path",{d:"M17 17h3"}],["circle",{cx:"15",cy:"17",r:"2.1"}]],setaCima:[["path",{d:"M12 19V6"}],["path",{d:"M6 12l6-6 6 6"}]],setaBaixo:[["path",{d:"M12 5v13"}],["path",{d:"M18 12l-6 6-6-6"}]],recolher:[["path",{d:"M6 15l6-6 6 6"}]],expandir:[["path",{d:"M6 9l6 6 6-6"}]],local:[["path",{d:"M12 21s-6.5-6.1-6.5-11a6.5 6.5 0 0 1 13 0c0 4.9-6.5 11-6.5 11z"}],["circle",{cx:"12",cy:"10",r:"2.3"}]],sino:[["path",{d:"M6.5 16.5V11a5.5 5.5 0 0 1 11 0v5.5l1.5 1.5h-14z"}],["path",{d:"M10 20.5a2 2 0 0 0 4 0"}]],documento:[["path",{d:"M7 3.5h7l4 4v13H7z"}],["path",{d:"M14 3.5v4h4"}]],painel:[["rect",{x:"3.5",y:"4.5",width:"17",height:"15",rx:"2"}],["path",{d:"M14.5 4.5v15"}]],atualizar:[["path",{d:"M19.5 12a7.5 7.5 0 1 1-2.2-5.3"}],["path",{d:"M19.5 4.5v4h-4"}]],nuvem:[["path",{d:"M7 18.5h10a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7 9.5a4.5 4.5 0 0 0 0 9z"}]],chevron:[["path",{d:"M7 9.5l5 5 5-5"}]],pino:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z"}],["path",{d:"M12 13.5v7"}]],pinoCheio:[["path",{d:"M9.5 3.5h5l-.8 5.2 3.3 3.1v1.7H7v-1.7l3.3-3.1z",fill:"currentColor"}],["path",{d:"M12 13.5v7"}]],filtro:[["path",{d:"M4 5.5h16l-6.2 7.3v5.4l-3.6 1.8v-7.2z"}]],ordenar:[["path",{d:"M7.5 4.5v15"}],["path",{d:"M4 16l3.5 3.5L11 16"}],["path",{d:"M16.5 19.5v-15"}],["path",{d:"M13 8l3.5-3.5L20 8"}]],mapa:[["path",{d:"M9 4.5 3.5 6.6v13l5.5-2.1 6 2.1 5.5-2.1v-13L15 6.6z"}],["path",{d:"M9 4.5v13"}],["path",{d:"M15 6.6v13"}]],olho:[["path",{d:"M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"}],["circle",{cx:"12",cy:"12",r:"2.8"}]],camadas:[["path",{d:"M12 3.5 20.5 8 12 12.5 3.5 8z"}],["path",{d:"M3.5 12 12 16.5 20.5 12"}],["path",{d:"M3.5 16 12 20.5 20.5 16"}]],historico:[["path",{d:"M3.8 12.5A8.3 8.3 0 1 0 6.2 6"}],["path",{d:"M3.8 4.2v4.3h4.3"}],["path",{d:"M12 8v4.2l2.8 1.7"}]],pessoa:[["circle",{cx:"12",cy:"8",r:"3.6"}],["path",{d:"M5 20c.9-3.7 3.6-5.6 7-5.6s6.1 1.9 7 5.6"}]],predio:[["path",{d:"M5 20.5v-15a1 1 0 0 1 1-1h7.5a1 1 0 0 1 1 1v15"}],["path",{d:"M14.5 9.5H18a1 1 0 0 1 1 1v10"}],["path",{d:"M3 20.5h18"}],["path",{d:"M8.5 8.5h3"}],["path",{d:"M8.5 12h3"}],["path",{d:"M8.5 15.5h3"}]],brilho:[["path",{d:"M12 3.5l1.9 5.1 5.1 1.9-5.1 1.9L12 17.5l-1.9-5.1L5 10.5l5.1-1.9z"}],["path",{d:"M18.5 16.5v4"}],["path",{d:"M16.5 18.5h4"}]],calendario:[["rect",{x:"4",y:"5.5",width:"16",height:"15",rx:"2"}],["path",{d:"M4 10h16"}],["path",{d:"M8.5 3.5v4"}],["path",{d:"M15.5 3.5v4"}]],cadeado:[["rect",{x:"5.5",y:"10.5",width:"13",height:"10",rx:"2"}],["path",{d:"M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"}]],saida:[["path",{d:"M14 4.5h4.5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H14"}],["path",{d:"M10 16l4-4-4-4"}],["path",{d:"M14 12H4.5"}]],planilha:[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2"}],["path",{d:"M4 9.5h16"}],["path",{d:"M4 15h16"}],["path",{d:"M10 9.5V20"}]],mover:[["path",{d:"M4.5 12h14"}],["path",{d:"M13.5 6.5 19 12l-5.5 5.5"}]],sol:[["circle",{cx:"12",cy:"12",r:"3.8"}],["path",{d:"M12 2.8v2M12 19.2v2M2.8 12h2M19.2 12h2M5.5 5.5l1.4 1.4M17.1 17.1l1.4 1.4M5.5 18.5l1.4-1.4M17.1 6.9l1.4-1.4"}]],teclado:[["rect",{x:"3",y:"6.5",width:"18",height:"11",rx:"2"}],["path",{d:"M7 10h.01M10.3 10h.01M13.7 10h.01M17 10h.01M8 14h8"}]],gantt:[["path",{d:"M4 5h9M7 12h11M4 19h7"}],["path",{d:"M3 3v18"}]],demandas:[["circle",{cx:"10",cy:"7.8",r:"3.2"}],["path",{d:"M3.8 19.5a6.2 5.2 0 0 1 11.8-2.6"}],["circle",{cx:"17.6",cy:"17.6",r:"4.2"}],["path",{d:"m15.6 17.7 1.5 1.5 2.5-3"}]]},br=Object.keys(J);function ua(o=8,a=6.4,t=8.6){let r=[],e=Math.PI*2/o,s=n=>Number(n.toFixed(2));for(let n=0;n<o;n++){let d=n*e-Math.PI/2;for(let[l,m]of[[a,-.32],[t,-.2],[t,.2],[a,.32]]){let u=d+m*e*1.2;r.push(`${s(12+l*Math.cos(u))} ${s(12+l*Math.sin(u))}`)}}return[["path",{d:`M${r.join("L")}z`}],["circle",{cx:"12",cy:"12",r:"2.7"}]]}var Mo={engrenagem:ua(),livro:[["path",{d:"M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5z"}],["path",{d:"M5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3"}],["path",{d:"M9 7.5h6"}]],lista:[["path",{d:"M9.5 6.5H20M9.5 12H20M9.5 17.5H20"}],["circle",{cx:"4.8",cy:"6.5",r:"1",fill:"currentColor"}],["circle",{cx:"4.8",cy:"12",r:"1",fill:"currentColor"}],["circle",{cx:"4.8",cy:"17.5",r:"1",fill:"currentColor"}]],pessoas:[["circle",{cx:"9",cy:"8.2",r:"3.2"}],["path",{d:"M3.2 19.2a5.8 5.8 0 0 1 11.6 0"}],["circle",{cx:"17.2",cy:"9",r:"2.4"}],["path",{d:"M16.4 13.6a4.7 4.7 0 0 1 4.6 4.2"}]],pastaMais:[["path",{d:"M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"}],["path",{d:"M12 11v5M9.5 13.5h5"}]],escudoCheck:[["path",{d:"M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z"}],["path",{d:"m9.2 12 2 2 3.6-3.8"}]],escudo:[["path",{d:"M12 3 5 6v5.5c0 4.4 3 7.9 7 9.5 4-1.6 7-5.1 7-9.5V6z"}]],bandeira:[["path",{d:"M5.5 21V4.2"}],["path",{d:"M5.5 4.8c2.4-1.2 4.6-1.2 7 0s4.6 1.2 7 0v8.6c-2.4 1.2-4.6 1.2-7 0s-4.6-1.2-7 0"}]],pausa:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"M10 9v6M14 9v6"}]],retorno:[["path",{d:"M4 9h13l-3-3M20 15H7l3 3"}]],codigo:[["path",{d:"m8.5 8-4 4 4 4M15.5 8l4 4-4 4M13.2 6.5l-2.4 11"}]],megafone:[["path",{d:"M4 10v4a1 1 0 0 0 1 1h2.5l6 4V5l-6 4H5a1 1 0 0 0-1 1z"}],["path",{d:"M17.2 9.4a3.6 3.6 0 0 1 0 5.2"}]],acessibilidade:[["circle",{cx:"12",cy:"5",r:"1.8"}],["path",{d:"M5 8.5l7 1.6 7-1.6M12 10.2V15m0 0-3 6m3-6 3 6"}]],enviar:[["path",{d:"M21 3 10.5 13.5M21 3l-6.5 18-4-7.5L3 9.5z"}]],pessoaMais:[["circle",{cx:"9.5",cy:"8",r:"3.4"}],["path",{d:"M3.5 19.5a6 6 0 0 1 12 0"}],["path",{d:"M19 8v6M16 11h6"}]],blocoMais:[["path",{d:"M12 3 3.5 7.5 12 12l8.5-4.5z"}],["path",{d:"M3.5 12 12 16.5l3.5-1.9"}],["path",{d:"M19 15v6M16 18h6"}]],documentoMais:[["path",{d:"M6 3.5h8.5L19 8v12.5H6z"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M12.5 11.5v5M10 14h5"}]],etiquetaMais:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l7.3 7.3"}],["circle",{cx:"8",cy:"8",r:"1.4",fill:"currentColor"}],["path",{d:"M18.5 15.5v6M15.5 18.5h6"}]],etiquetaMenos:[["path",{d:"M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l7.3 7.3"}],["circle",{cx:"8",cy:"8",r:"1.4",fill:"currentColor"}],["path",{d:"M15.5 18.5h6"}]],concluir:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"m8.4 12.3 2.4 2.4 4.8-5.1"}]],chave:[["circle",{cx:"8",cy:"15.5",r:"4"}],["path",{d:"m10.8 12.7 9.2-9.2M17 6.5l3 3M14.5 9l2 2"}]],robo:[["rect",{x:"4.5",y:"8",width:"15",height:"10.5",rx:"3.2"}],["path",{d:"M12 4.3V8"}],["circle",{cx:"12",cy:"3.6",r:"1",fill:"currentColor"}],["circle",{cx:"9",cy:"13",r:"1.1",fill:"currentColor"}],["circle",{cx:"15",cy:"13",r:"1.1",fill:"currentColor"}],["path",{d:"M2.8 12v2M21.2 12v2"}]],fluxo:[["rect",{x:"3.5",y:"3.8",width:"7",height:"5.2",rx:"1.4"}],["rect",{x:"13.5",y:"15",width:"7",height:"5.2",rx:"1.4"}],["path",{d:"M7 9v3.5h10V15"}]],seta:[["path",{d:"M9 6l6 6-6 6"}]],assinar:[["path",{d:"M16.5 3.2l4.3 4.3L10.2 18.1l-4.7 1 1-4.7z"}],["path",{d:"m14.2 5.5 4.3 4.3"}],["path",{d:"M2.8 21.3c1.6-1.5 2.7-1.5 3.3 0s1.7 1.3 2.7-.4 2.3-1.3 3.3.2"}]],documentoLupa:[["path",{d:"M6 3.5h8.5L19 8v4.5"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M6 3.5v17h5.5"}],["circle",{cx:"15.4",cy:"16.4",r:"3.2"}],["path",{d:"m17.8 18.8 3 3"}]],documentoLapis:[["path",{d:"M6 3.5h8.5L19 8v3.5"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M6 3.5v17h6"}],["path",{d:"M9 10.5h4M9 14h2.5"}],["path",{d:"M17.9 12.6a1.6 1.6 0 0 1 2.3 2.3l-6.7 6.7-3 .8.8-3z"}]],certidao:[["path",{d:"M6 3.5h8.5L19 8v5.5"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M6 3.5v17h6"}],["circle",{cx:"16.2",cy:"16.6",r:"3.1"}],["path",{d:"m14.9 19.1-.9 2.4 2.2-1.1 2.2 1.1-.9-2.4"}]],desativar:[["circle",{cx:"12",cy:"12",r:"9"}],["path",{d:"m5.7 5.7 12.6 12.6"}]],paginaAnterior:[["path",{d:"m15 6-6 6 6 6"}]],paginaPrimeira:[["path",{d:"m17 6-6 6 6 6M9 6v12"}]],paginaUltima:[["path",{d:"m7 6 6 6-6 6M15 6v12"}]],polegar:[["path",{d:"M3.5 10.5h3.2v9.5H3.5z"}],["path",{d:"M6.7 10.5 10.8 3.6c1.4 0 2.4 1.2 2.1 2.6L12.2 9.5H18a2 2 0 0 1 1.9 2.5l-1.6 6.3a2 2 0 0 1-1.9 1.5H6.7"}]],selo:[["circle",{cx:"12",cy:"9",r:"5.2"}],["path",{d:"m9 13.6-1.3 7 4.3-2.3 4.3 2.3-1.3-7"}],["path",{d:"m10.2 9 1.3 1.3 2.4-2.6"}]],documentoX:[["path",{d:"M6 3.5h8.5L19 8v12.5H6z"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"m10 12.5 5 5M15 12.5l-5 5"}]],email:[["rect",{x:"3.5",y:"5.5",width:"17",height:"13",rx:"2.2"}],["path",{d:"m4 7.8 8 5.8 8-5.8"}]],pdf:[["path",{d:"M6 3.5h8.5L19 8v12.5H6z"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M9 16.5h1.6a1.3 1.3 0 0 0 0-2.6H9v4M13.5 18v-4h1a2 2 0 0 1 0 4z"}]],gerarPdf:[["path",{d:"M6 3.5h8.5L19 8v12.5H6z"}],["path",{d:"M14.5 3.5V8H19"}],["path",{d:"M12.5 11.5V17m0 0-2-2m2 2 2-2"}]],imprimir:[["path",{d:"M7 8.5V3.5h10v5"}],["rect",{x:"3.5",y:"8.5",width:"17",height:"8",rx:"2"}],["path",{d:"M7 14h10v6.5H7z"}]],comentario:[["path",{d:"M4 5.5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.5L7 20.5v-4H6a2 2 0 0 1-2-2z"}]],duplicar:[["rect",{x:"8.5",y:"8.5",width:"12",height:"12",rx:"2"}],["path",{d:"M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"}]],link:[["path",{d:"M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"}]],ordenarLista:[["path",{d:"M4 6.5h16M4 12h10M4 17.5h6"}]]};var x=(o,a)=>({src:`menu/${o}.svg`,icone:a,contexto:"menu"}),w=(o,a)=>({src:`${o}.svg`,icone:a,contexto:"topo"}),M=(o,a,t={})=>({src:`svg/${o}.svg`,icone:a,contexto:"tabela",...t}),j=(o,a,t={})=>({src:`${o}.svg`,icone:a,contexto:"barra",...t}),ko=[x("acompanhamento_especial","olho"),x("administracao","engrenagem"),x("base_conhecimento","livro"),x("blocos","camadas"),x("contatos","pessoas"),x("controle_prazo","relogio"),x("controle_processos","lista"),x("favoritos","estrela"),x("grupos","pessoas"),x("iniciar_processo","pastaMais"),x("inspecao_administrativa","escudoCheck"),x("marcadores","etiqueta"),x("painel_controle","painel"),x("pesquisa","busca"),x("pontos_controle","bandeira"),x("processos_sobrestados","pausa"),x("reabertura_programada","historico"),x("relatorios","planilha"),x("retorno_programado","retorno"),x("texto_padrao","documento"),x("infra","codigo"),w("menu_pontos_topo","menu"),w("pesquisa_rapida","busca"),w("controle_processos_barra","lista"),w("painel_controle_barra","painel"),w("novidades","megafone"),w("acessibilidade_topo","acessibilidade"),w("configuracao","engrenagem"),w("usuario_topo","pessoa"),w("sair","saida"),j("ferramentas_pdf","pdf",{daExtensao:!0,proprio:!0}),j("acao_lote","camadas",{daExtensao:!0,proprio:!0}),j("doc_lote","documentos",{daExtensao:!0,proprio:!0}),j("compare_doc","comparar",{daExtensao:!0,proprio:!0}),{src:"spro-historico",icone:"historico",contexto:"barra",proprio:!0},{src:"#iconDocCertidao",seletor:"a#iconDocCertidao > img",icone:"certidao",contexto:"barra",proprio:!0},M("consultar","olho"),M("pre_visualizar","olho"),M("alterar","lapis"),M("desativar","desativar"),M("excluir","lixeira",{tom:"perigo"}),M("clonar","duplicar"),M("valores","lista"),M("historico","historico"),M("check","check"),M("federacao","mapa"),M("paginacao_anterior","paginaAnterior"),M("paginacao_proxima","seta"),M("paginacao_primeira","paginaPrimeira"),M("paginacao_ultima","paginaUltima")],Eo=[{id:"seiProAgenteMenu",icone:"robo"},{id:"pesquisaLinkPermanentePro",icone:"link"},{id:"historicoProcessosPro",icone:"historico"},{id:"ferramentasPdfPro",icone:"pdf"},{id:"processosLotePro",icone:"camadas"}];var _=o=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${o}</svg>`,yo={alvo:_('<circle cx="12" cy="12" r="10" fill="#e5484d"/><circle cx="12" cy="12" r="6.8" fill="#fff"/><circle cx="12" cy="12" r="3.9" fill="#e5484d"/><circle cx="12" cy="12" r="1.4" fill="#fff"/><path d="M12 1.5v4M12 18.5v4M1.5 12h4M18.5 12h4" stroke="#9f2a2e" stroke-width="1.6" stroke-linecap="round"/>'),pdf:_('<path d="M5 3.5A1.5 1.5 0 0 1 6.5 2H14l5 5v13.5A1.5 1.5 0 0 1 17.5 22h-11A1.5 1.5 0 0 1 5 20.5z" fill="#f4f4f5"/><path d="M14 2l5 5h-3.5A1.5 1.5 0 0 1 14 5.5z" fill="#c9ccd1"/><rect x="2.5" y="11.5" width="14" height="7" rx="1.8" fill="#e5484d"/><path d="M5 17v-4h1.6a1.2 1.2 0 0 1 0 2.4H5M9 17v-4h1a2 2 0 0 1 0 4zM13.8 13H12.5v4" fill="none" stroke="#fff" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/>'),camadas:_('<path d="M12 12.8 21.5 17.5 12 22.2 2.5 17.5z" fill="#6d3fd1"/><path d="M12 8.4 21.5 13.1 12 17.8 2.5 13.1z" fill="#8f67ea"/><path d="M12 2 21.5 6.7 12 11.4 2.5 6.7z" fill="#c4b0f7"/><path d="M12 4.9v3.7M10.2 6.8h3.6" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>'),documentos:_('<path d="M3.5 5.5A1.5 1.5 0 0 1 5 4h7l3.5 3.5V19A1.5 1.5 0 0 1 14 20.5H5A1.5 1.5 0 0 1 3.5 19z" fill="#2f9e5b"/><path d="M8.5 7.5A1.5 1.5 0 0 1 10 6h7l3.5 3.5V21A1.5 1.5 0 0 1 19 22.5h-9A1.5 1.5 0 0 1 8.5 21z" transform="translate(0 -1)" fill="#5fd38d"/><path d="M14.5 10.2v6.6M11.2 13.5h6.6" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>'),comparar:_('<rect x="2" y="4" width="10" height="16" rx="2" fill="#0e8fb0"/><rect x="12" y="4" width="10" height="16" rx="2" fill="#5fd0ea"/><path d="M5 9h4M5 12h4M5 15h4" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/><path d="M15 9h4M15 12h4M15 15h2.5" stroke="#0e6f88" stroke-width="1.4" stroke-linecap="round"/>'),historico:_('<circle cx="12" cy="12" r="7.6" fill="#dbeafe"/><path d="M6.67 5.64A8.3 8.3 0 1 1 3.88 10.27" fill="none" stroke="#3b82f6" stroke-width="2.3" stroke-linecap="round"/><path d="M12 7.6v4.6l3.2 1.9" fill="none" stroke="#1d4ed8" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.96 7.6 5.45 4.18 7.89 7.1z" fill="#1d4ed8" stroke="#1d4ed8" stroke-width="0.8" stroke-linejoin="round"/>'),certidao:_('<path d="M4.5 3.5A1.5 1.5 0 0 1 6 2h9l4.5 4.5V20A1.5 1.5 0 0 1 18 21.5H6A1.5 1.5 0 0 1 4.5 20z" fill="#f4f4f5"/><path d="M15 2l4.5 4.5H16.5A1.5 1.5 0 0 1 15 5z" fill="#c9ccd1"/><path d="M8 8.5h5M8 11.5h8" stroke="#9aa1ab" stroke-width="1.4" stroke-linecap="round"/><path d="m14.2 16.5-1 5 2.3-1.3 2.3 1.3-1-5z" fill="#1f8a4c"/><circle cx="15.5" cy="15" r="3.4" fill="#2fb464"/><path d="m14 15 1 1 2-2.2" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>')};var ma={...J,...Mo},va={menu:"0",topo:"0",barra:"7px",tabela:"2px"},fa={topo:`width: 24px;
  height: 24px;
  `,tabela:`width: 24px;
  height: 24px;
  `},ba={menu:"currentColor",topo:"currentColor",barra:"currentColor !important",tabela:"currentColor"},So={menu:"#infraMenu",topo:"#divInfraBarraSistemaPadrao",barra:":is(div.barraBotoesSEI, #divArvoreAcoes)",tabela:"table"},ga={tabela:`
  color: var(--spro-suave);`};function Io(o,a=0){let t=ma[o];if(!t)throw new Error(`\xCDcone desconhecido: ${o}`);return`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${t.map(([e,s])=>{let n=e==="circle"||e==="rect"||e==="path"&&/z/i.test(String(s.d??"")),d=a>0&&n&&!s.fill?` fill="#000" fill-opacity="${a}"`:"",l=Object.entries(s).map(([m,u])=>m==="fill"&&u==="currentColor"?'fill="#000"':m==="stroke"&&u==="none"?'stroke="none"':`${m}="${u}"`).join(" ");return`<${e} ${l}${d}/>`}).join("")}</svg>`}var ha={barra:.62},K=o=>`url("data:image/svg+xml,${encodeURIComponent(o).replace(/'/g,"%27").replace(/"/g,"%22")}")`,xa='url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")',U=o=>o.seletor?`:root[data-spro-tema-ativo] ${So[o.contexto]} ${o.seletor}`:`:root[data-spro-tema-ativo] ${So[o.contexto]} img${o.daExtensao?'[src^="chrome-extension"]':""}[src*="${o.src}"]`;function wo(o=ko){let a=[],t=o.filter(r=>r.proprio);if(t.length>0){a.push(`${t.map(U).join(`,
`)} {
  box-sizing: border-box;
  padding: 0;
  background: none !important;
}`);for(let r of t){let e=yo[r.icone];if(!e)throw new Error(`\xCDcone pr\xF3prio desconhecido: ${r.icone}`);a.push(`${U(r)} {
  content: ${K(e)};
}`)}}for(let r of["menu","topo","barra","tabela"]){let e=o.filter(s=>s.contexto===r&&!s.proprio);e.length!==0&&a.push(`${e.map(U).join(`,
`)} {
  content: ${xa};
  box-sizing: border-box;
  ${fa[r]??""}padding: ${va[r]};
  background-color: ${ba[r]};
  background-clip: content-box;${ga[r]??""}
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-origin: content-box;
  -webkit-mask-clip: content-box;
}`)}for(let r of o.filter(e=>!e.proprio))a.push(`${U(r)} {
  -webkit-mask-image: ${K(Io(r.icone,ha[r.contexto]??0))};${r.tom?`
  color: var(--${r.tom==="perigo"?"spro-perigo":`spro-tom-${r.tom}`});`:""}
}`);return a.join(`
`)}function To(o=Eo){let a=":root[data-spro-tema-ativo] #infraMenu a.newLinksMenuPro > svg.iconMenuPro",t=[`${a} {
  box-sizing: border-box;
  flex: none;
  margin: 0 5px 0 6px !important;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  -webkit-mask-size: contain;
}`,`${a} > * {
  display: none;
}`];for(let r of o)t.push(`:root[data-spro-tema-ativo] #infraMenu a#${r.id} > svg.iconMenuPro {
  -webkit-mask-image: ${K(Io(r.icone))};
}`);return t.join(`
`)}function Aa(o,a,t){let r=o;if(typeof o=="string"){if(!o.trim())return null;try{r=JSON.parse(o)}catch{return null}}if(!Array.isArray(r)||r.length===0)return null;let e=r.find(n=>Array.isArray(n?.configGeral));if(!e)return null;let s=e.configGeral.find(n=>n?.name===a);if(s){if(s.value===t)return null;s.value=t}else e.configGeral.push({name:a,value:t});return JSON.stringify(r)}async function Co(o,a,t=chrome.storage.sync){let r=await t.get("dataValues"),e=Aa(r.dataValues,o,a);return e===null?!1:(await t.set({dataValues:e}),!0)}var Ma="gradecontrole";async function _o(o){let a=k((await chrome.storage.sync.get(A))[A]);await chrome.storage.sync.set({[A]:o}),o.ativo&&!a.ativo&&await Co(Ma,!0)}var ka={claro:{"--spro-fundo":"#ffffff","--spro-fundo-2":"#f6f7f9","--spro-fundo-3":"#eceef2","--spro-pagina":"#f3f4f7","--spro-texto":"#1b1f24","--spro-suave":"#5d6772","--spro-fraco":"#8b939c","--spro-borda":"#e3e6eb","--spro-borda-forte":"#cfd4db","--spro-perigo":"#d1352b","--spro-aviso":"#b45c0a","--spro-ok":"#12805c","--spro-tom-azul":"#2563eb","--spro-tom-verde":"#12805c","--spro-tom-ambar":"#b45c0a","--spro-tom-laranja":"#c2410c","--spro-tom-roxo":"#6d4fd8","--spro-tom-rosa":"#be2f78","--spro-tom-ciano":"#0e7490","--spro-sombra-1":"0 1px 2px rgb(16 24 40 / 6%)","--spro-sombra-2":"0 2px 4px -2px rgb(16 24 40 / 8%), 0 6px 14px -4px rgb(16 24 40 / 12%)","--spro-sombra-3":"0 10px 24px -6px rgb(16 24 40 / 18%), 0 24px 56px -12px rgb(16 24 40 / 24%)","--spro-veu":"rgb(17 21 28 / 46%)"},escuro:{"--spro-fundo":"#1a1d21","--spro-fundo-2":"#22262b","--spro-fundo-3":"#2b3036","--spro-pagina":"#141619","--spro-texto":"#e7e9ec","--spro-suave":"#a4abb3","--spro-fraco":"#767e87","--spro-borda":"#2f343a","--spro-borda-forte":"#3d434a","--spro-perigo":"#ff7d73","--spro-aviso":"#e8b04a","--spro-ok":"#4fcf96","--spro-tom-azul":"#7aa8ff","--spro-tom-verde":"#4fcf96","--spro-tom-ambar":"#e8b04a","--spro-tom-laranja":"#fb923c","--spro-tom-roxo":"#ab98ff","--spro-tom-rosa":"#f58bbd","--spro-tom-ciano":"#5fd3e6","--spro-sombra-1":"0 1px 2px rgb(0 0 0 / 30%)","--spro-sombra-2":"0 2px 4px -2px rgb(0 0 0 / 40%), 0 6px 14px -4px rgb(0 0 0 / 45%)","--spro-sombra-3":"0 10px 24px -6px rgb(0 0 0 / 50%), 0 24px 56px -12px rgb(0 0 0 / 60%)","--spro-veu":"rgb(0 0 0 / 58%)"}},Ea={claro:"#ffffff",escuro:"#0a1526"};function Y(o,a){let t=$(o.corBarra,a);return{...ka[a],"--spro-barra":t.barra,"--spro-barra-texto":t.texto,"--spro-barra-hover":t.hover,"--spro-barra-borda":t.borda,"--spro-menu":t.menu,"--spro-menu-texto":"#f2f4f7","--spro-destaque":t.destaque,"--spro-destaque-texto":Ea[a],"--spro-destaque-suave":"color-mix(in srgb, var(--spro-destaque) 12%, transparent)","--spro-destaque-medio":"color-mix(in srgb, var(--spro-destaque) 22%, transparent)","--spro-anel":"0 0 0 3px color-mix(in srgb, var(--spro-destaque) 30%, transparent)","--spro-raio-p":"6px","--spro-raio":"8px","--spro-raio-g":"12px","--spro-raio-xg":"16px","--spro-fonte":'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',"--spro-dur":"150ms","--spro-curva":"cubic-bezier(0.22, 0.61, 0.36, 1)"}}function Oo(o,a,t=""){return`:root[data-spro-tema-ativo] {
${Object.entries(Y(o,a)).map(([e,s])=>`  ${e}: ${s};`).join(`
`)}
  color-scheme: ${a==="escuro"?"dark":"light"};
}
${t}`}var Lo="data-spro-tema",Po="data-spro-tema-ativo",W="data-spro-tema-estilo";function qo(o,a,t,r){if(!a.ativo){ya(o);return}let e=P(a,t),s=o.documentElement;if(!s)return;let n=o.querySelector(`style[${W}]`);n||(n=o.createElement("style"),n.setAttribute(W,""),(o.head??s).appendChild(n));let d=Oo(a,e,r);n.textContent!==d&&(n.textContent=d),s.setAttribute(Po,""),s.setAttribute(Lo,e),s.style.colorScheme=e==="escuro"?"dark":"light"}function ya(o){for(let t of o.querySelectorAll(`style[${W}]`))t.remove();let a=o.documentElement;a&&(a.removeAttribute(Po),a.removeAttribute(Lo),a.style.removeProperty("color-scheme"),a.getAttribute("style")||a.removeAttribute("style"))}function zo(o){try{let a=o.getItem(V);return a?k(a):null}catch{return null}}function Bo(o,a){try{o.setItem(V,JSON.stringify(a))}catch{}}var R="data-spro-dica",Sa="data-spro-dica-caixa",Ia=["#divInfraBarraSistemaPadrao","div.barraBotoesSEI","#divArvoreAcoes","#infraMenu","#divInfraAreaTelaE","#divArvore"],wa=Ia.join(","),Ta=`[${R}],[title]`,Ca=250,_a=o=>o.closest('[onmouseover*="infraTooltipMostrar"]')!==null,Oa='#divInfraMenuSistema, #lnkInfraMenuSistema, #lnkInfraMenuSistemaMovel, [onclick*="MenuSistema"], [onclick*="MenuBootstrap"]';function La(o){let a=o?.closest?.(Ta)??null;return!a||a.closest(Oa)?null:a.closest(wa)?a:null}function Ro(o){let a=o.defaultView,t=null,r,e=null,s=()=>{clearTimeout(r),t?.remove(),t=null},n=()=>{if(s(),!e)return;let{el:i,titulo:c}=e;e=null,i.removeAttribute(R),i.hasAttribute("title")||i.setAttribute("title",c)},d=i=>{let c=i.getAttribute("title")??"";e={el:i,titulo:c},i.removeAttribute("title");let h=c.trim();h&&!/^(input|textarea|select)$/i.test(i.tagName)&&i.setAttribute(R,h)},l=i=>{let c=i.getAttribute(R);if(!c||!o.body)return;s(),t=o.createElement("div"),t.setAttribute(Sa,""),t.setAttribute("role","tooltip"),t.textContent=c,o.body.appendChild(t);let h=i.getBoundingClientRect(),b=t.getBoundingClientRect(),f=a?.innerWidth??1200,g=Math.min(Math.max(8,h.left+h.width/2-b.width/2),Math.max(8,f-b.width-8)),v=h.bottom+8,I=v+b.height<(a?.innerHeight??800)-4;t.style.left=`${Math.round(g)}px`,t.style.top=`${Math.round(I?v:Math.max(4,h.top-b.height-8))}px`},m=i=>{let c=La(i.target);c&&(e?.el!==c&&(n(),d(c)),!(_a(c)||!c.hasAttribute(R))&&(clearTimeout(r),r=setTimeout(()=>l(c),Ca)))},u=i=>{if(!e)return;let c=i.relatedTarget;c&&e.el.contains(c)||n()};return o.addEventListener("mouseover",m,!0),o.addEventListener("mouseout",u,!0),o.addEventListener("mousedown",n,!0),o.addEventListener("scroll",s,!0),()=>{o.removeEventListener("mouseover",m,!0),o.removeEventListener("mouseout",u,!0),o.removeEventListener("mousedown",n,!0),o.removeEventListener("scroll",s,!0),n()}}var Z="#1a1d21",Pa="#e7e9ec",qa=B(Z).l,Do={black:"#000000",white:"#ffffff",red:"#ff0000",blue:"#0000ff",green:"#008000",lime:"#00ff00",yellow:"#ffff00",orange:"#ffa500",purple:"#800080",gray:"#808080",grey:"#808080",silver:"#c0c0c0",navy:"#000080",maroon:"#800000",teal:"#008080",aqua:"#00ffff",cyan:"#00ffff",fuchsia:"#ff00ff",magenta:"#ff00ff",olive:"#808000",brown:"#a52a2a",pink:"#ffc0cb"};function za(o){let a=o.trim().toLowerCase();if(!a||a==="transparent"||a==="inherit"||a==="initial"||a==="unset"||a==="currentcolor")return null;if(Do[a])return Do[a];if(a.startsWith("#"))return y(a)?H(y(a)):null;let t=/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/.exec(a);if(!t||!((t[4]===void 0?1:t[4].endsWith("%")?Number.parseFloat(t[4])/100:Number.parseFloat(t[4]))>0))return null;let e=[t[1],t[2],t[3]].map(s=>Number(s));return e.some(s=>!Number.isFinite(s)||s<0||s>255)?null:H(e)}function oo(o,a){let t=za(o);if(!t)return null;let{l:r,c:e,h:s}=B(t),n=e<.02;if(a==="texto"){if(n&&(r<.3||r>.9))return Pa;let l=r>=.75?Math.max(.85,r):.62+(1-r)*.33,m=E({l,c:e,h:s});for(let u=0;u<40&&L(m,Z)<4.5;u++)l+=.01,m=E({l,c:e,h:s});return m}if(n&&r>.97)return Z;let d=Math.min(.36,qa+(1-r)*.16+Math.min(e,.2)*.8);return E({l:d,c:e,h:s})}var q="data-spro-adaptado",O="data-spro-original",ro="--spro-doc-texto",to="--spro-doc-fundo",ao="data-spro-tema-doc",T="data-spro-ver-original",Ba=400,No="[style],[bgcolor],[color],font,td,th,table",Ra=new Set(["IMG","CANVAS","SVG","IFRAME","EMBED","OBJECT","VIDEO","SCRIPT","STYLE","LINK"]),Da=`
:root[data-spro-tema="escuro"]:not([${O}]) [${q}~="t"] { color: var(${ro}) !important; }
:root[data-spro-tema="escuro"]:not([${O}]) [${q}~="f"] { background-color: var(${to}) !important; }
:root[${O}] body { background: #fff; color: #000; }
[${T}] { position: fixed; bottom: 12px; left: 12px; z-index: 2147483000; padding: 4px 10px;
  font: 12px/1.4 var(--spro-fonte, system-ui, sans-serif); color: var(--spro-texto); background: var(--spro-fundo);
  border: 1px solid var(--spro-borda-forte); border-radius: var(--spro-raio, 8px); cursor: pointer; box-shadow: var(--spro-sombra-2); }
[${T}]:hover { background: var(--spro-destaque); color: var(--spro-destaque-texto); }
[${T}][aria-pressed="true"] { outline: 2px solid var(--spro-destaque); }
`;function Na(o,a,t){let r=o.style;return r?.getPropertyValue?.(a)||(a==="background-color"?r?.getPropertyValue?.("background"):"")||""||o.getAttribute(t)||""}function Ho(o,a){let e=Na(o,a==="texto"?"color":"background-color",a==="texto"?"color":"bgcolor");if(e)return e;if(a==="fundo"&&/^(TD|TH|TABLE)$/.test(o.tagName))try{return o.ownerDocument.defaultView?.getComputedStyle(o).backgroundColor??""}catch{return""}return""}function Ha(o,a){if(Ra.has(o.tagName.toUpperCase())||o.closest?.(`[${T}]`))return;let t="",r=()=>{a.has(o)||a.set(o,o.getAttribute("style"))},e=oo(Ho(o,"texto"),"texto");e&&(r(),o.style.setProperty(ro,e),t+="t");let s=oo(Ho(o,"fundo"),"fundo");s&&(r(),o.style.setProperty(to,s),t+="f"),t&&o.setAttribute(q,t)}function $a(o){for(let a of[o,...o.querySelectorAll(`[${q}]`)]){if(!a.hasAttribute(q))continue;a.removeAttribute(q);let t=a.style;t.removeProperty(ro),t.removeProperty(to),a.getAttribute("style")||a.removeAttribute("style")}}function $o(o){let a=globalThis;typeof a.requestIdleCallback=="function"?a.requestIdleCallback(o):setTimeout(o,0)}function Vo(o,a={}){let t=(a.raizes??["body"]).flatMap(i=>[...o.querySelectorAll(i)]);if(t.length===0)return()=>{};if(!o.querySelector(`style[${ao}]`)){let i=o.createElement("style");i.setAttribute(ao,""),i.textContent=Da,(o.head??o.documentElement).appendChild(i)}let r=new WeakSet,e=new Map,s=[],n=!1,d=!0,l=()=>{if(n=!1,!!d){for(let i of s.splice(0,Ba))r.has(i)||(r.add(i),Ha(i,e));s.length>0&&(n=!0,$o(l))}},m=i=>{if(i.nodeType===1){i.matches?.(No)&&s.push(i);for(let c of i.querySelectorAll?.(No)??[])s.push(c);!n&&s.length>0&&(n=!0,$o(l))}};for(let i of t)m(i);let u=null;if(typeof MutationObserver=="function"){u=new MutationObserver(i=>{for(let c of i)if(c.type==="childList")for(let h of c.addedNodes)m(h);else c.type==="attributes"&&c.target.nodeType===1&&(r.delete(c.target),m(c.target))});for(let i of t)u.observe(i,{childList:!0,subtree:!0})}return a.botao&&ja(o),()=>{d=!1,u?.disconnect(),s=[],$a(o.documentElement);for(let[i,c]of e)c===null?i.removeAttribute("style"):i.setAttribute("style",c);e.clear();for(let i of o.querySelectorAll(`style[${ao}], [${T}]`))i.remove();o.documentElement.removeAttribute(O)}}function Va(o){let a=o.documentElement,t=!a.hasAttribute(O);return t?a.setAttribute(O,""):a.removeAttribute(O),o.querySelector(`[${T}]`)?.setAttribute("aria-pressed",String(t)),t}function ja(o){if(o.querySelector(`[${T}]`)||!o.body)return;let a=o.createElement("button");a.type="button",a.setAttribute(T,""),a.setAttribute("aria-pressed","false"),a.title="Mostra o documento com as cores originais, como ser\xE1 assinado",a.textContent="Ver original",a.addEventListener("click",()=>Va(o)),o.body.appendChild(a)}var G="spro_papel_largo",no="data-spro-papel-largo",Ua="spro-largura",Fa="Largura total",Ga="Largura de p\xE1gina",Xa="Usar toda a largura da visualiza\xE7\xE3o",Qa="Voltar \xE0 largura de p\xE1gina",jo="a.openNewTab";function io(o){try{return o.getItem(G)==="1"}catch{return!1}}function Ja(o,a){try{a?o.setItem(G,"1"):o.removeItem(G)}catch{}}function po(o,a){a?o.documentElement.setAttribute(no,""):o.documentElement.removeAttribute(no)}function Go(o,a){po(o,io(a));let t=o.defaultView,r=e=>{let s=e.key;(s===null||s===G)&&po(o,io(a))};return t?.addEventListener("storage",r),()=>{t?.removeEventListener("storage",r),o.documentElement.removeAttribute(no)}}var F="spro-doc-acao",Ka="spro-doc-acoes",eo="data-spro-rotulo",Uo="data-spro-compacto",Fo="data-spro-sem-documento",so=16;function Ya(o){let a=o.querySelector("iframe#ifrVisualizacao, iframe[name=ifrVisualizacao]");if(!a)return!0;try{let t=a.contentWindow?.location;return t?/[?&]acao=documento_visualizar\b/.test(t.search):!0}catch{return!0}}function Wa(o){let a=/Baixar documento \(([^)]+)\)/i.exec(o);return a?`Baixar ${a[1]}`:""}function Xo(o,a){let t=null,r=null,e=io(a),s=()=>{t&&(t.textContent=e?Ga:Fa,t.setAttribute("aria-pressed",String(e)),t.title=e?Qa:Xa)},n=()=>{let g=o.createElement("button");return g.type="button",g.className=`${Ua} ${F}`,g.addEventListener("click",()=>{e=!e,Ja(a,e);for(let v of o.querySelectorAll("iframe"))try{v.contentDocument&&po(v.contentDocument,e)}catch{}s()}),g},d=new WeakSet,l=g=>{r&&(g?r.setAttribute(Uo,""):r.removeAttribute(Uo))},m=g=>{let v=g;return v?.scrollingElement?.scrollTop??v?.documentElement?.scrollTop??v?.scrollTop??0},u=()=>{d.has(o)||(d.add(o),o.addEventListener("scroll",g=>l(m(g.target)>so),!0));for(let g of o.querySelectorAll("iframe")){let v=null;try{v=g.contentDocument}catch{}!v||d.has(v)||(d.add(v),l(m(v)>so),v.addEventListener("scroll",()=>l(m(v)>so),!0))}},i=()=>{r&&(Ya(o)?r.removeAttribute(Fo):r.setAttribute(Fo,""))},c=()=>{let g=[...o.querySelectorAll(jo)],v=g[0];if(v?.parentElement){(!r||!r.isConnected)&&(r=o.createElement("div"),r.className=Ka,v.before(r)),(!t||!t.isConnected)&&(t=n(),r.prepend(t),s());for(let I of g)if(I.parentElement!==r&&r.append(I),I.classList.add(F),!I.hasAttribute(eo)){let lo=Wa(I.getAttribute("onmouseover")??"");lo&&I.setAttribute(eo,lo)}i()}};c(),u();let h=()=>{l(!1),u(),i()};o.addEventListener("load",h,!0);let b=o.defaultView?.MutationObserver??(typeof MutationObserver=="function"?MutationObserver:null),f=b&&o.body?new b(c):null;return f?.observe(o.body,{childList:!0,subtree:!0}),()=>{f?.disconnect(),o.removeEventListener("load",h,!0);for(let g of o.querySelectorAll(`.${F}`))g.classList.remove(F),g.removeAttribute(eo);if(r){for(let g of[...r.querySelectorAll(jo)])r.before(g);r.remove()}t=null,r=null}}var Za=[{id:"claro",rotulo:"Claro"},{id:"escuro",rotulo:"Escuro"},{id:"auto",rotulo:"Autom\xE1tico"}],Jo=`
.spro-ap-corpo{display:grid;gap:0}
.spro-ap-linha{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:center;padding:14px 20px;border-top:1px solid var(--linha)}
.spro-ap-linha:first-child{border-top:0}
.spro-ap-rotulo{display:grid;gap:2px;line-height:1.35}
.spro-ap-dica{font-size:13px;color:var(--tinta-2)}
.spro-ap-selo{padding:2px 10px;border-radius:999px;background:var(--azul-claro);color:var(--azul);font-size:12px;font-weight:600}
.spro-ap-seg{display:inline-flex;border:1px solid var(--linha);border-radius:10px;overflow:hidden}
.spro-ap-seg button{min-height:38px;padding:0 14px;border:0;background:var(--superficie);color:var(--tinta);font:600 14px var(--texto);cursor:pointer}
.spro-ap-seg button+button{border-left:1px solid var(--linha)}
.spro-ap-seg button[aria-checked="true"]{background:var(--azul);color:var(--sobre-azul)}
.spro-ap-cores{display:grid;gap:10px;padding:14px 20px;border-top:1px solid var(--linha)}
.spro-ap-grade{display:flex;flex-wrap:wrap;gap:8px}
.spro-ap-cor{display:inline-flex;align-items:center;gap:8px;min-height:38px;padding:0 12px 0 8px;border:1px solid var(--linha);border-radius:10px;background:var(--superficie);color:var(--tinta);font:600 13px var(--texto);cursor:pointer}
.spro-ap-cor i{width:20px;height:20px;border-radius:6px;border:1px solid rgb(0 0 0/20%)}
.spro-ap-cor[aria-pressed="true"]{border-color:var(--azul);box-shadow:0 0 0 2px var(--azul-claro)}
.spro-ap-livre{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.spro-ap-livre input[type=color]{width:44px;height:38px;padding:2px;border:1px solid var(--linha);border-radius:8px;background:var(--superficie);cursor:pointer}
.spro-ap-aviso{font-size:13px;color:var(--tinta-2);min-height:1.2em}
.spro-ap-previa{margin:0 20px 16px;border:1px solid var(--spro-borda);border-radius:var(--spro-raio-g);overflow:hidden;background:var(--spro-pagina);color:var(--spro-texto);font-family:var(--spro-fonte)}
.spro-ap-previa-barra{display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--spro-barra);color:var(--spro-barra-texto);font-weight:600;border-bottom:1px solid var(--spro-barra-borda)}
.spro-ap-previa-barra span{padding:2px 8px;border-radius:6px;background:var(--spro-barra-hover);font-weight:500;font-size:12px}
.spro-ap-previa-corpo{padding:14px;display:grid;gap:10px}
.spro-ap-previa-tab{width:100%;border-collapse:collapse;font-size:13px;background:var(--spro-fundo);border:1px solid var(--spro-borda);border-radius:var(--spro-raio);overflow:hidden}
.spro-ap-previa-tab th{padding:6px 10px;text-align:left;background:var(--spro-fundo-3)}
.spro-ap-previa-tab td{padding:6px 10px;border-top:1px solid var(--spro-borda)}
.spro-ap-previa-tab tr:nth-child(even) td{background:var(--spro-fundo-2)}
.spro-ap-previa a{color:var(--spro-destaque)}
.spro-ap-previa-botoes{display:flex;gap:8px;align-items:center}
.spro-ap-previa button{min-height:34px;padding:0 14px;border-radius:var(--spro-raio);font:600 13px var(--spro-fonte)}
.spro-ap-previa .p{background:var(--spro-destaque);color:var(--spro-destaque-texto);border:1px solid var(--spro-destaque)}
.spro-ap-previa .s{background:var(--spro-fundo);color:var(--spro-texto);border:1px solid var(--spro-borda-forte)}
.spro-ap-rodape{display:flex;gap:8px;flex-wrap:wrap;padding:0 20px 16px}
`;function Qo(o,a,t){let r=p("input",{type:"checkbox",role:"switch","aria-label":a});return r.checked=o,r.addEventListener("change",()=>t(r.checked)),p("label",{class:"chave"},r,p("span",{class:"trilho"}))}async function Ko(o){let a=k(await o.ler()),t=p("div",{class:"spro-ap-previa","aria-hidden":"true"},p("div",{class:"spro-ap-previa-barra"},"SEI",p("span",{},"Controle de Processos")),p("div",{class:"spro-ap-previa-corpo"},p("table",{class:"spro-ap-previa-tab"},p("tr",{},p("th",{},"Processo"),p("th",{},"Tipo")),p("tr",{},p("td",{},p("a",{href:"#"},"00000.000000/2026-00")),p("td",{},"Of\xEDcio")),p("tr",{},p("td",{},"00000.000001/2026-11"),p("td",{},"Parecer"))),p("div",{class:"spro-ap-previa-botoes"},p("button",{type:"button",class:"p"},"Salvar"),p("button",{type:"button",class:"s"},"Cancelar")))),r=p("div",{class:"spro-ap-aviso",role:"status"}),e=p("div",{class:"spro-ap-seg",role:"radiogroup","aria-label":"Modo do tema"}),s=p("div",{class:"spro-ap-grade"}),n=p("input",{type:"color","aria-label":"Cor livre da barra"}),d=p("code",{},""),l=p("div",{class:"spro-ap-corpo"}),m=()=>{let b=P(a,o.sistemaEscuro());for(let[v,I]of Object.entries(Y(a,b)))t.style.setProperty(v,I);for(let v of e.querySelectorAll("button"))v.setAttribute("aria-checked",String(v.dataset.modo===a.modo));for(let v of s.querySelectorAll("button"))v.setAttribute("aria-pressed",String(v.dataset.paleta===a.paleta));n.value=a.corBarra,d.textContent=a.corBarra;let f=$(a.corBarra,"claro"),g=y(f.barra)&&f.barra.toLowerCase()!==a.corBarra.toLowerCase();r.textContent=g?"Ajustamos o tom para manter o texto leg\xEDvel.":"",l.toggleAttribute("data-inativo",!a.ativo)},u=async b=>{a=k({...a,...b}),m(),await o.gravar(a)};for(let b of Za){let f=p("button",{type:"button",role:"radio","data-modo":b.id,onclick:()=>void u({modo:b.id})},b.rotulo);e.append(f)}for(let b of N)s.append(p("button",{type:"button",class:"spro-ap-cor","data-paleta":b.id,"aria-pressed":"false",onclick:()=>void u({paleta:b.id,corBarra:b.cor})},p("i",{style:`background:${b.cor}`}),b.nome));n.addEventListener("input",()=>void u({paleta:"livre",corBarra:n.value}));let i=(b,f,g)=>p("div",{class:"spro-ap-linha"},p("div",{class:"spro-ap-rotulo"},p("strong",{},b),p("span",{class:"spro-ap-dica"},f)),g),c=p("button",{type:"button",class:"btn btn-secundario",onclick:()=>void u({...C,ativo:a.ativo})},"Restaurar padr\xE3o");l.append(i("Modo","Autom\xE1tico segue o tema do seu sistema operacional.",e),p("div",{class:"spro-ap-cores"},p("strong",{},"Cor da barra superior"),s,p("div",{class:"spro-ap-livre"},"Outra cor:",n,d),r),i("Escurecer o conte\xFAdo dos documentos","No modo escuro, o texto dos documentos \xE9 adaptado e h\xE1 um bot\xE3o \u201CVer original\u201D para conferir antes de assinar.",Qo(a.escurecerDocumentos,"Escurecer o conte\xFAdo dos documentos",b=>void u({escurecerDocumentos:b}))),t,p("div",{class:"spro-ap-rodape"},c));let h=p("div",{class:"secao-corpo"},i("Ativar o Estilo Avan\xE7ado","Visual novo do SEI, no mesmo estilo das telas do SEI Pro. As mudan\xE7as valem na hora, sem precisar salvar.",Qo(a.ativo,"Ativar o Estilo Avan\xE7ado",b=>void u({ativo:b}))),l);return m(),{conteudo:h,atualizar:b=>{a=k(b),m();let f=h.querySelectorAll('input[role="switch"]');f[0]&&(f[0].checked=a.ativo),f[1]&&(f[1].checked=a.escurecerDocumentos)}}}var Yo="spro-estilo2-modal",or={claro:"--linha:#e3e6eb;--tinta:#1f2328;--tinta-2:#5b6470;--superficie:#fff;--azul:#1f5fbf;--azul-claro:#e8f0fb;--sobre-azul:#fff;--fundo-modal:#fff;--sombra:0 24px 64px rgb(0 0 0/28%)",escuro:"--linha:#2f343a;--tinta:#e8eaed;--tinta-2:#9aa0a8;--superficie:#1a1d21;--azul:#5f9dff;--azul-claro:#1d2635;--sobre-azul:#0b1220;--fundo-modal:#141619;--sombra:0 24px 64px rgb(0 0 0/60%)"},ar=`
:host{all:initial}
.fundo{position:fixed;inset:0;z-index:2147483600;display:grid;place-items:center;padding:16px;background:rgb(10 12 16/55%);font:14px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--tinta);animation:entra .14s ease-out}
@keyframes entra{from{opacity:0}}
.caixa{width:min(680px,100%);max-height:calc(100vh - 32px);display:flex;flex-direction:column;border:1px solid var(--linha);border-radius:16px;background:var(--fundo-modal);box-shadow:var(--sombra);overflow:hidden}
.topo{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid var(--linha)}
.topo h2{margin:0;font-size:17px;font-weight:700}
.fechar{display:grid;place-items:center;width:36px;height:36px;border:0;border-radius:10px;background:transparent;color:var(--tinta-2);font-size:22px;line-height:1;cursor:pointer}
.fechar:hover{background:var(--azul-claro);color:var(--tinta)}
.corpo{overflow:auto}
.chave{position:relative;display:inline-block;width:44px;height:26px;cursor:pointer}
.chave input{position:absolute;inset:0;width:100%;height:100%;margin:0;opacity:0;cursor:pointer}
.trilho{position:absolute;inset:0;border-radius:999px;background:var(--linha);transition:background .15s}
.trilho::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgb(0 0 0/30%);transition:transform .15s}
.chave input:checked+.trilho{background:var(--azul)}
.chave input:checked+.trilho::after{transform:translateX(18px)}
.chave input:focus-visible+.trilho{outline:2px solid var(--azul);outline-offset:2px}
.btn{min-height:38px;padding:0 14px;border:1px solid var(--linha);border-radius:10px;background:var(--superficie);color:var(--tinta);font:600 14px system-ui,sans-serif;cursor:pointer}
.btn:hover{border-color:var(--azul)}
.secao-corpo{display:block}
[data-inativo]{opacity:.5;pointer-events:none}
button:focus-visible{outline:2px solid var(--azul);outline-offset:2px}
`;async function Wo(o,a){o.getElementById(Yo)?.remove();let t=o.documentElement.getAttribute("data-spro-tema")==="escuro"||!o.documentElement.hasAttribute("data-spro-tema")&&a.sistemaEscuro(),r=o.createElement("div");r.id=Yo;let e=r.attachShadow({mode:"open"}),{conteudo:s,atualizar:n}=await Ko(a),d=()=>{o.removeEventListener("keydown",l,!0),chrome.storage.onChanged.removeListener(m),r.remove()},l=c=>{c.key==="Escape"&&(c.stopPropagation(),d())},m=(c,h)=>{h==="sync"&&c[A]&&n(c[A].newValue)};chrome.storage.onChanged.addListener(m),o.addEventListener("keydown",l,!0);let u=p("div",{class:"caixa",role:"dialog","aria-modal":"true","aria-label":"Apar\xEAncia do SEI"},p("div",{class:"topo"},p("h2",{},"Apar\xEAncia do SEI"),p("button",{type:"button",class:"fechar","aria-label":"Fechar",onclick:d},"\xD7")),p("div",{class:"corpo"},s)),i=p("div",{class:"fundo"},u);return i.addEventListener("mousedown",c=>{c.target===i&&d()}),e.append(p("style",{},`:host{${or[t?"escuro":"claro"]}}${ar}${Jo}`),i),(o.body??o.documentElement).append(r),u.querySelector(".fechar")?.focus(),d}var X="data-spro-nav-compacta",co="data-spro-orgao",Zo="--spro-nav-fim",rr="#divInfraAreaTelaD";function oa(o){let a=o.documentElement,t=null,r=!0,e=null,s=()=>{},n=()=>{if(!t)return;let l=t.scrollTop,m=t.scrollHeight-t.clientHeight,u=a.hasAttribute(X);if(!u&&l>24&&m>54)a.setAttribute(X,"");else if(u&&l<=4)a.removeAttribute(X);else return;s()},d=()=>{if(!r||(t=o.querySelector(rr),!t||!o.querySelector("#navInfraBarraNavegacao")))return;t.addEventListener("scroll",n,{passive:!0});let l=o.querySelector("#divInfraBarraSistema > h6.d-md-block")?.textContent?.trim(),m=o.querySelector("#divInfraBarraSistemaPadraoE > div.align-self-center");l&&m&&m.setAttribute(co,l);let u=o.querySelector("#navInfraBarraNavegacao");s=()=>{u&&a.style.setProperty(Zo,`${u.getBoundingClientRect().bottom}px`)},s(),u&&typeof ResizeObserver=="function"&&(e=new ResizeObserver(s),e.observe(u))};return o.readyState==="loading"?o.addEventListener("DOMContentLoaded",d,{once:!0}):d(),()=>{r=!1,t?.removeEventListener("scroll",n),e?.disconnect(),a.removeAttribute(X),a.style.removeProperty(Zo),o.querySelector(`[${co}]`)?.removeAttribute(co)}}var tr="spro_grade",er="button.spro-grade-botao";function aa(o,a){try{a.setItem(tr,"1")}catch{}if(!/[?&]acao=procedimento_controlar\b/.test(o.defaultView?.location?.search??""))return;let t=0,r=()=>{let e=o.querySelector(er);e?.getAttribute("aria-pressed")==="false"?e.click():!e&&++t<8&&setTimeout(r,700)};setTimeout(r,700)}var D="data-spro-altura";var sr='div.infraAreaDados[style*="height"]';function nr(o){try{return o.ownerDocument.defaultView?.getComputedStyle(o).position==="absolute"}catch{return!1}}function ir(o,a=nr,t=r=>r.getBoundingClientRect().height){let r=0;for(let e of o.querySelectorAll(sr)){if(e.hasAttribute(D))continue;let s=[...e.querySelectorAll(":scope > label, :scope > input, :scope > select, :scope > textarea")];if(s.length===0||!s.some(a))continue;let n=t(e);n>0&&(e.setAttribute(D,e.style.height),e.style.height=`${Math.round(n*1.3)}px`,r++)}return r}function dr(o){for(let a of o.querySelectorAll(`[${D}]`)){let t=a.getAttribute(D)??"";t?a.style.height=t:a.style.removeProperty("height"),a.removeAttribute(D),a.getAttribute("style")||a.removeAttribute("style")}}function ra(o){let a=()=>void ir(o);o.readyState==="loading"?o.addEventListener("DOMContentLoaded",a,{once:!0}):a();let t=o.defaultView;return t?.addEventListener("load",a,{once:!0}),()=>{o.removeEventListener("DOMContentLoaded",a),t?.removeEventListener("load",a),dr(o)}}var pr=`${wo()}
${To()}`,ta=window;if(!ta.__seiProEstilo2){ta.__seiProEstilo2=!0,document.documentElement.setAttribute("data-spro-estilo2","");try{localStorage.removeItem("seiSlim")}catch{}let o=typeof matchMedia=="function"?matchMedia("(prefers-color-scheme: dark)"):null,a=null,t=/[?&]acao=(documento_visualizar|documento_imprimir_web)\b/.test(location.search),r=null,e=null,s=null,n=/[?&]acao=arvore_visualizar\b/.test(location.search),d=null,l=null,m=null,u=()=>{let f=document.getElementById("changeSlimPro");f&&a&&(f.checked=a.ativo)},i=()=>{if(!a)return;u();let f=o?.matches??!1;qo(document,a,f,`${go}
${ho}
${xo}
${pr}`),t&&a.ativo?document.documentElement.setAttribute("data-spro-papel",""):document.documentElement.removeAttribute("data-spro-papel");let g=t&&a.ativo&&a.escurecerDocumentos&&P(a,f)==="escuro";if(a.ativo&&!s?s=ra(document):!a.ativo&&s&&(s(),s=null),a.ativo&&t&&!l?l=Go(document,localStorage):!a.ativo&&l&&(l(),l=null),a.ativo&&n&&!m){let v=()=>{m!==null&&(m=Xo(document,localStorage))};m=()=>{},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v,{once:!0}):v()}else!a.ativo&&m&&(m(),m=null);if(a.ativo&&!d?d=oa(document):!a.ativo&&d&&(d(),d=null),a.ativo&&!e){let v=()=>{e!==null&&(e=Ro(document))};e=()=>{},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v,{once:!0}):v()}else!a.ativo&&e&&(e(),e=null);if(g&&!r){let v=()=>{r!==null&&(r=Vo(document,{botao:!0}))};r=()=>{},document.readyState==="loading"?document.addEventListener("DOMContentLoaded",v,{once:!0}):v()}else!g&&r&&(r(),r=null)};a=zo(localStorage),i(),o?.addEventListener("change",i);let c=!0,h=f=>{let g=a;a=k(f),Bo(localStorage,a),i(),!c&&!g?.ativo&&a.ativo&&window===window.top&&aa(document,localStorage),c=!1};chrome.storage.sync.get(A).then(f=>h(f[A])).catch(f=>console.warn("[SEI Pro] estilo avancado 2:",f));let b={ler:async()=>(await chrome.storage.sync.get(A))[A],gravar:_o,sistemaEscuro:()=>o?.matches??!1};document.addEventListener("spro-estilo2-alternar",()=>{let f=k(a);b.gravar({...f,ativo:!f.ativo}),h({...f,ativo:!f.ativo})}),document.addEventListener("spro-estilo2-paleta",()=>void Wo(document,b)),window.addEventListener("load",()=>setTimeout(u,1500)),chrome.storage.onChanged.addListener((f,g)=>{g==="sync"&&f[A]&&h(f[A].newValue)})}})();
