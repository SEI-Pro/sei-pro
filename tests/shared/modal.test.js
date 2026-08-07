// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest';
import { openModal } from '../../src/shared/ui/modal.ts';

afterEach(() => document.body.replaceChildren());

describe('shared modal accessibility', () => {
    it('traps focus and restores the invoking control', () => {
        const trigger = document.createElement('button');
        trigger.textContent = 'Abrir';
        document.body.appendChild(trigger);
        trigger.focus();
        const input = document.createElement('input');
        const modal = openModal({ title: 'Teste', content: input });
        expect(modal.el.querySelector('[role="dialog"]').getAttribute('aria-labelledby')).toBeTruthy();
        expect(document.activeElement).toBe(input);

        modal.close();
        expect(document.activeElement).toBe(trigger);
    });
});
