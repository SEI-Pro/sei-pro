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
