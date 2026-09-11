/**
 * SEI Pro - Editor / Feature: Gerar Codigo QR
 *
 * Abre um dialogo (jQuery UI via SeiProEditorAdapter.openDialog) com um campo de
 * texto, um painel de opcoes avancadas (#qrCodeLab) e um preview ao vivo do QR
 * Code (plugin jQuery $.fn.qrcode). Ao confirmar, insere a imagem gerada no
 * editor.
 *
 * PORTADO de CK4 para CK5:
 *  - O dialogo passou a usar SeiProEditorAdapter.openDialog (jQuery UI) em vez do
 *    padrao CKEDITOR.dialog / dialogBoxPro compartilhado.
 *  - toggleOptionsQR nao usa mais CKEDITOR.dialog.getCurrent().getPosition()/move()
 *    (o jQuery UI auto-redimensiona ao alternar o painel).
 *  - updateQrCode/convertTinyURL/setInputTinyUrl liam/escreviam o campo via
 *    CKEDITOR.dialog.getCurrent().getContentElement('tab1','qrCodeText'); agora
 *    operam direto sobre o input DOM #qrCodeText.
 *
 * Globais do monolito / sei-functions-pro.js usados no clique (ja carregados
 * quando o handler roda): sanitizeHTML, alertaBoxPro, isValidHttpUrl, iconSeiPro,
 * NAMESPACE_SPRO, ajaxTinyUrl (feature TinyURL) e o plugin jQuery $.fn.qrcode.
 *
 * Observacao: setInputTinyUrl tambem e chamado por ajaxTinyUrl (feature TinyURL,
 * ainda no monolito) no modo 'setinput'; como este modulo carrega ANTES do
 * monolito e define a global de mesmo nome, essa chamada continua resolvendo.
 *
 * Ver js/modules/editor/README.md.
 */
(function () {
    'use strict';

    // Entry point: chamado pelo bind de clique do monolito (.getQrCodeButtom).
    window.getQrCode = function (this_) {
        var editor = SeiProEditorAdapter.getInstance(this_);
        if (!editor) return;
        openDialogQrCode(editor);
    };

    // Mantido por compatibilidade com initFunctions() do monolito (tryRun por
    // nome). Dialogo construido on-demand em openDialogQrCode().
    window.getDialogQrCode = function () { /* no-op */ };

    /**
     * Abre o dialogo de geracao de QR Code (jQuery UI via adapter). Reaproveita
     * o painel de opcoes avancadas (#qrCodeLab) e as auxiliares
     * updateQrCode()/toggleOptionsQR()/resetOptionsQR().
     */
    window.openDialogQrCode = function (editor) {
        var htmlQrCodeLab = buildHtmlQrCodeLab();
        var htmlBox = sanitizeHTML(''
            + '<div class="dialogBoxDiv" style="font-size: 11pt;line-height: 14pt;color: #616161;">'
            + '    <label for="qrCodeText">Insira o texto que deseja codificar:</label>'
            + '    <input type="text" id="qrCodeText" style="width:100%;margin:6px 0 10px 0;">'
            + htmlQrCodeLab
            + '</div>'
        );

        SeiProEditorAdapter.openDialog({
            id: 'dialogBoxProQrCode',
            title: 'Gerar C\u00F3digo QR',
            width: 720,
            html: htmlBox,
            onOpen: function ($box) {
                $('#qrCodeResult').html('');
                // Texto selecionado: usa a selecao nativa do DOM (CK4 e CK5).
                var nativeSel = window.getSelection && window.getSelection();
                var selectTxt = nativeSel ? String(nativeSel).trim() : '';
                if (selectTxt) { $('#qrCodeText').val(selectTxt); updateQrCode(); }
                $('#qrCodeText').on('input change', function () { updateQrCode(); });
                $('#optionsQrAdvanced').on('input change', 'input, textarea, select', function () { updateQrCode(); });
                $('#QrPro-image').on('change', function () {
                    var input = this;
                    if (input.files && input.files[0]) {
                        var reader = new FileReader();
                        reader.onload = function (ev) {
                            $('#QrPro-img-buffer').attr('src', ev.target.result);
                            $('#QrPro-mode').val('4');
                            setTimeout(updateQrCode, 200);
                        };
                        reader.readAsDataURL(input.files[0]);
                    }
                });
            },
            buttons: [{
                text: 'Inserir',
                primary: true,
                click: function ($box) {
                    var qrCode_input = ($('#qrCodeText').val() || '').trim();
                    if (!qrCode_input) {
                        alertaBoxPro('Error', 'exclamation-triangle', 'Digite o texto a codificar');
                        return;
                    }
                    setQrCode(qrCode_input, editor);
                    try { $box.dialog('close'); } catch (e) {}
                }
            }]
        });
    };

    window.buildHtmlQrCodeLab = function () {
        return '<div id="qrCodeLab">'+
            '	<table style="width: 100%;">'+
            '		<tr><td style="vertical-align: top; text-align: right;" colspan="2"><a id="toggleOptionsQR" data-spro-click="toggleOptionsQR" class="linkDialog">Op\u00E7\u00F5es avan\u00E7adas </a></td></tr>'+
            '		<tr><td style="vertical-align: top;">'+
            '		<div id="optionsQrAdvanced" style="display:none">'+
            '			<table>'+
            '			<tr><td>'+
            '				<label for="QrPro-size">Tamanho do QR: 140px</label><input id="QrPro-size" type="range" value="140" min="100" max="500" step="50">'+
            '			</td><td>'+
            '				<label for="QrPro-fill">Cor de Preenchimento</label><input id="QrPro-fill" type="color" value="#333333">'+
            '			</td><td>'+
            '				<label for="background">Cor de Fundo</label><input id="QrPro-background" type="color" value="#ffffff">'+
            '				<span style="display: inline-flex;margin-left: 20px;"><input id="QrPro-background-transparent" type="checkbox" style="margin: 0 5px;"> Transparente</span>'+
            '			</td></tr><tr><td>'+
            '				<label for="QrPro-minversion">Vers\u00E3o: 7</label><input id="QrPro-minversion" type="range" value="6" min="1" max="10" step="1">'+
            '			</td><td>'+
            '				<label for="QrPro-eclevel">N\u00EDvel de corre\u00E7\u00E3o de erros</label><select id="QrPro-eclevel"><option value="L" selected="selected">Baixo (7%)</option><option value="M">M\u00E9dio (15%)</option><option value="Q">1/4 (25%)</option><option value="H">Alto (30%)</option></select>'+
            '			</td><td>'+
            '				<label for="QrPro-quiet">Margens de folga: 1 m\u00F3dulos</label><input id="QrPro-quiet" type="range" value="1" min="0" max="4" step="1">'+
            '			</td></tr><tr><td>'+
            '				<label for="QrPro-radius">Raio de canto: 0%</label><input id="QrPro-radius" type="range" value="50" min="0" max="50" step="10">'+
            '			</td><td>'+
            '				<label for="QrPro-mode">Modo</label>'+
            '					<select id="QrPro-mode">'+
            '						<option value="0" selected="selected">Normal</option>'+
            '						<option value="1">Etiqueta em faixa</option>'+
            '						<option value="2">Etiqueta em caixa</option>'+
            '						<option value="3">Imagem em faixa</option>'+
            '						<option value="4">Imagem em caixa</option>'+
            '					</select>'+
            '			</td></tr><tr class="QrMode-etiqueta QrMode-imagem"><td>'+
            '				<label for="QrPro-msize">Tamanho da etiqueta: 20%</label><input id="QrPro-msize" type="range" value="20" min="0" max="40" step="1">'+
            '			</td><td>'+
            '				<label for="QrPro-mposx">Posi\u00E7\u00E3o X: 46%</label><input id="QrPro-mposx" type="range" value="50" min="0" max="100" step="1">'+
            '			</td><td>'+
            '				<label for="QrPro-mposy">Posi\u00E7\u00E3o Y: 51%</label><input id="QrPro-mposy" type="range" value="50" min="0" max="100" step="1">'+
            '			</td></tr><tr class="QrMode-etiqueta"><td>'+
            '				<label for="QrPro-font">Nome da fonte</label><select id="QrPro-font"><option value="Arial" selected="selected">Arial</option><option value="Helvetica">Helvetica</option><option value="Times">Times</option><option value="Times New Roman">Times New Roman</option><option value="Courier">Courier</option><option value="Courier New">Courier New</option><option value="Verdana">Verdana</option><option value="Tahoma">Tahoma</option><option value="Impact">Impact</option></select>'+
            '			</td><td>'+
            '				<label for="QrPro-fontcolor">Cor da fonte</label><input id="QrPro-fontcolor" type="color" value="#ff9818">'+
            '			</td><td>'+
            '				<label for="QrPro-label" class="QrMode-e">Etiqueta</label><input id="QrPro-label" type="text" value="'+NAMESPACE_SPRO+'">'+
            '			</td></tr>'+
            '			<tr class="QrMode-imagem"><td colspan="2">'+
            '				<label for="QrPro-image">Imagem</label><input id="QrPro-image" type="file">'+
            '				<img id="QrPro-img-buffer" style="display:none" src="'+iconSeiPro+'">'+
            '			</td><tr><td>'+
            '				<a data-spro-click="resetOptionsQR" class="linkDialog" style="margin-top: 20px; display: block;">Resetar configura\u00E7\u00F5es</a>'+
            '			</td></tr>'+
            '			</table>'+
            '		</div>'+
            '	</td><td>'+
            '		<div id="qrCodeResult" style="text-align: center; margin: 20px 0; min-width: 180px;"></div>'+
            '	</td></tr>'+
            '	</table>'+
            '</div>';
    };

    window.resetOptionsQR = function () {
        var QrValues = [
            ['QrPro-size', '140'],
            ['QrPro-fill', '#333333'],
            ['QrPro-background', '#ffffff'],
            ['QrPro-minversion', '6'],
            ['QrPro-eclevel', 'L'],
            ['QrPro-quiet', '1'],
            ['QrPro-radius', '50'],
            ['QrPro-mode', '0'],
            ['QrPro-label', NAMESPACE_SPRO],
            ['QrPro-msize', '20'],
            ['QrPro-mposx', '50'],
            ['QrPro-mposy', '50'],
            ['QrPro-fonte', 'Arial'],
            ['QrPro-fontcolor', '#ff9818'],
            ['QrPro-image', '']
        ];

        $.each(QrValues, function (idx, pair) {
            $('#' + pair[0]).val(pair[1]);
        });
        $('#QrPro-img-buffer').attr('src', iconSeiPro);
        updateQrCode();
    };

    // PORTADO: o painel vive num dialogo jQuery UI, que se auto-redimensiona ao
    // alternar a visibilidade. Removido o CKEDITOR.dialog.getCurrent().move().
    window.toggleOptionsQR = function () {
        $('#optionsQrAdvanced').toggle();
    };

    window.tipQrCodeUrl = function (qrCodeTxt) {
        var iconTiny = $('.getTinyUrlButtom span').attr('style');
        $('#tipQrCodeUrl').remove();
        if (qrCodeTxt != '' && isValidHttpUrl(qrCodeTxt) && qrCodeTxt.length > 50) {
            var htmlTip = '<span id="tipQrCodeUrl" style="float:left; padding: 5px 5px 8px 5px; background: #f9f9dc; border-radius: 5px;">Dica: Experimente <a data-spro-click="convertTinyURL" class="linkDialog"><span style="width: 16px; height: 16px; display: inline-block;'+iconTiny+'"></span>'+
                'Gerar link curto do TinyURL</a></span>';
            $('#toggleOptionsQR').before(htmlTip);
        }
    };

    // PORTADO: escreve direto no input DOM #qrCodeText (era CKEDITOR.dialog).
    window.setInputTinyUrl = function (dataUrl) {
        $('#qrCodeText').val(dataUrl);
        updateQrCode();
    };

    // PORTADO: le direto do input DOM #qrCodeText (era CKEDITOR.dialog).
    window.convertTinyURL = function () {
        var qrCodeTxt = $('#qrCodeText').val() || '';
        ajaxTinyUrl(qrCodeTxt, '', 'setinput');
    };

    window.updateQrCode = function () {
        $('#qrCodeResult').empty();
        $('.QrMode-etiqueta').hide();
        $('.QrMode-imagem').hide();

        var QrValues = [
            ['QrPro-size', 'px'],
            ['QrPro-minversion', ''],
            ['QrPro-quiet', ' m\u00F3dulos'],
            ['QrPro-radius', '%'],
            ['QrPro-msize', '%'],
            ['QrPro-mposx', '%'],
            ['QrPro-mposy', '%']
        ];

        $.each(QrValues, function (idx, pair) {
            var $label = $('label[for="' + pair[0] + '"]');
            $label.text($label.text().replace(/:.*/, ': ' + $('#' + pair[0]).val() + pair[1]));
        });

        // PORTADO: le sempre do input DOM #qrCodeText (era fallback CKEDITOR.dialog).
        var qrCodeTxt = $('#qrCodeText').val() || '';
        var options = {
            render: 'image',
            ecLevel: $('#QrPro-eclevel').val(),
            minVersion: parseInt($('#QrPro-minversion').val(), 10),
            fill: $('#QrPro-fill').val(),
            background: ($('#QrPro-background-transparent').is(':checked')) ? null : $('#QrPro-background').val(),
            text: qrCodeTxt,
            size: parseInt($('#QrPro-size').val(), 10),
            radius: parseInt($('#QrPro-radius').val(), 10) * 0.01,
            quiet: parseInt($('#QrPro-quiet').val(), 10),
            mode: parseInt($('#QrPro-mode').val(), 10),
            mSize: parseInt($('#QrPro-msize').val(), 10) * 0.01,
            mPosX: parseInt($('#QrPro-mposx').val(), 10) * 0.01,
            mPosY: parseInt($('#QrPro-mposy').val(), 10) * 0.01,
            label: $('#QrPro-label').val(),
            fontname: $('#QrPro-font').val(),
            fontcolor: $('#QrPro-fontcolor').val(),
            image: $('#QrPro-img-buffer')[0]
        };

        if ($('#QrPro-mode').val() == 1 || $('#QrPro-mode').val() == 2) {
            $('.QrMode-etiqueta').show();
        } else if ($('#QrPro-mode').val() == 3 || $('#QrPro-mode').val() == 4) {
            $('.QrMode-imagem').show();
        }

        if (qrCodeTxt != '') {
            $('#qrCodeResult').qrcode(options);
        }
        tipQrCodeUrl(qrCodeTxt);
    };

    window.setQrCode = function (qrCode_text, editor) {
        editor = editor || SeiProEditorAdapter.getInstance();
        if (!editor) return;
        var imgBase = $('#qrCodeResult img').attr('src');
        if (!imgBase) return;
        var htmlQrCode = '<img src="' + imgBase + '">';
        SeiProEditorAdapter.withEdit(editor, function () {
            SeiProEditorAdapter.insertHtml(editor, htmlQrCode);
        });
    };

    if (window.SeiProEditorAdapter && SeiProEditorAdapter.registerFeature) {
        SeiProEditorAdapter.registerFeature({ id: 'qr-code' });
    }
})();
