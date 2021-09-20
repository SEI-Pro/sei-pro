var arrayLinksArvore = [];

function initToolbarDocs() {
    var selectedItensMenu = ( typeof localStorageRestorePro('configViewFlashMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashMenuPro')) ) ? localStorageRestorePro('configViewFlashMenuPro') : [['Copiar n\u00FAmero do processo'],['Copiar link do processo'],['Incluir Documento'],['Atribuir Processo']];
    var selectedItensDocMenu = ( typeof localStorageRestorePro('configViewFlashDocMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocMenuPro')) ) ? localStorageRestorePro('configViewFlashDocMenuPro') : [['Copiar n\u00FAmero SEI'],['Copiar nome do documento'],['Copiar link do documento']];
    var htmlToolbarProc =   '<div id="toolbar-options-proc" class="hidden">';
    
        $.each(selectedItensMenu,function(index, value){
            var data = jmespath.search(arrayLinksArvore, "[?name=='"+value[0]+"'] | [0]");
            if ( data !== null ) {
                var valueAlt = ( data.alt != '' ) ? data.alt : data.name;
                htmlToolbarProc +=  '   <a href="#" data-action="linksArvore" style="width: 175px;"><i class="fa '+data.icon+'"></i><span class="info" title="'+data.name+'" alt="'+valueAlt+'">'+valueAlt+'</span></a>';
            }
        });
    
        htmlToolbarProc +=  '   <a href="#" data-action="configMenu" style="width: 175px; background: #dedede" class="tool-item-gray"><i class="fa fa-cog" style="color: #666;"></i><span style="color: #666;" class="info" title="Personalizar Menu" alt="Personalizar Menu">Personalizar Menu</span></a>';
        htmlToolbarProc +=  '</div>';
    
    var htmlToolbarDoc =    '<div id="toolbar-options-doc" class="hidden">';
        $.each(selectedItensDocMenu,function(index, value){
            var data = jmespath.search(iconsFlashDocMenu, "[?name=='"+value[0]+"'] | [0]");
            if ( data !== null ) {
                var valueAlt = ( data.alt != '' ) ? data.alt : data.name;
                htmlToolbarDoc +=  '   <a href="#" data-action="linksArvore" style="width: 175px;"><i class="fa '+data.icon+'"></i><span class="info" title="'+data.name+'" alt="'+valueAlt+'">'+valueAlt+'</span></a>';
            }
        });
        htmlToolbarDoc +=  '</div>';
    
    /*var htmlToolbarDoc =    '<div id="toolbar-options-doc" class="hidden">';
                            '   <a href="#" data-action="nrSEI" style="width: 175px;"><i class="fa fas fa-copyright"></i><span class="info" title="Copiar n\u00FAmero SEI" alt="Copiar n\u00FAmero SEI">Copiar n\u00FAmero SEI</span></a>'+
                            '   <a href="#" data-action="nomeDoc" style="width: 175px;"><i class="fa fa-quote-left"></i><span class="info" title="Copiar nome do documento" alt="Copiar nome do documento">Copiar nome do documento</span></a>'+
                            '   <a href="#" data-action="linkDoc" style="width: 175px;"><i class="fa fa-link"></i><span class="info" title="Copiar link do documento" alt="Copiar link do documento">Copiar link do documento</span></a>'+
                            '   <a href="#" data-action="nomelinkDoc" style="width: 175px;"><i class="fa fa-external-link-alt"></i><span class="info" title="Copiar nome com link" alt="Copiar nome com link">Copiar nome com link</span></a>'+
                            '</div>';*/
    
    $('#toolbar-options-doc, #toolbar-options-proc').remove();
    $('#topmenu').prepend(htmlToolbarProc+htmlToolbarDoc);
    getToolbarPro(); 
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
    var button_alt = button.find('.info').attr('alt');
    var button_clicktxt = '';
    var processo = $("a[target='ifrVisualizacao']").eq(0).text().trim();
    /*
    if ( name_action == 'nrSEI' ) {
        copyToClipboard(nr_sei);
        button_clicktxt = 'N\u00FAmero copiado!';
    } else if ( name_action == 'nomeDoc' ) {
        copyToClipboard(documento+' (SEI n\u00BA '+nr_sei+')');
        button_clicktxt = 'Nome copiado!'; 
    } else if ( name_action == 'linkDoc' ) {
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        var url_host = window.location.href.split('?')[0];
        var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento+'&id_documento='+id_protocolo;
        copyToClipboard(linkDoc);
        button_clicktxt = 'Link copiado!';
    } else if ( name_action == 'nomelinkDoc' ) {
        var nomeLink = documento+' (SEI n\u00BA '+nr_sei+')';
        var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
        var url_host = window.location.href.split('?')[0];
        var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento+'&id_documento='+id_protocolo;
        var nomeLinkHTML = '<a href="'+linkDoc+'" target="_blank">'+nomeLink+'</a>';
        copyToClipboardHTML(nomeLinkHTML);
        button_clicktxt = 'Nome e link copiado!';
    } else */
    if ( name_action == 'linksArvore' ) {
        button_clicktxt = 'Abrindo...'; 
        var url = jmespath.search(arrayLinksArvore, "[?name=='"+button_txt+"'].url | [0]");
        if ( button_txt == 'Incluir em Bloco' ) {
            parent.execIncluirEmBlocoPro();
        } else if ( button_txt == 'Concluir Processo' ||  button_txt == 'Reabrir Processo' ) {
            parent.execConcluirReabrirProcessoPro(url);
        } else if ( button_txt == 'Copiar n\u00FAmero do processo' ) {
            copyToClipboard(processo);
            button_clicktxt = 'N\u00FAmero copiado!';
        } else if ( button_txt == 'Copiar link do processo' ) {
            var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            var url_host = window.location.href.split('?')[0];
            var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
            copyToClipboard(linkDoc);
            button_clicktxt = 'Link copiado!';
        } else if ( button_txt == 'Copiar n\u00FAmero SEI' ) {
            copyToClipboard(nr_sei);
            button_clicktxt = 'N\u00FAmero copiado!';
        } else if ( button_txt == 'Copiar nome do documento' ) {
            copyToClipboard(documento+' (SEI n\u00BA '+nr_sei+')');
            button_clicktxt = 'Nome copiado!'; 
        } else if ( button_txt == 'Copiar nome com link' ) {
            var nomeLink = documento+' (SEI n\u00BA '+nr_sei+')';
            var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            var url_host = window.location.href.split('?')[0];
            var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento+'&id_documento='+id_protocolo;
            var nomeLinkHTML = '<a href="'+linkDoc+'" target="_blank">'+nomeLink+'</a>';
            copyToClipboardHTML(nomeLinkHTML);
            button_clicktxt = 'Nome e link copiado!';
        } else if ( button_txt == 'Copiar link do documento' ) {
            var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
            var url_host = window.location.href.split('?')[0];
            var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento+'&id_documento='+id_protocolo;
            copyToClipboard(linkDoc);
            button_clicktxt = 'Link copiado!';
        } else {
            parent.targetIfrVisualizacaoPro(url);
        }
    } else if ( name_action == 'configMenu' ) {
        button_clicktxt = 'Abrindo...';
        parent.configFlashMenuPro(arrayLinksArvore);
    }
    button.addClass('tool-item-active').find('.info').text(button_clicktxt);
    button.find('i').addClass('fa-thumbs-up');
    setTimeout(function () {
        button.removeClass('tool-item-active').find('.info').text(button_alt);
        button.find('i').removeClass('fa-thumbs-up');
    }, 2000);
}
function getToolbarPro() {
    if ( typeof parent.dadosProcessoPro !== 'undefined' && typeof parent.dadosProcessoPro.listLinks !== 'undefined' && parent.dadosProcessoPro.listLinks.length > 0 ) {
        $("a[target='ifrVisualizacao']").eq(0).toolbar({
            content: '#toolbar-options-proc',
            position: 'bottom',
            //event: 'click', hideOnClick: true,
            adjustment: 5,
            style: 'menu'
        }).on('toolbarItemClick', function( event, triggerButton ) {
            actionToolbarPro($(this), triggerButton);
        });
        $('.clipboard').not(':first').toolbar({
            content: '#toolbar-options-doc',
            position: 'bottom',
            //event: 'click', hideOnClick: true,
            adjustment: 8,
            style: 'menu'
        }).on('toolbarHidden', function( event ) {
            $(event.currentTarget).removeClass('highlight');
            $(event.currentTarget).next().removeClass('highlight');
        }).on('toolbarShown', function( event ) {
            $(event.currentTarget).addClass('highlight');
            $(event.currentTarget).next().addClass('highlight');
            setTimeout(function () { 
                if ( $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').length > 0 ) {
                    $('.tool-container.tool-bottom.toolbar-menu.animate-standard:visible').not(':first').css('display','none');
                    $('.clipboard .highlight, a[target="ifrVisualizacao"].highlight').not(':first').removeClass('highlight');
                }
            }, 300);
        }).on('toolbarItemClick', function( event, triggerButton ) {
            actionToolbarPro($(this), triggerButton);
        });  
    }
}
function getLinksArvore() {
    var linksArvore = [];
    $('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('Nos[0].acoes') !== -1) { 
            var text = $(this).html();
            var linkDocs = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('href') !== -1) ? substr : null;
            });
            $.each($(linkDocs[0]),function(index, value){
                if ( typeof $(this).attr('href') !== 'undefined' && $(value).attr('href') != '#' && $(value).attr('href') != '' ) { 
                    var name = $(value).find('img').attr('title');
                    var url = $(value).attr('href');
                    var action = '';
                    var data = ( typeof jmespath !== 'undefined' ) ? jmespath.search(parent.iconsFlashMenu, "[?name=='"+name+"'] | [0]") : null;
                        data = ( data === null ) ? {name: name, icon: '', alt: ''} : data;

                    linksArvore.push({ url: url, name: data.name, icon: data.icon, alt: data.alt}); 
                }
            });
            if ( typeof parent.dadosProcessoPro !== 'undefined' && typeof parent.dadosProcessoPro.listLinks !== 'undefined' && parent.dadosProcessoPro.listLinks.length > 0 ) {
                $.each(parent.dadosProcessoPro.listLinks,function(index, value){
                    linksArvore.push(value);
                });
            }
        }
    });
    if ( typeof parent.iconsFlashMenu !== 'undefined' ) {
        linksArvore.push(parent.iconsFlashMenu[0]); 
        linksArvore.push(parent.iconsFlashMenu[1]); 
    }
    return linksArvore;
}
function initChangeUrl() {
    $('a[target="ifrVisualizacao"]').unbind('click').click(function (e) {
        //e.preventDefault();
        var params_url = getParamsUrlPro($(this).attr('href'));
        var id_procedimento = params_url.id_procedimento;
        var id_documento = params_url.id_documento;
        var url_host = window.location.href.split('?')[0];
        var linkDoc = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
            linkDoc = ( typeof id_documento !== 'undefined' ) ? linkDoc+'&id_documento='+id_documento : linkDoc;
        if (typeof id_procedimento !== 'undefined') { 
            parent.window.history.pushState({id_procedimento: id_procedimento, id_documento: id_documento}, '', linkDoc); 
            parent.iHistoryArray.push({id: iHistory, link: linkDoc});
            iHistory++;
        }
    });
}
function initSeiProArvore() {
    arrayLinksArvore = getLinksArvore();
    if ( typeof localStorageRestorePro === "function" && checkConfigValue('menurapido') ) { 
        initToolbarDocs(); 
        //initChangeUrl();
    }
}

$(document).ready(function () { initSeiProArvore() });
