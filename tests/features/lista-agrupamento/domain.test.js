import { describe, expect, it } from 'vitest';
import {
    extractGroupTableTooltipToArray,
    getTagName
} from '../../../src/features/lista-agrupamento/domain.js';

describe('lista-agrupamento domain', () => {
    it('extrai os valores do tooltip legado e remove a chamada wrapper', () => {
        expect(extractGroupTableTooltipToArray(`return infraTooltipMostrar('Órgão','Setor')`))
            .toEqual(['Órgão', 'Setor']);
    });

    it('aceita markup/entidades e rejeita entrada inválida', () => {
        expect(extractGroupTableTooltipToArray('<span>&quot;A&quot;,&quot;B&quot;</span>'))
            .toEqual(['A', 'B']);
        expect(extractGroupTableTooltipToArray('não-json')).toBe(false);
        expect(extractGroupTableTooltipToArray('')).toBe(false);
    });

    it('normaliza acentos e espaços para a chave persistida do grupo', () => {
        expect(getTagName('Órgão Central')).toBe('OrgaoCentral');
        expect(getTagName('')).toBe('SemGrupo');
    });
});