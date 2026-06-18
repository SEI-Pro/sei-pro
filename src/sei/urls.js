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

    const urls = { getParams, buildQuery, appendQuery };
    getSeiPro().sei.urls = urls;

    aliasGlobal('getParamsUrlPro', getSeiPro().core.util.getParamsUrlPro);

    return urls;
}
