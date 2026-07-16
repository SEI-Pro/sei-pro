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
    [domain, io].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });

    // O toolbar legado recebe o adapter por alias para não redefinir o binding
    // no monólito; a ação continua sendo fornecida pelo call-site legado.
    aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);

    // A fachada legada chama este helper sem argumentos; o adapter view recebe
    // explicitamente as dependências que antes ficavam no monólito.
    aliasGlobal('bindUploadArvoreNativeDragEvents', () => {
        if (globalThis.uploadArvoreDragBound) return;
        globalThis.uploadArvoreDragBound = true;
        view.bindUploadArvoreNativeDragEvents({
            root: document,
            $: globalThis.$,
            hasUploadFiles: globalThis.hasUploadFiles,
            openModalDropzone: globalThis.openModalDropzone,
            cancelUpload: globalThis.dropzoneCancelInfo,
            getDropzone: () => globalThis.arvoreDropzone
        });
    });
}
