import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');

function read(relPath) {
  return readFileSync(join(rootDir, relPath), 'utf8');
}

describe('migration: docs-lote CSS classes stay prefixed', () => {
  it('uses a seipro-prefixed class for the new-process type rows', () => {
    const templates = read('src/features/docs-lote/templates.js');
    const view = read('src/features/docs-lote/view.js');

    expect(templates).toContain('seipro-doclote-process-type-fields');
    expect(view).toContain('.seipro-doclote-process-type-fields');
    expect(templates).toContain('id="newProcs"');
    expect(templates).toContain('id="tipoProcessoSelect"');
    expect(templates).toContain('id="txtEspecificacaoProcesso"');

    expect(templates).not.toMatch(/containerTipoProcessoSelect/);
    expect(view).not.toMatch(/containerTipoProcessoSelect/);
  });
});
