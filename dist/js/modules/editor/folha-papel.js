/**
 * SEI Pro - Editor feature: folha-papel
 *
 * Botao que liga/desliga a visualizacao do texto no editor como uma folha de papel:
 * largura contida (940px, a mesma do documento na visualizacao), fundo branco, bordas
 * arredondadas e sombra, sobre o fundo da pagina. E so apresentacao: nao altera o
 * conteudo do documento nem o que e salvo.
 *
 * - CK4: cada secao do documento e um iframe de altura fixa, empilhados num mesmo contentor.
 *   O desenho fica POR FORA dos iframes (nos .cke_contents, que viram pedacos da mesma folha:
 *   o primeiro leva o topo arredondado, o ultimo a base), para nao mexer na altura do texto.
 * - CK5: o texto e o proprio elemento editavel da pagina.
 * O estilo fica no <head> da pagina e so vale com o atributo data-spro-folha-editor no <html>.
 *
 * A escolha persiste em localStorage ('spro_editor_folha').
 *
 * Handlers globais: getPaperViewButtom(this_) (bind em setClickButtons via
 * .getPaperViewButtom), aplicarFolhaEditorPro(ligada), initFolhaEditorPro().
 */
(function () {
    'use strict';

    var CHAVE = 'spro_editor_folha';
    var ID_ESTILO = 'seipro-folha-editor';
    var ATRIBUTO = 'data-spro-folha-editor';

    function ligada() {
        try { return !!localStorage.getItem(CHAVE); } catch (e) { return false; }
    }
    function modoEscuro() {
        try { return !!localStorage.getItem('darkModePro'); } catch (e) { return false; }
    }

    // CSS da pagina. Folha de 940px (828 de texto + 2 x 56 de margem, mesma largura da visualizacao).
    function cssPagina(escuro) {
        var a = 'html[' + ATRIBUTO + ']';
        var mesa = escuro ? '#141619' : '#f3f4f7';
        var borda = escuro ? '#2a2d33' : '#e3e6ee';
        var sombra = 'rgba(20, 25, 50, .13)';
        var lados = '14px 0 24px -14px ' + sombra + ', -14px 0 24px -14px ' + sombra;
        var base = '0 14px 24px -14px ' + sombra;
        var c = a + ' .cke_contents[data-spro-folha]';
        return ''
            // mesa
            + a + ' #divEditores, ' + a + ' .cke_inner, ' + a + ' .cke { background-color: ' + mesa + ' !important; }\n'
            + a + ' #divEditores { padding-bottom: 28px; }\n'
            // CK4: cada .cke_contents e um pedaco da folha
            + c + ' { max-width: 828px; margin: 0 auto; padding: 0 56px; background-color: #ffffff !important;'
            + ' border: 0 solid ' + borda + '; border-width: 0 1px; box-shadow: ' + lados + '; clip-path: inset(0 -30px); }\n'
            + c + '[data-spro-folha~="primeira"] { margin-top: 24px; padding-top: 40px; border-top-width: 1px; border-radius: 12px 12px 0 0; }\n'
            + c + '[data-spro-folha~="ultima"] { padding-bottom: 40px; border-bottom-width: 1px; border-radius: 0 0 12px 12px;'
            + ' box-shadow: ' + lados + ', ' + base + '; clip-path: inset(0 -30px -30px); }\n'
            + c + '[data-spro-folha~="primeira"][data-spro-folha~="ultima"] { border-radius: 12px; }\n'
            + '@media (max-width: 1000px) { ' + c + ' { padding-left: 20px; padding-right: 20px; } }\n'
            // CK5
            + a + ' .ck-editor__main { background-color: ' + mesa + '; padding: 28px 12px; }\n'
            + a + ' .ck-editor__editable.ck-content { box-sizing: border-box; max-width: 940px; margin: 0 auto !important;'
            + ' padding: 40px 56px !important; background-color: #ffffff !important;'
            + ' border: 1px solid ' + borda + ' !important; border-radius: 12px !important; box-shadow: 0 1px 2px rgba(20, 25, 50, .08), 0 8px 28px rgba(20, 25, 50, .12) !important; }\n';
    }

    // Marca primeira/ultima secao (CK4) para o CSS fechar a folha.
    function marcarSecoes(on) {
        var itens = document.querySelectorAll('.cke_contents');
        for (var i = 0; i < itens.length; i++) {
            if (!on) { itens[i].removeAttribute('data-spro-folha'); continue; }
            var papel = [];
            if (i === 0) papel.push('primeira');
            if (i === itens.length - 1) papel.push('ultima');
            itens[i].setAttribute('data-spro-folha', papel.join(' ') || 'meio');
        }
    }

    function injetarEstilo(doc, css) {
        if (!doc || !doc.head) return;
        var antigo = doc.querySelector('style[data-style="' + ID_ESTILO + '"]');
        if (antigo && antigo.parentNode) antigo.parentNode.removeChild(antigo);
        if (!css) return;
        var el = doc.createElement('style');
        el.setAttribute('data-style', ID_ESTILO);
        el.textContent = css;
        doc.head.appendChild(el);
    }

    // Dentro do iframe do CK4 so a cor: o fundo do texto fica branco, inclusive nas secoes somente leitura
    // (contenteditable=false), que o SEI/tema pinta de cinza com regra propria. Por isso o branco vai por
    // seletor de alta especificidade E por estilo inline !important (so ele vence regra !important alheia).
    // Nada de margem/padding aqui: a altura do iframe e fixa e o texto seria cortado.
    var CSS_BRANCO = 'html:root, html:root body, html:root body.cke_editable.cke_editable.cke_editable,'
        + ' html:root body[contenteditable] { background-color: #ffffff !important; background-image: none !important; }\n';
    function fundoInline(el, on) {
        if (!el || !el.style) return;
        if (on) {
            if (el.getAttribute('data-spro-folha-bg') === null) {
                el.setAttribute('data-spro-folha-bg', el.style.getPropertyValue('background-color') + '|' + el.style.getPropertyPriority('background-color'));
            }
            el.style.setProperty('background-color', '#ffffff', 'important');
        } else if (el.getAttribute('data-spro-folha-bg') !== null) {
            var antes = el.getAttribute('data-spro-folha-bg').split('|');
            el.removeAttribute('data-spro-folha-bg');
            el.style.removeProperty('background-color');
            if (antes[0]) el.style.setProperty('background-color', antes[0], antes[1] || '');
        }
    }
    function aplicarNosIframes(on) {
        var lista = (typeof getIframesEditorPro === 'function') ? getIframesEditorPro() : $('iframe.cke_wysiwyg_frame');
        $(lista).each(function () {
            var doc = this.contentDocument;
            if (!doc || !doc.head) return;
            injetarEstilo(doc, on ? CSS_BRANCO : '');
            fundoInline(doc.documentElement, on);
            fundoInline(doc.body, on);
        });
    }

    window.aplicarFolhaEditorPro = function (on) {
        injetarEstilo(document, on ? cssPagina(modoEscuro()) : '');
        aplicarNosIframes(on);
        marcarSecoes(on);
        if (on) { document.documentElement.setAttribute(ATRIBUTO, ''); }
        else { document.documentElement.removeAttribute(ATRIBUTO); }
        $('.getPaperViewButtom')
            .toggleClass('cke_button_on', !!on)
            .toggleClass('cke_button_off', !on)
            .attr('aria-pressed', on ? 'true' : 'false');
    };

    window.getPaperViewButtom = function () {
        var on = !ligada();
        try {
            if (on) localStorage.setItem(CHAVE, '1'); else localStorage.removeItem(CHAVE);
        } catch (e) { /* sem storage: vale so nesta sessao */ }
        aplicarFolhaEditorPro(on);
    };

    // Boot: reaplica o estado salvo.
    window.initFolhaEditorPro = function () {
        // O iframe do CK4 e recriado em certas trocas (codigo-fonte etc.): reaplica o branco.
        if (typeof CKEDITOR !== 'undefined' && CKEDITOR.on && !initFolhaEditorPro._ck4) {
            initFolhaEditorPro._ck4 = true;
            var religar = function (editor) {
                editor.on('contentDom', function () { if (ligada()) aplicarNosIframes(true); });
            };
            Object.keys(CKEDITOR.instances || {}).forEach(function (n) { religar(CKEDITOR.instances[n]); });
            CKEDITOR.on('instanceReady', function (e) { religar(e.editor); });
        }
        aplicarFolhaEditorPro(ligada());
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'folha-papel' });
    }
})();
