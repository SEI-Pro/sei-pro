// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { migrateLocalFeatureStore } from '../../config/migrations/index.js';
import { getSeiPro, globalRef } from '../../core/global.js';
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
 * É uma ponte cross-page do bloco legado: lido por sei-pro.js / sei-pro-all.js /
 * sei-functions-pro.js em blocos do manifest onde a view (monitorados.bundle.js)
 * nem carrega. Por isso é instalado por src/content/core-stack.js, não por
 * src/core/stack.js nem pelo bundle visível da feature.
 *
 * Dependências de runtime (moment, jmespath, setLocalFilePro e encodeJSON_toHex)
 * são lidas lazy via globalRef no momento da chamada. A autenticação e o
 * transporte de Atividades vêm exclusivamente do namespace da feature.
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
    if (!parsed || Object.keys(parsed).length === 0) {
        // Empty store stays the canonical default shape (no write on first read).
        storeState = defaultMonitoradoStore();
        storeLastRaw = raw;
        return storeState;
    }
    const migrated = migrateLocalFeatureStore(parsed, 'monitorados', defaultMonitoradoStore);
    storeState = migrated.store;
    if (migrated.changed) {
        // Stamp version without remote flush on first read of legacy data.
        persistMonitoradoStore(storeState, { remote: false });
        return storeState;
    }
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
    // ADR-0013: bus removido (0 assinantes). Reagir a updates = ligação na raiz.
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
    const atividadesFeature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const atividadesApi = atividadesFeature && atividadesFeature.api;
    const atividadesState = atividadesApi && atividadesApi.state && typeof atividadesApi.state.get === 'function'
        ? atividadesApi.state.get()
        : null;
    if (!atividadesState || !atividadesState.perfilLoginAtiv) return;
    const sendMonitorados = { monitorados: [], config: { colortags: [] } };
    sendMonitorados.monitorados = jmespath.search(store.monitorados, "[*].{id_procedimento: id_procedimento, assuntos: assuntos, descricao: descricao, interessados: interessados, processo: processo, tipo_procedimento: tipo_procedimento, categoria: categoria, order: order, etiquetas: etiquetas, configdate: configdate}");
    sendMonitorados.config.colortags = store.config.colortags;
    const atividadesServer = atividadesApi && (atividadesApi.legacyRequest || atividadesApi.request);
    if (typeof atividadesServer === 'function') {
        atividadesServer({
            config: encodeURIComponent(globalRef.encodeJSON_toHex(JSON.stringify(sendMonitorados))),
            action: 'set_monitorados'
        }, 'set_monitorados');
    }
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
    // Staging bag until monitorados/index.js publishes the full { id, api, install }.
    // Keep methods on the feature object for early legacy readers; index merges into api.
    const root = getSeiPro();
    root.features = root.features || {};
    const monitorados = root.features.monitorados || (root.features.monitorados = {
        id: 'monitorados',
        api: {},
        install: function noop() {}
    });
    const storeMethods = {
        getStore: getStoreMonitoradoPro,
        getOptionsConfigDate,
        persist: persistMonitoradoStore,
        scheduleRemote: scheduleMonitoradoRemote,
        flushRemote: flushMonitoradoRemote,
        getConfigDatetime: getConfigDatetimeMonitorado,
        save: saveConfigMonitorado,
        defaultConfigDate,
        defaultStore: defaultMonitoradoStore,
        findIndex: findMonitoradoIndex,
        processDataReady: monitoradoProcessDataReady,
        processPayloadReady: monitoradoProcessPayloadReady
    };
    Object.assign(monitorados, storeMethods);
    if (!monitorados.api || typeof monitorados.api !== 'object') monitorados.api = {};
    Object.assign(monitorados.api, storeMethods);

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
