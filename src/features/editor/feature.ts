/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 * A entry MAIN instala o runtime da página e esta feature via registry.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { installEditor } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'editor',
    maturity: 'exclusive',
    contexts: ['editor'],
    configKey: null,
    install: installEditor,
    api: Object.freeze({})
};

export default descriptor;
