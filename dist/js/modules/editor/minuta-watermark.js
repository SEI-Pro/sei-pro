/**
 * SEI Pro - Editor Feature: minuta-watermark
 *
 * Adiciona uma marca d'agua de "MINUTA" / "MODELO" ao documento. A marca
 * persiste no HTML salvo como um paragrafo com:
 *   - um <span class="minutaAncora"> visivel (ancora/legenda no inicio do texto);
 *   - um <style data-style="seipro-watermark"> que pinta a marca d'agua de fundo
 *     via pseudo-elemento (body:after) na pagina publicada do SEI.
 *
 * Entradas:
 *   - getMinutaWatermark(this_)        -> botao da toolbar. Toggla:
 *       sem marca  -> insere MINUTA;
 *       MINUTA     -> troca para MODELO;
 *       MODELO     -> troca para MINUTA.
 *   - insertMinutaWatermark(_iframe, type, mode) -> insere o paragrafo da marca
 *       no inicio do corpo. type = 'manual' | 'auto'; mode = 'minuta' | 'modelo'.
 *   - insertAutomaticMinutaWatermark() -> chamado no boot por sei-functions-pro.js
 *       (arrayDadosIframeDocumentosPro). Insere a marca automaticamente quando o
 *       nome do documento contem "minuta"; senao remove marcas automaticas.
 *
 * --- Notas de portabilidade CK4 -> CK5 ---
 * O original manipulava o DOM do iframe do CK4 diretamente
 * (iframe.find('body').prepend(htmlMinuta)) e dependia de body:after, que
 * funciona porque no CK4 o editavel E o <body> de um iframe. No CK5 nao ha
 * iframe e o editavel e uma <div class="ck-editor__editable_inline">, entao:
 *   1) A insercao/remocao do paragrafo passa a usar transformBodyHtml (serializa
 *      o corpo, manipula via DOMParser, re-seta) -- uniforme em CK4 e CK5.
 *   2) Ao bloco <style> persistido somamos uma regra .ck-editor__editable_inline::after
 *      espelhando body:after, para que a marca d'agua tambem apareca DURANTE a
 *      edicao no CK5. A regra body:after continua garantindo a marca na pagina
 *      publicada (que renderiza num <body> real, sem .ck-editor__editable_inline).
 *   3) Em vez do iframe.height() para escolher o editor "principal" (boot do CK4),
 *      usamos o root "Corpo do Texto" exposto pelo adapter (getBodyContainer).
 *
 * Helpers compartilhados (NAO movidos -- definidos no monolito /
 * sei-functions-pro.js; usados apenas em tempo de clique/boot):
 *   enableButtonSavePro, dadosProcessoPro, jmespath, getParamsUrlPro.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Util: parse de um fragmento HTML do corpo num documento isolado,
    // aplica fn(body) e devolve o innerHTML resultante (mesmo padrao de
    // sigilo.js / nota-rodape.js -- DOM detached, re-setado pelo adapter).
    // ----------------------------------------------------------------
    function withBodyDoc(html, fn) {
        var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
        var body = doc.body;
        fn(body);
        return body.innerHTML;
    }

    // ----------------------------------------------------------------
    // Resolve o nome do documento atual (para decidir entre MINUTA/MODELO e
    // para a insercao automatica). Defensivo: se algum helper compartilhado
    // nao existir, retorna null.
    // ----------------------------------------------------------------
    function getNomeDocumento() {
        try {
            if (typeof jmespath === 'undefined' || typeof dadosProcessoPro === 'undefined'
                || typeof getParamsUrlPro !== 'function') {
                return null;
            }
            var idDoc = getParamsUrlPro(window.location.href).id_documento;
            return jmespath.search(
                dadosProcessoPro.listDocumentos,
                "[?id_protocolo=='" + idDoc + "'].documento | [0]"
            );
        } catch (e) {
            return null;
        }
    }

    // ----------------------------------------------------------------
    // Monta o HTML do paragrafo da marca d'agua. textMinuta = 'MINUTA' | 'MODELO'.
    // O bloco <style> reproduz o original (body:after para a pagina publicada) e
    // acrescenta .ck-editor__editable_inline::after para o CK5 (marca visivel
    // durante a edicao, ja que la o editavel nao e um <body>).
    // ----------------------------------------------------------------
    function buildMinutaHtml(textMinuta, type) {
        return '<p class="Texto_Alinhado_Esquerda">\n'
            + '   <span contenteditable="false" class="minutaAncora" data-type="' + type + '">\n'
            + '      <a class="ancoraSei" contenteditable="false" style="text-indent:0;">\n'
            + '          <style type="text/css" data-style="seipro-watermark">\n'
            + '              body:after, .ck-editor__editable_inline:after { content: "' + textMinuta + '"; font-size: 9em; color: rgb(167 167 167 / 20%); z-index: 999; display: flex; align-items: center; justify-content: center; position: fixed; transform: rotate(-45deg); top: 0; right: 0; left: 0; bottom: 0; pointer-events: none; user-select: none; font-family: Arial; }\n'
            + '              html.dark-mode .minutaAncora, html.dark-mode .minutaAncora:after { background: #6f7071 !important; color: #f9f9f9 !important; }\n'
            + '              .minutaAncora { text-indent: 0; font-size: .8em; padding: 2px 5px; background: #e4e4e4; border-radius: 5px; font-weight: bold; color:#d45656; margin: 0 5px; }\n'
            + '              body.cke_editable .minutaAncora:after, .ck-editor__editable_inline .minutaAncora:after { content: " [delete isto para remover a marca d\'agua]"; color:#888; font-weight: normal; font-size: .85em; margin: 0 5px; }\n'
            + '              body.cke_editable:after, .ck-editor__editable_inline:after { width: fit-content; margin: 0 33%; overflow: hidden; }\n'
            + '          </style>\n'
            + '          * ' + textMinuta + ' DE DOCUMENTO'
            + '      </a>'
            + '   </span>&nbsp;&nbsp;\n'
            + '</p>\n';
    }

    // ----------------------------------------------------------------
    // Insere o paragrafo da marca d'agua no INICIO do corpo do documento.
    // Assinatura preservada por compat com os call-sites internos do original
    // (_iframe agora e ignorado -- o corpo e resolvido pelo adapter).
    //   type -> 'manual' | 'auto'
    //   mode -> 'minuta' | 'modelo'
    // ----------------------------------------------------------------
    window.insertMinutaWatermark = function (_iframe, type, mode) {
        mode = mode || 'minuta';
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var nomeDocumento = getNomeDocumento();
        var textMinuta = (((nomeDocumento !== null && typeof nomeDocumento === 'string'
            && nomeDocumento.toLowerCase().indexOf('modelo') !== -1)) || mode === 'modelo')
            ? 'MODELO' : 'MINUTA';

        var htmlMinuta = buildMinutaHtml(textMinuta, type);

        // transformBodyHtml NAO deve rodar dentro de model.change (CK5); o
        // adapter cuida do serialize/re-set do corpo de forma uniforme.
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            return htmlMinuta + (html || '');
        });

        if (typeof enableButtonSavePro === 'function') enableButtonSavePro();
    };

    // ----------------------------------------------------------------
    // Botao da toolbar: toggla a marca d'agua (sem marca -> MINUTA;
    // MINUTA -> MODELO; MODELO -> MINUTA).
    // ----------------------------------------------------------------
    window.getMinutaWatermark = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var $ancora = SeiProEditorAdapter.findInBody(editor, '.minutaAncora');
        var existe = $ancora && $ancora.length;

        if (!existe) {
            window.insertMinutaWatermark(null, 'manual');
        } else {
            var textoAtual = ($ancora.text && $ancora.text()) || '';
            var proximoModo = (textoAtual.indexOf('MINUTA') !== -1) ? 'modelo' : 'minuta';
            // Remove o paragrafo da ancora atual e re-insere com o modo trocado.
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return withBodyDoc(html, function (body) {
                    body.querySelectorAll('.minutaAncora').forEach(function (sp) {
                        var p = sp.closest ? sp.closest('p') : null;
                        if (p && p.parentNode) p.parentNode.removeChild(p);
                        else if (sp.parentNode) sp.parentNode.removeChild(sp);
                    });
                });
            });
            window.insertMinutaWatermark(null, 'manual', proximoModo);

            // Pisca e rola ate a nova ancora (DOM ao vivo no editavel). Adiado
            // para depois do CK5 reconciliar a view apos transformBodyHtml.
            setTimeout(function () {
                var $nova = SeiProEditorAdapter.findInBody(editor, '.minutaAncora');
                if ($nova && $nova.length) {
                    if ($nova.fadeOut) {
                        $nova.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                    }
                    var el = $nova.get ? $nova.get(0) : null;
                    if (el && el.scrollIntoView) el.scrollIntoView();
                }
            }, 0);
        }
    };

    // ----------------------------------------------------------------
    // Insercao automatica no boot (chamada por sei-functions-pro.js). Se o nome
    // do documento contem "minuta" e ainda nao ha marca, insere com type='auto';
    // caso contrario, remove eventuais marcas automaticas.
    // ----------------------------------------------------------------
    window.insertAutomaticMinutaWatermark = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var nomeDocumento = getNomeDocumento();
        var ehMinuta = (nomeDocumento !== null && typeof nomeDocumento === 'string'
            && nomeDocumento.toLowerCase().indexOf('minuta') !== -1);

        if (ehMinuta) {
            var $ancora = SeiProEditorAdapter.findInBody(editor, '.minutaAncora');
            if (!$ancora || !$ancora.length) {
                window.insertMinutaWatermark(null, 'auto');
            }
        } else {
            // Remove apenas as marcas inseridas automaticamente.
            var $auto = SeiProEditorAdapter.findInBody(editor, '.minutaAncora[data-type="auto"]');
            if ($auto && $auto.length) {
                SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                    return withBodyDoc(html, function (body) {
                        body.querySelectorAll('.minutaAncora[data-type="auto"]').forEach(function (sp) {
                            var p = sp.closest ? sp.closest('p') : null;
                            if (p && p.parentNode) p.parentNode.removeChild(p);
                            else if (sp.parentNode) sp.parentNode.removeChild(sp);
                        });
                    });
                });
            }
        }
    };

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'minuta-watermark' });
})();
