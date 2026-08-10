// Big-bang do núcleo (isolated-first). Define cedo os globais que os arquivos
// legados leem em TEMPO DE CARGA (antes era garantido porque init.js rodava antes
// do $.getScript dos demais; agora tudo é eager via manifest). Carregado logo após
// jQuery + shim, antes do contexto legado transversal e das features.
(function () {
    try {
        if (window.SeiPro && SeiPro.core && SeiPro.core.runtime) {
            // URL_SPRO é usado em tempo de carga (ex.: sei-functions-pro: iconSeiPro = URL_SPRO+...).
            window.URL_SPRO = SeiPro.core.runtime.getUrlExtension('');
        }
    } catch (e) { /* segue */ }
    try {
        if (window.SeiPro && SeiPro.sei && SeiPro.sei.adapter) {
            window.isNewSEI = SeiPro.sei.adapter.isNewSEI();
            window.isSEI_5 = SeiPro.sei.adapter.isSEI5();
        }
    } catch (e) { /* segue */ }
})();
