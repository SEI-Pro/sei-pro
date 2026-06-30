import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';
import { isJson } from '../core/serial.js';

/**
 * Wrappers síncronos de WEB STORAGE da página (localStorage/sessionStorage) com
 * (de)serialização JSON. Camada de plataforma — isolated-world.
 *
 * NÃO confundir com SeiPro.core.storage (fachada de chrome.storage delegada ao
 * service worker). Estes operam no storage da própria aba.
 *
 * Origem: dist/js/sei-functions-pro.js (5733-5780). Quirk preservado verbatim:
 *  - localStorageRestorePro retorna `null` para chave AUSENTE (isJson(null) é true,
 *    pois JSON.parse("null") === null) e `false` só para string não-JSON. É por isso
 *    que hybridStorageRestorePro testa `!== null`: chave ausente cai para o session.
 */
export function installWebstore() {
    const local = () => globalRef.localStorage;
    const session = () => globalRef.sessionStorage;

    function localStorageRestorePro(item) {
        return isJson(local().getItem(item)) ? JSON.parse(local().getItem(item)) : false;
    }
    function localStorageStorePro(item, result) {
        local().setItem(item, JSON.stringify(result));
    }
    function localStorageRemovePro(item) {
        local().removeItem(item);
    }
    function sessionStorageRestorePro(item) {
        return JSON.parse(session().getItem(item));
    }
    function sessionStorageStorePro(item, result) {
        try {
            session().setItem(item, JSON.stringify(result));
        } catch (e) {
            // Cota do sessionStorage (~5MB/origin) estourada. Se o valor for um array
            // que acumula (ex.: dadosSessionProcessoPro, uma entrada por processo
            // visitado), descarta as entradas MAIS ANTIGAS (início do array) e retenta,
            // preservando as mais recentes. Antes a gravação inteira era perdida em
            // silêncio — o cache parava de atualizar assim que enchia.
            if (Array.isArray(result) && result.length > 1) {
                let trimmed = result;
                for (let attempt = 0; attempt < 16 && trimmed.length > 1; attempt++) {
                    trimmed = trimmed.slice(Math.ceil(trimmed.length / 2)); // mantém a metade recente
                    try {
                        session().setItem(item, JSON.stringify(trimmed));
                        console.warn('[SeiPro] sessionStorage cheio em "' + item + '": entradas antigas podadas, mantidas ' + trimmed.length + '.');
                        return;
                    } catch (e2) { /* ainda não coube — continua podando */ }
                }
            }
            console.warn('[SeiPro] sessionStorage cheio: gravação de "' + item + '" descartada.');
        }
    }
    function sessionStorageRemovePro(item) {
        session().removeItem(item);
    }
    function hybridStorageRestorePro(item) {
        if (localStorageRestorePro(item) !== null) return localStorageRestorePro(item);
        if (sessionStorageRestorePro(item) !== null) return sessionStorageRestorePro(item);
        return false;
    }
    function hybridStorageRemovePro(item) {
        if (localStorageRemovePro(item) !== null) return localStorageRemovePro(item);
        if (sessionStorageRemovePro(item) !== null) return sessionStorageRemovePro(item);
        return false;
    }
    function hybridStorageStorePro(item, result) {
        try {
            localStorageStorePro(item, result);
        } catch (e) {
            sessionStorageStorePro(item, result);
        }
        return true;
    }

    const webstore = {
        localStorageRestorePro, localStorageStorePro, localStorageRemovePro,
        sessionStorageRestorePro, sessionStorageStorePro, sessionStorageRemovePro,
        hybridStorageRestorePro, hybridStorageRemovePro, hybridStorageStorePro
    };
    getSeiPro().core.webstore = webstore;

    aliasGlobal('localStorageRestorePro', localStorageRestorePro);
    aliasGlobal('localStorageStorePro', localStorageStorePro);
    aliasGlobal('localStorageRemovePro', localStorageRemovePro);
    aliasGlobal('sessionStorageRestorePro', sessionStorageRestorePro);
    aliasGlobal('sessionStorageStorePro', sessionStorageStorePro);
    aliasGlobal('sessionStorageRemovePro', sessionStorageRemovePro);
    aliasGlobal('hybridStorageRestorePro', hybridStorageRestorePro);
    aliasGlobal('hybridStorageRemovePro', hybridStorageRemovePro);
    aliasGlobal('hybridStorageStorePro', hybridStorageStorePro);

    return webstore;
}
