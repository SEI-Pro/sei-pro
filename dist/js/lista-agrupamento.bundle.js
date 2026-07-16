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
})();
