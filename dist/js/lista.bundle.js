(() => {
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
    globalRef.SeiPro.entries.lista = { composeListaFeatures };
  }
  installListaEntryDomain(typeof window !== "undefined" ? window : globalThis);
})();
