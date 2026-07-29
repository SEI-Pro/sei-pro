/**
 * Projetos — remote IO adapter (atividades backend).
 *
 * When urlServerAtiv + userHashAtiv are available, delegates to the legacy
 * getServerAtividades global. Otherwise callers should use store.dispatchProjetoAction.
 */
import { globalRef } from '../../core/global.js';
import { replaceProjetos } from './store.js';
import { normalizeProjeto } from './domain/model.js';

export function hasRemoteBackend() {
    return !!(globalRef.urlServerAtiv && globalRef.userHashAtiv);
}

/**
 * Prefer remote when available; fall back to local dispatch.
 * `localDispatch` is injected to avoid circular import in tests.
 */
export function runProjetoAction(param, localDispatch) {
    if (hasRemoteBackend() && typeof globalRef.getServerAtividades === 'function') {
        return new Promise((resolve) => {
            // Legacy API is callback-based via ajax success inside getServerAtividades.
            // We still fire it for side effects; local store is updated when panel refreshes.
            try {
                globalRef.getServerAtividades(param, param.action);
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
