import * as tags from './tags-menus.js';
import * as wizards from './wizards-menu.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const menusRapidos = defineLegacyFeature({ id: 'menus-rapidos', nsKey: 'menusRapidos', modules: [tags, wizards] });
export const installMenusRapidos = menusRapidos.install;
