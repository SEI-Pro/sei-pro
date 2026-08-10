import * as layout from './layout-dialogs.js';
import * as clipboard from './host-clipboard-dialogs.js';
import { defineLegacyFeature } from '../../shared/sei-runtime/legacy-api.js';

export const dialogsHost = defineLegacyFeature({ id: 'dialogs-host', nsKey: 'dialogsHost', modules: [layout, clipboard] });
export const installDialogsHost = dialogsHost.install;
