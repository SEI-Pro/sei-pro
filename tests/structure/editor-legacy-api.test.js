import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('editor legacy API bridge', () => {
    it('instala os exports extraídos pela ponte e a compõe no entry', () => {
        const index = read('src/features/editor/index.js');
        const bridge = read('src/features/editor/legacy-api.js');
        const legacy = read('src/features/editor/sei-pro-editor.js');

        expect(index).toContain("import { installEditorLegacyApi } from './legacy-api.js'");
        expect(index).toContain('installEditorLegacyApi();');
        expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
        expect(bridge).toContain("[domain, io, view].forEach");
        for (const name of ['extractTextWithNumbering', 'extractTextFromHtml', 'bindEditorFocus', 'collectEditorText']) {
            expect(bridge).toContain(`aliasGlobal(name, mod[name])`);
            expect(legacy).not.toMatch(new RegExp(`function\\s+${name}\\s*\\(`));
        }
    });

    it('mantém a fachada legada delegando a namespace moderno para os fluxos editoriais', () => {
        const legacy = read('src/features/editor/sei-pro-editor.js');

        expect(legacy).toContain('SeiPro.features && SeiPro.features.editor');
        expect(legacy).toContain('editorFeature.collectEditorText');
        expect(legacy).toContain('editorFeature.extractTextFromHtml');
        expect(legacy).toContain('function getAllTextEditor');
        expect(legacy).toContain('function setCKEDITOR_instances');
    });

    it('liga o bundle do editor antes do loader legado no único contexto de editor', () => {
        const manifest = JSON.parse(read('manifest.base.json'));
        const editorContexts = manifest.content_scripts.filter(({ matches = [] }) =>
            matches.some((match) => match.includes('acao=editor_montar'))
        );
        const scripts = editorContexts[0]?.js || [];
        const editorBundleIndex = scripts.indexOf('js/editor-domain.bundle.js');
        const initIndex = scripts.indexOf('js/init.js');

        expect(editorContexts).toHaveLength(1);
        expect(editorBundleIndex).toBeGreaterThanOrEqual(0);
        expect(initIndex).toBeGreaterThan(editorBundleIndex);
        expect(read('scripts/build.mjs')).toContain(
            "{ entry: 'src/features/editor/index.js', out: 'dist/js/editor-domain.bundle.js' }"
        );
        expect(read('scripts/build.mjs')).toContain("'src/features/editor/sei-pro-editor.js'");
        expect(read('src/bootstrap/init.js')).toContain('js/sei-pro-editor.js');
    });
});
