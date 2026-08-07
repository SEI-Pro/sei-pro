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

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/entries/lista/legacy-api.js
  function getListaEntryContextLegacy() {
    const entry = globalRef.SeiPro && globalRef.SeiPro.entries && globalRef.SeiPro.entries.lista;
    if (!entry || typeof entry.composeListaFeatures !== "function") return false;
    const checkConfigValue = globalRef.checkConfigValue;
    const root = globalRef.document;
    const inputs = typeof entry.readListaEntryInputs === "function" ? entry.readListaEntryInputs({
      root,
      checkConfigValue: typeof checkConfigValue === "function" ? checkConfigValue : void 0
    }) : {
      hasProcessTables: Boolean(globalRef.$ && globalRef.$("#tblProcessosRecebidos, #tblProcessosGerados, #tblProcessosDetalhado").length),
      hasTreeFrame: Boolean(globalRef.$ && globalRef.$("#ifrArvore").length),
      enabled: {
        "controlar-prazos": typeof checkConfigValue === "function" ? checkConfigValue("gerenciarprazos") : true,
        "nao-lido": true,
        monitorados: typeof checkConfigValue === "function" ? checkConfigValue("gerenciarmonitorados") : true
      }
    };
    return entry.composeListaFeatures(inputs);
  }
  function runListaProcessosViewLegacy() {
    const entry = globalRef.SeiPro && globalRef.SeiPro.entries && globalRef.SeiPro.entries.lista;
    const view = entry && entry.runListaProcessosView;
    if (typeof view !== "function") return false;
    const $ = globalRef.$ || globalRef.jQuery;
    const moment = globalRef.moment;
    const deps = {
      urlSpro: globalRef.URL_SPRO,
      hasSimpleTableCellEdition: typeof globalRef.SimpleTableCellEdition !== "undefined",
      hasMomentDuration: typeof moment !== "undefined" && typeof moment.duration !== "undefined",
      loadScript: (url) => {
        if (typeof $ === "function" && typeof $.getScript === "function") $.getScript(url);
      },
      schedule: (fn, delay) => globalRef.setTimeout(fn, delay),
      sessionStorage: globalRef.sessionStorage,
      bindProcessoPaginacaoSuperiorVisibility: globalRef.bindProcessoPaginacaoSuperiorVisibility,
      initTableSorterHome: globalRef.initTableSorterHome,
      insertGroupTable: globalRef.insertGroupTable,
      replaceSelectAll: globalRef.replaceSelectAll,
      initPanelMonitorados: typeof globalRef.initPanelMonitorados === "function" ? globalRef.initPanelMonitorados : void 0,
      checkLoadConfigSheets: globalRef.checkLoadConfigSheets,
      insertDivPanel: globalRef.insertDivPanel,
      initNewTabProcesso: globalRef.initNewTabProcesso,
      syncHomeProcessCaption: globalRef.syncHomeProcessCaption,
      forceOnLoadBody: globalRef.forceOnLoadBody,
      observeAreaTela: globalRef.observeAreaTela,
      initAnotacaoControle: () => {
        if (globalRef.SeiPro && globalRef.SeiPro.features && globalRef.SeiPro.features.anotacaoControle) {
          globalRef.SeiPro.features.anotacaoControle.api.init();
        }
      },
      initReplaceNewIcons: globalRef.initReplaceNewIcons,
      initControlePrazo: globalRef.initControlePrazo,
      initViewEspecifacaoProcesso: globalRef.initViewEspecifacaoProcesso,
      initFullnameAtribuicao: globalRef.initFullnameAtribuicao,
      initFaviconNrProcesso: globalRef.initFaviconNrProcesso,
      addAcompanhamentoEspIcon: globalRef.addAcompanhamentoEspIcon,
      initAllMarcadoresHome: globalRef.initAllMarcadoresHome,
      initUrgentePro: globalRef.initUrgentePro,
      initNaoVisualizadoPro: globalRef.initNaoVisualizadoPro,
      initProcessNotificationsPro: typeof globalRef.initProcessNotificationsPro === "function" ? globalRef.initProcessNotificationsPro : void 0,
      storeLinkUsuarioSistema: globalRef.storeLinkUsuarioSistema,
      storeVersionSEI: globalRef.storeVersionSEI,
      getConfigHost: typeof globalRef.getConfigHost !== "undefined" ? globalRef.getConfigHost : void 0
    };
    view(deps);
    return true;
  }
  aliasGlobal("getListaEntryContextLegacy", getListaEntryContextLegacy);
  aliasGlobal("runListaProcessosViewLegacy", runListaProcessosViewLegacy);

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
  function installListaEntryDomain(globalRef2 = globalThis) {
    globalRef2.SeiPro = globalRef2.SeiPro || {};
    globalRef2.SeiPro.entries = globalRef2.SeiPro.entries || {};
    globalRef2.SeiPro.entries.lista = { composeListaFeatures, readListaEntryInputs, runListaProcessosView };
  }
  installListaEntryDomain(typeof window !== "undefined" ? window : globalThis);
})();
