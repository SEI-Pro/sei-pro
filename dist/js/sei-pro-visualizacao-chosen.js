function replaceSelectOnVisualizacao(TimeOut = 9000) {
    if (TimeOut <= 0) { return; }
    if (typeof $().chosen !== 'undefined') {
        $(document).ready(function() {
            setReplaceSelectOnVisualizacao();
        });
    } else {
        if (typeof $().chosen === 'undefined' && typeof parent.URL_SPRO !== 'undefined') { 
            $.getScript(parent.URL_SPRO+"js/lib/chosen.jquery.min.js");
        }
        setTimeout(function(){ 
            replaceSelectOnVisualizacao(TimeOut - 100); 
            console.log('Reload replaceSelectOnVisualizacao'); 
        }, 500);
    }
}
function setReplaceSelectOnVisualizacao() {
    if (parent.verifyConfigValue('substituiselecao')) {
        var target = $('body');
        if (typeof $().chosen !== 'undefined') {
            target.find('select').chosen('destroy');
            target.find('select').not('[multiple]').not('[size]').filter(function() { 
                    return !($(this).css('visibility') == 'hidden' || $(this).css('display') == 'none') 
                }).chosen({
                    placeholder_text_single: ' ',
                    no_results_text: 'Nenhum resultado encontrado'
                })
            parent.chosenReparePosition(target);
            target.find('.infraAreaDados').css('overflow','initial');
            target.find('select').not('[multiple]').eq(0).trigger('chosen:activate');
        }
    }
}