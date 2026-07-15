// Domínio puro do catálogo/seleção de menus da árvore.
// A borda legada continua responsável por storage, jQuery e renderização.

function isMenuEntry(value) {
    return Array.isArray(value) && typeof value[0] === 'string' && value[0].trim() !== '';
}

/**
 * Resolve uma seleção persistida, preservando a forma legada [[label], ...].
 * Valores ausentes, vazios ou malformados voltam para o catálogo padrão.
 */
export function resolveMenuSelection(stored, fallback) {
    if (!Array.isArray(stored) || stored.length === 0) return fallback;
    const valid = stored.filter(isMenuEntry).map((entry) => [entry[0]]);
    return valid.length > 0 ? valid : fallback;
}

/**
 * Resolve os quatro catálogos configuráveis usados pelo toolbar/painel.
 */
export function resolveMenuCatalogs(stored, defaults) {
    const source = stored || {};
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
        key,
        resolveMenuSelection(source[key], fallback)
    ]));
}
