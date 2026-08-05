// @vitest-environment jsdom

import { describe, expect, it, vi } from 'vitest';
import {
    createEditorCommands,
    installDraftAutosave,
    readEditorSnapshot,
    resolveDraftContext
} from '../../../../src/features/editor/view/editor-tools.js';

describe('editor Phase 5 tools', () => {
    it('exposes every actionable toolbar capability through Ctrl+K', () => {
        const commands = createEditorCommands();
        const selectors = commands.map((command) => command.selector).filter(Boolean);
        for (const selector of [
            '.getPlataformAIButtom',
            '.importDocButtom',
            '.getDadosProcessoButtom',
            '.getQuickTableButtom',
            '.getTablestylesButtom',
            '.getCitacaoDocumentoButtom',
            '.getLinkLegisButtom',
            '.getNotaRodapeButtom',
            '.getRefInternaButtom',
            '.getSumarioButtom',
            '.getQrCodeButtom',
            '.getPageBreakButtom',
            '.getSessionBreakButtom',
            '.getBatchImgQualityButtom',
            '.getInsertCheckboxButtom',
            '.getProcessoPublicoButton',
            '.getMinutaWatermarkButton',
            '.pageImageBackgroundButtom',
            '.getMarkSigiloButton',
            '.getBoxSigiloButton',
            '.getReviewButton',
            '.getCtrReviewButton',
            '.getDitadoButton',
            '.getCtrDitadoButton',
            '.getNewStyleButton',
            '.getLegisButtom',
            '.getCapLetterButtom',
            '.getFontSizeUpButtom',
            '.getFontSizeDownButtom',
            '.getCopyStyleButtom',
            '.getAlignLeftButtom',
            '.getAlignCenterButtom',
            '.getAlignRightButtom',
            '.getAlignJustifyButtom'
        ]) {
            expect(selectors).toContain(selector);
        }
        expect(commands.find((command) => command.id === 'import')?.label)
            .toBe('Inserir texto de conteúdo externo (Word, HTML ou Google)');
    });

    it('runs the toolbar command for the active CKEditor section', () => {
        document.body.innerHTML = `
            <div class="cke_button_disabled">
                <button class="getDadosProcessoButtom"></button>
            </div>
            <div>
                <button class="getDadosProcessoButtom"></button>
            </div>
        `;
        const buttons = document.querySelectorAll('.getDadosProcessoButtom');
        const disabledClick = vi.spyOn(buttons[0], 'click');
        const activeClick = vi.spyOn(buttons[1], 'click');
        const command = createEditorCommands()
            .find((item) => item.id === 'process-data');

        expect(command.run()).toBe(true);
        expect(disabledClick).not.toHaveBeenCalled();
        expect(activeClick).toHaveBeenCalledOnce();
    });

    it('wires the snippets command to the snippets repository', async () => {
        document.body.replaceChildren();
        const draftRepository = { listDrafts: vi.fn() };
        const snippetRepository = {
            list: vi.fn(async () => []),
            save: vi.fn(),
            remove: vi.fn()
        };
        const command = createEditorCommands({
            repository: draftRepository,
            snippetRepository,
            getInstances: () => ({})
        }).find((item) => item.id === 'snippets');

        command.run();
        await vi.waitFor(() => expect(snippetRepository.list).toHaveBeenCalledWith('geral'));
        expect(draftRepository.listDrafts).not.toHaveBeenCalled();
        document.querySelector('.seipro-modal-close')?.click();
    });

    it('resolves draft identity from the SEI editor URL', () => {
        expect(resolveDraftContext({
            href: 'https://sei.example/controlador.php?acao=editor_montar&id_procedimento=123&id_documento=456'
        }, document)).toEqual({
            processId: '123',
            documentId: '456'
        });
    });

    it('reads all current CKEditor sections', () => {
        expect(readEditorSnapshot({
            first: { getData: () => '<p>First</p>' },
            ignored: {},
            second: { getData: () => '<p>Second</p>' }
        })).toEqual({
            first: '<p>First</p>',
            second: '<p>Second</p>'
        });
    });

    it('saves a changed dirty editor and skips an unchanged snapshot', async () => {
        let html = '<p>Initial</p>';
        let dirty = false;
        const saveDraft = vi.fn(async (draft) => draft);
        const setIntervalFn = vi.fn(() => 10);
        const clearIntervalFn = vi.fn();
        const autosave = installDraftAutosave({
            getInstances: () => ({
                editor: {
                    getData: () => html,
                    checkDirty: () => dirty
                }
            }),
            context: { processId: 'p', documentId: 'd' },
            repository: { saveDraft },
            setIntervalFn,
            clearIntervalFn,
            title: 'Document',
            sourceUrl: 'https://sei.example/editor'
        });

        await expect(autosave.snapshot()).resolves.toBeNull();
        html = '<p>Changed</p>';
        dirty = true;
        await autosave.snapshot();
        await expect(autosave.snapshot()).resolves.toBeNull();

        expect(saveDraft).toHaveBeenCalledOnce();
        expect(saveDraft).toHaveBeenCalledWith({
            processId: 'p',
            documentId: 'd',
            editors: { editor: '<p>Changed</p>' },
            title: 'Document',
            sourceUrl: 'https://sei.example/editor'
        });
        autosave.stop();
        expect(clearIntervalFn).toHaveBeenCalledWith(10);
    });
});
