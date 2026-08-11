/**
 * Descritor ADR-0004 — fonte de verdade de contextos / configKey / install.
 */
import type { SeiFeatureDescriptor } from '../../types/seipro.js';

import { installArvore } from './index.js';
import { installArvoreTreePipeline } from './install-tree.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'arvore',
    maturity: 'exclusive',
    contexts: ['arvore'],
    configKey: null,
    install: (deps) => {
        installArvoreTreePipeline({
            window: (deps as { window?: Window & typeof globalThis }).window,
            document: (deps as { document?: Document }).document
        });
        installArvore();
    },
    api: Object.freeze({})
};

export default descriptor;
