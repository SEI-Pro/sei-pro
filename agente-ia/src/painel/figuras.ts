/**
 * Onde há figura num PDF, sem rede e sem olhar os pixels.
 *
 * O pdf.js entrega a lista de operações de cada página; a imagem é sempre
 * desenhada como o quadrado unitário levado pela matriz de transformação em
 * vigor. Acompanhar a matriz (save/restore/transform/forma XObject) dá a caixa
 * de cada imagem em pontos do PDF, com a origem embaixo à esquerda.
 *
 * Daqui sai só cálculo: quem chama o pdf.js é `pdf.ts` (leitura) e
 * `imagem.ts` (recorte). As duas pontas numeram as figuras por
 * `figurasDoDocumento`, para o `p3-1` da marca ser o `p3-1` do recorte.
 */

import { faixas } from "./anexo";

export interface Caixa {
  x: number;
  y: number;
  largura: number;
  altura: number;
}

export interface PaginaVista {
  n: number;
  largura: number;
  altura: number;
  caixas: Caixa[];
  /** A página tem camada de texto (critério de `temCamadaDeTexto`). */
  camada: boolean;
  /** O OCR desta leitura achou texto nela. */
  ocrLeu: boolean;
}

export interface Figura {
  id: string;
  pagina: number;
  caixa: Caixa;
  /** Fração da área da página. */
  fracao: number;
}

type Matriz = [number, number, number, number, number, number];
const IDENTIDADE: Matriz = [1, 0, 0, 1, 0, 0];

const ehMatriz = (m: unknown): m is Matriz => Array.isArray(m) && m.length === 6 && m.every((v) => typeof v === "number");
const multiplicar = (m: Matriz, n: Matriz): Matriz => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];

/** O quadrado unitário levado pela matriz: envoltório dos quatro cantos. */
function caixaDaMatriz(m: Matriz): Caixa {
  const xs = [m[4], m[0] + m[4], m[2] + m[4], m[0] + m[2] + m[4]];
  const ys = [m[5], m[1] + m[5], m[3] + m[5], m[1] + m[3] + m[5]];
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, largura: Math.max(...xs) - x, altura: Math.max(...ys) - y };
}

/** Caixas das imagens desenhadas, na ordem da lista de operações. */
export function caixasDasImagens(fnArray: number[], argsArray: unknown[][], OPS: Record<string, number>): Caixa[] {
  const caixas: Caixa[] = [];
  const pilha: Matriz[] = [];
  let ctm: Matriz = IDENTIDADE;
  for (let i = 0; i < fnArray.length; i += 1) {
    const fn = fnArray[i];
    const args = argsArray[i] ?? [];
    if (fn === OPS.save) pilha.push(ctm);
    else if (fn === OPS.restore) ctm = pilha.pop() ?? ctm;
    else if (fn === OPS.transform && ehMatriz(args)) ctm = multiplicar(ctm, args);
    else if (fn === OPS.paintFormXObjectBegin) {
      pilha.push(ctm);
      if (ehMatriz(args[0])) ctm = multiplicar(ctm, args[0]);
    } else if (fn === OPS.paintFormXObjectEnd) ctm = pilha.pop() ?? ctm;
    else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) caixas.push(caixaDaMatriz(ctm));
    else if (fn === OPS.paintImageXObjectRepeat) {
      const [, sx, sy, posicoes] = args as [unknown, number, number, number[]];
      for (let p = 0; p + 1 < (posicoes?.length ?? 0); p += 2) caixas.push(caixaDaMatriz(multiplicar(ctm, [sx, 0, 0, sy, posicoes[p], posicoes[p + 1]])));
    }
  }
  return caixas;
}

/** Acima disto, a imagem é a página escaneada, não uma figura nela. */
const PAGINA_DIGITALIZADA = 0.8;
const AREA_MINIMA = 0.03;
const LADO_MINIMO = 72;
/** Faixa de cima e de baixo onde moram cabeçalho e rodapé. */
const MARGEM = 0.15;
const REPETICOES = 3;
const TOLERANCIA = 2;

const area = (c: Caixa) => c.largura * c.altura;
const tocam = (a: Caixa, b: Caixa) => a.x <= b.x + b.largura + 1 && b.x <= a.x + a.largura + 1 && a.y <= b.y + b.altura + 1 && b.y <= a.y + a.altura + 1;
const unir = (a: Caixa, b: Caixa): Caixa => {
  const x = Math.min(a.x, b.x);
  const y = Math.min(a.y, b.y);
  return { x, y, largura: Math.max(a.x + a.largura, b.x + b.largura) - x, altura: Math.max(a.y + a.altura, b.y + b.altura) - y };
};
const mesma = (a: Caixa, b: Caixa) => Math.abs(a.x - b.x) <= TOLERANCIA && Math.abs(a.y - b.y) <= TOLERANCIA && Math.abs(a.largura - b.largura) <= TOLERANCIA && Math.abs(a.altura - b.altura) <= TOLERANCIA;

/** Junta as caixas que se tocam ou se sobrepõem (Word fatia figura em tiras). */
function juntar(caixas: Caixa[]): Caixa[] {
  const saida = [...caixas];
  for (let mudou = true; mudou; ) {
    mudou = false;
    for (let i = 0; i < saida.length && !mudou; i += 1) {
      for (let j = i + 1; j < saida.length; j += 1) {
        if (!tocam(saida[i], saida[j])) continue;
        saida[i] = unir(saida[i], saida[j]);
        saida.splice(j, 1);
        mudou = true;
        break;
      }
    }
  }
  return saida;
}

const naMargem = (c: Caixa, p: PaginaVista) => c.y >= p.altura * (1 - MARGEM) - 0.01 || c.y + c.altura <= p.altura * MARGEM + 0.01;

/** As figuras do documento, numeradas por página de cima para baixo, e as páginas digitalizadas que ficaram sem texto. */
export function figurasDoDocumento(paginas: PaginaVista[]): { figuras: Figura[]; paginasSemTexto: number[] } {
  const paginasSemTexto: number[] = [];
  const candidatas = paginas.map((p) => {
    const total = p.largura * p.altura || 1;
    // Junta antes de medir: há scanner que grava a página em tiras.
    const juntas = juntar(p.caixas);
    const digitalizada = juntas.some((c) => area(c) / total >= PAGINA_DIGITALIZADA);
    if (digitalizada && !p.camada && !p.ocrLeu) paginasSemTexto.push(p.n);
    return juntas.filter((c) => area(c) / total < PAGINA_DIGITALIZADA && area(c) / total >= AREA_MINIMA && (c.largura >= LADO_MINIMO || c.altura >= LADO_MINIMO));
  });
  // Cabeçalho e rodapé: a mesma caixa, na margem, em várias páginas.
  const repetida = (c: Caixa, p: PaginaVista) => naMargem(c, p) && candidatas.filter((cs) => cs.some((o) => mesma(o, c))).length >= REPETICOES;
  const figuras: Figura[] = [];
  paginas.forEach((p, i) => {
    const total = p.largura * p.altura || 1;
    candidatas[i]
      .filter((c) => !repetida(c, p))
      .sort((a, b) => b.y + b.altura - (a.y + a.altura) || a.x - b.x)
      .forEach((caixa, k) => figuras.push({ id: `p${p.n}-${k + 1}`, pagina: p.n, caixa, fracao: area(caixa) / total }));
  });
  return { figuras, paginasSemTexto };
}

export function marcaDeFigura(f: Figura): string {
  const pct = Math.max(5, Math.round(f.fracao * 20) * 5);
  return `[figura ${f.id}: imagem na página ${f.pagina}, cerca de ${pct}% da página; para ver: ver_imagem]`;
}

/** Páginas digitalizadas sem texto reconhecido, numa marca só. */
export function marcaDeIntervalo(paginas: number[]): string {
  if (!paginas.length) return "";
  if (paginas.length === 1) return `[página ${paginas[0]} digitalizada sem texto reconhecido; para ver: ver_imagem figura "p${paginas[0]}"]`;
  return `[páginas ${faixas(paginas)} digitalizadas sem texto reconhecido; para ver uma: ver_imagem figura "pN"]`;
}

/** Legenda de figura no começo da linha ("Gráfico 2 – ...", "Figura nº 3"). */
export const LEGENDA = /^(Figura|Gr[aá]fico|Mapa|Imagem|Foto|Fotografia|Ilustra[cç][aã]o|Quadro|Diagrama|Fluxograma)\s*(n[ºo°.]\s*)?\d+/i;

/** Gráfico desenhado (vetorial) não tem imagem dentro: a legenda é a pista. */
export function marcaDeLegenda(pagina: number, legenda: string): string {
  const curta = legenda.length > 60 ? `${legenda.slice(0, 60).trimEnd()}…` : legenda;
  return `[possível figura desenhada na página ${pagina} (legenda "${curta}"); para ver: ver_imagem figura "p${pagina}"]`;
}

export type IdFigura = { tipo: "figura"; pagina: number; indice: number } | { tipo: "pagina"; pagina: number } | { tipo: "html"; indice: number } | { tipo: "arquivo" };

/** O id que o modelo mandou; `null` quando não é nenhum dos formatos. */
export function lerIdFigura(id: string): IdFigura | null {
  const t = id.trim().toLowerCase();
  if (t === "arquivo") return { tipo: "arquivo" };
  let m = /^p(\d+)-(\d+)$/.exec(t);
  if (m) return Number(m[1]) > 0 && Number(m[2]) > 0 ? { tipo: "figura", pagina: Number(m[1]), indice: Number(m[2]) } : null;
  m = /^p(\d+)$/.exec(t);
  if (m) return Number(m[1]) > 0 ? { tipo: "pagina", pagina: Number(m[1]) } : null;
  m = /^img-(\d+)$/.exec(t);
  if (m) return Number(m[1]) > 0 ? { tipo: "html", indice: Number(m[1]) } : null;
  return null;
}

// ------------------------------------------------------------ texto com marcas

export interface LinhaLida {
  texto: string;
  /** Altura da linha na página (pontos PDF, de baixo para cima). */
  y: number;
}

/** Uma página como a leitura a entrega: texto, linhas e, se procuradas, as caixas das imagens. */
export interface PaginaComFiguras {
  n: number;
  texto: string;
  linhas: LinhaLida[];
  camada: boolean;
  ocrLeu?: boolean;
  largura: number;
  altura: number;
  /** `undefined`: a página não foi procurada (orçamento) ou a lista de operações falhou. */
  caixas?: Caixa[];
}

/** O texto da página com a marca de cada figura na linha em que ela começa, e a marca de legenda quando não há figura. */
export function textoDaPaginaComMarcas(pagina: number, linhas: LinhaLida[], figuras: Figura[]): string {
  const saida: string[] = [];
  const pendentes = [...figuras];
  for (const l of linhas) {
    while (pendentes.length && l.y <= pendentes[0].caixa.y + pendentes[0].caixa.altura) saida.push(marcaDeFigura(pendentes.shift()!));
    saida.push(l.texto);
    if (!figuras.length && LEGENDA.test(l.texto.trim())) saida.push(marcaDeLegenda(pagina, l.texto.trim()));
  }
  for (const f of pendentes) saida.push(marcaDeFigura(f));
  return saida.join("\n");
}

export function rodapeDeFiguras(total: number): string {
  return total ? `[documento com ${total} figura(s) marcada(s)]` : "";
}

/** O texto do PDF inteiro, no formato de sempre (`[página N]`), com as marcas de figura. */
/** As figuras de páginas lidas — a ÚNICA conta, usada pela marca e pelo recorte. */
export function figurasDasPaginas(paginas: PaginaComFiguras[]): ReturnType<typeof figurasDoDocumento> {
  return figurasDoDocumento(paginas.map((p) => ({ n: p.n, largura: p.largura, altura: p.altura, caixas: p.caixas ?? [], camada: p.camada, ocrLeu: Boolean(p.ocrLeu) })));
}

export function textoDoDocumentoComFiguras(paginas: PaginaComFiguras[], o: { total: number; naoProcuradasDe?: number }): string {
  const { figuras, paginasSemTexto } = figurasDasPaginas(paginas);
  // Página não procurada (além do orçamento), sem camada e sem OCR: em PDF
  // escaneado, é página que ninguém leu. Página PROCURADA sem imagem nenhuma
  // é página em branco, e fica de fora.
  const semTexto = new Set(paginasSemTexto);
  for (const p of paginas) if (p.caixas === undefined && !p.camada && !p.ocrLeu && !p.texto) semTexto.add(p.n);
  const partes = paginas.map((p) => `[página ${p.n}]\n${textoDaPaginaComMarcas(p.n, p.linhas, figuras.filter((f) => f.pagina === p.n))}`);
  if (o.total > paginas.length) partes.push(`[... ${o.total - paginas.length} páginas não lidas]`);
  const intervalo = marcaDeIntervalo([...semTexto].sort((a, b) => a - b));
  if (intervalo) partes.push(intervalo);
  if (o.naoProcuradasDe) partes.push(`[figuras não procuradas a partir da página ${o.naoProcuradasDe}]`);
  const rodape = rodapeDeFiguras(figuras.length);
  if (rodape) partes.push(rodape);
  return partes.join("\n\n");
}
