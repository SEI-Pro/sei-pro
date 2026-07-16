/**
 * Árvore — ponte de compatibilidade para os adapters de upload.
 *
 * Os módulos domain/io/view permanecem a fonte da implementação; esta ponte
 * mantém aliases globais para call-sites legados que ainda resolvem helpers por
 * nome durante a transição.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';

export function installArvoreLegacyApi() {
    [domain, io, view].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });
}
