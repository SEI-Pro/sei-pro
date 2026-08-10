import * as markers from './marcadores-arvore.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const coresMarcadores = defineLegacyFeature({ id: 'cores-marcadores', nsKey: 'coresMarcadores', modules: [markers] });
export const installCoresMarcadores = coresMarcadores.install;
