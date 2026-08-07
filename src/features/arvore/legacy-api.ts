// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — ponte de compatibilidade com o legado.
 *
 * AliasGlobal de TODOS os exports dos clusters (+ domain/io/view) para que
 * o parent frame, onclick inline e lista-processos/atividades continuem
 * resolvendo funções por nome no contentWindow da ifrArvore.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as io from './io.js';
import * as view from './view.js';
import * as modules from './modules.js';
import { installArvoreState } from './state.js';

export function installArvoreLegacyApi() {
    installArvoreState();

    [domain, io, modules].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            const value = mod[name];
            if (typeof value === 'function') aliasGlobal(name, value);
        });
    });

    aliasGlobal('bindArvoreToolbarProcess', view.bindArvoreToolbarProcess);
    aliasGlobal('bindUploadConfirmActions', view.bindUploadConfirmActions);
    aliasGlobal('bindUploadArvoreNativeDragEvents', () => {
        if (globalThis.uploadArvoreDragBound) return;
        globalThis.uploadArvoreDragBound = true;
        view.bindUploadArvoreNativeDragEvents({
            root: document,
            $: globalThis.$,
            hasUploadFiles: globalThis.hasUploadFiles || domain.hasUploadFiles,
            openModalDropzone: globalThis.openModalDropzone || modules.openModalDropzone,
            cancelUpload: globalThis.dropzoneCancelInfo || modules.dropzoneCancelInfo,
            getDropzone: () => globalThis.arvoreDropzone
        });
    });
}
