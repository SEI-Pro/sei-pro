/**
 * Leitura dos parametros de upload da instalacao do SEI.
 *
 * Modulo separado do resto do glue de proposito: e a parte com mais chance de
 * errar em silencio -- a tela muda entre as versoes do SEI, e um limite lido
 * errado nao da erro nenhum, so faz o documento ser recusado no protocolo.
 * Separado, da para exercita-lo com HTML de verdade nos verificadores.
 */

/** Extrai o teto e as extensoes do HTML da tela de documento externo. */
export function extrairParametros(html: string): {
  bytesPorArquivo?: number;
  extensoes?: string[];
} | null {
  const resultado: { bytesPorArquivo?: number; extensoes?: string[] } = {};

  // A lista de extensoes vem num array JavaScript na propria pagina.
  const arr = html.match(/arrExt\s*=\s*\[([^\]]*)\]/i);
  if (arr) {
    const extensoes = arr[1]
      .split(",")
      .map((x) => x.replace(/['"\s]/g, "").toLowerCase())
      .filter(Boolean);
    if (extensoes.length) resultado.extensoes = extensoes;
  }

  // O teto aparece como texto ("Tamanho máximo: 30 Mb") ou como argumento
  // numerico do `infraUpload`. A assinatura do construtor varia entre as
  // versoes do SEI, entao procuramos o número em MB de forma tolerante e
  // desistimos em vez de chutar.
  // `á` escapado de proposito: o esbuild NAO escapa acento dentro de
  // literal de expressao regular, e este arquivo e injetado na página do SEI,
  // onde UTF-8 cru vira mojibake.
  const texto = html.match(/tamanho\s*m[a\u00E1]ximo[^0-9]{0,40}([\d.,]+)\s*(mb|kb|gb)/i);
  if (texto) {
    const valor = parseFloat(texto[1].replace(/\./g, "").replace(",", "."));
    const unidade = texto[2].toLowerCase();
    const fator = unidade === "gb" ? 1024 ** 3 : unidade === "kb" ? 1024 : 1024 ** 2;
    if (Number.isFinite(valor) && valor > 0) resultado.bytesPorArquivo = Math.round(valor * fator);
  }

  return resultado.bytesPorArquivo || resultado.extensoes ? resultado : null;
}
