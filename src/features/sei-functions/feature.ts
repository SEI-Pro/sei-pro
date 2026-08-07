/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installSeiFunctionsFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'sei-functions',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao', 'documento', 'editor'],
    configKey: null,
    install: installSeiFunctionsFeature,
    api: Object.freeze({})
};

export default descriptor;
