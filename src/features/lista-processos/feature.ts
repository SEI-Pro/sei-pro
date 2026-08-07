/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installListaProcessos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'lista-processos',
    maturity: 'wired',
    contexts: ['lista'],
    configKey: null,
    install: installListaProcessos,
    api: Object.freeze({})
};

export default descriptor;
