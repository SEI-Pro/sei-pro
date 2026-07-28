import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');

describe('options page migration wiring', () => {
    it('bundles options from src/options/index.js and drops legacy options.js copy', () => {
        const build = read('scripts/build.mjs');
        expect(build).toContain("entry: 'src/options/index.js'");
        expect(build).toContain("out: 'dist/js/options.bundle.js'");
        expect(build).not.toContain("src/options/options.js', out: 'dist/html/options.js'");
        expect(existsSync(join(root, 'src/options/options.js'))).toBe(false);
        expect(existsSync(join(root, 'src/options/domain.js'))).toBe(true);
        expect(existsSync(join(root, 'src/options/io.js'))).toBe(true);
        expect(existsSync(join(root, 'src/options/view.js'))).toBe(true);
        expect(existsSync(join(root, 'src/options/index.js'))).toBe(true);
    });

    it('loads the vanilla options bundle without jQuery/jmespath on the page', () => {
        const html = read('src/options/options.html');
        expect(html).toContain('../js/options.bundle.js');
        expect(html).toContain('../js/monitorados-options.bundle.js');
        expect(html).not.toContain('jquery-3.7.1.min.js');
        expect(html).not.toContain('jquery-ui.min.js');
        expect(html).not.toContain('jmespath.min.js');
        expect(html).not.toContain('src="options.js"');
    });

    it('shares default-enabled config keys between options and core', () => {
        const defaults = read('src/shared/config-defaults.js');
        const core = read('src/core/config.js');
        const domain = read('src/options/domain.js');
        expect(defaults).toContain('gerenciarmonitorados');
        expect(defaults).toContain('autopreenchersenha');
        expect(core).toContain("from '../shared/config-defaults.js'");
        expect(domain).toContain("from '../shared/config-defaults.js'");
    });
});
