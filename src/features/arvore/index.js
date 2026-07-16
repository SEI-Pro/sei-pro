import {
    resolveMenuCatalogs,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
} from './domain.js';

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.arvoreMenus = { resolveMenuCatalogs };
namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
};
