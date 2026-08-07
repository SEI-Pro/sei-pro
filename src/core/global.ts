// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Shared global reference for content scripts and tests. */
export const globalRef = typeof window !== 'undefined' ? window : globalThis;

/** @returns {import('../types/seipro.js').SeiProNamespace} */
export function getSeiPro() {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.core = globalRef.SeiPro.core || {};
    globalRef.SeiPro.sei = globalRef.SeiPro.sei || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.state = globalRef.SeiPro.state || {};
    return /** @type {import('../types/seipro.js').SeiProNamespace} */ (globalRef.SeiPro);
}

/**
 * Alias legado de feature (ADR-0012): só em `*legacy-api*`, com TODO de remoção.
 * Publicação do núcleo usa `publishGlobal`.
 */
export function aliasGlobal(name, value) {
    if (typeof globalRef[name] === 'undefined') {
        globalRef[name] = value;
    }
}

/**
 * Publicação de namespace do núcleo (ADR-0012): permitida em core / platform / sei.
 * Mesma semântica de escrita que `aliasGlobal` (só define se ausente), nome distinto
 * para separar dívida de feature de exposição legítima do núcleo.
 */
export function publishGlobal(name, value) {
    if (typeof globalRef[name] === 'undefined') {
        globalRef[name] = value;
    }
}
