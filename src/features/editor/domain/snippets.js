const PLACEHOLDER_PATTERN = /\{\{\s*([\p{L}\p{N}_-]+)\s*\}\}/gu;

export function renderSnippet(template = '', values = {}) {
    const normalized = Object.fromEntries(Object.entries(values).map(([key, value]) => [
        String(key).toLocaleLowerCase(),
        String(value ?? '')
    ]));
    return String(template).replace(PLACEHOLDER_PATTERN, (match, key) => {
        const normalizedKey = key.toLocaleLowerCase();
        return Object.prototype.hasOwnProperty.call(normalized, normalizedKey)
            ? normalized[normalizedKey]
            : match;
    });
}

export function snippetToHtml(text = '') {
    const escaped = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    return escaped.split(/\r?\n/).map((line) => `<p>${line || '<br>'}</p>`).join('');
}
