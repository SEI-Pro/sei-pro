(() => {
  // src/features/arvore/domain.js
  function isMenuEntry(value) {
    return Array.isArray(value) && typeof value[0] === "string" && value[0].trim() !== "";
  }
  function resolveMenuSelection(stored, fallback) {
    if (!Array.isArray(stored) || stored.length === 0) return fallback;
    const valid = stored.filter(isMenuEntry).map((entry) => [entry[0]]);
    return valid.length > 0 ? valid : fallback;
  }
  function resolveMenuCatalogs(stored, defaults) {
    const source = stored || {};
    return Object.fromEntries(Object.entries(defaults).map(([key, fallback]) => [
      key,
      resolveMenuSelection(source[key], fallback)
    ]));
  }

  // src/features/arvore/index.js
  var namespace = globalThis.SeiPro = globalThis.SeiPro || {};
  namespace.features = namespace.features || {};
  namespace.features.arvoreMenus = { resolveMenuCatalogs };
})();
