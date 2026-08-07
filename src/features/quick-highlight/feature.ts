/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { initQuickHighlight } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'quick-highlight',
    maturity: 'wired',
    contexts: ['documento', 'arvore'],
    configKey: 'filtrarpaginapelapesquisarapida',
    install: initQuickHighlight,
    api: Object.freeze({})
};

export default descriptor;
