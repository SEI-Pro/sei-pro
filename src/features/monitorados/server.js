import { globalRef } from '../../core/global.js';
import { qs } from './dom.js';
import { getStoreMonitoradoPro, persistMonitoradoStore, getConfigDatetimeMonitorado } from './store.js';

/**
 * Monitorados — sincronização com servidor (Apps Script) + backup local
 * (FileSystem API), vanilla ESM. Store via ESM; FileSystem/servidor seguem
 * globais (getLocalFilePro/getServerAtividades/setLocalFilePro/fileSystemPro...).
 *
 * OPORTUNIDADE registrada: trocar a FileSystem API por chrome.storage.local
 * (mais robusto, sem prompt de permissão) — fica para um passo dedicado, pois
 * é mudança de comportamento de persistência, não só de arquitetura.
 */

const g = (n) => globalRef[n];
/** Resolve the explicit Atividades server port. */
function getAtividadesServer() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    if (api && typeof api.legacyRequest === 'function') return api.legacyRequest;
    if (api && typeof api.request === 'function') return api.request;
    return null;
}
function getAtividadesState() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    return api && api.state && typeof api.state.get === 'function' ? api.state.get() : {};
}
let statusLoadRemoteFile = true;
let loopServer = 0;

function checkFileSystemInit() {
    if (globalRef.fileSystemPro) return;
    if (g('getLocalFilePro')) g('getLocalFilePro')();
    setTimeout(() => {
        if (globalRef.fileSystemPro) return;
        const actions = qs('#monitoradosProActions');
        if (!actions) return;
        const old = qs('#htmlFileSystemStatus'); if (old) old.remove();
        actions.insertAdjacentHTML('beforeend',
            '<span id="htmlFileSystemStatus" style="display:block;float:left;font-size:9pt;color:#888;clear:both;top:0;left:60px;position:absolute;width:calc(100% - 400px);">'
            + '<i class="fas fa-exclamation-triangle vermelhoColor"></i> Seu navegador não possui suporte ao sistema de arquivos local (FileSystem API) ou o usuário não autorizou o seu uso.'
            + '<br> A não utilização dessa tecnologia poderá ocasionar a perda de dados dos Processos Monitorados, caso o cache do navegador seja apagado.'
            + '<br><a class="seipro-reauth-fs" style="font-size:9pt;color:blue;text-decoration:underline;cursor:pointer;">Re-autorize</a> a aplicação ou utilize outro navegador compatível.</span>');
        const link = qs('#htmlFileSystemStatus .seipro-reauth-fs');
        if (link) link.addEventListener('click', () => { if (g('initFileSystem')) g('initFileSystem')(); if (g('setPanelMonitorados')) g('setPanelMonitorados')('refresh'); });
    }, 1000);
}

function getRemoteFileMonitorado() {
    const server = getAtividadesServer();
    if (loopServer < 5 && server) {
        server({ action: 'get_monitorados' }, 'get_monitorados');
        loopServer++;
    }
}

function checkFileRemoteMonitorado(mode, data = false) {
    const server = getAtividadesServer();
    if (mode === 'get' && server && !getAtividadesState().checkLoadMonitoradosProcPro) {
        server({ action: 'check_monitorados' }, 'check_monitorados');
    } else if (mode === 'set' && data) {
        const store = getStoreMonitoradoPro();
        const moment = globalRef.moment;
        const dtServer = moment(data.datetime, 'YYYY-MM-DD HH:mm:ss');
        const dtLocal = moment(store.datetime, 'YYYY-MM-DD HH:mm:ss');
        if (statusLoadRemoteFile && dtServer.isValid() && dtLocal.isValid() && dtServer > dtLocal.add(1, 'minutes')) {
            getConfigDatetimeMonitorado();
            setTimeout(() => {
                getRemoteFileMonitorado();
                statusLoadRemoteFile = false;
                setTimeout(() => { statusLoadRemoteFile = true; }, 5000);
            }, 3000);
        }
    }
}

function checkFileLocalMonitorado() {
    if (g('getLocalFilePro')) g('getLocalFilePro')();
    setTimeout(() => {
        const content = globalRef.fileSystemContentPro;
        const moment = globalRef.moment;
        if (globalRef.fileSystemPro && content && typeof content === 'object' && typeof moment().isoWeekdayCalc === 'function' && Array.isArray(content.monitorados) && content.monitorados.length > 0) {
            persistMonitoradoStore(content);
            if (g('initPanelMonitorados')) g('initPanelMonitorados')();
        } else if (getAtividadesState().perfilLoginAtiv != null) {
            getRemoteFileMonitorado();
            if (typeof moment().isoWeekdayCalc !== 'function' && globalRef.jQuery) globalRef.jQuery.getScript(globalRef.URL_SPRO + 'js/lib/moment-weekday-calc.js');
        }
    }, 500);
}

function restoreMonitoradoServer(data) {
    const store = getStoreMonitoradoPro();
    if (store && store.monitorados && data && data.monitorados && data.config && data.config.colortags !== undefined) {
        store.monitorados = data.monitorados;
        store.config.colortags = data.config.colortags;
        persistMonitoradoStore(store, { remote: false });
        if (g('setLocalFilePro')) g('setLocalFilePro')(store);
        if (g('initPanelMonitorados')) g('initPanelMonitorados')();
    }
}

// Compat legada: aliased em legacy-api.js (único ponto com aliasGlobal da feature).
export const legacyApi = {
    checkFileSystemInit,
    checkFileRemoteMonitorado,
    checkFileLocalMonitorado,
    getRemoteFileMonitorado,
    restoreMonitoradoServer
};
