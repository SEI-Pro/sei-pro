import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';

/**
 * Runtime/URL helpers resilientes aos DOIS mundos durante a transição:
 *  - mundo ISOLADO (content scripts do manifest): `chrome`/`browser` existem.
 *  - mundo MAIN da página (legado carregado via $.getScript): NÃO existem.
 *
 * NOTA (refundação): o objetivo é eliminar o mundo MAIN (porte do núcleo p/
 * content scripts isolados). Enquanto o legado ainda roda via $.getScript no
 * MAIN, o bundle é injetado também lá (bloco world:MAIN) e PRECISA resolver a
 * base sem chrome.* — via cache em sessionStorage (publicado pelo mundo isolado),
 * pelo src do próprio <script> do bundle, ou por URL_SPRO (legado). Quando o
 * núcleo migrar para isolated-only, esses fallbacks ficam dormentes.
 */

const EXT_BASE_KEY = 'seiProExtBaseUrl';
const EXT_MANIFEST_KEY = 'seiProExtManifest';

function runtimeApi() {
    if (typeof globalRef.browser !== 'undefined' && globalRef.browser.runtime) {
        return globalRef.browser.runtime;
    }
    if (typeof globalRef.chrome !== 'undefined' && globalRef.chrome.runtime) {
        return globalRef.chrome.runtime;
    }
    return null;
}

function sessionGet(key) {
    try {
        return typeof globalRef.sessionStorage !== 'undefined' ? globalRef.sessionStorage.getItem(key) : null;
    } catch (e) { return null; }
}
function sessionSet(key, value) {
    try {
        if (typeof globalRef.sessionStorage !== 'undefined') globalRef.sessionStorage.setItem(key, value);
    } catch (e) { /* indisponível */ }
}

function extBase() {
    if (globalRef.__seiProExtBase) return globalRef.__seiProExtBase;
    const cached = sessionGet(EXT_BASE_KEY);
    if (cached) return cached;
    if (typeof globalRef.URL_SPRO !== 'undefined' && globalRef.URL_SPRO) return globalRef.URL_SPRO;
    return '';
}

export function createRuntime() {
    const isChrome = typeof globalRef.browser === 'undefined';
    if (isChrome && typeof globalRef.chrome !== 'undefined') {
        globalRef.browser = globalRef.chrome;
    }

    const api = runtimeApi();
    if (api && typeof api.getURL === 'function') {
        // Mundo isolado: publica base + manifest para o mundo MAIN ler.
        try {
            const base = api.getURL('');
            globalRef.__seiProExtBase = base;
            sessionSet(EXT_BASE_KEY, base);
        } catch (e) { /* ignore */ }
    } else if (!globalRef.__seiProExtBase) {
        // Mundo MAIN sem chrome.*: deriva a base do src do próprio bundle.
        try {
            const self = typeof document !== 'undefined' ? document.currentScript : null;
            const src = self && self.src ? String(self.src) : '';
            const m = src.match(/^(.*\/)js\/core-stack\.bundle\.js(?:[?#].*)?$/);
            if (m) {
                globalRef.__seiProExtBase = m[1];
                sessionSet(EXT_BASE_KEY, m[1]);
            }
        } catch (e) { /* ignore */ }
    }
    if (api && typeof api.getManifest === 'function') {
        try {
            const manifest = api.getManifest();
            globalRef.__seiProExtManifest = manifest;
            sessionSet(EXT_MANIFEST_KEY, JSON.stringify(manifest));
        } catch (e) { /* ignore */ }
    }

    function getUrlExtension(url) {
        const rt = runtimeApi();
        if (rt && typeof rt.getURL === 'function') return rt.getURL(url);
        const base = extBase();
        if (!base) {
            throw new Error(
                'SeiPro.getUrlExtension: base da extensão indisponível ' +
                '(sem chrome.runtime, sem cache em sessionStorage, sem URL_SPRO).'
            );
        }
        return base + url;
    }

    function getManifestExtension() {
        const rt = runtimeApi();
        if (rt && typeof rt.getManifest === 'function') return rt.getManifest();
        if (globalRef.__seiProExtManifest) return globalRef.__seiProExtManifest;
        const cached = sessionGet(EXT_MANIFEST_KEY);
        if (cached) {
            try { return JSON.parse(cached); } catch (e) { /* ignore */ }
        }
        return {};
    }

    function pathExtensionSEIPro() {
        return getUrlExtension('js/sei-pro.js').toString().replace('js/sei-pro.js', '');
    }

    const runtime = { isChrome, getUrlExtension, getManifestExtension, pathExtensionSEIPro };
    getSeiPro().core.runtime = runtime;

    aliasGlobal('getUrlExtension', getUrlExtension);
    aliasGlobal('getManifestExtension', getManifestExtension);
    aliasGlobal('pathExtensionSEIPro', pathExtensionSEIPro);

    return runtime;
}
