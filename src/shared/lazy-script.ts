// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
const pendingScripts = new Map();
const documentIds = new WeakMap();
let nextDocumentId = 0;

function documentKey(doc) {
    if (!documentIds.has(doc)) documentIds.set(doc, ++nextDocumentId);
    return documentIds.get(doc);
}

/**
 * Load a page script once and share the in-flight promise between callers.
 * The loader intentionally uses the document that owns the caller's runtime;
 * extension resources are exposed through URL_SPRO by the caller.
 */
export function loadScriptOnce(url, doc = globalThis.document) {
    if (!url) return Promise.reject(new TypeError('A script URL is required'));
    if (!doc) return Promise.reject(new Error('Cannot load a script without a document'));

    const key = `${url}::document-${documentKey(doc)}`;
    if (pendingScripts.has(key)) return pendingScripts.get(key);

    const existing = Array.from(doc.scripts || []).find((script) =>
        script.src === url || script.getAttribute('src') === url
    );
    if (existing?.dataset?.seiproLoaded === 'true') return Promise.resolve(existing);

    const promise = new Promise((resolve, reject) => {
        const script = existing || doc.createElement('script');
        const cleanup = () => {
            script.removeEventListener('load', onLoad);
            script.removeEventListener('error', onError);
        };
        const onLoad = () => {
            cleanup();
            script.dataset.seiproLoaded = 'true';
            resolve(script);
        };
        const onError = () => {
            cleanup();
            pendingScripts.delete(key);
            reject(new Error(`Failed to load script: ${url}`));
        };

        script.addEventListener('load', onLoad, { once: true });
        script.addEventListener('error', onError, { once: true });
        if (!existing) {
            script.src = url;
            (doc.head || doc.documentElement).appendChild(script);
        }
    });

    pendingScripts.set(key, promise);
    return promise;
}
