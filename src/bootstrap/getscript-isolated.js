// Shim de $.getScript para o mundo isolado.
//
// - URL remota → getScript original
// - chrome-extension:// de lib LAZY (Chart, Gantt, Mammoth, Tesseract, jschardet)
//   → carga real (WAR; não está nos content_scripts)
// - chrome-extension:// de tudo mais (já eager no manifest) → no-op
//   (re-executar sei-functions-pro etc. via ajax+eval quebra globais como frmEditor)
//
// Carregado pelo manifest logo após o jQuery, antes dos arquivos legados.
(function () {
    if (typeof window.jQuery === 'undefined' || !window.jQuery.getScript) return;
    var $ = window.jQuery;
    if ($.__seiProGetScriptIsolated) return;
    var original = $.getScript;

    // Libs removidas do eager load — precisam de getScript real a partir da WAR.
    var LAZY_RE = /\/js\/lib\/(frappe-gantt(\.esm)?|chart\.min|mammoth\.browser\.min|tesseract\.min|jschardet\.min)(\.js)?(\?|$)/i;

    function isExtensionUrl(u) {
        return typeof u === 'string' && u.indexOf('chrome-extension://') === 0;
    }

    function isLazyExtensionLib(u) {
        return isExtensionUrl(u) && LAZY_RE.test(u);
    }

    $.getScript = function (url, callback) {
        var u = typeof url === 'string' ? url : (url && url.url) || '';
        if (!isExtensionUrl(u) || isLazyExtensionLib(u)) {
            return original.apply($, arguments);
        }
        // Eager content script já presente no isolated world.
        if (typeof callback === 'function') {
            try { callback(undefined, 'success'); } catch (e) { /* segue */ }
        }
        return $.Deferred().resolve().promise();
    };
    $.__seiProGetScriptNoop = true;
    $.__seiProGetScriptIsolated = true;
})();
