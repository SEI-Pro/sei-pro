/**
 * Acesso aos dois ambientes de teste.
 *  - SP treinamento (SEI 4.1.5, CK4): login por SEI_SP_USUARIO / SEI_SP_SENHA (conta de teste: memoria
 *    reference_sei_sp_treinamento); orgao `0` (GESP-TREINAMENTO). Processo e documento de teste: SEI_SP_PROCESSO
 *    (padrao 000032/2025) e SEI_SP_DOC (padrao 162824).
 *  - ANTAQ (SEI 5, CK5): o login Microsoft e do AUTOR; o editor `editor_montar` do documento de teste (Despacho-MINUTA
 *    3385255, processo 50300.018905/2018-67) ja deve estar aberto numa aba.
 */
const { pagina, esperar } = require('./lib.cjs');

/** Fecha o modal "Novidades" do SEI (bloqueia todos os cliques). */
async function fecharModalSp(p) {
  await p.keyboard.press('Escape');
  await esperar(1500);
}

/** Garante uma aba do SP logada no Controle de Processos; devolve a pagina. */
async function logarSp(browser) {
  const usuario = process.env.SEI_SP_USUARIO;
  const senha = process.env.SEI_SP_SENHA;
  const p = await pagina(browser, /treinamento\.sei\.sp\.gov\.br/);
  if (!p) throw new Error('Nenhuma aba do SP treinamento aberta no Chrome de teste.');
  await p.bringToFront();
  const semCampoDeLogin = !(await p.$('#txtUsuario'));
  const frameDeLogin = p.frames().some((f) => /login\.php/.test(f.url()));
  if (semCampoDeLogin && /\/sei\/controlador\.php/.test(p.url()) && !frameDeLogin) return p;
  if (!usuario || !senha) throw new Error('Sessao do SP expirada: defina SEI_SP_USUARIO e SEI_SP_SENHA.');
  await p.goto('https://treinamento.sei.sp.gov.br/sei/', { waitUntil: 'domcontentloaded' }).catch(() => {});
  await esperar(3000);
  if (await p.$('#txtUsuario')) {
    await p.evaluate(
      (u, s) => {
        document.querySelector('#txtUsuario').value = u;
        document.querySelectorAll('input[name=pwdSenha], #pwdSenha').forEach((i) => {
          i.value = s;
        });
        const o = document.querySelector('#selOrgao');
        if (o) {
          o.value = '0';
          o.dispatchEvent(new Event('change', { bubbles: true }));
        }
      },
      usuario,
      senha,
    );
    await p.evaluate(() => document.querySelector('#sbmAcessar').click());
    await esperar(8000);
  }
  await fecharModalSp(p);
  return p;
}

/** Abre o documento de teste no editor do SP (clique em "Editar Conteudo"); devolve a aba do editor. */
async function abrirEditorSp(browser) {
  const ja = await pagina(browser, /treinamento\.sei\.sp\.gov\.br.*acao=editor_montar/);
  if (ja) return ja;
  const p = await logarSp(browser);
  const processo = process.env.SEI_SP_PROCESSO || '000032/2025';
  const doc = process.env.SEI_SP_DOC || '162824';
  if (!/procedimento_trabalhar/.test(p.url())) {
    for (const a of await p.$$('a[href*="acao=procedimento_trabalhar"]')) {
      const t = await a.evaluate((x) => x.textContent.trim());
      if (t.includes(processo)) {
        await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}), a.click()]);
        break;
      }
    }
    await esperar(8000);
  }
  const arvore = p.frames().find((f) => f.name() === 'ifrArvore');
  if (!arvore) throw new Error('Arvore do processo nao abriu (a sessao do SP cai com facilidade: tente de novo).');
  await arvore.evaluate((d) => {
    const a = document.getElementById(`anchor${d}`);
    if (a) a.click();
  }, doc);
  await esperar(5000);
  let alvo = null;
  for (const f of p.frames()) {
    const ok = await f
      .evaluate(() => !!Array.from(document.querySelectorAll('a')).find((x) => /editarConteudo/.test(x.getAttribute('onclick') || '')))
      .catch(() => false);
    if (ok) {
      alvo = f;
      break;
    }
  }
  if (!alvo) throw new Error('Link "Editar Conteudo" nao encontrado (o documento de teste foi selecionado?).');
  const novo = browser.waitForTarget((t) => /treinamento\.sei\.sp\.gov\.br.*editor_montar/.test(t.url()), { timeout: 40000 }).catch(() => null);
  await alvo.evaluate(() => Array.from(document.querySelectorAll('a')).find((x) => /editarConteudo/.test(x.getAttribute('onclick') || '')).click());
  if (!(await novo)) throw new Error('O editor do SP nao abriu.');
  await esperar(4000);
  return pagina(browser, /treinamento\.sei\.sp\.gov\.br.*acao=editor_montar/);
}

/** O editor da ANTAQ (se ja estiver aberto); null caso contrario. */
const editorAntaq = (browser) => pagina(browser, /sei\.antaq\.gov\.br.*acao=editor_montar/);

/**
 * Abre o editor do documento de teste da ANTAQ (processo SEI_ANTAQ_PROCESSO, padrao 50300.018905/2018-67; documento
 * SEI_ANTAQ_DOC, padrao 3385255) a partir de uma aba ja LOGADA (login Microsoft do autor): pesquisa rapida do processo,
 * clica o documento na arvore e "Editar Conteudo".
 */
async function abrirEditorAntaq(browser) {
  const ja = await editorAntaq(browser);
  if (ja) return ja;
  const p = await pagina(browser, /sei\.antaq\.gov\.br\/sei\//);
  if (!p) throw new Error('Nenhuma aba logada da ANTAQ (faca o login no Chrome de teste).');
  await p.bringToFront();
  const processo = process.env.SEI_ANTAQ_PROCESSO || '50300.018905/2018-67';
  const doc = process.env.SEI_ANTAQ_DOC || '3385255';
  if (!p.frames().some((f) => f.name() === 'ifrArvore')) {
    const campo = await p.$('#txtPesquisaRapida');
    if (!campo) throw new Error('Pesquisa rapida nao encontrada: abra o Controle de Processos da ANTAQ.');
    await campo.type(processo);
    await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }).catch(() => {}), p.keyboard.press('Enter')]);
    await esperar(8000);
  }
  const arvore = p.frames().find((f) => f.name() === 'ifrArvore');
  if (!arvore) throw new Error('A arvore do processo da ANTAQ nao abriu.');
  await arvore.evaluate((d) => {
    const a = document.getElementById(`anchor${d}`);
    if (a) a.click();
  }, doc);
  await esperar(5000);
  let alvo = null;
  for (const f of p.frames()) {
    const ok = await f
      .evaluate(() => !!Array.from(document.querySelectorAll('a')).find((x) => /editarConteudo/.test(x.getAttribute('onclick') || '')))
      .catch(() => false);
    if (ok) {
      alvo = f;
      break;
    }
  }
  if (!alvo) throw new Error('Link "Editar Conteudo" nao encontrado na ANTAQ.');
  const novo = browser.waitForTarget((t) => /sei\.antaq\.gov\.br.*editor_montar/.test(t.url()), { timeout: 40000 }).catch(() => null);
  await alvo.evaluate(() => Array.from(document.querySelectorAll('a')).find((x) => /editarConteudo/.test(x.getAttribute('onclick') || '')).click());
  if (!(await novo)) throw new Error('O editor da ANTAQ nao abriu.');
  await esperar(4000);
  return editorAntaq(browser);
}

module.exports = { logarSp, abrirEditorSp, editorAntaq, abrirEditorAntaq, fecharModalSp };
