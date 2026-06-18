import { aliasGlobal, getSeiPro } from './global.js';

/**
 * Validação e máscara de identificadores e texto (CPF, CNPJ, PEN, e-mail, URL,
 * escape HTML). Cluster de funções PURAS extraído de sei-functions-pro.js como
 * piloto da Fase 6 (quebra dos god modules em responsabilidades coesas).
 * Sem dependência de DOM, jQuery, moment ou estado global — só entrada → saída.
 */

export function extractCPFs(text) {
    return text.match(/(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))/gi);
}

export function validaCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let result = true;
    [9, 10].forEach(function (j) {
        let soma = 0, r;
        cpf.split(/(?=)/).splice(0, j).forEach(function (e, i) {
            soma += parseInt(e) * ((j + 2) - (i + 1));
        });
        r = soma % 11;
        r = (r < 2) ? 0 : 11 - r;
        if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
}

export function maskCNPJ(text) {
    return !!text ? text.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5') : text;
}

export function maskCPF(text) {
    return !!text ? text.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') : text;
}

export function maskPEN(text) {
    return text.replace(/^(\d{5})(\d{6})(\d{4})(\d{2})/, '$1.$2/$3-$4');
}

export function validateEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

export function escapeHtml(string) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '/': '&#x2F;',
        '`': '&#x60;',
        '=': '&#x3D;'
    };
    return String(string).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}

export function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}

export function installValidacao() {
    const validacao = {
        extractCPFs,
        validaCPF,
        maskCNPJ,
        maskCPF,
        maskPEN,
        validateEmail,
        escapeHtml,
        isValidHttpUrl
    };

    getSeiPro().core.validacao = validacao;

    aliasGlobal('extractCPFs', extractCPFs);
    aliasGlobal('validaCPF', validaCPF);
    aliasGlobal('maskCNPJ', maskCNPJ);
    aliasGlobal('maskCPF', maskCPF);
    aliasGlobal('maskPEN', maskPEN);
    aliasGlobal('validateEmail', validateEmail);
    aliasGlobal('escapeHtml', escapeHtml);
    aliasGlobal('isValidHttpUrl', isValidHttpUrl);

    return validacao;
}
