import { extractTextWithNumbering } from '../domain.js';

/**
 * Converte HTML do editor em uma representação testável de parágrafos.
 * O chamador injeta o parser para manter esta regra independente do navegador.
 */
export function extractTextFromHtml(html, {
    parseHtml,
    extract = extractTextWithNumbering
} = {}) {
    if (typeof parseHtml !== 'function') {
        throw new TypeError('extractTextFromHtml requer parseHtml');
    }

    const document = parseHtml(String(html ?? ''));
    const paragraphs = Array.from(document.querySelectorAll('p'), (paragraph) => ({
        className: paragraph.className,
        textContent: paragraph.textContent
    }));

    return extract(paragraphs);
}
