import { getSeiPro } from '../../core/global.js';
import { extractTextWithNumbering } from './domain.js';
import { extractTextFromHtml } from './io.js';
import { bindEditorFocus, collectEditorText } from './view.js';
import { installEditorLegacyApi } from './legacy-api.js';

const root = getSeiPro();
root.features = root.features || {};
root.features.editor = {
    extractTextWithNumbering,
    extractTextFromHtml,
    bindEditorFocus,
    collectEditorText
};
installEditorLegacyApi();
