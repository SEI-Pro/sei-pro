// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
/**
 * Sticknote UI na árvore — extraído de body.js.
 */
import { callParentAtividades, atividadesStateParent } from './atividades-bridge.js';
import {
    formatAnotacaoToParagraphs,
    sticknotePresetRankIconHtml as domainSticknotePresetRankIconHtml
} from './domain.js';

export function sticknoteUpdate(this_, value, type, priority = false, mode = 'insert') {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var textarea = _parent.find('.stickNotePro');
    var url = getTreeLinkUrlByName('Anotações');
    if (typeof url !== 'undefined' && url != '') {
        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }

        if (textarea.text().trim().length >= 500) {
            var line = formatDadosAnotacao(textarea[0].outerHTML, 'line').substring(0,499);
            var par = formatDadosAnotacao(line, 'paragraph');
                textarea.html(par);
                value = line;
        }

        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            var iframe = $(this).contents();
            $(this).unbind();
            if (mode == 'insert') {
                iframe.find('#txaDescricao').val(value);
            } else if (mode == 'increment') {
                value = iframe.find('#txaDescricao').val()+'\n'+value; 
                value = value.substring(0,499); 
                // console.log({mode: mode, value: value});
                iframe.find('#txaDescricao').val(value);
            }
            iframe.find('#chkSinPrioridade').prop('checked', priority);
            iframe.find('button[type="submit"]').trigger('click');
            _parent.find('.editStickNote').show();
            _parent.find('.removeStickNote').show();
            _parent.find('.priorityStickNote').show();
            _parent.find('.seipro-sticknote-preset').show();
            _parent.find('.setDateStickNote_input').hide();
            _parent.find('.setDateStickNote').show();
            _parent.find('.countLimit').text('');
            _parent.find('.removeStickConfirm, .removeStickCancel').hide();
            if (type == 'save') {
                _parent.find('.saveStickNote').toggleClass('fa-spinner fa-save').removeClass('fa-spin').hide();
            } else if (type == 'remove') {
                textarea.text('');
                _parent.find('.removeStickNote').toggleClass('fa-spinner fa-trash-alt').removeClass('fa-spin');
            }
            if (_parent.find('.priorityStickNote').hasClass('fa-spin')) {
                _parent.find('.priorityStickNote').removeClass('fa-spin').toggleClass('fa-spinner fa-exclamation-circle');
            }
            textarea.prop('contenteditable',false).html( formatDadosAnotacao(value, 'paragraph') );
            _parent.find('.cancelStickNote').hide();
            _parent.find('.checkStickNote').hide();
            sticknoteDates(_this);
            setStickNoteCheck();
            if (_parent.find('.editStickNote').hasClass('fa-spinner')) {
                _parent.find('.editStickNote').toggleClass('fa-edit fa-spinner').removeClass('fa-spin');
            }
            if (_parent.find('.saveStickNote').hasClass('fa-spinner')) {
                _parent.find('.saveStickNote').toggleClass('fa-save fa-spinner').removeClass('fa-spin');
            }
            if (_parent.find('.setDateStickNote').hasClass('fa-spinner')) {
                _parent.find('.setDateStickNote').toggleClass('fa-calendar-plus fa-spinner').removeClass('fa-spin');
            }
            if (_parent.find('.stickNoteDate .dateboxDisplay').length > 0) {
                _parent.find('.stickNoteDate .dateboxDisplay .userStick').text(parent.userSEI);
            } else {
                _parent.find('.stickNoteDate').html('<span class="dateboxDisplay"><i class="far fa-user" style="color: #777;padding-right: 3px;margin-left: 10px;"></i> por <span class="userStick">'+parent.userSEI+'</span></span>');
            }
        });
    }
}
export function sticknoteRemove(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    if (_parent.find('.stickNotePro').text().trim() != '') {
        _parent.find('.removeStickNote').hide();
        _parent.find('.removeStickConfirm, .removeStickCancel').show();
    }
}
export function sticknoteRemoveConfirm(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    sticknoteUpdate(this_, '', 'remove');
    _parent.find('.removeStickConfirm, .removeStickCancel').hide();
    _parent.find('.removeStickNote').toggleClass('fa-trash-alt fa-spinner').addClass('fa-spin').show();
    _parent.addClass('stickEmpty').removeClass('priority');
}
export function sticknoteRemoveCancel(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    _parent.find('.removeStickConfirm, .removeStickCancel').hide();
    _parent.find('.removeStickNote').show();
}
export function sticknoteSave_(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    // console.log('sticknoteSave_',_parent.find('.actions:hover').length);
    if (_parent.find('.actions:hover').length == 0) {
        setTimeout(function(){ 
            sticknoteSave(this_);
        }, 500);
    }
}
export function sticknoteSave(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var textarea = _parent.find('.stickNotePro');
    var priority = _parent.hasClass('priority');
    var value = formatDadosAnotacao(textarea[0].outerHTML, 'line');
    var oldValue = textarea.data('oldValue');
    if (!_parent.find('.saveStickNote').hasClass('fa-spin') && (oldValue != value || textarea.data('modify') == true)) {
        sticknoteUpdate(this_, value , 'save', priority);
        _parent.find('.saveStickNote').toggleClass('fa-save fa-spinner').addClass('fa-spin');
    }
}
export function sticknoteCancel(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    _parent.find('.editStickNote').show();
    _parent.find('.removeStickNote').show();
    _parent.find('.priorityStickNote').show();
    _parent.find('.seipro-sticknote-preset').show();
    _parent.find('.setDateStickNote').show();
    _parent.find('.setDateStickNote_input').hide();
    _parent.find('.saveStickNote').hide();
    _parent.find('.cancelStickNote').hide();
    _parent.find('.removeStickConfirm, .removeStickCancel').hide();
    _parent.find('.checkStickNote').hide();
    _parent.find('.countLimit').text('');
    var textarea = _parent.find('.stickNotePro');
        textarea.prop('contenteditable',false).html( formatDadosAnotacao(textarea.data('oldValue'), 'paragraph') );

    if (typeof textarea.data('oldValue') === 'undefined' || textarea.data('oldValue').trim() == '') {
        _parent.addClass('stickEmpty').removeClass('priority');
    }
    stickNoteDivSelected = 0;
}
export function sticknoteEdit(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    _parent.find('.editStickNote').hide();
    _parent.find('.removeStickNote').hide();
    // _parent.find('.priorityStickNote').hide();
    _parent.find('.seipro-sticknote-preset').hide();
    _parent.find('.setDateStickNote_input').hide();
    // _parent.find('.setDateStickNote').hide();
    _parent.find('.saveStickNote').show();
    _parent.find('.cancelStickNote').show();
    _parent.find('.checkStickNote').show();
    _parent.removeClass('stickEmpty');
    var textarea = _parent.find('.stickNotePro');
        textarea.prop('contenteditable',true).data('oldValue', formatDadosAnotacao(textarea[0].outerHTML, 'line') ).focus();
}
export function sticknoteSaveDate(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var inputDate = _parent.find('.setDateStickNote_input');
    var input = inputDate.find('input');
    var textarea = _parent.find('.stickNotePro');
    var value = moment(input.val(),'YYYY-MM-DD').format('DD/MM/YYYY');
    var oldValue = moment(input.data('oldValue'),'YYYY-MM-DD').format('DD/MM/YYYY');
    var line = formatDadosAnotacao(textarea[0].outerHTML, 'line');
    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var par = '';
    if (regex.test(removeAcentos(textarea.text().trim()))) {
        line = line.replace(oldValue, value);
        par = formatDadosAnotacao(line, 'paragraph');
    } else {
        line = line+' '+value;
        par = formatDadosAnotacao(line, 'paragraph');
    }
    if (par != '' ) {
        textarea.html(par);
        sticknoteSave(this_);
        _parent.find('.setDateStickNote').toggleClass('fa-calendar-plus fa-spinner').addClass('fa-spin');
    } 
    // console.log(value, oldValue, par);
    inputDate.hide();
}

export function sticknoteSetDateKey(e, this_) {
    if(e.which == 13) {
        $(this_).closest('.stickDadosArvore').find('.setDateStickNote').trigger('click');
    }
}
export function sticknoteSetDate(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var textarea = _parent.find('.stickNotePro');
    var inputDate = _parent.find('.setDateStickNote_input');
    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDate = regex.exec(removeAcentos(textarea.text().trim()));
    var dateStick = (checkDate !== null) ? moment(checkDate[0], 'DD/MM/YYYY').format('YYYY-MM-DD') : moment().format('YYYY-MM-DD');
    if (inputDate.is(':visible')) {
        sticknoteSaveDate(this_);
        if (_this.hasClass('fa-thumbs-up')) {
            _this.toggleClass('fa-thumbs-up fa-calendar-plus');
            _this.attr('onmouseover','return infraTooltipMostrar(\'Inserir Data\');');
        }
    } else {
        inputDate.show().find('input').val(dateStick).data('oldValue', dateStick).focus();
        if (_this.hasClass('fa-calendar-plus')) {
            _this.toggleClass('fa-thumbs-up fa-calendar-plus');
            _this.attr('onmouseover','return infraTooltipMostrar(\'Confirmar Data\');');
        }
    }
}
export function getSticknoteUser() {
    var id_protocolo = getParamsUrlPro(window.location.href).id_procedimento;
    var userStick = (getOptionsPro('arraySticknoteHome') && typeof id_protocolo !== 'undefined') ? jmespath.search(getOptionsPro('arraySticknoteHome'),"[?id_protocolo=='"+id_protocolo+"'] | [0]") : null;
    userStick = (userStick !== null) ? userStick.usertip : false;
    return userStick;
}
export function sticknoteDates(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var textarea = _parent.find('.stickNotePro');
    var date_stick = removeAcentos(textarea.text().trim());
    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var userStick = getSticknoteUser();
        userStick = (userStick) ? '<i class="far fa-user" style="color: #777;padding-right: 3px;margin-left: 10px;"></i> por <span class="userStick">'+userStick+'</span>' : '';
    var checkDate = regex.exec(date_stick);
    var htmlStick = userStick ? '<span class="dateboxDisplay" style="'+(checkDate !== null && moment(checkDate[0], 'DD/MM/YYYY') < moment() ? 'background: #fac3c4 !important;' : '')+'" >'+userStick+'</span>' : '';
    _parent.find('.stickNoteDate').html(htmlStick);
}
export function sticknotePriority(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var _stick = $('.stickNotePro');
    _parent.toggleClass('priority');
    if (typeof _stick.attr('contenteditable') === 'undefined' || _stick.attr('contenteditable') == 'false') {
        _parent.find('.priorityStickNote').addClass('fa-spin').toggleClass('fa-exclamation-circle fa-spinner');
        sticknoteSave(this_);
    } else {
        _stick.data('modify',true); 
        setTimeout(function() {
            _stick.trigger('click').focus();
        }, 0);
    }
}
export function sticknotePresetRankIconHtml(label, text, bars) {
    // Keep legacy onclick for iframe/parent call-sites; also expose data attr for future delegation.
    return domainSticknotePresetRankIconHtml(label, text, bars)
        .replace(
            'data-seipro-sticknote-preset="' + text + '"',
            'data-seipro-sticknote-preset="' + text + '" onclick="sticknoteQuickPreset(this, \'' + text + '\')" onmouseover="return infraTooltipMostrar(\'' + label + '\');" onmouseout="return infraTooltipOcultar();"'
        );
}
export function sticknoteQuickPreset(this_, value) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var textarea = _parent.find('.stickNotePro');
    var current = formatDadosAnotacao(textarea[0].outerHTML, 'line').replace(/\s+$/, '');
    var mode = (current !== '') ? 'increment' : 'insert';
    sticknoteUpdate(this_, value, 'preset', _parent.hasClass('priority'), mode);
}
export function removeFormatting(this_) {
    var _this = $(this_);
    setTimeout(function(){ 
        var line = formatDadosAnotacao(_this[0].outerHTML, 'line');
            line = (line.trim() == '') ? _this.text().trim() : line;
        var paragraph = formatDadosAnotacao(line, 'paragraph');
        _this.html( paragraph );
        // console.log('pasting', line, paragraph);
    }, 100);
}
export function checkLimitTextArvore(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.stickDadosArvore');
    var maxlength = _this.attr('maxlength');
    var currentLength = (_this.is('textarea')) ? _this.val().length : _this.text().trim().length;
    var textCount = (currentLength >= maxlength) ? 'Voc\u00EA atingiu o n\u00FAmero m\u00E1ximo de caracteres.' : (maxlength - currentLength)+' caracteres restantes';
    _parent.find('.countLimit').html(textCount);
    sticknotePosition();
}
export function formatDadosAnotacao(value, type, paste = false) {
    var result = '';
    if (type == 'line') {
        value = normalizeMojibakeUtf8(value);
        var elem = $('<div/>').html(value).contents();
        var fistLine = elem.clone().children().remove().end().text();
        var othesLines = (paste) ? elem.find('div, p, br') : elem.find('div, p');
            othesLines = othesLines.map(function(v, i){ 
                if ($(this).text().trim() != '') { 
                    var check = ($(this).hasClass('stickNoteCheck')) ? '[ ] ' : '';
                        check = ($(this).hasClass('stickNoteChecked')) ? '[X] ' : check;
                    return check+$(this).text()+'\n';
                } else if (i != 0 ) { 
                    return '\n';
                } 
            }).get().join('');
        result = (othesLines != '') ? fistLine+'\n'+othesLines : fistLine;
    } else if (type == 'paragraph' || type === 'paragraph') {
        value = normalizeMojibakeUtf8(value);
        result = formatAnotacaoToParagraphs(value, replaceTextToProcessoSEI);
    }
    return result;
}
export function setDadosAnotacao(anotacaoTxt, checkPrioridade) {
    var anotacaoClass = (anotacaoTxt == '') ? 'stickEmpty' : '';
    var priorityClass = (checkPrioridade) ? 'priority' : '';
        anotacaoTxt = (anotacaoTxt == '') ? '<div></div>' : formatDadosAnotacao(anotacaoTxt, 'paragraph');
    var htmlAnotacao =  '<div class="stickDadosArvore '+anotacaoClass+' '+priorityClass+'" style="position: relative; ">'+
                        '   <label class="newLink" style="margin-bottom: 10px; display: block;"><i class="fas fa-sticky-note azulColor iconDadosProcesso"></i>Anota\u00E7\u00F5es:</label>'+
                        '   <div class="stickNoteDate"></div>'+
                        '   <div class="stickNotePro" maxlength="500" onclick="sticknotePosition();" onpaste="removeFormatting(this)" oninput="checkLimitTextArvore(this)" onblur="sticknoteSave_(this)" contenteditable="false">'+anotacaoTxt+'</div>'+
                        '   <div class="actionsNew">'+
                        '       <a class="newLink" style="font-size: 10pt;cursor: pointer;" onclick="sticknoteEdit(this)">'+
                        '           <i class="fas fa-sticky-note laranjaColor newStickNote" style="cursor: pointer; display: inline-block;"></i>'+
                        '           Adicionar Anota\u00E7\u00E3o'+
                        '       </a>'+
                        '   </div>'+
                        '   <div class="actions">'+
                        '       <div>'+
                        '           <span class="countLimit" style="font-size: 8pt;position: absolute;color: #666;left: 30px;margin-top: 5px;"></span>'+
                        '           <i class="fas fa-edit azulColor editStickNote" style="cursor: pointer;" onclick="sticknoteEdit(this)" onmouseover="return infraTooltipMostrar(\'Editar Anota\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-save azulColor saveStickNote" style="cursor: pointer; display:none" onclick="sticknoteSave(this)" onmouseover="return infraTooltipMostrar(\'Salvar Anota\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-trash-alt removeStickNote" style="margin-top: 2px; cursor: pointer;float: right;font-size: 90%;" onclick="sticknoteRemove(this)" onmouseover="return infraTooltipMostrar(\'Remover Anota\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-thumbs-up removeStickConfirm" style="margin-top: 2px; cursor: pointer;float: right;font-size: 90%; display:none;" onclick="sticknoteRemoveConfirm(this)" onmouseover="return infraTooltipMostrar(\'Confirmar remo\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-thumbs-down removeStickCancel" style="cursor: pointer;float: right;font-size: 90%; display:none; margin: 2px 10px 0 0;" onclick="sticknoteRemoveCancel(this)" onmouseover="return infraTooltipMostrar(\'Manter anota\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-times-circle cancelStickNote" style="cursor: pointer;float: right;font-size: 90%; display:none;" onclick="sticknoteCancel(this)" onmouseover="return infraTooltipMostrar(\'Cancelar Edi\u00E7\u00E3o\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <i class="fas fa-calendar-plus azulColor setDateStickNote" style="cursor: pointer;float: right;margin-right: 10px;" onclick="sticknoteSetDate(this)" onmouseover="return infraTooltipMostrar(\'Inserir Data\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <span class="setDateStickNote_input" style="display:none"><input onkeypress="sticknoteSetDateKey(event, this)" type="date" name="setDateStickNote"></span>'+
                        '           <span style="cursor: pointer;float: right;margin: -2px 10px 0 0; display:none;font-size: 100%;" class="checkStickNote" onclick="sticknoteCheck(this)"><i class="fas fa-check-square azulColor" style="font-size: 90%;"></i> <span  class="checkListStickNote" style="font-size: 80%;">Checklist</span></span>'+
                        '           <i class="fas fa-exclamation-circle priorityStickNote" style="cursor: pointer;float: right;margin-right: 10px;" onclick="sticknotePriority(this)" onmouseover="return infraTooltipMostrar(\'Prioridade\');" onmouseout="return infraTooltipOcultar();"></i>'+
                        '           <span style="float:right;display:inline-flex;gap:6px;align-items:center;margin:0 8px 0 6px;">' +
                        sticknotePresetRankIconHtml('Adicionar: Aguardando a assinatura da chefia imediata', 'Aguardando a assinatura da chefia imediata', '<rect x="5.2" y="6.4" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect><rect x="5.2" y="11.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>') +
                        sticknotePresetRankIconHtml('Adicionar: Aguardando a assinatura do superintendente', 'Aguardando a assinatura do superintendente', '<rect x="5.2" y="4.9" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect><rect x="5.2" y="9.2" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect><rect x="5.2" y="13.5" width="9.6" height="1.6" rx="0.8" fill="currentColor"></rect>') +
                        '           </span>'+
                        '       </div>'+
                        '   </div>'+
                        '</div>';
    $('.stickDadosArvore').remove();
    $('#divConsultarAndamento').after(htmlAnotacao);
    sticknoteDates($('.stickNotePro')[0]);
    setStickNoteCheck();
}
export function sticknotePosition() {
    if (window.getSelection().type == 'Range') {
        var base = $(window.getSelection().baseNode).closest('div').index();
        var extend = $(window.getSelection().extentNode).closest('div').index();
        stickNoteDivSelected = {start: (base < extend ? base : extend), end: (base > extend ? base : extend)};
    } else {
        stickNoteDivSelected = $(window.getSelection().anchorNode).closest('div').index();
        stickNoteDivSelected = (stickNoteDivSelected > $('.stickNotePro div').length-1) ? 0 : stickNoteDivSelected;
    }
    // console.log(stickNoteDivSelected);
}
export function sticknoteCheck(this_) {
    // console.log(stickNoteDivSelected);
    if (typeof stickNoteDivSelected == 'object') {
        $('.stickNotePro div').each(function(index){
            if (index >= stickNoteDivSelected.start && index <= stickNoteDivSelected.end) {
                sticknoteToggleCheck(index);
            }
        });
    } else {
        sticknoteToggleCheck(stickNoteDivSelected);
    }
}
export function sticknoteToggleCheck(id) {
    var selected = $('.stickNotePro div').eq(id);
    if (selected.hasClass('stickNoteCheck')) {
        selected.removeClass('stickNoteCheck').removeClass('stickNoteChecked');
    } else {
        selected.addClass('stickNoteCheck');
        // console.log('sticknoteToggleCheck', id, selected.text().trim());
        if (selected.text().trim() == '') {
            selected.text(' ')
            setTimeout(function() {
                $('.stickNotePro').trigger('click').focus();
            }, 0);
        }
    }
}
export function setStickNoteCheck() {
    $('.stickNotePro div').unbind().on("click", function () {
        var _this = $(this);
        var _parent = $('.stickNotePro');
        if (_this.hasClass('stickNoteCheck') && (typeof _parent.attr('contenteditable') === 'undefined' || _parent.attr('contenteditable') == 'false')) {
            if (_this.hasClass('stickNoteChecked')) {
                _this.removeClass('stickNoteChecked');
            } else {
                _this.addClass('stickNoteChecked');
            }
            _parent.closest('.stickDadosArvore').find('.editStickNote').addClass('fa-spin').toggleClass('fa-edit fa-spinner');
            sticknoteSave(_this[0]);
        } else if (_parent.attr('contenteditable') == 'true') {
            sticknotePosition();
        }
    });
}
export function getUrlAnotacaoArvore() {
    if (typeof jmespath === 'undefined') return false;

    var url = getTreeLinkUrlByName('Anotações', null, true);

    if (!url && getTreeLinksAllSession().length) {
        $.each(getTreeLinksAllSession(), function(index, value) {
            if (value && (value.indexOf('anotacao_registrar') !== -1 || value.indexOf('acao=anotacao_') !== -1)) {
                url = value;
                return false;
            }
        });
    }

    return url || false;
}
export function getDadosAnotacao() {
    var urlAnotacao = getUrlAnotacaoArvore();
    if (urlAnotacao && !parent.checkHostLimit()) {
        $.ajax({ url: urlAnotacao }).done(function (html) {
            var $htmlAnotacao = $(html);
            var anotacaoTxt = $htmlAnotacao.find('#txaDescricao').val().trim();
            var checkPrioridade = $htmlAnotacao.find('#chkSinPrioridade').is(':checked');
            setDadosAnotacao(anotacaoTxt, checkPrioridade);
        });
    } else if (!$('.stickDadosArvore').length && !parent.checkHostLimit()) {
        setDadosAnotacao('', false);
    }
}
export function togglePanelDadosArvore(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.panelDadosArvore');
    _this.toggleClass('fa-chevron-down fa-chevron-right');
    _parent.find('.infoDadosArvore').slideToggle('fast', function() {
        var type = _parent.data('type');
        var state = (_parent.find('.infoDadosArvore').is(':visible')) ? 'visible' : 'hide';
        setOptionsPro('panelDadosArvorePro_'+type, state);
      });
}
