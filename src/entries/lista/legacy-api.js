/**
 * Ponte de compatibilidade da entry da lista.
 *
 * A cópia legada `sei-pro.js` ainda chama estes nomes durante o boot. A entry
 * instala os wrappers antes do legado, removendo as definições duplicadas do
 * monólito sem alterar o fallback de load order antigo.
 */
import { aliasGlobal, globalRef } from '../../core/global.js';

function getListaEntryContextLegacy() {
    const entry = globalRef.SeiPro && globalRef.SeiPro.entries && globalRef.SeiPro.entries.lista;
    if (!entry || typeof entry.composeListaFeatures !== 'function') return false;
    const checkConfigValue = globalRef.checkConfigValue;
    const root = globalRef.document;
    const inputs = typeof entry.readListaEntryInputs === 'function'
        ? entry.readListaEntryInputs({
            root,
            checkConfigValue: typeof checkConfigValue === 'function' ? checkConfigValue : undefined
        })
        : {
            hasProcessTables: Boolean(globalRef.$ && globalRef.$('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length),
            hasTreeFrame: Boolean(globalRef.$ && globalRef.$('#ifrArvore').length),
            enabled: {
                'controlar-prazos': typeof checkConfigValue === 'function' ? checkConfigValue('gerenciarprazos') : true,
                'nao-lido': true,
                monitorados: typeof checkConfigValue === 'function' ? checkConfigValue('gerenciarmonitorados') : true
            }
        };
    return entry.composeListaFeatures(inputs);
}

function runListaProcessosViewLegacy() {
    const entry = globalRef.SeiPro && globalRef.SeiPro.entries && globalRef.SeiPro.entries.lista;
    const view = entry && entry.runListaProcessosView;
    if (typeof view !== 'function') return false;
    const $ = globalRef.$ || globalRef.jQuery;
    const moment = globalRef.moment;
    const deps = {
        urlSpro: globalRef.URL_SPRO,
        hasSimpleTableCellEdition: typeof globalRef.SimpleTableCellEdition !== 'undefined',
        hasMomentDuration: typeof moment !== 'undefined' && typeof moment.duration !== 'undefined',
        loadScript: (url) => { if (typeof $ === 'function' && typeof $.getScript === 'function') $.getScript(url); },
        schedule: (fn, delay) => globalRef.setTimeout(fn, delay),
        sessionStorage: globalRef.sessionStorage,
        bindProcessoPaginacaoSuperiorVisibility: globalRef.bindProcessoPaginacaoSuperiorVisibility,
        initTableSorterHome: globalRef.initTableSorterHome,
        insertGroupTable: globalRef.insertGroupTable,
        replaceSelectAll: globalRef.replaceSelectAll,
        initPanelMonitorados: typeof globalRef.initPanelMonitorados === 'function' ? globalRef.initPanelMonitorados : undefined,
        checkLoadConfigSheets: globalRef.checkLoadConfigSheets,
        insertDivPanel: globalRef.insertDivPanel,
        initNewTabProcesso: globalRef.initNewTabProcesso,
        syncHomeProcessCaption: globalRef.syncHomeProcessCaption,
        forceOnLoadBody: globalRef.forceOnLoadBody,
        observeAreaTela: globalRef.observeAreaTela,
        initAnotacaoControle: () => {
            if (globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.anotacaoControle) {
                globalRef.SeiPro.features.anotacaoControle.init();
            }
        },
        initReplaceNewIcons: globalRef.initReplaceNewIcons,
        initControlePrazo: globalRef.initControlePrazo,
        initViewEspecifacaoProcesso: globalRef.initViewEspecifacaoProcesso,
        initFullnameAtribuicao: globalRef.initFullnameAtribuicao,
        initFaviconNrProcesso: globalRef.initFaviconNrProcesso,
        addAcompanhamentoEspIcon: globalRef.addAcompanhamentoEspIcon,
        initAllMarcadoresHome: globalRef.initAllMarcadoresHome,
        initUrgentePro: globalRef.initUrgentePro,
        initNaoVisualizadoPro: globalRef.initNaoVisualizadoPro,
        initProcessNotificationsPro: typeof globalRef.initProcessNotificationsPro === 'function' ? globalRef.initProcessNotificationsPro : undefined,
        storeLinkUsuarioSistema: globalRef.storeLinkUsuarioSistema,
        storeVersionSEI: globalRef.storeVersionSEI,
        getConfigHost: typeof globalRef.getConfigHost !== 'undefined' ? globalRef.getConfigHost : undefined
    };
    view(deps);
    return true;
}

aliasGlobal('getListaEntryContextLegacy', getListaEntryContextLegacy);
aliasGlobal('runListaProcessosViewLegacy', runListaProcessosViewLegacy);

export { getListaEntryContextLegacy, runListaProcessosViewLegacy };
