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
  function installListaAgrupamentoDomain(globalRef3 = globalThis) {
    globalRef3.SeiPro = globalRef3.SeiPro || {};
    globalRef3.SeiPro.features = globalRef3.SeiPro.features || {};
    globalRef3.SeiPro.features.listaAgrupamento = {
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
  function installListaAgrupamentoIO(globalRef3 = globalThis) {
    globalRef3.SeiPro = globalRef3.SeiPro || {};
    globalRef3.SeiPro.features = globalRef3.SeiPro.features || {};
    globalRef3.SeiPro.features.listaAgrupamentoIO = {
      readGroupOrder,
      isGroupCollapsed,
      persistGroupCollapsed,
      clearGroupCollapsed,
      readSelectedGroup,
      readReceivedProcess
    };
  }

  // src/features/lista-agrupamento/view.js
  function toggleGroupTable(this_, $, persistGroupCollapsed2, clearGroupCollapsed2) {
    if (typeof $ !== "function") return false;
    const current = $(this_);
    const data = current.data();
    const table = current.closest("table");
    const controls = current.closest("span");
    const isHide = data.action === "hide";
    table.find('tr[data-tagname="' + data.htagname + '"]')[isHide ? "hide" : "show"]();
    controls.find('a[data-action="show"]')[isHide ? "show" : "hide"]();
    controls.find('a[data-action="hide"]')[isHide ? "hide" : "show"]();
    if (isHide) {
      if (typeof persistGroupCollapsed2 === "function") persistGroupCollapsed2(data.htagname);
    } else if (typeof clearGroupCollapsed2 === "function") {
      clearGroupCollapsed2(data.htagname);
    }
    return true;
  }
  function installListaAgrupamentoView(globalRef3 = globalThis) {
    globalRef3.SeiPro = globalRef3.SeiPro || {};
    globalRef3.SeiPro.features = globalRef3.SeiPro.features || {};
    globalRef3.SeiPro.features.listaAgrupamentoView = { toggleGroupTable };
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
  var globalRef2 = typeof window !== "undefined" ? window : globalThis;
  installListaAgrupamentoDomain(globalRef2);
  installListaAgrupamentoIO(globalRef2);
  installListaAgrupamentoView(globalRef2);
})();
