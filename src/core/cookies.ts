// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { publishGlobal, getSeiPro, globalRef } from './global.js';

/**
 * Helpers de cookie do documento. Origem: sei-functions-pro.js (verbatim).
 */
export function installCookies() {
    const doc = () => globalRef.document;

    function readCookiePro(name) {
        const nameEQ = name + '=';
        const ca = doc().cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    function createCookiePro(name, value, days) {
        let expires = '';
        if (days) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        if (typeof readCookiePro(name) !== 'undefined' && days >= 0) eraseCookiePro(name);
        doc().cookie = name + '=' + value + expires + '; path=/';
    }

    function eraseCookiePro(name) {
        createCookiePro(name, '', -1);
    }

    const cookies = { readCookiePro, createCookiePro, eraseCookiePro };
    getSeiPro().core.cookies = cookies;
    publishGlobal('readCookiePro', readCookiePro);
    publishGlobal('createCookiePro', createCookiePro);
    publishGlobal('eraseCookiePro', eraseCookiePro);
    return cookies;
}
