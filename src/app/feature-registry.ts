// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Catálogo de features instaláveis por contexto (ADR-0004).
 * Entradas vêm de `src/features/<id>/feature.ts` via registerFeature /
 * registerPilotFeatures. Descoberta em Node: scripts/lib/scan-feature-descriptors.mjs.
 * Cada entrada: { id, configKey?, contexts, install, api? }
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
        configKey: entry.configKey == null ? null : entry.configKey,
        contexts,
        install: entry.install,
        api: entry.api && typeof entry.api === 'object' ? entry.api : {}
    });
    return entry.id;
}

/** Register many descriptors (e.g. pilot list or test fixtures). */
export function registerFeatures(entries) {
    for (const entry of entries || []) {
        registerFeature(entry);
    }
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
