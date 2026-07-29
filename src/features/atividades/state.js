/**
 * Atividades — mutable runtime state on globalThis.
 * Heavy storage/DOM inits remain as guarded globalThis assignments in body.js;
 * this module owns the load flag and a refresh hook for boot.
 */
export function installAtividadesState() {
    const g = globalThis;
    if (g.__SEI_PRO_ATIVIDADES_STATE_INSTALLED__) return g;

    g.loadAtividadesPro = true;
    g.debugScreen = g.debugScreen || false;
    g.perfilLoginAtiv = g.perfilLoginAtiv || false;
    g.urlServerAtiv = g.urlServerAtiv || false;
    g.backendServerAtiv = g.backendServerAtiv || false;
    g.userHashAtiv = g.userHashAtiv || false;
    g.delayServerAtiv = g.delayServerAtiv || 0;
    g.arrayConfigAtividades = g.arrayConfigAtividades || [];
    g.arrayConfigAtivUnidade = g.arrayConfigAtivUnidade || [];
    g.ganttAtividades = g.ganttAtividades || false;
    g.ganttAfastamentos = g.ganttAfastamentos || false;
    g.ganttRecorrencias = g.ganttRecorrencias || false;
    g.kanbanAtividades = g.kanbanAtividades || false;
    g.kanbanAtividadesMoving = g.kanbanAtividadesMoving || false;
    g.tableConfigEditor = g.tableConfigEditor || {};
    g.tableConfigList = g.tableConfigList || {};
    g.arrayAtividadesPro = g.arrayAtividadesPro || [];
    g.arrayAtividadesProcPro = g.arrayAtividadesProcPro || [];
    g.arrayPrescricoesProcPro = g.arrayPrescricoesProcPro || [];
    g.arrayNomenclaturas = g.arrayNomenclaturas || [];
    g.checkLoadAtividadesProcPro = g.checkLoadAtividadesProcPro || false;
    g.checkLoadMonitoradosProcPro = g.checkLoadMonitoradosProcPro || false;
    g.indexReportUpdate = g.indexReportUpdate || 0;
    g.indexAPIUpdate = g.indexAPIUpdate || 0;
    g.stopUpdateApi = g.stopUpdateApi || false;

    g.__SEI_PRO_ATIVIDADES_STATE_INSTALLED__ = true;
    return g;
}

/**
 * Re-run storage-backed selectors after options/hybrid storage are available.
 * Body already assigns these at load with try/catch; this is a second pass at boot.
 */
export function refreshAtividadesState(g = globalThis) {
    try {
        if (typeof g.$ === 'function') {
            g.arrayAtividades = (g.$('#ifrArvore').length > 0)
                ? (g.arrayAtividadesProcPro || [])
                : (g.arrayAtividadesPro || []);
        }
    } catch (e) { /* ignore */ }

    try {
        if (typeof g.Chart !== 'undefined' && g.chartColors) {
            g.Chart.defaults.color = (localStorage.getItem('darkModePro')
                ? g.chartColors.light_grey
                : g.chartColors.dark_grey);
        }
    } catch (e) { /* ignore */ }

    return g;
}

export function getAtividadesState() {
    return installAtividadesState();
}
