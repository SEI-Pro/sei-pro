import {
    resolveMenuCatalogs,
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
} from './domain.js';
import { readArvoreMenuConfig } from './io.js';
import { fetchUploadPage, postUploadForm, postSavedUpload } from './io.js';
import { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents } from './view.js';
import { installArvoreLegacyApi } from './legacy-api.js';

const namespace = globalThis.SeiPro = globalThis.SeiPro || {};
namespace.features = namespace.features || {};
namespace.features.arvoreMenus = { resolveMenuCatalogs };
namespace.features.arvoreMenuIO = { readArvoreMenuConfig };
namespace.features.arvoreUploadIO = { fetchUploadPage, postUploadForm, postSavedUpload };
namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
};
namespace.features.arvoreUploadView = { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents };
installArvoreLegacyApi();
