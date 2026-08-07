import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = join(fileURLToPath(new URL('../..', import.meta.url)));
const source = (file) => readFileSync(join(rootDir, file), 'utf8');

describe('migration: lista-agrupamento CSS audit', () => {
  it('confirma que o agrupamento não introduz stylesheet ou classes próprias não prefixadas', () => {
    const featureDir = join(rootDir, 'src/features/lista-agrupamento');
    const legacy = readListaProcessosSource();

    expect(existsSync(join(featureDir, 'style.css'))).toBe(false);
    expect(existsSync(join(featureDir, 'lista-agrupamento.css'))).toBe(false);
    expect(legacy).not.toMatch(/class=["'][^"']*(?:groupTable|controleTableTag|kanban-content|kanban-title-card|kanban-description|kanban-pinboard)[^"']*seipro-(?![^"']*legacy)/);
  });

  it('preserva os hooks compartilhados e os contratos funcionais do agrupamento', () => {
    const lista = readListaProcessosSource();
    const kanban = source('src/features/lista-processos/kanban-home.js');
    const shared = readSeiFunctionsSource();

    expect(lista).toMatch(/id=\\?"selectGroupTablePro\\?"[^>]*class=\\?"groupTable selectPro\\?"/);
    expect(lista).toMatch(/class=\\?"controleTableTag newLink\\?"[^>]*data-htagname/);
    expect(kanban).toMatch(/class=\\?"kanban-content\\?"/);
    expect(kanban).toMatch(/class=\\?"kanban-title-card content_edit\\?"/);
    expect(shared).toMatch(/closest\(['"]\.kanban-content['"]\)/);
    expect(shared).toMatch(/closest\(['"]\.tagintable['"]\)/);
  });
});
