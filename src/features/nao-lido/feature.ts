/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installNaoLido } from './view.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'nao-lido',
    maturity: 'exclusive',
    contexts: ['lista'],
    configKey: 'marcar_naolido',
    install(deps?: unknown) {
        const ctx = deps && typeof deps === 'object' ? (deps as { root?: Document }) : {};
        const root = ctx.root || (typeof document !== 'undefined' ? document : null);
        if (root) installNaoLido(root);
    },
    api: Object.freeze({})
};

export default descriptor;
