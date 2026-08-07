// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Host adapters consumed by the legacy response router. */

export function createAtividadesServerPorts(context) {
    if (!context || !context.page) throw new TypeError('Server ports require Atividades context');
    const page = context.page;
    return Object.freeze({
        page,
        loadingButtonConfirm: (value) => context.effects.loading(value),
        alertaBoxPro: (...args) => context.effects.alert(...args),
        confirmaBoxPro: (...args) => context.effects.confirm(...args),
        setOptionsPro: context.options.set,
        localStorageStorePro: typeof page.localStorageStorePro === 'function'
            ? page.localStorageStorePro
            : () => undefined,
        hybridStorageStorePro: typeof page.hybridStorageStorePro === 'function'
            ? page.hybridStorageStorePro
            : () => undefined,
        signOutProfile: typeof page.signOutProfile === 'function'
            ? page.signOutProfile
            : () => undefined,
        url_host: page.url_host,
        userSEI: page.userSEI
    });
}
