// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — initSeiPro boot.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    addAcompanhamentoEspIcon,
    bindProcessoPaginacaoSuperiorVisibility,
    checkLoadConfigSheets,
    forceOnLoadBody,
    initAllMarcadoresHome,
    initDadosProcesso,
    initFaviconNrProcesso,
    initFullnameAtribuicao,
    initNewTabProcesso,
    initObserveUrlChange,
    initReloadModalLink,
    initReplaceNewIcons,
    initTableSorterHome,
    initUrgentePro,
    initViewEspecifacaoProcesso,
    insertDivPanel,
    insertGroupTable,
    observeAreaTela,
    replaceSelectAll,
    syncHomeProcessCaption
} from './modules.js';

export function storeLinkUsuarioSistema() {
    if (typeof setOptionsPro !== 'undefined') setOptionsPro('usuarioSistema',$('#lnkUsuarioSistema').attr('title'));
}
export function storeVersionSEI() {
    if (typeof getSeiVersionPro !== 'undefined' && getSeiVersionPro()) 
        getSeiVersionPro();
    else if (typeof setSeiVersionPro !== 'undefined') setSeiVersionPro();
}
export function initSeiPro() {
    if (typeof checkHostLimit !== 'function') {
        setTimeout(function(){
            initSeiPro();
            if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload initSeiPro checkHostLimit');
        }, 300);
        return;
    }
    var listaEntryContext = getListaEntryContextLegacy();
	if ((listaEntryContext && listaEntryContext.context === 'lista-processos') ||
        (!listaEntryContext && $('#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado').length > 0)) {
        if (runListaProcessosViewLegacy()) {
            // A entry ESM assume a orquestração quando o bundle está disponível.
            // O bloco abaixo permanece como fallback para load orders antigos.
        } else {
            bindProcessoPaginacaoSuperiorVisibility();
            if (typeof URL_SPRO !== 'undefined' && typeof SimpleTableCellEdition === 'undefined') $.getScript((URL_SPRO+"js/lib/jquery-table-edit.min.js"));
            if (typeof URL_SPRO !== 'undefined' && (typeof moment === 'undefined' || typeof moment.duration === 'undefined')) $.getScript((URL_SPRO+"js/lib/moment-duration-format.min.js"));
            initTableSorterHome();
            insertGroupTable();
            replaceSelectAll();
            // Migrado p/ ESM (monitorados/boot.js); alias provido pelo monitorados.bundle
            // (co-injetado nestes blocos). Guarda por segurança de ordem de carga.
            if (typeof initPanelMonitorados === 'function') initPanelMonitorados();
            checkLoadConfigSheets();
            insertDivPanel();
            setTimeout(() => {
                initNewTabProcesso();
                syncHomeProcessCaption();
            }, 2000);
            forceOnLoadBody();
            observeAreaTela();
            // Feature migrada p/ src/features/anotacao-controle (bundle isolado).
            if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle && SeiPro.features.anotacaoControle.api) SeiPro.features.anotacaoControle.api.init();
            initReplaceNewIcons();
            initControlePrazo();
            initViewEspecifacaoProcesso();
            initFullnameAtribuicao();
            initFaviconNrProcesso();
            addAcompanhamentoEspIcon();
            initAllMarcadoresHome();
            initUrgentePro();
            initNaoVisualizadoPro();
            if (typeof initProcessNotificationsPro === 'function') initProcessNotificationsPro();
            storeLinkUsuarioSistema();
            storeVersionSEI();
            if (sessionStorage.getItem('configHost_Pro') === null && typeof getConfigHost !== 'undefined') getConfigHost();
        }
	} else if ( $("#ifrArvore").length > 0 ) {
        if (!checkHostLimit()) initDadosProcesso();
        initObserveUrlChange();
        checkLoadConfigSheets();
        //observeHistoryBrowserPro();
	}
    initReloadModalLink();
    if (typeof initSmartSignatureSelectionPro === 'function') initSmartSignatureSelectionPro();
    // #ancLiberarMeusProcessos: mesmo bind de setTableSorterHome acima (ver comentário lá
    // — testado ao vivo, SEI não liga handler nesse botão; fix via DOM puro, sem cruzar
    // mundos). Religar aqui também replica o comportamento original do legado (que tinha
    // o mesmo bind duplicado nos dois pontos) — inofensivo, pois o 1º clique já navega
    // (form.submit()) antes do 2º handler ter efeito.
    // #ancLiberarMarcador/#ancLiberarTipoProcedimento/#ancLiberarTipoPrioridade ficam
    // de fora por ora: corpos de filtrarMarcador/filtrarTipoProcedimento/filtrarTipoPrioridade
    // são bem maiores (838-881 chars) e não foram lidos com segurança — não replicar
    // 'no escuro'. Gap documentado, não corrigido.
    $('#ancLiberarMeusProcessos').click(function (e) {
        e.preventDefault();
        var hdn = document.getElementById('hdnMeusProcessos');
        var form = document.getElementById('frmProcedimentoControlar');
        if (hdn && form) {
            hdn.value = 'T';
            form.submit();
        }
    });
}
