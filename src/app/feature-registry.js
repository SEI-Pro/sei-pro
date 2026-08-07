/**
 * Catálogo de features instaláveis por contexto.
 * Cada entrada: { id, configKey?, contexts, install }
 */

const registry = new Map();

export function registerFeature(entry) {
    if (!entry || typeof entry.id !== 'string') {
        throw new Error('registerFeature: id is required');
    }
    if (typeof entry.install !== 'function') {
        throw new Error('registerFeature: install is required for ' + entry.id);
    }
    const contexts = Array.isArray(entry.contexts) ? entry.contexts.slice() : [];
    registry.set(entry.id, {
        id: entry.id,
        configKey: entry.configKey || null,
        contexts,
        install: entry.install
    });
    return entry.id;
}

export function getRegisteredFeature(id) {
    return registry.get(id) || null;
}

export function listRegisteredFeatures() {
    return Array.from(registry.values());
}

export function featuresForContext(contextId) {
    return listRegisteredFeatures().filter((f) => f.contexts.includes(contextId));
}

/** Test/harness helper — clears registry between boots in unit tests. */
export function resetFeatureRegistry() {
    registry.clear();
}
