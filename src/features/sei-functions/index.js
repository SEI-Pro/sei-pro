/**
 * Sei Functions Pro — entry do bundle (substitui a cópia legada sei-functions-pro.js).
 *
 * Decomposição: domain · io · view · templates · state · body · legacy-api.
 * Saída: dist/js/sei-functions-pro.js (mesmo nome do legado para o manifest).
 *
 * Shared helpers already provided by core-stack (texto, numeros, serial,
 * validacao, cor, datas, options, cookies, report, …) are NOT redefined —
 * tombstones in body.js document the carve-outs.
 */
import { ready } from '../../dom/index.js';
import { installSeiFunctionsState, refreshSeiPageSelectors } from './state.js';
import { format2DecimalDomain } from './domain.js';
import { getSeiFunctionsNet } from './io.js';
import { installSeiFunctionsLegacyApi } from './legacy-api.js';
import { fnJqueryPro } from './body.js';

installSeiFunctionsState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.seiFunctions = {
    format2DecimalDomain,
    getSeiFunctionsNet,
    refreshSeiPageSelectors
};

installSeiFunctionsLegacyApi();

ready(function () {
    try { refreshSeiPageSelectors(); } catch (e) { /* ignore */ }
    fnJqueryPro();
});
