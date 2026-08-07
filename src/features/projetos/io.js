/**
 * Projetos — remote IO adapter (atividades backend).
 *
 * When the Atividades application is available, delegates to its explicit
 * request port. Otherwise callers use the local project store.
 */
import { globalRef } from '../../core/global.js';
import { replaceProjetos } from './store.js';
import { normalizeProjeto } from './domain/model.js';

export function hasRemoteBackend() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    const state = api && api.state && typeof api.state.get === 'function'
        ? api.state.get()
        : null;
    return !!(state && state.urlServerAtiv && state.userHashAtiv);
}

/**
 * Prefer remote when available; fall back to local dispatch.
 * `localDispatch` is injected to avoid circular import in tests.
 */
function getAtividadesServer() {
    const feature = globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.atividades;
    const api = feature && feature.api;
    if (api && typeof api.legacyRequest === 'function') return api.legacyRequest;
    if (api && typeof api.request === 'function') return api.request;
    return null;
}

export function runProjetoAction(param, localDispatch) {
    const server = getAtividadesServer();
    if (hasRemoteBackend() && server) {
        return new Promise((resolve) => {
            // Legacy API is callback-based via ajax success inside getServerAtividades.
            // We still fire it for side effects; local store is updated when panel refreshes.
            try {
                server(param, param.action);
                resolve({ status: 1, remote: true });
            } catch (e) {
                resolve(localDispatch(param));
            }
        });
    }
    return Promise.resolve(localDispatch(param));
}

/** Merge remote projetos payload into local store. */
export function ingestRemoteProjetos(rows, tipos) {
    const list = Array.isArray(rows) ? rows.map((p) => normalizeProjeto(p)) : [];
    return replaceProjetos(list, tipos);
}

/** Whether the home panel should request projetos from atividades panel fetch. */
export function shouldRequestProjetosFromAtividades() {
    try {
        if (typeof globalRef.verifyConfigValue === 'function') {
            return !!globalRef.verifyConfigValue('gerenciarprojetos');
        }
        if (typeof globalRef.checkConfigValue === 'function') {
            return !!globalRef.checkConfigValue('gerenciarprojetos');
        }
    } catch (e) { /* noop */ }
    return true;
}
