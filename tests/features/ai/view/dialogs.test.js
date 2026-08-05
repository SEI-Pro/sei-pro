// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import {
    clearTrustedSessionApprovals,
    confirmRestrictedDocument
} from '../../../../src/features/ai/view/dialogs.js';

describe('AI access confirmation', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        clearTrustedSessionApprovals();
    });

    it('asks once per page session for a trusted endpoint', async () => {
        const profile = {
            id: 'local',
            providerId: 'ollama',
            model: 'llama',
            trusted: true
        };
        const first = confirmRestrictedDocument({
            id: '1',
            numeroSEI: '123',
            nivelAcesso: 1,
            accessKnown: true
        }, profile);
        const authorize = Array.from(document.querySelectorAll('button'))
            .find((button) => button.textContent === 'Autorizar nesta sessão');
        authorize.click();
        await expect(first).resolves.toBe(true);

        await expect(confirmRestrictedDocument({
            id: '2',
            numeroSEI: '456',
            nivelAcesso: 2,
            accessKnown: true
        }, profile)).resolves.toBe(true);
        expect(document.querySelector('.seipro-modal')).toBeNull();
    });
});
