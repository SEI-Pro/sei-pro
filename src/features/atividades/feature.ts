/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installAtividadesFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades',
    maturity: 'wired',
    contexts: ['lista', 'arvore'],
    configKey: 'gerenciaratividades',
    install: installAtividadesFeature,
    api: Object.freeze({})
};

export default descriptor;
