import { build } from 'esbuild';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const saidas = [
  ['src/main.ts', '../dist/js/init_modelo_limpo.js'],
  ['src/pagina.ts', '../dist/js/modelo-limpo-pagina.js'],
];
for (const [entrada, saida] of saidas) {
  const outfile = fileURLToPath(new URL(saida, import.meta.url));
  await build({
    entryPoints: [fileURLToPath(new URL(entrada, import.meta.url))],
    outfile,
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['chrome116', 'firefox115'],
    charset: 'ascii',
    legalComments: 'none',
    banner: { js: '/* GERADO por modelo-limpo/build.mjs. NAO EDITE. Rode: npm run build */' },
  });
  if ((await readFile(outfile)).some((byte) => byte > 127)) throw new Error(`Bundle com bytes nao ASCII: ${saida}`);
}
console.log('Modelo limpo: bundles gerados.');
