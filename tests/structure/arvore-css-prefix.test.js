import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

describe('migration: arvore P6 CSS em lote', () => {
  it('confirma que a árvore não introduz stylesheet próprio não prefixado', () => {
    const featureDir = join(rootDir, 'src/features/arvore');
    expect(existsSync(join(featureDir, 'style.css'))).toBe(false);
    expect(existsSync(join(featureDir, 'arvore.css'))).toBe(false);
  });

  it('preserva os hooks externos e compartilhados necessários ao upload e à árvore', () => {
    const legacy = read('src/features/arvore/sei-pro-arvore.js');
    const sharedLegacy = read('src/shared/legacy/sei-functions-pro.js');
    const arvoreInfo = read('src/features/arvore-info/index.js');

    // Dropzone owns dz-* hooks; panel/notes/tree hooks are shared with SEI,
    // arvore-info, lista-processos, or shared legacy behavior.
    expect(legacy).toContain("previewsContainer: '#divArvore'");
    expect(legacy).toContain("items: '.dz-file-preview'");
    expect(legacy).toContain("handle: '.dz-filename'");
    expect(legacy).toContain('class="action-doc action-');
    expect(legacy).toContain('class="loading-action-doc"');
    expect(legacy).toContain('class="panelDadosArvore');
    expect(legacy).toContain('class="stickDadosArvore');
    expect(legacy).toContain('class="anchorJoinPro"');
    expect(sharedLegacy).toContain('.action-doc[data-id=');
    expect(sharedLegacy).toContain("closest('.no_notifyPro')");
    expect(arvoreInfo).toContain("querySelector('.panelDadosArvore')");

    // No unreviewed feature-owned class is introduced by the P6 audit.
    expect(legacy).not.toMatch(/class="(?:arvore|dropzone|upload)[A-Za-z0-9_-]*"/);
  });

  it('mantém Dropzone, bundle legado e CSS externo carregados no contexto da árvore', () => {
    const manifest = JSON.parse(read('manifest.base.json'));
    const entries = manifest.content_scripts.filter(({ js = [] }) =>
      js.includes('js/sei-pro-arvore.js')
    );

    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.js).toContain('js/sei-pro-arvore.js');
      expect(entry.js).toContain('js/lib/dropzone.min.js');
      expect(entry.css).toContain('css/dropzone.min.css');
    }
  });
});
