import * as forms from './interessados-forms.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const interessadosForms = defineLegacyFeature({ id: 'interessados-forms', nsKey: 'interessadosForms', modules: [forms] });
export const installInteressadosForms = interessadosForms.install;
