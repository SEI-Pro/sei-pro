/**
 * Regras PURAS da seção "Atribuição".
 */

export function isAtribuicaoUnassigned(text: unknown, hasAncoraSigla: unknown): boolean {
    const t = typeof text === 'string' ? text : '';
    return !/atribuído para/i.test(t) && !!hasAncoraSigla;
}
