/**
 * Figuras dos documentos (relato da 2.9: "a IA não reconhece imagens em PDF").
 * Tudo aqui é cálculo puro: a suíte roda em Node 20, e o pdf.js 6 pede Node 22.
 */

import { lerPagina, ORCAMENTO_FIGURAS, orcamentoDeFiguras } from "../src/painel/pdf";
import { caixasDasImagens, figurasDoDocumento, LEGENDA, rodapeDeFiguras, textoDaPaginaComMarcas, textoDoDocumentoComFiguras, lerIdFigura, marcaDeFigura, marcaDeIntervalo, marcaDeLegenda, type Caixa, type PaginaVista } from "../src/painel/figuras";
import { imagemDoHtml, textoDoHtmlComOcultos } from "@nucleo/dominio/editor";
import { figuraNoDocumento, opcoesDeRender, reduzir, retanguloEmPixels } from "../src/painel/imagem";
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

export async function verificarFiguras(): Promise<void> {
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
    checar("legenda sem acento (PDF antigo, OCR): Grafico 2", LEGENDA.test("Grafico 2 - Movimentacao") && LEGENDA.test("Ilustracao 4"));
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

  secao("figuras: marca dentro do texto da pagina");
  {
    const linhas = [{ texto: "Titulo", y: 780 }, { texto: "Paragrafo depois", y: 500 }, { texto: "Fim", y: 200 }];
    const f = { id: "p1-1", pagina: 1, caixa: { x: 100, y: 300, largura: 300, altura: 200 }, fracao: 0.12 };
    const t = textoDaPaginaComMarcas(1, linhas, [f]);
    checar("a marca sai entre a linha de cima e a de baixo da figura", t === `Titulo\n${marcaDeFigura(f)}\nParagrafo depois\nFim`, t);
    const baixo = { ...f, caixa: { x: 100, y: 20, largura: 300, altura: 100 } };
    checar("figura abaixo de todo o texto: marca no fim", textoDaPaginaComMarcas(1, linhas, [baixo]).endsWith(marcaDeFigura(baixo)));
    const comLegenda = textoDaPaginaComMarcas(3, [{ texto: "Texto", y: 700 }, { texto: "Gráfico 2 – Movimentação", y: 400 }, { texto: "Fonte: ANTAQ", y: 380 }], []);
    checar("sem figura, a legenda gera a marca logo depois dela", comLegenda === `Texto\nGráfico 2 – Movimentação\n${marcaDeLegenda(3, "Gráfico 2 – Movimentação")}\nFonte: ANTAQ`, comLegenda);
    const legendaComFigura = textoDaPaginaComMarcas(1, [{ texto: "Figura 1 - Mapa", y: 250 }], [f]);
    checar("com figura marcada, a legenda nao gera outra marca", !legendaComFigura.includes("poss\u00EDvel figura"), legendaComFigura);
    checar("rodape sem figura e vazio", rodapeDeFiguras(0) === "");
    checar("rodape com figuras", rodapeDeFiguras(2) === "[documento com 2 figura(s) marcada(s)]");
  }

  secao("figuras: leitura de uma pagina do pdf.js");
  {
    const OPS_REAIS = { ...OPS };
    const itens = [
      { str: "Linha um", hasEOL: true, transform: [1, 0, 0, 1, 50, 780] },
      { str: "Linha", hasEOL: false, transform: [1, 0, 0, 1, 50, 200] },
      { str: "  dois", hasEOL: true, transform: [1, 0, 0, 1, 90, 200] },
    ];
    const [fnArray, argsArray] = ops(...imagem([300, 0, 0, 200, 100, 300]));
    const pag = { view: [0, 0, 595, 842], getTextContent: async () => ({ items: itens }), getOperatorList: async () => ({ fnArray, argsArray }) };
    const lida = await lerPagina(pag, 1, OPS_REAIS);
    checar("linhas com a altura da primeira palavra", JSON.stringify(lida.linhas) === JSON.stringify([{ texto: "Linha um", y: 780 }, { texto: "Linha dois", y: 200 }]), lida.linhas);
    checar("texto como antes (espacos juntados)", lida.texto === "Linha um\nLinha dois", lida.texto);
    checar("caixas da pagina", lida.caixas?.length === 1 && lida.largura === 595 && lida.altura === 842, lida);
    const deslocada = await lerPagina({ ...pag, view: [0, 100, 595, 942] }, 1, OPS_REAIS);
    checar("pagina com origem deslocada: caixa relativa a pagina", deslocada.caixas?.[0]?.y === 200, deslocada.caixas);
    const quebrada = await lerPagina({ ...pag, getOperatorList: async () => { throw new Error("fonte faltando"); } }, 1, OPS_REAIS);
    checar("lista de operacoes que falha: texto igual, sem caixas", quebrada.texto === lida.texto && quebrada.caixas === undefined, quebrada);
    let limpou = 0;
    await lerPagina({ ...pag, cleanup: () => void (limpou += 1) }, 1, OPS_REAIS);
    checar("libera a pagina depois da lista de operacoes (memoria do escaneado)", limpou === 1, limpou);
    const semProcurar = await lerPagina(pag, 1, null);
    checar("sem procurar: nao chama a lista de operacoes", semProcurar.caixas === undefined && semProcurar.texto === lida.texto);
  }

  secao("figuras: documento inteiro");
  {
    const base = { linhas: [{ texto: "texto", y: 700 }], texto: "texto", camada: true, ocrLeu: false, largura: 595, altura: 842 };
    const paginas = [
      { ...base, n: 1, caixas: [{ x: 100, y: 300, largura: 300, altura: 200 }] },
      { ...base, n: 2, caixas: [] },
      { ...base, n: 3, caixas: undefined },
    ];
    const t = textoDoDocumentoComFiguras(paginas, { total: 3, naoProcuradasDe: 3 });
    checar("cada pagina com o rotulo de sempre", t.startsWith("[p\u00E1gina 1]\ntexto") && t.includes("[p\u00E1gina 2]\ntexto"), t);
    checar("a figura da pagina 1 marcada", t.includes("[figura p1-1:"), t);
    checar("aviso das paginas nao procuradas", t.includes("[figuras n\u00E3o procuradas a partir da p\u00E1gina 3]"), t);
    checar("rodape", t.trimEnd().endsWith("[documento com 1 figura(s) marcada(s)]"), t);
    const alem = textoDoDocumentoComFiguras(paginas.slice(0, 2), { total: 250 });
    checar("paginas alem do limite de leitura avisadas como antes", alem.includes("[... 248 p\u00E1ginas n\u00E3o lidas]"), alem);
    const misto = textoDoDocumentoComFiguras(
      [
        { ...base, n: 1, caixas: [] },
        { ...base, n: 2, texto: "", linhas: [], camada: false, caixas: [{ x: 0, y: 0, largura: 595, altura: 842 }] },
        { ...base, n: 3, texto: "", linhas: [], camada: false, caixas: [{ x: 0, y: 0, largura: 595, altura: 842 }] },
      ],
      { total: 3 },
    );
    checar("pdf misto: paginas escaneadas sem texto numa marca so", misto.includes('[p\u00E1ginas 2\u20133 digitalizadas sem texto reconhecido; para ver uma: ver_imagem figura "pN"]'), misto);
    checar("e sem rodape de figuras", !misto.includes("figura(s) marcada(s)"), misto);
    const longo = textoDoDocumentoComFiguras(
      [
        { ...base, n: 1, texto: "", linhas: [], camada: false, caixas: [{ x: 0, y: 0, largura: 595, altura: 842 }], ocrLeu: true },
        { ...base, n: 2, texto: "", linhas: [], camada: false, caixas: [{ x: 0, y: 0, largura: 595, altura: 842 }] },
        { ...base, n: 3, texto: "", linhas: [], camada: false, caixas: undefined },
      ],
      { total: 3, naoProcuradasDe: 3 },
    );
    checar("escaneado longo: pagina sem texto alem do orcamento tambem entra", longo.includes("[p\u00E1ginas 2\u20133 digitalizadas"), longo);
    const branca = textoDoDocumentoComFiguras([{ ...base, n: 1 }, { ...base, n: 2, texto: "", linhas: [], camada: false, caixas: [] }], { total: 2 });
    checar("pagina em branco procurada nao vira digitalizada", !branca.includes("digitalizada"), branca);
  }

  secao("figuras: orcamento de busca");
  {
    // Revisao final, item 5: o texto da leitura nao pode depender do relogio
    // (a continuacao por `inicio` re-extrai o PDF e emendaria fatias diferentes).
    checar("orcamento so por paginas (60), sem tempo", ORCAMENTO_FIGURAS.maxPaginas === 60 && !("maxMs" in ORCAMENTO_FIGURAS), ORCAMENTO_FIGURAS);
    const procura = orcamentoDeFiguras({ maxPaginas: 2 });
    checar("procura nas primeiras paginas", procura(1) && procura(2));
    checar("para depois do limite de paginas", !procura(3));
  }

  secao("figuras: documento do editor do SEI");
  {
    const png = "data:image/png;base64,iVBORw0KGgo=";
    const html = `<p>Antes</p><p><img src="${png}" width="640" height="480"></p><p><img src="${png}"></p><p><img src="${png}" width="20" height="20"><img src="data:image/jpeg;base64,/9j/4AAQ" style="width: 300px; height: 200px"></p><p><img src="https://exemplo.gov.br/a.png"></p><p>Depois</p>`;
    const r = textoDoHtmlComOcultos(html, { marcarImagens: true });
    checar("imagem com tamanho declarado", r.texto.includes("[figura img-1: imagem no corpo do documento, 640\u00D7480 px; para ver: ver_imagem]"), r.texto);
    checar("imagem sem tamanho", r.texto.includes("[figura img-2: imagem no corpo do documento; para ver: ver_imagem]"), r.texto);
    checar("imagem minuscula fica de fora, e a numeracao segue", !r.texto.includes("img-3") && r.texto.includes("[figura img-4: imagem no corpo do documento, 300\u00D7200 px; para ver: ver_imagem]"), r.texto);
    checar("imagem de fora do documento sinalizada", r.texto.includes("[imagem externa ao documento, n\u00E3o lida]"), r.texto);
    checar("o texto em volta continua", r.texto.startsWith("Antes") && r.texto.endsWith("Depois"), r.texto);
    checar("conta as marcadas", r.imagens === 3, r.imagens);
    const sem = textoDoHtmlComOcultos(html);
    checar("sem a opcao, o texto e o de sempre", sem.texto === "Antes\nDepois" && sem.imagens === undefined, sem);
    checar("a segunda imagem do documento", JSON.stringify(imagemDoHtml(html, 2)) === JSON.stringify({ tipo: "image/png", base64: "iVBORw0KGgo=" }), imagemDoHtml(html, 2));
    checar("a quarta (jpeg)", imagemDoHtml(html, 4)?.tipo === "image/jpeg");
    checar("a que nao existe", imagemDoHtml(html, 9) === null);
  }

  secao("figuras: recorte em pixels");
  {
    const c = { x: 100, y: 300, largura: 300, altura: 200 };
    const igual = (r: { x: number; y: number; largura: number; altura: number }, x: number, y: number, l: number, a: number) => [r.x - x, r.y - y, r.largura - l, r.altura - a].every((d) => Math.abs(d) < 0.5);
    // Valores medidos com o pdf.js 6.3.289 (convertToViewportPoint, escala 2, A4).
    checar("sem rotacao", igual(retanguloEmPixels(c, { ...A4, rotacao: 0 }, 2, 0), 200, 684, 600, 400), retanguloEmPixels(c, { ...A4, rotacao: 0 }, 2, 0));
    checar("pagina girada 90", igual(retanguloEmPixels(c, { ...A4, rotacao: 90 }, 2, 0), 600, 200, 400, 600), retanguloEmPixels(c, { ...A4, rotacao: 90 }, 2, 0));
    checar("pagina girada 180", igual(retanguloEmPixels(c, { ...A4, rotacao: 180 }, 2, 0), 390, 600, 600, 400), retanguloEmPixels(c, { ...A4, rotacao: 180 }, 2, 0));
    checar("pagina girada 270", igual(retanguloEmPixels(c, { ...A4, rotacao: 270 }, 2, 0), 684, 390, 400, 600), retanguloEmPixels(c, { ...A4, rotacao: 270 }, 2, 0));
    const comMargem = retanguloEmPixels(c, { ...A4, rotacao: 0 }, 1);
    checar("margem de 2% da pagina em volta", igual(comMargem, 100 - 11.9, 842 - 500 - 16.84, 300 + 23.8, 200 + 33.68), comMargem);
    const naBorda = retanguloEmPixels({ x: 0, y: 0, largura: 595, altura: 100 }, { ...A4, rotacao: 0 }, 1);
    checar("a margem nao sai da pagina", naBorda.x === 0 && naBorda.y + naBorda.altura <= 842 + 0.01 && naBorda.largura <= 595 + 0.01, naBorda);
    checar("reduz o lado maior a 1536", JSON.stringify(reduzir(3000, 1500)) === JSON.stringify({ largura: 1536, altura: 768 }));
    // Com intenção de tela, o pdf.js espera o requestAnimationFrame, que o
    // navegador pausa em aba escondida: o recorte travava (visto no Chrome real).
    checar("render sem requestAnimationFrame (intencao de impressao)", opcoesDeRender({} as never, {}, {} as never).intent === "print");
    checar("imagem pequena fica como esta", JSON.stringify(reduzir(800, 600)) === JSON.stringify({ largura: 800, altura: 600 }));
  }

  secao("figuras: o recorte acha a figura que a leitura marcou");
  {
    const base = { linhas: [], texto: "x", camada: true, largura: 595, altura: 842 };
    const paginas = [
      { ...base, n: 1, caixas: [{ x: 40, y: 760, largura: 515, altura: 60 }] },
      { ...base, n: 2, caixas: [{ x: 40, y: 760, largura: 515, altura: 60 }, { x: 100, y: 100, largura: 300, altura: 200 }, { x: 100, y: 450, largura: 300, altura: 200 }] },
      { ...base, n: 3, caixas: [{ x: 40, y: 760, largura: 515, altura: 60 }] },
    ];
    const marcado = textoDoDocumentoComFiguras(paginas, { total: 3 });
    const alvo = figuraNoDocumento(paginas, { tipo: "figura", pagina: 2, indice: 2 });
    checar("a leitura marcou p2-1 e p2-2, sem o cabecalho", marcado.includes("[figura p2-1:") && marcado.includes("[figura p2-2:") && !marcado.includes("p1-1"), marcado);
    checar("p2-2 e a de baixo, como na marca", alvo.y === 100, alvo);
    let erro = "";
    try {
      figuraNoDocumento(paginas, { tipo: "figura", pagina: 1, indice: 1 });
    } catch (e) {
      erro = `${(e as { codigo?: string }).codigo} ${(e as Error).message}`;
    }
    checar("figura que nao existe: erro com as que existem", erro.startsWith("FIGURA_INEXISTENTE") && erro.includes("p2-1, p2-2"), erro);
  }
}
