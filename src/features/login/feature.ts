/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installLoginAutofill } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'login',
    maturity: 'exclusive',
    contexts: ['login'],
    configKey: 'autopreenchersenha',
    install: installLoginAutofill,
    api: Object.freeze({})
};

export default descriptor;
