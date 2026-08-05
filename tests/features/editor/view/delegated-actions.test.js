// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import { api } from '../../../../src/features/editor/api.js';
import { installDelegatedActions } from '../../../../src/features/editor/view/delegated-actions.js';

describe('editor delegated actions', () => {
    it('routes a nested toolbar click to the active CKEditor section', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <a class="getDadosProcessoButtom"><span>Dados</span></a>
        `;
        const handler = vi.fn();
        api.getDadosEditor = handler;
        installDelegatedActions(root);

        const button = root.querySelector('.getDadosProcessoButtom');
        button.querySelector('span').click();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(button);
    });

    it('does not invoke commands from a disabled CKEditor section', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <div class="cke_button_disabled">
                <a class="getDadosProcessoButtom"><span>Dados</span></a>
            </div>
        `;
        const handler = vi.fn();
        api.getDadosEditor = handler;
        installDelegatedActions(root);

        root.querySelector('span').click();

        expect(handler).not.toHaveBeenCalled();
    });

    it('forwards a visible disabled copy to the enabled editor section', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <div id="cke_header" class="cke">
                <div class="cke_button_disabled">
                    <a class="importDocButtom"><span>Importar visível</span></a>
                </div>
            </div>
            <div id="cke_body" class="cke">
                <div class="cke_button_disabled">
                    <a class="importDocButtom"><span>Importar no corpo</span></a>
                </div>
            </div>
        `;
        document.body.replaceChildren(root);
        globalThis.CKEDITOR = {
            instances: {
                header: { readOnly: true },
                body: { readOnly: false }
            }
        };
        const handler = vi.fn();
        api.importDocPro = handler;
        installDelegatedActions(root);

        const buttons = root.querySelectorAll('.importDocButtom');
        buttons[0].querySelector('span').click();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(buttons[1]);
    });

    it('routes toolbar clicks before CKEditor stops them while bubbling', () => {
        const root = document.createElement('div');
        root.innerHTML = `
            <div class="ckeditor-toolbar">
                <a class="importDocButtom"><span>Importar</span></a>
            </div>
        `;
        const handler = vi.fn();
        api.importDocPro = handler;
        installDelegatedActions(root);
        root.querySelector('.ckeditor-toolbar').addEventListener('click', (event) => {
            event.stopPropagation();
        });

        const button = root.querySelector('.importDocButtom');
        button.querySelector('span').click();

        expect(handler).toHaveBeenCalledOnce();
        expect(handler).toHaveBeenCalledWith(button);
    });
});
