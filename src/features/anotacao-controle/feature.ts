/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installAnotacaoControle } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'anotacao-controle',
    maturity: 'wired',
    contexts: ['lista'],
    configKey: 'mostraranotacaocontrole',
    install: installAnotacaoControle,
    api: Object.freeze({})
};

export default descriptor;
