import { describe, expect, it } from 'vitest';
import {
    exportEtapasCsv,
    filterEtapas,
    findEtapaNome,
    sortEtapas,
    sortProjetos,
    tiposOptions
} from '../../../src/features/projetos/domain/filters.js';

describe('projetos/domain/filters', () => {
    const projetos = [
        { id_projeto: 2, nome_projeto: 'Beta', ativo: true, id_tipo_projeto: 1, nome_tipo_projeto: 'Interno', etapas: [{ id_etapa: 10, nome_etapa: 'X' }] },
        { id_projeto: 1, nome_projeto: 'Alpha', ativo: false, id_tipo_projeto: 2, nome_tipo_projeto: 'Cap', etapas: [] }
    ];

    it('sorts and filters arquivados/tipo', () => {
        expect(sortProjetos(projetos).map((p) => p.nome_projeto)).toEqual(['Beta']);
        expect(sortProjetos(projetos, { includeArquivados: true }).map((p) => p.nome_projeto)).toEqual(['Alpha', 'Beta']);
        expect(sortProjetos(projetos, { includeArquivados: true, idTipo: 2 })).toHaveLength(1);
    });

    it('sorts etapas by date/name', () => {
        const etapas = [
            { id_etapa: 2, nome_etapa: 'B', data_inicio_programado: '2026-07-10 00:00:00' },
            { id_etapa: 1, nome_etapa: 'A', data_inicio_programado: '2026-07-01 00:00:00' }
        ];
        expect(sortEtapas(etapas)[0].id_etapa).toBe(1);
        expect(sortEtapas(etapas, 'nome_etapa')[0].nome_etapa).toBe('A');
    });

    it('tiposOptions and findEtapaNome', () => {
        expect(tiposOptions(projetos)).toHaveLength(2);
        expect(findEtapaNome(projetos, 10)).toBe('X');
    });

    it('filterEtapas and csv export', () => {
        const etapas = [
            { nome_etapa: 'A', responsavel: 'Ana', critico: true, progresso_execucao: 10, data_fim_programado: '2026-01-01 00:00:00', data_fim_execucao: '0000-00-00 00:00:00' },
            { nome_etapa: 'B', responsavel: 'Bruno', critico: false, progresso_execucao: 100, data_fim_programado: '2026-12-01 00:00:00' }
        ];
        expect(filterEtapas(etapas, { responsavel: 'Ana' })).toHaveLength(1);
        expect(filterEtapas(etapas, { critico: true })).toHaveLength(1);
        const csv = exportEtapasCsv(etapas);
        expect(csv.split('\n')[0]).toContain('nome_etapa');
        expect(csv.split('\n').length).toBe(3);
    });
});
