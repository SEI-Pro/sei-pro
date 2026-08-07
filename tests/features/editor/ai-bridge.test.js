// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    installEditorAiBridge,
    requestAiInline,
    requestAiOpen
} from '../../../src/features/editor/ai-bridge.ts';
import {
    installIsolatedEditorAiBridge,
    insertEditorHtml,
    readEditorSnapshot
} from '../../../src/features/ai/io/editor-bridge.ts';

describe('minimal isolated editor AI bridge', () => {
    beforeEach(() => {
        document.getElementById('seipro-editor-ai-bridge')?.remove();
        document.body.replaceChildren();
        document.documentElement.removeAttribute('data-seipro-editor-injected');
        const editable = document.createElement('div');
        editable.innerHTML = '<p>+gpt redija</p>';
        const editor = {
            name: 'txaConteudo',
            getData: () => '<p>Minuta atual</p>',
            getSelection: () => ({ getSelectedText: () => 'trecho selecionado' }),
            editable: () => ({ $: editable }),
            focus: vi.fn(),
            fire: vi.fn(),
            insertHtml: vi.fn()
        };
        window.CKEDITOR = { instances: { txaConteudo: editor } };
        window.dadosProcessoPro = {
            propProcesso: {
                rdoNivelAcesso: '1',
                selHipoteseLegal: 'Investigação',
                hdnProtocoloFormatado: '00001.000001/2026-00'
            },
            listDocumentos: [{
                id_documento: '10',
                numeroSEI: '2843449',
                tipo: 'Despacho',
                nivelAcesso: 0
            }],
            listLinksAll: ['/controlador.php?acao=documento_visualizar&id_documento=10'],
            listAndamento: [{ descricao: 'Processo autuado' }]
        };
        installEditorAiBridge();
    });

    it('returns only serializable editor data and access metadata', async () => {
        const result = await readEditorSnapshot({ editorId: 'txaConteudo' });
        expect(result).toMatchObject({
            editorId: 'txaConteudo',
            html: '<p>Minuta atual</p>',
            selectedText: 'trecho selecionado',
            nivelAcesso: '1',
            accessKnown: true,
            hipoteseLegal: 'Investigação',
            process: { processNumber: '00001.000001/2026-00', accessLevel: '1' },
            documents: [expect.objectContaining({
                id: '10',
                numeroSEI: '2843449',
                tipo: 'Despacho',
                src: expect.stringContaining('id_documento=10')
            })],
            history: [{ descricao: 'Processo autuado' }]
        });
    });

    it('inserts sanitized HTML through the CKEditor seam', async () => {
        await insertEditorHtml({
            editorId: 'txaConteudo',
            html: '<p class="Texto_Justificado">Resultado</p>'
        });
        expect(window.CKEDITOR.instances.txaConteudo.insertHtml)
            .toHaveBeenCalledWith('<p class="Texto_Justificado">Resultado</p>');
    });

    it('signals visible open and inline actions without runtime access', () => {
        const onOpen = vi.fn();
        const onInline = vi.fn();
        installIsolatedEditorAiBridge({ onOpen, onInline });
        requestAiOpen('txaConteudo');
        requestAiInline({
            editorId: 'txaConteudo',
            prompt: 'redija',
            marker: '+gpt redija'
        });
        expect(onOpen).toHaveBeenCalledWith({ editorId: 'txaConteudo' });
        expect(onInline).toHaveBeenCalledWith({
            editorId: 'txaConteudo',
            prompt: 'redija',
            marker: '+gpt redija'
        });
    });
});
