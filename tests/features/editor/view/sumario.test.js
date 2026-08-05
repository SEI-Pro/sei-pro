// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { q } from '../../../../src/features/editor/lib/domq.js';
import { state } from '../../../../src/features/editor/state.js';
import { getListStylesDocumento } from '../../../../src/features/editor/view/dialogs/sumario.js';

describe('getListStylesDocumento', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="frmEditor">
                <div id="cke_txaEditor_2013" class="cke cke_shared"></div>
                <div id="cke_txaEditor_2013" class="cke"><iframe title="Cabeçalho"></iframe></div>
                <div id="cke_txaEditor_2017" class="cke cke_shared"></div>
                <div id="cke_txaEditor_2017" class="cke"><iframe title="Corpo do Texto"></iframe></div>
            </form>
        `;
        const [header, body] = document.querySelectorAll('iframe');
        header.contentDocument.body.innerHTML = '<p class="Texto_Centralizado">Cabeçalho</p>';
        body.contentDocument.body.innerHTML = `
            <p class="Paragrafo_Numerado_Nivel1 Texto_Justificado">Título</p>
            <p class="Paragrafo_Numerado_Nivel2">Subtítulo</p>
        `;
        state.txaEditor = 'div[id^=cke_txaEditor_]';
        globalThis.uniqPro = (values) => [...new Set(values)];
    });

    it('lists styles from editors whose iframe titles are semantic', () => {
        expect(q(state.txaEditor).length).toBe(4);
        expect(q(state.txaEditor).eq(1).find('iframe').contents().find('p').length).toBe(1);
        expect(q(state.txaEditor).eq(3).find('iframe').contents().find('p').length).toBe(2);
        const options = getListStylesDocumento();

        expect(options).toContain('value=".Texto_Centralizado"');
        expect(options).toContain('value=".Paragrafo_Numerado_Nivel1"');
        expect(options).toContain('value=".Paragrafo_Numerado_Nivel2"');
    });
});
