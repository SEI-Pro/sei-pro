import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { tabelasArquivos, installTabelasArquivos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'tabelas-arquivos',
    maturity: 'wired',
    contexts: ['all', 'lista', 'visualizacao'],
    configKey: 'ordernartabela',
    install: installTabelasArquivos,
    api: tabelasArquivos.api
};

export default descriptor;

