import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '../..');
const jsDir = join(rootDir, 'dist/js');
const srcDir = join(rootDir, 'src');

// The core+sei stack is bundled from src/ into this generated IIFE; it is not a
// hand-maintained legacy file, so exclude it from the legacy duplicate scan.
const GENERATED = new Set(['core-stack.bundle.js']);

function listJsFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isFile() && d.name.endsWith('.js'))
    .map((d) => join(dir, d.name));
}

// Strip block and line comments so commented-out definitions are not counted.
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

// Top-level `function foo(` declarations only (column 0).
function topLevelFunctionNames(code) {
  const names = new Set();
  const re = /^(?:async\s+)?function\s+([A-Za-z0-9_$]+)\s*\(/gm;
  let m;
  while ((m = re.exec(stripComments(code))) !== null) {
    names.add(m[1]);
  }
  return names;
}

// Public helpers the core/ and sei/ layers expose as legacy global aliases.
// In the ESM source (src/) these are registered via `aliasGlobal('foo', foo)`.
// They bridge to legacy callers and must therefore have a single definition —
// never re-declared in a legacy file under dist/js/.
const NON_FUNCTION_GLOBALS = new Set(['SeiPro', 'browser', 'chrome']);

function migratedFunctionNames() {
  const names = new Set();
  const re = /aliasGlobal\(\s*['"]([A-Za-z0-9_$]+)['"]/g;
  ['core', 'sei'].forEach((sub) => {
    listJsFiles(join(srcDir, sub)).forEach((file) => {
      const code = readFileSync(file, 'utf8');
      let m;
      while ((m = re.exec(code)) !== null) {
        if (!NON_FUNCTION_GLOBALS.has(m[1])) {
          names.add(m[1]);
        }
      }
    });
  });
  return names;
}

describe('migration: no duplicate definitions of migrated helpers', () => {
  it('each core/sei helper is defined only inside core/ or sei/, never in a legacy file', () => {
    const migrated = migratedFunctionNames();
    expect(migrated.size).toBeGreaterThan(0);

    const legacyFiles = listJsFiles(jsDir).filter(
      (f) => !GENERATED.has(f.split('/').pop())
    ); // dist/js/*.js minus the generated bundle
    const offenders = [];

    legacyFiles.forEach((file) => {
      const defined = topLevelFunctionNames(readFileSync(file, 'utf8'));
      defined.forEach((name) => {
        if (migrated.has(name)) {
          offenders.push(`${name} re-defined in ${file.replace(rootDir + '/', '')}`);
        }
      });
    });

    expect(offenders).toEqual([]);
  });
});
