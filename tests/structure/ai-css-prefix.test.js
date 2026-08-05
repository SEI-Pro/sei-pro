import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), 'utf8');

describe('AI feature CSS ownership', () => {
    it('uses feature-prefixed CSS hooks and ships CSS with the editor context', () => {
        const css = read('src/features/ai/style.css');
        const view = read('src/features/ai/view/dialogs.js');
        const manifest = JSON.parse(read('manifest.base.json'));
        const editorBlock = manifest.content_scripts.find(({ matches = [] }) =>
            matches.some((match) => match.includes('acao=editor_montar'))
        );

        const selectors = [...css.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((match) => match[1]);
        expect(selectors.filter((name) => !name.startsWith('seipro-'))).toEqual([]);
        expect(view).toContain('seipro-ai-form');
        expect(editorBlock.css).toContain('css/stream-panel.css');
        expect(editorBlock.css).toContain('css/ai.css');
        expect(read('scripts/build.mjs')).toContain(
            "{ src: 'src/features/ai/style.css', out: 'dist/css/ai.css' }"
        );
    });
});
