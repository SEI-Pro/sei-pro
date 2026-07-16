import { extractTextWithNumbering } from './domain.js';

/**
 * Fronteira de IO do editor: o parser/DOM fica injetado pela fachada legada,
 * enquanto a normalização dos parágrafos e a regra de numeração permanecem
 * testáveis sem depender de DOMParser, window ou CKEditor.
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
