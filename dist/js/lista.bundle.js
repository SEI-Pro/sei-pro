(() => {
  // src/entries/lista/io.js
  function readListaEntryInputs({ root, checkConfigValue } = {}) {
    const queryRoot = root && typeof root.querySelector === "function" ? root : null;
    const hasAny = (selector) => Boolean(queryRoot && queryRoot.querySelector(selector));
    const enabledValue = (name, fallback = true) => typeof checkConfigValue === "function" ? checkConfigValue(name) : fallback;
    return {
      hasProcessTables: hasAny("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado"),
      hasTreeFrame: hasAny("#ifrArvore"),
      enabled: {
        "controlar-prazos": enabledValue("gerenciarprazos"),
        "nao-lido": true,
        monitorados: enabledValue("gerenciarmonitorados")
      }
    };
  }

  // src/entries/lista/view.js
  var call = (deps, name, ...args) => {
    const fn = deps[name];
    return typeof fn === "function" ? fn(...args) : void 0;
  };
  function runListaProcessosView(deps = {}) {
    const {
      urlSpro,
      hasSimpleTableCellEdition = false,
      hasMomentDuration = false,
      loadScript,
      schedule = (fn) => fn(),
      sessionStorage,
      configHostKey = "configHost_Pro"
    } = deps;
    call(deps, "bindProcessoPaginacaoSuperiorVisibility");
    if (urlSpro && !hasSimpleTableCellEdition) {
      if (typeof loadScript === "function") loadScript(`${urlSpro}js/lib/jquery-table-edit.min.js`);
    }
    if (urlSpro && !hasMomentDuration) {
      if (typeof loadScript === "function") loadScript(`${urlSpro}js/lib/moment-duration-format.min.js`);
    }
    call(deps, "initTableSorterHome");
    call(deps, "insertGroupTable");
    call(deps, "replaceSelectAll");
    call(deps, "initPanelMonitorados");
    call(deps, "checkLoadConfigSheets");
    call(deps, "insertDivPanel");
    schedule(() => {
      call(deps, "initNewTabProcesso");
      call(deps, "syncHomeProcessCaption");
    }, 2e3);
    call(deps, "forceOnLoadBody");
    call(deps, "observeAreaTela");
    call(deps, "initAnotacaoControle");
    call(deps, "initReplaceNewIcons");
    call(deps, "initControlePrazo");
    call(deps, "initViewEspecifacaoProcesso");
    call(deps, "initFullnameAtribuicao");
    call(deps, "initFaviconNrProcesso");
    call(deps, "addAcompanhamentoEspIcon");
    call(deps, "initAllMarcadoresHome");
    call(deps, "initUrgentePro");
    call(deps, "initNaoVisualizadoPro");
    call(deps, "initProcessNotificationsPro");
    call(deps, "storeLinkUsuarioSistema");
    call(deps, "storeVersionSEI");
    if (sessionStorage && sessionStorage.getItem(configHostKey) === null) {
      call(deps, "getConfigHost");
    }
    return true;
  }

  // src/entries/lista.js
  var LISTA_FEATURES = Object.freeze([
    "lista-processos",
    "lista-agrupamento",
    "controlar-prazos",
    "nao-lido"
  ]);
  var MONITORADOS_FEATURE = "monitorados";
  function composeListaFeatures({
    hasProcessTables = false,
    hasTreeFrame = false,
    enabled = {}
  } = {}) {
    if (hasProcessTables) {
      const features = LISTA_FEATURES.filter((feature) => enabled[feature] !== false);
      if (enabled.monitorados !== false) features.push(MONITORADOS_FEATURE);
      return { context: "lista-processos", features };
    }
    if (hasTreeFrame) {
      return { context: "arvore", features: ["arvore"] };
    }
    return { context: "desconhecido", features: [] };
  }
  function installListaEntryDomain(globalRef = globalThis) {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.entries = globalRef.SeiPro.entries || {};
    globalRef.SeiPro.entries.lista = { composeListaFeatures, readListaEntryInputs, runListaProcessosView };
  }
  installListaEntryDomain(typeof window !== "undefined" ? window : globalThis);
})();
