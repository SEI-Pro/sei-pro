/**
 * Captura o dialogo de cada recurso do editor ao vivo (CK4 no SP, CK5 na ANTAQ), nos temas claro e escuro, para
 * conferir a diagramacao.   node vivo/sondas/modais.cjs <sp|antaq> <modal|todos> <claro|escuro> <pasta> [variante]
 * modais: qr, tabela, latex, tiny, link, sumario, ref, nota, legis, dados, importar, citacao, qualidade, publico, sigilo, linksei, revisao, ditado, imagem, fundo
 * variante: "substituir" | "personalizados" | "lista" (dados), "avancado" (qr com as opcoes abertas), "abnt" (nota), "infra" | "lista" | "busca" (legis).
 * Escreve <pasta>/<ambiente>-<modal>[-variante]-<tema>.png e imprime medidas de transbordamento.
 */
const fs = require('fs');
const path = require('path');
const { conectar, pagina } = require('../lib.cjs');
const { editorAntaq } = require('../ambientes.cjs');
const { rodarEm } = require('../cenario.cjs');

const CENARIOS = {
  async qr(v) {
    const S = window.__spro;
    const botao = S.botao();
    window.getQrCode(botao);
    await S.espera(500);
    const campo = document.querySelector('#qrCodeText');
    campo.value = 'https://sei.antaq.gov.br/documento/3021277/conferencia';
    campo.dispatchEvent(new Event('input', { bubbles: true }));
    await S.espera(500);
    if (v === 'avancado') {
      document.querySelector('#toggleOptionsQR').click();
      await S.espera(400);
    }
  },
  async tabela(v) {
    const S = window.__spro;
    await S.definirHtml('<table><tbody><tr><td><p>a</p></td><td><p>b</p></td></tr><tr><td><p>c</p></td><td><p>d</p></td></tr></tbody></table>');
    await S.cursorEm('table td');
    window.getSyleSelectedTable(S.botao());
    await S.espera(600);
  },
  async latex(v) {
    const S = window.__spro;
    window.openDialogLatex(S.botao());
    await S.espera(400);
    const t = document.querySelector('#MathText');
    t.value = '\\frac{a}{b} + \\sqrt{x^2}';
    t.dispatchEvent(new Event('input', { bubbles: true }));
    await S.espera(1500);
  },
  async tiny(v) {
    const S = window.__spro;
    window.getTinyUrl(S.botao());
    await S.espera(500);
  },
  async link(v) {
    const S = window.__spro;
    await S.definirHtml('<p>Veja <a href="https://www.gov.br/antaq/pt-br">o portal da ANTAQ</a> para mais.</p>');
    const a = S.corpo().querySelector('a');
    window.showLinkTips(a);
    await S.espera(400);
    window.openDialogLinkPro();
    await S.espera(400);
  },
  async sumario(v) {
    const S = window.__spro;
    await S.definirHtml('<p class="Item_Nivel1">Introdução</p><p class="Item_Nivel2">Contexto</p><p class="Paragrafo_Numerado_Nivel1">Texto.</p><p class="Item_Nivel1">Conclusão</p>');
    await S.cursorEm('p');
    window.getSumarioDocumento(S.botao());
    await S.espera(500);
  },
  async ref(v) {
    const S = window.__spro;
    await S.definirHtml('<p class="Paragrafo_Numerado_Nivel1">Primeiro parágrafo numerado do documento de teste.</p><p class="Paragrafo_Numerado_Nivel1">Segundo parágrafo, com um texto um pouco mais longo para ver como a lista trata a quebra e o corte do conteúdo em duas linhas.</p><p class="Paragrafo_Numerado_Nivel1">Terceiro.</p>');
    await S.cursorEm('p');
    window.getRefInterna(S.botao());
    await S.espera(500);
  },
  async nota(v) {
    const S = window.__spro;
    window.getNotaRodape(S.botao());
    await S.espera(500);
    if (v === 'abnt') {
      document.querySelector('#ntTab_abnt').click();
      await S.espera(300);
      for (const [id, val] of [['nr_Nome', 'Maria'], ['nr_Sobrenome', 'Souza'], ['nr_Titulo', 'Regulação portuária no Brasil']]) {
        const c = document.querySelector('#' + id);
        c.value = val;
        c.dispatchEvent(new Event('input', { bubbles: true }));
      }
      await S.espera(300);
    }
  },
  async citacao(v) {
    const S = window.__spro;
    await S.definirHtml('<p>Conforme o documento </p>');
    await S.cursorEm('p');
    window.getCitacaoDocumento(S.botao());
    for (let i = 0; i < 40 && !document.querySelector('dialog.spro-dialogo[open]'); i++) await S.espera(500);
    await S.espera(500);
    const cx = [...document.querySelectorAll('#listaCitacao input')];
    for (const i of cx.slice(0, 2)) i.click();
    await S.espera(200);
    if (v) {
      const f = document.querySelector('#filtroCitacao');
      f.value = v;
      f.dispatchEvent(new Event('input', { bubbles: true }));
      await S.espera(200);
    }
  },
  async fundo() {
    const S = window.__spro;
    await S.definirHtml('<p>Texto.</p>');
    await S.cursorEm('p');
    window.openDialogPageImageBackground();
    await S.espera(900);
  },
  async imagem(v) {
    const S = window.__spro;
    await S.definirHtml('<p>Texto.</p>');
    await S.cursorEm('p');
    window.openDialogUploadImgBase64(S.botao());
    await S.espera(600);
    if (v) {
      document.querySelector('#dialogUploadImgBase64Pro [data-aba="' + v + '"]').click();
      await S.espera(300);
    }
  },
  async ditado() {
    const S = window.__spro;
    window.getBoxCtrDitado(S.botao());
    await S.espera(800);
  },
  async revisao(v) {
    const S = window.__spro;
    await S.definirHtml(v === 'vazio' ? '<p>Texto sem revisoes.</p>' : '<p>O servidor <span class="reviewSeiPro" data-review="add" data-id-review="r1" data-user-review="Pedro Soares" data-date-review="23/11/2026 10:15" data-comment="Confirmar o nome completo.">Joao da Silva</span> enviou o oficio <span class="reviewSeiPro" data-review="delete" data-id-review="r2" data-user-review="Maria Souza" data-date-review="22/11/2026 16:40">de ontem</span> ao setor.</p>');
    await S.cursorEm('p');
    window.getBoxCtrReview(S.botao());
    await S.espera(800);
  },
  async linksei() {
    const S = window.__spro;
    await S.definirHtml('<p>Conforme os documentos 3021277 e 3021338, o processo 50300.018905/2018-67 e o numero 0627920 do oficio.</p>');
    await S.cursorEm('p');
    window.converterNumerosSeiEmLotePro(S.botao());
    await S.espera(800);
  },
  async sigilo(v) {
    const S = window.__spro;
    await S.definirHtml('<p>O servidor Joao Silva (CPF 123.456.789-09) enviou joao@exemplo.gov.br ontem.</p>');
    await S.selecionarTexto('p');
    window.getBoxSigilo(S.botao());
    await S.espera(600);
    if (v) {
      document.querySelector('#dialogSigiloPro [data-aba="' + v + '"]').click();
      await S.espera(300);
    }
  },
  async qualidade() {
    const S = window.__spro;
    window.openDialogBatchImgQuality(S.botao());
    await S.espera(500);
  },
  async publico() {
    const S = window.__spro;
    window.openDialogProcessoPublicoPro(S.botao());
    for (let i = 0; i < 30 && !document.querySelector('#searchPub_captcha img'); i++) await S.espera(500);
    await S.espera(500);
  },
  async importar(v) {
    const S = window.__spro;
    window.importDocPro(S.botao());
    await S.espera(600);
    if (v) {
      const aba = document.querySelector('#impTab_' + v);
      if (aba) aba.click();
      await S.espera(300);
    }
  },
  async dados(v) {
    const S = window.__spro;
    await S.definirHtml('<p>Processo #processo em #hoje, gestor #gestor.</p>');
    await S.cursorEm('p');
    window.getDadosEditor(S.botao());
    for (let i = 0; i < 40 && !document.querySelector('dialog.spro-dialogo[open]'); i++) await S.espera(500);
    await S.espera(500);
    if (v) {
      const aba = document.querySelector('#dadosTab_' + v);
      if (aba) aba.click();
      await S.espera(300);
    }
  },
  async legis(v) {
    const S = window.__spro;
    window.getLegisSEI(S.botao());
    await S.espera(500);
    if (v === 'infra') document.querySelector('#legisTab_infra').click();
    if (v === 'lista') document.querySelector('#legisTab_lista').click();
    if (v === 'busca') {
      document.querySelector('#legis_termoNorma').value = 'licitações';
      document.querySelector('#searchLegis_uiElement').click();
      await S.espera(2500);
    }
    await S.espera(300);
  },
};

(async () => {
  const [amb, qual, tema, pasta, variante] = process.argv.slice(2);
  if (!amb || !qual || !tema || !pasta) {
    console.error('uso: modais.cjs <sp|antaq> <modal|todos> <claro|escuro> <pasta> [variante]');
    process.exit(1);
  }
  fs.mkdirSync(pasta, { recursive: true });
  const b = await conectar();
  const p = amb === 'sp' ? await pagina(b, /treinamento\.sei\.sp.*editor_montar/) : await editorAntaq(b);
  if (!p) {
    console.error('sem editor aberto para', amb);
    process.exit(1);
  }
  const modais = qual === 'todos' ? Object.keys(CENARIOS) : [qual];
  for (const m of modais) {
    await p.reload({ waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 6000));
    await p.evaluate((t) => document.documentElement.setAttribute('data-spro-tema', t === 'escuro' ? 'escuro' : 'claro'), tema);
    let cdp = null;
    if (m === 'legis' && variante === 'busca') {
      cdp = await p.createCDPSession();
      await cdp.send('Fetch.enable', { patterns: [{ urlPattern: '*legis.seipro.app/v1/normas*' }] });
      cdp.on('Fetch.requestPaused', async (e) => {
        const itens = [
          { tipo: 'lei', numero: 14133, titulo: 'Lei nº 14.133, de 1 de abril de 2021', apelido: 'Nova Lei de Licitações', url: 'https://normas.leg.br/?urn=14133', ementa: 'LEI DE LICITAÇÕES E CONTRATOS ADMINISTRATIVOS. Regulamenta o art. 37, inciso XXI, da Constituição Federal e institui normas para licitações e contratos da Administração Pública direta, autárquica e fundacional da União, dos Estados, do Distrito Federal e dos Municípios, entre outras providências que seguem no texto.' },
          { tipo: 'lei', numero: 8666, titulo: 'Lei nº 8.666, de 21 de junho de 1993', url: 'https://normas.leg.br/?urn=8666', ementa: 'Regulamenta o art. 37, inciso XXI, da Constituição Federal, institui normas para licitações e contratos da Administração Pública e dá outras providências.', revogada: true },
          { tipo: 'lei', numero: 10520, titulo: 'Lei nº 10.520, de 17 de julho de 2002', url: 'https://normas.leg.br/?urn=10520', ementa: 'Pregão.' },
        ];
        await cdp.send('Fetch.fulfillRequest', { requestId: e.requestId, responseCode: 200, responseHeaders: [{ name: 'Content-Type', value: 'application/json' }, { name: 'Access-Control-Allow-Origin', value: '*' }], body: Buffer.from(JSON.stringify({ itens, total: 3 })).toString('base64') });
      });
    }
    await rodarEm(p, CENARIOS[m], variante).catch((e) => console.log('cenario falhou:', e.message));
    const info = await p.evaluate(() => {
      const d = document.querySelector('dialog.spro-dialogo[open]');
      if (!d) return { erro: 'dialogo nao abriu' };
      const corpo = d.querySelector('.spro-dialogo-corpo');
      const r = d.getBoundingClientRect();
      const trans = [...d.querySelectorAll('*')]
        .filter((e) => {
          const x = e.getBoundingClientRect();
          return x.width > 0 && x.right > r.right + 1;
        })
        .slice(0, 5)
        .map((e) => `${e.tagName}#${e.id}.${String(e.className).slice(0, 30)}`);
      return {
        w: Math.round(r.width),
        h: Math.round(r.height),
        rolagemH: corpo ? corpo.scrollWidth > corpo.clientWidth + 1 : null,
        rolagemV: corpo ? corpo.scrollHeight > corpo.clientHeight + 1 : null,
        transbordam: trans,
      };
    });
    const el = await p.$('dialog.spro-dialogo[open]');
    const arq = path.join(pasta, `${amb}-${m}${variante ? '-' + variante : ''}-${tema}.png`);
    if (el) await el.screenshot({ path: arq });
    console.log(m, JSON.stringify(info), el ? arq : '(sem captura)');
    await p.evaluate(() => { const d = document.querySelector('dialog.spro-dialogo[open]'); d && d.close(); });
    if (cdp) await cdp.send('Fetch.disable').catch(() => {});
  }
  await b.disconnect();
})().catch((e) => {
  console.error('ERRO', e.message);
  process.exit(1);
});
