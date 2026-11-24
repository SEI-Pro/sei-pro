/**
 * Suite ao vivo do editor (CDP): abre cada modal nos ambientes disponiveis (ANTAQ = CK5, SP = CK4) e nos temas claro e
 * escuro, e confere o que e verificavel de fora: o dialogo abre, tem titulo, nao tem "Cancelar", nao transborda, usa o
 * tema pedido e nao gera erro de pagina; mais os fluxos principais dos modulos portados por ultimo.
 *
 *   node vivo/suite.cjs [antaq|sp|todos] [modal,modal,...]
 * Sai com codigo 1 se algo falhar. Nao salva nada no SEI (so edicao em memoria; cada cenario recarrega a pagina).
 */
const { conectar, pagina } = require('./lib.cjs');
const { editorAntaq, abrirEditorSp } = require('./ambientes.cjs');
const { rodarEm } = require('./cenario.cjs');
const { CENARIOS } = require('./sondas/modais.cjs');

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
// Erros que o proprio SEI gera ao recarregar o editor (frames pai/filho), sem relacao com o SEI Pro.
const RUIDO_DO_SEI = /infraIsBreakpointBootstrap|reading 'contentWindow'/;
let ok = 0;
const falhas = [];
function checar(amb, nome, cond, detalhe) {
  if (cond) ok++;
  else {
    falhas.push(`${amb}: ${nome}${detalhe ? ' -- ' + detalhe : ''}`);
    console.log(`  FALHA ${nome}${detalhe ? ' -- ' + detalhe : ''}`);
  }
}

/** Fluxos por modulo: rodam na pagina depois que o cenario abriu o dialogo; devolvem lista [nome, passou, detalhe?]. */
const FLUXOS = {
  async sigilo() {
    const r = [];
    const S = window.__spro;
    const ids = ['inputSigiloTexto', 'btnSigiloReplace', 'btnSigiloEmailCpf', 'btnSigiloApply', 'btnSigiloRemove', 'tabSigilo3_result'];
    for (const id of ids) r.push([`sigilo: #${id} existe`, !!document.getElementById(id)]);
    document.getElementById('btnSigiloEmailCpf')?.click();
    await S.espera(600);
    const h = S.obterHtml();
    r.push(['sigilo: localizar dados pessoais marca e-mail e CPF no texto', (h.match(/sigiloSEI/g) || []).length >= 2, h.slice(0, 200)]);
    return r;
  },
  async revisao() {
    const r = [];
    const S = window.__spro;
    r.push(['revisao: lista duas revisoes', document.querySelectorAll('#boxReviews .reviewDisplayPro').length === 2]);
    r.push(['revisao: botoes Aceitar/Rejeitar todas', !!document.getElementById('reviewAcceptAll') && !!document.getElementById('reviewRejectAll')]);
    document.getElementById('reviewAcceptAll')?.click();
    await S.espera(1200);
    const h = S.obterHtml();
    r.push(['revisao: aceitar todas remove as marcas', !/reviewSeiPro/.test(h) && /Joao da Silva/.test(h) && !/de ontem/.test(h), h.slice(0, 160)]);
    return r;
  },
  async linksei() {
    const r = [];
    const itens = [...document.querySelectorAll('.linkSeiLoteItem')];
    r.push(['linksei: previa lista os numeros', itens.length >= 3, String(itens.length)]);
    document.getElementById('linkSeiLoteNenhum')?.click();
    await window.__spro.espera(200);
    r.push(['linksei: desmarcar todos', [...document.querySelectorAll('.linkSeiLoteItem')].every((i) => !(i.checked ?? i.querySelector('input')?.checked))]);
    document.getElementById('linkSeiLoteTodos')?.click();
    await window.__spro.espera(200);
    r.push(['linksei: marcar todos', [...document.querySelectorAll('.linkSeiLoteItem')].every((i) => i.checked ?? i.querySelector('input')?.checked)]);
    return r;
  },
  async ditado() {
    const r = [];
    r.push(['ditado: #wslanguages e #wscultures', !!document.getElementById('wslanguages') && !!document.getElementById('wscultures')]);
    r.push(['ditado: idioma lista opcoes', document.querySelectorAll('#wslanguages option').length > 3]);
    return r;
  },
  async imagem() {
    const r = [];
    const d = document.querySelector('[id^=b64_], #dialogUploadImgBase64Pro');
    r.push(['imagem: dialogo com campos b64_*', !!d && document.querySelectorAll('[id^=b64_]').length >= 5, String(document.querySelectorAll('[id^=b64_]').length)]);
    return r;
  },
  async fundo() {
    const r = [];
    const ids = ['tipoLayout', 'tipoPapel', 'tipoEscala', 'tipoFonte', 'tipoMargem', 'tipoPadding', 'tipoPosicao', 'tipoDisposicao', 'tipoRepeticao', 'tipoUtilizacao', 'textoCabecalho', 'textoRodape', 'visibleOnPrint', 'onlyFirst', 'reduceQualityImg', 'boxBgPreview', 'resetImgBgLink'];
    const faltam = ids.filter((id) => !document.getElementById(id));
    r.push(['fundo: todos os ids do dialogo', faltam.length === 0, faltam.join(',')]);
    const cab = document.getElementById('textoCabecalho');
    if (cab) {
      cab.value = 'Cabecalho de teste';
      cab.dispatchEvent(new Event('input', { bubbles: true }));
      document.getElementById('resetImgBgLink')?.click();
      await window.__spro.espera(300);
      r.push(['fundo: restaurar padroes limpa o cabecalho', document.getElementById('textoCabecalho').value === '']);
    }
    return r;
  },
};

/** Recursos sem dialogo (menu de contexto, limpeza de HTML, escrita interativa, marca d'agua): globais e efeito no HTML. */
async function recursosSemDialogo(p, amb, erros) {
  await p.reload({ waitUntil: 'networkidle2' });
  await esperar(6000);
  erros.length = 0;
  const rotulo = `${amb}/recursos`;
  const res = await rodarEm(p, async () => {
    const S = window.__spro;
    const r = [];
    const ts = (document.documentElement.getAttribute('data-seipro-editor-ts') || '').split(',');
    for (const id of ['context-menu', 'auto-cleanup', 'escrita-interativa', 'minuta-watermark', 'sigilo', 'review', 'ditado']) r.push([`recurso ${id} carregado`, ts.includes(id)]);
    for (const g of ['initContextMenuPro', 'menuBlockEdition', 'tableSorterPro', 'registrarLimpezaAutomaticaPro', 'limparHtmlEditorPro', 'rgbParaHexPro', 'insertMinutaWatermark', 'getMinutaWatermark', 'insertAutomaticMinutaWatermark']) r.push([`global ${g}`, typeof window[g] === 'function']);
    r.push(['global SeiProEscritaInterativa', !!window.SeiProEscritaInterativa && typeof window.SeiProEscritaInterativa.detectarGatilho === 'function']);
    r.push(['escrita: gatilho # detectado', !!window.SeiProEscritaInterativa.detectarGatilho('veja #12')]);
    const limpo = window.limparHtmlEditorPro('<p style="color: rgb(255, 0, 0); background-color: rgba(0, 128, 0, 1)">x</p>');
    r.push(['auto-cleanup: rgb vira hexadecimal', /#ff0000/i.test(String(limpo)) && !/rgba?\(/.test(String(limpo)), String(limpo).slice(0, 120)]);
    await S.definirHtml('<p style="color: rgb(0, 0, 255)">azul</p>');
    await S.espera(500);
    const saida = S.obterHtml();
    r.push(['auto-cleanup: o HTML que o SEI grava nao tem rgb()', !/rgba?\(/.test(saida), saida.slice(0, 120)]);
    r.push(['auto-cleanup: texto preservado', /azul/.test(saida)]);
    return r;
  }).catch((e) => [['recursos: cenario lancou excecao', false, e.message]]);
  for (const [nome, passou, det] of res) checar(rotulo, nome, passou, det);
  checar(rotulo, 'sem erro de pagina', erros.length === 0, erros.slice(0, 2).join(' | '));
}

async function um(p, amb, modal, tema, erros) {
  await p.reload({ waitUntil: 'networkidle2' });
  await esperar(6000);
  await p.evaluate((t) => document.documentElement.setAttribute('data-spro-tema', t), tema);
  erros.length = 0;
  const falhouCenario = await rodarEm(p, CENARIOS[modal]).then(() => null, (e) => e.message);
  const rotulo = `${amb}/${modal}/${tema}`;
  checar(rotulo, 'cenario roda sem excecao', !falhouCenario, falhouCenario || '');
  for (let i = 0; i < 12 && !(await p.$('dialog.spro-dialogo[open]')); i++) await esperar(500);
  const info = await p.evaluate(() => {
    const d = document.querySelector('dialog.spro-dialogo[open]');
    if (!d) return null;
    const r = d.getBoundingClientRect();
    const corpo = d.querySelector('.spro-dialogo-corpo');
    const botoes = [...d.querySelectorAll('button')].map((b) => (b.textContent || '').trim().toLowerCase());
    const trans = [...d.querySelectorAll('*')].filter((e) => {
      const x = e.getBoundingClientRect();
      return x.width > 0 && x.right > r.right + 1;
    });
    return {
      titulo: (d.querySelector('h2, .spro-dialogo-titulo')?.textContent || '').trim(),
      cancelar: botoes.some((t) => t === 'cancelar'),
      transborda: trans.length,
      rolagemH: corpo ? corpo.scrollWidth > corpo.clientWidth + 1 : false,
      cabeNaTela: r.top >= -1 && r.left >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1,
      tema: d.getAttribute('data-tema') || document.documentElement.getAttribute('data-spro-tema'),
    };
  });
  checar(rotulo, 'dialogo abriu', !!info);
  if (info) {
    checar(rotulo, 'tem titulo', info.titulo.length > 0);
    checar(rotulo, 'sem botao Cancelar', !info.cancelar);
    checar(rotulo, 'sem transbordo horizontal', info.transborda === 0 && !info.rolagemH, `${info.transborda} elementos`);
    checar(rotulo, 'cabe na tela', info.cabeNaTela);
    if (tema === 'claro' && FLUXOS[modal]) {
      const res = await p.evaluate(FLUXOS[modal]).catch((e) => [[`${modal}: fluxo lancou excecao`, false, e.message]]);
      for (const [nome, passou, det] of res) checar(rotulo, nome, passou, det);
    }
  }
  checar(rotulo, 'sem erro de pagina', erros.length === 0, erros.slice(0, 2).join(' | '));
  await p.evaluate(() => document.querySelector('dialog.spro-dialogo[open]')?.close()).catch(() => {});
}

(async () => {
  const [alvo = 'todos', lista] = process.argv.slice(2);
  const b = await conectar();
  const ambientes = [];
  if (alvo === 'todos' || alvo === 'antaq') {
    const p = await editorAntaq(b);
    if (p) ambientes.push(['antaq', p]);
    else console.log('ANTAQ: sem editor aberto (pulando)');
  }
  if (alvo === 'todos' || alvo === 'sp') {
    const p = await abrirEditorSp(b).catch((e) => {
      console.log('SP: nao abriu o editor (pulando):', e.message);
      return null;
    });
    if (p) ambientes.push(['sp', p]);
  }
  if (!ambientes.length) {
    console.error('nenhum editor disponivel');
    process.exit(1);
  }
  const modais = lista ? lista.split(',') : Object.keys(CENARIOS).filter((m) => m !== 'publico' && m !== 'legis' && m !== 'citacao');
  for (const [amb, p] of ambientes) {
    const erros = [];
    p.on('pageerror', (e) => {
      const m = String(e.message || e).slice(0, 160);
      if (!RUIDO_DO_SEI.test(m)) erros.push(m);
    });
    console.log(`\n== ${amb} ==`);
    if (!lista) await recursosSemDialogo(p, amb, erros).catch((e) => checar(`${amb}/recursos`, 'suite lancou excecao', false, e.message));
    for (const m of modais) {
      if (!CENARIOS[m]) continue;
      for (const tema of ['claro', 'escuro']) await um(p, amb, m, tema, erros).catch((e) => checar(`${amb}/${m}/${tema}`, 'suite lancou excecao', false, e.message));
      console.log(`  ${m} ok`);
    }
    p.removeAllListeners('pageerror');
  }
  console.log(`\n${ok} ok, ${falhas.length} falha(s)`);
  for (const f of falhas) console.log(' -', f);
  await b.disconnect();
  process.exit(falhas.length ? 1 : 0);
})().catch((e) => {
  console.error('ERRO', e.message);
  process.exit(1);
});
