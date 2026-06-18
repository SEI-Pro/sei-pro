/** Shared global reference for content scripts and tests. */
export const globalRef = typeof window !== 'undefined' ? window : globalThis;

export function getSeiPro() {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.core = globalRef.SeiPro.core || {};
    globalRef.SeiPro.sei = globalRef.SeiPro.sei || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.state = globalRef.SeiPro.state || {};
    return globalRef.SeiPro;
}

export function aliasGlobal(name, value) {
    if (typeof globalRef[name] === 'undefined') {
        globalRef[name] = value;
    }
}
