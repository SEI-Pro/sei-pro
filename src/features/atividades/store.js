/**
 * Atividades application store.
 *
 * The original feature kept its state in dozens of globals.  This store is
 * the canonical state boundary used by new code.  A small legacy projection
 * is installed by state.js while old page integrations are being migrated.
 */

export const ATIVIDADES_STATE_DEFAULTS = Object.freeze({
    loadAtividadesPro: true,
    debugScreen: false,
    perfilLoginAtiv: false,
    urlServerAtiv: false,
    backendServerAtiv: false,
    userHashAtiv: false,
    delayServerAtiv: 0,
    arrayConfigAtividades: [],
    arrayConfigAtivUnidade: [],
    ganttAtividades: false,
    ganttAfastamentos: false,
    ganttRecorrencias: false,
    kanbanAtividades: false,
    kanbanAtividadesMoving: false,
    tableConfigEditor: {},
    tableConfigList: {},
    arrayAtividadesPro: [],
    arrayAtividadesProcPro: [],
    arrayPrescricoesProcPro: [],
    arrayNomenclaturas: [],
    checkLoadAtividadesProcPro: false,
    checkLoadMonitoradosProcPro: false,
    indexReportUpdate: 0,
    indexAPIUpdate: 0,
    stopUpdateApi: false,
    arrayAtividades: [],
    arrayProcessosUnidade: false,
    dly: undefined,
    lastUpdateAtividades: false,
    listAPIUpdate: [],
    listLabelsTiposMetadados: [],
    listReportsUpdate: [],
    loadRowsPanelAtiv: false,
    nameAPIUpdate: [],
    nameReportsUpdate: [],
    notificacaoTexto: {},
    perfilAtividadesSelected: false,
    timeRestoreAtividades: false,
    chartColors: {}
});

const cloneDefault = (value) => {
    if (Array.isArray(value)) return [];
    if (value && typeof value === 'object') return {};
    return value;
};

export function createAtividadesStore(initial = {}) {
    let state = Object.keys(ATIVIDADES_STATE_DEFAULTS).reduce((out, key) => {
        out[key] = Object.prototype.hasOwnProperty.call(initial, key)
            ? initial[key]
            : cloneDefault(ATIVIDADES_STATE_DEFAULTS[key]);
        return out;
    }, {});
    const listeners = new Set();

    return Object.freeze({
        get() {
            return state;
        },
        snapshot() {
            return { ...state };
        },
        patch(next = {}) {
            const changed = {};
            Object.keys(next).forEach((key) => {
                if (!Object.prototype.hasOwnProperty.call(ATIVIDADES_STATE_DEFAULTS, key)) return;
                if (state[key] === next[key]) return;
                changed[key] = next[key];
            });
            if (!Object.keys(changed).length) return state;
            state = { ...state, ...changed };
            listeners.forEach((listener) => listener(state, changed));
            return state;
        },
        replace(next = {}) {
            state = Object.keys(ATIVIDADES_STATE_DEFAULTS).reduce((out, key) => {
                out[key] = Object.prototype.hasOwnProperty.call(next, key)
                    ? next[key]
                    : cloneDefault(ATIVIDADES_STATE_DEFAULTS[key]);
                return out;
            }, {});
            listeners.forEach((listener) => listener(state, state));
            return state;
        },
        subscribe(listener) {
            if (typeof listener !== 'function') return () => {};
            listeners.add(listener);
            return () => listeners.delete(listener);
        }
    });
}
