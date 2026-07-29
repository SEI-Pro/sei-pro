/**
 * Árvore — entry do bundle (substitui a cópia legada sei-pro-arvore.js).
 *
 * Decomposição: domain · io · view · templates · state · upload · body · legacy-api.
 * Upload: shared/ui/file-queue (sem Dropzone / sem jQuery).
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
    buildArvoreInitSignature,
    parseInfraUploadMeta,
    resolveUploadSerie,
    buildUploadDocumentTitle
} from './domain.js';
import {
    readArvoreMenuConfig,
    fetchUploadPage,
    postUploadForm,
    postSavedUpload,
    fetchText,
    postFormData,
    parseUploadPageHtml
} from './io.js';
import { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents, bindUploadConfirmActions } from './view.js';
import { installArvoreLegacyApi } from './legacy-api.js';
import { initSeiProArvore } from './body.js';
import * as upload from './upload.js';

installArvoreState();

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.arvoreMenus = { resolveMenuCatalogs };
namespace.features.arvoreMenuIO = { readArvoreMenuConfig };
namespace.features.arvoreUploadIO = {
    fetchUploadPage,
    postUploadForm,
    postSavedUpload,
    fetchText,
    postFormData,
    parseUploadPageHtml
};
namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles,
    getLinksInText,
    resolveDropzoneIcon,
    formatAnotacaoToParagraphs,
    buildArvoreInitSignature,
    parseInfraUploadMeta,
    resolveUploadSerie,
    buildUploadDocumentTitle,
    ...upload
};
namespace.features.arvoreUploadView = {
    bindArvoreToolbarProcess,
    bindUploadArvoreNativeDragEvents,
    bindUploadConfirmActions
};

installArvoreLegacyApi();

ready(function () {
    initSeiProArvore();
});
