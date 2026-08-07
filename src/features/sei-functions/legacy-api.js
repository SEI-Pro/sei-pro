/**
 * Sei Functions Pro — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports dos clusters (+ domain/io) para que
 * onclick inline, bootstrap getScript e demais features continuem resolvendo
 * funções por nome no content script.
 *
 * TODO: remover aliases conforme call-sites migrarem para SeiPro.features.seiFunctions.api.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as modules from './modules.js';
import { installSeiFunctionsState, refreshSeiPageSelectors } from './state.js';

export function installSeiFunctionsLegacyApi() {
    installSeiFunctionsState();

    [domain, io, modules].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            const value = mod[name];
            if (typeof value === 'function') aliasGlobal(name, value);
        });
    });

    aliasGlobal('refreshSeiPageSelectors', refreshSeiPageSelectors);
}
