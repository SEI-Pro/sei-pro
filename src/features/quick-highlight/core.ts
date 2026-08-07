// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { removeAcentos } from '../../core/util.js';

/**
 * Núcleo PURO do highlight de pesquisa rápida no visualizador (sem DOM).
 * Origem: dist/js/init_visualizacao.js. Tokeniza a query e calcula os intervalos
 * (ranges) a destacar dentro de um texto.
 */

export function normalizeQuickText(text) {
    text = (typeof text === 'string') ? text : '';
    text = removeAcentos(text.toLowerCase());
    return text.replace(/\s+/g, ' ').trim();
}

export function getQuickTokens(text) {
    const query = normalizeQuickText(text);
    return query === '' ? [] : query.split(' ').filter(function (t) { return t !== ''; });
}

// Intervalos [start,end) mesclados de todas as ocorrências dos tokens no texto.
export function buildQuickRanges(text, tokens) {
    const ranges = [];
    const normalized = normalizeQuickText(text);
    tokens.forEach(function (token) {
        let startIndex = 0;
        while (startIndex < normalized.length) {
            const foundAt = normalized.indexOf(token, startIndex);
            if (foundAt === -1) break;
            ranges.push({ start: foundAt, end: foundAt + token.length });
            startIndex = foundAt + token.length;
        }
    });
    ranges.sort(function (a, b) { return a.start - b.start; });
    return ranges.reduce(function (merged, current) {
        if (!merged.length) { merged.push(current); return merged; }
        const previous = merged[merged.length - 1];
        if (current.start <= previous.end) {
            previous.end = Math.max(previous.end, current.end);
        } else {
            merged.push(current);
        }
        return merged;
    }, []);
}
