(() => {
  // src/features/lista-agrupamento/domain.js
  function removeAcentos(value) {
    return typeof value === "string" && typeof value.normalize === "function" ? value.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : value;
  }
  function normalizeTooltipSource(value) {
    return String(value).replace(/<[^>]*>?/gm, "").replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&amp;/gi, "&").replace("return infraTooltipMostrar(", "").replace(/\);?$/, "").replace(/["']/g, '"');
  }
  function extractGroupTableTooltipToArray(value) {
    if (value === void 0 || value === null || value === "") return false;
    const source = normalizeTooltipSource(value);
    if (source === "") return false;
    try {
      const array = JSON.parse("[" + source + "]");
      return array.length > 0 ? array : false;
    } catch (error) {
      return false;
    }
  }
  function getTagName(tagName, type) {
    return tagName !== void 0 && tagName !== "" ? removeAcentos(tagName).replace(/\ /g, "") : "SemGrupo";
  }
  function installListaAgrupamentoDomain(globalRef2 = globalThis) {
    globalRef2.SeiPro = globalRef2.SeiPro || {};
    globalRef2.SeiPro.features = globalRef2.SeiPro.features || {};
    globalRef2.SeiPro.features.listaAgrupamento = {
      extractGroupTableTooltipToArray,
      getTagName
    };
  }

  // src/features/lista-agrupamento/io.js
  function readGroupOrder(getOptions, fallback = "asc") {
    const value = typeof getOptions === "function" ? getOptions("orderbyTableGroup") : void 0;
    return value || fallback;
  }
  function isGroupCollapsed(getOptions, tagName) {
    return typeof getOptions === "function" && Boolean(getOptions("panelGroup_" + tagName));
  }
  function persistGroupCollapsed(setOptions, tagName) {
    if (typeof setOptions === "function") setOptions("panelGroup_" + tagName, true);
  }
  function clearGroupCollapsed(removeOptions, tagName) {
    if (typeof removeOptions === "function") removeOptions("panelGroup_" + tagName);
  }
  function readSelectedGroup(restore) {
    return typeof restore === "function" ? restore("selectGroupTablePro") : void 0;
  }
  function readReceivedProcess(restore, getParams, jmespath, href) {
    const stored = typeof restore === "function" ? restore("configDataRecebimentoPro") : void 0;
    const records = stored && typeof stored === "object" ? stored : [];
    const id = typeof getParams === "function" ? String(getParams(href || "").id_procedimento) : false;
    if (!id || !jmespath || typeof jmespath.search !== "function") return "";
    return jmespath.search(records, "[?id_procedimento=='" + id + "'] | [0]") || "";
  }
  function installListaAgrupamentoIO(globalRef2 = globalThis) {
    globalRef2.SeiPro = globalRef2.SeiPro || {};
    globalRef2.SeiPro.features = globalRef2.SeiPro.features || {};
    globalRef2.SeiPro.features.listaAgrupamentoIO = {
      readGroupOrder,
      isGroupCollapsed,
      persistGroupCollapsed,
      clearGroupCollapsed,
      readSelectedGroup,
      readReceivedProcess
    };
  }

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/lista-agrupamento/legacy-api.js
  aliasGlobal("extractGroupTableTooltipToArray", extractGroupTableTooltipToArray);
  aliasGlobal("getTagName", getTagName);

  // src/features/lista-agrupamento/index.js
  installListaAgrupamentoDomain(typeof window !== "undefined" ? window : globalThis);
  installListaAgrupamentoIO(typeof window !== "undefined" ? window : globalThis);
})();
