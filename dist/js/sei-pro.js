(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/dom/index.js
  function ready(fn) {
    if (typeof document === "undefined") {
      fn();
      return;
    }
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      setTimeout(fn, 0);
    }
  }

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

  // src/app/publish-feature.js
  function toNamespaceKey(id) {
    if (typeof id !== "string" || !id) return id;
    return id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  }
  function publishFeature(spec = {}) {
    const id = spec.id;
    if (typeof id !== "string" || !id) {
      throw new Error("publishFeature: id is required");
    }
    const api = spec.api && typeof spec.api === "object" ? spec.api : {};
    const install = typeof spec.install === "function" ? spec.install : function noop() {
    };
    const extras = spec.extras && typeof spec.extras === "object" ? spec.extras : {};
    const published = Object.freeze({
      id,
      api,
      install,
      ...extras
    });
    const root = getSeiPro();
    root.features = root.features || {};
    const key = spec.nsKey || toNamespaceKey(id);
    root.features[key] = published;
    return published;
  }

  // src/features/lista-processos/state.js
  function installListaProcessosState() {
    const g = globalThis;
    if (g.__SEI_PRO_LISTA_PROCESSOS_STATE_INSTALLED__) return g;
    g.actionTest = g.actionTest || 'ondblclick="removeCacheGroupTable(this)"';
    g.totalSecondsTest = g.totalSecondsTest || 0;
    g.totalSecondsTestText = g.totalSecondsTestText || "";
    g.timerTest = g.timerTest || void 0;
    g.tableHomePro = g.tableHomePro || [];
    g.kanbanProcessos = g.kanbanProcessos || false;
    g.kanbanProcessosMoving = g.kanbanProcessosMoving || false;
    g.containerUpload = g.containerUpload || "body";
    g.arvoreDropzone = g.arvoreDropzone || false;
    g.contentW = g.contentW || false;
    try {
      const adapter = g.SeiPro && g.SeiPro.sei && g.SeiPro.sei.adapter;
      const isNew = typeof g.isNewSEI !== "undefined" && adapter && adapter.isNewSEI();
      g.pathArvore = isNew ? "/infra_js/arvore/24/" : "/infra_js/arvore/";
      g.elemCheckbox = isNew ? ".infraCheckboxInput" : ".infraCheckbox";
    } catch (e) {
      g.pathArvore = g.pathArvore || "/infra_js/arvore/";
      g.elemCheckbox = g.elemCheckbox || ".infraCheckbox";
    }
    g.__SEI_PRO_LISTA_PROCESSOS_STATE_INSTALLED__ = true;
    return g;
  }

  // src/features/lista-processos/domain.js
  var domain_exports = {};
  __export(domain_exports, {
    getListIdProtocoloSelectedFromValues: () => getListIdProtocoloSelectedFromValues,
    normalizeAssignmentLabelText: () => normalizeAssignmentLabelText,
    normalizeHomeFilterKey: () => normalizeHomeFilterKey,
    normalizeHomeFilterText: () => normalizeHomeFilterText,
    quoteInlineJsText: () => quoteInlineJsText,
    rewriteHomeFilterCaption: () => rewriteHomeFilterCaption,
    rowMatchesHomeFilterFacts: () => rowMatchesHomeFilterFacts
  });
  function normalizeHomeFilterText(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9 ]/gi, " ").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function normalizeHomeFilterKey(value) {
    return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  }
  function rewriteHomeFilterCaption(baseCaption, visibleRows) {
    const singular = visibleRows === 1 ? "registro" : "registros";
    let updated = String(baseCaption || "").replace(
      /\(\s*\d+\s+registros?\s*\)/i,
      "(" + visibleRows + " " + singular + ")"
    );
    if (updated === baseCaption) {
      updated = String(baseCaption || "").replace(/\d+/, String(visibleRows));
    }
    return updated;
  }
  function normalizeAssignmentLabelText(linkText) {
    return normalizeHomeFilterText(linkText).replace(/\s+/g, " ").trim();
  }
  function quoteInlineJsText(text) {
    return "'" + String(text || "").replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, "\\n") + "'";
  }
  function rowMatchesHomeFilterFacts(facts, value, dataType) {
    const normalizedValue = normalizeHomeFilterText(value);
    const row = facts || {};
    if (dataType === "user") {
      return normalizeHomeFilterText(row.assignmentText) === normalizedValue;
    }
    if (dataType === "tag") {
      const tagName = row.tagName || "SemGrupo";
      if (value === "null") {
        return tagName === "SemGrupo" || row.hasNoMarker === true;
      }
      return normalizeHomeFilterKey(tagName) === normalizeHomeFilterKey(value);
    }
    if (dataType === "proc") {
      if (normalizedValue === "nao visualizado") {
        return row.hasUnread === true;
      }
      const haystack = normalizeHomeFilterText(
        [row.processText, row.tooltipText, row.rowText].filter(Boolean).join(" ")
      );
      return haystack.indexOf(normalizedValue) !== -1;
    }
    return false;
  }
  function getListIdProtocoloSelectedFromValues(values) {
    if (!Array.isArray(values)) return [];
    return values.map((v) => String(v || "").trim()).filter(Boolean);
  }

  // src/features/lista-processos/io.js
  var io_exports = {};
  __export(io_exports, {
    listaAgrupamentoIO: () => listaAgrupamentoIO,
    readGroupOrder: () => readGroupOrder,
    readGroupOrderLegacy: () => readGroupOrderLegacy
  });
  function listaAgrupamentoIO(globalRef2 = globalThis) {
    return globalRef2.SeiPro && globalRef2.SeiPro.features && globalRef2.SeiPro.features.listaAgrupamentoIO;
  }
  function readGroupOrder(getOption, fallback = "asc") {
    const io = listaAgrupamentoIO();
    if (io && typeof io.readGroupOrder === "function") {
      return io.readGroupOrder(getOption, fallback);
    }
    const value = typeof getOption === "function" ? getOption("orderbyTableGroup") : null;
    return value || fallback;
  }
  function readGroupOrderLegacy() {
    return readGroupOrder(typeof getOptionsPro === "function" ? getOptionsPro : null, "asc");
  }

  // src/features/lista-processos/modules.js
  var modules_exports = {};
  __export(modules_exports, {
    addAcompanhamentoEspIcon: () => addAcompanhamentoEspIcon,
    addKanbanProc: () => addKanbanProc,
    appendGerados: () => appendGerados,
    applyAssignmentFilterHomeFallback: () => applyAssignmentFilterHomeFallback,
    applyHomeFilterFallback: () => applyHomeFilterFallback,
    arrayProcessosUnidadePro: () => arrayProcessosUnidadePro,
    atividadesApi: () => atividadesApi,
    bindProcessoPaginacaoSuperiorVisibility: () => bindProcessoPaginacaoSuperiorVisibility,
    callAtividades: () => callAtividades,
    cancelMoveKanbanItensProc: () => cancelMoveKanbanItensProc,
    changeTypeProc: () => changeTypeProc,
    checkLoadConfigSheets: () => checkLoadConfigSheets,
    checkLoadedTableSorter: () => checkLoadedTableSorter,
    checkProcessoPaginacao: () => checkProcessoPaginacao,
    cleanConfigDataRecebimento: () => cleanConfigDataRecebimento,
    cleanUploadFilesInProcess: () => cleanUploadFilesInProcess,
    clearGroupCollapsedLegacy: () => clearGroupCollapsedLegacy,
    collapseKanbanBoardProc: () => collapseKanbanBoardProc,
    completeIdProtocoloSelected: () => completeIdProtocoloSelected,
    configDatesSwitchChangeHome: () => configDatesSwitchChangeHome,
    copyTableResultProtocoloSEI: () => copyTableResultProtocoloSEI,
    dialogChangeTypeProc: () => dialogChangeTypeProc,
    downloadTableResultProtocoloSEI: () => downloadTableResultProtocoloSEI,
    filterTableProcessos: () => filterTableProcessos,
    forceOnLoadBody: () => forceOnLoadBody,
    forceTableHomeDestroy: () => forceTableHomeDestroy,
    getAllMarcadoresHome: () => getAllMarcadoresHome,
    getArrayProcessoRecebido: () => getArrayProcessoRecebido,
    getAssignmentFilterOptionsHome: () => getAssignmentFilterOptionsHome,
    getChangeTypeProc: () => getChangeTypeProc,
    getFilterAssignmentTableHome: () => getFilterAssignmentTableHome,
    getFilterTableHome: () => getFilterTableHome,
    getGroupTableLabelFromLink: () => getGroupTableLabelFromLink,
    getHomeRowTagValue: () => getHomeRowTagValue,
    getListIdProtocoloSelected: () => getListIdProtocoloSelected,
    getListTypes: () => getListTypes,
    getListaMarcadores: () => getListaMarcadores,
    getMapaControleProcesso: () => getMapaControleProcesso,
    getNewTabProcesso: () => getNewTabProcesso,
    getPanelProc: () => getPanelProc,
    getProcessoAtribuicaoValue: () => getProcessoAtribuicaoValue,
    getProcessoLinkFromGroupRow: () => getProcessoLinkFromGroupRow,
    getProcessosPaginacao: () => getProcessosPaginacao,
    getSelectAllTr: () => getSelectAllTr,
    getTableDistribAutomatica: () => getTableDistribAutomatica,
    getTableOnTag: () => getTableOnTag,
    getTableProcessosCSV: () => getTableProcessosCSV,
    getTableTag: () => getTableTag,
    getUniqueTableTag: () => getUniqueTableTag,
    getUploadFilesInProcess: () => getUploadFilesInProcess,
    handleClientLoadPro: () => handleClientLoadPro,
    hideProcessoPaginacaoSuperior: () => hideProcessoPaginacaoSuperior,
    initAddKanbanProc: () => initAddKanbanProc,
    initAllMarcadoresHome: () => initAllMarcadoresHome,
    initChosenFilterHome: () => initChosenFilterHome,
    initDadosProcesso: () => initDadosProcesso,
    initFaviconNrProcesso: () => initFaviconNrProcesso,
    initFilterTableProcessos: () => initFilterTableProcessos,
    initFullnameAtribuicao: () => initFullnameAtribuicao,
    initNewTabProcesso: () => initNewTabProcesso,
    initObserveUrlChange: () => initObserveUrlChange,
    initProcessoPaginacao: () => initProcessoPaginacao,
    initReloadModalLink: () => initReloadModalLink,
    initReplaceNewIcons: () => initReplaceNewIcons,
    initSeiPro: () => initSeiPro,
    initSortDivPanel: () => initSortDivPanel,
    initTableSorterHome: () => initTableSorterHome,
    initTableTag: () => initTableTag,
    initUpdateGroupTable: () => initUpdateGroupTable,
    initUploadFilesInProcess: () => initUploadFilesInProcess,
    initUrgentePro: () => initUrgentePro,
    initViewEspecifacaoProcesso: () => initViewEspecifacaoProcesso,
    insertDivPanel: () => insertDivPanel,
    insertDivPanelControleProc: () => insertDivPanelControleProc,
    insertGroupTable: () => insertGroupTable,
    installPanelProcDelegation: () => installPanelProcDelegation,
    isGroupCollapsedLegacy: () => isGroupCollapsedLegacy,
    loadIframeProcessUpload: () => loadIframeProcessUpload,
    loadKanbanStylePro: () => loadKanbanStylePro,
    nextUploadFilesInProcess: () => nextUploadFilesInProcess,
    normalizeProcessoAtribuicaoText: () => normalizeProcessoAtribuicaoText,
    objProcessosUnidadePro: () => objProcessosUnidadePro,
    observeAreaTela: () => observeAreaTela,
    onClickRemoveDragHoverHome: () => onClickRemoveDragHoverHome,
    openListNewTab: () => openListNewTab,
    orderDivPanel: () => orderDivPanel,
    orderbyTableGroup: () => orderbyTableGroup,
    persistGroupCollapsedLegacy: () => persistGroupCollapsedLegacy,
    pinKanbanItensProc: () => pinKanbanItensProc,
    removeAllTags: () => removeAllTags,
    removeCacheGroupTable: () => removeCacheGroupTable,
    removeDataPanelProc: () => removeDataPanelProc,
    removeDuplicateValue: () => removeDuplicateValue,
    removeUploadFilesInProcess: () => removeUploadFilesInProcess,
    replaceSelectAll: () => replaceSelectAll,
    restoreAssignmentFilterHome: () => restoreAssignmentFilterHome,
    rowMatchesHomeFilter: () => rowMatchesHomeFilter,
    selectAssignmentFilterHome: () => selectAssignmentFilterHome,
    selectFilterTableHome: () => selectFilterTableHome,
    selectPanelKanbanHome: () => selectPanelKanbanHome,
    sendUploadArvoreHomeStart: () => sendUploadArvoreHomeStart,
    setAtribuicaoAutomatica: () => setAtribuicaoAutomatica,
    setObserveUrlChange: () => setObserveUrlChange,
    setSelectAllTr: () => setSelectAllTr,
    setTableSorterHome: () => setTableSorterHome,
    setTimeTest: () => setTimeTest,
    setUploadFilesInProcess: () => setUploadFilesInProcess,
    sortUploadArvore: () => sortUploadArvore,
    storeGroupTablePro: () => storeGroupTablePro,
    storeLinkUsuarioSistema: () => storeLinkUsuarioSistema,
    storeVersionSEI: () => storeVersionSEI,
    syncHomeProcessCaption: () => syncHomeProcessCaption,
    tableHomeDestroy: () => tableHomeDestroy,
    txtPadrao_createConfig: () => txtPadrao_createConfig,
    txtPadrao_getConfig: () => txtPadrao_getConfig,
    txtPadrao_getList: () => txtPadrao_getList,
    txtPadrao_newLink: () => txtPadrao_newLink,
    txtPadrao_setConfig: () => txtPadrao_setConfig,
    updateCountIconDist: () => updateCountIconDist,
    updateCountKanbanBoardProc: () => updateCountKanbanBoardProc,
    updateGroupTable: () => updateGroupTable,
    updateGroupTablePro: () => updateGroupTablePro,
    updateHomeFilterCaption: () => updateHomeFilterCaption,
    updateOrderKanbanBoardProc: () => updateOrderKanbanBoardProc,
    updateTipSelectAll: () => updateTipSelectAll,
    updateVisibleHeadersForAssignmentFilter: () => updateVisibleHeadersForAssignmentFilter,
    updateVisibleHeadersForHomeFilter: () => updateVisibleHeadersForHomeFilter,
    urgenteProMoveOnTop: () => urgenteProMoveOnTop
  });

  // src/features/lista-processos/runtime-maps.js
  var objProcessosUnidadePro = false;
  var arrayProcessosUnidadePro = false;
  try {
    if (typeof getProcessoUnidadePro !== "undefined") {
      objProcessosUnidadePro = getProcessoUnidadePro(false, true);
      arrayProcessosUnidadePro = getProcessoUnidadePro();
    }
  } catch (e) {
    objProcessosUnidadePro = false;
    arrayProcessosUnidadePro = false;
  }
  function setTimeTest() {
    ++totalSecondsTest;
    var hours = Math.floor(totalSecondsTest % (60 * 60 * 24) / 3600);
    var minutes = Math.floor(totalSecondsTest % (60 * 60) / 60);
    var seconds = Math.floor(totalSecondsTest % 60);
    totalSecondsTestText = pad(hours, 2) + ":" + pad(minutes, 2) + ":" + pad(seconds, 2);
  }
  function handleClientLoadPro(TimeOut2 = 3e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if ((typeof spreadsheetIdFormularios_Pro !== "undefined" || typeof spreadsheetIdSyncProcessos_Pro !== "undefined") && typeof gapi !== "undefined" && typeof initClientPro !== "undefined") {
      gapi.load("client:auth2", initClientPro);
    } else if (typeof spreadsheetIdFormularios_Pro !== "undefined" && spreadsheetIdFormularios_Pro === false || typeof spreadsheetIdSyncProcessos_Pro !== "undefined" && spreadsheetIdSyncProcessos_Pro === false) {
      console.log("notConfig handleClientLoadPro");
      return;
    } else {
      setTimeout(function() {
        handleClientLoadPro(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload handleClientLoadPro");
      }, 500);
    }
  }

  // src/features/lista-processos/templates.js
  function homeFilterSelectHtml() {
    return '<select id="filterTableHome" class="selectPro seipro-lista-filter" style="width:250px;margin-right:20px !important;" onchange="getFilterTableHome(this)" data-placeholder="Filtrar processos...">';
  }
  function assignmentFilterSelectHtml() {
    return '<select id="filterAssignmentTableHome" class="selectPro seipro-lista-filter-assignment" style="width:250px;margin-right:20px !important;" onchange="getFilterAssignmentTableHome(this)" data-placeholder="Filtrar atribui\xE7\xE3o...">';
  }
  function csvExportLinkHtml() {
    return `<a class="newLink seipro-lista-csv" onclick="getTableProcessosCSV()" id="processoToCSV" onmouseover="return infraTooltipMostrar('Exportar informa\xE7\xF5es de processos em planilha CSV');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-file-download cinzaColor"></i></a>`;
  }

  // src/features/lista-processos/grouping-select.js
  function isGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    return io && typeof io.isGroupCollapsed === "function" ? io.isGroupCollapsed(getOptionsPro, tagName) : getOptionsPro("panelGroup_" + tagName);
  }
  function persistGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.persistGroupCollapsed === "function") return io.persistGroupCollapsed(setOptionsPro, tagName);
    setOptionsPro("panelGroup_" + tagName, true);
  }
  function clearGroupCollapsedLegacy(tagName) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.clearGroupCollapsed === "function") return io.clearGroupCollapsed(removeOptionsPro, tagName);
    removeOptionsPro("panelGroup_" + tagName);
  }
  function getGroupTableLabelFromLink(linkElem, acaoType) {
    var $link = $(linkElem);
    var href = $link.attr("href");
    if (typeof href === "undefined" || href === "") {
      return false;
    }
    var title = "";
    if (acaoType == "users") {
      title = $link.text().trim();
      if (!title && typeof getAtribuicaoDisplayLabel === "function") {
        title = getAtribuicaoDisplayLabel($link.attr("title"), "", checkConfigValue("nomesusuarios"));
      }
    } else if (acaoType == "checkpoints") {
      var checkpointTooltip = extractGroupTableTooltipToArray($link.attr("onmouseover"));
      title = checkpointTooltip && typeof checkpointTooltip[0] !== "undefined" ? checkpointTooltip[0] : "";
    } else if (acaoType == "tags" || acaoType == "types") {
      var typeTooltip = extractGroupTableTooltipToArray($link.attr("onmouseover"));
      title = typeTooltip && typeof typeTooltip[1] !== "undefined" ? typeTooltip[1] : "";
    } else if (acaoType == "senddepart") {
      var dadosRecebido = getArrayProcessoRecebido(href);
      title = dadosRecebido && typeof dadosRecebido.unidadesendfull !== "undefined" ? dadosRecebido.unidadesendfull : "";
    } else if (acaoType == "acompanhamentoesp") {
      var dadosAcomp = getArrayProcessoRecebido(href);
      title = dadosAcomp && typeof dadosAcomp.acompanhamentoesp !== "undefined" ? dadosAcomp.acompanhamentoesp : "";
    } else if (acaoType == "deadline") {
      title = $link.closest("tr").find("td.seipro-prazo-box-display .dateboxDisplay").data("time-sorter");
      title = typeof title !== "undefined" && title !== null ? String(title).trim() : "";
      if (title !== "" && typeof moment === "function") {
        title = moment(title, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm");
      }
    }
    return typeof title !== "undefined" && title !== null ? String(title).trim() : "";
  }
  function getProcessoLinkFromGroupRow(row) {
    return $(row).find('a[href*="acao=procedimento_trabalhar"], a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
  }
  function getListTypes(acaoType) {
    var orderbyTableGroup2 = readGroupOrderLegacy();
    var arrayTag = [""];
    if (acaoType == "tags") {
      var acaoType_ = "acao=andamento_marcador_gerenciar";
    } else if (acaoType == "types") {
      var acaoType_ = "acao=procedimento_trabalhar";
    } else if (acaoType == "users") {
      var acaoType_ = "acao=procedimento_atribuicao_listar";
    } else if (acaoType == "checkpoints") {
      var acaoType_ = "acao=andamento_situacao_gerenciar";
    } else if (acaoType == "arrivaldate" || acaoType == "acessdate" || acaoType == "senddate" || acaoType == "senddepart" || acaoType == "createdate" || acaoType == "acompanhamentoesp" || acaoType == "deadline") {
      var acaoType_ = "acao=procedimento_trabalhar";
    }
    $("#divRecebidos").find("table tr").attr("data-tagname", "SemGrupo");
    $("#divRecebidos").find("table a").each(function(index) {
      var link = $(this).attr("href");
      if (typeof link !== "undefined" && link.indexOf(acaoType_) !== -1) {
        var tag = getGroupTableLabelFromLink(this, acaoType);
        if (acaoType == "arrivaldate" || acaoType == "acessdate" || acaoType == "senddate" || acaoType == "createdate" || acaoType == "deadline") {
          var startDateNow = moment();
          var startDateYesterday = moment().subtract(1, "days");
          var startDate1Yesterday = moment().subtract(2, "days");
          var startDateWeek = moment().startOf("isoWeek");
          var endDateWeek = moment().endOf("isoWeek");
          var startDateLastWeek = moment().subtract(1, "weeks").startOf("isoWeek");
          var endDateLastWeek = moment().subtract(1, "weeks").endOf("isoWeek");
          var startDate2LastWeek = moment().subtract(2, "weeks").startOf("isoWeek");
          var endDate2LastWeek = moment().subtract(2, "weeks").endOf("isoWeek");
          var startDate3LastWeek = moment().subtract(3, "weeks").startOf("isoWeek");
          var endDate3LastWeek = moment().subtract(3, "weeks").endOf("isoWeek");
          var startDate4LastWeek = moment().subtract(4, "weeks").startOf("isoWeek");
          var endDate4LastWeek = moment().subtract(4, "weeks").endOf("isoWeek");
          var startDate5LastWeek = moment().subtract(5, "weeks").startOf("isoWeek");
          var endDate5LastWeek = moment().subtract(5, "weeks").endOf("isoWeek");
          var startDateLastMonth = moment().subtract(1, "months").startOf("month");
          var endDateLastMonth = moment().subtract(1, "months").endOf("month");
          var startDate2LastMonth = moment().subtract(2, "months").startOf("month");
          var endDate2LastMonth = moment().subtract(2, "months").endOf("month");
          var startDate3LastMonth = moment().subtract(3, "months").startOf("month");
          var endDate3LastMonth = moment().subtract(3, "months").endOf("month");
          var startDateLastQuarter = moment().subtract(10, "months").startOf("month");
          var endDateLastQuarter = moment().subtract(4, "months").endOf("month");
          var startDateLastYear = moment().subtract(1, "years");
          var endDateLastYear = moment().subtract(11, "months").endOf("month");
          var startDateTomorrow = moment().add(1, "day");
          var startDate1Tomorrow = moment().add(2, "day");
          var startDateNextWeek = moment().add(1, "week").startOf("isoWeek");
          var endDateNextWeek = moment().add(1, "week").endOf("isoWeek");
          var startDate2NextWeek = moment().add(2, "week").startOf("isoWeek");
          var endDate2NextWeek = moment().add(2, "week").endOf("isoWeek");
          var startDate3NextWeek = moment().add(3, "week").startOf("isoWeek");
          var endDate3NextWeek = moment().add(3, "week").endOf("isoWeek");
          var startDate4NextWeek = moment().add(4, "week").startOf("isoWeek");
          var endDate4NextWeek = moment().add(4, "week").endOf("isoWeek");
          var startDate5NextWeek = moment().add(5, "week").startOf("isoWeek");
          var endDate5NextWeek = moment().add(5, "week").endOf("isoWeek");
          var startDateNextMonth = moment().add(1, "month").startOf("month");
          var endDateNextMonth = moment().add(1, "month").endOf("month");
          var startDate2NextMonth = moment().add(2, "month").startOf("month");
          var endDate2NextMonth = moment().add(2, "month").endOf("month");
          var startDate3NextMonth = moment().add(3, "month").startOf("month");
          var endDate3NextMonth = moment().add(3, "month").endOf("month");
          var startDateNextQuarter = moment().add(4, "month").startOf("month");
          var endDateNextQuarter = moment().add(6, "month").endOf("month");
          var startDateNextYear = moment().add(1, "year");
          var endDateNextYear = moment().add(11, "month").endOf("month");
          var dataRecebido = acaoType == "arrivaldate" ? getArrayProcessoRecebido($(this).attr("href")).datahora : "";
          dataRecebido = acaoType == "acessdate" ? getArrayProcessoRecebido($(this).attr("href")).datetime : dataRecebido;
          dataRecebido = acaoType == "senddate" ? getArrayProcessoRecebido($(this).attr("href")).datesend : dataRecebido;
          dataRecebido = acaoType == "createdate" ? getArrayProcessoRecebido($(this).attr("href")).datageracao : dataRecebido;
          dataRecebido = acaoType == "deadline" ? $(this).closest("tr").find("td.seipro-prazo-box-display .dateboxDisplay").data("time-sorter") : dataRecebido;
          dataRecebido = typeof dataRecebido !== "undefined" && dataRecebido != "" ? moment(dataRecebido, "YYYY-MM-DD HH:mm:ss") : "";
          if (dataRecebido != "" && dataRecebido.isBetween(startDateWeek, endDateWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "l" : "k") + ".Essa semana";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateLastWeek, endDateLastWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "k" : "r") + ".Semana passada";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate2LastWeek, endDate2LastWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "j" : "s") + ".Duas semana atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate3LastWeek, endDate3LastWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "i" : "t") + ".Tr\xEAs semana atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate4LastWeek, endDate4LastWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "h" : "u") + ".Quatro semana atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate5LastWeek, endDate5LastWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "g" : "v") + ".Cinco semana atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateLastMonth, endDateLastMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "f" : "w") + ".Um m\xEAs atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate2LastMonth, endDate2LastMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "e" : "x") + ".Dois meses atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate3LastMonth, endDate3LastMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "d" : "y") + ".Tr\xEAs meses atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateLastQuarter, endDateLastQuarter)) {
            tag = (orderbyTableGroup2 == "asc" ? "c" : "za") + ".Seis meses atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateLastYear, endDateLastYear)) {
            tag = (orderbyTableGroup2 == "asc" ? "b" : "zb") + ".Um ano atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido < endDateLastYear) {
            tag = (orderbyTableGroup2 == "asc" ? "a" : "zc") + ".Maior que um ano atr\xE1s";
          }
          if (dataRecebido != "" && dataRecebido > endDateNextYear) {
            tag = (orderbyTableGroup2 == "asc" ? "zc" : "a") + ".Maior que um ano";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateNextYear, endDateNextYear)) {
            tag = (orderbyTableGroup2 == "asc" ? "zb" : "b") + ".Em um ano";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateNextQuarter, endDateNextQuarter)) {
            tag = (orderbyTableGroup2 == "asc" ? "za" : "c") + ".Em seis meses";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate3NextMonth, endDate3NextMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "y" : "d") + ".Em tr\xEAs meses";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate2NextMonth, endDate2NextMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "x" : "e") + ".Em dois meses";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateNextMonth, endDateNextMonth)) {
            tag = (orderbyTableGroup2 == "asc" ? "w" : "f") + ".Em um m\xEAs";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate5NextWeek, endDate5NextWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "v" : "g") + ".Em cinco semana";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate4NextWeek, endDate4NextWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "u" : "h") + ".Em quatro semana";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate3NextWeek, endDate3NextWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "t" : "i") + ".Em tr\xEAs semana";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDate2NextWeek, endDate2NextWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "s" : "j") + ".Em duas semana";
          }
          if (dataRecebido != "" && dataRecebido.isBetween(startDateNextWeek, endDateNextWeek)) {
            tag = (orderbyTableGroup2 == "asc" ? "r" : "k") + ".Semana quem vem";
          }
          if (dataRecebido != "" && dataRecebido.format("YYYY-MM-DD") == startDate1Tomorrow.format("YYYY-MM-DD")) {
            tag = (orderbyTableGroup2 == "asc" ? "q" : "l") + ".Depois de amanh\xE3";
          }
          if (dataRecebido != "" && dataRecebido.format("YYYY-MM-DD") == startDateTomorrow.format("YYYY-MM-DD")) {
            tag = (orderbyTableGroup2 == "asc" ? "p" : "m") + ".Amanh\xE3";
          }
          if (dataRecebido != "" && dataRecebido.format("YYYY-MM-DD") == startDateNow.format("YYYY-MM-DD")) {
            tag = (orderbyTableGroup2 == "asc" ? "o" : "n") + ".Hoje";
          }
          if (dataRecebido != "" && dataRecebido.format("YYYY-MM-DD") == startDateYesterday.format("YYYY-MM-DD")) {
            tag = (orderbyTableGroup2 == "asc" ? "n" : "o") + ".Ontem";
          }
          if (dataRecebido != "" && dataRecebido.format("YYYY-MM-DD") == startDate1Yesterday.format("YYYY-MM-DD")) {
            tag = (orderbyTableGroup2 == "asc" ? "m" : "p") + ".Anteontem";
          }
        }
        var tag_ = typeof tag !== "undefined" && tag != "" ? removeAcentos(tag).replace(/\ /g, "") : "SemGrupo";
        var tr_tag = $(this).closest("tr");
        tr_tag.attr("data-tagname", tag_);
        if (isGroupCollapsedLegacy(tag_)) tr_tag.hide();
        arrayTag.push(tag);
      }
    });
    return uniqPro(arrayTag).sort();
  }
  function appendGerados(type) {
    var orderbyDesc = readGroupOrderLegacy() == "desc" ? true : false;
    $("#divGerados table tr").not(".tablesorter-filter-row").each(function(index) {
      if ($(this).find("th").length == 0) {
        var outerHTML = $("<div>").append($(this).clone().addClass("typeGerados")).html();
        $("#divRecebidos").find("table tbody").append(outerHTML);
      }
    });
    $("#divGerados").addClass("displayNone");
    $("#divRecebidos").addClass("tagintable");
    $("#divRecebidosAreaTabela").removeClass("tabelaPanelScroll").css({ height: "", overflowY: "" });
    if ($("#divRecebidosAreaTabela").find(".ui-resizable-handle.ui-resizable-s").length > 0 && typeof $("#divRecebidosAreaTabela").resizable !== "undefined") {
      $("#divRecebidosAreaTabela").resizable().resizable("destroy");
    }
    var tbody = $("#divRecebidos tbody");
    tbody.find("tr").each(function() {
      var processoLink = getProcessoLinkFromGroupRow(this);
      var dataRecebido = processoLink.length ? getArrayProcessoRecebido(processoLink.attr("href")) : "";
      dataRecebido = dataRecebido != "" && type == "arrivaldate" ? moment(dataRecebido.datahora, "YYYY-MM-DD HH:mm:ss").unix() : dataRecebido;
      dataRecebido = dataRecebido != "" && type == "acessdate" ? moment(dataRecebido.datetime, "YYYY-MM-DD HH:mm:ss").unix() : dataRecebido;
      dataRecebido = dataRecebido != "" && type == "createdate" ? moment(dataRecebido.datageracao, "YYYY-MM-DD HH:mm:ss").unix() : dataRecebido;
      dataRecebido = dataRecebido != "" && (type == "senddate" || type == "senddate") ? moment(dataRecebido.datesend, "YYYY-MM-DD HH:mm:ss").unix() : dataRecebido;
      if (dataRecebido != "" && !isNaN(dataRecebido)) {
        $(this).attr("data-order", dataRecebido);
      }
    }).sort(function(a, b) {
      var tda = $(a).data("order");
      var tdb = $(b).data("order");
      return type == "arrivaldate" || type == "senddate" || type == "senddepart" || type == "createdate" || type == "acompanhamentoesp" ? tda > tdb ? orderbyDesc ? 1 : -1 : tda < tdb ? orderbyDesc ? -1 : 1 : 0 : tda > tdb ? orderbyDesc ? -1 : 1 : tda < tdb ? orderbyDesc ? 1 : -1 : 0;
    }).appendTo(tbody);
    if ($("#divRecebidosAreaPaginacaoInferior a").length == 0) {
      $("#divRecebidosAreaPaginacaoInferior").hide();
    }
  }
  function removeDuplicateValue(element) {
    if ($(element).length) {
      $(element).val(uniqPro($(element).val().split(",")).join(","));
    }
  }
  function setSelectAllTr(this_, tagname = false) {
    var limit = 100;
    var index = typeof $(this_).data("index") !== "undefined" ? $(this_).data("index") : 0;
    var tagname_select = tagname ? 'tr[data-tagname="' + tagname + '"]:visible' : "tr:visible";
    var listCheckbox = [];
    if (index < 1) {
      var checkbox = $(this_).closest("table").find(tagname_select).find("input[type=checkbox]:not(.onoffswitch-checkbox)");
      var t = checkbox.length > limit ? Math.round(checkbox.length / limit) : true;
      if (t) {
        for (i = 0; i <= t; i++) {
          var init = i * limit;
          var end = (i + 1) * limit;
          listCheckbox.push(checkbox.slice(init, end));
        }
      } else {
        checkbox.trigger("click");
      }
      $(this_).data("index", index + 1);
    } else {
      var checkbox = $(this_).closest("table").find(tagname_select).find("input[type=checkbox]:not(.onoffswitch-checkbox):checked");
      var t = checkbox.length > limit ? Math.round(checkbox.length / limit) : false;
      if (t) {
        for (i = 0; i <= t; i++) {
          var init = i * limit;
          var end = (i + 1) * limit;
          listCheckbox.push(checkbox.slice(init, end));
        }
      } else {
        checkbox.trigger("click");
      }
      $(this_).data("index", 0);
    }
    updateTipSelectAll(this_);
    if (t) {
      listCheckbox.forEach(function(value, i2) {
        setTimeout(function() {
          value.trigger("click");
        });
      });
    }
  }
  function getSelectAllTr(this_, tagname) {
    if ($(this_).closest("table").find('tr[data-tagname="SemGrupo"]:visible input[type=checkbox]:checked').length > 0) {
      setSelectAllTr(this_, "SemGrupo");
    } else {
      setSelectAllTr(this_, tagname);
    }
    removeDuplicateValue("#hdnRecebidosItensSelecionados");
    removeDuplicateValue("#hdnGeradosItensSelecionados");
  }
  function updateTipSelectAll(this_) {
    var _this = $(this_);
    var data = _this.data();
    var table = _this.closest("table");
    var text = table.find('input[type="checkbox"]:checked').length > 0 ? "Inverter Sele\xE7\xE3o" : "Selecionar Todos";
    text = typeof data.index != "undefined" && data.index == 1 ? "Remover Sele\xE7\xE3o" : text;
    $(this_).attr("onmouseenter", "return infraTooltipMostrar('" + text + "')");
    if (_this.is(":hover")) {
      if (typeof infraTooltipMostrar === "function") infraTooltipMostrar(text);
    } else {
      if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    }
  }
  function replaceSelectAll() {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    if (tableProc.length > 0) {
      tableProc.find("#lnkInfraCheck").after(`<a onclick="setSelectAllTr(this);" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar('Selecionar Tudo')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/` + (typeof isNewSEI !== "undefined" && SeiPro.sei.adapter.isNewSEI() ? "svg/check.svg" : "imagens/check.gif") + '" class="infraImg"></a>').remove();
    }
  }
  function cleanConfigDataRecebimento() {
    var storeRecebimento = typeof localStorageRestorePro("configDataRecebimentoPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configDataRecebimentoPro")) ? localStorageRestorePro("configDataRecebimentoPro") : [];
    var array_procedimentos = [];
    $("#frmProcedimentoControlar").find("a.processoVisualizado").each(function(i2) {
      array_procedimentos.push(String(getParamsUrlPro($(this).attr("href")).id_procedimento));
    });
    uniqPro(array_procedimentos);
    for (i = 0; i < storeRecebimento.length; i++) {
      if ($.inArray(String(storeRecebimento[i]["id_procedimento"]), array_procedimentos, 0) == -1 && moment().diff(moment(storeRecebimento[i]["datetime"], "YYYY-MM-DD HH:mm:ss"), "days") > 30) {
        storeRecebimento.splice(i, 1);
        i--;
      }
    }
    localStorageStorePro("configDataRecebimentoPro", storeRecebimento);
  }
  function removeAllTags(forceFilter = false, n) {
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find(".especifProc").remove();
    $("#divRecebidos table tbody").find(".tagintable").remove();
    $("#divRecebidos table tbody tr").each(function(index) {
      if ($(this).hasClass("typeGerados")) {
        $(this).remove();
      } else {
        $(this).show();
      }
    });
    $("#divRecebidosAreaTabela").removeClass("tabelaPanelScroll");
    if ($("#divRecebidosAreaTabela").find(".ui-resizable-handle.ui-resizable-s").length > 0 && typeof $("#divRecebidosAreaTabela").resizable !== "undefined") {
      $("#divRecebidosAreaTabela").resizable().resizable("destroy");
    }
    $("#divRecebidos").removeClass("tagintable").find("caption").show();
    $("#divRecebidos .newRowControle").remove();
    $("#divGerados").removeClass("displayNone");
    $("#divRecebidos thead").show();
    $("table tr.tablesorter-headerRow").show();
    $("#orderbyTableGroup").remove();
    if (SeiPro.sei.adapter.isNewSEI()) $("#divTabelaProcesso").removeClass("displayInitial");
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").trigger("filterReset").trigger("update").find(".filterTableProcessos").removeClass("newLink_active");
    applyHomeFilterFallback("", "clean");
    if (!forceFilter) {
      sessionStorageRemovePro("setFiltersTableHome");
    }
    initControlePrazo();
    initViewEspecifacaoProcesso();
    addAcompanhamentoEspIcon();
    tableHomeDestroy(true);
    if (forceFilter && sessionStorageRestorePro("setFiltersTableHome")) {
      setTimeout(function() {
        var storedFiltersHome = sessionStorageRestorePro("setFiltersTableHome");
        if ($.isArray(storedFiltersHome)) {
          $.each(tableHomePro, function(i2) {
            $.tablesorter.setFilters(tableHomePro[i2][0], storedFiltersHome, true);
            tableHomePro[i2].trigger("update");
          });
        } else if (storedFiltersHome && typeof storedFiltersHome.value !== "undefined" && typeof storedFiltersHome.type !== "undefined") {
          var filterHome = $("#filterTableHome");
          if (filterHome.length > 0) {
            filterHome.val(storedFiltersHome.value);
            getFilterTableHome(filterHome[0]);
          }
        }
      }, 1e3);
    }
  }
  function getUniqueTableTag(i2, tagName, type) {
    var tagName_ = getTagName(tagName, type);
    var txtTagName = (type == "arrivaldate" || type == "acessdate" || type == "senddate" || type == "createdate" || type == "deadline") && tagName.indexOf(".") !== -1 ? tagName.split(".")[1] : tagName;
    var tbRecebidos = $("#divRecebidos table");
    var countTd = tbRecebidos.find("tr:not(.tablesorter-headerRow)").eq(1).find("td").length;
    var iconSelect = `<span class="lblInfraCheck" aria-hidden="true"></span><a id="lnkInfraCheck" onclick="getSelectAllTr(this, '` + tagName_ + `');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar('Selecionar Tudo')" onmouseout="return infraTooltipOcultar();"><img src="/infra_css/` + (SeiPro.sei.adapter.isNewSEI() ? "svg/check.svg" : "imagens/check.gif") + '" id="imgRecebidosCheck" class="infraImg"></a></th>';
    var tagCount = $("#divRecebidos table tbody").find('tr[data-tagname="' + tagName_ + '"]:visible').length;
    var collapseBtn = '<span class="tagintable">   <a class="controleTableTag newLink" data-htagname="' + tagName_ + `" onclick="toggleGroupTablePro(this)" data-action="show" onmouseover="return infraTooltipMostrar('Mostrar Agrupamento');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;` + (getOptionsPro("panelGroup_" + tagName_) ? "" : "display:none;") + '">       <i class="fas fa-plus-square cinzaColor"></i>   </a>   <a class="controleTableTag newLink" data-htagname="' + tagName_ + `" onclick="toggleGroupTablePro(this)" data-action="hide" onmouseover="return infraTooltipMostrar('Recolher Agrupamento');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt;` + (getOptionsPro("panelGroup_" + tagName_) ? "display:none;" : "") + '">       <i class="fas fa-minus-square cinzaColor"></i>   </a></span>';
    var htmlBody = '<tr class="infraCaption tagintable"><td colspan="' + (countTd + 3) + '"><span ' + actionTest + ">" + tagCount + ' registros:</span></td></tr><tr data-htagname="' + tagName_ + '" class="tagintable tableHeader"><th class="tituloControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" width="5%" align="center">' + iconSelect + '</th><th class="tituloControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" colspan="' + (countTd + 2) + '">' + txtTagName + collapseBtn + "</th></tr>";
    $(htmlBody).appendTo("#divRecebidos table tbody");
    if (i2 == 0) {
      tbRecebidos.find("caption").hide();
    }
  }
  function getTableOnTag(type) {
    $("#divRecebidos table tbody tr").each(function(index) {
      var processoLink = getProcessoLinkFromGroupRow(this);
      var dataTag = $(this).attr("data-tagname");
      dataTag = dataTag == "" ? "SemGrupo" : dataTag;
      if (typeof dataTag !== "undefined" && processoLink.length > 0) {
        var descAttr = processoLink.attr("onmouseover");
        var desc = typeof descAttr !== "undefined" && descAttr !== "" ? extractGroupTableTooltipToArray(descAttr) : false;
        var txt_desc = desc && typeof desc[0] !== "undefined" ? desc[0] : "";
        var txt_tipo_proc = desc && typeof desc[1] !== "undefined" ? desc[1] : "";
        var editDesc = `<a class="newLink newLink_active followLink followLinkDesc content_btnsave" onclick="editFieldProc(this)" style="right: 0;top: 0;" onmouseover="return infraTooltipMostrar('Editar descri\xE7\xE3o');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-edit" style="font-size: 100%;"></i></a>`;
        var htmlDesc = type == "all" ? '<td class="tagintable" data-old="' + txt_desc + '"><span class="info">' + txt_desc + "</span>" + editDesc + "</td>" : '<td class="tagintable" data-old="' + txt_desc + '"><span class="info">' + txt_desc + "</span>" + editDesc + '</td><td class="tagintable">' + txt_tipo_proc + "</td>";
        var dataRecebido = getArrayProcessoRecebido(processoLink.attr("href"));
        var textBoxDesc = type == "arrivaldate" || type == "acessdate" ? dataRecebido.descricao + " em: " + moment(dataRecebido.datahora, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") + "<br>" : dataRecebido.datesend != "" ? dataRecebido.descricaosend + " em: " + moment(dataRecebido.datesend, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") + "<br>" : "";
        textBoxDesc = type == "createdate" ? dataRecebido.descricaodatageracao + " em: " + moment(dataRecebido.datageracao, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") + "<br>" : textBoxDesc;
        var textBox = textBoxDesc + "\xDAltimo acesso em: " + moment(dataRecebido.datetime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm");
        var textDataRecebido = dataRecebido != "" && type == "acessdate" ? moment(dataRecebido.datetime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm") : "";
        textDataRecebido = dataRecebido != "" && type == "arrivaldate" ? moment(dataRecebido.datahora, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : textDataRecebido;
        textDataRecebido = dataRecebido != "" && type == "createdate" ? moment(dataRecebido.datageracao, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : textDataRecebido;
        textDataRecebido = dataRecebido != "" && (type == "senddate" || type == "senddepart" || type == "acompanhamentoesp") && dataRecebido.datesend != "" ? moment(dataRecebido.datesend, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : textDataRecebido;
        var htmlDataRecebido = dataRecebido != "" ? `<td class="tagintable"><span onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('` + textBox + `')">` + textDataRecebido + "</span></td>" : '<td class="tagintable"></td>';
        htmlDataRecebido = type == "all" ? "" : htmlDataRecebido;
        $(this).find("td").eq(3).after(htmlDesc + htmlDataRecebido);
        var cloneTr = $(this).clone();
        $("#divRecebidos table tbody").find('tr[data-htagname="' + dataTag + '"]').after(cloneTr);
        $(this).remove();
      }
    });
    var tbody = $("#divRecebidos table tbody");
    var nrSemGrupo = tbody.find('tr[data-tagname="SemGrupo"]:visible').length;
    if (nrSemGrupo == 0) {
      tbody.find("tr.infraCaption.tagintable").eq(0).remove();
      tbody.find('tr[data-htagname="SemGrupo"]').remove();
    } else {
      var textRegistros = nrSemGrupo == 1 ? nrSemGrupo + " registro:" : nrSemGrupo + " registros:";
      tbody.find("tr.infraCaption.tagintable").eq(0).find("td").html("<span " + actionTest + ">" + textRegistros + "</span>");
      tbody.find('tr[data-tagname="SemGrupo"]:not(.infraTrClara)').eq(0).hide();
    }
    if (type == "all") {
      var newColumns = '<th class="tituloControle newRowControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" style="text-align: center;">Especifica\xE7\xE3o</th>' + // '<th class="tituloControle newRowControle" style="text-align: center;">Tipo</th>'+
      (checkConfigValue("gerenciarprazos") ? '<th class="tituloControle newRowControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" style="text-align: center;">Prazos</th>' : "");
      var titleCaption = $("#tblProcessosRecebidos").find("tbody").find(".tableHeader, .infraCaption").text();
      titleCaption = titleCaption !== "" ? ' <span class="newRowControle">(Agrupados: ' + titleCaption + ")</span>" : "";
      $("#tblProcessosRecebidos").find("caption.infraCaption").show().append(titleCaption);
      $("#tblProcessosRecebidos").find("thead").show().find(".tablesorter-headerRow").append(newColumns);
      $("#tblProcessosRecebidos").find("tbody").find(".tableHeader, .infraCaption").remove();
      $("#tblProcessosRecebidos").find("thead").find(".seipro-prazo-box-display").remove();
      tableHomeDestroy(true);
    }
    if (type != "" && type != "all") {
      var orderbyTableGroup2 = readGroupOrderLegacy();
      $("#processoToCSV").after('<a class="newLink" data-order="' + orderbyTableGroup2 + `" onclick="orderbyTableGroup(this)" id="orderbyTableGroup" onmouseover="return infraTooltipMostrar('Classificar dados pela ordem ` + (orderbyTableGroup2 == "asc" ? "decrescente" : "crescente") + `');" onmouseout="return infraTooltipOcultar();" style="margin: 0;font-size: 10pt;float: right;"><i class="fas fa-sort-numeric-` + (orderbyTableGroup2 == "asc" ? "up" : "down") + ' cinzaColor"></i></a>');
    }
    if (SeiPro.sei.adapter.isNewSEI() && type != "") {
      $("#divTabelaProcesso").addClass("displayInitial");
    } else if (SeiPro.sei.adapter.isNewSEI()) {
      $("#divTabelaProcesso").removeClass("displayInitial");
    }
  }
  function orderbyTableGroup(this_) {
    var _this = $(this_);
    var data = _this.data();
    var setOrder = data.order == "asc" ? "desc" : "asc";
    setOptionsPro("orderbyTableGroup", setOrder);
    _this.attr("data-order", setOrder);
    _this.find("i").attr("class", "fas fa-sort-numeric-" + data.order == "asc" ? "down" : "up");
    if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    updateGroupTable($("#selectGroupTablePro"));
  }
  function getArrayProcessoRecebido(href) {
    var io = listaAgrupamentoIO();
    if (io && typeof io.readReceivedProcess === "function") {
      return io.readReceivedProcess(localStorageRestorePro, getParamsUrlPro, jmespath, href);
    }
    var storeRecebimento = typeof localStorageRestorePro !== "undefined" && typeof localStorageRestorePro("configDataRecebimentoPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configDataRecebimentoPro")) ? localStorageRestorePro("configDataRecebimentoPro") : [];
    var id_procedimento = typeof getParamsUrlPro !== "undefined" ? String(getParamsUrlPro(href).id_procedimento) : false;
    var dadosRecebido = typeof jmespath !== "undefined" && jmespath.search(storeRecebimento, "[?id_procedimento=='" + id_procedimento + "'] | length(@)") > 0 ? jmespath.search(storeRecebimento, "[?id_procedimento=='" + id_procedimento + "'] | [0]") : "";
    return dadosRecebido;
  }
  function updateGroupTablePro(valueSelect, mode) {
    var io = listaAgrupamentoIO();
    var selectGroup = io && typeof io.readSelectedGroup === "function" ? io.readSelectedGroup(localStorageRestorePro) : localStorageRestorePro("selectGroupTablePro");
    if ($.isArray(selectGroup) && selectGroup.length > 0) {
      if (jmespath.search(selectGroup, "[?unidade=='" + siglaUnidadeAtual + "'].unidade | length(@)") > 0) {
        for (i = 0; i < selectGroup.length; i++) {
          if (selectGroup[i]["unidade"] == siglaUnidadeAtual) {
            if (mode == "remove") {
              selectGroup.splice(i, 1);
              i--;
            } else {
              selectGroup[i]["selected"] = valueSelect;
            }
          }
        }
      } else if (valueSelect != "") {
        selectGroup.push({ unidade: siglaUnidadeAtual, selected: valueSelect });
      }
      localStorageStorePro("selectGroupTablePro", selectGroup);
    } else {
      if (mode == "remove") {
        localStorageRemovePro("selectGroupTablePro");
      } else {
        localStorageStorePro("selectGroupTablePro", [{ unidade: siglaUnidadeAtual, selected: valueSelect }]);
      }
    }
  }
  function storeGroupTablePro() {
    if (typeof localStorageRestorePro !== "undefined" && localStorageRestorePro("selectGroupTablePro") != null) {
      var io = listaAgrupamentoIO();
      var selectGroup = io && typeof io.readSelectedGroup === "function" ? io.readSelectedGroup(localStorageRestorePro) : localStorageRestorePro("selectGroupTablePro");
      if ($.isArray(selectGroup) && typeof jmespath !== "undefined" && jmespath.search(selectGroup, "[?unidade=='" + siglaUnidadeAtual + "'].unidade | [0]") == siglaUnidadeAtual) {
        return jmespath.search(selectGroup, "[?unidade=='" + siglaUnidadeAtual + "'].selected | [0]");
      } else if (!$.isArray(selectGroup)) {
        localStorageStorePro("selectGroupTablePro", [{ unidade: siglaUnidadeAtual, selected: selectGroup }]);
        return selectGroup;
      }
    } else {
      return false;
    }
  }
  function insertGroupTable(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof window.__SEI_PRO_CONFIG_READY__ === "boolean" && !window.__SEI_PRO_CONFIG_READY__) {
      setTimeout(function() {
        insertGroupTable(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload insertGroupTable => config");
      }, 500);
      return;
    }
    if (typeof checkConfigValue === "undefined" || typeof verifyConfigValue === "undefined") {
      setTimeout(function() {
        insertGroupTable(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload insertGroupTable => helpers");
      }, 500);
      return;
    }
    var enableGroupTable = checkConfigValue("agruparlista");
    var enablePaginationRemoval = verifyConfigValue("removepaginacao");
    var enableAssignmentFilter = checkConfigValue("filtroporatribuicao");
    if (!enableGroupTable && !enablePaginationRemoval && !enableAssignmentFilter) {
      hideProcessoPaginacaoSuperior();
      return;
    }
    if ($("#tblProcessosDetalhado").length == 0 && $("#newFiltro").length == 0) {
      var htmlControl = '<div id="newFiltro">';
      if (enableGroupTable || enablePaginationRemoval) {
        htmlControl += selectFilterTableHome(!enableAssignmentFilter);
      }
      if (enableAssignmentFilter) {
        htmlControl += selectAssignmentFilterHome();
      }
      if (enableGroupTable) {
        var statusTableTags = storeGroupTablePro() == "tags" ? "selected" : "";
        var statusTableTypes = storeGroupTablePro() == "types" ? "selected" : "";
        var statusTableUsers = storeGroupTablePro() == "users" ? "selected" : "";
        var statusTableCheckpoints = storeGroupTablePro() == "checkpoints" ? "selected" : "";
        var statusTableArrivaldate = storeGroupTablePro() == "arrivaldate" ? "selected" : "";
        var statusTableSenddate = storeGroupTablePro() == "senddate" ? "selected" : "";
        var statusTableDeadline = storeGroupTablePro() == "deadline" ? "selected" : "";
        var statusTableAcessdate = storeGroupTablePro() == "acessdate" ? "selected" : "";
        var statusTableDepartSend = storeGroupTablePro() == "senddepart" ? "selected" : "";
        var statusTableCreatedate = storeGroupTablePro() == "createdate" ? "selected" : "";
        var statusTableAcompEsp = storeGroupTablePro() == "acompanhamentoesp" ? "selected" : "";
        var statusTableAll = storeGroupTablePro() == "all" ? "selected" : "";
        var panelKanbanHome = selectPanelKanbanHome();
        htmlControl += '   <select id="selectGroupTablePro" class="groupTable selectPro" onchange="updateGroupTable(this)" data-placeholder="Agrupar processos...">     <option value="">&nbsp;</option>     <option value="">Sem agrupamento</option>     <option value="all" ' + statusTableAll + '>Agrupar processos recebidos/gerados</option>     <option value="deadline" ' + statusTableDeadline + '>Agrupar processos por prazo</option>     <option value="createdate" ' + statusTableCreatedate + '>Agrupar processos por data de autua\xE7\xE3o</option>     <option value="arrivaldate" ' + statusTableArrivaldate + '>Agrupar processos por data de recebimento</option>     <option value="senddate" ' + statusTableSenddate + '>Agrupar processos por data de envio</option>     <option value="acessdate" ' + statusTableAcessdate + '>Agrupar processos por data do \xFAltimo acesso</option>     <option value="tags" ' + statusTableTags + '>Agrupar processos por marcadores</option>     <option value="types" ' + statusTableTypes + '>Agrupar processos por tipo</option>     <option value="users" ' + statusTableUsers + '>Agrupar processos por respons\xE1vel</option>     <option value="checkpoints" ' + statusTableCheckpoints + '>Agrupar processos por ponto de controle</option>     <option value="senddepart" ' + statusTableDepartSend + '>Agrupar processos por unidade de envio</option>     <option value="acompanhamentoesp" ' + statusTableAcompEsp + ">Agrupar processos por acompanhamento especial</option>  </select>  " + panelKanbanHome + "  " + csvExportLinkHtml();
      }
      htmlControl += "</div>";
      $("#divFiltro").after(htmlControl).css({
        "width": "auto",
        "display": "inline-flex",
        "vertical-align": "top"
      });
      if ($("#divFiltroLinhaPro").length == 0) {
        $("#divFiltro, #newFiltro").wrapAll('<div id="divFiltroLinhaPro" class="collapseTabelaProcesso"></div>');
      }
      if ($("#idSelectTipoBloco").length != 0) {
        $("#idSelectTipoBloco").appendTo("#newFiltro");
        $("#idSelectBloco").appendTo("#newFiltro");
      }
    }
    if ($("#newFiltro").length > 0 && enableAssignmentFilter && $("#filterAssignmentTableHome").length == 0) {
      $("#newFiltro").prepend(selectAssignmentFilterHome());
    }
    setTimeout(function() {
      if (enableGroupTable && $("#selectGroupTablePro").length > 0) {
        updateGroupTable($("#selectGroupTablePro"));
      } else if (enablePaginationRemoval) {
        initProcessoPaginacao($("#selectGroupTablePro"));
      }
      if (enableAssignmentFilter && $("#filterAssignmentTableHome").length > 0) {
        restoreAssignmentFilterHome();
      }
      if (verifyConfigValue("substituiselecao") && $("#newFiltro .selectPro").length > 0) {
        initChosenFilterHome();
      }
    }, 500);
  }
  function initChosenFilterHome(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof $().chosen !== "undefined") {
      setTimeout(() => {
        $("#newFiltro .selectPro").chosen({
          placeholder_text_single: " ",
          no_results_text: "Nenhum resultado encontrado",
          normalize_search_text: function(text) {
            return removeAcentos(text.toLowerCase());
          }
        });
        forcePlaceHoldChosen();
      }, 2e3);
    } else {
      if (typeof $().chosen === "undefined" && typeof URL_SPRO !== "undefined" && TimeOut2 == 9e3) {
        $.getScript(URL_SPRO + "js/lib/chosen.jquery.min.js");
      }
      setTimeout(function() {
        initChosenFilterHome(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initChosenFilterHome");
      }, 500);
    }
  }
  function removeCacheGroupTable(this_) {
    localStorageRemovePro("configDataRecebimentoPro");
    console.log("localStorageRemovePro");
    $(this_).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    console.log("Remove configDataRecebimentoPro");
  }
  function hideProcessoPaginacaoSuperior() {
    if (typeof verifyConfigValue !== "function") {
      return;
    }
    $("body").toggleClass("seiProHideProcessoPaginacaoSuperior", !!verifyConfigValue("ocultarpaginacaosuperior"));
  }
  function bindProcessoPaginacaoSuperiorVisibility() {
    hideProcessoPaginacaoSuperior();
  }
  if (typeof window !== "undefined") {
    if (window.__SEI_PRO_CONFIG_READY__) {
      bindProcessoPaginacaoSuperiorVisibility();
    } else {
      window.addEventListener("sei-pro-config-ready", bindProcessoPaginacaoSuperiorVisibility, { once: true });
    }
  }
  function updateGroupTable(this_) {
    hideProcessoPaginacaoSuperior();
    if (typeof checkConfigValue !== "undefined" && verifyConfigValue("removepaginacao")) {
      initProcessoPaginacao(this_);
    } else {
      initUpdateGroupTable(this_);
    }
    if (typeof checkConfigValue === "function" && checkConfigValue("filtroporatribuicao")) {
      setTimeout(function() {
        restoreAssignmentFilterHome();
      }, 1200);
    }
  }
  function initUpdateGroupTable(this_) {
    hideProcessoPaginacaoSuperior();
    if (typeof checkConfigValue !== "undefined" && checkConfigValue("agruparlista")) {
      var valueSelect = $(this_).val();
      initTableTag(valueSelect);
      if (!valueSelect || valueSelect == "all" || valueSelect == "") {
        setOptionsPro("panelProcessosView", "Tabela");
        setTimeout(function() {
          var btnTabela = document.querySelector('#processosProActions .btn[data-value="Tabela"]');
          if (btnTabela) getPanelProc(btnTabela);
        }, 500);
      }
      if (getOptionsPro("panelProcessosView") == "Quadro") {
        initAddKanbanProc(valueSelect);
        updateGroupTablePro(valueSelect, "insert");
      } else {
        if (typeof valueSelect !== "undefined" && valueSelect != "") {
          $("#filterTableHome").val("").trigger("chosen:updated");
          updateGroupTablePro(valueSelect, "insert");
          if (valueSelect == "arrivaldate" || valueSelect == "acessdate" || valueSelect == "senddate" || valueSelect == "senddepart" || valueSelect == "createdate" || valueSelect == "acompanhamentoesp") {
            statusPesquisaDadosProcedimentos = true;
            getDadosProcedimentosControlar();
          } else if (statusPesquisaDadosProcedimentos) {
            breakDadosProcedimentosControlar();
          }
        } else if (typeof valueSelect !== "undefined") {
          if (typeof localStorageRemovePro !== "undefined") {
            updateGroupTablePro(valueSelect, "remove");
            if (statusPesquisaDadosProcedimentos) {
              breakDadosProcedimentosControlar();
            }
          }
        }
      }
    }
  }
  function getTableTag(type) {
    var listTags = getListTypes(type);
    $.each(listTags, function(i2, val) {
      getUniqueTableTag(i2, val, type);
    });
  }
  function initTableTag(type = "") {
    cleanConfigDataRecebimento();
    removeAllTags(false, 1);
    if (type != "") {
      $("#divRecebidos thead").hide();
      appendGerados(type);
      getTableTag(type);
      getTableOnTag(type);
    }
    setTimeout(function() {
      initNewTabProcesso();
      forcePlaceHoldChosen();
      urgenteProMoveOnTop();
      checkboxRangerSelectShift();
      if (type != "" && type != "all" && $('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').length > 0) {
        $('#tblProcessosRecebidos tr.tagintable[data-htagname="(URGENTE)"]').remove();
        $("#tblProcessosRecebidos tr.urgentePro").show().attr("data-tagname", "(URGENTE)");
        var colspan = $("#tblProcessosRecebidos tr:not(.tableHeader)").eq(1).find("td").length;
        colspan = typeof colspan !== "undefined" && colspan > 0 ? colspan + 2 : 7;
        var htmlHeadUrgente = '<tr data-htagname="(URGENTE)" class="tagintable tableHeader">   <th class="tituloControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + `" width="5%" align="center">       <span class="lblInfraCheck" aria-hidden="true"></span>       <a id="lnkInfraCheck" onclick="getSelectAllTr(this, '(URGENTE)');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar('Selecionar Tudo')" onmouseout="return infraTooltipOcultar();">           <img src="/infra_css/` + (SeiPro.sei.adapter.isNewSEI() ? "svg/check.svg" : "imagens/check.gif") + '" id="imgRecebidosCheck" class="infraImg">       </a>   </th>   <th class="tituloControle ' + (SeiPro.sei.adapter.isNewSEI() ? "infraTh" : "") + '" colspan="' + colspan + '">(URGENTE)</th></tr>';
        $("#tblProcessosRecebidos tbody").prepend(htmlHeadUrgente);
      }
    }, 1e3);
  }
  function urgenteProMoveOnTop() {
    $("#tblProcessosRecebidos tbody").prepend($('#tblProcessosRecebidos tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest("tr"));
    $("#tblProcessosGerados tbody").prepend($('#tblProcessosGerados tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest("tr"));
    $("#tblProcessosDetalhado tbody").prepend($('#tblProcessosDetalhado tbody a.urgentePro[href*="controlador.php?acao=procedimento_trabalhar"]').closest("tr"));
  }
  function checkLoadedTableSorter() {
    return typeof tableHomePro !== "undefined" && typeof tableHomePro[0] !== "undefined" && typeof tableHomePro[0].data("tablesorter") !== "undefined" && typeof tableHomePro[0].data("tablesorter").$filters !== "undefined";
  }

  // src/features/lista-processos/home-filters.js
  function normalizeProcessoAtribuicaoText(link) {
    var target = $(link);
    var title = target.attr("title");
    if (typeof title !== "undefined" && title !== "") {
      title = title.replace("Atribu\xEDdo para", "").trim().split(/(\s).+\s/).join("");
      if (title) {
        return title;
      }
    }
    return target.text().trim();
  }
  function updateHomeFilterCaption(table, filteredRows) {
    var caption = table.find("caption.infraCaption").eq(0);
    if (caption.length === 0) {
      return;
    }
    var baseCaption = caption.data("seiProCaptionBase");
    if (typeof baseCaption === "undefined" || baseCaption === null || baseCaption === "") {
      baseCaption = caption.text();
      caption.data("seiProCaptionBase", baseCaption);
    }
    var visibleRows = typeof filteredRows === "number" && !isNaN(filteredRows) ? filteredRows : table.find("tbody tr").filter(function() {
      var row = $(this);
      return row.is(":visible") && !row.hasClass("tableHeader") && !row.hasClass("tagintable") && !row.hasClass("infraCaption") && row.find('a[href*="acao=procedimento_trabalhar"]').length > 0;
    }).length;
    caption.text(rewriteHomeFilterCaption(baseCaption, visibleRows));
  }
  function syncHomeProcessCaption() {
    updateHomeFilterCaption($("#tblProcessosRecebidos"));
    updateHomeFilterCaption($("#tblProcessosGerados"));
  }
  function updateVisibleHeadersForHomeFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;
    table.find("tbody tr").each(function() {
      var row = $(this);
      if (row.hasClass("tableHeader") || row.hasClass("tagintable") || row.hasClass("infraCaption")) {
        if (currentHeader !== null) {
          currentHeader.toggle(hasVisibleRows);
        }
        currentHeader = row;
        hasVisibleRows = false;
        return;
      }
      if (!row.hasClass("seiProHomeFilterHidden")) {
        hasVisibleRows = true;
      }
    });
    if (currentHeader !== null) {
      currentHeader.toggle(hasVisibleRows);
    }
  }
  function getHomeRowTagValue(row) {
    var tagName = row.attr("data-tagname");
    if (typeof tagName !== "undefined" && tagName !== null && tagName !== "") {
      return String(tagName);
    }
    var markerLink = row.find('a[href*="acao=andamento_marcador_gerenciar"]').first();
    if (markerLink.length > 0) {
      var markerTooltip = extractGroupTableTooltipToArray(markerLink.attr("onmouseover"));
      var markerName = markerTooltip && typeof markerTooltip[1] !== "undefined" && markerTooltip[1] !== "" ? markerTooltip[1] : "";
      if (markerName === "") {
        var ariaLabel = markerLink.attr("aria-label");
        if (typeof ariaLabel !== "undefined" && ariaLabel !== "") {
          markerName = ariaLabel.split("/").pop().trim();
        } else {
          markerName = markerLink.text().trim();
        }
      }
      if (markerName !== "") {
        return String(markerName);
      }
    }
    return "SemGrupo";
  }
  function rowMatchesHomeFilter(row, value, dataType) {
    var normalizedValue = normalizeHomeFilterText(value);
    if (dataType == "user") {
      return normalizeHomeFilterText(getProcessoAtribuicaoValue(row)) === normalizedValue;
    }
    if (dataType == "tag") {
      var tagName = getHomeRowTagValue(row);
      if (value === "null") {
        return tagName === "SemGrupo" || row.find('a[href*="acao=andamento_marcador_gerenciar"]').length === 0;
      }
      return normalizeHomeFilterKey(tagName) === normalizeHomeFilterKey(value);
    }
    if (dataType == "proc") {
      if (normalizedValue === "nao visualizado") {
        return row.find("a.processoNaoVisualizado, a.processoNaoVisualizadoSigiloso").length > 0;
      }
      var processLink = row.find('a[href*="controlador.php?acao=procedimento_trabalhar"]').first();
      var processText = processLink.text() || "";
      var tooltip = extractTooltipToArray(processLink.attr("onmouseover"));
      var tooltipText = tooltip && tooltip.length > 0 ? tooltip.join(" ") : "";
      var rowText = normalizeHomeFilterText(processText + " " + tooltipText + " " + row.text());
      return rowText.indexOf(normalizedValue) !== -1;
    }
    return true;
  }
  function applyHomeFilterFallback(value, dataType) {
    var tables = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var normalizedType = String(dataType || "clean");
    var normalizedValue = String(value || "");
    tables.each(function() {
      var table = $(this);
      table.find("tbody tr").each(function() {
        var row = $(this);
        if (row.hasClass("tableHeader") || row.hasClass("tagintable") || row.hasClass("infraCaption")) {
          row.removeClass("seiProHomeFilterHidden");
          return;
        }
        var show = normalizedType === "clean" || normalizedValue === "all" ? true : rowMatchesHomeFilter(row, normalizedValue, normalizedType);
        row.toggle(show);
        row.toggleClass("seiProHomeFilterHidden", !show);
      });
      updateVisibleHeadersForHomeFilter(table);
      updateHomeFilterCaption(table);
    });
  }
  function getFilterTableHome(this_) {
    var _this = $(this_);
    var value = _this.val() || "";
    var data = _this.find("option:selected").data() || {};
    var filters = [];
    var tagFilterSelected = data.type == "tag";
    var hasTablesorterHome = checkLoadedTableSorter() && tableHomePro.length > 0;
    var clearFilters = ["", "", "", "", ""];
    if ($("#selectGroupTablePro").val() != "") {
      $("#selectGroupTablePro").val("").trigger("change").trigger("chosen:updated");
    }
    if (value === "all" || data.type === "clean") {
      applyHomeFilterFallback("", "clean");
      $.each(tableHomePro, function(i2) {
        if (tableHomePro[i2] && typeof tableHomePro[i2].trigger === "function") {
          tableHomePro[i2].trigger("filterReset").trigger("update");
        }
      });
      sessionStorageRemovePro("setFiltersTableHome");
      if (verifyConfigValue("substituiselecao")) {
        forcePlaceHoldChosen();
        _this.trigger("chosen:updated");
      }
      return;
    }
    if (data.type == "user") {
      filters[3] = value == "" ? '""' : "(" + value + ")";
    } else if (data.type == "proc") {
      filters[2] = value == "" ? '""' : extractOnlyAlphaNum(removeAcentos(value));
    } else if (data.type == "tag") {
      filters[1] = value == "null" ? "!Marcador?" : value == "" ? "" : "Marcador? " + extractOnlyAlphaNum(removeAcentos(value));
    }
    if (tagFilterSelected && hasTablesorterHome) {
      setTimeout(function() {
        $.each(tableHomePro, function(i2) {
          $.tablesorter.setFilters(tableHomePro[i2][0], clearFilters, true);
          tableHomePro[i2].trigger("update");
        });
        applyHomeFilterFallback(value, data.type);
        sessionStorageStorePro("setFiltersTableHome", { value, type: data.type });
      }, 100);
    } else {
      applyHomeFilterFallback(value, data.type);
      if (hasTablesorterHome && filters.length > 0) {
        setTimeout(function() {
          $.each(tableHomePro, function(i2) {
            $.tablesorter.setFilters(tableHomePro[i2][0], filters, true);
          });
          sessionStorageStorePro("setFiltersTableHome", filters);
        });
      } else {
        sessionStorageStorePro("setFiltersTableHome", { value, type: data.type });
      }
    }
    if (verifyConfigValue("substituiselecao")) {
      forcePlaceHoldChosen();
      _this.trigger("chosen:updated");
    }
  }
  function selectFilterTableHome(includeUserFilters = true) {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function() {
      return normalizeProcessoAtribuicaoText(this);
    }).get();
    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function() {
      return normalizeProcessoAtribuicaoText(this);
    }).get();
    users = typeof users !== "undefined" && users !== null ? uniqPro(users) : [];
    var tipos = tableProc.find('a[href*="acao=procedimento_trabalhar"]').map(function() {
      var tipoNomeProc = extractGroupTableTooltipToArray($(this).attr("onmouseover"));
      tipoNomeProc = tipoNomeProc ? tipoNomeProc[1] : false;
      if (tipoNomeProc) {
        return tipoNomeProc;
      }
    }).get();
    tipos = typeof tipos !== "undefined" && tipos !== null ? uniqPro(tipos) : [];
    var marcadores = tableProc.find('a[href*="acao=andamento_marcador_gerenciar"]').map(function() {
      var tipoNomeTag = extractGroupTableTooltipToArray($(this).attr("onmouseover"));
      tipoNomeTag = tipoNomeTag ? tipoNomeTag[1] : false;
      if (tipoNomeTag) {
        return tipoNomeTag;
      }
    }).get();
    marcadores = typeof marcadores !== "undefined" && marcadores !== null ? uniqPro(marcadores) : [];
    var html = homeFilterSelectHtml() + '   <option value="" data-type="clean">&nbsp;</option>   <option value="all" data-type="clean">Todos os processos</option>   <option value="(N\xE3o visualizado)" data-type="proc">Processos n\xE3o visualizados</option>';
    if (includeUserFilters && users.length > 0) {
      html += '   <optgroup label="Por atribui\xE7\xE3o">       <option value="" data-type="user">Processos sem atribui\xE7\xE3o</option>';
      $.each(users, function(i2, v) {
        html += '       <option value="' + v + '" data-type="user">Atribu\xEDdos \xE0 ' + v + "</option>";
      });
      html += "   </optgroup>";
    }
    if (tipos.length > 0) {
      html += '   <optgroup label="Por tipo de processo">';
      $.each(tipos, function(i2, v) {
        html += '       <option value="' + v + '" data-type="proc">' + v + "</option>";
      });
      html += "   </optgroup>";
    }
    if (marcadores.length > 0) {
      html += '   <optgroup label="Por marcadores">';
      html += '       <option value="null" data-type="tag">Sem marcador</option>';
      $.each(marcadores, function(i2, v) {
        html += '       <option value="' + v + '" data-type="tag">' + v + "</option>";
      });
      html += "   </optgroup>";
    }
    html += "</select>";
    return html;
  }
  function getAssignmentFilterOptionsHome() {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var users = tableProc.find('a[href*="acao=procedimento_atribuicao_listar"]').map(function() {
      return normalizeProcessoAtribuicaoText(this);
    }).get();
    users = typeof users !== "undefined" && users !== null ? uniqPro(users.filter(function(user) {
      return user !== "";
    })) : [];
    return users;
  }
  function selectAssignmentFilterHome() {
    var users = getAssignmentFilterOptionsHome();
    var html = assignmentFilterSelectHtml() + '   <option value="">&nbsp;</option>   <option value="">Todos os processos</option>   <option value="__unassigned__">Processos sem atribui\xE7\xE3o</option>';
    $.each(users, function(i2, v) {
      html += '   <option value="' + v + '">Atribu\xEDdos \xE0 ' + v + "</option>";
    });
    html += "</select>";
    return html;
  }
  function getProcessoAtribuicaoValue(row) {
    var link = row.find('a[href*="acao=procedimento_atribuicao_listar"]').first();
    if (link.length === 0) {
      return "";
    }
    return normalizeProcessoAtribuicaoText(link);
  }
  function updateVisibleHeadersForAssignmentFilter(table) {
    var currentHeader = null;
    var hasVisibleRows = false;
    table.find("tbody tr").each(function() {
      var row = $(this);
      if (row.hasClass("tableHeader") || row.hasClass("tagintable")) {
        if (currentHeader !== null) {
          currentHeader.toggle(hasVisibleRows);
        }
        currentHeader = row;
        hasVisibleRows = false;
        return;
      }
      if (currentHeader !== null && row.is(":visible")) {
        hasVisibleRows = true;
      }
    });
    if (currentHeader !== null) {
      currentHeader.toggle(hasVisibleRows);
    }
  }
  function applyAssignmentFilterHomeFallback(value) {
    var filterValue = value || "";
    var tables = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    tables.each(function() {
      var table = $(this);
      table.find("tbody tr").not(".tableHeader").not(".tagintable").not(".infraCaption").each(function() {
        var row = $(this);
        var assignedTo = getProcessoAtribuicaoValue(row);
        var show = true;
        if (filterValue === "__unassigned__") {
          show = assignedTo === "";
        } else if (filterValue !== "") {
          show = assignedTo === filterValue;
        }
        row.toggle(show);
      });
      updateVisibleHeadersForAssignmentFilter(table);
    });
  }
  function getFilterAssignmentTableHome(this_) {
    var value = $(this_).val() || "";
    sessionStorageStorePro("filterAssignmentTableHome", value);
    if (typeof tableHomePro !== "undefined" && tableHomePro.length > 0 && typeof $.tablesorter !== "undefined") {
      $.each(tableHomePro, function(i2) {
        var tableElement = tableHomePro[i2][0];
        var filters = $.tablesorter.storage(tableElement, "tablesorter-filters") || [];
        filters[3] = value === "__unassigned__" ? '""' : value !== "" ? "(" + value + ")" : "";
        $.tablesorter.setFilters(tableElement, filters, true);
      });
    } else {
      applyAssignmentFilterHomeFallback(value);
    }
  }
  function restoreAssignmentFilterHome() {
    var target = $("#filterAssignmentTableHome");
    if (target.length === 0) {
      return;
    }
    var savedValue = sessionStorageRestorePro("filterAssignmentTableHome");
    if (typeof savedValue === "undefined" || savedValue === null) {
      savedValue = "";
    }
    target.val(savedValue);
    if (verifyConfigValue("substituiselecao")) {
      target.trigger("chosen:updated");
    }
    getFilterAssignmentTableHome(target);
  }

  // src/features/lista-processos/atividades-bridge.js
  function atividadesApi() {
    var root = typeof parent !== "undefined" && parent.SeiPro ? parent.SeiPro : typeof SeiPro !== "undefined" ? SeiPro : null;
    var feature = root && root.features && root.features.atividades;
    return feature && feature.api || null;
  }
  function callAtividades(name) {
    var api = atividadesApi();
    var fn = api && api.commands && typeof api.commands[name] === "function" ? api.commands[name] : api && api.queries && typeof api.queries[name] === "function" ? api.queries[name] : api && api.handlers && typeof api.handlers[name] === "function" ? api.handlers[name] : null;
    if (typeof fn !== "function") return void 0;
    var args = Array.prototype.slice.call(arguments, 1);
    return fn.apply(null, args);
  }

  // src/features/lista-processos/pagination-tabs.js
  function initDadosProcesso(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof getParamsUrlPro !== "undefined" && typeof getDadosIframeProcessoPro === "function") {
      var id_procedimento = getParamsUrlPro(window.location.href).id_procedimento;
      id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro($("#ifrArvore").attr("src")).id_procedimento : id_procedimento;
      id_procedimento = typeof id_procedimento === "undefined" ? getParamsUrlPro(window.location.href).id_protocolo : id_procedimento;
      if (typeof id_procedimento !== "undefined" && id_procedimento !== "") {
        getDadosIframeProcessoPro(id_procedimento, "processo");
        return;
      } else {
        setTimeout(function() {
          initDadosProcesso(TimeOut2 - 100);
          if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initDadosProcesso");
        }, 500);
      }
    }
  }
  function getProcessosPaginacao(this_, index, tipo) {
    var form = $("#frmProcedimentoControlar");
    var href = form.attr("action");
    var param = {};
    form.find("input[type=hidden]").map(function() {
      if ($(this).attr("name") && $(this).attr("id").indexOf("hdn") !== -1) {
        param[$(this).attr("name")] = $(this).val();
      }
    });
    param["hdn" + tipo + "PaginaAtual"] = index;
    $.ajax({
      method: "POST",
      data: param,
      url: href
    }).done(function(html) {
      let $html = $(html);
      var tr = $html.find("#tblProcessos" + tipo + " tbody").find("tr.infraTrClara");
      if (tr.length > 0) {
        tr.each(function(index2) {
          $(this).find("input.infraCheckbox").attr("disabled", true).closest("td").attr("onmouseout", "return infraTooltipOcultar()").attr("onmouseover", `return infraTooltipMostrar('Desative a op\xE7\xE3o "Remover pagina\xE7\xE3o de processos" nas configura\xE7\xF0es do ` + NAMESPACE_SPRO + " para utilizar esta sele\xE7\xE3o')");
          $("#tblProcessos" + tipo).append($(this)[0].outerHTML);
        });
        var NroItens = $html.find("#hdn" + tipo + "NroItens").val();
        var NroItens_ = $("#hdn" + tipo + "NroItens");
        var totalItens = $("#tblProcessos" + tipo).find("tbody tr.infraTrClara").filter(function() {
          return $(this).find('a[href*="acao=procedimento_trabalhar"]').length > 0;
        }).length;
        NroItens_.val(totalItens);
        $("#tblProcessos" + tipo).find("caption.infraCaption").html("<span " + actionTest + ">" + totalItens + " registros:</span>");
        var Itens = $html.find("#hdn" + tipo + "Itens").val();
        var Itens_ = $("#hdn" + tipo + "Itens");
        var ItensHash = $html.find("#hdn" + tipo + "ItensHash").val();
        var ItensHash_ = $("#hdn" + tipo + "ItensHash");
        getProcessosPaginacao(this_, index + 1, tipo);
        if (checkConfigValue("gerenciarmonitorados")) appendStarOnProcess();
        initControlePrazo(true);
        initViewEspecifacaoProcesso();
        addAcompanhamentoEspIcon();
      } else {
        param["hdn" + tipo + "PaginaAtual"] = 0;
        $.ajax({ method: "POST", data: param, url: href });
        initUpdateGroupTable(this_);
      }
    });
  }
  function checkProcessoPaginacao(this_, tipo) {
    var pgnAtual = $("#hdn" + tipo + "PaginaAtual");
    if (parseInt(pgnAtual.val()) > 0) {
      pgnAtual.val(0);
      $("#frmProcedimentoControlar").submit();
    } else {
      getProcessosPaginacao(this_, 1, tipo);
      $("#div" + tipo + " .infraAreaPaginacao").find("a, select").hide();
    }
  }
  function initProcessoPaginacao(this_) {
    if ($(".infraAreaPaginacao a").is(":visible")) {
      if ($("#divRecebidosAreaPaginacaoSuperior a").is(":visible")) {
        checkProcessoPaginacao(this_, "Recebidos");
      }
      if ($("#divGeradosAreaPaginacaoSuperior a").is(":visible")) {
        checkProcessoPaginacao(this_, "Gerados");
      }
    } else {
      initUpdateGroupTable(this_);
    }
  }
  function initNewTabProcesso(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof verifyConfigValue !== "undefined") {
      getNewTabProcesso();
    } else {
      setTimeout(function() {
        initNewTabProcesso(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initNewTabProcesso");
      }, 500);
    }
  }
  function getNewTabProcesso() {
    var iconLabel = localStorage.getItem("iconLabel");
    var iconBoxSlim = localStorage.getItem("seiSlim");
    var observerTableControle = new MutationObserver(function(mutations) {
      var _this = $(mutations[0].target);
      var _parent = _this.closest("table");
      if (_parent.find("tr.infraTrMarcada").length > 0) {
        $(`${divComandos}${infraBarraComandos}`).find(".iconPro_Observe").removeClass("botaoSEI_hide");
        removeDuplicateValue("#hdnRecebidosItensSelecionados");
        removeDuplicateValue("#hdnGeradosItensSelecionados");
      } else {
        $(`${divComandos}${infraBarraComandos}`).find(".iconPro_Observe").addClass("botaoSEI_hide");
      }
    });
    setTimeout(function() {
      $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("tbody tr").each(function() {
        observerTableControle.observe(this, {
          attributes: true
        });
      });
      htmlBtnAtiv = parent.checkConfigValue("gerenciaratividades") && localStorage.getItem("configBasePro_atividades") !== null && callAtividades("checkCapacidade", "save_atividade") && typeof __ !== "undefined" ? '<a tabindex="451" class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " iconBoxAtividade seipro-atividades-icon-box " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconAtividade_save" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('` + __.Nova_Demanda + `')"`) + ' data-act="atividades-call" data-fn="saveAtividade" data-pass-el="0" style="position: relative; margin-left: -3px;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="' + __.Nova_Demanda + '">    <span class="botaoSEI_iconBox">       <i class="fad fa-user-check" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">' + __.Nova_Demanda + "</span>" : "") + "</a>" : "";
      var htmlBtnTypes = checkConfigValue("gerenciarprazos") ? '<a class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconPrazo_new" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Alterar informa\xE7\xF5es do processso')"`) + ' onclick="dialogChangeTypeProc()" style="position: relative; margin-left: -3px;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Alterar informa\xE7\xF5es do processso">    <span class="botaoSEI_iconBox">       <i class="fad fa-info-circle" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">Alterar informa\xE7\xF5es do processso</span>' : "") + "</a>" : "";
      var htmlBtnUpload = checkConfigValue("uploaddocsexternos") ? '<a class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconUpload_new" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Enviar documentos em processos')"`) + ' onclick="initUploadFilesInProcess()" style="position: relative; margin-left: -3px;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Enviar documentos em processos">    <span class="botaoSEI_iconBox">       <i class="fad fa-file-upload" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">Enviar documentos em processos</span>' : "") + "</a>" : "";
      var htmlBtnPrazo = checkConfigValue("gerenciarprazos") ? '<a class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconPrazo_new" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Adicionar prazo')"`) + ' data-seipro-add-prazo-all="1" style="position: relative; margin-left: -3px; cursor: pointer;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Adicionar prazo">    <span class="botaoSEI_iconBox">       <i class="fad fa-clock" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">Adicionar prazo</span>' : "") + "</a>" : "";
      var htmlBtnNaoLido = checkConfigValue("marcar_naolido") ? '<a class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconNaoLido" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Marcar como n\xE3o visualizado')"`) + ' data-act="nao-lido-marcar" style="position: relative; margin-left: -3px; cursor: pointer;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Marcar como n\xE3o visualizado">    <span class="botaoSEI_iconBox">       <i class="fad fa-eye-slash" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">Marcar como n\xE3o visualizado</span>' : "") + "</a>" : "";
      htmlBtn = '<a tabindex="451" class="botaoSEI botaoSEI_hide ' + (iconLabel ? "iconLabel" : "") + " " + (iconBoxSlim ? "iconBoxSlim" : "") + ' iconPro_Observe iconPro_newtab" ' + (iconLabel ? "" : `onmouseout="return infraTooltipOcultar();" onmouseover="return infraTooltipMostrar('Abrir Processos em Nova Aba')"`) + ' onclick="openListNewTab(this)" style="position: relative; margin-left: -3px;">    <img class="infraCorBarraSistema" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" title="Abrir Processos em Nova Aba">    <span class="botaoSEI_iconBox">       <i class="fad fa-external-link-alt" style="font-size: 17pt; color: #fff;"></i>    </span>' + (iconLabel ? '    <span class="newIconTitle">Abrir Processos em Nova Aba</span>' : "") + "</a>" + htmlBtnAtiv + htmlBtnPrazo + htmlBtnTypes + htmlBtnUpload + htmlBtnNaoLido;
      $(`${divComandos}${infraBarraComandos}`).each(function() {
        var _this = $(this);
        _this.find(".iconPro_Observe").remove();
        _this.append(htmlBtn);
      });
    }, 500);
  }
  function openListNewTab(this_) {
    var listNewTag = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find(elemCheckbox + ":checked").map(function() {
      return $(this).val();
    }).get();
    if (listNewTag.length > 0) {
      $.each(listNewTag, function(index, value) {
        var url = url_host + "?acao=procedimento_trabalhar&id_procedimento=" + value;
        var win = window.open(url, "_blank");
        if (win) {
          win.focus();
        } else {
          console.log("Por favor, permita popups para essa p\xE1gina");
        }
      });
    }
  }
  function dialogChangeTypeProc(this_) {
    initListTypesSEI(function() {
      var htmlOption = $.map(arrayListTypesSEI.selectTipoProc, function(v) {
        return '<option value="' + v.value + '">' + v.name + "</option>";
      });
      $("#dialogBoxTipoProc").html(htmlOption);
      initChosenReplace("box_reload", $("#dialogBoxTipoProc")[0], true);
    });
    var htmlBox = '<div class="dialogBoxDiv seiProForm">   <table style="font-size: 10pt;width: 100%;">      <tr style="height: 40px;">          <td class="label" style="vertical-align: bottom;">               <i class="iconPopup fas fa-inbox azulColor"></i> <span>Tipo de procedimento</span>          </td>          <td>               <select id="dialogBoxTipoProc" style="font-size: 10pt; width: 100%;">                   <option value="0">Carregando lista...</option>               </select>           </td>      </tr>   </table></div>';
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html(htmlBox).dialog({
      title: "Alterar informa\xE7\xF5es do processso",
      width: 600,
      buttons: [{
        text: "Alterar",
        class: "confirm",
        click: function() {
          changeTypeProc();
        }
      }]
    });
  }
  function changeTypeProc(this_) {
    var idTypeProc = $("#dialogBoxTipoProc").val();
    var txtTypeProc = $("#dialogBoxTipoProc").find("option:selected").text();
    getChangeTypeProc(idTypeProc, txtTypeProc);
    loadingButtonConfirm(true);
  }
  function getChangeTypeProc(idTypeProc, txtTypeProc) {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var listProcs = tableProc.find(elemCheckbox + ":checked").map(function() {
      return $(this).val();
    }).get();
    if (listProcs.length > 0) {
      var id_protocolo = listProcs[0];
      var tr = tableProc.find("tr#P" + id_protocolo);
      var td = tr.find("td.tagintable").eq(1);
      td.find(".sucessEdit").remove();
      td.html(txtTypeProc + '<i class="fas fa-check azulColor sucessEdit" style="margin-left:10px;"></i>');
      updateDadosArvore("Consultar/Alterar Processo", "selTipoProcedimento", idTypeProc, id_protocolo, function() {
        td.find(".sucessEdit").remove();
        td.append('<i class="fas fa-check-double azulColor sucessEdit" style="margin-left:10px;"></i>');
        setTimeout(function() {
          td.find(".sucessEdit").remove();
        }, 2e3);
        setTimeout(function() {
          tr.find(elemCheckbox + ":checked").trigger("click");
          var alink = tr.find('a[href*="controlador.php?acao=procedimento_trabalhar"]');
          var txttooltip = alink.attr("onmouseover");
          var tooltip = extractTooltipToArray(txttooltip);
          alink.attr("onmouseover", txttooltip.replace(tooltip[1], txtTypeProc));
          getChangeTypeProc(idTypeProc, txtTypeProc);
        }, 500);
      });
    } else {
      resetDialogBoxPro("dialogBoxPro");
      alertaBoxPro("Sucess", "check-circle", "Informa\xE7\xF5es editadas com sucesso!");
    }
  }

  // src/features/lista-processos/panels-csv.js
  function checkLoadConfigSheets(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof checkConfigValue !== "undefined") {
      if (checkConfigValue("gerenciarformularios") && typeof spreadsheetIdFormularios_Pro !== "undefined" && spreadsheetIdFormularios_Pro !== false && spreadsheetIdFormularios_Pro !== "undefined" || checkConfigValue("sincronizarprocessos") && typeof spreadsheetIdSyncProcessos_Pro !== "undefined" && spreadsheetIdSyncProcessos_Pro !== false && spreadsheetIdSyncProcessos_Pro !== "undefined") {
        handleClientLoadPro();
      }
    } else {
      setTimeout(function() {
        checkLoadConfigSheets(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload checkLoadConfigSheets");
      }, 500);
    }
  }
  function orderDivPanel(html, idOrder, name) {
    if (typeof getParamsUrlPro(window.location.href).acao_pro === "undefined") {
      if ($(".panelHomePro").length > 0) {
        $(".panelHomePro").each(function() {
          var id = parseInt($(this).data("order"));
          if (id > idOrder) {
            $(html).insertBefore($(this));
            return false;
          }
        });
        if ($("#" + name).length == 0) {
          $("#panelHomePro").append(html);
        }
      } else {
        $("#panelHomePro").append(html);
      }
    }
  }
  function insertDivPanelControleProc() {
    var elementControleProc = SeiPro.sei.adapter.isNewSEI() ? "collapseTabelaProcesso" : "frmProcedimentoControlar";
    var statusView = getOptionsPro(elementControleProc) == "hide" ? "none" : "initial";
    var statusIconShow = getOptionsPro(elementControleProc) == "hide" ? "" : "display:none;";
    var statusIconHide = getOptionsPro(elementControleProc) == "hide" ? "display:none;" : "";
    var idControleProc = SeiPro.sei.adapter.isNewSEI() ? "." + elementControleProc : "#" + elementControleProc;
    var idOrder = getOptionsPro("orderPanelHome") && typeof jmespath !== "undefined" && jmespath.search(getOptionsPro("orderPanelHome"), "[?name=='processosSEIPro'].index | length(@)") > 0 ? jmespath.search(getOptionsPro("orderPanelHome"), "[?name=='processosSEIPro'].index | [0]") : "";
    var htmlIconTable = '<i class="controleProcPro ' + (localStorage.getItem("seiSlim") ? "fad fa-folders" : "fas fa-folder-open") + ' cinzaColor" style="margin: 0 10px 0 0; font-size: 1.1em;"></i>';
    var htmlToggleTable = '<a class="controleProcPro newLink" id="' + elementControleProc + `_showIcon" onclick="toggleTablePro('` + idControleProc + `','show')" onmouseover="return infraTooltipMostrar('Mostrar Tabela');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; ` + statusIconShow + '"><i class="fas fa-plus-square cinzaColor"></i></a><a class="controleProcPro newLink" id="' + elementControleProc + `_hideIcon" onclick="toggleTablePro('` + idControleProc + `','hide')" onmouseover="return infraTooltipMostrar('Recolher Tabela');" onmouseout="return infraTooltipOcultar();" style="font-size: 11pt; ` + statusIconHide + '"><i class="fas fa-minus-square cinzaColor"></i></a>';
    var htmlDivPanel = '<div class="controleProcPro panelHomePro" style="display: inline-block; width: 100%;" id="processosSEIPro" data-order="' + idOrder + '"></div>';
    if (SeiPro.sei.adapter.isNewSEI()) $("#divFiltro, #collapseControle, #newFiltro, #divTabelaProcesso").addClass("collapseTabelaProcesso");
    if ($(".controleProcPro").length == 0) {
      $("#divInfraBarraLocalizacao").css("width", "100%").addClass("titlePanelHome").append(htmlToggleTable).prepend(htmlIconTable);
      $(idControleProc).css("width", "100%");
      if (!SeiPro.sei.adapter.isNewSEI()) $(idControleProc).css("display", statusView);
      $("#panelHomePro").prepend(htmlDivPanel);
      $("#frmProcedimentoControlar").moveTo("#processosSEIPro");
      $("#divInfraBarraLocalizacao").moveTo("#processosSEIPro");
      if (SeiPro.sei.adapter.isNewSEI() && getOptionsPro(elementControleProc) == "hide") $(idControleProc).addClass("displayNone");
      if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === "undefined" || storeGroupTablePro() == "")) removeAllTags(false, 3);
    }
  }
  function insertDivPanel() {
    if ($("#panelHomePro").length == 0 && $("#tblMarcadores").length == 0) {
      $("#frmProcedimentoControlar").after('<div id="panelHomePro" style="display: inline-block; width: 100%;"></div>');
      initSortDivPanel();
    }
  }
  function initSortDivPanel(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof $("#panelHomePro").sortable !== "undefined" && typeof getOptionsPro !== "undefined" && typeof setSortDivPanel !== "undefined" && typeof $().moveTo !== "undefined") {
      if ($("#tblMarcadores").length == 0) {
        insertDivPanelControleProc();
        setSortDivPanel();
        if (!checkLoadedTableSorter() && (typeof storeGroupTablePro() === "undefined" || storeGroupTablePro() == "")) removeAllTags(true, 4);
      }
    } else {
      setTimeout(function() {
        initSortDivPanel(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initSortDivPanel => " + TimeOut2);
        if (TimeOut2 == 9e3 && typeof fnJqueryPro !== "undefined") fnJqueryPro();
      }, 500);
    }
  }
  function getTableProcessosCSV() {
    var htmlTable = "<table>   <thead>       <tr>           <th>ID</th>           <th>Protocolo</th>           <th>Link_Permanente</th>           <th>Atribuicao</th>           <th>Etiqueta</th>           <th>Etiqueta_Descricao</th>           <th>Anotacao</th>           <th>Anotacao_Responsavel</th>           <th>Ponto_Controle</th>           <th>Especificacao</th>           <th>Tipo</th>           <th>Data_Autuacao</th>           <th>Data_Autuacao_Descricao</th>           <th>Data_Recebimento</th>           <th>Data_Recebimento_Descricao</th>           <th>Data_Envio</th>           <th>Data_Envio_Descricao</th>           <th>Unidade_Envio</th>           <th>Documento_Incluido</th>           <th>Observacoes</th>           <th>Acompanhamento_Especial</th>       </tr>   </thead>   <tbody>";
    var table = $("#tblProcessosGerados").is(":visible") ? $("#tblProcessosRecebidos, #tblProcessosGerados") : $("#tblProcessosRecebidos");
    var tableSelect = table.find("tbody tr.infraTrMarcada").length > 0 ? table.find("tbody tr.infraTrMarcada") : table.find("tbody tr.infraTrClara");
    tableSelect.each(function() {
      var td = $(this).find("td");
      var id_protocolo = $(this).attr("id").replace("P", "");
      var etiqueta = td.eq(1).find('a[href*="andamento_marcador_gerenciar"]').attr("onmouseover");
      var etiqueta_array = typeof etiqueta !== "undefined" && etiqueta != "" ? extractAllTextBetweenQuotes(etiqueta) : false;
      var anotacao = td.eq(1).find('a[href*="anotacao_registrar"]').attr("onmouseover");
      var doc_incluido = td.eq(1).find('img[src*="exclamacao.png"]').length > 0 ? "Um novo documento foi incluido ou assinado" : "";
      var anotacao_array = typeof anotacao !== "undefined" && anotacao != "" ? extractAllTextBetweenQuotes(anotacao) : false;
      var pontocontrole = td.eq(1).find('a[href*="andamento_situacao_gerenciar"]').attr("onmouseover");
      var pontocontrole_array = typeof pontocontrole !== "undefined" && pontocontrole != "" ? extractAllTextBetweenQuotes(pontocontrole) : false;
      var processo = td.eq(2).find('a[href*="procedimento_trabalhar"]');
      var descricao = processo.attr("onmouseover");
      var descricao_array = typeof descricao !== "undefined" && descricao != "" ? extractAllTextBetweenQuotes(descricao) : false;
      var nr_processo = processo.text().trim();
      var url_processo = processo.attr("href");
      var atribuicao = td.eq(3).find('a[href*="procedimento_atribuicao_listar"]').text().trim();
      var info_array = getArrayProcessoRecebido(url_processo);
      var data_visita = typeof info_array.datetime !== "undefined" && info_array.datetime != "" ? moment(info_array.datetime, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "-";
      var data_geracao = typeof info_array.datageracao !== "undefined" && info_array.datageracao != "" ? moment(info_array.datageracao, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "-";
      var desc_geracao = typeof info_array.descricaodatageracao !== "undefined" ? info_array.descricaodatageracao.replaceAll(";", "") : "-";
      var data_recebimento = typeof info_array.datahora !== "undefined" && info_array.datahora != "" ? moment(info_array.datahora, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "-";
      var desc_recebimento = typeof info_array.descricao !== "undefined" ? info_array.descricao.replaceAll(";", "") : "-";
      var data_envio = typeof info_array.datesend !== "undefined" && info_array.datesend != "" ? moment(info_array.datesend, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss") : "-";
      var desc_envio = typeof info_array.descricaosend !== "undefined" ? info_array.descricaosend.replaceAll(";", "") : "-";
      var unidade_envio = typeof info_array.unidadesend !== "undefined" ? info_array.unidadesend : "-";
      var observacoes = typeof info_array.observacoes !== "undefined" && info_array.observacoes != "" ? $.map(info_array.observacoes, function(v) {
        if (v.unidade != "") return v.unidade + ": " + v.observacao;
      }) : "-";
      var acompanhamento_especial = typeof info_array.acompanhamentoesp !== "undefined" ? info_array.acompanhamentoesp : "-";
      htmlTable += "       <tr>           <td>" + id_protocolo + "</td>           <td>" + nr_processo + "</td>           <td>" + url_host + "?acao=procedimento_trabalhar&id_procedimento=" + id_protocolo + "</td>           <td>" + (atribuicao != "" ? atribuicao : "-") + "</td>           <td>" + (etiqueta_array && etiqueta_array[1] != "" ? etiqueta_array[1].replaceAll(";", "") : "-") + "</td>           <td>" + (etiqueta_array && etiqueta_array[0] != "" ? etiqueta_array[0].replaceAll(";", "") : "-") + "</td>           <td>" + (anotacao_array && anotacao_array[0] != "" ? anotacao_array[0].replaceAll(";", "") : "-") + "</td>           <td>" + (anotacao_array && anotacao_array[1] != "" ? anotacao_array[1].replaceAll(";", "") : "-") + "</td>           <td>" + (pontocontrole_array && pontocontrole_array[1] != "" ? pontocontrole_array[0].replaceAll(";", "") : "-") + "</td>           <td>" + (descricao_array && descricao_array[0] != "" ? descricao_array[0].replaceAll(";", "") : "-") + "</td>           <td>" + (descricao_array && descricao_array[1] != "" ? descricao_array[1].replaceAll(";", "") : "-") + "</td>           <td>" + data_geracao + "</td>           <td>" + desc_geracao + "</td>           <td>" + data_recebimento + "</td>           <td>" + desc_recebimento + "</td>           <td>" + data_envio + "</td>           <td>" + desc_envio + "</td>           <td>" + unidade_envio + "</td>           <td>" + doc_incluido + "</td>           <td>" + observacoes + "</td>           <td>" + acompanhamento_especial + "</td>       </tr>";
    });
    htmlTable += "       </tbody></table>";
    downloadTableCSV($(htmlTable), "ListaProcessos_SEIPro");
  }
  function copyTableResultProtocoloSEI() {
    var htmlTable = $(".tableResultProtocoloSEI")[0].outerHTML;
    copyToClipboardHTML(htmlTable);
  }
  function downloadTableResultProtocoloSEI() {
    downloadTableCSV($(".tableResultProtocoloSEI"), "PesquisaProtocolo_SEIPro");
  }
  function initFilterTableProcessos(this_, TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (checkLoadedTableSorter()) {
      filterTableProcessos(this_);
    } else {
      if (TimeOut2 == 9e3) removeAllTags(false, 5);
      setTimeout(function() {
        initFilterTableProcessos(this_, TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initFilterTableProcessos");
      }, 1500);
    }
  }
  function filterTableProcessos(this_) {
    var _this = $(this_);
    var _parent = _this.closest("thead");
    var table = _this.closest("table");
    var filter = _parent.find(".tablesorter-filter-row");
    if (_this.hasClass("newLink_active")) {
      filter.addClass("hideme");
      _this.removeClass("newLink_active");
      table.trigger("filterReset");
    } else {
      filter.removeClass("hideme").find("input:visible").eq(1).focus();
      _this.addClass("newLink_active");
    }
  }

  // src/features/lista-processos/table-sorter-home.js
  function initTableSorterHome(TimeOut2 = 1e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof corrigeTableSEI !== "undefined" && typeof checkConfigValue !== "undefined" && typeof $().tablesorter !== "undefined" && $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("tbody tr").length > 0) {
      if (checkConfigValue("ordernartabela") && $("#frmPesquisaProtocolo").length == 0) {
        setTableSorterHome();
      }
    } else {
      setTimeout(function() {
        if (typeof $().tablesorter === "undefined" && TimeOut2 == 1e3) {
          $.getScript(parent.URL_SPRO + "js/lib/jquery.tablesorter.combined.min.js");
        }
        initTableSorterHome(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initTableSorterHome");
      }, 500);
    }
  }
  function setTableSorterHome() {
    var observerFilterHome = new MutationObserver(function(mutations) {
      var _this = $(mutations[0].target);
      var _parent = _this.closest("table");
      var iconFilter = _parent.find(".filterTableProcessos");
      var checkIconFilter = iconFilter.hasClass("newLink_active");
      var hideme = _this.hasClass("hideme");
      if (hideme && checkIconFilter) {
        iconFilter.removeClass("newLink_active");
      }
    });
    var tableSorterHome = $("#tblProcessosGerados, #tblProcessosRecebidos, #tblProcessosDetalhado");
    if (tableSorterHome.length > 0) {
      window.tableHomePro = [];
      setSortLocaleCompare();
      tableSorterHome.each(function(i2) {
        if (!$(this).hasClass("infraTableOrdenacao")) {
          $(this).find("thead tr.tablesorter-filter-row").remove();
          corrigeTableSEI(this);
          if (SeiPro.sei.adapter.isNewSEI()) {
            $(this).find("thead [colspan]").each(function() {
              var _this2 = $(this);
              var colspan = parseInt(_this2.attr("colspan"));
              if (colspan > 1) {
                _this2.removeAttr("colspan");
                for (var i3 = 1; i3 < colspan; i3++) {
                  _this2.after(_this2.clone().text(""));
                }
              }
            });
            var theadCols = $(this).find("thead tr:first th, thead tr:first td").length;
            var tbodyCols = $(this).find("tbody tr:not(.tableHeader):first td").length;
            var theadRow = $(this).find("thead tr:first");
            for (var j = theadCols; j < tbodyCols; j++) {
              theadRow.append("<th></th>");
            }
            $("#ancLiberarMeusProcessos").click(function(e) {
              e.preventDefault();
              var hdn = document.getElementById("hdnMeusProcessos");
              var form = document.getElementById("frmProcedimentoControlar");
              if (hdn && form) {
                hdn.value = "T";
                form.submit();
              }
            });
          }
          var elemID = $(this).attr("id");
          var _this = $("#" + $(this).attr("id"));
          var sortListArray = typeof sortListSaved !== "undefined" && sortListSaved && typeof sortListSaved[elemID] !== "undefined" ? sortListSaved[elemID].sortList : [];
          var configSorter = {
            textExtraction: {
              1: function(elem, table, cellIndex) {
                var text_return = "";
                if ($(elem).find("img").length > 0) {
                  $(elem).find("img").each(function() {
                    var type_img = $(this).attr("src").indexOf("anotacao") != -1 ? "Nota:" : "";
                    type_img = $(this).attr("src").indexOf("marcador") != -1 ? "Marcador:" : type_img;
                    var prioridade = $(this).attr("src").indexOf("prioridade") != -1 ? "1" : "2";
                    var texttip = $(this).closest("a").attr("onmouseover");
                    texttip = typeof texttip !== "undefined" ? texttip : $(this).attr("onmouseover");
                    texttip = typeof texttip !== "undefined" ? extractTooltip(texttip) : "";
                    text_return += prioridade + " " + type_img + " " + texttip;
                  });
                }
                text_return = text_return == "" ? "3" : text_return.replace(/  /g, " ");
                return text_return;
              },
              2: function(elem, table, cellIndex) {
                var processo = $(elem).find("a").eq(0);
                var nrProc = processo.text().trim();
                var texttip = processo.attr("onmouseover");
                texttip = typeof texttip !== "undefined" ? extractTooltip(texttip) : "";
                var urgente = texttip != "" && texttip.toLowerCase().indexOf("(urgente)") !== -1 ? "0 " : "";
                var prescricao = $(elem).find(".progressPrescricao").attr("aria-percent");
                prescricao = typeof prescricao !== "undefined" ? " " + prescricao + " " : " 0 ";
                return urgente + prescricao + nrProc + " " + texttip;
              },
              4: function(elem, table, cellIndex) {
                var target = $(elem).find(".dateboxDisplay").eq(0);
                var text_date = typeof target !== "undefined" && target.length > 0 ? target.data("time-sorter") : $(elem).text().trim();
                return text_date;
              }
            },
            widgets: ["saveSort", "filter"],
            widgetOptions: {
              saveSort: true,
              // filter_external: '#txtPesquisaRapida',
              filter_hideFilters: true,
              filter_columnFilters: true,
              filter_saveFilters: true,
              filter_hideEmpty: true,
              filter_excludeFilter: {}
            },
            sortList: sortListArray,
            sortReset: true,
            ignoreCase: true,
            sortLocaleCompare: true,
            headers: {
              0: { sorter: false, filter: false },
              1: { sorter: true, filter: true },
              2: { sorter: true, filter: true },
              3: { sorter: true, filter: true },
              4: { sorter: true, filter: true },
              4: { sorter: true, filter: true }
            }
          };
          _this.find("thead th:eq(0)").data("sorter", false);
          var tableHomeThis = _this.tablesorter(configSorter).on("sortEnd", function(event, data) {
            checkboxRangerSelectShift();
          }).on("filterEnd", function(event, data) {
            checkboxRangerSelectShift();
            updateHomeFilterCaption($(this));
            $(this).find("tbody > tr:visible > td > input").prop("disabled", false);
            $(this).find("tbody > tr:hidden > td > input").prop("disabled", true);
          });
          tableHomeThis.find("caption").each(function() {
            $(this).data("seiProCaptionBase", $(this).text());
          });
          tableHomePro.push(tableHomeThis);
          var _tableId = _this.attr("id") || "tblProcessos";
          _this.find(".tablesorter-filter-row input.tablesorter-filter").each(function() {
            $(this).attr("name", _tableId + "_filter_col" + ($(this).attr("data-column") || "0"));
          });
          var filter = _this.find(".tablesorter-filter-row").get(0);
          if (typeof filter !== "undefined") {
            setTimeout(function() {
              var htmlFilter = '<a class="newLink filterTableProcessos ' + (_this.find("tr.tablesorter-filter-row").hasClass("hideme") ? "" : "newLink_active") + `" onclick="initFilterTableProcessos(this)" onmouseover="return infraTooltipMostrar('Pesquisar na tabela');" onmouseout="return infraTooltipOcultar();" style="left: 0; top: -20px; position: absolute;">   <i class="fas fa-search cinzaColor" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></a>`;
              _this.find("thead .filterTableProcessos").remove();
              _this.find("thead").prepend(htmlFilter);
              observerFilterHome.observe(filter, {
                attributes: true
              });
              tableSorterHome.find('.tablesorter-filter-row input.tablesorter-filter[aria-label*="Prazos"]').attr("type", "date");
            });
          }
        }
      });
      if (tableSorterHome.find("tbody tr td:nth-child(2)").find("img").length > 0) {
        tableSorterHome.find("thead tr:first th:nth-child(2)").css("width", "150px");
      }
      setTimeout(function() {
        if ($(".filterTableProcessos").length == 0) {
          setTimeout(function() {
            if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload tableHomeDestroy *****");
            tableHomeDestroy(true);
          }, 1e3);
        }
        var filterStore = typeof tableHomePro[0] !== "undefined" && typeof tableHomePro[0][0] !== "undefined" ? $.tablesorter.storage(tableHomePro[0][0], "tablesorter-filters") : [];
        if (typeof filterStore !== "undefined" && filterStore !== null && filterStore.length > 0) {
          var filterUser = filterStore[3];
          filterUser = typeof filterUser !== "undefined" && filterUser !== null ? filterUser.replace("(", "").replace(")", "") : false;
          filterUser = filterUser === '""' ? "__unassigned__" : filterUser;
          if (filterUser) {
            if ($("#filterAssignmentTableHome").length > 0) {
              $("#filterAssignmentTableHome").val(filterUser).trigger("chosen:updated");
            } else {
              $("#filterTableHome").val(filterUser).trigger("chosen:updated");
            }
          } else if ($("#filterAssignmentTableHome").length > 0) {
            $("#filterAssignmentTableHome").val("").trigger("chosen:updated");
          } else {
            $("#filterTableHome").val("").trigger("chosen:updated");
          }
        }
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("mostraranotacaocontrole")) {
          if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle && SeiPro.features.anotacaoControle.api) SeiPro.features.anotacaoControle.api.render();
        }
      }, 1e3);
    }
  }
  function tableHomeDestroy(reload = false, tableHomeTimeout = 3e3) {
    if (tableHomePro.length > 0) {
      $.each(tableHomePro, function(i2) {
        tableHomePro[i2].trigger("destroy");
      });
      $(".filterTableProcessos").remove();
      window.tableHomePro = [];
      if (reload && tableHomeTimeout > 0) {
        initTableSorterHome();
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initTableSorterHome => " + tableHomeTimeout);
        setTimeout(function() {
          forceTableHomeDestroy(tableHomeTimeout - 500);
        }, 1e3);
      }
    } else {
      initTableSorterHome();
    }
  }
  function forceTableHomeDestroy(Timeout = 3e3) {
    if (Timeout <= 0) {
      return;
    }
    var force = false;
    $.each(tableHomePro, function(i2) {
      var filter = $.tablesorter.storage(tableHomePro[i2][0], "tablesorter-filters");
      var rowFilter = $(tableHomePro[i2][0]).find("tr.tablesorter-filter-row").hasClass("hideme");
      force = typeof filter !== "undefined" && filter !== null && filter.length > 0 && rowFilter ? true : force;
    });
    if (force && Timeout > 0 && $("#tblProcessosGerados").is(":visible")) {
      tableHomeDestroy(true, Timeout - 1e3);
      if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload forceTableHomeDestroy => " + TimeOut);
    }
  }
  function forceOnLoadBody() {
  }
  function observeAreaTela(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof setResizeAreaTelaD !== "undefined") {
      new ResizeObserver(setResizeAreaTelaD).observe(divInfraAreaTelaD);
    } else {
      setTimeout(function() {
        observeAreaTela(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload observeAreaTela");
      }, 500);
    }
  }
  function initFullnameAtribuicao(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof checkConfigValue !== "undefined") {
      if (verifyConfigValue("nomesusuarios")) {
        fullnameAtribuicao();
      }
    } else {
      setTimeout(function() {
        initFullnameAtribuicao(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initFullnameAtribuicao");
      }, 500);
    }
  }
  function initViewEspecifacaoProcesso(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof checkConfigValue !== "undefined") {
      if (verifyConfigValue("especificaprocesso")) {
        viewEspecifacaoProcesso();
      }
    } else {
      setTimeout(function() {
        initViewEspecifacaoProcesso(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initViewEspecifacaoProcesso");
      }, 500);
    }
  }
  function initFaviconNrProcesso(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof Favico !== "undefined" && typeof checkConfigValue !== "undefined") {
      if (checkConfigValue("contadoricone")) {
        getFaviconNrProcesso();
      }
    } else {
      setTimeout(function() {
        initFaviconNrProcesso(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initFaviconNrProcesso");
      }, 500);
    }
  }
  function initReloadModalLink(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof reloadModalLink !== "undefined") {
      reloadModalLink();
    } else {
      setTimeout(function() {
        initReloadModalLink(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initReloadModalLink");
      }, 500);
    }
  }
  function initReplaceNewIcons(TimeOut2 = 9e3) {
    if (typeof isNewSEI !== "undefined" && SeiPro.sei.adapter.isNewSEI()) $(divComandos + " a").addClass("botaoSEI");
    if (localStorage.getItem("seiSlim") === null || (TimeOut2 <= 0 || parent.window.name != "")) {
      return;
    }
    if (typeof replaceNewIcons === "function") {
      replaceNewIcons($(`${infraBarraComandos} a.botaoSEI`));
    } else {
      setTimeout(function() {
        initReplaceNewIcons(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initReplaceNewIcons => " + TimeOut2);
      }, 500);
    }
  }
  function initObserveUrlChange(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0 || parent.window.name != "") {
      return;
    }
    if (typeof parent.verifyConfigValue === "function") {
      setObserveUrlChange();
    } else {
      setTimeout(function() {
        initObserveUrlChange(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initObserveUrlChange => " + TimeOut2);
      }, 500);
    }
  }
  function setObserveUrlChange() {
    if (parent.verifyConfigValue("urlamigavel")) {
      $(window).bind("hashchange", function() {
        var ifrArvore = $("#ifrArvore").contents();
        var sourceLink = ifrArvore.find(".infraArvoreNoSelecionado").eq(0).closest(`a[target="${ifrVisualizacao_}"]`);
        var nrSEI = typeof sourceLink !== "undefined" && sourceLink !== null ? getNrSei(sourceLink.text().trim()) : false;
        nrSEI = nrSEI == "" ? false : nrSEI;
        var nrSEI_URL = window.location.hash.indexOf("@") !== -1 ? window.location.hash.replace("#", "").split("@")[1] : false;
        nrSEI_URL = nrSEI_URL == "" ? false : nrSEI_URL;
        var idSource = iHistoryArray.length > 0 ? jmespath.search(iHistoryArray, "[?sei=='@" + nrSEI + "'] | [0].id") : null;
        idSource = idSource === null ? false : idSource;
        var idTarget = iHistoryArray.length > 0 ? jmespath.search(iHistoryArray, "[?sei=='@" + nrSEI_URL + "'] | [0].id") : null;
        idTarget = idTarget === null ? false : idTarget;
        if (nrSEI_URL && nrSEI_URL && nrSEI != nrSEI_URL && !delayCrash) {
          delayCrash = true;
          setTimeout(function() {
            delayCrash = false;
          }, 300);
          sourceLink.closest(".infraArvore").find(".infraArvoreNoSelecionado").removeClass("infraArvoreNoSelecionado");
          var targetLink = ifrArvore.find('a[target="ifrVisualizacao"]:contains("' + nrSEI_URL + '")');
          var pastaArvore = targetLink.closest(".infraArvore");
          targetLink.unbind("click").trigger("click");
          if (idSource && idTarget && idSource > idTarget) {
            window.history.back(-1);
          } else {
            window.history.go(1);
          }
          setClickUrlAmigavel();
          if (!pastaArvore.is(":visible")) {
            var pastaID = pastaArvore.attr("id").replace("div", "");
            ifrArvore.find("#ancjoin" + pastaID).trigger("click");
          }
        }
      });
    }
  }

  // src/features/lista-processos/panel-kanban-chrome.js
  function loadKanbanStylePro() {
    var base = typeof URL_SPRO !== "undefined" ? URL_SPRO : "";
    if (!base || typeof loadStylePro !== "function") return;
    loadStylePro(base + "css/jkanban.min.css");
  }
  function selectPanelKanbanHome() {
    var type = storeGroupTablePro();
    type = !type || type == "all" || type == "" ? false : true;
    var html = '<div id="processosProActions" class="panelHome panelHomeProcessos" style="' + (type ? "display: inline-block;" : "display:none;") + ' vertical-align: middle; margin-left: 10px; width: auto;">    <div class="btn-group processosBtnPanel" role="group" style="margin-right: 10px;">       <button type="button" data-act="panel-proc" data-value="Tabela" class="btn btn-sm btn-light ' + (getOptionsPro("panelProcessosView") == "Tabela" || !getOptionsPro("panelProcessosView") ? "active" : "") + '"><i class="fas fa-table" style="color: #888;"></i> <span class="text">Tabela</span></button>       <button type="button" data-act="panel-proc" data-act-dbl="panel-proc-refresh" title="D\xEA um duplo clique para atualizar o quadro" data-value="Quadro" class="btn btn-sm btn-light ' + (getOptionsPro("panelProcessosView") == "Quadro" ? "active" : "") + '"><i class="fas fa-project-diagram" style="color: #888;"></i> <span class="text">Quadro</span></button>    </div></div>';
    return html;
  }
  function removeDataPanelProc(_this) {
    removeOptionsPro("listaMarcadores");
    removeOptionsPro("arrayListUsersSEI");
    getPanelProc(_this);
  }
  function getPanelProc(this_) {
    var data = $(this_).data();
    var mode = data.value;
    $(this_).closest("#processosProActions").find(".btn.active").removeClass("active");
    $(this_).addClass("active");
    if (mode == "Quadro") {
      var type = storeGroupTablePro();
      if (!type || type == "all" || type == "") {
        var selectGroupTablePro = $("#selectGroupTablePro");
        selectGroupTablePro.val("tags").trigger("change");
        if (verifyConfigValue("substituiselecao")) {
          selectGroupTablePro.chosen("destroy").chosen({
            placeholder_text_single: " ",
            no_results_text: "Nenhum resultado encontrado",
            normalize_search_text: function(text) {
              return removeAcentos(text.toLowerCase());
            }
          }).trigger("chosen:updated");
        }
        setTimeout(function() {
          initAddKanbanProc();
        }, 500);
      } else {
        initAddKanbanProc();
      }
    } else {
      $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").show();
      $("#processosKanban").remove();
      initTableTag(storeGroupTablePro());
    }
    setOptionsPro("panelProcessosView", mode);
  }
  function installPanelProcDelegation(root) {
    var target = root || document;
    if (target.__seiproPanelProcBound) return;
    target.__seiproPanelProcBound = true;
    target.addEventListener("click", function(ev) {
      var el = ev.target && ev.target.closest && ev.target.closest('[data-act="panel-proc"]');
      if (!el || !target.contains(el)) return;
      ev.preventDefault();
      getPanelProc(el);
    });
    target.addEventListener("dblclick", function(ev) {
      var el = ev.target && ev.target.closest && ev.target.closest('[data-act-dbl="panel-proc-refresh"]');
      if (!el || !target.contains(el)) return;
      ev.preventDefault();
      removeDataPanelProc(el);
    });
  }
  installPanelProcDelegation(document);
  function initAddKanbanProc(type = storeGroupTablePro(), loop = 3, TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    loadKanbanStylePro();
    if (typeof jKanban !== "undefined") {
      addKanbanProc(type, loop);
    } else {
      loadKanbanStylePro();
      if (typeof jKanban === "undefined") $.getScript(URL_SPRO + "js/lib/jkanban.min.js");
      setTimeout(function() {
        initAddKanbanProc(type, loop, TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initAddKanbanProc");
      }, 500);
    }
  }

  // src/features/lista-processos/marcadores-distrib.js
  function addAcompanhamentoEspIcon() {
    var storeRecebimento = typeof localStorageRestorePro !== "undefined" && typeof localStorageRestorePro("configDataRecebimentoPro") !== "undefined" && !$.isEmptyObject(localStorageRestorePro("configDataRecebimentoPro")) ? localStorageRestorePro("configDataRecebimentoPro") : [];
    var array_procedimentos = [];
    $(".acompanhamentoesp_icon").remove();
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("a.processoVisualizado").each(function(i2) {
      var acompanhamentoesp = getArrayProcessoRecebido($(this).attr("href")).acompanhamentoesp;
      acompanhamentoesp = typeof acompanhamentoesp !== "undefined" && acompanhamentoesp !== null && acompanhamentoesp != "" ? acompanhamentoesp : false;
      if (acompanhamentoesp) {
        $(this).closest("tr").find("td").eq(1).append(`<a class="acompanhamentoesp_icon" onmouseover="return infraTooltipMostrar('Acompanhamento Especial','` + acompanhamentoesp + `');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-eye azulColor"><i></a>`);
      }
    });
  }
  function getListaMarcadores(html) {
    var indexSelected = 0;
    var selectTags = html.find("#selMarcador").find("option").map(function(i2, v) {
      if ($(this).is(":selected")) indexSelected = i2 - 1;
      if ($(this).text().trim() != "") {
        return { name: $(this).text().trim(), value: $(this).val(), img: $(this).attr("data-imagesrc") };
      }
    }).get();
    if (selectTags.length > 0) {
      setOptionsPro("listaMarcadores", selectTags);
      setOptionsPro("listaMarcadores_unidade", $("#selInfraUnidades").val());
    }
    return { array: selectTags, indexSelected };
  }
  function configDatesSwitchChangeHome(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".ui-dialog");
    if (_this.is(":checked")) {
      _parent.find(".configDates_duesetdate .label i").attr("class", "iconPopup fas fa-clock azulColor");
      _parent.find(".configDates_duesetdate .label span").text("Data de vencimento");
      _parent.find(".configDates_duesetdate .input span").show();
      _this.closest("tr").find(".iconSwitch").addClass("azulColor");
    } else {
      _parent.find(".configDates_duesetdate .label i").attr("class", "iconPopup far fa-clock azulColor");
      _parent.find(".configDates_duesetdate .label span").text("Data inicial");
      _parent.find(".configDates_duesetdate .input span").hide();
      _this.closest("tr").find(".iconSwitch").removeClass("azulColor");
    }
  }
  function getMapaControleProcesso() {
    return $("#tblProcessosRecebidos").find("tbody tr").not(".tableHeader").not(".infraCaption").map(function() {
      let _this = $(this);
      let _td = _this.find("td");
      let id_procedimento = _this.attr("id");
      id_procedimento = typeof id_procedimento !== "undefined" ? parseInt(id_procedimento.replace("P", "")) : false;
      let protocolo = _td.eq(2).text();
      let link_atribuicao = _td.eq(3).find('a[href*="controlador.php?acao=procedimento_atribuicao_listar"]');
      let nome_atribuicao = typeof getAtribuicaoDisplayLabel === "function" ? getAtribuicaoDisplayLabel(link_atribuicao.attr("title"), link_atribuicao.text(), true) : link_atribuicao.attr("title");
      nome_atribuicao = typeof nome_atribuicao !== "undefined" ? nome_atribuicao : false;
      let usuario_atribuicao = link_atribuicao.text().trim();
      let descricao = _td.eq(4).text();
      let tipo_processo = _td.eq(5).text();
      let _return = {
        id_procedimento,
        protocolo,
        atribuicao: nome_atribuicao ? { nome: nome_atribuicao, usuario: usuario_atribuicao } : false,
        descricao,
        tipo_processo
      };
      return _return;
    }).get();
  }
  function updateCountIconDist() {
    var counter = $("#distribAutTablePro").find('input[type="checkbox"]:checked').length;
    if (counter > 0) {
      $(".iconConfig_distrib").find(".fa-layers-counter").text(counter).show();
    } else {
      $(".iconConfig_distrib").find(".fa-layers-counter").hide();
    }
  }
  var txtPadrao_getList = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var listTxtPadrao = $(htmlTxtPadrao).find("#divInfraAreaTabela table.infraTable tr").map(function() {
      var td = $(this).find("td");
      var link = td.eq(4).find("a");
      var id = td.eq(1).text();
      var name = td.eq(2).text();
      var description = td.eq(3).text();
      if (name) {
        return {
          id,
          name,
          description,
          view: link.eq(0).attr("href"),
          edit: link.eq(1).attr("href")
        };
      }
    }).get();
    return listTxtPadrao;
  };
  var txtPadrao_newLink = async () => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlNew = $(htmlTxtPadrao).find("#btnNovo").attr("onclick");
    urlNew = typeof urlNew !== "undefined" && urlNew.indexOf("'") !== -1 ? urlNew.split("'")[1] : false;
    return urlNew;
  };
  var txtPadrao_getConfig = async (idTxt) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlView = $(htmlTxtPadrao).find(".infraAreaTabela tr").map(function() {
      if ($(this).find("td").eq(2).text() == "[_" + idTxt + "]") return $(this).find('a[href*="acao=texto_padrao_interno_consultar"]').attr("href");
    }).get();
    urlView = typeof urlView !== "undefined" && urlView !== null && urlView.length ? urlView[0] : false;
    if (urlView) {
      var htmlTxtPadrao = await $.get(urlView);
      var conteudoTxtPadrao = $(htmlTxtPadrao).find("#txaConteudo").val();
      conteudoTxtPadrao = typeof conteudoTxtPadrao !== "undefined" && conteudoTxtPadrao !== null && conteudoTxtPadrao.trim() != "" ? $(conteudoTxtPadrao).text() : false;
      conteudoTxtPadrao = conteudoTxtPadrao && isJson(conteudoTxtPadrao) ? JSON.parse(conteudoTxtPadrao) : false;
      conteudoTxtPadrao = conteudoTxtPadrao && $.isArray(conteudoTxtPadrao) ? conteudoTxtPadrao : false;
      return conteudoTxtPadrao;
    } else {
      return false;
    }
    ;
  };
  var txtPadrao_setConfig = async (data) => {
    var htmlTxtPadrao = await $.get(urlTxtPadrao);
    var urlEdit = $(htmlTxtPadrao).find(".infraAreaTabela tr").map(function() {
      if ($(this).find("td").eq(2).text() == "[_" + data.nome + "]") return $(this).find('a[href*="acao=texto_padrao_interno_alterar"]').attr("href");
    }).get();
    urlEdit = typeof urlEdit !== "undefined" && urlEdit !== null && urlEdit.length ? urlEdit[0] : false;
    var urlPage = urlEdit ? urlEdit : await txtPadrao_newLink();
    var htmlLink = await $.get(urlPage);
    var form = $(htmlLink).find("#frmTextoPadraoInternoCadastro");
    var urlForm = form.attr("action");
    var createConfig = await txtPadrao_createConfig(form, urlForm, data);
    return createConfig;
  };
  var txtPadrao_createConfig = async (form, urlForm, data) => {
    let params = {};
    form.find("input[type=hidden]").each(function() {
      if ($(this).attr("name") && $(this).attr("id").includes("hdn")) {
        params[$(this).attr("name")] = $(this).val();
      }
    });
    form.find("input[type=text]").each(function() {
      if ($(this).attr("id") && $(this).attr("id").includes("txt")) {
        params[$(this).attr("id")] = $(this).val();
      }
    });
    params.txtNome = "[_" + data.nome + "]";
    params.txtDescricao = data.descricao;
    params.txaConteudo = "<p>" + JSON.stringify(data.conteudo) + "</p>";
    params.sbmCadastrarTextoPadraoInterno = "Salvar";
    params.sbmAlterarTextoPadraoInterno = "Salvar";
    var postData = "";
    for (var k in params) {
      if (postData !== "") postData = postData + "&";
      var valor = k == "txtDescricao" || k == "txaConteudo" ? escapeComponent(params[k]) : params[k];
      postData = postData + k + "=" + valor;
    }
    var htmlTxtPadraoCreated = await $.ajax({
      method: "POST",
      url: urlForm,
      data: postData,
      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1"
    });
    return htmlTxtPadraoCreated;
  };
  var getTableDistribAutomatica = async () => {
    var dadosDistribuicao = await txtPadrao_getConfig("DISTRIBUICAO_AUTOMATICA_SEIPRO");
    window.dadosDistribuicaoAut = dadosDistribuicao;
    var htmlBox = `<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;">               <a class="newLink iconConfig_distrib" onclick="getAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar('Atribuir processos');" onmouseout="return infraTooltipOcultar();" style="margin: 0px; font-size: 14pt;">                   <span class="fa-layers fa-fw">                       <i class="fas fa-user-friends"></i>                       <span class="fa-layers-counter" style="display:none"></span>                   </span>                   <span style="font-size: 80%;">Atribuir Processos</span>               </a>               <a class="newLink iconConfig_distrib" onclick="setAtribuicaoAutomatica(this)" onmouseover="return infraTooltipMostrar('Configura\xE7\xF5es de atribui\xE7\xE3o');" onmouseout="return infraTooltipOcultar();" style="margin: 0px;font-size: 14pt;right: 280px;position: absolute;">                   <i class="fas fa-cog"></i>               </a>   <table id="distribAutTablePro" style="margin-top: 5px; font-size: 9pt !important;width: 100%;" class="seiProForm tableAtividades tableDialog tableInfo tableZebra">        <thead>            <tr class="tableHeader">                <th class="tituloControle " width="5%" align="center">                   <span class="lblInfraCheck" aria-hidden="true"></span>                   <a id="lnkInfraCheck" onclick="getSelectAllTr(this, 'SemGrupo');" onmouseover="updateTipSelectAll(this)" onmouseenter="return infraTooltipMostrar('Selecionar Todos')" onmouseout="return infraTooltipOcultar();">                       <img src="/infra_css/imagens/check.gif" id="imgRecebidosCheck" class="infraImg">                   </a>                </th>                <th class="tituloControle" style="text-align: center; width: 180px;">Processo</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Descri\xE7\xE3o</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Tipo</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Atualmente atribu\xEDdo</th>                <th class="tituloControle" style="text-align: center;font-weight: bold;">Nova atribui\xE7\xE3o</th>            </tr>        </thead>        <tbody>`;
    $.each(getMapaControleProcesso(), function(i2, v) {
      let distribuicao = dadosDistribuicaoAut ? dadosDistribuicaoAut.filter(function(p) {
        return p.tipo_processo == v.tipo_processo;
      }) : [];
      let nova_atribuicao = distribuicao.length ? distribuicao[0] : false;
      let atribuicao = v.atribuicao ? v.atribuicao.usuario : "";
      htmlBox += '   <tr style="text-align: left;" data-tagname="SemGrupo">       <td class="tituloControle" style="text-align:center;">           <input type="checkbox" onclick="updateCountIconDist()" id="chkDistrib_' + v.id_procedimento + '" ' + (nova_atribuicao && nova_atribuicao.atribuicao != atribuicao ? "checked" : "") + " " + (!nova_atribuicao ? "disabled" : "") + ' name="chkDistrib_' + v.id_procedimento + '" value="' + v.id_procedimento + '">       </td>       <td>           <a style="margin-left: 5px;" href="' + url_host + "?acao=procedimento_trabalhar&id_procedimento=" + v.id_procedimento + '" target="_blank">               <span class="bLink">                   ' + v.protocolo + '                   <i class="fas fa-external-link-alt bLink" style="font-size: 90%; text-decoration: underline;"></i>               </span>           </a>       </td>       <td>' + v.tipo_processo + "</div>       <td>" + v.descricao + "</div>       <td>" + atribuicao + "</td>       <td>" + (nova_atribuicao ? nova_atribuicao.atribuicao : "") + "</td>   </tr>";
    });
    htmlBox += "   </table></div>";
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Distribui\xE7\xE3o Autom\xE1tica de Processos",
      width: $("body").width() - 300,
      height: 450,
      open: function() {
        setTimeout(function() {
          var distribTable = $("#distribAutTablePro");
          distribTable.tablesorter({
            sortLocaleCompare: true,
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
              4: { filter: true },
              5: { filter: true }
            }
          }).on("filterEnd", function(event, data) {
            checkboxRangerSelectShift();
            var caption = $(this).find("caption").eq(0);
            var tx = caption.text();
            caption.text(tx.replace(/\d+/g, data.filteredRows));
            $(this).find("tbody > tr:visible > td > input").prop("disabled", false);
            $(this).find("tbody > tr:hidden > td > input").prop("disabled", true);
          });
          initPanelResize("#boxDistribAut", "distribPro");
          var filterDistrib = distribTable.find(".tablesorter-filter-row").get(0);
          if (typeof filterDistrib !== "undefined") {
            var observerFilterDistrib = new MutationObserver(function(mutations) {
              var _this = $(mutations[0].target);
              var _parent = _this.closest("table");
              var iconFilter = _parent.find(".filterTableDistrib button");
              var checkIconFilter = iconFilter.hasClass("active");
              var hideme = _this.hasClass("hideme");
              if (hideme && checkIconFilter) {
                iconFilter.removeClass("active");
              }
              updateCountIconDist();
            });
            setTimeout(function() {
              var htmlfilterDistrib = '<div class="btn-group filterTableDistrib" role="group" style="right: 45px;top: 18px;z-index: 999;position: absolute;">   <button type="button" onclick="downloadTablePro(this)" data-icon="fas fa-download" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Baixar" class="btn btn-sm btn-light">       <i class="fas fa-download" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Baixar</span>   </button>   <button type="button" onclick="copyTablePro(this)" data-icon="fas fa-copy" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Copiar" class="btn btn-sm btn-light">       <i class="fas fa-copy" style="padding-right: 3px; cursor: pointer; font-size: 10pt; color: #888;"></i>       <span class="text">Copiar</span>   </button>   <button type="button" onclick="filterTablePro(this)" style="padding: 0.1rem .5rem; font-size: 9pt;" data-value="Pesquisar" class="btn btn-sm btn-light ' + (distribTable.find("tr.tablesorter-filter-row").hasClass("hideme") ? "" : "active") + '">       <i class="fas fa-search" style="padding-right: 3px; cursor: pointer; font-size: 10pt;"></i>       Pesquisar   </button></div>';
              distribTable.find("thead .filterTableDistrib").remove();
              distribTable.find("thead").prepend(htmlfilterDistrib);
              observerFilterDistrib.observe(filterDistrib, {
                attributes: true
              });
              distribTable.find(".tablesorter-filter-row input.tablesorter-filter").eq(2).attr("type", "date");
              updateCountIconDist(filterDistrib);
            }, 500);
          }
        }, 500);
        if (typeof $().visible == "undefined") $.getScript(URL_SPRO + "js/lib/jquery-visible.min.js");
      },
      close: function() {
        $("#boxDistribAut").remove();
        resetDialogBoxPro("dialogBoxPro");
      }
    });
  };
  function setAtribuicaoAutomatica() {
    var htmlBox = '<div id="boxDistribAut" class="tabelaPanelScroll" style="margin-top: 10px;height: 400px;"></div>';
    resetDialogBoxPro("dialogBoxPro");
    dialogBoxPro = $("#dialogBoxPro").html('<div class="dialogBoxDiv">' + htmlBox + "</div>").dialog({
      title: "Distribui\xE7\xE3o Autom\xE1tica de Processos",
      width: $("body").width() - 300,
      height: 450,
      open: function() {
      },
      close: function() {
        $("#boxDistribAut").remove();
        resetDialogBoxPro("dialogBoxPro");
      }
    });
  }
  function getAllMarcadoresHome() {
    var arrayMarcadores = [];
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("tr").each(function() {
      var _processo = $(this).find('a[href*="acao=procedimento_trabalhar"]');
      var _marcador = $(this).find('a[href*="acao=andamento_marcador_gerenciar"]');
      if (_processo.length > 0 && _marcador.length > 0) {
        var _tags = typeof _marcador.attr("onmouseover") !== "undefined" ? _marcador.attr("onmouseover").match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g")) : false;
        var tagName = _tags && _tags !== null && _tags.length > 0 && _tags[2] != "" ? _tags[2] : false;
        var textName = _tags && _tags !== null && _tags.length > 0 && _tags[0] != "" ? _tags[0] : false;
        arrayMarcadores.push({
          id_procedimento: getParamsUrlPro(_processo.attr("href")).id_procedimento,
          icon: _marcador.find("img").attr("src"),
          style: _marcador.attr("style"),
          tag: tagName,
          name: textName
        });
      }
    });
    sessionStorageStorePro("dadosMarcadoresProcessoPro", arrayMarcadores);
  }
  function initAllMarcadoresHome(TimeOut2 = 9e3) {
    if (TimeOut2 <= 0) {
      return;
    }
    if (typeof getParamsUrlPro !== "undefined") {
      getAllMarcadoresHome();
    } else {
      setTimeout(function() {
        initAllMarcadoresHome(TimeOut2 - 100);
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initAllMarcadoresHome");
      }, 500);
    }
  }
  function initUrgentePro() {
    $("a div.urgentePro").remove();
    $('a[href*="controlador.php?acao=procedimento_trabalhar"][onmouseover*="(URGENTE)"]').prepend('<div class="urgentePro"></div>').addClass("urgentePro").closest("tr").addClass("urgentePro");
  }

  // src/shared/ui/file-queue.js
  function extensionAllowed(fileName, acceptCsv) {
    if (!acceptCsv) return true;
    const name = String(fileName || "").toLowerCase();
    const allowed = String(acceptCsv).split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    if (allowed.length === 0) return true;
    return allowed.some((ext) => ext.startsWith(".") ? name.endsWith(ext) : name.endsWith("." + ext));
  }
  function formatFileSize(bytes) {
    const n = Number(bytes) || 0;
    if (n < 1024) return n + " b";
    if (n < 1024 * 1024) return (n / 1024).toFixed(1) + " KiB";
    return (n / (1024 * 1024)).toFixed(1) + " MiB";
  }
  function uploadFormFile({
    url,
    file,
    fileName,
    paramName = "filArquivo",
    timeout = 9e5,
    onProgress,
    xhrFactory = () => new XMLHttpRequest()
  }) {
    return new Promise((resolve, reject) => {
      const xhr = xhrFactory();
      const form = new FormData();
      form.append(paramName, file, fileName || file.name);
      xhr.open("POST", url, true);
      xhr.timeout = timeout;
      xhr.withCredentials = true;
      if (xhr.upload && typeof onProgress === "function") {
        xhr.upload.onprogress = (event) => {
          if (!event.lengthComputable) return;
          onProgress(event.loaded / event.total, event);
        };
      }
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr);
        else reject({ xhr, message: "HTTP " + xhr.status });
      };
      xhr.onerror = () => reject({ xhr, message: "Network error" });
      xhr.ontimeout = () => reject({ xhr, message: "Timeout" });
      xhr.send(form);
    });
  }
  function toPublicFile(item) {
    const file = item.file;
    file.previewElement = item.previewElement;
    file.status = item.status;
    file.uploadName = item.uploadName;
    file.xhr = item.xhr;
    file._queueItem = item;
    return file;
  }
  function createFileQueue(opts = {}) {
    const items = [];
    const listeners = {};
    const options = {
      url: opts.url || "",
      params: opts.params || {},
      acceptedFiles: opts.accept || opts.acceptedFiles || null,
      paramName: opts.paramName || "filArquivo",
      timeout: opts.timeout || 9e5
    };
    const renameFile = typeof opts.renameFile === "function" ? opts.renameFile : (f) => f.name;
    const createPreview = typeof opts.createPreview === "function" ? opts.createPreview : null;
    const previewsContainer = typeof opts.previewsContainer === "string" ? typeof document !== "undefined" ? document.querySelector(opts.previewsContainer) : null : opts.previewsContainer || null;
    let clickableEl = null;
    let fileInput = null;
    let processing = false;
    let destroyed = false;
    function emit(event, ...args) {
      const list = listeners[event] || [];
      list.forEach((fn) => {
        try {
          fn(...args);
        } catch (_e) {
        }
      });
      const OPT_BY_EVENT = {
        addedfile: "onAddedFile",
        addedfiles: "onAddedFiles",
        removedfile: "onRemovedFile",
        success: "onSuccess",
        error: "onError"
      };
      const optName = OPT_BY_EVENT[event] || "on" + event.charAt(0).toUpperCase() + event.slice(1);
      if (typeof opts[optName] === "function") {
        try {
          opts[optName](...args);
        } catch (_e) {
        }
      }
    }
    function bindClickable() {
      const clickable = opts.clickable;
      if (!clickable || typeof document === "undefined") return;
      clickableEl = typeof clickable === "string" ? document.querySelector(clickable) : clickable;
      if (!clickableEl) return;
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true;
      fileInput.style.display = "none";
      if (options.acceptedFiles) fileInput.accept = options.acceptedFiles;
      (clickableEl.ownerDocument || document).body.appendChild(fileInput);
      clickableEl.addEventListener("click", onClickableClick);
      fileInput.addEventListener("change", onFileInputChange);
    }
    function onClickableClick(event) {
      event.preventDefault();
      if (fileInput) fileInput.click();
    }
    function onFileInputChange() {
      if (!fileInput || !fileInput.files) return;
      handleFiles(Array.from(fileInput.files));
      fileInput.value = "";
    }
    function setAcceptedFiles(csv) {
      options.acceptedFiles = csv || null;
      if (fileInput) fileInput.accept = options.acceptedFiles || "";
    }
    function addItem(file) {
      const uploadName = renameFile(file);
      const accepted = extensionAllowed(uploadName || file.name, options.acceptedFiles);
      const item = {
        file,
        uploadName,
        status: accepted ? "queued" : "rejected",
        previewElement: null,
        xhr: null,
        errorMessage: accepted ? "" : "Tipo de arquivo n\xE3o permitido"
      };
      if (createPreview) {
        item.previewElement = createPreview(item);
        if (item.previewElement && previewsContainer) {
          previewsContainer.appendChild(item.previewElement);
        }
        if (!accepted && item.previewElement) {
          item.previewElement.classList.add("dz-error", "seipro-file-error");
          const err = item.previewElement.querySelector("[data-seipro-file-error], .dz-error-message span");
          if (err) err.textContent = item.errorMessage;
        }
        const removeBtn = item.previewElement && item.previewElement.querySelector("[data-seipro-file-remove], [data-dz-remove]");
        if (removeBtn) {
          removeBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeItem(item);
          });
        }
      }
      items.push(item);
      emit("addedfile", toPublicFile(item));
      return item;
    }
    function removeItem(item) {
      const idx = items.indexOf(item);
      if (idx === -1) return;
      items.splice(idx, 1);
      if (item.previewElement && item.previewElement.parentNode) {
        item.previewElement.parentNode.removeChild(item.previewElement);
      }
      emit("removedfile", toPublicFile(item));
    }
    function handleFiles(fileList) {
      if (destroyed) return;
      const list = Array.from(fileList || []);
      const added = list.map(addItem);
      emit("addedfiles", added.map(toPublicFile));
      return added.map(toPublicFile);
    }
    function getQueuedFiles() {
      return items.filter((i2) => i2.status === "queued").map(toPublicFile);
    }
    function getAcceptedFiles() {
      return items.filter((i2) => i2.status === "success").map(toPublicFile);
    }
    function getRejectedFiles() {
      return items.filter((i2) => i2.status === "error" || i2.status === "rejected").map(toPublicFile);
    }
    function removeAllFiles() {
      [...items].forEach(removeItem);
    }
    function setProgress(item, ratio) {
      if (!item.previewElement) return;
      item.previewElement.classList.add("dz-processing", "seipro-file-processing");
      const bar = item.previewElement.querySelector(".dz-upload, [data-seipro-file-progress]");
      if (bar) bar.style.width = Math.round(ratio * 100) + "%";
    }
    function markError(item, message) {
      item.status = "error";
      item.errorMessage = message || "Erro no envio";
      if (item.previewElement) {
        item.previewElement.classList.add("dz-error", "seipro-file-error");
        item.previewElement.classList.remove("dz-processing", "seipro-file-processing");
        const err = item.previewElement.querySelector("[data-seipro-file-error], .dz-error-message span");
        if (err) err.textContent = item.errorMessage;
      }
    }
    function markSuccess(item) {
      item.status = "success";
      if (item.previewElement) {
        item.previewElement.classList.add("dz-success", "dz-complete", "seipro-file-success");
        item.previewElement.classList.remove("dz-processing", "seipro-file-processing");
        const bar = item.previewElement.querySelector(".dz-upload, [data-seipro-file-progress]");
        if (bar) bar.style.width = "100%";
      }
    }
    function processQueue() {
      if (destroyed || processing) return Promise.resolve();
      const next = items.find((i2) => i2.status === "queued");
      if (!next) return Promise.resolve();
      if (!options.url) {
        markError(next, "URL de upload n\xE3o configurada");
        emit("error", toPublicFile(next));
        if (typeof opts.onError === "function") opts.onError(toPublicFile(next), next.errorMessage);
        return Promise.resolve();
      }
      processing = true;
      next.status = "uploading";
      setProgress(next, 0);
      return uploadFormFile({
        url: options.url,
        file: next.file,
        fileName: next.uploadName,
        paramName: options.paramName,
        timeout: options.timeout,
        onProgress: (ratio) => setProgress(next, ratio),
        xhrFactory: opts.xhrFactory || (() => new XMLHttpRequest())
      }).then((xhr) => {
        next.xhr = xhr;
        markSuccess(next);
        const pub = toPublicFile(next);
        emit("success", pub);
      }).catch((err) => {
        next.xhr = err && err.xhr ? err.xhr : null;
        markError(next, err && err.message || "Erro no envio");
        emit("error", toPublicFile(next));
      }).finally(() => {
        processing = false;
      });
    }
    function destroy() {
      destroyed = true;
      if (clickableEl) clickableEl.removeEventListener("click", onClickableClick);
      if (fileInput && fileInput.parentNode) fileInput.parentNode.removeChild(fileInput);
      removeAllFiles();
      clickableEl = null;
      fileInput = null;
    }
    function on(event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return api;
    }
    const api = {
      files: items,
      options,
      handleFiles,
      addFile: (file) => toPublicFile(addItem(file)),
      getQueuedFiles,
      getAcceptedFiles,
      getRejectedFiles,
      removeAllFiles,
      processQueue,
      destroy,
      on,
      setAcceptedFiles,
      /** Reorder queue to match DOM order of preview elements. */
      reorderByPreview(orderedElements) {
        const map = new Map(items.map((i2) => [i2.previewElement, i2]));
        const next = [];
        orderedElements.forEach((el) => {
          const item = map.get(el);
          if (item) next.push(item);
        });
        items.forEach((i2) => {
          if (!next.includes(i2)) next.push(i2);
        });
        items.length = 0;
        next.forEach((i2) => items.push(i2));
      }
    };
    Object.defineProperty(api, "files", {
      get() {
        return items.map(toPublicFile);
      }
    });
    bindClickable();
    return api;
  }

  // src/shared/ui/sortable.js
  function insertionTarget(y, rows) {
    for (const row of rows) {
      const r = row.getBoundingClientRect();
      if (y < r.top + r.height / 2) return row;
    }
    return null;
  }
  function createSortable(container, opts = {}) {
    const itemsSel = opts.items || "tr";
    const handleSel = opts.handle || null;
    let dragged = null;
    function rows() {
      return Array.prototype.slice.call(container.querySelectorAll(itemsSel));
    }
    function onDown(e) {
      const handle = handleSel ? e.target.closest(handleSel) : e.target.closest(itemsSel);
      if (!handle) return;
      const row = handle.closest(itemsSel);
      if (!row || !container.contains(row)) return;
      dragged = row;
      row.classList.add("seipro-sorting");
      row.style.opacity = "0.5";
      try {
        handle.setPointerCapture(e.pointerId);
      } catch (_) {
      }
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp, { once: true });
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragged) return;
      const others = rows().filter((r) => r !== dragged);
      const before = insertionTarget(e.clientY, others);
      if (before) dragged.parentNode.insertBefore(dragged, before);
      else dragged.parentNode.appendChild(dragged);
    }
    function onUp(e) {
      if (!dragged) return;
      dragged.classList.remove("seipro-sorting");
      dragged.style.opacity = "";
      const handle = handleSel ? e.target.closest(handleSel) : dragged;
      if (handle) handle.removeEventListener("pointermove", onMove);
      dragged = null;
      if (typeof opts.onUpdate === "function") opts.onUpdate(rows());
    }
    container.addEventListener("pointerdown", onDown);
    return { destroy() {
      container.removeEventListener("pointerdown", onDown);
    } };
  }

  // src/features/arvore/domain.js
  function resolveDropzoneIcon(fileType, _isNewSEI) {
    const type = String(fileType || "");
    const gif = (name) => `/infra_css/imagens/${name}.gif`;
    let urlIcon = gif("pdf");
    if (type.indexOf("image/") !== -1) urlIcon = gif("imagem");
    else if (type.indexOf("video/") !== -1) urlIcon = gif("video");
    else if (type.indexOf("audio/") !== -1) urlIcon = gif("audio");
    else if (type.indexOf("application/zip") !== -1) urlIcon = gif("zip");
    else if (type.indexOf("text/htm") !== -1) urlIcon = gif("html");
    else if (type.indexOf("text/plain") !== -1) urlIcon = gif("txt");
    else if (type.indexOf("word") !== -1) urlIcon = gif("doc");
    else if (type.indexOf("officedocument.presentation") !== -1) urlIcon = gif("pps");
    else if (type.indexOf("text/csv") !== -1 || type.indexOf("sheet") !== -1) urlIcon = gif("xls");
    return urlIcon;
  }

  // src/features/arvore/templates.js
  function dropzoneInfoHoverHtml() {
    return '<div id="dz-infoupload" class="dz-infoupload seipro-arvore-dz-info" data-seipro-arvore-upload-overlay>   <span class="text">Arraste e solte aquivos aqui<br>ou clique para selecionar</span>   <span class="cancel seipro-arvore-dz-cancel" data-seipro-arvore-action="dropzone-cancel">       <i class="far fa-times-circle icon"></i>       <span class="label">CANCELAR</span>   </span></div>';
  }
  function uploadPreviewHomeHtml(opts = {}) {
    const ifrTarget = opts.ifrTarget || "ifrVisualizacao";
    const iconSrc = opts.iconSrc || "/infra_css/imagens/pdf.gif";
    const iconData = opts.iconData || "imagens/pdf.gif";
    const sizeLabel = formatFileSize(opts.size || 0);
    const name = opts.name || "";
    return '<div class="dz-preview dz-file-preview seipro-arvore-file-preview">   <div class="dz-details">       <span class="dz-error-mark"><i data-seipro-file-remove data-dz-remove class="fas fa-trash vermelhoColor" style="margin: 5px 8px;cursor: pointer; font-size: 10pt;"></i></span>       <span class="dz-error-message"><span data-seipro-file-error data-dz-errormessage></span></span>       <span class="dz-progress"><span class="dz-upload" data-seipro-file-progress data-dz-uploadprogress></span></span>       <a id="anchorImgID" data-img="' + iconData + '" style="margin-left: -4px;" class="clipboard">           <img class="dz-link-icon" src="' + iconSrc + '" align="absbottom" id="iconID">       </a>       <span class="dz-progress-mark"><i class="fas fa-cog fa-spin" style="color: #017FFF; font-size: 10pt;"></i></span>       <a id="anchorID" target="' + ifrTarget + '" class="dz-filename">           <span data-dz-name title="">' + name.replace(/</g, "&lt;") + '</span>       </a>       <span class="dz-size" data-dz-size>' + sizeLabel + '</span>       <span class="dz-remove" data-seipro-file-remove data-dz-remove><i class="fas fa-trash-alt vermelhoColor" style="cursor:pointer"></i></span>   </div></div>';
  }

  // src/features/lista-processos/upload-home.js
  function initUploadFilesInProcess() {
    setUploadFilesInProcess();
  }
  function getListIdProtocoloSelected() {
    var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
    var listId = tableProc.find(elemCheckbox + ":checked").map(function() {
      return $(this).val();
    }).get();
    if (listId.length === 0) {
      listId = tableProc.find("tr.infraTrMarcada").map(function() {
        var value = $(this).find(elemCheckbox).val();
        if (typeof value !== "undefined" && value !== null && value !== "") {
          return value;
        }
        return $(this).attr("id") ? $(this).attr("id").replace(/^P/, "") : false;
      }).get();
    }
    return listId.length > 0 ? listId : false;
  }
  function setUploadFilesInProcess(load_upload = true) {
    var listId = getListIdProtocoloSelected();
    if (listId.length > 0) {
      $("#frmCheckerProcessoPro").remove();
      loadIframeProcessUpload(listId[0], load_upload);
    }
  }
  function loadIframeProcessUpload(idProcedimento, load_upload = true) {
    if ($("#frmCheckerProcessoPro").length == 0) {
      getCheckerProcessoPro();
    }
    var url = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + idProcedimento;
    $(divComandos + " .iconUpload_new").addClass("iconLoading");
    $("#frmCheckerProcessoPro").attr("src", url).unbind().on("load", function() {
      var ifrArvore = $("#frmCheckerProcessoPro").contents().find("#ifrArvore");
      contentW = typeof getIframeArvoreWindow === "function" ? getIframeArvoreWindow() : typeof ifrArvore[0] !== "undefined" && ifrArvore[0] ? ifrArvore[0].contentWindow : null;
      $(divComandos + " .iconUpload_new").removeClass("iconLoading");
      if (load_upload) {
        getUploadFilesInProcess();
      } else {
        contentW.sendUploadArvore("upload", false, arvoreDropzone, $(containerUpload));
      }
    });
  }
  function completeIdProtocoloSelected() {
    var listId = getListIdProtocoloSelected();
    $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").find("tr#P" + listId[0]).find(elemCheckbox + ":checked").trigger("click");
  }
  function nextUploadFilesInProcess() {
    completeIdProtocoloSelected();
    if (getListIdProtocoloSelected()) {
      cleanUploadFilesInProcess();
      setUploadFilesInProcess(false);
    } else {
      removeUploadFilesInProcess();
      alertaBoxPro("Sucess", "check-circle", "Arquivos enviados com sucesso!");
    }
  }
  function removeUploadFilesInProcess() {
    $("#uploadListPro").remove();
    $(".dz-infoupload-home, [data-seipro-arvore-upload-overlay]").remove();
    var root = typeof containerUpload === "string" ? document.querySelector(containerUpload) : containerUpload;
    if (root && root.dataset) root.dataset.seiproUploadIndex = "0";
    if (typeof arvoreDropzone !== "undefined" && arvoreDropzone && typeof arvoreDropzone.destroy === "function") arvoreDropzone.destroy();
    arvoreDropzone = false;
  }
  function onClickRemoveDragHoverHome() {
    var root = document.querySelector(containerUpload) || document.body;
    function handler() {
      if (root.classList.contains("dz-drag-hover") || root.classList.contains("seipro-arvore-upload-hover")) {
        root.classList.remove("dz-drag-hover", "seipro-arvore-upload-hover");
        root.removeEventListener("click", handler);
      }
    }
    root.addEventListener("click", handler);
  }
  function cleanUploadFilesInProcess() {
    var list = document.getElementById("uploadListPro");
    if (list) list.innerHTML = "";
    var root = document.querySelector(containerUpload) || document.body;
    if (root && root.dataset) root.dataset.seiproUploadIndex = "0";
    if (arvoreDropzone && arvoreDropzone.files && arvoreDropzone.files.length) {
      var kept = arvoreDropzone.files.slice();
      arvoreDropzone.removeAllFiles();
      kept.forEach(function(f) {
        arvoreDropzone.addFile(f);
      });
    }
  }
  function getUploadFilesInProcess() {
    var root = document.querySelector(containerUpload) || document.body;
    var _containerUpload = $(containerUpload);
    if (!document.getElementById("uploadListPro")) {
      var list = document.createElement("div");
      list.id = "uploadListPro";
      var overlayWrap = document.createElement("div");
      overlayWrap.innerHTML = dropzoneInfoHoverHtml();
      var overlayEl = overlayWrap.firstElementChild;
      overlayEl.classList.add("dz-infoupload-home");
      var cancelBtn = overlayEl.querySelector('[data-seipro-arvore-action="dropzone-cancel"]');
      if (cancelBtn) {
        cancelBtn.addEventListener("click", function(event) {
          event.preventDefault();
          if (typeof dropzoneCancelInfo === "function") dropzoneCancelInfo(event);
          removeUploadFilesInProcess();
        });
      }
      var anchor = root.querySelector(divComandos);
      if (!anchor && _containerUpload.find(divComandos).length) anchor = _containerUpload.find(divComandos)[0];
      if (anchor && anchor.parentNode) {
        anchor.parentNode.insertBefore(list, anchor.nextSibling);
        anchor.parentNode.insertBefore(overlayEl, list.nextSibling);
      } else {
        root.appendChild(list);
        root.appendChild(overlayEl);
      }
      if (root.dataset) root.dataset.seiproUploadIndex = "0";
    }
    function createHomePreview(item) {
      var iconPath = resolveDropzoneIcon(item.file.type, SeiPro.sei.adapter.isNewSEI());
      var iconSrc = iconPath.indexOf("svg/") === 0 || iconPath.indexOf("imagens/") === 0 ? "/infra_css/" + iconPath.replace(/^\/infra_css\//, "") : iconPath.startsWith("/") ? iconPath : "/infra_css/" + iconPath;
      var wrap = document.createElement("div");
      wrap.innerHTML = uploadPreviewHomeHtml({
        newSEI: SeiPro.sei.adapter.isNewSEI(),
        ifrTarget: typeof ifrVisualizacao_ !== "undefined" ? ifrVisualizacao_ : "ifrVisualizacao",
        iconSrc,
        iconData: iconPath,
        size: item.file.size,
        name: item.uploadName || item.file.name
      });
      return wrap.firstElementChild;
    }
    arvoreDropzone = createFileQueue({
      previewsContainer: document.getElementById("uploadListPro"),
      clickable: "#dz-infoupload",
      paramName: "filArquivo",
      timeout: 9e5,
      renameFile: function(file) {
        var remove = typeof removeAcentos === "function" ? removeAcentos : function(s) {
          return s;
        };
        return remove(file.name).replace(/[&\/\\#+()$~%'":*?<>{}]/g, "_");
      },
      createPreview: createHomePreview,
      onAddedFiles: function() {
        if (typeof dropzoneCancelInfo === "function") dropzoneCancelInfo();
        if (verifyConfigValue("sortbeforeupload") && arvoreDropzone.getQueuedFiles().length > 1) {
          sortUploadArvore();
        } else {
          contentW.sendUploadArvore("upload", false, arvoreDropzone, _containerUpload);
        }
      },
      onSuccess: function(file) {
        var params = arvoreDropzone.options.params;
        var response = String(file.xhr.response || "").split("#");
        params.paramsForm.hdnAnexos = encodeUrlUploadArvore(response, params);
        var postData = "";
        for (var k in params.paramsForm) {
          if (postData !== "") postData = postData + "&";
          var valor = k == "hdnAnexos" ? params.paramsForm[k] : escapeComponent(params.paramsForm[k]);
          valor = k == "txtNumero" && typeof encodeURI_toHex === "function" ? encodeURI_toHex(String(params.paramsForm[k]).normalize("NFC")) : valor;
          postData = postData + k + "=" + valor;
        }
        params.paramsForm = postData;
        contentW.sendUploadArvore("save", params, arvoreDropzone, _containerUpload);
      },
      onError: function() {
        contentW.sendUploadArvore("upload", false, arvoreDropzone, _containerUpload);
      }
    });
    root.addEventListener("dragleave", function() {
      root.classList.add("dz-drag-hover", "seipro-arvore-upload-hover");
      onClickRemoveDragHoverHome();
    });
    var extUpload = localStorageRestorePro("arvoreDropzone_acceptedFiles");
    if (extUpload !== null && typeof arvoreDropzone.setAcceptedFiles === "function") {
      arvoreDropzone.setAcceptedFiles(extUpload);
    }
  }
  function sendUploadArvoreHomeStart() {
    contentW.sendUploadArvore("upload", false, arvoreDropzone, $(containerUpload));
  }
  function sortUploadArvore() {
    var htmlUpload = '<div id="divUploadDoc" class="panelDadosArvore seipro-arvore-upload-confirm" style="margin: 15px 0; padding: 1.2em 0 0 0 !important;">   <a style="cursor:pointer;" data-seipro-arvore-action="send-upload-home" class="newLink newLink_confirm">       <i class="fas fa-upload azulColor"></i>       <span style="font-size:1.2em;color: #fff;"> Enviar documentos</span>   </a></div>';
    var old = document.getElementById("divUploadDoc");
    if (old) old.remove();
    var list = document.getElementById("uploadListPro");
    if (!list) return;
    list.insertAdjacentHTML("afterend", htmlUpload);
    createSortable(list, {
      items: ".dz-file-preview",
      handle: ".dz-filename",
      onUpdate: function(ordered) {
        if (arvoreDropzone && typeof arvoreDropzone.reorderByPreview === "function") {
          arvoreDropzone.reorderByPreview(ordered);
        }
      }
    });
    var sendBtn = document.querySelector('[data-seipro-arvore-action="send-upload-home"]');
    if (sendBtn && !sendBtn.__bound) {
      sendBtn.__bound = true;
      sendBtn.addEventListener("click", function(e) {
        e.preventDefault();
        sendUploadArvoreHomeStart();
      });
    }
  }

  // src/features/lista-processos/boot.js
  function storeLinkUsuarioSistema() {
    if (typeof setOptionsPro !== "undefined") setOptionsPro("usuarioSistema", $("#lnkUsuarioSistema").attr("title"));
  }
  function storeVersionSEI() {
    if (typeof getSeiVersionPro !== "undefined" && getSeiVersionPro())
      getSeiVersionPro();
    else if (typeof setSeiVersionPro !== "undefined") setSeiVersionPro();
  }
  function initSeiPro() {
    if (typeof checkHostLimit !== "function") {
      setTimeout(function() {
        initSeiPro();
        if (typeof verifyConfigValue !== "undefined" && verifyConfigValue("debugpage")) console.log("Reload initSeiPro checkHostLimit");
      }, 300);
      return;
    }
    var listaEntryContext = getListaEntryContextLegacy();
    if (listaEntryContext && listaEntryContext.context === "lista-processos" || !listaEntryContext && $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").length > 0) {
      if (runListaProcessosViewLegacy()) {
      } else {
        bindProcessoPaginacaoSuperiorVisibility();
        if (typeof URL_SPRO !== "undefined" && typeof SimpleTableCellEdition === "undefined") $.getScript(URL_SPRO + "js/lib/jquery-table-edit.min.js");
        if (typeof URL_SPRO !== "undefined" && (typeof moment === "undefined" || typeof moment.duration === "undefined")) $.getScript(URL_SPRO + "js/lib/moment-duration-format.min.js");
        initTableSorterHome();
        insertGroupTable();
        replaceSelectAll();
        if (typeof initPanelMonitorados === "function") initPanelMonitorados();
        checkLoadConfigSheets();
        insertDivPanel();
        setTimeout(() => {
          initNewTabProcesso();
          syncHomeProcessCaption();
        }, 2e3);
        forceOnLoadBody();
        observeAreaTela();
        if (window.SeiPro && SeiPro.features && SeiPro.features.anotacaoControle && SeiPro.features.anotacaoControle.api) SeiPro.features.anotacaoControle.api.init();
        initReplaceNewIcons();
        initControlePrazo();
        initViewEspecifacaoProcesso();
        initFullnameAtribuicao();
        initFaviconNrProcesso();
        addAcompanhamentoEspIcon();
        initAllMarcadoresHome();
        initUrgentePro();
        initNaoVisualizadoPro();
        if (typeof initProcessNotificationsPro === "function") initProcessNotificationsPro();
        storeLinkUsuarioSistema();
        storeVersionSEI();
        if (sessionStorage.getItem("configHost_Pro") === null && typeof getConfigHost !== "undefined") getConfigHost();
      }
    } else if ($("#ifrArvore").length > 0) {
      if (!checkHostLimit()) initDadosProcesso();
      initObserveUrlChange();
      checkLoadConfigSheets();
    }
    initReloadModalLink();
    if (typeof initSmartSignatureSelectionPro === "function") initSmartSignatureSelectionPro();
    $("#ancLiberarMeusProcessos").click(function(e) {
      e.preventDefault();
      var hdn = document.getElementById("hdnMeusProcessos");
      var form = document.getElementById("frmProcedimentoControlar");
      if (hdn && form) {
        hdn.value = "T";
        form.submit();
      }
    });
  }

  // src/features/lista-processos/kanban-home.js
  function addKanbanProc(type = storeGroupTablePro(), loop = 3) {
    if (typeof jKanban === "undefined") {
      loadKanbanStylePro();
      $.getScript(URL_SPRO + "js/lib/jkanban.min.js");
    }
    if (!type || type == "all" || type == "") {
      setOptionsPro("panelProcessosView", "Tabela");
      var btnTabela = document.querySelector('#processosProActions .btn[data-value="Tabela"]');
      if (btnTabela) getPanelProc(btnTabela);
    } else {
      var tableProc = $("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado");
      if (type == "users") {
        if (getOptionsPro("arrayListUsersSEI") && getOptionsPro("arrayListUsersSEI").length > 0) {
          $('#processosProActions [data-value="Quadro"] i').attr("class", "fas fa-project-diagram");
          var itensKanban = $.map(getOptionsPro("arrayListUsersSEI"), function(v) {
            return typeof getAtribuicaoDisplayLabel === "function" ? getAtribuicaoDisplayLabel(v.name, v.name, checkConfigValue("nomesusuarios")) : v.name;
          });
          itensKanban.unshift("");
        } else if (loop > 0) {
          getAjaxListaAtribuicao();
          setTimeout(function() {
            initAddKanbanProc(type, loop - 1);
          }, 2e3);
          $('#processosProActions [data-value="Quadro"] i').attr("class", "fas fa-spinner fa-spin");
        }
      } else if (type == "tags") {
        if (getOptionsPro("listaMarcadores") && getOptionsPro("listaMarcadores").length > 0) {
          $('#processosProActions [data-value="Quadro"] i').attr("class", "fas fa-project-diagram");
          var itensKanban = $.map(getOptionsPro("listaMarcadores"), function(v) {
            return v.name;
          });
          itensKanban.unshift("");
        } else if (loop > 0) {
          getAjaxListaMarcador();
          setTimeout(function() {
            initAddKanbanProc(type, loop - 1);
          }, 2e3);
          $('#processosProActions [data-value="Quadro"] i').attr("class", "fas fa-spinner fa-spin");
        }
      } else {
        var itensKanban = getListTypes(type);
        $('#processosProActions [data-value="Quadro"] i').attr("class", "fas fa-project-diagram");
      }
      if (!!itensKanban && type != "") {
        itensKanban = $.map(itensKanban, function(v, i2) {
          return { order: i2, name: v, id: getTagName(v, type) };
        });
        var tr = tableProc.find("tr[data-tagname]:not(.tagintable)");
        var itens = tr.map(function() {
          var tagName = $(this).data("tagname");
          var idTag = "id_" + tagName;
          var itemBoard = $.grep(itensKanban, function(item) {
            return item.id == tagName;
          })[0];
          var nameLabel = itemBoard && itemBoard.name !== "" ? itemBoard.name : "Sem Grupo";
          var linkProc = $(this).find('a[href*="acao=procedimento_trabalhar"]');
          var tip = extractTooltipToArray(linkProc.attr("onmouseover"));
          tip = typeof tip !== "undefined" ? tip : false;
          var linkParams = getParamsUrlPro(linkProc.attr("href"));
          var id_protocolo = linkParams && typeof linkParams.id_procedimento !== "undefined" ? linkParams.id_procedimento : false;
          if (id_protocolo !== false && id_protocolo !== "false" && id_protocolo !== "" && id_protocolo !== null && typeof id_protocolo !== "undefined") {
            return {
              id: idTag,
              title: nameLabel,
              id_protocolo: String(id_protocolo),
              processo: linkProc.text(),
              especificacao: tip ? tip[0] : false,
              tipo: tip ? tip[1] : false,
              html_icons: $(this).find("td").eq(1).html(),
              html_proc: $(this).find("td").eq(2).html(),
              html_atribuicao: $(this).find("td").eq(3).html(),
              html_prazo: $(this).find("td.seipro-prazo-box-display").html(),
              color: $(this).data("color") ? $(this).css("color") : false
            };
          }
        }).get();
        $("#processosKanban").remove();
        $("#newFiltro").after('<div id="processosKanban" style="display: inline-block;margin-top: 60px;width: 100%;"></div>');
        var bords_list = $.map(itensKanban, function(v, i2) {
          var item = $.grep(itens, function(row) {
            return row.id == "id_" + v.id;
          });
          var title = v.name == "" ? "Sem Grupo" : v.name;
          title = (type == "arrivaldate" || type == "acessdate" || type == "senddate" || type == "createdate" || type == "deadline") && title.indexOf(".") !== -1 ? title.split(".")[1] : title;
          var boardOrderStore = getOptionsPro("panelProcessosOrder_" + type);
          var boardOrderItem = boardOrderStore && $.isArray(boardOrderStore) ? $.grep(boardOrderStore, function(row) {
            return row.id == v.id;
          })[0] : null;
          var order_board = boardOrderItem && typeof boardOrderItem.order !== "undefined" ? boardOrderItem.order : i2;
          order_board = order_board === null ? 9999 : order_board;
          var collapse_board = boardOrderItem && typeof boardOrderItem.collapse !== "undefined" ? boardOrderItem.collapse : false;
          var itens_board = $.map(item, function(value, index) {
            if (!value || !value.id_protocolo || value.id_protocolo === "false") {
              return;
            }
            var iten_urgente = value.especificacao && value.especificacao.toLowerCase().indexOf("(urgente)") !== -1 ? true : false;
            var item_pinboard = false;
            var order_item = false;
            if (boardOrderItem && $.isArray(boardOrderItem.itens)) {
              order_item = $.grep(boardOrderItem.itens, function(row) {
                return row.id == String(value.id_protocolo);
              })[0] || false;
            }
            item_pinboard = order_item === null || order_item === false ? item_pinboard : order_item.pinboard;
            order_item = order_item === null || order_item === false ? 9999 : order_item.order;
            order_item = iten_urgente ? -1 : order_item;
            var pinBoard = '<span style="float: right;margin: -5px -10px 0 0;" class="kanban-pinboard info_noclick"><a class="newLink info_noclick ' + (item_pinboard ? "newLink_active" : "") + '" onclick="pinKanbanItensProc(this, ' + value.id_protocolo + `)" onmouseover="return infraTooltipMostrar('` + (item_pinboard ? "Remover do topo" : "Fixar no topo") + `');" onmouseout="return infraTooltipOcultar();"><i class="fas fa-thumbtack cinzaColor"></i></a></span>`;
            return {
              id: value.id_protocolo,
              order: order_item,
              title: pinBoard + '<div class="kanban-content">   <div class="kanban-title-card content_edit" data-field="assunto" data-id="' + value.id_protocolo + '">       <span class="info" data-type="proc" style="width: 75%;">           ' + value.html_proc + '           <a class="newLink info_noclick followLinkNewtab" href="controlador.php?acao=procedimento_trabalhar&id_procedimento=' + value.id_protocolo + `" onmouseover="return infraTooltipMostrar('Abrir em nova aba');" onmouseout="return infraTooltipOcultar();" target="_blank"><i class="fas fa-external-link-alt" style="font-size: 90%; text-decoration: underline;"></i></a>       </span>   </div>   <div class="kanban-description">       <span class="sub info_noclick" data-type="especificacao">` + value.especificacao + '</span>       <span class="sub info_noclick" data-type="tipo">' + value.tipo + '</span>       <span class="sub info_noclick" data-type="atribuicao">' + value.html_atribuicao + '</span>       <span class="sub info_noclick" data-type="icons">' + value.html_icons + '</span>       <span class="sub info_noclick" data-type="prazo">' + value.html_prazo + "</span>   </div></div>",
              click: function(el) {
                var id_protocolo = el.dataset.eid;
                var checkOver = $(el).find(".info_noclick:hover").length > 0 ? $(el).find(".info_noclick:hover") : false;
                var newTab = $(el).find(".followLinkNewtab:hover").length > 0 ? $(el).find(".followLinkNewtab:hover") : false;
                if (!dialogBoxPro && !checkOver && id_protocolo) window.location.href = "controlador.php?acao=procedimento_trabalhar&id_procedimento=" + id_protocolo;
                if (!dialogBoxPro && id_protocolo && newTab) openLinkNewTab("controlador.php?acao=procedimento_trabalhar&id_procedimento=" + id_protocolo);
              },
              class: iten_urgente ? "urgente" : ""
            };
          });
          itens_board.sort(function(a, b) {
            return a.order - b.order;
          });
          if (v.id == "SemGrupo" && itens_board.length === 0) {
            return null;
          }
          return {
            id: v.id,
            title,
            order: order_board,
            class: "proc_" + type,
            color: typeof item[0] !== "undefined" ? item[0].color : false,
            collapse: collapse_board,
            item: itens_board
          };
        });
        bords_list.sort(function(a, b) {
          return a.order - b.order;
        });
        var kanban = new jKanban({
          element: "#processosKanban",
          gutter: "10px",
          widthBoard: "calc(25% - 20px)",
          // responsivePercentage: true,
          itemHandleOptions: {
            enabled: true
          },
          dragEl: function(el, source) {
            var sourceEl = source.parentElement.getAttribute("data-id");
            var id_protocolo = el.dataset.eid;
            var elemItem = $('#processosKanban .kanban-item[data-eid="' + id_protocolo + '"]');
            kanbanProcessosMoving = { source: sourceEl, id: el.dataset.eid, order: elemItem.index() };
          },
          dropEl: function(el, target, source, sibling) {
            updateOrderKanbanBoardProc();
            var targetEl = target.parentElement.getAttribute("data-id");
            var sourceEl = source.parentElement.getAttribute("data-id");
            var id_protocolo = el.dataset.eid;
            var elemItem = $('#processosKanban .kanban-item[data-eid="' + id_protocolo + '"]');
            var titleSource = elemItem.closest(".kanban-board").find(".kanban-title-board").text();
            var elemContent = elemItem.find(".kanban-content");
            var elemProc = elemContent.find('span[data-type="proc"]');
            var elemUser = elemContent.find('span[data-type="atribuicao"]');
            var elemIcons = elemContent.find('span[data-type="icons"]');
            var elemTypes = elemContent.find('span[data-type="tipo"]');
            if (type == "users" && sourceEl != targetEl) {
              var arrayListUsersSEI = getOptionsPro("arrayListUsersSEI");
              if (arrayListUsersSEI) {
                var userMatch = $.grep(arrayListUsersSEI, function(item) {
                  return item.name && item.name.indexOf(targetEl) !== -1;
                })[0];
                var idUser = userMatch ? userMatch.value : false;
                idUser = idUser == "SemGrupo" ? "null" : idUser;
                var linkAtribuicao = tableProc.find('a[href*="&id_usuario_atribuicao=' + idUser + '"]').attr("href");
                elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');
                updateDadosArvore("Atribuir Processo", "selAtribuicao", idUser, id_protocolo, function() {
                  if (targetEl != "SemGrupo") {
                    var targetAtribuicao = '(<a href="' + linkAtribuicao + '" title="Atribu\xEDdo para ' + targetEl + '" class="ancoraSigla">' + targetEl + "</a>)";
                    elemUser.html(targetAtribuicao);
                    tableProc.find('tr[id="P' + id_protocolo + '"]').find("td").eq(3).html(targetAtribuicao);
                  } else {
                    elemUser.html("");
                    tableProc.find('tr[id="P' + id_protocolo + '"]').find("td").eq(3).html("");
                  }
                  elemProc.find("i.fa-sync").remove();
                  elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                  setTimeout(function() {
                    elemProc.find("i.fa-check-double").remove();
                  }, 2e3);
                });
              }
            } else if (type == "tags" && sourceEl != targetEl) {
              var listMarcadores = getOptionsPro("listaMarcadores");
              listMarcadores = listMarcadores ? $.map(listMarcadores, function(v) {
                return { name: getTagName(v.name, type), value: v.value, img: v.img };
              }) : false;
              listMarcadores = listMarcadores !== null ? listMarcadores : false;
              var arrayMarcador = listMarcadores ? $.grep(listMarcadores, function(item) {
                return item.name == targetEl;
              })[0] : false;
              var valueMarcador = arrayMarcador !== null && arrayMarcador ? arrayMarcador.value : false;
              var elemIconTag = elemIcons.find('a[href*="acao=andamento_marcador_gerenciar"]');
              var elemIconTagTable = tableProc.find('tr[id="P' + id_protocolo + '"]').find("td").eq(1).find('a[href*="acao=andamento_marcador_gerenciar"]');
              var valueText = elemIconTag.attr("onmouseover");
              valueText = typeof valueText !== "undefined" ? extractTooltipToArray(valueText) : false;
              valueText = valueText ? valueText[0] : false;
              valueText = typeof valueText !== "undefined" && valueText ? valueText : "";
              if (valueMarcador || targetEl == "SemGrupo") {
                var valuesIframe = [
                  { element: "txaTexto", value: valueText },
                  { element: "hdnIdMarcador", value: targetEl == "SemGrupo" ? "" : valueMarcador }
                ];
                updateDadosArvoreMult("Gerenciar Marcador", valuesIframe, id_protocolo, function() {
                  var arrayListMarcadores = sessionStorageRestorePro("dadosMarcadoresProcessoPro");
                  var markerStyle = arrayListMarcadores && valueMarcador ? $.grep(arrayListMarcadores, function(item) {
                    return item.icon == arrayMarcador.img;
                  })[0] : null;
                  var styleMarcador = markerStyle && typeof markerStyle.style !== "undefined" ? markerStyle.style : null;
                  styleMarcador = styleMarcador !== null ? styleMarcador : "";
                  if (targetEl != "SemGrupo" && sourceEl != "SemGrupo") {
                    elemIconTag.attr("style", styleMarcador).attr("onmouseover", "return infraTooltipMostrar('" + valueText + "','" + titleSource + "');").find("img").attr("src", arrayMarcador.img);
                    elemIconTagTable.attr("style", styleMarcador).attr("onmouseover", "return infraTooltipMostrar('" + valueText + "','" + titleSource + "');").find("img").attr("src", arrayMarcador.img);
                  } else if (targetEl != "SemGrupo" && sourceEl == "SemGrupo") {
                    var targetMarcador = '<a href="#controlador.php?acao=andamento_marcador_gerenciar&acao_origem=procedimento_controlar&acao_retorno=procedimento_controlar&id_procedimento=' + id_protocolo + `" onmouseover="return infraTooltipMostrar('` + valueText + "','" + titleSource + `');" onmouseout="return infraTooltipOcultar();" data-color="true" style="` + styleMarcador + '"><img src="' + arrayMarcador.img + '" class="imagemStatus"></a>';
                    elemIcons.append(targetMarcador);
                    tableProc.find('tr[id="P' + id_protocolo + '"]').find("td").eq(1).append(targetMarcador);
                  } else if (targetEl == "SemGrupo") {
                    elemIconTag.remove();
                    elemIconTagTable.remove();
                  }
                  elemProc.find("i.fa-sync").remove();
                  elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                  setTimeout(function() {
                    elemProc.find("i.fa-check-double").remove();
                  }, 2e3);
                  getAllMarcadoresHome();
                });
              }
            } else if (type == "types" && sourceEl != targetEl && targetEl != "SemGrupo") {
              elemProc.prepend('<i class="fas fa-sync fa-spin cinzaColor" style="margin-right: 5px;"></i>');
              initListTypesSEI(function() {
                var tipoMatch = typeof arrayListTypesSEI.selectTipoProc !== "undefined" ? $.grep(arrayListTypesSEI.selectTipoProc, function(item) {
                  return item.name == titleSource;
                })[0] : null;
                var idTypeProc = tipoMatch ? tipoMatch.value : false;
                if (idTypeProc) {
                  updateDadosArvore("Consultar/Alterar Processo", "selTipoProcedimento", idTypeProc, id_protocolo, function() {
                    elemTypes.text(titleSource);
                    elemProc.find("i.fa-sync").remove();
                    elemProc.prepend('<i class="fas fa-check-double verdeColor" style="margin-right: 5px;"></i>');
                    setTimeout(function() {
                      elemProc.find("i.fa-check-double").remove();
                    }, 2e3);
                  });
                } else {
                  elemProc.find("i.fa-sync").remove();
                  elemProc.prepend('<i class="fas fa-times vemelhoColor" style="margin-right: 5px;"></i>');
                  setTimeout(function() {
                    elemProc.find("i.fa-times").remove();
                  }, 2e3);
                }
              });
            } else if (sourceEl != targetEl) {
              cancelMoveKanbanItensProc();
            }
            kanbanProcessosMoving = false;
          },
          dragendBoard: function(el) {
            updateOrderKanbanBoardProc();
          },
          boards: bords_list
        });
        kanbanProcessos = kanban;
        tableProc.hide();
        updateCountKanbanBoardProc();
      }
    }
  }
  function cancelMoveKanbanItensProc() {
    var itemMove = kanbanProcessosMoving;
    if (itemMove && $("#processosKanban").is(":visible")) {
      var item = jmespath.search(kanbanProcessos.options.boards, "[?id=='" + itemMove.source + "'] | [0].item | [?id=='" + itemMove.id + "'] | [0]");
      item = item == null ? false : item;
      kanbanProcessos.removeElement(item.id);
      kanbanProcessos.addElement(itemMove.source, item, itemMove.order);
    }
  }
  function pinKanbanItensProc(this_, id_protocolo) {
    var _this = $(this_);
    var _parent = _this.closest(".kanban-board");
    var _hasActive = _this.hasClass("newLink_active");
    var source = _parent.data("id");
    var order = _hasActive ? -1 : 0;
    var item = jmespath.search(kanbanProcessos.options.boards, "[?id=='" + source + "'] | [0].item | [?id=='" + id_protocolo + "'] | [0]");
    item = item == null ? false : item;
    if (item) {
      kanbanProcessos.removeElement(item.id);
      kanbanProcessos.addElement(source, item, order);
      if (!_hasActive) {
        $("#processosKanban .kanban-container").animate({ scrollTop: 0 }, 500, function() {
          $('#processosKanban .kanban-item[data-eid="' + id_protocolo + '"] .kanban-pinboard a').addClass("newLink_active").attr("onmouseover", "return infraTooltipMostrar('Remover do topo')");
          updateOrderKanbanBoardProc();
        });
      } else {
        $('#processosKanban .kanban-item[data-eid="' + id_protocolo + '"] .kanban-pinboard a').removeClass("newLink_active").attr("onmouseover", "return infraTooltipMostrar('Fixar no topo')");
        updateOrderKanbanBoardProc();
      }
      if (typeof infraTooltipOcultar === "function") infraTooltipOcultar();
    }
  }
  function updateOrderKanbanBoardProc() {
    var type = storeGroupTablePro();
    var arrayOrder = $("#processosKanban .kanban-board").map(function() {
      var _this = $(this);
      var itens = _this.find(".kanban-item").map(function(i2) {
        return { id: String($(this).data("eid")), order: i2, pinboard: $(this).find(".kanban-pinboard a").hasClass("newLink_active") };
      }).get();
      var boards = { id: _this.data("id"), order: _this.data("order"), collapse: _this.data("collapse"), itens };
      return boards;
    }).get();
    setOptionsPro("panelProcessosOrder_" + type, arrayOrder);
  }
  function collapseKanbanBoardProc(this_) {
    var _this = $(this_);
    var _parent = _this.closest(".kanban-board");
    var _data = _parent.data();
    _parent.attr("data-collapse", _data.collapse ? false : true).data("collapse", _data.collapse ? false : true);
    _parent.find(".kanban-collapse i").attr("class", _data.collapse ? "fas fa-plus-square azulColor" : "fas fa-minus-square cinzaColor");
    updateOrderKanbanBoardProc();
  }
  function updateCountKanbanBoardProc() {
    if (!kanbanProcessos || !kanbanProcessos.options || !$.isArray(kanbanProcessos.options.boards)) {
      return;
    }
    $.each(kanbanProcessos.options.boards, function(i2, v) {
      var elemBoard = $('#processosKanban .kanban-board[data-id="' + v.id + '"]');
      var countBoard = elemBoard.find(".kanban-item:visible").length;
      var iconCollapse = elemBoard.find(".kanban-collapse").length ? false : '<div class="kanban-collapse" onclick="collapseKanbanBoardProc(this)"><i class="fas fa-' + (v.collapse ? "plus" : "minus") + "-square " + (v.collapse ? "azulColor" : "cinzaColor") + '"></i></div>';
      elemBoard.attr("data-collapse", v.collapse).find(".kanban-title-board").attr("data-count", countBoard).after(iconCollapse);
    });
  }

  // src/features/lista-processos/legacy-api.js
  function installListaProcessosLegacyApi() {
    installListaProcessosState();
    [domain_exports, io_exports, modules_exports].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        const value = mod[name];
        if (typeof value === "function") aliasGlobal(name, value);
      });
    });
    if (typeof globalThis.objProcessosUnidadePro === "undefined") {
      globalThis.objProcessosUnidadePro = objProcessosUnidadePro;
    }
    if (typeof globalThis.arrayProcessosUnidadePro === "undefined") {
      globalThis.arrayProcessosUnidadePro = arrayProcessosUnidadePro;
    }
  }

  // src/features/lista-processos/index.js
  function installListaProcessos() {
    installListaProcessosState();
    installListaProcessosLegacyApi();
    ready(function() {
      initSeiPro();
    });
  }
  publishFeature({
    id: "lista-processos",
    nsKey: "listaProcessos",
    api: Object.freeze({
      normalizeHomeFilterText,
      normalizeHomeFilterKey,
      quoteInlineJsText,
      rewriteHomeFilterCaption,
      rowMatchesHomeFilterFacts,
      getListIdProtocoloSelectedFromValues,
      listaAgrupamentoIO,
      readGroupOrder,
      initSeiPro,
      insertGroupTable,
      getFilterTableHome,
      setTableSorterHome
    }),
    install: installListaProcessos
  });
  var namespace = globalThis.SeiPro = globalThis.SeiPro || {};
  namespace.features = namespace.features || {};
  namespace.features.listaProcessosIO = {
    listaAgrupamentoIO,
    readGroupOrder
  };
  installListaProcessos();
})();
