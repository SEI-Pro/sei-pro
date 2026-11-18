/**
 * Figuras dos documentos (relato da 2.9: "a IA não reconhece imagens em PDF").
 * Tudo aqui é cálculo puro: a suíte roda em Node 20, e o pdf.js 6 pede Node 22.
 */

import { caixasDasImagens, figurasDoDocumento, LEGENDA, lerIdFigura, marcaDeFigura, marcaDeIntervalo, marcaDeLegenda, type Caixa, type PaginaVista } from "../src/painel/figuras";
import { checar, secao } from "./util";

/** Os códigos do pdf.js 6.3.289 (`pdfjs.OPS`). */
const OPS = { save: 10, restore: 11, transform: 12, paintFormXObjectBegin: 74, paintFormXObjectEnd: 75, paintImageXObject: 85, paintInlineImageXObject: 86, paintImageXObjectRepeat: 88 };
const A4 = { largura: 595, altura: 842 };

/** Lista de operações a partir de pares [operação, argumentos]. */
function ops(...pares: Array<[keyof typeof OPS, unknown[]]>): [number[], unknown[][]] {
  return [pares.map(([op]) => OPS[op]), pares.map(([, a]) => a)];
}
const imagem = (m: number[]): Array<[keyof typeof OPS, unknown[]]> => [["save", []], ["transform", m], ["paintImageXObject", ["img"]], ["restore", []]];
const perto = (c: Caixa | undefined, x: number, y: number, l: number, a: number) => Boolean(c) && [c!.x - x, c!.y - y, c!.largura - l, c!.altura - a].every((d) => Math.abs(d) < 0.01);
const pagina = (n: number, caixas: Caixa[], o: Partial<PaginaVista> = {}): PaginaVista => ({ n, ...A4, caixas, camada: true, ocrLeu: false, ...o });

export function verificarFiguras(): void {
  secao("figuras: onde a imagem foi desenhada");
  {
    const [f, a] = ops(...imagem([300, 0, 0, 200, 100, 300]));
    checar("matriz da imagem vira a caixa", perto(caixasDasImagens(f, a, OPS)[0], 100, 300, 300, 200), caixasDasImagens(f, a, OPS));
  }
  {
    const [f, a] = ops(["save", []], ["transform", [2, 0, 0, 2, 0, 0]], ["restore", []], ...imagem([100, 0, 0, 50, 10, 20]));
    checar("restore desfaz a escala anterior", perto(caixasDasImagens(f, a, OPS)[0], 10, 20, 100, 50), caixasDasImagens(f, a, OPS));
  }
  {
    const [f, a] = ops(["paintFormXObjectBegin", [[1, 0, 0, 1, 50, 50], [0, 0, 100, 100]]], ...imagem([100, 0, 0, 100, 0, 0]), ["paintFormXObjectEnd", []], ...imagem([10, 0, 0, 10, 0, 0]));
    const c = caixasDasImagens(f, a, OPS);
    checar("forma desloca a imagem de dentro", perto(c[0], 50, 50, 100, 100), c);
    checar("e o fim da forma desfaz", perto(c[1], 0, 0, 10, 10), c);
  }
  {
    const [f, a] = ops(...imagem([0, 200, -300, 0, 400, 100]));
    checar("imagem girada 90 graus", perto(caixasDasImagens(f, a, OPS)[0], 100, 100, 300, 200), caixasDasImagens(f, a, OPS));
    const [f2, a2] = ops(...imagem([-300, 0, 0, -200, 400, 500]));
    checar("imagem espelhada", perto(caixasDasImagens(f2, a2, OPS)[0], 100, 300, 300, 200), caixasDasImagens(f2, a2, OPS));
  }
  {
    const [f, a] = ops(["transform", [1, 0, 0, 1, 0, 0]], ["paintImageXObjectRepeat", ["img", 50, 40, [0, 0, 100, 0]]]);
    const c = caixasDasImagens(f, a, OPS);
    checar("imagem repetida: uma caixa por posicao", c.length === 2 && perto(c[1], 100, 0, 50, 40), c);
  }
  {
    const [f, a] = ops(["transform", [1, 0, 0, 1, 0, 0]], ["paintInlineImageXObject", [{}]]);
    checar("imagem embutida tambem conta", caixasDasImagens(f, a, OPS).length === 1);
  }

  secao("figuras: o que vira figura");
  {
    const grande = { x: 100, y: 300, largura: 300, altura: 200 };
    const { figuras } = figurasDoDocumento([pagina(1, [{ x: 20, y: 400, largura: 30, altura: 30 }, grande])]);
    checar("icone pequeno fica de fora", figuras.length === 1, figuras);
    checar("figura grande entra, com a fracao da pagina", Math.abs((figuras[0]?.fracao ?? 0) - 0.12) < 0.01, figuras);
    const faixa = figurasDoDocumento([pagina(1, [{ x: 0, y: 400, largura: 595, altura: 15 }])]).figuras;
    checar("faixa fina com menos de 3% fica de fora", faixa.length === 0, faixa);
  }
  {
    const cabecalho = { x: 40, y: 760, largura: 515, altura: 60 };
    const em3 = figurasDoDocumento([1, 2, 3].map((n) => pagina(n, [cabecalho]))).figuras;
    checar("cabecalho repetido em 3 paginas fica de fora", em3.length === 0, em3);
    const em2 = figurasDoDocumento([1, 2].map((n) => pagina(n, [cabecalho]))).figuras;
    checar("repetido em 2 paginas continua", em2.length === 2, em2);
    const foto = { x: 60, y: 250, largura: 470, altura: 350 };
    const relatorio = figurasDoDocumento([1, 2, 3, 4, 5].map((n) => pagina(n, [foto]))).figuras;
    checar("foto no meio de cada pagina (relatorio fotografico) continua", relatorio.length === 5, relatorio);
  }
  {
    const fatias = [0, 1, 2].map((i) => ({ x: 100, y: 300 + i * 60, largura: 300, altura: 60 }));
    const { figuras } = figurasDoDocumento([pagina(1, fatias)]);
    checar("fatias que se tocam viram uma figura", figuras.length === 1 && perto(figuras[0]?.caixa, 100, 300, 300, 180), figuras);
  }
  {
    const baixo = { x: 100, y: 100, largura: 300, altura: 200 };
    const alto = { x: 100, y: 500, largura: 300, altura: 200 };
    const { figuras } = figurasDoDocumento([pagina(3, [baixo, alto])]);
    checar("de cima para baixo: a de cima e p3-1", figuras[0]?.id === "p3-1" && figuras[0]?.caixa.y === 500 && figuras[1]?.id === "p3-2", figuras);
  }
  {
    const inteira = { x: 0, y: 0, largura: 595, altura: 842 };
    const semTexto = figurasDoDocumento([pagina(7, [inteira], { camada: false })]);
    checar("pagina digitalizada nao vira figura", semTexto.figuras.length === 0, semTexto);
    checar("e, sem texto reconhecido, entra na lista", semTexto.paginasSemTexto.join() === "7", semTexto);
    const lida = figurasDoDocumento([pagina(7, [inteira], { camada: false, ocrLeu: true })]);
    checar("lida pelo OCR, nao entra", lida.paginasSemTexto.length === 0 && lida.figuras.length === 0, lida);
    const tiras = [0, 1, 2].map((i) => ({ x: 0, y: i * 280.67, largura: 595, altura: 280.67 }));
    const emTiras = figurasDoDocumento([pagina(8, tiras, { camada: false })]);
    checar("pagina escaneada em tiras tambem e digitalizada", emTiras.figuras.length === 0 && emTiras.paginasSemTexto.join() === "8", emTiras);
    const comCamada = figurasDoDocumento([pagina(7, [{ x: 10, y: 10, largura: 575, altura: 822 }])]);
    checar("escaneada com camada de texto: nem figura nem pagina sem texto", comCamada.figuras.length === 0 && comCamada.paginasSemTexto.length === 0, comCamada);
  }

  secao("figuras: marcas no texto");
  {
    const f = { id: "p3-1", pagina: 3, caixa: { x: 0, y: 0, largura: 1, altura: 1 }, fracao: 0.4 };
    checar("marca de figura", marcaDeFigura(f) === "[figura p3-1: imagem na página 3, cerca de 40% da página; para ver: ver_imagem]", marcaDeFigura(f));
    checar("fracao arredonda para 5%", marcaDeFigura({ ...f, fracao: 0.12 }).includes("cerca de 10%"), marcaDeFigura({ ...f, fracao: 0.12 }));
    checar("figura pequena nao vira 0%", marcaDeFigura({ ...f, fracao: 0.031 }).includes("cerca de 5%"), marcaDeFigura({ ...f, fracao: 0.031 }));
    checar("uma pagina digitalizada", marcaDeIntervalo([7]) === '[página 7 digitalizada sem texto reconhecido; para ver: ver_imagem figura "p7"]', marcaDeIntervalo([7]));
    checar("varias, por intervalo", marcaDeIntervalo([6, 7, 8, 10]) === '[páginas 6–8, 10 digitalizadas sem texto reconhecido; para ver uma: ver_imagem figura "pN"]', marcaDeIntervalo([6, 7, 8, 10]));
    checar("nenhuma, nada", marcaDeIntervalo([]) === "");
    checar("marca por legenda", marcaDeLegenda(3, "Gráfico 2 – Movimentação") === '[possível figura desenhada na página 3 (legenda "Gráfico 2 – Movimentação"); para ver: ver_imagem figura "p3"]', marcaDeLegenda(3, "Gráfico 2 – Movimentação"));
    checar("legenda longa e cortada", marcaDeLegenda(3, `Figura 1 ${"x".repeat(200)}`).length < 160);
    checar("legenda: Grafico 2", LEGENDA.test("Gráfico 2 – Movimentação"));
    checar("legenda: Figura nº 3", LEGENDA.test("Figura nº 3 - Mapa"));
    checar("legenda: FOTO 1", LEGENDA.test("FOTO 1"));
    checar("legenda: Fotografia 2", LEGENDA.test("Fotografia 2: cais"));
    checar("nao e legenda: Figura de linguagem", !LEGENDA.test("Figura de linguagem"));
    checar("nao e legenda: Quadro de pessoal", !LEGENDA.test("Quadro de pessoal"));
  }

  secao("figuras: ids que o modelo manda");
  checar("p3-1", JSON.stringify(lerIdFigura("p3-1")) === JSON.stringify({ tipo: "figura", pagina: 3, indice: 1 }));
  checar("p7", JSON.stringify(lerIdFigura("p7")) === JSON.stringify({ tipo: "pagina", pagina: 7 }));
  checar("img-2", JSON.stringify(lerIdFigura("img-2")) === JSON.stringify({ tipo: "html", indice: 2 }));
  checar("arquivo", lerIdFigura("arquivo")?.tipo === "arquivo");
  checar("com espaco e maiuscula", lerIdFigura(" P3-1 ")?.tipo === "figura");
  checar("invalidos", lerIdFigura("x") === null && lerIdFigura("p0") === null && lerIdFigura("img-0") === null && lerIdFigura("p3-0") === null);
}
