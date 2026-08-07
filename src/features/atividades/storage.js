/** Atividades storage port: no UI and no network side effects. */
import { restoreAtividadesHybrid } from './io.js';

export function createAtividadesStorage({ context, hybridRestore, hybridStore, localRestore, localStore } = {}) {
    if (!context) throw new TypeError('Storage adapter requires context');
    const restoreHybrid = hybridRestore || ((key) => restoreAtividadesHybrid(key, {
        hybridStorageRestorePro: context.page.hybridStorageRestorePro,
        getOptionsPro: context.options.get
    }));
    const writeHybrid = hybridStore || ((key, value) => {
        if (typeof context.page.hybridStorageStorePro === 'function') {
            return context.page.hybridStorageStorePro(key, value);
        }
        return undefined;
    });
    const readLocal = localRestore || ((key) => {
        if (typeof context.page.localStorageRestorePro === 'function') return context.page.localStorageRestorePro(key);
        const storage = context.storage.local;
        return storage && typeof storage.getItem === 'function' ? storage.getItem(key) : null;
    });
    const writeLocal = localStore || ((key, value) => {
        if (typeof context.page.localStorageStorePro === 'function') return context.page.localStorageStorePro(key, value);
        const storage = context.storage.local;
        if (storage && typeof storage.setItem === 'function') storage.setItem(key, value);
        return undefined;
    });
    return Object.freeze({
        hybrid: Object.freeze({ read: restoreHybrid, write: writeHybrid }),
        local: Object.freeze({ read: readLocal, write: writeLocal })
    });
}

