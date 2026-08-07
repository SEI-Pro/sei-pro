/**
 * Árvore — duas linhas, style, numeric, chrome.
 * (ponte temporária: jQuery/DOM legado; fatia do antigo body.js)
 */
import {
    buildArvoreInitSignature
} from './domain.js';

import {
    atividadesStateParent
} from './atividades-bridge.js';

import {
    isSparklingModalVisible
} from './modules.js';


export function breakDocTwoLines() {
    if ($('.breackline_doc').length > 0) { $('.breackline_doc').remove(); }
    $('#divArvore').find(`a[target="${ifrVisualizacao_}"]`).each(function(index){
        var checkLast = (index == $('#divArvore').find(`a[target="${ifrVisualizacao_}"]`).length-1) ? true : false;
        var checkFolder = ($('#divArvore').find('a[id*="anchorImgPASTA"]').length > 0) ? true : false;
        var checkLastFolder = (parseInt($(this).closest('.infraArvore').attr('id').replace('divPASTA','')) == $('#divArvore').find('a[id*="anchorImgPASTA"]').length) ? true : false;
        var checkLastItemFolder = ($(this).attr('id') == $(this).closest('.infraArvore').find(`a[target="${ifrVisualizacao_}"]`).last().attr('id')) ? true : false;
        var nrSEI = $(this).text().trim();
            nrSEI = (nrSEI.indexOf(' ') !== -1) ? nrSEI.split(' ') : '';
            nrSEI = (nrSEI != '') ? '<span style="font-size:9pt">'+nrSEI[nrSEI.length-1]+'</span>' : '';
        var imgDivPasta = (checkFolder && !checkLast && !checkLastFolder ) ? '<img src="'+pathArvore+'line.gif" align="absbottom">' : '';
        var paddingLastFolder = (checkFolder && checkLastFolder) ? '<span style="margin-left: 18px;"></span>' : '';
        var imgDiv = (checkLast || checkLastItemFolder) ? '<img src="'+pathArvore+'joinbottom.gif" align="absbottom" style="margin-left: 18px;">' : '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAASCAYAAAAzI3woAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MkIxNDk0NTBFQzFCMTFFQkFERjBGQzQ1Qjk0MkFCNUEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MkIxNDk0NTFFQzFCMTFFQkFERjBGQzQ1Qjk0MkFCNUEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRkIyMEY3NUVDMUExMUVCQURGMEZDNDVCOTQyQUI1QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRkIyMEY3NkVDMUExMUVCQURGMEZDNDVCOTQyQUI1QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpIKuNMAAABISURBVHjaYvj//z8DLtzQ0PAfnzwxmFQzGEHEYAJM+CQbGxspdi2pZoyG0GgIjYbQaAiNhtBAhRCx9MgLIVLBaAgNuRACCDAA4Zq1PU3G1rcAAAAASUVORK5CYII=" />';
            
        $(this).after('<span class="breackline_doc"><br>'+paddingLastFolder+imgDivPasta+imgDiv+nrSEI+'</span>');
    });
}
export function initBreakDocTwoLines(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (isSparklingModalVisible()) {
        setTimeout(function(){ 
            initBreakDocTwoLines(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initBreakDocTwoLines => '+TimeOut); 
        }, 500);
        return;
    }
    if (typeof resizeArvoreMaxWidth !== 'undefined') {
        breakDocTwoLines();
    } else {
        setTimeout(function(){ 
            initBreakDocTwoLines(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initBreakDocTwoLines => '+TimeOut); 
        }, 500);
    }
}
// Tree-specific variant: applies seiSlim classes + initAnchorImg + retry loop.
// Distinct from the canonical SeiPro.core.ui.loadStyleDesign(body, secondClass, options);
// kept local (renamed) to avoid a global name collision with different semantics.
export function loadStyleDesignArvore(loop = 3) {
    if (localStorage.getItem('seiSlim')) {
        var body = document.body;
        body.classList.add("seiSlim");
        body.classList.add("seiSlim_arvore");
        if (localStorage.getItem('darkModePro')) {
            body.classList.add("dark-mode");
        }
        initAnchorImg();
        // initOnClickPasta();
        if (loop > 0) {
            setTimeout(function(){
                loadStyleDesignArvore(false);
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload loadStyleDesignArvore', loop);
            }, 1500);
        }
    }
}
export function initNumericDocsPro(loop = true) {
    var sumP = getSumDocsPasta(loop);
    $('.numericDocsPro').remove();
    var folderDiv = $('.infraArvore[id*="divPASTA"]');
    if (folderDiv.length) {
        folderDiv.each(function(){
            var _this = $(this);
            var folder = _this.attr('id');
                folder = (typeof folder !== 'undefined') ? folder.replace('divPASTA', '') : false;
                folder = (folder) ? parseInt(folder) : false;
            var initCount = (folder * sumP) - sumP;
            _this.find(anchorDoc).each(function(i){
                var count = initCount+i+1;
                $(this).before('<span class="numericDocsPro" data-count="'+count+'"></span>');
            });
        });
    } else {
        $(`#container ${anchorDoc}`).each(function(i){
            $(this).before('<span class="numericDocsPro" data-count="'+(i+1)+'"></span>');
        });
    }
}
export function getSumDocsPasta(loop) {
    if (parent.getOptionsPro('sumDocsPasta')) {
        return parent.getOptionsPro('sumDocsPasta');
    } else {
        var defaultSumPasta = 20;
        var sumDocsPasta = ($('#anchorImgPASTA2').length) 
            ? $('.infraArvore[id*="divPASTA"]:not(:last-child)').map(function(){ if( $(this).find(anchorDoc).length) { return $(this).find(anchorDoc).length } }).get()
            : defaultSumPasta;
        var sumDocsPasta = $.isArray(sumDocsPasta) && !$.isEmptyObject(sumDocsPasta) ? arrayMax(sumDocsPasta) : sumDocsPasta;
        if (sumDocsPasta > defaultSumPasta && loop) {
            parent.setOptionsPro('sumDocsPasta',sumDocsPasta);
            initNumericDocsPro(false);
        } else {
            sumDocsPasta = defaultSumPasta;
        }
        
        return sumDocsPasta;
    }
}
export function checkProcessoSigiloso() {
    if ($('a[id*="anchorNA"] img[src*="_sigiloso"]').length > 0) {
        var id_protocolo = getParamsUrlPro(window.location.href).id_procedimento;
        sessionStorageStorePro('processo_sigiloso_'+id_protocolo,true);
    }
}
export function initPanelPrescricaoProcesso() {
    var prescData = atividadesStateParent().arrayPrescricoesProcPro;
    var tipos_prescricao = typeof jmespath !== 'undefined' ? jmespath.search(prescData,"[*].id_tipo_prescricao") : null;
        tipos_prescricao = tipos_prescricao !== null ? parent.uniqPro(tipos_prescricao) : null;
    if (typeof prescData !== 'undefined' && prescData.length > 0 && tipos_prescricao !== null && tipos_prescricao.length > 0 && typeof parent.checkConfigValue !== 'undefined' && parent.checkConfigValue('gerenciarprescricoes')) {
        $.each(tipos_prescricao, function(i, v){
                var configAtividades = atividadesStateParent().arrayConfigAtividades || {};
                var value_prescricao = typeof configAtividades.tipos_prescricoes !== 'undefined' ? jmespath.search(configAtividades.tipos_prescricoes, "[?id_tipo_prescricao==`"+v+"`] | [0]") : null;
                value_prescricao = value_prescricao !== null ? value_prescricao : false;
            var prescricao = jmespath.search(prescData,"[?id_tipo_prescricao==`"+v+"`]");
                prescricao = prescricao !== null ? prescricao : false;
            var vigente = jmespath.search(prescricao, "[?data_fim=='0000-00-00 00:00:00'] | [0]");
                vigente = vigente !== null ? vigente : false;
            var prazo = value_prescricao ? value_prescricao.prazo : false;
            var config = value_prescricao ? value_prescricao.config : false;
            var suspensao_prazo = config && config.suspensao_prazo ? true : false;

            if (prazo && vigente) {
                if (suspensao_prazo) {
                    var decorrido = jmespath.search(prescData,"[?!suspensao]");
                        decorrido = decorrido.map(function(v){ 
                            var data_fim = v.data_fim == '0000-00-00 00:00:00' ? moment() : moment(v.data_fim, 'YYYY-MM-DD HH:mm:ss');
                            var prazo = data_fim.diff(moment(v.data_inicio, 'YYYY-MM-DD HH:mm:ss'),'days');
                            return prazo
                        }).reduce((b, a) => b + a, 0);
                } else {
                    var decorrido = moment().diff(moment(vigente.data_inicio, 'YYYY-MM-DD HH:mm:ss'),'days');
                }
                var porcentagem = parseFloat(((decorrido/prazo)*100).toFixed(2));
                var nivel_critico = config && typeof config.nivel_critico !== 'undefined' ? config.nivel_critico : 75;
                var urgencia_nivel_critico = config && typeof config.urgencia_nivel_critico !== 'undefined' ? config.urgencia_nivel_critico : false;
                var classProgress = porcentagem >= nivel_critico ? 'urgente' : '';
                    classProgress = vigente.suspensao ? 'suspenso' : classProgress;
                var txtTip =    'Prazo: '+prazo+' dias<br>'+
                                'Decorrido: '+decorrido+' dias ('+porcentagem+'%) <br>'+
                                'Documento: '+vigente.documento_relacionado+' ('+moment(vigente.data_inicio).format('DD/MM/YYYY HH:mm')+')'+
                                '\',\''+
                                (vigente.suspensao ? '(SUSPENSO) ' : '')+value_prescricao.nome_prescricao;

                $('#progressPrescricao_'+v).remove();
                $('#topmenu').append('<div id="progressPrescricao_'+v+'" onmouseover="return infraTooltipMostrar(\''+txtTip+'\');" onmouseout="return infraTooltipOcultar();" onclick="parent.getCtrPrescricao();" class="progressPrescricao '+classProgress+'"></div>');
                $('#progressPrescricao_'+v).progressbar({
                    value: decorrido,
                    max: prazo
                });
                $('#container').css('margin-top','35px');

                setTimeout(function(){ 
                    if (typeof parent.dadosProcessoPro.propProcesso !== 'undefined' && parent.dadosProcessoPro.propProcesso.txtDescricao.toLowerCase().indexOf('(urgente)') === -1 && porcentagem >= nivel_critico && urgencia_nivel_critico) {
                        parent.addUrgenteProcessoPro();
                    }
                }, 4000);
                // console.log(value_prescricao, vigente, prazo, decorrido, porcentagem, nivel_critico, urgencia_nivel_critico, parent.dadosProcessoPro);
            }
        })
    }
}
export function initAnchorImg() {
    $('a[id*="anchorImg"], a[id*="anchorA"], a[id*="ancjoinPASTA"]').each(function(){
        var img = $(this).find('img').attr('src');
        if (img !== null) $(this).attr('data-img', img);
    });
    $('img[src*="/join"], img[src*="/line"]').wrap(function(){
        return ($(this).closest('.anchorJoinPro').length == 0) ? '<span class="anchorJoinPro" data-img="'+$(this).attr('src')+'"></span>' : false;
    });
    $('img[src*="/espaco"], img[src*="/empty"]').wrap(function(){
        return ($(this).closest('.anchorSpacePro').length == 0) ? '<span class="anchorSpacePro" data-img="'+$(this).attr('src')+'"></span>' : false;
    });
}
export function getArvoreInitSignature() {
    var anchors = $('a[id*="anchor"][target="'+ifrVisualizacao_+'"]');
    if (!anchors.length) return '';
    return buildArvoreInitSignature(anchors.map(function() {
        return {
            id: $(this).attr('id') || '',
            href: $(this).attr('href') || ''
        };
    }).get());
}
// Feature "Filtrar a página pelo campo de pesquisa rápida" (config filtrarpaginapelapesquisarapida)
// migrada para src/features/quick-filter/ (bundle quick-filter-tree.bundle.js, self-boot no ifrArvore). — Fase 6.
/*
export function initOnClickPasta() {
    $('a[id*="ancjoinPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
    $('a[id*="anchorImgPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
    $('a[id*="anchorPASTA"]').on('click', function(){
        initAnchorImg();
        console.log('initOnClickPasta');
    });
}
*/
