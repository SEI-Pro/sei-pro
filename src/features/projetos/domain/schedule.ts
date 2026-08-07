// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — schedule / CPM (critical path, float, topological order).
 * Pure: no DOM, no chrome.*, no moment.
 */
import { addBusinessDays, countBusinessDays, holidaysBetween, isBusinessDay } from './calendario.js';
import { addDays, diffDays, formatDateTime, parseDate, startOfDay } from './datas.js';
import { normalizePredecessoras } from './model.js';

function durationDays(etapa, holidayList) {
    const start = startOfDay(etapa.data_inicio_programado);
    const end = startOfDay(etapa.data_fim_programado);
    if (!start || !end) return etapa.marco ? 0 : 1;
    if (etapa.marco) return 0;
    if (etapa.calendario === 'util') {
        return Math.max(1, countBusinessDays(start, end, holidayList));
    }
    return Math.max(1, diffDays(start, end) + 1);
}

function endFromStart(start, duration, calendario, holidayList) {
    if (duration <= 0) return start;
    if (calendario === 'util') {
        // duration business days inclusive → add (duration-1)
        return addBusinessDays(start, duration - 1, holidayList);
    }
    return addDays(start, duration - 1);
}

function constraintDate(pred, tipo, lag, holidayList) {
    const pStart = startOfDay(pred.data_inicio_programado);
    const pEnd = startOfDay(pred.data_fim_programado);
    if (!pStart || !pEnd) return null;
    let base;
    if (tipo === 'SS') base = pStart;
    else if (tipo === 'FF' || tipo === 'SF') base = pEnd;
    else base = addDays(pEnd, 1); // FS: finish → next day start
    if (lag) {
        // lag in calendar days for FS/SS/FF/SF (business lag applied when util)
        base = addDays(base, lag);
    }
    return base;
}

/**
 * Topological order of etapas. Throws on cycle (returns { order, cycle }).
 */
export function topologicalSort(etapas) {
    const byId = new Map((etapas || []).map((e) => [e.id_etapa, e]));
    const indeg = new Map();
    const adj = new Map();
    for (const e of byId.values()) {
        indeg.set(e.id_etapa, 0);
        adj.set(e.id_etapa, []);
    }
    for (const e of byId.values()) {
        for (const p of normalizePredecessoras(e)) {
            if (!byId.has(p.id_etapa)) continue;
            adj.get(p.id_etapa).push(e.id_etapa);
            indeg.set(e.id_etapa, (indeg.get(e.id_etapa) || 0) + 1);
        }
    }
    const q = [...indeg.entries()].filter(([, d]) => d === 0).map(([id]) => id);
    const order = [];
    while (q.length) {
        const id = q.shift();
        order.push(id);
        for (const n of adj.get(id) || []) {
            indeg.set(n, indeg.get(n) - 1);
            if (indeg.get(n) === 0) q.push(n);
        }
    }
    if (order.length !== byId.size) {
        const leftover = [...byId.keys()].filter((id) => !order.includes(id));
        return { order: order.map((id) => byId.get(id)), cycle: leftover };
    }
    return { order: order.map((id) => byId.get(id)), cycle: null };
}

/**
 * Forward/backward pass → earliest/latest start/finish + total float + critical flag.
 * Mutates copies; returns enriched etapas + project finish + critical ids.
 */
export function computeSchedule(etapas, opts = {}) {
    const list = (etapas || []).map((e) => ({ ...e, predecessoras: normalizePredecessoras(e) }));
    if (!list.length) {
        return { etapas: [], criticalIds: [], projectFinish: null, cycle: null };
    }

    const rangeStart = list.reduce((min, e) => {
        const d = parseDate(e.data_inicio_programado);
        return !d || (min && d >= min) ? min || d : d;
    }, null);
    const rangeEnd = list.reduce((max, e) => {
        const d = parseDate(e.data_fim_programado);
        return !d || (max && d <= max) ? max || d : d;
    }, null);
    const holidayList = opts.holidayList || holidaysBetween(
        rangeStart || new Date(),
        addDays(rangeEnd || new Date(), 365) || new Date()
    );

    const { order, cycle } = topologicalSort(list);
    if (cycle) {
        return {
            etapas: list.map((e) => ({ ...e, folga: null, critico: false })),
            criticalIds: [],
            projectFinish: null,
            cycle
        };
    }

    const byId = new Map(order.map((e) => [e.id_etapa, { ...e }]));

    // Forward pass — earliest start/finish from constraints + duration
    for (const e of order) {
        const cur = byId.get(e.id_etapa);
        const dur = durationDays(cur, holidayList);
        cur._duration = dur;
        let es = startOfDay(cur.data_inicio_programado);
        for (const p of cur.predecessoras) {
            const pred = byId.get(p.id_etapa);
            if (!pred) continue;
            const c = constraintDate(pred, p.tipo, p.lag_dias, holidayList);
            if (c && (!es || c.getTime() > es.getTime())) es = c;
        }
        if (!es) es = startOfDay(new Date());
        if (cur.calendario === 'util') {
            while (!isBusinessDay(es, holidayList)) es = addDays(es, 1);
        }
        const ef = endFromStart(es, dur, cur.calendario, holidayList);
        cur._es = es;
        cur._ef = ef;
    }

    let projectFinish = null;
    for (const e of byId.values()) {
        if (!projectFinish || e._ef.getTime() > projectFinish.getTime()) projectFinish = e._ef;
    }

    // Backward pass
    const rev = [...order].reverse();
    for (const e of rev) {
        const cur = byId.get(e.id_etapa);
        let lf = projectFinish;
        // successors
        for (const other of byId.values()) {
            for (const p of other.predecessoras) {
                if (p.id_etapa !== cur.id_etapa) continue;
                // constraint inverted roughly: successor ES implies predecessor LF
                const succEs = other._es;
                if (p.tipo === 'FS') {
                    const cand = addDays(succEs, -1 - (p.lag_dias || 0));
                    if (!lf || cand.getTime() < lf.getTime()) lf = cand;
                } else if (p.tipo === 'SS') {
                    const cand = addDays(succEs, -(p.lag_dias || 0));
                    // LF = LS + dur - 1 ≈ cand + dur - 1
                    const candLf = endFromStart(cand, cur._duration, cur.calendario, holidayList);
                    if (!lf || candLf.getTime() < lf.getTime()) lf = candLf;
                } else if (p.tipo === 'FF' || p.tipo === 'SF') {
                    const cand = addDays(other._ef, -(p.lag_dias || 0));
                    if (!lf || cand.getTime() < lf.getTime()) lf = cand;
                }
            }
        }
        if (!lf) lf = projectFinish;
        const ls = cur._duration <= 0
            ? lf
            : (cur.calendario === 'util'
                ? (() => {
                    // walk back duration business days
                    let d = lf;
                    let left = cur._duration - 1;
                    while (left > 0) {
                        d = addDays(d, -1);
                        if (isBusinessDay(d, holidayList)) left--;
                    }
                    while (!isBusinessDay(d, holidayList)) d = addDays(d, -1);
                    return d;
                })()
                : addDays(lf, -(cur._duration - 1)));
        cur._lf = lf;
        cur._ls = ls;
        cur.folga = diffDays(cur._es, cur._ls);
        cur.critico = cur.folga === 0;
    }

    const criticalIds = [...byId.values()].filter((e) => e.critico).map((e) => e.id_etapa);
    const enriched = order.map((e) => {
        const cur = byId.get(e.id_etapa);
        return {
            ...cur,
            data_inicio_programado: formatDateTime(cur._es),
            data_fim_programado: formatDateTime(cur._ef),
            folga: cur.folga,
            critico: cur.critico
        };
    });

    return {
        etapas: enriched,
        criticalIds,
        projectFinish: projectFinish ? formatDateTime(projectFinish) : null,
        cycle: null
    };
}

/**
 * Cascade reprogramation: move one etapa by deltaDays and push successors
 * that would violate FS/SS/FF/SF. Returns new etapas array.
 */
export function cascadeMove(etapas, idEtapa, newStart, newEnd, opts = {}) {
    const list = (etapas || []).map((e) => ({ ...e, predecessoras: normalizePredecessoras(e) }));
    const target = list.find((e) => e.id_etapa === Number(idEtapa));
    if (!target) return list;
    const oldStart = startOfDay(target.data_inicio_programado);
    const ns = startOfDay(newStart) || oldStart;
    const ne = startOfDay(newEnd) || startOfDay(target.data_fim_programado);
    const delta = oldStart ? diffDays(oldStart, ns) : 0;
    target.data_inicio_programado = formatDateTime(ns);
    target.data_fim_programado = formatDateTime(ne);

    if (!opts.moveDependencies) return list;

    const { order } = topologicalSort(list);
    const byId = new Map(list.map((e) => [e.id_etapa, e]));
    const holidayList = opts.holidayList || [];

    for (const e of order) {
        if (e.id_etapa === target.id_etapa) continue;
        const cur = byId.get(e.id_etapa);
        let minStart = startOfDay(cur.data_inicio_programado);
        for (const p of cur.predecessoras) {
            const pred = byId.get(p.id_etapa);
            if (!pred) continue;
            const c = constraintDate(pred, p.tipo, p.lag_dias, holidayList);
            if (c && (!minStart || c.getTime() > minStart.getTime())) minStart = c;
        }
        const curStart = startOfDay(cur.data_inicio_programado);
        if (minStart && curStart && minStart.getTime() > curStart.getTime()) {
            const shift = diffDays(curStart, minStart);
            cur.data_inicio_programado = formatDateTime(minStart);
            cur.data_fim_programado = formatDateTime(addDays(startOfDay(cur.data_fim_programado), shift));
        } else if (delta && opts.shiftAll) {
            cur.data_inicio_programado = formatDateTime(addDays(curStart, delta));
            cur.data_fim_programado = formatDateTime(addDays(startOfDay(cur.data_fim_programado), delta));
        }
    }
    return list;
}

/** Aggregate etapas by macroetapa → summary bars. */
export function macroetapaSummaries(etapas) {
    const groups = new Map();
    for (const e of etapas || []) {
        const key = (e.macroetapa || '').trim() || '(sem macroetapa)';
        if (!groups.has(key)) {
            groups.set(key, {
                macroetapa: key,
                etapas: [],
                data_inicio: null,
                data_fim: null,
                progresso: 0,
                critico: false
            });
        }
        groups.get(key).etapas.push(e);
    }
    const out = [];
    for (const g of groups.values()) {
        let start = null;
        let end = null;
        let progSum = 0;
        let durSum = 0;
        let critico = false;
        for (const e of g.etapas) {
            const s = parseDate(e.data_inicio_programado);
            const f = parseDate(e.data_fim_programado);
            if (s && (!start || s < start)) start = s;
            if (f && (!end || f > end)) end = f;
            const d = Math.max(1, diffDays(s, f) + 1);
            progSum += (e.progresso_execucao || 0) * d;
            durSum += d;
            if (e.critico) critico = true;
        }
        out.push({
            macroetapa: g.macroetapa,
            data_inicio_programado: start ? formatDateTime(start) : null,
            data_fim_programado: end ? formatDateTime(end) : null,
            progresso_execucao: durSum ? Math.round(progSum / durSum) : 0,
            critico,
            count: g.etapas.length
        });
    }
    return out;
}

/** Group etapas across projects by responsavel. */
export function groupByResponsavel(projetos) {
    const map = new Map();
    for (const p of projetos || []) {
        for (const e of p.etapas || []) {
            const key = (e.responsavel || '').trim() || '(sem responsavel)';
            if (!map.has(key)) map.set(key, []);
            map.get(key).push({ ...e, nome_projeto: p.nome_projeto, id_projeto: p.id_projeto });
        }
    }
    return [...map.entries()].map(([responsavel, etapas]) => ({ responsavel, etapas }));
}
