/**
 * SEI Pro - Editor Feature: sigilo
 *
 * Marcacao, tarja e gerenciamento de marcas de sigilo no texto do documento
 * (CK4/CK5). Entradas (botoes da toolbar):
 *   - getMarkSigilo  -> aplica/remove a marca de sigilo (span.sigiloSEI) na selecao.
 *   - getTarjaSigilo -> aplica a marca na selecao e ja tarja todas as marcas.
 *   - getBoxSigilo   -> abre o dialogo "Gerenciar marcas de sigilo do documento".
 *   - getDialogSigilo -> no-op (o dialogo CK4 virou jQuery UI on-demand).
 *
 * Portado do monolito sei-pro-editor.js. Toda interacao com o editor passa
 * pelo SeiProEditorAdapter.
 *
 * --- Notas de portabilidade CK4 -> CK5 ---
 * 1) getMarkSigilo usava CKEDITOR.style({element:'span', attributes:{class:'sigiloSEI'}})
 *    + editor.applyStyle (inexistente no CK5). Reescrito como TOGGLE de span.sigiloSEI:
 *      - se a selecao ja esta dentro de um span.sigiloSEI -> desfaz (substitui o span
 *        pelo seu conteudo interno via transformBodyHtml marcando o alvo);
 *      - senao, envolve o HTML selecionado num <span class="sigiloSEI"> com insertHtml.
 * 2) As operacoes em massa (replace/remove/apply/email_cpf) manipulavam diretamente o
 *    DOM do iframe (iframeEditor.find(...)). Reescritas com transformBodyHtml (DOMParser),
 *    que funciona uniformemente em CK4 e CK5 (serializa o corpo, manipula, re-seta).
 * 3) O dialogo CK4 (.cke_dialog_page_contents + abas CKEDITOR) foi substituido pelo
 *    dialogo jQuery UI via SeiProEditorAdapter.openDialog, lendo os campos por id no $box.
 *    actionsMarkSigilo passou a receber o $box (ou null) em vez de "this_".
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js, chamados
 * apenas em tempo de clique): hasSelection, randomNumber, extractEmails, extractCPFs,
 * uniqPro, alertaBoxPro.
 */
(function () {
    'use strict';

    var REDACTOR = '\u2588'; // bloco cheio usado na tarja

    // ----------------------------------------------------------------
    // Util: parse de um fragmento HTML do corpo num documento isolado,
    // aplica fn(body) e devolve o innerHTML resultante. Centraliza o uso
    // de DOMParser para as transformacoes em massa (mesmo padrao de
    // nota-rodape.js -- DOM detached, re-setado depois pelo adapter).
    // ----------------------------------------------------------------
    function withBodyDoc(html, fn) {
        var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
        var body = doc.body;
        fn(body);
        return body.innerHTML;
    }

    function escapeRegExp(s) {
        return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ----------------------------------------------------------------
    // ADICIONA / REMOVE marca de sigilo na selecao (toggle).
    // ----------------------------------------------------------------
    window.getMarkSigilo = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        // Detecta se a selecao ja esta dentro de um span.sigiloSEI.
        var selEl = SeiProEditorAdapter.getSelectionElement(editor);
        var wrapper = (selEl && selEl.closest) ? selEl.closest('span.sigiloSEI') : null;

        if (wrapper) {
            // TOGGLE OFF: desfaz a marca, substituindo o span pelo seu conteudo.
            // Marca o span alvo com um atributo unico para localiza-lo no HTML
            // serializado (transformBodyHtml e a forma segura no CK5).
            var token = 'seiProUnmark_' + Date.now();
            try { wrapper.setAttribute('data-seipro-unmark', token); } catch (e) {}
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return withBodyDoc(html, function (body) {
                    var target = body.querySelector('span.sigiloSEI[data-seipro-unmark="' + token + '"]');
                    if (target) {
                        while (target.firstChild) target.parentNode.insertBefore(target.firstChild, target);
                        target.parentNode.removeChild(target);
                    }
                });
            });
            return;
        }

        // TOGGLE ON: exige selecao nao colapsada.
        if (typeof hasSelection === 'function' && !hasSelection(editor)) {
            alertaBoxPro('Aten\u00E7\u00E3o', 'exclamation-triangle', 'Selecione um texto para adicionar a marca de sigilo.');
            return;
        }
        var sel = SeiProEditorAdapter.getSelectedHtml(editor);
        if (!sel || sel === '') {
            alertaBoxPro('Aten\u00E7\u00E3o', 'exclamation-triangle', 'Selecione um texto para adicionar a marca de sigilo.');
            return;
        }
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, '<span class="sigiloSEI">' + sel + '</span>');
        });
    };

    // ----------------------------------------------------------------
    // Aplica a marca na selecao e ja tarja todas as marcas do documento.
    // ----------------------------------------------------------------
    window.getTarjaSigilo = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        if (typeof hasSelection === 'function' && !hasSelection(editor)) {
            alertaBoxPro('Aten\u00E7\u00E3o', 'exclamation-triangle', 'Selecione um texto para tarjar.');
            return;
        }
        var sel = SeiProEditorAdapter.getSelectedHtml(editor);
        if (!sel || sel === '') {
            alertaBoxPro('Aten\u00E7\u00E3o', 'exclamation-triangle', 'Selecione um texto para tarjar.');
            return;
        }
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, '<span class="sigiloSEI">' + sel + '</span>');
        });
        // Aplica a tarja apos o CK5 reconciliar a view (transformBodyHtml nao
        // deve rodar dentro de model.change).
        setTimeout(function () { actionsMarkSigilo(null, 'apply', false, false, editor); }, 0);
    };

    // ----------------------------------------------------------------
    // Abre o dialogo de gerenciamento (jQuery UI on-demand).
    // ----------------------------------------------------------------
    window.getBoxSigilo = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        openDialogSigilo(editor);
    };

    // Mantido por compat com initFunctions() -- o dialogo agora eh on-demand.
    window.getDialogSigilo = function () { /* no-op: dialogo on-demand em openDialogSigilo() */ };

    // ----------------------------------------------------------------
    // Dialogo "Gerenciar marcas de sigilo do documento".
    // ----------------------------------------------------------------
    window.openDialogSigilo = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var textSelected = SeiProEditorAdapter.getSelectedText(editor) || '';

        var htmlBox =
            '<div class="dialogBoxDiv seipro-dialog-compact" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">' +
                '<style>' +
                    '.seipro-dialog-compact, .seipro-dialog-compact * { box-sizing:border-box; font-size:13px; }' +
                    '.seipro-dialog-compact label { font-size:12px; color:#555; }' +
                    '.seipro-dialog-compact input { font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; line-height:1.3; }' +
                    '.seipro-dialog-compact .ui-tabs-nav .ui-tabs-anchor { padding:6px 12px; font-size:12px; }' +
                    '.seipro-dialog-compact .ui-tabs .ui-tabs-panel { padding:10px 12px; font-size:13px; }' +
                    '.seipro-dialog-compact button.ui-button { font-size:12px; padding:4px 10px; cursor:pointer; }' +
                    '.seipro-dialog-compact table.seiProForm td { padding:6px 4px; vertical-align:top; }' +
                    '.seipro-dialog-compact .tabSigilo_result { margin-top:15px; }' +
                '</style>' +
                '<div id="sigiloTabs" class="seiProTabs">' +
                    '<ul>' +
                        '<li><a href="#sigiloTabLocalizar">1. Localizar texto e dados pessoais</a></li>' +
                        '<li><a href="#sigiloTabTarjar">2. Tarjar marcas de sigilo</a></li>' +
                        '<li><a href="#sigiloTabRemover">Remover marcas</a></li>' +
                        '<li><a href="#sigiloTabGuia">Guia r\u00E1pido</a></li>' +
                    '</ul>' +
                    // --- Aba 1: localizar ---
                    '<div id="sigiloTabLocalizar">' +
                        '<table role="presentation" class="seiProForm" style="width:100%">' +
                            '<tr>' +
                                '<td style="width:55%"><label>Localizar texto e adicionar marca<br>de sigilo em todo o documento</label></td>' +
                                '<td style="width:45%">' +
                                    '<input type="text" id="inputSigiloTexto" style="width:200px;max-width:100%">' +
                                    '<div style="margin-top:6px;"><button type="button" id="btnSigiloReplace" class="ui-button ui-state-default ui-corner-all">Adicionar</button></div>' +
                                '</td>' +
                            '</tr>' +
                            '<tr>' +
                                '<td><label>Localizar dados pessoais como<br>e-mails e CPFs em todo o documento</label></td>' +
                                '<td><button type="button" id="btnSigiloEmailCpf" class="ui-button ui-state-default ui-corner-all">Localizar dados pessoais</button></td>' +
                            '</tr>' +
                        '</table>' +
                        '<div id="tabSigilo2_result" class="tabSigilo_result" style="display:none;"></div>' +
                    '</div>' +
                    // --- Aba 2: tarjar ---
                    '<div id="sigiloTabTarjar">' +
                        '<table role="presentation" class="seiProForm" style="width:100%">' +
                            '<tr>' +
                                '<td style="width:55%"><label>Aplicar tarja de sigilo<br>no documento</label></td>' +
                                '<td style="width:45%"><button type="button" id="btnSigiloApply" class="ui-button ui-state-default ui-corner-all">Aplicar</button></td>' +
                            '</tr>' +
                        '</table>' +
                        '<div id="tabSigilo1_result" class="tabSigilo_result" style="display:none;"></div>' +
                    '</div>' +
                    // --- Aba 3: remover ---
                    '<div id="sigiloTabRemover">' +
                        '<table role="presentation" class="seiProForm" style="width:100%">' +
                            '<tr>' +
                                '<td style="width:55%"><label>Remover todas as marcas<br>de sigilo no documento</label></td>' +
                                '<td style="width:45%"><button type="button" id="btnSigiloRemove" class="ui-button ui-state-default ui-corner-all">Remover</button></td>' +
                            '</tr>' +
                        '</table>' +
                        '<div id="tabSigilo3_result" class="tabSigilo_result" style="display:none;"></div>' +
                        '<div id="tabSigilo3_info" style="margin-top:15px;">' +
                            '<label style="font-style:italic;color:#616161;">' +
                                '<i class="fas fa-exclamation-triangle laranjaColor"></i> Marcas de sigilo j\u00E1 tarjadas n\u00E3o poder\u00E3o ser revertidas ap\u00F3s salvar e abandonar <br>este editor de documentos.' +
                            '</label>' +
                        '</div>' +
                    '</div>' +
                    // --- Aba 4: guia ---
                    '<div id="sigiloTabGuia">' +
                        '<label>Acesse o guia r\u00E1pido sobre como <a target="_blank" href="https://sei-pro.github.io/sei-pro/pages/SIGILODOC.html" class="linkDialog">Adicionar marca de sigilo e tarjas pretas de confidencialidade <i class="fas fa-external-link-alt bLink" style="font-size:90%;text-decoration:underline;"></i></a></label>' +
                    '</div>' +
                '</div>' +
            '</div>';

        SeiProEditorAdapter.openDialog({
            id: 'dialogSigiloPro',
            title: 'Gerenciar marcas de sigilo do documento',
            html: htmlBox,
            width: 720,
            height: 'auto',
            onOpen: function ($box) {
                var $tabs = $box.find('#sigiloTabs');
                if ($tabs.tabs) $tabs.tabs();
                $box.find('.tabSigilo_result').html('').hide();
                $box.find('#inputSigiloTexto').val(textSelected);
                htmlTabSigiloResult($box, editor);

                $box.find('#btnSigiloReplace').on('click', function () { actionsMarkSigilo($box, 'replace', false, false, editor); });
                $box.find('#btnSigiloEmailCpf').on('click', function () { actionsMarkSigilo($box, 'email_cpf', false, false, editor); });
                $box.find('#btnSigiloApply').on('click', function () { actionsMarkSigilo($box, 'apply', false, false, editor); });
                $box.find('#btnSigiloRemove').on('click', function () { actionsMarkSigilo($box, 'remove', false, false, editor); });
            }
        });
    };

    // ----------------------------------------------------------------
    // Acoes em massa sobre as marcas de sigilo. Assinatura compativel com o
    // monolito (this_, mode, text, increment) + editor opcional.
    //   $box     -> elemento jQuery do dialogo (ou null em chamadas internas).
    //   mode     -> 'replace' | 'remove' | 'apply' | 'email_cpf'.
    //   text     -> texto a localizar (modo replace recursivo de email_cpf).
    //   increment-> acumula a contagem (email_cpf chama replace em loop).
    // ----------------------------------------------------------------
    window.actionsMarkSigilo = function (this_, mode, text, increment, editor) {
        text = (typeof text === 'undefined') ? false : text;
        increment = (typeof increment === 'undefined') ? false : increment;
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var $box = (this_ && this_.find) ? this_ : null;
        var result = '';

        if (mode === 'replace') {
            var textFind = (text) ? text : ($box ? ($box.find('#inputSigiloTexto').val() || '').trim() : '');
            if (textFind !== '') {
                var i_increment = 0;
                if (increment && $box) {
                    var $count = $box.find('#tabSigilo2_result .count');
                    i_increment = parseInt($count.length ? $count.text() : 0, 10) || 0;
                }
                var i = 0;

                SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                    return withBodyDoc(html, function (body) {
                        var paras = body.querySelectorAll('p');
                        for (var p = 0; p < paras.length; p++) {
                            // Desfaz marcas existentes do mesmo texto antes de re-marcar
                            // (evita aninhamento), espelhando o comportamento original.
                            var existentes = paras[p].querySelectorAll('span.sigiloSEI');
                            for (var e = 0; e < existentes.length; e++) {
                                var sp = existentes[e];
                                var rxTest = new RegExp('\\b' + escapeRegExp(textFind) + '\\b', 'igm');
                                if (rxTest.test(sp.textContent || '')) {
                                    while (sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp);
                                    sp.parentNode.removeChild(sp);
                                }
                            }
                            // Envolve as ocorrencias nos nos de texto.
                            wrapWordsInElement(paras[p], textFind);
                        }
                        // Conta as ocorrencias no texto total.
                        var fullText = Array.prototype.map.call(body.querySelectorAll('p'), function (el) { return el.textContent; }).join(' ');
                        var matches = fullText.match(new RegExp('\\b' + escapeRegExp(textFind) + '\\b', 'igm'));
                        i = matches ? matches.length : 0;
                    });
                });

                var displayResult;
                if (i > 0) {
                    i = i + i_increment;
                    displayResult = '  <i class="fas fa-check-circle verdeColor"></i> <span class="count">' + i + '</span> ' + (i == 1 ? 'marca' : 'marcas') + ' ' + (i == 1 ? 'adicionada' : 'adicionadas') + ' com sucesso!';
                } else {
                    displayResult = '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhum texto encontrado!';
                }
                result = '<label style="font-style: italic; color: #616161;">' + displayResult + '</label>';
            } else {
                result = '<label style="font-style: italic; color: #616161;">' +
                         '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Digite um texto para adicionar a marca de sigilo' +
                         '</label>';
            }
            if ($box) {
                $box.find('#tabSigilo2_result').show().html(result);
                $box.find('#tabSigilo3_result').hide().html('');
                htmlTabSigiloResult($box, editor);
            }

        } else if (mode === 'remove') {
            var removed = { n: 0 };
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return withBodyDoc(html, function (body) {
                    // Desfaz marcas simples.
                    body.querySelectorAll('span.sigiloSEI').forEach(function (sp) {
                        while (sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp);
                        sp.parentNode.removeChild(sp);
                        removed.n++;
                    });
                    // Desfaz marcas tarjadas restaurando o texto original (data-text).
                    body.querySelectorAll('span.sigiloSEI_tarja').forEach(function (sp) {
                        var original = sp.getAttribute('data-text');
                        if (typeof original === 'string' && original !== '') {
                            var tpl = document.createElement('template');
                            tpl.innerHTML = original;
                            sp.parentNode.insertBefore(tpl.content, sp);
                            sp.parentNode.removeChild(sp);
                            removed.n++;
                        }
                    });
                });
            });
            var displayResultR = (removed.n === 0)
                ? '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca encontrada!'
                : '  <i class="fas fa-check-circle verdeColor"></i> ' + removed.n + ' ' + (removed.n == 1 ? 'marca' : 'marcas') + ' ' + (removed.n == 1 ? 'removida' : 'removidas') + ' com sucesso!';
            result = '<label style="font-style: italic; color: #616161;">' + displayResultR + '</label>';
            if ($box) {
                $box.find('#tabSigilo3_result').show().html(result);
                $box.find('#tabSigilo2_result').hide().html('');
                htmlTabSigiloResult($box, editor);
            }
            rodapeSigiloMark(editor);

        } else if (mode === 'apply') {
            var applied = { n: 0 };
            SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
                return withBodyDoc(html, function (body) {
                    body.querySelectorAll('span.sigiloSEI').forEach(function (sp) {
                        var rand = (typeof randomNumber === 'function') ? randomNumber(8, 15) : 10;
                        sp.setAttribute('data-text', sp.innerHTML);
                        sp.textContent = REDACTOR.repeat(rand);
                        sp.setAttribute('class', 'sigiloSEI_tarja');
                        applied.n++;
                    });
                });
            });
            if (applied.n > 0) {
                result = '<label style="font-style: italic; color: #616161;">' +
                         '  <i class="fas fa-check-circle verdeColor"></i> ' + applied.n + ' ' + (applied.n == 1 ? 'marca' : 'marcas') + ' ' + (applied.n == 1 ? 'tarjada' : 'tarjadas') + ' com sucesso!<br>' +
                         '  <i class="fas fa-exclamation-triangle laranjaColor"></i>  ' + (applied.n == 1 ? 'Esta marca tarjada poder\u00E1 ser revertida' : 'Estas marcas tarjadas poder\u00E3o ser revertidas') + ' na aba "Remover marcas"<br> somente enquanto aberto este editor de documentos.' +
                         '</label>';
                if ($box) $box.find('#tabSigilo1_result').show().html(result);
            } else if ($box) {
                htmlTabSigiloResult($box, editor);
            }
            if ($box) {
                $box.find('#tabSigilo2_result').hide().html('');
                $box.find('#tabSigilo3_result').hide().html('');
            }
            rodapeSigiloMark(editor);

        } else if (mode === 'email_cpf') {
            if ($box) $box.find('#tabSigilo2_result').html('');
            var bodyText = '';
            var bodyEl = SeiProEditorAdapter.getBodyContainer(editor);
            if (bodyEl) bodyText = bodyEl.textContent || bodyEl.innerText || '';
            var arrayEmails = (typeof extractEmails === 'function') ? extractEmails(bodyText) : [];
                arrayEmails = (arrayEmails && arrayEmails.length && typeof uniqPro === 'function') ? uniqPro(arrayEmails) : (arrayEmails || []);
            var arrayCPFs = (typeof extractCPFs === 'function') ? extractCPFs(bodyText) : [];
                arrayCPFs = (arrayCPFs && arrayCPFs.length && typeof uniqPro === 'function') ? uniqPro(arrayCPFs) : (arrayCPFs || []);
            var arrayDadosSensiveis = (window.$ && $.merge) ? $.merge(arrayCPFs, arrayEmails) : arrayCPFs.concat(arrayEmails);
            if (arrayDadosSensiveis.length) {
                for (var d = 0; d < arrayDadosSensiveis.length; d++) {
                    actionsMarkSigilo($box, 'replace', arrayDadosSensiveis[d], true, editor);
                }
            }
        }
    };

    // ----------------------------------------------------------------
    // Insere o rodape "#_contem_N_marcas_sigilo" quando ha tarjas, ou o
    // remove quando nao ha. Reescrito com transformBodyHtml (CK4/CK5).
    // ----------------------------------------------------------------
    window.rodapeSigiloMark = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            return withBodyDoc(html, function (body) {
                var countMarks = body.querySelectorAll('.sigiloSEI_tarja').length;
                body.querySelectorAll('.sigiloSEI_sigilo_mark').forEach(function (el) {
                    el.parentNode.removeChild(el);
                });
                if (countMarks > 0) {
                    body.insertAdjacentHTML('beforeend',
                        '<p class="sigiloSEI_sigilo_mark" contenteditable="false" style="font-size: 6pt;color: #ccc;font-family: monospace;">#_contem_' + countMarks + '_marcas_sigilo</p>');
                }
            });
        });
    };

    // ----------------------------------------------------------------
    // Atualiza o painel de resultado da aba "Tarjar" com a contagem atual de
    // marcas de sigilo presentes no documento. Recebe o $box do dialogo.
    // ----------------------------------------------------------------
    window.htmlTabSigiloResult = function (this_, editor) {
        var $box = (this_ && this_.find) ? this_ : null;
        if (!$box) return;
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;

        var i = 0;
        var bodyEl = SeiProEditorAdapter.getBodyContainer(editor);
        if (bodyEl) i = bodyEl.querySelectorAll('p span.sigiloSEI').length;

        var result;
        if (i === 0) {
            result = '<label style="font-style: italic; color: #616161;">' +
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nenhuma marca de sigilo no documento! Adicione marcas de sigilo na aba <br>' +
                     ' "Localizar texto" ou adicione manualmente com o bot\u00E3o de marca de sigilo da barra de ferramentas.' +
                     '</label>';
        } else {
            result = '<label style="font-style: italic; color: #616161;">' +
                     '  <i class="fas fa-info-circle" style="color: #007fff;"></i> ' + i + ' ' + (i == 1 ? 'marca' : 'marcas') + ' de sigilo ' + (i == 1 ? 'encontrada' : 'encontradas') + ' no documento! <br>' +
                     '</label>';
        }
        $box.find('#tabSigilo1_result').show().html(result);
    };

    // ----------------------------------------------------------------
    // Helper interno: envolve as ocorrencias da palavra `word` (limites \b)
    // nos nos de texto de `el` num <span class="sigiloSEI">. Equivalente ao
    // $.fn.wrapInTag do monolito, mas operando sobre DOM puro (DOMParser).
    // ----------------------------------------------------------------
    function wrapWordsInElement(el, word) {
        var rx = new RegExp('\\b' + escapeRegExp(word) + '\\b', 'igm');
        var children = Array.prototype.slice.call(el.childNodes);
        for (var c = 0; c < children.length; c++) {
            var node = children[c];
            if (node.nodeType === 3) { // TEXT_NODE
                var txt = node.nodeValue || '';
                rx.lastIndex = 0;
                if (!rx.test(txt)) continue;
                rx.lastIndex = 0;
                var replaced = txt.replace(rx, function (m) {
                    return '<span class="sigiloSEI">' + m + '</span>';
                });
                var tpl = document.createElement('template');
                tpl.innerHTML = replaced;
                node.parentNode.insertBefore(tpl.content, node);
                node.parentNode.removeChild(node);
            } else if (node.nodeType === 1) { // ELEMENT_NODE
                // Nao re-entra em spans de sigilo ja existentes.
                if (node.classList && (node.classList.contains('sigiloSEI') || node.classList.contains('sigiloSEI_tarja'))) continue;
                wrapWordsInElement(node, word);
            }
        }
    }

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'sigilo' });
})();
