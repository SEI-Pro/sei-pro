import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const jsDir = join(rootDir, 'dist/js');

function listJsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.js'))
    .map((d) => d.name);
}

function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// Bare `isNewSEI` / `isSEI_5` identifier usage that should have gone through the
// adapter. Excludes: member access (`parent.isNewSEI`, `SeiPro.state.isNewSEI`),
// `typeof isNewSEI`, and the legacy `var ... =` declaration lines (the backing
// store the adapter reads). What remains is a raw read of the global — a Phase 3
// regression.
const BARE_USAGE = /(?<![.\w])(?<!typeof )\b(isNewSEI|isSEI_5)\b(?!\s*=(?!=))/g;

// Files where the global is still read directly, on purpose (see Phase 3 notes):
// - arvore runs inside the ifrArvore iframe and reads `parent.isNewSEI`; the local
//   adapter cannot reliably detect the SEI version there.
// - arvore-boot does not load the core/adapter stack.
// - *.bundle.js are generated from src/ (not hand-maintained legacy files); the
//   adapter/version source they bundle legitimately defines/reads isNewSEI.
const ALLOWLIST = new Set([
  'sei-pro-arvore.js',
  'sei-pro-arvore-boot.js'
]);
const isGeneratedBundle = (name) => name.endsWith('.bundle.js');

describe('Phase 3: version flags read through the adapter', () => {
  it('no migrated legacy file reads the bare isNewSEI/isSEI_5 global', () => {
    const offenders = [];

    listJsFiles(jsDir).forEach((name) => {
      if (ALLOWLIST.has(name) || isGeneratedBundle(name)) return;
      const code = stripComments(readFileSync(join(jsDir, name), 'utf8'))
        // Drop the legacy `var isNewSEI = ...` / `var isSEI_5 = ...` bootstrap
        // declarations: they are the backing store, and computing isSEI_5 reads
        // isNewSEI by design.
        .split('\n')
        .filter((line) => !/^\s*var\s+(isNewSEI|isSEI_5)\s*=/.test(line))
        .join('\n');
      const matches = code.match(BARE_USAGE);
      if (matches) {
        offenders.push(`${name}: ${matches.length} bare usage(s) (${[...new Set(matches)].join(', ')})`);
      }
    });

    expect(offenders).toEqual([]);
  });

  it('the adapter exposes the neutral predicate API', () => {
    const code = readFileSync(join(rootDir, 'src/sei/adapter.js'), 'utf8');
    ['isNewSEI', 'isSEI5', 'atLeast', 'pick'].forEach((fn) => {
      expect(code).toMatch(new RegExp(`function ${fn}\\b`));
    });
  });
});
