// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Compatibility bridge for editor toolbar and legacy inline handlers.
 *
 * TODO: remove when all legis call sites import from features/legis modules
 * directly (editor toolbar + any remaining global onclick / getScript callers).
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';

export function installLegisLegacyApi() {
    [domain, io, view].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (name === 'configureLegisView') return;
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });
}
