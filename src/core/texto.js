import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Utilitários de texto/string — cluster PURO extraído de sei-functions-pro.js
 * (Fase 6: quebra dos god modules em responsabilidades coesas). Sem dependência
 * de DOM, jQuery, moment ou estado global — só entrada → saída.
 */

export function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

// escape() ISO-8859-1 mantendo "+" literal (escape não codifica "+").
export function escapeComponent(str) {
    return escape(str).replace(/\+/g, '%2B');
}

// Corrige texto UTF-8 lido como Latin-1 (mojibake: "Ã§" → "ç"). Só age quando
// detecta o padrão de bytes típico; caso contrário devolve o valor intacto.
export function normalizeMojibakeUtf8(value) {
    value = (typeof value === 'string') ? value : '';
    if (!value) return value;
    if (!/(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{2})/.test(value)) {
        return value;
    }
    try {
        return decodeURIComponent(escape(value));
    } catch (err) {
        if (typeof TextDecoder !== 'undefined' && typeof Uint8Array !== 'undefined') {
            try {
                return new TextDecoder('utf-8').decode(Uint8Array.from(value, function (ch) {
                    return ch.charCodeAt(0);
                }));
            } catch (err2) { /* ignore */ }
        }
    }
    return value;
}

// Linkifica URLs (http/ftp/file) em <a> alvo _blank.
export function replaceTextToUrl(text) {
    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(Rexp, "<a href='$1' target='_blank'>$3</a>");
}

// Extrai cores hexadecimais (#rgb ou #rrggbb) de um texto.
export function extractHexColor(text) {
    return text.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi);
}

// Preenche à esquerda com zeros até `max` dígitos.
export function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad('0' + str, max) : str;
}

export function installTexto() {
    const texto = {
        escapeRegExp,
        escapeComponent,
        normalizeMojibakeUtf8,
        replaceTextToUrl,
        extractHexColor,
        pad
    };

    getSeiPro().core.texto = texto;

    aliasGlobal('escapeRegExp', escapeRegExp);
    aliasGlobal('escapeComponent', escapeComponent);
    aliasGlobal('normalizeMojibakeUtf8', normalizeMojibakeUtf8);
    aliasGlobal('replaceTextToUrl', replaceTextToUrl);
    aliasGlobal('extractHexColor', extractHexColor);
    aliasGlobal('pad', pad);

    return texto;
}
