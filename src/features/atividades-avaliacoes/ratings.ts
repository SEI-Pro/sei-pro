// @ts-nocheck — ADR-0014: dívida até tipagem; remover ao editar o arquivo.
import { callAtiv } from './call.js';
/**
 * Atividades — avaliações, recursos e notas.
 *
 * Esta fatia mantém apenas a superfície legada necessária durante a migração.
 * O estado compartilhado é instalado por runtime.js e os nomes antigos são
 * publicados exclusivamente por legacy-api.js.
 */
import { atividadesDialogDocAttrs } from './templates.js';
import { getServerAtividades } from './server.js';
import { getNameGenre } from '../../shared/nomenclatura.js';

export function saveAppealWork(this_) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var data = _parent.find('.appealWork').data();
    var justificativa_avaliado = _this.find('.appealCommentBoxText textarea.justificativa_avaliado').val();
    var justificativa_avaliador = _this.find('.appealCommentBoxText textarea.justificativa_avaliador').val();
    var justificativa = data.mode == 'avaliado' ? justificativa_avaliado : justificativa_avaliador;
    var action = 'appeal_avaliacoes';
    var param = {
        action: action,
        type: 'planos',
        mode: data.mode,
        id: data.id_plano,
        id_plano: data.id_plano,
        id_avaliacao: data.id_avaliacao,
        indice_mes_entrega: data.indice,
        horas_desconto: typeof data.horas_desconto !== 'undefined' ? data.horas_desconto : 0,
        horas_compensacao: typeof data.horas_compensacao !== 'undefined' ? data.horas_compensacao : 0,
        id_avaliacao_recurso: data.id_avaliacao_recurso,
        justificativa: justificativa
    };
    getServerAtividades(param, action);
}
export function saveAppeal(this_) {
    var _this = $(this_);
    $('#ratingPlano').slideUp(function () {
        $('#appealPlano').slideDown(function () {
            $('#appealPlano .appealCommentBoxDiv').find('.appealCommentBoxText textarea').focus();
            // centralizeDialogBox(dialogBoxPro);
        });
    });
    dialogBoxPro.dialog('option', 'buttons', [{
        text: 'Salvar Recurso',
        class: 'confirm',
        click: function (event) {
            // updateButtonConfirm(this, false);
            saveAppealWork(this);
            loadingButtonConfirm(true);
        }
    }]);
}
export function ratePrograma(this_, tipo_avaliacao = 3) {
    var _this = $(this_);
    var _data = _this.data();
    var id_programa = _data.id;
    var value = callAtiv('getProgramaData',id_programa);
    if (_data.mode == 'unrate') {
        rateCancelAtividade(id_programa, tipo_avaliacao);
    } else if (_data.mode == 'rate') {
        var avaliacao_programa = typeof value.avaliacao_programa !== 'undefined' && value.avaliacao_programa !== null && value.avaliacao_programa.length ? value.avaliacao_programa[0] : false;
        var id_avaliacao = value.id_avaliacao;
        var width = ($(window).width() - 50 > 1250 ? 1250 : $(window).width() - 50);

        var btnAvaliacao = callAtiv('checkCapacidade','rate_cancel_programa') && id_avaliacao
            ? [{
                text: 'Cancelar Avalia\u00E7\u00E3o',
                icon: "ui-icon-close",
                click: function (event) {
                    updateButtonConfirm(this, false);
                    rateCancelAtividade(id_programa, tipo_avaliacao);
                }
            }] : callAtiv('checkCapacidade','rate_programa') && !id_avaliacao
                ? [{
                    id: 'avaliarBtn',
                    text: 'Avaliar',
                    class: 'confirm',
                    click: function (event) {
                        saveRatingWork(this, false, tipo_avaliacao);
                    }
                }] : undefined;

        var htmlBox = '<div id="ratingPrograma" class="ratingWork" data-programa="' + value.id_programa + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            rateAtividadeList(value, tipo_avaliacao, false) +
            rateAtividadeBoxStars(value, tipo_avaliacao, false) +
            '   </table>' +
            '</div>';

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: (value.id_avaliacao ? 'Avalia\u00E7\u00E3o do' : 'Avaliar') + ' ' + __.Programa + ' #' + value.id_programa + ':  ' + value.sigla_unidade + ' ' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
                width: width,
                open: function () {
                    if (value.id_avaliacao) {
                        $('#ratingPrograma').find('.ratingStars .iconStarAtiv[data-nota="' + avaliacao_programa.nota_atribuida + '"]').trigger('click');
                        $.each(avaliacao_programa.justificativas, function (i, v) {
                            $('#ratingPrograma .ratingReason').find('.ratingWhy .answer[data-index="' + v.id_tipo_justificativa + '"]').trigger('click');
                        });
                        if (avaliacao_programa.comentarios != '') {
                            $('#ratingPrograma .moreCommentBoxDiv').find('.moreCommentBoxText textarea').val(avaliacao_programa.comentarios).prop('disabled', true).css('background-color', '#f5f5f5;');
                            if ($('#ratingPrograma .moreCommentBoxText textarea').is(':hidden')) $('#ratingPrograma .moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
                        }
                        let justChefia = $('.moreCommentBoxDiv textarea');
                        $('#ratingPrograma').find('.ratingReason, .ratingStars, .moreCommentBoxDiv').css({ 'pointer-events': 'none' });
                        $('#ratingPrograma').find('.moreCommentBox')
                            .removeAttr('onclick')
                            .attr({ 'data-act': 'atividades-call', 'data-fn': 'toggleInfoBox' })
                            .find('span').text('Justificativa (chefia imediata)');
                        justChefia.css('height', justChefia[0].scrollHeight + 'px');
                        updateButtonConfirm(this, true);
                    }
                    setTimeout(() => { centralizeDialogBox(dialogBoxPro) }, 100);
                },
                close: function () {
                    $('#ratingPrograma').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: btnAvaliacao
            });
    }
}
export function ratePlano(this_, tipo_avaliacao = 2) {
    var _this = $(this_);
    var _data = _this.data();
    var id_plano = _data.id;
    var indice = _data.indice;
    var value = callAtiv('getPlanoData',id_plano);
    if (_data.mode == 'unrate') {
        rateCancelAtividade(id_plano, tipo_avaliacao, indice);
        // } else if (_data.mode == 'rate' && !value.avaliacao && value.id_avaliacao_programa) {
        // alertaBoxPro('Error', 'exclamation-triangle', __.Programa+' j\u00E1 avaliado pela unidade superior! Solicite o cancelamento da avalia\u00E7\u00E3o para avaliar este plano.');
    } else if (_data.mode == 'rate') {
        var verifyRecurso = callAtiv('checkStatusRecurso',value, indice);
        var listRecurso = verifyRecurso.check && verifyRecurso.status && verifyRecurso.list && typeof verifyRecurso.list[0] !== 'undefined' ? verifyRecurso.list[0] : false;
        var checkRecurso = callAtiv('checkCapacidade','appeal_avaliacoes') && verifyRecurso.check && verifyRecurso.status.status == 1 && value.id_user == arrayConfigAtividades.perfil.id_user ? true : false;
        var avaliacao_plano = tipo_avaliacao == 2 ? jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`] | [0]") : false;
        avaliacao_plano = avaliacao_plano === null ? false : avaliacao_plano;
        var rateDisable = (avaliacao_plano && avaliacao_plano.nota_atribuida === false) || (value.id_user == arrayConfigAtividades.perfil.id_user && !callAtiv('checkOptionUnidade','planos', 'permite_autoavaliacao')) ? true : false;
        rateDisable = avaliacao_plano ? true : false;
        var id_avaliacao_recurso = checkRecurso && listRecurso ? listRecurso.id_avaliacao_recurso : false;
        var id_avaliacao = checkRecurso && listRecurso ? listRecurso.id_avaliacao : false;
        var deducao_plano = typeof value.deducao_plano !== 'undefined' && value.deducao_plano ? value.deducao_plano : false;
        var checkDeducaoPlano = deducao_plano && avaliacao_plano && jmespath.search(deducao_plano, '[?id_avaliacao==`' + avaliacao_plano.id_avaliacao + '`]').length > 0 ? true : false;
        var btnCancelAvaliacao = callAtiv('checkCapacidade','appeal_cancel_avaliacoes') || !verifyRecurso.check || (verifyRecurso.check && verifyRecurso.status.status < 2)
            ? [{
                text: 'Cancelar Avalia\u00E7\u00E3o',
                icon: "ui-icon-close",
                click: function (event) {
                    updateButtonConfirm(this, false);
                    rateCancelAtividade(id_plano, tipo_avaliacao, indice);
                }
            }] : undefined;
        btnCancelAvaliacao = value.id_avaliacao_programa ? undefined : btnCancelAvaliacao;

        let btnExtendRecurso = {
            text: __.Prorrogar + ' prazo',
            icon: 'ui-icon-clock',
            click: function (event) {
                callAtiv('extendAvaliacao',id_plano, indice, listRecurso.id_avaliacao_recurso, listRecurso.id_avaliacao);
            }
        };

        let btnAvaliaRecurso = [{
            text: 'N\u00C3O acatar',
            icon: 'ui-icon-closethick',
            click: function (event) {
                $('#ratingPlano').slideUp(function () {
                    $('#appealPlano').attr('data-id_avaliacao_recurso', listRecurso.id_avaliacao_recurso).attr('data-id_avaliacao', listRecurso.id_avaliacao).attr('data-mode', 'avaliador').slideDown(function () {
                        $('#appealPlano .appealCommentBoxDiv').find('a.newLink.appealCommentBox span').text('Motiva\u00E7\u00E3o para o n\u00E3o acatamento das justificativas').focus();
                        $('#appealPlano .appealCommentBoxDiv').find('.appealCommentBoxText textarea').attr('class', 'justificativa_avaliador').focus();
                        dialogBoxPro.dialog('option', 'buttons', [{
                            text: 'Salvar Motiva\u00E7\u00E3o',
                            class: 'confirm',
                            click: function (event) {
                                saveAppealWork(this);
                                loadingButtonConfirm(true);
                            }
                        }]);
                    });
                });
            }
        }, {
            text: 'Acatar justificativas',
            icon: 'ui-icon-check',
            class: 'confirm',
            click: function (event) {
                $('.ratingWork .infoHorasCompensacao, .ratingWork .infoHorasDesconto').remove();
                $('.ratingWork').removeData('nota-selected');
                $('.ratingStars, .ratingReason').css('pointer-events', 'all');
                $('#ratingPlano').find('.iconStarAtiv[data-aceita-entrega="0"]').css('pointer-events', 'none');
                $('#ratingPlano').find('.iconStarAtiv[data-aceita-entrega="1"]').attr('data-readonly', 'false').data('readonly', false);
                $('.iconStarAtiv i').removeClass('starGold').removeClass('starSelected');
                $('.ratingReason').html('');
                $('#ratingPlano').find('.moreCommentBoxDiv').css('height', 'initial');
                $('#ratingPlano').find('.moreCommentBoxText .countLimit').html('');
                $('#ratingPlano').find('.moreCommentBoxText textarea').prop('disabled', false).val('');
                $('#ratingPlano').find('a[data-act="atividades-call" data-fn="toggleInfoBox"].newLink_active').trigger('click');
                $('#ratingPlano').find('.infoBoxEntrega').before('<div style="text-align: center;padding: 10px;display: block;font-size: 1.1em;background: #f9efad;border-radius: 5px;color: #666;margin: 40px 0 10px;"><i class="fas fa-info-circle azulColor"></i> Selecione uma nova nota de avalia\u00E7\u00E3o:</div>');
                dialogBoxPro.dialog('option', 'buttons', [{
                    text: 'Salvar nova avalia\u00E7\u00E3o',
                    icon: "ui-icon-star",
                    class: 'confirm',
                    click: function () {
                        saveRatingWork(this, false, 2, indice, listRecurso.id_avaliacao_recurso);
                    }
                }]);
            }
        }];

        var btnRecurso = checkRecurso
            ? [{
                text: 'Cadastrar Recurso',
                class: 'confirm',
                click: function (event) {
                    updateButtonConfirm(this, false);
                    saveAppeal(this);
                }
            }]
            :
            callAtiv('checkCapacidade','rate_cancel_plano')
                ? btnCancelAvaliacao
                : undefined;

        if (callAtiv('checkCapacidade','appeal_approve_avaliacoes') && verifyRecurso.check && verifyRecurso.status.status == 2) {
            btnRecurso = btnAvaliaRecurso;
        }
        if (callAtiv('checkCapacidade','rate_cancel_plano') && checkRecurso && !value.id_avaliacao_programa) {
            if (typeof btnCancelAvaliacao !== 'undefined') btnRecurso.unshift(btnCancelAvaliacao[0]);
        }
        if (callAtiv('checkCapacidade','appeal_extend_avaliacoes') && verifyRecurso.check && verifyRecurso.status.status == 5 && !checkDeducaoPlano) {
            if (btnRecurso && btnRecurso.length) {
                btnRecurso.unshift(btnExtendRecurso);
            } else {
                btnRecurso = [btnExtendRecurso];
            }
        }

        var htmlBox = '<div id="ratingPlano" class="ratingWork" data-plano="' + value.id_plano + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            rateAtividadeList(value, tipo_avaliacao, indice) +
            rateAtividadeBoxStars(value, tipo_avaliacao, indice, rateDisable) +
            '   </table>' +
            '</div>' +
            '<div id="appealPlano" style="display:none;" class="appealWork" data-indice="' + indice + '" data-id_plano="' + value.id_plano + '" data-id_avaliacao_recurso="' + id_avaliacao_recurso + '" data-id_avaliacao="' + id_avaliacao + '" data-mode="avaliado">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            '      <tr style="text-align: center;">' +
            '           <td>' +
            '               <div class="appealCommentBoxDiv" style="text-align: center;">' +
            '                   <a class="newLink appealCommentBox" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0;"><i class="far fa-comment-alt cinzaColor"></i> <span>Justificativas para reconsidera\u00E7\u00E3o da nota</span></a>' +
            '                   <div class="appealCommentBoxText">' +
        '                       <textarea maxlength="500" data-act="atividades-composite" data-chain="checkLimitText|updateButtonTextarea" data-on="input" class="justificativa_avaliado" name="justificativa_avaliado"></textarea>' +
            '                       <span class="countLimit"></span>' +
            '                   </div>' +
            '               </div>' +
            '           </td>' +
            '      </tr>'
        '   </table>' +
            '</div>';

        let width = 650;
        width = tipo_avaliacao == 2 ? ($(window).width() - 50 > 1250 ? 1250 : $(window).width() - 50) : width;

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
            .dialog({
                title: (avaliacao_plano && avaliacao_plano.id_avaliacao ? 'Avalia\u00E7\u00E3o do' : 'Avaliar') + ' Plano de Trabalho #' + value.id_plano + ':  ' + value.apelido + ' (' + value.nome_modalidade + ') ' + moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY') + ' \u00E0 ' + moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY'),
                width: width,
                open: function () {
                    if (avaliacao_plano && avaliacao_plano.id_avaliacao) {
                        $('#ratingPlano').find('.ratingStars .iconStarAtiv[data-nota="' + avaliacao_plano.nota_atribuida + '"]').trigger('click');
                        $.each(avaliacao_plano.justificativas, function (i, v) {
                            $('#ratingPlano .ratingReason').find('.ratingWhy .answer[data-index="' + v.id_tipo_justificativa + '"]').trigger('click');
                        });
                        if (avaliacao_plano.comentarios != '') {
                            $('#ratingPlano .moreCommentBoxDiv').find('.moreCommentBoxText textarea').val(avaliacao_plano.comentarios).prop('disabled', true).css('background-color', '#f5f5f5;');
                            if ($('#ratingPlano .moreCommentBoxText textarea').is(':hidden')) $('#ratingPlano .moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
                        }
                        let justChefia = $('.moreCommentBoxDiv textarea');
                        $('#ratingPlano').find('.ratingReason, .ratingStars, .moreCommentBoxDiv').css({ 'pointer-events': 'none' });
                        $('#ratingPlano').find('.moreCommentBox')
                            .removeAttr('onclick')
                            .attr({ 'data-act': 'atividades-call', 'data-fn': 'toggleInfoBox' })
                            .find('span').text('Justificativa (chefia imediata)');
                        justChefia.css('height', justChefia[0].scrollHeight + 'px');
                        updateButtonConfirm(this, true);
                        setTimeout(() => { centralizeDialogBox(dialogBoxPro) }, 100);
                    }
                    if (verifyRecurso.check) {
                        if (verifyRecurso.status && verifyRecurso.status.status >= 2 && listRecurso && listRecurso.justificativa_avaliado) {
                            var justificativa_avaliado = listRecurso.justificativa_avaliado;
                            var textAvaliacao = 'Avaliado em ' + moment(listRecurso.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
                            var textRecurso = 'Recurso dispon\u00EDvel at\u00E9 ' + moment(listRecurso.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
                            var textAnalise = 'Recurso apresentado em ' + moment(listRecurso.data_justificativa, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
                            var htmlJustAvaliado = '<i class="far fa-chevron-right cinzaColor" style="margin: 0 10px;"></i>' +
                                '<a class="newLink newLink_active" data-act="atividades-call" data-fn="toggleInfoBox" data-target=".appealCommentBoxText" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0;"><i class="far fa-comment-alt cinzaColor"></i> <span>Recurso apresentado</span></a>' +
                                '<div class="appealCommentBoxText">' +
                                '    <textarea style="background-color:#f5f5f5" class="justificativa_avaliado" name="justificativa_avaliado" disabled>' + justificativa_avaliado + '</textarea>' +
                                '    <span class="countLimit">' + textAnalise + '</span>' +
                                '</div>';
                            $('#ratingPlano').find('.moreCommentBoxDiv').addClass('tabelaPanelScroll').css({ 'pointer-events': 'initial', 'height': '300px' }).append(htmlJustAvaliado);
                            $('#ratingPlano').find('.moreCommentBoxText .countLimit').html(textAvaliacao + '<br>' + textRecurso);
                            $('#ratingPlano').find('.infoEntrega').trigger('click');
                            let justRecurso = $('.appealCommentBoxText textarea.justificativa_avaliado');
                            justRecurso.css('height', justRecurso[0].scrollHeight + 'px');
                        }
                        if (verifyRecurso.status && (verifyRecurso.status.status == 3 || verifyRecurso.status.status == 4)) {
                            var comentarios_avaliacao = jmespath.search(value.avaliacao_plano, "[?id_avaliacao==`" + listRecurso.id_avaliacao + "`] | [0].comentarios");
                            var justificativa_avaliador = listRecurso.justificativa_avaliador;
                            justificativa_avaliador = !justificativa_avaliador && listRecurso.aceito == 1 ? 'ACATADO' : justificativa_avaliador;
                            var statusAceito = listRecurso.aceito == 1 ? '<i class="fas fa-thumbs-up azulColor" style="font-size: 100%;margin:0;"></i> Acatado' : '<i class="fas fa-thumbs-down vermelhoColor" style="font-size: 100%;margin:0;"></i> N\u00E3o acatado';
                            var textRecursoAnalise = 'Recurso analisado em ' + moment(listRecurso.data_analise, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY HH:mm');
                            var htmlJustAvaliador = '<i class="far fa-chevron-right cinzaColor" style="margin: 0 10px;"></i>' +
                                '<a class="newLink newLink_active" data-act="atividades-call" data-fn="toggleInfoBox" data-target=".appealAvaliadorBoxText" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0;"><i class="far fa-comment-alt cinzaColor"></i> <span>An\u00E1lise do Recurso: ' + statusAceito + '</span></a>' +
                                '<div class="appealAvaliadorBoxText">' +
                                '    <textarea style="background-color:#f5f5f5" class="justificativa_avaliador" name="justificativa_avaliador" disabled>' + justificativa_avaliador + '</textarea>' +
                                '    <span class="countLimit">' + textRecursoAnalise + '</span>' +
                                '</div>';
                            $('#ratingPlano').find('.moreCommentBoxDiv').append(htmlJustAvaliador);
                            $('#ratingPlano .moreCommentBoxDiv').find('.moreCommentBoxText textarea').val(comentarios_avaliacao).prop('disabled', true).css({ 'background-color': '#f5f5f5;', 'height': 'auto' });
                            let justAnaliseRecurso = $('.appealAvaliadorBoxText textarea.justificativa_avaliador');
                            justAnaliseRecurso.css('height', justAnaliseRecurso[0].scrollHeight + 'px');
                        }
                        let boxComment = $('#ratingPlano .moreCommentBoxDiv.tabelaPanelScroll');
                        if (typeof boxComment[0] !== 'undefined') boxComment.animate({ scrollTop: boxComment[0].scrollHeight }, 500);
                    }
                },
                close: function () {
                    $('#ratingPlano').remove();
                    resetDialogBoxPro('dialogBoxPro');
                },
                buttons: rateDisable
                    ? btnRecurso
                    : callAtiv('checkCapacidade','rate_plano')
                        ? [{
                            id: 'avaliarBtn',
                            text: 'Avaliar',
                            class: 'confirm',
                            click: function (event) {
                                saveRatingWork(this, false, tipo_avaliacao, indice);
                            }
                        }]
                        : undefined
            });
    }
}
// BOX DE AVALIACAO
export function rateAtividade(id_demanda = 0, omissaoAtividade = false) {
    var value = callAtiv('getAtividadeData',id_demanda);

    if (value.id_atividade == 0 || value.tempo_pactuado == 0 || value.fator_complexidade == 0) {
        callAtiv('variationAtividade',id_demanda, true);
    } else if (!callAtiv('checkLimitAvaliacaoSubordinada',value)) {
        var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;
        var rateDisable = value_avaliacao || (value.id_user == arrayConfigAtividades.perfil.id_user && !callAtiv('checkOptionUnidade','planos', 'permite_autoavaliacao')) ? true : false;
        var htmlBox = '<div id="ratingAtividade" class="ratingWork" data-demanda="' + value.id_demanda + '" data-tempo-decorrido="' + (omissaoAtividade ? callAtiv('getTempoDecorridoAtiv',value, true) : 0) + '">' +
            '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
            (omissaoAtividade
                ? '<tr>' +
                '   <td>' +
                '       <div style="padding: 8px 0;text-align: center;">Qualifique a omiss\u00E3o da demanda de <strong>' + value.apelido + '</strong></div>' +
                '   </td>' +
                '</tr>' +
                '<tr>' +
                '   <td>' +
                '       <table style="font-size: 10pt;width: 100%;">' +
                '           <tbody>' +
                '               <tr>' +
                '                   <td style="text-align: center;">' +
                '                       <div style="padding: 8px 0;">' + value.assunto + '</div>' +
                '                       <div class="txt_cinza" style="padding: 8px 0;">' + value.nome_atividade + '</div>' +
                '                   </td>' +
                '                   <td style="width: 200px;text-align: left;">' +
                '                       <div>' +
                '                           ' + callAtiv('getTagTempoPactuadoAtiv',value) +
                '                       </div>' +
                (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                    '                       <div style="margin: 5px 0 0 5px;">' +
                    '                           ' + callAtiv('getTagTempoDecorridoAtiv',value, false, true) +
                    '                       </div>' +
                    '' : '') +
                '                   </td>' +
                '               </tr>' +
                '           </tbody>' +
                '       </table>' +
                '   </td>' +
                '</tr>'
                : rateAtividadeList(value)) +
            rateAtividadeBoxStars(value) +
            '      <tr style="height: 60px;">' +
            '           <td>' +
            '               <a class="newLink" data-act="atividades-call" data-fn="moreInfoBox" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0; float: right;"><i class="fas fa-info-circle cinzaColor"></i> Informa\u00E7\u00F5es ' + __.da_demanda + '</a>' +
            '           </td>' +
            '      </tr>' +
            '   </table>' +
            '   <div id="boxAtividade" class="seipro-atividades-box">' +
            '       <table style="font-size: 10pt; width: 100%; display: none" class="seiProForm moreInfoBox tableLine tableInfo">' +
            '          <tr style="height: 10px;"><td colspan="2" style="border-bottom: 1px solid #ccc; height: 0px !important;"></td></tr>' +
            '          ' + callAtiv('getInfoAtividade',value) +
            '       </table>' +
            '   </div>' +
            rateAtividadeVinculadasBox(value) +
            '</div>';

        var btnDialogBoxPro = (rateDisable)
            ? []
            : [{
                text: (value.data_avaliacao == '0000-00-00 00:00:00') ? 'Avaliar' : 'Editar',
                class: 'confirm',
                click: function (event) {
                    saveRatingWork(this, omissaoAtividade);
                }
            }];
        if (callAtiv('checkCapacidade','complete_cancel_atividade') && value.data_avaliacao == '0000-00-00 00:00:00' && !omissaoAtividade) {
            btnDialogBoxPro.unshift({
                text: 'Editar Conclus\u00E3o',
                icon: 'ui-icon-check',
                click: function (event) {
                    callAtiv('completeAtividade',id_demanda);
                }
            });
        } else if (callAtiv('checkCapacidade','rate_cancel_atividade') && value.data_avaliacao != '0000-00-00 00:00:00') {
            btnDialogBoxPro.unshift({
                text: (rateDisable ? 'Cancelar Dispensa' : 'Cancelar Avalia\u00E7\u00E3o'),
                icon: 'ui-icon-close',
                click: function (event) {
                    rateCancelAtividade(id_demanda);
                }
            });
        }
        if (callAtiv('checkCapacidade','rate_atividade')) {
            resetDialogBoxPro('dialogBoxPro');
            dialogBoxPro = $('#dialogBoxPro')
                .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                .dialog({
                    title: (value.id_avaliacao == 0) ? 'Avaliar ' + (omissaoAtividade ? 'Omiss\u00E3o da ' : '') + __.Demanda + ': ' + callAtiv('getTitleDialogBox',value) : 'Editar Avalia\u00E7\u00E3o: ' + callAtiv('getTitleDialogBox',value),
                    width: 650,
                    open: function () {
                        if (callAtiv('checkCapacidade','rate_edit_atividade') && value.data_avaliacao != '0000-00-00 00:00:00' && value.id_avaliacao != 0) {
                            $('#ratingAtividade').find('.ratingStars .iconStarAtiv[data-nota="' + value_avaliacao.nota_atribuida + '"]').trigger('click');
                            $.each(value_avaliacao.justificativas, function (i, v) {
                                $('#ratingAtividade .ratingReason').find('.ratingWhy .answer[data-index="' + v.id_tipo_justificativa + '"]').trigger('click');
                            });
                            if (value_avaliacao.comentarios != '') {
                                $('#ratingAtividade .moreCommentBoxDiv').find('.moreCommentBoxText textarea').val(value_avaliacao.comentarios);
                                if ($('#ratingAtividade .moreCommentBoxText textarea').is(':hidden')) $('#ratingAtividade .moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
                            }
                        }
                        if (callAtiv('checkOptionEntidade','limitar_avaliacao_maxima') && !callAtiv('checkOptionEntidade','desativa_produtividade_geral') && (callAtiv('getInfoAtividadeProdutividade_calc',value, 'num', 'despendido') < 1 || callAtiv('getInfoAtividadeProdutividade_calc',value, 'num', 'executado') < 1)) {
                            var notaMaxima = jmespath.search(arrayConfigAtividades.avaliacao, "[*].nota_atribuida");
                            notaMaxima = notaMaxima !== null ? arrayMax(notaMaxima) : 10;
                            $('#ratingAtividade')
                                .find('.ratingStars')
                                .after('<span style="background: #f9efad;font-size: 9pt;padding: 5px;border-radius: 5px;color: #666;"><i class="fas fa-info-circle laranjaColor" style="float: initial;font-size: 10pt;margin: 0 5px;"></i> Nota ' + notaMaxima + ' indispon\u00EDvel para produtividades abaixo de 100%</span>')
                                .find('.iconStarAtiv[data-nota="' + notaMaxima + '"]').css({ 'pointer-events': 'none', 'opacity': '0.5' })
                                .removeAttr('onclick')
                                .removeAttr('onmouseover')
                                .removeAttr('onmouseout')
                                .find('i').attr('class', 'far fa-star cinzaColor');
                        }
                        if (omissaoAtividade) {
                            $('#ratingAtividade').find('.ratingStars .iconStarAtiv[data-nota="0"]').trigger('click');
                            $('#ratingAtividade').find('.ratingWhy .answer[data-index="4"]').trigger('click');
                            $('#ratingAtividade').find('.ratingReason, .ratingStars').css({ 'pointer-events': 'none', 'opacity': '0.5' });
                            if ($('#ratingAtividade .moreCommentBoxText textarea').is(':hidden')) $('#ratingAtividade .moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
                            $('#ratingAtividade .moreCommentBoxText textarea').focus();
                            centralizeDialogBox(dialogBoxPro);
                        }
                        callAtiv('getAtividadeTagsPro',);
                        callAtiv('updateServerTemposDemanda','set', 'tempo_executado', value);
                        callAtiv('updateServerTemposDemanda','set', 'tempo_planejado', value);
                    },
                    close: function () {
                        $('#ratingAtividade').remove();
                        callAtiv('cancelMoveKanbanItens',);
                        callAtiv('cancelSelectedItensAtiv',id_demanda);
                        resetDialogBoxPro('dialogBoxPro');
                    },
                    buttons: btnDialogBoxPro
                });
        }
    }
}
export function arrayRateAtividadeLote(list, rateMax = true) {
    var arrayRateAtiv = [];
    var ativList = '';
    var boxStars = '';
    if (typeof list !== 'undefined' && list !== null && list.length > 0) {
        $.each(list, function (i, v) {
            var value = callAtiv('getAtividadeData',v.id);
            var value_avaliacao = value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false;
            var rateDisable = value_avaliacao || (value.id_user == arrayConfigAtividades.perfil.id_user) ? true : false;
            if (!callAtiv('checkLimitAvaliacaoSubordinada',value) && value.data_avaliacao == '0000-00-00 00:00:00' && value.id_atividade != 0 && value.tempo_pactuado != 0 && value.fator_complexidade != 0 && !rateDisable) {
                if (
                    !rateMax ||
                    (rateMax && callAtiv('checkOptionEntidade','limitar_avaliacao_maxima') && !callAtiv('checkOptionEntidade','desativa_produtividade_geral') ||
                        (parseFloat(callAtiv('getInfoAtividadeProdutividade_calc',value, 'num', 'despendido')) >= 1 && parseFloat(callAtiv('getInfoAtividadeProdutividade_calc',value, 'num', 'executado')) >= 1)
                    )
                ) {
                    ativList += rateAtividadeList(value);
                    boxStars = rateAtividadeBoxStars(value);
                    arrayRateAtiv.push(value);
                }
            }
        });
    }
    return { array: arrayRateAtiv, list: ativList, box: boxStars };
}
export function rateAtividadeLote(list, rateMax = false) {
    if (!delayCrash) {
        delayCrash = true;
        setTimeout(function () { delayCrash = false }, 6000);

        var flist = arrayRateAtividadeLote(list, rateMax);
        var arrayRateAtiv = flist.array;
        var ativList = flist.list;
        var boxStars = flist.box;

        if (arrayRateAtiv.length > 0) {
            var htmlBox = '<div id="ratingAtividade" class="ratingWork" data-demanda="0">' +
                '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                '      <tr style="text-align: center;">' +
                '           <td>' +
                '               <div style="height: 300px;overflow-y: scroll;">' +
                '                   <table style="font-size: 10pt;width: 100%;" class="seiProForm">' +
                ativList +
                '                   </table>' +
                '               </div>' +
                '           </td>' +
                '      </tr>' +
                boxStars +
                '   </table>' +
                '</div>';

            if (callAtiv('checkCapacidade','rate_atividades')) {

                var btnDialogBoxPro = [{
                    id: 'avaliarBtn',
                    text: 'Avaliar',
                    class: 'confirm',
                    click: function (event) {
                        saveRatingWorkLote(this, arrayRateAtiv);
                    }
                }];

                if (callAtiv('checkCapacidade','complete_cancel_atividades')) {
                    btnDialogBoxPro.unshift({
                        text: 'Cancelar Conclus\u00E3o',
                        icon: 'ui-icon-close',
                        click: function (event) {
                            $('#ratingAtividade').remove();
                            resetDialogBoxPro('dialogBoxPro');
                            completeCancelAtividadeLote(arrayRateAtiv);
                        }
                    });
                }

                resetDialogBoxPro('dialogBoxPro');
                dialogBoxPro = $('#dialogBoxPro')
                    .html('<div class="dialogBoxDiv">' + htmlBox + '</div>')
                    .dialog({
                        title: 'Avaliar ' + __.Demandas + ' em Lote (' + arrayRateAtiv.length + ')',
                        width: 650,
                        open: function () {
                            if (!rateMax && callAtiv('checkOptionEntidade','limitar_avaliacao_maxima')) {
                                var notaMaxima = jmespath.search(arrayConfigAtividades.avaliacao, "[*].nota_atribuida");
                                notaMaxima = notaMaxima !== null ? arrayMax(notaMaxima) : 10;
                                $('#ratingAtividade')
                                    .find('.ratingStars')
                                    .after('<span style="background: #f9efad;font-size: 9pt;padding: 5px;border-radius: 5px;color: #666;"><i class="fas fa-info-circle laranjaColor" style="float: initial;font-size: 10pt;margin: 0 5px;"></i> Nota ' + notaMaxima + ' indispon\u00EDvel para produtividades abaixo de 100%</span>')
                                    .find('.iconStarAtiv[data-nota="' + notaMaxima + '"]').css({ 'pointer-events': 'none', 'opacity': '0.5' })
                                    .removeAttr('onclick')
                                    .removeAttr('onmouseover')
                                    .removeAttr('onmouseout')
                                    .find('i').attr('class', 'far fa-star cinzaColor');
                            }
                        },
                        close: function () {
                            $('#ratingAtividade').remove();
                            resetDialogBoxPro('dialogBoxPro');
                        },
                        buttons: btnDialogBoxPro
                    });
            }
        } else {
            rateAtividadeLote(list, false);
        }
    }
}
export function rateAtividadeVinculadasBox(value) {
    var listAtividadesVinculadas = callAtiv('getAtividadesVinculadas',value, 'avaliadas');
    var html = (listAtividadesVinculadas.length_check > 0 ?
        '   <table style="font-size: 10pt; width: 100%; margin: 10px 0;" class="seiProForm">' +
        '      <tr style="height: 40px;">' +
        '          <td style="vertical-align: bottom; text-align: left;" class="label">' +
        '               ' + listAtividadesVinculadas.input +
        '               <label for="rate_others"><i class="iconPopup iconSwitch fas fa-star cinzaColor"></i> ' + (listAtividadesVinculadas.length_check > 1 ? 'Avaliar ' + getNameGenre('demanda', 'os outros', 'as outras') + ' ' + listAtividadesVinculadas.length_check + ' ' + __.demandas + ' ' + getNameGenre('demanda', 'vinculados', 'vinculadas') : 'Avaliar ' + __.a_outra_demanda_vinculada) + '?</label>' +
        '          </td>' +
        '          <td style="width: 50px;">' +
        '              <div class="onoffswitch" style="float: right;">' +
        '                  <input type="checkbox" name="onoffswitch" data-target="#listRateOtherAtiv" data-act="atividades-call" data-fn="changeOthersAtiv" class="onoffswitch-checkbox singleOptionConfig" id="rate_others" data-key="rate_others" tabindex="0" checked>' +
        '                  <label class="onoff-switch-label" for="rate_others"></label>' +
        '              </div>' +
        '          </td>' +
        '      </tr>' +
        '      <tr style="height: auto;">' +
        '          <td colspan="2">' +
        '               ' + listAtividadesVinculadas.html +
        '          </td>' +
        '      </tr>' +
        '   </table>' +
        '' : '');
    return html;
}
export function rateAtividadeBoxStars(value, tipo_avaliacao = 1, indice = false, readOnly = false) {
    var starsArray = typeof arrayConfigAtividades.avaliacao !== 'undefined' && arrayConfigAtividades.avaliacao.length > 0 ? jmespath.search(arrayConfigAtividades.avaliacao, "[?tipo_avaliacao==`" + tipo_avaliacao + "`].{nota_atribuida: nota_atribuida, id_tipo_avaliacao: id_tipo_avaliacao, nome_avaliacao: nome_avaliacao, aceita_entrega: aceita_entrega, exige_justificativa: exige_justificativa, pergunta: pergunta, tipo_execucao: tipo_execucao, nome_tipo_execucao: nome_tipo_execucao, color: config.colortags.colortag, icon: config.colortags.icontag, textcolor: config.colortags.textcolor}") : [];
    starsArray = starsArray.length ? starsArray : jmespath.search(arrayConfigAtividades.avaliacao, "[*].{nota_atribuida: nota_atribuida, id_tipo_avaliacao: id_tipo_avaliacao, nome_avaliacao: nome_avaliacao, aceita_entrega: aceita_entrega, exige_justificativa: exige_justificativa, pergunta: pergunta, tipo_execucao: tipo_execucao, nome_tipo_execucao: nome_tipo_execucao, color: config.colortags.colortag, icon: config.colortags.icontag, textcolor: config.colortags.textcolor}");
    var starsHtml = '';
    var value_avaliacao = tipo_avaliacao == 1
        ? value.data_avaliacao != '0000-00-00 00:00:00' && value.avaliacao && value.avaliacao != 0 && value.avaliacao.length ? jmespath.search(value.avaliacao, "reverse(sort_by([*],&data_avaliacao)) | [0]") : false
        : jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`] | [0]");
    if (value_avaliacao && value_avaliacao !== null && value_avaliacao != 0 && value_avaliacao.nota_atribuida === false) {
        starsHtml += '<a class="newLink iconStarAtiv" style="font-size: 12pt; cursor: pointer;"><i class="fas fa-star-half-alt cinzaColor"></i> <span style="font-size: 11pt;">Avalia\u00E7\u00E3o Dispensada</span></a>';
    } else if (!readOnly && value.id_user == arrayConfigAtividades.perfil.id_user && !callAtiv('checkOptionUnidade','planos', 'permite_autoavaliacao')) {
        starsHtml += '<a class="newLink iconStarAtiv" style="font-size: 12pt; cursor: pointer;"><i class="fas fa-star-half-alt cinzaColor"></i> <span style="font-size: 11pt;">Auto Avalia\u00E7\u00E3o Indispon\u00EDvel</span></a>';
    } else {
        var arrayStars = removeDuplicatesArray(starsArray, 'nota_atribuida');
        arrayStars = arrayStars.sort((a, b) => a.nota_atribuida - b.nota_atribuida);
        $.each(arrayStars, function (index, v) {
            starsHtml += '<a class="newLink iconStarAtiv" data-index="' + v.id_tipo_avaliacao + '" data-readonly="' + readOnly + '" data-nota="' + v.nota_atribuida + '" data-tipo_avaliacao="' + tipo_avaliacao + '" data-pergunta="' + v.pergunta + '" data-tipo_execucao="' + v.tipo_execucao + '" data-nome_tipo_execucao="' + v.nome_tipo_execucao + '" data-nome="' + v.nome_avaliacao + '" data-aceita-entrega="' + v.aceita_entrega + '" data-exige-justificativa="' + v.exige_justificativa + '" data-color="' + v.color + '" data-icon="' + v.icon + '" data-act="atividades-call" data-fn="onStarAtiv" data-arg="click" data-hover-fn="onStarAtiv" data-hover-arg="over" data-hover-out-arg="out" style="font-size: 12pt; cursor: pointer;"><i data-nota="' + v.nota_atribuida + '"  class="fas fa-star cinzaColor"></i></a>';
        });
    }
    var html = '      <tr style="height: 40px; text-align: center;">' +
        '           <td>' +
        '               <div class="ratingStars">' +
        '                   ' + starsHtml +
        '               </div>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="text-align: center;">' +
        '           <td>' +
        '               <div class="ratingReason"></div>' +
        '           </td>' +
        '      </tr>' +
        '      <tr style="text-align: center;">' +
        '           <td>' +
        '               <div class="moreCommentBoxDiv" style="display:none; text-align: center;">' +
        '                   <a class="newLink moreCommentBox" data-act="atividades-call" data-fn="moreCommentBox" data-target=".moreCommentBoxText" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0;"><i class="far fa-comment-alt cinzaColor"></i> <span>Coment\u00E1rios adicionais?</span></a>' +
        '                   <div class="moreCommentBoxText" style="display:none;">' +
        '                       <textarea maxlength="500" data-act="atividades-composite" data-chain="checkLimitText|updateButtonTextarea" data-on="input" name="moreCommentBoxText"></textarea>' +
        '                       <span class="countLimit"></span>' +
        '                   </div>' +
        '               </div>' +
        '           </td>' +
        '      </tr>';
    return html;
}
export function rateAtividadeList(value, tipo_avaliacao = 1, indice) {
    if (tipo_avaliacao == 1) {
        var documento = (typeof value.documento_sei !== 'undefined' && value.documento_sei !== null && parseInt(value.documento_sei) != 0) ? value.nome_documento + ' (' + value.documento_sei + ')' : value.nome_documento;
        documento = (documento === null) ? false : documento;
        var obs_tecnica = (typeof value.observacao_tecnica !== 'undefined' && value.observacao_tecnica !== null && value.observacao_tecnica != '')
            ? '<div class="fa-border" style="padding: 10px; margin: 15px; font-style: italic; color: #505050;"><i class="fas fa-quote-left fa-2x fa-pull-left cinzaColor" style="margin-right: 10px;"></i> ' + replaceTextToProcessoSEI(replaceTextToUrl(value.observacao_tecnica)) + '</div>'
            : '';
        var modalDocEntrega = (documento) ? atividadesDialogDocAttrs({
            title: documento,
            id_procedimento: value.id_procedimento,
            id_documento: value.id_documento_entregue
        }) : '';

        var html = '      <tr style="height: 40px; text-align: center;">' +
            '          <td colspan="2">Como foi a entrega ' + __.da_demanda + ' de <strong>' + value.apelido + '</strong>?</td>' +
            '      </tr>' +
            '      <tr style="height: 40px; text-align: center;">' +
            '          <td>' +
            '               <table style="font-size: 10pt;width: 100%;">' +
            '                   <tr>' +
            '                       <td style="text-align: center;">' +
            (value.id_procedimento == 0 || value.id_documento == 0 ?
                '                           <a class="newLink bLink" style="text-decoration: none;">' +
                '                               <i class="fas fa-file-signature azulColor" style="padding-right: 5px;"></i>' + (documento ? documento : '-') +
                '                           </a>' :
                '                           <a class="newLink bLink" style="text-decoration: underline; cursor: pointer;" ' + modalDocEntrega + ' data-tip="Visualiza\u00E7\u00E3o r\u00E1pida">' +
                '                               <i class="fas fa-file-signature azulColor" style="padding-right: 5px;"></i>' + (documento ? documento : '-') +
                '                               <i class="fas fa-eye bLink" style="font-size: 80%;vertical-align: top;margin-left: 5px;"></i>' +
                '                           </a>' +
                '') +
            '                       </td>' +
            '                       <td style="width: 220px;text-align: left;">' +
            (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '                           <div id="ativ_produtividade" style="margin: 5px 0;">' + callAtiv('getInfoAtividadeProdutividade',value, true, 'despendido') + '</div>' +
                '                           <div id="ativ_produtividade_executada" style="margin: 5px 0;">' + callAtiv('getInfoAtividadeProdutividade',value, true, 'executado') + '</div>' +
                '' : '') +
            '                           <div style="margin: 15px 0 0 0;">' + callAtiv('getTagTempoPactuadoAtiv',value) + '</div>' +
            (!callAtiv('checkOptionEntidade','desativa_produtividade_geral') ?
                '                           <div style="margin: 5px 0 0 5px;">' + callAtiv('getTagTempoDespendidoAtiv',value, false) + '</div>' +
                '' : '') +
            (callAtiv('checkCapacidade','variation_atividade') ?
                '                           <span class="info_dates_extend" style="margin-top: 10px;display: block;">' +
                '                               <a class="newLink dateExtend" data-act="atividades-call" data-fn="variationAtividade" data-pass-el="0" data-id="' + value.id_demanda + '" style="font-size: 9pt;cursor: pointer;">' +
                '                                  <i class="fas fa-' + (value.tempo_pactuado == 0 ? 'clipboard-list' : 'graduation-cap') + ' azulColor" style="padding-right: 3px;"></i>' +
                '                                  Alterar ' + __.Complexidade + (callAtiv('checkCapacidade','type_atividade') ? ' e ' + __.atividade : '') +
                '                               </a>' +
                '                           </span>' +
                '' : '') +
            '                       </td>' +
            '                   <tr>' +
            '                       <td colspan="2">' +
            '                       ' + obs_tecnica +
            '                       </td>' +
            '                   </tr>' +
            '               </table>' +
            '          </td>' +
            '      </tr>';
    } else if (tipo_avaliacao == 2) {
        let entregas = (typeof value.entregas !== 'undefined' && value.entregas !== null) ? jmespath.search(value.entregas, "[?indice_mes_entrega==`" + indice + "`]") : false;
        let calcTempo = callAtiv('tempoProporcionalTabEntregasPlanos',value, indice);

        // console.log(calcTempo);

        let entrega_inicio_vigencia = calcTempo.entrega_inicio_vigencia.format('DD/MM/YYYY');
        let entrega_fim_vigencia = calcTempo.entrega_fim_vigencia.format('DD/MM/YYYY');
        let tempo_proporcional = calcTempo.tempo_proporcional;
        let total_execucao = entregas ? jmespath.search(entregas, "[*].execucao.horas_entrega").reduce(function (a, b) { return a + b; }, 0) : 0;
        let media_execucao = total_execucao > 0 ? (total_execucao / tempo_proporcional) * 100 : 0;
        media_execucao = tempo_proporcional == 0 ? 100 : media_execucao;
        var html = '      <tr style="height: 40px; text-align: center;">' +
            '          <td colspan="2">Como foi a execu\u00E7\u00E3o do plano de trabalho de <strong>' + value.apelido + '</strong>?</td>' +
            '      </tr>' +
            '      <tr style="text-align: center;">' +
            '          <td>' +
            '               <div style="text-align: center;margin-bottom: 20px;">' +
            '                   Per\u00EDodo: ' + entrega_inicio_vigencia + ' \u00E0 ' + entrega_fim_vigencia + ' / Meta: ' + tempo_proporcional + ' horas / Execu\u00E7\u00E3o: ' + media_execucao.toFixed(2) + ' %' +
            '                   <a class="newLink newLink_active infoEntrega" data-act="atividades-call" data-fn="toggleInfoBox" data-target=".infoBoxEntrega" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0; float: right;"><i class="fas fa-info-circle cinzaColor"></i> Informa\u00E7\u00F5es da entrega</a>' +
            '               </div>' +
            '               <div class="infoBoxEntrega">' +
            '                   <div class="tabelaPanelScroll">' +
            callAtiv('htmlOptionsTabEntregasPlanos',{
                entrega_inicio_vigencia: calcTempo.entrega_inicio_vigencia.format('YYYY-MM-DD HH:mm:ss'),
                entrega_fim_vigencia: calcTempo.entrega_fim_vigencia.format('YYYY-MM-DD HH:mm:ss'),
                tempo_proporcional: tempo_proporcional,
                media_execucao: media_execucao,
                entregas: entregas,
                indice: indice,
                edit: false,
                avalia_entrega: true,
                value: value
            }) +
            '                   </div>' +
            '               </div>' +
            '          </td>' +
            '      </tr>';
    } else if (tipo_avaliacao == 3) {
        var programa_inicio_vigencia = moment(value.data_inicio_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
        var programa_fim_vigencia = moment(value.data_fim_vigencia, 'YYYY-MM-DD HH:mm:ss').format('DD/MM/YYYY');
        var entregas = (value.entregas !== null && typeof value.entregas !== 'undefined') ? value.entregas : false;
        var html = '      <tr style="height: 40px; text-align: center;">' +
            '          <td colspan="2">Como foi a execu\u00E7\u00E3o do ' + __.programa + ' de <strong>' + value.nome_sigla + '</strong>?</td>' +
            '      </tr>' +
            '      <tr style="text-align: center;">' +
            '          <td>' +
            '               <div style="text-align: center;margin-bottom: 20px;">' +
            '                   Per\u00EDodo: ' + programa_inicio_vigencia + ' \u00E0 ' + programa_fim_vigencia +
            '                   <a class="newLink newLink_active infoEntrega" data-act="atividades-call" data-fn="toggleInfoBox" data-target=".infoBoxEntrega" style="font-size: 10pt; cursor: pointer; margin: 5px 0 0 0; float: right;"><i class="fas fa-info-circle cinzaColor"></i> Informa\u00E7\u00F5es da entrega</a>' +
            '               </div>' +
            '               <div class="infoBoxEntrega">' +
            '                   <div class="tabelaPanelScroll">' +
            callAtiv('htmlOptionsTabEntregasProgramas',{
                value: value,
                entregas: entregas
            }) +
            '                   </div>' +
            '               </div>' +
            '          </td>' +
            '      </tr>';
    }
    return html;
}
export function completeCancelAtividadeLote(list) {
    if (callAtiv('checkCapacidade','complete_cancel_atividades')) {
        setTimeout(() => {
            confirmaFraseBoxPro(__.As_demandas + ' j\u00E1 foram entregues. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
                var action = 'complete_cancel_atividades';
                if (typeof list !== 'undefined' && list !== null && list.length > 0) {
                    var ids = list.map(function (v) { return { id_demanda: v.id_demanda, id_unidade: v.id_unidade } });
                    var param = { action: action, ids: ids };
                    getServerAtividades(param, action);
                }
            }, function () {
                $.each(list, function (i, value) {
                    callAtiv('cancelSelectedItensAtiv',value.id_demanda);
                });
            });
        }, 500);
    }
}
export function rateCancelAtividadeLote(list) {
    if (callAtiv('checkCapacidade','rate_cancel_atividades')) {
        setTimeout(() => {
            confirmaFraseBoxPro(__.As_demandas + ' j\u00E1 foram ' + getNameGenre('demandas', 'avaliados', 'avaliadas') + '. Tem certeza que deseja cancelar?', 'CANCELAR', function () {
                var action = 'rate_cancel_atividades';
                var ids = [];
                if (typeof list !== 'undefined' && list !== null && list.length > 0) {
                    $.each(list, function (i, v) {
                        var value = callAtiv('getAtividadeData',v.id);
                        ids.push({
                            id_avaliacao: value.id_avaliacao,
                            id_demanda: value.id_demanda
                        });
                    });
                    var param = { action: action, ids: ids };
                    getServerAtividades(param, action);
                }
            }, function () {
                $.each(list, function (i, value) {
                    callAtiv('cancelSelectedItensAtiv',value.id_demanda);
                });
            });
        }, 500);
    }
}
export function rateCancelAtividade(id, tipo_avaliacao = 1, indice = false) {
    var value = tipo_avaliacao == 1 ? callAtiv('getAtividadeData',id) : false;
    value = tipo_avaliacao == 2 ? callAtiv('getPlanoData',id) : value;
    value = tipo_avaliacao == 3 ? callAtiv('getProgramaData',id) : value;

    var label = tipo_avaliacao == 1 ? __.A_demanda + ' j\u00E1 foi ' + getNameGenre('demanda', 'avaliado', 'avaliada') : '';
    label = tipo_avaliacao == 2 ? 'O plano j\u00E1 foi avaliado' : label;
    label = tipo_avaliacao == 3 ? __.o_programa + ' j\u00E1 foi ' + getNameGenre('programa', 'avaliado', 'avaliada') : label;

    var type = tipo_avaliacao == 1 ? 'demandas' : '';
    type = tipo_avaliacao == 2 ? 'planos' : type;
    type = tipo_avaliacao == 3 ? 'programas' : type;

    var id_avaliacao = tipo_avaliacao == 1 ? value.id_avaliacao : false;
    id_avaliacao = tipo_avaliacao == 2 ? jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`] | [0].id_avaliacao") : id_avaliacao;
    id_avaliacao = tipo_avaliacao == 3 ? jmespath.search(value.avaliacao_programa, "[0].id_avaliacao") : id_avaliacao;

    var indice_mes_entrega = tipo_avaliacao == 2 ? indice : false;

    if (callAtiv('checkCapacidade','rate_cancel_atividade') || callAtiv('checkCapacidade','rate_cancel_plano') || callAtiv('checkCapacidade','rate_cancel_programa')) {
        confirmaFraseBoxPro(label + '. Tem certeza que deseja cancelar?', 'CANCELAR', function () {

            var action = tipo_avaliacao == 1 ? 'rate_cancel_atividade' : false;
            action = tipo_avaliacao == 2 ? 'rate_cancel_plano' : action;
            action = tipo_avaliacao == 3 ? 'rate_cancel_programa' : action;

            var param = {
                action: action,
                type: type,
                id_demanda: tipo_avaliacao == 1 ? id : false,
                id_plano: tipo_avaliacao == 2 ? id : false,
                id_programa: tipo_avaliacao == 3 ? id : false,
                indice_mes_entrega: indice_mes_entrega,
                id: id,
                tipo_avaliacao: tipo_avaliacao,
                id_avaliacao: id_avaliacao
            };
            getServerAtividades(param, action);
        }, function () {
            if (tipo_avaliacao == 1) {
                callAtiv('cancelMoveKanbanItens',);
                callAtiv('cancelSelectedItensAtiv',id);
            }
        });
    }
}
// SALVA AVALIACAO
export function saveRatingWork(this_, omissaoAtividade = false, tipo_avaliacao = 1, indice = 1, id_avaliacao_recurso = false) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var data = _this.find('.ratingWork').data();
    var value = tipo_avaliacao == 1 ? callAtiv('getAtividadeData',data.demanda) : false;
    value = tipo_avaliacao == 2 ? callAtiv('getPlanoData',data.plano) : value;
    value = tipo_avaliacao == 3 ? callAtiv('getProgramaData',data.programa) : value;

    var listAtividadesVinculadas = tipo_avaliacao == 1 ? callAtiv('getAtividadesVinculadas',value, 'avaliadas') : false;
    var comentarios = _this.find('.moreCommentBoxText textarea').val();
    var id_demandas_rate = (listAtividadesVinculadas && listAtividadesVinculadas.length_check > 0 && _parent.find('#rate_others').is(':checked'))
        ? JSON.parse(_parent.find('#lista_rate_others').val())
        : [];

    var id_avaliacao = tipo_avaliacao == 1 ? value.id_avaliacao : false;
    id_avaliacao = tipo_avaliacao == 2 ? jmespath.search(value.avaliacao_plano, "[?indice_mes_entrega==`" + indice + "`] | [0].id_avaliacao") : id_avaliacao;
    id_avaliacao = id_avaliacao_recurso ? 0 : id_avaliacao;

    var indice_mes_entrega = tipo_avaliacao == 2 ? indice : false;

    var action = (id_avaliacao > 0) ? 'rate_edit_atividade' : 'rate_atividade';
    action = tipo_avaliacao == 2 ? 'rate_plano' : action;
    action = tipo_avaliacao == 3 ? 'rate_programa' : action;

    var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0].id_plano");
    id_plano = (id_plano === null) ? 0 : id_plano;
    id_plano = tipo_avaliacao == 2 ? data.plano : id_plano;

    var id_programa = tipo_avaliacao == 3 && typeof data.programa !== 'undefined' ? data.programa : false;

    var tempo_despendido = (data.notaSelected == 0 && data.tempoDecorrido > 0) ? data.tempoDecorrido : value.tempo_despendido;
    tempo_despendido = tipo_avaliacao == 2 ? false : tempo_despendido;

    var type = tipo_avaliacao == 1 ? 'demandas' : '';
    type = tipo_avaliacao == 2 ? 'planos' : type;
    type = tipo_avaliacao == 3 ? 'programas' : type;

    var id = tipo_avaliacao == 1 ? data.demanda : false;
    id = tipo_avaliacao == 2 ? id_plano : id;
    id = tipo_avaliacao == 3 ? id_programa : id;

    var data_fim_recurso = false;

    if (callAtiv('checkOptionEntidade','recurso_avaliacao_planos') && callAtiv('checkOptionEntidade','prazo_apresentacao_recurso')) {
        var prazo_recurso = callAtiv('getOptionEntidade','prazo_apresentacao_recurso');
        if (!callAtiv('checkOptionEntidade','contagem_dias_recurso') || callAtiv('getOptionEntidade','contagem_dias_recurso') == 'uteis') {
            var arrayFeriados = typeof arrayConfigAtivUnidade !== 'undefined' && typeof arrayConfigAtivUnidade.config !== 'undefined' && typeof arrayConfigAtivUnidade.config.feriados !== 'undefined'
                ? jmespath.search(getHolidayBetweenDates(moment().format('YYYY-MM-DD'), moment().addWorkdays(prazo_recurso).format('YYYY-MM-DD'), arrayConfigAtivUnidade.config.feriados), "[*].d_")
                : [];
            data_fim_recurso = moment().addWorkdays(prazo_recurso, arrayFeriados).format('YYYY-MM-DD') + ' 23:59:59';
        } else if (callAtiv('getOptionEntidade','contagem_dias_recurso') == 'corridos') {
            data_fim_recurso = moment().add(prazo_recurso, 'day').format('YYYY-MM-DD') + ' 23:59:59';
        }
    }

    var entregas = tipo_avaliacao == 2 ? getListEntregasAvaliacao() : false;
    var id_user = value.id_user;
    id_user = tipo_avaliacao == 3 ? arrayConfigAtividades.perfil.id_user : id_user;

    var param = {
        action: action,
        id_user: id_user,
        id_plano: id_plano,
        id_programa: id_programa,
        id: id,
        indice_mes_entrega: indice_mes_entrega,
        entregas: entregas,
        type: type,
        id_demandas_rate: id_demandas_rate,
        id_avaliacao: (id_avaliacao ? id_avaliacao : 0),
        tempo_despendido: tempo_despendido,
        tempo_pactuado: value.tempo_pactuado,
        tipo_avaliacao: tipo_avaliacao,
        id_demanda: data.demanda,
        id_tipo_avaliacao: data.indexSelected,
        nota_atribuida: data.notaSelected,
        aceita_entrega: data.aceitaEntrega,
        comentarios: comentarios,
        avaliacao_justificativa: data.whySelected,
        omissao_atividade: omissaoAtividade,
        id_avaliacao_recurso: id_avaliacao_recurso,
        data_fim_recurso: data_fim_recurso,
        data_avaliacao: moment().format('YYYY-MM-DD HH:mm:ss')
    }
    if (typeof data.notaSelected === 'undefined') {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma nota de avalia\u00E7\u00E3o.');
    } else if (data.tipo_execucao == 2 && tipo_avaliacao == 2 && !checkListEntregasAvaliacao()) {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione ao menos uma entrega com resultado de avalia\u00E7\u00E3o como: Inexecu\u00E7\u00E3o ou Execu\u00E7\u00E3o Parcial.');
    } else if (typeof data.exigeJustificativa !== 'undefined' && data.exigeJustificativa == 1 && comentarios == '') {
        if (_this.find('.moreCommentBoxText textarea').is(':hidden')) { _this.find('.moreCommentBox').trigger('click') }
        alertaBoxPro('Error', 'exclamation-triangle', 'A sele\u00E7\u00E3o desta nota exige uma justificativa adicional.', function () { $('.moreCommentBoxText textarea').focus() });
    } else if (typeof data.notaSelected !== 'undefined' &&
        (
            ((typeof data.whySelected !== 'undefined' && data.whySelected.length > 0) || comentarios != '') ||
            tipo_avaliacao == 3
        )
    ) {
        getServerAtividades(param, action);
    } else {
        if (_this.find('.moreCommentBoxText textarea').is(':hidden')) { _this.find('.moreCommentBox').trigger('click') }
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione ao menos uma motiva\u00E7\u00E3o ou adicione um coment\u00E1rio \u00E0 avalia\u00E7\u00E3o.');
    }
}
export function saveRatingWorkLote(this_, arrayRateAtiv) {
    var _this = $(this_);
    var _parent = _this.closest('.ui-dialog');
    var data = _this.find('.ratingWork').data();
    var comentarios = _this.find('.moreCommentBoxText textarea').val();
    var action = 'rate_atividades';
    var ids = [];
    $.each(arrayRateAtiv, function (index, value) {
        var id_plano = jmespath.search(arrayConfigAtividades.planos, "[?id_user==`" + value.id_user + "`] | [0].id_plano");
        id_plano = (id_plano === null) ? 0 : id_plano;
        id_plano = !callAtiv('checkCapacidade','check_entregas_atividades') || value.id_plano == 0 ? id_plano : value.id_plano;
        ids.push({
            id_user: value.id_user,
            id_plano: id_plano,
            id_avaliacao: value.id_avaliacao,
            tempo_despendido: (data.notaSelected == 0 && data.tempoDecorrido > 0) ? data.tempoDecorrido : value.tempo_despendido,
            tempo_pactuado: value.tempo_pactuado,
            id_demanda: value.id_demanda,
            id_tipo_avaliacao: data.indexSelected,
            nota_atribuida: data.notaSelected,
            aceita_entrega: data.aceitaEntrega,
            comentarios: comentarios,
            avaliacao_justificativa: data.whySelected,
            data_avaliacao: moment().format('YYYY-MM-DD HH:mm:ss')
        });
    });

    var param = {
        action: action,
        ids: ids
    }
    if (typeof data.notaSelected !== 'undefined' && ((typeof data.whySelected !== 'undefined' && data.whySelected.length > 0) || comentarios != '')) {
        getServerAtividades(param, action);
    } else if (typeof data.notaSelected === 'undefined') {
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione uma nota de avalia\u00E7\u00E3o.');
    } else {
        if (_this.find('.moreCommentBoxText textarea').is(':hidden')) { _this.find('.moreCommentBox').trigger('click') }
        alertaBoxPro('Error', 'exclamation-triangle', 'Selecione ao menos uma motiva\u00E7\u00E3o ou adicione um coment\u00E1rio \u00E0 avalia\u00E7\u00E3o.');
    }
}
export function checkListEntregasAvaliacao() {
    return jmespath.search(getListEntregasAvaliacao(), "[?tipo_execucao==`2` || tipo_execucao==`3`] | length(@)") > 0 ? true : false;
}
export function getListEntregasAvaliacao() {
    let return_ = $('table[data-key="entregas"] tbody tr').map(function (v) {
        let _this = $(this);
        let id_plano_entrega = _this.attr('data-id');
        id_plano_entrega = isNumeric(id_plano_entrega) ? parseInt(id_plano_entrega) : id_plano_entrega;
        let id_plano = _this.attr('data-id_plano');
        id_plano = isNumeric(id_plano) ? parseInt(id_plano) : id_plano;
        let entrega_inicio_vigencia = _this.attr('data-entrega_inicio_vigencia');
        let entrega_fim_vigencia = _this.attr('data-entrega_fim_vigencia');
        let id_entrega = _this.attr('data-id_entrega');
        id_entrega = isNumeric(id_entrega) ? parseInt(id_entrega) : id_entrega;
        let tipo_execucao = _this.attr('data-tipo_execucao');
        tipo_execucao = isNumeric(tipo_execucao) ? parseInt(tipo_execucao) : tipo_execucao;
        let tempo_proporcional_entrega = _this.find('.tempoProporcionalEntrega').text();
        tempo_proporcional_entrega = isNumeric(tempo_proporcional_entrega) ? parseFloat(tempo_proporcional_entrega) : tempo_proporcional_entrega;
        let horas_entrega = _this.find('.horasEntrega').text();
        horas_entrega = isNumeric(horas_entrega) ? parseFloat(horas_entrega) : horas_entrega;
        let horas_homologadas = _this.find('.horasHomologadas').text();
        horas_homologadas = isNumeric(horas_homologadas) ? parseFloat(horas_homologadas) : horas_homologadas;
        let demandas_entrega = _this.find('.demandasEntrega').text();
        demandas_entrega = isNumeric(demandas_entrega) ? parseInt(demandas_entrega) : demandas_entrega;
        let execucao_entrega = _this.find('.execucacaoEntrega').text();
        execucao_entrega = isNumeric(execucao_entrega) ? parseFloat(execucao_entrega) : execucao_entrega;
        let meta_homologada = _this.find('.metaHomologada').text();
        meta_homologada = isNumeric(meta_homologada) ? parseFloat(meta_homologada) : meta_homologada;
        let meta_descumprida = _this.find('.metaDescumprida').text();
        meta_descumprida = isNumeric(meta_descumprida) ? parseFloat(meta_descumprida) : meta_descumprida;
        return {
            id_plano_entrega: id_plano_entrega,
            id_entrega: id_entrega,
            entrega_inicio_vigencia: entrega_inicio_vigencia,
            entrega_fim_vigencia: entrega_fim_vigencia,
            tipo_execucao: tipo_execucao,
            id_plano: id_plano,
            tempo_proporcional_entrega: tempo_proporcional_entrega,
            horas_entrega: horas_entrega,
            horas_homologadas: horas_homologadas,
            demandas_entrega: demandas_entrega,
            execucao_entrega: execucao_entrega,
            meta_homologada: meta_homologada,
            meta_descumprida: meta_descumprida
        }
    }).get();
    return return_;
}
// ACAO AO SELECIONAR UMA NOTA DE AVALIACAO
export function onStarAtiv(this_, mode) {
    var this_ = $(this_);
    let data = this_.data();
    let table = this_.closest('table');
    let td = this_.closest('td');
    let nome_tipo_execucao = data.nome_tipo_execucao;
    let tipo_avaliacao = data.tipo_avaliacao;
    let tipo_execucao = data.tipo_execucao;
    let readonly = data.readonly;

    if (mode == 'over' || mode == 'click') {
        td.find('.iconStarAtiv').each(function () {
            if (parseInt($(this).data('nota')) <= parseInt(data.nota)) {
                $(this).find('i').addClass('starGold');
                if (mode == 'click') {
                    $(this).data('select', true);
                }
            } else {
                if (!$(this).data('select')) {
                    $(this).find('i').removeClass('starGold');
                }
                if (mode == 'click') {
                    $(this)
                        .data('select', false)
                        .find('i')
                        .removeClass('starGold');
                }
            }
        });
        if (mode == 'click') {
            $("#avaliarBtn").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
            updateButtonConfirm(this_, false);
            td.find('.iconStarAtiv i').removeClass('starSelected');
            this_.find('i').addClass('starSelected');
            this_.closest('.ratingWork')
                .data('nota-selected', data.nota)
                .data('index-selected', data.index)
                .data('aceita-entrega', data.aceitaEntrega)
                .data('exige-justificativa', data.exigeJustificativa)
                .data('tipo_execucao', data.tipo_execucao)
                .data('why-selected', []);

            var config = jmespath.search(arrayConfigAtividades.avaliacao, "[?id_tipo_avaliacao==`" + data.index + "`] | [0].config");
            config = config !== null ? config : false;
            var alerta_baixa_produtividade = config && config.alerta_baixa_produtividade ? true : false;
            var porcentagem_alerta_baixa_produtividade = alerta_baixa_produtividade ? config.porcentagem_alerta_baixa_produtividade : false;
            var texto_alerta_baixa_produtividade = alerta_baixa_produtividade ? config.texto_alerta_baixa_produtividade : false;
            var media_execucao = parseFloat($('.configBox_entregas_programa .totalMediaExecucao').text());

            if (alerta_baixa_produtividade && media_execucao < porcentagem_alerta_baixa_produtividade && !readonly) {
                $("#avaliarBtn").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                confirmaFraseBoxPro(texto_alerta_baixa_produtividade, 'DE ACORDO', function () {
                    $("#avaliarBtn").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
                });
            }

            var color = (typeof data.color !== 'undefined' && data.color !== null)
                ? 'color: ' + data.color
                : '';
            var colorBackground = (typeof data.color !== 'undefined' && data.color !== null)
                ? 'background-color: rgb(' + $.map(hexToRgb(data.color), function (e) { return e }).join(" ") + ' / 20%)'
                : ''
            var htmlReason = '<div class="ratingQuestion">' +
                '   <strong class="emoticon" style="' + colorBackground + '">' +
                '       <i class="fas fa-' + data.icon + '" style="padding: 0 5px;font-size: 1.5em; ' + color + '"></i>' +
                '       ' + data.nome +
                '   </strong> ' +
                '   <span>' + data.pergunta + '</span>' +
                '   <span class="ratingVisibility" style="float: right;" data-tip="Motiva\u00E7\u00E3o vis\u00EDvel apenas para os gestores e para o avaliado"><i class="fas fa-eye cinzaColor"></i></span>' +
                '</div>' +
                '<div class="ratingWhy">';

            var arrayJustificativas = (arrayConfigAtividades.avaliacao.length > 0) ? jmespath.search(arrayConfigAtividades.avaliacao, "[?tipo_avaliacao==`" + data.tipo_avaliacao + "`] | [?nota_atribuida==`" + data.nota + "`].{id_tipo_justificativa: id_tipo_justificativa, nome_justificativa: nome_justificativa}") : [];
            arrayJustificativas = arrayJustificativas.length ? arrayJustificativas : jmespath.search(arrayConfigAtividades.avaliacao, "[?nota_atribuida==`" + data.nota + "`].{id_tipo_justificativa: id_tipo_justificativa, nome_justificativa: nome_justificativa}");
            arrayJustificativas = tipo_avaliacao == 3 ? false : arrayJustificativas;
            if (arrayJustificativas) {
                $.each(arrayJustificativas, function (index, value) {
                    htmlReason += '   <span class="answer" data-act="atividades-call" data-fn="onWhyAtiv" data-selected="false" data-index="' + value.id_tipo_justificativa + '">' + value.nome_justificativa + '</span>';
                });
            }
            htmlReason += '</div>';
            table.find('.moreCommentBoxDiv').show();
            table.find('.ratingReason').html(htmlReason);
            if (data.exigeJustificativa == 1) {
                table.find('.moreCommentBox span').text('Justificativa adicional obrigat\u00F3ria');
                if (table.find('.moreCommentBoxText textarea').is(':hidden')) table.find('.moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
                table.find('.moreCommentBoxText textarea').focus();
            } else {
                table.find('.moreCommentBox span').text('Coment\u00E1rios adicionais?');
                if (!table.find('.moreCommentBoxText textarea').is(':hidden')) table.find('.moreCommentBoxDiv').find('.moreCommentBox').trigger('click');
            }
            let tableEntregas = $('table[data-key="entregas"]');
            if (tableEntregas.length && !readonly) {
                window.total_meta_homologada = 0;
                window.total_meta_descumprida = 0;
                window.horas_desconto = 0;
                window.horas_compensacao = 0;
                let idTableEntregas = tableEntregas.attr('id');
                tableEntregas.find('tbody tr').each(function () {
                    $(this).find('td.resultadoAvaliacao').text(nome_tipo_execucao);
                    setMetaHomologadaEntrega(this, tipo_execucao);
                });
                tableEntregas.find('.totalMetaHomologada').text(window.total_meta_homologada.toFixed(2));
                tableEntregas.find('.totalMetaDescumprida').text(window.total_meta_descumprida.toFixed(2));

                var total_horas_homologadas = tableEntregas.find('tbody td.horasHomologadas').map(function () { return parseFloat($(this).text()) }).get().reduce(function (a, b) { return a + b; }, 0);
                tableEntregas.find('.totalHorasHomologadas').text(total_horas_homologadas.toFixed(2));

                $('.infoRateEntregas').remove();

                if (tipo_execucao == 2) {
                    $('#ratingPlano .ratingReason').before('<div class="infoRateEntregas" style="text-align: center;padding: 10px;display: inline-block;background: #f9efad;border-radius: 5px;color: #666;margin: 10px;"><i class="fas fa-info-circle azulColor"></i> Para avaliar individualmente as entregas, altere o resultado da avalia\u00E7\u00E3o na tabela acima.</div>');
                    tableEntregas.find('tbody tr td.resultadoAvaliacao').addClass('editCellSelect').effect('highlight').delay(2).effect('highlight').delay(2).effect('highlight');
                    configBoxAvaliacao = new SimpleTableCellEditor(idTableEntregas);
                    configBoxAvaliacao.SetEditableClass("editCellSelect", {
                        internals: {
                            renderEditor: (elem, oldVal) => {
                                var _this = $(elem);
                                var arrayList = [{ label: 'Execu\u00E7\u00E3o integral', value: 1 }, { label: 'Execu\u00E7\u00E3o parcial', value: 2 }, { label: 'Inexecu\u00E7\u00E3o', value: 3 }];
                                var htmlOptions = $.map(arrayList, function (v) {
                                    var selected = (v.label == _this.text().trim()) ? 'selected' : '';
                                    return "<option value='" + v.value + "' " + selected + ">" + v.label + "</option>";
                                }).join('');
                                _this
                                    .html(`<select data-type="tipo_execucao" data-tipo_execucao="` + tipo_execucao + `" data-act="atividades-call" data-fn="changeSelectExecucaoEntrega" data-on="blur" data-blur-fn="changeSelectConfigItem"><option value=" "></option>` + htmlOptions + '</select>')
                                    .find('select')
                                    .chosen({
                                        placeholder_text_single: ' ',
                                        no_results_text: 'Nenhum resultado encontrado',
                                        normalize_search_text: function (text) {
                                            return removeAcentos(text.toLowerCase());
                                        }
                                    })
                                    .on('chosen:showing_dropdown', function (evt, params) {
                                        let elementScroll = $(this).closest('.tabelaPanelScroll');
                                        setTimeout(() => {
                                            scrollToElement(elementScroll, elementScroll.find('div.chosen-container'), elementScroll.find('.tableHeader').height());
                                        }, 500);
                                    });
                            },
                            renderValue: (elem, formattedNewVal) => {
                                let _this = $(elem);
                                _this.text(formattedNewVal);
                            },
                            extractEditorValue: (elem) => {
                                return $(elem).find('select').find('option:selected').text().trim();
                            },
                        }
                    });
                } else {
                    tableEntregas.find('tbody tr td.resultadoAvaliacao').removeClass('editCellSelect');
                }
                setCompensacaoHorasAvaliacao();
            } else if (tableEntregas.length && readonly) {
                window.total_meta_homologada = parseFloat(tableEntregas.find('.totalMetaHomologada').text());
                setCompensacaoHorasAvaliacao();
            }
        }
    } else if (mode == 'out') {
        if (!data.select) {
            td.find('.iconStarAtiv').each(function () {
                if (!$(this).data('select')) {
                    $(this).find('i').removeClass('starGold');
                }
            });
        }
    }
    centralizeDialogBox(dialogBoxPro);
}
export function setCompensacaoHorasAvaliacao() {
    window.total_meta_descumprida = 0;
    window.horas_desconto = 0;
    window.horas_compensacao = 0;
    var tableEntregas = $('table[data-key="entregas"]');
    var total_tempo_proporcional = parseFloat(tableEntregas.find('th.totalTempoProporcionalEntrega').text());

    $('.infoHorasCompensacao, .infoHorasDesconto').remove();

    if (Math.floor(window.total_meta_homologada) < Math.floor(total_tempo_proporcional)) {
        var acrescimo_maximo_jornada = callAtiv('checkOptionEntidade','acrescimo_maximo_jornada') ? callAtiv('getOptionEntidade','acrescimo_maximo_jornada') : 25;
        var limite_jornada = total_tempo_proporcional * (acrescimo_maximo_jornada / 100);
        var meta_descumprida = total_tempo_proporcional - window.total_meta_homologada;
        var horas_compensacao = limite_jornada < meta_descumprida ? limite_jornada : meta_descumprida;
        var horas_desconto = meta_descumprida > 0 ? meta_descumprida - limite_jornada : false;
        horas_desconto = horas_desconto > 0 ? horas_desconto : false;

        $('#ratingPlano .ratingStars')
            .before(`   <div class="infoHorasCompensacao" style="text-align: center;padding: 10px;display: inline-block;background: #f9efad;border-radius: 5px;color: #666;margin: 10px;">
                            <i class="fas fa-info-circle azulColor"></i> Para fins de compensa\u00E7\u00E3o normativa, o resultado da avalia\u00E7\u00E3o acarretar\u00E1 no acr\u00E9scimo de <strong>`+ horas_compensacao.toFixed(2) + ` horas</strong> no pr\u00F3ximo plano de trabalho do participante.
                        </div>`);
        $('.appealWork').attr('data-horas_compensacao', horas_compensacao.toFixed(2));

        if (horas_desconto) {
            $('#ratingPlano .ratingStars')
                .before(`   <div class="infoHorasDesconto" style="text-align: center;padding: 10px;display: block;background: #e2162133;border-radius: 5px;color: #666;margin: 10px;">
                            <i class="fas fa-exclamation-triangle vermelhoColor"></i> A meta n\u00E3o cumprida (`+ meta_descumprida.toFixed(2) + ` horas) excede o limite m\u00E1ximo de acr\u00E9scimo de jornada extraordin\u00E1ria (` + acrescimo_maximo_jornada + `% de ` + total_tempo_proporcional + ` horas = ` + limite_jornada.toFixed(2) + ` horas).<br><br>
                            Exitem <strong>`+ horas_desconto.toFixed(2) + ` horas</strong> excendentes n\u00E3o cumpridas pass\u00EDveis de desconto em folha.
                        </div>`);
            $('.appealWork').attr('data-horas_desconto', horas_desconto.toFixed(2));
        }
        $('.infoHorasCompensacao, .infoHorasDesconto').effect('highlight').delay(2).effect('highlight').delay(2).effect('highlight');
        window.total_meta_descumprida = meta_descumprida;
        window.horas_desconto = horas_desconto;
        window.horas_compensacao = horas_compensacao;
    }
    tableEntregas.find('.totalMetaDescumprida').text(window.total_meta_descumprida.toFixed(2));
}
export function setMetaHomologadaEntrega(this_, tipo_execucao) {
    var tr = $(this_);
    var tempo_proporcional_entrega = parseFloat(tr.find('td.tempoProporcionalEntrega').text());
    var horas_entrega = parseFloat(tr.find('td.horasEntrega').text());
    var dif_tempo_horas = horas_entrega < tempo_proporcional_entrega ? horas_entrega : tempo_proporcional_entrega;
    var meta_homologada = 0;
    meta_homologada = tipo_execucao == 3 ? 0 : meta_homologada;
    meta_homologada = tipo_execucao == 2 ? dif_tempo_horas : meta_homologada;
    meta_homologada = tipo_execucao == 1 ? tempo_proporcional_entrega : meta_homologada;
    window.total_meta_homologada = window.total_meta_homologada + meta_homologada;

    var meta_descumprida = tempo_proporcional_entrega - meta_homologada;
    window.total_meta_descumprida = window.total_meta_descumprida + meta_descumprida;

    tr.attr('data-tipo_execucao', tipo_execucao);
    tr.find('td.metaHomologada').text(meta_homologada.toFixed(2));
    tr.find('td.metaDescumprida').text(meta_descumprida.toFixed(2));

    var horas_homologadas = horas_entrega;
    horas_homologadas = tipo_execucao == 3 ? 0 : horas_homologadas;
    tr.find('td.horasHomologadas').text(horas_homologadas);
}
export function changeSelectExecucaoEntrega(this_) {
    var _this = $(this_);
    var _tr = _this.closest('tr');
    var _table = _this.closest('table');
    var value = _this.val();

    _tr.attr('data-tipo_execucao', value);
    setMetaHomologadaEntrega(_this.closest('tr')[0], value);

    var total_meta_homologada = _table.find('tbody td.metaHomologada').map(function () { return parseFloat($(this).text()) }).get().reduce(function (a, b) { return a + b; }, 0);
    window.total_meta_homologada = total_meta_homologada;
    _table.find('.totalMetaHomologada').text(total_meta_homologada.toFixed(2));

    var total_horas_homologadas = _table.find('tbody td.horasHomologadas').map(function () { return parseFloat($(this).text()) }).get().reduce(function (a, b) { return a + b; }, 0);
    _table.find('.totalHorasHomologadas').text(total_horas_homologadas.toFixed(2));

    setCompensacaoHorasAvaliacao();
}
// ACAO AO SELECIONAR UM MOTIVO DE AVALIACAO
export function onWhyAtiv(this_) {
    var _this = $(this_);
    var data = _this.data();
    var _parent = _this.closest('.ratingWork');
    var data_parent = _parent.data();
    var comentarios = _parent.find('.moreCommentBoxText textarea').val();
    if (data.selected == false) {
        _this.addClass('selected').data('selected', true);
    } else {
        _this.removeClass('selected').data('selected', false);
    }
    var arraySelected = []
    _this.closest('.ratingWhy').find('.answer').each(function () { if ($(this).data('selected')) { arraySelected.push($(this).data('index')) } });
    _this.closest('.ratingWork').data('why-selected', arraySelected);

    if (
        arraySelected.length > 0 &&
        (data_parent.exigeJustificativa == 0 || (data_parent.exigeJustificativa == 1 && comentarios != ''))
    ) {
        updateButtonConfirm(this_, true)
    } else { updateButtonConfirm(this_, false) }
}

// INICIA PAINEL
