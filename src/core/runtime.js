import { aliasGlobal, getSeiPro, globalRef } from './global.js';

export function createRuntime() {
    const isChrome = typeof globalRef.browser === 'undefined';
    if (isChrome && typeof globalRef.chrome !== 'undefined') {
        globalRef.browser = globalRef.chrome;
    }

    function getUrlExtension(url) {
        return globalRef.browser.runtime.getURL(url);
    }

    function getManifestExtension() {
        return globalRef.browser.runtime.getManifest();
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
