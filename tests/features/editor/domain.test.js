import { describe, expect, it } from 'vitest';
import { extractTextWithNumbering } from '@src/features/editor/domain.ts';
import { extractTextFromHtml } from '@src/features/editor/domain/html-text.ts';
import { bindEditorFocus, collectEditorText } from '@src/features/editor/view.ts';

describe('editor/domain — extractTextWithNumbering', () => {
    it('numera itens e parágrafos respeitando a hierarquia', () => {
        expect(extractTextWithNumbering([
            { className: 'Item_Nivel1', textContent: 'Primeiro' },
            { className: 'Item_Nivel2', textContent: 'Subitem' },
            { className: 'Item_Nivel1', textContent: 'Segundo' },
            { className: 'Paragrafo_Numerado_Nivel1', textContent: 'Parágrafo' },
            { className: 'Paragrafo_Numerado_Nivel2', textContent: 'Subparágrafo' }
        ])).toBe('1. Primeiro\n1.1. Subitem\n2. Segundo\n1. Parágrafo\n1.1. Subparágrafo');
    });

    it('reinicia letras e numeração romana nos grupos correspondentes', () => {
        expect(extractTextWithNumbering([
            { className: 'Item_Inciso_Romano', textContent: 'Um' },
            { className: 'Item_Inciso_Romano', textContent: 'Dois' },
            { className: 'Item_Alinea_Letra', textContent: 'Alínea A' },
            { className: 'Item_Alinea_Letra', textContent: 'Alínea B' },
            { className: 'Item_Inciso_Romano', textContent: 'Três' }
        ])).toBe('I - Um\nII - Dois\na) Alínea A\nb) Alínea B\nIII - Três');
    });

    it('preserva parágrafos sem classe e remove espaços externos', () => {
        expect(extractTextWithNumbering([{ className: '', textContent: '  texto simples  ' }]))
            .toBe('texto simples');
    });
});

describe('editor/domain/html-text — extractTextFromHtml', () => {
    it('injeta o parser e normaliza parágrafos antes de chamar o domínio', () => {
        const parseHtml = (html) => ({
            html,
            querySelectorAll: () => [
                { className: 'Item_Nivel1', textContent: '  Primeiro  ' },
                { className: '', textContent: ' Segundo ' }
            ]
        });
        const extract = (paragraphs) => paragraphs.map(({ className, textContent }) => `${className}:${textContent}`).join('|');

        expect(extractTextFromHtml(' <p>conteúdo</p> ', { parseHtml, extract }))
            .toBe('Item_Nivel1:  Primeiro  |: Segundo ');
    });

    it('usa o domínio de numeração por padrão e preserva o HTML como string', () => {
        let receivedHtml;
        const parseHtml = (html) => {
            receivedHtml = html;
            return { querySelectorAll: () => [{ className: 'Item_Nivel1', textContent: 'Texto' }] };
        };

        expect(extractTextFromHtml(null, { parseHtml })).toBe('1. Texto');
        expect(receivedHtml).toBe('');
    });

    it('falha cedo quando a dependência de parsing não é fornecida', () => {
        expect(() => extractTextFromHtml('<p>x</p>')).toThrow('requer parseHtml');
    });
});

describe('editor/view — orchestration', () => {
    it('coleta todos os editores e aplica a estratégia de texto selecionada', () => {
        const instances = {
            first: { getData: () => '<p>um</p>' },
            second: { getData: () => '<p>dois</p>' }
        };
        expect(collectEditorText(instances, {
            readText: (html) => html.replace(/<[^>]+>/g, '').toUpperCase()
        })).toBe('UMDOIS');
        expect(collectEditorText(instances, {
            extractNumber: true,
            extractNumbered: (html) => `N:${html}`
        })).toBe('N:<p>um</p>N:<p>dois</p>');
    });

    it('instala o handler de foco em cada instância e informa a contagem', () => {
        const handlers = [];
        const instances = {
            first: { on: (event, handler) => handlers.push([event, handler]) },
            second: { on: (event, handler) => handlers.push([event, handler]) }
        };
        const onFocus = () => {};
        expect(bindEditorFocus(instances, onFocus)).toBe(2);
        expect(handlers).toEqual([['focus', onFocus], ['focus', onFocus]]);
    });
});
