import { describe, expect, it } from 'vitest';
import { resolveMenuCatalogs, resolveMenuSelection } from '@src/features/arvore/domain.js';

const fallback = [['Copiar número'], ['Ações em lote']];

describe('arvore/domain — resolveMenuSelection', () => {
    it('preserva a forma legada e descarta entradas inválidas', () => {
        expect(resolveMenuSelection([['Copiar número', 'extra'], null, [' Ações em lote ']], fallback))
            .toEqual([['Copiar número'], [' Ações em lote ']]);
    });

    it('usa o catálogo padrão para seleção ausente ou vazia', () => {
        expect(resolveMenuSelection(undefined, fallback)).toBe(fallback);
        expect(resolveMenuSelection([], fallback)).toBe(fallback);
        expect(resolveMenuSelection([null, ['']], fallback)).toBe(fallback);
    });
});

describe('arvore/domain — resolveMenuCatalogs', () => {
    it('resolve cada catálogo independentemente', () => {
        const defaults = { process: fallback, document: [['Copiar nome']] };
        expect(resolveMenuCatalogs({ process: [['Copiar número']], document: [] }, defaults))
            .toEqual({ process: [['Copiar número']], document: [['Copiar nome']] });
    });
});
