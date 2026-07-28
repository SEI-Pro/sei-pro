import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function readManifest() {
    return JSON.parse(read('manifest.base.json'));
}

describe('migration: datas wire', () => {
    it('instala a view de datas antes da ponte legada no core stack', () => {
        const stack = read('src/content/core-stack.js');
        expect(stack).toContain("import { installDatasView } from '../shared/legacy/datas-view.js';");
        expect(stack).toContain('installCoreStack();\ninstallDatasView();\ninstallDatasLegacyApi();');
        expect(read('src/shared/legacy/datas-legacy-api.js')).toContain(
            "import { recordDataRecebimento } from './datas-view.js';"
        );
        expect(read('src/shared/legacy/datas-view.js')).toContain('seiPro.shared.datasView');
    });

    it('mantém core stack antes do legado de datas em todos os contextos compartilhados', () => {
        const contexts = readManifest().content_scripts.filter(({ js = [] }) =>
            js.includes('js/core-stack.bundle.js') && js.includes('js/sei-functions-pro.js')
        );
        expect(contexts.length).toBeGreaterThan(0);
        for (const [index, context] of contexts.entries()) {
            const core = context.js.indexOf('js/core-stack.bundle.js');
            const legacy = context.js.indexOf('js/sei-functions-pro.js');
            expect(core, `context ${index}: core stack`).toBeLessThan(legacy);
        }
    });

    it('mantém entry e cópia legada registrados no build e os call-sites globais', () => {
        const build = read('scripts/build.mjs');
        const legacy = read('src/features/sei-functions/body.js');
        expect(build).toContain("{ entry: 'src/content/core-stack.js', out: 'dist/js/core-stack.bundle.js' }");
        expect(build).toContain("{ entry: 'src/features/sei-functions/index.js', out: 'dist/js/sei-functions-pro.js' }");
        expect(build).not.toContain("'src/shared/legacy/sei-functions-pro.js'");
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento, listProc, acompanhamentoEsp);');
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento, false, acompanhamentoEsp);');
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento);');
    });
});
