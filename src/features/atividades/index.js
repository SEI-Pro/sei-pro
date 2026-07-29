/**
 * Atividades — entry do bundle (substitui a cópia legada sei-pro-atividades.js).
 *
 * Decomposição: domain · io · view · templates · state · body · legacy-api.
 * Saída: dist/js/sei-pro-atividades.js (mesmo nome do legado para o manifest).
 *
 * Shared: src/shared/nomenclatura.js (getName / getNameGenre).
 * Core: SeiPro.core.prazos (getRecalculaPrazo) — not redefined here.
 */
import { ready } from '../../dom/index.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';
import { getAppsScriptUrlAtiv, getLabIdTables, getNumMonthsBetween2Dates } from './domain.js';
import { getName, getNameGenre } from '../../shared/nomenclatura.js';
import { installAtividadesLegacyApi } from './legacy-api.js';
import { initPerfilLoginAtiv, checkHostPermission } from './body.js';

installAtividadesState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.atividades = {
    getAppsScriptUrlAtiv,
    getLabIdTables,
    getNumMonthsBetween2Dates,
    getName,
    getNameGenre,
    refreshAtividadesState
};
namespace.shared = namespace.shared || {};
namespace.shared.nomenclatura = { getName, getNameGenre };

installAtividadesLegacyApi();

ready(function () {
    try { refreshAtividadesState(); } catch (e) { /* ignore */ }
    const ns = globalThis.NAMESPACE_SPRO;
    if (typeof ns !== 'undefined' && (ns === 'ANTAQ Pro' || ns === 'ANTT Pro')) {
        checkHostPermission();
    } else {
        initPerfilLoginAtiv();
    }
});
