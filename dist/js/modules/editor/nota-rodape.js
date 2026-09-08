/**
 * SEI Pro - Editor Feature: nota-rodape
 *
 * Inserir/gerenciar notas de rodape no documento do editor (CK4/CK5).
 * Entrada: getNotaRodape (botao da toolbar). Abre um dialogo jQuery UI
 * on-demand (via SeiProEditorAdapter.openDialog) com abas:
 *   - Texto livre
 *   - Padrao ABNT (preview montado a partir de campos)
 *   - Atualizar notas (renumera/reordena)
 *   - Remover notas (remove todas)
 *
 * Portado do monolito sei-pro-editor.js. Toda interacao com o editor passa
 * pelo SeiProEditorAdapter; o dialogo CK4 (.cke_dialog_page_contents) foi
 * substituido por leitura direta dos inputs por id dentro do $box do dialogo.
 *
 * Helpers compartilhados (definidos no monolito / sei-functions-pro.js,
 * chamados apenas em tempo de clique): sanitizeHTML, alertaBoxPro,
 * setMomentPtBr, capitalizeFirstLetter, isValidHttpUrl, randomString,
 * clickScroolToRef, moment.
 */
(function () {
    'use strict';

    // INSERE NOTAS DE RODAPE
    window.getNotaRodape = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        openDialogNotaRodape(editor);
    };

    // Mantemos o nome antigo para compatibilidade com initFunctions() -- em
    // CK4/CK5 o dialogo agora eh jQuery UI, registrado sob demanda ao clicar.
    window.getDialogNotaRodape = function () { /* no-op: dialogo on-demand em openDialogNotaRodape() */ };

    /**
     * Abre o dialogo de insercao de nota de rodape (jQuery UI via adapter).
     * Substitui o antigo CKEDITOR.dialog -- compativel com CK4 e CK5.
     */
    window.openDialogNotaRodape = function (editor) {
        // Estilos inline no container para isolar do CSS herdado do SEI 5 (que
        // aumenta fontes/linhas no documento). `all:initial` nao pode ser usado
        // pois jQuery UI depende de heranca; limitamos com font-size/box-sizing.
        var htmlBox = sanitizeHTML(`
            <div class="dialogBoxDiv seipro-dialog-compact" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">
                <style>
                    .seipro-dialog-compact, .seipro-dialog-compact * { box-sizing:border-box; font-size:13px; }
                    .seipro-dialog-compact label { display:block; font-size:12px; color:#555; margin-bottom:2px; }
                    .seipro-dialog-compact input, .seipro-dialog-compact textarea, .seipro-dialog-compact select { font-size:13px; padding:4px 6px; border:1px solid #ccc; border-radius:3px; line-height:1.3; }
                    .seipro-dialog-compact textarea { resize:vertical; min-height:60px; max-height:200px; }
                    .seipro-dialog-compact .ui-tabs-nav { font-size:12px; padding:0; }
                    .seipro-dialog-compact .ui-tabs-nav li { line-height:1.2; }
                    .seipro-dialog-compact .ui-tabs-nav .ui-tabs-anchor { padding:6px 12px; font-size:12px; }
                    .seipro-dialog-compact .ui-tabs .ui-tabs-panel { padding:10px 12px; font-size:13px; }
                    .seipro-dialog-compact table.seiProForm td { padding:3px 4px; }
                    .seipro-dialog-compact button.ui-button { font-size:12px; padding:4px 10px; }
                </style>
                <div id="ntRodapeTabs" class="seiProTabs">
                    <ul>
                        <li><a href="#ntTabLivre">Texto livre</a></li>
                        <li><a href="#ntTabAbnt">Padr\u00E3o ABNT</a></li>
                        <li><a href="#ntTabUpdate">Atualizar notas</a></li>
                        <li><a href="#ntTabRemove">Remover notas</a></li>
                    </ul>
                    <div id="ntTabLivre">
                        <label for="textNotaRodape">Texto da nota de rodap\u00E9:</label>
                        <textarea id="textNotaRodape" rows="3" style="width:100%;margin-top:4px;"></textarea>
                    </div>
                    <div id="ntTabAbnt">
                        <table style="width:100%;border-spacing:4px;" class="seiProForm">
                            <tr>
                                <td><label>Nome do autor</label><input type="text" id="nr_Nome" style="width:100%"></td>
                                <td><label>Sobrenome do autor</label><input type="text" id="nr_Sobrenome" style="width:100%"></td>
                            </tr>
                            <tr>
                                <td colspan="2"><label>T\u00EDtulo da publica\u00E7\u00E3o</label><input type="text" id="nr_Titulo" style="width:100%"></td>
                            </tr>
                            <tr>
                                <td><label>N\u00FAmero da edi\u00E7\u00E3o</label><input type="number" id="nr_Edicao" style="width:100%"></td>
                                <td><label>Ano da publica\u00E7\u00E3o</label><input type="number" id="nr_Ano" style="width:100%"></td>
                            </tr>
                            <tr>
                                <td><label>Local (cidade)</label><input type="text" id="nr_Local" style="width:100%"></td>
                                <td><label>Nome da editora</label><input type="text" id="nr_Editora" style="width:100%"></td>
                            </tr>
                            <tr>
                                <td><label>N\u00FAmero do volume</label><input type="number" id="nr_Volume" style="width:100%"></td>
                                <td><label>P\u00E1ginas inicial-final</label><input type="text" id="nr_Paginas" style="width:100%"></td>
                            </tr>
                            <tr>
                                <td><label>Link da publica\u00E7\u00E3o</label><input type="text" id="nr_Link" style="width:100%"></td>
                                <td><label>Data do acesso</label><input type="date" id="nr_Data" style="width:100%"></td>
                            </tr>
                        </table>
                        <div id="nrABNTResult" style="margin-top:8px;padding:6px 8px;background:#f9f9dc;border-radius:4px;white-space:break-spaces;min-height:24px;font-size:12px;"></div>
                    </div>
                    <div id="ntTabUpdate" style="padding:10px 0;">
                        <p>Atualiza numera\u00E7\u00F5es e ordem das notas de rodap\u00E9 j\u00E1 existentes no documento.</p>
                        <button type="button" id="btnNrUpdate" class="ui-button ui-state-default ui-corner-all">Atualizar</button>
                    </div>
                    <div id="ntTabRemove" style="padding:10px 0;">
                        <p>Remove <strong>todas</strong> as notas de rodap\u00E9 do documento. N\u00E3o pode ser desfeito via Ctrl+Z.</p>
                        <button type="button" id="btnNrRemove" class="ui-button ui-state-default ui-corner-all">Remover todas</button>
                    </div>
                </div>
            </div>
        `);

        SeiProEditorAdapter.openDialog({
            id: 'dialogNotaRodapePro',
            title: 'Inserir nota de rodap\u00E9',
            html: htmlBox,
            width: 560,
            height: 460,
            onOpen: function ($box) {
                // Tabs jQuery UI (API requer que jquery-ui esteja carregado).
                var $tabs = $box.find('#ntRodapeTabs');
                if ($tabs.tabs) $tabs.tabs();
                // Preview ABNT atualiza a cada alteracao.
                $box.find('#ntTabAbnt input').on('input change', function () { updateNrABNT($box); });
                $box.find('#btnNrUpdate').on('click', function () { updateNtRodape(editor); });
                $box.find('#btnNrRemove').on('click', function () {
                    removeNtRodape(null, editor);
                    try { $box.dialog('close'); } catch (e) {}
                });
            },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var txt_NotaRodapeLivre = ($box.find('#textNotaRodape').val() || '').trim();
                    var txt_NotaRodapeABNT = ($box.find('#nrABNTResult').html() || '').trim();
                    var txt_NotaRodape = txt_NotaRodapeABNT || txt_NotaRodapeLivre;
                    if (txt_NotaRodape) {
                        insertNtRodape(txt_NotaRodape, editor);
                        try { $box.dialog('close'); } catch (e) {}
                    }
                }
            }]
        });
    };

    window.removeNtRodape = function (this_, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
            var body = doc.body;
            // Remove paragrafos com classe ntRodape (corpo do rodape) e separador.
            body.querySelectorAll('.ntRodape, .ntRodape_tr').forEach(function (el) { el.parentNode.removeChild(el); });
            // Remove os <sup> que contem .ntRodape_item.
            body.querySelectorAll('.ntRodape_item[data-ntrodape-ref]').forEach(function (item) {
                var sup = item.closest('sup');
                (sup || item).remove();
            });
            // Remove ancoras antigas (CK4 saved-href).
            body.querySelectorAll('a[data-cke-saved-href*="#footer_"]').forEach(function (a) { a.parentNode.removeChild(a); });
            return body.innerHTML;
        });
        alertaBoxPro('Sucesso', 'check-circle', 'Notas de rodap\u00E9 removidas com sucesso');
    };

    // Recebe o $box do dialogo e le os campos ABNT por id (substitui o antigo
    // .closest('.cke_dialog_page_contents') do CK4, que nao existe no jQuery UI).
    window.updateNrABNT = function (this_) {
        setMomentPtBr();
        var $box = (this_ && this_.find) ? this_ : $(this_);

        var nr_Nome = $box.find('#nr_Nome').val();
            nr_Nome = (nr_Nome != '') ? ', ' + capitalizeFirstLetter(nr_Nome.trim()) : nr_Nome;
        var nr_Sobrenome = $box.find('#nr_Sobrenome').val();
            nr_Sobrenome = (nr_Sobrenome != '') ? nr_Sobrenome.toUpperCase() : nr_Sobrenome;
        var nr_Titulo = $box.find('#nr_Titulo').val();
            nr_Titulo = (nr_Titulo != '') ? '. <strong>' + capitalizeFirstLetter(nr_Titulo.trim()) + '</strong>' : nr_Titulo;
        var nr_Edicao = $box.find('#nr_Edicao').val();
            nr_Edicao = (nr_Edicao != '') ? '. ' + nr_Edicao + '. ed.' : nr_Edicao;
        var nr_Local = $box.find('#nr_Local').val();
            nr_Local = (nr_Local != '') ? ', ' + capitalizeFirstLetter(nr_Local.trim()) : nr_Local;
        var nr_Editora = $box.find('#nr_Editora').val();
            nr_Editora = (nr_Editora != '') ? ': ' + capitalizeFirstLetter(nr_Editora.trim()) : nr_Editora;
        var nr_Ano = $box.find('#nr_Ano').val();
            nr_Ano = (nr_Ano != '') ? ', ' + nr_Ano : nr_Ano;
        var nr_Volume = $box.find('#nr_Volume').val();
            nr_Volume = (nr_Volume != '') ? ', v. ' + nr_Volume : nr_Volume;
        var nr_Paginas = $box.find('#nr_Paginas').val();
            nr_Paginas = (nr_Paginas != '') ? '. p.' + nr_Paginas : nr_Paginas;
        var nr_Link = $box.find('#nr_Link').val();
            nr_Link = (nr_Link != '' && isValidHttpUrl(nr_Link)) ? '. Dispon\u00EDvel em: <a href="' + nr_Link + '" target="_blank">&lt;' + nr_Link + '&gt;</a>' : '';
        var nr_Data = $box.find('#nr_Data').val();
            nr_Data = (nr_Data != '') ? '. Acesso em: ' + moment(nr_Data).format('ll') : nr_Data;

        var htmlResult = nr_Sobrenome + nr_Nome + nr_Titulo + nr_Edicao + nr_Local + nr_Editora + nr_Ano + nr_Volume + nr_Paginas + nr_Link + nr_Data;
        if (htmlResult != '') {
            $box.find('#nrABNTResult').show().html(htmlResult + '.');
        }
    };

    window.insertNtRodape = function (txt_NotaRodape, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var randRef = randomString(16);
        // Placeholder temporario "?"; reorderNtRodape numera sequencialmente depois.
        var ntRodapeHtml_footer = '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape"><a name="footer_' + randRef + '" href="#item_' + randRef + '" class="anchorRefInternaPro"><span class="ntRodape_footer ancoraSei" data-ntrodape-ref="' + randRef + '" data-ntrodape="?"  contenteditable="false">[?]</span></a> ' + txt_NotaRodape + '</p>';
        var ntRodapeHtml_item = '<sup><a href="#footer_' + randRef + '" name="item_' + randRef + '" class="anchorRefInternaPro"><span class="ntRodape_item ancoraSei" data-ntrodape="?" data-ntrodape-ref="' + randRef + '" contenteditable="false">[?]</span></a></sup> ';

        SeiProEditorAdapter.withEdit(editor, function () {
            var separador = SeiProEditorAdapter.findInBody(editor, '.ntRodape_tr');
            if (!separador || separador.length === 0) {
                SeiProEditorAdapter.appendToBody(editor, '<p class="Tabela_Texto_Alinhado_Esquerda ntRodape_tr">____________________________</p>');
            }
            SeiProEditorAdapter.appendToBody(editor, ntRodapeHtml_footer);
            SeiProEditorAdapter.insertHtml(editor, ntRodapeHtml_item);
        });
        // Renumeracao eh feita fora do model.change (que proibe mutacao direta do
        // DOM do editable em CK5). setTimeout(0) aguarda o CK5 reconciliar a view.
        setTimeout(function () { reorderNtRodape(editor); }, 0);
        clickScroolToRef();
    };

    window.updateNtRodape = function (editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        reorderNtRodape(editor);
    };

    // reorderNtRodape funciona em CK4 (DOM iframe direto) e CK5 (transformBodyHtml,
    // que serializa para HTML, manipula via DOMParser e re-seta a root do corpo).
    // Aceita compat: assinatura antiga era reorderNtRodape(iframeEditor).
    window.reorderNtRodape = function (editorOrIframe) {
        var editor = (editorOrIframe && editorOrIframe.model) ? editorOrIframe : SeiProEditorAdapter.getInstance();
        if (!editor) return;
        SeiProEditorAdapter.transformBodyHtml(editor, function (html) {
            // Parse o HTML para um documento temporario sem afetar a pagina.
            var doc = new DOMParser().parseFromString('<!doctype html><html><body>' + html + '</body></html>', 'text/html');
            var body = doc.body;

            // 1. Renumera items (sup) e footers em ordem do DOM.
            var items = Array.from(body.querySelectorAll('.ntRodape_item[data-ntrodape-ref]'));
            items.forEach(function (item, idx) {
                var id = idx + 1;
                item.setAttribute('data-ntrodape', id);
                item.textContent = '[' + id + ']';
                var ref = item.getAttribute('data-ntrodape-ref');
                var footer = body.querySelector('.ntRodape_footer[data-ntrodape-ref="' + ref + '"]');
                if (footer) {
                    footer.setAttribute('data-ntrodape', id);
                    footer.textContent = '[' + id + ']';
                }
            });

            // 2. Move todos os <p> de footer para o final, ordenados; descarta orfaos.
            var footerParas = Array.from(body.querySelectorAll('.ntRodape')).filter(function (p) {
                return p.querySelector('.ntRodape_footer[data-ntrodape-ref]');
            });
            var keep = [];
            footerParas.forEach(function (p) {
                var ftr = p.querySelector('.ntRodape_footer');
                var ref = ftr.getAttribute('data-ntrodape-ref');
                var hasItem = body.querySelector('.ntRodape_item[data-ntrodape-ref="' + ref + '"]');
                if (hasItem) keep.push({ id: parseInt(ftr.getAttribute('data-ntrodape')), html: p.outerHTML });
                p.parentNode.removeChild(p);
            });
            keep.sort(function (a, b) { return a.id - b.id; });
            keep.forEach(function (entry) { body.insertAdjacentHTML('beforeend', entry.html); });

            return body.innerHTML;
        });
    };

    // Registra a feature (leve: id). Idempotente.
    SeiProEditorAdapter.registerFeature({ id: 'nota-rodape' });
})();
