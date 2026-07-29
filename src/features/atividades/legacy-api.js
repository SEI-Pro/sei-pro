/**
 * Atividades — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de body exports + shared nomenclature so onclick, sei-functions,
 * and bootstrap getScript keep resolving names on the content-script global.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as body from './body.js';
import * as nomenclatura from '../../shared/nomenclatura.js';
import { installAtividadesState, refreshAtividadesState } from './state.js';

export function installAtividadesLegacyApi() {
    installAtividadesState();

    // Shared nomenclature first (sei-functions may call getName before body aliases).
    Object.keys(nomenclatura).forEach((name) => {
        if (typeof nomenclatura[name] === 'function') aliasGlobal(name, nomenclatura[name]);
    });

    [domain, io].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });

    Object.keys(body).forEach((name) => {
        const value = body[name];
        if (typeof value === 'function') aliasGlobal(name, value);
    });

    aliasGlobal('refreshAtividadesState', refreshAtividadesState);
}
