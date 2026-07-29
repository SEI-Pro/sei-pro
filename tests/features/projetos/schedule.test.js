import { describe, expect, it } from 'vitest';
import { computeSchedule, topologicalSort, cascadeMove, macroetapaSummaries } from '../../../src/features/projetos/domain/schedule.js';
import { normalizeEtapa } from '../../../src/features/projetos/domain/model.js';

function etapa(partial) {
    return normalizeEtapa(partial);
}

describe('projetos/domain/schedule', () => {
    it('topological order respects FS deps', () => {
        const etapas = [
            etapa({ id_etapa: 2, nome_etapa: 'B', id_dependencia: 1, data_inicio_programado: '2026-07-10 00:00:00', data_fim_programado: '2026-07-12 00:00:00' }),
            etapa({ id_etapa: 1, nome_etapa: 'A', data_inicio_programado: '2026-07-01 00:00:00', data_fim_programado: '2026-07-05 00:00:00' }),
            etapa({ id_etapa: 3, nome_etapa: 'C', id_dependencia: 2, data_inicio_programado: '2026-07-13 00:00:00', data_fim_programado: '2026-07-15 00:00:00' })
        ];
        const { order, cycle } = topologicalSort(etapas);
        expect(cycle).toBeNull();
        expect(order.map((e) => e.id_etapa)).toEqual([1, 2, 3]);
    });

    it('detects cycles', () => {
        const etapas = [
            etapa({ id_etapa: 1, id_dependencia: 2, data_inicio_programado: '2026-07-01 00:00:00', data_fim_programado: '2026-07-02 00:00:00' }),
            etapa({ id_etapa: 2, id_dependencia: 1, data_inicio_programado: '2026-07-03 00:00:00', data_fim_programado: '2026-07-04 00:00:00' })
        ];
        const { cycle } = topologicalSort(etapas);
        expect(cycle).not.toBeNull();
        expect(cycle.length).toBe(2);
    });

    it('marks critical path with zero float', () => {
        const etapas = [
            etapa({ id_etapa: 1, nome_etapa: 'A', data_inicio_programado: '2026-07-01 00:00:00', data_fim_programado: '2026-07-03 00:00:00' }),
            etapa({
                id_etapa: 2,
                nome_etapa: 'B',
                predecessoras: [{ id_etapa: 1, tipo: 'FS', lag_dias: 0 }],
                data_inicio_programado: '2026-07-04 00:00:00',
                data_fim_programado: '2026-07-06 00:00:00'
            }),
            etapa({
                id_etapa: 3,
                nome_etapa: 'Slack',
                data_inicio_programado: '2026-07-01 00:00:00',
                data_fim_programado: '2026-07-01 00:00:00'
            })
        ];
        const { criticalIds, etapas: out } = computeSchedule(etapas);
        expect(criticalIds).toContain(1);
        expect(criticalIds).toContain(2);
        const slack = out.find((e) => e.id_etapa === 3);
        expect(slack.folga).toBeGreaterThan(0);
    });

    it('cascadeMove pushes successors when moveDependencies', () => {
        const etapas = [
            etapa({ id_etapa: 1, data_inicio_programado: '2026-07-01 00:00:00', data_fim_programado: '2026-07-03 00:00:00' }),
            etapa({
                id_etapa: 2,
                predecessoras: [{ id_etapa: 1, tipo: 'FS', lag_dias: 0 }],
                data_inicio_programado: '2026-07-04 00:00:00',
                data_fim_programado: '2026-07-05 00:00:00'
            })
        ];
        const moved = cascadeMove(etapas, 1, '2026-07-05 00:00:00', '2026-07-07 00:00:00', { moveDependencies: true });
        const b = moved.find((e) => e.id_etapa === 2);
        expect(b.data_inicio_programado.startsWith('2026-07-08')).toBe(true);
    });

    it('aggregates macroetapas', () => {
        const etapas = [
            etapa({ id_etapa: 1, macroetapa: 'Plan', data_inicio_programado: '2026-07-01 00:00:00', data_fim_programado: '2026-07-03 00:00:00', progresso_execucao: 50 }),
            etapa({ id_etapa: 2, macroetapa: 'Plan', data_inicio_programado: '2026-07-04 00:00:00', data_fim_programado: '2026-07-06 00:00:00', progresso_execucao: 100 })
        ];
        const sums = macroetapaSummaries(etapas);
        expect(sums).toHaveLength(1);
        expect(sums[0].macroetapa).toBe('Plan');
        expect(sums[0].count).toBe(2);
    });
});
