// `isNewEditor` historicamente diferenciava o layout visual "novo" (Infra).
// No SEI 5 o window.CKEDITOR coexiste com o CK5 (nao eh mais um sinal seguro),
// entao checamos primeiro o marcador DOM do CKEditor 5.
const isNewEditor = !!document.querySelector('.ck-editor__editable_inline') || (typeof CKEDITOR === 'undefined');
var 
    frmEditor = isNewEditor ? $('.infra-editor__editor-completo') : $('#frmEditor'),
    idEditor,
    oEditor, 
    imgEditor, 
    bookmark,
    txaEditor = (frmEditor.length) ? 'div[id^=cke_txaEditor_]' : 'div#cke_txaConteudo',
    editorTitle = (frmEditor.length) ? 'iframe[title*="txaEditor_"]' : 'iframe[title*="txaConteudo"]',
    iframeEditor,
    autoSaveEditor,
    langs,
    wsDialogHtml,
    indexDisplayPro = 0,
    lastTextTip = false,
    resultTextTip = false,
    CKWebSpeechHandler;

    txaEditor = isNewEditor ? '.infra-editor__editor-completo' : txaEditor;


var loadOnKeyEditor = false;
var CKWebSpeech = false;

var autoSaveInterval = (checkConfigValue('salvamentoautomatico')) ? getConfigValue('salvamentoautomatico') : 5;
var isIntervalInProgress = false;
var isSeiSlim = (localStorage.getItem('seiSlim')) ? true : false;
var isDarkMode = (localStorage.getItem('darkModePro')) ? true : false;
var qualidadeImagens = (checkConfigValue('qualidadeimagens')) ? getConfigValue('qualidadeimagens') : 60;
    qualidadeImagens = (qualidadeImagens > 100) ? 100 : qualidadeImagens;
    qualidadeImagens = (qualidadeImagens < 0) ? 0 : qualidadeImagens;

function setParamEditor(this_) {
    if (!isNewEditor) {
        idEditor = $(this_).closest('div.cke').attr('id').replace('cke_', '');
        oEditor = CKEDITOR.instances[idEditor];
        iframeEditor = (frmEditor.length) ? $('iframe[title*="'+idEditor+'"]').contents() : $(txaEditor).find('iframe[title*="txaConteudo"]').contents();
        $('#idEditor').val(idEditor);
    }
}
function htmlButton(status) {
   
    var classStatus = ( status == 'disable' ) ? 'cke_button_disabled' : '';
    var icon16baseImport = URL_SPRO + 'icons/menu/import.png';
    var icon16baseTable = URL_SPRO + 'icons/menu/table.png';
    var icon16baseLegis = URL_SPRO + 'icons/menu/legis.png';
    var icon16baseCapLetter = URL_SPRO + 'icons/menu/capletter.png';
    var icon16baseCitaDocumento = URL_SPRO + 'icons/menu/citacao.png';
    var icon16baseNotaRodape = URL_SPRO + 'icons/menu/notarodape.png';
    var icon16baseSumario = URL_SPRO + 'icons/menu/sumario.png';
    var icon16baseDadosProcesso = URL_SPRO + 'icons/menu/dadosprocesso.png';
    var icon16baseTinyUrl = URL_SPRO + 'icons/menu/tinyurl.png';
	var icon16baseQrCode = URL_SPRO + 'icons/menu/qrcode.png';
	var icon16basePageBreak = URL_SPRO + 'icons/menu/pagebreak.png';
	var icon16baseSessionBreak = URL_SPRO + 'icons/menu/sessionbreak.png';
    var icon16baseLatex = URL_SPRO + 'icons/menu/latex.png';
    var icon16baseQuickTable = URL_SPRO + 'icons/menu/quicktable.png';
    var icon16baseFonteSizeUp = URL_SPRO + 'icons/menu/fontsizeup.png';
    var icon16baseFonteSizeDown = URL_SPRO + 'icons/menu/fontsizedown.png';
    var icon16baseCopyStyle = URL_SPRO + 'icons/menu/copystyle.png';
    var icon16baseAlignCenter = URL_SPRO + 'icons/menu/aligncenter.png';
    var icon16baseAlignRight = URL_SPRO + 'icons/menu/alignright.png';
    var icon16baseAlignLeft = URL_SPRO + 'icons/menu/alignleft.png';
    var icon16baseAlignJustify = URL_SPRO + 'icons/menu/alignjustify.png';
    var icon16baseDocPublico = URL_SPRO + 'icons/menu/docpublico.png';
    var icon16baseWatermark = URL_SPRO + 'icons/menu/watermark.png';
    var icon16baseImagePage = URL_SPRO + 'icons/menu/imagepage.png';
    var icon16baseMarkSigilo = URL_SPRO + 'icons/menu/marksigilo.png';
    var icon16baseBoxSigilo = URL_SPRO + 'icons/menu/boxsigilo.png';
    var icon16baseAutoSave = URL_SPRO + 'icons/menu/autosave.png';
    var icon16baseSEILegis = URL_SPRO + 'icons/menu/seilegis.png';
    var icon16baseBatchImgQuality = URL_SPRO + 'icons/menu/batchimgquality.png';
    var icon16baseInsertCheckboxQuality = URL_SPRO + 'icons/menu/insertcheckbox.png';
    var icon16baseOpenAI = URL_SPRO + 'icons/menu/openai.png';
    var icon16baseRefInterna = URL_SPRO + 'icons/menu/refinterna.png';
    var icon16baseReview = URL_SPRO + 'icons/menu/review.png';
    var icon16baseCtrReview = URL_SPRO + 'icons/menu/ctrreview.png';
    var icon16baseNewStyle = URL_SPRO + 'icons/menu/newstyle.png';
/* 
    
 */
    const htmlButtonTable = 
        '<div class="divQuickTable" style="display:none;"></div>' +
        htmlButtonPro(
            'getQuickTableButtom',
            'quicktable',
            'Tabela R\u00E1pida',
            isNewEditor ? 'fab fa-bolt rosaColor' : icon16baseQuickTable
        ) +
        htmlButtonPro(
            'getTablestylesButtom',
            'tablestyles',
            'Adicionar estilo \u00E0 tabela',
            isNewEditor ? 'fab fa-paint-brush rosaColor' : icon16baseTable
        );
    
    const htmlButtonAfterImage = 
        htmlButtonPro(
            'getBatchImgQualityButtom',
            'batch_quality_pro',
            'Reduzir qualidade das imagens',
            isNewEditor ? 'fab fa-compress azulColor' : icon16baseBatchImgQuality
        ) +
        htmlButtonPro(
            'getInsertCheckboxButtom',
            'insert_checkbox_pro',
            'Inserir caixa de sele\u00E7\u00E3o',
            isNewEditor ? 'fab fa-check-square azulColor' : icon16baseInsertCheckboxQuality
        );
    
    const htmlButtonBeforeCut = 
        htmlButtonPro(
            'getCopyStyleButtom',
            'copy_style_pro',
            'Copiar formata\u00E7\u00E3o',
            isNewEditor ? 'fab fa-brush rosaColor' : icon16baseCopyStyle
        );
    
    const htmlButtonBeforeList = 
        '<div class="divAlignText" style="display:none;">' +
            htmlButtonPro(
                'getAlignLeftButtom',
                'align_left_pro',
                'Alinhar texto \u00E0 esquerda',
                isNewEditor ? 'fab fa-align-left roxoColor' : icon16baseAlignLeft
            ) +
            htmlButtonPro(
                'getAlignCenterButtom',
                'align_center_pro',
                'Alinhar texto ao centro',
                isNewEditor ? 'fab fa-align-center roxoColor' : icon16baseAlignCenter
            ) +
            htmlButtonPro(
                'getAlignRightButtom',
                'align_right_pro',
                'Alinhar texto \u00E0 direita',
                isNewEditor ? 'fab fa-align-right roxoColor' : icon16baseAlignRight
            ) +
            htmlButtonPro(
                'getAlignJustifyButtom',
                'align_justify_pro',
                'Alinhar texto justificadamente',
                isNewEditor ? 'fab fa-align-justify roxoColor' : icon16baseAlignJustify
            ) +
        '</div>' +
        htmlButtonPro(
            'getAlignButtom',
            'align_pro',
            'Alinhar texto roxoColor',
            isNewEditor ? 'fab fa-align-left roxoColor' : icon16baseAlignCenter
        );

    const htmlButtonAfterLetters = 
        htmlButtonPro(
            'getCapLetterButtom', 
            'capletter_pro', 
            'Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)', 
            isNewEditor ? 'fab fa-font-case cianoColor' : icon16baseCapLetter
        ) +
        htmlButtonPro(
            'getFontSizeUpButtom', 
            'fontsize_up_pro', 
            'Aumentar tamanho da fonte', 
            isNewEditor ? 'fab fa-sort-alpha-up cianoColor' : icon16baseFonteSizeUp
        ) +
        htmlButtonPro(
            'getFontSizeDownButtom', 
            'fontsize_down_pro', 
            'Diminuir tamanho da fonte cianoColor', 
            isNewEditor ? 'fab fa-sort-alpha-down cianoColor' : icon16baseFonteSizeDown
        );

    const htmlButtonAfterSave = htmlButtonPro(
        'getAutoSaveButtom',
        'autosave',
        `Salvamento autom\u00E1tico (${autoSaveInterval} ${autoSaveInterval === 1 ? 'minuto' : 'minutos'})`,
        isNewEditor ? '' : icon16baseAutoSave
    );

    const htmlButton = 
        (restrictConfigValue('ferramentasia') ? 
            htmlButtonPro(
                'getPlataformAIButtom',
                'openai',
                'Inserir texto de intelig\u00EAncia artificial',
                isNewEditor ? 'fab fa-robot roxoColor' : icon16baseOpenAI
            ) : '') +
        htmlButtonPro(
            'importDocButtom',
            'externalfile',
            'Inserir conte\u00FAdo externo',
            isNewEditor ? 'fab fa-upload vermelhoColor' : icon16baseImport
        ) +
        htmlButtonPro(
            'getLinkLegisButtom',
            'linklegis',
            'Adicionar link de legisla\u00E7\u00E3o',
            isNewEditor ? 'fab fa-balance-scale-right verdeColor' : icon16baseLegis
        ) +
        (frmEditor.length ? 
            htmlButtonPro(
                'getCitacaoDocumentoButtom',
                'citacaodoc',
                'Inserir refer\u00EAncia de documento do processo',
                isNewEditor ? 'fab fa-folder-tree amareloColor' : icon16baseCitaDocumento
            ) : '') +
        htmlButtonPro(
            'getNotaRodapeButtom',
            'notarodape',
            'Inserir nota de rodap\u00E9',
            isNewEditor ? 'fab fa-comment-alt-dots cianoColor' : icon16baseNotaRodape
        ) +
        htmlButtonPro(
            'getRefInternaButtom',
            'refinterna',
            'Inserir refer\u00EAncia interna',
            isNewEditor ? 'fab fa-retweet cianoColor' : icon16baseRefInterna
        ) +
        htmlButtonPro(
            'getSumarioButtom',
            'sumario',
            'Inserir sum\u00E1rio',
            isNewEditor ? 'fab fa-list-alt roxoColor' : icon16baseSumario
        ) +
        (frmEditor.length == 0 ? '' : 
            htmlButtonPro(
                'getDadosProcessoButtom',
                'dadosprocesso',
                'Inserir dados do processo',
                isNewEditor ? 'fab fa-book-spells rosaColor' : icon16baseDadosProcesso
            )
        ) +
        htmlButtonPro(
            'getTinyUrlButtom',
            'tinyurl',
            'Gerar link curto do TinyURL',
            isNewEditor ? 'fab fa-compress-arrows-alt azulColor' : icon16baseTinyUrl
        ) +
        htmlButtonPro(
            'getQrCodeButtom',
            'qrcode',
            'Gerar C\u00F3digo QR',
            isNewEditor ? 'fab fa-qrcode rosaColor' : icon16baseQrCode
        ) +
        htmlButtonPro(
            'getPageBreakButtom',
            'pagebreak',
            'Inserir Quebra de P\u00E1gina',
            isNewEditor ? 'fab fa-page-break azulColor' : icon16basePageBreak,
            '', 
            isSeiSlim ? '' : '!important'
        ) +
        htmlButtonPro(
            'getSessionBreakButtom',
            'sessionbreak',
            'Inserir Quebra de Se\u00E7\u00E3o',
            isNewEditor ? 'fab fa-page-break verdeColor' : icon16baseSessionBreak
        ) +
        htmlButtonPro(
            'getLatexButtom',
            'latex',
            'Inserir Equa\u00E7\u00E3o',
            isNewEditor ? 'fab fa-sigma vermelhoColor' : icon16baseLatex
        ) +
        htmlButtonPro(
            'getProcessoPublicoButton',
            'processopublico',
            'Adicionar Link de Documento P\u00FAblico',
            isNewEditor ? 'fab fa-globe-americas azulColor' : icon16baseDocPublico
        ) +
        htmlButtonPro(
            'getMinutaWatermarkButton',
            'watermark',
            'Adicionar Marca D\'\u00E1gua de MINUTA/MODELO',
            isNewEditor ? 'fab fa-layer-plus verdeColor' : icon16baseWatermark
        ) +
        htmlButtonPro(
            'pageImageBackgroundButtom',
            'pageimagebackground',
            'Adicionar Image de Fundo e Configura\u00E7\u00F5es de P\u00E1gina para Impress\u00E3o',
            isNewEditor ? 'fab fa-print roxoColor' : icon16baseImagePage
        );

    const htmlButtonReview = checkConfigValue('revisaotexto') ? 
        htmlButtonPro(
            'getReviewButton',
            'review',
            'Ativar revis\u00E3o de texto',
            isNewEditor ? 'fab fa-user-edit azulColor' : icon16baseReview
        ) + 
        htmlButtonPro(
            'getCtrReviewButton',
            'ctr_review',
            'Gerenciar revis\u00F5es de texto',
            isNewEditor ? 'fab fa-comments azulColor' : icon16baseCtrReview
        ) : '';
    
    const htmlButtonDitado = checkConfigValue('ditado') ? 
        htmlButtonPro(
            'getDitadoButton',
            'ditado',
            'Ativar ditado de texto',
            isNewEditor ? 'fab fa-microphone-alt rosaColor' : URL_SPRO + 'icons/editor/webspeech.png'
        ) + 
        htmlButtonPro(
            'getCtrDitadoButton',
            'ctr_ditado',
            'Gerenciar configura\u00E7\u00F5es do ditado',
            isNewEditor ? 'fab fa-cogs rosaColor' : URL_SPRO + 'icons/editor/webspeech-settings.png'
        ) : '';
    
    const htmlButtonNewStyle = isNewSEI ? 
        htmlButtonPro(
            'getNewStyleButton',
            'newstyle',
            'Ativar estilo avan\u00E7ado',
            isNewEditor ? 'fab fa-palette azulColor' : icon16baseNewStyle,
            '', 
            localStorage.getItem('seiSlim_editor') ? 'cke_button_on' : 'cke_button_off'
        ) : '';
    
    const htmlButtonSigilo = 
        htmlButtonPro(
            'getMarkSigiloButton',
            'mark_sigilo_pro',
            'Adicionar / Remover marca de sigilo no texto',
            isNewEditor ? 'fab fa-lock-open-alt azulColor' : icon16baseMarkSigilo
        ) +
        htmlButtonPro(
            'getBoxSigiloButton',
            'boxsigilo',
            'Gerenciar marcas de sigilo do documento',
            isNewEditor ? 'fab fa-user-unlock azulColor' : icon16baseBoxSigilo
        );
    
    const htmlButtonLegis = 
        htmlButtonPro(
            'getLegisButtom',
            'legis',
            'Enumerar norma',
            isNewEditor ? 'fab fa-pi azulColor' : icon16baseSEILegis
        ) +
        htmlButtonPro(
            'helpLegisButtom',
            'legis_help',
            'Ajuda',
            isNewEditor ? 'fab fa-info-circle azulColor' : window.location.origin+'/sei/editor/ck/skins/moonocolor/icons.png',
            isNewEditor ? '' : ';background-position: 0 -168px;',
            ''
        );
    const blockHtmlButton = isNewEditor
        ? htmlButton
        : `<span class="cke_iconPro cke_toolgroup ${classStatus}" role="presentation">${htmlButton}</span>`;

    const htmlNewBlock = isNewEditor 
        ? htmlButtonSigilo+htmlButtonReview+htmlButtonLegis+htmlButtonDitado+htmlButtonNewStyle
        : `
            <span class="cke_iconPro cke_toolgroup ${classStatus}" role="presentation">
            ${htmlButtonSigilo}
            ${htmlButtonReview}
            ${htmlButtonLegis}
            ${htmlButtonDitado}
            ${htmlButtonNewStyle}
            </span>
        `;

    return {
        default: blockHtmlButton, 
        tables: htmlButtonTable, 
        beforeCut: htmlButtonBeforeCut, 
        afterletters: htmlButtonAfterLetters, 
        beforeList: htmlButtonBeforeList, 
        afterSave: htmlButtonAfterSave, 
        newBlock: htmlNewBlock,
        afterImage: htmlButtonAfterImage
    };
}
function addButton(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){ 
        if (isNewEditor) {
            var items = $('.ck.ck-toolbar__items');
            // Fallback: quando o seletor de refer\u00EAncia n\u00E3o existe (comum entre builds
            // do CK5 customizadas), caimos no append ao container principal.
            var insertAfterOrAppend = function(selector, html) {
                var ref = $(selector);
                if (ref.length) ref.after(html); else items.append(html);
            };
            items.append(htmlButton('').default);
            insertAfterOrAppend('button[data-cke-tooltip-text="Inserir tabela"]', htmlButton('').tables);
            insertAfterOrAppend('button[data-cke-tooltip-text="Lista numerada"]', htmlButton('').beforeList);
            insertAfterOrAppend('span.ck-file-dialog-button', htmlButton('').afterImage);
            items.append(htmlButton('').newBlock);
            setClickButtons();
            initFunctions();
        } else {
            if ( $(txaEditor).length && !$('.cke_buttonPro').length ) {
                    if ( !$('#idEditor').length ) { $(isNewEditor ? 'body' : '#divComandos').append('<input style="display:none" type="hidden" id="idEditor">'); }
                        $(txaEditor).each(function(index){ 
                            var idEditor = $(this).attr('id').replace('cke_', '');
                            if ( $('iframe[title*="'+idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                                $(this).find('span.cke_toolbox').append(htmlButton('').default);
                                $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('').tables);
                                $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('').afterletters);
                                $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('').beforeCut);
                                $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('').beforeList);
                                $(this).find('span.cke_toolgroup .cke_button__base64image').after(htmlButton('').afterImage);
                                // $(this).find('span.cke_toolgroup .cke_button__save').after(htmlButton('').afterSave);
                                $(this).find('span.cke_toolbox').append(htmlButton('').newBlock);
                                insertFontIcon('head',$('iframe[title*="'+idEditor+'"]').contents());
                            } else {
                                $(this).find('span.cke_toolbox').append(htmlButton('disable').default);
                                $(this).find('span.cke_toolgroup .cke_button__table').before(htmlButton('disable').tables);
                                $(this).find('span.cke_toolgroup .cke_button__minuscula').after(htmlButton('disable').afterletters);
                                $(this).find('span.cke_toolgroup .cke_button__cut').before(htmlButton('disable').beforeCut);
                                $(this).find('span.cke_toolgroup .cke_button__numberedlist').before(htmlButton('disable').beforeList);
                                $(this).find('span.cke_toolgroup .cke_button__base64image').after(htmlButton('disable').afterImage);
                                // $(this).find('span.cke_toolgroup .cke_button__save').after(htmlButton('disable').afterSave);
                                $(this).find('span.cke_toolbox').append(htmlButton('disable').newBlock);
                            }
                        });
                    setClickButtons();
                    initFunctions();
                    addStyleIframes(); 
            } else {
                addButton(TimeOut - 100);
                console.log('addButton Reload => '+TimeOut);
            }
        }
    }, 500);
}
const htmlButtonPro = (classClick, cke_class, title, icon, extraStyle = '', important = '') => {
    const htmlButton = isNewEditor
    ? `
        <button class="ck ck-button ck-off cke_iconPro cke_buttonPro ${classClick}" type="button" style="${extraStyle} ${important}" aria-labelledby="ck-editor__aria-label_${classClick}" tabindex="-1" aria-pressed="false" data-cke-tooltip-text="${title}" data-cke-tooltip-position="s">
            <i class="${icon}"></i>
            <span class="ck ck-button__label" id="ck-editor__aria-label_${classClick}">${title}</span>
        </button>
    `
    : `
        <a class="${classClick} cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="${title}" hidefocus="true">
            <span class="cke_button_icon cke_button__${cke_class}_icon" style="background: url('${icon}') ${extraStyle} ${important}">&nbsp;</span>
            <span class="cke_button_label" aria-hidden="false">${title}</span>
        </a>`;
    return htmlButton;
};
const setClickButtons = () => {
    $('.getTablestylesButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { getSyleSelectedTable(this) } });
    $('.getQuickTableButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { getQuickTable(this) } });
    $('.importDocButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { importDocPro(this) } });
    $('.getLinkLegisButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getLegisSEI(this) } });
    $('.getCapLetterButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { convertFirstLetter(this) } });
    $('.getFontSizeUpButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'up') } });
    $('.getFontSizeDownButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { changeFontSize(this, 'down') } });
    $('.getCopyStyleButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setCopyStyle(this) } });
    $('.getAlignButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { openAlignText(this) } });
    $('.getAlignLeftButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'left') } });
    $('.getAlignCenterButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'center') } });
    $('.getAlignRightButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'right') } });
    $('.getAlignJustifyButtom').on('click',function() { if (!$(this).hasClass('cke_button_disabled')) { setAlignText(this, 'justify') } });
    $('.getCitacaoDocumentoButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getCitacaoDocumento(this) } });
    $('.getNotaRodapeButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getNotaRodape(this) } });
    $('.getRefInternaButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getRefInterna(this) } });
    if (restrictConfigValue('ferramentasia')) $('.getPlataformAIButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { loadPlataformAI(this) } });
    $('.getSumarioButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getSumarioDocumento(this) } });
    $('.getDadosProcessoButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getDadosEditor(this) } });
    $('.getTinyUrlButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getTinyUrl(this) } });
    $('.getQrCodeButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getQrCode(this) } });
    $('.getPageBreakButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getPageBreak(this) } });
    $('.getSessionBreakButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getSessionBreak(this) } });
    $('.getLatexButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogLatex(this) } });
    $('.getBatchImgQualityButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogBatchImgQuality(this) } });
    $('.getInsertCheckboxButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getInsertCheckboxButtom(this) } });
    $('.getProcessoPublicoButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogProcessoPublicoPro(this) } });
    $('.getMinutaWatermarkButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getMinutaWatermark(this) } });
    $('.pageImageBackgroundButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { pageImageBackground(this) } });
    $('.getMarkSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getMarkSigilo(this) } });
    $('.getBoxSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxSigilo(this) } });
    $('.getReviewButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxReview(this) } });
    $('.getCtrReviewButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxCtrReview(this) } });
    $('.getDitadoButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxDitado(this) } });
    $('.getCtrDitadoButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxCtrDitado(this) } });
    $('.getNewStyleButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getBoxStyleEditor(this) } });
    // $('.getAutoSaveButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getAutoSave(this) } });
    $('.getLegisButtom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { initLegis(this) } });
    // $('.getUploadImgBase64Buttom').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { openDialogUploadImgBase64(this) } });
    $('.cke_combo_button').on('click',function() { setDarkModeCkePanel(); });
}
function removeDataCkeSavedImg() {
    $(editorTitle).each(function(){
        var iframe = $(this).contents();
        if ( iframe.find('body').attr('contenteditable') == 'true' ) {
            iframe.find('img').removeAttr('data-cke-saved-src');
        }
    });
}
function addStyleIframes(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    setTimeout(function(){
        $('div[id*="cke_txaEditor_"] a.cke_button').each(function(){
            var title = $(this).attr('title');
                title = (typeof title !== 'undefined') ? title.replace(/["']/g, "") : '';
            if (typeof title !== 'undefined' && title != '') {  
                $(this).attr('onmouseover', 'return infraTooltipMostrar(\''+title+'\')').attr('onmouseout', 'return infraTooltipOcultar()').removeAttr('title');
            }
        });
        if ( $(editorTitle).eq(0).contents().find('head').find('style[data-style="seipro"]').length == 0 ) {
            $(editorTitle).each(function(){
                var iframe = $(this).contents();
                if ( iframe.find('head').find('style[data-style="seipro"]').length == 0 ) {
                    iframe.find('head').append('<style type="text/css" data-style="seipro"> \n'
                                                +(localStorage.getItem('darkModePro') ? '   * { color: #fbfbfe; } \n' : '')
                                                +'   span.checkboxSEI {cursor: pointer;} \n'
                                                +'   p .ancoraSei { background: #e4e4e4; } \n'
                                                +'   html.dark-mode body[contenteditable="false"], \n'
                                                +'   html.dark-mode p.Texto_Fundo_Cinza_Maiusculas_Negrito, \n'
                                                +'   html.dark-mode p.Texto_Fundo_Cinza_Negrito, \n'
                                                +'   html.dark-mode p .ancoraSei, \n'
                                                +'   html.dark-mode p.Item_Nivel1 { \n'
                                                +'       background-color: #e5e5e566 !important;  \n'
                                                +'   } \n'
                                                +'   html.dark-mode .dark-mode-color-black, \n'
                                                +'   html.dark-mode .dark-mode-color-black * { \n'
                                                +'       color: #000 !important;  \n'
                                                +'   } \n'
                                                +'   html.dark-mode .dark-mode-color-white, \n'
                                                +'   html.dark-mode .dark-mode-color-white * { \n'
                                                +'       color: #fff !important;  \n'
                                                +'   } \n'
                                                +'   .dot-flashing,.dot-flashing::after,.dot-flashing::before{width:7px;height:7px;background-color:#4285f4;color:#4285f4}.dot-flashing{position:relative;border-radius:50%;animation:1s linear .5s infinite alternate dot-flashing}.dot-flashing::after,.dot-flashing::before{content:"";display:inline-block;position:absolute;top:0}.dot-flashing::before{left:-13px;border-radius:5px;animation:1s infinite alternate dot-flashing}.dot-flashing::after{left:13px;border-radius:50%;animation:1s 1s infinite alternate dot-flashing}@keyframes dot-flashing{0%{background-color:#4285f4}100%,50%{background-color:rgba(152,128,255,.2)}} \n'
                                                +'   p[contenteditable="false"] { background-color: #f3f3f3; position: relative; } \n'
                                                +'   p[contenteditable="false"]::after { content: "\\f023"; font-family: "Font Awesome 5 Pro"; right: 0; position: absolute; color: #747474; opacity: 0.5;} \n'
                                                +'   a.anchorRefInternaPro { cursor: pointer; } \n'
                                                +'   p .legis { background: #f1f1f1; } \n'
                                                +'   p .error { background-color: #ffd2d2; } \n'
                                                +'   p .alert { cursor: pointer; background: #fffbc9; border-left: 3px solid #ffe52a; padding-left: 4px; } '
                                                +'   span.tooltips { position: absolute; text-align: left; background: #fffbc9; text-indent: 0; border-left: 3px solid #ffe52a; margin: -46px 0px 0px -7px; width: 500px; font-size: 10pt; padding: 5px; color: #636363; height: 36px; }'
                                                +'   span.tooltips .ignoretext { background: #ecdc89; padding: 3px 5px; margin: 3px; font-size: 8pt; text-transform: uppercase; border-radius: 5px; float: right; }'
                                                +'   span.sigiloSEI { background-color: #ececec; border-bottom: 2px solid #d79d23; } \n'
                                                +'   span.sigiloSEI::before { content: "\\f023"; font-family: "Font Awesome 5 '+(isSeiSlim ? 'Pro' : 'Free')+'"; color: #d79d23; margin: 0 5px; font-size: 80%; font-weight: 600; } \n'
                                                +'   html.dark-mode .pageBreakPro, html.dark-mode .sessionBreakPro { background: #6f7071; height: 15px; } \n'
                                                +'   .pageBreakPro, .sessionBreakPro { background: #f1f1f1; height: 15px; } \n'
                                                +'   .pageBreakPro::before, .sessionBreakPro::before { border-bottom: 2px dashed #bfbfbf; display: block; content: \'\'; height: 7px; } \n'
                                                +'   .pageBreakPro::after, .sessionBreakPro::after { content: \'\u21B3 Quebra de p\u00E1gina\'; font-family: Calibri; text-align: center; display: block; margin-top: -10px; color: #585858; text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff; font-size: 10pt; font-style: italic; } \n'
                                                +'   .sessionBreakPro::after { content: \'\u21B3 Quebra de se\u00E7\u00E3o\' !important; } \n'
                                                +'   .linkDisplayPro, .reviewDisplayPro { max-width: 90% !important; user-select: none; position: absolute; display: inline-block; padding: 8px; box-shadow: 0 1px 3px 1px rgba(60,64,67,.35); background: #fff; border-color: #dadce0; border-radius: 8px; margin-top: 16px; text-align: left; text-indent: initial; font-size: 12pt; text-transform: initial; font-weight: initial; letter-spacing: initial; text-decoration: initial; white-space: nowrap; } \n'
                                                +'   .linkDisplayPro a, .reviewDisplayPro a { padding: 0 8px; cursor: pointer; text-decoration: underline; color:#1155cc; } \n'
                                                +'   .linkDisplayPro strong.title-linktip { width: calc(100% - 160px); display: inline-flex; overflow: hidden; } \n'
                                                +'   .linkDisplayPro ul { margin: 0;padding: 0;max-height: 207px;overflow-y: scroll; } \n'
                                                +'   .linkDisplayPro li { padding: 5px; cursor:pointer; } \n'
                                                +'   .linkDisplayPro li.highlighted, .linkDisplayPro li:hover { background-color: #3875d7; background-image: linear-gradient(#3875d7 20%, #2a62bc 90%); color: #ffffff; } \n'
                                                +'   html.dark-mode .linkDisplayPro, html.dark-mode .reviewDisplayPro { background-color:#3D3D3D !important; } \n'
                                                +'   html.dark-mode .linkDisplayPro a, html.dark-mode .reviewDisplayPro a { color:#fbfbfe !important; } \n'
                                                +'   span.reviewSeiPro[data-comment][data-review="delete"]:before { content: "\\f075";font-family: \'Font Awesome 5 '+(isSeiSlim ? 'Pro' : 'Free')+'\';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);} \n'
                                                +'   span.reviewSeiPro[data-comment][data-review="add"]:before { content: "\\f075";font-family: \'Font Awesome 5 '+(isSeiSlim ? 'Pro' : 'Free')+'\';color: #e9af68;font-size: 80%;font-weight: bold;margin: -8px 0px 0 -13px;position: absolute;transform: scale(-1, 1);} \n'
                                                +'   html.dark-mode .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEzLjY0MDMyODc0MzE5OTIzNCIgaGVpZ2h0PSIxNi4xMjAwMDAwMDAwMDAwMDUiIHZpZXdCb3g9IjMxNC42Njk2NzEyNTY4MDA3NyAzMTEuOTQgMTMuNjQwMzI4NzQzMTk5MjM0IDE2LjEyMDAwMDAwMDAwMDAwNSIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNC42LjA8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDAuMDYgMCAwIDAuMDYgMzI0LjU3IDMyMCkiIGlkPSJ3MGQwNHhBNjhSaG1qYldBZWQyTmgiICA+CjxwYXRoIHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBldmVub2RkOyBvcGFjaXR5OiAxOyIgdmVjdG9yLWVmZmVjdD0ibm9uLXNjYWxpbmctc3Ryb2tlIiAgdHJhbnNmb3JtPSIgdHJhbnNsYXRlKC0xNTEsIC0xMjYpIiBkPSJNIDE3MCAxNCBMIDIwMC4wMDc1MzcgMTQgQyAyMDIuNzY5MDU3IDE0IDIwNSAxMS43NjM2NDkzIDIwNSA5LjAwNDk3MDkyIEwgMjA1IDQuOTk1MDI5MDggQyAyMDUgMi4yMzM4MjIxMiAyMDIuNzY0Nzk4IDAgMjAwLjAwNzUzNyAwIEwgMTAxLjk5MjQ2MyAwIEMgOTkuMjMwOTQzMSAwIDk3IDIuMjM2MzUwNjkgOTcgNC45OTUwMjkwOCBMIDk3IDkuMDA0OTcwOTIgQyA5NyAxMS43NjYxNzc5IDk5LjIzNTIwMTcgMTQgMTAxLjk5MjQ2MyAxNCBMIDEzMyAxNCBMIDEzMyAyMzggTCAxMDEuOTkyNDYzIDIzOCBDIDk5LjIzMDk0MzEgMjM4IDk3IDI0MC4yMzYzNTEgOTcgMjQyLjk5NTAyOSBMIDk3IDI0Ny4wMDQ5NzEgQyA5NyAyNDkuNzY2MTc4IDk5LjIzNTIwMTcgMjUyIDEwMS45OTI0NjMgMjUyIEwgMjAwLjAwNzUzNyAyNTIgQyAyMDIuNzY5MDU3IDI1MiAyMDUgMjQ5Ljc2MzY0OSAyMDUgMjQ3LjAwNDk3MSBMIDIwNSAyNDIuOTk1MDI5IEMgMjA1IDI0MC4yMzM4MjIgMjAyLjc2NDc5OCAyMzggMjAwLjAwNzUzNyAyMzggTCAxNzAgMjM4IEwgMTcwIDE0IFoiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgLz4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjA2IDAgMCAwLjA2IDMxOCAzMTkuNDgpIiBpZD0iNjlfbUZlWUc0MzlsTGM2X3FqUHlhIiAgPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigyNTUsMjU1LDI1NSk7IGZpbGwtcnVsZTogZXZlbm9kZDsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtNDcuNTcsIC0xMTcuNzgpIiBkPSJNIDY1IDIyMi4yODA4MjkgQyA2MC42MTMxMTc2IDIyMi4yODA4MjkgNTYuMzc0MjE2MiAyMjIuMjgwODI4IDUyLjk5OTk5OTUgMjIyLjI4MDgyOCBMIDUzIDE3MCBMIDQyIDE3MCBMIDQyIDIyMi41NjA1OTMgQyAzOC42MTMwMjQ2IDIyMi41NjA1OTMgMzQuMzc2MzMwOCAyMjIuNTYwNTkzIDMwLjAwMDAwMDUgMjIyLjU2MDU5NCBMIDMwIDE3MCBMIDE5IDE3MCBMIDE5IDIyMi41NjA1OTUgQyAxNi4zMjQ4NjUgMjIyLjU2MDU5NSAxMy44NDYzMzY5IDIyMi41NjA1OTUgMTEuNzYxMjcyNSAyMjIuNTYwNTk2IEMgLTAuMzY5NTg2NDM4IDIyMi41NjA1OTkgMS4yODM4MTc0NiAyMTEuNTA5MzEzIDEuMjgzODE3NDYgMjExLjUwOTMxMyBDIDEuMjgzODE3NDYgMjExLjUwOTMxMyAwLjM4OTY4OTk0NCAxNzcuNzU2IDAuMzk2NTcxMjc3IDE1OCBMIDk0Ljc0MDgyMzIgMTU4IEMgOTQuNzM5MjczNiAxNzcuNzkzMDg5IDkzLjg1MzUzOTYgMjExLjIyOTU0OCA5My44NTM1Mzk2IDIxMS4yMjk1NDggQyA5My44NTM1Mzk2IDIxMS4yMjk1NDggOTUuNTA2OTQzNSAyMjIuMjgwODM0IDgzLjM3NjA4NDUgMjIyLjI4MDgzMSBDIDgxLjI1NTM3ODIgMjIyLjI4MDgzIDc4LjcyNzY0MTUgMjIyLjI4MDgzIDc2LjAwMDAwMDIgMjIyLjI4MDgzIEwgNzYgMTcwIEwgNjUgMTcwIEwgNjUgMjIyLjI4MDgyOSBaIE0gMC41NzQ1MzQwMzYgMTQ3IEMgMC41Nzk3NjgzODcgMTQ2Ljg5NjE0OSAwLjU4NTEzMTYzOCAxNDYuNzk0NzU1IDAuNTkwNjI1NTE0IDE0Ni42OTU4NjYgQyAxLjI4MzgxNzQ4IDEzNC4yMTg0MDkgLTAuNzk3MTEyMjg2IDEyMi40MzQxNDYgMTYuODc5MjgxNiAxMTYuMTk1NDIyIEMgMzQuNTU1Njc1NSAxMDkuOTU2Njk4IDI4LjY2NjI1MzYgMTA3LjUzMDUyMiAzMC4zOTc4NzkyIDk1Ljc0NjI1NzYgQyAzMi4xMjk1MDQ4IDgzLjk2MTk5MyAyNS44OTIxMjk4IDc4LjA2OTg2MyAyNS44OTIxMzE1IDQ0Ljc5NjY0OTYgQyAyNS44OTIxMzMgMTcuOTYwNzIwNiAzOC41MTY5NDY3IDEzLjkyMjAxNzMgNDUuNTIyMDkzOSAxMy4zNjM3NjE3IEMgNDUuNjA4OTgxNCAxMy4xMzQwNzI3IDQ1LjcwMDI1MDYgMTMuMDE2NDM5MSA0NS43OTYwNjMxIDEzLjAxNjQzOTEgQyA0OS44MzcyMDU2IDEzLjAxNjQzODkgNjkuMjQ1MjIzNyAxMS4yNDM2NzEzIDY5LjI0NTIyNTUgNDQuNTE2ODg0NyBDIDY5LjI0NTIyNzMgNzcuNzkwMDk4MiA2My4wMDc4NTIzIDgzLjY4MjIyODEgNjQuNzM5NDc3OCA5NS40NjY0OTI4IEMgNjYuNDcxMTAzNCAxMDcuMjUwNzU3IDYwLjU4MTY4MTUgMTA5LjY3NjkzMyA3OC4yNTgwNzU0IDExNS45MTU2NTcgQyA5NS45MzQ0NjkzIDEyMi4xNTQzODEgOTMuODUzNTM5NSAxMzMuOTM4NjQ0IDk0LjU0NjczMTUgMTQ2LjQxNjEwMSBDIDk0LjU1NzA1ODYgMTQ2LjYwMTk4OSA5NC41NjY5MjQyIDE0Ni43OTY3MjQgOTQuNTc2MzM5NyAxNDcgTCAwLjU3NDUzNDAzNiAxNDcgWiBNIDQ3LjUgNDEgQyA1Mi4xOTQ0MjA0IDQxIDU2IDM3LjE5NDQyMDQgNTYgMzIuNSBDIDU2IDI3LjgwNTU3OTYgNTIuMTk0NDIwNCAyNCA0Ny41IDI0IEMgNDIuODA1NTc5NiAyNCAzOSAyNy44MDU1Nzk2IDM5IDMyLjUgQyAzOSAzNy4xOTQ0MjA0IDQyLjgwNTU3OTYgNDEgNDcuNSA0MSBaIiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+") 12 1, auto !important; } \n'
                                                +'   .cke_copyformatting_active { cursor: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+Cjxzdmcgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDIwNSAyNTIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+Y3Vyc29yPC90aXRsZT4KICAgIDxkZXNjPjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTQiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJBcnRib2FyZC0xIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNDkuMDAwMDAwLCAtMi4wMDAwMDApIiBmaWxsPSIjMDAwMDAwIj4KICAgICAgICAgICAgPGcgaWQ9ImN1cnNvciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNDkuMDAwMDAwLCAyLjAwMDAwMCkiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTE3MCwxNCBMMjAwLjAwNzUzNywxNCBDMjAyLjc2OTA1NywxNCAyMDUsMTEuNzYzNjQ5MyAyMDUsOS4wMDQ5NzA5MiBMMjA1LDQuOTk1MDI5MDggQzIwNSwyLjIzMzgyMjEyIDIwMi43NjQ3OTgsMCAyMDAuMDA3NTM3LDAgTDEwMS45OTI0NjMsMCBDOTkuMjMwOTQzMSwwIDk3LDIuMjM2MzUwNjkgOTcsNC45OTUwMjkwOCBMOTcsOS4wMDQ5NzA5MiBDOTcsMTEuNzY2MTc3OSA5OS4yMzUyMDE3LDE0IDEwMS45OTI0NjMsMTQgTDEzMywxNCBMMTMzLDIzOCBMMTAxLjk5MjQ2MywyMzggQzk5LjIzMDk0MzEsMjM4IDk3LDI0MC4yMzYzNTEgOTcsMjQyLjk5NTAyOSBMOTcsMjQ3LjAwNDk3MSBDOTcsMjQ5Ljc2NjE3OCA5OS4yMzUyMDE3LDI1MiAxMDEuOTkyNDYzLDI1MiBMMjAwLjAwNzUzNywyNTIgQzIwMi43NjkwNTcsMjUyIDIwNSwyNDkuNzYzNjQ5IDIwNSwyNDcuMDA0OTcxIEwyMDUsMjQyLjk5NTAyOSBDMjA1LDI0MC4yMzM4MjIgMjAyLjc2NDc5OCwyMzggMjAwLjAwNzUzNywyMzggTDE3MCwyMzggTDE3MCwxNCBaIiBpZD0iQ29tYmluZWQtU2hhcGUiPjwvcGF0aD4KICAgICAgICAgICAgICAgIDxwYXRoIGQ9Ik02NSwyMjIuMjgwODI5IEM2MC42MTMxMTc2LDIyMi4yODA4MjkgNTYuMzc0MjE2MiwyMjIuMjgwODI4IDUyLjk5OTk5OTUsMjIyLjI4MDgyOCBMNTMsMTcwIEw0MiwxNzAgTDQyLDIyMi41NjA1OTMgQzM4LjYxMzAyNDYsMjIyLjU2MDU5MyAzNC4zNzYzMzA4LDIyMi41NjA1OTMgMzAuMDAwMDAwNSwyMjIuNTYwNTk0IEwzMCwxNzAgTDE5LDE3MCBMMTksMjIyLjU2MDU5NSBDMTYuMzI0ODY1LDIyMi41NjA1OTUgMTMuODQ2MzM2OSwyMjIuNTYwNTk1IDExLjc2MTI3MjUsMjIyLjU2MDU5NiBDLTAuMzY5NTg2NDM4LDIyMi41NjA1OTkgMS4yODM4MTc0NiwyMTEuNTA5MzEzIDEuMjgzODE3NDYsMjExLjUwOTMxMyBDMS4yODM4MTc0NiwyMTEuNTA5MzEzIDAuMzg5Njg5OTQ0LDE3Ny43NTYgMC4zOTY1NzEyNzcsMTU4IEw5NC43NDA4MjMyLDE1OCBDOTQuNzM5MjczNiwxNzcuNzkzMDg5IDkzLjg1MzUzOTYsMjExLjIyOTU0OCA5My44NTM1Mzk2LDIxMS4yMjk1NDggQzkzLjg1MzUzOTYsMjExLjIyOTU0OCA5NS41MDY5NDM1LDIyMi4yODA4MzQgODMuMzc2MDg0NSwyMjIuMjgwODMxIEM4MS4yNTUzNzgyLDIyMi4yODA4MyA3OC43Mjc2NDE1LDIyMi4yODA4MyA3Ni4wMDAwMDAyLDIyMi4yODA4MyBMNzYsMTcwIEw2NSwxNzAgTDY1LDIyMi4yODA4MjkgWiBNMC41NzQ1MzQwMzYsMTQ3IEMwLjU3OTc2ODM4NywxNDYuODk2MTQ5IDAuNTg1MTMxNjM4LDE0Ni43OTQ3NTUgMC41OTA2MjU1MTQsMTQ2LjY5NTg2NiBDMS4yODM4MTc0OCwxMzQuMjE4NDA5IC0wLjc5NzExMjI4NiwxMjIuNDM0MTQ2IDE2Ljg3OTI4MTYsMTE2LjE5NTQyMiBDMzQuNTU1Njc1NSwxMDkuOTU2Njk4IDI4LjY2NjI1MzYsMTA3LjUzMDUyMiAzMC4zOTc4NzkyLDk1Ljc0NjI1NzYgQzMyLjEyOTUwNDgsODMuOTYxOTkzIDI1Ljg5MjEyOTgsNzguMDY5ODYzIDI1Ljg5MjEzMTUsNDQuNzk2NjQ5NiBDMjUuODkyMTMzLDE3Ljk2MDcyMDYgMzguNTE2OTQ2NywxMy45MjIwMTczIDQ1LjUyMjA5MzksMTMuMzYzNzYxNyBDNDUuNjA4OTgxNCwxMy4xMzQwNzI3IDQ1LjcwMDI1MDYsMTMuMDE2NDM5MSA0NS43OTYwNjMxLDEzLjAxNjQzOTEgQzQ5LjgzNzIwNTYsMTMuMDE2NDM4OSA2OS4yNDUyMjM3LDExLjI0MzY3MTMgNjkuMjQ1MjI1NSw0NC41MTY4ODQ3IEM2OS4yNDUyMjczLDc3Ljc5MDA5ODIgNjMuMDA3ODUyMyw4My42ODIyMjgxIDY0LjczOTQ3NzgsOTUuNDY2NDkyOCBDNjYuNDcxMTAzNCwxMDcuMjUwNzU3IDYwLjU4MTY4MTUsMTA5LjY3NjkzMyA3OC4yNTgwNzU0LDExNS45MTU2NTcgQzk1LjkzNDQ2OTMsMTIyLjE1NDM4MSA5My44NTM1Mzk1LDEzMy45Mzg2NDQgOTQuNTQ2NzMxNSwxNDYuNDE2MTAxIEM5NC41NTcwNTg2LDE0Ni42MDE5ODkgOTQuNTY2OTI0MiwxNDYuNzk2NzI0IDk0LjU3NjMzOTcsMTQ3IEwwLjU3NDUzNDAzNiwxNDcgWiBNNDcuNSw0MSBDNTIuMTk0NDIwNCw0MSA1NiwzNy4xOTQ0MjA0IDU2LDMyLjUgQzU2LDI3LjgwNTU3OTYgNTIuMTk0NDIwNCwyNCA0Ny41LDI0IEM0Mi44MDU1Nzk2LDI0IDM5LDI3LjgwNTU3OTYgMzksMzIuNSBDMzksMzcuMTk0NDIwNCA0Mi44MDU1Nzk2LDQxIDQ3LjUsNDEgWiIgaWQ9IkNvbWJpbmVkLVNoYXBlIj48L3BhdGg+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPgo=") 12 1, auto !important; } \n'
                                                +'</style>\n');
                    if (localStorage.getItem('darkModePro')) iframe.find('html').addClass('dark-mode');
                    repareBgTableColor(iframe);
                    repairBugChrome116(iframe);
                    setActionCheckbox(iframe);
                }
                setOnBodyActs(iframe);
            });
            setCKEDITOR_instances();
            $('head').append("<style type='text/css' data-style='seipro'> "
                            +"  .divAlignText { display:none; background-image: -webkit-linear-gradient(top,#fff,#e4e4e4); position: absolute; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .divQuickTable { display:none; position: absolute; background: #f1f1f1; display: initial; margin-top: 25px; box-shadow: 0 0 3px rgba(0,0,0,.15); border-radius: 3px; border: 1px solid #b6b6b6; }"
                            +"  .divQuickTable td { height: 15px; width: 15px; border: 1px solid #ccc; background: #fff; }"
                            +"  .divQuickTable .quickTableInfo { text-align: center; padding: 5px; color: #777; }"
                            +"  .divQuickTable .td_hover { background: #72bae2; }"
                            +"</style>");
            
        } else {
            addStyleIframes(TimeOut - 100);
            console.log('addStyleIframes Reload => '+TimeOut);
        }
    }, 500);
}
function setActionCheckbox(iframe) {
    iframe.find('.checkboxSEI').on('click',function(){
        if (!delayCrash) {
            delayCrash = true;
            setTimeout(function(){ delayCrash = false }, 300);
            oEditor.fire('saveSnapshot');
            if ($(this).hasClass('checked')) {
                $(this).html('&#9744;').removeClass('checked');
            } else {
                $(this).html('&#9745;').addClass('checked');
            }
            oEditor.fire('saveSnapshot');
            console.log('click',delayCrash);
        }
    });
}
// getInsertCheckboxButtom() foi extraido para js/modules/editor/checkbox.js
// (carregado antes deste monolito via SeiProEditorAdapter.loadModules).
function repairBugChrome116(iframe) {
    if (!!window.chrome) {
        iframe.find('p').each(function(){
            var className = $(this).attr('class');
            if (typeof className !== 'undefined') {
                $(this).attr('class','_'+className);
                $(this).attr('class',className);
            }
        });
    }
}
function setOnBodyActs(iframe) {
    iframe.find('body').on('mousedown', function(e) { 
        if ( typeof e.target.href !== 'undefined' && e.target.href.indexOf('http')  !== -1 && checkConfigValue('editarlinks')) { 
            showLinkTips(e.target, iframe);
        } else if ($(e.target).closest('span').hasClass('reviewSeiPro') && checkConfigValue('revisaotexto')) { 
            showReviewTips(e.target, iframe);
        } else {
            hideLinkTips(iframe);
            hideReviewTips(iframe);
        }
        removeDataCkeSavedImg();
        hideQuickTable();
        setActionCheckbox(iframe);
        setTimeout(() => {
            setOnKeyEditor();
        }, 1000);
    }).on('mouseup', function(e) { 
        initCKEDITOR_SEIPRO(e);
    }).on('blur', function(e) { 
        hideLinkTips(iframe);
        hideReviewTips(iframe);
        hideQuickTable();
        removeCopyStyle();
        closeAlignText();
    });
}
function initCKEDITOR_SEIPRO(e, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof oEditor !== 'undefined') { 
        applyCopyStyle();
        activeIconsSelectedText();
        closeAlignText();
    } else {
        if (TimeOut == 9000) {
            var force = CKEDITOR.instances[$(e.currentTarget).attr('data-editor')];
            setCKEDITOR_instances(force || false);
        }
        setTimeout(function(){ 
            initCKEDITOR_SEIPRO(e, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initCKEDITOR_SEIPRO'); 
        }, 500);
    }
}
function setDarkModeCkePanel() {
    var iframeCkePanel = $('iframe.cke_panel_frame').contents();
    if (localStorage.getItem('darkModePro') && iframeCkePanel.find('style[data-style="seipro"]').length == 0) {
    iframeCkePanel.find('head').append('<style type="text/css" data-style="seipro">\n'+
        '  body { background-color: #202123 !important; }\n'+
        '  .cke_panel_block * { background: #202123; border: none !important; color: #fff; box-shadow: none !important; text-shadow: none !important;}\n'+
        '  .cke_panel_block a[onclick*="Fundo"] p { background-color: #6f7071; }\n'+
        '  .cke_panel_block a:hover, .cke_panel_block a:hover p { background-color: #017fff !important; }\n'+
        '  .cke_panel_block .cke_selected *  { background: transparent; color: #202123 !important; }\n'+
        '</style>');
    }
}
function repareBgTableColor(iframe) {
    iframe.find('span[style*="background-color"],tr[style*="background-color"],td[style*="background-color"]').each(function(){
        setBgTableColor(this);
    });
}
function setBgTableColor(this_) {
    var bgColor = $(this_).css('background-color');
    if (typeof bgColor !== 'undefined' && bgColor !== null) {
        var brightness = getBrightnessColor(rgbToHexString(bgColor));
        var textColour = (brightness > 125) ? 'black' : 'white';
        $(this_).addClass('dark-mode-color-'+textColour);
    }
}

// =========================================================================
// Limpeza de conteudo para o validador do SEI 5
//
// O SEI 5 recusa "Documento possui conteudo nao permitido" quando o HTML traz
// residuos de editor (wrapper/atributos do CKEditor, marcadores {cke_protected})
// ou de extensoes do navegador (Dark Reader, servicos de copia), alem de cores
// em rgb()/rgba() \u2014 o SEI 5 so aceita hexadecimal. Esta rotina remove esse lixo
// e converte as cores. Roda automaticamente na colagem e na saida de dados
// (ver registrarLimpezaAutomaticaPro) e tambem pode ser chamada sob demanda
// via limparEditorPro().
// =========================================================================

// Atributos que nunca devem ir no conteudo salvo (nome exato)
var ATRIBUTOS_LIXO_PRO = [
    'contenteditable', 'spellcheck', 'data-editor',
    'data-processed', 'data-complete', 'data-hveid'
];
// ... e por prefixo (data-cke-saved-src/href, data-sfc-*, data-copy-service-*)
var PREFIXOS_ATRIBUTO_LIXO_PRO = ['data-cke-saved-', 'data-sfc-', 'data-copy-service'];
// Classes a remover (residuos do CKEditor e do realce de contraste do dark mode)
var PREFIXOS_CLASSE_LIXO_PRO = ['cke_', 'dark-mode-'];

// Heuristica barata: so vale a pena parsear/limpar se houver indicio de lixo.
// precisaLimparEditorPro() -> js/modules/editor/ (extraido para modulo)

// Converte todo rgb()/rgba() de uma string para #rrggbb (reusa o rgbToHex global).
// rgbParaHexPro() -> js/modules/editor/ (extraido para modulo)

// Limpa, in-place, um no raiz (Element ou Document) e todos os descendentes.
// limparRaizEditorPro() -> js/modules/editor/ (extraido para modulo)

// Versao string: recebe HTML, devolve HTML limpo (desembrulhando o <body>).
// limparHtmlEditorPro() -> js/modules/editor/ (extraido para modulo)

// Aplica a limpeza a uma instancia do CKEditor (getData -> limpa -> setData).
// Retorna true se algo mudou; reabilita o botao Salvar nesse caso.
// limparEditorPro() -> js/modules/editor/ (extraido para modulo)

// Registra a limpeza AUTOMATICA na instancia: na colagem e em toda saida de
// dados (getData) \u2014 que e o que o SEI serializa ao salvar. Idempotente.
// registrarLimpezaAutomaticaPro() -> js/modules/editor/ (extraido para modulo)

function extrairTextoComNumeracao(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const paragrafos = doc.querySelectorAll('p');
    const resultado = [];

    const counters = {
        'item-n1': 0,
        'item-n2': 0,
        'item-n3': 0,
        'item-n4': 0,
        'paragrafo-n1': 0,
        'paragrafo-n2': 0,
        'paragrafo-n3': 0,
        'paragrafo-n4': 0,
        'romano_maiusculo': 0,
        'letra_minuscula': 0,
    };

    const toRoman = (num) => {
        const romans = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
        const values = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
        let result = '', i = 0;
        while (num > 0) {
            while (num >= values[i]) {
                result += romans[i];
                num -= values[i];
            }
            i++;
        }
        return result;
    };

    const toLetter = (num) => {
        let result = '', n = num;
        while (n > 0) {
            n--;
            result = String.fromCharCode(97 + (n % 26)) + result;
            n = Math.floor(n / 26);
        }
        return result;
    };

    paragrafos.forEach(p => {
        const cls = p.className;
        let prefixo = '';

        if (cls.includes('Item_Nivel1')) {
            counters['item-n1']++;
            counters['item-n2'] = counters['item-n3'] = counters['item-n4'] = 0;
            prefixo = `${counters['item-n1']}.`;

        } else if (cls.includes('Item_Nivel2')) {
            counters['item-n2']++;
            counters['item-n3'] = counters['item-n4'] = 0;
            prefixo = `${counters['item-n1']}.${counters['item-n2']}.`;

        } else if (cls.includes('Item_Nivel3')) {
            counters['item-n3']++;
            counters['item-n4'] = 0;
            prefixo = `${counters['item-n1']}.${counters['item-n2']}.${counters['item-n3']}.`;

        } else if (cls.includes('Item_Nivel4')) {
            counters['item-n4']++;
            prefixo = `${counters['item-n1']}.${counters['item-n2']}.${counters['item-n3']}.${counters['item-n4']}.`;

        } else if (cls.includes('Paragrafo_Numerado_Nivel1')) {
            counters['paragrafo-n1']++;
            counters['paragrafo-n2'] = counters['paragrafo-n3'] = counters['paragrafo-n4'] = 0;
            prefixo = `${counters['paragrafo-n1']}.`;

        } else if (cls.includes('Paragrafo_Numerado_Nivel2')) {
            counters['paragrafo-n2']++;
            counters['paragrafo-n3'] = counters['paragrafo-n4'] = 0;
            prefixo = `${counters['paragrafo-n1']}.${counters['paragrafo-n2']}.`;

        } else if (cls.includes('Paragrafo_Numerado_Nivel3')) {
            counters['paragrafo-n3']++;
            counters['paragrafo-n4'] = 0;
            prefixo = `${counters['paragrafo-n1']}.${counters['paragrafo-n2']}.${counters['paragrafo-n3']}.`;

        } else if (cls.includes('Paragrafo_Numerado_Nivel4')) {
            counters['paragrafo-n4']++;
            prefixo = `${counters['paragrafo-n1']}.${counters['paragrafo-n2']}.${counters['paragrafo-n3']}.${counters['paragrafo-n4']}.`;

        } else if (cls.includes('Item_Inciso_Romano')) {
            counters['romano_maiusculo']++;
            counters['letra_minuscula'] = 0;
            prefixo = `${toRoman(counters['romano_maiusculo'])} -`;

        } else if (cls.includes('Item_Alinea_Letra')) {
            counters['letra_minuscula']++;
            prefixo = `${toLetter(counters['letra_minuscula'])})`;
        }

        const texto = p.textContent.trim();
        resultado.push(prefixo ? `${prefixo} ${texto}` : texto);
    });

    return resultado.join('\n');
}
function getAllTextEditor(extract_number = false) {
    let textEditor = '';

    for (var id in CKEDITOR.instances) {
        textEditor += extract_number 
            ? extrairTextoComNumeracao(CKEDITOR.instances[id].getData())
            : $('<div>').html(CKEDITOR.instances[id].getData()).text();
    }
return textEditor
}
function getSelectedHtmlFromCKEditor() {
    const selection = oEditor.getSelection();
    const range = selection && selection.getRanges()[0];

    if (range) {
        const fragment = range.clone().cloneContents();
        const container = new CKEDITOR.dom.element('div');
        container.append(fragment);
        return container.getHtml();
    }

    return '';
}
function setCKEDITOR_instances(force = false) {
    for(var id in CKEDITOR.instances) {
        CKEDITOR.instances[id].setKeystroke(CKEDITOR.ALT + 48 /*0*/, false); // desabilita o popup de acessibilidade, que impede acessar o caractere \u00BA no mac (option+0)
        registrarLimpezaAutomaticaPro(CKEDITOR.instances[id]); // limpeza automatica de conteudo nao permitido (SEI 5)
        CKEDITOR.instances[id].on('focus', function(e) {
            setCKEDITOR_SEIPRO(e);
        });
    }
    if (force) {
        setCKEDITOR_SEIPRO({editor: force});
    }
}
function setCKEDITOR_SEIPRO(e) {
    // Fill some global var here
    idEditor = e.editor.name;
    oEditor = CKEDITOR.instances[idEditor];
    iframeEditor = (frmEditor.length) ? $('iframe[title*="'+idEditor+'"]').contents() : $(txaEditor);
    $('#idEditor').val(idEditor);
    if ( iframeEditor.find('body').attr('contenteditable') == 'true' || frmEditor.length == 0) {
        $('#cke_'+idEditor).find('.cke_iconPro').removeClass('cke_button_disabled');
    }
    if (checkConfigValue('editarimagens')) editImgPro(oEditor);
    loadResizeImg();
    insertFontIcon('head',$('iframe[title*="'+idEditor+'"]').contents());
    if (checkConfigValue('teclasatalho')) stylesEditorKeystroke();
    instanceDitadoPro(oEditor);
    checkHostLimitIcons();
}
function checkHostLimitIcons() {
    if (checkHostLimit()) {
        var elemEditor = $('#cke_'+idEditor);
            elemEditor.find('.getCitacaoDocumentoButtom').addClass('cke_button_disabled');
            elemEditor.find('.getDadosProcessoButtom').addClass('cke_button_disabled');
    }
}
// Adiciona salvamento automatico
function checkAutoSave() {
    if (getOptionsPro('autoSaveEditor')) {
        // $('.getAutoSaveButtom').trigger('click');
    }
}
function getAutoSave(this_) {
    /*
    setParamEditor(this_);

    if ($('#cke_'+idEditor).find('.getAutoSaveButtom').hasClass('cke_button_on')) {
        $('#cke_'+idEditor).find('.getAutoSaveButtom').addClass('cke_button_off').removeClass('cke_button_on');
        clearInterval(autoSaveEditor);
        removeOptionsPro('autoSaveEditor');
    } else {
        clearInterval(autoSaveEditor);
        autoSaveEditor = setInterval(function () {
            if (isIntervalInProgress) return false;
                isIntervalInProgress = true;
            if (!$('#cke_'+idEditor).find('.cke_button.cke_button__save').hasClass('cke_button_disabled')) {
                console.log('setAutoSave');
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    var $form = oEditor.element.$.form;
                    if ($form) $form.submit();
                }
            }
            isIntervalInProgress = false;
        },autoSaveInterval * 1000 * 60);
        $('#cke_'+idEditor).find('.getAutoSaveButtom').addClass('cke_button_on').removeClass('cke_button_off');
        setOptionsPro('autoSaveEditor', true);
    }
    */
}
// Adiciona quebra de pagina
// getPageBreak() -> js/modules/editor/page-break.js
// getSessionBreak() -> js/modules/editor/session-break.js
// (extraidos; carregados antes deste monolito via loadModules)
function setNextElemEditor(element, callback = false) {
    var editorIfm = $('iframe[title*="'+idEditor+'"]');
    var selWin = editorIfm[0].contentWindow.getSelection();
    var selEnd = $(selWin.anchorNode.parentNode);
    
    if (typeof callback === 'function') callback(element);
    if (selEnd[0] != element[0]) setNextElemEditor(element.next(), callback);
}
// Altera o alinhamento do texto
// setAlignText() -> js/modules/editor/ (extraido para modulo)
// openAlignText() -> js/modules/editor/ (extraido para modulo)
// closeAlignText() -> js/modules/editor/ (extraido para modulo)

// Modifica o tamanho da fonte
// changeFontSize() -> js/modules/editor/ (extraido para modulo)
// Adiciona/Remove marca de sigilo
// getMarkSigilo() -> js/modules/editor/ (extraido para modulo)
// getTarjaSigilo() -> js/modules/editor/ (extraido para modulo)
// getBoxSigilo() -> js/modules/editor/ (extraido para modulo)
// actionsMarkSigilo() -> js/modules/editor/ (extraido para modulo)
// rodapeSigiloMark() -> js/modules/editor/ (extraido para modulo)
// htmlTabSigiloResult() -> js/modules/editor/ (extraido para modulo)
// getDialogSigilo() -> js/modules/editor/ (extraido para modulo)
function setChosenInCke(multiple = false, max_width = '500px') {
    var minWidth = multiple ? '450px' : '200px';
    if (verifyConfigValue('substituiselecao')) {
        if (multiple) $('select.cke_dialog_ui_input_select').attr('multiple','multiple');
        $('div.cke_dialog_ui_input_select').css({'position':'absolute', 'max-width': max_width, 'min-width': minWidth});
        $('span.cke_dialog_ui_labeled_content').css({'height':'27px', 'display': 'flex'});
        $('select.cke_dialog_ui_input_select').each(function(){
            if ($('#'+$(this).attr('id')+'_chosen').length == 0) { 
                initChosenReplace(multiple ? 'box_multiple' : 'box_init',this);
            } else {
                $(this).chosen("destroy").chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return removeAcentos(text.toLowerCase());
                    }
                });
            }
        });
        setTimeout(function(){ 
            $('.cke_dialog_ui_labeled_content .chosen-container-single').css({'max-width': max_width, 'min-width': minWidth});
            if (multiple) {
                $('.cke_dialog_ui_labeled_content .chosen-container-multi').css('width', '-webkit-fill-available');
                $('.cke_dialog_ui_labeled_content .chosen-container-multi .chosen-choices').css({'max-height': '90px', 'overflow-y': 'auto'});
            }
        }, 800);
    }
}
function hasSelection(editor) {
    var sel = editor.getSelection();
    var ranges = sel.getRanges();
    for (var i = 0, len = ranges.length; i < len; ++i) {
        if (!ranges[i].collapsed) {
            return true;
        }
    }
    return false;
}

// Aplica estilo a selecao
function getElementStyleSelected(element) {
    var fontSize = (parseFloat(element.css('font-size')) == 16 && (element.closest('sub').length || element.closest('sup').length)) ? false : parseFloat(element.css('font-size'));
    var color = (element.css('color') == 'rgb(0, 0, 0)') ? false : element.css('color');
    var backgroundColor = (element.css('background-color') == 'rgba(0, 0, 0, 0)') ? false : element.css('background-color');
    var bold = (element.closest('strong').length) ? true : false;
    var underline = (element.closest('u').length) ? true : false;
    var italic = (element.closest('em').length) ? true : false;
    var strike = (element.closest('s').length) ? true : false;
    var subscript = (element.closest('sub').length) ? true : false;
    var superscript = (element.closest('sup').length) ? true : false;
    return {fontSize: fontSize, color: color, backgroundColor: backgroundColor, bold: bold, underline: underline, italic: italic, strike: strike, subscript: subscript, superscript: superscript}
}
// setCopyStyle() -> js/modules/editor/ (extraido para modulo)
// actionCopyStyle() -> js/modules/editor/ (extraido para modulo)
// getCopyStyle() -> js/modules/editor/ (extraido para modulo)
// applyCopyStyle() -> js/modules/editor/ (extraido para modulo)
// removeCopyStyle() -> js/modules/editor/ (extraido para modulo)
// menuCopyStyle() -> js/modules/editor/ (extraido para modulo)
// menuBlockEdition() -> js/modules/editor/ (extraido para modulo)
function stylesEditorKeystroke() {
    if (getOptionsPro('stylesEditor')) {
        $.each(getOptionsPro('stylesEditor'), function(i, v){
            oEditor.addCommand(v, {
                exec: function( editor ) {
                    var select = editor.getSelection().getStartElement();
                    var element = $(select.$);
                    if (element.is('p')) {
                        element.attr('class',v);
                    } 
                }
            });
            if (i < 36) {
                var key = (i <= 9) ? 48+i : 55+i;
                    if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.SHIFT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + key, v);
                    } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                        oEditor.setKeystroke(CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    } else {
                        oEditor.setKeystroke(CKEDITOR.CTRL + CKEDITOR.ALT + CKEDITOR.SHIFT + key, v);
                    }
            }
        });
        if (getOptionsPro('stylesEditor')) {
            $('a.cke_combo_button[href*="Estilos de Format"]').on('click',function(){
                var ckePanel = $('iframe[class="cke_panel_frame"]').contents();
                var style = '<style type="text/css" data-style="seipro-styleeditor">'+
                            '   .cke_panel_listItem a p {'+
                            '       overflow: hidden;'+
                            '   }'+
                            '   .cke_panel_listItem a {'+
                            '       padding-right: 160px;'+
                            '       position: relative;'+
                            '   }'+
                            '   sup {'+
                            '       position: absolute;'+
                            '       right: 10px;'+
                            '       font-family: monospace;'+
                            '       background: #ccc;'+
                            '       padding: 3px 5px;'+
                            '       border-radius: 5px;'+
                            '       opacity: 0.5;'+
                            '       top: calc(50% - 10px);'+
                            '   }'+
                            '</style>';
                if (ckePanel.find('style[data-style="seipro-styleeditor"]').length == 0) {
                    ckePanel.find('head').append(style);
                }
                    ckePanel.find('sup').remove();
                    var isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1 ? true : false;
                    $.each(getOptionsPro('stylesEditor'), function(i, v){
                        if (i < 36) {
                            var key = (i <= 9) ? 48+i : 55+i;
                            var combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_1') {
                                combinacaoteclas = isMac ? 'CMD + OPTION + SHIFT' : 'CTRL + ALT + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_2') {
                                combinacaoteclas = isMac ? 'CMD + SHIFT' : 'CTRL + SHIFT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_3') {
                                combinacaoteclas = isMac ? 'CMD + OPTION' : 'CTRL + ALT';
                            } else if (getConfigValue('combinacaoteclas') == 'combinacaoteclas_4') {
                                combinacaoteclas = isMac ? 'OPTION + SHIFT' : 'ALT + SHIFT';
                            }
                            ckePanel.find('li.cke_panel_listItem a[title="'+v+'"]').prepend('<sup>'+combinacaoteclas+' + <strong>'+String.fromCharCode(key)+'</strong></sup>');
                        }
                    });
            });
        }
    }
}
function editImgPro( editor ) {
    if ( editor.contextMenu && !delayCrash && typeof editor.getMenuItem('ImageEditorPro') === 'undefined') {

        delayCrash = true;
        setTimeout(function(){ delayCrash = false }, 300);

        editor.removeMenuItem('image');

        editor.addMenuGroup( 'base64imageGroup', 30);
        editor.addMenuItem( 'base64imageItem', {
            label: 'Formatar Imagem',
            icon: URL_SPRO+'icons/editor/formatarimagem.png',
            command: 'base64imageDialog',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { base64imageItem: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'base64imageDialog', {
            exec: function( editor ) {
                openDialogUploadImgBase64(editor);
            }
        });

        editor.addMenuItem( 'ImageEditorPro', {
            label: 'Editar Imagem',
            icon: URL_SPRO+'icons/editor/editarimagem.png',
            command: 'ImageEditorPro',
            group: 'base64imageGroup'
        });
        editor.contextMenu.addListener( function( element ) {
            if (element && element.getName() === "img") {
                editor.getSelection().selectElement(element);
                return { ImageEditorPro: CKEDITOR.TRISTATE_ON };
            }
            return null;
        });
        editor.addCommand( 'ImageEditorPro', {
            exec: function( editor ) {
                openImageEditorPro(editor);
            }
        });

        editor.on("doubleclick", function(evt){
            if(evt.data.element && !evt.data.element.isReadOnly() && evt.data.element.getName() === "img") {
                evt.data.dialog = 'base64imageDialog';
                editor.getSelection().selectElement(evt.data.element);
            }
        });
    }
}

// Adiciona tabela rapida
// hideQuickTable() -> js/modules/editor/ (extraido para modulo)
// quickTableOver() -> js/modules/editor/ (extraido para modulo)
// getQuickTable() -> js/modules/editor/ (extraido para modulo)

// quickTableClick() -> js/modules/editor/ (extraido para modulo)

//// Insere estilo clean a tabela selecionada do documento
function detectSyleSelectedTable(editor) {
    editor = editor || SeiProEditorAdapter.getInstance();
    if (!editor) return $();
    var el = SeiProEditorAdapter.getSelectionElement(editor);
    return el ? $(el).closest('table') : $();
}
function activeIconsSelectedText() {
    if ( detectSyleSelectedTable().length ) {
        $('#cke_'+idEditor).find('.getTablestylesButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getTablestylesButtom').addClass('cke_button_disabled');
    }
    if (hasSelection(oEditor)) {
        $('#cke_'+idEditor).find('.getFontSizeUpButtom').removeClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getFontSizeDownButtom').removeClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getCapLetterButtom').removeClass('cke_button_disabled');
    } else {
        $('#cke_'+idEditor).find('.getFontSizeUpButtom').addClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getFontSizeDownButtom').addClass('cke_button_disabled');
        $('#cke_'+idEditor).find('.getCapLetterButtom').addClass('cke_button_disabled');
    }
}
// getSyleSelectedTable() -> js/modules/editor/ (extraido para modulo)
// changeColorTable() -> js/modules/editor/ (extraido para modulo)
// Mantido por compat com initFunctions(); di\u00E1logo jQuery UI em openDialogSyleTable().
// getDialogSyleTable() -> js/modules/editor/ (extraido para modulo)

// buildHtmlSyleTable() -> js/modules/editor/ (extraido para modulo)

// openDialogSyleTable() -> js/modules/editor/ (extraido para modulo)
// getSyleTable() -> js/modules/editor/ (extraido para modulo)
// setSyleTable() -> js/modules/editor/ (extraido para modulo)

//// INSERE LINK DE NORMAS
// sendLegisSEI() -> js/modules/editor/ (extraido para modulo)
// insertLegisSEI() -> js/modules/editor/ (extraido para modulo)
// uniqLinkLegisSEI() -> js/modules/editor/ (extraido para modulo)
// getLegisSEI() -> js/modules/editor/ (extraido para modulo)
// getSearchLegisMore() -> js/modules/editor/ (extraido para modulo)
// getSearchLegis() -> js/modules/editor/ (extraido para modulo)
// getDialogLegisSEI() -> js/modules/editor/ (extraido para modulo)
// convertFirstLetter() -> js/modules/editor/cap-letter.js (PORTADO p/ CK5)

// getCitacaoDocumento() -> js/modules/editor/ (extraido para modulo)
// getDialogCitacaoDocumento() -> js/modules/editor/ (extraido para modulo)
// insertCitacaoDocumento() -> js/modules/editor/ (extraido para modulo)

// INSERE NOTAS DE RODAPE
// getNotaRodape() -> js/modules/editor/ (extraido para modulo)
// Mantemos o nome antigo para compatibilidade com initFunctions() -- em CK4/CK5
// o di\u00E1logo agora eh jQuery UI, registrado sob demanda ao clicar no bot\u00E3o.
// getDialogNotaRodape() -> js/modules/editor/ (extraido para modulo)

/**
 * Abre o di\u00E1logo de inser\u00E7\u00E3o de nota de rodap\u00E9 (jQuery UI). Substitui o antigo
 * CKEDITOR.dialog -- compat\u00EDvel com CK4 e CK5 via adapter.
 */
// openDialogNotaRodape() -> js/modules/editor/ (extraido para modulo)
// removeNtRodape() -> js/modules/editor/ (extraido para modulo)
// updateNrABNT() -> js/modules/editor/ (extraido para modulo)
// insertNtRodape() -> js/modules/editor/ (extraido para modulo)
// updateNtRodape() -> js/modules/editor/ (extraido para modulo)
// reorderNtRodape funciona em CK4 (DOM iframe direto) e CK5 (transformBodyHtml,
// que serializa para HTML, manipula via DOMParser e re-seta a root do corpo).
// Aceita compat: assinatura antiga era reorderNtRodape(iframeEditor).
// reorderNtRodape() -> js/modules/editor/ (extraido para modulo)
function initAddButtonTarjaSigilo(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if ($('.getMarkSigiloButton').length) { 
        addButtonTarjaSigilo()
    } else {
        setTimeout(function(){ 
            initAddButtonTarjaSigilo(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initAddButtonTarjaSigilo'); 
        }, 500);
    }
}
function addButtonTarjaSigilo() {
    var icon16baseTarjaSigilo = URL_SPRO + 'icons/menu/tarjasigilo.png';
    var htmlButtonAfterLetters =    '   <a class="getTarjaSigiloButton cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="Adicionar tarja de sigilo no texto" hidefocus="true">'+
                                    '      <span class="cke_button_icon" style="background: url(\''+icon16baseTarjaSigilo+'\');">&nbsp;</span>'+
                                    '      <span class="cke_button_label" aria-hidden="false">Adicionar tarja de sigilo no texto</span>'+
                                    '   </a>';
        $(txaEditor).each(function(index){ 
            var idEditor = $(this).attr('id').replace('cke_', '');
            if ( $('iframe[title*="'+idEditor+'"]').contents().find('body').attr('contenteditable') == 'true' ) {
                $(this).find('span.cke_toolgroup .getMarkSigiloButton').after(htmlButtonAfterLetters);
            }
        });
        $('.getTarjaSigiloButton').on('click',function() { if (!$(this).closest('.cke_iconPro').hasClass('cke_button_disabled')) { getTarjaSigilo(this) } });
}
//No CK5 nao existe o form do editor: o salvamento e o proprio botao Salvar da barra
//(mesmos seletores que o auto-cleanup ja usa para se enganchar). No CK4 segue o form.
function submitEditorPro(editor) {
    if (isCK5Pro()) {
        $('.cke_button__save, button[data-cke-tooltip-text*="Salvar"], button[aria-label*="Salvar"], #divInfraBarraComandosSuperior button').first().trigger('click');
        return;
    }
    var $form = editor && editor.element && editor.element.$ ? editor.element.$.form : false;
    if ($form) $form.submit();
}
function isCK5Pro() {
    return typeof SeiProEditorAdapter !== 'undefined' && SeiProEditorAdapter.version === 5;
}
function setDocCertidao() {
    var dadosDocCertidao = sessionStorageRestorePro('dadosDocCertidao');
    var nomeDocCertidao = sessionStorageRestorePro('nomeDocCertidao');
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_certidao' && dadosDocCertidao && nomeDocCertidao) {
        if (!isCK5Pro()) setCKEDITOR_instances(); //CK4 puro: no CK5 lanca e abortaria a funcao
        initAddButtonTarjaSigilo();
        var modeloHtml =    '<p class="Texto_Centralizado_Maiusculas_Negrito">CERTID\u00C3O</p>'+
                            '<p class="Texto_Centralizado_Maiusculas_Negrito">C\u00D3PIA DE DOCUMENTO OFICIAL COM RESTRI\u00C7\u00C3O LEGAL DE PARTE(S) SOB SIGILO<br><br></p>'+
                            '<p class="Texto_Alinhado_Esquerda">Em observ\u00E2ncia \u00E0 <a class="ancoraSei legisSeiPro" data-norma="Lei12527" data-normafull="Lei n\u00BA 12.527, de 18 de novembro de 2011" data-index="0" data-cke-saved-href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" href="http://www.planalto.gov.br/ccivil_03/_Ato2011-2014/2011/Lei/L12527.htm" target="_blank" data-reflinkpro="HdNxK8xI">Lei n\u00BA 12.527, de 18 de novembro de 2011</a>, que estabelece, em seu artigo 7\u00BA, \u00A72\u00BA, que:</p>'+
                            '<p class="Citacao">Art. 7\u00BA O acesso \u00E0 informa\u00E7\u00E3o de que trata esta Lei compreende, entre outros, os direitos de obter:<br></p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Citacao">\u00A72\u00BA Quando n\u00E3o for autorizado acesso integral \u00E0 informa\u00E7\u00E3o, por ser ela parcialmente sigilosa, \u00E9 assegurado o acesso \u00E0 parte n\u00E3o sigilosa por meio de certid\u00E3o, extrato ou c\u00F3pia com oculta\u00E7\u00E3o da parte sob sigilo.</p>'+
                            '<p class="Citacao">(...)</p>'+
                            '<p class="Texto_Alinhado_Esquerda">Como servidor(a) p\u00FAblico(a) em exerc\u00EDcio, aponho minha assinatura e confiro f\u00E9 p\u00FAblica ao documento abaixo, confirmando que esta vers\u00E3o se trata de c\u00F3pia fiel da documenta\u00E7\u00E3o original, havendo sido ocultadas (tarjadas) exclusivamente as informa\u00E7\u00F5es protegidas por sigilo legal, assegurando a fidelidade da informa\u00E7\u00E3o p\u00FAblica. Assim, esta vers\u00E3o passa a coexistir com o documento integral criado com o amparo da citada Lei.</p>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>'+
                            '<table border="0" cellspacing="1" cellpadding="1" style="border-collapse:collapse;border-color: rgb(206 206 206);margin-left:auto;margin-right:auto;width:100%;">'+
                            '   <tbody>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado" id="">In\u00EDcio do(a) '+nomeDocCertidao+'</p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td contenteditable="false">'+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '               '+dadosDocCertidao+
                            '               <p class="Tabela_Texto_Alinhado_Esquerda"><br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '       <tr>'+
                            '           <td style="background-color: rgb(238, 238, 238);">'+
                            '               <p class="Texto_Centralizado">Fim do(a) '+nomeDocCertidao+'<br></p>'+
                            '           </td>'+
                            '       </tr>'+
                            '   </tbody>'+
                            '</table>'+
                            '<p class="Texto_Alinhado_Esquerda"><br></p>';
                            
            if (isCK5Pro()) {
                var editorCK5 = SeiProEditorAdapter.getInstance();
                if (editorCK5) {
                    SeiProEditorAdapter.focus(editorCK5);
                    //transformBodyHtml e o equivalente fiel ao iframe.find('body').html() do CK4
                    //e precisa ficar FORA de withEdit (o CK5 proibe mutar o DOM dentro do model.change).
                    SeiProEditorAdapter.transformBodyHtml(editorCK5, function () { return modeloHtml; });
                    setTimeout(function () {
                        trycatch(function () { actionsMarkSigilo(null, 'apply', false, false, editorCK5) }, false);
                        trycatch(function () { enableButtonSavePro() }, false); //CK4 puro, tolera falhar no CK5
                        trycatch(function () { submitEditorPro(editorCK5) }, false);
                        sessionStorageRemovePro('dadosDocCertidao');
                        sessionStorageRemovePro('nomeDocCertidao');
                    }, 0);
                }
            } else {
            var elemIframe = $('iframe').filter(function(){ return $(this).contents().find('body').attr('contenteditable') == 'true' }).eq(0)
            if (elemIframe.length) {
                var iframe = elemIframe.contents();
                if (elemIframe.attr('title').indexOf(',') !== -1) {
                    var idEditor = elemIframe.attr('title').split(',')[1].trim();
                    $('#idEditor').val(idEditor);
                    oEditor = CKEDITOR.instances[idEditor];
                    if (typeof oEditor !== 'undefined') {
                        oEditor.focus();
                        oEditor.fire('saveSnapshot');
                        iframe.find('body').html(modeloHtml);
                        actionsMarkSigilo(undefined, 'apply');
                        enableButtonSavePro();
                        
                        submitEditorPro(oEditor);

                        sessionStorageRemovePro('dadosDocCertidao');
                        sessionStorageRemovePro('nomeDocCertidao');
                    }
                }
            }
            }
        /*
        var maxIframeHeight = {value: 0, index: -1}
        $('iframe.cke_wysiwyg_frame').each(function(index){
            if ( $(this).contents().find('body').attr('contenteditable') == 'true' ) {
                var height = $(this).height();
                if (height > maxIframeHeight.value) { 
                    maxIframeHeight = {value: height, index: index};
                }
            }
        });
        if (maxIframeHeight.index != -1) {
            var elemIframe = $('iframe').eq(maxIframeHeight.index);
            var iframe = elemIframe.contents();
            if (elemIframe.attr('title').indexOf(',') !== -1) {
                var idEditor = elemIframe.attr('title').split(',')[1].trim();
                $('#idEditor').val(idEditor);
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    iframe.find('body').html(modeloHtml);
                    actionsMarkSigilo(undefined, 'apply');
                    enableButtonSavePro();
                    
                    var $form = oEditor.element.$.form;
                    if ($form) $form.submit();

                    sessionStorageRemovePro('dadosDocCertidao');
                    sessionStorageRemovePro('nomeDocCertidao');
                }
            }
        }
        */
    }
}
function setDocAutomatico() {
    var dadosDocAutomatico = sessionStorageRestorePro('dadosDocAutomatico');
    var nomeDocAutomatico = sessionStorageRestorePro('nomeDocAutomatico');
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro !== 'undefined' && param.acao_pro == 'set_automatico' && dadosDocAutomatico && nomeDocAutomatico) {
        if (!isCK5Pro()) setCKEDITOR_instances(); //CK4 puro: no CK5 lanca e abortaria a funcao
        initAddButtonTarjaSigilo();
        if (isCK5Pro()) {
            var editorCK5 = SeiProEditorAdapter.getInstance();
            if (editorCK5) {
                SeiProEditorAdapter.focus(editorCK5);
                SeiProEditorAdapter.transformBodyHtml(editorCK5, function () { return dadosDocAutomatico });
                sessionStorageRemovePro('dadosDocAutomatico');
                sessionStorageRemovePro('nomeDocAutomatico');
                setTimeout(function () {
                    trycatch(function () { actionsMarkSigilo(null, 'apply', false, false, editorCK5) }, false);
                    trycatch(function () { enableButtonSavePro() }, false); //CK4 puro, tolera falhar no CK5
                    trycatch(function () { submitEditorPro(editorCK5) }, false);
                }, 1500);
            }
            return;
        }
        var elemIframe = $('iframe').filter(function(){ return $(this).contents().find('body').attr('contenteditable') == 'true' }).eq(0)
        if (elemIframe.length) {
            var iframe = elemIframe.contents();
            if (elemIframe.attr('title').indexOf(',') !== -1) {
                var idEditor = elemIframe.attr('title').split(',')[1].trim();
                $('#idEditor').val(idEditor);
                oEditor = CKEDITOR.instances[idEditor];
                if (typeof oEditor !== 'undefined') {
                    oEditor.focus();
                    oEditor.fire('saveSnapshot');
                    iframe.find('body').html(dadosDocAutomatico);
                    actionsMarkSigilo(undefined, 'apply');

                    sessionStorageRemovePro('dadosDocAutomatico');
                    sessionStorageRemovePro('nomeDocAutomatico');

                    setTimeout(function(){ 
                        enableButtonSavePro();
                        
                        submitEditorPro(oEditor);
                    }, 1500);
                }
            }
        }
    }
}
function replaceDadosEditor(this_) {
    var arrayTags = uniqPro(getHashTagsPro(iframeEditor.find('p').map(function(){ return $(this).text().replace(/\u00A0/gm, " ") }).get().join(' ')));
    var delimitLine = false;
    var prop = dadosProcessoPro.propProcesso;
    var docs = dadosProcessoPro.listDocumentos;

    var tagField = iframeEditor.find('body').find('span.hashField');
    if (tagField.length) { tagField.after(tagField.html()).remove() }

    var dadosProcesso = camposDinamicosProcesso(arrayTags);
    var dadosTags = [];
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade != siglaUnidadeAtual) {
                $.each(valueTag.tags, function (i, v) {
                    var isRegex = new RegExp(v.value, 'i').test(undefined);
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            if (valueTag.unidade == siglaUnidadeAtual) {
                $.each(valueTag.tags, function (i, v) {
                    dadosProcesso[v.name] = '<span class="ancoraSei dynamicField">'+v.value+'</span>';
                    dadosTags.push(v.name);
                });
            }
        });
    
    var count = 0;
    oEditor.focus();
    oEditor.fire('saveSnapshot');
    $.each(arrayTags, function (i, value) {
        var _value = value;
        var underline = (value.indexOf('_') !== -1 && $.inArray(_value, dadosTags) === -1) ? '_'+value.split('_')[1] : '';
            value = (value.indexOf('_') !== -1) ? value.split('_')[0] : value;
            value = ($.inArray(_value, dadosTags) !== -1) ? _value : value;
        var hashTag = (value.indexOf('+') !== -1) ? '#'+(value.replace('+', '\\+')) : '#'+value;
        var hashSpan = '<span class="ancoraSei hashField" data-hash="'+value+'">#'+value+'</span>';
        var fieldSpan = (typeof dadosProcesso[value] !== 'undefined' && dadosProcesso[value] !== null) ? dadosProcesso[value] : hashSpan;
            fieldSpan = (value.indexOf('+') !== -1 || value.indexOf('-') !== -1 || (hasNumber(value) && $.inArray(_value, dadosTags) === -1) ) ? sumTagValue(value): fieldSpan;
            fieldSpan = fieldSpan+'&nbsp;';
            iframeEditor.find('p').each(function(){
                $(this).html($(this).html().replace(new RegExp(hashTag+underline, "i"), function(){ count++; return fieldSpan }));
            });
        console.log(arrayTags, value, hashTag+underline, fieldSpan, dadosProcesso);
    });
    oEditor.fire('saveSnapshot');
    var count_error = iframeEditor.find('.hashField').length;
        count_error = (count_error == 0) ? '' : '  <i class="fas fa-exclamation-triangle laranjaColor"></i> '+count_error+' '+(count_error==1 ? 'campo din\u00E2mico n\u00E3o substitu\u00EDdo' : 'campos n\u00E3o din\u00E2micos substitu\u00EDdos')+'.';
    var resultDiv = '<label class="cke_dialog_ui_labeled_label" style="font-style: italic; color: #616161;">'+
                    '  <i class="fas fa-check-circle verdeColor"></i> '+count+' '+(count==1 ? 'campo din\u00E2mico substitu\u00EDdo' : 'campos din\u00E2micos substitu\u00EDdos')+' com sucesso!<br>'+count_error+
                    '</label>';
    $('#tabReplaceTag_result').show().html(resultDiv);
}
function arrayDadosEditor() {
        setMomentPtBr();
    var listaDadosEditor = [['']];
    var prop = dadosProcessoPro.propProcesso;
    var processo = (typeof prop !== 'undefined' && typeof prop.txtProtocoloExibir === 'undefined') ? prop.hdnProtocoloFormatado : prop.txtProtocoloExibir;
    var dataGeracao = (typeof prop.txtDtaGeracaoExibir === 'undefined') ? prop.hdnDtaGeracao : prop.txtDtaGeracaoExibir;
    var htmlProcesso = '<span contenteditable="false" data-cke-linksei="1" style="text-indent:0px;"><a id="lnkSei'+prop.hdnIdProcedimento+'" class="ancoraSei" style="text-indent:0px;">'+processo+'</a></span>';
        listaDadosEditor.push(['Processo: '+processo,htmlProcesso]);
        listaDadosEditor.push(['Data de Autua\u00E7\u00E3o: '+dataGeracao,dataGeracao]);
        listaDadosEditor.push(['Tipo: '+prop.hdnNomeTipoProcedimento,prop.hdnNomeTipoProcedimento]);
        listaDadosEditor.push(['Especifica\u00E7\u00E3o: '+prop.txtDescricao,prop.txtDescricao]);
    
    var acesso = (typeof prop.rdoNivelAcesso !== 'undefined' && prop.rdoNivelAcesso == 0) ? 'P\u00FAblico' : null;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 1) ? 'Restrito' : acesso;
        acesso = (acesso !== null && prop.rdoNivelAcesso == 2) ? 'Sigiloso' : acesso;
        listaDadosEditor.push(['N\u00EDvel de Acesso: '+acesso,acesso]);
    
        $.each(prop.selInteressadosProcedimento, function (index, value) {
            listaDadosEditor.push(['Interessado: '+value,value]);
        });
        $.each(prop.selAssuntos_select, function (index, value) {
			var valueAssunto = ( value.length > 100 ) ? value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value;
            listaDadosEditor.push(['Assunto: '+valueAssunto,value]);
        });
        $.each(prop.txaObservacoes, function (index, value) {
			var valueObs = ( value.observacao.length > 100 ) ? value.observacao.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : value.observacao;
            listaDadosEditor.push(['Observa\u00E7\u00E3o ('+value.unidade+'): '+valueObs,value.observacao]);
        });
        listaDadosEditor.push(['Hoje: '+moment().format('LL'),moment().format('LL')]);
        listaDadosEditor.push(['Ano: '+moment().format('Y'),moment().format('Y')]);
        listaDadosEditor.push(['QRCode do Processo',getQRProcesso()]);
        $.each(prop.txaTagsObservacoes, function (index, valueTag) {
            $.each(valueTag.tags, function (i, v) {
                var vObs = ( v.value.length > 100 ) ? v.value.replace(/^(.{100}[^\s]*).*/, "$1")+'...' : v.value;
                listaDadosEditor.push(['Personalizado ('+valueTag.unidade+') #'+v.name+': '+vObs,v.value]);
            });
        });
        if (typeof dadosProcessoPro.listAtribuicaoProcesso !== 'undefined') {
            $.each(dadosProcessoPro.listAtribuicaoProcesso, function (index, value) {
                listaDadosEditor.push(['Respons\u00E1vel: '+value.name,value.name]);
            });
        }
    return listaDadosEditor;
}
// getDadosEditor() -> js/modules/editor/ (extraido para modulo)
// getDialogDadosEditor() -> js/modules/editor/ (extraido para modulo)
// removeDynamicField() -> js/modules/editor/ (extraido para modulo)
// editDynamicField() -> js/modules/editor/ (extraido para modulo)
// newDynamicField() -> js/modules/editor/ (extraido para modulo)
// updateDynamicField() -> js/modules/editor/ (extraido para modulo)
// getDialogDadosEditor_htmlListTag() -> js/modules/editor/ (extraido para modulo)
// insertDadosEditor() -> js/modules/editor/ (extraido para modulo)
// getSumarioDocumento() -> js/modules/editor/ (extraido para modulo)
// getListStylesDocumento() -> js/modules/editor/ (extraido para modulo)
// updateSelectDialog() -> js/modules/editor/ (extraido para modulo)
// getDialogSumarioDocumento() -> js/modules/editor/ (extraido para modulo)
// getDialogSumarioDocumento_() -> js/modules/editor/ (extraido para modulo)
// insertSumarioDocumento() -> js/modules/editor/ (extraido para modulo)

// GERA LINK CURTO
// getTinyUrl() -> js/modules/editor/ (extraido para modulo)
function ajaxTinyUrl(url_Tiny, alias_Tiny, mode) {
	var url = "https://tinyurl.com/api-create.php";
	var data = ( alias_Tiny != '' ) ? { url: url_Tiny, alias: alias_Tiny } : { url: url_Tiny };	
	$.ajax({
		type: "GET",
		url: url,
		data: data,
		success: function(dataUrl, textStatus, xhr){
			console.log(xhr.status);
            if (  dataUrl != '' && xhr.status == 200 ) {
				if ( mode == 'insert' ) {
					var htmlUrl = '<a href="'+dataUrl+'" class="ancoraSei" target="_blank">'+dataUrl+'</a>';
                        var ed = SeiProEditorAdapter.getInstance();
                        if (ed) {
                            SeiProEditorAdapter.withEdit(ed, function () { SeiProEditorAdapter.insertHtml(ed, htmlUrl); });
                        }
				} else if ( mode == 'setinput' ) {
					setInputTinyUrl(dataUrl);
				}
            }
		},
		complete: function(xhr, textStatus) {
			if ( xhr.status == 400 ) {
				alertaBoxPro('Error', 'exclamation-triangle', 'Erro: Nenhuma link gerado');
			} else if ( xhr.status == 422 ) {
				alertaBoxPro('Error', 'exclamation-triangle', 'Erro: O nome personalizado j\u00E1 existe. Insira outro.');
			}
		}
	});
}

// GERA QR CODE
// getQrCode() -> js/modules/editor/ (extraido para modulo)
// Mantido por compatibilidade com initFunctions(); di\u00E1logo jQuery UI
// constru\u00EDdo on-demand em openDialogQrCode().
// getDialogQrCode() -> js/modules/editor/ (extraido para modulo)

/**
 * Abre o di\u00E1logo de gera\u00E7\u00E3o de QR Code (jQuery UI). Reaproveita todo o
 * painel de op\u00E7\u00F5es avan\u00E7adas (#qrCodeLab) e as fun\u00E7\u00F5es auxiliares
 * updateQrCode()/toggleOptionsQR()/resetOptionsQR().
 */
// openDialogQrCode() -> js/modules/editor/ (extraido para modulo)

// buildHtmlQrCodeLab() -> js/modules/editor/ (extraido para modulo)
// resetOptionsQR() -> js/modules/editor/ (extraido para modulo)
// toggleOptionsQR() -> js/modules/editor/ (extraido para modulo)
// tipQrCodeUrl() -> js/modules/editor/ (extraido para modulo)
// setInputTinyUrl() -> js/modules/editor/ (extraido para modulo)
// convertTinyURL() -> js/modules/editor/ (extraido para modulo)
// updateQrCode() -> js/modules/editor/ (extraido para modulo)
// setQrCode() -> js/modules/editor/ (extraido para modulo)
function loadResizeImg() {
	$(txaEditor).each(function(index){ 
		var idEditor_ = $(this).attr('id').replace('cke_', '');
		var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			var oEditor_ = CKEDITOR.instances[idEditor_];
				initResizeImg(oEditor_);
				loadCSSResize(iframe_);
		}
	});
}
//// Insere o texto selecionado no documento no campo 'Texto vis\u00EDvel' do janela de propriedades do link
function insertTextTotLink(idEditor) {
    var selectTxt = oEditor.getSelection().getSelectedText();
    if ( isValidHttpUrl(selectTxt) ) {
        var link = '<a href="'+selectTxt+'" target="_blank">'+selectTxt+'</a>';
            CKEDITOR.dialog.getCurrent().hide();
            oEditor.insertHtml(link);
    } else {
        setTimeout(function(){ 
            if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) { 
                CKEDITOR.dialog.getCurrent().getContentElement('general', 'contents').setValue(selectTxt);
            }
        }, 100);
    }
}
//// Insere o texto selecionado no documento no campo 'Protocolo' do janela de adicionar protocolo SEI
function insertProtocoloOnBox(idEditor) {
    var selectTxt = oEditor.getSelection().getSelectedText();
    setTimeout(function(){ 
        if ( typeof selectTxt !== 'undefined' && selectTxt != '' ) { 
            CKEDITOR.dialog.getCurrent().getContentElement('general', 'protocolo').setValue(selectTxt);
            document.getElementById(CKEDITOR.dialog.getCurrent().getButton('ok').domId).click();
        }
    }, 100);
}

// openLinkPro() -> js/modules/editor/ (extraido para modulo)
// removeLinkPro() -> js/modules/editor/ (extraido para modulo)
// copyLinkPro() -> js/modules/editor/ (extraido para modulo)
// editLinkPro() -> js/modules/editor/ (extraido para modulo)
// Mantido por compatibilidade com initFunctions(); di\u00E1logo agora eh jQuery UI
// constru\u00EDdo on-demand em openDialogLinkPro().
// getDialogLinkPro() -> js/modules/editor/ (extraido para modulo)

/**
 * Abre o di\u00E1logo de edi\u00E7\u00E3o de link (jQuery UI). Substitui o CKEDITOR.dialog
 * 'editLinkPro'. Preenche os campos a partir do link em foco (a[data-reflinkpro]).
 */
// openDialogLinkPro() -> js/modules/editor/ (extraido para modulo)
// openDialogBatchImgQuality() -> js/modules/editor/ (extraido para modulo)
// Mantido por compat; dialogo em openDialogBatchImgQuality().
// getDialogBatchImgQuality() -> js/modules/editor/ (extraido para modulo)
// initDialogUploadImgBase64() -> js/modules/editor/ (extraido para modulo)
// openDialogUploadImgBase64() -> js/modules/editor/ (extraido para modulo)
// getDialogUploadImgBase64() -> js/modules/editor/ (extraido para modulo)
// hideLinkTips() -> js/modules/editor/ (extraido para modulo)
// showLinkTips() -> js/modules/editor/ (extraido para modulo)
// openImageEditorPro() -> js/modules/editor/ (extraido para modulo)
// initDialogImageEditorPro() -> js/modules/editor/ (extraido para modulo)
// getDialogImageEditorPro() -> js/modules/editor/ (extraido para modulo)
// pageImageBackground() -> js/modules/editor/ (extraido para modulo)
// getDialogPageImageBackground() -> js/modules/editor/ (extraido para modulo)
// getImagemBgOnEditor() -> js/modules/editor/ (extraido para modulo)
// resetOptionsImgBg() -> js/modules/editor/ (extraido para modulo)
// getPreviewImagePageBackground() -> js/modules/editor/ (extraido para modulo)
// getImagePageBackground() -> js/modules/editor/ (extraido para modulo)
// loadImagePageBackground() -> js/modules/editor/ (extraido para modulo)
// templateImagePageBackground() -> js/modules/editor/ (extraido para modulo)
// importDocPro() -> js/modules/editor/ (extraido para modulo)
// getGoogleDocs() -> js/modules/editor/ (extraido para modulo)
// getGoogleSheets() -> js/modules/editor/ (extraido para modulo)
// handleFileImport() -> js/modules/editor/ (extraido para modulo)
async function converterDocxParaHtml(inputFile) {
    try {
      const file = inputFile[0];
      if (!file) throw new Error("Nenhum arquivo .docx selecionado.");
  
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
  
        var r = (!$('#replaceText').is(':checked')) 
            ? true
            : confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
        if (r == true) { 
            loadFileImportEditor(result.value);
        }
  
      if (result.messages.length > 0) {
        console.warn("Mensagens da convers\u00E3o:", result.messages);
      }
    } catch (erro) {
      console.error("Erro ao converter .docx:", erro);
    }
}
// loadFileImportHTML() -> js/modules/editor/ (extraido para modulo)
// loadFileImportEditor() -> js/modules/editor/ (extraido para modulo)
// wordToSEI() -> js/modules/editor/ (extraido para modulo)
function initPasteImgToBase64(editor) {
    if (editor.addFeature) {
        editor.addFeature({
            allowedContent: 'img[alt,id,!src]{width,height};'
        });
    }
    var editableElement = editor.editable ? editor.editable() : editor.document;
    editableElement.on("paste", onPastePro, null, {editor: editor});
}

function onPastePro(event) {
    var editor = event.listenerData && event.listenerData.editor;
    var $event = event.data.$;
    var clipboardData = $event.clipboardData;
    var found = false;
    var imageType = /^image/;
    if (!clipboardData) {
        return;
    }
    return Array.prototype.forEach.call(clipboardData.types, function (type, i) {
        if (found) {
            return;
        }
        if (type.match(imageType) || clipboardData.items[i].type.match(imageType)) {
            readImageAsBase64(clipboardData.items[i], editor);
            return found = true;
        }
    });
}

function readImageAsBase64(item, editor) {
    if (!item || typeof item.getAsFile !== 'function') {
        return;
    }
    var file = item.getAsFile();
    var reader = new FileReader();
    reader.onload = function (evt) {
        var element = editor.document.createElement('img', {
            attributes: {
                src: evt.target.result,
                class: 'img-base64'
            }
        });
        
        if (qualidadeImagens > 0) qualityImages(element.$, element.$);
        // We use a timeout callback to prevent a bug where insertElement inserts at first caret position
        setTimeout(function () {
            editor.insertElement(element);
            var select = editor.getSelection().getStartElement();
            var p = $(select.$).closest('p');
                p.find('img[src*="http"]').not('.img-base64').remove();
        }, 10);
    };
    reader.readAsDataURL(file);
}
function loadPasteImgToBase64() {
	$(txaEditor).each(function(index){ 
		var idEditor_ = $(this).attr('id').replace('cke_', '');
		var iframe_ = $('iframe[title*="'+idEditor_+'"]').contents();
		if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
			var oEditor = CKEDITOR.instances[idEditor_];
				initPasteImgToBase64(oEditor);
		}
	});
}
// updatePreviewLatex() -> js/modules/editor/ (extraido para modulo)
// openDialogLatex() -> js/modules/editor/ (extraido para modulo)
// getDialogLatex() -> js/modules/editor/ (extraido para modulo)
// tableSorterPro() -> js/modules/editor/ (extraido para modulo)
// initContextMenuPro() -> js/modules/editor/ (extraido para modulo)
// INSERE FUNCAO ARRASTA E SOLTA PARA IMAGENS
function initDropImages() {
    if (checkConfigValue('editarimagens')) {
        setTimeout(function () {
            $('iframe.cke_wysiwyg_frame').each(function(index){
                var iframe = $(this).contents();
                var instanceIframe = $(this).attr('title');
                    instanceIframe = (typeof instanceIframe !== 'undefined' && instanceIframe && instanceIframe.split(',').length > 1) ? instanceIframe.split(',')[1].trim() : '';
                if ( iframe.find('body').attr('contenteditable') == 'true' ) {
                    iframe.find('body').attr('data-editor', instanceIframe).unbind().on('drop dragdrop',function(e){
                        var items = e.originalEvent.dataTransfer.items;
                        if (typeof items !== 'undefined') {
                            var currentEditor = CKEDITOR.instances[$(e.currentTarget).data('editor')];
                            if (typeof currentEditor !== 'undefined') {
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].type.indexOf("image") !== -1) {
                                        readImageAsBase64(items[i], currentEditor);
                                    }
                                }
                            }
                        }
                    });
                    setOnBodyActs(iframe);
                }
            });
        }, 1000);
    }
}
function qualityImages( src, dst, quality, type) {
    var tmp = new Image(),
        canvas, context, cW, cH;

        type = type || 'image/jpeg';
        quality = quality || qualidadeImagens*0.01;

        cW = src.naturalWidth;
        cH = src.naturalHeight;

        tmp.src = src.src;
        tmp.onload = function() {
            canvas = document.createElement( 'canvas' );

            cW /= 2;
            cH /= 2;

            if ( cW < src.width ) cW = src.width;
            if ( cH < src.height ) cH = src.height;

            canvas.width = cW;
            canvas.height = cH;
            context = canvas.getContext( '2d' );
            context.drawImage( tmp, 0, 0, cW, cH );

            dst.src = canvas.toDataURL( type, quality );

            if ( cW <= src.width || cH <= src.height )
                return;

            tmp.src = dst.src;
            setTimeout(() => { removeDataCkeSavedImg() }, 500);
        }
}
// INSERE LINK DE DOCUMENTO PUBLICO
// getCheckerProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// openDialogProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
async function resolveCapchaProcessoPublico() {
    if (typeof perfilGemini !== 'undefined' && perfilGemini.KEY_USER && !$('.trListDocPublico').is(':visible')) {
        var imgCaptcha = $('#searchPub_captcha img');
        const base64ImgCaptcha = imgCaptcha.attr('src').startsWith('data:image/') ? imgCaptcha.attr('src') : await getImageBase64FromImgElement(imgCaptcha[0]);
        const captchaResolve = await resolveCaptchaAI("Quais os caracteres da imagem? Responsa apenas com os caracteres, sem espa\u00E7o entre eles", base64ImgCaptcha);
        $('#captchaPub').val(captchaResolve);
        setTimeout(() => {
            if ($('#captchaPub').val() != '' && $('#processoPub').val() != '' && captchaResolve) loadListaProcessoPublicoPro();
        }, 1000);
    }
}
// getDadosIframeProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// checkDadosIframeProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// loadListaProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// getListaProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// getLinksProcessoPublicoPro() -> js/modules/editor/ (extraido para modulo)
// insertAutomaticMinutaWatermark() -> js/modules/editor/ (extraido para modulo)
// insertMinutaWatermark() -> js/modules/editor/ (extraido para modulo)
// getMinutaWatermark() -> js/modules/editor/ (extraido para modulo)
function repairSaveButtonBug(loop = true) {
    if ($('.cke_button.cke_button__save').hasClass('cke_button_off')) {
        for (var i in CKEDITOR.instances) {
            var edit = CKEDITOR.instances[i];
            if (!edit.readOnly) {
                edit.on('saveSnapshot', habilitaSalvar);
                edit.on('key', habilitaSalvar);
                edit.on('afterCommandExec', habilitaSalvar);
                edit.on('tableResize', habilitaSalvar);
            } else {
                edit.document.$.body.style.background=readOnlyColor;
            }
        }
        redimensionar();
        console.log('reparSaveButtonBug');
    }
    if (loop) {
        setTimeout(function(){ 
            repairSaveButtonBug(false);
        }, 3000);
    }
}

// ### FERRAMENTA DE INTELIG\u00CANCIA ARTIFICIAL NO EDITOR DE TEXTOS ###
// Aprimorado em 2025-04-17
    // CARREGAMENTO DIN\u00C2MICO DO SCRIPT DE IA, COM RECURSIVIDADE E TIMEOUT
    const loadPlataformAI = (this_, TimeOut = 9000) => {
        if (TimeOut <= 0) return;
        if (typeof loadSEIProAI !== 'undefined') {
            // getPlataformAI(this_);
            loadBoxAIActions();
        } else {
            if (TimeOut === 9000) $.getScript(URL_SPRO + 'js/sei-pro-ai.js');
            setTimeout(() => {
                loadPlataformAI(this_, TimeOut - 100);
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                    console.log('Reload initBoxAIActions');
                }
            }, 500);
        }
    };

    // FUN\u00C7\u00C3O PARA EXIBI\u00C7\u00C3O DE DI\u00C1LOGOS DE IA
    const getPlataformAI = this_ => {
        setParamEditor(this_);
        if (!getOptionsPro('consentimentoIA')) {
            oEditor.openDialog('plataformAI_disclaimer');
        } else {
            oEditor.openDialog('plataformAI');
        }
    };

    // DI\u00C1LOGO DE RESTRI\u00C7\u00C3O PARA PROCESSOS SIGILOSOS
    const getDialogNaoDisponivel = title => ({
        title,
        minWidth: 500,
        minHeight: 80,
        buttons: [],
        contents: [
            {
                id: 'tab1',
                label: 'Info',
                elements: [
                    {
                        type: 'html',
                        html: sanitizeHTML('<div style="padding: 20px;text-align: center;"><i class="fas fa-exclamation-triangle laranjaColor"></i> N\u00E3o dispon\u00EDvel para processos sigilosos</div>')
                    }
                ]
            }
        ]
    });

    // DI\u00C1LOGOS PRINCIPAIS DE CONSENTIMENTO E ENVIO DE PROMPT PARA A IA
    const getDialogPlataformAI = () => {
        if (checkProcessoSigiloso()) {
            CKEDITOR.dialog.add('plataformAI', editor =>
                getDialogNaoDisponivel(`Inserir texto de intelig\u00EAncia artificial (${currentPlataform === 'openai' ? 'ChatGPT' : 'Gemini'})`)
            );
        } else {
            CKEDITOR.dialog.add('plataformAI_disclaimer', editor => ({
                title: `Intelig\u00EAncia artificial (${currentPlataform === 'openai' ? 'ChatGPT' : 'Gemini'}): Consentimento`,
                minWidth: 500,
                minHeight: 200,
                buttons: [CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton],
                onOk: event => {
                    if ($('#ciente_disclaimer').is(':checked')) {
                        event.data.hide = true;
                        setOptionsPro('consentimentoIA', true);
                        setTimeout(() => oEditor.openDialog('plataformAI'), 1000);
                    } else {
                        alertaBoxPro('Error', 'exclamation-triangle', '\u00C9 necess\u00E1rio consentimento antes de prosseguir!');
                        event.data.hide = false;
                    }
                },
                contents: [{
                    id: 'tab1',
                    label: 'Consentimento',
                    elements: [{
                        type: 'html',
                        html: sanitizeHTML(consentAI)
                    }]
                }]
            }));

            CKEDITOR.dialog.add('plataformAI', editor => ({
                title: `Inserir texto de intelig\u00EAncia artificial (${currentPlataform === 'openai' ? 'ChatGPT' : 'Gemini'})`,
                minWidth: 800,
                minHeight: 80,
                buttons: [],
                onShow() {
                    updateModelsAI();
                    $('#plataformAI_load').hide();

                    if ($('#plataformAI_result').is(':visible')) {
                        this.move(this.getPosition().x, this.getPosition().y + 125);
                        $('#plataformAI_result').html('').hide();
                    }

                    const selectedText = oEditor.getSelection().getSelectedText();
                    if (selectedText !== '') {
                        this.setValueOf('tab_ia', 'textPrompt', selectedText);
                    }

                    $('textarea.cke_dialog_ui_input_textarea').css('white-space', 'break-spaces');

                    if (verifyConfigValue('substituiselecao')) {
                        $('textarea.cke_dialog_ui_input_textarea')
                            .closest('div.cke_dialog_ui_textarea')
                            .css('margin-top', '30px');
                        setChosenInCke(false, '900px');
                    }

                    if (perfilPlataform) {
                        const idKeyword = this.getContentElement('tab_ia_options', 'keyword')._.inputId;
                        const idModel = this.getContentElement('tab_ia_options', 'model')._.inputId;
                        const idModeInline = this.getContentElement('tab_ia_options', 'mode_inline').domId;

                        const elemKeyword = $(`#${idKeyword}`);
                        const elemModel = $(`#${idModel}`);
                        const elemInline = $(`#${idModeInline} input`);

                        elemKeyword.on('change', function () {
                            setOptionsPro('setKeywordInlineAI', $(this).val());
                            $('.wordGpt').text($(this).val());
                        });

                        elemModel.on('change', function () {
                            setOptionsPro('setModelOpenAI', $(this).val());
                        });

                        elemInline.prop('checked', getOptionsPro('setInlineAI')).on('change', function () {
                            getInlineAI(this);
                        });
                    }

                    // DELEGA\u00C7\u00C3O DE EVENTOS PARA FUNCIONALIDADES DE ENVIO E EXEMPLO
                    $(document).on('click', '.sendPrompt', e => {
                        e.preventDefault();
                        getParamAI(e.currentTarget);
                    });
                    $(document).on('click', '.exampleTextAI', e => {
                        e.preventDefault();
                        exampleTextAI(e.currentTarget);
                    });
                },
                contents: [
                    !perfilPlataform ? {
                        id: 'tab_ia',
                        label: 'Cadastro de Token',
                        elements: [{
                            type: 'html',
                            html: sanitizeHTML(disclaimerAI)
                        }]
                    } : {
                        id: 'tab_ia',
                        label: currentPlataform === 'openai' ? 'ChatGPT' : 'Gemini',
                        elements: [
                            {
                                type: 'select',
                                id: 'selectPrompt',
                                label: 'Tipo de Integra\u00E7\u00E3o',
                                width: '100%',
                                items: [
                                    ['Discorra sobre '],
                                    ['Resuma em linguagem simples o seguinte trecho: '],
                                    ['Reescreva o seguinte trecho: '],
                                    ['Descubra a base legal para o seguinte tema: '],
                                    ['Traga o texto legal, sem explica\u00E7\u00F5es, do seguintes dispositivo legal: '],
                                    ['Traduza para portugu\u00EAs a frase: '],
                                    ['Fa\u00E7a uma an\u00E1lise cr\u00EDtica sobre o seguinte t\u00F3pico: '],
                                    ['Liste at\u00E9 10 sin\u00F4nimos em portugu\u00EAs para a palavra: '],
                                    ['Conclua o seguinte texto: '],
                                    ['Extraia as palavras-chave deste texto: '],
                                    ['Converta minha nota curta em uma ata de reuni\u00E3o: '],
                                    ['Fa\u00E7a um resumo em t\u00F3picos do seguinte texto: '],
                                    ['Escreva um texto longo e detalhado, cite fontes e dispositivos legais que embase a argumenta\u00E7\u00E3o sobre o seguinte tema: '],
                                    ['Amplie e reescreva o texto a seguir, em voz ativa, com corre\u00E7\u00F5es gramaticais, citando as fontes e adicinando coes\u00E3o \u00E0s ora\u00E7\u00F5es: '],
                                    ['Crie um Parecer t\u00E9cnico detalhado, cite fontes e legisla\u00E7\u00E3o, traga argumentos a favor e contr\u00E1rios sobre o tema: '],
                                    ['-']
                                ],
                                default: 'Discorra sobre '
                            },
                            {
                                type: 'textarea',
                                label: 'Texto de Entrada',
                                id: 'textPrompt',
                                default: ''
                            },
                            {
                                type: 'html',
                                html: sanitizeHTML(`
                                    <table role="presentation" class="cke_dialog_ui_hbox">
                                        <tbody>
                                            <tr class="cke_dialog_ui_hbox">
                                                <td class="cke_dialog_ui_hbox_last" role="presentation" style="padding:0px;text-align: right;">
                                                    <a class="linkDialog exampleTextAI" style="float:left;" target="_blank">Adicionar texto de exemplo</a>
                                                    <a title="Enviar" class="cke_dialog_ui_button cke_dialog_ui_button_cancel sendPrompt" role="button" aria-labelledby="plataformAI_label">
                                                        <span id="plataformAI_label" class="cke_dialog_ui_button">\u0045nviar</span>
                                                    </a>
                                                    <i id="plataformAI_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div id="plataformAI_result" style="display:none; white-space: break-spaces;"></div>
                                    <div id="plataformAI_alert" style="white-space: break-spaces;margin-top: 10px;font-style: italic; color: #616161;">
                                        <span class="alertaAttencionPro dialogBoxDiv">
                                            <i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i>
                                            Os dados s\u00E3o processados pelo servi\u00E7o 
                                            <a href="${currentPlataform === 'openai' ? 'https://openai.com/' : 'https://gemini.google.com/app'}" class="linkDialog" style="font-style: italic;" target="_blank">${currentPlataform === 'openai' ? 'OpenAI' : 'Google'}</a>.
                                            N\u00E3o envie informa\u00E7\u00F5es restritas ou sigilosas.
                                        </span>
                                    </div>
                                `)
                            }
                        ]
                    },
                    {
                        id: 'tab_ia_options',
                        label: 'Op\u00E7\u00F5es',
                        elements: [
                            {
                                type: 'select',
                                id: 'model',
                                label: 'Modelo de IA',
                                items: currentPlataform === 'openai' ? modelsOpenAI : modelsGemini,
                                default: currentPlataform === 'openai' ? 'gpt-4' : 'gemini-1.5-pro'
                            },
                            {
                                type: 'checkbox',
                                id: 'mode_inline',
                                style: 'margin-top:5px',
                                label: 'Ativar o modo de escrita interativa'
                            },
                            {
                                type: 'select',
                                id: 'keyword',
                                label: 'Palavra de gatilho',
                                items: [['+gpt'], [':gpt'], ['/gpt'], ['.gpt'], ['-gpt']],
                                default: '+gpt'
                            },
                            {
                                type: 'html',
                                html: `<span style="display: block;margin: 5px;font-style: italic;color: #666;">
                                        Digite <span class="wordGpt">${getOptionsPro('setKeywordInlineAI') || '+gpt'}</span> em qualquer parte do documento, seguido do seu prompt. 
                                        Pressione ENTER e veja a magia acontecer \uD83E\uDDD9\u200D\u2642\uFE0F
                                    </span>`
                            }
                        ]
                    }
                ]
            }));
        }
    };

    // FUN\u00C7\u00C3O PRINCIPAL PARA OBTER PAR\u00C2METROS E ENVIAR REQUISI\u00C7\u00C3O \u00C0 IA
    const getParamAI = (this_) => {
        // OBT\u00C9M O DI\u00C1LOGO ATUAL DO CKEDITOR
        const dialog = CKEDITOR.dialog.getCurrent();

        // OBT\u00C9M E TRATA O TEXTO DO PROMPT
        let prompt_text = dialog.getContentElement('tab_ia', 'textPrompt').getValue();
        prompt_text = prompt_text
            .replace(/['"]+/g, '') // REMOVE ASPAS SIMPLES E DUPLAS
            .replace(/\n/g, '\\n') // SUBSTITUI QUEBRAS DE LINHA
            .trim();

        // OBT\u00C9M O VALOR SELECIONADO E TRATA
        let prompt_select = dialog.getContentElement('tab_ia', 'selectPrompt').getValue();
        prompt_select = (prompt_select === '-') ? '' : prompt_select;

        // MOSTRA A \u00C1REA DE LOADING
        $('#plataformAI_load').show();

        // SE O RESULTADO ESTIVER VIS\u00CDVEL, LIMPA E ESCONDE, AJUSTANDO POSI\u00C7\u00C3O DO DI\u00C1LOGO
        if ($('#plataformAI_result').is(':visible')) {
            const position = dialog.getPosition();
            dialog.move(position.x, (position.y + 125));
            $('#plataformAI_result').html('').hide();
        }

        // ENVIA A REQUISI\u00C7\u00C3O PARA A IA
        sendRequestAI(prompt_select, prompt_text);
    };

    const sendRequestAI = (prompt_select, prompt_text, inline = false) => {
        let ai_response_editor;

        openai_test();

        // FUN\u00C7\u00C3O PRINCIPAL RESPONS\u00C1VEL POR ENVIAR A SOLICITA\u00C7\u00C3O PARA A API
        async function openai_test() {
            const model = currentPlataform === 'openai'
                ? getOptionsPro('setModelOpenAI') || 'gpt-4'
                : getOptionsPro('setModelGemini') || 'gemini-1.5-pro';

            const url = currentPlataform === 'openai'
                ? `${perfilPlataform.URL_API}v1/chat/completions`
                : `${perfilPlataform.URL_API}v1/models/${model}:generateContent?key=${perfilPlataform.KEY_USER}`;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', 'application/json');
            if (currentPlataform === 'openai') {
                xhr.setRequestHeader('Authorization', `Bearer ${perfilPlataform.KEY_USER}`);
            }

            if (inline) {
                setTimeout(() => {
                    $(oEditor.getSelection().getStartElement().$).closest('p').html(
                        '<span class="dot-flashing" contenteditable="false" style="margin: 0 20px;display: inline-block;">\u00A0</span>'
                    );
                });
            }

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log(xhr.status);
                    console.log(xhr.responseText);

                    ai_response_editor = JSON.parse(xhr.responseText);

                    console.log(ai_response_editor);

                    const responseText = currentPlataform === 'openai'
                        ? ai_response_editor.choices[0].message.content.replace(/(?:\r\n|\r|\n)/g, '<br>')
                        : ai_response_editor.candidates[0].content.parts[0].text.replace(/(?:\r\n|\r|\n)/g, '<br>');

                    const btnInsertText = `
                        <span class="btn-insert-text" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;">
                            <i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i>
                            Adicionar
                        </span>`;

                    const htmlResult = `
                        <div class="result" style="padding-top: 15px;">
                            ${btnInsertText}
                            <span class="text" style="white-space: break-spaces;font-size: 10pt;font-family: system-ui;text-align: justify;line-height: 14pt;overflow-y: scroll;height: 300px !important;display: block;">
                                <span class="blinker">\u0020</span>
                            </span>
                        </div>`;

                    const dialog = CKEDITOR.dialog.getCurrent();

                    if (!inline) {
                        $('#plataformAI_load').hide();
                        // SANITIZA O HTML ANTES DE INSERIR
                        $('#plataformAI_result').html(sanitizeHTML(htmlResult)).show();
                        $('#plataformAI_result .result .text').data('text', responseText);
                        dialog.move(dialog.getPosition().x, (dialog.getPosition().y - 125));
                    }

                    // EFEITO DE "DIGITA\u00C7\u00C3O" DO TEXTO DE RESPOSTA
                    let i = 0;
                    let isTag;
                    let text;

                    (function type() {
                        const container = inline
                            ? $(oEditor.getSelection().getStartElement().$).closest('p')
                            : $('#plataformAI_result .result .text');

                        text = responseText.slice(0, ++i);
                        if (text === responseText) return;

                        container.html(text + (!inline ? '<span class="blinker">\u0020</span>' : ''));
                        if (!inline) container[0].scrollTop = container[0].scrollHeight;

                        const char = text.slice(-1);
                        if (char === '<') isTag = true;
                        if (char === '>') isTag = false;
                        if (isTag) return type();

                        setTimeout(type, 10);
                    })();

                    // DELEGA\u00C7\u00C3O DE EVENTOS AP\u00D3S CARGA DIN\u00C2MICA
                    $(document).on('click', '.result .text', (e) => {
                        insertTextEditorSEI(e.currentTarget);
                    });

                } else if (xhr.status >= 400) {
                    console.log(xhr.status);
                    console.log(xhr.responseText);

                    ai_response_editor = JSON.parse(xhr.responseText);

                    $('#plataformAI_load').hide();
                    $('#plataformAI_result').html(
                        `<strong class="alertaErrorPro dialogBoxDiv" style="white-space: break-spaces;background-color: #fff1f0;padding: 10px;margin: 10px 0;border-radius: 8px;">
                            <i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i>
                            ${ai_response_editor.error.message}
                        </strong>`
                    ).show();
                }
            };

            // DADOS DO CORPO DA REQUISI\u00C7\u00C3O
            const temperature = getOptionsPro('setTemperatureAI') || '0.4';
            const maxTokens = getOptionsPro('setMaxTokensAI') || '6400';
            const topP = getOptionsPro('setTopPAI') || '1';
            const frequencyPenalty = getOptionsPro('setFrequencyPenaltyAI') || '0';
            const presencePenalty = getOptionsPro('setPresencePenaltyAI') || '0';

            const data = currentPlataform === 'openai'
                ? JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: prompt_select + prompt_text }],
                    temperature: parseFloat(temperature),
                    max_tokens: parseInt(maxTokens),
                    top_p: parseFloat(topP),
                    frequency_penalty: parseFloat(frequencyPenalty),
                    presence_penalty: parseFloat(presencePenalty)
                })
                : JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt_select + prompt_text }]
                    }]
                });

            xhr.send(data);
        }

        // DELEGA\u00C7\u00C3O DE EVENTO PARA O BOT\u00C3O "ADICIONAR"
        $(document).on('click', '.btn-insert-text', function () {
            insertTextEditorSEI(this);
        });
    }

    // INSERE TEXTO NO EDITOR SEI
    const insertTextEditorSEI = (this_) => {
        const _this = $(this_);
        const textData = _this.closest('.result').find('.text').data('text');
        const text = (textData !== 'undefined')
            ? textData
            : $('<div>').append(_this.closest('.result').find('.text').clone()).text();

        const select = oEditor.getSelection().getStartElement();
        const pElement = $(select.$).closest('p');

        if (pElement.length) {
            oEditor.focus();
            oEditor.fire('saveSnapshot');

            if (frmEditor.length) {
                const classP = iframeEditor.find(pElement).attr('class');
                const pText = text.includes('\n')
                    ? text.split('\n').map(v =>
                        (v === '')
                            ? '<p class="Citacao"><br></p>'
                            : `<p class="${classP}">${sanitizeHTML(v)}</p>`)
                    : [`<p class="${classP}">${sanitizeHTML(text)}</p>`];

                iframeEditor.find(pElement).after(pText);
                CKEDITOR.dialog.getCurrent().hide();
            } else {
                pElement.before(sanitizeHTML(text));
            }

            oEditor.fire('saveSnapshot');
        }
    };

    // SELECIONA TEXTO DE EXEMPLO COM BASE NA OP\u00C7\u00C3O ESCOLHIDA
    const exampleTextAI = () => {
        const dialog = CKEDITOR.dialog.getCurrent();
        const promptSelect = dialog.getContentElement('tab_ia', 'selectPrompt').getValue();

        let exampleText = false;

        exampleText = (promptSelect === 'Discorra sobre ') ? 'o poder de pol\u00EDcia administrativo' : exampleText;
        exampleText = (promptSelect === 'Resuma em linguagem simples o seguinte trecho: ') ? 'N\u00E3o sendo ela, de modo nenhum, pass\u00EDvel de compara\u00E7\u00E3o com qualquer ep\u00EDteto quinquagen\u00E1rio, ou mito gerado por qualquer estrat\u00E9gia mercadol\u00F3gica ou interesse de m\u00EDdia "hollywoodiana", distor\u00E7\u00E3o que resta, evidentemente, imperdo\u00E1vel. Tal afirma\u00E7\u00E3o queima exposta a luz da imperativa e facilmente constat\u00E1vel modernidade de que se reveste a mesma, a quem fica, intrinsecamente, atribu\u00EDdo ox\u00EDmoro j\u00E1 mil vezes reverberado, de ef\u00EAmera personalidade.' : exampleText;
        exampleText = (promptSelect === 'Reescreva o seguinte trecho: ') ? 'Muitos s\u00E3o os princ\u00EDpios que regem a seara trabalhista, al\u00E9m do princ\u00EDpio da prote\u00E7\u00E3o que se divide em outros subprinc\u00EDpios, temos o princ\u00EDpio da continuidade da rela\u00E7\u00E3o de emprego, da primazia da realidade, da irrenunciabilidade dos direitos trabalhistas, da irredutibilidade salarial, dentre outros de suma import\u00E2ncia para a estrutura do Direito do Trabalho. ' : exampleText;
        exampleText = (promptSelect === 'Descubra a base legal para o seguinte tema: ') ? 'restri\u00E7\u00E3o \u00E0 fragmenta\u00E7\u00E3o de despesas p\u00FAblicas' : exampleText;
        exampleText = (promptSelect === 'Traga o texto legal, sem explica\u00E7\u00F5es, do seguintes dispositivo legal: ') ? 'art. 5\u00BA, inc. X da CF' : exampleText;
        exampleText = (promptSelect === 'Traduza para portugu\u00EAs a frase: ') ? 'A Perspective on the Sources of the Brazilian Law' : exampleText;
        exampleText = (promptSelect === 'Fa\u00E7a uma an\u00E1lise cr\u00EDtica sobre o seguinte t\u00F3pico: ') ? 'porte de armas' : exampleText;
        exampleText = (promptSelect === 'Liste at\u00E9 10 sin\u00F4nimos em portugu\u00EAs para a palavra: ') ? 'retumbante' : exampleText;
        exampleText = (promptSelect === 'Conclua o seguinte texto: ') ? 'O direito ao sil\u00EAncio ou direito a n\u00E3o autoincrimina\u00E7\u00E3o \u00E9 dos direitos fundamentais elencados pela nossa constitui\u00E7\u00E3o.' : exampleText;
        exampleText = (promptSelect === 'Extraia as palavras-chave deste texto: ') ? 'Pontes Miranda adota a teoria bipartida, segundo a qual s\u00F3 existem impostos e taxas. Jos\u00E9 Afonso da Silva arrola impostos, taxas e contribui\u00E7\u00F5es como esp\u00E9cies tribut\u00E1rias, ou seja, uma classifica\u00E7\u00E3o tripartida. Luciano Amaro, por sua vez, lista quatro esp\u00E9cies tribut\u00E1rias: Impostos, taxas, contribui\u00E7\u00E3o de melhoria e empr\u00E9stimo compuls\u00F3rio, caracterizando ent\u00E3o, a ado\u00E7\u00E3o de uma teoria quadripartida. Ademais, Ives Gandra Martins vai al\u00E9m e nomeia cinco esp\u00E9cies tribut\u00E1rias, ou seja, uma classifica\u00E7\u00E3o quinquipartida, s\u00E3o elas: impostos, taxas, contribui\u00E7\u00E3o de melhoria, empr\u00E9stimos compuls\u00F3rios e contribui\u00E7\u00F5es especiais.' : exampleText;
        exampleText = (promptSelect === 'Converta minha nota curta em uma ata de reuni\u00E3o: ') ? 'Pedro: Lucros de at\u00E9 50% Tiago: Novos servidores est\u00E3o online Helio: Precisa de mais tempo para consertar o software Renata: Feliz em ajudar Paulo: Teste beta quase pronto' : exampleText;
        exampleText = (promptSelect === 'Fa\u00E7a um resumo em t\u00F3picos do seguinte texto: ') ? 'O cidad\u00E3o que exerce uma cidadania ativa, se compromete e se envolve em todos os assuntos da comunidade em que vive, exemplo da luta cotidiana por direitos individuais e coletivos. A mesma necessita de uma participa\u00E7\u00E3o p\u00FAblica e deve ter como base o respeito em rela\u00E7\u00E3o \u00E0s diferen\u00E7as e a supera\u00E7\u00E3o das desigualdades sociais que assolam a nossa sociedade, buscando sempre um consenso em que privilegie a maioria dos envolvidos.' : exampleText;
        exampleText = (promptSelect === 'Escreva um texto longo e detalhado, cite fontes e dispositivos legais que embase a argumenta\u00E7\u00E3o sobre o seguinte tema: ') ? 'servi\u00E7o p\u00FAblico adequado e modicidade tarif\u00E1ria no transporte p\u00FAblico' : exampleText;
        exampleText = (promptSelect === 'Amplie e reescreva o texto a seguir, em voz ativa, com corre\u00E7\u00F5es gramaticais, citando as fontes e adicinando coes\u00E3o \u00E0s ora\u00E7\u00F5es: ') ? 'A Corte de Contas cuida do progresso da governan\u00E7a na administra\u00E7\u00E3o p\u00FAblica, cabendo ao \u00F3rg\u00E3os e gestore executar as devidas etapas e corre\u00E7\u00F5es, devendo entender o prop\u00F3sito da governan\u00E7a, buscando o aprimoramento constante.' : exampleText;
        exampleText = (promptSelect === 'Crie um Parecer t\u00E9cnico detalhado, cite fontes e legisla\u00E7\u00E3o, traga argumentos a favor e contr\u00E1rios sobre o tema: ') ? 'O aborto e a microcefalia' : exampleText;

        if (exampleText) {
            dialog.setValueOf('tab_ia', 'textPrompt', exampleText);
        }
    };

    // INICIALIZA\u00C7\u00C3O AUTOM\u00C1TICA DA PLATAFORMA COM RETENTATIVAS
    const initPlataformAI = (TimeOut = 9000) => {
        if (TimeOut <= 0) return;

        if (typeof checkConfigValue !== 'undefined' && typeof localStorageRestorePro !== 'undefined') {
            if (restrictConfigValue('ferramentasia')) {
                setTimeout(() => {
                    try {
                        let perfilPlataform = localStorageRestorePro('configBasePro_openai');
                        perfilPlataform = (typeof perfilPlataform !== 'undefined' && perfilPlataform !== null) ? perfilPlataform : false;
                        getDialogPlataformAI();
                    } catch (e) {
                        // getDialogPlataformAI depende de CKEDITOR.dialog (API CK4).
                        // No CK5 silenciamos; fica pendente de porta jQuery UI.
                    }
                }, 500);
            }
        } else {
            setTimeout(() => {
                initPlataformAI(TimeOut - 100);
                if (typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) {
                    console.log('Reload initPlataformAI', typeof localStorageRestorePro, typeof localStorageRestorePro('configBasePro_openai'));
                }
            }, 500);
        }
    };

    // FUN\u00C7\u00C3O PARA ADICIONAR MENU DE INTELIG\u00CANCIA ARTIFICIAL NO CKEDITOR
    const menuPlataformAI = (editor) => {
        if (editor.contextMenu && typeof editor.getMenuItem('plataform_ai') === 'undefined') {
            editor.addMenuGroup('openaiGroup', -10 * 3);
            editor.addMenuItem('plataform_ai', {
                label: 'Intelig\u00EAncia artificial',
                icon: `${URL_SPRO}icons/editor/ferramentasia.png`,
                command: 'plataform_ai',
                group: 'openaiGroup'
            });

            // ADICIONA OP\u00C7\u00C3O AO MENU DE CONTEXTO SOMENTE SE HOUVER SELE\u00C7\u00C3O
            editor.contextMenu.addListener((element) => {
                if (hasSelection(editor)) {
                    return { plataform_ai: CKEDITOR.TRISTATE_OFF };
                }
            });

            // COMANDO PARA ABRIR O DI\u00C1LOGO DE IA
            editor.addCommand('plataform_ai', {
                exec: (editor) => {
                    editor.openDialog('plataformAI');
                }
            });
        }
    };

    // FUN\u00C7\u00C3O PARA ALTERAR OP\u00C7\u00D5ES DE IA INLINE
    const getInlineAI = (this_) => {
        const check = $(this_).is(':checked');
        setOptionsPro('setInlineAI', check);
        setOnKeyEditor(!check);
    };

function setOnKeyEditor(destroy = false) {
    if ((!loadOnKeyEditor || loadOnKeyEditor != oEditor.name) && !destroy) {
            oEditor.on('key', function (evt) {
                var self = this;
                var event = evt;
                keyActionEditor(event, self);
                setTimeout(function() {
                    evtInlineOpenAI(event);
                    keyupActionEditor(event, self);
                }, 10);
            });
            loadOnKeyEditor = oEditor.name;
    } else if (destroy) {
        removeOptionsPro('setInlineAI');
    }
}
function evtInlineOpenAI(evt) {
    if (evt.data.keyCode == 13 && getOptionsPro('setInlineAI')) {
        var keyword = getOptionsPro('setKeywordInlineAI');
            keyword = (keyword) ? keyword : '+gpt';
        var select = oEditor.getSelection().getStartElement();
        var pElement = $(select.$).closest('p');
        var textP = pElement.text();
        if (textP.indexOf(keyword) !== -1) {
            var prompt_text = textP.split(keyword)[1].trim();
            sendRequestAI('', prompt_text, true);
        }
    }
}
function keyupActionEditor(evt, self) {
    var pElement = $(oEditor.getSelection().getStartElement().$).closest('p');
    if (verifyConfigValue('escrivainterativa') && (!pElement.find('.imgBgAncora').length || !pElement.find('.minutaAncora').length) && (evt.data.keyCode == 2228275 || (pElement.find('.linkDisplayPro').length && pElement.text().indexOf('#') !== -1) || pElement.text().indexOf('#') !== -1)) {
        showTagsTips(pElement[0], $(oEditor.container.$).find('iframe').contents());
    } else if (verifyConfigValue('escrivainterativa') && (!pElement.find('.imgBgAncora').length || !pElement.find('.minutaAncora').length) && (evt.data.keyCode == 2228274 || (pElement.find('.linkDisplayPro').length && pElement.text().indexOf('@') !== -1) || pElement.text().indexOf('@') !== -1)) {
        showInteressadosTips(pElement[0], $(oEditor.container.$).find('iframe').contents());
        // console.log('@',pElement[0], $(oEditor.container.$).find('iframe').contents());
    }
    // console.log(evt.data.keyCode, verifyConfigValue('escrivainterativa'), !pElement.find('.imgBgAncora').length, !pElement.find('.minutaAncora').length, evt.data.keyCode == 2228274, pElement.find('.linkDisplayPro').length, pElement.text().indexOf('@'));
}
function keyActionEditor(evt, self) {
    var pElement = $(oEditor.getSelection().getStartElement().$).closest('p');
    if (verifyConfigValue('escrivainterativa')) {
        if ((evt.data.keyCode == 40 || evt.data.keyCode == 38) && pElement.find('.linkDisplayPro').length) {
            evt.cancel();
            evt.stop();
            indexDisplayPro = evt.data.keyCode == 40 ? indexDisplayPro+1 : indexDisplayPro;
            indexDisplayPro = evt.data.keyCode == 38 ? indexDisplayPro-1 : indexDisplayPro;
            indexDisplayPro = indexDisplayPro < 0 ? 0 : indexDisplayPro;
        } else if ((evt.data.keyCode == 13 || evt.data.keyCode == 9) && pElement.find('.linkDisplayPro').length) {
            evt.cancel();
            evt.stop();
            pElement.find('.linkDisplayPro li.highlighted').trigger('click');
            return false;
        }
    }
    // console.log(evt.data.keyCode);
}
function getTextTagTip(keyCode = '#') {

      
    /* var range = oEditor.getSelection().getRanges()[0],
        startNode = range.startContainer;
    var textP = startNode.getText().substring(0,range.startOffset); */

    var e = oEditor;
    var r = oEditor.getSelection().getRanges()[ 0 ];
        r.collapse( 1 );
        r.setStartAt( ( r.startPath().block || r.startPath().blockLimit ).getFirst(), CKEDITOR.POSITION_AFTER_START );
    var docFr = r.cloneContents();
    var textP = docFr.$.textContent;
        textP = (textP.indexOf(keyCode) !== -1) ? textP.split(keyCode)[1].trim() : false;
        textP = textP ? textP.replace(invisibleCharacters, "") : textP;
        // console.log(textP); 
    return textP;
}
function showInteressadosTips(this_, iframeDoc) {
    var textTip = getTextTagTip('@');
    var index = 0;
    // if (textTip && textTip !== '' && lastTextTip != textTip) {
    if (textTip && textTip != '') {
        lastTextTip = textTip;
        getInteressadosProcesso(textTip, function(result){
            resultTextTip = result;
            renderTagsTips(this_, iframeDoc, textTip, result);
        });
    } else {
        // if (lastTextTip && resultTextTip) renderTagsTips(this_, iframeDoc, lastTextTip, resultTextTip);
    }
}
function renderTagsTips(this_, iframeDoc, textTip, result) {
    var htmlTips = $.map(result, function(v, i){
                        return "<li contenteditable='false' data-text='<span contenteditable=\"false\" style=\"text-indent:0px;\" class=\"ancoraSei interessadoSeiPro\" data-id=\""+v.id+"\">"+v.descricao+"</span>&nbsp;' data-id='"+v.id+"' data-keycode='@' data-index='"+i+"' data-texttip='"+textTip+"' class='"+(indexDisplayPro == i ? 'highlighted' : '')+"' onmouseover='parent.hoverTapTip(this)' onclick='parent.setTagTip(this)'>"+v.descricao+"</li>";
                    }).join('');
        htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;

    var html =  '<div class="linkDisplayPro" unselectable="on" contenteditable="false">'+
                '  <ul>'+
                '    '+htmlTips+
                '  </ul>'+
                '</div>'; 

    iframeDoc.find('.linkDisplayPro').remove();
    $(this_).append(html);
    replaceTextOnEditor('@','<a name="tagtip"></a></span>@');
    centralizeTapTip(this_);
}
function showTagsTips(this_, iframeDoc) {
    var textTip = getTextTagTip();
    var index = 0;
    var listDocumentos = $.map(dadosProcessoPro.listDocumentos, function (v) {
                            var select_text = ( v.nr_sei != '' ) ? v.documento+' ('+v.nr_sei+')' : v.documento;
                            var citacaoDoc = getCitacaoDoc();
                            var nrSei = ( v.nr_sei != '' ) ? v.nr_sei : v.documento;
                            var nrSeiHtml = '<span contenteditable="false" style="text-indent:0;"><a class="ancoraSei" id="lnkSei'+v.id_protocolo+'" style="text-indent:0;">'+nrSei+'</a></span>';
                            var citacaoDocumento = ( v.nr_sei != '' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? v.documento.trim()+'&nbsp;('+citacaoDoc+nrSeiHtml+')' : nrSeiHtml;
                        
                            if ( v.documento != '' ) { return [[select_text, citacaoDocumento]] }
                        });
    var listDadosProcesso = arrayDadosEditor();
    var listTagTip = listDadosProcesso.concat(listDocumentos);
    var htmlTips = $.map(listTagTip, function(v){ 
                        var txtTag = !!v[0] ? removeAcentos(v[0]).replace(/[^\x00-\x7F]/g, '').toLowerCase() : false;
                        var txtTip = !!v[0] ? removeAcentos(textTip).replace(/[^\x00-\x7F]/g, '').toLowerCase() : false;
                        var checkTag = txtTag && txtTip ? txtTag.includes(txtTip) : false;
                        if (!!v[1] && (!textTip || textTip == '' || checkTag) ) { 
                            index++; 
                            return "<li contenteditable='false' data-text='"+v[1]+"' data-keycode='#' data-index='"+index+"' data-texttip='"+textTip+"' class='"+(indexDisplayPro == index-1 ? 'highlighted' : '')+"' onmouseover='parent.hoverTapTip(this)' onclick='parent.setTagTip(this)'>"+v[0]+"</li>" 
                        } 
                    }).join('');
        htmlTips = htmlTips == "" ? "<li contenteditable='false' style='padding: 5px; cursor:pointer'>Nenhum resultado encontrado</li>" : htmlTips;
    var html =  '<div class="linkDisplayPro" unselectable="on" contenteditable="false">'+
                '  <ul>'+
                '    '+htmlTips+
                '  </ul>'+
                '</div>'; 

            iframeDoc.find('.linkDisplayPro').remove();
            $(this_).append(html);
            replaceTextOnEditor('#','<a name="tagtip"></a></span>#');
            centralizeTapTip(this_);
}
function centralizeTapTip(this_) {
    var boxDisplayLink = $(this_).find('.linkDisplayPro');
    var boxDisplayLink_offset = $(this_).find('a[name="tagtip"]').offset();
    if (typeof boxDisplayLink_offset !== 'undefined') {
        var elemBody = $('iframe[title*="'+oEditor.name+'"]').contents().find('body');
        var ckeContent = $('iframe[title*="'+oEditor.name+'"]').closest('.cke_contents');
        var heightBody = elemBody.height();
        var boxDisplayLink_left = boxDisplayLink_offset.left;
        var boxDisplayLink_top = boxDisplayLink_offset.top;
        var boxDisplayLink_width = boxDisplayLink.width();
        var windowWidth = $(window).width();
        // var marginLeft = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-(boxDisplayLink_left+boxDisplayLink_width+45) : 0;
            // marginLeft = marginLeft < 0 ? 0 : marginLeft;
        var marginTop = (boxDisplayLink_top + 223) > heightBody ? '-240px' : '15px';

        var leftBox = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? undefined : boxDisplayLink_left;
        var rightBox = ( boxDisplayLink_left+boxDisplayLink_width > windowWidth ) ? windowWidth-boxDisplayLink_left - 40 : undefined;
            rightBox = (windowWidth/3)*2 > boxDisplayLink_left && boxDisplayLink_left > (windowWidth/3) ? (windowWidth-boxDisplayLink_width)/2 : rightBox;

        // console.log({boxDisplayLink_offset: boxDisplayLink_offset, boxDisplayLink_width: boxDisplayLink_width, windowWidth: windowWidth, mid: (windowWidth/3)*2 > boxDisplayLink_left && boxDisplayLink_left > (windowWidth/3)});
        // console.log(windowWidth/3, (windowWidth/3)*2, boxDisplayLink_left, (windowWidth/3)*2 > boxDisplayLink_left, boxDisplayLink_left > (windowWidth/3) );

        if (heightBody < 250) {
            elemBody.css({'margin-bottom': '250px'});
            ckeContent.addClass('resizeDisplayLink');
            marginTop = boxDisplayLink_top > 250 ? marginTop : '15px';
        }

            // boxDisplayLink.css({'margin-left': marginLeft, 'margin-top': marginTop, 'left': boxDisplayLink_left, top: boxDisplayLink_offset.top});
            boxDisplayLink.css({'margin-top': marginTop, 'left': leftBox, 'right': rightBox, top: boxDisplayLink_offset.top});
            $(this_).find('a[name="tagtip"]').remove();
        if (!$(this_).find('.linkDisplayPro ul li.highlighted').length) {
            $(this_).find('.linkDisplayPro ul li').eq(0).addClass('highlighted');
            indexDisplayPro = 0;
        }
        if (indexDisplayPro > 6) $(this_).find('.linkDisplayPro ul').scrollTop(29.5*(indexDisplayPro-6));
    }
}
function hoverTapTip(this_) {
    var _this = $(this_);
    _this.closest('ul').find('li.highlighted').removeClass('highlighted');
    _this.addClass('highlighted');
    indexDisplayPro = _this.data('index');
}
function setTagTip(this_) {
    var _this = $(this_);
    var textTip = getTextTagTip();
    var textTip = _this.data('texttip');
    var textReplace = _this.data('text');
    var keyCode = _this.data('keycode');
    var select = oEditor.getSelection().getStartElement();
    var pElement = $(select.$).closest('p');
        $(oEditor.getSelection().getStartElement().$).closest('p').find('.linkDisplayPro').remove();
        replaceTextOnEditor(keyCode+textTip, textReplace);
        indexDisplayPro = 0;
        lastTextTip = false;
        resultTextTip = false;
        restoreIframeDisplayLink();
} 
function restoreIframeDisplayLink() {
    if (typeof oEditor !== 'undefined' && typeof oEditor.name !== 'undefined') {
        var elemBody = $('iframe[title*="'+oEditor.name+'"]').contents().find('body');
        var ckeContent = $('iframe[title*="'+oEditor.name+'"]').closest('.cke_contents');
        if (ckeContent.hasClass('resizeDisplayLink')) {
            elemBody.css({'margin-bottom': '0'});
            ckeContent.removeClass('resizeDisplayLink');
        }
    }
}
var storeCursorLocation = function( oEditor ) {
    bookmark = oEditor.getSelection().createBookmarks( true );
};
var restoreCursorLocation = function( oEditor ) {
    oEditor.getSelection().selectBookmarks( bookmark );
};
function replaceTextOnEditor(findString, replaceString) {
    oEditor.focus(); 
    storeCursorLocation(oEditor);
    var sel = oEditor.getSelection();
    var element = sel.getStartElement();
    var data = element.getHtml();
    var replaced_text = data.replace(invisibleCharacters, "").replace(findString, replaceString);
        element.setHtml(replaced_text);
        restoreCursorLocation(oEditor);
}
function selectTextOnEditor(findString) {
    try {
        var sel = oEditor.getSelection();
        var element = sel.getStartElement();
        var pElement = $(element.$).closest('p');
            pElement.html(pElement.html().replace(/^\n|\n$/g, ''));
            sel.selectElement(element);

        var ranges = oEditor.getSelection().getRanges();
        var startIndex = element.getHtml().indexOf(findString);
        if (startIndex != -1) {
            ranges[0].setStart(element.getFirst(), startIndex);
            ranges[0].setEnd(element.getFirst(), startIndex + findString.length);
            console.log([ranges[0]]);
            sel.selectRanges([ranges[0]]);

            var range = sel.getRanges()[0];
                range.deleteContents();
                range.select();
        }
    } catch (e) {
        console.log(e);
        return false;
    }
}
// INSERE REFERENCIA INTERNA
// getRefInterna() -> js/modules/editor/ (extraido para modulo)
// updateRefsInternas() -> js/modules/editor/ (extraido para modulo)
// getNiveisParagrafos() -> js/modules/editor/ (extraido para modulo)
function clickScroolToRef() {
    $('iframe.cke_wysiwyg_frame').each(function(index){
        var iframe_ = $(this).contents();
        if ( iframe_.find('body').attr('contenteditable') == 'true' ) {
            iframe_.find('.anchorRefInternaPro').unbind().on('click', function(){
                var _this = $(this);
                var ref = _this.attr('href');
                    ref = (typeof ref !== 'undefined') ? ref.replace('#','') : false;
                if (ref) {
                    var container = $('#divEditores');
                    var element = iframe_.find('a[name="'+ref+'"]').closest('p');
                    var position = element.offset().top + 270;
                    container.animate({
                        scrollTop: position
                    });
                }
            });
        }
    });
}

// getCharOnCursor() -> js/modules/editor/ (extraido para modulo)
// setStyleReview() -> js/modules/editor/ (extraido para modulo)
// showReviewTips() -> js/modules/editor/ (extraido para modulo)
// scroolToReview() -> js/modules/editor/ (extraido para modulo)
// getHtmlReviewDisplayPro() -> js/modules/editor/ (extraido para modulo)
// addCommentReviewPro() -> js/modules/editor/ (extraido para modulo)
// removeReviewPro() -> js/modules/editor/ (extraido para modulo)
// setRemoveReviewPro() -> js/modules/editor/ (extraido para modulo)
// hideReviewTips() -> js/modules/editor/ (extraido para modulo)
// getStyleReview() -> js/modules/editor/ (extraido para modulo)
// setListElementsSelected() -> js/modules/editor/ (extraido para modulo)
// setPositionCursor() -> js/modules/editor/ (extraido para modulo)
// getBoxCtrReview() -> js/modules/editor/ (extraido para modulo)
// contentDialogReview() -> js/modules/editor/ (extraido para modulo)
// getDialogReview() -> js/modules/editor/ (extraido para modulo)
// getBoxReview() -> js/modules/editor/ (extraido para modulo)
// initStyleReview() -> js/modules/editor/ (extraido para modulo)

// CKWebSpeech
// CKWebSpeech is a speech recognition plugin to CKEditor, it type out voice ideas into CKEdtior, with support for 32 languages from 62 culture variants.
// https://github.com/ultranaco/ckwebspeech

// instanceDitadoPro() -> js/modules/editor/ (extraido para modulo)
// getBoxDitado() -> js/modules/editor/ (extraido para modulo)
// getBoxCtrDitado() -> js/modules/editor/ (extraido para modulo)
// initDitadoPro() -> js/modules/editor/ (extraido para modulo)
// getDialogDitado() -> js/modules/editor/ (extraido para modulo)
// getBoxStyleEditor() -> js/modules/editor/ (extraido para modulo)
// updateStyleEditor() -> js/modules/editor/ (extraido para modulo)
function initFunctions() {
    // Cada initializer eh envolvido para que uma falha (ex: CKEDITOR.dialog.add
    // em CK5) nao interrompa as demais. Util durante a migracao para CK5, onde
    // parte das funcoes ainda depende de APIs exclusivas do CK4.
    // Erros previsiveis no CK5 (APIs ausentes como CKEDITOR.dialog, CKEDITOR.on
    // ou replace de undefined em iframe) sao silenciados para reduzir ruido.
    var isCK5 = typeof SeiProEditorAdapter !== 'undefined' && SeiProEditorAdapter.version === 5;
    var knownMissingAPI = /reading 'add'|reading 'replace'|CKEDITOR\.on is not a function|CKEDITOR\.dom/;
    var tryRun = function (fn, name) {
        try { fn(); } catch (e) {
            var msg = (e && e.message) ? e.message : String(e);
            if (isCK5 && knownMissingAPI.test(msg)) return; // esperado: feature ainda depende de API CK4
            if (typeof console !== 'undefined' && console.warn) {
                console.warn('[SEIPro] ' + name + ' falhou:', msg);
            }
        }
    };
    tryRun(initContextMenuPro, 'initContextMenuPro');
    tryRun(getDialogLegisSEI, 'getDialogLegisSEI');
    tryRun(getDialogNotaRodape, 'getDialogNotaRodape');
    tryRun(initPlataformAI, 'initPlataformAI');
    tryRun(getDialogSyleTable, 'getDialogSyleTable');
    tryRun(getDialogQrCode, 'getDialogQrCode');
    tryRun(getDialogLinkPro, 'getDialogLinkPro');
    tryRun(getDialogPageImageBackground, 'getDialogPageImageBackground');
    tryRun(initDialogUploadImgBase64, 'initDialogUploadImgBase64');
    tryRun(getDialogSigilo, 'getDialogSigilo');
    tryRun(getDialogReview, 'getDialogReview');
    tryRun(getDialogDitado, 'getDialogDitado');
    tryRun(getDialogBatchImgQuality, 'getDialogBatchImgQuality');
    tryRun(initDialogImageEditorPro, 'initDialogImageEditorPro');
    tryRun(loadResizeImg, 'loadResizeImg');
    tryRun(updateDialogDefinitionPro, 'updateDialogDefinitionPro');
    tryRun(loadPasteImgToBase64, 'loadPasteImgToBase64');
    tryRun(function () { insertFontIcon('head'); }, 'insertFontIcon');
    tryRun(reloadModalLink, 'reloadModalLink');
    tryRun(setDocCertidao, 'setDocCertidao');
    tryRun(setDocAutomatico, 'setDocAutomatico');
    tryRun(checkAutoSave, 'checkAutoSave');
    tryRun(initDropImages, 'initDropImages');
    tryRun(getStylesOnEditor, 'getStylesOnEditor');
    tryRun(repairSaveButtonBug, 'repairSaveButtonBug');
    tryRun(clickScroolToRef, 'clickScroolToRef');
    tryRun(checkLoadJqueryUI, 'checkLoadJqueryUI');

    // RETORNA DADOS DO PROCESSO
    tryRun(function () {
        var idProcedimento = getParamsUrlPro(window.location.href).id_procedimento;
        if (!checkHostLimit()) getDadosIframeProcessoPro(idProcedimento, 'editor');
    }, 'getDadosIframeProcessoPro');
    tryRun(function () {
        if (getOptionsPro('setKeywordInlineAI')) $.getScript(URL_SPRO+"js/sei-pro-ai.js");
    }, 'sei-pro-ai');
}
$('body').addClass('seiEditor');

// Boot unico para CK4 (SEI 3.1/4) e CK5 (SEI 5). O adapter resolve a versao
// e nos aguardamos o editor ficar pronto antes de montar a toolbar customizada.
if (typeof SeiProEditorAdapter !== 'undefined') {
    SeiProEditorAdapter.waitReady(15000)
        .then(function () { addButton(); })
        .catch(function (e) { console.warn('[SEIPro] editor n\u00E3o detectado:', e); });
} else if (typeof CKEDITOR !== 'undefined') {
    addButton();
}