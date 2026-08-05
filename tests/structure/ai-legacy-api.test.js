import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => readFileSync(path.join(root, file), 'utf8');

describe('AI isolated entry', () => {
    it('uses the typed editor bridge without installing page globals', () => {
        const index = read('src/features/ai/index.js');
        const build = read('scripts/build.mjs');

        expect(index).toContain('installIsolatedEditorAiBridge,');
        expect(index).toContain("} from './io/editor-bridge.js'");
        expect(index).toContain('installIsolatedEditorAiBridge({');
        expect(existsSync(path.join(root, 'src/features/ai/legacy-api.js'))).toBe(false);
        expect(build).toContain(
            "{ entry: 'src/features/ai/index.js', out: 'dist/js/sei-pro-ai.js' }"
        );
        expect(build).not.toContain("'src/features/ai/sei-pro-ai.js'");
    });

    it('routes editor AI hooks through the minimal event bridge', () => {
        expect(existsSync(path.join(root, 'src/features/editor/body.js'))).toBe(false);
        const loadAi = read('src/features/editor/io/load-ai.js');
        const bridge = read('src/features/editor/ai-bridge.js');
        expect(loadAi).toContain('requestAiOpen');
        expect(loadAi).toContain('export function loadPlataformAI');
        expect(bridge).toContain("if (operation === 'snapshot')");
        expect(bridge).toContain("if (operation === 'insertHtml')");
        expect(bridge).not.toContain('chrome.runtime');
        expect(loadAi).not.toContain('XMLHttpRequest');
        expect(loadAi).not.toContain('api.openai.com');
    });
});
