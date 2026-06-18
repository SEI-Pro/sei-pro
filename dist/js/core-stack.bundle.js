(() => {
  // src/core/global.js
  var globalRef = typeof window !== "undefined" ? window : globalThis;
  function getSeiPro() {
    globalRef.SeiPro = globalRef.SeiPro || {};
    globalRef.SeiPro.core = globalRef.SeiPro.core || {};
    globalRef.SeiPro.sei = globalRef.SeiPro.sei || {};
    globalRef.SeiPro.features = globalRef.SeiPro.features || {};
    globalRef.SeiPro.state = globalRef.SeiPro.state || {};
    return globalRef.SeiPro;
  }
  function aliasGlobal(name, value) {
    if (typeof globalRef[name] === "undefined") {
      globalRef[name] = value;
    }
  }

  // src/core/namespace.js
  function createNamespace() {
    const root = getSeiPro();
    root.aliasState = function(name, value) {
      root.state[name] = value;
      if (typeof globalRef[name] === "undefined") {
        globalRef[name] = value;
      }
      return value;
    };
    root.linkState = function(name) {
      if (Object.prototype.hasOwnProperty.call(root.state, name)) {
        return;
      }
      try {
        Object.defineProperty(root.state, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return globalRef[name];
          },
          set: function(value) {
            globalRef[name] = value;
          }
        });
      } catch (e) {
        root.state[name] = globalRef[name];
      }
    };
    root.linkStateAll = function(names) {
      (names || []).forEach(root.linkState);
    };
    return root;
  }

  // src/core/runtime.js
  var EXT_BASE_KEY = "seiProExtBaseUrl";
  var EXT_MANIFEST_KEY = "seiProExtManifest";
  function runtimeApi() {
    if (typeof globalRef.browser !== "undefined" && globalRef.browser.runtime) {
      return globalRef.browser.runtime;
    }
    if (typeof globalRef.chrome !== "undefined" && globalRef.chrome.runtime) {
      return globalRef.chrome.runtime;
    }
    return null;
  }
  function sessionGet(key) {
    try {
      return typeof globalRef.sessionStorage !== "undefined" ? globalRef.sessionStorage.getItem(key) : null;
    } catch (e) {
      return null;
    }
  }
  function sessionSet(key, value) {
    try {
      if (typeof globalRef.sessionStorage !== "undefined") {
        globalRef.sessionStorage.setItem(key, value);
      }
    } catch (e) {
    }
  }
  function extBase() {
    if (globalRef.__seiProExtBase) return globalRef.__seiProExtBase;
    const cached = sessionGet(EXT_BASE_KEY);
    if (cached) return cached;
    if (typeof globalRef.URL_SPRO !== "undefined" && globalRef.URL_SPRO) {
      return globalRef.URL_SPRO;
    }
    return "";
  }
  function createRuntime() {
    const isChrome = typeof globalRef.browser === "undefined";
    if (isChrome && typeof globalRef.chrome !== "undefined") {
      globalRef.browser = globalRef.chrome;
    }
    const api = runtimeApi();
    if (api && typeof api.getURL === "function") {
      try {
        const base = api.getURL("");
        globalRef.__seiProExtBase = base;
        sessionSet(EXT_BASE_KEY, base);
      } catch (e) {
      }
    } else if (!globalRef.__seiProExtBase) {
      try {
        const self = typeof document !== "undefined" ? document.currentScript : null;
        const src = self && self.src ? String(self.src) : "";
        const m = src.match(/^(.*\/)js\/core-stack\.bundle\.js(?:[?#].*)?$/);
        if (m) {
          globalRef.__seiProExtBase = m[1];
          sessionSet(EXT_BASE_KEY, m[1]);
        }
      } catch (e) {
      }
    }
    if (api && typeof api.getManifest === "function") {
      try {
        const manifest = api.getManifest();
        globalRef.__seiProExtManifest = manifest;
        sessionSet(EXT_MANIFEST_KEY, JSON.stringify(manifest));
      } catch (e) {
      }
    }
    function getUrlExtension(url) {
      const rt = runtimeApi();
      if (rt && typeof rt.getURL === "function") {
        return rt.getURL(url);
      }
      const base = extBase();
      if (!base) {
        throw new Error(
          "SeiPro.getUrlExtension: base da extens\xE3o indispon\xEDvel no mundo MAIN (cache de sessionStorage vazio, sem chrome.runtime e sem URL_SPRO)."
        );
      }
      return base + url;
    }
    function getManifestExtension() {
      const rt = runtimeApi();
      if (rt && typeof rt.getManifest === "function") {
        return rt.getManifest();
      }
      if (globalRef.__seiProExtManifest) return globalRef.__seiProExtManifest;
      const cached = sessionGet(EXT_MANIFEST_KEY);
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
        }
      }
      return {};
    }
    function pathExtensionSEIPro() {
      return getUrlExtension("js/sei-pro.js").toString().replace("js/sei-pro.js", "");
    }
    const runtime = {
      isChrome,
      getUrlExtension,
      getManifestExtension,
      pathExtensionSEIPro
    };
    getSeiPro().core.runtime = runtime;
    aliasGlobal("getUrlExtension", getUrlExtension);
    aliasGlobal("getManifestExtension", getManifestExtension);
    aliasGlobal("pathExtensionSEIPro", pathExtensionSEIPro);
    return runtime;
  }

  // src/core/util.js
  function compareVersionNumbers(v1, v2) {
    function isPositiveInteger(x) {
      return /^\d+$/.test(x);
    }
    const v1parts = v1.split(".");
    const v2parts = v2.split(".");
    function validateParts(parts) {
      for (let i = 0; i < parts.length; ++i) {
        if (!isPositiveInteger(parts[i])) return false;
      }
      return true;
    }
    if (!validateParts(v1parts) || !validateParts(v2parts)) return NaN;
    for (let j = 0; j < v1parts.length; ++j) {
      if (v2parts.length === j) return 1;
      if (v1parts[j] === v2parts[j]) continue;
      if (v1parts[j] > v2parts[j]) return 1;
      return -1;
    }
    if (v1parts.length !== v2parts.length) return -1;
    return 0;
  }
  function getParamsUrlPro(url) {
    const params = {};
    if (typeof url !== "undefined" && url.indexOf("?") !== -1 && url.indexOf("&") !== -1) {
      const vars = url.split("?")[1].split("&");
      for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        const key = pair.shift();
        let value = pair.join("=");
        if (typeof value === "undefined") {
          value = "";
        }
        value = value.replace(/\+/g, " ");
        try {
          value = decodeURIComponent(value);
        } catch (error) {
          console.warn("Malformed URL parameter ignored in getParamsUrlPro:", value, error);
        }
        params[key] = value;
      }
      return params;
    }
    return false;
  }
  function removeAcentos(str) {
    return typeof str !== "undefined" && str !== null && typeof str.normalize === "function" ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") : "";
  }
  function romanToInt(s) {
    const mapRoman = /* @__PURE__ */ new Map();
    mapRoman.set("I", 1);
    mapRoman.set("V", 5);
    mapRoman.set("X", 10);
    mapRoman.set("L", 50);
    mapRoman.set("C", 100);
    mapRoman.set("D", 500);
    mapRoman.set("M", 1e3);
    let result = 0;
    if (s) {
      const s1 = s.split("");
      s1.forEach(function(e, idx) {
        result += mapRoman.get(e) < mapRoman.get(s1[idx + 1]) ? -mapRoman.get(e) : mapRoman.get(e);
      });
    }
    return result;
  }
  function capitalizeFirstLetter(string) {
    if (!string || typeof string !== "string" || string.trim() === "") {
      return "";
    }
    const excetWords = ["a", "\xE0", "algo", "algu\xE9m", "algum", "alguma", "algumas", "alguns", "ao", "aos", "aquela", "aquelas", "aquele", "aqueles", "aquilo", "as", "\xE0s", "cada", "certa", "certas", "certo", "certos", "com", "comigo", "como", "conosco", "consigo", "contigo", "convosco", "cuja", "cujas", "cujo", "cujos", "da", "das", "de", "dessa", "dessas", "desse", "desses", "desta", "destas", "do", "dos", "dum", "duma", "dumas", "duns", "e", "\xE9", "ela", "elas", "ele", "eles", "em", "entre", "essa", "essas", "esse", "esses", "esta", "estas", "este", "estes", "eu", "isso", "isto", "la", "las", "lhe", "lhes", "lo", "los", "me", "mesma", "mesmas", "mesmo", "mesmos", "meu", "meus", "mim", "minha", "minhas", "muita", "muitas", "muito", "muitos", "na", "nada", "n\xE3o", "nas", "nenhum", "nenhuma", "nenhumas", "nenhuns", "ningu\xE9m", "no", "nos", "n\xF3s", "nossa", "nossas", "nosso", "nossos", "num", "numa", "numas", "nuns", "o", "onde", "os", "ou", "outra", "outras", "outrem", "outro", "outros", "para", "pela", "pelas", "pelo", "por", "pouca", "poucas", "pouco", "poucos", "quais", "quaisquer", "qual", "qualquer", "quando", "quanta", "quantas", "quanto", "quantos", "que", "quem", "s\xE3o", "se", "seja", "sem", "seu", "seus", "si", "sob", "sobre", "sua", "suas", "tanta", "tantas", "tanto", "tantos", "te", "teu", "teus", "ti", "toda", "todas", "todo", "todos", "tu", "tua", "tuas", "tudo", "um", "uma", "umas", "uns", "v\xE1ria", "v\xE1rias", "v\xE1rio", "v\xE1rios", "voc\xEA", "voc\xEAs", "vos", "v\xF3s", "vossa", "vossas", "vosso", "vossos"];
    if (string.indexOf(" ") === -1) {
      return string[0].toUpperCase() + string.substring(1).toLowerCase();
    }
    return string.split(" ").map(function(s, index) {
      if (excetWords.includes(s.toLowerCase()) && index !== 0) {
        return s.toLowerCase();
      }
      if (romanToInt(s) > 0) {
        return s.toUpperCase();
      }
      return s[0].toUpperCase() + s.substring(1).toLowerCase();
    }).join(" ");
  }
  function randomString(length) {
    let result = "";
    const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = length; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }
  function uniqPro(a) {
    return a.sort().filter(function(item, pos, ary) {
      return !pos || item !== ary[pos - 1];
    });
  }
  function installUtil() {
    const util = {
      compareVersionNumbers,
      getParamsUrlPro,
      removeAcentos,
      romanToInt,
      capitalizeFirstLetter,
      randomString,
      uniqPro
    };
    getSeiPro().core.util = util;
    aliasGlobal("compareVersionNumbers", compareVersionNumbers);
    aliasGlobal("getParamsUrlPro", getParamsUrlPro);
    aliasGlobal("removeAcentos", removeAcentos);
    aliasGlobal("romanToInt", romanToInt);
    aliasGlobal("capitalizeFirstLetter", capitalizeFirstLetter);
    aliasGlobal("randomString", randomString);
    aliasGlobal("uniqPro", uniqPro);
    return util;
  }

  // src/core/bootstrap.js
  function installBootstrap() {
    function setSessionNameSpace(param) {
      globalRef.sessionStorage.setItem(
        param.NAMESPACE_SPRO !== "SPro" ? "new_extension" : "old_extension",
        JSON.stringify(param)
      );
    }
    function _P() {
      return JSON.parse(globalRef.sessionStorage.getItem("new_extension"));
    }
    function getPathExtensionPro() {
      const $ = globalRef.jQuery || globalRef.$;
      if ($ && $('script[data-config="config-seipro"]').length > 0) {
        return;
      }
      const pathExtensionSEIPro = getSeiPro().core.runtime.pathExtensionSEIPro;
      const getManifestExtension = getSeiPro().core.runtime.getManifestExtension;
      const URL_SPRO = pathExtensionSEIPro();
      const manifest = getManifestExtension();
      setSessionNameSpace({
        URL_SPRO,
        NAMESPACE_SPRO: manifest.short_name,
        URLPAGES_SPRO: "https://sei-pro.github.io/sei-pro",
        VERSION_SPRO: manifest.version,
        ICON_SPRO: manifest.icons
      });
    }
    const bootstrap = {
      setSessionNameSpace,
      getPathExtensionPro,
      _P
    };
    getSeiPro().core.bootstrap = bootstrap;
    aliasGlobal("setSessionNameSpace", setSessionNameSpace);
    aliasGlobal("getPathExtensionPro", getPathExtensionPro);
    aliasGlobal("_P", _P);
    return bootstrap;
  }

  // src/core/config.js
  function installConfig() {
    function readConfigBasePro() {
      const raw = globalRef.localStorage.getItem("configBasePro");
      if (typeof raw === "undefined" || raw === null || raw === "") {
        return [];
      }
      try {
        return JSON.parse(raw);
      } catch (e) {
        return [];
      }
    }
    function queryConfigValue(name) {
      const configBasePro = readConfigBasePro();
      if (typeof globalRef.jmespath === "undefined" || globalRef.jmespath === null) {
        return false;
      }
      const configGeral = globalRef.jmespath.search(configBasePro, "[*].configGeral | [0]");
      if (!Array.isArray(configGeral)) {
        return false;
      }
      for (let i = 0; i < configGeral.length; i++) {
        if (configGeral[i] && configGeral[i].name === name) {
          return configGeral[i].value !== null && typeof configGeral[i].value !== "undefined" ? configGeral[i].value : false;
        }
      }
      return false;
    }
    function verifyConfigValue(name) {
      return queryConfigValue(name) === true;
    }
    function getConfigValue(name) {
      return queryConfigValue(name);
    }
    const config = {
      readConfigBasePro,
      queryConfigValue,
      verifyConfigValue,
      getConfigValue
    };
    getSeiPro().core.config = config;
    aliasGlobal("verifyConfigValue", verifyConfigValue);
    aliasGlobal("getConfigValue", getConfigValue);
    return config;
  }

  // src/core/validacao.js
  function extractCPFs(text) {
    return text.match(/(([0-9]{3}.[0-9]{3}.[0-9]{3}-[0-9]{2}))/gi);
  }
  function validaCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    let result = true;
    [9, 10].forEach(function(j) {
      let soma = 0, r;
      cpf.split(/(?=)/).splice(0, j).forEach(function(e, i) {
        soma += parseInt(e) * (j + 2 - (i + 1));
      });
      r = soma % 11;
      r = r < 2 ? 0 : 11 - r;
      if (r != cpf.substring(j, j + 1)) result = false;
    });
    return result;
  }
  function maskCNPJ(text) {
    return !!text ? text.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5") : text;
  }
  function maskCPF(text) {
    return !!text ? text.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : text;
  }
  function maskPEN(text) {
    return text.replace(/^(\d{5})(\d{6})(\d{4})(\d{2})/, "$1.$2/$3-$4");
  }
  function validateEmail(email) {
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
  }
  function escapeHtml(string) {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
      "/": "&#x2F;",
      "`": "&#x60;",
      "=": "&#x3D;"
    };
    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
      return entityMap[s];
    });
  }
  function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }
    return url.protocol === "http:" || url.protocol === "https:";
  }
  function installValidacao() {
    const validacao = {
      extractCPFs,
      validaCPF,
      maskCNPJ,
      maskCPF,
      maskPEN,
      validateEmail,
      escapeHtml,
      isValidHttpUrl
    };
    getSeiPro().core.validacao = validacao;
    aliasGlobal("extractCPFs", extractCPFs);
    aliasGlobal("validaCPF", validaCPF);
    aliasGlobal("maskCNPJ", maskCNPJ);
    aliasGlobal("maskCPF", maskCPF);
    aliasGlobal("maskPEN", maskPEN);
    aliasGlobal("validateEmail", validateEmail);
    aliasGlobal("escapeHtml", escapeHtml);
    aliasGlobal("isValidHttpUrl", isValidHttpUrl);
    return validacao;
  }

  // src/core/ui.js
  function installUi() {
    function resolveTarget(elementTo, target) {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) {
        return null;
      }
      target = target || $("html");
      if (target && target.find && typeof elementTo === "string") {
        return target.find(elementTo);
      }
      if (target && target.jquery) {
        return target;
      }
      return $(elementTo);
    }
    function buildFontFaceStyles(pathExtension, iconBoxSlim) {
      let html = '<style type="text/css" data-style="seipro-fonticon">    @font-face {\n       font-family: "Font Awesome 5 Pro";\n       font-style: normal;\n       font-weight: 900;\n       font-display: block;\n       src: url(' + pathExtension + "webfonts/pro/fa-solid-900.eot) !important;\n       src: url(" + pathExtension + 'webfonts/pro/fa-solid-900.eot?#iefix) format("embedded-opentype"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.woff2) format("woff2"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.woff) format("woff"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.ttf) format("truetype"),url(' + pathExtension + 'webfonts/pro/fa-solid-900.svg#fontawesome) format("svg") !important;\n   }\n   @font-face {\n       font-family: "Font Awesome 5 Pro";\n       font-style: normal;\n       font-weight: 400;\n       font-display: block;\n       src: url(' + pathExtension + "webfonts/pro/fa-regular-400.eot) !important;\n       src: url(" + pathExtension + 'webfonts/pro/fa-regular-400.eot?#iefix) format("embedded-opentype"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.woff2) format("woff2"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.woff) format("woff"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.ttf) format("truetype"),url(' + pathExtension + 'webfonts/pro/fa-regular-400.svg#fontawesome) format("svg") !important;\n   }\n';
      if (iconBoxSlim) {
        html += '   @font-face { \n       font-family: "Font Awesome 5 Pro";\n       font-style: normal;\n       font-weight: 300;\n       font-display: block;\n       src: url(' + pathExtension + "webfonts/pro/fa-light-300.eot) !important;\n       src: url(" + pathExtension + 'webfonts/pro/fa-light-300.eot?#iefix) format("embedded-opentype"), url(' + pathExtension + 'webfonts/pro/fa-light-300.woff2) format("woff2"), url(' + pathExtension + 'webfonts/pro/fa-light-300.woff) format("woff"), url(' + pathExtension + 'webfonts/pro/fa-light-300.ttf) format("truetype"), url(' + pathExtension + 'webfonts/pro/fa-light-300.svg#fontawesome) format("svg") !important; }\n   }\n   @font-face {\n       font-family: "Font Awesome 5 Duotone";\n       font-style: normal;\n       font-weight: 900;\n       font-display: block;\n       src: url(' + pathExtension + "webfonts/pro/fa-duotone-900.eot) !important;\n       src: url(" + pathExtension + 'webfonts/pro/fa-duotone-900.eot?#iefix) format("embedded-opentype"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.woff2) format("woff2"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.woff) format("woff"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.ttf) format("truetype"), url(' + pathExtension + 'webfonts/pro/fa-duotone-900.svg#fontawesome) format("svg") !important; }\n   }\n';
      }
      html += "</style>";
      return html;
    }
    function loadFontIcons(elementTo, target) {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) return;
      target = target || $("html");
      const iconBoxSlim = !!(globalRef.localStorage.getItem("seiSlim") || globalRef.localStorage.getItem("seiSlim_editor"));
      const pathExtension = getSeiPro().core.runtime.pathExtensionSEIPro();
      const appendTarget = resolveTarget(elementTo, target);
      if (target.find('link[data-style="seipro-fonticon"]').length === 0 && target.find('style[data-style="seipro-fonticon"]').length === 0) {
        $("<link/>", {
          rel: "stylesheet",
          type: "text/css",
          "data-style": "seipro-fonticon",
          href: getSeiPro().core.runtime.getUrlExtension("css/fontawesome.pro.min.css")
        }).appendTo(appendTarget);
        const htmlStyleFont = buildFontFaceStyles(pathExtension, iconBoxSlim);
        target.find("head").append(htmlStyleFont);
      }
    }
    function loadStylePro(url, elementTo, iframeTo) {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) return;
      elementTo = elementTo || $("head");
      iframeTo = iframeTo || $("head");
      if (iframeTo.find('link[data-style="seipro-style"]').length === 0) {
        $("<link/>", {
          rel: "stylesheet",
          type: "text/css",
          "data-style": "seipro-style",
          href: url
        }).appendTo(elementTo);
      }
    }
    function loadFilesUI() {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) return;
      if (typeof globalRef.jQuery.ui === "undefined") {
        $.getScript(getSeiPro().core.runtime.getUrlExtension("js/lib/jquery-ui.min.js"));
      }
      loadStylePro(getSeiPro().core.runtime.getUrlExtension("css/jquery-ui.css"), "head");
    }
    const HTML_VIEWER_DARK_CSS = "   p.Texto_Fundo_Cinza_Maiusculas_Negrito, \n   p.Texto_Fundo_Cinza_Negrito, \n   p .ancoraSei, \n   p.Item_Nivel1 { \n       background-color: #e5e5e566 !important;  \n   } \n   .dark-mode-color-black, \n   .dark-mode-color-black * { \n       color: #000 !important;  \n   } \n   .dark-mode-color-white, \n   .dark-mode-color-white * { \n       color: #fff !important;  \n   } \n   .pageBreakPro { background: #6f7071; height: 15px; } \n";
    function applyHtmlViewerDarkExtras() {
      const doc = globalRef.document;
      if (doc && doc.head) {
        const style = doc.createElement("style");
        style.type = "text/css";
        style.appendChild(doc.createTextNode(HTML_VIEWER_DARK_CSS));
        doc.head.appendChild(style);
      }
      if (typeof globalRef.initRepareBgTableColor === "function") {
        globalRef.initRepareBgTableColor();
      }
    }
    function loadStyleDesign(body, secondClass, options) {
      options = options || {};
      const $ = globalRef.jQuery || globalRef.$;
      const slimEnabled = !!globalRef.localStorage.getItem("seiSlim");
      const darkEnabled = !!globalRef.localStorage.getItem("darkModePro");
      const parentNewSEI = !!(options.checkParentNewSEI && globalRef.parent && globalRef.parent.isNewSEI);
      if ($ && body && typeof body.addClass === "function") {
        if (slimEnabled) {
          body.addClass("seiSlim");
          if (secondClass) body.addClass("seiSlim_" + secondClass);
          if (options.parent) body.addClass("seiSlim_parent");
          if (options.autoView && globalRef.document.getElementById("divInfraAreaTelaE") === null) {
            body.addClass("seiSlim_view");
          }
          if (darkEnabled) {
            body.addClass("dark-mode");
            if (options.htmlExtras) applyHtmlViewerDarkExtras();
          }
          if (options.viewerExtras) {
            if (globalRef.localStorage.getItem("seiBtnRight")) body.addClass("seiBtnRight");
            if (globalRef.localStorage.getItem("iconLabel")) body.addClass("seiIconLabel");
          }
        }
        if (parentNewSEI) body.addClass("newSEI");
        return;
      }
      const el = body && body.nodeType ? body : globalRef.document && globalRef.document.body;
      if (!el || !el.classList) return;
      if (slimEnabled) {
        el.classList.add("seiSlim");
        if (secondClass) el.classList.add("seiSlim_" + secondClass);
        if (options.parent) el.classList.add("seiSlim_parent");
        if (options.autoView && globalRef.document.getElementById("divInfraAreaTelaE") === null) {
          el.classList.add("seiSlim_view");
        }
        if (darkEnabled) {
          el.classList.add("dark-mode");
          if (options.htmlExtras) applyHtmlViewerDarkExtras();
        }
        if (options.viewerExtras) {
          if (globalRef.localStorage.getItem("seiBtnRight")) el.classList.add("seiBtnRight");
          if (globalRef.localStorage.getItem("iconLabel")) el.classList.add("seiIconLabel");
        }
      }
      if (parentNewSEI) el.classList.add("newSEI");
    }
    const ui = {
      loadFontIcons,
      loadStylePro,
      loadFilesUI,
      loadStyleDesign
    };
    getSeiPro().core.ui = ui;
    aliasGlobal("loadFontIcons", loadFontIcons);
    aliasGlobal("loadStylePro", loadStylePro);
    aliasGlobal("loadFilesUI", loadFilesUI);
    aliasGlobal("loadStyleDesign", loadStyleDesign);
    return ui;
  }

  // src/core/messaging.js
  function installMessaging() {
    function getRuntime() {
      if (typeof globalRef.browser !== "undefined" && globalRef.browser.runtime) {
        return globalRef.browser.runtime;
      }
      if (typeof globalRef.chrome !== "undefined" && globalRef.chrome.runtime) {
        return globalRef.chrome.runtime;
      }
      return null;
    }
    function sendMessage(message) {
      const runtime = getRuntime();
      if (!runtime || typeof runtime.sendMessage !== "function") {
        const action = message && message.action || "desconhecida";
        return Promise.reject(new Error(
          'SeiPro.messaging: runtime de extens\xE3o indispon\xEDvel (prov\xE1vel mundo MAIN). A\xE7\xE3o "' + action + '" n\xE3o p\xF4de ser entregue ao service worker.'
        ));
      }
      return new Promise(function(resolve, reject) {
        try {
          const result = runtime.sendMessage(message, function(response) {
            const lastError = globalRef.chrome && globalRef.chrome.runtime && globalRef.chrome.runtime.lastError;
            if (lastError) {
              reject(new Error(lastError.message));
              return;
            }
            resolve(response);
          });
          if (result && typeof result.then === "function") {
            result.then(resolve).catch(reject);
          }
        } catch (error) {
          reject(error);
        }
      });
    }
    const messaging = { sendMessage };
    getSeiPro().core.messaging = messaging;
    return messaging;
  }

  // src/core/storage.js
  function installStorage() {
    function storageGet(area, keys) {
      return getSeiPro().core.messaging.sendMessage({
        action: "storageGet",
        area,
        keys
      }).then(function(response) {
        if (!response || !response.ok) {
          throw new Error(response && response.error || "storageGet failed");
        }
        return response.data;
      });
    }
    function storageSet(area, items) {
      return getSeiPro().core.messaging.sendMessage({
        action: "storageSet",
        area,
        items
      }).then(function(response) {
        if (!response || !response.ok) {
          throw new Error(response && response.error || "storageSet failed");
        }
        return response.data;
      });
    }
    function storageRemove(area, keys) {
      return getSeiPro().core.messaging.sendMessage({
        action: "storageRemove",
        area,
        keys
      }).then(function(response) {
        if (!response || !response.ok) {
          throw new Error(response && response.error || "storageRemove failed");
        }
        return response.data;
      });
    }
    function fetchRequest(url, options) {
      return getSeiPro().core.messaging.sendMessage({
        action: "fetch",
        url,
        options: options || {}
      }).then(function(response) {
        if (!response) {
          throw new Error("fetch failed");
        }
        if (typeof response.status === "undefined") {
          throw new Error(response.error || "fetch failed");
        }
        return response;
      });
    }
    const storage = {
      getSync: function(keys) {
        return storageGet("sync", keys);
      },
      setSync: function(items) {
        return storageSet("sync", items);
      },
      removeSync: function(keys) {
        return storageRemove("sync", keys);
      },
      getLocal: function(keys) {
        return storageGet("local", keys);
      },
      setLocal: function(items) {
        return storageSet("local", items);
      },
      removeLocal: function(keys) {
        return storageRemove("local", keys);
      },
      getSession: function(keys) {
        return storageGet("session", keys);
      },
      setSession: function(items) {
        return storageSet("session", items);
      },
      removeSession: function(keys) {
        return storageRemove("session", keys);
      }
    };
    const net = { fetch: fetchRequest };
    getSeiPro().core.storage = storage;
    getSeiPro().core.net = net;
    return { storage, net };
  }

  // src/core/logger.js
  function installLogger() {
    function isDebugEnabled() {
      if (typeof globalRef.verifyConfigValue === "function") {
        return globalRef.verifyConfigValue("debugpage") === true;
      }
      return false;
    }
    function debug() {
      if (!isDebugEnabled()) return;
      console.log.apply(console, arguments);
    }
    function warn() {
      console.warn.apply(console, arguments);
    }
    function error() {
      console.error.apply(console, arguments);
    }
    const logger = {
      isDebugEnabled,
      debug,
      warn,
      error
    };
    getSeiPro().core.logger = logger;
    return logger;
  }

  // src/sei/version.js
  function installVersion() {
    function detectNewSEIFromDom() {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) return false;
      return $("#divInfraSidebarMenu ul#infraMenu").length > 0;
    }
    function getSeiVersionPro() {
      return globalRef.sessionStorage.getItem("versaoSei") || false;
    }
    function setSeiVersionPro() {
      const $ = globalRef.jQuery || globalRef.$;
      if (!$) return false;
      let version = $('img[title*="Sistema Eletr\xF4nico de Informa\xE7\xF5es - Vers\xE3o"]').attr("title");
      version = typeof version !== "undefined" ? version.match(/[0-9.]/g).join("") : false;
      if (version) {
        globalRef.sessionStorage.setItem("versaoSei", version);
      }
      return version;
    }
    function getIsNewSEI() {
      const isNew = detectNewSEIFromDom();
      if (isNew && typeof globalRef.setOptionsPro === "function") {
        globalRef.setOptionsPro("isNewSEI", true);
      }
      if (typeof globalRef.getOptionsPro === "function" && globalRef.getOptionsPro("isNewSEI")) {
        return true;
      }
      return isNew;
    }
    function isSEI5(isNewSEI, version) {
      return !!(isNewSEI && version && compareVersionNumbers(version, "5") >= 0);
    }
    function isAtLeast(version, target) {
      return compareVersionNumbers(version, target) >= 0;
    }
    function resolveVersionFlags() {
      const isNewSEI = getIsNewSEI();
      const version = getSeiVersionPro();
      const isSEI_5 = isSEI5(isNewSEI, version);
      return { isNewSEI, isSEI_5, version };
    }
    const versionApi = {
      detectNewSEIFromDom,
      getSeiVersionPro,
      setSeiVersionPro,
      getIsNewSEI,
      isSEI5,
      isAtLeast,
      resolveVersionFlags
    };
    getSeiPro().sei.version = versionApi;
    aliasGlobal("getSeiVersionPro", getSeiVersionPro);
    aliasGlobal("setSeiVersionPro", setSeiVersionPro);
    aliasGlobal("getIsNewSEI", getIsNewSEI);
    return versionApi;
  }

  // src/sei/adapter.js
  function installAdapter() {
    function flags() {
      if (getSeiPro().state && typeof getSeiPro().state.isNewSEI !== "undefined") {
        return {
          isNewSEI: !!getSeiPro().state.isNewSEI,
          isSEI_5: !!getSeiPro().state.isSEI_5,
          version: getSeiPro().state.version || getSeiPro().sei.version.getSeiVersionPro()
        };
      }
      return getSeiPro().sei.version.resolveVersionFlags();
    }
    function selectors(isNewSEI2, version) {
      const isAtLeast = getSeiPro().sei.version.isAtLeast;
      const isSEI_5 = !!(isNewSEI2 && version && isAtLeast(version, "5"));
      const mainMenu = isNewSEI2 ? "#infraMenu" : "#main-menu";
      const ifrVisualizacao_ = isNewSEI2 && version && isAtLeast(version, "4.1.0") ? "ifrConteudoVisualizacao" : "ifrVisualizacao";
      const ifrArvoreHtml_ = isNewSEI2 && version && isAtLeast(version, "4.1.0") ? "ifrVisualizacao" : "ifrArvoreHtml";
      return {
        divInformacao: isNewSEI2 ? "#divArvoreInformacao" : "#divInformacao",
        mainMenu,
        idMenu: isNewSEI2 ? "#divInfraSidebarMenu " + mainMenu : "#divInfraAreaTelaE " + mainMenu,
        ancoraArvoreDownload: isNewSEI2 ? "a.ancoraVisualizacaoArvore" : "a.ancoraArvoreDownload",
        infraBarraComandos: isNewSEI2 ? ".barraBotoesSEI" : ".infraBarraComandos",
        infraBarraS: isNewSEI2 ? "#divInfraBarraSistemaPadraoE" : "#divInfraBarraSistemaE",
        nameDocInterno: isNewSEI2 ? "documento_interno.svg" : "sei_documento_interno.gif",
        divComandos: isNewSEI2 && version && isAtLeast(version, "4.1.0") ? "#divBotoesControleProcessos" : "#divComandos",
        ifrVisualizacao_,
        $ifrVisualizacao: "#" + ifrVisualizacao_,
        ifrArvoreHtml_,
        $ifrArvoreHtml: "#" + ifrArvoreHtml_,
        frmEditor: isSEI_5 ? ".infra-editor__editor-completo" : "#frmEditor",
        infraBarraSistemaD: isNewSEI2 ? "#divInfraBarraSistemaPadraoD" : "#divInfraBarraSistemaD"
      };
    }
    function applyToState() {
      const f = flags();
      const sel = selectors(f.isNewSEI, f.version);
      getSeiPro().state.isNewSEI = f.isNewSEI;
      getSeiPro().state.isSEI_5 = f.isSEI_5;
      getSeiPro().state.version = f.version;
      Object.keys(sel).forEach(function(key) {
        getSeiPro().state[key] = sel[key];
      });
      getSeiPro().aliasState("isNewSEI", f.isNewSEI);
      getSeiPro().aliasState("isSEI_5", f.isSEI_5);
      Object.keys(sel).forEach(function(key) {
        getSeiPro().aliasState(key, sel[key]);
      });
      return sel;
    }
    function isNewSEI() {
      return !!flags().isNewSEI;
    }
    function isSEI5() {
      const f = flags();
      return getSeiPro().sei.version.isSEI5(f.isNewSEI, f.version);
    }
    function atLeast(target) {
      return getSeiPro().sei.version.isAtLeast(flags().version, target);
    }
    function pick(novo, legado) {
      return isNewSEI() ? novo : legado;
    }
    const adapter = {
      flags,
      selectors,
      applyToState,
      isNewSEI,
      isSEI5,
      atLeast,
      pick,
      divInformacao: function() {
        return selectors(flags().isNewSEI, flags().version).divInformacao;
      },
      mainMenu: function() {
        return selectors(flags().isNewSEI, flags().version).mainMenu;
      },
      frmEditor: function() {
        return selectors(flags().isNewSEI, flags().version).frmEditor;
      }
    };
    getSeiPro().sei.adapter = adapter;
    return adapter;
  }

  // src/sei/urls.js
  function installUrls() {
    function getParams(url) {
      return getSeiPro().core.util.getParamsUrlPro(url || globalRef.location.href);
    }
    function buildQuery(params) {
      const parts = [];
      Object.keys(params || {}).forEach(function(key) {
        if (typeof params[key] === "undefined" || params[key] === null) return;
        parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(params[key])));
      });
      return parts.join("&");
    }
    function appendQuery(baseUrl, params) {
      if (!params || !Object.keys(params).length) return baseUrl;
      const query = buildQuery(params);
      if (!query) return baseUrl;
      return baseUrl + (baseUrl.indexOf("?") === -1 ? "?" : "&") + query;
    }
    const urls = { getParams, buildQuery, appendQuery };
    getSeiPro().sei.urls = urls;
    aliasGlobal("getParamsUrlPro", getSeiPro().core.util.getParamsUrlPro);
    return urls;
  }

  // src/content/core-stack.js
  function installCoreStack() {
    createNamespace();
    createRuntime();
    installUtil();
    installBootstrap();
    installConfig();
    installValidacao();
    installUi();
    installMessaging();
    installStorage();
    installLogger();
    installVersion();
    installAdapter();
    installUrls();
  }
  installCoreStack();
})();
