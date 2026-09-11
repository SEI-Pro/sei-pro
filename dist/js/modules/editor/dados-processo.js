/**
 * SEI Pro - Editor / Feature: Inserir Dados do Processo
 *
 * Abre um dialogo com quatro abas:
 *   1) Inserir Dados do Processo  -> select com os dados (numero, autuacao,
 *      tipo, interessados, assuntos, observacoes, QRCode, campos personalizados,
 *      etc.) montados por arrayDadosEditor(); ao confirmar insere o valor no
 *      ponto do cursor (insertDadosEditor).
 *   2) Substituir Campos Dinamicos -> aciona replaceDadosEditor() (substitui as
 *      hashtags #campo ja digitadas no corpo pelos valores reais).
 *   3) Campos Dinamicos Personalizados -> CRUD dos campos #personalizados,
 *      salvos nas observacoes da unidade (newDynamicField / editDynamicField /
 *      removeDynamicField / updateDynamicField).
 *   4) Lista de Campos Dinamicos -> referencia das hashtags disponiveis
 *      (getDialogDadosEditor_htmlListTag).
 *
 * PORTADO de CK4 para CK5:
 *  - O dialogo usava CKEDITOR.dialog.add('DadosSEI', ...) + oEditor.openDialog
 *    com 4 contents/abas e um elemento 'select' nativo do CKEditor. Agora usa
 *    SeiProEditorAdapter.openDialog (jQuery UI) com as abas montadas via
 *    $.fn.tabs() (mesmo padrao do dialogo importDocPro do monolito) e um
 *    <select id="listDados"> HTML comum.
 *  - getDadosEditor abria o dialogo via setParamEditor + oEditor.openDialog;
 *    agora resolve a instancia pelo adapter e chama getDialogDadosEditor(this_)
 *    que constroi e abre o dialogo on-demand. O caso "processo sigiloso" usa
 *    alertaBoxPro em vez do getDialogNaoDisponivel (que era um helper CK4 local).
 *  - getDialogDadosEditor era chamado no boot (sei-functions-pro.js, modo
 *    'editor') so para PRE-REGISTRAR o dialogo CKEDITOR. No modelo jQuery UI nao
 *    ha passo de registro; quando chamado sem argumento (boot) nao abre nada.
 *  - onOk/onShow do CKEDITOR viraram o botao OK e o onOpen do openDialog.
 *  - updateDynamicField localizava o <select> via
 *    CKEDITOR.dialog.getCurrent().getContentElement('tab1','listDados')._.inputId;
 *    agora opera direto sobre #listDados (id estavel no HTML do dialogo).
 *  - A insercao do valor passa pelo SeiProEditorAdapter (getInstance/withEdit/
 *    insertHtml) em insertDadosEditor.
 *
 * SHARED (permanecem no monolito / sei-functions-pro.js -- usados aqui apenas em
 * tempo de clique/boot, quando ja existem, e tambem por OUTRAS features, por
 * isso NAO sao movidos):
 *   - arrayDadosEditor (tambem usado por showTagsTips)
 *   - replaceDadosEditor (tambem usado pelo importador de arquivo; ainda
 *     acoplado ao iframe/oEditor do CK4; referenciado pelo onclick da aba 2)
 *   - checkProcessoSigiloso, alertaBoxPro, sanitizeHTML, verifyConfigValue,
 *     initChosenReplace, removeAcentos, uniqPro, jmespath, updateDadosProcesso,
 *     getDadosProcessoSession, dadosProcessoPro, siglaUnidadeAtual.
 *
 * Ver js/modules/editor/README.md.
 */
(function () {
    'use strict';

    // ----------------------------------------------------------------
    // Entry point. Bind de clique no monolito:
    //   $('.getDadosProcessoButtom').on('click', ... getDadosEditor(this))
    // Espera os dados do processo carregarem (poll) e abre o dialogo.
    // ----------------------------------------------------------------
    window.getDadosEditor = function (this_, TimeOut = 9000) {
        if (checkProcessoSigiloso()) {
            // Garante que o adapter resolveu a instancia (paridade com o fluxo
            // anterior, que chamava setParamEditor) e avisa indisponibilidade.
            SeiProEditorAdapter.getInstance(this_);
            alertaBoxPro('Error', 'exclamation-triangle', ' N\u00E3o dispon\u00EDvel para processos sigilosos');
        } else {
            if (TimeOut <= 0) { return; }
            if (typeof dadosProcessoPro.propProcesso !== 'undefined'
                && typeof dadosProcessoPro.listDocumentos !== 'undefined'
                && arrayDadosEditor().length) {
                getDialogDadosEditor(this_);
            } else {
                setTimeout(function () {
                    if (typeof dadosProcessoPro.propProcesso === 'undefined' && getDadosProcessoSession()) {
                        dadosProcessoPro = getDadosProcessoSession();
                    }
                    getDadosEditor(this_, TimeOut - 100);
                    $(this_).fadeOut(200).fadeIn(200);
                    if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload getDadosEditor');
                }, 500);
            }
        }
    };

    // ----------------------------------------------------------------
    // Constroi e abre o dialogo (jQuery UI on-demand via adapter).
    //
    // Chamado:
    //  - de getDadosEditor(this_) no clique -> abre o dialogo;
    //  - no boot (sei-functions-pro.js, modo 'editor') SEM argumento, onde no
    //    CK4 apenas pre-registrava o dialogo CKEDITOR -- aqui isso e no-op (nao
    //    abrimos dialogo sem uma instancia/clique).
    // ----------------------------------------------------------------
    window.getDialogDadosEditor = function (this_) {
        // Boot-time pre-registro (sem this_): nada a fazer no modelo jQuery UI.
        if (typeof this_ === 'undefined') return;
        if (checkProcessoSigiloso()) return;

        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        // Fixa oEditor/iframeEditor/idEditor (globais do CK4) na instancia deste
        // botao. O port tirou esta chamada por resolver a instancia pelo adapter,
        // mas replaceDadosEditor -- que continua no monolito e e acionada pela
        // aba 2 -- depende desses globais; sem eles ela olha para a primeira
        // instancia da pagina (o "Cabecalho", nos documentos com secoes) ou
        // quebra de vez se nenhum outro botao CK4 tiver sido clicado antes.
        if (typeof setParamEditor === 'function') { try { setParamEditor(this_); } catch (e) {} }

        var dadosEditorArray = arrayDadosEditor();

        // Monta as <option> do select da aba 1 a partir dos pares [label, value].
        var optionsDados = $.map(dadosEditorArray, function (v) {
            var label = (typeof v[0] !== 'undefined') ? v[0] : '';
            var value = (typeof v[1] !== 'undefined') ? v[1] : '';
            return '<option value="' + String(value).replace(/"/g, '&quot;') + '">' + label + '</option>';
        }).join('');

        // Tabela dos campos dinamicos personalizados ja salvos (aba 3).
        var tagsArray = jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'] | [0]");
        tagsArray = (tagsArray === null) ? jmespath.search(dadosProcessoPro.propProcesso.txaTagsObservacoes, "[?unidade==''] | [0]") : tagsArray;

        var tableNewDynamicField = '<table role="presentation" class="cke_dialog_ui_hbox tableZebra">'
            + ' <thead>'
            + '     <tr>'
            + '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Nome do campo din\u00E2mico</th>'
            + '         <th style="padding: 8px; background: #f3f3f3; font-weight: bold; border-top: 1px solid #b9b9b9;">Valor</th>'
            + '     </tr>'
            + ' </thead>'
            + ' <tbody>';
        if (tagsArray !== null) {
            $.each(tagsArray.tags, function (index, v) {
                tableNewDynamicField += '     <tr class="cke_dialog_ui_hbox" data-tag="' + v.name + '">'
                    + '         <td class="" role="presentation" style="width:30%; padding:8px">'
                    + '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + v.name + '</b></label>'
                    + '         </td>'
                    + '         <td class="" role="presentation" style="width:70%; padding:8px">'
                    + '             <em>' + v.value + '</em>'
                    + '             <a style="user-select: none; float: right;" data-spro-click="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'
                    + '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'
                    + '                     <i style="color: #989898;" class="fas fa-trash"></i>'
                    + '                 </span>'
                    + '             </a>'
                    + '             <a style="user-select: none; float: right; margin-right: 10px;" data-spro-click="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'
                    + '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'
                    + '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'
                    + '                 </span>'
                    + '             </a>'
                    + '         </td>'
                    + '     </tr>';
            });
        }
        tableNewDynamicField += ' </tbody>'
            + '</table>';

        // Aba 4: lista de campos dinamicos (referencia).
        var htmlListTags = ''
            + getDialogDadosEditor_htmlListTag('processo', 'N\u00FAmero do processo <em>(com link)</em>')
            + getDialogDadosEditor_htmlListTag('processo_texto', 'N\u00FAmero do processo <em>(sem link)</em>')
            + getDialogDadosEditor_htmlListTag('autuacao', 'Data de autua\u00E7\u00E3o do processo <em>(em formato DD/MM/AAAA)</em>')
            + getDialogDadosEditor_htmlListTag('tipo', 'Tipo do processo')
            + getDialogDadosEditor_htmlListTag('especificacao', 'Especifica\u00E7\u00E3o do processo')
            + getDialogDadosEditor_htmlListTag('assuntos', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(separados por v\u00EDrgula)</em>')
            + getDialogDadosEditor_htmlListTag('assuntos_lista', 'Classifica\u00E7\u00E3o por assuntos do processo <em>(em formato de lista)</em>')
            + getDialogDadosEditor_htmlListTag('interessados', 'Interessados do processo <em>(separados por v\u00EDrgula)</em>')
            + getDialogDadosEditor_htmlListTag('interessados_lista', 'Interessados do processo <em>(em formato de lista)</em>')
            + getDialogDadosEditor_htmlListTag('observacoes', 'Observa\u00E7\u00F5es do processo <em>(separados por v\u00EDrgula)</em>')
            + getDialogDadosEditor_htmlListTag('observacoes_lista', 'Observa\u00E7\u00F5es do processo <em>(em formato de lista)</em>')
            + getDialogDadosEditor_htmlListTag('observacao', 'Observa\u00E7\u00E3o da unidade atual</em>')
            + getDialogDadosEditor_htmlListTag('acesso', 'N\u00EDvel de acesso do processo')
            + getDialogDadosEditor_htmlListTag('acesso_texto', 'N\u00EDvel de acesso do processo <em>(sem \u00EDcone)</em>')
            + getDialogDadosEditor_htmlListTag('documentos', 'Lista de todos os documentos do processo (separados por v\u00EDrgula)</em>')
            + getDialogDadosEditor_htmlListTag('totaldocumentos', 'N\u00FAmero de documentos do processo</em>')
            + getDialogDadosEditor_htmlListTag('documentos_lista', 'Lista de todos os documentos do processo (em formato de lista)</em>')
            + getDialogDadosEditor_htmlListTag('hoje', 'Data de hoje <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')
            + getDialogDadosEditor_htmlListTag('ano', 'Ano corrente <em>(em formato de 4 d\u00EDgitos [YYYY])</em>')
            + getDialogDadosEditor_htmlListTag('qrcode', 'QRCode do link para acesso ao processo (SEI Interno)</em>');

        var htmlListTagsAdv = ''
            + getDialogDadosEditor_htmlListTag('assunto1', 'Primeiro assunto do processo')
            + getDialogDadosEditor_htmlListTag('assunto3', 'Terceiro assunto do processo')
            + getDialogDadosEditor_htmlListTag('interessado1', 'Primeiro interessado do processo')
            + getDialogDadosEditor_htmlListTag('interessado4', 'Quarto interessado do processo')
            + getDialogDadosEditor_htmlListTag('observacao1', 'Primeira observa\u00E7\u00E3o do processo')
            + getDialogDadosEditor_htmlListTag('observacao2', 'Segunda observa\u00E7\u00E3o do processo')
            + getDialogDadosEditor_htmlListTag('documento1', 'Primeiro documento do processo')
            + getDialogDadosEditor_htmlListTag('documento5', 'Quinto documento do processo')
            + getDialogDadosEditor_htmlListTag('documento+1', 'Pr\u00F3ximo documento do processo em rela\u00E7\u00E3o ao atual')
            + getDialogDadosEditor_htmlListTag('documento+3', 'Terceiro documento do processo em rela\u00E7\u00E3o ao atual')
            + getDialogDadosEditor_htmlListTag('documento-1', 'Primeiro documento do processo anterior ao atual')
            + getDialogDadosEditor_htmlListTag('documento-6', 'Sexto documento do processo anterior ao atual')
            + getDialogDadosEditor_htmlListTag('hoje+1', 'Amanh\u00E3 <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')
            + getDialogDadosEditor_htmlListTag('hoje-1', 'Ontem <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')
            + getDialogDadosEditor_htmlListTag('hoje+7', 'Data daqui 7 dias <em>(em formato [dia] de [m\u00EAs] de [ano])</em>')
            + getDialogDadosEditor_htmlListTag('hoje-5', 'Data \u00E0 5 dias atr\u00E1s <em>(em formato [dia] de [m\u00EAs] de [ano])</em>');

        // HTML do dialogo: abas via $.fn.tabs() (mesmo padrao do importDocPro).
        var htmlBox = ''
            + '<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 12pt;color: #616161;">'
            + '  <div id="tabDadosSEI" style="border: none;margin: 0;">'
            + '    <ul style="font-size: 0.8em;">'
            + '       <li><a href="#tabDadosSEI-tab1"><i class="fas fa-database cinzaColor" style="margin-right: 5px;"></i> Inserir Dados do Processo</a></li>'
            + '       <li><a href="#tabDadosSEI-tab2"><i class="fas fa-exchange-alt cinzaColor" style="margin-right: 5px;"></i> Substituir Campos Din\u00E2micos</a></li>'
            + '       <li><a href="#tabDadosSEI-tab3"><i class="fas fa-hashtag cinzaColor" style="margin-right: 5px;"></i> Campos Din\u00E2micos Personalizados</a></li>'
            + '       <li><a href="#tabDadosSEI-tab4"><i class="fas fa-list cinzaColor" style="margin-right: 5px;"></i> Lista de Campos Din\u00E2micos</a></li>'
            + '    </ul>'

            // Aba 1: select de dados do processo.
            + '    <div id="tabDadosSEI-tab1">'
            + '      <table style="font-size: 10pt;width: 100%;" class="seiProForm">'
            + '        <tr>'
            + '          <td style="vertical-align: bottom; text-align: left;" class="label">'
            + '            <label for="listDados"><i class="iconPopup iconSwitch fas fa-database cinzaColor"></i>Dados do Processo:</label>'
            + '          </td>'
            + '        </tr>'
            + '        <tr>'
            + '          <td>'
            + '            <select id="listDados" style="max-width: 560px; width: 100%;">' + optionsDados + '</select>'
            + '          </td>'
            + '        </tr>'
            + '      </table>'
            + '    </div>'

            // Aba 2: substituir campos dinamicos no documento.
            + '    <div id="tabDadosSEI-tab2">'
            + '      <table role="presentation" class="cke_dialog_ui_hbox">'
            + '        <tbody>'
            + '          <tr class="cke_dialog_ui_hbox">'
            + '            <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'
            + '              <label class="cke_dialog_ui_labeled_label">Substituir campos din\u00E2micos no documento</label>'
            + '            </td>'
            + '            <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'
            + '              <a style="user-select: none;" data-spro-click="replaceDadosEditor" title="Substituir" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonSigilo1_label" id="buttonSigilo1_uiElement">'
            + '                <span id="buttonSigilo1_label" class="cke_dialog_ui_button">Substituir</span>'
            + '              </a>'
            + '            </td>'
            + '          </tr>'
            + '        </tbody>'
            + '      </table>'
            + '      <div id="tabReplaceTag_result" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'
            + '    </div>'

            // Aba 3: CRUD de campos dinamicos personalizados.
            + '    <div id="tabDadosSEI-tab3">'
            + '      <table role="presentation" class="cke_dialog_ui_hbox">'
            + '        <tbody>'
            + '          <tr class="cke_dialog_ui_hbox">'
            + '            <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'
            + '              <label class="cke_dialog_ui_labeled_label" id="cke_inputNameDynamicField_label" for="cke_inputNameDynamicField_textInput">Nome do campo din\u00E2mico:</label>'
            + '            </td>'
            + '            <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'
            + '              # <input style="max-width: 510px;" tabindex="2" placeholder="Insira um nome personalizado, sem acentos ou espa\u00E7os" class="cke_dialog_ui_input_text" id="cke_inputNameDynamicField_textInput" type="text" aria-labelledby="cke_inputNameDynamicField_label">'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="cke_dialog_ui_hbox">'
            + '            <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'
            + '              <label class="cke_dialog_ui_labeled_label" id="cke_inputValueDynamicField_label" for="cke_inputValueDynamicField_textInput">Valor do campo din\u00E2mico:</label>'
            + '            </td>'
            + '            <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'
            + '              <input tabindex="3" placeholder="Insira o valor para o campo din\u00E2mico" class="cke_dialog_ui_input_text" id="cke_inputValueDynamicField_textInput" type="text" aria-labelledby="cke_inputValueDynamicField_label">'
            + '            </td>'
            + '          </tr>'
            + '          <tr class="cke_dialog_ui_hbox">'
            + '            <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:30%; padding:10px 0">'
            + '            </td>'
            + '            <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:70%; padding:10px 0">'
            + '              <a style="user-select: none;" data-spro-click="newDynamicField" title="Salvar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="buttonNewDynamicField_label" id="buttonNewDynamicField_uiElement">'
            + '                <span id="buttonNewDynamicField_label" class="cke_dialog_ui_button">Salvar</span>'
            + '              </a>'
            + '            </td>'
            + '          </tr>'
            + '        </tbody>'
            + '      </table>'
            + '      <div id="tabNewDynamicField_alert" class="tabReplaceTag_result" style="display:none; margin-top: 15px;"></div>'
            + '      <div id="tabNewDynamicField_result" class="tabReplaceTag_result" style="margin-top: 15px;">'
            + '        ' + tableNewDynamicField
            + '      </div>'
            + '      <div id="tabNewDynamicField_info" class="tabReplaceTag_result" style="margin-top: 15px;">'
            + '        <label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'
            + '          <i class="fas fa-info-circle" style="color: #007fff;"></i> Os campos din\u00E2micos personalizados s\u00E3o salvos nas observa\u00E7\u00F5es da unidade para este processo.'
            + '        </label>'
            + '      </div>'
            + '    </div>'

            // Aba 4: lista/referencia de campos dinamicos.
            + '    <div id="tabDadosSEI-tab4">'
            + '      <table role="presentation" class="cke_dialog_ui_hbox tableZebra">'
            + '        <tbody>'
            + '          <tr class="cke_dialog_ui_hbox">'
            + '            <td class="" role="presentation" style="width:100%; padding:0px">'
            + '              <div id="tabReplaceTag_list" style="height: 285px; overflow-y: scroll;">'
            + '                <label class="cke_dialog_ui_labeled_label" style="display: block;"><span style="font-size: 10pt;"><i class="fas fa-hashtag" style="color: #007fff; font-size: 12pt;"></i> Lista de campos din\u00E2micos dispon\u00EDveis para utiliza\u00E7\u00E3o</span></label>'
            + '                <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTag_uiElement">'
            + '                  <tbody>' + htmlListTags + '</tbody>'
            + '                </table>'
            + '                <label class="cke_dialog_ui_labeled_label" style="margin-top: 15px; display: block;"><span style="font-size: 10pt;"><i class="fas fa-user-ninja roxoColor" style="font-size: 12pt;"></i> Fun\u00E7\u00F5es Avan\u00E7adas</span></label>'
            + '                <table role="presentation" style="margin-top: 15px;" class="cke_dialog_ui_hbox" id="cke_tabReplaceTagAdv_uiElement">'
            + '                  <tbody>' + htmlListTagsAdv + '</tbody>'
            + '                </table>'
            + '              </div>'
            + '            </td>'
            + '          </tr>'
            + '        </tbody>'
            + '      </table>'
            + '    </div>'

            + '  </div>'
            + '</div>';

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxProDadosSEI',
            title: 'Dados do Processo',
            html: sanitizeHTML(htmlBox),
            width: 780,
            onOpen: function ($box) {
                // Inicializa as abas (jQuery UI).
                try { $box.find('#tabDadosSEI').tabs(); } catch (e) {}

                // Detectados x a substituir: mesma contagem do onShow do CK4.
                var corpoTexto = SeiProEditorAdapter.findInBody(editor, 'p');
                var joinText = (corpoTexto && corpoTexto.length)
                    ? corpoTexto.map(function () { return $(this).text(); }).get().join(' ')
                    : '';
                var arrayTags_len = (typeof getHashTagsPro === 'function')
                    ? getHashTagsPro(joinText).length : 0;
                var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'
                    + '  <i class="fas fa-info-circle" style="color: #007fff;"></i> ' + arrayTags_len + ' '
                    + (arrayTags_len == 1 ? 'campo din\u00E2mico detectado' : 'campos din\u00E2micos detectados') + '!<br>'
                    + '</label>';
                $('#tabReplaceTag_result').show().html(resultDiv);
                $('#tabNewDynamicField_alert').hide().html('');

                // Chosen no select de dados (so quando a config estiver ativa).
                if (typeof verifyConfigValue === 'function' && verifyConfigValue('substituiselecao')) {
                    var node = $box.find('#listDados')[0] || $box[0];
                    initChosenReplace('box_init', node, true);
                }
            },
            buttons: [{
                text: 'OK',
                primary: true,
                click: function ($box) {
                    // O OK so insere o dado selecionado na aba 1, mas FECHA
                    // sempre -- e o que o okButton do CK4 fazia (o onOk so
                    // cancelava o fechamento se retornasse false, o que nunca
                    // acontecia). Sem isso, quem esta em outra aba clica em OK
                    // e o dialogo nem se fecha: parece que a ferramenta travou.
                    var value = $box.find('#listDados').val();
                    if (value && value !== '') insertDadosEditor(value);
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    };

    // ----------------------------------------------------------------
    // Linha da tabela de referencia (aba 4). Extraido verbatim.
    // ----------------------------------------------------------------
    window.getDialogDadosEditor_htmlListTag = function (tag, desc) {
        return '          <tr class="cke_dialog_ui_hbox">'
            + '              <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:8px">'
            + '                  <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + tag + '</b></label>'
            + '              </td>'
            + '              <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px; vertical-align: middle;">'
            + '                  ' + desc
            + '              </td>'
            + '          </tr>';
    };

    // ----------------------------------------------------------------
    // Insere o valor escolhido (aba 1) no ponto do cursor, via adapter.
    // ----------------------------------------------------------------
    window.insertDadosEditor = function (value) {
        var ed = SeiProEditorAdapter.getInstance();
        if (!ed) return;
        SeiProEditorAdapter.withEdit(ed, function () { SeiProEditorAdapter.insertHtml(ed, value); });
    };

    // ----------------------------------------------------------------
    // CRUD dos campos dinamicos personalizados (aba 3). Operam sobre o DOM do
    // dialogo (ids estaveis); nenhuma chamada a CKEDITOR.* (a localizacao do
    // select por #listDados substitui o antigo CKEDITOR.dialog.getCurrent()).
    // ----------------------------------------------------------------
    window.removeDynamicField = function (this_) {
        $(this_).closest('tr').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).slideUp('slow', function () {
            $(this).remove();
            updateDynamicField();
            var result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'
                + '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico exclu\u00EDdo com sucesso!<br>'
                + '</label>';
            $('#tabNewDynamicField_alert').show().html(result);
        });
    };

    window.editDynamicField = function (this_) {
        var _this = $(this_);
        var _parent = _this.closest('tr');
        var name = _parent.find('td').eq(0).find('b').text().replace('#', '');
        var value = _parent.find('td').eq(1).find('em').text();
        $('#cke_inputNameDynamicField_textInput').val(name);
        $('#cke_inputValueDynamicField_textInput').val(value);
    };

    window.newDynamicField = function (this_) {
        var _this = $(this_);
        var _parent = _this.closest('table');
        var nameInput = _parent.find('#cke_inputNameDynamicField_textInput');
        var valueInput = _parent.find('#cke_inputValueDynamicField_textInput');
        var arrayRestictTags = uniqPro($('#tabReplaceTag_list table').find('b').map(function () { return $(this).text().replace(/[^a-zA-Z_]+/g, ''); }).get());
        var name = (nameInput.val() != '') ? removeAcentos(nameInput.val().split(':')[0].replace('#', '')).replace(/\ /g, '').toLowerCase().trim() : nameInput.val();
        var value = valueInput.val().trim();
        var result = '';
        $('#tabNewDynamicField_alert').hide().html('');
        if (name != '' && value != '') {
            if ($.inArray(name, arrayRestictTags) === -1) {
                var htmlNewDynamicField = '     <tr class="cke_dialog_ui_hbox" data-tag="' + name + '">'
                    + '         <td class="" role="presentation" style="width:30%; padding:8px">'
                    + '             <label class="cke_dialog_ui_labeled_label"><b class="hashSpan">#' + name + '</b></label>'
                    + '         </td>'
                    + '         <td class="" role="presentation" style="width:70%; padding:8px">'
                    + '             <em>' + value + '</em>'
                    + '             <a style="user-select: none; float: right;" data-spro-click="removeDynamicField" title="Remover" hidefocus="true" class="cke_dialog_ui_button" role="button">'
                    + '                 <span id="buttonRemoveDynamicField_label" class="cke_dialog_ui_button">'
                    + '                     <i style="color: #989898;" class="fas fa-trash"></i>'
                    + '                 </span>'
                    + '             </a>'
                    + '             <a style="user-select: none; float: right; margin-right: 10px;" data-spro-click="editDynamicField" title="Editar" hidefocus="true" class="cke_dialog_ui_button" role="button">'
                    + '                 <span id="buttonEditDynamicField_label" class="cke_dialog_ui_button">'
                    + '                     <i style="color: #989898;" class="fas fa-pencil-alt"></i>'
                    + '                 </span>'
                    + '             </a>'
                    + '         </td>'
                    + '     </tr>';
                var trTagEdit = $('#tabNewDynamicField_result').find('table tbody').find('tr[data-tag="' + name + '"]');
                if (trTagEdit.length == 0) {
                    $('#tabNewDynamicField_result').find('table tbody').prepend(htmlNewDynamicField);
                    $('#tabNewDynamicField_result').find('table tbody').find('tr').eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                } else {
                    trTagEdit.find('td').eq(0).find('b').text('#' + name);
                    trTagEdit.find('td').eq(1).find('em').text(value);
                    trTagEdit.eq(0).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
                }
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'
                    + '  <i class="fas fa-check-circle verdeColor"></i> Campo din\u00E2mico salvo com sucesso!<br>'
                    + '</label>';
                nameInput.val('');
                valueInput.val('');
                updateDynamicField();
            } else {
                result = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'
                    + '  <i class="fas fa-info-circle" style="color: #007fff;"></i> Nome restrito para utiliza&#x00E7;&#x00E3;o interna (Lista de campos din&#x00E2;micos). Insira outro nome!'
                    + '</label>';
            }
            $('#tabNewDynamicField_alert').show().html(result);
        }
    };

    window.updateDynamicField = function () {
        // No CK4 o select era localizado por
        // CKEDITOR.dialog.getCurrent().getContentElement('tab1','listDados')._.inputId.
        // No dialogo jQuery UI o id e estavel: #listDados.
        var $select = $('#listDados');
        $select.find('option').each(function () {
            if ($(this).text().trim().split(' ')[0] == 'Personalizado') {
                $(this).remove();
            }
        });

        var txtObsDynamicField = '';
        var arrayNewDynamicField = [];
        $('#tabNewDynamicField_result').find('table tbody tr').each(function (index, value) {
            var name = $(this).find('td').eq(0).find('b').text().trim().replace('#', '');
            var value = $(this).find('td').eq(1).find('em').text().trim();
            $select.append('<option value="' + value + '">Personalizado (' + siglaUnidadeAtual + ') #' + name + ': ' + value + '</option>');
            arrayNewDynamicField.push({ name: name, value: value });
            txtObsDynamicField += '#' + name + ': ' + value + '\n';
        });

        $.each(dadosProcessoPro.propProcesso.txaTagsObservacoes, function (index, value) {
            if (value.unidade == siglaUnidadeAtual) {
                dadosProcessoPro.propProcesso.txaTagsObservacoes[index].tags = arrayNewDynamicField;
            }
        });
        var txaObservacoes = jmespath.search(dadosProcessoPro.propProcesso.txaObservacoes, "[?unidade=='" + siglaUnidadeAtual + "'].observacao | [0]");
        txtObsDynamicField = (txaObservacoes !== null) ? txtObsDynamicField + txaObservacoes : txtObsDynamicField;
        updateDadosProcesso('txaObservacoes', txtObsDynamicField);
        console.log('arrayNewDynamicField', arrayNewDynamicField, txtObsDynamicField);
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'dados-processo' });
    }
})();
