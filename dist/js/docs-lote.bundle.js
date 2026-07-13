(() => {
  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function getSeiPro() {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.core = globalRef.SeiPro.core || {};
    globalRef.SeiPro.sei = globalRef.SeiPro.sei || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.state = globalRef.SeiPro.state || {};
    return globalRef.SeiPro;
  }
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/docs-lote/state.js
  var S = {
    CSVEncoding: "utf-8",
    dynamicFields: [],
    CSVData: [],
    CSVHeaders: [],
    dataCrossing: [],
    selectedModel: {},
    CSVFileName: "",
    aborted: false,
    flagError: false,
    flagConfirmSpecialChars: false,
    forceNames: false,
    docsCriados: [],
    listTxtPadraoDoc: []
  };
  function helpPageUrl() {
    return typeof URLPAGES_SPRO !== "undefined" ? `${URLPAGES_SPRO}/pages/DOCUMENTOSEMLOTE.html` : false;
  }

  // src/features/docs-lote/domain.js
  function extractNewDocUrl(htmlArvore) {
    const m = String(htmlArvore || "").match(
      /controlador\.php\?acao=documento_escolher_tipo&acao_origem=arvore_visualizar[^"]*/
    );
    if (!m) throw new Error("Erro ao encontrar o link de novo documento");
    return m[0];
  }
  function extractEditorUrl(htmlDocCreated) {
    const m = String(htmlDocCreated || "").match(
      /controlador\.php\?acao=editor_montar&id_procedimento=[^'"]*/
    );
    if (!m) throw new Error("Link de edi\xE7\xE3o n\xE3o encontrado");
    return m[0];
  }
  function interpolateEspecificacao(template, dataCSV) {
    return String(template || "").replace(
      /##(.*?)##/g,
      (match, chave) => dataCSV && dataCSV[chave] !== void 0 ? dataCSV[chave] : match
    );
  }
  function buildCrossingRegex(dataCrossing) {
    return new RegExp((dataCrossing || []).map((d) => `##${d}##`).join("|"), "g");
  }
  function serializeParams(params, shouldEscapeKey, escapeFn) {
    let postData = "";
    for (const k in params) {
      if (!Object.prototype.hasOwnProperty.call(params, k)) continue;
      if (postData !== "") postData += "&";
      const valor = shouldEscapeKey && shouldEscapeKey(k) ? escapeFn(params[k]) : params[k];
      postData += `${k}=${valor}`;
    }
    return postData;
  }

  // src/features/docs-lote/io.js
  var cancel = () => {
    throw new Error("cancel");
  };
  var getInitialProcUrl = async () => {
    const urlInitProc = $(`${mainMenu} a[href*="acao=procedimento_escolher_tipo"]`).attr("href");
    if (!urlInitProc) throw new Error("Erro ao iniciar a cria\xE7\xE3o do processo");
    return urlInitProc;
  };
  var getInitialProcHtml = async (urlInitProc) => $(await $.ajax({ url: urlInitProc }));
  var getFullProcList = async (htmlInitProc) => {
    const form = SeiPro.sei.adapter.isSEI5() ? htmlInitProc.find("#frmProcedimentoEscolherTipo") : htmlInitProc.find("#frmIniciarProcessoEscolhaTipo");
    const hrefForm = form.attr("action");
    const param = {};
    form.find("input[type=hidden]").each(function() {
      if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
        param[$(this).attr("name")] = $(this).val();
      }
    });
    param.hdnFiltroTipoProcedimento = "T";
    return $(await $.ajax({ method: "POST", data: param, url: hrefForm }));
  };
  var getProcForm = async (htmlFullList, id_tipo_procedimento) => {
    let urlProc = htmlFullList.find(`a[href*="procedimento_escolher_tipo&id_tipo_procedimento=${id_tipo_procedimento}"]`).attr("href");
    let checkPost = htmlFullList.find("#tblTipoProcedimento").find("a.ancoraOpcao").attr("href");
    checkPost = typeof checkPost !== "undefined" && checkPost == "#";
    if (checkPost) urlProc = await getSerieForm(htmlFullList, id_tipo_procedimento);
    if (!urlProc) {
      throw new Error("Erro ao selecionar o tipo de processo. Verifique se o tipo est\xE1 dispon\xEDvel no sistema e tente novamente");
    }
    return $(await $.ajax({ url: urlProc }));
  };
  var getSerieForm = async (htmlFullList, id_tipo_procedimento, nameDoc = null, id_tipo_documento = null) => {
    const urlForm = !nameDoc ? htmlFullList.find("#frmProcedimentoEscolherTipo") : htmlFullList.find("#frmDocumentoEscolherTipo");
    const param = {};
    urlForm.find("input[type=hidden]").each(function() {
      if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
        param[$(this).attr("name")] = $(this).val();
      }
    });
    if (id_tipo_documento) {
      param.hdnIdSerie = id_tipo_documento;
    } else if (nameDoc) {
      let hdnIdSerie = false;
      urlForm.find("input.infraCheckbox").each(function() {
        if ($(this).attr("title").startsWith(nameDoc)) {
          hdnIdSerie = $(this).val();
          return false;
        }
      });
      if (!hdnIdSerie) {
        throw new Error("Erro ao selecionar o tipo de documento. Verifique se o tipo est\xE1 dispon\xEDvel no sistema e tente novamente");
      }
      param.hdnIdSerie = hdnIdSerie;
    } else {
      param.hdnIdTipoProcedimento = id_tipo_procedimento;
    }
    const xhr = new XMLHttpRequest();
    await $.ajax({
      method: "POST",
      data: param,
      url: urlForm.attr("action"),
      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
      xhr: () => xhr
    });
    return xhr.responseURL;
  };
  var extractFormParams = (form) => {
    const param = {};
    form.find("input[type=hidden]").each(function() {
      if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) param[$(this).attr("name")] = $(this).val();
    });
    form.find("input[type=text]").each(function() {
      if ($(this).attr("id") && $(this).attr("id").indexOf("txt") !== -1) param[$(this).attr("id")] = $(this).val();
    });
    form.find("select").each(function() {
      if ($(this).attr("id") && $(this).attr("id").indexOf("sel") !== -1) param[$(this).attr("id")] = $(this).val();
    });
    form.find("input[type=radio]").each(function() {
      if ($(this).attr("name") && $(this).attr("name").indexOf("rdo") !== -1) param[$(this).attr("name")] = $(this).val();
    });
    return param;
  };
  var prepareFormData = (param, htmlFormProc, txtEspecificacaoProcesso) => {
    param.rdoNivelAcesso = "0";
    param.hdnFlagProcedimentoCadastro = "2";
    param.rdoProtocolo = "M";
    param.txaObservacoes = "";
    param.txtDescricao = txtEspecificacaoProcesso ? txtEspecificacaoProcesso.substring(0, 100).trim() : "";
    param.hdnAssuntos = htmlFormProc.find("#selAssuntos option").length === 0 ? [] : htmlFormProc.find("#selAssuntos option").map(function() {
      return $(this).val() + "\xB1" + $(this).text();
    }).get().join("\xA5").replaceAll(" ", "+");
    param.hdnInteressados = htmlFormProc.find("#selInteressados option").map(function() {
      return $(this).val() + "\xB1" + $(this).text();
    }).get().join("\xA5").replaceAll(" ", "+");
    return serializeParams(
      param,
      (k) => k === "hdnNomeTipoProcedimento" || k === "hdnAssuntos" || k === "txtDescricao",
      escapeComponent
    );
  };
  var createProc = async (hrefForm, postData) => {
    const xhr = new XMLHttpRequest();
    const htmlResult = await $.ajax({
      method: "POST",
      data: postData,
      url: hrefForm,
      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
      xhr: () => xhr
    });
    return { htmlResult, xhr };
  };
  var extractProcId = (htmlResult) => {
    const linkProc = $(htmlResult).find("#ifrArvore").attr("src");
    if (!linkProc) return false;
    const id_procedimento = getParamsUrlPro(linkProc).id_procedimento;
    return typeof id_procedimento !== "undefined" ? id_procedimento : false;
  };
  var docsLote_setNewProc = async (id_tipo_procedimento, txtEspecificacaoProcesso) => {
    try {
      const urlInitProc = await getInitialProcUrl();
      const htmlInitProc = await getInitialProcHtml(urlInitProc);
      const htmlFullList = await getFullProcList(htmlInitProc);
      const htmlFormProc = await getProcForm(htmlFullList, id_tipo_procedimento);
      const form = htmlFormProc.find("#frmProcedimentoCadastro");
      const hrefForm = form.attr("action");
      const param = extractFormParams(form);
      const postData = prepareFormData(param, htmlFormProc, txtEspecificacaoProcesso);
      const { htmlResult, xhr } = await createProc(hrefForm, postData);
      const status = xhr.responseURL.indexOf("controlador.php?acao=procedimento_trabalhar&acao_origem=procedimento_gerar") !== -1;
      if (status) {
        const id_procedimento = extractProcId(htmlResult);
        if (id_procedimento) {
          return url_host.replace("controlador.php", "") + `controlador.php?acao=procedimento_trabalhar&id_procedimento=${String(id_procedimento)}`;
        }
        alertaBoxPro("Error", "exclamation-triangle", "N\xE3o foi poss\xEDvel abrir o processo gerado. Verifique na caixa de entrada de sua unidade");
        return null;
      }
    } catch (error) {
      console.error("Erro na cria\xE7\xE3o do procedimento:", error);
      alertaBoxPro("Error", "exclamation-triangle", error.message);
      return null;
    }
  };
  var getProcessHtml = async (urlProcesso) => $(await $.ajax({ url: urlProcesso }));
  var getTreeUrl = (html) => {
    const urlArvore = html.find("#ifrArvore").attr("src");
    if (!urlArvore) throw new Error("Erro ao obter a URL da \xE1rvore do processo");
    return urlArvore;
  };
  var getTreeHtml = async (urlArvore) => $.ajax({ url: urlArvore });
  var docsLote_getUrlNewDoc = async (urlProcesso) => {
    try {
      const html = await getProcessHtml(urlProcesso);
      const urlArvore = getTreeUrl(html);
      const htmlArvore = await getTreeHtml(urlArvore);
      return extractNewDocUrl(htmlArvore);
    } catch (error) {
      console.error("Erro ao obter URL de novo documento:", error);
      alertaBoxPro("Error", "exclamation-triangle", error.message);
      return null;
    }
  };
  var docsLote_getLinkNewDoc = async (param, dataCSV) => {
    if (param.createNewProcs) {
      const txtEspecificacaoProcesso = interpolateEspecificacao(param.txtEspecificacaoProcesso, dataCSV);
      const urlProcesso = await docsLote_setNewProc(param.idTipoProcedimento, txtEspecificacaoProcesso);
      return urlProcesso ? await docsLote_getUrlNewDoc(urlProcesso) : false;
    }
    return getUrlNewDocArvore();
  };
  var docsLote_clickNewDoc = async (urlNewDoc, onProgress) => {
    const htmlChooseDocType = await $.get(urlNewDoc);
    const urlExpandDocList = $(htmlChooseDocType).find("#frmDocumentoEscolherTipo").attr("action");
    if (S.aborted) cancel();
    if (typeof urlExpandDocList !== "undefined") onProgress(1);
    return { urlExpandDocList, success: true };
  };
  var docsLote_selectDocType = async (urlExpandDocList, onProgress) => {
    const htmlExpandedDocList = await $.ajax({ method: "POST", url: urlExpandDocList, data: { hdnFiltroSerie: "T" } });
    const htmlTypeList = $(htmlExpandedDocList).find(".ancoraOpcao");
    let checkPost = htmlTypeList.attr("href");
    checkPost = typeof checkPost !== "undefined" && checkPost == "#";
    let urlFormNewDoc = false;
    if (checkPost) {
      urlFormNewDoc = await getSerieForm($(htmlExpandedDocList), null, S.selectedModel.nome, S.selectedModel.id_tipo_documento);
    } else {
      const typeList = [];
      for (let i = 0; i < htmlTypeList.length; i++) {
        typeList.push({ nome: htmlTypeList[i].textContent, url: htmlTypeList[i].getAttribute("href") });
      }
      typeList.some((type) => {
        if (S.selectedModel.nome.startsWith(type.nome)) {
          urlFormNewDoc = type.url;
          return true;
        }
      });
    }
    if (S.aborted) cancel();
    if (urlFormNewDoc) onProgress(2);
    return { urlFormNewDoc, success: true };
  };
  var docsLote_formNewDoc = async (urlFormNewDoc, data, dataDialog, onProgress) => {
    const htmlFormNewDoc = await $.get(urlFormNewDoc);
    const form = $(htmlFormNewDoc).find("#frmDocumentoCadastro");
    const urlConfirmDocData = form.attr("action");
    const numeroOpcional = form.find("#lblNumero").attr("class") === "infraLabelOpcional";
    const nomeOpcional = form.find("#lblNomeArvore").attr("class") === "infraLabelOpcional";
    const params = {};
    form.find("input[type=hidden]").each(function() {
      if ($(this).attr("name") && $(this).attr("id").includes("hdn")) params[$(this).attr("name")] = $(this).val();
    });
    form.find("input[type=text]").each(function() {
      if ($(this).attr("id") && $(this).attr("id").includes("txt")) params[$(this).attr("id")] = $(this).val();
    });
    form.find("select").each(function() {
      if ($(this).attr("id") && $(this).attr("id").includes("sel")) params[$(this).attr("id")] = $(this).val();
    });
    form.find("input[type=radio]").each(function() {
      if ($(this).attr("name") && $(this).attr("name").includes("rdo")) params[$(this).attr("name")] = $(this).val();
    });
    params.rdoNivelAcesso = "0";
    params.hdnFlagDocumentoCadastro = "2";
    params.txaObservacoes = "";
    params.txtDescricao = "";
    if (dataDialog.nrTxtPadrao) params.selTextoPadrao = S.selectedModel.numero;
    else params.txtProtocoloDocumentoTextoBase = S.selectedModel.numero;
    const nomeArvore = removeAcentos(data[dataDialog.docsNames].substring(0, 50)).trim();
    if (!numeroOpcional || S.forceNames) params.txtNumero = nomeArvore;
    else params.txtNumero = "";
    params.txtNomeArvore = nomeOpcional && SeiPro.sei.adapter.isNewSEI() ? decodeURIComponent(escape(nomeArvore)) : "";
    if (S.aborted) cancel();
    if (typeof urlConfirmDocData !== "undefined") onProgress(3);
    return { urlConfirmDocData, params, success: true };
  };
  var docsLote_confirmDocData = async (urlConfirmDocData, params, onProgress) => {
    const postData = serializeParams(params, (k) => k === "txtNomeArvore", escapeComponent);
    const htmlDocCreated = await $.ajax({
      method: "POST",
      url: urlConfirmDocData,
      data: postData,
      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1"
    });
    const urlEditor = extractEditorUrl(htmlDocCreated);
    if (S.aborted) cancel();
    onProgress(4);
    return { urlEditor, success: true };
  };
  var docsLote_editDocContent = async (urlEditor, data, onProgress) => {
    const htmlEditor = await $.get(urlEditor);
    const urlSubmitForm = $(htmlEditor).filter((_, el) => $(el).attr("id") === "frmEditor").attr("action");
    const urlParams = getParamsUrlPro(urlEditor);
    const docTitle = trycatch(() => htmlEditor.match(/<title[^>]*>([^<]+)<\/title>/)[1], false);
    const { nrSEI, nomeDocumento } = SeiPro.core.docslote.parseDocsLoteDocTitle(docTitle);
    const textAreas = $(htmlEditor).find("div#divEditores textarea");
    const regex1 = buildCrossingRegex(S.dataCrossing);
    const textAreasReplaced = textAreas.map(
      (_, el) => $(el).text().replace(
        regex1,
        (match) => SeiPro.core.docslote.encodeDocsLoteSpecialChars(data[match.substring(2, match.length - 2)])
      )
    );
    const paramsSaveDoc = {};
    textAreasReplaced.each((i, textArea) => {
      paramsSaveDoc[$(textAreas).eq(i).attr("name")] = textArea;
    });
    $(htmlEditor).find("input[type=hidden").each((_, input) => {
      if (!$(input).attr("name").toLowerCase().includes("unidade")) {
        paramsSaveDoc[$(input).attr("name")] = SeiPro.core.docslote.encodeDocsLoteSpecialChars($(input).val());
      }
    });
    if (S.aborted) cancel();
    if (typeof urlSubmitForm !== "undefined") onProgress(5);
    S.docsCriados.push({
      nr_sei: nrSEI,
      id_documento: urlParams.id_documento,
      id_procedimento: urlParams.id_procedimento,
      data_doc: data,
      nome_documento: nomeDocumento,
      url_doc: `${url_host}?acao=procedimento_trabalhar&id_procedimento=${urlParams.id_procedimento}&id_documento=${urlParams.id_documento}`
    });
    return { urlSubmitForm, paramsSaveDoc, success: true, nrSEI };
  };
  var docsLote_saveDoc = async (urlSubmitForm, paramsSaveDoc, onProgress) => {
    const responseSave = await $.ajax({ method: "POST", url: urlSubmitForm, data: paramsSaveDoc });
    if (S.aborted) cancel();
    if (responseSave.startsWith("OK")) {
      if (typeof urlSubmitForm !== "undefined") onProgress(6);
      return { success: true };
    }
    throw new Error(responseSave);
  };

  // src/features/docs-lote/templates.js
  var wrap = (inner) => `<div id="dialogBoxDocLote" class="dialogBoxDiv seipro-doclote-dialog">${inner}</div>`;
  function selecaoDocBox(credito = "") {
    return wrap(`<table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: top;text-align: left;height: 40px;" class="label">
                            <label for="docLoteSelect"><i class="iconPopup iconSwitch fas fa-file-alt cinzaColor"></i> Selecione abaixo, dentre os documentos constantes na \xE1rvore do processo, o modelo para reprodu\xE7\xE3o em lote:</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="required">
                            <select id="docLoteSelect" class="seipro-doclote-model-select"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>
                        </td>
                    </tr>
                    <tr>
                        <td style="vertical-align: bottom;text-align: left;height: 40px;" class="label">
                            <label for="textoPadraoSelect"><i class="iconPopup iconSwitch fas fa-keyboard cinzaColor"></i> ou Selecione do Texto Padr\xE3o da Unidade:</label>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <select id="textoPadraoSelect" class="seipro-doclote-template-select"><option><i class="fas fa-sync fa-spin cinzaColor"></i> carregando dados... </option></select>
                        </td>
                    </tr>
                </table>
                ${credito}`);
  }
  var creditoTcgontijo = '<div style="margin: 10px 0;font-size: 8pt;color: #888;">C\xF3digo-fonte gentilmente cedido por <a href="https://github.com/tcgontijo" target="_blank" style="color: #00c;">tcgontijo</a> | PluriDocs SEI!<div>';
  var analiseDocModeloBox = () => wrap(`<p>An\xE1lise do documento modelo:</p>`);
  var analiseCsvBox = () => wrap(`<p>An\xE1lise da base de dados:</p>`);
  var cruzamentoDadosBox = () => wrap(`<p>Segue abaixo o relacionamento entre cabe\xE7alhos da base de dados e os campos din\xE2micos do documento modelo:</p>`);
  function selecaoBaseDadosBox() {
    return wrap(`<table style="font-size: 10pt;width: 100%;" class="seiProForm">
                    <tr>
                        <td style="vertical-align: top;text-align: left;height: 40px;" class="label">
                            <label for="inputBD"><i class="iconPopup iconSwitch fas fa-upload cinzaColor"></i>Selecione um arquivo no formato CSV para servir como base de dados para a gera\xE7\xE3o de documentos em lote:</label>
                        </td>
                    </tr>
                    <tr>
                        <td class="required">
                            <input id="inputBD" class="seipro-doclote-csv-input" type="file" accept=".csv, text/csv"></input>
                        </td>
                    </tr>
                </table>`);
  }
  function loaderBox() {
    return wrap(`<div style="margin-top: 35px;" id="preparingProgressCircular" class="seipro-doclote-execution-loader">
                        <div style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>
                    </div>
                    <div id="progress" class="seipro-doclote-execution-progress">
                        <p style="text-align:center" id="preparingProgress">Preparando ambiente</p>
                    </div>`);
  }
  function erroBox(textError = "") {
    return wrap(`<div class="seipro-doclote-error-dialog">
                        <p><i class="fas fa-exclamation-triangle vermelhoColor"></i> Eita! Algo deu errado na replica\xE7\xE3o de documentos \u{1F614}</p>
                        <br>
                        <p>Verifique as configura\xE7\xF5es selecionadas e tente novamente.</p>
                        <p>${textError}</p>
                    </div>`);
  }
  function dataCrossingPanel({ csvFileName, modeloNome, tbody, selectData, isNewSEI, selectTiposProcessos }) {
    const blocoNomeDoc = !isNewSEI ? `
            <tr>
                <td colspan="2">
                    <p style="font-size: 1.2em;"><i class='fas fa-file-alt cinzaColor'></i> Nome do documento na \xE1rvore de processos <a class="newLink" style="font-size: 0.8em;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Alguns documentos possuem a propriedade <b>N\xFAmero</b> que quando preenchida exibe o valor na \xE1rvore de processos logo ap\xF3s o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato = N\xFAmero)')"><i class="fas fa-info-circle azulColor"></i></a></p>
                </td>
            </tr>
            <tr>
                <td colspan="2">
                    <select id="nomesDoc">${selectData}</select>
                </td>
            </tr>
            <tr>
                <td style="width: 50px;">
                    <div class="seipro-doclote-force-names" style="margin: 10px 0; font-size: 9pt;transform: scale(0.9);">
                        <div class="onoffswitch" style="float: left;margin-right: 1em;">
                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox seipro-doclote-force-names-toggle" id="checkForceNames" data-type="setdate" tabindex="0">
                        <label class="onoff-switch-label" for="checkForceNames"></label>
                    </div>
                </td>
                <td>
                    <label for="checkForceNames">For\xE7ar atribui\xE7\xE3o de nomes na \xC1rvore (Pode gerar erros \u{1F480})</label>
                </td>
            </tr>
            ` : `
            <tr>
                <td>
                    <div style="margin: 10px 0;display: inline-block;">
                    <p style="font-size: 1.2em;">Nome do documento na \xE1rvore de processos <a class="newLink" style="font-size: 0.8em;" onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Somente alguns tipos de documentos suportam a propriedade <b>N\xFAmero</b> que quando preenchida exibe o valor na \xE1rvore de processos logo ap\xF3s o tipo. Exemplo: Anexo Contrato (Anexo = tipo e Contrato = N\xFAmero)')"><i class="fas fa-info-circle colorAzul"></i></a></p>
                </td>
            </tr>
            <tr>
                <td>
                    <select id="nomesDoc">${selectData}</select>
                </td>
            </tr>
            `;
    return `
            <div id="divTableDataCrossing" class="seipro-doclote-crossing-panel">
                <div class="seipro-doclote-crossing-scroll" style="max-height: 300px;overflow-y: auto;">
                    <table id="tableDataCrossing" style="font-size: 9pt !important;width: 100%;" class="seiProForm tableInfo tableZebra tableFollow">
                        <thead>
                            <th class="tituloControle" style="width: 47%;">${csvFileName}</th>
                            <th class="tituloControle"></th>
                            <th class="tituloControle" style="width: 47%;">${modeloNome}</th>
                        </thead>
                        <tbody>
                            ${tbody}
                        </tbody>
                    </table>
                </div>
                <hr style="all:revert;border: 1px solid #dcdcdc;margin: 10px 0;">
                <table style="font-size: 9pt !important;width: 100%;">
                    <tbody>
                        ${blocoNomeDoc}
                    </tbody>
                </table>
                <hr style="all:revert;border: 1px solid #dcdcdc;margin: 10px 0;">
                <table style="font-size: 9pt !important;width: 100%;">
                    <tbody>
                        <tr>
                            <td style="width: 50px;">
                                <div style="margin: 10px 0;font-size: 9pt;display: inline-block;transform: scale(0.9);float: left;">
                                    <div class="onoffswitch" style="float: left;margin-right: 1em;margin-left: 0;">
                                        <input type="checkbox" name="onoffswitch" class="onoffswitch-checkbox seipro-doclote-new-process-toggle" id="newProcs" data-type="setdate" tabindex="0">
                                        <label class="onoff-switch-label" for="newProcs"></label>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <label for="newProcs">Criar cada documento em um novo processo</label>
                            </td>
                        </tr>
                        <tr style="display:none" class="seipro-doclote-process-type-fields">
                            <td colspan="2">
                                <p style="font-size: 1.2em;"><i class="fas fa-folder-open cinzaColor"></i> Tipo de Processo:</p>
                                <select id="tipoProcessoSelect" class="seipro-doclote-process-type-select"><option value="">Selecione um tipo de documento</option>${selectTiposProcessos}</select>
                            </td>
                        </tr>
                        <tr style="display:none" class="seipro-doclote-process-type-fields">
                            <td colspan="2">
                                <p style="font-size: 1.2em;"><i class="fas fa-comment-dots cinzaColor"></i> Especifica\xE7\xE3o do processo: (Dispon\xEDvel campos din\xE2micos da planilha)</p>
                                <input type="text" class="infraText" id="txtEspecificacaoProcesso" style="width: 480px;padding: 0.8em;" placeholder="Ex: Certificado de ##nome_aluno##">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            `;
  }
  var resultFilterBar = `<div class="btn-group seipro-doclote-result-actions" role="group" style="margin: 10px 0;">
                                            <button type="button" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light seipro-doclote-download">
                                                <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                                                <span class="text">Baixar</span>
                                            </button>
                                            <button type="button" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light seipro-doclote-copy">
                                                <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>
                                                <span class="text">Copiar</span>
                                            </button>
                                        </div>`;
  function resultTable(theadRows, tbodyRows) {
    return `
                            <div class="seipro-doclote-result-scroll" style="max-height: 350px;max-width: 850px;overflow: auto;">
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
  }

  // src/features/docs-lote/view.js
  var setProgress = (n) => {
    $("#progress span").text("\u2588".repeat(n) + "\u2592".repeat(6 - n));
  };
  function installDocsLoteDelegation() {
    if (window.__SEI_PRO_DOCLOTE_DELEGATION__) return;
    window.__SEI_PRO_DOCLOTE_DELEGATION__ = true;
    $(document).on("change", ".seipro-doclote-new-process-toggle", function() {
      changeNewProcs(this);
    });
    $(document).on("change", ".seipro-doclote-process-type-select", function() {
      checkTipoProcessoSelect();
    });
    $(document).on("click", ".seipro-doclote-download", function() {
      if (typeof downloadTablePro === "function") downloadTablePro(this);
    });
    $(document).on("click", ".seipro-doclote-copy", function() {
      if (typeof copyTablePro === "function") copyTablePro(this);
    });
  }
  function docsLote_getDocsArvore(optionBlank = false, disableId = false) {
    getDocsArvore(
      $("#docLoteSelect"),
      function(select, optionBlank2, disableId2) {
        getDocsArvore_fillSelect(select, optionBlank2, disableId2);
      },
      function() {
      },
      optionBlank,
      disableId
    );
  }
  async function docsLote_docAnalysis(protocolo, nrTxtPadrao) {
    $("#fieldList").remove();
    S.dynamicFields = [];
    if (!$("#loaderAnalysis")[0]) {
      $("#dialogBoxDocLote").append(`<div id='loaderAnalysis' class="seipro-doclote-analysis-loader" style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);
      $("#btnConfirmAnalysis").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
    }
    const selectedDoc = protocolo ? dataDocs.find((doc) => doc.id_documento.toString() === protocolo.toString()) : false;
    const selectedTxtPadrao = nrTxtPadrao ? S.listTxtPadraoDoc.find((txtPadrao) => txtPadrao.id.toString() === nrTxtPadrao.toString()) : false;
    if (selectedTxtPadrao) {
      $.get(selectedTxtPadrao.view).done((contentTxtPadrao) => {
        selectedTxtPadrao.nome = selectedTxtPadrao.name;
        selectedTxtPadrao.numero = selectedTxtPadrao.id;
        const body = $(contentTxtPadrao).find("#txaConteudo").text();
        const matches = Array.from(new Set(body.match(/##.+?##/gm)));
        docsLote_fillModelAnalysis(matches, selectedTxtPadrao, true);
      }).then(() => {
        $("#loaderAnalysis").remove();
      });
    } else {
      $.get(selectedDoc.src).done((contentDoc) => {
        const body = contentDoc.substring(contentDoc.indexOf("<body>"), contentDoc.lastIndexOf("</body>"));
        const matches = Array.from(new Set(body.match(/##.+?##/gm)));
        docsLote_fillModelAnalysis(matches, selectedDoc);
      }).then(() => {
        $("#loaderAnalysis").remove();
      });
    }
  }
  async function docsLote_fillModelAnalysis(matches, selectedDoc, txtModelo = false) {
    S.selectedModel = selectedDoc;
    S.dynamicFields = matches.map((field) => field.trim());
    $("#dialogBoxDocLote").append(`<div id='fieldList'></div>`);
    $("#fieldList").append(`<p class="seipro-doclote-analysis-text"><i class='fas fa-${txtModelo ? "keyboard" : "file-alt"} cinzaColor'></i> ${txtModelo ? "Texto Padr\xE3o" : "Documento"} : ${selectedDoc.nome}</p>`);
    if (txtModelo) {
      $("#btnConfirmAnalysis").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
      const tiposDocumentos = await getTypeSEI("documentos");
      const selectTiposDocumentos = tiposDocumentos ? $.map(tiposDocumentos, function(v) {
        return '<option value="' + v.id + '">' + v.name + "</option>";
      }).join("") : false;
      $("#fieldList").append(`
            <p class="seipro-doclote-analysis-text">
                <i class='fas fa-file-alt cinzaColor'></i> Tipo de Documento:
            </p>
            <p class="seipro-doclote-analysis-text">
                <select style="width:300px" id="tipoDocumentoSelect" class="seipro-doclote-document-type-select"><option value="">Selecione um tipo de documento</option>${selectTiposDocumentos}</select>
            </p>
            `);
      $("#tipoDocumentoSelect").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      });
      $(document).off("change", ".seipro-doclote-document-type-select").on("change", ".seipro-doclote-document-type-select", function() {
        const id_tipo_documento = $("#tipoDocumentoSelect").val();
        const tipoDocumento = tiposDocumentos.find((tipo) => tipo.id === id_tipo_documento);
        if (tipoDocumento) {
          S.selectedModel.nome = tipoDocumento.name;
          S.selectedModel.id_tipo_documento = id_tipo_documento;
          $("#btnConfirmAnalysis").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
        } else {
          $("#btnConfirmAnalysis").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
        }
      });
    }
    if (matches.length) {
      let lista = `<ul class="seipro-doclote-analysis-text" style="max-height: 250px;overflow-y: auto;">
`;
      matches.forEach((field) => {
        lista += `<li>${field.replaceAll("#", "")}</li>
`;
      });
      lista += "</ul>";
      $("#fieldList").append(`<p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-hashtag cinzaColor'></i> Campos din\xE2micos detectados:</p>`);
      $("#fieldList").append(lista);
      if (!txtModelo) $("#btnConfirmAnalysis").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
    } else {
      $("#fieldList").append(`<small class="seipro-doclote-field-error">N\xE3o foi identificado nenhum campo din\xE2mico no documento modelo informado. Verifique se os mesmos foram redigidos corretamente com o padr\xE3o ##nome do campo##.</small>`);
    }
    centralizeDialogBox(window.dialogBoxPro);
  }
  function docsLote_detectEncodingCSV() {
    $("#inputBD").on("change", function() {
      const file = $(this)[0].files[0];
      const reader = new FileReader();
      reader.onload = function(e) {
        const csvResult = e.target.result.split(/\r|\n|\r\n/);
        S.CSVEncoding = jschardet.detect(csvResult.toString()).encoding.toLowerCase();
      };
      reader.readAsBinaryString(file);
    });
  }
  function docsLote_CSVAnalysis(file) {
    $("#fieldListCSV").remove();
    if (!$("#loaderAnalysisCSV")[0]) $("#dialogBoxDocLote").append(`<div id='loaderAnalysisCSV' class="seipro-doclote-csv-analysis-loader" style='height: 40px; text-align: center; display: block;'><i class="fas fa-spinner fa-spin azulColor" style="scale:3;"></i></div>`);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: "greedy",
      encoding: S.CSVEncoding,
      complete: (results) => {
        docsLote_fillCSVAnalysis(results, file.name);
        $("#loaderAnalysisCSV").remove();
        centralizeDialogBox(window.dialogBoxPro);
      }
    });
  }
  function docsLote_fillCSVAnalysis(parseData, filename) {
    S.CSVFileName = filename;
    S.CSVData = parseData.data;
    if (typeof S.CSVData[0] !== "undefined" && S.CSVData[0] !== null) {
      S.CSVHeaders = Object.keys(S.CSVData[0]).filter(Boolean);
      $("#dialogBoxDocLote").append(`<div id='fieldListCSV'></div>`);
      $("#fieldListCSV").append(`<p class="seipro-doclote-analysis-text"><i class='fas fa-file-csv azulColor'></i> Arquivo: ${filename}</p>`);
      if (S.CSVHeaders.length) {
        let lista = `<ul class="seipro-doclote-analysis-text" style="max-height: 250px;overflow-y: auto;">
`;
        S.CSVHeaders.forEach((field) => {
          lista += `<li>${field}</li>
`;
        });
        lista += "</ul>";
        $("#fieldListCSV").append(`
                <p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-layer-group cinzaColor'></i> Quantidade de registros: ${S.CSVData.length}</p>
                <p class="seipro-doclote-analysis-text seipro-doclote-field-title"><i class='fas fa-hashtag cinzaColor'></i> Cabe\xE7alhos detectados:</p>
                ${lista}`);
        $("#btnConfirmAnalysis").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
      } else {
        docsLote_printFieldError();
      }
    } else {
      docsLote_printFieldError();
    }
  }
  function docsLote_printFieldError() {
    $("#dialogBoxDocLote").append(`<p class="seipro-doclote-field-error"><i class="fas fa-exclamation-triangle vermelhoColor"></i> N\xE3o foi identificado nenhum cabe\xE7alho no arquivo enviado. <br><br>\u{1F914} Verifique se a planilha n\xE3o est\xE1 vazia.</p>`);
    $("#btnConfirmAnalysis").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
  }
  async function docsLote_printDataCrossing() {
    S.dataCrossing = [];
    const cleanFields = S.dynamicFields.map((field) => field.replaceAll("#", ""));
    S.CSVHeaders.forEach((header) => {
      try {
        const matchedDynamicField = cleanFields.find((field) => field === header);
        if (matchedDynamicField) S.dataCrossing.push(header);
      } catch {
        return;
      }
    });
    if (!S.dataCrossing[0]) {
      $("#dialogBoxDocLote").html(`<p class="seipro-doclote-field-error"><i class="fas fa-exclamation-triangle vermelhoColor"></i> N\xE3o existe correspond\xEAncia no arquivo CSV informado!</p>`);
      $("#btnConfirm").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
    } else {
      let tbody = "";
      S.dataCrossing.forEach((data) => {
        tbody += `<tr>
                        <td style="padding-left: 10px;">${data}</td>
                        <td style="text-align:center;"><i class='fas fa-arrow-right azulColor'></i></td>
                        <td>##${data}##</td>
                    </tr>`;
      });
      let selectData = "";
      S.CSVHeaders.forEach((header) => {
        selectData += `<option>${header}</option>`;
      });
      const tiposProcessos = await getTypeSEI("processos");
      const selectTiposProcessos = tiposProcessos ? $.map(tiposProcessos, function(v) {
        return '<option value="' + v.id + '">' + v.name + "</option>";
      }).join("") : false;
      $("#dialogBoxDocLote").append(dataCrossingPanel({
        csvFileName: S.CSVFileName,
        modeloNome: S.selectedModel.nome,
        tbody,
        selectData,
        isNewSEI: SeiPro.sei.adapter.isNewSEI(),
        selectTiposProcessos
      }));
      $("#nomesDoc").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      });
      $("#tipoProcessoSelect").chosen({
        placeholder_text_single: " ",
        no_results_text: "Nenhum resultado encontrado",
        normalize_search_text: function(text) {
          return removeAcentos(text.toLowerCase());
        }
      });
      $("#tipoProcessoSelect_chosen").css("width", "500px");
    }
    setTimeout(() => {
      centralizeDialogBox(window.dialogBoxPro);
    }, 300);
    setTimeout(() => {
      $("#dialogBoxPro").removeAttr("style");
    }, 500);
  }
  function changeNewProcs(this_) {
    if ($(this_).is(":checked")) {
      $(".seipro-doclote-process-type-fields").show();
      checkTipoProcessoSelect();
    } else {
      $(".seipro-doclote-process-type-fields").hide();
      $("#btnConfirm").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
    }
  }
  function checkTipoProcessoSelect() {
    if ($("#tipoProcessoSelect").val() && $("#tipoProcessoSelect").val() != "null") {
      $("#btnConfirm").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
    } else {
      $("#btnConfirm").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
    }
  }
  async function docsLote_execute(param) {
    S.aborted = false;
    if (!param.createNewProcs && !getUrlNewDocArvore()) {
      S.flagError = true;
      alertaBoxPro("Error", "exclamation-triangle", "Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!");
      return;
    }
    if (!SeiPro.sei.adapter.isNewSEI()) {
      S.forceNames = param.forceNames;
      const hasSpecialChars = S.CSVData.some((data) => SeiPro.core.docslote.hasDocsLoteSpecialChars(data[param.docsNames], S.CSVEncoding));
      if (hasSpecialChars) {
        const confirmSpecialChars = confirm(`
                Os nomes escolhidos para constar na \xE1rvore de processos cont\xE9m caracteres especiais.

                O ideal \xE9 que n\xE3o possuam.Portanto, \xE9 poss\xEDvel que ocorram alguns problemas de formata\xE7\xE3o.

                Deseja continuar ?
                `);
        if (!confirmSpecialChars) {
          docLoteModalCruzamentoDados(param.nrDoc, param.csvFile, param.nrTxtPadrao);
          S.flagConfirmSpecialChars = true;
          return;
        }
      }
    }
    for (let i = 0; i < S.CSVData.length; i++) {
      try {
        const urlNewDoc = await docsLote_getLinkNewDoc(param, S.CSVData[i]);
        const response1 = await docsLote_clickNewDoc(urlNewDoc, setProgress);
        const response2 = await docsLote_selectDocType(response1.urlExpandDocList, setProgress);
        const response3 = await docsLote_formNewDoc(response2.urlFormNewDoc, S.CSVData[i], param, setProgress);
        const response4 = await docsLote_confirmDocData(response3.urlConfirmDocData, response3.params, setProgress);
        const response5 = await docsLote_editDocContent(response4.urlEditor, S.CSVData[i], setProgress);
        const response6 = await docsLote_saveDoc(response5.urlSubmitForm, response5.paramsSaveDoc, setProgress);
        response6.success && $("#progress").html(`<p style="text-align:center">${i + 1}/${S.CSVData.length}<span style="display:block;white-space: nowrap;color: #ccc;font-size: 8pt;padding:5px">\u2592\u2592\u2592\u2592\u2592\u2592</span></p>`);
        if (i + 1 === S.CSVData.length) throw new Error("cancel");
      } catch (e) {
        if (e.message && e.message === "cancel") {
          $("#ifrArvore").contents()[0].location.reload();
          setTimeout(() => {
            const htmlFilterDoclote = resultFilterBar;
            let theadRows = "<tr>";
            theadRows += $.map(Object.keys(S.docsCriados[0].data_doc), function(k) {
              return `<th class="tituloControle">${k}</th>`;
            }).join("");
            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">nome_documento_gerado</th>';
            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">numero_sei_gerado</th>';
            theadRows += '   <th class="tituloControle" style="white-space: nowrap;">link_documento_gerado</th>';
            theadRows += "</tr>";
            const tbodyRows = $.map(S.docsCriados, function(v) {
              let _return = "<tr>";
              _return += $.map(v.data_doc, function(d) {
                return `<td style="white-space: nowrap;">${d}</td>`;
              }).join("");
              _return += `   <td style="white-space: nowrap;">${v.nome_documento || ""} ${v.data_doc[param.docsNames] || ""}</td>`;
              _return += `   <td style="white-space: nowrap;">${v.nr_sei || ""}</td>`;
              _return += `   <td style="white-space: nowrap;"><a href="${v.url_doc || ""}" target="_blank" class="bLink" style="font-size: 9pt;">${v.url_doc || ""}</a></td>`;
              _return += "</tr>";
              return _return;
            }).join("");
            const tableResult = resultTable(theadRows, tbodyRows);
            $("#preparingProgressCircular").remove();
            $("#cancelExecute").hide();
            $("#progress").html(`<h4 style="text-align:center;margin: 30px 0 10px 0; font-size: 1.5rem;"><i class="fas fa-check-circle verdeColor" style="font-size: 1em;"></i> Progresso finalizado! \u{1F44F}</h4>${tableResult}`);
            window.dialogBoxPro.dialog("option", "width", 870);
            window.dialogBoxPro.dialog("option", "height", 500);
            $("#tableDataResult").find("thead").prepend(htmlFilterDoclote);
          }, 500);
        } else {
          S.flagError = true;
          console.log("Erro \u{1F622} -> ", e);
          docLoteModalErro();
        }
        S.aborted = false;
        break;
      }
    }
  }
  function docsLote_abortAjax() {
    if (!S.flagError && !S.flagConfirmSpecialChars) {
      S.aborted = true;
      $("#cancelExecute").hide();
      $("#progress").html(`<p style="text-align:center">Cancelando progresso</p>`);
    } else {
      S.flagError = false;
      S.flagConfirmSpecialChars = false;
      S.aborted = false;
    }
  }
  function docLoteModalSelecaoDoc() {
    const urlNewDoc = getUrlNewDocArvore();
    if (!urlNewDoc) {
      S.flagError = true;
      alertaBoxPro("Error", "exclamation-triangle", "Erro ao localizar o link de inserir documento. Verifique se o processo encontra-se aberto em sua unidade!");
      return;
    }
    const credito = restrictConfigValue("documentosemlote") ? creditoTcgontijo : "";
    const htmlBox = selecaoDocBox(credito);
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Documento modelo - Sele\xE7\xE3o (1/6)",
      width: 600,
      open: () => {
        if (typeof URL_SPRO !== "undefined" && typeof jschardet === "undefined") $.getScript(`${URL_SPRO}js/lib/jschardet.min.js`);
        if (typeof URL_SPRO !== "undefined" && typeof Papa === "undefined") $.getScript(`${URL_SPRO}js/lib/papaparse.js`);
        $("#btnSelecaoDoc").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
        $("#docLoteSelect").on("change", () => {
          $("#textoPadraoSelect").val("").trigger("chosen:updated");
          $("#btnSelecaoDoc").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
        }).chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
        $("#textoPadraoSelect").chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
        docsLote_getDocsArvore(true);
        S.docsCriados = [];
        $("#textoPadraoSelect").on("change", () => {
          $("#docLoteSelect").val("").trigger("chosen:updated");
          $("#btnSelecaoDoc").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
        }).html('<option value="">&nbsp;</option>');
        txtPadrao_getList().then((listTxtPadrao) => {
          S.listTxtPadraoDoc = listTxtPadrao;
          $("#textoPadraoSelect").append(listTxtPadrao.map((item) => `<option value="${item.id}">${item.name}</option>`).join(""));
          $("#textoPadraoSelect").trigger("chosen:updated");
        });
      },
      buttons: [{
        text: "Ajuda",
        icon: "ui-icon-help",
        click: function() {
          window.open(helpPageUrl());
        }
      }, {
        id: "btnSelecaoDoc",
        text: "Avan\xE7ar",
        icon: "ui-icon-arrowthick-1-e",
        class: "confirm ui-state-active",
        click: function() {
          if ($(this).find("small")[0]) {
            resetDialogBoxPro("dialogBoxPro");
          } else {
            const nrDoc = $("#docLoteSelect").find("option:selected").data("id_documento");
            const nrTxtPadrao = $("#textoPadraoSelect").val();
            docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao);
          }
        }
      }]
    });
  }
  function docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = selecaoBaseDadosBox();
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Base de dados - Upload (3/6)",
      width: 600,
      open: () => {
        docsLote_detectEncodingCSV();
        $("#btnEnviaCSV").prop("disabled", true).addClass("ui-button-disabled ui-state-disabled");
        $("#inputBD").change(() => {
          $("#btnEnviaCSV").prop("disabled", false).removeClass("ui-button-disabled ui-state-disabled");
        });
      },
      buttons: [{
        text: "Ajuda",
        icon: "ui-icon-help",
        click: function() {
          window.open(helpPageUrl());
        }
      }, {
        text: "Voltar",
        icon: "ui-icon-arrowthick-1-w",
        click: function() {
          docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao);
        }
      }, {
        id: "btnEnviaCSV",
        text: "Avan\xE7ar",
        disabled: true,
        icon: "ui-icon-arrowthick-1-e",
        class: "confirm ui-state-active",
        click: () => {
          $("#baseDados small").remove();
          const file = $("#inputBD")[0].files[0];
          if (file.name.substring(file.name.lastIndexOf("."), file.name.length).toLocaleLowerCase().trim() === ".csv") {
            docLoteModalAnaliseCSV(nrDoc, $("#inputBD")[0].files[0], nrTxtPadrao);
          } else {
            $("#inputBD").after(`<small class="seipro-doclote-field-error">Arquivo inv\xE1lido! Selecione um documento no formato "CSV".</small>`);
          }
        }
      }]
    });
  }
  function docLoteModalLoader(paramData) {
    const htmlBox = loaderBox();
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Documentos em lote - Criando (6/6)",
      width: 300,
      open: () => {
        docsLote_execute(paramData);
      },
      close: () => {
        docsLote_abortAjax();
      },
      buttons: [{
        text: "Cancelar",
        id: "cancelExecute",
        icon: "ui-icon-cancel",
        click: function() {
          docsLote_abortAjax();
        }
      }]
    });
  }
  function docLoteModalErro(textError = false) {
    const htmlBox = erroBox(textError);
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "\u{1F926}\u200D\u2642\uFE0F Ops...",
      width: 600,
      buttons: [{
        text: "OK",
        class: "ui-state-active",
        click: function() {
          resetDialogBoxPro("dialogBoxPro");
        }
      }]
    });
  }
  function docLoteModalCruzamentoDados(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = cruzamentoDadosBox();
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Cruzamento de dado (5/6)",
      width: 600,
      maxHeight: window.innerHeight * 0.9,
      open: () => docsLote_printDataCrossing(),
      buttons: [{
        text: "Ajuda",
        icon: "ui-icon-help",
        click: function() {
          window.open(helpPageUrl());
        }
      }, {
        text: "Voltar",
        icon: "ui-icon-arrowthick-1-w",
        click: function() {
          docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao);
        }
      }, {
        id: "btnConfirm",
        text: "Iniciar",
        icon: "ui-icon-play",
        class: "confirm ui-state-active",
        click: function() {
          const paramData = {
            docsNames: $("#nomesDoc").val(),
            forceNames: $("#checkForceNames").is(":checked"),
            createNewProcs: $("#newProcs").is(":checked"),
            idTipoProcedimento: $("#tipoProcessoSelect").val(),
            txtEspecificacaoProcesso: $("#txtEspecificacaoProcesso").val(),
            nrDoc,
            csvFile,
            nrTxtPadrao
          };
          docLoteModalLoader(paramData);
        }
      }]
    });
  }
  function docLoteModalAnaliseDocModelo(nrDoc, nrTxtPadrao) {
    const htmlBox = analiseDocModeloBox();
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Documento modelo - Campos din\xE2micos (2/6)",
      width: 600,
      maxHeight: window.innerHeight * 0.9,
      open: () => {
        docsLote_docAnalysis(nrDoc, nrTxtPadrao);
        setTimeout(() => {
          $("#dialogBoxPro").removeAttr("style");
        }, 500);
      },
      buttons: [{
        text: "Ajuda",
        icon: "ui-icon-help",
        click: function() {
          window.open(helpPageUrl());
        }
      }, {
        text: "Voltar",
        icon: "ui-icon-arrowthick-1-w",
        click: function() {
          docLoteModalSelecaoDoc();
        }
      }, {
        id: "btnConfirmAnalysis",
        text: "Avan\xE7ar",
        icon: "ui-icon-arrowthick-1-e",
        class: "confirm ui-state-active",
        click: function() {
          docLoteModalSelecaoBaseDados(nrDoc, null, nrTxtPadrao);
        }
      }]
    });
  }
  function docLoteModalAnaliseCSV(nrDoc, csvFile, nrTxtPadrao) {
    const htmlBox = analiseCsvBox();
    resetDialogBoxPro("dialogBoxPro");
    window.dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Base de dados - Cabe\xE7alhos e registros (4/6)",
      width: 600,
      open: () => {
        docsLote_CSVAnalysis(csvFile);
      },
      buttons: [{
        text: "Ajuda",
        icon: "ui-icon-help",
        click: function() {
          window.open(helpPageUrl());
        }
      }, {
        text: "Voltar",
        icon: "ui-icon-arrowthick-1-w",
        click: function() {
          docLoteModalSelecaoBaseDados(nrDoc, csvFile, nrTxtPadrao);
        }
      }, {
        id: "btnConfirmAnalysisCSV",
        text: "Avan\xE7ar",
        icon: "ui-icon-arrowthick-1-e",
        class: "confirm ui-state-active",
        click: function() {
          docLoteModalCruzamentoDados(nrDoc, csvFile, nrTxtPadrao);
        }
      }]
    });
  }

  // src/features/docs-lote/legacy-api.js
  aliasGlobal("docLoteModalSelecaoDoc", docLoteModalSelecaoDoc);
  aliasGlobal("docsLote_getDocsArvore", docsLote_getDocsArvore);

  // src/features/docs-lote/index.js
  var docsLote = getSeiPro().features.docsLote || (getSeiPro().features.docsLote = {});
  docsLote.openWizard = docLoteModalSelecaoDoc;
  docsLote.getDocsArvore = docsLote_getDocsArvore;
  installDocsLoteDelegation();
})();
