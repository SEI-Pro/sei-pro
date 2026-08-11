/**
 * Entry clássica (IIFE) para content script / getScript — expõe globals sem `export`.
 */
import {
    initForceChosenVisualizacao,
    replaceSelectOnVisualizacao,
    setReplaceSelectOnVisualizacao
} from './sei-pro-visualizacao-chosen.js';

globalThis.replaceSelectOnVisualizacao = replaceSelectOnVisualizacao;
globalThis.setReplaceSelectOnVisualizacao = setReplaceSelectOnVisualizacao;
globalThis.initForceChosenVisualizacao = initForceChosenVisualizacao;
