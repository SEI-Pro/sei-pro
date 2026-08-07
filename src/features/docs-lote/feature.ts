/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installDocsLoteFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'docs-lote',
    maturity: 'exclusive',
    contexts: ['lista'],
    configKey: 'acoesemlote',
    install: installDocsLoteFeature,
    api: Object.freeze({})
};

export default descriptor;
