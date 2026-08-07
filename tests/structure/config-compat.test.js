import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(rel) {
    return readFileSync(join(rootDir, rel), 'utf8');
}

// Compatibility contract (migration Phase 6 — checkConfigValue ported to core):
//
// checkConfigValue has distinct "default-enabled" semantics (returns true for
// absent config via isDefaultEnabledConfigValue). It was previously left in the
// legacy module; in Phase 6 it was ported VERBATIM to src/core/config.ts and the
// legacy definition removed. The legacy global is preserved via aliasGlobal so
// the existing call sites keep working.
//
// This test locks the new contract: checkConfigValue (and its default-enabled
// dependency) must be provided by the core config layer and aliased globally,
// and must NOT be redefined in the legacy module (which would duplicate/shadow).
describe('config compatibility contract: checkConfigValue', () => {
    it('is provided by the core config layer (src/core/config.ts)', () => {
        const core = read('src/core/config.ts');
        expect(core).toMatch(/function checkConfigValue\s*\(/);
        // its default-enabled dependency must live alongside it
        expect(core).toMatch(/function isDefaultEnabledConfigValue\s*\(/);
        // and both must be exposed as legacy globals for back-compat
        expect(core).toMatch(/aliasGlobal\(\s*['"]checkConfigValue['"]/);
        expect(core).toMatch(/aliasGlobal\(\s*['"]isDefaultEnabledConfigValue['"]/);
    });

    it('is NOT redefined in the legacy module (sei-functions-pro.js)', () => {
        const legacy = read('dist/js/sei-functions-pro.js');
        expect(legacy).not.toMatch(/function checkConfigValue\s*\(/);
        expect(legacy).not.toMatch(/function isDefaultEnabledConfigValue\s*\(/);
    });
});
