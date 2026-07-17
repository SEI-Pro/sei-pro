/**
 * Ponte de compatibilidade do editor.
 *
 * Os adapters extraídos são instalados como globals antes da cópia legada do
 * editor. Assim, call-sites antigos podem resolver as funções por nome sem
 * duplicar a implementação nos monólitos e sem alterar o namespace moderno.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';

export function installEditorLegacyApi() {
    [domain, io, view].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });
}
