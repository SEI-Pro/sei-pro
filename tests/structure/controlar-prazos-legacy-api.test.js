import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = join(fileURLToPath(new URL('../..', import.meta.url)));
const featureDir = join(rootDir, 'src/features/controlar-prazos');

function source(name) {
  return readFileSync(join(featureDir, name), 'utf8');
}

describe('migration: controlar-prazos legacy surface', () => {
  it('keeps every domain/io/view function behind the compatibility bridge', () => {
    const legacyApi = source('legacy-api.js');
    expect(legacyApi).toMatch(/import \* as domain from ['"]\.\/domain\.js['"]/);
    expect(legacyApi).toMatch(/import \* as io from ['"]\.\/io\.js['"]/);
    expect(legacyApi).toMatch(/import \* as view from ['"]\.\/view\.js['"]/);
    expect(legacyApi).toMatch(/\[domain, io, view\]\.forEach/);
    expect(legacyApi).toMatch(/Object\.keys\(mod\)/);
    expect(legacyApi).toMatch(/typeof mod\[name\] === ['"]function['"]/);
    expect(legacyApi).toMatch(/aliasGlobal\(name, mod\[name\]\)/);
  });

  it('keeps the legacy entry and call-sites on the established global API', () => {
    const entry = source('index.js');
    const lista = readListaProcessosSource();

    expect(entry).toMatch(/import ['"]\.\/legacy-api\.js['"]/);
    expect(lista.match(/\binitControlePrazo\s*\(/g)).toHaveLength(3);
    expect(lista).not.toMatch(/function\s+initControlePrazo\s*\(/);
    expect(lista).not.toMatch(/function\s+(?:addControlePrazo|setControlePrazo|updateTablePrazoProcesso)\s*\(/);
  });

  it('does not redefine the migrated prazo functions in shared legacy code', () => {
    const sharedLegacy = readSeiFunctionsSource();
    const migratedNames = ['initControlePrazo', 'addControlePrazo', 'setControlePrazo', 'updateTablePrazoProcesso'];

    for (const name of migratedNames) {
      expect(sharedLegacy).not.toMatch(new RegExp(`function\\s+${name}\\s*\\(`));
    }
  });
});
