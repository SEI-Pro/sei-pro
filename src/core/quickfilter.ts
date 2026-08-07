// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** @deprecated Re-export — use src/shared/quickfilter/domain.js */
export {
    normalizeFilterText,
    getFilterTokens,
    getNormalizedIndexMap,
    mergeHighlightRanges,
    buildHighlightRanges,
    installQuickFilter
} from '../shared/quickfilter/domain.js';
