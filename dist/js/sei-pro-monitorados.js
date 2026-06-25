const loadMonitoradosPro = true;
// ADICIONA ACOMPANHAMENTO DE PROCESSOS
// defaultConfigDate / getOptionsConfigDate migrados p/ src/features/monitorados/{domain,store}.js
// (instalados via core-stack; globais preservados por aliasGlobal).
// Cluster add/remover + sync de processo (actMonitoradoPro, checkDataMonitoradoPro,
// storeMonitoradoPro, addMonitoradoPro, syncMonitoradoProProcessData, fallback/anchor...)
// REESCRITO em vanilla ESM: src/features/monitorados/commands.js. Globais via aliasGlobal.
// setPanelMonitorados REESCRITO em vanilla ESM: src/features/monitorados/panel.js
// (render + insert/refresh + dispatcher delegado). Global via aliasGlobal no index.js do bundle.
// appendStarOnProcess, checkFile*/getRemoteFile/restoreMonitoradoServer (server.js),
// keyDatesMonitorado/showDatesMonitorado/updateDatesMonitorado (prazo-row.js),
// openConfigMonitorados/removeMonitorado/updateIndexTableMonitorado/actionToolbarMonitoradoPro
// (extras.js) REESCRITOS em vanilla ESM. Globais via aliasGlobal.
//
// PERMANECEM legados (infra compartilhada / visualização, próximas etapas):
//  - initFunctionsPanelMonitorado: tablesorter + tagsInput + jQuery UI sortable + chosen
//  - getMonitoradosEnviarProcesso / monitoradosLabelOptions / loadScriptMonitoradoTag /
//    checkPageMonitoradosVisualizacao: fluxo da tela de visualização do processo.

// initFunctionsPanelMonitorado REESCRITO em vanilla ESM: panel-lifecycle.js
// (shared/ui: sortable-table + sortable + tags-input; chosen -> <select> nativo).

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
