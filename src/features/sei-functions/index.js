/**
 * Sei Functions Pro — entry do bundle (substitui a cópia legada sei-functions-pro.js).
 *
 * Decomposição: domain · io · view · templates · state · clusters · legacy-api.
 * Saída: dist/js/sei-functions-pro.js (mesmo nome do legado para o manifest).
 *
 * Public surface: SeiPro.features.seiFunctions = { id, api, install }.
 */
import { publishFeature } from '../../app/publish-feature.js';
import { ready } from '../../dom/index.js';
import { installSeiFunctionsState, refreshSeiPageSelectors } from './state.js';
import { format2DecimalDomain } from './domain.js';
import { getSeiFunctionsNet } from './io.js';
import { installSeiFunctionsView } from './view.js';
import { installSeiFunctionsLegacyApi } from './legacy-api.js';
import {
    alertaBoxPro,
    confirmaBoxPro,
    fnJqueryPro,
    getDadosProcessoPro,
    getDocsArvore,
    getIdProcedimento,
    getNumProcesso,
    loadScriptPro,
    resetDialogBoxPro
} from './modules.js';

export function installSeiFunctionsFeature() {
    installSeiFunctionsState();
    installSeiFunctionsLegacyApi();
    installSeiFunctionsView();
    ready(function () {
        try { refreshSeiPageSelectors(); } catch (e) { /* ignore */ }
        fnJqueryPro();
    });
}

publishFeature({
    id: 'sei-functions',
    nsKey: 'seiFunctions',
    api: Object.freeze({
        format2DecimalDomain,
        getSeiFunctionsNet,
        refreshSeiPageSelectors,
        resetDialogBoxPro,
        confirmaBoxPro,
        alertaBoxPro,
        fnJqueryPro,
        loadScriptPro,
        getDadosProcessoPro,
        getDocsArvore,
        getNumProcesso,
        getIdProcedimento
    }),
    install: installSeiFunctionsFeature
});

installSeiFunctionsFeature();
