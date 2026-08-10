import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('editor legacy API bridge', () => {
    it('installs extracted modules and boots from adapter', () => {
        const index = read('src/features/editor/index.ts');
        const bridge = read('src/features/editor/legacy-api.ts');
        const adapter = read('src/features/editor/adapter.ts');

        expect(index).toContain("import { installEditorLegacyApi } from './legacy-api.js'");
        expect(index).toContain("import { bootEditor } from './adapter.js'");
        expect(index).toContain('installEditorLegacyApi();');
        expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
        expect(bridge).toContain("import { installEditorStateBridge, setParamEditor, bootEditor } from './adapter.js'");
        expect(bridge).toContain('installEditorStateBridge();');
        expect(fs.existsSync(path.join(root, 'src/features/editor/body.js'))).toBe(false);
        expect(adapter).toContain('export function bootEditor()');
        expect(fs.existsSync(path.join(root, 'src/features/editor/view/toolbar.ts'))).toBe(true);
        expect(fs.existsSync(path.join(root, 'src/features/editor/templates/toolbar.ts'))).toBe(true);
        expect(fs.existsSync(path.join(root, 'src/features/editor/lib/domq.ts'))).toBe(true);
    });

    it('delegates editor text flows to extracted modules', () => {
        const editorText = read('src/features/editor/view/editor-text.ts');

        expect(editorText).toContain('extractTextFromHtml');
        expect(editorText).toContain('collectEditorText');
        expect(editorText).toContain('bindEditorFocus');
        expect(editorText).toContain('export function getAllTextEditor');
        expect(editorText).toContain('export function setCKEDITOR_instances');
    });

    it('contains only the SEI 4.1 toolbar and no retired remote features', () => {
        const toolbar = read('src/features/editor/templates/toolbar.ts');
        const allEditor = [
            toolbar,
            read('src/features/editor/view/toolbar.ts'),
            read('src/features/editor/commands/formatting.ts')
        ].join('\n');

        for (const retired of [
            'isSEI5()',
            'tinyurl.com',
            'getTinyUrl',
            'latex.codecogs.com',
            'getLatexButtom',
            'getAutoSaveButtom',
            'helpLegisButtom'
        ]) {
            expect(allEditor).not.toContain(retired);
        }
        expect(toolbar).toContain('<a class="${classClick} cke_iconPro cke_button');
        expect(toolbar).not.toContain('<button class="ck ck-button');
    });

    it('injects the editor bundle into MAIN via isolated editor-loader', () => {
        const manifest = JSON.parse(read('manifest.base.json'));
        const editorContexts = manifest.content_scripts.filter(({ matches = [], include_globs = [] }) =>
            [...matches, ...include_globs].some((match) => match.includes('acao=editor_montar'))
        );
        const scripts = editorContexts[0]?.js || [];
        const functionsIndex = scripts.indexOf('js/legacy-context.bundle.js');
        const loaderIndex = scripts.indexOf('js/editor-loader.js');
        const initIndex = scripts.indexOf('js/init.js');
        const war = manifest.web_accessible_resources?.[0]?.resources || [];

        expect(editorContexts).toHaveLength(1);
        expect(loaderIndex).toBeGreaterThan(functionsIndex);
        expect(initIndex).toBeGreaterThan(loaderIndex);
        expect(scripts).not.toContain('js/sei-pro-editor.js');
        expect(war).toContain('js/sei-pro-editor.js');
        expect(scripts).toContain('js/lib/jmespath.min.js');
        expect(scripts.indexOf('js/lib/jmespath.min.js')).toBeLessThan(functionsIndex);
        expect(read('src/bootstrap/editor-loader.js')).toContain('not injecting into SEI error page');
        expect(read('src/bootstrap/editor-loader.js')).toContain('empty id_documento');
        expect(read('src/bootstrap/editor-loader.js')).toContain('redirecting to opener');
        expect(read('src/bootstrap/editor-loader.js')).not.toMatch(/getDadosIframeProcessoPro\s*\(/);
        expect(read('scripts/build.mjs') + '\n' + read('scripts/dist-pipeline.mjs')).toContain("'src/bootstrap/editor-loader.js'");
        expect(read('src/bootstrap/editor-loader.js')).toContain('js/sei-pro-editor.js');
        expect(read('src/bootstrap/init.js')).not.toContain('js/sei-pro-editor.js');
        expect(read('src/bootstrap/init.js')).not.toContain('js/sei-legis.js');
        expect(read('src/bootstrap/init.js')).not.toContain('jquery-qrcode');
        expect(scripts).not.toContain('js/editor-domain.bundle.js');
        expect(read('src/entries/editor.ts')).toContain('installEditorPageRuntime');
        expect(read('src/entries/editor.ts')).toContain('registerEditorExclusiveFeatures');
        expect(read('src/features/editor/page-runtime.ts')).toContain('installEditorPageRuntime');
        expect(read('src/features/editor/page-runtime.ts')).toContain("ensureGlobal('delayCrash'");
        expect(read('src/features/editor/page-runtime.ts')).toContain('iconSeiPro');
    });
});
