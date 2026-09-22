/**
 * Entidades HTML e a faixa 0x80-0x9F do windows-1252, sem depender de DOM.
 *
 * Gerado a partir de `html.entities` do Python (Latin-1 + tipografia comum).
 * Por que não usar o DOM: o parser do linkedom (testes) não decodifica
 * entidades em `<textarea>`, e decodificar milhares de títulos da árvore via
 * DOM custaria um documento por título.
 */

const NOMEADAS: Record<string, number> = { AElig: 198, Aacute: 193, Acirc: 194, Agrave: 192, Aring: 197, Atilde: 195, Auml: 196, Ccedil: 199, ETH: 208, Eacute: 201, Ecirc: 202, Egrave: 200, Euml: 203, Iacute: 205, Icirc: 206, Igrave: 204, Iuml: 207, Ntilde: 209, Oacute: 211, Ocirc: 212, Ograve: 210, Oslash: 216, Otilde: 213, Ouml: 214, THORN: 222, Uacute: 218, Ucirc: 219, Ugrave: 217, Uuml: 220, Yacute: 221, aacute: 225, acirc: 226, acute: 180, aelig: 230, agrave: 224, amp: 38, apos: 39, aring: 229, atilde: 227, auml: 228, brvbar: 166, bull: 8226, ccedil: 231, cedil: 184, cent: 162, copy: 169, curren: 164, deg: 176, divide: 247, eacute: 233, ecirc: 234, egrave: 232, eth: 240, euml: 235, euro: 8364, frac12: 189, frac14: 188, frac34: 190, gt: 62, hellip: 8230, iacute: 237, icirc: 238, iexcl: 161, igrave: 236, iquest: 191, iuml: 239, laquo: 171, ldquo: 8220, lsquo: 8216, lt: 60, macr: 175, mdash: 8212, micro: 181, middot: 183, nbsp: 160, ndash: 8211, not: 172, ntilde: 241, oacute: 243, ocirc: 244, ograve: 242, ordf: 170, ordm: 186, oslash: 248, otilde: 245, ouml: 246, para: 182, plusmn: 177, pound: 163, quot: 34, raquo: 187, rdquo: 8221, reg: 174, rsquo: 8217, sect: 167, shy: 173, sup1: 185, sup2: 178, sup3: 179, szlig: 223, thorn: 254, times: 215, trade: 8482, uacute: 250, ucirc: 251, ugrave: 249, uml: 168, uuml: 252, yacute: 253, yen: 165, yuml: 255 };

/** Decodifica `&nome;`, `&#N;` e `&#xH;`. Entidade desconhecida fica como está. */
export function decodificarEntidades(s: string): string {
  if (!s.includes("&")) return s;
  return s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z][a-zA-Z0-9]*);/g, (todo, ent: string) => {
    const cp = ent[0] === "#" ? (ent[1] === "x" || ent[1] === "X" ? parseInt(ent.slice(2), 16) : parseInt(ent.slice(1), 10)) : NOMEADAS[ent];
    return cp === undefined || Number.isNaN(cp) ? todo : String.fromCodePoint(cp);
  });
}

/**
 * O que o navegador exibe para os bytes 0x80-0x9F numa página ISO-8859-1
 * (WHATWG trata o rótulo como windows-1252). O Node decodifica esses bytes como
 * controles C1, então a tabela garante o mesmo resultado nos dois ambientes.
 */
export const CP1252: Record<number, number> = { 0x80: 0x20AC, 0x82: 0x201A, 0x83: 0x0192, 0x84: 0x201E, 0x85: 0x2026, 0x86: 0x2020, 0x87: 0x2021, 0x88: 0x02C6, 0x89: 0x2030, 0x8A: 0x0160, 0x8B: 0x2039, 0x8C: 0x0152, 0x8E: 0x017D, 0x91: 0x2018, 0x92: 0x2019, 0x93: 0x201C, 0x94: 0x201D, 0x95: 0x2022, 0x96: 0x2013, 0x97: 0x2014, 0x98: 0x02DC, 0x99: 0x2122, 0x9A: 0x0161, 0x9B: 0x203A, 0x9C: 0x0153, 0x9E: 0x017E, 0x9F: 0x0178 };
