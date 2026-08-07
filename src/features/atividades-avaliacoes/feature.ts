/**
 * Descritor ADR-0004 / ADR-0007 — stub: avaliações de entregas (extração futura).
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installAtividadesAvaliacoesFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-avaliacoes',
    maturity: 'declared',
    contexts: ['lista', 'arvore'],
    configKey: null,
    install: installAtividadesAvaliacoesFeature,
    api: Object.freeze({})
};

export default descriptor;
