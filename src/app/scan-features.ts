// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Discovery helpers for feature descriptors (ADR-0004).
 *
 * Runtime (browser) cannot scan the filesystem. Composition roots import
 * individual `feature.ts` modules. Node tooling uses
 * `scripts/lib/scan-feature-descriptors.mjs` (re-exported below for tests).
 */
import { featuresForContext, listRegisteredFeatures } from './feature-registry.js';
import { FEATURE_CONTEXT_IDS } from '../types/architecture-contexts.js';

/** Context ids accepted in descriptors (aligned with src/sei/pages.ts). */
export const KNOWN_CONTEXT_IDS = FEATURE_CONTEXT_IDS;

/**
 * Inverse projection: context → feature ids from the in-memory registry.
 * Prefer this over hand-maintained lists once descriptors are registered.
 */
export function featureIdsForContext(contextId) {
    return featuresForContext(contextId).map((f) => f.id);
}

/**
 * Build context → feature ids from an array of descriptor-like objects
 * (e.g. results of the Node scanner, or registered features).
 */
export function contextsMapFromDescriptors(descriptors) {
    const map = Object.create(null);
    for (const id of KNOWN_CONTEXT_IDS) {
        map[id] = [];
    }
    for (const d of descriptors || []) {
        const contexts = Array.isArray(d.contexts) ? d.contexts : [];
        for (const ctx of contexts) {
            if (!map[ctx]) map[ctx] = [];
            if (d.id && !map[ctx].includes(d.id)) map[ctx].push(d.id);
        }
    }
    for (const id of Object.keys(map)) {
        map[id].sort();
    }
    return map;
}

/** Snapshot of what is currently registered (for diagnostics / tests). */
export function listRegisteredDescriptorSummaries() {
    return listRegisteredFeatures().map((f) => ({
        id: f.id,
        contexts: f.contexts.slice(),
        configKey: f.configKey
    }));
}
