// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';
import { compareVersionNumbers } from '../core/util.js';

export function installVersion() {
    function detectNewSEIFromDom() {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) return false;
        return $('#divInfraSidebarMenu ul#infraMenu').length > 0;
    }

    function getSeiVersionPro() {
        return globalRef.sessionStorage.getItem('versaoSei') || false;
    }

    function setSeiVersionPro() {
        const $ = globalRef.jQuery || globalRef.$;
        if (!$) return false;
        let version = $('img[title*="Sistema Eletr\u00F4nico de Informa\u00E7\u00F5es - Vers\u00E3o"]').attr('title');
        version = typeof version !== 'undefined' ? version.match(/[0-9.]/g).join('') : false;
        if (version) {
            globalRef.sessionStorage.setItem('versaoSei', version);
        }
        return version;
    }

    function getIsNewSEI() {
        const isNew = detectNewSEIFromDom();
        if (isNew && typeof globalRef.setOptionsPro === 'function') {
            globalRef.setOptionsPro('isNewSEI', true);
        }
        if (typeof globalRef.getOptionsPro === 'function' && globalRef.getOptionsPro('isNewSEI')) {
            return true;
        }
        return isNew;
    }

    function isSEI5(isNewSEI, version) {
        return !!(isNewSEI && version && compareVersionNumbers(version, '5') >= 0);
    }

    function isAtLeast(version, target) {
        return compareVersionNumbers(version, target) >= 0;
    }

    function resolveVersionFlags() {
        const isNewSEI = getIsNewSEI();
        const version = getSeiVersionPro();
        const isSEI_5 = isSEI5(isNewSEI, version);
        return { isNewSEI, isSEI_5, version };
    }

    const versionApi = {
        detectNewSEIFromDom,
        getSeiVersionPro,
        setSeiVersionPro,
        getIsNewSEI,
        isSEI5,
        isAtLeast,
        resolveVersionFlags
    };

    getSeiPro().sei.version = versionApi;

    aliasGlobal('getSeiVersionPro', getSeiVersionPro);
    aliasGlobal('setSeiVersionPro', setSeiVersionPro);
    aliasGlobal('getIsNewSEI', getIsNewSEI);

    return versionApi;
}
