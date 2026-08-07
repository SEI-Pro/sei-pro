// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
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
    // Log condicionado ao modo debug (SeiPro.core.logger é instalado depois deste
    // módulo, então é lido no momento da chamada). Evita poluir o console — e o
    // coletor de erros do Chrome — com avisos de manutenção de cache em uso normal.
    function debugLog() {
        const logger = getSeiPro().core.logger;
        if (logger && typeof logger.debug === 'function') logger.debug.apply(logger, arguments);
    }

    // Corta um array para caber no storage: primeiro por QUANTIDADE (mantém as
    // entradas mais recentes = fim do array) e depois por TAMANHO serializado
    // (descarta as mais antigas até ficar sob o teto de caracteres). Função pura.
    function boundArrayForStorage(arr, maxEntries, maxChars) {
        let out = arr;
        if (out.length > maxEntries) out = out.slice(out.length - maxEntries);
        while (out.length > 1 && JSON.stringify(out).length > maxChars) {
            out = out.slice(1);
        }
        return out;
    }

    function sessionStorageStorePro(item, result) {
        try {
            session().setItem(item, JSON.stringify(result));
        } catch (e) {
            // Rede de segurança: a cota do sessionStorage (~5MB/origin) estourou apesar
            // do bounding proativo. Se o valor for um array que acumula (ex.:
            // dadosSessionProcessoPro), descarta as entradas MAIS ANTIGAS (início do
            // array) e retenta, preservando as mais recentes. Rebaixado para debug: em
            // uso normal isso não deve mais acontecer (ver sessionStorageStoreBoundedPro).
            if (Array.isArray(result) && result.length > 1) {
                let trimmed = result;
                for (let attempt = 0; attempt < 16 && trimmed.length > 1; attempt++) {
                    trimmed = trimmed.slice(Math.ceil(trimmed.length / 2)); // mantém a metade recente
                    try {
                        session().setItem(item, JSON.stringify(trimmed));
                        debugLog('[SeiPro] sessionStorage: "' + item + '" excedeu a cota; entradas antigas podadas, mantidas ' + trimmed.length + '.');
                        return;
                    } catch (e2) { /* ainda não coube — continua podando */ }
                }
            }
            debugLog('[SeiPro] sessionStorage: gravação de "' + item + '" descartada (cota cheia).');
        }
    }

    // Escrita PROATIVAMENTE limitada para arrays-cache que crescem (ex.: um item por
    // processo visitado). Limita por quantidade e por tamanho ANTES de gravar, de modo
    // que a cota raramente/nunca é atingida — em vez de depender de capturar
    // QuotaExceededError. Para valores não-array, delega ao store comum.
    function sessionStorageStoreBoundedPro(item, result, options) {
        options = options || {};
        const maxEntries = options.maxEntries || 25;
        const maxChars = options.maxChars || 3000000; // ~3MB: folga sob a cota ~5MB
        if (!Array.isArray(result)) { sessionStorageStorePro(item, result); return; }
        const bounded = boundArrayForStorage(result, maxEntries, maxChars);
        if (bounded.length < result.length) {
            debugLog('[SeiPro] sessionStorage: "' + item + '" limitado de ' + result.length + ' para ' + bounded.length + ' entradas (cache proativo).');
        }
        sessionStorageStorePro(item, bounded);
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
        sessionStorageStoreBoundedPro, boundArrayForStorage,
        hybridStorageRestorePro, hybridStorageRemovePro, hybridStorageStorePro
    };
    getSeiPro().core.webstore = webstore;

    aliasGlobal('localStorageRestorePro', localStorageRestorePro);
    aliasGlobal('localStorageStorePro', localStorageStorePro);
    aliasGlobal('localStorageRemovePro', localStorageRemovePro);
    aliasGlobal('sessionStorageRestorePro', sessionStorageRestorePro);
    aliasGlobal('sessionStorageStorePro', sessionStorageStorePro);
    aliasGlobal('sessionStorageStoreBoundedPro', sessionStorageStoreBoundedPro);
    aliasGlobal('sessionStorageRemovePro', sessionStorageRemovePro);
    aliasGlobal('hybridStorageRestorePro', hybridStorageRestorePro);
    aliasGlobal('hybridStorageRemovePro', hybridStorageRemovePro);
    aliasGlobal('hybridStorageStorePro', hybridStorageStorePro);

    return webstore;
}
