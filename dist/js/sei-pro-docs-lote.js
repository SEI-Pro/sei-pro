if (typeof parent.URL_SPRO !== 'undefined') $.getScript((parent.URL_SPRO+"js/lib/jschardet.min.js"));
if (typeof parent.URL_SPRO !== 'undefined') $.getScript((parent.URL_SPRO+"js/lib/papaparse.js"));

const docsLote_specialChars={"À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","Æ":"&AElig;","æ":"&aelig;","ß":"&szlig;","Ç":"&Ccedil;","ç":"&ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ƒ":"&#131;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","Ñ":"&Ntilde;","ñ":"&ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","Ø":"&Oslash;","ø":"&oslash;","Œ":"&#140;","œ":"&#156;","Š":"&#138;","š":"&#154;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","µ":"&#181;","×":"&#215;","Ý":"&Yacute;","Ÿ":"&#159;","ý":"&yacute;","ÿ":"&yuml;","°":"&#176;","º":"&#176;","†":"&#134;","‡":"&#135;","±":"&#177;","«":"&#171;","»":"&#187;","¿":"&#191;","¡":"&#161;","·":"&#183;","•":"&#149;","™":"&#153;","©":"&copy;","®":"&reg;","§":"&#167;","¶":"&#182;"};
const docsLote_normalChars={"À":"A","Á":"A","Â":"A","Ã":"A","Ä":"A","Å":"A","à":"a","á":"a","â":"a","ã":"a","ä":"a","å":"a","Æ":"_","æ":"_","ß":"B","Ç":"C","ç":"c","È":"E","É":"E","Ê":"E","Ë":"E","è":"e","é":"e","ê":"e","ë":"e","ƒ":"f","Ì":"I","Í":"I","Î":"I","Ï":"I","ì":"i","í":"i","î":"i","ï":"i","Ñ":"N","ñ":"n","Ò":"O","Ó":"O","Ô":"O","Õ":"O","Ö":"O","ò":"o","ó":"o","ô":"o","õ":"o","ö":"o","Ø":"_","ø":"_","Œ":"_","œ":"_","Š":"S","š":"S","Ù":"U","Ú":"U","Û":"U","Ü":"U","ù":"u","ú":"u","û":"u","ü":"u","µ":"u","×":"_","Ý":"Y","Ÿ":"Y","ý":"y","ÿ":"y","°":"","º":"","†":"_","‡":"_","±":"_","«":"_","»":"_","¿":"_","¡":"_","·":"_","•":"_","™":"_","©":"_","®":"_","§":"_","¶":"_"};

let dataDocs = [];
let dynamicFields = [];
let CSVData = [];
let CSVHeaders = [];
let dataCrossing = []
let selectedModel = {};
let CSVFileName = '';
let docsNames = '';
let aborted = false;
let flagError = false;
let flagConfirmSpecialChars = false;
let forceNames = false;
let pageHelp = typeof URLPAGES_SPRO !== 'undefined' ? URLPAGES_SPRO+'/pages/DOCUMENTOSEMLOTE.html' : false;
let docsCriados = [];

const docsLote_fillSelect = (select) => {
    let resultado = '';
    let contadorDocsValidos = 0;
    dataDocs.forEach((doc) => {
        if (doc.cancelado || doc.externo || !doc.src) {
            resultado += `<option value="${doc.nome}" data-id_documento="${doc.id_documento}" disabled title="Documento n\u00E3o v\u00E1lido para replica\u00E7\u00E3o em lote">${doc.nome}</option>`
        } else {
            resultado += `<option value="${doc.nome}" data-id_documento="${doc.id_documento}">${doc.nome}</option>`;
            contadorDocsValidos++;
        }
    });

    if (contadorDocsValidos === 0) {
        select.after(`<small class="noFieldsError">N\u00E3o h\u00E1 documentos v\u00E1lidos para reprodu\u00E7\u00E3o no processo<small>`);
    } else {
        select.removeAttr('disabled');
        select.children().remove();
        select.append(resultado);
    }
    select.trigger('chosen:updated');
    $('#docLoteSelect_chosen').removeClass('chosenLoading');
}

const docsLote_getDocsArvore = () => {
    const select = $('#docLoteSelect');
    dataDocs = [];
    /* Verifica se existe o botão (+) para expandir pastas na árvore */
    const urlBtnExpandirPastas = $("#ifrArvore").contents().find("[id^='anchorAP']").attr('href');
    const urlArvore = $("#ifrArvore").attr('src');
    const urlBusca = urlBtnExpandirPastas ? urlBtnExpandirPastas : urlArvore;

    $.get(urlBusca).done((htmlArvore) => {
        const lines = htmlArvore.split('\n');
        const pattern1 = /^Nos\[\d{1,}\] = new infraArvoreNo\("DOCUMENTO/i;
        const pattern2 = /^Nos\[\d{1,}\]\.src = 'controlador/i;

        lines.forEach((line) => {
            if (pattern1.test(line)) {
                const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
                const props = line.slice(line.indexOf('(') + 1, line.lastIndexOf(')')).replaceAll(`"`, ``).replaceAll(`\\\\`).split(',');
                const split_doc = line.split('"');

                if (props[17]) { //documentos com vírgula têm quebra de linha por conta do split. Esta condição concatena as linhas quebradas
                    dataDocs.push({
                        nrNo,
                        nome: `${props[5]},${props[6]}`,
                        numero: isNewSEI ? split_doc[25] : split_doc[21],
                        id_documento: split_doc[3],
                        cancelado: props[7].startsWith('Documento Cancelado') ? true : false,
                        externo: props[9].includes('documento_interno') ? false : true
                    });
                } else {
                    dataDocs.push({
                        nrNo,
                        nome: props[5],
                        numero: isNewSEI ? split_doc[25] : split_doc[21],
                        id_documento: split_doc[3],
                        cancelado: props[6].startsWith('Documento Cancelado') ? true : false,
                        externo: props[9].includes('documento_interno') ? false : true
                    });
                }
            }
        });

        lines.forEach((line) => {   //Percorre o array novamente em busca dos links diretos para os documentos
            if (pattern2.test(line)) {
                const nrNo = line.substring(1, line.indexOf(']')).match(/\d{1,}/)[0];
                const src = line.substring(line.indexOf(`'`) + 1, line.lastIndexOf(`'`))
                const docMatched = dataDocs.find((dataDoc) => dataDoc.nrNo === nrNo);
                dataDocs[dataDocs.indexOf(docMatched)] = { ...docMatched, src };
            }
        });
        docsLote_fillSelect(select);

    }).then(() => {
        $("#btnSelecaoDoc").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    });
}

const docsLote_docAnalysis = (protocolo) => {
    $('#fieldList').remove();
    dynamicFields = [];

    if (!$('#loaderAnalysis')[0]) { //So o loader renderiza se ja nao existir
        $('#dialogBoxDocLote').append(`<div id='loaderAnalysis' style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);
        $("#btnConfirmAnalysis").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled'); //Desabilita Botao OK ate o carregamento
    }

    const selectedDoc = dataDocs.find((doc) => doc.id_documento.toString() === protocolo.toString());

    $.get(selectedDoc.src).done((contentDoc) => {
        const body = contentDoc.substring(contentDoc.indexOf('<body>'), contentDoc.lastIndexOf('</body>'))
        const matches = Array.from(new Set(body.match(/##.+?##/gm)));//rearranjo para remover duplicatas
        docsLote_fillModelAnalysis(matches, selectedDoc);
    }).then(() => {
        $("#loaderAnalysis").remove();
    });
}

const docsLote_fillModelAnalysis = (matches, selectedDoc) => {
    selectedModel = selectedDoc;
    dynamicFields = matches.map((field) => field.trim());

    $('#dialogBoxDocLote').append(`<div id='fieldList'></div>`);
    $('#fieldList').append(`<p class="textAnalysis"><i class='fas fa-file-alt azulColor'></i> Documento: ${selectedDoc.nome}</p>`)
    if (matches.length) {

        let lista = `<ul class="textAnalysis" style="max-height: 250px;overflow-y: auto;">\n`;
        matches.forEach((field) => {
            lista += `<li>${field.replaceAll('#', '')}</li>\n`
        })
        lista += '</ul>';
        $('#fieldList').append(`<p class="textAnalysis dFielTitle"><i class='fas fa-hashtag cinzaColor'></i> Campos din\u00E2micos detectados:</p>`)
        $('#fieldList').append(lista);
        $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
    } else {
        $('#fieldList').append(`<small class="noFieldsError">N\u00E3o foi identificado nenhum campo din\u00E2mico no documento modelo informado. Verifique se os mesmos foram redigidos corretamente com o padr\u00E3o ##nome do campo##.</small>`)
    }
    centralizeDialogBox(dialogBoxPro);

}

const docsLote_detectEncodingCSV = () => {
    $("#inputBD").on("change", function () {
        const file = $(this)[0].files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            let csvResult = e.target.result.split(/\r|\n|\r\n/);
            $("#inputBD").attr('encoding', jschardet.detect(csvResult.toString()).encoding.toLowerCase());
        }
        reader.readAsBinaryString(file);
    });
}

const docsLote_CSVAnalysis = (file) => {
    $('#fieldListCSV').remove();
    //So renderiza se ja nno existir
    if (!$('#loaderAnalysisCSV')[0]) $('#dialogBoxDocLote').append(`<div id='loaderAnalysisCSV' style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);

    Papa.parse(file, {
        header: true,
        skipEmptyLines: "greedy",
        encoding: $("#inputBD").attr('encoding') === "utf-8" ? "utf-8" : "windows-1252",
        complete: (results) => {
            docsLote_fillCSVAnalysis(results, file.name);
            $("#loaderAnalysisCSV").remove();
            centralizeDialogBox(dialogBoxPro);
        }
    });
}

const docsLote_fillCSVAnalysis = (parseData, filename) => {
    CSVFileName = filename;
    CSVData = parseData.data;
    if (typeof CSVData[0] !== 'undefined' && CSVData[0] !== null) {
        CSVHeaders = Object.keys(CSVData[0]).filter(Boolean); // Rearranjo para remover cabecalhos vazios

        $('#dialogBoxDocLote').append(`<div id='fieldListCSV'></div>`)
        $('#fieldListCSV').append(`<p class="textAnalysis"><i class='fas fa-file-csv azulColor'></i> Arquivo: ${filename}</p>`)
        if (CSVHeaders.length) {
            let lista = `<ul class="textAnalysis" style="max-height: 250px;overflow-y: auto;">\n`;
                CSVHeaders.forEach((field) => {
                    lista += `<li>${field}</li>\n`
                });
                lista += '</ul>';
            $('#fieldListCSV').append(`
                <p class="textAnalysis dFielTitle"><i class='fas fa-layer-group cinzaColor'></i> Quantidade de registros: ${CSVData.length}</p>
                <p class="textAnalysis dFielTitle"><i class='fas fa-hashtag cinzaColor'></i> Cabe\u00E7alhos detectados:</p>
                ${lista}`);
            $("#btnConfirmAnalysis").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
        } else {
            docsLote_printFieldError();
        }
    } else {
        docsLote_printFieldError();
    }
}

const docsLote_printFieldError = () => {
    $('#dialogBoxDocLote').append(`<p class="noFieldsError"><i class="fas fa-exclamation-triangle vermelhoColor"></i> N\u00E3o foi identificado nenhum cabe\u00E7alho no arquivo enviado. <br><br>\uD83E\uDD14 Verifique se a planilha n\u00E3o est\u00E1 vazia.</p>`);
    $("#btnConfirmAnalysis").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
}
const docsLote_printDataCrossing = () => {
    dataCrossing = [];
    const cleanFields = dynamicFields.map((field) => field.replaceAll('#', ''));
        CSVHeaders.forEach((header) => {
            try {
                const matchedDynamicField = cleanFields.find((field) => field === header);
                if (matchedDynamicField) dataCrossing.push(header)
            } catch {
                return
            }
        });

    if (!dataCrossing[0]) {
        $('#dialogBoxDocLote').html(`<p class="noFieldsError"><i class="fas fa-exclamation-triangle vermelhoColor"></i> N\u00E3o existe correspond\u00EAncia no arquivo CSV informado!</p>`);
        $("#btnConfirm").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
    } else {
        let tbody = '';
            dataCrossing.forEach((data) => {
                tbody +=    `<tr>
                                <td style="padding-left: 10px;">${data}</td>
                                <td style="text-align:center;"><i class='fas fa-arrow-right azulColor'></i></td>
                                <td>##${data}##</td>
                            </tr>`;
            });

        let selectData = '';
            CSVHeaders.forEach(header => { selectData += `<option>${header}</option>` });

        $('#dialogBoxDocLote').append(`
            <div id="divTableDataCrossing">
                <div style="max-height: 300px;overflow-y: auto;">
                    <table id="tableDataCrossing" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                        <thead>
                            <th class="tituloControle" style="width: 47%;">${CSVFileName}</th>
                            <th class="tituloControle"></th>
                            <th class="tituloControle" style="width: 47%;">${selectedModel.nome}</th>
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>
                    </div>
            ${
                !isNewSEI ?
                `<hr style="all:revert">
                    <div>
                        <p>Nome do documento na \u00E1rvore de processos *</p>
                        <select id="nomesDoc">${selectData}</select>
                        <p><small>*Alguns documentos possuem a propriedade <b>N\u00FAmero</b> que quando preenchida exibe o valor na \u00E1rvore de processos logo ap\u00F3s o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato = N\u00FAmero)</small></p>
                        <div class="divInputForceNames" style="margin: 10px 0; font-size: 9pt;">
                            <input id="checkForceNames" type="checkbox">
                            <label for="checkForceNames">For\u00E7ar atribui\u00E7\u00E3o de nomes na \u00C1rvore (Pode gerar erros \uD83D\uDC80)</label>
                        </div>
                    </div>
                </div>
                `
                : isNewSEI ?
                `<hr style="all:revert">
                    <div>
                        <p>Nome do documento na \u00E1rvore de processos*</p>
                        <select id="nomesDoc">${selectData}</select>
                        <p><small>* Somente alguns tipos de documentos suportam</small></p>
                    </div>
                </div>
                ` : 
                ""
            }`);
            $('#nomesDoc').chosen({placeholder_text_single: ' ', no_results_text: 'Nenhum resultado encontrado'});

    }
    setTimeout(() => {
        centralizeDialogBox(dialogBoxPro);
    }, 300);
}

const docsLote_execute = async (param) => {
    aborted = false;

    // const urlNewDoc = $('#ifrVisualizacao').contents().find("img[alt='Incluir Documento'").parent().attr('href');
    const urlNewDoc = getUrlNewDocArvore();

    if (!urlNewDoc) {
        flagError = true;
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
    } else {
        if (getSeiVersionPro().startsWith("3")) {
            forceNames = param.forceNames;
            const regex = new RegExp(Object.keys(docsLote_normalChars).join('|'));
            const hasSpecialChars = CSVData.some(data => data[param.docsNames].match(regex))
            if (hasSpecialChars) {
                const confirmSpecialChars = confirm(`
                Os nomes escolhidos para constar na \u00E1rvore de processos cont\u00E9m caracteres especiais.

                O ideal \u00E9 que n\u00E3o possuam.Portanto, \u00E9 poss\u00EDvel que ocorram alguns problemas de formata\u00E7\u00E3o.

                Deseja continuar ?
                `)
                if (!confirmSpecialChars) {
                    docLoteModalCruzamentoDados(param.nrDoc, param.csvFile);
                    flagConfirmSpecialChars = true;
                    return;
                }
            }
        }

        for (let i = 0; i < CSVData.length; i++) {
            try {
                const response1 = await docsLote_clickNewDoc(urlNewDoc);
                const response2 = await docsLote_selectDocType(response1.urlExpandDocList);
                const response3 = await docsLote_formNewDoc(response2.urlFormNewDoc, CSVData[i], param);
                const response4 = await docsLote_confirmDocData(response3.urlConfirmDocData, response3.params);
                const response5 = await docsLote_editDocContent(response4.urlEditor, CSVData[i]);
                const response6 = await docsLote_saveDoc(response5.urlSubmitForm, response5.paramsSaveDoc);

                response6.success && $('#progress').html(`<p style="text-align:center">${i + 1}/${CSVData.length}<span style="display:block;white-space: nowrap;color: #ccc;font-size: 8pt;padding:5px">\u2592\u2592\u2592\u2592\u2592\u2592</span></p>`);

                if (i + 1 === CSVData.length) throw new Error("cancel");

            } catch (e) {
                if (e.message && e.message === "cancel") {
                    $('#ifrArvore').contents()[0].location.reload();
                    setTimeout(() => {
                        var htmlFilterDoclote = '<div class="btn-group filterTablePro" role="group" style="margin: 10px 0;">'+
                                                '   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">'+
                                                '       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                '       <span class="text">Baixar</span>'+
                                                '   </button>'+
                                                '   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">'+
                                                '       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>'+
                                                '       <span class="text">Copiar</span>'+
                                                '   </button>'+
                                                '</div>';

                        var theadRows = '<tr>';
                            theadRows += $.map(Object.keys(docsCriados[0].data_doc),function(k){ return '<th class="tituloControle">'+k+'</th>' }).join('');
                            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">nome_documento_gerado</th>';
                            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">numero_sei_gerado</th>';
                            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">link_documento_gerado</th>';
                            theadRows += '</tr>';

                        var tbodyRows = $.map(docsCriados, function(v){ 
                                            var _return = '<tr>';
                                                _return += $.map(v.data_doc,function(d){ return '<td style="white-space: nowrap;">'+decodeURIComponent(escape(d))+'</td>' }).join('');
                                                _return += '   <td style="white-space: nowrap;">'+(v.nome_documento || '')+' '+(v.data_doc[param.docsNames] || '')+'</td>';
                                                _return += '   <td style="white-space: nowrap;">'+(v.nr_sei || '')+'</td>';
                                                _return += '   <td style="white-space: nowrap;"><a href="'+(v.url_doc || '')+'" target="_blank" class="bLink" style="font-size: 9pt;">'+(v.url_doc || '')+'</a></td>';
                                                _return += '</tr>';
                                            return _return
                                        }).join('');
                        var tableResult = `
                                <div style="max-height: 350px;max-width: 850px;overflow: auto;">
                                    <table id="tableDataResult" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                                        <thead>
                                            ${theadRows}
                                        </thead>
                                        <tbody>
                                            ${tbodyRows}
                                        </tbody>
                                    </table>
                                </div>
                                `;
                        $('#preparingProgressCircular').remove();
                        $('#cancelExecute').hide();
                        $('#progress').html(`<h4 style="text-align:center;margin: 30px 0 10px 0; font-size: 1.5rem;"><i class="fas fa-check-circle verdeColor" style="font-size: 1em;"></i> Progresso finalizado! \uD83D\uDC4F</h4>`+tableResult);
                        // setTimeout(() => { resetDialogBoxPro('dialogBoxPro') }, 2000);
                        dialogBoxPro.dialog('option', 'width', 870);
                        dialogBoxPro.dialog('option', 'height', 500);
                        $('#tableDataResult').find('thead').prepend(htmlFilterDoclote);

                        console.log(docsCriados);
                    }, 500)
                } else {
                    flagError = true;
                    console.log("Erro \uD83D\uDE22 -> ", e);
                    docLoteModalErro();
                }
                aborted = false;
                break;
            }
        }
    }
}

const docsLote_clickNewDoc = async (urlNewDoc) => {
    const htmlChooseDocType = await $.get(urlNewDoc);
    const urlExpandDocList = $(htmlChooseDocType).find('#frmDocumentoEscolherTipo').attr('action');

    if (aborted) throw new Error("cancel");
    if (typeof urlExpandDocList !== 'undefined') $('#progress span').text('\u2588\u2592\u2592\u2592\u2592\u2592');
    return {
        urlExpandDocList,
        success: true
    }
}
const docsLote_selectDocType = async (urlExpandDocList) => {

  const htmlExpandedDocList = await $.ajax({
    method: 'POST',
    url: urlExpandDocList,
    data: { hdnFiltroSerie: 'T' }
  });

  const htmlTypeList = $(htmlExpandedDocList).find('.ancoraOpcao')
  let typeList = []
  for (let i = 0; i < htmlTypeList.length; i++) {
    typeList.push({
      nome: htmlTypeList[i].textContent,
      url: htmlTypeList[i].getAttribute("href")
    });
  }
  let urlFormNewDoc = '';
  typeList.some((type) => {
    if (selectedModel.nome.startsWith(type.nome)) {
      urlFormNewDoc = type.url;
      return true;
    }
  });
  if (aborted) throw new Error("cancel");
  if (urlFormNewDoc != '') $('#progress span').text('\u2588\u2588\u2592\u2592\u2592\u2592');
  return {
    urlFormNewDoc,
    success: true
  };
}
const docsLote_formNewDoc = async (urlFormNewDoc, data, dataDialog) => {
    const htmlFormNewDoc = await $.get(urlFormNewDoc);
    const form = $(htmlFormNewDoc).find('#frmDocumentoCadastro')
    const urlConfirmDocData = form.attr('action');
    const numeroOpcional = form.find("#lblNumero").attr('class') === 'infraLabelOpcional';
    const nomeOpcional = form.find("#lblNomeArvore").attr('class') === 'infraLabelOpcional';

    let params = {};
    form.find("input[type=hidden]").each(function () {
        if ($(this).attr('name') && $(this).attr('id').includes('hdn')) {
            params[$(this).attr('name')] = $(this).val();
        }
    });
    form.find('input[type=text]').each(function () {
        if ($(this).attr('id') && $(this).attr('id').includes('txt')) {
            params[$(this).attr('id')] = $(this).val();
        }
    });
    form.find('select').each(function () {
        if ($(this).attr('id') && $(this).attr('id').includes('sel')) {
            params[$(this).attr('id')] = $(this).val();
        }
    });
    form.find('input[type=radio]').each(function () {
        if ($(this).attr('name') && $(this).attr('name').includes('rdo')) {
            params[$(this).attr('name')] = $(this).val();
        }
    });
    params.rdoNivelAcesso = '0';
    params.hdnFlagDocumentoCadastro = '2';
    params.txaObservacoes = '';
    params.txtDescricao = '';
    params.txtProtocoloDocumentoTextoBase = selectedModel.numero;
    const regex = new RegExp(Object.keys(docsLote_normalChars).join('|'), 'g');

    if (!numeroOpcional || forceNames) {
        params.txtNumero = data[dataDialog.docsNames].replace(regex, (match) => docsLote_normalChars[match]).substring(0, 50);
    } else {
        params.txtNumero = '';
    }

    // params.txtNomeArvore = (nomeOpcional && isNewSEI) ? data[dataDialog.docsNames].replace(regex, (match) => docsLote_normalChars[match]).substring(0, 50) : '';
    params.txtNomeArvore = (nomeOpcional && isNewSEI) ? decodeURIComponent(escape(data[dataDialog.docsNames].substring(0, 50))) : '';
    
    if (aborted) throw new Error("cancel");
    if (typeof urlConfirmDocData !== 'undefined') $('#progress span').text('\u2588\u2588\u2588\u2592\u2592\u2592');

    return {
        urlConfirmDocData,
        params,
        success: true
    };
}
const docsLote_confirmDocData = async (urlConfirmDocData, params) => {

    var postData = '';
    for (var k in params) {
        if (postData !== '') postData = postData + '&';
        var valor = (k=='txtNomeArvore') ? escapeComponent(params[k]) : params[k];
            postData = postData + k + '=' + valor;
    }

    const htmlDocCreated = await $.ajax({
        method: 'POST',
        url: urlConfirmDocData,
        // data: params,
        data: postData,
        contentType: 'application/x-www-form-urlencoded; charset=ISO-8859-1'
    });

    const lines = htmlDocCreated.split('\n');
    let urlEditor = '';
    if (getSeiVersionPro().startsWith("3")) {
        urlEditor = lines.filter((line) => line.includes(`if ('controlador.php?acao=editor_montar`))[0].match(/'(.+)'!/)[1];
    } else if (getSeiVersionPro().startsWith("4")) {
        urlEditor = lines.filter((line) => line.includes(`infraAbrirJanela('controlador.php?acao=editor_montar`))[0].match(/'(.+?)'/)[0].replaceAll("'", "");;
    } else
    throw new Error('vers\u00E3o do SEI incompat\u00EDvel');

    if (aborted) throw new Error("cancel");
    if (urlEditor != '') $('#progress span').text('\u2588\u2588\u2588\u2588\u2592\u2592');

    return {
        urlEditor,
        success: true
    };
}
const docsLote_editDocContent = async (urlEditor, data) => {
    const htmlEditor = await $.get(urlEditor);  //TODO: Lançar exceção, identificar e excluir o doc gerado erroneamente
    const urlSubmitForm = $(htmlEditor).filter((_, el) => $(el).attr('id') === 'frmEditor').attr('action');
    const urlParams = getParamsUrlPro(urlEditor);
    const docTitle = trycatch(() => htmlEditor.match(/<title[^>]*>([^<]+)<\/title>/)[1], false);
    const nrSEI = docTitle ? docTitle.split('-')[1].trim() : false;
    const nomeDocumento = docTitle ? docTitle.split('-')[2].trim() : false;

    const textAreas = $(htmlEditor).find('div#divEditores textarea');
    const allText = $.map(textAreas, function(v){ return $(v).text() }).join('');
    const arrayCamposDinamicos = uniqPro(getHashTagsPro($(allText).map(function(){ return $(this).text().replace(/\u00A0/gm, " ") }).get().join(' ')));
    const dadosProcesso = camposDinamicosProcesso(arrayCamposDinamicos);
    const regex1 = new RegExp(dataCrossing.map((data) => `##${data}##`).join('|'), 'g');
    const regex2 = new RegExp(Object.keys(docsLote_specialChars).join('|'), 'g');
    const regex3 = new RegExp(arrayCamposDinamicos.map((data) => `#${data}`).join('|'), 'g');
    const textAreasReplaced = textAreas.map((_, el) =>
        $(el).text().replace(regex1, (match) =>
            data[match.substring(2, match.length - 2)].replace(regex2, (match) => docsLote_specialChars[match])
        ).replace(regex3, (match) => dadosProcesso[match.substring(1, match.length)])
    );

    let paramsSaveDoc = {};
    textAreasReplaced.each((i, textArea) => {
        paramsSaveDoc[$(textAreas).eq(i).attr('name')] = textArea;
    });

    $(htmlEditor).find('input[type=hidden').each((_, input) => {
        if (!$(input).attr('name').toLowerCase().includes('unidade'))
        paramsSaveDoc[$(input).attr('name')] = $(input).val().replace(regex2, (match) => docsLote_specialChars[match]);
    });

    if (aborted) throw new Error("cancel");
    if (typeof urlSubmitForm !== 'undefined') $('#progress span').text('\u2588\u2588\u2588\u2588\u2588\u2592');

    docsCriados.push({
        nr_sei: nrSEI, 
        id_documento: urlParams.id_documento, 
        id_procedimento: urlParams.id_procedimento, 
        data_doc: data,
        nome_documento: nomeDocumento,
        url_doc: url_host+'?acao=procedimento_trabalhar&id_procedimento='+urlParams.id_procedimento+'&id_documento='+urlParams.id_documento
    });

    return {
        urlSubmitForm,
        paramsSaveDoc,
        success: true,
        nrSEI: nrSEI
    }

}
const docsLote_saveDoc = async (urlSubmitForm, paramsSaveDoc) => {
    const responseSave = await $.ajax({
        method: 'POST',
        url: urlSubmitForm,
        data: paramsSaveDoc,
    });
    if (aborted) throw new Error("cancel");
    
    if (responseSave.startsWith("OK")) {
        if (typeof urlSubmitForm !== 'undefined') $('#progress span').text('\u2588\u2588\u2588\u2588\u2588\u2588');
        return { success: true }
    } else {
        throw new Error(responseSave);
    }
}
const docsLote_abortAjax = () => {
    if (!flagError && !flagConfirmSpecialChars) {
        aborted = true;
        $('#cancelExecute').hide();
        $('#progress').html(`<p style="text-align:center">Cancelando progresso</p>`);
    } else {
        flagError = false;
        flagConfirmSpecialChars = false;
        aborted = false;
    }
}
function docLoteModalSelecaoDoc() {
    const urlNewDoc = getUrlNewDocArvore();
    if (!urlNewDoc) {
        flagError = true;
        alertaBoxPro('Error', 'exclamation-triangle', 'Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!');
    } else {
        var htmlBox =   '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                        '      <tr>'+
                        '          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">'+
                        '               <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> Selecione abaixo, dentre os documentos constantes na \u00E1rvore do processo, o modelo para reprodu\u00E7\u00E3o em lote:</label>'+
                        '           </td>'+
                        '      </tr>'+
                        '      <tr>'+
                        '           <td class="required">'+
                        '               <select id="docLoteSelect"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>'+
                        '           </td>'+
                        '      </tr>'+
                        '  </table>'+
                        (restrictConfigValue('documentosemlote') ? '<div style="margin: 10px 0;font-size: 8pt;color: #888;">C\u00F3digo-fonte gentilmente cedido por <a href="https://github.com/tcgontijo" target="_blank" style="color: #00c;">tcgontijo</a> | PluriDocs SEI!<div>' : '');

        resetDialogBoxPro('dialogBoxPro');
        dialogBoxPro = $('#dialogBoxPro')
            .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
            .dialog({
                title: 'Documento modelo - Sele\u00E7\u00E3o (1/6)',
                    width: 600,
                    open: () => {
                        $("#btnSelecaoDoc").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                        $('#docLoteSelect').chosen({placeholder_text_single: ' ', no_results_text: 'Nenhum resultado encontrado'});
                        $('#docLoteSelect_chosen').addClass('chosenLoading');
                        docsLote_getDocsArvore();
                        docsCriados = [];
                    },
                    buttons: [{
                        text: "Ajuda",
                        icon: 'ui-icon-help',
                        click: function () {
                            window.open(pageHelp);
                        }
                    },{
                        id: 'btnSelecaoDoc',
                        text: "Avan\u00E7ar",
                        icon: 'ui-icon-arrowthick-1-e',
                        class: 'confirm ui-state-active',
                        click: function () {
                            if ($(this).find('small')[0]) {
                                resetDialogBoxPro('dialogBoxPro');
                            } else {
                                const nrDoc = $('#docLoteSelect').find('option:selected').data('id_documento');
                                docLoteModalAnaliseDocModelo(nrDoc);
                            }
                        }
                    }]
        });
    }
}

const docLoteModalSelecaoBaseDados = (nrDoc) => {
    var htmlBox =   '   <table style="font-size: 10pt;width: 100%;" class="seiProForm">'+
                    '      <tr>'+
                    '          <td style="vertical-align: top;text-align: left;height: 40px;" class="label">'+
                    '               <label for="inputBD"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Selecione um arquivo no formato CSV para servir como base de dados para a gera\u00E7\u00E3o de documentos em lote:</label>'+
                    '           </td>'+
                    '      </tr>'+
                    '      <tr>'+
                    '           <td class="required">'+
                    '               <input id="inputBD" type="file" accept=".csv, text/csv"></input>'+
                    '           </td>'+
                    '      </tr>'+
                    '  </table>';

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Base de dados - Upload (3/6)',
            width: 600,
            open: () => {
                docsLote_detectEncodingCSV();
                $("#btnEnviaCSV").prop('disabled', true).addClass('ui-button-disabled ui-state-disabled');
                $("#inputBD").change(() => {
                    $("#btnEnviaCSV").prop('disabled', false).removeClass('ui-button-disabled ui-state-disabled');
                });
            },
            buttons: [{
                text: "Ajuda",
                icon: 'ui-icon-help',
                click: function () {
                    window.open(pageHelp);
                }
            },{
                text: "Voltar",
                icon: 'ui-icon-arrowthick-1-w',
                click: function () {
                    docLoteModalAnaliseDocModelo(nrDoc);
                }
            },{
                id: 'btnEnviaCSV',
                text: "Avan\u00E7ar",
                disabled: true,
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active',
                click: () => {
                    $('#baseDados small').remove();
                    const file = $("#inputBD")[0].files[0];
                    
                    if (file.name.substring(file.name.lastIndexOf("."), file.name.length).toLocaleLowerCase().trim() === ".csv") {
                        docLoteModalAnaliseCSV(nrDoc, $("#inputBD")[0].files[0]);
                    } else {
                        $('#inputBD').after(`<small class="noFieldsError">Arquivo inv\u00E1lido! Selecione um documento no formato "CSV".</small>`);
                    }
                }
            }]
        });
}

const docLoteModalLoader = (paramData) => {
    var htmlBox =   `<div style="margin-top: 35px;" id="preparingProgressCircular">
                        <div style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>
                    </div>
                    <div id="progress">
                        <p style="text-align:center" id="preparingProgress">Preparando ambiente</p>
                    </div>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Documentos em lote - Criando (6/6)',
            width: 300,
            open: () => {
                docsLote_execute(paramData);
            },
            close: () => {
                docsLote_abortAjax();
            },
            buttons: [{
                text: "Cancelar",
                id: 'cancelExecute',
                icon: 'ui-icon-cancel',
                click: function () {
                    docsLote_abortAjax();
                }
            }]
    });
}

const docLoteModalErro = (textError = false) => {
    var htmlBox =   `<div>
                        <p><i class="fas fa-exclamation-triangle vermelhoColor"></i> Eita! Algo deu errado na replica\u00E7\u00E3o de documentos \uD83D\uDE14</p>
                        <br>
                        <p>Verifique as configura\u00E7\u00F5es selecionadas e tente novamente.</p>
                        <p>${textError}</p>
                    </div>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: '\uD83E\uDD26\u200D\u2642\uFE0F Ops...',
            width: 600,
            buttons: [{
                text: "OK",
                class: 'ui-state-active',
                click: function () {
                    resetDialogBoxPro('dialogBoxPro');
                }
            }]
    });
}


const docLoteModalCruzamentoDados = (nrDoc, csvFile) => {
    var htmlBox = `<p>Segue abaixo o relacionamento entre cabe\u00E7alhos da base de dados e os campos din\u00E2micos do documento modelo:</p>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Cruzamento de dado (5/6)',
            width: 600,
            maxHeight: (window.innerHeight * 0.9),
            open: () => docsLote_printDataCrossing(),
            buttons: [{
                text: "Ajuda",
                icon: 'ui-icon-help',
                click: function () {
                    window.open(pageHelp);
                }
            },{
                text: "Voltar",
                icon: 'ui-icon-arrowthick-1-w',
                click: function () {
                    docLoteModalSelecaoBaseDados(nrDoc, csvFile);
                }
            },{
                id: 'btnConfirm',
                text: "Iniciar",
                icon: 'ui-icon-play',
                class: 'confirm ui-state-active',
                click: function () {
                    var paramData = {
                        docsNames: $('#nomesDoc').val(),
                        forceNames: $("#checkForceNames").is(":checked"),
                        nrDoc: nrDoc,
                        csvFile: csvFile
                    };
                    docLoteModalLoader(paramData);
                }
            }]
    });
}

const docLoteModalAnaliseDocModelo = (nrDoc) => {
    var htmlBox = `<p>An\u00E1lise do documento modelo:</p>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Documento modelo - Campos din\u00E2micos (2/6)',
            width: 600,
            maxHeight: (window.innerHeight * 0.9),
            open: () => {
                docsLote_docAnalysis(nrDoc);
            },
            buttons: [{
                    text: "Ajuda",
                    icon: 'ui-icon-help',
                    click: function () {
                        window.open(pageHelp);
                    }
                }, {
                    text: "Voltar",
                    icon: 'ui-icon-arrowthick-1-w',
                    click: function () {
                        docLoteModalSelecaoDoc();
                    }
                },{
                    id: 'btnConfirmAnalysis',
                    text: "Avan\u00E7ar",
                    icon: 'ui-icon-arrowthick-1-e',
                    class: 'confirm ui-state-active',
                    click: function () {
                        docLoteModalSelecaoBaseDados(nrDoc);
                    }
                },
            ]
    });
}

const docLoteModalAnaliseCSV = (nrDoc, csvFile) => {
    var htmlBox = `<p>An\u00E1lise da base de dados:</p>`;

    resetDialogBoxPro('dialogBoxPro');
    dialogBoxPro = $('#dialogBoxPro')
        .html('<div id="dialogBoxDocLote" class="dialogBoxDiv">'+htmlBox+'</div>')
        .dialog({
            title: 'Base de dados - Cabe\u00E7alhos e registros (4/6)',
            width: 600,
            open: () => {
                docsLote_CSVAnalysis(csvFile);
            },
            buttons: [{
                text: "Ajuda",
                icon: 'ui-icon-help',
                click: function () {
                    window.open(pageHelp);
                }
            },{
                text: "Voltar",
                icon: 'ui-icon-arrowthick-1-w',
                click: function () {
                    docLoteModalSelecaoBaseDados(nrDoc, csvFile);
                }
            },{
                id: 'btnConfirmAnalysisCSV',
                text: "Avan\u00E7ar",
                icon: 'ui-icon-arrowthick-1-e',
                class: 'confirm ui-state-active',
                click: function () {
                    docLoteModalCruzamentoDados(nrDoc);
                }
            }]
    });
}