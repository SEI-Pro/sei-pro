/**
 * Árvore — entry do bundle (substitui a cópia legada sei-pro-arvore.js).
 *
 * Decomposição: domain · io · view · templates · state · body · legacy-api.
 * Saída: dist/js/sei-pro-arvore.js (mesmo nome do legado para o manifest).
 */
import { ready } from '../../dom/index.js';
import { installArvoreState } from './state.js';
import {
    resolveMenuCatalogs,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles,
    getLinksInText,
    resolveDropzoneIcon,
    formatAnotacaoToParagraphs,
    buildArvoreInitSignature
} from './domain.js';
import { readArvoreMenuConfig, fetchUploadPage, postUploadForm, postSavedUpload } from './io.js';
import { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents } from './view.js';
import { installArvoreLegacyApi } from './legacy-api.js';
import { initSeiProArvore } from './body.js';

installArvoreState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.arvoreMenus = { resolveMenuCatalogs };
namespace.features.arvoreMenuIO = { readArvoreMenuConfig };
namespace.features.arvoreUploadIO = { fetchUploadPage, postUploadForm, postSavedUpload };
namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles,
    getLinksInText,
    resolveDropzoneIcon,
    formatAnotacaoToParagraphs,
    buildArvoreInitSignature
};
namespace.features.arvoreUploadView = { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents };

installArvoreLegacyApi();

ready(function () {
    initSeiProArvore();
});
