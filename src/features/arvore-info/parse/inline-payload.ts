/**
 * Parse PURO dos payloads que o SEI embute em <script> inline (`Nos[0]...`).
 * Sem DOM: recebem o texto do script e devolvem string/null.
 */

export function extractNosAcoesHtml(scriptText: unknown): string | null {
    const t = typeof scriptText === 'string' ? scriptText : '';
    const m = t.match(/Nos\[0\]\.acoes\s*=\s*'([\s\S]*?)';/);
    if (!m) return null;
    return (m[1] ?? '').replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\//g, '/');
}

export function extractNosHtml(scriptText: unknown): string | null {
    const t = typeof scriptText === 'string' ? scriptText : '';
    if (t.indexOf('Nos[0].html = ') === -1) return null;
    const m = t.match(/Nos\[0\]\.html\s*=\s*'([^']+)'/);
    return m ? (m[1] ?? null) : null;
}
