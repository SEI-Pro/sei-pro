// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function getQrCode(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('QrCodeSEI');
}
export function getDialogQrCode() {
	var htmlQrCodeLab = '<div id="qrCodeLab">'+
						'	<table style="width: 100%;">'+
						'		<tr><td style="vertical-align: top; text-align: right;" colspan="2"><a id="toggleOptionsQR" data-seipro-action="toggleOptionsQR" class="linkDialog">Op\u00E7\u00F5es avan\u00E7adas </a></td></tr>'+
						'		<tr><td style="vertical-align: top;">'+
						'		<div id="optionsQrAdvanced" style="display:none">'+
						'			<table>'+
						'			<tr><td>'+
						'				<label for="QrPro-size">Tamanho do QR: 140px</label><input id="QrPro-size" type="range" value="140" min="100" max="500" step="50">'+
						'			</td><td>'+
						'				<label for="QrPro-fill">Cor de Preenchimento</label><input id="QrPro-fill" type="color" value="#333333">'+
						'			</td><td>'+
						'				<label for="QrPro-background">Cor de Fundo</label><input id="QrPro-background" type="color" value="#ffffff">'+
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
                        '				<img id="QrPro-img-buffer" style="display:none" src="'+(typeof iconSeiPro !== 'undefined' && iconSeiPro ? iconSeiPro : ((typeof URL_SPRO !== 'undefined' ? URL_SPRO : '')+'icons/menu/seipro.png'))+'">'+
						'			</td><tr><td>'+
						'				<a data-seipro-action="resetOptionsQR" class="linkDialog" style="margin-top: 20px; display: block;">Resetar configura\u00E7\u00F5es</a>'+
						'			</td></tr>'+
						'			</table>'+
						'		</div>'+
						'	</td><td>'+
						'		<div id="qrCodeResult" style="text-align: center; margin: 20px 0; min-width: 180px;"></div>'+
						'	</td></tr>'+
						'	</table>'+
						'</div>';

      CKEDITOR.dialog.add( 'QrCodeSEI', function(editor)
      {
         return {
            title : 'Gerar C\u00F3digo QR',
            minWidth : 500,
            minHeight : 100,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
				var regex = /^[0-9A-Za-z\-]+$/;
                var qrCode_input = this.getContentElement( 'tab1', 'qrCodeText' ).getValue();
                if ( qrCode_input != '' ) {
                    api.setQrCode(qrCode_input);
                    event.data.hide = true;
                }
            },
            onShow : function() {
				var selectTxt = state.oEditor.getSelection().getSelectedText();
				var qrCode_input = this.getContentElement( 'tab1', 'qrCodeText' )._.inputId;
				setTimeout(function(){
					q('#qrCodeResult').html('');
					if ( selectTxt != '' ) {
						q('.cke_dialog #'+qrCode_input).val(selectTxt);
						api.updateQrCode();
					}
					q('.cke_dialog #'+qrCode_input).unbind('change').on('input change',function() {
						api.updateQrCode();
					});
					q('#optionsQrAdvanced input, #optionsQrAdvanced textarea, #optionsQrAdvanced select').on('input change', function() {
						api.updateQrCode();
					});
					q('#QrPro-image').on('change', function() {
						var input = q('#QrPro-image')[0];
						if (input.files && input.files[0]) {
							var global = global || window;
							const reader = new global.FileReader();
							reader.onload = event => {
								q('#QrPro-img-buffer').attr('src', event.target.result);
								q('#QrPro-mode').val('4');
								setTimeout(api.updateQrCode(), 1000);
							};
							reader.readAsDataURL(input.files[0]);
						}
					});
				}, 100);
                if (verifyConfigValue('substituiselecao')) api.setChosenInCke();
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Gerar C\u00F3digo QR',
                  elements :
                  [
                    {
             			type: 'text',
             			id: 'qrCodeText',
             			label: 'Insira o texto que deseja codificar',
						required : true,
             			'default': ''
             		},{
						type: 'html',
						html: htmlQrCodeLab
					}
                  ]
               }
            ]
         };
      } );
}
export function resetOptionsQR() {
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

    q.each(QrValues, (idx, pair) => {
        q('#'+ pair[0]).val(pair[1]);
    });
	q("#QrPro-img-buffer").attr('src', (typeof iconSeiPro !== 'undefined' && iconSeiPro) ? iconSeiPro : ((typeof URL_SPRO !== 'undefined' ? URL_SPRO : '')+'icons/menu/seipro.png'));
	api.updateQrCode();
}
export function toggleOptionsQR() {
	var options = q('#optionsQrAdvanced');
	var wasHidden = options.css('display') === 'none';
	if (wasHidden) options.show();
	else options.hide();
	var position = CKEDITOR.dialog.getCurrent().getPosition();
	var positionX = wasHidden ? position.x-150 : position.x+150;
		CKEDITOR.dialog.getCurrent().move(positionX, position.y);
}
export function updateQrCode() {
	q('#qrCodeResult').empty();
	q('.QrMode-etiqueta').hide();
	q('.QrMode-imagem').hide();

	var QrValues = [
		['QrPro-size', 'px'],
		['QrPro-minversion', ''],
		['QrPro-quiet', ' m\u00F3dulos'],
		['QrPro-radius', '%'],
		['QrPro-msize', '%'],
		['QrPro-mposx', '%'],
		['QrPro-mposy', '%']
	];

    q.each(QrValues, (idx, pair) => {
        const $label = q('label[for="' + pair[0] + '"]');
        $label.text($label.text().replace(/:.*/, ': ' + q('#' + pair[0]).val() + pair[1]));
    });

	var qrCodeTxt = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'qrCodeText').getValue();
    var options = {
        render: 'image',
        ecLevel: q('#QrPro-eclevel').val(),
        minVersion: parseInt(q('#QrPro-minversion').val(), 10),
        fill: q('#QrPro-fill').val(),
        background: (q('#QrPro-background-transparent').is(':checked')) ? null : q('#QrPro-background').val(),
        text: qrCodeTxt,
        size: parseInt(q('#QrPro-size').val(), 10),
        radius: parseInt(q('#QrPro-radius').val(), 10) * 0.01,
        quiet: parseInt(q('#QrPro-quiet').val(), 10),
        mode: parseInt(q('#QrPro-mode').val(), 10),
        mSize: parseInt(q('#QrPro-msize').val(), 10) * 0.01,
        mPosX: parseInt(q('#QrPro-mposx').val(), 10) * 0.01,
        mPosY: parseInt(q('#QrPro-mposy').val(), 10) * 0.01,
        label: q('#QrPro-label').val(),
        fontname: q('#QrPro-font').val(),
        fontcolor: q('#QrPro-fontcolor').val(),
        image: q('#QrPro-img-buffer')[0]
    };

	if ( q('#QrPro-mode').val() == 1 || q('#QrPro-mode').val() == 2 ) {
		q('.QrMode-etiqueta').show();
	} else if ( q('#QrPro-mode').val() == 3 || q('#QrPro-mode').val() == 4 ) {
		q('.QrMode-imagem').show();
	}

	if ( qrCodeTxt != '' ) {
		q('#qrCodeResult').qrcode(options);
	}
}
export function setQrCode(qrCode_text) {
	var result = q('#qrCodeResult')[0];
	var imgBase = q('#qrCodeResult img').attr('src');
	if (!imgBase && result && result.__seiproQrPromise) {
		result.__seiproQrPromise.then(function () { setQrCode(qrCode_text); });
		return;
	}
	if (!imgBase) return;
	var htmlQrCode = '<img src="'+imgBase+'">';
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
	    state.oEditor.insertHtml(htmlQrCode);
        state.oEditor.fire('saveSnapshot');
}
api.getQrCode = getQrCode;
api.getDialogQrCode = getDialogQrCode;
api.resetOptionsQR = resetOptionsQR;
api.toggleOptionsQR = toggleOptionsQR;
api.updateQrCode = updateQrCode;
api.setQrCode = setQrCode;
