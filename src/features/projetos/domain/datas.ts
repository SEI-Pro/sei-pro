// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Projetos — native date helpers (no moment).
 *
 * All persisted dates use the legacy shape `YYYY-MM-DD HH:mm:ss` (or the empty
 * sentinel `0000-00-00 00:00:00`). Parsing/formatting stays pure so domain
 * tests do not need a vendor date library.
 */

const EMPTY = '0000-00-00 00:00:00';
const EMPTY_DATE = '0000-00-00';

export function isEmptyDate(value) {
    if (value == null || value === '') return true;
    const s = String(value).trim();
    return s === EMPTY || s === EMPTY_DATE || s.startsWith('0000-00-00');
}

/**
 * Parse `YYYY-MM-DD[ HH:mm[:ss]]`, `YYYY-MM-DDTHH:mm`, Date, or timestamp.
 * Returns null for empty/invalid input.
 */
export function parseDate(value) {
    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value.getTime());
    }
    if (value == null || value === '') return null;
    if (typeof value === 'number') {
        const d = new Date(value);
        return Number.isNaN(d.getTime()) ? null : d;
    }
    const s = String(value).trim();
    if (isEmptyDate(s)) return null;

    // datetime-local: YYYY-MM-DDTHH:mm
    const local = s.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (local) {
        return new Date(+local[1], +local[2] - 1, +local[3], +local[4], +local[5], +(local[6] || 0));
    }

    const m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (m) {
        return new Date(+m[1], +m[2] - 1, +m[3], +(m[4] || 0), +(m[5] || 0), +(m[6] || 0));
    }

    // BR: DD/MM/YYYY[ HH:mm[:ss]]
    const br = s.match(/^(\d{2})\/(\d{2})\/(\d{4})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?/);
    if (br) {
        return new Date(+br[3], +br[2] - 1, +br[1], +(br[4] || 0), +(br[5] || 0), +(br[6] || 0));
    }

    const fallback = new Date(s);
    return Number.isNaN(fallback.getTime()) ? null : fallback;
}

function pad(n, w = 2) {
    return String(n).padStart(w, '0');
}

/** Format as `YYYY-MM-DD HH:mm:ss` (legacy persistence). Empty → EMPTY sentinel. */
export function formatDateTime(value) {
    const d = parseDate(value);
    if (!d) return EMPTY;
    return (
        d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    );
}

/** Format as `YYYY-MM-DD` (frappe-gantt task start/end). */
export function formatDate(value) {
    const d = parseDate(value);
    if (!d) return '';
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/** Format as `YYYY-MM-DDTHH:mm` for datetime-local inputs. */
export function formatDateTimeLocal(value) {
    const d = parseDate(value);
    if (!d) return '';
    return (
        d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) +
        'T' + pad(d.getHours()) + ':' + pad(d.getMinutes())
    );
}

/** Format for UI display (`DD/MM/YYYY` or `DD/MM/YYYY HH:mm`). */
export function formatDisplay(value, withTime = false) {
    const d = parseDate(value);
    if (!d) return '';
    const base = pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
    if (!withTime) return base;
    return base + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

export function today() {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
}

export function startOfDay(value) {
    const d = parseDate(value);
    if (!d) return null;
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(value, days) {
    const d = parseDate(value);
    if (!d) return null;
    const out = new Date(d.getTime());
    out.setDate(out.getDate() + days);
    return out;
}

/** Calendar-day difference (end - start), truncated to whole days. */
export function diffDays(start, end) {
    const a = startOfDay(start);
    const b = startOfDay(end);
    if (!a || !b) return 0;
    return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function isSameDay(a, b) {
    const x = startOfDay(a);
    const y = startOfDay(b);
    if (!x || !y) return false;
    return x.getTime() === y.getTime();
}

export function minDate(a, b) {
    const x = parseDate(a);
    const y = parseDate(b);
    if (!x) return y;
    if (!y) return x;
    return x.getTime() <= y.getTime() ? x : y;
}

export function maxDate(a, b) {
    const x = parseDate(a);
    const y = parseDate(b);
    if (!x) return y;
    if (!y) return x;
    return x.getTime() >= y.getTime() ? x : y;
}

export function emptyDateSentinel() {
    return EMPTY;
}
