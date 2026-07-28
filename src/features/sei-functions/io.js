/**
 * Sei Functions Pro — IO boundary (thin during big-bang).
 * Prefer SeiPro.core.net / platform when available.
 */
export function getSeiFunctionsNet(globalRef = globalThis) {
    return globalRef.SeiPro && globalRef.SeiPro.core && globalRef.SeiPro.core.net;
}
