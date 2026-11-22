/**
 * Sonda do CK5 (plano 2, Task 2): o que o CK5 aceita para ancoras nomeadas, `data.set` e estilos de tabela.
 *   node vivo/sondas/ck5-ancoras.cjs
 * Roda no editor da ANTAQ (so edicao em memoria; recarregar a pagina descarta). Imprime um JSON com as respostas.
 */
const { conectar } = require('../lib.cjs');
const { editorAntaq } = require('../ambientes.cjs');
const { rodarEm } = require('../cenario.cjs');

(async () => {
  const b = await conectar();
  const p = await editorAntaq(b);
  if (!p) {
    console.error('Sem editor da ANTAQ aberto (rode ambientes.abrirEditorAntaq).');
    process.exit(1);
  }
  await p.bringToFront();
  const r = await rodarEm(p, async () => {
    const S = window.__spro;
    const ed = S.ed;
    const espera = S.espera;
    const out = {};
    const raiz = S.raiz;
    const modeloDe = (dom) => ed.editing.mapper.toModelElement(ed.editing.view.domConverter.mapDomToView(dom));
    const inserir = (html, posicaoDe) =>
      ed.model.change((w) => ed.model.insertContent(ed.data.toModel(ed.data.processor.toView(html)), posicaoDe(w)));
    const ultimos = (n = 420) => S.obterHtml().slice(-n);

    // ---- 1. ancora nomeada ----
    await S.definirHtml('<p id="a1" class="Paragrafo_Numerado_Nivel1">primeiro</p><p id="a2">segundo</p>');
    const p1 = () => [...S.corpo().querySelectorAll('p')].find((x) => x.textContent.startsWith('primeiro'));
    inserir('<a name="x" class="seipro-bookmark"></a>', (w) => w.createPositionAt(modeloDe(p1()), 0));
    await espera(300);
    out.ancoraVazia_insertContent = ultimos();
    await S.definirHtml('<p>primeiro</p><p>segundo</p>');
    inserir('<a name="x2" class="seipro-bookmark">​</a>', (w) => w.createPositionAt(modeloDe(p1()), 0));
    await espera(300);
    out.ancoraZeroWidth_insertContent = ultimos();
    // via data.set (import completo): a ancora sobrevive ao upcast?
    await S.definirHtml('<p><a name="x3" class="seipro-bookmark"></a>primeiro</p><p><a href="#x3" class="ancoraSei">ref</a> segundo</p>');
    out.ancora_via_dataSet = ultimos();
    // link interno com href="#"
    out.linkInterno_preservado = /href="#x3"/.test(S.obterHtml());
    out.ancoraNome_preservada = /name="x3"/.test(S.obterHtml());

    // ---- 2. data.set e desfazer ----
    await S.definirHtml('<p>um</p><p>dois</p>');
    const undo = ed.commands.get('undo');
    out.undo_antes = { habilitado: undo.isEnabled };
    const antes = S.obterHtml();
    ed.model.change((w) => w.setSelection(modeloDe([...S.corpo().querySelectorAll('p')][1]), 'in'));
    ed.data.set({ [raiz]: '<p>um</p><p>dois</p><p>TRES</p>' });
    await espera(300);
    out.dataSet_depois = ultimos(80);
    out.undo_depois_dataSet = { habilitado: undo.isEnabled };
    if (undo.isEnabled) {
      ed.execute('undo');
      await espera(300);
    }
    out.dataSet_desfez = S.obterHtml() === antes;
    out.dataSet_aposUndo = ultimos(80);
    out.selecao_aposDataSet = ed.model.document.selection.getFirstPosition().root.rootName;

    // ---- 3. estilos de tabela pelo GHS ----
    await S.definirHtml('<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>');
    const tabela = S.corpo().querySelector('table');
    const tr = S.corpo().querySelectorAll('tr')[0];
    const td = S.corpo().querySelectorAll('td')[0];
    const g = window.SeiProGhs;
    out.ghs = !!g;
    out.ghs_tabela = g.setEstilos(tabela, { 'border-collapse': 'collapse', width: '80%' });
    out.ghs_tr = g.setEstilos(tr, { 'background-color': '#eee' });
    out.ghs_td = g.setEstilos(td, { 'border-color': 'red' });
    out.ghs_atributo_td = g.setAtributos(td, { 'data-teste': '1' });
    await espera(300);
    out.tabela_html = S.obterHtml().slice(0, 700);
    out.tabela_apos_desfazer = '';
    ed.execute('undo');
    await espera(200);
    out.tabela_desfeito_1_passo = S.obterHtml().slice(0, 300);
    // thead: dataSet com thead
    await S.definirHtml('<table><thead><tr><td><p>h</p></td></tr></thead><tbody><tr><td><p>c</p></td></tr></tbody></table>');
    out.thead_roundtrip = S.obterHtml().slice(0, 300);

    // ---- 4. counter-reset ----
    await S.definirHtml('<p>x</p>');
    inserir('<p class="sessionBreakPro"></p>', (w) => w.createPositionAt(ed.model.document.getRoot(raiz), 'end'));
    await espera(300);
    const sb = [...S.corpo().querySelectorAll('p.sessionBreakPro')].pop();
    out.counterReset_aplicou = sb ? g.setEstilos(sb, { 'counter-reset': 'paragrafo-n1 paragrafo-n2 item-n4 ' }) : 'sem p.sessionBreakPro';
    await espera(300);
    out.counterReset_html = ultimos(220);
    return out;
  });
  console.log(JSON.stringify(r, null, 2));
  await b.disconnect();
})().catch((e) => {
  console.error('ERRO', e.message);
  process.exit(1);
});
