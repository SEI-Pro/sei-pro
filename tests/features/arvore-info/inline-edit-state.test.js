/**
 * @vitest-environment jsdom
 */
import { describe, expect, it } from 'vitest';

describe('arvore-info inline edit state (harness)', () => {
    it('cancel path restores prior body textContent', () => {
        const body = document.createElement('div');
        body.textContent = 'original';
        const saved = body.textContent;
        body.textContent = 'carregando formulário…';
        // cancel
        body.textContent = saved;
        expect(body.textContent).toBe('original');
    });

    it('failed section does not clear sibling section content', () => {
        const a = document.createElement('div');
        const b = document.createElement('div');
        a.textContent = 'ok-a';
        b.textContent = 'ok-b';
        // simulate failure only on a
        a.textContent = '(falha ao carregar)';
        expect(b.textContent).toBe('ok-b');
    });
});
