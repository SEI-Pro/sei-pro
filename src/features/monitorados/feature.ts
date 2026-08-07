/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installMonitorados } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'monitorados',
    maturity: 'exclusive',
    contexts: ['lista'],
    configKey: 'gerenciarmonitorados',
    install: installMonitorados,
    api: Object.freeze({})
};

export default descriptor;
