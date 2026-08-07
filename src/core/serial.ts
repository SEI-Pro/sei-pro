// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { publishGlobal, getSeiPro } from './global.js';

/**
 * Parse / serialização — JSON e base64. Cluster PURO extraído de
 * sei-functions-pro.js (Fase 6). Sem dependência de DOM, jQuery ou estado global.
 */

export function isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

// Faz parse só se o resultado for um objeto puro (não array); senão retorna false.
export function tryParseJsonObject(jsonString) {
    try {
        const o = JSON.parse(jsonString);
        if (o && typeof o === 'object' && !Array.isArray(o)) {
            return o;
        }
    } catch (e) { /* ignore */ }
    return false;
}

// Converte strings "true"/"false" em booleanos ao reserializar o objeto.
export function convertJsonBools(obj) {
    return JSON.parse(JSON.stringify(obj), (k, v) => v === 'true' ? true : v === 'false' ? false : v);
}

export function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}

export function installSerial() {
    const serial = { isJson, tryParseJsonObject, convertJsonBools, isBase64 };

    getSeiPro().core.serial = serial;

    publishGlobal('isJson', isJson);
    publishGlobal('tryParseJsonObject', tryParseJsonObject);
    publishGlobal('convertJsonBools', convertJsonBools);
    publishGlobal('isBase64', isBase64);

    return serial;
}
