import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function readManifest() {
    return JSON.parse(read('manifest.base.json'));
}

describe('migration: datas wire', () => {
    it('instala a view de datas antes da ponte legada no core stack', () => {
        const stack = read('src/content/core-stack.ts');
        expect(stack).toContain("import { installDatasView } from '../shared/legacy/datas-view.js';");
        expect(stack).toContain('installCoreStack();\ninstallSharedLegacyHelpers();\ninstallDatasView();\ninstallDatasLegacyApi();');
        expect(read('src/shared/legacy/datas-legacy-api.ts')).toContain(
            "import { recordDataRecebimento } from './datas-view.js';"
        );
        expect(read('src/shared/legacy/datas-view.ts')).toContain('seiPro.shared.datasView');
    });

    it('mantém core stack antes do legado de datas em todos os contextos compartilhados', () => {
        const contexts = readManifest().content_scripts.filter(({ js = [] }) =>
            js.includes('js/core-stack.bundle.js') && js.includes('js/legacy-context.bundle.js')
        );
        expect(contexts.length).toBeGreaterThan(0);
        for (const [index, context] of contexts.entries()) {
            const core = context.js.indexOf('js/core-stack.bundle.js');
            const legacy = context.js.indexOf('js/legacy-context.bundle.js');
            expect(core, `context ${index}: core stack`).toBeLessThan(legacy);
        }
    });

    it('mantém entry e cópia legada registrados no build e os call-sites globais', () => {
        const build = read('scripts/build.mjs');
        const legacy = readSeiFunctionsSource();
        expect(build).toContain("{ entry: 'src/content/core-stack.ts', out: 'dist/js/core-stack.bundle.js' }");
        expect(build).toContain('const entryBundles = readdirSync(entriesDir)');
        expect(build).toContain('...entryBundles');
        expect(build).not.toContain("'src/shared/legacy/sei-functions-pro.js'");
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento, listProc, acompanhamentoEsp);');
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento, false, acompanhamentoEsp);');
        expect(legacy).toContain('getDataRecebimentoPro(listAndamento);');
    });
});
