/**
 * Cenario unificado CK4 / CK5 para validar recursos ao vivo. `rodarEm(pagina, fn, ...args)` injeta `window.__spro`
 * (mesma API nos dois editores) e executa `fn(__spro, ...args)` DENTRO da pagina.
 *
 *   __spro.versao                       4 ou 5
 *   __spro.corpo()                      elemento do corpo (CK4: body do iframe; CK5: a editavel "Corpo do Texto")
 *   __spro.botao()                      elemento para passar como `this_` aos globais (dentro do wrapper do corpo)
 *   __spro.definirHtml(html)            substitui o corpo (async)
 *   __spro.obterHtml()                  HTML do corpo como o SEI o gravaria
 *   __spro.cursorEm(seletor)            cursor no INICIO do elemento do corpo (async)
 *   __spro.selecionarTexto(seletor)     seleciona o conteudo do elemento (async)
 *   __spro.desfazer()                   Ctrl+Z (async)
 *   __spro.espera(ms)
 *
 * Licoes embutidas: no CK5 o cursor do model fica na raiz FOCADA (a editavel do corpo precisa de `focus()` antes da selecao
 * nativa); no CK4 a selecao e feita pelo CKEDITOR.
 */
function definir() {
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));
  const S = { espera };
  const ck4 = !!(window.CKEDITOR && window.CKEDITOR.instances && Object.keys(window.CKEDITOR.instances).length);
  if (ck4) {
    const nome = Object.keys(window.CKEDITOR.instances).find((k) => /Corpo/.test(window.CKEDITOR.instances[k].config.title));
    const ed = window.CKEDITOR.instances[nome];
    S.versao = 4;
    S.nome = nome;
    S.ed = ed;
    S.corpo = () => ed.document.getBody().$;
    S.botao = () => document.querySelector(`#cke_${nome} .cke_toolbox`) || document.body;
    S.obterHtml = () => ed.getData();
    // `editable().setHtml` (e nao `setData`): o setData do CK4 REESCREVE o documento do iframe e some com os handlers que o
    // monolito liga no corpo (mousedown do balao de link etc.).
    S.definirHtml = async (h) => {
      ed.focus();
      ed.editable().setHtml(h);
      await espera(500);
    };
    S.cursorEm = async (sel) => {
      ed.focus();
      const el = new window.CKEDITOR.dom.element(S.corpo().querySelector(sel));
      const r = ed.createRange();
      r.moveToElementEditStart(el);
      ed.getSelection().selectRanges([r]);
      await espera(300);
    };
    S.selecionarTexto = async (sel) => {
      ed.focus();
      const el = new window.CKEDITOR.dom.element(S.corpo().querySelector(sel));
      const r = ed.createRange();
      r.selectNodeContents(el);
      ed.getSelection().selectRanges([r]);
      await espera(300);
    };
    S.desfazer = async () => {
      ed.execCommand('undo');
      await espera(300);
    };
  } else {
    const el = document.querySelector('.ck-editor__editable_inline[aria-label="Corpo do Texto"]');
    const ed = el.ckeditorInstance;
    const cfg = window.INFRA_EDITOR_CONFIG.rootsAttributes;
    const raiz = Object.keys(cfg).find((k) => cfg[k].principal);
    S.versao = 5;
    S.ed = ed;
    S.raiz = raiz;
    S.corpo = () => el;
    S.botao = () => el;
    S.obterHtml = () => ed.data.get({ rootName: raiz });
    S.definirHtml = async (h) => {
      ed.data.set({ [raiz]: h });
      await espera(500);
    };
    const nativa = (sel, selecionarTudo) => {
      el.focus();
      const alvo = el.querySelector(sel);
      const r = document.createRange();
      if (selecionarTudo) r.selectNodeContents(alvo);
      else {
        r.setStart(alvo.firstChild || alvo, 0);
        r.collapse(true);
      }
      const s = window.getSelection();
      s.removeAllRanges();
      s.addRange(r);
    };
    S.cursorEm = async (sel) => {
      nativa(sel, false);
      await espera(500);
    };
    S.selecionarTexto = async (sel) => {
      nativa(sel, true);
      await espera(500);
    };
    S.desfazer = async () => {
      ed.execute('undo');
      await espera(300);
    };
  }
  window.__spro = S;
  return S.versao;
}

/** Injeta o cenario e roda `fn(...args)` na pagina; `fn` usa `window.__spro` (e so pode referenciar o que recebe em `args`). */
async function rodarEm(pagina, fn, ...args) {
  await pagina.bringToFront(); // o foco do CK4 (CKEDITOR.currentInstance) depende de a aba/janela estar em primeiro plano
  await pagina.evaluate(definir);
  return pagina.evaluate(fn, ...args);
}

module.exports = { rodarEm, definir };
