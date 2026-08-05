/**
 * Editor compatibility bridge.
 *
 * Aliases remain available to legacy callers (onclick / other scripts).
 * remove when: all editor call sites import from features/editor modules directly.
 */
import { aliasGlobal } from '../../core/global.js';
import * as domain from './domain.js';
import * as view from './view.js';
import { installEditorStateBridge, setParamEditor, bootEditor } from './adapter.js';
import * as toolbarTpl from './templates/toolbar.js';
import * as toolbarView from './view/toolbar.js';
import * as styles from './view/styles.js';
import * as editorText from './view/editor-text.js';
import * as formatting from './commands/formatting.js';
import * as sigilo from './view/dialogs/sigilo.js';
import * as contextMenu from './view/context-menu.js';
import * as table from './view/dialogs/table.js';
import * as legisLink from './view/dialogs/legis-link.js';
import * as citacao from './view/dialogs/citacao.js';
import * as footnotes from './view/dialogs/footnotes.js';
import * as sigiloTarja from './view/dialogs/sigilo-tarja.js';
import * as dados from './view/dialogs/dados.js';
import * as sumario from './view/dialogs/sumario.js';
import * as qr from './view/dialogs/qr.js';
import * as links from './view/dialogs/links.js';
import * as imagesUpload from './view/dialogs/images-upload.js';
import * as imagesEditor from './view/dialogs/images-editor.js';
import * as importDlg from './view/dialogs/import.js';
import * as editorImages from './view/editor-images.js';
import * as publicProcess from './view/dialogs/public-process.js';
import * as saveRepair from './view/save-repair.js';
import * as inlineTips from './view/inline-tips.js';
import * as reviewDlg from './view/dialogs/review.js';
import * as ditado from './view/dialogs/ditado.js';
import * as styleEditor from './view/style-editor.js';
import * as bootFunctions from './view/boot-functions.js';
import * as loadAi from './io/load-ai.js';

const migrated = [
    { installEditorStateBridge, setParamEditor, bootEditor },
    toolbarTpl, toolbarView, styles, editorText, formatting,
    sigilo, contextMenu, table, legisLink, citacao, footnotes, sigiloTarja,
    dados, sumario, qr, links, imagesUpload, imagesEditor, importDlg,
    editorImages, publicProcess, saveRepair, inlineTips, reviewDlg, ditado,
    styleEditor, bootFunctions, loadAi
];

export function installEditorLegacyApi() {
    installEditorStateBridge();

    [domain, view, ...migrated].forEach((mod) => {
        Object.keys(mod).forEach((name) => {
            // remove when: callers import this symbol from features/editor
            if (typeof mod[name] === 'function') aliasGlobal(name, mod[name]);
        });
    });
}
