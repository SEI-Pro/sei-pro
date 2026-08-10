import * as imageDocs from './image-docs.js';
import * as viewers from './media-viewers.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const midiaDocumentos = defineLegacyFeature({ id: 'midia-documentos', nsKey: 'midiaDocumentos', modules: [imageDocs, viewers] });
export const installMidiaDocumentos = midiaDocumentos.install;
