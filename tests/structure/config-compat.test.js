import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(rel) {
    return readFileSync(join(rootDir, rel), 'utf8');
}

// Compatibility contract (migration Phases 1–5):
//
// The core config layer (src/core/config.js) exposes verifyConfigValue and
// getConfigValue, but NOT checkConfigValue. checkConfigValue has distinct
// "default-enabled" semantics (it returns true for absent config via
// isDefaultEnabledConfigValue), so it was intentionally left in the legacy
// module rather than ported. Many call sites still use it, so the extension
// depends on sei-functions-pro.js remaining loaded to provide it.
//
// This test locks that contract: if checkConfigValue is removed from the legacy
// module without being ported to core, this fails — surfacing the break instead
// of letting it ship silently.
describe('config compatibility contract: checkConfigValue', () => {
    it('is provided by the legacy module (sei-functions-pro.js)', () => {
        const legacy = read('dist/js/sei-functions-pro.js');
        expect(legacy).toMatch(/function checkConfigValue\s*\(/);
        // its default-enabled dependency must live alongside it
        expect(legacy).toMatch(/function isDefaultEnabledConfigValue\s*\(/);
    });

    it('is NOT yet provided by the core config layer (still a legacy dependency)', () => {
        const core = read('src/core/config.js');
        expect(core).not.toMatch(/function checkConfigValue\b/);
        expect(core).not.toMatch(/aliasGlobal\(\s*['"]checkConfigValue['"]/);
    });
});
