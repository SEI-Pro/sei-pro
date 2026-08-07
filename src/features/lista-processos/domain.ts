// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Lista de processos — pure domain.
 *
 * Filter normalization, caption rewriting, assignment text, and inline JS quoting.
 * No DOM / jQuery / chrome.*.
 */

export function normalizeHomeFilterText(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9 ]/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

export function normalizeHomeFilterKey(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase();
}

/**
 * Rewrite infraCaption text with a new visible-row count.
 * Returns the updated caption string (caller writes to DOM).
 */
export function rewriteHomeFilterCaption(baseCaption, visibleRows) {
    const singular = visibleRows === 1 ? 'registro' : 'registros';
    let updated = String(baseCaption || '').replace(
        /\(\s*\d+\s+registros?\s*\)/i,
        '(' + visibleRows + ' ' + singular + ')'
    );
    if (updated === baseCaption) {
        updated = String(baseCaption || '').replace(/\d+/, String(visibleRows));
    }
    return updated;
}

export function normalizeAssignmentLabelText(linkText) {
    return normalizeHomeFilterText(linkText).replace(/\s+/g, ' ').trim();
}

export function quoteInlineJsText(text) {
    return "'" + String(text || '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r?\n/g, '\\n') + "'";
}

/**
 * Decide whether a process row matches a home filter value.
 * Row facts are passed in (no DOM): { assignmentText, tagName, hasUnread, processText }.
 */
export function rowMatchesHomeFilterFacts(facts, value, dataType) {
    const normalizedValue = normalizeHomeFilterText(value);
    const row = facts || {};

    if (dataType === 'user') {
        return normalizeHomeFilterText(row.assignmentText) === normalizedValue;
    }

    if (dataType === 'tag') {
        const tagName = row.tagName || 'SemGrupo';
        if (value === 'null') {
            return tagName === 'SemGrupo' || row.hasNoMarker === true;
        }
        return normalizeHomeFilterKey(tagName) === normalizeHomeFilterKey(value);
    }

    if (dataType === 'proc') {
        if (normalizedValue === 'nao visualizado') {
            return row.hasUnread === true;
        }
        const haystack = normalizeHomeFilterText(
            [row.processText, row.tooltipText, row.rowText].filter(Boolean).join(' ')
        );
        return haystack.indexOf(normalizedValue) !== -1;
    }

    return false;
}

export function getListIdProtocoloSelectedFromValues(values) {
    if (!Array.isArray(values)) return [];
    return values.map((v) => String(v || '').trim()).filter(Boolean);
}
