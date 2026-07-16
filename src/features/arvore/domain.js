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

export function hasUploadFiles(dataTransfer) {
    if (!dataTransfer) return false;
    if (dataTransfer.files && dataTransfer.files.length > 0) return true;
    if (!dataTransfer.types) return false;
    return Array.prototype.indexOf.call(dataTransfer.types, 'Files') !== -1;
}

export function serializeUploadAttachment(response, params, formatBytes) {
    const tamanho = response[3];
    const value = [response[0], response[1], response[4], tamanho,
        formatBytes(Number.parseInt(tamanho, 10)), params.userUnidade.user,
        params.userUnidade.unidade].join('\u00B1');
    return encodeURIComponent(value.replace(/ /g, '+')).replace(/%C2/g, '').replace(/%2B/g, '+');
}

export function extractUploadExtensions(lines) {
    return lines.reduce((extensions, line) => {
        if (line.includes('arrExt')) {
            const extension = line.split('"')[1];
            if (extension !== undefined) extensions.push(`.${extension}`);
        }
        return extensions;
    }, []);
}

export function sortUploadFiles(files, getPosition) {
    return files.slice().sort((a, b) => getPosition(a) > getPosition(b) ? 1 : -1);
}
