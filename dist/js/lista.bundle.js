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
    globalRef.SeiPro.entries.lista = { composeListaFeatures, readListaEntryInputs };
  }
  installListaEntryDomain(typeof window !== "undefined" ? window : globalThis);
})();
