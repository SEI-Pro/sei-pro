/**
 * SEI Pro - Editor Feature: importar-doc
 *
 * Importar conteudo externo para o editor do SEI (CK4/CK5):
 *   - Documento HTML ou Word (.docx) a partir de arquivo local
 *   - Google Docs (via URL publica)
 *   - Google Planilhas (via URL "Publicar na Web")
 *
 * Entrada: importDocPro (botao da toolbar). Abre um dialogo jQuery UI
 * on-demand (SeiProEditorAdapter.openDialog) com tres abas. O .docx eh
 * convertido com mammoth (carregado sob demanda via $.getScript). O HTML
 * resultante eh limpo (wordToSEI) e inserido pela pipeline do adapter.
 *
 * Portado do monolito sei-pro-editor.js. Toda interacao com o editor passa
 * pelo SeiProEditorAdapter:
 *   - O antigo dialogo CK4 ($('#dialogBoxPro').dialog) virou openDialog.
 *   - loadFileImportEditor: oEditor/iframeEditor/getSelection() -> withEdit +
 *     transformBodyHtml (substituir tudo) ou insertHtmlBefore (no cursor).
 *   - wordToSEI: manipulacao do iframe ($.find no body) -> transform de HTML
 *     puro via transformBodyHtml + DOMParser (uniforme CK4/CK5).
 *
 * LIMITACAO (Google Docs/Sheets): o caminho de insercao "rico" (loadGoogleDocs
 * + DocsToSEI + convertCSSToStyle + ImgToBase64) vive em sei-functions-pro.js e
 * eh totalmente acoplado ao iframe do CK4 (opera sobre $(iframe).find('body')).
 * Em CK4 delegamos a essa pipeline existente. Em CK5 nao ha iframe; fazemos um
 * fallback best-effort: buscamos o HTML publicado e inserimos via adapter com
 * uma limpeza basica (links, scripts/styles/meta). A conversao completa de CSS
 * para classes do SEI (convertCSSToStyle) e a base64 de imagens NAO rodam em
 * CK5 -- por isso esta feature eh marcada como parcial.
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js,
 * chamados apenas em tempo de clique): sanitizeHTML, alertaBoxPro,
 * setParamEditor, initChosenReplace, resetDialogBoxPro, replaceDadosEditor,
 * loadGoogleDocs, getParamsUrlPro, enableButtonSavePro, mammoth, URL_SPRO.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Helpers internos (nao globais)
    // ----------------------------------------------------------------

    // Le com seguranca um checkbox por id dentro do $box do dialogo (ou do DOM).
    function isChecked($box, id) {
        var $el = ($box && $box.find) ? $box.find('#' + id) : $('#' + id);
        return !!($el.length && $el.is(':checked'));
    }

    // Aplica as transformacoes Word->SEI sobre uma STRING de HTML e devolve a
    // string transformada. Equivale ao antigo wordToSEI(iframe), porem operando
    // sobre HTML puro (sem depender do iframe do CK4). Usado dentro de
    // transformBodyHtml para funcionar igual em CK4 e CK5.
    function wordToSEIHtml(html) {
        var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
        var body = doc.body;

        // Remove tags de cabecalho/estilo/script herdadas do Word.
        body.querySelectorAll('link, script, style, meta').forEach(function (el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        // o:p (namespace Office), ancoras de comentario e lista de comentarios.
        Array.prototype.slice.call(body.getElementsByTagName('*')).forEach(function (el) {
            var name = (el.nodeName || '').toLowerCase();
            if (name === 'o:p') { if (el.parentNode) el.parentNode.removeChild(el); }
        });
        body.querySelectorAll('a.msocomanchor').forEach(function (a) {
            if (a.parentNode) a.parentNode.removeChild(a);
        });
        body.querySelectorAll('div[style="mso-element:comment-list"]').forEach(function (d) {
            if (d.parentNode) d.parentNode.removeChild(d);
        });
        // Remove comentarios HTML.
        var walker = doc.createTreeWalker(body, NodeFilter.SHOW_COMMENT, null, false);
        var comments = [];
        var node;
        while ((node = walker.nextNode())) { comments.push(node); }
        comments.forEach(function (c) { if (c.parentNode) c.parentNode.removeChild(c); });

        // p.MsoNormal -> classe SEI; desembrulha spans; converte del/ins.
        body.querySelectorAll('p.MsoNormal').forEach(function (p) {
            var align = p.getAttribute('align');
            var cls = (align === 'center') ? 'Texto_Centralizado' : 'Texto_Justificado_Recuo_Primeira_Linha';
            p.classList.remove('MsoNormal');
            p.removeAttribute('align');
            p.removeAttribute('style');
            p.classList.add(cls);

            // Desembrulha <span> (substitui pelo conteudo).
            p.querySelectorAll('span').forEach(function (sp) {
                while (sp.firstChild) sp.parentNode.insertBefore(sp.firstChild, sp);
                if (sp.parentNode) sp.parentNode.removeChild(sp);
            });

            // <del> -> texto riscado vermelho.
            p.querySelectorAll('del').forEach(function (del) {
                var text = del.innerHTML;
                if (text !== '' && text !== '&nbsp;') {
                    del.insertAdjacentHTML('afterend', '<span style="color:#FF0000;"><s>' + text + '</s></span> ');
                }
                if (del.parentNode) del.parentNode.removeChild(del);
            });
            // <ins> -> texto sublinhado azul.
            p.querySelectorAll('ins').forEach(function (ins) {
                var text = ins.innerHTML;
                if (text !== '' && text !== '&nbsp;') {
                    ins.insertAdjacentHTML('afterend', '<span style="color:#0000FF;"><u>' + text + '</u></span> ');
                }
                if (ins.parentNode) ins.parentNode.removeChild(ins);
            });
        });

        // Desembrulha o wrapper .WordSection1 (substitui pelo conteudo).
        body.querySelectorAll('.WordSection1').forEach(function (sec) {
            while (sec.firstChild) sec.parentNode.insertBefore(sec.firstChild, sec);
            if (sec.parentNode) sec.parentNode.removeChild(sec);
        });

        return body.innerHTML;
    }

    // Limpeza basica (best-effort) do HTML do Google Docs/Sheets para insercao
    // em CK5, onde a pipeline iframe-bound (DocsToSEI/convertCSSToStyle) nao roda.
    function googleHtmlToSEIBasic(html, mode) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var body = doc.body || doc.documentElement;

        body.querySelectorAll('link, script, style, meta, title').forEach(function (el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
        // Limpa os redirecionamentos de link do Google (www.google.com/url?q=).
        body.querySelectorAll('a[href]').forEach(function (a) {
            var href = a.getAttribute('href') || '';
            if (href.indexOf('https://www.google.com/url?q=') !== -1
                && typeof getParamsUrlPro === 'function') {
                try {
                    var q = getParamsUrlPro(href).q;
                    if (q) href = q;
                } catch (e) {}
            }
            a.setAttribute('href', href);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noreferrer');
        });
        return body.innerHTML;
    }

    // ----------------------------------------------------------------
    // Handlers globais (mesmos nomes que o monolito usava)
    // ----------------------------------------------------------------

    // Abre o dialogo de importacao de conteudo externo.
    window.importDocPro = function (this_) {
        // Mantem compat com CK4: popula idEditor/oEditor/iframeEditor. No CK5
        // setParamEditor eh no-op (so roda quando !isNewEditor).
        if (typeof setParamEditor === 'function') setParamEditor(this_);

        var editor = SeiProEditorAdapter.getInstance(this_);

        var htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">
                <div id="tabDialogImport" style="border: none;margin: 0;">
                    <ul style="font-size: 0.8em;">
                       <li><a href="#tabDialogImport-tab1"><i class="fas fa-upload cinzaColor" style="margin-right: 5px;"></i> Documento HTML ou Word (docx)</a></li>
                       <li><a href="#tabDialogImport-tab2"><i class="fas fa-file-alt cinzaColor" style="margin-right: 5px;"></i> Google Docs</a></li>
                       <li><a href="#tabDialogImport-tab3"><i class="fas fa-file-spreadsheet cinzaColor" style="margin-right: 5px;"></i> Google Planilhas</a></li>
                    </ul>
                    <div id="tabDialogImport-tab1">
                        <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                            <tr>
                                <td style="vertical-align: bottom; text-align: left;" class="label">
                                    <label for="fileInputImportHTMLDocx"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Importar documento HTML ou Word (docx):</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input style="width:95%" id="fileInputImportHTMLDocx" type="file" accept=".docx,.html">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex;">
                                        <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                            <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="importWord" tabindex="0">
                                            <label class="infraAreaDados" for="importWord"></label>
                                        </div>
                                        <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="importWord">Corrigir erros de codifica\u00E7\u00E3o de documentos Word</label>
                                    </div>
                                    <div style="display: flex;">
                                        <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                            <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="replaceText" tabindex="0" checked>
                                            <label class="infraAreaDados" for="replaceText"></label>
                                        </div>
                                        <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceText">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                    </div>
                                    <div style="display: flex;">
                                        <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                            <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="replaceTags" tabindex="0" checked>
                                            <label class="infraAreaDados" for="replaceTags"></label>
                                        </div>
                                        <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTags">Substituir campos din\u00E2micos no documento (se dispon\u00EDvel)</label>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="tabDialogImport-tab2">
                        <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                            <tr>
                                <td style="vertical-align: bottom; text-align: left;" class="label">
                                    <label for="urlGDocs"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Docs:</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input style="width:95%" id="urlGDocs" type="text">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex;">
                                        <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                            <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="replaceTextDocs" tabindex="0" checked>
                                            <label class="infraAreaDados" for="replaceTextDocs"></label>
                                        </div>
                                        <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextDocs">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                        <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                        Antes de importar, confira se o documento est\u00E1 acess\u00EDvel por qualquer<br>pessoa na internet.
                                        <a href="https://sei-pro.github.io/sei-pro/pages/INSERIRDOC.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a>
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div id="tabDialogImport-tab3">
                        <table style="font-size: 10pt;width: 100%;" class="seiProForm">
                            <tr>
                                <td style="vertical-align: bottom; text-align: left;" class="label">
                                    <label for="urlGSheets"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i>URL do Google Planilhas (Publicar na Web)</label>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <input style="width:95%" id="urlGSheets" type="text">
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div style="display: flex;">
                                        <div class="infraAncoraSigla" style="transform: scale(0.5);display: inline-block;float: left;">
                                            <input type="checkbox" name="infraAncoraSigla" class="infraLinkOrgao" id="replaceTextSheets" tabindex="0" checked>
                                            <label class="infraAreaDados" for="replaceTextSheets"></label>
                                        </div>
                                        <label style="font-size: 80%;padding-top: 5px;display: inline-block;" for="replaceTextSheets">Substituir todo o documento pelo conte\u00FAdo externo</label>
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label style="font-style: italic;color: #616161;margin-top: 15px;display: block;">
                                        <i class="fas fa-info-circle" style="color: #007fff;"></i>
                                        Antes de importar, confira se a planilha est\u00E1 publicada na web.<br> Aten\u00E7\u00E3o: O URL publicado na web \u00E9 diferente do URL da planilha.
                                        <br><a href="https://sei-pro.github.io/sei-pro/pages/INSERIRPLANILHA.html" target="_blank" style="text-decoration: underline; cursor: pointer; color: rgb(0, 0, 238);">Consulte nossa ajuda para mais informa\u00E7\u00F5es.</a>
                                    </label>
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        `);

        SeiProEditorAdapter.openDialog({
            id: 'dialogImportDocPro',
            title: 'Inserir conte\u00FAdo externo',
            html: htmlBox,
            width: 600,
            height: 400,
            onOpen: function ($box) {
                // mammoth (.docx -> HTML) carregado sob demanda no mundo da pagina.
                if (typeof URL_SPRO === 'string' && window.$ && $.getScript) {
                    try { $.getScript(URL_SPRO + 'js/lib/mammoth.browser.min.js'); } catch (e) {}
                }
                var $tabs = $box.find('#tabDialogImport');
                if ($tabs.tabs) $tabs.tabs();
                if (typeof initChosenReplace === 'function') {
                    try { initChosenReplace('box_multiple', $box[0], true); } catch (e) {}
                }
                setTimeout(function () { $box.find('#fileInputImportHTMLDocx').val(''); }, 500);
            },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var fileEl = $box.find('#fileInputImportHTMLDocx')[0];
                    var inputFile = fileEl ? fileEl.files : null;
                    var urlGDocs = ($box.find('#urlGDocs').val() || '').trim();
                    var urlGSheets = ($box.find('#urlGSheets').val() || '').trim();
                    if (inputFile && inputFile.length) {
                        handleFileImport(inputFile, $box, editor);
                    } else if (urlGDocs !== '') {
                        getGoogleDocs(urlGDocs, $box, editor);
                    } else if (urlGSheets !== '') {
                        getGoogleSheets(urlGSheets, $box, editor);
                    }
                }
            }]
        });
    };

    // Resolve a URL de exportacao do Google Docs e dispara a importacao.
    window.getGoogleDocs = function (url, $box, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        var regDocs = new RegExp('\\/d\\/(.*?)(\\/|$)').exec(url);
        if (regDocs !== null) {
            var urlDocs = 'https://docs.google.com/feeds/download/documents/export/Export?id=' + regDocs[1] + '&exportFormat=html';
            importGoogleByUrl(urlDocs, 'docs', editor);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Url do documento inv\u00E1lido!');
        }
    };

    // Resolve a URL publicada do Google Planilhas e dispara a importacao.
    window.getGoogleSheets = function (url, $box, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        var regSheets = new RegExp('\\/e\\/(.*?)(\\/|$)').exec(url);
        if (regSheets !== null) {
            var urlSheets = 'https://docs.google.com/spreadsheets/d/e/' + regSheets[1] + '/pubhtml';
            importGoogleByUrl(urlSheets, 'sheets', editor);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Url do documento inv\u00E1lido!');
        }
    };

    // Roteia a importacao do Google entre a pipeline rica do CK4 (loadGoogleDocs,
    // iframe-bound) e o fallback best-effort do CK5 (busca HTTP + insercao via adapter).
    window.importGoogleByUrl = function (url, mode, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        var isCK4 = (SeiProEditorAdapter.version === 4);
        if (isCK4 && typeof loadGoogleDocs === 'function' && typeof iframeEditor !== 'undefined' && iframeEditor) {
            // CK4: usa a pipeline existente (DocsToSEI/convertCSSToStyle/ImgToBase64).
            loadGoogleDocs(url, iframeEditor, mode);
            return;
        }
        // CK5 (ou CK4 sem iframe disponivel): fallback best-effort.
        if (!editor) { alertaBoxPro('Error', 'exclamation-triangle', 'Editor n\u00E3o encontrado.'); return; }
        var replace = (mode === 'sheets') ? isChecked(null, 'replaceTextSheets') : isChecked(null, 'replaceTextDocs');
        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                if (!data) {
                    alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum documento encontrado! \nConfira se o documento est\u00E1 acess\u00EDvel por qualquer pessoa na internet e tente novamente.');
                    return;
                }
                var cleaned = googleHtmlToSEIBasic(data, mode);
                SeiProEditorAdapter.withEdit(editor, function () {
                    if (replace) {
                        SeiProEditorAdapter.setData(editor, cleaned);
                    } else {
                        var p = SeiProEditorAdapter.getSelectionParagraph(editor);
                        if (p) SeiProEditorAdapter.insertHtmlBefore(editor, p, cleaned);
                        else SeiProEditorAdapter.insertHtml(editor, cleaned);
                    }
                });
                if (typeof enableButtonSavePro === 'function') enableButtonSavePro();
                if (typeof resetDialogBoxPro === 'function') {
                    try { resetDialogBoxPro('dialogImportDocPro'); } catch (e) {}
                }
            },
            error: function () {
                alertaBoxPro('Error', 'exclamation-triangle', 'Nenhum documento encontrado! \nConfira se o documento est\u00E1 acess\u00EDvel por qualquer pessoa na internet e tente novamente.');
            }
        });
    };

    // Decide o tratamento conforme a extensao do arquivo importado.
    window.handleFileImport = function (inputFile, $box, editor) {
        var file = inputFile && inputFile[0];
        if (!file) return;
        var ext = file.name.split('.').pop().toLowerCase();
        if (ext === 'docx') {
            converterDocxParaHtml(inputFile, $box, editor);
        } else if (ext === 'html' || ext === 'htm') {
            loadFileImportHTML(inputFile, $box, editor);
        } else {
            alertaBoxPro('Error', 'exclamation-triangle', 'Formato n\u00E3o suportado. Use um arquivo .docx ou .html');
        }
    };

    // Converte .docx -> HTML com mammoth e insere no editor.
    window.converterDocxParaHtml = async function (inputFile, $box, editor) {
        try {
            var file = inputFile && inputFile[0];
            if (!file) throw new Error('Nenhum arquivo .docx selecionado.');
            if (typeof mammoth === 'undefined') {
                alertaBoxPro('Error', 'exclamation-triangle', 'Conversor de Word n\u00E3o carregado. Tente novamente em instantes.');
                return;
            }
            var arrayBuffer = await file.arrayBuffer();
            var result = await mammoth.convertToHtml({ arrayBuffer: arrayBuffer });

            var r = (!isChecked($box, 'replaceText'))
                ? true
                : confirm('Deseja substituir o conte\u00FAdo atual pelo arquivo importado?');
            if (r === true) {
                loadFileImportEditor(result.value, $box, editor);
            }
            if (result.messages && result.messages.length > 0) {
                console.warn('Mensagens da convers\u00E3o:', result.messages);
            }
        } catch (erro) {
            console.error('Erro ao converter .docx:', erro);
        }
    };

    // Le um arquivo HTML local e insere no editor.
    window.loadFileImportHTML = function (files, $box, editor) {
        if (!files || files.length <= 0) { return false; }

        var fr = new FileReader();
        fr.onload = function (e) {
            var result = e.target.result;
            var r = (!isChecked($box, 'replaceText'))
                ? true
                : confirm('Deseja substituir o conte\u00FAdo atual pelo arquivo importado?');
            if (r === true) {
                loadFileImportEditor(result, $box, editor);
            }
        };
        // "Corrigir erros de codificacao": le como Windows-1252 quando marcado.
        if (isChecked($box, 'importWord')) {
            fr.readAsText(files.item ? files.item(0) : files[0], 'cP1252');
        } else {
            fr.readAsText(files.item ? files.item(0) : files[0]);
        }
        // Substituir campos dinamicos no documento (se a feature estiver disponivel).
        if (isChecked($box, 'replaceTags') && typeof replaceDadosEditor === 'function') {
            setTimeout(function () { replaceDadosEditor(); }, 500);
        }
    };

    // Insere o HTML resultante no editor (substitui tudo ou insere no cursor) e
    // aplica a limpeza Word->SEI. Portado de oEditor/iframeEditor para o adapter.
    window.loadFileImportEditor = function (result, $box, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var replace = isChecked($box, 'replaceText');

        SeiProEditorAdapter.withEdit(editor, function () {
            if (replace) {
                SeiProEditorAdapter.setData(editor, result);
            } else {
                var p = SeiProEditorAdapter.getSelectionParagraph(editor);
                if (p) SeiProEditorAdapter.insertHtmlBefore(editor, p, result);
                else SeiProEditorAdapter.insertHtml(editor, result);
            }
        });

        // Limpeza Word->SEI roda fora do model.change (CK5 proibe mutacao direta
        // do DOM do editable la dentro). setTimeout(0) aguarda a reconciliacao.
        setTimeout(function () {
            wordToSEI(editor);
            if (typeof enableButtonSavePro === 'function') enableButtonSavePro();
        }, 0);

        if (typeof resetDialogBoxPro === 'function') {
            try { resetDialogBoxPro('dialogImportDocPro'); } catch (e) {}
        }
    };

    // Limpeza de HTML colado/importado do Word. Compat: a assinatura antiga era
    // wordToSEI(iframeEditor) (jQuery do iframe CK4); agora aceita a instancia do
    // editor (ou nenhuma) e opera sobre o HTML do corpo via transformBodyHtml.
    window.wordToSEI = function (editorOrIframe) {
        var editor = (editorOrIframe && (editorOrIframe.model || editorOrIframe.name))
            ? editorOrIframe
            : SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            return wordToSEIHtml(html);
        });
    };

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'importar-doc' });
})();
