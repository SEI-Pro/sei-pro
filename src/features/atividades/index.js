/**
 * Atividades — entry do bundle (substitui a cópia legada sei-pro-atividades.js).
 *
 * Decomposição: runtime · domain · io · view · templates · handlers · legacy-api.
 * Saída: dist/js/sei-pro-atividades.js (mesmo nome do legado para o manifest).
 *
 * Shared: src/shared/nomenclatura.js (getName / getNameGenre).
 * Core: SeiPro.core.prazos (getRecalculaPrazo) — not redefined here.
 *
 * Public surface: prefer SeiPro.features.atividades.* from other features.
 * data-act uses handlers; legacy globals remain via legacy-api.js.
 */
import { ready } from '../../dom/index.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';
import { getLabIdTables } from './domain.js';
import {
    getAppsScriptUrlAtiv,
    getNumMonthsBetween2Dates
} from './compat.js';
import { getName, getNameGenre } from '../../shared/nomenclatura.js';
import { installAtividadesLegacyApi, atividadesLegacyApi } from './legacy-api.js';
import { initializeAtividadesRuntime } from './runtime.js';
import { installAtividadesView } from './view.js';
import { atividadesHandlers } from './handlers.js';
import { initAtividades, initPerfilLoginAtiv, checkHostPermission } from './boot.js';
import { getServerAtividades } from './server.js';

installAtividadesState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.atividades = {
    getAppsScriptUrlAtiv,
    getLabIdTables,
    getNumMonthsBetween2Dates,
    getName,
    getNameGenre,
    refreshAtividadesState,
    getServerAtividades,
    saveAtividade: atividadesHandlers.saveAtividade,
    checkCapacidade: atividadesHandlers.checkCapacidade,
    actionsAtividade: atividadesHandlers.actionsAtividade,
    initEmptyAtividades: atividadesHandlers.initEmptyAtividades,
    getResendKey: atividadesHandlers.getResendKey,
    insertIconAtividade: atividadesHandlers.insertIconAtividade,
    getAtividades: atividadesHandlers.getAtividades,
    getKanbanItem: atividadesHandlers.getKanbanItem,
    checkPerfilNivelAdm: atividadesHandlers.checkPerfilNivelAdm,
    setTipoPrescricaoProcesso: atividadesHandlers.setTipoPrescricaoProcesso,
    checkThisAtivRequiredFields: atividadesHandlers.checkThisAtivRequiredFields,
    checkAtivRequiredFields: atividadesHandlers.checkAtivRequiredFields,
    initAtividades,
    initPerfilLoginAtiv,
    checkHostPermission,
    handlers: atividadesHandlers,
    legacyApi: atividadesLegacyApi
};
namespace.shared = namespace.shared || {};
namespace.shared.nomenclatura = { getName, getNameGenre };

installAtividadesLegacyApi();
initializeAtividadesRuntime();
installAtividadesView();

ready(function () {
    try { refreshAtividadesState(); } catch (e) { /* ignore */ }
    const ns = globalThis.NAMESPACE_SPRO;
    if (typeof ns !== 'undefined' && (ns === 'ANTAQ Pro' || ns === 'ANTT Pro')) {
        checkHostPermission();
    } else {
        initPerfilLoginAtiv();
    }
});
