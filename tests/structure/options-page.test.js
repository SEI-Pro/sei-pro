import { describe, expect, it } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = (rel) => readFileSync(join(root, rel), 'utf8');

describe('options page migration wiring', () => {
    it('bundles options from the explicit context entry and drops legacy options.js copy', () => {
        const build = read('scripts/build.mjs');
        const entry = read('src/entries/options.ts');
        expect(build).not.toContain("entry: 'src/options/index.ts'");
        expect(build).toContain("f.endsWith('.ts')");
        expect(build).toContain("f.replace(/\\.(js|ts)$/, '.bundle.js')");
        expect(entry).toContain('bootOptionsContext');
        expect(entry).toContain('startOptionsContext');
        expect(build).not.toContain("src/options/options.js', out: 'dist/html/options.js'");
        expect(existsSync(join(root, 'src/options/options.js'))).toBe(false);
        expect(existsSync(join(root, 'src/options/domain.ts'))).toBe(true);
        expect(existsSync(join(root, 'src/options/io.ts'))).toBe(true);
        expect(existsSync(join(root, 'src/options/view.ts'))).toBe(true);
        expect(existsSync(join(root, 'src/options/index.ts'))).toBe(true);
        expect(existsSync(join(root, 'src/entries/options.ts'))).toBe(true);
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

    it('shares default-enabled config keys via schema (ADR-0009)', () => {
        const defaults = read('src/shared/config-defaults.ts');
        const schema = read('src/config/schema.ts');
        const core = read('src/core/config.ts');
        const domain = read('src/options/domain.ts');
        expect(defaults).toContain("from '../config/schema.js'");
        expect(defaults).toContain('getDefaultEnabledConfigKeys');
        expect(schema).toContain('gerenciarmonitorados');
        expect(schema).toContain('autopreenchersenha');
        expect(core).toContain("from '../shared/config-defaults.js'");
        expect(domain).toContain("from '../shared/config-defaults.js'");
    });

    it('renders at least one options section from the config schema', () => {
        const html = read('src/options/options.html');
        const view = read('src/options/view.ts');
        expect(html).toContain('id="options-schema-privacy"');
        expect(view).toContain('renderSchemaOptionsSection');
        expect(view).toContain("listSchemaEntriesForOptionsSection");
        expect(view).toContain('loadBugReportOptIn');
        expect(view).toContain('saveBugReportOptIn');
    });

    it('wires AI provider profiles to local background storage actions', () => {
        const html = read('src/options/options.html');
        const io = read('src/options/io.ts');
        const manifest = JSON.parse(read('manifest.base.json'));
        expect(html).toContain('id="options-ai-providers"');
        expect(html).toContain('id="seipro-options-ai-add"');
        expect(io).toContain("action: 'llmProfilesList'");
        expect(io).toContain("action: 'llmSaveProfile'");
        expect(io).toContain("action: 'llmDeleteProfile'");
        expect(io).toContain('permissions.request({ origins }');
        expect(manifest.optional_host_permissions).not.toContain('https://*/*');
        expect(manifest.optional_host_permissions).toContain('https://api.openai.com/*');
    });
});
