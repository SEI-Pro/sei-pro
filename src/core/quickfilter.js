import { aliasGlobal, getSeiPro } from './global.js';
import { removeAcentos, uniqPro } from './util.js';

/**
 * Núcleo PURO da feature "Filtrar a página pelo campo de pesquisa rápida"
 * (config `filtrarpaginapelapesquisarapida`) — extraído de sei-pro.js (Fase 6).
 *
 * Cobre normalização/tokenização do termo de busca e o cálculo de faixas
 * (ranges) de destaque (highlight) sobre um texto. A camada de DOM da feature
 * (varredura de tabelas/TreeWalker, criação de <span>, bind do input) permanece
 * nos arquivos legados e chama este core. Sem DOM, jQuery ou estado próprio.
 *
 * Dependências: removeAcentos/uniqPro (core/util, import modular).
 */

// Normaliza um texto para comparação: minúsculas, sem acentos, espaços colapsados.
export function normalizeFilterText(text) {
    text = (typeof text === 'string') ? text : '';
    text = removeAcentos(text.toLowerCase());
    return text.replace(/\s+/g, ' ').trim();
}

// Quebra o termo em tokens únicos (sem vazios), já normalizados.
export function getFilterTokens(text) {
    var query = normalizeFilterText(text);
    return query === '' ? [] : uniqPro(query.split(' ').filter(function (token) { return token !== ''; }));
}

// Mapa entre índices do texto NORMALIZADO e os índices do texto ORIGINAL.
// Necessário porque remover acentos pode alterar o comprimento dos caracteres,
// então as faixas calculadas no normalizado precisam voltar para coords cruas.
export function getNormalizedIndexMap(text) {
    var normalized = '';
    var map = [];

    for (var i = 0; i < text.length; i++) {
        var normalizedChar = removeAcentos(text.charAt(i).toLowerCase());
        if (typeof normalizedChar !== 'string') normalizedChar = text.charAt(i).toLowerCase();
        for (var j = 0; j < normalizedChar.length; j++) {
            normalized += normalizedChar.charAt(j);
            map.push(i);
        }
    }

    return { normalized: normalized, map: map };
}

// Funde faixas {start,end} sobrepostas/adjacentes numa lista mínima ordenada.
export function mergeHighlightRanges(ranges) {
    if (!ranges.length) return [];

    ranges.sort(function (a, b) {
        return a.start - b.start || a.end - b.end;
    });

    var merged = [ranges[0]];
    for (var i = 1; i < ranges.length; i++) {
        var current = ranges[i];
        var last = merged[merged.length - 1];
        if (current.start <= last.end) {
            last.end = Math.max(last.end, current.end);
        } else {
            merged.push(current);
        }
    }

    return merged;
}

// Calcula as faixas (em coords do texto ORIGINAL) onde os tokens ocorrem,
// usando o index map para tolerar diferença de comprimento por acentos.
export function buildHighlightRanges(text, tokens) {
    if (!tokens.length || !text) return [];

    var mapData = getNormalizedIndexMap(text);
    var normalized = mapData.normalized;
    var indexMap = mapData.map;
    var ranges = [];

    tokens.forEach(function (token) {
        var startIndex = 0;
        while (startIndex < normalized.length) {
            var foundIndex = normalized.indexOf(token, startIndex);
            if (foundIndex === -1) break;

            var rawStart = indexMap[foundIndex];
            var rawEndIndex = foundIndex + token.length - 1;
            var rawEnd = indexMap[rawEndIndex] + 1;

            ranges.push({ start: rawStart, end: rawEnd });
            startIndex = foundIndex + token.length;
        }
    });

    return mergeHighlightRanges(ranges);
}

export function installQuickFilter() {
    const quickfilter = {
        normalizeFilterText,
        getFilterTokens,
        getNormalizedIndexMap,
        mergeHighlightRanges,
        buildHighlightRanges
    };

    getSeiPro().core.quickfilter = quickfilter;

    // Aliases dos nomes legados da página (sei-pro.js).
    aliasGlobal('normalizeQuickPageFilterText', normalizeFilterText);
    aliasGlobal('getQuickPageFilterTokens', getFilterTokens);
    aliasGlobal('getNormalizedIndexMap', getNormalizedIndexMap);
    aliasGlobal('mergeQuickPageHighlightRanges', mergeHighlightRanges);
    aliasGlobal('buildQuickPageHighlightRanges', buildHighlightRanges);

    return quickfilter;
}
