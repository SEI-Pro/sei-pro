import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { chromeUi, installChromeUi } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'chrome-ui',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao', 'documento'],
    configKey: 'menususpenso',
    install: installChromeUi,
    api: chromeUi.api
};

export default descriptor;

