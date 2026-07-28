/**
 * Sei Functions Pro — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports do body (+ domain/io helpers) para que
 * onclick inline, bootstrap getScript e demais features continuem resolvendo
 * funções por nome no content script.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as body from './body.js';
import { installSeiFunctionsState, refreshSeiPageSelectors } from './state.js';

export function installSeiFunctionsLegacyApi() {
    installSeiFunctionsState();

    [domain, io].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });

    Object.keys(body).forEach((name) => {
        const value = body[name];
        if (typeof value === 'function') aliasGlobal(name, value);
    });

    aliasGlobal('refreshSeiPageSelectors', refreshSeiPageSelectors);
}
