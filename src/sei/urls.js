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

    const urls = { getParams, buildQuery, appendQuery, isAjaxRedirectAction, isLoginPageNewSei, isDocumentoAssinarPage };
    getSeiPro().sei.urls = urls;

    aliasGlobal('getParamsUrlPro', getSeiPro().core.util.getParamsUrlPro);
    aliasGlobal('isAjaxRedirectAction', isAjaxRedirectAction);
    aliasGlobal('isLoginPageNewSei', isLoginPageNewSei);
    aliasGlobal('isDocumentoAssinarPage', isDocumentoAssinarPage);

    return urls;
}
