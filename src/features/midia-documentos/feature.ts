import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { midiaDocumentos, installMidiaDocumentos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'midia-documentos',
    maturity: 'wired',
    contexts: ['visualizacao', 'documento', 'editor'],
    configKey: 'editarimagens',
    install: installMidiaDocumentos,
    api: midiaDocumentos.api
};

export default descriptor;

