import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';

const rootDir = process.cwd();
const source = (file) => readFileSync(join(rootDir, 'src/shared', file), 'utf8');
const read = (relPath) => readFileSync(join(rootDir, relPath), 'utf8');

function manifestWithDocsLote() {
  return JSON.parse(read('manifest.base.json')).content_scripts.filter((entry) =>
    entry.js.includes('js/docs-lote.bundle.js')
  );
}

describe('migration: docs-lote legacy map bridge', () => {
  it('keeps core implementation free of direct global aliases', () => {
    expect(source('docslote.ts')).not.toMatch(/\baliasGlobal\s*\(/);
  });

  it('installs all legacy map aliases from the dedicated bridge outside core/stack', () => {
    const bridge = source('docslote-legacy-api.ts');
    const helpers = source('install-legacy-helpers.ts');
    const coreStack = read('src/content/core-stack.ts');
    const stack = read('src/core/stack.ts');

    expect(bridge).toMatch(/import \{ aliasGlobal \} from ['"]\.\.\/core\/global\.js['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_specialChars['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_normalChars_utf8['"]/);
    expect(bridge).toMatch(/aliasGlobal\(\s*['"]docsLote_normalChars_iso['"]/);
    expect(helpers).toMatch(/installDocsLoteLegacyApi\s*\(/);
    expect(coreStack).toMatch(/installSharedLegacyHelpers\s*\(/);
    expect(stack).not.toMatch(/installDocsLote|installQuickFilter|installSticknote/);
  });

  it('wires the two legacy entry points through the feature bridge', () => {
    const index = read('src/features/docs-lote/index.ts');
    const bridge = read('src/features/docs-lote/legacy-api.ts');
    const view = read('src/features/docs-lote/view.ts');
    const legacy = readSeiFunctionsSource();

    expect(index).toContain('installDocsLoteLegacyApi');
    expect(index).toContain('publishFeature({');
    expect(index).toContain("nsKey: 'docsLote'");
    expect(index).toContain('openWizard: docLoteModalSelecaoDoc');
    expect(index).toContain('getDocsArvore: docsLote_getDocsArvore');
    expect(bridge).toContain("aliasGlobal('docLoteModalSelecaoDoc', docLoteModalSelecaoDoc)");
    expect(bridge).toContain("aliasGlobal('docsLote_getDocsArvore', docsLote_getDocsArvore)");
    expect(view).toMatch(/export function docLoteModalSelecaoDoc\s*\(/);
    expect(view).toMatch(/export function docsLote_getDocsArvore\s*\(/);
    expect(legacy).toContain('docsLote_getDocsArvore(true, idRef)');
    expect(legacy).toContain('docLoteModalSelecaoDoc();');
    expect(legacy).not.toMatch(/function\s+(?:docLoteModalSelecaoDoc|docsLote_getDocsArvore)\s*\(/);
  });

  it('loads the lista composition root after its legacy dependency', () => {
    const entries = JSON.parse(read('manifest.base.json')).content_scripts.filter((entry) =>
      entry.js.includes('js/lista-context.bundle.js')
    );

    expect(entries.length).toBe(2);
    for (const entry of entries) {
      const functionsIndex = entry.js.indexOf('js/sei-functions-pro.js');
      const bundleIndex = entry.js.indexOf('js/lista-context.bundle.js');
      expect(functionsIndex).toBeGreaterThanOrEqual(0);
      expect(bundleIndex).toBeGreaterThan(functionsIndex);
      expect(entry.js).not.toContain('js/docs-lote.bundle.js');
    }
  });

  it('builds the ESM feature bundle without copying the removed legacy script', () => {
    const build = read('scripts/build.mjs');

    expect(build).toContain("{ entry: 'src/features/docs-lote/index.ts', out: 'dist/js/docs-lote.bundle.js' }");
    expect(build).toContain("{ entry: 'src/entries/sei-functions.ts', out: 'dist/js/sei-functions-pro.js' }");
    expect(build).not.toContain("'src/shared/legacy/sei-functions-pro.js'");
    expect(build).not.toContain("'src/features/docs-lote/sei-pro-docs-lote.js'");
  });
});
