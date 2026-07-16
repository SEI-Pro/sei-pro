import { describe, expect, it } from 'vitest';
import {
    extractGroupTableTooltipToArray,
    getTagName
} from '../../../src/features/lista-agrupamento/domain.js';
import {
    clearGroupCollapsed,
    isGroupCollapsed,
    persistGroupCollapsed,
    readGroupOrder,
    readReceivedProcess,
    readSelectedGroup
} from '../../../src/features/lista-agrupamento/io.js';

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

    it('isola leitura e escrita das opções de agrupamento', () => {
        const values = { orderbyTableGroup: 'desc', panelGroup_Orgao: true };
        const writes = [];
        expect(readGroupOrder((key) => values[key])).toBe('desc');
        expect(readGroupOrder(() => '')).toBe('asc');
        expect(isGroupCollapsed((key) => values[key], 'Orgao')).toBe(true);
        persistGroupCollapsed((key, value) => writes.push(['set', key, value]), 'Orgao');
        clearGroupCollapsed((key) => writes.push(['remove', key]), 'Orgao');
        expect(writes).toEqual([
            ['set', 'panelGroup_Orgao', true],
            ['remove', 'panelGroup_Orgao']
        ]);
    });

    it('lê grupo selecionado e registro de recebimento por dependências injetadas', () => {
        const records = [{ id_procedimento: '42', processo: 'P-42' }];
        const restore = (key) => key === 'selectGroupTablePro' ? ['arrivaldate'] : records;
        const getParams = () => ({ id_procedimento: 42 });
        const jmespath = { search: (items, expression) => expression.includes('42') ? items[0] : '' };
        expect(readSelectedGroup(restore)).toEqual(['arrivaldate']);
        expect(readReceivedProcess(restore, getParams, jmespath, '/x')).toEqual(records[0]);
        expect(readReceivedProcess(() => [], getParams, jmespath, '/x')).toBe('');
    });
});