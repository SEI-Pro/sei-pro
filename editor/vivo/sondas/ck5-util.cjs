/**
 * Valida ao vivo no CK5 (ANTAQ) o que os falsos nao provam dos utilitarios do plano 2: estilizar uma tabela inteira pelo
 * GHS num unico passo de desfazer, o cabecalho (`headingRows`) e a ancora por `id`.   node vivo/sondas/ck5-util.cjs
 * Usa funcoes globais ja instaladas pelo bundle? NAO: roda a mesma logica via API do editor, espelhando `src/util/*.ts`.
 */
const { conectar } = require('../lib.cjs');
const { editorAntaq } = require('../ambientes.cjs');
const { rodarEm } = require('../cenario.cjs');

(async () => {
  const b = await conectar();
  const p = await editorAntaq(b);
  if (!p) {
    console.error('Sem editor da ANTAQ aberto.');
    process.exit(1);
  }
  const r = await rodarEm(p, async () => {
    const S = window.__spro;
    const ed = S.ed;
    const out = {};
    const modeloDe = (dom) => ed.editing.mapper.toModelElement(ed.editing.view.domConverter.mapDomToView(dom));
    const ghs = ed.plugins.get('GeneralHtmlSupport');
    const obj = (css) => Object.fromEntries(css.split(';').filter((x) => x.includes(':')).map((x) => [x.slice(0, x.indexOf(':')).trim(), x.slice(x.indexOf(':') + 1).trim()]));

    await S.definirHtml('<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>');
    const antes = S.obterHtml();
    const tabela = S.corpo().querySelector('table');
    const figura = tabela.closest('figure');
    const mTab = modeloDe(figura);
    const trs = [...S.corpo().querySelectorAll('tr')];
    ed.model.change(() => {
      ghs.setModelHtmlStyles('table', obj('border-collapse:collapse;width:80%;'), mTab);
      trs.forEach((tr, i) => {
        ghs.setModelHtmlStyles('tr', obj(i === 0 ? 'background:#0f0;' : 'background:#eee;'), modeloDe(tr));
        [...tr.querySelectorAll('td, th')].forEach((td, j) => {
          const mTd = modeloDe(td);
          ghs.setModelHtmlStyles('td', obj(i === 0 ? 'color:#fff;' : j === 0 ? 'font-weight:bold;' : 'border:1px solid #000;'), mTd);
          for (const filho of mTd.getChildren()) {
            if (filho.name === 'paragraph') ed.model.change((w) => w.setAttribute('estilo', i === 0 ? 'Tabela_Texto_Centralizado' : 'Tabela_Texto_Alinhado_Esquerda', filho));
          }
        });
      });
      ed.model.change((w) => w.setAttribute('headingRows', 1, mTab));
    });
    await S.espera(300);
    out.html = S.obterHtml().slice(0, 700);
    ed.execute('undo');
    await S.espera(300);
    out.desfezTudoEmUmPasso = S.obterHtml() === antes;

    // ancora por id num titulo
    await S.definirHtml('<p class="Item_Nivel1">titulo</p><p>texto</p>');
    const t = S.corpo().querySelector('p');
    const ok = window.SeiProGhs.setAtributos(t, { id: 'bookmark-live1' });
    await S.espera(200);
    out.ancora = { ok, html: S.obterHtml().slice(0, 140) };
    return out;
  });
  console.log(JSON.stringify(r, null, 2));
  await b.disconnect();
})().catch((e) => {
  console.error('ERRO', e.message);
  process.exit(1);
});
