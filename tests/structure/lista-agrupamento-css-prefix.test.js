import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(fileURLToPath(new URL('../..', import.meta.url)));
const source = (file) => readFileSync(join(rootDir, file), 'utf8');

describe('migration: lista-agrupamento CSS audit', () => {
  it('confirma que o agrupamento não introduz stylesheet ou classes próprias não prefixadas', () => {
    const featureDir = join(rootDir, 'src/features/lista-agrupamento');
    const legacy = source('src/features/lista-processos/body.js');

    expect(existsSync(join(featureDir, 'style.css'))).toBe(false);
    expect(existsSync(join(featureDir, 'lista-agrupamento.css'))).toBe(false);
    expect(legacy).not.toMatch(/class=["'][^"']*(?:groupTable|controleTableTag|kanban-content|kanban-title-card|kanban-description|kanban-pinboard)[^"']*seipro-(?![^"']*legacy)/);
  });

  it('preserva os hooks compartilhados e os contratos funcionais do agrupamento', () => {
    const legacy = source('src/features/lista-processos/body.js');
    const shared = source('src/features/sei-functions/body.js');

    expect(legacy).toMatch(/id=\\?"selectGroupTablePro\\?"[^>]*class=\\?"groupTable selectPro\\?"/);
    expect(legacy).toMatch(/class=\\?"controleTableTag newLink\\?"[^>]*data-htagname/);
    expect(legacy).toMatch(/class=\\?"kanban-content\\?"/);
    expect(legacy).toMatch(/class=\\?"kanban-title-card content_edit\\?"/);
    expect(shared).toMatch(/closest\(['"]\.kanban-content['"]\)/);
    expect(shared).toMatch(/closest\(['"]\.tagintable['"]\)/);
  });
});
