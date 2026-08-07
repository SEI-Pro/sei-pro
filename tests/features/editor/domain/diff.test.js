import { describe, expect, it } from 'vitest';
import { semanticDiff } from '../../../../src/features/editor/domain/diff.ts';

describe('semanticDiff', () => {
    it('groups additions and removals while ignoring accent/case-only changes', () => {
        const result = semanticDiff(
            'O servidor apresentou requerimento.',
            'O Servidor apresentou novo requerimento.'
        );
        expect(result.parts.some((part) => part.type === 'add' && part.text.includes('novo'))).toBe(true);
        expect(result.removed).toBe(0);
    });

    it('reports removed terms', () => {
        const result = semanticDiff('Pedido integral deferido', 'Pedido deferido');
        expect(result.parts).toContainEqual({ type: 'remove', text: 'integral' });
        expect(result.removed).toBe(1);
    });
});
