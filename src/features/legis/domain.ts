// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Pure helpers for legislative numbering and citation formatting.
 */

export function uniq(values) {
    return values.slice().sort().filter((item, position, array) => {
        return !position || item !== array[position - 1];
    });
}

export function getATTags(inputText) {
    const regex = /(?:^|\s)@([a-zA-Z./#§\d]+)/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(inputText))) matches.push(match[1]);
    return matches;
}

export function getHashTags(inputText) {
    const regex = /(?:^|\s)#([a-zA-Z§\d]+)/gm;
    const matches = [];
    let match;
    while ((match = regex.exec(inputText))) matches.push(match[1]);
    return matches;
}

export function romanizeNum(num) {
    if (isNaN(num)) return NaN;
    const digits = String(+num).split('');
    const key = [
        '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
        '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
        '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
    ];
    let roman = '';
    let index = 3;
    while (index--) roman = (key[+digits.pop() + (index * 10)] || '') + roman;
    return Array(+digits.join('') + 1).join('M') + roman;
}

/**
 * Shortens a repeated full citation while retaining its identifying year.
 * Example: "Lei nº 8.112, de 11 de dezembro de 1990" becomes
 * "Lei nº 8.112, de 1990".
 */
export function formatRepeatedCitation(text) {
    if (typeof text !== 'string') return text;
    const separator = text.indexOf(',');
    if (separator < 0) return text;

    const title = text.slice(0, separator).trim();
    const date = text.slice(separator + 1).trim();
    const yearMatch = date.match(/\b(\d{4})\b(?!.*\b\d{4}\b)/);
    return title && yearMatch ? `${title}, de ${yearMatch[1]}` : text;
}
