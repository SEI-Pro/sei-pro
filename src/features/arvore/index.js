import {
    resolveMenuCatalogs,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
} from './domain.js';
import { readArvoreMenuConfig } from './io.js';

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.arvoreMenus = { resolveMenuCatalogs };
namespace.features.arvoreMenuIO = { readArvoreMenuConfig };
namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
};
