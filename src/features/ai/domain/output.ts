// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { isAllowedSeiClass } from '../../../shared/sei-styles.js';

const ALLOWED_TAGS = new Set([
    'a', 'blockquote', 'br', 'em', 'li', 'ol', 'p', 'span', 'strong',
    'table', 'tbody', 'td', 'th', 'thead', 'tr', 'u', 'ul'
]);

export function extractHtmlResponse(value) {
    const text = String(value || '').trim();
    const fenced = /^```(?:html)?\s*([\s\S]*?)\s*```$/i.exec(text);
    return (fenced ? fenced[1] : text).trim();
}

export function validateSeiHtml(html) {
    const source = extractHtmlResponse(html);
    const errors = [];
    const tagPattern = /<\/?([a-z][\w-]*)\b([^>]*)>/gi;
    let match;
    while ((match = tagPattern.exec(source))) {
        const tag = match[1].toLocaleLowerCase();
        if (!ALLOWED_TAGS.has(tag)) errors.push(`Tag HTML não permitida: ${tag}`);
        const classMatch = /\bclass\s*=\s*(["'])(.*?)\1/i.exec(match[2]);
        if (classMatch) {
            classMatch[2].split(/\s+/).filter(Boolean).forEach(function (className) {
                if (!isAllowedSeiClass(className)) {
                    errors.push(`Classe do SEI não permitida: ${className}`);
                }
            });
        }
        if (/\bon\w+\s*=/i.test(match[2])) errors.push('Eventos inline não são permitidos');
        if (/\bstyle\s*=/i.test(match[2])) errors.push('Estilos inline não são permitidos');
    }
    if (!/<[a-z][\s\S]*>/i.test(source)) errors.push('A resposta não está em HTML');
    return { valid: errors.length === 0, errors: [...new Set(errors)], html: source };
}

export function sanitizeSeiHtml(html, purifier) {
    const result = validateSeiHtml(html);
    if (!result.valid) {
        throw new Error(result.errors.join('; '));
    }
    if (!purifier || typeof purifier.sanitize !== 'function') {
        return sanitizeAttributesFallback(result.html);
    }
    return purifier.sanitize(result.html, {
        ALLOWED_TAGS: [...ALLOWED_TAGS],
        ALLOWED_ATTR: ['class', 'href', 'target', 'rel'],
        ALLOW_DATA_ATTR: false
    });
}

function sanitizeAttributesFallback(html) {
    return String(html).replace(/<([a-z][\w-]*)([^>]*)>/gi, function (_, tag, attributes) {
        const kept = [];
        const attributePattern = /\b(class|href|target|rel)\s*=\s*(["'])(.*?)\2/gi;
        let match;
        while ((match = attributePattern.exec(attributes))) {
            const name = match[1].toLocaleLowerCase();
            const value = match[3];
            if (name === 'href' && !isSafeHref(value)) continue;
            if (name === 'target' && !['_blank', '_self'].includes(value)) continue;
            kept.push(`${name}="${escapeAttribute(value)}"`);
        }
        return `<${tag.toLocaleLowerCase()}${kept.length ? ` ${kept.join(' ')}` : ''}>`;
    });
}

function isSafeHref(value) {
    const normalized = String(value || '').trim().toLocaleLowerCase();
    return normalized.startsWith('https://')
        || normalized.startsWith('http://')
        || normalized.startsWith('mailto:')
        || normalized.startsWith('#')
        || normalized.startsWith('/');
}

function escapeAttribute(value) {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}
