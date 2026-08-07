/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installQuickHighlight } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'quick-highlight',
    maturity: 'exclusive',
    contexts: ['documento'],
    configKey: 'filtrarpaginapelapesquisarapida',
    install: installQuickHighlight,
    api: Object.freeze({})
};

export default descriptor;
