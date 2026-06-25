import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';

/**
 * Runtime/URL helpers — isolated-world only.
 *
 * Pós big-bang do núcleo: NÃO há mais mundo MAIN. Todo o código (core + legado)
 * roda no mundo isolado, onde `chrome`/`browser` sempre existem. Os fallbacks de
 * dois mundos (cache em sessionStorage, document.currentScript, URL_SPRO) foram
 * removidos por serem código morto nesta arquitetura.
 */

function runtimeApi() {
    if (typeof globalRef.browser !== 'undefined' && globalRef.browser.runtime) {
        return globalRef.browser.runtime;
    }
    if (typeof globalRef.chrome !== 'undefined' && globalRef.chrome.runtime) {
        return globalRef.chrome.runtime;
    }
    return null;
}

export function createRuntime() {
    const isChrome = typeof globalRef.browser === 'undefined';
    if (isChrome && typeof globalRef.chrome !== 'undefined') {
        globalRef.browser = globalRef.chrome;
    }

    function getUrlExtension(url) {
        const rt = runtimeApi();
        if (rt && typeof rt.getURL === 'function') return rt.getURL(url);
        throw new Error('SeiPro.getUrlExtension: chrome.runtime indisponível no mundo isolado.');
    }

    function getManifestExtension() {
        const rt = runtimeApi();
        return rt && typeof rt.getManifest === 'function' ? rt.getManifest() : {};
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
