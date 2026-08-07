/**
 * Boot de contexto: resolve features do registry (ou da lista do contexto)
 * e chama install(ctx) respeitando configKey quando houver.
 */
import { getContext } from './contexts.js';
import { featuresForContext, getRegisteredFeature } from './feature-registry.js';
import { getSeiPro } from '../core/global.js';

function isFeatureEnabled(configKey) {
    if (!configKey) return true;
    const config = getSeiPro().core && getSeiPro().core.config;
    if (!config || typeof config.verifyConfigValue !== 'function') return true;
    try {
        return !!config.verifyConfigValue(configKey);
    } catch (e) {
        return true;
    }
}

/**
 * @param {string} contextId
 * @param {object} [ctx]
 * @returns {{ context: string, installed: string[] }}
 */
export function boot(contextId, ctx = {}) {
    const context = getContext(contextId);
    if (!context) {
        return { context: contextId, installed: [] };
    }

    const fromRegistry = featuresForContext(contextId);
    const ids = fromRegistry.length
        ? fromRegistry.map((f) => f.id)
        : context.features.slice();

    const installed = [];
    const deps = { contextId, root: typeof document !== 'undefined' ? document : null, ...ctx };

    ids.forEach((id) => {
        const entry = getRegisteredFeature(id);
        if (!entry) return;
        if (!isFeatureEnabled(entry.configKey)) return;
        entry.install(deps);
        installed.push(id);
    });

    return { context: contextId, installed };
}
