const loadMonitoradosPro = true;
var statusLoadRemoteFile = true;
var monitorado_loopServer = 0;
// ADICIONA ACOMPANHAMENTO DE PROCESSOS
// defaultConfigDate / getOptionsConfigDate migrados p/ src/features/monitorados/{domain,store}.js
// (instalados via core-stack; globais preservados por aliasGlobal).
// Cluster add/remover + sync de processo (actMonitoradoPro, checkDataMonitoradoPro,
// storeMonitoradoPro, addMonitoradoPro, syncMonitoradoProProcessData, fallback/anchor...)
// REESCRITO em vanilla ESM: src/features/monitorados/commands.js. Globais via aliasGlobal.
// setPanelMonitorados REESCRITO em vanilla ESM: src/features/monitorados/panel.js
// (render + insert/refresh + dispatcher delegado). Global via aliasGlobal no index.js do bundle.
function appendStarOnProcess() {
    var storeMonitorados = getStoreMonitoradoPro()['monitorados'];
    $('.tabelaControle').find('tbody tr').each(function(){
        var _this = $(this);
        // A estrela é exibida em TODOS os processos, inclusive os não visualizados
        // (a marca .processoNaoVisualizado fica no td do número, não no td da estrela).
        var id_procedimento = _this.attr('id');
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento !== null && id_procedimento !== '') ? id_procedimento.replace('P', '') : false;
        if (!id_procedimento) {
            var hrefAtribuicao = _this.find('a[href*="id_procedimento="]').eq(0).attr('href');
            id_procedimento = (typeof hrefAtribuicao !== 'undefined' && hrefAtribuicao) ? getParamsUrlPro(hrefAtribuicao).id_procedimento : false;
        }
        if (!id_procedimento) {
            var hrefProcesso = _this.find('a[href*="acao=procedimento_trabalhar"]').eq(0).attr('href');
            id_procedimento = (typeof hrefProcesso !== 'undefined' && hrefProcesso) ? getParamsUrlPro(hrefProcesso).id_procedimento : false;
        }
        // Sem float: a estrela fica inline e centralizada verticalmente na célula
        // (vertical-align:middle) em relação à descrição do processo.
        var iconStar = (id_procedimento) ? htmlIconMonitorados(id_procedimento) : '';
        var td = _this.find('td').eq(1);
        td.find('.iconMonitoradoPro').remove();
        td.css('vertical-align', 'middle').prepend(iconStar);
    });
}
function checkFileSystemInit() {
    if (!fileSystemPro) {
        getLocalFilePro();
        setTimeout(function(){
            if (!fileSystemPro) {
                var htmlFileSystemStatus =  '<span id="htmlFileSystemStatus" style="display:block;float: left;font-size: 9pt;color: #888;clear: both;top: 0; left:60px;position: absolute;width: calc(100% - 400px);">'+
                                            '   <i class="fas fa-exclamation-triangle vermelhoColor"></i> Seu navegador n\u00E3o possui suporte ao sistema de arquivos local (FileSystem API) ou o usu\u00E1rio n\u00E3o autorizou o seu uso. '+
                                            '   <br> A n\u00E3o utiliza\u00E7\u00E3o dessa tecnologia poder\u00E1 ocasionar a perda de dados dos Processos Monitorados, caso o dados de cache do navegador sejam apagados. '+
                                            '   <br><a onclick="initFileSystem(); setPanelMonitorados(\'refresh\');" style="font-size: 9pt;color: blue; text-decoration: underline;">Re-autorize</a> a aplica\u00E7\u00E3o ou utilize outro navegador compat\u00EDvel.'+
                                            '</span>';
                $('#htmlFileSystemStatus').remove();
                $('#monitoradosProActions').append(htmlFileSystemStatus);
            }
        }, 1000);
    }
}
function checkFileRemoteMonitorado(mode, data = false) {
    if (mode == 'get' && typeof getServerAtividades !== 'undefined' && (typeof checkLoadMonitoradosProcPro === 'undefined' || !checkLoadMonitoradosProcPro) ) {
        var action = 'check_monitorados';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
    } else if (mode == 'set') {
        if (data) {
            var storeMonitorados = getStoreMonitoradoPro();
            var datetime_server = moment(data.datetime,'YYYY-MM-DD HH:mm:ss');
            var datetime_local = moment(storeMonitorados.datetime,'YYYY-MM-DD HH:mm:ss');
            if (statusLoadRemoteFile && datetime_server.isValid() && datetime_local.isValid() && datetime_server > datetime_local.add(1,'minutes')) {
                getConfigDatetimeMonitorado();
                setTimeout(function(){
                    getRemoteFileMonitorado();
                    statusLoadRemoteFile = false;
                    setTimeout(function(){
                        statusLoadRemoteFile = true;
                    }, 5000);
                    if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('getRemoteFileMonitorado', storeMonitorados, datetime_server.format('YYYY-MM-DD HH:mm:ss'), datetime_local.add(1,'minutes').format('YYYY-MM-DD HH:mm:ss'));
                }, 3000);
            }
        }
    }
}
function checkFileLocalMonitorado() {
        getLocalFilePro();
        setTimeout(function(){ 
            if (fileSystemPro && fileSystemContentPro && typeof fileSystemContentPro === 'object' && typeof moment().isoWeekdayCalc === 'function' && fileSystemContentPro.hasOwnProperty('monitorados') && fileSystemContentPro.monitorados.length > 0 ) {
                persistMonitoradoStore(fileSystemContentPro);
                initPanelMonitorados();
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('checkFileLocalMonitorado => backup setPanelMonitorados');
            } else if (typeof perfilLoginAtiv !== 'undefined' && perfilLoginAtiv !== null) {
                getRemoteFileMonitorado();
                if (typeof moment().isoWeekdayCalc !== 'function') $.getScript(URL_SPRO+"js/lib/moment-weekday-calc.js");
            }
        }, 500);
}
function getRemoteFileMonitorado() {
    if (monitorado_loopServer < 5) {
        var action = 'get_monitorados';
        var param = {
            action: action
        };
        getServerAtividades(param, action);
        monitorado_loopServer++;
    }
}
function restoreMonitoradoServer(data) {
    var storeMonitorados = getStoreMonitoradoPro();
    if (typeof storeMonitorados !== 'undefined' && typeof storeMonitorados.monitorados !== 'undefined' && typeof data !== 'undefined' && typeof data.monitorados !== 'undefined' && typeof data.config.colortags !== 'undefined') {
        storeMonitorados.monitorados = data.monitorados;
        storeMonitorados.config.colortags = data.config.colortags;
        persistMonitoradoStore(storeMonitorados, { remote: false });
        setLocalFilePro(storeMonitorados);
        initPanelMonitorados();
        if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('restoreMonitoradoServer => backup setPanelMonitorados');
    }
}
function keyDatesMonitorado(e) {
    if(e.which == 13) {
        var target = (e && e.target) ? e.target : (e && e.currentTarget) ? e.currentTarget : (e && e.path && e.path.length > 0) ? e.path[0] : false;
        if (target) showDatesMonitorado(target, 'hide');
    }
}
function initFunctionsPanelMonitorado(TimeOut = 9000) {
    if (typeof window.seiProMonitoradoInitTimer !== 'undefined' && window.seiProMonitoradoInitTimer && TimeOut == 9000) {
        clearTimeout(window.seiProMonitoradoInitTimer);
        window.seiProMonitoradoInitTimer = false;
    }
    if (TimeOut <= 0) { return; }
    var hasTagsInput = typeof $.fn.tagsInput === 'function';
    var hasTableSorter = typeof $.fn.tablesorter === 'function';
    var hasAutocomplete = typeof $.fn.autocomplete === 'function';
    if (hasTagsInput && hasTableSorter && hasAutocomplete) {

        var idTableMonitorado = '#monitoradoTablePro';
        var tableMonitorados = $(idTableMonitorado);
        if (!tableMonitorados.length) { return; }
        if (tableMonitorados.data('sei-pro-monitorado-init') === true) { return; }
        if (tableMonitorados.data('sei-pro-monitorado-init-pending') === true) { return; }
        tableMonitorados.data('sei-pro-monitorado-init-pending', true);
        tableMonitorados.data('sei-pro-monitorado-init', true);
        window.seiProMonitoradoInitTimer = false;

        initChosenReplace('panel');

        $('.monitoradoTagsPro').each(function(){
            var _input = $(this);
            if (_input.data('sei-pro-tags-init') === true) return;
            _input.data('sei-pro-tags-init', true);
            _input.tagsInput({
              interactive: true,
              placeholder: 'Adicionar etiqueta',
              minChars: 2,
              maxChars: 100,
              limit: 8,
              autocomplete_url: '',
              autocomplete: {'source': sugestEtiquetaPro('monitorado') },
              hide: true,
              delimiter: [';'],
              unique: true,
              removeWithBackspace: true,
              onAddTag: saveFollowEtiqueta,
              onRemoveTag: saveFollowEtiqueta,
              onChange: saveFollowEtiqueta
            });
        });
        
        var tagName = getOptionsPro('filterTag_monitorados');
        if (typeof tagName !== 'undefined' && tagName != '') {
            setTimeout(function(){ 
                $('.tableMonitorados .tagTableText_'+tagName).eq(0).trigger('click');
                if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage')) console.log('tagName',tagName);
            }, 500);
        }
        tableMonitorados.tablesorter({
            sortLocaleCompare : true,
            textExtraction: {
                2: function (elem, table, cellIndex) {
                  var target = $(elem).find('.dateboxDisplay').eq(0);
                  var text_date = target.data('time-sorter');
                  return text_date;
                },
                7: function (elem, table, cellIndex) {
                    var target = parseInt($(elem).data('order'));
                    return target;
                }
              },
              widgets: ["saveSort", "filter"],
              widgetOptions: {
                  saveSort: true,
                  filter_hideFilters: true,
                  filter_columnFilters: true,
                  filter_saveFilters: true,
                  filter_hideEmpty: true,
                  filter_excludeFilter: {}
              },
              sortReset: true,
              headers: {
                  0: { sorter: false, filter: false },
                  1: { filter: true },
                  2: { filter: true },
                  3: { filter: true },
                  4: { filter: true }
              }
        }).on("sortEnd", function (event, data) {
            checkboxRangerSelectShift(idTableMonitorado);
        }).on("filterEnd", function (event, data) {
            checkboxRangerSelectShift(idTableMonitorado);
            var caption = $(this).find("caption").eq(0);
            var tx = caption.text();
                caption.text(tx.replace(/\d+/g, data.filteredRows));
                $(this).find("tbody > tr:visible > td > input").prop('disabled', false);
                $(this).find("tbody > tr:hidden > td > input").prop('disabled', true);
        });
        checkboxRangerSelectShift(idTableMonitorado);

        tableMonitorados.sortable({
            items: 'tr',
            cursor: 'grabbing',
            handle: '.sorterTrMonitorado',
            forceHelperSize: true,
            opacity: 0.5,
            axis: 'y',
            dropOnEmpty: false,
            update: function(event, ui) {
                setTimeout(function(){ 
                    var storeMonitorados = getStoreMonitoradoPro();
                    $('#monitoradoTablePro').find('tbody tr').each(function(index, value){
                        var _tr = $(this);
                        var id_procedimento = _tr.data('id_procedimento');
                        var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);

                        if (monitoradoIndex >= 0) {
                                var newIndex = index+1;
                                var item = storeMonitorados.monitorados[monitoradoIndex];
                                    item.order = newIndex;
                                storeMonitorados.monitorados[monitoradoIndex] = item;
                        }
                    });
                    persistMonitoradoStore(storeMonitorados);
                    $('#monitoradoTablePro').find('tbody tr').each(function(index){
                        $(this).attr('data-index', index).find('td').last().attr('data-order', index + 1);
                    });
                }, 500);
            }
        });

        // Um único observer no tbody (subtree + filtro de class) substitui um observer por linha.
        var tbodyMonitorado = tableMonitorados.find('tbody').get(0);
        var observerTableMonitorado = new MutationObserver(function() {
            var count_all = tableMonitorados.find('tr.infraTrMarcada').length;
            if (count_all > 0) {
                $('#monitoradosProActions').find('.iconMonitorados_remove').show().find('.fa-layers-counter').text(count_all);
            } else {
                $('#monitoradosProActions').find('.iconMonitorados_remove').hide();
            }
        });
        setTimeout(function(){
            if (tbodyMonitorado) {
                observerTableMonitorado.observe(tbodyMonitorado, {
                    attributes: true,
                    attributeFilter: ['class'],
                    subtree: true
                });
            }
            checkboxRangerSelectShift();
            checkFileRemoteMonitorado('get');
            tableMonitorados.removeData('sei-pro-monitorado-init-pending');
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('initFunctionsPanelMonitorado => '+TimeOut);
        }, 500);

        var filterMonitorado = tableMonitorados.find('.tablesorter-filter-row').get(0);
        if (typeof filterMonitorado !== 'undefined') {
            var observerFilterTableMonitorado = new MutationObserver(function(mutations) {
                var _this = $(mutations[0].target);
                var _parent = _this.closest('table');
                var iconFilter = _parent.find('.filterIfraTable');
                var checkIconFilter = iconFilter.hasClass('active');
                var hideme = _this.hasClass('hideme');
                if (hideme && checkIconFilter) {
                    iconFilter.removeClass('active');
                }
            });
            setTimeout(function(){ 
                var htmlFilterMonitorado = '<div class="btn-group filterIfraTable" role="group" style="right: 30px; top: -15px;z-index: 999; position: absolute;">'+
                                    '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Baixar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                    '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                    '       <span class="text">Copiar</span>'+
                                    '   </button>'+
                                    '   <button type="button" onclick="filterIfraTable(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light '+(tableMonitorados.find('tr.tablesorter-filter-row').hasClass('hideme') ? '' : 'active')+'">'+
                                    '       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>'+
                                    '       Pesquisar'+
                                    '   </button>'+
                                    '</div>';

                tableMonitorados.find('thead .filterIfraTable').remove();
                tableMonitorados.find('thead').prepend(htmlFilterMonitorado);
                observerFilterTableMonitorado.observe(filterMonitorado, {
                    attributes: true
                });
            }, 500);
        }
    } else {
        if (typeof window.seiProMonitoradoInitTimer !== 'undefined' && window.seiProMonitoradoInitTimer) { return; }
        window.seiProMonitoradoInitTimer = setTimeout(function(){ 
            window.seiProMonitoradoInitTimer = false;
            if (typeof $.fn.tagsInput !== 'function' && TimeOut == 9000) { $.getScript((URL_SPRO+"js/lib/jquery.tagsinput-revisited.js")) }
            if (typeof $.fn.tablesorter !== 'function' && TimeOut == 9000) { $.getScript((URL_SPRO+"js/lib/jquery.tablesorter.combined.min.js")) }
            initFunctionsPanelMonitorado(TimeOut - 100); 
            if(typeof verifyConfigValue !== 'undefined' && verifyConfigValue('debugpage'))console.log('Reload initFunctionsPanelMonitorado'); 
        }, 500);
    }
}

function openConfigMonitorados() {
    var textBox =   '<table style="font-size: 9pt;width: 100%;" class="seiProForm">'+
                    '   <tr style="height: 40px;">'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <a id="backup_monitorado" style="cursor:pointer" onclick="initDownloadLocalFilePro(this)" class="newLink"><i class="fas fa-download azulColor"></i>Baixar Processos Monitorados</a>'+
                    '           </td>'+
                    '          <td style="vertical-align: bottom; text-align: left;" class="label">'+
                    '               <input type="file" id="selectLocalFilesPro" onchange="loadLocalFilePro()" value="Import" style="display: none" />'+
                    '               <a id="restore_monitorado" style="cursor:pointer;float: right;" onclick="initLoadLocalFilePro()" class="newLink"><i class="fas fa-upload azulColor"></i>Carregar Processos Monitorados</a>'+
                    '           </td>'+
                    '       <td>'+
                    '       </td>'+
                    '   </tr>'+
                    '</table>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div class="dialogBoxDiv"> '+textBox+'</span>')
        .dialog({
        	width: 450,
            title: 'Configura\u00E7\u00F5es: Processos Monitorados',
            open: function(){
                getLocalFilePro();
            }
    });
}
function actionToolbarMonitoradoPro(this_, triggerButton) {
    var button = $(triggerButton);
    var name_action = button.data('action');
    if (name_action == 'etiqueta') {
        showFollowEtiqueta(this_, 'show');
    } else if (name_action == 'remove') {
        removeMonitorado(this_);
    } else if (name_action == 'dates') {
        showDatesMonitorado(this_, 'show');
    } else if (name_action == 'descricao') {
        editMonitoradoDesc(this_);
    }
}
function updateDatesMonitorado(this_) {
    var storeMonitorados = getStoreMonitoradoPro();
    var index = parseInt($(this_).closest('tr').data('index'));
    var id_procedimento = parseInt($(this_).closest('tr').data('id_procedimento'));
    var monitoradoIndex = findMonitoradoIndex(storeMonitorados, id_procedimento);
    if (monitoradoIndex < 0) { return; }
    var config = getOptionsConfigDate(monitoradoIndex);
    if ($(this_).val().trim() != '') {
            if ($(this_).val().trim() != config.date && config.date != '' && $(this_).val().trim() != '' ) {
                config.selectdoc = false;
                config.setdate = true;
            }
            config.date = ($(this_).val().trim() != '') ? $(this_).val().trim() : config.date;
            config.dateTo = moment().format('YYYY-MM-DD');
        var htmlDatePreview = getDatesPreview(config);
        var followLink = $(this_).closest('td').find('.followLink');
        if (followLink.length > 0) {
            $(this_).closest('td').find('.info_dates_monitorado').html(htmlDatePreview+followLink[0].outerHTML);
        }
        storeMonitorados['monitorados'][monitoradoIndex]['configdate'] = config;
        persistMonitoradoStore(storeMonitorados);
    }
}
function showDatesMonitorado(this_, mode) {
    if ($(this_).closest('#frmAtividadeListar').length > 0) {
        updateDatesMonitorado(this_);
    } else {
        if(!$(this_).closest('tr').find('.monitoradoConfigDates').is(':hover')) {
            $(this_).closest('table').find('.info_dates_monitorado').show();
            $(this_).closest('table').find('.info_dates_monitorado_txt').hide();
            $(this_).closest('table').find('.followLinkDates').show();
            infraTooltipOcultar();
            updateDatesMonitorado(this_);
        }
        if(mode == 'show') {
            $(this_).closest('td').find('.followLinkDates').hide();
            $(this_).closest('tr').find('.info_dates_monitorado').hide();
            $(this_).closest('tr').find('.info_dates_monitorado_txt').css('display','inline-flex').find('input.monitoradoDatesPro').focus().trigger('click');
        }
        if ($(this_).closest('tr').find('.info_dates_monitorado').text().trim() != '') {
            $(this_).closest('td').removeClass('info_dates_follow_empty');
        } else {
            $(this_).closest('td').addClass('info_dates_follow_empty');
        }
    }
}
function getMonitoradosEnviarProcesso() {
    var ifrVisualizacao = $($ifrVisualizacao).contents();
    var storeMonitorados = getStoreMonitoradoPro();
    var id_procedimento = String(getParamsUrlPro(window.location.href).id_procedimento);
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var htmlAddMonitorado =    '<div id="divSinAdicionarMonitorados" class="infraDivCheckbox" style="position: absolute;top: 100%;left: 0;">'+
                        '   <input type="checkbox" id="chkSindicionarMonitorados" onchange="parent.actionMonitoradoCheckbox(this)" name="chkSindicionarMonitorados" class="infraCheckbox" tabindex="510" '+(value ? 'checked' : '')+'>'+
                        '   <label id="lblSinAdicionarMonitorados" for="chkSindicionarMonitorados" accesskey="" class="infraLabelCheckbox">Manter processo em Processos Monitorados</label>'+
                        '   <div class="monitoradosLabelOptions seiProForm" style="display:'+(value ? 'block' : 'none')+';font-size: 9pt;clear: both;">'+
                        monitoradosLabelOptions(id_procedimento)+
                        '   </div>'+
                        '</div>';
    if (ifrVisualizacao.find('#divSinAdicionarMonitorados').length == 0) ifrVisualizacao.find('#frmAtividadeListar').append(htmlAddMonitorado);
    loadStylePro(URL_SPRO+"css/sei-pro.css", ifrVisualizacao.find('head'), ifrVisualizacao);
    loadStylePro((localStorage.getItem('seiSlim') ? URL_SPRO+"css/fontawesome.pro.min.css" : URL_SPRO+"css/fontawesome.min.css"), ifrVisualizacao.find('head'), ifrVisualizacao);
    loadScriptMonitoradoTag(ifrVisualizacao);
}
function monitoradosLabelOptions(id_procedimento) {
    var storeMonitorados = getStoreMonitoradoPro();
    var value = jmespath.search(storeMonitorados.monitorados, "[?id_procedimento=='"+id_procedimento+"'] | [0]");
    var value = (value !== null) ? value : false;   
    var config = (value && typeof value.configdate !== 'undefined' && value.configdate !== null) ? value.configdate : '';
    var tagsMonitorado = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? value.etiquetas : false;
        tagsMonitorado = (tagsMonitorado && tagsMonitorado.length > 0) ? value.etiquetas.join(';') : '';
    var tagsMonitoradoHtml = (typeof value.etiquetas !== 'undefined' && value.etiquetas !== null) ? $.map(value.etiquetas, function (i) { return getHtmlEtiqueta(i,'monitorado') }).join('') : '';

    var monitoradosOptions = '       <table style="font-size: 10pt;width: 100%;min-width: 610px;" class="seiProForm">'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0">'+
                            '              <td style="vertical-align: bottom; text-align: left;" class="label">'+
                            '                   <label for="categoria_monitorado"><i class="iconPopup iconSwitch fas fa-layer-group cinzaColor"></i>Categoria:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   '+selectCategoryMonitorado((value ? value.categoria : ''), 'parent.changeCategoryMonitorado', true, id_procedimento).replace('<select ', '<select id="categoria_monitorado" ')+
                            '               </td>'+
                            '               <td style="vertical-align: bottom;" class="label">'+
                            '                   <label class="last" for="monitoradoPrazoSend"><i class="iconPopup iconSwitch fas fa-stopwatch cinzaColor" style="float: initial;"></i>Prazo:</label>'+
                            '               </td>'+
                            '               <td>'+
                            '                   <span class="info_dates_monitorado_txt">'+
                            '                       <input id="monitoradoPrazoSend" value="'+(config && typeof config.date !== 'undefined' && config.date !== null ? config.date : '')+'" style="width: 120px; background-color: #f9fafa;" onblur="parent.showDatesMonitorado(this, \'hide\')" onkeypress="parent.keyDatesMonitorado(event)" type="date" class="monitoradoDatesPro" name="monitoradoPrazoSend">'+
                            '                       <a class="newLink monitoradoConfigDates" onclick="parent.openBoxConfigDates(this)" style="padding: 5px 8px;margin: 8px 2px 0 10px;font-size: 10pt;" onmouseover="return infraTooltipMostrar(\'Op\u00E7\u00F5es\');" onmouseout="return infraTooltipOcultar();">'+
                            '                          <i class="fas fa-cog"></i>'+
                            '                       </a>'+
                            '                   </span>'+
                            '               </td>'+
                            '          </tr>'+
                            '          <tr data-id_procedimento="'+id_procedimento+'" data-index="0" style="height: 40px;">'+
                            '               <td align="left" class="tdmonitorado_tags" data-etiqueta-mode="monitorado" colspan="4">'+
                            '                   <span class="info_tags_follow">'+tagsMonitoradoHtml+
                            '                   </span>'+
                            '                   <span class="info_tags_follow_txt" style="display:none;margin-top: -8px !important;">'+
                            '                       <input value="'+tagsMonitorado+'" class="monitoradoTagsPro" name="monitoradoTagsPro">'+
                            '                   </span>'+
                            '                   <a class="newLink followLinkTagsAdd_send" style="font-size: 10pt;" onclick="parent.showFollowEtiqueta(this, \'show\', \'monitorado\')" onmouseout="return infraTooltipOcultar();"><i class="fas fa-tags"></i> Adicionar etiqueta</a>'+
                            '               </td>'+
                            '          </tr>'+
                            '       </table>';
    return monitoradosOptions;
}
function loadScriptMonitoradoTag(iFrame) {
    var scriptText =    '<script data-config="config-seipro-monitorado">\n'+
                        '   function initMonitoradoTagIframe(TimeOut = 9000) {\n'+
                        '       if (TimeOut <= 0) { return; }\n'+
                        '       if (typeof $().tagsInput !== \'undefined\') {\n'+
                        '           getMonitoradoTagIframe();\n'+
                        '       } else {\n'+
                        '           $.getScript(\''+URL_SPRO+'js/lib/jquery.tagsinput-revisited.js\');\n'+
                        '           setTimeout(function(){\n'+
                        '               initMonitoradoTagIframe(TimeOut - 100);\n'+
                        '               console.log(\'Reload initMonitoradoTagIframe\');\n'+
                        '           }, 500);\n'+
                        '       }\n'+
                        '   }\n'+
                        '   function getMonitoradoTagIframe() {\n'+
                        '       $(\'.monitoradoTagsPro\').tagsInput({\n'+
                        '           interactive: true,\n'+
                        '           placeholder: \'Adicionar etiqueta\',\n'+
                        '           minChars: 2,\n'+
                        '           maxChars: 100,\n'+
                        '           limit: 8,\n'+
                        '           autocomplete_url: \'\',\n'+
                        '           autocomplete: {\'source\': parent.sugestEtiquetaPro(\'monitorado\') },\n'+
                        '           hide: true,\n'+
                        '           delimiter: [\';\'],\n'+
                        '           unique: true,\n'+
                        '           removeWithBackspace: true,\n'+
                        '           onAddTag: parent.saveFollowEtiqueta,\n'+
                        '           onRemoveTag: parent.saveFollowEtiqueta,\n'+
                        '           onChange: parent.saveFollowEtiqueta\n'+
                        '         });\n'+
                        '   }\n'+
                        '   initMonitoradoTagIframe();\n'+
                        '</script>';
    $(scriptText).appendTo(iFrame.find('head'));
}
function checkPageMonitoradosVisualizacao() {
    waitLoadPro($($ifrVisualizacao).contents(), '#frmAtividadeListar[action*="acao=procedimento_enviar"]', infraBarraComandos, getMonitoradosEnviarProcesso);
}
function removeMonitorado(this_) { 
    var storeMonitorados = getStoreMonitoradoPro();
    var index = parseInt($(this_).closest('tr').data('index'));
    if (typeof index && parseInt(index) >= 0) {
        storeMonitorados['monitorados'].splice(parseInt(index),1);
        $(this_).closest('tr').trigger('click').effect('highlight').effect('highlight').fadeOut( "slow", function() {
            $(this).remove();
            updateIndexTableMonitorado();
            updateCountTableMonitorado();
            persistMonitoradoStore(storeMonitorados);
        });
    }
}
function updateIndexTableMonitorado() {
    $('.tableFollow').find('tbody tr').each(function(index){
        $(this).data('index', index);
    });
}
