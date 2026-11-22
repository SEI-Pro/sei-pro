/**
 * Prepara os editores de teste para validar um recurso:
 *   node vivo/preparar.cjs [reinstalar] [id ...]
 * - `reinstalar`: reinstala a extensao de `dist/` (mesmo id; mantem o login).
 * - Recarrega cada editor 2 VEZES (o 1o carregamento depois de reinstalar usa o content script antigo e roda o LEGADO),
 *   espera o adapter e imprime `data-seipro-editor-ts`.
 * - Com ids, sai com codigo 1 se algum nao estiver no atributo (ou seja, o recurso TS nao esta ativo).
 */
const { conectar, pagina, esperar, DIST, AMBIENTES } = require('./lib.cjs');

/** Recarrega `p` duas vezes e espera o adapter. Devolve o atributo de cedencia. */
async function recarregar(p) {
  for (let i = 0; i < 2; i += 1) {
    await p.reload({ waitUntil: 'domcontentloaded' }).catch(() => {});
    await esperar(i === 0 ? 5000 : 8000);
  }
  await p
    .waitForFunction(() => window.SeiProEditorAdapter && window.SeiProEditorAdapter.getFeatures().length > 3, { timeout: 45000 })
    .catch(() => {});
  return p.evaluate(() => document.documentElement.getAttribute('data-seipro-editor-ts'));
}

module.exports = { recarregar };

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2);
    const reinstalar = args.includes('reinstalar');
    const ids = args.filter((a) => a !== 'reinstalar');
    const b = await conectar();
    if (reinstalar) console.log('reinstalada', await b.installExtension(DIST));
    let falhou = false;
    for (const { rotulo, re } of AMBIENTES) {
      const p = await pagina(b, re);
      if (!p) {
        console.log(`${rotulo}: sem aba do editor`);
        continue;
      }
      await p.bringToFront();
      const attr = await recarregar(p);
      const faltando = ids.filter((id) => !(attr || '').split(',').includes(id));
      console.log(`${rotulo}: ts=${attr}${faltando.length ? ` | FALTANDO: ${faltando.join(',')}` : ' | ok'}`);
      if (faltando.length) falhou = true;
    }
    await b.disconnect();
    process.exit(falhou ? 1 : 0);
  })().catch((e) => {
    console.error('ERRO', e.message);
    process.exit(1);
  });
}
