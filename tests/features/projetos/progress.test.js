import { describe, expect, it } from 'vitest';
import {
    autoProgressPercent,
    barStatus,
    baselineDeviation,
    deadlineAlerts,
    effectiveProgress,
    expectedProgress
} from '../../../src/features/projetos/domain/progress.js';

describe('projetos/domain/progress', () => {
    it('autoProgressPercent mid-window', () => {
        const pct = autoProgressPercent('2026-07-01 00:00:00', '2026-07-11 00:00:00', '2026-07-06 00:00:00');
        expect(pct).toBe(50);
    });

    it('effectiveProgress prefers auto when configured', () => {
        const etapa = {
            progresso_execucao: 10,
            data_inicio_progresso_automatico: '2026-07-01 00:00:00',
            data_fim_progresso_automatico: '2026-07-11 00:00:00',
            data_fim_execucao: '0000-00-00 00:00:00'
        };
        const r = effectiveProgress(etapa, '2026-07-06 00:00:00');
        expect(r.auto).toBe(true);
        expect(r.changed).toBe(true);
        expect(r.progress).toBe(50);
    });

    it('barStatus delay/complete/milestone', () => {
        expect(barStatus({
            marco: true,
            data_inicio_programado: '2026-07-01 00:00:00',
            data_fim_programado: '2026-07-01 00:00:00',
            data_fim_execucao: '0000-00-00 00:00:00',
            progresso_execucao: 0
        })).toBe('milestone');

        expect(barStatus({
            data_inicio_programado: '2026-06-01 00:00:00',
            data_fim_programado: '2026-06-10 00:00:00',
            data_fim_execucao: '0000-00-00 00:00:00',
            progresso_execucao: 20
        }, { now: '2026-07-01 00:00:00' })).toBe('delay');

        expect(barStatus({
            data_inicio_programado: '2026-06-01 00:00:00',
            data_fim_programado: '2026-06-10 00:00:00',
            data_fim_execucao: '2026-06-09 00:00:00',
            progresso_execucao: 100
        })).toBe('complete');
    });

    it('baselineDeviation and expectedProgress', () => {
        const etapa = {
            data_inicio_programado: '2026-07-01 00:00:00',
            data_fim_programado: '2026-07-10 00:00:00',
            data_fim_execucao: '2026-07-12 00:00:00'
        };
        const d = baselineDeviation(etapa);
        expect(d.days).toBe(2);
        expect(d.late).toBe(true);
        expect(expectedProgress(etapa, '2026-07-01 00:00:00')).toBe(0);
    });

    it('deadlineAlerts overdue and warning', () => {
        const alerts = deadlineAlerts([
            {
                id_etapa: 1,
                nome_etapa: 'Late',
                data_fim_programado: '2026-07-01 00:00:00',
                data_fim_execucao: '0000-00-00 00:00:00',
                progresso_execucao: 50
            },
            {
                id_etapa: 2,
                nome_etapa: 'Soon',
                data_fim_programado: '2026-07-30 00:00:00',
                data_fim_execucao: '0000-00-00 00:00:00',
                progresso_execucao: 10
            }
        ], { now: '2026-07-29 00:00:00', warnDays: 3 });
        expect(alerts.some((a) => a.level === 'overdue')).toBe(true);
        expect(alerts.some((a) => a.level === 'warning')).toBe(true);
    });
});
