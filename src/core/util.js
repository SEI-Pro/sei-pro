import { aliasGlobal, getSeiPro } from './global.js';

export function compareVersionNumbers(v1, v2) {
    function isPositiveInteger(x) {
        return /^\d+$/.test(x);
    }

    const v1parts = v1.split('.');
    const v2parts = v2.split('.');

    function validateParts(parts) {
        for (let i = 0; i < parts.length; ++i) {
            if (!isPositiveInteger(parts[i])) return false;
        }
        return true;
    }
    if (!validateParts(v1parts) || !validateParts(v2parts)) return NaN;

    for (let j = 0; j < v1parts.length; ++j) {
        if (v2parts.length === j) return 1;
        if (v1parts[j] === v2parts[j]) continue;
        if (v1parts[j] > v2parts[j]) return 1;
        return -1;
    }
    if (v1parts.length !== v2parts.length) return -1;
    return 0;
}

export function getParamsUrlPro(url) {
    const params = {};
    if (typeof url !== 'undefined' && url.indexOf('?') !== -1 && url.indexOf('&') !== -1) {
        const vars = url.split('?')[1].split('&');
        for (let i = 0; i < vars.length; i++) {
            const pair = vars[i].split('=');
            const key = pair.shift();
            let value = pair.join('=');
            if (typeof value === 'undefined') {
                value = '';
            }
            value = value.replace(/\+/g, ' ');
            try {
                value = decodeURIComponent(value);
            } catch (error) {
                console.warn('Malformed URL parameter ignored in getParamsUrlPro:', value, error);
            }
            params[key] = value;
        }
        return params;
    }
    return false;
}

export function removeAcentos(str) {
    return (typeof str !== 'undefined' && str !== null && typeof str.normalize === 'function')
        ? str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : '';
}

export function romanToInt(s) {
    const mapRoman = new Map();
    mapRoman.set('I', 1);
    mapRoman.set('V', 5);
    mapRoman.set('X', 10);
    mapRoman.set('L', 50);
    mapRoman.set('C', 100);
    mapRoman.set('D', 500);
    mapRoman.set('M', 1000);
    let result = 0;
    if (s) {
        const s1 = s.split('');
        s1.forEach(function (e, idx) {
            result += mapRoman.get(e) < mapRoman.get(s1[idx + 1]) ? -mapRoman.get(e) : mapRoman.get(e);
        });
    }
    return result;
}

export function capitalizeFirstLetter(string) {
    if (!string || typeof string !== 'string' || string.trim() === '') {
        return '';
    }
    const excetWords = ['a', '\u00E0', 'algo', 'algu\u00E9m', 'algum', 'alguma', 'algumas', 'alguns', 'ao', 'aos', 'aquela', 'aquelas', 'aquele', 'aqueles', 'aquilo', 'as', '\u00E0s', 'cada', 'certa', 'certas', 'certo', 'certos', 'com', 'comigo', 'como', 'conosco', 'consigo', 'contigo', 'convosco', 'cuja', 'cujas', 'cujo', 'cujos', 'da', 'das', 'de', 'dessa', 'dessas', 'desse', 'desses', 'desta', 'destas', 'do', 'dos', 'dum', 'duma', 'dumas', 'duns', 'e', '\u00E9', 'ela', 'elas', 'ele', 'eles', 'em', 'entre', 'essa', 'essas', 'esse', 'esses', 'esta', 'estas', 'este', 'estes', 'eu', 'isso', 'isto', 'la', 'las', 'lhe', 'lhes', 'lo', 'los', 'me', 'mesma', 'mesmas', 'mesmo', 'mesmos', 'meu', 'meus', 'mim', 'minha', 'minhas', 'muita', 'muitas', 'muito', 'muitos', 'na', 'nada', 'n\u00E3o', 'nas', 'nenhum', 'nenhuma', 'nenhumas', 'nenhuns', 'ningu\u00E9m', 'no', 'nos', 'n\u00F3s', 'nossa', 'nossas', 'nosso', 'nossos', 'num', 'numa', 'numas', 'nuns', 'o', 'onde', 'os', 'ou', 'outra', 'outras', 'outrem', 'outro', 'outros', 'para', 'pela', 'pelas', 'pelo', 'por', 'pouca', 'poucas', 'pouco', 'poucos', 'quais', 'quaisquer', 'qual', 'qualquer', 'quando', 'quanta', 'quantas', 'quanto', 'quantos', 'que', 'quem', 's\u00E3o', 'se', 'seja', 'sem', 'seu', 'seus', 'si', 'sob', 'sobre', 'sua', 'suas', 'tanta', 'tantas', 'tanto', 'tantos', 'te', 'teu', 'teus', 'ti', 'toda', 'todas', 'todo', 'todos', 'tu', 'tua', 'tuas', 'tudo', 'um', 'uma', 'umas', 'uns', 'v\u00E1ria', 'v\u00E1rias', 'v\u00E1rio', 'v\u00E1rios', 'voc\u00EA', 'voc\u00EAs', 'vos', 'v\u00F3s', 'vossa', 'vossas', 'vosso', 'vossos'];
    if (string.indexOf(' ') === -1) {
        return string[0].toUpperCase() + string.substring(1).toLowerCase();
    }
    return string.split(' ').map(function (s, index) {
        if (excetWords.includes(s.toLowerCase()) && index !== 0) {
            return s.toLowerCase();
        }
        if (romanToInt(s) > 0) {
            return s.toUpperCase();
        }
        return s[0].toUpperCase() + s.substring(1).toLowerCase();
    }).join(' ');
}

export function randomString(length) {
    let result = '';
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = length; i > 0; --i) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

export function uniqPro(a) {
    return a.sort().filter(function (item, pos, ary) {
        return !pos || item !== ary[pos - 1];
    });
}

export function installUtil() {
    const util = {
        compareVersionNumbers,
        getParamsUrlPro,
        removeAcentos,
        romanToInt,
        capitalizeFirstLetter,
        randomString,
        uniqPro
    };

    getSeiPro().core.util = util;

    aliasGlobal('compareVersionNumbers', compareVersionNumbers);
    aliasGlobal('getParamsUrlPro', getParamsUrlPro);
    aliasGlobal('removeAcentos', removeAcentos);
    aliasGlobal('romanToInt', romanToInt);
    aliasGlobal('capitalizeFirstLetter', capitalizeFirstLetter);
    aliasGlobal('randomString', randomString);
    aliasGlobal('uniqPro', uniqPro);

    return util;
}
