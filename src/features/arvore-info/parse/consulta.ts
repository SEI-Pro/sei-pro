/**
 * Regras PURAS da seção "Consulta".
 */

export function acessoLabel(value: unknown, hipoteseText?: string | null): string {
    if (value == null || value === '') return '';
    const map: Record<string, string> = { '0': 'Público', '1': 'Restrito', '2': 'Sigiloso' };
    const key = String(value);
    let txt = map[key] || key;
    if (key === '1' && hipoteseText) txt += ': ' + hipoteseText;
    return txt;
}

export function splitInteressado(name: unknown): string[] {
    const n = typeof name === 'string' ? name : '';
    const parts = n.indexOf('(') !== -1
        ? n.split('(').map(function (s) { return s.trim().replace(')', ''); })
        : [n];
    return parts.filter(function (p) { return p; });
}
