var dadosProcessoPro = {};
var dadosProjetosObj = [];
var dadosEtapasObj = [];
var dadosProjetosUniq = [];
var feriadosNacionaisProArray = [];
var configGeralObj = [];
var ganttProject = [];
var ganttProjectSelect = [];
var arrayIDProcedimentos = [];
var statusPesquisaDadosProcedimentos = true;
var dialogBoxPro = false;
var iHistory = 0;
var iHistoryCurrent = 0;
var iHistoryArray = [];
var iconsFlashMenu = [
                    {name: 'Copiar n\u00FAmero do processo', icon: 'fas fa-copyright', alt: ''},
                    {name: 'Copiar link do processo', icon: 'fas fa-link', alt: ''},
                    {name: 'Incluir Documento', icon: 'fas fa-file-alt', alt: 'Incluir Novo Documento'},
                    {name: 'Registrar Documento Externo', icon: 'fa-file-import', alt: 'Registrar Doc. Externo'},
                    {name: 'Consultar/Alterar Processo', icon: 'fa-file-signature', alt: ''},
                    {name: 'Iniciar Processo Relacionado', icon: 'fa-sync-alt', alt: 'Iniciar Proc. Relacionado'},
                    {name: 'Acompanhamento Especial', icon: 'fas fa-eye', alt: ''},
                    {name: 'Enviar Processo', icon: 'fas fa-share-square', alt: ''},
                    {name: 'Atualizar Andamento', icon: 'fas fa-globe-americas', alt: ''},
                    {name: 'Atribuir Processo', icon: 'fa-user-friends', alt: ''},
                    {name: 'Duplicar Processo', icon: 'fa-copy', alt: ''},
                    {name: 'Relacionamentos do Processo', icon: 'fa-user-friends', alt: ''},
                    {name: 'Gerenciar Disponibiliza\u00E7\u00F5es de Acesso Externo', icon: 'fa-users-cog', alt: 'Gerenciar Acesso Externo'},
                    {name: 'Anota\u00E7\u00F5es', icon: 'fas fa-sticky-note', alt: ''},
                    {name: 'Sobrestar Processo', icon: 'fa-pause-circle', alt: ''},
                    {name: 'Anexar Processo', icon: 'fa-paperclip', alt: ''},
                    {name: 'Gerar Arquivo PDF do Processo', icon: 'fa-file-pdf', alt: 'Gerar Arquivo PDF'},
                    {name: 'Gerar Arquivo ZIP do Processo', icon: 'fa-file-archive', alt: 'Gerar Arquivo ZIP'},
                    {name: 'Gerenciar Ponto de Controle', icon: 'fa-flag', alt: 'Gerenciar Ponto de Controle'},
                    {name: 'Gerenciar Marcador', icon: 'fa-tags', alt: ''},
                    {name: 'Concluir Processo', icon: 'fa-folder-open', alt: 'Concluir/Reabrir Processo'},
                    {name: 'Ci\u00EAncia', icon: 'fa-thumbs-up', alt: ''},
                    {name: 'Enviar Correspond\u00EAncia Eletr\u00F4nica', icon: 'fa-envelope-open-text', alt: 'Enviar Correspond\u00EAncia'},
                    {name: 'Incluir em Bloco', icon: 'fa-layer-group', alt: ''},
                    {name: 'Reabrir Processo', icon: 'fa-folder-open', alt: 'Concluir/Reabrir Processo'}
                ];
var iconsFlashDocMenu = [
                    {name: 'Copiar n\u00FAmero SEI', icon: 'fas fa-copyright', alt: ''},
                    {name: 'Copiar nome do documento', icon: 'fas fa-file-alt', alt: ''},
                    {name: 'Copiar link do documento', icon: 'fas fa-link', alt: ''},
                    {name: 'Copiar nome com link', icon: 'fa-external-link-alt', alt: ''}
                ];
var rangeProjetosPro = "Projetos";
var rangeEtapasPro = "Etapas";
var rangeFeriadosNacionaisPro = "FeriadosNacionais";
var rangeConfigGeral = "ConfigGeral";

var iconSeiPro = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAFXWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNS41LjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iCiAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIKICAgIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgdGlmZjpJbWFnZUxlbmd0aD0iMjU2IgogICB0aWZmOkltYWdlV2lkdGg9IjI1NiIKICAgdGlmZjpSZXNvbHV0aW9uVW5pdD0iMiIKICAgdGlmZjpYUmVzb2x1dGlvbj0iNzIuMCIKICAgdGlmZjpZUmVzb2x1dGlvbj0iNzIuMCIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjI1NiIKICAgZXhpZjpQaXhlbFlEaW1lbnNpb249IjI1NiIKICAgZXhpZjpDb2xvclNwYWNlPSIxIgogICBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIgogICBwaG90b3Nob3A6SUNDUHJv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';

var html_initContentPro = '<div class="sheetsUpdate sheetsForm" id="sheetsCompleteEtapaForm" style="display:none"></div>';
if ( $('#sheetsCompleteEtapaForm').length == 0 ) { $('#divInfraBarraSistema').append(html_initContentPro) }

function insertFontIcon(iframeDoc) {
    if ( iframeDoc.find('link[datastyle="seipro-fonticon"]').length == 0 ) {
        $("<link/>", {
           rel: "stylesheet",
           type: "text/css",
           datastyle: "seipro-fonticon",
           href: URL_SEIPRO+"css/fontawesome.min.css"
        }).appendTo(iframeDoc.find('head'));
    }
}
function waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut = 3000) {
  if (TimeOut <= 0) { 
      //console.log("Script não executado: TIMEOUT"); 
      return; 
  }
  setTimeout(function () {
    if (Obj.find(ElemRaiz).find(Elem).length == 0) {
      //console.log(ElemRaiz + ": find -> " + Elem + " : carregando...");
      waitLoadPro(Obj, ElemRaiz, Elem, func, TimeOut - 100);
    } else {
      //console.log(ElemRaiz + " : Script executado.");
      func();
    }
  }, 100);
}
function execArvorePro(func) {
  var Obj = $("#ifrArvore").contents();
  waitLoadPro(Obj, "#divArvore > div", "a[target='ifrVisualizacao']", function () {
    func();
    Obj.find("#divArvore > div > div:hidden").each(function () {
      var idPasta = Obj.find(this).attr("id").substr(3);
      //console.log(idPasta + " -> evento click adicionado.");
      Obj.find("#ancjoin" + idPasta).click(function () {
        waitLoadPro(Obj, "#div" + idPasta, "a[target='ifrVisualizacao']", func);
        $(this).off("click");
      });
    });
  });
}
function getDadosProcedimentosControlar() {
    var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
    $('#frmProcedimentoControlar').find('a.processoVisualizado').not('.processoNaoVisualizado, .processoNaoVisualizadoSigiloso, .processoVisualizadoSigiloso, .processoCredencialAssinaturaSigiloso').each(function(){
        var id_procedimento = String(getParamsUrlPro($(this).attr('href')).id_procedimento);
        if (  jmespath.search(storeRecebimento, "[?id_procedimento=='"+id_procedimento+"'] | length(@)") == 0  ) {
            arrayIDProcedimentos.push(id_procedimento);
        }
    });
    if (arrayIDProcedimentos.length) {
        var progressoBar =  '<div id="newFiltroProgress" style="display: inline-block;position: absolute;margin: 30px 0 0 0; width: '+($('#selectGroupTablePro').width()-35)+'px">'+
                            '    <i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: -4px 8px 0 0;"></i>'+
                            '    <i onclick="breakDadosProcedimentosControlar()" class="fas fa-times-circle cinzaColor" style="float: right;margin: -4px;padding-left: 10px;cursor: pointer;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Cancelar pesquisa\')"></i>'+
                            '    <div onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar(\'Encontrando datas dos processos da unidade...\')" class="selectProgressoBar" id="selectProgressoBar_GroupTable"></div>'+
                            '</div>';
        if ($('#newFiltroProgress').length == 0) { 
            $('#selectGroupTablePro').before(progressoBar);
            setTimeout(function(){ 
                $('#selectProgressoBar_GroupTable').progressbar({value: 0, max: arrayIDProcedimentos.length });
            }, 800);
            loopIDProcedimentos();
        }
    }
}
function cancelDadosProcedimentosControlar() {
    statusPesquisaDadosProcedimentos = false;
    $('#newFiltroProgress').remove();
}
function breakDadosProcedimentosControlar() {
    cancelDadosProcedimentosControlar();
    infraTooltipOcultar();
    localStorageStorePro('selectGroupTablePro', '');
}
function loopIDProcedimentos() {
    if(arrayIDProcedimentos.length && statusPesquisaDadosProcedimentos == true) {
        var i = arrayIDProcedimentos[0];
        arrayIDProcedimentos.splice(0,1);
        getDadosIframeProcessoPro(String(i), 'dados');
        if ($('#selectProgressoBar_GroupTable .ui-progressbar-value').length) {
            var valueProgress = parseFloat($('#selectProgressoBar_GroupTable').attr('aria-valuemax'))-arrayIDProcedimentos.length;
            $('#selectProgressoBar_GroupTable').progressbar({ value: valueProgress });
            initTableTag($('#selectGroupTablePro').val());
        }
    } else {
        $('#newFiltroProgress').remove();
    }
}
function configFlashMenuTrPro(value, color, state, mode) { 
    var index = randomString(4);
    return  '        <tr>'+
            '           <td>'+
            '               <p><i class="iconPopup fa '+value.icon+' '+color+'"></i><span class="info">'+value.name+'</span></p>'+
            '           </td>'+
            '           <td>'+
            '               <div class="onoffswitch">'+
            '                   <input type="checkbox" data-name="'+value.name+'" onchange="changeFlashMenuPro(this, \''+mode+'\')" name="onoffswitch" class="onoffswitch-checkbox" id="itemFlashMenu_'+index+'" tabindex="0" '+state+'>'+
            '                   <label class="onoffswitch-label" for="itemFlashMenu_'+index+'"></label>'+
            '               </div>'+
            '           </td>'+
            '        </tr>';
}
function configFlashMenuPro(arrayLinksArvore) { 
    var selectedItensMenu = ( typeof localStorageRestorePro('configViewFlashMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashMenuPro')) ) ? localStorageRestorePro('configViewFlashMenuPro') : [['Incluir Documento'],['Consultar/Alterar Processo'],['Atribuir Processo']];
    var selectedItensDocMenu = ( typeof localStorageRestorePro('configViewFlashDocMenuPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configViewFlashDocMenuPro')) ) ? localStorageRestorePro('configViewFlashDocMenuPro') : [['Copiar n\u00FAmero SEI'],['Copiar nome do documento'],['Copiar link do documento']];

    var textBox =   '<h3 style="font-weight: bold; color: #666;"><i class="iconPopup fa fa-scroll cinzaColor"></i> Menu r\u00E1pido do processo</h3>'+
                    '<div class="details-container" style="height: 200px; overflow-y: scroll;">'+
                    '   <table class="tableInfo popup-wrapper tableZebra tableFlashMenu" style="font-size: 10pt;width: 100%;">';
    
        $.each(selectedItensMenu,function(index, value){
            if ( jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'proc');
            }         
        });
        $.each(iconsFlashMenu,function(index, value){
            if ( jmespath.search(selectedItensMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'proc');
            }            
        });
        textBox +=  '   </table>'+
                    '</div>';
    
        textBox +=   '<h3 style="font-weight: bold;border-top: 2px solid #d6d6d6;color: #666;padding-top: 10px;"><i class="iconPopup fa fa-file cinzaColor"></i> Menu r\u00E1pido dos documentos</h3>'+
                    '<div class="details-container" style="height: 100px; overflow-y: scroll;">'+
                    '   <table class="tableInfo popup-wrapper tableZebra tableFlashDocMenu" style="font-size: 10pt;width: 100%;">';
    
        $.each(selectedItensDocMenu,function(index, value){
            if ( jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | length(@)") > 0 ) {
                var data = jmespath.search(iconsFlashDocMenu, "[?name=='"+value+"'] | [0]");
                    textBox += configFlashMenuTrPro(data, 'azulColor', 'checked', 'doc');
            }         
        });
        $.each(iconsFlashDocMenu,function(index, value){
            if ( jmespath.search(selectedItensDocMenu, "[?[0]=='"+value.name+"'] | length(@)") == 0 ) {
                textBox += configFlashMenuTrPro(value, 'cinzaColor', '', 'doc');
            }            
        });
        textBox +=  '   </table>'+
                    '</div>';

    $('#dialogBoxPro')
        .html('<div class="alertaBoxPro"> '+textBox+'</div>')
        .dialog({
            title: "Personalizar Menu R\u00E1pido",
        	width: 600,
        	buttons: [{
                text: "Ok",
                click: function() { 
                    document.getElementById('ifrArvore').contentWindow.location.reload();
                    $(this).dialog('close');
                }
            }]
    }).on('dialogclose', function(event) {
         document.getElementById('ifrArvore').contentWindow.location.reload();
     });
    $(".tableFlashMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'proc');
        }
    });
    $(".tableFlashDocMenu").sortable({
        items: 'tr',
        cursor: 'pointer',
        axis: 'y',
        dropOnEmpty: false,
        start: function (e, ui) {
            ui.item.addClass("selected");
        },
        stop: function (e, ui) {
            ui.item.removeClass("selected");
            changeFlashMenuPro(ui.item, 'doc');
        }
    });
}
function changeFlashMenuPro(this_, mode) {
    var configView = (mode == 'proc') ? 'configViewFlashMenuPro' : 'configViewFlashDocMenuPro';
    var arrayShowItensMenu = []
    $(this_).closest('table').find('input').each(function(){
        if ($(this).is(':checked')) {
            arrayShowItensMenu.push([$(this).attr('data-name')]);
            $(this).closest('tr').find('.iconPopup').addClass('azulColor').removeClass('cinzaColor');
        } else {
            $(this).closest('tr').find('.iconPopup').removeClass('azulColor').addClass('cinzaColor');
        }
    });
    localStorageStorePro(configView, arrayShowItensMenu);
}
function checkConfigValue(name) {
    var configBasePro = ( typeof localStorage.getItem('configBasePro') !== 'undefined' && localStorage.getItem('configBasePro') != '' ) ? JSON.parse(localStorage.getItem('configBasePro')) : [];
    var dataValuesConfig = jmespath.search(configBasePro, "[*].configGeral | [0]");
        dataValuesConfig = jmespath.search(dataValuesConfig, "[?name=='"+name+"'].value | [0]");
    
    if (dataValuesConfig == false ) {
        return false;
    } else {
        return true;
    }
}
function copyToClipboard(text) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(text).select();
    document.execCommand("copy");
    $temp.remove();
}
function copyToClipboardHTML(str) {
  function listener(e) {
    e.clipboardData.setData("text/html", str);
    e.clipboardData.setData("text/plain", str);
    e.preventDefault();
  }
  document.addEventListener("copy", listener);
  document.execCommand("copy");
  document.removeEventListener("copy", listener);
};
function targetIfrVisualizacaoPro(url) { 
    if ( typeof url !== 'undefined' && url != '' && url !== null ) {
        $("#ifrVisualizacao").attr("src", url);
    }
}
function execIncluirEmBlocoPro() { 
    $('#ifrVisualizacao')[0].contentWindow.incluirEmBloco();
}
function execConcluirReabrirProcessoPro(url) { 
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    if ( ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) {
        $('#ifrVisualizacao')[0].contentWindow.reabrirProcesso();    
    } else if ( ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) {
        $('#ifrVisualizacao')[0].contentWindow.concluirProcesso();    
    } else {
        targetIfrVisualizacaoPro(url);
    }
}
//Initializes the API client library and sets up sign-in state listeners.
function initClientPro() {
    if ( typeof spreadsheetIdProjetos_Pro !== 'undefined' || typeof spreadsheetIdAtividades_Pro !== 'undefined' ) {
        gapi.client.init({
          apiKey: API_KEY_PRO,
          clientId: CLIENT_ID_PRO,
          discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
          scope: 'https://www.googleapis.com/auth/spreadsheets'
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatusPro);

          // Handle the initial sign-in state.
            updateSigninStatusPro(gapi.auth2.getAuthInstance().isSignedIn.get());
            $('#authorizeButtonPro').click(function() { handleAuthClickPro() });
            $('#signoutButtonPro').click(function() { handleSignoutClickPro() });
        }, function(error) {
          alertaBoxPro('Error', 'exclamation-triangle', JSON.stringify(error, null, 2));
        });
    }
}

// Called when the signed in status changes, to update the UI appropriately. After a sign-in, the API is called.
function updateSigninStatusPro(isSignedIn) {
    if (isSignedIn) {
        $('#authorizeButtonPro').hide();
        $('#signoutButtonPro').show();
        if (typeof loadEtapasSheet === "function") { loadEtapasSheet() }
        if (typeof loadAtividadesSheet === "function") { loadAtividadesSheet() }
    } else {
        $('#authorizeButtonPro').show();
        $('#signoutButtonPro').hide();
    }
}
function loadSheetIconPro(status) {
    if ( status == 'load' ) {
      $('#signoutButtonPro i').attr('class','fas fa-spinner fa-spin brancoColor');
    } else if ( status == 'noperfil' ) {
        $('#signoutButtonPro').show().attr('onmouseover', 'return infraTooltipMostrar(\'Perfil n&atilde;o autorizado. Solicite acesso &agrave; planilha\')').find('i').attr('class','fas fa-user-slash brancoColor');
    } else {
      $('#signoutButtonPro i').attr('class','fas fa-toggle-on brancoColor');
    }
}
// Sign in the user upon button click.
function handleAuthClickPro(event) {
    gapi.auth2.getAuthInstance().signIn();
}

// Sign out the user upon button click.
function handleSignoutClickPro(event) {
    gapi.auth2.getAuthInstance().signOut();
    logoutSheetPro();
}
function logoutSheetPro() {
    $('#projetosGantt').remove();
    localStorageRemovePro('loadEtapasSheet');
    localStorageRemovePro('loadAtividadesSheet');
    localStorageRemovePro('configBasePro');
    localStorageRemovePro('configBaseSelectedPro');
    localStorageRemovePro('projetosGanttActiveTabs');
}
function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
        return !pos || item != ary[pos - 1];
    })
}
function getParamsUrlPro(url) {
    var params = {};
    var vars = url.split('?')[1].split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        params[pair[0]] = decodeURIComponent(pair[1]);
    }
	return params;
}
function getIDProtocoloSEI(protocolo, objReturn, funcError) {
    var xhr = new XMLHttpRequest();
    var href = $('#frmProtocoloPesquisaRapida').attr('action');
    $.ajax({ 
        method: 'POST',
        data: { txtPesquisaRapida: protocolo },
        url: href,
        xhr: function() {
             return xhr;
        },
        success: function() { 
          var _return = getParamsUrlPro(xhr.responseURL);
            if ( _return.id_protocolo != 0 && typeof _return.id_protocolo !== 'undefined' ) {
                objReturn.val(_return.id_protocolo);
            } else {
                funcError();
            }
        }
    });
}
function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;  
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
function arraySheetToJSON(array) {
    var objDados = [];
    $.each(array,function(index, value){
        if ( index != 0 && typeof value[0] !== 'undefined' && value[0] != '' ) {
            var obj = {};
            for (var i = 0 ; i < value.length; i++) {
                var nameIndex = array[0][i];
                obj[nameIndex] = value[i];
            }
            objDados.push(obj);
        }
    });
    return objDados;
}
function checkFormRequiredPro(elementForm) {
    var required = true;
    $(elementForm+' .required').each(function( index ) {
    	if ( $(this).val() == '' ) { required = false; }
    });
    return required;
}
function alertaBoxPro(status, icon, text) {
    $('#alertaBoxPro')
        .html('<strong class="alerta'+status+'Pro alertaBoxPro"><i class="fas fa-'+icon+'"></i> '+text+'</strong>')
        .dialog({
        	width: 400,
        	// height: 150,
        	buttons: [{
                text: "OK",
                click: function() {
                    $(this).dialog('close');
                }
            }]
        });
}
function toggleTablePro(idTable, mode) {
	if ( mode == 'hide' ) {
		$('#'+idTable).hide();
		$('#'+idTable+'_hideIcon').hide();
		$('#'+idTable+'_showIcon').show();
        localStorageStorePro(idTable, 'hide');
	} else {
		$('#'+idTable).show();
		$('#'+idTable+'_hideIcon').show();
		$('#'+idTable+'_showIcon').hide();
        localStorageStorePro(idTable, 'show');
	}
}
function getColorID() {
	var colorID = {
		color1: { 
			light: '#dddddd', 
			dark: '#646464'
		},
		color2: { 
			light: '#e2daf1', 
			dark: '#7b54c0'
		},
		color3: { 
			light: '#eed7e9', 
			dark: '#b1489c'
		},
		color4: { 
			light: '#f2d7dc', 
			dark: '#c2495e'
		},
		color5: { 
			light: '#ecdacf', 
			dark: '#a85723'
		},
		color6: { 
			light: '#dfdfc8', 
			dark: '#6e6b06'
		},
		color7: { 
			light: '#d1e2cc', 
			dark: '#2f7c16'
		},
		color8: { 
			light: '#c9e4d7', 
			dark: '#0a824a'
		},
		color9: { 
			light: '#cae2e6', 
			dark: '#0e7a8b'
		},
		color10: { 
			light: '#d4def0', 
			dark: '#3b68b9'
		}
	};
	return colorID;
}
function getStyleTable(color) {
	var styleTable = {
		tableStyle1: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:60%;',
			tr_head: '',
			tr: '',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle2: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:60%;',
			tr_head: 'background-color: '+color.light+';',
			tr: ['','background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle3: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:60%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle4: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:60%;border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle5: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:60%;border: none;',
			tr_head: 'border: none;',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle6: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:60%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: 'background-color: '+color.light+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'background-color: '+color.light+'; border-left: none; border-top: none; border-bottom: none; border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle7: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:60%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle8: {
			table: 'border-collapse:collapse; border-bottom: 1px solid '+color.dark+'; border-left: none; border-right: none; border-top: none;margin-left: auto;margin-right:auto; width:60%;',
			tr_head: 'border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border-left: 1px solid '+color.dark+';',
			td_first: 'border-right: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle9: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:60%; border: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle10: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:60%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle11: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:60%; border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important',
			tr: 'border: none;',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'background-color: '+color.light+'; border-bottom: 1px solid #fff; border-right: 1px solid #fff',
			td_first: 'color: #fff;background-color: '+color.dark+'; border: 1px solid '+color.dark+'; border-bottom: 1px solid #fff !important;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle12: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:60%;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 3px solid '+color.dark+';',
			tr: '',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle13: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto ;width:60%; border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border: none;',
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: 'border: 1px solid '+color.dark+';',
			td_first: 'border-left: none;border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle14: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:60%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle15: {
			table: 'border-collapse:collapse;margin-left:auto;margin-right:auto;width:60%;border-left: none; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: 'border-bottom: 1px solid '+color.dark+';',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle16: {
			table: 'border-collapse:collapse; border-color:'+color.dark+'; margin-left:auto; margin-right:auto; width:60%;',
			tr_head: 'color: #fff;',
			tr: '',
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle17: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto;width:60%;',
			tr_head: 'color: #fff;',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border: none;',
			td_first: 'border: none;',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle18: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto; width:60%;border: none;',
			tr_head: 'color: #fff; border: 1px solid '+color.dark+'; border-bottom: 3px solid #fff !important',
			tr: ['border: none; background-color: '+color.light+';','color: #fff; border: none; background-color: '+color.dark+';'],
			td_head: 'background-color: '+color.dark+';',
			td_head_p: 'Texto_Centralizado',
			td: 'border:none;',
			td_first: 'border: none; border-right: 3px solid #fff',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle19: {
			table: 'border-collapse:collapse; margin-left:auto; margin-right:auto;width:60%; border-left: none;border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+'; border-right: none;',
			tr_head: 'background-color: '+color.light+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle20: {
			table: 'border-collapse:collapse; margin-left:auto;margin-right:auto;width:60%;border: none;',
			tr_head: 'background-color: '+color.light+'; border-top: 1px solid '+color.dark+'; border-bottom: 1px solid '+color.dark+';',
			tr: ['border: none;','border: none; background-color: '+color.light+';'],
			td_head: '',
			td_head_p: 'Texto_Centralizado',
			td: '',
			td_first: 'border-left: none; border-top: none;border-bottom: none;border-right: 1px solid '+color.dark+';',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		},
		tableStyle21: {
			table: 'border-collapse:collapse; border-color:'+color.dark+';margin-left:auto; margin-right:auto; width:60%;',
			tr_head: '',
			tr: '',
			td_head: '',
			td_head_p: 'Tabela_Texto_Alinhado_Esquerda',
			td: '',
			td_first: '',
			td_p: 'Tabela_Texto_Alinhado_Esquerda'
		}
	};
	return styleTable;
}
function localStorageRestorePro(item) {
    return JSON.parse(localStorage.getItem(item));
}
function localStorageStorePro(item, result) {
    localStorage.setItem(item, JSON.stringify(result));
}
function localStorageRemovePro(item) {
    localStorage.removeItem(item);
}
function createCookiePro(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    } else { var expires = ""; }
    
    if ( typeof readCookiePro(name) !== 'undefined' && days >= 0) { eraseCookiePro(name); }

    document.cookie = name + "=" + value + expires + "; path=/";
}
function readCookiePro(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function eraseCookiePro(name) {
    createCookiePro(name, "", -1);
}
function removeAcentos(str) {
    return (typeof str !== 'undefined') ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : '';
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function randomString(length) {
    var result = '';
    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
function getCheckerProcessoPro() {
    $('<iframe>', {
        id:  'frmCheckerProcessoPro',
        frameborder: 0,
        style: 'width: 1px; height: 1px; position: absolute; top: -100px; display: none;',
        tableindex: '-1',
        scrolling: 'no'
    }).appendTo('body');
}
function getDadosIframeProcessoPro(idProcedimento, mode) {
    if (typeof idProcedimento !== 'undefined' && idProcedimento != '' ) {
        if ( $('#frmCheckerProcessoPro').length == 0 ) { getCheckerProcessoPro(); }
        var url = 'controlador.php?acao=procedimento_trabalhar&id_procedimento='+idProcedimento;
        $('#frmCheckerProcessoPro').attr('src', url).unbind().on('load', function(){
            checkDadosIframeProcessoPro(mode);
        });
    }
}
function checkDadosIframeProcessoPro(mode) {
    var ifrVisualizacao = $('#frmCheckerProcessoPro').contents().find('#ifrVisualizacao').contents();
    var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore').contents();   
    setTimeout(function () { 
        if ( ifrVisualizacao.find('.botaoSEI').length > 0 ) {
            getDadosProcessoPro(ifrVisualizacao, mode);
            getLinksProcessoPro(ifrVisualizacao);
            getLinksArvorePro(ifrArvore);
        } else {
            checkDadosIframeProcessoPro(mode);
        }
    }, 500);
}
function getDadosProcessoPro(ifrVisualizacao, mode) {
    var processo = {};
    ifrVisualizacao.find('.botaoSEI').each(function(index){
        var href = $(this).attr('href');
        if ((href.indexOf('acao=procedimento_alterar') !== -1) || (href.indexOf('acao=procedimento_consultar') !== -1)) {
            ajaxDadosProcessoPro(href, mode);
        }
    });
}
function getLinksArvorePro(ifrArvore) {
    ifrArvore.find('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('consultarAndamento') !== -1) { 
            var text = $(this).html();
            var link = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
            });
            if ( link.length > 0 ) {
                $.each(link,function(index, value){
                    var name = '';
                    if ( value.indexOf('?acao=procedimento_consultar_historico') !== -1 ) { 
                        getDadosAndamentoPro(value);
                    }
                });
            }
        }
    });
}
function getDadosAndamentoPro(href) {
    var andamento = [];
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
            $html.find("#tblHistorico").find('tr').each(function(){
                var datahora = $(this).find('td').eq(0).text().trim();
                    datahora = moment(datahora,'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');
                var unidade = $(this).find('td').eq(1).text();
                var usuario = $(this).find('td').eq(2).text();
                var descricao = $(this).find('td').eq(3).text();
                var descricao_alt = $(this).find('td').eq(3).find('a').attr('alt');
                if ( unidade != '' ) { andamento.push({datahora: datahora, unidade: unidade, usuario: usuario, descricao: descricao, descricao_alt: descricao_alt}) }
            });
        var processo = $html.find('#divInfraBarraLocalizacao').text().trim().split(' ');
            processo = processo[processo.length-1];
        var id_procedimento = $html.find('#frmProcedimentoHistorico').attr('action'); 
            id_procedimento = (typeof id_procedimento !== 'undefined' && id_procedimento != '') ? getParamsUrlPro(id_procedimento).id_procedimento : '';
            
        var listAndamento = {processo: processo, id_procedimento: id_procedimento, andamento: andamento};
            dadosProcessoPro.listAndamento = listAndamento;
            getDataRecebimentoPro(listAndamento);
    });
}
function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return moment(date).format('YYYY-MM-DD HH:mm:ss');
}
function getDataRecebimentoPro(listAndamento) {
    var dataRecebimento = [];
    var datesend = '',
        descricaosend = '',
        unidadesend = '';
        unidadesendfull = '';
    var unidade = $('#selInfraUnidades').find('option:selected').text().trim();
    
    $.each(listAndamento.andamento,function(j, e){
        if (unidade == e.unidade && e.descricao.indexOf('Processo remetido pela unidade') !== -1) {
            datesend = e.datahora;
            descricaosend = e.descricao;
            unidadesend = e.descricao.replace('Processo remetido pela unidade','').trim();
            unidadesendfull = (e.descricao_alt != '') ? e.descricao_alt+' - '+unidadesend : '';
            return false;
        }
    });
    $.each(listAndamento.andamento,function(i, v){
        //var datevisit = randomDate(new Date(2020, 0, 1), new Date(), 0, 24);
        var datevisit = moment().format('YYYY-MM-DD HH:mm:ss');
        if (unidade == v.unidade && (v.descricao == 'Processo recebido na unidade' || v.descricao == 'Reabertura do processo na unidade')) {
            dataRecebimento.push({id_procedimento: listAndamento.id_procedimento, processo: listAndamento.processo, datahora: v.datahora, unidade: v.unidade, descricao: v.descricao, datetime: datevisit, datesend: datesend, descricaosend: descricaosend, unidadesend: unidadesend, unidadesendfull: unidadesendfull});
            return false;
        } else if (unidade == v.unidade && v.descricao == 'Processo p\u00FAblico gerado') {
            dataRecebimento.push({id_procedimento: listAndamento.id_procedimento, processo: listAndamento.processo, datahora: v.datahora, unidade: v.unidade, descricao: v.descricao, datetime: datevisit, datesend: datesend, descricaosend: descricaosend, unidadesend: unidadesend, unidadesendfull: unidadesendfull});
            return false;
        }
    });
    if (dataRecebimento.length) { 
        var storeRecebimento = ( typeof localStorageRestorePro('configDataRecebimentoPro') !== 'undefined' && !$.isEmptyObject(localStorageRestorePro('configDataRecebimentoPro')) ) ? localStorageRestorePro('configDataRecebimentoPro') : [];
        var objIndex = -1;
            $.each(storeRecebimento, function(i, v) {
                if (v.id_procedimento == listAndamento.id_procedimento) { objIndex = i; return false; }
            });
            if (objIndex == -1) {
                storeRecebimento.push(dataRecebimento[0]);
            } else {
                storeRecebimento[objIndex] = dataRecebimento[0];
            }
            localStorageStorePro('configDataRecebimentoPro', storeRecebimento);
    }
}
function getLinksProcessoPro(ifrVisualizacao) {
    var linksArvore = [];
    ifrVisualizacao.find('script').each(function(i){
        if (typeof $(this).attr('src') === 'undefined' && $(this).html().indexOf('objAjaxVerificacaoAssinatura') !== -1) { 
            var text = $(this).html();
            var link = $.map(text.split("'"), function(substr, i) {
               return (i % 2 && substr.indexOf('controlador.php?acao=') !== -1) ? substr : null;
            });
            if ( link.length > 0 ) {
                $.each(link,function(index, value){
                        var name = '';
                        //var icon = '';
                        //var alt = '';
                               if ( value.indexOf('?acao=procedimento_concluir') !== -1 && ifrVisualizacao.find('img[title="Concluir Processo"]').length > 0 ) { name = 'Concluir Processo'; 
                        } else if ( value.indexOf('?acao=procedimento_ciencia') !== -1 && ifrVisualizacao.find('img[title="Ci\u00EAncia"]').length > 0 ) { name = 'Ci\u00EAncia'; 
                        } else if ( value.indexOf('?acao=procedimento_enviar_email') !== -1 && ifrVisualizacao.find('img[title="Enviar Correspond\u00EAncia Eletr\u00F4nica"]').length > 0 ) { name = 'Enviar Correspond\u00EAncia Eletr\u00F4nica';
                        } else if ( value.indexOf('?acao=bloco_selecionar_processo') !== -1 && ifrVisualizacao.find('img[title="Incluir em Bloco"]').length > 0 ) { name = 'Incluir em Bloco';
                        } else if ( value.indexOf('?acao=procedimento_reabrir') !== -1 && ifrVisualizacao.find('img[title="Reabrir Processo"]').length > 0 ) { name = 'Reabrir Processo';
                        } 
                        var data = jmespath.search(parent.iconsFlashMenu, "[?name=='"+name+"'] | [0]");
                        if ( name != '' ) { linksArvore.push({ url: value, name: data.name, icon: data.icon, alt: data.alt}); }
                });
            }
        }
    });
    dadosProcessoPro.listLinks = linksArvore;
    if ( $('#ifrArvore').length > 0 ) { $('#ifrArvore')[0].contentWindow.initSeiProArvore(); }
}
function ajaxDadosProcessoPro(href, mode) {
    var processo = {};
    $.ajax({ url: href }).done(function (html) {
        let $html = $(html);
        processo.action = $html.find("#frmProcedimentoCadastro").attr('action');
        processo.selAssuntos_select = $html.find("#selAssuntos option").map(function () { return $(this).text(); }).get();
        processo.selTipoProcedimento_select = $html.find("#selTipoProcedimento option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        processo.selHipoteseLegal_select = $html.find("#selHipoteseLegal option").map(function () { return {id: $(this).val(), name: $(this).text() }; }).get();
        $html.find('form input[type=hidden]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('hdn') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form input[type=text]').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('txt') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        $html.find('form select').each(function () { 
            if ( $(this).attr('id') && $(this).attr('id').indexOf('sel') !== -1) {
                processo[$(this).attr('id')] = $(this).val();
            }
        });
        processo.selInteressadosProcedimento = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
        processo.selAssuntos = $html.find("#selInteressadosProcedimento option").map(function () { return $(this).text(); }).get();
        processo.rdoNivelAcesso = $html.find('input[name=rdoNivelAcesso]:checked').val();
        processo.txaObservacoes = $html.find("#txaObservacoes").val();
        dadosProcessoPro.propProcesso = processo;
        setTimeout(function(){ updateTitlePage(mode) }, 500);
        if (mode == 'editor' || mode == 'gantt' || mode == 'dados') { checkDadosIframeDocumentosPro(mode) }
    });
}
function checkDadosIframeDocumentosPro(mode) {
    var i = 0;
    var ifrArvore = $('#frmCheckerProcessoPro').contents().find('#ifrArvore').contents();
        ifrArvore.find('#topmenu a').each(function(index){
            var href = $(this).attr('href');
            if (typeof href !== 'undefined' && href.indexOf('&abrir_pastas=1') !== -1) {
                i = 1;
                $('#frmCheckerProcessoPro').attr('src', href).unbind().on('load', function(){
                    var ifrArvoreOpen = $('#frmCheckerProcessoPro').contents();
                    arrayDadosIframeDocumentosPro(ifrArvoreOpen, mode);
                });
            }
        });
        if ( i == 0 ) { arrayDadosIframeDocumentosPro(ifrArvore, mode) }
}
function arrayDadosIframeDocumentosPro(ifrArvore, mode) {
    var processo = [];
    ifrArvore.find('#divArvore a[target=ifrVisualizacao]').each(function(index){
        var txt = $(this).text().trim();
        var text = txt.split(' ');
        var id_protocolo = $(this).attr('id').replace('anchor','');
        var nr_sei = (txt.indexOf(' ') !== -1) ? text[text.length-1] : '';
        var documento = txt.replace(nr_sei, '').trim();
            nr_sei = (nr_sei.indexOf('(') !== -1) ? nr_sei.replace(')','').replace('(','') : nr_sei;
        var assinatura = ( ifrArvore.find('#anchorA'+id_protocolo).length) ? ifrArvore.find('#anchorA'+id_protocolo+' img').attr('title').replace('Assinado por:','').trim() : '';
        processo.push({ id_protocolo: id_protocolo, nr_sei: nr_sei, documento: documento, assinatura: assinatura });
    });
    dadosProcessoPro.listDocumentos = processo;
    if (mode == 'editor') { 
        getDialogCitacaoDocumento();
        getDialogDadosEditor();
    } else if (mode == 'gantt') { 
        updateSelectConcluirEtapa();
    } else if (mode == 'dados') {
        loopIDProcedimentos();
    }
}
function updateTitlePage(mode) {
    var processo = dadosProcessoPro.propProcesso;
    if ( typeof processo.txtDescricao !== 'undefined'  ) {
        if (mode == 'processo') {
            $('head title').text(processo.txtDescricao+' | SEI - Processo '+processo.txtProtocoloExibir);
        } else if (mode == 'editor') {
            var title = $('head title').text();
                title = (title.indexOf('-') !== -1) ? title.split('-')[2]+' '+title.split('-')[1] : title; 
            $('head title').text('Editor: '+title+' - '+processo.txtDescricao+' | SEI - Processo '+processo.txtProtocoloExibir);
        }
    }
}

// resize img
function loadCSSResize(iframe) {	
	var cssScript = 'img::selection{color:transparent}img.ckimgrsz{outline:1px dashed #000}#ckimgrsz{position:absolute;margin:-8px -8px;width:0;height:0;cursor:default;z-index:10001}#ckimgrsz span{display:none;position:absolute;top:0;left:0;width:0;height:0;background-size:100% 100%;opacity:.65;outline:1px dashed #000}#ckimgrsz i{position:absolute;display:block;width:5px;height:5px;background:#fff;border:1px solid #000}#ckimgrsz i.active,#ckimgrsz i:hover{background:#000}#ckimgrsz i.br,#ckimgrsz i.tl{cursor:nwse-resize}#ckimgrsz i.bm,#ckimgrsz i.tm{cursor:ns-resize}#ckimgrsz i.bl,#ckimgrsz i.tr{cursor:nesw-resize}#ckimgrsz i.lm,#ckimgrsz i.rm{cursor:ew-resize}body.dragging-br,body.dragging-br *,body.dragging-tl,body.dragging-tl *{cursor:nwse-resize!important}body.dragging-bm,body.dragging-bm *,body.dragging-tm,body.dragging-tm *{cursor:ns-resize!important}body.dragging-bl,body.dragging-bl *,body.dragging-tr,body.dragging-tr *{cursor:nesw-resize!important}body.dragging-lm,body.dragging-lm *,body.dragging-rm,body.dragging-rm *{cursor:ew-resize!important}';
	
	if ( iframe.find('head').find('style[data-style="seipro-resizeimg"]').length == 0 ) {
		iframe.find('head').append("<style type='text/css' data-style='seipro-resizeimg'> "
								   +cssScript
								   +"</style>");
	
	}
}
function initResizeImg(editor) {
	var window = editor.window.$, document = editor.document.$;
	var snapToSize = (typeof IMAGE_SNAP_TO_SIZE === 'undefined') ? null : IMAGE_SNAP_TO_SIZE;

	var resizer = new Resizer(editor, {snapToSize: snapToSize});

	document.addEventListener('mousedown', function(e) {
	  if (resizer.isHandle(e.target)) {
		resizer.initDrag(e);
	  }
	}, false);

	function selectionChange() {
	  var selection = editor.getSelection();
	  if (!selection) return;
	  // If an element is selected and that element is an IMG
	  if (selection.getType() !== CKEDITOR.SELECTION_NONE && selection.getStartElement().is('img')) {
		// And we're not right or middle clicking on the image
		if (!window.event || !window.event.button || window.event.button === 0) {
		  resizer.show(selection.getStartElement().$);
		}
	  } else {
		resizer.hide();
	  }
	}

	editor.on('selectionChange', selectionChange);

	editor.on('getData', function(e) {
	  var html = e.data.dataValue || '';
	  html = html.replace(/<div id="ckimgrsz"([\s\S]*?)<\/div>/i, '');
	  html = html.replace(/\b(ckimgrsz)\b/g, '');
	  e.data.dataValue = html;
	});

	editor.on('beforeUndoImage', function() {
	  // Remove the handles before undo images are saved
	  resizer.hide();
	});

	editor.on('afterUndoImage', function() {
	  // Restore the handles after undo images are saved
	  selectionChange();
	});

	editor.on('blur', function() {
	  // Remove the handles when editor loses focus
	  resizer.hide();
	});

	editor.on('beforeModeUnload', function self() {
	  editor.removeListener('beforeModeUnload', self);
	  resizer.hide();
	});

	// Update the selection when the browser window is resized
	var resizeTimeout;
	editor.window.on('resize', function() {
	  // Cancel any resize waiting to happen
	  clearTimeout(resizeTimeout);
	  // Delay resize to "debounce"
	  resizeTimeout = setTimeout(selectionChange, 50);
	});
}

function Resizer(editor, cfg) {
	this.editor = editor;
	this.window = editor.window.$;
	this.document = editor.document.$;
	this.cfg = cfg || {};
	this.init();
}

Resizer.prototype = {
init: function() {
  var container = this.container = this.document.createElement('div');
  container.id = 'ckimgrsz';
  this.preview = this.document.createElement('span');
  container.appendChild(this.preview);
  var handles = this.handles = {
	tl: this.createHandle('tl'),
	tm: this.createHandle('tm'),
	tr: this.createHandle('tr'),
	lm: this.createHandle('lm'),
	rm: this.createHandle('rm'),
	bl: this.createHandle('bl'),
	bm: this.createHandle('bm'),
	br: this.createHandle('br')
  };
  for (var n in handles) {
	container.appendChild(handles[n]);
  }
},
createHandle: function(name) {
  var el = this.document.createElement('i');
  el.classList.add(name);
  return el;
},
isHandle: function(el) {
  var handles = this.handles;
  for (var n in handles) {
	if (handles[n] === el) return true;
  }
  return false;
},
show: function(el) {
  this.el = el;
  if (this.cfg.snapToSize) {
	this.otherImages = toArray(this.document.getElementsByTagName('img'));
	this.otherImages.splice(this.otherImages.indexOf(el), 1);
  }
  var box = this.box = getBoundingBox(this.window, el);
  positionElement(this.container, box.left, box.top);
  this.document.body.appendChild(this.container);
  this.el.classList.add('ckimgrsz');
  this.showHandles();
},
hide: function() {
  // Remove class from all img.ckimgrsz
  var elements = this.document.getElementsByClassName('ckimgrsz');
  for (var i = 0; i < elements.length; ++i) {
	elements[i].classList.remove('ckimgrsz');
  }
  this.hideHandles();
  if (this.container.parentNode) {
	this.container.parentNode.removeChild(this.container);
  }
},
initDrag: function(e) {
	  if (e.button !== 0) {
		//right-click or middle-click
		return;
	  }
	  var resizer = this;
	  var drag = new DragEvent(this.window, this.document);
	  drag.onStart = function() {
		resizer.showPreview();
		resizer.isDragging = true;
		resizer.editor.getSelection().lock();
	  };
	  drag.onDrag = function() {
		resizer.calculateSize(this);
		resizer.updatePreview();
		var box = resizer.previewBox;
		resizer.updateHandles(box, box.left, box.top);
	  };
	  drag.onRelease = function() {
		resizer.isDragging = false;
		resizer.hidePreview();
		resizer.hide();
		resizer.editor.getSelection().unlock();
		// Save an undo snapshot before the image is permanently changed
		resizer.editor.fire('saveSnapshot');
	  };
	  drag.onComplete = function() {
		resizer.resizeComplete();
		// Save another snapshot after the image is changed
		resizer.editor.fire('saveSnapshot');
	  };
	  drag.start(e);
	},
	updateHandles: function(box, left, top) {
	  left = left || 0;
	  top = top || 0;
	  var handles = this.handles;
	  positionElement(handles.tl, -3 + left, -3 + top);
	  positionElement(handles.tm, Math.round(box.width / 2) - 3 + left, -3 + top);
	  positionElement(handles.tr, box.width - 4 + left, -3 + top);
	  positionElement(handles.lm, -3 + left, Math.round(box.height / 2) - 3 + top);
	  positionElement(handles.rm, box.width - 4 + left, Math.round(box.height / 2) - 3 + top);
	  positionElement(handles.bl, -3 + left, box.height - 4 + top);
	  positionElement(handles.bm, Math.round(box.width / 2) - 3 + left, box.height - 4 + top);
	  positionElement(handles.br, box.width - 4 + left, box.height - 4 + top);
	},
	showHandles: function() {
	  var handles = this.handles;
	  this.updateHandles(this.box);
	  for (var n in handles) {
		handles[n].style.display = 'block';
	  }
	},
	hideHandles: function() {
	  var handles = this.handles;
	  for (var n in handles) {
		handles[n].style.display = 'none';
	  }
	},
	showPreview: function() {
	  this.preview.style.backgroundImage = 'url("' + this.el.src + '")';
	  this.calculateSize();
	  this.updatePreview();
	  this.preview.style.display = 'block';
	},
	updatePreview: function() {
	  var box = this.previewBox;
	  positionElement(this.preview, box.left, box.top);
	  resizeElement(this.preview, box.width, box.height);
	},
	hidePreview: function() {
	  var box = getBoundingBox(this.window, this.preview);
	  this.result = {width: box.width, height: box.height};
	  this.preview.style.display = 'none';
	},
	calculateSize: function(data) {
	  var box = this.previewBox = {top: 0, left: 0, width: this.box.width, height: this.box.height};
	  if (!data) return;
	  var attr = data.target.className;
	  if (~attr.indexOf('r')) {
		box.width = Math.max(32, this.box.width + data.delta.x);
	  }
	  if (~attr.indexOf('b')) {
		box.height = Math.max(32, this.box.height + data.delta.y);
	  }
	  if (~attr.indexOf('l')) {
		box.width = Math.max(32, this.box.width - data.delta.x);
	  }
	  if (~attr.indexOf('t')) {
		box.height = Math.max(32, this.box.height - data.delta.y);
	  }
	  //if dragging corner, enforce aspect ratio (unless shift key is being held)
	  if (attr.indexOf('m') < 0 && !data.keys.shift) {
		var ratio = this.box.width / this.box.height;
		if (box.width / box.height > ratio) {
		  box.height = Math.round(box.width / ratio);
		} else {
		  box.width = Math.round(box.height * ratio);
		}
	  }
	  var snapToSize = this.cfg.snapToSize;
	  if (snapToSize) {
		var others = this.otherImages;
		for (var i = 0; i < others.length; i++) {
		  var other = getBoundingBox(this.window, others[i]);
		  if (Math.abs(box.width - other.width) <= snapToSize && Math.abs(box.height - other.height) <= snapToSize) {
			box.width = other.width;
			box.height = other.height;
			break;
		  }
		}
	  }
	  //recalculate left or top position
	  if (~attr.indexOf('l')) {
		box.left = this.box.width - box.width;
	  }
	  if (~attr.indexOf('t')) {
		box.top = this.box.height - box.height;
	  }
	},
	resizeComplete: function() {
	  resizeElement(this.el, this.result.width, this.result.height);
	}
};

function DragEvent(window, document) {
	this.window = window;
	this.document = document;
	this.events = {
	  mousemove: bind(this.mousemove, this),
	  keydown: bind(this.keydown, this),
	  mouseup: bind(this.mouseup, this)
	};
}

DragEvent.prototype = {
	start: function(e) {
	  e.preventDefault();
	  e.stopPropagation();
	  this.target = e.target;
	  this.attr = e.target.className;
	  this.startPos = {x: e.clientX, y: e.clientY};
	  this.update(e);
	  var events = this.events;
	  this.document.addEventListener('mousemove', events.mousemove, false);
	  this.document.addEventListener('keydown', events.keydown, false);
	  this.document.addEventListener('mouseup', events.mouseup, false);
	  this.document.body.classList.add('dragging-' + this.attr);
	  this.onStart && this.onStart();
	},
	update: function(e) {
	  this.currentPos = {x: e.clientX, y: e.clientY};
	  this.delta = {x: e.clientX - this.startPos.x, y: e.clientY - this.startPos.y};
	  this.keys = {shift: e.shiftKey, ctrl: e.ctrlKey, alt: e.altKey};
	},
	mousemove: function(e) {
	  this.update(e);
	  this.onDrag && this.onDrag();
	  if (e.which === 0) {
		//mouse button released outside window; mouseup wasn't fired (Chrome)
		this.mouseup(e);
	  }
	},
	keydown: function(e) {
	  //escape key cancels dragging
	  if (e.keyCode === 27) {
		this.release();
	  }
	},
	mouseup: function(e) {
	  this.update(e);
	  this.release();
	  this.onComplete && this.onComplete();
	},
	release: function() {
	  this.document.body.classList.remove('dragging-' + this.attr);
	  var events = this.events;
	  this.document.removeEventListener('mousemove', events.mousemove, false);
	  this.document.removeEventListener('keydown', events.keydown, false);
	  this.document.removeEventListener('mouseup', events.mouseup, false);
	  this.onRelease && this.onRelease();
	}
};

//helper functions
function toArray(obj) {
	var len = obj.length, arr = new Array(len);
	for (var i = 0; i < len; i++) {
	  arr[i] = obj[i];
	}
	return arr;
}

function bind(fn, ctx) {
	if (fn.bind) {
	  return fn.bind(ctx);
	}
	return function() {
	  fn.apply(ctx, arguments);
	};
}

function positionElement(el, left, top) {
	el.style.left = String(left) + 'px';
	el.style.top = String(top) + 'px';
}

function resizeElement(el, width, height) {
	el.style.width = String(width) + 'px';
	el.style.height = String(height) + 'px';
}

function getBoundingBox(window, el) {
	var rect = el.getBoundingClientRect();
	return {
	  left: rect.left + window.pageXOffset,
	  top: rect.top + window.pageYOffset,
	  width: rect.width,
	  height: rect.height
	};
}
function setMomentPtBr() {
    moment.defineLocale('pt-br', {
            months : 'janeiro_fevereiro_mar\u00E7o_abril_maio_junho_julho_agosto_setembro_outubro_novembro_dezembro'.split('_'),
            monthsShort : 'jan_fev_mar_abr_mai_jun_jul_ago_set_out_nov_dez'.split('_'),
            weekdays : 'domingo_segunda-feira_ter\u00E7a-feira_quarta-feira_quinta-feira_sexta-feira_s\u00E1bado'.split('_'),
            weekdaysShort : 'dom_seg_ter_qua_qui_sex_s\u00E1b'.split('_'),
            weekdaysMin : 'dom_2\u00AA_3\u00AA_4\u00AA_5\u00AA_6\u00AA_s\u00E1b'.split('_'),
            longDateFormat : {
                LT : 'HH:mm',
                L : 'DD/MM/YYYY',
                LL : 'D [de] MMMM [de] YYYY',
                LLL : 'D [de] MMMM [de] YYYY [\u00E1s] LT',
                LLLL : 'dddd, D [de] MMMM [de] YYYY [\u00E1s] LT'
            },
            calendar : {
                sameDay: '[Hoje \u00E0s] LT',
                nextDay: '[Amanh\u00E3 \u00E0s] LT',
                nextWeek: 'dddd [\u00E0s] LT',
                lastDay: '[Ontem \u00E0s] LT',
                lastWeek: function () {
                    return (this.day() === 0 || this.day() === 6) ?
                        '[\u00DAltimo] dddd [\u00E1s] LT' : // Saturday + Sunday
                        '[\u00DAltima] dddd [\u00E1s] LT'; // Monday - Friday
                },
                sameElse: 'L'
            },
            relativeTime : {
                future : 'em %s',
                past : '%s atr\u00E1s',
                s : 'segundos',
                m : 'um minuto',
                mm : '%d minutos',
                h : 'uma hora',
                hh : '%d horas',
                d : 'um dia',
                dd : '%d dias',
                M : 'um m\u00EAs',
                MM : '%d meses',
                y : 'um ano',
                yy : '%d anos'
            },
            ordinal : '%dº'
        });
    moment.locale('pt-br');
}

// SINCRONIZA COM GOOGLE DOCS
var CSSJSON=new function(){var e=this;e.init=function(){String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")},String.prototype.repeat=function(e){return new Array(1+e).join(this)}},e.init();var t=/\/\*[\s\S]*?\*\//g,r=/([^\:]+):([^\;]*);/,n=/(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gim,o=function(e){return void 0===e||0==e.length||null==e};e.toJSON=function(i,a){var s={children:{},attributes:{}},u=null,l=0;if(void 0===a)a={ordered:!1,comments:!1,stripComments:!1,split:!1};for(a.stripComments&&(a.comments=!1,i=i.replace(t,""));null!=(u=n.exec(i));)if(!o(u[1])&&a.comments){var f=u[1].trim();s[l++]=f}else if(o(u[2])){if(!o(u[3]))return s;if(!o(u[4])){var c=u[4].trim(),d=r.exec(c);if(d){p=d[1].trim();var m=d[2].trim();if(a.ordered)(S={}).name=p,S.value=m,S.type="attr",s[l++]=S;else if(p in s.attributes){var v=s.attributes[p];v instanceof Array||(s.attributes[p]=[v]),s.attributes[p].push(m)}else s.attributes[p]=m}else s[l++]=c}}else{var p=u[2].trim(),h=e.toJSON(i,a);if(a.ordered){var S;(S={}).name=p,S.value=h,S.type="rule",s[l++]=S}else{if(a.split)var y=p.split(",");else y=[p];for(var b=0;b<y.length;b++){var g=y[b].trim();if(g in s.children)for(var C in h.attributes)s.children[g].attributes[C]=h.attributes[C];else s.children[g]=h}}}return s},e.toCSS=function(e,t,r){var n="";if(void 0===t&&(t=0),void 0===r&&(r=!1),e.attributes)for(i in e.attributes){var o=e.attributes[i];if(o instanceof Array)for(var a=0;a<o.length;a++)n+=u(i,o[a],t);else n+=u(i,o,t)}if(e.children){var s=!0;for(i in e.children)r&&!s?n+="\n":s=!1,n+=l(i,e.children[i],t)}return n},e.toHEAD=function(t,r,i){var n=document.getElementsByTagName("head")[0],u=document.getElementById(r),l=null!==u&&u instanceof HTMLStyleElement;if(!o(t)&&n instanceof HTMLHeadElement){if(l){if(!0!==i&&!o(i))return;u.removeAttribute("id")}(function(e){return!o(e)&&e.attributes&&e.children})(t)&&(t=e.toCSS(t));var f=document.createElement("style");if(f.type="text/css",o(r)?f.id="cssjson_"+s():f.id=r,f.styleSheet?f.styleSheet.cssText=t:f.appendChild(document.createTextNode(t)),n.appendChild(f),a(f))l&&u.parentNode.removeChild(u);else{if(f.parentNode.removeChild(f),!l)return;u.setAttribute("id",r),f=u}return f}},"undefined"!=typeof window&&(window.createCSS=e.toHEAD);var a=function(e){return e instanceof HTMLStyleElement&&e.sheet.cssRules.length>0},s=function(){return Date.now()||+new Date},u=function(e,t,r){return"\t".repeat(r)+e+": "+t+";\n"},l=function(t,r,i){var n="\t".repeat(i)+t+" {\n";return n+=e.toCSS(r,i+1),n+="\t".repeat(i)+"}\n"}};"object"==typeof module&&(module.exports=CSSJSON);

function loadGoogleDocs(url, iframeDoc) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data){ 
            if ( data ) {
                var r = confirm("Deseja substituir o conte\u00FAdo atual pelo arquivo importado?");
                if (r == true) { 
                    iframeDoc.find('body').html(data);
                    DocsToSEI(iframeDoc);
                }
            }
        },
        error: function(data) {
            alert('Nenhum documento encontrado! \nConfira se o documento est\u00E1 acess\u00EDvel por qualquer pessoa na internet e tente novamente.')
        }
    });
}
function getBase64Image(imgObj) {
    var imgUrl = imgObj.attr('src');
    var img = new Image();

    // set attributes and src 
    img.setAttribute('crossOrigin', 'anonymous'); //
    img.src = imgUrl;

    // onload fires when the image is fully loadded, and has width and height
    img.onload = function(){

      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
          
          imgObj.attr('src', dataURL).css({'overflow': '', 'display': '', 'transform': '', 'margin-top': '', 'margin-left': ''}).addClass('img-base64');
          imgObj.closest('span').replaceWith(function() {
             return $('img', this);
          });
    };
}
function validarTagsPro() {
  for (inst in CKEDITOR.instances) {
    var editor = CKEDITOR.instances[inst];
    if (!editor.readOnly) {
      var tags = ['img', 'button', 'input', 'select', 'iframe', 'frame', 'embed', 'object', 'param', 'video', 'audio', 'form'];
      for (var i = 0; i < tags.length; i++) {
        var elements = editor.document.getElementsByTag(tags[i]);
        if (elements.count() > 0) {
          switch (tags[i]) {
            case 'img':
                var erro=false;
              if (arrImgPermitida.length == 0) {
                console.log('Nao sao permitidas imagens no conteudo.');
                erro=true;
                break;
              } else {
                var posIni = null;
                var posFim = null;
                var n = elements.count();
                for (var j = 0; j < n; j++) {
                  ImgSrc = elements.getItem(j).getAttribute('src');
                  posIni = ImgSrc.indexOf('/');
                  if (posIni != -1) {
                    posFim = ImgSrc.indexOf(';', posIni);
                    if (posFim != -1) {
                      posIni = posIni + 1;
                      if (arrImgPermitida.indexOf(ImgSrc.substr(posIni, (posFim - posIni))) == -1) {
                        console.log('Imagem formato "' + ImgSrc.substr(posIni, (posFim - posIni)) + '" nao permitida.');
                        erro=true;
                        break;
                      }
                    } else {
                      console.log('Nao sao permitidas imagens referenciadas.'); 
                      console.log(ImgSrc, posIni, posFim);
                      erro=true;
                      break;
                    }
                  }
                }
              }
              if (erro) break;
              continue;
            case 'button':
            case 'input':
            case 'select':
              console.log('Nao sao permitidos componentes de formulario HTML no conteudo.');
              break;

            case 'iframe':
              console.log('Nao sao permitidos formularios ocultos no conteúdo.');
              break;

            case 'frame':
            case 'form':
              console.log('Nao sao permitidos formularios no conteúdo.');
              break;

            case 'embed':
            case 'object':
            case 'param':
              console.log('Nao sao permitidos objetos no conteudo.');
              break;

            case 'video':
              console.log('Nao sao permitidos videos no conteudo.');
              break;

            case 'audio':
              console.log('Nao e permitido audio no conteúdo.');
              break;
          }
          return false;
        }
      }
    }
  }
	return true;
}
function enableButtonSavePro() {
    var idEditor = $('#idEditor').val();
    $('div#cke_'+idEditor).find('.cke_button__save').removeClass('cke_button_disabled').addClass('cke_button_off').removeAttr('aria-disabled').css('background-color','');
    CKEDITOR.instances[idEditor].commands.save.state = undefined;
    CKEDITOR.dialog.getCurrent().hide();
}
function DocsToSEI(iframeDoc) {
    iframeDoc.find('body link').remove();
    iframeDoc.find('body style').attr('data-style','seipro-import');
    iframeDoc.find('body meta').remove();
    iframeDoc.find('body script').remove();
    iframeDoc.find('a').each(function(){
        var urlLink = ( typeof $(this).attr('href') !== 'undefined' && $(this).attr('href') != '' ) ? $(this).attr('href') : '';
            urlLink = ( urlLink != '' && urlLink.indexOf('https://www.google.com/url?q=') !== -1 ) 
                        ? getParamsUrlPro(urlLink).q
                        : urlLink;
        $(this).attr('href', urlLink).attr('target', '_blank').attr('rel', 'noreferrer');
    });
    ImgToBase64(iframeDoc);
    convertCSSToStyle(iframeDoc);
    enableButtonSavePro();
    setAllLinkTips();
}
function convertCSSToStyle(iframeDoc) {
    var CSSString = iframeDoc.find('style[data-style="seipro-import"]').html().toString();
    var arrayCSS = CSSJSON.toJSON(CSSString).children;
    for (var key in arrayCSS) {
        if (arrayCSS.hasOwnProperty(key)) {
            var style = arrayCSS[key].attributes;
            var className = key.toString().replace('.','');
            if ( !$.isEmptyObject(style) ) {
                iframeDoc.find(key).each(function(){
                    if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN') ) {
                        for (var key in style) {
                            if (style.hasOwnProperty(key)) {
                                if ( key == 'font-style' && style[key] == 'italic' ) {
                                    $(this).wrapInner('<em></em>');
                                } else if ( key == 'font-weight' && ( style[key] == 'bold' || style[key] == 'bolder' || parseFloat(style[key]) >= 600 ) ) {
                                    $(this).wrapInner('<strong></strong>');
                                } else if ( key == 'text-decoration' && style[key] == 'underline' ) {
                                    $(this).wrapInner('<u></u>');
                                } else if ( key == 'text-decoration' && style[key] == 'line-through' ) {
                                    $(this).wrapInner('<s></s>');
                                } else if ( key == 'vertical-align' && style[key] == 'sub' ) {
                                    $(this).wrapInner('<sub></sub>');
                                } else if ( key == 'vertical-align' && style[key] == 'super' ) {
                                    $(this).wrapInner('<sup></sup>');
                                }
                            }
                        }
                    }
                    if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'P' ) {
                        var styleP = ( style['text-align'] == 'center' ) ? 'Texto_Centralizado': 'Texto_Alinhado_Esquerda';
                            styleP = ( $(this).hasClass('Texto_Centralizado') ) ? 'Texto_Centralizado' : styleP;
                            styleP = ( $(this).hasClass('Tabela_Texto_Alinhado_Esquerda') ) ? 'Tabela_Texto_Alinhado_Esquerda' : styleP;
                        var allowed = ['background-color'];
                        var filteredStyle = Object.keys(style)
                                      .filter(key => allowed.includes(key))
                                      .reduce((obj, key) => {
                                        obj[key] = style[key];
                                        return obj;
                                      }, {});
                        $(this).addClass(styleP).removeClass(className);
                    } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'TABLE' ) {
                        $(this).css('margin','auto');
                    } else if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'SPAN' ) {
                        var allowed = ['color', 'background-color'];
                        var filteredStyle = Object.keys(style)
                                      .filter(key => allowed.includes(key))
                                      .reduce((obj, key) => {
                                        obj[key] = style[key];
                                        return obj;
                                      }, {});
                        $(this).css(filteredStyle).removeClass(className);
                        if ($.isEmptyObject(filteredStyle)) {
                            $(this).after($(this).html()).remove();
                        }
                    } else if ( (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI') || (typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'UL') ) {
                        var allowed = ['margin', 'margin-left', 'margin-top', 'margin-rigth', 'margin-left', 'padding', 'padding-left', 'padding-top', 'padding-rigth', 'padding-left', 'color', 'background-color'];
                        var filteredStyle = Object.keys(style)
                                      .filter(key => allowed.includes(key))
                                      .reduce((obj, key) => {
                                        obj[key] = style[key];
                                        return obj;
                                      }, {});
                        if ( typeof $(this)[0] !== 'undefined' && $(this)[0].tagName == 'LI' && $(this).find('p.Tabela_Texto_Alinhado_Esquerda').length == 0 ) {
                            $(this).wrapInner('<p></p>').find('p').eq(0).addClass('Tabela_Texto_Alinhado_Esquerda').css('display','contents');
                        }
                        $(this).css(filteredStyle).removeClass(className);
                    } else {
                        $(this).css(style).removeClass(className);
                    }
                });
            } else {
                iframeDoc.find(key).each(function(){
                    if (typeof $(this)[0] !== 'undefined' && ( $(this)[0].tagName == 'P' || $(this)[0].tagName == 'SPAN')) {
                        $(this).removeClass(className);
                    }
                });
            }
        }
    }
    //iframeDoc.find('style[data-style="seipro-import"]').remove();
}
function isBase64(str) {
    try {
        return btoa(atob(str)) == str;
    } catch (err) {
        return false;
    }
}
function ImgToBase64(iframeDoc, TimeOut = 1000) {
    if (TimeOut <= 0) { 
        iframeDoc.find('img').not('.img-base64').each(function(){
            if (!isBase64($(this).attr('src'))) { 
                $(this).after('<span style="color:#FF0000;"><span style="background-color:#FFFF00;">[!Erro ao converter a imagem!]</span></span>');
                $(this).remove();
            }
        });
        return; 
    }
    iframeDoc.find('img').not('.img-base64').each(function(){
        if (!isBase64($(this).attr('src'))) { 
            getBase64Image($(this));
        }
    });
    setTimeout(function(){ 
        if (!validarTagsPro()) { 
            console.log('RELOAD', TimeOut);
            ImgToBase64(iframeDoc, TimeOut - 200); 
        }
    }, 1000);
}
function openLinkSEIPro(id_procedimento) {
    var url_host = window.location.href.split('?')[0];
    var url = url_host+'?acao=procedimento_trabalhar&id_procedimento='+id_procedimento;
    var win = window.open(url, '_blank');
    if (win) {
        win.focus();
    } else {
        alert('Por favor, permita popups para essa p\u00E1gina');
    }
}
function openSEINrPro(nrSEI){
    $('#txtPesquisaRapida').val(nrSEI);
    $('#frmProtocoloPesquisaRapida').submit();
}
function updateDialogDefinitionPro() {
    CKEDITOR.on('dialogDefinition', function (ev) {
            var dialogName = ev.data.name;
            var dialogDefinition = ev.data.definition;
            var dialog = dialogDefinition.dialog;
            if (dialogName == 'simpleLinkDialog') {
                dialogDefinition.onShow = function () {
                    var idEditor = this.getParentEditor().name;
                    $('#idEditor').val(idEditor);
                    insertTextTotLink(idEditor);
                };
                dialogDefinition.onOk = function () {
                    var a = this.getParentEditor(),
                        b = {},
                        c = a.document.createElement("a");
                    this.commitContent(b);
                    c.setAttribute("href", b.url);
                    b.newPage && c.setAttribute("target", "_blank");
                    switch (b.style) {
                    case "b":
                        c.setStyle("font-weight", "bold");
                        break;
                    case "u":
                        c.setStyle("text-decoration", "underline");
                        break;
                    case "i":
                        c.setStyle("font-style", "italic")
                    }
                    c.setHtml(b.contents);
                    a.insertElement(c);
                    //console.log('setAllLinkTipsPro');
                    setTimeout(function(){ setAllLinkTips() }, 1000);
                };
            }
    });
}
function centralizeDialogBox(el) {
    $(document).ready(function() {
        if (el) {
            el.dialog({ position: { my: "center", at: "center", of: window } });
        }
    });
}
function selectTextPro(el) {
    var sel, range;
    if (window.getSelection && document.createRange) { //Browser compatibility
      sel = window.getSelection();
      if(sel.toString() == ''){ //no text selection
         window.setTimeout(function(){
            range = document.createRange(); //range object
            range.selectNodeContents(el); //sets Range
            sel.removeAllRanges(); //remove all ranges from selection
            sel.addRange(range);//add Range to a Selection.
        },1);
      }
    }
}
function hashCompareDocToggle(this_) {
    if ($(this_).find('i').hasClass('fa-chevron-circle-down')) {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').show();
        $(this_).find('i').addClass('fa-chevron-circle-up').removeClass('fa-chevron-circle-down');
    } else {
        $(this_).closest('#hashIntegrityPro').find('.hashCompareDoc').hide();
        $(this_).find('i').addClass('fa-chevron-circle-down').removeClass('fa-chevron-circle-up');
    }
}
function updateChecksumPro(hash) {
    var nameDoc = $('#ifrArvore').contents().find('.infraArvoreNoSelecionado').text();
    var droppableDoc =   '  <div class="input">'+
                         '      <div id="droppable-zone">'+
                         '          <div id="droppable-zone-wrapper">'+
                         '              <div id="droppable-zone-text"><i class="fa fa-upload cinzaColor" style="font-size: 16pt;"></i> Clique ou arraste para carregar um documento</div>'+
                         '          </div>'+
                         '          <input id="inputCompareDoc" type="file" placeholder="Clique ou arraste para carregar um documento" class="droppable-file">'+
                         '      </div>'+
                         '  </div>';
    var tableIntegrity = '<table>'+
                         '  <tr>'+
                         '    <td colspan="2"><h3><i class="iconPopup fa fa-file azulColor" style="margin: 3px 3px 0 0;"></i>'+nameDoc+'</h3></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>MD5:</label></td>'+
                         '    <td><label class="hash hashMD5">'+hash.hashMD5+'</label></td>'+
                         '  </tr>'+
                         '  <tr>'+
                         '    <td><label>SHA256:</label></td>'+
                         '    <td><label class="hash hashSHA256">'+hash.hashSHA256+'</label></td>'+
                         '  </tr>'+
                         '</table>'+
                         '<div><a onclick="hashCompareDocToggle(this)" class="newLink link_line" style="cursor:pointer"><i class="fa fa-chevron-circle-down cinzaColor" style="margin: 3px 3px 0 0;"></i> Comparar documento</a></div>'+
                         '<div class="hashCompareDoc" style="display:none;">'+
                         '          <input id="inputCompareDoc" style="font-size: 10pt; padding: 15px 10px;" type="file" placeholder="Clique ou arraste para carregar um documento">'+
                         '  <div id="outputompareDoc" style="border-radius: 10px; padding: 0 10px;"></div>'+
                         '</div>';
    $('#hashIntegrityPro').html(tableIntegrity).find('label.hash').on('mouseup', function() { 
        selectTextPro($(this)[0]);
    });
    $('#inputCompareDoc').on('change', function() {
        var input = $('#inputCompareDoc')[0];
        if (input.files && input.files[0]) {
            centralizeDialogBox(dialogBoxPro);
            $('#outputompareDoc').html('<i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...').css('background', '#fff');
            var global = global || window;
            const reader = new global.FileReader();
            reader.onload = event => {
                var result = event.target.result;
                var wordArray = CryptoJS.lib.WordArray.create(result),
                    hashMD5 = CryptoJS.MD5(wordArray).toString(),
                    hashSHA256 = CryptoJS.SHA256(wordArray).toString();
                    compareChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
            };
            reader.readAsArrayBuffer(input.files[0]);
        }
    });
}
function compareChecksumPro(hash) {
    var hashMD5 = $('#hashIntegrityPro').find('.hashMD5').text();
    var hashSHA256 = $('#hashIntegrityPro').find('.hashSHA256').text();
    var statusCompare = (hashMD5 == hash.hashMD5 && hashSHA256 == hash.hashSHA256) ? {background: '#f8fdf7', icon: 'check-circle', color: 'verdeColor', text: 'Os c\u00F3digos de integridade s\u00E3o id\u00EAnticos'} : {background: '#fdf7f7', icon: 'times-circle', color: 'vermelhoColor', text: 'Os c\u00F3digos de integridade N\u00C3O s\u00E3o id\u00EAnticos'};
    var tableIntegrityCompare =  '<table>'+
                                 '  <tr>'+
                                 '    <td colspan="2"><h3><i class="iconPopup fa fa-'+statusCompare.icon+' '+statusCompare.color+'" style="font-size: 18pt;"></i>'+statusCompare.text+'</h3></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>MD5:</label></td>'+
                                 '    <td><label class="hash hashMD5_compare">'+hash.hashMD5+'</label></td>'+
                                 '  </tr>'+
                                 '  <tr>'+
                                 '    <td><label>SHA256:</label></td>'+
                                 '    <td><label class="hash hashSHA256_compare">'+hash.hashSHA256+'</label></td>'+
                                 '  </tr>'+
                                 '</table>';
    $('#outputompareDoc')
        .html(tableIntegrityCompare)
        .css('background',statusCompare.background)
        .find('label.hash').on('mouseup', function() { 
            selectTextPro($(this)[0]);
    });
    centralizeDialogBox(dialogBoxPro);
}
function openChecksumPro() {
    var htmlBox = '<div id="hashIntegrityPro"><i class="fas fa-sync-alt fa-spin azulColor" style="float: left;margin: 0 8px 0 0;"></i> Carregando dados...</div>';
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div class="alertaBoxPro">'+htmlBox+'</div>')
            .dialog({
                title: "Visualizar C\u00F3digo de Integridade",
                width: 650
        });
}
function calculateHashPro(blob) {
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function () {
      var wordArray = CryptoJS.lib.WordArray.create(reader.result),
          hashMD5 = CryptoJS.MD5(wordArray).toString(),
          hashSHA256 = CryptoJS.SHA256(wordArray).toString();
          updateChecksumPro({hashMD5: hashMD5, hashSHA256: hashSHA256});
          centralizeDialogBox(dialogBoxPro);
    };
}
function sendChecksumPro(url) {
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';

  xhr.onreadystatechange = function (event) {
    if (event.target.readyState == 4) {
      if (event.target.status == 200 || event.target.status == 0) {
        //Status 0 is setup when protocol is "file:///" or "ftp://"
        var blob = this.response;
        calculateHashPro(blob);
      } else {
      }
    }
  };
  xhr.open('GET', url, true);
  xhr.send();
}
function getChecksumPro() {
    var linkAnexo = $('#ifrVisualizacao').contents().find('#divInformacao a');
    var url = (linkAnexo.length > 0 && linkAnexo.attr('href').indexOf('acao=documento_download_anexo') !== -1) ? linkAnexo.attr('href') : false;
    if (url) { 
        openChecksumPro();
        sendChecksumPro(url);
    }
}
function insertIconIntegrity(TimeOut = 9000) {
    waitLoadPro($('#ifrVisualizacao').contents(), '#divInformacao', "a.ancoraArvoreDownload", appendIconIntegrity);
}
function appendIconIntegrity() {
    var ifrVisualizacao = $('#ifrVisualizacao').contents();
    var linkAnexo = ifrVisualizacao.find('#divInformacao').find('a').eq(0).attr('href');
    if (ifrVisualizacao.find('#iconIntegrityPro').length == 0 ) {
        var base65IconIntegrity = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM/rhtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyVpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDgxQ0NGRjUyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDgxQ0NGRjYyNkNEMTFFQkFCOUJEQUI3RTE0QTRDODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowODFDQ0ZGMzI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowODFDQ0ZGNDI2Q0QxMUVCQUI5QkRBQjdFMTRBNEM4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pm2LucYAAAbsSURBVHja7FhZ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';
        var htmlIconIntegrity =  '<a href="#" id="iconIntegrityPro" onclick="parent.getChecksumPro();" tabindex="452" class="botaoSEI">'+
                                 '<img class="infraCorBarraSistema" tabindex="452" src="'+base65IconIntegrity+'" alt="Visualizar C\u00F3digo de Integridade (Hashcode)" title="Visualizar C\u00F3digo de Integridade (Hashcode)">'+
                                 '</a>';
            ifrVisualizacao.find('#divArvoreAcoes').append(htmlIconIntegrity);
    }
}
