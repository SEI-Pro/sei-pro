import * as toolbar from './visualizacao-toolbar.js';
import * as slim from './slim-ui-chrome.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const chromeUi = defineLegacyFeature({ id: 'chrome-ui', nsKey: 'chromeUi', modules: [toolbar, slim] });
export const installChromeUi = chromeUi.install;
