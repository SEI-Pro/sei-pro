/**
 * Tree observation pipeline + peer enrichers — owned by `arvore`, not `infoarvore`.
 * Called from the feature descriptor before the rest of arvore install / before arvore-info.
 */
import { ensureTreePipeline } from './tree-pipeline.js';
import { installTreeEnrichers } from './tree-enrichers.js';

export type InstallArvoreTreePipelineDeps = {
    window?: Window & typeof globalThis;
    document?: Document;
};

export function installArvoreTreePipeline(deps: InstallArvoreTreePipelineDeps = {}): void {
    const pipeline = ensureTreePipeline({
        window: deps.window,
        document: deps.document
    });
    if (!pipeline) return;
    installTreeEnrichers({ register: pipeline.register, doc: pipeline.doc });
}
