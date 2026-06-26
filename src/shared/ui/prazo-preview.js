import { aliasGlobal, getSeiPro, globalRef } from '../../core/global.js';

/**
 * Infra de VIEW compartilhada de "preview de prazo / etiqueta de data".
 *
 * Renderização (HTML da etiqueta + SVG de progresso + preview no diálogo de
 * config) usada por VÁRIAS features: lista de processos (Controlar Prazos),
 * Kanban de atividades, monitorados e prescrições. Por ser compartilhada, NÃO
 * mora na pasta de nenhuma feature — vive em src/shared/ui e é instalada no
 * core-stack (carregado 1º em todo bloco), expondo `SeiPro.shared.prazoPreview`
 * + aliases globais (getDatesPreview/…) para o legado, e import direto p/ ESM.
 *
 * Núcleo PURO de cálculo fica em src/core/prazos.js e src/core/datas.js
 * (getDateSemantic, getDateBoxState, getProgressPercent) — aqui é só montagem de
 * HTML/SVG e DOM. Deps externas (moment, $, e os globais de cálculo/config do
 * legado) são lidas lazy via globalRef no momento da chamada (mesmo padrão do core).
 */

export function getDatesPreview(config, dateduepreview=false) {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic = globalRef.getDateSemantic, getDateBoxState = globalRef.getDateBoxState, getProgressPercent = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;    var formatDate = 'YYYY-MM-DD HH:mm:ss';
    var displayFormat = (typeof config !== 'undefined' && typeof config.displayformat !== 'undefined' && config.displayformat !== null && config.displayformat) ? config.displayformat : 'DD/MM/YYYY';
        config.dateTo = (typeof config.dateTo === 'undefined') ? moment().format(formatDate) : config.dateTo;
    var resultDate = getDateSemantic(config); 
    var resultDateDate = (resultDate.date != '') ? moment(resultDate.date, formatDate).format(displayFormat) : resultDate.date;
    var displayDueText = (typeof config.displaydue_txt === 'undefined') ? 'Vencimento:' : config.displaydue_txt;
    var displayTipText = (config.displaytip) ? '<br>'+config.displaytip : '';
    var displayModeTip = (config.displaydue) 
                            ? 'infraTooltipMostrar(\'Criado '+resultDate.dateref+' ('+resultDateDate+') '+displayTipText+'\', \''+displayDueText+' '+resultDate.duedate+'\')' 
                            : 'infraTooltipMostrar(\''+displayDueText+' '+resultDate.duedate+' '+displayTipText+'\', \''+resultDate.duecalcref+'\')';
        displayModeTip = (config.deliverydoc) 
                            ? 
                            (config.dateDue !== null) 
                                ? 'infraTooltipMostrar(\'Avalia\u00E7\u00E3o at\u00E9 '+resultDate.duedate+' ('+resultDate.duecalcref+') '+displayTipText+'\', \''+displayDueText+' '+moment(resultDate.date, formatDate).format(displayFormat)+'\')' 
                                : 'infraTooltipMostrar(\''+config.displaytip+'\',\''+displayDueText+' '+moment(resultDate.date, formatDate).format(displayFormat)+'\')' 
                            : displayModeTip;
    var displayMode = (config.displaydue) ? resultDate.duecalcref : resultDate.dateref;
    var htmlDateDueBox = ((config.duedate || config.duesetdate) && resultDate.duecalcref != '' && dateduepreview) ? '<div class="infraTooltipPro" style="margin-top: 20px;"><strong>'+resultDate.duecalcref+'</strong>Vencimento em: '+resultDate.duedate+'</div>' : '';
    var htmlProgress = getProgressPreview(config);
    var backgroundDiv = ((config.duedate || config.duesetdate) && resultDate.alertdate) ? 'urgenteBoxDisplay' : '';
    var iconDate = (moment(config.date, formatDate).diff(moment(), 'days') > 0) ? 'far fa-clock' : 'fas fa-history';
        iconDate = (config.displayicon) ? config.displayicon : iconDate;
    var iconDateColor = (moment().format(formatDate) == config.dateDue) ? '#ad0606' : '#4285f4';
    var iconDateClass = (config.deliverydoc) ? config.deliverydoc_style : 'far fa-clock';
        iconDateClass = (config.displayicon) ? config.displayicon : iconDateClass;
    // Cascata de decisão de estado/tag migrada para SeiPro.core.prazos.getDateBoxState (Fase 6)
    var tagName = getDateBoxState(config, resultDate);
    var tagAction = (typeof config.action !== 'undefined' && config.action != '') ? config.action : 'parent.filterTagView(this)';
    var htmlDateDue = (config.duedate || config.duesetdate) 
                        ? (resultDate.alertdate) 
                            ? '<span class="dateBoxIcon" onmouseover="return '+displayModeTip+';" onmouseout="return infraTooltipOcultar();"><i class="'+(config.displayicon ? config.displayicon : 'fas fa-exclamation-triangle vermelhoColor')+'" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' 
                            : '<span class="dateBoxIcon" onmouseover="return '+displayModeTip+';" onmouseout="return infraTooltipOcultar();">'+htmlProgress+'<i class="'+iconDateClass+'" style="color: '+iconDateColor+'; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' 
                        : '<i class="'+iconDate+'" style="color: #777; padding-right: 3px; font-size: 12pt;"></i>';
    // console.log('getDatesPreview',resultDate);
   return '<span class="dateboxDisplay tagTableText_'+tagName.value+' '+backgroundDiv+'" data-duesetdate="'+config.duesetdate+'" data-colortag="'+tagName.color+'" data-tagname="'+tagName.value+'" data-nametag="'+tagName.name+'" data-time-sorter="'+resultDate.date+'" data-type="date" onclick="'+tagAction+'">'+htmlDateDue+' '+displayMode+'</span>'+htmlDateDueBox;
}
// calculeDatesDurationTemplate migrada para SeiPro.core.datas (src/core/datas.js) — Fase 6
// calculeDatesDuration migrada para SeiPro.core.datas (src/core/datas.js) \u2014 Fase 6
// getDateSemantic migrada para SeiPro.core.datas (src/core/datas.js) — Fase 6
export function configDatesPreview() {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic = globalRef.getDateSemantic, getDateBoxState = globalRef.getDateBoxState, getProgressPercent = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;    var config = getConfigDatesMonitorado();
    if (config.selectdoc) { configDatesSetUpdate() }
        config.dateTo = moment().format('YYYY-MM-DD');
    var htmlDatePreview = getDatesPreview(config, true);
        $('#dateboxPreview').show().html(htmlDatePreview);
        //console.log(config);
}
export function getProgressPreview(config) {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic = globalRef.getDateSemantic, getDateBoxState = globalRef.getDateBoxState, getProgressPercent = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;    // Cálculo puro migrado para SeiPro.core.prazos.getProgressPercent (Fase 6)
    // `htmlProgress` era global implícito no script sloppy legado; em módulo ESM
    // (strict) precisa ser declarado, senão lança ReferenceError ao atribuir.
    var htmlProgress;
    var _progress = getProgressPercent(config);
    if (_progress.show) {
        var percentProgresso = _progress.percent;
        var colorProgresso = ( percentProgresso > 100 )
                                    ? 'style="stroke: #ff010199;"' 
                                    : (config.deliverydoc) ? 'style="stroke: #72a50a70;"' : '';
            htmlProgress = '<svg viewBox="0 0 36 36" class="circular-chart"><path '+colorProgresso+' class="circle" stroke-dasharray="'+percentProgresso+', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path></svg>';
            // console.log(max, progress, percentProgresso, config.date, config.dateDue, config.dateProgress);
    } else {
        htmlProgress = '';
    }
    return htmlProgress;
}

export function installPrazoPreview() {
    const prazoPreview = { getDatesPreview, getProgressPreview, configDatesPreview };
    getSeiPro().shared = getSeiPro().shared || {};
    getSeiPro().shared.prazoPreview = prazoPreview;
    aliasGlobal('getDatesPreview', getDatesPreview);
    aliasGlobal('getProgressPreview', getProgressPreview);
    aliasGlobal('configDatesPreview', configDatesPreview);
    return prazoPreview;
}
