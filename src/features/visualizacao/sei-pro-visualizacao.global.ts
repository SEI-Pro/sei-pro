/**
 * Entry clássica (IIFE) para content script / getScript — expõe globals sem `export`.
 * O módulo ESM em sei-pro-visualizacao.js continua sendo a fonte importada pelos bundles.
 */
import { initSeiProVisualizacao, loadSEIProVisualizacao } from './sei-pro-visualizacao.js';

globalThis.loadSEIProVisualizacao = loadSEIProVisualizacao;
globalThis.initSeiProVisualizacao = initSeiProVisualizacao;
