/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installArvore } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'arvore',
    maturity: 'exclusive',
    contexts: ['arvore'],
    configKey: null,
    install: installArvore,
    api: Object.freeze({})
};

export default descriptor;
