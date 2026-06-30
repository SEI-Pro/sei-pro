// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';
import { insertionTarget } from '@src/shared/ui/sortable.js';

// Stub de linhas com rects controlados (jsdom não faz layout).
function row(top, height = 20) {
    return { getBoundingClientRect: () => ({ top, height, bottom: top + height }) };
}

describe('shared/ui/sortable — insertionTarget (puro)', () => {
    const rows = [row(0), row(20), row(40)];

    it('Y acima do meio da 1ª linha insere antes dela', () => {
        expect(insertionTarget(5, rows)).toBe(rows[0]);
    });

    it('Y no meio da lista insere antes da linha correspondente', () => {
        expect(insertionTarget(25, rows)).toBe(rows[1]);
        expect(insertionTarget(45, rows)).toBe(rows[2]);
    });

    it('Y abaixo de todas devolve null (inserir ao final)', () => {
        expect(insertionTarget(100, rows)).toBe(null);
    });
});
