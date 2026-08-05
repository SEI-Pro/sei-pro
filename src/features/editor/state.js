/**
 * Mutable editor runtime state (CKEditor selection / iframe handles).
 */
import { q } from './lib/domq.js';

const initialFrm = typeof document !== 'undefined' ? q('#frmEditor') : { length: 0 };

export const state = {
    frmEditor: initialFrm,
    idEditor: undefined,
    oEditor: undefined,
    imgEditor: undefined,
    bookmark: undefined,
    txaEditor: initialFrm.length ? 'div[id^=cke_txaEditor_]' : 'div#cke_txaConteudo',
    editorTitle: initialFrm.length ? 'div[id^=cke_txaEditor_] iframe' : 'div#cke_txaConteudo iframe',
    iframeEditor: undefined,
    langs: undefined,
    wsDialogHtml: undefined,
    indexDisplayPro: 0,
    lastTextTip: false,
    resultTextTip: false,
    CKWebSpeechHandler: undefined,
    loadOnKeyEditor: false,
    CKWebSpeech: false,
    isSeiSlim: typeof localStorage !== 'undefined' && Boolean(localStorage.getItem('seiSlim')),
    isDarkMode: typeof localStorage !== 'undefined' && Boolean(localStorage.getItem('darkModePro')),
    qualidadeImagens: (() => {
        try {
            let v = (typeof checkConfigValue === 'function' && checkConfigValue('qualidadeimagens'))
                ? getConfigValue('qualidadeimagens') : 60;
            return Math.min(100, Math.max(0, Number(v) || 60));
        } catch {
            return 60;
        }
    })()
};

export function installEditorStateBridge() {
    const bindings = {
        frmEditor: [() => state.frmEditor, (value) => { state.frmEditor = value; }],
        idEditor: [() => state.idEditor, (value) => { state.idEditor = value; }],
        oEditor: [() => state.oEditor, (value) => { state.oEditor = value; }],
        iframeEditor: [() => state.iframeEditor, (value) => { state.iframeEditor = value; }]
    };
    Object.entries(bindings).forEach(([name, [get, set]]) => {
        Object.defineProperty(globalThis, name, { configurable: true, enumerable: true, get, set });
    });
}

export function setParamEditor(this_) {
    state.idEditor = q(this_).closest('div.cke').attr('id').replace('cke_', '');
    state.oEditor = CKEDITOR.instances[state.idEditor];
    state.iframeEditor = findEditorIframe(state.idEditor);
    q('#idEditor').val(state.idEditor);
}

function findEditorIframe(editorId) {
    var editorFrame = q('#cke_' + editorId).find('iframe').eq(0);
    if (editorFrame.length) return editorFrame.contents();

    // Older SEI pages exposed the editor id in the iframe title. Keep this
    // fallback for those pages, while preferring the actual CKEditor container
    // used by current SEI versions (whose titles are semantic, e.g. "Corpo do Texto").
    var legacyFrame = q('iframe[title*="' + editorId + '"]').eq(0);
    if (legacyFrame.length) return legacyFrame.contents();

    return q();
}
