// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/** Domínio puro do agrupamento da lista de processos. */

function removeAcentos(value) {
    return (typeof value === 'string' && typeof value.normalize === 'function')
        ? value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        : value;
}

function normalizeTooltipSource(value) {
    return String(value)
        .replace(/<[^>]*>?/gm, '')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/&amp;/gi, '&')
        .replace('return infraTooltipMostrar(', '')
        .replace(/\);?$/, '')
        .replace(/["']/g, '"');
}

export function extractGroupTableTooltipToArray(value) {
    if (value === undefined || value === null || value === '') return false;
    const source = normalizeTooltipSource(value);
    if (source === '') return false;
    try {
        const array = JSON.parse('[' + source + ']');
        return array.length > 0 ? array : false;
    } catch (error) {
        return false;
    }
}

export function getTagName(tagName, type) {
    return (tagName !== undefined && tagName !== '')
        ? removeAcentos(tagName).replace(/\ /g, '')
        : 'SemGrupo';
}

export function installListaAgrupamentoDomain(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.features.listaAgrupamento = {
        extractGroupTableTooltipToArray,
        getTagName
    };
}