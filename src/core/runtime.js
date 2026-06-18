import { aliasGlobal, getSeiPro, globalRef } from './global.js';

/**
 * Runtime/URL helpers resilientes aos dois mundos de execução:
 *  - mundo ISOLADO (content scripts do manifest): `chrome`/`browser` existem.
 *  - mundo MAIN da página (arquivos carregados via $.getScript): NÃO existem.
 *
 * `sessionStorage` é compartilhado entre os dois mundos (é o storage da página),
 * então o bundle no mundo isolado publica a URL base e o manifest da extensão lá;
 * o bundle no mundo MAIN lê desse cache (com fallback para URL_SPRO, o mecanismo
 * legado). Assim `getUrlExtension`/`getManifestExtension` funcionam nos dois mundos.
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
        return typeof globalRef.sessionStorage !== 'undefined'
            ? globalRef.sessionStorage.getItem(key)
            : null;
    } catch (e) {
        return null;
    }
}

function sessionSet(key, value) {
    try {
        if (typeof globalRef.sessionStorage !== 'undefined') {
            globalRef.sessionStorage.setItem(key, value);
        }
    } catch (e) { /* sessionStorage indisponível/bloqueado */ }
}

function extBase() {
    if (globalRef.__seiProExtBase) return globalRef.__seiProExtBase;
    const cached = sessionGet(EXT_BASE_KEY);
    if (cached) return cached;
    if (typeof globalRef.URL_SPRO !== 'undefined' && globalRef.URL_SPRO) {
        return globalRef.URL_SPRO;
    }
    return '';
}

export function createRuntime() {
    const isChrome = typeof globalRef.browser === 'undefined';
    if (isChrome && typeof globalRef.chrome !== 'undefined') {
        globalRef.browser = globalRef.chrome;
    }

    // No mundo isolado as APIs existem: cacheia base e manifest para o mundo MAIN.
    const api = runtimeApi();
    if (api && typeof api.getURL === 'function') {
        try {
            const base = api.getURL('');
            globalRef.__seiProExtBase = base;
            sessionSet(EXT_BASE_KEY, base);
        } catch (e) { /* ignore */ }
    } else if (!globalRef.__seiProExtBase) {
        // Mundo MAIN sem chrome.* — deriva a base do próprio <script> do bundle
        // (chrome-extension://ID/js/core-stack.bundle.js). Fonte confiável que não
        // depende do timing do cache em sessionStorage do mundo isolado.
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
        if (rt && typeof rt.getURL === 'function') {
            return rt.getURL(url);
        }
        const base = extBase();
        if (!base) {
            // Sem chrome.* e sem base em cache/currentScript/URL_SPRO. Retornar
            // `url` relativo resolveria contra a origem do SEI (recurso errado /
            // 404) silenciosamente — falhar explicitamente é mais seguro.
            throw new Error(
                'SeiPro.getUrlExtension: base da extensão indisponível no mundo MAIN ' +
                '(cache de sessionStorage vazio, sem chrome.runtime e sem URL_SPRO).'
            );
        }
        return base + url;
    }

    function getManifestExtension() {
        const rt = runtimeApi();
        if (rt && typeof rt.getManifest === 'function') {
            return rt.getManifest();
        }
        if (globalRef.__seiProExtManifest) return globalRef.__seiProExtManifest;
        const cached = sessionGet(EXT_MANIFEST_KEY);
        if (cached) {
            try {
                return JSON.parse(cached);
            } catch (e) { /* ignore */ }
        }
        return {};
    }

    function pathExtensionSEIPro() {
        return getUrlExtension('js/sei-pro.js').toString().replace('js/sei-pro.js', '');
    }

    const runtime = {
        isChrome,
        getUrlExtension,
        getManifestExtension,
        pathExtensionSEIPro
    };

    getSeiPro().core.runtime = runtime;

    aliasGlobal('getUrlExtension', getUrlExtension);
    aliasGlobal('getManifestExtension', getManifestExtension);
    aliasGlobal('pathExtensionSEIPro', pathExtensionSEIPro);

    return runtime;
}
