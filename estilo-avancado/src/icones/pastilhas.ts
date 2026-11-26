/**
 * SEI Pro Lab: conjunto de ícones "Pastilhas". Cada ícone é um quadrado de cantos arredondados, colorido
 * pela função, com o desenho em branco por cima: a mesma linguagem dos botões nativos das barras de ações
 * do SEI. Reaproveita os desenhos de traço do conjunto moderno (mesma grade de 24 px).
 *
 * - Menu lateral, linhas de tabela, botões do SEI Pro nas barras de ações e itens do SEI Pro no menu:
 *   pastilha colorida (desenho multicolor, como imagem).
 * - Barra superior: pastilha "vazada" na cor do texto da barra (máscara), para combinar com qualquer cor de barra.
 */
import { type Forma, ICONES } from "@comum/ui/dom";
import { ICONES_EXTRAS } from "./extras";
import { type ContextoIcone, type EntradaIcone, MAPA_ICONES, MAPA_MENU_PRO } from "./mapa";

/** Desenhos que só existiam como imagem multicolor no conjunto moderno (proprios.ts): aqui em traço. */
const LOCAIS: Record<string, Forma[]> = {
  documentos: [
    ["path", { d: "M8 3.5h6.5l4 4V17a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 17V5A1.5 1.5 0 0 1 8 3.5z" }],
    ["path", { d: "M4 7v12.5A1.5 1.5 0 0 0 5.5 21H15" }],
    ["path", { d: "M12.5 9v5M10 11.5h5" }],
  ],
  comparar: [
    ["rect", { x: "3", y: "4", width: "7.5", height: "16", rx: "1.5" }],
    ["rect", { x: "13.5", y: "4", width: "7.5", height: "16", rx: "1.5" }],
    ["path", { d: "M5.5 9h2.5M5.5 12.5h2.5M16 9h2.5M16 12.5h2.5" }],
  ],
};

const TODOS: Record<string, Forma[]> = { ...(ICONES as Record<string, Forma[]>), ...ICONES_EXTRAS, ...LOCAIS };

/** Cores das pastilhas: tons médios, com o branco legível por cima nos dois esquemas. */
const COR = {
  azul: "#2f6fde",
  indigo: "#5160d6",
  roxo: "#7d58d8",
  rosa: "#cf4685",
  vermelho: "#d6403a",
  laranja: "#de6a1c",
  ambar: "#c98a0a",
  verde: "#21985a",
  teal: "#0f9585",
  ciano: "#1590ad",
  cinza: "#687482",
  grafite: "#4a5563",
} as const;
type Cor = keyof typeof COR;

/** Cor de cada desenho, pela função (o mesmo desenho tem a mesma cor em qualquer lugar). */
const COR_DO_ICONE: Record<string, Cor> = {
  olho: "azul",
  engrenagem: "grafite",
  livro: "indigo",
  camadas: "roxo",
  pessoas: "teal",
  pessoa: "teal",
  relogio: "laranja",
  lista: "azul",
  estrela: "ambar",
  pastaMais: "verde",
  escudoCheck: "verde",
  etiqueta: "rosa",
  painel: "indigo",
  busca: "ciano",
  bandeira: "vermelho",
  pausa: "cinza",
  historico: "indigo",
  planilha: "verde",
  retorno: "laranja",
  documento: "azul",
  codigo: "grafite",
  menu: "grafite",
  megafone: "rosa",
  acessibilidade: "azul",
  saida: "vermelho",
  lapis: "ambar",
  desativar: "cinza",
  lixeira: "vermelho",
  duplicar: "roxo",
  check: "verde",
  mapa: "teal",
  paginaAnterior: "cinza",
  seta: "cinza",
  paginaPrimeira: "cinza",
  paginaUltima: "cinza",
  robo: "roxo",
  link: "ciano",
  pdf: "vermelho",
  documentos: "verde",
  comparar: "ciano",
  certidao: "verde",
};

/** O desenho de traço, centralizado e reduzido para caber na pastilha. */
function desenho(nome: string, cor: string): string {
  const formas = TODOS[nome];
  if (!formas) throw new Error(`Ícone desconhecido: ${nome}`);
  const corpo = formas
    .map(([tag, attrs]) => {
      const a = Object.entries(attrs)
        .map(([k, v]) => (k === "fill" && v === "currentColor" ? `fill="${cor}"` : `${k}="${v}"`))
        .join(" ");
      return `<${tag} ${a}/>`;
    })
    .join("");
  return `<g transform="translate(12 12) scale(.66) translate(-12 -12)" fill="none" stroke="${cor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">${corpo}</g>`;
}

const tamanho = (px: number) => `width="${px}" height="${px}"`;

/** Pastilha colorida com o desenho em branco (imagem multicolor). */
export function svgPastilha(nome: string, px = 24): string {
  const fundo = COR[COR_DO_ICONE[nome] ?? "azul"];
  return `<svg xmlns="http://www.w3.org/2000/svg" ${tamanho(px)} viewBox="0 0 24 24"><rect x="1" y="1" width="22" height="22" rx="5.5" fill="${fundo}"/><rect x="1" y="1" width="22" height="11" rx="5.5" fill="#fff" fill-opacity=".1"/>${desenho(nome, "#fff")}</svg>`;
}

/** Pastilha vazada (o desenho "recortado"), para usar como máscara na cor do contexto. */
export function svgPastilhaVazada(nome: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><defs><mask id="m"><rect width="24" height="24" fill="#fff"/>${desenho(nome, "#000")}</mask></defs><rect x="1" y="1" width="22" height="22" rx="5.5" fill="#000" mask="url(#m)"/></svg>`;
}

const uri = (svg: string) => `url("data:image/svg+xml,${encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22")}")`;
const GIF_TRANSPARENTE = `url("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")`;

const ESCOPO: Record<ContextoIcone, string> = {
  menu: "#infraMenu",
  topo: "#divInfraBarraSistemaPadrao",
  barra: ":is(div.barraBotoesSEI, #divArvoreAcoes)",
  tabela: "table",
};
const seletor = (e: EntradaIcone) =>
  e.seletor
    ? `:root[data-spro-tema-ativo] ${ESCOPO[e.contexto]} ${e.seletor}`
    : `:root[data-spro-tema-ativo] ${ESCOPO[e.contexto]} img${e.daExtensao ? '[src^="chrome-extension"]' : ""}[src*="${e.src}"]`;

/** Tamanho em px da imagem de cada contexto (as barras de ações têm 40 px; o resto, 24 px). */
const PX: Record<ContextoIcone, number> = { menu: 24, topo: 24, barra: 40, tabela: 24 };

export function gerarCssPastilhas(mapa: EntradaIcone[] = MAPA_ICONES): string {
  const partes: string[] = [];
  const coloridos = mapa.filter((e) => e.contexto !== "topo");
  const topo = mapa.filter((e) => e.contexto === "topo");
  if (coloridos.length) {
    partes.push(
      `${coloridos.map(seletor).join(",\n")} {\n  box-sizing: border-box;\n  padding: 0 !important;\n  background: none !important;\n  -webkit-mask: none;\n}`,
    );
    for (const ctx of ["menu", "tabela"] as ContextoIcone[]) {
      const doCtx = coloridos.filter((e) => e.contexto === ctx);
      if (doCtx.length) partes.push(`${doCtx.map(seletor).join(",\n")} {\n  width: 24px;\n  height: 24px;\n}`);
    }
    for (const e of coloridos) partes.push(`${seletor(e)} {\n  content: ${uri(svgPastilha(e.icone, PX[e.contexto]))};\n}`);
  }
  if (topo.length) {
    partes.push(
      `${topo.map(seletor).join(",\n")} {\n  content: ${GIF_TRANSPARENTE};\n  box-sizing: border-box;\n  width: 24px;\n  height: 24px;\n  padding: 0;\n  background-color: currentColor;\n  -webkit-mask-repeat: no-repeat;\n  -webkit-mask-position: center;\n  -webkit-mask-size: contain;\n}`,
    );
    for (const e of topo) partes.push(`${seletor(e)} {\n  -webkit-mask-image: ${uri(svgPastilhaVazada(e.icone))};\n}`);
  }
  // Itens do SEI Pro no menu lateral (<svg> inline): a pastilha entra como fundo do próprio <svg>.
  const base = `:root[data-spro-tema-ativo] #infraMenu a.newLinksMenuPro > svg.iconMenuPro`;
  partes.push(
    `${base} {\n  box-sizing: border-box;\n  flex: none;\n  width: 24px !important;\n  height: 24px !important;\n  margin: 0 5px 0 6px !important;\n  background: center / contain no-repeat;\n}`,
    `${base} > * {\n  display: none;\n}`,
  );
  for (const e of MAPA_MENU_PRO)
    partes.push(
      `:root[data-spro-tema-ativo] #infraMenu a#${e.id} > svg.iconMenuPro {\n  background-image: ${uri(svgPastilha(e.icone))};\n}`,
    );
  return partes.join("\n");
}

/** Para o teste e para a prévia: os nomes usados existem no conjunto e têm cor. */
export function iconesSemCor(): string[] {
  const nomes = new Set([...MAPA_ICONES.map((e) => e.icone), ...MAPA_MENU_PRO.map((e) => e.icone)]);
  return [...nomes].filter((n) => !COR_DO_ICONE[n] || !TODOS[n]);
}
