import * as friendlyUrl from './editor-native-url.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const urlAmigavel = defineLegacyFeature({ id: 'url-amigavel', nsKey: 'urlAmigavel', modules: [friendlyUrl] });
export const installUrlAmigavel = urlAmigavel.install;
