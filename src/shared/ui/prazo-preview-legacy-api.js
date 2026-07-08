// TODO: remover quando os callers legados que usam getDatesPreview/configDatesPreview
// forem migrados para imports ESM ou para uma API de contexto sem globais.
import { aliasGlobal } from '../../core/global.js';
import {
    configDatesPreview,
    getDatesPreview,
    getProgressPreview
} from './prazo-preview.js';

export function installPrazoPreviewLegacyApi() {
    aliasGlobal('getDatesPreview', getDatesPreview);
    aliasGlobal('getProgressPreview', getProgressPreview);
    aliasGlobal('configDatesPreview', configDatesPreview);
}
