// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { ready } from '../../dom/index.js';
import { getSeiPro } from '../../core/global.js';
import { extractTextWithNumbering } from './domain.js';
import { extractTextFromHtml } from './domain/html-text.js';
import { bindEditorFocus, collectEditorText } from './view.js';
import { installEditorLegacyApi } from './legacy-api.js';
import { bootEditor } from './adapter.js';
import { scanChecklist } from './domain/checklist.js';
import { createReviewMetadata, formatReviewTime } from './domain/review.js';
import {
    deleteDraft,
    getDraftRepository,
    listDrafts,
    loadDraft,
    saveDraft
} from './io/drafts.js';
import { getSnippetRepository } from './io/snippets.js';
import {
    installDraftAutosave,
    installEditorTools,
    openChecklistPanel,
    openDraftRestorePanel,
    openSnippetPanel
} from './view/editor-tools.js';
import { installEditorAiBridge } from './ai-bridge.js';
import { installEditorDelegatedActions } from './view/delegated-actions.js';
import { openProcessDocumentDiff } from './diff-controller.js';

const root = getSeiPro();
const editorApi = Object.freeze({
    extractTextWithNumbering,
    extractTextFromHtml,
    bindEditorFocus,
    collectEditorText,
    scanChecklist,
    createReviewMetadata,
    formatReviewTime,
    saveDraft,
    loadDraft,
    listDrafts,
    deleteDraft,
    installDraftAutosave,
    openChecklistPanel,
    openDraftRestorePanel,
    openSnippetPanel
});

export function installEditor() {
    root.features = root.features || {};
    root.features.editor = editorApi;
    installEditorLegacyApi();
    ready(() => {
        try {
            installEditorAiBridge();
            installEditorDelegatedActions();
            bootEditor();
            installEditorTools({
                repository: getDraftRepository(),
                snippetRepository: getSnippetRepository(),
                openDiff: () => openProcessDocumentDiff()
            });
        } catch (error) {
            console.error('SEI Pro editor boot failed', error);
        }
    });
}
