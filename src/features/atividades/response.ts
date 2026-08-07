// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Backend response normalization, independent of DOM and jQuery. */

export function classifyAtividadesResponse(data, param = {}, mode = '') {
    const payload = data || {};
    if (payload.status === 0 || (Array.isArray(payload) && payload.length === 0)) {
        return Object.freeze({ type: 'error', mode, param, payload });
    }
    if (payload.status_acess === 0) return Object.freeze({ type: 'access-denied', mode, param, payload });
    if (String(mode).startsWith('chart_')) return Object.freeze({ type: 'chart', mode, param, payload });
    if (String(mode).startsWith('config_update_') || String(mode).startsWith('config_new_')) {
        return Object.freeze({ type: 'config', mode, param, payload });
    }
    if (String(mode).includes('monitorados')) return Object.freeze({ type: 'monitorados', mode, param, payload });
    if (String(mode).includes('prescricao')) return Object.freeze({ type: 'prescricao', mode, param, payload });
    if (String(mode).includes('projeto')) return Object.freeze({ type: 'projeto', mode, param, payload });
    if (String(mode).startsWith('report_')) return Object.freeze({ type: 'report', mode, param, payload });
    if (String(mode) === 'panel') return Object.freeze({ type: 'panel', mode, param, payload });
    return Object.freeze({ type: 'operation', mode, param, payload });
}

export function createAtividadesResponseRouter({ resolve = () => null, onUnknown = () => undefined } = {}) {
    return (data, param, mode, context) => {
        const event = classifyAtividadesResponse(data, param, mode);
        const handler = resolve(`response:${event.type}`) || resolve(`response:${mode}`);
        if (typeof handler === 'function') return handler(event, context);
        return onUnknown(event, context);
    };
}
