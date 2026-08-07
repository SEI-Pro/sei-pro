// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — business-day calendar integrating Brazilian holidays.
 *
 * Pure helpers. Holiday list is either injected (tests) or derived from a
 * lightweight native Easter computation mirroring src/core/feriados.js without
 * depending on moment.
 */
import { addDays, formatDate, parseDate, startOfDay } from './datas.js';

function easterSunday(year) {
    // Anonymous Gregorian algorithm
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
}

function holidayEntry(date, label) {
    return { date: startOfDay(date), label, iso: formatDate(date) };
}

/** National BR holidays for a year (fixed + movable from Easter). */
export function holidaysBr(year) {
    const easter = easterSunday(year);
    return [
        holidayEntry(new Date(year, 0, 1), 'Ano Novo'),
        holidayEntry(addDays(easter, -48), 'Carnaval'),
        holidayEntry(addDays(easter, -47), 'Carnaval'),
        holidayEntry(addDays(easter, -2), 'Paixao de Cristo'),
        holidayEntry(easter, 'Pascoa'),
        holidayEntry(new Date(year, 3, 21), 'Tiradentes'),
        holidayEntry(addDays(easter, 60), 'Corpus Christi'),
        holidayEntry(new Date(year, 4, 1), 'Dia do Trabalho'),
        holidayEntry(new Date(year, 8, 7), 'Independencia'),
        holidayEntry(new Date(year, 9, 12), 'Nossa Senhora Aparecida'),
        holidayEntry(new Date(year, 10, 2), 'Finados'),
        holidayEntry(new Date(year, 10, 15), 'Proclamacao da Republica'),
        holidayEntry(new Date(year, 10, 20), 'Consciencia Negra'),
        holidayEntry(new Date(year, 11, 25), 'Natal')
    ];
}

export function holidaysBetween(start, end, extra = []) {
    const a = startOfDay(start);
    const b = startOfDay(end);
    if (!a || !b) return [];
    const from = a.getTime() <= b.getTime() ? a : b;
    const to = a.getTime() <= b.getTime() ? b : a;
    const out = [];
    const seen = new Set();
    for (let y = from.getFullYear(); y <= to.getFullYear(); y++) {
        for (const h of holidaysBr(y)) {
            if (h.date.getTime() >= from.getTime() && h.date.getTime() <= to.getTime() && !seen.has(h.iso)) {
                seen.add(h.iso);
                out.push(h);
            }
        }
    }
    for (const e of extra || []) {
        const d = parseDate(e.date || e.feriado_data || e);
        if (!d) continue;
        const iso = formatDate(d);
        if (d.getTime() >= from.getTime() && d.getTime() <= to.getTime() && !seen.has(iso)) {
            seen.add(iso);
            out.push(holidayEntry(d, e.label || e.nome_feriado || e.dia || 'Feriado'));
        }
    }
    return out.sort((x, y) => x.date - y.date);
}

export function isWeekend(date) {
    const d = startOfDay(date);
    if (!d) return false;
    const day = d.getDay();
    return day === 0 || day === 6;
}

export function isHoliday(date, holidayList) {
    const d = startOfDay(date);
    if (!d) return false;
    const iso = formatDate(d);
    return (holidayList || []).some((h) => (h.iso || formatDate(h.date || h)) === iso);
}

export function isBusinessDay(date, holidayList) {
    return !isWeekend(date) && !isHoliday(date, holidayList);
}

/** Next business day on or after `date` (if already business, returns it). */
export function nextBusinessDay(date, holidayList) {
    let d = startOfDay(date);
    if (!d) return null;
    let guard = 0;
    while (!isBusinessDay(d, holidayList) && guard < 3660) {
        d = addDays(d, 1);
        guard++;
    }
    return d;
}

/**
 * Add `n` business days to a start date (n>=0).
 * Duration of 1 business day → same day if start is a business day.
 */
export function addBusinessDays(start, n, holidayList) {
    let d = nextBusinessDay(start, holidayList);
    if (!d) return null;
    const steps = Math.max(0, Math.floor(n));
    for (let i = 0; i < steps; i++) {
        d = nextBusinessDay(addDays(d, 1), holidayList);
    }
    return d;
}

/** Count business days in [start, end] inclusive. */
export function countBusinessDays(start, end, holidayList) {
    let a = startOfDay(start);
    let b = startOfDay(end);
    if (!a || !b) return 0;
    if (a.getTime() > b.getTime()) {
        const t = a; a = b; b = t;
    }
    let count = 0;
    let cur = a;
    while (cur.getTime() <= b.getTime()) {
        if (isBusinessDay(cur, holidayList)) count++;
        cur = addDays(cur, 1);
    }
    return count;
}

/**
 * Build frappe-gantt `holidays` + `ignore` options.
 * When `ignoreNonBusiness` is true, weekends and holidays are excluded from
 * duration (ignore); otherwise they are only highlighted.
 */
export function ganttHolidayOptions(rangeStart, rangeEnd, opts = {}) {
    const list = holidaysBetween(rangeStart, rangeEnd, opts.extra || []);
    const highlight = {};
    highlight['var(--g-weekend-highlight-color)'] = 'weekend';
    highlight['var(--g-holiday-highlight-color, #ffecb3)'] = list.map((h) => ({
        date: h.iso,
        label: h.label
    }));
    const ignore = opts.ignoreNonBusiness
        ? ['weekend', ...list.map((h) => h.iso)]
        : [];
    return {
        holidays: highlight,
        ignore,
        is_weekend: (d) => isWeekend(d),
        holidayList: list
    };
}
