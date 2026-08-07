// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../lib/domq.js';
import { state } from '../state.js';
import { api } from '../api.js';

export function htmlButton(status) {

    var classStatus = ( status == 'disable' ) ? 'cke_button_disabled' : '';
    var icon16baseImport = URL_SPRO + 'icons/menu/import.png';
    var icon16baseTable = URL_SPRO + 'icons/menu/table.png';
    var icon16baseLegis = URL_SPRO + 'icons/menu/legis.png';
    var icon16baseCapLetter = URL_SPRO + 'icons/menu/capletter.png';
    var icon16baseCitaDocumento = URL_SPRO + 'icons/menu/citacao.png';
    var icon16baseNotaRodape = URL_SPRO + 'icons/menu/notarodape.png';
    var icon16baseSumario = URL_SPRO + 'icons/menu/sumario.png';
    var icon16baseDadosProcesso = URL_SPRO + 'icons/menu/dadosprocesso.png';
	var icon16baseQrCode = URL_SPRO + 'icons/menu/qrcode.png';
	var icon16basePageBreak = URL_SPRO + 'icons/menu/pagebreak.png';
	var icon16baseSessionBreak = URL_SPRO + 'icons/menu/sessionbreak.png';
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
        '<div class="seipro-editor-quick-table" style="display:none;"></div>' +
        api.htmlButtonPro(
            'getQuickTableButtom',
            'quicktable',
            'Tabela R\u00E1pida',
            icon16baseQuickTable
        ) +
        api.htmlButtonPro(
            'getTablestylesButtom',
            'tablestyles',
            'Adicionar estilo \u00E0 tabela',
            icon16baseTable
        );

    const htmlButtonAfterImage =
        api.htmlButtonPro(
            'getBatchImgQualityButtom',
            'batch_quality_pro',
            'Reduzir qualidade das imagens',
            icon16baseBatchImgQuality
        ) +
        api.htmlButtonPro(
            'getInsertCheckboxButtom',
            'insert_checkbox_pro',
            'Inserir caixa de sele\u00E7\u00E3o',
            icon16baseInsertCheckboxQuality
        );

    const htmlButtonBeforeCut =
        api.htmlButtonPro(
            'getCopyStyleButtom',
            'copy_style_pro',
            'Copiar formata\u00E7\u00E3o',
            icon16baseCopyStyle
        );

    const htmlButtonBeforeList =
        '<div class="seipro-editor-align-menu" style="display:none;">' +
            api.htmlButtonPro(
                'getAlignLeftButtom',
                'align_left_pro',
                'Alinhar texto \u00E0 esquerda',
                icon16baseAlignLeft
            ) +
            api.htmlButtonPro(
                'getAlignCenterButtom',
                'align_center_pro',
                'Alinhar texto ao centro',
                icon16baseAlignCenter
            ) +
            api.htmlButtonPro(
                'getAlignRightButtom',
                'align_right_pro',
                'Alinhar texto \u00E0 direita',
                icon16baseAlignRight
            ) +
            api.htmlButtonPro(
                'getAlignJustifyButtom',
                'align_justify_pro',
                'Alinhar texto justificadamente',
                icon16baseAlignJustify
            ) +
        '</div>' +
        api.htmlButtonPro(
            'getAlignButtom',
            'align_pro',
            'Alinhar texto roxoColor',
            icon16baseAlignCenter
        );

    const htmlButtonAfterLetters =
        api.htmlButtonPro(
            'getCapLetterButtom',
            'capletter_pro',
            'Primeira Letra Mai\u00FAscula (Exceto artigos e preposi\u00E7\u00F5es)',
            icon16baseCapLetter
        ) +
        api.htmlButtonPro(
            'getFontSizeUpButtom',
            'fontsize_up_pro',
            'Aumentar tamanho da fonte',
            icon16baseFonteSizeUp
        ) +
        api.htmlButtonPro(
            'getFontSizeDownButtom',
            'fontsize_down_pro',
            'Diminuir tamanho da fonte cianoColor',
            icon16baseFonteSizeDown
        );


    const htmlButton =
        (restrictConfigValue('ferramentasia') ?
            api.htmlButtonPro(
                'getPlataformAIButtom seipro-ai-toolbar-button',
                'openai',
                'Abrir Assistente IA',
                icon16baseOpenAI,
                '',
                '',
                'Assistente IA'
            ) : '') +
        api.htmlButtonPro(
            'importDocButtom',
            'externalfile',
            'Inserir texto de conte\u00FAdo externo (Word, HTML ou Google)',
            icon16baseImport
        ) +
        api.htmlButtonPro(
            'getLinkLegisButtom',
            'linklegis',
            'Adicionar link de legisla\u00E7\u00E3o',
            icon16baseLegis
        ) +
        (state.frmEditor.length ?
            api.htmlButtonPro(
                'getCitacaoDocumentoButtom',
                'citacaodoc',
                'Inserir refer\u00EAncia de documento do processo',
                icon16baseCitaDocumento
            ) : '') +
        api.htmlButtonPro(
            'getNotaRodapeButtom',
            'notarodape',
            'Inserir nota de rodap\u00E9',
            icon16baseNotaRodape
        ) +
        api.htmlButtonPro(
            'getRefInternaButtom',
            'refinterna',
            'Inserir refer\u00EAncia interna',
            icon16baseRefInterna
        ) +
        api.htmlButtonPro(
            'getSumarioButtom',
            'sumario',
            'Inserir sum\u00E1rio',
            icon16baseSumario
        ) +
        (state.frmEditor.length == 0 ? '' :
            api.htmlButtonPro(
                'getDadosProcessoButtom',
                'dadosprocesso',
                'Inserir dados do processo',
                icon16baseDadosProcesso
            )
        ) +
        api.htmlButtonPro(
            'getQrCodeButtom',
            'qrcode',
            'Gerar C\u00F3digo QR',
            icon16baseQrCode
        ) +
        api.htmlButtonPro(
            'getPageBreakButtom',
            'pagebreak',
            'Inserir Quebra de P\u00E1gina',
            icon16basePageBreak,
            '',
            state.isSeiSlim ? '' : '!important'
        ) +
        api.htmlButtonPro(
            'getSessionBreakButtom',
            'sessionbreak',
            'Inserir Quebra de Se\u00E7\u00E3o',
            icon16baseSessionBreak
        ) +
        api.htmlButtonPro(
            'getProcessoPublicoButton',
            'processopublico',
            'Adicionar Link de Documento P\u00FAblico',
            icon16baseDocPublico
        ) +
        api.htmlButtonPro(
            'getMinutaWatermarkButton',
            'watermark',
            'Adicionar Marca D\'\u00E1gua de MINUTA/MODELO',
            icon16baseWatermark
        ) +
        api.htmlButtonPro(
            'pageImageBackgroundButtom',
            'pageimagebackground',
            'Adicionar Image de Fundo e Configura\u00E7\u00F5es de P\u00E1gina para Impress\u00E3o',
            icon16baseImagePage
        );

    const htmlButtonReview = checkConfigValue('revisaotexto') ?
        api.htmlButtonPro(
            'getReviewButton',
            'review',
            'Ativar revis\u00E3o de texto',
            icon16baseReview
        ) +
        api.htmlButtonPro(
            'getCtrReviewButton',
            'ctr_review',
            'Gerenciar revis\u00F5es de texto',
            icon16baseCtrReview
        ) : '';

    const htmlButtonDitado = checkConfigValue('ditado') ?
        api.htmlButtonPro(
            'getDitadoButton',
            'ditado',
            'Ativar ditado de texto (reconhecimento de fala do Chrome)',
            URL_SPRO + 'icons/editor/webspeech.png'
        ) +
        api.htmlButtonPro(
            'getCtrDitadoButton',
            'ctr_ditado',
            'Gerenciar configura\u00E7\u00F5es do ditado',
            URL_SPRO + 'icons/editor/webspeech-settings.png'
        ) : '';

    const htmlButtonNewStyle = SeiPro.sei.adapter.isNewSEI() ?
        api.htmlButtonPro(
            'getNewStyleButton',
            'newstyle',
            'Ativar estilo avan\u00E7ado',
            icon16baseNewStyle,
            '',
            localStorage.getItem('seiSlim_editor') ? 'cke_button_on' : 'cke_button_off'
        ) : '';

    const htmlButtonSigilo =
        api.htmlButtonPro(
            'getMarkSigiloButton',
            'mark_sigilo_pro',
            'Adicionar / Remover marca de sigilo no texto',
            icon16baseMarkSigilo
        ) +
        api.htmlButtonPro(
            'getBoxSigiloButton',
            'boxsigilo',
            'Gerenciar marcas de sigilo do documento',
            icon16baseBoxSigilo
        );

    const htmlButtonLegis =
        api.htmlButtonPro(
            'getLegisButtom',
            'legis',
            'Formatar e numerar texto normativo',
            icon16baseSEILegis
        );
    const blockHtmlButton = `<span class="cke_iconPro cke_toolgroup ${classStatus}" role="presentation">${htmlButton}</span>`;

    const htmlNewBlock = `
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
        newBlock: htmlNewBlock,
        afterImage: htmlButtonAfterImage
    };
}
export const htmlButtonPro = (classClick, cke_class, title, icon, extraStyle = '', important = '', label = title) => `
    <a class="${classClick} cke_iconPro cke_button cke_buttonPro cke_button_off" href="#" title="${title}" aria-label="${title}" role="button" hidefocus="true">
        <span class="cke_button_icon cke_button__${cke_class}_icon" style="background: url('${icon}') ${extraStyle} ${important}">&nbsp;</span>
        <span class="cke_button_label" aria-hidden="false">${label}</span>
    </a>`;
api.htmlButton = htmlButton;
api.htmlButtonPro = htmlButtonPro;
