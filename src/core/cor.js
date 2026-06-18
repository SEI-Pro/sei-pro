import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Conversão de cores RGB ↔ hex — cluster PURO extraído de sei-functions-pro.js
 * (Fase 6). Sem dependência de DOM, jQuery ou estado global.
 */

export function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? '0' + hex : hex;
}

export function rgbToHex(r, g, b) {
    return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Converte "rgb(r, g, b)" (string) para "#rrggbb".
export function rgbToHexString(string) {
    string = (typeof string !== 'undefined' && string !== null)
        ? string.substring(4, string.length - 1).replace(/ /g, '').split(',')
        : false;
    return (string) ? rgbToHex(parseInt(string[0]), parseInt(string[1]), parseInt(string[2])) : '';
}

// Converte "#rrggbb" para { r, g, b } (ou null se inválido).
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Acrescenta canal alpha (0..1) a uma cor hex "#rrggbb" → "#rrggbbAA".
export function addAlpha(color, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

// Brilho percebido (YIQ) de uma cor hex, 0..255.
export function getBrightnessColor(value) {
    const rgb = hexToRgb(value);
    return Math.round(((parseInt(rgb.r) * 299) + (parseInt(rgb.g) * 587) + (parseInt(rgb.b) * 114)) / 1000);
}

export function installCor() {
    const cor = { componentToHex, rgbToHex, rgbToHexString, hexToRgb, addAlpha, getBrightnessColor };

    getSeiPro().core.cor = cor;

    aliasGlobal('componentToHex', componentToHex);
    aliasGlobal('rgbToHex', rgbToHex);
    aliasGlobal('rgbToHexString', rgbToHexString);
    aliasGlobal('hexToRgb', hexToRgb);
    aliasGlobal('addAlpha', addAlpha);
    aliasGlobal('getBrightnessColor', getBrightnessColor);

    return cor;
}
