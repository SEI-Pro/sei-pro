/**
 * Geometria do tarjamento.
 *
 * ESTE É O ÚNICO MÓDULO DO PROJETO QUE FAZ MATEMÁTICA DE MATRIZ, e a
 * concentração é deliberada: um erro de sinal aqui não produz arquivo torto,
 * produz arquivo que PARECE certo e ainda contém o dado. A tarja preta é
 * desenhada por coordenada e sempre aparece no lugar certo; o que se desloca é
 * a decisão sobre qual texto sobrevive. Espalhar essa conta por quatro arquivos
 * garantiria que um deles divergisse em silêncio.
 *
 * O ESPAÇO CANÔNICO é o espaço do usuário do PDF: pontos, Y crescendo para
 * cima, origem no canto inferior esquerdo do MediaBox — inclusive quando o
 * MediaBox não começa em (0,0). Toda `Caixa` deste projeto está nele.
 *
 * Isso não é escolha arbitrária, é o que o pdf.js já entrega. Verificado no
 * pacote instalado (5.6.205):
 *
 *   - `pdf.mjs:14333` — a TextLayer monta `[1, 0, 0, -1, -pageX, pageY +
 *     pageHeight]` a partir de `viewport.rawDims` e aplica isso sobre
 *     `item.transform`. Ou seja, `item.transform` JÁ está em espaço do usuário
 *     absoluto, com o deslocamento do view box incluído, e sem rotação.
 *   - `pdf.worker.mjs:35791` — `transform` é a matriz de renderização de texto,
 *     `height = hypot(trm[2], trm[3])` e `width` acumula o avanço em unidades
 *     do usuário.
 *
 * Consequência prática, e é a defesa nº 1 do desenho: se a página for
 * rasterizada com `rotation: 0`, as coordenadas do item vão direto para o `Tm`
 * da camada invisível, sem nenhuma conversão. Não há erro de sinal possível
 * onde não há operação.
 */

/** Matriz afim do PDF: [a b c d e f], convenção de vetor-linha. */
export type Matriz = readonly [number, number, number, number, number, number];

export const IDENTIDADE: Matriz = [1, 0, 0, 1, 0, 0];

/** Retângulo alinhado aos eixos, em pontos do espaço do usuário. */
export interface Caixa {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/** O que `getTextContent()` devolve, reduzido ao que a geometria precisa. */
export interface ItemDeTexto {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName?: string;
}

function finito(...valores: number[]): boolean {
  return valores.every((v) => Number.isFinite(v));
}

/** Aplica a matriz a um ponto. Convenção de vetor-linha: [x y 1] × M. */
export function aplicar(m: Matriz, x: number, y: number): [number, number] {
  return [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
}

/** Compõe duas matrizes: o resultado aplica `primeira` e depois `segunda`. */
export function compor(primeira: Matriz, segunda: Matriz): Matriz {
  return [
    primeira[0] * segunda[0] + primeira[1] * segunda[2],
    primeira[0] * segunda[1] + primeira[1] * segunda[3],
    primeira[2] * segunda[0] + primeira[3] * segunda[2],
    primeira[2] * segunda[1] + primeira[3] * segunda[3],
    primeira[4] * segunda[0] + primeira[5] * segunda[2] + segunda[4],
    primeira[4] * segunda[1] + primeira[5] * segunda[3] + segunda[5],
  ];
}

/** Inverte a matriz. Devolve null quando ela é degenerada (determinante ~0). */
export function inverter(m: Matriz): Matriz | null {
  const det = m[0] * m[3] - m[1] * m[2];
  if (!Number.isFinite(det) || Math.abs(det) < 1e-12) return null;
  const a = m[3] / det;
  const b = -m[1] / det;
  const c = -m[2] / det;
  const d = m[0] / det;
  return [a, b, c, d, -(m[4] * a + m[5] * c), -(m[4] * b + m[5] * d)];
}

/** Menor caixa alinhada aos eixos que contém todos os pontos. */
export function caixaDePontos(pontos: Array<[number, number]>): Caixa | null {
  if (pontos.length === 0) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const [x, y] of pontos) {
    if (!finito(x, y)) return null;
    if (x < x0) x0 = x;
    if (y < y0) y0 = y;
    if (x > x1) x1 = x;
    if (y > y1) y1 = y;
  }
  return { x0, y0, x1, y1 };
}

/**
 * Transforma a caixa e devolve o AABB do resultado.
 *
 * Os quatro cantos são mapeados, e não só dois: sob rotação ou inclinação, o
 * retângulo deixa de ser alinhado aos eixos, e mapear apenas os cantos opostos
 * produziria uma caixa MENOR que a real — que aqui significaria deixar de
 * descartar um texto que encosta na tarja.
 */
export function transformarCaixa(m: Matriz, c: Caixa): Caixa | null {
  return caixaDePontos([
    aplicar(m, c.x0, c.y0),
    aplicar(m, c.x1, c.y0),
    aplicar(m, c.x1, c.y1),
    aplicar(m, c.x0, c.y1),
  ]);
}

/** Garante x0<=x1 e y0<=y1. Retângulo desenhado "de trás para frente" é comum. */
export function normalizar(c: Caixa): Caixa {
  return {
    x0: Math.min(c.x0, c.x1),
    y0: Math.min(c.y0, c.y1),
    x1: Math.max(c.x0, c.x1),
    y1: Math.max(c.y0, c.y1),
  };
}

/** Expande a caixa em todas as direções. Margem negativa encolhe. */
export function dilatar(c: Caixa, margem: number): Caixa {
  return { x0: c.x0 - margem, y0: c.y0 - margem, x1: c.x1 + margem, y1: c.y1 + margem };
}

/** Há sobreposição de área? Encostar apenas na borda não conta. */
export function seIntersectam(a: Caixa, b: Caixa): boolean {
  return a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
}

/** `externa` contém `interna` por inteiro? */
export function contem(externa: Caixa, interna: Caixa): boolean {
  return (
    externa.x0 <= interna.x0 &&
    externa.y0 <= interna.y0 &&
    externa.x1 >= interna.x1 &&
    externa.y1 >= interna.y1
  );
}

export function larguraDe(c: Caixa): number {
  return c.x1 - c.x0;
}

export function alturaDe(c: Caixa): number {
  return c.y1 - c.y0;
}

export function centroDe(c: Caixa): [number, number] {
  return [(c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2];
}

/**
 * Fração da altura da fonte acima da linha de base coberta pela caixa.
 * Folgado de propósito: 1,15 cobre acentos maiúsculos do português (Ã, Ç com
 * cedilha alta em algumas fontes) que estouram o ascendente nominal.
 */
const ACIMA_DA_BASE = 1.15;

/** Fração da altura da fonte abaixo da linha de base (descendente de g, p, q). */
const ABAIXO_DA_BASE = 0.25;

/**
 * Caixa de um item de texto do `getTextContent()`.
 *
 * DEVOLVE `null` QUANDO HÁ QUALQUER DÚVIDA, e quem chama trata `null` como
 * "descartar este item". Essa é a regra mais importante do módulo: não existe
 * caminho em que a incerteza resulte em MANTER o texto. Descartar por engano
 * custa uma palavra que deixa de ser pesquisável; manter por engano custa o
 * vazamento que a ferramenta existe para evitar.
 *
 * A caixa é construída pelos quatro cantos do retângulo do texto no seu próprio
 * referencial (direção da linha de base × direção vertical do glifo), e não por
 * largura e altura no eixo da página. Assim texto girado, inclinado e espelhado
 * saem certos sem caso especial — e texto girado é exatamente o que aparece em
 * carimbo diagonal e em tabela em retrato dentro de página em paisagem.
 *
 * As frações recortam o item ao longo da linha de base, para o caso em que a
 * detecção casou apenas parte dele. Sem argumento, devolve o item inteiro.
 */
export function caixaDoItemDeTexto(
  item: ItemDeTexto,
  fracaoInicio = 0,
  fracaoFim = 1,
): Caixa | null {
  if (typeof item.str !== "string" || item.str.trim().length === 0) return null;

  const t = item.transform;
  if (!Array.isArray(t) || t.length < 6) return null;
  const [a, b, c, d, e, f] = t;
  if (!finito(a, b, c, d, e, f, item.width, item.height)) return null;

  // Altura do glifo: o módulo do vetor vertical da matriz de texto. É o mesmo
  // valor que o pdf.js publica em `item.height` (pdf.worker.mjs:35794); usamos
  // o maior dos dois para não subestimar a caixa.
  const alturaVetor = Math.hypot(c, d);
  const altura = Math.max(alturaVetor, Math.abs(item.height));
  if (!(altura > 0)) return null;

  const normaBase = Math.hypot(a, b);
  if (!(normaBase > 0)) return null;

  // Direção da linha de base e direção "para cima" do glifo.
  const ux = a / normaBase;
  const uy = b / normaBase;
  const vx = c / alturaVetor;
  const vy = d / alturaVetor;
  if (!finito(ux, uy, vx, vy)) return null;

  const largura = Math.abs(item.width);
  if (!(largura > 0)) return null;

  // Recorte proporcional ao longo da linha de base, para quando só um pedaço
  // do item foi casado. A estimativa por fração de caractere é grosseira em
  // fonte proporcional — daí a folga somada por quem chama, e daí a preferência
  // por usar o item inteiro sempre que o casamento o cobre por completo.
  const i0 = Math.max(0, Math.min(1, fracaoInicio));
  const i1 = Math.max(i0, Math.min(1, fracaoFim));
  const inicio = largura * i0;
  const extensao = largura * (i1 - i0);
  if (!(extensao > 0)) return null;

  const baseX = e + ux * inicio - vx * ABAIXO_DA_BASE * altura;
  const baseY = f + uy * inicio - vy * ABAIXO_DA_BASE * altura;
  const cima = ACIMA_DA_BASE * altura;

  return caixaDePontos([
    [baseX, baseY],
    [baseX + ux * extensao, baseY + uy * extensao],
    [baseX + ux * extensao + vx * cima, baseY + uy * extensao + vy * cima],
    [baseX + vx * cima, baseY + vy * cima],
  ]);
}

/**
 * Margem fixa somada a toda tarja antes do teste de interseção.
 *
 * O teste roda sobre a tarja DILATADA e a pintura roda sobre a tarja original,
 * então a área testada sempre contém a área pintada — invariante conferida em
 * tempo de execução por `conferirInvarianteDeMargem`. A folga existe porque a
 * caixa de um item é uma aproximação: sem ela, um glifo que encosta na borda
 * sobrevive e reaparece como um fio de tinta na ampliação.
 */
export const MARGEM_EXCLUSAO_PT = 2;

/** Fração da altura da fonte somada à margem fixa, para texto grande. */
export const MARGEM_EXCLUSAO_RELATIVA = 0.25;

/** A tarja usada no teste de sobrevivência de um item daquela altura de fonte. */
export function tarjaDilatada(tarja: Caixa, alturaDaFonte: number): Caixa {
  const extra = Number.isFinite(alturaDaFonte) ? Math.max(0, alturaDaFonte) : 0;
  return dilatar(tarja, MARGEM_EXCLUSAO_PT + MARGEM_EXCLUSAO_RELATIVA * extra);
}

/**
 * Invariante de segurança: a área testada contém a área pintada.
 *
 * É asserção em tempo de execução e não comentário porque é exatamente o tipo
 * de propriedade que uma "simplificação" futura quebra sem que nenhum teste
 * visual perceba.
 */
export function conferirInvarianteDeMargem(pintada: Caixa, testada: Caixa): void {
  if (!contem(testada, pintada)) {
    throw new Error(
      "invariante violada: a área testada para descarte de texto não contém a área pintada",
    );
  }
}

// ---------------------------------------------------------------------------
// Conversão entre espaço do usuário e a página EXIBIDA
// ---------------------------------------------------------------------------

/** O retângulo visível da página: CropBox ∩ MediaBox, em pontos. */
export type ViewBox = readonly [number, number, number, number];

/**
 * Matriz do viewport, transcrita do `PageViewport` do pdf.js.
 *
 * Reproduz `pdf.mjs:1241-1287` para escala 1 e deslocamento zero. Existe para
 * que a interface consiga posicionar uma marcação numa página que ainda NÃO
 * foi renderizada — sem isso, as marcações precisariam esperar o `pdf.js`
 * devolver a página, e sumiriam da tela ao rolar o documento, o que o usuário
 * leria como "a marcação foi removida".
 *
 * Transcrever é dívida, e está assumida como tal: a conferência contra o
 * comportamento real é feita por invariantes no script de verificação (os
 * cantos do viewBox têm de cair exatamente nos cantos do viewport, e a ida e
 * volta tem de fechar).
 */
export function matrizDeViewport(view: ViewBox, giro: number, escala = 1): Matriz {
  const rotacao = ((Math.round(giro / 90) * 90) % 360 + 360) % 360;

  let rA: number;
  let rB: number;
  let rC: number;
  let rD: number;
  switch (rotacao) {
    case 180:
      [rA, rB, rC, rD] = [-1, 0, 0, 1];
      break;
    case 90:
      [rA, rB, rC, rD] = [0, 1, 1, 0];
      break;
    case 270:
      [rA, rB, rC, rD] = [0, -1, -1, 0];
      break;
    default:
      [rA, rB, rC, rD] = [1, 0, 0, -1];
  }

  const centroX = (view[0] + view[2]) / 2;
  const centroY = (view[1] + view[3]) / 2;

  const deslocX =
    rA === 0
      ? Math.abs(centroY - view[1]) * escala
      : Math.abs(centroX - view[0]) * escala;
  const deslocY =
    rA === 0
      ? Math.abs(centroX - view[0]) * escala
      : Math.abs(centroY - view[1]) * escala;

  return [
    rA * escala,
    rB * escala,
    rC * escala,
    rD * escala,
    deslocX - rA * escala * centroX - rC * escala * centroY,
    deslocY - rB * escala * centroX - rD * escala * centroY,
  ];
}

/** Dimensões do viewport exibido, em pontos. */
export function tamanhoDoViewport(
  view: ViewBox,
  giro: number,
): { largura: number; altura: number } {
  const rotacao = ((Math.round(giro / 90) * 90) % 360 + 360) % 360;
  const l = view[2] - view[0];
  const a = view[3] - view[1];
  return rotacao === 90 || rotacao === 270
    ? { largura: a, altura: l }
    : { largura: l, altura: a };
}

/** Retângulo em frações 0..1 do viewport exibido, pronto para virar CSS. */
export interface FracaoDoViewport {
  esquerda: number;
  topo: number;
  largura: number;
  altura: number;
}

/** Espaço do usuário -> fração do viewport exibido. */
export function paraFracaoDoViewport(
  caixa: Caixa,
  view: ViewBox,
  giro: number,
): FracaoDoViewport | null {
  const m = matrizDeViewport(view, giro);
  const convertida = transformarCaixa(m, caixa);
  if (!convertida) return null;
  const { largura, altura } = tamanhoDoViewport(view, giro);
  if (!(largura > 0) || !(altura > 0)) return null;
  return {
    esquerda: convertida.x0 / largura,
    topo: convertida.y0 / altura,
    largura: (convertida.x1 - convertida.x0) / largura,
    altura: (convertida.y1 - convertida.y0) / altura,
  };
}

/** Fração do viewport exibido -> espaço do usuário. É o caminho do retângulo desenhado. */
export function deFracaoDoViewport(
  fracao: FracaoDoViewport,
  view: ViewBox,
  giro: number,
): Caixa | null {
  const m = matrizDeViewport(view, giro);
  const inversa = inverter(m);
  if (!inversa) return null;
  const { largura, altura } = tamanhoDoViewport(view, giro);
  const emPixels: Caixa = {
    x0: fracao.esquerda * largura,
    y0: fracao.topo * altura,
    x1: (fracao.esquerda + fracao.largura) * largura,
    y1: (fracao.topo + fracao.altura) * altura,
  };
  return transformarCaixa(inversa, emPixels);
}
