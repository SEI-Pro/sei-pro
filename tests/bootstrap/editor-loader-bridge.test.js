import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const read = (relative) => readFileSync(join(rootDir, relative), 'utf8');

describe('editor loader security boundary', () => {
    it('never proxies runtime messages, storage or LLM ports into MAIN', () => {
        const loader = read('src/bootstrap/editor-loader.js');
        expect(loader).not.toContain('chrome.runtime.sendMessage');
        expect(loader).not.toContain('chrome.runtime.connect');
        expect(loader).not.toContain('seipro-page-bridge');
        expect(loader).not.toContain('llmProfiles');
        expect(loader).not.toContain('llmAccessAudit');
        expect(loader).not.toContain('seipro-llm');
    });

    it('injects only the CKEditor-facing editor bundle', () => {
        const loader = read('src/bootstrap/editor-loader.js');
        expect(loader).toContain("inject(base + 'js/lib/jmespath.min.js'");
        expect(loader).toContain("inject(base + 'js/sei-pro-editor.js')");
        expect(loader).not.toContain("inject(base + 'js/sei-pro-ai.js')");
    });

    it('leaves process-data loading to the MAIN page runtime', () => {
        const loader = read('src/bootstrap/editor-loader.js');
        expect(loader).toContain('Process data is loaded by the MAIN-world page runtime');
        expect(loader).not.toContain('getDadosIframeProcessoPro(idProcedimento');
    });

    it('loads AI directly as an isolated content script', () => {
        const manifest = JSON.parse(read('manifest.base.json'));
        const editor = manifest.content_scripts.find(({ matches = [], include_globs = [] }) =>
            [...matches, ...include_globs].some((match) => match.includes('acao=editor_montar'))
        );
        expect(editor.js).toContain('js/sei-pro-ai.js');
        expect(editor.js.indexOf('js/sei-pro-ai.js')).toBeGreaterThan(
            editor.js.indexOf('js/editor-loader.js')
        );
        expect(editor.js).toContain('js/lib/purify.min.js');
    });
});
