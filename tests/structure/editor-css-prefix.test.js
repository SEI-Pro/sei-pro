import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('editor CSS prefix audit', () => {
    const source = [
        read('src/features/editor/templates/toolbar.ts'),
        read('src/features/editor/view/toolbar.ts'),
        read('src/features/editor/view/styles.ts'),
        read('src/features/editor/view/dialogs/table.ts'),
        read('src/features/editor/commands/formatting.ts')
    ].join('\n');
    const delegatedActions = read('src/features/editor/view/delegated-actions.ts');

    it('prefixa em lote os hooks CSS próprios do menu de alinhamento e da tabela rápida', () => {
        for (const hook of [
            'seipro-editor-align-menu',
            'seipro-editor-quick-table',
            'seipro-editor-quick-table-info',
            'seipro-editor-quick-table-hover'
        ]) {
            expect(source).toContain(hook);
        }

        for (const legacyHook of ['divAlignText', 'divQuickTable', 'quickTableInfo', 'td_hover']) {
            expect(source).not.toContain(legacyHook);
        }
    });

    it('mantém produtores, seletores de interação e CSS inline sincronizados', () => {
        expect(source).toContain('class="seipro-editor-align-menu"');
        expect(source).toContain('class="seipro-editor-quick-table-info"');
        expect(source).toContain(".closest('.seipro-editor-quick-table')");
        expect(source).toContain(".find('.seipro-editor-quick-table-info')");
        expect(source).toContain("addClass('seipro-editor-quick-table-hover')");
        expect(source).toContain("removeClass('seipro-editor-quick-table-hover')");
        expect(source).toContain('.seipro-editor-quick-table .seipro-editor-quick-table-hover');
        expect(source).toContain(".closest('.cke_top').find('.seipro-editor-align-menu')");
    });

    it('preserva os hooks compartilhados do CKEditor e delega os botões da toolbar', () => {
        for (const sharedHook of ['cke_iconPro', 'cke_buttonPro', 'cke_toolgroup', 'cke_button_disabled']) {
            expect(source).toContain(sharedHook);
        }
        for (const listener of ['.getQuickTableButtom', '.getTablestylesButtom', '.getAlignButtom']) {
            expect(delegatedActions).toContain(`['${listener}'`);
        }
        expect(source).not.toContain(".getQuickTableButtom').on('click'");
    });

    it('builds and loads the editor-owned stylesheet', () => {
        const style = read('src/features/editor/style.css');
        const build = read('scripts/build.mjs');
        const manifest = JSON.parse(read('manifest.base.json'));
        const editorContext = manifest.content_scripts.find(({ matches = [], include_globs = [] }) =>
            [...matches, ...include_globs].some((match) => match.includes('acao=editor_montar'))
        );

        expect(style).toContain('.seipro-editor-modal');
        expect(style).toContain('.seipro-draft-panel');
        expect(style).toContain('.seipro-checklist');
        expect(style).toContain('.seipro-palette-overlay');
        expect(build).toContain(
            "{ src: 'src/features/editor/style.css', out: 'dist/css/editor.css' }"
        );
        expect(editorContext.css).toContain('css/editor.css');
    });
});
