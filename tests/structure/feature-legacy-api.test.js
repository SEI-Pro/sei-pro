import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readSeiFunctionsSource } from '../helpers/read-sei-functions.js';
import { readListaProcessosSource } from '../helpers/read-lista-processos.js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const featuresDir = join(rootDir, 'src/features');

function featureIndexFiles() {
  return readdirSync(featuresDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) => {
      const ts = join(featuresDir, entry.name, 'index.ts');
      const js = join(featuresDir, entry.name, 'index.js');
      try { readFileSync(ts, 'utf8'); return [ts]; } catch { /* continue */ }
      try { readFileSync(js, 'utf8'); return [js]; } catch { return []; }
    });
}

function featureJsFiles(dir = featuresDir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return featureJsFiles(full);
    return entry.isFile() && entry.name.match(/\.(js|ts)$/) ? [full] : [];
  });
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

describe('migration: feature legacy aliases stay isolated', () => {
  it('feature index.js files do not import aliasGlobal directly', () => {
    const offenders = featureIndexFiles()
      .filter((file) => /import\s+\{[^}]*\baliasGlobal\b[^}]*\}\s+from\s+['"]\.\.\/\.\.\/core\/global\.js['"]/.test(readFileSync(file, 'utf8')))
      .map((file) => file.replace(rootDir + '/', ''));

    expect(offenders).toEqual([]);
  });

  it('feature files call aliasGlobal only from legacy-api bridges', () => {
    const offenders = featureJsFiles()
      .filter((file) => /\baliasGlobal\s*\(/.test(stripComments(readFileSync(file, 'utf8'))))
      .map((file) => file.replace(rootDir + '/', ''))
      .filter((rel) => !/(^|\/)legacy-api(?:-[^/]+)?\.(js|ts)$/.test(rel) && !/(^|\/)[^/]*-legacy-api\.(js|ts)$/.test(rel));

    expect(offenders).toEqual([]);
  });

  it('controlar-prazos exposes legacy globals only through legacy-api.js', () => {
    const entry = readFileSync(join(featuresDir, 'controlar-prazos/index.ts'), 'utf8');
    const legacyApi = readFileSync(join(featuresDir, 'controlar-prazos/legacy-api.ts'), 'utf8');

    expect(entry).toMatch(/import\s+(?:\{[^}]+\}\s+from\s+)?['"]\.\/legacy-api\.js['"]/);
    expect(entry).not.toMatch(/\baliasGlobal\s*\(/);
    expect(legacyApi).toMatch(/import\s+\{\s*aliasGlobal\s*\}/);
    expect(legacyApi).toMatch(/\baliasGlobal\s*\(/);
  });

  it('monitorados store aliases are exposed by the early store legacy bridge', () => {
    const coreStack = readFileSync(join(rootDir, 'src/content/core-stack.ts'), 'utf8');
    const store = readFileSync(join(featuresDir, 'monitorados/store.ts'), 'utf8');
    const storeLegacyApi = readFileSync(join(featuresDir, 'monitorados/store-legacy-api.ts'), 'utf8');

    expect(coreStack).toMatch(/import\s+\{\s*installMonitoradoStoreLegacyApi\s*\}/);
    expect(coreStack).toMatch(/installMonitoradoStoreLegacyApi\s*\(/);
    expect(store).not.toMatch(/\baliasGlobal\s*\(/);
    expect(storeLegacyApi).toMatch(/aliasGlobal\(\s*['"]getStoreMonitoradoPro['"]/);
    expect(storeLegacyApi).toMatch(/installMonitoradoStore\s*\(/);
  });

  it('monitorados exposes the toggle and boot globals through one bridge with the current manifest order', () => {
    const index = readFileSync(join(featuresDir, 'monitorados/index.ts'), 'utf8');
    const legacyApi = readFileSync(join(featuresDir, 'monitorados/legacy-api.ts'), 'utf8');
    const icon = readFileSync(join(featuresDir, 'monitorados/icon.ts'), 'utf8');
    const commands = readFileSync(join(featuresDir, 'monitorados/commands.ts'), 'utf8');
    const boot = readFileSync(join(featuresDir, 'monitorados/boot.ts'), 'utf8');
    const manifest = JSON.parse(readFileSync(join(rootDir, 'manifest.base.json'), 'utf8'));

    expect(index).toMatch(/import\s+(?:\{[^}]+\}\s+from\s+)?['"]\.\/legacy-api\.js['"]/);
    expect(index).not.toMatch(/\baliasGlobal\s*\(/);
    expect(legacyApi).toMatch(/import\s+\{\s*aliasGlobal\s*\}/);
    expect(legacyApi).toMatch(/\bicon\b[\s\S]*\bcommands\b/);
    expect(legacyApi).toMatch(/initPanelMonitorados[\s\S]*initAppendIconMonitorados[\s\S]*setAppendIconMonitorados/);
    expect(legacyApi).toMatch(/aliasGlobal\(name, fn\)/);
    expect(icon).toMatch(/export const legacyApi = \{[\s\S]*insertIconMonitorados: initIcon[\s\S]*appendIconMonitorados: mountIcon/);
    expect(commands).toMatch(/export const legacyApi = \{[\s\S]*actMonitoradoPro/);
    expect(boot).toMatch(/export function initPanelMonitorados/);
    expect(boot).toMatch(/export function initAppendIconMonitorados/);

    const relevantBlocks = manifest.content_scripts
      .map((block) => block.js || [])
      .filter((scripts) => scripts.includes('js/lista-context.bundle.js'));
    expect(relevantBlocks.length).toBe(2);
    for (const scripts of relevantBlocks) {
      expect(scripts.indexOf('js/core-stack.bundle.js')).toBeGreaterThanOrEqual(0);
      expect(scripts.indexOf('js/legacy-context.bundle.js')).toBeLessThan(scripts.indexOf('js/lista-context.bundle.js'));
      expect(scripts).not.toContain('js/monitorados.bundle.js');
    }
  });

  it('mantém o wire de favoritos entre entry, build e call-sites legados', () => {
    const index = readFileSync(join(featuresDir, 'monitorados/index.ts'), 'utf8');
    const build = readFileSync(join(rootDir, 'scripts/build.mjs'), 'utf8') + '\n' + readFileSync(join(rootDir, 'scripts/dist-pipeline.mjs'), 'utf8');
    const legacyLista = readListaProcessosSource();
    const legacyAll = readFileSync(join(featuresDir, 'todas-paginas/sei-pro-all.js'), 'utf8');
    const legacyShared = readSeiFunctionsSource();

    expect(build).toMatch(/entry:\s*'src\/features\/monitorados\/index\.(js|ts)',\s*out:\s*'dist\/js\/monitorados\.bundle\.js'/);
    expect(index).toMatch(/bindToggle\(document,\s*actMonitoradoPro\)/);
    expect(legacyLista).toMatch(/typeof initPanelMonitorados === 'function'\) initPanelMonitorados\(\)/);
    expect(legacyLista).toMatch(/appendStarOnProcess\(\)/);
    expect(legacyAll).toMatch(/typeof initAppendIconMonitorados === 'function'\) initAppendIconMonitorados\(\)/);
    expect(legacyShared).toMatch(/typeof parent\.initAppendIconMonitorados === 'function'\) parent\.initAppendIconMonitorados\(\)/);
  });
});
