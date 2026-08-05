// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { q } from '../../../../src/features/editor/lib/domq.js';
import { state } from '../../../../src/features/editor/state.js';
import {
    getNiveisParagrafos,
    keyActionEditor,
    keyupActionEditor,
    setOnKeyEditor
} from '../../../../src/features/editor/view/inline-tips.js';

describe('setOnKeyEditor', () => {
    beforeEach(() => {
        state.loadOnKeyEditor = false;
        state.oEditor = null;
        state.iframeEditor = q(document);
        document.body.replaceChildren();
        delete globalThis.loadOnKeyEditor;
        delete globalThis.removeOptionsPro;
        globalThis.randomString = vi.fn(() => 'ref-teste');
        globalThis.verifyConfigValue = vi.fn(() => true);
    });

    it('finds numbered paragraphs even when the editor adds other style classes', () => {
        document.body.innerHTML = `
            <p class="Paragrafo_Numerado_Nivel1 Texto_Justificado">Primeiro</p>
            <p class="Paragrafo_Numerado_Nivel2 Texto_Justificado">Subitem</p>
            <p class="Paragrafo_Numerado_Nivel1">Segundo</p>
        `;

        expect(getNiveisParagrafos().map(({ item, text }) => ({ item, text }))).toEqual([
            { item: 1, text: 'Primeiro' },
            { item: '1.1', text: 'Subitem' },
            { item: 2, text: 'Segundo' }
        ]);
        expect(document.querySelectorAll('a[name="RefPro_ref-teste"]')).toHaveLength(3);
    });

    it('ignores key events whose selection is not inside a paragraph', () => {
        const orphan = document.createElement('span');
        const editor = {
            getSelection: () => ({
                getStartElement: () => ({ $: orphan })
            }),
            container: { $: document.createElement('div') }
        };
        const event = { data: { keyCode: 2228275 } };

        expect(() => keyupActionEditor(event, editor)).not.toThrow();
        expect(() => keyActionEditor(event, editor)).not.toThrow();
        expect(keyupActionEditor(event, editor)).toBe(false);
        expect(keyActionEditor(event, editor)).toBe(false);
    });

    it('binds the key handler once without reading a bare global loadOnKeyEditor', () => {
        const on = vi.fn();
        state.oEditor = { name: 'txaConteudo', on };

        setOnKeyEditor();
        setOnKeyEditor();

        expect(on).toHaveBeenCalledTimes(1);
        expect(on).toHaveBeenCalledWith('key', expect.any(Function));
        expect(state.loadOnKeyEditor).toBe('txaConteudo');
        expect(typeof globalThis.loadOnKeyEditor).toBe('undefined');
    });

    it('clears the inline AI option when destroy is requested', () => {
        const removeOptionsPro = vi.fn();
        globalThis.removeOptionsPro = removeOptionsPro;
        state.oEditor = { name: 'txaConteudo', on: vi.fn() };
        state.loadOnKeyEditor = 'txaConteudo';

        setOnKeyEditor(true);

        expect(removeOptionsPro).toHaveBeenCalledWith('setInlineAI');
        expect(state.oEditor.on).not.toHaveBeenCalled();
    });
});
