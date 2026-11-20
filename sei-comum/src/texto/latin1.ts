/**
 * Conversao para ISO-8859-1 (porta de PROCLOTE_TROCAS e procLote_paraLatin1,
 * dist/js/sei-functions-pro.js).
 *
 * O SEI grava a especificacao em latin-1: um caractere fora dessa faixa entra no processo
 * como texto literal ("%u2014"). Coladas do Word ou do Excel, as especificacoes trazem
 * travessao e aspas curvas o tempo todo. Comprovado no SEI 4.1.5: "Teste (travessao) aqui" gravou
 * "Teste %u2014 aqui".
 *
 * As chaves da tabela ficam como escapes \uXXXX de proposito: sao inequivocas e nenhuma
 * ferramenta as normaliza por engano.
 */
const TROCAS: Record<string, string> = {
  "\u2010": "-",
  "\u2011": "-",
  "\u2012": "-",
  "\u2013": "-",
  "\u2014": "-",
  "\u2015": "-",
  "\u2212": "-",
  "\u2018": "'",
  "\u2019": "'",
  "\u201A": "'",
  "\u201B": "'",
  "\u2032": "'",
  "\u201C": '"',
  "\u201D": '"',
  "\u201E": '"',
  "\u201F": '"',
  "\u2033": '"',
  "\u2026": "...",
  "\u2022": "-",
  "\u00A0": " ",
  "\u2007": " ",
  "\u2008": " ",
  "\u2009": " ",
  "\u200A": " ",
  "\u202F": " ",
  "\u200B": "",
  "\uFEFF": "",
  "\u20AC": "EUR",
  "\u2122": "(TM)",
  "\u2190": "<-",
  "\u2192": "->",
  "\u2264": "<=",
  "\u2265": ">=",
};

/** Deixa o texto inteiro representavel em ISO-8859-1, sem perder o sentido. */
export function paraLatin1(texto: string): string {
  const entrada = String(texto === null || texto === undefined ? "" : texto);
  return entrada.normalize("NFC").replace(/[\s\S]/g, (c) => {
    // A tabela vem ANTES do atalho de latin-1: o espaco nao separavel (U+00A0) cabe em
    // latin-1, mas colado do Word ele quebra a busca no SEI ("Contrato 123" nao acha
    // "Contrato\u00A0123").
    if (Object.hasOwn(TROCAS, c)) return TROCAS[c] as string;
    if (c.charCodeAt(0) < 256) return c;
    // Ultimo recurso: tira o acento e fica com a letra base; se ainda sobrar algo fora
    // de latin-1, o caractere inteiro some.
    const base = c.normalize("NFD").replace(/[\u0300-\u036F]/g, "");
    for (let i = 0; i < base.length; i++) {
      if (base.charCodeAt(i) > 255) return "";
    }
    return base;
  });
}

/** Quantas linhas mudariam ao serem convertidas para ISO-8859-1. */
export function contarConvertidas(linhas: string[]): number {
  return linhas.filter((l) => paraLatin1(l) !== l).length;
}
