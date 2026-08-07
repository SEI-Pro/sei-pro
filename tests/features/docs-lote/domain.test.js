import { describe, it, expect } from 'vitest';
import {
    extractNewDocUrl,
    extractEditorUrl,
    interpolateEspecificacao,
    computeDataCrossing,
    buildCrossingRegex,
    serializeParams
} from '@src/features/docs-lote/domain.ts';

describe('docs-lote/domain — extractNewDocUrl', () => {
    it('extrai a URL de novo documento da árvore', () => {
        const html = `<a href="controlador.php?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&id_procedimento=42&infra=1">novo</a>`;
        expect(extractNewDocUrl(html)).toBe(
            'controlador.php?acao=documento_escolher_tipo&acao_origem=arvore_visualizar&id_procedimento=42&infra=1'
        );
    });
    it('lança quando não encontra', () => {
        expect(() => extractNewDocUrl('<html>nada</html>')).toThrow();
    });
});

describe('docs-lote/domain — extractEditorUrl', () => {
    it('extrai o link do editor', () => {
        const html = `algo "controlador.php?acao=editor_montar&id_procedimento=7&id_documento=9" fim`;
        expect(extractEditorUrl(html)).toBe(
            'controlador.php?acao=editor_montar&id_procedimento=7&id_documento=9'
        );
    });
    it('lança quando ausente', () => {
        expect(() => extractEditorUrl('sem link')).toThrow();
    });
    it('lança quando id_documento está vazio (URL truncada do SEI)', () => {
        const truncated =
            "janela.location = 'controlador.php?acao=editor_montar&id_procedimento=7&id_documento='+id+'&infra_hash=abc';";
        expect(() => extractEditorUrl(truncated)).toThrow();
    });
    it('resolve concatenação JS quando o id está atribuído no HTML', () => {
        const html =
            "var id = 55;\njanela.location = 'controlador.php?acao=editor_montar&id_procedimento=7&id_documento='+id+'&infra_hash=abc';";
        expect(extractEditorUrl(html)).toBe(
            'controlador.php?acao=editor_montar&id_procedimento=7&id_documento=55&infra_hash=abc'
        );
    });
});

describe('docs-lote/domain — interpolateEspecificacao', () => {
    it('substitui campos presentes e mantém ausentes literais', () => {
        expect(interpolateEspecificacao('Certificado de ##nome## (##falta##)', { nome: 'Ana' }))
            .toBe('Certificado de Ana (##falta##)');
    });
    it('string vazia retorna vazia', () => {
        expect(interpolateEspecificacao('', { a: 1 })).toBe('');
    });
});

describe('docs-lote/domain — computeDataCrossing', () => {
    it('retorna só os cabeçalhos que casam com campos dinâmicos', () => {
        const fields = ['##nome##', '##cpf##', '##ausente##'];
        const headers = ['nome', 'cpf', 'extra'];
        expect(computeDataCrossing(fields, headers)).toEqual(['nome', 'cpf']);
    });
    it('sem correspondência retorna vazio', () => {
        expect(computeDataCrossing(['##x##'], ['y'])).toEqual([]);
    });
});

describe('docs-lote/domain — buildCrossingRegex', () => {
    it('casa qualquer ##campo## listado', () => {
        const re = buildCrossingRegex(['nome', 'cpf']);
        expect('Olá ##nome##, ##cpf##'.replace(re, 'X')).toBe('Olá X, X');
    });
});

describe('docs-lote/domain — serializeParams', () => {
    it('serializa em querystring escapando só as chaves marcadas', () => {
        const upper = (v) => String(v).toUpperCase();
        const out = serializeParams({ a: 'x', b: 'y' }, (k) => k === 'b', upper);
        expect(out).toBe('a=x&b=Y');
    });
    it('sem escape quando shouldEscapeKey é falso', () => {
        expect(serializeParams({ a: '1', b: '2' }, null, null)).toBe('a=1&b=2');
    });
});
