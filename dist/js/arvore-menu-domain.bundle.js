(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/features/arvore/domain.js
  var domain_exports = {};
  __export(domain_exports, {
    extractUploadExtensions: () => extractUploadExtensions,
    hasUploadFiles: () => hasUploadFiles,
    resolveMenuCatalogs: () => resolveMenuCatalogs,
    resolveMenuSelection: () => resolveMenuSelection,
    serializeUploadAttachment: () => serializeUploadAttachment,
    sortUploadFiles: () => sortUploadFiles
  });
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

  // src/features/arvore/io.js
  var io_exports = {};
  __export(io_exports, {
    fetchUploadPage: () => fetchUploadPage,
    postSavedUpload: () => postSavedUpload,
    postUploadForm: () => postUploadForm,
    readArvoreMenuConfig: () => readArvoreMenuConfig
  });
  var MENU_STORAGE_KEYS = {
    process: "configViewFlashMenuPro",
    document: "configViewFlashDocMenuPro",
    tree: "configViewFlashDocArvorePro",
    panel: "configViewFlashPanelArvorePro"
  };
  var MENU_OPTION_KEYS = {
    process: "optionsFlashMenu_menuproc",
    document: "optionsFlashMenu_menudoc",
    tree: "optionsFlashMenu_iconstree",
    panel: "optionsFlashMenu_panelinfo"
  };
  function readArvoreMenuConfig({ restore, getOption }) {
    const stored = Object.fromEntries(Object.entries(MENU_STORAGE_KEYS).map(([name, key]) => [
      name,
      restore(key)
    ]));
    const enabled = Object.fromEntries(Object.entries(MENU_OPTION_KEYS).map(([name, key]) => [
      name,
      getOption(key) !== "disabled"
    ]));
    return { stored, enabled };
  }
  function requireAjax(ajax) {
    if (typeof ajax !== "function") throw new TypeError("ajax dependency is required");
    return ajax;
  }
  function fetchUploadPage({ ajax, url, onSuccess }) {
    return requireAjax(ajax)({ url }).done(onSuccess);
  }
  function postUploadForm({ ajax, url, data, onSuccess }) {
    return requireAjax(ajax)({ method: "POST", data, url }).done(onSuccess);
  }
  function postSavedUpload({ ajax, xhrFactory, url, data, onSuccess }) {
    const xhr = xhrFactory();
    requireAjax(ajax)({
      method: "POST",
      data,
      url,
      contentType: "application/x-www-form-urlencoded; charset=ISO-8859-1",
      xhr: () => xhr
    }).done((htmlResult, _status, responseXhr) => onSuccess(htmlResult, responseXhr || xhr));
    return xhr;
  }

  // src/features/arvore/view.js
  function bindArvoreToolbarProcess({ element, onAction }) {
    return element.toolbar({
      content: "#toolbar-options-proc",
      position: "bottom",
      adjustment: 5,
      style: "menu"
    }).on("toolbarItemClick", function(event, triggerButton) {
      onAction(this, triggerButton);
    });
  }
  function bindUploadArvoreNativeDragEvents({
    root,
    $,
    hasUploadFiles: hasUploadFiles2,
    openModalDropzone,
    cancelUpload,
    getDropzone
  }) {
    const documentRoot = $(root);
    documentRoot.off(".uploadArvorePro").on("dragenter.uploadArvorePro dragover.uploadArvorePro", (event) => {
      const originalEvent = event.originalEvent;
      const dataTransfer = originalEvent ? originalEvent.dataTransfer : null;
      if (!hasUploadFiles2(dataTransfer)) return;
      event.preventDefault();
      openModalDropzone();
    }).on("dragleave.uploadArvorePro", (event) => {
      const originalEvent = event.originalEvent;
      if (originalEvent && originalEvent.clientX <= 0 && originalEvent.clientY <= 0) {
        cancelUpload();
      }
    }).on("drop.uploadArvorePro", (event) => {
      const originalEvent = event.originalEvent;
      const dataTransfer = originalEvent ? originalEvent.dataTransfer : null;
      if (!hasUploadFiles2(dataTransfer)) return;
      event.preventDefault();
      cancelUpload();
      const dropzone = getDropzone();
      if (dropzone && typeof dropzone.handleFiles === "function") {
        dropzone.handleFiles(Array.from(dataTransfer.files));
      }
    });
  }

  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/features/arvore/legacy-api.js
  function installArvoreLegacyApi() {
    [domain_exports, io_exports].forEach((mod) => {
      Object.keys(mod).forEach((name) => {
        if (typeof mod[name] === "function") aliasGlobal(name, mod[name]);
      });
    });
    aliasGlobal("bindUploadArvoreNativeDragEvents", () => {
      if (globalThis.uploadArvoreDragBound) return;
      globalThis.uploadArvoreDragBound = true;
      bindUploadArvoreNativeDragEvents({
        root: document,
        $: globalThis.$,
        hasUploadFiles: globalThis.hasUploadFiles,
        openModalDropzone: globalThis.openModalDropzone,
        cancelUpload: globalThis.dropzoneCancelInfo,
        getDropzone: () => globalThis.arvoreDropzone
      });
    });
  }

  // src/features/arvore/index.js
  var namespace = globalThis.SeiPro = globalThis.SeiPro || {};
  namespace.features = namespace.features || {};
  namespace.features.arvoreMenus = { resolveMenuCatalogs };
  namespace.features.arvoreMenuIO = { readArvoreMenuConfig };
  namespace.features.arvoreUploadIO = { fetchUploadPage, postUploadForm, postSavedUpload };
  namespace.features.arvoreUpload = {
    hasUploadFiles,
    serializeUploadAttachment,
    extractUploadExtensions,
    sortUploadFiles
  };
  namespace.features.arvoreUploadView = { bindArvoreToolbarProcess, bindUploadArvoreNativeDragEvents };
  installArvoreLegacyApi();
})();
