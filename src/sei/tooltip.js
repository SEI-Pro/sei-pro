import { aliasGlobal, getSeiPro } from '../core/global.js';
import { removeAcentos } from '../core/util.js';
import { extractOnlyAlphaNum } from '../core/texto.js';
import { isJson } from '../core/serial.js';

/**
 * Parsing das strings `infraTooltipMostrar(...)` do SEI (tooltips de processo).
 * Origem: sei-functions-pro.js. De-jQueryficado: o decode de entidades HTML
 * ($("<div/>").html(x).text()) virou um <div>.textContent nativo.
 */
function decodeHtmlText(html) {
    const d = document.createElement('div');
    d.innerHTML = html;
    return d.textContent;
}

export function installTooltip() {
    function extractTooltip(elem) {
        const decoded = decodeHtmlText(
            elem.replace('return infraTooltipMostrar(', '').replace(');', '').replace(',', ' ').replace(/["']/g, '')
        );
        return extractOnlyAlphaNum(removeAcentos(decoded));
    }

    function extractTooltipToArray(elem) {
        let e = decodeHtmlText(elem);
        e = e.replace(/<[^>]*>?/gm, '');
        e = removeAcentos(e);
        e = e.replace('return infraTooltipMostrar(', '').replace(');', '').replace(/["']/g, '"');
        const array = (e != '' && isJson('[' + e + ']')) ? JSON.parse('[' + e + ']') : [];
        return (array.length > 0) ? array : false;
    }

    const tooltip = { extractTooltip, extractTooltipToArray };
    getSeiPro().sei.tooltip = tooltip;
    aliasGlobal('extractTooltip', extractTooltip);
    aliasGlobal('extractTooltipToArray', extractTooltipToArray);
    return tooltip;
}
