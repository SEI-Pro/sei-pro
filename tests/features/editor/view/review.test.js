// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { api } from '../../../../src/features/editor/api.js';
import { state } from '../../../../src/features/editor/state.js';
import { getBoxReview, initStyleReview } from '../../../../src/features/editor/view/dialogs/review.js';

describe('text review toggle', () => {
    afterEach(() => {
        document.body.replaceChildren();
        delete window.loadedStyleReview;
        state.oEditor = undefined;
        vi.restoreAllMocks();
    });

    it('toggles only the clicked editor button and updates its label', () => {
        document.body.innerHTML = `
            <a class="getReviewButton cke_button_off"><span class="cke_button_label">Ativar revisão de texto</span></a>
            <a class="getReviewButton cke_button_off"><span class="cke_button_label">Ativar revisão de texto</span></a>`;
        const buttons = document.querySelectorAll('.getReviewButton');
        const init = vi.spyOn(api, 'initStyleReview').mockImplementation(() => {});

        getBoxReview(buttons[0]);

        expect(buttons[0].classList.contains('cke_button_on')).toBe(true);
        expect(buttons[0].getAttribute('aria-label')).toBe('Desativar revisão de texto');
        expect(buttons[1].classList.contains('cke_button_off')).toBe(true);
        expect(init).toHaveBeenCalledWith(buttons[0]);
    });

    it('registers one key handler per editor without q.inArray()', () => {
        const on = vi.fn();
        state.oEditor = { name: 'txaEditor_2017', on };
        const button = document.createElement('a');
        button.className = 'getReviewButton cke_button_on';

        expect(initStyleReview(button)).toBeUndefined();
        expect(initStyleReview(button)).toBe(false);
        expect(on).toHaveBeenCalledTimes(1);
        expect(window.loadedStyleReview).toEqual(['txaEditor_2017']);
    });
});
