/**
 * Atividades — ponte de compatibilidade com o legado.
 *
 * aliasGlobal é usado somente aqui. Internal dispatch uses callAtiv() →
 * SeiPro.features.atividades.handlers (no full alias map required).
 *
 * Only ATIVIDADES_EXTERNAL_GLOBALS (+ nomenclatura) are aliased for
 * sei-functions / arvore / lista / monitorados / projetos / prescricoes /
 * visualizacao / todas-paginas fallbacks that still touch globalThis.
 *
 * TODO: remover installAtividadesLegacyApi (e este arquivo) quando:
 *   1. call-sites externos consumirem só SeiPro.features.atividades.* (ou ESM);
 *   2. tests/structure/atividades-legacy-api.test.js deixar de exigir aliasGlobal.
 */
import { aliasGlobal } from '../../core/global.js';
import * as nomenclatura from '../../shared/nomenclatura.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';
import { atividadesHandlers } from './handlers.js';

/**
 * Names still expected by external features via globalThis / parent.* fallbacks.
 * Prefer SeiPro.features.atividades[name] at those call-sites.
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

export function installAtividadesLegacyApi() {
    installAtividadesState();

    // Nomenclature first (sei-functions may call getName immediately).
    aliasGlobal('getName', nomenclatura.getName);
    aliasGlobal('getNameGenre', nomenclatura.getNameGenre);

    for (const name of ATIVIDADES_EXTERNAL_GLOBALS) {
        if (name === 'getName' || name === 'getNameGenre') continue;
        if (name === 'refreshAtividadesState') {
            aliasGlobal(name, refreshAtividadesState);
            continue;
        }
        const fn = atividadesHandlers[name];
        if (typeof fn === 'function') aliasGlobal(name, fn);
    }
}
