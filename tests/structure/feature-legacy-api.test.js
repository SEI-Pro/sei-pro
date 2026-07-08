import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const featuresDir = join(rootDir, 'src/features');

function featureIndexFiles() {
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(featuresDir, entry.name, 'index.js'))
    .filter((file) => {
      try {
        readFileSync(file, 'utf8');
        return true;
      } catch {
        return false;
      }
    });
}

describe('migration: feature legacy aliases stay isolated', () => {
  it('feature index.js files do not import aliasGlobal directly', () => {
    const offenders = featureIndexFiles()
      .filter((file) => /import\s+\{[^}]*\baliasGlobal\b[^}]*\}\s+from\s+['"]\.\.\/\.\.\/core\/global\.js['"]/.test(readFileSync(file, 'utf8')))
      .map((file) => file.replace(rootDir + '/', ''));

    expect(offenders).toEqual([]);
  });

  it('controlar-prazos exposes legacy globals only through legacy-api.js', () => {
    const entry = readFileSync(join(featuresDir, 'controlar-prazos/index.js'), 'utf8');
    const legacyApi = readFileSync(join(featuresDir, 'controlar-prazos/legacy-api.js'), 'utf8');

    expect(entry).toMatch(/import\s+['"]\.\/legacy-api\.js['"]/);
    expect(entry).not.toMatch(/\baliasGlobal\s*\(/);
    expect(legacyApi).toMatch(/import\s+\{\s*aliasGlobal\s*\}/);
    expect(legacyApi).toMatch(/\baliasGlobal\s*\(/);
  });
});
