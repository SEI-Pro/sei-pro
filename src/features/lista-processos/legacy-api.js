/**
 * Lista de processos — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports dos clusters (+ domain/io) para que
 * onclick inline, outras features e o load order do manifest continuem
 * resolvendo funções por nome no content script da lista.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as modules from './modules.js';
import { installListaProcessosState } from './state.js';

export function installListaProcessosLegacyApi() {
    installListaProcessosState();

    [domain, io, modules].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            const value = mod[name];
            if (typeof value === 'function') aliasGlobal(name, value);
        });
    });

    // Non-function load-time maps consumed by sei-functions-pro autocomplete.
    if (typeof globalThis.objProcessosUnidadePro === 'undefined') {
        globalThis.objProcessosUnidadePro = modules.objProcessosUnidadePro;
    }
    if (typeof globalThis.arrayProcessosUnidadePro === 'undefined') {
        globalThis.arrayProcessosUnidadePro = modules.arrayProcessosUnidadePro;
    }
}
