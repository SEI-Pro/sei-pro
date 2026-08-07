// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { q } from '../../../src/features/editor/lib/domq.ts';
import { setParamEditor, state } from '../../../src/features/editor/state.ts';

describe('editor runtime state', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        globalThis.CKEDITOR = {
            instances: {
                txaEditor_2017: { name: 'txaEditor_2017' }
            }
        };
        document.body.innerHTML = `
            <form id="frmEditor">
                <div id="cke_txaEditor_2017" class="cke cke_shared"></div>
                <div id="cke_txaEditor_2017" class="cke">
                    <button id="editorAction"></button>
                    <iframe title="Corpo do Texto"></iframe>
                </div>
            </form>
        `;
        const iframe = document.querySelector('iframe[title="Corpo do Texto"]');
        iframe.contentDocument.body.innerHTML = '<p class="Paragrafo_Numerado_Nivel1">Texto</p>';
        state.frmEditor = q('#frmEditor');
    });

    it('resolves the active editor iframe through its CKEditor container', () => {
        setParamEditor(document.querySelector('#editorAction'));

        expect(state.idEditor).toBe('txaEditor_2017');
        expect(state.oEditor.name).toBe('txaEditor_2017');
        expect(state.iframeEditor.find('body').length).toBe(1);
        expect(state.iframeEditor.find('p.Paragrafo_Numerado_Nivel1').length).toBe(1);
    });
});
