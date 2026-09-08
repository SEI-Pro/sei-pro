/**
 * SEI Pro - Feature: review
 *
 * Revisao de texto / controle de alteracoes (track changes) e comentarios no
 * editor. Entradas (botoes da toolbar):
 *   - getBoxReview     -> liga/desliga o modo de revisao (rastreio de
 *                         alteracoes ao digitar) e instala o key handler.
 *   - getBoxCtrReview  -> abre o dialogo "Gerenciar Revisoes" (lista todas as
 *                         marcas, aceita/rejeita em massa ou individualmente).
 *   - getDialogReview  -> no-op (o dialogo CK4 virou jQuery UI on-demand).
 *
 * Marcas de revisao sao spans .reviewSeiPro com data-review (add|delete),
 * data-id-review, data-user-review, data-date-review e (opcional) data-comment.
 * Ao passar o mouse por uma marca (setOnBodyActs, no monolito) abre-se um
 * popover (showReviewTips) com acoes Aceitar / Rejeitar e edicao de comentario.
 *
 * Portado de CKEditor 4 (SEI 3.1/4) para CKEditor 5 (SEI 5) via
 * window.SeiProEditorAdapter. As funcoes globais mantem os MESMOS nomes que o
 * monolito usa em setOnBodyActs (showReviewTips/hideReviewTips), em
 * setClickButtons (getBoxReview/getBoxCtrReview), nos onclick dos popovers
 * (scroolToReview/removeReviewPro/addCommentReviewPro) e em initFunctions
 * (getDialogReview).
 *
 * --- Notas de portabilidade CK4 -> CK5 ---
 * 1) showReviewTips / hideReviewTips / scroolToReview / removeReviewPro /
 *    addCommentReviewPro / contentDialogReview foram reescritos sobre o adapter
 *    (getBodyContainer / findInBody / transformBodyHtml / withEdit), logo
 *    funcionam tanto em CK4 (iframe) quanto em CK5 (editable inline).
 * 2) O dialogo CK4 ('ReviewSEI' via CKEDITOR.dialog.add) foi substituido por
 *    SeiProEditorAdapter.openDialog (jQuery UI on-demand). getDialogReview
 *    virou no-op; getBoxCtrReview abre o dialogo direto.
 * 3) setStyleReview: a inserciao por insertHtml funciona nas duas versoes; o
 *    modo 'change' (que usava CKEDITOR.style + editor.applyStyle) so e viavel
 *    no CK4 -- no CK5 e degradado para insercao do texto selecionado dentro de
 *    uma marca via insertHtml.
 * 4) PARCIAL: getStyleReview (rastreio de alteracoes ao digitar) depende de
 *    APIs cruas do CK4 (editor.getSelection().getRanges(), CKEDITOR.dom.walker,
 *    editor.createRange()/editable(), sel.selectRanges, evt.data.keyCode). Nao
 *    ha equivalente per-keystroke pelo adapter no CK5. Mantemos o caminho CK4
 *    funcional (quando version===4 e a selecao crua existe) e, no CK5, o
 *    handler so engata as operacoes que o adapter cobre (selecao nao-colapsada
 *    => marca delete+add), avisando que o rastreio fino fica indisponivel.
 *    setListElementsSelected / setPositionCursor / getCharOnCursor sao helpers
 *    exclusivos desse caminho CK4 e por isso vivem aqui.
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js,
 * chamados apenas em tempo de clique/boot): getOptionsPro, randomString,
 * moment, alertaBoxPro. O global oEditor (CK4) tambem e do monolito.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Util: parse de um fragmento HTML do corpo num documento isolado,
    // aplica fn(body) e devolve o innerHTML resultante (mesmo padrao de
    // sigilo.js / nota-rodape.js). Usado pelas operacoes em massa.
    // ----------------------------------------------------------------
    function withBodyDoc(html, fn) {
        var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
        var body = doc.body;
        fn(body);
        return body.innerHTML;
    }

    // Corpo do documento como elemento jQuery (iframe body no CK4, editable
    // inline no CK5) -- ou jQuery vazio.
    function bodyContainer$(editor) {
        var body = SeiProEditorAdapter.getBodyContainer(editor);
        return (body && window.$) ? $(body) : (window.$ ? $() : null);
    }

    // Acesso seguro a helpers globais compartilhados.
    function currentUser() {
        return (typeof getOptionsPro === 'function' && getOptionsPro('usuarioSistema'))
            ? getOptionsPro('usuarioSistema') : '';
    }
    function nowStamp() {
        return (typeof moment === 'function') ? moment().format('DD/MM/YYYY HH:mm') : new Date().toLocaleString();
    }
    function randRef(n) {
        return (typeof randomString === 'function') ? randomString(n || 8) : Math.random().toString(36).slice(2, 2 + (n || 8));
    }

    // ----------------------------------------------------------------
    // INSERE marca de revisao na selecao/posicao do cursor.
    //   type  -> 'add' | 'delete'
    //   mode  -> 'insert' (default) | 'change'
    //   text  -> conteudo textual da marca (no modo insert)
    //   addSp -> acrescenta um espaco-marcador apos a marca
    //   pClass-> quando informado, envolve a marca num <p class="...">
    // ----------------------------------------------------------------
    window.setStyleReview = function (type, mode, text, addSp, pClass) {
        type = type || 'add';
        mode = mode || 'insert';
        text = (typeof text === 'undefined') ? '' : text;
        addSp = (typeof addSp === 'undefined') ? false : addSp;
        pClass = (typeof pClass === 'undefined') ? false : pClass;

        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var userReview = currentUser();
        var dateReview = nowStamp();
        var reviewRef = randRef(8);

        if (mode === 'change') {
            // Caminho CK4: aplica estilo de span + u/s sobre a selecao.
            // No CK5 nao ha applyStyle de classe equivalente; degradamos
            // envolvendo o HTML selecionado numa marca via insertHtml.
            if (SeiProEditorAdapter.version === 4 && typeof CKEDITOR !== 'undefined' && oEditorAvailable()) {
                var styleBgColor = new CKEDITOR.style({
                    element: 'span',
                    attributes: {
                        'data-review': type,
                        'data-user-review': userReview,
                        'data-date-review': dateReview,
                        'data-id-review': reviewRef,
                        'class': 'reviewSeiPro',
                        'style': (type === 'add') ? 'background-color: #F0F8FF' : 'background-color: #FFF0F5'
                    }
                });
                var styleTxtColor = new CKEDITOR.style({
                    element: (type === 'add') ? 'u' : 's',
                    attributes: {
                        'data-review': type,
                        'data-user-review': userReview,
                        'data-date-review': dateReview,
                        'data-id-review': reviewRef,
                        'class': 'reviewSeiPro',
                        'style': (type === 'add') ? 'color:#0000FF' : 'color:#FF0000'
                    }
                });
                oEditor.applyStyle(styleBgColor);
                oEditor.applyStyle(styleTxtColor);
                return;
            }
            // Fallback CK5: marca o texto selecionado (se houver).
            var sel = SeiProEditorAdapter.getSelectedHtml(editor) || '';
            var inner = sel ||
                '<' + (type === 'add' ? 'u' : 's') + ' style="color:' + (type === 'add' ? '#0000FF' : '#FF0000') + ';"></' + (type === 'add' ? 'u' : 's') + '>';
            var htmlChange = '<span data-review="' + type + '" class="reviewSeiPro" data-id-review="' + reviewRef + '" data-date-review="' + dateReview + '" data-user-review="' + userReview + '" style="background-color:' + (type === 'add' ? '#F0F8FF' : '#FFF0F5') + ';">' + inner + '</span>';
            SeiProEditorAdapter.withEdit(editor, function () {
                SeiProEditorAdapter.insertHtml(editor, htmlChange);
            });
            return;
        }

        // mode === 'insert'
        var inserHtml = '<span data-review="' + type + '" class="reviewSeiPro" data-id-review="' + reviewRef + '" data-date-review="' + dateReview + '" data-user-review="' + userReview + '" style="background-color:' + (type === 'add' ? '#F0F8FF' : '#FFF0F5') + ';"><' + (type === 'add' ? 'u' : 's') + ' style="color:' + (type === 'add' ? '#0000FF' : '#FF0000') + ';">' + text + '</' + (type === 'add' ? 'u' : 's') + '></span>' + (addSp ? '<span class="reviewSP">&nbsp;</span> ' : '');
        SeiProEditorAdapter.withEdit(editor, function () {
            if (pClass) {
                SeiProEditorAdapter.insertHtml(editor, '<p class="' + pClass + '">' + inserHtml + '</p> ');
            } else {
                SeiProEditorAdapter.insertHtml(editor, inserHtml);
            }
        });
    };

    // True quando o global oEditor (CK4) esta disponivel.
    function oEditorAvailable() {
        return typeof window.oEditor !== 'undefined' && window.oEditor;
    }

    // ----------------------------------------------------------------
    // Popover (tip) sobre uma marca de revisao. Espelha showLinkTips.
    // No CK4 setOnBodyActs passa o iframeDoc (jQuery contents()); usamos ele.
    // Em CK5 (ou sem argumento) derivamos o corpo do texto pelo adapter.
    // ----------------------------------------------------------------
    function resolveReviewDoc(iframeDoc) {
        if (iframeDoc && iframeDoc.find) return iframeDoc;
        var editor = SeiProEditorAdapter.getInstance();
        var body = editor ? SeiProEditorAdapter.getBodyContainer(editor) : null;
        return (body && window.$) ? $(body) : null;
    }

    window.showReviewTips = function (this_, iframeDoc) {
        var doc = resolveReviewDoc(iframeDoc);
        if (doc) doc.find('.reviewDisplayPro').remove();

        var elem = $(this_).closest('span');
        var userReview = elem.attr('data-user-review');
        userReview = $('<div/>').text(userReview).html();
        var dateReview = elem.attr('data-date-review');
        dateReview = $('<div/>').text(dateReview).html();
        var typeReview = elem.attr('data-review');
        var idReview = elem.attr('data-id-review');
        var commentReview = elem.attr('data-comment');
        commentReview = (typeof commentReview === 'undefined') ? '' : $('<div/>').text(commentReview).html();

        var html = getHtmlReviewDisplayPro({
            date: dateReview,
            id_review: idReview,
            type: typeReview,
            user: userReview,
            comment: commentReview,
            text: false
        });

        elem.prepend(html);

        var boxDisplayLink = elem.find('.reviewDisplayPro');
        if (!boxDisplayLink.length || !boxDisplayLink.offset()) return;
        var boxDisplayLink_left = boxDisplayLink.offset().left;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = $(window).width();
        var margin = (boxDisplayLink_left + boxDisplayLink_width > windowWidth)
            ? windowWidth - (boxDisplayLink_left + boxDisplayLink_width + 45)
            : 0;
        boxDisplayLink.css('margin-left', margin);
    };

    window.hideReviewTips = function (iframeDoc) {
        var doc = resolveReviewDoc(iframeDoc);
        if (!doc) return;
        if (doc.find('.reviewDisplayPro:hover').length == 0) {
            doc.find('.reviewDisplayPro').remove();
        }
    };

    // ----------------------------------------------------------------
    // Rola a area de edicao ate a marca de revisao indicada.
    // CK4: container #divEditores (scroll do iframe via offset). CK5: usa o
    // elemento real no editable inline + scrollIntoView.
    // ----------------------------------------------------------------
    window.scroolToReview = function (idReview) {
        // Caminho CK4 (iframe): mantem o comportamento original com #divEditores.
        if (window.$ && $('iframe.cke_wysiwyg_frame').length) {
            $('iframe.cke_wysiwyg_frame').each(function () {
                var iframe_ = $(this).contents();
                if (iframe_.find('body').attr('contenteditable') == 'true') {
                    var container = $('#divEditores');
                    var element = iframe_.find('.reviewSeiPro[data-id-review="' + idReview + '"]').closest('p');
                    if (element.length && element.offset()) {
                        var position = element.offset().top + 200;
                        container.animate({ scrollTop: position });
                    }
                    return false;
                }
            });
            return;
        }
        // Caminho CK5 (editable inline): usa scrollIntoView no elemento real.
        var editor = SeiProEditorAdapter.getInstance();
        var $el = SeiProEditorAdapter.findInBody(editor, '.reviewSeiPro[data-id-review="' + idReview + '"]');
        if ($el && $el.length && $el[0].scrollIntoView) {
            $el[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // ----------------------------------------------------------------
    // Builder do popover/cartao de uma marca de revisao (HTML puro).
    //   data.text -> texto da marca para o cabecalho (modo readonly)
    //   data.html -> trecho do paragrafo com a marca destacada (lista do dialogo)
    //   readonly  -> true no dialogo de gerenciamento (sem editar comentario)
    // ----------------------------------------------------------------
    window.getHtmlReviewDisplayPro = function (data, readonly) {
        readonly = (typeof readonly === 'undefined') ? false : readonly;
        var textCommentReview = (data.comment == '') ? 'Adicionar coment\u00E1rio' : data.comment;
        textCommentReview = (data.comment == '' && readonly) ? 'Nenhum coment\u00E1rio' : textCommentReview;
        var html = '<div class="reviewDisplayPro" unselectable="on">' +
            '    <span contenteditable="false">' +
            (data.text
                ? '<span style="margin:5px;display:block;"><span style="background-color:' + (data.type == 'add' ? '#F0F8FF' : '#FFF0F5') + ';"><' + (data.type == 'add' ? 'u' : 's') + ' style="color:' + (data.type == 'add' ? '#0000FF' : '#FF0000') + ';">' + data.text + '</' + (data.type == 'add' ? 'u' : 's') + '></span></span>'
                : ''
            ) +
            (data.html
                ? '<div onmouseover="return infraTooltipMostrar(\'Clique para rolar at\u00E9 o texto\');" onmouseout="return infraTooltipOcultar();" class="textReview" onclick="scroolToReview(\'' + data.id_review + '\')">' + data.html + '</div>'
                : ''
            ) +
            '        <span style="color: #777;font-size: 90%;margin-left:5px;"><i class="fas fa-user" style="padding-right: 5px;font-size: 90%;color: #4285f4;"></i><span class="info"></span><strong class="title-reviewtip" title="' + data.user + '">' + data.user + '</strong></span>' +
            '        <span style="color: #777;font-size: 80%;margin-left:10px;font-style: italic;"><i class="far fa-clock" style="color: #777;"></i> ' + data.date + '</span>' +
            '        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #9CB639;" onclick="parent.removeReviewPro(this)" data-readonly="' + readonly + '" data-id-review="' + data.id_review + '" data-mode="accept" data-type="' + data.type + '" title="Aceitar revis\u00E7\u00E3o"><i class="fas fa-check-circle" style="color: #9CB639;"></i> Aceitar</span>' +
            '        <span class="action" style="float: right;font-size: 80%;margin-left:10px;cursor:pointer;color: #E46E64;" onclick="parent.removeReviewPro(this)" data-readonly="' + readonly + '" data-id-review="' + data.id_review + '" data-mode="reject" data-type="' + data.type + '" title="Rejeitar revis\u00E7\u00E3o"><i class="fas fa-times-circle" style="color: #E46E64;"></i> Rejeitar</span>' +
            (currentUser() == data.user && !readonly
                ? '        <span onclick="parent.addCommentReviewPro(this)" data-info="' + (data.comment == '' ? 'new' : 'update') + '" style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info" style="padding: 3px;">' + textCommentReview + '<span></span>'
                : (data.comment == '' && !readonly ? '' : '<span style="color: #777;font-size: 90%;display:block;font-style: italic;margin: 10px 0 5px 0;padding: 5px;border-radius:5px;"><i class="fas fa-comment" style="margin-right: 5px;font-size: 90%;color: #e9af68;transform: scale(-1, 1);"></i><span class="commentReview info">' + textCommentReview + '<span></span>')
            ) +
            '    </span>' +
            '</div>';
        return html;
    };

    // ----------------------------------------------------------------
    // Edita o comentario de uma marca de revisao (no popover do autor).
    // Mantem o data-comment / data-date-review no span da marca.
    // ----------------------------------------------------------------
    window.addCommentReviewPro = function (this_) {
        var _this = $(this_);
        var _info = _this.find('.commentReview');

        if (_this.attr('data-info') == 'new') _info.html('');
        _info.prop('contenteditable', true).focus().on('keydown', function () {
            setTimeout(function () {
                var text = _info.text().trim();
                if (text != '') {
                    _this.attr('data-info', 'update');
                    _this.closest('.reviewSeiPro')
                        .attr('data-comment', text.replace(/(\r\n|\n|\r)/gm, ' '))
                        .attr('data-date-review', nowStamp());
                } else {
                    _this.attr('data-info', 'new');
                    _this.closest('.reviewSeiPro').removeAttr('data-comment');
                }
            }, 100);
        });
    };

    // ----------------------------------------------------------------
    // Aceita/rejeita revisoes (uma ou todas). Roteia para setRemoveReviewPro
    // dentro de um passo de edicao do adapter (undo agrupado / saveSnapshot).
    // ----------------------------------------------------------------
    window.removeReviewPro = function (this_) {
        var _this = $(this_);
        var _data = _this.data();
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.withEdit(editor, function () {
            setRemoveReviewPro(_this, editor, _data);
        });
    };

    // ----------------------------------------------------------------
    // Executa a aceitacao/rejeicao no corpo do documento. Reescrito sobre
    // findInBody/transformBodyHtml (CK4/CK5). _ref e o segundo argumento;
    // mantemos a assinatura (this, ref, data) por compat -- aqui ref e o
    // editor (vindo de removeReviewPro) e usamos o adapter para localizar/
    // alterar as marcas.
    //   accept add    -> remove o span mantendo o texto (alteracao confirmada)
    //   accept delete -> remove o span e o texto (exclusao confirmada)
    //   reject add    -> remove o span e o texto (alteracao descartada)
    //   reject delete -> remove o span mantendo o texto (exclusao descartada)
    // ----------------------------------------------------------------
    window.setRemoveReviewPro = function (_this, editor, _data) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;

        // Remove qualquer popover aberto no corpo antes de mexer no DOM.
        var $body = bodyContainer$(editor);
        if ($body && $body.length) $body.find('.reviewDisplayPro').remove();

        var mode = _data.mode;
        var idReview = _data.idReview;
        var type = _data.type;

        if (mode == 'acceptAll' || mode == 'rejectAll') {
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return withBodyDoc(html, function (body) {
                    body.querySelectorAll('.reviewDisplayPro').forEach(function (d) {
                        if (d.parentNode) d.parentNode.removeChild(d);
                    });
                    body.querySelectorAll('.reviewSeiPro').forEach(function (rv) {
                        var rType = rv.getAttribute('data-review');
                        if (mode == 'acceptAll') {
                            if (rType == 'add') {
                                removePrevReviewSp(rv);
                                replaceWithText(rv);
                            } else if (rType == 'delete') {
                                if (rv.parentNode) rv.parentNode.removeChild(rv);
                            }
                        } else { // rejectAll
                            if (rType == 'add') {
                                removePrevReviewSp(rv);
                                if (rv.parentNode) rv.parentNode.removeChild(rv);
                            } else if (rType == 'delete') {
                                replaceWithText(rv);
                            }
                        }
                    });
                });
            });
            // Feedback no dialogo de gerenciamento.
            setTimeout(function () {
                contentDialogReview('<span style="font-size: 12pt;"><i class="fas fa-check verdeColor" style="margin-right: 5px;"></i>Revis\u00F5es realizadas com sucesso</span>');
                setTimeout(function () {
                    var $box = $('#boxReviews').closest('.ui-dialog-content');
                    if ($box && $box.length) { try { $box.dialog('close'); } catch (e) {} }
                }, 3000);
            }, 500);
            return;
        }

        // Acao individual (accept/reject sobre uma marca por id).
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            return withBodyDoc(html, function (body) {
                var rv = body.querySelector('span[data-id-review="' + idReview + '"]');
                if (!rv) return;
                if (mode == 'accept') {
                    if (type == 'add') {
                        removePrevReviewSp(rv);
                        replaceWithText(rv);
                    } else { // delete
                        if (rv.parentNode) rv.parentNode.removeChild(rv);
                    }
                } else if (mode == 'reject') {
                    if (type == 'add') {
                        removePrevReviewSp(rv);
                        if (rv.parentNode) rv.parentNode.removeChild(rv);
                    } else { // delete
                        replaceWithText(rv);
                    }
                }
            });
        });

        // No dialogo (readonly), some o cartao apos a acao.
        if (_data.readonly && _this && _this.closest) {
            _this.closest('.reviewDisplayPro').slideUp('slow', function () {
                _this.closest('.reviewDisplayPro').remove();
            });
        }
    };

    // Remove o espaco-marcador (span.reviewSP) imediatamente anterior a marca.
    function removePrevReviewSp(rv) {
        var prev = rv.previousElementSibling;
        if (prev && prev.classList && prev.classList.contains('reviewSP')) {
            prev.parentNode.removeChild(prev);
        }
    }
    // Substitui a marca pelo seu texto (mantem o conteudo, remove o wrapper).
    function replaceWithText(rv) {
        var txt = rv.textContent || '';
        var node = document.createTextNode(txt);
        if (rv.parentNode) {
            rv.parentNode.insertBefore(node, rv);
            rv.parentNode.removeChild(rv);
        }
    }

    // ----------------------------------------------------------------
    // Dialogo "Gerenciar Revisoes": entrada (botao da toolbar) e conteudo.
    // ----------------------------------------------------------------
    window.getBoxCtrReview = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        SeiProEditorAdapter.openDialog({
            id: 'dialogReviewPro',
            title: 'Gerenciar Revis\u00F5es',
            html: '<div style="padding-bottom: 10px;overflow: auto;max-height: 400px;text-align: center;" id="boxReviews"></div>',
            width: 700,
            height: 'auto',
            onOpen: function () {
                contentDialogReview();
            }
        });
    };

    // Mantido por compat com initFunctions() -- o dialogo agora eh on-demand.
    window.getDialogReview = function () { /* no-op: dialogo on-demand em getBoxCtrReview() */ };

    // Monta a lista de revisoes do documento no #boxReviews. Reescrito sobre
    // findInBody (CK4/CK5): para cada marca, gera o cartao readonly com o
    // trecho do paragrafo destacado.
    window.contentDialogReview = function (alertText) {
        alertText = (typeof alertText === 'undefined')
            ? '<span style="font-size: 12pt;"><i class="fas fa-info-circle laranjaColor" style="margin-right: 5px;"></i>Nenhuma revis\u00E3o identificada</span>'
            : alertText;

        var editor = SeiProEditorAdapter.getInstance();
        var listReviews = '';
        if (editor) {
            // Esconde qualquer popover aberto no corpo.
            hideReviewTips();
            var $marks = SeiProEditorAdapter.findInBody(editor, '.reviewSeiPro');
            $marks.each(function () {
                var $mark = $(this);
                var _data = $mark.data();
                var $p = $mark.closest('p').clone();
                $p.find('.reviewSeiPro[data-id-review="' + _data.idReview + '"]').addClass('reviewHighlights');
                $p.find('.reviewDisplayPro').remove();
                var html = $p.html();

                listReviews += getHtmlReviewDisplayPro({
                    date: _data.dateReview,
                    id_review: _data.idReview,
                    type: _data.review,
                    user: _data.userReview,
                    comment: typeof _data.comment === 'undefined' ? '' : _data.comment,
                    text: false,
                    html: html
                }, true);
            });
        }

        var btnControlReject = '<div style="margin: 10px 0 !important;display: inline-block;width: 95%;">' +
            '   <span class="action" style="font-size: 11pt;float: right;margin-left:10px;cursor:pointer;color: #9CB639;" onclick="parent.removeReviewPro(this)" data-mode="acceptAll" title="Aceitar revis\u00E7\u00E3o"><i class="fas fa-check-circle" style="font-size: 11pt;color: #9CB639;"></i> Aceitar Todas</span>' +
            '   <span class="action" style="font-size: 11pt;float: left;margin-left:10px;cursor:pointer;color: #E46E64;" onclick="parent.removeReviewPro(this)" data-mode="rejectAll" title="Rejeitar revis\u00E7\u00E3o"><i class="fas fa-times-circle" style="font-size: 11pt;color: #E46E64;"></i> Rejeitar todas</span>' +
            '</div>';

        $('#boxReviews').html(listReviews === '' ? alertText : btnControlReject + listReviews);
    };

    // ----------------------------------------------------------------
    // Entrada do botao "Revisar texto": liga/desliga o modo de rastreio e
    // instala o key handler (uma vez por editor).
    // ----------------------------------------------------------------
    window.getBoxReview = function (this_) {
        var btn = $('.getReviewButton');
        if (btn.hasClass('cke_button_off')) {
            btn.addClass('cke_button_on').removeClass('cke_button_off');
            initStyleReview();
        } else {
            btn.addClass('cke_button_off').removeClass('cke_button_on');
        }
    };

    // Instala o listener de teclas que ativa o rastreio de alteracoes.
    // CK4: editor.on('key', getStyleReview) -- exposto pelo adapter.on quando
    // version===4 (passa direto ao editor.on). CK5: nao ha evento 'key' com
    // keyCode/range cru; registramos um keydown DOM no editable como melhor
    // esforco (apenas as operacoes cobertas pelo adapter -- ver getStyleReview).
    window.initStyleReview = function () {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return false;

        // Chave de idempotencia por instancia (CK4 usa editor.name; CK5 e uma
        // unica instancia, usamos uma flag fixa).
        var key = (typeof editor.name !== 'undefined' && editor.name) ? editor.name : '__ck5__';
        if (typeof window.loadedStyleReview !== 'undefined' && $.inArray(key, window.loadedStyleReview) !== -1) {
            return false;
        }

        if (SeiProEditorAdapter.version === 4) {
            // Caminho CK4: evento nativo 'key' com evt.data.keyCode/domEvent.
            SeiProEditorAdapter.on(editor, 'key', function (evt) {
                if ($('.getReviewButton').hasClass('cke_button_on')) getStyleReview(evt);
            });
        } else {
            // Caminho CK5: keydown DOM no editable (melhor esforco).
            SeiProEditorAdapter.on(editor, 'keydown', function (domEvt) {
                if ($('.getReviewButton').hasClass('cke_button_on')) {
                    // Adapta o shape do evento DOM para o esperado por getStyleReview.
                    getStyleReview({ data: { keyCode: domEvt.keyCode, domEvent: { $: domEvt } } });
                }
            });
        }

        if (typeof window.loadedStyleReview === 'undefined') {
            window.loadedStyleReview = [key];
        } else {
            window.loadedStyleReview.push(key);
        }
        return true;
    };

    // ----------------------------------------------------------------
    // PARCIAL: rastreio de alteracoes ao digitar.
    //
    // O comportamento completo (marcar cada caractere apagado como 'delete' e
    // cada inserido como 'add', preservando o cursor) depende de APIs cruas do
    // CK4: editor.getSelection().getRanges(), getStartElement, getSelectedText,
    // selectRanges, editor.createRange()/editable(), CKEDITOR.dom.walker e
    // CKEDITOR.NODE_TEXT. O adapter nao expoe equivalentes per-keystroke.
    //
    // CK4 (version===4 e oEditor disponivel): executa a logica original
    // integral. CK5: degrada para o unico caso reproduzivel com o adapter --
    // havendo selecao nao-colapsada, marca o trecho como delete + add; nos
    // demais casos apenas avisa (uma vez) que o rastreio fino fica indisponivel.
    // ----------------------------------------------------------------
    window.getStyleReview = function (evt) {
        if (SeiProEditorAdapter.version === 4 && oEditorAvailable() && typeof CKEDITOR !== 'undefined') {
            getStyleReviewCK4(evt);
            return;
        }
        getStyleReviewCK5(evt);
    };

    // --- Caminho CK4 (logica original, APIs cruas permitidas neste ramo) ---
    function getStyleReviewCK4(evt) {
        var keycode = evt.data.keyCode;
        var wordKey = evt.data.domEvent.$.key;
        var sel = oEditor.getSelection();
        var select = sel.getStartElement();
        var spanElement = $(select.$).closest('span');
        var selectTxt = sel.getSelectedText();

        if (spanElement.hasClass('commentReview')) return false;

        if (selectTxt == '' && keycode == 8 && (spanElement.length == 0 || (spanElement.length && spanElement.data('review') != 'add'))) {
            oEditor.fire('saveSnapshot');
            var newRange = setPositionCursor();
            var wordDeleted = getCharOnCursor('prev');
            wordDeleted = (wordDeleted == ' ') ? '&nbsp;' : wordDeleted;

            setStyleReview('delete', 'insert', wordDeleted);
            sel.selectRanges([newRange]);
            oEditor.fire('saveSnapshot');

        } else if (selectTxt == '' && keycode == 46) {
            oEditor.fire('saveSnapshot');
            setPositionCursor();
            var wordDeletedNext = getCharOnCursor('next');

            setStyleReview('delete', 'insert', wordDeletedNext);
            oEditor.fire('saveSnapshot');

        } else {
            if (wordKey != 'Shift' && wordKey != 'Meta' && wordKey.indexOf('Arrow') === -1) {
                if (selectTxt != '') {
                    oEditor.fire('saveSnapshot');
                    var insetSp = (keycode == 46 || keycode == 32) ? '' : wordKey;
                    insetSp = (keycode == 8) ? ' ' : insetSp;

                    if (selectTxt.indexOf('\n\n') !== -1) {
                        var listElem = setListElementsSelected();
                        $.each(listElem, function (i, v) {
                            setStyleReview('delete', 'insert', v.text(), true, v.attr('class'));
                        });
                        oEditor.fire('saveSnapshot');
                    } else {
                        setStyleReview('delete', 'insert', selectTxt, true);
                        setStyleReview('add', 'insert', insetSp);
                        oEditor.fire('saveSnapshot');
                    }

                    var _select = oEditor.getSelection().getStartElement();
                    var _spanElement = $(_select.$).closest('span');
                    if (keycode != 8 && keycode != 46 && _spanElement.length && _spanElement.data('review') == 'add') {
                        var newRange2 = setPositionCursor();
                        setTimeout(function () {
                            _spanElement.find('u').text(wordKey);
                            oEditor.getSelection().selectRanges([newRange2]);
                        });
                    }

                } else {
                    if (spanElement.length == 0 || (spanElement.length && spanElement.data('review') != 'add')) {
                        oEditor.fire('saveSnapshot');
                        setStyleReview('add', 'change');
                        oEditor.fire('saveSnapshot');
                    }
                }
            }
        }
    }

    // --- Caminho CK5 (melhor esforco; sem APIs cruas de range/walker) ---
    function getStyleReviewCK5(evt) {
        var editor = SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var keycode = (evt && evt.data) ? evt.data.keyCode : null;
        var wordKey = (evt && evt.data && evt.data.domEvent && evt.data.domEvent.$) ? evt.data.domEvent.$.key : '';

        // Ignora teclas de navegacao/modificadoras.
        if (wordKey == 'Shift' || wordKey == 'Meta' || (wordKey && wordKey.indexOf('Arrow') === 0)) return;

        var selectTxt = SeiProEditorAdapter.getSelectedText(editor) || '';
        if (selectTxt != '') {
            // Unico caso reproduzivel com o adapter: substituicao de um trecho
            // selecionado -> marca delete do trecho + add do caractere digitado.
            var insetSp = (keycode == 46 || keycode == 32) ? '' : wordKey;
            insetSp = (keycode == 8) ? ' ' : insetSp;
            setStyleReview('delete', 'insert', selectTxt, true);
            if (insetSp) setStyleReview('add', 'insert', insetSp);
            return;
        }

        // Apagar/inserir caractere a caractere preservando o cursor nao e
        // reproduzivel sem as APIs de range do CK4. Avisa uma unica vez.
        if (!window.__seiProReviewCK5Warned) {
            window.__seiProReviewCK5Warned = true;
            if (typeof alertaBoxPro === 'function') {
                alertaBoxPro('Revis\u00E3o de texto', 'info-circle',
                    'No editor do SEI 5, o rastreio autom\u00E1tico de altera\u00E7\u00F5es ao digitar ainda n\u00E3o est\u00E1 dispon\u00EDvel. ' +
                    'Selecione um trecho antes de digitar para registrar a revis\u00E3o, ou use o gerenciador de revis\u00F5es.');
            } else if (typeof console !== 'undefined') {
                console.warn('[SEIPro/review] rastreio per-keystroke indisponivel no CK5 (depende de APIs CK4).');
            }
        }
    }

    // ----------------------------------------------------------------
    // Helpers exclusivos do caminho CK4 de getStyleReview (APIs cruas).
    // Vivem aqui porque so a feature review os usa.
    // ----------------------------------------------------------------
    function setListElementsSelected() {
        var init = oEditor.getSelection().getNative();
        var start = $(init.focusNode.parentNode);
        var end = $(init.baseNode.parentNode);
        var list = [];

        function add(elem) {
            var next = elem.next();
            list.push(elem.clone());
            if (end[0] != elem[0]) add(next);
        }
        add(start);

        return list;
    }
    function setPositionCursor() {
        var oldRanges = oEditor.getSelection().getRanges();
        var oldRange = oldRanges[oldRanges.length - 1];
        var newRange = oEditor.createRange();
        newRange.setStart(oldRange.endContainer, oldRange.endOffset);
        newRange.setEnd(oldRange.endContainer, oldRange.endOffset);
        return newRange;
    }
    function getCharOnCursor(position) {
        position = position || 'prev';
        var range = oEditor.getSelection().getRanges()[0],
            startNode = range.startContainer;
        var pos = (position == 'prev') ? range.startOffset - 1 : range.startOffset;

        if (startNode.type == CKEDITOR.NODE_TEXT && range.startOffset) {
            return startNode.getText()[pos];
        } else {
            range.collapse(true);
            range.setStartAt(oEditor.editable(), CKEDITOR.POSITION_AFTER_START);
            var walker = new CKEDITOR.dom.walker(range),
                node;
            while ((node = walker.previous())) {
                if (node.type == CKEDITOR.NODE_TEXT)
                    return node.getText().slice(-1);
            }
        }
        return null;
    }

    // Registro da feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'review' });
})();
