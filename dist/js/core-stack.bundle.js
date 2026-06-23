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
    function isDefaultEnabledConfigValue(name) {
      return ["filtrarpaginapelapesquisarapida"].indexOf(String(name || "")) !== -1;
    }
    function checkConfigValue(name) {
      const jmespath = globalRef.jmespath;
      const rawConfig = globalRef.localStorage.getItem("configBasePro");
      var configBasePro = typeof rawConfig !== "undefined" && rawConfig != "" && rawConfig !== null ? JSON.parse(rawConfig) : [];
      var dataValuesConfig = typeof jmespath !== "undefined" && jmespath !== null ? jmespath.search(configBasePro, "[*].configGeral | [0]") : false;
      dataValuesConfig = typeof jmespath !== "undefined" && jmespath !== null ? jmespath.search(dataValuesConfig, "[?name=='" + name + "'].value | [0]") : false;
      if ((dataValuesConfig === false || dataValuesConfig === null) && isDefaultEnabledConfigValue(name)) {
        return true;
      }
      if (dataValuesConfig == false && typeof configBasePro !== "undefined" && configBasePro !== null && configBasePro.length > 0) {
        return false;
      } else {
        return true;
      }
    }
    const config = {
      readConfigBasePro,
      queryConfigValue,
      verifyConfigValue,
      getConfigValue,
      isDefaultEnabledConfigValue,
      checkConfigValue
    };
    getSeiPro().core.config = config;
    aliasGlobal("verifyConfigValue", verifyConfigValue);
    aliasGlobal("getConfigValue", getConfigValue);
    aliasGlobal("isDefaultEnabledConfigValue", isDefaultEnabledConfigValue);
    aliasGlobal("checkConfigValue", checkConfigValue);
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

  // src/core/texto.js
  function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }
  function escapeComponent(str) {
    return escape(str).replace(/\+/g, "%2B");
  }
  function normalizeMojibakeUtf8(value) {
    value = typeof value === "string" ? value : "";
    if (!value) return value;
    if (!/(?:[\u00C2\u00C3][\u0080-\u00BF]|\u00E2[\u0080-\u00BF]{2})/.test(value)) {
      return value;
    }
    try {
      return decodeURIComponent(escape(value));
    } catch (err) {
      if (typeof TextDecoder !== "undefined" && typeof Uint8Array !== "undefined") {
        try {
          return new TextDecoder("utf-8").decode(Uint8Array.from(value, function(ch) {
            return ch.charCodeAt(0);
          }));
        } catch (err2) {
        }
      }
    }
    return value;
  }
  function replaceTextToUrl(text) {
    const Rexp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(Rexp, "<a href='$1' target='_blank'>$3</a>");
  }
  function extractHexColor(text) {
    return text.match(/#[0-9a-f]{6}|#[0-9a-f]{3}/gi);
  }
  function pad(str, max) {
    str = str.toString();
    return str.length < max ? pad("0" + str, max) : str;
  }
  function extractEmails(text) {
    return text.match(/([a-zA-Z0-9._+-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
  }
  function extractAllTextBetweenQuotes(str) {
    const re = /'(.*?)'/g;
    const result = [];
    let current;
    while (current = re.exec(str)) {
      result.push(current.pop());
    }
    return result.length > 0 ? result : [str];
  }
  function extractOnlyAlphaNum(string) {
    string = string != "" ? string.replace(/[^a-z0-9 ]/gi, "").replace(/  /g, " ") : string;
    return string;
  }
  function joinAnd(a) {
    return a.length == 1 ? a[0] : a.slice(0, -1).join(", ") + " e " + a.slice(-1);
  }
  function is_html(str) {
    const regex = /<\/?[a-z][\s\S]*>/i;
    return regex.test(str);
  }
  function normalizeHTML(html) {
    return String(html).replace(/\s+/g, " ").trim();
  }
  function getHashTagsPro(inputText) {
    const regex = /(?:^|\s)(?:#)([a-zA-Z+-§\d]+)/gm;
    const matches = [];
    let match;
    while (match = regex.exec(inputText)) {
      matches.push(match[1].trim().replace(/\.|\,|\:|\//g, ""));
    }
    return matches;
  }
  function normalizeNameTag(tag) {
    return removeAcentos(tag).replace(/\ /g, "").toLowerCase().replace(/[^a-z0-9]/gi, "").replace(/[\u200B-\u200D\uFEFF]/g, "");
  }
  function installTexto() {
    const texto = {
      escapeRegExp,
      escapeComponent,
      normalizeMojibakeUtf8,
      replaceTextToUrl,
      extractHexColor,
      pad,
      extractEmails,
      extractAllTextBetweenQuotes,
      extractOnlyAlphaNum,
      joinAnd,
      is_html,
      normalizeHTML,
      getHashTagsPro,
      normalizeNameTag
    };
    getSeiPro().core.texto = texto;
    aliasGlobal("escapeRegExp", escapeRegExp);
    aliasGlobal("escapeComponent", escapeComponent);
    aliasGlobal("normalizeMojibakeUtf8", normalizeMojibakeUtf8);
    aliasGlobal("replaceTextToUrl", replaceTextToUrl);
    aliasGlobal("extractHexColor", extractHexColor);
    aliasGlobal("pad", pad);
    aliasGlobal("extractEmails", extractEmails);
    aliasGlobal("extractAllTextBetweenQuotes", extractAllTextBetweenQuotes);
    aliasGlobal("extractOnlyAlphaNum", extractOnlyAlphaNum);
    aliasGlobal("joinAnd", joinAnd);
    aliasGlobal("is_html", is_html);
    aliasGlobal("normalizeHTML", normalizeHTML);
    aliasGlobal("getHashTagsPro", getHashTagsPro);
    aliasGlobal("normalizeNameTag", normalizeNameTag);
    return texto;
  }

  // src/core/cor.js
  function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }
  function rgbToHexString(string) {
    string = typeof string !== "undefined" && string !== null ? string.substring(4, string.length - 1).replace(/ /g, "").split(",") : false;
    return string ? rgbToHex(parseInt(string[0]), parseInt(string[1]), parseInt(string[2])) : "";
  }
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function addAlpha(color, opacity) {
    const _opacity = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
  }
  function getBrightnessColor(value) {
    const rgb = hexToRgb(value);
    return Math.round((parseInt(rgb.r) * 299 + parseInt(rgb.g) * 587 + parseInt(rgb.b) * 114) / 1e3);
  }
  function installCor() {
    const cor = { componentToHex, rgbToHex, rgbToHexString, hexToRgb, addAlpha, getBrightnessColor };
    getSeiPro().core.cor = cor;
    aliasGlobal("componentToHex", componentToHex);
    aliasGlobal("rgbToHex", rgbToHex);
    aliasGlobal("rgbToHexString", rgbToHexString);
    aliasGlobal("hexToRgb", hexToRgb);
    aliasGlobal("addAlpha", addAlpha);
    aliasGlobal("getBrightnessColor", getBrightnessColor);
    return cor;
  }

  // src/core/feriados.js
  function easterDay(y) {
    const moment = globalRef.moment;
    const c = Math.floor(y / 100);
    const n = y - 19 * Math.floor(y / 19);
    const k = Math.floor((c - 17) / 25);
    let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor(i / 30);
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    const l = i - j;
    const m = 3 + Math.floor((l + 40) / 44);
    const d = l + 28 - 31 * Math.floor(m / 4);
    return moment([y, m - 1, d]);
  }
  function getHolidaysBr(y) {
    const moment = globalRef.moment;
    const anoNovo = moment("01/01/" + y, "DD/MM/YYYY");
    const carnaval1 = easterDay(y).add(-48, "d");
    const carnaval2 = easterDay(y).add(-47, "d");
    const paixaoCristo = easterDay(y).add(-2, "d");
    const pascoa = easterDay(y);
    const tiradentes = moment("21/04/" + y, "DD/MM/YYYY");
    const corpusChristi = easterDay(y).add(60, "d");
    const diaTrabalho = moment("01/05/" + y, "DD/MM/YYYY");
    const diaIndependencia = moment("07/09/" + y, "DD/MM/YYYY");
    const nossaSenhora = moment("12/10/" + y, "DD/MM/YYYY");
    const finados = moment("02/11/" + y, "DD/MM/YYYY");
    const conscienciaNegra = moment("20/11/" + y, "DD/MM/YYYY");
    const proclamaRepublica = moment("15/11/" + y, "DD/MM/YYYY");
    const natal = moment("25/12/" + y, "DD/MM/YYYY");
    return [
      { m: anoNovo, dia: "Ano Novo", d: anoNovo.format("DD/MM/YYYY"), d_: anoNovo.format("YYYY-MM-DD") },
      { m: carnaval1, dia: "Carnaval", d: carnaval1.format("DD/MM/YYYY"), d_: carnaval1.format("YYYY-MM-DD") },
      { m: carnaval2, dia: "Carnaval", d: carnaval2.format("DD/MM/YYYY"), d_: carnaval2.format("YYYY-MM-DD") },
      { m: paixaoCristo, dia: "Paix\xE3o de Cristo", d: paixaoCristo.format("DD/MM/YYYY"), d_: paixaoCristo.format("YYYY-MM-DD") },
      { m: pascoa, dia: "P\xE1scoa", d: pascoa.format("DD/MM/YYYY"), d_: pascoa.format("YYYY-MM-DD") },
      { m: tiradentes, dia: "Tiradentes", d: tiradentes.format("DD/MM/YYYY"), d_: tiradentes.format("YYYY-MM-DD") },
      { m: corpusChristi, dia: "Corpus Christi", d: corpusChristi.format("DD/MM/YYYY"), d_: corpusChristi.format("YYYY-MM-DD") },
      { m: diaTrabalho, dia: "Dia do Trabalho", d: diaTrabalho.format("DD/MM/YYYY"), d_: diaTrabalho.format("YYYY-MM-DD") },
      { m: diaIndependencia, dia: "Dia da Independ\xEAncia do Brasil", d: diaIndependencia.format("DD/MM/YYYY"), d_: diaIndependencia.format("YYYY-MM-DD") },
      { m: nossaSenhora, dia: "Nossa Senhora Aparecida", d: nossaSenhora.format("DD/MM/YYYY"), d_: nossaSenhora.format("YYYY-MM-DD") },
      { m: finados, dia: "Finados", d: finados.format("DD/MM/YYYY"), d_: finados.format("YYYY-MM-DD") },
      { m: conscienciaNegra, dia: "Dia Nacional de Zumbi e da Consci\xEAncia Negra", d: conscienciaNegra.format("DD/MM/YYYY"), d_: conscienciaNegra.format("YYYY-MM-DD") },
      { m: proclamaRepublica, dia: "Proclama\xE7\xE3o da Rep\xFAblica", d: proclamaRepublica.format("DD/MM/YYYY"), d_: proclamaRepublica.format("YYYY-MM-DD") },
      { m: natal, dia: "Natal", d: natal.format("DD/MM/YYYY"), d_: natal.format("YYYY-MM-DD") }
    ];
  }
  function getHolidayBetweenDates(date, dateTo, addHolidays = false) {
    const moment = globalRef.moment;
    const $ = globalRef.jQuery || globalRef.$;
    const dateStart = moment(date, "YYYY-MM-DD");
    const dateEnd = moment(dateTo, "YYYY-MM-DD");
    const datesHoliday = [];
    while (dateEnd > dateStart || dateStart.format("Y") === dateEnd.format("Y")) {
      $.merge(datesHoliday, getHolidaysBr(parseInt(dateStart.format("YYYY"))));
      if (addHolidays) {
        const addHoliday = $.map(addHolidays, function(v) {
          if (v.recorrente) {
            const feriado_data = moment(v.feriado_data + "/" + dateStart.format("YYYY"), "DD/MM/YYYY");
            return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format("DD/MM/YYYY"), d_: feriado_data.format("YYYY-MM-DD"), meio_periodo: v.meio_periodo };
          } else if (!v.recorrente && dateStart.format("Y") == moment(v.feriado_data, "DD/MM/YYYY").format("Y")) {
            const feriado_data = moment(v.feriado_data, "DD/MM/YYYY");
            return { m: feriado_data, dia: v.nome_feriado, d: feriado_data.format("DD/MM/YYYY"), d_: feriado_data.format("YYYY-MM-DD"), meio_periodo: v.meio_periodo };
          }
        });
        $.merge(datesHoliday, addHoliday);
      }
      dateStart.add(1, "year");
    }
    return datesHoliday;
  }
  function installFeriados() {
    const feriados = { easterDay, getHolidaysBr, getHolidayBetweenDates };
    getSeiPro().core.feriados = feriados;
    aliasGlobal("easterDay", easterDay);
    aliasGlobal("getHolidaysBr", getHolidaysBr);
    aliasGlobal("getHolidayBetweenDates", getHolidayBetweenDates);
    return feriados;
  }

  // src/core/datas.js
  function getDatesFormatBR(value) {
    const moment = globalRef.moment;
    return moment(value, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss") == "00:00:00" ? moment(value, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY") : moment(value, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm");
  }
  function randomDate(start, end, startHour, endHour) {
    const moment = globalRef.moment;
    const date = new Date(+start + Math.random() * (end - start));
    const hour = startHour + Math.random() * (endHour - startHour) | 0;
    date.setHours(hour);
    return moment(date).format("YYYY-MM-DD HH:mm:ss");
  }
  function getRecentDateRow(inicio, seconds) {
    const moment = globalRef.moment;
    if (moment().format("YYYY-MM-DD") == moment(inicio, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD")) {
      const diff = moment().add(seconds, "seconds").diff(moment(inicio, "YYYY-MM-DD HH:mm:ss"));
      return diff < 0 ? true : false;
    }
  }
  function calculeDatesDurationTemplate() {
    const duration = this.duration;
    let return_ = [];
    if (duration.years() == 1) {
      return_.push("Y [ano]");
    } else if (duration.years() > 1) {
      return_.push("Y [anos]");
    }
    if (duration.months() == 1) {
      return_.push("M [mes]");
    } else if (duration.months() > 1) {
      return_.push("M [meses]");
    } else if (duration.years() == 0 && duration.months() == 0 && duration.days() > 7) {
      if (duration.weeks() == 1) {
        return_.push("w [semana]");
      } else {
        return_.push("w [semanas]");
      }
    }
    if (duration.days() == 1) {
      return_.push("d [dia]");
    } else if (duration.days() > 1) {
      if (duration.months() == 0 && duration.days() % 7 === 0) {
      } else {
        return_.push("d [dias]");
      }
    } else if (duration.years() == 0 && duration.months() == 0 && duration.weeks() == 0 && duration.days() == 0) {
      return_.push("[hoje]");
    }
    return_ = return_.join(", ");
    return_ = return_ == "" ? "d [dias]" : return_;
    return return_;
  }
  function calculeDatesDuration(date, dateTo, countdays) {
    const moment = globalRef.moment;
    const diff = moment(date).diff(moment(dateTo), "milliseconds");
    const diff_d = moment(date).diff(moment(dateTo), "days");
    const day_formated = diff_d.toLocaleString("pt-BR");
    const diff_ = diff < 0 ? diff * -1 : moment(date).diff(moment(dateTo).add(-1, "d"), "milliseconds");
    let duration = moment.duration(diff_, "milliseconds");
    duration = typeof duration !== "undefined" && duration !== null && typeof duration.format !== "undefined" ? duration.format(calculeDatesDurationTemplate) : "";
    const day_txt = diff_d >= -1 && diff_d <= 1 ? "dia" : "dias";
    let duration_ = diff == 0 ? "hoje" : diff < 0 ? duration.trim() == "hoje" ? moment(date).fromNow() : duration.trim() + " atr\xE1s" : "em " + duration;
    duration_ = countdays && diff_d >= 1 ? day_formated + " " + day_txt + " atr\xE1s" : duration_;
    duration_ = countdays && diff_d <= -1 ? "em " + Math.abs(day_formated) + " " + day_txt : duration_;
    duration_ = countdays && diff_d == 0 ? day_formated + " " + day_txt : duration_;
    return duration_;
  }
  function getDateSemantic(config) {
    const moment = globalRef.moment;
    const jmespath = globalRef.jmespath;
    var formatDate = "YYYY-MM-DD HH:mm:ss";
    var displayFormat = config.displayformat ? config.displayformat : "DD/MM/YYYY";
    var duration = config.countdays ? moment(config.dateTo, formatDate).diff(moment(config.date, formatDate), "days") : moment(config.date, formatDate).diff(moment(config.dateTo, formatDate), "days");
    var listaFeriados = config.workday && config.countdays ? getHolidayBetweenDates(moment(config.date, formatDate).format("Y") + "-01-01", moment(config.dateTo, formatDate).format("Y") + "-01-01") : [];
    var arrayFeriados = config.workday && config.countdays ? jmespath.search(listaFeriados, "[*].d_") : [];
    var calcWorkday = config.workday ? moment().isoWeekdayCalc({
      rangeStart: moment(config.date, formatDate),
      rangeEnd: moment(config.dateTo, formatDate),
      weekdays: [1, 2, 3, 4, 5],
      exclusions: arrayFeriados
    }) : "";
    var calcWorkday_ = calcWorkday - 1;
    var day_txt = calcWorkday_ >= -1 && calcWorkday_ <= 1 ? "dia \xFAtil" : "dias \xFAteis";
    var txtCalcWorkday = config.workday && config.countdays && duration >= 1 ? calcWorkday_.toLocaleString("pt-BR") + " " + day_txt + " atr\xE1s" : "";
    txtCalcWorkday = config.workday && config.countdays && duration <= -1 ? "em " + calcWorkday_.toLocaleString("pt-BR") + " " + day_txt : txtCalcWorkday;
    txtCalcWorkday = config.workday && config.countdays && duration == 0 ? calcWorkday_.toLocaleString("pt-BR") + " " + day_txt : txtCalcWorkday;
    var frowNow = config.workday && config.countdays ? txtCalcWorkday : config.countdays ? calculeDatesDuration(config.dateTo, config.date, config.countdays) : calculeDatesDuration(config.date, config.dateTo, config.countdays);
    var duedate = config.duesetdate ? moment(config.dateDue, formatDate) : config.duecounter == "util" ? moment(config.date, formatDate).isoAddWeekdaysFromSet({
      "workdays": config.duenumber,
      "weekdays": [1, 2, 3, 4, 5],
      "exclusions": arrayFeriados
    }) : moment(config.date, formatDate).add(config.duenumber, "d");
    var alertdate = moment(config.dateTo, formatDate) > moment(duedate) ? true : false;
    var calcalert = alertdate ? moment(config.dateTo, formatDate).diff(moment(duedate), "days") : moment(duedate).diff(moment(config.dateTo, formatDate), "days");
    calcalert = calcalert.toLocaleString("pt-BR");
    var duecalcref = alertdate ? calcalert == 1 ? calcalert + " dia de atraso" : calcalert > 1 ? calcalert + " dias de atraso" : calcalert == 0 ? moment(duedate, formatDate).fromNow() : "" : calcalert == 1 ? "em " + calcalert + " dia" : calcalert > 1 ? "em " + calcalert + " dias" : calcalert == 0 ? moment(duedate, formatDate).fromNow() : "";
    return { date: config.date, dateref: frowNow, duedate: duedate.format(displayFormat), alertdate, calcalert, duecalcref };
  }
  function installDatas() {
    const datas = {
      getDatesFormatBR,
      randomDate,
      getRecentDateRow,
      calculeDatesDurationTemplate,
      calculeDatesDuration,
      getDateSemantic
    };
    getSeiPro().core.datas = datas;
    aliasGlobal("getDatesFormatBR", getDatesFormatBR);
    aliasGlobal("randomDate", randomDate);
    aliasGlobal("getRecentDateRow", getRecentDateRow);
    aliasGlobal("calculeDatesDurationTemplate", calculeDatesDurationTemplate);
    aliasGlobal("calculeDatesDuration", calculeDatesDuration);
    aliasGlobal("getDateSemantic", getDateSemantic);
    return datas;
  }

  // src/core/numeros.js
  function arrayMax(arr) {
    return arr.reduce(function(p, v) {
      return p > v ? p : v;
    });
  }
  function arrayMin(arr) {
    return arr.reduce(function(p, v) {
      return p < v ? p : v;
    });
  }
  function toNumBr(num) {
    return num.toString().replace(/\./g, ",");
  }
  function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }
  function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
  function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  function hasNumber(str) {
    return /\d/.test(str);
  }
  function onlyNumber(str) {
    return hasNumber(str) ? str.match(/\d+/g).join("") : str;
  }
  function avgArray(array) {
    let sum = 0;
    for (let i = 0; i < array.length; i++) {
      sum += parseInt(array[i], 10);
    }
    return sum / array.length;
  }
  function reverseArray(array) {
    return array.map((item, idx) => array[array.length - 1 - idx]);
  }
  function toArray(obj) {
    const len = obj.length;
    const arr = new Array(len);
    for (let i = 0; i < len; i++) {
      arr[i] = obj[i];
    }
    return arr;
  }
  function numberToLetter(number) {
    return (parseInt(number) + 9).toString(36).toUpperCase();
  }
  function decimalHourToMinute(minutes) {
    const sign = minutes < 0 ? "-" : "";
    const min = Math.floor(Math.abs(minutes));
    const sec = Math.floor(Math.abs(minutes) * 60 % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
  }
  function installNumeros() {
    const numeros = {
      arrayMax,
      arrayMin,
      toNumBr,
      isNumeric,
      roundToTwo,
      randomNumber,
      hasNumber,
      onlyNumber,
      avgArray,
      reverseArray,
      toArray,
      numberToLetter,
      decimalHourToMinute
    };
    getSeiPro().core.numeros = numeros;
    aliasGlobal("arrayMax", arrayMax);
    aliasGlobal("arrayMin", arrayMin);
    aliasGlobal("toNumBr", toNumBr);
    aliasGlobal("isNumeric", isNumeric);
    aliasGlobal("roundToTwo", roundToTwo);
    aliasGlobal("randomNumber", randomNumber);
    aliasGlobal("hasNumber", hasNumber);
    aliasGlobal("onlyNumber", onlyNumber);
    aliasGlobal("avgArray", avgArray);
    aliasGlobal("reverseArray", reverseArray);
    aliasGlobal("toArray", toArray);
    aliasGlobal("numberToLetter", numberToLetter);
    aliasGlobal("decimalHourToMinute", decimalHourToMinute);
    return numeros;
  }

  // src/core/serial.js
  function isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
  function tryParseJsonObject(jsonString) {
    try {
      const o = JSON.parse(jsonString);
      if (o && typeof o === "object" && !Array.isArray(o)) {
        return o;
      }
    } catch (e) {
    }
    return false;
  }
  function convertJsonBools(obj) {
    return JSON.parse(JSON.stringify(obj), (k, v) => v === "true" ? true : v === "false" ? false : v);
  }
  function isBase64(str) {
    try {
      return btoa(atob(str)) == str;
    } catch (err) {
      return false;
    }
  }
  function installSerial() {
    const serial = { isJson, tryParseJsonObject, convertJsonBools, isBase64 };
    getSeiPro().core.serial = serial;
    aliasGlobal("isJson", isJson);
    aliasGlobal("tryParseJsonObject", tryParseJsonObject);
    aliasGlobal("convertJsonBools", convertJsonBools);
    aliasGlobal("isBase64", isBase64);
    return serial;
  }

  // src/core/prazos.js
  function getRecalculaPrazo(data_ref, hora_format, prazo, config_unidade) {
    const moment = globalRef.moment;
    const jmespath = globalRef.jmespath;
    var workday = config_unidade.count_dias_uteis;
    var config_feriados = typeof config_unidade.feriados !== "undefined" && config_unidade.feriados !== null ? config_unidade.feriados : false;
    var arrayFeriados = workday ? jmespath.search(getHolidayBetweenDates(moment(data_ref, hora_format).format("Y") + "-01-01", moment(data_ref, hora_format).add(1, "Y").format("Y") + "-01-01", config_feriados), "[*].d_") : [];
    var prazoEntrega = workday ? moment(data_ref, hora_format).isoAddWeekdaysFromSet({
      "workdays": prazo,
      "weekdays": [1, 2, 3, 4, 5],
      "exclusions": arrayFeriados
    }).format(hora_format) : moment(data_ref, hora_format).add(prazo, "d").format(hora_format);
    return prazoEntrega;
  }
  function extractFirstQuotedValue(text) {
    if (typeof text !== "string") return "";
    var content = text.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g"));
    return content && content !== null && content.length > 0 && content[0] != "" ? content[0] : text;
  }
  function normalizeNativePrazoTooltip(text) {
    if (typeof text === "undefined" || text === null) return "";
    text = String(text).replace(/<[^>]*>/gm, "").replace(/\\n/g, " ").trim();
    text = extractFirstQuotedValue(text).replace(/\\n/g, " ").trim();
    text = text.replace(/^controle de prazo:\s*/i, "").trim();
    text = text.replace(/\s+/g, " ").trim();
    return text;
  }
  function parseControlePrazoNativo(tooltip, svgSrc) {
    const moment = globalRef.moment;
    var content = normalizeNativePrazoTooltip(tooltip);
    var src = typeof svgSrc !== "undefined" && svgSrc !== null ? String(svgSrc).toLowerCase() : "";
    var normalized = removeAcentos(content).toLowerCase();
    var concludedBySrc = src.indexOf("controle_prazo2.svg") !== -1;
    var dueMatch = content.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/i);
    var concludedMatch = normalized.match(/concluid(?:o|a)(?:\s+em)?\s+(\d{1,2}\/\d{1,2}\/\d{4})/i);
    var dateFinished = concludedMatch !== null ? moment(concludedMatch[1], "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59") : false;
    var dateDue = !concludedMatch && dueMatch !== null ? moment(dueMatch[0], "DD/MM/YYYY").format("YYYY-MM-DD 23:59:59") : false;
    var dateSort = dateFinished || dateDue || false;
    var responsible = false;
    if (!concludedMatch && dueMatch !== null) {
      responsible = content.slice(0, content.indexOf(dueMatch[0])).replace(/[\s:-]+$/, "").trim();
      responsible = responsible !== "" ? responsible : false;
    }
    var diasRestantes = null;
    var daysMatch = content.match(/\(([-+]?\d+)\s*dias?(?:\s+uteis)?(?:\s+de atraso)?\)/i);
    if (daysMatch !== null) {
      diasRestantes = parseInt(daysMatch[1], 10);
    } else if (dateDue) {
      diasRestantes = moment(dateDue, "YYYY-MM-DD HH:mm:ss").startOf("day").diff(moment().startOf("day"), "days");
    }
    var concluido = concludedBySrc || concludedMatch !== null;
    var vencido = !concluido && diasRestantes !== null ? diasRestantes < 0 : false;
    return {
      fonte: "nativo",
      content: content || false,
      responsavel: responsible,
      dateDue,
      dateFinished,
      dateSort,
      diasRestantes,
      concluido,
      vencido,
      status: concluido ? "concluido" : vencido ? "vencido" : dateDue ? "ativo" : "sem_data",
      svgSrc: src || false
    };
  }
  function parsePrazoTag(tag) {
    var content = typeof tag !== "undefined" ? tag.match(RegExp(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/, "g")) : false;
    content = content && content !== null && content.length > 0 && content[0] != "" ? content[0] : false;
    var dateTo = content && removeAcentos(content).toLowerCase().indexOf("ate") !== -1 ? true : false;
    var dateContent = content ? content.match(/(0[1-9]|[1-2][0-9]|3[0-1])\/(0[1-9]|1[0-2])\/[0-9]{4}/img) : null;
    var timeContent = content ? content.match(/(\d{1,2}:\d{2})/img) : null;
    var dateTag = dateContent !== null ? dateContent[0] + " " + (timeContent !== null ? timeContent[0] : "23:59") : false;
    return { content, dateTo, dateTag };
  }
  function parsePrazoTooltip(textTag) {
    const moment = globalRef.moment;
    textTag = typeof textTag !== "undefined" && textTag !== null ? textTag : "";
    var regexDue = /(ate )(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDateDue = regexDue.exec(removeAcentos(textTag.trim()).toLowerCase().replaceAll("  ", " "));
    var datePrazoDue = checkDateDue !== null ? moment(checkDateDue[0], "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : false;
    var regex = /(\d{1,2})\/(\d{1,2})\/(\d{4})/i;
    var checkDate = regex.exec(removeAcentos(textTag.trim()));
    var datePrazo = checkDateDue === null && checkDate !== null ? moment(checkDate[0], "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss") : false;
    return { datePrazo, datePrazoDue };
  }
  function getDateBoxState(config, resultDate) {
    const moment = globalRef.moment;
    var formatDate = "YYYY-MM-DD HH:mm:ss";
    var tagName = moment(config.date, formatDate).diff(moment(), "days") > 0 ? { name: "Seguinte", value: "date_seguinte", color: "#eef4f9" } : { name: "Vencida", value: "date_vencido", color: "#f9e2e0" };
    tagName = config.displaydue ? { name: "No prazo", value: "date_noprazo", color: "#eef4f9" } : tagName;
    tagName = (config.duedate || config.duesetdate) && resultDate.alertdate ? { name: "Atrasada", value: "date_atrasado", color: "#f9e2e0" } : tagName;
    tagName = moment().format(formatDate) == config.dateDue ? { name: "Hoje", value: "date_hoje", color: "#f9e2e0" } : tagName;
    tagName = config.deliverydoc ? { name: "Entregue", value: "date_entregue", color: "#ddf1dd" } : tagName;
    tagName = typeof config.ratingdoc !== "undefined" && config.ratingdoc ? { name: "Avaliada", value: "date_avaliado", color: "#f1ecdd" } : tagName;
    tagName = typeof config.paused !== "undefined" && config.paused ? { name: "Pausada", value: "date_pausado", color: "#f1ecdd" } : tagName;
    tagName = typeof config.senddoc !== "undefined" && config.senddoc ? { name: "Arquivada", value: "date_enviado", color: "#ececec" } : tagName;
    tagName = typeof config.nametag !== "undefined" && config.nametag ? config.nametag : tagName;
    return tagName;
  }
  function getProgressPercent(config) {
    const moment = globalRef.moment;
    var max = moment(config.dateDue, "YYYY-MM-DD").diff(moment(config.date, "YYYY-MM-DD"), "days");
    var progress = moment().diff(moment(config.date, "YYYY-MM-DD"), "days");
    if ((config.duesetdate || config.duedate) && progress <= max && progress >= 0) {
      return { show: true, percent: Math.round(progress / max * 100), max, progress };
    }
    return { show: false, percent: 0, max, progress };
  }
  function installPrazos() {
    const prazos = { getRecalculaPrazo, parseControlePrazoNativo, parsePrazoTag, parsePrazoTooltip, getDateBoxState, getProgressPercent };
    getSeiPro().core.prazos = prazos;
    aliasGlobal("getRecalculaPrazo", getRecalculaPrazo);
    aliasGlobal("parseControlePrazoNativo", parseControlePrazoNativo);
    aliasGlobal("parsePrazoTag", parsePrazoTag);
    aliasGlobal("parsePrazoTooltip", parsePrazoTooltip);
    aliasGlobal("getDateBoxState", getDateBoxState);
    aliasGlobal("getProgressPercent", getProgressPercent);
    return prazos;
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
    function isAjaxRedirectAction(xhr, action, origin = false) {
      if (!xhr || typeof xhr.responseURL !== "string" || xhr.responseURL === "") {
        return false;
      }
      const params = getSeiPro().core.util.getParamsUrlPro(xhr.responseURL);
      if (!params || params.acao !== action) {
        return false;
      }
      if (origin === false || origin === null || typeof origin === "undefined") {
        return true;
      }
      return typeof params.acao_origem === "undefined" || params.acao_origem === origin;
    }
    const urls = { getParams, buildQuery, appendQuery, isAjaxRedirectAction };
    getSeiPro().sei.urls = urls;
    aliasGlobal("getParamsUrlPro", getSeiPro().core.util.getParamsUrlPro);
    aliasGlobal("isAjaxRedirectAction", isAjaxRedirectAction);
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
    installTexto();
    installCor();
    installDatas();
    installFeriados();
    installNumeros();
    installSerial();
    installPrazos();
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
