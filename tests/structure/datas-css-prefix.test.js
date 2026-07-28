import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: datas CSS audit', () => {
  it('mantém a prévia de prazo como componente compartilhado, sem CSS próprio de datas', () => {
    const sharedCss = read('src/shared/ui/prazo-preview.css');
    const legacy = read('src/features/sei-functions/body.js');

    expect(sharedCss).toContain('.dateboxDisplay');
    expect(sharedCss).toContain('.dateBoxIcon');
    expect(sharedCss).toContain('.urgenteBoxDisplay');
    expect(sharedCss).toContain('#frmArvore .dateboxDisplay');

    expect(legacy).toContain('class="dateboxDisplay tagTableText_date_vencido ');
    expect(legacy).toContain('getDatesPreview({date: subtract.format');
    expect(legacy).toContain("find('.loadRemovePag')");
  });

  it('não inventa stylesheet ou classes próprias para o cluster compartilhado de datas', () => {
    const build = read('scripts/build.mjs');
    const manifest = read('manifest.base.json');
    const sharedUi = read('src/shared/ui/prazo-preview.js');

    expect(build).toContain("'src/shared/ui/prazo-preview.css'");
    expect(build).not.toContain('datas.css');
    expect(manifest).not.toContain('css/datas.css');
    expect(sharedUi).toContain('class="dateboxDisplay');
    expect(sharedUi).not.toContain('class="prazo');
    expect(sharedUi).not.toContain('class="recebimento');
  });
});
