import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Números e matemática de array — cluster PURO extraído de sei-functions-pro.js
 * (Fase 6). Sem dependência de DOM, jQuery, moment ou estado global.
 */

export function arrayMax(arr) {
    return arr.reduce(function (p, v) { return (p > v ? p : v); });
}

export function arrayMin(arr) {
    return arr.reduce(function (p, v) { return (p < v ? p : v); });
}

// Formata número no padrão BR trocando "." por "," (ex.: "1.5" → "1,5").
export function toNumBr(num) {
    return num.toString().replace(/\./g, ',');
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function hasNumber(str) {
    return /\d/.test(str);
}

export function onlyNumber(str) {
    return hasNumber(str) ? str.match(/\d+/g).join('') : str;
}

export function installNumeros() {
    const numeros = {
        arrayMax,
        arrayMin,
        toNumBr,
        isNumeric,
        roundToTwo,
        randomNumber,
        hasNumber,
        onlyNumber
    };

    getSeiPro().core.numeros = numeros;

    aliasGlobal('arrayMax', arrayMax);
    aliasGlobal('arrayMin', arrayMin);
    aliasGlobal('toNumBr', toNumBr);
    aliasGlobal('isNumeric', isNumeric);
    aliasGlobal('roundToTwo', roundToTwo);
    aliasGlobal('randomNumber', randomNumber);
    aliasGlobal('hasNumber', hasNumber);
    aliasGlobal('onlyNumber', onlyNumber);

    return numeros;
}
