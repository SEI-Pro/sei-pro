// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Árvore — entry do bundle.
 *
 * Decomposição: domain · io · view · templates · state · clusters · legacy-api.
 * Saída: dist/js/sei-pro-arvore.js (mesmo nome do legado para o manifest).
 *
 * Public surface: SeiPro.features.arvore = { id, api, install }.
 */
import { ready } from '../../dom/index.js';
import { publishFeature } from '../../app/publish-feature.js';
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
import { initSeiProArvore } from './modules.js';
import * as upload from './upload.js';

export function installArvore() {
    installArvoreState();
    installArvoreLegacyApi();
    ready(function () {
        initSeiProArvore();
    });
}

const uploadApi = {
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

publishFeature({
    id: 'arvore',
    api: Object.freeze({
        menus: Object.freeze({ resolveMenuCatalogs }),
        menuIO: Object.freeze({ readArvoreMenuConfig }),
        upload: uploadApi,
        uploadView: Object.freeze({
            bindArvoreToolbarProcess,
            bindUploadArvoreNativeDragEvents,
            bindUploadConfirmActions
        })
    }),
    install: installArvore
});

// Compat namespaces still used by clusters/upload.
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
namespace.features.arvoreUpload = uploadApi;
namespace.features.arvoreUploadView = {
    bindArvoreToolbarProcess,
    bindUploadArvoreNativeDragEvents,
    bindUploadConfirmActions
};

installArvore();
