import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.cwd());
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

describe('legis legacy API bridge', () => {
    it('installs module exports for the editor toolbar', () => {
        const index = read('src/features/legis/index.js');
        const bridge = read('src/features/legis/legacy-api.js');
        const view = read('src/features/legis/view.js');

        expect(index).toContain("import { installLegisLegacyApi } from './legacy-api.js'");
        expect(index).toContain('installLegisLegacyApi();');
        expect(bridge).toContain("import { aliasGlobal } from '../../core/global.js';");
        expect(bridge).toContain('[domain, io, view].forEach');
        expect(bridge).toContain('aliasGlobal(name, mod[name])');
        expect(view).toContain('export function initLegis(button)');
        expect(view).toContain('export function getLegis(');
        expect(view).toContain('export function iframeLegis(button)');
        expect(fs.existsSync(path.join(root, 'src/features/legis/body.js'))).toBe(false);
    });

    it('builds the ESM entry under the legacy filename and ships with the editor entry', () => {
        const build = read('scripts/build.mjs');
        const bootstrap = read('src/bootstrap/init.js');
        const editorEntry = read('src/entries/editor.js');

        expect(build).toContain(
            "{ entry: 'src/features/legis/index.js', out: 'dist/js/sei-legis.js' }"
        );
        expect(build).not.toContain("'src/features/legis/sei-legis.js'");
        expect(editorEntry).toContain("import '../features/legis/index.js'");
        expect(bootstrap).not.toContain('$.getScript(getUrlExtension("js/sei-legis.js"))');
        expect(fs.existsSync(path.join(root, 'src/features/legis/sei-legis.js'))).toBe(false);
    });

    it('keeps remote access behind the timeout-aware IO boundary', () => {
        const io = read('src/features/legis/io.js');
        const view = read('src/features/legis/view.js');

        const sharedSearch = read('src/shared/legislation-search.js');
        expect(io).toContain("from '../../shared/legislation-search.js'");
        expect(sharedSearch).toContain("https://seipro.app/legis/search.php");
        expect(sharedSearch).toContain('controller.abort()');
        expect(sharedSearch).toContain("ioError('offline'");
        expect(view).toContain('await searchLegislation(arrayLegis)');
        expect(view).not.toContain('$.ajax(');
    });
});
