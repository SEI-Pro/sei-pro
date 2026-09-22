/**
 * Codificação de texto entre o navegador (UTF-16) e o SEI (ISO-8859-1).
 *
 * O SEI declara ISO-8859-1 em todas as páginas e decodifica o corpo dos POSTs
 * nesse charset. Três armadilhas conhecidas moram aqui, e todas já
 * corromperam dados em produção pelo código legado:
 *
 * 1. `encodeURIComponent` gera UTF-8: "ação" chega ao SEI como "aÃ§Ã£o".
 * 2. `escape()` gera `%u2014` para caractere fora do Latin-1, e o SEI grava o
 *    literal "%u2014" (é o "travessão do Word corrompe" da árvore do processo).
 * 3. Caractere acima de U+00FF não existe no banco do SEI. Ou vira equivalente
 *    Latin-1, ou vira entidade HTML (só em conteúdo HTML, onde o SEI a
 *    renderiza), ou some.
 *
 * Substitui no legado: `escapeComponent`, `fixedEncodeURIComponent`,
 * `encodeURI_toHex`, `procLote_paraLatin1`, `docsLote_paraLatin1`.
 */

import { CP1252 } from "./entidades";

/** Equivalentes Latin-1/ASCII para a tipografia que editores inserem sozinhos. */
const TROCAS: Record<string, string> = {
  "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": "-", "\u2015": "-",
  "\u2212": "-",
  "\u2018": "'", "\u2019": "'", "\u201A": "'", "\u201B": "'", "\u2032": "'",
  "\u201C": '"', "\u201D": '"', "\u201E": '"', "\u201F": '"', "\u2033": '"',
  "\u2026": "...", "\u2022": "-",
  "\u2002": " ", "\u2003": " ", "\u2009": " ", "\u202F": " ", "\u205F": " ",
  "\u200B": "", "\u200C": "", "\u200D": "", "\u2060": "", "\uFEFF": "",
  "\u20AC": "EUR", "\u2122": "(TM)", "\u2192": "->", "\u2190": "<-",
};

/**
 * Como tratar o que não cabe no Latin-1:
 * - `texto`: campo de formulário exibido como texto (especificação, descrição,
 *   anotação). Entidade HTML apareceria literal, então vira equivalente sem
 *   acento (NFKD) ou é removido.
 * - `html`: conteúdo de editor. O SEI renderiza `&#N;`, então nada se perde.
 */
export type ModoLatin1 = "texto" | "html";

/** Converte para uma string cujos caracteres cabem todos no Latin-1. */
export function paraLatin1Seguro(texto: string, modo: ModoLatin1 = "texto"): string {
  let saida = "";
  for (const ch of texto) {
    const cp = ch.codePointAt(0)!;
    if (cp <= 0xff) {
      saida += ch;
      continue;
    }
    const troca = TROCAS[ch];
    // Em HTML a tipografia sobrevive como entidade; só os invisíveis somem.
    if (modo === "html") {
      saida += troca === "" ? "" : `&#${cp};`;
      continue;
    }
    if (troca !== undefined) {
      saida += troca;
      continue;
    }
    // Tenta a letra base: "ő" → "o", "ﬁ" → "fi". O que não tiver base some.
    const base = ch.normalize("NFKD").replace(/[\u0300-\u036F]/g, "");
    saida += [...base].every((c) => c.codePointAt(0)! <= 0xff) ? base : "";
  }
  return saida;
}

const NAO_ESCAPA = /[A-Za-z0-9\-_.*]/;

/** Percent-encoding de um valor já Latin-1, no formato x-www-form-urlencoded. */
function codificarValor(valor: string): string {
  let s = "";
  for (const ch of valor) {
    if (ch === " ") s += "+";
    else if (NAO_ESCAPA.test(ch)) s += ch;
    else s += "%" + ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0");
  }
  return s;
}

/**
 * Monta o corpo de um POST para o SEI.
 *
 * Os campos são pares, e não um objeto, porque o SEI usa nomes repetidos
 * (`selAssuntos[]`, checkboxes de tabela) e a ORDEM importa em alguns
 * formulários. `modos` permite marcar campos de conteúdo HTML.
 */
export function codificarLatin1(
  campos: ReadonlyArray<readonly [string, string]>,
  modos: Readonly<Record<string, ModoLatin1>> = {},
): string {
  return campos
    .map(([nome, valor]) => {
      const modo = modos[nome] ?? "texto";
      return `${codificarValor(paraLatin1Seguro(nome))}=${codificarValor(paraLatin1Seguro(valor ?? "", modo))}`;
    })
    .join("&");
}

/**
 * Decodifica a resposta do SEI.
 *
 * `windows-1252` e não `iso-8859-1`: é o que o navegador de fato aplica quando a
 * página declara ISO-8859-1 (padrão WHATWG), e é o que devolve o travessão e as
 * aspas curvas que o SEI grava nos bytes 0x80–0x9F.
 */
export function decodificarLatin1(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  // Laço manual em blocos: TextDecoder("windows-1252") do Node devolve controles
  // C1 para 0x80-0x9F, e o do navegador devolve a tipografia. Aqui é igual nos dois.
  const partes: string[] = [];
  const BLOCO = 0x4000;
  for (let i = 0; i < b.length; i += BLOCO) {
    const fatia = b.subarray(i, i + BLOCO);
    const cps = new Array<number>(fatia.length);
    for (let j = 0; j < fatia.length; j += 1) cps[j] = CP1252[fatia[j]] ?? fatia[j];
    partes.push(String.fromCharCode(...cps));
  }
  return partes.join("");
}

/** Charset declarado no Content-Type de um POST para o SEI. */
export const TIPO_FORMULARIO = "application/x-www-form-urlencoded; charset=ISO-8859-1";
