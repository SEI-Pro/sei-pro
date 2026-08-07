/**
 * Instala helpers de feature que ainda moram em shared/ e precisam de aliases
 * globais nos blocos legados. Chamado por content/core-stack (não por core/stack).
 */
import { installQuickFilterLegacyApi } from './quickfilter/legacy-api.js';
import { installQuickFilterDom } from './quickfilter/dom.js';
import { installSticknoteLegacyApi } from './sticknote/legacy-api.js';
import { installDocsLoteLegacyApi } from './docslote-legacy-api.js';

export function installSharedLegacyHelpers() {
    installQuickFilterLegacyApi();
    installQuickFilterDom();
    installSticknoteLegacyApi();
    installDocsLoteLegacyApi();
}
