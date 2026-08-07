// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
// TODO: remover quando call-sites legados do filtro rápido migrarem para ESM.
import { aliasGlobal } from '../../core/global.js';
import {
    normalizeFilterText,
    getFilterTokens,
    getNormalizedIndexMap,
    mergeHighlightRanges,
    buildHighlightRanges,
    installQuickFilter
} from './domain.js';

export function installQuickFilterLegacyApi() {
    installQuickFilter();
    aliasGlobal('normalizeQuickPageFilterText', normalizeFilterText);
    aliasGlobal('getQuickPageFilterTokens', getFilterTokens);
    aliasGlobal('getNormalizedIndexMap', getNormalizedIndexMap);
    aliasGlobal('mergeQuickPageHighlightRanges', mergeHighlightRanges);
    aliasGlobal('buildQuickPageHighlightRanges', buildHighlightRanges);
}
