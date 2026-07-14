import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const source = (file) => readFileSync(join(rootDir, 'src/core', file), 'utf8');

describe('migration: docs-lote legacy map bridge', () => {
  it('keeps core implementation free of direct global aliases', () => {
    expect(source('docslote.js')).not.toMatch(/\baliasGlobal\s*\(/);
  });

  it('installs all legacy map aliases from the dedicated bridge', () => {
    const bridge = source('docslote-legacy-api.js');
    const stack = source('stack.js');

    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\/global\.js['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_specialChars['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_normalChars_utf8['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_normalChars_iso['"]/);
    expect(stack).toMatch(/installDocsLoteLegacyApi\s*\(/);
  });
});