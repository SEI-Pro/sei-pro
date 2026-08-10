import * as batch from './batch-capa.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const acoesCapa = defineLegacyFeature({ id: 'acoes-capa', nsKey: 'acoesCapa', modules: [batch] });
export const installAcoesCapa = acoesCapa.install;
