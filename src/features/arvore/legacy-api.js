/**
 * Árvore — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports do body + domain/io/view adapters, para que
 * o parent frame, onclick inline e lista-processos/atividades continuem
 * resolvendo funções por nome no contentWindow da ifrArvore.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';
import * as body from './body.js';
import { installArvoreState } from './state.js';

export function installArvoreLegacyApi() {
    installArvoreState();

    [domain, io].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });

    Object.keys(body).forEach((name) => {
        if (typeof body[name] === 'function') aliasGlobal(name, body[name]);
    });

    aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);
    aliasGlobal('bindUploadArvoreNativeDragEvents', () => {
        if (globalThis.uploadArvoreDragBound) return;
        globalThis.uploadArvoreDragBound = true;
        view.bindUploadArvoreNativeDragEvents({
            root: document,
            $: globalThis.$,
            hasUploadFiles: globalThis.hasUploadFiles || domain.hasUploadFiles,
            openModalDropzone: globalThis.openModalDropzone || body.openModalDropzone,
            cancelUpload: globalThis.dropzoneCancelInfo || body.dropzoneCancelInfo,
            getDropzone: () => globalThis.arvoreDropzone
        });
    });
}
