/** Notify the isolated AI feature without exposing runtime/storage to MAIN. */
import { api } from '../api.js';
import { requestAiOpen } from '../ai-bridge.js';

export function loadEditorAiBundle() {
    return Promise.resolve(true);
}

export function loadPlataformAI(this_) {
    let editorId = '';
    try {
        editorId = String(this_?.closest?.('.cke')?.id || '').replace(/^cke_/, '');
    } catch { /* active editor fallback */ }
    requestAiOpen(editorId);
}

api.loadEditorAiBundle = loadEditorAiBundle;
api.loadPlataformAI = loadPlataformAI;
