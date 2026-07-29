/**
 * Projetos — map domain etapas ↔ frappe-gantt 1.2.2 task objects.
 */
import { formatDate, isEmptyDate, parseDate } from './domain/datas.js';
import { ganttHolidayOptions, holidaysBetween } from './domain/calendario.js';
import { barStatus, effectiveProgress, expectedProgress } from './domain/progress.js';
import { computeSchedule, macroetapaSummaries } from './domain/schedule.js';
import { sortEtapas } from './domain/filters.js';
import { normalizePredecessoras } from './domain/model.js';

function depIds(etapa) {
    const preds = normalizePredecessoras(etapa);
    return preds.map((p) => String(p.id_etapa));
}

/**
 * Build gantt tasks for a projeto.
 * @param {object} projeto
 * @param {object} opts { orderBy, showExecucao, showMacro, applySchedule, ignoreNonBusiness }
 */
export function projetoToGanttTasks(projeto, opts = {}) {
    let etapas = sortEtapas(projeto.etapas || [], opts.orderBy || 'data_inicio');
    let criticalIds = new Set();
    if (opts.applySchedule !== false) {
        const scheduled = computeSchedule(etapas);
        etapas = scheduled.etapas;
        criticalIds = new Set(scheduled.criticalIds || []);
    }

    const rangeStart = etapas.reduce((min, e) => {
        const d = parseDate(e.data_inicio_programado);
        return !d || (min && d < min) ? (d || min) : min;
    }, null);
    const rangeEnd = etapas.reduce((max, e) => {
        const d = parseDate(e.data_fim_programado);
        return !d || (max && d > max) ? (d || max) : max;
    }, null);

    const holidayOpts = ganttHolidayOptions(
        rangeStart || new Date(),
        rangeEnd || new Date(),
        { ignoreNonBusiness: !!opts.ignoreNonBusiness }
    );

    const tasks = [];

    if (opts.showMacro) {
        for (const m of macroetapaSummaries(etapas)) {
            if (!m.data_inicio_programado || !m.data_fim_programado) continue;
            tasks.push({
                id: 'macro_' + m.macroetapa,
                name: m.macroetapa,
                start: formatDate(m.data_inicio_programado),
                end: formatDate(m.data_fim_programado),
                progress: m.progresso_execucao,
                dependencies: [],
                custom_class: 'seipro-projetos-bar--macro' + (m.critico ? ' seipro-projetos-bar--critical' : ''),
                _meta: { kind: 'macro', macroetapa: m.macroetapa }
            });
        }
    }

    for (const e of etapas) {
        const { progress } = effectiveProgress(e);
        const status = barStatus({ ...e, critico: criticalIds.has(e.id_etapa) || e.critico }, { progress });
        const start = formatDate(e.data_inicio_programado);
        const end = formatDate(e.data_fim_programado);
        if (!start || !end) continue;

        tasks.push({
            id: String(e.id_etapa),
            name: e.nome_etapa,
            start,
            end,
            progress,
            dependencies: depIds(e),
            custom_class: 'seipro-projetos-bar--' + status,
            expected_progress: expectedProgress(e),
            _meta: {
                kind: 'etapa',
                etapa: e,
                id_projeto: projeto.id_projeto,
                critico: criticalIds.has(e.id_etapa) || !!e.critico,
                folga: e.folga
            }
        });

        if (
            opts.showExecucao &&
            !isEmptyDate(e.data_inicio_execucao) &&
            !isEmptyDate(e.data_fim_execucao)
        ) {
            tasks.push({
                id: String(e.id_etapa) + '_exec',
                name: e.nome_etapa + ' (execucao)',
                start: formatDate(e.data_inicio_execucao),
                end: formatDate(e.data_fim_execucao),
                progress,
                dependencies: [String(e.id_etapa)],
                custom_class: 'seipro-projetos-bar--executed',
                _meta: { kind: 'executed', etapa: e, id_projeto: projeto.id_projeto }
            });
        }
    }

    return { tasks, holidayOpts, etapas, criticalIds: [...criticalIds] };
}

/** Portfolio view: one summary bar per projeto. */
export function portfolioToGanttTasks(projetos) {
    const tasks = [];
    for (const p of projetos || []) {
        if (!p.etapas || !p.etapas.length) continue;
        const starts = p.etapas.map((e) => parseDate(e.data_inicio_programado)).filter(Boolean);
        const ends = p.etapas.map((e) => parseDate(e.data_fim_programado)).filter(Boolean);
        if (!starts.length || !ends.length) continue;
        const start = new Date(Math.min(...starts.map((d) => d.getTime())));
        const end = new Date(Math.max(...ends.map((d) => d.getTime())));
        const prog = Math.round(
            p.etapas.reduce((s, e) => s + (e.progresso_execucao || 0), 0) / p.etapas.length
        );
        tasks.push({
            id: 'proj_' + p.id_projeto,
            name: p.nome_projeto,
            start: formatDate(start),
            end: formatDate(end),
            progress: prog,
            dependencies: [],
            custom_class: 'seipro-projetos-bar--portfolio',
            _meta: { kind: 'projeto', projeto: p }
        });
    }
    return tasks;
}

/** Map gantt date_change callback back to etapa date fields. */
export function taskDatesToEtapaPatch(task) {
    const start = parseDate(task._start || task.start);
    const end = parseDate(task._end || task.end);
    return {
        id_etapa: Number(String(task.id).replace(/_exec$/, '')),
        data_inicio_programado: start,
        data_fim_programado: end,
        progresso_execucao: task.progress
    };
}

export function buildGanttOptions({ editable = true, holidayOpts = {}, onClick, onDateChange, onProgressChange, popup } = {}) {
    return {
        language: 'pt-BR',
        view_mode: 'Month',
        view_mode_select: true,
        today_button: true,
        container_height: 'auto',
        scroll_to: 'today',
        bar_height: 18,
        bar_corner_radius: 3,
        padding: 16,
        move_dependencies: true,
        show_expected_progress: true,
        readonly: !editable,
        readonly_dates: !editable,
        readonly_progress: !editable,
        holidays: holidayOpts.holidays,
        ignore: holidayOpts.ignore || [],
        popup_on: 'click',
        popup: popup || undefined,
        on_click: onClick,
        on_date_change: onDateChange,
        on_progress_change: onProgressChange
    };
}

export function holidayListForProjeto(projeto) {
    const etapas = projeto.etapas || [];
    const starts = etapas.map((e) => parseDate(e.data_inicio_programado)).filter(Boolean);
    const ends = etapas.map((e) => parseDate(e.data_fim_programado)).filter(Boolean);
    if (!starts.length) return [];
    return holidaysBetween(
        new Date(Math.min(...starts.map((d) => d.getTime()))),
        new Date(Math.max(...ends.map((d) => d.getTime())))
    );
}
