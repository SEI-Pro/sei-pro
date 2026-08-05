import { describe, expect, it } from 'vitest';
import {
    extractHtmlResponse,
    sanitizeSeiHtml,
    validateSeiHtml
} from '../../../../src/features/ai/domain/output.js';

describe('AI SEI HTML output', () => {
    it('accepts dictionary classes and strips an HTML fence', () => {
        const html = extractHtmlResponse('```html\n<p class="Texto_Justificado">Draft</p>\n```');
        expect(validateSeiHtml(html)).toEqual(expect.objectContaining({ valid: true }));
    });

    it('rejects unknown classes, inline styles, and event handlers', () => {
        const result = validateSeiHtml(
            '<p class="made-up" style="color:red" onclick="run()">Draft</p>'
        );
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Classe do SEI não permitida: made-up');
        expect(result.errors).toContain('Estilos inline não são permitidos');
        expect(result.errors).toContain('Eventos inline não são permitidos');
    });

    it('removes unsafe links when DOMPurify is unavailable', () => {
        expect(sanitizeSeiHtml(
            '<p class="Texto_Justificado"><a href="javascript:alert(1)">Link</a></p>'
        )).toBe('<p class="Texto_Justificado"><a>Link</a></p>');
    });
});
