/** Utilitarios do harness ao vivo: conexao CDP com o Chrome de teste (porta 9444) e busca de abas. */
const puppeteer = require('puppeteer-core');
const path = require('node:path');

exports.puppeteer = puppeteer;
exports.PORTA = Number(process.env.SPRO_PORTA || 9444);
exports.DIST = path.resolve(__dirname, '..', '..', 'dist');
exports.esperar = (ms) => new Promise((r) => setTimeout(r, ms));

exports.conectar = () =>
  puppeteer.connect({ browserURL: `http://127.0.0.1:${exports.PORTA}`, defaultViewport: null, protocolTimeout: 180000 });

/** Primeira aba cuja URL casa com `re` (ou null). Aceita os dialogos nativos para nao travar a aba. */
exports.pagina = async (browser, re) => {
  const alvo = browser.targets().filter((t) => t.type() === 'page').find((t) => re.test(t.url()));
  if (!alvo) return null;
  const p = await alvo.page();
  p.on('dialog', async (d) => {
    try {
      await d.accept();
    } catch (e) {
      /* o dialogo ja foi tratado */
    }
  });
  return p;
};

/** Os dois editores de teste: SP (CK4) e ANTAQ (CK5). */
exports.AMBIENTES = [
  { rotulo: 'SP/CK4', re: /treinamento\.sei\.sp\.gov\.br.*acao=editor_montar/ },
  { rotulo: 'ANTAQ/CK5', re: /sei\.antaq\.gov\.br.*acao=editor_montar/ },
];
