/**
 * Regras PURAS de checklist da Anotação (prefixo no início da linha).
 */

export function stripChecklistMarker(text: unknown): string {
    const t = typeof text === 'string' ? text : '';
    return t.replace(/^\[[ X]\]\s*/, '');
}

export function parseAnotLinePrefix(raw: unknown): { check: boolean; checked: boolean; rest: string } {
    const r = typeof raw === 'string' ? raw : '';
    if (r.indexOf('[X]') === 0) return { check: true, checked: true, rest: r.slice(3).trim() };
    if (r.indexOf('[ ]') === 0) return { check: true, checked: false, rest: r.slice(3).trim() };
    return { check: false, checked: false, rest: r };
}
