// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
    ensureEditorDialogHost
} from '../../../src/features/editor/adapter.js';
import { q } from '../../../src/features/editor/lib/domq.js';
import { state } from '../../../src/features/editor/state.js';
import { importDocPro } from '../../../src/features/editor/view/dialogs/import.js';

describe('editor dialog compatibility', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        globalThis.dialogBoxPro = false;
        globalThis.URL_SPRO = 'chrome-extension://test/';
        globalThis.sanitizeHTML = (html) => html;
        globalThis.initChosenReplace = () => {};
        globalThis.CKEDITOR = { instances: {} };
        state.frmEditor = q();
    });

    it('creates the dialog host when the independent editor boot skipped init_all', () => {
        expect(document.querySelector('#dialogBoxPro')).toBeNull();

        const host = ensureEditorDialogHost();

        expect(host).toBe(document.querySelector('#dialogBoxPro'));
        expect(host.style.display).toBe('none');
    });

    it('keeps only one host across repeated resets', () => {
        globalThis.resetDialogBoxPro('dialogBoxPro');
        globalThis.resetDialogBoxPro('dialogBoxPro');

        expect(document.querySelectorAll('#dialogBoxPro')).toHaveLength(1);
    });

    it('opens the external-text importer when the legacy dialog bootstrap did not run', () => {
        document.body.innerHTML = `
            <form id="frmEditor">
                <div id="cke_txaEditor_2017" class="cke">
                    <a class="importDocButtom" href="#"></a>
                </div>
                <iframe title="Editor de Rich Text, txaEditor_2017"></iframe>
            </form>
        `;
        state.frmEditor = q('#frmEditor');
        globalThis.CKEDITOR.instances.txaEditor_2017 = {};

        importDocPro(document.querySelector('.importDocButtom'));

        expect(document.querySelector('.seipro-modal')).not.toBeNull();
        expect(document.querySelector('.seipro-modal-title')?.textContent)
            .toBe('Inserir texto de conteúdo externo');
        expect(document.querySelectorAll('#fileInputImportHTMLDocx')).toHaveLength(1);
    });
});
