/**
 * Sonda 2 do CK5 (plano 2, Task 2): `id` por GHS em paragrafo, estilo no elemento `table` (que o CK5 embrulha em
 * `figure.table`), cabecalho da tabela e passos de desfazer.   node vivo/sondas/ck5-tabela-id.cjs
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
    const g = window.SeiProGhs;
    const out = {};
    const ghs = ed.plugins.get('GeneralHtmlSupport');
    const modeloDe = (dom) => ed.editing.mapper.toModelElement(ed.editing.view.domConverter.mapDomToView(dom));

    // ---- id por GHS num paragrafo ----
    await S.definirHtml('<p class="Item_Nivel1">titulo um</p><p>texto</p>');
    const p1 = S.corpo().querySelector('p');
    out.id_setAtributos = g.setAtributos(p1, { id: 'bookmark-abc123' });
    await S.espera(300);
    out.id_html = S.obterHtml().slice(0, 160);
    out.id_sobrevive_aoRelerComDataSet = (() => {
      const h = S.obterHtml();
      ed.data.set({ [S.raiz]: h });
      return /id="bookmark-abc123"/.test(S.obterHtml());
    })();
    // link interno para o id mantem href e (com GHS) a classe?
    await S.definirHtml('<p id="bookmark-abc123" class="Item_Nivel1">titulo</p><p><a href="#bookmark-abc123" class="ancoraSei refInternaPro">ref</a></p>');
    out.link_interno_html = S.obterHtml().slice(0, 260);

    // ---- estilos na <table> (modelo table) ----
    await S.definirHtml('<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>');
    const figure = S.corpo().querySelector('figure.table');
    out.figure = !!figure;
    const mTab = figure && modeloDe(figure);
    out.modelo_tabela = mTab ? mTab.name : null;
    if (mTab) {
      ed.model.change(() => {
        ghs.setModelHtmlStyles('table', { 'border-collapse': 'collapse', width: '80%', 'margin-left': 'auto', 'margin-right': 'auto' }, mTab);
        ghs.setModelHtmlAttributes('table', { border: '1', cellspacing: '1', cellpadding: '1' }, mTab);
      });
      await S.espera(300);
      out.tabela_estilo_html = S.obterHtml().slice(0, 330);
      // um unico passo de desfazer para varias chamadas dentro de um model.change externo
      const antes = S.obterHtml();
      ed.model.change(() => {
        ghs.setModelHtmlStyles('table', { 'border-color': 'red' }, mTab);
        const tr = modeloDe(S.corpo().querySelector('tr'));
        ghs.setModelHtmlStyles('tr', { 'background-color': '#eee' }, tr);
        const td = modeloDe(S.corpo().querySelector('td'));
        ghs.setModelHtmlStyles('td', { color: 'blue' }, td);
      });
      await S.espera(200);
      ed.execute('undo');
      await S.espera(200);
      out.varias_chamadas_um_undo = S.obterHtml() === antes;
    }

    // ---- cabecalho da primeira linha ----
    await S.definirHtml('<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>');
    const td0 = S.corpo().querySelector('td p') || S.corpo().querySelector('td');
    S.corpo().focus();
    const range = document.createRange();
    range.selectNodeContents(td0);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    await S.espera(500);
    out.comando_setTableRowHeader = ed.commands.get('setTableRowHeader') ? ed.commands.get('setTableRowHeader').isEnabled : 'inexistente';
    if (ed.commands.get('setTableRowHeader') && ed.commands.get('setTableRowHeader').isEnabled) {
      ed.execute('setTableRowHeader');
      await S.espera(300);
      out.cabecalho_html = S.obterHtml().slice(0, 260);
    }
    return out;
  });
  console.log(JSON.stringify(r, null, 2));
  await b.disconnect();
})().catch((e) => {
  console.error('ERRO', e.message);
  process.exit(1);
});
