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
  function hasUploadFiles(dataTransfer) {
    if (!dataTransfer) return false;
    if (dataTransfer.files && dataTransfer.files.length > 0) return true;
    if (!dataTransfer.types) return false;
    return Array.prototype.indexOf.call(dataTransfer.types, "Files") !== -1;
  }
  function serializeUploadAttachment(response, params, formatBytes) {
    const tamanho = response[3];
    const value = [
      response[0],
      response[1],
      response[4],
      tamanho,
      formatBytes(Number.parseInt(tamanho, 10)),
      params.userUnidade.user,
      params.userUnidade.unidade
    ].join("\xB1");
    return encodeURIComponent(value.replace(/ /g, "+")).replace(/%C2/g, "").replace(/%2B/g, "+");
  }
  function extractUploadExtensions(lines) {
    return lines.reduce((extensions, line) => {
      if (line.includes("arrExt")) {
        const extension = line.split('"')[1];
        if (extension !== void 0) extensions.push(`.${extension}`);
      }
      return extensions;
    }, []);
  }
  function sortUploadFiles(files, getPosition) {
    return files.slice().sort((a, b) => getPosition(a) > getPosition(b) ? 1 : -1);
  }

  // src/features/arvore/index.js
  var namespace = globalThis.SeiPro = globalThis.SeiPro || {};
  namespace.features = namespace.features || {};
  namespace.features.arvoreMenus = { resolveMenuCatalogs };
  namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
  };
})();
