import { getSeiPro } from '../core/global.js';

/**
 * Helpers puros de docs-lote (mapas de caracteres / título).
 * Antes em core/; agora em shared/. Consumido via SeiPro.core.docslote ou ESM.
 */

// Mapa de caracteres acentuados/especiais → entidades HTML.
export const docsLoteSpecialChars = {"\u00C0":"&Agrave;","\u00C1":"&Aacute;","\u00C2":"&Acirc;","\u00C3":"&Atilde;","\u00C4":"&Auml;","\u00C5":"&Aring;","\u00E0":"&agrave;","\u00E1":"&aacute;","\u00E2":"&acirc;","\u00E3":"&atilde;","\u00E4":"&auml;","\u00E5":"&aring;","\u00C6":"&AElig;","\u00E6":"&aelig;","\u00DF":"&szlig;","\u00C7":"&Ccedil;","\u00E7":"&ccedil;","\u00C8":"&Egrave;","\u00C9":"&Eacute;","\u00CA":"&Ecirc;","\u00CB":"&Euml;","\u00E8":"&egrave;","\u00E9":"&eacute;","\u00EA":"&ecirc;","\u00EB":"&euml;","\u0192":"&#131;","\u00CC":"&Igrave;","\u00CD":"&Iacute;","\u00CE":"&Icirc;","\u00CF":"&Iuml;","\u00EC":"&igrave;","\u00ED":"&iacute;","\u00EE":"&icirc;","\u00EF":"&iuml;","\u00D1":"&Ntilde;","\u00F1":"&ntilde;","\u00D2":"&Ograve;","\u00D3":"&Oacute;","\u00D4":"&Ocirc;","\u00D5":"&Otilde;","\u00D6":"&Ouml;","\u00F2":"&ograve;","\u00F3":"&oacute;","\u00F4":"&ocirc;","\u00F5":"&otilde;","\u00F6":"&ouml;","\u00D8":"&Oslash;","\u00F8":"&oslash;","\u0152":"&#140;","\u0153":"&#156;","\u0160":"&#138;","\u0161":"&#154;","\u00D9":"&Ugrave;","\u00DA":"&Uacute;","\u00DB":"&Ucirc;","\u00DC":"&Uuml;","\u00F9":"&ugrave;","\u00FA":"&uacute;","\u00FB":"&ucirc;","\u00FC":"&uuml;","\u00B5":"&#181;","\u00D7":"&#215;","\u00DD":"&Yacute;","\u0178":"&#159;","\u00FD":"&yacute;","\u00FF":"&yuml;","\u00B0":"&#176;","\u00BA":"&#176;","\u2020":"&#134;","\u2021":"&#135;","\u00B1":"&#177;","\u00AB":"&#171;","\u00BB":"&#187;","\u00BF":"&#191;","\u00A1":"&#161;","\u00B7":"&#183;","\u2022":"&#149;","\u2122":"&#153;","\u00A9":"&copy;","\u00AE":"&reg;","\u00A7":"&#167;","\u00B6":"&#182;"};

// Mapa de normalização (remoção de acentos) para CSV em UTF-8.
export const docsLoteNormalCharsUtf8 = {"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Æ":"_","æ":"_","ß":"B","Ç":"C","ç":"c","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","ƒ":"f","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","Ø":"_","ø":"_","Œ":"_","œ":"_","Š":"S","š":"S","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","µ":"u","×":"_","Ý":"Y","Ÿ":"Y","ý":"y","ÿ":"y","°":"","º":"","†":"_","‡":"_","±":"_","«":"_","»":"_","¿":"_","¡":"_","·":"_","•":"_","™":"_","©":"_","®":"_","§":"_","¶":"_"};

// Mapa de normalização para CSV em ISO-8859-1.
export const docsLoteNormalCharsIso = {"\u00C0":"A","\u00C1":"A","\u00C2":"A","\u00C3":"A","\u00C4":"A","\u00C5":"A","\u00E0":"a","\u00E1":"a","\u00E2":"a","\u00E3":"a","\u00E4":"a","\u00E5":"a","\u00C6":"_","\u00E6":"_","\u00DF":"B","\u00C7":"C","\u00E7":"c","\u00C8":"E","\u00C9":"E","\u00CA":"E","\u00CB":"E","\u00E8":"e","\u00E9":"e","\u00EA":"e","\u00EB":"e","\u0192":"f","\u00CC":"I","\u00CD":"I","\u00CE":"I","\u00CF":"I","\u00EC":"i","\u00ED":"i","\u00EE":"i","\u00EF":"i","\u00D1":"N","\u00F1":"n","\u00D2":"O","\u00D3":"O","\u00D4":"O","\u00D5":"O","\u00D6":"O","\u00F2":"o","\u00F3":"o","\u00F4":"o","\u00F5":"o","\u00F6":"o","\u00D8":"_","\u00F8":"_","\u0152":"_","\u0153":"_","\u0160":"S","\u0161":"S","\u00D9":"U","\u00DA":"U","\u00DB":"U","\u00DC":"U","\u00F9":"u","\u00FA":"u","\u00FB":"u","\u00FC":"u","\u00B5":"u","\u00D7":"_","\u00DD":"Y","\u0178":"Y","\u00FD":"y","\u00FF":"y","\u00B0":"","\u00BA":"","\u2020":"_","\u2021":"_","\u00B1":"_","\u00AB":"_","\u00BB":"_","\u00BF":"_","\u00A1":"_","\u00B7":"_","\u2022":"_","\u2122":"_","\u00A9":"_","\u00AE":"_","\u00A7":"_","\u00B6":"_"};

// Seleciona o mapa de normalização conforme o encoding detectado do CSV.
export function getDocsLoteNormalChars(encoding) {
    return encoding === 'utf-8' ? docsLoteNormalCharsUtf8 : docsLoteNormalCharsIso;
}

// True se o texto contém algum caractere acentuado/especial (conforme o mapa
// de normalização do encoding). Espelha o teste do legado (match não-global).
export function hasDocsLoteSpecialChars(text, encoding) {
    if (typeof text !== 'string' || text === '') return false;
    var map = getDocsLoteNormalChars(encoding);
    var regex = new RegExp(Object.keys(map).join('|'));
    return regex.test(text);
}

// Substitui caracteres especiais pelas entidades HTML (mapa specialChars, global).
export function encodeDocsLoteSpecialChars(text) {
    if (typeof text !== 'string') return text;
    var regex = new RegExp(Object.keys(docsLoteSpecialChars).join('|'), 'g');
    return text.replace(regex, function (match) { return docsLoteSpecialChars[match]; });
}

// Extrai {nrSEI, nomeDocumento} do título "<algo> - <nrSEI> - <nomeDocumento>".
// Retorna false em cada campo ausente, espelhando a semântica do legado.
export function parseDocsLoteDocTitle(docTitle) {
    if (typeof docTitle !== 'string' || docTitle === '') {
        return { nrSEI: false, nomeDocumento: false };
    }
    var parts = docTitle.split('-');
    return {
        nrSEI: typeof parts[1] !== 'undefined' ? parts[1].trim() : false,
        nomeDocumento: typeof parts[2] !== 'undefined' ? parts[2].trim() : false
    };
}

export function installDocsLote() {
    const docslote = {
        docsLoteSpecialChars,
        docsLoteNormalCharsUtf8,
        docsLoteNormalCharsIso,
        getDocsLoteNormalChars,
        hasDocsLoteSpecialChars,
        encodeDocsLoteSpecialChars,
        parseDocsLoteDocTitle
    };

    getSeiPro().core.docslote = docslote;

    return docslote;
}
