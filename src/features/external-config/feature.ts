/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installExternalConfig } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'external-config',
    maturity: 'wired',
    contexts: ['db'],
    configKey: null,
    install: installExternalConfig,
    api: Object.freeze({})
};

export default descriptor;
