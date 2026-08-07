// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from 'vitest';
import { createAiAssistant } from '../../../../src/features/ai/view/assistant.ts';

afterEach(() => {
    document.body.replaceChildren();
});

describe('AI assistant panel', () => {
    const profiles = [{
        id: 'work',
        label: 'Institucional',
        providerId: 'openai',
        model: 'gpt'
    }];

    it('keeps a prompt conversation in the editor instead of opening a one-shot modal', () => {
        const onSubmit = vi.fn();
        const assistant = createAiAssistant({ profiles, onSubmit }).open();

        expect(document.querySelector('.seipro-ai-assistant')).not.toBeNull();
        expect(document.querySelector('.seipro-modal')).toBeNull();

        document.querySelector('.seipro-ai-quick-action').click();
        const prompt = document.querySelector('.seipro-ai-composer-input');
        expect(prompt.value).toContain('Analise o processo atual');
        document.querySelector('.seipro-ai-composer').dispatchEvent(new Event('submit', {
            bubbles: true,
            cancelable: true
        }));

        expect(onSubmit).toHaveBeenCalledWith(expect.objectContaining({
            profileId: 'work',
            includeContext: true,
            prompt: expect.stringContaining('Analise o processo atual')
        }));
        expect(assistant.getHistory()).toEqual([expect.objectContaining({ role: 'user' })]);
    });

    it('renders a reviewable draft and only inserts after the explicit action', () => {
        const onAccept = vi.fn();
        const assistant = createAiAssistant({ profiles }).open().start();
        assistant.appendDelta('<p>Minuta inicial</p>');
        assistant.complete({ text: '<p>Minuta final</p>', onAccept });

        expect(document.querySelector('.seipro-ai-message-assistant .seipro-ai-message-body').innerHTML)
            .toContain('<p>Minuta final</p>');
        document.querySelector('.seipro-ai-insert').click();
        expect(onAccept).toHaveBeenCalledWith('<p>Minuta final</p>', expect.any(HTMLButtonElement));
    });

    it('offers a stop control while the process context is being prepared', () => {
        const onStop = vi.fn();
        createAiAssistant({ profiles, onStop }).open().start();

        const stop = document.querySelector('.seipro-ai-stop');
        expect(stop.hidden).toBe(false);
        stop.click();
        expect(onStop).toHaveBeenCalledOnce();
    });

    it('offers recovery when the provider temporarily limits requests', () => {
        const onRetry = vi.fn();
        const assistant = createAiAssistant({ profiles }).open().start();
        assistant.fail(new Error('O provedor de IA atingiu o limite de requisições (429).'), onRetry);

        expect(document.querySelector('.seipro-ai-message-body').textContent)
            .toContain('temporariamente limitando');
        document.querySelector('.seipro-ai-message-button').click();
        expect(onRetry).toHaveBeenCalledOnce();
    });
});
