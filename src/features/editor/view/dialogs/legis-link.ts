// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Editor module — migrated from body.js (CKEditor 4 / SEI 4.1).
 * Uses lib/domq.js (`q`) instead of the jQuery library.
 */
import { q } from '../../lib/domq.js';
import { state } from '../../state.js';
import { api } from '../../api.js';

export function sendLegisSEI(nomeLegis) {
	var url = "https://seipro.app/legis/";
	q.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: { norma: [nomeLegis] },
		success: function(legisData){
            if (  legisData[0].status == 0 ) {
                alertaBoxPro('Error', 'exclamation-triangle', 'Nenhuma legisla\u00E7\u00E3o encontrada');
            } else {
                var nomeLegis = ( legisData.length && legisData[0].NomeNorma ) ? '&nbsp;('+legisData[0].NomeNorma+')' : '';
                var htmlLegis = ( legisData.length ) ? '<a class="ancoraSei legisSeiPro" data-norma="'+legisData[0].SiglaNorma+'" data-normafull="'+legisData[0].DescNormaFull+'" data-index="0" href="'+legisData[0].Link+'" target="_blank">'+legisData[0].DescNormaFull+nomeLegis.trim()+'</a>' : '';
                state.oEditor.focus();
                state.oEditor.fire('saveSnapshot');
                state.oEditor.insertHtml(htmlLegis);
                api.uniqLinkLegisSEI(state.idEditor);
                state.oEditor.fire('saveSnapshot');
            }
		}
	});
}
export function insertLegisSEI(this_) {
    var htmlLegis = q('<div>').append(q(this_).closest('p').find('.legisSeiPro').clone().removeAttr('style').removeClass('linkDialog')).html();
        state.oEditor.focus();
        state.oEditor.fire('saveSnapshot');
        state.oEditor.insertHtml(htmlLegis);
        api.uniqLinkLegisSEI();
        state.oEditor.fire('saveSnapshot');
        CKEDITOR.dialog.getCurrent().hide();
}
export function uniqLinkLegisSEI() {
    var arrayRef = [];
        state.iframeEditor.find('.legisSeiPro').each(function(){
             var refNorma = q(this).attr('data-norma');
             if ( state.iframeEditor.find('a[data-norma="'+refNorma+'"]').length > 1 ) {
                var text = q(this).attr('data-normafull');
                var newText = text.split(',');
                var textDate = newText[1].trim().split(' ')[5];
                    newText = ( typeof textDate !== 'undefined' && arrayRef.includes(refNorma) ) ? newText[0].trim()+', de '+textDate : text;
                    q(this).text(newText);
             }
             arrayRef.push(refNorma);
        });
}
export function getLegisSEI(this_) {
    api.setParamEditor(this_);
    state.oEditor.openDialog('LegisSEI');
}
export function getSearchLegisMore(this_) {
    var parent = q(this_).closest('tr');
    if (!parent.find('.searchLegis_ementa').is(':hidden')) {
        parent.find('.searchLegis_ementa').hide();
        parent.find('.searchLegis_ementafull').show();
    } else {
        parent.find('.searchLegis_ementa').show();
        parent.find('.searchLegis_ementafull').hide();
    }
}
export function getSearchLegis(this_) {
    var dialog_page = q(this_).closest('.cke_dialog_page_contents');
    var dialog = CKEDITOR.dialog.getCurrent();
    var inputTipo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'tipoNorma')._.inputId;
        inputTipo = q('#'+inputTipo).find('option:selected').text();
    var inputTermo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'termoNorma').getValue();
    var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'numeroNorma').getValue();
    var inputAno = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'anoNorma').getValue();
	var url = "https://seipro.app/legis/search.php";
    var tipo = encodeURI(removeAcentos(inputTipo.toUpperCase().trim()));
    var termo = encodeURI(inputTermo.trim());
    var numero = ( inputNumero.indexOf('/') !== -1) ? inputNumero.split('/')[0] : inputNumero;
        numero = numero.replace(/[^0-9\-]+/g, '');
        numero = encodeURI(numero.trim());
    var ano = inputAno.replace(/[^0-9\-]+/g, '');
        ano = encodeURI(inputAno.trim());
    var periodo = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'periodoNorma').getValue();


    q('#searchLegis_load').show();
    if (q('#searchLegis_result').is(':visible')) {
        dialog.move(dialog.getPosition().x, (dialog.getPosition().y+125));
        q('#searchLegis_result').html('').hide();
    }
	q.ajax({
		type: "POST",
		url: url,
		dataType: "json",
		data: {
            tipo: tipo,
            numero: numero,
            ano: ano,
            periodo: periodo,
            termo: termo
        },
		success: function(legisData){
            if (  legisData.status == 0 ) {
                q('#searchLegis_load').hide();
                alertaBoxPro('Error', 'exclamation-triangle', 'Erro interno do servidor :( Tente novamente mais tarde');
            } else {
                var htmlResult =      '<table>'+
                                      ' <tbody>';

                    q.each(legisData.docs, function (i, val) {
                        var ementa = val.dsc_ementa.replace(/(\r\n|\n|\r)/gm, "");
                            ementa = (ementa.indexOf(' ') !== -1 && ementa.split(' ')[0] === ementa.split(' ')[0].toUpperCase()) ? ementa.charAt(0).toUpperCase() + ementa.toLocaleLowerCase().slice(1) : ementa;
                        var ementa_limited = ( ementa.length > 170 ) ? ementa.replace(/^(.{170}[^\s]*).*/, "$1")+'...' : ementa;
                        var datanorma = ( val.dsc_tipo_epigrafe == 'Decreto' ) ? 'Dec' : val.dsc_tipo_epigrafe;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Medida Provis\u00F3ria' ) ? 'Mp' : datanorma;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Lei Complementar' ) ? 'LC' : datanorma;
                            datanorma = ( val.dsc_tipo_epigrafe == 'Decreto-Lei' ) ? 'DecLei' : datanorma;
                            datanorma = ( datanorma.indexOf(' ') !== -1) ? datanorma.split(' ').join('') : datanorma;
                            datanorma = datanorma+val.num_ato;
                        var nomenorma = (val.dsc_identificacao.indexOf(' de ') !== -1) ? val.dsc_identificacao.replace(' de ', ', de ') : val.dsc_identificacao;

                        var ementa_limited_link = ( ementa.length > 170 ) ? '<a class="linkDialog" data-seipro-action="getSearchLegisMore">mais</a>' : '';
                        var style_normaRevogada = ( val.dsc_situacao_macro == "Revogado" ) ? 'text-decoration: line-through; color: #adadad;' : 'color: #444;';
                        var text_normaRevogada = ( val.dsc_situacao_macro == "Revogado" ) ? '<span style="background: #e0e0e0; padding: 1px 5px; color: #444; border-radius: 5px; margin-left: 10px;">Revogada</span>' : '';
                        var btnInsertLegis = '<span data-seipro-action="insertLegisSEI" style="float: right; background: #e7effd; padding: 3px 5px; color: #4285f4; border-radius: 5px; margin-left: 10px; cursor: pointer;"><i class="fas fa-pen azulColor" style="font-size: 90%; cursor: pointer;"></i> Adicionar</span>'
                        htmlResult += '     <tr style="border-bottom: 2px solid #efefef;">'+
                                      '         <td>'+
                                      '             <p style="padding: 10px 0 2px 0;">'+
                                      '                 <a class="linkDialog ancoraSei legisSeiPro" style="font-size: 13px;" data-norma="'+datanorma+'" data-normafull="'+nomenorma+'" data-index="0" href="'+val.url+'" target="_blank">'+nomenorma+' <i class="fas fa-external-link-alt linkDialog" style="font-size: 80%;"></i></a> '+text_normaRevogada+btnInsertLegis+
                                      '             </p>'+
                                      '             <p class="searchLegis_ementa" style="padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; '+style_normaRevogada+'">'+ementa_limited+' '+ementa_limited_link+'</p>'+
                                      '             <p class="searchLegis_ementafull" style="display:none; padding: 6px 0 10px 0; font-style: italic; word-break: break-word; white-space: break-spaces; width: 500px; '+style_normaRevogada+'">'+ementa+' <a class="linkDialog" data-seipro-action="getSearchLegisMore">menos</a></p>'+
                                      '         </td>'+
                                      '     </tr>';
                    });
                    if (legisData.numFound > 50) {
                        htmlResult += '     <tr>'+
                                      '         <td>'+
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Atingido o limite de 50 resultados. Restrinja sua pesquisa.</p>'+
                                      '         </td>'+
                                      '     </tr>';
                    } else if (legisData.numFound == 0) {
                        htmlResult += '     <tr>'+
                                      '         <td>'+
                                      '             <p style="margin: 10px;text-align: center;background: #fdfbe4;padding: 5px;border-radius: 5px;"><i class="fas fa-info-circle azulColor"></i> Nenhum resultado encontrado :(</p>'+
                                      '         </td>'+
                                      '     </tr>';
                    }
                    htmlResult +=     ' </tbody>'+
                                      '</table>';
                q('#searchLegis_load').hide();
                q('#searchLegis_result').html(htmlResult).show();
                    dialog.move(dialog.getPosition().x, (dialog.getPosition().y-125));
            }
		}
	});
}
export function getDialogLegisSEI() {
      CKEDITOR.dialog.add( 'LegisSEI', function(editor)
      {
         return {
            title : 'Adicionar Link de Legisla\u00E7\u00E3o',
            minWidth : 520,
            minHeight : 150,
            buttons: [ CKEDITOR.dialog.cancelButton, CKEDITOR.dialog.okButton ],
            onOk: function(event, a, b) {
                var tipoNorma = this.getContentElement( 'tab1', 'tipoNorma' ).getValue();
                var numeroNorma = this.getContentElement( 'tab1', 'numeroNorma' ).getValue();
                var orgaoInfraNorma = this.getContentElement( 'tab2', 'orgaoInfraNorma' ).getValue();
                var tipoInfraNorma = this.getContentElement( 'tab2', 'tipoInfraNorma' ).getValue();
                var numeroInfraNorma = this.getContentElement( 'tab2', 'numeroInfraNorma' ).getValue();
                var nomeNorma = this.getContentElement( 'tab3', 'nomeNorma' ).getValue();

                if ( tipoNorma != '' && numeroNorma != '' ) {
                    var nrNorma = ( numeroNorma.indexOf('/') !== -1) ? numeroNorma.split('/')[0] : numeroNorma;
                        nrNorma = nrNorma.replace(/[^0-9\-]+/g, '');
                    api.sendLegisSEI(tipoNorma+nrNorma);
                    event.data.hide = true;
                } else if ( tipoInfraNorma != '' && numeroInfraNorma != '' ) {
                    var nrNorma = ( numeroInfraNorma.indexOf('/') !== -1) ? numeroInfraNorma.split('/')[0] : numeroInfraNorma;
                        nrNorma = nrNorma.replace(/[^0-9\-]+/g, '');
                    api.sendLegisSEI(orgaoInfraNorma+tipoInfraNorma+nrNorma);
                    event.data.hide = true;
                } else if ( nomeNorma != '' ) {
                    api.sendLegisSEI(nomeNorma);
                    event.data.hide = true;
                } else {
                    event.data.hide = true;
                }
            },
            onShow : function() {
                q('.cke_dialog_page_contents').find('select').css('width','100%');
                q('#searchLegis_load').hide();
                if (q('#searchLegis_result').is(':visible')) {
                    this.move(this.getPosition().x, (this.getPosition().y+125));
                    q('#searchLegis_result').html('').hide();
                }
                var inputNumero = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'numeroNorma')._.inputId;
                var inputAno = CKEDITOR.dialog.getCurrent().getContentElement('tab1', 'anoNorma')._.inputId;
                    q('#'+inputNumero).attr('type', 'number');
                    q('#'+inputAno).attr('type', 'number');
                    if (verifyConfigValue('substituiselecao')) api.setChosenInCke();

                    var textSelected = state.oEditor.getSelection().getSelectedText();
                    var idSelectNorma = this.getContentElement( 'tab1', 'tipoNorma' )._.inputId;
                    var idNumNorma = this.getContentElement( 'tab1', 'numeroNorma' )._.inputId;
                    var selectNorma = q('#'+idSelectNorma);
                    var numNorma = q('#'+idNumNorma);
                    if (textSelected.toLowerCase().indexOf('lei complementar') !== -1 || textSelected.toLowerCase().indexOf('lc') !== -1) {
                        selectNorma.val('LC').trigger('change');
                    } else if (textSelected.toLowerCase().indexOf('decreto-lei') !== -1 || textSelected.toLowerCase().indexOf('dc') !== -1) {
                        selectNorma.val('DecLei').trigger('change');
                    } else if (textSelected.toLowerCase().indexOf('medida provis\u00F3ria') !== -1 || textSelected.toLowerCase().indexOf('mp') !== -1) {
                        selectNorma.val('Mp').trigger('change');
                    } else if (textSelected.toLowerCase().indexOf('decreto') !== -1 || textSelected.toLowerCase().indexOf('dec') !== -1) {
                        selectNorma.val('Dec').trigger('change');
                    } else if (textSelected.toLowerCase().indexOf('lei') !== -1) {
                        selectNorma.val('Lei').trigger('change');
                    }

                    if (hasNumber(textSelected)) {
                        var numInput = (textSelected.toLowerCase().indexOf('/') !== -1) ? textSelected.split('/')[0] : textSelected;
                            numInput = (textSelected.toLowerCase().indexOf(',') !== -1) ? textSelected.split(',')[0] : numInput;
                            numInput = (hasNumber(numInput)) ? onlyNumber(numInput) : '';
                        numNorma.val(numInput);
                    }
            },
            contents :
            [
               {
                  id : 'tab1',
                  label : 'Legisla\u00E7\u00E3o Federal',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'tipoNorma',
             			label: 'Tipo de Legisla\u00E7\u00E3o',
                        labelLayout: 'horizontal',
            			width: '200px',
             			items: [ [''], [ 'Lei', 'Lei' ], [ 'Lei Complementar', 'LC' ], [ 'Decreto', 'Dec' ], [ 'Decreto-Lei', 'DecLei' ], [ 'Medida Provis\u00F3ria', 'Mp' ] ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'N\u00FAmero da Legisla\u00E7\u00E3o',
                        id: 'numeroNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
             			type: 'select',
             			id: 'periodoNorma',
             			label: 'Per\u00EDodo da Publica\u00E7\u00E3o',
                        labelLayout: 'horizontal',
            			width: '200px',
             			items: [ [''], [ 'No ano', 'ano' ], [ 'At\u00E9 o ano de...', 'ate' ], [ 'Ap\u00F3s o ano de...', 'apos' ] ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'Ano da Publica\u00E7\u00E3o',
                        id: 'anoNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'text',
                        label: 'Conte\u00FAdo da Legisla\u00E7\u00E3o (palavras-chave)',
                        id: 'termoNorma',
            			width: '200px',
                        labelLayout: 'horizontal'
 					},{
                        type: 'html',
                        html: '<table role="presentation" class="cke_dialog_ui_hbox">'+
                              ' <tbody>'+
                              '     <tr class="cke_dialog_ui_hbox">'+
                              '         <td class="cke_dialog_ui_hbox_first" role="presentation" style="width:50%; padding:0px">'+
                              '         </td>'+
                              '         <td class="cke_dialog_ui_hbox_last" role="presentation" style="width:50%; padding:0px">'+
                              '             <a style="user-select: none;" data-seipro-action="getSearchLegis" title="Pesquisar" hidefocus="true" class="cke_dialog_ui_button cke_dialog_ui_button_cancel" role="button" aria-labelledby="searchLegis_label" id="searchLegis_uiElement">'+
                              '                 <span id="searchLegis_label" class="cke_dialog_ui_button">Pesquisar</span>'+
                              '             </a>'+
                              '             <i id="searchLegis_load" class="fas fa-sync-alt fa-spin" style="margin-left: 10px; display:none"></i>'+
                              '         </td>'+
                              '     </tr>'+
                              ' </tbody>'+
                              '</table>'+
                              '<div id="searchLegis_result" style="display:none; height: 250px; overflow-y: scroll; margin-top: 15px;"></div>'
 					}
                  ]
               },{
                  id : 'tab2',
                  label : 'Norma Infralegal',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'orgaoInfraNorma',
             			label: 'Autoridade Signat\u00E1ria',
                        labelLayout: 'horizontal',
                        width: '200px',
             			items: [
                            [''],
                            [ 'ANTAQ', 'Antaq' ],
                            [ 'Cade', 'Cade' ],
                            [ 'PRF', 'PRF' ] ,
                            [ 'TSE', 'Tse' ],
                            [ 'TRE RR', 'Trerr' ],
                            [ 'TJ RR', 'TJRR' ],
                            [ 'CNJ', 'CNJ' ]
                        ],
             			'default': ''
             		},{
             			type: 'select',
             			id: 'tipoInfraNorma',
             			label: 'Tipo de Legisla\u00E7\u00E3o',
                        labelLayout: 'horizontal',
                        width: '200px',
             			items: [
                            [''],
                            [ 'Acordo/Plano/Ato/Nota', 'acord' ],
                            [ 'Ata e Certid\u00F5es de Julgamento', 'atas' ],
                            [ 'Constitui\u00E7\u00E3o Estadual', 'ce' ],
                            [ 'Decreto Estadual', 'decest' ],
                            [ 'Edital', 'Edit' ],
                            [ 'Enunciado Administrativo', 'enumadm' ],
                            [ 'Emenda Constitucional', 'ec' ],
                            [ 'Emenda Regimental', 'er' ],
                            [ 'Emendas', 'Emenda' ],
                            [ 'Instru\u00E7\u00E3o Normativa', 'in' ],
                            [ 'Instru\u00E7\u00E3o Normativa Conjunta', 'resconj' ],
                            [ 'Lei Complementar Estadual', 'lce' ],
                            [ 'Lei Estadual', 'leiest' ],
                            [ 'Lei Municipal', 'leimun' ],
                            [ 'Nota T\u00E9cnica', 'nt' ],
                            [ 'Orienta\u00E7\u00E3o Normativa', 'on' ],
                            [ 'Portaria', 'port' ],
                            [ 'Portaria Conjunta', 'portconj' ],
                            [ 'Portaria Interministerial', 'portinter' ],
                            [ 'Portaria Interinstitucional', 'portinst' ],
                            [ 'Provimento', 'prov' ],
                            [ 'Recomenda\u00E7\u00E3o', 'Rec' ],
                            [ 'Regimento Interno', 'regim' ],
                            [ 'Resolu\u00E7\u00E3o Normativa', 'rn' ],
                            [ 'Resolu\u00E7\u00E3o', 'res' ],
                            [ 'Resolu\u00E7\u00E3o Conjunta', 'resconj' ],
                            [ 'S\u00FAmula Administrativa', 'sum' ]
                        ],
             			'default': ''
             		},{
                        type: 'text',
                        label: 'N\u00FAmero da Norma',
            			width: '200px',
                        labelLayout: 'horizontal',
                        id: 'numeroInfraNorma'
 					}
                  ]
               },{
                  id : 'tab3',
                  label : 'Lista de Normas',
                  elements :
                  [
                    {
             			type: 'select',
             			id: 'nomeNorma',
             			label: 'Nome da Legisla\u00E7\u00E3o',
             			items: [
                                [''],
                                ['C\u00F3digo Brasileiro de Aeron\u00E1utica','Cba'],
                                ['C\u00F3digo Brasileiro de Telecomunica\u00E7\u00F5es','Cbt'],
                                ['C\u00F3digo Civil','Cc'],
                                ['C\u00F3digo Comercial','Ccm'],
                                ['C\u00F3digo de Defesa do Consumidor','Cdc'],
                                ['Constitui\u00E7\u00E3o Federal','Cf'],
                                ['C\u00F3digo Florestal','Cflorestal'],
                                ['Consolida\u00E7\u00E3o das Leis do Trabalho','Clt'],
                                ['C\u00F3digo de \u00C1guas','Codigoaguas'],
                                ['C\u00F3digo Eleitoral','Codigoeleitoral'],
                                ['C\u00F3digo de Minas','Codigominas'],
                                ['C\u00F3digo Penal','Cp'],
                                ['C\u00F3digo de Processo Civil','Cpc'],
                                ['C\u00F3digo Penal Militar','Cpm'],
                                ['C\u00F3digo de Processo Penal','Cpp'],
                                ['C\u00F3digo de Processo Penal Militar','Cppm'],
                                ['C\u00F3digo de Tr\u00E2nsito Brasileiro','Ctb'],
                                ['C\u00F3digo Tribut\u00E1rio Nacional','Ctn'],
                                ['Estatuto da Crian\u00E7a e do Adolescente','Eca'],
                                ['Estatuto da Cidade','Estatutocidade'],
                                ['Estatuto do Desarmamento','Estatutodesarmamento'],
                                ['Estatuto do Idoso','Estatutoidoso'],
                                ['Estatuto da Igualdade Racial','Estatutoigualdaderacial'],
                                ['Estatuto do \u00CDndio','Estatutoindio'],
                                ['Estatuto da Juventude','Estatutojuventude'],
                                ['Estatuto Nacional da Microempresa e da Empresa de Pequeno Porte','Estatutomicroempresas'],
                                ['Estatuto dos Militares','Estatutomilitares'],
                                ['Estatuto dos Museus','Estatutomuseus'],
                                ['Estatuto da Advocacia e da Ordem dos Advogados do Brasil (OAB)','Estatutooab'],
                                ['Estatuto da Pessoa com Defici\u00EAncia','Estatutopcd'],
                                ['Estatuto dos Refugiados','Estatutorefugiados'],
                                ['Estatuto da Terra','Estatutoterra'],
                                ['Estatuto de Defesa do Torcedor','Estatutotorcedor']
                                 ],
             			'default': ''
             		}
                  ]
               }

            ]
         };
      } );
}
api.sendLegisSEI = sendLegisSEI;
api.insertLegisSEI = insertLegisSEI;
api.uniqLinkLegisSEI = uniqLinkLegisSEI;
api.getLegisSEI = getLegisSEI;
api.getSearchLegisMore = getSearchLegisMore;
api.getSearchLegis = getSearchLegis;
api.getDialogLegisSEI = getDialogLegisSEI;
