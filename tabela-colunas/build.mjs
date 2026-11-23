import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Modulo do editor: carregado no mundo da pagina pelo SeiProEditorAdapter (lista MODULES), como os
// demais de dist/js/modules/editor. Acentos saem como \uXXXX (regra do projeto).
const saida = '../dist/js/modules/editor/tabela-colunas.js';
const outfile = fileURLToPath(new URL(saida, import.meta.url));
await build({
  entryPoints: [fileURLToPath(new URL('src/main.ts', import.meta.url))],
  outfile,
  bundle: true,
  minify: true,
  format: 'iife',
  target: ['chrome116', 'firefox115'],
  charset: 'ascii',
  legalComments: 'none',
  banner: { js: '/* GERADO por tabela-colunas/build.mjs. NAO EDITE. Rode: npm run build */' },
});
if ((await readFile(outfile)).some((byte) => byte > 127)) throw new Error(`Bundle com bytes nao ASCII: ${saida}`);
console.log('Tabela com colunas: bundle gerado.');
