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

// Média dos elementos (parseInt base 10) de um array.
export function avgArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
        sum += parseInt(array[i], 10);
    }
    return sum / array.length;
}

export function reverseArray(array) {
    return array.map((item, idx) => array[array.length - 1 - idx]);
}

// Converte um array-like (ex.: NodeList, arguments) em Array.
export function toArray(obj) {
    const len = obj.length;
    const arr = new Array(len);
    for (let i = 0; i < len; i++) {
        arr[i] = obj[i];
    }
    return arr;
}

// Minutos decimais → "MM:SS" (com sinal).
export function decimalHourToMinute(minutes) {
    const sign = minutes < 0 ? '-' : '';
    const min = Math.floor(Math.abs(minutes));
    const sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec;
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
        onlyNumber,
        avgArray,
        reverseArray,
        toArray,
        decimalHourToMinute
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
    aliasGlobal('avgArray', avgArray);
    aliasGlobal('reverseArray', reverseArray);
    aliasGlobal('toArray', toArray);
    aliasGlobal('decimalHourToMinute', decimalHourToMinute);

    return numeros;
}
