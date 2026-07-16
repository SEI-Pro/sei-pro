import { describe, expect, it } from 'vitest';
import { extractTextWithNumbering } from '@src/features/editor/domain.js';

describe('editor/domain — extractTextWithNumbering', () => {
    it('numera itens e parágrafos respeitando a hierarquia', () => {
        expect(extractTextWithNumbering([
            { className: 'Item_Nivel1', textContent: 'Primeiro' },
            { className: 'Item_Nivel2', textContent: 'Subitem' },
            { className: 'Item_Nivel1', textContent: 'Segundo' },
            { className: 'Paragrafo_Numerado_Nivel1', textContent: 'Parágrafo' },
            { className: 'Paragrafo_Numerado_Nivel2', textContent: 'Subparágrafo' }
        ])).toBe('1. Primeiro\n1.1. Subitem\n2. Segundo\n1. Parágrafo\n1.1. Subparágrafo');
    });

    it('reinicia letras e numeração romana nos grupos correspondentes', () => {
        expect(extractTextWithNumbering([
            { className: 'Item_Inciso_Romano', textContent: 'Um' },
            { className: 'Item_Inciso_Romano', textContent: 'Dois' },
            { className: 'Item_Alinea_Letra', textContent: 'Alínea A' },
            { className: 'Item_Alinea_Letra', textContent: 'Alínea B' },
            { className: 'Item_Inciso_Romano', textContent: 'Três' }
        ])).toBe('I - Um\nII - Dois\na) Alínea A\nb) Alínea B\nIII - Três');
    });

    it('preserva parágrafos sem classe e remove espaços externos', () => {
        expect(extractTextWithNumbering([{ className: '', textContent: '  texto simples  ' }]))
            .toBe('texto simples');
    });
});
