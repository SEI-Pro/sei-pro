/**
 * Descritor ADR-0004 / ADR-0007 — avaliações extraídas do agregado.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { atividadesAvaliacoes, installAtividadesAvaliacoesFeature } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'atividades-avaliacoes',
    maturity: 'wired',
    contexts: ['lista', 'arvore'],
    configKey: null,
    install: installAtividadesAvaliacoesFeature,
    api: atividadesAvaliacoes.api
};

export default descriptor;
