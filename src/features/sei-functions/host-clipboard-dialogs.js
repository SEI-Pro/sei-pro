/**
 * Sei Functions Pro — host limits, clipboard, dialog boxes.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import { getName, getNameGenre } from '../../shared/nomenclatura.js';

import {
    checkUnidadeFuncBeta
} from './atividades-bridge.js';

import {
    getConfigHost,
    resetDialogBoxPro
} from './modules.js';

// [migrado para core/sei] getConfigValue
// [migrado para core/sei] verifyConfigValue
export function limitConfigValue(name) {
    return !checkHostLimit() ? checkConfigValue(name) : false;
}
export function checkHostLimit() {
    if (verifyConfigValue('disablequery')) {
        return true;
    } else {
        if (NAMESPACE_SPRO == 'SEI Pro') {
            var host = sessionStorage.getItem('configHost_Pro') !== null ? JSON.parse(sessionStorage.getItem('configHost_Pro')) : false;
            if (host) {
                var set_host = false;
                if (typeof host !== 'undefined' && host !== null &&typeof host.matches !== 'undefined' && host.matches !== null && host.matches.length > 0) {
                    for (i = 0; i < host.matches.length; i++) {
                        if (window.location.host.indexOf(host.matches[i]) !== -1) set_host = true;
                    }
                }
                if (set_host) {
                    if (!checkConfigValue('disablequery') && !verifyConfigValue('disablequery')) return false;
                    else return true;
                } else {
                    return false;
                } 
            } else {
                getConfigHost();
            }
        } else {
            return false;
        }
    }
}
export function restrictConfigValue(name) {
    if (NAMESPACE_SPRO == 'ANTAQ Pro' || NAMESPACE_SPRO == 'ANTT Pro') {
        if (typeof checkUnidadeFuncBeta === 'function' && checkUnidadeFuncBeta()) {
            return checkConfigValue(name);
        } else {
            return false;
        }
    } else {
        return checkConfigValue(name);
    }
}
export function initNameConst(type = 'get') {
    if (getOptionsPro('nomeVariaveisPro') && type == 'get') {
        window.__ = getOptionsPro('nomeVariaveisPro');
    } else {
        setNameConst();
    }
}
export function setNameConst() {
    var __demanda = getName('demanda', 'demanda', true, false, false);
    var __Demanda = getName('demanda', 'Demanda', true, false, true);
    var __demandas = getName('demanda', 'demandas', false, false, false);
    var __as_demandas = getName('demanda', 'as demandas', false, true, false);
    var __atividade = getName('atividade', 'atividade', true, false, true);
    var __Atividade = getName('atividade', 'Atividade', true, false, true);
    var __programa = getName('programa', 'programa de gest\u00E3o', true, false, true);
    var __Programa = getName('programa', 'Programa de Gest\u00E3o', true, false, true);
    var __ = {
        programa: __programa,
        Programa: __Programa,
        programas: getName('programa', 'programas de gest\u00E3o', false, false, false),
        Programas: getName('programa', 'programas de gest\u00E3o', false, false, true),
        o_programa: getName('programa', 'o programa de gest\u00E3o', true, true, false),
        demanda: __demanda,
        a_demanda: getName('demanda', 'a demanda', true, true, false),
        a_demanda_selecionada: getName('demanda', 'a demanda', true, true, false)+' '+getNameGenre('demanda', 'selecionado', 'selecionada'),
        A_demanda: getNameGenre('demanda', 'O', 'A')+' '+__demanda,
        As_demandas: getNameGenre('demanda', 'O', 'A')+'s '+__demandas,
        da_demanda: getNameGenre('demanda', 'do', 'da')+' '+__demanda,
        esta_demanda: getNameGenre('demanda', 'este', 'esta')+' '+__demanda,
        a_outra_demanda_vinculada: getNameGenre('demanda', 'o outro', 'a outra')+' '+__demanda+' '+getNameGenre('demanda', 'vinculado', 'vinculada'),
        nova_demanda: getNameGenre('demanda', 'novo', 'nova')+' '+__demanda,
        iniciada_a_demanda: getNameGenre('demanda', 'iniciado', 'iniciada')+' '+getName('demanda', 'a demanda', true, true, false),
        demanda_programada: __demanda+' '+getNameGenre('demanda', 'programado', 'programada'),
        demandas: getName('demanda', 'demandas', false, false, false),
        das_demandas: getNameGenre('demanda', 'dos', 'das')+' '+__demandas,
        minhas_demandas: getNameGenre('demanda', 'meus', 'minhas')+' '+__demandas,
        demandas_programadas: __demandas+' '+getNameGenre('demanda', 'programados', 'programadas'),
        Demanda: __Demanda,
        da_Demanda: getNameGenre('demanda', 'do', 'da')+' '+__Demanda,
        a_Demanda: getNameGenre('demanda', 'o', 'a')+' '+__Demanda,
        Nova_Demanda: getNameGenre('demanda', 'Novo', 'Nova')+' '+__Demanda,
        as_demandas: __as_demandas,
        as_demandas_selecionadas: __as_demandas+' '+getNameGenre('demanda', 'selecionados', 'selecionadas'),
        Demandas: getName('demanda', 'Demanda', false, false, true),
        arquivar: getName('arquivar', 'arquivar', true, false, false),
        Arquivar: getName('arquivar', 'Arquivar', true, false, true),
        arquivamento: getName('arquivamento', 'arquivamento', true, false, false),
        Arquivamento: getName('arquivamento', 'Arquivamento', true, false, true),
        arquivado: getName('arquivado', 'arquivado', true, false, false),
        Arquivado: getName('arquivado', 'Arquivado', true, false, true),
        arquivados: getName('arquivado', 'arquivados', false, false, false),
        arquivada: getName('arquivada', 'arquivada', true, false, false),
        Arquivada: getName('arquivada', 'Arquivada', true, false, true),
        Arquivadas: getName('arquivada', 'Arquivadas', false, false, true),
        arquivadas: getName('arquivada', 'arquivadas', false, false, false),
        paralisar: getName('paralisar', 'paralisar', true, false, false),
        Paralisar: getName('paralisar', 'Paralisar', true, false, true),
        paralisada: getName('paralisada', 'paralisada', true, false, false),
        Paralisado: getName('paralisado', 'Paralisado', true, false, true),
        Paralisada: getName('paralisada', 'Paralisada', true, false, true),
        paralisacao: getName('paralisacao', 'paralisa\u00E7\u00E3o', true, false, false),
        Paralisacao: getName('paralisacao', 'Paralisa\u00E7\u00E3o', true, false, true),
        prescricao: getName('prescricao', 'prescri\u00E7\u00E3o', true, false, false),
        Prescricao: getName('prescricao', 'Prescri\u00E7\u00E3o', true, false, true),
        Prescricoes: getName('prescricao', 'Prescri\u00E7\u00F5es', false, false, true),
        retomada: getName('retomada', 'retomada', true, false, false),
        Retomada: getName('retomada', 'Retomada', true, false, true),
        retomar: getName('retomar', 'retomar', true, false, false),
        Retomar: getName('retomar', 'Retomar', true, false, true),
        Prorrogar: getName('prorrogar', 'Prorrogar', true, false, true),
        complexidade: getName('complexidade', 'complexidade', true, false, false),
        Complexidade: getName('complexidade', 'Complexidade', true, false, true),
        assunto: getName('assunto', 'assunto', true, false, false),
        Assunto: getName('assunto', 'Assunto', true, false, true),
        observacao: getName('observacao', 'observa\u00E7\u00E3o', true, false, false),
        Observacao: getName('observacao', 'Observa\u00E7\u00E3o', true, false, true),
        Observacoes: getName('observacao', 'Observa\u00E7\u00F5es', false, false, true),
        gerencial: getName('gerencial', 'gerencial', true, false, true),
        Gerencial: getName('gerencial', 'Gerencial', true, false, true),
        tecnica: getName('tecnica', 't\u00E9cnica', true, false, true),
        Tecnica: getName('tecnica', 'T\u00E9cnica', true, false, true),
        atividade: __atividade,
        Atividade: __Atividade,
        a_atividade: getName('atividade', 'a atividade', true, true, false),
        a_Atividade: getName('atividade', 'a Atividade', true, true, true),
        atividades: getName('atividade', 'atividades', false, false, false),
        Atividades: getName('atividade', 'Atividades', false, false, true),
        Deducoes: getName('deducao', 'Dedu\u00E7\u00F5es', false, false, true),
    }
    window.__ = __;
    setOptionsPro('nomeVariaveisPro', __);
}
// isDefaultEnabledConfigValue + checkConfigValue migradas para SeiPro.core.config
// (src/core/config.js) — Fase 6. Globais preservados via aliasGlobal.
export function copyTextThis(this_) {
    copyToClipboard($(this_).text().trim());
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
export function copyTextWithBR(_this) {
    copyToClipboardWithBR(_this);
    _this.fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
}
export function markdownToHTML(markdown) {
  
    // CONVERTE TÍTULOS (SUPORTA ATÉ ######)
    markdown = markdown.replace(/^###### (.+)$/gm, '<h6>$1</h6>');
    markdown = markdown.replace(/^##### (.+)$/gm, '<h5>$1</h5>');
    markdown = markdown.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
    markdown = markdown.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  
    // CONVERTE LISTAS COM - OU *
    markdown = markdown.replace(/^[-*] (.+)$/gm, '<li>$1</li>');
    markdown = markdown.replace(/(<li>.+<\/li>)/gms, '<ul>$1</ul>'); // Envolve blocos com <ul>
  
    // CONVERTE LINKS [texto](url)
    markdown = markdown.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  
    // CONVERTE CÓDIGO EM LINHA `código`
    markdown = markdown.replace(/`([^`]+)`/g, '<code>$1</code>');
  
    // CONVERTE ***negrito itálico***
    markdown = markdown.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  
    // CONVERTE **negrito**
    markdown = markdown.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  
    // CONVERTE *itálico*
    markdown = markdown.replace(/\*(.+?)\*/g, '<em>$1</em>');
  
    // CONVERTE QUEBRAS DE LINHA SIMPLES EM <br>
    markdown = markdown.replace(/\n{2,}/g, '</p><p>');
    markdown = markdown.replace(/\n/g, '<br>');
  
    // ENVOLVE TUDO EM <p> CASO SEJA TEXTO SOLTO
    return `<p>${markdown}</p>`;
  }
export function copyToClipboardWithBR(element) {
    var $temp = $("<textarea>");
    var brRegex = /<br\s*[\/]?>/gi;
    $("body").append($temp);
    $temp.val(element.clone().find('.copy_response').remove().end().html().replace(brRegex, "\r\n")).select();
    document.execCommand("copy");
    $temp.remove();
}
export function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}
export function copyToClipboardHTML(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};
export function targetIfrVisualizacaoPro(url) { 
    if ( typeof url !== 'undefined' && url != '' && url !== null ) {
        $($ifrVisualizacao).attr("src", url);
    }
}
export function execIncluirEmBlocoPro() { 
    $($ifrVisualizacao)[0].contentWindow.incluirEmBloco();
}
export function execConcluirReabrirProcessoPro(url) { 
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    if ( ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) {
        $($ifrVisualizacao)[0].contentWindow.reabrirProcesso();    
    } else if ( ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) {
        $($ifrVisualizacao)[0].contentWindow.concluirProcesso();    
    } else {
        targetIfrVisualizacaoPro(url);
    }
}
// Historical Google Sheets client (removed). Projetos is local-first; see pages/PROJETOS.md.
// [migrado para core/sei] uniqPro
// [migrado para core/sei] getParamsUrlPro
export function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgb(" + r + "," + g + "," + b + ")";
 };

 const getContentProcSEIByProtocolo = async (protocolo) => {
    try {
        const href = $('#frmProtocoloPesquisaRapida').attr('action');
        const response = await fetch(href, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ txtPesquisaRapida: protocolo }),
        });

        if (!response.ok) {
            console.error('Erro na requisi\u00E7\u00E3o:', response.statusText);
            return null;
        }

        const finalUrl = response.url;
        const params = getParamsUrlPro(finalUrl);

        if (params.id_protocolo && params.id_protocolo !== '0') {
            const data = await response.text();
            return data;
        } else {
            console.error('ID do protocolo n\u00E3o encontrado ou \u00E9 zero.');
            return null;
        }

    } catch (error) {
        console.error('Erro ao buscar ID do protocolo SEI:', error);
        return null;
    }
};

export function getIDProtocoloSEI(protocolo, funcSucess, funcError) {
    var xhr = new XMLHttpRequest();
    var href = $('#frmProtocoloPesquisaRapida').attr('action');
    $.ajax({ 
        method: 'POST',
        data: { txtPesquisaRapida: protocolo },
        url: href,
        xhr: function() {
             return xhr;
        },
        success: function(data) { 
          var _return = getParamsUrlPro(xhr.responseURL);
            if ( _return.id_protocolo != 0 && typeof _return.id_protocolo !== 'undefined' ) {
                funcSucess(data);
            } else {
                funcError();
            }
        }
    });
}
// isValidHttpUrl migrada para SeiPro.core.validacao (src/core/validacao.js) — Fase 6
export function arraySheetToJSON(array) {
    var objDados = [];
    $.each(array,function(index, value){
        if ( index != 0 && typeof value[0] !== 'undefined' && value[0] != '' ) {
            var obj = {};
            for (var i = 0 ; i < array[0].length; i++) {
                var nameIndex = array[0][i];
                obj[nameIndex] = (typeof value[i] !== 'undefined') ? value[i] : '';
            }
            objDados.push(obj);
        }
    });
    return objDados;
}
export function arraySheetToJSON_WithRow(array) {
    var objDados = [];
    $.each(array,function(index, value){
        if ( index != 0 && value.length > 0 ) {
            var obj = {};
                obj['_ROW'] = index+1;
                for (var i = 0 ; i < array[0].length; i++) {
                    var nameIndex = array[0][i];
                    obj[nameIndex] = (typeof value[i] !== 'undefined') ? value[i] : '';
                }
                objDados.push(obj);
        } else {
            objDados.push({_ROW: index+1});
        }
    });
    return objDados;
}
export function getCitacaoDoc() {
    var citacaoDoc = 'SEI n\u00BA ';
        citacaoDoc = (getConfigValue('citacaodoc') == 'citacaodoc_2') ? 'SEI ' : citacaoDoc;
        citacaoDoc = (getConfigValue('citacaodoc') == 'citacaodoc_5') ? 'Doc. SEI n\u00BA ' : citacaoDoc;
        citacaoDoc = (getConfigValue('citacaodoc') == 'citacaodoc_3' || getConfigValue('citacaodoc') == 'citacaodoc_4') ? '' : citacaoDoc;
    return citacaoDoc;
}
export function checkFormRequiredPro(elementForm) {
    var required = true;
    $(elementForm+' .required').each(function( index ) {
    	if ( $(this).val() == '' ) { required = false; }
    });
    return required;
}
export function confirmaFraseBoxPro(text, phrase, func, cancel) {
    if (alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaAttencionPro').html('');
    }
    var phraseDiv = '<div class="dialogBoxDiv">Para confirmar, digite <b style="font-weight: bold;">'+phrase.toUpperCase()+'</b>:</div>'+
                    '<div class="dialogBoxDiv seiProForm">'+
                    '   <input id="dialogBoxConfirmFrase" autocomplete="off" onkeypress="if (event.which == 13) { $(this).closest(\'.ui-dialog\').find(\'.confirm.ui-button\').trigger(\'click\') }" oninput="if (\''+phrase.toUpperCase()+'\' == $(this).val().trim().toUpperCase()) {updateButtonConfirm(this, true)} else {updateButtonConfirm(this, false)}" type="text" style="font-size: 10pt; width: 80%; text-transform: uppercase;">'+
                    '</div>';
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> '+text+'</strong>'+phraseDiv)
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 550,
        	close: function() { 
                alertBoxPro = false;
                $('.alertaAttencionPro').html('');
                if (typeof cancel === 'function') {
                    cancel();
                }
            },
        	buttons: [{
                text: "Cancelar",
                click: function() {
                    $(this).dialog('close');
                    if (typeof cancel === 'function') {
                        cancel();
                    }
                }
            },{
                text: "OK",
                class: "confirm",
                click: function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    var confirmFrase = $('#dialogBoxConfirmFrase');
                    if (phrase.toUpperCase() == confirmFrase.val().trim().toUpperCase()) {
                        confirmFrase.removeClass('requiredNull');
                        func();
                        $(this).dialog('close');
                    } else {
                        confirmFrase.addClass('requiredNull');
                    }
                }
            }]
        });
}
export function confirmaBoxPro(text, func, titBtn = 'OK', cancel = false, titBtnCancel = 'Cancelar') {
    if (alertBoxPro) { 
        alertBoxPro.dialog('destroy');
        alertBoxPro = false;
        $('.alertaAttencionPro').html('');
    }
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alertaAttencionPro dialogBoxDiv"><i class="fas fa-exclamation-triangle" style="margin-right: 5px;"></i> '+text+'</strong>')
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 500,
        	close: function() { 
                alertBoxPro = false;
                if (typeof cancel === 'function') { cancel() }
                $('.alertaAttencionPro').html('');
            },
        	buttons: [{
                text: titBtnCancel,
                click: function() {
                    if (typeof cancel === 'function') { cancel() }
                    $(this).dialog('close');
                }
            },{
                text: titBtn,
                class: "confirm ui-state-active",
                click: function() {
                    func();
                    $(this).dialog('close');
                }
            }]
        });
}
export function alertaBoxPro(status, icon, text, func_ok = false, button_text = "OK", hide_close = false) {
    resetDialogBoxPro('alertBoxPro');
    alertBoxPro = $('#alertaBoxPro')
        .html('<strong class="alerta'+status+'Pro dialogBoxDiv"><i class="fas fa-'+icon+'" style="margin-right: 5px;"></i> '+text+'</strong>')
        .dialog({
            title: NAMESPACE_SPRO,
        	width: 400,
            open: function() {
                var closeButton = $(this).closest('.ui-dialog').find('.ui-dialog-titlebar-close');
                closeButton.toggle(!hide_close);
            },
        	close: function() { 
                alertBoxPro = false;
                $('.alerta'+status+'Pro').html('');
             },
        	buttons: [{
                text: button_text,
                class: "confirm",
                click: function() {
                    $(this).dialog('close');
                    if (typeof func_ok === 'function') func_ok();
                }
            }]
        });
}
export function openConfigBoxPro(html = '', func_open = false, func_close = false) {
    resetDialogBoxPro('configBoxPro');
    configBoxPro = $('#configBoxPro')
        .html('<div id="configBoxProDiv" class="configBoxProDiv">'+html+'</div>')
        .dialog({
            title: NAMESPACE_SPRO+': Configura\u00E7\u00F5es',
        	width: '95%',
        	height: 'auto',
            modal: true,
        	open: function() { 
                if (typeof func_open === 'function') func_open();
            },
        	close: function() { 
                configBoxPro = false;
                if (typeof func_close === 'function') func_close();
            },
        	buttons: [{
                text: "OK",
                class: "confirm",
                click: function() {
                    $(this).dialog('close');
                }
            }]
        });
}
export function generateGreetings(){
    var currentHour = parseInt(moment().format("HH"));
    console.log(currentHour);
    if (currentHour >= 5 && currentHour < 12){
        return "Bom dia";
    } else if (currentHour >= 12 && currentHour < 18){
        return "Boa tarde";
    } else if (currentHour >= 18 || currentHour < 5){
        return "Boa noite";
    } else {
        return "Ol\u00E1"
    }
}
export function togglePainelPro(idTable, mode) {
	if ( mode == 'hide' ) {
		$('#'+idTable+'_full').hide();
		$('#'+idTable+'_min').show();
        setOptionsPro(idTable, 'hide');
	} else {
		$('#'+idTable+'_full').show();
		$('#'+idTable+'_min').hide();
        setOptionsPro(idTable, 'show');
	}
}
export function toggleTablePro(idTable, mode) {
    var elemTable = idTable.substring(1);
	if ( mode == 'hide' ) {
		$(idTable).addClass('displayNone');
		$('#'+elemTable+'_hideIcon').hide();
		$('#'+elemTable+'_showIcon').show();
        setOptionsPro(elemTable, 'hide');
	} else {
		$(idTable).removeClass('displayNone').css('display', '');
		$('#'+elemTable+'_hideIcon').show();
		$('#'+elemTable+'_showIcon').hide();
        setOptionsPro(elemTable, 'show');
	}
}
export function toogleByID(this_) {
    var _this = $(this_);
    var _ref = _this.data('ref');
    var elem = $('#'+_ref);
    if (elem.is(':visible')) {
        elem.hide();
    } else {
        elem.show();
    }

}
export { getColorID, getStyleTable } from '../../shared/table-styles.js';
// [migrado para platform/webstore.js] wrappers de web storage da página:
//  localStorage{Restore,Store,Remove}Pro, sessionStorage{...}, hybridStorage{...}.
//  Instalados por installCoreStack() -> installWebstore(); globais via aliasGlobal.
// [migrado para core/options.js] verifyOptionsPro, getOptionsPro
