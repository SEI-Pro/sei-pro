/**
 * Orquestração da tela de lista de processos.
 *
 * A entry recebe as bordas legadas como dependências explícitas: o módulo não
 * conhece jQuery, globals ou a ordem de carregamento do manifest. A fachada
 * `sei-pro.js` continua fornecendo essas dependências e mantém o bloco inline
 * como fallback para load orders antigos.
 */

const call = (deps, name, ...args) => {
    const fn = deps[name];
    return typeof fn === 'function' ? fn(...args) : undefined;
};

export function runListaProcessosView(deps = {}) {
    const {
        urlSpro,
        hasSimpleTableCellEdition = false,
        hasMomentDuration = false,
        loadScript,
        schedule = (fn) => fn(),
        sessionStorage,
        configHostKey = 'configHost_Pro'
    } = deps;

    call(deps, 'bindProcessoPaginacaoSuperiorVisibility');

    if (urlSpro && !hasSimpleTableCellEdition) {
        if (typeof loadScript === 'function') loadScript(`${urlSpro}js/lib/jquery-table-edit.min.js`);
    }
    if (urlSpro && !hasMomentDuration) {
        if (typeof loadScript === 'function') loadScript(`${urlSpro}js/lib/moment-duration-format.min.js`);
    }

    call(deps, 'initTableSorterHome');
    call(deps, 'insertGroupTable');
    call(deps, 'replaceSelectAll');
    call(deps, 'initPanelMonitorados');
    call(deps, 'checkLoadConfigSheets');
    call(deps, 'insertDivPanel');
    schedule(() => {
        call(deps, 'initNewTabProcesso');
        call(deps, 'syncHomeProcessCaption');
    }, 2000);
    call(deps, 'forceOnLoadBody');
    call(deps, 'observeAreaTela');
    call(deps, 'initAnotacaoControle');
    call(deps, 'initReplaceNewIcons');
    call(deps, 'initControlePrazo');
    call(deps, 'initViewEspecifacaoProcesso');
    call(deps, 'initFullnameAtribuicao');
    call(deps, 'initFaviconNrProcesso');
    call(deps, 'addAcompanhamentoEspIcon');
    call(deps, 'initAllMarcadoresHome');
    call(deps, 'initUrgentePro');
    call(deps, 'initNaoVisualizadoPro');
    call(deps, 'initProcessNotificationsPro');
    call(deps, 'storeLinkUsuarioSistema');
    call(deps, 'storeVersionSEI');

    if (sessionStorage && sessionStorage.getItem(configHostKey) === null) {
        call(deps, 'getConfigHost');
    }

    return true;
}

export function installListaProcessosView(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.entries = globalRef.SeiPro.entries || {};
    globalRef.SeiPro.entries.lista = globalRef.SeiPro.entries.lista || {};
    globalRef.SeiPro.entries.lista.view = { runListaProcessosView };
}
