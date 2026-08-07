// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { aliasGlobal, getSeiPro, globalRef } from '../core/global.js';

export function installUrls() {
    function getParams(url) {
        return getSeiPro().core.util.getParamsUrlPro(url || globalRef.location.href);
    }

    function buildQuery(params) {
        const parts = [];
        Object.keys(params || {}).forEach(function (key) {
            if (typeof params[key] === 'undefined' || params[key] === null) return;
            parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(String(params[key])));
        });
        return parts.join('&');
    }

    function appendQuery(baseUrl, params) {
        if (!params || !Object.keys(params).length) return baseUrl;
        const query = buildQuery(params);
        if (!query) return baseUrl;
        return baseUrl + (baseUrl.indexOf('?') === -1 ? '?' : '&') + query;
    }

    // Detecção PURA de redirect de uma resposta AJAX do SEI: dado o XHR concluído,
    // confirma se o SEI redirecionou para a `action` esperada (e, opcionalmente, a
    // partir de `origin` via acao_origem). Núcleo extraído da feature "marcar como
    // não visualizado" (marcar_naolido) — Fase 6. Sem DOM; lê só xhr.responseURL.
    function isAjaxRedirectAction(xhr, action, origin = false) {
        if (!xhr || typeof xhr.responseURL !== 'string' || xhr.responseURL === '') {
            return false;
        }
        const params = getSeiPro().core.util.getParamsUrlPro(xhr.responseURL);
        if (!params || params.acao !== action) {
            return false;
        }
        if (origin === false || origin === null || typeof origin === 'undefined') {
            return true;
        }
        return (typeof params.acao_origem === 'undefined' || params.acao_origem === origin);
    }

    // Predicados PUROS de tipo de página do SEI (default = location.href atual).
    // Extraídos da feature "autopreencher senha no login" (autopreenchersenha) — Fase 6.
    function isLoginPageNewSei(href) {
        href = (typeof href === 'string') ? href : globalRef.location.href;
        return href.indexOf('sip/login.php') !== -1;
    }

    function isDocumentoAssinarPage(href) {
        href = (typeof href === 'string') ? href : globalRef.location.href;
        return href.indexOf('acao=documento_assinar') !== -1;
    }

    // True se o parâmetro acao_pro da URL atual é igual a `param`. (verbatim)
    function getUrlAcaoPro(param) {
        const acaoPro = getSeiPro().core.util.getParamsUrlPro(globalRef.location.href).acao_pro;
        return typeof acaoPro !== 'undefined' && acaoPro === param;
    }

    // Extrai a URL de "hipótese legal" embutida num HTML do SEI (parse puro). (verbatim)
    function getUrlHipoteseLegal(html) {
        const word = 'hipotese_legal_select_nome_base_legal';
        const reg = new RegExp("'(.*?" + word + ".*?)'", 'g');
        if (reg.test(html)) {
            let urlHipotese = html.match(reg);
            urlHipotese = (urlHipotese && urlHipotese.length > 0) ? urlHipotese[0].split("'")[3].trim() : false;
            return urlHipotese;
        }
        return false;
    }

    const urls = { getParams, buildQuery, appendQuery, isAjaxRedirectAction, isLoginPageNewSei, isDocumentoAssinarPage, getUrlAcaoPro, getUrlHipoteseLegal };
    getSeiPro().sei.urls = urls;

    aliasGlobal('getParamsUrlPro', getSeiPro().core.util.getParamsUrlPro);
    aliasGlobal('isAjaxRedirectAction', isAjaxRedirectAction);
    aliasGlobal('isLoginPageNewSei', isLoginPageNewSei);
    aliasGlobal('isDocumentoAssinarPage', isDocumentoAssinarPage);
    aliasGlobal('getUrlAcaoPro', getUrlAcaoPro);
    aliasGlobal('getUrlHipoteseLegal', getUrlHipoteseLegal);

    return urls;
}
