import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { dialogsHost, installDialogsHost } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'dialogs-host',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao', 'documento', 'editor'],
    configKey: null,
    install: installDialogsHost,
    api: dialogsHost.api
};

export default descriptor;

