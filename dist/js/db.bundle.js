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
    return root;
  }

  // src/platform/runtime.js
  function runtimeApi() {
    if (typeof globalRef.browser !== "undefined" && globalRef.browser.runtime) {
      return globalRef.browser.runtime;
    }
    if (typeof globalRef.chrome !== "undefined" && globalRef.chrome.runtime) {
      return globalRef.chrome.runtime;
    }
    return null;
  }
  function createRuntime() {
    const isChrome = typeof globalRef.browser === "undefined";
    if (isChrome && typeof globalRef.chrome !== "undefined") {
      globalRef.browser = globalRef.chrome;
    }
    function getUrlExtension(url) {
      const rt = runtimeApi();
      if (rt && typeof rt.getURL === "function") return rt.getURL(url);
      throw new Error("SeiPro.getUrlExtension: chrome.runtime indispon\xEDvel no mundo isolado.");
    }
    function getManifestExtension() {
      const rt = runtimeApi();
      return rt && typeof rt.getManifest === "function" ? rt.getManifest() : {};
    }
    function pathExtensionSEIPro() {
      return getUrlExtension("js/sei-pro.js").toString().replace("js/sei-pro.js", "");
    }
    const runtime = { isChrome, getUrlExtension, getManifestExtension, pathExtensionSEIPro };
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

  // src/core/async.js
  var DEFAULT_BAG_KEY = "__SEI_PRO_RETRY__";
  function resolveBag(bag) {
    if (bag) return bag;
    if (typeof globalRef === "undefined") return {};
    return globalRef[DEFAULT_BAG_KEY] || (globalRef[DEFAULT_BAG_KEY] = {});
  }
  function retryWithProgress(opts) {
    opts = opts || {};
    const run = opts.run;
    const progress = typeof opts.progress === "number" ? opts.progress : 0;
    const key = opts.key != null ? opts.key : "default";
    const bag = resolveBag(opts.bag);
    const minDelay = opts.minDelay || 300;
    const maxDelay = opts.maxDelay || 2e3;
    const wallClockMs = opts.wallClockMs || 3e4;
    const noProgressLimit = opts.noProgressLimit || 15;
    const st = bag[key] || { count: 0, timer: null, startTime: Date.now(), bestProgress: -1, gaveUp: false };
    if (st.timer) {
      clearTimeout(st.timer);
      st.timer = null;
    }
    if (progress > st.bestProgress) {
      st.bestProgress = progress;
      st.count = 0;
      st.gaveUp = false;
    }
    if (st.gaveUp) {
      bag[key] = st;
      return false;
    }
    const elapsed = Date.now() - st.startTime;
    if (st.count >= noProgressLimit || elapsed >= wallClockMs) {
      st.gaveUp = true;
      st.timer = null;
      bag[key] = st;
      if (typeof opts.onGiveUp === "function") {
        opts.onGiveUp({ key, progress: st.bestProgress, elapsed, reason: opts.reason });
      }
      return false;
    }
    const delay = Math.min(minDelay * Math.pow(2, st.count), maxDelay);
    st.count++;
    st.timer = setTimeout(function() {
      st.timer = null;
      bag[key] = st;
      if (typeof run === "function") run();
    }, delay);
    bag[key] = st;
    return true;
  }
  function clearRetry(key, bag) {
    bag = resolveBag(bag);
    key = key != null ? key : "default";
    if (bag[key]) {
      if (bag[key].timer) clearTimeout(bag[key].timer);
      delete bag[key];
    }
  }
  function nudgeOnce(flagKey, eventNames, handler) {
    if (typeof globalRef === "undefined" || typeof globalRef.addEventListener !== "function") return;
    if (globalRef[flagKey]) return;
    globalRef[flagKey] = true;
    (eventNames || []).forEach(function(name) {
      globalRef.addEventListener(name, handler);
    });
  }
  function installAsync() {
    const async = { retryWithProgress, clearRetry, nudgeOnce };
    getSeiPro().core.async = async;
    aliasGlobal("retryWithProgress", retryWithProgress);
    aliasGlobal("clearRetry", clearRetry);
    aliasGlobal("nudgeOnce", nudgeOnce);
    return async;
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
    function pickConfigGeral(configBasePro) {
      if (!Array.isArray(configBasePro)) return null;
      for (let i = 0; i < configBasePro.length; i++) {
        const el = configBasePro[i];
        if (el && Array.isArray(el.configGeral)) return el.configGeral;
      }
      return null;
    }
    function queryConfigValue(name) {
      const configGeral = pickConfigGeral(readConfigBasePro());
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
      var configBasePro = readConfigBasePro();
      const configGeral = pickConfigGeral(configBasePro);
      var dataValuesConfig = null;
      if (Array.isArray(configGeral)) {
        for (let i = 0; i < configGeral.length; i++) {
          if (configGeral[i] && configGeral[i].name === name) {
            dataValuesConfig = configGeral[i].value !== null && typeof configGeral[i].value !== "undefined" ? configGeral[i].value : null;
            break;
          }
        }
      }
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
  function encodeURI_toHex(str) {
    let hex, i;
    let result = "";
    for (i = 0; i < str.length; i++) {
      const test = removeAcentos(str.charAt(i));
      if (str.charAt(i) === " ") {
        result += "+";
      } else if (str.charAt(i) !== test && str.charAt(i) !== "") {
        hex = str.charCodeAt(i).toString(16);
        result += ("%" + hex).slice(-4).toUpperCase();
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }
  function encodeJSON_toHex(str) {
    let hex, i;
    let result = "";
    for (i = 0; i < str.length; i++) {
      const test = removeAcentos(str.charAt(i));
      if (str.charAt(i) !== test && str.charAt(i) !== "") {
        hex = str.charCodeAt(i).toString(16);
        result += "\\u" + ("00" + hex).slice(-4).toUpperCase();
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }
  function unicodeToChar(text) {
    if (typeof text !== "undefined" && text !== null && text != "") {
      return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
        return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
      });
    }
    return text;
  }
  var COMBINING_MARKS_RE = new RegExp("[\\u0300-\\u036f]", "g");
  function normalizeSignatureSelectionTextPro(text) {
    return String(text || "").normalize("NFD").replace(COMBINING_MARKS_RE, "").replace(/\s+/g, " ").trim().toLowerCase();
  }
  function getNrSei(nameDoc) {
    let nr = nameDoc.split(" ");
    nr = nameDoc.indexOf(" ") !== -1 ? nr[nr.length - 1] : "";
    nr = nr.indexOf("(") !== -1 ? nr.replace(")", "").replace("(", "").trim() : nr;
    return nr;
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
      normalizeNameTag,
      encodeURI_toHex,
      encodeJSON_toHex,
      unicodeToChar,
      normalizeSignatureSelectionTextPro,
      getNrSei
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
    aliasGlobal("encodeURI_toHex", encodeURI_toHex);
    aliasGlobal("encodeJSON_toHex", encodeJSON_toHex);
    aliasGlobal("unicodeToChar", unicodeToChar);
    aliasGlobal("normalizeSignatureSelectionTextPro", normalizeSignatureSelectionTextPro);
    aliasGlobal("getNrSei", getNrSei);
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

  // src/core/quickfilter.js
  function normalizeFilterText(text) {
    text = typeof text === "string" ? text : "";
    text = removeAcentos(text.toLowerCase());
    return text.replace(/\s+/g, " ").trim();
  }
  function getFilterTokens(text) {
    var query = normalizeFilterText(text);
    return query === "" ? [] : uniqPro(query.split(" ").filter(function(token) {
      return token !== "";
    }));
  }
  function getNormalizedIndexMap(text) {
    var normalized = "";
    var map = [];
    for (var i = 0; i < text.length; i++) {
      var normalizedChar = removeAcentos(text.charAt(i).toLowerCase());
      if (typeof normalizedChar !== "string") normalizedChar = text.charAt(i).toLowerCase();
      for (var j = 0; j < normalizedChar.length; j++) {
        normalized += normalizedChar.charAt(j);
        map.push(i);
      }
    }
    return { normalized, map };
  }
  function mergeHighlightRanges(ranges) {
    if (!ranges.length) return [];
    ranges.sort(function(a, b) {
      return a.start - b.start || a.end - b.end;
    });
    var merged = [ranges[0]];
    for (var i = 1; i < ranges.length; i++) {
      var current = ranges[i];
      var last = merged[merged.length - 1];
      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
      } else {
        merged.push(current);
      }
    }
    return merged;
  }
  function buildHighlightRanges(text, tokens) {
    if (!tokens.length || !text) return [];
    var mapData = getNormalizedIndexMap(text);
    var normalized = mapData.normalized;
    var indexMap = mapData.map;
    var ranges = [];
    tokens.forEach(function(token) {
      var startIndex = 0;
      while (startIndex < normalized.length) {
        var foundIndex = normalized.indexOf(token, startIndex);
        if (foundIndex === -1) break;
        var rawStart = indexMap[foundIndex];
        var rawEndIndex = foundIndex + token.length - 1;
        var rawEnd = indexMap[rawEndIndex] + 1;
        ranges.push({ start: rawStart, end: rawEnd });
        startIndex = foundIndex + token.length;
      }
    });
    return mergeHighlightRanges(ranges);
  }
  function installQuickFilter() {
    const quickfilter = {
      normalizeFilterText,
      getFilterTokens,
      getNormalizedIndexMap,
      mergeHighlightRanges,
      buildHighlightRanges
    };
    getSeiPro().core.quickfilter = quickfilter;
    aliasGlobal("normalizeQuickPageFilterText", normalizeFilterText);
    aliasGlobal("getQuickPageFilterTokens", getFilterTokens);
    aliasGlobal("getNormalizedIndexMap", getNormalizedIndexMap);
    aliasGlobal("mergeQuickPageHighlightRanges", mergeHighlightRanges);
    aliasGlobal("buildQuickPageHighlightRanges", buildHighlightRanges);
    return quickfilter;
  }

  // src/core/quickfilter-dom.js
  var HIGHLIGHT_CLASS = "seipro-quick-highlight";
  function resolveDoc(scope) {
    if (scope && scope.ownerDocument) return scope.ownerDocument;
    if (scope && scope.nodeType === 9) return scope;
    return typeof document !== "undefined" ? document : null;
  }
  function clearHighlights(scope) {
    var doc = resolveDoc(scope);
    if (!doc) return;
    var root = scope || doc.body;
    if (!root || typeof root.querySelectorAll !== "function") return;
    var spans = root.querySelectorAll("." + HIGHLIGHT_CLASS);
    for (var i = 0; i < spans.length; i++) {
      var span = spans[i];
      if (span.parentNode) {
        span.parentNode.replaceChild(doc.createTextNode(span.textContent), span);
      }
    }
    if (typeof root.normalize === "function") root.normalize();
  }
  function highlightTextNode(node, tokens) {
    var text = node.nodeValue;
    if (!text || !text.trim()) return;
    var ranges = buildHighlightRanges(text, tokens);
    if (!ranges.length) return;
    var doc = node.ownerDocument || (typeof document !== "undefined" ? document : null);
    if (!doc) return;
    var fragment = doc.createDocumentFragment();
    var cursor = 0;
    ranges.forEach(function(range) {
      if (range.start > cursor) {
        fragment.appendChild(doc.createTextNode(text.slice(cursor, range.start)));
      }
      var span = doc.createElement("span");
      span.className = HIGHLIGHT_CLASS;
      span.textContent = text.slice(range.start, range.end);
      fragment.appendChild(span);
      cursor = range.end;
    });
    if (cursor < text.length) {
      fragment.appendChild(doc.createTextNode(text.slice(cursor)));
    }
    if (node.parentNode) node.parentNode.replaceChild(fragment, node);
  }
  function applyHighlight(container, tokens, options) {
    options = options || {};
    if (!container) return;
    var doc = resolveDoc(container);
    if (!doc || typeof doc.createTreeWalker !== "function") return;
    clearHighlights(container);
    if (!tokens || !tokens.length) return;
    var shouldSkip = typeof options.shouldSkip === "function" ? options.shouldSkip : function() {
      return false;
    };
    var walker = doc.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        return shouldSkip(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (var i = 0; i < nodes.length; i++) highlightTextNode(nodes[i], tokens);
  }
  function installQuickFilterDom() {
    const quickfilterDom = {
      HIGHLIGHT_CLASS,
      clearHighlights,
      highlightTextNode,
      applyHighlight
    };
    getSeiPro().core.quickfilterDom = quickfilterDom;
    return quickfilterDom;
  }

  // src/core/sticknote.js
  function parseSticknoteHomeLabel(label) {
    label = normalizeMojibakeUtf8(label);
    label = typeof label === "string" ? label : "";
    if (!label) {
      return false;
    }
    var match = label.match(/^Anota(?:ç|c)(?:ã|a)o\s*\/\s*([\s\S]*?)\s+\/\s+(.*?)\s+em\s+\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/i);
    if (!match) {
      return false;
    }
    return {
      text: match[1].trim(),
      user: match[2].trim()
    };
  }
  function normalizeSticknoteHomeText(value) {
    value = typeof value === "string" ? value : "";
    return value.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\\r/g, "\n").replace(/\r\n/g, "\n").replace(/\r/g, "\n").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  function parseSticknoteChecklistLine(line) {
    line = typeof line === "string" ? line : "";
    var hasUnchecked = line.indexOf("[ ]") !== -1;
    var checked = line.indexOf("[X]") !== -1;
    var isItem = hasUnchecked || checked;
    var text = line;
    if (checked) {
      text = line.replace("[X]", "").trim();
    } else if (hasUnchecked) {
      text = line.replace("[ ]", "").trim();
    }
    return { isItem, checked, text };
  }
  function installSticknote() {
    const sticknote = {
      parseSticknoteHomeLabel,
      normalizeSticknoteHomeText,
      parseSticknoteChecklistLine
    };
    getSeiPro().core.sticknote = sticknote;
    aliasGlobal("parseSticknoteHomeLabel", parseSticknoteHomeLabel);
    aliasGlobal("normalizeSticknoteHomeText", normalizeSticknoteHomeText);
    aliasGlobal("parseSticknoteChecklistLine", parseSticknoteChecklistLine);
    return sticknote;
  }

  // src/core/docslote.js
  var docsLoteSpecialChars = { "\xC0": "&Agrave;", "\xC1": "&Aacute;", "\xC2": "&Acirc;", "\xC3": "&Atilde;", "\xC4": "&Auml;", "\xC5": "&Aring;", "\xE0": "&agrave;", "\xE1": "&aacute;", "\xE2": "&acirc;", "\xE3": "&atilde;", "\xE4": "&auml;", "\xE5": "&aring;", "\xC6": "&AElig;", "\xE6": "&aelig;", "\xDF": "&szlig;", "\xC7": "&Ccedil;", "\xE7": "&ccedil;", "\xC8": "&Egrave;", "\xC9": "&Eacute;", "\xCA": "&Ecirc;", "\xCB": "&Euml;", "\xE8": "&egrave;", "\xE9": "&eacute;", "\xEA": "&ecirc;", "\xEB": "&euml;", "\u0192": "&#131;", "\xCC": "&Igrave;", "\xCD": "&Iacute;", "\xCE": "&Icirc;", "\xCF": "&Iuml;", "\xEC": "&igrave;", "\xED": "&iacute;", "\xEE": "&icirc;", "\xEF": "&iuml;", "\xD1": "&Ntilde;", "\xF1": "&ntilde;", "\xD2": "&Ograve;", "\xD3": "&Oacute;", "\xD4": "&Ocirc;", "\xD5": "&Otilde;", "\xD6": "&Ouml;", "\xF2": "&ograve;", "\xF3": "&oacute;", "\xF4": "&ocirc;", "\xF5": "&otilde;", "\xF6": "&ouml;", "\xD8": "&Oslash;", "\xF8": "&oslash;", "\u0152": "&#140;", "\u0153": "&#156;", "\u0160": "&#138;", "\u0161": "&#154;", "\xD9": "&Ugrave;", "\xDA": "&Uacute;", "\xDB": "&Ucirc;", "\xDC": "&Uuml;", "\xF9": "&ugrave;", "\xFA": "&uacute;", "\xFB": "&ucirc;", "\xFC": "&uuml;", "\xB5": "&#181;", "\xD7": "&#215;", "\xDD": "&Yacute;", "\u0178": "&#159;", "\xFD": "&yacute;", "\xFF": "&yuml;", "\xB0": "&#176;", "\xBA": "&#176;", "\u2020": "&#134;", "\u2021": "&#135;", "\xB1": "&#177;", "\xAB": "&#171;", "\xBB": "&#187;", "\xBF": "&#191;", "\xA1": "&#161;", "\xB7": "&#183;", "\u2022": "&#149;", "\u2122": "&#153;", "\xA9": "&copy;", "\xAE": "&reg;", "\xA7": "&#167;", "\xB6": "&#182;" };
  var docsLoteNormalCharsUtf8 = { "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC6": "_", "\xE6": "_", "\xDF": "B", "\xC7": "C", "\xE7": "c", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\u0192": "f", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xD8": "_", "\xF8": "_", "\u0152": "_", "\u0153": "_", "\u0160": "S", "\u0161": "S", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xB5": "u", "\xD7": "_", "\xDD": "Y", "\u0178": "Y", "\xFD": "y", "\xFF": "y", "\xB0": "", "\xBA": "", "\u2020": "_", "\u2021": "_", "\xB1": "_", "\xAB": "_", "\xBB": "_", "\xBF": "_", "\xA1": "_", "\xB7": "_", "\u2022": "_", "\u2122": "_", "\xA9": "_", "\xAE": "_", "\xA7": "_", "\xB6": "_" };
  var docsLoteNormalCharsIso = { "\xC0": "A", "\xC1": "A", "\xC2": "A", "\xC3": "A", "\xC4": "A", "\xC5": "A", "\xE0": "a", "\xE1": "a", "\xE2": "a", "\xE3": "a", "\xE4": "a", "\xE5": "a", "\xC6": "_", "\xE6": "_", "\xDF": "B", "\xC7": "C", "\xE7": "c", "\xC8": "E", "\xC9": "E", "\xCA": "E", "\xCB": "E", "\xE8": "e", "\xE9": "e", "\xEA": "e", "\xEB": "e", "\u0192": "f", "\xCC": "I", "\xCD": "I", "\xCE": "I", "\xCF": "I", "\xEC": "i", "\xED": "i", "\xEE": "i", "\xEF": "i", "\xD1": "N", "\xF1": "n", "\xD2": "O", "\xD3": "O", "\xD4": "O", "\xD5": "O", "\xD6": "O", "\xF2": "o", "\xF3": "o", "\xF4": "o", "\xF5": "o", "\xF6": "o", "\xD8": "_", "\xF8": "_", "\u0152": "_", "\u0153": "_", "\u0160": "S", "\u0161": "S", "\xD9": "U", "\xDA": "U", "\xDB": "U", "\xDC": "U", "\xF9": "u", "\xFA": "u", "\xFB": "u", "\xFC": "u", "\xB5": "u", "\xD7": "_", "\xDD": "Y", "\u0178": "Y", "\xFD": "y", "\xFF": "y", "\xB0": "", "\xBA": "", "\u2020": "_", "\u2021": "_", "\xB1": "_", "\xAB": "_", "\xBB": "_", "\xBF": "_", "\xA1": "_", "\xB7": "_", "\u2022": "_", "\u2122": "_", "\xA9": "_", "\xAE": "_", "\xA7": "_", "\xB6": "_" };
  function getDocsLoteNormalChars(encoding) {
    return encoding === "utf-8" ? docsLoteNormalCharsUtf8 : docsLoteNormalCharsIso;
  }
  function hasDocsLoteSpecialChars(text, encoding) {
    if (typeof text !== "string" || text === "") return false;
    var map = getDocsLoteNormalChars(encoding);
    var regex = new RegExp(Object.keys(map).join("|"));
    return regex.test(text);
  }
  function encodeDocsLoteSpecialChars(text) {
    if (typeof text !== "string") return text;
    var regex = new RegExp(Object.keys(docsLoteSpecialChars).join("|"), "g");
    return text.replace(regex, function(match) {
      return docsLoteSpecialChars[match];
    });
  }
  function parseDocsLoteDocTitle(docTitle) {
    if (typeof docTitle !== "string" || docTitle === "") {
      return { nrSEI: false, nomeDocumento: false };
    }
    var parts = docTitle.split("-");
    return {
      nrSEI: typeof parts[1] !== "undefined" ? parts[1].trim() : false,
      nomeDocumento: typeof parts[2] !== "undefined" ? parts[2].trim() : false
    };
  }
  function installDocsLote() {
    const docslote = {
      docsLoteSpecialChars,
      docsLoteNormalCharsUtf8,
      docsLoteNormalCharsIso,
      getDocsLoteNormalChars,
      hasDocsLoteSpecialChars,
      encodeDocsLoteSpecialChars,
      parseDocsLoteDocTitle
    };
    getSeiPro().core.docslote = docslote;
    aliasGlobal("docsLote_specialChars", docsLoteSpecialChars);
    aliasGlobal("docsLote_normalChars_utf8", docsLoteNormalCharsUtf8);
    aliasGlobal("docsLote_normalChars_iso", docsLoteNormalCharsIso);
    return docslote;
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

  // src/platform/messaging.js
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
          'SeiPro.messaging: chrome.runtime indispon\xEDvel. A\xE7\xE3o "' + action + '" n\xE3o p\xF4de ser entregue ao service worker.'
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

  // src/platform/storage.js
  function installStorage() {
    function call(action, area, payload) {
      return getSeiPro().core.messaging.sendMessage(
        Object.assign({ action, area }, payload)
      ).then(function(response) {
        if (!response || !response.ok) {
          throw new Error(response && response.error || action + " failed");
        }
        return response.data;
      });
    }
    function storageGet(area, keys) {
      return call("storageGet", area, { keys });
    }
    function storageSet(area, items) {
      return call("storageSet", area, { items });
    }
    function storageRemove(area, keys) {
      return call("storageRemove", area, { keys });
    }
    const storage2 = {
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
    getSeiPro().core.storage = storage2;
    return storage2;
  }

  // src/platform/net.js
  function installNet() {
    function fetchRequest(url, options) {
      return getSeiPro().core.messaging.sendMessage({
        action: "fetch",
        url,
        options: options || {}
      }).then(function(response) {
        if (!response || typeof response.status === "undefined") {
          throw new Error(response && response.error || "fetch failed");
        }
        return response;
      });
    }
    const net = { fetch: fetchRequest };
    getSeiPro().core.net = net;
    return net;
  }

  // src/platform/logger.js
  function installLogger() {
    function isDebugEnabled() {
      if (typeof globalRef.verifyConfigValue === "function") {
        return globalRef.verifyConfigValue("debugpage") === true;
      }
      return false;
    }
    function debug() {
      if (isDebugEnabled()) console.log.apply(console, arguments);
    }
    function warn() {
      console.warn.apply(console, arguments);
    }
    function error() {
      console.error.apply(console, arguments);
    }
    const logger = { isDebugEnabled, debug, warn, error };
    getSeiPro().core.logger = logger;
    return logger;
  }

  // src/platform/report.js
  var LOG_STORAGE_KEY = "__sei_pro_report_logs__";
  var LOG_MAX_ENTRIES = 200;
  var LOG_MAX_CHARS = 6e4;
  var AUTO_REPORT_STATE_KEY = "__sei_pro_auto_report_state__";
  var AUTO_REPORT_MAX_PER_SESSION = 10;
  var AUTO_REPORT_DEBOUNCE_MS = 1500;
  var APPS_SCRIPT_URL_FALLBACK = "https://script.google.com/macros/s/AKfycby8ZZuKIHICpWYxEualArOnC1CIotYWXQvLNhe6eeoR-pQd1EOPNXjxt9UQ1XqJERxH/exec";
  var PRF_SEI_HOSTNAME = "sei.prf.gov.br";
  function installReport() {
    const win = globalRef;
    function isSEIProPRFHost() {
      return typeof win !== "undefined" && win.location && win.location.hostname === PRF_SEI_HOSTNAME;
    }
    function getSharedLogBuffer() {
      try {
        const raw = win.sessionStorage.getItem(LOG_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    function setSharedLogBuffer(logs) {
      try {
        win.sessionStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(logs));
      } catch (e) {
      }
    }
    function trimLogs(logs) {
      if (!Array.isArray(logs)) return [];
      let compact = logs.map((e) => String(e || "").trim()).filter((e) => e !== "");
      if (compact.length > LOG_MAX_ENTRIES) compact = compact.slice(compact.length - LOG_MAX_ENTRIES);
      let totalChars = 0;
      const trimmed = [];
      for (let i = compact.length - 1; i >= 0; i--) {
        let entry = compact[i];
        if (!entry) continue;
        if (!trimmed.length && entry.length > LOG_MAX_CHARS) entry = entry.slice(entry.length - LOG_MAX_CHARS);
        if (totalChars + entry.length > LOG_MAX_CHARS && trimmed.length) break;
        totalChars += entry.length;
        trimmed.unshift(entry);
      }
      return trimmed;
    }
    function normalizeLogValue(value, seen, depth) {
      if (value === null || typeof value === "undefined") return value;
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
      if (typeof value === "bigint") return value.toString();
      if (typeof value === "function") return "[Function " + (value.name || "anonymous") + "]";
      if (depth > 3) return "[Max depth]";
      if (value && typeof value === "object") {
        if (seen.indexOf(value) !== -1) return "[Circular]";
        seen.push(value);
        if (value instanceof Date) {
          seen.pop();
          return value.toISOString();
        }
        if (value instanceof RegExp) {
          seen.pop();
          return value.toString();
        }
        if (value.jquery) {
          const jqSummary = { jquery: true, length: value.length };
          if (value.selector) jqSummary.selector = value.selector;
          seen.pop();
          return jqSummary;
        }
        if (value.nodeType === 1 && value.tagName) {
          let attrs = value.id ? "#" + value.id : "";
          if (value.className && typeof value.className === "string") {
            attrs += "." + value.className.trim().replace(/\s+/g, ".");
          }
          seen.pop();
          return "<" + value.tagName.toLowerCase() + attrs + ">";
        }
        if (value.name && value.message && (value.stack || value.description)) {
          const err = { name: value.name, message: value.message };
          if (value.stack) err.stack = value.stack;
          if (value.description) err.description = value.description;
          seen.pop();
          return err;
        }
        if (Array.isArray(value)) {
          const arr = value.map((item) => normalizeLogValue(item, seen, depth + 1));
          seen.pop();
          return arr;
        }
        const clone = {};
        for (const key in value) {
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            clone[key] = normalizeLogValue(value[key], seen, depth + 1);
          }
        }
        seen.pop();
        return clone;
      }
      try {
        return String(value);
      } catch (e) {
        return "[Unserializable]";
      }
    }
    function stringifyLogValue(value) {
      if (typeof value === "string") return value;
      try {
        const normalized = normalizeLogValue(value, [], 0);
        return typeof normalized === "string" ? normalized : JSON.stringify(normalized);
      } catch (e) {
        try {
          return String(value);
        } catch (err) {
          return "[Unserializable]";
        }
      }
    }
    function pushLog(level, argsLike) {
      const args = Array.prototype.slice.call(argsLike || []);
      const timestamp = (/* @__PURE__ */ new Date()).toISOString();
      const label = String(level || "log").toUpperCase();
      const body = args.map(stringifyLogValue).join(" ");
      const entry = "[" + timestamp + "] [" + label + "]" + (body ? " " + body : "");
      const localLogs = Array.isArray(win.__SEI_PRO_LOG_BUFFER__) ? win.__SEI_PRO_LOG_BUFFER__ : [];
      localLogs.push(entry);
      win.__SEI_PRO_LOG_BUFFER__ = trimLogs(localLogs);
      const sharedLogs = getSharedLogBuffer();
      sharedLogs.push(entry);
      setSharedLogBuffer(trimLogs(sharedLogs));
      return entry;
    }
    function getCollectedLogs() {
      const merged = trimLogs(getSharedLogBuffer().concat(
        Array.isArray(win.__SEI_PRO_LOG_BUFFER__) ? win.__SEI_PRO_LOG_BUFFER__ : []
      ));
      const seen = {};
      return merged.filter((entry) => {
        if (!entry || seen[entry]) return false;
        seen[entry] = true;
        return true;
      });
    }
    function getAppsScriptUrl() {
      return typeof win.SEI_PRO_APPS_SCRIPT_URL !== "undefined" && win.SEI_PRO_APPS_SCRIPT_URL ? win.SEI_PRO_APPS_SCRIPT_URL : APPS_SCRIPT_URL_FALLBACK;
    }
    function getAutoReportState() {
      try {
        const raw = win.sessionStorage.getItem(AUTO_REPORT_STATE_KEY);
        let parsed = raw ? JSON.parse(raw) : {};
        if (!parsed || typeof parsed !== "object") parsed = {};
        if (!parsed.sent || typeof parsed.sent !== "object") parsed.sent = {};
        if (typeof parsed.count !== "number") parsed.count = 0;
        return parsed;
      } catch (e) {
        return { count: 0, sent: {} };
      }
    }
    function setAutoReportState(state) {
      try {
        win.sessionStorage.setItem(AUTO_REPORT_STATE_KEY, JSON.stringify(state));
      } catch (e) {
      }
    }
    function getErrorSignature(textError) {
      const base = String(textError || "").replace(/^\[[^\]]+\]\s+\[[^\]]+\]\s*/, "").replace(/\s+/g, " ").trim().slice(0, 500);
      return [win.location.pathname || "", base].join(" :: ");
    }
    function buildBugPayload(param) {
      const options = param || {};
      const descricaoBase = options.descricao || "";
      const detalhes = [];
      const includeLogs = typeof options.includeLogs === "undefined" ? true : !!options.includeLogs;
      if (options.modo === "automatico") detalhes.push("Relat\xF3rio autom\xE1tico de erro do navegador.");
      if (options.origem) detalhes.push("Origem: " + options.origem);
      if (win.location && win.location.href) detalhes.push("P\xE1gina: " + win.location.href);
      return {
        tipo: options.tipo || "bug",
        versao: typeof win.VERSION_SPRO !== "undefined" ? win.VERSION_SPRO : "",
        descricao: [descricaoBase].concat(detalhes).filter((i) => i && i.trim() !== "").join("\n\n"),
        erro_tecnico: options.erro_tecnico || "",
        logs: includeLogs ? JSON.stringify(getCollectedLogs(), null, "	") : "",
        modo_envio: options.modo || "manual",
        origem_erro: options.origem || ""
      };
    }
    function sendBugPayload(payload, handlers) {
      const callbacks = handlers || {};
      const appsScriptUrl = getAppsScriptUrl();
      const fail = (m) => {
        if (typeof callbacks.onError === "function") callbacks.onError(m || "Erro ao enviar relat\xF3rio");
      };
      const success = () => {
        if (typeof callbacks.onSuccess === "function") callbacks.onSuccess();
      };
      if (!appsScriptUrl) {
        fail("URL do servidor n\xE3o configurada");
        return;
      }
      getSeiPro().core.messaging.sendMessage({ action: "enviarRelatorioBug", url: appsScriptUrl, payload }).then((response) => {
        if (response && response.ok) success();
        else fail(response && response.erro ? response.erro : "");
      }).catch(() => fail("Servi\xE7o de envio indispon\xEDvel"));
    }
    function scheduleAutomaticErrorReport(textError, origem) {
      if (!textError || win.__SEI_PRO_AUTO_REPORT_SENDING__) return;
      if (!getAppsScriptUrl()) return;
      const normalized = String(textError || "").trim();
      if (!normalized) return;
      if (/Relat[oó]rio enviado|Erro ao enviar relat[oó]rio|Falha ao enviar relat[oó]rio/i.test(normalized)) return;
      if (/Extension context (?:invalidated|was invalidated)|context invalidated/i.test(normalized)) return;
      const signature = getErrorSignature(normalized);
      const state = getAutoReportState();
      if (state.sent[signature]) return;
      if (state.count >= AUTO_REPORT_MAX_PER_SESSION) return;
      clearTimeout(win.__SEI_PRO_AUTO_REPORT_TIMER__);
      win.__SEI_PRO_AUTO_REPORT_TIMER__ = setTimeout(() => {
        const latestState = getAutoReportState();
        if (latestState.sent[signature] || latestState.count >= AUTO_REPORT_MAX_PER_SESSION) return;
        latestState.sent[signature] = true;
        latestState.count += 1;
        setAutoReportState(latestState);
        win.__SEI_PRO_AUTO_REPORT_SENDING__ = true;
        sendBugPayload(buildBugPayload({
          tipo: "bug",
          descricao: "Erro detectado automaticamente pela extens\xE3o.",
          erro_tecnico: normalized,
          modo: "automatico",
          origem: origem || "console.error",
          includeLogs: true
        }), {
          onSuccess: () => {
            win.__SEI_PRO_AUTO_REPORT_SENDING__ = false;
          },
          onError: () => {
            win.__SEI_PRO_AUTO_REPORT_SENDING__ = false;
          }
        });
      }, AUTO_REPORT_DEBOUNCE_MS);
    }
    function ensureLogCapture() {
      if (win.__SEI_PRO_LOG_CAPTURE_INSTALLED__) return;
      win.__SEI_PRO_LOG_CAPTURE_INSTALLED__ = true;
      const methods = ["log", "info", "warn", "error"];
      win.__SEI_PRO_LOG_ORIGINALS__ = win.__SEI_PRO_LOG_ORIGINALS__ || {};
      methods.forEach((method) => {
        const original = console && typeof console[method] === "function" ? console[method] : console && typeof console.log === "function" ? console.log : function() {
        };
        win.__SEI_PRO_LOG_ORIGINALS__[method] = original;
        console[method] = function() {
          const entry = pushLog(method, arguments);
          if (method === "error") scheduleAutomaticErrorReport(entry, "console.error");
          return original.apply(console, arguments);
        };
      });
      win.addEventListener("error", (event) => {
        const hasMessage = !!(event && event.message);
        const hasFilename = !!(event && event.filename);
        const hasError = !!(event && event.error);
        if (!hasMessage && !hasFilename && !hasError) {
          pushLog("error", ["Script error (cross-origin/opaco, sem stack disponivel)", "readyState=" + (document.readyState || "?")]);
          return;
        }
        const entry = pushLog("error", [
          hasMessage ? event.message : "Unhandled error",
          hasFilename ? "at " + event.filename + ":" + event.lineno + ":" + event.colno : "",
          hasError ? event.error : ""
        ]);
        scheduleAutomaticErrorReport(entry, "window.error");
      }, true);
      win.addEventListener("unhandledrejection", (event) => {
        const entry = pushLog("error", ["Unhandled promise rejection", event && typeof event.reason !== "undefined" ? event.reason : ""]);
        scheduleAutomaticErrorReport(entry, "unhandledrejection");
      }, true);
    }
    const report = {
      isSEIProPRFHost,
      getCollectedLogs,
      getAppsScriptUrl,
      getAutoReportState,
      buildBugPayload,
      sendBugPayload,
      scheduleAutomaticErrorReport,
      ensureLogCapture,
      pushLog
    };
    getSeiPro().core.report = report;
    aliasGlobal("isSEIProPRFHost", isSEIProPRFHost);
    aliasGlobal("getSEIProCollectedLogs", getCollectedLogs);
    aliasGlobal("getSEIProAppsScriptUrl", getAppsScriptUrl);
    aliasGlobal("getSEIProAutoReportState", getAutoReportState);
    aliasGlobal("buildSEIProBugPayload", buildBugPayload);
    aliasGlobal("sendSEIProBugPayload", sendBugPayload);
    aliasGlobal("scheduleSEIProAutomaticErrorReport", scheduleAutomaticErrorReport);
    aliasGlobal("ensureSEIProLogCapture", ensureLogCapture);
    aliasGlobal("pushSEIProLog", pushLog);
    if (win.addEventListener) ensureLogCapture();
    return report;
  }

  // src/platform/webstore.js
  function installWebstore() {
    const local = () => globalRef.localStorage;
    const session = () => globalRef.sessionStorage;
    function localStorageRestorePro(item) {
      return isJson(local().getItem(item)) ? JSON.parse(local().getItem(item)) : false;
    }
    function localStorageStorePro(item, result) {
      local().setItem(item, JSON.stringify(result));
    }
    function localStorageRemovePro(item) {
      local().removeItem(item);
    }
    function sessionStorageRestorePro(item) {
      return JSON.parse(session().getItem(item));
    }
    function debugLog() {
      const logger = getSeiPro().core.logger;
      if (logger && typeof logger.debug === "function") logger.debug.apply(logger, arguments);
    }
    function boundArrayForStorage(arr, maxEntries, maxChars) {
      let out = arr;
      if (out.length > maxEntries) out = out.slice(out.length - maxEntries);
      while (out.length > 1 && JSON.stringify(out).length > maxChars) {
        out = out.slice(1);
      }
      return out;
    }
    function sessionStorageStorePro(item, result) {
      try {
        session().setItem(item, JSON.stringify(result));
      } catch (e) {
        if (Array.isArray(result) && result.length > 1) {
          let trimmed = result;
          for (let attempt = 0; attempt < 16 && trimmed.length > 1; attempt++) {
            trimmed = trimmed.slice(Math.ceil(trimmed.length / 2));
            try {
              session().setItem(item, JSON.stringify(trimmed));
              debugLog('[SeiPro] sessionStorage: "' + item + '" excedeu a cota; entradas antigas podadas, mantidas ' + trimmed.length + ".");
              return;
            } catch (e2) {
            }
          }
        }
        debugLog('[SeiPro] sessionStorage: grava\xE7\xE3o de "' + item + '" descartada (cota cheia).');
      }
    }
    function sessionStorageStoreBoundedPro(item, result, options) {
      options = options || {};
      const maxEntries = options.maxEntries || 25;
      const maxChars = options.maxChars || 3e6;
      if (!Array.isArray(result)) {
        sessionStorageStorePro(item, result);
        return;
      }
      const bounded = boundArrayForStorage(result, maxEntries, maxChars);
      if (bounded.length < result.length) {
        debugLog('[SeiPro] sessionStorage: "' + item + '" limitado de ' + result.length + " para " + bounded.length + " entradas (cache proativo).");
      }
      sessionStorageStorePro(item, bounded);
    }
    function sessionStorageRemovePro(item) {
      session().removeItem(item);
    }
    function hybridStorageRestorePro(item) {
      if (localStorageRestorePro(item) !== null) return localStorageRestorePro(item);
      if (sessionStorageRestorePro(item) !== null) return sessionStorageRestorePro(item);
      return false;
    }
    function hybridStorageRemovePro(item) {
      if (localStorageRemovePro(item) !== null) return localStorageRemovePro(item);
      if (sessionStorageRemovePro(item) !== null) return sessionStorageRemovePro(item);
      return false;
    }
    function hybridStorageStorePro(item, result) {
      try {
        localStorageStorePro(item, result);
      } catch (e) {
        sessionStorageStorePro(item, result);
      }
      return true;
    }
    const webstore = {
      localStorageRestorePro,
      localStorageStorePro,
      localStorageRemovePro,
      sessionStorageRestorePro,
      sessionStorageStorePro,
      sessionStorageRemovePro,
      sessionStorageStoreBoundedPro,
      boundArrayForStorage,
      hybridStorageRestorePro,
      hybridStorageRemovePro,
      hybridStorageStorePro
    };
    getSeiPro().core.webstore = webstore;
    aliasGlobal("localStorageRestorePro", localStorageRestorePro);
    aliasGlobal("localStorageStorePro", localStorageStorePro);
    aliasGlobal("localStorageRemovePro", localStorageRemovePro);
    aliasGlobal("sessionStorageRestorePro", sessionStorageRestorePro);
    aliasGlobal("sessionStorageStorePro", sessionStorageStorePro);
    aliasGlobal("sessionStorageStoreBoundedPro", sessionStorageStoreBoundedPro);
    aliasGlobal("sessionStorageRemovePro", sessionStorageRemovePro);
    aliasGlobal("hybridStorageRestorePro", hybridStorageRestorePro);
    aliasGlobal("hybridStorageRemovePro", hybridStorageRemovePro);
    aliasGlobal("hybridStorageStorePro", hybridStorageStorePro);
    return webstore;
  }

  // src/core/options.js
  function installOptions() {
    function ws() {
      return getSeiPro().core.webstore;
    }
    function isEmptyObjectPro(obj) {
      for (var name in obj) return false;
      return true;
    }
    function verifyOptionsPro(item) {
      var option = ws().localStorageRestorePro("optionsPro");
      if (typeof option !== "undefined") {
        if (!isEmptyObjectPro(option) && typeof option[item] !== "undefined" && option[item] !== null) {
          return true;
        }
        return false;
      }
      return false;
    }
    function getOptionsPro(item) {
      updateOptionsPro(item);
      var option = ws().localStorageRestorePro("optionsPro");
      if (typeof option !== "undefined" && !isEmptyObjectPro(option) && typeof option[item] !== "undefined" && option[item] !== null) {
        return option[item];
      }
      return false;
    }
    function setOptionsPro(item, value) {
      var option = ws().localStorageRestorePro("optionsPro");
      if (typeof option !== "undefined") {
        if (isEmptyObjectPro(option)) {
          option = { [item]: value };
        } else {
          option[item] = value;
        }
        ws().localStorageStorePro("optionsPro", option);
        return true;
      }
      return false;
    }
    function removeOptionsPro(item) {
      var option = ws().localStorageRestorePro("optionsPro");
      if (typeof option !== "undefined" && !isEmptyObjectPro(option) && option[item] !== null) {
        delete option[item];
        ws().localStorageStorePro("optionsPro", option);
      }
      return true;
    }
    function updateOptionsPro(item) {
      var oldOption = ws().localStorageRestorePro(item);
      if (typeof oldOption !== "undefined" && oldOption !== null) {
        setOptionsPro(item, oldOption);
        ws().localStorageRemovePro(item);
      }
    }
    const options = { verifyOptionsPro, getOptionsPro, setOptionsPro, removeOptionsPro, updateOptionsPro };
    getSeiPro().core.options = options;
    aliasGlobal("verifyOptionsPro", verifyOptionsPro);
    aliasGlobal("getOptionsPro", getOptionsPro);
    aliasGlobal("setOptionsPro", setOptionsPro);
    aliasGlobal("removeOptionsPro", removeOptionsPro);
    aliasGlobal("updateOptionsPro", updateOptionsPro);
    return options;
  }

  // src/core/cookies.js
  function installCookies() {
    const doc = () => globalRef.document;
    function readCookiePro(name) {
      const nameEQ = name + "=";
      const ca = doc().cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }
    function createCookiePro(name, value, days) {
      let expires = "";
      if (days) {
        const date = /* @__PURE__ */ new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1e3);
        expires = "; expires=" + date.toGMTString();
      }
      if (typeof readCookiePro(name) !== "undefined" && days >= 0) eraseCookiePro(name);
      doc().cookie = name + "=" + value + expires + "; path=/";
    }
    function eraseCookiePro(name) {
      createCookiePro(name, "", -1);
    }
    const cookies = { readCookiePro, createCookiePro, eraseCookiePro };
    getSeiPro().core.cookies = cookies;
    aliasGlobal("readCookiePro", readCookiePro);
    aliasGlobal("createCookiePro", createCookiePro);
    aliasGlobal("eraseCookiePro", eraseCookiePro);
    return cookies;
  }

  // src/core/helpers.js
  function checkObjHasProperty(obj, key) {
    let ret = true;
    for (let i = 0; i < obj.length; i++) {
      if (typeof obj[i][key] === "undefined" || !obj[i].hasOwnProperty(key)) {
        ret = false;
        break;
      }
    }
    return ret;
  }
  function fixedEncodeURIComponent(str) {
    return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
      return "%" + c.charCodeAt(0).toString(16);
    });
  }
  function infraFormatarTamanhoBytes(numBytes) {
    let ret = null;
    if (numBytes > 1099511627776) ret = Math.round(numBytes / 1099511627776 * 100) / 100 + " Tb";
    else if (numBytes > 1073741824) ret = Math.round(numBytes / 1073741824 * 100) / 100 + " Gb";
    else if (numBytes > 1048576) ret = Math.round(numBytes / 1048576 * 100) / 100 + " Mb";
    else ret = Math.round(numBytes / 1024 * 100) / 100 + " Kb";
    return ret;
  }
  function prepCSVRow(arr, columnCount, initial) {
    let row = "";
    const delimeter = ";";
    const newLine = "\r\n";
    function splitArray(_arr, _count) {
      let splitted = [];
      const result = [];
      _arr.forEach(function(item, idx) {
        if ((idx + 1) % _count === 0) {
          splitted.push(item);
          result.push(splitted);
          splitted = [];
        } else {
          splitted.push(item);
        }
      });
      return result;
    }
    const plainArr = splitArray(arr, columnCount);
    plainArr.forEach(function(arrItem) {
      arrItem.forEach(function(item, idx) {
        row += item + (idx + 1 === arrItem.length ? "" : delimeter);
      });
      row += newLine;
    });
    return initial + row;
  }
  function removeDuplicatesArray(list, ref) {
    const result = [];
    (list || []).forEach(function(e) {
      if (!result.some(function(item) {
        return item[ref] === e[ref];
      })) result.push(e);
    });
    return result;
  }
  function trycatch(func, fail) {
    try {
      return func();
    } catch (e) {
      return fail;
    }
  }
  var ZERO_WIDTH_CODES = [8203, 8204, 8205, 8206, 8207, 65279];
  var ZERO_WIDTH_REGEX = new RegExp(
    "[" + ZERO_WIDTH_CODES.map(function(c) {
      return "\\u" + c.toString(16).padStart(4, "0");
    }).join("") + "]+",
    "g"
  );
  function zeroWidthTrim(stringToTrim) {
    return stringToTrim.replace(ZERO_WIDTH_REGEX, "");
  }
  function checkBrowser() {
    let browser = "";
    const c = navigator.userAgent.search("Chrome");
    const f = navigator.userAgent.search("Firefox");
    const m8 = navigator.userAgent.search("MSIE 8.0");
    const m9 = navigator.userAgent.search("MSIE 9.0");
    if (c > -1) browser = "Chrome";
    else if (f > -1) browser = "Firefox";
    else if (m9 > -1) browser = "MSIE 9.0";
    else if (m8 > -1) browser = "MSIE 8.0";
    return browser;
  }
  function installHelpers() {
    const helpers = {
      checkObjHasProperty,
      fixedEncodeURIComponent,
      infraFormatarTamanhoBytes,
      prepCSVRow,
      removeDuplicatesArray,
      trycatch,
      zeroWidthTrim,
      checkBrowser
    };
    getSeiPro().core.helpers = helpers;
    aliasGlobal("checkObjHasProperty", checkObjHasProperty);
    aliasGlobal("fixedEncodeURIComponent", fixedEncodeURIComponent);
    aliasGlobal("infraFormatarTamanhoBytes", infraFormatarTamanhoBytes);
    aliasGlobal("prepCSVRow", prepCSVRow);
    aliasGlobal("removeDuplicatesArray", removeDuplicatesArray);
    aliasGlobal("trycatch", trycatch);
    aliasGlobal("zeroWidthTrim", zeroWidthTrim);
    aliasGlobal("checkBrowser", checkBrowser);
    return helpers;
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
    function isLoginPageNewSei(href) {
      href = typeof href === "string" ? href : globalRef.location.href;
      return href.indexOf("sip/login.php") !== -1;
    }
    function isDocumentoAssinarPage(href) {
      href = typeof href === "string" ? href : globalRef.location.href;
      return href.indexOf("acao=documento_assinar") !== -1;
    }
    function getUrlAcaoPro(param) {
      const acaoPro = getSeiPro().core.util.getParamsUrlPro(globalRef.location.href).acao_pro;
      return typeof acaoPro !== "undefined" && acaoPro === param;
    }
    function getUrlHipoteseLegal(html) {
      const word = "hipotese_legal_select_nome_base_legal";
      const reg = new RegExp("'(.*?" + word + ".*?)'", "g");
      if (reg.test(html)) {
        let urlHipotese = html.match(reg);
        urlHipotese = urlHipotese && urlHipotese.length > 0 ? urlHipotese[0].split("'")[3].trim() : false;
        return urlHipotese;
      }
      return false;
    }
    const urls = { getParams, buildQuery, appendQuery, isAjaxRedirectAction, isLoginPageNewSei, isDocumentoAssinarPage, getUrlAcaoPro, getUrlHipoteseLegal };
    getSeiPro().sei.urls = urls;
    aliasGlobal("getParamsUrlPro", getSeiPro().core.util.getParamsUrlPro);
    aliasGlobal("isAjaxRedirectAction", isAjaxRedirectAction);
    aliasGlobal("isLoginPageNewSei", isLoginPageNewSei);
    aliasGlobal("isDocumentoAssinarPage", isDocumentoAssinarPage);
    aliasGlobal("getUrlAcaoPro", getUrlAcaoPro);
    aliasGlobal("getUrlHipoteseLegal", getUrlHipoteseLegal);
    return urls;
  }

  // src/sei/tooltip.js
  function decodeHtmlText(html) {
    const d = document.createElement("div");
    d.innerHTML = html;
    return d.textContent;
  }
  function installTooltip() {
    function extractTooltip(elem) {
      const decoded = decodeHtmlText(
        elem.replace("return infraTooltipMostrar(", "").replace(");", "").replace(",", " ").replace(/["']/g, "")
      );
      return extractOnlyAlphaNum(removeAcentos(decoded));
    }
    function extractTooltipToArray(elem) {
      let e = decodeHtmlText(elem);
      e = e.replace(/<[^>]*>?/gm, "");
      e = removeAcentos(e);
      e = e.replace("return infraTooltipMostrar(", "").replace(");", "").replace(/["']/g, '"');
      const array = e != "" && isJson("[" + e + "]") ? JSON.parse("[" + e + "]") : [];
      return array.length > 0 ? array : false;
    }
    const tooltip = { extractTooltip, extractTooltipToArray };
    getSeiPro().sei.tooltip = tooltip;
    aliasGlobal("extractTooltip", extractTooltip);
    aliasGlobal("extractTooltipToArray", extractTooltipToArray);
    return tooltip;
  }

  // src/shared/ui/prazo-preview.js
  function getDatesPreview(config, dateduepreview = false) {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
    var formatDate = "YYYY-MM-DD HH:mm:ss";
    var displayFormat = typeof config !== "undefined" && typeof config.displayformat !== "undefined" && config.displayformat !== null && config.displayformat ? config.displayformat : "DD/MM/YYYY";
    config.dateTo = typeof config.dateTo === "undefined" ? moment().format(formatDate) : config.dateTo;
    var resultDate = getDateSemantic2(config);
    var resultDateDate = resultDate.date != "" ? moment(resultDate.date, formatDate).format(displayFormat) : resultDate.date;
    var displayDueText = typeof config.displaydue_txt === "undefined" ? "Vencimento:" : config.displaydue_txt;
    var displayTipText = config.displaytip ? "<br>" + config.displaytip : "";
    var displayModeTip = config.displaydue ? "infraTooltipMostrar('Criado " + resultDate.dateref + " (" + resultDateDate + ") " + displayTipText + "', '" + displayDueText + " " + resultDate.duedate + "')" : "infraTooltipMostrar('" + displayDueText + " " + resultDate.duedate + " " + displayTipText + "', '" + resultDate.duecalcref + "')";
    displayModeTip = config.deliverydoc ? config.dateDue !== null ? "infraTooltipMostrar('Avalia\xE7\xE3o at\xE9 " + resultDate.duedate + " (" + resultDate.duecalcref + ") " + displayTipText + "', '" + displayDueText + " " + moment(resultDate.date, formatDate).format(displayFormat) + "')" : "infraTooltipMostrar('" + config.displaytip + "','" + displayDueText + " " + moment(resultDate.date, formatDate).format(displayFormat) + "')" : displayModeTip;
    var displayMode = config.displaydue ? resultDate.duecalcref : resultDate.dateref;
    var htmlDateDueBox = (config.duedate || config.duesetdate) && resultDate.duecalcref != "" && dateduepreview ? '<div class="infraTooltipPro" style="margin-top: 20px;"><strong>' + resultDate.duecalcref + "</strong>Vencimento em: " + resultDate.duedate + "</div>" : "";
    var htmlProgress = getProgressPreview(config);
    var backgroundDiv = (config.duedate || config.duesetdate) && resultDate.alertdate ? "urgenteBoxDisplay" : "";
    var iconDate = moment(config.date, formatDate).diff(moment(), "days") > 0 ? "far fa-clock" : "fas fa-history";
    iconDate = config.displayicon ? config.displayicon : iconDate;
    var iconDateColor = moment().format(formatDate) == config.dateDue ? "#ad0606" : "#4285f4";
    var iconDateClass = config.deliverydoc ? config.deliverydoc_style : "far fa-clock";
    iconDateClass = config.displayicon ? config.displayicon : iconDateClass;
    var tagName = getDateBoxState2(config, resultDate);
    var tagAction = typeof config.action !== "undefined" && config.action != "" ? config.action : "parent.filterTagView(this)";
    var htmlDateDue = config.duedate || config.duesetdate ? resultDate.alertdate ? '<span class="dateBoxIcon" onmouseover="return ' + displayModeTip + ';" onmouseout="return infraTooltipOcultar();"><i class="' + (config.displayicon ? config.displayicon : "fas fa-exclamation-triangle vermelhoColor") + '" style="padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' : '<span class="dateBoxIcon" onmouseover="return ' + displayModeTip + ';" onmouseout="return infraTooltipOcultar();">' + htmlProgress + '<i class="' + iconDateClass + '" style="color: ' + iconDateColor + '; padding-right: 3px; cursor: pointer; font-size: 12pt;"></i></span>' : '<i class="' + iconDate + '" style="color: #777; padding-right: 3px; font-size: 12pt;"></i>';
    return '<span class="dateboxDisplay tagTableText_' + tagName.value + " " + backgroundDiv + '" data-duesetdate="' + config.duesetdate + '" data-colortag="' + tagName.color + '" data-tagname="' + tagName.value + '" data-nametag="' + tagName.name + '" data-time-sorter="' + resultDate.date + '" data-type="date" onclick="' + tagAction + '">' + htmlDateDue + " " + displayMode + "</span>" + htmlDateDueBox;
  }
  function configDatesPreview() {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
    var config = getConfigDatesMonitorado();
    if (config.selectdoc) {
      configDatesSetUpdate();
    }
    config.dateTo = moment().format("YYYY-MM-DD");
    var htmlDatePreview = getDatesPreview(config, true);
    $("#dateboxPreview").show().html(htmlDatePreview);
  }
  function getProgressPreview(config) {
    const moment = globalRef.moment, $ = globalRef.$, getDateSemantic2 = globalRef.getDateSemantic, getDateBoxState2 = globalRef.getDateBoxState, getProgressPercent2 = globalRef.getProgressPercent, getConfigDatesMonitorado = globalRef.getConfigDatesMonitorado, configDatesSetUpdate = globalRef.configDatesSetUpdate;
    var htmlProgress;
    var _progress = getProgressPercent2(config);
    if (_progress.show) {
      var percentProgresso = _progress.percent;
      var colorProgresso = percentProgresso > 100 ? 'style="stroke: #ff010199;"' : config.deliverydoc ? 'style="stroke: #72a50a70;"' : "";
      htmlProgress = '<svg viewBox="0 0 36 36" class="circular-chart"><path ' + colorProgresso + ' class="circle" stroke-dasharray="' + percentProgresso + ', 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"></path></svg>';
    } else {
      htmlProgress = "";
    }
    return htmlProgress;
  }
  function installPrazoPreview() {
    const prazoPreview = { getDatesPreview, getProgressPreview, configDatesPreview };
    getSeiPro().shared = getSeiPro().shared || {};
    getSeiPro().shared.prazoPreview = prazoPreview;
    return prazoPreview;
  }

  // src/shared/ui/prazo-preview-legacy-api.js
  function installPrazoPreviewLegacyApi() {
    aliasGlobal("getDatesPreview", getDatesPreview);
    aliasGlobal("getProgressPreview", getProgressPreview);
    aliasGlobal("configDatesPreview", configDatesPreview);
  }

  // src/platform/legacy-inline-bridge.js
  var HANDLER_ATTRS = ["onclick", "onmouseover", "onmouseout", "onchange", "onfocus", "onblur", "ondblclick"];
  var CALL_RE = /^\s*([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*;?\s*$/;
  function parseArg(raw, el) {
    const a = raw.trim();
    if (a === "this") return { ok: true, value: el };
    if (a === "null") return { ok: true, value: null };
    if (a === "true") return { ok: true, value: true };
    if (a === "false") return { ok: true, value: false };
    if (/^-?\d+(\.\d+)?$/.test(a)) return { ok: true, value: Number(a) };
    const strMatch = a.match(/^'([^']*)'$/) || a.match(/^"([^"]*)"$/);
    if (strMatch) return { ok: true, value: strMatch[1] };
    return { ok: false };
  }
  function parseStrictCall(attrValue, el) {
    const m = CALL_RE.exec(attrValue || "");
    if (!m) return null;
    const fnName = m[1];
    const rawArgs = m[2].trim();
    if (rawArgs === "") return { fnName, args: [] };
    const parts = rawArgs.split(",");
    const args = [];
    for (let i = 0; i < parts.length; i++) {
      const parsed = parseArg(parts[i], el);
      if (!parsed.ok) return null;
      args.push(parsed.value);
    }
    return { fnName, args };
  }
  function findHandlerTarget(eventTarget, attr) {
    let node = eventTarget;
    while (node && node.nodeType === 1) {
      if (node.hasAttribute(attr)) return node;
      node = node.parentElement;
    }
    return null;
  }
  function eventTypeForAttr(attr) {
    return attr.slice(2);
  }
  function installLegacyInlineBridge(win) {
    const w = win || globalRef;
    if (!w.document || typeof w.document.addEventListener !== "function") return;
    if (w.__SEI_PRO_LEGACY_INLINE_BRIDGE__) return;
    w.__SEI_PRO_LEGACY_INLINE_BRIDGE__ = true;
    HANDLER_ATTRS.forEach(function(attr) {
      const type = eventTypeForAttr(attr);
      w.document.addEventListener(type, function(event) {
        const el = findHandlerTarget(event.target, attr);
        if (!el) return;
        const attrValue = el.getAttribute(attr);
        const parsed = parseStrictCall(attrValue, el);
        if (!parsed) return;
        const fn = w[parsed.fnName];
        if (typeof fn !== "function") return;
        el.removeAttribute(attr);
        Promise.resolve().then(function() {
          el.setAttribute(attr, attrValue);
        });
        if (type === "click") event.preventDefault();
        try {
          fn.apply(el, parsed.args);
        } catch (e) {
          console.error("[SEI Pro] legacy-inline-bridge: erro ao executar", parsed.fnName, e);
        }
      }, true);
    });
  }

  // src/core/stack.js
  function installCoreStack() {
    createNamespace();
    createRuntime();
    installUtil();
    installAsync();
    installBootstrap();
    installConfig();
    installValidacao();
    installTexto();
    installCor();
    installDatas();
    installFeriados();
    installNumeros();
    installSerial();
    installWebstore();
    installOptions();
    installCookies();
    installHelpers();
    installPrazos();
    installQuickFilter();
    installQuickFilterDom();
    installSticknote();
    installDocsLote();
    installUi();
    installMessaging();
    installStorage();
    installNet();
    installLogger();
    installReport();
    installVersion();
    installAdapter();
    installUrls();
    installTooltip();
    installPrazoPreview();
    installPrazoPreviewLegacyApi();
    installLegacyInlineBridge();
  }

  // src/dom/index.js
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  // src/features/external-config/index.js
  function sei() {
    return getSeiPro();
  }
  function storage() {
    return sei().core.storage;
  }
  function getManifest() {
    return sei().core.runtime.getManifestExtension();
  }
  function readDataValues() {
    return storage().getSync({ dataValues: "" }).then(function(items) {
      return items && items.dataValues ? JSON.parse(items.dataValues) : [];
    });
  }
  function writeDataValues(dataValues) {
    return storage().setSync({ dataValues: JSON.stringify(dataValues) }).then(function() {
      localStorage.setItem("configBasePro", JSON.stringify(dataValues));
    });
  }
  function setOptionsSEIPro(optionKey, optionValue) {
    return readDataValues().then(function(dataValues) {
      dataValues.forEach(function(entry) {
        if (typeof entry.configGeral === "undefined") return;
        var changed = false;
        entry.configGeral.forEach(function(cfg) {
          if (cfg.name === optionKey) {
            var v = optionValue;
            if (v === "true") v = true;
            if (v === "false") v = false;
            cfg.value = v;
            changed = true;
          }
        });
        if (!changed) entry.configGeral.push({ name: optionKey, value: optionValue });
      });
      if (dataValues.length > 0) return writeDataValues(dataValues);
    });
  }
  function redirectHome(newItem) {
    var menu = qs(sei().sei.adapter.isNewSEI() ? "#infraMenu" : "#main-menu");
    var a = menu && menu.querySelector('a[href*="controlador.php?acao=procedimento_controlar"]');
    var urlHome = a && a.getAttribute("href");
    if (urlHome) {
      setTimeout(function() {
        window.location.href = urlHome;
      }, 1500);
    }
  }
  function getOptionsSEIPro(data) {
    if (!data.type || data.type !== "NEW_BASE") return Promise.resolve();
    var newItem = data.newItem;
    return readDataValues().then(function(dataValues) {
      if (data.mode === "insert" || data.mode === "remove") {
        dataValues = dataValues.filter(function(entry) {
          return entry.baseTipo !== data.base;
        });
      }
      if (data.mode !== "remove") dataValues.push(newItem);
      return storage().setSync({ dataValues: JSON.stringify(dataValues) }).then(function() {
        if (data.alert) {
          alert(data.mode === "insert" ? "Configura\xE7\xF5es carregadas com sucesso!" : "Configura\xE7\xF5es removidas com sucesso!\n\n Recarregue a p\xE1gina.");
        }
        if (data.mode !== "remove") redirectHome(newItem);
      });
    });
  }
  function baseItem(base, param, manifest) {
    const common = { CLIENT_ID: "", API_KEY: "", spreadsheetId: "", URL_API: param.url || "", KEY_USER: param.token || "" };
    switch (base) {
      case "atividades":
        return {
          baseName: manifest.short_name,
          baseTipo: "atividades",
          conexaoTipo: param.token === "" ? "googleapi" : "api",
          ...common,
          CLIENT_ID: param.token === "" ? param.client_id : ""
        };
      case "openai":
        return { baseName: "Open AI (Chat GPT)", baseTipo: "openai", conexaoTipo: "api", ...common };
      case "gemini":
        return { baseName: "Gemini (Google)", baseTipo: "gemini", conexaoTipo: "api", ...common };
      case "projetos":
        return {
          baseName: param.base_name,
          baseTipo: "projetos",
          conexaoTipo: "sheets",
          CLIENT_ID: param.client_id,
          API_KEY: param.api_key,
          spreadsheetId: param.sheet_id,
          URL_API: "",
          KEY_USER: ""
        };
      default:
        return null;
    }
  }
  function observeAcaoPro() {
    var param = getParamsUrlPro(window.location.href);
    if (typeof param.acao_pro === "undefined") return;
    var manifest = getManifest();
    if (param.acao_pro === "set_database") {
      var base = param.base;
      var hasToken = typeof param.token !== "undefined" && typeof param.url !== "undefined";
      var hasClientId = typeof param.client_id !== "undefined";
      if (!hasToken && !(hasClientId && base === "projetos")) return;
      var item = baseItem(base, param, manifest);
      if (!item) return;
      var alertFlag = base === "atividades" ? param.token !== "" : true;
      return getOptionsSEIPro({ type: "NEW_BASE", mode: param.mode, base, alert: alertFlag, newItem: item });
    }
    if (param.acao_pro === "set_option" && typeof param.option_key !== "undefined" && typeof param.option_value !== "undefined") {
      return setOptionsSEIPro(param.option_key, param.option_value);
    }
  }
  function changeBasePro() {
    var param = getParamsUrlPro(window.location.href);
    if (param.acao_pro !== "change_database" || typeof param.url === "undefined" || param.base !== "atividades") return;
    var perfil = JSON.parse(localStorage.getItem("configBasePro_atividades") || "{}");
    return getOptionsSEIPro({
      type: "NEW_BASE",
      mode: "insert",
      base: "atividades",
      alert: false,
      newItem: {
        baseName: "Atividades",
        baseTipo: "atividades",
        conexaoTipo: "api",
        CLIENT_ID: "",
        API_KEY: "",
        spreadsheetId: "",
        URL_API: param.url,
        KEY_USER: perfil.KEY_USER
      }
    });
  }
  function installExternalConfig() {
    observeAcaoPro();
    changeBasePro();
    sei().core.bootstrap.getPathExtensionPro();
  }

  // src/entries/db.js
  installCoreStack();
  ready(installExternalConfig);
})();
