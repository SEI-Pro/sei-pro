// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — progress / bar status / baseline deviation (pure).
 */
import { diffDays, isEmptyDate, parseDate, today } from './datas.js';

/**
 * Auto-progress percent between two dates (0–100), based on "now".
 * Pure replacement for the side-effecting render path in the legacy file.
 */
export function autoProgressPercent(start, end, now = today()) {
    const a = parseDate(start);
    const b = parseDate(end);
    const n = parseDate(now) || today();
    if (!a || !b) return 0;
    if (b.getTime() <= a.getTime()) return n >= b ? 100 : 0;
    if (n <= a) return 0;
    if (n >= b) return 100;
    const total = b.getTime() - a.getTime();
    const done = n.getTime() - a.getTime();
    return Math.max(0, Math.min(100, Math.round((done / total) * 100)));
}

/**
 * Compute effective progress for an etapa without writing anywhere.
 * Returns { progress, auto, changed }.
 */
export function effectiveProgress(etapa, now = today()) {
    const stored = Math.max(0, Math.min(100, Number(etapa.progresso_execucao) || 0));
    const hasAuto =
        !isEmptyDate(etapa.data_inicio_progresso_automatico) &&
        isEmptyDate(etapa.data_fim_execucao) &&
        stored < 100;
    if (!hasAuto) return { progress: stored, auto: false, changed: false };
    const pct = autoProgressPercent(
        etapa.data_inicio_progresso_automatico,
        etapa.data_fim_progresso_automatico,
        now
    );
    if (pct < 0 || pct === stored) return { progress: stored, auto: true, changed: false };
    return { progress: pct, auto: true, changed: pct !== stored };
}

/**
 * Bar CSS class status for Gantt rendering.
 * ongoing | inday | delay | complete | executed | critical | milestone
 */
export function barStatus(etapa, opts = {}) {
    const now = parseDate(opts.now) || today();
    const start = parseDate(etapa.data_inicio_programado);
    const end = parseDate(etapa.data_fim_programado);
    const progress = opts.progress != null
        ? opts.progress
        : effectiveProgress(etapa, now).progress;

    if (etapa.marco) return 'milestone';
    if (!isEmptyDate(etapa.data_fim_execucao)) return 'complete';
    if (opts.executedBar) return 'executed';
    if (progress < 100 && end && end < now) return 'delay';
    if (start && end && now >= start && now <= end) return 'ongoing';
    if (etapa.critico) return 'critical';
    return 'inday';
}

/**
 * Baseline vs actual deviation in calendar days (positive = late finish).
 */
export function baselineDeviation(etapa) {
    const plannedEnd = parseDate(etapa.data_fim_programado);
    const actualEnd = parseDate(etapa.data_fim_execucao);
    if (!plannedEnd || !actualEnd || isEmptyDate(etapa.data_fim_execucao)) {
        return { days: null, late: false, early: false };
    }
    const days = diffDays(plannedEnd, actualEnd);
    return { days, late: days > 0, early: days < 0 };
}

/**
 * Expected progress today vs planned window (for show_expected_progress).
 */
export function expectedProgress(etapa, now = today()) {
    return autoProgressPercent(etapa.data_inicio_programado, etapa.data_fim_programado, now);
}

/** Deadline alerts for a list of etapas. */
export function deadlineAlerts(etapas, opts = {}) {
    const now = parseDate(opts.now) || today();
    const warnDays = opts.warnDays == null ? 3 : opts.warnDays;
    const alerts = [];
    for (const e of etapas || []) {
        if (!isEmptyDate(e.data_fim_execucao)) continue;
        const end = parseDate(e.data_fim_programado);
        if (!end) continue;
        const daysLeft = diffDays(now, end);
        const progress = effectiveProgress(e, now).progress;
        if (daysLeft < 0 && progress < 100) {
            alerts.push({
                level: 'overdue',
                id_etapa: e.id_etapa,
                id_projeto: e.id_projeto,
                nome_etapa: e.nome_etapa,
                days: daysLeft,
                message: 'Etapa atrasada em ' + Math.abs(daysLeft) + ' dia(s)'
            });
        } else if (daysLeft >= 0 && daysLeft <= warnDays && progress < 100) {
            alerts.push({
                level: 'warning',
                id_etapa: e.id_etapa,
                id_projeto: e.id_projeto,
                nome_etapa: e.nome_etapa,
                days: daysLeft,
                message: 'Prazo em ' + daysLeft + ' dia(s)'
            });
        }
    }
    return alerts;
}
