// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Helpers utilitários puros diversos extraídos de sei-functions-pro.js.
 * Sem DOM/jQuery/estado. `removeDuplicatesArray` foi de-jQueryficada
 * ($.each/$.grep → forEach/some), preservando assinatura e comportamento.
 */

export function checkObjHasProperty(obj, key) {
    let ret = true;
    for (let i = 0; i < obj.length; i++) {
        if (typeof obj[i][key] === 'undefined' || !obj[i].hasOwnProperty(key)) {
            ret = false;
            break;
        }
    }
    return ret;
}

export function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
        return '%' + c.charCodeAt(0).toString(16);
    });
}

export function infraFormatarTamanhoBytes(numBytes) {
    let ret = null;
    if (numBytes > 1099511627776) ret = Math.round(numBytes / 1099511627776 * 100) / 100 + ' Tb';
    else if (numBytes > 1073741824) ret = Math.round(numBytes / 1073741824 * 100) / 100 + ' Gb';
    else if (numBytes > 1048576) ret = Math.round(numBytes / 1048576 * 100) / 100 + ' Mb';
    else ret = Math.round(numBytes / 1024 * 100) / 100 + ' Kb';
    return ret;
}

export function prepCSVRow(arr, columnCount, initial) {
    let row = '';
    const delimeter = ';';
    const newLine = '\r\n';
    function splitArray(_arr, _count) {
        let splitted = [];
        const result = [];
        _arr.forEach(function (item, idx) {
            if ((idx + 1) % _count === 0) {
                splitted.push(item);
                result.push(splitted);
                splitted = [];
            } else {
                splitted.push(item);
            }
        });
        return result;
    }
    const plainArr = splitArray(arr, columnCount);
    plainArr.forEach(function (arrItem) {
        arrItem.forEach(function (item, idx) {
            row += item + ((idx + 1) === arrItem.length ? '' : delimeter);
        });
        row += newLine;
    });
    return initial + row;
}

export function removeDuplicatesArray(list, ref) {
    const result = [];
    (list || []).forEach(function (e) {
        if (!result.some(function (item) { return item[ref] === e[ref]; })) result.push(e);
    });
    return result;
}

export function trycatch(func, fail) {
    try { return func(); } catch (e) { return fail; }
}

// Remove caracteres zero-width (U+200B..U+200F e U+FEFF). Regex construída a
// partir dos code points para não embutir caracteres invisíveis no fonte.
const ZERO_WIDTH_CODES = [0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0xfeff];
const ZERO_WIDTH_REGEX = new RegExp(
    '[' + ZERO_WIDTH_CODES.map(function (c) { return '\\u' + c.toString(16).padStart(4, '0'); }).join('') + ']+',
    'g'
);
export function zeroWidthTrim(stringToTrim) {
    return stringToTrim.replace(ZERO_WIDTH_REGEX, '');
}

export function checkBrowser() {
    let browser = '';
    const c = navigator.userAgent.search('Chrome');
    const f = navigator.userAgent.search('Firefox');
    const m8 = navigator.userAgent.search('MSIE 8.0');
    const m9 = navigator.userAgent.search('MSIE 9.0');
    if (c > -1) browser = 'Chrome';
    else if (f > -1) browser = 'Firefox';
    else if (m9 > -1) browser = 'MSIE 9.0';
    else if (m8 > -1) browser = 'MSIE 8.0';
    return browser;
}

export function installHelpers() {
    const helpers = {
        checkObjHasProperty, fixedEncodeURIComponent, infraFormatarTamanhoBytes,
        prepCSVRow, removeDuplicatesArray, trycatch, zeroWidthTrim, checkBrowser
    };
    getSeiPro().core.helpers = helpers;
    aliasGlobal('checkObjHasProperty', checkObjHasProperty);
    aliasGlobal('fixedEncodeURIComponent', fixedEncodeURIComponent);
    aliasGlobal('infraFormatarTamanhoBytes', infraFormatarTamanhoBytes);
    aliasGlobal('prepCSVRow', prepCSVRow);
    aliasGlobal('removeDuplicatesArray', removeDuplicatesArray);
    aliasGlobal('trycatch', trycatch);
    aliasGlobal('zeroWidthTrim', zeroWidthTrim);
    aliasGlobal('checkBrowser', checkBrowser);
    return helpers;
}
