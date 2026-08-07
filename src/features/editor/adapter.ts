// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * CKEditor 4 / SEI editor DOM adapter — owns editor boot timing.
 */
import { q, installDomqDialog } from './lib/domq.js';
import { state, installEditorStateBridge, setParamEditor } from './state.js';
import { api } from './api.js';
import { openModal } from '../../shared/ui/modal.js';
import { waitForPageCkeditor, bindCkeditorGlobal, getPageCkeditor } from './ckeditor-access.js';
import './io/load-ai.js';
import { addButton } from './view/toolbar.js';

export { installEditorStateBridge, setParamEditor };
export { getPageCkeditor, waitForPageCkeditor, bindCkeditorGlobal };

installDomqDialog(openModal);

/**
 * The legacy bootstrap normally creates the shared dialog hosts. Editor pages
 * now boot independently in MAIN world, so that bootstrap may never run.
 */
export function ensureEditorDialogHost(id = 'dialogBoxPro', root = document) {
    const existing = root?.getElementById?.(id);
    if (existing) return existing;

    const parent = root?.body || root?.documentElement;
    if (!parent || typeof root?.createElement !== 'function') return null;

    const host = root.createElement('div');
    host.id = id;
    host.style.display = 'none';
    parent.appendChild(host);
    return host;
}

/** Close shared/ui modal when legacy resetDialogBoxPro runs. */
(function patchResetDialogBox() {
    const prev = typeof globalThis.resetDialogBoxPro === 'function'
        ? globalThis.resetDialogBoxPro
        : null;
    globalThis.resetDialogBoxPro = function resetDialogBoxProPatched(id) {
        if (q._lastModal && typeof q._lastModal.close === 'function') {
            try { q._lastModal.close(); } catch (e) { /* noop */ }
            q._lastModal = null;
        }
        let result;
        if (prev) result = prev(id);
        ensureEditorDialogHost(id);
        return result;
    };
    ensureEditorDialogHost();
})();

export function bootEditor() {
    state.frmEditor = q('#frmEditor');
    state.txaEditor = state.frmEditor.length ? 'div[id^=cke_txaEditor_]' : 'div#cke_txaConteudo';
    state.editorTitle = state.frmEditor.length ? 'div[id^=cke_txaEditor_] iframe' : 'div#cke_txaConteudo iframe';

    // SEI error pages (e.g. "Erro documento não encontrado") match editor_montar
    // but never ship CKEDITOR — fail fast without a 15s wait.
    const bodyText = (document.body && (document.body.innerText || document.body.textContent)) || '';
    if (/documento\s+n[aã]o\s+encontrado/i.test(bodyText) || /erro\s+documento/i.test(bodyText)) {
        console.warn('SEI Pro editor: SEI document error page — skip boot');
        return;
    }

    q('body').addClass('seiEditor');

    waitForPageCkeditor()
        .then((cke) => {
            bindCkeditorGlobal(cke);
            addButton();
        })
        .catch((err) => {
            console.error('SEI Pro editor: CKEDITOR unavailable', err);
        });
}

api.bootEditor = bootEditor;
api.installEditorStateBridge = installEditorStateBridge;
api.setParamEditor = setParamEditor;
api.getPageCkeditor = getPageCkeditor;
api.waitForPageCkeditor = waitForPageCkeditor;
api.bindCkeditorGlobal = bindCkeditorGlobal;
