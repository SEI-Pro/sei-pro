/******************************************************************************
 SEI Pro PRF Dev: install/update adapter for background service worker.

 Mantém a compatibilidade do listener legado `runtime.onInstalled`, mas isola a
 lógica de install/update para reduzir o monólito de `background.js` de forma
 incremental.
*******************************************************************************/

(function (global) {
    'use strict';

    function handleInstalled(details, browserApi) {
        if (!details || !browserApi) return;

        if (details.reason === 'install') {
            browserApi.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/' });
            browserApi.storage.local.set({ InstallOrUpdate: true });
        } else if (details.reason === 'update') {
            browserApi.storage.local.get('CheckTypes', function(item) {
                browserApi.storage.local.set({ InstallOrUpdate: true });
                if (!item.CheckTypes || item.CheckTypes.indexOf('hidemsgupdate') === -1) {
                    // browserApi.tabs.create({ url: 'https://sei-pro.github.io/sei-pro/pages/HISTORICO.html' });
                }
            });
        }
    }

    global.SeiProBackgroundInstall = {
        handleInstalled: handleInstalled
    };
})(typeof globalThis !== 'undefined' ? globalThis : this);
