import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Guard estrutural: cada módulo de seção (src/features/arvore-info/sections/*.js)
 * lê dependências via `ctx.<chave>`. O index.js precisa PASSAR todas essas chaves
 * no objeto da chamada install/create correspondente — senão o helper fica
 * `undefined` e quebra só em runtime (esbuild não acusa). Foi assim que
 * `submitForm` passou batido no split da Anotação. Este teste tranca isso.
 */
const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');
const sectionsDir = join(root, 'src/features/arvore-info/sections');
const indexSrc = readFileSync(join(root, 'src/features/arvore-info/index.js'), 'utf8');

// Extrai o objeto literal passado para `fnName({ ... })` (capturando o 1º bloco balanceado).
function callObjectBody(code, fnName) {
  const start = code.indexOf(fnName + '({');
  if (start === -1) return null;
  let i = code.indexOf('{', start);
  let depth = 0;
  for (let j = i; j < code.length; j++) {
    if (code[j] === '{') depth++;
    else if (code[j] === '}') { depth--; if (depth === 0) return code.slice(i + 1, j); }
  }
  return null;
}

const files = readdirSync(sectionsDir).filter((f) => f.endsWith('.js'));

describe('arvore-info: ctx das seções é totalmente passado pelo index.js', () => {
  for (const file of files) {
    it(`${file}: todas as ctx.<chave> usadas são passadas na chamada`, () => {
      const code = readFileSync(join(sectionsDir, file), 'utf8');
      // A função de instalação da seção (install*/create*) — não os parsers exportados.
      const exportName = (code.match(/export function ((?:install|create)\w+)\s*\(/) || [])[1];
      expect(exportName, `${file} deve exportar uma função install/create`).toBeTruthy();

      const used = new Set();
      const re = /ctx\.(\w+)/g;
      let m;
      while ((m = re.exec(code)) !== null) used.add(m[1]);

      const body = callObjectBody(indexSrc, exportName);
      expect(body, `index.js deve conter a chamada ${exportName}({...})`).toBeTruthy();

      const passed = new Set();
      const kre = /(\w+)\s*:/g;
      let k;
      while ((k = kre.exec(body)) !== null) passed.add(k[1]);

      const missing = [...used].filter((key) => !passed.has(key));
      expect(missing, `${exportName}: ctx faltando no index.js: ${missing.join(', ')}`).toEqual([]);
    });
  }
});
