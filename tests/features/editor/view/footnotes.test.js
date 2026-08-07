// @vitest-environment jsdom

import { beforeEach, describe, expect, it } from 'vitest';
import { q } from '../../../../src/features/editor/lib/domq.ts';
import { state } from '../../../../src/features/editor/state.ts';
import { reorderNtRodape } from '../../../../src/features/editor/view/dialogs/footnotes.ts';

describe('editor footnotes', () => {
    beforeEach(() => {
        document.body.replaceChildren();
        state.iframeEditor = q(document);
    });

    it('renumbers references and keeps footer order aligned with editor items', () => {
        document.body.innerHTML = `
            <sup><a href="#footer-b"><span class="ntRodape_item" data-ntrodape-ref="b">[1]</span></a></sup>
            <sup><a href="#footer-a"><span class="ntRodape_item" data-ntrodape-ref="a">[2]</span></a></sup>
            <p class="ntRodape"><a name="footer-b"><span class="ntRodape_footer" data-ntrodape-ref="b" data-ntrodape="2">[2]</span> B</a></p>
            <p class="ntRodape"><a name="footer-a"><span class="ntRodape_footer" data-ntrodape-ref="a" data-ntrodape="1">[1]</span> A</a></p>
        `;

        reorderNtRodape(state.iframeEditor);

        expect([...document.querySelectorAll('.ntRodape_item')].map((node) => node.textContent))
            .toEqual(['[1]', '[2]']);
        expect([...document.querySelectorAll('.ntRodape_footer')].map((node) => node.textContent))
            .toEqual(['[1]', '[2]']);
        expect([...document.querySelectorAll('p.ntRodape a')].map((node) => node.getAttribute('name')))
            .toEqual(['footer-b', 'footer-a']);
    });

    it('does not fail when CKEditor has already detached a footer container', () => {
        document.body.innerHTML = `
            <sup><a href="#footer-a"><span class="ntRodape_item" data-ntrodape-ref="a">[1]</span></a></sup>
            <sup><a href="#footer-b"><span class="ntRodape_item" data-ntrodape-ref="b">[2]</span></a></sup>
            <p class="ntRodape">
                <a name="footer-a"><span class="ntRodape_footer" data-ntrodape-ref="a" data-ntrodape="1">[1]</span> A</a>
                <a name="footer-b"><span class="ntRodape_footer" data-ntrodape-ref="b" data-ntrodape="2">[2]</span> B</a>
            </p>
        `;

        expect(() => reorderNtRodape(state.iframeEditor)).not.toThrow();
        expect(document.querySelectorAll('p.ntRodape')).toHaveLength(1);
        expect(document.querySelectorAll('.ntRodape_footer')).toHaveLength(2);
    });

    it('ignores an orphan footer span without discarding the rest of the document', () => {
        document.body.innerHTML = `
            <sup><a href="#footer-a"><span class="ntRodape_item" data-ntrodape-ref="a">[1]</span></a></sup>
            <span class="ntRodape_footer" data-ntrodape-ref="a" data-ntrodape="1">[1]</span>
            <p class="texto-normal">Texto do documento</p>
        `;

        expect(() => reorderNtRodape(state.iframeEditor)).not.toThrow();
        expect(document.querySelector('.texto-normal')?.textContent).toBe('Texto do documento');
        expect(document.querySelector('.ntRodape_footer')).not.toBeNull();
    });
});
