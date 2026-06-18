import { aliasGlobal, getSeiPro, globalRef } from './global.js';

export function installBootstrap() {
    function setSessionNameSpace(param) {
        globalRef.sessionStorage.setItem(
            param.NAMESPACE_SPRO !== 'SPro' ? 'new_extension' : 'old_extension',
            JSON.stringify(param)
        );
    }

    function _P() {
        return JSON.parse(globalRef.sessionStorage.getItem('new_extension'));
    }

    function getPathExtensionPro() {
        const $ = globalRef.jQuery || globalRef.$;
        if ($ && $('script[data-config="config-seipro"]').length > 0) {
            return;
        }
        const pathExtensionSEIPro = getSeiPro().core.runtime.pathExtensionSEIPro;
        const getManifestExtension = getSeiPro().core.runtime.getManifestExtension;
        const URL_SPRO = pathExtensionSEIPro();
        const manifest = getManifestExtension();
        setSessionNameSpace({
            URL_SPRO,
            NAMESPACE_SPRO: manifest.short_name,
            URLPAGES_SPRO: 'https://sei-pro.github.io/sei-pro',
            VERSION_SPRO: manifest.version,
            ICON_SPRO: manifest.icons
        });
    }

    const bootstrap = {
        setSessionNameSpace,
        getPathExtensionPro,
        _P
    };

    getSeiPro().core.bootstrap = bootstrap;

    aliasGlobal('setSessionNameSpace', setSessionNameSpace);
    aliasGlobal('getPathExtensionPro', getPathExtensionPro);
    aliasGlobal('_P', _P);

    return bootstrap;
}
