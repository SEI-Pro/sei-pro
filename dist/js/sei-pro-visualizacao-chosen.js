function replaceSelectOnVisualizacao(force = false, TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        $(document).ready(function() {
            setReplaceSelectOnVisualizacao(force);
            // console.log('@ replaceSelectOnVisualizacao',force);
        });
    } else {
        if (typeof $().chosen === 'undefined' && typeof parent.URL_SPRO !== 'undefined') { 
            $.getScript(parent.URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            replaceSelectOnVisualizacao(force, TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('Reload replaceSelectOnVisualizacao'); 
        }, 500);
    }
}
function setReplaceSelectOnVisualizacao(force = false) {
    if (parent.verifyConfigValue('substituiselecao')) {
        var target = $('body');
        if (typeof $().chosen !== 'undefined') {
            target.find('select').chosen('destroy');
            target.find('select').not('[multiple]').not('[size]').filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none' || (!force && typeof $(this).data('chosen') !== 'undefined') )
                }).chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado',
                    normalize_search_text: function(text) {
                        return parent.removeAcentos(text.toLowerCase());
                    }
                });

            // console.log('@ setReplaceSelectOnVisualizacao',force);
            parent.chosenReparePosition(target);
            target.find('.infraAreaDados').css('overflow','initial');
            parent.setInfraImg(target);
            // if (force) target.find('select').not('[multiple]').eq(0).trigger('chosen:activate');
            // console.log('force',force);
        }
    }
}
function repareChosenIntimacaoEletronica() {
    if ($('#selTipoIntimacao').length) {
        $('#selTipoIntimacao_chosen').remove();
        $('#selTipoIntimacao')
            .chosen("destroy")
            .chosen({
                placeholder_text_single: ' ',
                no_results_text: 'Nenhum resultado encontrado',
                normalize_search_text: function(text) {
                    return parent.removeAcentos(text.toLowerCase());
                }
        });
    }
    // console.log('repareChosenIntimacaoEletronica');
}
function initForceChosenVisualizacao() {
    var observer = new MutationObserver(function(mutations) {
        for (const addedNodes of mutations) {
            if (!parent.delayCrash && typeof addedNodes.target !== 'undefined' && 
                (
                    $(addedNodes.target).is('select') || $(addedNodes.target).find('select').length ||
                    $(addedNodes.target).is('img') || $(addedNodes.target).find('img').length ||
                    $(addedNodes.target).is('option') || $(addedNodes.target).find('option').length
                )
            ) {
                parent.delayCrash = true;
                setTimeout(function(){ parent.delayCrash = false }, 1000);
                if (typeof replaceSelectOnVisualizacao !== 'undefined') {
                    replaceSelectOnVisualizacao(false);
                    // console.log('initForceChosenVisualizacao', false, $(addedNodes.target)[0]);
                } 
            }
        }
    });
    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});
}
// initForceChosenVisualizacao();
// As telas de formulario (Atribuir Processo, entre outras) nao carregam neste documento: elas
// abrem num iframe DENTRO dele. Como o Chosen so era injetado neste nivel, o select dessas telas
// ficava sem o campo de busca: era o caso do "pesquisar pelo nome em atribuir processos".
// A cada carregamento do iframe interno, pede ao topo que injete o plugin tambem la.
function initChosenIframeInternoPro() {
    var nome = (typeof parent.ifrArvoreHtml_ !== 'undefined') ? parent.ifrArvoreHtml_ : 'ifrVisualizacao';
    var alvo = document.getElementById(nome);
    if (!alvo) { return; }
    var aplicar = function () {
        if (typeof parent.replaceSelectAllVisualizacao === 'function') {
            setTimeout(function () { parent.replaceSelectAllVisualizacao(); }, 300);
        }
    };
    $(alvo).off('load.seiProChosen').on('load.seiProChosen', aplicar);
    aplicar();
}
setTimeout(function(){
    repareChosenIntimacaoEletronica();
    initChosenIframeInternoPro();
}, 2000);