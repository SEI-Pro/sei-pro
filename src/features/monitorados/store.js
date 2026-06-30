import { aliasGlobal, getSeiPro, globalRef } from '../../core/global.js';
import { isJson } from '../../core/serial.js';
import {
    defaultConfigDate,
    defaultMonitoradoStore,
    findMonitoradoIndex,
    monitoradoProcessDataReady,
    monitoradoProcessPayloadReady
} from './domain.js';

/**
 * Processos Monitorados — camada de STORE/IO (efeitos: localStorage + remoto).
 *
 * O objeto vivo fica em memória (módulo) e o localStorage é write-through síncrono,
 * para os demais arquivos continuarem lendo a chave 'configDataMonitoradosPro'.
 * O cache de parse é invalidado comparando a string crua do localStorage, então
 * escritas externas (sync de servidor, etiquetas, outras abas) são sempre refletidas.
 * A persistência remota (servidor Apps Script + FileSystem) é agrupada com debounce.
 *
 * É INFRAESTRUTURA cross-page: lido por sei-pro.js / sei-pro-all.js / sei-functions-pro.js
 * em blocos do manifest onde a view (sei-pro-monitorados.js) nem carrega — por isso é
 * instalado pela stack do core-stack (presente em todo bloco), não por um bundle da feature.
 *
 * Dependências de runtime (moment, jmespath, getServerAtividades, setLocalFilePro,
 * encodeJSON_toHex, perfilLoginAtiv) são lidas lazy via globalRef no momento da chamada.
 */

const STORE_KEY = 'configDataMonitoradosPro';
let storeState = null;
let storeLastRaw = null;
let remoteTimer = null;

export function getStoreMonitoradoPro() {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw === storeLastRaw && storeState !== null) {
        return storeState;
    }
    const parsed = (raw && isJson(raw)) ? JSON.parse(raw) : false;
    storeState = (parsed && Object.keys(parsed).length > 0) ? parsed : defaultMonitoradoStore();
    storeLastRaw = raw;
    return storeState;
}

// Seletor: configdate do monitorado no índice dado (default se ausente/vazio).
export function getOptionsConfigDate(index) {
    const store = getStoreMonitoradoPro();
    const item = (index >= 0 && store['monitorados'][index]) ? store['monitorados'][index] : false;
    const hasConfig = item && item['configdate'] && Object.keys(item['configdate']).length > 0;
    return hasConfig ? item['configdate'] : defaultConfigDate();
}

export function persistMonitoradoStore(store, options) {
    const moment = globalRef.moment;
    options = options || {};
    storeState = store || getStoreMonitoradoPro();
    if (!storeState.config) storeState.config = { colortags: [] };
    storeState.config.datetime = moment().format('YYYY-MM-DD HH:mm:ss');
    storeLastRaw = JSON.stringify(storeState);
    localStorage.setItem(STORE_KEY, storeLastRaw);
    if (options.remote !== false) scheduleMonitoradoRemote();
}

export function scheduleMonitoradoRemote() {
    if (remoteTimer) clearTimeout(remoteTimer);
    remoteTimer = setTimeout(function () {
        remoteTimer = null;
        flushMonitoradoRemote();
    }, 800);
}

// Envia o store ao servidor (Apps Script) + backup FileSystem. Deps lidas lazy.
export function flushMonitoradoRemote() {
    const jmespath = globalRef.jmespath;
    const store = getStoreMonitoradoPro();
    if (typeof store === 'undefined' || !store.hasOwnProperty('monitorados')) return;
    if (typeof globalRef.perfilLoginAtiv === 'undefined' || globalRef.perfilLoginAtiv === null) return;
    const sendMonitorados = { monitorados: [], config: { colortags: [] } };
    sendMonitorados.monitorados = jmespath.search(store.monitorados, "[*].{id_procedimento: id_procedimento, assuntos: assuntos, descricao: descricao, interessados: interessados, processo: processo, tipo_procedimento: tipo_procedimento, categoria: categoria, order: order, etiquetas: etiquetas, configdate: configdate}");
    sendMonitorados.config.colortags = store.config.colortags;
    globalRef.getServerAtividades({
        config: encodeURIComponent(globalRef.encodeJSON_toHex(JSON.stringify(sendMonitorados))),
        action: 'set_monitorados'
    }, 'set_monitorados');
    globalRef.setLocalFilePro(getStoreMonitoradoPro());
}

// Atalho: atualiza datetime e persiste localmente (sem remoto).
export function getConfigDatetimeMonitorado() {
    const store = getStoreMonitoradoPro();
    persistMonitoradoStore(store, { remote: false });
    return store;
}

// Persiste o store atual e agenda (debounce) o envio remoto.
export function saveConfigMonitorado() {
    persistMonitoradoStore(getStoreMonitoradoPro());
}

export function installMonitoradoStore() {
    const monitorados = getSeiPro().features.monitorados || (getSeiPro().features.monitorados = {});
    Object.assign(monitorados, {
        // store / io
        getStore: getStoreMonitoradoPro,
        getOptionsConfigDate,
        persist: persistMonitoradoStore,
        scheduleRemote: scheduleMonitoradoRemote,
        flushRemote: flushMonitoradoRemote,
        getConfigDatetime: getConfigDatetimeMonitorado,
        save: saveConfigMonitorado,
        // domain (puro)
        defaultConfigDate,
        defaultStore: defaultMonitoradoStore,
        findIndex: findMonitoradoIndex,
        processDataReady: monitoradoProcessDataReady,
        processPayloadReady: monitoradoProcessPayloadReady
    });

    // Aliases globais — preservam os call-sites do legado (view + outros arquivos).
    aliasGlobal('getStoreMonitoradoPro', getStoreMonitoradoPro);
    aliasGlobal('getOptionsConfigDate', getOptionsConfigDate);
    aliasGlobal('persistMonitoradoStore', persistMonitoradoStore);
    aliasGlobal('scheduleMonitoradoRemote', scheduleMonitoradoRemote);
    aliasGlobal('flushMonitoradoRemote', flushMonitoradoRemote);
    aliasGlobal('getConfigDatetimeMonitorado', getConfigDatetimeMonitorado);
    aliasGlobal('saveConfigMonitorado', saveConfigMonitorado);
    aliasGlobal('defaultConfigDate', defaultConfigDate);
    aliasGlobal('defaultMonitoradoStore', defaultMonitoradoStore);
    aliasGlobal('findMonitoradoIndex', findMonitoradoIndex);
    aliasGlobal('monitoradoProcessDataReady', monitoradoProcessDataReady);
    aliasGlobal('monitoradoProcessPayloadReady', monitoradoProcessPayloadReady);

    // Flush imediato ao sair da página (localStorage já é síncrono; isto garante o backup remoto).
    if (typeof globalRef.addEventListener === 'function' && !globalRef.__seiProMonitoradoFlushBound) {
        globalRef.__seiProMonitoradoFlushBound = true;
        globalRef.addEventListener('pagehide', function () {
            if (remoteTimer) {
                clearTimeout(remoteTimer);
                remoteTimer = null;
                flushMonitoradoRemote();
            }
        });
    }

    return monitorados;
}
