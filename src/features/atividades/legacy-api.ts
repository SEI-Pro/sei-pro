// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Atividades — ponte de compatibilidade com o legado.
 *
 * aliasGlobal é usado somente aqui. Internal dispatch uses callAtiv() →
 * SeiPro.features.atividades.api.handlers (no full alias map required).
 *
 * ATIVIDADES_EXTERNAL_GLOBALS is retained as an opt-in adapter for third-party
 * hosts. First-party sei-functions / arvore / lista / monitorados / projetos /
 * prescricoes / visualizacao consumers use the explicit feature API.
 *
 * TODO: remover installAtividadesLegacyApi (e este arquivo) quando:
 *   1. call-sites externos consumirem só SeiPro.features.atividades.* (ou ESM);
 *   2. tests/structure/atividades-legacy-api.test.js deixar de exigir aliasGlobal.
 */
import { aliasGlobal } from '../../core/global.js';
import { globalRef } from '../../core/global.js';
import * as nomenclatura from '../../shared/nomenclatura.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';
import { atividadesHandlers } from './handlers.js';

/**
 * Names supported by the opt-in third-party adapter.
 */
export const ATIVIDADES_EXTERNAL_GLOBALS = Object.freeze([
    'getServerAtividades',
    'saveAtividade',
    'checkCapacidade',
    'actionsAtividade',
    'initEmptyAtividades',
    'getResendKey',
    'insertIconAtividade',
    'getAtividades',
    'getKanbanItem',
    'checkPerfilNivelAdm',
    'setTipoPrescricaoProcesso',
    'checkThisAtivRequiredFields',
    'checkAtivRequiredFields',
    'initAtividades',
    'initPanelAtividades',
    'initPerfilLoginAtiv',
    'checkHostPermission',
    'setPanelAtividades',
    'updateAtividade_',
    'prepareFieldsReplace',
    'addConfigItem',
    'signCancelDocumento',
    'checkPageAtividadesVisualizacao',
    'checkUnidadeFuncBeta',
    'setParamEditorAtiv',
    'extractDataDocument',
    'getConfigServerDoc',
    'getConfigServer',
    'dialogDebugScreen',
    'updateCountKanbanBoard',
    'getKanbanUserPriority',
    'getHtmlKanbanUserPriority',
    'getAppsScriptUrlAtiv',
    'getLabIdTables',
    'getNumMonthsBetween2Dates',
    'refreshAtividadesState',
    'getName',
    'getNameGenre'
]);

/** Explicit external surface (also present in handlers; listed for documentation). */
export const atividadesLegacyApi = Object.freeze(
    Object.fromEntries(
        ATIVIDADES_EXTERNAL_GLOBALS.map((name) => {
            if (name === 'refreshAtividadesState') return [name, refreshAtividadesState];
            if (name === 'getName') return [name, nomenclatura.getName];
            if (name === 'getNameGenre') return [name, nomenclatura.getNameGenre];
            return [name, atividadesHandlers[name]];
        }).filter(([, fn]) => typeof fn === 'function')
    )
);

export function installAtividadesLegacyApi({ target = globalRef, enabled } = {}) {
    installAtividadesState(target);

    // The bridge is now opt-in. All first-party consumers use the explicit
    // namespace; a host embedding an older third-party script can request the
    // aliases and dispatcher fallback deliberately with this flag.
    const legacyEnabled = enabled === true || target.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__ === true;
    if (!legacyEnabled) return target;
    if (target === globalRef && enabled === true) {
        target.__SEI_PRO_ENABLE_LEGACY_ATIVIDADES__ = true;
    }

    // Nomenclature first (sei-functions may call getName immediately).
    const alias = (name, fn) => {
        if (target === globalRef) aliasGlobal(name, fn);
        else if (typeof target[name] === 'undefined') target[name] = fn;
    };
    alias('getName', nomenclatura.getName);
    alias('getNameGenre', nomenclatura.getNameGenre);

    for (const name of ATIVIDADES_EXTERNAL_GLOBALS) {
        if (name === 'getName' || name === 'getNameGenre') continue;
        if (name === 'refreshAtividadesState') {
            alias(name, refreshAtividadesState);
            continue;
        }
        const fn = atividadesHandlers[name];
        if (typeof fn === 'function') alias(name, fn);
    }
    return target;
}
