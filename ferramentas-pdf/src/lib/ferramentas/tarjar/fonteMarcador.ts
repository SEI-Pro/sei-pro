/**
 * A fonte que escreve o bloco █ na camada invisível.
 *
 * O PROBLEMA. Queremos que, ao extrair o texto do documento tarjado, apareça
 * `███████████` no lugar do dado — para que quem lê por máquina veja que houve
 * supressão, e não que o documento veio incompleto. Só que U+2588 NÃO EXISTE
 * na tabela WinAnsi, que é a codificação das fontes padrão do PDF. Chamar
 * `fonte.encodeText("█")` com a Helvetica embutida pelo pdf-lib lança exceção —
 * é o mesmo limite que `textoWinAnsi.ts` contorna filtrando caracteres.
 *
 * A SAÍDA. Montamos à mão um dicionário de fonte com duas peças:
 *
 *   - `/Encoding /Differences [219 /block]` — o código 219 passa a se chamar
 *     "block" nesta fonte;
 *   - um `/ToUnicode` que mapeia o código 219 para U+2588.
 *
 * A Helvetica não tem glifo nenhum chamado "block", e isso é irrelevante:
 * o texto é escrito em modo de renderização 3 (invisível), então o glifo nunca
 * chega a ser desenhado. O que importa é o `/ToUnicode`, e é por ele que
 * qualquer extrator — pdf.js, pdftotext, o próprio Acrobat — lê `█`.
 *
 * A CONTRAPARTIDA, registrada porque é decisão de produto e não detalhe: um
 * bloco por caractere suprimido REVELA O COMPRIMENTO do dado. Para CPF e CNPJ
 * isso é irrelevante, porque o comprimento é fixo e conhecido. Para um nome ou
 * um endereço, é uma pista a mais para quem tenta adivinhar o conteúdo. Está
 * dito no guia editorial da página, não só aqui.
 */

import { PDFDocument, PDFName, type PDFRef } from "@cantoo/pdf-lib";

/** Código do bloco dentro desta fonte. 219 = 0xDB. */
export const CODIGO_BLOCO = 219;

/** Largura do bloco em milésimos de em, no espaço de glifo. */
const LARGURA_BLOCO = 600;

/** O ponto de código que a extração vai devolver. */
export const CARACTERE_BLOCO = "█";

const CMAP_TO_UNICODE = `/CIDInit /ProcSet findresource begin
12 dict begin
begincmap
/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def
/CMapName /SeiPro-Bloco def
/CMapType 2 def
1 begincodespacerange
<00> <FF>
endcodespacerange
1 beginbfchar
<DB> <2588>
endbfchar
endcmap
CMapName currentdict /CMap defineresource pop
end
end`;

/**
 * Registra a fonte de marcador no documento e devolve a referência.
 *
 * Uma por documento: chamar mais de uma vez cria dicionários duplicados que
 * ninguém dedupica, e num documento de 300 páginas isso apareceria no tamanho.
 */
export function criarFonteMarcador(doc: PDFDocument): PDFRef {
  const { context } = doc;

  const toUnicode = context.register(context.flateStream(CMAP_TO_UNICODE));

  const larguras = new Array(CODIGO_BLOCO).fill(0);
  larguras.push(LARGURA_BLOCO);

  const fonte = context.obj({
    Type: "Font",
    Subtype: "Type1",
    BaseFont: "Helvetica",
    FirstChar: 0,
    LastChar: CODIGO_BLOCO,
    Widths: context.obj(larguras),
    Encoding: context.obj({
      Type: "Encoding",
      Differences: context.obj([CODIGO_BLOCO, PDFName.of("block")]),
    }),
    ToUnicode: toUnicode,
  });

  return context.register(fonte);
}

/**
 * Quantos blocos representam o trecho suprimido.
 *
 * Com o texto conhecido, um bloco por caractere que não é espaço. Sem ele — o
 * caso do retângulo desenhado à mão sobre uma imagem —, uma estimativa pela
 * largura da tarja, porque devolver zero bloco faria a supressão desaparecer
 * também da leitura por máquina, que é justamente o que não queremos.
 */
export function quantidadeDeBlocos(
  textoSuprimido: string | undefined,
  larguraDaTarjaPt: number,
  alturaDaFontePt: number,
): number {
  if (textoSuprimido) {
    const uteis = textoSuprimido.replace(/\s+/g, "").length;
    if (uteis > 0) return Math.min(uteis, 200);
  }
  const larguraDoBloco = Math.max(1, alturaDaFontePt * 0.6);
  return Math.max(1, Math.min(200, Math.round(larguraDaTarjaPt / larguraDoBloco)));
}
