import { describe, expect, it } from 'vitest';
import {
    extractEditorMontarUrl,
    getUrlDocumentoId,
    isValidEditorMontarUrl,
    linkMatchesDocumentoId,
    editorWindowNeedsNavigate,
    repairEditorMontarUrl
} from '../../src/shared/sei-editor-url.ts';

describe('sei-editor-url', () => {
    it('rejects truncated editor URLs with empty id_documento', () => {
        const truncated =
            "janela.location = 'controlador.php?acao=editor_montar&acao_origem=arvore_visualizar&id_procedimento=1&id_documento='+idDocumento+'&infra_hash=abc';";
        expect(extractEditorMontarUrl(truncated)).toBeNull();
        expect(isValidEditorMontarUrl(
            'controlador.php?acao=editor_montar&id_procedimento=1&id_documento='
        )).toBe(false);
    });

    it('stitches SEI JS concatenation when the id variable is assigned nearby', () => {
        const html =
            "var idDocumento = 7788;\n" +
            "janela.location = 'controlador.php?acao=editor_montar&id_procedimento=1&id_documento='+idDocumento+'&infra_hash=abc';";
        expect(extractEditorMontarUrl(html)).toBe(
            'controlador.php?acao=editor_montar&id_procedimento=1&id_documento=7788&infra_hash=abc'
        );
    });

    it('extracts a complete editor_montar URL with numeric id', () => {
        const html =
            "x 'controlador.php?acao=editor_montar&id_procedimento=10&id_documento=99&infra_hash=abc' y";
        expect(extractEditorMontarUrl(html)).toBe(
            'controlador.php?acao=editor_montar&id_procedimento=10&id_documento=99&infra_hash=abc'
        );
        expect(getUrlDocumentoId(extractEditorMontarUrl(html))).toBe('99');
    });

    it('linkMatchesDocumentoId rejects empty ids and prefix collisions', () => {
        const link = 'controlador.php?acao=editor_montar&id_documento=12345';
        expect(linkMatchesDocumentoId(link, '')).toBe(false);
        expect(linkMatchesDocumentoId(link, '12')).toBe(false);
        expect(linkMatchesDocumentoId(link, '12345')).toBe(true);
    });

    it('editorWindowNeedsNavigate detects blank and empty-id editor URLs', () => {
        expect(editorWindowNeedsNavigate('about:blank')).toBe(true);
        expect(editorWindowNeedsNavigate(
            'controlador.php?acao=editor_montar&id_documento=&infra_hash=abc'
        )).toBe(true);
        expect(editorWindowNeedsNavigate(
            'controlador.php?acao=editor_montar&id_documento=99&infra_hash=abc'
        )).toBe(false);
    });

    it('repairs an editor URL when SEI leaves the document id empty', () => {
        expect(repairEditorMontarUrl(
            'controlador.php?acao=editor_montar&id_procedimento=1&id_documento=&infra_hash=abc',
            '7788',
            'https://sei.prf.gov.br/sei/controlador.php'
        )).toBe('/sei/controlador.php?acao=editor_montar&id_procedimento=1&id_documento=7788&infra_hash=abc');
        expect(repairEditorMontarUrl(
            'controlador.php?acao=documento_alterar&id_documento=1',
            '',
            'https://sei.prf.gov.br/sei/controlador.php'
        )).toBeNull();
    });
});
