import type { SeiFeatureDescriptor } from '../../types/seipro.js';
import { menusRapidos, installMenusRapidos } from './index.js';

const descriptor: SeiFeatureDescriptor = {
    id: 'menus-rapidos',
    maturity: 'wired',
    contexts: ['all', 'lista', 'arvore', 'visualizacao'],
    configKey: 'menurapido',
    install: installMenusRapidos,
    api: menusRapidos.api
};

export default descriptor;

