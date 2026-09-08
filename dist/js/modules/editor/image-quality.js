/**
 * SEI Pro - Editor feature: image-quality
 *
 * "Reduzir qualidade das imagens" em lote: abre um dialogo com um slider
 * de 1-100% e reaplica a compressao (qualityImages) sobre todas as <img>
 * do corpo do documento.
 *
 * Owned globals (mesmos nomes que o monolito usa em setClickButtons/initFunctions):
 *   - openDialogBatchImgQuality(this_)  -> .getBatchImgQualityButtom click
 *   - getDialogBatchImgQuality()        -> no-op de compat, chamado em initFunctions
 *
 * Helpers compartilhados (definidos no monolito, NAO movidos):
 *   - qualityImages(src, dst, quality)  -> compressao real via canvas
 *   - qualidadeImagens                  -> valor default global (config)
 *   - alertaBoxPro                      -> caixa de alerta padrao do SEI Pro
 *
 * Tudo roteado pelo SeiProEditorAdapter (getInstance/withEdit/findInBody/openDialog),
 * sem tocar em CKEDITOR.* ou iframe/.contents() diretamente -> funciona CK4 e CK5.
 */
(function () {
    'use strict';

    // Le o valor default de qualidade configurado. Lido no clique (nao na
    // avaliacao do modulo), quando o monolito ja definiu a global.
    function defaultQuality() {
        var q = (typeof window.qualidadeImagens !== 'undefined') ? window.qualidadeImagens : 60;
        q = parseInt(q, 10);
        if (isNaN(q)) q = 60;
        if (q > 100) q = 100;
        if (q < 1) q = 1;
        return q;
    }

    // Monta o HTML do corpo do dialogo. sanitizeHTML existe no monolito;
    // usamos quando disponivel, senao a string crua (markup interno, sem
    // entrada do usuario).
    function buildDialogHtml(q) {
        var html = ''
            + '<div class="dialogBoxDiv seipro-dialog-compact" style="font-size:13px;line-height:1.4;color:#333;font-family:Arial,sans-serif;">'
            +   '<style>'
            +     '.seipro-dialog-compact, .seipro-dialog-compact * { box-sizing:border-box; font-size:13px; }'
            +     '.seipro-dialog-compact label { display:block; font-size:12px; color:#555; margin-bottom:4px; }'
            +     '.seipro-dialog-compact input[type=range] { width:100%; }'
            +   '</style>'
            +   '<label for="batchImgQualityRange">Qualidade da Imagem (<span id="batchImgQualityValue">' + q + '</span>%):</label>'
            +   '<input type="range" id="batchImgQualityRange" min="1" max="100" value="' + q + '">'
            + '</div>';
        return (typeof window.sanitizeHTML === 'function') ? window.sanitizeHTML(html) : html;
    }

    // Aplica a reducao de qualidade em todas as imagens do corpo do documento.
    // qualityImg vem em percentual (1-100); qualityImages espera fracao (0-1).
    function applyBatchQuality(editor, qualityImg) {
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.findInBody(editor, 'img').each(function () {
                if (typeof window.qualityImages === 'function') {
                    window.qualityImages(this, this, qualityImg * 0.01);
                }
            });
        });
    }

    // Abre o dialogo do slider de qualidade e aplica em lote ao confirmar.
    window.openDialogBatchImgQuality = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;

        var q = defaultQuality();

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxPro',
            title: 'Reduzir qualidade das imagens',
            width: 420,
            height: 200,
            html: buildDialogHtml(q),
            onOpen: function ($box) {
                $box.find('#batchImgQualityRange').on('input change', function () {
                    $box.find('#batchImgQualityValue').text($(this).val());
                });
            },
            buttons: [{
                text: 'Aplicar',
                primary: true,
                click: function ($box) {
                    var qualityImg = $box.find('#batchImgQualityRange').val();
                    if (!qualityImg) {
                        if (typeof window.alertaBoxPro === 'function') {
                            window.alertaBoxPro('Error', 'exclamation-triangle', 'Digite um valor');
                        }
                        return;
                    }
                    applyBatchQuality(editor, qualityImg);
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    };

    // Mantido por compat; o dialogo agora vive em openDialogBatchImgQuality().
    window.getDialogBatchImgQuality = function () { /* no-op */ };

    SeiProEditorAdapter.registerFeature({ id: 'image-quality' });
})();
