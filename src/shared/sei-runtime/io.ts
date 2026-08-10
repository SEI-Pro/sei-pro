// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sei Functions Pro — IO boundary (storage / net / session facades).
 * Prefer SeiPro.core.net / platform when available.
 * Cluster modules still own most AJAX during the carve-out.
 */
export function getSeiFunctionsNet(globalRef = globalThis) {
    return globalRef.SeiPro && globalRef.SeiPro.core && globalRef.SeiPro.core.net;
}

export function getConfigHostSession() {
    try {
        const raw = sessionStorage.getItem('configHost_Pro');
        return raw !== null ? JSON.parse(raw) : false;
    } catch (e) {
        return false;
    }
}

export function setConfigHostSession(host) {
    try {
        sessionStorage.setItem('configHost_Pro', JSON.stringify(host));
        return true;
    } catch (e) {
        return false;
    }
}
