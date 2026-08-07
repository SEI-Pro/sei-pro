import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('migration: shared UI legacy aliases stay isolated', () => {
  it('prazo-preview aliases are exposed only through the legacy bridge', () => {
    const stack = readFileSync(join(rootDir, 'src/core/stack.ts'), 'utf8');
    const prazoPreview = readFileSync(join(rootDir, 'src/shared/ui/prazo-preview.ts'), 'utf8');
    const legacyApi = readFileSync(join(rootDir, 'src/shared/ui/prazo-preview-legacy-api.ts'), 'utf8');

    expect(stack).toMatch(/import\s+\{\s*installPrazoPreviewLegacyApi\s*\}/);
    expect(stack).toMatch(/installPrazoPreview\s*\(\)/);
    expect(stack).toMatch(/installPrazoPreviewLegacyApi\s*\(\)/);
    expect(prazoPreview).not.toMatch(/\baliasGlobal\s*\(/);
    expect(legacyApi).toMatch(/aliasGlobal\(\s*['"]getDatesPreview['"]/);
    expect(legacyApi).toMatch(/aliasGlobal\(\s*['"]getProgressPreview['"]/);
    expect(legacyApi).toMatch(/aliasGlobal\(\s*['"]configDatesPreview['"]/);
  });
});
