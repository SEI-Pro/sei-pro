// Big-bang do núcleo (isolated-first): todos os arquivos/libs locais da extensão
// são carregados EAGER como content scripts isolados pelo manifest. Este shim
// neutraliza os $.getScript(URL_SPRO/chrome-extension://...) espalhados pelo
// legado — como o alvo já está presente no mundo isolado, vira um no-op que
// resolve imediatamente (mantendo .done()/callback). $.getScript de URLs remotas
// (não-locais) segue o comportamento original.
//
// Carregado pelo manifest logo após o jQuery, antes dos arquivos legados.
(function () {
    if (typeof window.jQuery === 'undefined' || !window.jQuery.getScript) return;
    var $ = window.jQuery;
    if ($.__seiProGetScriptNoop) return;
    var original = $.getScript;
    $.getScript = function (url, callback) {
        var u = typeof url === 'string' ? url : (url && url.url) || '';
        if (u.indexOf('chrome-extension://') !== 0) {
            return original.apply($, arguments);
        }
        // Arquivo local já carregado eager via manifest → resolve já.
        if (typeof callback === 'function') {
            try { callback(undefined, 'success'); } catch (e) { /* segue */ }
        }
        return $.Deferred().resolve().promise();
    };
    $.__seiProGetScriptNoop = true;
})();
