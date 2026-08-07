/**
 * Publica o contrato canônico { id, api, install } em SeiPro.features.
 * Tier C may pass `extras` (e.g. useCases, ports) during migration; consumers
 * should prefer `.api`.
 * @see docs/architecture.md
 */
import { getSeiPro } from '../core/global.js';

function toNamespaceKey(id) {
    if (typeof id !== 'string' || !id) return id;
    return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/**
 * @param {{ id: string, api?: object, install?: Function, nsKey?: string, extras?: object }} spec
 * @returns {Readonly<object>}
 */
export function publishFeature(spec = {}) {
    const id = spec.id;
    if (typeof id !== 'string' || !id) {
        throw new Error('publishFeature: id is required');
    }
    const api = spec.api && typeof spec.api === 'object' ? spec.api : {};
    const install = typeof spec.install === 'function' ? spec.install : function noop() {};
    const extras = spec.extras && typeof spec.extras === 'object' ? spec.extras : {};
    const published = Object.freeze({
        id,
        api,
        install,
        ...extras
    });

    const root = getSeiPro();
    root.features = root.features || {};
    const key = spec.nsKey || toNamespaceKey(id);
    root.features[key] = published;
    return published;
}
