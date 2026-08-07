/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * Os scripts curtos do viewer são compostos pela entry visualização; o restante
 * do contexto permanece no legado até as próximas fatias.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installVisualizacao } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'visualizacao',
    maturity: 'exclusive',
    contexts: ['visualizacao'],
    configKey: null,
    install: installVisualizacao,
    api: Object.freeze({})
};

export default descriptor;
