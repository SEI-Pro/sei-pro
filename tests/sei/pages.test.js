import { describe, expect, it } from 'vitest';
import { identifyPage, contextsForUrl } from '../../src/sei/pages.ts';

describe('sei.pages.identifyPage', () => {
    it('identifies procedimento_controlar as lista', () => {
        const page = identifyPage(
            'https://sei.exemplo.gov.br/sei/controlador.php?acao=procedimento_controlar&infra_sistema=1'
        );
        expect(page.acao).toBe('procedimento_controlar');
        expect(page.context).toBe('lista');
        expect(page.contexts).toContain('lista');
        expect(page.contexts).toContain('all');
    });

    it('identifies arvore_visualizar as arvore', () => {
        const page = identifyPage(
            'https://sei.exemplo.gov.br/controlador.php?acao=arvore_visualizar&id_procedimento=1'
        );
        expect(page.context).toBe('arvore');
        expect(page.contexts).toContain('arvore');
    });

    it('identifies documento_visualizar as documento', () => {
        const page = identifyPage(
            'https://sei.exemplo.gov.br/controlador.php?acao=documento_visualizar&acao_origem=procedimento_visualizar&id_documento=2'
        );
        expect(page.acao).toBe('documento_visualizar');
        expect(page.acaoOrigem).toBe('procedimento_visualizar');
        expect(page.context).toBe('documento');
    });

    it('identifies editor_montar as editor', () => {
        const page = identifyPage(
            'https://sei.exemplo.gov.br/controlador.php?acao=editor_montar&id_documento=2'
        );
        expect(page.context).toBe('editor');
    });

    it('identifies sip login', () => {
        const page = identifyPage('https://sei.exemplo.gov.br/sip/login.php?sigla_orgao=X');
        expect(page.isSipLogin).toBe(true);
        expect(page.context).toBe('login');
    });

    it('identifies procedimento_visualizar as visualizacao', () => {
        const page = identifyPage(
            'https://sei.exemplo.gov.br/controlador.php?acao=procedimento_visualizar&id_procedimento=1'
        );
        expect(page.context).toBe('visualizacao');
    });

    it('contextsForUrl returns unknown for unrelated URLs', () => {
        expect(contextsForUrl('https://example.com/')).toEqual(['unknown']);
    });
});
