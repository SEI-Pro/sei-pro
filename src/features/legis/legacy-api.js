/**
 * Compatibility bridge for editor toolbar and legacy inline handlers.
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
