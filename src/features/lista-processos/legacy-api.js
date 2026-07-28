/**
 * Lista de processos — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports do body + domain/io helpers, para que
 * onclick inline, outras features e o load order do manifest continuem
 * resolvendo funções por nome no content script da lista.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as body from './body.js';
import { installListaProcessosState } from './state.js';

export function installListaProcessosLegacyApi() {
    installListaProcessosState();

    [domain, io].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });

    Object.keys(body).forEach((name) => {
        const value = body[name];
        if (typeof value === 'function') aliasGlobal(name, value);
    });

    // Non-function load-time maps consumed by sei-functions-pro autocomplete.
    if (typeof globalThis.objProcessosUnidadePro === 'undefined') {
        globalThis.objProcessosUnidadePro = body.objProcessosUnidadePro;
    }
    if (typeof globalThis.arrayProcessosUnidadePro === 'undefined') {
        globalThis.arrayProcessosUnidadePro = body.arrayProcessosUnidadePro;
    }
}
