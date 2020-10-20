function initToolbarDocs() {

    var htmlToolbarProc =   '<div id="toolbar-options-proc" class="hidden">'+
                            '   <a href="#" data-action="nrProc" style="width: 175px;"><i class="fa fas fa-copyright"></i><span class="info" title="Copiar n\u00FAmero do processo">Copiar n\u00FAmero do processo</span></a>'+
                            '   <a href="#" data-action="linkDoc" style="width: 150px;"><i class="fa fa-link"></i><span class="info" title="Copiar link do processo">Copiar link do processo</span></a>'+
                            '</div>';
    
    var htmlToolbarDoc =    '<div id="toolbar-options-doc" class="hidden">'+
                            '   <a href="#" data-action="nrSEI" style="width: 130px;"><i class="fa fas fa-copyright"></i><span class="info" title="Copiar n\u00FAmero SEI">Copiar n\u00FAmero SEI</span></a>'+
                            '   <a href="#" data-action="nomeDoc" style="width: 175px;"><i class="fa fa-quote-left"></i><span class="info" title="Copiar nome do documento">Copiar nome do documento</span></a>'+
                            '</div>';
    $('#topmenu').prepend(htmlToolbarProc+htmlToolbarDoc);
    
    setTimeout(function(){ 
        getToolbarPro();
    }, 1500);
}
function actionToolbarPro(this_, triggerButton) {
    var button = $(triggerButton);
    var name_action = button.attr('data-action');
    var id_protocolo = this_.attr('id').replace('anchorImg', '');            
    var txt = $('#anchor'+id_protocolo).find('span').text().trim();
    var text = txt.split(' ');
    var nr_sei = (txt.indexOf(' ') !== -1) ? text[text.length-1] : '';
    var documento = txt.replace(nr_sei, '').trim();
        nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','') : nr_sei;
    var button_txt = button.find('.info').attr('title');
    var button_clicktxt = '';
    var button_class = '';
    var button_clickclass = 'fa fa-thumbs-up';

    if ( name_action == 'nrSEI' ) {
        copyToClipboard(nr_sei);
        button_clicktxt = 'N\u00FAmero copiado!';
        button_class = 'fa fas fa-copyright';
    } else if ( name_action == 'nrProc' ) {
        copyToClipboard(documento);
        button_clicktxt = 'N\u00FAmero copiado!';
        button_class = 'fa fas fa-copyright';
    } else if ( name_action == 'nomeDoc' ) {
        copyToClipboard(documento+' (SEI n\u00BA '+nr_sei+')');
        button_clicktxt = 'Nome copiado!'; 
        button_class = 'fa fa-quote-left';
    } else if ( name_action == 'linkDoc' ) {
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        var url_host = window.location.href.split('?')[0];
        var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
        copyToClipboard(linkDoc);
        button_clicktxt = 'Link copiado!';
        button_class = 'fa fa-link';
    }
    button.addClass('tool-item-active').find('.info').text(button_clicktxt);
    button.find('i').attr('class', button_clickclass);
    setTimeout(function () {
        button.removeClass('tool-item-active').find('.info').text(button_txt);
        button.find('i').attr('class', button_class);
    }, 2000);
}
function getToolbarPro() {
        $('.clipboard:first').toolbar({
            content: '#toolbar-options-proc',
            position: 'bottom',
            //event: 'click',
            //hideOnClick: true,
            adjustment: 5
        }).on('toolbarItemClick', function( event, triggerButton ) {
            actionToolbarPro($(this), triggerButton);
        });
    
        $('.clipboard').not(':first').toolbar({
            content: '#toolbar-options-doc',
            position: 'top',
            //event: 'click',
            //hideOnClick: true,
            adjustment: 21
        }).on('toolbarItemClick', function( event, triggerButton ) {
            actionToolbarPro($(this), triggerButton);
        });
}
function initSeiProArvore () {
    initToolbarDocs();
}

$(document).ready(function () { initSeiProArvore() });