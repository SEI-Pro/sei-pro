// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { toggleOptionsQR } from '../../../../src/features/editor/view/dialogs/qr.ts';

describe('QR dialog options', () => {
    afterEach(() => {
        document.body.replaceChildren();
        delete window.CKEDITOR;
    });

    it('shows and hides advanced options without depending on jQuery toggle()', () => {
        const move = vi.fn();
        window.CKEDITOR = {
            dialog: { getCurrent: () => ({ getPosition: () => ({ x: 400, y: 50 }), move }) }
        };
        document.body.innerHTML = '<div id="optionsQrAdvanced" style="display:none"></div>';

        toggleOptionsQR();
        expect(document.querySelector('#optionsQrAdvanced').style.display).toBe('');
        expect(move).toHaveBeenLastCalledWith(250, 50);

        toggleOptionsQR();
        expect(document.querySelector('#optionsQrAdvanced').style.display).toBe('none');
        expect(move).toHaveBeenLastCalledWith(550, 50);
    });
});
