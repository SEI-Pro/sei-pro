function normalizeSearch(value) {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase()
        .replace(/\s+/g, ' ')
        .trim();
}

export function filterProcessFields(fields = [], query = '') {
    const terms = normalizeSearch(query).split(' ').filter(Boolean);
    if (!terms.length) return fields.slice();
    return fields.filter(([label]) => {
        const searchable = normalizeSearch(label);
        return terms.every((term) => searchable.includes(term));
    });
}

export function processFieldPreview(value, { parseHtml } = {}) {
    const html = String(value || '');
    if (!html) return 'Selecione um campo para visualizar o valor.';
    if (typeof parseHtml !== 'function') return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    const document = parseHtml(html);
    const text = String(document.body?.textContent || '').replace(/\s+/g, ' ').trim();
    return text || 'Conteúdo formatado (imagem, código QR ou elemento do SEI).';
}
