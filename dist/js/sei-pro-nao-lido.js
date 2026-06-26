(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/nao-lido/io.js
  var io_exports = {};
  __export(io_exports, {
    getSeiHtml: () => getSeiHtml,
    postSeiForm: () => postSeiForm,
    serializeSeiForm: () => serializeSeiForm
  });
  function serializeSeiForm(form, overrides) {
    var param = {};
    form.find("input[type=hidden]").each(function() {
      var name = $(this).attr("name"), id = $(this).attr("id");
      if (name && id && id.indexOf("hdn") !== -1) param[name] = $(this).val();
    });
    form.find("input[type=text]").each(function() {
      var id = $(this).attr("id");
      if (id && id.indexOf("txt") !== -1) param[id] = $(this).val();
    });
    form.find("select").each(function() {
      var id = $(this).attr("id");
      if (id && id.indexOf("sel") !== -1) param[id] = $(this).val();
    });
    form.find("input[type=radio]").each(function() {
      var name = $(this).attr("name");
      if (name && name.indexOf("rdo") !== -1) param[name] = $(this).val();
    });
    $.extend(param, overrides || {});
    var parts = [];
    for (var k in param) {
      if (!param.hasOwnProperty(k)) continue;
      var valor;
      if (k === "hdnAssuntos" || k === "hdnInteressados") {
        valor = param[k];
      } else if (k === "txtDescricao") {
        valor = parent.encodeURI_toHex(String(param[k]).normalize("NFC"));
      } else {
        valor = escapeComponent(param[k]);
      }
      parts.push(k + "=" + valor);
    }
    return parts.join("&");
  }
  function getSeiHtml(url) {
    return Promise.resolve($.ajax({ url }));
  }
  function postSeiForm(url, data) {
    return new Promise(function(resolve, reject) {
      var xhr = new XMLHttpRequest();
      $.ajax({
        method: "POST",
        data,
        url,
        contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
        xhr: function() {
          return xhr;
        }
      }).done(function(html) {
        resolve({ html, xhr });
      }).fail(function() {
        reject();
      });
    });
  }

  // src/features/nao-lido/view.js
  var view_exports = {};
  __export(view_exports, {
    failProcessoNaoLido: () => failProcessoNaoLido,
    getSelectedProcessoNaoLido: () => getSelectedProcessoNaoLido,
    initNaoVisualizadoPro: () => initNaoVisualizadoPro,
    marcarProcessoNaoLido: () => marcarProcessoNaoLido,
    marcarUmProcessoNaoLido: () => marcarUmProcessoNaoLido,
    setProcessoNaoLidoLoading: () => setProcessoNaoLidoLoading
  });
  function setProcessoNaoLidoLoading(display = true) {
    if ($("body").hasClass("seiSlim")) {
      $(divComandos + " .iconNaoLido").toggleClass("iconLoading", display);
    } else {
      setIconLoadinBtnSEI($(".iconNaoLido"), display);
    }
  }
  function getSelectedProcessoNaoLido() {
    var listId = getListIdProtocoloSelected();
    if (listId && listId.length > 0) {
      return listId[0];
    }
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var markedRow = tableProc.find("tr.infraTrMarcada").first();
    if (markedRow.length > 0) {
      var checkboxValue = markedRow.find(elemCheckbox).val();
      if (typeof checkboxValue !== "undefined" && checkboxValue !== null && checkboxValue !== "") {
        return checkboxValue;
      }
      var linkProcesso = markedRow.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
      if (linkProcesso.length > 0) {
        var paramsProcesso = getParamsUrlPro(linkProcesso.attr("href"));
        if (paramsProcesso && typeof paramsProcesso.id_procedimento !== "undefined") {
          return paramsProcesso.id_procedimento;
        }
      }
      if (markedRow.attr("id")) {
        return markedRow.attr("id").replace(/^P/, "");
      }
    }
    return false;
  }
  function failProcessoNaoLido(message) {
    setProcessoNaoLidoLoading(false);
    alertaBoxPro("Error", "exclamation-triangle", message);
  }
  async function marcarUmProcessoNaoLido(id_procedimento) {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var tr = tableProc.find("tr#P" + id_procedimento);
    var href = url_host.replace("controlador.php", "") + "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + String(id_procedimento);
    var htmlTrabalhar = await getSeiHtml(href);
    var urlArvore = $(htmlTrabalhar).find("#ifrArvore").attr("src");
    if (!urlArvore) throw "N\xE3o foi poss\xEDvel localizar a \xE1rvore do processo selecionado.";
    var arrayLinksArvore = getLinksArvoreAjax(await getSeiHtml(urlArvore));
    var ctxArvore = { treeModel: { links: arrayLinksArvore } };
    var urlAndamento = getTreeLinkUrlByName("Atualizar Andamento", ctxArvore);
    var urlEnviar = getTreeLinkUrlByName("Enviar Processo", ctxArvore);
    if (!urlAndamento || !urlEnviar) throw "N\xE3o foi poss\xEDvel localizar as a\xE7\xF5es necess\xE1rias no processo selecionado.";
    var formAndamento = $(await getSeiHtml(urlAndamento)).find("#frmAtividadeListar");
    if (formAndamento.length === 0) throw "N\xE3o foi poss\xEDvel carregar o formul\xE1rio de andamento do processo.";
    var resAndamento = await postSeiForm(formAndamento.attr("action"), serializeSeiForm(formAndamento, {
      txaDescricao: "Processo marcado como n\xE3o visualizado",
      sbmSalvar: "Salvar"
    }));
    if (!isAjaxRedirectAction(resAndamento.xhr, "procedimento_consultar_historico", "procedimento_atualizar_andamento")) {
      throw "Falha ao salvar o andamento do processo.";
    }
    var formEnviar = $(await getSeiHtml(urlEnviar)).find("#frmAtividadeListar");
    if (formEnviar.length === 0) throw "N\xE3o foi poss\xEDvel carregar o formul\xE1rio de envio do processo.";
    var resEnviar = await postSeiForm(formEnviar.attr("action"), serializeSeiForm(formEnviar, {
      selUnidades: idUnidade,
      hdnUnidades: idUnidade + "\xB1" + siglaUnidadeAtual,
      sbmEnviar: "Enviar"
    }));
    if (!isAjaxRedirectAction(resEnviar.xhr, "arvore_visualizar", "procedimento_enviar")) {
      throw "N\xE3o foi poss\xEDvel confirmar a marca\xE7\xE3o como n\xE3o visualizado.";
    }
    tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').attr("class", "processoNaoVisualizado");
    tr.find(elemCheckbox + ":checked").trigger("click");
  }
  async function marcarProcessoNaoLido() {
    var listId = getListIdProtocoloSelected();
    if (!listId || listId.length === 0) {
      var single = getSelectedProcessoNaoLido();
      listId = single ? [single] : [];
    }
    if (listId.length === 0) {
      failProcessoNaoLido("Selecione um processo para marcar como n\xE3o visualizado.");
      return;
    }
    setProcessoNaoLidoLoading(true);
    var erros = [];
    for (var i = 0; i < listId.length; i++) {
      try {
        await marcarUmProcessoNaoLido(listId[i]);
      } catch (e) {
        erros.push(typeof e === "string" ? e : "Falha ao marcar o processo.");
      }
    }
    initNaoVisualizadoPro();
    initFaviconNrProcesso();
    setProcessoNaoLidoLoading(false);
    if (erros.length > 0) {
      failProcessoNaoLido(erros.length === listId.length ? erros[0] : erros.length + " de " + listId.length + " processo(s) n\xE3o puderam ser marcados: " + erros[0]);
    }
  }
  function initNaoVisualizadoPro() {
    $(".processoNaoVisualizado").each(function() {
      var el = $(this);
      if (el.attr("data-nvis") === "1") return;
      var tooltip = el.attr("onmouseover");
      if (typeof tooltip !== "undefined" && tooltip.indexOf("(N\xE3o Visualizado) ") === -1) {
        el.attr("onmouseover", tooltip.replace("return infraTooltipMostrar('", "return infraTooltipMostrar('(N\xE3o Visualizado) "));
      }
      el.attr("data-nvis", "1");
    });
  }

  // src/features/nao-lido/index.js
  [io_exports, view_exports].forEach(function(mod) {
    Object.keys(mod).forEach(function(name) {
      if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
    });
  });
})();
