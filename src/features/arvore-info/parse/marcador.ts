/**
 * Regras PURAS da seção "Marcador".
 */

export function parseAcaoRemoverId(onclickAttr: unknown): string | null {
    const s = typeof onclickAttr === 'string' ? onclickAttr : '';
    const m = s.match(/acaoRemover\('([^']+)'/);
    return m ? (m[1] ?? null) : null;
}
