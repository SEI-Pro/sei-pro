const MENU_STORAGE_KEYS = {
    process: 'configViewFlashMenuPro',
    document: 'configViewFlashDocMenuPro',
    tree: 'configViewFlashDocArvorePro',
    panel: 'configViewFlashPanelArvorePro'
};

const MENU_OPTION_KEYS = {
    process: 'optionsFlashMenu_menuproc',
    document: 'optionsFlashMenu_menudoc',
    tree: 'optionsFlashMenu_iconstree',
    panel: 'optionsFlashMenu_panelinfo'
};

/**
 * Lê a configuração persistida dos menus da árvore.
 * A dependência fica explícita para que a borda de storage/opções seja testável
 * sem jQuery, chrome.* ou a página do SEI.
 */
export function readArvoreMenuConfig({ restore, getOption }) {
    const stored = Object.fromEntries(Object.entries(MENU_STORAGE_KEYS).map(([name, key]) => [
        name,
        restore(key)
    ]));
    const enabled = Object.fromEntries(Object.entries(MENU_OPTION_KEYS).map(([name, key]) => [
        name,
        getOption(key) !== 'disabled'
    ]));
    return { stored, enabled };
}

// Fronteira IO do upload da árvore: transporte injetável, sem assumir jQuery global.

function requireAjax(ajax) {
    if (typeof ajax !== 'function') throw new TypeError('ajax dependency is required');
    return ajax;
}

export function fetchUploadPage({ ajax, url, onSuccess }) {
    return requireAjax(ajax)({ url }).done(onSuccess);
}

export function postUploadForm({ ajax, url, data, onSuccess }) {
    return requireAjax(ajax)({ method: 'POST', data, url }).done(onSuccess);
}

export function postSavedUpload({ ajax, xhrFactory, url, data, onSuccess }) {
    const xhr = xhrFactory();
    requireAjax(ajax)({
        method: 'POST',
        data,
        url,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1',
        xhr: () => xhr
    }).done((htmlResult, _status, responseXhr) => onSuccess(htmlResult, responseXhr || xhr));
    return xhr;
}